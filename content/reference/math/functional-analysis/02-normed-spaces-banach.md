---
title: "02. Normed Spaces & Banach Spaces"
tags: [math, functional-analysis, lesson-02]
aliases: [Normed Spaces Banach Spaces]
created: 2026-03-31
---

> **Prerequisites**: [[01-metric-spaces-topology|01. Metric Spaces & Topology Review]]
> **Objectives**:
> - Hiểu định nghĩa norm và phân biệt với metric
> - Nắm vững các ví dụ cốt lõi: $\ell^p$, $C[a,b]$, $\mathbb{R}^n$
> - Hiểu thế nào là Banach space và tại sao tính đầy đủ quan trọng

---

## Motivation / Intuition

Metric space cho ta **khoảng cách** giữa hai điểm, nhưng không có cấu trúc đại số. Trong Functional Analysis, ta cần làm việc với **không gian vector** (cộng, nhân vô hướng) đồng thời có khái niệm **cỡ** (size/magnitude) của một phần tử. Khái niệm **norm** (chuẩn) giải quyết điều này: nó đo "độ lớn" của một vector, và từ đó sinh ra một metric tương thích với cấu trúc tuyến tính.

Không gian vector có norm mà đầy đủ (mọi dãy Cauchy hội tụ) được gọi là **Banach space** — đây là cấu trúc trung tâm của toàn bộ Functional Analysis.

---

## Không gian chuẩn (Normed Space)

### Definition

> [!definition] Definition 2.1 — Norm và không gian chuẩn (Norm & Normed Space)
> Cho $X$ là không gian vector thực (hoặc phức). Hàm $\|\cdot\|: X \to \mathbb{R}$ được gọi là **norm** nếu thỏa mãn với mọi $x, y \in X$ và $\alpha \in \mathbb{F}$ ($\mathbb{F} = \mathbb{R}$ hoặc $\mathbb{C}$):
>
> 1. **Không âm**: $\|x\| \geq 0$, và $\|x\| = 0 \iff x = 0$
> 2. **Thuần nhất** (Homogeneity): $\|\alpha x\| = |\alpha| \cdot \|x\|$
> 3. **Bất đẳng thức tam giác**: $\|x + y\| \leq \|x\| + \|y\|$
>
> Cặp $(X, \|\cdot\|)$ được gọi là **không gian chuẩn** (normed space). Metric cảm sinh bởi norm là $d(x,y) = \|x - y\|$.

> [!note] Remark 2.2 — Norm sinh ra metric tương thích với cấu trúc tuyến tính
> Metric $d(x,y) = \|x-y\|$ thỏa mãn hai tính chất đặc biệt không có trong metric tổng quát:
> - **Bất biến dịch**: $d(x+z, y+z) = d(x,y)$
> - **Thuần nhất**: $d(\alpha x, \alpha y) = |\alpha| \cdot d(x, y)$
>
> Đây là những tính chất giúp ta "làm giải tích tuyến tính" trên không gian chuẩn.

---

## Các ví dụ quan trọng

### Không gian $\ell^p$ (dãy số)

> [!definition] Definition 2.3 — Không gian $\ell^p$
> Với $1 \leq p < \infty$, định nghĩa:
>
> $$
> \ell^p = \left\{ (x_n)_{n=1}^\infty \subset \mathbb{F} : \sum_{n=1}^\infty |x_n|^p < \infty \right\}
> $$
>
> với norm:
>
> $$
> \|(x_n)\|_p = \left(\sum_{n=1}^\infty |x_n|^p\right)^{1/p}
> $$
>
> Với $p = \infty$:
>
> $$
> \ell^\infty = \left\{(x_n) : \sup_n |x_n| < \infty\right\}, \quad \|(x_n)\|_\infty = \sup_n |x_n|
> $$

> [!example] Example 2.4 — Phần tử trong $\ell^p$
> Xét dãy $x = (1, 1/2, 1/3, 1/4, \ldots) = (1/n)_{n \geq 1}$.
>
> - $x \in \ell^2$ vì $\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6} < \infty$. Và $\|x\|_2 = \pi/\sqrt{6}$.
> - $x \notin \ell^1$ vì $\sum_{n=1}^\infty \frac{1}{n}$ phân kỳ (chuỗi điều hòa).
> - Tổng quát: $\ell^p \subsetneq \ell^q$ với $p < q$.

### Không gian $C[a,b]$ (hàm liên tục)

> [!definition] Definition 2.5 — Không gian $C[a,b]$
> Tập tất cả các hàm liên tục $f: [a,b] \to \mathbb{F}$ với norm sup:
>
> $$
> \|f\|_\infty = \max_{t \in [a,b]} |f(t)|
> $$
>
> $(C[a,b], \|\cdot\|_\infty)$ là không gian chuẩn.

### Bất đẳng thức Hölder và Minkowski (phiên bản dãy)

> [!theorem] Theorem 2.6 — Bất đẳng thức Hölder (dãy số)
> Với $1 < p < \infty$ và $q$ thỏa $\frac{1}{p} + \frac{1}{q} = 1$ (số liên hợp Hölder), với $x \in \ell^p$ và $y \in \ell^q$:
>
> $$
> \sum_{n=1}^\infty |x_n y_n| \leq \|x\|_p \cdot \|y\|_q
> $$

> [!theorem] Theorem 2.7 — Bất đẳng thức Minkowski (dãy số)
> Với $1 \leq p \leq \infty$ và $x, y \in \ell^p$:
>
> $$
> \|x + y\|_p \leq \|x\|_p + \|y\|_p
> $$
>
> Đây chính là tính chất tam giác cho norm $\|\cdot\|_p$, chứng tỏ $\ell^p$ là không gian chuẩn.

**Proof sketch của Minkowski** (cho $1 < p < \infty$): Dùng bất đẳng thức Hölder:

$$
\|x+y\|_p^p = \sum |x_n + y_n|^p \leq \sum |x_n + y_n|^{p-1}(|x_n| + |y_n|)
$$

Tách ra và áp dụng Hölder cho mỗi phần. $\blacksquare$

---

## Không gian Banach (Banach Space)

### Definition

> [!definition] Definition 2.8 — Không gian Banach (Banach Space)
> Một không gian chuẩn $(X, \|\cdot\|)$ được gọi là **không gian Banach** nếu nó **đầy đủ** (complete) với metric $d(x,y) = \|x-y\|$, tức là mọi dãy Cauchy trong $X$ đều hội tụ về một phần tử trong $X$.

> [!theorem] Theorem 2.9 — $\ell^p$ là Banach space
> Với mọi $1 \leq p \leq \infty$, $(\ell^p, \|\cdot\|_p)$ là không gian Banach.

**Proof** (cho $1 \leq p < \infty$). Cho $(x^{(k)})_{k \geq 1}$ là dãy Cauchy trong $\ell^p$, với $x^{(k)} = (x^{(k)}_1, x^{(k)}_2, \ldots)$.

Với mỗi $n$ cố định, vì $|x^{(k)}_n - x^{(m)}_n| \leq \|x^{(k)} - x^{(m)}\|_p \to 0$, dãy $(x^{(k)}_n)_k$ là dãy Cauchy trong $\mathbb{F}$, nên hội tụ về $x_n \in \mathbb{F}$.

Đặt $x = (x_n)$. Cần chứng minh $x \in \ell^p$ và $x^{(k)} \to x$ trong $\ell^p$. Cho $\varepsilon > 0$, chọn $K$ sao cho $\|x^{(k)} - x^{(m)}\|_p < \varepsilon$ với $k, m \geq K$. Với $N$ tùy ý:

$$
\sum_{n=1}^N |x^{(k)}_n - x_n|^p = \lim_{m\to\infty} \sum_{n=1}^N |x^{(k)}_n - x^{(m)}_n|^p \leq \varepsilon^p
$$

Cho $N \to \infty$: $\|x^{(k)} - x\|_p \leq \varepsilon$ với $k \geq K$. Vậy $x^{(k)} \to x$, và $x = x^{(K)} + (x - x^{(K)}) \in \ell^p$. $\blacksquare$

> [!theorem] Theorem 2.10 — $C[a,b]$ là Banach space
> $(C[a,b], \|\cdot\|_\infty)$ là không gian Banach.

**Proof sketch.** Nếu $(f_k)$ là dãy Cauchy trong $C[a,b]$, thì $(f_k(t))$ là dãy Cauchy đều trong $\mathbb{F}$. Đặt $f(t) = \lim_k f_k(t)$. Hội tụ đều bảo toàn tính liên tục, nên $f \in C[a,b]$. $\blacksquare$

> [!warning] Counterexample 2.11 — $C[a,b]$ với norm $L^1$ không phải Banach
> Trang bị $C[0,1]$ với norm $\|f\|_1 = \int_0^1 |f(t)|\,dt$. Dãy:
>
> $$
> f_n(t) = \begin{cases} 0 & 0 \leq t \leq 1/2 - 1/n \\ nt - n/2 + 1 & 1/2 - 1/n < t < 1/2 \\ 1 & 1/2 \leq t \leq 1 \end{cases}
> $$
>
> là Cauchy trong $(C[0,1], \|\cdot\|_1)$ nhưng giới hạn (hàm bậc thang $\mathbf{1}_{[1/2,1]}$) không liên tục, nên không thuộc $C[0,1]$. Đây là lý do cần $L^p$ spaces!

---

## Tương đương của các norm

> [!definition] Definition 2.12 — Hai norm tương đương (Equivalent Norms)
> Hai norm $\|\cdot\|_a$ và $\|\cdot\|_b$ trên $X$ là **tương đương** nếu tồn tại $c, C > 0$ sao cho:
>
> $$
> c\|x\|_a \leq \|x\|_b \leq C\|x\|_a \quad \forall\, x \in X
> $$

> [!theorem] Theorem 2.13 — Mọi norm trên không gian hữu hạn chiều đều tương đương
> Nếu $X$ là không gian vector hữu hạn chiều, thì mọi hai norm trên $X$ đều tương đương.

**Proof sketch.** Đủ chứng minh mọi norm đều tương đương norm Euclid $\|\cdot\|_2$. Dùng tính compact của mặt cầu đơn vị $S = \{x : \|x\|_2 = 1\}$ trong không gian hữu hạn chiều. $\blacksquare$

> [!note] Remark 2.14 — Vô hạn chiều: các norm có thể không tương đương!
> Trong $C[0,1]$: $\|f\|_1 \leq \|f\|_\infty$ nhưng không có chiều ngược lại đồng nhất. Ví dụ $f_n(t) = t^n$: $\|f_n\|_\infty = 1$ nhưng $\|f_n\|_1 = 1/(n+1) \to 0$.

---

## Đặc trưng của Banach space bằng chuỗi

> [!theorem] Theorem 2.15 — Tiêu chuẩn Banach bằng chuỗi tuyệt đối hội tụ
> Một không gian chuẩn $(X, \|\cdot\|)$ là Banach khi và chỉ khi mọi **chuỗi tuyệt đối hội tụ** (absolutely convergent series) đều hội tụ trong $X$:
>
> $$
> \sum_{n=1}^\infty \|x_n\| < \infty \implies \sum_{n=1}^\infty x_n \text{ hội tụ trong } X
> $$

**Proof.**
($\Rightarrow$) Nếu $X$ Banach và $\sum \|x_n\| < \infty$: đặt $S_N = \sum_{n=1}^N x_n$. Với $M > N$:

$$
\|S_M - S_N\| = \left\|\sum_{n=N+1}^M x_n\right\| \leq \sum_{n=N+1}^M \|x_n\| \to 0
$$

nên $(S_N)$ là dãy Cauchy, suy ra hội tụ.

($\Leftarrow$) Cho $(y_n)$ là dãy Cauchy. Chọn dãy con $y_{n_k}$ với $\|y_{n_{k+1}} - y_{n_k}\| < 2^{-k}$. Đặt $x_k = y_{n_{k+1}} - y_{n_k}$. Vì $\sum \|x_k\| < \infty$, chuỗi $\sum x_k$ hội tụ, suy ra $(y_{n_k})$ hội tụ, rồi cả $(y_n)$ hội tụ. $\blacksquare$

---

## SageMath Cheatsheet

```python
import numpy as np

# Norm l^p trong R^n
x = np.array([1.0, -2.0, 3.0])

norm_1   = np.linalg.norm(x, ord=1)
norm_2   = np.linalg.norm(x, ord=2)
norm_inf = np.linalg.norm(x, ord=np.inf)
print(f"||x||_1={norm_1}, ||x||_2={norm_2:.4f}, ||x||_inf={norm_inf}")

# Bất đẳng thức Hölder: sum |x_n y_n| <= ||x||_p ||y||_q
p, q = 2.0, 2.0   # 1/p + 1/q = 1
y = np.array([4.0, 0.5, -1.0])
lhs = np.sum(np.abs(x * y))
rhs = np.linalg.norm(x, ord=p) * np.linalg.norm(y, ord=q)
print(f"Hölder: {lhs:.4f} <= {rhs:.4f}? {lhs <= rhs + 1e-10}")

# Kiểm tra l^2: dãy 1/n^2 hội tụ
N = 10000
partial_sum = sum(1/n**2 for n in range(1, N+1))
import math
print(f"Sum 1/n^2 ≈ {partial_sum:.6f}, pi^2/6 = {math.pi**2/6:.6f}")
```

---

## Summary / Key Takeaways

- **Norm** = độ lớn của vector, thỏa 3 tiên đề: không âm, thuần nhất, tam giác.
- Norm sinh ra metric $d(x,y) = \|x-y\|$ tương thích cấu trúc tuyến tính.
- **Banach space** = không gian chuẩn đầy đủ. Ví dụ: $\ell^p$ ($1 \leq p \leq \infty$), $C[a,b]$ với sup-norm.
- $\ell^p \subsetneq \ell^q$ khi $p < q$.
- Mọi norm trên không gian hữu hạn chiều đều tương đương — **không đúng** trong vô hạn chiều.
- Tiêu chuẩn Banach bằng chuỗi: $X$ Banach $\iff$ mọi chuỗi tuyệt đối hội tụ đều hội tụ.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 1.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapters 2–3.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
- MIT 18.102, Lecture 1–2.
