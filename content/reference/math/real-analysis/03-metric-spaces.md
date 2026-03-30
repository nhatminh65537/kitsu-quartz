---
title: "03. Metric Spaces"
tags: [math, real-analysis, lesson-03]
aliases: [Metric Spaces]
created: 2026-03-28
---

> **Prerequisites**: [[01-the-real-number-system|01. The Real Number System]], [[02-cardinality-and-countability|02. Cardinality & Countability]] — Tập hợp, ánh xạ, tính chất $\mathbb{R}$
> **Objectives**:
> - Định nghĩa không gian metric và nhận ra các ví dụ chuẩn
> - Hiểu cấu trúc tô-pô: open sets, closed sets, interior, closure, boundary
> - Nắm vững khái niệm compact theo ba cách tương đương trong $\mathbb{R}^n$
> - Phát biểu và vận dụng định lý Heine-Borel
> - Hiểu connectedness và mô tả các tập liên thông trong $\mathbb{R}$

---

## Motivation / Intuition

Trong Calculus, ta hay nói "khoảng cách giữa hai điểm" hay "$x$ gần $a$" — nhưng ý nghĩa của "khoảng cách" phụ thuộc vào ngữ cảnh. Khoảng cách giữa hai điểm trên đường thẳng, trên mặt phẳng, hay giữa hai hàm liên tục thì khác nhau hoàn toàn.

**Không gian metric** là cách trừu tượng hóa khái niệm khoảng cách: thay vì gắn với $\mathbb{R}$ hay $\mathbb{R}^n$ cụ thể, ta chỉ cần một hàm $d$ thỏa ba tiên đề tự nhiên. Từ đó, toàn bộ ngôn ngữ "gần", "giới hạn", "liên tục" được định nghĩa một lần và hoạt động đồng nhất trên mọi không gian.

Ba khái niệm cốt lõi của bài này — **compact**, **complete**, **connected** — là nền tảng cho hầu hết các định lý phân tích phía sau.

---

## Không gian Metric (Metric Space)

### Definition

> [!definition] Definition 3.1 — Metric và không gian metric
> Cho $X$ là tập hợp khác rỗng. Một **metric** (hay **hàm khoảng cách**) trên $X$ là ánh xạ $d: X \times X \to \mathbb{R}$ thỏa ba tiên đề:
>
> 1. **Không âm và phi suy biến**: $d(x, y) \geq 0$, và $d(x, y) = 0 \Leftrightarrow x = y$
> 2. **Đối xứng**: $d(x, y) = d(y, x)$ với mọi $x, y \in X$
> 3. **Bất đẳng thức tam giác**: $d(x, z) \leq d(x, y) + d(y, z)$ với mọi $x, y, z \in X$
>
> Bộ $(X, d)$ gọi là **không gian metric**.

### Worked Example

> [!example] Example 3.2 — Các metric chuẩn
>
> **(a) Metric Euclid trên $\mathbb{R}^n$**:
>
> $$
> d_2(x, y) = \left(\sum_{i=1}^n (x_i - y_i)^2\right)^{1/2}
> $$
>
> **(b) Metric taxi cab (Manhattan) trên $\mathbb{R}^n$**:
>
> $$
> d_1(x, y) = \sum_{i=1}^n |x_i - y_i|
> $$
>
> **(c) Metric supremum trên $\mathbb{R}^n$**:
>
> $$
> d_\infty(x, y) = \max_{1 \leq i \leq n} |x_i - y_i|
> $$
>
> **(d) Metric rời rạc** trên mọi tập $X$:
>
> $$
> d(x, y) = \begin{cases} 0 & x = y \\ 1 & x \neq y \end{cases}
> $$
>
> **(e) Metric $\sup$ trên không gian hàm liên tục** $C([a,b])$:
>
> $$
> d(f, g) = \sup_{x \in [a,b]} |f(x) - g(x)|
> $$

> [!note] Remark 3.3
> Trên $\mathbb{R}^n$, các metric $d_1$, $d_2$, $d_\infty$ đều **tương đương tô-pô**: chúng sinh ra cùng tập open, cùng khái niệm hội tụ. Cụ thể: $d_\infty \leq d_2 \leq d_1 \leq n \cdot d_\infty$.

---

## Cấu trúc tô-pô: Open, Closed, Closure

### Definition

> [!definition] Definition 3.4 — Open ball và Neighborhood
> Trong không gian metric $(X, d)$, **open ball** (hình cầu mở) tâm $x \in X$ bán kính $r > 0$ là:
>
> $$
> B(x, r) = \{y \in X \mid d(x, y) < r\}
> $$
>
> Tập $U \subseteq X$ là **lân cận** (neighborhood) của $x$ nếu tồn tại $r > 0$ sao cho $B(x, r) \subseteq U$.

> [!definition] Definition 3.5 — Tập mở và tập đóng
> - $U \subseteq X$ là **tập mở** (open set) nếu với mọi $x \in U$, tồn tại $r > 0$ sao cho $B(x, r) \subseteq U$
> - $F \subseteq X$ là **tập đóng** (closed set) nếu $X \setminus F$ là tập mở

> [!theorem] Theorem 3.6 — Tính chất tô-pô của open/closed sets
> Trong không gian metric $(X, d)$:
>
> 1. $\emptyset$ và $X$ vừa mở vừa đóng
> 2. Hợp tùy ý (kể cả vô hạn) của tập mở là tập mở
> 3. Giao hữu hạn của tập mở là tập mở
> 4. Giao tùy ý của tập đóng là tập đóng
> 5. Hợp hữu hạn của tập đóng là tập đóng

**Proof (2).** Cho $\{U_\alpha\}$ là họ tập mở, $x \in \bigcup U_\alpha$. Thì $x \in U_{\alpha_0}$ cho một $\alpha_0$ nào đó, suy ra tồn tại $r > 0$: $B(x, r) \subseteq U_{\alpha_0} \subseteq \bigcup U_\alpha$. $\blacksquare$

> [!warning] Counterexample 3.7 — Giao vô hạn của tập mở có thể không mở
> Trên $\mathbb{R}$: $\bigcap_{n=1}^\infty \left(-\dfrac{1}{n}, \dfrac{1}{n}\right) = \{0\}$, là tập đóng (không mở).

### Definition

> [!definition] Definition 3.8 — Điểm giới hạn, Closure, Interior, Boundary
> Trong $(X, d)$, cho $E \subseteq X$:
>
> - $x$ là **điểm giới hạn** (limit point) của $E$ nếu mọi $B(x, r)$ đều chứa ít nhất một điểm của $E$ khác $x$
> - **Closure** (bao đóng): $\overline{E} = E \cup \{\text{mọi điểm giới hạn của } E\}$
> - **Interior** (phần trong): $E^\circ = \{x \in E \mid \exists r > 0: B(x,r) \subseteq E\}$
> - **Boundary** (biên): $\partial E = \overline{E} \setminus E^\circ$

> [!theorem] Theorem 3.9 — Đặc trưng của closed sets
> $E$ là tập đóng khi và chỉ khi $E = \overline{E}$, tức $E$ chứa tất cả các điểm giới hạn của nó.

**Proof.**
($\Rightarrow$) Nếu $E$ đóng và $x$ là điểm giới hạn của $E$, giả sử $x \notin E$. Khi đó $x \in X \setminus E$ (mở), nên tồn tại $r > 0$: $B(x,r) \subseteq X \setminus E$. Nhưng thế thì $B(x,r)$ không chứa điểm nào của $E$, mâu thuẫn. Vậy $x \in E$.

($\Leftarrow$) Nếu $E$ chứa mọi điểm giới hạn, ta chứng minh $X \setminus E$ mở: với $x \notin E$, thì $x$ không phải điểm giới hạn của $E$, nên tồn tại $r > 0$: $B(x,r) \cap E = \emptyset$, tức $B(x,r) \subseteq X \setminus E$. $\blacksquare$

### Worked Example

> [!example] Example 3.10 — Interior, Closure, Boundary của các tập trong $\mathbb{R}$
>
> | Tập $E$ | $E^\circ$ | $\overline{E}$ | $\partial E$ |
> |---------|----------|--------------|------------|
> | $(a, b)$ | $(a,b)$ | $[a,b]$ | $\{a, b\}$ |
> | $[a, b]$ | $(a,b)$ | $[a,b]$ | $\{a, b\}$ |
> | $\mathbb{Q}$ | $\emptyset$ | $\mathbb{R}$ | $\mathbb{R}$ |
> | $\mathbb{Z}$ | $\emptyset$ | $\mathbb{Z}$ | $\mathbb{Z}$ |
>
> Lưu ý: $\mathbb{Q}$ không có điểm trong ($\mathbb{Q}^\circ = \emptyset$) vì mọi khoảng đều chứa số vô tỷ. Và $\overline{\mathbb{Q}} = \mathbb{R}$ vì $\mathbb{Q}$ dày đặc trong $\mathbb{R}$.

---

## Tính compact (Compactness)

### Definition

> [!definition] Definition 3.11 — Open cover và Compactness
> Cho $(X, d)$ metric space và $K \subseteq X$.
>
> - Một **open cover** (phủ mở) của $K$ là họ tập mở $\{U_\alpha\}_{\alpha \in I}$ sao cho $K \subseteq \bigcup_{\alpha \in I} U_\alpha$
> - $K$ là **compact** nếu mọi open cover của $K$ đều có một **subcover hữu hạn** (finite subcover): tồn tại $\alpha_1, \ldots, \alpha_n$ sao cho $K \subseteq U_{\alpha_1} \cup \cdots \cup U_{\alpha_n}$

> [!note] Remark 3.12 — Trực giác về compactness
> Compact là cách hình thức hóa ý tưởng "tập hữu hạn về mặt tô-pô". Một tập compact không thể "trốn ra vô cực" hay có "lỗ hổng". Đây là tính chất mạnh nhất trong phân tích: hàm liên tục trên compact đạt max/min, đồng đều liên tục, v.v.

### Theorem

> [!theorem] Theorem 3.13 — Compact thì closed và bounded
> Trong bất kỳ metric space $(X, d)$: nếu $K$ compact thì $K$ đóng và bị chặn.

**Proof.**
**$K$ bị chặn**: Cố định $x_0 \in X$. Họ $\{B(x_0, n)\}_{n \in \mathbb{N}}$ là open cover của $K$. Vì $K$ compact, tồn tại subcover hữu hạn $B(x_0, n_1), \ldots, B(x_0, n_k)$. Khi đó $K \subseteq B(x_0, N)$ với $N = \max n_i$, nên $K$ bị chặn.

**$K$ đóng**: Cho $y \notin K$. Với mỗi $x \in K$, đặt $r_x = d(x,y)/2 > 0$. Họ $\{B(x, r_x)\}_{x \in K}$ là open cover của $K$, có subcover hữu hạn $B(x_1, r_1), \ldots, B(x_n, r_n)$. Đặt $r = \min r_i > 0$. Thì $B(y, r) \cap K = \emptyset$ (kiểm tra bằng tam giác bất đẳng thức), nên $y \notin \overline{K}$. Vậy $K$ đóng. $\blacksquare$

> [!theorem] Theorem 3.14 — Compact tương đương Sequential Compact
> Trong metric space, $K$ compact khi và chỉ khi $K$ **sequentially compact**: mọi dãy trong $K$ đều có dãy con hội tụ về một điểm trong $K$.

> [!theorem] Theorem 3.15 — Heine-Borel Theorem
> Trong $\mathbb{R}^n$ với metric Euclid: $K \subseteq \mathbb{R}^n$ compact **khi và chỉ khi** $K$ đóng và bị chặn.

Xem chứng minh đầy đủ tại [[a0-heine-borel|A0. Heine-Borel Theorem]].

> [!warning] Counterexample 3.16 — Heine-Borel **không** đúng trong metric space tùy ý
> Trên $C([0,1])$ với metric $\sup$: tập $\{f_n\}$ với $f_n(x) = x^n$ bị chặn (mọi $\|f_n\|_\infty \leq 1$) và đóng, nhưng **không compact** — dãy $(f_n)$ không có dãy con hội tụ trong $C([0,1])$ (vì giới hạn điểm là hàm không liên tục).
>
> Heine-Borel đặc biệt với $\mathbb{R}^n$ nhờ tính hoàn chỉnh và hữu hạn chiều.

### Worked Example

> [!example] Example 3.17 — Kiểm tra compactness
>
> Trong $\mathbb{R}^2$:
>
> - $[0,1]^2$: đóng và bị chặn → **compact** ✓
> - $(0,1)^2$: không đóng → **không compact** ✗
> - $\{(x,y) \mid x^2 + y^2 \leq 1\}$: đóng và bị chặn → **compact** ✓
> - $\mathbb{R}^2$: không bị chặn → **không compact** ✗
> - $\{(x, 1/x) \mid x > 0\}$: không bị chặn (khi $x \to 0^+$) → **không compact** ✗

### Theorem

> [!theorem] Theorem 3.18 — Tính chất của compact sets
>
> 1. Tập con đóng của compact là compact
> 2. Giao hữu hạn bất đẳng thức của compact sets khác rỗng (Finite Intersection Property)
> 3. Ảnh liên tục của compact là compact (sẽ chứng minh ở Bài 05)

**Proof (1).** Cho $K$ compact, $F \subseteq K$ đóng. Với open cover $\{U_\alpha\}$ của $F$, thêm $V = X \setminus F$ (mở vì $F$ đóng) để có open cover của $K$. Lấy subcover hữu hạn của $K$, bỏ $V$ đi, thu được subcover hữu hạn của $F$. $\blacksquare$

---

## Tính liên thông (Connectedness)

### Definition

> [!definition] Definition 3.19 — Separation và Connected Set
> Tập $E \subseteq X$ gọi là **không liên thông** (disconnected) nếu tồn tại hai tập mở $U, V \subseteq X$ sao cho:
>
> $$
> E \subseteq U \cup V, \quad E \cap U \neq \emptyset, \quad E \cap V \neq \emptyset, \quad E \cap U \cap V = \emptyset
> $$
>
> Cặp $(U, V)$ như vậy gọi là một **separation** của $E$.
>
> Tập $E$ là **liên thông** (connected) nếu không tồn tại separation nào.

> [!note] Remark 3.20 — Cách nhớ
> $E$ liên thông $\Leftrightarrow$ không thể chia $E$ thành hai phần "tách rời nhau hoàn toàn". Hình ảnh: $E$ là "một mảnh" duy nhất.

### Theorem

> [!theorem] Theorem 3.21 — Tập liên thông trong $\mathbb{R}$
> Một tập $E \subseteq \mathbb{R}$ liên thông khi và chỉ khi $E$ là một khoảng (interval): $(a,b)$, $[a,b]$, $[a,b)$, $(a,b]$, $(-\infty, b)$, $(a, +\infty)$, hoặc $\mathbb{R}$.

**Proof.**
($\Leftarrow$) Giả sử $E = [a,b]$ (các trường hợp khác tương tự). Nếu tồn tại separation $U, V$ của $E$, chọn $p \in U \cap E$, $q \in V \cap E$. WLOG $p < q$. Xét $c = \sup(U \cap [p,q])$. Kiểm tra $c \in E$ nhưng $c \notin U$ và $c \notin V$ — mâu thuẫn.

($\Rightarrow$) Nếu $E$ không phải khoảng, tồn tại $a < c < b$ với $a, b \in E$ nhưng $c \notin E$. Khi đó $U = (-\infty, c)$, $V = (c, +\infty)$ là separation của $E$. $\blacksquare$

### Worked Example

> [!example] Example 3.22 — Kiểm tra connectedness
>
> - $[0,1]$: khoảng → **liên thông** ✓
> - $[0,1] \cup [2,3]$: có separation $U = (-\infty, 1.5)$, $V = (1.5, \infty)$ → **không liên thông** ✗
> - $\mathbb{Q}$ trong $\mathbb{R}$: không phải khoảng → **không liên thông** ✗ (thực ra $\mathbb{Q}$ là totally disconnected)
> - Tập hình khuyên $\{(x,y) \mid 1 \leq x^2 + y^2 \leq 4\}$ trong $\mathbb{R}^2$: **liên thông** ✓

> [!theorem] Theorem 3.23 — Path-connected kéo theo Connected
> Tập $E$ là **path-connected** (liên thông đường) nếu với mọi $x, y \in E$, tồn tại đường liên tục $\gamma: [0,1] \to E$ với $\gamma(0) = x$, $\gamma(1) = y$. Mọi path-connected set đều connected.

---

## Không gian metric hoàn chỉnh (Complete Metric Space)

### Definition

> [!definition] Definition 3.24 — Dãy Cauchy và Completeness
> Trong $(X, d)$, dãy $(x_n)$ là **dãy Cauchy** (Cauchy sequence) nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists N \in \mathbb{N}:\; \forall m, n \geq N,\; d(x_m, x_n) < \varepsilon
> $$
>
> Không gian metric $(X, d)$ là **hoàn chỉnh** (complete) nếu mọi dãy Cauchy đều hội tụ trong $X$.

> [!theorem] Theorem 3.25 — $\mathbb{R}^n$ là complete
> Không gian $\mathbb{R}^n$ với metric Euclid là complete metric space.

> [!warning] Counterexample 3.26 — $\mathbb{Q}$ không complete
> Dãy $3, 3.1, 3.14, 3.141, 3.1415, \ldots$ (các xấp xỉ thập phân của $\pi$) là Cauchy trong $\mathbb{Q}$ nhưng hội tụ về $\pi \notin \mathbb{Q}$.

> [!theorem] Theorem 3.27 — Compact thì Complete
> Mọi compact metric space đều complete.

**Proof.** Cho $(x_n)$ Cauchy trong compact $K$. Vì $K$ sequentially compact, $(x_n)$ có dãy con $x_{n_k} \to x \in K$. Nhưng dãy Cauchy có dãy con hội tụ thì chính nó hội tụ (về cùng giới hạn). Vậy $x_n \to x \in K$. $\blacksquare$

---

## SageMath Cheatsheet

```python
import numpy as np

# Metric Euclid
def d2(x, y):
    return np.linalg.norm(np.array(x) - np.array(y))

# Metric taxi cab
def d1(x, y):
    return sum(abs(xi - yi) for xi, yi in zip(x, y))

# Metric sup
def dinf(x, y):
    return max(abs(xi - yi) for xi, yi in zip(x, y))

x, y = [1, 2], [4, 6]
print(f"d2 = {d2(x,y):.4f}")   # 5.0
print(f"d1 = {d1(x,y)}")       # 7
print(f"dinf = {dinf(x,y)}")   # 4

# Kiểm tra open ball (trực quan, 2D)
import matplotlib.pyplot as plt

theta = np.linspace(0, 2*np.pi, 200)
fig, axes = plt.subplots(1, 3, figsize=(12, 4))
labels = ['d2 (Euclidean)', 'd1 (Taxicab)', 'dinf (Sup)']

for ax, label in zip(axes, labels):
    ax.set_aspect('equal'); ax.set_title(label)
    ax.axhline(0, color='k', lw=0.5); ax.axvline(0, color='k', lw=0.5)

# d2: hình tròn
axes[0].plot(np.cos(theta), np.sin(theta), 'b')

# d1: hình thoi
sq = np.array([[1,0],[0,1],[-1,0],[0,-1],[1,0]])
axes[1].plot(sq[:,0], sq[:,1], 'r')

# dinf: hình vuông
s = np.array([[1,1],[1,-1],[-1,-1],[-1,1],[1,1]])
axes[2].plot(s[:,0], s[:,1], 'g')

plt.tight_layout()
plt.savefig('metric_balls.png', dpi=100)

# Kiểm tra Heine-Borel: dãy trong [0,1] có dãy con hội tụ
import random
seq = [random.random() for _ in range(1000)]  # dãy trong [0,1]

# Dãy con đơn điệu (luôn hội tụ trong tập compact)
monotone_sub = sorted(seq[:20])
print("Dãy con tăng (đoạn đầu):", monotone_sub[:5], "->", monotone_sub[-1])
```

---

## Summary / Key Takeaways

- **Metric space** $(X, d)$: hàm khoảng cách $d$ thỏa 3 tiên đề (không âm, đối xứng, tam giác bất đẳng thức).
- **Open set**: mọi điểm là điểm trong. **Closed set**: chứa mọi điểm giới hạn. Hai khái niệm **không** đối lập nhau — tập có thể vừa mở vừa đóng (clopen), hoặc không mở không đóng.
- **Compact**: mọi open cover có finite subcover $\Leftrightarrow$ mọi dãy có dãy con hội tụ (trong metric space).
- **Heine-Borel** (đặc biệt của $\mathbb{R}^n$): compact $\Leftrightarrow$ closed và bounded. **Không đúng** trong metric space tổng quát.
- **Connected**: không thể separation bởi hai open set. Trong $\mathbb{R}$: connected $\Leftrightarrow$ là khoảng.
- **Complete**: mọi dãy Cauchy hội tụ. $\mathbb{R}^n$ complete, $\mathbb{Q}$ không complete. Compact $\Rightarrow$ complete.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 2.
- Folland, G. B. *Real Analysis* (2nd ed.), Chapter 1.
- Munkres, J. R. *Topology* (2nd ed.), Chapters 3–4.
- MIT 18.100B Lecture Notes.
