---
title: "05. Continuity"
tags: [math, real-analysis, lesson-05]
aliases: [Continuity]
created: 2026-03-28
---

> **Prerequisites**: [[03-metric-spaces|03. Metric Spaces]] — Open/closed sets, compact sets, connected sets; [[04-sequences-and-series|04. Sequences & Series]] — Hội tụ dãy số
> **Objectives**:
> - Định nghĩa liên tục theo $\varepsilon$-$\delta$ và theo dãy số, hiểu sự tương đương
> - Đặc trưng liên tục bằng preimage của open/closed sets
> - Nắm các định lý lớn: ảnh của compact là compact, EVT, IVT
> - Phân biệt liên tục và đồng đều liên tục (uniform continuity)
> - Hiểu điểm gián đoạn và phân loại trong $\mathbb{R}$

---

## Motivation / Intuition

Hàm $f(x) = x^2$ liên tục tại $x = 2$: khi $x$ gần $2$, $f(x)$ gần $4$. Hàm $f(x) = \lfloor x \rfloor$ (phần nguyên) không liên tục tại $x = 1$: dù $x$ rất gần $1$ từ bên trái, $f(x) = 0$, còn $f(1) = 1$ — nhảy bước.

Định nghĩa chính xác của liên tục là "hình thức hóa" ý tưởng này thành ngôn ngữ $\varepsilon$-$\delta$. Nhưng quan trọng hơn là *hậu quả* của liên tục: hàm liên tục trên compact đạt max/min (EVT), trên connected thì ảnh connected (IVT). Đây là nền tảng cho toàn bộ giải tích một và nhiều biến.

---

## Định nghĩa Liên tục

### Definition

> [!definition] Definition 5.1 — Liên tục tại một điểm ($\varepsilon$-$\delta$)
> Cho $(X, d_X)$ và $(Y, d_Y)$ là hai metric spaces, $f: X \to Y$, và $p \in X$. Hàm $f$ **liên tục tại $p$** nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists \delta > 0:\; d_X(x, p) < \delta \Rightarrow d_Y(f(x), f(p)) < \varepsilon
> $$
>
> Hàm $f$ **liên tục trên $X$** nếu nó liên tục tại mọi $p \in X$.

> [!theorem] Theorem 5.2 — Tương đương: $\varepsilon$-$\delta$ và dãy số
> $f$ liên tục tại $p$ khi và chỉ khi: với mọi dãy $(x_n)$ trong $X$ thỏa $x_n \to p$, ta có $f(x_n) \to f(p)$.

**Proof.**
($\Rightarrow$) Giả sử $f$ liên tục tại $p$, $x_n \to p$. Với $\varepsilon > 0$, chọn $\delta$ từ định nghĩa. Chọn $N$: $n \geq N \Rightarrow d_X(x_n, p) < \delta$. Khi đó $d_Y(f(x_n), f(p)) < \varepsilon$.

($\Leftarrow$) Phản chứng: giả sử $f$ không liên tục tại $p$. Tồn tại $\varepsilon > 0$: với mọi $\delta = 1/n$, tồn tại $x_n$ với $d_X(x_n, p) < 1/n$ nhưng $d_Y(f(x_n), f(p)) \geq \varepsilon$. Vậy $x_n \to p$ nhưng $f(x_n) \not\to f(p)$. $\blacksquare$

> [!theorem] Theorem 5.3 — Đặc trưng tô-pô của liên tục
> $f: X \to Y$ liên tục trên $X$ khi và chỉ khi: với mọi tập mở $V \subseteq Y$, **preimage** $f^{-1}(V) = \{x \in X \mid f(x) \in V\}$ là tập mở trong $X$.
>
> Tương đương: $f$ liên tục $\Leftrightarrow$ preimage của tập đóng là tập đóng.

**Proof.**
($\Rightarrow$) Cho $V \subseteq Y$ mở và $p \in f^{-1}(V)$. Khi đó $f(p) \in V$, và vì $V$ mở, tồn tại $\varepsilon > 0$: $B(f(p), \varepsilon) \subseteq V$. Vì $f$ liên tục tại $p$, tồn tại $\delta > 0$: $d_X(x,p) < \delta \Rightarrow d_Y(f(x), f(p)) < \varepsilon$. Tức $B(p, \delta) \subseteq f^{-1}(V)$.

($\Leftarrow$) Với $p \in X$ và $\varepsilon > 0$, tập $V = B(f(p), \varepsilon)$ mở trong $Y$. Theo giả thiết, $f^{-1}(V)$ mở trong $X$. Vì $p \in f^{-1}(V)$, tồn tại $\delta > 0$: $B(p, \delta) \subseteq f^{-1}(V)$. Tức $d_X(x,p) < \delta \Rightarrow f(x) \in V$, tức $d_Y(f(x),f(p)) < \varepsilon$. $\blacksquare$

### Worked Example

> [!example] Example 5.4 — Kiểm tra liên tục theo định nghĩa
>
> **(a)** $f(x) = x^2$ liên tục tại $p \in \mathbb{R}$.
>
> Với $\varepsilon > 0$, cần $|x^2 - p^2| < \varepsilon$. Giả sử $|x - p| < 1$, ta có $|x + p| \leq |x - p| + 2|p| < 1 + 2|p|$. Khi đó:
>
> $$
> |x^2 - p^2| = |x - p||x + p| < |x - p|(1 + 2|p|)
> $$
>
> Chọn $\delta = \min\!\left(1, \dfrac{\varepsilon}{1 + 2|p|}\right)$, ta được $|x^2 - p^2| < \varepsilon$.
>
> **(b)** Hàm Dirichlet $f(x) = \mathbf{1}_{\mathbb{Q}}(x)$ (bằng $1$ nếu $x \in \mathbb{Q}$, bằng $0$ nếu $x \notin \mathbb{Q}$) **không liên tục tại mọi điểm**:
>
> Tại mọi $p$, trong mọi $B(p, \delta)$ đều có số hữu tỷ và số vô tỷ, nên $f$ nhảy giá trị.

---

## Các Định lý Lớn

### Theorem

> [!theorem] Theorem 5.5 — Ảnh liên tục của compact là compact
> Nếu $f: X \to Y$ liên tục và $K \subseteq X$ compact thì $f(K) \subseteq Y$ compact.

**Proof.**
Cho $\{V_\alpha\}$ là open cover của $f(K)$. Khi đó $\{f^{-1}(V_\alpha)\}$ là open cover của $K$ (mỗi $f^{-1}(V_\alpha)$ mở vì $f$ liên tục). Vì $K$ compact, có subcover hữu hạn $f^{-1}(V_{\alpha_1}), \ldots, f^{-1}(V_{\alpha_n})$. Khi đó $V_{\alpha_1}, \ldots, V_{\alpha_n}$ là subcover hữu hạn của $f(K)$. $\blacksquare$

> [!theorem] Theorem 5.6 — Extreme Value Theorem (EVT)
> Nếu $f: K \to \mathbb{R}$ liên tục và $K$ compact (và khác rỗng), thì $f$ đạt giá trị lớn nhất và nhỏ nhất trên $K$:
>
> $$
> \exists\, p, q \in K:\; f(p) = \min_{x \in K} f(x),\quad f(q) = \max_{x \in K} f(x)
> $$

**Proof.**
Theo Theorem 5.5, $f(K)$ compact trong $\mathbb{R}$, do đó đóng và bị chặn (Heine-Borel). Vì bị chặn, $\sup f(K)$ và $\inf f(K)$ tồn tại. Vì đóng, $\sup f(K) \in f(K)$ và $\inf f(K) \in f(K)$. $\blacksquare$

> [!theorem] Theorem 5.7 — Ảnh liên tục của connected là connected
> Nếu $f: X \to Y$ liên tục và $E \subseteq X$ connected thì $f(E) \subseteq Y$ connected.

**Proof.**
Giả sử $f(E)$ không connected: tồn tại open sets $U, V$ trong $Y$ là separation của $f(E)$. Khi đó $f^{-1}(U)$ và $f^{-1}(V)$ là open sets trong $X$ tạo thành separation của $E$. Mâu thuẫn với $E$ connected. $\blacksquare$

> [!theorem] Theorem 5.8 — Intermediate Value Theorem (IVT)
> Nếu $f: [a,b] \to \mathbb{R}$ liên tục và $f(a) < c < f(b)$ (hoặc $f(b) < c < f(a)$), thì tồn tại $x_0 \in (a,b)$ sao cho $f(x_0) = c$.

**Proof.**
$[a,b]$ connected (là khoảng trong $\mathbb{R}$). Theo Theorem 5.7, $f([a,b])$ connected trong $\mathbb{R}$, tức $f([a,b])$ là khoảng. Vì $f(a)$ và $f(b)$ thuộc $f([a,b])$ và $c$ nằm giữa chúng, $c \in f([a,b])$. $\blacksquare$

### Worked Example

> [!example] Example 5.9 — Áp dụng IVT
>
> **(a) Tìm nghiệm của $x^5 - x - 1 = 0$**: Đặt $f(x) = x^5 - x - 1$. Thì $f(1) = -1 < 0$ và $f(2) = 29 > 0$. Theo IVT, $\exists x_0 \in (1,2)$: $f(x_0) = 0$.
>
> **(b) Định lý điểm bất động**: Nếu $f: [0,1] \to [0,1]$ liên tục, thì $\exists x_0$: $f(x_0) = x_0$.
>
> *Chứng minh*: Đặt $g(x) = f(x) - x$. Thì $g(0) = f(0) \geq 0$ và $g(1) = f(1) - 1 \leq 0$. Theo IVT, $\exists x_0$: $g(x_0) = 0$, tức $f(x_0) = x_0$. $\blacksquare$

---

## Đồng đều Liên tục (Uniform Continuity)

### Definition

> [!definition] Definition 5.10 — Uniform Continuity
> $f: X \to Y$ **đồng đều liên tục** (uniformly continuous) nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists \delta > 0:\; \forall x, y \in X,\; d_X(x, y) < \delta \Rightarrow d_Y(f(x), f(y)) < \varepsilon
> $$
>
> Khác biệt then chốt với liên tục thông thường: $\delta$ chỉ phụ thuộc vào $\varepsilon$, **không phụ thuộc vào điểm** $x$.

> [!warning] Counterexample 5.11 — Liên tục nhưng không đồng đều liên tục
> $f(x) = x^2$ trên $\mathbb{R}$: liên tục nhưng không uniformly continuous.
>
> *Chứng minh*: Lấy $\varepsilon = 1$. Với mọi $\delta > 0$, chọn $x = 1/\delta$, $y = 1/\delta + \delta/2$. Khi đó $|x - y| = \delta/2 < \delta$ nhưng:
>
> $$
> |f(x) - f(y)| = |x^2 - y^2| = (x+y)\frac{\delta}{2} \approx \frac{2}{\delta} \cdot \frac{\delta}{2} = 1
> $$
>
> Có thể chọn $x$ lớn hơn để $|f(x)-f(y)| > 1$. Vậy $f$ không uniformly continuous.

> [!theorem] Theorem 5.12 — Liên tục trên compact thì đồng đều liên tục
> Nếu $f: K \to Y$ liên tục và $K$ compact thì $f$ uniformly continuous.

**Proof.**
Với $\varepsilon > 0$, mỗi $p \in K$ cho ta $\delta_p > 0$: $d(x, p) < \delta_p \Rightarrow d(f(x), f(p)) < \varepsilon/2$. Họ $\{B(p, \delta_p/2)\}_{p \in K}$ là open cover của $K$, có subcover hữu hạn $B(p_1, \delta_{p_1}/2), \ldots, B(p_n, \delta_{p_n}/2)$.

Đặt $\delta = \frac{1}{2}\min(\delta_{p_1}, \ldots, \delta_{p_n}) > 0$. Cho $x, y \in K$ với $d(x,y) < \delta$. Thì $x \in B(p_i, \delta_{p_i}/2)$ cho một $i$. Kiểm tra $d(y, p_i) \leq d(y, x) + d(x, p_i) < \delta + \delta_{p_i}/2 \leq \delta_{p_i}$. Khi đó:

$$
d(f(x), f(y)) \leq d(f(x), f(p_i)) + d(f(p_i), f(y)) < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon \qquad \blacksquare
$$

---

## Điểm gián đoạn (Discontinuities)

### Definition

> [!definition] Definition 5.13 — Phân loại gián đoạn trong $\mathbb{R}$
> Cho $f: (a,b) \to \mathbb{R}$. Tại điểm gián đoạn $p \in (a,b)$:
>
> - **Gián đoạn loại I** (removable): $\lim_{x \to p} f(x)$ tồn tại nhưng $\neq f(p)$ hoặc $f(p)$ không xác định
> - **Gián đoạn loại I** (jump): $\lim_{x \to p^-} f(x)$ và $\lim_{x \to p^+} f(x)$ đều tồn tại nhưng không bằng nhau
> - **Gián đoạn loại II** (essential): ít nhất một trong hai giới hạn một phía không tồn tại (hữu hạn)

### Worked Example

> [!example] Example 5.14 — Các loại gián đoạn
>
> **(a) Removable**: $f(x) = \dfrac{\sin x}{x}$, $f(0) = 0$. Thì $\lim_{x \to 0} f(x) = 1 \neq f(0)$. Sửa: đặt lại $f(0) = 1$ thì $f$ liên tục.
>
> **(b) Jump**: $f(x) = \text{sign}(x)$ tại $p = 0$: $\lim_{x \to 0^-} = -1$, $\lim_{x \to 0^+} = 1$.
>
> **(c) Essential**: $f(x) = \sin(1/x)$ tại $p = 0$: dao động giữa $-1$ và $1$, không có giới hạn một phía.

> [!theorem] Theorem 5.15 — Hàm đơn điệu chỉ có gián đoạn nhảy
> Nếu $f: (a,b) \to \mathbb{R}$ đơn điệu, thì mọi điểm gián đoạn của $f$ đều là gián đoạn nhảy (loại I). Đặc biệt, tập điểm gián đoạn của $f$ là **đếm được**.

---

## SageMath Cheatsheet

```python
from sympy import *

x, p = symbols('x p', real=True)

# Kiểm tra liên tục theo dãy số
f = x**2
limit_val = limit(f, x, 3)
print(f"lim_{{x->3}} x^2 = {limit_val}")   # 9 = f(3) → liên tục

# Hàm Dirichlet: không liên tục ở đâu
import numpy as np
def dirichlet(x):
    return 1 if abs(x - round(x)) < 1e-9 else 0  # xấp xỉ

# IVT: tìm nghiệm bằng bisection
def bisection(f, a, b, tol=1e-10):
    while b - a > tol:
        mid = (a + b) / 2
        if f(mid) == 0:
            return mid
        elif f(a) * f(mid) < 0:
            b = mid
        else:
            a = mid
    return (a + b) / 2

f_poly = lambda x: x**5 - x - 1
root = bisection(f_poly, 1, 2)
print(f"Nghiệm của x^5 - x - 1 = 0 trong (1,2): {root:.10f}")

# Fixed point theorem: minh họa
import numpy as np
import matplotlib.pyplot as plt

f_fixed = lambda x: np.cos(x)   # f: [0,1] -> (0,1)
x_vals = np.linspace(0, 1.5, 300)
plt.figure(figsize=(6,6))
plt.plot(x_vals, f_fixed(x_vals), label='f(x) = cos(x)', color='blue')
plt.plot(x_vals, x_vals, label='y = x', color='orange', linestyle='--')
plt.xlabel('x'); plt.ylabel('y')
plt.title('Điểm bất động của f(x) = cos(x)')
plt.legend(); plt.grid(True)
# Giao điểm (điểm bất động) ≈ 0.7391 (nghiệm của cos(x) = x)
plt.savefig('fixed_point.png', dpi=100)

# Uniform continuity minh họa
# x^2 trên [0, 10]: delta phụ thuộc vào điểm
def check_uniform(f, a, b, eps=0.1, n=100):
    needed_deltas = []
    for x0 in np.linspace(a, b, n):
        delta = eps / (2 * abs(x0) + 1)  # ước tính
        needed_deltas.append(delta)
    print(f"min delta cần: {min(needed_deltas):.4f}, max: {max(needed_deltas):.4f}")

check_uniform(lambda x: x**2, 0, 10)  # delta rất nhỏ khi x lớn → không uniform
```

---

## Summary / Key Takeaways

- **Liên tục tại $p$**: $\varepsilon$-$\delta$ hoặc tương đương dãy số ($x_n \to p \Rightarrow f(x_n) \to f(p)$). Đặc trưng tô-pô: preimage của open là open.
- **Ba định lý lớn** (khi $f$ liên tục):
  - Ảnh compact → compact → EVT: hàm liên tục trên compact đạt max và min.
  - Ảnh connected → connected → IVT: hàm liên tục trên khoảng đạt mọi giá trị trung gian.
- **Uniform continuity**: $\delta$ không phụ thuộc điểm. Mạnh hơn liên tục thông thường.
- **Liên tục trên compact $\Rightarrow$ Uniformly continuous** (Theorem 5.12) — một trong những định lý quan trọng nhất.
- **Phân loại gián đoạn**: removable, jump (loại I), essential (loại II). Hàm đơn điệu chỉ có jump discontinuities — và tập gián đoạn đếm được.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapters 4.
- Folland, G. B. *Real Analysis* (2nd ed.), Section 1.4.
- Lebl, J. *Basic Analysis I*, Chapter 3.
- Abbott, S. *Understanding Analysis* (2nd ed.), Chapter 4.
