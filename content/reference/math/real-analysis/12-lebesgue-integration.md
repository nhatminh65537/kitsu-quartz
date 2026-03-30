---
title: "12. Lebesgue Integration"
tags: [math, real-analysis, lesson-12]
aliases: [Lebesgue Integration]
created: 2026-03-28
---

> **Prerequisites**: [[11-measurable-functions|11. Measurable Functions]] — Simple functions, a.e., modes of convergence; [[09-measure-theory-foundations|09. Measure Theory Foundations]] — Measure space
> **Objectives**:
> - Xây dựng tích phân Lebesgue theo ba bước: simple → nonneg → general
> - Chứng minh ba định lý hội tụ lớn: MCT, Fatou, DCT
> - Hiểu quan hệ giữa tích phân Lebesgue và Riemann
> - Nắm tính chất tuyến tính, đơn điệu, và absolute continuity của tích phân
> - Áp dụng DCT để hoán vị tích phân và giới hạn

---

## Motivation / Intuition

Ở Bài 07, tích phân Riemann xấp xỉ diện tích bằng cách phân hoạch theo **trục $x$** (domain). Tích phân Lebesgue tiếp cận khác: phân hoạch theo **trục $y$** (range) — "bao nhiêu điểm $x$ mà $f(x)$ rơi vào khoảng $[a, b]$?" Câu trả lời là $\mu(\{f^{-1}([a,b])\})$ — và điều này hoạt động cho cả những hàm phức tạp mà Riemann không xử lý được.

Kết quả là ba định lý hội tụ mạnh mẽ: **MCT** (đơn điệu tăng), **Fatou** (bất đẳng thức), và **DCT** (bị chặn bởi hàm tích phân được). Ba định lý này là trái tim của giải tích hiện đại — cho phép hoán vị $\lim$ và $\int$ trong phần lớn các tình huống thực tế.

---

## Tích phân của Simple Functions

### Definition

> [!definition] Definition 12.1 — Tích phân của Simple Function
> Cho $(X, \mathcal{M}, \mu)$ measure space. Với simple function $\phi = \sum_{i=1}^n a_i \mathbf{1}_{A_i}$ ($a_i \geq 0$, $A_i$ rời nhau), **tích phân Lebesgue** là:
>
> $$
> \int \phi\, d\mu = \sum_{i=1}^n a_i\, \mu(A_i)
> $$
>
> (Quy ước: $0 \cdot \infty = 0$.)
>
> Với $E \in \mathcal{M}$: $\displaystyle\int_E \phi\, d\mu = \int \phi \cdot \mathbf{1}_E\, d\mu$.

> [!theorem] Theorem 12.2 — Tính chất tích phân của simple functions
> Với $\phi, \psi$ simple nonneg và $c \geq 0$:
>
> 1. $\displaystyle\int (c\phi + \psi)\, d\mu = c \int \phi\, d\mu + \int \psi\, d\mu$
> 2. $\phi \leq \psi$ a.e. $\Rightarrow$ $\int \phi \leq \int \psi$
> 3. Nếu $\{A_n\}$ rời nhau: $\displaystyle\int_{\bigsqcup A_n} \phi\, d\mu = \sum_n \int_{A_n} \phi\, d\mu$

---

## Tích phân của Hàm Nonneg

### Definition

> [!definition] Definition 12.3 — Tích phân Lebesgue của hàm nonneg
> Cho $f: X \to [0, +\infty]$ đo được. **Tích phân Lebesgue** của $f$ là:
>
> $$
> \int f\, d\mu = \sup\left\{\int \phi\, d\mu \;\middle|\; \phi \text{ simple nonneg},\; \phi \leq f\right\}
> $$

> [!note] Remark 12.4
> Định nghĩa này nhất quán với tích phân của simple function. Tích phân có thể bằng $+\infty$.

---

## Ba Định lý Hội tụ Lớn

### Theorem

> [!theorem] Theorem 12.5 — Monotone Convergence Theorem (MCT / Beppo Levi)
> Cho $\{f_n\}$ dãy hàm đo được nonneg với $0 \leq f_1 \leq f_2 \leq \cdots$ a.e. Đặt $f = \lim_n f_n$ (tồn tại và đo được). Thì:
>
> $$
> \lim_{n \to \infty} \int f_n\, d\mu = \int f\, d\mu
> $$

**Proof.**
Vì $f_n \leq f$: $\int f_n \leq \int f$ với mọi $n$, nên $\lim \int f_n \leq \int f$.

Chiều ngược: với $0 < c < 1$ và $\phi$ simple nonneg với $\phi \leq f$, đặt $E_n = \{f_n \geq c\phi\}$. Dãy $\{E_n\}$ tăng lên $X$ (vì $f_n \to f \geq c\phi$ nên mọi $x$ cuối cùng thuộc $E_n$). Khi đó:

$$
\int f_n \geq \int_{E_n} f_n \geq c \int_{E_n} \phi
$$

Theo continuity from below của measure: $\int_{E_n} \phi \to \int \phi$. Vậy $\lim \int f_n \geq c \int \phi$. Vì $c < 1$ tùy ý, lấy sup theo $\phi$: $\lim \int f_n \geq \int f$. $\blacksquare$

> [!corollary] Corollary 12.6 — MCT cho chuỗi
> Nếu $\{g_n\}$ nonneg đo được:
>
> $$
> \int \sum_{n=1}^\infty g_n\, d\mu = \sum_{n=1}^\infty \int g_n\, d\mu
> $$

**Proof.** Đặt $f_n = \sum_{k=1}^n g_k$ (tăng). MCT cho kết quả. $\blacksquare$

### Theorem

> [!theorem] Theorem 12.7 — Fatou's Lemma
> Cho $\{f_n\}$ dãy hàm đo được nonneg. Thì:
>
> $$
> \int \liminf_{n \to \infty} f_n\, d\mu \leq \liminf_{n \to \infty} \int f_n\, d\mu
> $$

**Proof.**
Đặt $g_n = \inf_{k \geq n} f_k$ (nonneg đo được). Thì $g_n \leq f_n$ nên $\int g_n \leq \int f_n$, tức $\int g_n \leq \liminf_n \int f_n$.

Dãy $(g_n)$ tăng về $\liminf f_n$. Theo MCT: $\int \liminf f_n = \lim \int g_n \leq \liminf \int f_n$. $\blacksquare$

> [!warning] Counterexample 12.8 — Fatou có thể bất đẳng thức nghiêm
> $f_n = \mathbf{1}_{[n, n+1]}$ trên $\mathbb{R}$: $\liminf f_n = 0$, nên $\int \liminf f_n = 0$. Nhưng $\int f_n = 1$ với mọi $n$, nên $\liminf \int f_n = 1 > 0$.

---

## Tích phân của Hàm Tổng quát

### Definition

> [!definition] Definition 12.9 — Tích phân Lebesgue tổng quát
> Với $f: X \to [-\infty, +\infty]$ đo được, đặt $f^+ = \max(f, 0)$ và $f^- = \max(-f, 0)$, nên $f = f^+ - f^-$.
>
> $f$ là **khả tích** (integrable, $f \in L^1$) nếu $\int f^+\, d\mu < \infty$ **và** $\int f^-\, d\mu < \infty$. Khi đó:
>
> $$
> \int f\, d\mu = \int f^+\, d\mu - \int f^-\, d\mu
> $$

> [!note] Remark 12.10
> Điều kiện cần và đủ để $f$ khả tích: $\int |f|\, d\mu < \infty$ (tức $|f| \in L^1$). Lý do: $|f| = f^+ + f^-$.

### Theorem

> [!theorem] Theorem 12.11 — Dominated Convergence Theorem (DCT / Lebesgue)
> Cho $\{f_n\}$ dãy hàm đo được và $f_n \to f$ a.e. Giả sử tồn tại $g \in L^1(\mu)$ (hàm **dominating**) sao cho $|f_n| \leq g$ a.e. với mọi $n$. Thì $f \in L^1$ và:
>
> $$
> \lim_{n \to \infty} \int f_n\, d\mu = \int f\, d\mu
> $$
>
> Mạnh hơn: $\displaystyle\int |f_n - f|\, d\mu \to 0$ (hội tụ trong $L^1$).

**Proof.**
Áp dụng Fatou's Lemma cho dãy nonneg $g - f_n$ (vì $|f_n| \leq g$, ta có $g - f_n \geq 0$ a.e.):

$$
\int (g - f)\, d\mu \leq \liminf_{n \to \infty} \int (g - f_n)\, d\mu
$$

Suy ra: $\int g - \int f \leq \int g - \limsup \int f_n$, tức $\limsup \int f_n \leq \int f$.

Tương tự, áp dụng Fatou cho $g + f_n \geq 0$: $\int f \leq \liminf \int f_n$.

Vậy $\liminf \int f_n \geq \int f \geq \limsup \int f_n$, suy ra $\int f_n \to \int f$. $\blacksquare$

> [!corollary] Corollary 12.12 — Bounded Convergence Theorem
> Nếu $\mu(X) < \infty$, $f_n \to f$ a.e., và $|f_n| \leq M$ (hằng số) a.e. thì $\int f_n \to \int f$.
>
> (Đây là DCT với $g = M \cdot \mathbf{1}_X \in L^1$ vì $\mu(X) < \infty$.)

### Worked Example

> [!example] Example 12.13 — Áp dụng DCT
>
> **(a)** Tính $\displaystyle\lim_{n \to \infty} \int_0^\infty \frac{\sin(x/n)}{x(1 + x^2)}\, dx$.
>
> Đặt $f_n(x) = \dfrac{\sin(x/n)}{x(1+x^2)}$. Khi $n \to \infty$: $\dfrac{\sin(x/n)}{x/n} \to 1$ nên $f_n(x) \to \dfrac{1}{1+x^2}$.
>
> Dominating function: $|f_n(x)| \leq \dfrac{|x/n|}{x(1+x^2)} = \dfrac{1}{n(1+x^2)} \leq \dfrac{1}{1+x^2}$ (bằng $|\sin t| \leq |t|$).
>
> Vì $g(x) = \dfrac{1}{1+x^2} \in L^1([0,\infty))$: DCT cho $\displaystyle\lim_{n} \int_0^\infty f_n = \int_0^\infty \frac{dx}{1+x^2} = \frac{\pi}{2}$.
>
> **(b) Phân biệt DCT và tích phân Riemann**:
>
> $f_n(x) = n \cdot \mathbf{1}_{[0,1/n]}(x)$: $f_n \to 0$ a.e. nhưng $\int_0^1 f_n = 1 \not\to 0$. Không có dominating function trong $L^1$ vì $\sup_n |f_n|$ không khả tích. DCT **không** áp dụng được.

---

## Tính chất của Tích phân Lebesgue

### Theorem

> [!theorem] Theorem 12.14 — Tính chất đại số
> Cho $f, g \in L^1(\mu)$, $c \in \mathbb{R}$:
>
> 1. **Tuyến tính**: $\int (cf + g)\, d\mu = c \int f\, d\mu + \int g\, d\mu$
> 2. **Đơn điệu**: $f \leq g$ a.e. $\Rightarrow$ $\int f \leq \int g$
> 3. **Tam giác**: $\left|\int f\, d\mu\right| \leq \int |f|\, d\mu$
> 4. **Tập measure zero**: $\mu(E) = 0 \Rightarrow \int_E f\, d\mu = 0$
> 5. **Additivity trên $\sigma$-finite**: $E = \bigsqcup E_n \Rightarrow \int_E f = \sum_n \int_{E_n} f$

> [!theorem] Theorem 12.15 — Absolute Continuity của tích phân
> Nếu $f \in L^1(\mu)$ thì với mọi $\varepsilon > 0$, tồn tại $\delta > 0$:
>
> $$
> \mu(E) < \delta \Rightarrow \left|\int_E f\, d\mu\right| < \varepsilon
> $$

**Proof.** Dùng DCT: nếu $\mu(E_n) \to 0$ thì $\int_{E_n} |f| \leq \int |f| \cdot \mathbf{1}_{E_n} \to 0$ (vì $|f| \cdot \mathbf{1}_{E_n} \to 0$ a.e. và bị chặn bởi $|f| \in L^1$). $\blacksquare$

### Theorem

> [!theorem] Theorem 12.16 — Lebesgue vs Riemann
>
> **(a)** Nếu $f: [a,b] \to \mathbb{R}$ khả tích Riemann thì $f$ khả tích Lebesgue và:
>
> $$
> \int_{[a,b]} f\, d\mu = \int_a^b f(x)\, dx \quad (\text{Riemann})
> $$
>
> **(b)** Lebesgue mạnh hơn: $\mathbf{1}_\mathbb{Q}$ khả tích Lebesgue (giá trị $= 0$) nhưng không khả tích Riemann.

> [!theorem] Theorem 12.17 — Tích phân và giới hạn (tổng kết)
>
> | Điều kiện | Kết luận |
> |-----------|---------|
> | $f_n \nearrow f$ a.e. (nonneg) | MCT: $\int f_n \to \int f$ |
> | $f_n \geq 0$ | Fatou: $\int \liminf f_n \leq \liminf \int f_n$ |
> | $f_n \to f$ a.e., $\|f_n\| \leq g \in L^1$ | DCT: $\int f_n \to \int f$, $\int \|f_n - f\| \to 0$ |
> | $\mu(X) < \infty$, $f_n \to f$ a.e., $\|f_n\| \leq M$ | BCT: $\int f_n \to \int f$ |

---

## SageMath Cheatsheet

```python
from sympy import *
import numpy as np

x, n_sym = symbols('x n', positive=True)

# 1. MCT: sum 1/n^2 * indicator của (n-1, n]
# integral của sum = sum của integral (MCT/Corollary 12.6)
total = sum(Rational(1, k**2) for k in range(1, 100))
print(f"Partial sum (100 terms) ≈ {float(total):.6f}, pi^2/6 = {float(pi**2/6):.6f}")

# 2. Fatou's Lemma: f_n = 1_{[n, n+1]} -> liminf = 0
# integral(liminf) = 0, liminf(integral) = 1 > 0
print("Fatou strict: integral(liminf f_n) = 0 < 1 = liminf integral(f_n)")

# 3. DCT: lim int sin(x/n) / (x(1+x^2)) dx
results = []
for n_val in [10, 100, 1000, 10000]:
    import scipy.integrate as sci
    f_n = lambda x_val: np.sin(x_val / n_val) / (x_val * (1 + x_val**2)) if x_val > 0 else 0
    I, _ = sci.quad(f_n, 1e-10, 1000)
    results.append((n_val, I))
    print(f"n={n_val:6d}: ∫f_n ≈ {I:.6f}")
print(f"π/2         = {float(pi/2):.6f}")

# 4. BCT: f_n = sin(nx)/n -> 0, bounded by M=1
import matplotlib.pyplot as plt
x_vals = np.linspace(0, 2*np.pi, 500)
integrals = []
ns = range(1, 50)
for n_val in ns:
    f = np.sin(n_val * x_vals) / n_val
    integrals.append(np.trapz(f, x_vals))

plt.figure(figsize=(8, 4))
plt.plot(list(ns), integrals, 'b-o', markersize=3)
plt.axhline(0, color='r', linestyle='--', label='limit = 0')
plt.title('BCT: ∫₀²π sin(nx)/n dx → 0')
plt.xlabel('n'); plt.ylabel('integral value')
plt.legend(); plt.grid(True)
plt.savefig('bct_convergence.png', dpi=100)

# 5. Absolute continuity: int_{[0,eps]} |x^{-1/2}| dx -> 0 khi eps -> 0
# f(x) = 1/sqrt(x) in L^1([0,1])
eps_vals = [0.1, 0.01, 0.001, 0.0001]
for eps in eps_vals:
    I, _ = sci.quad(lambda xv: 1/np.sqrt(xv), eps, 1)
    int_small, _ = sci.quad(lambda xv: 1/np.sqrt(xv), 1e-10, eps)
    print(f"ε={eps:.4f}: ∫_[0,ε] |f| ≈ {int_small:.6f} → 0")
```

---

## Summary / Key Takeaways

- **Tích phân Lebesgue** xây dựng theo ba bước: simple functions $\to$ hàm nonneg (sup) $\to$ hàm tổng quát ($f^+ - f^-$).
- **MCT**: $f_n \nearrow f$ nonneg a.e. $\Rightarrow$ $\int f_n \to \int f$. Tổng và tích phân hoán vị với dãy tăng nonneg.
- **Fatou's Lemma**: $\int \liminf f_n \leq \liminf \int f_n$ với $f_n \geq 0$. Nền tảng chứng minh MCT và DCT.
- **DCT**: $f_n \to f$ a.e. và $|f_n| \leq g \in L^1$ $\Rightarrow$ $\int f_n \to \int f$ và $\int|f_n - f| \to 0$. Định lý hội tụ mạnh nhất và hữu dụng nhất.
- **Absolute continuity**: $f \in L^1$ $\Rightarrow$ tích phân trên tập nhỏ thì nhỏ.
- **Lebesgue $\supsetneq$ Riemann**: mọi Riemann khả tích đều Lebesgue khả tích; Lebesgue mạnh hơn (xử lý được $\mathbf{1}_\mathbb{Q}$, hoán vị $\lim$-$\int$ an toàn hơn).

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.), Sections 2.2–2.3.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 4.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 1.
- Tao, T. *An Introduction to Measure Theory*, Chapter 1.
