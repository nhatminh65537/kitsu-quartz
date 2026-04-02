---
title: "15. The Riemann Zeta Function"
tags: [math, complex-analysis, lesson-15]
aliases: [The Riemann Zeta Function]
created: 2026-03-31
---

> **Prerequisites**: [[14-entire-meromorphic-functions|14. Entire and Meromorphic Functions]]
> **Objectives**:
> - Định nghĩa $\zeta(s)$ và tích Euler, hiểu sự hội tụ
> - Tiếp tục giải tích $\zeta$ sang toàn $\mathbb{C}$
> - Chứng minh phương trình hàm (functional equation)
> - Hiểu phân bố zero của $\zeta$ và giả thuyết Riemann
> - Kết nối với định lý số nguyên tố (Prime Number Theorem)

---

## Motivation / Intuition

Hàm zeta Riemann $\zeta(s) = \sum_{n=1}^\infty \frac{1}{n^s}$ có vẻ là một chuỗi số đơn giản, nhưng ẩn chứa thông tin sâu sắc về **phân bố các số nguyên tố**. Riemann (1859) nhận ra rằng: thông qua **tiếp tục giải tích** sang toàn $\mathbb{C}$, các **zero** của $\zeta$ kiểm soát chính xác cách các số nguyên tố phân bố.

Tất cả công cụ đã học — chuỗi Dirichlet, tích vô hạn, tiếp tục giải tích, phương trình hàm, định lý thặng dư — hội tụ vào bài học cuối cùng này.

---

## Định Nghĩa Và Hội Tụ

### Definition

> [!info] Definition 15.1 — Hàm zeta Riemann
> Với $s = \sigma + it \in \mathbb{C}$, $\operatorname{Re}(s) > 1$:
>
> $$\zeta(s) = \sum_{n=1}^\infty \frac{1}{n^s}$$
>
> Ở đây $n^s = e^{s\ln n}$ (với $\ln n > 0$ thực).

> [!abstract] Theorem 15.2 — Hội tụ tuyệt đối
> $\sum n^{-s}$ hội tụ tuyệt đối và đồng đều trên $\{\operatorname{Re}(s) \geq 1+\varepsilon\}$ với mọi $\varepsilon > 0$. Do đó $\zeta(s)$ holomorphic trên $\{\operatorname{Re}(s) > 1\}$.

**Proof.** $|n^{-s}| = n^{-\sigma} \leq n^{-(1+\varepsilon)}$, và $\sum n^{-(1+\varepsilon)} < \infty$. Weierstrass M-test. $\blacksquare$

---

## Tích Euler (Euler Product)

> [!abstract] Theorem 15.3 — Tích Euler (Euler Product Formula)
> Với $\operatorname{Re}(s) > 1$:
>
> $$\zeta(s) = \prod_{p \text{ nguyên tố}} \frac{1}{1 - p^{-s}}$$

**Proof.** Từ khai triển hình học $\frac{1}{1-p^{-s}} = 1 + p^{-s} + p^{-2s} + \cdots$ và Định lý Phân tích Duy nhất (mọi số nguyên tố đều phân tích thành nhân tử nguyên tố theo một cách duy nhất):

$$\prod_p \frac{1}{1-p^{-s}} = \sum_{n=1}^\infty n^{-s} = \zeta(s) \quad \blacksquare$$

> [!abstract] Corollary 15.4 — Vô hạn số nguyên tố (Euler)
> $\zeta(1) = +\infty$ (chuỗi harmonic phân kỳ). Từ tích Euler: nếu chỉ có hữu hạn số nguyên tố, tích sẽ hữu hạn, mâu thuẫn. Vậy có **vô hạn số nguyên tố**.

---

## Tiếp Tục Giải Tích (Analytic Continuation)

> [!abstract] Theorem 15.5 — Mở rộng sang $\operatorname{Re}(s) > 0$
> Định nghĩa **chuỗi Dirichlet xen kẽ**:
>
> $$\eta(s) = \sum_{n=1}^\infty \frac{(-1)^{n-1}}{n^s} = 1 - \frac{1}{2^s} + \frac{1}{3^s} - \cdots$$
>
> Chuỗi này hội tụ với $\operatorname{Re}(s) > 0$. Liên hệ: $\eta(s) = (1 - 2^{1-s})\zeta(s)$, nên:
>
> $$\zeta(s) = \frac{\eta(s)}{1 - 2^{1-s}}, \quad \operatorname{Re}(s) > 0, s \neq 1$$
>
> Điều này mở rộng $\zeta$ là hàm meromorphic sang $\operatorname{Re}(s) > 0$ với cực đơn tại $s = 1$.

**Proof.** Từ $\zeta(s) - 2\cdot 2^{-s}\zeta(s) = \eta(s)$: $\zeta(s)(1-2^{1-s}) = \eta(s)$. Vì $\eta$ holomorphic với $\operatorname{Re}(s)>0$, $\zeta$ meromorphic. Cực tại $1-2^{1-s}=0$, tức $s=1+2\pi i k/\ln 2$; kiểm tra: chỉ $s=1$ thực sự là cực. $\blacksquare$

> [!abstract] Theorem 15.6 — Tiếp tục sang toàn $\mathbb{C}$ và phương trình hàm
> $\zeta(s)$ mở rộng thành hàm **meromorphic** trên toàn $\mathbb{C}$, với cực đơn duy nhất tại $s = 1$ với thặng dư $1$. Hơn nữa, hàm hoàn chỉnh (completed zeta function):
>
> $$\xi(s) = \frac{1}{2}s(s-1)\pi^{-s/2}\Gamma\!\left(\frac{s}{2}\right)\zeta(s)$$
>
> là hàm entire thỏa **phương trình hàm** (functional equation):
>
> $$\xi(s) = \xi(1-s)$$
>
> Tương đương:
>
> $$\zeta(s) = 2^s\pi^{s-1}\sin\!\left(\frac{\pi s}{2}\right)\Gamma(1-s)\zeta(1-s)$$

**Proof (phác thảo).** Từ tích phân Mellin của $\theta(x) = \sum_{n=1}^\infty e^{-\pi n^2 x}$ (liên hệ với hàm theta Jacobi) và phương trình hàm theta $\theta(1/x) = x^{1/2}\theta(x)$. Biến đổi tích phân $\pi^{-s/2}\Gamma(s/2)\zeta(s) = \int_0^\infty \theta(x)x^{s/2-1}dx$ và dùng tính đối xứng. $\blacksquare$

---

## Zero Của Hàm Zeta

### Definition

> [!info] Definition 15.7 — Phân loại zero của $\zeta$
> **Zero tầm thường** (trivial zeros): $\zeta(-2n) = 0$ với $n = 1, 2, 3, \ldots$ (từ $\sin(\pi s/2) = 0$ trong phương trình hàm, tại $s = -2, -4, -6, \ldots$).
>
> **Zero không tầm thường** (non-trivial zeros): các $\rho$ với $0 \leq \operatorname{Re}(\rho) \leq 1$ (dải tới hạn / critical strip).

> [!abstract] Theorem 15.8 — Đối xứng của zero
> Nếu $\rho$ là zero không tầm thường, thì $1-\rho$, $\bar\rho$, và $1-\bar\rho$ cũng là zero. Do đó các zero xuất hiện thành nhóm 4 (hoặc 2 nếu nằm trên đường tới hạn $\operatorname{Re}(s) = 1/2$).

> [!note] Remark 15.9 — Giả thuyết Riemann (Riemann Hypothesis)
> Mọi zero không tầm thường của $\zeta(s)$ đều có $\operatorname{Re}(s) = 1/2$.
>
> Đây là bài toán mở nổi tiếng nhất trong toán học, đề xuất năm 1859, được xác nhận số trị cho hơn $10^{13}$ zero đầu tiên, và là một trong 7 Bài Toán Thiên Niên Kỷ (Millennium Prize Problems) với giải thưởng $1,000,000 USD.

---

## Kết Nối Với Số Nguyên Tố

> [!info] Definition 15.10 — Hàm đếm số nguyên tố
> $\pi(x) = \#\{p \text{ nguyên tố} : p \leq x\}$.

> [!abstract] Theorem 15.11 — Định lý Số Nguyên Tố (Prime Number Theorem)
> $$\pi(x) \sim \frac{x}{\ln x} \quad \text{khi } x \to \infty$$
>
> Tương đương: $\pi(x) = \operatorname{Li}(x) + O(xe^{-c\sqrt{\ln x}})$ với $\operatorname{Li}(x) = \int_2^x \frac{dt}{\ln t}$.

**Bằng chứng phân tích phức.** Chứng minh (Hadamard & de la Vallée-Poussin, 1896) dùng:
1. Tích Euler: $-\frac{\zeta'(s)}{\zeta(s)} = \sum_p \frac{\ln p \cdot p^{-s}}{1-p^{-s}} = \sum_{n=1}^\infty \Lambda(n)n^{-s}$ (hàm Mangoldt $\Lambda$).
2. Công thức Perron: $\psi(x) = \sum_{p^k \leq x}\ln p = \frac{1}{2\pi i}\int_{c-i\infty}^{c+i\infty}\!\!\left(-\frac{\zeta'(s)}{\zeta(s)}\right)\frac{x^s}{s}\,ds$.
3. Chứng minh $\zeta(1+it) \neq 0$ với $t \neq 0$ (dùng bất đẳng thức $3+4\cos\theta+\cos 2\theta \geq 0$).
4. Dịch chuyển contour tích phân để thu hút thặng dư tại $s = 1$: $\psi(x) \sim x$, suy ra $\pi(x) \sim x/\ln x$.

> [!note] Remark 15.12 — Nếu Giả thuyết Riemann đúng
> GH Riemann $\Rightarrow$ sai số tốt nhất: $\pi(x) = \operatorname{Li}(x) + O(\sqrt{x}\ln x)$.
>
> Các zero không tầm thường $\rho$ đóng góp vào sai số qua công thức:
>
> $$\psi(x) = x - \sum_\rho \frac{x^\rho}{\rho} - \ln(2\pi) - \frac{1}{2}\ln\!\left(1 - x^{-2}\right)$$

---

## SageMath Cheatsheet

```python
# Hàm zeta trong SageMath / Python
from mpmath import mp, zeta, gamma, pi, sin, log, inf
import numpy as np

mp.dps = 50  # 50 chữ số thập phân

# Giá trị tại các điểm đặc biệt
print(f"ζ(2) = {zeta(2):.10f} = π²/6 = {float(pi**2/6):.10f}")
print(f"ζ(4) = {zeta(4):.10f} = π⁴/90 = {float(pi**4/90):.10f}")
print(f"ζ(-1) = {zeta(-1):.10f}")  # = -1/12 (tiếp tục giải tích!)
print(f"ζ(0)  = {zeta(0):.10f}")   # = -1/2

# Zero đầu tiên (không tầm thường) ~ 1/2 + 14.134...i
from mpmath import zetazero
rho_1 = zetazero(1)
print(f"\nZero thứ 1 của ζ: {rho_1}")
print(f"Re(ρ₁) = {float(rho_1.real):.10f} (giả thuyết: = 0.5)")

# Tích Euler: tính ζ(s) qua các số nguyên tố
def euler_product(s, primes_up_to=1000):
    """ζ(s) ≈ prod_{p prime, p ≤ N} 1/(1-p^{-s})"""
    from sympy import primerange
    result = 1.0 + 0j
    for p in primerange(2, primes_up_to + 1):
        result *= 1 / (1 - p**(-s))
    return result

s = 2.0
euler_approx = euler_product(s)
exact = np.pi**2 / 6
print(f"\nTích Euler ζ(2) xấp xỉ: {euler_approx.real:.6f}, chính xác: {exact:.6f}")

# Phương trình hàm: ζ(s) = 2^s π^{s-1} sin(πs/2) Γ(1-s) ζ(1-s)
from mpmath import zeta, gamma, pi, sin, power, mpf
s_val = mpf('0.3') + mpf('0.7')*1j
lhs = zeta(s_val)
rhs = (2**s_val) * (pi**(s_val-1)) * sin(pi*s_val/2) * gamma(1 - s_val) * zeta(1 - s_val)
print(f"\nPhương trình hàm: |ζ(s) - RHS| = {abs(lhs - rhs):.2e}")

# Vẽ |ζ(1/2 + it)| — đường tới hạn
import matplotlib.pyplot as plt
t_vals = np.linspace(0, 40, 1000)
s_vals = [0.5 + 1j*t for t in t_vals]
zeta_vals = [complex(zeta(s)) for s in s_vals]
mods = np.abs(zeta_vals)

plt.figure(figsize=(12, 4))
plt.plot(t_vals, mods, 'b-', linewidth=0.8)
plt.axhline(0, color='r', linestyle='--', alpha=0.5)
plt.xlabel('t')
plt.ylabel('|ζ(1/2 + it)|')
plt.title('Hàm zeta trên đường tới hạn Re(s) = 1/2')
# Đánh dấu các zero đầu tiên
zero_ts = [14.134, 21.022, 25.011, 30.425, 32.935]
for t0 in zero_ts:
    plt.axvline(t0, color='g', linestyle=':', alpha=0.7)
plt.tight_layout()
plt.show()
```

---

## Summary / Key Takeaways

- $\zeta(s) = \sum n^{-s}$ holomorphic với $\operatorname{Re}(s) > 1$; tích Euler $= \prod_p(1-p^{-s})^{-1}$.
- Tiếp tục giải tích: $\zeta$ meromorphic trên $\mathbb{C}$, cực đơn tại $s=1$ với thặng dư $1$.
- **Phương trình hàm**: $\xi(s) = \xi(1-s)$; các zero đối xứng qua $\operatorname{Re}(s) = 1/2$.
- **Zero tầm thường**: $s = -2, -4, -6, \ldots$; **zero không tầm thường**: $0 < \operatorname{Re}(s) < 1$.
- **Giả thuyết Riemann**: tất cả zero không tầm thường trên $\operatorname{Re}(s) = 1/2$ — bài toán mở lớn nhất toán học.
- **Định lý Số Nguyên Tố**: $\pi(x) \sim x/\ln x$, chứng minh dùng $\zeta(1+it) \neq 0$.
- Kết nối: các zero $\rho$ của $\zeta$ kiểm soát sai số trong phân bố số nguyên tố.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 5, §4.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 6; *Fourier Analysis*, Chapter 8.
- Davenport, H. *Multiplicative Number Theory* (3rd ed.), Chapters 1–13.
- Riemann, B. *Über die Anzahl der Primzahlen unter einer gegebenen Größe* (1859).
- Edwards, H. M. *Riemann's Zeta Function* (Dover), comprehensive treatment.
