---
title: "09. Lp Spaces"
tags: [math, functional-analysis, lesson-09]
aliases: [Lp Spaces]
created: 2026-03-31
---

> **Prerequisites**: [[08-lebesgue-integration|08. Lebesgue Integration]], [[02-normed-spaces-banach|02. Normed Spaces & Banach Spaces]]
> **Objectives**:
> - Định nghĩa không gian $L^p(\mu)$ và kiểm tra chúng là Banach spaces
> - Chứng minh bất đẳng thức Hölder và Minkowski (dạng tích phân)
> - Hiểu tính đối ngẫu $(L^p)^* \cong L^q$

---

## Motivation / Intuition

Sau khi có tích phân Lebesgue, ta có thể định nghĩa "norm tích phân" cho hàm số — và không gian hàm với norm này chính là không gian $L^p$. Đây là các không gian Banach cực kỳ quan trọng, xuất hiện khắp nơi trong giải tích, PDE, xác suất, và lý thuyết thông tin. Nếu $\ell^p$ là không gian dãy số, thì $L^p$ là "phiên bản liên tục" — tích phân thay thế tổng.

---

## Định nghĩa không gian $L^p$

> [!definition] Definition 9.1 — Không gian $L^p$ ($1 \leq p < \infty$)
> Cho $(\Omega, \mathcal{M}, \mu)$ là không gian đo. Với $1 \leq p < \infty$, định nghĩa:
>
> $$
> \mathcal{L}^p(\mu) = \left\{ f: \Omega \to \mathbb{F} \text{ đo được} : \int_\Omega |f|^p \, d\mu < \infty \right\}
> $$
>
> Đồng nhất các hàm bằng nhau $\mu$-a.e., ta được **không gian $L^p(\mu)$** với **norm $L^p$**:
>
> $$
> \|f\|_p = \left(\int_\Omega |f|^p \, d\mu\right)^{1/p}
> $$

> [!definition] Definition 9.2 — Không gian $L^\infty(\mu)$
>
> $$
> L^\infty(\mu) = \left\{f \text{ đo được} : \|f\|_\infty < \infty\right\}
> $$
>
> với **essential supremum**:
>
> $$
> \|f\|_\infty = \operatorname{ess\,sup}|f| = \inf\{M \geq 0 : |f(x)| \leq M \text{ a.e.}\}
> $$

> [!note] Remark 9.3 — $L^p$ là lớp tương đương
> Vì ta đồng nhất $f \sim g$ khi $f = g$ a.e., các phần tử của $L^p$ là **lớp tương đương** hàm, không phải hàm cụ thể. Điều này cần thiết để $\|f\|_p = 0 \iff f = 0$ (trong $L^p$).

---

## Bất đẳng thức Hölder và Minkowski

> [!theorem] Theorem 9.4 — Bất đẳng thức Hölder (dạng tích phân)
> Cho $1 \leq p \leq \infty$ và $q$ là số Hölder liên hợp ($\frac{1}{p} + \frac{1}{q} = 1$, quy ước $1/\infty = 0$). Nếu $f \in L^p(\mu)$ và $g \in L^q(\mu)$, thì $fg \in L^1(\mu)$ và:
>
> $$
> \int_\Omega |fg| \, d\mu \leq \|f\|_p \cdot \|g\|_q
> $$

**Proof** (cho $1 < p < \infty$). Có thể giả sử $\|f\|_p = \|g\|_q = 1$ (chuẩn hóa). Dùng **Young's inequality**: với $a, b \geq 0$,

$$
ab \leq \frac{a^p}{p} + \frac{b^q}{q}
$$

Áp dụng với $a = |f(x)|$, $b = |g(x)|$:

$$
|f(x)g(x)| \leq \frac{|f(x)|^p}{p} + \frac{|g(x)|^q}{q}
$$

Tích phân hai vế:

$$
\int |fg| \, d\mu \leq \frac{1}{p}\|f\|_p^p + \frac{1}{q}\|g\|_q^q = \frac{1}{p} + \frac{1}{q} = 1 = \|f\|_p \|g\|_q. \quad \blacksquare
$$

> [!theorem] Theorem 9.5 — Bất đẳng thức Minkowski (dạng tích phân)
> Với $1 \leq p \leq \infty$ và $f, g \in L^p(\mu)$:
>
> $$
> \|f + g\|_p \leq \|f\|_p + \|g\|_p
> $$
>
> Đây là bất đẳng thức tam giác cho norm $L^p$, chứng tỏ $L^p$ là không gian chuẩn.

**Proof** (cho $1 < p < \infty$). $\|f+g\|_p^p = \int |f+g|^p = \int |f+g|^{p-1}|f+g|$.

Vì $|f+g| \leq |f| + |g|$:

$$
\|f+g\|_p^p \leq \int |f+g|^{p-1}|f| \, d\mu + \int |f+g|^{p-1}|g| \, d\mu
$$

Áp dụng Hölder cho mỗi tích phân (với $(p-1)q = p$):

$$
\|f+g\|_p^p \leq \||f+g|^{p-1}\|_q \left(\|f\|_p + \|g\|_p\right) = \|f+g\|_p^{p/q}\left(\|f\|_p + \|g\|_p\right)
$$

Chia hai vế cho $\|f+g\|_p^{p/q} = \|f+g\|_p^{p-1}$ (nếu $\|f+g\|_p > 0$). $\blacksquare$

---

## Riesz-Fischer Theorem — $L^p$ là Banach

> [!theorem] Theorem 9.6 — Riesz-Fischer: $L^p$ là không gian Banach
> Với $1 \leq p \leq \infty$, $L^p(\mu)$ là không gian Banach.

**Proof** (cho $1 \leq p < \infty$). Dùng tiêu chuẩn chuỗi (Theorem 2.15): đủ chứng minh mọi chuỗi tuyệt đối hội tụ đều hội tụ trong $L^p$.

Cho $(f_n)$ với $\sum_{n=1}^\infty \|f_n\|_p = M < \infty$. Đặt $g_N = \sum_{n=1}^N |f_n|$ và $g = \sum_{n=1}^\infty |f_n|$.

Theo Minkowski: $\|g_N\|_p \leq M$. Theo MCT: $\|g\|_p^p = \lim_N \|g_N\|_p^p \leq M^p$, nên $g \in L^p$, suy ra $g < \infty$ a.e. Vậy chuỗi $f(x) = \sum_{n=1}^\infty f_n(x)$ hội tụ tuyệt đối a.e.

Đặt $S_N = \sum_{n=1}^N f_n$. Thì $|f - S_N| \leq 2g \in L^p$ (a.e.) và $f - S_N \to 0$ a.e. Theo DCT: $\|f - S_N\|_p \to 0$. $\blacksquare$

---

## Quan hệ giữa các không gian $L^p$

> [!theorem] Theorem 9.7 — Bao hàm của $L^p$ (khi $\mu(\Omega) < \infty$)
> Nếu $\mu(\Omega) < \infty$ (không gian đo hữu hạn) và $1 \leq p \leq q \leq \infty$, thì:
>
> $$
> L^q(\mu) \subseteq L^p(\mu) \quad \text{và} \quad \|f\|_p \leq \mu(\Omega)^{1/p - 1/q} \|f\|_q
> $$

> [!note] Remark 9.8 — Chiều ngược trên $\mathbb{R}$
> Trên $\mathbb{R}$ với Lebesgue measure (không gian đo vô hạn): bao hàm chiều ngược. Ví dụ $f(x) = 1/(1+x^2) \in L^1(\mathbb{R}) \setminus L^\infty$ không đúng, nhưng $f(x) = x^{-1/3}$ gần 0 thuộc $L^1_{\text{loc}}$ nhưng không $L^2_{\text{loc}}$ gần 0... Nói chung $L^p(\mathbb{R})$ và $L^q(\mathbb{R})$ không chứa nhau khi $p \neq q$.

---

## Mật độ (Density) trong $L^p$

> [!theorem] Theorem 9.9 — Tập trù mật trong $L^p$
> Với $1 \leq p < \infty$:
>
> 1. **Simple functions** trù mật trong $L^p(\mu)$.
> 2. Với $\mu$ là Lebesgue measure trên $\mathbb{R}^n$: $C_c(\mathbb{R}^n)$ (hàm liên tục có support compact) trù mật trong $L^p(\mathbb{R}^n)$.
> 3. $C_c^\infty(\mathbb{R}^n)$ (hàm vô hạn lần khả vi có support compact) trù mật trong $L^p(\mathbb{R}^n)$.

> [!note] Remark 9.10 — $L^\infty$ khác biệt
> Trong $L^\infty$: $C_c(\mathbb{R})$ **không** trù mật (closure của $C_c(\mathbb{R})$ trong $\|\cdot\|_\infty$ chỉ là $C_0(\mathbb{R})$ — hàm liên tục triệt tiêu ở vô cùng). Đây là một trong những lý do $L^\infty$ "khó" hơn $L^p$ cho $p < \infty$.

---

## Không gian đối ngẫu của $L^p$

> [!theorem] Theorem 9.11 — Duality: $(L^p)^* \cong L^q$
> Cho $1 < p < \infty$ và $q$ là Hölder liên hợp. Mọi phiếm hàm tuyến tính bị chặn $\Lambda \in (L^p(\mu))^*$ có dạng:
>
> $$
> \Lambda(f) = \int_\Omega fg \, d\mu
> $$
>
> với một $g \in L^q(\mu)$ duy nhất, và $\|\Lambda\|_{(L^p)^*} = \|g\|_q$. Vậy $(L^p)^* \cong L^q$ (đẳng cấu đẳng cự).

**Proof sketch.** Trường hợp $\mu$ sigma-hữu hạn: Định nghĩa đo có dấu $\nu(E) = \Lambda(\mathbf{1}_E)$. Dùng Radon-Nikodym theorem để viết $d\nu = g \, d\mu$ với $g \in L^q$. Kiểm tra $\Lambda(f) = \int fg$ với $f$ simple, rồi mở rộng. $\blacksquare$

> [!example] Example 9.12 — Các trường hợp đặc biệt
>
> | $p$ | $q = p/(p-1)$ | $(L^p)^*$ |
> |-----|---------------|-----------|
> | $1$ | $\infty$ | $(L^1)^* \cong L^\infty$ |
> | $2$ | $2$ | $(L^2)^* \cong L^2$ (Hilbert space — tự đối ngẫu) |
> | $p$ ($1<p<\infty$) | $q$ | $(L^p)^* \cong L^q$ |
> | $\infty$ | $1$ | $(L^\infty)^* \supsetneq L^1$ (không bằng!) |

> [!warning] Counterexample 9.13 — $(L^\infty)^* \neq L^1$
> Không gian $(L^\infty)^*$ lớn hơn $L^1$ — nó còn chứa các "phiếm hàm kỳ dị" như Banach limits, liên quan đến đo finitely additive. Đây là lý do $L^\infty$ **không reflexive** và "khó" hơn các $L^p$ khác.

---

## Tính phân ly của $L^p$

> [!theorem] Theorem 9.14 — $L^p(\mathbb{R}^n)$ là phân ly với $1 \leq p < \infty$
> $L^p(\mathbb{R}^n)$ với Lebesgue measure là không gian Banach **phân ly** (separable): có tập đếm được trù mật (ví dụ: simple functions với hệ số hữu tỉ trên hộp hữu tỉ).
>
> $L^\infty(\mathbb{R}^n)$ **không** phân ly.

---

## SageMath Cheatsheet

```python
import numpy as np
from scipy import integrate

# Kiểm tra bất đẳng thức Hölder: ||fg||_1 <= ||f||_p * ||g||_q
p, q = 3.0, 3/2  # 1/p + 1/q = 1

x = np.linspace(0, 1, 10000)
f = np.sin(np.pi * x)
g = np.cos(np.pi * x / 2)

# Tính ||f||_p, ||g||_q, ||fg||_1
norm_f_p   = np.trapz(np.abs(f)**p, x)**(1/p)
norm_g_q   = np.trapz(np.abs(g)**q, x)**(1/q)
norm_fg_1  = np.trapz(np.abs(f * g), x)

print(f"||f||_{p} = {norm_f_p:.6f}")
print(f"||g||_{q} = {norm_g_q:.6f}")
print(f"||fg||_1  = {norm_fg_1:.6f}")
print(f"Hölder OK: {norm_fg_1:.6f} <= {norm_f_p * norm_g_q:.6f}? {norm_fg_1 <= norm_f_p*norm_g_q + 1e-10}")

# Kiểm tra Minkowski: ||f+g||_p <= ||f||_p + ||g||_p
norm_fg_p  = np.trapz(np.abs(f + g)**p, x)**(1/p)
rhs        = norm_f_p + np.trapz(np.abs(g)**p, x)**(1/p)
print(f"\nMinkowski: ||f+g||_{p} = {norm_fg_p:.6f} <= {rhs:.6f}? {norm_fg_p <= rhs + 1e-10}")

# So sánh norm L^p với p khác nhau cho cùng hàm f
print("\nNorm L^p của f = sin(pi*x) trên [0,1]:")
for p_val in [1, 1.5, 2, 3, 5, 10, 100]:
    n = np.trapz(np.abs(f)**p_val, x)**(1/p_val)
    print(f"  ||f||_{p_val:4.1f} = {n:.6f}")
print(f"  ||f||_inf = {np.max(np.abs(f)):.6f}")
```

---

## Summary / Key Takeaways

- $L^p(\mu)$: không gian hàm đo được với $\|f\|_p = \left(\int |f|^p d\mu\right)^{1/p} < \infty$.
- **Hölder**: $\|fg\|_1 \leq \|f\|_p\|g\|_q$ (với $1/p + 1/q = 1$).
- **Minkowski**: $\|f+g\|_p \leq \|f\|_p + \|g\|_p$ — tính chất tam giác.
- **Riesz-Fischer**: $L^p$ là Banach space với mọi $1 \leq p \leq \infty$.
- **Duality**: $(L^p)^* \cong L^q$ với $1 < p < \infty$; $(L^1)^* \cong L^\infty$; $(L^\infty)^* \supsetneq L^1$.
- $L^p$ ($p < \infty$) phân ly; $L^\infty$ không phân ly.
- $L^2$ đặc biệt: tự đối ngẫu, là không gian Hilbert — chủ đề của bài 10.

---

## References

- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 3.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 7–8.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapters 2–3.
- MIT 18.102, Lectures 9–15.
