---
title: "05. Theorem of the Cube & Square"
tags: [math, abelian-varieties, lesson-05]
aliases: [Theorem of the Cube and Square]
created: 2026-03-24
---

> **Prerequisites**: [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]], [[03-definitions-and-basic-properties|03. Definitions & Basic Properties]]
> **Objectives**:
> - Hiểu và phát biểu Seesaw Principle (nguyên lý cưa xẻ) — nền tảng kỹ thuật
> - Nắm vững Theorem of the Cube với phát biểu đầy đủ và ý nghĩa hình học
> - Suy ra Theorem of the Square và các hệ quả quan trọng trên abelian variety
> - Tính $[n]^* \mathcal{L}$ theo $\mathcal{L}$ — hệ quả cốt lõi cho Lesson 06 và 08

---

## Motivation / Intuition

Khi làm việc với line bundles trên abelian variety $A$, câu hỏi tự nhiên là: **một line bundle cụ thể có trivial không?** Điều này rất quan trọng vì "trivial" $\Leftrightarrow$ "bằng $0$ trong $\operatorname{Pic}(A)$".

Theorem of the Cube là công cụ trả lời câu hỏi này. Ý tưởng: trên product $X \times Y \times Z$ (với $X, Y$ complete), nếu một line bundle trivial trên *ba mặt* (mỗi cặp $\{x_0\} \times Y \times Z$, $X \times \{y_0\} \times Z$, $X \times Y \times \{z_0\}$), thì nó trivial trên toàn bộ. Đây là analog cho line bundles của Rigidity Theorem cho morphisms.

Từ Theorem of the Cube, ta suy ra **Theorem of the Square**: với line bundle $\mathcal{L}$ trên abelian variety $A$, translation map tương tác với $\mathcal{L}$ theo quy luật rất cụ thể. Và từ đó, ta tính được $[n]^* \mathcal{L}$ — pullback của $\mathcal{L}$ qua nhân với $n$. Công thức này sẽ xuất hiện trong toàn bộ phần còn lại của khóa học.

---

## Seesaw Principle

Trước khi đi vào Theorem of the Cube, ta cần một lemma kỹ thuật quan trọng.

> [!abstract] Theorem 5.1 — Seesaw Principle (Nguyên lý Cưa xẻ)
> Cho $V$ là complete variety và $T$ là variety tùy ý. Cho $\mathcal{L}$ là invertible sheaf trên $V \times T$. Nếu $\mathcal{L}|_{V \times \{t\}}$ trivial với mọi $t \in T$, thì tồn tại duy nhất invertible sheaf $\mathcal{N}$ trên $T$ sao cho:
>
> $$
> \mathcal{L} \cong q^* \mathcal{N},
> $$
>
> trong đó $q : V \times T \to T$ là projection. Nói cách khác, $\mathcal{L}$ "đến từ $T$".

**Proof sketch.** Vì mỗi fiber $\mathcal{L}|_{V \times \{t\}}$ trivial, $H^0(V, \mathcal{L}|_{V \times \{t\}})$ là không gian $1$-chiều. Theo lý thuyết base change, $q_* \mathcal{L}$ là line bundle $\mathcal{N}$ trên $T$. Map tự nhiên $q^* q_* \mathcal{L} \to \mathcal{L}$ là isomorphism vì nó là isomorphism trên mỗi fiber. $\blacksquare$

> [!abstract] Corollary 5.2 — Seesaw Corollary
> Với cùng giả thiết, nếu ngoài ra $\mathcal{L}|_{\{v_0\} \times T}$ trivial với một điểm $v_0 \in V(k)$, thì $\mathcal{L} \cong \mathcal{O}_{V \times T}$ trivial.

**Proof.** Từ Theorem 5.1, $\mathcal{L} \cong q^* \mathcal{N}$. Restrict về $\{v_0\} \times T$: $\mathcal{L}|_{\{v_0\} \times T} \cong \mathcal{N}$. Nhưng giả thiết cho $\mathcal{L}|_{\{v_0\} \times T}$ trivial, nên $\mathcal{N} \cong \mathcal{O}_T$, và $\mathcal{L} \cong q^* \mathcal{O}_T \cong \mathcal{O}_{V \times T}$. $\blacksquare$

> [!note] Remark 5.3 — Tại sao gọi là "cưa xẻ"?
> Hãy hình dung $V \times T$ như một "seesaw" (cưa xẻ). Nếu một đầu ($V$-fiber) cân bằng (trivial), toàn bộ weight phải nằm ở đầu kia ($T$). Corollary nói: nếu cả hai đầu đều cân bằng, thì cả cưa xẻ cân bằng.

---

## Theorem of the Cube

> [!abstract] Theorem 5.4 — Theorem of the Cube (Định lý Khối Lập Phương)
> Cho $U$, $V$, $W$ là các complete varieties trên $k$ với base points $u_0 \in U(k)$, $v_0 \in V(k)$, $w_0 \in W(k)$. Cho $\mathcal{L}$ là invertible sheaf trên $U \times V \times W$. Nếu các restrictions sau đều trivial:
>
> $$
> \mathcal{L}|_{\{u_0\} \times V \times W} \cong \mathcal{O}, \quad
> \mathcal{L}|_{U \times \{v_0\} \times W} \cong \mathcal{O}, \quad
> \mathcal{L}|_{U \times V \times \{w_0\}} \cong \mathcal{O},
> $$
>
> thì $\mathcal{L} \cong \mathcal{O}_{U \times V \times W}$ trivial trên toàn bộ product.

**Proof sketch.**

**Bước 1** (dùng Seesaw): Vì $\mathcal{L}|_{U \times V \times \{w_0\}}$ trivial, Seesaw Principle cho rằng đủ để chứng minh $\mathcal{L}|_{u \times W}$ trivial với một tập dense $u \in U \times V$.

**Bước 2** (reduction về curve): Bằng kỹ thuật "connected curve through two points" (mọi hai điểm trên variety irreducible smooth nối được bởi curve irreducible), ta reduce về trường hợp $U$ là complete curve.

**Bước 3** (trường hợp curve): Khi $U$ là complete curve, $\mathcal{L}|_{U \times \{v_0\} \times W}$ trivial và $\mathcal{L}|_{\{u_0\} \times V \times W}$ trivial cho phép dùng một đối số degree để chứng minh trivialness. (Chứng minh kỹ thuật hơn, xem Mumford §6.)

Xem chứng minh đầy đủ tại [[a0-proof-of-theorem-of-the-cube|A0. Proof of the Theorem of the Cube]]. $\blacksquare$

> [!tip] Cách nhớ Theorem of the Cube
> Gọi ba "mặt" là $F_U = \{u_0\} \times V \times W$, $F_V = U \times \{v_0\} \times W$, $F_W = U \times V \times \{w_0\}$. Định lý nói: trivial trên cả 3 mặt $\Rightarrow$ trivial trên khối lập phương $U \times V \times W$.

---

## Theorem of the Square và Hệ Quả

### Dạng chung nhất: công thức cho 3 morphisms

> [!abstract] Corollary 5.5 — Công thức cho 3 morphisms
> Cho $A$ là abelian variety, $X$ là variety tùy ý, và $f, g, h : X \to A$ là morphisms. Với mọi $\mathcal{L} \in \operatorname{Pic}(A)$:
>
> $$
> (f + g + h)^* \mathcal{L} \otimes (f+g)^* \mathcal{L}^{-1} \otimes (f+h)^* \mathcal{L}^{-1} \otimes (g+h)^* \mathcal{L}^{-1} \otimes f^* \mathcal{L} \otimes g^* \mathcal{L} \otimes h^* \mathcal{L} \cong \mathcal{O}_X.
> $$

**Proof.** Áp dụng Theorem of the Cube cho sheaf $\mathcal{M}$ trên $A \times A \times A$ định nghĩa bởi vế trái (khi $X = A \times A \times A$ và $f, g, h$ là projections), rồi pullback qua $(f, g, h) : X \to A \times A \times A$. $\blacksquare$

Lấy $h = 0$ (constant map về $0 \in A$) trong Corollary 5.5:

> [!abstract] Theorem 5.6 — Theorem of the Square (Định lý Hình Vuông)
> Cho $A$ là abelian variety, $\mathcal{L} \in \operatorname{Pic}(A)$, và $a, b \in A(k)$ là các điểm. Ký hiệu $t_a : A \to A$ là translation by $a$. Thì:
>
> $$
> t_{a+b}^* \mathcal{L} \otimes \mathcal{L} \cong t_a^* \mathcal{L} \otimes t_b^* \mathcal{L}.
> $$

**Proof.** Trong Corollary 5.5, đặt $X = \operatorname{Spec}(k)$, $f$ là constant map về $a$, $g$ về $b$, $h = 0$. Khi đó $f + g + h = a + b$, $f + g = a + b$, $f + h = a$, $g + h = b$, $f^* \mathcal{L} = t_a^* \mathcal{L}|_{?}$... Cụ thể hơn, áp dụng với $f = \text{id}_A$, $g = $ const $a$, $h = $ const $b$:

$$
({\rm id} + a + b)^* \mathcal{L} \otimes ({\rm id}+a)^* \mathcal{L}^{-1} \otimes \cdots \cong \mathcal{O}.
$$

Sau khi simplify (vì $h = b$ là constant và $f = \mathrm{id}$), ta được đúng công thức trên. $\blacksquare$

> [!tip] Ý nghĩa của Theorem of the Square
> Định nghĩa map $\phi_\mathcal{L} : A \to \operatorname{Pic}(A)$ bởi $\phi_\mathcal{L}(a) = t_a^* \mathcal{L} \otimes \mathcal{L}^{-1}$.
>
> Theorem of the Square nói chính xác rằng **$\phi_\mathcal{L}$ là group homomorphism**:
>
> $$
> \phi_\mathcal{L}(a + b) = t_{a+b}^* \mathcal{L} \otimes \mathcal{L}^{-1} \cong (t_a^* \mathcal{L} \otimes \mathcal{L}^{-1}) \otimes (t_b^* \mathcal{L} \otimes \mathcal{L}^{-1}) = \phi_\mathcal{L}(a) \otimes \phi_\mathcal{L}(b).
> $$
>
> Map $\phi_\mathcal{L} : A \to A^\vee$ (với target là dual abelian variety, Lesson 08) là một trong những đối tượng trung tâm của toàn bộ lý thuyết.

---

## Pullback qua Nhân với $n$

Hệ quả đẹp nhất của Theorem of the Square là công thức tính $[n]^* \mathcal{L}$:

> [!abstract] Theorem 5.7 — Công thức $[n]^* \mathcal{L}$
> Cho $A$ abelian variety, $\mathcal{L} \in \operatorname{Pic}(A)$, và $n \in \mathbb{Z}$. Thì:
>
> $$
> [n]^* \mathcal{L} \cong \mathcal{L}^{\otimes \frac{n^2+n}{2}} \otimes [-1]^* \mathcal{L}^{\otimes \frac{n^2-n}{2}}.
> $$
>
> Trong hai trường hợp đặc biệt:
>
> - Nếu $\mathcal{L}$ là **symmetric** ($[-1]^* \mathcal{L} \cong \mathcal{L}$): $\quad [n]^* \mathcal{L} \cong \mathcal{L}^{\otimes n^2}$.
> - Nếu $\mathcal{L} \in \operatorname{Pic}^0(A)$ ($[-1]^* \mathcal{L} \cong \mathcal{L}^{-1}$): $\quad [n]^* \mathcal{L} \cong \mathcal{L}^{\otimes n}$.

**Proof** (bằng induction). Đặt $\mathcal{L}_n = [n]^*\mathcal{L}$. Áp dụng Corollary 5.5 với $f = [n], g = [1], h = [-1]$ (tức là id, $1$, $-1$):

$$
[n+1]^* \mathcal{L} \otimes [n]^* \mathcal{L}^{-1} \otimes [n-1]^* \mathcal{L}^{-1} \otimes [n]^* \mathcal{L}^{-1} \otimes [n]^*\mathcal{L} \otimes \mathcal{L} \otimes [-1]^*\mathcal{L} \cong \mathcal{O}.
$$

Simplify: $\mathcal{L}_{n+1} \cong \mathcal{L}_n^{\otimes 2} \otimes \mathcal{L}_{n-1}^{-1} \otimes \mathcal{L} \otimes [-1]^*\mathcal{L}$.

Từ đây induct: base case $\mathcal{L}_0 = \mathcal{O}$, $\mathcal{L}_1 = \mathcal{L}$, $\mathcal{L}_{-1} = [-1]^*\mathcal{L}$. $\blacksquare$

> [!example] Example 5.8 — Elliptic curve
> Trên elliptic curve $E$ với ample line bundle $\mathcal{L} = \mathcal{O}_E(n_0 [O])$ ($n_0$ bội số của điểm gốc), $\mathcal{L}$ là symmetric. Vậy:
>
> $$
> [n]^* \mathcal{L} \cong \mathcal{L}^{\otimes n^2} = \mathcal{O}_E(n^2 n_0 [O]).
> $$
>
> Cụ thể với $n = 2$: $[2]^* \mathcal{L} \cong \mathcal{L}^{\otimes 4}$. Đây là cách tính pullback của line bundle qua doubling map!

> [!example] Example 5.9 — Degree của $[n]_A$
> Vì $[n]^* \mathcal{L} \cong \mathcal{L}^{\otimes n^2}$ (với $\mathcal{L}$ ample symmetric) và degree của morphism tỉ lệ với $(n^2)^g$ (theo lý thuyết intersection theory), ta có:
>
> $$
> \deg([n]_A) = n^{2g}.
> $$
>
> Kết quả này sẽ được dùng trong Lesson 07 để tính $|A[n]|$.

---

## $\operatorname{Pic}^0(A)$: Subgroup Đặc Biệt

> [!abstract] Definition 5.10 — $\operatorname{Pic}^0(A)$
> Với abelian variety $A$, định nghĩa:
>
> $$
> \operatorname{Pic}^0(A) = \{ \mathcal{L} \in \operatorname{Pic}(A) \mid t_a^* \mathcal{L} \cong \mathcal{L} \text{ với mọi } a \in A(\bar{k}) \} = \ker(\phi_\mathcal{L}).
> $$
>
> Equivalently, $\mathcal{L} \in \operatorname{Pic}^0(A)$ khi và chỉ khi $[-1]^* \mathcal{L} \cong \mathcal{L}^{-1}$ (anti-symmetric).

Đây là nhóm các line bundles "translation-invariant" — chúng sẽ tạo thành **dual abelian variety** $A^\vee$ (Lesson 08).

> [!abstract] Proposition 5.11 — $\operatorname{Pic}^0(A)$ và Néron–Severi Group
> Có short exact sequence:
>
> $$
> 0 \to \operatorname{Pic}^0(A) \to \operatorname{Pic}(A) \to \operatorname{NS}(A) \to 0,
> $$
>
> trong đó **Néron–Severi group** $\operatorname{NS}(A) = \operatorname{Pic}(A) / \operatorname{Pic}^0(A)$ là nhóm discrete (thực ra là free abelian của finite rank). Ample line bundles nằm trong $\operatorname{NS}(A)$ với $\phi_\mathcal{L} \neq 0$.

---

## Symmetric Line Bundles

> [!abstract] Corollary 5.12 — Tồn tại Symmetric Ample Line Bundle
> Mọi abelian variety $A$ đều có **symmetric ample invertible sheaf**: tồn tại $\mathcal{L}$ ample với $[-1]^* \mathcal{L} \cong \mathcal{L}$.

**Proof.** Chọn ample $\mathcal{M}$ (tồn tại vì $A$ projective — sẽ chứng minh Lesson 06). Khi đó $\mathcal{M} \otimes [-1]^* \mathcal{M}$ là tensor của hai ample $\Rightarrow$ ample, và symmetric: $[-1]^*(\mathcal{M} \otimes [-1]^*\mathcal{M}) \cong [-1]^*\mathcal{M} \otimes \mathcal{M}$. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Theorem of the Square: t_{a+b}^* L ⊗ L ≅ t_a^* L ⊗ t_b^* L
# Trên elliptic curve, điều này tương đương với công thức cộng divisors
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P = E([16, -61])
Q = E([-1, 4])

# Divisors: [P] - [O] và [Q] - [O] trong Pic^0(E)
# t_P^* O([O]) = O([P]), vì translation dịch chuyển điểm zero
# Theorem of the Square: O([P+Q]) ≅ O([P]) ⊗ O([Q]) ⊗ O([-O])
# Tức là: [P+Q] ~ [P] + [Q] - [O] (tương đương tuyến tính)

# Kiểm tra cộng điểm
R = P + Q
print(f"P = {P}")
print(f"Q = {Q}")
print(f"P + Q = {R}")
```

```python
# Công thức [n]^* L ≅ L^{n^2} với L symmetric
# Trên E, [n] là "nhân với n" - kiểm tra bằng order
E = EllipticCurve(GF(101), [1, 2])

# Điểm sinh
P = E.gens()[0]
print(f"Generator P = {P}")
print(f"Order of P = {P.order()}")

# [n](P) = n*P
for n in [2, 3, 4]:
    nP = n * P
    print(f"[{n}]P = {nP}")

# Degree của [n]: deg([n]) = n^{2g} = n^2 (g=1)
# |E[n]| = n^2 trên algebraically closed field
for n in [2, 3, 5]:
    print(f"Degree của [{n}]_E = {n**2}")
```

```python
# Pic^0 trên elliptic curve
# E(k) ≅ Pic^0(E) qua P ↦ [P] - [O]
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
O = E(0)  # điểm gốc (point at infinity)
P = E([16, -61])
Q = E([-1, 4])

# Cộng trong Pic^0(E) ≅ E(Q)
P_plus_Q_in_Pic0 = P + Q  # = R trong E(Q)
print(f"[P] + [Q] - [O] trong Pic^0 ứng với điểm: {P_plus_Q_in_Pic0}")

# Anti-symmetric: [-1]^* ([P]-[O]) = [-P]-[O] = [-1](P) - O
neg_P = -P
print(f"-P = {neg_P}")
# Vì [-1]^* L = L^{-1} trong Pic^0, đây là inverse trong nhóm
```

```python
# Kiểm tra Theorem of the Square dạng số
# t_{a+b}^* L ≅ t_a^* L ⊗ t_b^* L trong Pic
# Trên E, điều này nói: [P+Q+R] ~ [P+R] + [Q+R] - [R] (với R cố định)
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P = E([16, -61])
Q = E([-1, 4])
R = E([0, 1, 1])  # điểm ngẫu nhiên khác

# Theorem of the Square: t_{P+Q}^* L ⊗ L ~ t_P^* L ⊗ t_Q^* L
# Tương đương: (P+Q+a) - (P+a) - (Q+a) + a ~ 0 trong Pic(E)
# Tức là: (P+Q+a) + a ~ (P+a) + (Q+a) trong Div^1(E)
a = E([3, -8])
lhs = P + Q + a  # P+Q translate by a
p_a = P + a
q_a = Q + a
print(f"t_{{P+Q}}(a) = {lhs}")
print(f"t_P(a) = {p_a}")
print(f"t_Q(a) = {q_a}")
# Theorem of the Square: lhs + a ~ p_a + q_a
# Kiểm tra: lhs + a = p_a + q_a trong nhóm E(Q)?
print(f"lhs + a = {lhs + a}")
print(f"p_a + q_a = {p_a + q_a}")
print(f"Bằng nhau:", lhs + a == p_a + q_a)  # Phải True!
```

---

## Summary / Key Takeaways

- **Seesaw Principle**: $\mathcal{L}$ trên $V \times T$ ($V$ complete) trivial trên mọi $V$-fiber $\Rightarrow$ $\mathcal{L} \cong q^* \mathcal{N}$ với $\mathcal{N}$ trên $T$. Thêm trivial trên một $T$-fiber $\Rightarrow$ $\mathcal{L}$ trivial.
- **Theorem of the Cube**: $\mathcal{L}$ trên $U \times V \times W$ trivial trên 3 "mặt" $\Rightarrow$ trivial toàn bộ. Đây là analog của Rigidity Theorem cho line bundles.
- **Corollary 3 morphisms**: $(f+g+h)^*\mathcal{L}$ biểu diễn theo các partial sums — một "inclusion-exclusion" cho line bundles.
- **Theorem of the Square**: $t_{a+b}^*\mathcal{L} \otimes \mathcal{L} \cong t_a^*\mathcal{L} \otimes t_b^*\mathcal{L}$. Equivalently: **$\phi_\mathcal{L} : a \mapsto t_a^*\mathcal{L} \otimes \mathcal{L}^{-1}$ là group homomorphism** $A \to \operatorname{Pic}(A)$.
- **$[n]^*\mathcal{L}$**: với $\mathcal{L}$ symmetric, $[n]^*\mathcal{L} \cong \mathcal{L}^{n^2}$. Với $\mathcal{L} \in \operatorname{Pic}^0$, $[n]^*\mathcal{L} \cong \mathcal{L}^n$.
- **Degree của $[n]_A$**: $\deg([n]_A) = n^{2g}$ — suy ra $|A[n]| = n^{2g}$ trên $\bar{k}$ (đặc số $0$ hoặc $\gcd(n, p) = 1$).
- **$\operatorname{Pic}^0(A)$**: kernel của $\phi_\mathcal{L}$, là subgroup translation-invariant line bundles; sẽ là underlying set của dual AV $A^\vee$.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §5–6 (Theorem of the Cube).
- Mumford, D. *Abelian Varieties*, Chapter II §§5–6.
- Edixhoven–van der Geer–Moonen, *Abelian Varieties*, Chapter II §§2.1–2.9.
- Snowden, A. Lecture 4 (Michigan Math 679, 2013).
