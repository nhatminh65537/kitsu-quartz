---
title: "07. Lebesgue Measure"
tags: [math, functional-analysis, lesson-07]
aliases: [Lebesgue Measure]
created: 2026-03-31
---

> **Prerequisites**: [[01-metric-spaces-topology|01. Metric Spaces & Topology Review]]
> **Objectives**:
> - Hiểu động cơ xây dựng đo Lebesgue (tại sao Riemann không đủ)
> - Nắm vững outer measure, sigma-algebra, và Borel sets
> - Hiểu đo Lebesgue trên $\mathbb{R}$ và tính chất của nó

---

## Motivation / Intuition

Tích phân Riemann hoạt động tốt cho hàm liên tục trên đoạn $[a,b]$. Nhưng để xây dựng không gian $L^p$ — không gian hàm mà Functional Analysis cần — tích phân Riemann có những hạn chế nghiêm trọng:

1. **Giới hạn điểm của hàm Riemann tích phân có thể không Riemann tích phân được**: chuỗi $f_n = \mathbf{1}_{[0,1] \cap \mathbb{Q}}$ bước $n$ hội tụ về $\mathbf{1}_{\mathbb{Q}}$ — hàm không Riemann tích phân trên $[0,1]$.
2. **Định lý hội tụ không hoạt động tốt**: không có định lý nào nói "giới hạn điểm của dãy Riemann tích phân được vẫn tích phân được và tích phân giao hoán với giới hạn."

Lebesgue xây dựng lý thuyết đo và tích phân khắc phục hoàn toàn những vấn đề này.

---

## Outer Measure (Đo ngoài)

> [!definition] Definition 7.1 — Lebesgue Outer Measure trên $\mathbb{R}$
> Với $E \subseteq \mathbb{R}$, định nghĩa **Lebesgue outer measure** (đo ngoài Lebesgue):
>
> $$
> m^*(E) = \inf\left\{\sum_{n=1}^\infty (b_n - a_n) : E \subseteq \bigcup_{n=1}^\infty (a_n, b_n)\right\}
> $$
>
> (infimum lấy trên tất cả các phủ đếm được của $E$ bằng các khoảng mở).

> [!theorem] Theorem 7.2 — Tính chất của outer measure
> Với mọi $E, E_1, E_2, \ldots \subseteq \mathbb{R}$:
>
> 1. **Không âm**: $m^*(E) \geq 0$; $m^*(\emptyset) = 0$
> 2. **Đơn điệu**: $E \subseteq F \implies m^*(E) \leq m^*(F)$
> 3. **Sigma-subadditive**: $m^*\!\left(\bigcup_{n=1}^\infty E_n\right) \leq \sum_{n=1}^\infty m^*(E_n)$
> 4. **Chuẩn với khoảng**: $m^*((a,b)) = b - a$

> [!warning] Counterexample 7.3 — Outer measure không additive
> Tồn tại các tập rời nhau $A, B$ sao cho $m^*(A \cup B) < m^*(A) + m^*(B)$. Đây là lý do phải đưa ra khái niệm **đo được** (measurable sets).

---

## Sigma-Algebra và Tập đo được

> [!definition] Definition 7.4 — $\sigma$-algebra
> Họ $\mathcal{M}$ các tập con của $\mathbb{R}$ gọi là **$\sigma$-algebra** nếu:
>
> 1. $\mathbb{R} \in \mathcal{M}$
> 2. $E \in \mathcal{M} \implies \mathbb{R} \setminus E \in \mathcal{M}$ (đóng với phần bù)
> 3. $E_1, E_2, \ldots \in \mathcal{M} \implies \bigcup_{n=1}^\infty E_n \in \mathcal{M}$ (đóng với hợp đếm được)

> [!definition] Definition 7.5 — Tập Lebesgue đo được (Caratheodory criterion)
> Tập $E \subseteq \mathbb{R}$ gọi là **Lebesgue đo được** (Lebesgue measurable) nếu với mọi $A \subseteq \mathbb{R}$:
>
> $$
> m^*(A) = m^*(A \cap E) + m^*(A \setminus E)
> $$
>
> Ký hiệu $\mathcal{L}$ là tập tất cả các tập Lebesgue đo được.

> [!theorem] Theorem 7.6 — $\mathcal{L}$ là $\sigma$-algebra
> Họ $\mathcal{L}$ các tập Lebesgue đo được là một $\sigma$-algebra chứa tất cả các khoảng mở (và đóng) của $\mathbb{R}$.

---

## Borel $\sigma$-algebra

> [!definition] Definition 7.7 — Borel $\sigma$-algebra
> **Borel $\sigma$-algebra** $\mathcal{B}(\mathbb{R})$ là $\sigma$-algebra nhỏ nhất chứa tất cả các tập mở của $\mathbb{R}$. Các phần tử của $\mathcal{B}(\mathbb{R})$ gọi là **Borel sets**.

> [!theorem] Theorem 7.8 — Thứ tự lồng nhau
>
> $$
> \mathcal{B}(\mathbb{R}) \subsetneq \mathcal{L} \subsetneq \mathcal{P}(\mathbb{R})
> $$
>
> Mọi Borel set đều Lebesgue đo được, nhưng tồn tại tập Lebesgue đo được không phải Borel. Tập Vitali (xây dựng bằng Axiom of Choice) không Lebesgue đo được.

---

## Đo Lebesgue (Lebesgue Measure)

> [!definition] Definition 7.9 — Đo Lebesgue
> **Đo Lebesgue** là hạn chế của $m^*$ lên $\mathcal{L}$:
>
> $$
> m = m^*\big|_{\mathcal{L}}: \mathcal{L} \to [0, +\infty]
> $$

> [!theorem] Theorem 7.10 — Tính chất cơ bản của Lebesgue measure
> Đo Lebesgue $m: \mathcal{L} \to [0, +\infty]$ thỏa mãn:
>
> 1. **$\sigma$-additive**: Nếu $(E_n)$ rời nhau từng đôi và thuộc $\mathcal{L}$:
>
> $$
> m\!\left(\bigsqcup_{n=1}^\infty E_n\right) = \sum_{n=1}^\infty m(E_n)
> $$
>
> 2. **Chuẩn hóa**: $m([a,b]) = b - a$
> 3. **Bất biến dịch chuyển**: $m(E + t) = m(E)$ với mọi $t \in \mathbb{R}$
> 4. **Tập đếm được có độ đo 0**: $m(\{x\}) = 0$; $m(\mathbb{Q}) = 0$
> 5. **Tính chất liên tục từ dưới/trên**:
>    - $E_1 \subseteq E_2 \subseteq \cdots$: $m\!\left(\bigcup_n E_n\right) = \lim_n m(E_n)$
>    - $E_1 \supseteq E_2 \supseteq \cdots$, $m(E_1) < \infty$: $m\!\left(\bigcap_n E_n\right) = \lim_n m(E_n)$

> [!example] Example 7.11 — Tập Cantor có độ đo 0
> Tập Cantor $\mathcal{C} \subseteq [0,1]$ xây dựng bằng cách lặp lại loại bỏ phần ba giữa. Sau $n$ bước, ta loại đi độ dài tổng:
>
> $$
> \frac{1}{3} + \frac{2}{9} + \frac{4}{27} + \cdots = \sum_{k=0}^\infty \frac{2^k}{3^{k+1}} = 1
> $$
>
> Vậy $m(\mathcal{C}) = 1 - 1 = 0$. Nhưng $|\mathcal{C}| = |\mathbb{R}|$ (không đếm được)! Đây là ví dụ cho thấy "kích thước topo" và "kích thước đo" khác nhau.

---

## Hàm đo được (Measurable Functions)

> [!definition] Definition 7.12 — Hàm đo được (Measurable Function)
> Hàm $f: \mathbb{R} \to [-\infty, +\infty]$ gọi là **đo được** (measurable) nếu với mọi $c \in \mathbb{R}$:
>
> $$
> \{x \in \mathbb{R} : f(x) > c\} \in \mathcal{L}
> $$

> [!theorem] Theorem 7.13 — Lớp hàm đo được đóng với các phép toán
> Nếu $f$, $g$ đo được, $c \in \mathbb{R}$ thì các hàm sau đều đo được:
> $f + g$, $fg$, $cf$, $|f|$, $\max(f,g)$, $\min(f,g)$, $f^+$, $f^-$,
> và $\sup_n f_n$, $\inf_n f_n$, $\limsup_n f_n$, $\liminf_n f_n$ (nếu mỗi $f_n$ đo được).

> [!theorem] Theorem 7.14 — Xấp xỉ bằng hàm đơn giản (Simple Functions)
> Hàm $s: \mathbb{R} \to \mathbb{R}$ gọi là **simple function** nếu $s = \sum_{k=1}^n c_k \mathbf{1}_{E_k}$ với $E_k \in \mathcal{L}$ và $c_k \in \mathbb{R}$.
>
> Với mọi hàm $f \geq 0$ đo được, tồn tại dãy hàm đơn giản $0 \leq s_1 \leq s_2 \leq \cdots \leq f$ sao cho $s_n(x) \to f(x)$ với mọi $x$.

---

## Tính chất "Almost Everywhere"

> [!definition] Definition 7.15 — Almost Everywhere (a.e.)
> Tính chất $P(x)$ được nói là đúng **almost everywhere** (a.e.) nếu tập $\{x : P(x) \text{ sai}\}$ có độ đo 0.

> [!note] Remark 7.16
> Trong lý thuyết $L^p$, ta đồng nhất hai hàm bằng nhau a.e. — đây là lý do $L^p$ bao gồm các **lớp tương đương** hàm, không phải bản thân hàm.

---

## SageMath Cheatsheet

```python
import numpy as np

# Minh họa outer measure: xấp xỉ m*(E) bằng phủ khoảng
# Ví dụ: E = tập hữu tỉ trong [0,1]
# Phủ Q ∩ [0,1] bằng khoảng (q - eps/2^n, q + eps/2^n)
eps = 0.1
rationals_sample = [k/n for n in range(1, 20) for k in range(n+1)]
rationals_sample = sorted(set(rationals_sample))

total_length = sum(2 * eps / 2**i for i in range(1, len(rationals_sample)+1))
print(f"Phủ {len(rationals_sample)} điểm hữu tỉ, tổng độ dài phủ <= {total_length:.6f}")
print("m*(Q ∩ [0,1]) = 0 (có thể phủ bằng khoảng tổng độ dài tùy nhỏ)")

# Xây dựng tập Cantor và tính độ dài bị loại
def cantor_removed_length(n_steps):
    """Tổng độ dài bị loại sau n_steps bước"""
    total = 0
    for k in range(n_steps):
        total += (2**k) / (3**(k+1))
    return total

for n in [1, 5, 10, 20, 50]:
    removed = cantor_removed_length(n)
    print(f"Sau {n:2d} bước: loại {removed:.8f}, còn lại {1-removed:.8f}")
print("Giới hạn: toàn bộ độ dài = 1, m(Cantor) = 0")

# Độ đo tập con của [0,1]
def measure_interval(a, b):
    return max(0, b - a)

# Bất biến dịch chuyển
E = (0.2, 0.7)
t = 0.3
Etrans = (E[0]+t, E[1]+t)
print(f"\nm([{E[0]},{E[1]}]) = {measure_interval(*E)}")
print(f"m([{Etrans[0]},{Etrans[1]}]) = {measure_interval(*Etrans)}")
print("Bất biến dịch chuyển: OK")
```

---

## Summary / Key Takeaways

- **Outer measure** $m^*$: đo mọi tập (không cần đo được), nhưng chỉ $\sigma$-subadditive.
- **Caratheodory**: $E$ đo được khi mọi "thử nghiệm" $A$ đều cho $m^*(A) = m^*(A\cap E) + m^*(A\setminus E)$.
- $\mathcal{L}$ là $\sigma$-algebra; $\mathcal{B}(\mathbb{R}) \subsetneq \mathcal{L} \subsetneq \mathcal{P}(\mathbb{R})$.
- Đo Lebesgue $m$ là $\sigma$-additive, chuẩn $m([a,b]) = b-a$, bất biến dịch chuyển.
- Tập đếm được (bao gồm $\mathbb{Q}$) có độ đo 0; tập Cantor: không đếm được nhưng độ đo 0.
- **Hàm đo được** đóng với tất cả phép toán giải tích; xấp xỉ được bởi simple functions.
- Khái niệm **almost everywhere (a.e.)** là nền tảng của không gian $L^p$.

---

## References

- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapters 1–2.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapters 1–3.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 2.
- MIT 18.102, Lectures 6–8.
