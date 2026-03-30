---
title: "04. Lattice Attack on GACDP"
type: attack
tags: [approximate-gcd, gacdp, lattice, lll, bivariate, heuristic, attack, lesson-04]
aliases: [GACD_L, Lattice GACDP]
source: "Approximate Integer Common Divisors — Nick Howgrave-Graham, CaLC 2001"
created: 2026-03-25
---

> **Prerequisites**: [[01-acdp-framework|01. ACDP Framework]], [[03-lattice-pacdp|03. Lattice Attack on PACDP]], LLL algorithm, resultant của hai đa thức  
> 🔴 **Prerequisite references**: LLL [8]; Coppersmith [1]; Boneh-Durfee [3] (bivariate small inverse problem)  
> **Lesson type**: Attack  
> **Covers**: §4 Using Lattices to Solve GACDP (full bivariate construction, determinant estimation via row norms, optimal γ, existence of GACD_L, Figure 61)
>
> **Notation** (mới trong bài này, kế thừa Lesson 03):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $q_1(x,y)$ | $a_0 + x$ (bivariate nhưng không phụ thuộc $y$) | $q_1(x,y)$ |
> | $q_2(x,y)$ | $b_0 + y$ (bivariate nhưng không phụ thuộc $x$) | $q_2(x,y)$ |
> | $p_i(x,y)$ | $(a_0+x)^{u-i}(b_0+y)^i$, $i = 0 \ldots u$ | $p_i(x,y)$ |
> | $r_1(x,y), r_2(x,y)$ | Hai đa thức nhỏ thu được từ LLL | $r_1, r_2$ |
> | $Y$ | Bound trên $\|y_0\|$; trong equi-sized case $Y = X$ | $Y$ |
> | $m$ | Dimension của lattice GACDP | $m$ |
> | $\gamma$ | Ratio $\gamma = u/h$ dùng để tối ưu hoá $\beta_0$ | $\gamma$ |
> | $\delta$ | Exponent trong biểu thức $\Delta = b_0^\delta$ | $\delta$ |

---

## Motivation: Từ Univariate Đến Bivariate

[[03-lattice-pacdp|Lesson 03]] giải PACDP bằng cách tìm **một** small root $x_0$ của đa thức một biến $r(x)$. Trong GACDP, cả $a_0$ và $b_0$ đều chỉ là xấp xỉ: ta tìm đồng thời $(x_0, y_0)$ nhỏ sao cho $d \mid (a_0 + x_0)$ và $d \mid (b_0 + y_0)$.

Điều này dẫn đến **đa thức hai biến** (bivariate polynomials) và một lattice phức tạp hơn nhiều. Khó khăn mới xuất hiện ở hai mặt:

1. **Algebraic independence**: LLL cho một vector nhỏ, nhưng một đa thức hai biến $r_1(x,y) = 0$ không đủ để xác định $(x_0, y_0)$ — cần **hai** đa thức algebraically independent.
2. **Determinant**: Lattice sinh bởi đa thức hai biến là ma trận **không vuông** (non-square) → không có công thức determinant đơn giản.

Paper giải quyết vấn đề (2) bằng kỹ thuật row-norm estimation thông minh, và vấn đề (1) bằng heuristic assumption.

---

## Reformulation: GACDP Là Bài Toán Bivariate Small Root

Với equi-sized $a_0 \sim b_0$ và $d > M = b_0^{\alpha_0}$:

$$
q_1(x,y) = a_0 + x, \quad q_2(x,y) = b_0 + y
$$

Ta cần tìm $(x_0, y_0)$ với $|x_0|, |y_0| < X = b_0^{\beta_0}$ sao cho $d^u \mid p_i(x_0, y_0)$ với:

$$
p_i(x,y) = (a_0 + x)^{u-i}(b_0 + y)^i, \quad i = 0, 1, \ldots, u
$$

> [!note] Observation 4.1 — Extended Module Structure
> Với $r(x,y) = \sum_{i} u_i(x,y) p_i(x,y)$, ta có $r(x_0, y_0) \equiv 0 \pmod{d^u}$.
>
> Trong GACDP, ta có thể nhân mỗi $p_i(x,y)$ thêm bởi $x^j$ với $j = 0, \ldots, h-u$ **mà không tạo ra linear dependency**. Điều này cho thêm $(h-u)$ rows trong lattice so với PACDP.  
> Tuy nhiên, không thể nhân bởi $y^j$ mà không mất linear independence (vì $(b_0+y)^u$ tạo ra dependencies với các $p_i$ khi $y$ chạy tự do).

---

## Lattice Cho GACDP

> [!note] Scheme 4.2 — Bivariate Lattice Construction (Ví dụ $h=4, u=2$)
> **Type**: Bivariate lattice cho GACDP  
> **Setting**: $a_0 \sim b_0$, $X = Y = b_0^{\beta_0}$; tham số $h=4$, $u=2$
>
> **$\mathsf{BuildBivariateLattice}(a_0, b_0, X, Y, h, u)$**
> - Input: $a_0, b_0, X, Y$; $h, u$
> - Columns indexed bởi monomials $x^s y^t$ với $s + t \leq h$, theo thứ tự lexicographic; scale cột $(s,t)$ bởi $X^s Y^t$
> - Row groups:
>   - **Group A** ($t = 0$): $(a_0+x)^s$ với $s = u, u+1, \ldots, h$ — tương đương nhân $p_0 = (a_0+x)^u$ bởi $x^j$
>   - **Group B** ($0 < t \leq u$): $(a_0+x)^{u-t}(b_0+y)^t \cdot x^j$ với $j = 0, \ldots, h-u$
>   - **Group C** ($t > u$): $(b_0+y)^t \cdot x^j$ — chỉ valid khi $t \leq h$ và không tạo dependency
> - Output: Generator matrix của lattice $\mathcal{L}_{biv}$

Ma trận đầy đủ với $h=4, u=2$ được paper liệt kê (rút gọn để dễ đọc):

$$
\begin{pmatrix}
a_0^2 & 2a_0 X & X^2 & 0 & 0 & \cdots \\
0 & a_0^2 X & 2a_0 X^2 & X^3 & 0 & \cdots \\
0 & 0 & a_0^2 X^2 & 2a_0 X^3 & X^4 & \cdots \\
a_0 b_0 & b_0 X & 0 & 0 & a_0 Y & XY & \cdots \\
\vdots & & & & & & \ddots
\end{pmatrix}
$$

Dimension của lattice: $m = (h+1-u)(h+u+2)/2$.

---

## Kỹ Thuật Ước Lượng Định Thức Qua Row Norms

Vì ma trận là **non-square** (nhiều cột hơn hàng thực tế được dùng trong basis), paper dùng kỹ thuật sau để ước lượng $\Delta$:

> [!abstract] Lemma 4.3 — Row Norm Estimation qua Non-integral Row Operations
> Với polynomial $p_i(x,y) = (a_0+x)^s(b_0+y)^t$, ta có thể thực hiện **non-integral row operations** (không thay đổi $\Delta$, chỉ thay đổi basis) để bound norm của mỗi row:
>
> Vì $a_0 \sim b_0$, viết $(b_0+y) = y - (b_0/a_0)x + (b_0/a_0)(a_0+x)$. Thực hiện row operation lấy $(a_0/b_0)$ lần row $(a_0+x)^{s+1}$ trừ khỏi row $(a_0+x)^s(b_0+y)$:
>
> $$
> (a_0+x)^s(b_0+y) \longrightarrow (a_0+x)^s\!\left(y - \frac{b_0}{a_0}x\right) + \frac{a_0}{b_0}(a_0+x)^{s+1}
> $$
>
> Row mới có norm **bị chặn bởi $b_0 X$** (thay vì $b_0^2$ như bound naïve) — cải thiện đáng kể.

**Quy tắc tổng quát** (paper §4): vector tương ứng polynomial $(a_0+x)^s(b_0+y)^t$ đóng góp vào $\Delta$:

$$
X^{s+t-u} Y^t b_0^{u-t} \quad \text{khi } 0 \leq t \leq u
$$

$$
X^s Y^t \quad \text{khi } u < t \leq h
$$

---

## Tính Định Thức Đầy Đủ

Từ quy tắc trên, tổng hợp contribution của tất cả rows:

> [!abstract] Claim 4.4 — Determinant của Bivariate Lattice
> Định thức của lattice $\mathcal{L}_{biv}$ với $m = (h+1-u)(h+u+2)/2$ thoả mãn:
>
> $$
> \Delta = Y^{(h+1-u)(h(h+u+2)+u(u+1))/6} \cdot b_0^{u(u+1)(h+1-u)/2} \cdot X^{(h-u)(h+1-u)(h+2u+2)/6} = b_0^{\delta}
> $$
>
> trong đó $\delta = u(u+1)(h+1-u)/2 + \beta_0(h+1-u)(2h^2+4h+2uh-u^2-u)/6$.

**Proof sketch.** Bằng cách apply các non-integral row operations để đưa về dạng "gần triangular" và tính tích norm các rows (bound trên $\Delta$). Xem paper §4 cho computation chi tiết. $\square$

---

## Điều Kiện Thành Công và Tối Ưu Hoá

LLL đảm bảo tìm vector $\mathbf{r}$ với $\|\mathbf{r}\| \lesssim \Delta^{1/m}$. Để đa thức $r_1(x,y)$ (tương ứng $\mathbf{r}$) có $r_1(x_0, y_0) = 0$ over $\mathbb{Z}$, cần $\Delta^{1/m} < d^u$, tức $\delta < m\alpha_0 u$.

Sau algebra (xem paper §4), viết dưới dạng bound trên $\beta_0$:

$$
\beta_0 < \frac{3u(h+u+2)\alpha_0 - 3u(u+1)}{2h(h+u+2) - u(u+1)} - \frac{3u(h-u)(2h-u\alpha_0)}{(2h(h+u)-u^2)(2h(h+u+2)-u(u+1))}
$$

Đặt $h = u/\gamma$ và tối ưu hoá theo $\gamma$:

> [!abstract] Theorem 4.5 — Optimal Bound cho GACD_L
> Với lựa chọn tối ưu:
>
> $$
> \gamma^* = \frac{2 - 2\alpha_0 - \sqrt{4 - 4\alpha_0 - 2\alpha_0^2}}{3\alpha_0 - 2}
> $$
>
> ta đạt bound:
>
> $$
> \boxed{\beta_0 < 1 - \frac{1}{2}\alpha_0 - \sqrt{1 - \alpha_0 - \frac{1}{2}\alpha_0^2} - \varepsilon(h, \alpha_0)}
> $$
>
> trong đó $\varepsilon(h, \alpha_0) \to 0$ khi $h \to \infty$. Điều này chứng minh sự tồn tại của thuật toán GACD_L.

**Tại sao bound này cao hơn PACDP?** Vì trong GACDP ta có thêm $y_0$ như một biến tự do, lattice có nhiều rows hơn, determinant lớn hơn — nhưng $m$ (dimension) cũng lớn hơn. Tỷ lệ $\Delta^{1/m}$ cuối cùng cho bound tốt hơn theo một chiều (có thể giải được với $\alpha_0 < 1/2$) nhưng với curve phức tạp hơn.

---

## Heuristic Assumption và Tại Sao Không Prove Được

Sau khi có $r_1(x_0, y_0) = 0$ over $\mathbb{Z}$, ta cần thêm **một đa thức độc lập nữa** để xác định $(x_0, y_0)$. LLL cho **hai** vector ngắn trong lattice → hai đa thức $r_1, r_2$. Nếu chúng algebraically independent, ta dùng resultant:

$$
\mathrm{Res}_x(r_1, r_2) = 0 \quad \text{cho phương trình chỉ theo } y
$$

rồi giải và substitute ngược để tìm $x_0$.

> [!warning] Heuristic: Algebraic Independence Không Prove Được
> Paper thừa nhận: **không thể prove** rằng LLL luôn cho hai vectors tương ứng với hai polynomials algebraically independent.
>
> Manders & Adleman [9] chứng minh không có giải pháp tổng quát cho bivariate modular equations → không thể có proof tổng quát cho bước này.
>
> **Tuy nhiên**: kết quả thực nghiệm trong Table 1 (α từ 0.2 đến 0.6, hàng trăm instances) không có trường hợp nào thất bại. Đây là lý do phương pháp được tin tưởng là correct trong practice.

> [!tip] 💡 Agent note
> Đây là cùng dạng "proof of algebraic independence" problem mà Boneh-Durfee [3] gặp phải trong cryptanalysis of RSA với $d < N^{0.292}$. Đây là một open problem nổi tiếng trong lattice theory: liệu có thể prove algebraic independence của LLL output không?

---

## Thuật Toán Đầy Đủ: GACD_L

> [!note] Scheme 4.6 — GACD_L: Full Algorithm
> **Type**: GACDP Attack (heuristic)  
> **Setting**: $a_0 \sim b_0$, $a_0 < b_0$; $\varepsilon, \alpha_0 \in (0\ldots 2/3)$
>
> **$\mathsf{GACD\_L}(a_0, b_0, \varepsilon, \alpha_0)$**
> - Input: $a_0, b_0, \varepsilon, \alpha_0$
> - Tính $\gamma^* = (2-2\alpha_0 - \sqrt{4-4\alpha_0-2\alpha_0^2})/(3\alpha_0-2)$; đặt $h$ đủ lớn, $u = \lfloor h\gamma^* \rfloor$
> - Đặt $X = Y = b_0^{\beta_0}$ với $\beta_0$ từ Theorem 4.5
> - Step 1: Xây dựng bivariate lattice $\mathcal{L}_{biv}$ từ $p_i(x,y)$ (Scheme 4.2)
> - Step 2: Chạy LLL; lấy **hai** vector ngắn $\mathbf{r}_1, \mathbf{r}_2$ → hai đa thức $r_1(x,y), r_2(x,y)$
> - Step 3: **(Heuristic)** Giả sử $r_1, r_2$ algebraically independent; tính $\mathrm{Res}_x(r_1, r_2)$ → đa thức theo $y$ duy nhất; tìm nghiệm $y^*$
> - Step 4: Substitute $y = y^*$ vào $r_1(x, y^*)$; tìm nghiệm $x^*$
> - Step 5: Tính $d^* = \gcd(a_0 + x^*, b_0 + y^*)$; output $d^*$ nếu $d^* > M = b_0^{\alpha_0}$
> - Output: Tất cả $d > M$ thoả mãn, hoặc "unlikely to exist"

> [!warning] Constraint $\alpha_0 < 2/3$
> Khi $\alpha_0 \geq 2/3$, số lượng solutions $(x_0, y_0)$ thoả mãn điều kiện là **exponential** trong kích thước input (xem §2 của paper). Lattice method về nguyên tắc không thể enumerate exponentially nhiều solutions → GACD_L chỉ defined với $\alpha_0 < 2/3$.

---

## Figure 61: Toàn Cảnh Bốn Bounds

Paper §6 tổng hợp bốn bounds thành một hình (Figure 61). Trên plane $(\alpha, \beta)$:

```text
β
1 |                                         /
  |                                        /  <- PACD_L: beta = alpha^2
  |                                      /
0.5|                          __-------
  |                     __--/   <- GACD_L: beta = 1 - alpha/2 - sqrt(...)
  |               __--/
  |          __--/        <- GACD_CF: beta = min(2alpha-1, 1-alpha)
0 |_________/____________/________________________
  0        0.5   2/3    1      alpha
           ^
      PACD_CF: beta = 2alpha-1
      (chi duong khi alpha > 1/2)
```

Bốn đường:

| Đường | Thuật toán | Dạng |
|-------|-----------|------|
| $\beta = \alpha^2$ | **PACD_L** — top bound | Parabol, luôn dương |
| $\beta = 1 - \frac{\alpha}{2} - \sqrt{1-\alpha-\frac{\alpha^2}{2}}$ | **GACD_L** — curved | Curve nằm giữa |
| $\beta = \max(2\alpha-1, 1-\alpha)$ | GACD_CF | Gãy tại $\alpha=2/3$ |
| $\beta = 2\alpha - 1$ | PACD_CF | Thẳng, chỉ dương khi $\alpha>1/2$ |

> [!tip] 💡 Agent note
> PACD_L cho bound **cao nhất** vì khi $b_0$ biết chính xác, ta không có sai số $y_0$ — lattice chỉ cần handle một chiều sai số, determinant nhỏ hơn, bound tốt hơn. Paradoxically, biết nhiều thông tin hơn (b_0 chính xác) giúp giải bài toán dễ hơn đáng kể.

---

## Kết Quả Thực Nghiệm (Table 1 của Paper)

Paper báo cáo kết quả thực nghiệm với 1024-bit numbers, chạy trên Pentium II 700MHz, software C++ + NTL [13]:

| Bits của $d$ | $\alpha$ | $\beta_{max}$ | $h$ | $u$ | Thời gian | Bits sai số quan sát |
|-------------|---------|--------------|-----|-----|-----------|---------------------|
| 205 | 0.2 | 0.016 | 10 | 1 | 731s | 5 |
| 307 | 0.3 | 0.041 | 5–7 | 1 | 8–43s | 15–22 |
| 410 | 0.4 | 0.079 | 4–7 | 1–2 | 2–197s | 43–56 |
| 512 | 0.5 | 0.137 | 4–6 | 2–3 | 9–261s | 103–113 |
| 614 | 0.6 | 0.231 | 4–6 | 3–4 | 18–507s | 207–216 |

Cột $\delta$ (ratio giữa norm vector thu được và Minkowski bound) luôn gần 1 — xác nhận không có sublattice nào tốt hơn bị bỏ qua.

> [!success] Zero Failures
> Trong tất cả experiments, **không có trường hợp nào** mà hai vectors LLL cho polynomials algebraically dependent. Algebraic independence heuristic được xác nhận hoàn toàn trong practice.

---

## Summary

- GACDP dẫn đến **bivariate polynomials** $p_i(x,y) = (a_0+x)^{u-i}(b_0+y)^i$.
- Lattice dimension: $m = (h+1-u)(h+u+2)/2$ — lớn hơn univariate ($h+1$).
- Determinant ước lượng bằng **row-norm product** sau non-integral row operations; row tương ứng $(a_0+x)^s(b_0+y)^t$ đóng góp $X^{s+t-u}Y^t b_0^{u-t}$ (với $t \leq u$).
- Optimal $\gamma^* = (2-2\alpha_0-\sqrt{4-4\alpha_0-2\alpha_0^2})/(3\alpha_0-2)$ → bound:

$$
\beta_0 < 1 - \frac{\alpha_0}{2} - \sqrt{1 - \alpha_0 - \frac{\alpha_0^2}{2}}
$$

- **Heuristic**: giả định hai LLL vectors → polynomials algebraically independent → dùng resultant.
- Constraint $\alpha_0 < 2/3$: trên ngưỡng này số solutions là exponential.
- Kết quả thực nghiệm (Table 1): 0 failures, thời gian đa thức, norm ratio ≈ 1.

---

## References

- [1] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, Eurocrypt'96 (🟡)
- [3] Boneh & Durfee — *Cryptanalysis of RSA with $d < N^{0.292}$*, IEEE Trans. 2000 (🟡 — xem Lesson 05)
- [8] Lenstra, Lenstra, Lovász — *LLL algorithm*, 1982 (🔴 Prerequisite)
- [9] Manders & Adleman — *NP-complete decision problem for quadratics*, JCSS 1978 (⚪)
- [13] Shoup — NTL Library (⚪)
