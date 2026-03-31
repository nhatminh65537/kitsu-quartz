---
title: "13. Timers & SysTick"
tags: [embedded, microcontroller, arm-cortex-m, lesson-13]
aliases: [Timers SysTick, PWM, Timer STM32]
created: 2026-03-24
---

> **Prerequisites**: [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]], [[12-gpio-exti|12. GPIO & EXTI]]
> **Objectives**:
> - Phân biệt SysTick, Basic Timer, General-Purpose Timer, Advanced Timer
> - Cấu hình timer để tạo periodic interrupt (time base)
> - Tạo PWM signal bằng Output Compare mode
> - Đo độ rộng xung bằng Input Capture mode
> - Nhận diện timing side-channel và timer-based attacks (TOCTOU, timing oracle)

---

## Motivation

Timer là peripheral quan trọng thứ hai sau GPIO — không có timer thì không có delay chính xác, không có PWM, không có đo tần số. Nhưng từ góc độ bảo mật, timer còn là nguồn gốc của nhiều lỗ hổng: hàm so sánh mật khẩu chạy nhanh hơn khi prefix đúng (timing oracle), critical section không disable interrupt đúng cách dẫn đến TOCTOU, hay timestamp dựa trên SysTick có thể bị wrap-around sau ~25 giây ở 168 MHz.

---

## SysTick — System Timer

SysTick là timer 24-bit tích hợp vào ARM core, có mặt trên mọi Cortex-M. Thường dùng làm OS tick hoặc delay reference.

> [!definition] Definition 13.1 — SysTick Registers
>
> | Register | Địa chỉ | Chức năng |
> |----------|---------|-----------|
> | `SYST_CSR` | `0xE000E010` | Control and Status: enable, tickint, clksource, countflag |
> | `SYST_RVR` | `0xE000E014` | Reload Value Register: giá trị nạp lại khi đếm về 0 |
> | `SYST_CVR` | `0xE000E018` | Current Value Register: giá trị đếm hiện tại (write any → clear) |
> | `SYST_CALIB` | `0xE000E01C` | Calibration: TENMS field = số tick trong 10ms |

**Cấu hình SysTick 1 ms interrupt tại 168 MHz**:

```c
/* SysTick clock source: HCLK (168 MHz) hoặc HCLK/8 (21 MHz) */
/* Dùng HCLK trực tiếp (CLKSOURCE=1):
 * Ticks cho 1ms = 168,000,000 / 1000 = 168,000
 * RVR = 168,000 - 1 = 167,999 (đếm từ RVR về 0 → 168,000 bước) */

void systick_init(void) {
    SysTick->LOAD = 167999UL;                /* Reload value */
    SysTick->VAL  = 0UL;                     /* Clear current value */
    SysTick->CTRL = SysTick_CTRL_CLKSOURCE_Msk   /* HCLK */
                  | SysTick_CTRL_TICKINT_Msk      /* Enable interrupt */
                  | SysTick_CTRL_ENABLE_Msk;      /* Start timer */
}

static volatile uint32_t tick_ms = 0;

void SysTick_Handler(void) {
    tick_ms++;
}

uint32_t get_tick(void) {
    return tick_ms;
}

void delay_ms(uint32_t ms) {
    uint32_t start = get_tick();
    while ((get_tick() - start) < ms) { }
}
```

> [!warning] Wrap-around của tick_ms
> `tick_ms` là `uint32_t` — wrap về 0 sau $2^{32}$ ms ≈ 49.7 ngày. Dùng phép trừ unsigned `(get_tick() - start) < ms` xử lý đúng wrap-around. **Không dùng** `get_tick() < start + ms` vì overflow khi `start + ms > 0xFFFFFFFF`.

**Dùng SysTick làm high-resolution timestamp (không interrupt)**:

```c
/* Đo thời gian thực thi function với độ phân giải nanosecond */
void benchmark(void) {
    /* Cấu hình SysTick free-running, không interrupt */
    SysTick->LOAD = 0xFFFFFF;    /* Max 24-bit: 16,777,215 */
    SysTick->VAL  = 0;
    SysTick->CTRL = SysTick_CTRL_CLKSOURCE_Msk
                  | SysTick_CTRL_ENABLE_Msk;   /* Không TICKINT */

    uint32_t start = SysTick->VAL;   /* Đếm ngược từ LOAD về 0 */

    /* Code cần đo */
    volatile uint32_t x = 0;
    for (int i = 0; i < 1000; i++) x += i;

    uint32_t end = SysTick->VAL;

    /* Tính số cycle (SysTick đếm ngược) */
    uint32_t cycles = (start >= end) ? (start - end)
                                     : (0xFFFFFF - end + start);
    /* Tại 168 MHz: 1 cycle = ~5.95 ns */
    (void)cycles;
}
```

---

## General-Purpose Timers (TIM2–TIM5, TIM9–TIM14)

STM32F4 có 14 timer, phân loại theo tính năng:

> [!definition] Definition 13.2 — Timer Types STM32F4
>
> | Loại | Timers | Counter | Channels | Đặc điểm |
> |------|--------|---------|----------|---------|
> | Basic | TIM6, TIM7 | 16-bit up | 0 | Chỉ time base, trigger DAC |
> | General-purpose | TIM2, TIM5 | **32-bit** up/down/center | 4 | IC, OC, PWM, encoder |
> | General-purpose | TIM3, TIM4 | 16-bit | 4 | IC, OC, PWM |
> | General-purpose | TIM9–TIM14 | 16-bit | 1–2 | Subset features |
> | Advanced | TIM1, TIM8 | 16-bit | 4+1 (break) | Complementary output, deadtime, break input |

**Cấu trúc timer General-Purpose (TIM2–TIM5)**:

```text
Timer clock (từ APB1/APB2 × 2)
       ↓
  [PSC: Prescaler ÷(PSC+1)]
       ↓
  CNT counter (up/down/center)
       ↓
  So sánh với ARR (Auto-Reload) → Overflow → Update event → Update interrupt
       ↓
  So sánh với CCR1/CCR2/CCR3/CCR4 → Capture/Compare event
       ↓
  Output: OC channel (PWM, toggle, forced)
  Input:  IC channel (capture timestamp khi có edge)
```

### Key Registers

```c
/* TIM2 registers (STM32F4, base = 0x40000000) */
TIM2->CR1;    /* Control 1: CEN (enable), DIR (up/down), CMS (center), ARPE */
TIM2->CR2;    /* Control 2: MMS (master mode selection) */
TIM2->SMCR;   /* Slave Mode Control: trigger input, slave mode */
TIM2->DIER;   /* DMA/Interrupt Enable: UIE, CC1IE, CC2IE... */
TIM2->SR;     /* Status: UIF (update), CC1IF (compare1), CC1OF (overcapture)... */
TIM2->EGR;    /* Event Generation: UG (re-init counter) */
TIM2->CCMR1;  /* Capture/Compare Mode 1 (ch1,ch2): OC mode, IC filter */
TIM2->CCMR2;  /* Capture/Compare Mode 2 (ch3,ch4) */
TIM2->CCER;   /* Capture/Compare Enable: CC1E (ch1 enable), CC1P (polarity) */
TIM2->CNT;    /* Counter value (32-bit for TIM2/TIM5) */
TIM2->PSC;    /* Prescaler */
TIM2->ARR;    /* Auto-Reload Register */
TIM2->CCR1;   /* Capture/Compare Register 1 */
TIM2->CCR2;   /* Capture/Compare Register 2 */
```

---

## Time Base — Periodic Interrupt

```c
/* TIM2: interrupt 100 Hz (mỗi 10ms) tại HCLK=168MHz, APB1=42MHz
 * Timer clock = APB1 × 2 = 84 MHz (vì APB1 prescaler ≠ 1)
 *
 * Muốn 10ms: f_tim = 100 Hz
 * PSC = 83 → f_cnt = 84MHz / (83+1) = 1 MHz (1µs/tick)
 * ARR = 9999 → overflow sau 10000 tick = 10 ms
 */
void tim2_init_timebase(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;

    TIM2->PSC  = 83;
    TIM2->ARR  = 9999;
    TIM2->EGR  = TIM_EGR_UG;        /* Force update event để load PSC/ARR */
    TIM2->SR   = 0;                  /* Clear update flag sau UG */
    TIM2->DIER = TIM_DIER_UIE;      /* Enable Update Interrupt */
    TIM2->CR1  = TIM_CR1_ARPE       /* ARR buffered */
               | TIM_CR1_CEN;       /* Enable counter */

    NVIC_SetPriority(TIM2_IRQn, 6);
    NVIC_EnableIRQ(TIM2_IRQn);
}

void TIM2_IRQHandler(void) {
    if (TIM2->SR & TIM_SR_UIF) {
        TIM2->SR &= ~TIM_SR_UIF;    /* Clear flag — PHẢI làm đầu tiên */
        /* Tác vụ 10ms */
    }
}
```

---

## PWM Output — Output Compare Mode

PWM (Pulse-Width Modulation) tạo xung có duty cycle thay đổi — dùng để điều khiển motor, LED dimming, servo.

```c
/* TIM3 CH1 → PA6 (AF2): PWM 1kHz, duty cycle 25%
 * Timer clock = 84 MHz, PSC=83 → 1MHz tick, ARR=999 → 1kHz
 * Duty 25% → CCR1 = 250 (high trong 250/1000 chu kỳ)
 */
void tim3_pwm_init(void) {
    /* Enable clocks */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;

    /* PA6 → AF2 (TIM3_CH1) */
    GPIOA->MODER  &= ~(3U << (6*2));
    GPIOA->MODER  |=  (2U << (6*2));       /* AF mode */
    GPIOA->AFR[0] &= ~(0xFU << (6*4));
    GPIOA->AFR[0] |=  (2U   << (6*4));     /* AF2 = TIM3 */

    /* Timer config */
    TIM3->PSC  = 83;
    TIM3->ARR  = 999;

    /* CH1: PWM mode 1 (OC1M=110), preload enable (OC1PE=1) */
    TIM3->CCMR1 = (6U << TIM_CCMR1_OC1M_Pos)   /* PWM mode 1 */
                | TIM_CCMR1_OC1PE;               /* Preload */

    /* Set duty cycle 25% */
    TIM3->CCR1 = 250;

    /* Enable CH1 output, active high */
    TIM3->CCER = TIM_CCER_CC1E;

    /* Force update và enable */
    TIM3->EGR = TIM_EGR_UG;
    TIM3->CR1 = TIM_CR1_ARPE | TIM_CR1_CEN;
}

/* Thay đổi duty cycle runtime */
void pwm_set_duty(uint32_t duty_permille) {
    /* duty_permille: 0–1000 = 0%–100% */
    TIM3->CCR1 = (duty_permille * (TIM3->ARR + 1)) / 1000;
}
```

---

## Input Capture — Đo Tần Số và Duty Cycle

Input Capture ghi lại giá trị `CNT` tại thời điểm có edge trên pin — dùng để đo period, frequency, pulse width.

```c
/* TIM4 CH1 → PB6 (AF2): đo period của xung input */
void tim4_ic_init(void) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN;
    RCC->APB1ENR |= RCC_APB1ENR_TIM4EN;

    /* PB6 → AF2 (TIM4_CH1) */
    GPIOB->MODER  &= ~(3U << (6*2));
    GPIOB->MODER  |=  (2U << (6*2));
    GPIOB->AFR[0] &= ~(0xFU << (6*4));
    GPIOB->AFR[0] |=  (2U   << (6*4));

    /* PSC=83, ARR=0xFFFF → 1µs resolution */
    TIM4->PSC = 83;
    TIM4->ARR = 0xFFFF;

    /* CH1: Input Capture, rising edge, no filter, no prescaler
     * CCMR1: CC1S=01 (IC1 mapped to TI1), IC1F=0000, IC1PSC=00 */
    TIM4->CCMR1 = (1U << TIM_CCMR1_CC1S_Pos);

    /* Enable CH1, rising edge (CC1P=0) */
    TIM4->CCER = TIM_CCER_CC1E;

    /* Enable CC1 interrupt */
    TIM4->DIER = TIM_DIER_CC1IE;
    TIM4->CR1  = TIM_CR1_CEN;

    NVIC_SetPriority(TIM4_IRQn, 5);
    NVIC_EnableIRQ(TIM4_IRQn);
}

static uint32_t last_capture = 0;
static uint32_t period_us    = 0;

void TIM4_IRQHandler(void) {
    if (TIM4->SR & TIM_SR_CC1IF) {
        TIM4->SR &= ~TIM_SR_CC1IF;
        uint32_t now = TIM4->CCR1;             /* Lưu timestamp edge */
        period_us    = now - last_capture;     /* Period = khoảng cách 2 edge */
        last_capture = now;
    }
}
```

---

## Timing Side-Channel — Attack Surface

> [!warning] Timing Oracle — Non-Constant-Time Comparison
> Hàm so sánh mật khẩu hoặc MAC naive có timing phụ thuộc vào nội dung:
>
> ```c
> /* BỊ TẤN CÔNG — thoát sớm khi byte đầu sai */
> int check_password_bad(const uint8_t *input, const uint8_t *secret, size_t len) {
>     for (size_t i = 0; i < len; i++) {
>         if (input[i] != secret[i]) return 0;  /* Return sớm → timing leak */
>     }
>     return 1;
> }
>
> /* AN TOÀN — constant time, luôn duyệt hết */
> int check_password_ct(const uint8_t *input, const uint8_t *secret, size_t len) {
>     uint8_t diff = 0;
>     for (size_t i = 0; i < len; i++) {
>         diff |= input[i] ^ secret[i];   /* Gom tất cả diff, không short-circuit */
>     }
>     return (diff == 0);
> }
> ```
>
> Attacker dùng timer có độ phân giải cao (SysTick ở 168 MHz → ~6 ns/tick) để đo thời gian response, suy ra từng byte của secret. Trên MCU không có OS noise → timing rất ổn định → attack hiệu quả hơn cả trên server.

> [!warning] SysTick Wrap-Around trong Security Context
> `SysTick->VAL` là 24-bit đếm ngược, wrap sau $2^{24}/168\text{MHz} \approx 99.8$ ms. Nếu dùng SysTick để implement timeout security (ví dụ "lock sau 3 lần sai trong 60 giây"), wrap-around có thể làm counter reset sai → bypass lockout.

---

## Summary

- **SysTick**: timer 24-bit tích hợp ARM core, dùng cho OS tick và high-resolution timestamp. Wrap sau ~100ms ở 168 MHz — dùng phép trừ unsigned để xử lý đúng.
- **Timer types**: Basic (chỉ time base), General-Purpose (IC/OC/PWM, 16/32-bit), Advanced (complementary PWM, break input).
- **Time base**: PSC chia clock → CNT đếm → so sánh với ARR → overflow interrupt.
- **PWM**: Output Compare mode 6 (PWM1) — CHn HIGH khi CNT < CCRn, LOW khi CNT ≥ CCRn. Thay đổi duty cycle runtime = ghi vào CCRn.
- **Input Capture**: hardware tự ghi CNT vào CCRn khi có edge → đo period bằng hiệu 2 capture liên tiếp.
- **Timing side-channel**: hàm so sánh naive có thời gian phụ thuộc data → dùng constant-time comparison. SysTick wrap-around → không dùng để implement security timeout đơn giản.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 18 (General-purpose timers), Ch. 22 (Advanced timers)
- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section B3.3 (SysTick)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 19 (Timers)
- interrupt.memfault.com — *Cortex-M SysTick and Timing*
- Paul Kocher — *Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems* (1996)
