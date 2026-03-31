---
title: "15. SPI"
tags: [embedded, microcontroller, arm-cortex-m, lesson-15]
aliases: [SPI, Serial Peripheral Interface]
created: 2026-03-24
---

> **Prerequisites**: [[10-clock-system-rcc-pll|10. Clock System (RCC & PLL)]], [[12-gpio-exti|12. GPIO & EXTI]]
> **Objectives**:
> - Hiểu SPI topology: master/slave, 4 dây (SCK/MOSI/MISO/CS)
> - Nắm 4 SPI mode (CPOL × CPHA) và cách chọn mode đúng theo datasheet
> - Cấu hình SPI1 STM32F4 full-duplex master từ register
> - Giao tiếp với SPI Flash W25Qxx: read ID, read data, dump firmware
> - Nhận diện attack surface: SPI flash dumping, MITM trên bus, replay attack

---

## Motivation

SPI là giao thức serial đồng bộ tốc độ cao nhất trong bộ ba UART/I2C/SPI — có thể đạt hàng chục MHz. Quan trọng hơn từ góc độ bảo mật: **phần lớn firmware của embedded device được lưu trong SPI NOR Flash** (chip 8 chân phổ biến Winbond W25Qxx, Macronix MX25Lxx). Biết cách giao tiếp với SPI Flash là bước đầu tiên để dump firmware từ bất kỳ thiết bị nào có chip flash 8 chân trên PCB.

---

## SPI Topology và Tín hiệu

> [!definition] Definition 15.1 — SPI Signals
>
> ```text
> Master                          Slave
> ┌──────────────┐                ┌──────────────┐
> │         SCK  ├───────────────►│ SCK          │  Clock (master tạo)
> │        MOSI  ├───────────────►│ MOSI/SDI/DI  │  Master Out Slave In
> │        MISO  │◄───────────────┤ MISO/SDO/DO  │  Master In Slave Out
> │          CS  ├───────────────►│ CS/NSS/CE    │  Chip Select (active LOW)
> └──────────────┘                └──────────────┘
> ```
>
> **Full-duplex**: MOSI và MISO hoạt động đồng thời — mỗi clock cycle, master gửi 1 bit và nhận 1 bit. Khi chỉ cần gửi (không cần đọc), MISO có thể bỏ qua.
>
> **Multi-slave**: Mỗi slave cần một CS riêng. Master kéo CS của slave cần nói chuyện xuống LOW, các slave khác ở HIGH → MISO của chúng ở high-impedance.

---

## 4 SPI Modes — CPOL và CPHA

> [!definition] Definition 15.2 — CPOL và CPHA
>
> **CPOL** (Clock Polarity): trạng thái IDLE của SCK
> - CPOL=0 → SCK idle = LOW
> - CPOL=1 → SCK idle = HIGH
>
> **CPHA** (Clock Phase): cạnh nào dùng để sample data
> - CPHA=0 → sample tại cạnh **đầu** (leading edge)
> - CPHA=1 → sample tại cạnh **thứ hai** (trailing edge)
>
> | Mode | CPOL | CPHA | SCK idle | Sample edge | Dùng cho |
> |------|------|------|---------|------------|---------|
> | 0 | 0 | 0 | LOW | Rising | W25Qxx flash, SD card, nhiều sensor |
> | 1 | 0 | 1 | LOW | Falling | Một số ADC, encoder |
> | 2 | 1 | 0 | HIGH | Falling | Ít gặp |
> | 3 | 1 | 1 | HIGH | Rising | ADXL345, MAX31855 thermocouple |

**Timing diagram Mode 0 (CPOL=0, CPHA=0)**:

```text
CS:   ─┐                                          ┌─
       └──────────────────────────────────────────┘
SCK:  ─────┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐──
            └──┘  └──┘  └──┘  └──┘  └──┘  └──┘
MOSI:       ┤ b7 ┤ b6 ┤ b5 ┤ b4 ┤ b3 ┤ b2 ┤ b1 ┤ b0 ┤
             ↑sample  ↑sample...  (rising edge)
```

> [!note] Cách nhớ nhanh
> Nhìn vào datasheet của slave, tìm mục "SPI Interface" hoặc "Serial Interface Timing". Thường ghi rõ: "Mode 0 (CPOL=0, CPHA=0)" hoặc vẽ timing diagram với SCK bắt đầu LOW hay HIGH.

---

## SPI Registers STM32F4

> [!definition] Definition 15.3 — SPI Key Registers
>
> | Register | Offset | Chức năng chính |
> |----------|--------|----------------|
> | `CR1` | 0x00 | CPOL, CPHA, MSTR, BR[2:0], SPE, LSBFIRST, SSI, SSM, DFF |
> | `CR2` | 0x04 | SSOE, TXDMAEN, RXDMAEN, ERRIE, RXNEIE, TXEIE |
> | `SR`  | 0x08 | RXNE, TXE, BSY, OVR, MODF, CRCERR |
> | `DR`  | 0x0C | Data Register: ghi = transmit, đọc = receive |
> | `CRCPR`| 0x10 | CRC polynomial |
> | `RXCRCR`| 0x14 | RX CRC |
> | `TXCRCR`| 0x18 | TX CRC |

**CR1 quan trọng nhất**:

```text
Bit 0:     CPHA   — Clock phase
Bit 1:     CPOL   — Clock polarity
Bit 2:     MSTR   — 1=Master, 0=Slave
Bits[5:3]: BR     — Baud rate: fPCLK / 2^(BR+1)
           000=/2, 001=/4, 010=/8, 011=/16, 100=/32, 101=/64, 110=/128, 111=/256
Bit 6:     SPE    — SPI Enable
Bit 7:     LSBFIRST — 0=MSB first (default), 1=LSB first
Bit 8:     SSI    — Internal slave select (khi SSM=1)
Bit 9:     SSM    — Software slave management: 1=dùng SSI bit thay vì NSS pin
Bit 11:    DFF    — Data frame format: 0=8-bit, 1=16-bit
```

---

## Cấu hình SPI1 Master — Mode 0, 8-bit

```c
/* SPI1: PA5=SCK, PA6=MISO, PA7=MOSI (AF5), PA4=CS (GPIO output) */

void spi1_init(void) {
    /* 1. Enable clocks */
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_SPI1EN;

    /* 2. GPIO config: PA5/PA6/PA7 = AF5 (SPI1) */
    /* PA5 = SCK, PA7 = MOSI: output, no pull */
    /* PA6 = MISO: input, pull-up */
    uint8_t spi_pins[] = {5, 6, 7};
    for (int i = 0; i < 3; i++) {
        uint8_t pin = spi_pins[i];
        GPIOA->MODER  &= ~(3U << (pin*2));
        GPIOA->MODER  |=  (2U << (pin*2));       /* AF mode */
        GPIOA->OSPEEDR |= (3U << (pin*2));        /* Very high speed */
        GPIOA->AFR[0] &= ~(0xFU << (pin*4));
        GPIOA->AFR[0] |=  (5U   << (pin*4));     /* AF5 = SPI1 */
    }
    GPIOA->PUPDR &= ~(3U << (6*2));
    GPIOA->PUPDR |=  (1U << (6*2));              /* Pull-up trên MISO */

    /* PA4 = CS, output push-pull, default HIGH */
    GPIOA->MODER  &= ~(3U << (4*2));
    GPIOA->MODER  |=  (1U << (4*2));
    GPIOA->BSRR    =  (1U << 4);                 /* CS = HIGH (deselect) */

    /* 3. SPI1 config: Mode 0, Master, 8-bit, MSB first, fPCLK/8 ≈ 10.5 MHz */
    SPI1->CR1 = 0;                               /* Reset */
    SPI1->CR1 = (0U << 0)                        /* CPHA=0 */
              | (0U << 1)                        /* CPOL=0 → Mode 0 */
              | (1U << 2)                        /* MSTR=1 */
              | (2U << 3)                        /* BR=010: fPCLK/8 */
              | (0U << 7)                        /* LSBFIRST=0 (MSB first) */
              | (1U << 8)                        /* SSI=1 */
              | (1U << 9)                        /* SSM=1 (software CS) */
              | (0U << 11);                      /* DFF=0 (8-bit) */
    SPI1->CR2 = 0;
    SPI1->CR1 |= (1U << 6);                      /* SPE=1: Enable SPI */
}

/* CS helpers */
static inline void spi_cs_low(void)  { GPIOA->BSRR = (1U << (4+16)); }
static inline void spi_cs_high(void) { GPIOA->BSRR = (1U << 4);      }

/* Transfer 1 byte: gửi tx, trả về rx (full-duplex) */
uint8_t spi1_transfer(uint8_t tx) {
    while (!(SPI1->SR & SPI_SR_TXE)) { }   /* Chờ TX buffer rỗng */
    SPI1->DR = tx;
    while (!(SPI1->SR & SPI_SR_RXNE)) { }  /* Chờ RX buffer có data */
    return (uint8_t)SPI1->DR;
}

/* Gửi buffer (bỏ qua data nhận) */
void spi1_write(const uint8_t *buf, uint32_t len) {
    for (uint32_t i = 0; i < len; i++) {
        spi1_transfer(buf[i]);
    }
    while (SPI1->SR & SPI_SR_BSY) { }      /* Chờ hết busy */
}

/* Nhận buffer (gửi dummy byte 0xFF để tạo clock) */
void spi1_read(uint8_t *buf, uint32_t len) {
    for (uint32_t i = 0; i < len; i++) {
        buf[i] = spi1_transfer(0xFF);
    }
}
```

---

## Giao tiếp SPI Flash W25Qxx

W25Qxx (Winbond) là loại SPI NOR Flash phổ biến nhất — có trong hầu hết router, IoT device, set-top box. Hoạt động Mode 0 (CPOL=0, CPHA=0).

> [!definition] Definition 15.4 — W25Qxx Pinout và Lệnh Cơ bản
>
> ```text
> W25Q32 (8 chân SOIC):
> Pin 1: /CS     — Chip Select (active LOW)
> Pin 2: DO/IO1  — MISO
> Pin 3: /WP     — Write Protect (kéo HIGH để enable write, hoặc LOW để protect)
> Pin 4: GND
> Pin 5: DI/IO0  — MOSI
> Pin 6: CLK     — SCK
> Pin 7: /HOLD   — Hold (kéo HIGH để hoạt động bình thường)
> Pin 8: VCC     — 3.3V
> ```
>
> | Command | Opcode | Chức năng |
> |---------|--------|-----------|
> | Read JEDEC ID | `0x9F` | Trả về manufacturer ID + device ID (3 bytes) |
> | Read Data | `0x03` | Đọc data từ địa chỉ 24-bit |
> | Fast Read | `0x0B` | Đọc nhanh hơn (thêm 1 dummy byte) |
> | Read Status Reg | `0x05` | Đọc status (BUSY bit, WEL bit) |
> | Write Enable | `0x06` | Set WEL=1 trước khi ghi/xóa |
> | Page Program | `0x02` | Ghi tối đa 256 bytes vào 1 page |
> | Sector Erase | `0x20` | Xóa 4KB sector |
> | Chip Erase | `0xC7` | Xóa toàn bộ chip |

**Đọc JEDEC ID để nhận diện chip**:

```c
void w25q_read_jedec_id(uint8_t *manufacturer, uint16_t *device_id) {
    spi_cs_low();
    spi1_transfer(0x9F);              /* Command: Read JEDEC ID */
    *manufacturer = spi1_transfer(0xFF);  /* Byte 1: Manufacturer (0xEF = Winbond) */
    uint8_t mem_type = spi1_transfer(0xFF);  /* Byte 2: Memory type */
    uint8_t capacity = spi1_transfer(0xFF);  /* Byte 3: Capacity (0x16 = 32Mbit) */
    *device_id = ((uint16_t)mem_type << 8) | capacity;
    spi_cs_high();
}

/* Đọc n bytes từ địa chỉ 24-bit addr */
void w25q_read(uint32_t addr, uint8_t *buf, uint32_t len) {
    spi_cs_low();
    spi1_transfer(0x03);                       /* Command: Read Data */
    spi1_transfer((addr >> 16) & 0xFF);        /* Address byte 2 (MSB) */
    spi1_transfer((addr >>  8) & 0xFF);        /* Address byte 1 */
    spi1_transfer((addr >>  0) & 0xFF);        /* Address byte 0 (LSB) */
    spi1_read(buf, len);                       /* Đọc data */
    spi_cs_high();
}
```

---

## Dump Firmware qua SPI — Hardware Hacking

### Phương pháp 1: In-Circuit với Clip

```text
Thiết bị cần:
- SOIC8 clip (kẹp trực tiếp vào chip mà không cần tháo)
- CH341A programmer hoặc bus pirate / Raspberry Pi
- Phần mềm: flashrom

Lệnh flashrom dump firmware:
$ flashrom -p ch341a_spi -r firmware_dump.bin

Kết quả: file .bin chứa toàn bộ flash
Phân tích tiếp với:
$ binwalk firmware_dump.bin        # Tìm filesystems, kernel, key material
$ strings firmware_dump.bin | grep -i pass   # Tìm plaintext credentials
$ hexdump -C firmware_dump.bin | head -20    # Kiểm tra magic bytes
```

### Phương pháp 2: MITM trên SPI Bus

Gắn logic analyzer vào SCK/MOSI/MISO/CS khi device đang boot:

```text
CS  ────┬──── Logic analyzer Ch1
SCK ────┼──── Logic analyzer Ch2
MOSI────┼──── Logic analyzer Ch3
MISO────┘──── Logic analyzer Ch4

Dùng Saleae Logic / Sigrok / PulseView để decode SPI:
- Bắt được toàn bộ traffic MCU ↔ Flash khi boot
- Thấy firmware được load vào RAM
- Có thể thấy key material nếu firmware decrypt on-the-fly
```

> [!warning] Security Note — SPI Flash Encryption
> Nhiều device **không** encrypt firmware trong SPI Flash → dump = lấy được toàn bộ firmware.
>
> Một số device dùng **on-the-fly decryption** (ví dụ ESP32 flash encryption, STM32 PCROP): MCU decrypt khi đọc, nhưng flash chứa ciphertext. Tuy nhiên, nếu attacker MITM SPI bus khi MCU đang đọc (sau decrypt), vẫn thấy plaintext trên MISO.
>
> **Counter**: Dùng hardware crypto accelerator với key không thể đọc ra ngoài (OTP/eFuse), decrypt trong secure memory, không output plaintext ra bus → chỉ còn side-channel attack.

---

## NSS — Software vs Hardware Slave Select

STM32 có hai cách quản lý CS:

```c
/* Software NSS (SSM=1): firmware tự toggle CS bằng GPIO */
SPI1->CR1 |= (1U << 9) | (1U << 8);   /* SSM=1, SSI=1 */
/* → Dùng bất kỳ GPIO nào làm CS, linh hoạt hơn */

/* Hardware NSS (SSM=0): SPI hardware tự kéo NSS pin */
SPI1->CR1 &= ~((1U << 9) | (1U << 8));  /* SSM=0, SSI=0 */
SPI1->CR2 |= SPI_CR2_SSOE;              /* NSS output enable */
/* → NSS (PA4 của SPI1) tự động LOW khi SPE=1, HIGH khi SPE=0 */
/* → Phù hợp khi chỉ có một slave, nhưng ít linh hoạt hơn */
```

---

## Đọc SPI Bus qua GDB

```gdb
# Xem cấu hình SPI1
(gdb) x/wx 0x40013000    # SPI1->CR1
# Bits [5:3] = BR → tính clock: fPCLK/2^(BR+1)
# Bit 2 = MSTR (1=master)
# Bits [1:0] = CPOL, CPHA → xác định SPI mode

(gdb) x/wx 0x40013008    # SPI1->SR
# Bit 7 = BSY (1=đang transfer)
# Bit 1 = TXE (1=TX buffer rỗng)
# Bit 0 = RXNE (1=có data trong RX buffer)

# Gửi 1 byte qua SPI trong GDB (inject data)
(gdb) set *((volatile uint32_t *)0x4001300C) = 0x9F   # Ghi DR = 0x9F
```

---

## Summary

- SPI dùng 4 dây: SCK (clock), MOSI, MISO, CS (active LOW). Full-duplex: gửi và nhận đồng thời.
- **4 mode** = CPOL × CPHA: Mode 0 (CPOL=0,CPHA=0) phổ biến nhất. Tra datasheet của slave để chọn đúng.
- **BRR** = fPCLK / 2^(BR+1), BR bits [5:3] trong CR1. Luôn chờ BSY=0 sau transfer trước khi release CS.
- **W25Qxx SPI Flash**: 8 chân SOIC, opcode 0x9F (JEDEC ID), 0x03 (Read), 0x02 (Page Program). Phổ biến trong mọi IoT device.
- **Dump firmware**: SOIC8 clip + CH341A + flashrom → ra file .bin. Hoặc MITM logic analyzer khi boot.
- **Encryption**: nhiều device để firmware plaintext trong flash → dump trivial. MITM sau decrypt vẫn thấy plaintext trên bus MISO.

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090), Ch. 28 (SPI)
- Winbond — *W25Q32JV Datasheet* (SPI Flash)
- Wikipedia — *Serial Peripheral Interface* (CPOL/CPHA explanation)
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook*, Ch. 2 (SPI interfaces)
- flashrom.org — flashrom documentation (CH341A programmer)
- EmbeddedExpertIO — *Working with STM32 and External Flash W25QXX*
