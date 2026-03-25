---
title: "11. Power Management"
tags: [embedded, microcontroller, arm-cortex-m, lesson-11]
aliases: [Power Management, Sleep Mode, Low Power]
created: 2026-03-24
---

> **Prerequisites**: [[08-exception-model-nvic|08. Exception Model & NVIC]], [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]]
> **Objectives**:
> - Phân biệt các chế độ năng lượng thấp: Sleep, Stop, Standby trên STM32
> - Hiểu power domains và clock gating trong từng mode
> - Cấu hình wakeup source đúng cách (interrupt, EXTI, RTC alarm)
> - Nhận diện power side-channel: tại sao power trace tiết lộ thông tin bí mật
> - Hiểu sơ lược Simple Power Analysis (SPA) và Differential Power Analysis (DPA)

---

## Motivation

Power management không chỉ là vấn đề tiết kiệm pin — nó còn là attack surface. Mọi instruction CPU thực thi đều tiêu thụ điện theo pattern đặc trưng. Khi MCU thực hiện phép XOR với key bí mật, power trace có peak khác với khi thực hiện ADD. Đây là nền tảng của **power side-channel attacks** — kỹ thuật extract secret key mà không cần đọc flash hay debug interface.

Đồng thời, hiểu sleep mode giúp bạn phát hiện các sơ hở: thiết bị IoT ngủ với JTAG còn bật, hay wakeup từ UART nhưng không xác thực đầu vào.

---

## Power Domains trên STM32F4

STM32F4 có nhiều power domain độc lập:

> [!definition] Definition 11.1 — Power Domains STM32F4
>
> ```text
> VDD domain (1.8V–3.6V):
> ├── Core domain (V_CORE — internal regulator):
> │   ├── CPU, DMA, memories (Flash, SRAM)
> │   └── Peripherals trên AHB/APB
> └── Backup domain (V_BAT):
>     ├── RTC (Real-Time Clock)
>     ├── Backup SRAM (4KB)
>     └── LSE oscillator
> ```
>
> Backup domain duy trì hoạt động kể cả khi VDD mất — chỉ cần V_BAT (pin đồng hồ hoặc supercap). Quan trọng: **Backup SRAM không bị xóa khi reset** → attacker có thể để lại data ở đây qua power cycle.

---

## Các Chế độ Low Power

> [!definition] Definition 11.2 — Sleep, Stop, Standby Modes
>
> | Mode | CPU | Clock | SRAM | Peripheral | Wakeup time | Điện tiêu thụ |
> |------|-----|-------|------|-----------|------------|--------------|
> | **Run** | ON | Full | ON | ON | — | ~100 mA (168 MHz) |
> | **Sleep** | OFF | ON | ON | ON | ~1 µs | ~10–50 mA |
> | **Stop** | OFF | OFF (HSI/HSE off) | ON | OFF (có ngoại lệ) | ~10 µs | ~1–2 mA |
> | **Standby** | OFF | OFF | OFF (trừ Backup) | OFF | ~2 µs (wakeup từ reset) | ~2–30 µA |

### Sleep Mode

CPU dừng, nhưng AHB/APB clock và peripheral vẫn chạy. ISR vẫn hoạt động bình thường — chỉ là main thread không chạy.

```c
/* Vào Sleep mode — wakeup bởi bất kỳ interrupt nào */
void enter_sleep(void) {
    /* Đảm bảo không có pending interrupt bị miss */
    __DSB();
    __WFI();    /* Wait For Interrupt — CPU sleep, wakeup khi có IRQ */
}

/* WFE variant — wakeup bởi event (interrupt hoặc SEV instruction) */
void enter_sleep_wfe(void) {
    __DSB();
    __WFE();    /* Wait For Event */
}
```

### Stop Mode

Hầu hết clock bị tắt (HSI và HSE off). Chỉ LSI/LSE còn chạy (nếu enable). SRAM và register được giữ nguyên.

```c
#include "stm32f4xx_hal.h"

void enter_stop_mode(void) {
    /* Cấu hình PWR_CR: PDDS=0 (Stop mode, không phải Standby) */
    PWR->CR &= ~PWR_CR_PDDS;

    /* Chọn voltage regulator trong Stop: Low-power mode để giảm điện */
    PWR->CR |= PWR_CR_LPDS;

    /* Set SLEEPDEEP bit trong SCB để chọn deep sleep */
    SCB->SCR |= SCB_SCR_SLEEPDEEP_Msk;

    __DSB();
    __WFI();    /* CPU vào Stop mode */

    /* Sau wakeup: SCB->SCR SLEEPDEEP phải clear, clock phải reinit */
    SCB->SCR &= ~SCB_SCR_SLEEPDEEP_Msk;

    /* Reinit system clock vì HSE/PLL đã tắt */
    clock_init_168mhz();
}
```

### Standby Mode

Power domain V_CORE bị tắt hoàn toàn. SRAM bị mất. Chỉ Backup domain còn sống. Wakeup = hardware reset → startup code chạy lại từ đầu.

```c
void enter_standby_mode(void) {
    /* Set PDDS = 1 (Standby mode) */
    PWR->CR |= PWR_CR_PDDS;

    /* Clear wakeup flag từ lần trước */
    PWR->CR |= PWR_CR_CWUF;

    /* Set SLEEPDEEP */
    SCB->SCR |= SCB_SCR_SLEEPDEEP_Msk;

    __DSB();
    __WFI();

    /* Không bao giờ đến đây sau __WFI() trong Standby */
    while (1) { }
}
```

---

## Wakeup Sources

| Mode | Wakeup Source |
|------|--------------|
| Sleep | Bất kỳ interrupt nào được enable trong NVIC |
| Stop | EXTI line (external pin, RTC alarm, USB wakeup, USART, I2C) |
| Standby | WKUP pin (PA0), RTC alarm/wakeup, NRST pin, IWDG reset |

**Cấu hình EXTI wakeup cho Stop mode**:

```c
/* Cấu hình PA0 (EXTI line 0) làm wakeup source */
void configure_wakeup_pin(void) {
    /* Enable GPIOA clock */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;

    /* PA0 = input với pull-up */
    GPIOA->MODER  &= ~(3U << 0);   /* Input mode */
    GPIOA->PUPDR  &= ~(3U << 0);
    GPIOA->PUPDR  |=  (1U << 0);   /* Pull-up */

    /* Enable SYSCFG clock (cần cho EXTI routing) */
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;

    /* Route EXTI0 → GPIOA (SYSCFG_EXTICR1, bits [3:0] = 0 = GPIOA) */
    SYSCFG->EXTICR[0] &= ~SYSCFG_EXTICR1_EXTI0;

    /* Trigger trên falling edge */
    EXTI->FTSR |= EXTI_FTSR_TR0;
    EXTI->RTSR &= ~EXTI_RTSR_TR0;

    /* Unmask EXTI0 */
    EXTI->IMR |= EXTI_IMR_MR0;

    /* Enable EXTI0 IRQ trong NVIC */
    NVIC_EnableIRQ(EXTI0_IRQn);
    NVIC_SetPriority(EXTI0_IRQn, 0);
}

void EXTI0_IRQHandler(void) {
    EXTI->PR |= EXTI_PR_PR0;   /* Clear pending flag */
    /* Wakeup xử lý tại đây */
}
```

---

## Power Consumption Profiling

Để tối ưu điện, cần biết mỗi peripheral tiêu thụ bao nhiêu. Nguyên tắc: **disable clock của peripheral không dùng**.

```c
/* Tắt peripheral không cần thiết sau khi dùng xong */
void disable_unused_peripherals(void) {
    /* Tắt ADC nếu không cần đo liên tục */
    RCC->APB2ENR &= ~RCC_APB2ENR_ADC1EN;

    /* Tắt DMA nếu transfer xong */
    RCC->AHB1ENR &= ~RCC_AHB1ENR_DMA1EN;

    /* Tắt GPIO port không dùng (nhớ set pin về analog input trước) */
    GPIOB->MODER = 0xFFFFFFFF;    /* Analog mode cho tất cả pin — giảm leakage */
    RCC->AHB1ENR &= ~RCC_AHB1ENR_GPIOBEN;
}
```

---

## Power Side-Channel — Nền tảng

> [!definition] Definition 11.3 — Power Side-Channel Attack
> Mọi instruction CPU thực thi đều tiêu thụ năng lượng tỷ lệ với số **bit chuyển từ 0→1 và 1→0** trong các register và bus (Hamming Weight / Hamming Distance model). Attacker đo power trace → suy ngược ra data đang được xử lý.

**Hamming Weight Model**:

$$P(t) \approx \alpha \cdot HW(\text{data}(t)) + \beta + \text{noise}$$

Trong đó $HW(x)$ = số bit 1 trong $x$ (Hamming Weight). Nếu data là byte của AES key XOR plaintext, power consumption phụ thuộc trực tiếp vào key.

### Simple Power Analysis (SPA)

Quan sát **một trace** để đọc ra thông tin — hiệu quả khi algorithm có branch phụ thuộc vào secret:

```text
Ví dụ RSA square-and-multiply:
if (bit_i == 1):
    result = square(result)     ← power trace dài hơn
    result = multiply(result)
else:
    result = square(result)     ← power trace ngắn hơn

→ Nhìn power trace thấy rõ pattern → biết từng bit của private key
```

### Differential Power Analysis (DPA)

Thu thập **nhiều trace** với plaintext khác nhau, dùng thống kê để loại bỏ noise:

```text
1. Giả sử key byte K[i] = k (brute-force từng giá trị k)
2. Dùng model: predicted_power = HW(AES_sbox[plaintext[i] XOR k])
3. Chia tập trace thành 2 nhóm dựa trên bit nào đó của predicted_power
4. Tính mean(group1) - mean(group0)
5. Nếu k đúng → có peak rõ ràng tại thời điểm byte đó được xử lý
6. Nếu k sai → chỉ có noise
```

> [!warning] Security Note — Power Side-Channel trên MCU
> MCU không có các biện pháp chống power side-channel như server (power randomization, noise injection). Một thiết lập đơn giản:
> - Oscilloscope 200 MHz hoặc ChipWhisperer (~$300)
> - Điện trở shunt 10Ω nối tiếp với VDD của target
> - Thu 1000–10000 traces
>
> Đủ để extract AES-128 key từ implementation không có countermeasure chỉ trong vài phút. Đây là lý do crypto trên embedded phải dùng **masking** (random noise injection vào intermediate values) hoặc hardware crypto accelerator với countermeasure tích hợp.

**Ví dụ bị tấn công — naive AES**:

```c
/* Bị tấn công bởi DPA */
void aes_vulnerable(uint8_t *plaintext, uint8_t *key, uint8_t *ciphertext) {
    uint8_t state[16];
    for (int i = 0; i < 16; i++) {
        state[i] = sbox[plaintext[i] ^ key[i]];  /* ← power peak tại đây */
    }
    /* ... tiếp theo ... */
}

/* Có countermeasure cơ bản — masking */
void aes_masked(uint8_t *plaintext, uint8_t *key, uint8_t *ciphertext, uint8_t mask) {
    uint8_t state[16];
    for (int i = 0; i < 16; i++) {
        /* XOR với random mask → power không còn tương quan với key */
        state[i] = sbox[plaintext[i] ^ key[i]] ^ mask;
    }
    /* Cần unmask sau này — phức tạp hơn nhưng an toàn hơn */
}
```

---

## Kiểm tra Power Configuration qua GDB

```gdb
# Xem PWR_CR — power control register
(gdb) x/wx 0x40007000    # PWR->CR
# Bit 0: LPDS — Low-power deepsleep (voltage regulator low-power trong Stop)
# Bit 1: PDDS — Power-down deepsleep (0=Stop, 1=Standby)
# Bit 2: CWUF — Clear wakeup flag

# Xem PWR_CSR — power control/status register
(gdb) x/wx 0x40007004    # PWR->CSR
# Bit 0: WUF  — Wakeup flag (1 = wakeup đã xảy ra)
# Bit 1: SBF  — Standby flag (1 = đang wakeup từ Standby)
# Bit 2: PVDO — PVD output (1 = VDD dưới ngưỡng)

# Xem SCB_SCR — sleep mode config
(gdb) x/wx 0xE000ED10    # SCB->SCR
# Bit 1: SLEEPONEXIT — sleep sau ISR return
# Bit 2: SLEEPDEEP   — deep sleep (Stop/Standby thay vì Sleep)
# Bit 4: SEVONPEND   — wakeup khi có event pending
```

---

## Summary

- Ba chế độ low power: **Sleep** (CPU off, peripheral on), **Stop** (clock off, SRAM on), **Standby** (V_CORE off, SRAM mất).
- Vào deep sleep: set `SCB->SCR.SLEEPDEEP`, cấu hình `PWR->CR.PDDS`, gọi `__WFI()`. Sau Stop phải reinit clock.
- **Backup domain** (V_BAT) không bị xóa khi reset — attack surface để persistence.
- **Power side-channel**: mỗi instruction tiêu thụ điện theo Hamming Weight của data xử lý. SPA đọc từ 1 trace, DPA dùng thống kê nhiều trace để extract key.
- Countermeasure: masking intermediate values, hardware crypto accelerator, noise injection.
- Bên cạnh bảo mật, JTAG/SWD thường vẫn còn bật khi device ở sleep mode → attacker có thể dump memory trong khi device "đang ngủ".

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 5 (Power Controller)
- ARM — *ARMv7-M Architecture Reference Manual*, WFI/WFE instructions
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 8–12 (Power Analysis)
- Colin O'Flynn — *ChipWhisperer tutorials* — SPA/DPA labs (chipwhisperer.readthedocs.io)
- Paul Kocher et al. — *Differential Power Analysis* (1999), CRYPTO '99
