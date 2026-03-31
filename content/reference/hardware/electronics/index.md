---
title: "Electronics"
tags: [electronics, index]
created: 2026-03-30
---

## Mô Tả Khóa Học

Khóa học **Electronics** toàn diện dành cho người mới bắt đầu, bao gồm 4 lĩnh vực chính: Analog Electronics, Digital Electronics, Power Electronics và Embedded Systems. Yêu cầu đầu vào: Vật lý phổ thông (điện, từ), Toán cơ bản (vi phân, tích phân).

---

## Lessons

- [[00-roadmap|00. Roadmap]]

### Module 0 — Circuit Fundamentals
- [[01-voltage-current-ohm|01. Điện Áp, Dòng Điện & Định Luật Ohm]] — Voltage, current, resistance, định luật Ohm, mạch nối tiếp/song song, voltage divider, công suất điện.
- [[02-kirchhoff-circuit-analysis|02. Định Luật Kirchhoff & Phân Tích Mạch]] — KCL, KVL, phương pháp phân tích nút, mạch cầu Wheatstone.
- [[03-capacitor-inductor-rc-rl|03. Tụ Điện, Cuộn Cảm & Mạch RC/RL]] — Capacitor, inductor, mạch RC/RL transient, hằng số thời gian τ, ứng dụng decoupling và timer.
- [[04-thevenin-norton-superposition|04. Định Lý Thevenin, Norton & Superposition]] — Rút gọn mạch tương đương, superposition, truyền công suất cực đại, điện trở trong nguồn thực.

### Module 1 — Analog Electronics
- [[05-diode-characteristics-applications|05. Diode — Đặc Tuyến & Ứng Dụng]] — P-N junction, đặc tuyến V-I, chỉnh lưu cầu, LED driver, Zener regulator.
- [[06-bjt-transistor-amplifier-switch|06. Transistor BJT — Khuếch Đại & Switch]] — Ba vùng hoạt động, thiết kế switch điều khiển relay, common-emitter amplifier, Q-point.
- [[07-opamp-amplifier-applications|07. Op-Amp — Mạch Khuếch Đại & Ứng Dụng]] — Hai quy tắc vàng, inverting/non-inverting, summing amp, integrator, comparator, chọn IC.
- [[08-frequency-filter|08. Bộ Lọc Tần Số (Filter)]] — LPF/HPF RC bậc 1, tần số cắt, Bode plot, Sallen-Key bậc 2, anti-aliasing.

### Module 2 — Digital Electronics
- [[09-number-systems-boolean-algebra|09. Hệ Số Đếm & Đại Số Boolean]] — Binary, hex, bù 2, cổng logic cơ bản, định lý De Morgan, bitwise ops trong C.
- [[10-combinational-logic|10. Mạch Tổ Hợp (Combinational Logic)]] — K-map, half/full adder, MUX, decoder, encoder, quy trình thiết kế chuẩn.
- [[11-flip-flop-sequential-logic|11. Flip-Flop & Mạch Tuần Tự]] — SR latch, D/JK/T flip-flop, shift register 74HC595, synchronous counter.
- [[12-finite-state-machine|12. Finite State Machine (FSM)]] — Moore vs Mealy, state diagram, state table, mã hóa trạng thái, hiện thực C++ trên MCU.

### Module 3 — Power Electronics
- [[13-linear-regulator|13. Nguồn Cấp Điện Tuyến Tính]] — Linear regulator nguyên lý, 78xx series, LDO (AMS1117), LM317 adjustable, tính nhiệt và heatsink.
- [[14-dc-dc-converter|14. DC-DC Converter — Buck & Boost]] — PWM, Buck $V_{out}=D \cdot V_{in}$, Boost $V_{out}=V_{in}/(1-D)$, tính L và C, module sẵn có LM2596/MT3608.

### Module 4 — Embedded / Microcontroller
- [[15-microcontroller-architecture|15. Kiến Trúc Microcontroller]] — Kiến trúc MCU, ATmega328P (Flash/SRAM/EEPROM/GPIO/Timer/ADC), clock, cách đọc datasheet.
- [[16-arduino-gpio-programming|16. Arduino — Lập Trình C Cơ Bản & GPIO]] — setup/loop, digitalWrite/Read, analogWrite (PWM), Serial debug, millis() non-blocking, debounce.
- [[17-adc-sensor-interrupt|17. ADC, Sensor & Ngắt (Interrupt)]] — ADC 10-bit, analogRead, NTC/LM35/LDR sensor, attachInterrupt, ISR rules, encoder RPM.
- [[18-uart-spi-i2c|18. Giao Tiếp Nối Tiếp — UART, SPI, I2C]] — So sánh 3 giao thức, Wire library (I2C), SPI.transfer(), SoftwareSerial, I2C scanner.
- [[19-integration-project|19. Project Tích Hợp — Trạm Đo Môi Trường]] — DHT22 + OLED SSD1306 + nút nhấn + LED, FSM firmware, UART logging, thiết kế nguồn 12V→5V.

---

## Appendices

- [[a0-ltspice-falstad-guide|A0. Hướng Dẫn Sử Dụng LTspice & Falstad]] — Falstad web simulator, LTspice cài đặt và transient/AC analysis, Tinkercad, Wokwi.
- [[a1-datasheet-reading|A1. Đọc Datasheet — Hướng Dẫn Thực Tế]] — Cấu trúc datasheet, Absolute Maximum Ratings, tra thông số diode/BJT/op-amp/regulator/MCU.
- [[a2-formula-reference|A2. Bảng Tóm Tắt Công Thức]] — Quick reference toàn bộ công thức khóa học theo từng module.

---

## Tool & Software Guide

| Tool / Software | Mục Đích | Platform |
|-----------------|---------|----------|
| LTspice | Mô phỏng mạch analog, power | Windows / macOS |
| Falstad Circuit Simulator | Mô phỏng mạch web (không cài đặt) | Web (falstad.com/circuit) |
| Tinkercad Circuits | Mô phỏng Arduino + breadboard | Web |
| Wokwi | Mô phỏng Arduino/ESP32 + thư viện đầy đủ | Web (wokwi.com) |
| Arduino IDE | Lập trình microcontroller | Windows / macOS / Linux |
| Sigrok / PulseView | Logic analyzer miễn phí | Windows / macOS / Linux |
| Multimeter | Đo điện áp, dòng điện, điện trở | Hardware |

---

## Notation Guide

| Ký Hiệu | Ý Nghĩa |
|---------|---------|
| $V$ | Điện áp (Voltage), đơn vị Volt [V] |
| $I$ | Dòng điện (Current), đơn vị Ampere [A] |
| $R$ | Điện trở (Resistance), đơn vị Ohm [Ω] |
| $C$ | Điện dung (Capacitance), đơn vị Farad [F] |
| $L$ | Độ tự cảm (Inductance), đơn vị Henry [H] |
| $f$ | Tần số (Frequency), đơn vị Hertz [Hz] |
| $\tau$ | Hằng số thời gian (Time constant) |
| $V_{CC}$, $V_{DD}$ | Điện áp nguồn cấp |
| $GND$ | Ground — điện áp tham chiếu 0 V |
| $\beta$ ($h_{FE}$) | Hệ số khuếch đại dòng BJT |
| $A_v$ | Hệ số khuếch đại điện áp (Voltage gain) |
| $f_c$ | Tần số cắt (Cutoff frequency) |
| $D$ | Duty cycle của DC-DC converter |
| $\tau_{RC}$ | $RC$ — hằng số thời gian mạch RC |
| $\tau_{RL}$ | $L/R$ — hằng số thời gian mạch RL |
| $V_{BE}$ | Điện áp base-emitter của BJT (~0,7 V) |
| $V_{CE,sat}$ | Điện áp collector-emitter khi bão hòa (~0,2 V) |
