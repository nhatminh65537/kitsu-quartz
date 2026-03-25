---
title: "22. TrustZone-M (ARMv8-M)"
tags: [embedded, microcontroller, arm-cortex-m, lesson-22]
aliases: [TrustZone, ARMv8-M, Secure World, NSC]
created: 2026-03-24
---

> **Prerequisites**: [[07-mpu-memory-protection|07. MPU — Memory Protection Unit]], [[08-exception-model-nvic|08. Exception Model & NVIC]]
> **Objectives**:
> - Hiểu TrustZone-M: Secure world / Non-secure world và hardware isolation
> - Nắm SAU (Security Attribution Unit) và IDAU — phân vùng địa chỉ
> - Hiểu Non-Secure Callable (NSC) gate — cơ chế gọi Secure từ Non-secure
> - Phân tích attack surface của TrustZone-M: confused deputy, NSC abuse, IRQ injection
> - Phân biệt TrustZone-M với TrustZone-A (Cortex-A) về mô hình bảo mật

---

## Motivation

TrustZone-M (ARMv8-M) là bước tiến quan trọng trong bảo mật MCU — tạo ra hardware isolation giữa "Secure world" (chạy secure firmware, xử lý key, thực hiện crypto) và "Non-secure world" (chạy application thông thường, có thể bị compromise). Ngay cả khi Non-secure code bị khai thác hoàn toàn, Secure world vẫn an toàn về mặt hardware.

Chips như STM32L5, nRF9160, LPC55Sxx, và nhiều MCU IoT hiện đại đều dùng TrustZone-M. Hiểu nó từ góc độ tấn công là cần thiết khi audit các thiết bị này.

---

## TrustZone-M — Hai Thế giới Song song

> [!definition] Definition 22.1 — Secure và Non-secure World
>
> ```text
> ┌──────────────────────────────────────────────────────────────┐
> │                    ARMv8-M SoC                               │
> │                                                              │
> │  ┌─────────────────────────┐  ┌──────────────────────────┐  │
> │  │    SECURE WORLD         │  │   NON-SECURE WORLD        │  │
> │  │                         │  │                           │  │
> │  │ - Secure firmware        │  │ - Application firmware    │  │
> │  │ - Crypto keys           │  │ - RTOS tasks              │  │
> │  │ - Attestation           │  │ - Network stack           │  │
> │  │ - Secure boot           │  │ - User application        │  │
> │  │                         │  │                           │  │
> │  │ Secure SRAM             │  │ Non-secure SRAM           │  │
> │  │ Secure Flash            │  │ Non-secure Flash          │  │
> │  │ Secure peripherals      │  │ Non-secure peripherals    │  │
> │  └──────────┬──────────────┘  └─────────────┬─────────────┘  │
> │             │ NSC (Veneer)                   │               │
> │             └───────────────────────────────►│               │
> │                                                              │
> │  Hardware enforced: Non-secure CANNOT access Secure memory   │
> └──────────────────────────────────────────────────────────────┘
> ```
>
> Không giống MPU (software configurable, có thể bypass nếu privileged code bị compromise), TrustZone-M là **hardware-enforced** — ngay cả privileged code trong Non-secure world cũng không thể đọc Secure memory.

---

## SAU — Security Attribution Unit

SAU là hardware block xác định vùng địa chỉ nào thuộc Secure hay Non-secure:

> [!definition] Definition 22.2 — SAU Registers
>
> | Register | Địa chỉ | Chức năng |
> |----------|---------|-----------|
> | `SAU_CTRL` | `0xE000EDD0` | Enable SAU, ALLNS (all = Non-secure when disabled) |
> | `SAU_TYPE` | `0xE000EDD4` | Read-only: số region SAU có |
> | `SAU_RNR`  | `0xE000EDD8` | Region Number Register (chọn region) |
> | `SAU_RBAR` | `0xE000EDDC` | Region Base Address |
> | `SAU_RLAR` | `0xE000EDE0` | Region Limit Address + Enable + NSC flag |
>
> SAU RLAR bit 1 (NSC): 0 = Secure, 1 = **Non-Secure Callable** (NSC).

**Cấu hình SAU**:

```c
/* Cấu hình SAU: chia địa chỉ 0x08000000–0x0FFFFFFF */

void sau_init(void) {
    /* Disable SAU trong khi cấu hình */
    SAU->CTRL = 0;

    /* Region 0: 0x00000000–0x0FFFFFFF = Secure (Flash + ITCM) */
    SAU->RNR  = 0;
    SAU->RBAR = 0x00000000UL;
    SAU->RLAR = 0x0FFFFFC0UL | SAU_RLAR_ENABLE_Msk;   /* Secure */

    /* Region 1: 0x08040000–0x0807FFFF = Non-Secure Callable (NSC veneer) */
    SAU->RNR  = 1;
    SAU->RBAR = 0x08040000UL;
    SAU->RLAR = 0x0807FFC0UL | SAU_RLAR_NSC_Msk | SAU_RLAR_ENABLE_Msk;

    /* Region 2: 0x20000000–0x2003FFFF = Non-secure SRAM */
    SAU->RNR  = 2;
    SAU->RBAR = 0x20000000UL;
    SAU->RLAR = 0x2003FFC0UL | SAU_RLAR_ENABLE_Msk;
    /* Không set NSC → Non-secure */

    /* Region 3: 0x40000000–0x4FFFFFFF = Non-secure Peripherals */
    SAU->RNR  = 3;
    SAU->RBAR = 0x40000000UL;
    SAU->RLAR = 0x4FFFFFC0UL | SAU_RLAR_ENABLE_Msk;

    /* Enable SAU */
    SAU->CTRL = SAU_CTRL_ENABLE_Msk;
    __DSB();
    __ISB();
}
```

---

## IDAU — Implementation Defined Attribution Unit

IDAU là hardware complement của SAU — do silicon vendor định nghĩa (không configurable bởi firmware):

> [!definition] Definition 22.3 — SAU vs IDAU Priority
> Kết quả cuối cùng của security attribution = **intersection** của SAU và IDAU:
>
> ```text
> SAU result   IDAU result   Final result
> Secure       Secure        → Secure
> Secure       Non-secure    → Non-secure  (IDAU wins)
> Non-secure   Secure        → Non-secure  (SAU wins to non-secure)
> NSC          Secure        → NSC
> NSC          Non-secure    → Non-secure
> ```
>
> Trên nhiều chip (nRF9160, LPC55S), IDAU hardcode một phần layout. Ví dụ trên LPC55S: `0x10000000`–`0x1FFFFFFF` luôn là Secure alias của `0x00000000`–`0x0FFFFFFF` bất kể SAU.

---

## NSC — Non-Secure Callable Gate

NSC là cơ chế duy nhất cho phép Non-secure code gọi Secure function một cách an toàn:

> [!definition] Definition 22.4 — NSC Veneer và CMSE
>
> Non-secure code **không thể** gọi trực tiếp vào Secure memory. Nó phải gọi qua **veneer** (một đoạn code nhỏ đặt trong vùng NSC):
>
> ```text
> Non-secure code          NSC region              Secure region
> BL secure_api_veneer  →  BXNS (branch to Secure)  →  secure_api_impl()
>                          ↑ ARM validates this is NSC entry
> ```
>
> ARM C Security Extension (CMSE): `__attribute__((cmse_nonsecure_entry))` đánh dấu function có thể được gọi từ Non-secure.

**Định nghĩa Secure API với CMSE**:

```c
/* secure_api.c — compiled as Secure code */
#include <arm_cmse.h>

/* Function này có thể được gọi từ Non-secure */
__attribute__((cmse_nonsecure_entry))
int32_t secure_encrypt(const uint8_t *plaintext, uint32_t len,
                       uint8_t *ciphertext) {
    /* Validate pointers: chúng phải trỏ vào Non-secure memory */
    if (!cmse_check_address_range((void *)plaintext, len, CMSE_NONSECURE)) {
        return -1;   /* Pointer trỏ vào Secure memory → reject! */
    }
    if (!cmse_check_address_range(ciphertext, len, CMSE_NONSECURE | CMSE_MPU_READWRITE)) {
        return -1;
    }

    /* Thực hiện crypto trên Secure side */
    aes_encrypt_internal(plaintext, len, ciphertext, secure_key);
    return 0;
}

/* Function chỉ dùng trong Secure world */
static void aes_encrypt_internal(const uint8_t *in, uint32_t len,
                                  uint8_t *out, const uint8_t *key) {
    /* ... */
}
```

**Non-secure code gọi Secure API**:

```c
/* nonsecure_app.c — compiled as Non-secure code */
/* Import declaration của Secure function */
extern int32_t secure_encrypt(const uint8_t *plaintext, uint32_t len,
                               uint8_t *ciphertext) __attribute__((cmse_nonsecure_call));

void app_encrypt_data(void) {
    uint8_t data[16] = { /* ... */ };
    uint8_t encrypted[16];

    int ret = secure_encrypt(data, 16, encrypted);
    /* Secure key không bao giờ tiếp xúc với Non-secure code */
}
```

---

## Secure vs Non-secure Interrupts

TrustZone-M phân chia interrupt thành Secure và Non-secure:

> [!definition] Definition 22.5 — Interrupt Security Attribution
> NVIC trong ARMv8-M có thêm **Interrupt Target Non-secure Register (ITNS)**:
> - ITNS bit = 0 → IRQ thuộc Secure world
> - ITNS bit = 1 → IRQ thuộc Non-secure world
>
> Khi Non-secure IRQ xảy ra trong khi CPU đang chạy Secure code: CPU **save Secure context**, switch về Non-secure, xử lý IRQ, rồi return về Secure.

```c
/* Assign UART1 IRQ cho Non-secure world */
NVIC->ITNS[1] |= (1U << (USART1_IRQn - 32));  /* USART1_IRQn=37, word 1 bit 5 */

/* Assign TIM2 IRQ cho Secure world (default) */
NVIC->ITNS[1] &= ~(1U << (TIM2_IRQn - 32));
```

---

## TrustZone-M Attack Surface

> [!warning] Confused Deputy Attack
> Non-secure code cung cấp pointer trỏ vào Secure memory (thay vì Non-secure) khi gọi NSC function. Nếu Secure code không validate pointer → Secure code đọc/ghi Secure memory theo lệnh của Non-secure attacker.
>
> ```c
> /* Secure API BỊ TẤN CÔNG — không validate pointer */
> __attribute__((cmse_nonsecure_entry))
> void bad_api(uint8_t *buf, uint32_t len) {
>     memcpy(output_buf, buf, len);  /* buf có thể là Secure address! */
> }
>
> /* Non-secure exploit */
> bad_api((uint8_t *)0x10000000, 32);  /* Đọc 32 bytes từ Secure Flash! */
> ```
>
> **Fix**: Luôn dùng `cmse_check_address_range()` cho mọi pointer nhận từ Non-secure.

> [!warning] IRQ Injection Attack
> Nếu một IRQ được assign cho Non-secure world nhưng handler có bug (stack overflow, command injection), attacker trong Non-secure có thể trigger IRQ liên tục → khai thác bug trong IRQ handler → leo lên Secure context nếu IRQ inadvertently được set as Secure.

> [!warning] Secure World Không Phải Vô Địch
> TrustZone-M bảo vệ Secure code khỏi software attack từ Non-secure. Nhưng:
> - **Physical attacks** (glitch, EM, power analysis) vẫn có thể extract Secure key
> - **Secure code bugs**: nếu Secure firmware có buffer overflow → attacker trong Non-secure exploit qua confused deputy
> - **DMA**: DMA không bị filter bởi SAU/IDAU trên một số chip → DMA từ Non-secure peripheral có thể đọc Secure memory nếu không có IDAU/firewall bổ sung

---

## So sánh TrustZone-M vs TrustZone-A

> [!definition] Definition 22.6 — TrustZone-M vs TrustZone-A
>
> | | TrustZone-A (Cortex-A) | TrustZone-M (Cortex-M ARMv8-M) |
> |--|----------------------|-------------------------------|
> | MCU target | Application processor (Raspberry Pi, phone SoC) | Microcontroller (STM32L5, nRF9160) |
> | OS | Linux + Secure OS (OP-TEE) | Bare-metal hoặc RTOS |
> | Memory | Virtual memory, MMU | Physical address, SAU |
> | Switch mechanism | SMC instruction (EL3) | BXNS/BLXNS instruction |
> | Interrupt model | Monitor mode | NVIC với ITNS |
> | Complexity | Rất cao | Thấp hơn |
> | Attack surface | Larger (full OS) | Smaller (bare-metal) |

---

## Summary

- **TrustZone-M**: hardware-enforced isolation giữa Secure và Non-secure world trên ARMv8-M. Khác MPU — ngay cả privileged Non-secure code không qua được.
- **SAU** (firmware-configurable) + **IDAU** (silicon-vendor-defined) xác định security của từng vùng địa chỉ.
- **NSC veneer**: cổng duy nhất Non-secure → Secure. CMSE attribute `cmse_nonsecure_entry` tạo safe entry point.
- **Luôn validate pointer** từ Non-secure trước khi dùng trong Secure context — `cmse_check_address_range()`.
- Attack surface: confused deputy (pointer không validate), IRQ injection, physical attack vẫn có thể bypass.
- TrustZone-M bảo vệ key và algorithm khỏi software attack, nhưng **không bảo vệ khỏi side-channel vật lý**.

---

## References

- ARM — *ARMv8-M Architecture Reference Manual* (ARM DDI 0553)
- ARM — *Trusted Base System Architecture for M profile* (TBSA-M)
- embeddedsecurity.io — *Embedded Systems Security and TrustZone* (full book)
- STMicroelectronics — *STM32L5 Reference Manual* (TrustZone section)
- Thomas Fossati, Hannes Tschofenig — *Trusted Execution Environments on ARMv8-M Microcontrollers* (2020)
- Johannes Obermaier — *Bypassing TrustZone on ARM Cortex-M Devices* research
