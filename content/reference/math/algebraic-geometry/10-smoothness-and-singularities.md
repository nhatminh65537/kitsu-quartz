---
title: "10. Smoothness & Singularities"
tags: [math, algebraic-geometry, lesson-10, smoothness, singularities, differentials]
aliases: [Smoothness and Singularities]
created: 2026-03-31
---

> **Prerequisites**: [[09-dimension-theory|09. Dimension Theory]]; Commutative algebra: regular local rings, completion.
> **Objectives**:
> - Định nghĩa regular local ring và smooth point
> - Xây dựng Zariski tangent space và sheaf of differentials $\Omega_{X/S}$
> - Phân biệt smooth, étale, và unramified morphisms
> - Phân tích singularities: nodes, cusps, và các ví dụ cơ bản

---

## Motivation / Intuition

Trong giải tích, "điểm trơn" (smooth point) của variety $f(x,y) = 0$ là điểm $p$ mà gradient $\nabla f(p) \neq 0$ — Jacobian không suy biến. Trong algebraic geometry, ta generalize điều này theo hai hướng:

1. **Local criterion**: local ring tại điểm là **regular** (regularity của Commutative Algebra).
2. **Global criterion**: **sheaf of differentials** $\Omega_{X/S}$ locally free của rank đúng.

Đây là điểm gặp nhau của algebra, geometry, và calculus.

---

## Regular Local Rings

### Definition

> [!definition] Definition 10.1 — Regular Local Ring
> Một Noetherian local ring $(A, \mathfrak{m}, k)$ ($k = A/\mathfrak{m}$ residue field) là **regular** nếu:
>
> $$
> \dim A = \dim_k (\mathfrak{m}/\mathfrak{m}^2).
> $$
>
> Số $\dim_k(\mathfrak{m}/\mathfrak{m}^2)$ gọi là **embedding dimension** (= số "tham số địa phương tối thiểu"). Điều kiện regular nghĩa là Krull dimension bằng embedding dimension.

> [!theorem] Theorem 10.2 — Tính chất của Regular Local Ring
>
> 1. Regular local ring là **integral domain**.
> 2. Regular local ring là **UFD** (unique factorization domain).
> 3. $A$ regular $\iff$ $\mathfrak{m}$ có thể sinh bởi đúng $d = \dim A$ phần tử (hệ tham số chính quy — regular system of parameters).
> 4. $A$ regular $\iff$ $\operatorname{gl.dim}(A) < \infty$ (Serre's theorem).

> [!definition] Definition 10.3 — Smooth Point và Singular Point
> Cho $X$ là scheme locally of finite type over field $k$. Điểm $x \in X$ là:
>
> - **Regular** (hoặc **smooth** nếu $k$ perfect): $\mathcal{O}_{X,x}$ là regular local ring.
> - **Singular**: không regular.
>
> $X$ là **regular** (hay **smooth** over $k$) nếu mọi điểm đều regular.

### Worked Example

> [!example] Example 10.4 — Điểm regular và singular
>
> **Parabola** $C = V(y - x^2) \subseteq \mathbb{A}^2_k$: $A(C) = k[x,y]/(y-x^2) \cong k[x]$, stalk tại mọi điểm là DVR (discrete valuation ring) — regular. $C$ là smooth curve.
>
> **Cusp** $C' = V(y^2 - x^3) \subseteq \mathbb{A}^2_k$: Tại gốc $O = (0,0)$, local ring là $k[x,y]_{(x,y)}/(y^2-x^3)$. Maximal ideal $\mathfrak{m} = (x,y)$, nhưng $\dim_k \mathfrak{m}/\mathfrak{m}^2 = 2$ (generators $x, y$ mod $\mathfrak{m}^2$) trong khi $\dim = 1$. Suy ra $O$ là **singular point** (cusp).
>
> **Node** $C'' = V(y^2 - x^2(x+1))$: Tại gốc, $\dim_k \mathfrak{m}/\mathfrak{m}^2 = 2 \neq 1 = \dim$. Singular point (node = nút).

---

## Zariski Tangent Space

### Definition

> [!definition] Definition 10.5 — Zariski Tangent Space
> Cho $(A, \mathfrak{m}, k)$ là local ring. **Zariski tangent space** của $\operatorname{Spec} A$ tại điểm closed $\mathfrak{m}$ là:
>
> $$
> T_{\mathfrak{m}}(\operatorname{Spec} A) := (\mathfrak{m}/\mathfrak{m}^2)^\vee = \operatorname{Hom}_k(\mathfrak{m}/\mathfrak{m}^2, k).
> $$
>
> Tổng quát hơn với $X$ scheme và $x \in X$ (closed point over $k$): **tangent space** là
>
> $$
> T_x X := \operatorname{Hom}_{k(x)}(\mathfrak{m}_x/\mathfrak{m}_x^2, k(x)).
> $$
>
> Dimension của $T_x X$ bằng embedding dimension; $\dim T_x X = \dim \mathcal{O}_{X,x}$ $\iff$ $x$ là regular.

> [!note] Remark 10.6 — Tangent vector như derivation
> Tangent vector $v \in T_x X$ tương đương với $k$-linear derivation $D_v : \mathcal{O}_{X,x} \to k(x)$ (thỏa Leibniz rule). Điều này liên hệ với $\Omega_{X/k}$.

### Worked Example

> [!example] Example 10.7 — Zariski tangent space
> Cho $C = V(f) \subseteq \mathbb{A}^2_k$ với $f \in k[x,y]$ và $p = (a,b) \in C$.
>
> Maximal ideal của $A = k[x,y]/(f)$ tại $p$: $\mathfrak{m} = (x-a, y-b)/(f)$.
>
> Taylor expansion: $f = f_x(p)(x-a) + f_y(p)(y-b) + \text{bậc cao}$.
>
> Trong $\mathfrak{m}/\mathfrak{m}^2$, $f \equiv f_x(p)(x-a) + f_y(p)(y-b) = 0$ (vì $f \in \mathfrak{m}$).
>
> Nếu $(f_x(p), f_y(p)) \neq (0,0)$: $\mathfrak{m}/\mathfrak{m}^2$ có 1 generator $\Rightarrow$ regular.
> Nếu $(f_x(p), f_y(p)) = (0,0)$: $\mathfrak{m}/\mathfrak{m}^2$ sinh bởi $\{x-a, y-b\}$ $\Rightarrow$ singular.
>
> Đây chính xác là tiêu chuẩn Jacobian của calculus!

---

## Sheaf of Differentials

### Definition

> [!definition] Definition 10.8 — Module of Kähler Differentials
> Cho $A \to B$ là ring map. **Module of Kähler differentials** $\Omega_{B/A}$ là $B$-module với generators $\{db \mid b \in B\}$ và relations:
>
> 1. $d(b + b') = db + db'$,
> 2. $d(bb') = b\, db' + b'\, db$ (Leibniz rule),
> 3. $da = 0$ với mọi $a \in A$ (image của $A \to B$).
>
> Tương đương: $\Omega_{B/A} = I/I^2$ trong đó $I = \ker(\mu : B \otimes_A B \to B)$, $\mu(b \otimes b') = bb'$.

> [!definition] Definition 10.9 — Sheaf of Relative Differentials $\Omega_{X/S}$
> Cho $f : X \to S$ là morphism. **Sheaf of relative differentials** $\Omega_{X/S}$ là quasi-coherent $\mathcal{O}_X$-module định nghĩa locally: nếu $U = \operatorname{Spec} B \subseteq X$, $V = \operatorname{Spec} A \subseteq S$ với $f(U) \subseteq V$, thì $\Omega_{X/S}|_U = \widetilde{\Omega_{B/A}}$.
>
> Tương đương: $\Omega_{X/S} = \mathcal{I}/\mathcal{I}^2$ trong đó $\mathcal{I} = \ker(\mathcal{O}_{X \times_S X} \to \mathcal{O}_X)$ là ideal sheaf của diagonal $\Delta$.

### Worked Example

> [!example] Example 10.10 — Tính $\Omega_{B/A}$ cụ thể
>
> **$\Omega_{k[x]/k}$**: Generator $dx$. Relations: $d(fg) = fdg + gdf$. Vậy $\Omega_{k[x]/k} = k[x] \cdot dx \cong k[x]$ — free module rank 1.
>
> **$\Omega_{k[x,y]/k}$**: Generators $dx, dy$. $\Omega = k[x,y] dx \oplus k[x,y] dy$ — free rank 2.
>
> **$\Omega_{k[x,y]/(f)/k}$**: Generators $dx, dy$ với relation $df = f_x dx + f_y dy = 0$.
>
> Ví dụ: $f = y^2 - x^3$, $df = 2y\, dy - 3x^2\, dx = 0$.
>
> $$
> \Omega_{C/k} = \frac{k[x,y]dx \oplus k[x,y]dy}{(y^2-x^3, \; 2y\,dy - 3x^2\,dx)}.
> $$
>
> Tại smooth point $(1,1)$: $df|_{(1,1)} = 2\,dy - 3\,dx \neq 0$, nên ta có thể express $dy$ bằng $dx$ — locally free rank 1.
>
> Tại singular point $(0,0)$: $df|_{(0,0)} = 0$ — không thể express, $\Omega$ không locally free tại $(0,0)$.

> [!theorem] Theorem 10.11 — First Exact Sequence of Differentials
> Cho $A \to B \to C$. Có exact sequence:
>
> $$
> \Omega_{B/A} \otimes_B C \to \Omega_{C/A} \to \Omega_{C/B} \to 0.
> $$

> [!theorem] Theorem 10.12 — Second Exact Sequence (Conormal Sequence)
> Cho $I \subseteq B$ ideal và $C = B/I$. Có exact sequence:
>
> $$
> I/I^2 \xrightarrow{\delta} \Omega_{B/A} \otimes_B C \to \Omega_{C/A} \to 0.
> $$
>
> Đây gọi là **conormal sequence**; $I/I^2$ là **conormal sheaf** của $\operatorname{Spec} C \hookrightarrow \operatorname{Spec} B$.

---

## Smooth, Étale, và Unramified Morphisms

### Definition

> [!definition] Definition 10.13 — Smooth Morphism
> Morphism locally of finite type $f : X \to S$ là **smooth of relative dimension $n$** tại $x$ nếu có open neighborhoods $U \ni x$, $V \ni f(x)$ và factorization
>
> $$
> U \hookrightarrow \mathbb{A}^{n+m}_V \to \mathbb{A}^m_V \to V
> $$
>
> trong đó $U \hookrightarrow \mathbb{A}^{n+m}_V$ là open immersion vào fiber product, và locally given bởi $m$ equations với Jacobian matrix rank $m$.
>
> Tương đương (trên Noetherian base): $f$ là **flat** và mọi geometric fiber $X_{\bar{s}}$ là regular.

> [!definition] Definition 10.14 — Étale và Unramified
>
> - $f$ là **unramified** tại $x$: $\mathfrak{m}_{f(x)} \mathcal{O}_{X,x} = \mathfrak{m}_x$ và $k(x)/k(f(x))$ là finite separable.
>
> - $f$ là **étale** tại $x$: $f$ là flat và unramified tại $x$. Tương đương: $f$ là smooth của relative dimension 0.
>
> Trực giác: étale = "local isomorphism" trong algebraic geometry (analog của covering map trong topo học).

> [!note] Remark 10.15 — Jacobian criterion
> Cho $f : \operatorname{Spec} k[x_1,\ldots,x_n]/(f_1,\ldots,f_r) \to \operatorname{Spec} k$. Variety smooth tại $p$ $\iff$ Jacobian matrix $\left(\frac{\partial f_i}{\partial x_j}(p)\right)$ có rank $r$.

### Worked Example

> [!example] Example 10.16 — Smooth morphisms
>
> **$\mathbb{A}^n_k \to \operatorname{Spec} k$**: smooth, relative dimension $n$. Mọi điểm là smooth.
>
> **$\mathbb{P}^n_k \to \operatorname{Spec} k$**: smooth, relative dimension $n$.
>
> **Elliptic curve** $E : y^2 = x^3 - x$ over $\mathbb{Q}$: Jacobian $(2y, 3x^2 - 1)$. Tại $(0,0)$: $y = 0, x = 0$, Jacobian $= (0,-1) \neq (0,0)$. Nhưng $(0,0) \notin E$ vì $0 \neq 0^3 - 0 = 0$... thực ra $(0,0)$ không trên $E$. $E$ là smooth.
>
> **Cusp** $y^2 = x^3$: Jacobian $(2y, 3x^2)$. Tại $(0,0)$: $(0,0)$ — singular.
>
> **Node** $y^2 = x^2(x+1)$: Jacobian $(2y, 3x^2+2x)$. Tại $(0,0)$: $(0,0)$ — singular.

---

## SageMath Cheatsheet

```python
# Smoothness và singularities trong Sage

R = QQ['x', 'y']
x, y = R.gens()

# Kiểm tra smooth: Jacobian criterion
f = y^2 - x^3 + x   # Elliptic curve

# Tính partial derivatives (Jacobian)
df_dx = f.derivative(x)  # -3x^2 + 1
df_dy = f.derivative(y)  # 2y

# Singular points: f = 0, df/dx = 0, df/dy = 0
I_sing = R.ideal(f, df_dx, df_dy)
print(I_sing.variety())  # Empty: smooth curve

# Cusp: y^2 = x^3
g = y^2 - x^3
dg_dx = g.derivative(x)  # -3x^2
dg_dy = g.derivative(y)  # 2y
I_cusp = R.ideal(g, dg_dx, dg_dy)
print(I_cusp.variety())  # {(0,0)}: singular at origin

# Sheaf of differentials (Kähler differentials)
# Omega_{k[x,y]/(f)/k} = (k[x,y]dx + k[x,y]dy) / (df)
# Module computation
A = R.quotient(f)
# In Sage, differentials via:
# A.module_of_differentials() or similar

# Regular local ring check
# Via embedding dimension vs Krull dimension
p = R.ideal(x, y)    # Origin
R_local = R.localization(p)
m = p * R_local      # Maximal ideal

# Elliptic curve as smooth projective variety
E = EllipticCurve(QQ, [1, 0])   # y^2 = x^3 + x
print(E.is_smooth())              # True
print(E.discriminant())           # Nonzero => smooth

# Singular cubic
# y^2 = x^3 has discriminant 0
# EllipticCurve requires nonzero discriminant, so use general curve
P2 = ProjectiveSpace(2, QQ)
x0, x1, x2 = P2.coordinate_ring().gens()
cusp = P2.subscheme(x1^2*x2 - x0^3)   # Projective cusp
print(cusp.is_smooth())                  # False
print(cusp.singular_points())            # [0:0:1]
```

---

## Summary / Key Takeaways

- **Regular local ring** $(A, \mathfrak{m}, k)$: $\dim A = \dim_k(\mathfrak{m}/\mathfrak{m}^2)$ — embedding dimension = Krull dimension.
- **Smooth point** $x \in X$: $\mathcal{O}_{X,x}$ là regular local ring.
- **Zariski tangent space** $T_x X = \operatorname{Hom}_k(\mathfrak{m}_x/\mathfrak{m}_x^2, k)$: $\dim T_x X = \dim \mathcal{O}_{X,x}$ $\iff$ smooth.
- **Jacobian criterion**: $V(f_1,\ldots,f_r)$ smooth tại $p$ $\iff$ Jacobian matrix rank $r$ tại $p$.
- **Kähler differentials** $\Omega_{B/A}$: sinh bởi $\{db\}$ với Leibniz rule; $\Omega_{k[x]/k} = k[x]dx$.
- **Sheaf of differentials** $\Omega_{X/S}$: locally free iff smooth; encodes infinitesimal geometry.
- **Smooth**: flat + regular fibers; **étale**: smooth rel. dim. 0 = "local isomorphism"; **unramified**: étale + quasifinite.
- Singularities: cusp $y^2 = x^3$ (gradient vanishes), node $y^2 = x^2(x+1)$ — phân loại theo tangent cone.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 21–25.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §8, Chapter III §10.
- Matsumura, H. *Commutative Ring Theory*, Chapters 14–15.
- Grothendieck, A. *EGA IV*, §16–17 (définition de la lissité).
