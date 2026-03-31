---
title: "17. ADC & DAC"
tags: [embedded, microcontroller, arm-cortex-m, lesson-17]
aliases: [ADC, DAC, Analog Digital Converter]
created: 2026-03-24
---

> **Prerequisites**: [[13-timers-systick|13. Timers & SysTick]], [[18-dma-controller|18. DMA Controller]]
> **Objectives**:
> - Hiểu nguyên lý SAR ADC: successive approximation, resolution, sampling time
> - Cấu hình ADC1 STM32F4 single conversion và continuous mode
> - Dùng DMA circular buffer để thu thập ADC liên tục không tốn CPU
> - Hiểu DAC output trên STM32: resolution, alignment, DMA waveform generation
> - Nhận diện analog side-channel: power trace, EM emission, và cách đo signal tampering

---

## Motivation

ADC và DAC là cầu nối giữa thế giới analog (nhiệt độ, áp suất, điện áp, âm thanh) và thế giới số của MCU. Từ góc độ bảo mật: power trace trong side-channel attack chính là signal analog đo bằng oscilloscope — hiểu ADC giúp bạn hiểu cách attacker thu thập và xử lý signal đó. Ngoài ra, một số hệ thống dùng ADC để đọc "tamper detection sensor" — điện áp thay đổi khi board bị mở → hiểu ADC giúp phân tích các cơ chế anti-tamper này.

---

## Nguyên lý SAR ADC

> [!definition] Definition 17.1 — Successive Approximation Register (SAR) ADC
> SAR ADC là loại ADC phổ biến nhất trong MCU. Nguyên lý: **binary search** điện áp đầu vào.
>
> **Thuật toán**:
> 1. Set bit MSB = 1, các bit còn lại = 0 → tạo điện áp thử $V_{trial} = V_{ref}/2$
> 2. So sánh $V_{in}$ với $V_{trial}$:
>    - $V_{in} > V_{trial}$ → giữ bit đó = 1
>    - $V_{in} < V_{trial}$ → clear bit đó = 0
> 3. Dịch xuống bit tiếp theo, lặp lại
> 4. Sau N bước → ra kết quả N-bit
>
> STM32F4 ADC là **12-bit** → $2^{12} = 4096$ mức, mỗi conversion cần 12+ clock cycles.
>
> $$V_{in} = \frac{\text{ADC\_value}}{2^{12} - 1} \times V_{ref} = \frac{\text{ADC\_value}}{4095} \times 3.3\text{V}$$

### Các tham số quan trọng

| Tham số | Giá trị STM32F4 | Ý nghĩa |
|---------|----------------|---------|
| Resolution | 12-bit (configurable: 6/8/10/12) | Số mức phân giải |
| Reference voltage | VDDA (= VDD thường 3.3V) hoặc VREF+ | Điện áp tham chiếu |
| Max input voltage | 0V đến VDDA | Ngoài range → ADC bị clip |
| Max ADC clock | 36 MHz | fAPB2 / prescaler |
| Sampling time | 3–480 ADC cycles | Thời gian charge capacitor sample |
| Conversion time | Sampling + 12 cycles | Tổng thời gian 1 conversion |

---

## ADC Registers STM32F4

STM32F4 có 3 ADC dùng chung register **ADC_Common** và có register riêng:

> [!definition] Definition 17.2 — ADC Register Set (ADC1)
>
> | Register | Offset | Chức năng |
> |----------|--------|-----------|
> | `SR`   | 0x00 | EOC (end of conversion), STRT, OVR, AWD |
> | `CR1`  | 0x04 | RES (resolution), EOCIE, AWDEN, SCAN, DISCEN |
> | `CR2`  | 0x08 | ADON (enable), CONT (continuous), DMA, ALIGN, SWSTART, EXTEN |
> | `SMPR1`| 0x0C | Sampling time channel 10–18 (3 bits each) |
> | `SMPR2`| 0x10 | Sampling time channel 0–9 |
> | `SQR1` | 0x2C | Sequence length L[3:0], channel 13–16 |
> | `SQR2` | 0x30 | Channel 7–12 trong regular sequence |
> | `SQR3` | 0x34 | Channel 1–6 trong regular sequence (SQ1 = first) |
> | `DR`   | 0x4C | Data Register: kết quả conversion (read-only) |

**ADC Common registers (base 0x40012300)**:

```c
#define ADC_CCR  (*(volatile uint32_t *)0x40012304)
/* Bits [17:16]: ADCPRE — ADC prescaler: 00=/2, 01=/4, 10=/6, 11=/8 */
/* Bits [15:14]: DMA mode cho multi-ADC */
/* Bit 23: TSVREFE — enable temperature sensor và VREFINT channel */
```

---

## Single Conversion — Polling Mode

```c
/* ADC1 Channel 1 (PA1): single conversion, 12-bit, polling */

void adc1_init(void) {
    /* 1. Enable clocks */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_ADC1EN;

    /* 2. PA1 = analog mode (MODER=11, no pull) */
    GPIOA->MODER |= (3U << (1*2));      /* Analog */
    GPIOA->PUPDR &= ~(3U << (1*2));     /* No pull */

    /* 3. ADC clock = APB2/4 = 84/4 = 21 MHz (< 36 MHz max) */
    ADC->CCR &= ~ADC_CCR_ADCPRE;
    ADC->CCR |= ADC_CCR_ADCPRE_0;      /* ADCPRE=01: /4 */

    /* 4. ADC1 config: 12-bit, single conversion */
    ADC1->CR1 &= ~ADC_CR1_RES;         /* RES=00: 12-bit */
    ADC1->CR1 &= ~ADC_CR1_SCAN;        /* Không scan */

    ADC1->CR2 &= ~ADC_CR2_CONT;        /* Single mode */
    ADC1->CR2 &= ~ADC_CR2_EXTEN;       /* Software trigger */
    ADC1->CR2 &= ~ADC_CR2_ALIGN;       /* Right aligned */

    /* 5. Sampling time channel 1: 84 cycles (SMPR2 bits [5:3]) */
    ADC1->SMPR2 &= ~(7U << (1*3));
    ADC1->SMPR2 |=  (5U << (1*3));     /* 5=84 cycles */

    /* 6. Regular sequence: 1 conversion, channel 1 */
    ADC1->SQR1  &= ~ADC_SQR1_L;        /* L=0: 1 conversion */
    ADC1->SQR3  &= ~ADC_SQR3_SQ1;
    ADC1->SQR3  |=  (1U << 0);         /* SQ1=1: channel 1 */

    /* 7. Enable ADC */
    ADC1->CR2   |= ADC_CR2_ADON;

    /* 8. Stabilization delay (~10µs) */
    for (volatile int i = 0; i < 1000; i++) { }
}

uint16_t adc1_read(void) {
    ADC1->CR2 |= ADC_CR2_SWSTART;                    /* Start conversion */
    while (!(ADC1->SR & ADC_SR_EOC)) { }             /* Chờ EOC */
    return (uint16_t)(ADC1->DR & 0x0FFF);            /* 12-bit result */
}

/* Chuyển sang voltage (mV) */
uint32_t adc_to_mv(uint16_t adc_val) {
    return (uint32_t)adc_val * 3300UL / 4095UL;      /* 3300mV reference */
}
```

---

## Continuous Mode + DMA Circular Buffer

Đây là cách dùng ADC hiệu quả nhất — ADC chạy liên tục, DMA tự động lưu kết quả, CPU không cần polling.

```c
#define ADC_BUF_SIZE   256
static volatile uint16_t adc_buf[ADC_BUF_SIZE];

void adc1_dma_init(void) {
    /* ADC init giống trên, thêm CONT và DMA */
    adc1_init();                           /* Base init */

    ADC1->CR2 |= ADC_CR2_CONT;            /* Continuous mode */
    ADC1->CR2 |= ADC_CR2_DDS;             /* DMA disable selection: keep DMA request */
    ADC1->CR2 |= ADC_CR2_DMA;             /* Enable DMA request */

    /* DMA2 Stream0 Channel0 (ADC1 → memory) */
    RCC->AHB1ENR |= RCC_AHB1ENR_DMA2EN;

    DMA2_Stream0->CR = 0;
    while (DMA2_Stream0->CR & DMA_SxCR_EN) { }   /* Chờ disable */

    DMA2_Stream0->PAR  = (uint32_t)&ADC1->DR;     /* Peripheral addr */
    DMA2_Stream0->M0AR = (uint32_t)adc_buf;        /* Memory addr */
    DMA2_Stream0->NDTR = ADC_BUF_SIZE;             /* Number of data */
    DMA2_Stream0->CR   = (0U  << DMA_SxCR_CHSEL_Pos)  /* Channel 0 */
                       | (1U  << DMA_SxCR_PL_Pos)     /* Priority: medium */
                       | (1U  << DMA_SxCR_MSIZE_Pos)  /* Memory size: 16-bit */
                       | (1U  << DMA_SxCR_PSIZE_Pos)  /* Peripheral size: 16-bit */
                       | DMA_SxCR_MINC                 /* Memory increment */
                       | DMA_SxCR_CIRC                 /* Circular mode */
                       | DMA_SxCR_EN;                  /* Enable */

    ADC1->CR2 |= ADC_CR2_SWSTART;         /* Start continuous conversion */
}

/* Đọc giá trị trung bình từ circular buffer (averaging noise reduction) */
uint16_t adc_get_average(void) {
    uint32_t sum = 0;
    for (int i = 0; i < ADC_BUF_SIZE; i++) {
        sum += adc_buf[i];
    }
    return (uint16_t)(sum / ADC_BUF_SIZE);
}
```

---

## Đọc Nhiệt Độ Nội và VREFINT

STM32F4 có sensor nhiệt độ và internal reference voltage trên channel đặc biệt:

```c
/* Enable temperature sensor và VREFINT */
ADC->CCR |= ADC_CCR_TSVREFE;

/* Đọc nhiệt độ (channel 16) */
void adc_read_temp(int32_t *temp_c) {
    /* Set sequence: channel 16, sampling time 480 cycles (bắt buộc ≥ 10µs) */
    ADC1->SQR3 = 16U;
    ADC1->SMPR1 &= ~(7U << ((16-10)*3));
    ADC1->SMPR1 |=  (7U << ((16-10)*3));   /* 7 = 480 cycles */

    ADC1->CR2 |= ADC_CR2_SWSTART;
    while (!(ADC1->SR & ADC_SR_EOC)) { }
    uint16_t raw = (uint16_t)(ADC1->DR & 0xFFF);

    /* Công thức từ datasheet (TS_CAL1 và TS_CAL2 là calibration values trong flash) */
    uint16_t ts_cal1 = *((uint16_t*)0x1FFF7A2C);  /* 30°C calibration */
    uint16_t ts_cal2 = *((uint16_t*)0x1FFF7A2E);  /* 110°C calibration */
    *temp_c = (int32_t)(110 - 30) * (raw - ts_cal1) / (ts_cal2 - ts_cal1) + 30;
}
```

> [!note] VREFINT cho Power Monitoring
> Channel 17 = VREFINT (~1.21V internal reference). Đọc VREFINT giúp tính toán chính xác VDD khi VDD dao động — hữu ích cho power analysis firmware.

---

## DAC — Digital-to-Analog Converter

STM32F4 có DAC 12-bit với 2 channel (DAC1=PA4, DAC2=PA5):

> [!definition] Definition 17.3 — DAC Operation
> DAC chuyển giá trị số 12-bit thành điện áp:
>
> $$V_{out} = \frac{\text{DAC\_value}}{2^{12}} \times V_{ref} = \frac{\text{DAC\_value}}{4096} \times 3.3\text{V}$$
>
> Data alignment: Right-aligned 12-bit (0x000–0xFFF) hoặc Left-aligned (0x000–0xFFF0).

```c
/* Cấu hình DAC Channel 1 (PA4) output */
void dac1_init(void) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB1ENR |= RCC_APB1ENR_DACEN;

    /* PA4 = analog */
    GPIOA->MODER |= (3U << (4*2));

    /* Enable DAC channel 1, no trigger, no output buffer disable */
    DAC->CR = DAC_CR_EN1;
}

/* Set output voltage trực tiếp */
void dac1_set(uint16_t value_12bit) {
    DAC->DHR12R1 = value_12bit & 0xFFF;   /* Right-aligned 12-bit */
}

/* Tạo sine wave bằng DMA + Timer trigger */
static const uint16_t sine_lut[64] = {
    2048, 2248, 2445, 2637, 2820, 2993, 3151, 3291,
    3412, 3511, 3587, 3639, 3666, 3667, 3642, 3591,
    3516, 3417, 3298, 3160, 3007, 2842, 2668, 2489,
    2309, 2132, 1962, 1802, 1657, 1529, 1420, 1333,
    1271, 1233, 1220, 1233, 1271, 1333, 1420, 1529,
    1657, 1802, 1962, 2132, 2309, 2489, 2668, 2842,
    3007, 3160, 3298, 3417, 3516, 3591, 3642, 3667,
    3666, 3639, 3587, 3511, 3412, 3291, 3151, 2993,
};

void dac1_sine_dma_init(void) {
    dac1_init();

    /* Trigger DAC bằng TIM6 TRGO */
    DAC->CR &= ~DAC_CR_EN1;
    DAC->CR = DAC_CR_TEN1                  /* Trigger enable */
            | (0U << DAC_CR_TSEL1_Pos)    /* TSEL=000: TIM6 TRGO */
            | DAC_CR_DMAEN1;               /* DMA enable */
    DAC->CR |= DAC_CR_EN1;

    /* DMA1 Stream5 Channel7 (DAC1) */
    RCC->AHB1ENR |= RCC_AHB1ENR_DMA1EN;
    DMA1_Stream5->CR = 0;
    DMA1_Stream5->PAR  = (uint32_t)&DAC->DHR12R1;
    DMA1_Stream5->M0AR = (uint32_t)sine_lut;
    DMA1_Stream5->NDTR = 64;
    DMA1_Stream5->CR   = (7U << DMA_SxCR_CHSEL_Pos)   /* Channel 7 */
                       | (1U << DMA_SxCR_MSIZE_Pos)   /* Memory: 16-bit */
                       | (1U << DMA_SxCR_PSIZE_Pos)   /* Peripheral: 16-bit */
                       | DMA_SxCR_MINC
                       | DMA_SxCR_CIRC
                       | DMA_SxCR_DIR_0                /* Memory to peripheral */
                       | DMA_SxCR_EN;

    /* TIM6 trigger: 1kHz × 64 samples = 15.625 Hz sine wave */
    RCC->APB1ENR |= RCC_APB1ENR_TIM6EN;
    TIM6->PSC = 0;
    TIM6->ARR = (84000000UL / (1000UL * 64UL)) - 1;  /* 84MHz / 64kHz */
    TIM6->CR2 = TIM_CR2_MMS_1;        /* MMS=010: TRGO on Update */
    TIM6->CR1 = TIM_CR1_CEN;
}
```

---

## Analog Side-Channel — Kết nối với Power Analysis

> [!warning] Analog Measurement và Side-Channel Attack
> Trong power side-channel attack (Bài 11), attacker đo power consumption của MCU bằng oscilloscope hoặc ADC tốc độ cao. Đây chính là signal analog:
>
> ```text
> Setup đơn giản:
> VDD ──[10Ω shunt]── MCU VCC
>                │
>               ─┴─ Oscilloscope channel hoặc ChipWhisperer ADC
>
> ChipWhisperer dùng ADC 10-bit, 100 MS/s để capture power trace
> → tốc độ đủ để thấy từng instruction của MCU tại 7 MHz
> ```
>
> Hiểu ADC sampling rate và aliasing giúp bạn hiểu tại sao ChipWhisperer capture ở tần số cao — Nyquist theorem: phải sample ≥ 2× tần số tín hiệu cần quan sát.

### Signal Tampering Detection bằng ADC

Một số secure device dùng ADC để monitor điện áp nguồn — phát hiện voltage glitch:

```c
/* Đọc VDD qua VREFINT để detect voltage glitch */
uint32_t read_vdd_mv(void) {
    /* Đọc VREFINT (channel 17, nominal 1.21V) */
    ADC1->SQR3 = 17U;
    ADC1->CR2 |= ADC_CR2_SWSTART;
    while (!(ADC1->SR & ADC_SR_EOC)) { }
    uint16_t vrefint_raw = (uint16_t)(ADC1->DR & 0xFFF);

    /* VREFINT_CAL = factory calibration ở 3.3V (địa chỉ trong flash) */
    uint16_t vrefint_cal = *((uint16_t*)0x1FFF7A2A);

    /* VDD = 3300mV × VREFINT_CAL / vrefint_raw */
    return (uint32_t)3300 * vrefint_cal / vrefint_raw;
}

void check_vdd_tamper(void) {
    uint32_t vdd = read_vdd_mv();
    if (vdd < 2800 || vdd > 3600) {
        /* VDD ngoài range bình thường → có thể đang bị glitch */
        /* Trigger security response: zeroize keys, reset */
        trigger_security_alert();
    }
}
```

---

## Summary

- **SAR ADC** dùng binary search để convert: 12-bit STM32F4 → 4096 mức, V = ADC × VREF / 4095.
- Sampling time phải đủ dài để charge capacitor: ít nhất 84 cycles cho impedance cao.
- **Continuous + DMA circular**: ADC chạy liên tục, DMA lưu tự động, CPU chỉ đọc buffer → không miss sample, không tốn CPU.
- **DAC 12-bit**: output = value × VREF / 4096. DMA + Timer trigger → generate waveform tự động (sine, triangle...).
- **Temperature sensor** (channel 16) cần ≥ 480 cycles sampling, dùng factory calibration từ flash.
- **Analog side-channel**: ADC tốc độ cao capture power trace → extract key material. `VREFINT` (channel 17) dùng để monitor VDD → detect voltage glitch tamper.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 11 (ADC), Ch. 14 (DAC)
- STMicroelectronics — *STM32F405 Datasheet* — Temperature sensor và VREFINT calibration
- Colin O'Flynn — *ChipWhisperer Documentation* — ADC capture và power analysis
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 21 (ADC)
- Paul Kocher et al. — *Differential Power Analysis*, CRYPTO 1999
