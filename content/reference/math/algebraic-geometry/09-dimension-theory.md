---
title: "09. Dimension Theory"
tags: [math, algebraic-geometry, lesson-09, dimension]
aliases: [Dimension Theory]
created: 2026-03-31
---

> **Prerequisites**: [[07-properties-of-schemes|07. Properties of Schemes & Morphisms]]; Commutative algebra: Krull dimension, prime chains, integral extensions.
> **Objectives**:
> - Định nghĩa Krull dimension và dimension của scheme
> - Liên hệ dimension với transcendence degree
> - Hiểu codimension và generic point
> - Nắm các định lý cơ bản: dimension formula, fiber dimension theorem

---

## Motivation / Intuition

Dimension là bất biến cơ bản nhất của một không gian. Trong algebraic geometry, ta định nghĩa dimension theo ngôn ngữ của prime ideal chains — không phải bằng cách đo độ dài hay số chiều vật lý. Điều tuyệt vời là định nghĩa này tự động cho kết quả đúng: $\dim \mathbb{A}^n = n$, $\dim \mathbb{P}^n = n$, và $\dim \operatorname{Spec} \mathbb{Z} = 1$.

---

## Krull Dimension

### Definition

> [!definition] Definition 9.1 — Krull Dimension của vành
> **Krull dimension** của commutative ring $R$, ký hiệu $\dim R$, là supremum của độ dài các chuỗi prime ideals:
>
> $$
> \dim R := \sup \{n \mid \exists\, \mathfrak{p}_0 \subsetneq \mathfrak{p}_1 \subsetneq \cdots \subsetneq \mathfrak{p}_n \text{ trong } \operatorname{Spec} R\}.
> $$

> [!definition] Definition 9.2 — Dimension của Scheme
> **Dimension** của scheme $X$, ký hiệu $\dim X$, là Krull dimension của underlying topological space $|X|$:
>
> $$
> \dim X := \sup \{n \mid \exists\, Z_0 \subsetneq Z_1 \subsetneq \cdots \subsetneq Z_n \text{ closed irreducible subsets của } |X|\}.
> $$
>
> Với $X = \operatorname{Spec} R$: $\dim X = \dim R$.

### Worked Example

> [!example] Example 9.3 — Dimension của các schemes cơ bản
>
> **$\dim k = 0$**: Trường $k$ có duy nhất prime ideal $(0)$, nên $\dim k[x_1,\ldots,x_n]/(x_1,\ldots,x_n) = 0$.
>
> **$\dim k[x_1,\ldots,x_n] = n$**: Chuỗi tối đại $(0) \subsetneq (x_1) \subsetneq (x_1,x_2) \subsetneq \cdots \subsetneq (x_1,\ldots,x_n)$ có độ dài $n$.
>
> **$\dim \mathbb{Z} = 1$**: Chuỗi $(0) \subsetneq (p)$, với $(p)$ maximal, có độ dài 1.
>
> **$\dim \mathbb{Z}[x] = 2$**: $(0) \subsetneq (p) \subsetneq (p, x-a)$.
>
> **$\dim \mathbb{A}^n_k = n$** và **$\dim \mathbb{P}^n_k = n$**.

---

## Dimension và Transcendence Degree

### Theorem

> [!theorem] Theorem 9.4 — Dimension = Transcendence Degree (over k)
> Cho $k$ là trường và $X$ là integral $k$-scheme của finite type. Khi đó:
>
> $$
> \dim X = \operatorname{tr.deg}_k k(X),
> $$
>
> trong đó $k(X) := \mathcal{O}_{X,\eta}$ là function field ($\eta$ là generic point của $X$).

**Proof sketch.**
Với $X = \operatorname{Spec} A$ affine integral, $k(X) = \operatorname{Frac}(A)$. Theo Noether normalization, có inclusion $k[t_1,\ldots,t_d] \hookrightarrow A$ là integral extension, với $d = \operatorname{tr.deg}_k k(X)$. Integral extensions bảo toàn Krull dimension (going-up theorem), nên $\dim A = \dim k[t_1,\ldots,t_d] = d$. $\blacksquare$

> [!corollary] Corollary 9.5
> Mọi irreducible component của $k$-variety $X$ loại hữu hạn có cùng dimension khi $X$ là equidimensional.

---

## Codimension và Generic Points

### Definition

> [!definition] Definition 9.6 — Codimension
> Cho $Z \subseteq X$ là closed irreducible subset. **Codimension** của $Z$ trong $X$ là:
>
> $$
> \operatorname{codim}(Z, X) := \sup \{n \mid \exists\, Z = Z_0 \subsetneq Z_1 \subsetneq \cdots \subsetneq Z_n \subseteq X \text{ closed irreducible}\}.
> $$
>
> Với $X$ integral Noetherian và $Z = \overline{\{\mathfrak{p}\}}$, $\operatorname{codim}(Z, X) = \operatorname{ht}(\mathfrak{p})$ (height của prime ideal $\mathfrak{p}$).

> [!note] Remark 9.7 — Generic Point
> Trong scheme $X$, mỗi irreducible closed subset $Z$ có một **generic point** $\eta_Z$: điểm duy nhất với $\overline{\{\eta_Z\}} = Z$.
>
> Đối với $X = \operatorname{Spec} R$ integral, generic point là prime ideal $(0)$ với $\overline{\{(0)\}} = \operatorname{Spec} R$ (toàn bộ scheme). Generic point là "điểm tổng quát" nằm trong mọi open dense subset.

> [!warning] Counterexample 9.8 — $\dim Z + \operatorname{codim}(Z,X) \neq \dim X$ nói chung
> Trên $X = \operatorname{Spec} k[x,y,z]/(xz, yz)$: $X = V(xz) \cap V(yz)$ gồm mặt phẳng $z = 0$ ($\dim 2$) và đường thẳng $x = y = 0$ ($\dim 1$). Codimension của đường thẳng trong $X$ là 1, nhưng $\dim X = 2$, nên $1 + 1 = 2 = \dim X$. Nhưng với schemes không equidimensional, công thức này có thể sai.

---

## Dimension Formula

### Theorem

> [!theorem] Theorem 9.9 — Dimension Formula for Morphisms
> Cho $f : X \to Y$ là morphism của finite type giữa integral Noetherian schemes. Với $x \in X$ và $y = f(x)$:
>
> $$
> \dim \mathcal{O}_{X,x} \leq \dim \mathcal{O}_{Y,y} + \dim \mathcal{O}_{X_y, x},
> $$
>
> trong đó $X_y = X \times_Y \operatorname{Spec} k(y)$ là geometric fiber tại $y$.
>
> Đẳng thức xảy ra khi $f$ flat.

> [!corollary] Corollary 9.10 — Fiber Dimension Theorem
> Cho $f : X \to Y$ của finite type với $X, Y$ integral Noetherian. Với $y \in f(X)$:
>
> $$
> \dim X_y \geq \dim X - \dim Y.
> $$
>
> Hơn nữa, $\{y \in Y \mid \dim X_y = \dim X - \dim Y\}$ chứa open dense subset của $Y$ (khi $f$ dominant).

### Worked Example

> [!example] Example 9.11 — Dimension của fiber
> Xét $f : \mathbb{A}^2_k \to \mathbb{A}^1_k$, $(x,y) \mapsto x$ (projection lên trục $x$).
>
> $\dim \mathbb{A}^2 = 2$, $\dim \mathbb{A}^1 = 1$. Dự đoán: fiber generic có $\dim = 1$.
>
> Fiber tại $a \in \mathbb{A}^1$: $X_a = \{(a,y) \mid y \in k\} \cong \mathbb{A}^1$, $\dim = 1$. ✓
>
> Tất cả fibers có cùng dimension vì $f$ flat (projection là flat).

---

## Height của Ideal và Krull's Hauptidealsatz

### Theorem

> [!theorem] Theorem 9.12 — Krull's Hauptidealsatz (Principal Ideal Theorem)
> Cho $R$ Noetherian và $f \in R$ là phần tử không phải zero divisor, không đơn vị. Nếu $\mathfrak{p}$ là prime ideal minimal trên $(f)$, thì:
>
> $$
> \operatorname{ht}(\mathfrak{p}) \leq 1.
> $$

> [!corollary] Corollary 9.13 — Generalized Hauptidealsatz
> Cho $R$ Noetherian và $I = (f_1, \ldots, f_r)$. Nếu $\mathfrak{p}$ là prime minimal trên $I$, thì $\operatorname{ht}(\mathfrak{p}) \leq r$.

> [!note] Remark 9.14 — Hệ quả hình học
> Trong $\mathbb{A}^n$: một hypersurface $V(f)$ (codimension 1) cắt variety $X$ của dimension $d$ trong một tập ít nhất dimension $d-1$. Tổng quát: cắt với $r$ hypersurfaces không làm giảm dimension quá $r$.

### Worked Example

> [!example] Example 9.15 — Dimension của giao cắt
> Trong $\mathbb{A}^4_k$, xét hai mặt phẳng:
>
> $$
> V_1 = V(x_1, x_2) \cong \mathbb{A}^2, \quad V_2 = V(x_3, x_4) \cong \mathbb{A}^2.
> $$
>
> Giao: $V_1 \cap V_2 = V(x_1,x_2,x_3,x_4) = \{0\}$, dimension $0$.
>
> Theo Hauptidealsatz: cắt $\mathbb{A}^4$ (dim 4) với 4 hypersurfaces $\Rightarrow \dim \geq 4 - 4 = 0$. Điều này đúng (đẳng thức).

---

## Dimension của Schemes Đặc Biệt

### Worked Example

> [!example] Example 9.16 — $\dim \operatorname{Spec} \mathbb{Z}[x_1,\ldots,x_n] = n+1$
> Chuỗi prime ideals tối đại:
>
> $$
> (0) \subsetneq (p) \subsetneq (p, x_1) \subsetneq \cdots \subsetneq (p, x_1, \ldots, x_n)
> $$
>
> có độ dài $n+1$. Đây là "arithmetic $n$-space".

> [!example] Example 9.17 — Dimension của $\mathbb{P}^n$
> Vì $\mathbb{P}^n_k$ được dán từ $(n+1)$ bản sao $\mathbb{A}^n_k$, và mỗi bản sao có dimension $n$:
>
> $$
> \dim \mathbb{P}^n_k = n.
> $$

---

## SageMath Cheatsheet

```python
# Dimension theory trong Sage

R = QQ['x', 'y', 'z']
x, y, z = R.gens()

# Krull dimension của polynomial ring
print(R.krull_dimension())  # 3

# Dimension của quotient ring (variety)
I = R.ideal(y^2 - x^3 + x)  # Affine curve
A = R.quotient(I)
print(A.krull_dimension())   # 2 (vì P = Q[x,y,z]/(f), dim = 3-1 = 2? No: dim = 2 as ring)
# Thực ra quotient của dim-3 ring bởi prime height-1 ideal có dim 2

# Dimension của giao cắt
I1 = R.ideal(x, y)    # Line V(x,y) in A^3
I2 = R.ideal(y, z)    # Line V(y,z) in A^3
I_int = I1 + I2       # Intersection
A_int = R.quotient(I_int)
print(A_int.krull_dimension())  # 1? (giao V(x,y,z) = origin)
# Actually I1+I2 = (x,y,z), so quotient has dim 0

# Height của prime ideal
p = R.ideal(x, y)  # Prime of height 2 in QQ[x,y,z]
print(p.height())   # 2

# Transcendence degree (qua function field)
K = FractionField(QQ['x1','x2','x3'])
# tr.deg = 3 = dim QQ[x1,x2,x3]

# Elliptic curve dimension
E = EllipticCurve(QQ, [0, -1, 0, 1, 0])
print(E.dimension())  # 1: it's a curve
```

---

## Summary / Key Takeaways

- **Krull dimension**: độ dài chuỗi prime ideals tối đại.
- $\dim \mathbb{A}^n_k = \dim \mathbb{P}^n_k = n$; $\dim \operatorname{Spec} \mathbb{Z} = 1$.
- **Dimension = transcendence degree** cho integral $k$-schemes of finite type.
- **Generic point**: mỗi irreducible closed subset $Z = \overline{\{\eta\}}$ — $\eta$ là đặc trưng toán học của $Z$.
- **Codimension**: $\operatorname{codim}(Z,X) = \operatorname{ht}(\mathfrak{p}_Z)$.
- **Hauptidealsatz**: $r$ equations giảm dimension nhiều nhất $r$.
- **Fiber dimension**: generic fiber của dominant morphism $X \to Y$ có $\dim = \dim X - \dim Y$.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 11–12.
- Hartshorne, R. *Algebraic Geometry*, Chapter I §1 & Appendix A.
- Atiyah, MacDonald. *Introduction to Commutative Algebra*, Chapter 11.
- Matsumura, H. *Commutative Ring Theory* (Cambridge), Chapters 5–6.
