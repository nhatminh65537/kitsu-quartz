---
title: "A2. Formula Quick Reference"
tags: [electronics, appendix, reference]
aliases: [Bảng Tóm Tắt Công Thức]
created: 2026-03-30
---

> **Liên quan**: Tất cả lessons — tài liệu tham khảo nhanh cho toàn khóa học

---

## Module 0 — Circuit Fundamentals

### Định Luật Ohm & Công Suất

$$V = IR \qquad I = \frac{V}{R} \qquad R = \frac{V}{I}$$

$$P = VI = I^2 R = \frac{V^2}{R} \quad [\text{W}]$$

### Mạch Nối Tiếp & Song Song

$$R_{series} = R_1 + R_2 + \cdots$$

$$\frac{1}{R_{parallel}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots \qquad R_{2\text{ điện trở}} = \frac{R_1 R_2}{R_1 + R_2}$$

### Voltage Divider

$$V_{out} = V_{in} \cdot \frac{R_2}{R_1 + R_2}$$

### KCL & KVL

$$\sum I_{vào} = \sum I_{ra} \quad \text{(tại nút)} \qquad \sum V = 0 \quad \text{(quanh vòng)}$$

### Thevenin & Norton

$$V_{Th} = V_{oc} \qquad I_N = \frac{V_{Th}}{R_{Th}} \qquad R_{Th} = R_N$$

Truyền công suất cực đại: $R_L = R_{Th}$, $P_{max} = V_{Th}^2 / (4R_{Th})$

### Tụ Điện & Cuộn Cảm

$$i_C = C \frac{dv_C}{dt} \qquad v_L = L \frac{di_L}{dt}$$

$$E_C = \frac{1}{2}CV^2 \qquad E_L = \frac{1}{2}LI^2$$

$$C_{series} = \frac{C_1 C_2}{C_1 + C_2} \qquad C_{parallel} = C_1 + C_2$$

### Mạch RC / RL

$$V_C(t) = V_s(1 - e^{-t/\tau}) \quad \text{(nạp)} \qquad V_C(t) = V_0 e^{-t/\tau} \quad \text{(phóng)}$$

$$\tau_{RC} = RC \qquad \tau_{RL} = \frac{L}{R}$$

Đạt ổn định sau $5\tau$.

---

## Module 1 — Analog Electronics

### Diode

$$I_D = I_s(e^{V_D/nV_T} - 1) \qquad V_T \approx 26\,\text{mV} \text{ ở nhiệt độ phòng}$$

Mô hình đơn giản: $V_D = 0{,}7\,\text{V}$ (Si) khi dẫn; hở mạch khi khóa.

**LED resistor**:

$$R = \frac{V_{CC} - V_{LED}}{I_{LED}}$$

**Zener ổn áp**:

$$R_s = \frac{V_{in} - V_Z}{I_Z + I_{load}}$$

### BJT

$$I_C = \beta I_B \qquad I_E = I_C + I_B = (\beta + 1)I_B$$

**Switch (saturation)**:

$$R_B = \frac{V_{in} - V_{BE}}{I_B} \qquad I_{B,min} = \frac{I_C}{\beta_{forced}}$$

**CE Amplifier**:

$$A_v = -\frac{R_C}{r_e} \qquad r_e = \frac{26\,\text{mV}}{I_C}$$

**Q-point** (voltage divider bias):

$$V_B = V_{CC} \frac{R_2}{R_1+R_2} \quad V_E = V_B - 0{,}7 \quad I_C \approx \frac{V_E}{R_E} \quad V_{CE} = V_{CC} - I_C(R_C + R_E)$$

### Op-Amp

$$A_v^{inv} = -\frac{R_f}{R_1} \qquad A_v^{non-inv} = 1 + \frac{R_f}{R_1} \qquad A_v^{buffer} = 1$$

**Summing amp** (đồng giá trị điện trở):

$$V_{out} = -(V_1 + V_2 + V_3)$$

**Integrator**:

$$V_{out} = -\frac{1}{R_1 C}\int V_{in}\,dt$$

### Filter (RC Bậc 1)

$$f_c = \frac{1}{2\pi RC} \qquad |H(f_c)| = \frac{1}{\sqrt{2}} \approx 0{,}707 \;(= -3\,\text{dB})$$

**Decibel**: $A_{dB} = 20\log_{10}|H|$

LPF: −20 dB/decade sau $f_c$. Bậc 2: −40 dB/decade.

---

## Module 2 — Digital Electronics

### Hệ Số Đếm

| Decimal | Binary | Hex |
|---------|--------|-----|
| Chuyển → binary | Chia liên tiếp cho 2, lấy phần dư | |
| Chuyển → hex | Nhóm 4 bit nhị phân | |

**Bù 2 (số âm)**: đảo tất cả bit + cộng 1.

Phạm vi $n$-bit có dấu: $-2^{n-1}$ đến $2^{n-1}-1$.

### Đại Số Boolean & De Morgan

$$A + \bar{A} = 1 \quad A \cdot \bar{A} = 0 \quad A + AB = A \quad A(A+B) = A$$

$$\overline{AB} = \bar{A} + \bar{B} \qquad \overline{A+B} = \bar{A} \cdot \bar{B}$$

### Adder

$$Sum = A \oplus B \oplus C_{in} \qquad C_{out} = AB + C_{in}(A \oplus B)$$

### MUX 4-1

$$Y = \bar{S_1}\bar{S_0}D_0 + \bar{S_1}S_0 D_1 + S_1\bar{S_0}D_2 + S_1 S_0 D_3$$

### Flip-Flop

| FF | Đặc trưng | Q(t+1) |
|----|-----------|--------|
| D | Edge-triggered | $D$ |
| JK | Toggle khi J=K=1 | $J\bar{Q} + \bar{K}Q$ |
| T | Toggle khi T=1 | $T \oplus Q$ |

### FSM

**Moore**: output = f(state). **Mealy**: output = f(state, input).

**Điều kiện cân bằng Wheatstone**: $R_1 R_4 = R_2 R_3$

---

## Module 3 — Power Electronics

### Linear Regulator

$$P_{diss} = (V_{in} - V_{out}) \times I_{load}$$

$$\eta = \frac{P_{out}}{P_{in}} = \frac{V_{out}}{V_{in}}$$

$$T_J = T_{ambient} + P_{diss} \times \theta_{JA}$$

**LM317**:

$$V_{out} \approx 1{,}25\left(1 + \frac{R_2}{R_1}\right) \qquad R_1 = 240\,\Omega \text{ (thường dùng)}$$

### DC-DC Converter

| | Buck | Boost |
|--|------|-------|
| Công thức | $V_{out} = D \cdot V_{in}$ | $V_{out} = \dfrac{V_{in}}{1-D}$ |
| Duty cycle | $D = V_{out}/V_{in}$ | $D = 1 - V_{in}/V_{out}$ |

**Cuộn cảm Buck**:

$$L_{min} = \frac{(V_{in} - V_{out}) \cdot D}{f_{sw} \cdot \Delta I_L}$$

**Tụ ra Buck**:

$$C_{out} = \frac{\Delta I_L}{8 f_{sw} \Delta V_{out}}$$

---

## Module 4 — Embedded / MCU

### ADC

$$N = \frac{V_{in}}{V_{ref}} \times (2^{bits} - 1) \qquad V_{in} = \frac{N}{2^{bits}-1} \times V_{ref}$$

**Arduino 10-bit** ($V_{ref} = 5\,\text{V}$): $\Delta V = 5/1024 \approx 4{,}88\,\text{mV/step}$

### PWM

$$D = \frac{t_{on}}{T_s} \qquad f_{sw} = \frac{1}{T_s}$$

**Arduino analogWrite**: $V_{avg} = \frac{value}{255} \times V_{CC}$

### UART

$$t_{bit} = \frac{1}{\text{baudrate}} \qquad \text{ví dụ: 9600 bps} \to 104\,\mu\text{s/bit}$$

### Non-Blocking Timer (Arduino Pattern)

```cpp
if (millis() - previousMillis >= interval) {
    previousMillis = millis();
    // Hành động định kỳ
}
```

### millis() Overflow

`millis()` tràn sau $2^{32} \,\text{ms} = 49{,}7$ ngày.

Phép trừ `unsigned long` luôn đúng ngay cả khi tràn:

$$\Delta t = t_{current} - t_{previous} \quad \text{(unsigned subtraction — luôn đúng)}$$

---

## Hệ Số Tiền Tố (Prefixes)

| Tiền Tố | Ký Hiệu | Hệ Số |
|---------|---------|-------|
| Giga | G | $10^9$ |
| Mega | M | $10^6$ |
| Kilo | k | $10^3$ |
| milli | m | $10^{-3}$ |
| micro | μ | $10^{-6}$ |
| nano | n | $10^{-9}$ |
| pico | p | $10^{-12}$ |

---

## Giá Trị Điện Trở Chuẩn (E24 Series)

1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1 (× 10^n)

Phổ biến nhất: 100, 220, 330, 470, 1k, 2.2k, 4.7k, 10k, 22k, 47k, 100k, 1M Ω
