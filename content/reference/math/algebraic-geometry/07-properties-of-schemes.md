---
title: "07. Properties of Schemes & Morphisms"
tags: [math, algebraic-geometry, lesson-07, properties]
aliases: [Properties of Schemes and Morphisms]
created: 2026-03-31
---

> **Prerequisites**: [[06-morphisms-of-schemes|06. Morphisms of Schemes]]
> **Objectives**:
> - Phân biệt các tính chất của schemes: reduced, integral, Noetherian, connected, irreducible
> - Nắm tính chất của morphisms: separated, quasi-compact, locally of finite type, finite type
> - Hiểu valuative criterion cho separatedness
> - Nhận biết các ví dụ và phản ví dụ

---

## Motivation / Intuition

Giống như trong topo học ta phân loại không gian (compact, Hausdorff, connected...), trong algebraic geometry ta cần phân loại schemes và morphisms. Các tính chất này:

- **Trên schemes**: reduced, integral, Noetherian, irreducible — kiểm soát cấu trúc đại số của rings địa phương.
- **Trên morphisms**: separated, quasi-compact, finite type — kiểm soát hành vi "tổng thể" của ánh xạ.

Quan trọng nhất là **separatedness** — analog của Hausdorff trong algebraic geometry.

---

## Tính Chất của Schemes

### Definition

> [!definition] Definition 7.1 — Các tính chất cơ bản của scheme $X$
>
> - **Reduced**: Với mọi open $U$, $\mathcal{O}_X(U)$ không có nilpotent element $\neq 0$. Tương đương: mọi stalk $\mathcal{O}_{X,x}$ là reduced.
>
> - **Integral**: $X$ reduced và irreducible. Tương đương: với mọi nonempty open $U$, $\mathcal{O}_X(U)$ là integral domain.
>
> - **Irreducible**: $|X|$ là irreducible như không gian topo: $X = Z_1 \cup Z_2$ (closed) $\Rightarrow X = Z_1$ hoặc $X = Z_2$.
>
> - **Noetherian**: $X$ có open cover bởi finitely many $\operatorname{Spec} R_i$ với $R_i$ Noetherian.
>
> - **Connected**: $|X|$ connected (không phải disjoint union của hai clopen subsets $\neq \emptyset$).
>
> - **Locally Noetherian**: mọi open affine là $\operatorname{Spec} R$ với $R$ Noetherian.

### Worked Example

> [!example] Example 7.2 — Phân loại các affine schemes
>
> | Scheme | Reduced | Integral | Noetherian |
> |--------|---------|----------|------------|
> | $\operatorname{Spec} k[x]$ | ✓ | ✓ | ✓ |
> | $\operatorname{Spec} k[x]/(x^2)$ | ✗ | ✗ | ✓ |
> | $\operatorname{Spec} k[x,y]/(xy)$ | ✓ | ✗ | ✓ |
> | $\operatorname{Spec} \mathbb{Z}$ | ✓ | ✓ | ✓ |
> | $\operatorname{Spec} k[[x_1,x_2,\ldots]]$ | ✓ | ✓ | ✗ |
>
> $k[x]/(x^2)$: nilpotent $x$ (mod $x^2$), nên không reduced.
> $k[x,y]/(xy)$: $x \cdot y = 0$ trong coordinate ring, nên không integral (nhưng reduced vì $(xy)$ là radical).

> [!theorem] Theorem 7.3 — Reduction
> Với mọi scheme $X$, tồn tại closed immersion $X_{red} \hookrightarrow X$ với $X_{red}$ reduced và cùng underlying topological space. $X_{red} = \operatorname{Spec} R/\sqrt{0}$ locally.

---

## Separatedness

### Definition

> [!definition] Definition 7.4 — Diagonal Morphism
> Cho $f : X \to S$ là morphism. **Diagonal morphism** là morphism $\Delta_{X/S} : X \to X \times_S X$ cảm sinh bởi $\operatorname{id}_X$ trên cả hai thành phần.

> [!definition] Definition 7.5 — Separated Morphism
> Morphism $f : X \to S$ là **separated** nếu diagonal $\Delta_{X/S} : X \to X \times_S X$ là **closed immersion**.
>
> Scheme $X$ là **separated** (over $\mathbb{Z}$) nếu morphism $X \to \operatorname{Spec} \mathbb{Z}$ là separated.

> [!note] Remark 7.6 — Tại sao separated ~ Hausdorff
> Trong topo học, $X$ Hausdorff $\iff$ diagonal $\Delta : X \to X \times X$ là closed. Đây là analog chính xác. Tuy nhiên, Zariski topology không Hausdorff, nên ta dùng closed immersion của schemes thay vì closed set.
>
> "Line với hai gốc" (Counterexample 5.6) **không** separated: diagonal không closed vì hai gốc không thể tách nhau.

### Theorem

> [!theorem] Theorem 7.7 — Separatedness cho affine morphisms
> Mọi affine morphism là separated. Đặc biệt, mọi affine scheme là separated.

**Proof.**
$f : X = \operatorname{Spec} A \to Y = \operatorname{Spec} B$ affine. Diagonal $\Delta : \operatorname{Spec} A \to \operatorname{Spec} A \times_{\operatorname{Spec} B} \operatorname{Spec} A = \operatorname{Spec}(A \otimes_B A)$ cảm sinh bởi multiplication map $\mu : A \otimes_B A \to A$, $a \otimes a' \mapsto aa'$. Đây là surjection (vì $a \otimes 1 \mapsto a$), nên $\Delta$ là closed immersion. $\blacksquare$

### Theorem

> [!theorem] Theorem 7.8 — Valuative Criterion for Separatedness
> Morphism qcqs $f : X \to Y$ là separated $\iff$ với mọi valuation ring $R$ với fraction field $K$ và mọi diagram
>
> $$
> \begin{array}{ccc}
> \operatorname{Spec} K & \to & X \\
> \downarrow & & \downarrow f \\
> \operatorname{Spec} R & \to & Y
> \end{array}
> $$
>
> tồn tại **nhiều nhất một** morphism $\operatorname{Spec} R \to X$ làm diagram commute.

> [!note] Remark 7.9
> Hình dung: $\operatorname{Spec} R$ là "một đoạn cong" với điểm generic $\operatorname{Spec} K$ và điểm closed. Nếu đường cong đi vào $X$ qua điểm generic, thì có nhiều nhất một cách kéo dài đến điểm closed. Đây là analog của: trong Hausdorff space, limits là duy nhất.

---

## Tính Chất của Morphisms

### Definition

> [!definition] Definition 7.10 — Quasi-compact và Quasi-separated
>
> - $f : X \to Y$ là **quasi-compact** (qc) nếu preimage của mọi open affine $V \subseteq Y$ là quasi-compact.
> - $f$ là **quasi-separated** (qs) nếu diagonal $\Delta : X \to X \times_Y X$ là quasi-compact.
> - **qcqs** = quasi-compact và quasi-separated.

> [!definition] Definition 7.11 — Locally of Finite Type và Finite Type
>
> - $f : X \to Y$ là **locally of finite type** nếu với mọi affine $V = \operatorname{Spec} B \subseteq Y$, mọi affine $U = \operatorname{Spec} A \subseteq f^{-1}(V)$ có $A$ là f.g. $B$-algebra.
>
> - $f$ là **of finite type** nếu locally of finite type và quasi-compact.
>
> - $f$ là **finite** nếu với mọi affine $V = \operatorname{Spec} B \subseteq Y$, $f^{-1}(V) = \operatorname{Spec} A$ với $A$ là f.g. $B$-module.

### Worked Example

> [!example] Example 7.12 — Phân loại morphisms
>
> | Morphism | f.t. | finite | affine | separated |
> |---------|------|--------|--------|-----------|
> | $\mathbb{A}^n_k \to \operatorname{Spec} k$ | ✓ | ✗ | ✓ | ✓ |
> | $\mathbb{P}^n_k \to \operatorname{Spec} k$ | ✓ | ✗ | ✗ | ✓ |
> | $\operatorname{Spec} k[x,y]/(xy) \to \operatorname{Spec} k$ | ✓ | ✗ | ✓ | ✓ |
> | $\operatorname{Spec} k \to \operatorname{Spec} k[x]$ (điểm closed) | ✓ | ✓ | ✓ | ✓ |
> | $\operatorname{Spec} \bar{k} \to \operatorname{Spec} k$ (alg. closure) | l.f.t | ✗ | ✓ | ✓ |

---

## Immersions và Subschemes

### Definition

> [!definition] Definition 7.13 — Open và Closed Subscheme
>
> - **Open subscheme**: open immersion $U \hookrightarrow X$.
>
> - **Closed subscheme** $Z \hookrightarrow X$: determined by quasi-coherent ideal sheaf $\mathcal{I} \subseteq \mathcal{O}_X$; locally ($X = \operatorname{Spec} R$, $Z = \operatorname{Spec} R/I$).
>
> - **Locally closed immersion**: composition của một closed immersion sau một open immersion.

> [!note] Remark 7.14 — Scheme-theoretic intersection
> Cho $Y, Z$ closed subschemes của $X$ với ideal sheaves $\mathcal{I}_Y$, $\mathcal{I}_Z$. **Scheme-theoretic intersection** là $Y \cap Z = V(\mathcal{I}_Y + \mathcal{I}_Z)$.
>
> Điều này cho phép ta theo dõi multiplicities: $V(x) \cap V(x^2 - y^2) = V(x, x^2-y^2) = V(x,y^2)$ — intersection "kép" tại gốc, nắm bắt thông tin tangency.

---

## SageMath Cheatsheet

```python
# Kiểm tra tính chất của rings và schemes

R = QQ['x', 'y']
x, y = R.gens()

# Reduced: không có nilpotent
I = R.ideal(x*y)
A = R.quotient(I)
print(A.is_reduced())           # True: (xy) là radical

# Integral domain
I2 = R.ideal(x^2)
B = R.quotient(I2)
print(B.is_integral_domain())   # False: x là nilpotent

# Noetherian: mọi finitely generated ring là Noetherian (Hilbert basis theorem)
S = QQ['x1, x2, x3, x4, x5']
print(S.is_noetherian())        # True

# Irreducibility: ideal là prime?
I3 = R.ideal(y^2 - x^3 + x)  # Elliptic curve
print(I3.is_prime())            # True: curve irreducible

# Separatedness: diagonal map
# Affine schemes always separated - check via surjectivity of mult map
A_ring = QQ['x']
# Multiplication map A ⊗_k A -> A: f⊗g |-> fg
# This is surjective, hence diagonal is closed immersion

# Finite type: check if algebra is finitely generated
from sage.rings.polynomial.polynomial_ring_constructor import PolynomialRing
R_base = QQ
A_alg = PolynomialRing(R_base, ['x', 'y'])
print(A_alg.is_finitely_generated())  # True (f.g. QQ-algebra)
```

---

## Summary / Key Takeaways

- **Reduced** $\iff$ no nilpotents; **Integral** = reduced + irreducible; **Noetherian** = Noetherian rings locally.
- **Separated** $\iff$ diagonal $\Delta : X \to X \times_S X$ là closed immersion — analog algebraic của Hausdorff.
- Mọi affine (morphism hoặc scheme) là separated và quasi-compact.
- **Valuative criterion**: morphism separated $\iff$ mọi "đường cong đến $X$" có nhiều nhất một cách kéo dài.
- **Finite type** = locally f.g. algebras + quasi-compact — "tương đương hữu hạn" về kích thước.
- **Closed subscheme** $V(\mathcal{I})$: xác định bởi ideal sheaf; scheme-theoretic intersection theo dõi multiplicities.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 7–10.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §4.
- Liu, Q. *Algebraic Geometry and Arithmetic Curves*, Chapter 3.
