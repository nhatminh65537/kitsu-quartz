---
title: "11. Orthonormal Bases & Fourier Series"
tags: [math, functional-analysis, lesson-11]
aliases: [ONB Fourier Series]
created: 2026-03-31
---

> **Prerequisites**: [[10-hilbert-spaces|10. Hilbert Spaces]]
> **Objectives**:
> - Hiểu cơ sở trực chuẩn (ONB) và Gram-Schmidt
> - Chứng minh đồng nhất thức Parseval và tính hoàn toàn của ONB
> - Áp dụng vào chuỗi Fourier trong $L^2$

---

## Motivation / Intuition

Trong $\mathbb{R}^n$, cơ sở trực chuẩn $\{e_1, \ldots, e_n\}$ cho phép mở rộng bất kỳ vector nào: $x = \sum_{k=1}^n \langle x, e_k \rangle e_k$. Câu hỏi: ta có thể làm điều tương tự trong không gian Hilbert vô hạn chiều không? Câu trả lời là **có** — đây là lý thuyết cơ sở trực chuẩn, và nó đưa đến khai triển Fourier trong $L^2$ như một trường hợp đặc biệt.

---

## Hệ trực chuẩn (Orthonormal System)

> [!definition] Definition 11.1 — Hệ trực chuẩn và ONB
> Họ $(e_\alpha)_{\alpha \in A} \subseteq H$ gọi là **hệ trực chuẩn** (orthonormal system) nếu:
>
> $$
> \langle e_\alpha, e_\beta \rangle = \delta_{\alpha\beta} = \begin{cases} 1 & \alpha = \beta \\ 0 & \alpha \neq \beta \end{cases}
> $$
>
> Một hệ trực chuẩn gọi là **cơ sở trực chuẩn** (orthonormal basis — ONB, hay **complete orthonormal system**) nếu ngoài ra $\overline{\operatorname{span}\{e_\alpha\}} = H$.

> [!theorem] Theorem 11.2 — Gram-Schmidt Orthogonalization
> Cho $(v_1, v_2, v_3, \ldots)$ là dãy độc lập tuyến tính trong $H$. Tồn tại hệ trực chuẩn $(e_1, e_2, e_3, \ldots)$ sao cho $\operatorname{span}\{e_1, \ldots, e_n\} = \operatorname{span}\{v_1, \ldots, v_n\}$ với mọi $n$.

**Proof.** Qui nạp:
- $e_1 = v_1 / \|v_1\|$
- $\tilde{e}_n = v_n - \sum_{k=1}^{n-1} \langle v_n, e_k \rangle e_k$, rồi $e_n = \tilde{e}_n / \|\tilde{e}_n\|$. $\blacksquare$

---

## Bất đẳng thức Bessel và Đồng nhất thức Parseval

> [!theorem] Theorem 11.3 — Bất đẳng thức Bessel
> Cho $(e_n)_{n=1}^\infty$ là hệ trực chuẩn trong $H$. Với mọi $x \in H$:
>
> $$
> \sum_{n=1}^\infty |\langle x, e_n \rangle|^2 \leq \|x\|^2
> $$

**Proof.** Đặt $S_N = \sum_{n=1}^N \langle x, e_n \rangle e_n$. Thì:

$$
0 \leq \|x - S_N\|^2 = \|x\|^2 - \sum_{n=1}^N |\langle x, e_n\rangle|^2
$$

Cho $N \to \infty$. $\blacksquare$

> [!theorem] Theorem 11.4 — Đặc trưng của ONB (4 điều kiện tương đương)
> Cho $(e_n)_{n \geq 1}$ là hệ trực chuẩn trong Hilbert space $H$ phân ly (separable). Các điều sau tương đương:
>
> 1. $(e_n)$ là ONB (complete).
> 2. Nếu $\langle x, e_n \rangle = 0$ với mọi $n$, thì $x = 0$.
> 3. **Khai triển Fourier**: với mọi $x \in H$, $x = \sum_{n=1}^\infty \langle x, e_n \rangle e_n$ (hội tụ trong $H$).
> 4. **Parseval's Identity**: với mọi $x, y \in H$, $\langle x, y \rangle = \sum_{n=1}^\infty \langle x, e_n \rangle \overline{\langle y, e_n \rangle}$.
>    Đặc biệt: $\|x\|^2 = \sum_{n=1}^\infty |\langle x, e_n \rangle|^2$.

**Proof** ($(1) \Rightarrow (3)$). Đặt $S = \sum_n \langle x, e_n \rangle e_n$ (hội tụ theo Bessel). Với $m$ bất kỳ:

$$
\langle x - S, e_m \rangle = \langle x, e_m \rangle - \langle x, e_m \rangle = 0
$$

Vậy $x - S \perp \overline{\operatorname{span}\{e_n\}} = H$, suy ra $x - S = 0$. $\blacksquare$

> [!theorem] Theorem 11.5 — Mọi Hilbert space phân ly đều có ONB
> Mọi Hilbert space phân ly đều có cơ sở trực chuẩn đếm được (countable ONB).

**Proof.** Vì $H$ phân ly, có tập đếm được trù mật $\{v_n\}$. Loại bỏ các phần tử phụ thuộc tuyến tính, rồi áp dụng Gram-Schmidt. $\blacksquare$

---

## Phân loại Hilbert Spaces

> [!theorem] Theorem 11.6 — Phân loại đẳng cấu
> Mọi Hilbert space phân ly **vô hạn chiều** đều đẳng cấu đẳng cự với $\ell^2$. Nghĩa là: nếu $(e_n)$ là ONB của $H$, thì ánh xạ $U: H \to \ell^2$, $Ux = (\langle x, e_n \rangle)_{n \geq 1}$ là **đẳng cấu đẳng cự** (unitary isomorphism).

---

## Chuỗi Fourier trong $L^2$

> [!example] Example 11.7 — ONB của $L^2[-\pi, \pi]$
> Họ hàm:
>
> $$
> e_n(t) = \frac{1}{\sqrt{2\pi}} e^{int}, \quad n \in \mathbb{Z}
> $$
>
> tạo thành ONB của $L^2[-\pi, \pi]$. Kiểm tra trực chuẩn:
>
> $$
> \langle e_m, e_n \rangle = \frac{1}{2\pi} \int_{-\pi}^{\pi} e^{i(m-n)t}\,dt = \delta_{mn}
> $$

> [!definition] Definition 11.8 — Hệ số Fourier và chuỗi Fourier
> Với $f \in L^2[-\pi, \pi]$, **hệ số Fourier** thứ $n$ là:
>
> $$
> \hat{f}(n) = \langle f, e_n \rangle = \frac{1}{\sqrt{2\pi}} \int_{-\pi}^\pi f(t) e^{-int}\,dt
> $$
>
> **Chuỗi Fourier** của $f$:
>
> $$
> f = \sum_{n=-\infty}^\infty \hat{f}(n) e_n \quad \text{(hội tụ trong } L^2 \text{)}
> $$

> [!theorem] Theorem 11.9 — Đồng nhất thức Parseval cho $L^2$
>
> $$
> \|f\|_{L^2}^2 = \int_{-\pi}^\pi |f(t)|^2 \, dt = 2\pi \sum_{n=-\infty}^\infty |\hat{f}(n)|^2
> $$

> [!example] Example 11.10 — Tính $\sum_{n=1}^\infty 1/n^2$ bằng Parseval
> Xét $f(t) = t$ trên $[-\pi, \pi]$. Hệ số Fourier: $\hat{f}(0) = 0$ và $\hat{f}(n) = \frac{(-1)^{n+1}}{n} \cdot \frac{i}{\sqrt{2\pi}} \cdot \sqrt{2\pi} = \frac{(-1)^{n+1} i}{n}$ (tích phân từng phần).
>
> Theo Parseval: $\int_{-\pi}^\pi t^2 dt = 2\pi \sum_{n \neq 0} \frac{1}{n^2}$, tức là:
>
> $$
> \frac{2\pi^3}{3} = 4\pi \sum_{n=1}^\infty \frac{1}{n^2} \implies \sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}
> $$

> [!note] Remark 11.11 — Hội tụ L² vs. hội tụ điểm
> Chuỗi Fourier hội tụ trong $L^2$ **không** có nghĩa là hội tụ điểm mọi chỗ. Tuy nhiên:
> - Nếu $f$ có đạo hàm liên tục (Lipschitz), chuỗi Fourier hội tụ đều.
> - Định lý Carleson (1966): Chuỗi Fourier của $f \in L^2$ hội tụ điểm a.e. — đây là kết quả sâu sắc.

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt

# Gram-Schmidt trong R^3
def gram_schmidt(vectors):
    basis = []
    for v in vectors:
        w = v.copy().astype(float)
        for b in basis:
            w -= np.dot(w, b) * b
        if np.linalg.norm(w) > 1e-10:
            basis.append(w / np.linalg.norm(w))
    return basis

V = [np.array([1,1,0]), np.array([1,0,1]), np.array([0,1,1])]
ONB = gram_schmidt(V)
print("ONB from Gram-Schmidt:")
for i, e in enumerate(ONB):
    print(f"  e{i+1} = {e}")
# Kiểm tra trực chuẩn
for i in range(len(ONB)):
    for j in range(len(ONB)):
        print(f"  <e{i+1}, e{j+1}> = {np.dot(ONB[i], ONB[j]):.6f}", end="")
    print()

# Hệ số Fourier và Parseval
N = 1000
t = np.linspace(-np.pi, np.pi, N, endpoint=False)
f = t  # f(t) = t

# Tính hệ số Fourier (DFT xấp xỉ)
max_n = 20
f_hat = {}
for n in range(-max_n, max_n+1):
    integral = np.trapz(f * np.exp(-1j * n * t), t)
    f_hat[n] = integral / (2 * np.pi)

# Parseval
lhs = np.trapz(np.abs(f)**2, t)
rhs = 2 * np.pi * sum(np.abs(f_hat[n])**2 for n in range(-max_n, max_n+1))
print(f"\nParseval: ||f||^2 = {lhs:.4f}")
print(f"  2π * Σ|f_hat(n)|^2 ≈ {rhs:.4f}  (truncated at |n|={max_n})")
print(f"  Σ 1/n^2 ≈ {sum(1/n**2 for n in range(1, 1000)):.6f}, π²/6 = {np.pi**2/6:.6f}")
```

---

## Summary / Key Takeaways

- **Hệ trực chuẩn** (ONB): $\langle e_m, e_n \rangle = \delta_{mn}$ và $\overline{\operatorname{span}} = H$.
- **Gram-Schmidt**: dãy độc lập tuyến tính $\to$ hệ trực chuẩn.
- **Bất đẳng thức Bessel**: $\sum |\langle x, e_n\rangle|^2 \leq \|x\|^2$.
- **Parseval**: khi ONB đầy đủ, $\sum |\langle x, e_n\rangle|^2 = \|x\|^2$ và khai triển $x = \sum \langle x,e_n\rangle e_n$.
- Mọi Hilbert space phân ly vô hạn chiều $\cong \ell^2$.
- **Chuỗi Fourier** trong $L^2[-\pi,\pi]$: hội tụ trong $L^2$; Parseval $\Rightarrow \sum 1/n^2 = \pi^2/6$.

---

## References

- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 3.
- MIT 18.102, Lectures 20–23.
