---
title: "07. Định Lý Thặng Dư Trung Hoa"
type: theory
tags: [math, number-theory, lesson-07]
aliases: [Chinese Remainder Theorem, CRT]
created: 2026-05-15
---

> **Prerequisites**: [[05-congruences|05. Quan Hệ Đồng Dư]], [[06-linear-congruences|06. Đồng Dư Tuyến Tính]]
> **Objectives**:
> - Phát biểu và chứng minh CRT (phiên bản hệ đồng dư và phiên bản vành)
> - Xây dựng nghiệm tường minh bằng phương pháp constructive
> - Hiểu đẳng cấu $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$
> - Áp dụng CRT để giải hệ đồng dư, tính toán mô-đun lớn, và đếm số nghiệm
> - Nhận biết giới hạn: khi modulus không nguyên tố cùng nhau

---

## Motivation / Intuition

Một bài toán cổ từ sách toán Trung Hoa thế kỷ III (*Sunzi Suanjing* của Tôn Tử):

> *"Có một số. Chia cho 3 dư 2; chia cho 5 dư 3; chia cho 7 dư 2. Hỏi số đó là bao nhiêu?"*

Câu trả lời: 23. Nhưng bài toán thực sự thú vị hơn: tại sao số đó tồn tại? Có duy nhất không? Và làm sao tìm được mà không cần thử tuần tự?

**Định Lý Thặng Dư Trung Hoa** (Chinese Remainder Theorem — CRT) trả lời hoàn toàn: nếu các modulus đôi một nguyên tố cùng nhau, hệ đồng dư **luôn có nghiệm và nghiệm là duy nhất** theo modulo tích của các modulus. Ẩn sau câu trả lời đó là một cấu trúc đại số sâu sắc: $\mathbb{Z}/mn\mathbb{Z}$ đẳng cấu với $\mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$.

---

## Trường Hợp Hai Modulus

### Phát biểu và chứng minh

> [!theorem] Theorem 7.1 — CRT: Hai Modulus
> Cho $m, n \geq 2$ với $\gcd(m, n) = 1$. Với mọi $a, b \in \mathbb{Z}$, hệ đồng dư:
>
> $$
> x \equiv a \pmod{m}, \qquad x \equiv b \pmod{n}
> $$
>
> có **nghiệm duy nhất** theo modulo $mn$. Cụ thể, nếu $x_0$ là một nghiệm thì toàn bộ nghiệm là:
>
> $$
> x \equiv x_0 \pmod{mn}
> $$

**Proof.**

*Tồn tại:* Vì $\gcd(m, n) = 1$, theo Bézout, tồn tại $s, t \in \mathbb{Z}$ với $sm + tn = 1$.

Đặt $x_0 = a \cdot tn + b \cdot sm$. Ta kiểm tra:

$$
x_0 = a(tn) + b(sm) \equiv a \cdot tn \pmod{m}
$$

Vì $tn = 1 - sm \equiv 1 \pmod{m}$, nên $x_0 \equiv a \cdot 1 = a \pmod{m}$. $\checkmark$

$$
x_0 = a(tn) + b(sm) \equiv b \cdot sm \pmod{n}
$$

Vì $sm = 1 - tn \equiv 1 \pmod{n}$, nên $x_0 \equiv b \cdot 1 = b \pmod{n}$. $\checkmark$

*Duy nhất:* Nếu $x_1, x_2$ đều là nghiệm, thì $m \mid (x_1 - x_2)$ và $n \mid (x_1 - x_2)$. Vì $\gcd(m,n)=1$, suy ra $mn \mid (x_1 - x_2)$, tức $x_1 \equiv x_2 \pmod{mn}$. $\blacksquare$

> [!note] Remark 7.2 — Công thức tường minh
> Nghiệm có thể viết tường minh: $x_0 \equiv a \cdot n \cdot (n^{-1} \bmod m) + b \cdot m \cdot (m^{-1} \bmod n) \pmod{mn}$.
>
> Gọi $N_1 = n$, $N_2 = m$, $y_1 = N_1^{-1} \bmod m$, $y_2 = N_2^{-1} \bmod n$. Khi đó $x_0 = a N_1 y_1 + b N_2 y_2$.

> [!example] Example 7.3 — Bài toán Tôn Tử
>
> $x \equiv 2 \pmod{3}$, $x \equiv 3 \pmod{5}$, $x \equiv 2 \pmod{7}$.
>
> **Bước 1: Giải hai phương trình đầu** ($m=3$, $n=5$, $mn=15$).
>
> Bézout: $1 = 2 \cdot 3 - 1 \cdot 5$, nên $s = 2$, $t = -1$.
>
> $x_0 = 2 \cdot (-1) \cdot 5 + 3 \cdot 2 \cdot 3 = -10 + 18 = 8 \equiv 8 \pmod{15}$.
>
> Kiểm tra: $8 \div 3 = 2$ dư $2$ ✓, $8 \div 5 = 1$ dư $3$ ✓.
>
> **Bước 2: Kết hợp với phương trình thứ ba** ($m'=15$, $n'=7$, $m'n'=105$).
>
> Cần $x \equiv 8 \pmod{15}$, $x \equiv 2 \pmod{7}$.
>
> Bézout trên $(15, 7)$: $1 = 1 \cdot 15 - 2 \cdot 7$ (vì $15 - 2 \cdot 7 = 1$), nên $s=1$, $t=-2$.
>
> $x_0 = 8 \cdot (-2) \cdot 7 + 2 \cdot 1 \cdot 15 = -112 + 30 = -82 \equiv -82 + 105 = 23 \pmod{105}$.
>
> **Kiểm tra:** $23 = 7 \cdot 3 + 2 \equiv 2 \pmod{3}$ ✓, $23 = 4 \cdot 5 + 3 \equiv 3 \pmod{5}$ ✓, $23 = 3 \cdot 7 + 2 \equiv 2 \pmod{7}$ ✓.

---

## Trường Hợp Nhiều Modulus

> [!theorem] Theorem 7.4 — CRT: Nhiều Modulus
> Cho $n_1, n_2, \ldots, n_r \geq 2$ đôi một nguyên tố cùng nhau ($\gcd(n_i, n_j) = 1$ với $i \neq j$). Đặt $N = n_1 n_2 \cdots n_r$. Với mọi $a_1, a_2, \ldots, a_r \in \mathbb{Z}$, hệ:
>
> $$
> x \equiv a_1 \pmod{n_1},\quad x \equiv a_2 \pmod{n_2},\quad \ldots,\quad x \equiv a_r \pmod{n_r}
> $$
>
> có nghiệm duy nhất modulo $N$.

**Proof (constructive).** Với mỗi $i$, đặt $M_i = N / n_i = \prod_{j \neq i} n_j$. Vì $\gcd(n_i, n_j) = 1$ với mọi $j \neq i$, ta có $\gcd(M_i, n_i) = 1$, nên $M_i$ khả nghịch modulo $n_i$.

Tìm $y_i = M_i^{-1} \pmod{n_i}$ (bằng XGCD). Đặt:

$$
x_0 = \sum_{i=1}^{r} a_i M_i y_i
$$

Với mỗi $k$, khi tính $x_0 \pmod{n_k}$: mọi hạng tử với $i \neq k$ có $n_k \mid M_i$, nên $a_i M_i y_i \equiv 0 \pmod{n_k}$. Hạng tử $i = k$: $a_k M_k y_k \equiv a_k \cdot 1 = a_k \pmod{n_k}$.

Vậy $x_0 \equiv a_k \pmod{n_k}$ với mọi $k$.

*Duy nhất:* nếu $x_1 \equiv x_2 \pmod{n_i}$ với mọi $i$, thì $n_i \mid (x_1 - x_2)$ với mọi $i$. Vì các $n_i$ đôi một coprime, tích $N \mid (x_1 - x_2)$. $\blacksquare$

> [!example] Example 7.5 — Thuật toán bảng constructive
>
> Giải $x \equiv 2 \pmod{3}$, $x \equiv 3 \pmod{5}$, $x \equiv 2 \pmod{7}$.
>
> $N = 3 \cdot 5 \cdot 7 = 105$. Lập bảng:
>
> | $i$ | $n_i$ | $a_i$ | $M_i = 105/n_i$ | $y_i = M_i^{-1} \bmod n_i$ | $a_i M_i y_i$ |
> |-----|--------|--------|------------------|-----------------------------|----------------|
> | $1$ | $3$ | $2$ | $35$ | $35 \equiv 2 \pmod{3}$, $y_1 = 2$ | $2 \cdot 35 \cdot 2 = 140$ |
> | $2$ | $5$ | $3$ | $21$ | $21 \equiv 1 \pmod{5}$, $y_2 = 1$ | $3 \cdot 21 \cdot 1 = 63$ |
> | $3$ | $7$ | $2$ | $15$ | $15 \equiv 1 \pmod{7}$, $y_3 = 1$ | $2 \cdot 15 \cdot 1 = 30$ |
>
> $x_0 = 140 + 63 + 30 = 233 \equiv 233 - 2 \cdot 105 = 23 \pmod{105}$. $\checkmark$

---

## Đẳng Cấu Vành

Đây là phiên bản đại số sâu hơn của CRT, giải thích tại sao định lý hoạt động:

> [!theorem] Theorem 7.6 — Đẳng Cấu Vành (Ring Isomorphism)
> Cho $m, n \geq 2$ với $\gcd(m, n) = 1$. Ánh xạ:
>
> $$
> \phi: \mathbb{Z}/mn\mathbb{Z} \longrightarrow \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}
> $$
>
> $$
> \phi([a]_{mn}) = ([a]_m,\, [a]_n)
> $$
>
> là một **đẳng cấu vành** (ring isomorphism).

**Proof.**

*$\phi$ là đồng cấu vành:* Hiển nhiên từ tính chất phép cộng và nhân tương thích với đồng dư.

*$\phi$ là đơn ánh:* Nếu $\phi([a]) = ([0]_m, [0]_n)$ thì $m \mid a$ và $n \mid a$. Vì $\gcd(m,n)=1$, $mn \mid a$, tức $[a]_{mn} = [0]_{mn}$.

*$\phi$ là toàn ánh:* Tập định nghĩa và đồng miền đều có $mn$ phần tử, và $\phi$ đơn ánh, nên $\phi$ toàn ánh. $\blacksquare$

> [!note] Remark 7.7 — Tổng quát hóa
> Với $n_1, \ldots, n_r$ đôi một coprime và $N = \prod n_i$:
>
> $$
> \mathbb{Z}/N\mathbb{Z} \cong \mathbb{Z}/n_1\mathbb{Z} \times \mathbb{Z}/n_2\mathbb{Z} \times \cdots \times \mathbb{Z}/n_r\mathbb{Z}
> $$
>
> Đặc biệt, lấy phần khả nghịch của cả hai vế:
>
> $$
> (\mathbb{Z}/N\mathbb{Z})^* \cong (\mathbb{Z}/n_1\mathbb{Z})^* \times \cdots \times (\mathbb{Z}/n_r\mathbb{Z})^*
> $$
>
> Điều này sẽ là công cụ quan trọng để tính $\varphi(N)$ trong bài 09.

> [!example] Example 7.8 — Đẳng cấu $\mathbb{Z}/15\mathbb{Z} \cong \mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/5\mathbb{Z}$
>
> $\phi([0]) = ([0],[0])$, $\phi([1]) = ([1],[1])$, $\phi([8]) = ([2],[3])$, ...
>
> Phần tử $[8] \in \mathbb{Z}/15\mathbb{Z}$ tương ứng với $([2], [3]) \in \mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/5\mathbb{Z}$.
>
> Nhân: $[8]^2 = [64] = [4]$ trong $\mathbb{Z}/15\mathbb{Z}$. Kiểm tra: $([2],[3])^2 = ([4],[9]) = ([1],[4])$ trong tích. Và $\phi([4]) = ([1],[4])$. ✓

---

## Khi Modulus Không Coprime

> [!warning] Warning 7.9 — Modulus Không Coprime
> Khi $\gcd(m, n) = d > 1$, hệ $x \equiv a \pmod{m}$, $x \equiv b \pmod{n}$ **có thể vô nghiệm**.
>
> Điều kiện cần và đủ để có nghiệm: $d \mid (a - b)$.
>
> Khi có nghiệm, nghiệm là duy nhất modulo $\text{lcm}(m, n) = mn/d$.

**Proof.** $x \equiv a \pmod{m}$ và $x \equiv b \pmod{n}$ có nghĩa $x = a + sm = b + tn$, tức $sm - tn = b - a$, tức $sm + n(-t) = b - a$. Đây là phương trình Diophantine trong $s, t$, có nghiệm $\Leftrightarrow$ $\gcd(m, n) = d \mid (b - a)$.

Khi có nghiệm $x_0$: mọi $x$ thỏa cả hai đồng dư phải có $m \mid (x - x_0)$ và $n \mid (x - x_0)$, tức $\text{lcm}(m,n) \mid (x - x_0)$. $\blacksquare$

> [!example] Example 7.10 — Hệ không coprime có nghiệm
>
> $x \equiv 3 \pmod{6}$, $x \equiv 5 \pmod{10}$. $d = \gcd(6,10) = 2$. $a - b = 3 - 5 = -2 \equiv 0 \pmod{2}$, nên $d \mid (a-b)$: có nghiệm.
>
> $\text{lcm}(6,10) = 30$. Tìm $x$: $x = 3 + 6k$, cần $3 + 6k \equiv 5 \pmod{10}$, tức $6k \equiv 2 \pmod{10}$, tức $3k \equiv 1 \pmod{5}$, $k \equiv 2 \pmod{5}$. Nên $k = 2 + 5j$, $x = 3 + 6(2 + 5j) = 15 + 30j$.
>
> Nghiệm: $x \equiv 15 \pmod{30}$. Kiểm tra: $15 \div 6 = 2$ dư $3$ ✓, $15 \div 10 = 1$ dư $5$ ✓.

> [!example] Example 7.11 — Hệ không coprime vô nghiệm
>
> $x \equiv 3 \pmod{6}$, $x \equiv 4 \pmod{10}$. $d = \gcd(6,10) = 2$. $a - b = 3 - 4 = -1$, $2 \nmid -1$: **Vô nghiệm**. $\square$

---

## Ứng Dụng: Đếm Số Nghiệm

> [!theorem] Theorem 7.12 — Số Nghiệm của Đồng Dư Tổng Hợp
> Nếu $f(x)$ là đa thức nguyên và $n = p_1^{e_1} \cdots p_r^{e_r}$, thì số nghiệm của $f(x) \equiv 0 \pmod{n}$ bằng tích số nghiệm của $f(x) \equiv 0 \pmod{p_i^{e_i}}$ với mỗi $i$.

Đây là hệ quả trực tiếp của đẳng cấu $\mathbb{Z}/n\mathbb{Z} \cong \prod \mathbb{Z}/p_i^{e_i}\mathbb{Z}$.

> [!example] Example 7.13 — Số nghiệm $x^2 \equiv 1 \pmod{24}$
>
> $24 = 8 \cdot 3$.
>
> Mod $8$: $x^2 \equiv 1 \pmod{8}$, nghiệm $x \equiv 1, 3, 5, 7 \pmod{8}$ — 4 nghiệm.
>
> Mod $3$: $x^2 \equiv 1 \pmod{3}$, nghiệm $x \equiv 1, 2 \pmod{3}$ — 2 nghiệm.
>
> Theo CRT: $4 \times 2 = 8$ nghiệm modulo $24$.
>
> Danh sách: $x \equiv 1, 5, 7, 11, 13, 17, 19, 23 \pmod{24}$.

---

## SageMath Cheatsheet

```python
# CRT hai modulus
from sympy.ntheory.modular import crt
# Hoặc dùng SageMath built-in:
x = CRT(2, 3, 3, 5)         # x ≡ 2 (mod 3), x ≡ 3 (mod 5)
print(x)                     # 8

# CRT nhiều modulus
remainders = [2, 3, 2]
moduli = [3, 5, 7]
x = CRT_list(remainders, moduli)
print(x)                     # 23

# Tự cài constructive CRT
def crt_constructive(remainders, moduli):
    N = 1
    for m in moduli:
        N *= m
    x = 0
    for a, m in zip(remainders, moduli):
        Mi = N // m
        yi = inverse_mod(Mi, m)
        x += a * Mi * yi
    return x % N

print(crt_constructive([2, 3, 2], [3, 5, 7]))  # 23

# Đẳng cấu vành: kiểm tra
n = 15
m1, m2 = 3, 5
for a in range(n):
    phi = (a % m1, a % m2)  # φ([a])
    # Kiểm tra φ(a+b) = φ(a)+φ(b) và φ(ab)=φ(a)φ(b)
    b = 7
    lhs_add = ((a + b) % n % m1, (a + b) % n % m2)
    rhs_add = ((a % m1 + b % m1) % m1, (a % m2 + b % m2) % m2)
    assert lhs_add == rhs_add

# Giải hệ với modulus không coprime
def solve_general_crt(a, m, b, n):
    d = gcd(m, n)
    if (b - a) % d != 0:
        return None  # Vô nghiệm
    lcm_mn = m * n // d
    # Giải: a + m*k ≡ b (mod n)
    k0 = (inverse_mod(m // d, n // d) * ((b - a) // d)) % (n // d)
    x0 = a + m * k0
    return x0 % lcm_mn

print(solve_general_crt(3, 6, 5, 10))   # 15
print(solve_general_crt(3, 6, 4, 10))   # None (vô nghiệm)
```

---

## Summary / Key Takeaways

- **CRT cốt lõi**: với $n_1, \ldots, n_r$ đôi một coprime, hệ đồng dư $x \equiv a_i \pmod{n_i}$ có nghiệm duy nhất modulo $N = \prod n_i$.
- **Công thức constructive**: $x_0 = \sum_i a_i M_i y_i$, với $M_i = N/n_i$ và $y_i = M_i^{-1} \bmod n_i$.
- **Đẳng cấu vành**: $\mathbb{Z}/N\mathbb{Z} \cong \prod_{i} \mathbb{Z}/n_i\mathbb{Z}$ khi các $n_i$ đôi một coprime — đây là bản chất đại số của CRT.
- **Nhóm nhân**: $(\mathbb{Z}/N\mathbb{Z})^* \cong \prod (\mathbb{Z}/n_i\mathbb{Z})^*$, là nền tảng để tính $\varphi(N)$.
- **Modulus không coprime**: $d \mid (a - b)$ là điều kiện có nghiệm; khi có, nghiệm duy nhất modulo $\text{lcm}(m,n)$.
- **Đếm nghiệm**: số nghiệm $f(x) \equiv 0 \pmod{n}$ bằng tích số nghiệm theo từng lũy thừa nguyên tố.
- CRT là công cụ "chia để trị" trong số học: rút gọn bài toán modulo $N$ lớn thành các bài toán modulo $n_i$ nhỏ hơn.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.3.
- Conrad, K. *Chinese Remainder Theorem*. Expository notes, University of Connecticut.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §5.4.
- Koblitz, N. *A Course in Number Theory and Cryptography* (2nd ed.), Ch. I §4.
