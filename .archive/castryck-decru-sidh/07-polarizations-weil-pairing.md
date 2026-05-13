---
title: "07. Principal Polarizations & the Weil Pairing on Abelian Surfaces"
type: math-component
tags: [crypto, polarization, weil-pairing, abelian-surface, castryck-decru, lesson-07]
aliases: [Polarizations]
created: 2026-04-08
---

> **Prerequisites**: [[06-abelian-surfaces|06. Abelian Surfaces]]
> **Lesson type**: Math Component
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\hat{A}$ | Dual abelian variety của $A$ |
> | $\lambda : A \to \hat{A}$ | Polarization — isogeny từ $A$ sang dual |
> | $e_n^\lambda$ | Weil pairing liên kết với polarization $\lambda$ |
> | $K(\lambda)$ | Kernel của polarization $\lambda$ |
> | $\langle \cdot, \cdot \rangle_\lambda$ | Pairing alternating $A[n] \times A[n] \to \mu_n$ |
> | $G \subset A[n]$ | Isotropic subgroup: $e_n^\lambda(P,Q) = 1$ với mọi $P, Q \in G$ |

---

## Motivation

Kani's theorem — công cụ trung tâm của Castryck-Decru — nói về tính **reducibility** của các isogeny từ products của elliptic curves. Phát biểu chính xác của nó đòi hỏi khái niệm **anti-isometry** giữa các torsion groups với Weil pairing. Bài này xây dựng nền tảng đó: polarization là gì, tại sao nó cần thiết để định nghĩa Weil pairing trên abelian surface, và isotropic subgroups là gì (điều kiện để quotient isogeny có codomain là principally polarized).

---

## 1. Dual Abelian Variety

> [!note] Định nghĩa 7.1 — Dual Abelian Variety
> Với $A/k$ abelian variety, **dual abelian variety** $\hat{A}$ là abelian variety parametrize các line bundles degree 0 trên $A$:
>
> $$
> \hat{A} = \text{Pic}^0(A)
> $$
>
> Với elliptic curve $E$: $\hat{E} \cong E$ (self-dual). Với abelian surface $A$ dimension 2: $\hat{A}$ cũng có dimension 2.

---

## 2. Polarization

> [!note] Định nghĩa 7.2 — Polarization
> Một **polarization** trên abelian variety $A$ là một isogeny $\lambda : A \to \hat{A}$ xuất phát từ một ample line bundle $\mathcal{L}$ trên $A$:
>
> $$
> \lambda = \phi_\mathcal{L} : A \to \hat{A}, \quad x \mapsto [t_x^* \mathcal{L} \otimes \mathcal{L}^{-1}]
> $$
>
> trong đó $t_x : A \to A$ là translation-by-$x$ map.
>
> Polarization là **principal** nếu $\lambda$ là isomorphism (tức là $\ker \lambda = \{0\}$, hay degree $= 1$).

**Notation**: $(A, \lambda)$ là **principally polarized abelian variety (PPAV)** khi $\lambda$ là principal polarization.

**Ví dụ cốt lõi**: $J(C)$ với genus-2 curve $C$ có natural principal polarization từ theta divisor $\Theta \subset J(C)$. Product $E_1 \times E_2$ với principal polarizations $\lambda_1, \lambda_2$ trên mỗi factor cho product polarization $\lambda_1 \times \lambda_2$, cũng là principal.

---

## 3. Weil Pairing Từ Polarization

> [!note] Định nghĩa 7.3 — Weil Pairing Từ Polarization
> Với $(A, \lambda)$ PPAV và $n$ với $\gcd(n, \text{char}(k)) = 1$, **Weil pairing** liên kết với $\lambda$ là:
>
> $$
> e_n^\lambda : A[n] \times A[n] \to \mu_n
> $$
>
> $$
> e_n^\lambda(P, Q) = e_n(P, \lambda(Q))
> $$
>
> trong đó $e_n : A[n] \times \hat{A}[n] \to \mu_n$ là Weil pairing tự nhiên giữa $A$ và dual của nó.

Với $A = J(C)$ và polarization chuẩn: Weil pairing này là bilinear, alternating, non-degenerate — thỏa mãn mọi tính chất như Weil pairing trên elliptic curve nhưng trên torsion group rank 4.

---

## 4. Isotropic Subgroups và (n,n)-Isogenies

Đây là concept then chốt để define Richelot isogenies (Lesson 8).

> [!note] Định nghĩa 7.4 — Isotropic Subgroup
> Subgroup $G \subset A[n]$ được gọi là **isotropic** (đối với $e_n^\lambda$) nếu:
>
> $$
> e_n^\lambda(P, Q) = 1 \quad \forall P, Q \in G
> $$
>
> $G$ được gọi là **maximal isotropic** nếu không tồn tại $G' \supsetneq G$ cũng isotropic.

> [!abstract] Theorem 7.5 — Maximal Isotropic Subgroup và (n,n)-Isogeny
> Với $(A, \lambda)$ PPAV và $G \subset A[n]$ maximal isotropic:
>
> 1. $|G| = n^2$ (cho abelian surface $\dim = 2$)
> 2. Quotient $A/G$ có natural **principal polarization** $\lambda'$
> 3. Isogeny quotient $\phi : A \to A/G$ có degree $n^2$ và được gọi là **$(n,n)$-isogeny**

**Proof sketch.** $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$ với pairing $e_n^\lambda$ là alternating non-degenerate trên $(\mathbb{Z}/n\mathbb{Z})^4$. Subgroup maximal isotropic có kích thước $\sqrt{|A[n]|} = n^2$. Quotient inherits polarization vì $G$ isotropic $\Rightarrow$ $e_n^\lambda$ factors qua $A/G$. $\blacksquare$

---

## 5. Symplectic Basis

> [!note] Định nghĩa 7.6 — Symplectic Basis
> Với $(A, \lambda)$ PPAV và $n$ nguyên, một **symplectic basis** của $A[n]$ là basis $\{P_1, P_2, Q_1, Q_2\}$ thỏa mãn:
>
> $$
> e_n^\lambda(P_i, Q_j) = \zeta_n^{\delta_{ij}}, \quad e_n^\lambda(P_i, P_j) = e_n^\lambda(Q_i, Q_j) = 1
> $$
>
> trong đó $\zeta_n$ là primitive $n$-th root of unity.

Symplectic basis tồn tại và mọi change-of-basis matrix phải là symplectic (preserve pairing). Group $\text{Sp}_4(\mathbb{Z}/n\mathbb{Z})$ là automorphism group của symplectic pairing.

**Đối với product $E_1 \times E_2$**: Nếu $\{P_A, Q_A\}$ là symplectic basis của $E_1[n]$ và $\{P_B, Q_B\}$ là của $E_2[n]$, thì $\{(P_A, 0), (P_B, 0), (Q_A, 0), (Q_B, 0)\}$ cho product polarization. Maximal isotropic subgroups có 3 loại: "horizontal", "vertical", và "mixed" — tương ứng với 3 loại Richelot isogenies.

---

## 6. Anti-Isometry — Khái Niệm Chìa Khóa Của Kani

> [!note] Định nghĩa 7.7 — Anti-Isometry
> Cho $(A_1, \lambda_1)$ và $(A_2, \lambda_2)$ là hai PPAV. Một isomorphism $\alpha : A_1[n] \to A_2[n]$ được gọi là **anti-isometry** (đối với Weil pairings $e_n^{\lambda_1}$ và $e_n^{\lambda_2}$) nếu:
>
> $$
> e_n^{\lambda_2}(\alpha(P), \alpha(Q)) = e_n^{\lambda_1}(P, Q)^{-1} \quad \forall P, Q \in A_1[n]
> $$
>
> Nói cách khác, $\alpha$ đảo chiều (negate) pairing.

Anti-isometry xuất hiện tự nhiên từ dual isogenies: nếu $\phi : A_1 \to A_2$ là $(n,n)$-isogeny, thì action của $\phi$ trên $A_1[n]$ liên quan đến action của $\hat{\phi}$ qua anti-isometry.

> [!abstract] Theorem 7.8 — Dual Isogeny Induces Anti-Isometry
> Với $\phi : (A_1, \lambda_1) \to (A_2, \lambda_2)$ isogeny degree $n^2$ (không nhất thiết $(n,n)$-isogeny), ta có:
>
> $$
> e_n^{\lambda_1}(P, \hat{\phi}(Q)) = e_n^{\lambda_2}(\phi(P), Q) \quad \forall P \in A_1[n], Q \in A_2[n]
> $$
>
> Tức là $\hat{\phi}$ là "adjoint" của $\phi$ đối với Weil pairing.

**Ý nghĩa trong Kani's theorem**: Castryck-Decru cần xây dựng một isomorphism torsion group $\alpha$ là anti-isometry giữa $E_0[2^a]$ và $C[2^a]$ (với $C$ một elliptic curve), để Kani's criterion có thể áp dụng. Anti-isometry này được construct từ torsion point images $\phi_A(P_B), \phi_A(Q_B)$ trong public key của Alice.

---

## 7. Tóm Tắt

| Khái niệm | Định nghĩa | Vai trò trong attack |
|-----------|-----------|---------------------|
| Polarization $\lambda$ | Isogeny $A \to \hat{A}$ từ ample line bundle | Cho phép define Weil pairing trên $A$ |
| Principal polarization | $\lambda$ là isomorphism | Điều kiện để quotient vẫn là PPAV |
| Isotropic subgroup $G$ | $e_n^\lambda(P,Q) = 1$ trên $G$ | Kernel hợp lệ của $(n,n)$-isogeny |
| $(n,n)$-isogeny | Quotient bởi maximal isotropic $G$, degree $n^2$ | Richelot isogeny khi $n=2$ |
| Anti-isometry | Isomorphism đảo chiều pairing | Điều kiện trong Kani's theorem |

---

## References

- Birkenhake & Lange — *Complex Abelian Varieties*, Ch. 2 (Polarizations) & Ch. 6 (Weil pairing)
- Mumford, D. — *Abelian Varieties*, Oxford University Press (Ch. II §6: Weil pairing)
- Castryck, W. & Decru, T. — *An efficient key recovery attack on SIDH* (ePrint 2022/975), Section 2
