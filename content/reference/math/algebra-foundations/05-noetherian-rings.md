---
title: "05. Noetherian Rings and the Hilbert Basis Theorem"
tags: [math, algebra-foundations, lesson-05]
aliases: [Noetherian Rings, Hilbert Basis Theorem]
created: 2026-03-28
---

> **Prerequisites**: [[01-rings-and-ideals|01. Rings and Ideals]], [[02-special-rings-domains-fields|02. Special Rings: Domains and Fields]], [[03-polynomial-rings-and-factorization|03. Polynomial Rings and Factorization]], [[04-localization|04. Localization]] — ideal, quotient ring, prime/maximal ideal, PID, localization.
> **Objectives**:
> - Phát biểu điều kiện chuỗi tăng (ACC) và Noetherian ring
> - Chứng minh các đặc trưng tương đương của Noetherian rings
> - Hiểu và áp dụng Hilbert Basis Theorem
> - Làm việc với radical ideal, nilradical, và Jacobson radical
> - Phát biểu và áp dụng Nakayama's Lemma

---

## Motivation / Intuition

David Hilbert, năm 1890, đã gây chấn động cộng đồng toán học khi chứng minh rằng mọi ideal trong $k[x_1, \ldots, x_n]$ đều được sinh hữu hạn — bằng một chứng minh **phi constructive**. Paul Gordan, người đã dành cả đời xây dựng các cơ sở hữu hạn một cách explicit, thốt lên: *"Das ist Theologie, nicht Mathematik!"* (Đây là thần học, không phải toán học!)

Chứng minh của Hilbert về bản chất là chứng minh rằng $k[x_1, \ldots, x_n]$ có một tính chất mà sau này Emmy Noether hệ thống hóa thành khái niệm **Noetherian ring**: mọi chuỗi tăng của ideals đều ổn định.

**Tại sao điều này quan trọng với Commutative Algebra?** Hầu hết các rings xuất hiện trong thực tế (rings tọa độ của algebraic varieties, rings số học) đều Noetherian. Đây là điều kiện "finiteness" cơ bản nhất, và hầu hết các kết quả quan trọng của Commutative Algebra yêu cầu Noetherian.

---

## Ascending Chain Condition và Noetherian Rings

### ACC và DCC

> [!definition] Definition 5.1 — ACC và DCC
> Cho $R$ là ring và $\mathcal{L}$ là tập tất cả các ideals của $R$ có thứ tự bởi $\subseteq$.
>
> - $R$ thỏa **ACC** (Ascending Chain Condition — điều kiện chuỗi tăng) nếu mọi chuỗi tăng:
>
> $$
> I_1 \subseteq I_2 \subseteq I_3 \subseteq \cdots
> $$
>
> đều ổn định: $\exists\, N$ sao cho $I_n = I_N$ với mọi $n \geq N$.
>
> - $R$ thỏa **DCC** (Descending Chain Condition — điều kiện chuỗi giảm) nếu mọi chuỗi giảm đều ổn định.

> [!definition] Definition 5.2 — Noetherian và Artinian Ring
> - $R$ là **Noetherian ring** (vành Noether) nếu $R$ thỏa ACC.
> - $R$ là **Artinian ring** (vành Artin) nếu $R$ thỏa DCC.

### Các đặc trưng tương đương

> [!theorem] Theorem 5.3 — Đặc trưng Noetherian Ring
> Cho $R$ là commutative ring. Các điều kiện sau là tương đương:
>
> 1. $R$ Noetherian (thỏa ACC).
> 2. Mọi ideal của $R$ đều được sinh hữu hạn (finitely generated).
> 3. Mọi tập con khác rỗng của tập ideals có phần tử cực đại (maximal element) — điều kiện **maximum condition**.

**Proof.**
$(1) \Rightarrow (2)$: Cho $I \trianglelefteq R$. Nếu $I = \{0\}$, xong. Chọn $a_1 \in I$. Nếu $(a_1) = I$, xong. Nếu không, chọn $a_2 \in I \setminus (a_1)$. Tiếp tục: nếu chuỗi $(a_1) \subsetneq (a_1, a_2) \subsetneq \cdots$ không dừng, ta có ACC bị vi phạm. Vậy chuỗi phải dừng tại $(a_1, \ldots, a_n) = I$.

$(2) \Rightarrow (1)$: Cho $I_1 \subseteq I_2 \subseteq \cdots$. Đặt $I = \bigcup_n I_n$, là ideal. Theo (2), $I = (a_1, \ldots, a_k)$. Mỗi $a_i \in I_{n_i}$ với $n_i$ nào đó. Đặt $N = \max n_i$. Khi đó $a_1, \ldots, a_k \in I_N$, suy ra $I \subseteq I_N \subseteq I$. Vậy $I_n = I_N$ với mọi $n \geq N$.

$(1) \Leftrightarrow (3)$: Tương tự — dùng Zorn's Lemma cho $(3) \Rightarrow (1)$ và xây dựng chuỗi tăng cho chiều ngược. $\blacksquare$

> [!example] Example 5.4 — Noetherian và non-Noetherian
> - Mọi field, $\mathbb{Z}$, $\mathbb{Z}/n\mathbb{Z}$: Noetherian (PID là Noetherian vì mọi ideal là principal).
> - $k[x_1, x_2, \ldots]$ (đa thức vô hạn biến): **không** Noetherian. Chuỗi $(x_1) \subsetneq (x_1, x_2) \subsetneq \cdots$ không ổn định.
> - Ring các hàm liên tục $C([0,1])$: **không** Noetherian.
> - Mọi PID là Noetherian (mọi ideal principal, tức sinh bởi một phần tử).

> [!theorem] Theorem 5.5 — Bảo toàn qua quotient và localization
> Nếu $R$ Noetherian:
>
> 1. Mọi quotient ring $R/I$ là Noetherian.
> 2. Mọi localization $S^{-1}R$ là Noetherian.
> 3. Mọi subring **không** nhất thiết Noetherian (ngược chiều thất bại).

**Proof của (1).**
Ideals của $R/I$ tương ứng (qua Correspondence Theorem, Bài 01) với ideals của $R$ chứa $I$. Một chuỗi tăng trong $R/I$ kéo lên thành chuỗi tăng trong $R$ — ổn định theo ACC của $R$. $\blacksquare$

---

## Hilbert Basis Theorem

> [!theorem] Theorem 5.6 — Hilbert Basis Theorem (HBT)
> Nếu $R$ là Noetherian ring thì $R[x]$ cũng là Noetherian.

Xem chứng minh đầy đủ tại [[a1-hilbert-basis-theorem|A1. Hilbert Basis Theorem]].

> [!corollary] Corollary 5.7
> Nếu $R$ Noetherian thì $R[x_1, \ldots, x_n]$ Noetherian với mọi $n \geq 1$.

**Proof.**
Bằng induction: $R[x_1, \ldots, x_n] = R[x_1, \ldots, x_{n-1}][x_n]$. Bước cơ sở là HBT. $\blacksquare$

> [!corollary] Corollary 5.8
> Mọi ideal của $k[x_1, \ldots, x_n]$ (với $k$ là field) đều được sinh hữu hạn.

> [!note] Remark 5.9 — Ý nghĩa trong Algebraic Geometry
> Corollary 5.8 là nền tảng của Algebraic Geometry cổ điển: mọi algebraic variety (nghiệm chung của hệ phương trình đa thức) được xác định bởi **hữu hạn** phương trình. Đây không phải điều hiển nhiên — không gian ideal có thể vô chiều!

---

## Radical Ideal, Nilradical và Jacobson Radical

### Radical

> [!definition] Definition 5.10 — Radical của Ideal
> Cho $I \trianglelefteq R$. **Radical** của $I$ là:
>
> $$
> \sqrt{I} = \operatorname{rad}(I) = \left\{ r \in R \;\middle|\; r^n \in I \text{ với } n \geq 1 \text{ nào đó} \right\}
> $$
>
> $I$ được gọi là **radical ideal** nếu $I = \sqrt{I}$.

> [!theorem] Theorem 5.11 — $\sqrt{I}$ là Ideal
> $\sqrt{I} \trianglelefteq R$ và $\sqrt{I}$ là giao của tất cả prime ideals chứa $I$:
>
> $$
> \sqrt{I} = \bigcap_{P \supseteq I,\, P \text{ prime}} P
> $$

**Proof.**
*$\sqrt{I}$ là ideal*: Nếu $r^m \in I$ và $s^n \in I$, thì $(r+s)^{m+n} \in I$ (khai triển nhị thức, mỗi hạng tử chứa $r^m$ hoặc $s^n$ vì số mũ $\geq m+n$). Và $(cr)^m = c^m r^m \in I$.

*$\sqrt{I} = \bigcap P$*: ($\subseteq$) Nếu $r^n \in I \subseteq P$ và $P$ prime thì $r \in P$ (vì $P$ prime và $r^n = r \cdot r^{n-1} \in P$ kéo $r \in P$ hoặc $r^{n-1} \in P$, induction).

($\supseteq$) Nếu $r \notin \sqrt{I}$, cần tìm prime $P \supseteq I$ với $r \notin P$. Đặt $S = \{1, r, r^2, \ldots\}$. Vì $r \notin \sqrt{I}$, $S \cap I = \emptyset$. Dùng Zorn's Lemma, tồn tại ideal $P$ maximal với $I \subseteq P$ và $P \cap S = \emptyset$. Ta chứng minh $P$ là prime: nếu $ab \in P$ nhưng $a, b \notin P$, thì $(P + (a)) \cap S \neq \emptyset$ và $(P+(b)) \cap S \neq \emptyset$, nên $r^m = p + ca$ và $r^n = p' + c'b$ với $p, p' \in P$. Khi đó $r^{m+n} = (p+ca)(p'+c'b) \in P + (ab) \subseteq P$, mâu thuẫn. $\blacksquare$

### Nilradical và Jacobson Radical

> [!definition] Definition 5.12 — Nilradical và Jacobson Radical
> - **Nilradical**: $\operatorname{nil}(R) = \sqrt{(0)} = \{r \in R \mid r^n = 0 \text{ với } n \text{ nào đó}\}$ — giao tất cả prime ideals.
> - **Jacobson radical**: $\operatorname{Jac}(R) = \bigcap_{\mathfrak{m} \text{ maximal}} \mathfrak{m}$ — giao tất cả maximal ideals.
>
> Luôn có $\operatorname{nil}(R) \subseteq \operatorname{Jac}(R)$.

> [!theorem] Theorem 5.13 — Đặc trưng Jacobson Radical
> $r \in \operatorname{Jac}(R)$ $\iff$ $1 - rs \in R^\times$ với mọi $s \in R$.

**Proof.**
($\Rightarrow$) Nếu $1 - rs$ không phải unit, nó chứa trong maximal ideal $\mathfrak{m}$. Vì $r \in \operatorname{Jac}(R) \subseteq \mathfrak{m}$, ta có $rs \in \mathfrak{m}$, suy ra $1 = (1-rs) + rs \in \mathfrak{m}$ — mâu thuẫn.

($\Leftarrow$) Nếu $r \notin \mathfrak{m}$ với $\mathfrak{m}$ maximal, thì $(r) + \mathfrak{m} = R$, nên $1 = rs + m$ với $s \in R$, $m \in \mathfrak{m}$. Vậy $1 - rs = m \in \mathfrak{m}$, tức $1 - rs$ không phải unit. $\blacksquare$

> [!example] Example 5.14
> - $R = \mathbb{Z}$: $\operatorname{nil}(\mathbb{Z}) = 0$, $\operatorname{Jac}(\mathbb{Z}) = 0$ (giao tất cả $(p)$ là $0$).
> - $R = \mathbb{Z}/8\mathbb{Z}$: $\operatorname{nil}(R) = \{0, 2, 4, 6\} = (2)/(8)$, $\operatorname{Jac}(R) = (2)/(8)$.
> - $R$ local với maximal $\mathfrak{m}$: $\operatorname{Jac}(R) = \mathfrak{m}$.
> - $R = k[x]/(x^n)$: $\operatorname{nil}(R) = (x)/(x^n)$ — mọi phần tử dạng $cx + \cdots$ là nilpotent.

---

## Nakayama's Lemma

> [!theorem] Theorem 5.15 — Nakayama's Lemma (NAK)
> Cho $(R, \mathfrak{m})$ local ring (hoặc $I \subseteq \operatorname{Jac}(R)$) và $M$ là $R$-module hữu hạn sinh (finitely generated). Nếu:
>
> $$
> IM = M
> $$
>
> thì $M = 0$.

**Proof.**
Cho $M = (m_1, \ldots, m_n)$ với $n$ tối thiểu. Vì $IM = M$, ta có $m_n = \sum_{j=1}^n r_j m_j$ với $r_j \in I$. Suy ra:
>
> $$
> (1 - r_n)m_n = \sum_{j=1}^{n-1} r_j m_j
> $$
>
> Vì $r_n \in I \subseteq \operatorname{Jac}(R)$, theo Theorem 5.13, $1 - r_n \in R^\times$. Nhân cả hai vế với $(1-r_n)^{-1}$: $m_n \in (m_1, \ldots, m_{n-1})$, mâu thuẫn với tính tối thiểu của $n$. Vậy $n = 0$, tức $M = 0$. $\blacksquare$

> [!corollary] Corollary 5.16 — Nakayama's Lemma (dạng tổng quát)
> Cho $M$ là $R$-module hữu hạn sinh, $N \subseteq M$ là submodule, và $I \subseteq \operatorname{Jac}(R)$. Nếu $M = N + IM$ thì $M = N$.

**Proof.**
Áp dụng Nakayama cho $M/N$: $I(M/N) = (IM+N)/N = M/N$, nên $M/N = 0$. $\blacksquare$

> [!corollary] Corollary 5.17 — Tập sinh tối thiểu qua residue field
> Cho $(R, \mathfrak{m}, k)$ local ring, $M$ là $R$-module hữu hạn sinh. Khi đó $m_1, \ldots, m_n \in M$ sinh $M$ $\iff$ ảnh $\bar{m}_1, \ldots, \bar{m}_n$ sinh $M/\mathfrak{m} M$ như $k$-vector space.

Đây là công cụ cực kỳ hữu ích: để kiểm tra tập sinh của module trên local ring, chỉ cần kiểm tra trên residue field — một bài toán vector space đơn giản hơn nhiều.

> [!example] Example 5.18 — Ứng dụng Nakayama
> Cho $(R, \mathfrak{m})$ local ring và $M$ là $R$-module projective hữu hạn sinh. Khi đó $M$ là **free**.
>
> Chứng minh: chọn $m_1, \ldots, m_n$ nâng lên cơ sở của $M/\mathfrak{m}M$ như $k$-vector space. Theo Corollary 5.17, chúng sinh $M$, cho surjection $\varphi : R^n \to M$. Đặt $K = \ker\varphi$. Vì $M$ projective, $0 \to K \to R^n \to M \to 0$ split, nên $K$ là trực hạng của $R^n$. Kẹp thêm: $K \subseteq \mathfrak{m} R^n$ (Nakayama), nên $K = \mathfrak{m}K$, và Nakayama cho $K = 0$. Vậy $M \cong R^n$ tự do.

---

## Primary Decomposition (sơ lược)

> [!definition] Definition 5.19 — Primary Ideal
> Ideal $Q \trianglelefteq R$ là **primary** nếu $Q \neq R$ và:
>
> $$
> ab \in Q,\; a \notin Q \implies b^n \in Q \text{ với } n \text{ nào đó}
> $$
>
> Tương đương: $R/Q \neq 0$ và mọi zero divisor của $R/Q$ đều nilpotent.
>
> Nếu $Q$ primary thì $\sqrt{Q}$ là prime ideal; ta nói $Q$ là **$P$-primary** với $P = \sqrt{Q}$.

> [!theorem] Theorem 5.20 — Primary Decomposition (Lasker–Noether)
> Trong Noetherian ring, mọi ideal $I$ đều có **primary decomposition**:
>
> $$
> I = Q_1 \cap Q_2 \cap \cdots \cap Q_n
> $$
>
> với $Q_i$ là $P_i$-primary ideals, và các $P_i$ phân biệt. Decomposition này tối tiểu (irredundant) và các $P_i$ xác định duy nhất (là **associated primes** của $I$).

Đây là định lý quan trọng đặt nền tảng cho lý thuyết associated primes và dimension theory trong Commutative Algebra — sẽ xuất hiện trong các bài sau.

---

## SageMath Cheatsheet

```python
R.<x, y, z> = QQ[]

I = R.ideal(x^2 - y, x^3 - z)
print(I)
print(I.is_prime())

J = R.ideal(x^2, y)
print(J)
print(J.radical())

R2.<x, y> = QQ[]
I2 = R2.ideal(x^2, x*y)
print(I2.primary_decomposition())
print(I2.associated_primes())

R3 = QQ['x']
x = R3.gen()
I3 = R3.ideal(x^4 - 1)
print(I3.primary_decomposition())

R4 = ZZ.quotient(8)
print(R4.nilradicals())

R5.<x, y> = QQ[]
I5 = R5.ideal(x^2 - y^3)
print(I5.radical())
print(I5.primary_decomposition())
```

---

## Summary / Key Takeaways

- **ACC / Noetherian**: mọi chuỗi tăng ideal ổn định $\iff$ mọi ideal finitely generated $\iff$ maximum condition.
- **HBT**: $R$ Noetherian $\Rightarrow$ $R[x]$ Noetherian. Suy ra $k[x_1,\ldots,x_n]$ Noetherian — mọi ideal sinh hữu hạn.
- Quotient và localization của Noetherian là Noetherian; subring **không** nhất thiết.
- **Radical ideal**: $\sqrt{I} = \bigcap_{P \supseteq I} P$ — giao tất cả prime ideals chứa $I$.
- **Nilradical** $= \sqrt{(0)}$ = giao prime ideals; **Jacobson radical** = giao maximal ideals.
- $r \in \operatorname{Jac}(R)$ $\iff$ $1 - rs$ là unit với mọi $s$ — đặc trưng hữu ích.
- **Nakayama's Lemma**: trên local ring, $IM = M$ (finitely generated) $\Rightarrow M = 0$. Tập sinh của module phản chiếu qua residue field.
- **Primary decomposition**: trong Noetherian ring, mọi ideal = giao finite primary ideals — tổng quát hóa phân tích nhân tử.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 15.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapters 6–7.
- Matsumura, H. *Commutative Ring Theory*, Chapter 1–2.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter X.
- https://doc.sagemath.org/html/en/reference/polynomial_rings/
