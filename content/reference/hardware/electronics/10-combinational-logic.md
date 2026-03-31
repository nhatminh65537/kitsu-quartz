---
title: "10. Combinational Logic"
tags: [electronics, digital, lesson-10]
aliases: [Mạch Tổ Hợp Combinational Logic]
created: 2026-03-30
---

> **Prerequisites**: [[09-number-systems-boolean-algebra|09. Number Systems & Boolean Algebra]]
> **Objectives**:
> - Tối giản hàm logic bằng Karnaugh map (K-map) 2, 3, 4 biến
> - Phân tích và thiết kế mạch half adder và full adder
> - Hiểu MUX, DEMUX, decoder, encoder và ứng dụng
> - Thực hành thiết kế mạch tổ hợp từ đặc tả đến sơ đồ cổng

---

## Motivation

Lesson 9 cho bạn các khối cơ bản — cổng logic và đại số Boolean. Bây giờ ta **kết hợp** các cổng đó thành các **mạch tổ hợp (combinational logic circuits)** thực hiện các chức năng cụ thể.

Điểm đặc trưng của mạch tổ hợp: **đầu ra chỉ phụ thuộc đầu vào hiện tại** — không có bộ nhớ, không có trạng thái. Ngược lại, mạch tuần tự (Lesson 11) có bộ nhớ qua flip-flop.

---

## Tối Giản Hàm Logic — Karnaugh Map (K-map)

K-map là phương pháp đồ họa để tối giản hàm logic, tránh sai sót khi dùng đại số thuần túy.

> [!definition] Definition 10.1 — K-map Bậc 2 và 3
>
> **K-map 2 biến** (A, B):
>
> ```
>       B=0  B=1
>  A=0 |  0 |  1 |
>  A=1 |  2 |  3 |
> ```
>
> **K-map 3 biến** (A, B, C) — lưu ý thứ tự Gray code (00→01→11→10):
>
> ```
>       BC=00  BC=01  BC=11  BC=10
>  A=0 |  0  |  1  |  3  |  2  |
>  A=1 |  4  |  5  |  7  |  6  |
> ```

**Quy tắc nhóm (grouping)**:
- Nhóm các ô có giá trị **1** thành nhóm kích thước $2^k$ (1, 2, 4, 8...)
- Nhóm **lớn nhất** có thể → biểu thức đơn giản nhất
- Các ô ở biên **có thể bọc sang phía đối diện** (wrap-around)
- Mỗi ô 1 phải được nhóm ít nhất một lần

> [!example] Example 10.2 — Tối Giản Bằng K-map
> Hàm $Y = \sum m(0,1,2,4,5)$ với 3 biến A, B, C:
>
> ```
>       BC=00  BC=01  BC=11  BC=10
>  A=0 |  1  |  1  |  0  |  1  |
>  A=1 |  1  |  1  |  0  |  0  |
> ```
>
> Nhóm 1: 4 ô {m0,m1,m4,m5} → $\bar{C}$ không, thực ra đây {A=0,1; BC=00,01} → $\bar{B}$... 
>
> Nhóm cụ thể: {m0,m1,m4,m5} = BC=00,01 × A=0,1 → A biến thiên, C biến thiên với B=0 → $\bar{B}$
>
> Nhóm 2: {m0,m2} = A=0, BC=00,10 → B biến thiên, C=0, A=0 → $\bar{A}\bar{C}$
>
> $Y = \bar{B} + \bar{A}\bar{C}$

---

## Mạch Cộng (Adder)

### Half Adder

Cộng 2 bit đơn, không có nhớ vào:

| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

$$Sum = A \oplus B \qquad Carry = A \cdot B$$

Cần: 1 XOR + 1 AND.

### Full Adder

Cộng 2 bit + 1 bit nhớ vào ($C_{in}$):

$$Sum = A \oplus B \oplus C_{in}$$

$$C_{out} = AB + C_{in}(A \oplus B)$$

Cần: 2 XOR + 2 AND + 1 OR. **Ghép nối tiếp** $n$ Full Adder → cộng số $n$ bit (Ripple Carry Adder).

---

## Multiplexer (MUX)

> [!definition] Definition 10.3 — MUX (Bộ Chọn)
> MUX $2^n$-vào-1 dùng $n$ bit chọn (Select) để đưa **một trong** $2^n$ đầu vào ra đầu ra.
>
> MUX 4-1 (2 bit chọn S1, S0):
>
> | S1 | S0 | Y |
> |----|-----|---|
> | 0 | 0 | D0 |
> | 0 | 1 | D1 |
> | 1 | 0 | D2 |
> | 1 | 1 | D3 |
>
> $$Y = \bar{S_1}\bar{S_0}D_0 + \bar{S_1}S_0 D_1 + S_1\bar{S_0}D_2 + S_1 S_0 D_3$$

**Ứng dụng MUX**:
- Chọn nguồn tín hiệu (ví dụ: chọn một trong nhiều sensor)
- Hiện thực hàm logic tùy ý (MUX như lookup table)
- Truyền nhiều kênh qua một đường dây (time-division multiplexing)

---

## Decoder

> [!definition] Definition 10.4 — Decoder (Bộ Giải Mã)
> Decoder $n$-vào — $2^n$-ra: kích hoạt **đúng một** đầu ra tương ứng với mã nhị phân đầu vào.
>
> Decoder 2-4 (A1, A0):
>
> | A1 | A0 | Y0 | Y1 | Y2 | Y3 |
> |----|-----|-----|-----|-----|-----|
> | 0 | 0 | 1 | 0 | 0 | 0 |
> | 0 | 1 | 0 | 1 | 0 | 0 |
> | 1 | 0 | 0 | 0 | 1 | 0 |
> | 1 | 1 | 0 | 0 | 0 | 1 |

**Ứng dụng decoder**: giải mã địa chỉ bộ nhớ (memory address decoding), điều khiển 7-segment display, chọn chip (chip select trong SPI).

---

## Encoder & Priority Encoder

**Encoder**: ngược Decoder — $2^n$ đầu vào → $n$ bit mã.

**Priority Encoder**: khi nhiều đầu vào cùng active, ưu tiên đầu vào có chỉ số **cao nhất**.

| I3 | I2 | I1 | I0 | Y1 | Y0 | Valid |
|----|-----|-----|-----|-----|-----|-------|
| 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | X | 0 | 1 | 1 |
| 0 | 1 | X | X | 1 | 0 | 1 |
| 1 | X | X | X | 1 | 1 | 1 |

Ứng dụng: xử lý nhiều yêu cầu ngắt (interrupt priority encoder).

---

## Quy Trình Thiết Kế Mạch Tổ Hợp

> [!definition] Definition 10.5 — Quy Trình Thiết Kế Chuẩn
>
> 1. **Đặc tả**: mô tả chức năng bằng lời
> 2. **Bảng chân trị**: liệt kê tất cả tổ hợp đầu vào và đầu ra tương ứng
> 3. **Biểu thức Boolean**: viết SOM từ bảng chân trị
> 4. **Tối giản**: dùng K-map hoặc đại số Boolean
> 5. **Vẽ sơ đồ mạch**: biểu thức tối giản → sơ đồ cổng
> 6. **Kiểm tra**: mô phỏng hoặc xây dựng thực tế

> [!example] Example 10.6 — Thiết Kế Mạch Phát Hiện Số Chia Hết Cho 3
> Đầu vào: số 4 bit (0–15). Đầu ra Y=1 khi số chia hết cho 3 (0, 3, 6, 9, 12, 15).
>
> Minterm: $Y = \sum m(0,3,6,9,12,15)$
>
> K-map 4 biến → tối giản → biểu thức cuối cùng rồi vẽ mạch cổng.

---

## Summary / Key Takeaways

- **K-map**: công cụ đồ họa tối giản hàm Boolean — nhóm ô 1 thành khối $2^k$
- **Half adder**: Sum = A⊕B, Carry = AB — dùng XOR + AND
- **Full adder**: cộng với carry in; ghép thành Ripple Carry Adder $n$ bit
- **MUX**: $2^n$-vào-1, dùng $n$ bit select để chọn đầu ra
- **Decoder**: $n$-vào, $2^n$-ra, kích hoạt đúng một đầu ra
- Quy trình thiết kế: đặc tả → bảng chân trị → biểu thức → K-map → sơ đồ

---

## References

- Morris Mano — *Digital Design*, 5th ed., Ch. 2–3
- All About Circuits — https://www.allaboutcircuits.com/textbook/digital/chpt-9/
- Logic.ly — https://logic.ly (mô phỏng mạch logic trực quan, web)
