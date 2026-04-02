---
title: "04. Fundamental Theorems I — Baire & UBP"
tags: [math, functional-analysis, lesson-04]
aliases: [Baire Category Uniform Boundedness]
created: 2026-03-31
---

> **Prerequisites**: [[02-normed-spaces-banach|02. Normed Spaces & Banach Spaces]], [[03-bounded-linear-operators|03. Bounded Linear Operators]]
> **Objectives**:
> - Hiểu và chứng minh Baire Category Theorem
> - Nắm vững Uniform Boundedness Principle (Banach–Steinhaus)
> - Áp dụng vào các ví dụ phân kỳ pointwise vs. bounded

---

## Motivation / Intuition

Ba định lý nền tảng của Functional Analysis — Uniform Boundedness Principle, Open Mapping Theorem, Hahn-Banach — đều khai thác tính **đầy đủ** của không gian Banach. Bài này trình bày định lý đầu tiên, với công cụ trung tâm là **Baire Category Theorem**: kết quả topology mạnh mẽ nói rằng một không gian metric đầy đủ không thể là hợp đếm được của các tập "nhỏ" (nowhere dense).

Ứng dụng nổi bật: nếu một họ toán tử bị chặn pointwise thì nó bị chặn đồng đều — điều không rõ ràng chút nào nếu không có công cụ mạnh!

---

## Baire Category Theorem

### Definition

> [!definition] Definition 4.1 — Tập nowhere dense và tập meager
> Cho $(X, d)$ là không gian metric.
>
> - Tập $A \subseteq X$ gọi là **nowhere dense** (không trù mật ở đâu) nếu phần trong của bao đóng rỗng: $(\overline{A})^\circ = \emptyset$.
> - Tập $E \subseteq X$ gọi là **meager** (hay **first category**) nếu $E$ là hợp đếm được của các tập nowhere dense.
> - Tập không phải meager gọi là **second category**.

> [!example] Example 4.2
> - $\mathbb{Q} \subset \mathbb{R}$: mỗi singleton $\{q\}$ là nowhere dense, nên $\mathbb{Q} = \bigcup_{q \in \mathbb{Q}} \{q\}$ là meager trong $\mathbb{R}$.
> - $\mathbb{R}$ không phải meager trong chính nó (đây chính là nội dung của Baire Category Theorem).

### Theorem

> [!theorem] Theorem 4.3 — Baire Category Theorem (BCT)
> Nếu $(X, d)$ là không gian metric **đầy đủ** (complete), thì $X$ là **second category**: $X$ **không thể** là hợp đếm được của các tập nowhere dense.
>
> Tương đương: Nếu $X = \bigcup_{n=1}^\infty A_n$, thì ít nhất một $A_n$ có phần trong khác rỗng, tức là $(\overline{A_n})^\circ \neq \emptyset$ với một vài $n$.

**Proof.** (Xem chứng minh đầy đủ tại [[a0-proof-of-baire|A0. Proof of Baire Category Theorem]])

Phác thảo: Giả sử $X = \bigcup_{n=1}^\infty A_n$ với mỗi $A_n$ nowhere dense. Ta sẽ dẫn đến mâu thuẫn bằng cách xây dựng dãy quả cầu đóng lồng nhau $\overline{B}(x_n, r_n)$ với $r_n \to 0$ sao cho:

$$
\overline{B}(x_1, r_1) \supset \overline{B}(x_2, r_2) \supset \cdots \quad \text{và} \quad \overline{B}(x_n, r_n) \cap A_n = \emptyset
$$

Vì $X$ đầy đủ, giao $\bigcap_n \overline{B}(x_n, r_n) \neq \emptyset$ (Cantor's intersection theorem), nhưng điểm này không thuộc $A_n$ nào — mâu thuẫn. $\blacksquare$

> [!note] Remark 4.4 — Hệ quả topo
> BCT nói rằng trong không gian metric đầy đủ, mọi tập mở không rỗng đều là second category — tức là "hầu hết" các điểm không nằm trong bất kỳ tập meager nào. Đây là cảm giác "kích thước topo" khác với kích thước đo.

---

## Uniform Boundedness Principle (Banach–Steinhaus)

> [!theorem] Theorem 4.5 — Uniform Boundedness Principle (UBP)
> Cho $X$ là không gian Banach, $Y$ là không gian chuẩn, và $\mathcal{F} \subseteq B(X, Y)$ là một họ toán tử bị chặn. Nếu họ $\mathcal{F}$ bị chặn **pointwise** (hay **strongly**):
>
> $$
> \sup_{T \in \mathcal{F}} \|Tx\| < \infty \quad \forall\, x \in X
> $$
>
> thì họ $\mathcal{F}$ bị chặn **đồng đều** (uniformly) về norm toán tử:
>
> $$
> \sup_{T \in \mathcal{F}} \|T\| < \infty
> $$

**Proof.** Với mỗi $n \geq 1$, định nghĩa:

$$
A_n = \{x \in X : \|Tx\| \leq n \text{ với mọi } T \in \mathcal{F}\} = \bigcap_{T \in \mathcal{F}} T^{-1}(\overline{B}(0, n))
$$

Mỗi $A_n$ là giao của các tập đóng (vì $T$ liên tục), nên $A_n$ đóng. Theo giả thiết pointwise, $X = \bigcup_{n=1}^\infty A_n$.

Theo BCT, vì $X$ Banach (hoàn toàn), tồn tại $n_0$ sao cho $A_{n_0}$ có phần trong không rỗng: tồn tại $x_0 \in X$ và $r > 0$ với $\overline{B}(x_0, r) \subseteq A_{n_0}$.

Với mọi $x \in X$ thỏa $\|x\| \leq r$ và mọi $T \in \mathcal{F}$:

$$
\|Tx\| = \|T(x_0 + x) - Tx_0\| \leq \|T(x_0 + x)\| + \|Tx_0\| \leq n_0 + n_0 = 2n_0
$$

(vì $x_0 + x \in \overline{B}(x_0, r) \subseteq A_{n_0}$ và $x_0 \in A_{n_0}$). Với $\|x\| = 1$, thay $x$ bởi $rx$:

$$
\|Tx\| = \frac{1}{r}\|T(rx)\| \leq \frac{2n_0}{r}
$$

Vậy $\sup_{T \in \mathcal{F}} \|T\| \leq 2n_0/r < \infty$. $\blacksquare$

---

## Hệ quả và Ứng dụng

> [!corollary] Corollary 4.6 — Banach–Steinhaus Theorem
> Cho $X$ là Banach, $Y$ là chuẩn, $(T_n) \subseteq B(X,Y)$. Nếu giới hạn $Tx = \lim_{n\to\infty} T_n x$ tồn tại với mọi $x \in X$, thì:
>
> 1. $\sup_n \|T_n\| < \infty$
> 2. $T \in B(X, Y)$
> 3. $\|T\| \leq \liminf_{n\to\infty} \|T_n\|$

**Proof.** $(T_n x)$ hội tụ nên bị chặn với mọi $x$, tức là pointwise bounded. Theo UBP: $M := \sup_n \|T_n\| < \infty$. $T$ tuyến tính (hiển nhiên). $\|Tx\| = \lim_n \|T_n x\| \leq M\|x\|$, nên $T \in B(X,Y)$. $\blacksquare$

> [!example] Example 4.7 — Phân kỳ của chuỗi Fourier (ứng dụng UBP)
> Đây là ứng dụng nổi tiếng: tồn tại hàm $f \in C[-\pi, \pi]$ sao cho chuỗi Fourier của $f$ phân kỳ tại $t = 0$.
>
> Xét toán tử $T_n: C[-\pi, \pi] \to \mathbb{R}$ định bởi $T_n(f) = S_n(f)(0)$ (tổng Fourier riêng phần thứ $n$ tại $0$). Tính toán cho thấy:
>
> $$
> \|T_n\| = \frac{1}{\pi}\int_{-\pi}^{\pi} |D_n(t)|\,dt \sim \frac{4}{\pi^2}\ln n \to \infty
> $$
>
> (với $D_n$ là Dirichlet kernel). Theo **đảo chiều của UBP**: nếu $\sup_n \|T_n\| = \infty$ và $X$ Banach, thì tồn tại $f \in X$ sao cho $\sup_n |T_n f| = \infty$ — nghĩa là $f$ gây phân kỳ.

> [!theorem] Theorem 4.8 — Nguyên lý đảo của UBP (Resonance Theorem)
> Cho $X$ Banach, $Y$ chuẩn, $(T_n) \subseteq B(X,Y)$ với $\sup_n \|T_n\| = \infty$. Khi đó tập:
>
> $$
> \{x \in X : \sup_n \|T_n x\| = \infty\}
> $$
>
> là **second category** trong $X$ (đặc biệt, nó không rỗng — thực ra là "lớn").

> [!example] Example 4.9 — Áp dụng UBP cho hội tụ yếu
> Nếu $x_n \xrightarrow{w} x$ (hội tụ yếu) trong không gian Banach $X$, thì dãy $(x_n)$ bị chặn: $\sup_n \|x_n\| < \infty$.
>
> **Proof**: Nhúng $X$ vào $X^{**}$ qua $\hat{x}(f) = f(x)$. Các $\hat{x}_n \in B(X^*, \mathbb{F})$ và pointwise bounded (vì $\hat{x}_n(f) = f(x_n) \to f(x)$ với mọi $f \in X^*$). Theo UBP: $\sup_n \|\hat{x}_n\|_{X^{**}} < \infty$, tức $\sup_n \|x_n\| < \infty$. $\blacksquare$

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt

# Minh họa phân kỳ chuỗi Fourier: tính ||T_n||
def dirichlet_norm(n):
    """Tính xấp xỉ ||T_n|| = (1/pi) * int |D_n(t)| dt"""
    t = np.linspace(-np.pi + 1e-10, np.pi - 1e-10, 10000)
    # Dirichlet kernel D_n(t) = sin((n+1/2)t) / sin(t/2)
    Dn = np.sin((n + 0.5) * t) / np.sin(t / 2)
    return np.trapz(np.abs(Dn), t) / np.pi

ns = [1, 5, 10, 20, 50, 100]
norms = [dirichlet_norm(n) for n in ns]
for n, norm in zip(ns, norms):
    approx = (4 / np.pi**2) * np.log(n) + 1  # asymptotic estimate
    print(f"n={n:3d}: ||T_n|| ≈ {norm:.4f}  (asymptotic ≈ {approx:.4f})")

# Tổng Fourier của f(t) = sign(t) tại 0 (Gibbs phenomenon)
def fourier_partial_sum(f_coeffs, t, N):
    result = np.zeros_like(t)
    for n in range(1, N+1, 2):  # chỉ hệ số lẻ cho sign(t)
        result += (4 / (np.pi * n)) * np.sin(n * t)
    return result
```

---

## Summary / Key Takeaways

- **Baire Category Theorem**: Không gian metric đầy đủ không thể là hợp đếm được của tập nowhere dense. Đây là "công cụ bí mật" của Functional Analysis.
- **Uniform Boundedness Principle**: Pointwise bounded $\Rightarrow$ uniformly bounded (khi $X$ Banach).
- **Banach–Steinhaus**: Giới hạn pointwise của dãy toán tử bị chặn vẫn là toán tử bị chặn.
- Đảo chiều: $\sup_n\|T_n\| = \infty$ thì tồn tại điểm gây "resonance" — chuỗi Fourier phân kỳ là ví dụ kinh điển.
- Hội tụ yếu bảo toàn tính bị chặn (corollary của UBP).

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 3.
- MIT 18.102, Lecture 3.
