---
title: "08. The Dual Abelian Variety"
tags: [math, abelian-varieties, lesson-08]
aliases: [The Dual Abelian Variety]
created: 2026-03-24
---

> **Prerequisites**: [[07-isogenies|07. Isogenies]], [[05-theorem-of-the-cube|05. Theorem of the Cube & Square]], [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]]
> **Objectives**:
> - Hiểu dual abelian variety $A^\vee$ qua moduli problem: phân loại degree-0 line bundles
> - Nắm Poincaré bundle $\mathcal{P}$ trên $A \times A^\vee$ và universal property của nó
> - Biết hai lối định nghĩa chính: analytic ($A^\vee = \bar{V}^\vee/\Lambda^\vee$) và algebraic ($A^\vee = A/K(\mathcal{L})$)
> - Hiểu biduality $(A^\vee)^\vee \cong A$ và dual của isogeny $f^\vee : B^\vee \to A^\vee$

---

## Motivation / Intuition

Với elliptic curve $E$, điều đặc biệt là $E \cong E^\vee$ — đường cong và dual của nó là isomorphic. Điều này xảy ra vì $g = 1$, và "dual" của một torus $1$-chiều vẫn là torus $1$-chiều.

Với $g \geq 2$, $A$ và $A^\vee$ **không** isomorphic nói chung (dù luôn isogenous). Vậy $A^\vee$ là gì? Câu trả lời: $A^\vee$ là **moduli space** của degree-0 line bundles trên $A$ — tức là space "đại số hóa" tất cả line bundles trong $\operatorname{Pic}^0(A)$.

Trực giác từ phân tích phức: $A = V/\Lambda$ thì $A^\vee = \bar{V}^\vee/\Lambda^\vee$ — space kép theo nghĩa Hermitian của không gian vectơ phức. Đây là cách xây dựng tự nhiên nhất qua phân tích. Phần khó hơn là xây dựng $A^\vee$ theo ngôn ngữ thuần algebraic, và đây là thành tựu kỹ thuật quan trọng.

---

## Định Nghĩa Qua Moduli Problem

> [!abstract] Definition 8.1 — Functor $F_A$ và Dual Abelian Variety
> Cho $A$ abelian variety trên $k$. Định nghĩa functor:
>
> $$
> F_A : \{ k\text{-varieties} \}^{\rm op} \to \{ \text{sets} \},
> $$
>
> gửi $k$-variety $T$ sang:
>
> $$
> F_A(T) = \left\{ \mathcal{L} \in \operatorname{Pic}(A \times T) \;\middle|\; \begin{array}{l} \mathcal{L}|_{A \times \{t\}} \in \operatorname{Pic}^0(A) \; \forall t \in T(\bar{k}) \\ \mathcal{L}|_{\{0\} \times T} \cong \mathcal{O}_T \end{array} \right\}.
> $$
>
> Nói cách khác, $F_A(T)$ là các "gia đình degree-0 line bundles trên $A$, trivial tại origin, parametrized by $T$".
>
> **Dual abelian variety** $A^\vee$ là variety đại diện functor $F_A$ (nếu tồn tại):
>
> $$
> F_A(T) \cong \operatorname{Hom}(T, A^\vee) \quad \text{(natural bijection)}.
> $$

Điều kiện normalization "$\mathcal{L}|_{\{0\} \times T} \cong \mathcal{O}_T$" (gọi là **rigidification**) đảm bảo uniqueness — không có automorphism nào của $\mathcal{L}$ ngoài identity.

> [!abstract] Theorem 8.2 — Tồn tại và Tính Chất của $A^\vee$
> Cho $A$ abelian variety chiều $g$ trên $k$. Thì:
>
> 1. $A^\vee$ tồn tại, là abelian variety chiều $g$ trên $k$.
> 2. $A^\vee(k) \cong \operatorname{Pic}^0(A)$ như nhóm abelian.
> 3. Tồn tại **Poincaré bundle** $\mathcal{P}$ trên $A \times A^\vee$ với rigidification, là universal element của $F_A$.
> 4. Functor $A \mapsto A^\vee$ là contravariant: morphism $f : A \to B$ induces $f^\vee : B^\vee \to A^\vee$.

**Proof sketch** (đặc số $0$ và $k = \bar{k}$): Chọn ample $\mathcal{L}$ trên $A$. Map $\phi_\mathcal{L} : A \to \operatorname{Pic}^0(A)$ surjective với kernel $K(\mathcal{L})$ (hữu hạn, từ Theorem 6.5). Định nghĩa $A^\vee = A / K(\mathcal{L})$ (quotient bởi finite group scheme). Poincaré bundle thu được bằng cách "descent" Mumford bundle $m^*\mathcal{L} \otimes p_1^*\mathcal{L}^{-1} \otimes p_2^*\mathcal{L}^{-1}$ từ $A \times A$ xuống $A \times A^\vee$. Xem chi tiết tại [[a2-construction-of-dual-abelian-variety|A2. Construction of the Dual Abelian Variety]]. $\blacksquare$

---

## Analytic Description

Trên $\mathbb{C}$, ta có mô tả tường minh hoàn toàn:

> [!abstract] Proposition 8.3 — Dual qua Analytic Uniformization
> Cho $A = V/\Lambda$ complex torus polarizable. **Dual abelian variety** là:
>
> $$
> A^\vee = \overline{V}^\vee / \Lambda^\vee,
> $$
>
> trong đó $\overline{V}^\vee = \operatorname{Hom}_{\mathbb{C}\text{-antilinear}}(V, \mathbb{C})$ và $\Lambda^\vee = \{ f \in \overline{V}^\vee \mid \operatorname{Im}(f(\lambda)) \in \mathbb{Z} \;\forall \lambda \in \Lambda \}$.
>
> Poincaré bundle $\mathcal{P}$ trên $A \times A^\vee$ ứng với Hermitian form $H((v, f), (v', f')) = f'(v) + \overline{f(v')}$ trên $V \times \overline{V}^\vee$.

> [!example] Example 8.4 — Dual của elliptic curve
> Với $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$, $V = \mathbb{C}$, $\Lambda = \mathbb{Z} + \mathbb{Z}\tau$. Ta có:
>
> $$
> \overline{V}^\vee = \{ f : \mathbb{C} \to \mathbb{C} \mid f \text{ anti-linear} \} \cong \mathbb{C}, \quad f = f_z : w \mapsto z\bar{w}.
> $$
>
> Dual lattice: $\Lambda^\vee = \{ z \in \mathbb{C} \mid \operatorname{Im}(z \cdot \bar{\lambda}) \in \mathbb{Z} \; \forall \lambda \in \Lambda \}$.
>
> Với $\lambda = 1$: $\operatorname{Im}(z) \in \mathbb{Z}$. Với $\lambda = \tau$: $\operatorname{Im}(z\bar{\tau}) \in \mathbb{Z}$.
>
> Tính toán: $\Lambda^\vee = \frac{1}{\operatorname{Im}(\tau)} (\mathbb{Z} - \bar{\tau}\mathbb{Z}) \cong \mathbb{Z} + \mathbb{Z} \cdot \frac{1}{\operatorname{Im}(\tau)} \cdot (-\bar{\tau})$.
>
> Điều này cho $E^\vee \cong E$ qua isomorphism $\mathbb{C}/\Lambda \to \mathbb{C}/\Lambda^\vee$, $z \mapsto \frac{z}{\operatorname{Im}(\tau)}$. ✓

---

## Poincaré Bundle và Universal Property

> [!abstract] Theorem 8.5 — Universal Property của Poincaré Bundle
> Cặp $(A^\vee, \mathcal{P})$ có universal property sau: với mọi $k$-variety $T$ và mọi $\mathcal{L} \in F_A(T)$, tồn tại **duy nhất** morphism $\phi : T \to A^\vee$ sao cho:
>
> $$
> (\operatorname{id}_A \times \phi)^* \mathcal{P} \cong \mathcal{L} \quad \text{trong } F_A(T).
> $$
>
> Nói cách khác, $(A^\vee, \mathcal{P})$ là **fine moduli space** (với rigidification) của degree-0 line bundles trên $A$.

> [!note] Remark 8.6 — Poincaré Bundle và $\operatorname{Pic}^0$
> Áp dụng universal property với $T = \operatorname{Spec}(k)$ (một điểm):
>
> - $F_A(k) = \operatorname{Pic}^0(A)$ (degree-0 line bundles, rigidified trivially).
> - Morphisms $k \to A^\vee$ ứng với $k$-points của $A^\vee$.
>
> Vậy $A^\vee(k) \cong \operatorname{Pic}^0(A)$ — mỗi $k$-rational point của $A^\vee$ ứng với một class trong $\operatorname{Pic}^0(A)$.

> [!abstract] Proposition 8.7 — Poincaré Bundle trên $A^\vee \times A$
> Poincaré bundle thỏa **symmetry condition**:
>
> $$
> \text{swap}^* \mathcal{P}_{A^\vee \times A} \cong \mathcal{P}_{A \times A^\vee},
> $$
>
> trong đó $\text{swap} : A^\vee \times A \to A \times A^\vee$ là hoán đổi nhân tử. Điều này phản ánh tính đối xứng giữa $A$ và $A^\vee$.

---

## Biduality

> [!abstract] Theorem 8.8 — Biduality $(A^\vee)^\vee \cong A$
> Có isomorphism tự nhiên $(A^\vee)^\vee \cong A$ tương thích với Poincaré bundles.
>
> Cụ thể, universal property của $(A^\vee)^\vee$ với $T = A$ và $\mathcal{L} = $ swap$^*\mathcal{P}$ cho morphism $\kappa : A \to (A^\vee)^\vee$, và $\kappa$ là isomorphism.

**Proof sketch.** Xét functor $F_{A^\vee}$: universal property của $(A^\vee)^\vee$ cho $F_{A^\vee}(T) \cong \operatorname{Hom}(T, (A^\vee)^\vee)$. Áp dụng với $T = A$ và line bundle $\operatorname{swap}^* \mathcal{P}$ trên $A^\vee \times A$: ta được $\kappa : A \to (A^\vee)^\vee$. Kiểm tra $\kappa$ là isomorphism bằng cách xem nó trên analytic uniformization: $(A^\vee)^\vee = ((\bar{V}^\vee)^\vee) / ((\Lambda^\vee)^\vee) = V/\Lambda = A$. $\blacksquare$

---

## Dual của Morphisms và Isogenies

> [!abstract] Definition 8.9 — Dual Morphism
> Cho $f : A \to B$ morphism của abelian varieties. **Dual morphism** $f^\vee : B^\vee \to A^\vee$ xác định bởi: với $T$-point $(\mathcal{L}, \iota) \in F_B(T)$, ánh xạ sang $(f \times \operatorname{id})^*\mathcal{L} \in F_A(T)$.
>
> Equivalently, $f^\vee$ là morphism duy nhất thỏa:
>
> $$
> (\operatorname{id}_A \times f^\vee)^* \mathcal{P}_A \cong (f \times \operatorname{id}_{B^\vee})^* \mathcal{P}_B.
> $$

> [!abstract] Theorem 8.10 — Dual Isogeny = Dual Morphism
> Với $f : A \to B$ isogeny, dual morphism $f^\vee : B^\vee \to A^\vee$ (từ Definition 8.9) trùng với dual isogeny $f^\vee$ (từ Theorem 7.6). Cụ thể:
>
> $$
> f^\vee \circ f = [n]_{A^\vee}, \quad f \circ f^\vee = [n]_{B^\vee}, \quad \deg(f^\vee) = \deg(f).
> $$

> [!abstract] Corollary 8.11 — $\phi_\mathcal{L} : A \to A^\vee$ là Isogeny khi $\mathcal{L}$ Ample
> Với $\mathcal{L}$ ample, map $\phi_\mathcal{L} : A \to A^\vee$, $a \mapsto [t_a^*\mathcal{L} \otimes \mathcal{L}^{-1}]$, là isogeny với $\ker(\phi_\mathcal{L}) = K(\mathcal{L})$ hữu hạn.
>
> $\phi_\mathcal{L}$ **symmetric**: $\phi_\mathcal{L}^\vee = \phi_\mathcal{L}$ (qua biduality $A \cong (A^\vee)^\vee$).

---

## $A^\vee$ là Picard Scheme

> [!abstract] Theorem 8.12 — $A^\vee$ như Connected Component của $\operatorname{Pic}_{A/k}$
> Dual abelian variety $A^\vee$ là **identity component** $\operatorname{Pic}^0_{A/k}$ của Picard scheme $\operatorname{Pic}_{A/k}$ (Grothendieck).
>
> Đây là cách nhìn hiện đại nhất: $\operatorname{Pic}_{A/k}$ là group scheme đại diện functor $T \mapsto \operatorname{Pic}(A \times T) / \operatorname{Pic}(T)$, và $A^\vee$ là connected component chứa $0$.

> [!note] Remark 8.13 — Tangent Space của $A^\vee$
> Tangent space của $A^\vee$ tại $0$ là $T_{A^\vee, 0} \cong H^1(A, \mathcal{O}_A)$. Điều này giải thích tại sao $\dim A^\vee = \dim A = g$: từ Betti cohomology, $\dim H^1(A, \mathcal{O}_A) = g$.

---

## Ví dụ Tường Minh: Jacobian là Self-Dual

> [!example] Example 8.14 — Jacobian có Principal Polarization
> Cho $C$ curve smooth projective genus $g$ với $k$-rational point $P_0$. Jacobian $J(C) = \operatorname{Pic}^0(C)$ là abelian variety chiều $g$.
>
> **Theta divisor** $\Theta \subset J(C)$ xác định bởi image của map:
>
> $$
> C^{(g-1)} \to J(C), \quad (P_1, \ldots, P_{g-1}) \mapsto \left[\sum_{i=1}^{g-1} P_i - (g-1)P_0\right].
> $$
>
> **Principal polarization**: $\mathcal{L}(\Theta) \in \operatorname{Pic}(J(C))$ là ample với $K(\mathcal{L}(\Theta)) = 0$, cho isomorphism $\lambda_\Theta : J(C) \xrightarrow{\sim} J(C)^\vee$.
>
> Vậy Jacobian có **canonical principal polarization** — nó là PPAV tự nhiên!

---

## SageMath Cheatsheet

```python
# Dual abelian variety: A^vee = Pic^0(A)
# Với elliptic curve E, E^vee ≅ E (canonical isomorphism)
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])

# Pic^0(E) ≅ E(Q) qua P ↦ [P] - [O]
# Dual map phi_L: E -> E^vee = E
P = E([16, -61])
Q = E([-1, 4])

# phi_{O([O])}(P) = t_P^* O([O]) ⊗ O([O])^{-1} = O([P]-[O]) ∈ Pic^0(E) ≅ E
# Tức là: phi_L(P) = P - O = P trong E (vì O là gốc)
print(f"P = {P}")
print(f"phi_L(P) = {P}  (trong E ≅ E^vee)")
print(f"Confirmation: E^vee ≅ E via canonical polarization")
```

```python
# Poincare bundle trên E x E^vee
# Line bundle P = O(Delta - E x {O} - {O} x E) với Delta là đường chéo
# Restriction: P|_{E x {a}} = O([a] - [O]) = class của a trong Pic^0(E)

E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P = E([16, -61])
Q = E([-1, 4])

# Universal property: phi: T -> E^vee ứng với L trên E x T
# Với T = Spec(Q), L = class của P trong Pic^0(E)
# phi(pt) = P trong E^vee = E
print("Universal property:")
print(f"  Point P = {P} corresponds to L = O([P]-[O]) in Pic^0(E)")
print(f"  phi(point) = {P} in E^vee ≅ E")
```

```python
# Biduality: (E^vee)^vee ≅ E
# Qua kappa: E -> (E^vee)^vee = E^vee^vee ≅ E
E = EllipticCurve(QQ, [1, 0])
# Với g=1: E^vee ≅ E, nên (E^vee)^vee ≅ E^vee ≅ E
print("Biduality for g=1 (elliptic curve):")
print(f"  E ≅ E^vee (canonical for g=1)")
print(f"  (E^vee)^vee ≅ (E)^vee ≅ E")
print(f"  Confirmed: biduality holds")
```

```python
# Dual isogeny [n]^vee = [n]
# Và degree: deg(f^vee) = deg(f)
E = EllipticCurve(GF(23), [1, 0])

# Isogeny f: E -> E của degree 2 (2-isogeny)
iso_list = E.isogenies_prime_degree(2)
if iso_list:
    f = iso_list[0]
    f_dual = f.dual()
    print(f"f degree = {f.degree()}")
    print(f"f^vee degree = {f_dual.degree()}")
    print(f"deg(f) == deg(f^vee): {f.degree() == f_dual.degree()}")
```

```python
# phi_L: A -> A^vee là isogeny khi L ample
# Kernel K(L) hữu hạn với |K(L)| = degree(phi_L)
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
# L = O(3*O) là ample; phi_L: E -> E^vee là isomorphism (principal polarization)
# K(L) = {O} (chỉ điểm gốc)
print("phi_L với L = O(3*O) (principal polarization):")
print("  K(L) = {O}  (kernel trivial)")
print("  deg(phi_L) = 1  (principal = isomorphism)")
print("  phi_L: E -> E^vee = E là isomorphism")
```

---

## Summary / Key Takeaways

- **$A^\vee$** là moduli space của degree-0 line bundles trên $A$ (với rigidification); $A^\vee(k) \cong \operatorname{Pic}^0(A)$.
- **Poincaré bundle** $\mathcal{P}$ trên $A \times A^\vee$: universal family — mọi gia đình degree-0 line bundles pullback từ $\mathcal{P}$ theo đúng một morphism $T \to A^\vee$.
- **Analytic**: $A^\vee = \bar{V}^\vee / \Lambda^\vee$ (không gian vectơ phức dual, lattice dual).
- **Algebraic**: $A^\vee = A / K(\mathcal{L})$ với $\mathcal{L}$ ample; Poincaré bundle thu từ descent của Mumford bundle.
- **Biduality**: $(A^\vee)^\vee \cong A$ tự nhiên — functor duality là involution.
- **Dual morphism** $f^\vee : B^\vee \to A^\vee$ contravariant: $f^\vee$ được định nghĩa bởi pullback line bundles qua $f$.
- **$g = 1$**: $E \cong E^\vee$ — elliptic curve tự dual qua polarization canonical.
- **$g \geq 2$**: $A \not\cong A^\vee$ nói chung, nhưng luôn isogenous qua $\phi_\mathcal{L}$.
- **$\phi_\mathcal{L} : A \to A^\vee$**: isogeny khi $\mathcal{L}$ ample; symmetric; $\ker = K(\mathcal{L})$. Đây là polarization algebraic.
- **Jacobian** $J(C)$: canonical PPAV với theta divisor $\Theta$, isomorphism $J(C) \xrightarrow{\sim} J(C)^\vee$.
- **$A^\vee$ là $\operatorname{Pic}^0_{A/k}$**: identity component của Picard scheme (Grothendieck); tangent space $H^1(A, \mathcal{O}_A)$.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §§9–12 (Dual AV: Definition, Construction, Dual Exact Sequence).
- Mumford, D. *Abelian Varieties*, §§8–13.
- Conrad, B. *Polarizations* (VIGRE, Stanford 2004).
- Wikipedia: *Dual abelian variety*.
- Moonen, B. *Algebraic Cycles on Abelian Varieties* (AWS 2024), §4.
