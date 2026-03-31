---
title: "06. Morphisms of Schemes"
tags: [math, algebraic-geometry, lesson-06, morphisms]
aliases: [Morphisms of Schemes]
created: 2026-03-31
---

> **Prerequisites**: [[05-schemes-and-gluing|05. Schemes & Gluing]]
> **Objectives**:
> - Hiểu morphism của locally ringed spaces một cách tường minh
> - Xây dựng và phân tích fiber products
> - Nắm khái niệm base change và $S$-scheme
> - Phân biệt các loại morphism: open/closed immersion, affine morphism

---

## Motivation / Intuition

Trong algebraic geometry, các morphism (ánh xạ giữa schemes) đóng vai trò trung tâm hơn cả bản thân schemes. Thay vì hỏi "scheme $X$ là gì?", ta thường hỏi "$X$ là gì **so với** scheme $S$?" — đây là triết lý "relative geometry" của Grothendieck.

---

## Morphisms of Schemes

### Definition

> [!definition] Definition 6.1 — Morphism of Schemes
> Một **morphism** $f : X \to Y$ của schemes là morphism của locally ringed spaces: cặp $(f, f^\#)$ với $f : |X| \to |Y|$ liên tục và $f^\# : \mathcal{O}_Y \to f_*\mathcal{O}_X$ morphism sheaves, sao cho với mọi $x \in X$, map stalks
>
> $$
> f^\#_x : \mathcal{O}_{Y,f(x)} \to \mathcal{O}_{X,x}
> $$
>
> là local homomorphism: $(f^\#_x)^{-1}(\mathfrak{m}_x) = \mathfrak{m}_{f(x)}$.

> [!theorem] Theorem 6.2 — Morphisms giữa affine schemes
> Với $X = \operatorname{Spec} A$ và $Y = \operatorname{Spec} B$, có bijection tự nhiên:
>
> $$
> \operatorname{Hom}_{\mathbf{Sch}}(X, Y) \cong \operatorname{Hom}_{\mathbf{Ring}}(B, A).
> $$
>
> Cụ thể, ring hom $\phi : B \to A$ cảm sinh $f = \operatorname{Spec}\phi : \operatorname{Spec} A \to \operatorname{Spec} B$ bởi $f(\mathfrak{p}) = \phi^{-1}(\mathfrak{p})$.

### Worked Example

> [!example] Example 6.3 — Các morphism cơ bản
>
> **Frobenius**: $F : \operatorname{Spec} \mathbb{F}_p[x] \to \operatorname{Spec} \mathbb{F}_p[x]$ cảm sinh bởi $x \mapsto x^p$. Đây là morphism quan trọng trong arithmetic geometry.
>
> **Normalization**: $\operatorname{Spec} k[t] \to \operatorname{Spec} k[t^2, t^3]$ cảm sinh bởi $k[t^2,t^3] \hookrightarrow k[t]$. Đây là normalization của đường cong cusp $y^2 = x^3$.
>
> **Structure morphism**: Mọi $k$-scheme $X$ có morphism $X \to \operatorname{Spec} k$ (gọi là structure morphism), biến $X$ thành một đối tượng "relative over $k$".

---

## $S$-Schemes và Relative Geometry

### Definition

> [!definition] Definition 6.4 — $S$-Scheme
> Cho $S$ là scheme. Một **$S$-scheme** là morphism $f : X \to S$ (gọi là **structure morphism**). Một **morphism of $S$-schemes** $(X \to S) \to (Y \to S)$ là morphism $X \to Y$ making diagram
>
> $$
> \begin{array}{ccc}
> X & \to & Y \\
> \searrow & & \swarrow \\
>  & S &
> \end{array}
> $$
>
> commute. $S$-schemes tạo thành category $\mathbf{Sch}_S$.

> [!note] Remark 6.5
> Khi $S = \operatorname{Spec} k$, $k$-schemes là schemes trên trường $k$ — đây là setting classical. Khi $S = \operatorname{Spec} \mathbb{Z}$, mọi scheme đều là $\mathbb{Z}$-scheme một cách duy nhất.

---

## Fiber Products

### Theorem

> [!theorem] Theorem 6.6 — Tồn tại Fiber Products
> Cho $X \xrightarrow{f} S \xleftarrow{g} Y$ là morphisms của schemes. **Fiber product** $X \times_S Y$ tồn tại trong category $\mathbf{Sch}$, đặc trưng bởi tính phổ quát:
>
> $$
> \operatorname{Hom}_{\mathbf{Sch}}(T, X \times_S Y) \cong \operatorname{Hom}_{\mathbf{Sch}/S}(T, X) \times_{\operatorname{Hom}(T,S)} \operatorname{Hom}_{\mathbf{Sch}/S}(T, Y).
> $$
>
> Với $X = \operatorname{Spec} A$, $Y = \operatorname{Spec} B$, $S = \operatorname{Spec} R$:
>
> $$
> X \times_S Y = \operatorname{Spec}(A \otimes_R B).
> $$

**Proof (affine case).**
$A \otimes_R B$ thỏa tính phổ quát của tensor product: ring hom $A \otimes_R B \to C$ tương đương với cặp $(A \to C, B \to C)$ tương thích với $R \to C$. Điều này dịch sang tính phổ quát của fiber product. $\blacksquare$

### Worked Example

> [!example] Example 6.7 — Fiber products cụ thể
>
> **Intersection**: Cho $X = V(f)$ và $Y = V(g)$ trong $\mathbb{A}^n_k$. Thì:
>
> $$
> X \cap Y = X \times_{\mathbb{A}^n} Y = \operatorname{Spec}\left(\frac{k[\mathbf{x}]}{(f)} \otimes_{k[\mathbf{x}]} \frac{k[\mathbf{x}]}{(g)}\right) = \operatorname{Spec} \frac{k[\mathbf{x}]}{(f,g)} = V(f,g).
> $$
>
> **Base change** (đổi cơ sở): Cho $X = \operatorname{Spec} \mathbb{Z}[x,y]/(y^2 - x^3 - 1)$ (elliptic curve over $\mathbb{Z}$). Base change về $\mathbb{F}_5$:
>
> $$
> X_{\mathbb{F}_5} := X \times_{\operatorname{Spec}\mathbb{Z}} \operatorname{Spec}\mathbb{F}_5 = \operatorname{Spec} \mathbb{F}_5[x,y]/(y^2 - x^3 - 1).
> $$
>
> **Diagonal**: Diagram $X \xrightarrow{\operatorname{id}} X \xleftarrow{\operatorname{id}} X$ cho $X \times_X X \cong X$ (diagonal).

> [!example] Example 6.8 — Geometric fiber
> Cho $f : X \to S$ và điểm $s \in S$ với $\operatorname{Spec} k(s) \to S$. **Geometric fiber** tại $s$ là:
>
> $$
> X_s := X \times_S \operatorname{Spec} k(s).
> $$
>
> Đây là "lát cắt" của $X$ tại điểm $s$. Ví dụ: cho $X = \operatorname{Spec} \mathbb{Z}[x]/(x^2 + 1)$ và $S = \operatorname{Spec} \mathbb{Z}$:
> - Fiber tại $(2)$: $\operatorname{Spec} \mathbb{F}_2[x]/(x+1)^2$ — một "fat point" (vì $x^2+1 = (x+1)^2$ mod 2).
> - Fiber tại $(5)$: $\operatorname{Spec} \mathbb{F}_5[x]/(x^2+1) = \operatorname{Spec}(\mathbb{F}_5 \times \mathbb{F}_5)$ — hai điểm (vì $x^2 + 1 = (x-2)(x+2)$ mod 5).
> - Fiber tại $(3)$: $\operatorname{Spec} \mathbb{F}_3[x]/(x^2+1)$ — một điểm (vì $x^2+1$ irreducible mod 3).

---

## Open và Closed Immersions

### Definition

> [!definition] Definition 6.9 — Open Immersion
> Morphism $f : U \to X$ là **open immersion** nếu $f$ cảm sinh isomorphism $U \xrightarrow{\sim} f(U)$ với $f(U)$ là open subscheme của $X$. Tương đương: $f$ là homeomorphism onto open subset và $f^\# : \mathcal{O}_X|_{f(U)} \to f_*\mathcal{O}_U$ là isomorphism.

> [!definition] Definition 6.10 — Closed Immersion
> Morphism $i : Z \hookrightarrow X$ là **closed immersion** nếu:
> 1. $i$ là homeomorphism onto closed subset của $|X|$,
> 2. $i^\# : \mathcal{O}_X \to i_*\mathcal{O}_Z$ là surjection với kernel là **quasi-coherent ideal sheaf** $\mathcal{I} \subseteq \mathcal{O}_X$.
>
> Ta viết $Z = V(\mathcal{I})$ và $\mathcal{O}_Z = \mathcal{O}_X/\mathcal{I}$.

> [!example] Example 6.11 — Closed immersions cụ thể
>
> Với $X = \operatorname{Spec} R$ và $I \subseteq R$ là ideal: $V(I) = \operatorname{Spec} R/I \hookrightarrow \operatorname{Spec} R$ là closed immersion.
>
> **Zero section**: $\operatorname{Spec} k \hookrightarrow \mathbb{A}^1_k$ tại origin, cảm sinh bởi $k[x] \to k$, $x \mapsto 0$.
>
> **Diagonal morphism**: $\Delta : X \to X \times_S X$ (xem Lesson 07 về separated schemes).

---

## Affine Morphisms

### Definition

> [!definition] Definition 6.12 — Affine Morphism
> Morphism $f : X \to Y$ là **affine** nếu với mọi open affine $V = \operatorname{Spec} B \subseteq Y$, $f^{-1}(V) = \operatorname{Spec} A$ là affine.
>
> Khi đó $f_*\mathcal{O}_X$ là quasi-coherent $\mathcal{O}_Y$-algebra, và $f$ tương đương với dữ liệu $\mathcal{O}_Y$-algebra này.

---

## SageMath Cheatsheet

```python
# Morphisms và fiber products trong Sage

# Morphism giữa affine schemes qua ring hom
R = QQ['x, y']
S = QQ['t']
x, y = R.gens()
t = S.gen()

# Ring hom S -> R: t |-> x^2 + y^2
phi = S.hom([x^2 + y^2], R)
print(phi)  # Ring morphism from QQ[t] to QQ[x,y]

# Fiber product: A tensor_R B
A = QQ['x'].quotient(QQ['x'].gen()^2 - 2)  # Q[x]/(x^2-2) = Q(sqrt(2))
B = QQ['y'].quotient(QQ['y'].gen()^2 - 3)  # Q[y]/(y^2-3)
# A tensor_Q B ~= Q[x,y]/(x^2-2, y^2-3)
T = A.tensor_product(B)
print(T)

# Base change: elliptic curve from Z to F_5
E = EllipticCurve([0, 0, 0, -1, 0])   # y^2 = x^3 - x over Q
E5 = E.change_ring(GF(5))              # Base change to F_5
print(E5)
print(E5.points())                      # Points over F_5

# Frobenius morphism
p = 5
Fp = GF(p)
R2 = Fp['x']
x2 = R2.gen()
frob = R2.hom([x2^p], R2)  # x |-> x^p
print(frob)
```

---

## Summary / Key Takeaways

- **Morphism** $f : X \to Y$: cặp $(f, f^\#)$ với $f^\#_x$ là local homomorphism trên stalks.
- Với affine schemes: $\operatorname{Hom}(\operatorname{Spec} A, \operatorname{Spec} B) \cong \operatorname{Hom}(B, A)$ — algebra $\leftrightarrow$ geometry.
- **$S$-scheme**: morphism $X \to S$; relative geometry là chìa khóa của Grothendieck.
- **Fiber product** $X \times_S Y$: tồn tại trong $\mathbf{Sch}$; trên affine = tensor product.
- **Geometric fiber** $X_s = X \times_S \operatorname{Spec} k(s)$: "lát cắt" tại điểm $s$.
- **Open immersion** $\cong$ isomorphism onto open subset.
- **Closed immersion** = surjection $\mathcal{O}_X \to \mathcal{O}_Z$ — xác định bởi ideal sheaf $\mathcal{I}$.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 6–7.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §3.
- Grothendieck, A. *EGA I*, §§1–2 (IHES, 1960).
