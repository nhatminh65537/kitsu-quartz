---
title: "A0. Theta Coordinates for (2,2)-Isogenies"
type: deep-dive
tags: [crypto, isogeny, theta, implementation, appendix-a0]
aliases: [Theta Coordinates]
created: 2026-04-09
---

> **Prerequisites**: [[07-richelot-isogenies|07. Richelot Isogenies — the (2,2)-Construction]]
> **Lesson type**: Deep Dive
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $A$ | Abelian surface (split hoặc Jacobian) |
> | $\theta_{ab}$ | Theta constant của $A$ với characteristic $(a,b)$ |
> | $\Theta[ab](z, \tau)$ | Theta function với characteristic |
> | $\lambda, \mu, \nu$ | Theta constants level-2 |
> | $K \subset A[2]$ | Kernel của $(2,2)$-isogeny |

---

## Tại Sao Theta Coordinates?

Mumford coordinates (Lesson 05) mô tả tốt các điểm trên **Jacobians** (irreducible PPAS). Nhưng khi làm việc với $(2,2)$-isogenies — có thể map giữa split surfaces và Jacobians — ta cần một hệ tọa độ thống nhất xử lý **cả hai loại** PPAS. **Theta coordinates** (Cosset-Robert, 2015) làm điều đó.

---

## Theta Functions — Nhắc Lại

Với abelian variety $A$ dimension $g$ over $\mathbb{C}$, **theta function** là:

$$
\Theta(z, \tau) = \sum_{n \in \mathbb{Z}^g} \exp(\pi i n^T \tau n + 2\pi i n^T z)
$$

với $z \in \mathbb{C}^g$, $\tau \in \mathfrak{H}_g$ (Siegel upper half-space).

Với $g = 1$: classical theta function cho elliptic curves.  
Với $g = 2$: theta function cho abelian surfaces.

**Theta functions với characteristics** $(a, b) \in (\frac{1}{2}\mathbb{Z})^g$:

$$
\Theta\begin{bmatrix}a\\b\end{bmatrix}(z, \tau) = \sum_{n \in \mathbb{Z}^g} \exp(\pi i (n+a)^T \tau (n+a) + 2\pi i (n+a)^T (z+b))
$$

---

## Theta Constants (Level 2)

**Theta constants** là theta functions evaluated tại $z = 0$:

$$
\theta_{ab} = \Theta\begin{bmatrix}a\\b\end{bmatrix}(0, \tau)
$$

Với $g = 2$, có $2^{2g} = 16$ theta constants level 4, nhưng với level 2 (relevant cho $(2,2)$-isogenies) ta làm việc với 4 constants:

$$
\lambda = \theta_{00}, \quad \mu = \theta_{01}, \quad \nu = \theta_{10}, \quad \rho = \theta_{11}
$$

> [!note] Duplication Formulas
> Theta constants của quotient $A/K$ (sau $(2,2)$-isogeny với kernel $K$) được tính từ theta constants của $A$ qua **duplication formulas** (Rosenhain formulas, Riemann theta relations):
>
> $$
> \lambda' = \lambda^2 + \mu^2, \quad \mu' = \lambda^2 - \mu^2, \quad \nu' = \nu^2 + \rho^2, \quad \rho' = \nu^2 - \rho^2
> $$
>
> (dạng đơn giản; formulas thực tế phức tạp hơn tùy convention).

---

## Split Detection via Theta

> [!abstract] Theorem A0.1 — Split Criterion via Theta
> PPAS $A$ với theta constants $(\lambda, \mu, \nu, \rho)$ là split ($A \cong E_1 \times E_2$) khi và chỉ khi một số theta constant nhất định bằng 0.
>
> Cụ thể: $A$ split $\Leftrightarrow$ tồn tại permutation $(\theta_{ab})$ sao cho $\theta_{ab} = 0$ cho một "odd characteristic" $(a, b)$.

Điều kiện này dễ kiểm tra: chỉ cần compute theta constants và xem có zero không.

---

## Recovery của $E_1, E_2$ Từ Theta Constants

Khi $A$ split với theta constants $(\lambda, \mu, \nu, \rho)$ (và $\rho = 0$ chẳng hạn):

$$
j(E_1) = 256 \cdot \frac{(\lambda^2 + \mu^2)^3}{\lambda^2 \mu^2 (\lambda^2 - \mu^2)^2}, \quad j(E_2) = 256 \cdot \frac{(\nu^2 + \mu^2)^3}{\nu^2 \mu^2 (\nu^2 - \mu^2)^2}
$$

(Formulas tùy convention; xem Cosset-Robert cho chi tiết đầy đủ.)

Từ $j$-invariants, recover curve equations bằng standard formulas.

---

## Computing $(2,2)$-Isogeny via Theta

> [!note] Algorithm A0.2 — (2,2)-Isogeny via Theta Coordinates
>
> **Input**: Domain $A$ (theta constants $(\lambda, \mu, \nu, \rho)$), kernel $K = \langle T_1, T_2 \rangle$.
>
> **Bước 1**: Compute theta coordinates của $T_1, T_2$ trên $A$.
>
> **Bước 2**: Apply duplication/isogeny formula:
>
> $$
> (\lambda', \mu', \nu', \rho') = \text{RichelotFormula}(\lambda, \mu, \nu, \rho, T_1, T_2)
> $$
>
> **Bước 3**: Kiểm tra $\rho' = 0$ (hay theta constant nào đó = 0) để detect split.
>
> **Bước 4**: Nếu split: recover $E_1', E_2'$ từ $(\lambda', \mu', \nu')$. Nếu không: image là Jacobian với theta constants $(\lambda', \mu', \nu', \rho')$.
>
> **Output**: $(A', \text{split flag}, E_1', E_2')$.

---

## Evaluating Isogeny on Points

Sau khi compute $(2,2)$-isogeny $\Phi: A \to A'$, cần evaluate $\Phi$ trên torsion points để update torsion images cho bước tiếp theo:

$$
\Phi(T_1), \quad \Phi(T_2) \in A'
$$

Theta coordinates cũng cho công thức evaluate isogeny trên points (qua Riemann theta identities). Đây là phần phức tạp nhất của implementation.

---

## Trong SageMath (richelot_aux.sage)

Codebase của Pope-Oudompheng implement tất cả điều này trong `richelot_aux.sage`:

```sage
def gluing_isogeny(E1, E2, P1, P2, Q1, Q2):
    a1, b1 = P1.xy()
    a2, b2 = Q1.xy()
    lam_sq = ...
    mu_sq = ...
    return (lam_sq, mu_sq, nu_sq, rho_sq)

def splitting_isogeny(thetas):
    lam, mu, nu, rho = thetas
    if rho == 0:
        j1 = compute_j(lam, mu, nu)
        j2 = compute_j(nu, mu, lam)
        E1 = EllipticCurve_from_j(j1)
        E2 = EllipticCurve_from_j(j2)
        return True, E1, E2
    return False, None, None
```

---

## Summary

- **Theta constants** $(\lambda, \mu, \nu, \rho)$: tọa độ thống nhất cho mọi PPAS.
- **Split detection**: theta constant = 0.
- **Recovery**: $j(E_i)$ từ theta constants (explicit formula).
- **$(2,2)$-isogeny**: duplication formulas trên theta constants.
- **Evaluate on points**: Riemann theta identities → update torsion images.
- Implementation: `richelot_aux.sage` trong codebase Pope-Oudompheng.

---

## References

- Cosset, R. & Robert, D. — *Computing $(ℓ,ℓ)$-isogenies in polynomial time on Jacobians of genus-2 curves* (2015), §3–5
- Mumford, D. — *Tata Lectures on Theta II*, Ch. IIIa (theta functions)
- Oudompheng, R. — *A note on implementing direct isogeny determination in the Castryck-Decru SIKE attack* (2022)
- Birkenhake & Lange — *Complex Abelian Varieties*, Ch. 8 (theta functions)
