---
title: "10. Lebesgue Measure"
tags: [math, real-analysis, lesson-10]
aliases: [Lebesgue Measure]
created: 2026-03-28
---

> **Prerequisites**: [[09-measure-theory-foundations|09. Measure Theory Foundations]] — $\sigma$-algebra, outer measure, Carathéodory; [[02-cardinality-and-countability|02. Cardinality & Countability]] — Lực lượng tập hợp
> **Objectives**:
> - Xây dựng Lebesgue measure trên $\mathbb{R}$ và $\mathbb{R}^n$ từ Carathéodory
> - Nắm các tính chất đặc trưng: bất biến tịnh tiến, regularity
> - Hiểu Cantor set — ví dụ điển hình tập uncountable có measure $0$
> - Chứng minh tồn tại tập không đo được (Vitali set)
> - Phân biệt Lebesgue $\sigma$-algebra và Borel $\sigma$-algebra

---

## Motivation / Intuition

Bài 09 đã xây dựng khung lý thuyết tổng quát. Bài này áp dụng khung đó để xây dựng cụ thể **Lebesgue measure** — độ đo quan trọng nhất trong giải tích — và khám phá các tính chất kỳ diệu của nó.

Hai phát hiện đáng ngạc nhiên: (1) Tồn tại tập **uncountable** có Lebesgue measure $0$ (Cantor set). (2) Ngay cả Lebesgue measure cũng không "bao phủ" được mọi tập con của $\mathbb{R}$ — tập Vitali không đo được (buộc phải dùng Axiom of Choice để tạo ra).

---

## Xây dựng Lebesgue Outer Measure

### Definition

> [!definition] Definition 10.1 — Lebesgue Outer Measure trên $\mathbb{R}$
> Với mọi $E \subseteq \mathbb{R}$, định nghĩa **Lebesgue outer measure**:
>
> $$
> \lambda^*(E) = \inf\left\{\sum_{n=1}^\infty (b_n - a_n) \;\middle|\; E \subseteq \bigcup_{n=1}^\infty (a_n, b_n)\right\}
> $$
>
> tức infimum của tổng độ dài các open intervals phủ $E$.

> [!theorem] Theorem 10.2 — $\lambda^*$ là outer measure
> Hàm $\lambda^*: \mathcal{P}(\mathbb{R}) \to [0,+\infty]$ là outer measure thỏa:
>
> - $\lambda^*(\emptyset) = 0$
> - $\lambda^*([a,b]) = b - a$ (khoảng độ dài $b-a$)
> - **Bất biến tịnh tiến**: $\lambda^*(E + t) = \lambda^*(E)$ với mọi $t \in \mathbb{R}$
> - **Bán-cộng tính đếm được**: $\lambda^*\!\left(\bigcup E_n\right) \leq \sum \lambda^*(E_n)$

**Proof của $\lambda^*([a,b]) = b-a$.**
*Chặn trên*: $(a-\varepsilon, b+\varepsilon)$ là covering, nên $\lambda^*([a,b]) \leq b-a + 2\varepsilon$. Cho $\varepsilon \to 0$.

*Chặn dưới*: Với mọi open cover $(a_n, b_n)$ của $[a,b]$, vì $[a,b]$ compact, có subcover hữu hạn $\{(a_{n_i}, b_{n_i})\}$. Lập luận tổ hợp cho $\sum(b_{n_i}-a_{n_i}) \geq b-a$, nên $\sum(b_n-a_n) \geq b-a$. $\blacksquare$

---

## Lebesgue Measure và Lebesgue $\sigma$-Algebra

### Definition

> [!definition] Definition 10.3 — Lebesgue Measurable Sets
> Tập $E \subseteq \mathbb{R}$ là **Lebesgue measurable** (đo được theo Lebesgue) nếu $E$ là $\lambda^*$-measurable theo tiêu chuẩn Carathéodory:
>
> $$
> \forall A \subseteq \mathbb{R}:\; \lambda^*(A) = \lambda^*(A \cap E) + \lambda^*(A \cap E^c)
> $$
>
> Họ các tập Lebesgue measurable ký hiệu là $\mathcal{L}$ (hay $\mathcal{M}_\lambda$). **Lebesgue measure** là:
>
> $$
> \lambda = \lambda^*|_{\mathcal{L}}: \mathcal{L} \to [0, +\infty]
> $$

> [!theorem] Theorem 10.4 — Tính chất của $(\mathbb{R}, \mathcal{L}, \lambda)$
>
> 1. $\mathcal{L}$ là $\sigma$-algebra hoàn chỉnh
> 2. $\mathcal{B}(\mathbb{R}) \subsetneq \mathcal{L}$ (Borel sets là tập con thực sự của Lebesgue measurable sets)
> 3. $\lambda((a,b)) = \lambda([a,b]) = \lambda([a,b)) = b - a$
> 4. **Bất biến tịnh tiến**: $\lambda(E + t) = \lambda(E)$ với mọi $t \in \mathbb{R}$, $E \in \mathcal{L}$
> 5. **Bất biến tỉ lệ**: $\lambda(rE) = |r|\,\lambda(E)$ với mọi $r \in \mathbb{R}$, $E \in \mathcal{L}$

> [!theorem] Theorem 10.5 — Regularity của Lebesgue measure
> Với mọi $E \in \mathcal{L}$:
>
> $$
> \lambda(E) = \inf\{\lambda(U) \mid E \subseteq U,\; U \text{ mở}\} = \sup\{\lambda(K) \mid K \subseteq E,\; K \text{ compact}\}
> $$
>
> (Outer regularity và inner regularity)

**Proof sketch.** Từ định nghĩa $\lambda^*$: với $\varepsilon > 0$, tồn tại covering mở $\bigcup(a_n, b_n)$ với $\sum(b_n-a_n) < \lambda(E) + \varepsilon$. Vậy $U = \bigcup(a_n, b_n)$ là open set phủ $E$ với $\lambda(U) < \lambda(E) + \varepsilon$. Inner regularity dùng $\sigma$-finiteness và tính liên tục từ dưới. $\blacksquare$

---

## Cantor Set — Tập Uncountable có Measure 0

### Definition

> [!definition] Definition 10.6 — Cantor Set
> **Cantor set** $\mathcal{C}$ được xây dựng bằng cách loại bỏ liên tiếp phần ba giữa:
>
> $$
> C_0 = [0,1]
> $$
>
> $$
> C_1 = [0, 1/3] \cup [2/3, 1] \quad \text{(bỏ $(1/3, 2/3)$)}
> $$
>
> $$
> C_2 = [0,1/9] \cup [2/9,1/3] \cup [2/3,7/9] \cup [8/9,1] \quad \text{(bỏ thêm hai đoạn giữa)}
> $$
>
> $$
> C_n = C_{n-1} \text{ bỏ đi phần ba giữa của mỗi đoạn}
> $$
>
> $$
> \mathcal{C} = \bigcap_{n=0}^\infty C_n
> $$

> [!theorem] Theorem 10.7 — Tính chất của Cantor Set
>
> 1. $\mathcal{C}$ là tập **đóng** trong $[0,1]$ (giao đếm được của tập đóng)
> 2. $\mathcal{C}$ có **Lebesgue measure $0$**: $\lambda(\mathcal{C}) = 0$
> 3. $\mathcal{C}$ là tập **uncountable**: $|\mathcal{C}| = |\mathbb{R}|$
> 4. $\mathcal{C}$ là **perfect** (đóng và mọi điểm là điểm giới hạn)
> 5. $\mathcal{C}$ không có interior (boundary $= \mathcal{C}$)
> 6. $\mathcal{C}$ **totally disconnected** (không chứa khoảng nào)

**Proof của (2):** Bước $n$, ta bỏ $2^{n-1}$ khoảng, mỗi khoảng độ dài $3^{-n}$. Tổng độ dài bị bỏ:

$$
\sum_{n=1}^\infty \frac{2^{n-1}}{3^n} = \frac{1}{3} \cdot \frac{1}{1-2/3} = 1
$$

Vậy $\lambda(\mathcal{C}) = 1 - 1 = 0$. $\blacksquare$

**Proof của (3):** Mỗi điểm trong $\mathcal{C}$ ứng với một dãy nhị phân $(d_n) \in \{0,1\}^\mathbb{N}$ (chọn nhánh trái/phải tại mỗi bước). Ánh xạ $\mathcal{C} \to [0,1]$ qua $\sum d_n/2^n$ là liên tục và surjective, nên $|\mathcal{C}| \geq |[0,1]| = |\mathbb{R}|$. Chiều ngược: $\mathcal{C} \subseteq [0,1]$ nên $|\mathcal{C}| \leq |\mathbb{R}|$. $\blacksquare$

> [!note] Remark 10.8 — Hệ quả quan trọng
> Cantor set chứng tỏ:
>
> - "Measure $0$" **không có nghĩa** là "nhỏ về lực lượng" (cardinality lớn nhất có thể)
> - "Uncountable" **không có nghĩa** là "có measure dương"
> - Hai khái niệm "kích cỡ" — lực lượng và measure — hoàn toàn độc lập nhau

### Worked Example

> [!example] Example 10.9 — Hàm Cantor (Devil's Staircase)
>
> **Hàm Cantor** $f: [0,1] \to [0,1]$ được định nghĩa: $f \equiv k/2^n$ trên khoảng bị bỏ tại bước $n$, kéo dài liên tục lên $\mathcal{C}$.
>
> Tính chất: $f$ liên tục, đơn điệu không giảm, $f(0) = 0$, $f(1) = 1$, và $f' = 0$ **Lebesgue a.e.** (vì $f$ hằng trên mỗi khoảng bị bỏ, và tổng độ dài các khoảng đó $= 1$).
>
> Đây là ví dụ điển hình: $f$ không hằng nhưng $f' = 0$ a.e. — FTC Riemann không áp dụng được; $\int_0^1 f' = 0 \neq 1 = f(1) - f(0)$. Điều này giải thích tại sao FTC Lebesgue cần thêm điều kiện "absolutely continuous" (Bài 14).

---

## Tập Vitali — Tập Không Đo Được

> [!theorem] Theorem 10.10 — Tồn tại tập Lebesgue không đo được
> Tồn tại $V \subseteq [0,1]$ sao cho $V \notin \mathcal{L}$.

**Proof (Vitali, 1905).**
Xét quan hệ tương đương trên $[0,1]$: $x \sim y \Leftrightarrow x - y \in \mathbb{Q}$. Mỗi lớp tương đương có dạng $\{x + q \mid q \in \mathbb{Q}\} \cap [0,1]$ với lực lượng đếm được.

Dùng **Axiom of Choice**: chọn đúng một đại diện từ mỗi lớp tương đương. Gọi $V$ là tập các đại diện này.

**Giả sử** $V \in \mathcal{L}$. Gọi $Q = \mathbb{Q} \cap [-1, 1]$ (đếm được). Xét $\{V + q\}_{q \in Q}$ (rời nhau và $[0,1] \subseteq \bigcup_{q \in Q}(V+q) \subseteq [-1,2]$). Suy ra:

$$
1 = \lambda([0,1]) \leq \sum_{q \in Q} \lambda(V+q) = \sum_{q \in Q} \lambda(V) \leq \lambda([-1,2]) = 3
$$

Nếu $\lambda(V) = 0$ thì $\sum \lambda(V) = 0 < 1$. Nếu $\lambda(V) > 0$ thì $\sum \lambda(V) = +\infty > 3$. Mâu thuẫn trong cả hai trường hợp. Vậy $V \notin \mathcal{L}$. $\blacksquare$

> [!note] Remark 10.11
> Chứng minh này **buộc phải** dùng Axiom of Choice (AC). Solovay (1970) chứng minh trong mô hình set theory không có AC, mọi tập con của $\mathbb{R}$ đều Lebesgue measurable. Vậy sự tồn tại của tập không đo được là **tương đương** với một dạng yếu của AC.

---

## Lebesgue Measure trên $\mathbb{R}^n$

### Definition

> [!definition] Definition 10.12 — Lebesgue measure trên $\mathbb{R}^n$
> Trên $\mathbb{R}^n$, định nghĩa Lebesgue outer measure qua rectangles:
>
> $$
> \lambda^*_n(E) = \inf\left\{\sum_k \prod_{i=1}^n (b_{k,i} - a_{k,i}) \;\middle|\; E \subseteq \bigcup_k \prod_{i=1}^n (a_{k,i}, b_{k,i})\right\}
> $$
>
> Các tính chất tương tự $\mathbb{R}$: $\lambda^*_n$ là outer measure bất biến qua tịnh tiến và phép quay (isometries).

> [!theorem] Theorem 10.13 — Tích của measures
> Nếu $E = A \times B$ với $A \in \mathcal{L}(\mathbb{R}^m)$, $B \in \mathcal{L}(\mathbb{R}^n)$, thì $E \in \mathcal{L}(\mathbb{R}^{m+n})$ và:
>
> $$
> \lambda_{m+n}(A \times B) = \lambda_m(A) \cdot \lambda_n(B)
> $$
>
> (với quy ước $0 \cdot \infty = 0$).

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt

# Xây dựng Cantor set bằng đệ quy
def cantor_intervals(n):
    """Trả về list các intervals trong C_n"""
    intervals = [(0.0, 1.0)]
    for _ in range(n):
        new_intervals = []
        for (a, b) in intervals:
            third = (b - a) / 3
            new_intervals.append((a, a + third))
            new_intervals.append((b - third, b))
        intervals = new_intervals
    return intervals

# Tính lambda(C_n) = (2/3)^n -> 0
for n in range(8):
    intervals = cantor_intervals(n)
    total_length = sum(b - a for a, b in intervals)
    print(f"n={n}: |C_n| = {len(intervals):3d} intervals, lambda = {total_length:.6f} = (2/3)^{n} = {(2/3)**n:.6f}")

# Vẽ Cantor set ở các bước
fig, axes = plt.subplots(6, 1, figsize=(10, 6))
for n, ax in enumerate(axes):
    intervals = cantor_intervals(n)
    for (a, b) in intervals:
        ax.barh(0, b - a, left=a, height=0.8, color='blue', alpha=0.7)
    ax.set_xlim(0, 1); ax.set_yticks([])
    ax.set_ylabel(f'$C_{n}$', rotation=0, labelpad=20)
plt.suptitle('Cantor set — uncountable, measure 0')
plt.tight_layout()
plt.savefig('cantor_set.png', dpi=100)

# Hàm Cantor (Devil's Staircase)
def cantor_function(x, n_steps=12):
    """Xấp xỉ hàm Cantor tại điểm x"""
    lo, hi = 0.0, 1.0
    val_lo, val_hi = 0.0, 1.0
    for _ in range(n_steps):
        mid_lo = lo + (hi - lo) / 3
        mid_hi = lo + 2 * (hi - lo) / 3
        val_mid = (val_lo + val_hi) / 2
        if x <= mid_lo:
            hi, val_hi = mid_lo, val_mid
        elif x >= mid_hi:
            lo, val_lo = mid_hi, val_mid
        else:
            return val_mid
    return (val_lo + val_hi) / 2

xs = np.linspace(0, 1, 1000)
ys = [cantor_function(x) for x in xs]

plt.figure(figsize=(7, 5))
plt.plot(xs, ys, 'b-', lw=1.5)
plt.xlabel('x'); plt.ylabel("f(x)")
plt.title("Devil's Staircase — f liên tục, f'=0 a.e., f(1)-f(0)=1 ≠ ∫f'=0")
plt.grid(True, alpha=0.4)
plt.savefig('devils_staircase.png', dpi=100)

# Lebesgue outer measure của các tập đơn giản
def lebesgue_outer_1d(E_sample, N=10000, bounds=(0,1)):
    """
    Ước lượng Lebesgue outer measure qua covering bằng intervals nhỏ.
    E_sample: hàm trả về True nếu điểm trong E
    """
    a, b = bounds
    delta = (b - a) / N
    count = sum(1 for k in range(N) if E_sample(a + (k + 0.5) * delta))
    return count * delta

# Cantor set: measure ≈ 0
cantor_pts = set()
for (a, b) in cantor_intervals(15):
    cantor_pts.update(np.linspace(a, b, 10))
cantor_measure = lebesgue_outer_1d(
    lambda x: any(a <= x <= b for a,b in cantor_intervals(12))
)
print(f"lambda(Cantor) ≈ {cantor_measure:.5f}")  # rất nhỏ

# Vitali set: không thể tính (không constructive), chỉ tồn tại qua AC
print("Vitali set tồn tại nhờ Axiom of Choice — không thể xây dựng tường minh")
```

---

## Summary / Key Takeaways

- **Lebesgue outer measure** $\lambda^*(E)$: infimum tổng độ dài covering bởi open intervals. $\lambda^*([a,b]) = b - a$. Bất biến tịnh tiến.
- **Lebesgue measurable sets** $\mathcal{L}$: tập $\lambda^*$-Carathéodory measurable. $\mathcal{B}(\mathbb{R}) \subsetneq \mathcal{L}$. $(\mathbb{R}, \mathcal{L}, \lambda)$ là measure space hoàn chỉnh.
- **Regularity**: $\lambda(E) = \inf\{\lambda(U): U \supseteq E, \text{mở}\} = \sup\{\lambda(K): K \subseteq E, \text{compact}\}$.
- **Cantor set** $\mathcal{C}$: đóng, perfect, totally disconnected, uncountable ($|\mathcal{C}| = |\mathbb{R}|$), nhưng $\lambda(\mathcal{C}) = 0$. Phản ví dụ quan trọng: measure và cardinality độc lập nhau.
- **Vitali set**: tập Lebesgue không đo được — xây dựng từ Axiom of Choice. Chứng tỏ $\mathcal{L} \neq \mathcal{P}(\mathbb{R})$.
- **Lebesgue measure trên $\mathbb{R}^n$**: $\lambda_n(A \times B) = \lambda_m(A) \cdot \lambda_n(B)$.

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.), Chapter 1, §1.1–1.5.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 2.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 1.
- Hunter, J. K. *Measure Theory* (UC Davis), Chapter 2.
