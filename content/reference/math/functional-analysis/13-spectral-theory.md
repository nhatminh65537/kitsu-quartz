---
title: "13. Spectral Theory — Banach Algebras"
tags: [math, functional-analysis, lesson-13]
aliases: [Spectral Theory Banach Algebras]
created: 2026-03-31
---

> **Prerequisites**: [[06-hahn-banach-duality|06. Hahn-Banach Theorem & Duality]], [[12-compact-operators|12. Compact Operators]]
> **Objectives**:
> - Hiểu Banach algebra và C*-algebra
> - Định nghĩa phổ (spectrum) và resolvent của toán tử
> - Chứng minh công thức spectral radius và tính chất của phổ

---

## Motivation / Intuition

Trong đại số tuyến tính hữu hạn chiều, **phổ** của ma trận là tập eigenvalue. Trong vô hạn chiều, khái niệm này trở nên tinh tế hơn nhiều: một toán tử có thể thiếu eigenvalue mà vẫn không khả nghịch (như right shift trên $\ell^2$). Lý thuyết phổ trong Banach algebra đưa ra framework thống nhất: phổ luôn compact, không rỗng (theo định lý Liouville), và spectral radius formula kết nối phổ với norm.

---

## Banach Algebra

> [!definition] Definition 13.1 — Banach Algebra
> Một **Banach algebra** (có đơn vị) là không gian Banach $(A, \|\cdot\|)$ đồng thời là đại số kết hợp (associative algebra) với phép nhân thỏa:
>
> 1. **Không đẳng thức nhân**: $\|xy\| \leq \|x\|\|y\|$ với mọi $x, y \in A$
> 2. **Đơn vị**: tồn tại $e \in A$ với $\|e\| = 1$ và $ex = xe = x$ với mọi $x$

> [!example] Example 13.2 — Các Banach algebra tiêu chuẩn
> **a)** $B(X)$ — toán tử bị chặn trên Banach space $X$, với phép nhân là hợp toán tử.
>
> **b)** $C(K)$ — hàm liên tục trên compact $K$, với sup-norm và phép nhân điểm.
>
> **c)** $\ell^1(\mathbb{Z})$ — với convolution: $(f * g)(n) = \sum_k f(k) g(n-k)$.
>
> **d)** $M_n(\mathbb{C})$ — ma trận $n \times n$ với norm toán tử.

> [!definition] Definition 13.3 — C*-algebra
> Banach algebra $A$ gọi là **C*-algebra** nếu có thêm **involution** $*: A \to A$ thỏa $(xy)^* = y^*x^*$, $(x^*)^* = x$, $(\alpha x)^* = \bar\alpha x^*$, và **C*-identity**: $\|x^*x\| = \|x\|^2$.
>
> Ví dụ: $B(H)$ với $(T^*)^* = T$; $C(K)$ với $f^* = \bar{f}$.

---

## Phổ và Resolvent

> [!definition] Definition 13.4 — Spectrum và Resolvent Set
> Cho $A$ là Banach algebra có đơn vị $e$ và $x \in A$.
>
> - **Resolvent set** (tập phân giải): $\rho(x) = \{\lambda \in \mathbb{C} : \lambda e - x \in G(A)\}$ (trong đó $G(A)$ là nhóm các phần tử khả nghịch).
> - **Spectrum** (phổ): $\sigma(x) = \mathbb{C} \setminus \rho(x)$.
> - **Resolvent**: $R(\lambda, x) = (\lambda e - x)^{-1}$ với $\lambda \in \rho(x)$.

> [!example] Example 13.5 — Ba loại phổ cho toán tử trên Banach space
> Với $T \in B(X)$ và $\lambda \in \sigma(T)$:
>
> - **Point spectrum** $\sigma_p(T)$: $\lambda I - T$ không đơn ánh (tức là $\lambda$ là eigenvalue).
> - **Continuous spectrum** $\sigma_c(T)$: $\lambda I - T$ đơn ánh, có miền ảnh trù mật nhưng **không** toàn ánh.
> - **Residual spectrum** $\sigma_r(T)$: $\lambda I - T$ đơn ánh nhưng miền ảnh **không** trù mật.

> [!example] Example 13.6 — Phổ của right shift $R$ trên $\ell^2$
> $R(x_1, x_2, \ldots) = (0, x_1, x_2, \ldots)$.
>
> - $\sigma_p(R) = \emptyset$ (không có eigenvalue).
> - $\sigma(R) = \{\lambda : |\lambda| \leq 1\}$ (đĩa đơn vị đóng).
> - $\sigma_r(R) = \{\lambda : |\lambda| < 1\}$.
>
> Phổ của $L$ (left shift): $\sigma(L) = \{\lambda : |\lambda| \leq 1\}$, $\sigma_p(L) = \{\lambda : |\lambda| < 1\}$.

---

## Tính chất cơ bản của phổ

> [!theorem] Theorem 13.7 — Phổ luôn compact và không rỗng
> Cho $A$ là Banach algebra (phức, có đơn vị) và $x \in A$. Khi đó:
>
> 1. $\sigma(x)$ là tập **compact** và **không rỗng** trong $\mathbb{C}$.
> 2. $\sigma(x) \subseteq \{\lambda : |\lambda| \leq \|x\|\}$.
> 3. Resolvent $\lambda \mapsto R(\lambda, x)$ là hàm **holomorphic** trên $\rho(x)$.

**Proof sketch của không rỗng.** Giả sử $\sigma(x) = \emptyset$, tức là $\lambda \mapsto R(\lambda, x)$ xác định trên $\mathbb{C}$. Khi $|\lambda| > \|x\|$: $\lambda e - x = \lambda(e - x/\lambda)$ khả nghịch với $R(\lambda,x) = \frac{1}{\lambda}\sum_{n=0}^\infty (x/\lambda)^n$, suy ra $\|R(\lambda, x)\| \to 0$ khi $|\lambda| \to \infty$.

Với mọi $f \in A^*$, hàm $g(\lambda) = f(R(\lambda,x))$ là holomorphic trên $\mathbb{C}$ và $|g(\lambda)| \to 0$ khi $|\lambda| \to \infty$. Theo Liouville: $g \equiv 0$. Vì $A^*$ tách các điểm: $R(\lambda,x) = 0$ với mọi $\lambda$ — mâu thuẫn với $R(\lambda,x)(\lambda e - x) = e$. $\blacksquare$

> [!theorem] Theorem 13.8 — Spectral Radius Formula
> Với $x \in A$, **spectral radius** $r(x) = \sup_{\lambda \in \sigma(x)} |\lambda|$ thỏa:
>
> $$
> r(x) = \lim_{n \to \infty} \|x^n\|^{1/n} = \inf_{n \geq 1} \|x^n\|^{1/n}
> $$

**Proof.** Đặt $\ell = \liminf_n \|x^n\|^{1/n}$. Nếu $|\lambda| > \|x\|$: $R(\lambda,x) = \frac{1}{\lambda}\sum_{n=0}^\infty (x/\lambda)^n$, suy ra $r(x) \leq \|x\|$. 

Dùng khai triển Laurent của resolvent tại $\infty$: $R(\lambda,x) = \sum_{n=0}^\infty x^n / \lambda^{n+1}$ hội tụ khi $|\lambda| > r(x)$. Phân tích bán kính hội tụ dùng Hadamard formula cho series vector: $r(x) = \limsup_n \|x^n\|^{1/n}$. Kết hợp: $r(x) = \lim_n \|x^n\|^{1/n}$. $\blacksquare$

> [!corollary] Corollary 13.9
> Trong C*-algebra: $r(x^*x) = \|x^*x\| = \|x\|^2$. Và nếu $x$ là **normal** ($x^*x = xx^*$) thì $r(x) = \|x\|$.

---

## Gelfand Transform

> [!definition] Definition 13.10 — Maximal Ideal Space và Gelfand Transform
> Cho $A$ là Banach algebra giao hoán có đơn vị. **Maximal ideal space** (hay **character space**) $\Delta(A)$ là tập các homomorphism đại số khác không $h: A \to \mathbb{C}$ (gọi là **characters**), trang bị với weak-* topology.
>
> **Gelfand transform**: $\hat{x}: \Delta(A) \to \mathbb{C}$, $\hat{x}(h) = h(x)$.

> [!theorem] Theorem 13.11 — Gelfand Representation Theorem
> Cho $A$ là Banach algebra giao hoán có đơn vị. Khi đó:
>
> 1. $\Delta(A)$ là không gian compact Hausdorff.
> 2. Với mọi $x \in A$: $\sigma(x) = \hat{x}(\Delta(A))$ (ảnh của Gelfand transform).
> 3. Ánh xạ $x \mapsto \hat{x}$ là homomorphism đại số từ $A$ vào $C(\Delta(A))$ và $\|\hat{x}\|_\infty = r(x) \leq \|x\|$.
> 4. **Isometry** khi $A$ là C*-algebra giao hoán: $\|\hat{x}\|_\infty = \|x\|$.

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt

# Tính phổ của ma trận (Banach algebra M_n(C))
A = np.array([[2.0, 1.0, 0.0],
              [0.0, 3.0, 1.0],
              [0.0, 0.0, 1.5]])

eigenvalues = np.linalg.eigvals(A)
spectral_radius = np.max(np.abs(eigenvalues))
op_norm = np.linalg.norm(A, ord=2)

print(f"Eigenvalues: {eigenvalues}")
print(f"Spectral radius r(A) = {spectral_radius:.4f}")
print(f"||A|| = {op_norm:.4f}  (r(A) <= ||A||? {spectral_radius <= op_norm + 1e-10})")

# Kiểm tra spectral radius formula: r(A) = lim ||A^n||^{1/n}
print("\nSpectral radius formula ||A^n||^{1/n}:")
An = np.eye(len(A))
for n in [1, 2, 5, 10, 20, 50, 100]:
    for _ in range(n):
        An = An @ A
    # tính lại đúng
    An_true = np.linalg.matrix_power(A, n)
    val = np.linalg.norm(An_true, ord=2)**(1/n)
    print(f"  n={n:3d}: ||A^n||^(1/n) = {val:.6f}  (r(A) = {spectral_radius:.6f})")

# Phổ của right shift (truncated)
n = 10
R = np.diag(np.ones(n-1), -1)
eig_R = np.linalg.eigvals(R)
print(f"\nEigenvalues of truncated right shift (n={n}):")
print(f"  {np.round(np.sort(np.abs(eig_R)), 4)}")
print("  (Full right shift has no eigenvalues, spectrum = closed unit disk)")
```

---

## Summary / Key Takeaways

- **Banach algebra**: Banach space + đại số kết hợp với $\|xy\| \leq \|x\|\|y\|$.
- **Spectrum** $\sigma(x)$: tập $\lambda$ sao cho $\lambda e - x$ không khả nghịch — compact, không rỗng.
- Ba loại phổ: point ($\sigma_p$), continuous ($\sigma_c$), residual ($\sigma_r$).
- **Spectral radius**: $r(x) = \lim_n \|x^n\|^{1/n} \leq \|x\|$; bằng $\|x\|$ khi $x$ normal trong C*-algebra.
- **Gelfand transform**: Banach algebra giao hoán $\to$ $C(\Delta(A))$; isometry khi C*-algebra giao hoán.
- Resolvent holomorphic $\Rightarrow$ kết quả về phổ dùng phân tích phức (Liouville, Cauchy).

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapters 10–11.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 7.
- Williams, D. P. *Lecture Notes on the Spectral Theorem*, Dartmouth.
- ETH Zürich, Spectral Theory in Hilbert Spaces (Kowalski).
