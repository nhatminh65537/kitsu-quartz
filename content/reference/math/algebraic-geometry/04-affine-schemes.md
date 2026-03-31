---
title: "04. Affine Schemes: Spec & Structure Sheaf"
tags: [math, algebraic-geometry, lesson-04, schemes, spec]
aliases: [Affine Schemes]
created: 2026-03-31
---

> **Prerequisites**: [[02-sheaves-and-presheaves|02. Sheaves and Presheaves]]; [[03-affine-varieties-and-nullstellensatz|03. Affine Varieties & Nullstellensatz]]; Commutative algebra: localization, prime ideals.
> **Objectives**:
> - Định nghĩa $\operatorname{Spec} R$ như không gian topo
> - Xây dựng structure sheaf $\mathcal{O}_X$ và hiểu stalk của nó
> - Định nghĩa locally ringed space và affine scheme
> - Hiểu tại sao $\operatorname{Spec}$ mở rộng classical algebraic geometry

---

## Motivation / Intuition

Trong Lesson 03, ta thấy: affine varieties $\leftrightarrow$ reduced f.g. $k$-algebras. Nhưng algebraic geometry hiện đại cần làm việc với:
- **Vành không reduced**: $k[x]/(x^2)$ — "đường thẳng kép", nắm bắt thông tin infinitesimal.
- **Vành không phải f.g. $k$-algebra**: $\mathbb{Z}$, $\mathbb{Z}_{(p)}$, — nền tảng của arithmetic geometry.
- **Vành địa phương** (local rings) — mô hình hóa "gần" một điểm.

Giải pháp của Grothendieck: thay vì chỉ dùng maximal ideals (= điểm trên trường đại số đóng), dùng **tất cả prime ideals**. Đây là ý tưởng cách mạng của $\operatorname{Spec}$.

---

## Prime Spectrum

### Definition

> [!definition] Definition 4.1 — Spec (prime spectrum)
> Cho $R$ là commutative ring (với 1). **Prime spectrum** (phổ nguyên tố) của $R$ là tập:
>
> $$
> \operatorname{Spec} R := \{\mathfrak{p} \subseteq R \mid \mathfrak{p} \text{ là prime ideal}\}.
> $$
>
> Phần tử của $\operatorname{Spec} R$ gọi là **điểm** (point) của scheme.

> [!note] Remark 4.2 — Điểm generic và điểm closed
> Trong $\operatorname{Spec} R$:
> - **Điểm closed**: prime ideal $\mathfrak{p}$ là maximal. Trên $k$-variety, maximal ideals tương ứng với điểm hình học (geometric points).
> - **Điểm generic** (điểm tổng quát): prime ideal $(0)$ trong domain $R$. "Nó nằm ở khắp nơi" — closure của nó là toàn bộ $\operatorname{Spec} R$.
>
> Ví dụ: $\operatorname{Spec} \mathbb{Z}$ có điểm closed là $(p)$ (với $p$ nguyên tố) và điểm generic $(0)$.

### Worked Example

> [!example] Example 4.3 — Spec của các vành cơ bản
>
> **$\operatorname{Spec} k$ (trường)**: Chỉ một điểm $(0)$ (maximal và prime duy nhất).
>
> **$\operatorname{Spec} k[x]$** ($k$ đại số đóng): prime ideals là $(0)$ (generic point) và $(x - a)$ với $a \in k$ (closed points). Tương tự $\mathbb{A}^1_k$ nhưng có thêm generic point.
>
> **$\operatorname{Spec} \mathbb{Z}$**: prime ideals $(0)$ và $(p)$ với $p$ nguyên tố. "Đường thẳng số học".
>
> **$\operatorname{Spec} k[x]/(x^2)$**: Một prime ideal duy nhất $(x)$ (vì $k[x]/(x^2)$ là local ring với maximal ideal $(x)/(x^2)$). Đây là "double point" hay "fat point" — một điểm với nilpotent information.
>
> **$\operatorname{Spec} k[x,y]/(xy)$**: prime ideals là $(x)$, $(y)$, và $(x-a, y-b)$ với $a = 0$ hoặc $b = 0$. Tương ứng với hợp hai trục trong $\mathbb{A}^2$.

---

## Zariski Topology trên Spec

### Definition

> [!definition] Definition 4.4 — Zariski Topology trên $\operatorname{Spec} R$
> Với ideal $I \subseteq R$, định nghĩa:
>
> $$
> V(I) := \{\mathfrak{p} \in \operatorname{Spec} R \mid I \subseteq \mathfrak{p}\}.
> $$
>
> Họ $\{V(I)\}$ thỏa tiên đề closed sets, xác định **Zariski topology** trên $\operatorname{Spec} R$.
>
> Tập mở cơ bản (basic open set) tương ứng với $f \in R$:
>
> $$
> D(f) := \operatorname{Spec} R \setminus V(f) = \{\mathfrak{p} \mid f \notin \mathfrak{p}\} = \operatorname{Spec} R_f,
> $$
>
> trong đó $R_f := R[1/f]$ là localization tại $f$.

> [!theorem] Theorem 4.5
> Các $D(f)$ tạo thành một **cơ sở** (basis) cho Zariski topology trên $\operatorname{Spec} R$.

---

## Structure Sheaf

### Definition

> [!definition] Definition 4.6 — Structure Sheaf $\mathcal{O}_{\operatorname{Spec} R}$
> Trên $X = \operatorname{Spec} R$, định nghĩa presheaf bằng cách gán cho $D(f)$:
>
> $$
> \mathcal{O}_X(D(f)) := R_f = R\left[\frac{1}{f}\right].
> $$
>
> Trên open tổng quát $U = \bigcup_i D(f_i)$, ta có:
>
> $$
> \mathcal{O}_X(U) := \left\{ s \in \prod_i R_{f_i} \;\Bigg|\; s_i|_{D(f_if_j)} = s_j|_{D(f_if_j)} \,\forall i,j \right\}.
> $$
>
> Điều này định nghĩa $\mathcal{O}_X$ như một sheaf trên $X$.

> [!theorem] Theorem 4.7 — Global sections và Stalk
>
> 1. **Global sections**: $\mathcal{O}_X(X) = R$.
>
> 2. **Stalk tại $\mathfrak{p}$**: $\mathcal{O}_{X,\mathfrak{p}} = R_{\mathfrak{p}} = \left\{\frac{a}{s} \mid a \in R, s \notin \mathfrak{p}\right\}$ là localization tại prime $\mathfrak{p}$.
>
> Đây là **local ring** với maximal ideal $\mathfrak{p} R_{\mathfrak{p}}$ và residue field $k(\mathfrak{p}) := R_{\mathfrak{p}}/\mathfrak{p} R_{\mathfrak{p}}$.

**Proof sketch của (1).**
Ta cần $\mathcal{O}_X(X) = R$. Vì $X = D(1)$, ta có $\mathcal{O}_X(X) \supseteq R_1 = R$. Chiều ngược: một global section $s$ là họ $(s_f \in R_f)$ tương thích. Điều này có nghĩa $s$ xác định một phần tử trong $\varprojlim R_f = R$ (theo Zariski's lemma: elements globally defined are polynomials). Xem [[a2-fundamental-theorem-affine-schemes|A2]] để biết chi tiết. $\blacksquare$

### Worked Example

> [!example] Example 4.8 — Structure sheaf của $\mathbb{A}^1$
>
> Lấy $R = k[x]$, $X = \operatorname{Spec} k[x] = \mathbb{A}^1_k$.
>
> - $\mathcal{O}_X(X) = k[x]$: polynomials.
> - $\mathcal{O}_X(D(f)) = k[x][1/f] = k[x, 1/f]$: polynomials với mẫu lũy thừa $f$.
> - Stalk tại maximal ideal $(x - a)$: $\mathcal{O}_{X,(x-a)} = k[x]_{(x-a)} = \left\{\frac{g}{h} \mid h(a) \neq 0\right\}$ — rational functions defined at $a$.
> - Stalk tại generic point $(0)$: $k[x]_{(0)} = k(x)$ — field of rational functions.

> [!example] Example 4.9 — Spec Z: arithmetic geometry
>
> $X = \operatorname{Spec} \mathbb{Z}$, stalk tại $(p)$: $\mathbb{Z}_{(p)} = \{a/b \mid p \nmid b\}$, local ring.
> Stalk tại $(0)$: $\mathbb{Q}$, field. Residue field tại $(p)$: $\mathbb{F}_p$.
>
> "Đường thẳng số học" $\operatorname{Spec} \mathbb{Z}$ có một điểm cho mỗi nguyên tố $p$ và một điểm generic. Đây là điểm xuất phát của arithmetic geometry.

---

## Locally Ringed Space và Affine Scheme

### Definition

> [!definition] Definition 4.10 — Ringed Space và Locally Ringed Space
> Một **ringed space** là cặp $(X, \mathcal{O}_X)$ gồm không gian topo $X$ và sheaf rings $\mathcal{O}_X$ trên $X$.
>
> Một **locally ringed space** là ringed space $(X, \mathcal{O}_X)$ sao cho mọi stalk $\mathcal{O}_{X,x}$ là **local ring** (có maximal ideal duy nhất, ký hiệu $\mathfrak{m}_x$).

> [!definition] Definition 4.11 — Affine Scheme
> Một **affine scheme** là locally ringed space $(X, \mathcal{O}_X)$ isomorphic với $(\operatorname{Spec} R, \mathcal{O}_{\operatorname{Spec} R})$ cho một vành $R$ nào đó.
>
> **Morphism** của affine schemes (hay của locally ringed spaces) là cặp $(f, f^\#)$, trong đó $f : X \to Y$ là ánh xạ liên tục và $f^\# : \mathcal{O}_Y \to f_*\mathcal{O}_X$ là morphism sheaves, sao cho với mọi $x \in X$, map cảm sinh trên stalks
>
> $$
> f^\#_x : \mathcal{O}_{Y,f(x)} \to \mathcal{O}_{X,x}
> $$
>
> là **local ring map**: $f^\#_x(\mathfrak{m}_{f(x)}) \subseteq \mathfrak{m}_x$.

> [!theorem] Theorem 4.12 — Anti-equivalence tổng quát
> Functor $\operatorname{Spec} : \mathbf{CRing}^{op} \to \mathbf{AffSch}$ là **equivalence of categories**:
>
> $$
> \operatorname{Hom}_{\mathbf{AffSch}}(\operatorname{Spec} A, \operatorname{Spec} B) \cong \operatorname{Hom}_{\mathbf{CRing}}(B, A).
> $$

**Proof.**
Morphism $\phi : B \to A$ cảm sinh $f = \operatorname{Spec}\phi : \operatorname{Spec} A \to \operatorname{Spec} B$ bởi $f(\mathfrak{p}) = \phi^{-1}(\mathfrak{p})$ (preimage của prime là prime). Map $f^\#$ được xây dựng tự nhiên qua localization. Chiều ngược lại, từ morphism $(f, f^\#)$ ta thu $f^\# : B = \mathcal{O}_Y(Y) \to f_*\mathcal{O}_X(Y) = \mathcal{O}_X(X) = A$. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Spec và localization trong Sage
R = ZZ['x']        # Z[x]
x = R.gen()

# Localization tại prime ideal (p) -> stalks of Spec Z[x]
# Localization tại (2)
S = R.localization(2)         # Z[x] localized away from 2
print(S)

# Spec của vành số nguyên
# Điểm (prime ideals) của Z
for p in prime_range(20):
    print(f"Prime ideal ({p}), residue field: F_{p}")

# Polynomial ring và variety
R2 = QQ['x', 'y']
x, y = R2.gens()
I = R2.ideal(y^2 - x^3 + x)   # Elliptic curve y^2 = x^3 - x
print(I.is_prime())              # True: irreducible variety

# Coordinate ring (affine ring)
A = R2.quotient(I)
print(A.is_integral_domain())    # True

# Localization tại một điểm (stalk)
# Tại điểm (x, y) = (0, 0), maximal ideal m = (x, y)
m = R2.ideal(x, y)
# Stalk = R2 localized at m
Rm = R2.localization(m)
print(Rm)
```

---

## Summary / Key Takeaways

- $\operatorname{Spec} R$ = tập prime ideals của $R$, với Zariski topology.
- **Basic open sets** $D(f) \cong \operatorname{Spec} R_f$: nền tảng của mọi tính toán local.
- **Structure sheaf** $\mathcal{O}_X$: $\mathcal{O}_X(D(f)) = R_f$, stalk tại $\mathfrak{p}$ là local ring $R_\mathfrak{p}$.
- **Global sections**: $\mathcal{O}_X(X) = R$ — điều này là fundamental theorem of affine schemes.
- **Locally ringed space**: ringed space với stalks là local rings — đúng điều kiện để morphisms có nghĩa.
- **Anti-equivalence**: $\mathbf{CRing}^{op} \simeq \mathbf{AffSch}$ — algebra $\leftrightarrow$ geometry.
- Generic points, non-reduced schemes, arithmetic rings đều được xử lý thống nhất trong framework này.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 3–4.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §1–2.
- Mumford, D. *The Red Book of Varieties and Schemes* (LNM 1358).
- Eisenbud & Harris. *The Geometry of Schemes* (GTM 197).
