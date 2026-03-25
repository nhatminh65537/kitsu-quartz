---
title: "07. Convolution & Phép Biến Đổi"
tags: [math, fourier-analysis, convolution, pde, lesson-07]
aliases: [Convolution, Approximate Identity, Heat Equation]
created: 2026-03-24
---

> **Prerequisites**: [[06-fourier-transform-l1|06. Fourier Transform trên L¹]] — Fourier transform, tính chất; [[02-lebesgue-integral-lp|02. L^p spaces]] — Fubini, Hölder
> **Objectives**:
> - Định nghĩa convolution và chứng minh Convolution Theorem ($\widehat{f * g} = \hat{f}\cdot\hat{g}$)
> - Hiểu approximate identity và cơ chế xấp xỉ trong $L^p$
> - Chứng minh Gaussian là approximate identity quan trọng nhất
> - Giải phương trình nhiệt (heat equation) bằng Fourier transform + convolution
> - Hiểu "smoothing effect" của convolution với Gaussian kernel

---

## Motivation / Intuition

**Convolution** là phép toán $f * g(x) = \int f(y) g(x-y) dy$ — "trượt" $g$ dọc theo $f$ và lấy tích phân overlap. Đây là một trong những phép toán trung tâm của phân tích Fourier vì lý do đặc biệt:

> **Convolution Theorem**: Fourier transform biến convolution thành **nhân điểm** (pointwise multiplication).
> $$
> \widehat{f * g} = \hat{f} \cdot \hat{g}
> $$

Điều này có nghĩa là nhiều phép tính phức tạp trong "miền không gian" (spatial domain) trở thành đơn giản trong "miền tần số" (frequency domain). Đây là lý do tại sao:
- **Lọc tín hiệu** (filtering) = nhân FT với một hàm mask
- **Giải PDE** = áp dụng FT, giải ODE đơn giản, rồi nghịch đảo
- **Gaussian smoothing** = convolution với Gaussian kernel

---

## Convolution trên $\mathbb{R}$

### Định nghĩa và Tính Tồn Tại

> [!definition] Definition 7.1 — Convolution
> Với $f, g: \mathbb{R} \to \mathbb{C}$, **convolution** (tích chập) của $f$ và $g$ là:
>
> $$
> (f * g)(x) = \int_{\mathbb{R}} f(y)\, g(x - y)\, dy
> $$
>
> khi tích phân tồn tại.

> [!theorem] Theorem 7.2 — Tính tồn tại và Young's Convolution Inequality
> Cho $1 \leq p, q, r \leq \infty$ với $\frac{1}{p} + \frac{1}{q} = 1 + \frac{1}{r}$. Nếu $f \in L^p(\mathbb{R})$ và $g \in L^q(\mathbb{R})$ thì $(f * g)(x)$ tồn tại a.e., $f * g \in L^r(\mathbb{R})$, và:
>
> $$
> \lVert f * g \rVert_r \leq \lVert f \rVert_p \lVert g \rVert_q
> $$
>
> **Trường hợp đặc biệt quan trọng**: $p=q=1$, $r=1$ $\Rightarrow$ $\lVert f * g \rVert_1 \leq \lVert f \rVert_1 \lVert g \rVert_1$.

> [!theorem] Theorem 7.3 — Tính chất của Convolution
> Với $f, g, h \in L^1(\mathbb{R})$:
>
> 1. **(Giao hoán)** $f * g = g * f$
> 2. **(Kết hợp)** $(f * g) * h = f * (g * h)$
> 3. **(Phân phối)** $f * (g + h) = f * g + f * h$
> 4. **(Dịch chuyển)** $\tau_h(f * g) = (\tau_h f) * g = f * (\tau_h g)$ trong đó $\tau_h f(x) = f(x-h)$
> 5. **(Làm trơn)** Nếu $g \in C^k$ và $D^\alpha g \in L^1$ với $|\alpha| \leq k$ thì $f * g \in C^k$ và $D^\alpha(f * g) = f * D^\alpha g$

**Proof của (5).** Đạo hàm dưới dấu tích phân bằng DCT:
$$
\frac{d}{dx}(f*g)(x) = \frac{d}{dx}\int f(y) g(x-y) dy = \int f(y) g'(x-y) dy = (f * g')(x). \quad \blacksquare
$$

> [!note] Remark 7.4 — Smoothing Effect
> Tính chất (5) rất quan trọng: **convolution f với hàm trơn g làm trơn kết quả**, bất kể $f$ xấu đến đâu. Ví dụ: $f \in L^1$ và $g \in C^\infty_c$ $\Rightarrow$ $f * g \in C^\infty$. Đây là nguyên lý đằng sau Gaussian smoothing trong image processing.

---

## Convolution Theorem

> [!theorem] Theorem 7.5 — Convolution Theorem
> Với $f, g \in L^1(\mathbb{R})$, ta có $f * g \in L^1(\mathbb{R})$ và:
>
> $$
> \widehat{f * g}(\xi) = \hat{f}(\xi) \cdot \hat{g}(\xi)
> $$
>
> Equivalently: **convolution trong miền $x$ = multiplication trong miền $\xi$**.

**Proof.** Dùng Fubini (điều kiện thỏa vì $f, g \in L^1$):

$$
\widehat{f * g}(\xi) = \int \left(\int f(y) g(x-y) dy\right) e^{-ix\xi} dx = \int f(y) \left(\int g(x-y) e^{-ix\xi} dx\right) dy.
$$

Tích phân trong: đặt $z = x - y$, $\int g(z) e^{-i(z+y)\xi} dz = e^{-iy\xi} \hat{g}(\xi)$. Vậy:

$$
\widehat{f * g}(\xi) = \int f(y) e^{-iy\xi} \hat{g}(\xi) dy = \hat{f}(\xi) \cdot \hat{g}(\xi). \quad \blacksquare
$$

> [!corollary] Corollary 7.6 — Tương quan (Correlation)
> Định nghĩa **cross-correlation**: $(f \star g)(x) = \int \overline{f(y)} g(x+y) dy$. Khi đó:
>
> $$
> \widehat{f \star g}(\xi) = \overline{\hat{f}(\xi)} \cdot \hat{g}(\xi)
> $$
>
> **Autocorrelation** $f \star f$: $\widehat{f \star f}(\xi) = |\hat{f}(\xi)|^2$ — power spectral density.

---

## Approximate Identity

### Định nghĩa

> [!definition] Definition 7.7 — Approximate Identity
> Một họ hàm $\{k_\varepsilon\}_{\varepsilon > 0} \subseteq L^1(\mathbb{R})$ được gọi là **approximate identity** (xấp xỉ đơn vị) nếu:
>
> 1. $\displaystyle\int_{\mathbb{R}} k_\varepsilon(x)\, dx = 1$ với mọi $\varepsilon > 0$
>
> 2. $\displaystyle\int_{\mathbb{R}} |k_\varepsilon(x)|\, dx \leq M$ bị chặn bởi một hằng số $M$ độc lập với $\varepsilon$
>
> 3. Với mọi $\delta > 0$: $\displaystyle\int_{|x|>\delta} |k_\varepsilon(x)|\, dx \to 0$ khi $\varepsilon \to 0$
>
> (Điều kiện (3): "khối lượng" tập trung gần $0$ khi $\varepsilon \to 0$.)

> [!theorem] Theorem 7.8 — Approximate Identity hội tụ
> Nếu $\{k_\varepsilon\}$ là approximate identity và $f \in L^p(\mathbb{R})$, $1 \leq p < \infty$, thì:
>
> $$
> \lVert f * k_\varepsilon - f \rVert_p \to 0 \quad \text{khi } \varepsilon \to 0
> $$
>
> Nếu $f$ liên tục tại $x_0$ thì $(f * k_\varepsilon)(x_0) \to f(x_0)$.

**Proof.** Viết $(f * k_\varepsilon)(x) - f(x) = \int [f(x-y) - f(x)] k_\varepsilon(y) dy$. Với $f$ liên tục tại $x$, với $\varepsilon$ nhỏ, $k_\varepsilon$ tập trung gần $0$ nên $f(x-y) \approx f(x)$ trong vùng tích phân đáng kể. Đối với trường hợp $L^p$: dùng tính liên tục translation mạnh (strong continuity) của $L^p$: $\lVert \tau_y f - f \rVert_p \to 0$ khi $y \to 0$. $\blacksquare$

### Gaussian Kernel là Approximate Identity

> [!example] Example 7.9 — Gaussian Approximate Identity
> Định nghĩa **Gaussian kernel** (heat kernel):
>
> $$
> H_t(x) = \frac{1}{\sqrt{4\pi t}} e^{-x^2/(4t)}, \quad t > 0
> $$
>
> **Tính chất**:
> - $\int H_t(x) dx = 1$ (tích phân Gaussian chuẩn)
> - $\hat{H}_t(\xi) = e^{-t\xi^2}$ (từ Example 6.7 với $a = 1/(4t)$)
> - $\{H_t\}_{t>0}$ là **positive approximate identity** khi $t \to 0^+$
>
> Do đó $f * H_t \to f$ trong $L^p$ khi $t \to 0^+$.

---

## Ứng Dụng: Giải Phương Trình Nhiệt

> [!example] Example 7.10 — Heat Equation via Fourier Transform
> Giải phương trình nhiệt trên $\mathbb{R}$:
>
> $$
> \begin{cases}
> \dfrac{\partial u}{\partial t} = \dfrac{\partial^2 u}{\partial x^2}, & x \in \mathbb{R},\; t > 0 \\
> u(x, 0) = f(x), & x \in \mathbb{R}
> \end{cases}
> $$
>
> **Giải bằng Fourier transform** theo $x$: đặt $\hat{u}(t, \xi) = \mathcal{F}_x[u(\cdot, t)](\xi)$.
>
> Áp dụng tính chất đạo hàm (Theorem 6.3(5)):
>
> $$
> \frac{\partial \hat{u}}{\partial t} = \mathcal{F}\left[\frac{\partial^2 u}{\partial x^2}\right](\xi) = (i\xi)^2 \hat{u} = -\xi^2 \hat{u}
> $$
>
> Đây là ODE đơn giản theo $t$: $\hat{u}(t, \xi) = \hat{u}(0, \xi) e^{-\xi^2 t} = \hat{f}(\xi) e^{-\xi^2 t}$.
>
> Áp dụng Convolution Theorem ngược: $e^{-\xi^2 t} = \hat{H}_t(\xi)$, nên:
>
> $$
> u(x, t) = \mathcal{F}^{-1}\left[\hat{f}(\xi) e^{-\xi^2 t}\right](x) = (f * H_t)(x) = \frac{1}{\sqrt{4\pi t}} \int_{-\infty}^\infty f(y) e^{-(x-y)^2/(4t)} dy
> $$
>
> **Ý nghĩa vật lý**: Nhiệt độ tại điểm $x$ lúc $t$ là trung bình có trọng số Gaussian của nhiệt độ ban đầu — Gaussian làm "mờ" (blur) phân bố nhiệt độ ban đầu.

> [!note] Remark 7.11 — Semigroup Property
> Heat kernels thỏa **semigroup property**: $H_s * H_t = H_{s+t}$. Proof: $\hat{H}_s \cdot \hat{H}_t = e^{-s\xi^2} \cdot e^{-t\xi^2} = e^{-(s+t)\xi^2} = \hat{H}_{s+t}$.
>
> Điều này phản ánh tính chất của quá trình khuếch tán: khuếch tán trong $s$ đơn vị thời gian rồi $t$ đơn vị = khuếch tán trong $s+t$ đơn vị.

---

## Ứng Dụng: Lọc Tín Hiệu (Signal Filtering)

> [!note] Remark 7.12 — Filter trong Miền Tần Số
> Một **linear time-invariant filter** là convolution với kernel $h$: $y = x * h$. Trong miền FT:
>
> $$
> \hat{y}(\xi) = \hat{x}(\xi) \cdot \hat{h}(\xi)
> $$
>
> $\hat{h}(\xi)$ gọi là **frequency response** hay **transfer function** của filter.
>
> - **Low-pass filter**: $\hat{h}(\xi) = \mathbf{1}_{[-\Omega,\Omega]}$ → chỉ giữ tần số thấp (làm mờ)
> - **High-pass filter**: $\hat{h}(\xi) = 1 - \mathbf{1}_{[-\Omega,\Omega]}$ → chỉ giữ tần số cao (cạnh sắc)
> - **Gaussian filter**: $\hat{h}(\xi) = e^{-\xi^2/(2\sigma^2)}$ → làm trơn liên tục
>
> Thiết kế filter = thiết kế $\hat{h}$, sau đó tìm $h = \mathcal{F}^{-1}[\hat{h}]$.

---

## Python — Convolution và Heat Equation

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import convolve

x = np.linspace(-6, 6, 1000)
dx = x[1] - x[0]
N = len(x)

# --- Gaussian approximate identity ---
def gaussian_kernel(t, x):
    return np.exp(-x**2/(4*t)) / np.sqrt(4*np.pi*t)

# --- Convolution Theorem demo ---
f = np.where(np.abs(x) <= 1, 1.0, 0.0)   # ham chu nhat
g = np.exp(-x**2)                           # Gaussian

# Convolution direct
fg_conv = np.convolve(f, g, mode='same') * dx

# Convolution via FFT (Convolution Theorem)
F = np.fft.fft(f)
G = np.fft.fft(g)
fg_fft = np.real(np.fft.ifft(F * G)) * dx

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

ax = axes[0, 0]
ax.plot(x, f, 'steelblue', linewidth=1.5, label='$f$ (chu nhat)')
ax.plot(x, g, 'tomato', linewidth=1.5, label='$g$ (Gaussian)')
ax.plot(x, fg_conv, 'green', linewidth=2, label='$f*g$')
ax.legend(); ax.set_title("Convolution trong mien x")

# FT magnitude spectrum
xi = np.fft.fftfreq(N, d=dx/(2*np.pi))
xi_shift = np.fft.fftshift(xi)
F_shift = np.fft.fftshift(np.abs(F)*dx)
G_shift = np.fft.fftshift(np.abs(G)*dx)
FG_shift = np.fft.fftshift(np.abs(F*G)*dx**2)
mask = np.abs(xi_shift) < 10

ax = axes[0, 1]
ax.plot(xi_shift[mask], F_shift[mask], 'steelblue', label='|F(f)|')
ax.plot(xi_shift[mask], G_shift[mask], 'tomato', label='|F(g)|')
ax.plot(xi_shift[mask], FG_shift[mask], 'green', label='|F(f)|·|F(g)| = |F(f*g)|')
ax.legend(fontsize=9); ax.set_title("Convolution Theorem: nhân trong mien xi")

# --- Heat equation ---
f_init = np.where(np.abs(x) <= 1, 1.0, 0.0)  # nhiet do ban dau

ax = axes[1, 0]
ax.plot(x, f_init, 'k', linewidth=2, label='t=0')
colors = ['steelblue', 'tomato', 'green', 'purple']
for t, c in zip([0.05, 0.2, 0.5, 1.5], colors):
    H_t = gaussian_kernel(t, x)
    u_t = np.convolve(f_init, H_t, mode='same') * dx
    ax.plot(x, u_t, color=c, linewidth=1.5, label=f't={t}')
ax.legend(fontsize=9); ax.set_title("Heat equation: f * H_t khi t tăng")
ax.set_xlabel('x'); ax.set_ylabel('u(x,t)')

# --- Lọc tín hiệu: low-pass vs Gaussian ---
xi_fft = np.fft.fftfreq(N, d=dx)
signal = np.sign(np.sin(2*np.pi*x)) + 0.3*np.random.randn(N)  # noisy square wave
Signal = np.fft.fft(signal)

# Low-pass filter (cung cut-off)
cutoff_hz = 1.5
mask_lp = np.abs(xi_fft) < cutoff_hz
signal_lp = np.real(np.fft.ifft(Signal * mask_lp))

# Gaussian filter (tuong duong smoothing)
sigma = 0.3
H_gauss = np.exp(-2*(np.pi*xi_fft*sigma)**2)
signal_gauss = np.real(np.fft.ifft(Signal * H_gauss))

ax = axes[1, 1]
ax.plot(x, signal, 'gray', linewidth=0.7, alpha=0.5, label='Tin hieu + nhieu')
ax.plot(x, signal_lp, 'steelblue', linewidth=1.5, label='Low-pass filter')
ax.plot(x, signal_gauss, 'tomato', linewidth=1.5, label='Gaussian filter')
ax.legend(fontsize=9); ax.set_title("Loc tin hieu: Low-pass vs Gaussian")
ax.set_xlabel('x')

plt.suptitle("Convolution, Approximate Identity & Ứng Dụng", fontsize=13)
plt.tight_layout()
plt.savefig("convolution_apps.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Convolution** $(f*g)(x) = \int f(y) g(x-y) dy$ — "trượt và overlap". Young's inequality: $\lVert f*g \rVert_r \leq \lVert f \rVert_p \lVert g \rVert_q$.
- **Convolution Theorem**: $\widehat{f*g} = \hat{f} \cdot \hat{g}$ — đây là tính chất then chốt của FT, biến phép toán tích chập thành nhân đơn giản.
- **Smoothing effect**: $f * g \in C^k$ nếu $g \in C^k$, bất kể $f$ xấu thế nào — convolution "di chuyển" sự trơn từ kernel sang kết quả.
- **Approximate identity** $\{k_\varepsilon\}$: $\int k_\varepsilon = 1$, tập trung gần $0$ khi $\varepsilon \to 0$ $\Rightarrow$ $f * k_\varepsilon \to f$ trong $L^p$.
- **Gaussian kernel** $H_t = \frac{1}{\sqrt{4\pi t}} e^{-x^2/(4t)}$: $\hat{H}_t(\xi) = e^{-t\xi^2}$; positive approximate identity; thỏa semigroup property $H_s * H_t = H_{s+t}$.
- **Heat equation**: $u_t = u_{xx}$ → $u(x,t) = f * H_t$ — FT biến PDE thành ODE, giải bằng convolution.
- **Signal filtering**: filter = convolution với kernel; thiết kế filter = thiết kế frequency response $\hat{h}$.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 5.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Evans, L. C. *Partial Differential Equations* (2nd ed.). AMS, 2010. Chương 2 (heat equation).
