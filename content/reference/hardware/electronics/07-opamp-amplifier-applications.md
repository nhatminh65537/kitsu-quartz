---
title: "07. Op-Amp — Amplifier & Applications"
tags: [electronics, analog, lesson-07]
aliases: [Op-Amp Khuếch Đại Ứng Dụng]
created: 2026-03-30
---

> **Prerequisites**: [[06-bjt-transistor-amplifier-switch|06. BJT Transistor]]
> **Objectives**:
> - Nắm vững mô hình op-amp lý tưởng và hai quy tắc vàng
> - Phân tích mạch inverting và non-inverting amplifier
> - Thiết kế summing amplifier, difference amplifier, integrator
> - Dùng op-amp làm comparator
> - Biết các thông số quan trọng của op-amp thực (LM741, LM358, TL071)

---

## Motivation

BJT khuếch đại tốt nhưng cần phân cực cẩn thận, nhạy cảm với nhiệt độ và biến thiên $\beta$. **Op-amp (Operational Amplifier)** — bộ khuếch đại thuật toán — giải quyết vấn đề này bằng cách đóng gói một tầng khuếch đại cực mạnh bên trong một IC, rồi dùng **phản hồi âm (negative feedback)** để đạt các tính năng chính xác, ổn định.

Op-amp là "gạch xây" (building block) phổ biến nhất của mạch analog: khuếch đại, lọc tích cực, ADC, DAC, bộ điều khiển PID...

---

## Mô Hình Op-Amp Lý Tưởng

Op-amp có hai đầu vào: **non-inverting (+)** và **inverting (−)**, một đầu ra.

```
         V+  (+) ─┐
                  ├──── Vout = A(V+ − V−)
         V−  (−) ─┘
```

> [!definition] Definition 7.1 — Op-Amp Lý Tưởng
> Op-amp lý tưởng có các tính chất:
>
> - **Hệ số khuếch đại vòng hở** $A_{OL} = \infty$ (thực tế: 100 dB ~ $10^5$)
> - **Trở kháng vào** $Z_{in} = \infty$ (không hút dòng vào hai đầu vào)
> - **Trở kháng ra** $Z_{out} = 0$ (nguồn áp lý tưởng)
> - **Băng thông** = $\infty$ (thực tế: giới hạn bởi GBW)

### Hai Quy Tắc Vàng (Với Phản Hồi Âm)

> [!definition] Definition 7.2 — Hai Quy Tắc Vàng Op-Amp
>
> **Quy tắc 1**: Điện áp hai đầu vào **bằng nhau**: $V_+ = V_-$
>
> **Quy tắc 2**: Không có dòng vào hai đầu vào: $I_+ = I_- = 0$
>
> Hai quy tắc này chỉ đúng khi có **phản hồi âm** và op-amp **không bão hòa (saturated)**.

---

## Mạch Inverting Amplifier

```
    Vin ---[R1]--- V− ---[R_f]--- Vout
                    |
                   (−)
                   (+)--- GND
```

Áp dụng hai quy tắc vàng:
- $V_+ = 0\,\text{V}$ (nối GND) → $V_- = 0\,\text{V}$ (virtual ground)
- Dòng qua $R_1$: $I = V_{in}/R_1$ (không vào op-amp → chạy qua $R_f$)
- $V_{out} = V_- - I \cdot R_f = 0 - \frac{V_{in}}{R_1} \cdot R_f$

> [!definition] Definition 7.3 — Inverting Amplifier
>
> $$A_v = \frac{V_{out}}{V_{in}} = -\frac{R_f}{R_1}$$
>
> **Đảo pha 180°**, hệ số khuếch đại xác định hoàn toàn bởi tỉ lệ điện trở.

> [!example] Example 7.4
> $R_1 = 10\,\text{k}\Omega$, $R_f = 100\,\text{k}\Omega$ → $A_v = -10$ (khuếch đại 10 lần, đảo pha)

---

## Mạch Non-Inverting Amplifier

```
    Vin --- (+)
            (−) ---[R1]--- GND
             |
            [R_f]
             |
           Vout
```

> [!definition] Definition 7.5 — Non-Inverting Amplifier
>
> $$A_v = \frac{V_{out}}{V_{in}} = 1 + \frac{R_f}{R_1}$$
>
> **Cùng pha**, $A_v \geq 1$. Đặc biệt: $R_f = 0$ hoặc $R_1 = \infty$ → **Voltage follower** ($A_v = 1$) — trở kháng vào cao, ra thấp — dùng làm buffer.

---

## Các Cấu Hình Quan Trọng Khác

### Summing Amplifier (Bộ Cộng)

$$V_{out} = -R_f \left(\frac{V_1}{R_1} + \frac{V_2}{R_2} + \frac{V_3}{R_3}\right)$$

Nếu $R_1 = R_2 = R_3 = R_f$: $V_{out} = -(V_1 + V_2 + V_3)$. Ứng dụng: trộn âm thanh (audio mixer), DAC đơn giản.

### Difference Amplifier (Bộ Trừ)

Với $R_1 = R_2$, $R_3 = R_f$:

$$V_{out} = \frac{R_f}{R_1}(V_2 - V_1)$$

Ứng dụng: đọc cảm biến cầu Wheatstone, đo dòng điện (current sensing).

### Integrator

$$V_{out}(t) = -\frac{1}{R_1 C} \int V_{in}\,dt$$

Tụ $C$ thay thế $R_f$. Ứng dụng: tạo sóng tam giác từ sóng vuông, điều khiển PID.

### Comparator

Op-amp **không có phản hồi** → khuếch đại $A_{OL}$ cực lớn → đầu ra bão hòa ở $+V_{sat}$ hoặc $-V_{sat}$:

$$V_{out} = \begin{cases} +V_{sat} & \text{nếu } V_+ > V_- \\ -V_{sat} & \text{nếu } V_+ < V_- \end{cases}$$

Ứng dụng: phát hiện ngưỡng (thermostat, pin yếu...).

---

## Thông Số Thực Tế & Chọn Op-Amp

| Thông số | Ý nghĩa | Lưu ý |
|----------|---------|-------|
| **GBW** (Gain-Bandwidth Product) | $A_v \times f_{max}$ = hằng số | LM741: 1 MHz; TL071: 3 MHz |
| **Slew Rate** | Tốc độ thay đổi $V_{out}$ max [V/μs] | Quan trọng với tín hiệu nhanh |
| **Input Offset Voltage** $V_{OS}$ | Sai số điện áp vào | Cần bù cho mạch DC chính xác |
| **Rail-to-Rail** | $V_{out}$ gần bằng $V_{CC}$ và $V_{EE}$ | Quan trọng khi nguồn đơn 3.3V/5V |

**Gợi ý chọn op-amp phổ biến**:

| IC | Nguồn | Slew Rate | Ghi Chú |
|----|-------|-----------|---------|
| LM358 | Đơn/Đôi | 0,5 V/μs | Rẻ, phổ biến, nguồn đơn 3–32V |
| TL071/TL081 | Đôi | 13 V/μs | JFET input, offset thấp |
| MCP6002 | Đơn 1,8–6V | 0,6 V/μs | Rail-to-rail, dùng tốt với 3.3V MCU |
| LM741 | Đôi | 0,5 V/μs | Cổ điển, học lý thuyết |

---

## Summary / Key Takeaways

- Op-amp lý tưởng: $A_{OL} = \infty$, $Z_{in} = \infty$, $Z_{out} = 0$
- Hai quy tắc vàng (có phản hồi âm): $V_+ = V_-$; $I_{in} = 0$
- **Inverting**: $A_v = -R_f/R_1$ (đảo pha)
- **Non-inverting**: $A_v = 1 + R_f/R_1$ (cùng pha, $A_v \geq 1$)
- **Voltage follower**: $A_v = 1$, dùng làm buffer trở kháng
- **Comparator**: op-amp không phản hồi → đầu ra bão hòa ON/OFF
- Chú ý GBW, Slew Rate và Rail-to-Rail khi chọn IC

---

## References

- Sedra & Smith — *Microelectronic Circuits*, 7th ed., Ch. 2
- Horowitz & Hill — *The Art of Electronics*, 3rd ed., Ch. 4
- TI Op-Amp Application Note — https://www.ti.com/lit/an/sloa049d/sloa049d.pdf
