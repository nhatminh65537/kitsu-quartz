---
title: "08. Compactness — Advanced"
tags: [math, point-set-topology, lesson-08]
aliases: [Compactness Advanced]
created: 2026-03-29
---

> **Prerequisites**: [[06-connectedness|06. Connectedness]], [[07-compactness-foundations|07. Compactness — Foundations]]
> **Objectives**:
> - Hiểu local compactness và nhận biết các ví dụ cơ bản ($\mathbb{R}^n$, manifolds)
> - Xây dựng one-point compactification (Alexandroff compactification) và hiểu tại sao nó là compact
> - Nắm các tính chất của hàm liên tục trên compact: đồng đều liên tục, closed maps
> - Hiểu compact-open topology như một bước đầu vào không gian hàm

---

## Motivation / Intuition

Bài trước cho ta định nghĩa compact và các tính chất nền tảng. Bài này đi sâu vào hai hướng:

**Hướng 1 — Mở rộng "ra ngoài"**: Nhiều không gian tự nhiên như $\mathbb{R}^n$ không compact, nhưng "gần như compact" theo nghĩa mọi điểm đều có neighborhood compact. Ta gọi đây là **locally compact**. Câu hỏi thú vị: liệu ta có thể **cộng thêm một điểm** vào $\mathbb{R}^n$ để làm nó compact? Câu trả lời là có — đó là **one-point compactification** hay **Alexandroff compactification** $\mathbb{R}^n \cup \{\infty\} \cong S^n$.

**Hướng 2 — Tính chất nâng cao**: Khi $X$ compact, các hàm liên tục trên $X$ có tính chất mạnh hơn: đồng đều liên tục, đạt min/max, ánh xạ closed. Những tính chất này tạo nền tảng cho Bài 14 (Arzelà-Ascoli, Stone-Weierstrass).

---

## Local Compactness

### Định nghĩa

> [!definition] Definition 8.1 — Locally Compact (Compact địa phương)
> Không gian Hausdorff $X$ gọi là **locally compact** tại $x$ nếu tồn tại neighborhood $U$ của $x$ sao cho $\overline{U}$ compact.
>
> $X$ **locally compact** nếu locally compact tại mọi điểm.

> [!note] Remark 8.2 — Điều kiện Hausdorff
> Trong tài liệu khác nhau, "locally compact" đôi khi không đòi hỏi Hausdorff. Ta dùng định nghĩa của Munkres: **locally compact Hausdorff (LCH)**. Hầu hết không gian tự nhiên đều LCH.

> [!example] Example 8.3 — Ví dụ locally compact
> - $\mathbb{R}^n$: mọi điểm $x$ có neighborhood $\overline{B}(x, 1)$ là compact (Heine-Borel). ✓
> - $\mathbb{R}^n \setminus \{0\}$: subspace mở của locally compact Hausdorff, nên locally compact. ✓
> - Mọi compact Hausdorff space: hiển nhiên. ✓
> - Mọi discrete space: với mỗi $x$, tập $\{x\}$ compact là closure của $\{x\}$. ✓

> [!warning] Counterexample 8.4 — $\mathbb{Q}$ không locally compact
> $\mathbb{Q}$ (với subspace topology từ $\mathbb{R}$) không locally compact: không tập con nào của $\mathbb{Q}$ compact, ngoại trừ tập hữu hạn. Mọi neighborhood của bất kỳ điểm nào trong $\mathbb{Q}$ đều chứa một khoảng $\mathbb{Q}$-open không compact.

### Tính chất của LCH spaces

> [!theorem] Theorem 8.5 — Subspace mở của LCH là LCH
> Nếu $X$ locally compact Hausdorff và $U \subseteq X$ mở, thì $U$ locally compact Hausdorff.

**Proof.** $U$ Hausdorff (subspace của Hausdorff). Cho $x \in U$; vì $X$ LCH, có neighborhood $V$ của $x$ với $\overline{V}^X$ compact. Đặt $W = V \cap U$: đây là neighborhood của $x$ trong $U$. Closure của $W$ trong $U$ là $\overline{W}^U = \overline{W}^X \cap U \subseteq \overline{V}^X$ compact và đóng, suy ra compact. $\blacksquare$

> [!theorem] Theorem 8.6 — Neighborhood basis compact trong LCH
> Trong LCH space $X$, tại mỗi điểm $x$ tồn tại một **neighborhood basis** gồm các open sets có closure compact:
>
> $$
> \{ U \ni x : U \text{ mở},\, \overline{U} \text{ compact} \}.
> $$

---

## One-Point Compactification

### Xây dựng

> [!definition] Definition 8.7 — One-Point Compactification (Alexandroff Compactification)
> Cho $X$ là LCH space, không compact. Định nghĩa $X^* = X \cup \{\infty\}$ (thêm một điểm mới $\infty \notin X$). Topology trên $X^*$ gồm:
>
> - Mọi open set của $X$ (vẫn mở trong $X^*$).
> - Mọi tập dạng $\{\infty\} \cup (X \setminus K)$ với $K \subseteq X$ **compact**.
>
> Không gian $X^*$ gọi là **one-point compactification** (hay **Alexandroff compactification**) của $X$.

> [!theorem] Theorem 8.8 — $X^*$ là compact Hausdorff
> Nếu $X$ LCH và không compact thì $X^*$ là compact Hausdorff.

**Proof.**

*Compact*: Cho $\mathcal{U}$ là open cover của $X^*$. Có $U_0 \in \mathcal{U}$ chứa $\infty$, nên $U_0 = \{\infty\} \cup (X \setminus K)$ với $K \subseteq X$ compact. Họ $\mathcal{U} \setminus \{U_0\}$ phủ $X$, nên phủ $K$; vì $K$ compact, có finite subcover $\{U_1, \ldots, U_n\}$ phủ $K$. Khi đó $\{U_0, U_1, \ldots, U_n\}$ phủ toàn $X^*$.

*Hausdorff*: Với $x, y \in X$, $x \neq y$: tách bởi $X$ Hausdorff. Với $x \in X$ và $y = \infty$: vì $X$ LCH, có $U \ni x$ mở với $\overline{U}$ compact; đặt $V = \{\infty\} \cup (X \setminus \overline{U})$ — khi đó $U$ và $V$ tách $x$ và $\infty$. $\blacksquare$

> [!theorem] Theorem 8.9 — $X$ là subspace mở của $X^*$
> Bao hàm $\iota : X \hookrightarrow X^*$ là embedding, và $X$ là subspace mở đặc trong $X^*$ (tức $\overline{X} = X^*$).

> [!example] Example 8.10 — One-point compactification của $\mathbb{R}^n$
> $(\mathbb{R}^n)^* \cong S^n$ (mặt cầu $n$ chiều).
>
> Cụ thể với $n=1$: $\mathbb{R}^* \cong S^1$ — đường thẳng thực cộng thêm điểm vô cực trở thành vòng tròn. Homeomorphism tường minh qua **stereographic projection**: chiếu từ "cực bắc" $N = (0,1) \in S^1$ lên $\mathbb{R} \times \{0\}$.
>
> Với $n=2$: $\mathbb{R}^2 \cup \{\infty\} \cong S^2$ — mặt phẳng phức cộng một điểm vô cực là **Riemann sphere**, trung tâm của Giải tích phức.

> [!example] Example 8.11 — One-point compactification của $(0,1)$
> $(0,1)^* \cong S^1$: thêm điểm $\infty$ vào khoảng mở tương đương nối hai đầu mút lại thành vòng tròn.

> [!example] Example 8.12 — One-point compactification không tách được
> Nếu $X$ không Hausdorff hoặc không locally compact, $X^*$ vẫn compact nhưng có thể không Hausdorff.

---

## Tính chất nâng cao của hàm trên compact spaces

### Uniform continuity trong compact metric spaces

> [!definition] Definition 8.13 — Đồng đều liên tục (Uniformly Continuous)
> $f : (X, d_X) \to (Y, d_Y)$ gọi là **uniformly continuous** nếu với mọi $\varepsilon > 0$, tồn tại $\delta > 0$ sao cho:
>
> $$
> d_X(x, x') < \delta \implies d_Y(f(x), f(x')) < \varepsilon, \quad \forall\, x, x' \in X.
> $$
>
> Khác biệt với liên tục thông thường: $\delta$ chỉ phụ thuộc $\varepsilon$, **không phụ thuộc điểm** $x$.

> [!theorem] Theorem 8.14 — Compact $\Rightarrow$ Uniformly Continuous (Heine-Cantor)
> Nếu $f : X \to Y$ liên tục, $X$ compact metric space và $Y$ metric space, thì $f$ uniformly continuous.

**Proof.** Cho $\varepsilon > 0$. Với mỗi $x \in X$, tồn tại $\delta_x > 0$ sao cho $f(B(x, 2\delta_x)) \subseteq B(f(x), \varepsilon/2)$. Họ $\{B(x, \delta_x)\}$ phủ $X$ compact; lấy finite subcover tại $x_1, \ldots, x_n$ với bán kính $\delta_1, \ldots, \delta_n$. Đặt $\delta = \min_i \delta_i > 0$. Với bất kỳ $x, x'$ thỏa $d(x, x') < \delta$: $x$ thuộc $B(x_j, \delta_j)$ với một $j$, suy ra $x' \in B(x_j, 2\delta_j)$, nên $d_Y(f(x), f(x')) \leq d_Y(f(x), f(x_j)) + d_Y(f(x_j), f(x')) < \varepsilon/2 + \varepsilon/2 = \varepsilon$. $\blacksquare$

### Compact maps và proper maps

> [!definition] Definition 8.15 — Proper Map
> Ánh xạ $f : X \to Y$ gọi là **proper** nếu với mọi compact $K \subseteq Y$, nghịch ảnh $f^{-1}(K)$ compact trong $X$.

> [!theorem] Theorem 8.16 — Compact Hausdorff và closed maps
> Nếu $f : X \to Y$ liên tục và $X$ compact, $Y$ Hausdorff, thì $f$ là **closed map**: ảnh của mọi closed set là closed.

**Proof.** Cho $F \subseteq X$ đóng $\Rightarrow$ compact (Theorem 7.7) $\Rightarrow$ $f(F)$ compact (Theorem 7.9) $\Rightarrow$ $f(F)$ đóng trong $Y$ Hausdorff (Theorem 7.8). $\blacksquare$

---

## Compact-Open Topology (Giới thiệu)

> [!definition] Definition 8.17 — Compact-Open Topology
> Cho $X$ và $Y$ là không gian topo. Trên tập ánh xạ liên tục $C(X, Y) = \{f : X \to Y \mid f \text{ liên tục}\}$, **compact-open topology** là topology sinh bởi subbasis:
>
> $$
> \mathcal{S}_{K,U} = \{ f \in C(X,Y) : f(K) \subseteq U \},
> $$
>
> với $K \subseteq X$ compact và $U \subseteq Y$ mở, chạy qua mọi cặp $(K, U)$.

> [!note] Remark 8.18
> Compact-open topology là topology "tự nhiên" nhất trên $C(X,Y)$ — nó tương thích với phép hợp ánh xạ và biến $C(X,Y)$ thành không gian topo có tính chất tốt. Khi $X$ compact Hausdorff và $Y$ là metric space, compact-open topology trùng với topology hội tụ đều (uniform convergence topology) — đây là nền tảng của Arzelà-Ascoli (Bài 14).

---

## Tóm tắt quan hệ các tính chất compact

Sơ đồ bao hàm trong không gian topo tổng quát và metric:

```
Tổng quát:
  compact ──→ limit point compact
  compact ──→ countably compact

Metric spaces (ba tương đương):
  compact ⟺ sequentially compact ⟺ limit point compact

Đặc biệt:
  compact Hausdorff ──→ locally compact Hausdorff
  locally compact Hausdorff ──→ có one-point compactification compact Hausdorff
```

---

## SageMath Cheatsheet

```python
# Minh họa stereographic projection: one-point compactification của R ≅ S^1

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def stereo_to_circle(t):
    """Chiếu điểm t trên R lên S^1 qua stereographic projection từ cực bắc (0,1)."""
    # Cực bắc N=(0,1), chiếu lên trục x thực
    # Nghịch chiếu: t trên R → điểm (x,y) trên S^1 \ {N}
    denom = t**2 + 1
    x = 2*t / denom
    y = (t**2 - 1) / denom
    return x, y

# Vẽ minh họa
t_vals = np.linspace(-10, 10, 500)
xs, ys = stereo_to_circle(t_vals)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Trái: đường thẳng R
axes[0].axhline(0, color='blue', linewidth=2, label=r'$\mathbb{R}$')
axes[0].scatter([-5, 0, 5], [0, 0, 0], color='red', zorder=5, s=80)
axes[0].set_title(r'Đường thẳng $\mathbb{R}$ (không compact)')
axes[0].set_xlim(-8, 8); axes[0].legend()

# Phải: S^1 sau compactification
theta = np.linspace(0, 2*np.pi, 300)
axes[1].plot(np.cos(theta), np.sin(theta), 'b-', linewidth=1.5, label=r'$S^1 \cong \mathbb{R}^*$')
axes[1].plot(xs, ys, 'r-', linewidth=2, alpha=0.6)
axes[1].scatter([0], [1], color='green', s=120, zorder=5, label=r'$\infty$')
axes[1].set_aspect('equal')
axes[1].set_title(r'$\mathbb{R}^* = \mathbb{R} \cup \{\infty\} \cong S^1$')
axes[1].legend()

plt.suptitle('One-Point Compactification: Stereographic Projection', fontsize=13)
plt.tight_layout()
plt.savefig('one_point_compactification.png', dpi=100)
print("Đã lưu: one_point_compactification.png")

# Minh họa Heine-Cantor: uniform continuity trên compact
import scipy.optimize as opt

# f(x) = sin(1/x) trên (0,1] — liên tục nhưng KHÔNG uniformly continuous
# f(x) = sin(x) trên [0, 10] — uniformly continuous (compact domain)

def check_uniform_continuity(f, a, b, epsilon, n_samples=10000):
    """Ước lượng delta tốt nhất cho epsilon cho trước."""
    xs = np.linspace(a, b, n_samples)
    best_delta = float('inf')
    # Tìm cặp (x, x') gần nhau nhất vi phạm |f(x)-f(x')| >= epsilon
    for i in range(0, n_samples-1, 50):
        for j in range(i+1, min(i+200, n_samples)):
            dist_x = abs(xs[i] - xs[j])
            dist_f = abs(f(xs[i]) - f(xs[j]))
            if dist_f >= epsilon and dist_x < best_delta:
                best_delta = dist_x
    return best_delta

f_compact = np.sin  # trên [0, 10]
delta_est = check_uniform_continuity(f_compact, 0, 10, epsilon=0.1)
print(f"\nUniform continuity của sin(x) trên [0,10] với ε=0.1:")
print(f"  delta ước lượng ≥ {delta_est:.4f}  (tồn tại delta dương ✓)")
```

---

## Summary / Key Takeaways

- $X$ **locally compact Hausdorff (LCH)**: mọi điểm có neighborhood với closure compact — ví dụ $\mathbb{R}^n$, manifolds.
- **One-point compactification** $X^* = X \cup \{\infty\}$: compact Hausdorff, $X$ là subspace mở đặc trong $X^*$.
- $(\mathbb{R}^n)^* \cong S^n$: thêm "điểm vô cực" vào $\mathbb{R}^n$ cho mặt cầu $n$ chiều.
- **Heine-Cantor**: ánh xạ liên tục từ compact metric space luôn uniformly continuous.
- Hàm liên tục từ compact sang Hausdorff là **closed map**.
- **Compact-open topology** trên $C(X,Y)$: nền tảng cho lý thuyết không gian hàm (Bài 14).

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§29, 46.
- Willard, S. *General Topology*, §§18–19.
- Kelley, J. L. *General Topology*, Ch. 5.
- Folland, G. B. *Real Analysis* (2nd ed.), §4.5.
