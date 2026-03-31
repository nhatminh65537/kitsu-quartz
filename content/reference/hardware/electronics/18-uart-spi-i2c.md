---
title: "18. Serial Communication — UART, SPI, I2C"
tags: [electronics, embedded, lesson-18]
aliases: [UART SPI I2C Giao Tiếp Nối Tiếp]
created: 2026-03-30
---

> **Prerequisites**: [[16-arduino-gpio-programming|16. Arduino GPIO]], [[11-flip-flop-sequential-logic|11. Flip-Flop]]
> **Objectives**:
> - Hiểu và phân biệt ba giao thức nối tiếp: UART, SPI, I2C
> - Cấu hình và dùng UART để giao tiếp với máy tính và module Bluetooth/GPS
> - Dùng SPI để giao tiếp với SD card, màn hình TFT, ADC ngoài
> - Dùng I2C để kết nối nhiều sensor trên 2 dây (DHT, OLED, MPU6050)
> - Chẩn đoán lỗi giao tiếp bằng logic analyzer

---

## Motivation

MCU cần giao tiếp với thế giới ngoài: màn hình, cảm biến, module Bluetooth, thẻ SD... Kết nối song song (parallel) nhiều dây tốn pin và phức tạp. **Giao tiếp nối tiếp (serial communication)** truyền dữ liệu từng bit qua ít dây hơn — đây là phương pháp phổ biến nhất.

Ba giao thức chính bạn sẽ gặp trong mọi project embedded: **UART**, **SPI**, **I2C** — mỗi loại phù hợp với bài toán khác nhau.

---

## So Sánh Nhanh

| | UART | SPI | I2C |
|--|------|-----|-----|
| Số dây | 2 (TX, RX) | 4 (MOSI, MISO, SCK, SS) | 2 (SDA, SCL) |
| Tốc độ điển hình | 9600–2M bps | 1–50 Mbps | 100k–400k–3.4M bps |
| Số thiết bị | 2 (point-to-point) | Nhiều (mỗi cần 1 SS pin) | Nhiều (địa chỉ 7-bit = 128 thiết bị) |
| Đồng hồ | Không (baud rate) | Có (SCK từ master) | Có (SCL từ master) |
| Ứng dụng | Debug, Bluetooth, GPS | SD card, display, ADC | Sensor, OLED, IMU |

---

## UART — Universal Asynchronous Receiver-Transmitter

### Nguyên Lý

UART là giao thức **không đồng bộ** — không có clock chung. Hai bên phải thống nhất **baud rate** (số bit/giây) trước.

> [!definition] Definition 18.1 — UART Frame Format
> Một frame UART gồm:
>
> ```
> IDLE ─── [Start=0] [D0][D1][D2][D3][D4][D5][D6][D7] [Stop=1] ─── IDLE
>           1 bit       8 bit data                      1 bit
> ```
>
> - **Start bit**: LOW (0) — báo hiệu bắt đầu frame
> - **Data bits**: 5–9 bit (thường 8)
> - **Parity bit**: optional — kiểm tra lỗi
> - **Stop bit**: HIGH (1) — kết thúc frame
>
> Thời gian mỗi bit = $1/\text{baudrate}$.

### UART Trong Arduino

```cpp
// Giao tiếp với máy tính qua USB-Serial
void setup() {
    Serial.begin(9600);           // baud rate 9600
}

void loop() {
    // Gửi dữ liệu lên máy tính
    Serial.println("Hello!");
    
    // Nhận dữ liệu từ máy tính
    if (Serial.available() > 0) {
        char c = Serial.read();
        Serial.print("Received: ");
        Serial.println(c);
    }
    delay(1000);
}
```

### SoftwareSerial — Thêm UART

```cpp
#include <SoftwareSerial.h>
SoftwareSerial mySerial(10, 11); // RX=10, TX=11

void setup() {
    Serial.begin(9600);     // debug với máy tính
    mySerial.begin(9600);   // giao tiếp với module Bluetooth HC-05
}

void loop() {
    if (mySerial.available()) {
        char c = mySerial.read();
        Serial.print("BT received: ");
        Serial.println(c);
    }
}
```

---

## SPI — Serial Peripheral Interface

### Nguyên Lý

SPI là giao thức **đồng bộ** — Master tạo clock (SCK), cả gửi và nhận đồng thời (full-duplex):

```
             Master                Slave
    SCK  ────────────────────────── SCK
    MOSI ────────────────────────── MOSI  (Master Out Slave In)
    MISO ←──────────────────────── MISO  (Master In Slave Out)
    SS   ────────────────────────── SS    (Slave Select, active LOW)
```

> [!definition] Definition 18.2 — SPI Pins Arduino Uno
>
> | Pin Arduino | Chức Năng |
> |-------------|-----------|
> | D13 (SCK) | Clock |
> | D12 (MISO) | Master In Slave Out |
> | D11 (MOSI) | Master Out Slave In |
> | D10 (SS) | Slave Select (mặc định) |
>
> Để kết nối nhiều slave: mỗi slave cần một SS pin riêng.

### SPI Trong Arduino

```cpp
#include <SPI.h>

const int SD_CS = 10;  // Chip Select cho SD card

void setup() {
    SPI.begin();
    pinMode(SD_CS, OUTPUT);
    digitalWrite(SD_CS, HIGH);  // deselect
}

void sendByte(byte data) {
    digitalWrite(SD_CS, LOW);       // chọn slave
    SPI.transfer(data);             // gửi 1 byte, nhận 1 byte đồng thời
    digitalWrite(SD_CS, HIGH);      // bỏ chọn slave
}
```

**Ví dụ thực tế**: SD card, màn hình TFT ST7735/ILI9341, MCP3204 ADC 12-bit, W5500 Ethernet chip.

---

## I2C — Inter-Integrated Circuit

### Nguyên Lý

I2C chỉ dùng **2 dây** — SDA (data) và SCL (clock). Mỗi thiết bị có địa chỉ 7-bit (0x00–0x7F). Master kiểm soát clock và bắt đầu/kết thúc giao tiếp.

> [!definition] Definition 18.3 — I2C Frame
>
> ```
> START → [7-bit Address][R/W] → ACK → [8-bit Data] → ACK → STOP
> ```
>
> - **START**: SDA xuống LOW khi SCL còn HIGH
> - **ACK**: Slave kéo SDA xuống LOW để xác nhận nhận được byte
> - **STOP**: SDA lên HIGH khi SCL còn HIGH
>
> Tốc độ: Standard (100 kHz), Fast (400 kHz), Fast+ (1 MHz)

> [!warning] Pull-up Resistor Bắt Buộc
> I2C là **open-drain** — cần **pull-up resistor** trên SDA và SCL:
> - 4,7 kΩ cho 100 kHz
> - 2,2 kΩ cho 400 kHz
>
> Nhiều module sensor đã có pull-up onboard. Nếu kết nối nhiều module, pull-up có thể quá thấp → lỗi.

### I2C Trong Arduino — Wire Library

```cpp
#include <Wire.h>

void setup() {
    Wire.begin();           // khởi tạo I2C master
    Serial.begin(9600);
}

void readMPU6050() {
    Wire.beginTransmission(0x68); // địa chỉ MPU6050
    Wire.write(0x3B);              // register ACCEL_XOUT_H
    Wire.endTransmission(false);   // repeated start
    
    Wire.requestFrom(0x68, 6);    // đọc 6 byte (3 trục x 2 byte)
    
    int16_t ax = Wire.read() << 8 | Wire.read();
    int16_t ay = Wire.read() << 8 | Wire.read();
    int16_t az = Wire.read() << 8 | Wire.read();
    
    Serial.print("Accel X: "); Serial.println(ax / 16384.0);
    Serial.print("Accel Y: "); Serial.println(ay / 16384.0);
    Serial.print("Accel Z: "); Serial.println(az / 16384.0);
}

void loop() {
    readMPU6050();
    delay(100);
}
```

### Scan Địa Chỉ I2C

```cpp
#include <Wire.h>

void setup() {
    Wire.begin();
    Serial.begin(9600);
    Serial.println("I2C Scanner:");
    
    for (byte address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        if (Wire.endTransmission() == 0) {
            Serial.print("Device at 0x");
            Serial.println(address, HEX);
        }
    }
    Serial.println("Done.");
}

void loop() {}
```

---

## Địa Chỉ I2C Phổ Biến

| Module/Sensor | Địa Chỉ | Giao Thức |
|---------------|---------|-----------|
| MPU6050 (IMU) | 0x68 / 0x69 | I2C |
| OLED SSD1306 | 0x3C / 0x3D | I2C |
| BMP280 (áp suất) | 0x76 / 0x77 | I2C |
| DS3231 (RTC) | 0x68 | I2C |
| ADS1115 (ADC 16-bit) | 0x48–0x4B | I2C |
| BME280 (nhiệt/ẩm/áp) | 0x76 / 0x77 | I2C |

---

## Chọn Giao Thức Phù Hợp

| Tình Huống | Nên Dùng |
|-----------|---------|
| Debug, Bluetooth, GPS, GSM module | UART |
| SD card, màn hình TFT, ADC tốc độ cao | SPI |
| Nhiều sensor trên 2 dây, OLED, IMU | I2C |
| Cần tốc độ cao nhất | SPI |
| Cần ít dây nhất với nhiều thiết bị | I2C |

---

## Summary / Key Takeaways

- **UART**: không đồng bộ, 2 dây, point-to-point; dùng cho debug và module wireless
- **SPI**: đồng bộ, 4 dây, tốc độ cao; mỗi slave cần 1 SS pin thêm
- **I2C**: đồng bộ, 2 dây, nhiều thiết bị qua địa chỉ 7-bit; cần pull-up resistor
- `Wire.begin()` + `Wire.beginTransmission()` + `Wire.write()` + `Wire.read()` — pattern cơ bản I2C
- `SPI.begin()` + `SPI.transfer()` — pattern cơ bản SPI
- Dùng I2C scanner để tìm địa chỉ thiết bị chưa biết

---

## References

- Arduino Wire (I2C) Reference — https://www.arduino.cc/reference/en/libraries/wire/
- Arduino SPI Reference — https://www.arduino.cc/reference/en/libraries/spi/
- I2C Pull-up Resistor Guide — https://www.ti.com/lit/an/slva689/slva689.pdf
- Logic Analyzer Tutorial — Sigrok/PulseView (miễn phí, Windows/Linux/Mac)
