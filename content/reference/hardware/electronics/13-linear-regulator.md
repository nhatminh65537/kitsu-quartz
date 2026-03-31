---
title: "13. Linear Voltage Regulator"
tags: [electronics, power, lesson-13]
aliases: [Nguồn Cấp Điện Tuyến Tính Linear Regulator]
created: 2026-03-30
---

> **Prerequisites**: [[05-diode-characteristics-applications|05. Diode]], [[06-bjt-transistor-amplifier-switch|06. BJT Transistor]]
> **Objectives**:
> - Hiểu nguyên lý hoạt động của linear regulator (bộ ổn áp tuyến tính)
> - Tính toán và thiết kế mạch nguồn với 7805 / 78xx series
> - Hiểu khái niệm dropout voltage và chọn LDO phù hợp
> - Tính toán tiêu tán nhiệt và lựa chọn tản nhiệt (heatsink)
> - Phân biệt fixed vs adjustable regulator (LM317)

---

## Motivation

Hầu hết vi mạch cần **điện áp DC ổn định** — không dao động theo tải hay theo nguồn vào. Nguồn từ pin, adapter hay chỉnh lưu AC đều dao động trong một dải. **Bộ ổn áp tuyến tính (linear voltage regulator)** giải quyết vấn đề này: ghim điện áp ra tại một giá trị cố định bất kể biến động.

Linear regulator đơn giản, giá rẻ, ít nhiễu — phù hợp cho các ứng dụng yêu cầu điện nhỏ và chất lượng tín hiệu cao (mạch analog, ADC, audio). Hạn chế là hiệu suất thấp khi chênh lệch điện áp lớn.

---

## Nguyên Lý Hoạt Động

Linear regulator về bản chất là một **transistor pass (pass transistor)** được điều khiển bởi mạch phản hồi:

```
    V_in ---[Q_pass]--- V_out
                  ↑
            [Error Amp] ←── V_ref (bandgap)
                  ↑
             V_out (feedback)
```

> [!definition] Definition 13.1 — Nguyên Lý Linear Regulator
> Mạch phản hồi liên tục so sánh $V_{out}$ với điện áp tham chiếu $V_{ref}$ (thường từ bandgap reference $\approx 1{,}25\,\text{V}$):
>
> - Nếu $V_{out}$ tăng → transistor pass kẹp bớt → $V_{out}$ giảm về đúng giá trị
> - Nếu $V_{out}$ giảm → transistor pass mở thêm → $V_{out}$ tăng về đúng giá trị
>
> Năng lượng dư $(V_{in} - V_{out}) \times I_{load}$ bị tiêu tán dưới dạng **nhiệt** trên transistor pass.

---

## Họ 78xx — Fixed Linear Regulator

Họ **78xx** (Texas Instruments, ON Semi, STMicro...) là linear regulator fixed phổ biến nhất:

| IC | $V_{out}$ | $I_{max}$ | Ghi Chú |
|----|-----------|-----------|---------|
| 7805 | +5 V | 1,5 A | Phổ biến nhất |
| 7808 | +8 V | 1,5 A | |
| 7809 | +9 V | 1,5 A | |
| 7812 | +12 V | 1,5 A | |
| 7815 | +15 V | 1,5 A | |
| 7905 | −5 V | 1,5 A | Series âm |

**Pinout TO-220 package**: PIN 1 = Input, PIN 2 = GND, PIN 3 = Output.

### Mạch Cơ Bản 7805

```
    V_in (7–35V)
        |
       [0.33 μF] (tụ vào, lọc noise tần số cao)
        |
    PIN1 [7805] PIN3 ── V_out = 5V
        |
       PIN2
        |
       [0.1 μF] (tụ ra, cải thiện transient response)
        |
       GND
```

> [!definition] Definition 13.2 — Điều Kiện Hoạt Động 7805
>
> - $V_{in,min} = V_{out} + V_{dropout} = 5 + 2{,}5 = 7{,}5\,\text{V}$ (thường lấy tối thiểu 7 V)
> - $V_{in,max} = 35\,\text{V}$
> - $I_{out,max} = 1{,}5\,\text{A}$ (cần heatsink khi $I > 0{,}5\,\text{A}$)
> - Bảo vệ tích hợp: ngắn mạch, quá nhiệt (thermal shutdown ở $\approx 150°\text{C}$)

> [!example] Example 13.3 — Nguồn 5V Cho Arduino Từ 12V
> Nguồn vào: $V_{in} = 12\,\text{V}$, tải Arduino: $I_{load} = 200\,\text{mA}$
>
> Điện áp dropout: $V_{drop} = V_{in} - V_{out} = 12 - 5 = 7\,\text{V}$
>
> Công suất tiêu tán trên 7805:
>
> $$P_{diss} = (V_{in} - V_{out}) \times I_{load} = 7 \times 0{,}2 = 1{,}4\,\text{W}$$
>
> Hiệu suất: $\eta = P_{out}/P_{in} = (5 \times 0{,}2)/(12 \times 0{,}2) = 1/2{,}4 = 41{,}7\%$
>
> → Với $P_{diss} = 1{,}4\,\text{W}$ cần thêm **heatsink** nhỏ cho 7805.

---

## Dropout Voltage & LDO Regulator

> [!definition] Definition 13.4 — Dropout Voltage
> **Dropout voltage** ($V_{DO}$) là chênh lệch điện áp tối thiểu giữa $V_{in}$ và $V_{out}$ để regulator còn hoạt động ổn định:
>
> $$V_{in,min} = V_{out} + V_{DO}$$
>
> - **Standard regulator** (7805): $V_{DO} \approx 2{,}0\text{–}2{,}5\,\text{V}$
> - **LDO (Low Dropout)**: $V_{DO} < 1\,\text{V}$ (thường 0,1–0,6 V)

**Khi nào cần LDO**: Nạp từ pin Li-ion (3,7 V) để lấy 3,3 V cho MCU → chênh lệch chỉ 0,4 V → bắt buộc dùng LDO.

| IC LDO | $V_{out}$ | $V_{DO}$ | $I_{max}$ | Ghi Chú |
|--------|-----------|----------|-----------|---------|
| AMS1117-3.3 | 3,3 V | 1,1 V | 1 A | Rất phổ biến, rẻ |
| AMS1117-5.0 | 5 V | 1,1 V | 1 A | |
| MIC5205-3.3 | 3,3 V | 0,18 V | 150 mA | Ultra-LDO, SOT-23 |
| LP2985-3.3 | 3,3 V | 0,35 V | 150 mA | Noise thấp, cho ADC |

---

## Regulator Có Thể Điều Chỉnh — LM317

**LM317** là adjustable positive regulator, điện áp ra từ 1,25 V đến 37 V:

```
    V_in ---[ADJ in]--- V_out
                  |
                 [R1]    ← thường 240 Ω
                  |
                 [R2]    ← điều chỉnh
                  |
                 GND
```

> [!definition] Definition 13.5 — Công Thức LM317
>
> $$V_{out} = 1{,}25\,\text{V} \times \left(1 + \frac{R_2}{R_1}\right) + I_{adj} \times R_2$$
>
> Gần đúng ($I_{adj} \approx 50\,\mu\text{A}$ nhỏ, bỏ qua):
>
> $$V_{out} \approx 1{,}25 \times \left(1 + \frac{R_2}{R_1}\right)$$

> [!example] Example 13.6 — Tính R2 Cho LM317 Ra 9V
> Chọn $R_1 = 240\,\Omega$, tìm $R_2$:
>
> $$9 = 1{,}25 \times \left(1 + \frac{R_2}{240}\right) \implies R_2 = 240 \times \left(\frac{9}{1{,}25} - 1\right) = 240 \times 6{,}2 = 1{,}488\,\text{k}\Omega$$
>
> Chọn $R_2 = 1{,}5\,\text{k}\Omega$ (giá trị chuẩn gần nhất → $V_{out} = 1{,}25 \times (1 + 1500/240) = 9{,}06\,\text{V}$, đủ gần).

---

## Tính Toán Nhiệt & Heatsink

> [!definition] Definition 13.7 — Nhiệt Trở (Thermal Resistance)
> Nhiệt trở $\theta$ [°C/W] đặc trưng cho khả năng tản nhiệt:
>
> $$T_{junction} = T_{ambient} + P_{diss} \times \theta_{JA}$$
>
> Với 7805 TO-220: $\theta_{JA} = 65\,\text{°C/W}$ (không có heatsink)
>
> Nhiệt độ junction tối đa: $T_{J,max} = 150\,\text{°C}$

> [!example] Example 13.8 — Kiểm Tra Cần Heatsink Không?
> $P_{diss} = 1{,}4\,\text{W}$, $T_{ambient} = 25\,\text{°C}$, 7805 TO-220 không có heatsink.
>
> $$T_J = 25 + 1{,}4 \times 65 = 25 + 91 = 116\,\text{°C} < 150\,\text{°C}$$
>
> → Kỹ thuật còn trong giới hạn, nhưng rất gần ngưỡng. Nên thêm heatsink để an toàn (mục tiêu $T_J < 100\,\text{°C}$).

---

## Khi Nào Không Dùng Linear Regulator?

| Điều kiện | Nên dùng |
|-----------|---------|
| $V_{in} - V_{out} < 3\,\text{V}$, dòng nhỏ | Linear (LDO) ✓ |
| Cần noise thấp cho ADC/audio | Linear ✓ |
| $P_{diss} > 3\,\text{W}$ | DC-DC converter (Lesson 14) ✓ |
| Hiệu suất > 80% quan trọng | DC-DC converter ✓ |
| Nguồn pin, thiết bị di động | DC-DC converter ✓ |

---

## Summary / Key Takeaways

- Linear regulator = pass transistor + feedback loop; năng lượng dư → nhiệt
- **78xx**: fixed output, dễ dùng, $V_{in,min} = V_{out} + 2{,}5\,\text{V}$
- **LDO**: dropout thấp (<1 V), cần thiết khi nguồn và tải sát nhau (3,7 V → 3,3 V)
- **LM317**: adjustable 1,25–37 V; $V_{out} = 1{,}25(1 + R_2/R_1)$
- Luôn tính $P_{diss} = (V_{in} - V_{out}) \times I_{load}$ và kiểm tra nhiệt độ junction
- Tụ vào 0,33 μF + tụ ra 0,1 μF là yêu cầu tối thiểu của 78xx

---

## References

- Texas Instruments — LM7805/LM340 Datasheet (ti.com)
- Texas Instruments — LM317 Datasheet (ti.com)
- AMS1117 Datasheet — https://www.advanced-monolithic.com/pdf/ds1117.pdf
- Horowitz & Hill — *The Art of Electronics*, 3rd ed., Ch. 9
