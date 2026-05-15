---
title: "A3. Chinese Remainder Theorem (Ring Version)"
type: math-component
tags: [math, groups-rings-fields, ring-theory, crt, appendix, appendix-a3]
aliases: [CRT Ring Version Proof, A3, Chinese Remainder Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[20-chinese-remainder-theorem|20. Chinese Remainder Theorem]]
> **Lesson type**: Math Component — Appendix
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $R$ | Vành giao hoán có đơn vị $1_R$ |
> | $I, J$ | Ideal của $R$ |
> | $I + J$ | Tổng của hai ideal: $\{a+b : a \in I, b \in J\}$ |
> | $R/I$ | Vành thương |
> | $\prod R/I_i$ | Tích trực tiếp của các vành |
> | $\mathbb{Z}/n\mathbb{Z}$ | Vành các số nguyên modulo $n$ |
> | $\gcd(a,b)$ | Ước chung lớn nhất |
> | $\phi(n)$ | Hàm phi Euler |

---

## Motivation

Định lý Số dư Trung Hoa (CRT) là một trong những định lý cổ điển và hữu ích nhất của toán học — từ lý thuyết số sơ cấp ("tìm số biết dư khi chia cho $3$, $5$, $7$") đến lý thuyết vành trừu tượng, mật mã (RSA-CRT), và xử lý tín hiệu số. Phụ lục này trình bày chứng minh hoàn chỉnh dạng vành tổng quát, các hệ quả cho $\mathbb{Z}$, và ứng dụng trong phân tích cấu trúc của $(\mathbb{Z}/n\mathbb{Z})^\times$.

---

## 1. Định nghĩa và Phát biểu

> [!definition] Definition A3.1 — Ideal nguyên tố cùng nhau (Coprime Ideals)
> Hai ideal $I, J$ của vành $R$ gọi là **nguyên tố cùng nhau** (coprime / comaximal) nếu $I + J = R$, tức là tồn tại $a \in I$, $b \in J$ sao cho $a + b = 1_R$.

> [!note] Remark A3.2 — So sánh với số nguyên
> Trong $\mathbb{Z}$, mọi ideal đều có dạng $n\mathbb{Z}$. $m\mathbb{Z} + n\mathbb{Z} = \gcd(m, n)\mathbb{Z}$, nên $m\mathbb{Z}$ và $n\mathbb{Z}$ là coprime $\iff$ $\gcd(m, n) = 1$. Định nghĩa tổng quát cho vành bất kỳ chính là sự khái quát hóa của sự kiện này.

> [!abstract] Theorem A3.3 — Định lý Số dư Trung Hoa — Dạng Vành (CRT for Rings)
> Cho $R$ là vành giao hoán có đơn vị và $I_1, \ldots, I_k$ là các ideal đôi một nguyên tố cùng nhau: $I_i + I_j = R$ với mọi $i \neq j$. Khi đó:
>
> $$
> R / (I_1 \cap I_2 \cap \cdots \cap I_k) \cong R/I_1 \times R/I_2 \times \cdots \times R/I_k.
> $$
>
> Hơn nữa, với các ideal đôi một coprime, $I_1 \cap \cdots \cap I_k = I_1 I_2 \cdots I_k$.

---

## 2. Chứng minh

**Bước 1: Xây dựng đồng cấu.**

Xét ánh xạ:

$$
\Phi: R \to R/I_1 \times R/I_2 \times \cdots \times R/I_k, \quad \Phi(r) = (r + I_1, r + I_2, \ldots, r + I_k).
$$

$\Phi$ là đồng cấu vành (hiển nhiên từ định nghĩa phép toán trên tích trực tiếp).

**Bước 2: $\ker\Phi = I_1 \cap I_2 \cap \cdots \cap I_k$.**

$$
r \in \ker\Phi \iff r + I_i = 0 + I_i \;\forall i \iff r \in I_i \;\forall i \iff r \in \bigcap_{i=1}^k I_i. \checkmark
$$

**Bước 3: $\Phi$ là toàn ánh.**

Cần chứng minh: với mọi $(r_1 + I_1, \ldots, r_k + I_k)$, tồn tại $r \in R$ với $r \equiv r_i \pmod{I_i}$ với mọi $i$.

> [!abstract] Lemma A3.4 — Lemma then chốt
> Nếu $I_1, \ldots, I_k$ đôi một coprime, thì với mỗi $i$:
>
> $$
> I_i + \prod_{j \neq i} I_j = R.
> $$

**Proof của Lemma (quy nạp theo $k$).**

Với $k=2$: $I_1 + I_2 = R$ đúng theo giả thiết.

Giả sử đúng với $k-1$. Với mỗi $j \neq 1$: $I_1 + I_j = R$, nên tồn tại $a_j \in I_1, b_j \in I_j$ với $a_j + b_j = 1$.

Khi đó:
$$
1 = \prod_{j=2}^k (a_j + b_j) = \underbrace{(\text{tổng các tích chứa ít nhất một } a_j)}_{\in I_1} + \underbrace{b_2 b_3 \cdots b_k}_{\in I_2 I_3 \cdots I_k = \prod_{j \neq 1} I_j}
$$

Vậy $I_1 + \prod_{j \neq 1} I_j = R$. Tương tự cho các $i$ khác. $\blacksquare$

Từ Lemma, với mỗi $i$, tồn tại $e_i \in \prod_{j \neq i} I_j$ và $f_i \in I_i$ sao cho $e_i + f_i = 1$. Khi đó:

- $e_i \equiv 1 \pmod{I_i}$ (vì $e_i = 1 - f_i \equiv 1 \pmod{I_i}$).
- $e_i \equiv 0 \pmod{I_j}$ với mọi $j \neq i$ (vì $e_i \in \prod_{k \neq i} I_k \subseteq I_j$).

Phần tử $e_i$ được gọi là các **idempotent trực giao** (orthogonal idempotents) modulo các ideal.

Bây giờ, đặt:
$$
r = r_1 e_1 + r_2 e_2 + \cdots + r_k e_k.
$$

Khi đó với mỗi $i$:
$$
r \equiv r_i e_i \equiv r_i \cdot 1 = r_i \pmod{I_i},
$$
và các số hạng $r_j e_j$ ($j \neq i$) đồng dư $0$ modulo $I_i$. $\checkmark$

**Bước 4:** Áp dụng First Isomorphism Theorem cho vành: $R/\ker\Phi \cong \operatorname{Im}(\Phi) = R/I_1 \times \cdots \times R/I_k$.

**Tính chất $I_1 \cap \cdots \cap I_k = I_1 \cdots I_k$:** Luôn có $I_1 \cdots I_k \subseteq I_1 \cap \cdots \cap I_k$. Với $k=2$ và $I_1 + I_2 = R$: lấy $a \in I_1, b \in I_2$ với $a+b=1$. Với $x \in I_1 \cap I_2$: $x = x(a+b) = xa + xb \in I_1 I_2 + I_2 I_1 = I_1 I_2$. Quy nạp cho $k$ tổng quát. $\blacksquare$

---

## 3. CRT cho $\mathbb{Z}$ và Ứng dụng

> [!abstract] Corollary A3.5 — CRT cho Số nguyên
> Cho $n_1, \ldots, n_k$ nguyên dương đôi một nguyên tố cùng nhau ($\gcd(n_i, n_j) = 1$ với $i \neq j$). Đặt $N = n_1 n_2 \cdots n_k$. Khi đó:
>
> $$
> \mathbb{Z}/N\mathbb{Z} \cong \mathbb{Z}/n_1\mathbb{Z} \times \mathbb{Z}/n_2\mathbb{Z} \times \cdots \times \mathbb{Z}/n_k\mathbb{Z}.
> $$
>
> Tức là: hệ phương trình $x \equiv a_i \pmod{n_i}$ ($i = 1, \ldots, k$) luôn có nghiệm duy nhất modulo $N$.

**Proof.** Áp dụng Theorem A3.3 với $R = \mathbb{Z}$, $I_i = n_i \mathbb{Z}$. $\blacksquare$

> [!example] Example A3.6 — Giải hệ phương trình đồng dư kinh điển
> Hệ: $x \equiv 2 \pmod 3$, $x \equiv 3 \pmod 5$, $x \equiv 2 \pmod 7$.
>
> $N = 3 \times 5 \times 7 = 105$.
>
> - $M_1 = 35$, tìm $y_1$: $35y_1 \equiv 1 \pmod 3 \implies 2y_1 \equiv 1 \implies y_1 = 2$.
> - $M_2 = 21$, $21y_2 \equiv 1 \pmod 5 \implies y_2 = 1$ (vì $21 \equiv 1 \pmod 5$).
> - $M_3 = 15$, $15y_3 \equiv 1 \pmod 7 \implies y_3 = 1$ (vì $15 \equiv 1 \pmod 7$).
>
> $$
> x = 2 \cdot 35 \cdot 2 + 3 \cdot 21 \cdot 1 + 2 \cdot 15 \cdot 1 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}.
> $$
>
> Kiểm tra: $23 \equiv 2 \pmod 3$ ✓; $23 \equiv 3 \pmod 5$ ✓; $23 \equiv 2 \pmod 7$ ✓.

---

## 4. Hệ quả: Cấu trúc $(\mathbb{Z}/n\mathbb{Z})^\times$

> [!abstract] Corollary A3.7 — Cấu trúc $(\mathbb{Z}/n\mathbb{Z})^\times$ qua CRT
> Cho $n = p_1^{a_1} \cdots p_k^{a_k}$ (phân tích nguyên tố). Khi đó:
>
> $$
> (\mathbb{Z}/n\mathbb{Z})^\times \cong (\mathbb{Z}/p_1^{a_1}\mathbb{Z})^\times \times \cdots \times (\mathbb{Z}/p_k^{a_k}\mathbb{Z})^\times,
> $$
>
> và do đó $\phi(n) = \phi(p_1^{a_1}) \cdots \phi(p_k^{a_k}) = \prod_i p_i^{a_i-1}(p_i-1)$.

Đây chính là cơ sở cho việc chứng minh **tính nhân tính** (multiplicativity) của hàm phi Euler.

---

## 5. CRT trên Vành Đa thức

> [!abstract] Corollary A3.8 — CRT cho $F[x]$
> Cho $F$ là trường và $f_1(x), \ldots, f_k(x) \in F[x]$ đôi một nguyên tố cùng nhau ($\gcd(f_i, f_j) = 1$). Đặt $f = f_1 f_2 \cdots f_k$. Khi đó:
>
> $$
> F[x] / \langle f \rangle \cong F[x]/\langle f_1 \rangle \times \cdots \times F[x]/\langle f_k \rangle.
> $$

Ứng dụng: nội suy Lagrange, mã hóa Reed-Solomon, và biến đổi Fourier nhanh (FFT) trên trường hữu hạn.

---

## 6. SageMath — Kiểm tra CRT

```sage
# CRT cho Z: giải hệ x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
x = crt([2, 3, 2], [3, 5, 7])
print(f"Nghiệm: x = {x}")  # 23

# Kiểm tra
print(f"x mod 3 = {x % 3}")  # 2
print(f"x mod 5 = {x % 5}")  # 3
print(f"x mod 7 = {x % 7}")  # 2

# CRT cho vành đa thức
R.<x> = PolynomialRing(QQ)
f1 = x^2 + 1
f2 = x^2 - 2
f = f1 * f2

# Kiểm tra gcd(f1, f2) = 1
print(f"\ngcd(x^2+1, x^2-2) = {gcd(f1, f2)}")  # 1

# Đồng cấu CRT cho đa thức
# R[x]/<f> → R[x]/<f1> × R[x]/<f2>
# Mọi đa thức bậc < 4 đều có thể khôi phục từ phần dư modulo f1 và f2

# Phân tích (Z/nZ)^× qua CRT
n = 105  # 3 * 5 * 7
Zn_star = Integers(n).unit_group()
print(f"\n(Z/105Z)^× ≅ {Zn_star}")  # C_2 × C_4 × C_6
print(f"φ(105) = {euler_phi(105)}")  # 48 = 2 * 4 * 6
```

---

## 7. Mở rộng: Định lý Số dư Trung Hoa cho Module

> [!info] CRT cho Module trên PID
> Định lý CRT có thể phát biểu cho **module trên miền ideal chính** (PID). Đây là ngôn ngữ thống nhất cho cả CRT trên $\mathbb{Z}$, trên $F[x]$, và trong lý thuyết dạng chuẩn Smith (Smith normal form). Chi tiết xem thêm Hungerford, Chapter IV §6.

---

## References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), Section 7.6, Theorem 7.
- Hungerford, *Algebra*, Chapter III §2.
- Lang, *Algebra* (3rd ed.), Chapter II §2.
- Conrad, K., *The Chinese Remainder Theorem* (UConn lecture notes).
- Stein, W., *Algebraic Number Theory*, Chapter 9.
