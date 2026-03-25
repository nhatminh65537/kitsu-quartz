---
title: "19. Bootloader & Boot Process"
tags: [embedded, microcontroller, arm-cortex-m, lesson-19]
aliases: [Bootloader, Boot Process, DFU, Firmware Update]
created: 2026-03-24
---

> **Prerequisites**: [[05-flash-sram-startup|05. Flash, SRAM & Startup Code]], [[09-vector-table-isr|09. Vector Table & ISR Mechanics]], [[14-uart-usart|14. UART/USART]]
> **Objectives**:
> - Hiểu boot mode selection trên STM32: BOOT0/BOOT1 pin và ROM bootloader
> - Phân tích luồng boot đầy đủ từ power-on đến application
> - Viết custom bootloader có khả năng update firmware qua UART
> - Implement jump-to-application an toàn với address validation
> - Nhận diện attack surface: BOOT0 force, firmware rollback, downgrade attack, insecure update

---

## Motivation

Bootloader là "người gác cổng" của firmware — nó quyết định code nào được chạy trên chip. Một bootloader yếu là điểm vào chính để attacker inject firmware độc hại, bypass code signing, hay khai thác firmware update protocol. Hiểu bootloader từ trong ra ngoài là nền tảng bắt buộc trước khi học Secure Boot (Bài 23).

---

## Boot Mode Selection — STM32F4

STM32F4 quyết định boot từ đâu dựa trên trạng thái của **BOOT0** và **BOOT1** (PB2) khi reset:

> [!definition] Definition 19.1 — Boot Mode Pins STM32F4
>
> | BOOT0 | BOOT1 (PB2) | Boot source | Ý nghĩa |
> |-------|-------------|-------------|---------|
> | 0 | x | User Flash (`0x08000000`) | Chế độ bình thường — chạy firmware |
> | 1 | 0 | System Memory (`0x1FFF0000`) | **ROM bootloader của ST** — DFU mode |
> | 1 | 1 | Embedded SRAM (`0x20000000`) | Chạy code từ RAM — dùng khi debug |
>
> Trên PCB production: BOOT0 thường kéo xuống GND qua resistor 10kΩ → luôn boot từ Flash. Để vào DFU mode: kéo BOOT0 lên HIGH (3.3V), nhấn RESET.

**Lỗ hổng phổ biến**: Nếu trên PCB có test pad BOOT0 dễ tiếp cận → attacker có thể dùng dây jumper kéo BOOT0 HIGH → reset board → board vào ROM bootloader → dùng STM32CubeProgrammer hoặc `dfu-util` để dump/overwrite firmware (nếu RDP chưa set).

---

## ROM Bootloader của ST

ST cung cấp ROM bootloader tích hợp sẵn trong chip, hỗ trợ nhiều interface:

> [!definition] Definition 19.2 — ST ROM Bootloader Interfaces (STM32F4)
>
> | Interface | Command Protocol | Tool |
> |-----------|----------------|------|
> | USART1 (PA9/PA10) | AN3155: STM32 USART bootloader | `stm32flash`, STM32CubeProgrammer |
> | USB DFU | USB Device Firmware Upgrade (DFU 1.1) | `dfu-util`, STM32CubeProgrammer |
> | SPI | Tương tự USART, ít dùng | STM32CubeProgrammer |
> | I2C | Dùng cho update không có USART | STM32CubeProgrammer |

**Dùng `stm32flash` để dump firmware** (nếu RDP=0):

```bash
# Kết nối USB-UART adapter, kéo BOOT0=HIGH, reset board
# UART: /dev/ttyUSB0, baud auto-detect

# Đọc flash memory (dump toàn bộ 1MB)
stm32flash -r firmware_dump.bin -S 0x08000000:1048576 /dev/ttyUSB0

# Ghi firmware mới
stm32flash -w new_firmware.bin -v -g 0x08000000 /dev/ttyUSB0

# Xem thông tin chip
stm32flash /dev/ttyUSB0
```

---

## Flash Memory Layout cho Bootloader

Custom bootloader thường chia Flash thành hai vùng:

```text
STM32F4 Flash (1MB):
┌─────────────────────────────────────────────┐ 0x08000000
│  Bootloader (Sector 0–3: 4 × 16KB = 64KB)  │
│  - Vector table tại 0x08000000              │
│  - Cấu hình nhận firmware qua UART/USB      │
│  - Write-protected (WRP)                    │
├─────────────────────────────────────────────┤ 0x08010000
│  Application (Sector 4–11: 64KB + 7×128KB) │
│  - Vector table tại 0x08010000              │
│  - SCB->VTOR = 0x08010000 sau khi jump      │
│  - Có thể re-flash bởi bootloader           │
└─────────────────────────────────────────────┘ 0x080FFFFF
```

---

## Custom Bootloader — Nhận Firmware qua UART

```c
/* bootloader_main.c — Simplified custom bootloader */
#include "stm32f4xx.h"
#include <stdint.h>
#include <string.h>

#define APP_START_ADDR   0x08010000UL   /* Application bắt đầu từ đây */
#define APP_SIZE_MAX     (960 * 1024)   /* Tối đa 960KB cho application */
#define MAGIC_WORD       0xDEADBEEF     /* Magic word để nhận diện firmware hợp lệ */

/* Kiểm tra application có hợp lệ không */
static int is_app_valid(uint32_t app_addr) {
    /* Kiểm tra Initial MSP: phải trong range SRAM */
    uint32_t msp = *(volatile uint32_t *)app_addr;
    if (msp < 0x20000000UL || msp > 0x20020000UL) {
        return 0;
    }

    /* Kiểm tra Reset_Handler: phải trong Flash range của app */
    uint32_t reset_handler = *(volatile uint32_t *)(app_addr + 4);
    if ((reset_handler & ~1UL) < app_addr ||
        (reset_handler & ~1UL) >= app_addr + APP_SIZE_MAX) {
        return 0;
    }

    return 1;
}

/* Jump sang application */
static void jump_to_app(uint32_t app_addr) {
    /* 1. Disable tất cả interrupt */
    __disable_irq();

    /* 2. Disable tất cả NVIC IRQ đang enable */
    for (int i = 0; i < 8; i++) {
        NVIC->ICER[i] = 0xFFFFFFFF;
        NVIC->ICPR[i] = 0xFFFFFFFF;
    }

    /* 3. Relocate VTOR về application */
    SCB->VTOR = app_addr;

    /* 4. Set MSP từ application vector table */
    uint32_t app_msp = *(volatile uint32_t *)app_addr;
    __set_MSP(app_msp);

    /* 5. Lấy Reset_Handler từ application */
    uint32_t app_reset = *(volatile uint32_t *)(app_addr + 4);

    /* 6. Barriers bắt buộc */
    __DSB();
    __ISB();

    /* 7. Jump — app_reset đã có bit 0 = 1 (Thumb) */
    ((void (*)(void))app_reset)();

    /* Không bao giờ đến đây */
    while (1) { }
}

/* Xóa flash sector (sector 4 trở đi = application area) */
static void flash_erase_sector(uint8_t sector) {
    /* Unlock Flash */
    FLASH->KEYR = 0x45670123UL;
    FLASH->KEYR = 0xCDEF89ABUL;

    /* Chờ không busy */
    while (FLASH->SR & FLASH_SR_BSY) { }

    /* Sector erase */
    FLASH->CR &= ~FLASH_CR_SNB;
    FLASH->CR |= FLASH_CR_SER | ((sector & 0xF) << FLASH_CR_SNB_Pos);
    FLASH->CR |= FLASH_CR_STRT;

    while (FLASH->SR & FLASH_SR_BSY) { }

    /* Clear flags */
    FLASH->SR = FLASH_SR_EOP | FLASH_SR_OPERR | FLASH_SR_WRPERR |
                FLASH_SR_PGAERR | FLASH_SR_PGSERR;

    FLASH->CR &= ~(FLASH_CR_SER | FLASH_CR_SNB);
}

/* Ghi 32-bit word vào flash */
static void flash_write_word(uint32_t addr, uint32_t data) {
    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->CR &= ~FLASH_CR_PSIZE;
    FLASH->CR |= (2U << FLASH_CR_PSIZE_Pos);  /* PSIZE=10: 32-bit */
    FLASH->CR |= FLASH_CR_PG;

    *(volatile uint32_t *)addr = data;

    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->CR &= ~FLASH_CR_PG;

    /* Lock Flash lại */
    FLASH->CR |= FLASH_CR_LOCK;
}

/* Protocol đơn giản nhận firmware qua UART:
 * 1. Gửi 'B' để vào bootloader mode
 * 2. Nhận SIZE (4 bytes, little-endian): kích thước firmware
 * 3. Nhận DATA: firmware bytes
 * 4. Nhận CRC32 (4 bytes): checksum
 * 5. Verify CRC → nếu OK: flash và gửi 'K', nếu lỗi: gửi 'E'
 */
void bootloader_main(void) {
    /* Init UART, clock... */
    /* Chờ 3 giây: nếu nhận 'B' → vào update mode, nếu không → jump app */

    /* Giả sử đã nhận trigger và firmware data vào temp_buf */
    extern uint8_t temp_buf[];
    extern uint32_t fw_size;

    /* Verify CRC (simplified — production phải dùng digital signature) */
    /* ... */

    /* Erase application sectors */
    for (uint8_t s = 4; s <= 11; s++) {
        flash_erase_sector(s);
    }

    /* Write firmware word by word */
    for (uint32_t i = 0; i < fw_size; i += 4) {
        uint32_t word;
        memcpy(&word, &temp_buf[i], 4);
        flash_write_word(APP_START_ADDR + i, word);
    }

    /* Jump sang application mới */
    if (is_app_valid(APP_START_ADDR)) {
        jump_to_app(APP_START_ADDR);
    }
}
```

---

## Linker Script cho Application

Application phải biết rằng nó không bắt đầu từ `0x08000000`:

```ld
/* application.ld */
MEMORY
{
    FLASH (rx)  : ORIGIN = 0x08010000, LENGTH = 960K  /* Sau bootloader */
    SRAM  (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}

ENTRY(Reset_Handler)

SECTIONS
{
    .text :
    {
        KEEP(*(.isr_vector))    /* Vector table tại 0x08010000 */
        *(.text*)
        *(.rodata*)
    } > FLASH

    /* ... .data, .bss như bình thường ... */
}
```

**Build application với offset**:

```bash
# Compile với linker script chỉ định offset
arm-none-eabi-gcc -T application.ld -o app.elf src/*.c

# Kiểm tra: vector table phải tại 0x08010000
arm-none-eabi-objdump -h app.elf | grep -E "\.text|\.isr"

# Tạo binary để flash
arm-none-eabi-objcopy -O binary app.elf app.bin
```

---

## Attack Surface — Bootloader Security

### 1. Force BOOT0 — Physical Access Attack

```text
Nếu BOOT0 pad tiếp cận được:
1. Kéo BOOT0 = HIGH (3.3V) bằng dây jumper hay pin kẹp
2. Reset board
3. ROM bootloader activate
4. Nếu RDP=0 → dump toàn bộ flash qua UART/USB DFU
5. Nếu RDP=1 → không đọc được flash nhưng vẫn có thể ghi firmware mới

Countermeasure: Write-protect BOOT0 trace (epoxy, bóc pad),
set RDP=2 (permanent lock) cho production device.
```

### 2. Firmware Rollback / Downgrade Attack

```text
Kịch bản:
1. Firmware v1.0 có lỗ hổng, vendor release v1.1 vá lỗi
2. Bootloader không kiểm tra version number
3. Attacker gửi firmware v1.0 qua update channel
4. Bootloader chấp nhận vì chỉ verify CRC/signature (không verify version)
5. Thiết bị rollback về v1.0 với lỗ hổng → attacker exploit

Countermeasure: Anti-rollback counter trong OTP/eFuse.
Firmware phải chứa version number, bootloader check:
  new_version >= current_version (hoặc > để chặn downgrade hoàn toàn)
```

### 3. TOCTOU trong Firmware Update

```c
/* BUG: Verify rồi mới flash, nhưng buffer có thể bị thay đổi giữa chừng */
void insecure_update(uint8_t *buf, uint32_t size) {
    if (!verify_signature(buf, size)) return;  /* Check tại đây */
    /* ... xử lý khác ... */
    flash_write(APP_START_ADDR, buf, size);    /* Flash tại đây — buf có thể đã thay đổi! */
}

/* ĐÚNG: Copy vào secure buffer trước khi verify, flash từ secure buffer */
void secure_update(uint8_t *input, uint32_t size) {
    static uint8_t secure_buf[APP_SIZE_MAX];
    memcpy(secure_buf, input, size);           /* Copy trước */
    if (!verify_signature(secure_buf, size)) return;  /* Verify từ copy */
    flash_write(APP_START_ADDR, secure_buf, size);    /* Flash từ copy */
}
```

### 4. Insecure Update — Chỉ Dùng CRC

```text
Nhiều bootloader chỉ dùng CRC32 để verify firmware.
CRC32 không phải cryptographic hash — có thể bị forge.

Attacker có thể tính CRC32 của firmware giả mạo và
đặt đúng giá trị CRC vào trailer → bootloader chấp nhận.

Countermeasure: Dùng ECDSA hoặc RSA signature verify
với public key được hardcode trong bootloader.
Key pair generation: openssl ecparam -name prime256v1 -genkey
Signing: openssl dgst -sha256 -sign private.pem firmware.bin
Verify: openssl dgst -sha256 -verify public.pem -signature sig firmware.bin
```

---

## Kiểm tra Boot Configuration qua GDB

```gdb
# Xem BOOT0 và BOOT1 state (cần đọc hardware, không thể từ register)
# Nhưng có thể xem option bytes đã config

# Option bytes address (STM32F4)
(gdb) x/wx 0x1FFFC000    # OPTCR — Option Control Register
# Bits [27:16]: nWRP — Write protection (bit=0 → sector protected)
# Bits [9:8]:   RDP  — Readout Protection level (AA=0, BB=1, CC=2)
# Bit 5:        nRST_STDBY — Reset when entering standby
# Bit 0:        OPTLOCK — Option lock

# Kiểm tra VTOR để xem bootloader đã chuyển sang app chưa
(gdb) x/wx 0xE000ED08    # SCB->VTOR
# 0x08000000 → đang ở bootloader
# 0x08010000 → đã jump sang application

# Kiểm tra MSP hiện tại
(gdb) p/x $msp
```

---

## Summary

- STM32F4 chọn boot source qua **BOOT0/BOOT1 pin**: BOOT0=0 → Flash, BOOT0=1+BOOT1=0 → ROM bootloader (DFU mode).
- **ROM bootloader** của ST hỗ trợ UART, USB DFU, SPI, I2C. Dùng `stm32flash` hoặc `dfu-util` để interact.
- Custom bootloader layout: sector 0–3 (bootloader, write-protected) + sector 4–11 (application).
- **jump_to_application**: disable IRQ, clear NVIC, set VTOR, set MSP, jump. Luôn validate địa chỉ trước khi jump.
- **Application linker script**: FLASH ORIGIN phải offset về `0x08010000` (hoặc địa chỉ tương ứng).
- Attack surface: BOOT0 force (physical), firmware rollback (thiếu version check), TOCTOU update, chỉ dùng CRC (không đủ — dùng digital signature).

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 3 (Flash), Ch. 2 (Option bytes)
- STMicroelectronics — *AN2606: STM32 microcontroller system memory boot mode*
- STMicroelectronics — *AN3155: USART protocol used in the STM32 bootloader*
- AllThingsEmbedded — *Bootloaders and ARM Cortex-M microcontrollers*
- interrupt.memfault.com — *How to Write a Bootloader from Scratch*
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 3 (boot process analysis)
