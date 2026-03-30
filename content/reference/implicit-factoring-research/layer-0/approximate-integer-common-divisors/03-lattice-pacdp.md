---
title: "03. Lattice Attack on PACDP"
type: attack
tags: [approximate-gcd, acdp, pacdp, lattice, lll, coppersmith, attack, lesson-03]
aliases: [PACD_L, Lattice PACDP]
source: "Approximate Integer Common Divisors — Nick Howgrave-Graham, CaLC 2001"
created: 2026-03-25
---

> **Prerequisites**: [[01-acdp-framework|01. ACDP Framework]], [[02-continued-fraction-acdp|02. Continued Fraction Attack]], LLL algorithm (black box), tìm nghiệm nguyên của đa thức bậc thấp  
> 🔴 **Prerequisite references**: Lenstra-Lenstra-Lovász — *LLL* [8] (dùng như black box); Coppersmith — *Small root of bivariate integer equation*, Eurocrypt'96 [1] (technique gốc)  
> **Lesson type**: Attack  
> **Covers**: §3 Using Lattices to Solve PACDP (full lattice construction, determinant analysis, bound derivation, existence proof of Alg. 12)
>
> **Notation** (mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $q_1(x)$ | Đa thức $a_0 + x$ (mô hình hoá input thứ nhất) | $q_1(x)$ |
> | $q_2(x)$ | Đa thức hằng $b_0$ (mô hình hoá input thứ hai) | $q_2(x)$ |
> | $p_i(x)$ | Đa thức cơ sở: $p_i(x) = q_1(x)^{u-i} \cdot q_2(x)^i$ | $p_i(x)$ |
> | $r(x)$ | Đa thức kết quả từ LLL: $r(x) = \sum_i r_i x^i$ | $r(x)$ |
> | $u$ | Tham số số lần "nhân chéo" giữa $q_1, q_2$ | $u$ |
> | $h$ | Bậc của đa thức $r(x)$ cần tìm | $h$ |
> | $\Delta$ | Định thức của lattice | $\Delta$ |
> | $\mathbf{r}$ | Vector trong lattice tương ứng với $r(x)$ | $\mathbf{r}$ |

---

## Motivation: Vượt Qua Giới Hạn Của Continued Fraction

[[02-continued-fraction-acdp|Lesson 02]] cho thấy PACD_CF chỉ hoạt động khi $\beta < 2\alpha - 1$, tức $\alpha > 1/2$. Nếu divisor $d$ chiếm ít hơn một nửa kích thước bit của $b_0$, phương pháp continued fraction hoàn toàn thất bại.

Lattice method — qua kỹ thuật của Coppersmith [1] và Howgrave-Graham [5] — đạt được **bound tốt hơn đáng kể**: $\beta_0 < \alpha_0^2$. Đây là đường cong parabol, luôn nằm trên $\beta = 2\alpha - 1$ với mọi $\alpha \in (0,1)$, và quan trọng hơn, **hoạt động với mọi $\alpha \in (0,1)$** kể cả $\alpha < 1/2$.

> [!info] 🟡 Kỹ thuật Coppersmith [1] & Howgrave-Graham [5]
> Coppersmith (1996) chứng minh rằng nếu có $m$ đa thức $p_i(x) \in \mathbb{Z}[x]$ thoả $p_i(x_0) \equiv 0 \pmod{t}$ với $|x_0| < X$, thì **tổ hợp tuyến tính đa thức** $r(x) = \sum u_i(x) p_i(x)$ cũng có $r(x_0) \equiv 0 \pmod{t}$. Nếu $r(x)$ "đủ nhỏ" khi evaluated tại mọi $|x| < X$, thì $r(x_0) = 0$ **over the integers** — loại bỏ modular, cho phép tìm nghiệm bằng root-finding.
>
> Howgrave-Graham [5] áp dụng kỹ thuật này để factor $N = p^r q$ (tìm factor khi biết một phần bits). Paper hiện tại nhận ra rằng cùng kỹ thuật giải PACDP tổng quát hơn.
>
> *(theo [1]: Coppersmith — Finding a Small Root of a Bivariate Integer Equation, Eurocrypt'96, LNCS 1233)*  
> *(theo [5]: Howgrave-Graham — Computational Mathematics Inspired by RSA, PhD Thesis 1999)*

---

## Reformulation: PACDP Là Bài Toán Small Root

Trong PACDP, ta có $b_0$ biết chính xác và $a_0$ là xấp xỉ. Định nghĩa:

$$
q_1(x) = a_0 + x, \quad q_2(x) = b_0 \quad (\text{hằng số})
$$

Ta được đảm bảo tồn tại $x_0$ với $|x_0| < X = b_0^{\beta_0}$ sao cho $d > M = b_0^{\alpha_0}$ chia hết cả $q_1(x_0) = a_0 + x_0$ lẫn $q_2(x_0) = b_0$.

**Bài toán**: Tìm $x_0$ nhỏ này. Nếu có $x_0$ thì $d = \gcd(a_0 + x_0, b_0)$.

> [!note] Observation 3.1 — Cấu Trúc Module
> Với $u$ là tham số nguyên dương bất kỳ, định nghĩa:
>
> $$
> p_i(x) = q_1(x)^{u-i} \cdot q_2(x)^i = (a_0 + x)^{u-i} \cdot b_0^i, \quad i = 0, 1, \ldots, u
> $$
>
> Vì $d^u \mid p_i(x_0)$ với mọi $i$ (do $d \mid q_1(x_0)$ và $d \mid q_2(x_0)$), mọi tổ hợp tuyến tính:
>
> $$
> r(x) = \sum_{i=0}^{u} u_i(x) \cdot p_i(x)
> $$
>
> cũng thoả $r(x_0) \equiv 0 \pmod{d^u}$.

Chiến lược: dùng LLL để tìm một $r(x)$ bậc $h$ với **hệ số nhỏ** — đủ nhỏ để $r(x_0) = 0$ **over $\mathbb{Z}$** (không chỉ mod $d^u$). Sau đó tìm nghiệm nguyên của $r(x) = 0$.

---

## Xây Dựng Lattice

Để "nhỏ khi evaluated tại $|x| < X$", ta cần $|r(x_0)| \leq hX^h$ — điều này đạt được nếu coefficients $r_i$ thoả $|r_i| \cdot X^i \leq X^h$.

Điều này gợi ý encode đa thức $p_i(x)$ như **vector** trong $\mathbb{Z}^{h+1}$ bằng cách đặt coefficient của $x^j$ vào cột $j+1$, nhân với $X^j = b_0^{j\beta_0}$:

$$
p_i(x) \mapsto \bigl([\text{coeff của } x^0] \cdot X^0,\ [\text{coeff của } x^1] \cdot X^1,\ \ldots,\ [\text{coeff của } x^h] \cdot X^h\bigr)
$$

> [!note] Scheme 3.2 — Lattice Construction cho PACD_L (Ví dụ $h=4, u=2$)
> **Type**: Lattice construction cho PACDP  
> **Setting**: $a_0, b_0$ integers với $a_0 < b_0$; $X = b_0^{\beta_0}$; tham số $h = 4$, $u = 2$
>
> **$\mathsf{BuildLattice}(a_0, b_0, X, h, u)$**
> - Input: $a_0, b_0, X \in \mathbb{Z}$; $h, u \in \mathbb{Z}_{>0}$ với $h \geq u$
> - Xây dựng ma trận $(h+1) \times (h+1)$ có các hàng tương ứng với:
>   - Hàng $i+1$ (với $i = 0\ldots u$): đa thức $p_i(x) = (a_0+x)^{u-i} b_0^i$
>   - Hàng $u+2, \ldots, h+1$: đa thức $(a_0+x)^u \cdot x^j$ với $j = 1, \ldots, h-u$
> - Output: Generator matrix của lattice $\mathcal{L}$

Ma trận tương ứng với $h = 4$, $u = 2$ (mỗi entry $(i,j)$ là coefficient của $x^{j-1}$ trong $p_{i-1}(x)$, scaled bởi $X^{j-1}$):

$$
\begin{pmatrix}
b_0^2 & 0 & 0 & 0 & 0 \\
b_0 a_0 & b_0 X & 0 & 0 & 0 \\
a_0^2 & 2a_0 X & X^2 & 0 & 0 \\
0 & a_0^2 X & 2a_0 X^2 & X^3 & 0 \\
0 & 0 & a_0^2 X^2 & 2a_0 X^3 & X^4
\end{pmatrix}
$$

Hàng 1–3 tương ứng $p_0, p_1, p_2$; hàng 4–5 tương ứng $(a_0+x)^2 \cdot x$ và $(a_0+x)^2 \cdot x^2$ (polynomial multiples).

> [!tip] 💡 Agent note
> Ma trận này là **lower triangular** khi scaled — điều này quan trọng vì cho phép tính determinant dễ dàng bằng tích diagonal entries. Diagonal entries lần lượt là $b_0^2, b_0 X, X^2, X^3, X^4$ (cho $h=4, u=2$).

---

## Tính Định Thức

Với $h+1$ hàng và $h+1$ cột, ma trận trên có dimension $h+1$. Vì scaling mỗi cột $j$ bởi $X^j$, và các đa thức $p_i$ có leading coefficient là tích của powers của $b_0$ và $X$:

> [!abstract] Claim 3.3 — Determinant của Lattice
> Định thức của lattice có hàng tương ứng $p_i(x)$ (scaled bởi $X^j$) là:
>
> $$
> \Delta = X^{h(h+1)/2} \cdot b_0^{u(u+1)/2} = b_0^{u(u+1)/2 + \beta_0 h(h+1)/2}
> $$

**Proof sketch.** Ma trận là lower triangular (sau scaling). Diagonal entries từ hàng $i = 0, \ldots, u$ là $b_0^{u-i} \cdot X^i \cdot [\text{leading coeff của } (a_0+x)^{u-i}]$, và từ hàng $u+1, \ldots, h$ là $X^{u+j}$ với $j = 1, \ldots, h-u$. Tích tất cả diagonal entries cho $\Delta = X^{0+1+\ldots+h} \cdot b_0^{u+(u-1)+\ldots+0} = X^{h(h+1)/2} b_0^{u(u+1)/2}$. Thay $X = b_0^{\beta_0}$: $\Delta = b_0^{\beta_0 h(h+1)/2 + u(u+1)/2}$. $\blacksquare$

---

## Áp Dụng LLL Và Điều Kiện Thành Công

LLL [8] tìm vector ngắn $\mathbf{r} = (r_0, r_1 X, \ldots, r_h X^h)$ trong lattice với:

$$
\|\mathbf{r}\| < c \cdot \Delta^{1/(h+1)}
$$

trong đó $c$ là hằng số LLL asymptotically nhỏ hơn $\Delta^{1/(h+1)}$. Ta bỏ qua $c$ trong phân tích asymptotic.

Vector $\mathbf{r}$ tương ứng với đa thức $r(x) = \sum_{i=0}^{h} r_i x^i$. Với $|x_0| < X$:

$$
|r(x_0)| \leq \sum_{i=0}^h |r_i| X^i = \|\mathbf{r}\|_1 \leq (h+1)\|\mathbf{r}\| \lesssim \Delta^{1/(h+1)}
$$

**Điều kiện để $r(x_0) = 0$ over $\mathbb{Z}$**: Vì $r(x_0) \equiv 0 \pmod{d^u}$ và $d^u > b_0^{\alpha_0 u}$, ta cần:

$$
\Delta^{1/(h+1)} < d^u \approx b_0^{\alpha_0 u}
$$

Tức là:

$$
\frac{1}{h+1}\left(\frac{u(u+1)}{2} + \beta_0 \frac{h(h+1)}{2}\right) < \alpha_0 u
$$

Rút gọn:

$$
u(u+1) + \beta_0 h(h+1) < 2\alpha_0 u(h+1)
$$

$$
\beta_0 < \frac{u(2(h+1)\alpha_0 - (u+1))}{h(h+1)}
$$

---

## Chọn Tham Số Tối Ưu và Bound $\beta_0 < \alpha_0^2$

> [!abstract] Theorem 3.4 — Optimal Parameter Choice và Main Bound
> Với tham số tối ưu $h \approx u/\alpha_0$ (tức $h$ lớn, $u = \lfloor h\alpha_0 \rfloor$), điều kiện $\Delta^{1/(h+1)} < d^u$ tương đương:
>
> $$
> \beta_0 < \alpha_0^2 - \frac{\alpha_0(1-\alpha_0)}{h+1}
> $$
>
> Khi $h \to \infty$ (tức $\varepsilon = \alpha_0(1-\alpha_0)/(h+1) \to 0$):
>
> $$
> \boxed{\beta_0 < \alpha_0^2}
> $$

**Derivation.** Đặt $h = u/\gamma$ và tối ưu hoá bound trên $\beta_0$ theo $\gamma$. Từ bất đẳng thức trên:

$$
\beta_0 < \frac{u(2(h+1)\alpha_0 - (u+1))}{h(h+1)} \approx \frac{2\alpha_0}{h/u} - \frac{u}{h^2} = 2\alpha_0 \gamma - \gamma^2
$$

Tối ưu hoá theo $\gamma$: $\partial/\partial\gamma(2\alpha_0\gamma - \gamma^2) = 2\alpha_0 - 2\gamma = 0 \Rightarrow \gamma = \alpha_0$, tức $h = u/\alpha_0$. Tại điểm tối ưu này:

$$
\beta_0 < 2\alpha_0^2 - \alpha_0^2 = \alpha_0^2
$$

Số hạng sai lệch $\alpha_0(1-\alpha_0)/(h+1)$ biến mất khi $h \to \infty$, nhưng trong thực tế ta chọn $h = \lceil\alpha_0(1-\alpha_0)/\varepsilon\rceil - 1$ để có bound $\beta_0 < \alpha_0^2 - \varepsilon$ với $\varepsilon$ cho trước. $\blacksquare$

---

## Thuật Toán Đầy Đủ: PACD_L

> [!note] Scheme 3.5 — PACD_L: Full Algorithm
> **Type**: PACDP Attack  
> **Setting**: Integers $a_0, b_0$ với $a_0 < b_0$; $\varepsilon, \alpha_0 \in (0,1)$
>
> **$\mathsf{PACD\_L}(a_0, b_0, \varepsilon, \alpha_0)$**
> - Input: $a_0, b_0, \varepsilon, \alpha_0$
> - Đặt $h = \lceil\alpha_0(1-\alpha_0)/\varepsilon\rceil - 1$, $u = \lceil h\alpha_0 \rceil$, $X = b_0^{\alpha_0^2 - \varepsilon}$
> - Step 1: Xây dựng lattice $\mathcal{L}$ từ các đa thức $p_i(x) = (a_0+x)^{u-i}b_0^i$ với $i=0\ldots u$, thêm $(a_0+x)^u \cdot x^j$ với $j=1\ldots h-u$; scale cột $j$ bởi $X^j$
> - Step 2: Chạy LLL trên $\mathcal{L}$; lấy vector ngắn nhất $\mathbf{r} = (r_0, r_1 X, \ldots, r_h X^h)$
> - Step 3: Reconstruct $r(x) = \sum_{i=0}^h r_i x^i$; tìm tất cả nghiệm nguyên $x^*$ của $r(x) = 0$
> - Step 4: Với mỗi nghiệm $x^*$ với $|x^*| < X$, tính $d^* = \gcd(a_0 + x^*, b_0)$; output $d^*$ nếu $d^* > M = b_0^{\alpha_0}$
> - Output: Tất cả $d > M$ thoả mãn, hoặc báo không tồn tại

> [!abstract] Theorem 3.6 — Correctness của PACD_L
> Nếu tồn tại $x_0$ với $|x_0| < X = b_0^{\beta_0}$ và $d > M = b_0^{\alpha_0}$ với $d \mid (a_0+x_0)$ và $d \mid b_0$, và nếu $\beta_0 < \alpha_0^2 - \varepsilon$ với $\varepsilon > 0$, thì PACD_L tìm được $d$ trong thời gian đa thức.

**Proof.** Ta có $r(x_0) \equiv 0 \pmod{d^u}$. Với $h = \lceil\alpha_0(1-\alpha_0)/\varepsilon\rceil - 1$ và $\beta_0 < \alpha_0^2 - \varepsilon$, Theorem 3.4 đảm bảo $\Delta^{1/(h+1)} < d^u$. Do đó $\|\mathbf{r}\| \lesssim \Delta^{1/(h+1)} < d^u$, suy ra $|r(x_0)| < d^u$. Nhưng $r(x_0) \equiv 0 \pmod{d^u}$, nên $r(x_0) = 0$ over $\mathbb{Z}$. Vậy $x_0$ là nghiệm nguyên của $r(x) = 0$, và $d = \gcd(a_0+x_0, b_0)$ được tính ở Step 4. Số lượng nghiệm tối đa là $h$ (bậc của $r$), nên output là đa thức nhiều. $\blacksquare$

---

## So Sánh Với Continued Fraction Bound

Kết quả của hai phương pháp trên plane $(\alpha, \beta)$:

| Phương pháp | Bound $\beta$ | Dạng đường cong | Yêu cầu $\alpha$ |
|------------|---------------|-----------------|-----------------|
| PACD_CF | $\beta < 2\alpha - 1$ | Đường thẳng (âm khi $\alpha < 1/2$) | $\alpha > 1/2$ |
| PACD_L | $\beta < \alpha^2$ | Parabol (dương với mọi $\alpha > 0$) | Bất kỳ $\alpha \in (0,1)$ |

Tại $\alpha = 3/4$: CF cho $\beta < 1/2$; Lattice cho $\beta < 9/16$ — tốt hơn $12.5\%$.  
Tại $\alpha = 1/2$: CF cho $\beta < 0$ (useless); Lattice cho $\beta < 1/4$ — lattice mạnh hơn tuyệt đối.  
Tại $\alpha = 1/4$: CF hoàn toàn thất bại; Lattice cho $\beta < 1/16$ — chỉ lattice hoạt động.

> [!tip] 💡 Agent note
> Bound $\beta < \alpha^2$ đúng chính xác là điều kiện cần để thuật toán **tìm được đa thức $r(x)$ đúng** qua LLL. Trong thực nghiệm (Table 1 của paper), khi chạy với $\alpha = 0.3$ và $h=5, u=1$, thuật toán succeed trong 8 giây — xác nhận bound hoạt động trong practice.

---

## Kết Nối Với Kết Quả Cụ Thể Của Coppersmith

Kết quả nổi tiếng nhất liên quan: **factoring với known high bits of $p$**. Nếu $N = pq$ với $p \sim q \sim \sqrt{N}$ và ta biết approximation $p_0$ của $p$ với $|p_0 - p| < N^{1/4}$, thì có thể recover $p$.

Nhìn theo góc PACDP: $a_0 = p_0$ (xấp xỉ), $b_0 = N$ (biết chính xác), $d = p$ (divisor cần tìm). Ta có $\alpha = \log_N p \approx 1/2$ và $|x_0| = |p_0 - p| < N^{1/4}$, tức $\beta = 1/4$. Điều kiện PACD_L: $\beta < \alpha^2 \approx 1/4$ — **vừa đủ!**

Hơn nữa, paper chú ý rằng kết quả cũng đúng khi $p_0' = kp + x_0$ với **bất kỳ integer $k$** và cùng bound trên $x_0$ — vì PACD_L chỉ cần $d \mid b_0$ và $d \mid (a_0 + x_0)$, không yêu cầu $a_0$ xấp xỉ $p$ trực tiếp.

> [!warning] Okamoto Attack (revisit)
> Với cryptosystem Okamoto [11]: $b_0 = n = p^2 q$, $a_0 = u = a + bpq$, $d = pq$. Ta có $\alpha = \log_n(pq) \approx 1/3$ (vì $pq \sim n^{1/3}$ khi $p \sim q$) và $|x_0| = |a| < \frac{1}{2}\sqrt{pq} \sim n^{1/6}$, tức $\beta \approx 1/6$.  
> Điều kiện PACD_L: $\beta < \alpha^2 \approx 1/9$... Thực ra $a < (1/2)\sqrt{pq}$ nhỏ hơn đáng kể — footnote 1 của paper xác nhận $a$ nhỏ hơn nhiều so với ngưỡng cần thiết. Attack hoạt động tốt.

---

## Summary

- PACDP reformulate thành: tìm **small root $x_0$** của $q_1(x_0) \equiv 0 \pmod{d}$.
- Xây dựng lattice từ đa thức $p_i(x) = (a_0+x)^{u-i}b_0^i$, scale cột $j$ bởi $X^j$.
- Định thức: $\Delta = b_0^{u(u+1)/2 + \beta_0 h(h+1)/2}$.
- LLL cho vector nhỏ $\mathbf{r}$ → đa thức $r(x)$; nếu $\Delta^{1/(h+1)} < d^u$ thì $r(x_0) = 0$ over $\mathbb{Z}$.
- Tối ưu $h \approx u/\alpha_0$ cho **bound $\beta_0 < \alpha_0^2$** — parabol, vượt hẳn CF method.
- PACD_L chạy được với mọi $\alpha \in (0,1)$, không cần $\alpha > 1/2$.

---

## References

- [1] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, Eurocrypt'96 (🟡)
- [5] Howgrave-Graham — *Computational Mathematics Inspired by RSA*, PhD Thesis 1999 (🟡)
- [8] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, 1982 (🔴 Prerequisite)
- [11] Okamoto — *Fast public-key cryptosystem*, Electronics Letters 1986 (🟡)
- [12] Schnorr — *Hierarchy of polynomial time lattice bases reduction*, 1987 (⚪)
