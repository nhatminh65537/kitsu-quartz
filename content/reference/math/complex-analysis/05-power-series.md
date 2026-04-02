---
title: "05. Power Series"
tags: [math, complex-analysis, lesson-05]
aliases: [Power Series]
created: 2026-03-31
---

> **Prerequisites**: [[03-holomorphic-functions|03. Holomorphic Functions and Cauchy–Riemann Equations]], [[04-elementary-complex-functions|04. Elementary Complex Functions]]
> **Objectives**:
> - Hiểu sự hội tụ của chuỗi lũy thừa phức và bán kính hội tụ
> - Áp dụng công thức Hadamard tính bán kính hội tụ
> - Chứng minh chuỗi lũy thừa định nghĩa hàm holomorphic
> - Vi phân và tích phân chuỗi lũy thừa số hạng theo số hạng

---

## Motivation / Intuition

Chuỗi lũy thừa là công cụ trung tâm của phân tích phức: **mọi hàm holomorphic đều là chuỗi lũy thừa** (cục bộ). Đây là sự đối lập sâu sắc với giải tích thực — hàm $C^\infty$ thực **không** nhất thiết là chuỗi Taylor hội tụ.

Thêm vào đó, vùng hội tụ của chuỗi lũy thừa phức là một **đĩa** — kết quả sạch đẹp hơn nhiều so với khoảng hội tụ trong $\mathbb{R}$.

---

## Chuỗi Số Phức (Series of Complex Numbers)

### Definition

> [!info] Definition 5.1 — Hội tụ chuỗi
> Chuỗi $\sum_{n=0}^\infty a_n$ ($a_n \in \mathbb{C}$) **hội tụ** nếu dãy tổng riêng $S_N = \sum_{n=0}^N a_n$ hội tụ trong $\mathbb{C}$. Chuỗi **hội tụ tuyệt đối** nếu $\sum_{n=0}^\infty |a_n| < \infty$.

> [!abstract] Theorem 5.2 — Hội tụ tuyệt đối kéo theo hội tụ
> Nếu $\sum |a_n| < \infty$ thì $\sum a_n$ hội tụ và $\left|\sum_{n=0}^\infty a_n\right| \leq \sum_{n=0}^\infty |a_n|$.

> [!abstract] Theorem 5.3 — Tiêu chuẩn M của Weierstrass
> Cho $f_n: \Omega \to \mathbb{C}$ và $\sum M_n < \infty$ với $M_n \geq 0$. Nếu $|f_n(z)| \leq M_n$ với mọi $z \in \Omega$ và mọi $n$, thì $\sum f_n$ hội tụ đều tuyệt đối trên $\Omega$.

---

## Chuỗi Lũy Thừa (Power Series)

### Definition

> [!info] Definition 5.4 — Chuỗi lũy thừa
> **Chuỗi lũy thừa** tâm $z_0$:
>
> $$f(z) = \sum_{n=0}^\infty a_n (z - z_0)^n, \quad a_n \in \mathbb{C}$$
>
> **Bán kính hội tụ** (radius of convergence) $R \in [0, +\infty]$ được xác định bởi chuỗi hội tụ tuyệt đối với $|z - z_0| < R$ và phân kỳ với $|z - z_0| > R$.

> [!abstract] Theorem 5.5 — Công thức Hadamard (Hadamard's Formula)
> Bán kính hội tụ của $\sum a_n(z-z_0)^n$ là:
>
> $$R = \frac{1}{\limsup_{n\to\infty} |a_n|^{1/n}}$$
>
> (quy ước $1/0 = +\infty$ và $1/\infty = 0$).

**Proof.** Áp dụng tiêu chuẩn Cauchy (root test): $\sum a_n(z-z_0)^n$ hội tụ tuyệt đối khi $\limsup|a_n(z-z_0)^n|^{1/n} = |z-z_0|\limsup|a_n|^{1/n} < 1$, tức $|z-z_0| < R$. $\blacksquare$

> [!abstract] Theorem 5.6 — Hội tụ đều trên đĩa compact
> Nếu $R > 0$, chuỗi $\sum a_n(z-z_0)^n$ hội tụ **đều tuyệt đối** trên mọi đĩa đóng $\overline{D}(z_0, r)$ với $r < R$.

**Proof.** Với $|z - z_0| \leq r < R$, chọn $s \in (r, R)$. Có $|a_n|r^n \leq |a_n|s^n \cdot (r/s)^n$. Vì $\sum |a_n|s^n$ hội tụ và $r/s < 1$, dùng Weierstrass M-test. $\blacksquare$

> [!example] Example 5.7 — Chuỗi hình học phức
> $\sum_{n=0}^\infty z^n = \frac{1}{1-z}$ với $|z| < 1$.
>
> Công thức Hadamard: $\limsup |1|^{1/n} = 1$, nên $R = 1$. Trên $|z| = 1$, chuỗi phân kỳ (trừ $z = 1$ thì hiển nhiên).

> [!example] Example 5.8 — Bán kính hội tụ
> - $\sum n! \, z^n$: $\limsup(n!)^{1/n} = +\infty$, nên $R = 0$ (chỉ hội tụ tại $z=0$).
> - $\sum \frac{z^n}{n!}$: $\limsup(1/n!)^{1/n} = 0$, nên $R = +\infty$ (entire).
> - $\sum n^2 z^n$: $\limsup(n^2)^{1/n} = 1$, nên $R = 1$.

---

## Chuỗi Lũy Thừa Xác Định Hàm Holomorphic

> [!abstract] Theorem 5.9 — Chuỗi lũy thừa là holomorphic
> Cho $f(z) = \sum_{n=0}^\infty a_n(z-z_0)^n$ có bán kính hội tụ $R > 0$. Thì $f$ **holomorphic** trên $D(z_0, R)$ và:
>
> $$f'(z) = \sum_{n=1}^\infty n a_n (z-z_0)^{n-1}$$
>
> Chuỗi đạo hàm cũng có bán kính hội tụ $R$ (giống chuỗi gốc).

**Proof (phác thảo).** Đặt $g(z) = \sum n a_n(z-z_0)^{n-1}$. Cần chứng minh $\lim_{h\to 0}\frac{f(z+h)-f(z)}{h} = g(z)$. Viết:

$$\frac{f(z+h) - f(z)}{h} - g(z) = \sum_{n=1}^\infty a_n \frac{(z+h-z_0)^n - (z-z_0)^n}{h} - na_n(z-z_0)^{n-1}$$

Mỗi số hạng là đa thức trong $h$ không có hằng số; dùng hội tụ đều (Weierstrass) để đổi giới hạn và chuỗi. $\blacksquare$

> [!tip] Key Insight 5.10 — Hệ quả cực mạnh
> Vì đạo hàm của chuỗi lũy thừa vẫn là chuỗi lũy thừa với cùng bán kính hội tụ, suy ra hàm holomorphic được định nghĩa bởi chuỗi lũy thừa **khả vi vô hạn lần** ($C^\infty$). Đây là bước đầu để chứng minh: holomorphic $\Leftrightarrow$ analytic.

> [!abstract] Corollary 5.11 — Các hệ số Taylor
> Nếu $f(z) = \sum_{n=0}^\infty a_n(z-z_0)^n$ thì:
>
> $$a_n = \frac{f^{(n)}(z_0)}{n!}$$

**Proof.** Vi phân $n$ lần và cho $z = z_0$: $f^{(n)}(z_0) = n! a_n$. $\blacksquare$

---

## Khai Triển Taylor của Các Hàm Cơ Bản

> [!example] Example 5.12 — Khai triển Taylor
>
> **Hàm mũ** ($R = \infty$):
>
> $$e^z = \sum_{n=0}^\infty \frac{z^n}{n!} = 1 + z + \frac{z^2}{2!} + \frac{z^3}{3!} + \cdots$$
>
> **Sine và Cosine** ($R = \infty$):
>
> $$\sin z = \sum_{n=0}^\infty \frac{(-1)^n z^{2n+1}}{(2n+1)!}, \qquad \cos z = \sum_{n=0}^\infty \frac{(-1)^n z^{2n}}{(2n)!}$$
>
> **Hình học** ($R = 1$):
>
> $$\frac{1}{1-z} = \sum_{n=0}^\infty z^n$$
>
> $$\frac{1}{(1-z)^2} = \sum_{n=1}^\infty n z^{n-1}$$
>
> **Logarithm** ($R = 1$, tâm $z_0 = 0$, trên $D(0,1)$):
>
> $$\operatorname{Log}(1+z) = \sum_{n=1}^\infty \frac{(-1)^{n-1}}{n} z^n = z - \frac{z^2}{2} + \frac{z^3}{3} - \cdots$$

---

## Định Lý Abel (Abel's Theorem)

> [!abstract] Theorem 5.13 — Abel's Theorem
> Nếu $\sum_{n=0}^\infty a_n$ hội tụ đến $S$, thì:
>
> $$\lim_{r \to 1^-} \sum_{n=0}^\infty a_n r^n = S$$
>
> Tổng quát hơn: nếu $\sum a_n(z-z_0)^n$ hội tụ tại một điểm $z_1$ trên biên vòng hội tụ, thì hàm $f$ liên tục tại $z_1$ theo hướng từ tâm ra.

> [!example] Example 5.14 — Ứng dụng Abel's Theorem
> Chuỗi $\sum_{n=0}^\infty \frac{(-1)^n}{n+1} z^{n+1} = \operatorname{Log}(1+z)$ hội tụ tại $z = 1$ (chuỗi xen kẽ). Abel's Theorem cho:
>
> $$\operatorname{Log}(2) = \lim_{z \to 1^-}\operatorname{Log}(1+z) = \sum_{n=0}^\infty \frac{(-1)^n}{n+1} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots$$

---

## Tích Phân Số Hạng theo Số Hạng

> [!abstract] Theorem 5.15 — Tích phân chuỗi lũy thừa
> Nếu $f(z) = \sum_{n=0}^\infty a_n(z-z_0)^n$ trên $D(z_0, R)$ và $\gamma \subset D(z_0, R)$ là contour, thì:
>
> $$\int_\gamma f(z)\,dz = \sum_{n=0}^\infty a_n \int_\gamma (z-z_0)^n\,dz$$

Đây là hệ quả của hội tụ đều (cho phép đổi tích phân và tổng vô hạn).

---

## SageMath Cheatsheet

```python
# Chuỗi lũy thừa trong SageMath
z = var('z')

# Khai triển Taylor tại z0 = 0, bậc n
taylor(exp(z), z, 0, 8)
taylor(sin(z), z, 0, 7)
taylor(log(1+z), z, 0, 6)

# Bán kính hội tụ — ước lượng từ hệ số
a = [1/factorial(n) for n in range(20)]       # hệ số của e^z
R_inv = max(abs(an)^(1/n) for n, an in enumerate(a) if n > 0)
print("R =", 1/R_inv)   # R ≈ ∞

# Chuỗi lũy thừa số trị trong Python
import numpy as np

def power_series(coeffs, z, z0=0):
    """Tính tổng chuỗi sum_{n} coeffs[n]*(z-z0)^n"""
    result = 0
    for n, a in enumerate(coeffs):
        result += a * (z - z0)**n
    return result

# So sánh với hàm thực
N = 20
coeffs_exp = [1/np.math.factorial(n) for n in range(N)]
z_test = 1 + 1j
approx = power_series(coeffs_exp, z_test)
exact = np.exp(z_test)
print(f"Xấp xỉ: {approx:.6f}, Chính xác: {exact:.6f}")
```

---

## Summary / Key Takeaways

- Chuỗi $\sum a_n(z-z_0)^n$ hội tụ tuyệt đối trong đĩa mở $D(z_0, R)$, phân kỳ ngoài đĩa đóng.
- Công thức Hadamard: $R = 1/\limsup|a_n|^{1/n}$.
- Chuỗi lũy thừa hội tụ đều trên mọi đĩa đóng con $\overline{D}(z_0, r)$, $r < R$.
- Trên đĩa hội tụ, chuỗi lũy thừa là **holomorphic** và có thể vi phân số hạng theo số hạng.
- Hệ số Taylor: $a_n = f^{(n)}(z_0)/n!$.
- Abel's Theorem: tính liên tục tại biên từ trong ra.
- Vi phân và tích phân số hạng theo số hạng hợp lệ trong đĩa hội tụ.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 2, §2; Chapter 5, §1.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 1, §2.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 3.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 10.
