---
title: "15. Microcontroller Architecture"
tags: [electronics, embedded, lesson-15]
aliases: [Kiến Trúc Microcontroller MCU]
created: 2026-03-30
---

> **Prerequisites**: [[09-number-systems-boolean-algebra|09. Boolean & Hệ Số Đếm]], [[11-flip-flop-sequential-logic|11. Flip-Flop]], [[04-thevenin-norton-superposition|04. Thevenin & Norton]]
> **Objectives**:
> - Hiểu kiến trúc tổng quát của microcontroller (CPU, bộ nhớ, ngoại vi)
> - Nắm rõ kiến trúc ATmega328P — vi điều khiển của Arduino Uno
> - Phân biệt Flash, SRAM, EEPROM và vai trò từng loại bộ nhớ
> - Hiểu cơ chế clock và tại sao tần số clock quan trọng
> - Biết cách đọc datasheet để tìm thông số quan trọng

---

## Motivation

Đã học điện tử số (logic gates, flip-flop, FSM) — nhưng CPU trong máy tính hay microcontroller được xây từ hàng triệu gates đó như thế nào? Và để lập trình Arduino, bạn cần hiểu "bên trong" MCU có gì để biết tại sao một số hàm Arduino hoạt động theo cách đó.

**Microcontroller (MCU)** là một máy tính hoàn chỉnh trên một chip — CPU + bộ nhớ + các ngoại vi I/O tích hợp. Khác với microprocessor (chỉ có CPU), MCU không cần thêm chip ngoài để hoạt động.

---

## Kiến Trúc Tổng Quát

```
┌─────────────────────────────────────────┐
│              MICROCONTROLLER            │
│  ┌────────┐  ┌──────┐  ┌────────────┐  │
│  │  CPU   │  │Flash │  │    SRAM    │  │
│  │  Core  │  │(prog)│  │  (data)    │  │
│  └───┬────┘  └──────┘  └────────────┘  │
│      │  ┌──────────────────────────┐   │
│      └──┤      System Bus          │   │
│         └──┬──────┬────────┬───────┘   │
│          [GPIO] [Timer] [UART/SPI/I2C] │
│          [ADC]  [PWM]   [Watchdog]     │
└─────────────────────────────────────────┘
```

> [!definition] Definition 15.1 — Các Thành Phần MCU
>
> - **CPU Core**: thực thi lệnh, chứa ALU (tính toán số học/logic), các thanh ghi (register)
> - **Flash (Program Memory)**: lưu code (chương trình), không mất khi mất điện, ghi bằng programmer
> - **SRAM (Data Memory)**: lưu biến, stack, heap khi chạy; **mất dữ liệu** khi mất điện
> - **EEPROM**: lưu dữ liệu cấu hình, mất điện không mất; ghi/đọc chậm hơn Flash
> - **GPIO**: General Purpose Input/Output — kết nối với thế giới ngoài
> - **Timer/Counter**: đếm thời gian, tạo PWM, đo pulse
> - **ADC**: Analog-to-Digital Converter — đọc tín hiệu analog
> - **UART/SPI/I2C**: giao tiếp nối tiếp với các thiết bị ngoài
> - **Watchdog Timer**: reset MCU tự động nếu chương trình bị treo

---

## ATmega328P — Trái Tim Của Arduino Uno

> [!definition] Definition 15.2 — Thông Số ATmega328P
>
> | Thông số | Giá trị |
> |----------|--------|
> | Kiến trúc | AVR RISC 8-bit |
> | Clock | 16 MHz (Arduino Uno) |
> | Flash | 32 KB (0,5 KB dùng cho bootloader) |
> | SRAM | 2 KB |
> | EEPROM | 1 KB |
> | GPIO | 23 pin (20 khả dụng trong Arduino) |
> | ADC | 10-bit, 6 kênh (A0–A5) |
> | PWM | 6 pin (D3, D5, D6, D9, D10, D11) |
> | UART | 1 (D0/RX, D1/TX) |
> | SPI | 1 (D10–D13) |
> | I2C | 1 (A4/SDA, A5/SCL) |
> | Timer | 3 (Timer0: 8-bit, Timer1: 16-bit, Timer2: 8-bit) |
> | Điện áp | 1,8–5,5 V (Arduino Uno dùng 5 V) |

### Bộ Nhớ Chi Tiết

**Flash (32 KB)**: Khi bạn compile và upload sketch Arduino → file `.hex` được nạp vào Flash. MCU đọc từng lệnh từ đây để thực thi.

**SRAM (2 KB)**: Khi khai báo biến, mảng, gọi hàm (stack) → dùng SRAM. **2 KB là rất ít** — hãy tránh khai báo mảng lớn, dùng `PROGMEM` để lưu string vào Flash.

**EEPROM (1 KB)**: Đọc/ghi bằng thư viện `EEPROM.h`. Bền vững qua reset, dùng lưu cấu hình, calibration data. Giới hạn chu kỳ ghi: ~100.000 lần.

---

## Cơ Chế Clock

> [!definition] Definition 15.3 — System Clock
> Clock là tín hiệu xung vuông đồng bộ hóa toàn bộ hoạt động của MCU.
>
> Arduino Uno dùng **crystal oscillator 16 MHz** → mỗi chu kỳ clock = 62,5 ns.
>
> ATmega328P RISC: hầu hết lệnh thực thi trong **1 chu kỳ clock** → throughput ~16 MIPS.
>
> **Prescaler**: chia tần số clock để cấp cho các ngoại vi (Timer, ADC...) với tốc độ thấp hơn.

```
Crystal 16MHz → System Clock (F_CPU = 16 MHz)
                      ↓
              [Prescaler] ÷ 8
                      ↓
              Timer Clock = 2 MHz
```

---

## GPIO — Cơ Chế Phần Cứng

Mỗi GPIO pin được kiểm soát bởi **3 thanh ghi 8-bit** (ví dụ Port B):

| Thanh Ghi | Chức Năng |
|-----------|-----------|
| `DDRB` | Data Direction Register — 1=Output, 0=Input |
| `PORTB` | Output register — ghi giá trị output; hoặc bật pull-up khi input |
| `PINB` | Input register — đọc giá trị input (read-only) |

```cpp
// Cách Arduino làm (abstraction layer):
pinMode(13, OUTPUT);    // DDRB |= (1 << 5)
digitalWrite(13, HIGH); // PORTB |= (1 << 5)
int val = digitalRead(2); // val = (PIND >> 2) & 1
```

> [!warning] Arduino pinMode vs Direct Register
> `digitalWrite()` trong Arduino thực thi ~50 lệnh CPU (có overhead kiểm tra, mapping). **Direct register access** thực thi 2 lệnh. Khi cần tốc độ cao (>100 kHz), dùng trực tiếp `PORTB |= (1 << bit)`.

---

## Cách Đọc Datasheet MCU

Datasheet ATmega328P dài 448 trang — không cần đọc hết. Các mục quan trọng:

1. **Pin Description** (Ch. 1): sơ đồ chân, tên pin, chức năng alternate
2. **Memory Map** (Ch. 8): địa chỉ Flash, SRAM, EEPROM, I/O registers
3. **I/O-Ports** (Ch. 13): cách dùng GPIO, input với pull-up
4. **Timer/Counter** (Ch. 14–16): cấu hình PWM, tần số
5. **ADC** (Ch. 23): độ phân giải, tốc độ lấy mẫu, reference voltage
6. **USART** (Ch. 19): baud rate, cấu hình frame
7. **Electrical Characteristics** (Ch. 28): $V_{OH}$, $V_{OL}$, $I_{max}$ per pin (40 mA max, 200 mA tổng)

> [!warning] Giới Hạn Dòng GPIO ATmega328P
> - Mỗi pin: tối đa **40 mA** (absolute max — không khuyến nghị dùng tối đa)
> - Tổng tất cả pins của một Port: tối đa **100 mA**
> - Tổng chip: tối đa **200 mA**
>
> Để điều khiển LED: dùng điện trở hạn dòng 220–470 Ω. Để điều khiển tải lớn hơn: dùng transistor BJT hoặc MOSFET (Lesson 06).

---

## So Sánh Các Nền Tảng MCU

| Board | MCU | Clock | Flash | RAM | Đặc Điểm |
|-------|-----|-------|-------|-----|----------|
| Arduino Uno | ATmega328P | 16 MHz | 32 KB | 2 KB | Cơ bản, 5V |
| Arduino Nano | ATmega328P | 16 MHz | 32 KB | 2 KB | Nhỏ gọn hơn |
| Arduino Mega | ATmega2560 | 16 MHz | 256 KB | 8 KB | Nhiều pin hơn |
| ESP8266 | Xtensa LX106 | 80 MHz | 4 MB | 80 KB | WiFi tích hợp |
| ESP32 | Xtensa LX6 | 240 MHz | 4 MB | 320 KB | WiFi + BT, 2 core |
| STM32F103 | ARM Cortex-M3 | 72 MHz | 64 KB | 20 KB | 32-bit, mạnh hơn |

---

## Summary / Key Takeaways

- MCU = CPU + Flash + SRAM + EEPROM + GPIO + Timer + ADC + UART/SPI/I2C trên một chip
- **ATmega328P** (Arduino Uno): 16 MHz, 32 KB Flash, 2 KB SRAM, 1 KB EEPROM
- Flash: lưu code (không mất điện); SRAM: lưu biến khi chạy (mất điện); EEPROM: cấu hình bền vững
- GPIO điều khiển bằng 3 thanh ghi: DDRx (direction), PORTx (output), PINx (input)
- Mỗi GPIO max 40 mA; tổng chip max 200 mA — cần transistor cho tải lớn
- Datasheet là tài liệu tham khảo bắt buộc — học cách tra nhanh

---

## References

- ATmega328P Datasheet — https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf
- Arduino Uno Schematic — https://www.arduino.cc/en/uploads/Main/Arduino_Uno_Rev3-schematic.pdf
- PCBSync — ATmega328P Deep Dive: https://pcbsync.com/atmega328p/
