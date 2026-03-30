---
title: "05. Metric Spaces"
tags: [math, point-set-topology, lesson-05]
aliases: [Metric Spaces]
created: 2026-03-29
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[04-continuous-functions-homeomorphisms|04. Continuous Functions & Homeomorphisms]]
> **Objectives**:
> - Định nghĩa metric và metric topology, nhận ra đây là lớp không gian topo đặc biệt quan trọng
> - Nắm các metric chuẩn trên $\mathbb{R}^n$: Euclidean, taxicab, sup metric
> - Hiểu khái niệm equivalent metrics và khi nào chúng sinh cùng topology
> - Chứng minh mọi metric space là Hausdorff và first-countable
> - Nắm đặc trưng liên tục và hội tụ trong metric spaces qua $\varepsilon$-$\delta$

---

## Motivation / Intuition

Topology học bắt đầu bằng câu hỏi: liệu ta có thể bỏ đi khái niệm "khoảng cách" và vẫn nói về liên tục, hội tụ? Câu trả lời là có. Tuy nhiên trong thực tế, phần lớn các không gian ta gặp — $\mathbb{R}^n$, không gian hàm, không gian xác suất — đều **có** khoảng cách. Metric spaces là lớp trung gian: tổng quát hơn $\mathbb{R}^n$ nhưng đặc thù hơn không gian topo tùy ý.

Điều quan trọng cần nhớ: **metric không phải là topology**. Cùng một tập có thể có nhiều metric khác nhau, và những metric khác nhau có thể sinh ra cùng topology (gọi là equivalent metrics). Mục tiêu của bài này là hiểu rõ mối quan hệ giữa metric và cấu trúc topo mà nó sinh ra.

---

## Metric và Metric Space

### Định nghĩa

> [!definition] Definition 5.1 — Metric (Khoảng cách)
> Cho $X$ là tập hợp. Một **metric** (hay **khoảng cách**) trên $X$ là ánh xạ $d : X \times X \to \mathbb{R}$ thỏa mãn với mọi $x, y, z \in X$:
>
> 1. **Không âm**: $d(x, y) \geq 0$, và $d(x, y) = 0 \iff x = y$.
> 2. **Đối xứng**: $d(x, y) = d(y, x)$.
> 3. **Bất đẳng thức tam giác**: $d(x, z) \leq d(x, y) + d(y, z)$.
>
> Cặp $(X, d)$ gọi là **metric space (không gian metric)**.

> [!example] Example 5.2 — Các metric chuẩn trên $\mathbb{R}^n$
> Trên $\mathbb{R}^n$, với $x = (x_1, \ldots, x_n)$ và $y = (y_1, \ldots, y_n)$:
>
> - **Euclidean metric**: $d_2(x,y) = \sqrt{\sum_{i=1}^n (x_i - y_i)^2}$.
> - **Taxicab metric**: $d_1(x,y) = \sum_{i=1}^n |x_i - y_i|$.
> - **Sup metric**: $d_\infty(x,y) = \max_{1 \leq i \leq n} |x_i - y_i|$.
>
> Ba metric này đều hợp lệ và — như ta sẽ thấy — sinh ra cùng topology trên $\mathbb{R}^n$.

> [!example] Example 5.3 — Discrete metric
> Trên bất kỳ tập $X$, định nghĩa:
>
> $$
> d(x, y) = \begin{cases} 0 & x = y \\ 1 & x \neq y \end{cases}.
> $$
>
> Đây là **discrete metric**. Metric topology sinh bởi $d$ chính là discrete topology: mọi singleton $\{x\} = B(x, \tfrac{1}{2})$ là open ball.

> [!example] Example 5.4 — Metric trên không gian hàm bị chặn
> Cho $X = C([0,1], \mathbb{R})$ là tập tất cả hàm liên tục $f : [0,1] \to \mathbb{R}$. Định nghĩa:
>
> $$
> d_\infty(f, g) = \sup_{t \in [0,1]} |f(t) - g(t)|.
> $$
>
> Đây là **sup metric** (hay uniform metric) — quan trọng trong Giải tích hàm và lý thuyết xấp xỉ.

---

## Metric Topology

### Định nghĩa open ball và metric topology

> [!definition] Definition 5.5 — Open Ball (Hình cầu mở)
> Cho $(X, d)$ là metric space. **Open ball** (hình cầu mở) tâm $x$, bán kính $\varepsilon > 0$ là:
>
> $$
> B_d(x, \varepsilon) = \{ y \in X : d(x, y) < \varepsilon \}.
> $$
>
> Họ $\mathcal{B} = \{ B_d(x, \varepsilon) : x \in X,\, \varepsilon > 0 \}$ là một basis cho một topology trên $X$ gọi là **metric topology** sinh bởi $d$.

> [!theorem] Theorem 5.6 — $\mathcal{B}$ là basis
> Họ các open balls là một basis.

**Proof.** (1) Mọi $x \in X$ nằm trong $B(x, 1)$. (2) Cho $x \in B(x_1, \varepsilon_1) \cap B(x_2, \varepsilon_2)$. Đặt $\varepsilon = \min(\varepsilon_1 - d(x,x_1),\, \varepsilon_2 - d(x,x_2)) > 0$. Thì $B(x, \varepsilon) \subseteq B(x_1, \varepsilon_1) \cap B(x_2, \varepsilon_2)$ theo bất đẳng thức tam giác. $\blacksquare$

> [!theorem] Theorem 5.7 — Đặc trưng open sets trong metric space
> Trong metric space $(X, d)$, tập $U \subseteq X$ mở khi và chỉ khi: với mọi $x \in U$, tồn tại $\varepsilon > 0$ sao cho $B(x, \varepsilon) \subseteq U$.

---

## Equivalent Metrics

> [!definition] Definition 5.8 — Equivalent Metrics (Metric tương đương)
> Hai metric $d$ và $d'$ trên $X$ gọi là **tương đương (topologically equivalent)** nếu chúng sinh ra cùng topology: $\mathcal{T}_d = \mathcal{T}_{d'}$.

> [!theorem] Theorem 5.9 — Tiêu chuẩn tương đương qua so sánh
> $d$ và $d'$ tương đương khi và chỉ khi: với mọi $x \in X$ và mọi $\varepsilon > 0$, tồn tại $\delta > 0$ sao cho:
>
> $$
> B_{d'}(x, \delta) \subseteq B_d(x, \varepsilon) \quad \text{và} \quad B_d(x, \delta) \subseteq B_{d'}(x, \varepsilon).
> $$

> [!example] Example 5.10 — $d_1$, $d_2$, $d_\infty$ tương đương trên $\mathbb{R}^n$
> Trên $\mathbb{R}^n$, ba metric chuẩn thỏa bất đẳng thức:
>
> $$
> d_\infty(x,y) \leq d_2(x,y) \leq d_1(x,y) \leq n \cdot d_\infty(x,y).
> $$
>
> Từ đây suy ra chúng tương đương: mọi open ball theo metric này đều chứa một open ball theo metric kia. Cả ba sinh ra **topology Euclidean** trên $\mathbb{R}^n$.

> [!note] Remark 5.11 — Strongly equivalent metrics
> Một điều kiện đủ mạnh hơn: $d$ và $d'$ **strongly equivalent** nếu tồn tại hằng số $c_1, c_2 > 0$ sao cho
>
> $$
> c_1\, d'(x,y) \leq d(x,y) \leq c_2\, d'(x,y), \quad \forall\, x,y \in X.
> $$
>
> Strong equivalence $\Rightarrow$ topological equivalence (nhưng không ngược lại).

---

## Liên tục và hội tụ trong metric spaces

### Liên tục — đặc trưng $\varepsilon$-$\delta$

> [!theorem] Theorem 5.12 — Liên tục trong metric spaces
> Cho $(X, d_X)$ và $(Y, d_Y)$ là hai metric spaces. Ánh xạ $f : X \to Y$ liên tục theo metric topology khi và chỉ khi: với mọi $x \in X$ và $\varepsilon > 0$, tồn tại $\delta > 0$ sao cho
>
> $$
> d_X(x, x') < \delta \implies d_Y(f(x), f(x')) < \varepsilon.
> $$

**Proof.** Đây chính là Định nghĩa 4.7 (liên tục tại từng điểm qua neighborhoods) viết lại cho neighborhoods dạng open balls. $\blacksquare$

### Hội tụ dãy

> [!definition] Definition 5.13 — Hội tụ dãy (Sequence Convergence)
> Trong metric space $(X, d)$, dãy $(x_n)$ **hội tụ** đến $x \in X$, ký hiệu $x_n \to x$, nếu:
>
> $$
> \forall\, \varepsilon > 0,\, \exists\, N \in \mathbb{N} : n > N \implies d(x_n, x) < \varepsilon.
> $$

> [!theorem] Theorem 5.14 — Hội tụ và closure trong metric spaces
> Trong metric space $(X, d)$: $x \in \overline{A}$ khi và chỉ khi tồn tại dãy $(a_n)$ trong $A$ sao cho $a_n \to x$.

**Proof.** ($\Leftarrow$) Nếu $a_n \to x$ với $a_n \in A$, thì mọi open ball $B(x, \varepsilon)$ đều gặp $A$, nên $x \in \overline{A}$ theo Theorem 3.6 (bài 03). ($\Rightarrow$) Nếu $x \in \overline{A}$, thì với mọi $n$, $B(x, \frac{1}{n}) \cap A \neq \emptyset$; chọn $a_n \in B(x, \frac{1}{n}) \cap A$ cho ta dãy $a_n \to x$. $\blacksquare$

> [!warning] Counterexample 5.15 — Trong không gian topo tổng quát, dãy không đủ
> Trong không gian topo tổng quát (không có cấu trúc metric), $x \in \overline{A}$ **không** nhất thiết có nghĩa tồn tại dãy trong $A$ hội tụ đến $x$. Ví dụ: không gian với topology cofinite trên tập vô hạn — cần dùng **nets** hoặc **filters** (bài 15) để mô tả closure hoàn toàn.

---

## Mọi Metric Space là Hausdorff và First-Countable

> [!theorem] Theorem 5.16 — Metric space là Hausdorff
> Mọi metric space $(X, d)$ là **Hausdorff**: với $x \neq y$, đặt $\varepsilon = \frac{d(x,y)}{2} > 0$, thì $B(x, \varepsilon) \cap B(y, \varepsilon) = \emptyset$.

**Proof.** Nếu $z \in B(x,\varepsilon) \cap B(y,\varepsilon)$ thì $d(x,y) \leq d(x,z) + d(z,y) < \varepsilon + \varepsilon = d(x,y)$ — mâu thuẫn. $\blacksquare$

> [!theorem] Theorem 5.17 — Metric space là first-countable
> Mọi metric space là **first-countable**: với mọi $x \in X$, họ $\{ B(x, \frac{1}{n}) : n \in \mathbb{N}^+ \}$ là một **countable neighborhood basis** tại $x$.

**Proof.** Với mọi open set $U \ni x$, tồn tại $\varepsilon > 0$ sao cho $B(x, \varepsilon) \subseteq U$; chọn $n > \frac{1}{\varepsilon}$ thì $B(x, \frac{1}{n}) \subseteq U$. $\blacksquare$

---

## Subspace và Product của Metric Spaces

> [!theorem] Theorem 5.18 — Subspace của metric space
> Nếu $(X, d)$ là metric space và $Y \subseteq X$, thì $d|_{Y \times Y}$ là metric trên $Y$ và metric topology của $d|_Y$ trùng với subspace topology của $Y$ trong $(X, \mathcal{T}_d)$.

> [!theorem] Theorem 5.19 — Product hữu hạn của metric spaces
> Nếu $(X_1, d_1)$ và $(X_2, d_2)$ là metric spaces, thì trên $X_1 \times X_2$, tất cả các metric sau đây tương đương và sinh ra product topology:
>
> $$
> D_1((x_1,x_2),(y_1,y_2)) = d_1(x_1,y_1) + d_2(x_2,y_2),
> $$
>
> $$
> D_2((x_1,x_2),(y_1,y_2)) = \sqrt{d_1(x_1,y_1)^2 + d_2(x_2,y_2)^2},
> $$
>
> $$
> D_\infty((x_1,x_2),(y_1,y_2)) = \max(d_1(x_1,y_1), d_2(x_2,y_2)).
> $$

> [!note] Remark 5.20 — Product countable vô hạn
> Với product đếm được $\prod_{n=1}^\infty X_n$ của metric spaces $(X_n, d_n)$, metric
>
> $$
> D(x, y) = \sum_{n=1}^\infty \frac{1}{2^n} \cdot \frac{d_n(x_n, y_n)}{1 + d_n(x_n, y_n)}
> $$
>
> sinh ra **product topology** (Tychonoff). Đây là công cụ chứng minh $\mathbb{R}^\omega$ (với product topology) là metrizable — sẽ trở lại ở bài 13.

---

## SageMath Cheatsheet

```python
# Minh họa các metric trên R^n và so sánh

import math

def d_euclidean(x, y):
    return math.sqrt(sum((xi - yi)**2 for xi, yi in zip(x, y)))

def d_taxicab(x, y):
    return sum(abs(xi - yi) for xi, yi in zip(x, y))

def d_sup(x, y):
    return max(abs(xi - yi) for xi, yi in zip(x, y))

# Kiểm tra bất đẳng thức giữa các metric trên R^2
p = (1.0, 2.0)
q = (4.0, 6.0)

print(f"d_inf  = {d_sup(p,q):.4f}")
print(f"d_2    = {d_euclidean(p,q):.4f}")
print(f"d_1    = {d_taxicab(p,q):.4f}")
print(f"2*d_inf = {2*d_sup(p,q):.4f}  (upper bound cho d_1 khi n=2)")
# Output: d_inf=4.0, d_2=5.0, d_1=7.0, 2*d_inf=8.0
# Xác nhận: d_inf <= d_2 <= d_1 <= 2*d_inf

# Kiểm tra tam giác cho d_2
a, b, c = (0,0), (3,0), (0,4)
print(f"\nKiểm tra tam giác: d(a,c) = {d_euclidean(a,c):.2f}")
print(f"d(a,b) + d(b,c) = {d_euclidean(a,b) + d_euclidean(b,c):.2f}")
# Output: d(a,c) = 5.00, d(a,b) + d(b,c) = 8.00 — bất đẳng thức đúng

# Discrete metric
def d_discrete(x, y):
    return 0 if x == y else 1

# Open ball trong discrete metric: B(x, 0.5) = {x}
X_disc = [1, 2, 3, 4, 5]
x0 = 3
ball = [y for y in X_disc if d_discrete(x0, y) < 0.5]
print(f"\nOpen ball B(3, 0.5) trong discrete metric: {ball}")
# Output: [3] — singleton, nên mọi tập đều mở
```

---

## Summary / Key Takeaways

- **Metric** $d$: không âm, đối xứng, bất đẳng thức tam giác. **Metric topology**: sinh bởi basis các open balls $B(x, \varepsilon)$.
- $U$ mở trong metric topology $\iff$ mọi điểm trong $U$ có open ball nằm trong $U$.
- Hai metric **tương đương** nếu sinh cùng topology; $d_1, d_2, d_\infty$ tương đương trên $\mathbb{R}^n$.
- Liên tục trong metric spaces $\iff$ $\varepsilon$-$\delta$; đây là liên tục topo viết lại cho metric.
- Mọi metric space là **Hausdorff** (hai điểm phân biệt có open balls tách biệt) và **first-countable** (có basis đếm được tại mỗi điểm).
- Trong metric space: $x \in \overline{A} \iff$ tồn tại dãy trong $A$ hội tụ đến $x$ — đặc trưng mạnh hơn topo tổng quát.
- Subspace và product hữu hạn của metric spaces là metric space.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§20–21.
- Willard, S. *General Topology*, §§2, 22.
- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Ch. 2.
- Kelley, J. L. *General Topology*, Ch. 4.
