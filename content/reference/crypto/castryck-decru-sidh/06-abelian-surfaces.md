---
title: "06. Abelian Surfaces: Jacobians of Genus-2 Curves"
type: math-component
tags: [crypto, abelian-surface, jacobian, genus-2, castryck-decru, lesson-06]
aliases: [Abelian Surfaces]
created: 2026-04-08
---

> **Prerequisites**: [[01-isogenies-review|01. Isogenies Review]], algebraic varieties (sơ bộ)
> **Lesson type**: Math Component
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $A$ | Abelian variety (abelian surface khi $\dim A = 2$) |
> | $J(C)$ hoặc $\text{Jac}(C)$ | Jacobian variety của curve $C$ genus 2 |
> | $\lambda : A \to \hat{A}$ | Polarization — isogeny từ $A$ sang dual $\hat{A}$ |
> | $e_\lambda$ | Weil pairing tương ứng với polarization $\lambda$ |
> | $A[n]$ | Nhóm $n$-torsion của abelian variety $A$ |
> | $\text{Div}^0(C)$ | Divisors degree 0 trên curve $C$ |

---

## Motivation

Castryck-Decru attack hoạt động bằng cách **lift** vấn đề từ dimension 1 (elliptic curves) sang dimension 2 (abelian surfaces). Cụ thể, attacker xây dựng một isogeny chain giữa các abelian surfaces có dạng $E \times E'$ (product của hai elliptic curves), và dùng Kani's theorem để kiểm tra tính đúng đắn của từng bước. Để hiểu được điều này, ta cần hiểu abelian surfaces — đặc biệt là **Jacobians của genus-2 curves** và hai dạng đặc biệt của chúng: Jacobian của một genus-2 curve, và product của hai elliptic curves.

---

## 1. Abelian Variety — Định Nghĩa

> [!note] Định nghĩa 6.1 — Abelian Variety
> Một **abelian variety** định nghĩa trên trường $k$ là một projective algebraic group $A/k$ — tức là một projective algebraic variety có thêm cấu trúc group (phép cộng và nghịch đảo đều là morphisms của varieties).
>
> **Abelian surface**: abelian variety dimension 2, ký hiệu $A/k$ với $\dim A = 2$.

Mọi abelian variety đều là commutative group — đây là hệ quả bắt buộc của projective geometry (Rigidity Lemma). Phép nhân $[n] : A \to A$ tồn tại với mọi $n \in \mathbb{Z}$.

**Abelian surface** $A$ có nhóm $n$-torsion:

$$
A[n] \cong (\mathbb{Z}/n\mathbb{Z})^4 \quad \text{với } \gcd(n, \text{char}(k)) = 1
$$

(rank 4 vì $\dim A = 2$, so với rank 2 của elliptic curve)

---

## 2. Jacobian của Genus-2 Curve

> [!note] Định nghĩa 6.2 — Genus-2 Curve
> Một **genus-2 curve** là curve hyperelliptic dạng:
>
> $$
> C : y^2 = f(x), \quad \deg f \in \{5, 6\}, \quad f \text{ separable}
> $$
>
> trên trường $k$ với $\text{char}(k) \neq 2$. Mọi genus-2 curve đều hyperelliptic.

> [!note] Định nghĩa 6.3 — Jacobian Variety
> Với curve $C$ genus $g$, **Jacobian** $J(C) = \text{Jac}(C)$ là abelian variety dimension $g$ được xây dựng từ divisors degree 0 modulo principal divisors:
>
> $$
> J(C) = \text{Div}^0(C) / \text{PDiv}(C)
> $$
>
> Với genus 2: $J(C)$ là abelian surface dimension 2 trên $k$.

Trong thực hành, điểm trên $J(C)$ được biểu diễn bằng **Mumford representation**: một cặp đa thức $(u(x), v(x))$ với $\deg u = 2$, $\deg v \leq 1$, $u | f - v^2$. Đây là sự mở rộng của biểu diễn điểm trên elliptic curve lên dimension 2.

---

## 3. Hai Dạng Abelian Surface — Split và Non-Split

> [!abstract] Theorem 6.4 — Classification (Weil, Torelli)
> Mọi principally polarized abelian surface $(A, \lambda)$ là isomorphic (trên $\bar{k}$) đến một trong hai dạng:
>
> 1. **Jacobian**: $(A, \lambda) \cong (J(C), \lambda_C)$ với $C$ là genus-2 curve — **irreducible** case
> 2. **Product**: $(A, \lambda) \cong (E_1 \times E_2, \lambda_1 \times \lambda_2)$ với $E_1, E_2$ là elliptic curves — **reducible/split** case

Hai dạng này là **generic** vs **degenerate**:
- Jacobian của genus-2 curve là trường hợp "chung" — chiếm "hầu hết" các abelian surfaces trong moduli space
- Product $E_1 \times E_2$ là trường hợp đặc biệt — chỉ trên một locus measure-zero trong moduli space

> [!info] Ý Nghĩa Trong Attack
> Trong Castryck-Decru attack:
> - Attacker xây dựng một chain isogenies giữa các abelian surfaces
> - Chain bắt đầu và kết thúc tại các **product surfaces** $E_0 \times C$ (split case)
> - Các bước trung gian là các **Jacobians** (non-split case) nằm trên Richelot isogeny chain
> - Kani's theorem kiểm tra xem **điểm cuối có split không** — đây là oracle để xác định candidate kernel đúng

---

## 4. Abel-Jacobi Map và Cấu Trúc Group

> [!note] Định nghĩa 6.5 — Abel-Jacobi Map
> Với $C$ genus-2 curve, **Abel-Jacobi map** là embedding:
>
> $$
> \mu : C \hookrightarrow J(C), \quad P \mapsto [P - P_0]
> $$
>
> trong đó $P_0$ là base point (Weierstrass point hoặc điểm có lý).

Mọi điểm trên $J(C)$ có thể biểu diễn là $[P + Q - 2P_0]$ với $P, Q \in C(\bar{k})$ (divisor class degree 2). Điều này tương tự với cách elliptic curve $E$ là chính $J(E) = E$.

**Group law trên $J(C)$**: Phép cộng các Mumford representations $(u_1, v_1) + (u_2, v_2)$ thực hiện qua **Cantor algorithm** — tương tự point doubling/addition trên elliptic curves nhưng phức tạp hơn.

---

## 5. Torsion Structure và Weil Pairing

> [!abstract] Theorem 6.6 — Torsion Subgroup
> Với $J(C)$ abelian surface trên $\mathbb{F}_{p^2}$ và $n$ với $\gcd(n, p) = 1$:
>
> $$
> J(C)[n] \cong (\mathbb{Z}/n\mathbb{Z})^4
> $$

Torsion group là $\mathbb{Z}^4$ chứ không phải $\mathbb{Z}^2$ như elliptic curve — quan trọng vì kernel của isogeny giữa abelian surfaces phải là **maximal isotropic subgroup** order $n^2$ của $A[n]$.

> [!note] Định nghĩa 6.7 — Weil Pairing Trên Abelian Surface
> Với polarization $\lambda : A \to \hat{A}$, Weil pairing là bilinear form:
>
> $$
> e_n^{\lambda} : A[n] \times A[n] \to \mu_n, \quad (P, Q) \mapsto e_n^{\lambda}(P, Q)
> $$
>
> thỏa mãn alternating ($e_n^\lambda(P,P) = 1$) và non-degenerate.

---

## 6. Superspecial Abelian Surfaces

Tương tự supersingular elliptic curves, Castryck-Decru dùng **superspecial** abelian surfaces.

> [!note] Định nghĩa 6.8 — Superspecial Abelian Surface
> Abelian surface $A / \mathbb{F}_{p^2}$ được gọi là **superspecial** nếu nó isomorphic (trên $\bar{\mathbb{F}}_p$) đến $E_1 \times E_2$ với $E_1, E_2$ là supersingular elliptic curves.

**Tại sao superspecial?** Vì Castryck-Decru xây dựng abelian surface khởi đầu là $E_0 \times C$ với $E_0$ supersingular và $C$ một elliptic curve, và isogeny chain không rời khỏi superspecial locus.

> [!abstract] Theorem 6.9 — Superspecial ↔ Product
> Một principally polarized abelian surface superspecial luôn là Jacobian của một genus-2 curve **hoặc** isomorphic (với product polarization) đến $E_1 \times E_2$ với $E_i$ supersingular.
>
> Điểm mấu chốt: trong Richelot isogeny graph, các **split vertices** (product $E_1 \times E_2$) xen kẽ với các **non-split vertices** (Jacobians).

---

## 7. Tóm Tắt

- Abelian surface $A$ = abelian variety dimension 2; torsion $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$
- **Jacobian** $J(C)$ của genus-2 curve là abelian surface với natural principal polarization
- Hai dạng: **split** ($E_1 \times E_2$) và **non-split** (Jacobian) — Castryck-Decru xây chain giữa hai dạng
- **Superspecial** abelian surfaces = products của supersingular curves — đây là locus attack hoạt động
- Kani's theorem (Lesson 9) sẽ dùng **split/non-split distinction** như oracle để recover secret key

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Ch. VI (Jacobians briefly)
- Birkenhake & Lange — *Complex Abelian Varieties*, Springer, 2004 (Chapters 1–2, 4)
- Flynn, E.V. & Ti, Y.B. — *Genus Two Isogeny Cryptography* (ePrint 2019/758)
- Castryck, W., Decru, T., Smith, B. — *Hash functions from superspecial genus-2 curves using Richelot isogenies* (2020)
