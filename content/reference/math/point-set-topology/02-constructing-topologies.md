---
title: "02. Constructing Topologies"
tags: [math, point-set-topology, lesson-02]
aliases: [Constructing Topologies]
created: 2026-03-28
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]] — định nghĩa topology, basis, subbasis
> **Objectives**:
> - Xây dựng và hiểu subspace topology từ không gian lớn hơn
> - Nắm order topology trên tập có thứ tự và nhận ra nó trên $\mathbb{R}$
> - Hiểu product topology theo nghĩa Tychonoff (hữu hạn và vô hạn)
> - Phân biệt product topology với box topology và biết khi nào chúng trùng nhau

---

## Motivation / Intuition

Có ba câu hỏi tự nhiên khi ta đã có khái niệm không gian topo:

1. **Từ không gian lớn sang nhỏ**: Tập con $[0,1] \subset \mathbb{R}$ nên được gán topology nào? Ta muốn topology này "kế thừa" cấu trúc của $\mathbb{R}$, không phải tùy tiện.

2. **Từ thứ tự sang topology**: Đường thực $\mathbb{R}$ có cả hai cấu trúc — thứ tự tuyến tính và topology Euclidean. Liệu thứ tự tuyến tính có **tự động sinh ra** topology không?

3. **Từ nhiều không gian sang tích**: Mặt phẳng $\mathbb{R}^2 = \mathbb{R} \times \mathbb{R}$ là tích Cartesian. Topology trên $\mathbb{R}^2$ nên liên quan đến topology trên mỗi $\mathbb{R}$ như thế nào?

Ba câu hỏi này dẫn đến ba cách xây dựng chuẩn: **subspace topology**, **order topology**, và **product topology**. Hiểu chúng rõ là nền tảng cho hầu hết mọi ví dụ cụ thể trong topology.

---

## Subspace Topology

### Định nghĩa

> [!definition] Definition 2.1 — Subspace Topology (Topology cảm sinh)
> Cho $(X, \mathcal{T})$ là không gian topo và $Y \subseteq X$. **Subspace topology** trên $Y$ là:
>
> $$
> \mathcal{T}_Y = \{ U \cap Y : U \in \mathcal{T} \}.
> $$
>
> Cặp $(Y, \mathcal{T}_Y)$ gọi là **không gian con (subspace)** của $(X, \mathcal{T})$.

> [!theorem] Theorem 2.2 — $\mathcal{T}_Y$ là topology
> Họ $\mathcal{T}_Y$ định nghĩa ở trên là một topology trên $Y$.

**Proof.** Kiểm tra ba tiên đề:

1. $\emptyset = \emptyset \cap Y \in \mathcal{T}_Y$ và $Y = X \cap Y \in \mathcal{T}_Y$. ✓

2. Nếu $\{V_\alpha\} \subseteq \mathcal{T}_Y$ với $V_\alpha = U_\alpha \cap Y$, thì $\bigcup_\alpha V_\alpha = \left(\bigcup_\alpha U_\alpha\right) \cap Y \in \mathcal{T}_Y$ vì $\bigcup_\alpha U_\alpha \in \mathcal{T}$. ✓

3. Tương tự, $V_1 \cap V_2 = (U_1 \cap Y) \cap (U_2 \cap Y) = (U_1 \cap U_2) \cap Y \in \mathcal{T}_Y$. ✓

$\blacksquare$

> [!example] Example 2.3 — Subspace $[0,1] \subset \mathbb{R}$
> Subspace topology trên $[0,1]$ từ $\mathbb{R}$ (topology Euclidean) gồm các tập dạng $U \cap [0,1]$ với $U$ mở trong $\mathbb{R}$. Ví dụ:
>
> - $(0.2, 0.8) = (0.2, 0.8) \cap [0,1]$ — mở trong $[0,1]$ (cũng mở trong $\mathbb{R}$).
> - $[0, 0.5) = (-\infty, 0.5) \cap [0,1]$ — mở trong $[0,1]$ nhưng **không mở** trong $\mathbb{R}$!
> - $(0.3, 1] = (0.3, +\infty) \cap [0,1]$ — mở trong $[0,1]$ nhưng không mở trong $\mathbb{R}$.
>
> Nhận xét quan trọng: **"mở trong subspace" và "mở trong không gian bao" là hai khái niệm khác nhau.**

> [!warning] Counterexample 2.4 — Subspace không "nhìn thấy" cấu trúc bên ngoài
> Xét $Y = \mathbb{Q} \subset \mathbb{R}$ với subspace topology. Tập $(-\infty, \sqrt{2}) \cap \mathbb{Q} = \{q \in \mathbb{Q} : q < \sqrt{2}\}$ là **mở** trong $\mathbb{Q}$ (vì $(-\infty, \sqrt{2})$ mở trong $\mathbb{R}$), mặc dù nó là một "nửa thẳng" trông kỳ lạ từ góc nhìn của $\mathbb{R}$.

### Basis của subspace

> [!theorem] Theorem 2.5 — Basis của subspace
> Nếu $\mathcal{B}$ là basis cho $(X, \mathcal{T})$, thì $\mathcal{B}_Y = \{B \cap Y : B \in \mathcal{B}\}$ là basis cho $(Y, \mathcal{T}_Y)$.

**Proof.** Mọi open set trong $Y$ có dạng $U \cap Y$ với $U \in \mathcal{T}$; vì $U = \bigcup_\alpha B_\alpha$ (hợp của basis elements), ta có $U \cap Y = \bigcup_\alpha (B_\alpha \cap Y)$. $\blacksquare$

---

## Order Topology

### Định nghĩa

> [!definition] Definition 2.6 — Simply Ordered Set (Tập thứ tự toàn phần)
> Một **thứ tự toàn phần (simple order / linear order)** trên tập $X$ là quan hệ $<$ thỏa mãn:
>
> 1. **Phi phản xạ**: không có $x < x$.
> 2. **Không so sánh được với chính nó**: với $x \neq y$, đúng một trong hai: $x < y$ hoặc $y < x$.
> 3. **Bắc cầu**: $x < y$ và $y < z$ kéo theo $x < z$.

> [!definition] Definition 2.7 — Order Topology (Topology thứ tự)
> Cho $(X, <)$ là tập có thứ tự toàn phần với $|X| > 1$. **Order topology** trên $X$ là topology sinh bởi subbasis $\mathcal{S}$ gồm các tập dạng:
>
> $$
> (-\infty, b) = \{x \in X : x < b\}, \quad (a, +\infty) = \{x \in X : x > a\}.
> $$
>
> Basis tương ứng gồm: $X$ và tất cả các **khoảng mở (open intervals)**:
>
> $$
> (a, b) = \{x \in X : a < x < b\},
> $$
>
> cùng với các **rays** $(-\infty, b)$ và $(a, +\infty)$ (nếu $X$ không có min/max).
>
> Nếu $X$ có phần tử nhỏ nhất $a_0$, thêm vào basis các **half-open intervals** $[a_0, b) = \{x : x < b\}$. Tương tự với phần tử lớn nhất.

> [!example] Example 2.8 — Order Topology trên $\mathbb{R}$
> Với thứ tự thông thường trên $\mathbb{R}$, order topology trùng với topology Euclidean. Basis gồm các khoảng mở $(a,b)$ — đúng như định nghĩa topology Euclidean.

> [!example] Example 2.9 — Order Topology trên $\mathbb{Z}$
> Với thứ tự thông thường trên $\mathbb{Z}$, mỗi điểm $\{n\} = (n-1, n+1)$ là open set, nên order topology trên $\mathbb{Z}$ là discrete topology.

> [!example] Example 2.10 — Ordered Square $[0,1]^2$
> Xét $[0,1] \times [0,1]$ với **thứ tự từ điển (lexicographic order)**: $(a,b) < (c,d)$ nếu $a < c$, hoặc $a = c$ và $b < d$. Order topology trên $[0,1]^2$ với thứ tự này **khác** với product topology của $[0,1]$ với chính nó — ví dụ kinh điển cho thấy cùng một tập có thể nhận các topology rất khác nhau.

---

## Product Topology

### Product hữu hạn

> [!definition] Definition 2.11 — Product Topology (hữu hạn)
> Cho $(X_1, \mathcal{T}_1)$ và $(X_2, \mathcal{T}_2)$ là hai không gian topo. **Product topology** trên $X_1 \times X_2$ là topology sinh bởi basis:
>
> $$
> \mathcal{B} = \{U_1 \times U_2 : U_1 \in \mathcal{T}_1,\, U_2 \in \mathcal{T}_2\}.
> $$

> [!theorem] Theorem 2.12 — $\mathcal{B}$ là basis
> Họ $\mathcal{B}$ trên là một basis cho một topology trên $X_1 \times X_2$.

**Proof.** Điều kiện (1): với $(x_1, x_2) \in X_1 \times X_2$, ta có $X_1 \times X_2 \in \mathcal{B}$, nên điểm bất kỳ được phủ. Điều kiện (2): $(U_1 \times U_2) \cap (V_1 \times V_2) = (U_1 \cap V_1) \times (U_2 \cap V_2) \in \mathcal{B}$, vì $U_1 \cap V_1 \in \mathcal{T}_1$ và $U_2 \cap V_2 \in \mathcal{T}_2$. $\blacksquare$

> [!example] Example 2.13 — Product topology trên $\mathbb{R}^2$
> Product topology trên $\mathbb{R} \times \mathbb{R}$ (mỗi $\mathbb{R}$ với topology Euclidean) có basis gồm các hình chữ nhật mở $(a,b) \times (c,d)$. Topology này **trùng với** topology Euclidean trên $\mathbb{R}^2$ (vì mọi đĩa mở là hợp của hình chữ nhật mở, và ngược lại).

### Product vô hạn — Tychonoff vs Box

> [!definition] Definition 2.14 — Product Topology (vô hạn — Tychonoff)
> Cho $\{(X_\alpha, \mathcal{T}_\alpha)\}_{\alpha \in I}$ là một họ không gian topo (với $I$ tập chỉ số bất kỳ). **Product topology** (Tychonoff) trên $\prod_{\alpha \in I} X_\alpha$ là topology sinh bởi subbasis:
>
> $$
> \mathcal{S} = \left\{ \pi_\alpha^{-1}(U_\alpha) : \alpha \in I,\, U_\alpha \in \mathcal{T}_\alpha \right\},
> $$
>
> trong đó $\pi_\alpha : \prod_\beta X_\beta \to X_\alpha$ là **projection map**.
>
> Các basis elements là giao **hữu hạn** của các phần tử subbasis — tức tập dạng $\prod_\alpha U_\alpha$ với $U_\alpha \in \mathcal{T}_\alpha$ và $U_\alpha = X_\alpha$ cho mọi $\alpha$ **ngoại trừ hữu hạn** nhiều $\alpha$.

> [!definition] Definition 2.15 — Box Topology
> **Box topology** trên $\prod_{\alpha \in I} X_\alpha$ là topology sinh bởi basis:
>
> $$
> \mathcal{B}_{\text{box}} = \left\{ \prod_{\alpha \in I} U_\alpha : U_\alpha \in \mathcal{T}_\alpha \text{ với mọi } \alpha \right\}.
> $$
>
> Khác biệt so với product topology: $U_\alpha$ có thể khác $X_\alpha$ tại **vô hạn** nhiều $\alpha$.

> [!note] Remark 2.16 — So sánh Box và Product
> Với chỉ số hữu hạn ($|I| < \infty$), Box topology và Product topology trùng nhau. Khi $I$ vô hạn, Box topology **mịn hơn** Product topology (có nhiều open sets hơn).
>
> Tại sao lại dùng Product (Tychonoff) thay vì Box? Vì Product topology có tính chất đẹp hơn nhiều — đặc biệt, **Tychonoff's Theorem** (bài 12) phát biểu rằng tích (Tychonoff) của các không gian compact là compact. Điều này **sai** với Box topology.

> [!warning] Counterexample 2.17 — Box topology phá tính liên tục
> Xét $f : \mathbb{R} \to \mathbb{R}^\omega$ định nghĩa bởi $f(t) = (t, t, t, \ldots)$. Với **product topology** trên $\mathbb{R}^\omega$, hàm $f$ liên tục. Với **box topology**, $f$ **không** liên tục: tập $\prod_{n=1}^\infty \left(-\frac{1}{n}, \frac{1}{n}\right)$ mở trong box topology, nhưng $f^{-1}$ của nó là $\{0\}$ — không mở trong $\mathbb{R}$.

### Tính chất của product topology

> [!theorem] Theorem 2.18 — Projection maps liên tục và mở
> Với product topology (Tychonoff), mỗi projection $\pi_\alpha : \prod_\beta X_\beta \to X_\alpha$ là:
> 1. **Liên tục**: $\pi_\alpha^{-1}(U_\alpha) \in \mathcal{S} \subseteq \mathcal{T}_{\text{prod}}$ với mọi $U_\alpha$ mở.
> 2. **Surjective** (toàn ánh).
> 3. **Open map**: ảnh của open set qua $\pi_\alpha$ là open set.

> [!theorem] Theorem 2.19 — Universal property của product topology
> Product topology là topology **thô nhất** trên $\prod_\alpha X_\alpha$ làm cho tất cả các projection $\pi_\alpha$ liên tục. Nói cách khác: cho $f : Z \to \prod_\alpha X_\alpha$, thì $f$ liên tục khi và chỉ khi $\pi_\alpha \circ f : Z \to X_\alpha$ liên tục với mọi $\alpha$.

**Proof sketch.** ($\Rightarrow$) Hợp của ánh xạ liên tục là liên tục. ($\Leftarrow$) Đủ kiểm tra $f^{-1}(S)$ mở với mọi $S \in \mathcal{S}$; mà $S = \pi_\alpha^{-1}(U_\alpha)$ nên $f^{-1}(S) = (\pi_\alpha \circ f)^{-1}(U_\alpha)$ mở theo giả thiết. $\blacksquare$

---

## Tổng hợp: Quan hệ giữa các topology

Cho $X \times Y$ với product topology, và $A \subseteq X$, $B \subseteq Y$:

$$
\text{Subspace topology trên } A \times B = \text{Product topology của } (A, \mathcal{T}_A) \times (B, \mathcal{T}_B).
$$

Tức là hai cách xây dựng — lấy subspace rồi lấy product, hay lấy product rồi lấy subspace — cho cùng kết quả. Đây là một ví dụ của tính **tự nhiên (naturality)** trong topology.

---

## SageMath Cheatsheet

```python
# Minh họa product topology và subspace bằng Python

# Subspace topology: mô phỏng trên tập hữu hạn
X = {1, 2, 3, 4, 5}
T_X = [frozenset(), frozenset(X),
       frozenset({1,2}), frozenset({3,4,5}),
       frozenset({1}), frozenset({2})]

Y = {1, 2, 3}
# Subspace topology: cắt Y với mỗi open set của X
T_Y = list({frozenset(u & Y) for u in T_X})
print("Subspace topology trên Y:", [set(s) for s in T_Y])
# Kết quả: [set(), {1, 2, 3}, {1, 2}, {1}, {2}]

# Product topology: basis = tích Cartesian của các open sets
from itertools import product as cart_product

X1 = {0, 1}
T1 = [frozenset(), frozenset(X1), frozenset({0}), frozenset({1})]

X2 = {'a', 'b'}
T2 = [frozenset(), frozenset(X2), frozenset({'a'})]

# Basis của product topology
basis = [frozenset(cart_product(u1, u2)) for u1 in T1 for u2 in T2]
print("\nBasis của product topology:")
for b in basis:
    print(" ", set(b))

# Box topology = product topology khi số lượng không gian hữu hạn
# (chúng trùng nhau khi chỉ số hữu hạn)
```

---

## Summary / Key Takeaways

- **Subspace topology** $\mathcal{T}_Y = \{U \cap Y : U \in \mathcal{T}\}$: cách tự nhiên gán topology cho tập con; "mở trong subspace" $\neq$ "mở trong không gian bao".
- **Order topology**: topology sinh từ thứ tự toàn phần qua subbasis của rays; trùng Euclidean trên $\mathbb{R}$, trùng discrete trên $\mathbb{Z}$.
- **Product topology** (Tychonoff): subbasis là nghịch ảnh của các projection; basis là tích với $U_\alpha \neq X_\alpha$ chỉ tại **hữu hạn** nhiều tọa độ.
- **Box topology**: basis là tích tùy ý — mịn hơn product topology khi $|I| = \infty$; phá tính liên tục và compactness.
- Universal property: Product topology là topology thô nhất làm cho mọi projection liên tục.
- Subspace của product = product của subspaces: hai cách xây dựng cho cùng kết quả.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§15–19.
- Willard, S. *General Topology*, §§5–8.
- Sharifi, R. *Point-Set Topology* (UCLA notes), §1.2–1.3.
- Hatcher, A. *Notes on Introductory Point-Set Topology*, §1.
