---
title: "A3. Proof of Baire Category Theorem"
tags: [math, point-set-topology, appendix]
aliases: [Proof of Baire Category Theorem]
created: 2026-03-30
---

> **Liên quan**: [[14-complete-metric-function-spaces|14. Complete Metric Spaces & Function Spaces]]
> Chứng minh đầy đủ Baire Category Theorem cho cả hai trường hợp: complete metric space và locally compact Hausdorff space.

---

## Phát biểu đầy đủ

> [!theorem] Theorem A3.1 — Baire Category Theorem
> Mỗi trong hai điều kiện sau đủ để kết luận: **giao đếm được của các open dense sets là dense** (tương đương: hợp đếm được của các nowhere dense sets có interior rỗng):
>
> **(BCT1)** $X$ là **complete metric space**.
>
> **(BCT2)** $X$ là **locally compact Hausdorff space**.

---

## Chứng minh BCT1: Complete Metric Space

**Mục tiêu**: Cho $\{U_n\}_{n=1}^\infty$ là họ đếm được các open dense sets trong complete metric space $(X, d)$. Cần chứng minh $D = \bigcap_{n=1}^\infty U_n$ dense trong $X$: với mọi open $V \neq \emptyset$, ta có $V \cap D \neq \emptyset$.

**Chứng minh**:

Bắt đầu với open $V \neq \emptyset$ bất kỳ. Ta xây dựng một dãy lồng nhau của open balls.

**Bước 1**: Vì $U_1$ dense, $U_1 \cap V \neq \emptyset$. Chọn $x_1 \in U_1 \cap V$ và $r_1 > 0$ sao cho:

$$
\overline{B}(x_1, r_1) \subseteq U_1 \cap V \quad \text{với } r_1 < 1.
$$

(Được vì $U_1 \cap V$ là open set không rỗng.)

**Bước $n+1$**: Giả sử đã có $\overline{B}(x_n, r_n)$ với $\overline{B}(x_n, r_n) \subseteq U_n$ và $r_n < \frac{1}{n}$. Vì $U_{n+1}$ dense, $U_{n+1} \cap B(x_n, r_n) \neq \emptyset$. Chọn $x_{n+1}$ và $r_{n+1} > 0$ với:

$$
\overline{B}(x_{n+1}, r_{n+1}) \subseteq U_{n+1} \cap B(x_n, r_n) \quad \text{và} \quad r_{n+1} < \frac{1}{n+1}.
$$

**Tính chất của dãy xây dựng**:

1. $\overline{B}(x_{n+1}, r_{n+1}) \subseteq B(x_n, r_n) \subseteq \overline{B}(x_n, r_n)$ — lồng nhau.
2. $\operatorname{diam}(\overline{B}(x_n, r_n)) \leq \frac{2}{n} \to 0$.
3. Với $m, n > N$: $x_m, x_n \in B(x_N, r_N)$, nên $d(x_m, x_n) < \frac{2}{N} \to 0$ — $(x_n)$ là dãy Cauchy.

**Kết luận**: Vì $X$ complete, $(x_n)$ hội tụ đến $x \in X$. Vì $x_k \in \overline{B}(x_n, r_n)$ với mọi $k \geq n$, và $\overline{B}(x_n, r_n)$ đóng, ta có $x \in \overline{B}(x_n, r_n) \subseteq U_n$ với mọi $n$. Hơn nữa $x \in \overline{B}(x_1, r_1) \subseteq V$. Vậy:

$$
x \in V \cap \bigcap_{n=1}^\infty U_n = V \cap D \neq \emptyset. \quad \blacksquare
$$

---

## Chứng minh BCT2: Locally Compact Hausdorff

**Mục tiêu**: Tương tự BCT1 nhưng với LCH space thay complete metric space.

**Chứng minh**:

Cho $\{U_n\}$ là họ đếm được open dense sets trong LCH space $X$. Cho $V \neq \emptyset$ open. Cần chứng minh $V \cap \bigcap U_n \neq \emptyset$.

**Bước 1**: $U_1 \cap V \neq \emptyset$ (dense). Vì $X$ LCH, có neighborhood basis gồm các open sets với closure compact (Theorem 8.6). Chọn $x_1 \in U_1 \cap V$ và $W_1$ mở với $x_1 \in W_1$, $\overline{W_1}$ compact, và $\overline{W_1} \subseteq U_1 \cap V$.

**Bước $n+1$**: Giả sử có $W_n$ mở với $\overline{W_n}$ compact, $\overline{W_n} \subseteq U_n$. Vì $U_{n+1}$ dense, $U_{n+1} \cap W_n \neq \emptyset$. Chọn $W_{n+1}$ mở với $\overline{W_{n+1}}$ compact và:

$$
\overline{W_{n+1}} \subseteq U_{n+1} \cap W_n \subseteq \overline{W_n}.
$$

**Tính chất**: Dãy $\overline{W_1} \supseteq \overline{W_2} \supseteq \cdots$ là dãy lồng nhau các compact không rỗng.

**Kết luận**: Corollary 7.18 (Nested compact sets) cho $\bigcap_{n=1}^\infty \overline{W_n} \neq \emptyset$. Mọi điểm $x$ trong giao này thỏa $x \in \overline{W_n} \subseteq U_n$ với mọi $n$, và $x \in \overline{W_1} \subseteq V$. Vậy $x \in V \cap D \neq \emptyset$. $\blacksquare$

---

## Nhận xét và So sánh

**Tại sao hai điều kiện khác nhau lại cùng cho BCT?**

Trong BCT1 (complete metric): công cụ là Cantor Intersection — dùng dãy Cauchy và completeness để tìm điểm giới hạn. Đường kính balls $\to 0$ thay thế cho compact closures.

Trong BCT2 (LCH): công cụ là Nested compact sets — không cần metric, chỉ cần "mỗi closure compact". Compactness đóng vai trò thay thế completeness.

**Điểm chung**: cả hai đều xây dựng một dãy lồng nhau của sets nhỏ dần, rồi lấy giao để tìm điểm thuộc $\bigcap U_n$. Sự khác biệt nằm ở công cụ đảm bảo giao khác rỗng.

---

## Hệ quả quan trọng

> [!corollary] Corollary A3.2 — $X$ không là hợp đếm được của nowhere dense sets
> Trong complete metric space hoặc LCH space $X$ không rỗng: $X$ không phải là hợp đếm được của các nowhere dense sets. Tức $X$ không **meager** (first category) trong chính nó.

> [!corollary] Corollary A3.3 — Open subspace của BCT space là BCT space
> Nếu $X$ thỏa BCT (complete metric hoặc LCH) và $U \subseteq X$ mở, thì $U$ cũng thỏa BCT.

*Proof cho BCT1*: $U$ là open subspace của complete metric space. Định nghĩa metric tương đương trên $U$: $d'(x,y) = d(x,y) + |1/d(x, X\setminus U) - 1/d(y, X\setminus U)|$ làm $U$ complete với metric này. $\blacksquare$

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §48 (Theorem 48.2).
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Theorem 5.6.
- Folland, G. B. *Real Analysis* (2nd ed.), Theorem 5.14.
- Baire, R. *Sur les fonctions de variables réelles*, 1899.
