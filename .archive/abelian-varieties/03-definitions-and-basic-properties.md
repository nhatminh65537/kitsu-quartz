---
title: "03. Definitions & Basic Properties"
tags: [math, abelian-varieties, lesson-03]
aliases: [Definitions and Basic Properties]
created: 2026-03-24
---

> **Prerequisites**: [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]]
> **Objectives**:
> - Hiểu định nghĩa group variety và abelian variety theo ngôn ngữ algebraic geometry
> - Nắm vững Rigidity Theorem và ứng dụng cốt lõi: mọi morphism bảo toàn identity đều là group homomorphism
> - Chứng minh abelian variety bắt buộc là commutative — một kết quả không hiển nhiên!
> - Hiểu translation maps $t_a$, tính homogeneous của abelian variety, và hệ quả

---

## Motivation / Intuition

Elliptic curve $E$ là ví dụ điển hình: đó là projective variety cùng một phép toán nhóm — cộng điểm — là algebraic morphism. Nhưng có một điều kỳ lạ: **commutativity** của phép cộng không hề được giả định — nó được suy ra! Đây không phải ngẫu nhiên.

Trực giác: variety **complete** (projective) rất "cứng nhắc". Một morphism từ complete variety sang affine variety buộc phải là constant. Điều này tạo ra một nguyên lý mạnh — **Rigidity** — nói rằng morphism từ product $A \times B$ (với $A$ complete) sang variety $C$ mà constant trên $A \times \{b_0\}$ thì gần như bị xác định hoàn toàn bởi hành vi trên $\{a_0\} \times B$. Từ đây suy ra commutativity của phép nhóm một cách tự động!

Lesson này đặt nền móng định nghĩa và chứng minh hai kết quả then chốt: Rigidity Theorem và commutativity.

---

## Group Varieties

### Định nghĩa

> [!abstract] Definition 3.1 — Group Variety (Giống nhóm)
> Một **group variety** (hay **algebraic group**) trên trường $k$ là một variety $G$ trên $k$ cùng với các morphisms:
>
> $$
> m : G \times G \to G \quad \text{(multiplication)}, \qquad
> \iota : G \to G \quad \text{(inversion)}, \qquad
> e : \operatorname{Spec}(k) \to G \quad \text{(identity)}
> $$
>
> thỏa các tiên đề nhóm theo nghĩa diagram commute trong category of varieties:
>
> - **Tính kết hợp**: $m \circ (m \times \operatorname{id}) = m \circ (\operatorname{id} \times m)$ (trong $G \times G \times G \to G$).
> - **Đơn vị trái/phải**: $m \circ (e \times \operatorname{id}) = \operatorname{id} = m \circ (\operatorname{id} \times e)$.
> - **Nghịch đảo**: $m \circ (\iota \times \operatorname{id}) \circ \Delta = e \circ p = m \circ (\operatorname{id} \times \iota) \circ \Delta$, trong đó $\Delta : G \to G \times G$ là diagonal và $p : G \to \operatorname{Spec}(k)$ là cấu trúc map.

Nói ngắn gọn: $G$ là **group object** trong category of varieties trên $k$.

> [!example] Example 3.2 — Các group varieties quen thuộc
> - **Additive group** $\mathbb{G}_a = \mathbb{A}^1$ với $m(x, y) = x + y$.
> - **Multiplicative group** $\mathbb{G}_m = \mathbb{A}^1 \setminus \{0\}$ với $m(x, y) = xy$.
> - **General linear group** $GL_n$: open subset của $\mathbb{A}^{n^2}$ (ma trận $n \times n$) với điều kiện $\det \neq 0$.
> - **Elliptic curve** $E$: projective variety genus 1 với một điểm phân biệt $O$, phép cộng điểm là morphism.
>
> Hai ví dụ đầu là **affine**. Elliptic curve là **projective** — và đây là điểm khởi đầu của abelian variety.

### Complete Varieties

Nhắc lại: một variety $V$ được gọi là **complete** nếu với mọi variety $W$, projection map $V \times W \to W$ là **closed map** (ảnh của closed set là closed). Đây là analog algebraic của compact trong topology.

Mọi projective variety là complete. Điều ngược lại không đúng nói chung, nhưng đối với group varieties thì sẽ đúng (định lý Chevalley và abelian varieties).

---

## Abelian Varieties: Định nghĩa Chính Thức

> [!abstract] Definition 3.3 — Abelian Variety (Giống Abel)
> Một **abelian variety** trên trường $k$ là một group variety $A$ trên $k$ thỏa:
>
> 1. $A$ là **complete** (như variety).
> 2. $A$ là **geometrically connected** (connected sau khi extend scalars sang $\bar{k}$).
>
> **Chiều** (dimension) của $A$ là chiều như variety, ký hiệu $g = \dim A$.

> [!note] Remark 3.4 — Commutativity không được giả định
> Định nghĩa **không** yêu cầu phép nhóm giao hoán. Đây là điều sẽ được *chứng minh* từ giả thiết completeness — đây là một trong những kết quả đẹp nhất của lý thuyết!

> [!note] Remark 3.5 — Smooth tự động
> Mọi group variety đều smooth tại điểm đơn vị $e$ (bởi tangent space tại $e$ hoàn toàn xác định nhờ tính homogeneous). Vì $G$ là homogeneous space dưới chính nó (translation maps là isomorphisms), $G$ smooth tại mọi điểm.

> [!example] Example 3.6 — Abelian varieties cơ bản
> - **$g = 1$**: Abelian varieties chiều 1 tương đương với **elliptic curves** (curve genus 1 với distinguished point).
> - **$g = 2$**: **Abelian surfaces** — có thể là Jacobian của curve genus 2, hoặc product của 2 elliptic curves.
> - **Jacobians**: Với curve $C$ genus $g$, $\operatorname{Pic}^0(C)$ có cấu trúc abelian variety chiều $g$ — đây là **Jacobian variety** $J(C)$.
> - **Tích**: Nếu $A$ chiều $m$ và $B$ chiều $n$ là abelian varieties, thì $A \times B$ chiều $m+n$ cũng là abelian variety.

---

## Rigidity Theorem

Đây là nền tảng của toàn bộ lý thuyết.

> [!abstract] Theorem 3.7 — Rigidity Theorem (Định lý Cứng nhắc)
> Cho $f : V \times W \to U$ là morphism của varieties, trong đó $V$ **complete** và $V \times W$ **geometrically irreducible**. Giả sử tồn tại các điểm $u_0 \in U(k)$, $v_0 \in V(k)$, $w_0 \in W(k)$ sao cho:
>
> $$
> f(V \times \{w_0\}) = \{u_0\} \quad \text{(f constant trên "lát" } V \times \{w_0\}\text{)}.
> $$
>
> Khi đó tồn tại morphism $g : W \to U$ sao cho $f(v, w) = g(w)$ với mọi $v \in V$, $w \in W$.
>
> Nói cách khác: **$f$ không phụ thuộc vào biến $v$**.

**Proof.**

Gọi $U_0$ là open affine neighbourhood của $u_0$ trong $U$. Đặt $Z = f^{-1}(U \setminus U_0)$ — đây là closed subset của $V \times W$. Xét projection $q : V \times W \to W$.

Vì $V$ complete, map $q$ là **closed** (tính chất định nghĩa của complete variety), nên $q(Z)$ là closed subset của $W$.

Do $f(V \times \{w_0\}) = \{u_0\} \subset U_0$, ta có $V \times \{w_0\} \cap Z = \emptyset$, tức là $w_0 \notin q(Z)$. Vậy $W_1 = W \setminus q(Z)$ là open dense subset của $W$ chứa $w_0$.

Với mỗi $w \in W_1$: $f(V \times \{w\}) \subset U_0$ (affine). Vì $V$ complete và $U_0$ affine, mọi morphism $V \to U_0$ phải constant (complete $\to$ affine $\Rightarrow$ constant). Vậy $f(v, w)$ không phụ thuộc $v$ với $w \in W_1$.

Kết hợp: $f(v, w) = f(v_0, w)$ với mọi $(v, w) \in V \times W_1$. Đặt $g_1 : W_1 \to U$, $g_1(w) = f(v_0, w)$. Vì $V \times W$ irreducible và hai morphisms $f$ và $(v, w) \mapsto g_1(w)$ đồng nhất trên open dense $V \times W_1$, chúng đồng nhất trên toàn bộ $V \times W$. $\blacksquare$

> [!tip] Insight
> **Trực giác hình học**: Khi $V$ là complete, một "thửa ruộng" $V \times \{w\}$ đủ "cứng" để không thể di chuyển liên tục sang $U$ mà không constant. Completeness ngăn chặn sự biến dạng phi tầm thường.

---

## Commutativity của Abelian Varieties

### Bước 1: Morphism bảo toàn identity là homomorphism

> [!abstract] Corollary 3.8 — Morphism bảo toàn $e$ là group homomorphism
> Cho $A, B$ là abelian varieties và $f : A \to B$ là morphism của varieties thỏa $f(0_A) = 0_B$ (bảo toàn điểm đơn vị). Khi đó $f$ là group homomorphism: $f(a + a') = f(a) + f(a')$ với mọi $a, a' \in A$.

**Proof.**

Xét morphism $h : A \times A \to B$ định nghĩa bởi:

$$
h(a, a') = f(a + a') - f(a) - f(a').
$$

Ta kiểm tra: $h(a, 0) = f(a) - f(a) - f(0) = 0$ và $h(0, a') = f(a') - f(0) - f(a') = 0$.

Vậy $h$ constant bằng $0$ trên $A \times \{0\}$ (lấy $w_0 = 0$, $u_0 = 0_B$). Theo Rigidity Theorem (áp dụng với $V = A$ complete, $W = A$), $h$ không phụ thuộc vào biến đầu, tức là $h(a, a') = h(0, a') = 0$.

Kết luận: $f(a + a') = f(a) + f(a')$ với mọi $a, a'$. $\blacksquare$

### Bước 2: Commutativity

> [!abstract] Theorem 3.9 — Abelian Varieties là Commutative
> Mọi abelian variety $A$ đều commutative: $a + b = b + a$ với mọi $a, b \in A$.

**Proof.**

Xét map nghịch đảo $\iota : A \to A$, $\iota(a) = -a$. Đây là morphism của varieties thỏa $\iota(0) = 0$.

Theo Corollary 3.8, $\iota$ là group homomorphism: $\iota(a + b) = \iota(a) + \iota(b)$, tức là:

$$
-(a + b) = (-a) + (-b).
$$

Trong nhóm tùy ý, $-(a+b) = -b - a$ (bằng cách nhân bên trái với $(a+b)^{-1}$). So sánh:

$$
-b - a = -a - b \implies b + a = a + b. \quad \blacksquare
$$

> [!note] Remark 3.10
> Đây là một kết quả rất đặc biệt trong algebraic geometry: **completeness buộc phép nhóm phải abelian**. Trong contrast, nhóm Lie compact (analog trong differential geometry) không cần commutative — $SO(3)$ là compact nhưng không commutative!
>
> Điều kiện then chốt là: nhóm Lie compact **algebraic** và **projective** (complete) thì buộc phải commutative. Completeness ngăn chặn "không gian" cần thiết để có phép nhân không giao hoán.

---

## Translation Maps và Homogeneity

> [!abstract] Definition 3.11 — Translation Map (Phép Tịnh Tiến)
> Với mỗi điểm $a \in A(k)$, **translation map** là:
>
> $$
> t_a : A \to A, \quad t_a(x) = x + a.
> $$
>
> Đây là isomorphism (với nghịch đảo $t_{-a}$) và là morphism của varieties (nhưng **không** là group homomorphism trừ khi $a = 0$).

> [!abstract] Proposition 3.12 — Abelian Variety là Homogeneous Space
> Với mọi $a, b \in A(k)$, translation map $t_{b-a} : A \to A$ là isomorphism gửi $a \mapsto b$. Vì vậy:
>
> 1. $A$ là **homogeneous** (hay **torsor dưới chính nó**): nhóm $A(k)$ tác động transitively lên $A$ qua translations.
> 2. $A$ smooth tại một điểm $\Leftrightarrow$ $A$ smooth tại mọi điểm.
> 3. Tangent bundle $T_{A/k}$ là **trivial**: $T_{A/k} \cong T_{A,0} \otimes_k \mathcal{O}_A$ (cùng fiber $T_{A,0}$ tại mọi điểm).

**Proof sketch của (3)**: Từ morphism nhóm $m : A \times A \to A$, lấy vi phân tại $(0, 0)$ cho $dm : T_{A,0} \oplus T_{A,0} \to T_{A,0}$. Vì phép nhóm là additive, $dm(u, v) = u + v$. Từ đó, section của tangent sheaf nhận được bằng cách "dịch" vector tiếp tuyến tại $0$ qua tất cả điểm — cho global sections. $\blacksquare$

> [!example] Example 3.13 — Elliptic curve: trivial tangent bundle
> Trên elliptic curve $E : y^2 = x^3 + ax + b$, tangent bundle $T_E$ trivial. Điều này tương đương với: $E$ có $1$-form holomorphic toàn cục không vanish — chính là $\omega = dx/y$ (Weierstrass differential form). Đây là lý do elliptic curves có genus $1$ (genus = $\dim H^0(E, \Omega^1_{E/k}) = 1$).

---

## Rational Maps vào Abelian Varieties

> [!abstract] Theorem 3.14 — Extension của Rational Maps
> Mọi rational map $f : V \dashrightarrow A$ từ nonsingular variety $V$ vào abelian variety $A$ mở rộng thành morphism (regular map) trên toàn $V$.

**Proof sketch.** Rational map $f$ xác định trên open dense $U \subset V$. Vì $A$ projective và $V$ nonsingular, locus nơi $f$ không xác định có codimension $\geq 2$. Nhưng một kết quả kỹ thuật (dùng group structure của $A$) cho phép mở rộng qua codimension-$1$ và sau đó qua codimension $\geq 2$ bằng Hartogs' theorem. $\blacksquare$

> [!abstract] Corollary 3.15 — Rational Maps từ Unirational Varieties là Constant
> Mọi rational map từ **unirational variety** $V$ vào abelian variety $A$ là constant.

**Proof.** Vì $V$ unirational, có dominant rational map $\mathbb{P}^n \dashrightarrow V$. Compose với $f : V \to A$ để được rational map $\mathbb{P}^n \dashrightarrow A$. Định lý cho rằng $\mathbb{P}^n \to A$ regular. Nhưng $H^0(\mathbb{P}^n, \mathcal{O}) = k$ (functions toàn cục trên $\mathbb{P}^n$ chỉ là constants), và $A$ projective, nên mọi morphism $\mathbb{P}^n \to A$ phải constant. $\blacksquare$

> [!warning] Counterexample 3.16 — Tại sao cần nonsingular?
> Nếu $V$ singular, Theorem 3.14 có thể thất bại. Ví dụ: node curve $C : y^2 = x^3 + x^2$ có normalization $\tilde{C} \cong \mathbb{P}^1$. Mọi map $\tilde{C} \to A$ là constant (theo Corollary 3.15), nhưng tồn tại rational map $C \dashrightarrow E$ (với $E$ elliptic curve) không mở rộng được qua điểm node.

---

## Simple Abelian Varieties

> [!abstract] Definition 3.17 — Simple Abelian Variety
> Abelian variety $A$ được gọi là **simple** (đơn giản) nếu nó không có proper nonzero abelian subvariety. Tức là subvariety $B \subset A$ là group subvariety $\Rightarrow$ $B = \{0\}$ hoặc $B = A$.

> [!abstract] Theorem 3.18 — Poincaré Complete Reducibility
> Mọi abelian variety $A$ isogenous với product $A_1^{n_1} \times \cdots \times A_r^{n_r}$ của các simple abelian varieties $A_i$ phân biệt. Phân tích này là duy nhất (up to isogeny và hoán vị thứ tự).

Khái niệm isogeny sẽ được định nghĩa chính xác ở Lesson 07. Tạm thời hiểu là "hầu như isomorphism" — morphism hữu hạn degree.

---

## SageMath Cheatsheet

```python
# Abelian variety chiều 1 = Elliptic curve
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
print("Elliptic curve:", E)
print("Dimension (genus):", 1)

# Kiểm tra commutativity: P + Q = Q + P
P = E([16, -61])
Q = E([-1, 4])
print("P + Q =", P + Q)
print("Q + P =", Q + P)
print("Commutative:", P + Q == Q + P)  # Luôn True
```

```python
# Translation map t_a: x -> x + a
# Với P = (16, -61) trên E
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P = E([16, -61])
Q = E([-1, 4])
R = E([0, 0])  # điểm khác

# t_P(Q) = Q + P
t_P_Q = Q + P
print("t_P(Q) = Q + P =", t_P_Q)

# Xác nhận: t_a là isomorphism (nghịch đảo là t_{-a})
neg_P = -P
t_negP_tPQ = t_P_Q + neg_P  # t_{-P}(t_P(Q)) = Q
print("t_{-P}(t_P(Q)) =", t_negP_tPQ)
print("Bằng Q:", t_negP_tPQ == Q)  # True
```

```python
# Abelian variety chiều 2: product của 2 elliptic curves
E1 = EllipticCurve(QQ, [1, 0])
E2 = EllipticCurve(QQ, [0, 1])

# A = E1 x E2 là abelian variety chiều 2
P1 = E1([0, 0])
P2 = E2.point([0, 1])
print("E1:", E1)
print("E2:", E2)
# Group law trên A = E1 x E2: (P1, P2) + (Q1, Q2) = (P1+Q1, P2+Q2)
Q1 = E1([0, 0])
Q2 = E2.point([0, 1])
sum_coords = (P1 + Q1, P2 + Q2)
print("(P1,P2) + (Q1,Q2) =", sum_coords)
```

```python
# Trivial tangent bundle: 1-form holomorphic không vanish trên E
# Đây là omega = dx/y trong Weierstrass form
E = EllipticCurve(QQ, [0, 0, 0, -1, 0])  # y^2 = x^3 - x
# Genus của elliptic curve luôn là 1
print("Genus:", E.genus())  # 1
# Điều này tương đương tangent bundle trivial
# H^0(E, Omega^1) = k (dim = 1 = genus)
```

---

## Summary / Key Takeaways

- **Group variety**: variety với morphisms $m, \iota, e$ thỏa tiên đề nhóm trong category of varieties.
- **Abelian variety**: group variety **complete** và **connected** — đây là định nghĩa thuần túy algebraic.
- **Rigidity Theorem**: morphism $f : V \times W \to U$ ($V$ complete) constant trên $V \times \{w_0\}$ $\Rightarrow$ $f$ không phụ thuộc $v$.
- **Corollary**: morphism $A \to B$ bảo toàn identity $\Rightarrow$ group homomorphism.
- **Commutativity**: inversion $\iota(a) = -a$ là group homomorphism $\Rightarrow$ $a + b = b + a$ — abelian variety **bắt buộc abelian**!
- **Translation maps** $t_a : x \mapsto x + a$: isomorphisms của varieties, làm $A$ thành homogeneous space.
- **Tangent bundle trivial**: $T_{A/k} \cong T_{A,0} \otimes \mathcal{O}_A$ — hệ quả trực tiếp của tính homogeneous.
- **Rational maps** $V \dashrightarrow A$ ($V$ nonsingular) mở rộng thành morphism — abelian variety "hút" mọi rational map.
- **Simple AV**: không có proper nonzero abelian subvariety. Mọi AV isogenous với product của simple AVs (Poincaré reducibility).

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §1 (Definitions, Rigidity Theorem).
- Mumford, D. *Abelian Varieties*, Chapter I §1–2.
- Debarre, O. *Two or Three Things I Know About Abelian Varieties*, §1.
- Conrad, B. *Abelian Varieties* (lecture notes, Stanford), §1.7.
