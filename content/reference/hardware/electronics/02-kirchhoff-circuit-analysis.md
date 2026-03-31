---
title: "02. Kirchhoff's Laws & Circuit Analysis"
tags: [electronics, circuit-fundamentals, lesson-02]
aliases: [Định Luật Kirchhoff Phân Tích Mạch]
created: 2026-03-30
---

> **Prerequisites**: [[01-voltage-current-ohm|01. Voltage, Current & Ohm's Law]] — Định luật Ohm, mạch nối tiếp/song song
> **Objectives**:
> - Phát biểu và áp dụng KCL (Kirchhoff's Current Law) tại nút
> - Phát biểu và áp dụng KVL (Kirchhoff's Voltage Law) quanh vòng
> - Viết hệ phương trình và giải mạch có nhiều nhánh
> - Phân tích mạch cầu Wheatstone

---

## Motivation

Định luật Ohm rất mạnh nhưng chỉ đủ để phân tích **mạch đơn giản** với một nguồn và một vài điện trở. Khi mạch có **nhiều nhánh**, nhiều nguồn điện, hoặc cấu trúc phức tạp hơn — bạn cần công cụ mạnh hơn.

**Định luật Kirchhoff (Kirchhoff's Laws)**, đặt tên theo nhà vật lý người Đức Gustav Kirchhoff (1845), là hai quy tắc phổ quát áp dụng cho **mọi mạch điện**. Chúng là hệ quả trực tiếp của hai định luật bảo toàn: bảo toàn điện tích và bảo toàn năng lượng.

---

## Các Định Nghĩa Quan Trọng

Trước khi vào định luật, cần thống nhất thuật ngữ:

> [!definition] Definition 2.1 — Các Phần Tử Cơ Bản Của Mạch
>
> - **Nhánh (branch)**: Một đoạn mạch nối giữa hai nút, chứa một hoặc nhiều linh kiện nối tiếp
> - **Nút (node)**: Điểm giao nhau của hai hoặc nhiều nhánh
> - **Nút chính (essential node)**: Nút có **ít nhất 3** nhánh gặp nhau
> - **Vòng (loop)**: Đường đi khép kín qua các nhánh, không đi qua nút nào hai lần
> - **Mắt lưới (mesh)**: Vòng khép kín không chứa vòng nào nhỏ hơn bên trong (vòng cơ bản)

```
Ví dụ mạch có 3 nút, 3 nhánh:

    A ---[R1]--- B
    |           |
   [V1]        [R2]
    |           |
    C ---[R3]--- C
         (GND)
```

---

## KCL — Định Luật Dòng Điện Kirchhoff

> [!definition] Definition 2.2 — KCL (Kirchhoff's Current Law)
> **Tổng đại số các dòng điện tại mỗi nút bằng 0.**
>
> $$\sum_{k} I_k = 0 \quad \text{(tại mỗi nút)}$$
>
> **Quy ước dấu**: Dòng **vào nút** là dương (+), dòng **ra nút** là âm (−).
> (Hoặc ngược lại — miễn là nhất quán.)
>
> **Nguồn gốc**: Bảo toàn điện tích — điện tích không thể tích lũy tại một nút.

**Trực giác**: Giống như ngã tư đường — tổng số xe vào bằng tổng số xe ra.

> [!example] Example 2.3 — Áp Dụng KCL
>
> Tại nút A, có 4 nhánh:
>
> - $I_1 = 3\,\text{A}$ đi **vào**
> - $I_2 = 1\,\text{A}$ đi **vào**
> - $I_3 = ?$ đi **ra**
> - $I_4 = 0{,}5\,\text{A}$ đi **ra**
>
> Áp dụng KCL:
>
> $$I_1 + I_2 - I_3 - I_4 = 0$$
>
> $$3 + 1 - I_3 - 0{,}5 = 0 \implies I_3 = 3{,}5\,\text{A}$$

---

## KVL — Định Luật Điện Áp Kirchhoff

> [!definition] Definition 2.4 — KVL (Kirchhoff's Voltage Law)
> **Tổng đại số các điện áp quanh bất kỳ vòng kín nào bằng 0.**
>
> $$\sum_{k} V_k = 0 \quad \text{(quanh mỗi vòng kín)}$$
>
> **Quy ước dấu**: Đi theo chiều vòng:
> - Qua điện trở **cùng chiều dòng điện**: $-IR$ (điện áp giảm)
> - Qua nguồn từ (−) đến (+): $+V_s$ (điện áp tăng)
> - Qua nguồn từ (+) đến (−): $-V_s$ (điện áp giảm)
>
> **Nguồn gốc**: Bảo toàn năng lượng — khi đi một vòng kín, tổng năng lượng tích lũy/tiêu thụ bằng 0.

**Trực giác**: Giống như leo núi rồi xuống núi — khi trở về vị trí ban đầu, độ cao thay đổi ròng bằng 0.

> [!example] Example 2.5 — Áp Dụng KVL (Mạch Nối Tiếp)
>
> Mạch: nguồn $V_s = 12\,\text{V}$, hai điện trở $R_1 = 4\,\Omega$ và $R_2 = 8\,\Omega$ nối tiếp.
>
> ```
>     + [Vs=12V] - ---[R1=4Ω]---[R2=8Ω]--- (trở về nguồn)
> ```
>
> Đặt dòng $I$ chạy theo chiều kim đồng hồ. KVL quanh vòng:
>
> $$+V_s - I \cdot R_1 - I \cdot R_2 = 0$$
>
> $$12 - 4I - 8I = 0 \implies I = 1\,\text{A}$$
>
> Điện áp trên từng điện trở:
> - $V_{R1} = 1 \times 4 = 4\,\text{V}$
> - $V_{R2} = 1 \times 8 = 8\,\text{V}$
> - Kiểm tra: $4 + 8 = 12\,\text{V}$ ✓

---

## Phân Tích Mạch Nhiều Nhánh — Phương Pháp Nút

Với mạch phức tạp, **phương pháp phân tích nút (node voltage method)** là cách hệ thống nhất:

**Quy trình**:
1. Chọn một nút làm **reference (GND)** = 0V
2. Đặt ẩn $V_1, V_2, \ldots$ cho các nút còn lại
3. Viết phương trình KCL tại mỗi nút — biểu diễn dòng qua điện trở bằng định luật Ohm: $I = \frac{V_{nút} - V_{nút\_kế}}{R}$
4. Giải hệ phương trình

> [!example] Example 2.6 — Phân Tích Mạch Hai Nguồn
>
> Cho mạch:
>
> ```
>       R1=6Ω      R2=3Ω
>  A ---/\/\/---B---/\/\/--- C
>  |            |            |
> [V1=12V]    [R3=6Ω]      [V2=6V]
>  |            |            |
> GND          GND          GND
> ```
>
> Nút A: $V_A = 12\,\text{V}$ (nối trực tiếp với nguồn $V_1$)
> Nút C: $V_C = 6\,\text{V}$ (nối trực tiếp với nguồn $V_2$)
> Nút B: ẩn $V_B$
>
> KCL tại nút B (dòng ra):
>
> $$\frac{V_B - V_A}{R_1} + \frac{V_B - 0}{R_3} + \frac{V_B - V_C}{R_2} = 0$$
>
> $$\frac{V_B - 12}{6} + \frac{V_B}{6} + \frac{V_B - 6}{3} = 0$$
>
> Nhân cả hai vế với 6:
>
> $$(V_B - 12) + V_B + 2(V_B - 6) = 0$$
>
> $$4V_B - 24 = 0 \implies V_B = 6\,\text{V}$$
>
> Các dòng điện:
> - $I_1 = \frac{12 - 6}{6} = 1\,\text{A}$ (qua $R_1$)
> - $I_3 = \frac{6}{6} = 1\,\text{A}$ (qua $R_3$)
> - $I_2 = \frac{6 - 6}{3} = 0\,\text{A}$ (qua $R_2$ — thú vị!)

---

## Ứng Dụng — Mạch Cầu Wheatstone

Mạch cầu Wheatstone (Wheatstone bridge) là ứng dụng kinh điển của KCL/KVL, thường dùng để đo điện trở chính xác hoặc đọc cảm biến.

```
           A
          / \
        R1   R2
        /     \
       B       C
        \     /
        R3   R4
          \ /
           D (GND)
         [Vs]
```

Đo điện áp $V_{BC}$ (giữa điểm B và C):

> [!definition] Definition 2.7 — Điều Kiện Cân Bằng Cầu Wheatstone
> Cầu **cân bằng** (balanced) khi $V_{BC} = 0$, xảy ra khi:
>
> $$\frac{R_1}{R_3} = \frac{R_2}{R_4} \quad \Leftrightarrow \quad R_1 \cdot R_4 = R_2 \cdot R_3$$
>
> Nếu biết $R_1, R_2, R_3$, có thể tính $R_4$ chưa biết khi điều chỉnh đến cân bằng.

**Ứng dụng với cảm biến**: Thay $R_4$ bằng cảm biến (thermistor, strain gauge...). Khi $R_4$ thay đổi theo nhiệt độ/lực → cầu mất cân bằng → $V_{BC} \neq 0$ → đọc được giá trị cảm biến.

---

## Bài Tập Tự Luyện

> [!example] Bài 1
> Mạch gồm $V_s = 9\,\text{V}$, $R_1 = 1\,\text{k}\Omega$, $R_2 = 2\,\text{k}\Omega$, $R_3 = 3\,\text{k}\Omega$ — trong đó $R_1$ nối tiếp với bộ song song ($R_2 \| R_3$).
>
> a) Tính điện trở tương đương toàn mạch.
> b) Tính dòng qua $R_1$.
> c) Tính điện áp trên $R_2$.

> [!example] Bài 2
> Cho mạch cầu Wheatstone với $R_1 = 100\,\Omega$, $R_2 = 200\,\Omega$, $R_3 = 150\,\Omega$, $V_s = 10\,\text{V}$.
>
> Tính $R_4$ để cầu cân bằng.

---

## Summary / Key Takeaways

- **KCL**: Tổng dòng điện tại mỗi nút = 0 (bảo toàn điện tích)
- **KVL**: Tổng điện áp quanh mỗi vòng = 0 (bảo toàn năng lượng)
- **Phương pháp nút**: Đặt ẩn điện áp tại các nút, viết KCL, giải hệ phương trình
- **Mạch cầu Wheatstone**: Cân bằng khi $R_1 R_4 = R_2 R_3$ — dùng đo điện trở và cảm biến
- KCL + KVL + Ohm = **bộ ba công cụ** phân tích được mọi mạch điện tuyến tính

---

## References

- MIT OCW 6.002 — Circuits and Electronics, Lecture 2–4 (ocw.mit.edu)
- All About Circuits — https://www.allaboutcircuits.com/textbook/direct-current/chpt-6/
- Falstad Circuit Simulator — https://falstad.com/circuit (thực hành mạch Wheatstone)
- Hayt & Kemmerly — *Engineering Circuit Analysis*, 8th ed., Ch. 3–4
