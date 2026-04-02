---
title: "01. Metric Spaces & Topology Review"
tags: [math, functional-analysis, lesson-01]
aliases: [Metric Spaces Topology Review]
created: 2026-03-31
---

> **Prerequisites**: Giải tích thực cơ bản (dãy số, giới hạn, liên tục), lý thuyết tập hợp
> **Objectives**:
> - Nắm vững định nghĩa không gian metric và các ví dụ quan trọng
> - Hiểu các khái niệm topo: open set, closed set, compactness
> - Nắm vững tính đầy đủ (completeness) — nền tảng của Banach space

---

## Motivation / Intuition

Functional Analysis nghiên cứu các **không gian hàm số** — những tập hợp mà mỗi phần tử là một hàm. Để làm giải tích trên các không gian này (giới hạn, liên tục, hội tụ), ta cần một khái niệm **khoảng cách** tổng quát. Đây chính là vai trò của **không gian metric** (metric space).

Ý tưởng: thay vì $|x - y|$ trên $\mathbb{R}$, ta dùng hàm $d(x, y)$ đo khoảng cách giữa hai điểm bất kỳ trong một tập hợp tổng quát — không gian đó có thể là tập hàm liên tục, dãy số, hay bất cứ đối tượng nào khác.

---

## Không gian Metric (Metric Space)

### Definition

> [!definition] Definition 1.1 — Không gian metric (Metric Space)
> Một **không gian metric** là một cặp $(X, d)$ gồm một tập hợp $X$ và hàm số $d: X \times X \to \mathbb{R}$ (gọi là **metric** hay **độ đo khoảng cách**) thỏa mãn với mọi $x, y, z \in X$:
>
> 1. **Không âm**: $d(x, y) \geq 0$, và $d(x, y) = 0 \iff x = y$
> 2. **Đối xứng**: $d(x, y) = d(y, x)$
> 3. **Bất đẳng thức tam giác**: $d(x, z) \leq d(x, y) + d(y, z)$

> [!example] Example 1.2 — Các metric tiêu chuẩn
> **a) Metric Euclid trên $\mathbb{R}^n$**: $d(x, y) = \|x - y\|_2 = \left(\sum_{i=1}^n |x_i - y_i|^2\right)^{1/2}$
>
> **b) Metric $\ell^p$ trên $\mathbb{R}^n$** ($1 \leq p < \infty$): $d_p(x,y) = \left(\sum_{i=1}^n |x_i - y_i|^p\right)^{1/p}$
>
> **c) Metric sup (Chebyshev)**: $d_\infty(x, y) = \max_{1 \leq i \leq n} |x_i - y_i|$
>
> **d) Không gian hàm liên tục $C[a,b]$**: với $f, g \in C[a,b]$,
>
> $$
> d(f, g) = \max_{t \in [a,b]} |f(t) - g(t)|
> $$
>
> **e) Metric rời rạc**: $d(x,y) = 0$ nếu $x = y$, và $d(x,y) = 1$ nếu $x \neq y$.

> [!note] Remark 1.3 — Tại sao bất đẳng thức tam giác quan trọng?
> Bất đẳng thức tam giác là tiên đề "sâu" nhất — nó đảm bảo rằng khoảng cách "đi thẳng" không xa hơn "đi vòng". Các tiên đề còn lại chỉ là điều kiện vệ sinh cơ bản.

---

## Topo của không gian metric

### Definition

> [!definition] Definition 1.4 — Quả cầu mở và tập mở (Open Ball & Open Set)
> Cho $(X, d)$ là không gian metric, $x_0 \in X$, $r > 0$.
>
> - **Quả cầu mở** (open ball) tâm $x_0$, bán kính $r$:
>
> $$
> B(x_0, r) = \{x \in X : d(x, x_0) < r\}
> $$
>
> - Tập $U \subseteq X$ được gọi là **tập mở** (open set) nếu:
>
> $$
> \forall\, x \in U,\ \exists\, r > 0 : B(x, r) \subseteq U
> $$
>
> - Tập $F \subseteq X$ được gọi là **tập đóng** (closed set) nếu phần bù $X \setminus F$ là tập mở.

> [!theorem] Theorem 1.5 — Tính chất topo cơ bản
> Trong không gian metric $(X, d)$:
>
> 1. $\emptyset$ và $X$ vừa là tập mở vừa là tập đóng.
> 2. Hợp tùy ý của các tập mở là tập mở.
> 3. Giao hữu hạn của các tập mở là tập mở.
> 4. Giao tùy ý của các tập đóng là tập đóng.
> 5. Hợp hữu hạn của các tập đóng là tập đóng.

**Proof sketch.** Các tính chất 2 và 3 suy trực tiếp từ định nghĩa tập mở. Tính chất 4, 5 suy ra từ 2, 3 bằng luật De Morgan. $\blacksquare$

> [!definition] Definition 1.6 — Bao đóng, phần trong, biên (Closure, Interior, Boundary)
> Cho $A \subseteq X$:
>
> - **Bao đóng** (closure): $\overline{A} = \bigcap\{F : F \supseteq A,\ F \text{ đóng}\}$ — tập đóng nhỏ nhất chứa $A$
> - **Phần trong** (interior): $A^\circ = \bigcup\{U : U \subseteq A,\ U \text{ mở}\}$ — tập mở lớn nhất trong $A$
> - **Biên** (boundary): $\partial A = \overline{A} \setminus A^\circ$

---

## Dãy và Tính đầy đủ (Sequences & Completeness)

### Definition

> [!definition] Definition 1.7 — Dãy Cauchy và không gian đầy đủ (Cauchy Sequence & Complete Space)
> Cho $(X, d)$ là không gian metric.
>
> - Dãy $(x_n)$ là **dãy Cauchy** nếu:
>
> $$
> \forall\, \varepsilon > 0,\ \exists\, N \in \mathbb{N}: \forall\, m, n \geq N,\ d(x_m, x_n) < \varepsilon
> $$
>
> - $(X, d)$ được gọi là **đầy đủ** (complete) nếu mọi dãy Cauchy trong $X$ đều hội tụ về một điểm trong $X$.

> [!theorem] Theorem 1.8 — Mọi dãy hội tụ đều là dãy Cauchy
> Nếu $x_n \to x$ trong $(X, d)$, thì $(x_n)$ là dãy Cauchy.

**Proof.**
Cho $\varepsilon > 0$. Vì $x_n \to x$, tồn tại $N$ sao cho $d(x_n, x) < \varepsilon/2$ với mọi $n \geq N$. Khi đó với $m, n \geq N$:

$$
d(x_m, x_n) \leq d(x_m, x) + d(x, x_n) < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon. \quad \blacksquare
$$

> [!warning] Counterexample 1.9 — $(\mathbb{Q}, |\cdot|)$ không đầy đủ
> Dãy $x_n = \left(1 + \frac{1}{n}\right)^n$ trong $\mathbb{Q}$ là dãy Cauchy (vì nó hội tụ trong $\mathbb{R}$), nhưng giới hạn $e \notin \mathbb{Q}$. Đây là lý do $\mathbb{R}$ được xây dựng như **completion** của $\mathbb{Q}$.

> [!theorem] Theorem 1.10 — $\mathbb{R}^n$ là đầy đủ
> Không gian $\mathbb{R}^n$ với metric Euclid là đầy đủ.

**Proof sketch.** Suy từ tính đầy đủ của $\mathbb{R}$ và sự tương đương: $(x_n^{(1)}, \ldots, x_n^{(k)}) \to (x^{(1)}, \ldots, x^{(k)})$ khi và chỉ khi từng tọa độ $x_n^{(i)} \to x^{(i)}$. $\blacksquare$

---

## Compact Sets

### Definition

> [!definition] Definition 1.11 — Tập compact
> Tập $K \subseteq X$ là **compact** nếu mọi phủ mở của $K$ đều có phủ con hữu hạn:
> với mọi họ tập mở $\{U_\alpha\}$ thỏa $K \subseteq \bigcup_\alpha U_\alpha$, tồn tại hữu hạn chỉ số $\alpha_1, \ldots, \alpha_n$ sao cho $K \subseteq U_{\alpha_1} \cup \cdots \cup U_{\alpha_n}$.

> [!theorem] Theorem 1.12 — Heine-Borel (trong $\mathbb{R}^n$)
> Tập $K \subseteq \mathbb{R}^n$ là compact khi và chỉ khi $K$ **đóng** và **bị chặn**.

> [!theorem] Theorem 1.13 — Đặc trưng dãy của compact (Sequential Compactness)
> Trong không gian metric, $K$ là compact khi và chỉ khi mọi dãy trong $K$ đều có dãy con hội tụ về một điểm trong $K$.

> [!note] Remark 1.14 — Compact trong không gian vô hạn chiều
> Định lý Heine-Borel **không còn đúng** trong không gian chiều vô hạn! Trong Functional Analysis, đóng và bị chặn **không đủ** để đảm bảo compact. Đây là một trong những điểm khác biệt cơ bản giữa hữu hạn chiều và vô hạn chiều.

---

## Dense Sets & Separability

### Definition

> [!definition] Definition 1.15 — Tập trù mật và không gian phân ly (Dense Set & Separable Space)
> - Tập $A \subseteq X$ là **trù mật** (dense) trong $X$ nếu $\overline{A} = X$, tức là mọi quả cầu mở trong $X$ đều chứa ít nhất một điểm của $A$.
> - $(X, d)$ gọi là **phân ly** (separable) nếu có tập con đếm được trù mật trong $X$.

> [!example] Example 1.16
> - $\mathbb{Q}$ trù mật trong $\mathbb{R}$, nên $\mathbb{R}$ phân ly.
> - $\mathbb{Q}^n$ trù mật trong $\mathbb{R}^n$, nên $\mathbb{R}^n$ phân ly.
> - Tập các đa thức hệ số hữu tỉ trù mật trong $C[a,b]$ (theo định lý Weierstrass), nên $C[a,b]$ phân ly.

---

## Ánh xạ liên tục (Continuous Maps)

### Definition

> [!definition] Definition 1.17 — Liên tục giữa không gian metric
> Ánh xạ $f: (X, d_X) \to (Y, d_Y)$ **liên tục tại** $x_0 \in X$ nếu:
>
> $$
> \forall\, \varepsilon > 0,\ \exists\, \delta > 0: d_X(x, x_0) < \delta \Rightarrow d_Y(f(x), f(x_0)) < \varepsilon
> $$
>
> $f$ **liên tục** trên $X$ nếu liên tục tại mọi điểm.

> [!theorem] Theorem 1.18 — Đặc trưng topo của liên tục
> $f: X \to Y$ liên tục khi và chỉ khi nghịch ảnh của mọi tập mở trong $Y$ là tập mở trong $X$.

---

## SageMath Cheatsheet

```python
# Không gian metric Euclid
import numpy as np

x = np.array([1.0, 2.0, 3.0])
y = np.array([4.0, 0.0, 1.0])

# Metric Euclid (l2)
d2 = np.linalg.norm(x - y)

# Metric l1
d1 = np.linalg.norm(x - y, ord=1)

# Metric sup (l_inf)
d_inf = np.linalg.norm(x - y, ord=np.inf)

print(f"d2={d2:.4f}, d1={d1:.4f}, d_inf={d_inf:.4f}")

# Kiểm tra dãy Cauchy hội tụ về e
seq = [(1 + 1/n)**n for n in range(1, 100)]
import math
print(f"Giới hạn ≈ {seq[-1]:.6f}, e = {math.e:.6f}")
```

---

## Summary / Key Takeaways

- Không gian metric $(X, d)$ tổng quát hóa khái niệm khoảng cách với ba tiên đề: không âm, đối xứng, tam giác.
- **Open set** — tất cả các điểm đều có lân cận trong tập; **closed set** — phần bù mở.
- **Dãy Cauchy**: các phần tử ngày càng gần nhau; **Complete** — mọi dãy Cauchy đều hội tụ.
- $\mathbb{Q}$ không đầy đủ; $\mathbb{R}$, $\mathbb{R}^n$ đầy đủ.
- **Compact** trong $\mathbb{R}^n$ $\iff$ đóng + bị chặn (Heine-Borel). Không đúng trong vô hạn chiều!
- **Separable**: có tập đếm được trù mật — tính chất quan trọng trong FA.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 2–3.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 1.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
