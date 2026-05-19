---
title: "01. Algebraic Geometry Prerequisites"
tags: [math, abelian-varieties, lesson-01]
aliases: [Algebraic Geometry Prerequisites]
created: 2026-03-24
---

> **Prerequisites**: Abstract Algebra (rings, modules, fields), quen thuộc với elliptic curves ở mức cơ bản
> **Objectives**:
> - Hiểu khái niệm sheaf và presheaf như một cách tổ chức "dữ liệu cục bộ" trên một không gian
> - Phân biệt line bundle, locally free sheaf, và invertible sheaf — và biết chúng thực chất là cùng một đối tượng
> - Nắm vững divisor (Weil và Cartier), sheaf $\mathcal{O}(D)$, và Picard group $\operatorname{Pic}(X)$
> - Hiểu cohomology sheaf ở mức khái niệm đủ để đọc các lesson tiếp theo

---

## Motivation / Intuition

Để học Abelian Varieties, bạn cần nói chuyện thoải mái bằng ngôn ngữ của algebraic geometry hiện đại. Ngôn ngữ đó xoay quanh ba từ khóa: **sheaf**, **line bundle**, và **cohomology**.

Tại sao lại cần những thứ này? Hãy nhớ lại elliptic curve $E$ — một đường cong bậc 3 trong $\mathbb{P}^2$. Bạn đã biết rằng $E(\bar{k})$ có cấu trúc nhóm Abel. Abelian variety là sự tổng quát hóa: một variety $A$ có cấu trúc nhóm Abel, nhưng có thể có chiều $g > 1$. Một abelian variety chiều $g = 2$ sống trong $\mathbb{P}^{15}$ — rất khó mô tả bằng phương trình tường minh. Thay vào đó, người ta mô tả $A$ qua các **line bundle** trên $A$ (tức là cách $A$ nhúng vào projective space), qua **cohomology** (một bất biến đo "độ phức tạp" của những line bundle đó), và qua **divisor** (subvariety codimension 1 — "hypersurface" trong $A$).

Lesson này là "bộ công cụ tối thiểu". Chúng ta sẽ không chứng minh mọi thứ từ đầu, mà tập trung vào *định nghĩa*, *ký hiệu*, và *trực giác* cần thiết.

---

## Sheaves và Presheaves

### Định nghĩa

Một **presheaf** (tiền bó) $\mathcal{F}$ trên không gian topo $X$ gán cho mỗi open set $U \subseteq X$ một nhóm Abel $\mathcal{F}(U)$ (gọi là **sections** trên $U$), cùng với các **restriction map**: với $V \subseteq U$, có map $\rho_{UV} : \mathcal{F}(U) \to \mathcal{F}(V)$ thỏa:

$$
\rho_{UU} = \operatorname{id}, \qquad \rho_{VW} \circ \rho_{UV} = \rho_{UW} \quad \text{với } W \subseteq V \subseteq U.
$$

Ta viết $s|_V$ thay cho $\rho_{UV}(s)$.

> [!abstract] Definition 1.1 — Sheaf (Bó)
> Một presheaf $\mathcal{F}$ được gọi là **sheaf** nếu thỏa hai điều kiện sau với mọi open cover $U = \bigcup_i U_i$:
>
> 1. **(Locality)** Nếu $s, t \in \mathcal{F}(U)$ thỏa $s|_{U_i} = t|_{U_i}$ với mọi $i$, thì $s = t$.
>
> 2. **(Gluing)** Nếu có $s_i \in \mathcal{F}(U_i)$ thỏa điều kiện dán khớp $s_i|_{U_i \cap U_j} = s_j|_{U_i \cap U_j}$ với mọi $i, j$, thì tồn tại duy nhất $s \in \mathcal{F}(U)$ với $s|_{U_i} = s_i$.

**Trực giác**: Sheaf là cách tổ chức "dữ liệu cục bộ nhất quán" trên $X$. Nếu bạn biết dữ liệu trên từng mảnh nhỏ $U_i$ và chúng khớp nhau ở phần giao, bạn có thể dán thành dữ liệu toàn cục trên $U$.

> [!example] Example 1.2 — Structure Sheaf của Variety
> Cho $X$ là một algebraic variety trên trường $k$. Định nghĩa **structure sheaf** $\mathcal{O}_X$ bởi:
>
> $$
> \mathcal{O}_X(U) = \{ f : U \to k \mid f \text{ là regular function trên } U \}.
> $$
>
> Đây là sheaf của regular functions. Restriction map là giới hạn hàm số: $f|_V$ chỉ là $f$ nhìn trên $V$.
>
> Cụ thể: nếu $X = \mathbb{A}^1$ (đường thẳng affine), thì $\mathcal{O}_X(\mathbb{A}^1) = k[x]$, và $\mathcal{O}_X(U) \supseteq k[x]$ với $U$ là open set thích hợp.

> [!note] Remark 1.3
> Một **ringed space** là cặp $(X, \mathcal{O}_X)$ gồm không gian topo $X$ và sheaf của rings $\mathcal{O}_X$ (không nhất thiết là functions). Algebraic varieties và schemes đều là ringed spaces. Stalk của $\mathcal{O}_X$ tại điểm $p$ là $\mathcal{O}_{X,p} = \varinjlim_{U \ni p} \mathcal{O}_X(U)$ — ring của "mầm hàm" tại $p$.

---

## Locally Free Sheaves và Line Bundles

### Khái niệm

> [!abstract] Definition 1.4 — Locally Free Sheaf
> Cho $(X, \mathcal{O}_X)$ là ringed space. Một **locally free sheaf** (bó tự do cục bộ) $\mathcal{E}$ rank $n$ là một $\mathcal{O}_X$-module thỏa: tồn tại open cover $\{U_i\}$ của $X$ sao cho
>
> $$
> \mathcal{E}|_{U_i} \cong \mathcal{O}_{U_i}^{\oplus n}.
> $$
>
> Khi $n = 1$, ta gọi $\mathcal{E}$ là **invertible sheaf** (bó khả nghịch) hay **line bundle**.

**Tại sao gọi là "khả nghịch"?** Bởi vì với mọi invertible sheaf $\mathcal{L}$, tồn tại $\mathcal{L}^{-1} = \mathcal{L}^\vee = \mathcal{H}om(\mathcal{L}, \mathcal{O}_X)$ sao cho $\mathcal{L} \otimes_{\mathcal{O}_X} \mathcal{L}^\vee \cong \mathcal{O}_X$. Đây chính xác là tính khả nghịch trong nhóm.

> [!abstract] Proposition 1.5 — Nhóm Picard (Picard Group)
> Tập các isomorphism classes của invertible sheaves trên $X$, với phép toán là tensor product $\otimes_{\mathcal{O}_X}$, tạo thành một nhóm Abel gọi là **Picard group**, ký hiệu $\operatorname{Pic}(X)$.
>
> Phần tử đơn vị là $[\mathcal{O}_X]$, và nghịch đảo của $[\mathcal{L}]$ là $[\mathcal{L}^\vee]$.

> [!example] Example 1.6 — Picard Group của $\mathbb{P}^1$
> Với $\mathbb{P}^1_k$ (đường thẳng projective), mọi invertible sheaf có dạng $\mathcal{O}(n)$ với $n \in \mathbb{Z}$. Cụ thể:
>
> $$
> \operatorname{Pic}(\mathbb{P}^1_k) \cong \mathbb{Z}, \quad [\mathcal{O}(n)] \leftrightarrow n.
> $$
>
> Sheaf $\mathcal{O}(1)$ có global sections $x_0, x_1$ (tọa độ đồng nhất), và map $[x_0 : x_1] \mapsto [x_0 : x_1]$ chính là identity map $\mathbb{P}^1 \to \mathbb{P}^1$. Sheaf $\mathcal{O}(-1)$ là "tautological line bundle" — không có global section nào ngoài $0$.
>
> Với elliptic curve $E$, $\operatorname{Pic}(E) \cong \mathbb{Z} \times E(k)$: phần $\mathbb{Z}$ ghi degree, phần $E(k)$ là degree-0 part — đây là abelian variety $\operatorname{Pic}^0(E) = E$!

---

## Divisors

### Weil Divisors và Cartier Divisors

Trên một variety $X$ nguyên, **Weil divisor** (ước tử Weil) là tổ hợp hình thức của các irreducible closed subvariety codimension 1:

$$
D = \sum_{Y} n_Y [Y], \quad n_Y \in \mathbb{Z}, \text{ hầu hết } n_Y = 0.
$$

Tập tất cả Weil divisors lập thành nhóm Abel $\operatorname{Div}(X)$, với phép cộng là tổng hình thức.

> [!abstract] Definition 1.7 — Cartier Divisor
> Một **Cartier divisor** trên $X$ là một class trong $H^0(X, \mathcal{K}_X^* / \mathcal{O}_X^*)$, trong đó $\mathcal{K}_X^*$ là sheaf của rational functions khác 0. Tương đương, Cartier divisor là dữ liệu:
>
> - Một open cover $\{U_i\}$ của $X$
> - Rational functions $f_i \in \mathcal{K}^*(U_i)$ trên mỗi $U_i$
> - Thỏa $f_i / f_j \in \mathcal{O}_X^*(U_i \cap U_j)$ (tức là $f_i/f_j$ regular và khác 0)
>
> modulo quan hệ tương đương: $(U_i, f_i) \sim (U_i, g_i)$ nếu $f_i / g_i \in \mathcal{O}_X^*(U_i)$.

> [!note] Remark 1.8 — Weil vs. Cartier
> Trên variety **nonsingular** (smooth), mọi Weil divisor đều là Cartier và ngược lại. Trong khóa học này, hầu hết các variety sẽ là smooth, nên ta có thể dùng "divisor" để chỉ cả hai khái niệm đồng nhất.

**Divisors từ rational functions.** Với rational function $f \in k(X)^*$, định nghĩa **principal divisor**:

$$
\operatorname{div}(f) = \sum_{Y} v_Y(f) [Y],
$$

trong đó $v_Y(f)$ là bội số (order of vanishing) của $f$ dọc theo $Y$. Giá trị dương = zeros, âm = poles.

> [!abstract] Definition 1.9 — Linear Equivalence và Sheaf $\mathcal{O}(D)$
> Hai divisors $D, D'$ được gọi là **linearly equivalent** (tương đương tuyến tính), ký hiệu $D \sim D'$, nếu $D - D' = \operatorname{div}(f)$ với $f \in k(X)^*$.
>
> Với một Cartier divisor $D$, **sheaf** $\mathcal{O}_X(D)$ được định nghĩa bởi:
>
> $$
> \mathcal{O}_X(D)(U) = \{ f \in k(X)^* \mid \operatorname{div}(f)|_U + D|_U \geq 0 \} \cup \{0\}.
> $$

> [!abstract] Theorem 1.10 — Divisors và Picard Group
> Trên variety smooth, tồn tại isomorphism nhóm:
>
> $$
> \operatorname{Pic}(X) \cong \{ \text{Cartier divisors} \} / \{ \text{principal divisors} \}.
> $$
>
> Cụ thể: $D \mapsto [\mathcal{O}_X(D)]$ là map đồng cấu, và $[\mathcal{O}_X(D)] = [\mathcal{O}_X(D')]$ khi và chỉ khi $D \sim D'$.

**Proof sketch.** Chiều $D \mapsto \mathcal{O}_X(D)$ là well-defined: nếu $D \sim D'$ thì $D' = D + \operatorname{div}(f)$, và nhân với $f$ cho isomorphism $\mathcal{O}_X(D) \cong \mathcal{O}_X(D')$. Chiều ngược: cho $\mathcal{L}$ invertible sheaf, chọn rational section $s$ của $\mathcal{L}$, thì $D = \operatorname{div}(s)$ là divisor thỏa $\mathcal{O}_X(D) \cong \mathcal{L}$. $\blacksquare$

> [!example] Example 1.11 — Ví dụ trên elliptic curve $E$
> Cho $E : y^2 = x^3 - x$ trên $\mathbb{Q}$, với điểm gốc $O = [0:1:0]$. Cho $P = (0, 0)$ là điểm khác trên $E$.
>
> - Divisor $D = [P] - [O]$ là Cartier divisor degree $0$.
> - Sheaf $\mathcal{O}_E([P] - [O])$ là invertible sheaf degree $0$.
> - $D \sim 0$ khi và chỉ khi $P = O$ trong nhóm $E(k)$ — và điều này xảy ra khi $P$ là identity!
>
> Đây chính là lý do $\operatorname{Pic}^0(E) \cong E(k)$ như nhóm: mỗi point trên $E$ ứng với một line bundle degree $0$.

---

## Global Sections và Cohomology Cơ Bản

### Global sections

Với invertible sheaf $\mathcal{L}$ trên $X$, tập các **global sections**:

$$
H^0(X, \mathcal{L}) = \mathcal{L}(X)
$$

là một $k$-vector space. Kích thước $h^0(X, \mathcal{L}) = \dim_k H^0(X, \mathcal{L})$ đo "số lượng function với poles được phép bởi $\mathcal{L}$".

> [!abstract] Definition 1.12 — Ample Line Bundle
> Một invertible sheaf $\mathcal{L}$ trên projective variety $X$ được gọi là:
>
> - **Very ample**: nếu các global sections của $\mathcal{L}$ xác định một embedding $X \hookrightarrow \mathbb{P}^n$ (tức là $X \cong$ ảnh của map $x \mapsto [s_0(x) : \cdots : s_n(x)]$).
> - **Ample**: nếu $\mathcal{L}^{\otimes m}$ là very ample với $m \gg 0$.

Ample line bundle là chìa khóa để nhúng AV vào projective space — Lesson 06 sẽ đi sâu vào điều này.

### Cohomology sheaf

Để đọc các định lý về AV, bạn cần biết ký hiệu $H^i(X, \mathcal{F})$ là gì. Đây là **sheaf cohomology** — các bất biến đo "trở ngại" khi dán sections cục bộ thành sections toàn cục.

> [!abstract] Definition 1.13 — Cohomology Groups $H^i(X, \mathcal{F})$
> Với sheaf $\mathcal{F}$ trên variety $X$, tồn tại chuỗi $k$-vector spaces $H^i(X, \mathcal{F})$ với $i \geq 0$ sao cho:
>
> 1. $H^0(X, \mathcal{F}) = \mathcal{F}(X)$ (global sections).
> 2. Với mỗi short exact sequence $0 \to \mathcal{F} \to \mathcal{G} \to \mathcal{H} \to 0$, có long exact sequence:
>
> $$
> 0 \to H^0(X,\mathcal{F}) \to H^0(X,\mathcal{G}) \to H^0(X,\mathcal{H}) \to H^1(X,\mathcal{F}) \to \cdots
> $$
>
> 3. $H^i(X, \mathcal{F}) = 0$ với mọi $i > \dim X$ (khi $X$ affine hoặc projective variety).

> [!note] Remark 1.14 — Ý nghĩa trực giác
> - $H^0$: sections toàn cục — "đo số lượng function global".
> - $H^1$: "trở ngại để dán sections cục bộ thành global" — đo "twist" của bundle.
> - Trên curve $C$ genus $g$: $\dim H^1(C, \mathcal{O}_C) = g$. Đây là lý do tại sao genus xuất hiện khắp nơi!

> [!abstract] Theorem 1.15 — Riemann–Roch cho Curves (dạng đơn giản)
> Cho $C$ curve nonsingular, projective, genus $g$, và $\mathcal{L} = \mathcal{O}_C(D)$ line bundle ứng với divisor $D$ degree $d$. Khi đó:
>
> $$
> \chi(C, \mathcal{L}) := h^0(C, \mathcal{L}) - h^1(C, \mathcal{L}) = d - g + 1.
> $$

**Ứng dụng ngay**: Với elliptic curve $E$ (genus $g=1$) và $D = n[O]$ ($n$ lần điểm gốc):
- $n = 1$: $\chi = 1$, $h^0 = 1$, $h^1 = 1$. Chỉ có constant sections.
- $n = 2$: $\chi = 2$, $h^0 = 2$, $h^1 = 0$.
- $n = 3$: $\chi = 3$, $h^0 = 3$. Ba sections cho ta embedding $E \hookrightarrow \mathbb{P}^2$ — đây chính là cách đưa $E$ về phương trình Weierstrass!

---

## Pullback và Pushforward của Sheaves

Với morphism $f : X \to Y$ và sheaf $\mathcal{F}$ trên $X$, sheaf $\mathcal{G}$ trên $Y$:

- **Pushforward** $f_* \mathcal{F}$: sheaf trên $Y$ với $(f_* \mathcal{F})(U) = \mathcal{F}(f^{-1}(U))$.
- **Pullback** $f^* \mathcal{G}$: sheaf trên $X$, xây dựng qua sheafification của $U \mapsto \mathcal{G}(f(U))$.

Quan trọng: với invertible sheaf $\mathcal{L}$ trên $Y$, pullback $f^* \mathcal{L}$ là invertible sheaf trên $X$, và $f^* : \operatorname{Pic}(Y) \to \operatorname{Pic}(X)$ là group homomorphism. Điều này sẽ xuất hiện liên tục khi ta xét translation maps $t_a : A \to A$ trên abelian variety.

---

## SageMath Cheatsheet

```python
# Elliptic curve và divisors
E = EllipticCurve([0, -1, 1, -10, -10])  # ví dụ đường cong
P = E([16, -61])
Q = E([0, -1, 1])  # điểm gốc O ở vô cực

# Picard group của P^1: chỉ cần đếm degree
# Trên projective space, invertible sheaves là O(n)
R.<x, y, z> = QQ[]
P1 = ProjectiveSpace(QQ, 1)
# Divisors trên P1: điểm là divisor bậc 1
pt = P1.subscheme([x])  # điểm [0:1]

# Cohomology thông qua Riemann-Roch trên curve
E2 = EllipticCurve(GF(17), [1, 2])
print(E2.order())  # |E(F_17)| tính qua trace of Frobenius

# Genus của curve
C = HyperellipticCurve(QQ, x^5 - x)
print(C.genus())  # genus = 2 (vì degree 5)
```

```python
# Tính H^0 (global sections) qua Riemann-Roch
# Với line bundle O(D) degree d trên curve genus g:
def riemann_roch_h0(d, g):
    """Trả về h^0 theo Riemann-Roch (khi d > 2g-2)."""
    if d > 2*g - 2:
        return d - g + 1
    elif d < 0:
        return 0
    else:
        return None  # cần thêm thông tin

for d in range(-1, 6):
    h0 = riemann_roch_h0(d, g=1)  # elliptic curve genus 1
    print(f"d={d}: h^0 = {h0}")
# Output: d=0: 1, d=1: 1, d=2: 2, d=3: 3, ...
```

---

## Summary / Key Takeaways

- **Sheaf** $\mathcal{F}$ trên $X$: gán sections $\mathcal{F}(U)$ cho mỗi open $U$, thỏa locality và gluing.
- **Structure sheaf** $\mathcal{O}_X$: sheaf của regular functions; là nền tảng của ngôn ngữ ringed space.
- **Locally free sheaf rank 1** = **invertible sheaf** = **line bundle** — ba tên cùng một đối tượng.
- **Picard group** $\operatorname{Pic}(X)$: nhóm của line bundles dưới tensor product; isomorphic với nhóm Cartier divisors modulo principal divisors.
- **Divisor** $D$ xác định sheaf $\mathcal{O}_X(D)$; hai divisors linearly equivalent $\Leftrightarrow$ sheaves isomorphic.
- **Ample** line bundle: đủ sections để nhúng vào projective space.
- **$H^0(X, \mathcal{L})$**: global sections — "đếm functions cho phép poles theo $\mathcal{L}$".
- **Riemann–Roch**: $h^0(\mathcal{L}) - h^1(\mathcal{L}) = \deg(\mathcal{L}) - g + 1$ trên curve.
- **Pullback** $f^* : \operatorname{Pic}(Y) \to \operatorname{Pic}(X)$ là group homomorphism — sẽ dùng liên tục với translation maps của AV.

---

## References

- Hartshorne, R. *Algebraic Geometry*, Chapter II (Sheaves, Divisors, Projective Morphisms).
- Milne, J.S. *Algebraic Geometry*, Chapters 8–13. jmilne.org/math
- Vakil, R. *Foundations of Algebraic Geometry*, Classes 18–23. math.stanford.edu/~vakil
- Milne, J.S. *Abelian Varieties* (v2.0), §1 (sử dụng làm reference chính).
