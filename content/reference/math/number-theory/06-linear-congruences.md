---
title: "06. Đồng Dư Tuyến Tính"
type: theory
tags: [math, number-theory, lesson-06]
aliases: [Linear Congruences]
created: 2026-05-15
---

> **Prerequisites**: [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]], [[05-congruences|05. Quan Hệ Đồng Dư]]
> **Objectives**:
> - Xác định điều kiện tồn tại và số nghiệm của $ax \equiv b \pmod{n}$
> - Tìm toàn bộ nghiệm bằng Extended Euclidean Algorithm
> - Tính nghịch đảo modulo và ứng dụng
> - Giải đồng dư tuyến tính tổng quát và các ví dụ phức tạp
> - Hiểu quan hệ mật thiết với phương trình Diophantine

---

## Motivation / Intuition

Phương trình tuyến tính $ax = b$ trên $\mathbb{R}$ có nghiệm duy nhất $x = b/a$ (khi $a \neq 0$). Câu hỏi tương tự trong $\mathbb{Z}/n\mathbb{Z}$: khi nào $ax \equiv b \pmod{n}$ có nghiệm, và nghiệm là gì?

Câu trả lời đẹp hơn nhiều so với tưởng tượng: điều kiện tồn tại hoàn toàn xác định bởi $\gcd(a, n)$, và khi nghiệm tồn tại, ta có đúng $d = \gcd(a, n)$ nghiệm phân biệt theo modulo $n$. Đây là nền tảng để giải Định Lý Thặng Dư Trung Hoa trong bài 07.

---

## Liên Hệ với Phương Trình Diophantine

Nhận xét then chốt: $ax \equiv b \pmod{n}$ tương đương với $ax - b = kn$ với $k \in \mathbb{Z}$, tức là:

$$
ax + n(-k) = b
$$

Đây chính xác là phương trình Diophantine tuyến tính $ax + ny = b$. Vì vậy mọi lý thuyết từ bài 04 đều áp dụng được ở đây, với $y = -k$ là biến phụ.

---

## Điều Kiện Tồn Tại và Số Nghiệm

> [!theorem] Theorem 6.1 — Điều Kiện Tồn Tại và Số Nghiệm
> Cho $n \geq 2$, $a, b \in \mathbb{Z}$, $d = \gcd(a, n)$. Phương trình đồng dư tuyến tính:
>
> $$
> ax \equiv b \pmod{n}
> $$
>
> **(i)** Có nghiệm $\Leftrightarrow$ $d \mid b$.
>
> **(ii)** Khi $d \mid b$: có đúng $d$ nghiệm phân biệt theo modulo $n$. Các nghiệm tạo thành $d$ lớp đồng dư modulo $n$, cách nhau $n/d$.

**Proof.**

**(i)** Như phân tích ở trên, $ax \equiv b \pmod{n}$ có nghiệm $\Leftrightarrow$ $ax + ny = b$ có nghiệm nguyên $\Leftrightarrow$ $\gcd(a, n) \mid b$ (Theorem 4.1).

**(ii)** Khi $d \mid b$: chia cả hai vế của $ax \equiv b \pmod{n}$ cho $d$:

$$
\frac{a}{d} x \equiv \frac{b}{d} \pmod{\frac{n}{d}}
$$

Đặt $a' = a/d$, $b' = b/d$, $n' = n/d$. Vì $\gcd(a', n') = 1$ (do $d = \gcd(a, n)$), phương trình $a'x \equiv b' \pmod{n'}$ có nghiệm duy nhất $x_0$ theo modulo $n'$.

Quay lại modulo $n$: các nghiệm là $x_0, x_0 + n', x_0 + 2n', \ldots, x_0 + (d-1)n'$ — đúng $d$ nghiệm phân biệt theo modulo $n$. $\blacksquare$

> [!example] Example 6.2 — Ba trường hợp tổng quát
>
> **(a)** $5x \equiv 3 \pmod{7}$: $d = \gcd(5,7) = 1 \mid 3$. Có đúng $1$ nghiệm mod $7$.
>
> **(b)** $6x \equiv 4 \pmod{10}$: $d = \gcd(6,10) = 2$, $2 \mid 4$. Có đúng $2$ nghiệm mod $10$.
>
> **(c)** $6x \equiv 5 \pmod{10}$: $d = \gcd(6,10) = 2$, $2 \nmid 5$. **Không có nghiệm**.

---

## Phương Pháp Giải

### Trường hợp $\gcd(a, n) = 1$: nghịch đảo modulo

Khi $\gcd(a, n) = 1$, phần tử $[a]$ khả nghịch trong $\mathbb{Z}/n\mathbb{Z}$. Nghiệm là:

$$
x \equiv a^{-1} b \pmod{n}
$$

Tính $a^{-1}$ bằng Extended Euclidean Algorithm: tìm $s, t$ với $as + nt = 1$, thì $a^{-1} \equiv s \pmod{n}$.

> [!example] Example 6.3 — Giải $5x \equiv 3 \pmod{7}$
>
> XGCD: $\gcd(5, 7) = 1$. Tìm $5s + 7t = 1$:
> $7 = 1 \cdot 5 + 2$, $5 = 2 \cdot 2 + 1 \Rightarrow 1 = 5 - 2 \cdot 2 = 5 - 2(7 - 5) = 3 \cdot 5 - 2 \cdot 7$.
>
> Vậy $s = 3$, nghĩa là $5^{-1} \equiv 3 \pmod{7}$.
>
> Nghiệm: $x \equiv 3 \cdot 3 = 9 \equiv 2 \pmod{7}$.
>
> Kiểm tra: $5 \cdot 2 = 10 \equiv 3 \pmod{7}$. ✓

> [!example] Example 6.4 — Giải $31x \equiv 1 \pmod{73}$
>
> Chạy XGCD trên $(31, 73)$:
>
> | Bước | $r$ | $q$ | $s$ | $t$ |
> |------|-----|-----|-----|-----|
> | | $73$ | | $0$ | $1$ |
> | | $31$ | | $1$ | $0$ |
> | $73 = 2 \cdot 31 + 11$ | $11$ | $2$ | $0 - 2 \cdot 1 = -2$ | $1 - 2 \cdot 0 = 1$ |
> | $31 = 2 \cdot 11 + 9$ | $9$ | $2$ | $1 - 2(-2) = 5$ | $0 - 2 \cdot 1 = -2$ |
> | $11 = 1 \cdot 9 + 2$ | $2$ | $1$ | $-2 - 5 = -7$ | $1 - (-2) = 3$ |
> | $9 = 4 \cdot 2 + 1$ | $1$ | $4$ | $5 - 4(-7) = 33$ | $-2 - 4 \cdot 3 = -14$ |
>
> Suy ra $33 \cdot 31 + (-14) \cdot 73 = 1$, tức $31^{-1} \equiv 33 \pmod{73}$.
>
> Kiểm tra: $31 \cdot 33 = 1023 = 14 \cdot 73 + 1 \equiv 1 \pmod{73}$. ✓

### Trường hợp $\gcd(a, n) = d > 1$: rút gọn

Khi $d \mid b$, chia cả hai vế và modulus cho $d$:

$$
ax \equiv b \pmod{n} \quad\Longrightarrow\quad \frac{a}{d} x \equiv \frac{b}{d} \pmod{\frac{n}{d}}
$$

Phương trình mới có $\gcd(a/d, n/d) = 1$, giải bằng phương pháp nghịch đảo, tìm $x_0$. Rồi $d$ nghiệm mod $n$ là:

$$
x \equiv x_0 + k \cdot \frac{n}{d} \pmod{n}, \qquad k = 0, 1, \ldots, d-1
$$

> [!example] Example 6.5 — Giải $6x \equiv 4 \pmod{10}$
>
> $d = \gcd(6, 10) = 2$, $2 \mid 4$. Rút gọn:
>
> $$
> 3x \equiv 2 \pmod{5}
> $$
>
> $\gcd(3, 5) = 1$. XGCD: $1 = 2 \cdot 3 - 1 \cdot 5$, nên $3^{-1} \equiv 2 \pmod{5}$.
>
> $x_0 \equiv 2 \cdot 2 = 4 \pmod{5}$.
>
> Nghiệm mod $10$: $x \equiv 4 \pmod{10}$ và $x \equiv 4 + 5 = 9 \pmod{10}$.
>
> Kiểm tra: $6 \cdot 4 = 24 \equiv 4 \pmod{10}$. ✓ $\quad$ $6 \cdot 9 = 54 \equiv 4 \pmod{10}$. ✓

> [!example] Example 6.6 — Giải $12x \equiv 8 \pmod{20}$
>
> $d = \gcd(12, 20) = 4$, $4 \mid 8$. Rút gọn:
>
> $$
> 3x \equiv 2 \pmod{5}
> $$
>
> $3^{-1} \equiv 2 \pmod{5}$ (như trên), $x_0 \equiv 4 \pmod{5}$.
>
> Nghiệm mod $20$: $x \equiv 4, 9, 14, 19 \pmod{20}$ (4 nghiệm, cách nhau $20/4 = 5$).
>
> Kiểm tra: $12 \cdot 4 = 48 \equiv 8 \pmod{20}$. ✓ $\quad$ $12 \cdot 9 = 108 \equiv 8 \pmod{20}$. ✓

---

## Nghịch Đảo Modulo — Tính Chất và Thuật Toán

### Tính chất nghịch đảo

> [!theorem] Theorem 6.7 — Tính Chất Nghịch Đảo
> Cho $\gcd(a, n) = 1$. Nghịch đảo $a^{-1} \pmod{n}$ thỏa:
>
> **(i)** Duy nhất theo modulo $n$.
>
> **(ii)** $(ab)^{-1} \equiv a^{-1} b^{-1} \pmod{n}$ (khi cả $a, b$ khả nghịch).
>
> **(iii)** $(a^{-1})^{-1} \equiv a \pmod{n}$.
>
> **(iv)** Nếu $a \equiv a' \pmod{n}$ thì $a^{-1} \equiv (a')^{-1} \pmod{n}$.

**Proof (i):** Nếu $ax \equiv 1$ và $ay \equiv 1 \pmod{n}$, thì $a(x - y) \equiv 0 \pmod{n}$. Vì $\gcd(a, n) = 1$, suy ra $n \mid (x - y)$, tức $x \equiv y \pmod{n}$. $\blacksquare$

### Phương pháp Fermat (khi $n$ là số nguyên tố)

Khi $p$ là số nguyên tố và $p \nmid a$: theo Định Lý Fermat Nhỏ (bài 08), $a^{p-1} \equiv 1 \pmod{p}$, nên:

$$
a^{-1} \equiv a^{p-2} \pmod{p}
$$

> [!example] Example 6.8 — Tính $7^{-1} \pmod{13}$
>
> $13$ là số nguyên tố, $7^{-1} \equiv 7^{11} \pmod{13}$.
>
> Square-and-multiply: $7^2 = 49 \equiv 10$, $7^4 \equiv 100 \equiv 9$, $7^8 \equiv 81 \equiv 3$, $7^{11} = 7^8 \cdot 7^2 \cdot 7 \equiv 3 \cdot 10 \cdot 7 = 210 \equiv 210 - 16 \cdot 13 = 2 \pmod{13}$.
>
> Kiểm tra: $7 \cdot 2 = 14 \equiv 1 \pmod{13}$. ✓

---

## Bảng Nghịch Đảo và Ứng Dụng

### Bảng nghịch đảo mod 11

| $a$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| $a^{-1}$ | $1$ | $6$ | $4$ | $3$ | $9$ | $2$ | $8$ | $7$ | $5$ | $10$ |

Kiểm tra nhanh: $2 \cdot 6 = 12 \equiv 1$, $3 \cdot 4 = 12 \equiv 1$, $5 \cdot 9 = 45 \equiv 1$, $7 \cdot 8 = 56 \equiv 1$ (mod 11). $\checkmark$

### Ứng dụng: giải hệ đồng dư hai phương trình

Hệ $\begin{cases} 3x + 5y \equiv 1 \pmod{7} \\ 2x + y \equiv 3 \pmod{7} \end{cases}$ — đây là hệ tuyến tính trên $\mathbb{F}_7$!

Từ phương trình 2: $y \equiv 3 - 2x \pmod{7}$.

Thế vào phương trình 1: $3x + 5(3 - 2x) \equiv 1 \pmod{7}$, tức $3x + 15 - 10x \equiv 1$, tức $-7x \equiv -14 \pmod{7}$, tức $0 \equiv 0 \pmod{7}$.

Vậy $x$ tự do, $y \equiv 3 - 2x \pmod{7}$. Nghiệm: $\{(x, 3-2x) \mid x \in \mathbb{Z}/7\mathbb{Z}\}$, cho 7 cặp.

---

## Hủy Nhân Không Phải Lúc Nào Cũng Hợp Lệ — Xét Kỹ Hơn

> [!theorem] Theorem 6.9 — Hủy Nhân Tổng Quát
> Nếu $ac \equiv bc \pmod{n}$ và $d = \gcd(c, n)$, thì:
>
> $$
> a \equiv b \pmod{n/d}
> $$
>
> Đặc biệt, nếu $\gcd(c, n) = 1$ thì $a \equiv b \pmod{n}$.

**Proof.** $ac \equiv bc \pmod{n}$ có nghĩa $n \mid c(a-b)$. Đặt $n = dn'$, $c = dc'$ với $\gcd(c', n') = 1$ và $d = \gcd(c, n)$. Thì $dn' \mid dc'(a-b)$, tức $n' \mid c'(a-b)$. Vì $\gcd(c', n') = 1$, suy ra $n' \mid (a-b)$, tức $a \equiv b \pmod{n/d}$. $\blacksquare$

> [!example] Example 6.10 — Hủy nhân với mất mát modulus
> $6 \cdot 2 \equiv 6 \cdot 7 \pmod{10}$ (vì $12 \equiv 42 \equiv 2 \pmod{10}$).
>
> $d = \gcd(6, 10) = 2$. Hủy $6$: $2 \equiv 7 \pmod{5}$? Tức $2 \equiv 7 \pmod{5}$: $7 - 2 = 5$, đúng!
>
> Nhưng $2 \not\equiv 7 \pmod{10}$ — modulus bị rút gọn từ $10$ xuống $5 = 10/2$.

---

## Giải Đồng Dư Bậc Hai Đơn Giản

Đây là bước mở đầu nhẹ trước bài 15-19 về Quadratic Residues:

> [!example] Example 6.11 — Giải $x^2 \equiv 1 \pmod{n}$ với các $n$ khác nhau
>
> **(a)** $n = 5$: $x^2 \equiv 1 \pmod{5}$. Thử $x = 1, 2, 3, 4$: $1^2=1$, $2^2=4$, $3^2=4$, $4^2=1$. Nghiệm: $x \equiv \pm 1 \equiv 1, 4 \pmod{5}$.
>
> **(b)** $n = 8$: $x^2 \equiv 1 \pmod{8}$. Thử: $1^2=1$, $3^2=9\equiv1$, $5^2=25\equiv1$, $7^2=49\equiv1$. Nghiệm: $x \equiv 1, 3, 5, 7 \pmod{8}$ — bốn nghiệm!
>
> **(c)** $n = p$ nguyên tố: $p \mid (x-1)(x+1)$, nên $x \equiv \pm 1 \pmod{p}$ — chỉ hai nghiệm.
>
> Nhận xét: bài toán $x^2 \equiv 1$ có hai nghiệm khi $n$ là số nguyên tố, nhưng có thể nhiều hơn khi $n$ hợp số (do cấu trúc $\mathbb{Z}/n\mathbb{Z}^*$ phức tạp hơn).

---

## Bổ Đề Hensel (Hensel's Lemma) — Nâng Nghiệm

Khi giải đồng dư modulo $p^k$ (lũy thừa số nguyên tố), một kỹ thuật mạnh là **nâng** (lift) nghiệm từ modulo $p$ lên modulo $p^k$ từng bước một. Đây là Bổ Đề Hensel — tương tự phương pháp Newton trong giải tích, nhưng trong số học modulo.

> [!theorem] Theorem 6.12 — Hensel's Lemma (dạng đơn giản)
> Cho $f(x)$ là đa thức hệ số nguyên, $p$ là số nguyên tố. Giả sử $x_0$ thỏa mãn:
>
> $$
> f(x_0) \equiv 0 \pmod{p}, \qquad f'(x_0) \not\equiv 0 \pmod{p}
> $$
>
> Khi đó với mọi $k \geq 1$, tồn tại **duy nhất** $x_k$ modulo $p^k$ sao cho:
>
> $$
> x_k \equiv x_0 \pmod{p} \quad \text{và} \quad f(x_k) \equiv 0 \pmod{p^k}
> $$
>
> Hơn nữa, $x_k$ được xây dựng đệ quy:
>
> $$
> x_{i+1} = x_i - f(x_i) \cdot [f'(x_0)]^{-1} \pmod{p^{i+1}}
> $$

**Proof sketch.** Ta xây dựng $x_{i+1}$ từ $x_i$ bằng khai triển Taylor:

$$
f(x_i + t p^i) \equiv f(x_i) + t p^i f'(x_i) \pmod{p^{i+1}}
$$

Đặt $x_{i+1} = x_i + t p^i$. Cần $f(x_{i+1}) \equiv 0 \pmod{p^{i+1}}$, tức:

$$
f(x_i) + t p^i f'(x_i) \equiv 0 \pmod{p^{i+1}}
$$

Vì $f(x_i) \equiv 0 \pmod{p^i}$ (giả thiết quy nạp), ta viết $f(x_i) = A p^i$. Khi đó cần:

$$
A + t f'(x_i) \equiv 0 \pmod{p}
$$

Vì $f'(x_i) \equiv f'(x_0) \not\equiv 0 \pmod{p}$, phương trình này có nghiệm $t$ duy nhất modulo $p$. $\blacksquare$

> [!example] Example 6.13 — Nâng nghiệm $x^2 \equiv 2 \pmod{7^k}$
>
> $f(x) = x^2 - 2$, $f'(x) = 2x$. Modulo $p = 7$: $x^2 \equiv 2 \pmod{7}$ có nghiệm $x_0 = 3$ (vì $3^2 = 9 \equiv 2$). $f'(3) = 6 \not\equiv 0 \pmod{7}$.
>
> **Nâng lên $7^2 = 49$:**
> $f(3) = 7$, $[f'(3)]^{-1} \equiv 6^{-1} \equiv 6 \pmod{7}$ (vì $6 \times 6 = 36 \equiv 1 \pmod{7}$).
> $x_1 = 3 - 7 \cdot 6 = 3 - 42 = -39 \equiv 10 \pmod{49}$.
> Kiểm tra: $10^2 = 100 \equiv 2 \pmod{49}$. ✓
>
> **Nâng lên $7^3 = 343$:**
> $f(10) = 98$, $x_2 = 10 - 98 \cdot 6 = 10 - 588 = -578 \equiv 108 \pmod{343}$.
> Kiểm tra: $108^2 = 11664 = 34 \times 343 + 2 \equiv 2 \pmod{343}$. ✓

> [!note] Remark 6.14 — Điều kiện $f'(x_0) \not\equiv 0 \pmod{p}$
> Nếu $f'(x_0) \equiv 0 \pmod{p}$, nghiệm có thể không nâng được hoặc nâng được nhiều cách. Ví dụ: $f(x) = x^2 - 1$, $p = 2$: $f'(x) = 2x \equiv 0 \pmod{2}$ với mọi $x$ — và thực tế $x^2 \equiv 1 \pmod{2^k}$ có 4 nghiệm với $k \geq 3$ (xem Example 6.11b).

> [!tip] Ứng dụng của Hensel's Lemma
> - Tính căn bậc hai modulo $p^k$ (cần cho bài toán sqrt modulo hợp số, RSA, Rabin cryptosystem)
> - Giải phương trình đồng dư bậc cao modulo lũy thừa nguyên tố
> - Chứng minh sự tồn tại primitive root modulo $p^k$ (bài 12)

---

## SageMath Cheatsheet

```python
# Giải ax ≡ b (mod n)
def solve_linear_congruence(a, b, n):
    d = gcd(a, n)
    if b % d != 0:
        return []  # Không có nghiệm
    # Rút gọn
    a1, b1, n1 = a // d, b // d, n // d
    # Tìm nghịch đảo của a1 mod n1
    x0 = (inverse_mod(a1, n1) * b1) % n1
    # d nghiệm mod n
    return [(x0 + k * n1) % n for k in range(d)]

# Ví dụ
print(solve_linear_congruence(6, 4, 10))   # [4, 9]
print(solve_linear_congruence(5, 3, 7))    # [2]
print(solve_linear_congruence(6, 5, 10))   # []

# Tính nghịch đảo modulo
print(inverse_mod(31, 73))   # 33
print(inverse_mod(7, 13))    # 2

# Dùng SageMath Mod object
a = Mod(5, 7)
print(a^(-1))                # 3 (nghịch đảo của 5 mod 7)
print(a^(-1) * 3)            # Nghiệm của 5x ≡ 3 (mod 7)

# Giải hệ tuyến tính trên Z/pZ
p = 7
F = GF(p)
A = matrix(F, [[3, 5], [2, 1]])
b = vector(F, [1, 3])
x = A.solve_right(b)
print(x)

# Tìm tất cả x thỏa x^2 ≡ 1 (mod n)
n = 8
solutions = [x for x in range(n) if pow(x, 2, n) == 1 % n]
print(solutions)  # [1, 3, 5, 7]
```

---

## Summary / Key Takeaways

- $ax \equiv b \pmod{n}$ có nghiệm $\Leftrightarrow$ $\gcd(a, n) \mid b$.
- Khi $d = \gcd(a, n) \mid b$: có đúng $d$ nghiệm phân biệt mod $n$, cách nhau $n/d$.
- **Thuật toán giải:** (1) tính $d = \gcd(a,n)$; (2) kiểm tra $d \mid b$; (3) rút gọn về $\gcd = 1$; (4) tính nghịch đảo qua XGCD; (5) liệt kê $d$ nghiệm.
- Nghịch đảo $a^{-1} \pmod{n}$ tồn tại $\Leftrightarrow$ $\gcd(a,n) = 1$, tính bằng XGCD hoặc (khi $n$ nguyên tố) bằng $a^{n-2}$.
- Hủy nhân $c$ trong $ac \equiv bc \pmod{n}$: modulus rút gọn xuống $n / \gcd(c, n)$.
- Giải hệ tuyến tính trên $\mathbb{F}_p$ hoàn toàn giống đại số tuyến tính thực, nhờ $\mathbb{F}_p$ là trường.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.3.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §5.4.
- Koblitz, N. *A Course in Number Theory and Cryptography* (2nd ed.), Ch. I §3.
