---
title: "13. Lᵖ Spaces"
tags: [math, real-analysis, lesson-13]
aliases: [Lp Spaces]
created: 2026-03-28
---

> **Prerequisites**: [[12-lebesgue-integration|12. Lebesgue Integration]] — Tích phân Lebesgue, $L^1$; [[03-metric-spaces|03. Metric Spaces]] — Normed spaces (trực giác)
> **Objectives**:
> - Định nghĩa $L^p$ spaces và chuẩn $\|\cdot\|_p$
> - Chứng minh Hölder's inequality và Minkowski's inequality
> - Hiểu $L^p$ là Banach space (Riesz-Fischer Theorem)
> - Nắm duality: $(L^p)^* \cong L^q$ với $1/p + 1/q = 1$
> - Hiểu quan hệ giữa các $L^p$ spaces và ứng dụng

---

## Motivation / Intuition

Trong Bài 08, không gian $C(K)$ với chuẩn $\sup$ là công cụ tự nhiên để nghiên cứu hàm liên tục. Nhưng với hàm khả tích Lebesgue, chuẩn $\sup$ không phù hợp (hàm có thể bằng $\infty$ tại một điểm mà vẫn khả tích).

**$L^p$ spaces** là không gian tự nhiên cho tích phân: $\|f\|_p = \left(\int |f|^p\, d\mu\right)^{1/p}$ đo "kích cỡ" trung bình của hàm. Trường hợp $p = 2$ đặc biệt quan trọng: $L^2$ là không gian Hilbert, nền tảng của cơ học lượng tử, tín hiệu số, và chuỗi Fourier.

$L^p$ spaces là ví dụ chuẩn của Banach spaces — không gian vector chuẩn hoàn chỉnh. Sự hoàn chỉnh (Riesz-Fischer) là điều mà không gian Riemann-tích phân thiếu.

---

## Định nghĩa $L^p$

### Definition

> [!definition] Definition 13.1 — $L^p$ Space
> Cho $(X, \mathcal{M}, \mu)$ measure space và $1 \leq p < \infty$. Định nghĩa:
>
> $$
> \mathcal{L}^p(\mu) = \left\{f: X \to \mathbb{R} \text{ đo được} \;\middle|\; \int |f|^p\, d\mu < \infty\right\}
> $$
>
> **$L^p$ norm**:
>
> $$
> \|f\|_p = \left(\int |f|^p\, d\mu\right)^{1/p}
> $$
>
> **$L^p$ space** là tập các lớp tương đương của $\mathcal{L}^p(\mu)$ theo quan hệ $f \sim g \Leftrightarrow f = g$ a.e.:
>
> $$
> L^p(\mu) = \mathcal{L}^p(\mu) / \!\sim
> $$

> [!definition] Definition 13.2 — $L^\infty$ Space
> $$
> \|f\|_\infty = \operatorname{ess\,sup}|f| = \inf\{M \geq 0 \mid \mu(\{|f| > M\}) = 0\}
> $$
>
> $$
> L^\infty(\mu) = \{f \text{ đo được} \mid \|f\|_\infty < \infty\} / \!\sim
> $$
>
> $\|f\|_\infty$ là "cận trên cốt yếu" (essential supremum) — supremum sau khi bỏ đi tập measure zero.

> [!note] Remark 13.3 — Tại sao dùng lớp tương đương?
> $\|\cdot\|_p$ không phải là chuẩn trên $\mathcal{L}^p$: $\|f\|_p = 0$ không kéo theo $f = 0$, mà chỉ $f = 0$ a.e. Khi dùng lớp tương đương, $\|[f]\|_p = 0 \Rightarrow [f] = [0]$. Trong thực tế, ta thường viết $f$ thay vì $[f]$ khi không gây nhầm lẫn.

---

## Hölder's Inequality

### Theorem

> [!theorem] Theorem 13.4 — Hölder's Inequality
> Cho $1 \leq p \leq \infty$ và $q$ là **conjugate exponent** với $\dfrac{1}{p} + \dfrac{1}{q} = 1$ (quy ước: $q = \infty$ khi $p = 1$, và ngược lại). Nếu $f \in L^p$ và $g \in L^q$, thì $fg \in L^1$ và:
>
> $$
> \int |fg|\, d\mu \leq \|f\|_p \cdot \|g\|_q
> $$

**Proof (trường hợp $1 < p < \infty$).**
WLOG $\|f\|_p = \|g\|_q = 1$ (chia cả hai vế cho tích). Dùng **Young's inequality**: với $a, b \geq 0$:

$$
ab \leq \frac{a^p}{p} + \frac{b^q}{q}
$$

(vì $\ln$ là hàm lõm: $\ln(ab) = \ln a + \ln b = \frac{1}{p}\ln(a^p) + \frac{1}{q}\ln(b^q) \leq \ln\!\left(\frac{a^p}{p} + \frac{b^q}{q}\right)$).

Áp dụng với $a = |f(x)|$, $b = |g(x)|$:

$$
\int |f||g|\, d\mu \leq \int \left(\frac{|f|^p}{p} + \frac{|g|^q}{q}\right)d\mu = \frac{\|f\|_p^p}{p} + \frac{\|g\|_q^q}{q} = \frac{1}{p} + \frac{1}{q} = 1 = \|f\|_p \|g\|_q \qquad \blacksquare
$$

> [!corollary] Corollary 13.5 — Cauchy-Schwarz là trường hợp đặc biệt
> Với $p = q = 2$:
>
> $$
> \int |fg|\, d\mu \leq \|f\|_2 \cdot \|g\|_2
> $$
>
> Đây chính là **Cauchy-Schwarz inequality** cho tích phân.

### Worked Example

> [!example] Example 13.6 — Áp dụng Hölder
>
> **(a)** $f \in L^2([0,1])$ thì $f \in L^1([0,1])$:
>
> $$
> \|f\|_1 = \int_0^1 |f| \cdot 1\, dx \leq \|f\|_2 \cdot \|1\|_2 = \|f\|_2 \cdot 1 = \|f\|_2
> $$
>
> (Hölder với $p = 2$, $q = 2$, $g \equiv 1$.)
>
> **(b)** Nếu $\mu(X) < \infty$ thì $L^p \subseteq L^q$ với $p \geq q$: Hölder cho $\|f\|_q \leq \mu(X)^{1/q - 1/p} \|f\|_p$.

---

## Minkowski's Inequality

### Theorem

> [!theorem] Theorem 13.7 — Minkowski's Inequality (Triangle inequality for $L^p$)
> Với $1 \leq p \leq \infty$, nếu $f, g \in L^p$ thì $f + g \in L^p$ và:
>
> $$
> \|f + g\|_p \leq \|f\|_p + \|g\|_p
> $$

**Proof ($1 < p < \infty$).**
Viết $|f+g|^p \leq |f+g|^{p-1}(|f| + |g|)$. Tích phân:

$$
\|f+g\|_p^p \leq \int |f+g|^{p-1}|f|\, d\mu + \int |f+g|^{p-1}|g|\, d\mu
$$

Áp dụng Hölder với $|f+g|^{p-1} \in L^q$ (vì $(p-1)q = p$) và $|f|, |g| \in L^p$:

$$
\|f+g\|_p^p \leq \|f+g\|_p^{p-1}\left(\|f\|_p + \|g\|_p\right)
$$

Chia hai vế cho $\|f+g\|_p^{p-1}$ (nếu $\neq 0$). $\blacksquare$

> [!note] Remark 13.8
> Minkowski's inequality chính là **bất đẳng thức tam giác** trong không gian $L^p$, xác nhận $\|\cdot\|_p$ là chuẩn thực sự (sau khi dùng lớp tương đương).

---

## $L^p$ là Banach Space

### Theorem

> [!theorem] Theorem 13.9 — Riesz-Fischer Theorem
> Với $1 \leq p \leq \infty$, không gian $L^p(\mu)$ là **Banach space** (không gian vector chuẩn hoàn chỉnh): mọi dãy Cauchy trong $L^p$ đều hội tụ trong $L^p$.

**Proof ($1 \leq p < \infty$, sketch).**
Cho $(f_n)$ Cauchy trong $L^p$: với mọi $k$, tồn tại $n_k$ sao cho $\|f_{n_k} - f_{n_{k+1}}\|_p < 1/2^k$.

**Bước 1**: Đặt $g = \sum_{k=1}^\infty |f_{n_{k+1}} - f_{n_k}|$. Theo Minkowski:

$$
\left\|\sum_{k=1}^N |f_{n_{k+1}} - f_{n_k}|\right\|_p \leq \sum_{k=1}^N \frac{1}{2^k} < 1
$$

MCT cho $g \in L^p$ (và $g < \infty$ a.e.).

**Bước 2**: Chuỗi $f_{n_1} + \sum_k (f_{n_{k+1}} - f_{n_k})$ hội tụ tuyệt đối a.e. (vì $g < \infty$ a.e.). Đặt $f$ là giới hạn. Khi đó $f_{n_k} \to f$ a.e.

**Bước 3**: DCT (dominated bởi $|f_{n_1}| + g \in L^p$) cho $\|f_{n_k} - f\|_p \to 0$. Vì $(f_n)$ Cauchy và có dãy con hội tụ: $f_n \to f$ trong $L^p$. $\blacksquare$

> [!theorem] Theorem 13.10 — Dense subsets of $L^p$
> Với $1 \leq p < \infty$:
>
> 1. **Simple functions** dày đặc trong $L^p$
> 2. **$C_c(\mathbb{R}^n)$** (hàm liên tục có support compact) dày đặc trong $L^p(\mathbb{R}^n)$
> 3. **Đa thức** dày đặc trong $L^p([a,b])$ (Stone-Weierstrass + Hölder)

---

## $L^2$ và Không gian Hilbert

### Definition

> [!definition] Definition 13.11 — Inner Product trên $L^2$
> Trên $L^2(\mu)$, định nghĩa:
>
> $$
> \langle f, g \rangle = \int f\overline{g}\, d\mu
> $$
>
> Khi đó $\|f\|_2 = \sqrt{\langle f, f \rangle}$ và $(L^2, \langle \cdot, \cdot \rangle)$ là **không gian Hilbert** (inner product space hoàn chỉnh).

> [!theorem] Theorem 13.12 — Parseval's Identity
> Nếu $\{e_n\}$ là **orthonormal basis** (ONB) của $L^2$ (tức $\langle e_m, e_n \rangle = \delta_{mn}$ và $\{e_n\}$ sinh ra $L^2$), thì với mọi $f \in L^2$:
>
> $$
> f = \sum_n \langle f, e_n \rangle e_n \quad \text{(hội tụ trong } L^2\text{)}
> $$
>
> $$
> \|f\|_2^2 = \sum_n |\langle f, e_n \rangle|^2 \quad \text{(Parseval's identity)}
> $$

> [!example] Example 13.13 — ONB chuẩn trong $L^2([0,1])$
> Hệ $\{e^{2\pi i n x}\}_{n \in \mathbb{Z}}$ là ONB của $L^2([0,1])$. Hệ số Fourier $\hat{f}(n) = \langle f, e^{2\pi inx} \rangle = \int_0^1 f(x) e^{-2\pi inx}\, dx$. Parseval: $\sum_n |\hat{f}(n)|^2 = \|f\|_2^2$.

---

## Duality: $(L^p)^* \cong L^q$

### Theorem

> [!theorem] Theorem 13.14 — Duality of $L^p$ Spaces
> Cho $1 < p < \infty$ và $1/p + 1/q = 1$. Mọi **bounded linear functional** $\Lambda: L^p(\mu) \to \mathbb{R}$ có dạng:
>
> $$
> \Lambda(f) = \int f g\, d\mu \quad \text{với một } g \in L^q(\mu) \text{ duy nhất}
> $$
>
> Hơn nữa $\|\Lambda\| = \|g\|_q$. Vậy $(L^p)^* \cong L^q$ (đẳng cấu isometric).

> [!warning] Remark 13.15 — Các trường hợp đặc biệt
> - $p = 2$: $(L^2)^* \cong L^2$ — $L^2$ là không gian Hilbert tự đối ngẫu.
> - $p = 1$: $(L^1)^* \cong L^\infty$ (đúng khi $\mu$ là $\sigma$-finite).
> - $p = \infty$: $(L^\infty)^*$ **không** đẳng cấu với $L^1$ tổng quát — đây là một trong những điểm bất đối xứng của $L^\infty$.

---

## Quan hệ giữa các $L^p$ Spaces

### Theorem

> [!theorem] Theorem 13.16 — Inclusion và Interpolation
>
> **(a) Tập measure hữu hạn**: Nếu $\mu(X) < \infty$ và $1 \leq p \leq q \leq \infty$:
>
> $$
> L^\infty \subseteq L^q \subseteq L^p \subseteq L^1
> $$
>
> và $\|f\|_p \leq \mu(X)^{1/p - 1/q} \|f\|_q$.
>
> **(b) $\mathbb{R}^n$ (counting measure)**: Nếu $1 \leq p \leq q \leq \infty$:
>
> $$
> \ell^p \subseteq \ell^q \quad \text{(ngược chiều với trường hợp hữu hạn!)}
> $$

### Worked Example

> [!example] Example 13.17 — So sánh các chuẩn $L^p$
>
> **(a)** $f(x) = x^{-1/2}$ trên $[0,1]$:
>
> - $\|f\|_1 = \int_0^1 x^{-1/2}\, dx = 2 < \infty$ → $f \in L^1$
> - $\|f\|_2 = \left(\int_0^1 x^{-1}\, dx\right)^{1/2} = \infty$ → $f \notin L^2$
>
> **(b)** $f(x) = (1+x)^{-1}$ trên $[0, \infty)$:
>
> - $\|f\|_1 = \int_0^\infty (1+x)^{-1}\, dx = \infty$ → $f \notin L^1$
> - $\|f\|_2 = \left(\int_0^\infty (1+x)^{-2}\, dx\right)^{1/2} = 1 < \infty$ → $f \in L^2$
>
> Hai ví dụ này minh họa rằng không có inclusion tổng quát giữa $L^1$ và $L^2$ trên tập measure vô hạn.

---

## SageMath Cheatsheet

```python
from sympy import *
import numpy as np

x = symbols('x', positive=True)

# 1. Hölder's inequality kiểm tra
p, q = 3, Rational(3, 2)  # 1/p + 1/q = 1/3 + 2/3 = 1
f_sym = x**(-Rational(1, 3))   # f in L^3([0,1])
g_sym = x**(-Rational(1, 2))   # g in L^(3/2)([0,1])

norm_f = integrate(Abs(f_sym)**p, (x, 0, 1))**Rational(1, p)
norm_g = integrate(Abs(g_sym)**q, (x, 0, 1))**Rational(1, q)
norm_fg = integrate(Abs(f_sym * g_sym), (x, 0, 1))

print(f"||f||_3 = {norm_f}")
print(f"||g||_(3/2) = {norm_g}")
print(f"∫|fg| = {norm_fg}")
print(f"Hölder: {norm_fg} ≤ {norm_f * norm_g} ? {bool(norm_fg <= norm_f * norm_g)}")

# 2. Minkowski's inequality: ||f+g||_p <= ||f||_p + ||g||_p
from sympy import cos, sin
p_val = 2
f2 = sin(x)
g2 = cos(x)

norm_f2 = integrate(f2**p_val, (x, 0, pi))**Rational(1, p_val)
norm_g2 = integrate(g2**p_val, (x, 0, pi))**Rational(1, p_val)
norm_fg2 = integrate((f2 + g2)**p_val, (x, 0, pi))**Rational(1, p_val)

print(f"\n||sin||_2 = {simplify(norm_f2)}")
print(f"||cos||_2 = {simplify(norm_g2)}")
print(f"||sin+cos||_2 = {simplify(norm_fg2)}")
print(f"Minkowski: {float(simplify(norm_fg2)):.4f} ≤ {float(simplify(norm_f2 + norm_g2)):.4f}")

# 3. Riesz-Fischer: Cauchy trong L^2 -> hội tụ
import numpy as np

def l2_norm(f_vals, dx):
    return np.sqrt(np.trapz(f_vals**2) * dx)

x_vals = np.linspace(0, 1, 1000)
dx = x_vals[1] - x_vals[0]

# Dãy Cauchy trong L^2: f_n = x^n (hội tụ về 0 trong L^2 trên [0,1))
l2_norms = [l2_norm(x_vals**n, dx) for n in range(1, 50)]
print("\n||x^n||_L^2 = sqrt(1/(2n+1)) ->")
for n in [1, 5, 10, 20, 50]:
    val = 1/np.sqrt(2*n + 1)
    print(f"  n={n:2d}: {val:.6f}")

# 4. Parseval's identity: ||f||^2 = sum |hat{f}(n)|^2
def fourier_coeff(f_vals, x_vals, n):
    """Hệ số Fourier thứ n của f trên [0,1]"""
    dx = x_vals[1] - x_vals[0]
    real = np.trapz(f_vals * np.cos(2*np.pi*n*x_vals)) * dx
    imag = np.trapz(f_vals * np.sin(2*np.pi*n*x_vals)) * dx
    return complex(real, -imag)

x_pts = np.linspace(0, 1, 2000)
f_test = x_pts * (1 - x_pts)  # f(x) = x(1-x)

norm_sq = np.trapz(f_test**2) * (x_pts[1] - x_pts[0])
parseval_sum = sum(abs(fourier_coeff(f_test, x_pts, n))**2
                   for n in range(-30, 31))

print(f"\nParseval check:")
print(f"||f||^2 = {norm_sq:.6f}")
print(f"sum |c_n|^2 (n=-30..30) = {parseval_sum:.6f}")
print(f"(chênh lệch nhỏ do cắt chuỗi vô hạn)")

# 5. So sánh L^p norms
import matplotlib.pyplot as plt

x_cont = np.linspace(0.01, 1, 1000)
f_power = lambda alpha: x_cont**(-alpha)

print("\nf(x) = x^{-alpha} trên [0,1]:")
for alpha in [0.3, 0.5, 0.7, 0.9]:
    f = f_power(alpha)
    dx = x_cont[1] - x_cont[0]
    norms = {}
    for p_val in [1, 2, 3]:
        integral = np.trapz(f**p_val) * dx
        norms[p_val] = integral**(1/p_val) if integral < 1e10 else float('inf')
    print(f"  alpha={alpha}: L1={norms[1]:.3f}, L2={norms[2]:.3f}, L3={norms[3]:.3f}")
```

---

## Summary / Key Takeaways

- **$L^p$ space**: hàm đo được với $\int |f|^p < \infty$, modulo equality a.e. $\|\cdot\|_p$ là chuẩn (nhờ Minkowski).
- **Hölder**: $\int |fg| \leq \|f\|_p \|g\|_q$ với $1/p + 1/q = 1$. Cauchy-Schwarz là trường hợp $p = q = 2$.
- **Minkowski**: $\|f+g\|_p \leq \|f\|_p + \|g\|_p$ — bất đẳng thức tam giác cho $L^p$.
- **Riesz-Fischer**: $L^p$ là **Banach space** (hoàn chỉnh). Chứng minh dùng MCT + DCT.
- **$L^2$**: Hilbert space với inner product $\langle f, g \rangle = \int fg$. Parseval's identity: $\|f\|_2^2 = \sum |\hat{f}(n)|^2$.
- **Duality**: $(L^p)^* \cong L^q$ với $1/p + 1/q = 1$, $1 < p < \infty$. $(L^1)^* \cong L^\infty$.
- **Inclusion**: Trên $\mu(X) < \infty$: $L^\infty \subseteq L^q \subseteq L^p$ với $p \leq q$. Trên $\mathbb{R}^n$: $\ell^p \subseteq \ell^q$ với $p \leq q$ (ngược chiều).

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.), Chapter 6.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 7.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 3.
- Brezis, H. *Functional Analysis, Sobolev Spaces and PDEs*, Chapter 4.
