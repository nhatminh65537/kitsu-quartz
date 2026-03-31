---
title: "Microcontroller Architecture"
tags: [embedded, microcontroller, arm-cortex-m, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-mcu-overview-cortex-m-family|01. MCU Overview & Cortex-M Family]] — Phân biệt MCU/CPU/SoC, kiến trúc Harvard, pipeline, so sánh dòng Cortex-M0 đến M33. Security implications của từng dòng chip.
- [[02-registers-execution-model|02. Registers & Execution Model]] — Register file R0–R15, xPSR, CONTROL, PRIMASK. Thread/Handler mode, privileged/unprivileged, MSP vs PSP, exception stack frame.
- [[03-thumb-instruction-set|03. Instruction Set — Thumb & Thumb-2]] — Thumb vs Thumb-2 encoding, nhóm instruction (data/memory/branch/system), inline Assembly trong C, disassemble firmware với objdump, nhận diện ROP gadget.
- [[04-memory-map-mmio|04. Memory Map & Memory-Mapped I/O]] — 4GB address space, vùng Code/SRAM/Peripheral/System, MMIO concept, `volatile` bắt buộc, System Control Space (SCS), VTOR, Bit-Banding.
- [[05-flash-sram-startup|05. Flash, SRAM & Startup Code]] — Cấu trúc Flash (sector, wait states), linker script (.text/.data/.bss), vector table layout, Reset_Handler từ đầu đến `main()`, phân tích firmware dump.
- [[06-stack-heap-call-convention|06. Stack, Heap & Call Convention]] — Full-descending stack, AAPCS (caller/callee-saved, argument passing), stack frame layout, ROP gadget `POP {Rn,PC}`, stack overflow + canary, heap metadata, HardFault debug với GDB.
- [[07-mpu-memory-protection|07. MPU — Memory Protection Unit]] — Region config (base/size/AP/XN), PRIVDEFENA background region, sub-region disable, MemManage fault debug (CFSR/MMFAR), DMA bypass MPU, FreeRTOS MPU pattern, audit checklist.
- [[08-exception-model-nvic|08. Exception Model & NVIC]] — 16 system exceptions + 240 IRQ, priority scheme, priority grouping (preempt vs sub), NVIC registers, tail-chaining, late arrival, fault escalation → HardFault → LOCKUP, ISR best practices.
- [[09-vector-table-isr|09. Vector Table & ISR Mechanics]] — Hardware stacking {R0–R3,R12,LR,PC,xPSR}, EXC_RETURN magic values, FPU lazy stacking + side-channel, VTOR relocation trong bootloader, HardFault debug từ stacked frame, stack frame forgery exploit technique.
- [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]] — HSI/HSE/LSI/LSE nguồn clock, PLL tính toán M/N/P/Q, clock tree AHB/APB prescaler, peripheral clock gating, timer period và baud rate calculation, CSS (Clock Security System), clock glitching attack.
- [[11-power-management|11. Power Management]] — Sleep/Stop/Standby modes, power domains, wakeup sources (EXTI/RTC), power side-channel (SPA/DPA), Hamming Weight model, masking countermeasure, Backup SRAM persistence attack.
- [[12-gpio-exti|12. GPIO & EXTI]] — 5 GPIO modes (Input/Output/AF/Analog), MODER/IDR/ODR/BSRR registers, push-pull vs open-drain, BSRR atomic write, Alternate Function routing qua AFR, EXTI config đầy đủ, bảng tên chân phổ biến (BOOT0/SWD/JTAG/TX/RX/CS...).
- [[13-timers-systick|13. Timers & SysTick]] — SysTick 24-bit ARM core timer, wrap-around handling, Timer types (Basic/GP/Advanced), time base PSC+ARR, PWM Output Compare, Input Capture đo period, timing side-channel và constant-time comparison.
- [[14-uart-usart|14. UART/USART]] — Frame format 8N1, BRR calculation, polling/interrupt/DMA mode, RTS/CTS flow control, tìm UART trên PCB bằng logic analyzer, debug console attack, buffer overflow qua UART RX, sniff với Python serial.
- [[15-spi|15. SPI]] — 4 dây SCK/MOSI/MISO/CS, 4 mode CPOL×CPHA, NSS software/hardware, W25Qxx SPI Flash commands (JEDEC ID/Read/Program), dump firmware bằng CH341A+flashrom, MITM SPI bus capture, on-the-fly decrypt bypass.
- [[16-i2c|16. I2C]] — Open-drain bus, START/STOP/ACK/NACK conditions, 7-bit addressing, clock stretching, CCR/TRISE configuration STM32F4, write-read transaction, I2C bus scanner, bảng địa chỉ device phổ biến, sniff/impersonate/DoS attack surface.
- [[17-adc-dac|17. ADC & DAC]] — SAR ADC binary search, 12-bit resolution, sampling time, continuous+DMA circular buffer, temperature sensor + VREFINT, DAC sine wave generation, analog side-channel power trace, VDD monitor chống voltage glitch.
- [[18-dma-controller|18. DMA Controller]] — DMA là bus master độc lập bypass MPU, 2 controller/8 stream/8 channel, P2M/M2P/M2M transfer, circular mode ping-pong buffer, double-buffer mode, DMA race condition, DMA TOCTOU attack, arbitrary read/write bypass MPU hoàn toàn.
- [[19-bootloader-boot-process|19. Bootloader & Boot Process]] — BOOT0/BOOT1 pin selection, ROM bootloader ST (UART/DFU/SPI), custom bootloader flash layout, `jump_to_application` với address validation, flash erase/write từ register, firmware update protocol, rollback attack, TOCTOU update, chỉ dùng CRC vs digital signature.
- [[20-jtag-swd-debug|20. Debug Interfaces — JTAG & SWD]] — JTAG vs SWD so sánh, ARM CoreSight DAP/MEM-AP architecture, OpenOCD + GDB workflow, firmware dump `dump_image`, runtime memory read/write, hardware breakpoint/watchpoint, RDP Level 0/1/2, glitch bypass RDP Level 1 (Trezor), SWO/ITM trace.
- [[21-mcu-security-features|21. MCU Security Features]] — Option bytes layout, RDP Level 0/1/2 attack matrix + glitch bypass, WRP sector protection, PCROP code read protection, IWDG/WWDG watchdog (WWDG chống glitch), OTP area, threat model → countermeasure mapping.
- [[22-trustzone-m|22. TrustZone-M (ARMv8-M)]] — Secure/Non-secure world hardware isolation, SAU config + IDAU priority, NSC veneer CMSE entry, Secure API với pointer validation, NVIC ITNS interrupt assignment, confused deputy attack, IRQ injection, vs TrustZone-A comparison.
- [[23-secure-boot-firmware-integrity|23. Secure Boot & Firmware Integrity]] — Chain of trust ROM→Bootloader→App, hash-only vs ECDSA signature, ECDSA P-256 keygen+sign+verify với micro-ecc, anti-rollback OTP monotonic counter, fault injection bypass (glitch skip verify) + countermeasures, TOCTOU fix, TrustZone-M integration, checklist 12 điểm.

## Appendices

- [[a0-datasheet-reading-guide|A0. Datasheet Reading Guide]] — Bộ tài liệu ARM (TRM/ARM RM/CMSIS) vs vendor (Datasheet/RM/Errata), cách đọc register description, timing diagram, electrical characteristics, AF mapping table, errata checklist, workflow tiếp cận MCU mới.
- [[a1-toolchain-setup|A1. Toolchain Setup]] — GCC ARM Embedded install (Linux/macOS/Windows), binutils cheat sheet (objdump/nm/size/objcopy), OpenOCD config + telnet commands, ST-Link tools, Makefile mẫu bare-metal STM32F4, GDB embedded cheat sheet đầy đủ, logic analyzer với PulseView, bảng hardware lab.
- [[a2-register-quick-reference|A2. Register Quick Reference]] — NVIC registers (ISER/ICER/ISPR/IPR với công thức tính), SCB registers (CFSR bit-field MMFSR/BFSR/UFSR), SysTick, MPU (RBAR/RASR AP field), STM32F4 peripheral base addresses (AHB1/APB2/APB1), GPIO register offsets, IRQ numbers, Flash/OTP addresses.
- [[a3-hardware-hacking-toolkit|A3. Hardware Hacking Toolkit]] — Tier 1 tools (USB-UART/Logic Analyzer/ST-Link/SOIC8+CH341A), Tier 2 (J-Link/Oscilloscope), Tier 3 (ChipWhisperer Nano/EM probe), Ghidra/radare2/binwalk/stm32flash usage, reconnaissance checklist 5 bước cho IoT target.

## Appendices

*(Sẽ bổ sung sau khi hoàn thành các bài học)*

## Tool & Environment Guide

| Tool | Purpose | Ghi chú |
|------|---------|---------|
| `arm-none-eabi-gcc` | Cross-compiler cho ARM bare-metal | GCC ARM Embedded Toolchain |
| `arm-none-eabi-gdb` | Debug với GDB | Kết hợp OpenOCD |
| `openocd` | On-chip debugger — kết nối qua SWD/JTAG | `sudo apt install openocd` |
| `st-flash` | Flash firmware lên STM32 qua ST-Link | ST-Link tools |
| `binutils` (`objdump`, `nm`, `readelf`) | Phân tích ELF binary | Đi kèm GCC toolchain |
| Logic analyzer | Decode UART/SPI/I2C trên dây | Saleae / cheap 8ch clone |
| Oscilloscope | Đo power trace, signal timing | Rigol DS1054Z hoặc tương đương |

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| `0xE000E000` | Địa chỉ hex của register/memory region |
| `R0`–`R15` | General-purpose registers của ARM Cortex-M |
| `xPSR` | Program Status Register tổng hợp (APSR + IPSR + EPSR) |
| `MSP` / `PSP` | Main Stack Pointer / Process Stack Pointer |
| `NVIC` | Nested Vectored Interrupt Controller |
| `SCB` | System Control Block |
| `MPU` | Memory Protection Unit |
| `SCS` | System Control Space — `0xE000E000`–`0xE000EFFF` |
| `MMIO` | Memory-Mapped I/O — peripheral registers ánh xạ vào address space |
| `RDP` | Readout Protection — bảo vệ flash khỏi bị đọc qua debug interface |
| `ISR` | Interrupt Service Routine |
| `IRQ` | Interrupt Request |
| `EXC_RETURN` | Giá trị đặc biệt trong LR khi vào exception handler |
| `HAL` | Hardware Abstraction Layer |
