---
title: "06. Complex Integration"
tags: [math, complex-analysis, lesson-06]
aliases: [Complex Integration]
created: 2026-03-31
---

> **Prerequisites**: [[02-topology-complex-plane|02. Topology of the Complex Plane]], [[05-power-series|05. Power Series]]
> **Objectives**:
> - Định nghĩa tích phân đường phức và tính toán trực tiếp
> - Phát biểu và chứng minh Định lý Cauchy cho miền đơn liên
> - Nắm vững Công thức Tích phân Cauchy và các hệ quả
> - Hiểu hàm holomorphic là hàm analytic (khai triển Taylor)

---

## Motivation / Intuition

Định lý Cauchy là **trung tâm** của phân tích phức. Nó phát biểu: tích phân của hàm holomorphic trên đường cong đóng trong miền đơn liên **luôn bằng $0$**. Điều này hoàn toàn khác với giải tích thực.

Hệ quả sâu sắc nhất là **Công thức Tích phân Cauchy**: giá trị của hàm holomorphic tại một điểm được **xác định hoàn toàn** bởi giá trị trên bất kỳ đường cong đóng nào bao quanh điểm đó. Đây là biểu hiện của tính "cứng nhắc" (rigidity) của hàm holomorphic.

---

## Tích Phân Đường Phức (Complex Line Integral)

### Definition

> [!info] Definition 6.1 — Tích phân đường phức
> Cho $\gamma: [a, b] \to \mathbb{C}$ là contour và $f: \gamma([a,b]) \to \mathbb{C}$ liên tục. **Tích phân của $f$ dọc $\gamma$** là:
>
> $$\int_\gamma f(z)\,dz = \int_a^b f(\gamma(t))\gamma'(t)\,dt$$
>
> Đây là tích phân Riemann phức (tích phân theo phần thực và phần ảo riêng).

> [!abstract] Theorem 6.2 — Tính chất tích phân đường
> - **Tuyến tính**: $\int_\gamma (\alpha f + \beta g)\,dz = \alpha\int_\gamma f\,dz + \beta\int_\gamma g\,dz$
> - **Đường ngược**: $\int_{-\gamma} f\,dz = -\int_\gamma f\,dz$
> - **Nối tiếp**: $\int_{\gamma_1 + \gamma_2} f\,dz = \int_{\gamma_1} f\,dz + \int_{\gamma_2} f\,dz$
> - **Ước lượng module** (ML-inequality):
>
> $$\left|\int_\gamma f(z)\,dz\right| \leq \max_{z \in \gamma} |f(z)| \cdot L(\gamma)$$
>
> trong đó $L(\gamma) = \int_a^b |\gamma'(t)|\,dt$ là **độ dài** (length) của $\gamma$.

> [!example] Example 6.3 — Tính tích phân cơ bản
> **Tích phân $\int_\gamma z^n\,dz$ trên đường tròn.**
>
> Đặt $\gamma(t) = e^{it}$, $t \in [0, 2\pi]$ (đường tròn đơn vị). Với $n \in \mathbb{Z}$:
>
> $$\int_\gamma z^n\,dz = \int_0^{2\pi} e^{int} \cdot ie^{it}\,dt = i\int_0^{2\pi} e^{i(n+1)t}\,dt$$
>
> - Nếu $n \neq -1$: tích phân $= i\left[\frac{e^{i(n+1)t}}{i(n+1)}\right]_0^{2\pi} = 0$ (vì $e^{2\pi i(n+1)} = 1$).
> - Nếu $n = -1$: tích phân $= i\int_0^{2\pi}dt = 2\pi i$.
>
> Kết quả quan trọng:
>
> $$\int_{|z|=1} z^n\,dz = \begin{cases} 2\pi i & n = -1 \\ 0 & n \in \mathbb{Z}, n \neq -1 \end{cases}$$

---

## Định Lý Goursat (Goursat's Theorem)

> [!abstract] Theorem 6.4 — Định lý Goursat
> Nếu $f$ holomorphic trên miền mở $\Omega$ (không cần $f'$ liên tục!), thì với mọi tam giác $T \subset \Omega$:
>
> $$\int_{\partial T} f(z)\,dz = 0$$

**Proof (phác thảo — chia nhỏ tam giác).** Gọi $I = \int_{\partial T} f\,dz$. Chia $T$ thành 4 tam giác nhỏ hơn bằng cách nối trung điểm các cạnh. Ít nhất một tam giác con $T^{(1)}$ thỏa $|I| \leq 4|\int_{\partial T^{(1)}} f\,dz|$. Tiếp tục chia, thu được dãy tam giác $T \supset T^{(1)} \supset T^{(2)} \supset \cdots$ với $L(\partial T^{(k)}) = L(\partial T)/2^k$ và $|I| \leq 4^k |\int_{\partial T^{(k)}} f\,dz|$.

Giao của dãy tam giác đóng là một điểm $z_0$. Dùng holomorphic tại $z_0$: $f(z) = f(z_0) + f'(z_0)(z-z_0) + o(|z-z_0|)$. Tích phân của $f(z_0) + f'(z_0)(z-z_0)$ trên tam giác bằng $0$ (đạo hàm đa thức). Do đó:

$$\left|\int_{\partial T^{(k)}} f\,dz\right| \leq \max_{\partial T^{(k)}} |o(|z-z_0|)| \cdot L(\partial T^{(k)}) = o(\text{diam}(T^{(k)})) \cdot \frac{L(\partial T)}{2^k}$$

Vì diam$(T^{(k)}) \leq L(\partial T)/2^k$, suy ra $|I| \leq 4^k \cdot o(1/4^k) \to 0$. Vậy $I = 0$. $\blacksquare$

---

## Định Lý Cauchy (Cauchy's Theorem)

> [!abstract] Theorem 6.5 — Định lý Cauchy (Cauchy's Theorem — miền đơn liên)
> Nếu $f$ holomorphic trên miền đơn liên $\Omega$ và $\gamma$ là contour đóng trong $\Omega$, thì:
>
> $$\int_\gamma f(z)\,dz = 0$$

**Proof (từ Goursat).** Mọi contour đóng trong miền đơn liên có thể xấp xỉ bằng tổ hợp các tam giác (phân chia). Áp dụng Goursat cho từng tam giác. $\blacksquare$

> [!tip] Key Insight 6.6 — Nguyên hàm trong miền đơn liên
> Hệ quả tương đương của Định lý Cauchy: trên miền đơn liên $\Omega$, mọi hàm holomorphic $f$ có **nguyên hàm** (antiderivative) $F$ holomorphic thỏa $F' = f$.

**Proof.** Cố định $z_0 \in \Omega$, đặt $F(z) = \int_\gamma f\,dw$ (tích phân dọc bất kỳ đường từ $z_0$ đến $z$). Định lý Cauchy đảm bảo $F(z)$ well-defined (độc lập với đường). Ta chứng minh $F'(z) = f(z)$ bằng cách kiểm tra trực tiếp định nghĩa đạo hàm. $\blacksquare$

> [!example] Example 6.7 — Ứng dụng Định lý Cauchy
> $\int_{|z|=2} e^z\,dz = 0$ vì $e^z$ holomorphic trên $\mathbb{C}$ (đơn liên).
>
> $\int_{|z|=2} \frac{1}{z}\,dz = 2\pi i \neq 0$ vì $\frac{1}{z}$ **không** holomorphic tại $z=0$ (nằm trong đường tròn).

---

## Công Thức Tích Phân Cauchy (Cauchy Integral Formula)

> [!abstract] Theorem 6.8 — Công thức Tích phân Cauchy (Cauchy Integral Formula)
> Cho $f$ holomorphic trên miền đơn liên $\Omega$, $\overline{D}(z_0, r) \subset \Omega$, và $\gamma$ là đường tròn $|z - z_0| = r$ đi theo chiều dương. Thì với mọi $a \in D(z_0, r)$:
>
> $$f(a) = \frac{1}{2\pi i} \int_\gamma \frac{f(z)}{z - a}\,dz$$

**Proof.** Với $\varepsilon > 0$ nhỏ, xét $\gamma_\varepsilon$: đường tròn $|z-a|=\varepsilon$. Bởi Cauchy áp dụng cho vành khuyên giữa $\gamma$ và $\gamma_\varepsilon$:

$$\int_\gamma \frac{f(z)}{z-a}\,dz = \int_{\gamma_\varepsilon} \frac{f(z)}{z-a}\,dz$$

Ước lượng tích phân phải:

$$\int_{\gamma_\varepsilon}\frac{f(z)}{z-a}\,dz = \int_{\gamma_\varepsilon}\frac{f(a)}{z-a}\,dz + \int_{\gamma_\varepsilon}\frac{f(z)-f(a)}{z-a}\,dz$$

Số hạng đầu: $f(a) \cdot 2\pi i$ (từ Example 6.3). Số hạng sau: $|f(z)-f(a)|/|z-a| \leq M_\varepsilon$ (bị chặn vì $f$ liên tục), nhân với $L(\gamma_\varepsilon) = 2\pi\varepsilon \to 0$. $\blacksquare$

> [!abstract] Theorem 6.9 — Công thức cho đạo hàm bậc cao
> Trong cùng điều kiện, $f$ khả vi vô hạn lần tại $a$ và:
>
> $$f^{(n)}(a) = \frac{n!}{2\pi i} \int_\gamma \frac{f(z)}{(z-a)^{n+1}}\,dz$$

**Proof.** Vi phân $n$ lần Công thức Tích phân Cauchy theo $a$ (vi phân dưới dấu tích phân được vì hội tụ đều). $\blacksquare$

> [!abstract] Theorem 6.10 — Hàm holomorphic là analytic
> Nếu $f$ holomorphic trên $D(z_0, R)$, thì $f$ có khai triển Taylor hội tụ trên $D(z_0, R)$:
>
> $$f(z) = \sum_{n=0}^\infty \frac{f^{(n)}(z_0)}{n!}(z-z_0)^n$$

**Proof.** Dùng Công thức Tích phân Cauchy và khai triển $\frac{1}{z-z_1} = \frac{1}{(z-z_0)-(z_1-z_0)} = \frac{1}{z-z_0}\frac{1}{1-(z_1-z_0)/(z-z_0)}$ thành chuỗi hình học, rồi đổi thứ tự tích phân và chuỗi (nhờ hội tụ đều). $\blacksquare$

---

## Bất Đẳng Thức Cauchy (Cauchy's Inequality)

> [!abstract] Theorem 6.11 — Bất đẳng thức Cauchy (Cauchy's Inequality)
> Nếu $f$ holomorphic trên $\overline{D}(z_0, r)$ và $|f(z)| \leq M$ trên $|z-z_0|=r$, thì:
>
> $$|f^{(n)}(z_0)| \leq \frac{n! M}{r^n}$$

**Proof.** Từ Theorem 6.9 và ML-inequality: $|f^{(n)}(z_0)| \leq \frac{n!}{2\pi} \cdot \frac{M}{r^{n+1}} \cdot 2\pi r = \frac{n!M}{r^n}$. $\blacksquare$

> [!abstract] Theorem 6.12 — Định lý Liouville (Liouville's Theorem)
> Hàm **entire** bị chặn thì hằng số.

**Proof.** Giả sử $|f(z)| \leq M$ với mọi $z \in \mathbb{C}$. Áp dụng bất đẳng thức Cauchy với $n=1$ trên $|z-z_0|=r$:

$$|f'(z_0)| \leq \frac{M}{r}$$

Cho $r \to \infty$: $f'(z_0) = 0$. Vì $z_0$ tùy ý, $f' \equiv 0$ nên $f$ hằng số. $\blacksquare$

> [!abstract] Theorem 6.13 — Định lý Cơ bản Đại số (từ Liouville)
> Mọi đa thức $p(z) \in \mathbb{C}[z]$, bậc $\geq 1$, có ít nhất một nghiệm phức.

**Proof.** Giả sử $p(z) \neq 0$ với mọi $z$. Thì $f = 1/p$ entire. Vì $|p(z)| \to \infty$ khi $|z| \to \infty$, ta có $|f(z)| \to 0$, nên $f$ bị chặn. Liouville: $f$ hằng số, mâu thuẫn. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Tích phân đường phức bằng số trị
import numpy as np
from scipy.integrate import quad

def complex_line_integral(f, gamma, dgamma, a, b, n=1000):
    """Tích phân f dọc gamma từ t=a đến t=b"""
    t = np.linspace(a, b, n)
    z = gamma(t)
    dz = dgamma(t)
    integrand = f(z) * dz
    real_part = np.trapz(integrand.real, t)
    imag_part = np.trapz(integrand.imag, t)
    return real_part + 1j*imag_part

# Ví dụ: tích phân 1/z trên đường tròn đơn vị
gamma   = lambda t: np.exp(1j*t)
dgamma  = lambda t: 1j*np.exp(1j*t)
f_inv_z = lambda z: 1/z

result = complex_line_integral(f_inv_z, gamma, dgamma, 0, 2*np.pi)
print(f"∫ 1/z dz = {result:.4f}")  # ≈ 6.2832i = 2πi

# Công thức tích phân Cauchy: khôi phục f(a) từ tích phân
def cauchy_integral_formula(f, a, r=1.0, n=1000):
    """Tính f(a) qua công thức tích phân Cauchy"""
    t = np.linspace(0, 2*np.pi, n)
    z = a + r*np.exp(1j*t)
    dz = 1j*r*np.exp(1j*t)
    integrand = f(z) / (z - a) * dz
    integral = np.trapz(integrand, t)
    return integral / (2*np.pi*1j)

# Kiểm tra với f(z) = e^z, a = 1+i
f_exp = np.exp
a = 1 + 1j
approx = cauchy_integral_formula(f_exp, a)
exact  = np.exp(a)
print(f"f(a) xấp xỉ: {approx:.4f}, chính xác: {exact:.4f}")
```

---

## Summary / Key Takeaways

- Tích phân đường $\int_\gamma f\,dz = \int_a^b f(\gamma(t))\gamma'(t)\,dt$ với ML-inequality $|\int_\gamma f\,dz| \leq ML$.
- **Định lý Goursat**: tích phân của hàm holomorphic trên tam giác bằng $0$ (không cần $f'$ liên tục).
- **Định lý Cauchy**: trên miền đơn liên, $\int_\gamma f\,dz = 0$ với mọi đường đóng $\gamma$.
- **Nguyên hàm**: trên miền đơn liên, mọi hàm holomorphic có nguyên hàm.
- **Công thức Cauchy**: $f(a) = \frac{1}{2\pi i}\int_\gamma \frac{f(z)}{z-a}\,dz$.
- **Đạo hàm bậc cao**: $f^{(n)}(a) = \frac{n!}{2\pi i}\int_\gamma \frac{f(z)}{(z-a)^{n+1}}\,dz$.
- Holomorphic $\Rightarrow$ analytic (khai triển Taylor hội tụ cục bộ).
- **Bất đẳng thức Cauchy**: $|f^{(n)}(z_0)| \leq n!M/r^n$.
- **Liouville**: hàm entire bị chặn là hằng số → Định lý Cơ bản Đại số.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 4.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapters 2–3.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 4.
- Xem chứng minh đầy đủ Định lý Cauchy dạng tổng quát tại [[a0-cauchys-theorem-homology|A0. Cauchy's Theorem — Homology Version]].
