---
title: "11. Polarizations & Invertible Sheaves"
tags: [math, abelian-varieties, lesson-11]
aliases: [Polarizations and Invertible Sheaves]
created: 2026-03-24
---

> **Prerequisites**: [[08-dual-abelian-variety|08. The Dual Abelian Variety]], [[06-abelian-varieties-are-projective|06. Abelian Varieties are Projective]], [[10-endomorphism-algebras|10. Endomorphism Algebras]]
> **Objectives**:
> - Hiểu sâu polarization qua nhiều góc nhìn tương đương
> - Nắm Riemann–Roch cho abelian varieties: $\chi(\mathcal{L}) = \deg(\phi_\mathcal{L})^{1/2} / g!$ 
> - Hiểu index $i(\mathcal{L})$ và Mumford's vanishing theorem: $H^i(A, \mathcal{L}) \neq 0$ chỉ tại $i = i(\mathcal{L})$
> - Biết khi nào $\mathcal{L}$ ample, và cohomology của $\mathcal{L}$ ample trông như thế nào
> - Phân biệt các loại polarization và hiểu moduli space $\mathcal{A}_g$

---

## Motivation / Intuition

Trong Lesson 06, ta đã thấy abelian variety là projective. Câu hỏi tự nhiên tiếp theo: **cohomology của line bundles trên $A$ trông như thế nào?** Đây là câu hỏi trung tâm của lý thuyết.

Trên curve genus $g$, Riemann–Roch cho $h^0(\mathcal{L}) - h^1(\mathcal{L}) = \deg(\mathcal{L}) - g + 1$. Trên abelian variety chiều $g$, có một công thức tương tự nhưng vi diệu hơn: Euler characteristic $\chi(\mathcal{L}) = (\deg \phi_\mathcal{L})^{1/2}$, và cohomology **không trải đều** trên các bậc — có đúng một $i(\mathcal{L})$ (gọi là "index") sao cho $H^i(A, \mathcal{L}) \neq 0$.

Đây chính là nội dung của **Mumford's index theorem** và **Vanishing theorem** — hai kết quả cực kỳ đẹp đặc trưng cho geometry của abelian varieties.

---

## Tái Khảo Sát Polarization

### Các định nghĩa tương đương

> [!abstract] Definition 11.1 — Polarization: Tổng hợp
> Cho $A$ abelian variety trên $k$. Một **polarization** của $A$ là isogeny $\lambda : A \to A^\vee$ thỏa **một** trong các điều kiện sau (tất cả tương đương qua biduality):
>
> 1. **Qua line bundle** (trên $\bar{k}$): $\lambda = \phi_\mathcal{L}$ với $\mathcal{L}$ ample line bundle trên $A_{\bar{k}}$.
> 2. **Symmetric & positive**: $\lambda^\vee = \lambda$ (dưới $A \cong (A^\vee)^\vee$) và $(1_A, \lambda)^* \mathcal{P}$ là ample trên $A$.
> 3. **Qua Riemann form** (trên $\mathbb{C}$): $\lambda = \lambda_H$ với $H$ Hermitian form positive definite, integer-valued trên $\Lambda$.
>
> **Degree** của polarization $= \deg(\lambda) = |\ker \lambda|$.

> [!note] Remark 11.2 — Ampleness là điều kiện "positive definite"
> Polarization là analog algebraic của **positive definite quadratic form** trên lattice $\mathbb{Z}^{2g}$:
> - Quadratic form tương ứng với Hermitian form $H$.
> - Positive definite $\leftrightarrow$ ample.
> - Symmetric $\leftrightarrow$ $\lambda^\vee = \lambda$.
> - Degree = discriminant của quadratic form.
>
> Principal polarization $\leftrightarrow$ "unimodular" quadratic form (discriminant $= 1$).

> [!abstract] Proposition 11.3 — Mọi AV có Polarization
> Với mọi abelian variety $A$, tồn tại polarization $\lambda : A \to A^\vee$.
>
> **Proof.** Vì $A$ projective (Theorem 6.3), tồn tại ample $\mathcal{L}$ trên $A$. Khi đó $\phi_\mathcal{L} : A \to A^\vee$ là polarization. $\blacksquare$

---

## Riemann–Roch cho Abelian Varieties

### Euler characteristic

> [!abstract] Theorem 11.4 — Riemann–Roch cho AV
> Cho $A$ abelian variety chiều $g$ và $\mathcal{L}$ invertible sheaf trên $A$ với $K(\mathcal{L})$ hữu hạn. **Euler characteristic** của $\mathcal{L}$ là:
>
> $$
> \chi(A, \mathcal{L}) = \sum_{i=0}^{g} (-1)^i \dim H^i(A, \mathcal{L}) = \sqrt{\deg \phi_\mathcal{L}}.
> $$
>
> Tương đương, nếu $\mathcal{L}$ ứng với polarization $\lambda$ degree $d$, thì $\chi(\mathcal{L}) = \sqrt{d}$.

**Proof sketch.** Dùng Grothendieck–Riemann–Roch: $\chi(\mathcal{L}) = \int_A \operatorname{ch}(\mathcal{L}) \cdot \operatorname{td}(A)$. Với $A$ abelian variety, $\operatorname{td}(A) = 1$ (vì tangent bundle trivial!). Vậy $\chi(\mathcal{L}) = \int_A \operatorname{ch}(\mathcal{L}) = \frac{c_1(\mathcal{L})^g}{g!}$.

Hơn nữa, $c_1(\mathcal{L})^g = g! \cdot \deg \phi_\mathcal{L}$ (intersection theory). Vậy $\chi(\mathcal{L}) = \deg \phi_\mathcal{L}$... Thực ra công thức chính xác là $\chi(\mathcal{L})^2 = \deg \phi_\mathcal{L}$. $\blacksquare$

> [!example] Example 11.5 — Riemann–Roch trên Elliptic Curve
> Cho $E$ elliptic curve ($g = 1$) và $\mathcal{L} = \mathcal{O}_E(D)$ với $\deg D = d > 0$:
>
> $$
> \chi(E, \mathcal{O}(D)) = h^0 - h^1 = d \quad \text{(Riemann–Roch cổ điển, } g = 1\text{)}.
> $$
>
> Theo công thức trên: $\chi = \sqrt{\deg \phi_\mathcal{L}}$. Với $\mathcal{L} = \mathcal{O}(3[O])$ (principal polarization tensor $3$), $\deg \phi = 9$ nên $\chi = 3 = h^0$. ✓

### Khi $\mathcal{L}$ ample

> [!abstract] Theorem 11.6 — Cohomology của Ample Line Bundle (Mumford Vanishing)
> Cho $\mathcal{L}$ ample invertible sheaf trên abelian variety $A$ chiều $g$. Thì:
>
> $$
> H^i(A, \mathcal{L}) = 0 \quad \forall i > 0.
> $$
>
> Và $h^0(A, \mathcal{L}) = \chi(A, \mathcal{L}) = \sqrt{\deg \phi_\mathcal{L}}$.

**Proof sketch.** Vì $\mathcal{L}$ ample, ta dùng **Kodaira Vanishing** (phiên bản đặc số $0$) hoặc trực tiếp với tính toán cohomology trên complex torus (qua Dolbeault). Trên $\mathbb{C}$: $H^i(A, \mathcal{L}) \cong H^{0,i}(A) \otimes H^0(A, \mathcal{L})$... nhưng vì $\mathcal{L}$ ample (positive definite Hermitian form), $H^{0,i}$ vanishes. $\blacksquare$

> [!example] Example 11.7 — Sections của $\mathcal{O}(n\Theta)$
> Cho $(A, \Theta)$ principally polarized abelian variety chiều $g$ (theta divisor). Khi đó:
>
> $$
> h^0(A, \mathcal{O}(n\Theta)) = n^g.
> $$
>
> Vì $\phi_{\mathcal{O}(\Theta)}$ là isomorphism (principal polarization, degree $1$), $\chi(\mathcal{O}(\Theta)) = 1 = h^0$. Với $\mathcal{O}(n\Theta)$: $\phi_{\mathcal{O}(n\Theta)} = n \cdot \phi_\Theta$, degree $n^{2g}$, nên $h^0 = \chi = n^g$.

---

## Index của Line Bundle

> [!abstract] Theorem 11.8 — Index và Vanishing (Mumford)
> Cho $\mathcal{L}$ invertible sheaf trên $A$ với $K(\mathcal{L})$ hữu hạn. Tồn tại duy nhất integer $i(\mathcal{L}) \in \{0, 1, \ldots, g\}$ gọi là **index** của $\mathcal{L}$ sao cho:
>
> $$
> H^j(A, \mathcal{L}) = 0 \quad \forall j \neq i(\mathcal{L}).
> $$
>
> Đặc biệt:
> - $i(\mathcal{L}) = 0$ $\Leftrightarrow$ $\mathcal{L}$ ample.
> - $|\chi(\mathcal{L})| = \dim H^{i(\mathcal{L})}(A, \mathcal{L})$.

> [!note] Remark 11.9 — Trực giác về Index
> Index đo "mức độ không-ample" của $\mathcal{L}$:
>
> - $i = 0$: $\mathcal{L}$ ample — cohomology tập trung ở degree $0$.
> - $i = g$: $\mathcal{L}^{-1}$ ample — $\mathcal{L}$ "rất anti-ample", cohomology ở degree cao nhất.
> - $0 < i < g$: trung gian.
>
> Đây giống "signature" của Hermitian form: trên complex torus, $i(\mathcal{L})$ là số negative eigenvalues của $H$.

> [!example] Example 11.10 — Index trên Elliptic Curve
> Với $E$ và $\mathcal{L} = \mathcal{O}_E(D)$:
>
> - $\deg D > 0$: $i(\mathcal{L}) = 0$ (ample), $h^0 = d$.
> - $\deg D < 0$: $i(\mathcal{L}) = 1$ ($H^1 \neq 0$), $h^1 = |d|$.
> - $\deg D = 0$: $K(\mathcal{L}) = E$ (không hữu hạn) — không áp dụng định lý trên.

---

## Phân Loại Polarizations và Moduli Space

### Các loại polarization

> [!abstract] Proposition 11.11 — Type và Degree
> Cho $(A, \lambda)$ polarized abelian variety chiều $g$. Trên $\bar{k}$, $\mathcal{L}$ xác định bởi $\lambda = \phi_\mathcal{L}$ có **type** $(d_1, \ldots, d_g)$ với $d_1 \mid d_2 \mid \cdots \mid d_g$ (từ elementary divisors của $\ker \lambda$). Degree $= \prod d_i^2$.
>
> Principal polarization: type $(1, 1, \ldots, 1)$, degree $1$.

> [!abstract] Theorem 11.12 — Mọi AV Isogenous với PPAV
> Mọi abelian variety $A$ là isogenous với một principally polarized abelian variety.
>
> **Proof sketch.** Cho $\lambda : A \to A^\vee$ polarization degree $d$. Đặt $B = A / G$ với $G \subset \ker([d]_A)$ được chọn để $A^\vee / B^\vee \cong G^\vee$... Cụ thể hơn, trên $\mathbb{C}$: cho $\Lambda' \supset \Lambda$ là sublattice với $[\Lambda' : \Lambda]^2 = d$ và $\Lambda'$ tự "dual" theo $E$. Khi đó $\mathbb{C}^g / \Lambda'$ có principal polarization. $\blacksquare$

### Moduli Space $\mathcal{A}_g$

> [!abstract] Theorem 11.13 — Siegel Modular Variety $\mathcal{A}_g$
> **Moduli space** của principally polarized abelian varieties (PPAVs) chiều $g$ là:
>
> $$
> \mathcal{A}_g = \operatorname{Sp}_{2g}(\mathbb{Z}) \backslash \mathcal{H}_g,
> $$
>
> trong đó $\mathcal{H}_g = \{ Z \in M_{g \times g}(\mathbb{C}) \mid Z^T = Z, \operatorname{Im}(Z) > 0 \}$ là Siegel upper half-space, và $\operatorname{Sp}_{2g}(\mathbb{Z})$ tác động qua $Z \mapsto (AZ + B)(CZ + D)^{-1}$.
>
> $\mathcal{A}_g$ là quasiprojective variety (Mumford–Baily–Borel) chiều $g(g+1)/2$:
>
> $$
> \dim \mathcal{A}_g = \dim \mathcal{H}_g = \frac{g(g+1)}{2}.
> $$

> [!example] Example 11.14
> - $g = 1$: $\mathcal{A}_1 = SL_2(\mathbb{Z}) \backslash \mathcal{H}_1$ là modular curve $Y(1)$; parameterizes elliptic curves.
> - $g = 2$: $\mathcal{A}_2$ có $\dim = 3$; chứa Jacobians (closure của Jacobian locus) như subvariety $\dim 3 = 2 \cdot 3 / 2$...
>
> Thực ra: $\mathcal{A}_2$ có dim $3$, và Jacobian locus (Torelli locus) cũng có dim $3 = \dim \mathcal{M}_2$ (moduli of genus 2 curves). Vậy generic PPAV chiều $2$ là Jacobian!
>
> - $g = 3$: $\dim \mathcal{A}_3 = 6 > \dim \mathcal{M}_3 = 6$. Jacobian locus là dense trong $\mathcal{A}_3$.
> - $g = 4$: $\dim \mathcal{A}_4 = 10 > \dim \mathcal{M}_4 = 9$. Jacobian locus có codimension $1$.
> - $g \geq 4$: tồn tại PPAVs không phải Jacobian!

---

## Chern Classes và Intersection Theory

### First Chern class

Với $\mathcal{L}$ line bundle trên $A$, **first Chern class** $c_1(\mathcal{L}) \in H^2(A, \mathbb{Z})$ (hoặc trong $\operatorname{NS}(A)$) là invariant topological cơ bản.

> [!abstract] Proposition 11.15 — Công thức Intersect
> Với abelian variety $A$ chiều $g$ và $\mathcal{L}$ với $K(\mathcal{L})$ hữu hạn:
>
> $$
> \chi(A, \mathcal{L}) = \frac{c_1(\mathcal{L})^g}{g!} = \frac{(c_1(\mathcal{L}), c_1(\mathcal{L}), \ldots, c_1(\mathcal{L}))}{g!}.
> $$
>
> Với $\mathcal{L} = \mathcal{O}(\Theta)$ principal polarization: $c_1(\Theta)^g = g!$, nên $\chi(\mathcal{O}(\Theta)) = 1$.

> [!example] Example 11.16 — Intersection trên Abelian Surface
> Cho $A = E_1 \times E_2$ product của 2 elliptic curves với $\Theta_i = [O_i]$ (điểm gốc). Kết quả: principal polarization của $A$ là $\Theta = (\{O_1\} \times E_2) + (E_1 \times \{O_2\})$ (tổ hợp). Self-intersection: $\Theta^2 = 2$ ($g = 2$, $g! = 2$). ✓

---

## SageMath Cheatsheet

```python
# Riemann-Roch: h^0(L) = chi(L) = sqrt(deg phi_L) khi L ample
# Trên elliptic curve (g=1): h^0(O(d*O)) = d khi d > 0
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])

# Principal polarization: O([O]) -> h^0 = 1
# O(2[O]) -> h^0 = 2, O(3[O]) -> h^0 = 3, v.v.
for d in [1, 2, 3]:
    # h^0(O(d*O)) = d (Riemann-Roch: d - 1 + 1 = d)
    print(f"h^0(O({d}*[O])) = {d}  (Riemann-Roch)")

# Very ample: O(3*[O]) gives embedding E -> P^2
print("\nO(3[O]) is very ample: gives Weierstrass embedding E -> P^2")
```

```python
# Degree of polarization phi_L: deg = (chi(L))^2
# Với g=1: deg phi_L = (h^0)^2 = d^2 (với L = O(d[O]))
E = EllipticCurve(GF(101), [1, 2])

# Principal polarization: L = O([O]), deg phi_L = 1
# 2-polarization: L = O(2[O]), deg phi_L = 4
for d in [1, 2, 3]:
    chi = d  # h^0 = d trên elliptic curve
    deg_phi = chi**2
    print(f"d={d}: chi(O(d[O])) = {chi}, deg phi_L = {deg_phi}")
```

```python
# Siegel upper half-space H_g và A_g
# Cho g=1: H_1 = upper half-plane, A_1 = H_1/SL_2(Z)
# tau -> tau + 1, tau -> -1/tau (generators of SL_2(Z))

from sage.all import *
g = 1
dim_Hg = g*(g+1)//2
print(f"g={g}: dim(H_g) = {dim_Hg}, dim(A_g) = {dim_Hg}")

for g in range(1, 6):
    dim = g*(g+1)//2
    print(f"g={g}: dim(A_g) = {dim}")

# So sánh dim A_g và dim M_g (moduli of curves)
# dim M_g = 3g-3 (g >= 2)
print("\ndim A_g vs dim M_g:")
for g in range(2, 7):
    dim_Ag = g*(g+1)//2
    dim_Mg = 3*g - 3
    print(f"g={g}: dim(A_g)={dim_Ag}, dim(M_g)={dim_Mg}, diff={dim_Ag - dim_Mg}")
```

```python
# Theta divisor và h^0(O(n*Theta)) = n^g
# Cho PPAV (A, Theta) chiều g:
for g in [1, 2, 3]:
    for n in [1, 2, 3]:
        h0 = n**g
        print(f"g={g}, n={n}: h^0(O(n*Theta)) = n^g = {h0}")
    print()
```

```python
# Index của line bundle: ample <-> index 0
# Với E elliptic curve:
# O(D) ample <-> deg D > 0 <-> index 0 <-> H^0 != 0, H^1 = 0
# O(D) anti-ample <-> deg D < 0 <-> index 1 <-> H^0 = 0, H^1 != 0
E = EllipticCurve(GF(101), [1, 0])
# Degree 3 line bundle: ample, index 0
# h^0 = 3, h^1 = 0 (vanishing)
print("O(3[O]): ample, index i=0")
print("  h^0 = 3  (Riemann-Roch)")
print("  h^1 = 0  (Mumford vanishing)")
print("  chi = h^0 - h^1 = 3 = sqrt(deg phi_L) = sqrt(9)")
```

---

## Summary / Key Takeaways

- **Polarization** $\lambda : A \to A^\vee$: symmetric isogeny ứng với ample line bundle $\mathcal{L}$ (qua $\lambda = \phi_\mathcal{L}$). Degree $= |\ker \lambda|$.
- **Riemann–Roch**: $\chi(A, \mathcal{L}) = \sqrt{\deg \phi_\mathcal{L}}$; với $\mathcal{L}$ ample, $\chi = h^0$.
- **Ample $\Rightarrow$ Vanishing**: $H^i(A, \mathcal{L}) = 0$ với $i > 0$ khi $\mathcal{L}$ ample.
- **Index $i(\mathcal{L})$**: unique integer sao cho $H^j(A, \mathcal{L}) = 0$ với $j \neq i$; $i = 0$ $\Leftrightarrow$ $\mathcal{L}$ ample.
- **$h^0(O(n\Theta)) = n^g$** với principal polarization $\Theta$ — hệ quả Riemann–Roch và Mumford vanishing.
- **Moduli space** $\mathcal{A}_g = \operatorname{Sp}_{2g}(\mathbb{Z}) \backslash \mathcal{H}_g$: dim $= g(g+1)/2$.
- Mọi AV **isogenous** với PPAV; với $g \leq 3$, generic PPAV là Jacobian của curve.
- **Chern classes**: $\chi(\mathcal{L}) = c_1(\mathcal{L})^g / g!$; với $\mathcal{O}(\Theta)$ principal, $c_1(\Theta)^g = g!$.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §11 (Polarizations and Invertible Sheaves).
- Mumford, D. *Abelian Varieties*, §§16–17 (Cohomology, Theta functions).
- Debarre, O. *Two or Three Things I Know About Abelian Varieties*, §§3–4.
- Arapura, D. *Abelian Varieties and Moduli*, §4 (Siegel modular variety).
