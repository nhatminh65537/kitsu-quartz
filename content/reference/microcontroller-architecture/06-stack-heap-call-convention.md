---
title: "06. Stack, Heap & Call Convention"
tags: [embedded, microcontroller, arm-cortex-m, lesson-06]
aliases: [Stack Heap, AAPCS, Call Convention ARM]
created: 2026-03-24
---

> **Prerequisites**: [[02-registers-execution-model|02. Registers & Execution Model]], [[05-flash-sram-startup|05. Flash, SRAM & Startup Code]]
> **Objectives**:
> - Nắm cơ chế stack trên Cortex-M: full-descending, frame layout, SP alignment
> - Phân biệt MSP và PSP trong ngữ cảnh RTOS và security
> - Hiểu AAPCS (ARM Architecture Procedure Call Standard): caller/callee-saved, argument passing, return value
> - Phân tích heap: sbrk, malloc internals, heap metadata
> - Nhận diện stack overflow, stack canary, heap overflow trên MCU
> - Đọc stack frame trong GDB để trace crash và khai thác

---

## Motivation

Stack và heap là hai vùng bộ nhớ động nhất trong firmware. Đây cũng là hai vùng bị tấn công nhiều nhất: stack overflow để kiểm soát PC, heap overflow để corrupt metadata hoặc function pointer. Trên MCU bare-metal, không có ASLR, không có NX mặc định (flash executable, SRAM thường executable) — attacker có địa chỉ cố định và có thể chạy code từ SRAM.

Nhưng trước khi tấn công, bạn phải hiểu chính xác stack frame trông như thế nào, convention nào compiler dùng, và tại sao một số offset lại là magic number.

---

## Stack — Full-Descending Model

> [!definition] Definition 6.1 — Full-Descending Stack
> ARM Cortex-M dùng **Full-Descending Stack**:
> - **Full**: SP trỏ đến byte **đã dùng cuối cùng** (vị trí TOP đang có data)
> - **Descending**: Stack tăng trưởng về phía **địa chỉ thấp hơn**
>
> ```
> Địa chỉ cao  0x20020000  ← _stack_top (MSP ban đầu)
>              0x2001FFFC  ← SP sau PUSH {R0} đầu tiên  [R0 được lưu tại đây]
>              0x2001FFF8  ← SP sau PUSH {R1}            [R1 tại đây]
>              ...
> Địa chỉ thấp 0x20000000  ← đáy — nếu SP xuống đến đây là stack overflow
> ```
>
> **PUSH** = `SP = SP - 4; *SP = Rn`
>
> **POP** = `Rn = *SP; SP = SP + 4`

**Stack alignment**: ARM yêu cầu SP phải **8-byte aligned** khi gọi qua ABI boundary (hàm C). Nếu không, undefined behavior — thường gây crash khó debug.

---

## AAPCS — ARM Architecture Procedure Call Standard

AAPCS định nghĩa convention để code từ nhiều nguồn (compiler, thư viện, assembly) giao tiếp đúng với nhau.

> [!definition] Definition 6.2 — AAPCS Register Roles
>
> | Register | Role | Caller-saved? | Ghi chú |
> |----------|------|--------------|---------|
> | R0 | Argument 1 / Return value 1 | Caller | Bị clobber sau lời gọi |
> | R1 | Argument 2 / Return value 2 | Caller | |
> | R2 | Argument 3 | Caller | |
> | R3 | Argument 4 | Caller | |
> | R4–R11 | General purpose | **Callee** | Hàm được gọi phải bảo toàn |
> | R12 (IP) | Intra-procedure scratch | Caller | Dùng nội bộ, linker veneer |
> | R13 (SP) | Stack Pointer | Callee | Phải restore trước return |
> | R14 (LR) | Link Register | Caller | Bị ghi đè bởi `BL` |
> | R15 (PC) | Program Counter | — | |

**Caller-saved vs Callee-saved**:

- **Caller-saved** (R0–R3, R12, LR): Nếu caller muốn giữ giá trị qua lời gọi hàm, caller phải tự push lên stack trước khi gọi.
- **Callee-saved** (R4–R11, SP): Hàm được gọi **phải** bảo toàn — push lên stack khi vào hàm, pop khi thoát.

**Ví dụ truyền argument và nhận return value**:

```c
/* C source */
int32_t multiply_add(int32_t a, int32_t b, int32_t c, int32_t d) {
    return a * b + c * d;
}

int32_t result = multiply_add(1, 2, 3, 4);
```

```asm
; Caller side — truyền 4 argument qua R0–R3
MOV   R0, #1          ; a = 1
MOV   R1, #2          ; b = 2
MOV   R2, #3          ; c = 3
MOV   R3, #4          ; d = 4
BL    multiply_add    ; Gọi hàm, LR = địa chỉ kế tiếp
; R0 = kết quả trả về

; Callee (multiply_add):
; R0 = a, R1 = b, R2 = c, R3 = d
; Không cần push/pop vì không dùng R4+ và không gọi hàm khác
MUL   R0, R0, R1      ; R0 = a * b
MUL   R2, R2, R3      ; R2 = c * d
ADD   R0, R0, R2      ; R0 = a*b + c*d  (return value trong R0)
BX    LR              ; Return
```

**Argument thứ 5 trở đi** → truyền qua stack:

```c
int sum6(int a, int b, int c, int d, int e, int f) {
    return a + b + c + d + e + f;
}
/* a–d: R0–R3 */
/* e, f: [SP], [SP+4] trước khi gọi */
```

---

## Stack Frame Layout

Khi hàm C được biên dịch với các local variable và gọi hàm khác, compiler tạo **stack frame** hoàn chỉnh:

```c
int compute(int x, int y) {
    int local_a = x + 1;
    int local_b = y * 2;
    return local_a + local_b;
}
```

```text
Stack trước khi vào compute():
            ┌─────────────────┐ ← SP (trỏ vào return address nếu được lưu)
            │     ...         │   (stack của caller)
            └─────────────────┘

Stack bên trong compute() (với prologue PUSH {R4, LR}):
            ┌─────────────────┐ ← SP_old (của caller)
SP+8 →      │   LR (saved)    │  +4 : return address → khi bị overwrite = control flow hijack
SP+4 →      │   R4 (saved)    │  +0
SP   →      │   local_b       │  -4  (sub SP, SP, #8 tạo space)
SP-4 →      │   local_a       │  -8
            └─────────────────┘
```

**Disassembly thực tế**:

```asm
08000100 <compute>:
 8000100: b510      push  {r4, lr}       ; Save R4 và LR — SP -= 8
 8000102: 4604      mov   r4, r0         ; R4 = x (cần dùng sau)
 8000104: b082      sub   sp, #8         ; Tạo space cho 2 local var
 8000106: 3001      adds  r0, #1         ; R0 = x + 1
 8000108: 9001      str   r0, [sp, #4]   ; local_a = x + 1
 800010a: 0049      lsls  r1, r1, #1     ; R1 = y * 2
 800010c: 9100      str   r1, [sp, #0]   ; local_b = y * 2
 800010e: 9800      ldr   r0, [sp, #0]   ; R0 = local_b
 8000110: 9901      ldr   r1, [sp, #4]   ; R1 = local_a
 8000112: 4408      add   r0, r1         ; R0 = local_a + local_b
 8000114: b002      add   sp, #8         ; Giải phóng local vars
 8000116: bd10      pop   {r4, pc}       ; Restore R4, return (PC = LR cũ)
```

> [!warning] Security Note — `pop {r4, pc}` là ROP Gadget
> Dòng cuối `pop {r4, pc}` load PC từ stack. Nếu attacker có thể ghi đè giá trị tại `[SP]` khi `pop` thực thi (thông qua stack overflow), họ kiểm soát hoàn toàn PC.
>
> Trên MCU không có ASLR, địa chỉ của gadget này **cố định** qua mọi lần boot. Đây là lý do ROP trên MCU dễ hơn nhiều so với trên Linux có ASLR.

---

## Stack Overflow — Detection và Exploitation

### Kịch bản Stack Overflow Điển hình

```c
void vulnerable(uint8_t *input, uint32_t len) {
    uint8_t buf[64];          /* Stack buffer */
    memcpy(buf, input, len);  /* Không kiểm tra len! */
    /* Nếu len > 64: ghi đè stack frame */
}
```

```text
Stack layout khi vào vulnerable():
┌──────────────────────────────────┐ ← SP_caller
│  LR (return address)             │ +72  ← target của overflow
│  R4, R5, ... (saved registers)   │ +68...
│  buf[63]                         │ +63
│  buf[0]                          │ +0   ← memcpy bắt đầu ghi tại đây
└──────────────────────────────────┘ ← SP (= SP_caller - 72)
```

Với `len = 76`, attacker ghi 64 byte `buf` + 8 byte saved registers + 4 byte LR → kiểm soát return address.

### Stack Canary

Kỹ thuật phổ biến để phát hiện overflow trước khi return:

```c
/* Compiler có thể tự động thêm (GCC -fstack-protector) */
void vulnerable_protected(uint8_t *input, uint32_t len) {
    uint32_t canary = __stack_chk_guard;  /* Giá trị bí mật, thường random */
    uint8_t buf[64];
    memcpy(buf, input, len);
    if (canary != __stack_chk_guard) {
        /* Canary bị overwrite → stack overflow detected */
        __stack_chk_fail();    /* Thường gây reset hoặc halt */
    }
}
```

> [!note] Canary trên MCU vs Linux
> Trên Linux, `__stack_chk_guard` được random hóa khi process start. Trên MCU bare-metal không có PRNG mạnh, một số implementation dùng giá trị **cố định** (`0xDEADBEEF` hoặc tương tự) → canary bypass trivial nếu attacker biết giá trị này từ firmware analysis.

### Stack Overflow Detection thủ công (Stack Painting)

```c
/* Điền stack với pattern đã biết khi khởi động */
#define STACK_FILL_PATTERN  0xDEADBEEF

void paint_stack(void) {
    extern uint32_t _stack_top, _ebss;
    volatile uint32_t *p = &_ebss;
    while (p < &_stack_top) {
        *p++ = STACK_FILL_PATTERN;
    }
}

/* Kiểm tra mức sử dụng stack tối đa */
uint32_t get_stack_highwater(void) {
    extern uint32_t _stack_top, _ebss;
    volatile uint32_t *p = &_ebss;
    uint32_t unused = 0;
    while (p < &_stack_top && *p == STACK_FILL_PATTERN) {
        unused++;
        p++;
    }
    return unused * 4;   /* Số byte chưa dùng */
}
```

---

## Heap — Quản lý Bộ nhớ Động

Trên MCU, heap thường được implement bởi **newlib** (thư viện C chuẩn cho embedded) hoặc thư viện nhỏ hơn như **dlmalloc**.

**sbrk() — Primitive cấp phát heap**:

```c
/* newlib dùng sbrk() để xin thêm memory từ OS (hoặc từ linker symbols) */
void *_sbrk(int incr) {
    extern uint8_t _heap_start;  /* Symbol từ linker script */
    static uint8_t *heap_end = NULL;

    if (heap_end == NULL) {
        heap_end = &_heap_start;
    }
    uint8_t *prev_end = heap_end;
    heap_end += incr;

    /* Kiểm tra collision với stack */
    if (heap_end > (uint8_t *)__get_MSP() - 256) {
        return (void *)-1;   /* Hết heap */
    }
    return (void *)prev_end;
}
```

**Heap metadata (malloc chunk)**:

```text
Heap chunk layout (dlmalloc):
┌────────────────────────────────────────┐
│  prev_size (4 byte) — size chunk trước │
│  size (4 byte) — size chunk này        │ ← bit 0: P (previous in use)
│  [user data — trả về cho caller]       │
│  ...                                   │
└────────────────────────────────────────┘

Chunk free:
┌────────────────────────────────────────┐
│  prev_size                             │
│  size | 0                              │
│  fd (forward pointer — next free)      │ ← nằm trong user data space
│  bk (backward pointer — prev free)     │
└────────────────────────────────────────┘
```

> [!warning] Security Note — Heap Overflow trên MCU
> Corrupt `fd`/`bk` pointer trong free chunk → khi `free()` hoặc `malloc()` xử lý chunk này, nó ghi giá trị attacker-controlled vào địa chỉ attacker-controlled (write-what-where). Trên MCU không ASLR, địa chỉ function pointer hoặc vector table là target cố định.
>
> Pattern tấn công phổ biến: overwrite con trỏ hàm trong struct → lần sau khi hàm được gọi qua con trỏ đó → arbitrary code execution.

---

## Phân tích Stack trong GDB

```gdb
# Xem stack frame hiện tại
(gdb) info frame

# Backtrace — xem call stack
(gdb) backtrace
# hoặc
(gdb) bt

# Xem n frame phía trên
(gdb) bt 5

# Dump stack từ SP hiện tại
(gdb) x/32wx $sp

# Xem local variables
(gdb) info locals

# Xem MSP và PSP
(gdb) p/x $msp
(gdb) p/x $psp

# Tính stack usage: MSP_initial - MSP_current
# _stack_top = 0x20020000 (ví dụ)
(gdb) p/u 0x20020000 - (uint32_t)$msp
```

**Backtrace khi crash (HardFault)**:

```gdb
# Khi MCU crash và vào HardFault_Handler, đọc stacked registers
# Hardware đã push {R0-R3, R12, LR, PC, xPSR} lên MSP hoặc PSP

# Xác định stack pointer tại thời điểm fault
(gdb) p/x $msp
$1 = 0x2001ff20

# Đọc stacked frame (8 words)
(gdb) x/8wx 0x2001ff20
0x2001ff20:  0xdeadbeef   <- R0
0x2001ff24:  0x00000001   <- R1
0x2001ff28:  0x00000002   <- R2
0x2001ff2c:  0x00000003   <- R3
0x2001ff30:  0x00000000   <- R12
0x2001ff34:  0x08001234   <- LR (return address)
0x2001ff38:  0x08000abc   <- PC (faulting address!)
0x2001ff3c:  0x01000000   <- xPSR

# Đọc fault status
(gdb) x/wx 0xE000ED28    # CFSR — cho biết loại fault
(gdb) x/wx 0xE000ED38    # BFAR — địa chỉ gây BusFault
(gdb) x/wx 0xE000ED34    # MMFAR — địa chỉ gây MemManage fault
```

---

## Summary

- Cortex-M dùng **Full-Descending Stack**: SP trỏ vào item cuối cùng, stack tăng về phía địa chỉ thấp.
- **AAPCS**: R0–R3 = argument 1–4 và return value; R4–R11 = callee-saved (hàm phải bảo toàn); R12, LR = caller-saved.
- Stack frame thông thường: `PUSH {R4..Rn, LR}` khi vào → local variables trên stack → `POP {R4..Rn, PC}` khi thoát.
- **`POP {Rn, PC}`** = ROP gadget điển hình trên MCU — kiểm soát PC nếu attacker overwrite stack.
- Stack overflow → ghi đè LR/PC → control flow hijack. Canary trên MCU có thể là giá trị cố định → bypass dễ.
- Heap chunk có metadata (size, fd, bk) — corrupt → write-what-where primitive.
- Trong GDB: `bt` để backtrace, `x/8wx $msp` để đọc exception frame sau HardFault, `x/wx 0xE000ED28` để đọc fault status.

---

## References

- ARM — *Procedure Call Standard for the Arm® Architecture* (AAPCS — IHI0042)
- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section B1.5.6 (Exception entry/exit)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 12 (OS Support)
- interrupt.memfault.com — *How to debug a HardFault on an ARM Cortex-M MCU*
- University of Maryland NICCS — *Embedded System Hacking and Security* (exploitation techniques ARM section)
- Newlib documentation — sbrk, malloc implementation
