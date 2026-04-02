---
title: "14. Entire and Meromorphic Functions"
tags: [math, complex-analysis, lesson-14]
aliases: [Entire and Meromorphic Functions]
created: 2026-03-31
---

> **Prerequisites**: [[08-laurent-series-singularities|08. Laurent Series and Isolated Singularities]], [[13-analytic-continuation|13. Analytic Continuation and Monodromy]]
> **Objectives**:
> - Hiểu tích vô hạn (infinite products) và tiêu chuẩn hội tụ
> - Nắm Định lý Nhân tử hóa Weierstrass và biểu diễn hàm entire qua zeros
> - Định lý Hadamard cho hàm entire bậc hữu hạn
> - Định lý Mittag-Leffler: tổng hàm meromorphic
> - Hàm Gamma $\Gamma(z)$ và tính chất quan trọng

---

## Motivation / Intuition

Định lý Cơ bản Đại số: đa thức được xác định (sai hằng số) bởi tập zeros của nó. Hàm entire có thể có **vô hạn zeros** — liệu nó vẫn được xác định bởi zeros không? Câu trả lời là **Có**, đó là nội dung của Định lý Weierstrass: mọi hàm entire đều viết được dưới dạng tích vô hạn từ zeros của nó.

Song song, Mittag-Leffler giải quyết bài toán "đối ngẫu": cho trước hệ số cực, xây dựng hàm meromorphic có đúng những cực đó.

---

## Tích Vô Hạn (Infinite Products)

### Definition

> [!info] Definition 14.1 — Hội tụ tích vô hạn
> Tích $\prod_{n=1}^\infty (1 + a_n)$ **hội tụ** (đến $P \neq 0$) nếu tổng riêng $P_N = \prod_{n=1}^N(1+a_n) \to P$.
>
> Tích **hội tụ tuyệt đối** nếu $\prod_{n=1}^\infty(1 + |a_n|)$ hội tụ.

> [!abstract] Theorem 14.2 — Tiêu chuẩn hội tụ
> $\prod(1+a_n)$ hội tụ tuyệt đối $\Leftrightarrow$ $\sum |a_n| < \infty$.

**Proof.** Dùng $\ln(1+a) = a + O(a^2)$ và tính $\sum \ln(1+|a_n|) \leq 2\sum|a_n|$ với $|a_n|$ nhỏ. $\blacksquare$

> [!abstract] Theorem 14.3 — Tích vô hạn của hàm holomorphic
> Nếu $f_n$ holomorphic trên $\Omega$ và $\sum_n |f_n(z) - 1|$ hội tụ đồng đều trên compact, thì $f = \prod f_n$ holomorphic trên $\Omega$, và:
>
> $$\frac{f'}{f} = \sum_{n=1}^\infty \frac{f_n'}{f_n}$$

---

## Nhân Tố Cơ Bản Weierstrass (Weierstrass Elementary Factors)

### Definition

> [!info] Definition 14.4 — Nhân tố cơ bản (Elementary Factors)
> Với $p \in \mathbb{N}_0$, **nhân tố cơ bản** Weierstrass:
>
> $$E_p(z) = \begin{cases} 1 - z & p = 0 \\ (1-z)\exp\!\left(z + \frac{z^2}{2} + \cdots + \frac{z^p}{p}\right) & p \geq 1 \end{cases}$$
>
> Tính chất: $E_p(0) = 1$, $E_p(1) = 0$, và với $|z| \leq 1$: $|E_p(z) - 1| \leq |z|^{p+1}$.

> [!abstract] Theorem 14.5 — Định lý Weierstrass Factorization
> Cho $f$ entire, $\{a_n\}$ là dãy zeros không triệt tiêu của $f$ (lặp theo bội), và $m \geq 0$ là bậc của zero tại $0$. Thì tồn tại hàm entire $g$ và dãy số nguyên $\{p_n\}$ sao cho:
>
> $$f(z) = z^m e^{g(z)} \prod_{n=1}^\infty E_{p_n}\!\left(\frac{z}{a_n}\right)$$
>
> Nếu chọn $p_n = n-1$ (hay bất kỳ dãy thỏa $\sum (r/|a_n|)^{p_n+1} < \infty$), tích hội tụ đồng đều trên compact.

**Proof (phác thảo).** Đặt $P(z) = \prod E_{p_n}(z/a_n)$. Vì $|E_p(z/a_n)-1| \leq |z/a_n|^{p_n+1}$, tiêu chuẩn Weierstrass M-test đảm bảo hội tụ đồng đều. $P$ là entire với đúng các zeros $a_n$. Thì $f/P$ là entire không triệt tiêu, viết $= e^g$. $\blacksquare$

> [!example] Example 14.6 — Weierstrass cho $\sin(\pi z)$
> $\sin(\pi z)$ có zeros tại $\mathbb{Z}$. Weierstrass cho:
>
> $$\sin(\pi z) = \pi z \prod_{n=1}^\infty \left(1 - \frac{z^2}{n^2}\right)$$
>
> (ở đây $E_1(z/n) \cdot E_1(-z/n) = (1-z/n)e^{z/n}(1+z/n)e^{-z/n} = 1-z^2/n^2$, và $g(z) = \ln\pi + \text{hằng}$).
>
> Hệ quả: $\zeta(2) = \frac{\pi^2}{6}$ (từ khai triển $\sin(\pi z)/(\pi z)$ và so sánh hệ số $z^2$).

> [!example] Example 14.7 — Hàm $\cos(\pi z)$
>
> $$\cos(\pi z) = \prod_{n=0}^\infty \left(1 - \frac{4z^2}{(2n+1)^2}\right)$$

---

## Định Lý Hadamard (Hadamard Factorization)

### Definition

> [!info] Definition 14.8 — Bậc tăng trưởng (Order of Growth)
> Hàm entire $f$ có **bậc** (order) $\rho$ nếu:
>
> $$\rho = \limsup_{r \to \infty} \frac{\ln\ln M(r)}{\ln r}, \quad M(r) = \max_{|z|=r}|f(z)|$$

> [!abstract] Theorem 14.9 — Định lý Hadamard Factorization
> Nếu $f$ entire bậc hữu hạn $\rho$, thì $g$ trong biểu diễn Weierstrass là **đa thức** bậc $\leq \rho$, và có thể chọn $p_n = \lfloor\rho\rfloor$ (gọi là **genus** của $f$):
>
> $$f(z) = z^m e^{Q(z)} \prod_{n=1}^\infty E_p\!\left(\frac{z}{a_n}\right)$$
>
> với $Q$ đa thức bậc $\leq \rho$ và $p = \lfloor\rho\rfloor$.

> [!example] Example 14.10 — Bậc của các hàm entire
> - $e^z$: bậc $1$ (vì $|e^z| = e^{\operatorname{Re}(z)} \leq e^r$).
> - $e^{z^2}$: bậc $2$ (vì $|e^{z^2}| \leq e^{r^2}$).
> - Đa thức bậc $n$: bậc $0$ (vì $|p(z)| \leq C r^n \ll e^{\varepsilon r}$).
> - $\sin(\pi z)$: bậc $1$ (vì $|\sin(\pi z)| \leq e^{\pi|z|}$).

---

## Định Lý Mittag-Leffler

> [!abstract] Theorem 14.11 — Định lý Mittag-Leffler (Mittag-Leffler Theorem)
> Cho $\{a_n\} \subset \mathbb{C}$ là dãy không có điểm tụ, và với mỗi $n$ cho trước đa thức chính $P_n(z)$ (phần chính của chuỗi Laurent). Thì tồn tại hàm meromorphic $f$ trên $\mathbb{C}$ với:
> - Cực đúng tại $\{a_n\}$
> - Phần chính tại $a_n$ là $P_n\!\left(\frac{1}{z-a_n}\right)$
>
> Hàm này có dạng:
>
> $$f(z) = \sum_{n=1}^\infty \left[P_n\!\left(\frac{1}{z-a_n}\right) - Q_n(z)\right]$$
>
> với $Q_n$ là đa thức chọn phù hợp để tổng hội tụ.

> [!example] Example 14.12 — Công thức phân tích từng phần của $\pi\cot(\pi z)$
> $\pi\cot(\pi z) = \frac{1}{z} + \sum_{n=1}^\infty\left(\frac{1}{z-n} + \frac{1}{z+n}\right) = \frac{1}{z} + \sum_{n \neq 0}\frac{1}{z-n}$
>
> (Mittag-Leffler với cực đơn tại mọi $n \in \mathbb{Z}$, thặng dư $1$.)

> [!example] Example 14.13 — Từ $\pi\cot$ đến $\zeta(2k)$
> Từ khai triển Laurent $\pi\cot(\pi z) = \frac{1}{z} - 2\sum_{k=1}^\infty \zeta(2k)z^{2k-1}$, kết hợp với công thức Mittag-Leffler, suy ra:
>
> $$\zeta(2) = \frac{\pi^2}{6}, \quad \zeta(4) = \frac{\pi^4}{90}, \quad \zeta(6) = \frac{\pi^6}{945}, \ldots$$

---

## Hàm Gamma $\Gamma(z)$

### Definition

> [!info] Definition 14.14 — Hàm Gamma
> **Hàm Gamma** (Euler's Gamma Function) định nghĩa:
>
> $$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}\,dt, \quad \operatorname{Re}(z) > 0$$
>
> Mở rộng bởi tiếp tục giải tích thành hàm meromorphic trên $\mathbb{C}$.

> [!abstract] Theorem 14.15 — Tính chất của $\Gamma$
>
> **Phương trình hàm**: $\Gamma(z+1) = z\Gamma(z)$ (nên $\Gamma(n) = (n-1)!$ với $n \in \mathbb{N}$)
>
> **Cực**: $\Gamma$ có cực đơn tại $z = 0, -1, -2, \ldots$ với $\operatorname{Res}(\Gamma, -n) = \frac{(-1)^n}{n!}$
>
> **Công thức phản chiếu Euler**: $\Gamma(z)\Gamma(1-z) = \frac{\pi}{\sin(\pi z)}$
>
> **Tích vô hạn Weierstrass**: $\frac{1}{\Gamma(z)} = ze^{\gamma z}\prod_{n=1}^\infty\left(1+\frac{z}{n}\right)e^{-z/n}$
>
> trong đó $\gamma = \lim_{n\to\infty}\left(\sum_{k=1}^n\frac{1}{k} - \ln n\right) \approx 0.5772$ là **hằng số Euler–Mascheroni**.

> [!example] Example 14.16 — Giá trị đặc biệt
> - $\Gamma(1) = 1$, $\Gamma(1/2) = \sqrt{\pi}$, $\Gamma(3/2) = \frac{\sqrt{\pi}}{2}$.
> - $\Gamma(n+1) = n!$ với $n \in \mathbb{N}_0$.
> - Công thức phản chiếu: $\Gamma(1/2)^2 = \pi$ (từ $\Gamma(1/2)\Gamma(1/2) = \pi/\sin(\pi/2) = \pi$).

---

## SageMath Cheatsheet

```python
# Tích vô hạn Weierstrass cho sin(pi*z)
import numpy as np

def sin_weierstrass(z, N=100):
    """sin(pi*z) = pi*z * prod_{n=1}^N (1 - z^2/n^2)"""
    result = np.pi * z
    for n in range(1, N+1):
        result *= (1 - z**2 / n**2)
    return result

# Kiểm tra
z_test = 0.5 + 0.3j
approx = sin_weierstrass(z_test)
exact = np.sin(np.pi * z_test)
print(f"Weierstrass sin(pi*0.5+0.3i): {approx:.6f}")
print(f"Chính xác:                     {exact:.6f}")

# Hàm Gamma trong SageMath
from scipy.special import gamma as gamma_scipy
import numpy as np

# Giá trị đặc biệt
print(f"Γ(1) = {gamma_scipy(1):.6f}")       # 1
print(f"Γ(0.5) = {gamma_scipy(0.5):.6f}")   # sqrt(pi)
print(f"Γ(5) = {gamma_scipy(5):.6f}")       # 4! = 24

# Kiểm tra phương trình hàm: Γ(z+1) = z*Γ(z)
z = 2.5 + 1j
from scipy.special import gamma as gam
lhs = gam(z + 1)
rhs = z * gam(z)
print(f"|Γ(z+1) - z*Γ(z)| = {abs(lhs - rhs):.2e}")  # ≈ 0

# Kiểm tra công thức phản chiếu: Γ(z)Γ(1-z) = π/sin(πz)
z_real = 0.3
lhs_refl = gam(z_real) * gam(1 - z_real)
rhs_refl = np.pi / np.sin(np.pi * z_real)
print(f"Reflection: Γ(z)Γ(1-z) = {lhs_refl:.6f}, π/sin(πz) = {rhs_refl:.6f}")

# Mittag-Leffler: pi*cot(pi*z) qua partial fractions
def pi_cot_ML(z, N=100):
    """pi*cot(pi*z) = 1/z + sum_{n=1}^N (1/(z-n) + 1/(z+n))"""
    result = 1.0 / z
    for n in range(1, N+1):
        result += 1/(z - n) + 1/(z + n)
    return result

z_test = 0.5 + 0.7j
ml_val = pi_cot_ML(z_test)
exact_val = np.pi / np.tan(np.pi * z_test)
print(f"\nπcot(πz) ML: {ml_val:.6f}")
print(f"Chính xác:   {exact_val:.6f}")
```

---

## Summary / Key Takeaways

- **Tích vô hạn** $\prod(1+a_n)$ hội tụ tuyệt đối $\Leftrightarrow$ $\sum|a_n| < \infty$.
- **Nhân tố cơ bản**: $E_p(z) = (1-z)\exp(z + z^2/2 + \cdots + z^p/p)$, có zero tại $z=1$ và $\to 1$ nhanh.
- **Weierstrass**: mọi entire $f = z^m e^g \prod E_{p_n}(z/a_n)$ với $g$ entire tùy ý.
- **Hadamard**: nếu $f$ bậc hữu hạn $\rho$, thì $g$ là đa thức bậc $\leq\rho$.
- **Weierstrass sin**: $\sin(\pi z) = \pi z\prod_{n=1}^\infty(1-z^2/n^2)$ → $\zeta(2) = \pi^2/6$.
- **Mittag-Leffler**: cho trước họ cực, tồn tại hàm meromorphic với đúng các cực đó.
- **Hàm Gamma**: meromorphic, $\Gamma(n+1) = n!$, cực tại $\mathbb{Z}_{\leq 0}$, công thức phản chiếu $\Gamma(z)\Gamma(1-z) = \pi/\sin(\pi z)$.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 5, §§3–5.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapters 5–6.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 7.
- Xem chứng minh đầy đủ tại [[a2-weierstrass-factorization|A2. Weierstrass Factorization Theorem]].
