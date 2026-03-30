---
title: "09. Measure Theory Foundations"
tags: [math, real-analysis, lesson-09]
aliases: [Measure Theory Foundations]
created: 2026-03-28
---

> **Prerequisites**: [[03-metric-spaces|03. Metric Spaces]] — Open/closed sets, topology của $\mathbb{R}$; [[02-cardinality-and-countability|02. Cardinality & Countability]] — Tập đếm được
> **Objectives**:
> - Hiểu tại sao cần $\sigma$-algebra và tại sao không thể đo mọi tập con của $\mathbb{R}$
> - Định nghĩa và xây dựng $\sigma$-algebra, Borel $\sigma$-algebra
> - Định nghĩa measure (độ đo) trừu tượng và các tính chất cơ bản
> - Hiểu outer measure và tiêu chuẩn Carathéodory measurability
> - Phát biểu Carathéodory Extension Theorem — nền tảng xây dựng Lebesgue measure

---

## Motivation / Intuition

Ta muốn gán "độ dài" hay "diện tích" cho các tập con của $\mathbb{R}$ một cách nhất quán. Với khoảng $[a,b]$: độ dài $= b - a$. Nhưng với tập phức tạp hơn thì sao?

**Vấn đề 1 — Không thể đo tất cả**: Vitali (1905) xây dựng tập con của $[0,1]$ không thể gán độ dài nhất quán nếu ta giữ: (i) bất biến qua tịnh tiến, (ii) $\sigma$-additivity. Vì vậy phải **chọn** tập nào được phép đo.

**Vấn đề 2 — Cần cấu trúc đại số**: Khi tính $\mu(A \cup B)$ hay $\mu(A \setminus B)$, ta cần $A \cup B$ và $A \setminus B$ cũng "đo được". Điều này đòi hỏi lớp tập đo được đóng dưới các phép bù và hợp đếm được.

**$\sigma$-algebra** là đáp án cho cả hai vấn đề. Và **Carathéodory Extension Theorem** là chiếc cầu từ "pre-measure đơn giản" (độ dài khoảng) đến "measure trên $\sigma$-algebra lớn" (Lebesgue measure).

---

## $\sigma$-Algebra

### Definition

> [!definition] Definition 9.1 — $\sigma$-Algebra
> Cho $X$ là tập hợp. Một **$\sigma$-algebra** trên $X$ là họ tập $\mathcal{M} \subseteq \mathcal{P}(X)$ thỏa:
>
> 1. $X \in \mathcal{M}$
> 2. **Đóng với phần bù**: $A \in \mathcal{M} \Rightarrow A^c \in \mathcal{M}$
> 3. **Đóng với hợp đếm được**: $A_1, A_2, \ldots \in \mathcal{M} \Rightarrow \bigcup_{n=1}^\infty A_n \in \mathcal{M}$
>
> Bộ $(X, \mathcal{M})$ gọi là **measurable space** (không gian đo được). Phần tử của $\mathcal{M}$ gọi là **measurable sets**.

> [!corollary] Corollary 9.2 — Hệ quả
> Từ ba tiên đề suy ra: $\emptyset \in \mathcal{M}$; $\mathcal{M}$ đóng với giao đếm được; $\mathcal{M}$ đóng với hiệu tập hợp $A \setminus B$.

### Worked Example

> [!example] Example 9.3 — Các $\sigma$-algebra chuẩn
>
> **(a) Tầm thường**: $\mathcal{M} = \{\emptyset, X\}$ (nhỏ nhất) và $\mathcal{M} = \mathcal{P}(X)$ (lớn nhất).
>
> **(b) Sinh bởi phân hoạch**: $X = \{1,2,3,4,5\}$, phân hoạch $\{\{1,2\}, \{3,4\}, \{5\}\}$ sinh ra $\sigma$-algebra gồm $2^3 = 8$ tập (mọi hợp của các tế bào phân hoạch và bù của chúng).
>
> **(c) Borel $\sigma$-algebra** trên $\mathbb{R}$: $\mathcal{B}(\mathbb{R}) = \sigma(\text{tập mở})$.

> [!theorem] Theorem 9.4 — $\sigma$-algebra sinh bởi họ tập
> Với mọi $\mathcal{F} \subseteq \mathcal{P}(X)$, tồn tại $\sigma$-algebra **nhỏ nhất** chứa $\mathcal{F}$, ký hiệu $\sigma(\mathcal{F})$, bằng giao của tất cả các $\sigma$-algebra chứa $\mathcal{F}$.

**Proof.** Giao tùy ý của $\sigma$-algebra vẫn là $\sigma$-algebra (kiểm tra ba tiên đề). $\mathcal{P}(X)$ là $\sigma$-algebra chứa $\mathcal{F}$, nên giao này khác rỗng. $\blacksquare$

> [!definition] Definition 9.5 — Borel $\sigma$-Algebra
> Trên không gian metric $(X, d)$, **Borel $\sigma$-algebra** là:
>
> $$
> \mathcal{B}(X) = \sigma(\{\text{tập mở trong } X\})
> $$
>
> Phần tử của $\mathcal{B}(X)$ gọi là **tập Borel**. Trên $\mathbb{R}$:
>
> $$
> \mathcal{B}(\mathbb{R}) = \sigma(\{(a,b) \mid a < b\}) = \sigma(\{(-\infty, a] \mid a \in \mathbb{R}\})
> $$

> [!note] Remark 9.6 — Phân cấp Borel
> Tập Borel được phân loại theo độ phức tạp:
>
> | Ký hiệu | Định nghĩa | Ví dụ |
> |---------|-----------|-------|
> | $F_\sigma$ | Hợp đếm được của tập đóng | $\mathbb{Q} = \bigcup_{q \in \mathbb{Q}}\{q\}$ |
> | $G_\delta$ | Giao đếm được của tập mở | $\mathbb{R} \setminus \mathbb{Q} = \bigcap_{q \in \mathbb{Q}} (\mathbb{R} \setminus \{q\})$ |
> | $F_{\sigma\delta}$, $G_{\delta\sigma}$ | Tiếp tục ... | ... |
>
> Mọi tập mở và đóng đều là Borel. Cantor set (Bài 10) là tập Borel (đóng, do đó $F_\sigma$) nhưng phức tạp hơn.

---

## Measure (Độ đo)

### Definition

> [!definition] Definition 9.7 — Measure
> Cho $(X, \mathcal{M})$ là measurable space. Một **measure** là hàm $\mu: \mathcal{M} \to [0, +\infty]$ thỏa:
>
> 1. $\mu(\emptyset) = 0$
> 2. **$\sigma$-additivity**: Với dãy **rời nhau** $\{A_n\} \subseteq \mathcal{M}$:
>
> $$
> \mu\!\left(\bigsqcup_{n=1}^\infty A_n\right) = \sum_{n=1}^\infty \mu(A_n)
> $$
>
> Bộ $(X, \mathcal{M}, \mu)$ gọi là **measure space** (không gian đo). Measure $\mu$ là **complete** nếu: $\mu(N) = 0$ và $F \subseteq N$ thì $F \in \mathcal{M}$.

### Worked Example

> [!example] Example 9.8 — Các measure chuẩn
>
> | Measure | Không gian | Định nghĩa | Ghi chú |
> |---------|-----------|-----------|---------|
> | Counting measure $\#$ | $(X, \mathcal{P}(X))$ | $\#(A) = \lvert A\rvert$ | $\sigma$-finite $\Leftrightarrow$ $X$ đếm được |
> | Dirac measure $\delta_p$ | $(X, \mathcal{P}(X))$ | $\delta_p(A) = \mathbf{1}_A(p)$ | Probability measure |
> | Lebesgue measure $\lambda$ | $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$ | $\lambda((a,b)) = b-a$ | $\sigma$-finite, complete (sau hoàn chỉnh hóa) |
> | Xác suất $\mathbb{P}$ | $(\Omega, \mathcal{F})$ | $\mathbb{P}(\Omega) = 1$ | Measure với tổng $1$ |

### Theorem

> [!theorem] Theorem 9.9 — Các tính chất cơ bản của measure
> Cho $(X, \mathcal{M}, \mu)$:
>
> 1. **Đơn điệu**: $A \subseteq B \Rightarrow \mu(A) \leq \mu(B)$
> 2. **Bán-cộng tính**: $\mu\!\left(\bigcup A_n\right) \leq \sum \mu(A_n)$
> 3. **Liên tục từ dưới**: $A_1 \subseteq A_2 \subseteq \cdots \Rightarrow \mu\!\left(\bigcup A_n\right) = \lim_n \mu(A_n)$
> 4. **Liên tục từ trên**: $A_1 \supseteq A_2 \supseteq \cdots$, $\mu(A_1) < \infty$ $\Rightarrow$ $\mu\!\left(\bigcap A_n\right) = \lim_n \mu(A_n)$

**Proof của (3).** Đặt $B_n = A_n \setminus A_{n-1}$ (rời nhau, $B_1 = A_1$). Thì $\bigcup A_n = \bigsqcup B_n$ và:

$$
\mu\!\left(\bigcup A_n\right) = \sum_{n=1}^\infty \mu(B_n) = \lim_{N\to\infty} \sum_{n=1}^N \mu(B_n) = \lim_{N\to\infty} \mu(A_N) \qquad \blacksquare
$$

> [!warning] Counterexample 9.10 — Điều kiện $\mu(A_1) < \infty$ trong tính liên tục từ trên là cần thiết
> Xét counting measure $\#$ trên $\mathbb{N}$ và $A_n = \{n, n+1, n+2, \ldots\}$. Ta có $\bigcap A_n = \emptyset$ (measure $0$) nhưng $\#(A_n) = +\infty$ với mọi $n$.

---

## Outer Measure và Tiêu chuẩn Carathéodory

### Definition

> [!definition] Definition 9.11 — Outer Measure
> Hàm $\mu^*: \mathcal{P}(X) \to [0,+\infty]$ là **outer measure** (độ đo ngoài) nếu:
>
> 1. $\mu^*(\emptyset) = 0$
> 2. **Đơn điệu**: $A \subseteq B \Rightarrow \mu^*(A) \leq \mu^*(B)$
> 3. **Bán-cộng tính đếm được**: $\mu^*\!\left(\bigcup A_n\right) \leq \sum \mu^*(A_n)$
>
> Outer measure xác định trên **mọi** tập con $\mathcal{P}(X)$, không chỉ $\sigma$-algebra.

> [!definition] Definition 9.12 — Tập $\mu^*$-đo được (Carathéodory)
> $E \subseteq X$ là **$\mu^*$-measurable** nếu với mọi $A \subseteq X$:
>
> $$
> \mu^*(A) = \mu^*(A \cap E) + \mu^*(A \cap E^c)
> $$
>
> Trực giác: $E$ "chia sắc nét" bất kỳ tập $A$ nào thành hai phần cộng lại đúng bằng $\mu^*(A)$.

> [!note] Remark 9.13
> Bất đẳng thức $\mu^*(A) \leq \mu^*(A \cap E) + \mu^*(A \cap E^c)$ luôn đúng (bán-cộng tính). Nên điều kiện Carathéodory chỉ cần kiểm tra chiều ngược: $\mu^*(A) \geq \mu^*(A \cap E) + \mu^*(A \cap E^c)$.

> [!theorem] Theorem 9.14 — Định lý Carathéodory
> Nếu $\mu^*$ là outer measure trên $X$ thì:
>
> 1. Họ $\mathcal{M}^* = \{E \subseteq X \mid E \text{ là } \mu^*\text{-measurable}\}$ là một $\sigma$-algebra
> 2. $\mu = \mu^*|_{\mathcal{M}^*}$ là measure **hoàn chỉnh** trên $(X, \mathcal{M}^*)$

**Proof sketch.**
*Đóng với bù*: Định nghĩa đối xứng giữa $E$ và $E^c$.

*Đóng với hợp hữu hạn*: Nếu $E, F \in \mathcal{M}^*$, với $A \tùy ý$:

$$
\mu^*(A) = \mu^*(A \cap E) + \mu^*(A \cap E^c) = \mu^*(A \cap E \cap F) + \mu^*(A \cap E \cap F^c) + \mu^*(A \cap E^c \cap F) + \mu^*(A \cap E^c \cap F^c)
$$

Gom ba số hạng đầu $\geq \mu^*(A \cap (E \cup F))$ (bán-cộng tính) và số hạng cuối $= \mu^*(A \cap (E \cup F)^c)$.

*$\sigma$-additivity*: Quy nạp + giới hạn + đơn điệu. $\blacksquare$

---

## Carathéodory Extension Theorem

### Theorem

> [!theorem] Theorem 9.15 — Carathéodory Extension Theorem
> Cho $\mathcal{A} \subseteq \mathcal{P}(X)$ là một **algebra** (đóng hữu hạn) và $\mu_0: \mathcal{A} \to [0,+\infty]$ là một **pre-measure** ($\mu_0(\emptyset) = 0$, $\sigma$-additive trên $\mathcal{A}$). Định nghĩa:
>
> $$
> \mu^*(E) = \inf\left\{\sum_{n=1}^\infty \mu_0(A_n) \;\middle|\; E \subseteq \bigcup_{n=1}^\infty A_n,\; A_n \in \mathcal{A}\right\}
> $$
>
> Khi đó:
>
> 1. $\mu^*$ là outer measure thỏa $\mu^*|_{\mathcal{A}} = \mu_0$
> 2. Mọi $A \in \mathcal{A}$ đều là $\mu^*$-measurable
> 3. $\mu^*|_{\sigma(\mathcal{A})}$ là measure mở rộng $\mu_0$ lên $\sigma(\mathcal{A})$
> 4. Nếu $\mu_0$ là **$\sigma$-finite** thì sự mở rộng là **duy nhất**

Xem chứng minh đầy đủ tại [[a2-caratheodory-extension|A2. Carathéodory Extension Theorem]].

> [!note] Remark 9.16 — Áp dụng để xây dựng Lebesgue measure
> Trên $\mathbb{R}$: lấy $\mathcal{A}$ = algebra của hợp hữu hạn các khoảng nửa mở $(a,b]$, và $\mu_0\!\left(\bigsqcup_i (a_i, b_i]\right) = \sum_i (b_i - a_i)$. Đây là pre-measure $\sigma$-finite. Carathéodory Extension cho Lebesgue measure $\lambda$ trên $\sigma(\mathcal{A}) \supseteq \mathcal{B}(\mathbb{R})$.

---

## Measure Zero và Almost Everywhere

### Definition

> [!definition] Definition 9.17 — Null set và Almost everywhere
> Trong $(X, \mathcal{M}, \mu)$:
>
> - $N \in \mathcal{M}$ là **null set** nếu $\mu(N) = 0$
> - Tính chất $P(x)$ đúng **$\mu$-almost everywhere** ($\mu$-a.e.), ký hiệu $P(x)$ a.e., nếu $\{x : P(x) \text{ sai}\}$ là subset của null set

> [!example] Example 9.18 — Null sets trong $(\mathbb{R}, \lambda)$
>
> - Mọi tập đếm được (hữu hạn hoặc đếm được vô hạn) có Lebesgue measure $0$: vì $\lambda(\{p\}) = 0$ và $\sigma$-additivity.
> - $\mathbb{Q}$ có $\lambda$-measure $0$: $\lambda(\mathbb{Q}) = \sum_{q \in \mathbb{Q}} \lambda(\{q\}) = 0$.
> - Cantor set (xem Bài 10) là tập **không đếm được** với $\lambda$-measure $0$.

---

## SageMath Cheatsheet

```python
# Minh họa sigma-algebra và measure
import numpy as np

# Sigma-algebra sinh bởi phân hoạch
from itertools import combinations

def sigma_alg_from_partition(cells):
    """cells: list of frozensets tạo thành phân hoạch của X"""
    result = [frozenset()]  # empty set
    for r in range(1, len(cells) + 1):
        for combo in combinations(range(len(cells)), r):
            union = frozenset().union(*[cells[i] for i in combo])
            result.append(union)
    return result

cells = [frozenset([1,2]), frozenset([3,4]), frozenset([5])]
M = sigma_alg_from_partition(cells)
print(f"|sigma-algebra| = {len(M)}")  # 8 = 2^3

# Tính chất liên tục từ dưới: mu([0, 1-1/n]) -> mu([0,1))
for n in [5, 10, 100, 1000]:
    mu_An = 1 - 1/n       # lambda([0, 1-1/n]) = 1 - 1/n
    print(f"n={n:5d}: lambda(A_n) = {mu_An:.6f}")  # -> 1

# Outer measure: xấp xỉ Lebesgue bằng sum độ dài intervals
def lebesgue_outer(intervals, target):
    """
    Tính lower bound Lebesgue outer measure của target
    bằng cách tìm covering interval.
    intervals: list of (a,b)
    target: (a,b)
    """
    a, b = target
    total_covered = 0
    # Đây chỉ là ví dụ đơn giản
    for (ia, ib) in intervals:
        overlap = max(0, min(ib, b) - max(ia, a))
        total_covered += overlap
    return total_covered

# Covering [0.1, 0.9] bằng intervals
covering = [(0.0, 0.5), (0.4, 1.0)]
target = (0.1, 0.9)
print(f"Tổng độ dài covering: {sum(b-a for a,b in covering)}")  # = 1.1
# Nhưng outer measure của [0.1, 0.9] = 0.8 (infimum của các covering)

# Pre-measure trên algebra of intervals: mu_0((a,b]) = b-a
def pre_measure(a, b):
    return max(0, b - a)

# Kiểm tra sigma-additivity: (0,1] = (0,1/2] u (1/2, 1]
print(pre_measure(0, 0.5) + pre_measure(0.5, 1.0))  # 0.5 + 0.5 = 1.0
print(pre_measure(0, 1.0))                            # 1.0 ✓

# Almost everywhere: f(x) = 0 a.e. trên [0,1]
# dù f(r) = 1 cho mọi r in Q ∩ [0,1]
# Tập {x: f(x) ≠ 0} = Q ∩ [0,1] có lambda-measure 0
from fractions import Fraction
rationals_in_01 = [Fraction(p, q) for q in range(1, 20) for p in range(0, q+1)]
print(f"Q ∩ [0,1] có {len(rationals_in_01)} điểm trong mẫu số ≤ 19")
print("lambda(Q ∩ [0,1]) = 0 (đếm được, mỗi điểm có measure 0)")
```

---

## Summary / Key Takeaways

- **$\sigma$-algebra** $\mathcal{M}$: đóng với bù và hợp đếm được. Cần thiết vì không thể đo mọi tập (Vitali set). Borel $\sigma$-algebra $= \sigma(\text{tập mở})$.
- **Measure** $\mu$: không âm, $\sigma$-additive trên $(X, \mathcal{M})$. Tính chất: đơn điệu, bán-cộng tính, liên tục từ dưới/trên.
- **Outer measure** $\mu^*$: xác định trên $\mathcal{P}(X)$, chỉ bán-cộng tính. **Tập Carathéodory measurable** tạo thành $\sigma$-algebra, restriction là measure hoàn chỉnh.
- **Carathéodory Extension**: pre-measure trên algebra $\xrightarrow{\text{Carathéodory}}$ measure trên $\sigma$-algebra sinh bởi nó. Duy nhất khi $\sigma$-finite. Đây là nền tảng xây dựng Lebesgue measure (Bài 10).
- **Almost everywhere (a.e.)**: tính chất đúng ngoài tập null. Khái niệm then chốt trong tích phân Lebesgue — hai hàm bằng nhau a.e. được coi là "như nhau".

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.), Chapter 1, §1.1–1.4.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 2.
- Hunter, J. K. *Measure Theory* (UC Davis lecture notes), Chapters 1–5.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 1.
