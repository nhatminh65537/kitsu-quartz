---
title: "02. Sheaves and Presheaves"
tags: [math, algebraic-geometry, lesson-02, sheaves]
aliases: [Sheaves and Presheaves]
created: 2026-03-31
---

> **Prerequisites**: [[01-category-theory-and-functors|01. Category Theory & Functors]]; topo học cơ bản (open sets, continuous maps).
> **Objectives**:
> - Định nghĩa presheaf và sheaf trên không gian topo
> - Hiểu stalk, germ, và quá trình sheafification
> - Phân tích morphism của sheaves và kiểm tra điều kiện sheaf
> - Nhận ra vì sao sheaves là công cụ tự nhiên để theo dõi dữ liệu local/global

---

## Motivation / Intuition

Cho không gian topo $X$ (ví dụ: một mặt phẳng phức, hay một algebraic variety). Tại mỗi open set $U \subseteq X$ ta có thể xét các hàm liên tục $\mathcal{C}(U) := \{f : U \to \mathbb{R} \mid f \text{ liên tục}\}$. Tập hợp này thay đổi theo $U$ và thỏa hai tính chất quan trọng:

1. **Locality**: Nếu $f|_U = 0$ trên mọi $U$ trong một covering của $V$, thì $f = 0$ trên $V$.
2. **Gluing**: Nếu trên mỗi $U_i$ ta có $f_i$ và chúng đồng ý trên các giao $U_i \cap U_j$, thì tồn tại $f$ trên $\bigcup U_i$ restrict về $f_i$.

Một **sheaf** chính xác là cấu trúc nắm bắt hai tính chất này. Nó là công cụ cho phép ta chuyển đổi giữa thông tin local và global một cách chặt chẽ.

---

## Presheaf

### Definition

> [!definition] Definition 2.1 — Presheaf (tiền bó)
> Cho $X$ là không gian topo. Một **presheaf** (tiền bó) của abelian groups trên $X$ là một contravariant functor
>
> $$
> \mathcal{F} : \mathbf{Open}(X)^{op} \to \mathbf{Ab},
> $$
>
> trong đó $\mathbf{Open}(X)$ là category có objects là các open sets của $X$ và morphisms là các phép inclusion $V \hookrightarrow U$ ($V \subseteq U$).
>
> Cụ thể: với mỗi open $U$, có abelian group $\mathcal{F}(U)$ (gọi là **sections** trên $U$); với mỗi inclusion $V \subseteq U$, có **restriction map** $\rho_{UV} : \mathcal{F}(U) \to \mathcal{F}(V)$, thỏa:
>
> 1. $\rho_{UU} = \operatorname{id}$,
> 2. $\rho_{VW} \circ \rho_{UV} = \rho_{UW}$ với mọi $W \subseteq V \subseteq U$.
>
> Ta thường viết $s|_V := \rho_{UV}(s)$ cho $s \in \mathcal{F}(U)$. Phần tử của $\mathcal{F}(U)$ gọi là **section** trên $U$. Phần tử của $\mathcal{F}(X)$ gọi là **global section**.

---

## Sheaf

### Definition

> [!definition] Definition 2.2 — Sheaf (bó)
> Một presheaf $\mathcal{F}$ trên $X$ là một **sheaf** nếu với mọi open $U$ và mọi open cover $U = \bigcup_{i \in I} U_i$, dãy sau là **exact**:
>
> $$
> 0 \to \mathcal{F}(U) \xrightarrow{e} \prod_{i} \mathcal{F}(U_i) \xrightarrow{r} \prod_{i,j} \mathcal{F}(U_i \cap U_j)
> $$
>
> trong đó $e(s) = (s|_{U_i})_i$ và $r((s_i)_i) = (s_i|_{U_i \cap U_j} - s_j|_{U_i \cap U_j})_{i,j}$.
>
> Tương đương, $\mathcal{F}$ là sheaf khi thỏa hai điều kiện:
>
> **(S1) Identity/Locality**: Nếu $s, t \in \mathcal{F}(U)$ và $s|_{U_i} = t|_{U_i}$ với mọi $i$, thì $s = t$.
>
> **(S2) Gluing**: Nếu $(s_i)_i$ với $s_i \in \mathcal{F}(U_i)$ thỏa $s_i|_{U_i \cap U_j} = s_j|_{U_i \cap U_j}$ với mọi $i,j$, thì tồn tại $s \in \mathcal{F}(U)$ với $s|_{U_i} = s_i$.

### Worked Example

> [!example] Example 2.3 — Các sheaf cơ bản
>
> **Sheaf hàm liên tục**: $\mathcal{C}_X(U) := \{f : U \to \mathbb{R} \mid f \text{ liên tục}\}$. Đây là sheaf của $\mathbb{R}$-algebras.
>
> **Sheaf hàm chỉnh hình**: Trên $X = \mathbb{C}^n$, $\mathcal{O}_X(U) := \{f : U \to \mathbb{C} \mid f \text{ holomorphic}\}$.
>
> **Constant sheaf**: $\underline{A}(U) := \{f : U \to A \mid f \text{ locally constant}\}$ cho $A$ là abelian group. Đây là sheaf (với $A$ discrete topology).
>
> **Skyscraper sheaf**: Cho $x \in X$ và $A$ là abelian group. Định nghĩa $i_{x,*}A(U) := A$ nếu $x \in U$, $0$ nếu $x \notin U$. Đây là sheaf.

> [!warning] Counterexample 2.4 — Presheaf không phải sheaf
> Định nghĩa $\mathcal{F}(U) := \{f : U \to \mathbb{R} \mid f \text{ liên tục, bị chặn}\}$ trên $X = \mathbb{R}$.
>
> Đây **không** phải sheaf: lấy $U_n = (-n, n)$ và $f_n = \operatorname{id}$ trên $U_n$. Chúng glue thành $f(x) = x$ trên $\mathbb{R}$, nhưng $f$ không bị chặn, nên $f \notin \mathcal{F}(\mathbb{R})$.

---

## Stalk và Germ

### Definition

> [!definition] Definition 2.5 — Stalk (thớ) và Germ (mầm)
> Cho $\mathcal{F}$ là presheaf trên $X$ và $x \in X$. **Stalk** của $\mathcal{F}$ tại $x$ là colimit
>
> $$
> \mathcal{F}_x := \varinjlim_{U \ni x} \mathcal{F}(U),
> $$
>
> lấy colimit trên hệ thống các open neighborhoods của $x$ (directed theo phép bao hàm ngược).
>
> Phần tử của $\mathcal{F}_x$ gọi là **germ** tại $x$. Germ của $s \in \mathcal{F}(U)$ tại $x$ ký hiệu là $s_x \in \mathcal{F}_x$.

> [!theorem] Theorem 2.6 — Sheaf xác định bởi stalks
> Một morphism $\phi : \mathcal{F} \to \mathcal{G}$ của sheaves là isomorphism khi và chỉ khi mọi map trên stalks $\phi_x : \mathcal{F}_x \to \mathcal{G}_x$ đều là isomorphism.

**Proof.**
($\Rightarrow$) Hiển nhiên.
($\Leftarrow$) Giả sử mọi $\phi_x$ là iso. Ta cần chứng minh $\phi_U : \mathcal{F}(U) \to \mathcal{G}(U)$ là bijection với mọi $U$.

*Injective*: Nếu $s \in \mathcal{F}(U)$ với $\phi_U(s) = 0$, thì với mọi $x \in U$, germ $\phi_x(s_x) = (\phi_U(s))_x = 0$. Do $\phi_x$ injective, $s_x = 0$. Nhưng $s = 0$ trên mỗi stalk nên $s = 0$ theo (S1).

*Surjective*: Tương tự, dùng điều kiện gluing (S2). $\blacksquare$

### Worked Example

> [!example] Example 2.7 — Stalk của sheaf hàm chỉnh hình
> Trên $X = \mathbb{C}$, stalk của $\mathcal{O}_X$ tại $z_0$ là:
>
> $$
> \mathcal{O}_{X,z_0} = \left\{ \sum_{n=0}^{\infty} a_n (z - z_0)^n \;\Bigg|\; \text{chuỗi hội tụ trong lân cận nào đó của } z_0 \right\}
> $$
>
> Đây là vành địa phương (local ring) với maximal ideal là hàm triệt tiêu tại $z_0$. Cấu trúc này sẽ là mô hình cho $\mathcal{O}_{X,x}$ trong algebraic geometry.

---

## Morphism của Sheaves

### Definition

> [!definition] Definition 2.8 — Morphism of Sheaves
> Cho $\mathcal{F}, \mathcal{G}$ là hai sheaves trên $X$. Một **morphism** $\phi : \mathcal{F} \to \mathcal{G}$ là natural transformation: họ group homomorphisms $\phi_U : \mathcal{F}(U) \to \mathcal{G}(U)$ (với mọi open $U$) commute với restriction maps.
>
> **Kernel**: $(\ker \phi)(U) := \ker(\phi_U : \mathcal{F}(U) \to \mathcal{G}(U))$ — đây là sheaf.
>
> **Image**: presheaf $(\operatorname{im}^{pre}\phi)(U) := \operatorname{im}(\phi_U)$ nói chung **không** là sheaf — ta phải sheafify.

---

## Sheafification

### Theorem

> [!theorem] Theorem 2.9 — Sheafification (Bó hóa)
> Cho $\mathcal{F}^{pre}$ là presheaf trên $X$. Tồn tại sheaf $\mathcal{F}$ và morphism $\theta : \mathcal{F}^{pre} \to \mathcal{F}$ thỏa **tính phổ quát**: với mọi sheaf $\mathcal{G}$ và morphism $\phi : \mathcal{F}^{pre} \to \mathcal{G}$, tồn tại duy nhất $\tilde{\phi} : \mathcal{F} \to \mathcal{G}$ sao cho $\tilde{\phi} \circ \theta = \phi$.
>
> $$
> \mathcal{F}(U) = \left\{ (s_x)_{x \in U} \in \prod_{x \in U} \mathcal{F}^{pre}_x \;\Bigg|\; \forall x \in U, \exists V \ni x, \exists t \in \mathcal{F}^{pre}(V): t_y = s_y \,\forall y \in V \right\}
> $$

> [!note] Remark 2.10
> Sheafification bảo toàn stalks: $\mathcal{F}_x \cong \mathcal{F}^{pre}_x$ với mọi $x$. Do đó nếu presheaf đã có đúng stalks thì sheafification chỉ "sửa" điều kiện gluing.

### Worked Example

> [!example] Example 2.11 — Sheafification của constant presheaf
> Định nghĩa $\underline{A}^{pre}(U) := A$ với mọi $U$ mở (restriction maps là identity). Đây là presheaf nhưng không phải sheaf nếu $X$ không connected (vì điều kiện identity (S1) thất bại cho $U = U_1 \sqcup U_2$ rời nhau).
>
> Sheafification cho $\underline{A}(U) = \{f : U \to A \mid f \text{ locally constant}\}$ — đây là constant sheaf đúng nghĩa.

---

## Direct Image và Inverse Image

### Definition

> [!definition] Definition 2.12 — Direct Image (ảnh xuôi)
> Cho $f : X \to Y$ liên tục và $\mathcal{F}$ sheaf trên $X$. **Direct image** (hay pushforward) là sheaf trên $Y$:
>
> $$
> (f_* \mathcal{F})(V) := \mathcal{F}(f^{-1}(V)) \quad \text{với mọi open } V \subseteq Y.
> $$

> [!definition] Definition 2.13 — Inverse Image (ảnh ngược)
> Cho $f : X \to Y$ và $\mathcal{G}$ sheaf trên $Y$. **Inverse image** $f^{-1}\mathcal{G}$ là sheafification của presheaf
>
> $$
> U \mapsto \varinjlim_{V \supseteq f(U)} \mathcal{G}(V).
> $$
>
> Có adjunction tự nhiên: $\operatorname{Hom}(f^{-1}\mathcal{G}, \mathcal{F}) \cong \operatorname{Hom}(\mathcal{G}, f_*\mathcal{F})$.

---

## SageMath Cheatsheet

```python
# Sage hỗ trợ sheaf cohomology qua toric geometry và schemes
# Ví dụ: sheaf trên projective space P^1

# Tạo P^1 trên Q
P1 = ProjectiveSpace(1, QQ)

# Sheaf cấu trúc O_{P^1}
# Trong Sage, ta làm việc với coherent sheaves qua divisors
# Xem thêm: sage.schemes.projective

# Ví dụ concrete: stalk tại một điểm = localization
R = QQ['x']
f = R(x^2 - 1)
# Stalk tại p = (x-1) là localization R_{(x-1)}
p = R.ideal(R('x - 1'))
S = R.localization(p)  # Local ring at prime p
print(S)

# Kiểm tra locality: sections over cover
# Nếu f|_{U1} = g|_{U1} và f|_{U2} = g|_{U2} thì f = g trên U1 cup U2
# Minh họa bằng polynomials trên affine pieces
```

---

## Summary / Key Takeaways

- **Presheaf**: contravariant functor $\mathbf{Open}(X)^{op} \to \mathbf{Ab}$, gán mỗi open set một abelian group có restriction maps.
- **Sheaf**: presheaf thỏa (S1) identity (sections local) và (S2) gluing (sections patch).
- **Stalk** $\mathcal{F}_x = \varinjlim_{U \ni x} \mathcal{F}(U)$ nắm bắt thông tin "germ" tại điểm.
- **Sheaf determined by stalks**: $\phi$ iso $\iff$ mọi $\phi_x$ iso.
- **Sheafification**: functor adjoint trái cho forgetful functor từ sheaves sang presheaves.
- **Direct/inverse image**: $f_*$ và $f^{-1}$ tạo thành một adjoint pair.
- Trong Lesson 04, structure sheaf $\mathcal{O}_X$ của một affine scheme chính xác là một sheaf theo nghĩa này.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapter 2.
- Hartshorne, R. *Algebraic Geometry* (GTM 52), Chapter II §1.
- Serre, J.-P. *Faisceaux Algébriques Cohérents* (FAC), 1955.
- Godement, R. *Topologie Algébrique et Théorie des Faisceaux*.
