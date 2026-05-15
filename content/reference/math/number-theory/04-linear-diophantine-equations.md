---
title: "04. Phương Trình Diophantine Tuyến Tính"
type: theory
tags: [math, number-theory, lesson-04]
aliases: [Linear Diophantine Equations]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]], [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]]
> **Objectives**:
> - Xác định khi nào $ax + by = c$ có nghiệm nguyên
> - Tìm một nghiệm đặc biệt bằng Extended Euclidean Algorithm
> - Mô tả toàn bộ họ nghiệm
> - Giải hệ phương trình Diophantine tuyến tính
> - Nhận biết bài toán "đếm nghiệm trong khoảng" — ứng dụng thực tế

---

## Motivation / Intuition

**Phương trình Diophantine** (Diophantine equation) là phương trình cần nghiệm nguyên — đặt theo tên nhà toán học Hy Lạp Diophantus của Alexandria (khoảng thế kỷ III). Câu hỏi trung tâm không phải "giá trị nghiệm là bao nhiêu" mà là "**có tồn tại nghiệm không**" và "**có bao nhiêu nghiệm**".

Phương trình Diophantine tuyến tính hai ẩn $ax + by = c$ là trường hợp đơn giản nhất, nhưng lý thuyết giải nó hoàn chỉnh và thanh lịch: điều kiện tồn tại nghiệm chính xác là $\gcd(a, b) \mid c$, và một khi có một nghiệm, ta có **vô hạn nghiệm** tạo thành một lưới đều trên mặt phẳng nguyên.

---

## Phương Trình Hai Ẩn

### Điều kiện tồn tại nghiệm

> [!theorem] Theorem 4.1 — Điều kiện tồn tại nghiệm nguyên
> Cho $a, b, c \in \mathbb{Z}$ với $a, b$ không đồng thời bằng $0$. Đặt $d = \gcd(a, b)$. Phương trình:
>
> $$
> ax + by = c
> $$
>
> có nghiệm nguyên $(x, y) \in \mathbb{Z}^2$ **khi và chỉ khi** $d \mid c$.

**Proof.**

($\Rightarrow$) Nếu $(x_0, y_0)$ là nghiệm, thì $c = ax_0 + by_0$. Vì $d \mid a$ và $d \mid b$, theo Theorem 1.3(iii), $d \mid c$.

($\Leftarrow$) Giả sử $d \mid c$, viết $c = dc'$ với $c' \in \mathbb{Z}$. Theo Bézout's Identity (Theorem 2.1), tồn tại $m, n \in \mathbb{Z}$ với $ma + nb = d$. Khi đó:

$$
(mc')a + (nc')b = c' \cdot d = c
$$

Vậy $(x_0, y_0) = (mc', nc')$ là một nghiệm. $\blacksquare$

### Tìm một nghiệm đặc biệt

Từ chứng minh trên, quy trình tìm nghiệm đặc biệt là:

1. Tính $d = \gcd(a, b)$. Kiểm tra $d \mid c$.
2. Chạy XGCD để tìm $m, n$ với $ma + nb = d$.
3. Đặt $x_0 = m \cdot (c/d)$, $y_0 = n \cdot (c/d)$.

> [!example] Example 4.2 — Tìm nghiệm đặc biệt cho $6x + 10y = 14$
> $d = \gcd(6, 10) = 2$. Vì $2 \mid 14$: phương trình có nghiệm.
>
> XGCD: $6 = 0 \cdot 10 + 6$, $10 = 1 \cdot 6 + 4$, $6 = 1 \cdot 4 + 2$, $4 = 2 \cdot 2 + 0$.
> Truy ngược: $2 = 6 - 1 \cdot 4 = 6 - 1 \cdot (10 - 6) = 2 \cdot 6 - 10$.
> Vậy $m = 2$, $n = -1$: $2 \cdot 6 + (-1) \cdot 10 = 2$.
>
> Nghiệm đặc biệt: $c/d = 14/2 = 7$, nên $x_0 = 2 \cdot 7 = 14$, $y_0 = (-1) \cdot 7 = -7$.
>
> Kiểm tra: $6(14) + 10(-7) = 84 - 70 = 14$. ✓

### Toàn bộ họ nghiệm

> [!theorem] Theorem 4.3 — Họ nghiệm đầy đủ
> Giả sử $ax + by = c$ có một nghiệm đặc biệt $(x_0, y_0)$. Khi đó **toàn bộ nghiệm nguyên** của phương trình là:
>
> $$
> x = x_0 + \frac{b}{d} \cdot t, \qquad y = y_0 - \frac{a}{d} \cdot t, \qquad t \in \mathbb{Z}
> $$
>
> trong đó $d = \gcd(a, b)$.

**Proof.**

*Kiểm tra:* Với mọi $t \in \mathbb{Z}$:

$$
a\!\left(x_0 + \tfrac{b}{d}t\right) + b\!\left(y_0 - \tfrac{a}{d}t\right) = ax_0 + by_0 + \tfrac{ab}{d}t - \tfrac{ab}{d}t = c. \quad \checkmark
$$

*Đầy đủ:* Giả sử $(x, y)$ là bất kỳ nghiệm nào. Khi đó:

$$
a(x - x_0) = b(y_0 - y)
$$

Chia hai vế cho $d$: $\tfrac{a}{d}(x - x_0) = \tfrac{b}{d}(y_0 - y)$. Đặt $a' = a/d$, $b' = b/d$ (đây là số nguyên vì $d \mid a, d \mid b$), và $\gcd(a', b') = 1$.

Từ $a'(x - x_0) = b'(y_0 - y)$: $b' \mid a'(x - x_0)$. Vì $\gcd(a', b') = 1$, theo Bổ đề Euclid (Theorem 2.10), $b' \mid (x - x_0)$. Đặt $x - x_0 = b't$, thì $y_0 - y = a't$, suy ra $y = y_0 - a't$. $\blacksquare$

> [!note] Remark 4.4 — Hình học của họ nghiệm
> Họ nghiệm $\{(x_0 + \tfrac{b}{d}t,\; y_0 - \tfrac{a}{d}t) \mid t \in \mathbb{Z}\}$ là các điểm nguyên nằm trên đường thẳng $ax + by = c$ trong mặt phẳng, cách nhau đều theo vector $(\tfrac{b}{d}, -\tfrac{a}{d})$.

> [!example] Example 4.5 — Họ nghiệm đầy đủ cho $6x + 10y = 14$
> Nghiệm đặc biệt: $(x_0, y_0) = (14, -7)$, $d = 2$.
>
> Họ nghiệm:
>
> $$
> x = 14 + 5t, \qquad y = -7 - 3t, \qquad t \in \mathbb{Z}
> $$
>
> Một số nghiệm cụ thể: $(14, -7)$, $(19, -10)$, $(9, -4)$, $(4, -1)$, $(-1, 2)$, $(-6, 5)$, ...
>
> Kiểm tra $(-1, 2)$: $6(-1) + 10(2) = -6 + 20 = 14$. ✓

### Nghiệm không âm và bài toán đếm

> [!example] Example 4.6 — Tìm nghiệm không âm
> Bài toán: bạn có tiền xu $3$ đồng và $5$ đồng. Cần trả đúng $c = 41$ đồng. Có thể làm được không?
>
> Phương trình: $3x + 5y = 41$. $\gcd(3, 5) = 1 \mid 41$: có nghiệm.
>
> XGCD: $1 = 2 \cdot 3 - 1 \cdot 5$. Nghiệm đặc biệt: $x_0 = 2 \cdot 41 = 82$, $y_0 = -41$.
>
> Họ nghiệm: $x = 82 + 5t$, $y = -41 - 3t$, $t \in \mathbb{Z}$.
>
> Điều kiện $x \geq 0$ và $y \geq 0$:
> - $x \geq 0 \Rightarrow t \geq -82/5 = -16.4 \Rightarrow t \geq -16$.
> - $y \geq 0 \Rightarrow -41 - 3t \geq 0 \Rightarrow t \leq -41/3 = -13.67 \Rightarrow t \leq -14$.
>
> Vậy $t \in \{-16, -15, -14\}$, cho 3 cách trả: $(2, 7)$, $(7, 4)$, $(12, 1)$.
>
> Kiểm tra: $3(2) + 5(7) = 6 + 35 = 41$. ✓

---

## Bài Toán Đồng Dư Sơ Khởi

Một phương trình Diophantine $ax + by = c$ liên hệ chặt chẽ với đồng dư. Cụ thể, tìm $x \in \mathbb{Z}$ sao cho $ax \equiv c \pmod{b}$ tương đương với tìm nghiệm nguyên của $ax - c = (-y)b$, tức là $ax + by = c$. Ta sẽ phân tích sâu hơn trong bài 06.

> [!theorem] Theorem 4.7 — Liên hệ với đồng dư
> Phương trình $ax + by = c$ có nghiệm nguyên $\Leftrightarrow$ đồng dư $ax \equiv c \pmod{b}$ có nghiệm nguyên. Nếu $(x_0, y_0)$ là nghiệm, thì mọi $x \equiv x_0 \pmod{b/d}$ đều cho nghiệm.

---

## Hệ Phương Trình Diophantine Tuyến Tính

Ta có thể mở rộng sang hệ nhiều phương trình, nhưng ở đây xét trường hợp đơn giản nhất.

### Phương trình ba ẩn

> [!theorem] Theorem 4.8 — Ba ẩn: $ax + by + cz = n$
> Điều kiện cần và đủ để $ax + by + cz = n$ có nghiệm nguyên là $\gcd(a, b, c) \mid n$.

**Proof.**
Đặt $d_1 = \gcd(a, b)$ và $d = \gcd(d_1, c) = \gcd(a, b, c)$.

Nếu $d \mid n$: giải $d_1 u + cz = n$ (theo Theorem 4.1, được vì $\gcd(d_1, c) = d \mid n$) để được $(u_0, z_0)$. Rồi giải $ax + by = d_1 u_0$ (được vì $\gcd(a, b) = d_1 \mid d_1 u_0$). $\blacksquare$

### Ví dụ điển hình: Bài toán chia đồng

> [!example] Example 4.9 — Bài toán chia đồng (số học cổ điển)
> *Một người có một số tiền xu. Nếu chia thành nhóm $3$ thì thừa $2$; chia thành nhóm $5$ thì thừa $3$; chia thành nhóm $7$ thì thừa $2$. Số tiền xu tối thiểu là bao nhiêu?*
>
> Ta cần giải hệ:
>
> $$
> x \equiv 2 \pmod{3}, \quad x \equiv 3 \pmod{5}, \quad x \equiv 2 \pmod{7}
> $$
>
> Đây là bài toán **Định Lý Thặng Dư Trung Hoa** — sẽ giải đầy đủ trong bài 07. Kết quả: $x = 23$ (tối thiểu dương thỏa ba điều kiện).

---

## Một Số Phương Trình Diophantine Phi Tuyến Nổi Tiếng

Để có cái nhìn toàn cảnh (không yêu cầu giải), ta liệt kê một số bài toán Diophantine phi tuyến quan trọng mà lý thuyết số hiện đại phải đối mặt:

| Phương trình | Tên | Trạng thái |
|---|---|---|
| $x^n + y^n = z^n$, $n \geq 3$ | Fermat's Last Theorem | Chứng minh 1995 (Wiles) |
| $x^2 - Dy^2 = 1$ | Pell's equation | Giải hoàn toàn bằng phân số liên tục |
| $x^2 + y^2 = n$ | Bài toán hai bình phương | Giải khi và chỉ khi $p \equiv 1 \pmod{4}$ với $p \mid n$ |
| $x^3 + y^3 + z^3 = k$ | Bài toán ba lập phương | Còn nhiều trường hợp mở |

Module 0 chỉ xử lý trường hợp tuyến tính; các trường hợp phi tuyến đòi hỏi công cụ sâu hơn (xem Module 3 cho bài toán hai bình phương).

---

## SageMath Cheatsheet

```python
# Kiểm tra và tìm nghiệm Diophantine ax + by = c
def solve_diophantine(a, b, c):
    d = gcd(a, b)
    if c % d != 0:
        return None  # Không có nghiệm
    g, m, n = xgcd(a, b)   # m*a + n*b = d
    scale = c // d
    x0, y0 = m * scale, n * scale
    # Bước di chuyển: (b/d, -a/d)
    step_x = b // d
    step_y = -(a // d)
    return (x0, y0, step_x, step_y)

result = solve_diophantine(6, 10, 14)
if result:
    x0, y0, sx, sy = result
    print(f"Nghiệm đặc biệt: ({x0}, {y0})")
    print(f"Họ nghiệm: x = {x0} + {sx}t, y = {y0} + {sy}t")
    # Kiểm tra
    for t in range(-3, 4):
        x, y = x0 + sx*t, y0 + sy*t
        assert 6*x + 10*y == 14

# Tìm nghiệm không âm trong khoảng
def nonneg_solutions(a, b, c):
    res = solve_diophantine(a, b, c)
    if not res:
        return []
    x0, y0, sx, sy = res
    # Tìm t sao cho x >= 0 và y >= 0
    solutions = []
    # t trong [-50, 50] đủ với bài toán nhỏ
    for t in range(-200, 201):
        x, y = x0 + sx*t, y0 + sy*t
        if x >= 0 and y >= 0:
            solutions.append((x, y))
    return solutions

print(nonneg_solutions(3, 5, 41))  # [(2,7), (7,4), (12,1)]

# Hệ thống Diophantine nhiều ẩn (SageMath matrix approach)
# Ax = b với nghiệm nguyên
A = matrix(ZZ, [[3, 5], [1, 1]])
b = vector(ZZ, [13, 3])
# Kiểm tra tồn tại nghiệm
print(A.solve_right(b))          # Nếu tồn tại nghiệm hữu tỉ
```

---

## Summary / Key Takeaways

- **Điều kiện tồn tại**: $ax + by = c$ có nghiệm nguyên $\Leftrightarrow$ $\gcd(a, b) \mid c$.
- **Tìm nghiệm đặc biệt**: dùng XGCD để tìm $ma + nb = \gcd(a, b)$, rồi nhân với $c/\gcd(a,b)$.
- **Họ nghiệm đầy đủ**: $x = x_0 + \tfrac{b}{d}t$, $y = y_0 - \tfrac{a}{d}t$ với $t \in \mathbb{Z}$ — vô hạn nghiệm, cách đều $\tfrac{b}{d}$ theo $x$.
- **Nghiệm không âm**: xác định bằng cách giải bất đẳng thức tuyến tính theo $t$.
- **Hệ ba ẩn**: điều kiện $\gcd(a, b, c) \mid n$ — giải đệ quy bằng hai biến.
- Phương trình Diophantine tuyến tính là nền tảng cho lý thuyết đồng dư và Định Lý Thặng Dư Trung Hoa (bài 07).

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §1.2.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §2.9.
- Silverman, J. H. *A Friendly Introduction to Number Theory* (4th ed.), Ch. 5–6.
