---
title: "10. Harmonic Functions"
tags: [math, complex-analysis, lesson-10]
aliases: [Harmonic Functions]
created: 2026-03-31
---

> **Prerequisites**: [[07-local-properties|07. Local Properties of Analytic Functions]], [[09-residues|09. Calculus of Residues]]
> **Objectives**:
> - Hiểu sâu tính chất của hàm điều hòa: mean value property, maximum principle
> - Xây dựng nhân Poisson và giải bài toán Dirichlet trên đĩa
> - Hiểu bất đẳng thức và nguyên lý Harnack
> - Nắm mối liên hệ giữa hàm điều hòa và hàm subharmonic

---

## Motivation / Intuition

Hàm điều hòa xuất hiện tự nhiên trong vật lý: phân bố nhiệt độ ở trạng thái dừng, điện thế tĩnh điện, vận tốc thế của chất lỏng không nén được — tất cả mô tả bởi phương trình Laplace $\Delta u = 0$.

Câu hỏi trung tâm là **bài toán Dirichlet**: cho trước giá trị trên biên, tìm hàm điều hòa bên trong nhận giá trị đó. Câu trả lời là **Có**, và công cụ chính là **nhân Poisson** — analog hàm điều hòa của Công thức Tích phân Cauchy.

---

## Tính Chất Cơ Bản

### Definition

> [!info] Definition 10.1 — Hàm điều hòa (nhắc lại)
> $u \in C^2(\Omega)$ là **điều hòa** (harmonic) nếu $\Delta u = u_{xx} + u_{yy} = 0$ trên $\Omega$.

> [!abstract] Theorem 10.2 — Mean Value Property
> Nếu $u$ điều hòa trên $\Omega$ và $\overline{D}(z_0, r) \subset \Omega$, thì:
>
> $$u(z_0) = \frac{1}{2\pi}\int_0^{2\pi} u(z_0 + re^{i\theta})\,d\theta$$
>
> tức là giá trị tại tâm bằng trung bình trên đường tròn. Tương đương, $u(z_0) = \frac{1}{\pi r^2}\iint_{D(z_0,r)}u\,dx\,dy$.

**Proof.** Vì $u$ điều hòa trên đĩa đơn liên, tồn tại liên hợp điều hòa $v$ và $f = u+iv$ holomorphic. Áp dụng Công thức Cauchy:

$$f(z_0) = \frac{1}{2\pi i}\int_{|z-z_0|=r}\frac{f(z)}{z-z_0}\,dz = \frac{1}{2\pi}\int_0^{2\pi}f(z_0+re^{i\theta})\,d\theta$$

Lấy phần thực: $u(z_0) = \frac{1}{2\pi}\int_0^{2\pi}u(z_0+re^{i\theta})\,d\theta$. $\blacksquare$

> [!abstract] Theorem 10.3 — Đảo của Mean Value Property (Weyl's Lemma)
> Nếu $u$ liên tục trên $\Omega$ và thỏa mean value property với mọi $\overline{D}(z_0, r) \subset \Omega$, thì $u$ điều hòa trên $\Omega$.

---

## Nguyên Lý Cực Đại

> [!abstract] Theorem 10.4 — Nguyên lý Cực đại Mạnh (Strong Maximum Principle)
> Nếu $u$ điều hòa trên miền liên thông $\Omega$ và đạt cực đại tại điểm $z_0 \in \Omega$, thì $u$ hằng số trên $\Omega$.

**Proof.** Gọi $M = u(z_0)$. Tập $\Sigma = \{z \in \Omega : u(z) = M\}$ vừa đóng (do $u$ liên tục) vừa mở (do Mean Value: nếu $u(z_0)=M$ và $u \leq M$, thì $\frac{1}{2\pi}\int u\,d\theta = M$ buộc $u = M$ trên đường tròn). $\Omega$ liên thông suy ra $\Sigma = \Omega$. $\blacksquare$

> [!abstract] Corollary 10.5 — Dạng yếu (Weak Maximum Principle)
> Nếu $u$ điều hòa trên $\Omega$, liên tục trên $\overline{\Omega}$ compact, thì:
>
> $$\max_{\overline{\Omega}} u = \max_{\partial\Omega} u \quad \text{và} \quad \min_{\overline{\Omega}} u = \min_{\partial\Omega} u$$

> [!abstract] Corollary 10.6 — Duy nhất bài toán Dirichlet
> Nếu $u_1, u_2$ điều hòa, liên tục đến biên, và $u_1|_{\partial\Omega} = u_2|_{\partial\Omega}$, thì $u_1 \equiv u_2$.

---

## Nhân Poisson và Tích Phân Poisson

### Definition

> [!info] Definition 10.7 — Nhân Poisson (Poisson Kernel)
> Với $z = re^{i\theta}$, $r < 1$, $\zeta = e^{it} \in \partial D(0,1)$:
>
> $$P_r(\theta - t) = \operatorname{Re}\frac{\zeta + z}{\zeta - z} = \frac{1 - r^2}{1 - 2r\cos(\theta - t) + r^2}$$
>
> Tính chất:
> - $P_r(\theta) > 0$ với mọi $r < 1$, mọi $\theta$
> - $\frac{1}{2\pi}\int_0^{2\pi}P_r(\theta)\,d\theta = 1$ (chuẩn hóa)
> - Với $\delta > 0$ cố định: $\sup_{|\theta| \geq \delta}P_r(\theta) \to 0$ khi $r \to 1^-$ (approximate identity)

> [!abstract] Theorem 10.8 — Công thức Tích phân Poisson
> Nếu $u$ điều hòa trên $\overline{D}(0, R)$, thì với $|z| = r < R$:
>
> $$u(re^{i\theta}) = \frac{1}{2\pi}\int_0^{2\pi}\frac{R^2 - r^2}{R^2 - 2Rr\cos(\theta - t) + r^2}\,u(Re^{it})\,dt$$

**Proof.** Viết $f = u + iv$ holomorphic trên $D(0,R)$. Từ Công thức Cauchy và tích phân điểm phản chiếu $R^2/\bar{z}$ (nằm ngoài đĩa):

$$u(z) = \operatorname{Re}\frac{1}{2\pi i}\int_{|\zeta|=R}\frac{f(\zeta)}{\zeta-z}\,d\zeta = \operatorname{Re}\frac{1}{2\pi}\int_0^{2\pi}\frac{Re^{it}}{Re^{it}-z}f(Re^{it})\,dt$$

Kết hợp với tích phân tại $R^2/\bar{z}$ và lấy phần thực cho nhân Poisson. $\blacksquare$

---

## Bài Toán Dirichlet (Dirichlet Problem)

### Definition

> [!info] Definition 10.9 — Bài toán Dirichlet
> Cho $f: \partial D(0,1) \to \mathbb{R}$ liên tục. Tìm $u$ thỏa:
>
> $$\Delta u = 0 \text{ trên } D(0,1), \qquad \lim_{r \to 1^-}u(re^{i\theta}) = f(e^{i\theta})$$

> [!abstract] Theorem 10.10 — Giải bài toán Dirichlet trên đĩa
> Định nghĩa:
>
> $$u(re^{i\theta}) = \frac{1}{2\pi}\int_0^{2\pi}P_r(\theta - t)f(e^{it})\,dt$$
>
> Thì $u$ là nghiệm điều hòa duy nhất của bài toán Dirichlet.

**Proof.** Điều hòa: vi phân dưới dấu tích phân — $\Delta_z P_r(\theta-t) = 0$ với $|z| < 1$. Biên: vì $P_r$ là approximate identity và $f$ liên tục đều, $u(re^{i\theta}) \to f(e^{i\theta})$ đồng đều. Duy nhất: từ Corollary 10.6. $\blacksquare$

> [!example] Example 10.11 — Giải bài toán Dirichlet tường minh
> Tìm $u$ điều hòa trên $D(0,1)$ với $u(e^{i\theta}) = \cos\theta$.
>
> Nhận thấy $\cos\theta = \operatorname{Re}(e^{i\theta})$. Thử nghiệm $u(x,y) = x = r\cos\theta$:
> - $\Delta u = 0$ ✓ (vì $u = \operatorname{Re}(z)$ với $f(z) = z$ holomorphic)
> - $u(e^{i\theta}) = \cos\theta$ ✓
>
> Tổng quát hơn: $u(e^{i\theta}) = \cos(n\theta) \Rightarrow u(re^{i\theta}) = r^n\cos(n\theta)$.

> [!example] Example 10.12 — Tổng dữ liệu biên theo Fourier
> Dữ liệu biên $f(\theta) = \sum_{n=-\infty}^{\infty}c_n e^{in\theta}$. Nghiệm:
>
> $$u(re^{i\theta}) = c_0 + \sum_{n=1}^\infty r^n(c_n e^{in\theta} + c_{-n}e^{-in\theta})$$
>
> Đây là chuỗi Abel: $P_r(\theta) = \sum_{n=-\infty}^\infty r^{|n|}e^{in\theta}$.

---

## Bất Đẳng Thức và Nguyên Lý Harnack

> [!abstract] Theorem 10.13 — Bất đẳng thức Harnack (Harnack's Inequality)
> Nếu $u \geq 0$ điều hòa trên $D(0, R)$, thì với $|z| = r < R$:
>
> $$\frac{R - r}{R + r}\,u(0) \leq u(z) \leq \frac{R + r}{R - r}\,u(0)$$

**Proof.** Từ Poisson và bất đẳng thức nhân Poisson $\frac{R-r}{R+r} \leq P_r(\theta) \leq \frac{R+r}{R-r}$ (vì $(R-r)^2 \leq R^2-2Rr\cos\theta + r^2 \leq (R+r)^2$) và $u \geq 0$, $u(0) = \frac{1}{2\pi}\int u\,dt$:

$$\frac{R-r}{R+r}u(0) \leq \frac{1}{2\pi}\int P_r\cdot u\,dt = u(z) \leq \frac{R+r}{R-r}u(0) \quad \blacksquare$$

> [!abstract] Theorem 10.14 — Nguyên lý Harnack (Harnack's Principle)
> Nếu $\{u_n\}$ là dãy tăng đơn điệu của hàm điều hòa trên miền liên thông $\Omega$, thì hoặc $u_n \to +\infty$ đồng đều trên mọi compact trong $\Omega$, hoặc $u_n \to u$ đồng đều trên compact (với $u$ điều hòa).

**Proof.** Từ bất đẳng thức Harnack áp dụng cho $u_n - u_m \geq 0$ (với $n > m$), dãy Cauchy trên compact, hội tụ đều. $\blacksquare$

---

## Hàm Subharmonic

> [!info] Definition 10.15 — Hàm subharmonic và superharmonic
> - $u \in C^2(\Omega)$ là **subharmonic** nếu $\Delta u \geq 0$, tương đương $u(z_0) \leq \frac{1}{2\pi}\int u\,d\theta$.
> - $u$ là **superharmonic** nếu $-u$ subharmonic ($\Delta u \leq 0$).

> [!example] Example 10.16 — Ví dụ subharmonic
> - $|f(z)|^p$ với $p \geq 1$ và $f$ holomorphic là subharmonic (dùng bất đẳng thức Jensen).
> - $\ln|f(z)|$ với $f$ holomorphic không triệt tiêu là harmonic.
> - $|z|^2 = x^2+y^2$: $\Delta|z|^2 = 4 > 0$, subharmonic.

> [!note] Remark 10.17 — Ứng dụng trong bài toán biến phân
> Hàm subharmonic đóng vai trò trong **phương pháp Perron**: xây dựng nghiệm bài toán Dirichlet trên miền tổng quát bằng cực đại của họ subharmonic với dữ liệu biên. Đây là nền tảng cho lý thuyết thế năng (potential theory).

---

## SageMath Cheatsheet

```python
# Giải bài toán Dirichlet bằng nhân Poisson
import numpy as np
import matplotlib.pyplot as plt

def poisson_kernel(r, theta):
    """Nhân Poisson P_r(theta) trên đĩa đơn vị"""
    return (1 - r**2) / (1 - 2*r*np.cos(theta) + r**2)

def dirichlet_solution(f_boundary, r, theta, n=2000):
    """u(r,theta) = (1/2pi) int P_r(theta-t) f(t) dt"""
    t = np.linspace(0, 2*np.pi, n, endpoint=False)
    return np.mean(poisson_kernel(r, theta - t) * f_boundary(t))

# Kiểm tra: f(t) = cos(2t), nghiệm là r^2 cos(2theta)
f = lambda t: np.cos(2*t)
r, theta = 0.6, np.pi/5
u_approx = dirichlet_solution(f, r, theta)
u_exact  = r**2 * np.cos(2*theta)
print(f"Xấp xỉ: {u_approx:.6f} | Chính xác: {u_exact:.6f}")

# Kiểm tra bất đẳng thức Harnack
# u = 1/(1-r^2) là điều hòa... ví dụ dễ: u = Re((1+z)/(1-z))
def u_positive_harmonic(z):
    """Re((1+z)/(1-z)) >= 0 với |z| < 1"""
    return np.real((1 + z) / (1 - z))

z_0 = 0 + 0j
u0  = u_positive_harmonic(z_0)   # = 1
z1  = 0.5 + 0j
u1  = u_positive_harmonic(z1)    # xấp xỉ 3
R, r_val = 0.9, abs(z1)
lower = u0 * (R - r_val) / (R + r_val)
upper = u0 * (R + r_val) / (R - r_val)
print(f"Harnack: {lower:.3f} ≤ {u1:.3f} ≤ {upper:.3f}  →  {lower<=u1<=upper}")
```

---

## Summary / Key Takeaways

- **Mean value property**: $u(z_0) = \frac{1}{2\pi}\int_0^{2\pi}u(z_0+re^{i\theta})d\theta$, đặc trưng hàm điều hòa.
- **Nguyên lý cực đại mạnh**: cực đại nội tâm $\Rightarrow$ hằng số; $\max_{\overline{\Omega}}u = \max_{\partial\Omega}u$.
- **Nhân Poisson**: $P_r(\theta) = \frac{1-r^2}{1-2r\cos\theta+r^2}$, dương, chuẩn hóa, approximate identity.
- **Bài toán Dirichlet** trên đĩa: nghiệm tường minh $u = \frac{1}{2\pi}\int P_r f\,dt$, duy nhất.
- **Harnack's Inequality**: $\frac{R-r}{R+r}u(0) \leq u(z) \leq \frac{R+r}{R-r}u(0)$ với $u \geq 0$.
- **Harnack's Principle**: dãy đơn điệu tăng harmonic hoặc $\to+\infty$ đồng đều hoặc hội tụ harmonic.
- $|f|^p$ ($p\geq 1$) và $\ln|f|$ (với $f\neq 0$) là subharmonic.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 4, §6.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 2, §§3–4.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 10.
- Axler, S., Bourdon, P. & Ramey, W. *Harmonic Function Theory* (2nd ed.), Chapters 1–2.
