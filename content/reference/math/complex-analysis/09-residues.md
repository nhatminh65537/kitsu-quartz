---
title: "09. Calculus of Residues"
tags: [math, complex-analysis, lesson-09]
aliases: [Calculus of Residues]
created: 2026-03-31
---

> **Prerequisites**: [[08-laurent-series-singularities|08. Laurent Series and Isolated Singularities]]
> **Objectives**:
> - Nắm định nghĩa và các công thức tính thặng dư (residue)
> - Chứng minh và áp dụng Định lý Thặng dư
> - Tính các tích phân thực khó bằng phương pháp phức
> - Hiểu Nguyên lý Argument và Định lý Rouché

---

## Motivation / Intuition

Tính phân tích phức biến tích phân thực thành một bài toán **đại số**: chỉ cần tìm các "thặng dư" tại các điểm kỳ dị, cộng chúng lại, nhân $2\pi i$ — xong. Định lý Thặng dư là "cỗ máy" tính tích phân mạnh nhất trong phân tích, cho phép tính những tích phân mà mọi kỹ thuật thực đều bất lực.

---

## Thặng Dư (Residue)

### Definition

> [!info] Definition 9.1 — Thặng dư (Residue)
> Cho $f$ holomorphic trên đĩa đục $D'(z_0, r)$ với chuỗi Laurent $\sum c_n(z-z_0)^n$. **Thặng dư** của $f$ tại $z_0$:
>
> $$\operatorname{Res}(f, z_0) = c_{-1}$$
>
> Tương đương, từ công thức hệ số Laurent:
>
> $$\operatorname{Res}(f, z_0) = \frac{1}{2\pi i}\int_{|z-z_0|=r} f(z)\,dz$$

### Các công thức tính thặng dư

> [!abstract] Theorem 9.2 — Thặng dư tại điểm khả khử
> Nếu $z_0$ là điểm kỳ dị khả khử: $\operatorname{Res}(f, z_0) = 0$.

> [!abstract] Theorem 9.3 — Thặng dư tại cực đơn (Simple Pole)
> Nếu $z_0$ là **cực đơn** (bậc $1$):
>
> $$\operatorname{Res}(f, z_0) = \lim_{z \to z_0}(z-z_0)f(z)$$

> [!abstract] Theorem 9.4 — Thặng dư tại cực bậc $m$
> Nếu $z_0$ là cực bậc $m$:
>
> $$\operatorname{Res}(f, z_0) = \frac{1}{(m-1)!}\lim_{z \to z_0}\frac{d^{m-1}}{dz^{m-1}}\left[(z-z_0)^m f(z)\right]$$

> [!abstract] Theorem 9.5 — Công thức đặc biệt cho dạng $p/q$
> Nếu $f(z) = p(z)/q(z)$ với $p(z_0) \neq 0$ và $q$ có điểm không đơn tại $z_0$:
>
> $$\operatorname{Res}(f, z_0) = \frac{p(z_0)}{q'(z_0)}$$

**Proof.** Vì $q(z_0) = 0$ và $q'(z_0) \neq 0$, ta có $q(z) = (z-z_0)q'(z_0)(1 + O(z-z_0))$. Do đó:
$(z-z_0)f(z) = \frac{(z-z_0)p(z)}{q(z)} \to \frac{p(z_0)}{q'(z_0)}$ khi $z \to z_0$. $\blacksquare$

> [!example] Example 9.6 — Tính thặng dư
> **$f(z) = \frac{e^z}{z^2(z-1)}$.**
>
> Các điểm kỳ dị: $z=0$ (cực bậc 2), $z=1$ (cực đơn).
>
> Tại $z = 1$ (cực đơn): $\operatorname{Res}(f, 1) = \frac{e^1}{1^2} = e$.
>
> Tại $z = 0$ (cực bậc 2):
> $$\operatorname{Res}(f, 0) = \lim_{z\to 0}\frac{d}{dz}\left[z^2 \cdot \frac{e^z}{z^2(z-1)}\right] = \lim_{z\to 0}\frac{d}{dz}\frac{e^z}{z-1}$$
> $$= \lim_{z\to 0}\frac{e^z(z-1) - e^z}{(z-1)^2} = \frac{1 \cdot (-1) - 1}{1} = -2$$

---

## Định Lý Thặng Dư (Residue Theorem)

> [!abstract] Theorem 9.7 — Định lý Thặng dư (Residue Theorem)
> Cho $\Omega$ miền đơn liên, $f$ holomorphic trên $\Omega$ ngoại trừ hữu hạn điểm kỳ dị cô lập $z_1, z_2, \ldots, z_n \in \Omega$, và $\gamma$ là contour đóng trong $\Omega$ không đi qua $z_k$. Thì:
>
> $$\int_\gamma f(z)\,dz = 2\pi i \sum_{k=1}^n n(\gamma, z_k)\operatorname{Res}(f, z_k)$$
>
> trong đó $n(\gamma, z_k)$ là số cuộn của $\gamma$ quanh $z_k$.
>
> Trường hợp $\gamma$ là đường cong đơn đóng (Jordan) đi ngược chiều kim đồng hồ và tất cả $z_k$ nằm bên trong $\gamma$:
>
> $$\oint_\gamma f(z)\,dz = 2\pi i \sum_{k=1}^n \operatorname{Res}(f, z_k)$$

**Proof.** Quanh mỗi $z_k$, lấy đĩa nhỏ $D(z_k, \varepsilon_k)$. Trên miền $\Omega$ bỏ đi các đĩa này, $f$ holomorphic; áp dụng Định lý Cauchy, tích phân trên $\gamma$ bằng tổng tích phân trên các đường tròn nhỏ. Mỗi tích phân trên đường tròn nhỏ cho $2\pi i \cdot n(\gamma, z_k) \cdot \operatorname{Res}(f, z_k)$ từ định nghĩa thặng dư. $\blacksquare$

---

## Tính Tích Phân Thực (Real Integrals via Residues)

### Dạng 1: $\int_0^{2\pi} R(\cos\theta, \sin\theta)\,d\theta$

> [!tip] Key Insight 9.8 — Kỹ thuật đường tròn đơn vị
> Đặt $z = e^{i\theta}$, $dz = ie^{i\theta}d\theta = iz\,d\theta$, nên $d\theta = dz/(iz)$.
>
> $$\cos\theta = \frac{z + z^{-1}}{2}, \quad \sin\theta = \frac{z - z^{-1}}{2i}$$
>
> Tích phân đổi thành $\oint_{|z|=1} \tilde{R}(z)\,dz$ và tính bằng Định lý Thặng dư.

> [!example] Example 9.9
> $I = \int_0^{2\pi}\frac{d\theta}{2 + \cos\theta}$.
>
> Đặt $z = e^{i\theta}$: $\cos\theta = (z + z^{-1})/2$, $d\theta = dz/(iz)$.
>
> $$I = \oint_{|z|=1}\frac{1}{2 + (z+z^{-1})/2}\frac{dz}{iz} = \oint_{|z|=1}\frac{2\,dz}{iz(4 + z + z^{-1})} = \oint_{|z|=1}\frac{2\,dz}{i(z^2 + 4z + 1)}$$
>
> Nghiệm của $z^2 + 4z + 1 = 0$: $z = -2 \pm \sqrt{3}$. Chỉ $z_1 = -2 + \sqrt{3}$ nằm trong $|z|<1$.
>
> $$\operatorname{Res}\left(\frac{2}{i(z^2+4z+1)}, z_1\right) = \frac{2}{i(2z_1+4)} = \frac{2}{i \cdot 2\sqrt{3}} = \frac{1}{i\sqrt{3}}$$
>
> $$I = 2\pi i \cdot \frac{1}{i\sqrt{3}} = \frac{2\pi}{\sqrt{3}}$$

### Dạng 2: $\int_{-\infty}^{+\infty} R(x)\,dx$

> [!tip] Key Insight 9.10 — Contour bán vòng tròn (Semi-circular contour)
> Đóng contour bằng bán vòng tròn bán kính $R \to \infty$ ở nửa mặt phẳng trên. Nếu $|f(z)| = O(1/|z|^2)$ thì tích phân trên nửa vòng tròn $\to 0$ (do Lemma Jordan).
>
> $$\int_{-\infty}^{+\infty} R(x)\,dx = 2\pi i \sum_{\operatorname{Im}(z_k)>0}\operatorname{Res}(R, z_k)$$

> [!example] Example 9.11
> $I = \int_{-\infty}^{+\infty}\frac{dx}{1+x^2}$.
>
> $f(z) = \frac{1}{1+z^2}$ có cực đơn tại $z = \pm i$. Chỉ $z = i$ nằm trong nửa mặt phẳng trên.
>
> $$\operatorname{Res}(f, i) = \frac{1}{2i}$$
>
> $$I = 2\pi i \cdot \frac{1}{2i} = \pi$$

> [!example] Example 9.12 — Tích phân có thừa số mũ
> $I = \int_{-\infty}^{+\infty}\frac{\cos x}{1+x^2}\,dx = \operatorname{Re}\int_{-\infty}^{+\infty}\frac{e^{ix}}{1+x^2}\,dx$.
>
> Dùng contour bán vòng tròn trên: cực $z = i$, $\operatorname{Res}(e^{iz}/(1+z^2), i) = e^{i\cdot i}/(2i) = e^{-1}/(2i)$.
>
> $$\int_{-\infty}^{+\infty}\frac{e^{ix}}{1+x^2}\,dx = 2\pi i \cdot \frac{e^{-1}}{2i} = \frac{\pi}{e}$$
>
> Vậy $I = \pi/e$.

### Dạng 3: Bổ đề Jordan

> [!abstract] Theorem 9.13 — Bổ đề Jordan (Jordan's Lemma)
> Cho $\Gamma_R$: bán vòng tròn $|z| = R$, $\operatorname{Im}(z) > 0$. Nếu $\max_{z \in \Gamma_R}|g(z)| \to 0$ khi $R \to \infty$, thì:
>
> $$\lim_{R\to\infty}\int_{\Gamma_R} g(z)e^{iaz}\,dz = 0 \quad (a > 0)$$

---

## Nguyên Lý Argument (Argument Principle)

> [!abstract] Theorem 9.14 — Nguyên lý Argument (Argument Principle)
> Cho $f$ meromorphic trên $\Omega$ (holomorphic ngoại trừ hữu hạn cực), $\gamma$ contour đóng Jordan đơn trong $\Omega$ không qua điểm không hay cực của $f$. Gọi $Z$ = số điểm không (tính bội), $P$ = số cực (tính bội) của $f$ bên trong $\gamma$. Thì:
>
> $$\frac{1}{2\pi i}\int_\gamma \frac{f'(z)}{f(z)}\,dz = Z - P$$
>
> Tương đương: $Z - P = n(f \circ \gamma, 0)$ = số cuộn của đường $f \circ \gamma$ quanh $0$.

**Proof.** Gần điểm không bậc $m$ tại $z_0$: $f(z) = (z-z_0)^m h(z)$, nên $\frac{f'}{f} = \frac{m}{z-z_0} + \frac{h'}{h}$, đóng góp thặng dư $m$.

Gần cực bậc $p$ tại $w_0$: $f(z) = (z-w_0)^{-p}k(z)$, nên $\frac{f'}{f} = \frac{-p}{z-w_0} + \frac{k'}{k}$, đóng góp thặng dư $-p$.

Tổng thặng dư = $Z - P$. Áp dụng Định lý Thặng dư. $\blacksquare$

---

## Định Lý Rouché (Rouché's Theorem)

> [!abstract] Theorem 9.15 — Định lý Rouché (Rouché's Theorem)
> Cho $f, g$ holomorphic trên và trong contour Jordan đóng $\gamma$. Nếu $|g(z)| < |f(z)|$ với mọi $z \in \gamma$, thì $f$ và $f + g$ có cùng số điểm không (tính bội) bên trong $\gamma$.

**Proof.** Xét $h_t(z) = f(z) + tg(z)$ với $t \in [0,1]$. Điều kiện $|g| < |f|$ trên $\gamma$ đảm bảo $h_t(z) \neq 0$ trên $\gamma$ với mọi $t$. Số điểm không của $h_t$ bên trong $\gamma$ là hàm liên tục theo $t$ và nhận giá trị nguyên, do đó là hằng số. Tại $t=0$: $h_0 = f$; tại $t=1$: $h_1 = f+g$. $\blacksquare$

> [!example] Example 9.16 — Định lý Cơ bản Đại số via Rouché
> Cho $p(z) = z^n + a_{n-1}z^{n-1} + \cdots + a_0$ với $n \geq 1$. Đặt $f(z) = z^n$ và $g(z) = a_{n-1}z^{n-1} + \cdots + a_0$.
>
> Chọn $R$ đủ lớn sao cho $|g(z)| < |z^n|$ với $|z| = R$ (có thể làm vì $|g(z)| \leq C|z|^{n-1}$ và $|f(z)| = R^n$, cho $R > C$ ta có $|g|/|f| \leq C/R < 1$).
>
> Rouché: $p(z) = f(z) + g(z)$ có đúng $n$ nghiệm trong $D(0, R)$. Đây là Định lý Cơ bản Đại số.

> [!example] Example 9.17 — Định vị nghiệm đa thức
> Đa thức $p(z) = z^5 + 3z + 1$ có bao nhiêu nghiệm trong $D(0, 2)$?
>
> Đặt $f(z) = z^5$, $g(z) = 3z + 1$ trên $|z| = 2$.
>
> $|f(z)| = 32$, $|g(z)| \leq 3\cdot 2 + 1 = 7 < 32$.
>
> Rouché: $p(z)$ có đúng $5$ nghiệm trong $D(0,2)$ (bằng $f(z)=z^5$). Vậy tất cả $5$ nghiệm nằm trong đĩa bán kính $2$.

---

## SageMath Cheatsheet

```python
# Tính thặng dư tự động
from sympy import residue, Symbol, exp, cos, sin, pi, sqrt, I
z = Symbol('z')

# Ví dụ: e^z / (z^2 * (z-1))
f = exp(z) / (z**2 * (z-1))
print("Res tại z=0:", residue(f, z, 0))   # -2
print("Res tại z=1:", residue(f, z, 1))   # e

# Tích phân thực bằng residues
from sympy import integrate, oo, re

# int dx/(1+x^2) = π
x = Symbol('x', real=True)
print(integrate(1/(1+x**2), (x, -oo, oo)))  # pi

# int_0^{2pi} dθ/(2+cosθ) = 2π/√3
theta = Symbol('theta', real=True)
I_trig = integrate(1/(2+cos(theta)), (theta, 0, 2*pi))
print(I_trig)   # 2*pi/sqrt(3)

# Tính thặng dư và áp dụng định lý thặng dư thủ công
from sympy import limit

def residue_simple_pole(f, z, z0):
    """Thặng dư tại cực đơn"""
    return limit((z - z0) * f.subs(z, z), z, z0)

# Kiểm tra Rouché: nghiệm của z^5 + 3z + 1 trong D(0,2)
import numpy as np
poly_coeffs = [1, 0, 0, 0, 3, 1]   # z^5 + 3z + 1
roots = np.roots(poly_coeffs)
print("Tất cả nghiệm:", roots)
print("Nghiệm trong D(0,2):", sum(1 for r in roots if abs(r) < 2))  # 5
```

---

## Summary / Key Takeaways

- $\operatorname{Res}(f, z_0) = c_{-1}$ trong chuỗi Laurent; tính bằng:
  - Cực đơn: $(z-z_0)f(z)\big|_{z\to z_0}$
  - Cực bậc $m$: $\frac{1}{(m-1)!}\frac{d^{m-1}}{dz^{m-1}}[(z-z_0)^m f(z)]\big|_{z\to z_0}$
  - Dạng $p/q$: $p(z_0)/q'(z_0)$
- **Định lý Thặng dư**: $\oint_\gamma f\,dz = 2\pi i \sum \operatorname{Res}(f, z_k)$.
- Ba dạng tích phân thực: lượng giác (đường tròn), hữu tỉ (bán vòng tròn), mũ (Jordan's Lemma).
- **Nguyên lý Argument**: $\frac{1}{2\pi i}\oint \frac{f'}{f}dz = Z - P$.
- **Định lý Rouché**: $|g| < |f|$ trên $\gamma$ $\Rightarrow$ $f$ và $f+g$ có cùng số điểm không bên trong.
- Ứng dụng Rouché: chứng minh và định vị nghiệm đa thức.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 5, §§2–3.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 3.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 5, §§2–3.
