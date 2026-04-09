---
title: "06. Isogenies between Abelian Varieties"
type: math-component
tags: [crypto, isogeny, abelian-variety, lesson-06]
aliases: [Isogenies between Abelian Varieties]
created: 2026-04-09
---

> **Prerequisites**: [[02-polarizations|02. Polarizations and Principal Polarization]], [[04-jacobians-genus2|04. Jacobians of Genus-2 Curves]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $A, B$ | Abelian varieties dimension $g$ |
> | $\phi: A \to B$ | Isogeny |
> | $\hat{\phi}: B \to A$ | Dual isogeny |
> | $\ker \phi$ | Kernel (finite subgroup scheme) của $\phi$ |
> | $K \subset A$ | Finite subgroup scheme |
> | $A/K$ | Quotient abelian variety |
> | $\lambda, \mu$ | Polarizations trên $A$, $B$ |

---

## Tại sao Isogenies trên Abelian Varieties?

Ta đã quen với isogenies giữa elliptic curves (từ background). Mọi thứ tổng quát hóa lên abelian varieties dimension cao hơn, nhưng có thêm nhiều loại isogeny — đặc biệt là **$(n, n)$-isogenies** (hay isogenies có kernel $\cong (\mathbb{Z}/n\mathbb{Z})^2$ trong mỗi "chiều"). Lesson này xây dựng framework tổng quát, với chú ý đặc biệt đến trường hợp $(2, 2)$ sẽ dùng trong attack.

---

## Isogeny giữa Abelian Varieties — Nhắc lại

> [!note] Định nghĩa 6.1 — Isogeny
> $\phi: A \to B$ là **isogeny** nếu $\phi$ là surjective morphism với $\ker \phi$ finite. **Degree**: $\deg \phi = |\ker \phi(\bar{k})|$.
>
> Hai abelian varieties $A \sim B$ (isogenous) nếu tồn tại isogeny giữa chúng. Quan hệ này là tương đương.

**Từ isogeny sang quotient**: Ngược lại, với mọi finite subgroup $K \subset A$, tồn tại abelian variety $B = A/K$ và isogeny $\phi: A \to B$ với $\ker \phi = K$.

---

## Dual Isogeny và Degree

> [!abstract] Theorem 6.2 — Dual Isogeny (tổng quát)
> Với isogeny $\phi: A \to B$ degree $n$, tồn tại duy nhất **dual isogeny** $\hat{\phi}: B \to A$ sao cho:
>
> $$
> \hat{\phi} \circ \phi = [n]_A, \qquad \phi \circ \hat{\phi} = [n]_B
> $$
>
> $\deg \hat{\phi} = \deg \phi = n$.

Dual isogeny tương tác với polarizations qua:

$$
\widehat{(\phi \circ \psi)} = \hat{\psi} \circ \hat{\phi}
$$

---

## $(n, n)$-Isogenies

Đây là loại isogeny đặc trưng của abelian surfaces:

> [!note] Định nghĩa 6.3 — $(n,n)$-Isogeny
> Với abelian surfaces $(A, \lambda_A)$ và $(B, \lambda_B)$, một **$(n,n)$-isogeny** là isogeny $\phi: A \to B$ sao cho $\ker \phi \cong (\mathbb{Z}/n\mathbb{Z})^2$ và $\phi$ tương thích với polarizations:
>
> $$
> \phi^* \lambda_B = \lambda_A \cdot [n] \quad (\text{up to scalar})
> $$
>
> Degree: $\deg \phi = n^2$.

**Tại sao $\ker \phi \cong (\mathbb{Z}/n\mathbb{Z})^2$?** Vì abelian surface $A$ có $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$. Một maximal isotropic subgroup của $A[n]$ (respect với Weil pairing) có kích thước $n^2$, và có cấu trúc $(\mathbb{Z}/n\mathbb{Z})^2$.

---

## Isotropic Subgroups

Để isogeny $\phi: A \to B$ **preserve** principal polarization (ra PPAS), kernel phải là **isotropic**:

> [!note] Định nghĩa 6.4 — Maximal Isotropic Subgroup
> Subgroup $K \subset A[n]$ là **isotropic** (respect với Weil pairing $e_n^\lambda$) nếu:
>
> $$
> e_n^\lambda(x, y) = 1 \quad \text{với mọi } x, y \in K
> $$
>
> $K$ là **maximal isotropic** nếu $|K| = n^g$ (chiếm một nửa $A[n]$ trong mỗi "chiều").

> [!abstract] Theorem 6.5 — Quotient là PPAS
> Với $(A, \lambda)$ là PPAS và $K \subset A[n]$ maximal isotropic, quotient $B = A/K$ mang một principal polarization $\mu$ sao cho $\phi: (A, \lambda) \to (B, \mu)$ là $(n,n)$-isogeny tương thích polarizations.

**Proof sketch.** Polarization $\lambda$ descend qua $\phi$ vì $K$ isotropic: với $x, y \in K$, $e_n^\lambda(x, y) = 1$ nghĩa là $\phi^* \mu = \lambda$ có nghĩa. Degree = 1 vì $K$ maximal isotropic. $\blacksquare$

---

## $(2,2)$-Isogenies — Trường Hợp Quan Trọng

Trong Castryck-Decru attack, $n = 2$: ta làm việc với **$(2,2)$-isogenies**.

**Kernel**: $K \cong (\mathbb{Z}/2\mathbb{Z})^2$, subgroup 4 phần tử của $A[2] \cong (\mathbb{Z}/2\mathbb{Z})^4$.

**Isotropic condition**: Với Weil pairing $e_2: A[2] \times A[2] \to \{\pm 1\}$, $K$ isotropic khi $e_2(x, y) = 1$ với mọi $x, y \in K$.

**Số lượng**: Số maximal isotropic subgroups của $(\mathbb{Z}/2\mathbb{Z})^4$ respect với symplectic form là:

$$
|\text{Sp}_4(\mathbb{F}_2)| / \text{stabilizer} = 15
$$

Tức là có đúng 15 $(2,2)$-isogenies từ một PPAS $A$ (tương ứng với 15 non-trivial 2-torsion divisors $J[2] \setminus \{0\}$).

> [!tip] Kết Nối với $J[2]$
> Từ Lesson 05: $J[2]$ có 15 non-zero elements, là pairs of Weierstrass points $(P_i + P_j - 2\infty)$. Mỗi element này sinh ra một maximal isotropic subgroup $K = \{0, D_{ij}, D_{kl}, D_{mn}\}$ (complement pair), từ đó một $(2,2)$-isogeny. Đây là cơ sở của Richelot construction.

---

## Factoring Isogenies

Isogeny degree lớn có thể factor thành chain của isogenies degree nhỏ hơn:

> [!abstract] Theorem 6.6 — Factoring qua $(2,2)$-Chains
> Với $n = 2^e$, mọi $(2^e, 2^e)$-isogeny $\Phi: A \to B$ có thể viết như chain:
>
> $$
> A = A_0 \xrightarrow{\phi_1} A_1 \xrightarrow{\phi_2} A_2 \xrightarrow{\cdots} A_e = B
> $$
>
> trong đó mỗi $\phi_i$ là $(2,2)$-isogeny.

Điều này tương tự như chain isogenies $\ell$-isogenies trên elliptic curves. Trong attack, chain $(2,2)^b$ isogenies từ $E_0 \times E_0$ được xây dựng bằng cách "đoán từng digit" của Bob's secret.

---

## Isogenies từ $E_1 \times E_2$

Với abelian surface dạng tích $A = E_1 \times E_2$, có nhiều loại isogeny:

**Projection isogenies**: $\pi_i: E_1 \times E_2 \to E_i$, degree vô hạn (không phải isogeny theo định nghĩa).

**Diagonal isogenies**: $\phi: E_1 \times E_2 \to E_1' \times E_2'$ được định nghĩa bởi matrix $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ trong $\text{Hom}(E_1, E_1') \times \ldots$

**$(2,2)$-isogenies**: Quan trọng nhất: chúng có thể map $E_1 \times E_2$ sang hoặc một PPAS khác dạng tích (split), hoặc một Jacobian (irreducible). Phân biệt hai trường hợp này là **glue-and-split**, sẽ xây dựng trong [[07-richelot-isogenies|Lesson 07]] và [[08-glue-and-split|Lesson 08]].

---

## Vélu's Formulas Tổng Quát

Vélu's formulas cho elliptic curves tổng quát hóa một phần lên abelian surfaces, nhưng phức tạp hơn đáng kể. Với $(2,2)$-isogenies, formulas được phát triển bởi Cosset-Robert (2015) qua **theta coordinates** — xem [[a0-theta-coordinates|Appendix A0]].

Trong SageMath, một số $(2,2)$-isogenies có thể được tính qua:

```sage
k = GF(p)
R.<x> = k[]
f = (x^2 - a1)*(x^2 - a2)*(x^2 - a3)
C = HyperellipticCurve(f)
J = C.jacobian()
```

(Richelot isogeny được xây dựng tường minh từ factorization của $f$ — xem Lesson 07.)

---

## Summary

- $(n,n)$-isogeny $\phi: A \to B$: $\ker \phi \cong (\mathbb{Z}/n\mathbb{Z})^2$, degree $n^2$, preserve PPAS.
- Kernel phải là **maximal isotropic** respect với Weil pairing.
- $(2,2)$-isogenies: $\ker \cong (\mathbb{Z}/2\mathbb{Z})^2$, có đúng 15 cái từ mỗi PPAS.
- Chain $(2,2)^b$: tương tự chain $\ell$-isogenies trên elliptic curves.
- Mỗi $(2,2)$-isogeny từ $A$ map sang PPAS có thể split hoặc Jacobian.
- Formulas explicit: theta coordinates (Appendix A0), Richelot construction (Lesson 07).

---

## References

- Milne, J.S. — *Abelian Varieties*, Ch. 7 (isogenies, dual, polarizations)
- Cosset, R. & Robert, D. — *Computing $(ℓ,ℓ)$-isogenies in polynomial time on Jacobians of genus-2 curves*, Math. Comp. 84 (2015)
- Castryck & Decru — *An efficient key recovery attack on SIDH*, §3
- Flynn, E.V. & Ti, Y.B. — *Genus Two Isogeny Cryptography*, PQCrypto 2019
