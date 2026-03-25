---
title: "06. Fourier Transform trên L¹(ℝ)"
tags: [math, fourier-analysis, fourier-transform, lesson-06]
aliases: [Fourier Transform L1, Riemann-Lebesgue]
created: 2026-03-24
---

> **Prerequisites**: [[02-lebesgue-integral-lp|02. Tích phân Lebesgue & L^p]] — tích phân Lebesgue, $L^1(\mathbb{R})$, DCT; [[03-fourier-series-intro|03. Chuỗi Fourier]] — trực giác tần số
> **Objectives**:
> - Định nghĩa Fourier transform trên $L^1(\mathbb{R})$ và chứng minh các tính chất cơ bản
> - Phát biểu và chứng minh Riemann-Lebesgue Lemma
> - Hiểu Fourier Inversion Theorem và điều kiện áp dụng
> - Tính Fourier transform của các hàm kinh điển: Gaussian, hàm chữ nhật, hàm mũ
> - Nắm sự khác biệt cơ bản giữa Fourier Series (domain $\mathbb{T}$) và Fourier Transform (domain $\mathbb{R}$)

---

## Motivation / Intuition

Fourier series làm việc với hàm **tuần hoàn** trên $\mathbb{T}$ — phổ tần số rời rạc $\{n\}_{n \in \mathbb{Z}}$. Còn nếu hàm không tuần hoàn, xác định trên cả $\mathbb{R}$?

Hãy nghĩ đến giới hạn: khi chu kỳ $T \to \infty$, khoảng cách giữa các tần số $\frac{1}{T} \to 0$ và tổng rời rạc trở thành tích phân — **phổ tần số trở thành liên tục**. Đây là nguồn gốc trực quan của Fourier Transform:

$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\, e^{-2\pi i x \xi}\, dx
$$

> [!note] Quy ước ký hiệu — Nhiều convention
> Tồn tại ít nhất ba convention phổ biến cho Fourier transform:
> - **Ký hiệu vật lý**: $\hat{f}(\xi) = \int f(x) e^{-2\pi i x\xi} dx$ (đối xứng $2\pi$)
> - **Ký hiệu toán học**: $\hat{f}(\xi) = \int f(x) e^{-i x\xi} dx$ (hệ số $2\pi$ trong nghịch đảo)
> - **Ký hiệu xử lý tín hiệu**: $\hat{f}(\omega) = \int f(t) e^{-i\omega t} dt$
>
> **Trong khóa học này** ta dùng convention toán học chuẩn (Folland, Stein-Shakarchi):
> $$\hat{f}(\xi) = \int_{\mathbb{R}} f(x)\, e^{-i x\xi}\, dx$$

---

## Fourier Transform trên $L^1(\mathbb{R})$

### Định nghĩa

> [!definition] Definition 6.1 — Fourier Transform trên $L^1$
> Với $f \in L^1(\mathbb{R})$, **Fourier transform** của $f$ là hàm $\hat{f}: \mathbb{R} \to \mathbb{C}$ định nghĩa bởi:
>
> $$
> \hat{f}(\xi) = \int_{\mathbb{R}} f(x)\, e^{-i x\xi}\, dx, \qquad \xi \in \mathbb{R}
> $$
>
> Ký hiệu thay thế: $\mathcal{F}[f](\xi)$ hay $\mathcal{F}f(\xi)$.
>
> **Nghịch đảo** (inverse Fourier transform):
>
> $$
> \check{f}(x) = \mathcal{F}^{-1}[f](x) = \frac{1}{2\pi} \int_{\mathbb{R}} f(\xi)\, e^{i x\xi}\, d\xi
> $$

> [!note] Remark 6.2 — Tại sao $L^1$ đảm bảo tích phân hội tụ?
> Với $f \in L^1$: $|\hat{f}(\xi)| \leq \int |f(x)| |e^{-ix\xi}| dx = \int |f(x)| dx = \lVert f \rVert_1 < \infty$. Tích phân định nghĩa hội tụ tuyệt đối.

### Tính Chất Cơ Bản

> [!theorem] Theorem 6.3 — Tính Chất của Fourier Transform
> Với $f, g \in L^1(\mathbb{R})$, $a, b, h, \xi_0 \in \mathbb{R}$, $a \neq 0$:
>
> 1. **(Tuyến tính)** $\widehat{af + bg} = a\hat{f} + b\hat{g}$
>
> 2. **(Dịch chuyển / Translation)** $\widehat{f(\cdot - h)}(\xi) = e^{-ih\xi}\hat{f}(\xi)$
>
> 3. **(Modulation)** $\widehat{e^{i\xi_0 \cdot} f(\cdot)}(\xi) = \hat{f}(\xi - \xi_0)$
>
> 4. **(Co giãn / Dilation)** $\widehat{f(a\cdot)}(\xi) = \dfrac{1}{|a|}\hat{f}\!\left(\dfrac{\xi}{a}\right)$
>
> 5. **(Đạo hàm → nhân đa thức)** Nếu $f \in C^1$ và $f' \in L^1$ thì $\widehat{f'}(\xi) = i\xi\, \hat{f}(\xi)$
>
> 6. **(Nhân $x$ → đạo hàm)** Nếu $xf(x) \in L^1$ thì $\hat{f}$ khả vi và $\tfrac{d}{d\xi}\hat{f}(\xi) = \widehat{-ixf(x)}(\xi)$
>
> 7. **(Phản xạ)** $\widehat{f(-\cdot)}(\xi) = \hat{f}(-\xi)$; với $f$ thực: $\hat{f}(-\xi) = \overline{\hat{f}(\xi)}$

**Proof của (2).** Đặt $y = x - h$:
$$
\widehat{f(\cdot-h)}(\xi) = \int f(x-h) e^{-ix\xi} dx = e^{-ih\xi} \int f(y) e^{-iy\xi} dy = e^{-ih\xi}\hat{f}(\xi). \quad \blacksquare
$$

**Proof của (5).** Tích phân by parts (với $f(\pm\infty) = 0$ vì $f \in L^1$):
$$
\widehat{f'}(\xi) = \int f'(x) e^{-ix\xi} dx = \underbrace{f(x)e^{-ix\xi}\big|_{-\infty}^{\infty}}_{=0} + i\xi \int f(x) e^{-ix\xi} dx = i\xi\, \hat{f}(\xi). \quad \blacksquare
$$

> [!note] Remark 6.4 — Nguyên tắc bất định Heisenberg (preview)
> Tính chất (5) và (6) thể hiện **nguyên tắc đối ngẫu**: hàm càng "trơn" (nhiều đạo hàm) thì Fourier transform giảm nhanh ở $\infty$; hàm có "support compact" thì FT trơn. Đây là tiền đề cho **Uncertainty Principle** (Lesson 08).

---

## Riemann-Lebesgue Lemma

> [!theorem] Theorem 6.5 — Riemann-Lebesgue Lemma
> Với mọi $f \in L^1(\mathbb{R})$:
>
> 1. $\hat{f}$ **liên tục** trên $\mathbb{R}$
> 2. $\hat{f}$ **triệt tiêu tại vô cùng**: $\lim_{|\xi| \to \infty} \hat{f}(\xi) = 0$
>
> Nói gọn: $\mathcal{F}: L^1(\mathbb{R}) \to C_0(\mathbb{R})$ trong đó $C_0(\mathbb{R})$ là không gian hàm liên tục triệt tiêu tại $\infty$.
>
> Hơn nữa: $\lVert \hat{f} \rVert_\infty \leq \lVert f \rVert_{L^1}$.

**Proof.** *Liên tục*: Dùng DCT với hàm trội $g = |f| \in L^1$: khi $\xi_n \to \xi$,
$$
\hat{f}(\xi_n) = \int f(x) e^{-ix\xi_n} dx \to \int f(x) e^{-ix\xi} dx = \hat{f}(\xi).
$$

*Triệt tiêu tại $\infty$ — phương pháp xấp xỉ*:

**Bước 1**: Với $f = \mathbf{1}_{[a,b]}$: $\hat{f}(\xi) = \frac{e^{-ia\xi} - e^{-ib\xi}}{i\xi} \to 0$ khi $|\xi| \to \infty$.

**Bước 2**: Bằng tuyến tính, kết quả mở rộng sang mọi simple function.

**Bước 3**: Với $f \in L^1$ tùy ý và $\varepsilon > 0$, chọn simple function $g$ với $\lVert f - g \rVert_1 < \varepsilon$. Khi đó:
$$
|\hat{f}(\xi)| \leq |\widehat{f-g}(\xi)| + |\hat{g}(\xi)| \leq \lVert f-g \rVert_1 + |\hat{g}(\xi)| < \varepsilon + |\hat{g}(\xi)|.
$$
Với $|\xi|$ đủ lớn, $|\hat{g}(\xi)| < \varepsilon$ (Bước 2). Vậy $|\hat{f}(\xi)| < 2\varepsilon$. $\blacksquare$

> [!warning] Remark 6.6 — $\hat{f}$ có thể **không** thuộc $L^1(\mathbb{R})$
> Riemann-Lebesgue cho $\hat{f} \in C_0$ nhưng **không** đảm bảo $\hat{f} \in L^1$. Ví dụ: $f = \mathbf{1}_{[0,1]}$ có $\hat{f}(\xi) = \frac{1 - e^{-i\xi}}{i\xi}$, giảm như $O(1/|\xi|)$ — không summable! Đây là lý do công thức nghịch đảo phức tạp hơn.

---

## Các Fourier Transform Kinh Điển

> [!example] Example 6.7 — Hàm Gaussian
> $f(x) = e^{-ax^2}$, $a > 0$. Fourier transform:
>
> $$
> \hat{f}(\xi) = \sqrt{\frac{\pi}{a}}\, e^{-\xi^2/(4a)}
> $$
>
> **Proof**: Tính $\hat{f}(\xi) = \int_{-\infty}^\infty e^{-ax^2 - ix\xi} dx$. Hoàn thiện bình phương: $ax^2 + ix\xi = a\left(x + \frac{i\xi}{2a}\right)^2 + \frac{\xi^2}{4a}$. Tích phân Gaussian dịch trong mặt phẳng phức (theo đường tích phân): $\int e^{-a(x+c)^2} dx = \sqrt{\pi/a}$. Kết quả: $\hat{f}(\xi) = e^{-\xi^2/(4a)} \sqrt{\pi/a}$. $\blacksquare$
>
> **Đặc biệt**: $a = 1/2$ cho $\hat{f}(\xi) = \sqrt{2\pi} e^{-\xi^2/2}$ — Gaussian là **eigenfunction** của Fourier transform!

> [!example] Example 6.8 — Hàm Chữ Nhật (Rectangular / Box Function)
> $f(x) = \mathbf{1}_{[-1,1]}(x)$ (hay $f = \Pi$ trong ký hiệu DSP). Fourier transform:
>
> $$
> \hat{f}(\xi) = \int_{-1}^{1} e^{-ix\xi} dx = \frac{2\sin\xi}{\xi} = 2\,\operatorname{sinc}(\xi/\pi) \cdot \pi
> $$
>
> (với $\operatorname{sinc}(t) = \sin(\pi t)/(\pi t)$). Lưu ý $\hat{f} \notin L^1$ dù $f \in L^1$.
>
> **Duality**: $\mathcal{F}^{-1}$ của hàm chữ nhật tần số $\mathbf{1}_{[-\Omega,\Omega]}$ chính là $\frac{\sin(\Omega x)}{\pi x}$ — liên quan trực tiếp đến Nyquist theorem (Lesson 12).

> [!example] Example 6.9 — Hàm Mũ Một Phía
> $f(x) = e^{-ax}\mathbf{1}_{[0,\infty)}$, $a > 0$. Fourier transform:
>
> $$
> \hat{f}(\xi) = \int_0^\infty e^{-ax} e^{-ix\xi} dx = \frac{1}{a + i\xi}
> $$
>
> Biên độ: $|\hat{f}(\xi)| = \frac{1}{\sqrt{a^2 + \xi^2}}$ — giảm như $1/|\xi|$ (phản ánh bất liên tục tại $x=0$).

> [!example] Example 6.10 — Triangle Function
> $f(x) = \max(1 - |x|, 0)$ (hàm lều tam giác). Fourier transform:
>
> $$
> \hat{f}(\xi) = \frac{4\sin^2(\xi/2)}{\xi^2} = \operatorname{sinc}^2(\xi/2\pi) \cdot 2\pi
> $$
>
> Giảm như $O(1/\xi^2)$ — nhanh hơn hàm chữ nhật (phản ánh $f$ liên tục nhưng $f'$ không liên tục).

---

## Fourier Inversion Theorem

> [!theorem] Theorem 6.11 — Fourier Inversion Theorem
> Nếu $f \in L^1(\mathbb{R})$ và $\hat{f} \in L^1(\mathbb{R})$, thì:
>
> $$
> f(x) = \frac{1}{2\pi} \int_{\mathbb{R}} \hat{f}(\xi)\, e^{ix\xi}\, d\xi \qquad \text{a.e. } x \in \mathbb{R}
> $$
>
> Tức là $\mathcal{F}^{-1}[\hat{f}] = f$ a.e.

> [!note] Remark 6.12 — Điều kiện $\hat{f} \in L^1$ là hạn chế
> Nhiều hàm $L^1$ quan trọng có Fourier transform **không** thuộc $L^1$ (ví dụ hàm chữ nhật). Để mở rộng inversion theorem sang $L^2$ và distributions, ta cần phát triển thêm lý thuyết (Lesson 08).

**Proof sketch** (trường hợp $f$ liên tục). Dùng Gaussian kernel $g_\varepsilon(x) = e^{-\varepsilon|\xi|^2/2}$ để regularize:

$$
\frac{1}{2\pi}\int \hat{f}(\xi) e^{ix\xi} g_\varepsilon(\xi) d\xi = \int f(y) k_\varepsilon(x-y) dy = (f * k_\varepsilon)(x)
$$

trong đó $k_\varepsilon$ là Gaussian kernel. Khi $\varepsilon \to 0$, $k_\varepsilon$ là approximate identity nên $(f * k_\varepsilon)(x) \to f(x)$. Đồng thời vế trái $\to \frac{1}{2\pi}\int \hat{f}(\xi) e^{ix\xi} d\xi$ bởi DCT (vì $\hat{f} \in L^1$). $\blacksquare$

> [!theorem] Theorem 6.13 — Multiplication Formula
> Với $f, g \in L^1(\mathbb{R})$:
>
> $$
> \int_{\mathbb{R}} \hat{f}(\xi)\, g(\xi)\, d\xi = \int_{\mathbb{R}} f(x)\, \hat{g}(x)\, dx
> $$
>
> Dùng để chứng minh nhiều kết quả về FT qua "duality argument".

---

## Quan Hệ giữa Fourier Series và Fourier Transform

> [!note] Remark 6.14 — Fourier Series vs Fourier Transform
>
> | Đặc điểm | Fourier Series | Fourier Transform |
> |----------|---------------|-------------------|
> | Domain của $f$ | $\mathbb{T} = [-\pi,\pi]$ (tuần hoàn) | $\mathbb{R}$ (không tuần hoàn) |
> | Phổ tần số | Rời rạc: $\hat{f}(n)$, $n \in \mathbb{Z}$ | Liên tục: $\hat{f}(\xi)$, $\xi \in \mathbb{R}$ |
> | Công thức phân tích | $\hat{f}(n) = \frac{1}{2\pi}\int e^{-inx} f(x) dx$ | $\hat{f}(\xi) = \int e^{-ix\xi} f(x) dx$ |
> | Công thức tổng hợp | $f(x) = \sum_n \hat{f}(n) e^{inx}$ | $f(x) = \frac{1}{2\pi}\int \hat{f}(\xi) e^{ix\xi} d\xi$ |
> | Parseval | $\sum_n \|\hat{f}(n)\|^2 = \|f\|_2^2$ | $\int \|\hat{f}(\xi)\|^2 d\xi = 2\pi\|f\|_2^2$ |

---

## Python — Fourier Transform và Bảng Biến Đổi

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.fft import fft, fftfreq, fftshift

# --- Tinh FT bang tich phan so (cho cac ham L1 dac biet) ---
def ft_numerical(f_func, xi_range, x_lim=20, n_points=4000):
    """Tinh FT(f)(xi) bang tich phan so."""
    x = np.linspace(-x_lim, x_lim, n_points)
    dx = x[1] - x[0]
    f_vals = f_func(x)
    results = []
    for xi in xi_range:
        integrand = f_vals * np.exp(-1j * x * xi)
        results.append(np.trapz(integrand, x))
    return np.array(results)

xi = np.linspace(-8, 8, 400)

fig, axes = plt.subplots(3, 2, figsize=(13, 10))

# --- Gaussian: FT cua Gaussian la Gaussian ---
a = 1.0
gauss = lambda x: np.exp(-a * x**2)
ft_gauss_exact = lambda xi: np.sqrt(np.pi/a) * np.exp(-xi**2/(4*a))
ft_gauss_num = ft_numerical(gauss, xi)

ax = axes[0, 0]; ax.set_title("Gaussian $f(x)=e^{-x^2}$")
x_plot = np.linspace(-4, 4, 300)
ax.plot(x_plot, gauss(x_plot), color='steelblue', label='$f(x)$')
ax.legend(); ax.set_xlabel('x')

ax = axes[0, 1]; ax.set_title(r"$\hat{f}(\xi) = \sqrt{\pi}e^{-\xi^2/4}$ — van Gaussian")
ax.plot(xi, np.real(ft_gauss_num), 'steelblue', linewidth=1.5, label='Numerical')
ax.plot(xi, ft_gauss_exact(xi), 'r--', linewidth=1, label='Exact')
ax.legend(); ax.set_xlabel(r'$\xi$')

# --- Ham chu nhat: FT la sinc ---
rect = lambda x: np.where(np.abs(x) <= 1, 1.0, 0.0)
ft_rect_exact = lambda xi: np.where(np.abs(xi) < 1e-10, 2.0,
                                     2*np.sin(xi)/xi)

ax = axes[1, 0]; ax.set_title("Ham chu nhat $f=\\mathbf{1}_{[-1,1]}$")
x_plot = np.linspace(-3, 3, 300)
ax.plot(x_plot, rect(x_plot), color='tomato', linewidth=2)
ax.set_xlabel('x'); ax.set_ylim(-0.2, 1.4)

ax = axes[1, 1]; ax.set_title(r"$\hat{f}(\xi) = 2\sin\xi/\xi$ — sinc (khong o L1!)")
ax.plot(xi, ft_rect_exact(xi), color='tomato', linewidth=1.5)
ax.axhline(0, color='k', linewidth=0.5); ax.set_xlabel(r'$\xi$')

# --- Riemann-Lebesgue: FT to dan den 0 tai vo cung ---
ax = axes[2, 0]; ax.set_title("Riemann-Lebesgue: $|\\hat{f}(\\xi)| \\to 0$ khi $|\\xi|\\to\\infty$")
funcs_rl = [
    ("Gaussian", lambda x: np.exp(-x**2), ft_gauss_exact),
    ("Chu nhat", lambda x: np.where(np.abs(x)<=1,1.,0.), ft_rect_exact),
    ("Mu mot phia", lambda x: np.where(x>=0, np.exp(-x), 0.),
     lambda xi: 1/np.sqrt(1+xi**2))
]
xi_long = np.linspace(-15, 15, 1000)
for (name, f, ft_exact), c in zip(funcs_rl, ['steelblue','tomato','green']):
    ax.plot(xi_long, np.abs(ft_exact(xi_long)), color=c, label=name, linewidth=1.2)
ax.legend(fontsize=8); ax.set_xlabel(r'$\xi$'); ax.set_ylabel(r'$|\hat{f}(\xi)|$')

# --- So sanh toc do giam ---
ax = axes[2, 1]; ax.set_title("Toc do giam: ham tron hon → FT giam nhanh hon")
xi_pos = np.linspace(0.5, 15, 300)
ax.semilogy(xi_pos, 2/xi_pos, 'tomato', label='Chu nhat: O(1/ξ)', linewidth=1.5)
ax.semilogy(xi_pos, 4/xi_pos**2, 'steelblue', label='Tam giac: O(1/ξ²)', linewidth=1.5)
ax.semilogy(xi_pos, np.exp(-xi_pos**2/4)*np.sqrt(np.pi), 'green',
            label='Gaussian: nhanh hon moi luy thua', linewidth=1.5)
ax.legend(fontsize=8); ax.set_xlabel(r'$\xi$'); ax.set_ylabel(r'$|\hat{f}(\xi)|$ (log)')
ax.grid(True, alpha=0.3)

plt.suptitle("Fourier Transform trên L¹(ℝ)", fontsize=13)
plt.tight_layout()
plt.savefig("fourier_transform_l1.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Fourier Transform** $\hat{f}(\xi) = \int f(x) e^{-ix\xi} dx$ xác định được và hữu hạn với mọi $f \in L^1(\mathbb{R})$.
- **Riemann-Lebesgue Lemma**: $\mathcal{F}: L^1 \to C_0$ — FT của hàm $L^1$ là hàm liên tục triệt tiêu tại $\infty$. Bound: $\lVert \hat{f} \rVert_\infty \leq \lVert f \rVert_1$.
- **Tính chất**: shift → phase ($e^{-ih\xi}$), modulation → shift, đạo hàm → nhân $i\xi$, nhân $x$ → đạo hàm FT — đây là power thực sự của Fourier method.
- **Tốc độ giảm của $\hat{f}$** phản ánh độ trơn của $f$: Gaussian $\Rightarrow$ rapid decay; không liên tục $\Rightarrow$ $O(1/\xi)$; liên tục, $f'$ không liên tục $\Rightarrow$ $O(1/\xi^2)$.
- **Fourier Inversion**: $f = \mathcal{F}^{-1}[\hat{f}]$ khi $f, \hat{f} \in L^1$ — cần điều kiện thêm vì $f \in L^1 \not\Rightarrow \hat{f} \in L^1$.
- **Gaussian**: eigenfunction của $\mathcal{F}$ — $e^{-x^2/2}$ là điểm cố định. Đây là lý do Gaussian xuất hiện khắp nơi trong toán và vật lý.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 5.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Körner, T. W. *Fourier Analysis*. Cambridge, 1988. Chương 22–28.
- Xem chứng minh đầy đủ Riemann-Lebesgue: [[a0-riemann-lebesgue|A0. Proof of Riemann-Lebesgue Lemma]]
