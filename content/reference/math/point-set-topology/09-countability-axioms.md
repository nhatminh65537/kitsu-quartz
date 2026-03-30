---
title: "09. Countability Axioms"
tags: [math, point-set-topology, lesson-09]
aliases: [Countability Axioms]
created: 2026-03-30
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[03-closure-interior-limit-points|03. Closure, Interior, and Limit Points]], [[05-metric-spaces|05. Metric Spaces]]
> **Objectives**:
> - Hiểu first và second countability, nhận biết chúng trong các không gian quen thuộc
> - Nắm separability (tập trù mật đếm được) và quan hệ với second countability
> - Hiểu Lindelöf property và vị trí của nó trong bức tranh tổng quát
> - Biết khi nào các tính chất countability cho phép dùng dãy thay thế nets/filters

---

## Motivation / Intuition

Trong Giải tích trên $\mathbb{R}$, ta làm việc rất nhiều với dãy số: hội tụ, Cauchy, dense sets. Ví dụ, $\mathbb{Q}$ trù mật trong $\mathbb{R}$ — và đây là lý do mọi số thực có thể xấp xỉ bằng số hữu tỉ. Nhưng trong không gian topo tổng quát, dãy số **không đủ** để mô tả đầy đủ cấu trúc (như ta thấy ở Bài 03 và 05).

Câu hỏi: khi nào không gian topo "đủ nhỏ" để dãy số vẫn hoạt động tốt? Câu trả lời nằm ở các **countability axioms** — điều kiện đặt giới hạn về "kích thước" của topology theo nghĩa đếm được (countable). Ba điều kiện chính: **first countable** (basis đếm được tại mỗi điểm), **second countable** (basis đếm được toàn cục), và **separable** (có tập con đếm được trù mật).

---

## First Countability

### Định nghĩa

> [!definition] Definition 9.1 — First Countable (Đếm được bậc một)
> Không gian topo $X$ gọi là **first countable** (hay thỏa **First Axiom of Countability**) nếu với mọi $x \in X$, tồn tại một **countable neighborhood basis** tại $x$: một họ đếm được $\{U_n\}_{n \in \mathbb{N}}$ các open neighborhoods của $x$ sao cho với mọi open set $V \ni x$, tồn tại $n$ với $U_n \subseteq V$.

> [!note] Remark 9.2 — Neighborhood basis
> Không nhất thiết phải lấy $\{U_n\}$ là lồng nhau, nhưng ta luôn có thể thay bằng họ lồng nhau $\{V_n\}$ với $V_n = U_1 \cap \cdots \cap U_n$ — vẫn đếm được và vẫn là basis tại $x$.

> [!example] Example 9.3 — Mọi metric space là first countable
> Trong metric space $(X,d)$, họ $\{B(x, \frac{1}{n}) : n \in \mathbb{N}^+\}$ là countable neighborhood basis tại $x$ (Theorem 5.17). Do đó mọi metric space — đặc biệt $\mathbb{R}^n$, $C([0,1])$ với sup metric — đều first countable.

> [!example] Example 9.4 — Discrete và trivial topology đều first countable
> Trong discrete topology: $\{\{x\}\}$ là neighborhood basis tại $x$ (chỉ một phần tử). Trong trivial topology: $\{X\}$ là neighborhood basis tại mọi điểm.

> [!warning] Counterexample 9.5 — Không gian không first countable
> Xét $\mathbb{R}$ với **cocountable topology**: $U$ mở $\iff$ $\mathbb{R} \setminus U$ đếm được (hoặc $U = \emptyset$). Tại mỗi điểm $x$, không có countable neighborhood basis: nếu $\{U_n\}$ là họ đếm được các open neighborhoods của $x$, thì $\bigcap_n U_n$ vẫn là neighborhood của $x$ (vì bù của nó $= \bigcup_n (\mathbb{R} \setminus U_n)$ là hợp đếm được các tập đếm được, đếm được), nhưng tập $\mathbb{R} \setminus \{y\}$ (với $y \neq x$) là open set không chứa $U_n$ nào cho một mình $\{U_n\}$ cụ thể.

### First countable và dãy số

> [!theorem] Theorem 9.6 — First Countable: dãy đặc trưng closure
> Trong không gian first countable $X$: $x \in \overline{A}$ khi và chỉ khi tồn tại dãy $(a_n)$ trong $A$ sao cho $a_n \to x$.

**Proof.** ($\Leftarrow$) Luôn đúng trong mọi không gian topo (nếu $a_n \to x$ và $a_n \in A$, thì mọi neighborhood của $x$ gặp $A$, nên $x \in \overline{A}$).

($\Rightarrow$) Giả sử $x \in \overline{A}$ và $\{U_n\}_{n \geq 1}$ là countable neighborhood basis lồng nhau tại $x$ (với $U_{n+1} \subseteq U_n$). Vì $x \in \overline{A}$, mỗi $U_n$ gặp $A$; chọn $a_n \in U_n \cap A$. Với mọi open $V \ni x$, có $U_N \subseteq V$, nên $a_n \in V$ với mọi $n \geq N$. Vậy $a_n \to x$. $\blacksquare$

> [!corollary] Corollary 9.7 — First Countable: liên tục và dãy
> Trong không gian first countable: $f : X \to Y$ liên tục tại $x$ khi và chỉ khi với mọi dãy $x_n \to x$ trong $X$, ta có $f(x_n) \to f(x)$ trong $Y$.

---

## Second Countability

### Định nghĩa

> [!definition] Definition 9.8 — Second Countable (Đếm được bậc hai)
> $X$ gọi là **second countable** (hay thỏa **Second Axiom of Countability**) nếu topology của $X$ có một **countable basis**: tồn tại họ đếm được $\mathcal{B} = \{B_n\}_{n \in \mathbb{N}}$ của open sets sao cho mọi open set là hợp của một họ con của $\mathcal{B}$.

> [!theorem] Theorem 9.9 — Second countable $\Rightarrow$ First countable
> Mọi không gian second countable đều first countable.

**Proof.** Cho $\mathcal{B} = \{B_n\}$ là countable basis toàn cục. Tại mỗi $x$, họ $\{B_n : x \in B_n\}$ là countable neighborhood basis tại $x$. $\blacksquare$

> [!example] Example 9.10 — $\mathbb{R}^n$ là second countable
> Họ $\{B(q, r) : q \in \mathbb{Q}^n,\, r \in \mathbb{Q}^+\}$ là countable basis cho topology Euclidean trên $\mathbb{R}^n$: mỗi open ball $B(x, \varepsilon)$ chứa một $B(q, r)$ với $q \in \mathbb{Q}^n$ gần $x$ và $r \in \mathbb{Q}$ nhỏ.

> [!example] Example 9.11 — Discrete topology trên $\mathbb{R}$ không second countable
> Basis nhỏ nhất là $\{\{x\} : x \in \mathbb{R}\}$ — không đếm được. Thực ra bất kỳ basis nào của discrete topology trên $\mathbb{R}$ cũng không đếm được.

---

## Separability

### Định nghĩa

> [!definition] Definition 9.12 — Separable (Khả li)
> $X$ gọi là **separable** nếu có tập con **đếm được trù mật (countable dense subset)**: tồn tại $D \subseteq X$ đếm được sao cho $\overline{D} = X$.

> [!example] Example 9.13 — $\mathbb{R}^n$ separable
> $\mathbb{Q}^n$ là tập đếm được trù mật trong $\mathbb{R}^n$: mọi điểm trong $\mathbb{R}^n$ là giới hạn của dãy trong $\mathbb{Q}^n$.

> [!example] Example 9.14 — $C([0,1])$ separable
> Theo định lý Stone-Weierstrass (Bài 14), các đa thức với hệ số hữu tỉ trù mật trong $C([0,1])$ với sup metric. Đây là tập đếm được (đa thức hệ số hữu tỉ $\iff$ tổ hợp hữu hạn của $\mathbb{Q}[x]$). Vậy $C([0,1])$ separable mặc dù vô hạn chiều.

> [!warning] Counterexample 9.15 — $\ell^\infty$ không separable
> Không gian $\ell^\infty$ gồm các dãy số thực bị chặn với sup metric **không separable**: tập $\{0,1\}^{\mathbb{N}}$ (dãy nhị phân) là không đếm được, và các phần tử phân biệt cách nhau $\geq 1$ trong $\ell^\infty$-metric — nên mọi tập trù mật phải không đếm được.

### Quan hệ giữa các countability axioms

> [!theorem] Theorem 9.16 — Second countable $\Rightarrow$ Separable
> Mọi không gian second countable đều separable.

**Proof.** Cho $\mathcal{B} = \{B_n\}$ là countable basis. Với mỗi $B_n \neq \emptyset$, chọn $d_n \in B_n$. Tập $D = \{d_n\}$ đếm được. Với mọi open $U \neq \emptyset$, có $B_n \subseteq U$, nên $d_n \in U \cap D$. Vậy $D$ trù mật. $\blacksquare$

> [!theorem] Theorem 9.17 — Trong metric space: Second countable $\iff$ Separable
> Một metric space là second countable khi và chỉ khi nó separable.

**Proof.** ($\Rightarrow$) Theorem 9.16. ($\Leftarrow$) Cho $D = \{d_n\}$ là countable dense subset. Tập $\mathcal{B} = \{B(d_n, \frac{1}{m}) : n, m \in \mathbb{N}^+\}$ đếm được. Với mọi $x$ và $\varepsilon > 0$: chọn $d_n \in B(x, \frac{\varepsilon}{2})$ (được vì $D$ trù mật), rồi $m > \frac{2}{\varepsilon}$; thì $x \in B(d_n, \frac{1}{m}) \subseteq B(x, \varepsilon)$. Vậy $\mathcal{B}$ là basis. $\blacksquare$

> [!warning] Counterexample 9.18 — Separable không kéo theo second countable (ngoài metric)
> Trong không gian topo tổng quát, separable không kéo theo second countable. Ví dụ: **lower limit topology** (Sorgenfrey line) $\mathbb{R}_\ell$ — basis gồm các $[a,b)$ — separable (vì $\mathbb{Q}$ trù mật) nhưng không second countable.

---

## Lindelöf Spaces

### Định nghĩa

> [!definition] Definition 9.19 — Lindelöf Space
> $X$ gọi là **Lindelöf** nếu mọi open cover của $X$ đều có **countable subcover**.

> [!note] Remark 9.20
> So sánh với compact: compact yêu cầu finite subcover; Lindelöf chỉ yêu cầu countable subcover. Compact $\Rightarrow$ Lindelöf, nhưng không đảo.

> [!theorem] Theorem 9.21 — Second countable $\Rightarrow$ Lindelöf
> Mọi không gian second countable đều Lindelöf.

**Proof.** Cho $\mathcal{U}$ là open cover và $\mathcal{B} = \{B_n\}$ là countable basis. Với mỗi $B_n \subseteq U$ cho một $U \in \mathcal{U}$, chọn $U_n$ chứa $B_n$. Họ $\{U_n\}$ đếm được và phủ $X$ (mọi $x$ thuộc một $B_n \subseteq U_n$). $\blacksquare$

> [!theorem] Theorem 9.22 — Lindelöf + Regular $\Rightarrow$ Normal
> Nếu $X$ Lindelöf và regular (T3 — xem Bài 10), thì $X$ normal (T4). Đây là bước trung gian quan trọng trong chứng minh Urysohn Metrization Theorem (Bài 13).

### Tóm tắt quan hệ

$$
\text{Second countable} \implies \begin{cases} \text{First countable} \\ \text{Separable} \\ \text{Lindelöf} \end{cases}
$$

Trong **metric spaces**, cả bốn tương đương nhau:

$$
\text{Second countable} \iff \text{Separable} \iff \text{Lindelöf} \quad (\text{trong metric space})
$$

Trong không gian topo tổng quát, các mũi tên trên không đảo được.

---

## Ứng dụng: Tại sao countability quan trọng?

> [!theorem] Theorem 9.23 — Second countable + Hausdorff $\Rightarrow$ Metrizable (điều kiện đủ)
> Đây là nội dung của **Urysohn Metrization Theorem** (Bài 13): nếu $X$ second countable và regular (T3), thì $X$ metrizable. Second countability là điều kiện cần thiết trong nhiều định lý metrization.

> [!theorem] Theorem 9.24 — Subspace của second countable là second countable
> Nếu $X$ second countable và $Y \subseteq X$, thì $Y$ second countable với subspace topology.

**Proof.** Nếu $\mathcal{B}$ là countable basis cho $X$, thì $\{B \cap Y : B \in \mathcal{B}\}$ là countable basis cho $Y$ (Theorem 2.5 — Bài 02). $\blacksquare$

> [!theorem] Theorem 9.25 — Product đếm được của second countable là second countable
> Nếu $\{X_n\}_{n \in \mathbb{N}}$ là họ đếm được không gian second countable, thì $\prod_n X_n$ (product topology) second countable.

**Proof.** Mỗi $X_n$ có countable basis $\mathcal{B}_n$. Basis của product topology là tập hữu hạn của $\bigcup_n \mathcal{B}_n$ — giao hữu hạn của các subbasis elements — đếm được (hợp đếm được của đếm được). $\blacksquare$

---

## SageMath Cheatsheet

```python
# Minh họa separability: Q^n trù mật trong R^n

import numpy as np
from fractions import Fraction

def rational_approximation(x, max_denom=100):
    """Xấp xỉ x bằng số hữu tỉ p/q với q <= max_denom."""
    return Fraction(x).limit_denominator(max_denom)

# Xấp xỉ pi, sqrt(2), e bằng số hữu tỉ
import math
for val, name in [(math.pi, 'π'), (math.sqrt(2), '√2'), (math.e, 'e')]:
    approx = rational_approximation(val)
    print(f"{name} ≈ {approx} = {float(approx):.8f}, sai số = {abs(val - float(approx)):.2e}")

# Output:
# π ≈ 311/99 = 3.14141414, sai số = 1.81e-04
# √2 ≈ 99/70 = 1.41428571, sai số = 4.28e-06
# e ≈ 87/32 = 2.71875000, sai số = 3.17e-04

# Minh họa countable basis của R^n qua rational balls
def rational_basis_element(center_rational, radius_rational):
    """Một basis element B(q, r) với q trong Q^n, r trong Q+."""
    return {"center": center_rational, "radius": radius_rational}

# Basis elements chứa điểm x = sqrt(2) trong R
x = math.sqrt(2)
epsilon = 0.1
# Tìm q trong Q gần x nhất
q = float(rational_approximation(x, max_denom=50))
r = float(rational_approximation(epsilon / 2, max_denom=10))
print(f"\nBasis element B({q:.4f}, {r:.4f}) chứa √2:")
print(f"  √2 ∈ B(q,r)? {abs(x - q) < r}")
print(f"  B(q,r) ⊂ B(√2, ε={epsilon})? {q - r > x - epsilon and q + r < x + epsilon}")

# So sánh các không gian countability
spaces = {
    "R^n (Euclidean)":        {"first": True,  "second": True,  "separable": True,  "lindelof": True},
    "Discrete trên R":        {"first": True,  "second": False, "separable": False, "lindelof": False},
    "Sorgenfrey line R_l":    {"first": True,  "second": False, "separable": True,  "lindelof": True},
    "l^∞":                    {"first": True,  "second": False, "separable": False, "lindelof": False},
    "C([0,1]) với sup metric":{"first": True,  "second": False, "separable": True,  "lindelof": True},
}

print(f"\n{'Không gian':<30} {'1st':>5} {'2nd':>5} {'Sep':>5} {'Lind':>5}")
print("-" * 52)
for name, props in spaces.items():
    row = [("✓" if v else "✗") for v in props.values()]
    print(f"{name:<30} {row[0]:>5} {row[1]:>5} {row[2]:>5} {row[3]:>5}")
```

---

## Summary / Key Takeaways

- $X$ **first countable**: mọi điểm có countable neighborhood basis — dãy đặc trưng closure và liên tục. Mọi metric space first countable.
- $X$ **second countable**: có countable basis toàn cục — mạnh hơn first countable.
- $X$ **separable**: có tập đếm được trù mật — $\mathbb{R}^n$ separable vì $\mathbb{Q}^n$ trù mật.
- $X$ **Lindelöf**: mọi open cover có countable subcover — suy ra từ second countable.
- **Trong metric spaces**: second countable $\iff$ separable $\iff$ Lindelöf.
- **Ngoài metric**: các mũi tên này không đảo — Sorgenfrey line separable + Lindelöf nhưng không second countable.
- Second countability bảo toàn qua subspace và product đếm được.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§30–32.
- Willard, S. *General Topology*, §§15–16.
- Kelley, J. L. *General Topology*, Ch. 1.
- Folland, G. B. *Real Analysis* (2nd ed.), §4.2.
