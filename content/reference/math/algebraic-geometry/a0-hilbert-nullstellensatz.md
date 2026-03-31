---
title: "A0. Proof of Hilbert Nullstellensatz"
tags: [math, algebraic-geometry, appendix, nullstellensatz]
aliases: [Proof of Hilbert Nullstellensatz]
created: 2026-03-31
---

> **Liên quan**: [[03-affine-varieties-and-nullstellensatz|03. Affine Varieties & Nullstellensatz]]
> **Mục đích**: Chứng minh đầy đủ Weak Form (qua Noether Normalization + Zariski's Lemma) và Strong Form (qua Rabinowitsch trick).

---

## Bối cảnh và Chiến lược

Hilbert Nullstellensatz có hai dạng:

- **Weak form**: Nếu $k$ đại số đóng và $I \subsetneq k[x_1,\ldots,x_n]$ thì $V(I) \neq \emptyset$.
- **Strong form**: $I(V(J)) = \sqrt{J}$ với mọi ideal $J$.

**Chiến lược chứng minh**: Weak form $\Rightarrow$ Strong form (qua Rabinowitsch). Weak form được suy ra từ Zariski's Lemma, vốn được chứng minh qua Noether Normalization.

---

## Bước 1: Noether Normalization Lemma

> [!theorem] Theorem A0.1 — Noether Normalization Lemma
> Cho $k$ là trường và $A = k[a_1,\ldots,a_m]$ là $k$-algebra hữu hạn sinh. Tồn tại $y_1,\ldots,y_d \in A$ đại số độc lập trên $k$ sao cho $A$ là $k[y_1,\ldots,y_d]$-module hữu hạn (integral extension):
>
> $$
> k[y_1,\ldots,y_d] \hookrightarrow A \quad \text{(integral extension, } d = \dim A\text{)}.
> $$

**Proof (by induction on $m$).**

*Base case $m = 0$*: $A = k$, chọn $d = 0$, không có gì để làm.

*Step*: Giả sử $A = k[a_1,\ldots,a_m]$.

**Case (a)**: $a_1,\ldots,a_m$ đại số độc lập trên $k$. Chọn $y_i = a_i$. Xong.

**Case (b)**: Tồn tại quan hệ đại số $f(a_1,\ldots,a_m) = 0$ với $0 \neq f \in k[X_1,\ldots,X_m]$. Viết $f = \sum c_\alpha X^\alpha$ với multi-index $\alpha = (\alpha_1,\ldots,\alpha_m)$.

Đặt $a_i' = a_i - a_1^{N^{i-1}}$ cho $i = 2,\ldots,m$ với $N$ đủ lớn. Khi đó:

$$
f(a_1, a_2' + a_1^N, a_3' + a_1^{N^2}, \ldots) = c \cdot a_1^M + \text{bậc thấp hơn trong } a_1,
$$

với $c \neq 0$ và $M > 0$. Vậy $a_1$ integral over $k[a_2',\ldots,a_m']$, tức $A$ là $k[a_2',\ldots,a_m']$-module hữu hạn. Áp dụng hypothesis induction cho $B = k[a_2',\ldots,a_m']$: tồn tại $y_1,\ldots,y_d$ đại số độc lập với $B$ integral over $k[y_1,\ldots,y_d]$. Vậy $A$ integral over $k[y_1,\ldots,y_d]$.

(Với $k$ hữu hạn, cần thay đổi kỹ thuật nhỏ — dùng thay đổi biến linear thay vì monomial). $\blacksquare$

---

## Bước 2: Zariski's Lemma

> [!theorem] Theorem A0.2 — Zariski's Lemma
> Nếu $k$ là trường và $L = k[a_1,\ldots,a_m]$ là $k$-algebra hữu hạn sinh **đồng thời là trường**, thì $L/k$ là algebraic extension hữu hạn.
>
> Đặc biệt, nếu $k$ đại số đóng, thì $L = k$.

**Proof.**
Theo Noether Normalization, tồn tại $y_1,\ldots,y_d$ đại số độc lập trên $k$ với $L$ integral over $k[y_1,\ldots,y_d]$.

Vì $L$ là trường và $L/k[y_1,\ldots,y_d]$ integral, $k[y_1,\ldots,y_d]$ phải là trường (một integral domain bị dominated bởi một trường qua integral extension là trường — xem Corollary A0.3). Nhưng $k[y_1,\ldots,y_d]$ là polynomial ring, chỉ là trường khi $d = 0$.

Vậy $d = 0$, tức $L$ là $k$-module hữu hạn, suy ra $L/k$ là algebraic extension hữu hạn. $\blacksquare$

> [!corollary] Corollary A0.3
> Nếu $A \subseteq B$ là integral extension và $B$ là trường, thì $A$ là trường.

**Proof.**
Lấy $0 \neq a \in A$. Vì $a^{-1} \in B$ và $a^{-1}$ integral over $A$: $\exists\, (a^{-1})^n + c_{n-1}(a^{-1})^{n-1} + \cdots + c_0 = 0$ với $c_i \in A$. Nhân với $a^{n-1}$:

$$
a^{-1} = -(c_{n-1} + c_{n-2}a + \cdots + c_0 a^{n-1}) \in A.
$$

Vậy $A$ là trường. $\blacksquare$

---

## Bước 3: Weak Nullstellensatz

> [!theorem] Theorem A0.4 — Hilbert Nullstellensatz (Weak Form)
> Cho $k$ đại số đóng và $I \subsetneq k[x_1,\ldots,x_n]$ là proper ideal. Khi đó $V(I) \neq \emptyset$.

**Proof.**
Vì $k[x_1,\ldots,x_n]$ Noetherian, $I$ chứa trong một maximal ideal $\mathfrak{m}$. Khi đó:

$$
L := k[x_1,\ldots,x_n]/\mathfrak{m}
$$

là $k$-algebra hữu hạn sinh và là trường (maximal ideal cho field). Theo Zariski's Lemma, $L/k$ là algebraic extension hữu hạn. Vì $k$ đại số đóng, $L = k$.

Vậy projection $k[x_i] \to L = k$ gửi $x_i \mapsto a_i \in k$ cho điểm $(a_1,\ldots,a_n) \in V(\mathfrak{m}) \subseteq V(I)$. $\blacksquare$

> [!corollary] Corollary A0.5 — Maximal ideals of $k[x_1,\ldots,x_n]$
> Với $k$ đại số đóng, mọi maximal ideal của $k[x_1,\ldots,x_n]$ có dạng $\mathfrak{m}_a = (x_1 - a_1, \ldots, x_n - a_n)$ với $(a_1,\ldots,a_n) \in k^n$.

---

## Bước 4: Strong Nullstellensatz (Rabinowitsch Trick)

> [!theorem] Theorem A0.6 — Hilbert Nullstellensatz (Strong Form)
> Cho $k$ đại số đóng và $J \subseteq k[x_1,\ldots,x_n]$ là ideal. Khi đó:
>
> $$
> I(V(J)) = \sqrt{J}.
> $$

**Proof.**

$(\supseteq)$: Hiển nhiên. Nếu $f^m \in J$ thì $f^m$ triệt tiêu trên $V(J)$, nên $f$ cũng triệt tiêu.

$(\subseteq)$: **Rabinowitsch trick** (1929). Giả sử $g \in I(V(J))$, tức $g$ triệt tiêu trên $V(J)$.

Đặt $J = (f_1,\ldots,f_s)$ (Noetherian). Xét ring $S = k[x_1,\ldots,x_n, z]$ và ideal:

$$
J' := (f_1, \ldots, f_s, 1 - zg) \subseteq S.
$$

**Claim**: $V(J') = \emptyset$ trong $k^{n+1}$.

*Proof of claim*: Nếu $(a_1,\ldots,a_n,b) \in V(J')$ thì $(a_1,\ldots,a_n) \in V(J)$ (vì $f_i$ triệt tiêu). Do $g \in I(V(J))$, $g(a) = 0$. Nhưng $1 - bg(a) = 1 \neq 0$ — mâu thuẫn.

Theo Weak Nullstellensatz, $V(J') = \emptyset \Rightarrow J' = S = (1)$. Vậy tồn tại $h_1,\ldots,h_s, h \in S$ với:

$$
1 = h_1 f_1 + \cdots + h_s f_s + h(1 - zg).
$$

Substitute $z = 1/g$ (trong trường fraction $k(x_1,\ldots,x_n)$):

$$
1 = h_1(x, 1/g) f_1 + \cdots + h_s(x, 1/g) f_s.
$$

Nhân hai vế với $g^N$ (với $N = \max \deg_z h_i$) để xóa mẫu:

$$
g^N = \sum_{i=1}^s H_i(x) f_i \in J,
$$

với $H_i \in k[x_1,\ldots,x_n]$. Vậy $g^N \in J$, tức $g \in \sqrt{J}$. $\blacksquare$

---

## Tổng kết và Hệ quả

> [!corollary] Corollary A0.7 — Galois Correspondence
> Trên trường đại số đóng $k$, có bijection đảo chiều:
>
> $$
> \{\text{algebraic sets trong } \mathbb{A}^n_k\} \;\xrightarrow[I(-)]{\xleftarrow{V(-)}}\; \{\text{radical ideals trong } k[x_1,\ldots,x_n]\}.
> $$

> [!note] Remark A0.8 — Vai trò của "đại số đóng"
> Nullstellensatz **sai** nếu $k$ không đại số đóng. Ví dụ: trên $k = \mathbb{R}$, ideal $(x^2+1) \subsetneq \mathbb{R}[x]$ nhưng $V(x^2+1) = \emptyset$. Weak form thất bại.
>
> Trong scheme theory, ta "sửa" vấn đề này bằng cách dùng $\operatorname{Spec}$ (tất cả prime ideals, không chỉ maximal), cho phép làm việc trên trường không đại số đóng.

---

## SageMath: Kiểm tra Nullstellensatz

```python
R = QQ['x', 'y', 'z']
x, y, z = R.gens()

J = R.ideal(x*y - 1, x*z - 1)
print(J.radical() == J)      

g = y - z
print(g^1 in J)   
print(g^2 in J)   
print(g in J.radical())      

J2 = R.ideal(x^2, x*y)
rad_J2 = J2.radical()
print(rad_J2)                
```

---

## References

- Noether, E. *Idealtheorie in Ringbereichen*, 1921.
- Rabinowitsch, J. L. *Zum Hilbertschen Nullstellensatz*, 1929.
- Atiyah & MacDonald. *Introduction to Commutative Algebra*, Chapter 5 & 7.
- Gathmann, A. *Commutative Algebra*, Chapter 10 (RPTU Kaiserslautern, online).
- Vakil, R. *The Rising Sea* (2024), §3.2–3.3.
