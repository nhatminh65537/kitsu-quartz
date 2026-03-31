---
title: "21. MCU Security Features"
tags: [embedded, microcontroller, arm-cortex-m, lesson-21]
aliases: [MCU Security, RDP, WRP, PCROP, Option Bytes]
created: 2026-03-24
---

> **Prerequisites**: [[07-mpu-memory-protection|07. MPU — Memory Protection Unit]], [[19-bootloader-boot-process|19. Bootloader & Boot Process]], [[20-jtag-swd-debug|20. Debug Interfaces — JTAG & SWD]]
> **Objectives**:
> - Nắm toàn bộ security features của STM32F4: RDP, WRP, PCROP, option bytes
> - Cấu hình write protection và readout protection đúng cách
> - Hiểu IWDG/WWDG — watchdog timer như một security mechanism
> - Phân tích các kỹ thuật bypass từng lớp protection
> - Xây dựng threat model cho MCU và mapping với từng countermeasure

---

## Motivation

Bài 20 trình bày cách attacker dump firmware qua SWD. Bài này trả lời câu hỏi ngược: firmware engineer phải cấu hình những gì để ngăn cản điều đó? STM32F4 cung cấp nhiều lớp bảo vệ — RDP, WRP, PCROP — nhưng hiệu quả phụ thuộc hoàn toàn vào việc chúng được cấu hình đúng. Trên thực tế, phần lớn IoT device production vẫn để RDP=0.

---

## Option Bytes — Trung tâm Cấu hình Bảo mật

**Option bytes** là một vùng flash đặc biệt tại `0x1FFFC000` (STM32F4) lưu trữ cấu hình bảo mật và hardware. Chúng chỉ thay đổi được khi unlock.

> [!definition] Definition 21.1 — Option Bytes STM32F4
>
> | Field | Bits | Giá trị mặc định | Ý nghĩa |
> |-------|------|-----------------|---------|
> | `RDP` | [15:8] | `0xAA` (Level 0) | Readout Protection level |
> | `nRST_STDBY` | [6] | 1 | 0 = Reset khi vào Standby |
> | `nRST_STOP` | [5] | 1 | 0 = Reset khi vào Stop |
> | `WDG_SW` | [4] | 1 | 0 = Hardware watchdog (tự động start) |
> | `nWRP` | [27:16] | `0xFFF` | Write protection bits (bit=0 → sector protected) |
> | `SPRMOD` | [8 of OPTCR1] | 0 | 0 = WRP mode, 1 = PCROP mode |
> | `nWRP_PCROP` | [27:16 of OPTCR1] | `0xFFF` | PCROP sectors khi SPRMOD=1 |
>
> Option bytes được đọc khi reset và cache vào registers trong chip — thay đổi chỉ có hiệu lực sau **power-on reset tiếp theo**.

**Đọc option bytes hiện tại**:

```c
/* Đọc trực tiếp từ flash option bytes address */
uint32_t optcr  = *(volatile uint32_t *)0x1FFFC000;
uint32_t optcr1 = *(volatile uint32_t *)0x1FFFC008;

uint8_t  rdp_level = (optcr >> 8) & 0xFF;
uint16_t wrp_bits  = (optcr >> 16) & 0xFFF;

/* Hoặc đọc từ FLASH->OPTCR register (cached value) */
rdp_level = (FLASH->OPTCR >> 8) & 0xFF;
```

---

## RDP — Readout Protection (Chi tiết)

Bài 20 giới thiệu RDP ở mức cao. Đây là chi tiết về từng level và attack path:

> [!definition] Definition 21.2 — RDP Attack Matrix
>
> | RDP | SWD/JTAG | Boot RAM | Boot Flash | Flash read | Reset → RDP0 |
> |-----|---------|---------|-----------|-----------|-------------|
> | Level 0 (0xAA) | Full access | Yes | Yes | **Yes** | N/A |
> | Level 1 (0xBB) | No flash read/write | No | Yes (execute) | **No** | Mass erase (firmware lost) |
> | Level 2 (0xCC) | **Disabled permanently** | No | Yes (execute) | **No** | **Impossible** |

> [!warning] Bypass Known Attacks
> **RDP Level 1 → Level 0 without mass erase** (voltage glitch):
> Được demo công khai bởi Johannes Obermaier (2020) trên STM32F1/F2/F4. Attack inject voltage glitch vào đường VDD trong khoảng thời gian MCU đang load option bytes từ Flash khi reset → flip RDP byte từ `0xBB` về `0xAA` trong SRAM tạm thời → debug interface mở → dump flash trước khi reset.
>
> **RDP Level 2** chưa có bypass công khai đáng tin cậy cho STM32F4 (tính đến thời điểm viết).

**Đặt RDP Level 2 (irreversible — production only)**:

```c
void set_rdp_level2_IRREVERSIBLE(void) {
    /* CẢNH BÁO: Không thể hoàn tác. Chip bị lock vĩnh viễn. */
    /* Chỉ dùng trên production device đã test kỹ */

    FLASH->OPTKEYR = 0x08192A3BUL;
    FLASH->OPTKEYR = 0x4C5D6E7FUL;
    while (FLASH->SR & FLASH_SR_BSY) { }

    uint32_t optcr = FLASH->OPTCR;
    optcr &= ~(0xFF << 8);
    optcr |=  (0xCC << 8);    /* RDP Level 2 */

    FLASH->OPTCR  = optcr;
    FLASH->OPTCR |= FLASH_OPTCR_OPTSTRT;
    while (FLASH->SR & FLASH_SR_BSY) { }

    FLASH->OPTCR |= FLASH_OPTCR_OPTLOCK;

    /* Reset để apply */
    NVIC_SystemReset();
}
```

---

## WRP — Write Protection

WRP ngăn ghi **và xóa** flash sector — kể cả từ firmware đang chạy và từ debug interface.

> [!definition] Definition 21.3 — WRP Sectors STM32F4
> `nWRP` bits trong OPTCR: bit n = 0 → sector n bị write-protected.
>
> ```text
> OPTCR bits [27:16]: nWRP[11:0]
>   Bit 16 (nWRP[0]): Sector 0  (0x08000000, 16KB)
>   Bit 17 (nWRP[1]): Sector 1  (0x08004000, 16KB)
>   ...
>   Bit 19 (nWRP[3]): Sector 3  (0x0800C000, 16KB) ← cuối bootloader area
>   Bit 20 (nWRP[4]): Sector 4  (0x08010000, 64KB)
>   ...
>   Bit 27 (nWRP[11]): Sector 11 (0x080E0000, 128KB)
> ```

**Protect sector 0–3 (bootloader)**:

```c
void wrp_protect_bootloader(void) {
    FLASH->OPTKEYR = 0x08192A3BUL;
    FLASH->OPTKEYR = 0x4C5D6E7FUL;
    while (FLASH->SR & FLASH_SR_BSY) { }

    uint32_t optcr = FLASH->OPTCR;
    /* Clear nWRP[3:0] = protect sectors 0–3 */
    optcr &= ~(0xFUL << 16);   /* bit 19:16 = 0 → protected */

    FLASH->OPTCR  = optcr;
    FLASH->OPTCR |= FLASH_OPTCR_OPTSTRT;
    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->OPTCR |= FLASH_OPTCR_OPTLOCK;
}
```

> [!note] WRP và Firmware Update
> Nếu bootloader sector bị WRP, chỉ có application sector có thể được ghi bởi firmware update. Bootloader **không thể tự cập nhật** mà không gỡ WRP trước (cần unlock option bytes — chỉ có thể làm qua debug interface ở RDP Level 0). Đây là trade-off giữa bảo mật và updateability của bootloader.

---

## PCROP — Proprietary Code Read-Out Protection

PCROP là một biến thể của WRP: sector được protect không thể đọc **thậm chí bởi firmware đang chạy** — chỉ có thể execute, không thể read data.

> [!definition] Definition 21.4 — PCROP vs WRP
>
> | | WRP | PCROP |
> |--|-----|-------|
> | Ngăn ghi/xóa | Có | Có |
> | Ngăn đọc data | **Không** | **Có** |
> | Execute | Có | Có |
> | Dùng cho | Bootloader protection | Crypto library, key storage |
> | Config | `nWRP` bits (SPRMOD=0) | `nWRP` bits (SPRMOD=1) |
>
> PCROP lý tưởng để bảo vệ thư viện crypto hoặc firmware module chứa algorithm độc quyền — firmware khác có thể call vào nhưng không thể đọc code.

**Enable PCROP cho sector 4**:

```c
void pcrop_enable_sector4(void) {
    FLASH->OPTKEYR = 0x08192A3BUL;
    FLASH->OPTKEYR = 0x4C5D6E7FUL;
    while (FLASH->SR & FLASH_SR_BSY) { }

    /* Set SPRMOD=1 trong OPTCR1 (chuyển sang PCROP mode) */
    FLASH->OPTCR1 |= FLASH_OPTCR1_SPRMOD;

    /* Clear nWRP[4] trong OPTCR1 = protect sector 4 */
    FLASH->OPTCR1 &= ~(1UL << (16 + 4));

    FLASH->OPTCR  |= FLASH_OPTCR_OPTSTRT;
    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->OPTCR  |= FLASH_OPTCR_OPTLOCK;
}
```

---

## Watchdog Timers — IWDG và WWDG

Watchdog là timer tự động reset chip nếu firmware không "kick" nó định kỳ — bảo vệ chống firmware bị treo hay bị hijack.

> [!definition] Definition 21.5 — IWDG vs WWDG
>
> | | IWDG (Independent WDG) | WWDG (Window WDG) |
> |--|----------------------|-----------------|
> | Clock | LSI (~32 kHz) — độc lập với main clock | APB1 clock |
> | Stop khi debug | Tùy cấu hình (DBG_IWDG_STOP) | Tùy cấu hình |
> | Window | Không có | **Có** — chỉ cho phép kick trong cửa sổ thời gian |
> | Dùng để chống | Firmware treo | **Timing attack, glitch** |

**IWDG**:

```c
void iwdg_init(uint16_t prescaler, uint16_t reload) {
    /* prescaler: 4/8/16/32/64/128/256 */
    /* Timeout = reload × prescaler / LSI_Hz
     * Ví dụ: reload=0xFFF, prescaler=64 → 4095×64/32000 ≈ 8.19 giây */
    IWDG->KR  = 0x5555;              /* Enable write access */
    IWDG->PR  = prescaler;           /* Set prescaler */
    IWDG->RLR = reload & 0xFFF;      /* Set reload value */
    IWDG->KR  = 0xAAAA;              /* Reload counter */
    IWDG->KR  = 0xCCCC;              /* Start IWDG */
}

/* Gọi định kỳ trong main loop để prevent reset */
void iwdg_kick(void) {
    IWDG->KR = 0xAAAA;
}
```

**WWDG — Window Watchdog (chống glitch)**:

```c
/* WWDG chỉ cho phép kick trong window [WDGTB_counter, W]
 * Kick quá sớm (counter > W) → reset ngay
 * Kick quá muộn (counter xuống 0x3F) → reset
 * → Glitch attack làm CPU execute quá nhanh sẽ kick WWDG quá sớm → reset */
void wwdg_init(void) {
    RCC->APB1ENR |= RCC_APB1ENR_WWDGEN;

    /* Window = 0x50, Counter start = 0x7F, prescaler /8
     * APB1 = 42 MHz, WWDG clock = 42/4096/8 ≈ 1.28 kHz
     * Kick window: từ khi counter = 0x7F xuống 0x50 ≈ ~23 ms */
    WWDG->CFR = WWDG_CFR_EWI          /* Early wakeup interrupt */
              | (3U << 7)             /* WDGTB=11: /8 */
              | 0x50U;                /* Window value */
    WWDG->CR  = WWDG_CR_WDGA          /* Activate WWDG */
              | 0x7FU;                /* Counter value */
}

void WWDG_IRQHandler(void) {
    WWDG->SR = 0;   /* Clear EWI flag */
    wwdg_kick_if_time();
}
```

---

## Secure Key Storage trên STM32

STM32 không có dedicated secure key storage như TPM. Các option:

```text
1. OTP (One-Time Programmable) area — 0x1FFF7800 (512 bytes)
   - Ghi một lần, không xóa được
   - Không bảo vệ read (chỉ write-once)
   - Dùng cho device UID, public cert

2. Flash với RDP Level 2 + PCROP
   - Key ở sector PCROP: không đọc được từ debug hay từ code khác
   - Vẫn có thể bị side-channel (power analysis khi key được dùng)

3. External Secure Element (ATECC608, SE050)
   - Hardware crypto engine với key không thể export
   - Key generation và storage on-chip
   - Communicate qua I2C/SPI — I2C sniffing chỉ thấy ciphertext
```

---

## Threat Model và Countermeasure Mapping

> [!definition] Definition 21.6 — Threat Model MCU
>
> | Threat | Attack | Countermeasure |
> |--------|--------|---------------|
> | Firmware theft | SWD dump | RDP Level 1/2 |
> | Firmware modification | Flash write | WRP bootloader sectors |
> | Algorithm theft | Code read | PCROP |
> | Replay / downgrade | Old firmware | Anti-rollback counter (OTP) |
> | Fault injection | Voltage/clock glitch | WWDG, voltage monitor, CRC check |
> | Debug interface | JTAG attack | RDP Level 2, disable SWD pins |
> | Side-channel | Power analysis | Masked crypto, hardware accelerator |
> | Physical tamper | Board probing | Epoxy, tamper detection (ADC), JTAG cover |
> | DMA attack | Peripheral abuse | Validate DMA config, restrict privilege |
> | Stack overflow | Buffer overflow | Stack canary, MPU XN on SRAM |

---

## Summary

- **Option bytes** (`0x1FFFC000`): cấu hình bảo mật hardware, có hiệu lực sau power-on reset.
- **RDP**: Level 0 (open) → Level 1 (no debug read, reversible với mass erase) → Level 2 (permanent lock). Level 1 có thể bypass bằng voltage glitch.
- **WRP**: protect sector khỏi ghi/xóa. Bootloader sector nên luôn WRP.
- **PCROP**: protect sector khỏi đọc code — dùng cho crypto library. Require SPRMOD=1.
- **IWDG**: reset nếu firmware treo. **WWDG**: window-based, chống glitch attack.
- Threat model → mapping từng countermeasure: không có "silver bullet" — cần nhiều lớp.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 3.9 (Option bytes), Ch. 21 (WWDG), Ch. 20 (IWDG)
- STMicroelectronics — *AN4992: Guidelines for secure programming on STM32 microcontrollers*
- Johannes Obermaier, Stefan Tatschner — *Shedding too much Light on a Microcontroller's Firmware Protection* (WOOT 2017)
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 14 (Countermeasures)
- Microchip — *ATECC608 Datasheet* (secure element reference)
