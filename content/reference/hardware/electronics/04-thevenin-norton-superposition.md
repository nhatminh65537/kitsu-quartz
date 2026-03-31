---
title: "04. Thevenin, Norton & Superposition"
tags: [electronics, circuit-fundamentals, lesson-04]
aliases: [Thevenin Norton Superposition]
created: 2026-03-30
---

> **Prerequisites**: [[01-voltage-current-ohm|01. Ohm's Law]], [[02-kirchhoff-circuit-analysis|02. Kirchhoff's Laws]]
> **Objectives**:
> - Rút gọn mạch phức tạp thành mạch tương đương Thevenin và Norton
> - Áp dụng nguyên lý xếp chồng (superposition) với nhiều nguồn
> - Hiểu điều kiện truyền công suất cực đại
> - Ứng dụng vào phân tích mạch thực tế

---

## Motivation

Trong thực tế, bạn thường gặp tình huống: có một mạch điện phức tạp và muốn biết nó "nhìn" như thế nào từ hai đầu ra. Ví dụ: một nguồn pin với điện trở trong, hay một mạch khuếch đại cần nối với tải.

**Định lý Thevenin** và **Norton** cho phép thay thế bất kỳ mạch tuyến tính nào bằng một mạch cực kỳ đơn giản — chỉ gồm một nguồn và một điện trở. Đây là công cụ phân tích mạch mạnh mẽ nhất trong kỹ thuật điện.

---

## Nguyên Lý Xếp Chồng (Superposition)

> [!definition] Definition 4.1 — Nguyên Lý Superposition
> Trong mạch **tuyến tính** có nhiều nguồn độc lập, đáp ứng (dòng hoặc áp) tại bất kỳ phần tử nào bằng **tổng đại số** các đáp ứng riêng lẻ gây ra bởi từng nguồn, khi **tắt tất cả các nguồn còn lại**.
>
> **Cách tắt nguồn**:
> - Nguồn áp (voltage source): **ngắn mạch** (thay bằng dây nối)
> - Nguồn dòng (current source): **hở mạch** (tháo ra)

> [!example] Example 4.2 — Superposition Hai Nguồn Áp
> Mạch: $V_1 = 12\,\text{V}$, $V_2 = 6\,\text{V}$, $R_1 = R_2 = R_3 = 6\,\Omega$.
>
> **Bước 1**: Tắt $V_2$ (ngắn mạch) → tính $I'$ do $V_1$ gây ra
>
> **Bước 2**: Tắt $V_1$ (ngắn mạch) → tính $I''$ do $V_2$ gây ra
>
> **Bước 3**: $I_{total} = I' + I''$ (chú ý dấu theo chiều quy ước)

> [!warning] Giới Hạn Superposition
> Superposition **chỉ áp dụng** cho mạch **tuyến tính**. Không dùng được với diode, transistor đang hoạt động phi tuyến, hay để tính công suất (vì $P = I^2 R$ không tuyến tính).

---

## Định Lý Thevenin

> [!definition] Definition 4.3 — Mạch Tương Đương Thevenin
> Bất kỳ mạch tuyến tính nào nhìn từ hai đầu ra A-B đều có thể thay thế bằng:
>
> - **Nguồn áp Thevenin** $V_{Th}$ = điện áp hở mạch tại A-B (khi không nối tải)
> - **Điện trở Thevenin** $R_{Th}$ = điện trở nhìn vào cổng A-B khi tắt tất cả nguồn độc lập
>
> ```
> Mạch phức tạp        Tương đương Thevenin
>  A ---[...]---         A ---[R_Th]---
>  |           |    →    |            |
> [Mạch]     [Tải]    [V_Th]        [Tải]
>  |           |         |            |
>  B ----------         B ------------
> ```

### Quy Trình Tìm Mạch Thevenin

1. **Tháo tải** ra khỏi hai đầu A-B
2. **Tính $V_{Th}$** = điện áp hở mạch $V_{AB}$ (dùng KVL, phân chia áp, v.v.)
3. **Tính $R_{Th}$**: tắt tất cả nguồn độc lập → tính điện trở từ A-B nhìn vào
4. **Lắp lại tải** vào mạch Thevenin → phân tích đơn giản

> [!example] Example 4.4 — Tìm Mạch Thevenin
> Cho mạch: nguồn $V_s = 12\,\text{V}$, $R_1 = 6\,\Omega$, $R_2 = 3\,\Omega$ (song song với đầu ra A-B).
>
> **Tính $V_{Th}$** (hở mạch A-B, không có dòng qua $R_2$... chờ, $R_2$ nối trực tiếp A-B):
>
> Dùng voltage divider: $V_{Th} = V_s \cdot \frac{R_2}{R_1 + R_2} = 12 \cdot \frac{3}{9} = 4\,\text{V}$
>
> **Tính $R_{Th}$**: Tắt $V_s$ (ngắn mạch):
>
> $R_{Th} = R_1 \| R_2 = \frac{6 \times 3}{6 + 3} = 2\,\Omega$
>
> **Mạch Thevenin**: nguồn $4\,\text{V}$ nối tiếp $2\,\Omega$.

---

## Định Lý Norton

> [!definition] Definition 4.5 — Mạch Tương Đương Norton
> Tương đương với Thevenin nhưng dùng **nguồn dòng**:
>
> - **Nguồn dòng Norton** $I_N$ = dòng ngắn mạch tại A-B
> - **Điện trở Norton** $R_N = R_{Th}$
>
> Quan hệ Thevenin — Norton:
>
> $$I_N = \frac{V_{Th}}{R_{Th}} \qquad V_{Th} = I_N \cdot R_N$$

Chuyển đổi tự do giữa hai dạng, dùng dạng nào tiện hơn cho bài toán cụ thể.

---

## Truyền Công Suất Cực Đại

> [!definition] Definition 4.6 — Maximum Power Transfer
> Với mạch nguồn Thevenin ($V_{Th}$, $R_{Th}$) nối tải $R_L$:
>
> $$P_L = I^2 R_L = \left(\frac{V_{Th}}{R_{Th} + R_L}\right)^2 R_L$$
>
> Công suất tải **cực đại** khi:
>
> $$R_L = R_{Th}$$
>
> $$P_{max} = \frac{V_{Th}^2}{4 R_{Th}}$$

> [!example] Example 4.7 — Chọn Tải Tối Ưu
> Nguồn Thevenin: $V_{Th} = 10\,\text{V}$, $R_{Th} = 50\,\Omega$.
>
> Chọn $R_L = 50\,\Omega$ để truyền công suất cực đại:
>
> $$P_{max} = \frac{10^2}{4 \times 50} = \frac{100}{200} = 0{,}5\,\text{W}$$
>
> **Lưu ý thực tế**: Khi $R_L = R_{Th}$, hiệu suất chỉ đạt 50% (nguồn tiêu thụ bằng tải). Trong hệ thống cần hiệu suất cao (pin, pin mặt trời), người ta chọn $R_L \gg R_{Th}$.

---

## Ứng Dụng — Điện Trở Trong Của Nguồn Thực

Mọi nguồn điện thực (pin, nguồn switching) đều có **điện trở trong (internal resistance)** $r_s$. Mô hình Thevenin:

```
   [V_emf] ---[r_s]--- A
                        |
                       [R_L] (tải)
                        |
   GND -----------------B
```

$$V_{terminal} = V_{emf} - I \cdot r_s = V_{emf} \cdot \frac{R_L}{R_L + r_s}$$

Khi $R_L \gg r_s$: điện áp đầu ra gần bằng $V_{emf}$ — nguồn tốt.
Khi $R_L \approx r_s$: điện áp tụt mạnh — nguồn bị quá tải.

---

## Summary / Key Takeaways

- **Superposition**: tổng đáp ứng = tổng đáp ứng từng nguồn riêng lẻ (tắt các nguồn khác)
- **Thevenin**: bất kỳ mạch tuyến tính nào = $V_{Th}$ nối tiếp $R_{Th}$
- **Norton**: bất kỳ mạch tuyến tính nào = $I_N$ song song $R_N = R_{Th}$
- Chuyển đổi: $V_{Th} = I_N \cdot R_{Th}$
- Truyền công suất cực đại khi $R_L = R_{Th}$
- Mọi nguồn thực đều có điện trở trong → điện áp tụt khi tải nặng

---

## References

- MIT OCW 6.002 — Lecture 5–6 (ocw.mit.edu)
- All About Circuits — https://www.allaboutcircuits.com/textbook/direct-current/chpt-10/
- Hayt & Kemmerly — *Engineering Circuit Analysis*, Ch. 5
