---
title: "08. Sequences of Functions"
tags: [math, real-analysis, lesson-08]
aliases: [Sequences of Functions]
created: 2026-03-28
---

> **Prerequisites**: [[05-continuity|05. Continuity]] — Liên tục, uniform continuity; [[07-riemann-integration|07. Riemann Integration]] — Tích phân Riemann, FTC
> **Objectives**:
> - Phân biệt hội tụ điểm-điểm và hội tụ đều; hiểu tại sao sự khác biệt là then chốt
> - Nắm các định lý hoán vị: giới hạn–liên tục, giới hạn–tích phân, giới hạn–đạo hàm
> - Hiểu Weierstrass M-test và áp dụng cho chuỗi hàm
> - Phát biểu và vận dụng định lý Arzelà-Ascoli
> - Hiểu Stone-Weierstrass: xấp xỉ đều bằng đa thức và tổng quát hóa

---

## Motivation / Intuition

Trong Calculus, ta hay "hoán vị" giới hạn và tích phân:

$$
\lim_{n \to \infty} \int_a^b f_n(x)\, dx \stackrel{?}{=} \int_a^b \lim_{n \to \infty} f_n(x)\, dx
$$

Hoán vị này **không luôn đúng**. Ví dụ từ Bài 07: $f_n(x) = nx^n(1-x)$ trên $[0,1]$ hội tụ điểm-điểm về $0$ nhưng $\int_0^1 f_n \to 1 \neq 0$.

Câu hỏi trung tâm: **điều kiện nào đảm bảo hoán vị giới hạn hợp lệ?** Câu trả lời ngắn: **hội tụ đều** (uniform convergence). Hiểu rõ điều này là nền tảng cho toàn bộ phân tích hàm và lý thuyết tích phân hiện đại.

---

## Hội tụ điểm-điểm và Hội tụ đều

### Definition

> [!definition] Definition 8.1 — Hội tụ điểm-điểm (Pointwise Convergence)
> Dãy hàm $(f_n)$ trên $E \subseteq \mathbb{R}$ **hội tụ điểm-điểm** về $f: E \to \mathbb{R}$ nếu:
>
> $$
> \forall x \in E,\; \forall \varepsilon > 0,\; \exists N = N(\varepsilon, x):\; n \geq N \Rightarrow |f_n(x) - f(x)| < \varepsilon
> $$
>
> Chú ý: $N$ có thể **phụ thuộc cả $\varepsilon$ lẫn $x$**.

> [!definition] Definition 8.2 — Hội tụ đều (Uniform Convergence)
> $(f_n)$ **hội tụ đều** về $f$ trên $E$, ký hiệu $f_n \rightrightarrows f$, nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists N = N(\varepsilon):\; \forall x \in E,\; n \geq N \Rightarrow |f_n(x) - f(x)| < \varepsilon
> $$
>
> Khác biệt then chốt: $N$ **chỉ phụ thuộc $\varepsilon$**, không phụ thuộc $x$.
>
> Tương đương: $f_n \rightrightarrows f$ $\Leftrightarrow$ $\displaystyle\sup_{x \in E}|f_n(x) - f(x)| \xrightarrow{n\to\infty} 0$.

### Worked Example

> [!example] Example 8.3 — Pointwise nhưng không uniform
>
> **(a)** $f_n(x) = x^n$ trên $[0, 1]$: Giới hạn điểm-điểm là $f(x) = \mathbf{1}_{\{1\}}(x)$, gián đoạn tại $1$ dù mỗi $f_n$ liên tục. Vì $\sup_{x \in [0,1)} x^n = 1 \not\to 0$: hội tụ không đều.
>
> **(b)** $f_n(x) = \dfrac{x}{1 + nx^2}$ trên $\mathbb{R}$: Giới hạn điểm-điểm $f \equiv 0$. Vì $\sup_x |f_n(x)| = \dfrac{1}{2\sqrt{n}} \to 0$: **hội tụ đều** trên $\mathbb{R}$.
>
> **(c)** $f_n(x) = x^n/n$ trên $[0,1]$: $\sup_{[0,1]}|f_n| = 1/n \to 0$: **hội tụ đều** về $0$.

> [!theorem] Theorem 8.4 — Cauchy criterion cho hội tụ đều
> $(f_n)$ hội tụ đều trên $E$ khi và chỉ khi:
>
> $$
> \forall \varepsilon > 0,\; \exists N:\; \forall m, n \geq N,\; \sup_{x \in E} |f_m(x) - f_n(x)| < \varepsilon
> $$

---

## Các Định lý Hoán vị

### Theorem

> [!theorem] Theorem 8.5 — Uniform limit của hàm liên tục là liên tục
> Nếu $f_n \rightrightarrows f$ trên $E$ và mỗi $f_n$ liên tục tại $x_0 \in E$, thì $f$ liên tục tại $x_0$.
>
> Tương đương:
>
> $$
> \lim_{x \to x_0} \lim_{n \to \infty} f_n(x) = \lim_{n \to \infty} \lim_{x \to x_0} f_n(x)
> $$

**Proof.**
Với $\varepsilon > 0$, chọn $N$: $\sup_E|f_N - f| < \varepsilon/3$. Vì $f_N$ liên tục tại $x_0$, tồn tại $\delta > 0$: $|x - x_0| < \delta \Rightarrow |f_N(x) - f_N(x_0)| < \varepsilon/3$. Khi đó với $|x - x_0| < \delta$:

$$
|f(x) - f(x_0)| \leq \underbrace{|f(x) - f_N(x)|}_{<\varepsilon/3} + \underbrace{|f_N(x) - f_N(x_0)|}_{<\varepsilon/3} + \underbrace{|f_N(x_0) - f(x_0)|}_{<\varepsilon/3} < \varepsilon \qquad \blacksquare
$$

> [!theorem] Theorem 8.6 — Uniform limit bảo toàn khả tích và tích phân
> Nếu $f_n \rightrightarrows f$ trên $[a,b]$ và mỗi $f_n \in \mathcal{R}[a,b]$, thì $f \in \mathcal{R}[a,b]$ và:
>
> $$
> \lim_{n \to \infty} \int_a^b f_n(x)\, dx = \int_a^b f(x)\, dx
> $$

**Proof.**
Với $\varepsilon > 0$, chọn $N$: $n \geq N \Rightarrow |f_n(x) - f(x)| < \varepsilon/(b-a)$ với mọi $x$. Khi đó:

$$
\left|\int_a^b f_n - \int_a^b f\right| \leq \int_a^b |f_n - f| \leq \frac{\varepsilon}{b-a} \cdot (b-a) = \varepsilon \qquad \blacksquare
$$

> [!theorem] Theorem 8.7 — Hoán vị giới hạn và đạo hàm
> Giả sử $f_n: [a,b] \to \mathbb{R}$ khả vi, $f_n' \rightrightarrows g$ đều trên $[a,b]$, và $\exists x_0 \in [a,b]$: $f_n(x_0) \to L$. Thì $f_n \rightrightarrows f$ với $f$ khả vi và:
>
> $$
> f' = g = \lim_{n \to \infty} f_n'
> $$

> [!warning] Counterexample 8.8 — Không có uniform convergence của $f_n'$
> $f_n(x) = \dfrac{\sin(nx)}{\sqrt{n}}$: $f_n \rightrightarrows 0$ nhưng $f_n'(x) = \sqrt{n}\cos(nx)$ không hội tụ. Vậy $\left(\lim f_n\right)' = 0$ nhưng $\lim f_n'$ không tồn tại.

---

## Weierstrass M-Test

### Theorem

> [!theorem] Theorem 8.9 — Weierstrass M-Test
> Giả sử $\sum_{n=1}^\infty M_n < \infty$ và $|f_n(x)| \leq M_n$ với mọi $x \in E$ và mọi $n$. Thì chuỗi hàm $\displaystyle\sum_{n=1}^\infty f_n$ **hội tụ đều tuyệt đối** trên $E$.

**Proof.**
Dãy tổng riêng $S_N(x) = \sum_{n=1}^N f_n(x)$ thỏa tiêu chuẩn Cauchy đều: với $m > n \geq N$,

$$
|S_m(x) - S_n(x)| \leq \sum_{k=n+1}^m |f_k(x)| \leq \sum_{k=n+1}^m M_k < \varepsilon
$$

với $N$ đủ lớn (vì $\sum M_k$ hội tụ). $\blacksquare$

### Worked Example

> [!example] Example 8.10 — M-Test và hội tụ đều
>
> **(a)** $\sum_{n=1}^\infty \dfrac{x^n}{n^2}$ trên $[-1,1]$: $\left|\dfrac{x^n}{n^2}\right| \leq \dfrac{1}{n^2}$ và $\sum 1/n^2 = \pi^2/6$. Chuỗi hội tụ đều, hàm tổng liên tục trên $[-1,1]$.
>
> **(b)** $\sum_{n=0}^\infty z^n = \dfrac{1}{1-z}$ trên $|z| \leq r < 1$: $|z^n| \leq r^n$ và $\sum r^n = 1/(1-r) < \infty$. Hội tụ đều trên mọi đĩa compact trong vòng tròn đơn vị.
>
> **(c)** Chuỗi Weierstrass $W(x) = \sum_{n=0}^\infty a^n \cos(b^n \pi x)$ với $0 < a < 1$: $|a^n \cos(\cdot)| \leq a^n$ và $\sum a^n = 1/(1-a)$. Hội tụ đều, hàm tổng liên tục — nhưng không khả vi ở đâu!

---

## Định lý Arzelà-Ascoli

### Definition

> [!definition] Definition 8.11 — Equicontinuity (Đẳng liên tục)
> Họ hàm $\mathcal{F} = \{f_\alpha\}$ trên metric space $K$ là **equicontinuous** tại $x_0$ nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists \delta > 0:\; d(x, x_0) < \delta \Rightarrow |f_\alpha(x) - f_\alpha(x_0)| < \varepsilon \text{ với mọi } f_\alpha \in \mathcal{F}
> $$
>
> $\mathcal{F}$ equicontinuous **trên $K$** nếu $\delta$ không phụ thuộc cả điểm lẫn hàm trong họ.

> [!theorem] Theorem 8.12 — Arzelà-Ascoli Theorem
> Cho $K \subseteq \mathbb{R}$ compact và $\{f_n\} \subseteq C(K)$. Nếu:
>
> 1. **Uniformly bounded**: $\exists M > 0$: $|f_n(x)| \leq M$ với mọi $n, x \in K$
> 2. **Equicontinuous** trên $K$
>
> Thì $\{f_n\}$ có một **dãy con hội tụ đều** trên $K$.

**Proof sketch.**
*Bước 1 — Hội tụ điểm-điểm trên tập dày đặc đếm được:* Lấy $E = \{q_1, q_2, \ldots\} \subseteq K$ dày đặc đếm được. Vì $\{f_n(q_1)\}$ bị chặn trong $\mathbb{R}$, Bolzano-Weierstrass cho dãy con $f_{n_k^{(1)}}(q_1) \to L_1$. Trích tiếp dãy con hội tụ tại $q_2$, rồi $q_3$, ... Lấy đường chéo: dãy con $f_{n_k} := f_{n_k^{(k)}}$ hội tụ tại mọi $q_j$.

*Bước 2 — Hội tụ đều trên $K$:* Với $\varepsilon > 0$, dùng equicontinuity chọn $\delta$. Vì $K$ compact, phủ $K$ bằng hữu hạn $B(q_{j_i}, \delta)$. Với $n, m \geq N$ đủ lớn (từ bước 1):

$$
|f_n(x) - f_m(x)| \leq |f_n(x) - f_n(q_{j_i})| + |f_n(q_{j_i}) - f_m(q_{j_i})| + |f_m(q_{j_i}) - f_m(x)| < 3\varepsilon
$$

Tiêu chuẩn Cauchy đều $\Rightarrow$ hội tụ đều. Xem chứng minh đầy đủ tại [[a1-arzela-ascoli|A1. Arzelà-Ascoli Theorem]]. $\blacksquare$

### Worked Example

> [!example] Example 8.13 — Toán tử tích phân là compact
>
> Cho $T: C([0,1]) \to C([0,1])$ với $T(f)(x) = \int_0^x f(t)\, dt$.
>
> Với $\|f\|_\infty \leq 1$: (i) $|T(f)(x)| \leq 1$ (uniformly bounded), (ii) $|T(f)(x) - T(f)(y)| = |\int_y^x f(t)\, dt| \leq |x - y|$ (equicontinuous với $\delta = \varepsilon$).
>
> Theo Arzelà-Ascoli, ảnh của quả cầu đơn vị qua $T$ là relatively compact trong $C([0,1])$. Vậy $T$ là **toán tử compact** — kết quả nền tảng của giải tích hàm.

---

## Stone-Weierstrass Theorem

### Theorem

> [!theorem] Theorem 8.14 — Weierstrass Approximation Theorem
> Nếu $f: [a,b] \to \mathbb{R}$ liên tục thì tồn tại dãy đa thức $\{p_n\}$ hội tụ **đều** về $f$ trên $[a,b]$.

**Proof sketch** (Bernstein polynomials).
Đặt $B_n(f)(x) = \displaystyle\sum_{k=0}^n f\!\left(\frac{k}{n}\right)\binom{n}{k}x^k(1-x)^{n-k}$. Mỗi $B_n$ là đa thức. Dùng tính uniform continuity của $f$ và đẳng thức $\sum_k \binom{n}{k}x^k(1-x)^{n-k} = 1$, chứng minh:

$$
\|B_n(f) - f\|_\infty \leq \omega_f\!\left(\frac{1}{\sqrt{n}}\right) \xrightarrow{n\to\infty} 0
$$

trong đó $\omega_f(\delta) = \sup_{|x-y| \leq \delta}|f(x)-f(y)|$ là modulus of continuity của $f$. $\blacksquare$

> [!theorem] Theorem 8.15 — Stone-Weierstrass Theorem
> Cho $K$ compact Hausdorff và $\mathcal{A} \subseteq C(K, \mathbb{R})$ là một **algebra** thỏa:
>
> 1. $\mathcal{A}$ **separates points**: với $x \neq y$, $\exists f \in \mathcal{A}$: $f(x) \neq f(y)$
> 2. $\mathcal{A}$ **vanishes at no point**: với mọi $x \in K$, $\exists f \in \mathcal{A}$: $f(x) \neq 0$
>
> Thì $\mathcal{A}$ **dày đặc** trong $C(K, \mathbb{R})$ theo norm $\|\cdot\|_\infty$: mọi $f \in C(K)$ là giới hạn đều của dãy hàm trong $\mathcal{A}$.

> [!note] Remark 8.16 — Hệ quả và ứng dụng
>
> - **Weierstrass** là trường hợp đặc biệt: $\mathcal{A}$ = đa thức trên $[a,b]$.
> - **Hàm lượng giác**: tập span$\{1, \cos(nx), \sin(nx) \mid n \geq 1\}$ dày đặc trong $C([0, 2\pi])$ — nền tảng cho chuỗi Fourier.
> - **Hàm nhiều biến**: đa thức dày đặc trong $C([a,b]^d)$ với mọi $d$.

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import comb

# Đa thức Bernstein xấp xỉ f(x) = |x - 0.5|
def bernstein(f, n, xs):
    result = np.zeros_like(xs, dtype=float)
    for k in range(n + 1):
        result += f(k / n) * comb(n, k, exact=False) * xs**k * (1 - xs)**(n - k)
    return result

f_abs = lambda t: abs(t - 0.5)
xs = np.linspace(0, 1, 400)

for n in [5, 10, 50]:
    B = bernstein(f_abs, n, xs)
    sup_err = np.max(np.abs(B - f_abs(xs)))
    print(f"n={n:3d}: sup error = {sup_err:.5f}")
# n=  5: ~0.06;  n= 10: ~0.04;  n= 50: ~0.018 → 0 (đều)

# Kiểm tra hội tụ đều qua sup|f_n - f|
f_n = lambda x, n: x / (1 + n * x**2)
xs = np.linspace(-5, 5, 1000)
for n in [1, 5, 10, 100]:
    sup_diff = np.max(np.abs(f_n(xs, n)))
    print(f"n={n:3d}: sup|f_n - 0| = {sup_diff:.5f}")  # 1/(2√n) → 0

# Weierstrass M-test: chuỗi sum x^n/n^2 trên [-1,1]
from sympy import *
x, n = symbols('x n', real=True)
S = summation(x**n / n**2, (n, 1, oo))
print(f"Sum = {S}")  # polylogarithm Li_2(x), liên tục trên [-1,1]

# Arzelà-Ascoli: họ {sin(nx)/n} trên [0, 2π]
# equicontinuous vì |(sin(nx)/n)'| = |cos(nx)| ≤ 1
xs = np.linspace(0, 2*np.pi, 300)
plt.figure(figsize=(8, 4))
for n_val in [1, 2, 5, 10, 20]:
    plt.plot(xs, np.sin(n_val * xs) / n_val, alpha=0.6, label=f'n={n_val}')
plt.title('$f_n = \\sin(nx)/n$: equicontinuous (|f_n\'| ≤ 1), uniformly bounded')
plt.legend(); plt.grid(True)
plt.savefig('arzela_ascoli.png', dpi=100)
```

---

## Summary / Key Takeaways

- **Pointwise vs uniform**: uniform $\Leftrightarrow$ $\sup_E|f_n - f| \to 0$. Uniform mạnh hơn và bảo toàn liên tục, tích phân, đạo hàm (với điều kiện cho đạo hàm).
- **Ba định lý hoán vị** (đều cần uniform convergence): liên tục, tích phân, đạo hàm (cần $f_n'$ uniform converge, không chỉ $f_n$).
- **Weierstrass M-test**: $\sum M_n < \infty$, $|f_n| \leq M_n$ $\Rightarrow$ $\sum f_n$ hội tụ đều tuyệt đối.
- **Arzelà-Ascoli**: uniformly bounded + equicontinuous $\Rightarrow$ mọi dãy có dãy con hội tụ đều. Là Bolzano-Weierstrass cho không gian hàm $C(K)$.
- **Weierstrass Approximation**: mọi $f \in C[a,b]$ là giới hạn đều của đa thức (qua Bernstein). **Stone-Weierstrass** tổng quát hóa: algebra separating points, vanishing nowhere thì dày đặc trong $C(K)$.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 7.
- Folland, G. B. *Real Analysis* (2nd ed.), Section 4.6.
- Abbott, S. *Understanding Analysis* (2nd ed.), Chapter 6.
- Lebl, J. *Basic Analysis I*, Chapter 6.
