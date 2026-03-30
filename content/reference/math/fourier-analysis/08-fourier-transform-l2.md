---
title: "08. Fourier Transform trên L² & Định Lý Plancherel"
tags: [math, fourier-analysis, fourier-transform, l2-theory, plancherel, schwartz-space, lesson-08]
aliases: [Fourier Transform L2, Plancherel, Schwartz Space]
created: 2026-03-24
---

> **Prerequisites**: [[06-fourier-transform-l1|06. FT trên L¹]] — tính chất FT, Riemann-Lebesgue; [[07-convolution|07. Convolution]] — Gaussian kernel, approximate identity; [[05-l2-theory|05. Lý thuyết L²]] — Hilbert space, Parseval
> **Objectives**:
> - Định nghĩa Schwartz space $\mathcal{S}(\mathbb{R})$ và chứng minh $\mathcal{F}: \mathcal{S} \to \mathcal{S}$ là isomorphism
> - Phát biểu và chứng minh định lý Plancherel: $\lVert \hat{f} \rVert_2 = \sqrt{2\pi}\lVert f \rVert_2$
> - Mở rộng Fourier transform sang $L^2(\mathbb{R})$ bằng density argument
> - Hiểu Fourier transform như **unitary operator** trên $L^2$
> - Nắm Heisenberg Uncertainty Principle và ý nghĩa

---

## Motivation / Intuition

Ở Lesson 06, FT trên $L^1$ có vấn đề cơ bản: $\hat{f}$ có thể **không** thuộc $L^1$, nên nghịch đảo FT đòi hỏi điều kiện ngặt. Đối với $L^2$, câu chuyện đẹp hơn nhiều:

> Fourier transform mở rộng thành một **unitary operator** trên $L^2(\mathbb{R})$ — bảo toàn norm, inner product, và có nghịch đảo hoàn hảo. Đây là định lý Plancherel, tương tự hệ thức Parseval cho Fourier series.

Để chứng minh điều này, ta cần một "cầu nối" giữa $L^1$ và $L^2$ — đó là **Schwartz space** $\mathcal{S}(\mathbb{R})$, không gian của các hàm trơn giảm nhanh.

---

## Schwartz Space $\mathcal{S}(\mathbb{R})$

### Định nghĩa

> [!definition] Definition 8.1 — Schwartz Space
> **Schwartz space** $\mathcal{S}(\mathbb{R})$ là tập các hàm $f \in C^\infty(\mathbb{R})$ thỏa điều kiện:
>
> $$
> \sup_{x \in \mathbb{R}} |x|^m |f^{(k)}(x)| < \infty \qquad \forall\, m, k \geq 0
> $$
>
> Nói cách khác, $f$ và tất cả đạo hàm của nó **giảm nhanh hơn mọi lũy thừa** của $|x|$ tại vô cùng.

> [!example] Example 8.2 — Ví dụ Schwartz functions
> - $f(x) = e^{-ax^2}$ với $a > 0$: mọi đạo hàm là Gaussian × polynomial, giảm nhanh ✓
> - $f(x) = P(x) e^{-|x|}$ với $P$ là đa thức: trơn, giảm theo hàm mũ ✓
> - $f(x) = \frac{1}{1+x^2}$: **không** trong $\mathcal{S}$ — giảm chỉ $O(1/x^2)$, không đủ nhanh
> - $f(x) = \mathbf{1}_{[-1,1]}(x)$: **không** trong $\mathcal{S}$ — không trơn

> [!theorem] Theorem 8.3 — Tính chất của $\mathcal{S}$
> 1. $\mathcal{S}(\mathbb{R}) \subseteq L^p(\mathbb{R})$ với mọi $1 \leq p \leq \infty$
> 2. $C_c^\infty(\mathbb{R}) \subseteq \mathcal{S}(\mathbb{R})$ (hàm trơn compact support)
> 3. $\mathcal{S}$ đóng với phép nhân đa thức, vi phân, và phép toán thông thường
> 4. $\mathcal{S}$ **dense** trong $L^p(\mathbb{R})$ với $1 \leq p < \infty$ — và dense trong $L^2(\mathbb{R})$

---

## Fourier Transform trên $\mathcal{S}$

> [!theorem] Theorem 8.4 — $\mathcal{F}: \mathcal{S} \to \mathcal{S}$ là Automorphism
> Fourier transform $\mathcal{F}$ ánh xạ $\mathcal{S}(\mathbb{R})$ vào chính nó: $\mathcal{F}: \mathcal{S} \to \mathcal{S}$.
>
> Hơn nữa, $\mathcal{F}: \mathcal{S} \to \mathcal{S}$ là **bijection** với nghịch đảo $\mathcal{F}^{-1}$.

**Proof.** Với $f \in \mathcal{S}$ và $\hat{f}(\xi) = \int f(x) e^{-ix\xi} dx$:

- **Trơn của $\hat{f}$**: $\xi^k \hat{f}(\xi) = \int (-ix)^k f(x) e^{-ix\xi} dx = \int [\partial^k f(x)/\partial x^k \text{ related terms}]$... Cụ thể: $\hat{f}^{(m)}(\xi) = \widehat{(-ix)^m f(x)}$, và $(-ix)^m f(x) \in \mathcal{S}$ nên $\hat{f}^{(m)}$ tồn tại và liên tục.

- **Giảm nhanh của $\hat{f}$**: Tích phân by parts dùng $f \in \mathcal{S}$: $(i\xi)^k \hat{f}(\xi) = \widehat{f^{(k)}}(\xi)$, và $\lVert \widehat{f^{(k)}} \rVert_\infty \leq \lVert f^{(k)} \rVert_1 < \infty$. Vậy $|\xi|^k |\hat{f}(\xi)| \leq C_{k}$ với mọi $k$ — tức $\hat{f}$ giảm nhanh. $\blacksquare$

> [!example] Example 8.5 — Gaussian là Eigenfunction
> Xét $f(x) = e^{-x^2/2}$. Từ Example 6.7 với $a = 1/2$: $\hat{f}(\xi) = \sqrt{2\pi} e^{-\xi^2/2}$.
>
> Sau chuẩn hóa: $\phi(x) = (2\pi)^{-1/4} e^{-x^2/2}$ là eigenfunction của $\mathcal{F}$ với eigenvalue $1$. Thực tế, $\mathcal{F}$ trên $L^2$ có bốn eigenvalue là $1, -i, -1, i$ — gốc thứ 4 của đơn vị.

---

## Định Lý Plancherel

> [!theorem] Theorem 8.6 — Plancherel's Theorem
> **(a)** Với mọi $f \in \mathcal{S}(\mathbb{R})$:
>
> $$
> \lVert \hat{f} \rVert_{L^2}^2 = 2\pi \lVert f \rVert_{L^2}^2
> $$
>
> Hay dạng inner product:
>
> $$
> \langle \hat{f}, \hat{g} \rangle_{L^2} = 2\pi \langle f, g \rangle_{L^2} \qquad \forall\, f, g \in \mathcal{S}
> $$
>
> **(b)** Fourier transform $\mathcal{F}|_{\mathcal{S}}$ mở rộng duy nhất thành một **bounded linear operator** $\mathcal{F}: L^2(\mathbb{R}) \to L^2(\mathbb{R})$, và phép mở rộng này là **unitary** (khi chuẩn hóa bỏ hệ số $2\pi$).
>
> **(c)** Cụ thể, định nghĩa $\tilde{\mathcal{F}}f = \mathcal{F}f / \sqrt{2\pi}$, thì:
>
> $$
> \lVert \tilde{\mathcal{F}} f \rVert_{L^2} = \lVert f \rVert_{L^2} \qquad \forall\, f \in L^2(\mathbb{R})
> $$

**Proof của (a) trên $\mathcal{S}$.** Dùng Multiplication Formula (Theorem 6.13) với $g = \mathcal{F}^{-1}[\bar{\hat{f}}] = \bar{f}(-\cdot)$:

$$
\int |\hat{f}(\xi)|^2 d\xi = \int \hat{f}(\xi) \overline{\hat{f}(\xi)} d\xi.
$$

Áp dụng Multiplication Formula $\int \hat{f} \cdot g = \int f \cdot \hat{g}$ với $g(\xi) = \overline{\hat{f}(\xi)}$, và dùng Fourier Inversion:
$$
= \int f(x) \mathcal{F}[\bar{\hat{f}}](x) dx = 2\pi \int f(x) \overline{f(x)} dx = 2\pi \lVert f \rVert_2^2. \quad \blacksquare
$$

**Proof của (b) — Extension bằng density.** $\mathcal{S}$ dense trong $L^2$. Với $f \in L^2$, chọn $f_n \in \mathcal{S}$ với $\lVert f_n - f \rVert_2 \to 0$. Từ (a): $\lVert \hat{f}_m - \hat{f}_n \rVert_2 = \sqrt{2\pi} \lVert f_m - f_n \rVert_2 \to 0$, nên $\{\hat{f}_n\}$ Cauchy trong $L^2$. Định nghĩa $\hat{f} = \lim \hat{f}_n$ trong $L^2$. $\blacksquare$

> [!note] Remark 8.7 — Hệ số $\sqrt{2\pi}$
> Hệ số $2\pi$ xuất hiện do convention $\hat{f}(\xi) = \int f e^{-i\xi x} dx$. Nếu dùng convention vật lý $\hat{f}(\xi) = \int f e^{-2\pi i\xi x} dx$ thì Plancherel có dạng $\lVert \hat{f} \rVert_2 = \lVert f \rVert_2$ không có hệ số. Phụ lục A1 trình bày chi tiết xem [[a1-plancherel-theorem|A1. Plancherel Theorem]].

---

## Fourier Transform như Unitary Operator trên $L^2$

> [!theorem] Theorem 8.8 — FT là Unitary Operator
> Chuẩn hóa $\tilde{f}(\xi) = \frac{1}{\sqrt{2\pi}} \hat{f}(\xi)$. Khi đó $\mathcal{F}: L^2 \to L^2$ thỏa:
>
> 1. $\mathcal{F}$ là bounded linear operator: $\lVert \mathcal{F}f \rVert_2 = \lVert f \rVert_2$
>
> 2. $\mathcal{F}$ là bijection: $\mathcal{F}$ surjective và injective
>
> 3. **Inversion formula** trong $L^2$: $(\mathcal{F}^{-1} g)(x) = \overline{\mathcal{F}[\bar{g}(-\cdot)](x)}$ hay đơn giản $(\mathcal{F}^{-1} g)(x) = \frac{1}{2\pi}\int g(\xi) e^{ix\xi} d\xi$ (giới hạn $L^2$)
>
> 4. **Inner product preservation**: $\langle \mathcal{F}f, \mathcal{F}g \rangle = \langle f, g \rangle$ trong $L^2$

> [!example] Example 8.9 — Tính $\hat{f}$ của hàm không thuộc $L^1$
> Xét $f(x) = \frac{\sin(ax)}{x} \in L^2(\mathbb{R})$ nhưng $\notin L^1(\mathbb{R})$ (với $a > 0$).
>
> Bằng định nghĩa $L^2$ của FT (xấp xỉ bởi $f_N = f \cdot \mathbf{1}_{[-N,N]}$):
>
> $$
> \hat{f}(\xi) = \pi \cdot \mathbf{1}_{[-a,a]}(\xi)
> $$
>
> Kiểm tra Plancherel: $\lVert f \rVert_2^2 = \int_0^\infty \frac{\sin^2(ax)}{x^2} dx \cdot 2 = \pi a$, và $\lVert \hat{f} \rVert_2^2 = \pi^2 \cdot 2a$. Thỏa $\lVert \hat{f} \rVert_2^2 = 2\pi \lVert f \rVert_2^2 = 2\pi^2 a$. ✓

---

## Heisenberg Uncertainty Principle

> [!theorem] Theorem 8.10 — Bất Đẳng Thức Heisenberg-Weyl
> Với mọi $f \in L^2(\mathbb{R})$ với $\lVert f \rVert_2 = 1$ và $xf, \xi \hat{f} \in L^2$:
>
> $$
> \left(\int x^2 |f(x)|^2 \, dx\right) \cdot \left(\int \xi^2 |\hat{f}(\xi)|^2 \, \frac{d\xi}{2\pi}\right) \geq \frac{1}{4}
> $$
>
> Hay viết gọn với **độ lệch chuẩn** $\Delta x = \sqrt{\int x^2 |f|^2 dx}$ và $\Delta \xi = \sqrt{\frac{1}{2\pi}\int \xi^2 |\hat{f}|^2 d\xi}$:
>
> $$
> \Delta x \cdot \Delta \xi \geq \frac{1}{2}
> $$
>
> **Đẳng thức đạt được khi và chỉ khi** $f$ là Gaussian: $f(x) = Ce^{-ax^2}$ với $C, a > 0$.

**Proof.** Dùng tích phân by parts và Cauchy-Schwarz. Gọi $A = \int x^2 |f|^2 dx$ và $B = \frac{1}{2\pi}\int \xi^2 |\hat{f}|^2 d\xi = \int |f'|^2 dx$ (dùng Plancherel cho $\hat{f'}(\xi) = i\xi\hat{f}(\xi)$). Cần chứng minh $AB \geq 1/4$.

Tích phân by parts với $\lVert f \rVert_2 = 1$:

$$
1 = \int |f|^2 dx = -\int x (f \bar{f})' dx = -\int x (f' \bar{f} + f \bar{f}') dx = -2\operatorname{Re}\int x f' \bar{f}\, dx.
$$

Cauchy-Schwarz: $1 \leq 2 \left|\int x f' \bar{f}\right| \leq 2\sqrt{\int x^2 |f|^2}\sqrt{\int |f'|^2} = 2\sqrt{AB}$. Vậy $AB \geq 1/4$. $\blacksquare$

> [!note] Remark 8.11 — Ý nghĩa vật lý
> Trong cơ học lượng tử, $|f(x)|^2$ là xác suất tìm hạt tại vị trí $x$, và $|\hat{f}(\xi)|^2/(2\pi)$ là xác suất tại động lượng $\hbar\xi$. Uncertainty Principle phát biểu:
>
> $$
> \Delta x \cdot \Delta p \geq \frac{\hbar}{2}
> $$
>
> Không thể đồng thời biết chính xác vị trí và động lượng — điều này không phải giới hạn kỹ thuật mà là **bản chất toán học** của Fourier transform.

---

## Paley-Wiener Theorem (Preview)

> [!theorem] Theorem 8.12 — Paley-Wiener (phác thảo)
> Hàm $f \in L^2(\mathbb{R})$ có **support compact** $\subseteq [-R, R]$ khi và chỉ khi $\hat{f}$ mở rộng thành hàm **entire** trên $\mathbb{C}$ (hàm giải tích trên toàn mặt phẳng phức) thỏa điều kiện tăng trưởng phù hợp.
>
> **Hệ quả**: Hàm với compact support trong $x$-domain có FT "trải dài" vô hạn trong $\xi$-domain — minh họa nguyên tắc bất định theo nghĩa khác.

---

## Python — Plancherel và Uncertainty Principle

```python
import numpy as np
import matplotlib.pyplot as plt

N = 4096
x = np.linspace(-20, 20, N)
dx = x[1] - x[0]

def ft_l2(f_vals, x):
    """FT bằng FFT, chuẩn hóa để approximate continuous FT."""
    dx = x[1] - x[0]
    N = len(x)
    xi = np.fft.fftfreq(N, d=dx) * 2 * np.pi  # radian/unit
    return np.fft.fft(f_vals) * dx, np.fft.fftshift(xi)

# --- Kiem tra Plancherel ---
print("=== Kiem tra dinh ly Plancherel ===")
funcs = [
    ("Gaussian e^{-x^2}", lambda x: np.exp(-x**2)),
    ("e^{-|x|}", lambda x: np.exp(-np.abs(x))),
    ("sin(3x)e^{-x^2/2}", lambda x: np.sin(3*x)*np.exp(-x**2/2)),
]

for name, f_func in funcs:
    f = f_func(x)
    F, xi = ft_l2(f, x)
    dxi = xi[1] - xi[0] if len(xi) > 1 else 1
    # Dung fftshift cho tinh toan chinh xac hon
    norm_f2  = np.trapz(np.abs(f)**2, x)
    norm_F2  = np.trapz(np.abs(np.fft.fftshift(F))**2, np.fft.fftshift(xi))
    ratio = norm_F2 / norm_f2
    print(f"  {name}: ||f||^2={norm_f2:.4f}, ||F||^2={norm_F2:.4f}, ratio={ratio:.4f} (should be ~{2*np.pi:.4f})")

# --- Uncertainty Principle: Gaussian minimize product ---
fig, axes = plt.subplots(2, 2, figsize=(13, 8))

def uncertainty_product(sigma):
    """Tinh Delta_x * Delta_xi cho Gaussian e^{-x^2/(2*sigma^2)}."""
    f = np.exp(-x**2/(2*sigma**2))
    f /= np.sqrt(np.trapz(f**2, x))  # normalize
    F, xi = ft_l2(f, x)
    xi_s = np.fft.fftshift(xi)
    F_s = np.fft.fftshift(F)
    # Normalize power spectrum
    P = np.abs(F_s)**2 / (2*np.pi)
    P /= np.trapz(P, xi_s)
    Delta_x = np.sqrt(np.trapz(x**2 * f**2, x))
    Delta_xi = np.sqrt(np.trapz(xi_s**2 * P, xi_s))
    return Delta_x, Delta_xi, Delta_x * Delta_xi

sigmas = np.logspace(-1, 1, 50)
products = []
for s in sigmas:
    _, _, prod = uncertainty_product(s)
    products.append(prod)

ax = axes[0, 0]
ax.semilogx(sigmas, products, 'steelblue', linewidth=2)
ax.axhline(0.5, color='red', linestyle='--', label='Min = 1/2 (Gaussian)')
ax.set_xlabel('σ (do rong Gaussian)'); ax.set_ylabel('Δx · Δξ')
ax.set_title('Uncertainty Product — min tai moi Gaussian'); ax.legend()

# --- Hieu ung Plancherel: narrow ↔ wide ---
ax = axes[0, 1]
ax.set_title("Hep trong x ↔ Rong trong xi (va nguoc lai)")
sigmas_demo = [0.3, 1.0, 3.0]
cols = ['steelblue', 'tomato', 'green']
xi_plot = np.linspace(-10, 10, 1000)
for sigma, c in zip(sigmas_demo, cols):
    ft_exact = np.sqrt(2*np.pi) * sigma * np.exp(-xi_plot**2 * sigma**2 / 2)
    ax.plot(xi_plot, ft_exact / ft_exact.max(), color=c,
            linewidth=1.5, label=f'σ={sigma}')
ax.set_xlabel('ξ'); ax.set_ylabel('|F̂(ξ)| (chuẩn hóa)'); ax.legend()

# --- Plancherel visual ---
ax = axes[1, 0]
f = np.sin(5*x) * np.exp(-x**2/2)
F, xi = ft_l2(f, x)
x_plot_mask = np.abs(x) < 8
xi_plot_mask = np.abs(np.fft.fftshift(xi)) < 12
ax.plot(x[x_plot_mask], f[x_plot_mask], 'steelblue', linewidth=1.5, label='f(x)')
ax2 = ax.twinx()
ax2.plot(np.fft.fftshift(xi)[xi_plot_mask],
         np.abs(np.fft.fftshift(F))[xi_plot_mask],
         'tomato', linewidth=1.5, label='|F̂(ξ)|')
ax.set_xlabel('x/ξ'); ax.set_title('f(x) vs |F̂(ξ)| — Plancherel bảo toàn năng lượng')
ax.legend(loc='upper left'); ax2.legend(loc='upper right')

# --- So sanh cac ham L2 vs FT ---
ax = axes[1, 1]
funcs_demo = [
    ('Gaussian', lambda x: np.exp(-x**2), 'steelblue'),
    ('sin(3x)/x', lambda x: np.where(np.abs(x)<1e-10, 3., np.sin(3*x)/x), 'tomato'),
]
for name, ff, c in funcs_demo:
    f = ff(x)
    F, xi = ft_l2(f, x)
    norm_ratio = np.sqrt(np.trapz(np.abs(np.fft.fftshift(F))**2, np.fft.fftshift(xi)) / np.trapz(f**2, x))
    print(f"\n{name}: ||F̂||/||f|| = {norm_ratio:.4f} (ly thuyet: sqrt(2pi)={np.sqrt(2*np.pi):.4f})")

plt.suptitle("Plancherel & Heisenberg Uncertainty Principle", fontsize=13)
plt.tight_layout()
plt.savefig("plancherel_uncertainty.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Schwartz space** $\mathcal{S}(\mathbb{R})$: hàm $C^\infty$ giảm nhanh hơn mọi đa thức — "sân khấu lý tưởng" cho FT. $\mathcal{F}: \mathcal{S} \to \mathcal{S}$ là automorphism.
- **Plancherel Theorem**: $\lVert \hat{f} \rVert_2 = \sqrt{2\pi}\lVert f \rVert_2$ trên $\mathcal{S}$, mở rộng sang $L^2$ bằng density argument.
- **$\mathcal{F}$ là unitary operator** trên $L^2$ (sau chuẩn hóa): bảo toàn norm, inner product, và có nghịch đảo là chính nó.
- **Extension bằng density**: $\mathcal{S}$ dense trong $L^2$ $\Rightarrow$ FT trên $L^1 \cap L^2$ mở rộng duy nhất sang $L^2$. Đây là pattern chuẩn trong functional analysis.
- **Heisenberg Uncertainty Principle**: $\Delta x \cdot \Delta \xi \geq 1/2$ — hệ quả toán học thuần túy của Fourier transform, không phải giới hạn kỹ thuật. Gaussian đạt minimum.
- **Paley-Wiener**: compact support trong $x$ $\Leftrightarrow$ FT là entire function — duality giữa localization và analyticity.
- **So sánh với Fourier Series**: Parseval ($L^2$ trên $\mathbb{T}$) ↔ Plancherel ($L^2$ trên $\mathbb{R}$) — cùng một nguyên lý, hai không gian khác nhau.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 5.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Rudin, W. *Real and Complex Analysis* (3rd ed.). McGraw-Hill, 1987. Chương 9.
- Chứng minh đầy đủ: [[a1-plancherel-theorem|A1. Proof of Plancherel Theorem]]
