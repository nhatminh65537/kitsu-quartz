---
title: "07. Compactness — Foundations"
tags: [math, point-set-topology, lesson-07]
aliases: [Compactness Foundations]
created: 2026-03-29
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[04-continuous-functions-homeomorphisms|04. Continuous Functions & Homeomorphisms]], [[05-metric-spaces|05. Metric Spaces]]
> **Objectives**:
> - Định nghĩa compact space qua open covers và nắm trực giác: compactness = "hữu hạn về topo"
> - Chứng minh và áp dụng định lý Heine-Borel: compact trong $\mathbb{R}^n \iff$ đóng và bị chặn
> - Nắm các hệ quả cơ bản: ảnh compact, extreme value theorem, compact Hausdorff
> - Hiểu limit point compactness và quan hệ của nó với compactness
> - Biết sequential compactness và khi nào nó tương đương compactness

---

## Motivation / Intuition

Tại sao một hàm liên tục trên $[0,1]$ đạt giá trị lớn nhất và nhỏ nhất, còn trên $(0,1)$ thì không? Tại sao mọi dãy trong $[0,1]$ đều có dãy con hội tụ, còn trong $\mathbb{R}$ thì không? Câu trả lời nằm ở một tính chất đặc biệt của $[0,1]$: nó **compact**.

Compact là một trong những tính chất quan trọng nhất trong tất cả toán học. Trực giác: compact = **"hành xử như tập hữu hạn"**, dù về mặt cardinality nó có thể vô hạn. Định nghĩa chính xác — mọi open cover đều có finite subcover — là sự mã hóa topo học của ý tưởng "không gian không thể trốn thoát ra vô tận".

Lịch sử: Heine (1872) và Borel (1895) chứng minh mọi phủ mở của $[a,b]$ có phủ con hữu hạn. Lebesgue, Fréchet, và các nhà toán học đầu thế kỷ 20 đã trừu tượng hóa khái niệm này. Ngày nay, compactness xuất hiện khắp nơi: từ giải tích hàm, lý thuyết xác suất, đến hình học vi phân.

---

## Compact Spaces

### Định nghĩa

> [!definition] Definition 7.1 — Open Cover và Finite Subcover
> Cho $(X, \mathcal{T})$ là không gian topo và $A \subseteq X$. Một **open cover** (phủ mở) của $A$ là một họ $\mathcal{U} = \{U_\alpha\}_{\alpha \in I}$ các open sets trong $X$ sao cho $A \subseteq \bigcup_{\alpha \in I} U_\alpha$.
>
> Một **subcover** (phủ con) của $\mathcal{U}$ là một họ con $\mathcal{U}' \subseteq \mathcal{U}$ vẫn phủ $A$. Subcover gọi là **finite** nếu $|\mathcal{U}'| < \infty$.

> [!definition] Definition 7.2 — Compact Space
> Không gian topo $X$ gọi là **compact** nếu mọi open cover của $X$ đều có finite subcover.
>
> Tập con $K \subseteq X$ gọi là compact nếu $(K, \mathcal{T}_K)$ compact với subspace topology — tương đương: mọi họ open sets trong $X$ phủ $K$ đều có họ con hữu hạn phủ $K$.

> [!note] Remark 7.3 — Tại sao "mọi" open cover?
> Định nghĩa yêu cầu finite subcover cho **mọi** open cover — không chỉ một vài cover đặc biệt. Đây là sức mạnh của điều kiện: ta không biết trước cover nào sẽ xuất hiện, nhưng compact đảm bảo luôn có thể "rút gọn" về hữu hạn nhiều tập.

### Ví dụ cơ bản

> [!example] Example 7.4 — Tập hữu hạn luôn compact
> Mọi tập hữu hạn $X = \{x_1, \ldots, x_n\}$ với topology bất kỳ đều compact: với mọi open cover $\{U_\alpha\}$, với mỗi $x_i$ chọn một $U_{\alpha_i}$ chứa $x_i$ — thu được subcover hữu hạn $\{U_{\alpha_1}, \ldots, U_{\alpha_n}\}$.

> [!example] Example 7.5 — $\mathbb{R}$ không compact
> Họ $\mathcal{U} = \{(-n, n) : n \in \mathbb{N}^+\}$ là open cover của $\mathbb{R}$ nhưng không có finite subcover: bất kỳ họ con hữu hạn nào cũng bị chặn trong $(-N, N)$ với $N$ đủ lớn, không phủ toàn $\mathbb{R}$.

> [!example] Example 7.6 — $(0,1)$ không compact
> Họ $\mathcal{U} = \{(\tfrac{1}{n}, 1) : n \geq 2\}$ là open cover của $(0,1)$ nhưng không có finite subcover: $\bigcup_{k=2}^{N} (\tfrac{1}{k}, 1) = (\tfrac{1}{N}, 1)$ không chứa $(0, \tfrac{1}{N})$.

---

## Tính chất của Compact Spaces

> [!theorem] Theorem 7.7 — Tập đóng trong compact là compact
> Nếu $X$ compact và $F \subseteq X$ đóng, thì $F$ compact.

**Proof.** Cho $\{U_\alpha\}$ là open cover của $F$ trong $X$. Khi đó $\{U_\alpha\} \cup \{X \setminus F\}$ là open cover của $X$ (vì $X \setminus F$ mở). Do $X$ compact, có finite subcover $\{U_{\alpha_1}, \ldots, U_{\alpha_n}, X \setminus F\}$ của $X$. Bỏ $X \setminus F$ đi, $\{U_{\alpha_1}, \ldots, U_{\alpha_n}\}$ vẫn phủ $F$. $\blacksquare$

> [!theorem] Theorem 7.8 — Compact trong Hausdorff là đóng
> Nếu $X$ Hausdorff và $K \subseteq X$ compact, thì $K$ đóng.

**Proof.** Ta chứng minh $X \setminus K$ mở. Cho $x \in X \setminus K$. Với mỗi $y \in K$, vì $X$ Hausdorff, có open sets $U_y \ni x$ và $V_y \ni y$ với $U_y \cap V_y = \emptyset$. Họ $\{V_y\}_{y \in K}$ phủ $K$; vì $K$ compact, có finite subcover $\{V_{y_1}, \ldots, V_{y_n}\}$. Đặt $U = U_{y_1} \cap \cdots \cap U_{y_n}$: đây là open set chứa $x$ và $U \cap K = \emptyset$, nên $U \subseteq X \setminus K$. $\blacksquare$

> [!theorem] Theorem 7.9 — Ảnh liên tục của compact là compact
> Nếu $f : X \to Y$ liên tục và $X$ compact thì $f(X)$ compact.

**Proof.** Cho $\{V_\alpha\}$ là open cover của $f(X)$. Thì $\{f^{-1}(V_\alpha)\}$ là open cover của $X$; có finite subcover $\{f^{-1}(V_{\alpha_1}), \ldots, f^{-1}(V_{\alpha_n})\}$. Suy ra $\{V_{\alpha_1}, \ldots, V_{\alpha_n}\}$ phủ $f(X)$. $\blacksquare$

> [!theorem] Theorem 7.10 — Extreme Value Theorem (Định lý giá trị cực trị)
> Nếu $f : X \to \mathbb{R}$ liên tục và $X$ compact, thì $f$ đạt giá trị lớn nhất và nhỏ nhất trên $X$.

**Proof.** $f(X)$ compact trong $\mathbb{R}$ (Theorem 7.9), do đó đóng và bị chặn (Heine-Borel, Theorem 7.13 dưới). Vì $f(X)$ đóng và bị chặn, $\sup f(X)$ và $\inf f(X)$ đều thuộc $f(X)$. $\blacksquare$

> [!theorem] Theorem 7.11 — Compact Hausdorff và homeomorphism
> Nếu $f : X \to Y$ là song ánh liên tục với $X$ compact và $Y$ Hausdorff, thì $f$ là homeomorphism.

**Proof.** Cần chứng minh $f^{-1}$ liên tục, tức $f$ là closed map. Nếu $F \subseteq X$ đóng, thì $F$ compact (Theorem 7.7), $f(F)$ compact (Theorem 7.9), $f(F)$ đóng trong $Y$ Hausdorff (Theorem 7.8). $\blacksquare$

> [!note] Remark 7.12
> Theorem 7.11 rất hữu dụng: thay vì kiểm tra $f^{-1}$ liên tục, ta chỉ cần biết $X$ compact và $Y$ Hausdorff. Ví dụ: $[0, 2\pi] / \{0, 2\pi\} \cong S^1$ (nhận diện hai đầu mút) — dễ chứng minh bằng định lý này.

---

## Định lý Heine-Borel

> [!theorem] Theorem 7.13 — Heine-Borel Theorem
> Một tập con $K \subseteq \mathbb{R}^n$ compact khi và chỉ khi $K$ **đóng** (closed) và **bị chặn** (bounded).

**Proof.** ($\Rightarrow$) Nếu $K$ compact: $K$ đóng trong $\mathbb{R}^n$ Hausdorff (Theorem 7.8). $K$ bị chặn: cover $\{B(0, n) : n \in \mathbb{N}^+\}$ có finite subcover, suy ra $K \subseteq B(0, N)$ với $N$ đủ lớn.

($\Leftarrow$) Nếu $K$ đóng và bị chặn: đủ chứng minh mọi $[a,b]^n$ compact (hình hộp kín), vì $K$ đóng trong một hình hộp compact. Ta chứng minh cho $n=1$, trường hợp tổng quát tương tự. Cho $[a,b]$ và open cover $\mathcal{U}$. Giả sử $\mathcal{U}$ không có finite subcover. Chia $[a,b]$ làm đôi: $[a, \frac{a+b}{2}]$ và $[\frac{a+b}{2}, b]$. Ít nhất một nửa không có finite subcover. Tiếp tục chia mãi, thu được dãy lồng các đoạn $[a_n, b_n]$ với $b_n - a_n = \frac{b-a}{2^n} \to 0$. Điểm $c = \lim a_n \in [a,b]$ phải thuộc một $U \in \mathcal{U}$; vì $U$ mở, có đoạn $[a_N, b_N] \subseteq U$ với $N$ đủ lớn — mâu thuẫn với giả sử $[a_N, b_N]$ không có finite subcover. $\blacksquare$

> [!example] Example 7.14 — Áp dụng Heine-Borel
> - $[0,1]$: đóng và bị chặn trong $\mathbb{R}$ $\Rightarrow$ compact. ✓
> - $(0,1)$: không đóng $\Rightarrow$ không compact. ✓
> - $S^{n-1} = \{x \in \mathbb{R}^n : \|x\| = 1\}$: đóng (preimage của $\{1\}$ qua hàm liên tục $\|{\cdot}\|$) và bị chặn $\Rightarrow$ compact. ✓
> - $\mathbb{Z} \subset \mathbb{R}$: đóng nhưng không bị chặn $\Rightarrow$ không compact. ✓

> [!warning] Counterexample 7.15 — Heine-Borel sai trong không gian metric tổng quát
> Định lý Heine-Borel (đóng + bị chặn $\Rightarrow$ compact) **chỉ đúng trong $\mathbb{R}^n$** với metric Euclidean (hoặc metric tương đương). Trong không gian metric tổng quát: tập đơn vị $\overline{B}(0,1)$ trong không gian Banach vô hạn chiều **không** compact dù đóng và bị chặn.

---

## Finite Intersection Property

> [!definition] Definition 7.16 — Finite Intersection Property (FIP)
> Một họ tập $\{C_\alpha\}$ có **finite intersection property (FIP)** nếu mọi giao hữu hạn $C_{\alpha_1} \cap \cdots \cap C_{\alpha_n} \neq \emptyset$.

> [!theorem] Theorem 7.17 — Đặc trưng compact qua FIP
> $X$ compact $\iff$ với mọi họ tập đóng $\{C_\alpha\}$ có FIP, ta có $\bigcap_\alpha C_\alpha \neq \emptyset$.

**Proof.** Lấy bù: họ open sets phủ $X$ $\iff$ không có giao nào của bù chúng bằng rỗng. FIP là đảo của "có finite subcover". $\blacksquare$

> [!corollary] Corollary 7.18 — Nested compact sets
> Nếu $K_1 \supseteq K_2 \supseteq K_3 \supseteq \cdots$ là dãy lồng nhau các tập compact không rỗng, thì $\bigcap_{n=1}^\infty K_n \neq \emptyset$.

---

## Compactness trong Metric Spaces

### Limit Point Compactness

> [!definition] Definition 7.19 — Limit Point Compact
> $X$ gọi là **limit point compact** (hay **Bolzano-Weierstrass compact**) nếu mọi tập con vô hạn của $X$ đều có limit point trong $X$.

> [!theorem] Theorem 7.20 — Compact $\Rightarrow$ Limit Point Compact
> Mọi compact space đều limit point compact.

**Proof.** Cho $A \subseteq X$ vô hạn, giả sử $A$ không có limit point. Khi đó với mỗi $x \in X$, tồn tại $U_x$ mở chứa $x$ và $U_x \cap A \subseteq \{x\}$ (chứa nhiều nhất điểm $x$). Họ $\{U_x\}_{x \in X}$ phủ $X$; finite subcover $\{U_{x_1}, \ldots, U_{x_n}\}$ chỉ gặp $A$ tại hữu hạn điểm — mâu thuẫn $A$ vô hạn. $\blacksquare$

> [!warning] Counterexample 7.21 — Limit point compact không kéo theo compact
> Với topology "long line" hoặc một số không gian kỳ dị, limit point compact không kéo theo compact. Trong metric spaces thì tương đương (xem dưới).

### Sequential Compactness

> [!definition] Definition 7.22 — Sequentially Compact
> $X$ gọi là **sequentially compact** nếu mọi dãy trong $X$ đều có dãy con hội tụ trong $X$.

> [!theorem] Theorem 7.23 — Ba khái niệm tương đương trong metric spaces
> Với metric space $(X, d)$, ba điều sau tương đương:
>
> 1. $X$ compact.
> 2. $X$ limit point compact.
> 3. $X$ sequentially compact.

**Proof sketch.** $(1) \Rightarrow (2)$: Theorem 7.20. $(2) \Rightarrow (3)$: Cho dãy $(x_n)$; nếu $\{x_n\}$ hữu hạn thì có phần tử lặp vô hạn lần, trích dãy con hằng. Nếu $\{x_n\}$ vô hạn, có limit point $x$; dùng first-countability của metric space để chọn dãy con $\to x$. $(3) \Rightarrow (1)$: Dùng $\varepsilon$-net argument: với mọi $\varepsilon > 0$ tồn tại $\varepsilon$-net hữu hạn (vì không thể có dãy $\varepsilon$-tách biệt vô hạn bởi sequential compactness); rồi dùng Lebesgue number lemma để chuyển về finite subcover. $\blacksquare$

### Lebesgue Number Lemma

> [!theorem] Theorem 7.24 — Lebesgue Number Lemma
> Cho $(X, d)$ là metric space sequentially compact và $\mathcal{U}$ là open cover của $X$. Tồn tại $\delta > 0$ (gọi là **Lebesgue number** của $\mathcal{U}$) sao cho với mọi $A \subseteq X$ có $\operatorname{diam}(A) < \delta$, tồn tại $U \in \mathcal{U}$ với $A \subseteq U$.

**Proof.** Giả sử không tồn tại $\delta$ như vậy. Với mỗi $n$, có $A_n$ với $\operatorname{diam}(A_n) < \frac{1}{n}$ nhưng không nằm trong $U$ nào. Chọn $x_n \in A_n$; vì $X$ sequentially compact, có dãy con $x_{n_k} \to x \in U_0 \in \mathcal{U}$. Với $k$ đủ lớn, $A_{n_k} \subseteq B(x, \varepsilon) \subseteq U_0$ — mâu thuẫn. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Minh họa compact sets trong R^n và kiểm tra Heine-Borel

import numpy as np

def is_bounded(points, threshold=1e6):
    """Kiểm tra tập điểm có bị chặn không."""
    norms = [np.linalg.norm(p) for p in points]
    return max(norms) < threshold

# Ví dụ: tập S^1 (compact: đóng + bị chặn trong R^2)
theta = np.linspace(0, 2*np.pi, 1000)
S1 = [(np.cos(t), np.sin(t)) for t in theta]
print(f"S^1 bị chặn: {is_bounded(S1)}")       # True
print(f"Max norm trên S^1: {max(np.linalg.norm(p) for p in S1):.6f}")  # ~1.0

# Minh họa Extreme Value Theorem
# f liên tục trên [0,1] compact => đạt min/max
f = lambda x: np.sin(3*x) * np.exp(-x)
xs = np.linspace(0, 1, 10000)
ys = f(xs)
print(f"\nTrên [0,1]: max f = {max(ys):.6f}, min f = {min(ys):.6f}")
print(f"Đạt tại x_max = {xs[np.argmax(ys)]:.6f}, x_min = {xs[np.argmin(ys)]:.6f}")

# Minh họa FIP: nested compact sets có giao khác rỗng
# K_n = [0, 1/n] trong R
def nested_intersection(N):
    """Tính giao lồng nhau K_1 ⊃ K_2 ⊃ ... ⊃ K_N với K_n = [0, 1/n]."""
    # Giao là {0} = lim [0, 1/n]
    return [0, 1/N]

for n in [1, 10, 100, 1000]:
    lo, hi = nested_intersection(n)
    print(f"K_{n} = [0, 1/{n}] = [{lo}, {hi:.6f}]")
print("Giao K_n = {0} ≠ ∅  — FIP thỏa, giao khác rỗng ✓")

# Sequential compactness: mọi dãy trong [0,1] có dãy con hội tụ
np.random.seed(42)
seq = np.random.uniform(0, 1, 100)  # dãy trong [0,1]
seq_sorted_idx = np.argsort(seq)     # dãy con tăng dần → hội tụ
print(f"\nDãy con tăng đầu tiên: {seq[seq_sorted_idx[:5]]}")
```

---

## Summary / Key Takeaways

- $X$ **compact** $\iff$ mọi open cover có finite subcover — trực giác: "không thể trốn ra vô tận".
- Tập đóng trong compact là compact; compact trong Hausdorff là đóng.
- **Ảnh liên tục của compact là compact** — hệ quả: Extreme Value Theorem.
- Song ánh liên tục từ compact sang Hausdorff tự động là homeomorphism.
- **Heine-Borel**: $K \subset \mathbb{R}^n$ compact $\iff$ đóng và bị chặn.
- **FIP**: $X$ compact $\iff$ mọi họ đóng có FIP đều có giao khác rỗng.
- Trong metric spaces: compact $\iff$ limit point compact $\iff$ sequentially compact.
- **Lebesgue Number Lemma**: mọi open cover của metric compact có Lebesgue number dương.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§26–28.
- Willard, S. *General Topology*, §§17–18.
- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Ch. 2.
- Kelley, J. L. *General Topology*, Ch. 5.
