---
title: "03. Affine Varieties & Nullstellensatz"
tags: [math, algebraic-geometry, lesson-03, varieties, nullstellensatz]
aliases: [Affine Varieties and Nullstellensatz]
created: 2026-03-31
---

> **Prerequisites**: Commutative algebra: vành Noetherian, ideal, factorization, field extensions.
> **Objectives**:
> - Định nghĩa algebraic set và affine variety
> - Hiểu Zariski topology và sự tương đương với topo thông thường
> - Phát biểu và chứng minh (sketch) Hilbert Nullstellensatz
> - Xây dựng correspondence giữa ideals và algebraic sets

---

## Motivation / Intuition

Algebraic Geometry cổ điển nghiên cứu các tập hợp nghiệm của hệ phương trình đa thức. Ví dụ: đường tròn $x^2 + y^2 = 1$, đường elliptic $y^2 = x^3 - x$, hay mặt phẳng $z = 0$ trong $\mathbb{A}^3$.

Bước tiến quan trọng nhất là nhận ra rằng geometry của những tập hợp này được phản ánh hoàn toàn trong algebra của các đa thức vanishing trên chúng — và ngược lại. Cầu nối chính xác này là **Hilbert Nullstellensatz** (định lý số không của Hilbert).

---

## Affine Space và Algebraic Sets

### Definition

> [!definition] Definition 3.1 — Affine $n$-space
> Cho $k$ là trường (field), **affine $n$-space** (không gian affine) là tập:
>
> $$
> \mathbb{A}^n_k := k^n = \{(a_1, \ldots, a_n) \mid a_i \in k\}.
> $$
>
> Phần tử của $\mathbb{A}^n$ gọi là **điểm** (point). Ta viết tắt $\mathbb{A}^n$ khi $k$ rõ từ ngữ cảnh.

> [!definition] Definition 3.2 — Algebraic Set (tập đại số)
> Cho tập $S \subseteq k[x_1, \ldots, x_n]$ của các đa thức. **Algebraic set** (hay **affine algebraic set**) xác định bởi $S$ là:
>
> $$
> V(S) := \{(a_1, \ldots, a_n) \in \mathbb{A}^n \mid f(a_1, \ldots, a_n) = 0 \;\forall f \in S\}.
> $$
>
> Vì $V(S) = V(\langle S \rangle)$ (ideal sinh bởi $S$), ta thường giả sử $S$ là một ideal.

### Worked Example

> [!example] Example 3.3 — Các algebraic sets
>
> Trong $\mathbb{A}^2_{\mathbb{C}}$:
>
> - $V(x^2 + y^2 - 1)$: đường tròn đơn vị (phức).
> - $V(y - x^2)$: parabola.
> - $V(xy)$: hợp của hai trục tọa độ $V(x) \cup V(y)$.
> - $V(x^2, xy)$: trục $y$ ($V(x)$) — vì $V(x^2) = V(x)$ khi $k = \mathbb{C}$.
> - $V(1) = \emptyset$, $V(0) = \mathbb{A}^n$.
>
> Lưu ý: $V(x^2) = V(x)$ nhưng $(x^2) \neq (x)$ — nên algebraic sets không tương ứng 1-1 với ideals.

---

## Zariski Topology

### Definition

> [!definition] Definition 3.4 — Zariski Topology
> **Zariski topology** trên $\mathbb{A}^n$ định nghĩa các **closed sets** là các algebraic sets $V(I)$, với $I \subseteq k[x_1, \ldots, x_n]$ là ideal.

> [!theorem] Theorem 3.5 — Đây là topology hợp lệ
> Họ $\{V(I) \mid I \text{ ideal}\}$ thỏa mãn các tiên đề cho closed sets:
>
> 1. $\emptyset = V(1)$ và $\mathbb{A}^n = V(0)$ là closed.
> 2. Giao tùy ý: $\bigcap_\alpha V(I_\alpha) = V\!\left(\sum_\alpha I_\alpha\right)$.
> 3. Hợp hữu hạn: $V(I) \cup V(J) = V(I \cap J) = V(IJ)$.

**Proof.**
(3): $p \in V(I) \cup V(J) \iff$ ($f(p) = 0$ $\forall f \in I$) or ($g(p) = 0$ $\forall g \in J$). Mặt khác $V(IJ) = V(I) \cup V(J)$ vì: nếu $p \notin V(I)$ thì $\exists f \in I$ với $f(p) \neq 0$, nên với mọi $g \in J$, $fg \in IJ$ và $(fg)(p) = f(p)g(p)$. Do đó $p \in V(IJ) \iff g(p) = 0$ $\forall g \in J$, tức $p \in V(J)$. $\blacksquare$

> [!note] Remark 3.6 — Topo Zariski rất thô
> Zariski topology **không** là Hausdorff (trừ trường hợp tầm thường). Ví dụ trên $\mathbb{A}^1_k$ (với $k$ vô hạn), các closed sets là $\emptyset$, các tập hữu hạn, và $\mathbb{A}^1$ — open sets là complements của tập hữu hạn.
>
> Hai điểm phân biệt $p, q$ không thể được tách bởi open sets disjoint: mọi open set chứa $p$ đều chứa hầu hết mọi điểm, kể cả $q$.

---

## Ideal của Algebraic Set — Hàm $I(-)$

### Definition

> [!definition] Definition 3.7 — Vanishing Ideal
> Cho $Y \subseteq \mathbb{A}^n$. **Vanishing ideal** (ideal triệt tiêu) của $Y$ là:
>
> $$
> I(Y) := \{f \in k[x_1, \ldots, x_n] \mid f(p) = 0 \;\forall p \in Y\}.
> $$
>
> Đây luôn là một ideal, và thực ra là **radical ideal**: $f^m \in I(Y) \Rightarrow f \in I(Y)$.

### Theorem

> [!theorem] Theorem 3.8 — Tính chất của $V$ và $I$
> Với $Y \subseteq \mathbb{A}^n$ và $J \subseteq k[x_1,\ldots,x_n]$ ideal:
>
> 1. $Y \subseteq V(I(Y))$ (equality khi $Y$ là algebraic set).
> 2. $J \subseteq I(V(J))$.
> 3. $V$ và $I$ đảo chiều: $Y_1 \subseteq Y_2 \Rightarrow I(Y_2) \subseteq I(Y_1)$.
> 4. $I(V(J)) = \sqrt{J}$ **(Nullstellensatz, strong form)**.

---

## Hilbert Nullstellensatz

### Theorem

> [!theorem] Theorem 3.9 — Hilbert Nullstellensatz (Weak Form)
> Cho $k$ là trường **đại số đóng** (algebraically closed, e.g. $k = \mathbb{C}$) và $I \subsetneq k[x_1,\ldots,x_n]$ là ideal thực sự (proper). Khi đó $V(I) \neq \emptyset$, tức là hệ phương trình đa thức xác định bởi $I$ có nghiệm.

**Proof sketch.**
Đủ chứng minh với $I$ maximal. Khi đó $k[x_1,\ldots,x_n]/I$ là field $L$ chứa $k$. Vì $k$ đại số đóng và $L/k$ là algebraic extension hữu hạn (theo Zariski's lemma), $L = k$. Vậy projection $k[x_i] \to k[x_1,\ldots,x_n]/I = k$ gửi $x_i \mapsto a_i \in k$, tức $(a_1,\ldots,a_n) \in V(I)$. $\blacksquare$

> [!theorem] Theorem 3.10 — Hilbert Nullstellensatz (Strong Form)
> Cho $k$ đại số đóng và $J \subseteq k[x_1,\ldots,x_n]$ là ideal. Khi đó:
>
> $$
> I(V(J)) = \sqrt{J} := \{f \mid f^m \in J \text{ với nào đó } m \geq 1\}.
> $$

**Proof sketch (Rabinowitsch trick).**
Hiển nhiên $\sqrt{J} \subseteq I(V(J))$. Chiều ngược: giả sử $f \in I(V(J))$, tức $f$ triệt tiêu trên $V(J)$. Đặt $y$ là biến mới và xét $J' := J + (1 - yf) \subseteq k[x_1,\ldots,x_n,y]$. Nếu $(a,b) \in V(J')$ thì $a \in V(J)$ (nên $f(a) = 0$) và $1 - bf(a) = 0$, mâu thuẫn. Vậy $V(J') = \emptyset$. Theo weak form, $J' = (1)$, tức tồn tại $g_i \in k[\mathbf{x},y]$ và $p_i \in J$ với $\sum g_i p_i + h(1-yf) = 1$. Substitute $y = 1/f$ và nhân với lũy thừa $f^N$ phù hợp để thu $f^N \in J$.

Xem chứng minh đầy đủ tại [[a0-hilbert-nullstellensatz|A0. Proof of Hilbert Nullstellensatz]]. $\blacksquare$

> [!corollary] Corollary 3.11 — Galois Correspondence
> Trên trường đại số đóng $k$, có **bijection đảo chiều** (order-reversing bijection):
>
> $$
> \left\{\text{algebraic sets trong } \mathbb{A}^n\right\} \;\longleftrightarrow\; \left\{\text{radical ideals trong } k[x_1,\ldots,x_n]\right\}
> $$
>
> cho bởi $Y \mapsto I(Y)$ và $J \mapsto V(J)$.

---

## Affine Variety và Coordinate Ring

### Definition

> [!definition] Definition 3.12 — Affine Variety (đa tạp affine)
> Một **affine variety** (đa tạp affine) là algebraic set $Y \subseteq \mathbb{A}^n$ **irreducible**: $Y \neq \emptyset$ và $Y = Y_1 \cup Y_2$ (closed) $\Rightarrow Y = Y_1$ hoặc $Y = Y_2$.
>
> Tương đương, $Y$ là affine variety $\iff$ $I(Y)$ là prime ideal.

> [!definition] Definition 3.13 — Coordinate Ring (vành tọa độ)
> Cho $Y \subseteq \mathbb{A}^n$ là algebraic set. **Coordinate ring** (hay **affine ring**) của $Y$ là:
>
> $$
> A(Y) := k[x_1,\ldots,x_n] / I(Y).
> $$
>
> Đây là $k$-algebra hữu hạn sinh, reduced (không có nilpotent element $\neq 0$). Nếu $Y$ là affine variety, $A(Y)$ là domain.

### Worked Example

> [!example] Example 3.14 — Coordinate ring của đường cong
>
> **Parabola** $Y = V(y - x^2) \subseteq \mathbb{A}^2$: $I(Y) = (y - x^2)$, và
>
> $$
> A(Y) = \mathbb{C}[x,y]/(y-x^2) \cong \mathbb{C}[x].
> $$
>
> Đây là domain nguyên, $Y$ là variety. Isomorphism $A(Y) \cong \mathbb{C}[x]$ tương ứng với tham số hóa $t \mapsto (t, t^2)$.
>
> **Hợp hai trục** $Y = V(xy) = V(x) \cup V(y)$: $I(Y) = (xy)$, và $A(Y) = \mathbb{C}[x,y]/(xy)$. Đây **không** là domain, phản ánh tính reducible của $Y$.

> [!example] Example 3.15 — Dimension và transcendence degree
> Algebraic geometry dimension của một affine variety $Y$ là **Krull dimension** của $A(Y)$, bằng **transcendence degree** của fraction field $k(Y) := \operatorname{Frac}(A(Y))$ over $k$:
>
> $$
> \dim Y = \operatorname{tr.deg}_k k(Y).
> $$
>
> Ví dụ: $\dim \mathbb{A}^n = n$ vì $k(\mathbb{A}^n) = k(x_1,\ldots,x_n)$ có transcendence degree $n$.

---

## Regular Functions và Morphisms

### Definition

> [!definition] Definition 3.16 — Regular Function
> Một **regular function** (hàm chính quy) trên affine variety $Y$ là phần tử của $A(Y)$ — tức là restriction của một polynomial lên $Y$.
>
> Một **morphism** (hay **regular map**) giữa các affine varieties $\phi : Y \to Z$ là ánh xạ cảm sinh bởi đồng cấu $k$-algebra $\phi^* : A(Z) \to A(Y)$ (pullback). Affine varieties và morphisms tạo thành một category.

> [!theorem] Theorem 3.17 — Anti-equivalence của categories
> Functor $A : \{\text{affine varieties}/k\}^{op} \to \{\text{reduced, f.g. } k\text{-algebras}\}$, $Y \mapsto A(Y)$, là **equivalence of categories**.

**Proof sketch.**
Functor đầy đủ và trung thực: morphism $\phi : Y \to Z$ tương đương với $k$-algebra hom $A(Z) \to A(Y)$. Essentially surjective: mọi reduced f.g. $k$-algebra $R$ đều là $k[x_1,\ldots,x_n]/\sqrt{I}$ cho ideal $I$ nào đó, cảm sinh bởi $Y = V(I)$ với $A(Y) = R$. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Làm việc với algebraic sets và varieties trong Sage

R = QQ['x, y']
x, y = R.gens()

# Định nghĩa ideal và tính radical
I = R.ideal(x^2 - y, x^3 - y)
print(I.radical())           # Radical ideal: (x^2 - y, x - y^2)... 
print(I.variety())           # Variety (tập nghiệm): list of points

# Ví dụ trên trường đóng CC (algebraically closed)
R2 = CC['x, y']
x2, y2 = R2.gens()
I2 = R2.ideal(x2^2 + y2^2 - 1)
# Điểm trên đường tròn phức
print(I2.variety())  # Có vô số điểm - sage sẽ báo lỗi

# Coordinate ring và Groebner basis
R3 = QQ['x, y, z']
x3, y3, z3 = R3.gens()
# Twisted cubic: V(y - x^2, z - x^3)
I3 = R3.ideal(y3 - x3^2, z3 - x3^3)
print(I3.groebner_basis())    # Groebner basis của ideal
A_Y = R3.quotient(I3)         # Coordinate ring
print(A_Y.is_integral_domain()) # True: variety irreducible

# Hilbert function
HP = I3.hilbert_polynomial()
print(HP)                      # Hilbert polynomial
```

---

## Summary / Key Takeaways

- **Algebraic set** $V(I) \subseteq \mathbb{A}^n$: tập nghiệm chung của các đa thức trong ideal $I$.
- **Zariski topology**: closed sets = algebraic sets; rất thô, không Hausdorff.
- **Vanishing ideal** $I(Y)$: radical ideal các đa thức triệt tiêu trên $Y$.
- **Nullstellensatz**: $I(V(J)) = \sqrt{J}$ (trên trường đại số đóng) — bijection giữa algebraic sets và radical ideals.
- **Affine variety**: algebraic set irreducible $\leftrightarrow$ prime ideal.
- **Coordinate ring** $A(Y) = k[\mathbf{x}]/I(Y)$: reduced f.g. $k$-algebra — encodes toàn bộ geometry của $Y$.
- **Anti-equivalence**: $\{$affine varieties$\}^{op} \simeq \{$reduced f.g. $k$-algebras$\}$.

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapter 3 & §4.
- Hartshorne, R. *Algebraic Geometry* (GTM 52), Chapter I §1–2.
- Cox, Little, O'Shea. *Ideals, Varieties, and Algorithms* (4th ed.), Chapters 1–4.
- Atiyah, MacDonald. *Introduction to Commutative Algebra*, Chapters 1, 7.
