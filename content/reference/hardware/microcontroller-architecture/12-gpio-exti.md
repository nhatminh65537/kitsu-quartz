---
title: "12. GPIO & EXTI"
tags: [embedded, microcontroller, arm-cortex-m, lesson-12]
aliases: [GPIO, EXTI, General Purpose IO]
created: 2026-03-24
---

> **Prerequisites**: [[04-memory-map-mmio|04. Memory Map & Memory-Mapped I/O]], [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]]
> **Objectives**:
> - Nắm 5 mode GPIO: Input, Output, Alternate Function, Analog, và cách cấu hình
> - Đọc/ghi GPIO qua IDR, ODR, BSRR ở mức register
> - Hiểu pull-up/pull-down, output type (push-pull vs open-drain), output speed
> - Cấu hình EXTI để phát hiện sự kiện trên pin (rising/falling edge)
> - Nhận diện tên các chân phổ biến: VCC, GND, NRST, BOOT0, SWD, JTAG, TX/RX

---

## Motivation

GPIO (General Purpose Input/Output) là peripheral đơn giản nhất nhưng là cửa ngõ kết nối MCU với thế giới bên ngoài. Hiểu GPIO ở mức register là điều kiện để hiểu mọi peripheral khác — vì mọi chân SPI, I2C, UART đều đi qua GPIO Alternate Function. Từ góc độ hardware hacking, GPIO còn là nơi bạn gắn logic analyzer, oscilloscope, hay probe để sniff data trên board.

---

## GPIO Registers — Tổng quan

Mỗi GPIO port (A, B, C...) trên STM32F4 có 11 register tại base address cố định:

> [!definition] Definition 12.1 — GPIO Register Map (STM32F4)
>
> | Register | Offset | Chức năng |
> |----------|--------|-----------|
> | `MODER`  | 0x00 | Mode: 2 bit per pin (00=Input, 01=Output, 10=AF, 11=Analog) |
> | `OTYPER` | 0x04 | Output type: 1 bit per pin (0=Push-pull, 1=Open-drain) |
> | `OSPEEDR`| 0x08 | Output speed: 2 bit per pin (00=Low, 01=Medium, 10=High, 11=Very High) |
> | `PUPDR`  | 0x0C | Pull-up/down: 2 bit per pin (00=None, 01=Pull-up, 10=Pull-down) |
> | `IDR`    | 0x10 | Input Data Register (read-only): bit n = trạng thái pin n |
> | `ODR`    | 0x14 | Output Data Register (read/write): bit n = giá trị output pin n |
> | `BSRR`   | 0x18 | Bit Set/Reset Register (write-only, atomic) |
> | `LCKR`   | 0x1C | Lock Register: lock cấu hình pin không cho thay đổi |
> | `AFR[0]` | 0x20 | Alternate Function Low (pin 0–7): 4 bit per pin |
> | `AFR[1]` | 0x24 | Alternate Function High (pin 8–15): 4 bit per pin |

---

## Các Mode GPIO

### Input Mode

```c
/* Cấu hình PA0 làm digital input với pull-up */
RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;         /* Enable GPIOA clock */

GPIOA->MODER  &= ~(3U << (0 * 2));            /* MODER[1:0] = 00 (Input) */
GPIOA->PUPDR  &= ~(3U << (0 * 2));
GPIOA->PUPDR  |=  (1U << (0 * 2));            /* PUPDR[1:0] = 01 (Pull-up) */

/* Đọc trạng thái pin */
uint8_t pin_state = (GPIOA->IDR >> 0) & 1;    /* Bit 0 của IDR */
```

### Output Mode

```c
/* Cấu hình PA5 làm output push-pull, tốc độ medium */
GPIOA->MODER  &= ~(3U << (5 * 2));
GPIOA->MODER  |=  (1U << (5 * 2));            /* MODER = 01 (Output) */
GPIOA->OTYPER &= ~(1U << 5);                  /* OTYPER = 0 (Push-pull) */
GPIOA->OSPEEDR &= ~(3U << (5 * 2));
GPIOA->OSPEEDR |=  (1U << (5 * 2));           /* OSPEEDR = 01 (Medium) */

/* Ghi pin: 3 cách */

/* Cách 1: ODR — không atomic, có thể bị interrupt giữa chừng */
GPIOA->ODR |= (1U << 5);    /* Set pin 5 high */
GPIOA->ODR &= ~(1U << 5);   /* Set pin 5 low */

/* Cách 2: BSRR — atomic, ưu tiên dùng cách này */
GPIOA->BSRR = (1U << 5);           /* Set bit 5 → pin HIGH */
GPIOA->BSRR = (1U << (5 + 16));    /* Set bit 21 → pin LOW (reset side) */

/* Cách 3: Bit-banding (M3/M4 only) — atomic, tiện cho single bit */
#define GPIOA_ODR_BB(pin) \
    (*(volatile uint32_t *)(0x42000000 + (0x40020014 - 0x40000000)*32 + (pin)*4))
GPIOA_ODR_BB(5) = 1;    /* Set */
GPIOA_ODR_BB(5) = 0;    /* Clear */
```

> [!definition] Definition 12.2 — BSRR Register
> `BSRR` (Bit Set/Reset Register) là 32-bit write-only:
> - Bit [15:0] = **Set** side: ghi 1 vào bit n → pin n lên HIGH (bỏ qua bit 0)
> - Bit [31:16] = **Reset** side: ghi 1 vào bit (n+16) → pin n xuống LOW
>
> **Atomic**: chỉ một ghi 32-bit duy nhất, không cần disable interrupt. Luôn dùng BSRR thay vì đọc-sửa-ghi ODR trong production code.

### Alternate Function Mode

GPIO pin phải ở mode AF để peripheral (UART, SPI, I2C...) sử dụng. Mỗi pin có tối đa 16 AF (AF0–AF15):

```c
/* Cấu hình PA9 = USART1_TX (AF7 trên STM32F4) */
GPIOA->MODER  &= ~(3U << (9 * 2));
GPIOA->MODER  |=  (2U << (9 * 2));            /* MODER = 10 (Alternate Function) */
GPIOA->OTYPER &= ~(1U << 9);                  /* Push-pull */
GPIOA->OSPEEDR |= (3U << (9 * 2));            /* Very high speed cho UART */
GPIOA->PUPDR  &= ~(3U << (9 * 2));            /* No pull (UART TX không cần) */

/* AFR[1] chứa pin 8–15, pin 9 → AFR[1] bits [7:4] */
GPIOA->AFR[1] &= ~(0xFU << ((9 - 8) * 4));
GPIOA->AFR[1] |=  (7U   << ((9 - 8) * 4));   /* AF7 = USART1 */

/* Cấu hình PA10 = USART1_RX (AF7) */
GPIOA->MODER  &= ~(3U << (10 * 2));
GPIOA->MODER  |=  (2U << (10 * 2));
GPIOA->PUPDR  &= ~(3U << (10 * 2));
GPIOA->PUPDR  |=  (1U << (10 * 2));           /* Pull-up cho RX */
GPIOA->AFR[1] &= ~(0xFU << ((10 - 8) * 4));
GPIOA->AFR[1] |=  (7U   << ((10 - 8) * 4));  /* AF7 = USART1 */
```

### Analog Mode

```c
/* Cấu hình PA1 làm analog input (cho ADC) */
GPIOA->MODER |= (3U << (1 * 2));    /* MODER = 11 (Analog) */
GPIOA->PUPDR &= ~(3U << (1 * 2));   /* No pull-up/down (analog) */
```

---

## Push-Pull vs Open-Drain

> [!definition] Definition 12.3 — Output Types
>
> **Push-Pull**: Driver tích cực cả HIGH lẫn LOW.
> ```text
> VDD ─┤P-FET├─┐
>              ├── OUT  (driven HIGH khi P-FET on, LOW khi N-FET on)
> GND ─┤N-FET├─┘
> ```
>
> **Open-Drain**: Chỉ driver LOW; HIGH nhờ pull-up resistor bên ngoài.
> ```text
> VDD ──[R]──┐
>            ├── OUT  (LOW khi N-FET on, HIGH-Z khi off — kéo lên bởi R)
> GND ─┤N-FET├─┘
> ```
>
> Open-drain dùng cho: I2C (SDA/SCL luôn open-drain), wired-AND logic, kết nối nhiều device trên cùng một line với điện áp khác nhau.

---

## Các Tên Chân Quan Trọng — Nhận Diện Nhanh

Khi nhìn vào PCB hoặc datasheet, các tên chân sau xuất hiện thường xuyên:

> [!definition] Definition 12.4 — Tên Chân Phổ biến

| Tên chân | Ý nghĩa | Ghi chú bảo mật |
|---------|---------|----------------|
| `VDD`, `VCC`, `3V3`, `5V` | Nguồn điện dương | Đo voltage glitch tại đây |
| `GND`, `VSS` | Ground (đất) | Đặt shunt resistor để đo power trace |
| `NRST`, `RESET` | Reset pin (active LOW) | Glitch reset để restart về bootloader |
| `BOOT0`, `BOOT1` | Chọn boot mode | Pull HIGH → force ROM bootloader (DFU mode) |
| `SWDIO`, `SWDCLK` | SWD debug interface | 2-pin debug — dump flash nếu RDP=0 |
| `TDI`, `TDO`, `TMS`, `TCK`, `TRST` | JTAG debug | 4-5 pin — full debug/trace |
| `TX`, `TXD`, `UTXD` | UART transmit | Sniff → read log, firmware output |
| `RX`, `RXD`, `URXD` | UART receive | Inject command → potential command injection |
| `SCK`, `CLK`, `SCLK` | Serial clock (SPI/I2C) | Sniff clock để sync decode |
| `MOSI`, `SDI`, `DI` | SPI Master Out Slave In | Data từ MCU ra |
| `MISO`, `SDO`, `DO` | SPI Master In Slave Out | Data từ device về MCU |
| `CS`, `NSS`, `CE`, `SS` | Chip Select (SPI) | Active LOW thường; nhiều CS = nhiều device |
| `SDA`, `DAT` | I2C data | Open-drain, cần pull-up |
| `SCL` | I2C clock | Open-drain, cần pull-up |
| `INT`, `IRQ` | Interrupt output từ device | Device báo hiệu có data ready |
| `EN`, `OE` | Enable / Output Enable | Active HIGH/LOW tùy device |
| `BLK`, `BL` | Backlight | PWM điều khiển độ sáng màn hình |
| `RST` | Reset của device ngoài | Khác với NRST của MCU |
| `VBAT` | Backup battery voltage | Cấp nguồn cho RTC và backup domain |

---

## EXTI — External Interrupt/Event Controller

EXTI cho phép bất kỳ GPIO pin nào trigger interrupt khi có sự kiện (rising/falling/both edge):

> [!definition] Definition 12.5 — EXTI Architecture
>
> ```text
> GPIO Pin → SYSCFG routing → EXTI line → NVIC IRQ
>
> Mỗi EXTI line (0–15) chỉ có thể kết nối với một GPIO port tại một thời điểm:
> EXTI0  → PA0 hoặc PB0 hoặc PC0 ... (chọn qua SYSCFG_EXTICR)
> EXTI1  → PA1 hoặc PB1 hoặc PC1 ...
> ...
> EXTI15 → PA15 hoặc PB15 hoặc PC15 ...
>
> Mapping IRQ:
> EXTI0       → EXTI0_IRQn
> EXTI1       → EXTI1_IRQn
> EXTI2       → EXTI2_IRQn
> EXTI3       → EXTI3_IRQn
> EXTI4       → EXTI4_IRQn
> EXTI5–9     → EXTI9_5_IRQn  (shared!)
> EXTI10–15   → EXTI15_10_IRQn (shared!)
> ```

**Cấu hình EXTI đầy đủ — PB13 falling edge interrupt**:

```c
void exti13_init(void) {
    /* 1. Enable clock cho GPIOB và SYSCFG */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN;
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;

    /* 2. Cấu hình PB13 = input, pull-up */
    GPIOB->MODER  &= ~(3U << (13 * 2));   /* Input */
    GPIOB->PUPDR  &= ~(3U << (13 * 2));
    GPIOB->PUPDR  |=  (1U << (13 * 2));   /* Pull-up */

    /* 3. Route EXTI13 → GPIOB
     * SYSCFG_EXTICR4 controls EXTI12–15
     * EXTI13 = bits [7:4] of EXTICR4, value 1 = GPIOB */
    SYSCFG->EXTICR[3] &= ~(0xFU << 4);
    SYSCFG->EXTICR[3] |=  (0x1U << 4);   /* GPIOB */

    /* 4. Set trigger: falling edge */
    EXTI->FTSR |=  (1U << 13);   /* Enable falling trigger */
    EXTI->RTSR &= ~(1U << 13);   /* Disable rising trigger */

    /* 5. Unmask EXTI13 */
    EXTI->IMR |= (1U << 13);

    /* 6. Enable IRQ trong NVIC (EXTI10–15 share một IRQ) */
    NVIC_SetPriority(EXTI15_10_IRQn, 5);
    NVIC_EnableIRQ(EXTI15_10_IRQn);
}

void EXTI15_10_IRQHandler(void) {
    if (EXTI->PR & (1U << 13)) {
        EXTI->PR = (1U << 13);   /* Clear pending — ghi 1 để xóa */
        /* Xử lý event PB13 */
    }
    /* Kiểm tra các EXTI khác trong group nếu cần */
}
```

---

## Đọc GPIO State qua GDB — Logic Analyzer Bằng Debug

```gdb
# Xem trạng thái tất cả pin của GPIOA
(gdb) x/wx 0x40020010    # GPIOA->IDR
# Bit n = 1 → pin n đang HIGH

# Xem cấu hình GPIOA
(gdb) x/wx 0x40020000    # GPIOA->MODER
(gdb) x/wx 0x4002000C    # GPIOA->PUPDR
(gdb) x/wx 0x40020024    # GPIOA->AFR[1]

# Kiểm tra EXTI đang pending
(gdb) x/wx 0x40013C14    # EXTI->PR — bit n=1 → EXTI n đang pending

# Force set/clear pin qua GDB (cho testing)
(gdb) set *((volatile uint32_t *)0x40020018) = (1 << 5)    # GPIOA BSRR set PA5
(gdb) set *((volatile uint32_t *)0x40020018) = (1 << 21)   # GPIOA BSRR clear PA5
```

---

## Summary

- GPIO có 5 mode: **Input**, **Output**, **Alternate Function**, **Analog** — cấu hình qua `MODER` (2 bit/pin).
- Output type: **Push-pull** (drive cả HIGH lẫn LOW) vs **Open-drain** (chỉ drive LOW, cần pull-up). I2C bắt buộc open-drain.
- Ghi pin: dùng **BSRR** (atomic) thay vì ODR (non-atomic). Đọc pin qua **IDR**.
- **Alternate Function**: chọn AF số (0–15) qua `AFR[0/1]` — mapping AF→peripheral xem trong datasheet của từng chip.
- **EXTI**: routing GPIO pin → interrupt. Cần cấu hình SYSCFG (chọn port), EXTI trigger, IMR (unmask), và NVIC. EXTI5–9 và EXTI10–15 share IRQ → phải kiểm tra `PR` trong handler.
- Tên chân quan trọng: `BOOT0` (force DFU), `SWDIO/SWDCLK` (debug 2-pin), `NRST` (glitch target), `TX/RX` (UART sniff/inject).

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 8 (GPIO), Ch. 12 (SYSCFG), Ch. 10 (EXTI)
- STMicroelectronics — *STM32F407 Datasheet* (DS8626), Table 12 (Alternate Function mapping)
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 17 (GPIO)
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 2 (Hardware Peripheral Interfaces)
- Advanced Security Training — *Introduction to Hardware Hacking and Reverse-Engineering* (GPIO/UART sniffing lab)
