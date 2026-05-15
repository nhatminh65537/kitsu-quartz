---
title: "19. Polynomial Rings"
type: math-component
tags: [math, groups-rings-fields, ring-theory, polynomials, lesson-19]
aliases: [Polynomial Rings]
created: 2026-05-15
---

> **Prerequisites**: [[18-divisibility-euclidean-domains-pids-ufds|18. Divisibility — EDs, PIDs, UFDs]] — ED, PID, UFD, phân tích nhân tử; [[17-integral-domains-and-fields-of-fractions|17. Integral Domains]] — miền nguyên, trường.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{C}$ | Tập số phức |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $\mathbb{F}_{p^n}$ | Trường hữu hạn $p^n$ phần tử |
> | $\mathbb{Q}(\sqrt{2})$ | Trường $\{a + b\sqrt{2} : a, b \in \mathbb{Q}\}$ |
> | $\cong$ | Đẳng cấu (isomorphism) |
> | $\gcd$ | Ước chung lớn nhất |

> **Objectives**:
> - Xây dựng và hiểu cấu trúc vành đa thức $R[x]$
> - Chứng minh $F[x]$ là ED với hàm norm = bậc đa thức
> - Phát biểu và chứng minh thuật toán chia đa thức, định lý nghiệm, định lý nhân tử
> - Áp dụng các tiêu chuẩn bất khả quy: Eisenstein, giảm modulo $p$
> - Hiểu kết quả cốt lõi: $F[x]/\langle p(x) \rangle$ là trường khi và chỉ khi $p$ bất khả quy

---

## Motivation / Intuition

Vành đa thức $R[x]$ là một trong những cấu trúc căn bản nhất của đại số, xuất hiện ở khắp nơi: từ lý thuyết số, hình học đại số, đến mã hóa. Vai trò của đa thức trong vành giống như vai trò của số nguyên trong toán học sơ cấp.

Điểm quan trọng: khi $F$ là **trường**, $F[x]$ trở nên đặc biệt mạnh — nó là Euclidean Domain (với bậc làm norm), và ta có thể "chia hết" đa thức theo nghĩa chặt chẽ. Điều này cho phép:
1. Phân tích đa thức thành tích các nhân tử bất khả quy (duy nhất đến liên kết).
2. Xây dựng trường mới bằng cách thương $F[x]/\langle p(x) \rangle$ với $p$ bất khả quy.
3. Phân tích nghiệm và cấu trúc đa thức.

---

## Xây dựng vành đa thức

> [!definition] Definition 19.1 — Vành đa thức $R[x]$
> Cho $R$ là vành. **Vành đa thức** $R[x]$ là tập tất cả các **đa thức hình thức** (formal polynomials):
>
> $$
> f = a_n x^n + a_{n-1}x^{n-1} + \cdots + a_1 x + a_0 = \sum_{k=0}^{n} a_k x^k
> $$
>
> với $a_k \in R$, $n \geq 0$, cùng các phép toán:
>
> $$
> \left(\sum_{k} a_k x^k\right) + \left(\sum_{k} b_k x^k\right) = \sum_{k}(a_k + b_k)x^k
> $$
>
> $$
> \left(\sum_{i} a_i x^i\right) \cdot \left(\sum_{j} b_j x^j\right) = \sum_{k}\left(\sum_{i+j=k} a_i b_j\right)x^k
> $$

> [!note] Remark 19.2 — Về biến $x$
> $x$ là **biến hình thức** (formal variable), không phải phần tử cụ thể của $R$. Hai đa thức $f, g \in R[x]$ bằng nhau khi và chỉ khi mọi hệ số tương ứng bằng nhau: $f = g \Leftrightarrow \forall k: a_k = b_k$.

> [!definition] Definition 19.3 — Bậc, hệ số chính, đa thức monic
> Cho $f = a_n x^n + \cdots + a_0 \in R[x]$ với $a_n \neq 0$:
>
> - **Bậc** (degree): $\deg f = n$.
> - **Hệ số chính** (leading coefficient): $a_n$.
> - $f$ là **monic** nếu $a_n = 1$.
> - Đa thức **hằng số** (constant): $\deg f = 0$ (hay $f = a_0$, $a_0 \neq 0$).
> - Đa thức **không** (zero polynomial): $f = 0$, không có bậc (hay $\deg 0 = -\infty$ theo quy ước).

> [!abstract] Theorem 19.4 — Tính chất của bậc đa thức
> Cho $R$ là miền nguyên và $f, g \in R[x] \setminus \{0\}$:
>
> 1. $\deg(f + g) \leq \max(\deg f, \deg g)$
> 2. $\deg(fg) = \deg f + \deg g$

**Proof.** (2): Gọi $a_m$ là hệ số chính của $f$ và $b_n$ của $g$. Hệ số của $x^{m+n}$ trong $fg$ là $a_m b_n \neq 0$ (vì $R$ là miền nguyên, tích của hai phần tử khác $0$ khác $0$). $\blacksquare$

> [!abstract] Corollary 19.5
> Nếu $R$ là miền nguyên thì $R[x]$ là miền nguyên. Hơn nữa, $(R[x])^\times = R^\times$ (đơn vị của $R[x]$ là chính xác các đơn vị của $R$, xem như đa thức hằng số).

---

## Thuật toán chia đa thức

> [!abstract] Theorem 19.6 — Thuật toán chia đa thức (Division Algorithm)
> Cho $F$ là trường và $f, g \in F[x]$ với $g \neq 0$. Tồn tại duy nhất $q, r \in F[x]$ sao cho:
>
> $$
> f = qg + r, \qquad r = 0 \text{ hoặc } \deg r < \deg g
> $$
>
> $q$ gọi là **thương** (quotient), $r$ gọi là **dư** (remainder).

**Proof.**

*Tồn tại* (quy nạp theo $\deg f$):
- Nếu $\deg f < \deg g$: lấy $q = 0$, $r = f$.
- Nếu $\deg f \geq \deg g$: Gọi $\deg f = m$, $\deg g = n$, hệ số chính của $f$ là $a_m$, của $g$ là $b_n$. Đặt $f_1 = f - \frac{a_m}{b_n} x^{m-n} g$. Khi đó $\deg f_1 < m$. Áp dụng giả thiết quy nạp cho $f_1$: $f_1 = q_1 g + r$ với $\deg r < n$. Suy ra $f = \left(\frac{a_m}{b_n} x^{m-n} + q_1\right) g + r$.

*Duy nhất*: Nếu $f = q_1 g + r_1 = q_2 g + r_2$ thì $(q_1 - q_2)g = r_2 - r_1$. Vế phải có bậc $< \deg g$, nhưng vế trái có bậc $\geq \deg g$ trừ khi $q_1 = q_2$. Suy ra $q_1 = q_2$ và $r_1 = r_2$. $\blacksquare$

> [!note] Remark 19.7 — Tại sao cần trường?
> Trong $\mathbb{Z}[x]$, thuật toán chia không luôn tồn tại. Ví dụ: $x$ chia cho $2x$ không cho thương trong $\mathbb{Z}[x]$ vì bước chia cần $1/2 \notin \mathbb{Z}$. Điều kiện $F$ là trường đảm bảo ta luôn chia được hệ số.

> [!abstract] Theorem 19.8 — $F[x]$ là Euclidean Domain
> Khi $F$ là trường, $F[x]$ là Euclidean domain với hàm norm $N(f) = \deg f$.

**Proof.** Theo Theorem 19.6, với $f, g \in F[x]$, $g \neq 0$, tồn tại $q, r$ sao cho $f = qg + r$ và $N(r) = \deg r < \deg g = N(g)$. $\blacksquare$

---

## Nghiệm và định lý nhân tử

> [!abstract] Theorem 19.9 — Định lý nghiệm (Root-Factor Theorem)
> Cho $F$ trường và $f \in F[x]$. Phần tử $a \in F$ là **nghiệm** của $f$ (tức $f(a) = 0$) khi và chỉ khi $(x - a) \mid f(x)$ trong $F[x]$.

**Proof.**
$(\Leftarrow)$ Hiển nhiên: $f(x) = (x-a)q(x) \Rightarrow f(a) = 0$.

$(\Rightarrow)$ Chia $f$ cho $(x - a)$: $f(x) = (x-a)q(x) + r$ với $r \in F$ (vì bậc $r < 1$). Thay $x = a$: $f(a) = 0 + r$, nên $r = 0$. $\blacksquare$

> [!abstract] Corollary 19.10 — Số nghiệm của đa thức
> Đa thức bậc $n$ trên trường $F$ có tối đa $n$ nghiệm phân biệt trong $F$.

**Proof.** Quy nạp theo $n$: mỗi nghiệm $a$ cho phép tách nhân tử $(x-a)$, giảm bậc đi $1$. $\blacksquare$

> [!warning] Counterexample 19.11 — Không đúng trong vành không nguyên
> Trong $\mathbb{Z}/8\mathbb{Z}$, đa thức $x^2 - 1$ có bốn nghiệm: $1, 3, 5, 7$ (vì $1^2 = 9^2 = 25^2 = 49^2 \equiv 1 \pmod 8$). Điều này phá vỡ Corollary 19.10 vì $\mathbb{Z}/8\mathbb{Z}$ không phải trường (không phải miền nguyên).

> [!abstract] Theorem 19.12 — Phân tích nhân tử duy nhất trong $F[x]$
> Vành $F[x]$ với $F$ là trường là **UFD**. Cụ thể:
>
> Mọi đa thức $f \in F[x]$ bậc $\geq 1$ đều phân tích duy nhất (đến liên kết) thành tích các đa thức bất khả quy monic:
>
> $$
> f = c \cdot p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}
> $$
>
> với $c \in F^\times$ là hệ số chính của $f$, các $p_i$ là đa thức monic bất khả quy phân biệt, $e_i \geq 1$.

---

## Tiêu chuẩn bất khả quy

> [!definition] Definition 19.13 — Đa thức bất khả quy (Irreducible Polynomial)
> $f \in F[x]$ với $\deg f \geq 1$ là **bất khả quy** (irreducible over $F$) nếu $f$ không thể viết dưới dạng $f = gh$ với $g, h \in F[x]$ và $1 \leq \deg g, \deg h < \deg f$.

> [!abstract] Theorem 19.14 — Bậc 2 và 3: nghiệm $\Leftrightarrow$ khả quy
> Đa thức $f \in F[x]$ có bậc $2$ hoặc $3$ là **bất khả quy** trên $F$ khi và chỉ khi $f$ **không có nghiệm** trong $F$.

**Proof.** Nếu $f = gh$ với $\deg g, \deg h \geq 1$ thì vì $\deg f = 2$ hoặc $3$, một trong hai nhân tử phải có bậc $1$, tức dạng $(x - a)$ — cho ta nghiệm $a$. Ngược lại, nghiệm $a$ cho $(x-a) \mid f$. $\blacksquare$

> [!abstract] Theorem 19.15 — Tiêu chuẩn Eisenstein (Eisenstein's Criterion)
> Cho $f = a_n x^n + \cdots + a_0 \in \mathbb{Z}[x]$ và $p$ là số nguyên tố. Nếu:
>
> 1. $p \nmid a_n$ (hệ số chính không chia hết $p$)
> 2. $p \mid a_k$ với mọi $k < n$ (mọi hệ số khác chia hết $p$)
> 3. $p^2 \nmid a_0$ (hệ số tự do không chia hết $p^2$)
>
> thì $f$ là bất khả quy trong $\mathbb{Q}[x]$.

**Proof (phác thảo).** Giả sử $f = gh$ với $g = b_r x^r + \cdots + b_0$ và $h = c_s x^s + \cdots + c_0$ trong $\mathbb{Z}[x]$ (dùng Gauss's Lemma để hạ xuống $\mathbb{Z}$). Từ $p \mid a_0 = b_0 c_0$ và $p^2 \nmid a_0$, suy ra $p$ chia đúng một trong $b_0, c_0$, WLOG $p \mid b_0$ và $p \nmid c_0$. Từ $p \nmid a_n = b_r c_s$, suy ra $p \nmid b_r$. Xét $k$ nhỏ nhất sao cho $p \nmid b_k$. Khi đó $a_k = b_k c_0 + b_{k-1} c_0' + \cdots + b_0 c_0^{(k)}$ (quy ước $c_j = 0$ nếu $j > s$). Vì $p \mid b_0, \ldots, b_{k-1}$ và $p \nmid b_k$, và $p \nmid c_0$, ta có $p \nmid a_k$ — nhưng $k \leq r < n$ nên $p \mid a_k$ (theo điều kiện 2). Mâu thuẫn. $\blacksquare$

> [!example] Example 19.16 — Áp dụng Eisenstein
> **Ví dụ 1**: $f = x^4 - 2$ với $p = 2$. $a_4 = 1$ (không chia 2), $a_3 = a_2 = a_1 = 0$ (chia 2), $a_0 = -2$ (chia 2, không chia 4). Theo Eisenstein, $f$ bất khả quy trong $\mathbb{Q}[x]$. $\sqrt[4]{2} \notin \mathbb{Q}$.
>
> **Ví dụ 2**: $\Phi_p(x) = x^{p-1} + x^{p-2} + \cdots + x + 1 = \dfrac{x^p - 1}{x - 1}$ (đa thức phân tử thứ $p$).
>
> Thay $x \to x + 1$: $\Phi_p(x+1) = \dfrac{(x+1)^p - 1}{x} = x^{p-1} + \binom{p}{1}x^{p-2} + \cdots + \binom{p}{p-1}$.
>
> Áp dụng Eisenstein với $p$: $a_{p-1} = 1$ (không chia $p$), $a_k = \binom{p}{k+1}$ (chia $p$ với $0 \leq k < p-1$), $a_0 = p$ (chia $p$ nhưng không $p^2$). Vậy $\Phi_p(x+1)$ bất khả quy, nên $\Phi_p(x)$ cũng bất khả quy.

> [!abstract] Theorem 19.17 — Tiêu chuẩn giảm modulo $p$ (Reduction mod $p$)
> Cho $f \in \mathbb{Z}[x]$ với $\deg f = n$ và $p$ là số nguyên tố. Gọi $\bar{f} \in \mathbb{F}_p[x]$ là đa thức thu được từ $f$ bằng cách giảm hệ số modulo $p$. Nếu $\deg \bar{f} = n$ (hệ số chính không chia hết $p$) và $\bar{f}$ bất khả quy trong $\mathbb{F}_p[x]$, thì $f$ bất khả quy trong $\mathbb{Q}[x]$.

**Proof (phác thảo).** Nếu $f = gh$ trong $\mathbb{Q}[x]$ thì $\bar{f} = \bar{g}\bar{h}$ trong $\mathbb{F}_p[x]$. Vì $\deg \bar{f} = n$ và $\bar{f}$ bất khả quy, một trong $\bar{g}, \bar{h}$ phải là hằng số, suy ra $\deg g = n$ hoặc $\deg h = 0$. $\blacksquare$

> [!example] Example 19.18 — Áp dụng giảm modulo $p$
> $f = x^4 + 1 \in \mathbb{Z}[x]$. Eisenstein không áp dụng được trực tiếp. Giảm mod $3$: $\bar{f} = x^4 + 1 \in \mathbb{F}_3[x]$. Kiểm tra nghiệm: $\bar{f}(0) = 1, \bar{f}(1) = 2, \bar{f}(2) = 17 \equiv 2 \pmod 3$ — không có nghiệm. Vì bậc $4$, cần kiểm tra thêm phân tích thành tích hai bậc $2$. Kiểm tra cho thấy không có phân tích trong $\mathbb{F}_3[x]$. Vậy $x^4 + 1$ bất khả quy trên $\mathbb{Q}$ (nhưng **khả quy** trên $\mathbb{R}$: $x^4+1 = (x^2+\sqrt{2}x+1)(x^2-\sqrt{2}x+1)$).

---

## Vành thương $F[x]/\langle p(x) \rangle$

> [!abstract] Theorem 19.19 — Tiêu chuẩn trường thương
> Cho $F$ là trường và $p(x) \in F[x]$. Khi đó:
>
> $$
> F[x]/\langle p(x) \rangle \text{ là trường} \iff p(x) \text{ bất khả quy trên } F
> $$

**Proof.** Trong $F[x]$ (là PID), $\langle p(x) \rangle$ là ideal tối đại khi và chỉ khi $p(x)$ là nguyên tố trong $F[x]$, tức là bất khả quy (trong PID, nguyên tố = bất khả quy). Theo Theorem 15.11, $\langle p \rangle$ tối đại $\Leftrightarrow$ $F[x]/\langle p \rangle$ là trường. $\blacksquare$

> [!example] Example 19.20 — $\mathbb{R}[x]/\langle x^2+1 \rangle \cong \mathbb{C}$
> $x^2 + 1$ bất khả quy trong $\mathbb{R}[x]$ (không có nghiệm thực). Vậy $\mathbb{R}[x]/\langle x^2 + 1 \rangle$ là trường.
>
> Mọi lớp $[f] \in \mathbb{R}[x]/\langle x^2+1 \rangle$ đại diện bởi đa thức bậc $\leq 1$: $[a + bx]$ với $a, b \in \mathbb{R}$.
>
> Gọi $\mathbf{i} = [x]$. Ta có $\mathbf{i}^2 = [x^2] = [x^2 + 1 - 1] = [-1]$, tức $\mathbf{i}^2 = -1$.
>
> Trường $\{a + b\mathbf{i} : a, b \in \mathbb{R}\}$ với $\mathbf{i}^2 = -1$ chính là $\mathbb{C}$.
>
> $$
> \mathbb{R}[x]/\langle x^2 + 1 \rangle \cong \mathbb{C}
> $$

> [!example] Example 19.21 — $\mathbb{F}_2[x]/\langle x^2 + x + 1 \rangle \cong \mathbb{F}_4$
> Trong $\mathbb{F}_2[x]$, $f = x^2 + x + 1$. Kiểm tra nghiệm: $f(0) = 1 \neq 0$, $f(1) = 1 + 1 + 1 = 1 \neq 0$. Vậy $f$ bất khả quy trên $\mathbb{F}_2$.
>
> Vành thương $K = \mathbb{F}_2[x]/\langle x^2+x+1 \rangle$ là trường với $|K| = 2^2 = 4$ phần tử:
>
> $$
> K = \{[0], [1], [\alpha], [\alpha+1]\}
> $$
>
> với $\alpha = [x]$ thỏa $\alpha^2 + \alpha + 1 = 0$, tức $\alpha^2 = \alpha + 1$.
>
> Bảng nhân: $\alpha \cdot (\alpha + 1) = \alpha^2 + \alpha = (\alpha + 1) + \alpha = 1$.
> Vậy $\alpha$ và $\alpha + 1$ là nghịch đảo của nhau trong $K = \mathbb{F}_4$.

> [!example] Example 19.22 — $\mathbb{Q}[x]/\langle x^2 - 2 \rangle \cong \mathbb{Q}(\sqrt{2})$
> $x^2 - 2$ bất khả quy trong $\mathbb{Q}[x]$ (Eisenstein với $p = 2$). Trường thương:
>
> $$
> \mathbb{Q}[x]/\langle x^2 - 2 \rangle \cong \mathbb{Q}(\sqrt{2}) = \{a + b\sqrt{2} : a, b \in \mathbb{Q}\}
> $$
>
> với $[x] \leftrightarrow \sqrt{2}$ thỏa $(\sqrt{2})^2 = 2$.

---

## Định lý Gauss (Gauss's Lemma)

> [!abstract] Theorem 19.23 — Gauss's Lemma
> Cho $f \in \mathbb{Z}[x]$ là đa thức nguyên thủy (primitive — $\gcd$ của mọi hệ số bằng $1$). Nếu $f = gh$ với $g, h \in \mathbb{Q}[x]$, thì $f$ cũng phân tích được thành $f = g_1 h_1$ với $g_1, h_1 \in \mathbb{Z}[x]$ và $\deg g_1 = \deg g$, $\deg h_1 = \deg h$.

**Ý nghĩa**: Tính bất khả quy trên $\mathbb{Q}$ có thể được kiểm tra bằng cách làm việc trên $\mathbb{Z}$ — đây là cơ sở cho tiêu chuẩn Eisenstein và giảm modulo $p$.

---

## SageMath — Vành đa thức và bất khả quy

```python
# Vành đa thức trên Q
Rx = QQ['x']
x = Rx.gen()
f = x^4 - 2

# Kiểm tra bất khả quy
print(f.is_irreducible())   # True (Eisenstein p=2)

# Phân tích nhân tử trong Q[x]
g = x^4 - 1
print(factor(g))            # (x - 1) * (x + 1) * (x^2 + 1)

# Đa thức phân tử (cyclotomic)
print(cyclotomic_polynomial(5))   # x^4 + x^3 + x^2 + x + 1
print(cyclotomic_polynomial(5).is_irreducible())  # True

# Trường thương: F_2[x]/<x^2+x+1> ≅ F_4
F2x = GF(2)['x']
x2 = F2x.gen()
p = x2^2 + x2 + 1
print(p.is_irreducible())   # True

K = GF(2)['x'].quotient(p)
print(K)                    # Finite Field of size 4 (= F_4)
print(K.cardinality())      # 4

alpha = K.gen()             # alpha = [x]
print(alpha^2)              # alpha + 1 (vì alpha^2 + alpha + 1 = 0)
print(alpha^2 == alpha + K(1))  # True

# Tiêu chuẩn Eisenstein và giảm modulo p
Zx = ZZ['x']
h = Zx(x^3 - 2)
print(h.is_irreducible())   # True (Eisenstein p=2)

# Vành thương Q[x]/<x^2 - 2> ≅ Q(√2)
Qx = QQ['x']
g = Qx(x^2 - 2)
K2 = Qx.quotient(g)
sqrt2 = K2.gen()
print(sqrt2^2)              # 2 (trong vành thương)
# (sqrt2 + 1)(sqrt2 - 1) = sqrt2^2 - 1 = 2 - 1 = 1
print((sqrt2 + K2(1)) * (sqrt2 - K2(1)))  # 1
```

---

## Summary — Lesson 19

- $R[x]$: vành đa thức, $\deg(fg) = \deg f + \deg g$ khi $R$ là miền nguyên.
- $F[x]$ ($F$ là trường): **Euclidean Domain** với norm = bậc, suy ra là PID và UFD.
- **Thuật toán chia**: $f = qg + r$ với $\deg r < \deg g$ (tồn tại và duy nhất trong $F[x]$).
- **Định lý nghiệm**: $f(a) = 0 \Leftrightarrow (x-a) \mid f$; đa thức bậc $n$ có tối đa $n$ nghiệm.
- **Tiêu chuẩn bất khả quy**:
  - Bậc 2, 3: bất khả quy $\Leftrightarrow$ không có nghiệm.
  - Eisenstein: $p \nmid a_n$, $p \mid a_k$ ($k < n$), $p^2 \nmid a_0 \Rightarrow$ bất khả quy trong $\mathbb{Q}[x]$.
  - Giảm mod $p$: $\bar{f}$ bất khả quy trong $\mathbb{F}_p[x]$ $\Rightarrow$ $f$ bất khả quy trong $\mathbb{Q}[x]$.
- **Kết quả cốt lõi**: $F[x]/\langle p(x) \rangle$ là trường $\Leftrightarrow$ $p(x)$ bất khả quy.
- **Gauss's Lemma**: tính bất khả quy trên $\mathbb{Q}$ quy về $\mathbb{Z}$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §9.1–9.4.
- Hungerford, T. W. *Algebra*, Chapter III §5.
- Lang, S. *Algebra* (3rd ed.), Chapter IV §1–2.
