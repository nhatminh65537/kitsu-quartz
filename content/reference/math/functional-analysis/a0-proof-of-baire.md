---
title: "A0. Proof of Baire Category Theorem"
tags: [math, functional-analysis, appendix]
aliases: [Proof Baire Category Theorem]
created: 2026-03-31
---

> **Liên quan**: [[04-baire-ubp|04. Fundamental Theorems I — Baire & UBP]]

---

## Phát biểu

> [!theorem] Theorem A0.1 — Baire Category Theorem
> Cho $(X, d)$ là không gian metric **đầy đủ**. Nếu $X = \bigcup_{n=1}^\infty A_n$, thì ít nhất một $A_n$ có phần trong không rỗng:
>
> $$
> \exists\, n: \quad (\overline{A_n})^\circ \neq \emptyset
> $$
>
> Tương đương: Nếu mỗi $A_n$ là nowhere dense (tức $(\overline{A_n})^\circ = \emptyset$), thì $X \neq \bigcup_{n=1}^\infty A_n$.

---

## Chứng minh đầy đủ

**Proof.** Giả sử phản chứng: $X = \bigcup_{n=1}^\infty A_n$ với mỗi $A_n$ nowhere dense.

Ta sẽ xây dựng dãy quả cầu đóng lồng nhau $\overline{B}(x_n, r_n)$ với:
- $\overline{B}(x_{n+1}, r_{n+1}) \subseteq B(x_n, r_n)$ (lồng nhau chặt)
- $r_n \leq 1/2^n$ (bán kính $\to 0$)
- $\overline{B}(x_n, r_n) \cap A_n = \emptyset$ (tránh $A_n$)

**Bước cơ sở** ($n = 1$):
Vì $A_1$ nowhere dense, $(\overline{A_1})^\circ = \emptyset$, tức là $\overline{A_1}$ không chứa quả cầu mở nào. Do đó $B(x_0, 1) \not\subseteq \overline{A_1}$ với bất kỳ $x_0$ nào. Chọn $x_1 \in B(x_0, 1) \setminus \overline{A_1}$ (tồn tại vì $\overline{A_1}$ không trù mật). Vì $X \setminus \overline{A_1}$ mở, tồn tại $r_1 \in (0, 1/2)$ sao cho $\overline{B}(x_1, r_1) \subseteq B(x_0, 1) \setminus \overline{A_1}$.

Đặt quả cầu ban đầu $B(x_0, 1)$ là quả cầu tùy ý (tồn tại vì $X \neq \emptyset$).

**Bước quy nạp**: Giả sử đã có $\overline{B}(x_n, r_n)$ với $\overline{B}(x_n, r_n) \cap A_n = \emptyset$ và $r_n \leq 1/2^n$.

Vì $A_{n+1}$ nowhere dense, $B(x_n, r_n) \not\subseteq \overline{A_{n+1}}$. Chọn:

$$
x_{n+1} \in B(x_n, r_n) \setminus \overline{A_{n+1}}
$$

Vì $B(x_n, r_n) \setminus \overline{A_{n+1}}$ mở và không rỗng, tồn tại:

$$
r_{n+1} \in \left(0, \min\!\left(\frac{r_n}{2}, \frac{1}{2^{n+1}}, d(x_{n+1}, \partial B(x_n, r_n))\right)\right)
$$

sao cho $\overline{B}(x_{n+1}, r_{n+1}) \subseteq B(x_n, r_n) \setminus \overline{A_{n+1}}$.

**Kết luận**:

Dãy $(x_n)$ thỏa: với $m > n$, $x_m \in \overline{B}(x_n, r_n)$, nên:

$$
d(x_m, x_n) \leq r_n \leq \frac{1}{2^n} \to 0
$$

Vậy $(x_n)$ là dãy Cauchy. Vì $X$ đầy đủ, $x_n \to x^* \in X$.

Với mỗi $n$, mọi $x_m$ với $m \geq n$ đều thuộc $\overline{B}(x_n, r_n)$ (đóng), nên $x^* \in \overline{B}(x_n, r_n)$.

Nhưng $\overline{B}(x_n, r_n) \cap A_n = \emptyset$, suy ra $x^* \notin A_n$ với mọi $n$.

Điều này mâu thuẫn với $x^* \in X = \bigcup_n A_n$. $\blacksquare$

---

## Hệ quả quan trọng

> [!corollary] Corollary A0.2 — BCT cho không gian Baire
> Giao đếm được của các tập mở trù mật trong không gian metric đầy đủ vẫn trù mật.

**Proof.** Nếu $(U_n)$ là các tập mở trù mật, đặt $F_n = X \setminus U_n$ — đóng, nowhere dense (vì $U_n$ trù mật nên $F_n$ không có phần trong). Nếu $\bigcap_n U_n$ không trù mật thì $\bigcup_n F_n$ chứa một quả cầu mở — mâu thuẫn BCT. $\blacksquare$

> [!corollary] Corollary A0.3 — $\mathbb{R} \setminus \mathbb{Q}$ trù mật
> Tập số vô tỉ trù mật trong $\mathbb{R}$: giao $\mathbb{R} \setminus \mathbb{Q} = \bigcap_{q \in \mathbb{Q}} (\mathbb{R} \setminus \{q\})$ của các tập mở trù mật.

---

## Ghi chú kỹ thuật

> [!note] Remark A0.4
> Định lý còn đúng cho **locally compact Hausdorff spaces** (với cùng kết luận). Chứng minh giống nhau, nhưng thay "quả cầu đóng" bằng "tập đóng compact trong lân cận compact".
>
> BCT **không đúng** cho không gian metric không đầy đủ: $\mathbb{Q} = \bigcup_{q \in \mathbb{Q}} \{q\}$ là hợp đếm được của tập nowhere dense.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Theorem 2.2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Theorem 4.7-2.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Theorem 5.8.
