---
title: "07. Riemann Integration"
tags: [math, real-analysis, lesson-07]
aliases: [Riemann Integration]
created: 2026-03-28
---

> **Prerequisites**: [[05-continuity|05. Continuity]] — Liên tục, uniform continuity; [[06-differentiation|06. Differentiation]] — MVT, đạo hàm
> **Objectives**:
> - Xây dựng tích phân Riemann-Stieltjes từ Darboux sums
> - Nắm tiêu chuẩn khả tích và các lớp hàm khả tích
> - Chứng minh Fundamental Theorem of Calculus (FTC) hai chiều
> - Hiểu giới hạn của tích phân Riemann — động lực cho Lebesgue
> - Nắm integration by parts và change of variables

---

## Motivation / Intuition

Tích phân Riemann là cách định nghĩa "diện tích dưới đồ thị" một cách nghiêm ngặt: xấp xỉ bằng tổng hữu hạn các hình chữ nhật (Riemann sums), rồi lấy giới hạn khi phân hoạch mịn dần. Nhưng định nghĩa này có giới hạn: hàm Dirichlet $\mathbf{1}_{\mathbb{Q}}$ không khả tích Riemann dù "trông có vẻ đơn giản".

**Riemann-Stieltjes integral** $\int_a^b f\, d\alpha$ tổng quát hóa: thay $dx$ bằng $d\alpha(x)$ với $\alpha$ tăng tùy ý, thống nhất tích phân thông thường ($\alpha(x) = x$) và tổng hữu hạn ($\alpha$ là hàm bậc thang) trong một khung lý thuyết.

Quan trọng hơn, Bài 07 kết thúc phần Classical Analysis và chuẩn bị cho câu hỏi: **khi nào giới hạn điểm của dãy hàm khả tích lại khả tích?** — Câu trả lời đầy đủ đòi hỏi tích phân Lebesgue (Bài 12).

---

## Phân hoạch và Darboux Sums

### Definition

> [!definition] Definition 7.1 — Phân hoạch (Partition)
> Một **phân hoạch** (partition) của $[a,b]$ là tập hữu hạn $P = \{x_0, x_1, \ldots, x_n\}$ với:
>
> $$
> a = x_0 < x_1 < \cdots < x_n = b
> $$
>
> Ký hiệu $\Delta x_i = x_i - x_{i-1}$ và $\|P\| = \max_i \Delta x_i$ là **mesh** (độ mịn) của phân hoạch.
>
> Phân hoạch $Q$ là **refinement** của $P$ nếu $P \subseteq Q$ (thêm điểm).

> [!definition] Definition 7.2 — Darboux Sums
> Cho $f: [a,b] \to \mathbb{R}$ bị chặn và $\alpha: [a,b] \to \mathbb{R}$ đơn điệu tăng. Đặt $\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1})$. Định nghĩa:
>
> $$
> M_i = \sup_{x \in [x_{i-1}, x_i]} f(x), \qquad m_i = \inf_{x \in [x_{i-1}, x_i]} f(x)
> $$
>
> - **Upper Darboux sum**: $U(P, f, \alpha) = \displaystyle\sum_{i=1}^n M_i \,\Delta\alpha_i$
> - **Lower Darboux sum**: $L(P, f, \alpha) = \displaystyle\sum_{i=1}^n m_i \,\Delta\alpha_i$

> [!theorem] Theorem 7.3 — Monotonicity of Darboux Sums
> Với mọi phân hoạch $P$: $L(P, f, \alpha) \leq U(P, f, \alpha)$.
>
> Nếu $Q$ là refinement của $P$: $L(P, f, \alpha) \leq L(Q, f, \alpha) \leq U(Q, f, \alpha) \leq U(P, f, \alpha)$.
>
> Với hai phân hoạch $P_1, P_2$ bất kỳ: $L(P_1, f, \alpha) \leq U(P_2, f, \alpha)$.

**Proof của bất đẳng thức cuối:** Lấy $Q = P_1 \cup P_2$ (common refinement). Thì $L(P_1, f, \alpha) \leq L(Q, f, \alpha) \leq U(Q, f, \alpha) \leq U(P_2, f, \alpha)$. $\blacksquare$

---

## Tích phân Riemann-Stieltjes

### Definition

> [!definition] Definition 7.4 — Upper/Lower Integrals và Khả tích
> Định nghĩa:
>
> $$
> \overline{\int_a^b} f\, d\alpha = \inf_P U(P, f, \alpha), \qquad \underline{\int_a^b} f\, d\alpha = \sup_P L(P, f, \alpha)
> $$
>
> Từ Theorem 7.3: $\underline{\int} f\, d\alpha \leq \overline{\int} f\, d\alpha$ với mọi $f, \alpha$.
>
> Hàm $f$ là **Riemann-Stieltjes khả tích** theo $\alpha$, ký hiệu $f \in \mathcal{R}(\alpha)$, nếu:
>
> $$
> \overline{\int_a^b} f\, d\alpha = \underline{\int_a^b} f\, d\alpha
> $$
>
> Khi đó giá trị chung được gọi là **tích phân Riemann-Stieltjes** $\displaystyle\int_a^b f\, d\alpha$.

### Theorem — Tiêu chuẩn khả tích

> [!theorem] Theorem 7.5 — Tiêu chuẩn Riemann-Stieltjes
> $f \in \mathcal{R}(\alpha)$ trên $[a,b]$ khi và chỉ khi:
>
> $$
> \forall \varepsilon > 0,\; \exists \text{ phân hoạch } P:\; U(P, f, \alpha) - L(P, f, \alpha) < \varepsilon
> $$

**Proof.**
($\Rightarrow$) Nếu $f \in \mathcal{R}(\alpha)$, đặt $I = \int_a^b f\, d\alpha$. Với $\varepsilon > 0$, tồn tại $P_1, P_2$: $U(P_1, f, \alpha) < I + \varepsilon/2$ và $L(P_2, f, \alpha) > I - \varepsilon/2$. Lấy $P = P_1 \cup P_2$.

($\Leftarrow$) Với $\varepsilon > 0$, chọn $P$ thỏa điều kiện. Khi đó $\overline{\int} - \underline{\int} \leq U(P) - L(P) < \varepsilon$. Vì $\varepsilon$ tùy ý: $\overline{\int} = \underline{\int}$. $\blacksquare$

### Theorem — Lớp hàm khả tích

> [!theorem] Theorem 7.6 — Hàm liên tục thì khả tích Riemann-Stieltjes
> Nếu $f$ liên tục trên $[a,b]$ và $\alpha$ đơn điệu tăng, thì $f \in \mathcal{R}(\alpha)$.

**Proof.**
$[a,b]$ compact nên $f$ uniformly continuous (Theorem 5.12). Với $\varepsilon > 0$, tồn tại $\delta > 0$: $|x-y| < \delta \Rightarrow |f(x)-f(y)| < \varepsilon/[\alpha(b)-\alpha(a)]$. Chọn phân hoạch $P$ với $\|P\| < \delta$. Thì:

$$
U(P,f,\alpha) - L(P,f,\alpha) = \sum_i (M_i - m_i)\Delta\alpha_i < \frac{\varepsilon}{\alpha(b)-\alpha(a)} \cdot \sum_i \Delta\alpha_i = \varepsilon \qquad \blacksquare
$$

> [!theorem] Theorem 7.7 — Hàm đơn điệu thì khả tích Riemann
> Nếu $f$ đơn điệu trên $[a,b]$ thì $f \in \mathcal{R}$ (với $\alpha(x) = x$).

> [!theorem] Theorem 7.8 — Lebesgue's Criterion (không chứng minh ở đây)
> Hàm bị chặn $f: [a,b] \to \mathbb{R}$ khả tích Riemann khi và chỉ khi tập điểm gián đoạn của $f$ có **Lebesgue measure zero**.
>
> Hệ quả: hàm liên tục ngoại trừ tập đếm được điểm thì khả tích Riemann.

> [!warning] Counterexample 7.9 — Hàm Dirichlet không khả tích Riemann
> $f(x) = \mathbf{1}_{\mathbb{Q}}(x)$ trên $[0,1]$: Với mọi phân hoạch $P$, $M_i = 1$ và $m_i = 0$ (do $\mathbb{Q}$ và $\mathbb{R}\setminus\mathbb{Q}$ đều dày đặc). Vậy $U(P,f) = 1 \neq 0 = L(P,f)$. Hàm này **không khả tích Riemann** — nhưng sẽ khả tích Lebesgue!

---

## Tính chất của Tích phân

### Theorem

> [!theorem] Theorem 7.10 — Tính chất đại số của $\int f\, d\alpha$
> Giả sử $f, g \in \mathcal{R}(\alpha)$ và $c \in \mathbb{R}$:
>
> 1. **Tuyến tính theo $f$**: $cf + g \in \mathcal{R}(\alpha)$ và $\int (cf+g)\, d\alpha = c\int f\, d\alpha + \int g\, d\alpha$
> 2. **Tuyến tính theo $\alpha$**: $f \in \mathcal{R}(\alpha_1)$ và $f \in \mathcal{R}(\alpha_2)$ $\Rightarrow$ $f \in \mathcal{R}(\alpha_1 + c\alpha_2)$
> 3. **Chia khoảng**: nếu $a < c < b$ thì $f \in \mathcal{R}(\alpha)$ trên $[a,b]$ $\Leftrightarrow$ $f \in \mathcal{R}(\alpha)$ trên $[a,c]$ và $[c,b]$, và:
>
> $$
> \int_a^b f\, d\alpha = \int_a^c f\, d\alpha + \int_c^b f\, d\alpha
> $$
>
> 4. **So sánh**: Nếu $f(x) \leq g(x)$ với mọi $x \in [a,b]$ thì $\int_a^b f\, d\alpha \leq \int_a^b g\, d\alpha$
> 5. **Tích phân của tích**: $f \cdot g \in \mathcal{R}(\alpha)$ (nếu $f, g \in \mathcal{R}(\alpha)$)

### Theorem

> [!theorem] Theorem 7.11 — Integration by Parts
> Nếu $f \in \mathcal{R}(\alpha)$ thì $\alpha \in \mathcal{R}(f)$, và:
>
> $$
> \int_a^b f\, d\alpha + \int_a^b \alpha\, df = f(b)\alpha(b) - f(a)\alpha(a)
> $$

**Proof.**
Xét Riemann-Stieltjes sum của $\int \alpha\, df$ tương ứng với phân hoạch $P = \{x_0, \ldots, x_n\}$:

$$
\sum_i \alpha(t_i)[f(x_i) - f(x_{i-1})]
$$

và sum của $\int f\, d\alpha$:

$$
\sum_i f(t_i)[\alpha(x_i) - \alpha(x_{i-1})]
$$

Cộng hai tổng và dùng tổng Abel (summation by parts) để rút ra $f(b)\alpha(b) - f(a)\alpha(a)$. $\blacksquare$

> [!theorem] Theorem 7.12 — Change of Variables (Substitution)
> Giả sử $\phi: [a,b] \to [c,d]$ khả vi nghiêm ngặt tăng với $\phi(a) = c$, $\phi(b) = d$. Nếu $f \in \mathcal{R}$ trên $[c,d]$ thì:
>
> $$
> \int_a^b f(\phi(t))\,\phi'(t)\, dt = \int_c^d f(x)\, dx
> $$

---

## Fundamental Theorem of Calculus

### Theorem

> [!theorem] Theorem 7.13 — FTC Phần I (Antiderivative $\Rightarrow$ Integral)
> Giả sử $f \in \mathcal{R}$ trên $[a,b]$ và tồn tại $F: [a,b] \to \mathbb{R}$ khả vi với $F' = f$. Thì:
>
> $$
> \int_a^b f(x)\, dx = F(b) - F(a)
> $$

**Proof.**
Với $\varepsilon > 0$, chọn phân hoạch $P$ sao cho $U(P,f) - L(P,f) < \varepsilon$. Áp dụng MVT cho $F$ trên mỗi $[x_{i-1}, x_i]$: tồn tại $t_i \in (x_{i-1}, x_i)$ với $F(x_i) - F(x_{i-1}) = f(t_i)\Delta x_i$. Khi đó:

$$
\sum_i F(x_i) - F(x_{i-1}) = \sum_i f(t_i)\Delta x_i
$$

Vế trái là $F(b) - F(a)$ (telescope). Vế phải là Riemann sum, nằm trong $[L(P,f), U(P,f)]$. Vậy:

$$
\left|\int_a^b f\, dx - [F(b) - F(a)]\right| < \varepsilon
$$

Vì $\varepsilon$ tùy ý, suy ra đẳng thức. $\blacksquare$

> [!theorem] Theorem 7.14 — FTC Phần II (Integral $\Rightarrow$ Antiderivative)
> Giả sử $f \in \mathcal{R}$ trên $[a,b]$. Định nghĩa $F(x) = \displaystyle\int_a^x f(t)\, dt$. Thì:
>
> 1. $F$ liên tục trên $[a,b]$
> 2. Nếu $f$ liên tục tại $x_0 \in [a,b]$ thì $F$ khả vi tại $x_0$ và $F'(x_0) = f(x_0)$

**Proof.**
**(1)** Vì $f$ bị chặn bởi $M$: $|F(x) - F(y)| = \left|\int_y^x f\right| \leq M|x-y|$. Vậy $F$ Lipschitz, do đó liên tục.

**(2)** Với $|h| > 0$ nhỏ:

$$
\frac{F(x_0 + h) - F(x_0)}{h} = \frac{1}{h}\int_{x_0}^{x_0+h} f(t)\, dt
$$

Vì $f$ liên tục tại $x_0$, với $\varepsilon > 0$ tồn tại $\delta > 0$: $|t - x_0| < \delta \Rightarrow |f(t) - f(x_0)| < \varepsilon$. Với $|h| < \delta$:

$$
\left|\frac{F(x_0+h)-F(x_0)}{h} - f(x_0)\right| = \left|\frac{1}{h}\int_{x_0}^{x_0+h} [f(t) - f(x_0)]\, dt\right| \leq \varepsilon \qquad \blacksquare
$$

### Worked Example

> [!example] Example 7.15 — FTC và ứng dụng
>
> **(a)** $\displaystyle\int_0^1 x^2\, dx$: Antiderivative là $F(x) = x^3/3$. FTC I: $F(1) - F(0) = 1/3$.
>
> **(b) Điểm gián đoạn ảnh hưởng đến FTC I**: Xét $f(x) = \text{sign}(x)$ trên $[-1, 1]$. Hàm $F(x) = |x|$ thỏa $F' = f$ ngoại trừ tại $0$. FTC I vẫn cho $\int_{-1}^1 \text{sign}(x)\, dx = F(1) - F(-1) = 1 - 1 = 0$. ✓
>
> **(c) FTC II đòi liên tục**: Hàm $f(x) = \text{sign}(\sin(\pi/x))$ bị chặn và khả tích Riemann, nhưng $F(x) = \int_0^x f$ không khả vi tại $0$ vì $f$ không liên tục tại $0$.

---

## Giới hạn của Tích phân Riemann

> [!warning] Remark 7.16 — Tại sao cần Lebesgue?
>
> **(a) Vấn đề hội tụ**: Cho $f_n(x) = n x^n(1-x)$ trên $[0,1]$. Thì $f_n \to 0$ điểm-điểm nhưng:
>
> $$
> \int_0^1 f_n(x)\, dx = \frac{n}{n+2} \to 1 \neq 0 = \int_0^1 \lim_{n} f_n(x)\, dx
> $$
>
> Tích phân và giới hạn không hoán vị được với hội tụ điểm-điểm thông thường.
>
> **(b) Hàm không khả tích Riemann**: Hàm Dirichlet $\mathbf{1}_{\mathbb{Q}}$ là "đơn giản" (chỉ nhận hai giá trị) nhưng không khả tích Riemann. Tích phân Lebesgue cho $\int_0^1 \mathbf{1}_{\mathbb{Q}}\, d\mu = 0$ (vì $\mathbb{Q}$ có measure zero).
>
> **(c) Improper integrals**: $\int_0^\infty \frac{\sin x}{x}\, dx = \pi/2$ tồn tại theo nghĩa improper nhưng hàm không thuộc $L^1([0,\infty))$ — tích phân Lebesgue không xử lý được.
>
> **Bài học**: Tích phân Riemann đủ cho phần lớn Calculus, nhưng Analysis hiện đại cần Lebesgue để đảm bảo hoán vị giới hạn-tích phân (MCT, DCT — Bài 12).

---

## SageMath Cheatsheet

```python
from sympy import *
import numpy as np

x, t = symbols('x t', real=True)

# Tích phân Riemann-Stieltjes với alpha = x (tích phân Riemann thông thường)
f = x**2
I = integrate(f, (x, 0, 1))
print(f"∫₀¹ x² dx = {I}")   # 1/3

# FTC Part II: tính F(x) = ∫₀ˣ f(t) dt
f_t = t**2
F = integrate(f_t, (t, 0, x))
print(f"F(x) = ∫₀ˣ t² dt = {F}")        # x³/3
print(f"F'(x) = {diff(F, x)}")            # x² = f(x) ✓

# Darboux sums minh họa
def darboux_sums(f_func, a, b, n):
    """Tính upper và lower Darboux sums với n chia đều"""
    xs = np.linspace(a, b, n + 1)
    dx = (b - a) / n
    upper = sum(max(f_func(xs[i]), f_func(xs[i+1])) * dx for i in range(n))
    lower = sum(min(f_func(xs[i]), f_func(xs[i+1])) * dx for i in range(n))
    return lower, upper

f_func = lambda x: x**2
for n in [10, 100, 1000]:
    L, U = darboux_sums(f_func, 0, 1, n)
    print(f"n={n:4d}: L={L:.6f}, U={U:.6f}, gap={U-L:.6f}")

# Hội tụ: n*x^n*(1-x) -> phản ví dụ MCT Riemann
from sympy import Rational
n_sym = symbols('n', positive=True, integer=True)
f_n = n_sym * x**n_sym * (1 - x)
I_n = integrate(f_n, (x, 0, 1))
print(f"∫₀¹ n·xⁿ·(1-x) dx = {simplify(I_n)}")   # n/(n+2) -> 1

# Giới hạn điểm-điểm là 0, nhưng tích phân -> 1
import numpy as np
for n_val in [5, 10, 50, 100]:
    x_pts = np.linspace(0, 1, 1000)
    y = n_val * x_pts**n_val * (1 - x_pts)
    integral_approx = np.trapz(y, x_pts)
    print(f"n={n_val}: ∫f_n ≈ {integral_approx:.4f}")  # tiến đến 1

# Integration by parts: ∫₀¹ x·eˣ dx
# = [x·eˣ]₀¹ - ∫₀¹ eˣ dx = e - (e - 1) = 1
I_parts = integrate(x * exp(x), (x, 0, 1))
print(f"∫₀¹ x·eˣ dx = {I_parts} = {simplify(I_parts)}")  # 1
```

---

## Summary / Key Takeaways

- **Darboux sums**: $L(P,f,\alpha) \leq \underline{\int} \leq \overline{\int} \leq U(P,f,\alpha)$. Khả tích $\Leftrightarrow$ $U - L < \varepsilon$ với phân hoạch đủ mịn.
- **Lớp hàm khả tích**: Liên tục $\Rightarrow$ khả tích. Đơn điệu $\Rightarrow$ khả tích. Lebesgue's criterion: tập gián đoạn có measure zero $\Leftrightarrow$ khả tích.
- **FTC I**: $F' = f$ và $f \in \mathcal{R}$ $\Rightarrow$ $\int_a^b f = F(b) - F(a)$. Chứng minh dùng MVT.
- **FTC II**: $F(x) = \int_a^x f$ liên tục; nếu $f$ liên tục tại $x_0$ thì $F'(x_0) = f(x_0)$.
- **Integration by parts**: $\int f\, d\alpha + \int \alpha\, df = f(b)\alpha(b) - f(a)\alpha(a)$.
- **Giới hạn của Riemann**: không thể hoán vị tích phân và giới hạn điểm-điểm tùy tiện; hàm Dirichlet không khả tích Riemann. $\Rightarrow$ Cần **Lebesgue integration** (Bài 12).

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 6.
- Folland, G. B. *Real Analysis* (2nd ed.), Section 1.1–1.2.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 4.
- Hunter, J. K. *An Introduction to Real Analysis*, Chapter 1 (UC Davis).
