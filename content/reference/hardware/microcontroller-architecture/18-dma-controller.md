---
title: "18. DMA Controller"
tags: [embedded, microcontroller, arm-cortex-m, lesson-18]
aliases: [DMA, Direct Memory Access]
created: 2026-03-24
---

> **Prerequisites**: [[04-memory-map-mmio|04. Memory Map & Memory-Mapped I/O]], [[08-exception-model-nvic|08. Exception Model & NVIC]]
> **Objectives**:
> - Hiểu DMA là bus master độc lập — không phụ thuộc CPU và không bị MPU chặn
> - Nắm cấu trúc DMA2 STM32F4: 2 controller, 8 stream, 8 channel mỗi stream
> - Cấu hình DMA cho M2M, M2P, P2M transfer
> - Hiểu double-buffer mode và circular mode
> - Nhận diện DMA race condition, DMA-based MPU bypass, và DMA attack trên firmware

---

## Motivation

DMA (Direct Memory Access) là một trong những tính năng quan trọng nhất của MCU hiện đại — và cũng là một trong những attack surface ít được hiểu nhất. Nhắc lại từ Bài 07: **DMA không bị kiểm soát bởi MPU của CPU**. Nếu firmware có lỗ hổng cho phép attacker kiểm soát DMA configuration (source/destination/count), họ có thể đọc hoặc ghi bất kỳ vùng nhớ nào — kể cả kernel stack, vector table, hay secret key — mà MPU không thể ngăn chặn.

---

## DMA là gì và tại sao cần

> [!definition] Definition 18.1 — Direct Memory Access
> DMA là **bus master độc lập** có khả năng truyền dữ liệu giữa memory và peripheral (hoặc memory với memory) **mà không cần CPU**. CPU chỉ cần cấu hình DMA một lần, sau đó có thể làm việc khác hoặc ngủ.
>
> ```text
> Không có DMA (CPU-driven):
> UART_RX → CPU ISR đọc DR → CPU ghi RAM → lặp lại
> CPU bị chiếm liên tục, mỗi byte 1 interrupt
>
> Có DMA (hardware-driven):
> UART_RX → DMA tự động đọc DR → DMA ghi RAM → (CPU ngủ)
> CPU chỉ bị wake up khi buffer đầy hoặc half-full
> ```

**So sánh CPU transfer vs DMA transfer**:

| | CPU Polling | CPU Interrupt | DMA |
|--|------------|--------------|-----|
| CPU usage | 100% | Cao (nhiều ISR) | Thấp (chỉ setup + done IRQ) |
| Latency | Thấp | Vừa | Vừa (setup overhead) |
| Throughput | Giới hạn bởi ISR | Tốt | Tốt nhất |
| Use case | Debug, đơn giản | General | High-speed peripheral |

---

## STM32F4 DMA Architecture

> [!definition] Definition 18.2 — DMA Controllers và Streams
>
> STM32F4 có **2 DMA controller** (DMA1 và DMA2), mỗi cái có **8 stream** (luồng dữ liệu độc lập). Mỗi stream có thể chọn 1 trong 8 **channel** (kết nối với peripheral cụ thể).
>
> ```text
> DMA1 (AHB1 bus):
>   Stream 0: SPI3_RX, I2C1_RX, TIM4_CH1, I2S3_EXT_RX, TIM4_UP, I2C1_RX
>   Stream 1: TIM2_UP/CH3, TIM7_UP, I2S3_EXT_TX, I2C1_TX, UART5_TX...
>   ...
>
> DMA2 (AHB1 bus, kết nối AHB matrix):
>   Stream 0: ADC1, SPI1_RX, SPI4_RX, TIM1_TRIG, TIM8_CH1...
>   Stream 1: DCMI, ADC3, SPI4_TX, USART6_RX...
>   Stream 2: TIM8_CH1/2/3, USART1_RX, SPI6_RX...
>   Stream 4: ADC1, SPI3_TX, UART5_TX, USART3_TX, TIM3_CH4...
>   Stream 5: SPI6_TX, CRYPT_OUT, DCMI, USART1_RX, TIM1_UP...
>   Stream 6: TIM1_CH1/2/3/TRIG, SPI6_TX, USART6_TX...
>   Stream 7: DCMI, USART1_TX, HASH_IN, USART6_TX, TIM8_CH4/TRIG/COM...
> ```
>
> **Mapping quan trọng cho embedded security**:
> - DMA2 Stream0 Ch0 → **ADC1** (power analysis capture)
> - DMA1 Stream5 Ch4 → **USART2_RX** (UART receive buffer)
> - DMA1 Stream3 Ch0 → **SPI2_RX** (SPI flash read)

---

## DMA Stream Registers

Mỗi DMA stream có tập registers riêng tại `DMA_BASE + 0x10 + stream × 0x18`:

> [!definition] Definition 18.3 — DMA Stream Registers
>
> | Register | Offset | Chức năng |
> |----------|--------|-----------|
> | `SxCR`  | +0x00 | Configuration: CHSEL, PL, MSIZE, PSIZE, MINC, PINC, CIRC, DIR, TCIE, HTIE, EN |
> | `SxNDTR`| +0x04 | Number of Data Items to transfer |
> | `SxPAR` | +0x08 | Peripheral Address Register |
> | `SxM0AR`| +0x0C | Memory 0 Address Register |
> | `SxM1AR`| +0x10 | Memory 1 Address Register (double-buffer) |
> | `SxFCR` | +0x14 | FIFO Control Register |

**SxCR — Configuration Register, các bit quan trọng**:

```text
Bits [27:25]: CHSEL — Channel selection (0–7)
Bits [17:16]: PL    — Priority Level (00=Low, 01=Medium, 10=High, 11=Very High)
Bits [14:13]: MSIZE — Memory data size (00=Byte, 01=HalfWord, 10=Word)
Bits [12:11]: PSIZE — Peripheral data size (same encoding)
Bit  10:      MINC  — Memory increment mode (1=increment after each transfer)
Bit  9:       PINC  — Peripheral increment mode (thường =0: fixed address)
Bit  8:       CIRC  — Circular mode (reload NDTR khi về 0)
Bits [7:6]:   DIR   — Direction (00=P2M, 01=M2P, 10=M2M)
Bit  4:       TCIE  — Transfer Complete Interrupt Enable
Bit  3:       HTIE  — Half Transfer Interrupt Enable
Bit  0:       EN    — Enable stream
```

---

## Cấu hình DMA — P2M (USART1_RX)

```c
#define USART1_RX_BUF_SIZE 256
static volatile uint8_t uart_rx_dma_buf[USART1_RX_BUF_SIZE];

void usart1_rx_dma_init(void) {
    /* Đảm bảo USART1 đã init (Bài 14) */
    RCC->AHB1ENR |= RCC_AHB1ENR_DMA2EN;

    /* DMA2 Stream2 Channel4 = USART1_RX */
    DMA2_Stream2->CR = 0;
    while (DMA2_Stream2->CR & DMA_SxCR_EN) { }  /* Chờ disable hoàn toàn */

    DMA2_Stream2->PAR  = (uint32_t)&USART1->DR;          /* Source: USART1 DR */
    DMA2_Stream2->M0AR = (uint32_t)uart_rx_dma_buf;       /* Dest: RAM buffer */
    DMA2_Stream2->NDTR = USART1_RX_BUF_SIZE;

    DMA2_Stream2->CR = (4U  << DMA_SxCR_CHSEL_Pos)        /* Channel 4 */
                     | (0U  << DMA_SxCR_PL_Pos)           /* Priority: Low */
                     | (0U  << DMA_SxCR_MSIZE_Pos)        /* Memory: Byte */
                     | (0U  << DMA_SxCR_PSIZE_Pos)        /* Peripheral: Byte */
                     | DMA_SxCR_MINC                       /* Increment memory */
                     | DMA_SxCR_CIRC                       /* Circular mode */
                     | DMA_SxCR_TCIE                       /* TC interrupt */
                     | DMA_SxCR_HTIE;                      /* HT interrupt */
    /* DIR=00: P2M (default) */

    /* Enable DMA trên USART1 */
    USART1->CR3 |= USART_CR3_DMAR;

    /* Enable DMA stream */
    DMA2_Stream2->CR |= DMA_SxCR_EN;

    /* Enable interrupt */
    NVIC_SetPriority(DMA2_Stream2_IRQn, 5);
    NVIC_EnableIRQ(DMA2_Stream2_IRQn);
}

/* ISR: NDTR giảm từ 256 xuống 0 → TC interrupt */
void DMA2_Stream2_IRQHandler(void) {
    if (DMA2->LISR & DMA_LISR_TCIF2) {
        DMA2->LIFCR = DMA_LIFCR_CTCIF2;          /* Clear TC flag */
        /* Buffer đầy — process uart_rx_dma_buf */
    }
    if (DMA2->LISR & DMA_LISR_HTIF2) {
        DMA2->LIFCR = DMA_LIFCR_CHTIF2;          /* Clear HT flag */
        /* Half buffer đầy — process first half trong khi DMA fill second half */
    }
}
```

---

## Circular Mode và Double-Buffer

### Circular Mode

Khi NDTR về 0, DMA tự động reload về giá trị ban đầu và tiếp tục — không cần CPU re-arm. Kết hợp với HTIE (Half Transfer) và TCIE (Transfer Complete), tạo thành **ping-pong buffer**:

```text
Circular buffer với HTIE + TCIE:

Buffer [0 ......... 127 | 128 ......... 255]
       ↑                  ↑
       HTIF fires          TCIF fires
       (CPU xử lý          (CPU xử lý
        first half)         second half)

DMA liên tục fill → CPU luôn có nửa buffer cũ để xử lý
Không có data gap khi hoạt động đúng
```

### Double-Buffer Mode

Double-buffer mode dùng **hai memory region khác nhau** (M0AR và M1AR), DMA tự động switch sau mỗi transfer:

```c
static uint8_t buf0[128], buf1[128];

void dma_double_buffer_init(void) {
    /* ... setup DMA2 Stream ... */
    DMA2_Stream0->M0AR = (uint32_t)buf0;
    DMA2_Stream0->M1AR = (uint32_t)buf1;

    DMA2_Stream0->CR |= DMA_SxCR_DBM;    /* Enable double-buffer mode */
    DMA2_Stream0->CR |= DMA_SxCR_EN;
}

void DMA2_Stream0_IRQHandler(void) {
    /* Kiểm tra CT bit (Current Target): 0=đang dùng M0AR, 1=đang dùng M1AR */
    if (DMA2_Stream0->CR & DMA_SxCR_CT) {
        /* DMA đang ghi vào buf1 → CPU xử lý buf0 an toàn */
        process_buffer(buf0, 128);
    } else {
        /* DMA đang ghi vào buf0 → CPU xử lý buf1 an toàn */
        process_buffer(buf1, 128);
    }
    /* Clear interrupt flags */
    DMA2->LIFCR = DMA_LIFCR_CTCIF0 | DMA_LIFCR_CHTIF0;
}
```

---

## M2M Transfer — Memory to Memory

DMA có thể copy block memory mà không cần peripheral — nhanh hơn `memcpy` bằng CPU vì dùng bus master riêng:

```c
/* Copy 1KB từ src sang dst bằng DMA2 Stream0 */
void dma_memcpy(void *dst, const void *src, uint32_t size_bytes) {
    RCC->AHB1ENR |= RCC_AHB1ENR_DMA2EN;

    DMA2_Stream0->CR = 0;
    while (DMA2_Stream0->CR & DMA_SxCR_EN) { }

    DMA2_Stream0->PAR  = (uint32_t)src;
    DMA2_Stream0->M0AR = (uint32_t)dst;
    DMA2_Stream0->NDTR = size_bytes;

    DMA2_Stream0->CR = (0U << DMA_SxCR_CHSEL_Pos)  /* Channel 0 */
                     | DMA_SxCR_MINC                 /* Increment memory (dst) */
                     | DMA_SxCR_PINC                 /* Increment peripheral (src) */
                     | (2U << DMA_SxCR_DIR_Pos)      /* DIR=10: M2M */
                     | DMA_SxCR_TCIE
                     | DMA_SxCR_EN;

    /* Chờ transfer xong (polling) */
    while (!(DMA2->LISR & DMA_LISR_TCIF0)) { }
    DMA2->LIFCR = DMA_LIFCR_CTCIF0;
}
```

> [!note] DMA2 là cái duy nhất hỗ trợ M2M trên STM32F4
> DMA1 chỉ kết nối với APB1 peripherals và không có M2M capability. DMA2 kết nối với cả APB2 và có M2M.

---

## DMA Race Condition — Lỗi Firmware Phổ biến

> [!warning] DMA Race Condition
> DMA và CPU cùng truy cập một buffer mà không có synchronization:
>
> ```c
> /* BUG: CPU đọc buffer trong khi DMA vẫn đang ghi */
> void process_adc_data(void) {
>     uint16_t val = adc_buf[0];     /* CPU đọc tại đây */
>     /* DMA ghi đồng thời vào adc_buf[0] → giá trị bị corrupt! */
>     compute(val);
> }
>
> /* ĐÚNG: Dùng HTIF/TCIF để biết nửa nào DMA đang dùng */
> volatile uint8_t dma_half = 0;   /* 0=first half, 1=second half đang được DMA fill */
>
> void DMA_IRQHandler(void) {
>     if (DMA->ISR & HTIF) {
>         dma_half = 0;   /* DMA đang fill second half */
>         /* → CPU an toàn đọc first half */
>     }
>     if (DMA->ISR & TCIF) {
>         dma_half = 1;   /* DMA bắt đầu fill first half lại */
>         /* → CPU an toàn đọc second half */
>     }
> }
> ```

---

## DMA Attack Surface

> [!warning] DMA-based MPU Bypass — Điểm Cực Kỳ Quan Trọng
> Nhắc lại: **DMA không bị kiểm soát bởi CPU MPU**. DMA là bus master độc lập — nó truy cập memory qua AHB bus matrix, bypass hoàn toàn MPU của CPU.
>
> **Kịch bản tấn công**:
>
> 1. **Attacker kiểm soát DMA config** (qua arbitrary write hoặc UART command injection):
>    ```text
>    DMA2_Stream0->PAR  = 0x08000000   ← Flash (firmware)
>    DMA2_Stream0->M0AR = attacker_buf ← RAM dưới kiểm soát
>    DMA2_Stream0->NDTR = 0x100000     ← Dump toàn bộ 1MB flash
>    DMA2_Stream0->CR  |= DMA_SxCR_EN ← Trigger!
>    → Toàn bộ firmware được copy ra RAM → attacker đọc được
>    ```
>
> 2. **Write arbitrary vào kernel**: thay PAR và M0AR, trigger → DMA ghi vào vector table, stack, hay security flag.
>
> 3. **DMA peripheral attack**: set PAR = USART1->DR, M0AR = secret key location, trigger copy → exfiltrate qua UART.
>
> **Countermeasure**:
> - Restrict DMA configuration register access: chỉ privileged code mới set PAR/M0AR
> - Dùng MPU region readonly cho DMA config registers (khó)
> - Kiểm tra PAR/M0AR range trước khi enable DMA
> - Sử dụng IOMMU (chỉ có trên SoC lớn, không phải MCU thường)

### DMA TOCTOU (Time-Of-Check Time-Of-Use)

```text
Kịch bản: firmware kiểm tra input buffer rồi mới xử lý

T1: CPU check: if (buf[0] == CMD_SAFE) → pass
              ↑ buffer trông an toàn
T2: DMA ghi vào buf[0] = CMD_DANGEROUS  ← attacker trigger DMA sau check
T3: CPU execute: execute_command(buf[0]) → thực thi CMD_DANGEROUS!

Đây là TOCTOU race condition qua DMA.
```

---

## Interrupt Flags và Clearing

DMA interrupt flags nằm trong các registers ISR/LIFSR/HISR riêng — **không** nằm trong stream register:

```c
/* DMA2 interrupt status registers */
/* LISR: Stream 0–3 (Low) */
/* HISR: Stream 4–7 (High) */

/* Clear flags của Stream 2 trong DMA2 */
DMA2->LIFCR = DMA_LIFCR_CTCIF2    /* Clear TC flag stream 2 */
            | DMA_LIFCR_CHTIF2    /* Clear HT flag stream 2 */
            | DMA_LIFCR_CTEIF2    /* Clear TE (Transfer Error) flag */
            | DMA_LIFCR_CDMEIF2   /* Clear DME (Direct Mode Error) flag */
            | DMA_LIFCR_CFEIF2;   /* Clear FE (FIFO Error) flag */
```

---

## Summary

- DMA là **bus master độc lập** — truyền dữ liệu giữa memory và peripheral mà không cần CPU.
- STM32F4: 2 DMA controller, mỗi cái 8 stream, mỗi stream 8 channel. Phải tra **channel mapping** trong Reference Manual để biết peripheral nào dùng stream/channel nào.
- **Transfer types**: P2M (peripheral → memory), M2P (memory → peripheral), M2M (memory copy, chỉ DMA2).
- **Circular mode**: tự reload NDTR → không cần CPU re-arm. Kết hợp HTIE + TCIE → ping-pong buffer.
- **Double-buffer mode**: hai memory region (M0AR/M1AR) tự switch sau mỗi transfer → zero-copy processing.
- **DMA race condition**: CPU và DMA cùng truy cập buffer không đồng bộ → data corruption.
- **DMA không bị MPU**: đây là bypass vector quan trọng nhất. Attacker kiểm soát DMA config → đọc/ghi bất kỳ địa chỉ nào kể cả Flash, vector table, secret key.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 9 (DMA Controller)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 14 (DMA)
- interrupt.memfault.com — *A Practical Guide to DMA on ARM Cortex-M*
- embeddedsecurity.io — *Embedded Systems Security and TrustZone* (DMA attack section)
- Coursera — *Embedded Software and Hardware Architecture* (DMA module)
