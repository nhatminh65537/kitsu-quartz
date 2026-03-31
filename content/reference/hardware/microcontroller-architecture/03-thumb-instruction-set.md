---
title: "03. Instruction Set — Thumb & Thumb-2"
tags: [embedded, microcontroller, arm-cortex-m, lesson-03]
aliases: [Thumb Instruction Set, Thumb-2, ARM Assembly MCU]
created: 2026-03-24
---

> **Prerequisites**: [[01-mcu-overview-cortex-m-family|01. MCU Overview & Cortex-M Family]], [[02-registers-execution-model|02. Registers & Execution Model]]
> **Objectives**:
> - Hiểu tại sao Cortex-M dùng Thumb/Thumb-2 thay vì ARM 32-bit
> - Phân loại và đọc được các nhóm instruction chính: data processing, memory, branch, system
> - Viết và hiểu inline Assembly trong C (bare-metal)
> - Disassemble firmware bằng `objdump` và GDB, nhận diện pattern phổ biến
> - Nhận diện các instruction quan trọng cho hardware hacking: `BX LR`, `SVC`, `MSR/MRS`, `LDM/STM`

---

## Motivation

Khi bạn dump firmware từ một MCU target và mở bằng Ghidra hoặc `objdump`, bạn sẽ thấy toàn bộ là **Thumb/Thumb-2 assembly**. Không phải ARM 32-bit quen thuộc. Nếu không hiểu Thumb encoding, bạn không thể đọc được firmware, không thể viết shellcode, không thể hiểu tại sao một exploit hoạt động hay không.

Thumb không phải là "ARM rút gọn" — đây là một ISA được thiết kế kỹ lưỡng với mục tiêu kép: **code density cao** (binary nhỏ hơn ARM 32-bit) và **hiệu năng tốt** (Thumb-2 thêm lại các instruction 32-bit quan trọng).

---

## Lịch sử: ARM → Thumb → Thumb-2

> [!definition] Definition 3.1 — Lịch sử Instruction Set
>
> **ARM state** (ARMv4 trở về trước): Tất cả instruction đều 32-bit. Hiệu năng cao nhưng code size lớn — vấn đề nghiêm trọng với MCU flash nhỏ.
>
> **Thumb state** (ARMv4T): Instruction 16-bit. Cùng chức năng nhưng code size giảm ~30%. Phải **switch mode** bằng `BX` instruction (bit 0 của địa chỉ = 1 → Thumb, = 0 → ARM).
>
> **Thumb-2** (ARMv7-M, Cortex-M3 trở lên): Hỗn hợp 16-bit và 32-bit trong **cùng một mode** — không cần switch. Bổ sung lại nhiều instruction quan trọng từ ARM (divide, saturate, bit manipulation).
>
> **Cortex-M chỉ có Thumb state** — không có ARM state. Cortex-M0/M0+ dùng Thumb (ARMv6-M subset), Cortex-M3/M4/M7/M33 dùng Thumb-2 (ARMv7-M / ARMv8-M).

### Encoding 16-bit vs 32-bit

Thumb-2 phân biệt instruction 16-bit và 32-bit bằng **2 bit đầu của halfword**:

```text
Halfword[15:11]:
  11101, 11110, 11111 → Instruction 32-bit (halfword đầu của 2-halfword sequence)
  Còn lại            → Instruction 16-bit
```

Điều này có nghĩa: disassembler phải decode từng halfword để biết instruction tiếp theo là 16-bit hay 32-bit — không thể chỉ đơn giản nhảy theo bội số 4 như ARM 32-bit.

---

## Nhóm Instruction Chính

### 1. Data Processing

Các instruction tính toán, đều hoạt động trên register:

```asm
@ Arithmetic
ADD  R0, R1, R2      @ R0 = R1 + R2
ADD  R0, R0, #5      @ R0 = R0 + 5   (immediate)
SUB  R0, R1, R2      @ R0 = R1 - R2
MUL  R0, R1, R2      @ R0 = R1 * R2  (lower 32-bit)
UDIV R0, R1, R2      @ R0 = R1 / R2  (unsigned) — Thumb-2 only, M3+
SDIV R0, R1, R2      @ R0 = R1 / R2  (signed)   — Thumb-2 only, M3+

@ Logical
AND  R0, R1, R2      @ R0 = R1 & R2
ORR  R0, R1, R2      @ R0 = R1 | R2
EOR  R0, R1, R2      @ R0 = R1 ^ R2
BIC  R0, R1, R2      @ R0 = R1 & ~R2  (Bit Clear)
MVN  R0, R1          @ R0 = ~R1       (Move NOT)

@ Shift
LSL  R0, R1, #3      @ R0 = R1 << 3  (Logical Shift Left)
LSR  R0, R1, #3      @ R0 = R1 >> 3  (Logical Shift Right, zero-fill)
ASR  R0, R1, #3      @ R0 = R1 >> 3  (Arithmetic Shift Right, sign-extend)
ROR  R0, R1, #3      @ R0 = R1 rotate right 3 bit

@ Compare (chỉ set flags, không lưu kết quả)
CMP  R0, R1          @ set flags theo (R0 - R1)
CMN  R0, R1          @ set flags theo (R0 + R1)
TST  R0, R1          @ set flags theo (R0 & R1)

@ Move
MOV  R0, R1          @ R0 = R1
MOV  R0, #42         @ R0 = 42
MOVW R0, #0x1234     @ R0[15:0] = 0x1234  (16-bit immediate, Thumb-2)
MOVT R0, #0x5678     @ R0[31:16] = 0x5678 (top halfword, Thumb-2)
@ Kết quả: R0 = 0x56781234
```

> [!note] MOVW + MOVT Pattern
> Vì instruction Thumb-2 có immediate tối đa 16-bit, để load địa chỉ 32-bit (ví dụ peripheral register address như `0x40020000`), compiler thường dùng cặp `MOVW` + `MOVT`. Khi đọc firmware disassembly, nhận diện pattern này giúp bạn biết code đang load địa chỉ gì.

### 2. Memory Access — Load / Store

ARM là kiến trúc **load/store**: không thể tính toán trực tiếp trên memory — phải load vào register, tính, rồi store lại.

```asm
@ Load (đọc từ memory vào register)
LDR  R0, [R1]        @ R0 = *R1           (load 32-bit word)
LDR  R0, [R1, #4]    @ R0 = *(R1 + 4)    (offset)
LDR  R0, [R1, R2]    @ R0 = *(R1 + R2)   (register offset)
LDR  R0, [R1, #4]!   @ R1 += 4; R0 = *R1 (pre-indexed, writeback)
LDR  R0, [R1], #4    @ R0 = *R1; R1 += 4 (post-indexed)

LDRH R0, [R1]        @ Load 16-bit halfword, zero-extend
LDRB R0, [R1]        @ Load 8-bit byte, zero-extend
LDRSH R0, [R1]       @ Load 16-bit halfword, sign-extend
LDRSB R0, [R1]       @ Load 8-bit byte, sign-extend

@ Store (ghi từ register ra memory)
STR  R0, [R1]        @ *R1 = R0
STR  R0, [R1, #8]    @ *(R1 + 8) = R0
STRH R0, [R1]        @ *(uint16_t*)R1 = R0  (lower 16-bit)
STRB R0, [R1]        @ *(uint8_t*)R1 = R0   (lower 8-bit)

@ Multiple register load/store — quan trọng cho stack!
LDM  R1, {R0, R2, R4}     @ Load R0, R2, R4 từ [R1], [R1+4], [R1+8]
STM  R1, {R0, R2, R4}     @ Store R0, R2, R4 vào [R1], [R1+4], [R1+8]
LDMIA R1!, {R0-R3}        @ Load R0-R3, R1 tăng dần (IA = Increment After)
STMDB SP!, {R4-R7, LR}    @ Push R4-R7 và LR lên stack (DB = Decrement Before)

@ Alias PUSH/POP (= STMDB SP! / LDMIA SP!)
PUSH {R4-R7, LR}     @ Lưu callee-saved registers + return address
POP  {R4-R7, PC}     @ Restore registers, nhảy về (PC = return address)
```

> [!warning] Hardware Hacking Note — LDM/STM và Stack Corruption
> `PUSH {R4-R7, LR}` và `POP {R4-R7, PC}` là cặp epilogue/prologue chuẩn của hàm C. Khi tìm **ROP gadgets** trong firmware, các chuỗi kết thúc bằng `POP {Rn, PC}` là gadget điều khiển PC — tương đương `ret` trên x86. Đây là cách tìm gadget khi viết ROP chain cho MCU.

### 3. Branch Instructions

```asm
@ Unconditional branch
B    label           @ PC = label (branch trong ±16MB, 32-bit form)
B.W  label           @ Thumb-2: branch với range rộng hơn

@ Branch with Link (gọi hàm)
BL   function        @ LR = PC + 4; PC = function

@ Branch and Exchange (branch + có thể đổi ARM/Thumb state)
BX   R0              @ PC = R0 (bit 0 = 1 → Thumb, = 0 → ARM)
BX   LR              @ Return từ hàm (LR chứa return address)
BLX  R0              @ LR = PC + 4; PC = R0 (và có thể đổi state)

@ Conditional branch (dựa trên flags trong APSR)
BEQ  label           @ Branch if Equal (Z=1)
BNE  label           @ Branch if Not Equal (Z=0)
BGT  label           @ Branch if Greater Than (signed)
BLT  label           @ Branch if Less Than (signed)
BHI  label           @ Branch if Higher (unsigned)
BLO  label           @ Branch if Lower (unsigned)
BCS  label           @ Branch if Carry Set
BMI  label           @ Branch if Minus (N=1)
```

> [!definition] Definition 3.2 — BX LR và Function Return
> Trên ARM Cortex-M, `BX LR` là cách return chuẩn khi hàm không dùng `POP {PC}`:
> - `LR` chứa địa chỉ caller (được set bởi `BL`)
> - `BX LR` nhảy về địa chỉ đó
> - Nếu LR bị corrupt (stack overflow, heap overflow), `BX LR` sẽ nhảy đến địa chỉ attacker kiểm soát

### 4. System Instructions

```asm
@ Exception / Interrupt control
SVC  #0              @ SuperVisor Call — trigger SVC exception (syscall MCU)
BKPT #0              @ Breakpoint — trigger DebugMonitor exception hoặc halt nếu debugger attached

@ Memory barrier (quan trọng cho MMIO và multi-core)
DSB                  @ Data Synchronization Barrier — chờ tất cả memory access hoàn thành
DMB                  @ Data Memory Barrier — chờ memory access trước barrier xong trước khi tiếp tục
ISB                  @ Instruction Synchronization Barrier — flush pipeline, bắt buộc sau MSR CONTROL

@ Special register access
MRS  R0, xPSR        @ Đọc xPSR vào R0
MRS  R0, CONTROL     @ Đọc CONTROL register
MSR  CONTROL, R0     @ Ghi R0 vào CONTROL
MRS  R0, PRIMASK     @ Đọc PRIMASK
MSR  PRIMASK, R0     @ Ghi PRIMASK (disable/enable interrupt)

@ Sleep
WFI                  @ Wait For Interrupt — vào sleep cho đến khi có interrupt
WFE                  @ Wait For Event

@ Hint
NOP                  @ No Operation
```

> [!warning] ISB sau MSR CONTROL — Bắt buộc
> Sau khi ghi `CONTROL` register (đổi privilege level hoặc stack pointer), **bắt buộc** có `ISB` để flush pipeline. Nếu thiếu, behavior là **unpredictable** theo ARM spec — pipeline có thể đang fetch instruction với permission cũ.

---

## Inline Assembly trong C

Trong firmware bare-metal, bạn thường cần viết một vài instruction Assembly trong C khi:
- Truy cập special registers (CONTROL, xPSR, PRIMASK)
- Dùng barrier instructions (DSB, ISB)
- Implement tight loop với timing chính xác

**Cú pháp GCC inline Assembly**:

```c
__asm volatile (
    "instruction1 \n"
    "instruction2 \n"
    : output_operands      /* : "=r"(var) — ghi kết quả vào biến C */
    : input_operands       /* : "r"(var)  — đọc giá trị từ biến C */
    : clobber_list         /* : "memory", "r0" — báo GCC register bị thay đổi */
);
```

**Ví dụ thực tế**:

```c
#include <stdint.h>

/* Disable interrupt toàn cục */
static inline void disable_irq(void) {
    __asm volatile ("CPSID I" ::: "memory");
}

/* Enable interrupt toàn cục */
static inline void enable_irq(void) {
    __asm volatile ("CPSIE I" ::: "memory");
}

/* Đọc Main Stack Pointer */
static inline uint32_t get_msp(void) {
    uint32_t result;
    __asm volatile ("MRS %0, MSP" : "=r" (result));
    return result;
}

/* Set Main Stack Pointer — dùng trong startup code */
static inline void set_msp(uint32_t val) {
    __asm volatile ("MSR MSP, %0" :: "r" (val) : "memory");
}

/* Data memory barrier — bắt buộc sau khi ghi peripheral register */
static inline void data_sync_barrier(void) {
    __asm volatile ("DSB" ::: "memory");
    __asm volatile ("ISB" ::: "memory");
}

/* Trigger software breakpoint — dùng để debug hoặc trong assert */
static inline void breakpoint(void) {
    __asm volatile ("BKPT #0");
}
```

> [!note] `volatile` và `"memory"` trong inline asm
> - `volatile`: Báo GCC đừng tối ưu hóa (không xóa) instruction này
> - `"memory"` trong clobber list: Báo GCC rằng instruction này có thể đọc/ghi memory bất kỳ → GCC phải flush register values ra memory trước khi chạy asm này, và không cache memory values sau đó

---

## Disassemble Firmware với objdump

Sau khi build firmware, bạn có file `.elf`. Dùng `arm-none-eabi-objdump` để disassemble:

```bash
# Disassemble toàn bộ sections
arm-none-eabi-objdump -d firmware.elf

# Disassemble kèm source code (nếu có debug info)
arm-none-eabi-objdump -d -S firmware.elf

# Chỉ disassemble section .text
arm-none-eabi-objdump -d --section=.text firmware.elf

# Xem symbol table (tên hàm và địa chỉ)
arm-none-eabi-objdump -t firmware.elf | sort

# Xem section headers (phân tích layout firmware)
arm-none-eabi-objdump -h firmware.elf
```

**Ví dụ output disassembly của hàm C đơn giản**:

```c
/* Source C */
int add(int a, int b) {
    return a + b;
}
```

```asm
08000210 <add>:
 8000210:  4408        add r0, r1       @ R0 = R0 + R1 (a + b, kết quả trả về qua R0)
 8000212:  4770        bx  lr           @ Return
```

**Ví dụ hàm phức tạp hơn — loop**:

```c
uint32_t sum_array(uint32_t *arr, uint32_t len) {
    uint32_t s = 0;
    for (uint32_t i = 0; i < len; i++) {
        s += arr[i];
    }
    return s;
}
```

```asm
08000220 <sum_array>:
 8000220:  b510        push {r4, lr}      @ Lưu R4 và LR (hàm dùng R4 — callee-saved)
 8000222:  2200        movs r2, #0        @ r2 = 0 (i = 0)
 8000224:  2300        movs r3, #0        @ r3 = 0 (s = 0)
 8000226:  4293        cmp  r2, r1        @ so sánh i với len
 8000228:  d202        bcs.n 8000230      @ if i >= len: nhảy ra (unsigned >=)
 800022a:  f850 4022   ldr  r4, [r0, r2, lsl #2]  @ r4 = arr[i]  (r0 + i*4)
 800022e:  4423        add  r3, r4        @ s += arr[i]
 8000230:  3201        adds r2, #1        @ i++
 8000232:  e7f8        b.n  8000226       @ jump back to loop condition
 8000234:  4618        mov  r0, r3        @ return s (đưa kết quả vào R0)
 8000236:  bd10        pop  {r4, pc}      @ Restore R4, return (PC = LR cũ)
```

> [!example] Example 3.3 — Nhận diện ROP Gadget trong Disassembly
> Dòng cuối `pop {r4, pc}` là **ROP gadget điển hình**: nếu attacker kiểm soát stack tại thời điểm này, họ có thể đặt giá trị tùy ý vào R4 và PC. Đây là cách tìm gadget dạng `pop {rX, pc}` trong firmware khi xây dựng ROP chain.

---

## Nhận diện Pattern Phổ biến trong Firmware

Khi reverse engineering firmware MCU, một số pattern cực kỳ phổ biến:

### Function prologue / epilogue

```asm
@ Prologue: lưu callee-saved registers và LR
PUSH {R4, R5, R6, R7, LR}

@ ... body ...

@ Epilogue: restore và return
POP  {R4, R5, R6, R7, PC}    @ PC = LR cũ → return
```

### Load địa chỉ peripheral 32-bit

```asm
@ Load 0x40020000 (GPIOA base) vào R0
MOVW R0, #0x0000
MOVT R0, #0x4002
@ Hoặc compiler dùng literal pool:
LDR  R0, =0x40020000     @ Pseudo-instruction, compiler tạo data pool
```

### Ghi/đọc peripheral register (MMIO)

```asm
@ Ghi giá trị 0xFF vào offset 0x18 của GPIOA (BSRR register)
LDR  R1, =0x40020000     @ R1 = GPIOA base
MOV  R2, #0xFF
STR  R2, [R1, #0x18]     @ GPIOA->BSRR = 0xFF
```

### Atomic read-modify-write (cẩn thận race condition)

```asm
LDR  R0, [R1]            @ Read
ORR  R0, R0, #(1 << 5)  @ Modify (set bit 5)
STR  R0, [R1]            @ Write  ← có thể bị interrupt ở đây!
```

> [!warning] Race Condition trong MMIO
> Sequence LDR → modify → STR không phải atomic. Nếu interrupt xảy ra giữa LDR và STR và interrupt handler cũng ghi cùng register đó, kết quả bị corrupt. ARM cung cấp `LDREX`/`STREX` (load/store exclusive) cho atomic operations — nhưng nhiều firmware không dùng đúng.

---

## Disassemble Raw Binary (không có .elf)

Khi dump firmware thô từ chip (không có symbol), cần disassemble raw binary:

```bash
# Dump firmware thô đã có (ví dụ từ OpenOCD), disassemble Thumb-2
arm-none-eabi-objdump \
    -b binary \
    -m armv7 \
    --disassembler-options=force-thumb \
    -D \
    --adjust-vma=0x08000000 \
    firmware.bin
```

Hoặc dùng Ghidra:
1. File → Import File → chọn firmware.bin
2. Language: `ARM:LE:32:Cortex`
3. Base address: `0x08000000` (với STM32 thường flash bắt đầu tại đây)
4. Analyze → tự động tìm function, xây symbol table

---

## Summary

- Cortex-M **chỉ chạy Thumb/Thumb-2** — không có ARM state. Thumb-2 là hỗn hợp 16-bit và 32-bit instruction trong cùng một mode.
- **Nhóm instruction**: Data processing (ADD/SUB/AND/LSL), Memory (LDR/STR/PUSH/POP), Branch (B/BL/BX/BLX), System (SVC/MRS/MSR/DSB/ISB).
- `BX LR` và `POP {Rn, PC}` là return mechanism — **ROP gadgets** quan trọng nhất khi exploit MCU firmware.
- **Inline Assembly** dùng `__asm volatile` trong GCC; luôn cần `ISB` sau `MSR CONTROL`.
- Phân tích firmware: `arm-none-eabi-objdump -d firmware.elf` cho .elf có symbol; raw binary cần chỉ định Thumb mode và base address.
- `MOVW` + `MOVT` là pattern load địa chỉ 32-bit; `LDR Rn, [Rm, #offset]` + `STR` là pattern MMIO access.

---

## References

- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section A4–A7 (Instruction Set)
- ARM — *Thumb-2 Supplement* (ARM DDI 0308)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 4
- University of Maryland NICCS — *Embedded System Hacking and Security* (evaluate assembly for exploits section)
- arm-none-eabi-objdump manpage
