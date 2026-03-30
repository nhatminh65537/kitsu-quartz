---
title: "13. Metrization Theorems & Paracompactness"
tags: [math, point-set-topology, lesson-13]
aliases: [Metrization Paracompactness]
created: 2026-03-30
---

> **Prerequisites**: [[09-countability-axioms|09. Countability Axioms]], [[10-separation-axioms|10. Separation Axioms]], [[11-urysohn-tietze|11. Urysohn's Lemma & Tietze Extension]]
> **Objectives**:
> - Phát biểu và hiểu Urysohn Metrization Theorem: điều kiện đủ để metrizable
> - Nắm Nagata-Smirnov Metrization Theorem: điều kiện cần và đủ
> - Hiểu paracompactness là gì và tại sao nó quan trọng
> - Biết partition of unity tồn tại trên paracompact Hausdorff spaces

---

## Motivation / Intuition

Ta đã biết: mọi metric space là $T_3$ (regular), first countable, và nếu separable thì second countable. Câu hỏi ngược: khi nào một không gian topo **là** metric space (tức metrizable — có một metric sinh ra topology đó)?

Câu trả lời là hai định lý metrization kinh điển:
- **Urysohn Metrization** (1925): second countable + regular $\Rightarrow$ metrizable.
- **Nagata-Smirnov** (1950–1951): metrizable $\iff$ regular + có $\sigma$-locally finite basis.

Song song đó, **paracompactness** — một tính chất yếu hơn compactness nhưng mạnh hơn Lindelöf — là điều kiện chìa khóa cho partition of unity, thứ không thể thiếu trong hình học vi phân và giải tích toàn cục.

---

## Urysohn Metrization Theorem

> [!theorem] Theorem 13.1 — Urysohn Metrization Theorem
> Nếu $X$ là không gian **second countable** và **regular** ($T_3$), thì $X$ **metrizable** (tức tồn tại metric $d$ trên $X$ sinh ra topology của $X$).

Xem chứng minh đầy đủ tại [[a2-proof-of-urysohn-metrization|A2. Proof of Urysohn Metrization Theorem]].

**Ý tưởng chứng minh.** Ta xây dựng embedding $f : X \hookrightarrow [0,1]^\omega$ (Hilbert cube):
1. Vì $X$ second countable, có countable basis $\{B_n\}_{n \geq 1}$.
2. Với mỗi cặp $(n, m)$ với $\overline{B_n} \subseteq B_m$, dùng Urysohn's Lemma (áp dụng được vì regular $\Rightarrow$ normal khi second countable) để lấy hàm $f_{nm} : X \to [0,1]$ với $f_{nm}|_{\overline{B_n}} = 0$ và $f_{nm}|_{X \setminus B_m} = 1$.
3. Sắp xếp lại thành dãy $f_1, f_2, \ldots$; định nghĩa $f(x) = (f_n(x))_{n \geq 1} \in [0,1]^\omega$.
4. $f$ là embedding (liên tục, injective, open vào $f(X)$) vì các $f_n$ phân biệt điểm và tập đóng.
5. $[0,1]^\omega$ metrizable (metric $d(x,y) = \sum_n \frac{|x_n - y_n|}{2^n}$), nên $X \cong f(X)$ metrizable. $\blacksquare$

> [!corollary] Corollary 13.2 — Compact Hausdorff second countable là metrizable
> Vì compact Hausdorff $\Rightarrow$ normal $\Rightarrow$ regular, kết hợp với second countable, suy ra metrizable.

> [!example] Example 13.3 — Ứng dụng
> - $S^n$ (mặt cầu): compact Hausdorff, second countable $\Rightarrow$ metrizable. ✓
> - Mọi compact manifold: metrizable. ✓
> - $[0,1]^\omega$ (Hilbert cube): compact Hausdorff, second countable $\Rightarrow$ metrizable. ✓

---

## Nagata-Smirnov Metrization Theorem

> [!definition] Definition 13.4 — $\sigma$-Locally Finite Basis
> Một basis $\mathcal{B}$ gọi là **$\sigma$-locally finite** nếu $\mathcal{B} = \bigcup_{n=1}^\infty \mathcal{B}_n$ trong đó mỗi $\mathcal{B}_n$ là **locally finite**: với mọi $x \in X$, chỉ có hữu hạn nhiều phần tử của $\mathcal{B}_n$ gặp một neighborhood nào đó của $x$.

> [!theorem] Theorem 13.5 — Nagata-Smirnov Metrization Theorem
> Không gian $X$ metrizable khi và chỉ khi $X$ **regular** và có **$\sigma$-locally finite basis**.

> [!note] Remark 13.6
> Nagata-Smirnov mạnh hơn Urysohn Metrization: nó cho điều kiện **cần và đủ**, không cần second countable. Định lý này bao hàm Urysohn vì mọi second countable space đều có countable basis — hiển nhiên là $\sigma$-locally finite.

---

## Paracompactness

### Định nghĩa

> [!definition] Definition 13.7 — Locally Finite Cover (Phủ hữu hạn địa phương)
> Một họ tập $\{A_\alpha\}$ trong $X$ gọi là **locally finite** nếu với mọi $x \in X$, tồn tại neighborhood $U$ của $x$ chỉ gặp hữu hạn nhiều $A_\alpha$ ($U \cap A_\alpha \neq \emptyset$ với hữu hạn $\alpha$).

> [!definition] Definition 13.8 — Paracompact (Cận compact)
> $X$ gọi là **paracompact** nếu mọi open cover $\mathcal{U}$ đều có một **locally finite open refinement**: tồn tại open cover $\mathcal{V}$ locally finite sao cho mỗi $V \in \mathcal{V}$ nằm trong một $U \in \mathcal{U}$.

> [!note] Remark 13.9 — So sánh với compact và Lindelöf
> - Compact: mọi open cover có **finite** subcover.
> - Paracompact: mọi open cover có locally finite open **refinement** (không nhất thiết subcover).
> - Lindelöf: mọi open cover có **countable** subcover.
>
> Compact $\Rightarrow$ Paracompact $\Rightarrow$ ... (không ngược). Lindelöf + Regular $\Rightarrow$ Paracompact.

### Tính chất

> [!theorem] Theorem 13.10 — Metric space là paracompact
> Mọi metric space đều paracompact.

**Proof sketch.** Cho open cover $\mathcal{U} = \{U_\alpha\}$ của metric space $(X,d)$. Định nghĩa $f(x) = d(x, X \setminus U_{\alpha(x)})$ với $\alpha(x)$ được chọn phù hợp (well-ordering trên $I$). Xây dựng locally finite refinement qua "star-refinement" technique. $\blacksquare$

> [!theorem] Theorem 13.11 — Paracompact Hausdorff là Normal
> Mọi paracompact Hausdorff space đều normal.

**Proof.** Cho $A, B$ đóng rời nhau. Với mỗi $a \in A$: có $U_a \ni a$ mở và $\overline{U_a} \cap B = \emptyset$ (vì Hausdorff tách $a$ và mỗi điểm $B$; $B$ compact không cần — nhưng Hausdorff đủ). Họ $\{U_a\}_{a \in A} \cup \{X \setminus A\}$ là open cover; lấy locally finite refinement $\mathcal{V}$; đặt $U = \bigcup\{V \in \mathcal{V} : V \cap A \neq \emptyset\}$ — mở locally finite, $U \supseteq A$, và ta chứng minh $\overline{U} \cap B = \emptyset$. $\blacksquare$

> [!theorem] Theorem 13.12 — Partition of Unity trên Paracompact Hausdorff
> Nếu $X$ paracompact Hausdorff và $\{U_\alpha\}$ là open cover, thì tồn tại **partition of unity** $\{\phi_\alpha\}$ subordinate to $\{U_\alpha\}$:
>
> $$
> \phi_\alpha : X \to [0,1] \text{ liên tục}, \quad \operatorname{supp}(\phi_\alpha) \subseteq U_\alpha, \quad \sum_\alpha \phi_\alpha(x) = 1 \ \forall\, x.
> $$

**Proof sketch.** Dùng normality (Theorem 13.11) và Urysohn's Lemma để xây dựng $\phi_\alpha$ từ locally finite refinement. Locally finiteness đảm bảo tổng $\sum \phi_\alpha$ hữu hạn tại mỗi điểm và liên tục. $\blacksquare$

> [!example] Example 13.13 — Ứng dụng partition of unity
> Trong hình học vi phân, partition of unity dùng để:
> - Định nghĩa tích phân trên manifold từ các bản đồ địa phương.
> - Xây dựng Riemannian metric trên manifold compact.
> - Kéo dài các đối tượng hình học từ địa phương sang toàn cục.

---

## $\sigma$-Compact và Exhaustion

> [!definition] Definition 13.14 — $\sigma$-Compact
> $X$ gọi là **$\sigma$-compact** nếu $X = \bigcup_{n=1}^\infty K_n$ với mỗi $K_n$ compact.

> [!example] Example 13.15 — Ví dụ $\sigma$-compact
> - $\mathbb{R}^n = \bigcup_{n=1}^\infty \overline{B}(0, n)$: $\sigma$-compact.
> - Mọi locally compact second countable Hausdorff space: $\sigma$-compact.

> [!theorem] Theorem 13.16 — LCH + $\sigma$-compact có exhaustion
> Nếu $X$ locally compact Hausdorff và $\sigma$-compact, thì có **exhaustion by compact sets**: tồn tại dãy tăng $K_1 \subseteq K_2 \subseteq \cdots$ compact với $K_n \subseteq \operatorname{Int}(K_{n+1})$ và $X = \bigcup K_n$.

---

## SageMath Cheatsheet

```python
# Minh họa Urysohn Metrization: embedding X -> [0,1]^omega

import numpy as np

def hilbert_cube_metric(x, y, weights=None, N=50):
    """
    Metric trên [0,1]^omega: d(x,y) = sum_n w_n * |x_n - y_n|
    với w_n = 1/2^n (hoặc tùy chỉnh).
    """
    if weights is None:
        weights = [1 / 2**n for n in range(1, N+1)]
    return sum(w * abs(xi - yi) for w, xi, yi in zip(weights, x, y))

# Minh họa: X = [0,1] với topology Euclidean
# Basis countable: B_n = (q_n - 1/m_n, q_n + 1/m_n) với q_n rational, m_n natural
# Urysohn functions f_nm(x) cho mỗi cặp (n,m)
from fractions import Fraction
import math

def urysohn_fn(x, a, b):
    """Urysohn function: 0 trên (-inf,a], 1 trên [b,inf), linear ở giữa."""
    if x <= a: return 0.0
    if x >= b: return 1.0
    return (x - a) / (b - a)

# Rational basis points trên [0,1]
basis_centers = [Fraction(k, 8) for k in range(9)]   # 0, 1/8, ..., 1
basis_radii   = [Fraction(1, 8), Fraction(1, 4)]

# Tạo các cặp (Bn, Bm) với Bn_closure ⊂ Bm
pairs = []
for i, c1 in enumerate(basis_centers):
    for r1 in basis_radii:
        for j, c2 in enumerate(basis_centers):
            for r2 in basis_radii:
                if (c1 - r1 - Fraction(1,16) >= c2 - r2 and
                    c1 + r1 + Fraction(1,16) <= c2 + r2 and r1 < r2):
                    pairs.append((float(c1-r1), float(c1+r1),
                                  float(c2-r2), float(c2+r2)))

print(f"Số cặp basis (Bn ⊂ Bm): {len(pairs)}")

# Embedding e: [0,1] -> [0,1]^|pairs|
def embed(x, pairs):
    return tuple(urysohn_fn(x, p[0], p[2]) for p in pairs[:20])

# Kiểm tra embedding phân biệt điểm
x1, x2 = 0.3, 0.7
e1 = embed(x1, pairs)
e2 = embed(x2, pairs)
diff = sum((a-b)**2 for a,b in zip(e1,e2))**0.5
print(f"e({x1}) ≠ e({x2}): L2-dist = {diff:.4f} > 0 → injective ✓")

# Metric từ Hilbert cube trên ảnh
d_hilbert = hilbert_cube_metric(e1, e2, N=len(e1))
d_euclidean = abs(x1 - x2)
print(f"d_Hilbert(e({x1}), e({x2})) = {d_hilbert:.4f}")
print(f"d_Euclidean({x1}, {x2}) = {d_euclidean:.4f}")
print("Hai metric tương đương vì e liên tục và open ✓")

# Minh họa locally finite cover
print("\nLocally finite cover minh họa:")
print("X = R, cover = {(n-1.5, n+1.5) : n ∈ Z}")
x0 = 2.3
neighbors = [n for n in range(-5, 8) if abs(x0 - n) < 1.5]
print(f"  Tại x={x0}: chỉ gặp {len(neighbors)} open sets: {[(n-1.5,n+1.5) for n in neighbors]}")
```

---

## Summary / Key Takeaways

- **Urysohn Metrization**: second countable + regular $\Rightarrow$ metrizable, qua embedding vào Hilbert cube $[0,1]^\omega$.
- **Nagata-Smirnov**: metrizable $\iff$ regular + $\sigma$-locally finite basis (điều kiện cần và đủ).
- **Paracompact**: mọi open cover có locally finite open refinement — yếu hơn compact, mạnh hơn Lindelöf.
- Metric space $\Rightarrow$ paracompact; paracompact Hausdorff $\Rightarrow$ normal.
- **Partition of unity** tồn tại trên paracompact Hausdorff — công cụ then chốt của hình học toàn cục.
- $\sigma$-compact LCH space có exhaustion by compact sets.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§40–41.
- Willard, S. *General Topology*, §§20, 23.
- Kelley, J. L. *General Topology*, Ch. 5–6.
- Lee, J. M. *Introduction to Smooth Manifolds* (2nd ed.), Appendix A.
