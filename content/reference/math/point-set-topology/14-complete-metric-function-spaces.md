---
title: "14. Complete Metric Spaces & Function Spaces"
tags: [math, point-set-topology, lesson-14]
aliases: [Complete Metric Function Spaces]
created: 2026-03-30
---

> **Prerequisites**: [[05-metric-spaces|05. Metric Spaces]], [[07-compactness-foundations|07. Compactness — Foundations]]
> **Objectives**:
> - Định nghĩa Cauchy sequences và complete metric spaces
> - Phát biểu và chứng minh Baire Category Theorem (cả hai phiên bản)
> - Nắm Arzelà-Ascoli Theorem: điều kiện compact trong $C(X, \mathbb{R})$
> - Hiểu Stone-Weierstrass Theorem và hệ quả: đa thức trù mật trong $C([a,b])$

---

## Motivation / Intuition

Metric space cho ta khoảng cách. Nhưng không phải mọi dãy Cauchy đều hội tụ trong metric space tùy ý — ví dụ $\mathbb{Q}$ với metric Euclidean: dãy $3, 3.1, 3.14, 3.141, \ldots$ hội tụ về $\pi \notin \mathbb{Q}$.

**Complete metric spaces** là những không gian "không có lỗ hổng" theo nghĩa này: mọi dãy Cauchy đều hội tụ. $\mathbb{R}$ và $\mathbb{R}^n$ complete; $\mathbb{Q}$ không complete.

**Baire Category Theorem** — một trong những định lý mạnh nhất xuất phát từ completeness — nói rằng không gian complete metric (hoặc locally compact Hausdorff) không thể là hợp đếm được của các tập "nhỏ" (nowhere dense sets). Ứng dụng: chứng minh sự tồn tại của hàm liên tục không khả vi, tính chất generic của các đối tượng toán học.

**Arzelà-Ascoli** và **Stone-Weierstrass** là hai định lý nền tảng của giải tích hàm — cả hai liên quan đến cấu trúc topo của không gian hàm $C(X, \mathbb{R})$.

---

## Complete Metric Spaces

### Định nghĩa

> [!definition] Definition 14.1 — Cauchy Sequence và Complete Metric Space
> Trong metric space $(X, d)$, dãy $(x_n)$ gọi là **Cauchy** nếu:
>
> $$
> \forall\, \varepsilon > 0,\, \exists\, N : m, n > N \implies d(x_m, x_n) < \varepsilon.
> $$
>
> $(X, d)$ gọi là **complete** nếu mọi dãy Cauchy đều hội tụ trong $X$.

> [!note] Remark 14.2
> Completeness **không phải** topological property: $\mathbb{R}$ và $(0,1)$ homeomorphic (qua $\tan$) nhưng $\mathbb{R}$ complete còn $(0,1)$ không. Tuy nhiên, tồn tại metric tương đương trên $(0,1)$ làm nó complete (**completely metrizable** — là topological property).

> [!example] Example 14.3 — Ví dụ complete metric spaces
> - $(\mathbb{R}^n, d_2)$: complete (định lý Cauchy–Cantor).
> - $(C([a,b]), d_\infty)$ với $d_\infty(f,g) = \sup|f-g|$: complete.
> - $(\ell^2, d_2)$: complete (Hilbert space).
> - $(\mathbb{Q}, d_{\text{Eucl}})$: **không** complete.

> [!theorem] Theorem 14.4 — Tập đóng trong complete là complete
> Tập con đóng của complete metric space là complete.

> [!theorem] Theorem 14.5 — Cantor Intersection Theorem
> Trong complete metric space: nếu $F_1 \supseteq F_2 \supseteq \cdots$ là dãy lồng nhau tập đóng không rỗng với $\operatorname{diam}(F_n) \to 0$, thì $\bigcap F_n$ gồm đúng một điểm.

**Proof.** Chọn $x_n \in F_n$; với $m, n > N$: $d(x_m, x_n) \leq \operatorname{diam}(F_N) \to 0$, nên $(x_n)$ Cauchy, hội tụ đến $x$. Vì $F_n$ đóng, $x \in \bigcap F_n$. Đường kính $\to 0$ đảm bảo duy nhất. $\blacksquare$

---

## Baire Category Theorem

> [!definition] Definition 14.6 — Nowhere Dense, Meager, Residual
> - Tập $A$ gọi là **nowhere dense** nếu $\operatorname{Int}(\overline{A}) = \emptyset$ — tức bao đóng không chứa open set nào.
> - Tập $A$ gọi là **meager** (hay **first category**) nếu là hợp đếm được của các tập nowhere dense.
> - Tập $A$ gọi là **residual** (hay **second category** complement) nếu bù của nó meager.

Trực giác: nowhere dense = "mỏng"; meager = "hợp đếm được các tập mỏng" = vẫn "nhỏ" về mặt topo.

> [!theorem] Theorem 14.7 — Baire Category Theorem
> Trong **complete metric space** $X$ (hoặc **locally compact Hausdorff** $X$):
>
> Hợp đếm được của các tập nowhere dense có **interior rỗng** — hay tương đương: giao đếm được của các **open dense sets** là **dense**.
>
> Cụ thể: nếu $X = \bigcup_{n=1}^\infty A_n$ thì ít nhất một $A_n$ không nowhere dense (tức $\operatorname{Int}(\overline{A_n}) \neq \emptyset$).

Xem chứng minh đầy đủ tại [[a3-proof-of-baire-category-theorem|A3. Proof of Baire Category Theorem]].

**Ý tưởng chứng minh (complete metric case).** Cho $\{U_n\}$ là họ các open dense sets; cần chứng minh $\bigcap U_n$ dense. Với mọi open $V \neq \emptyset$: dùng dense-ness của $U_1$ để chọn $\overline{B}_1 \subseteq V \cap U_1$ có đường kính $< 1$. Tiếp tục chọn $\overline{B}_{n+1} \subseteq B_n \cap U_{n+1}$ với đường kính $< \frac{1}{n+1}$. Cantor Intersection (Theorem 14.5) cho điểm $x \in \bigcap \overline{B}_n \subseteq V \cap \bigcap U_n$. $\blacksquare$

### Ứng dụng Baire Category Theorem

> [!example] Example 14.8 — Hàm liên tục nowhere differentiable tồn tại
> Trong $C([0,1])$ (complete), tập các hàm có đạo hàm tại ít nhất một điểm là **meager**. Do đó "hầu hết" hàm liên tục (theo nghĩa residual) đều **nowhere differentiable** — kết quả phi trực giác lần đầu được Weierstrass chứng minh tường minh (1872).

> [!example] Example 14.9 — $\mathbb{R}$ không đếm được
> $\mathbb{R}$ complete. Nếu $\mathbb{R} = \{x_1, x_2, \ldots\}$ đếm được, thì $\mathbb{R} = \bigcup_n \{x_n\}$ — hợp đếm được của tập nowhere dense (singleton trong $\mathbb{R}$). BCT suy ra $\mathbb{R}$ có interior rỗng — vô lý. Vậy $\mathbb{R}$ không đếm được.

> [!example] Example 14.10 — Open Mapping Theorem (Giải tích hàm)
> Baire Category Theorem là bước then chốt trong chứng minh Banach's Open Mapping Theorem và Closed Graph Theorem — hai định lý nền tảng của giải tích hàm.

---

## Arzelà-Ascoli Theorem

> [!definition] Definition 14.11 — Equicontinuous và Uniformly Bounded
> Cho $\mathcal{F} \subseteq C(X, \mathbb{R})$ là họ hàm liên tục trên compact metric space $X$.
>
> - $\mathcal{F}$ gọi là **uniformly bounded** nếu $\exists\, M$: $|f(x)| \leq M$ với mọi $f \in \mathcal{F}$, $x \in X$.
> - $\mathcal{F}$ gọi là **equicontinuous** tại $x_0$ nếu: $\forall\, \varepsilon > 0$, $\exists\, \delta > 0$ sao cho $d(x, x_0) < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon$ với **mọi** $f \in \mathcal{F}$ đồng thời.
> - $\mathcal{F}$ **equicontinuous** nếu equicontinuous tại mọi điểm (đồng đều theo $f$).

> [!theorem] Theorem 14.12 — Arzelà-Ascoli Theorem
> Cho $X$ là compact metric space. Tập con $\mathcal{F} \subseteq C(X, \mathbb{R})$ (với sup metric $d_\infty$) là **compact** khi và chỉ khi $\mathcal{F}$ **closed**, **uniformly bounded**, và **equicontinuous**.

**Proof sketch.** ($\Rightarrow$) Compact $\Rightarrow$ closed và bounded. Equicontinuity từ compactness: nếu không equicontinuous tại $x_0$, xây dựng dãy không có dãy con hội tụ đều.

($\Leftarrow$) Dùng second countability của $X$: chọn countable dense $\{x_n\} \subseteq X$. Với dãy bất kỳ $(f_k) \subseteq \mathcal{F}$: dùng phương pháp đường chéo (diagonal argument) để trích dãy con hội tụ điểm trên $\{x_n\}$. Equicontinuity nâng lên hội tụ đều trên toàn $X$. $\blacksquare$

> [!example] Example 14.13 — Ứng dụng Arzelà-Ascoli trong phương trình vi phân
> Chứng minh sự tồn tại nghiệm của phương trình vi phân $y' = f(x,y)$ (Peano's theorem) dùng Arzelà-Ascoli: xây dựng dãy xấp xỉ Euler — equicontinuous và uniformly bounded — rồi trích dãy con hội tụ đến nghiệm.

---

## Stone-Weierstrass Theorem

> [!definition] Definition 14.14 — Algebra và Subalgebra của $C(X)$
> Cho $X$ compact Hausdorff. Một tập con $\mathcal{A} \subseteq C(X, \mathbb{R})$ gọi là **subalgebra** nếu đóng với cộng, nhân vô hướng, và nhân hàm số: $f, g \in \mathcal{A} \Rightarrow f+g, cf, fg \in \mathcal{A}$.

> [!theorem] Theorem 14.15 — Stone-Weierstrass Theorem
> Cho $X$ compact Hausdorff và $\mathcal{A} \subseteq C(X, \mathbb{R})$ là subalgebra thỏa:
>
> 1. $\mathcal{A}$ **separates points**: với $x \neq y$, tồn tại $f \in \mathcal{A}$ với $f(x) \neq f(y)$.
> 2. $\mathcal{A}$ **chứa hàm hằng**: $1 \in \mathcal{A}$ (hoặc tồn tại $g \in \mathcal{A}$, $g \neq 0$).
>
> Thì $\mathcal{A}$ **trù mật** trong $C(X, \mathbb{R})$ theo sup metric: $\overline{\mathcal{A}} = C(X, \mathbb{R})$.

> [!corollary] Corollary 14.16 — Weierstrass Approximation Theorem
> Họ đa thức $\mathcal{P} = \mathbb{R}[x]|_{[a,b]}$ trù mật trong $C([a,b], \mathbb{R})$: mọi hàm liên tục trên $[a,b]$ đều là giới hạn đều của dãy đa thức.

**Proof.** $\mathcal{P}$ là subalgebra của $C([a,b])$ chứa hàm hằng và phân biệt điểm (hàm $f(x) = x$). Stone-Weierstrass áp dụng. $\blacksquare$

> [!corollary] Corollary 14.17 — Phiên bản phức và trigonometric
> - **Phiên bản phức**: Nếu $\mathcal{A} \subseteq C(X, \mathbb{C})$ tách điểm, chứa hằng, và **đóng với conjugation** ($f \in \mathcal{A} \Rightarrow \bar{f} \in \mathcal{A}$), thì $\overline{\mathcal{A}} = C(X, \mathbb{C})$.
> - **Trigonometric**: Đa thức lượng giác trù mật trong $C([0, 2\pi])$ — nền tảng của lý thuyết Fourier.

---

## SageMath Cheatsheet

```python
# 1. Minh họa Baire Category Theorem: tổng đếm được nowhere dense ≠ R
import numpy as np

def is_nowhere_dense_sample(intervals, sample_pts):
    """Kiểm tra thô: không có khoảng nào nằm hoàn toàn trong hợp."""
    for pt in sample_pts:
        # Kiểm tra pt có trong một khoảng nào không
        in_union = any(a <= pt <= b for a,b in intervals)
    # Minh họa: singleton {q_n} nowhere dense trong R
    return True  # Luôn nowhere dense

# 2. Minh họa Arzelà-Ascoli: equicontinuous family
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

xs = np.linspace(0, 1, 300)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Equicontinuous family: f_n(x) = sin(nx)/n (bounded và equicontinuous ✓)
for n in range(1, 8):
    axes[0].plot(xs, np.sin(n*xs)/n, alpha=0.6, linewidth=1)
axes[0].set_title(r"Equicontinuous: $f_n(x) = \sin(nx)/n$" + "\n(Arzelà-Ascoli: compact closure)")
axes[0].set_xlabel('x'); axes[0].grid(True, alpha=0.3)

# NOT equicontinuous: f_n(x) = sin(nx) (bounded nhưng không equicontinuous ✗)
for n in range(1, 8):
    axes[1].plot(xs, np.sin(n*xs), alpha=0.6, linewidth=1)
axes[1].set_title(r"Không equicontinuous: $f_n(x) = \sin(nx)$" + "\n(closure không compact)")
axes[1].set_xlabel('x'); axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('arzela_ascoli.png', dpi=100)
print("Đã lưu: arzela_ascoli.png")

# 3. Stone-Weierstrass: xấp xỉ hàm liên tục bằng đa thức (Bernstein)
def bernstein(f, n, xs):
    """Đa thức Bernstein bậc n xấp xỉ f trên [0,1]."""
    from math import comb
    result = np.zeros_like(xs, dtype=float)
    for k in range(n+1):
        binom = comb(n, k)
        result += f(k/n) * binom * xs**k * (1-xs)**(n-k)
    return result

f_target = lambda x: np.abs(x - 0.5)   # |x - 0.5| — không khả vi tại 0.5
ys_target = f_target(xs)

plt.figure(figsize=(8, 4))
plt.plot(xs, ys_target, 'k-', linewidth=2.5, label='f(x) = |x - 0.5|')
for n in [5, 15, 50]:
    ys_approx = bernstein(f_target, n, xs)
    err = np.max(np.abs(ys_approx - ys_target))
    plt.plot(xs, ys_approx, '--', linewidth=1.5, label=f'Bernstein n={n} (err={err:.4f})')

plt.title("Stone-Weierstrass: Bernstein polynomial approximation")
plt.xlabel('x'); plt.legend(); plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('stone_weierstrass.png', dpi=100)
print("Đã lưu: stone_weierstrass.png")

# 4. Kiểm tra completeness: dãy Cauchy trong R hội tụ
def is_cauchy(seq, eps=1e-6):
    N = len(seq)
    for i in range(N//2, N):
        for j in range(i+1, min(i+10, N)):
            if abs(seq[i] - seq[j]) > eps:
                return False
    return True

# Dãy Cauchy: a_n = sum_{k=1}^n 1/k^2 → π^2/6
cauchy_seq = [sum(1/k**2 for k in range(1, n+1)) for n in range(1, 101)]
print(f"\nDãy sum 1/k^2 là Cauchy: {is_cauchy(cauchy_seq)}")
print(f"Giới hạn ≈ {cauchy_seq[-1]:.6f}, π²/6 = {np.pi**2/6:.6f}")
```

---

## Summary / Key Takeaways

- **Complete metric space**: mọi dãy Cauchy hội tụ — không phải topological property, nhưng "completely metrizable" thì là.
- **Cantor Intersection**: dãy lồng compact với đường kính $\to 0$ có giao đúng một điểm.
- **Baire Category Theorem**: trong complete metric space (hoặc LCH), hợp đếm được của nowhere dense sets có interior rỗng — ứng dụng sâu trong giải tích hàm.
- **Arzelà-Ascoli**: $\mathcal{F} \subseteq C(X, \mathbb{R})$ compact $\iff$ closed + uniformly bounded + equicontinuous (với $X$ compact metric).
- **Stone-Weierstrass**: subalgebra tách điểm và chứa hằng thì trù mật — hệ quả: đa thức trù mật trong $C([a,b])$.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§43–44, 48.
- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Ch. 7–8.
- Folland, G. B. *Real Analysis* (2nd ed.), §4.6–4.7.
- Baire, R. *Sur les fonctions de variables réelles*, 1899.
