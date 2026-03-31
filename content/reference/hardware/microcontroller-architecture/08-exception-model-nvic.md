---
title: "08. Exception Model & NVIC"
tags: [embedded, microcontroller, arm-cortex-m, lesson-08]
aliases: [Exception Model, NVIC, Interrupt Controller]
created: 2026-03-24
---

> **Prerequisites**: [[02-registers-execution-model|02. Registers & Execution Model]], [[05-flash-sram-startup|05. Flash, SRAM & Startup Code]]
> **Objectives**:
> - Nắm toàn bộ exception model: 16 system exceptions + 240 external IRQ
> - Hiểu priority scheme: preemption, subpriority, priority grouping
> - Cấu hình NVIC: enable/disable/set priority/pend/clear bằng CMSIS và bare register
> - Hiểu tail-chaining và late arrival — tối ưu latency của interrupt handling
> - Nhận diện các lỗi interrupt-related phổ biến trong firmware: priority inversion, race condition, re-entrant ISR

---

## Motivation

Mọi sự kiện bất đồng bộ trong hệ thống nhúng — timer tràn, UART nhận byte, DMA hoàn thành, lỗi phần cứng — đều đi qua **exception model** của ARM. NVIC là "bộ điều phối" quyết định exception nào được phục vụ trước, khi nào, và theo thứ tự nào. Hiểu NVIC là nền tảng để hiểu race condition trong firmware, tại sao một số ISR không được gọi đúng lúc, và làm thế nào attacker có thể lợi dụng timing của exception để khai thác hệ thống.

---

## Exception Model — Tổng quan

> [!definition] Definition 8.1 — Exception và Interrupt
> **Exception** là bất kỳ sự kiện nào làm thay đổi luồng thực thi thông thường của CPU. Trên Cortex-M có hai loại:
>
> - **System exceptions** (Exception #1–15): được định nghĩa cố định bởi ARM, xử lý các sự kiện của core
> - **External interrupts / IRQ** (Exception #16–255): do silicon vendor định nghĩa, kết nối với peripheral
>
> Tổng cộng tối đa 256 exception. Cortex-M4 thực tế hỗ trợ tới IRQ #239 (exception #255).

### Bảng System Exceptions

| Exception # | Tên | Priority | Mô tả |
|------------|-----|---------|-------|
| 1 | Reset | -3 (highest) | Power-on, software reset — không thể mask |
| 2 | NMI | -2 | Non-Maskable Interrupt — không thể disable |
| 3 | HardFault | -1 | Fallback cho mọi fault nếu handler chưa enable |
| 4 | MemManage | Configurable | MPU violation, null pointer dereference |
| 5 | BusFault | Configurable | Prefetch abort, data abort — địa chỉ không hợp lệ |
| 6 | UsageFault | Configurable | Undefined instruction, unaligned access, divide by zero |
| 7–10 | Reserved | — | — |
| 11 | SVCall | Configurable | `SVC` instruction — syscall interface |
| 12 | DebugMonitor | Configurable | Software debug breakpoint |
| 13 | Reserved | — | — |
| 14 | PendSV | Configurable | Pendable service call — RTOS context switch |
| 15 | SysTick | Configurable | System timer tick |
| 16–255 | IRQ0–IRQ239 | Configurable | Vendor-defined peripheral interrupts |

> [!note] Priority là số nguyên có dấu — càng thấp càng ưu tiên cao
> Reset = -3, NMI = -2, HardFault = -1 là priority **cố định** — không thể thay đổi. Mọi configurable exception có priority từ 0 đến 255 (hoặc ít bit hơn tùy implementation). **Priority 0 = cao nhất** trong configurable group.

---

## NVIC — Nested Vectored Interrupt Controller

NVIC nằm trong System Control Space, tightly coupled với Cortex-M core:

> [!definition] Definition 8.2 — NVIC Register Set
>
> | Register | Địa chỉ | Chức năng |
> |----------|---------|-----------|
> | `NVIC_ISER[n]` | `0xE000E100` | **Interrupt Set-Enable** — ghi 1 để enable IRQ |
> | `NVIC_ICER[n]` | `0xE000E180` | **Interrupt Clear-Enable** — ghi 1 để disable IRQ |
> | `NVIC_ISPR[n]` | `0xE000E200` | **Interrupt Set-Pending** — ghi 1 để set pending (phần mềm trigger) |
> | `NVIC_ICPR[n]` | `0xE000E280` | **Interrupt Clear-Pending** — xóa pending state |
> | `NVIC_IABR[n]` | `0xE000E300` | **Interrupt Active Bit** — read-only, bit=1 khi đang xử lý |
> | `NVIC_IPR[n]`  | `0xE000E400` | **Interrupt Priority** — 8-bit per IRQ (thường chỉ upper bits có nghĩa) |
>
> `[n]` = word index; mỗi word chứa 32 IRQ (cho ISER/ICER/ISPR/ICPR/IABR) hoặc 4 IRQ (cho IPR).

**Cấu hình NVIC bằng CMSIS API**:

```c
#include "core_cm4.h"

/* Enable USART1 IRQ (IRQ #37 trên STM32F4) */
NVIC_EnableIRQ(USART1_IRQn);

/* Set priority = 5 (0 = highest, 15 = lowest trên chip 4-bit priority) */
NVIC_SetPriority(USART1_IRQn, 5);

/* Disable interrupt */
NVIC_DisableIRQ(USART1_IRQn);

/* Software trigger interrupt */
NVIC_SetPendingIRQ(USART1_IRQn);

/* Kiểm tra interrupt đang active không */
uint32_t active = NVIC_GetActive(USART1_IRQn);
```

**Cấu hình bare register (không dùng CMSIS)**:

```c
/* Enable IRQ #37 = USART1 trên STM32F4
 * ISER[1] bit 5 = IRQ 37 (37 = 32 + 5, vậy word index=1, bit=5) */
NVIC->ISER[1] = (1U << (37 - 32));

/* Set priority cho IRQ 37
 * IPR[9] bits [15:8] = IRQ 37 (37/4 = 9, 37%4 = 1, shift = 1*8 = 8) */
NVIC->IP[37] = (5U << 4);   /* 4-bit priority field nằm ở upper nibble của byte */
```

---

## Priority Scheme

### Priority Bits và Priority Grouping

Cortex-M4 có thanh ghi priority 8-bit cho mỗi IRQ, nhưng phần cứng STM32 chỉ implement **4 bit có nghĩa** (upper 4 bit) — cho 16 mức priority (0–15).

> [!definition] Definition 8.3 — Priority Grouping (SCB_AIRCR)
> Priority byte được chia thành hai phần:
> - **Preemption priority** (Group priority): Quyết định interrupt nào có thể **preempt** (ngắt giữa chừng) interrupt khác
> - **Subpriority**: Khi hai interrupt cùng preemption priority đang pending, subpriority quyết định cái nào được serve trước (nhưng **không preempt** nhau)
>
> **Priority Grouping** (bits [10:8] của `SCB->AIRCR`) quyết định cách chia 4 bit:
>
> | PRIGROUP | Preempt bits | Sub bits | Preempt levels | Sub levels |
> |---------|------------|---------|---------------|-----------|
> | 0b011 (3) | 4 | 0 | 16 | 1 |
> | 0b100 (4) | 3 | 1 | 8 | 2 |
> | 0b101 (5) | 2 | 2 | 4 | 4 |
> | 0b110 (6) | 1 | 3 | 2 | 8 |
> | 0b111 (7) | 0 | 4 | 1 | 16 |

```c
/* Set priority grouping: 4 preempt bits, 0 sub bits (PRIGROUP=3) */
NVIC_SetPriorityGrouping(3);

/* Encode priority: preempt=5, sub=0 */
uint32_t encoded = NVIC_EncodePriority(3, 5, 0);
NVIC_SetPriority(USART1_IRQn, encoded);
```

### Preemption — Interrupt trong Interrupt

Nếu một IRQ có preemption priority **cao hơn** (số nhỏ hơn) IRQ đang được xử lý, nó có thể **preempt** — ngắt giữa chừng ISR đang chạy:

```text
Thời gian →

Main:    ████████░░░░░░░░░░░░░░░░████████
IRQ A (pri=5):    ████████░░░████████
IRQ B (pri=2):           ████████
                         ↑ B preempt A (B có priority cao hơn)

░ = interrupt đang xử lý   █ = đang chạy
```

> [!warning] Priority Inversion — Lỗi Firmware Phổ biến
> **Priority inversion**: Task high-priority bị block chờ resource (mutex) đang giữ bởi task low-priority. Nếu có task medium-priority liên tục chạy, task high-priority có thể bị starve.
>
> Trên MCU không có RTOS mutex-aware scheduler, priority inversion thường xảy ra ở ISR level: ISR priority cao cần data từ ISR priority thấp hơn, nhưng data không được update vì ISR thấp không được preempt ISR cao.

---

## Tail-Chaining và Late Arrival

Đây là hai tối ưu phần cứng của NVIC giảm interrupt latency:

> [!definition] Definition 8.4 — Tail-Chaining
> Khi một ISR đang xử lý xong và có IRQ khác đang pending, thay vì **unstacking** (POP) rồi **stacking** lại (PUSH), CPU **nhảy thẳng** sang ISR kế tiếp mà không cần push/pop stack frame trung gian.
>
> ```text
> Không có tail-chaining:
> ISR_A: ... → UNSTACKING (8 cycle) → STACKING (8 cycle) → ISR_B: ...
>
> Với tail-chaining:
> ISR_A: ... → FETCH VECTOR (6 cycle) → ISR_B: ...
> ```
> Tiết kiệm 10+ cycle mỗi lần chuyển ISR.

> [!definition] Definition 8.5 — Late Arrival
> Nếu trong khi CPU đang **stacking** (push registers khi vào exception), một exception **priority cao hơn** xảy ra, CPU **không dừng stacking** mà sau khi stacking xong, nó **fetch vector** của exception mới thay vì exception cũ.
>
> Stacking chỉ xảy ra một lần, nhưng phục vụ exception ưu tiên cao hơn trước.

---

## ISR — Interrupt Service Routine

Trên Cortex-M, ISR là hàm C thông thường — không cần keyword đặc biệt (khác với AVR cần `ISR()` macro):

```c
/* ISR cho USART1 — tên phải khớp với vector table */
void USART1_IRQHandler(void) {
    uint32_t sr = USART1->SR;   /* Đọc status register */

    if (sr & USART_SR_RXNE) {
        /* Byte nhận được */
        uint8_t byte = (uint8_t)(USART1->DR & 0xFF);
        /* Xử lý byte — KHÔNG được dùng blocking wait trong ISR! */
        ring_buffer_push(&rx_buf, byte);
    }

    if (sr & USART_SR_ORE) {
        /* Overrun error — đọc DR để clear flag */
        (void)USART1->DR;
    }
}
```

**Các quy tắc viết ISR tốt**:

```c
/* ĐÚNG: ISR ngắn gọn, không blocking */
void TIM2_IRQHandler(void) {
    TIM2->SR &= ~TIM_SR_UIF;     /* Clear interrupt flag — PHẢI làm đầu tiên */
    tick_count++;                 /* Tác vụ nhanh */
    /* Set flag để main loop xử lý phần nặng */
    if (tick_count % 1000 == 0) {
        request_slow_task = 1;
    }
}

/* SAI: ISR chờ đợi — có thể gây deadlock nếu resource bị giữ bởi main */
void BAD_IRQHandler(void) {
    TIM2->SR &= ~TIM_SR_UIF;
    while (!uart_ready) { }      /* NGUY HIỂM: có thể loop mãi */
    uart_send("tick\n");
}
```

---

## Fault Escalation — Khi Exception Gặp Exception

> [!definition] Definition 8.6 — Fault Escalation
> Khi một fault xảy ra **trong** fault handler (double fault), hoặc fault handler chưa được enable, ARM **escalate** lên HardFault:
>
> ```text
> MemManage fault trong main → MemManage_Handler() → OK
>
> MemManage fault trong MemManage_Handler() → HardFault (double fault)
>
> BusFault xảy ra khi MemManage handler chưa enable → HardFault
>
> Bất kỳ fault nào trong NMI/HardFault handler → LOCKUP (CPU dừng)
> ```

**Enable fault handlers** (mặc định chúng bị disabled, escalate thẳng lên HardFault):

```c
/* Enable MemManage, BusFault, UsageFault handlers */
SCB->SHCSR |= SCB_SHCSR_MEMFAULTENA_Msk
            | SCB_SHCSR_BUSFAULTENA_Msk
            | SCB_SHCSR_USGFAULTENA_Msk;

/* Enable divide-by-zero trap và unaligned access trap */
SCB->CCR |= SCB_CCR_DIV_0_TRP_Msk
          | SCB_CCR_UNALIGN_TRP_Msk;
```

> [!warning] Security Note — Fault Handler là Entry Point
> Khi attacker trigger fault có chủ đích (ví dụ: đọc địa chỉ unmapped để gây BusFault), họ biết trước CPU sẽ nhảy đến handler tương ứng. Nếu handler không được cấu hình, CPU nhảy đến HardFault_Handler.
>
> Nếu HardFault_Handler có lỗi (ví dụ gọi hàm qua con trỏ NULL), CPU có thể LOCKUP hoặc escalate không đúng. Một số DoS attack trên embedded systems khai thác điều này để brick thiết bị.

---

## Đọc trạng thái NVIC qua GDB

```gdb
# Kiểm tra IRQ nào đang enabled
(gdb) x/8wx 0xE000E100    # NVIC_ISER[0..7]

# Kiểm tra IRQ nào đang pending
(gdb) x/8wx 0xE000E200    # NVIC_ISPR[0..7]

# Kiểm tra IRQ nào đang active (đang được xử lý)
(gdb) x/8wx 0xE000E300    # NVIC_IABR[0..7]

# Xem priority của IRQ 37 (USART1 trên STM32F4)
(gdb) x/bx 0xE000E425     # NVIC_IPR[37] = base 0xE000E400 + 37

# Xem SHCSR — System Handler Control (fault handlers enable)
(gdb) x/wx 0xE000ED24

# Xem CFSR — Configurable Fault Status
(gdb) x/wx 0xE000ED28

# Trigger software interrupt trong GDB
(gdb) set *((volatile uint32_t *)0xE000E200) = (1 << 5)
# → Set IRQ 5 pending
```

---

## Summary

- Cortex-M có **16 system exceptions** (Reset, NMI, HardFault, MemManage, BusFault, UsageFault, SVCall, PendSV, SysTick) và tối đa 240 external IRQ.
- **Priority**: số càng nhỏ càng ưu tiên cao. Reset(-3), NMI(-2), HardFault(-1) cố định. Configurable exception dùng 4–8 bit priority.
- **Priority Grouping**: chia priority byte thành preemption priority (quyết định preempt) và subpriority (quyết định thứ tự khi cùng preempt level).
- **Tail-chaining**: chuyển ISR→ISR không cần push/pop stack trung gian (tiết kiệm ~10 cycle). **Late arrival**: trong khi stacking, exception ưu tiên cao hơn xảy ra → phục vụ cái mới trước.
- ISR phải ngắn, không blocking, và luôn clear interrupt flag đầu tiên.
- **Fault escalation**: fault trong fault handler → HardFault. Fault trong HardFault → LOCKUP.
- Fault handler mặc định **disabled** — phải enable qua `SCB->SHCSR`. Attacker có thể trigger fault có chủ đích để redirect execution về handler.

---

## References

- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section B3.4 (NVIC) và B1.5 (Exception Model)
- interrupt.memfault.com — *A Practical Guide to ARM Cortex-M Exception Handling*
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 8–9 (Exceptions, NVIC)
- embeddedsecurity.io — *Embedded Systems Security and TrustZone*, Section 3.6 (Interrupts)
- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 10 (NVIC)
