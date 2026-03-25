---
title: "14. UART/USART"
tags: [embedded, microcontroller, arm-cortex-m, lesson-14]
aliases: [UART, USART, Serial Communication]
created: 2026-03-24
---

> **Prerequisites**: [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]], [[12-gpio-exti|12. GPIO & EXTI]]
> **Objectives**:
> - Hiểu UART framing: start bit, data bits, parity, stop bit
> - Tính và cấu hình baud rate register (BRR)
> - Implement UART polling, interrupt, và DMA mode từ register
> - Nhận diện tên chân TX/RX/RTS/CTS và cách kết nối với logic analyzer
> - Phân tích UART sniffing, command injection, và debug console attack

---

## Motivation

UART là giao thức serial đơn giản và phổ biến nhất trong embedded — hầu như mọi MCU đều có ít nhất một UART. Quan trọng hơn, **UART thường là cửa sau** của embedded device: firmware developer thường để lại debug console qua UART in production, đọc được log hệ thống, thậm chí có shell truy cập. Hardware hacker đầu tiên làm gì khi cầm một IoT device? Tìm UART trên PCB.

---

## UART Framing — Cách Dữ liệu Được Truyền

> [!definition] Definition 14.1 — UART Frame Format
> UART truyền từng byte độc lập, không có clock riêng — hai bên phải đồng ý baud rate trước.
>
> ```text
> Idle:  ──────────────────────────────── HIGH (line nghỉ)
>
> Frame: ──┐  D0  D1  D2  D3  D4  D5  D6  D7  ┌── HIGH
>          └──────────────────────────────────┘
>         START                              STOP
>          bit                               bit
>         (LOW)                             (HIGH)
>
> Ví dụ truyền byte 0x41 ('A' = 0b01000001):
> ──┐ 1  0  0  0  0  0  1  0 ┌──
>   └────────────────────────┘
>  START  LSB→MSB          STOP
> ```
>
> **Các tham số cấu hình**:
> - **Baud rate**: số bit/giây (9600, 115200, 460800...)
> - **Data bits**: thường 8 (7 hoặc 9 ít gặp)
> - **Parity**: None / Even / Odd
> - **Stop bits**: 1 hoặc 2
>
> Ký hiệu: `115200 8N1` = 115200 baud, 8 data bits, No parity, 1 stop bit

---

## USART Registers STM32F4

> [!definition] Definition 14.2 — USART Register Set
>
> | Register | Offset | Chức năng |
> |----------|--------|-----------|
> | `SR`  | 0x00 | Status: TXE, TC, RXNE, ORE, FE, NE, PE, IDLE |
> | `DR`  | 0x04 | Data Register: đọc = nhận, ghi = truyền |
> | `BRR` | 0x08 | Baud Rate Register: MANTISSA[15:4] + FRACTION[3:0] |
> | `CR1` | 0x0C | Control 1: UE, M, PCE, PS, TXEIE, RXNEIE, TE, RE |
> | `CR2` | 0x10 | Control 2: STOP bits, CLKEN (synchronous mode) |
> | `CR3` | 0x14 | Control 3: DMAT, DMAR, RTSE, CTSE (flow control) |
> | `GTPR`| 0x18 | Guard time và prescaler (IrDA/Smartcard mode) |

**Status Register (SR) — các bit thường dùng**:

```text
Bit 7: TXE  — Transmit Data Register Empty (1 = có thể ghi DR)
Bit 6: TC   — Transmission Complete (1 = byte cuối đã truyền xong hoàn toàn)
Bit 5: RXNE — Read Data Register Not Empty (1 = có byte mới đọc được)
Bit 3: ORE  — Overrun Error (1 = byte mới đến trước khi đọc byte cũ)
Bit 2: NE   — Noise Error
Bit 1: FE   — Framing Error (stop bit sai — baud rate không khớp?)
Bit 0: PE   — Parity Error
```

---

## Tính Baud Rate Register (BRR)

> [!definition] Definition 14.3 — BRR Calculation
> $$\text{BRR} = \frac{f_{PCLK}}{16 \times \text{BaudRate}}$$
>
> BRR chia thành:
> - **Mantissa** (integer part): `BRR[15:4]`
> - **Fraction** (fractional part × 16): `BRR[3:0]`

**Ví dụ tính cho USART1 (APB2 = 84 MHz), 115200 baud**:

$$\text{DIV} = \frac{84{,}000{,}000}{16 \times 115{,}200} = \frac{84{,}000{,}000}{1{,}843{,}200} \approx 45.5729$$

$$\text{Mantissa} = 45 \quad (= 0x2D)$$

$$\text{Fraction} = \text{round}(0.5729 \times 16) = \text{round}(9.17) = 9 \quad (= 0x9)$$

$$\text{BRR} = (45 \ll 4) \mid 9 = 0x2D9$$

**Thực tế baud rate**: $\frac{84{,}000{,}000}{16 \times 45.5625} = 115{,}274$ baud — sai số 0.065%, chấp nhận được (< 2% theo UART spec).

---

## Cấu hình UART — Polling Mode

```c
#include "stm32f4xx.h"

/* USART1: PA9=TX, PA10=RX, 115200 8N1 */
void usart1_init(void) {
    /* 1. Enable clocks */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_USART1EN;

    /* 2. GPIO: PA9=TX (AF7), PA10=RX (AF7) */
    /* PA9 */
    GPIOA->MODER  &= ~(3U << (9*2));
    GPIOA->MODER  |=  (2U << (9*2));
    GPIOA->OSPEEDR |= (3U << (9*2));
    GPIOA->AFR[1] &= ~(0xFU << ((9-8)*4));
    GPIOA->AFR[1] |=  (7U   << ((9-8)*4));

    /* PA10 */
    GPIOA->MODER  &= ~(3U << (10*2));
    GPIOA->MODER  |=  (2U << (10*2));
    GPIOA->PUPDR  &= ~(3U << (10*2));
    GPIOA->PUPDR  |=  (1U << (10*2));    /* Pull-up cho RX */
    GPIOA->AFR[1] &= ~(0xFU << ((10-8)*4));
    GPIOA->AFR[1] |=  (7U   << ((10-8)*4));

    /* 3. BRR cho 115200 baud từ APB2=84MHz */
    USART1->BRR = 0x2D9;

    /* 4. CR1: 8N1, TX+RX enable, USART enable */
    USART1->CR1 = USART_CR1_TE          /* Transmit enable */
                | USART_CR1_RE          /* Receive enable */
                | USART_CR1_UE;         /* USART enable */
    /* CR2 default: 1 stop bit */
    /* CR3 default: no flow control */
}

/* Gửi 1 byte — polling */
void usart1_putchar(uint8_t c) {
    while (!(USART1->SR & USART_SR_TXE)) { }   /* Chờ TXE */
    USART1->DR = c;
}

/* Gửi string */
void usart1_puts(const char *s) {
    while (*s) usart1_putchar((uint8_t)*s++);
}

/* Nhận 1 byte — blocking */
uint8_t usart1_getchar(void) {
    while (!(USART1->SR & USART_SR_RXNE)) { }  /* Chờ RXNE */
    return (uint8_t)(USART1->DR & 0xFF);
}
```

---

## UART Interrupt Mode

```c
/* Circular RX buffer */
#define RX_BUF_SIZE 256
static volatile uint8_t  rx_buf[RX_BUF_SIZE];
static volatile uint16_t rx_head = 0;
static volatile uint16_t rx_tail = 0;

void usart1_init_irq(void) {
    usart1_init();   /* Base init từ trên */

    /* Enable RXNE interrupt */
    USART1->CR1 |= USART_CR1_RXNEIE;

    NVIC_SetPriority(USART1_IRQn, 5);
    NVIC_EnableIRQ(USART1_IRQn);
}

void USART1_IRQHandler(void) {
    if (USART1->SR & USART_SR_RXNE) {
        uint8_t byte = (uint8_t)(USART1->DR & 0xFF);  /* Đọc DR để clear RXNE */
        uint16_t next_head = (rx_head + 1) % RX_BUF_SIZE;
        if (next_head != rx_tail) {    /* Buffer không đầy */
            rx_buf[rx_head] = byte;
            rx_head = next_head;
        }
        /* Nếu đầy: byte bị bỏ (có thể set error flag) */
    }
    if (USART1->SR & USART_SR_ORE) {
        (void)USART1->DR;   /* Clear ORE bằng cách đọc DR */
    }
}

int usart1_read(uint8_t *out) {
    if (rx_tail == rx_head) return 0;   /* Buffer rỗng */
    *out = rx_buf[rx_tail];
    rx_tail = (rx_tail + 1) % RX_BUF_SIZE;
    return 1;
}
```

---

## Hardware Flow Control (RTS/CTS)

> [!definition] Definition 14.4 — RTS/CTS Flow Control
>
> ```text
> MCU (Master)           Device (Slave)
>   TX ──────────────────────► RX
>   RX ◄────────────────────── TX
>   RTS ─────────────────────► CTS   (MCU báo "tôi sẵn sàng nhận")
>   CTS ◄───────────────────── RTS   (Device báo "tôi sẵn sàng nhận")
>
> RTS (Request To Send): MCU kéo LOW = sẵn sàng nhận
> CTS (Clear To Send):   MCU chỉ gửi khi CTS của đối phương = LOW
> ```

```c
/* Enable hardware flow control trong CR3 */
USART1->CR3 |= USART_CR3_RTSE   /* RTS enable */
             | USART_CR3_CTSE;  /* CTS enable */
/* GPIO PA11=CTS, PA12=RTS cần cấu hình AF7 tương tự TX/RX */
```

---

## Hardware Hacking — UART Attack Surface

### Tìm UART trên PCB

```text
Dấu hiệu nhận biết UART test points:
1. Nhóm 3–4 pad/via gần nhau → GND, TX, RX (và có thể VCC)
2. Tên pad: J1, TP1, CON1, DEBUG, UART, CONSOLE
3. Pad GND → đo điện trở về GND = 0Ω
4. Pad TX → đo voltage khi boot: nếu thấy 3.3V/5V với pulses → UART TX
5. Dùng logic analyzer: decode asynchronous serial tìm baud rate
```

**Xác định baud rate tự động**:

```text
Baud rate phổ biến (thử theo thứ tự):
115200 → 57600 → 38400 → 19200 → 9600 → 230400 → 460800 → 1000000

Logic analyzer method:
1. Capture TX khi boot
2. Tìm pulse ngắn nhất → 1 bit period
3. Baud rate = 1 / bit_period
Ví dụ: pulse ngắn nhất = 8.68µs → baud = 1/8.68e-6 ≈ 115,207 ≈ 115200
```

### Kết nối với USB-UART Adapter

```text
MCU board          USB-UART (CP2102/CH340/FT232)
GND ──────────────── GND
TX  ──────────────── RX    (MCU transmit → adapter receive)
RX  ──────────────── TX    (MCU receive ← adapter transmit)
(KHÔNG kết nối VCC nếu board đã có nguồn riêng)
```

### Debug Console Attack

```text
Các thứ thường thấy khi connect UART console:

1. Boot log / kernel messages:
   [    0.000000] Booting Linux on physical CPU 0x0
   [    1.234567] mmcblk0: mmc0:0001 AAAAAA 3.69 GiB

2. Uboot shell:
   Hit any key to stop autoboot: 3
   => (uboot prompt — có thể set bootargs, boot custom kernel)

3. Login shell:
   buildroot login: root
   Password:        (thử: root, admin, 1234, blank)

4. Debug menu:
   1. Read config
   2. Write config
   3. Factory reset    ← thường có lỗi authorization
   4. Dump memory      ← critical nếu không auth-protected
```

> [!warning] Command Injection qua UART RX
> Nhiều firmware đọc command từ UART và thực thi:
> ```c
> char cmd[64];
> uart_readline(cmd, sizeof(cmd));   /* Đọc 1 dòng từ UART */
> execute_command(cmd);
> ```
> Nếu `uart_readline` không kiểm tra size → **stack buffer overflow** qua UART input. Attacker gửi payload dài hơn 64 byte → overwrite return address → RCE.
>
> Đây là một trong những lỗ hổng phổ biến nhất trong firmware IoT consumer.

---

## Sniff UART với Logic Analyzer

```python
import serial

# Kết nối USB-UART adapter để sniff TX line của target
ser = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate=115200,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    timeout=1
)

print("Sniffing UART... (Ctrl+C to stop)")
while True:
    data = ser.read(256)
    if data:
        try:
            print(data.decode('utf-8', errors='replace'), end='')
        except Exception:
            print(data.hex())
```

---

## Summary

- UART frame: START(LOW) + 8 data bits (LSB first) + STOP(HIGH). Không có clock → hai bên phải đồng bộ baud rate.
- **BRR** = `f_PCLK / (16 × BaudRate)`, chia thành mantissa[15:4] và fraction[3:0].
- **Polling**: kiểm tra TXE/RXNE trong SR trước mỗi lần ghi/đọc DR.
- **Interrupt**: enable RXNEIE → ISR đọc DR vào circular buffer → main loop consume.
- **Flow control**: RTS/CTS giảm overrun khi receiver không kịp xử lý.
- UART là **attack surface số 1** trên IoT device: tìm bằng logic analyzer (pulse ngắn nhất = bit period), thường mở debug shell hoặc boot log.
- **Buffer overflow qua UART RX** là lỗ hổng phổ biến: không validate size input từ serial → stack smash.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 30 (USART)
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 2 (UART interfaces)
- Advanced Security Training — *Introduction to Hardware Hacking* (UART lab — Day 1)
- pyserial documentation — pyserial.readthedocs.io
- OpenWRT Wiki — *Serial Console* (finding UART on routers)
