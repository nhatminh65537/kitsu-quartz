---
title: "01. Category Theory & Functors"
tags: [math, algebraic-geometry, lesson-01, category-theory]
aliases: [Category Theory and Functors]
created: 2026-03-31
---

> **Prerequisites**: Quen thuộc với tập hợp, ánh xạ; biết sơ lược về nhóm, vành, module.
> **Objectives**:
> - Nắm định nghĩa category, functor, natural transformation
> - Hiểu và áp dụng Yoneda lemma
> - Nhận diện limits và colimits trong các ví dụ quen thuộc
> - Thấy cách lý thuyết category là "ngôn ngữ" của Algebraic Geometry hiện đại

---

## Motivation / Intuition

Algebraic Geometry theo trường phái Grothendieck được viết bằng ngôn ngữ của **lý thuyết category** (category theory). Thay vì nghiên cứu từng không gian hay vành riêng lẻ, ta quan tâm đến *quan hệ* giữa chúng: các ánh xạ, các phép biến đổi, và đặc biệt là **tính chất phổ quát** (universal property).

Ví dụ: tích $A \times B$ không chỉ là "một tập có cấu trúc nhất định" mà được đặc trưng bởi tính chất phổ quát — mọi cặp ánh xạ về $A$ và $B$ phân tích duy nhất qua $A \times B$. Tư duy này cho phép ta định nghĩa fiber product của schemes, functor of points, và nhiều cấu trúc khác theo cách thống nhất.

---

## Category

### Definition

> [!definition] Definition 1.1 — Category (phạm trù)
> Một **category** $\mathcal{C}$ gồm:
>
> - Lớp các **đối tượng** (objects) $\operatorname{Ob}(\mathcal{C})$,
> - Với mỗi cặp $(X, Y)$, tập hợp **morphism** $\operatorname{Hom}_{\mathcal{C}}(X, Y)$,
> - **Phép hợp thành** $\circ : \operatorname{Hom}(Y,Z) \times \operatorname{Hom}(X,Y) \to \operatorname{Hom}(X,Z)$,
>
> thỏa mãn:
>
> 1. **Kết hợp**: $(h \circ g) \circ f = h \circ (g \circ f)$.
> 2. **Đơn vị**: Với mỗi $X$, $\exists\, \operatorname{id}_X \in \operatorname{Hom}(X,X)$ sao cho $f \circ \operatorname{id}_X = f = \operatorname{id}_Y \circ f$ với mọi $f : X \to Y$.

> [!note] Remark 1.2
> Morphism $f : X \to Y$ có nghịch đảo hai phía $g$ (tức $g \circ f = \operatorname{id}_X$ và $f \circ g = \operatorname{id}_Y$) gọi là **isomorphism**, ký hiệu $X \cong Y$. Category đối ngẫu $\mathcal{C}^{op}$ có cùng objects nhưng $\operatorname{Hom}_{\mathcal{C}^{op}}(X,Y) := \operatorname{Hom}_{\mathcal{C}}(Y,X)$.

### Worked Example

> [!example] Example 1.3 — Các category cơ bản
>
> | Category | Objects | Morphisms |
> |----------|---------|-----------|
> | $\mathbf{Set}$ | Tập hợp | Ánh xạ |
> | $\mathbf{Ring}$ | Vành | Đồng cấu vành |
> | $\mathbf{Mod}_R$ | $R$-module | Đồng cấu module |
> | $\mathbf{Top}$ | Không gian topo | Ánh xạ liên tục |
> | $\mathbf{Sch}$ | Schemes | Morphism of schemes |
>
> Mỗi poset $(P, \leq)$ là một category: $\operatorname{Hom}(x,y)$ có đúng một phần tử nếu $x \leq y$, rỗng nếu không.

---

## Functor

### Definition

> [!definition] Definition 1.4 — Functor (hàm tử)
> Một **covariant functor** $F : \mathcal{C} \to \mathcal{D}$ gồm:
>
> - Ánh xạ $X \mapsto F(X)$ trên objects,
> - Ánh xạ $(f : X \to Y) \mapsto (F(f) : F(X) \to F(Y))$ trên morphisms,
>
> thỏa $F(\operatorname{id}_X) = \operatorname{id}_{F(X)}$ và $F(g \circ f) = F(g) \circ F(f)$.
>
> Một **contravariant functor** $F : \mathcal{C} \to \mathcal{D}$ đảo chiều: $(f : X \to Y) \mapsto (F(f) : F(Y) \to F(X))$.

### Worked Example

> [!example] Example 1.5 — Hom functor
>
> Cố định $A \in \mathcal{C}$:
>
> - **Covariant** $\operatorname{Hom}(A,-) : \mathcal{C} \to \mathbf{Set}$: gửi $X \mapsto \operatorname{Hom}(A,X)$, và $f : X \to Y$ về $f_* : g \mapsto f \circ g$.
>
> - **Contravariant** $\operatorname{Hom}(-,A) : \mathcal{C} \to \mathbf{Set}$: gửi $X \mapsto \operatorname{Hom}(X,A)$, và $f : X \to Y$ về $f^* : g \mapsto g \circ f$.
>
> Trong algebraic geometry, functor global sections $\Gamma(X,-) : \operatorname{Sh}(X) \to \mathbf{Ab}$ gửi sheaf $\mathcal{F}$ về $\mathcal{F}(X)$ — đây là hom functor $\operatorname{Hom}(\mathcal{O}_X, -)$ trong category phù hợp.

---

## Natural Transformation

### Definition

> [!definition] Definition 1.6 — Natural Transformation (biến đổi tự nhiên)
> Cho $F, G : \mathcal{C} \to \mathcal{D}$. Một **natural transformation** $\eta : F \Rightarrow G$ là họ morphism $\eta_X : F(X) \to G(X)$ (gọi là components) sao cho với mọi $f : X \to Y$, diagram
>
> $$
> \begin{array}{ccc}
> F(X) & \xrightarrow{\eta_X} & G(X) \\
> \downarrow{F(f)} & & \downarrow{G(f)} \\
> F(Y) & \xrightarrow{\eta_Y} & G(Y)
> \end{array}
> $$
>
> commute. Nếu mọi $\eta_X$ là isomorphism, ta gọi $\eta$ là **natural isomorphism**, ký hiệu $F \cong G$.

---

## Yoneda Lemma

### Theorem

> [!theorem] Theorem 1.7 — Yoneda Lemma
> Cho $F : \mathcal{C} \to \mathbf{Set}$ và $X \in \mathcal{C}$. Có bijection tự nhiên:
>
> $$
> \operatorname{Nat}(\operatorname{Hom}(X,-),\, F) \;\cong\; F(X),
> $$
>
> cụ thể: natural transformation $\eta : \operatorname{Hom}(X,-) \Rightarrow F$ tương ứng với $\eta_X(\operatorname{id}_X) \in F(X)$.

**Proof.**
Cho $\eta$ và $a := \eta_X(\operatorname{id}_X) \in F(X)$. Với $f : X \to Y$ bất kỳ, tính tự nhiên cho:

$$
\eta_Y(f) = \eta_Y(f \circ \operatorname{id}_X) = F(f)(\eta_X(\operatorname{id}_X)) = F(f)(a).
$$

Vậy $\eta$ hoàn toàn xác định bởi $a$. Ngược lại, với $a \in F(X)$ cho trước, định nghĩa $\eta^a_Y(f) := F(f)(a)$ — đây là natural transformation hợp lệ (kiểm tra tính tự nhiên bằng tính functor của $F$). Hai hàm là nghịch đảo nhau.

Xem chứng minh đầy đủ và các hệ quả tại [[a1-yoneda-lemma|A1. Proof of Yoneda Lemma]]. $\blacksquare$

> [!corollary] Corollary 1.8 — Yoneda Embedding
> Functor $よ : \mathcal{C} \to [\mathcal{C}^{op}, \mathbf{Set}]$ định nghĩa bởi $X \mapsto \operatorname{Hom}(-,X)$ là **fully faithful**: $\operatorname{Hom}(X,Y) \cong \operatorname{Nat}(\operatorname{Hom}(-,X), \operatorname{Hom}(-,Y))$. Đặc biệt, $X \cong Y \iff \operatorname{Hom}(-,X) \cong \operatorname{Hom}(-,Y)$.

> [!note] Remark 1.9 — Functor of points trong Algebraic Geometry
> Mỗi scheme $X$ được xác định hoàn toàn bởi **functor of points** $h_X : \mathbf{Sch}^{op} \to \mathbf{Set}$, $T \mapsto \operatorname{Hom}(T, X)$. Tập $h_X(T)$ gọi là tập $T$-valued points của $X$. Đây là cách Grothendieck "mở rộng" khái niệm solution set sang schemes tổng quát.

---

## Limits và Colimits

### Definition

> [!definition] Definition 1.10 — Limit và Colimit
> Cho diagram (functor) $F : \mathcal{J} \to \mathcal{C}$.
>
> **Limit** $\varprojlim F$ là đối tượng $L$ với morphism $\pi_j : L \to F(j)$ thỏa tính tương thích và tính phổ quát: với mọi $M$ và $q_j : M \to F(j)$ tương thích, tồn tại duy nhất $u : M \to L$ sao cho $\pi_j \circ u = q_j$.
>
> **Colimit** $\varinjlim F$ là đối ngẫu: đối tượng $C$ với $\iota_j : F(j) \to C$ thỏa tính phổ quát ngược chiều.

### Worked Example

> [!example] Example 1.11 — Limits và colimits quen thuộc
>
> | Tên | Diagram $\mathcal{J}$ | Loại |
> |-----|----------------------|------|
> | Tích $A \times B$ | $\bullet \quad \bullet$ (rời) | Limit |
> | Coproduct $A \sqcup B$ | $\bullet \quad \bullet$ (rời) | Colimit |
> | Fiber product $A \times_C B$ | $A \to C \leftarrow B$ | Limit |
> | Pushout | $A \leftarrow C \to B$ | Colimit |
> | Equalizer | $A \rightrightarrows B$ | Limit |
> | Coequalizer | $A \rightrightarrows B$ | Colimit |
>
> **Fiber product** $X \times_S Y$ là limit cơ bản nhất trong algebraic geometry: nó mô hình hóa base change và là định nghĩa của morphism $X \to S$ và $Y \to S$.

> [!note] Remark 1.12
> Functor $\operatorname{Hom}(A,-)$ **bảo toàn limits** (left exact) nhưng không bảo toàn colimits nói chung. Đây là nguồn gốc của sheaf cohomology: ta "đo" mức độ thất bại của exactness phải.

---

## SageMath Cheatsheet

```python
# Minh họa fiber product (pullback) trong category vành
# Fiber product của R -> T <- S là R x_T S = {(r,s) | phi(r) = psi(s)}

R = QQ['x']   # Q[x]
S = QQ['y']   # Q[y]
T = QQ        # Q

# Embedding R -> T: x |-> 0
# Embedding S -> T: y |-> 0
# Fiber product R x_T S = Q[x,y] / (x, y) ~= Q ... quá đơn giản

# Ví dụ Yoneda: isomorphism Z/6Z ~= Z/2Z x Z/3Z
G1 = AbelianGroup([6])
G2 = AbelianGroup([2, 3])
print(G1.is_isomorphic(G2))  # True

# Hom functor: số morphism từ Z/n -> Z/m là gcd(n,m)
def hom_count(n, m):
    return gcd(n, m)

print(hom_count(6, 4))  # 2 (morphisms Z/6Z -> Z/4Z)
print(hom_count(6, 3))  # 3 (morphisms Z/6Z -> Z/3Z)
```

---

## Summary / Key Takeaways

- **Category** = objects + morphisms + composition (kết hợp, có đơn vị).
- **Functor** bảo toàn cấu trúc: $F(g \circ f) = F(g) \circ F(f)$.
- **Natural transformation** là "morphism giữa functors", tôn trọng mọi morphism trong $\mathcal{C}$.
- **Yoneda Lemma**: $\operatorname{Nat}(\operatorname{Hom}(X,-),F) \cong F(X)$ — đối tượng xác định hoàn toàn bởi "điều nó thấy".
- **Functor of points**: scheme $X$ $\leftrightarrow$ functor $T \mapsto X(T) = \operatorname{Hom}(T,X)$.
- **Limits/Colimits**: fiber product $X \times_S Y$ là limit quan trọng nhất trong algebraic geometry.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapter 1.
- Mac Lane, S. *Categories for the Working Mathematician* (GTM 5).
- Riehl, E. *Category Theory in Context* (2016). (Tải miễn phí tại trang tác giả)
