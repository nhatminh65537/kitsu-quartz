---
title: "10. Hilbert Spaces"
tags: [math, functional-analysis, lesson-10]
aliases: [Hilbert Spaces]
created: 2026-03-31
---

> **Prerequisites**: [[09-lp-spaces|09. Lp Spaces]]
> **Objectives**:
> - Hiểu cấu trúc inner product và phân biệt với cấu trúc norm
> - Chứng minh Projection Theorem và phân tích trực giao $H = M \oplus M^\perp$
> - Nắm vững Riesz Representation Theorem — $H \cong H^*$

---

## Motivation / Intuition

Không gian Banach cho ta norm (độ lớn), nhưng không có khái niệm **góc** hay **vuông góc**. Không gian Hilbert bổ sung thêm **tích trong** (inner product) — tổng quát hóa tích vô hướng trong $\mathbb{R}^n$ — và từ đó sinh ra hình học phong phú: chiếu vuông góc, cơ sở trực chuẩn, khai triển Fourier. Đây là lớp không gian "đẹp" nhất trong Functional Analysis và là nền tảng của cơ học lượng tử.

---

## Inner Product Space

> [!definition] Definition 10.1 — Tích trong (Inner Product)
> Cho $H$ là không gian vector thực hoặc phức. **Tích trong** (inner product) là hàm $\langle \cdot, \cdot \rangle: H \times H \to \mathbb{F}$ thỏa với mọi $x, y, z \in H$, $\alpha \in \mathbb{F}$:
>
> 1. **Tuyến tính ở đối số đầu**: $\langle \alpha x + y, z \rangle = \alpha \langle x, z \rangle + \langle y, z \rangle$
> 2. **Liên hợp đối xứng**: $\langle x, y \rangle = \overline{\langle y, x \rangle}$
> 3. **Dương xác định**: $\langle x, x \rangle \geq 0$, và $\langle x, x \rangle = 0 \iff x = 0$
>
> Cặp $(H, \langle \cdot, \cdot \rangle)$ gọi là **inner product space** (hay **pre-Hilbert space**).
>
> Norm cảm sinh bởi tích trong: $\|x\| = \sqrt{\langle x, x \rangle}$.

> [!note] Remark 10.2 — Quy ước phức
> Trong trường hợp phức, tích trong là **sesquilinear**: tuyến tính ở đối số đầu và **antilinear** ở đối số sau: $\langle x, \alpha y \rangle = \bar{\alpha} \langle x, y \rangle$. Quy ước này (tuyến tính ở đối số đầu) là chuẩn trong toán học; vật lý lý thuyết dùng quy ước ngược.

> [!theorem] Theorem 10.3 — Bất đẳng thức Cauchy-Schwarz
> Với mọi $x, y \in H$:
>
> $$
> |\langle x, y \rangle| \leq \|x\| \cdot \|y\|
> $$
>
> Dấu bằng khi và chỉ khi $x$ và $y$ tỉ lệ tuyến tính.

**Proof.** Với $y = 0$ hiển nhiên. Với $y \neq 0$, với $t \in \mathbb{F}$:

$$
0 \leq \|x - ty\|^2 = \|x\|^2 - t\langle y, x\rangle - \bar{t}\langle x, y\rangle + |t|^2\|y\|^2
$$

Chọn $t = \langle x, y\rangle / \|y\|^2$:

$$
0 \leq \|x\|^2 - \frac{|\langle x,y\rangle|^2}{\|y\|^2}. \quad \blacksquare
$$

> [!theorem] Theorem 10.4 — Parallelogram Law (Luật bình hành)
> Trong mọi inner product space:
>
> $$
> \|x + y\|^2 + \|x - y\|^2 = 2\|x\|^2 + 2\|y\|^2
> $$
>
> **Đặc trưng inner product**: Một norm trên $X$ đến từ một inner product khi và chỉ khi nó thỏa Parallelogram Law.

> [!definition] Definition 10.5 — Không gian Hilbert (Hilbert Space)
> **Không gian Hilbert** là inner product space $(H, \langle \cdot, \cdot \rangle)$ đầy đủ với norm $\|x\| = \sqrt{\langle x, x \rangle}$.

> [!example] Example 10.6 — Các không gian Hilbert tiêu chuẩn
> **a)** $\mathbb{R}^n$ và $\mathbb{C}^n$ với $\langle x, y \rangle = \sum_{k=1}^n x_k \bar{y}_k$.
>
> **b)** $\ell^2$: $\langle x, y \rangle = \sum_{n=1}^\infty x_n \bar{y}_n$ (hội tụ theo Cauchy-Schwarz).
>
> **c)** $L^2(\mu)$: $\langle f, g \rangle = \int f \bar{g} \, d\mu$.
>
> Lưu ý: $L^p$ với $p \neq 2$ **không** phải Hilbert space (Parallelogram Law thất bại).

---

## Trực giao và Projection Theorem

> [!definition] Definition 10.7 — Trực giao (Orthogonality)
> $x, y \in H$ gọi là **trực giao** (orthogonal), ký hiệu $x \perp y$, nếu $\langle x, y \rangle = 0$.
>
> Với $S \subseteq H$, **phần bù trực giao** (orthogonal complement):
>
> $$
> S^\perp = \{x \in H : \langle x, s \rangle = 0 \text{ với mọi } s \in S\}
> $$

> [!theorem] Theorem 10.8 — Tính chất của $S^\perp$
> Với mọi $S \subseteq H$:
>
> 1. $S^\perp$ là không gian con **đóng** của $H$.
> 2. $S \cap S^\perp \subseteq \{0\}$.
> 3. $S \subseteq (S^\perp)^\perp$.
> 4. $(S^\perp)^\perp = \overline{\operatorname{span}(S)}$.

> [!theorem] Theorem 10.9 — Projection Theorem (Định lý chiếu)
> Cho $M$ là không gian con **đóng** của Hilbert space $H$. Thì:
>
> $$
> H = M \oplus M^\perp
> $$
>
> Tức là mọi $x \in H$ có thể viết duy nhất thành $x = m + m^\perp$ với $m \in M$, $m^\perp \in M^\perp$.
>
> Ánh xạ chiếu trực giao $P_M: H \to M$, $P_M(x) = m$, là toán tử tuyến tính bị chặn với $\|P_M\| = 1$ (nếu $M \neq \{0\}$) và $P_M^2 = P_M$, $P_M^* = P_M$.

**Proof.** Với $x \in H$, đặt $d = \inf_{m \in M} \|x - m\|$. Chọn dãy $m_n \in M$ với $\|x - m_n\| \to d$. Dùng Parallelogram Law:

$$
\|m_n - m_k\|^2 = 2\|x - m_n\|^2 + 2\|x - m_k\|^2 - 4\left\|x - \frac{m_n + m_k}{2}\right\|^2 \leq 2\|x-m_n\|^2 + 2\|x-m_k\|^2 - 4d^2 \to 0
$$

(vì $(m_n + m_k)/2 \in M$ nên $\|x - (m_n+m_k)/2\| \geq d$). Vậy $(m_n)$ Cauchy, hội tụ về $m \in M$ (đóng). Kiểm tra $x - m \perp M$: với $z \in M$ và $t \in \mathbb{R}$, $\|x - (m + tz)\|^2 \geq d^2 = \|x-m\|^2$ cho $\langle x-m, z \rangle = 0$. $\blacksquare$

> [!corollary] Corollary 10.10
> Nếu $M$ là không gian con đóng của $H$ và $M \neq H$, thì tồn tại $x \neq 0$ với $x \perp M$.

---

## Riesz Representation Theorem

> [!theorem] Theorem 10.11 — Riesz Representation Theorem (cho Hilbert space)
> Cho $H$ là không gian Hilbert. Với mọi $f \in H^*$ (phiếm hàm tuyến tính bị chặn), tồn tại duy nhất $y \in H$ sao cho:
>
> $$
> f(x) = \langle x, y \rangle \quad \forall\, x \in H
> $$
>
> và $\|f\|_{H^*} = \|y\|_H$. Ánh xạ $\Phi: H \to H^*$, $\Phi(y) = \langle \cdot, y \rangle$ là **đẳng cấu đẳng cự** (isometric isomorphism) — antilinear trong trường hợp phức.

**Proof.** Với $f = 0$, lấy $y = 0$. Với $f \neq 0$: $\ker f$ là không gian con đóng khác $H$. Theo Corollary 10.10, tồn tại $z \perp \ker f$ với $\|z\| = 1$ và $f(z) \neq 0$. Với $x \in H$:

$$
x - \frac{f(x)}{f(z)} z \in \ker f \implies \left\langle x - \frac{f(x)}{f(z)} z,\ z \right\rangle = 0
$$

$$
\implies f(x) = \frac{f(z)}{\|z\|^2} \langle x, z \rangle = \langle x, \overline{f(z)} z \rangle
$$

Đặt $y = \overline{f(z)} z$. Duy nhất: nếu $\langle x, y \rangle = \langle x, y' \rangle$ với mọi $x$ thì $y = y'$. $\blacksquare$

> [!note] Remark 10.12 — Hilbert space tự đối ngẫu
> Hệ quả: $H \cong H^*$ (isometric, antilinear trong trường hợp phức). Mọi Hilbert space là **reflexive**: $H \cong H^{**}$. Đây là lý do Hilbert space có nhiều tính chất "tốt" hơn Banach space tổng quát.

---

## Adjoint Operator trên Hilbert Space

> [!definition] Definition 10.13 — Toán tử liên hợp (Adjoint Operator)
> Cho $T \in B(H)$. **Toán tử liên hợp** (adjoint) $T^*: H \to H$ được xác định bởi:
>
> $$
> \langle Tx, y \rangle = \langle x, T^*y \rangle \quad \forall\, x, y \in H
> $$
>
> Tồn tại và duy nhất theo Riesz Representation Theorem. Và $\|T^*\| = \|T\|$, $\|T^*T\| = \|T\|^2$.

> [!definition] Definition 10.14 — Các lớp toán tử đặc biệt
> Cho $T \in B(H)$:
>
> - **Self-adjoint** (tự liên hợp): $T^* = T$, tức là $\langle Tx, y \rangle = \langle x, Ty \rangle$
> - **Unitary** (đơn nhất): $T^*T = TT^* = I$, tức là $T$ song ánh và $\langle Tx, Ty \rangle = \langle x, y \rangle$
> - **Normal**: $T^*T = TT^*$
> - **Orthogonal projection**: $T^2 = T$ và $T^* = T$

> [!theorem] Theorem 10.15 — Tính chất phổ của self-adjoint
> Nếu $T \in B(H)$ là self-adjoint, thì:
>
> 1. Mọi giá trị riêng của $T$ đều là thực.
> 2. Các vector riêng ứng với giá trị riêng khác nhau là trực giao.
> 3. $\|T\| = \sup_{\|x\|=1} |\langle Tx, x \rangle|$.

---

## SageMath Cheatsheet

```python
import numpy as np

# Kiểm tra Cauchy-Schwarz trong L^2
x = np.array([1.0, 2.0, -1.0, 3.0])
y = np.array([2.0, -1.0, 0.0, 1.0])

inner = np.dot(x, y)
norm_x = np.linalg.norm(x)
norm_y = np.linalg.norm(y)
print(f"|<x,y>| = {abs(inner):.4f} <= ||x||*||y|| = {norm_x*norm_y:.4f}")

# Parallelogram Law
lhs = np.linalg.norm(x+y)**2 + np.linalg.norm(x-y)**2
rhs = 2*norm_x**2 + 2*norm_y**2
print(f"Parallelogram: {lhs:.4f} == {rhs:.4f}? {np.isclose(lhs, rhs)}")

# Projection lên không gian con M = span{e1, e2}
def project_onto_subspace(x, basis):
    """Gram-Schmidt nếu basis chưa trực chuẩn"""
    P = np.zeros_like(x)
    for b in basis:
        b_norm = b / np.linalg.norm(b)
        P += np.dot(x, b_norm) * b_norm
    return P

e1 = np.array([1.0, 0.0, 0.0, 0.0])
e2 = np.array([0.0, 1.0, 0.0, 0.0])
x3 = np.array([3.0, 4.0, 1.0, 2.0])
Px = project_onto_subspace(x3, [e1, e2])
print(f"\nProjection of x3 = {x3}")
print(f"  P_M(x3) = {Px}  (phần trong M)")
print(f"  x3 - P_M(x3) = {x3 - Px}  (phần trong M^perp)")
print(f"  Trực giao? {np.isclose(np.dot(Px, x3-Px), 0)}")

# Self-adjoint matrix: A = A^T (real case)
A = np.array([[2.0, 1.0, 0.0],
              [1.0, 3.0, 1.0],
              [0.0, 1.0, 2.0]])
print(f"\nA self-adjoint? {np.allclose(A, A.T)}")
eigenvalues = np.linalg.eigvalsh(A)
print(f"Eigenvalues (all real): {eigenvalues}")
print(f"||A|| = {np.linalg.norm(A, ord=2):.4f}")
print(f"sup |<Ax,x>| = {max(abs(eigenvalues)):.4f}  (nên bằng ||A||)")
```

---

## Summary / Key Takeaways

- **Hilbert space** = inner product space đầy đủ. Ví dụ: $\mathbb{R}^n$, $\ell^2$, $L^2(\mu)$.
- **Cauchy-Schwarz**: $|\langle x,y\rangle| \leq \|x\|\|y\|$; **Parallelogram Law** đặc trưng inner product.
- **Projection Theorem**: $H = M \oplus M^\perp$ với $M$ đóng. Mọi $x$ chiếu duy nhất lên $M$.
- **Riesz Representation**: $H^* \cong H$; mọi phiếm hàm tuyến tính bị chặn có dạng $f(x) = \langle x, y\rangle$.
- **Adjoint** $T^*$: $\langle Tx, y\rangle = \langle x, T^*y\rangle$; tồn tại duy nhất, $\|T^*\| = \|T\|$.
- **Self-adjoint**: $T = T^*$ — giá trị riêng thực, vector riêng trực giao.
- Hilbert space luôn **reflexive**: $H \cong H^{**}$.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 3.
- MIT 18.102, Lectures 16–19.
