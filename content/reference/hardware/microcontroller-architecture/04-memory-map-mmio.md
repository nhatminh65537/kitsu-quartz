---
title: "04. Memory Map & Memory-Mapped I/O"
tags: [embedded, microcontroller, arm-cortex-m, lesson-04]
aliases: [Memory Map, MMIO, Memory Mapped IO]
created: 2026-03-24
---

> **Prerequisites**: [[01-mcu-overview-cortex-m-family|01. MCU Overview & Cortex-M Family]], [[02-registers-execution-model|02. Registers & Execution Model]]
> **Objectives**:
> - Nắm toàn bộ 4GB address space của ARM Cortex-M và ý nghĩa từng vùng
> - Hiểu Memory-Mapped I/O (MMIO) — tại sao peripheral lại có địa chỉ giống RAM
> - Viết code truy cập peripheral register trực tiếp qua pointer (bare-metal)
> - Hiểu tại sao `volatile` bắt buộc với MMIO và hậu quả nếu thiếu
> - Nhận diện địa chỉ quan trọng: System Control Space, vector table, peripheral base

---

## Motivation

Một câu hỏi đơn giản: trên STM32, để bật LED trên pin PA5, bạn phải ghi giá trị vào thanh ghi `GPIOA->BSRR`. Nhưng `GPIOA` là gì? Nó là một struct pointer trỏ đến địa chỉ `0x40020000` — một con số cố định trong không gian địa chỉ. Ghi vào đó không phải là ghi vào RAM, mà là **ra lệnh cho hardware**.

Đây là **Memory-Mapped I/O**: thay vì dùng instruction đặc biệt như `IN`/`OUT` trên x86, ARM đặt tất cả hardware register vào chung một địa chỉ space với RAM và Flash. Một pointer, dù trỏ vào RAM, Flash, hay peripheral — đều dùng chung cú pháp `*ptr`. Đây là cách thiết kế đơn giản và powerful, nhưng cũng mở ra attack surface đặc biệt khi firmware không bảo vệ đúng.

---

## 4GB Address Space của Cortex-M

ARM Cortex-M định nghĩa một address space 32-bit — tức $2^{32} = 4$ GB — được chia thành các **vùng cố định** (architecturally defined regions):

> [!definition] Definition 4.1 — ARM Cortex-M Memory Map
>
> ```
> 0xFFFFFFFF ┬─────────────────────────────────────────┐
>            │  Vendor-specific (0xE0100000–0xFFFFFFFF) │  ~511 MB
> 0xE0100000 ├─────────────────────────────────────────┤
>            │  Private Peripheral Bus External          │  1 MB
> 0xE0040000 ├─────────────────────────────────────────┤
>            │  Private Peripheral Bus Internal          │  256 KB
>            │  (NVIC, SysTick, SCB, MPU, FPB, DWT...)  │
> 0xE0000000 ├─────────────────────────────────────────┤
>            │  External Device (0xA0000000–0xDFFFFFFF) │  1 GB
> 0xA0000000 ├─────────────────────────────────────────┤
>            │  External RAM (0x60000000–0x9FFFFFFF)    │  1 GB
> 0x60000000 ├─────────────────────────────────────────┤
>            │  Peripheral (0x40000000–0x5FFFFFFF)      │  512 MB
>            │  (GPIO, UART, SPI, I2C, DMA, ADC...)     │
> 0x40000000 ├─────────────────────────────────────────┤
>            │  SRAM (0x20000000–0x3FFFFFFF)            │  512 MB
>            │  (thực tế chip chỉ có vài trăm KB)       │
> 0x20000000 ├─────────────────────────────────────────┤
>            │  Code (0x00000000–0x1FFFFFFF)            │  512 MB
>            │  (Flash thường bắt đầu tại 0x08000000    │
>            │   hoặc 0x00000000 tùy boot mode)         │
> 0x00000000 └─────────────────────────────────────────┘
> ```

**Lưu ý quan trọng**: Đây là **kiến trúc định nghĩa** — silicon vendor (ST, NXP, Nordic...) quyết định đặt Flash, SRAM, peripheral của họ ở đâu trong các vùng này. STM32 dùng pattern phổ biến:

| Vùng | STM32F4 thực tế | Ghi chú |
|------|----------------|---------|
| Flash | `0x08000000` | 1 MB, read-only khi chạy (trừ khi tự write) |
| System Memory | `0x1FFF0000` | ROM bootloader của ST |
| SRAM1 | `0x20000000` | 112 KB |
| CCM RAM | `0x10000000` | 64 KB, chỉ CPU (không DMA) |
| APB1 Peripherals | `0x40000000` | TIM2-7, USART2-3, SPI2-3, I2C... |
| APB2 Peripherals | `0x40010000` | TIM1, USART1, SPI1, ADC1-3... |
| AHB1 Peripherals | `0x40020000` | GPIO, DMA, RCC... |
| AHB2 Peripherals | `0x50000000` | USB OTG FS... |
| System Control Space | `0xE000E000` | NVIC, SysTick, SCB, MPU |

---

## Memory-Mapped I/O (MMIO)

> [!definition] Definition 4.2 — Memory-Mapped I/O
> **MMIO** là kỹ thuật ánh xạ các thanh ghi điều khiển hardware (peripheral registers) vào không gian địa chỉ thống nhất. Khi CPU đọc/ghi địa chỉ trong vùng peripheral, tín hiệu được bus routing đến hardware tương ứng — **không phải RAM vật lý**.
>
> ```
> CPU ghi: STR R0, [R1]  với R1 = 0x40020018 (GPIOA_BSRR)
>          ↓
>     Bus Matrix nhận địa chỉ 0x40020018
>          ↓
>     Routing đến AHB1 → GPIOA peripheral block
>          ↓
>     GPIOA hardware đọc giá trị từ data bus
>          ↓
>     Thay đổi trạng thái chân GPIO ngay lập tức
> ```

Đây chính là lý do firmware có thể điều khiển hardware chỉ bằng con trỏ C thông thường:

```c
/* Định nghĩa trong CMSIS / STM32 header */
#define GPIOA_BASE    0x40020000UL
#define GPIOA_MODER   (*(volatile uint32_t *)(GPIOA_BASE + 0x00))
#define GPIOA_ODR     (*(volatile uint32_t *)(GPIOA_BASE + 0x14))
#define GPIOA_BSRR    (*(volatile uint32_t *)(GPIOA_BASE + 0x18))

/* Cấu hình PA5 làm output */
GPIOA_MODER &= ~(3U << (5 * 2));   /* Clear mode bits cho pin 5 */
GPIOA_MODER |=  (1U << (5 * 2));   /* Set mode = 01 (output) */

/* Bật LED (set bit 5 của BSRR) */
GPIOA_BSRR = (1U << 5);

/* Tắt LED (set bit 5+16 của BSRR) */
GPIOA_BSRR = (1U << (5 + 16));
```

---

## Tại sao `volatile` là Bắt buộc

> [!definition] Definition 4.3 — Từ khóa `volatile` trong C
> `volatile` báo compiler rằng biến này có thể thay đổi **bất kỳ lúc nào ngoài tầm kiểm soát của compiler** (ví dụ: hardware ghi vào, ISR thay đổi, DMA update). Compiler phải:
> - **Luôn đọc từ địa chỉ thực** thay vì cache trong register
> - **Luôn ghi ra địa chỉ thực** thay vì trì hoãn hoặc bỏ qua

**Hậu quả của việc thiếu `volatile`**:

```c
/* SAISAI — thiếu volatile */
#define UART_SR  (*(uint32_t *)(0x40011000 + 0x00))  /* Status register */
#define UART_DR  (*(uint32_t *)(0x40011000 + 0x04))  /* Data register */

/* Chờ UART sẵn sàng nhận */
while (!(UART_SR & (1 << 7))) { }  /* Bit TXE = 1 khi empty */
UART_DR = 'A';
```

Không có `volatile`, compiler có thể tối ưu hóa thành:
```asm
LDR  R0, [R1]        @ Đọc UART_SR một lần
TST  R0, #0x80       @ Test bit 7
BEQ  infinite_loop   @ Nếu = 0 thì loop mãi mãi (đọc R0 cũ!)
```

Thay vì đọc lại UART_SR trong mỗi vòng lặp, compiler cache giá trị trong register → loop không bao giờ thoát hoặc thoát sai.

**Đúng**:
```c
#define UART_SR  (*(volatile uint32_t *)(0x40011000 + 0x00))
#define UART_DR  (*(volatile uint32_t *)(0x40011000 + 0x04))

while (!(UART_SR & (1 << 7))) { }  /* Mỗi iteration đọc lại từ hardware */
UART_DR = 'A';
```

> [!warning] Security Note — `volatile` và Side-Channel
> Ngược lại, đôi khi developer **muốn** compiler optimize (xóa) một memory wipe vì nghĩ nó không cần thiết:
> ```c
> void clear_key(uint8_t *key, size_t len) {
>     memset(key, 0, len);  /* Compiler có thể xóa nếu key không dùng sau đó! */
> }
> ```
> Đây là lỗi bảo mật kinh điển. Đúng phải dùng `volatile` hoặc `memset_s` / `explicit_bzero`.

---

## System Control Space (SCS) — 0xE000E000

Đây là vùng địa chỉ quan trọng nhất từ góc độ bảo mật: chứa các register điều khiển core ARM.

> [!definition] Definition 4.4 — System Control Space (SCS)
>
> SCS nằm tại `0xE000E000`–`0xE000EFFF` (4 KB). Chỉ accessible ở **Privileged mode**.
>
> | Block | Base Address | Nội dung |
> |-------|-------------|---------|
> | SysTick | `0xE000E010` | Timer 24-bit system tick |
> | NVIC | `0xE000E100` | Interrupt enable/disable/priority |
> | SCB | `0xE000ED00` | System Control Block — CPUID, ICSR, VTOR, AIRCR, CCR, fault status |
> | MPU | `0xE000ED90` | Memory Protection Unit config |
> | FPU | `0xE000EF30` | Floating-Point Unit control (M4/M7) |

**Các register SCB quan trọng nhất**:

```c
/* Địa chỉ các SCB registers (từ CMSIS core_cm4.h) */
#define SCB_CPUID   (*(volatile uint32_t *)0xE000ED00)  /* CPU ID, revision */
#define SCB_ICSR    (*(volatile uint32_t *)0xE000ED04)  /* Interrupt Control & State */
#define SCB_VTOR    (*(volatile uint32_t *)0xE000ED08)  /* Vector Table Offset Register */
#define SCB_AIRCR   (*(volatile uint32_t *)0xE000ED0C)  /* Application Interrupt & Reset */
#define SCB_CCR     (*(volatile uint32_t *)0xE000ED14)  /* Config & Control Register */
#define SCB_SHCSR   (*(volatile uint32_t *)0xE000ED24)  /* System Handler Control & State */
#define SCB_CFSR    (*(volatile uint32_t *)0xE000ED28)  /* Configurable Fault Status */
#define SCB_HFSR    (*(volatile uint32_t *)0xE000ED2C)  /* HardFault Status */
#define SCB_MMFAR   (*(volatile uint32_t *)0xE000ED34)  /* MemManage Fault Address */
#define SCB_BFAR    (*(volatile uint32_t *)0xE000ED38)  /* BusFault Address */
```

**VTOR — Vector Table Offset Register** là đặc biệt quan trọng:

```c
/* Đọc địa chỉ vector table hiện tại */
uint32_t vtor = SCB_VTOR;

/* Relocate vector table sang RAM (bootloader thường làm điều này) */
SCB_VTOR = 0x20000000;   /* Giờ vector table nằm trong SRAM */
```

> [!warning] Security Note — VTOR Attack
> Nếu attacker có thể ghi vào `SCB_VTOR` (ví dụ qua arbitrary write vulnerability trong firmware), họ có thể chuyển hướng toàn bộ interrupt handler về địa chỉ attacker kiểm soát. Mỗi interrupt = một entry point mới.
>
> Ngược lại, khi phân tích firmware bị obfuscate: đọc `VTOR` trong GDB cho biết vector table đang ở đâu, từ đó tìm được tất cả ISR.

---

## Truy cập Register với CMSIS

Trong thực tế, hầu hết firmware không hardcode địa chỉ thủ công mà dùng **CMSIS** (Cortex Microcontroller Software Interface Standard) — một tập header file chuẩn của ARM.

```c
#include "stm32f4xx.h"   /* Include CMSIS + vendor-specific defines */

/*
 * CMSIS định nghĩa struct cho từng peripheral.
 * Ví dụ GPIO_TypeDef (từ stm32f4xx.h):
 *
 * typedef struct {
 *   volatile uint32_t MODER;   // 0x00 — Mode register
 *   volatile uint32_t OTYPER;  // 0x04 — Output type
 *   volatile uint32_t OSPEEDR; // 0x08 — Output speed
 *   volatile uint32_t PUPDR;   // 0x0C — Pull-up/down
 *   volatile uint32_t IDR;     // 0x10 — Input data (read-only)
 *   volatile uint32_t ODR;     // 0x14 — Output data
 *   volatile uint32_t BSRR;    // 0x18 — Bit set/reset
 *   volatile uint32_t LCKR;    // 0x1C — Lock register
 *   volatile uint32_t AFR[2];  // 0x20 — Alternate function
 * } GPIO_TypeDef;
 *
 * #define GPIOA  ((GPIO_TypeDef *) 0x40020000UL)
 */

/* Cấu hình PA5 output và bật LED */
GPIOA->MODER &= ~(GPIO_MODER_MODER5_Msk);
GPIOA->MODER |=  (0x1UL << GPIO_MODER_MODER5_Pos);
GPIOA->BSRR   =  (1UL << 5);
```

CMSIS đảm bảo mọi member của struct là `volatile` — đây là convention bắt buộc cho peripheral struct.

---

## Bit-Banding — Truy cập từng bit atomic

Cortex-M3/M4 có tính năng **Bit-Banding**: ánh xạ từng bit của vùng SRAM và Peripheral thành một **word riêng** trong Bit-Band Alias region, cho phép đọc/ghi từng bit bằng một instruction đơn (atomic, không cần read-modify-write).

> [!definition] Definition 4.5 — Bit-Band Regions
>
> | Region | Bit-Band Base | Alias Base | Size |
> |--------|--------------|-----------|------|
> | SRAM | `0x20000000` | `0x22000000` | 1 MB → 32 MB alias |
> | Peripheral | `0x40000000` | `0x42000000` | 1 MB → 32 MB alias |
>
> **Công thức**: Địa chỉ alias cho bit `n` của byte tại địa chỉ `addr`:
>
> $$\text{alias\_addr} = \text{alias\_base} + (\text{addr} - \text{bit\_band\_base}) \times 32 + n \times 4$$

```c
/* Ghi bit 5 của GPIOA_ODR = 1 (atomic, không cần disable interrupt) */
#define PERIPH_BB_BASE    0x42000000UL
#define GPIOA_ODR_ADDR    0x40020014UL   /* GPIOA base 0x40020000 + ODR offset 0x14 */
#define BIT_BAND_PERIPH(addr, bit) \
    (*(volatile uint32_t *)(PERIPH_BB_BASE + ((addr) - 0x40000000UL) * 32 + (bit) * 4))

/* Set PA5 high — atomic single write */
BIT_BAND_PERIPH(GPIOA_ODR_ADDR, 5) = 1;

/* Clear PA5 — atomic */
BIT_BAND_PERIPH(GPIOA_ODR_ADDR, 5) = 0;
```

> [!note] Bit-Banding và Security
> Bit-Banding chỉ có trên M3/M4 và là optional. Vì nó tạo ra một **vùng alias** rộng lớn (32 MB) cho 1 MB peripheral space, attacker có thể dùng nó để ghi vào bất kỳ peripheral bit nào nếu có arbitrary write — với ít điều kiện hơn (không cần đọc lại giá trị cũ).

---

## Ví dụ Tổng hợp — Bare-Metal UART từ địa chỉ thô

Đây là ví dụ minh họa cách truy cập UART trực tiếp mà không dùng HAL, chỉ dùng địa chỉ MMIO:

```c
#include <stdint.h>

/* USART1 base address (STM32F4, APB2) */
#define USART1_BASE   0x40011000UL

/* Register offsets (từ STM32F4 Reference Manual, Table 173) */
typedef struct {
    volatile uint32_t SR;    /* 0x00 — Status register */
    volatile uint32_t DR;    /* 0x04 — Data register */
    volatile uint32_t BRR;   /* 0x08 — Baud rate register */
    volatile uint32_t CR1;   /* 0x0C — Control register 1 */
    volatile uint32_t CR2;   /* 0x10 — Control register 2 */
    volatile uint32_t CR3;   /* 0x14 — Control register 3 */
    volatile uint32_t GTPR;  /* 0x18 — Guard time and prescaler */
} USART_TypeDef;

#define USART1  ((USART_TypeDef *)USART1_BASE)

/* Gửi một ký tự qua UART (polling mode) */
void uart_putchar(char c) {
    /* TXE bit (bit 7 của SR) = 1 khi Transmit Data Register empty */
    while (!(USART1->SR & (1U << 7))) { }
    USART1->DR = (uint32_t)c;
}

/* Đọc một ký tự từ UART (blocking) */
char uart_getchar(void) {
    /* RXNE bit (bit 5 của SR) = 1 khi có dữ liệu */
    while (!(USART1->SR & (1U << 5))) { }
    return (char)(USART1->DR & 0xFF);
}
```

---

## Công cụ — Xem Memory Map trong GDB

```gdb
# Xem toàn bộ memory map của target
(gdb) info mem

# Đọc giá trị peripheral register (ví dụ GPIOA MODER)
(gdb) x/wx 0x40020000

# Đọc nhiều registers liên tiếp
(gdb) x/9wx 0x40020000

# Đọc SCB registers
(gdb) x/wx 0xE000ED00    @ CPUID
(gdb) x/wx 0xE000ED08    @ VTOR — đang trỏ đến đâu?
(gdb) x/wx 0xE000ED28    @ CFSR — fault status (debug crash)
```

---

## Summary

- ARM Cortex-M có **4GB address space thống nhất** chia thành vùng Code, SRAM, Peripheral, System. Không có virtual memory.
- **MMIO**: peripheral registers ánh xạ vào địa chỉ cố định — ghi/đọc bằng pointer C thông thường.
- `volatile` là **bắt buộc** với mọi MMIO access — thiếu `volatile` dẫn đến compiler optimization loại bỏ hoặc cache lại hardware access.
- **SCS (0xE000E000)**: chứa NVIC, SCB, MPU — chỉ privileged access. Quan trọng nhất là `SCB_VTOR` (vector table location) và `SCB_CFSR` (fault status).
- **Bit-Banding** (M3/M4): atomic bit access qua alias region — tiện nhưng tạo thêm attack surface.
- Trong hardware hacking: đọc `VTOR`, `CFSR`, peripheral registers qua GDB/OpenOCD cung cấp rất nhiều thông tin về firmware và trạng thái hệ thống.

---

## References

- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section B3 (Memory Model)
- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 2 (Memory and bus architecture)
- ARM — *CMSIS Documentation* (arm-software.github.io/CMSIS_5)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 5 (Memory System)
- interrupt.memfault.com — *How to Write a Heap Overflow Exploit for ARM Cortex-M* (MMIO section)
