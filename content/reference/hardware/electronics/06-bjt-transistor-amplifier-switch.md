---
title: "06. BJT Transistor — Amplifier & Switch"
tags: [electronics, analog, lesson-06]
aliases: [BJT Transistor Khuếch Đại Switch]
created: 2026-03-30
---

> **Prerequisites**: [[05-diode-characteristics-applications|05. Diode]]
> **Objectives**:
> - Hiểu cấu tạo và nguyên lý hoạt động của BJT (NPN và PNP)
> - Xác định ba vùng hoạt động: cutoff, active, saturation
> - Thiết kế mạch phân cực (bias) cho BJT khuếch đại
> - Dùng BJT làm công tắc điện tử để điều khiển tải

---

## Motivation

Diode chỉ là "van một chiều". **Transistor** là linh kiện ba chân đột phá hơn nhiều: một dòng điện nhỏ tại một chân **kiểm soát** dòng điện lớn hơn nhiều ở chân khác. Đây là nguyên lý **khuếch đại (amplification)**.

Bipolar Junction Transistor (BJT) là loại transistor cổ điển nhất, ra đời năm 1947 tại Bell Labs. Mặc dù MOSFET đã thay thế BJT trong hầu hết IC số, BJT vẫn phổ biến trong mạch khuếch đại analog, điều khiển tải DC, và các mạch bảo vệ.

---

## Cấu Tạo BJT

BJT gồm ba lớp bán dẫn xen kẽ, tạo thành hai tiếp giáp P-N:

```
    NPN:  N (Emitter) | P (Base) | N (Collector)
    PNP:  P (Emitter) | N (Base) | P (Collector)
```

**Ba chân**: Emitter (E), Base (B), Collector (C)

Ký hiệu schematic:

```
NPN:                PNP:
    C                   C
    |                   |
B --+--→               --+-- B
    |   \              /   |
    E    )            (    E
         ↑ mũi tên         ↑ mũi tên
       ở Emitter         ở Emitter
       (NPN: ra)        (PNP: vào)
```

Quy tắc nhớ: **mũi tên Emitter chỉ chiều dòng điện quy ước** qua E.

---

## Ba Vùng Hoạt Động

> [!definition] Definition 6.1 — Ba Vùng Hoạt Động BJT (NPN)
>
> | Vùng | $V_{BE}$ | $V_{CE}$ | Trạng thái |
> |------|----------|----------|-----------|
> | **Cutoff** | $< 0{,}6\,\text{V}$ | Bất kỳ | Khóa hoàn toàn, $I_C \approx 0$ |
> | **Active** | $\approx 0{,}7\,\text{V}$ | $> V_{CE,sat}$ | Khuếch đại: $I_C = \beta I_B$ |
> | **Saturation** | $\approx 0{,}7\,\text{V}$ | $< 0{,}2\,\text{V}$ | Bão hòa: $V_{CE} \approx 0{,}2\,\text{V}$ |

**Hệ số khuếch đại dòng (current gain)**:

$$\beta = h_{FE} = \frac{I_C}{I_B} \quad \text{(vùng active)}$$

Giá trị $\beta$ thường 50–500, phụ thuộc linh kiện và điều kiện hoạt động.

---

## Ứng Dụng 1 — BJT Làm Switch (Công Tắc)

Đây là ứng dụng phổ biến nhất trong embedded systems: dùng tín hiệu 3.3V/5V từ GPIO của microcontroller để điều khiển tải lớn hơn (relay, motor, LED strip...).

```
    V_CC (+12V)
        |
       [Tải] (relay, motor, v.v.)
        |
        C
    B --+   (NPN BJT)
        |
        E
        |
       GND

    GPIO (3.3V) ---[R_B]--- B
```

### Thiết Kế Mạch Switch

> [!definition] Definition 6.2 — Điều Kiện Bão Hòa (Saturation)
> Để BJT **khóa hoàn toàn** (cutoff): $V_{GPIO} = 0\,\text{V}$, $I_B = 0$
>
> Để BJT **dẫn hoàn toàn** (saturation): cần $I_B \geq I_{B,sat}$
>
> $$I_{B,sat} = \frac{I_{C,sat}}{\beta_{forced}} \quad \text{với } \beta_{forced} \approx \frac{\beta}{10} \text{ (để đảm bảo bão hòa)}$$

> [!example] Example 6.3 — Tính R_B Cho Mạch Switch
> Điều khiển relay 12V (cuộn 120 Ω) bằng GPIO 3,3V. Dùng transistor 2N2222 ($\beta_{min} = 100$).
>
> Dòng collector cần thiết:
>
> $$I_C = \frac{V_{CC}}{R_{coil}} = \frac{12}{120} = 100\,\text{mA}$$
>
> Dòng base tối thiểu (dùng $\beta_{forced} = 10$):
>
> $$I_{B,sat} = \frac{I_C}{\beta_{forced}} = \frac{100\,\text{mA}}{10} = 10\,\text{mA}$$
>
> Điện trở base:
>
> $$R_B = \frac{V_{GPIO} - V_{BE}}{I_B} = \frac{3{,}3 - 0{,}7}{10\,\text{mA}} = \frac{2{,}6}{0{,}01} = 260\,\Omega$$
>
> Chọn $R_B = 220\,\Omega$ (giá trị chuẩn gần nhất).
>
> **Quan trọng**: thêm **diode freewheeling** (1N4007) song song với relay để bảo vệ transistor khỏi điện áp ngược khi relay ngắt.

---

## Ứng Dụng 2 — BJT Khuếch Đại (Common Emitter)

Cấu hình **Common Emitter (CE)** là cấu hình khuếch đại phổ biến nhất — đảo pha, khuếch đại điện áp.

```
       V_CC
        |
       [R_C]
        |
        +-----> V_out
        |
    C   |
    |   |
B --+   |  (NPN)
    |   |
    E   |
    |   |
   [R_E]
    |
   GND
```

### Phân Cực (Biasing) — Voltage Divider Bias

Để BJT hoạt động ổn định ở vùng active, cần **phân cực tĩnh (DC bias)**:

```
    V_CC
     |
    [R1]
     |
     +--- B --- C ---[R_C]--- V_CC
     |    |
    [R2]  E
     |    |
    GND  [R_E]
          |
         GND
```

> [!definition] Definition 6.4 — Điểm Làm Việc Tĩnh (Q-Point)
> Q-point (Quiescent point) là điểm hoạt động DC của transistor khi không có tín hiệu vào.
>
> Quy trình xác định Q-point (voltage divider bias):
>
> 1. $V_B = V_{CC} \cdot \frac{R_2}{R_1 + R_2}$ (phân áp)
> 2. $V_E = V_B - 0{,}7$ (điện áp emitter)
> 3. $I_E \approx I_C = \frac{V_E}{R_E}$
> 4. $V_{CE} = V_{CC} - I_C(R_C + R_E)$
>
> Chọn Q-point ở giữa vùng active: $V_{CE} \approx V_{CC}/2$ để tín hiệu ra không bị méo.

### Hệ Số Khuếch Đại Điện Áp

$$A_v = -\frac{R_C}{r_e} \approx -\frac{R_C}{26\,\text{mV}/I_C}$$

Dấu âm: Common Emitter **đảo pha** 180°.

---

## Bảo Vệ & Lưu Ý Thực Tế

> [!warning] Các Lỗi Phổ Biến Khi Dùng BJT
>
> 1. **Không có R_B**: nối thẳng GPIO vào Base → dòng quá lớn, cháy cả GPIO lẫn BJT
> 2. **Thiếu diode freewheeling** khi điều khiển tải cảm (relay, motor) → điện áp cảm ứng ngược phá BJT
> 3. **Nhầm chân**: luôn kiểm tra datasheet — thứ tự chân E/B/C khác nhau giữa các linh kiện
> 4. **Quá dòng Collector**: kiểm tra $I_{C,max}$ trong datasheet

---

## Summary / Key Takeaways

- BJT có ba vùng: **cutoff** (khóa), **active** (khuếch đại, $I_C = \beta I_B$), **saturation** (dẫn bão hòa)
- **Switch**: đẩy BJT vào saturation (dẫn) hoặc cutoff (khóa); tính $R_B$ từ $I_B$ cần thiết
- **Khuếch đại CE**: phân cực ở Q-point giữa vùng active; $A_v = -R_C/r_e$; đảo pha
- Luôn thêm **diode freewheeling** khi điều khiển tải cảm
- $\beta$ biến thiên nhiều → thiết kế ổn định phải độc lập với $\beta$ (dùng emitter resistor $R_E$)

---

## References

- Sedra & Smith — *Microelectronic Circuits*, 7th ed., Ch. 5–6
- Horowitz & Hill — *The Art of Electronics*, 3rd ed., Ch. 2
- 2N2222 Datasheet — https://www.onsemi.com/pdf/datasheet/p2n2222a-d.pdf
