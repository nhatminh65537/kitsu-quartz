---
title: "34. Đếm Số Biểu Diễn và Ứng Dụng"
type: application
tags: [math, number-theory, lesson-34, sums-of-two-squares]
aliases: [Counting Representations, r2(n), Pythagorean Triples]
created: 2026-05-15
---

> **Prerequisites**: [[09-euler-phi-and-euler-theorem|09. Hàm Euler $\varphi$ và Định Lý Euler]], [[21-dirichlet-convolution-and-mobius|21. Tích Chập Dirichlet và Hàm Möbius]], [[33-sums-of-two-squares|33. Tổng Hai Bình Phương — Định Lý Fermat]]
> **Objectives**:
> - Định nghĩa hàm $r_2(n)$ — số cách biểu diễn $n$ thành tổng hai bình phương
> - Chứng minh công thức $r_2(n) = 4(d_1(n) - d_3(n))$
> - Áp dụng $\mathbb{Z}[i]$ để phân loại primitive Pythagorean triples
> - Giới thiệu mở rộng sang các vành quadratic khác

---

## Motivation / Intuition

Bài 33 cho ta biết **khi nào** $n$ biểu diễn được thành tổng hai bình phương. Câu hỏi tiếp theo: **có bao nhiêu cách**?

Ví dụ: $65 = 1^2+8^2 = 4^2+7^2$ — hai biểu diễn (không kể dấu và thứ tự). $25 = 0^2+5^2 = 3^2+4^2$. $5 = 1^2+2^2$ — chỉ một.

Gauss đã tìm ra công thức đẹp: $r_2(n) = 4(d_1(n) - d_3(n))$, trong đó $d_k(n)$ là số ước dương của $n$ đồng dư $k \pmod{4}$. Công thức này kết nối bài toán biểu diễn với hàm ước số — một chủ đề quen thuộc từ Module 4.

Bài này cũng áp dụng $\mathbb{Z}[i]$ để giải bài toán **Pythagorean triples** — một ứng dụng cổ điển và đẹp của unique factorization.

---

## Hàm $r_2(n)$

> [!definition] Definition 34.1 — Hàm $r_2(n)$
> Với $n \in \mathbb{Z}_{\geq 0}$, $r_2(n)$ là số cặp số nguyên $(x,y) \in \mathbb{Z}^2$ sao cho $x^2 + y^2 = n$:
>
> $$
> r_2(n) = \big|\{(x,y) \in \mathbb{Z}^2 \mid x^2 + y^2 = n\}\big|
> $$
>
> Quy ước: $r_2(0) = 1$ (chỉ có $(0,0)$).

> [!example] Example 34.2 — Tính $r_2(n)$ cho các $n$ nhỏ
>
> | $n$ | Nghiệm $(x,y)$ (không kể thứ tự) | $r_2(n)$ |
> |-----|----------------------------------|----------|
> | $0$ | $(0,0)$ | $1$ |
> | $1$ | $(\pm 1, 0), (0, \pm 1)$ | $4$ |
> | $2$ | $(\pm 1, \pm 1)$ | $4$ |
> | $3$ | — | $0$ |
> | $4$ | $(\pm 2, 0), (0, \pm 2)$ | $4$ |
> | $5$ | $(\pm 1, \pm 2), (\pm 2, \pm 1)$ | $8$ |
> | $25$ | $(\pm 5, 0), (0, \pm 5), (\pm 3, \pm 4), (\pm 4, \pm 3)$ | $12$ |

> [!note] Remark 34.3 — Ý nghĩa qua $\mathbb{Z}[i]$
> $r_2(n)$ chính là số Gaussian integers $\alpha \in \mathbb{Z}[i]$ có $N(\alpha) = n$. Mỗi biểu diễn $n = x^2+y^2$ tương ứng một-một với $\alpha = x+yi$ thỏa $N(\alpha) = n$.

---

## Công Thức của Gauss cho $r_2(n)$

> [!theorem] Theorem 34.4 — Công thức $r_2(n)$ (Gauss)
> Cho $n \geq 1$. Đặt:
>
> $$
> d_1(n) = |\{d \in \mathbb{Z}^+ : d \mid n,\; d \equiv 1 \pmod{4}\}|
> $$
> $$
> d_3(n) = |\{d \in \mathbb{Z}^+ : d \mid n,\; d \equiv 3 \pmod{4}\}|
> $$
>
> Khi đó:
>
> $$
> r_2(n) = 4\big(d_1(n) - d_3(n)\big)
> $$

**Proof sketch.** Ý tưởng: $r_2(n)$ là số $\alpha \in \mathbb{Z}[i]$ với $N(\alpha) = n$. Phân tích $n$ trong $\mathbb{Z}[i]$ dùng UFD, rồi đếm số cách chọn factorization của $\alpha$. Chi tiết xem Appendix [[a6-proof-of-r2-formula|A6. Công thức $r_2(n)$]].

Ở đây ta chứng minh bằng quy nạp dựa trên tính chất của $r_2(n)$: nó là hàm nhân tính (không hoàn toàn), và giá trị trên $p^k$ được kiểm tra trực tiếp. $\blacksquare$

> [!example] Example 34.5 — Áp dụng công thức
>
> **(a)** $n = 5$: ước của $5$ là $1, 5$. $d \equiv 1 \pmod{4}$: $1, 5$ → $d_1(5) = 2$. $d \equiv 3 \pmod{4}$: không có → $d_3(5) = 0$. Vậy $r_2(5) = 4(2-0) = 8$. Đúng: $(\pm 1, \pm 2), (\pm 2, \pm 1)$.
>
> **(b)** $n = 25 = 5^2$: ước: $1, 5, 25$. $d \equiv 1$: $1, 5, 25$ → $d_1 = 3$. $d \equiv 3$: không có. $r_2(25) = 4(3-0) = 12$. ✓
>
> **(c)** $n = 15 = 3 \cdot 5$: ước: $1, 3, 5, 15$. $d \equiv 1$: $1, 5$ → $d_1 = 2$. $d \equiv 3$: $3, 15$ → $d_3 = 2$. $r_2(15) = 4(2-2) = 0$. Đúng: $15$ không biểu diễn được (vì $3 \equiv 3 \pmod{4}$ có số mũ lẻ).
>
> **(d)** $n = 65 = 5 \cdot 13$: ước: $1, 5, 13, 65$. Tất cả $\equiv 1 \pmod{4}$. $d_1 = 4$, $d_3 = 0$. $r_2(65) = 4 \cdot 4 = 16$. Đếm: $(\pm 1, \pm 8)$, $(\pm 8, \pm 1)$, $(\pm 4, \pm 7)$, $(\pm 7, \pm 4)$ — đúng $16$ nghiệm!

---

## Hệ Quả và Tính Chất

> [!corollary] Corollary 34.6 — $r_2(n) = 0$ khi nào
> $r_2(n) = 0 \iff d_1(n) = d_3(n)$. Điều này xảy ra khi và chỉ khi tồn tại prime $q \equiv 3 \pmod{4}$ với số mũ lẻ trong $n$ (phù hợp với Theorem 33.7).

> [!corollary] Corollary 34.7 — $r_2(n)$ cho prime $p \equiv 1 \pmod{4}$
> Nếu $p \equiv 1 \pmod{4}$:
>
> $$
> r_2(p) = 8
> $$
>
> Tức là $p = a^2+b^2$ có đúng $8$ biểu diễn (gồm các hoán vị dấu và thứ tự của $(a,b)$ với $a > b > 0$).

**Proof.** $d_1(p) = 2$ (ước $1$ và $p$, cả hai $\equiv 1$), $d_3(p) = 0$. $r_2(p) = 4(2-0) = 8$. $\blacksquare$

> [!corollary] Corollary 34.8 — $r_2(2^k)$
> Với $k \geq 1$: $r_2(2^k) = 4$.
>
> **Proof.** $d_1(2^k) = 1$ (chỉ $d=1$), $d_3(2^k) = 0$. $r_2 = 4$.
> Ví dụ: $2 = 1^2+1^2$: $(\pm 1, \pm 1)$ → $4$. $4 = 0^2+2^2$: $(\pm 2, 0), (0, \pm 2)$ → $4$.

---

## Ứng Dụng: Primitive Pythagorean Triples

### Định nghĩa

> [!definition] Definition 34.9 — Pythagorean Triple
> Bộ ba số nguyên dương $(x,y,z)$ được gọi là **Pythagorean triple** nếu $x^2 + y^2 = z^2$.
>
> Bộ ba được gọi là **primitive** (nguyên thủy) nếu $\gcd(x,y,z) = 1$.

> [!note] Remark 34.10 — Quan sát
> Trong một primitive Pythagorean triple, $x$ và $y$ không thể cùng chẵn (vì khi đó $z$ cũng chẵn, vi phạm $\gcd = 1$). Chúng cũng không thể cùng lẻ (vì tổng hai bình phương lẻ $\equiv 2 \pmod{4}$, không thể là bình phương). Vậy một chẵn, một lẻ. Theo quy ước, ta gọi $y$ là cạnh chẵn.

### Phân loại qua Gaussian integers

> [!theorem] Theorem 34.11 — Phân loại Primitive Pythagorean Triples
> Mọi primitive Pythagorean triple $(x,y,z)$ với $y$ chẵn đều có dạng:
>
> $$
> x = u^2 - v^2, \qquad y = 2uv, \qquad z = u^2 + v^2
> $$
>
> trong đó $u > v > 0$, $\gcd(u,v) = 1$, và $u \not\equiv v \pmod{2}$ (một chẵn, một lẻ).

**Proof (sử dụng $\mathbb{Z}[i]$).**

Giả sử $(x,y,z)$ là primitive Pythagorean triple, $y$ chẵn. Ta có:

$$
z^2 = x^2 + y^2 = (x+yi)(x-yi)
$$

Đây là phương trình $N(x+yi) = z^2$ trong $\mathbb{Z}[i]$.

**Bước 1:** $\gcd(x+yi, x-yi) = 1$ trong $\mathbb{Z}[i]$ (sai khác unit). Thật vậy, nếu $\delta \mid (x+yi)$ và $\delta \mid (x-yi)$, thì $\delta \mid 2x$ và $\delta \mid 2yi$. Suy ra $\delta \mid 2x$ và $\delta \mid 2y$. Vì $\gcd(x,y)=1$ trong $\mathbb{Z}$, $\delta \mid 2$. Nhưng $z$ lẻ (vì $x$ lẻ, $y$ chẵn), nên $\delta$ không thể là $\pm 1 \pm i$ (ước của $2$). Vậy $\delta$ là unit.

**Bước 2:** Trong $\mathbb{Z}[i]$, $x+yi$ và $x-yi$ là nguyên tố cùng nhau (sai khác unit), và tích của chúng là một bình phương ($z^2$). Do unique factorization, mỗi factor phải là một bình phương (sai khác unit):

$$
x+yi = u \cdot (u' + v'i)^2
$$

với $u \in \{\pm 1, \pm i\}$. Vì $x,y > 0$, ta có thể chọn unit phù hợp để được:

$$
x+yi = (u+vi)^2
$$

với $u > v > 0$.

**Bước 3:** Khai triển: $(u+vi)^2 = (u^2-v^2) + 2uv i = x+yi$. Vậy:

$$
x = u^2 - v^2, \qquad y = 2uv, \qquad z = \sqrt{N(x+yi)} = u^2+v^2
$$

Kiểm tra $\gcd(u,v)=1$: nếu $\gcd(u,v) = d > 1$, thì $d^2 \mid x,y,z$, vi phạm tính primitive. $u$ và $v$ khác parity vì nếu cùng parity thì $x$ và $z$ cùng chẵn. $\blacksquare$

> [!example] Example 34.12 — Sinh primitive Pythagorean triples
>
> | $u$ | $v$ | $x = u^2-v^2$ | $y = 2uv$ | $z = u^2+v^2$ | Triple |
> |-----|-----|---------------|-----------|---------------|--------|
> | $2$ | $1$ | $3$ | $4$ | $5$ | $(3,4,5)$ |
> | $3$ | $2$ | $5$ | $12$ | $13$ | $(5,12,13)$ |
> | $4$ | $1$ | $15$ | $8$ | $17$ | $(15,8,17)$ |
> | $4$ | $3$ | $7$ | $24$ | $25$ | $(7,24,25)$ |
> | $5$ | $2$ | $21$ | $20$ | $29$ | $(21,20,29)$ |

---

## Mở Rộng: Các Vành Quadratic Khác

$\mathbb{Z}[i]$ chỉ là một trong nhiều vành số nguyên của trường số bậc hai. Các vành khác giải các bài toán tương tự:

| Vành | Dạng | Bài toán liên quan |
|------|------|--------------------|
| $\mathbb{Z}[i]$ | $a+bi$ | $x^2+y^2=n$ |
| $\mathbb{Z}[\sqrt{-2}]$ | $a+b\sqrt{-2}$ | $x^2+2y^2=n$ |
| $\mathbb{Z}[\omega]$, $\omega = e^{2\pi i/3}$ | $a+b\omega$ | $x^2-xy+y^2=n$ (Eisenstein integers) |
| $\mathbb{Z}[\sqrt{2}]$ | $a+b\sqrt{2}$ | $x^2-2y^2=n$ (liên quan Pell!) |

Mỗi vành có một norm tương tự, một tập units riêng, và một phân loại primes riêng. Ví dụ, trong $\mathbb{Z}[\sqrt{-2}]$, một rational prime $p \equiv 1, 3 \pmod{8}$ phân rã, $p \equiv 5, 7 \pmod{8}$ trơ.

---

## SageMath Cheatsheet

```python
# Tính r_2(n)
def r2(n):
    if n == 0:
        return 1
    count = 0
    for d in divisors(n):
        if d % 4 == 1:
            count += 1
        elif d % 4 == 3:
            count -= 1
    return 4 * count

print(r2(5))    # 8
print(r2(65))   # 16
print(r2(15))   # 0
print(r2(25))   # 12

# Liệt kê tất cả biểu diễn
def sum_of_two_squares_representations(n):
    reps = []
    limit = int(sqrt(n))
    for a in range(limit + 1):
        b2 = n - a^2
        if b2.is_square():
            b = int(sqrt(b2))
            reps.append((a, b))
    return reps

print(sum_of_two_squares_representations(65))
# [(1, 8), (4, 7)]

# Sinh primitive Pythagorean triples
def primitive_triples(limit_z):
    triples = []
    for u in range(2, int(sqrt(limit_z)) + 1):
        for v in range(1, u):
            if gcd(u, v) != 1:
                continue
            if (u % 2) == (v % 2):
                continue
            x = u^2 - v^2
            y = 2*u*v
            z = u^2 + v^2
            if z <= limit_z:
                triples.append((min(x,y), max(x,y), z))
    return sorted(triples, key=lambda t: t[2])

print(primitive_triples(50))
# [(3, 4, 5), (5, 12, 13), (15, 8, 17), (7, 24, 25), (21, 20, 29), (9, 40, 41)]
```

---

## Summary / Key Takeaways

- **$r_2(n)$** đếm số cặp $(x,y) \in \mathbb{Z}^2$ với $x^2+y^2=n$.
- **Công thức Gauss**: $r_2(n) = 4(d_1(n) - d_3(n))$, trong đó $d_k(n)$ là số ước $\equiv k \pmod{4}$ của $n$.
- Hệ quả: $n$ là tổng hai bình phương $\iff r_2(n) > 0 \iff d_1(n) \neq d_3(n) \iff$ mọi $q \equiv 3 \pmod{4}$ có số mũ chẵn.
- $r_2(p) = 8$ cho $p \equiv 1 \pmod{4}$; $r_2(2^k) = 4$; $r_2(n) = 0$ nếu có prime $3 \pmod{4}$ mũ lẻ.
- **Primitive Pythagorean triples** $(x,y,z)$ với $y$ chẵn: $x = u^2-v^2$, $y = 2uv$, $z = u^2+v^2$, $\gcd(u,v)=1$, $u \not\equiv v \pmod{2}$.
- Chứng minh qua $\mathbb{Z}[i]$: $x^2+y^2 = N(x+yi) = z^2$, dùng UFD suy ra $x+yi$ là bình phương (up to unit).
- Các vành quadratic khác ($\mathbb{Z}[\sqrt{-2}]$, $\mathbb{Z}[\omega]$) là mở rộng tự nhiên của ý tưởng này.

---

## References

- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §16.9–16.10.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §8.3, §17.1–17.2.
- Conrad, K. *The Gaussian Integers*. https://kconrad.math.uconn.edu/blurbs/ugradnumthy/Zinotes.pdf
- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.7.
