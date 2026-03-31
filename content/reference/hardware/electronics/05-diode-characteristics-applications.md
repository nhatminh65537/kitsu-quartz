---
title: "05. Diode — Characteristics & Applications"
tags: [electronics, analog, lesson-05]
aliases: [Diode Đặc Tuyến Ứng Dụng]
created: 2026-03-30
---

> **Prerequisites**: [[01-voltage-current-ohm|01. Ohm's Law]], [[04-thevenin-norton-superposition|04. Thevenin & Norton]]
> **Objectives**:
> - Hiểu cấu tạo và hoạt động của diode bán dẫn
> - Đọc và phân tích đặc tuyến V-I của diode
> - Phân tích mạch chỉnh lưu (rectifier) nửa sóng và toàn sóng
> - Ứng dụng Zener diode làm ổn áp đơn giản
> - Tính điện trở hạn dòng cho LED

---

## Motivation

Điện trở, tụ, cuộn cảm đều là **linh kiện tuyến tính** — hành vi không phụ thuộc chiều dòng điện. Diode là linh kiện **phi tuyến** đầu tiên bạn gặp: nó chỉ cho dòng chạy theo **một chiều** và chặn chiều ngược lại.

Hành vi đơn giản này mở ra vô số ứng dụng: chuyển đổi AC sang DC, bảo vệ mạch khỏi nối ngược, tạo tín hiệu radio, và là nền tảng của mọi linh kiện bán dẫn phức tạp hơn (transistor, IC).

---

## Cấu Tạo Bán Dẫn

### Chất Bán Dẫn & Tiếp Giáp P-N

Silicon (Si) là chất bán dẫn phổ biến nhất. Bằng cách pha tạp chất (doping):
- **Bán dẫn loại N (N-type)**: pha Phosphorus → dư electron (hạt tải âm)
- **Bán dẫn loại P (P-type)**: pha Boron → thiếu electron, tạo "lỗ trống" (hole — hạt tải dương)

Khi ghép P và N lại → tạo **tiếp giáp P-N (P-N junction)** = diode.

```
     Anode (A)    Cathode (K)
        P    |    N
        +----|----+
             |
          Tiếp giáp P-N
```

### Điện Áp Rào (Barrier Voltage)

Tại tiếp giáp, electron và lỗ trống kết hợp → tạo **vùng nghèo (depletion region)** không có hạt tải. Vùng này tạo ra điện áp rào nội tại:
- **Silicon**: $V_{barrier} \approx 0{,}6\text{–}0{,}7\,\text{V}$
- **Germanium**: $V_{barrier} \approx 0{,}2\text{–}0{,}3\,\text{V}$

---

## Đặc Tuyến V-I & Mô Hình Diode

### Phân Cực Thuận (Forward Bias)

Nối (+) vào Anode, (−) vào Cathode → điện áp ngoài chống lại điện áp rào → vùng nghèo thu hẹp → diode **dẫn điện**.

### Phân Cực Ngược (Reverse Bias)

Nối (−) vào Anode, (+) vào Cathode → vùng nghèo mở rộng → diode **khóa** (chỉ có dòng rò rất nhỏ $I_s$, cỡ nA).

> [!definition] Definition 5.1 — Phương Trình Shockley
> Quan hệ V-I của diode lý tưởng:
>
> $$I_D = I_s \left(e^{V_D / nV_T} - 1\right)$$
>
> Trong đó:
> - $I_s$ — dòng bão hòa ngược (saturation current), cỡ $10^{-12}$ A
> - $n$ — hệ số lý tưởng (ideality factor), 1–2
> - $V_T = kT/q \approx 26\,\text{mV}$ ở nhiệt độ phòng (thermal voltage)

### Mô Hình Đơn Giản Hóa

Trong thực tế, dùng mô hình đơn giản hơn:

| Mô hình | Mô tả | Khi nào dùng |
|---------|-------|-------------|
| Lý tưởng | $V_D = 0$ khi dẫn, hở mạch khi khóa | Phân tích nhanh, ước tính |
| Điện áp ngưỡng | $V_D = 0{,}7\,\text{V}$ khi dẫn (Si) | **Dùng thường xuyên** |
| Tuyến tính hóa | $V_D = 0{,}7\,\text{V}$ + $r_d \cdot i_D$ | Phân tích tín hiệu nhỏ |

> [!warning] Ngưỡng Diode Thực Tế
> - **Silicon (Si)**: $V_D \approx 0{,}6\text{–}0{,}7\,\text{V}$
> - **LED đỏ**: $V_D \approx 1{,}8\text{–}2{,}2\,\text{V}$
> - **LED xanh/trắng**: $V_D \approx 3{,}0\text{–}3{,}5\,\text{V}$
> - **Schottky**: $V_D \approx 0{,}2\text{–}0{,}4\,\text{V}$ (tốc độ nhanh, sụt áp thấp)

---

## Ứng Dụng 1 — Mạch Chỉnh Lưu (Rectifier)

### Chỉnh Lưu Nửa Sóng (Half-Wave)

```
    AC in ---[D1]---+--- DC out
                    |
                   [C] (tụ lọc)
                    |
    GND ------------+--- GND
```

- Chu kỳ dương: D1 dẫn → nạp tụ C
- Chu kỳ âm: D1 khóa → tụ C giữ điện áp (xả chậm qua tải)
- Điện áp ra (gần đúng): $V_{out} \approx V_{peak} - 0{,}7\,\text{V}$

### Chỉnh Lưu Toàn Sóng — Cầu Diode (Bridge Rectifier)

Dùng 4 diode, tận dụng cả hai nửa chu kỳ AC:

```
         D1        D3
    AC +---->|--+--|<----+ DC+
              |          |
    AC --|<---+-->|------+ DC-
         D4        D2
```

- Điện áp ra: $V_{out} \approx V_{peak} - 1{,}4\,\text{V}$ (sụt qua 2 diode)
- Tần số ripple = $2 \times$ tần số AC

---

## Ứng Dụng 2 — Tính Điện Trở Hạn Dòng LED

> [!example] Example 5.2 — LED Driver
> Nối LED đỏ ($V_{LED} = 2\,\text{V}$, $I_{LED} = 20\,\text{mA}$) vào $V_{CC} = 5\,\text{V}$.
>
> Điện áp trên điện trở:
>
> $$V_R = V_{CC} - V_{LED} = 5 - 2 = 3\,\text{V}$$
>
> Điện trở cần thiết:
>
> $$R = \frac{V_R}{I_{LED}} = \frac{3}{0{,}02} = 150\,\Omega$$
>
> Chọn giá trị chuẩn gần nhất: $R = 150\,\Omega$ hoặc $180\,\Omega$ (giảm dòng một chút, LED sáng hơi yếu hơn nhưng an toàn hơn).

---

## Ứng Dụng 3 — Zener Diode & Ổn Áp

**Zener diode** được thiết kế để hoạt động trong vùng **đánh thủng ngược** (reverse breakdown) một cách có kiểm soát ở điện áp $V_Z$ xác định.

```
    V_in ---[R_s]---+--- V_out = V_Z
                    |
                  [D_Z]  (Zener, phân cực ngược)
                    |
                   GND
```

> [!definition] Definition 5.3 — Mạch Ổn Áp Zener
> Khi $V_{in} > V_Z$: Zener dẫn, ghim $V_{out} = V_Z$.
>
> Điện trở $R_s$ phải đảm bảo:
> - Dòng qua Zener $I_Z > I_{Z,min}$ (thường 5 mA) để ổn áp
> - Dòng qua Zener $I_Z < I_{Z,max}$ (tính từ công suất max)
>
> $$R_s = \frac{V_{in} - V_Z}{I_Z + I_{load}}$$

> [!example] Example 5.4 — Thiết Kế Mạch Zener 5V
> $V_{in} = 12\,\text{V}$, Zener $V_Z = 5\,\text{V}$, $P_{Z,max} = 0{,}5\,\text{W}$, $I_{load} = 50\,\text{mA}$.
>
> Dòng Zener tối đa: $I_{Z,max} = P_{Z,max}/V_Z = 500/5 = 100\,\text{mA}$
>
> Chọn $I_Z = 20\,\text{mA}$ (an toàn):
>
> $$R_s = \frac{12 - 5}{0{,}02 + 0{,}05} = \frac{7}{0{,}07} = 100\,\Omega$$

> [!warning] Giới Hạn Mạch Zener
> Mạch Zener đơn giản nhưng **hiệu suất thấp** — năng lượng dư luôn tiêu tán trên $R_s$ và Zener. Cho ứng dụng cần điện nhiều, dùng Linear Regulator IC (Lesson 13) hoặc DC-DC converter (Lesson 14).

---

## Summary / Key Takeaways

- Diode chỉ dẫn dòng theo **một chiều**: Anode (+) → Cathode (−)
- Silicon diode có ngưỡng $V_D \approx 0{,}7\,\text{V}$; Schottky $\approx 0{,}3\,\text{V}$
- Mô hình thực dụng: $V_D = 0{,}7\,\text{V}$ khi dẫn, hở mạch khi khóa
- **Chỉnh lưu cầu**: 4 diode chuyển AC → DC (ripple 2× tần số AC)
- **LED**: luôn dùng điện trở hạn dòng; $R = (V_{CC} - V_{LED}) / I_{LED}$
- **Zener**: ghim điện áp ở $V_Z$ khi phân cực ngược; dùng làm ổn áp đơn giản

---

## References

- Sedra & Smith — *Microelectronic Circuits*, 7th ed., Ch. 3
- All About Circuits — https://www.allaboutcircuits.com/textbook/semiconductors/chpt-3/
- Falstad — thêm Diode, quan sát đặc tuyến V-I bằng cách bật "Scope"
