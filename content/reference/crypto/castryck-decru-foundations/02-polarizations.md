---
title: "02. Polarizations and Principal Polarization"
type: math-component
tags: [crypto, isogeny, polarization, abelian-variety, lesson-02]
aliases: [Polarizations]
created: 2026-04-09
---

> **Prerequisites**: [[01-abelian-varieties-foundations|01. Abelian Varieties — Foundations]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $A$ | Abelian variety dimension $g$ trên $k$ |
> | $\hat{A}$ | Dual abelian variety của $A$ |
> | $\text{Pic}^0(A)$ | Degree-0 Picard group của $A$ |
> | $L$ | Line bundle (invertible sheaf) trên $A$ |
> | $t_x^* L$ | Pullback của $L$ qua translation-by-$x$ |
> | $\cong$ | Isomorphism (của varieties hoặc line bundles) |

---

## Tại sao cần Polarization?

Abelian variety "trần" $A$ thiếu một cấu trúc quan trọng để làm crypto và geometry: không có cách cố định để đo "kích thước" hay "hướng" của isogeny. Polarization bổ sung một **canonical map $A \to \hat{A}$** (từ $A$ sang dual của nó), tổng quát hóa Weil pairing. Trong Castryck-Decru attack, điều kiện "principally polarized" là điều kiện cần để phân biệt hai loại abelian surface — split hay Jacobian — và để Kani's theorem áp dụng được.

---

## Dual Abelian Variety

> [!note] Định nghĩa 2.1 — Dual Abelian Variety
> Với abelian variety $A/k$, **dual abelian variety** $\hat{A}$ là abelian variety biểu diễn functor:
>
> $$
> S \mapsto \text{Pic}^0(A_S)
> $$
>
> Cụ thể hơn, $\hat{A}$ parameterize các line bundles trên $A$ algebraically equivalent tới $0$.
>
> Với $L$ là ample line bundle trên $A$, có morphism chính tắc:
>
> $$
> \phi_L: A \to \hat{A}, \qquad x \mapsto [t_x^* L \otimes L^{-1}]
> $$
>
> trong đó $t_x: A \to A$ là translation-by-$x$.

Kết quả cơ bản: $\dim \hat{A} = \dim A = g$, và $\hat{\hat{A}} \cong A$.

Với elliptic curve $E$: $\hat{E} \cong E$ (self-dual), và map $\phi_L$ tương ứng với Weil pairing.

---

## Polarization

> [!note] Định nghĩa 2.2 — Polarization
> Một **polarization** của $A$ là một isogeny $\lambda: A \to \hat{A}$ của dạng $\lambda = \phi_L$ cho một ample line bundle $L$ trên $A_{\bar{k}}$.
>
> $\lambda$ là một **principal polarization** nếu $\lambda$ là isomorphism (tức là $\deg \lambda = 1$).
>
> Một abelian variety với principal polarization được gọi là **principally polarized abelian variety (PPAV)**, hay **principally polarized abelian surface (PPAS)** khi $g = 2$.

**Degree của polarization**: $\deg \lambda = \deg \phi_L$. Với principal polarization: $\deg \lambda = 1$, tức là $\lambda$ là bijection.

> [!info] Ý nghĩa Hình học
> Polarization $\lambda: A \to \hat{A}$ định nghĩa một **Hermitian form** trên tangent space của $A$, tổng quát hóa inner product. Principal polarization là trường hợp "unimodular" — không có thêm factor thừa nào.

---

## Weil Pairing tổng quát

Polarization $\lambda: A \to \hat{A}$ sinh ra một pairing tổng quát hóa Weil pairing:

> [!note] Định nghĩa 2.3 — Weil Pairing từ Polarization
> Với polarization $\lambda: A \to \hat{A}$ và $n \geq 1$, **Weil pairing** liên quan:
>
> $$
> e_n^\lambda: A[n] \times A[n] \to \mu_n
> $$
>
> định nghĩa bởi $e_n^\lambda(x, y) = e_n(x, \lambda(y))$ trong đó $e_n$ là Weil pairing chuẩn giữa $A[n]$ và $\hat{A}[n]$.

Với principal polarization ($\lambda$ là isomorphism), pairing này là **alternating** và **non-degenerate**.

Đây là tổng quát hóa trực tiếp của Weil pairing $e_n: E[n] \times E[n] \to \mu_n$ trên elliptic curve.

---

## Hai Loại PPAS (Dimension 2)

Đây là kết quả phân loại cốt lõi cho Castryck-Decru:

> [!abstract] Theorem 2.4 — Phân Loại PPAS
> Mọi principally polarized abelian surface $(A, \lambda)$ trên field $k$ thuộc một trong hai loại:
>
> 1. **Split (decomposable)**: $(A, \lambda) \cong (E_1 \times E_2, \lambda_1 \times \lambda_2)$ với $E_1, E_2$ là elliptic curves và $\lambda_i$ là canonical principal polarization của $E_i$.
>
> 2. **Irreducible (Jacobian)**: $(A, \lambda) \cong (\text{Jac}(C), \lambda_\Theta)$ với $C$ là genus-2 curve và $\lambda_\Theta$ là polarization được sinh bởi theta divisor $\Theta$.

**Proof.** Theo **Torelli's theorem**, một PPAS là Jacobian khi và chỉ khi nó không split thành tích của hai PPAV. Chiều ngược lại: mọi Jacobian mang polarization chính tắc từ theta divisor. Phân loại đầy đủ là hệ quả của Narasimhan-Nori-Seshardi và lý thuyết theta. $\blacksquare$

> [!tip] Nhận xét cho Castryck-Decru
> Attack xây dựng một (2,2)-isogeny từ $E_1 \times E_2$ (split PPAS) và kiểm tra xem image có split không. Nếu image split: đã recover một digit của Bob's secret. Nếu không split (image là Jacobian): tiếp tục tính toán. Đây là "split test" trong attack.

---

## Principal Polarization trên Tích $E_1 \times E_2$

Trên $A = E_1 \times E_2$, principal polarization chính tắc là:

$$
\lambda = \lambda_{E_1} \times \lambda_{E_2} : E_1 \times E_2 \to \hat{E}_1 \times \hat{E}_2 \cong E_1 \times E_2
$$

(dùng self-duality $\hat{E}_i \cong E_i$). Tường minh:

$$
\lambda(P_1, P_2) = (\lambda_{E_1}(P_1), \lambda_{E_2}(P_2))
$$

Weil pairing tương ứng là:

$$
e_{n}^{\lambda}((P_1, P_2), (Q_1, Q_2)) = e_n^{E_1}(P_1, Q_1) \cdot e_n^{E_2}(P_2, Q_2)
$$

Đây là **product pairing**, và sẽ được dùng để kiểm tra image của (2,2)-isogeny.

---

## Isogenies Tương thích với Polarization

> [!note] Định nghĩa 2.5 — Isogeny Tương thích Polarization
> Với $(A, \lambda)$ và $(B, \mu)$ là hai PPAV và $\phi: A \to B$ là isogeny, ta nói $\phi$ **tương thích với polarizations** nếu:
>
> $$
> \phi^* \mu = \lambda \qquad \text{(pullback polarization)}
> $$
>
> tức là $\hat{\phi} \circ \mu \circ \phi = \lambda$.

Trong context của (2,2)-isogenies: ta cần isogeny $\Phi: E_1 \times E_2 \to A'$ sao cho $A'$ mang principal polarization được kéo về từ $\Phi$. Nếu $A'$ là PPAS split: attack thành công. Nếu $A'$ là Jacobian: cần tiếp tục.

---

## Theta Divisor và Polarization của Jacobian

Với $C$ là genus-2 curve, Jacobian $\text{Jac}(C)$ được trang bị một **theta divisor** $\Theta \subset \text{Jac}(C)$ — hypersurface codimension 1. Principal polarization $\lambda_\Theta$ được định nghĩa bởi:

$$
\lambda_\Theta = \phi_{\mathcal{O}(\Theta)}: \text{Jac}(C) \to \widehat{\text{Jac}(C)}
$$

Đây là principal polarization chuẩn trên Jacobian, và cấu trúc của $\Theta$ encode toàn bộ thông tin về genus-2 curve $C$ (theo Torelli's theorem).

> [!abstract] Theorem 2.6 — Torelli's Theorem
> Nếu $(J_1, \lambda_1) \cong (J_2, \lambda_2)$ là hai PPAS của Jacobian type, thì $C_1 \cong C_2$ (isomorphic như curves).

Torelli's theorem có nghĩa là: **genus-2 curve được xác định hoàn toàn bởi Jacobian + polarization**. Trong attack, khi phát hiện image là Jacobian, ta có thể recover genus-2 curve từ đó.

---

## Summary

- **Dual abelian variety** $\hat{A}$ parameterize degree-0 line bundles trên $A$.
- **Polarization** $\lambda: A \to \hat{A}$: isogeny từ ample line bundle. **Principal** khi là isomorphism.
- **PPAS** có hai loại: split $E_1 \times E_2$ hoặc Jacobian $\text{Jac}(C)$ — đây là phân loại cơ bản nhất.
- Weil pairing tổng quát hóa từ polarization: alternating, non-degenerate.
- Torelli: genus-2 curve được encode hoàn toàn bởi PPAS Jacobian.
- Trong attack: "split test" = kiểm tra image của (2,2)-isogeny có phải PPAS split không.

---

## References

- Milne, J.S. — *Abelian Varieties*, Ch. 6–8 (polarizations, duals)
- Birkenhake & Lange — *Complex Abelian Varieties*, Ch. 4 (theta divisors, Torelli)
- Castryck & Decru — *An efficient key recovery attack on SIDH*, §2 (PPAS classification trong context attack)
- Galbraith, S. — *Mathematics of Public Key Cryptography*, Ch. 25 (abelian varieties và crypto)
