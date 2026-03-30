---
title: "06. Connectedness"
tags: [math, point-set-topology, lesson-06]
aliases: [Connectedness]
created: 2026-03-29
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[04-continuous-functions-homeomorphisms|04. Continuous Functions & Homeomorphisms]]
> **Objectives**:
> - Định nghĩa connected space qua sự vắng mặt của phân tách (separation)
> - Phân biệt connectedness và path-connectedness, biết chiều liên hệ giữa hai khái niệm
> - Hiểu connected components là gì và chúng phân hoạch không gian như thế nào
> - Nắm local connectedness và ví dụ phản chứng kinh điển (topologist's sine curve)

---

## Motivation / Intuition

Ý tưởng về "liên thông" (connectedness) rất trực quan: mặt phẳng $\mathbb{R}^2$ là liên thông — ta có thể đi từ bất kỳ điểm nào đến bất kỳ điểm nào khác mà không cần nhấc chân. Nhưng $\mathbb{R} \setminus \{0\}$ thì không — bị chia thành hai "mảnh" $(-\infty, 0)$ và $(0, +\infty)$.

Định nghĩa topo học của liên thông không đề cập đến "đường đi" mà hỏi: **có thể chia không gian thành hai phần mở tách biệt nhau không?** Cách tiếp cận này tổng quát hơn và cho phép ta phân biệt các không gian rất khác nhau.

Connectedness là **topological property**: nếu $X \cong Y$ và $X$ liên thông thì $Y$ liên thông. Đây là một trong những công cụ cơ bản nhất để chứng minh hai không gian **không** homeomorphic.

---

## Connected Spaces

### Định nghĩa

> [!definition] Definition 6.1 — Separation (Phân tách) và Connected Space
> Một **separation** của không gian topo $X$ là cặp $(U, V)$ gồm hai tập mở khác rỗng, rời nhau và phủ kín $X$:
>
> $$
> U \neq \emptyset,\quad V \neq \emptyset, \quad U \cap V = \emptyset, \quad U \cup V = X.
> $$
>
> Không gian $X$ gọi là **connected (liên thông)** nếu không tồn tại separation nào của $X$.

> [!note] Remark 6.2 — Cách phát biểu tương đương
> $X$ liên thông $\iff$ không tập con nào của $X$ vừa mở vừa đóng (clopen) ngoại trừ $\emptyset$ và $X$ $\iff$ mọi hàm liên tục $f : X \to \{0, 1\}$ (với $\{0,1\}$ mang discrete topology) là hàm hằng.

> [!example] Example 6.3 — $\mathbb{R}$ liên thông
> Giả sử $\mathbb{R} = U \cup V$ là separation. Lấy $a \in U$, $b \in V$, giả sử $a < b$. Đặt $c = \sup(U \cap [a,b])$. Vì $U$ mở, $c \notin U$ (nếu $c \in U$ thì có khoảng $(c-\varepsilon, c+\varepsilon) \subseteq U$ mâu thuẫn với $c$ là sup). Vậy $c \in V$. Vì $V$ mở, có khoảng $(c-\delta, c+\delta) \subseteq V$, nhưng khi đó $c - \frac{\delta}{2}$ không thể ở $U$ — mâu thuẫn với $c$ là sup. Vậy không tồn tại separation. $\blacksquare$

> [!warning] Counterexample 6.4 — $\mathbb{Q}$ không liên thông
> $\mathbb{Q}$ không liên thông: đặt $U = \{q \in \mathbb{Q} : q < \sqrt{2}\}$ và $V = \{q \in \mathbb{Q} : q > \sqrt{2}\}$. Cả $U, V$ đều mở trong $\mathbb{Q}$ (subspace topology từ $\mathbb{R}$), $U \cup V = \mathbb{Q}$, $U \cap V = \emptyset$. Đây là separation.

### Định lý cơ bản

> [!theorem] Theorem 6.5 — Ảnh liên tục của không gian liên thông
> Nếu $f : X \to Y$ liên tục và $X$ liên thông thì $f(X)$ liên thông trong $Y$.

**Proof.** Giả sử $f(X) = A \cup B$ là separation của $f(X)$ (với $A, B$ mở trong $f(X)$). Thì $X = f^{-1}(A) \cup f^{-1}(B)$ với $f^{-1}(A), f^{-1}(B)$ mở (do $f$ liên tục), rời nhau, phủ $X$ — mâu thuẫn với $X$ liên thông. $\blacksquare$

> [!theorem] Theorem 6.6 — Intermediate Value Theorem (Định lý giá trị trung gian)
> Hệ quả trực tiếp: nếu $f : X \to \mathbb{R}$ liên tục, $X$ liên thông, và $f(a) < r < f(b)$ với $a, b \in X$, thì tồn tại $c \in X$ sao cho $f(c) = r$.

**Proof.** $f(X)$ liên thông (Theorem 6.5), do đó là khoảng (Theorem 6.7 dưới đây), nên chứa $r$. $\blacksquare$

> [!theorem] Theorem 6.7 — Tập liên thông trong $\mathbb{R}$
> Một tập con $A \subseteq \mathbb{R}$ liên thông khi và chỉ khi $A$ là một khoảng (bao gồm cả các trường hợp suy biến: khoảng rỗng, singleton, ray vô hạn, toàn bộ $\mathbb{R}$).

**Proof sketch.** ($\Leftarrow$) Khoảng liên thông: giống chứng minh $\mathbb{R}$ liên thông, dùng sup. ($\Rightarrow$) Nếu $A$ không phải khoảng, tồn tại $a, b \in A$ và $r \in \mathbb{R} \setminus A$ với $a < r < b$. Khi đó $U = A \cap (-\infty, r)$ và $V = A \cap (r, +\infty)$ tạo separation. $\blacksquare$

### Hợp và tích của không gian liên thông

> [!theorem] Theorem 6.8 — Hợp của các không gian liên thông có điểm chung
> Nếu $\{A_\alpha\}$ là họ các không gian liên thông và $\bigcap_\alpha A_\alpha \neq \emptyset$, thì $\bigcup_\alpha A_\alpha$ liên thông.

**Proof.** Cho $f : \bigcup A_\alpha \to \{0,1\}$ liên tục. Với mỗi $\alpha$, $f|_{A_\alpha}$ là hằng (vì $A_\alpha$ liên thông). Vì tất cả $A_\alpha$ có điểm chung, tất cả cùng nhận giá trị tại điểm đó, nên $f$ hằng toàn cục. $\blacksquare$

> [!theorem] Theorem 6.9 — Tích của không gian liên thông
> Nếu $\{X_\alpha\}$ là họ các không gian liên thông, thì $\prod_\alpha X_\alpha$ (với product topology) liên thông.

**Proof sketch.** Với product hữu hạn: $X \times Y$ liên thông nếu $X$, $Y$ liên thông — vì với mọi $a \in X$, $\{a\} \times Y \cong Y$ liên thông; và $X \times \{b\} \cong X$ liên thông; chúng có điểm chung $(a,b)$, áp dụng Theorem 6.8. Dùng quy nạp cho hữu hạn, dùng Theorem 6.8 với gia tăng dần cho vô hạn. $\blacksquare$

---

## Connected Components

> [!definition] Definition 6.10 — Connected Component (Thành phần liên thông)
> **Thành phần liên thông (connected component)** của $x \in X$ là hợp của tất cả các tập liên thông chứa $x$:
>
> $$
> C(x) = \bigcup \{ A \subseteq X : A \text{ liên thông},\ x \in A \}.
> $$

> [!theorem] Theorem 6.11 — Tính chất của connected components
> Với mọi không gian topo $X$:
>
> 1. Mỗi $C(x)$ liên thông và đóng.
> 2. Các connected components tạo thành một **phân hoạch** của $X$: hoặc $C(x) = C(y)$ hoặc $C(x) \cap C(y) = \emptyset$.
> 3. $X$ liên thông $\iff$ $X$ chỉ có một connected component duy nhất.

**Proof.** (1) $C(x)$ là hợp các tập liên thông có điểm chung $x$, nên liên thông (Theorem 6.8). Closure của tập liên thông là liên thông (Theorem 6.12 dưới đây), nên $C(x)$ đóng. (2) Nếu $y \in C(x)$ thì $C(y) \subseteq C(x)$ (vì $C(x)$ liên thông chứa $y$) và $C(x) \subseteq C(y)$ tương tự. $\blacksquare$

> [!theorem] Theorem 6.12 — Closure của tập liên thông
> Nếu $A \subseteq X$ liên thông và $A \subseteq B \subseteq \overline{A}$, thì $B$ liên thông.

---

## Path-Connectedness

### Định nghĩa

> [!definition] Definition 6.13 — Path và Path-Connected Space
> Một **path** (đường đi) trong $X$ từ $x$ đến $y$ là ánh xạ liên tục $\gamma : [0,1] \to X$ với $\gamma(0) = x$ và $\gamma(1) = y$.
>
> Không gian $X$ gọi là **path-connected (liên thông đường)** nếu với mọi $x, y \in X$, tồn tại path từ $x$ đến $y$.

> [!theorem] Theorem 6.14 — Path-connected $\Rightarrow$ Connected
> Mọi path-connected space đều liên thông.

**Proof.** Giả sử $X$ path-connected. Cho $f : X \to \{0,1\}$ liên tục. Với bất kỳ $x, y \in X$, lấy path $\gamma : [0,1] \to X$; khi đó $f \circ \gamma : [0,1] \to \{0,1\}$ liên tục. Vì $[0,1]$ liên thông, $f \circ \gamma$ hằng, nên $f(x) = f(y)$. Vậy $f$ hằng toàn cục, $X$ liên thông. $\blacksquare$

> [!warning] Counterexample 6.15 — Topologist's Sine Curve
> Chiều ngược **không đúng**: tồn tại không gian liên thông nhưng **không** path-connected.
>
> Định nghĩa **topologist's sine curve** $S \subset \mathbb{R}^2$:
>
> $$
> S = \left\{ \left(x,\, \sin\!\tfrac{1}{x}\right) : x \in (0,1] \right\} \cup \{0\} \times [-1, 1].
> $$
>
> Tập $S$ liên thông (là closure của đồ thị $\sin(1/x)$ liên thông). Tuy nhiên $S$ **không** path-connected: không có path nào nối một điểm trên $\{0\} \times [-1,1]$ với một điểm trên đồ thị $\sin(1/x)$, vì đồ thị dao động vô hạn khi $x \to 0^+$.

### Path components

> [!definition] Definition 6.16 — Path Component
> **Path component** của $x$ là hợp tất cả các điểm có thể nối với $x$ bằng path. Path components cũng tạo phân hoạch của $X$, nhưng không nhất thiết đóng.

---

## Local Connectedness

> [!definition] Definition 6.17 — Locally Connected (Liên thông địa phương)
> $X$ gọi là **locally connected** tại $x$ nếu với mọi neighborhood $U$ của $x$, tồn tại neighborhood mở $V \subseteq U$ của $x$ sao cho $V$ liên thông.
>
> $X$ locally connected nếu nó locally connected tại mọi điểm.

> [!note] Remark 6.18 — Liên thông ≠ Liên thông địa phương
> Hai khái niệm này **độc lập nhau**:
> - $\mathbb{R}$ vừa liên thông vừa locally connected.
> - Topologist's sine curve $S$: liên thông nhưng **không** locally connected tại các điểm $\{0\} \times [-1,1]$.
> - $\mathbb{Q}$ không liên thông nhưng locally connected (mọi neighborhood đều disconnected, nhưng có thể chọn neighborhood liên thông — thực ra $\mathbb{Q}$ cũng không locally connected).
> - $[0,1] \cup [2,3]$: locally connected nhưng không connected.

> [!theorem] Theorem 6.19 — Đặc trưng locally connected
> $X$ locally connected $\iff$ với mọi open set $U \subseteq X$, mọi connected component của $U$ đều là mở trong $X$.

---

## SageMath Cheatsheet

```python
# Minh họa connectedness trên đồ thị (graph connectivity ~ topological connectedness)

# Dùng SageMath graphs để minh họa connected components
G = Graph({1: [2, 3], 2: [3], 4: [5], 6: []})
print("Connected components:", G.connected_components())
# Output: [[1, 2, 3], [4, 5], [6]]

# Minh họa Intermediate Value Theorem
import numpy as np

def ivt_find(f, a, b, target, tol=1e-8):
    """Tìm c trong (a,b) sao cho f(c) = target (bisection)."""
    fa, fb = f(a) - target, f(b) - target
    if fa * fb > 0:
        return None  # Không đảm bảo tồn tại
    while (b - a) > tol:
        mid = (a + b) / 2
        fm = f(mid) - target
        if fa * fm <= 0:
            b, fb = mid, fm
        else:
            a, fa = mid, fm
    return (a + b) / 2

f = lambda x: x**3 - 2*x - 5
c = ivt_find(f, 2.0, 3.0, 0.0)
print(f"\nIVT: nghiệm của x^3 - 2x - 5 = 0 trong (2,3): c = {c:.8f}")
print(f"f(c) = {f(c):.2e}")
# Output: c ≈ 2.09455148

# Vẽ topologist's sine curve
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

x_vals = np.linspace(0.001, 1, 5000)
y_vals = np.sin(1 / x_vals)

plt.figure(figsize=(8, 4))
plt.plot(x_vals, y_vals, 'b-', linewidth=0.5, label=r'$\sin(1/x)$, $x \in (0,1]$')
plt.vlines(0, -1, 1, colors='r', linewidth=2, label=r'$\{0\} \times [-1,1]$')
plt.title("Topologist's Sine Curve — Connected but not Path-Connected")
plt.xlabel('x'); plt.ylabel('y')
plt.legend(); plt.tight_layout()
plt.savefig('topologists_sine_curve.png', dpi=100)
print("Đã lưu hình: topologists_sine_curve.png")
```

---

## Summary / Key Takeaways

- $X$ **connected** $\iff$ không có separation $(U,V)$ $\iff$ không có tập clopen nào ngoại trừ $\emptyset$ và $X$.
- Ảnh liên tục của không gian liên thông là liên thông — **Intermediate Value Theorem** là hệ quả.
- Tập liên thông trong $\mathbb{R}$ $\iff$ là khoảng.
- Hợp của các tập liên thông có điểm chung là liên thông; tích (Tychonoff) của liên thông là liên thông.
- **Connected components**: phân hoạch thành các tập liên thông tối đại, mỗi component đóng.
- $X$ **path-connected** $\implies$ $X$ connected, nhưng chiều ngược **sai** (topologist's sine curve).
- **Locally connected**: mọi neighborhood chứa neighborhood liên thông — độc lập với connectedness.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§23–26.
- Willard, S. *General Topology*, §§26–27.
- Hatcher, A. *Notes on Introductory Point-Set Topology*, §1.
- Armstrong, M. A. *Basic Topology*, Ch. 3.
