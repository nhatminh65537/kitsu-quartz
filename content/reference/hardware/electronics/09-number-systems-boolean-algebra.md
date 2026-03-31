---
title: "09. Number Systems & Boolean Algebra"
tags: [electronics, digital, lesson-09]
aliases: [Hệ Số Đếm Đại Số Boolean]
created: 2026-03-30
---

> **Prerequisites**: Không yêu cầu — xuất phát điểm độc lập của Module Digital
> **Objectives**:
> - Chuyển đổi giữa binary, decimal, hexadecimal, octal
> - Thực hiện phép tính nhị phân: cộng, trừ (bù 2)
> - Biểu diễn và đơn giản hóa hàm logic bằng đại số Boolean
> - Áp dụng định lý De Morgan để biến đổi cổng logic

---

## Motivation

Máy tính và mọi thiết bị số chỉ hiểu **hai trạng thái**: có điện (1) và không có điện (0). Từ hai bit đơn giản này, con người đã xây dựng nên toàn bộ thế giới số: CPU, bộ nhớ, mạng máy tính...

Nền tảng toán học của thế giới số là **đại số Boolean (Boolean algebra)** — một hệ thống toán học chỉ có hai giá trị {0, 1} và các phép toán AND, OR, NOT. Module Digital bắt đầu từ đây.

---

## Hệ Số Đếm (Number Systems)

### Binary (Cơ số 2)

> [!definition] Definition 9.1 — Hệ Nhị Phân (Binary)
> Chỉ dùng ký số {0, 1}. Mỗi vị trí có **trọng số** là lũy thừa của 2:
>
> $$1011_2 = 1 \times 2^3 + 0 \times 2^2 + 1 \times 2^1 + 1 \times 2^0 = 8 + 0 + 2 + 1 = 11_{10}$$

**Chuyển decimal → binary**: chia liên tiếp cho 2, lấy phần dư từ dưới lên.

$$13 \div 2 = 6 \text{ dư } 1$$
$$6 \div 2 = 3 \text{ dư } 0$$
$$3 \div 2 = 1 \text{ dư } 1$$
$$1 \div 2 = 0 \text{ dư } 1$$

→ $13_{10} = 1101_2$

### Hexadecimal (Cơ số 16)

| Decimal | Hex | Binary |
|---------|-----|--------|
| 0–9 | 0–9 | 0000–1001 |
| 10 | A | 1010 |
| 11 | B | 1011 |
| 12 | C | 1100 |
| 13 | D | 1101 |
| 14 | E | 1110 |
| 15 | F | 1111 |

**Hex ↔ Binary**: mỗi ký số hex = 4 bit chính xác.

$$\text{0x2F} = 0010\,1111_2 = 47_{10}$$

Dùng trong: địa chỉ bộ nhớ, màu RGB (#FF5500), register của MCU.

---

## Số Âm — Biểu Diễn Bù 2 (Two's Complement)

> [!definition] Definition 9.2 — Bù 2 (Two's Complement)
> Biểu diễn số nguyên có dấu trong n bit:
>
> - Số dương: biểu diễn bình thường, MSB = 0
> - Số âm: **đảo tất cả bit, cộng thêm 1**
>
> Ví dụ (8 bit):
>
> $+5 = 0000\,0101$
>
> $-5$: đảo → $1111\,1010$, cộng 1 → $1111\,1011$
>
> Phạm vi 8-bit signed: $-128$ đến $+127$

**Ưu điểm bù 2**: phép cộng và trừ dùng cùng một mạch cộng — CPU chỉ cần một ALU.

$$5 + (-5) = 0000\,0101 + 1111\,1011 = 1\,0000\,0000 → \text{overflow bit bỏ} = 0000\,0000 = 0 ✓$$

---

## Cổng Logic Cơ Bản

> [!definition] Definition 9.3 — Bảng Chân Trị Cổng Logic Cơ Bản
>
> | Gate | Ký hiệu | Biểu thức | Mô tả |
> |------|---------|-----------|-------|
> | AND | A · B | $Y = A \cdot B$ | 1 khi **tất cả** vào = 1 |
> | OR | A + B | $Y = A + B$ | 1 khi **ít nhất một** vào = 1 |
> | NOT | $\bar{A}$ | $Y = \bar{A}$ | Đảo bit |
> | NAND | $\overline{A \cdot B}$ | — | Ngược AND — **universal gate** |
> | NOR | $\overline{A + B}$ | — | Ngược OR — **universal gate** |
> | XOR | A ⊕ B | $Y = A\bar{B} + \bar{A}B$ | 1 khi hai vào **khác nhau** |
> | XNOR | $\overline{A \oplus B}$ | — | 1 khi hai vào **bằng nhau** |

NAND và NOR là **universal gate** — có thể tạo bất kỳ hàm logic nào chỉ từ một loại cổng.

---

## Đại Số Boolean

> [!definition] Definition 9.4 — Các Định Lý Cơ Bản
>
> **Định lý đồng nhất (Identity)**:
> - $A + 0 = A$; $A \cdot 1 = A$
>
> **Định lý bù (Complement)**:
> - $A + \bar{A} = 1$; $A \cdot \bar{A} = 0$
>
> **Định lý lũy đẳng (Idempotent)**:
> - $A + A = A$; $A \cdot A = A$
>
> **Định lý hấp thụ (Absorption)**:
> - $A + AB = A$; $A(A + B) = A$
>
> **Giao hoán, kết hợp, phân phối**: tương tự đại số thông thường

### Định Lý De Morgan

> [!definition] Definition 9.5 — Định Lý De Morgan
>
> $$\overline{A \cdot B} = \bar{A} + \bar{B}$$
>
> $$\overline{A + B} = \bar{A} \cdot \bar{B}$$
>
> **Ý nghĩa thực tế**: NAND = NOT-AND = OR với đầu vào bị đảo. Rất hữu dụng khi biến đổi mạch chỉ dùng NAND.

> [!example] Example 9.6 — Đơn Giản Hóa Hàm Logic
> Đơn giản hóa: $Y = AB + A\bar{B} + \bar{A}B$
>
> $$= A(B + \bar{B}) + \bar{A}B$$
>
> $$= A \cdot 1 + \bar{A}B$$
>
> $$= A + \bar{A}B$$
>
> $$= A + B \quad \text{(định lý hấp thụ mở rộng)}$$

---

## Bảng Chân Trị & Chuẩn Tắc

Mọi hàm logic có thể biểu diễn qua **bảng chân trị (truth table)**:

| A | B | C | Y |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

**Sum of Minterms (SOM)**: $Y = \sum m(1,2,4,7) = \bar{A}\bar{B}C + \bar{A}B\bar{C} + A\bar{B}\bar{C} + ABC$

Đây chính là XOR của 3 biến! → Sẽ tối giản bằng **Karnaugh map** ở Lesson 10.

---

## Ứng Dụng Trong MCU & Hardware

- **Register bitmask**: `GPIO_PORTA |= (1 << 3)` → bật bit 3 (OR mask)
- **Kiểm tra bit**: `if (status & 0x04)` → kiểm tra bit 2 (AND mask)
- **Toggle bit**: `PORTB ^= (1 << 5)` → XOR với 1 để đảo
- **Clear bit**: `PORTA &= ~(1 << 2)` → AND với bù của mask

---

## Summary / Key Takeaways

- Binary: cơ số 2; Hex: cơ số 16; mỗi ký số hex = 4 bit
- Bù 2: biểu diễn số âm = đảo bit + cộng 1; phép trừ = cộng với số âm
- 7 cổng logic cơ bản: AND, OR, NOT, NAND, NOR, XOR, XNOR
- NAND và NOR là universal gate
- Định lý De Morgan: $\overline{AB} = \bar{A}+\bar{B}$; $\overline{A+B} = \bar{A}\cdot\bar{B}$
- Bitwise operations trong C/C++ dùng thường xuyên trong lập trình MCU

---

## References

- Morris Mano — *Digital Design*, 5th ed., Ch. 1–2
- All About Circuits — https://www.allaboutcircuits.com/textbook/digital/
- Nandgame — https://nandgame.com (học xây CPU từ NAND, rất thú vị!)
