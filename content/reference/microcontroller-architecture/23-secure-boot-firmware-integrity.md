---
title: "23. Secure Boot & Firmware Integrity"
tags: [embedded, microcontroller, arm-cortex-m, lesson-23]
aliases: [Secure Boot, Firmware Integrity, Code Signing]
created: 2026-03-24
---

> **Prerequisites**: [[19-bootloader-boot-process|19. Bootloader & Boot Process]], [[21-mcu-security-features|21. MCU Security Features]], [[22-trustzone-m|22. TrustZone-M (ARMv8-M)]]
> **Objectives**:
> - Hiểu chain of trust từ ROM đến application: root of trust, bootloader, firmware
> - Implement hash-based integrity check (SHA-256) trước khi boot
> - Implement ECDSA signature verification trong bootloader
> - Hiểu anti-rollback mechanism với monotonic counter
> - Phân tích attack surface: fault injection bypass, downgrade, TOCTOU, rollback

---

## Motivation

Secure Boot là mục tiêu cuối cùng của toàn bộ series này. Mọi kiến thức từ Bài 01 đến Bài 22 đều hướng đến đây: làm thế nào để đảm bảo chỉ firmware được phép mới chạy trên chip? Không phải firmware giả mạo của attacker, không phải firmware cũ có lỗ hổng, không phải firmware bị patch sau khi ký. Đây là bài toán cốt lõi của embedded security.

---

## Chain of Trust — Nền tảng Secure Boot

> [!definition] Definition 23.1 — Chain of Trust
>
> ```text
> Root of Trust (ROM / Hardware)
>       │  verify signature
>       ▼
> Bootloader Stage 1 (immutable, in secure flash)
>       │  verify signature
>       ▼
> Bootloader Stage 2 / Application Bootloader
>       │  verify signature + version
>       ▼
> Application Firmware
>       │  verify module signatures (optional)
>       ▼
> Running system
> ```
>
> Mỗi bước chỉ chạy nếu bước trước **verify thành công**. Nếu bất kỳ bước nào fail → halt hoặc recovery mode, **không boot**.
>
> **Root of Trust** phải là bất biến và không thể bị compromise: ROM bootloader của ST (khi PCROP), hay immutable flash sector với WRP+RDP Level 2.

---

## Hash-based Integrity Check

Bước đơn giản nhất: tính hash của firmware và so sánh với giá trị đã lưu.

```c
/* SHA-256 bằng hardware CRC hoặc software — dùng software crypto library */
#include "sha256.h"   /* Lightweight SHA-256 implementation */

/* Firmware image layout:
 * [firmware_data: N bytes][SHA-256 hash: 32 bytes] */

#define HASH_SIZE   32
#define APP_ADDR    0x08010000UL

int verify_firmware_hash(uint32_t fw_addr, uint32_t fw_size) {
    /* Hash được lưu ngay sau firmware */
    const uint8_t *stored_hash = (const uint8_t *)(fw_addr + fw_size);
    uint8_t computed_hash[HASH_SIZE];

    sha256_context ctx;
    sha256_init(&ctx);
    sha256_update(&ctx, (const uint8_t *)fw_addr, fw_size);
    sha256_final(&ctx, computed_hash);

    /* Constant-time comparison — không short-circuit */
    uint8_t diff = 0;
    for (int i = 0; i < HASH_SIZE; i++) {
        diff |= computed_hash[i] ^ stored_hash[i];
    }
    return (diff == 0) ? 0 : -1;
}
```

> [!warning] Hash Không Đủ
> SHA-256 hash chỉ kiểm tra **integrity** (firmware không bị corrupt) nhưng **không kiểm tra authenticity** (firmware có được ký bởi vendor không). Attacker có thể tạo firmware giả, tính SHA-256 của nó, và cập nhật cả firmware lẫn hash → verification vẫn pass.
>
> Cần **digital signature** với asymmetric cryptography.

---

## ECDSA Signature Verification

ECDSA là lựa chọn phổ biến cho MCU vì key size nhỏ (32 bytes với P-256) và verification nhanh hơn RSA.

### Key Pair Generation (Host)

```bash
# Tạo ECDSA P-256 key pair
openssl ecparam -name prime256v1 -genkey -noout -out private_key.pem

# Export public key
openssl ec -in private_key.pem -pubout -out public_key.pem

# Xem public key dưới dạng hex (để hardcode vào bootloader)
openssl ec -in public_key.pem -pubin -text -noout
```

### Ký Firmware (Host, CI/CD pipeline)

```bash
# Tạo hash của firmware
openssl dgst -sha256 -binary firmware.bin > firmware.sha256

# Ký hash bằng private key
openssl pkeyutl -sign -inkey private_key.pem \
    -in firmware.sha256 -out firmware.sig

# Hoặc ký trực tiếp
openssl dgst -sha256 -sign private_key.pem \
    -out firmware.sig firmware.bin

# Tạo firmware package: [firmware][signature(64 bytes DER)]
cat firmware.bin firmware.sig > firmware_signed.bin
```

### Verify trong Bootloader (MCU)

```c
/* Dùng micro-ecc library (nhỏ gọn, phù hợp MCU) */
#include "uECC.h"

/* Public key hardcoded trong bootloader (64 bytes: X + Y coordinates) */
static const uint8_t VENDOR_PUBLIC_KEY[64] = {
    /* X coordinate (32 bytes) */
    0x6B, 0x17, 0xD1, 0xF2, 0xE1, 0x2C, 0x42, 0x47,
    /* ... 24 bytes more ... */
    /* Y coordinate (32 bytes) */
    0x4F, 0xE3, 0x42, 0xE2, 0xFE, 0x1A, 0x7F, 0x9B,
    /* ... 24 bytes more ... */
};

/* Firmware image layout:
 * [firmware: N bytes]
 * [SHA-256 hash: 32 bytes]
 * [ECDSA signature: 64 bytes raw r||s]
 * [Version number: 4 bytes]
 * [Magic: 4 bytes = 0xB007AB1E] */
#define MAGIC_SECURE_BOOT   0xB007AB1EUL
#define SIG_SIZE            64
#define HASH_SIZE           32

typedef struct {
    uint32_t fw_size;      /* Size của firmware data */
    uint8_t  hash[32];     /* SHA-256 của firmware */
    uint8_t  signature[64];/* ECDSA P-256 signature (r||s, 64 bytes) */
    uint32_t version;      /* Firmware version (monotonic) */
    uint32_t magic;        /* 0xB007AB1E */
} __attribute__((packed)) FirmwareTrailer;

int secure_boot_verify(uint32_t fw_addr) {
    /* 1. Đọc trailer */
    uint32_t fw_size = *(volatile uint32_t *)(fw_addr + 0);  /* First word = size */
    const FirmwareTrailer *trailer =
        (const FirmwareTrailer *)(fw_addr + fw_size);

    /* 2. Kiểm tra magic */
    if (trailer->magic != MAGIC_SECURE_BOOT) {
        return -1;
    }

    /* 3. Verify hash */
    uint8_t computed_hash[32];
    sha256_compute((const uint8_t *)fw_addr, fw_size, computed_hash);
    uint8_t hash_diff = 0;
    for (int i = 0; i < 32; i++) hash_diff |= computed_hash[i] ^ trailer->hash[i];
    if (hash_diff != 0) return -2;

    /* 4. Verify ECDSA signature của hash */
    const struct uECC_Curve_t *curve = uECC_secp256r1();
    int sig_valid = uECC_verify(
        VENDOR_PUBLIC_KEY,    /* Public key (64 bytes) */
        trailer->hash,        /* Message hash (32 bytes) */
        32,
        trailer->signature,   /* Signature r||s (64 bytes) */
        curve
    );
    if (!sig_valid) return -3;

    /* 5. Anti-rollback: version phải >= stored minimum */
    uint32_t min_version = get_minimum_allowed_version();  /* Từ OTP/eFuse */
    if (trailer->version < min_version) return -4;

    return 0;  /* OK */
}
```

---

## Anti-Rollback với Monotonic Counter

```c
/* Monotonic counter trong OTP (One-Time Programmable) area
 * STM32F4: OTP tại 0x1FFF7800, 512 bytes, chia thành 16 block × 32 bytes
 * Mỗi block có 1 byte lock — ghi 0x00 vào byte lock = lock block vĩnh viễn */

#define OTP_BASE         0x1FFF7800UL
#define OTP_LOCK_BASE    0x1FFF7A00UL
#define OTP_BLOCK_SIZE   32

/* Đọc version tối thiểu từ OTP (đếm số block đã lock) */
uint32_t get_minimum_allowed_version(void) {
    uint32_t count = 0;
    for (int i = 0; i < 16; i++) {
        uint8_t lock = *(volatile uint8_t *)(OTP_LOCK_BASE + i);
        if (lock == 0x00) count++;  /* Block bị lock = đã increment counter */
    }
    return count;
}

/* Increment counter khi update firmware thành công
 * (ghi và lock block tiếp theo trong OTP) */
int increment_version_counter(void) {
    uint32_t current = get_minimum_allowed_version();
    if (current >= 16) return -1;  /* Tối đa 16 lần update */

    /* Unlock Flash option bytes để ghi OTP */
    FLASH->KEYR = 0x45670123UL;
    FLASH->KEYR = 0xCDEF89ABUL;

    /* Ghi dữ liệu vào OTP block `current` */
    FLASH->CR |= FLASH_CR_PG;
    *(volatile uint32_t *)(OTP_BASE + current * OTP_BLOCK_SIZE) = 0xDEADBEEF;
    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->CR &= ~FLASH_CR_PG;

    /* Lock block bằng cách ghi 0x00 vào lock byte */
    FLASH->CR |= FLASH_CR_PG;
    *(volatile uint8_t *)(OTP_LOCK_BASE + current) = 0x00;
    while (FLASH->SR & FLASH_SR_BSY) { }
    FLASH->CR &= ~FLASH_CR_PG;

    FLASH->CR |= FLASH_CR_LOCK;
    return 0;
}
```

---

## Fault Injection Attacks vs Secure Boot

> [!warning] Fault Injection Bypass Techniques
>
> **1. Skip verify_signature() bằng voltage glitch**:
> ```text
> Normal execution:
>   verify_signature() → return 0 (OK) → jump_to_app()
>
> Với glitch ngay sau verify:
>   verify_signature() → [GLITCH: skip/corrupt return value] → jump_to_app()
>   → App boots dù signature invalid!
> ```
>
> **2. Flip kết quả so sánh**:
> ```text
> C code:  if (sig_valid != 0) { halt(); }
> Glitch vào lúc CPU đọc sig_valid từ memory → giá trị flip thành 0 → không halt
> ```
>
> **Countermeasures**:
>
> ```c
> /* Redundant check — harder to bypass with single glitch */
> int verify_result_1 = verify_signature(fw, key);
> int verify_result_2 = verify_signature(fw, key);  /* Verify twice */
> int verify_result_3 = verify_signature(fw, key);  /* Verify thrice */
>
> /* Majority vote — glitch phải hit cả 3 lần */
> if (verify_result_1 != 0 || verify_result_2 != 0 || verify_result_3 != 0) {
>     halt_and_lock();
> }
>
> /* Random delay trước verify để khó target glitch timing */
> add_random_delay(get_hardware_rng());
>
> /* Dùng hardware crypto accelerator (glitch harder) */
> use_hardware_ecdsa_verify(fw, sig, key);
> ```

> [!warning] TOCTOU trong Secure Boot
> ```c
> /* BUG: verify firmware ở Flash, nhưng flash có thể bị ghi lại
>  * giữa verify và jump (nếu WRP không set) */
> verify_firmware(FLASH_APP_ADDR);    /* Verify flash content */
> /* Attacker glitch → ghi flash ngay đây */
> jump_to_application(FLASH_APP_ADDR); /* Jump vào modified firmware! */
>
> /* FIX: WRP protect application flash, hoặc copy vào secure SRAM trước verify */
> ```

---

## Secure Boot với TrustZone-M

Trên ARMv8-M, Secure Boot integration mạnh hơn:

```text
Boot sequence với TrustZone-M:

1. ROM (Secure) → verify Secure Bootloader signature → load vào Secure Flash
2. Secure Bootloader → verify Secure Firmware signature → launch Secure World
3. Secure Firmware → verify Non-secure Firmware signature → launch Non-secure World
4. Non-secure Firmware running

Nếu bất kỳ bước nào fail → không launch Non-secure world
Non-secure world không thể chạy mà không được Secure world cho phép
```

---

## Checklist Secure Boot Implementation

> [!definition] Definition 23.2 — Secure Boot Checklist
>
> - [ ] ROM bootloader hoặc Stage 1 bootloader bất biến (WRP + RDP Level 2)
> - [ ] Public key hardcode trong immutable code — không load từ flash
> - [ ] Sử dụng ECDSA P-256 hoặc Ed25519 — không dùng HMAC (symmetric key)
> - [ ] SHA-256 hash trước khi verify signature
> - [ ] Constant-time comparison cho tất cả hash/signature so sánh
> - [ ] Verify **cả** hash **và** signature — không chỉ một trong hai
> - [ ] Anti-rollback counter trong OTP — không cho downgrade
> - [ ] Redundant verify (ít nhất 2 lần) để chống fault injection
> - [ ] Random delay trước verify để làm khó glitch timing
> - [ ] WRP cho application flash để ngăn TOCTOU
> - [ ] WWDG enable để reset nếu secure boot treo bất thường
> - [ ] Không in debug message khi verify fail — tránh information leakage

---

## Summary

- **Chain of trust**: ROM → Bootloader → Firmware, mỗi bước verify bước tiếp theo. Break một link = compromise toàn chain.
- **Hash-only**: kiểm tra integrity nhưng không authenticity. Dùng ECDSA signature + hash.
- **ECDSA P-256** phù hợp MCU: key 64 bytes, sig 64 bytes, verify ~200ms ở 168 MHz (tùy implementation).
- **Anti-rollback**: monotonic counter trong OTP — không cho cập nhật về version cũ.
- **Fault injection bypass**: glitch skip `if (sig_valid != 0)`. Countermeasure: redundant check, random delay, hardware accelerator.
- **TOCTOU**: verify flash rồi jump — nếu flash có thể ghi giữa hai bước → bypass. Dùng WRP hoặc copy vào secure buffer.
- Secure Boot trên TrustZone-M: Non-secure world chỉ chạy nếu Secure world cho phép.

---

## References

- ARM — *Platform Security Architecture Firmware Framework for M (FF-M)* (IHI0097)
- ARM — *Trusted Base System Architecture for M profile (TBSA-M)*
- STMicroelectronics — *AN4462: Introduction to STM32 microcontrollers security*
- micro-ecc library — github.com/kmackay/micro-ecc
- interrupt.memfault.com — *Secure Firmware Updates for Embedded Systems*
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 4–6 (Fault Injection vs Secure Boot)
- Johannes Obermaier, Marc Schink, Kosma Moczek — *One Exploit to Rule Them All: On the Security of Drop-in Replacement and Counterfeit Microcontrollers* (WOOT 2020)
