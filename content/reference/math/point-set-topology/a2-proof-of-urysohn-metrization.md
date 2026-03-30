---
title: "A2. Proof of Urysohn Metrization Theorem"
tags: [math, point-set-topology, appendix]
aliases: [Proof of Urysohn Metrization]
created: 2026-03-30
---

> **Liên quan**: [[13-metrization-paracompactness|13. Metrization Theorems & Paracompactness]]
> Chứng minh đầy đủ Urysohn Metrization Theorem qua embedding vào Hilbert cube.

---

## Phát biểu lại

> [!theorem] Theorem A2.1 — Urysohn Metrization Theorem
> Nếu $X$ là không gian topo **second countable** và **regular** ($T_3$), thì $X$ **metrizable**.

---

## Bước 0: Chuẩn bị — Hilbert Cube metrizable

**Hilbert cube** $H = [0,1]^\omega = \prod_{n=1}^\infty [0,1]$ với product topology được trang bị metric:

$$
d(x, y) = \sum_{n=1}^\infty \frac{|x_n - y_n|}{2^n}.
$$

> [!theorem] Theorem A2.2 — $d$ là metric sinh ra product topology trên $H$
> Metric $d$ xác định tốt (chuỗi hội tụ vì $|x_n - y_n| \leq 1$) và topology của $(H, d)$ trùng với product topology.

**Proof sketch.** Hội tụ theo $d$ tương đương hội tụ tọa độ từng phần (coordinatewise convergence) — chính là hội tụ trong product topology. $\blacksquare$

---

## Bước 1: Second countable + Regular $\Rightarrow$ Normal

> [!lemma] Lemma A2.3
> Mọi regular Lindelöf space đều normal.

**Proof.** Cho $A, B$ đóng rời nhau trong regular Lindelöf $X$. Với mỗi $a \in A$: regular cho $U_a \ni a$ mở với $\overline{U_a} \cap B = \emptyset$. Họ $\{U_a\}_{a \in A} \cup \{X \setminus A\}$ là open cover; vì Lindelöf, có countable subcover $\{U_{a_n}\}$. Tương tự xây dựng $\{V_{b_n}\}$ phủ $B$ với $\overline{V_{b_n}} \cap A = \emptyset$. Đặt:

$$
U_n' = U_{a_n} \setminus \bigcup_{k=1}^n \overline{V_{b_k}}, \quad V_n' = V_{b_n} \setminus \bigcup_{k=1}^n \overline{U_{a_k}}.
$$

Thì $U = \bigcup_n U_n'$ và $V = \bigcup_n V_n'$ là open sets với $A \subseteq U$, $B \subseteq V$, $U \cap V = \emptyset$. $\blacksquare$

Vì second countable $\Rightarrow$ Lindelöf (Theorem 9.21) và $X$ regular, suy ra $X$ **normal**. Do đó Urysohn's Lemma áp dụng được trên $X$.

---

## Bước 2: Xây dựng họ hàm phân tách

Cho $\mathcal{B} = \{B_n\}_{n \geq 1}$ là countable basis của $X$.

Định nghĩa tập chỉ số:

$$
\mathcal{P} = \{(n, m) : n, m \in \mathbb{N}^+,\ \overline{B_n} \subseteq B_m\}.
$$

**Claim**: $\mathcal{P}$ đếm được (vì $\mathbb{N}^+ \times \mathbb{N}^+$ đếm được) và "đủ phong phú" theo nghĩa: với mọi $x \in X$ và open set $U \ni x$, tồn tại $(n,m) \in \mathcal{P}$ với $x \in B_n$ và $B_m \subseteq U$.

*Proof of Claim*: Vì $X$ regular, có $V$ mở với $x \in V \subseteq \overline{V} \subseteq U$. Có $B_m \subseteq V$ với $x \in B_m$ (dùng basis). Lại có $B_n \subseteq V$ với $x \in B_n$ và $\overline{B_n} \subseteq V \subseteq B_m$... Cụ thể hơn: tồn tại $B_n \ni x$ với $\overline{B_n} \subseteq V$, rồi $B_m \ni x$ với $B_m \subseteq V$ — sau đó áp dụng regular một lần nữa. $\blacksquare$

Với mỗi $(n,m) \in \mathcal{P}$: $\overline{B_n}$ và $X \setminus B_m$ là hai tập đóng rời nhau. Urysohn's Lemma cho hàm liên tục:

$$
f_{nm} : X \to [0,1], \quad f_{nm}|_{\overline{B_n}} = 0, \quad f_{nm}|_{X \setminus B_m} = 1.
$$

Sắp xếp lại $\{f_{nm}\}_{(n,m) \in \mathcal{P}}$ thành dãy $\{f_k\}_{k \geq 1}$ (vì $\mathcal{P}$ đếm được).

---

## Bước 3: Định nghĩa embedding $F : X \to [0,1]^\omega$

$$
F(x) = (f_1(x), f_2(x), \ldots) \in [0,1]^\omega = H.
$$

$F$ liên tục: mỗi tọa độ $f_k$ liên tục và product topology.

---

## Bước 4: $F$ là embedding

**$F$ injective**: Cho $x \neq y$. Vì $X$ là $T_1$ (regular $\Rightarrow$ $T_1$), $\{y\}$ đóng và $x \notin \{y\}$. Vì regular, có $B_m \ni x$ với $y \notin B_m$. Có $(n,m) \in \mathcal{P}$ với $x \in B_n \subseteq \overline{B_n} \subseteq B_m$. Khi đó $f_{nm}(x) = 0$ nhưng $f_{nm}(y) = 1$ (vì $y \notin B_m$). Vậy $F(x) \neq F(y)$.

**$F$ open vào $F(X)$**: Cần chứng minh $F(U)$ mở trong $F(X)$ với mọi $U$ mở trong $X$.

Cho $F(x) \in F(U)$; cần tìm open set trong $H$ gặp $F(X)$ trong $F(U)$.

Dùng Claim từ Bước 2: có $(n,m) \in \mathcal{P}$ với $x \in B_n$ và $B_m \subseteq U$. Tồn tại $(k,l) \in \mathcal{P}$ với $x \in B_k \subseteq \overline{B_k} \subseteq B_n$ (áp dụng regular và basis). Thì $f_{kn}(x) = 0$.

Xét open set trong $H$: $W = \{z \in H : z_{kn} < \frac{1}{2}\}$ (trong đó $kn$ là chỉ số của $f_{kn}$ trong dãy $\{f_j\}$). Thì $F(x) \in W$.

Với $y$ bất kỳ thỏa $F(y) \in W \cap F(X)$: $f_{kn}(y) < \frac{1}{2}$, nên $y \notin X \setminus B_n = f_{kn}^{-1}(1)$, tức $y \in B_n \subseteq B_m \subseteq U$. Vậy $F(y) \in F(U)$.

Do đó $W \cap F(X) \subseteq F(U)$, tức $F(U)$ mở trong $F(X)$. $\blacksquare$

---

## Bước 5: Kết luận

$F : X \to F(X) \subseteq H$ là homeomorphism. Vì $H$ metrizable (Bước 0), $F(X)$ là subspace của $H$ — cũng metrizable. Vậy $X \cong F(X)$ metrizable. $\blacksquare$

---

## Nhận xét

Chứng minh trên thực chất chứng minh mệnh đề mạnh hơn:

> **$X$ second countable regular $\Rightarrow$ $X$ embeds vào $[0,1]^\omega$ (Hilbert cube).**

Điều này cho ta biết mọi không gian second countable regular đều là subspace của một không gian cụ thể và "đơn giản" — Hilbert cube. Hilbert cube là không gian compact metrizable "phổ quát" cho lớp này.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §34 (Theorem 34.1).
- Willard, S. *General Topology*, Theorem 23.1.
- Kelley, J. L. *General Topology*, Theorem 4.16.
