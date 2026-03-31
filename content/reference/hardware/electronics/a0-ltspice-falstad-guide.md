---
title: "A0. LTspice & Falstad — Simulation Guide"
tags: [electronics, appendix, tools]
aliases: [Hướng Dẫn LTspice Falstad]
created: 2026-03-30
---

> **Liên quan**: Tất cả lessons — đặc biệt Module 0 (Circuit), Module 1 (Analog)

---

## Falstad Circuit Simulator (Web)

**URL**: https://falstad.com/circuit — miễn phí, không cần cài đặt.

### Giao Diện Nhanh

| Vùng | Mô Tả |
|------|-------|
| Canvas (giữa) | Vẽ mạch |
| Menu Draw | Thêm linh kiện |
| Menu Options | Cài đặt hiển thị |
| Menu File | Lưu/mở mạch |
| Thanh dưới | Tốc độ mô phỏng, simulation speed |

### Thao Tác Cơ Bản

**Thêm linh kiện**: Draw → chọn loại linh kiện → click vẽ trên canvas.

**Nối dây**: Hover vào đầu linh kiện → cursor thành dấu X → click và kéo.

**Chỉnh giá trị**: Double-click vào linh kiện → nhập giá trị.

**Xem điện áp/dòng**: Hover chuột vào dây dẫn hoặc linh kiện → xem tooltip.

**Scope**: Right-click vào dây → "Add Voltage Probe" hoặc "Add Current Probe" → bật Show Scope (View menu).

### Danh Sách Linh Kiện Thường Dùng

| Linh Kiện | Vị Trí Menu |
|-----------|------------|
| Điện trở | Draw → Passive → Resistor |
| Tụ điện | Draw → Passive → Capacitor |
| Cuộn cảm | Draw → Passive → Inductor |
| Nguồn áp DC | Draw → Inputs and Sources → Voltage Source |
| Nguồn áp AC | Draw → Inputs and Sources → AC Voltage Source |
| Ground | Draw → Inputs and Sources → Ground |
| Diode | Draw → Diodes → Diode |
| NPN BJT | Draw → Active → NPN BJT |
| Op-Amp | Draw → Active → Op Amp |
| LED | Draw → Diodes → LED |
| Switch | Draw → Passive → Switch |

### Mạch Mẫu — Falstad có sẵn

File → Sample Circuits → chọn thư mục phù hợp:
- **Basics**: RC circuit, RL circuit, voltage divider
- **Filters**: Low-pass, high-pass, bandpass
- **Semiconductors**: Diode rectifier, BJT amplifier, Op-amp circuits

---

## LTspice (Windows / macOS)

**Download**: https://www.analog.com/en/resources/design-tools/ltspice-simulator.html — miễn phí từ Analog Devices.

### Cài Đặt

1. Tải file cài đặt từ trang Analog Devices
2. Cài đặt bình thường → launch LTspice XVII (hoặc LTspice 24 phiên bản mới)

### Giao Diện Chính

| Vùng | Mô Tả |
|------|-------|
| Schematic editor | Vẽ mạch |
| Waveform viewer | Xem kết quả simulation |
| SPICE netlist | File text mô tả mạch |
| Error log | Thông báo lỗi |

### Tạo Mạch Mới

1. **File → New Schematic** (Ctrl+N)
2. **Thêm linh kiện**: nhấn `P` → gõ tên (R, C, L, voltage, nmos...) → OK → click đặt
3. **Nối dây**: nhấn `W` → click điểm đầu → click điểm cuối
4. **Thêm Ground**: nhấn `G` → click vị trí
5. **Đặt giá trị**: right-click linh kiện → Value → nhập (ví dụ: 10k, 100n, 5V)
6. **Thêm label điện áp** (net label): nhấn `L` → gõ tên → đặt (ví dụ: Vout)

### Chạy Simulation

Các loại simulation:
- **Transient** (`.tran`): phân tích theo thời gian — dùng cho mạch RC/RL, BJT switch
- **AC** (`.ac`): phân tích tần số — dùng cho filter, Bode plot
- **DC Sweep** (`.dc`): quét điện áp DC — dùng cho đặc tuyến diode, BJT

**Cách thêm directive simulation**:
1. **Edit → SPICE Directive** (nhấn `S`)
2. Nhập ví dụ: `.tran 0 10m` (chạy transient 0 đến 10 ms)
3. Click đặt vào schematic

**Chạy**: nhấn nút Run (mũi tên xanh) hoặc Simulation → Run.

### Ví Dụ: Transient Mạch RC

```spice
.tran 0 5
V1 Vin GND 5V
R1 Vin Vout 10k
C1 Vout GND 100µ
.backanno
.end
```

Thêm directive `.tran 0 5` → Run → Click vào net `Vout` để xem dạng sóng.

### Xem Bode Plot (AC Analysis)

```spice
.ac dec 100 1 1Meg
V1 Vin GND AC 1
```

Sau khi chạy → trong waveform viewer: Plot Settings → Add Traces → chọn `V(Vout)`.

Để xem dB: gõ trong Expression box: `20*log10(abs(V(Vout)))`.

### Keyboard Shortcuts LTspice

| Phím | Chức Năng |
|------|-----------|
| `P` | Thêm component |
| `W` | Vẽ dây |
| `G` | Thêm Ground |
| `L` | Thêm net label |
| `F7` | Xóa |
| `Ctrl+R` | Xoay component |
| `Ctrl+Z` | Undo |
| `R` | Run simulation |
| `Ctrl+L` | Xem Error log |

---

## Tinkercad Circuits (Arduino Simulation)

**URL**: https://www.tinkercad.com/circuits — miễn phí, cần đăng ký.

Tinkercad cho phép mô phỏng **mạch điện + code Arduino** cùng lúc:

1. Đăng nhập → Create → Circuit
2. Kéo thả Arduino Uno, LED, điện trở, v.v. từ panel phải
3. Nhấn "Code" → viết sketch Arduino
4. Nhấn "Start Simulation" → quan sát LED nhấp nháy, Serial Monitor, oscilloscope...

**Điểm mạnh**: Không cần mua hardware — thử code và mạch trước khi làm thật.

---

## Wokwi — Arduino Simulator Nâng Cao

**URL**: https://wokwi.com — miễn phí, hỗ trợ ESP32, STM32, nhiều sensor.

Hỗ trợ thư viện Arduino đầy đủ (DHT, OLED SSD1306, Wire...) — phù hợp để thử Lesson 18–19 trước khi mua linh kiện.

---

## So Sánh Công Cụ

| Công Cụ | Mạnh | Yếu | Dùng Cho |
|---------|------|-----|---------|
| Falstad | Trực quan, realtime | Không phổ biến trong công nghiệp | Học circuit cơ bản, analog |
| LTspice | Chuẩn công nghiệp, free, mạnh | Giao diện khó học | Analog/power, filter, SPICE |
| Tinkercad | Arduino + mạch trong trình duyệt | Chậm, ít linh kiện | Beginner Arduino project |
| Wokwi | Thư viện đầy đủ, nhanh | Một số sensor chưa hỗ trợ | Embedded / IoT project |
