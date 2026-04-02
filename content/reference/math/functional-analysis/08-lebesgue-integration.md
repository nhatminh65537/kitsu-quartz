---
title: "08. Lebesgue Integration"
tags: [math, functional-analysis, lesson-08]
aliases: [Lebesgue Integration]
created: 2026-03-31
---

> **Prerequisites**: [[07-lebesgue-measure|07. Lebesgue Measure]]
> **Objectives**:
> - Xây dựng tích phân Lebesgue từng bước
> - Nắm vững ba định lý hội tụ: MCT, Fatou, DCT
> - Hiểu sự khác biệt với tích phân Riemann

---

## Motivation / Intuition

Tích phân Riemann chia trục $x$ (miền) thành các đoạn nhỏ. Tích phân Lebesgue chia trục $y$ (giá trị) thành các mức. Điều này nghe có vẻ nhỏ nhoi, nhưng dẫn đến sự khác biệt sâu sắc: Lebesgue tích phân được hầu hết các hàm cần thiết trong giải tích, và quan trọng nhất — **có những định lý hội tụ mạnh mẽ** không có trong lý thuyết Riemann.

---

## Xây dựng tích phân Lebesgue

### Bước 1 — Tích phân của simple functions

> [!definition] Definition 8.1 — Tích phân của simple function
> Cho $s = \sum_{k=1}^n c_k \mathbf{1}_{E_k}$ với $E_k \in \mathcal{L}$ rời nhau từng đôi và $c_k \geq 0$. Định nghĩa:
>
> $$
> \int s \, dm = \sum_{k=1}^n c_k \cdot m(E_k)
> $$
>
> (Quy ước: $0 \cdot \infty = 0$)

### Bước 2 — Tích phân của hàm không âm đo được

> [!definition] Definition 8.2 — Tích phân Lebesgue của hàm không âm
> Cho $f: \mathbb{R} \to [0, +\infty]$ đo được. Định nghĩa:
>
> $$
> \int f \, dm = \sup\left\{\int s \, dm : s \text{ simple}, \ 0 \leq s \leq f\right\}
> $$

### Bước 3 — Tích phân của hàm tổng quát

> [!definition] Definition 8.3 — Tích phân Lebesgue tổng quát
> Phân tách $f = f^+ - f^-$ với $f^+ = \max(f,0)$ và $f^- = \max(-f,0)$.
>
> $f$ gọi là **Lebesgue tích phân được** (hay $f \in L^1$) nếu cả $\int f^+ dm$ và $\int f^- dm$ đều hữu hạn. Khi đó:
>
> $$
> \int f \, dm = \int f^+ \, dm - \int f^- \, dm
> $$
>
> **Tích phân trên tập con**: $\int_E f \, dm = \int f \cdot \mathbf{1}_E \, dm$.

---

## Tính chất cơ bản

> [!theorem] Theorem 8.4 — Tính tuyến tính và đơn điệu
> Với $f, g$ tích phân được và $\alpha, \beta \in \mathbb{R}$:
>
> 1. **Tuyến tính**: $\int (\alpha f + \beta g) dm = \alpha \int f dm + \beta \int g dm$
> 2. **Đơn điệu**: $f \leq g$ a.e. $\implies \int f dm \leq \int g dm$
> 3. **Tam giác**: $\left|\int f dm\right| \leq \int |f| dm$
> 4. **Zero a.e.**: $f = 0$ a.e. $\implies \int f dm = 0$ (và ngược lại: nếu $f \geq 0$ và $\int f dm = 0$ thì $f = 0$ a.e.)

---

## Ba Định lý Hội tụ Vĩ đại

### Monotone Convergence Theorem (MCT)

> [!theorem] Theorem 8.5 — Monotone Convergence Theorem (MCT)
> Cho $(f_n)$ là dãy hàm đo được thỏa $0 \leq f_1 \leq f_2 \leq \cdots$ a.e. Đặt $f = \lim_n f_n$. Khi đó:
>
> $$
> \lim_{n \to \infty} \int f_n \, dm = \int f \, dm
> $$
>
> (kể cả khi cả hai vế đều bằng $+\infty$).

**Proof sketch.** Theo tính đơn điệu của tích phân, $\int f_n dm$ tăng, nên $\lim_n \int f_n dm$ tồn tại (có thể $= \infty$). Gọi $L = \lim_n \int f_n dm$.

Rõ $L \leq \int f dm$ (do $f_n \leq f$ a.e.). Chiều ngược: với mọi simple $s$ với $0 \leq s \leq f$ và $c \in (0,1)$, tập $E_n = \{f_n \geq cs\}$ tăng dần lên $\mathbb{R}$. Vậy $\int_{E_n} cs \, dm \leq \int f_n dm \leq L$. Cho $n \to \infty$ rồi $c \to 1$: $\int s dm \leq L$. Lấy sup trên $s$: $\int f dm \leq L$. $\blacksquare$

> [!corollary] Corollary 8.6 — Chuỗi tích phân không âm
> Nếu $f_n \geq 0$ đo được, thì:
>
> $$
> \int \sum_{n=1}^\infty f_n \, dm = \sum_{n=1}^\infty \int f_n \, dm
> $$

### Bổ đề Fatou

> [!theorem] Theorem 8.7 — Fatou's Lemma
> Cho $(f_n)$ là dãy hàm đo được không âm. Khi đó:
>
> $$
> \int \liminf_{n\to\infty} f_n \, dm \leq \liminf_{n\to\infty} \int f_n \, dm
> $$

**Proof.** Đặt $g_k = \inf_{n \geq k} f_n$. Thì $g_k \leq f_k$ và $g_k \nearrow \liminf f_n$. Theo MCT: $\int \liminf f_n dm = \lim_k \int g_k dm \leq \liminf_k \int f_k dm$. $\blacksquare$

> [!warning] Counterexample 8.8 — Bất đẳng thức trong Fatou có thể chặt
> Dãy $f_n = \mathbf{1}_{[n, n+1]}$ trên $\mathbb{R}$: $\int f_n dm = 1$ với mọi $n$, nhưng $f_n \to 0$ pointwise nên $\int \liminf f_n dm = 0 < 1 = \liminf \int f_n dm$.

### Dominated Convergence Theorem (DCT)

> [!theorem] Theorem 8.8 — Dominated Convergence Theorem (DCT)
> Cho $(f_n)$ là dãy hàm đo được thỏa $f_n \to f$ a.e. và tồn tại $g \in L^1$ sao cho $|f_n| \leq g$ a.e. với mọi $n$. Khi đó $f \in L^1$ và:
>
> $$
> \lim_{n \to \infty} \int f_n \, dm = \int f \, dm
> $$
>
> Mạnh hơn: $\int |f_n - f| dm \to 0$.

**Proof.** Áp dụng Fatou cho $g + f_n \geq 0$ và $g - f_n \geq 0$:

$$
\int (g + f) dm \leq \liminf_n \int (g + f_n) dm \implies \int f dm \leq \liminf_n \int f_n dm
$$

$$
\int (g - f) dm \leq \liminf_n \int (g - f_n) dm \implies -\int f dm \leq \liminf_n\left(-\int f_n dm\right)
$$

Kết hợp: $\limsup_n \int f_n dm \leq \int f dm \leq \liminf_n \int f_n dm$. $\blacksquare$

---

## So sánh Riemann và Lebesgue

> [!theorem] Theorem 8.9 — Quan hệ giữa Riemann và Lebesgue
> Nếu $f: [a,b] \to \mathbb{R}$ **Riemann tích phân được**, thì $f$ Lebesgue tích phân được và:
>
> $$
> \int_a^b f(x) dx \text{ (Riemann)} = \int_{[a,b]} f \, dm \text{ (Lebesgue)}
> $$
>
> Hơn nữa, $f$ Riemann tích phân được trên $[a,b]$ khi và chỉ khi $f$ bị chặn và liên tục a.e. trên $[a,b]$.

> [!example] Example 8.10 — Hàm Dirichlet: Lebesgue nhưng không Riemann
> $f = \mathbf{1}_{\mathbb{Q}}: [0,1] \to \mathbb{R}$ (bằng 1 tại hữu tỉ, 0 tại vô tỉ). $f$ không Riemann tích phân được (tổng Darboux trên/dưới không bằng nhau). Nhưng $f = 0$ a.e. (vì $m(\mathbb{Q}) = 0$), nên:
>
> $$
> \int_{[0,1]} f \, dm = 0
> $$

---

## Fubini và Tonelli

> [!theorem] Theorem 8.11 — Tonelli's Theorem
> Nếu $f: \mathbb{R}^m \times \mathbb{R}^n \to [0, +\infty]$ đo được, thì:
>
> $$
> \int_{\mathbb{R}^{m+n}} f \, d(m \otimes n) = \int_{\mathbb{R}^m}\left(\int_{\mathbb{R}^n} f(x, y) \, dy\right) dx = \int_{\mathbb{R}^n}\left(\int_{\mathbb{R}^m} f(x, y) \, dx\right) dy
> $$

> [!theorem] Theorem 8.12 — Fubini's Theorem
> Nếu $f \in L^1(\mathbb{R}^{m+n})$, thì tích phân lặp bằng tích phân kép (các tích phân trong đều tồn tại a.e.).

---

## SageMath Cheatsheet

```python
import numpy as np
from scipy import integrate

# Minh họa DCT: tích phân giao hoán với giới hạn
# f_n(x) = n * x^n * (1-x) trên [0,1], bị chặn bởi g(x) = e^(-x) (giả sử)
# f_n -> 0 pointwise (có thể kiểm tra)

def f_n(x, n):
    return n * x**n * (1 - x)

# Tích phân của f_n (phân tích: int_0^1 n*x^n*(1-x)dx = n/(n+1) - n/(n+2))
def integral_fn(n):
    return n/(n+1) - n/(n+2)

for n in [1, 5, 10, 50, 100]:
    val, _ = integrate.quad(f_n, 0, 1, args=(n,))
    analytic = integral_fn(n)
    print(f"n={n:3d}: int f_n = {val:.6f}  (analytic = {analytic:.6f})")
print("Giới hạn: int f_n -> 0 (DCT: f_n -> 0 a.e., |f_n| <= g)")

# Kiểm tra định lý hội tụ đơn điệu (MCT)
# s_n(x) = min(f(x), n) với f(x) = 1/sqrt(x) trên (0,1]
def s_n(x, n):
    with np.errstate(divide='ignore', invalid='ignore'):
        f = np.where(x > 0, 1.0/np.sqrt(x), n)
    return np.minimum(f, n)

print("\nMCT: int min(1/sqrt(x), n) -> int 1/sqrt(x) = 2")
x = np.linspace(1e-6, 1, 100000)
for n in [5, 10, 50, 100, 1000]:
    val = np.trapz(s_n(x, n), x)
    print(f"  n={n:4d}: integral = {val:.6f}  (exact = 2.0)")
```

---

## Summary / Key Takeaways

- Tích phân Lebesgue xây dựng theo 3 bước: simple functions $\to$ hàm không âm $\to$ hàm tổng quát.
- **MCT**: dãy tăng không âm, tích phân và giới hạn giao hoán.
- **Fatou**: $\int \liminf f_n \leq \liminf \int f_n$ (không đảo chiều nói chung).
- **DCT**: hội tụ a.e. + bị chặn bởi $g \in L^1$ $\Rightarrow$ tích phân và giới hạn giao hoán.
- Lebesgue mở rộng Riemann: mọi hàm Riemann tích phân được đều Lebesgue tích phân được với cùng giá trị.
- Hàm Dirichlet: Lebesgue tích phân được (= 0) nhưng không Riemann tích phân được.
- Fubini/Tonelli: tích phân lặp và tích phân kép bằng nhau.

---

## References

- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 1–2.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapters 4–5.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 2.
- MIT 18.102, Lectures 8–13.
