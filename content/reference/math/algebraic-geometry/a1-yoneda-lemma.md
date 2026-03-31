---
title: "A1. Proof of Yoneda Lemma"
tags: [math, algebraic-geometry, appendix, category-theory, yoneda]
aliases: [Proof of Yoneda Lemma]
created: 2026-03-31
---

> **Liên quan**: [[01-category-theory-and-functors|01. Category Theory & Functors]]
> **Mục đích**: Chứng minh đầy đủ Yoneda Lemma, Yoneda Embedding, và các hệ quả trong algebraic geometry.

---

## Bối cảnh

Yoneda Lemma là một trong những kết quả nền tảng nhất của lý thuyết category — và do đó của algebraic geometry hiện đại. Nó nói rằng một đối tượng được xác định hoàn toàn bởi "điều nó thấy" qua các morphisms đến các đối tượng khác.

---

## Phát biểu đầy đủ

> [!theorem] Theorem A1.1 — Yoneda Lemma (Full Statement)
> Cho $\mathcal{C}$ là category (locally small), $F : \mathcal{C} \to \mathbf{Set}$ là functor, và $X \in \mathcal{C}$. Khi đó có **bijection tự nhiên** (natural in cả $X$ và $F$):
>
> $$
> \Phi_{X,F} : \operatorname{Nat}(\operatorname{Hom}_{\mathcal{C}}(X,-),\, F) \;\xrightarrow{\;\sim\;}\; F(X)
> $$
>
> $$
> \Phi_{X,F}(\eta) := \eta_X(\operatorname{id}_X).
> $$
>
> Nghịch đảo của $\Phi_{X,F}$ là:
>
> $$
> \Psi_{X,F}(a)_Y(f) := F(f)(a) \quad \text{với } a \in F(X), \; f : X \to Y.
> $$

---

## Chứng minh

**Bước 1: $\Phi$ well-defined.**
Với $\eta \in \operatorname{Nat}(\operatorname{Hom}(X,-), F)$, component $\eta_X : \operatorname{Hom}(X,X) \to F(X)$ là ánh xạ tập hợp. Đặt $\Phi(\eta) := \eta_X(\operatorname{id}_X) \in F(X)$. Hiển nhiên well-defined.

**Bước 2: $\Psi$ well-defined — kiểm tra tính tự nhiên.**
Cho $a \in F(X)$. Định nghĩa $\eta^a_Y(f) := F(f)(a)$ với $f \in \operatorname{Hom}(X,Y)$.

Cần kiểm tra: với $g : Y \to Z$, diagram sau commute:

$$
\begin{array}{ccc}
\operatorname{Hom}(X,Y) & \xrightarrow{g_*} & \operatorname{Hom}(X,Z) \\
\downarrow{\eta^a_Y} & & \downarrow{\eta^a_Z} \\
F(Y) & \xrightarrow{F(g)} & F(Z)
\end{array}
$$

Theo chiều xuôi qua phải rồi xuống: $f \mapsto g \circ f \mapsto F(g \circ f)(a) = (F(g) \circ F(f))(a)$ (tính functor của $F$).

Theo chiều xuống rồi sang phải: $f \mapsto F(f)(a) \mapsto F(g)(F(f)(a)) = (F(g) \circ F(f))(a)$.

Hai kết quả bằng nhau. $\Psi$ well-defined. ✓

**Bước 3: $\Phi \circ \Psi = \operatorname{id}$.**
$\Phi(\Psi(a)) = (\eta^a)_X(\operatorname{id}_X) = F(\operatorname{id}_X)(a) = \operatorname{id}_{F(X)}(a) = a$. ✓

**Bước 4: $\Psi \circ \Phi = \operatorname{id}$.**
Cho $\eta : \operatorname{Hom}(X,-) \Rightarrow F$. Đặt $a = \Phi(\eta) = \eta_X(\operatorname{id}_X)$.

Cần chứng minh $\Psi(a) = \eta$, tức $\eta^a_Y = \eta_Y$ với mọi $Y$.

Lấy $f : X \to Y$ tùy ý. Tính $\eta_Y(f)$ bằng cách dùng tính tự nhiên của $\eta$ với morphism $f : X \to Y$:

$$
\begin{array}{ccc}
\operatorname{Hom}(X,X) & \xrightarrow{f_*} & \operatorname{Hom}(X,Y) \\
\downarrow{\eta_X} & & \downarrow{\eta_Y} \\
F(X) & \xrightarrow{F(f)} & F(Y)
\end{array}
$$

Đi theo chiều trên rồi xuống: $\operatorname{id}_X \mapsto f \mapsto \eta_Y(f)$.

Đi theo chiều xuống rồi sang phải: $\operatorname{id}_X \mapsto \eta_X(\operatorname{id}_X) = a \mapsto F(f)(a)$.

Vậy $\eta_Y(f) = F(f)(a) = \eta^a_Y(f)$. ✓

**Bước 5: Tính tự nhiên của bijection** (natural in $X$ và $F$).
Cần kiểm tra rằng với morphism $g : X' \to X$ và natural transformation $\alpha : F \Rightarrow G$, các bijection tương thích. Đây là tính toán sơ đồ con tương tự, bỏ qua cho ngắn gọn. $\blacksquare$

---

## Yoneda Embedding

> [!theorem] Theorem A1.2 — Yoneda Embedding là Fully Faithful
> Functor $よ : \mathcal{C} \to [\mathcal{C}^{op}, \mathbf{Set}]$, $X \mapsto \operatorname{Hom}(-,X)$, là **fully faithful**: với mọi $X, Y \in \mathcal{C}$,
>
> $$
> \operatorname{Hom}_{\mathcal{C}}(X, Y) \;\cong\; \operatorname{Nat}(\operatorname{Hom}(-,X),\, \operatorname{Hom}(-,Y)).
> $$

**Proof.**
Áp dụng Yoneda Lemma với $F = \operatorname{Hom}(-,Y)$ là contravariant functor (tức functor từ $\mathcal{C}^{op}$) và đối tượng $X$:

$$
\operatorname{Nat}(\operatorname{Hom}(-,X), \operatorname{Hom}(-,Y)) \cong \operatorname{Hom}(-,Y)(X) = \operatorname{Hom}(X,Y). \qquad \blacksquare
$$

> [!corollary] Corollary A1.3
> $X \cong Y$ trong $\mathcal{C}$ $\iff$ $\operatorname{Hom}(-,X) \cong \operatorname{Hom}(-,Y)$ (natural isomorphism of functors).

**Proof.**
($\Rightarrow$) Rõ ràng.
($\Leftarrow$) Nếu $\eta : \operatorname{Hom}(-,X) \cong \operatorname{Hom}(-,Y)$ là iso, thì theo Yoneda embedding fully faithful, tồn tại duy nhất morphism $f : X \to Y$ với $\eta = f \circ (-)$. Tương tự có $g : Y \to X$. Tính $g \circ f$ và $f \circ g$ đều là $\operatorname{id}$ từ tính duy nhất. $\blacksquare$

---

## Hệ quả trong Algebraic Geometry: Functor of Points

> [!note] Remark A1.4 — Functor of Points
> Với scheme $X$, Yoneda embedding cho:
>
> $$
> X \;\longleftrightarrow\; h_X : \mathbf{Sch}^{op} \to \mathbf{Set}, \quad T \mapsto \operatorname{Hom}_{\mathbf{Sch}}(T, X).
> $$
>
> Tập hợp $h_X(T) = \operatorname{Hom}(T, X)$ gọi là tập **$T$-valued points** của $X$, ký hiệu $X(T)$.

> [!example] Example A1.5 — Functor of points của $\mathbb{A}^n$
> $\mathbb{A}^n = \operatorname{Spec} \mathbb{Z}[x_1,\ldots,x_n]$. Với $T = \operatorname{Spec} R$:
>
> $$
> \mathbb{A}^n(T) = \operatorname{Hom}(\operatorname{Spec} R,\, \mathbb{A}^n) \cong \operatorname{Hom}_{\mathbf{Ring}}(\mathbb{Z}[x_1,\ldots,x_n],\, R) \cong R^n.
> $$
>
> Tức là "$R$-points của $\mathbb{A}^n$" là các $n$-tuple $(r_1,\ldots,r_n) \in R^n$ — như mong đợi.

> [!example] Example A1.6 — Representable functors và moduli problems
> Một **moduli problem** là functor $\mathcal{M} : \mathbf{Sch}^{op} \to \mathbf{Set}$. Nếu $\mathcal{M} \cong h_X$ cho scheme $X$ nào đó, ta gọi $X$ là **fine moduli space**. Yoneda Lemma đảm bảo $X$ là duy nhất (nếu tồn tại).
>
> Ví dụ: Grassmannian $\operatorname{Gr}(k, n)$ là fine moduli space cho functor $T \mapsto \{$rank-$k$ locally free quotients of $\mathcal{O}_T^n\}$.

---

## Contravariant Yoneda

> [!theorem] Theorem A1.7 — Contravariant Yoneda Lemma
> Với $F : \mathcal{C}^{op} \to \mathbf{Set}$ (contravariant functor) và $X \in \mathcal{C}$:
>
> $$
> \operatorname{Nat}(\operatorname{Hom}(-,X),\, F) \;\cong\; F(X),
> $$
>
> cho bởi $\eta \mapsto \eta_X(\operatorname{id}_X)$. Chứng minh đối xứng hoàn toàn với Theorem A1.1.

---

## SageMath: Minh họa

```python
G1 = AbelianGroup([6])
G2 = AbelianGroup([2, 3])
print(G1.is_isomorphic(G2))  

def count_hom(n, m):
    return gcd(n, m)

for target in [2, 3, 4, 6, 12]:
    print(f"Hom(Z/6, Z/{target}) = {count_hom(6, target)}")
```

---

## References

- Mac Lane, S. *Categories for the Working Mathematician* (GTM 5), Chapter III §2.
- Riehl, E. *Category Theory in Context* (Dover, 2016), Chapter 2. (Tải miễn phí)
- nLab: https://ncatlab.org/nlab/show/Yoneda+lemma
- Vakil, R. *The Rising Sea* (2024), §1.3.
