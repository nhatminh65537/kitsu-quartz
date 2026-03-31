---
title: "05. Schemes & Gluing"
tags: [math, algebraic-geometry, lesson-05, schemes]
aliases: [Schemes and Gluing]
created: 2026-03-31
---

> **Prerequisites**: [[04-affine-schemes|04. Affine Schemes: Spec & Structure Sheaf]]
> **Objectives**:
> - Định nghĩa scheme bằng cách glue các affine schemes
> - Xây dựng $\mathbb{A}^n$ và $\mathbb{P}^n$ như schemes
> - Hiểu tại sao projective space không phải affine
> - Nhận biết các ví dụ scheme cơ bản: curve, surface, arithmetic scheme

---

## Motivation / Intuition

Affine schemes là "building blocks" — nhưng nhiều không gian quan trọng không phải affine. Ví dụ: $\mathbb{P}^1$ (đường thẳng xạ ảnh) được dán từ hai bản sao của $\mathbb{A}^1$ với các phép chuyển tọa độ. Định nghĩa scheme tổng quát chính xác hóa quá trình "dán" (gluing) này, tương tự như manifold được dán từ các open sets của $\mathbb{R}^n$.

---

## Definition của Scheme

### Definition

> [!definition] Definition 5.1 — Scheme (lược đồ)
> Một **scheme** là locally ringed space $(X, \mathcal{O}_X)$ sao cho mọi điểm $x \in X$ có open neighborhood $U \ni x$ với $(U, \mathcal{O}_X|_U)$ isomorphic với một affine scheme $(\operatorname{Spec} R, \mathcal{O}_{\operatorname{Spec} R})$ nào đó.
>
> Một **morphism of schemes** là morphism của locally ringed spaces.

> [!note] Remark 5.2
> Tương tự: manifold là locally Euclidean, scheme là locally affine. "Affine" đóng vai trò của $\mathbb{R}^n$.

---

## Gluing Construction

### Theorem

> [!theorem] Theorem 5.3 — Gluing Lemma for Schemes
> Cho $\{X_i\}_{i \in I}$ là một họ schemes, và với mỗi cặp $i \neq j$, cho open subscheme $X_{ij} \subseteq X_i$ và isomorphism $\phi_{ij} : X_{ij} \xrightarrow{\sim} X_{ji}$. Giả sử:
>
> 1. (Đối xứng) $\phi_{ji} = \phi_{ij}^{-1}$.
> 2. (Cocycle) $\phi_{ij}(X_{ij} \cap X_{ik}) = X_{ji} \cap X_{jk}$ và $\phi_{ik} = \phi_{jk} \circ \phi_{ij}$ trên $X_{ij} \cap X_{ik}$.
>
> Khi đó tồn tại scheme $X$ (duy nhất đến isomorphism) với open subschemes $\psi_i : X_i \hookrightarrow X$ sao cho $X = \bigcup_i \psi_i(X_i)$ và $\psi_i = \psi_j \circ \phi_{ij}$ trên $X_{ij}$.

### Worked Example

> [!example] Example 5.4 — Affine Line $\mathbb{A}^1_k$
> $\mathbb{A}^1_k = \operatorname{Spec} k[x]$. Đây là affine scheme — không cần gluing. Nhưng ta có thể hiểu nó là gluing theo cách khác để chuẩn bị cho $\mathbb{P}^1$.

> [!example] Example 5.5 — Projective Line $\mathbb{P}^1_k$
> Dán $U_0 = \operatorname{Spec} k[t]$ và $U_1 = \operatorname{Spec} k[s]$ qua:
>
> $$
> U_{01} = \operatorname{Spec} k[t, t^{-1}] \subseteq U_0, \quad U_{10} = \operatorname{Spec} k[s, s^{-1}] \subseteq U_1,
> $$
>
> $$
> \phi_{01} : U_{01} \xrightarrow{\sim} U_{10}, \quad t \mapsto s^{-1} \quad (\text{i.e., } s = 1/t).
> $$
>
> Kết quả $X = \mathbb{P}^1_k$ là **projective line**. Mỗi điểm là một đường qua gốc tọa độ trong $\mathbb{A}^2$, tức một lớp $[a:b]$ với $(a,b) \neq (0,0)$.
>
> $U_0 \cong \mathbb{A}^1_k$ ứng với $[a:1]$ (điểm hữu hạn, tọa độ $t = a$), $U_1 \cong \mathbb{A}^1_k$ ứng với $[1:b]$. Điểm vô cực $[1:0]$ nằm trong $U_1$ nhưng không trong $U_0$.

> [!warning] Counterexample 5.6 — "Line với điểm đôi" không phải affine
> Dán hai bản sao $U_0 = U_1 = \mathbb{A}^1_k = \operatorname{Spec} k[t]$ qua $\phi : D(t) \to D(t)$, $t \mapsto t$ (isomorphism trên $\mathbb{A}^1 \setminus \{0\}$).
>
> Kết quả $X$ là "line với điểm gốc được nhân đôi" (two origins). Đây là scheme nhưng **không** phải affine và không separated (xem Lesson 07).

---

## Projective Space

### Definition

> [!definition] Definition 5.7 — Projective $n$-space $\mathbb{P}^n_k$
> **Projective $n$-space** $\mathbb{P}^n_k$ là scheme được dán từ $(n+1)$ bản sao affine:
>
> $$
> U_i := \operatorname{Spec} k\!\left[\frac{x_0}{x_i}, \ldots, \widehat{\frac{x_i}{x_i}}, \ldots, \frac{x_n}{x_i}\right] \cong \mathbb{A}^n_k, \quad i = 0, 1, \ldots, n,
> $$
>
> gluing qua phép chuyển tọa độ $\frac{x_j/x_i}{x_k/x_i} = \frac{x_j}{x_k}$ trên $U_i \cap U_k = D(x_i x_k / x_i^2)$.
>
> Điểm của $\mathbb{P}^n_k$ (over $k$ algebraically closed) tương ứng với các lớp tương đương $[a_0: \cdots : a_n]$ với $(a_0,\ldots,a_n) \in k^{n+1} \setminus \{0\}$ và $(a_0,\ldots,a_n) \sim \lambda(a_0,\ldots,a_n)$ với $\lambda \in k^*$.

> [!theorem] Theorem 5.8 — $\mathbb{P}^n$ không phải affine
> $\mathbb{P}^n_k$ **không** isomorphic với $\operatorname{Spec} R$ cho bất kỳ vành $R$ nào, khi $n \geq 1$.

**Proof.**
$\mathcal{O}(\mathbb{P}^n_k) = k$ (các global regular functions trên $\mathbb{P}^n$ là hằng số). Nếu $\mathbb{P}^n \cong \operatorname{Spec} R$, thì $R = \mathcal{O}(\mathbb{P}^n) = k$, nhưng $\operatorname{Spec} k$ chỉ có một điểm, mâu thuẫn với $\mathbb{P}^n$ có nhiều điểm. $\blacksquare$

---

## Projective Varieties

### Definition

> [!definition] Definition 5.9 — Projective Variety
> Cho $S = k[x_0,\ldots,x_n]$ là polynomial ring graded bởi degree. Với homogeneous ideal $I \subseteq S$, định nghĩa:
>
> $$
> \operatorname{Proj} S/I \subseteq \mathbb{P}^n_k
> $$
>
> là **projective variety** (variety xạ ảnh) — tập nghiệm chung của các đa thức thuần nhất trong $I$.
>
> Tổng quát hơn, $\operatorname{Proj}$ là functor: với graded ring $S = \bigoplus_{d \geq 0} S_d$, $\operatorname{Proj} S$ là scheme với open cover $D_+(f) \cong \operatorname{Spec} S_{(f)}$ với $f \in S$ homogeneous và $S_{(f)}$ là degree-0 part của $S_f$.

### Worked Example

> [!example] Example 5.10 — Đường cong bậc hai trong $\mathbb{P}^2$
> Xét $C = V(x^2 + y^2 - z^2) \subseteq \mathbb{P}^2_{\mathbb{C}}$.
>
> Trên chart $U_2 = \{z \neq 0\}$: đặt $X = x/z$, $Y = y/z$, ta được $X^2 + Y^2 = 1$ — đường tròn đơn vị trong $\mathbb{A}^2$.
>
> Trên chart $U_0 = \{x \neq 0\}$: đặt $Y' = y/x$, $Z' = z/x$, ta được $(Y')^2 = (Z')^2 - 1$.
>
> $C$ là smooth curve của genus 0 (vì có parameterization rational), isomorphic với $\mathbb{P}^1$.

---

## Các Examples Quan Trọng

### Worked Example

> [!example] Example 5.11 — Spectrum của vành số nguyên: $\operatorname{Spec} \mathbb{Z}$
> $\operatorname{Spec} \mathbb{Z}$ là "đường thẳng số học". Nó không phải $k$-scheme nhưng là $\mathbb{Z}$-scheme. Mọi scheme đều có morphism duy nhất về $\operatorname{Spec} \mathbb{Z}$ — đây là **terminal object** trong category of schemes.

> [!example] Example 5.12 — Fiber product và base change
> Cho $X = \operatorname{Spec} A$ và $Y = \operatorname{Spec} B$ đều là $S = \operatorname{Spec} R$-schemes. Fiber product:
>
> $$
> X \times_S Y = \operatorname{Spec}(A \otimes_R B).
> $$
>
> Ví dụ: base change từ $\mathbb{Z}$ về $\mathbb{F}_p$: nếu $X = \operatorname{Spec} \mathbb{Z}[x,y]/(y^2 - x^3 - x)$ (elliptic curve over $\mathbb{Z}$), thì $X \times_{\operatorname{Spec}\mathbb{Z}} \operatorname{Spec} \mathbb{F}_p = \operatorname{Spec} \mathbb{F}_p[x,y]/(y^2 - x^3 - x)$.

---

## SageMath Cheatsheet

```python
# Projective Space và projective varieties trong Sage

# Projective space P^2 over Q
P2 = ProjectiveSpace(2, QQ)
print(P2)  # Projective Space of dimension 2 over Rational Field

# Projective variety: conic
R = P2.coordinate_ring()
x, y, z = R.gens()
C = P2.subscheme(x^2 + y^2 - z^2)
print(C)   # Closed subscheme of Projective Space

# Rational points
print(C.rational_points())  # Rational points (hữu hạn nếu QQ)

# Affine chart
U2 = C.affine_patch(2)    # Chart where z != 0
print(U2)  # Affine scheme: x^2 + y^2 - 1

# Proj construction cho graded ring
S = QQ['x0, x1, x2']
P = ProjectiveSpace(S)   # P^2

# Elliptic curve như projective curve
E = EllipticCurve(QQ, [0, -1, 0, 1, 0])  # y^2 = x^3 - x
print(E)
print(E.rational_points(bound=10))
```

---

## Summary / Key Takeaways

- **Scheme** = locally ringed space locally isomorphic với affine schemes — tương tự manifold locally isomorphic với $\mathbb{R}^n$.
- **Gluing**: schemes được xây dựng bằng cách dán các affine schemes lại theo dữ liệu transition.
- **$\mathbb{P}^n$**: dán $(n+1)$ bản affine $\mathbb{A}^n$; không phải affine vì global functions chỉ là hằng số.
- **$\operatorname{Proj} S$**: scheme xạ ảnh từ graded ring $S$ — tổng quát hóa projective varieties.
- **$\operatorname{Spec} \mathbb{Z}$**: terminal object, mọi scheme là $\mathbb{Z}$-scheme.
- **Fiber product**: $\operatorname{Spec} A \times_{\operatorname{Spec} R} \operatorname{Spec} B = \operatorname{Spec}(A \otimes_R B)$.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 4–5.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §2–3.
- Eisenbud & Harris. *The Geometry of Schemes*, Chapter II.
