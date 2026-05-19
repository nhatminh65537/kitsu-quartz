---
title: 02. Morphisms of Varieties
tags:
  - math
  - abelian-varieties
aliases:
  - Morphisms of Varieties
created: 2026-05-17
---

> **Prerequisites**: [[01-affine-projective-varieties|01. Affine and Projective Varieties]] — định nghĩa affine/projective variety, tô-pô Zariski.  
> **Objectives**:
> - Xây dựng vành tọa độ (coordinate ring) và trường hàm hữu tỉ (function field) của một variety
> - Định nghĩa cấu xạ (morphism) giữa các variety — "map tốt" trong hình học đại số
> - Phân biệt morphism, rational map, isomorphism
> - Hiểu đa tạp tích (product variety) và cấu trúc của nó
> - Áp dụng vào elliptic curve: xác định các morphism quan trọng trên $E$

---

## Motivation / Intuition

Trong đại số tuyến tính, khi nghiên cứu không gian vectơ, ta không chỉ quan tâm đến từng không gian riêng lẻ mà quan tâm đến các **ánh xạ tuyến tính** (linear maps) giữa chúng — đây là "ngôn ngữ" của phạm trù (category). Tương tự, trong hình học đại số, thay vì chỉ nghiên cứu một variety, ta nghiên cứu **hệ thống** các variety cùng các map giữa chúng.

Nhưng map nào là "phù hợp" với cấu trúc đại số? Rõ ràng không phải mọi hàm — ta cần map được mô tả bởi đa thức (hoặc phân thức đa thức), tương thích với tô-pô Zariski. Các map này gọi là **morphism** (cấu xạ đại số).

Ví dụ đơn giản: ánh xạ $\phi: \mathbb{A}^1 \to \mathbb{A}^2$ cho bởi $t \mapsto (t^2, t^3)$ là một morphism — ảnh của nó là đường cong $y^2 = x^3$ (cuspidal cubic). Ánh xạ này không phải isomorphism (dù bijective) vì nghịch đảo không là đa thức. Điều này dẫn đến câu hỏi tinh tế: khi nào hai variety "giống nhau"?

---

## Vành Tọa Độ và Trường Hàm Hữu Tỉ

> [!definition] Definition 2.1 — Vành tọa độ (Coordinate Ring)
> Cho $X = V(I) \subseteq \mathbb{A}^n$ là affine variety với $I = I(X)$ là lý tưởng bão hòa. **Vành tọa độ** (coordinate ring) của $X$ là vành thương:
>
> $$
> k[X] = k[x_1, \ldots, x_n] / I(X).
> $$
>
> Phần tử của $k[X]$ là các lớp hàm đa thức thu hẹp xuống $X$; hai đa thức đồng nhất nhau nếu chúng bằng nhau trên mọi điểm của $X$.

Vì $X$ bất khả quy, $I(X)$ là lý tưởng nguyên tố, nên $k[X]$ là miền nguyên (integral domain).

> [!definition] Definition 2.2 — Trường hàm hữu tỉ (Function Field)
> Với $X$ là affine variety bất khả quy, **trường hàm hữu tỉ** (function field) của $X$ là trường phân thức:
>
> $$
> k(X) = \operatorname{Frac}(k[X]) = \left\{ \frac{f}{g} \;\middle|\; f, g \in k[X], g \neq 0 \right\}.
> $$
>
> Phần tử $\phi = f/g \in k(X)$ gọi là **hàm hữu tỉ** (rational function) trên $X$. Nó xác định được tại điểm $P \in X$ khi $g(P) \neq 0$; **miền xác định** (domain of definition) là $D(\phi) = X \setminus V(g)$.

> [!example] Example 2.3 — Vành tọa độ và trường hàm của $E$
> Cho đường cong elliptic $E: y^2 = x^3 + ax + b$ trong $\mathbb{A}^2$. Khi đó:
>
> $$
> k[E] = k[x,y] / (y^2 - x^3 - ax - b)
> $$
>
> và $k(E) = \operatorname{Frac}(k[E])$. Một hàm hữu tỉ điển hình là $x/y$, xác định tại mọi điểm $P = (x_0, y_0)$ với $y_0 \neq 0$.

---

## Morphism Giữa Affine Varieties

> [!definition] Definition 2.4 — Hàm chính quy (Regular Function)
> Một hàm $f: X \to k$ được gọi là **chính quy** (regular) tại điểm $P \in X$ nếu tồn tại lân cận Zariski mở $U \ni P$ và $g, h \in k[x_1, \ldots, x_n]$ với $h(Q) \neq 0$ với mọi $Q \in U$, sao cho $f = g/h$ trên $U$.
>
> $f$ **chính quy trên $X$** nếu nó chính quy tại mọi điểm. Tập tất cả hàm chính quy trên $X$ ký hiệu là $\mathcal{O}(X)$.

> [!theorem] Theorem 2.5 — Hàm chính quy trên affine variety
> Với $X \subseteq \mathbb{A}^n$ là affine variety, $\mathcal{O}(X) = k[X]$. Tức là hàm chính quy toàn cục trên affine variety chính là các đa thức.

**Proof.** Rõ ràng $k[X] \subseteq \mathcal{O}(X)$. Chiều ngược cần kỹ thuật Nullstellensatz. Xem Hartshorne I.3.4. $\blacksquare$

> [!definition] Definition 2.6 — Morphism giữa affine varieties
> Một **morphism** (cấu xạ) $\phi: X \to Y$ giữa hai affine varieties $X \subseteq \mathbb{A}^m$ và $Y \subseteq \mathbb{A}^n$ là một hàm $\phi = (\phi_1, \ldots, \phi_n): X \to Y$ sao cho mỗi $\phi_i \in k[X]$ (tức mỗi tọa độ là hàm chính quy). Tức:
>
> $$
> \phi(P) = (\phi_1(P), \ldots, \phi_n(P)) \in Y \quad \forall P \in X,
> $$
>
> với $\phi_1, \ldots, \phi_n$ là các đa thức (modulo $I(X)$).

**Quan sát quan trọng**: Mỗi morphism $\phi: X \to Y$ kéo theo một ring homomorphism ngược chiều (pullback):

$$
\phi^*: k[Y] \to k[X], \quad (\phi^* f)(P) = f(\phi(P)).
$$

Điều này cho ta **đối ngẫu phạm trù** (contravariant equivalence): affine varieties $\leftrightarrow$ finitely generated reduced $k$-algebras, qua $X \mapsto k[X]$.

> [!example] Example 2.7 — Morphism cụ thể
> Xét $\phi: \mathbb{A}^1 \to \mathbb{A}^2$ cho bởi $t \mapsto (t^2, t^3)$. Ảnh $\phi(\mathbb{A}^1)$ là đường cong cuspidal $C: y^2 = x^3$.
>
> - $\phi$ là morphism (mỗi tọa độ là đa thức).
> - $\phi$ bijective (như hàm tập hợp từ $\mathbb{A}^1$ vào $C$).
> - Nhưng $\phi^*: k[C] = k[x,y]/(y^2-x^3) \to k[t]$ không là isomorphism vì $k[C]$ không phải miền chính quy (có $t = x/y$ phân thức hữu tỉ, không phải đa thức trong $x,y$).
> - Vậy $\phi$ **không** là isomorphism dù bijective!

---

## Morphism Giữa Các Variety Tổng Quát

Với projective variety hay các variety tổng quát, ta cần định nghĩa morphism locally:

> [!definition] Definition 2.8 — Morphism tổng quát
> Một hàm liên tục $\phi: X \to Y$ (theo tô-pô Zariski) là **morphism** nếu với mọi tập mở $V \subseteq Y$ và mọi hàm chính quy $f \in \mathcal{O}(V)$, hàm hợp $f \circ \phi \in \mathcal{O}(\phi^{-1}(V))$ cũng là chính quy.
>
> Tương đương (đối với quasi-projective varieties): $\phi$ là morphism nếu nó locally được mô tả bởi hàm có mẫu không triệt tiêu.

> [!note] Remark 2.9 — Định nghĩa qua sheaves
> Cách hiện đại định nghĩa morphism: $\phi: X \to Y$ là morphism nếu là ánh xạ liên tục theo Zariski kèm cấu trúc pullback sheaf $\phi^{-1}\mathcal{O}_Y \to \mathcal{O}_X$. Ở mức bài này, ta dùng định nghĩa local đủ cho mục đích.

---

## Rational Map

> [!definition] Definition 2.10 — Rational Map
> Một **rational map** (ánh xạ hữu tỉ) $\phi: X \dashrightarrow Y$ giữa hai varieties là morphism $\phi: U \to Y$ xác định trên một tập mở Zariski dense $U \subseteq X$. Hai rational maps $\phi_1: U_1 \to Y$ và $\phi_2: U_2 \to Y$ được đồng nhất nếu chúng trùng nhau trên $U_1 \cap U_2$.
>
> Rational map được gọi là **dominant** nếu ảnh $\phi(U)$ dense trong $Y$.

> [!warning] Counterexample 2.11 — Rational map không là morphism
> Ánh xạ $\phi: \mathbb{A}^2 \dashrightarrow \mathbb{P}^1$ cho bởi $\phi(x,y) = [x:y]$ là rational map, xác định trên $U = \mathbb{A}^2 \setminus \{(0,0)\}$. Nó không kéo dài thành morphism toàn bộ $\mathbb{A}^2$ vì tại gốc $[x:y]$ không xác định được.

> [!note] Remark 2.12 — Rational maps trên smooth projective curves
> Nếu $C$ là đường cong nhẵn (smooth curve) và $\phi: C \dashrightarrow Y$ là rational map vào projective variety $Y$, thì $\phi$ **tự động** kéo dài thành morphism trên toàn bộ $C$. Đây là tính chất đặc biệt của đường cong.

---

## Isomorphism của Varieties

> [!definition] Definition 2.13 — Isomorphism
> Một morphism $\phi: X \to Y$ được gọi là **isomorphism** (đẳng cấu) nếu tồn tại morphism $\psi: Y \to X$ sao cho $\psi \circ \phi = \operatorname{id}_X$ và $\phi \circ \psi = \operatorname{id}_Y$.
>
> Khi có isomorphism, viết $X \cong Y$ và nói $X$, $Y$ **đẳng cấu** (isomorphic) như varieties.

> [!theorem] Theorem 2.14 — Tiêu chuẩn isomorphism cho affine varieties
> Hai affine varieties $X$ và $Y$ đẳng cấu khi và chỉ khi vành tọa độ $k[X] \cong k[Y]$ đẳng cấu như $k$-algebras.

**Proof.** Phạm trù affine varieties tương đương phạm trù $f.g.$ reduced $k$-algebras, theo hàm tử $X \mapsto k[X]$, $\phi \mapsto \phi^*$. $\blacksquare$

> [!example] Example 2.15 — Parabol đẳng cấu với đường thẳng
> $V(y - x^2) \subseteq \mathbb{A}^2 \cong \mathbb{A}^1$ qua $\phi: t \mapsto (t, t^2)$ và $\psi: (x,y) \mapsto x$. Thật vậy:
> $k[V(y-x^2)] = k[x,y]/(y-x^2) \cong k[x]$ qua $x \mapsto x$, $y \mapsto x^2$.

> [!example] Example 2.16 — Các morphism tự nhiên trên $E$
> Trên đường cong elliptic $E$ có nhiều morphism quan trọng:
>
> 1. **Involution negation**: $[-1]: E \to E$, $(x,y) \mapsto (x,-y)$. Đây là isomorphism (tự đảo).
> 2. **Nhân $n$**: $[n]: E \to E$, $P \mapsto P + P + \cdots + P$ ($n$ lần). Đây là morphism bậc $n^2$ — sẽ nghiên cứu chi tiết ở Bài 11.
> 3. **Translation**: $t_Q: E \to E$, $P \mapsto P + Q$ với $Q \in E(k)$ cố định. Đây là isomorphism.

---

## Đa Tạp Tích (Product Variety)

> [!definition] Definition 2.17 — Tích affine
> Tích của hai affine varieties $X \subseteq \mathbb{A}^m$ và $Y \subseteq \mathbb{A}^n$ là
>
> $$
> X \times Y \subseteq \mathbb{A}^{m+n},
> $$
>
> với tọa độ $(x_1, \ldots, x_m, y_1, \ldots, y_n)$ và lý tưởng $I(X \times Y) = I(X) + I(Y) \subseteq k[x_1,\ldots,x_m, y_1,\ldots,y_n]$.

> [!note] Remark 2.18 — Tích projective — Nhúng Segre
> Tích của hai projective varieties phức tạp hơn: $\mathbb{P}^m \times \mathbb{P}^n$ không thể tự nhiên nhúng vào $\mathbb{P}^{m+n}$. Thay vào đó, ta dùng **nhúng Segre** (Segre embedding):
>
> $$
> \sigma: \mathbb{P}^m \times \mathbb{P}^n \hookrightarrow \mathbb{P}^{(m+1)(n+1)-1},
> $$
>
> $$
> \sigma([a_0:\cdots:a_m], [b_0:\cdots:b_n]) = [a_0 b_0 : a_0 b_1 : \cdots : a_m b_n].
> $$
>
> Ảnh của $\sigma$ là projective variety trong $\mathbb{P}^{mn+m+n}$, và đây là tích đúng nghĩa trong phạm trù projective varieties.

> [!theorem] Theorem 2.19 — Tính chất universal của tích
> $X \times Y$ thoả mãn **tính chất universal** (universal property): với mọi variety $Z$ và morphisms $\phi: Z \to X$, $\psi: Z \to Y$, tồn tại morphism duy nhất $(\phi, \psi): Z \to X \times Y$ sao cho hai hình chiếu commute:
>
> $$
> \pi_X \circ (\phi, \psi) = \phi, \quad \pi_Y \circ (\phi, \psi) = \psi.
> $$

---

## Hàm Tử $\operatorname{Hom}$ và Điểm Functor

Một ý tưởng mạnh mẽ trong hình học đại số hiện đại: thay vì nghiên cứu variety $X$ trực tiếp, ta nghiên cứu **hàm tử điểm** (functor of points):

$$
h_X: (\text{Schemes}/k)^{\text{op}} \to \text{Sets}, \quad T \mapsto \operatorname{Hom}(T, X) = X(T).
$$

Với abelian variety $A$, tập $A(k)$ là nhóm các $k$-điểm — đây là nhóm mà ta quan tâm trong crypto. Trong bài 07 trở đi, ta sẽ phát triển ngôn ngữ này cho algebraic groups.

---

## SageMath Cheatsheet

```python
k = GF(97)
E = EllipticCurve(k, [1, 1])
P = E.random_point()
Q = E.random_point()

phi_neg = lambda P: -P
print(phi_neg(P))

n = 5
print(n * P)
```

```python
A2 = AffineSpace(QQ, 2, names='x,y')
x, y = A2.coordinate_ring().gens()
X = A2.curve(y^2 - x^3 - x - 1)
Y = A2.curve(y - x^2)

f = X.coordinate_ring()(x)
```

---

## Summary / Key Takeaways

- **Vành tọa độ** $k[X]$ mã hóa hoàn toàn thông tin của affine variety $X$: $X \cong Y \iff k[X] \cong k[Y]$.
- **Morphism**: map được định nghĩa locally bởi hàm chính quy — mỗi tọa độ đích là đa thức (hay phân thức hữu tỉ với mẫu không triệt tiêu).
- **Rational map** $X \dashrightarrow Y$: chỉ xác định trên tập mở dense. Trên smooth projective curve, mọi rational map kéo dài thành morphism.
- **Isomorphism**: morphism có nghịch đảo là morphism. Không phải mọi bijective morphism đều là isomorphism (ví dụ cuspidal cubic).
- **Product variety**: $X \times Y$ trong affine; $\mathbb{P}^m \times \mathbb{P}^n$ qua nhúng Segre trong projective.
- Trên $E$: các morphism $[-1]$, $[n]$, $t_Q$ đều là đại số — ta sẽ dùng chúng xuyên suốt.

---

## References

- Hartshorne, R. *Algebraic Geometry* (GTM 52), Chapter I §3–4.
- Silverman, J.H. *The Arithmetic of Elliptic Curves* (GTM 106), Chapters 2–3.
- Milne, J.S. *Algebraic Geometry* (v6.02), Chapter 2.
- Shafarevich, I.R. *Basic Algebraic Geometry* Vol. 1, Chapter 1 §5–6.
