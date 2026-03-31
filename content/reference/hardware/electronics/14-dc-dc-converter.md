---
title: "14. DC-DC Converter — Buck & Boost"
tags: [electronics, power, lesson-14]
aliases: [DC-DC Converter Buck Boost]
created: 2026-03-30
---

> **Prerequisites**: [[03-capacitor-inductor-rc-rl|03. Tụ Điện & Cuộn Cảm]], [[13-linear-regulator|13. Linear Regulator]]
> **Objectives**:
> - Hiểu nguyên lý chuyển mạch (switching) của DC-DC converter
> - Phân tích mạch Buck (step-down) và Boost (step-up) theo chu kỳ
> - Tính duty cycle, cuộn cảm và tụ điện cho Buck/Boost
> - So sánh hiệu suất với linear regulator
> - Biết dùng module DC-DC sẵn có (XL4016, LM2596, MT3608)

---

## Motivation

Linear regulator đơn giản nhưng **tiêu tán năng lượng dưới dạng nhiệt**. Khi cần chuyển 12 V → 5 V ở 2 A, linear regulator tiêu tán $(12-5) \times 2 = 14\,\text{W}$ — cần tản nhiệt khổng lồ, pin cạn nhanh.

**DC-DC switching converter** giải quyết vấn đề này bằng cách **đóng mở nhanh** một transistor (thường MOSFET) thay vì "đốt" năng lượng dư. Hiệu suất điển hình 85–95%, giảm nhiệt đáng kể. Đây là công nghệ nền tảng của mọi adapter sạc, laptop power supply, thiết bị điện tử hiện đại.

---

## Khái Niệm PWM & Duty Cycle

> [!definition] Definition 14.1 — PWM và Duty Cycle
> **PWM (Pulse Width Modulation)** là kỹ thuật đóng mở switch theo tần số cố định $f_{sw}$, thay đổi tỉ lệ thời gian bật/tắt:
>
> $$D = \frac{t_{on}}{T_s} = f_{sw} \times t_{on} \quad (0 < D < 1)$$
>
> Trong đó $T_s = 1/f_{sw}$ là chu kỳ chuyển mạch. Tần số switching thường từ 50 kHz đến 2 MHz.
>
> **Ý nghĩa vật lý**: Switch bật $D \times 100\%$ thời gian trong mỗi chu kỳ.

---

## Buck Converter (Step-Down)

Buck converter giảm điện áp: $V_{out} < V_{in}$.

### Cấu Tạo & Hoạt Động

```
    V_in ---[SW]---+---[L]--- V_out
                   |          |
                  [D]        [C]
                   |          |
                  GND        GND
```

**Giai đoạn ON** ($t_{on}$): SW đóng, $V_{in}$ đặt lên L, dòng qua L tăng tuyến tính, D bị reverse-biased (khóa). L nạp năng lượng, C cấp dòng cho tải.

**Giai đoạn OFF** ($t_{off}$): SW mở, L duy trì dòng qua D (freewheeling diode). Dòng qua L giảm tuyến tính, L cấp năng lượng cho C và tải.

> [!definition] Definition 14.2 — Công Thức Buck Converter (CCM)
> Trong chế độ CCM (Continuous Conduction Mode) — dòng L không về 0:
>
> $$\boxed{V_{out} = D \times V_{in}}$$
>
> Cuộn cảm tối thiểu:
>
> $$L_{min} = \frac{(V_{in} - V_{out}) \times D}{f_{sw} \times \Delta I_L}$$
>
> Với $\Delta I_L$ = ripple dòng qua L (thường chọn 20–40% $I_{out}$).
>
> Tụ ra:
>
> $$C_{out} = \frac{\Delta I_L}{8 \times f_{sw} \times \Delta V_{out}}$$

> [!example] Example 14.3 — Thiết Kế Buck 12V → 5V / 1A
> $V_{in} = 12\,\text{V}$, $V_{out} = 5\,\text{V}$, $I_{out} = 1\,\text{A}$, $f_{sw} = 500\,\text{kHz}$
>
> Duty cycle:
>
> $$D = \frac{V_{out}}{V_{in}} = \frac{5}{12} = 0{,}417$$
>
> Ripple dòng (chọn 30%): $\Delta I_L = 0{,}3 \times 1 = 0{,}3\,\text{A}$
>
> Cuộn cảm:
>
> $$L = \frac{(12 - 5) \times 0{,}417}{500{,}000 \times 0{,}3} = \frac{2{,}92}{150{,}000} \approx 19{,}4\,\mu\text{H}$$
>
> → Chọn $L = 22\,\mu\text{H}$.
>
> Tụ ra (ripple $\Delta V = 50\,\text{mV}$):
>
> $$C_{out} = \frac{0{,}3}{8 \times 500{,}000 \times 0{,}05} = \frac{0{,}3}{200{,}000} = 1{,}5\,\mu\text{F}$$
>
> → Chọn $C_{out} = 10\,\mu\text{F}$ (ceramic, low ESR).

---

## Boost Converter (Step-Up)

Boost converter tăng điện áp: $V_{out} > V_{in}$.

### Cấu Tạo & Hoạt Động

```
    V_in ---[L]---+---[D]--- V_out
                  |          |
                 [SW]       [C]
                  |          |
                 GND        GND
```

**Giai đoạn ON**: SW đóng, $V_{in}$ đặt lên L, dòng qua L tăng, D bị reverse-biased. C cấp dòng cho tải.

**Giai đoạn OFF**: SW mở, L giải phóng năng lượng qua D vào C và tải. $V_L + V_{in}$ cấp cho đầu ra → $V_{out} > V_{in}$.

> [!definition] Definition 14.4 — Công Thức Boost Converter (CCM)
>
> $$\boxed{V_{out} = \frac{V_{in}}{1 - D}}$$
>
> → Suy ra duty cycle cần thiết:
>
> $$D = 1 - \frac{V_{in}}{V_{out}}$$

> [!example] Example 14.5 — Duty Cycle Boost 5V → 12V
>
> $$D = 1 - \frac{5}{12} = 1 - 0{,}417 = 0{,}583$$
>
> Switch bật 58,3% mỗi chu kỳ.

---

## So Sánh Hiệu Suất

| | Linear Regulator | Buck Converter |
|--|------------------|----------------|
| Hiệu suất điển hình | $V_{out}/V_{in}$ | 85–95% |
| Ví dụ 12V→5V, 1A | $5/12 = 41{,}7\%$ | ~90% |
| Nhiệt sinh ra | Cao | Thấp |
| Độ phức tạp | Thấp | Trung bình |
| Nhiễu (noise) | Thấp | Có ripple switching |
| Kích thước | Nhỏ (cần heatsink) | Cần L, C lớn hơn |

---

## Module DC-DC Sẵn Có

Với người mới bắt đầu, **mua module DC-DC sẵn có** tiết kiệm thời gian và đảm bảo hiệu suất tốt:

| Module | Topology | V_in | V_out | I_max | Ghi Chú |
|--------|----------|------|-------|-------|---------|
| LM2596 | Buck | 4–40 V | Adj | 3 A | IC TI, phổ biến |
| XL4016 | Buck | 8–36 V | Adj | 8 A | Giá rẻ, dòng lớn |
| MT3608 | Boost | 2–24 V | Adj đến 28 V | 2 A | Module nhỏ gọn |
| MP1584 | Buck | 4,5–28 V | Adj | 3 A | Hiệu suất cao |

**Cách dùng module**: điều chỉnh biến trở trên module để đặt điện áp ra, đo bằng multimeter.

---

## Synchronous vs Non-Synchronous

> [!definition] Definition 14.6 — Synchronous Converter
> **Non-synchronous**: dùng diode freewheeling (đơn giản, mất ~0,7 V)
>
> **Synchronous**: thay diode bằng **MOSFET thứ hai** điều khiển bù pha → điện áp rơi thấp hơn ($< 0{,}1\,\text{V}$) → hiệu suất cao hơn ~3–5%.
>
> Hầu hết IC DC-DC hiện đại đều là synchronous.

---

## Bảo Vệ & Lưu Ý Thực Tế

> [!warning] Lưu Ý Quan Trọng
>
> 1. **Input capacitor**: luôn đặt tụ ceramic gần input của IC để lọc switching noise
> 2. **Cuộn cảm bão hòa (saturation)**: chọn L có $I_{sat} > I_{peak}$ — nếu L bão hòa, hiệu suất sụp đổ
> 3. **ESR tụ ra**: tụ electrolytic có ESR cao → tăng ripple đầu ra. Dùng tụ ceramic (MLCC) nếu có thể
> 4. **Layout PCB**: đặt L và C gần IC nhất có thể; vòng switching (hot loop) cần nhỏ để giảm EMI
> 5. **Không tải (no-load)**: nhiều IC chuyển sang DCM khi tải nhẹ — đây là bình thường

---

## Summary / Key Takeaways

- DC-DC converter dùng **PWM switch** thay vì "đốt" năng lượng dư → hiệu suất 85–95%
- **Buck**: $V_{out} = D \times V_{in}$ — giảm áp
- **Boost**: $V_{out} = V_{in}/(1-D)$ — tăng áp
- Duty cycle $D$ điều chỉnh điện áp ra; $f_{sw}$ cao → L và C nhỏ hơn
- Với prototype: dùng module LM2596 (buck) hoặc MT3608 (boost) sẵn có
- Cần L không bão hòa và tụ low-ESR để đạt hiệu suất tốt

---

## References

- Texas Instruments — LM2596 Datasheet (ti.com)
- Monolithic Power Systems — Buck Converter Design Guide (monolithicpower.com)
- Würth Elektronik — DC-DC Converter Design Guide (we-online.com)
- Horowitz & Hill — *The Art of Electronics*, 3rd ed., Ch. 9
