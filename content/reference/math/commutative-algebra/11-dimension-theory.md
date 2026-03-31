---
title: "11. Dimension Theory"
tags: [math, commutative-algebra, lesson-11]
aliases: [Dimension Theory]
created: 2026-03-30
---

> **Prerequisites**: [[07-integral-dependence|07. Integral Dependence]], [[08-noether-normalization-nullstellensatz|08. Noether Normalization and Nullstellensatz]]
> **Objectives**:
> - Nắm định nghĩa Krull dimension và tính toán cho các vành cụ thể
> - Hiểu và áp dụng Krull's Principal Ideal Theorem
> - Chứng minh $\dim k[x_1,\ldots,x_n] = n$
> - Kết nối dimension với Noether Normalization và going-up/down

---

## Motivation / Intuition

Trong hình học, "chiều" là khái niệm trực quan: đường thẳng chiều 1, mặt phẳng chiều 2, không gian chiều 3. Làm thế nào để định nghĩa chiều cho một vành tùy ý?

Grothendieck và trường phái Bourbaki nhận ra rằng chiều tự nhiên nhất của một vành là **Krull dimension** — độ dài chuỗi prime ideals dài nhất. Định nghĩa này hoàn toàn đại số nhưng phản ánh đúng trực giác hình học:

- $\dim k = 0$: trường chỉ có $(0)$, tương ứng điểm (không gian chiều 0).
- $\dim k[x] = 1$: chuỗi $(0) \subsetneq (x-a)$, tương ứng đường thẳng.
- $\dim k[x,y] = 2$: chuỗi $(0) \subsetneq (x) \subsetneq (x,y)$, tương ứng mặt phẳng.

**Krull's Principal Ideal Theorem** — định lý trung tâm của phần này — cho biết thêm một generator vào ideal làm giảm chiều đi nhiều nhất 1. Đây là phiên bản đại số của định lý Bézout trong hình học: giao với hypersurface giảm chiều đi 1.

---

## Krull Dimension

### Definition

> [!info] Definition 11.1 — Krull Dimension
>
> Cho $R$ là vành. **Krull dimension** $\dim R$ là supremum của độ dài các chuỗi prime ideals:
>
> $$
> \mathfrak{p}_0 \subsetneq \mathfrak{p}_1 \subsetneq \cdots \subsetneq \mathfrak{p}_n
> $$
>
> Vậy $\dim R = n$ nếu tồn tại chuỗi dài $n$ nhưng không có chuỗi dài hơn.
>
> **Height** của prime ideal $\mathfrak{p}$:
>
> $$
> \operatorname{ht}(\mathfrak{p}) = \sup\{n : \exists\, \mathfrak{p}_0 \subsetneq \cdots \subsetneq \mathfrak{p}_n = \mathfrak{p}\}
> $$
>
> Với ideal tổng quát $\mathfrak{a}$: $\operatorname{ht}(\mathfrak{a}) = \inf_{\mathfrak{p} \supseteq \mathfrak{a}} \operatorname{ht}(\mathfrak{p})$.

> [!example] Example 11.2 — Tính Krull dimension
>
> | Vành | $\dim$ | Chuỗi dài nhất |
> |------|--------|----------------|
> | Trường $k$ | $0$ | $(0)$ |
> | $\mathbb{Z}$ | $1$ | $(0) \subsetneq (p)$ |
> | $k[x]$ | $1$ | $(0) \subsetneq (f)$ |
> | $\mathbb{Z}[x]$ | $2$ | $(0) \subsetneq (p) \subsetneq (p,x)$ |
> | $k[x_1,\ldots,x_n]$ | $n$ | $(0) \subsetneq (x_1) \subsetneq \cdots \subsetneq (x_1,\ldots,x_n)$ |
> | $k[[x]]$ (DVR) | $1$ | $(0) \subsetneq (x)$ |
> | Vành Noetherian cục bộ $0$-dim | $0$ | chỉ $(0)$ (Artinian) |

> [!note] Remark 11.3 — Dimension của vành Noetherian
>
> Với vành Noetherian (không địa phương), $\dim R$ có thể vô hạn ngay cả khi $R$ Noetherian. Ví dụ của Nagata (1962) cho vành Noetherian có $\dim = \infty$. Tuy nhiên, mọi **local** Noetherian ring và mọi **finitely generated $k$-algebra** đều có $\dim < \infty$.

---

## Krull's Principal Ideal Theorem

### Theorem

> [!abstract] Theorem 11.4 — Krull's Principal Ideal Theorem (Krull's Hauptidealsatz)
>
> Cho $R$ là Noetherian ring và $f \in R$ không phải đơn vị, không phải zero divisor. Nếu $\mathfrak{p}$ là prime ideal **cực tiểu** chứa $(f)$, thì:
>
> $$
> \operatorname{ht}(\mathfrak{p}) \leq 1
> $$
>
> Tổng quát hơn: nếu $\mathfrak{p}$ là prime cực tiểu chứa ideal $(f_1, \ldots, f_r)$ (sinh bởi $r$ phần tử), thì $\operatorname{ht}(\mathfrak{p}) \leq r$.

Xem chứng minh đầy đủ tại [[a4-krull-principal-ideal-theorem|A4. Proof of Krull's Principal Ideal Theorem]].

**Ý nghĩa hình học:** Giao của một variety $X$ chiều $d$ với một hypersurface $V(f)$ có dimension $\geq d - 1$. Mỗi equation thêm vào giảm chiều đi nhiều nhất 1.

> [!abstract] Corollary 11.5 — Dimension và số generators
>
> Nếu $R$ là Noetherian và $\mathfrak{m}$ là maximal ideal, khi đó:
>
> $$
> \dim R_\mathfrak{m} \leq \dim_{R/\mathfrak{m}}(\mathfrak{m}/\mathfrak{m}^2)
> $$
>
> Số $\mu(\mathfrak{m}) = \dim_{R/\mathfrak{m}}(\mathfrak{m}/\mathfrak{m}^2)$ là số sinh tối giản của $\mathfrak{m}$ (Nakayama). **Regular local ring** là khi đẳng thức xảy ra.

---

## Dimension của Vành Đa Thức

### Theorem

> [!abstract] Theorem 11.6 — $\dim k[x_1,\ldots,x_n] = n$
>
> Với trường $k$, $\dim k[x_1, \ldots, x_n] = n$.

**Proof.**

$(\geq n)$: Chuỗi $(0) \subsetneq (x_1) \subsetneq (x_1, x_2) \subsetneq \cdots \subsetneq (x_1, \ldots, x_n)$ là chuỗi prime ideals độ dài $n$.

$(\leq n)$: Theo Noether Normalization (Theorem 8.1), mọi $k$-algebra hữu hạn sinh $A$ là integral extension của $k[y_1, \ldots, y_d]$ với $d = \dim A$. Theo Theorem 7.14, $\dim A = \dim k[y_1,\ldots,y_d]$. Vậy cần chứng minh $\dim k[y_1,\ldots,y_d] = d$ — quy nạp theo $d$.

Cơ sở $d=0$: $k[\ ] = k$, $\dim = 0$.

Bước quy nạp: Với chuỗi $\mathfrak{p}_0 \subsetneq \cdots \subsetneq \mathfrak{p}_m$ trong $k[y_1,\ldots,y_d]$. Lấy $f \in \mathfrak{p}_1 \setminus \mathfrak{p}_0$. Thì $\mathfrak{p}_1/\mathfrak{p}_0$ là prime cực tiểu chứa $\bar{f}$ trong $k[y_1,\ldots,y_d]/\mathfrak{p}_0$. Theo Krull's theorem: $\operatorname{ht}(\mathfrak{p}_1/\mathfrak{p}_0) = 1$. Áp dụng giả thiết quy nạp cho $k[y_1,\ldots,y_d]/\mathfrak{p}_1$ (chiều $\leq d-1$), ta được $m - 1 \leq d - 1$, tức $m \leq d$. $\blacksquare$

### Theorem

> [!abstract] Theorem 11.7 — Công thức Dimension cho Local Ring
>
> Cho $(R, \mathfrak{m})$ là Noetherian local ring. Ba số sau đây bằng nhau:
>
> $$
> \dim R = \delta(R) = s(R)
> $$
>
> Trong đó:
>
> - $\dim R$: Krull dimension.
> - $\delta(R)$: số sinh tối thiểu của $\mathfrak{m}$-primary ideal $\mathfrak{q}$ (tức số nhỏ nhất $r$ sao cho $\mathfrak{q}$ sinh bởi $r$ phần tử).
> - $s(R)$: bậc đa thức của Hilbert function $\ell(R/\mathfrak{m}^n)$ (tính theo $n$).

**Proof (phác thảo).** Đây là định lý trung tâm của lý thuyết local rings, cần Hilbert functions (Bài 12). Bất đẳng thức $\dim R \leq \delta(R)$: nếu $\mathfrak{m}^n = (f_1,\ldots,f_r)\mathfrak{m}^{n-1}$ thì $V(f_1,\ldots,f_r) \cap \operatorname{Spec}(R)$ chỉ chứa $\{\mathfrak{m}\}$, nên $\dim R \leq r$ theo Krull's theorem. Chiều ngược lại dùng Hilbert series. $\blacksquare$

---

## Catenary Rings

### Definition

> [!info] Definition 11.8 — Catenary Ring
>
> $R$ gọi là **catenary** nếu với mọi hai primes $\mathfrak{p} \subseteq \mathfrak{q}$, mọi chuỗi maximal $\mathfrak{p} = \mathfrak{p}_0 \subsetneq \cdots \subsetneq \mathfrak{p}_n = \mathfrak{q}$ đều có cùng độ dài.

> [!abstract] Theorem 11.9 — Finitely generated $k$-algebras là catenary
>
> Mọi $k$-algebra hữu hạn sinh là catenary. Mọi Noetherian local ring là catenary.

**Proof (phác thảo).** Dùng Noether Normalization: mọi chuỗi maximal trong $k[x_1,\ldots,x_n]/\mathfrak{p}$ có độ dài bằng $\dim k[x_1,\ldots,x_n]/\mathfrak{p}$ — bất biến và xác định hoàn toàn bởi $\mathfrak{p}$. $\blacksquare$

> [!example] Example 11.10 — Tính height và codimension
>
> Trong $R = k[x,y,z]$:
>
> - $\operatorname{ht}(x,y) = 2$ (chuỗi $(0) \subsetneq (x) \subsetneq (x,y)$).
> - $\operatorname{ht}(x^2 - yz) = 1$ (một phương trình, cực tiểu over $(0)$).
> - $\dim R/(x^2-yz) = \dim R - 1 = 2$ (variety mặt: $z = x^2/y$ — quadric surface).
>
> **Codimension** (hay **coheight**) của prime $\mathfrak{p}$: $\operatorname{codim}(\mathfrak{p}) = \dim R - \operatorname{ht}(\mathfrak{p})$.
>
> Trong catenary ring Noetherian: $\operatorname{ht}(\mathfrak{p}) + \dim(R/\mathfrak{p}) = \dim R$ với mọi prime $\mathfrak{p}$ (nếu $R$ là catenary equidimensional).

---

## SageMath Cheatsheet

```sage
R.<x,y,z> = QQ[]

R.krull_dimension()

I = R.ideal(x^2 - y*z)
(R.quotient(I)).krull_dimension()

J = R.ideal(x, y)
J.height()

K = R.ideal(x^2 - y, y^2 - z, z^2 - x)
K.height()
(R.quotient(K)).krull_dimension()

R2 = ZZ['x']
R2.krull_dimension()

R3 = ZZ.quotient(12)
R3.krull_dimension()
```

---

## Summary / Key Takeaways

- **Krull dimension** $\dim R$: sup độ dài chuỗi prime ideals; phản ánh "chiều" hình học.
- $\dim k[x_1,\ldots,x_n] = n$; $\dim \mathbb{Z} = 1$; $\dim k = 0$.
- **Height** $\operatorname{ht}(\mathfrak{p})$: độ dài chuỗi đi xuống từ $\mathfrak{p}$.
- **Krull's Principal Ideal Theorem**: $\mathfrak{p}$ prime cực tiểu over $(f_1,\ldots,f_r)$ $\Rightarrow$ $\operatorname{ht}(\mathfrak{p}) \leq r$.
- $\dim R_\mathfrak{m} \leq$ số sinh tối giản của $\mathfrak{m}$; đẳng thức $\Leftrightarrow$ regular local ring.
- $\dim R = \delta(R) = s(R)$ cho local Noetherian ring (tương đương dimension theorem).
- **Catenary ring**: mọi chuỗi maximal giữa hai primes có cùng độ dài; $k$-algebras hữu hạn sinh là catenary.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 11.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 10.
- Matsumura, H. *Commutative Ring Theory*, Chapter 5.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapter 21.
