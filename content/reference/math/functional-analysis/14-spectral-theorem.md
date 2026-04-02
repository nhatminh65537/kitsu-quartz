---
title: "14. Spectral Theorem"
tags: [math, functional-analysis, lesson-14]
aliases: [Spectral Theorem]
created: 2026-03-31
---

> **Prerequisites**: [[11-onb-fourier|11. Orthonormal Bases & Fourier Series]], [[12-compact-operators|12. Compact Operators]], [[13-spectral-theory|13. Spectral Theory — Banach Algebras]]
> **Objectives**:
> - Chứng minh Spectral Theorem cho compact self-adjoint operators
> - Nắm vững Spectral Theorem cho bounded self-adjoint operators (dạng spectral measure)
> - Hiểu functional calculus và ứng dụng

---

## Motivation / Intuition

Trong $\mathbb{R}^n$, Spectral Theorem cho ma trận đối xứng nói rằng: ma trận đối xứng $A = A^T$ có thể **chéo hóa trực giao** — tức là $A = U D U^T$ với $U$ unitary và $D$ chéo. Trong vô hạn chiều, "chéo hóa" có nghĩa là tìm ONB gồm các vector riêng. Spectral Theorem trong Hilbert space tổng quát hóa điều này: mọi compact self-adjoint operator đều có ONB gồm vector riêng; mọi bounded self-adjoint operator có **spectral measure** thay thế cho ONB trong trường hợp phổ liên tục.

---

## Spectral Theorem cho Compact Self-Adjoint Operators

> [!theorem] Theorem 14.1 — Tồn tại eigenvalue của toán tử compact self-adjoint
> Cho $T \in K(H)$ là compact và self-adjoint ($T^* = T$), $T \neq 0$. Khi đó $\|T\|$ hoặc $-\|T\|$ là eigenvalue của $T$, và:
>
> $$
> \|T\| = \sup_{\|x\|=1} |\langle Tx, x \rangle|
> $$

**Proof.** Đặt $M = \sup_{\|x\|=1} \langle Tx, x \rangle$ (thực vì $T$ self-adjoint). Ta có $M = \|T\|$ hoặc $-\|T\| = \inf_{\|x\|=1}\langle Tx,x\rangle$.

Giả sử $M = \|T\| > 0$. Chọn dãy $\|x_n\| = 1$ với $\langle Tx_n, x_n\rangle \to M$. Tính:

$$
\|Tx_n - Mx_n\|^2 = \|Tx_n\|^2 - 2M\langle Tx_n, x_n\rangle + M^2 \leq 2M^2 - 2M\langle Tx_n, x_n\rangle \to 0
$$

Vì $T$ compact, $(Tx_n)$ có dãy con $Tx_{n_k} \to w$. Thì $Mx_{n_k} \to w$ và $\|w\| = M > 0$. Đặt $x_0 = w/M$: $Tx_{n_k}/M \to x_0$ nên $Tx_0 = T(\lim_k x_{n_k}) = \lim_k Tx_{n_k} = w = Mx_0$. Vậy $Tx_0 = Mx_0$. $\blacksquare$

> [!theorem] Theorem 14.2 — Spectral Theorem cho Compact Self-Adjoint (toàn bộ)
> Cho $T \in K(H)$ là compact self-adjoint trên Hilbert space phân ly vô hạn chiều. Khi đó:
>
> 1. Tồn tại dãy thực $(\lambda_n)$ (eigenvalues, có thể hữu hạn) với $|\lambda_1| \geq |\lambda_2| \geq \cdots \to 0$.
> 2. Tồn tại họ trực chuẩn $(e_n)$ tương ứng: $Te_n = \lambda_n e_n$.
> 3. Với mọi $x \in H$:
>
> $$
> Tx = \sum_{n=1}^\infty \lambda_n \langle x, e_n \rangle e_n
> $$
>
> 4. Nếu $H$ vô hạn chiều và $\lambda_n \neq 0$ với mọi $n$: $(e_n)$ tạo thành ONB cho $(\ker T)^\perp = \overline{\operatorname{ran}T}$.

**Proof.** Dùng Theorem 14.1 lặp lại: $\lambda_1$ là eigenvalue với $|\lambda_1| = \|T\|$, $e_1$ là vector riêng tương ứng. Hạn chế $T$ lên $\{e_1\}^\perp$ (bất biến vì $T$ self-adjoint), lấy eigenvalue $\lambda_2$ của $T|_{\{e_1\}^\perp}$, v.v. Vì $T$ compact, $\lambda_n \to 0$. $\blacksquare$

> [!example] Example 14.3 — Diagonalization của toán tử tích phân
> Toán tử $T: L^2[0,1] \to L^2[0,1]$, $(Tf)(x) = \int_0^1 \min(x,t) f(t)\,dt$ là compact self-adjoint. Eigenvalues: $\lambda_n = \frac{4}{(2n-1)^2\pi^2}$, eigenvectors: $e_n(x) = \sqrt{2}\sin\!\left(\frac{(2n-1)\pi x}{2}\right)$.
>
> Khai triển: $Tf = \sum_{n=1}^\infty \lambda_n \langle f, e_n \rangle e_n$.

---

## Spectral Theorem cho Bounded Self-Adjoint Operators

> [!definition] Definition 14.4 — Spectral Measure (Projection-Valued Measure)
> Trên $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$, **spectral measure** (hay projection-valued measure — PVM) là ánh xạ $E: \mathcal{B}(\mathbb{R}) \to B(H)$ thỏa:
>
> 1. $E(\Omega)$ là orthogonal projection với mọi $\Omega \in \mathcal{B}(\mathbb{R})$.
> 2. $E(\emptyset) = 0$, $E(\mathbb{R}) = I$.
> 3. $E(\Omega_1 \cap \Omega_2) = E(\Omega_1) E(\Omega_2)$ với mọi $\Omega_1, \Omega_2 \in \mathcal{B}(\mathbb{R})$.
> 4. $\sigma$-additive: nếu $(\Omega_n)$ rời nhau từng đôi thì $E\!\left(\bigsqcup_n \Omega_n\right)x = \sum_n E(\Omega_n)x$ trong $H$.

> [!theorem] Theorem 14.5 — Spectral Theorem (cho bounded self-adjoint)
> Cho $T \in B(H)$ là self-adjoint. Tồn tại duy nhất **spectral measure** $E$ được support trên $\sigma(T) \subseteq \mathbb{R}$ sao cho:
>
> $$
> T = \int_{\sigma(T)} \lambda \, dE(\lambda)
> $$
>
> Nghĩa là với mọi $x, y \in H$:
>
> $$
> \langle Tx, y \rangle = \int_{\sigma(T)} \lambda \, d\langle E(\lambda)x, y \rangle
> $$
>
> trong đó $\lambda \mapsto \langle E(\lambda)x, y \rangle$ là đo phức trên $\mathbb{R}$.

> [!note] Remark 14.6 — Hai trường hợp của phổ
> - **Phổ điểm thuần túy** (pure point spectrum): $\sigma(T) = \{\lambda_n\}$ và $E(\{\lambda_n\}) = P_n$ (chiếu lên eigenspace). Khi $T$ compact self-adjoint, đây là trường hợp xảy ra (ngoại trừ $0$).
> - **Phổ liên tục** (continuous spectrum): $E(\{\lambda\}) = 0$ với mọi $\lambda$. Ví dụ: toán tử nhân $M_\phi: f \mapsto \phi f$ trên $L^2$.

---

## Continuous Functional Calculus

> [!theorem] Theorem 14.7 — Continuous Functional Calculus
> Cho $T \in B(H)$ là self-adjoint và $f \in C(\sigma(T))$. Định nghĩa:
>
> $$
> f(T) = \int_{\sigma(T)} f(\lambda) \, dE(\lambda)
> $$
>
> Khi đó ánh xạ $\Phi: f \mapsto f(T)$ từ $C(\sigma(T))$ vào $B(H)$ là *-homomorphism đẳng cấu đẳng cự:
>
> $$
> \|f(T)\| = \|f\|_\infty, \quad \Phi(\bar{f}) = f(T)^*, \quad \Phi(fg) = f(T)g(T)
> $$

> [!example] Example 14.8 — Ứng dụng functional calculus
> Nếu $T \geq 0$ (positive self-adjoint: $\langle Tx,x\rangle \geq 0$), ta có thể định nghĩa $\sqrt{T} = f(T)$ với $f(\lambda) = \sqrt{\lambda}$.
>
> Với $T$ invertible self-adjoint: $T^{-1} = g(T)$ với $g(\lambda) = 1/\lambda$.
>
> **Polar decomposition**: Mọi $T \in B(H)$ có thể viết $T = U|T|$ với $|T| = \sqrt{T^*T}$ và $U$ là toán tử partial isometry.

---

## Ứng dụng: Quantum Mechanics

> [!note] Remark 14.9 — Spectral Theorem trong Cơ học lượng tử
> Trong cơ học lượng tử, **trạng thái** là vector $\psi \in H$ (Hilbert space), và **observable** (đại lượng đo được) là self-adjoint operator $T$ (thường unbounded). Phổ $\sigma(T)$ là tập **giá trị đo được**. Nếu $\psi$ là vector riêng $T\psi = \lambda\psi$, giá trị đo chắc chắn là $\lambda$.
>
> Ví dụ: **Hamiltonian** (năng lượng) $H = -\Delta + V(x)$ là self-adjoint trên $L^2(\mathbb{R}^3)$. Phương trình Schrödinger: $i\hbar \frac{\partial\psi}{\partial t} = H\psi$.

---

## SageMath Cheatsheet

```python
import numpy as np
from scipy import linalg

# Spectral Theorem cho ma trận symmetric: A = Q D Q^T
A = np.array([[4.0, 1.0, 0.0],
              [1.0, 3.0, 1.0],
              [0.0, 1.0, 2.0]])

eigenvalues, eigenvectors = np.linalg.eigh(A)  # eigh cho symmetric/Hermitian
print("Eigenvalues:", eigenvalues)
print("Eigenvectors (columns of Q):")
print(eigenvectors)

# Kiểm tra A = Q D Q^T
D = np.diag(eigenvalues)
A_reconstructed = eigenvectors @ D @ eigenvectors.T
print(f"\n||A - QDQ^T|| = {np.linalg.norm(A - A_reconstructed):.2e}")

# Functional calculus: tính sqrt(A) và A^{-1}
sqrt_A = eigenvectors @ np.diag(np.sqrt(eigenvalues)) @ eigenvectors.T
inv_A = eigenvectors @ np.diag(1/eigenvalues) @ eigenvectors.T
print(f"\nsqrt(A)^2 = A? {np.allclose(sqrt_A @ sqrt_A, A)}")
print(f"inv(A) * A = I? {np.allclose(inv_A @ A, np.eye(3))}")

# Minh họa Spectral Theorem cho compact operator (discretized)
n = 50
t = np.linspace(0, 1, n)
# Compact self-adjoint: kernel k(x,t) = min(x,t)
K = np.array([[min(t[i], t[j]) for j in range(n)] for i in range(n)]) / n
eigvals, eigvecs = np.linalg.eigh(K)
# Eigenvalues sorted descending
idx = np.argsort(np.abs(eigvals))[::-1]
eigvals_sorted = eigvals[idx]
print("\nLargest eigenvalues of compact operator (should -> 0):")
for k_idx in range(6):
    theory = 4 / ((2*(k_idx+1)-1)**2 * np.pi**2)
    print(f"  λ_{k_idx+1}: computed={eigvals_sorted[k_idx]:.6f}, theory≈{theory:.6f}")

# Khai triển T = sum lambda_n <x, e_n> e_n
f = np.sin(np.pi * t)  # test vector
Tf_direct = K @ f
Tf_spectral = sum(eigvals_sorted[k_idx] * np.dot(f, eigvecs[:, idx[k_idx]]) * eigvecs[:, idx[k_idx]]
                  for k_idx in range(n))
print(f"\n||Tf (direct) - Tf (spectral)|| = {np.linalg.norm(Tf_direct - Tf_spectral):.2e}")
```

---

## Summary / Key Takeaways

- **Compact self-adjoint**: mọi eigenvalue thực, có ONB $\{e_n\}$ với $Te_n = \lambda_n e_n$, $\lambda_n \to 0$, khai triển $Tx = \sum \lambda_n \langle x, e_n\rangle e_n$.
- **Bounded self-adjoint**: $T = \int_{\sigma(T)} \lambda \, dE(\lambda)$ với spectral measure $E$.
- **Phổ điểm**: eigenvalue — $E(\{\lambda\}) \neq 0$.
- **Phổ liên tục**: $E(\{\lambda\}) = 0$ nhưng $\lambda \in \sigma(T)$ (ví dụ: toán tử nhân).
- **Functional calculus**: $f \mapsto f(T)$ là *-homomorphism đẳng cấu đẳng cự từ $C(\sigma(T))$ vào $B(H)$.
- Ứng dụng quan trọng: cơ học lượng tử, PDE (Laplacian), lý thuyết Sturm-Liouville.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapters 12–13.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapters 9–10.
- Williams, D. P. *Lecture Notes on the Spectral Theorem*, Dartmouth.
- Harvard Math 212a, Lecture Notes (Sternberg).
- LMU Munich Functional Analysis II (Nam), Chapter 2.
