---
title: "12. Tychonoff's Theorem & Stone-Čech Compactification"
tags: [math, point-set-topology, lesson-12]
aliases: [Tychonoff Stone-Cech]
created: 2026-03-30
---

> **Prerequisites**: [[07-compactness-foundations|07. Compactness — Foundations]], [[08-compactness-advanced|08. Compactness — Advanced]], [[10-separation-axioms|10. Separation Axioms]]
> **Objectives**:
> - Phát biểu và nắm ý nghĩa của Tychonoff's Theorem: tích của compact spaces là compact
> - Hiểu tại sao định lý này tương đương Axiom of Choice (AC)
> - Xây dựng Stone-Čech compactification $\beta X$ và hiểu universal property của nó
> - Phân biệt one-point compactification (Bài 08) và Stone-Čech compactification

---

## Motivation / Intuition

Ta đã biết: tích hữu hạn của compact spaces là compact (Bài 07). Điều gì xảy ra với tích **vô hạn**? Đây là câu hỏi sâu — và câu trả lời là **Tychonoff's Theorem**: tích **bất kỳ** họ compact spaces (dù vô hạn hay không đếm được) vẫn compact theo product topology.

Định lý này đáng chú ý vì hai lý do:
1. **Sức mạnh**: $[0,1]^{\mathbb{R}}$ (tích không đếm được) compact — một kết quả phi trực giác.
2. **Triết học**: Tychonoff's Theorem **tương đương** với Axiom of Choice (AC) — một trong những kết quả nền tảng nhất của logic toán học (Kelley, 1950).

Stone-Čech compactification là "compactification lớn nhất" của một Tychonoff space — ngược với one-point compactification "nhỏ nhất". Nó có universal property đẹp: mọi hàm liên tục $f : X \to K$ (với $K$ compact Hausdorff) kéo dài duy nhất thành $\beta f : \beta X \to K$.

---

## Tychonoff's Theorem

> [!theorem] Theorem 12.1 — Tychonoff's Theorem
> Tích (product topology) của họ bất kỳ $\{X_\alpha\}_{\alpha \in I}$ các không gian compact đều compact:
>
> $$
> X_\alpha \text{ compact } \forall\, \alpha \in I \implies \prod_{\alpha \in I} X_\alpha \text{ compact.}
> $$

Xem chứng minh đầy đủ tại [[a1-proof-of-tychonoff-theorem|A1. Proof of Tychonoff's Theorem]].

**Ý tưởng chứng minh (qua ultrafilters).** Một cách chứng minh hiện đại dùng **ultrafilters**:
- Định nghĩa: filter $\mathcal{F}$ trên $X$ là họ tập con "lớn" thỏa: đóng với giao hữu hạn, đóng với superset, không chứa $\emptyset$.
- Ultrafilter: filter tối đại.
- Lemma (AC): mọi filter đều mở rộng thành ultrafilter.
- Compact $\iff$ mọi ultrafilter converge (có điểm giới hạn).
- Với $x = (x_\alpha) \in \prod X_\alpha$: ultrafilter $\mathcal{F}$ trên product $\to$ với mỗi $\alpha$, $\pi_\alpha(\mathcal{F})$ là ultrafilter trên $X_\alpha$ compact $\to$ hội tụ đến $x_\alpha \to$ $\mathcal{F}$ hội tụ đến $x$.

> [!theorem] Theorem 12.2 — Tychonoff $\iff$ Axiom of Choice
> Tychonoff's Theorem tương đương Axiom of Choice trong ZF set theory (Kelley 1950, Folklore).

> [!warning] Counterexample 12.3 — Box topology không compact
> Tích $[0,1]^\omega$ với **box topology** không compact: họ $\mathcal{U} = \prod_{n=1}^\infty (0,1)$ là open set trong box topology không có finite subcover. Đây là lý do product topology (Tychonoff) được dùng thay box topology.

### Hệ quả

> [!corollary] Corollary 12.4 — $[0,1]^I$ compact với mọi $I$
> Với mọi tập chỉ số $I$, tích $[0,1]^I = \prod_{\alpha \in I} [0,1]$ (product topology) là compact Hausdorff. Kết quả này là nền tảng của chứng minh Stone-Čech compactification.

> [!corollary] Corollary 12.5 — Cantor set compact
> Cantor set $C = \{0,1\}^\omega$ (product của countably nhiều $\{0,1\}$ discrete) compact (Tychonoff), perfect (không có isolated points), totally disconnected, metrizable — và homeomorphic với mọi compact metrizable perfect totally disconnected space (Brouwer's theorem).

---

## Alexander Sub-base Theorem

> [!theorem] Theorem 12.6 — Alexander Sub-base Theorem
> Cho $\mathcal{S}$ là subbasis của topology trên $X$. Nếu mọi **open cover bởi các phần tử của $\mathcal{S}$** đều có finite subcover, thì $X$ compact.

**Proof.** Giả sử $X$ không compact; có open cover $\mathcal{U}$ không có finite subcover. Dùng Zorn's Lemma (tương đương AC), mở rộng $\mathcal{U}$ thành họ tối đại $\mathcal{V}$ các open sets không có finite subcover. Ta chứng minh $\mathcal{V}$ phải chứa một phần tử subbasis $S \in \mathcal{S}$ không có finite subcover — mâu thuẫn với giả thiết. $\blacksquare$

> [!note] Remark 12.7
> Alexander Sub-base Theorem cho phép chứng minh Tychonoff từ subbasis của product topology (các $\pi_\alpha^{-1}(U_\alpha)$) — đây là cách Munkres trình bày. Xem chi tiết tại [[a1-proof-of-tychonoff-theorem|A1]].

---

## Stone-Čech Compactification

### Xây dựng

> [!definition] Definition 12.8 — Stone-Čech Compactification
> Cho $X$ là **Tychonoff space** ($T_{3\frac{1}{2}}$). **Stone-Čech compactification** của $X$ là một compact Hausdorff space $\beta X$ cùng embedding liên tục $\iota : X \hookrightarrow \beta X$ sao cho $\iota(X)$ dense trong $\beta X$, thỏa **universal property**:
>
> Với mọi compact Hausdorff space $K$ và mọi hàm liên tục $f : X \to K$, tồn tại duy nhất hàm liên tục $\bar{f} : \beta X \to K$ sao cho $\bar{f} \circ \iota = f$:
>
> $$
> \begin{array}{ccc}
> X & \xrightarrow{f} & K \\
> \iota \downarrow & \nearrow \bar{f} & \\
> \beta X & &
> \end{array}
> $$

> [!theorem] Theorem 12.9 — Stone-Čech compactification tồn tại và duy nhất
> Với mọi Tychonoff space $X$, $\beta X$ tồn tại và duy nhất (sai đến homeomorphism tương thích với $\iota$).

**Proof (tồn tại).** Xét họ $\mathcal{F} = \{f : X \to [0,1] : f \text{ liên tục}\}$. Định nghĩa embedding:

$$
e : X \to [0,1]^{\mathcal{F}}, \quad e(x) = (f(x))_{f \in \mathcal{F}}.
$$

$e$ là embedding vì $X$ Tychonoff (completely regular). Đặt $\beta X = \overline{e(X)} \subseteq [0,1]^{\mathcal{F}}$ — tập đóng trong compact Hausdorff (Tychonoff's Theorem), nên compact Hausdorff. $\iota = e$ là embedding với $\iota(X)$ dense. Universal property kiểm tra được. $\blacksquare$

### Tính chất của $\beta X$

> [!theorem] Theorem 12.10 — $\beta\mathbb{N}$: compactification của $\mathbb{N}$
> Stone-Čech compactification $\beta\mathbb{N}$ của $\mathbb{N}$ (discrete topology) là compact Hausdorff, không metrizable, và có cardinality $2^{2^{\aleph_0}}$. Các điểm của $\beta\mathbb{N} \setminus \mathbb{N}$ tương ứng với các **ultrafilters** trên $\mathbb{N}$ — công cụ quan trọng trong combinatorics (Ramsey theory, Hindman's theorem).

> [!theorem] Theorem 12.11 — So sánh $X^*$ và $\beta X$
> Cho $X$ LCH không compact. Cả $X^*$ (one-point) và $\beta X$ (Stone-Čech) đều compactify $X$, nhưng:
>
> - $X^*$ là compactification **nhỏ nhất** (minimal): chỉ thêm một điểm.
> - $\beta X$ là compactification **lớn nhất** (maximal): mọi compact Hausdorff compactification là continuous image của $\beta X$.
>
> Với $X = \mathbb{R}$: $\mathbb{R}^* \cong S^1$, nhưng $\beta\mathbb{R}$ lớn hơn rất nhiều và không metrizable.

> [!example] Example 12.12 — Universal property trong thực tế
> Mọi hàm bị chặn $f : \mathbb{N} \to \mathbb{R}$ (tức $f \in \ell^\infty$) kéo dài duy nhất thành $\bar{f} : \beta\mathbb{N} \to \mathbb{R}$ liên tục. Điều này cho phép định nghĩa "giới hạn Banach" (Banach limit) — một hàm tuyến tính tự nhiên trên $\ell^\infty$.

---

## SageMath Cheatsheet

```python
# Minh họa Tychonoff's Theorem qua tích hữu hạn (kiểm tra compactness)

import numpy as np

# Kiểm tra: [0,1]^n compact — mọi dãy có dãy con hội tụ (sequential compactness)
# Minh họa qua thuật toán diagonal extraction

def diagonal_subsequence(sequences, tol=1e-3):
    """
    Trích dãy con hội tụ từ dãy trong [0,1]^n
    theo phương pháp Cantor diagonalization.
    sequences: list of n sequences (list of floats in [0,1])
    """
    n = len(sequences)
    m = len(sequences[0])
    indices = list(range(m))

    for coord in range(n):
        # Chia [0,1] thành các ô, tìm ô chứa vô hạn phần tử
        seq = [sequences[coord][i] for i in indices]
        lo, hi = 0.0, 1.0
        new_indices = indices[:]
        for _ in range(10):  # 2^10 = 1024 độ chính xác
            mid = (lo + hi) / 2
            left = [i for i in new_indices if sequences[coord][i] <= mid]
            right = [i for i in new_indices if sequences[coord][i] > mid]
            if len(left) >= len(right):
                new_indices = left; hi = mid
            else:
                new_indices = right; lo = mid
        indices = new_indices[:20]  # Giữ 20 chỉ số

    return indices[:10]

np.random.seed(42)
n_coords = 3
seq_len = 200
# Tạo dãy trong [0,1]^3
sequences = [np.random.uniform(0, 1, seq_len).tolist() for _ in range(n_coords)]

subseq_idx = diagonal_subsequence(sequences)
print("Dãy con trích từ [0,1]^3 (chỉ số):", subseq_idx[:10])
print("Giá trị dãy con tại tọa độ 1:", [round(sequences[0][i], 4) for i in subseq_idx])
print("Giá trị dãy con tại tọa độ 2:", [round(sequences[1][i], 4) for i in subseq_idx])
print("Giá trị dãy con tại tọa độ 3:", [round(sequences[2][i], 4) for i in subseq_idx])

# Minh họa Stone-Čech: embedding X → [0,1]^F
# Với X = {1,...,5} discrete, F = tất cả hàm f: X -> [0,1]
# Mỗi điểm x ánh xạ đến tuple (f(x))_{f in F}
X = list(range(1, 6))

# Dùng một họ hàm đại diện để minh họa embedding
import math
funcs = [
    lambda x: x / 5,
    lambda x: (x-1) / 4 if x > 1 else 0,
    lambda x: math.sin(x) / 2 + 0.5,
    lambda x: 1 / x,
    lambda x: (x % 2) * 0.5,
]
embedding = {x: tuple(round(f(x), 3) for f in funcs) for x in X}
print("\nEmbedding e: X → [0,1]^5:")
for x, vec in embedding.items():
    print(f"  e({x}) = {vec}")
print("Tất cả điểm phân biệt nhau → e là injective ✓")
```

---

## Summary / Key Takeaways

- **Tychonoff's Theorem**: tích (product topology) của bất kỳ họ compact spaces nào đều compact — tương đương AC.
- Box topology **không** bảo toàn compactness cho product vô hạn.
- **Alexander Sub-base Theorem**: đủ kiểm tra compactness trên subbasis — nền tảng của một chứng minh Tychonoff.
- **Stone-Čech compactification** $\beta X$: compact Hausdorff, $X$ dense trong $\beta X$, universal property — mọi $f : X \to K$ liên tục ($K$ compact Hausdorff) kéo dài duy nhất thành $\bar{f} : \beta X \to K$.
- $\beta X$ tồn tại qua embedding $X \hookrightarrow [0,1]^{\mathcal{F}}$ và Tychonoff's Theorem.
- So sánh: one-point compactification $X^*$ là minimal; $\beta X$ là maximal.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§37, 38.
- Willard, S. *General Topology*, §§17, 19.
- Kelley, J. L. *General Topology*, Ch. 5 (Tychonoff ↔ AC).
- Walker, R. C. *The Stone-Čech Compactification* (Springer, 1974).
