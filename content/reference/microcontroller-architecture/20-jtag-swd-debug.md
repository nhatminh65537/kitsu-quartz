---
title: "20. Debug Interfaces — JTAG & SWD"
tags: [embedded, microcontroller, arm-cortex-m, lesson-20]
aliases: [JTAG, SWD, Debug Interface, OpenOCD]
created: 2026-03-24
---

> **Prerequisites**: [[04-memory-map-mmio|04. Memory Map & Memory-Mapped I/O]], [[09-vector-table-isr|09. Vector Table & ISR Mechanics]]
> **Objectives**:
> - Phân biệt JTAG và SWD — pin count, protocol, use cases
> - Hiểu ARM CoreSight architecture: DAP, DP, AP, MEM-AP
> - Kết nối OpenOCD + GDB để debug và dump memory trên STM32
> - Thực hiện firmware dump, memory read/write, và flash programming qua SWD
> - Nhận diện cơ chế bảo vệ debug interface: RDP, JTAG lock, SWD disable

---

## Motivation

JTAG và SWD là "cửa hậu" được thiết kế có chủ đích vào chip — cho phép debug, lập trình, và truy cập trực tiếp vào memory. Nếu debug interface không bị disable trên production device, attacker chỉ cần 2 pin (SWD) để dump toàn bộ firmware, đọc secret key, inject code, hoặc patch firmware trong memory. Đây là attack vector số 1 trong hardware hacking sau UART console.

---

## JTAG vs SWD

> [!definition] Definition 20.1 — JTAG và SWD So sánh
>
> | | JTAG | SWD (Serial Wire Debug) |
> |--|------|------------------------|
> | Số pin | 4–5 (TDI, TDO, TMS, TCK, TRST) | 2 (SWDIO, SWCLK) |
> | Chuẩn | IEEE 1149.1 | ARM proprietary (ADIv5) |
> | Topology | Daisy-chain (scan chain) | Point-to-point |
> | Tốc độ | Chậm hơn | Nhanh hơn (1–10 MHz) |
> | Trace | Có (ETM/ETB via TDO) | Có (SWO pin riêng) |
> | MCU nhỏ | Không ideal (5 pin) | **Chuẩn cho Cortex-M** |
> | Availability | M0 thường không có | **Mọi Cortex-M** |
>
> **SWD là default** trên Cortex-M vì chỉ cần 2 pin và đủ tính năng cho debug thông thường.
>
> **Pinout SWD** (connector 10-pin ARM standard):
> ```text
> Pin 1: VCC       Pin 2: SWDIO (data, bidirectional)
> Pin 3: GND       Pin 4: SWCLK (clock, from debugger)
> Pin 5: GND       Pin 6: SWO   (optional: Serial Wire Output / trace)
> Pin 7: KEY (NC)  Pin 8: NC
> Pin 9: GND       Pin 10: nRESET
> ```

---

## ARM CoreSight Architecture

> [!definition] Definition 20.2 — CoreSight Debug Architecture
>
> ```text
> Debugger (PC)
>      │  USB/TCP
>      │
> OpenOCD (host software)
>      │  SWD/JTAG
>      │
> Probe (ST-Link, J-Link, CMSIS-DAP)
>      │  SWD: SWDIO + SWCLK
>      │
> ┌────┴──────────────────────────────────────────┐
> │  ARM CoreSight Debug Port (DP)                │
> │  ┌─────────────────────────────────────────┐  │
> │  │  SWJ-DP (SW/JTAG Debug Port)            │  │
> │  └───────────────────┬─────────────────────┘  │
> │                      │ DAP Bus (APB)           │
> │  ┌───────────────────┴──────────────────────┐  │
> │  │  AHB-AP (MEM-AP 0): truy cập AHB bus    │  │
> │  │  → Đọc/ghi bất kỳ địa chỉ trên AHB     │  │
> │  └──────────────────────────────────────────┘  │
> │                      │                         │
> │         ┌────────────┴──────────────┐          │
> │  AHB bus│                           │          │
> │  ┌──────┴──────┐          ┌─────────┴───────┐  │
> │  │ Cortex-M4  │          │   Flash, SRAM,  │  │
> │  │ Core + FPU │          │   Peripherals   │  │
> │  └────────────┘          └─────────────────┘  │
> └───────────────────────────────────────────────┘
> ```
>
> **MEM-AP** (Memory Access Port): cho phép debugger đọc/ghi **bất kỳ địa chỉ nào** trên AHB bus — bao gồm Flash, SRAM, peripheral registers, và System Control Space.

---

## OpenOCD — Kết nối và Cấu hình

OpenOCD (On-Chip Debugger) là phần mềm open-source kết nối debugger probe với target MCU và expose GDB server.

**Cài đặt**:

```bash
sudo apt install openocd        # Linux
brew install open-ocd           # macOS
```

**Config file cho STM32F4 + ST-Link**:

```tcl
# stm32f4.cfg
source [find interface/stlink.cfg]
transport select hla_swd

source [find target/stm32f4x.cfg]

# Optional: tốc độ adapter (Hz)
adapter speed 4000
```

**Chạy OpenOCD**:

```bash
openocd -f stm32f4.cfg
# Output:
# Info : STLINK V2J35S7
# Info : stm32f4x.cpu: hardware has 6 breakpoints, 4 watchpoints
# Info : Listening on port 3333 for gdb connections
# Info : Listening on port 4444 for telnet connections
```

**Kết nối GDB**:

```bash
arm-none-eabi-gdb firmware.elf

(gdb) target remote :3333
(gdb) monitor reset halt      # Reset và halt tại reset vector
(gdb) load                    # Flash firmware vào chip
(gdb) continue                # Tiếp tục chạy
```

---

## Dump Firmware qua SWD + OpenOCD

```bash
# Phương pháp 1: Dùng OpenOCD telnet interface
telnet localhost 4444

> halt
> dump_image firmware_dump.bin 0x08000000 0x100000
> exit

# Phương pháp 2: GDB
(gdb) monitor halt
(gdb) dump binary memory firmware_dump.bin 0x08000000 0x08100000

# Phương pháp 3: OpenOCD script
openocd -f stm32f4.cfg \
        -c "init; halt; dump_image dump.bin 0x08000000 0x100000; shutdown"
```

**Phân tích firmware dump**:

```bash
# Kiểm tra file
file firmware_dump.bin
xxd firmware_dump.bin | head -8   # Xem magic bytes, vector table

# Tìm strings
strings firmware_dump.bin | grep -iE "pass|key|secret|token|wifi|ssid"

# Binwalk — tìm embedded filesystems, compressed data
binwalk firmware_dump.bin
binwalk -e firmware_dump.bin    # Extract

# Ghidra / radare2 để reverse engineering
r2 -a arm -b 16 firmware_dump.bin
```

---

## Memory Read/Write Runtime

Khi firmware đang chạy, debugger có thể đọc/ghi memory mà **không cần halt CPU**:

```bash
# OpenOCD: đọc register peripheral khi đang run (non-invasive)
> mdw 0x40020000     # Read GPIOA MODER (4 bytes)
0x40020000: 00000400

# Đọc SRAM — xem data đang xử lý
> mdw 0x20000000 32  # Dump 32 words từ đầu SRAM

# Ghi vào SRAM khi đang run
> mww 0x20000100 0xDEADBEEF   # Patch một biến trong RAM

# Đọc special registers
> reg pc              # Program Counter
> reg msp             # Main Stack Pointer
```

**GDB scripting — tự động hóa attack**:

```python
# gdb_script.py: dump toàn bộ SRAM và tìm key material
import subprocess, struct

# Kết nối qua GDB machine interface
proc = subprocess.Popen(
    ['arm-none-eabi-gdb', '-batch',
     '-ex', 'target remote :3333',
     '-ex', 'monitor halt',
     '-ex', 'dump binary memory /tmp/sram.bin 0x20000000 0x20020000',
     '-ex', 'monitor resume'],
    stdout=subprocess.PIPE, stderr=subprocess.PIPE
)
proc.wait()

# Scan SRAM cho AES key pattern (16 bytes non-zero, high entropy)
with open('/tmp/sram.bin', 'rb') as f:
    data = f.read()

for i in range(0, len(data) - 16, 4):
    chunk = data[i:i+16]
    if len(set(chunk)) > 10 and all(b != 0 for b in chunk):
        print(f"Possible key at SRAM+0x{i:04X}: {chunk.hex()}")
```

---

## Hardware Breakpoint và Watchpoint

```gdb
# Đặt hardware breakpoint tại địa chỉ (không cần modify flash)
(gdb) hbreak *0x08001234       # Break khi PC = 0x08001234
(gdb) hbreak crypto_encrypt    # Break tại function (cần symbol)

# Watchpoint: break khi memory được đọc/ghi
(gdb) watch *(uint32_t*)0x20001000   # Break khi ghi vào 0x20001000
(gdb) rwatch *(uint32_t*)0x20001000  # Break khi đọc
(gdb) awatch *(uint32_t*)0x20001000  # Break khi đọc hoặc ghi

# Cortex-M4 có 6 hardware breakpoints và 4 watchpoints
# (FPB — Flash Patch and Breakpoint unit)

# Commands hữu ích khi dừng tại breakpoint
(gdb) bt           # Backtrace
(gdb) x/20wx $sp   # Dump stack
(gdb) info reg     # Tất cả registers
(gdb) set $r0 = 1  # Patch register — thay đổi execution flow
```

---

## Cơ chế Bảo vệ Debug Interface

### Readout Protection (RDP) — STM32F4

> [!definition] Definition 20.3 — RDP Levels STM32F4
>
> | Level | Tên | Flash access | Debug access | Rollback |
> |-------|-----|-------------|--------------|---------|
> | 0 (0xAA) | Unprotected | Full | Full | Yes |
> | 1 (0xBB) | Read-protected | No JTAG/SWD read | Limited | To Level 0 (mass erase) |
> | 2 (0xCC) | Chip-protected | None | **None — permanent** | **Không thể** |
>
> **RDP Level 1** → mass erase toàn bộ flash trước khi cho debug access → firmware bị xóa.
>
> **RDP Level 2** → permanently disable debug interface. **Không thể reset về Level 1 hay 0.** Production device nên dùng Level 2.

**Set RDP bằng code** (thường trong bootloader hoặc factory provisioning):

```c
/* Set RDP Level 1 — cẩn thận: cần mass erase để quay về Level 0 */
void set_rdp_level1(void) {
    /* Unlock option bytes */
    FLASH->OPTKEYR = 0x08192A3BUL;
    FLASH->OPTKEYR = 0x4C5D6E7FUL;

    while (FLASH->SR & FLASH_SR_BSY) { }

    /* Đọc option bytes hiện tại */
    uint32_t optcr = FLASH->OPTCR;

    /* Set RDP = 0xBB (Level 1) — clear bit 8, set các bit khác */
    optcr &= ~(0xFF << 8);    /* Clear RDP field */
    optcr |=  (0xBB << 8);    /* Set Level 1 */

    /* Ghi và activate */
    FLASH->OPTCR = optcr;
    FLASH->OPTCR |= FLASH_OPTCR_OPTSTRT;

    while (FLASH->SR & FLASH_SR_BSY) { }

    /* Lock option bytes */
    FLASH->OPTCR |= FLASH_OPTCR_OPTLOCK;
}
```

> [!warning] Bypass Techniques (RDP Level 1)
> RDP Level 1 chống đọc Flash qua debug interface, nhưng **một số bypass đã được công bố**:
>
> **Voltage glitching**: Inject glitch vào VDD trong khi MCU đang thực thi RDP check → skip instruction → disable protection tạm thời → đọc được flash trong window ngắn. Đây là kỹ thuật được dùng để dump firmware của Trezor v1 (STM32F205) — được mô tả chi tiết trong *The Hardware Hacking Handbook* Ch. 7.
>
> **Fault injection vào Flash read**: Glitch vào lúc Flash đọc giá trị bảo vệ → giá trị bị flip → protection bị bypass.
>
> **RDP Level 2** khó bypass hơn nhiều vì không có debug interface nào còn hoạt động.

---

## Serial Wire Output (SWO) — Trace

SWO là single-wire output của SWD cho phép gửi trace data và `printf`-style output mà không ảnh hưởng timing:

```c
/* ITM (Instrumentation Trace Macrocell) — printf qua SWO */
static inline void itm_send_char(char c) {
    /* Chờ ITM Port 0 sẵn sàng */
    while (!(ITM->PORT[0].u32 & 1)) { }
    ITM->PORT[0].u8 = (uint8_t)c;
}

/* Redirect printf qua SWO */
int _write(int file, char *ptr, int len) {
    (void)file;
    for (int i = 0; i < len; i++) {
        itm_send_char(ptr[i]);
    }
    return len;
}

/* Enable ITM */
void itm_init(void) {
    CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
    ITM->LAR  = 0xC5ACCE55UL;    /* Unlock */
    ITM->TCR  = ITM_TCR_ITMENA_Msk | ITM_TCR_SYNCENA_Msk;
    ITM->TER  = 0x1UL;           /* Enable port 0 */
}
```

**OpenOCD config cho SWO**:

```tcl
# Trong OpenOCD config
tpiu config internal /dev/null uart off 168000000
itm ports on
```

---

## Summary

- **JTAG**: 4–5 pin, IEEE 1149.1, daisy-chain scan. **SWD**: 2 pin (SWDIO+SWCLK), ARM proprietary, point-to-point. SWD là chuẩn trên Cortex-M.
- **CoreSight MEM-AP**: cho phép debugger đọc/ghi **bất kỳ địa chỉ** trên AHB — bypass hoàn toàn software protection.
- **OpenOCD** + **arm-none-eabi-gdb**: combo chuẩn để debug, flash, dump memory. `dump_image` để dump firmware.
- Hardware breakpoint (FPB) và watchpoint (DWT) không cần modify flash — transparent với firmware.
- **RDP Level 0** → full access. **Level 1** → mass erase khi debug (bypass bằng glitch). **Level 2** → permanent lock, không thể undo.
- SWO/ITM: trace và printf qua single wire mà không ảnh hưởng timing của firmware.

---

## References

- ARM — *ARM Debug Interface Architecture Specification* (ADIv5) (IHI0031)
- ARM — *CoreSight Architecture Specification* (IHI0029)
- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 38 (Debug support)
- OpenOCD documentation — openocd.org/doc/html
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 3, 7 (JTAG/SWD dump, Trezor glitch)
- Advanced Security Training — *Hardware Hacking Day 4* (OpenOCD, JTAG dump lab)
