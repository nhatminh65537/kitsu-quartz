---
title: "09. Distributions & Không Gian Tempered"
tags: [math, fourier-analysis, distributions, tempered-distributions, lesson-09]
aliases: [Distributions, Tempered Distributions, Dirac Delta]
created: 2026-03-24
---

> **Prerequisites**: [[08-fourier-transform-l2|08. Fourier Transform trên L² & Plancherel]] — Schwartz space $\mathcal{S}(\mathbb{R})$; [[07-convolution|07. Convolution]] — approximate identity
> **Objectives**:
> - Hiểu tại sao cần distributions: mở rộng khái niệm hàm số và đạo hàm
> - Định nghĩa tempered distributions $\mathcal{S}'(\mathbb{R})$ như không gian dual của $\mathcal{S}$
> - Nắm các ví dụ quan trọng: Dirac delta $\delta$, Heaviside $H$, principal value $\operatorname{p.v.}(1/x)$
> - Mở rộng Fourier transform sang $\mathcal{S}'$ và tính FT của $\delta$, $1$, $\operatorname{sgn}$
> - Hiểu cách distributions giải quyết các phương trình vi phân "không thể giải" theo nghĩa cổ điển

---

## Motivation / Intuition

### Giới hạn của hàm số cổ điển

Xét bài toán: *Tìm hàm $f$ trên $\mathbb{R}$ thỏa $f' = \delta_0$ (đạo hàm của $f$ là "hàm" Dirac delta).*

Trong thực vật lý và kỹ thuật, Dirac delta $\delta(x)$ xuất hiện khắp nơi — mô tả điện tích điểm, lực tức thời, tín hiệu impulse. Nhưng $\delta$ không phải hàm số thông thường: không có $f(x_0) = \infty$ và $f(x) = 0$ với $x \neq x_0$ mà tích phân bằng $1$.

Laurent Schwartz (1945) giải quyết vấn đề này bằng lý thuyết **distributions** (hàm suy rộng): thay vì nghĩ $f$ là "giá trị tại từng điểm", ta nghĩ $f$ là "cách tác động lên hàm test" — một **linear functional** liên tục trên không gian test functions.

---

## Phân phối Tempered (Tempered Distributions)

### Không gian Dual

> [!definition] Definition 9.1 — Tempered Distribution
> **Tempered distribution** là một **ánh xạ tuyến tính liên tục** $T: \mathcal{S}(\mathbb{R}) \to \mathbb{C}$.
>
> Không gian tất cả tempered distributions ký hiệu là $\mathcal{S}'(\mathbb{R})$ — không gian dual topo của $\mathcal{S}(\mathbb{R})$.
>
> **Giá trị** của $T$ tác động lên $\varphi \in \mathcal{S}$ ký hiệu bằng $\langle T, \varphi \rangle$ hay $T(\varphi)$.
>
> **Liên tục** theo nghĩa: nếu $\varphi_n \to \varphi$ trong $\mathcal{S}$ (mọi semi-norm hội tụ) thì $T(\varphi_n) \to T(\varphi)$.

> [!note] Remark 9.2 — Tại sao "tempered"?
> "Tempered" nghĩa là $T$ chỉ "lớn vừa phải" (tăng trưởng đa thức) ở vô cùng. Lớp $\mathcal{S}'$ nhỏ hơn $\mathcal{D}'$ (dual của $C_c^\infty$) nhưng đủ lớn để bao gồm mọi hàm tăng trưởng đa thức — và quan trọng hơn, **tương thích với Fourier transform**.
>
> Hệ thống embeddings: $\mathcal{S} \hookrightarrow L^2 \hookrightarrow \mathcal{S}'$, trong đó mỗi mũi tên là injection liên tục và dense.

### Từ Hàm Số đến Distribution

> [!theorem] Theorem 9.3 — Hàm số định nghĩa Distribution
> Mỗi $f \in L^p(\mathbb{R})$ với $1 \leq p \leq \infty$ (hay rộng hơn, mọi hàm tăng trưởng đa thức) định nghĩa một tempered distribution $T_f \in \mathcal{S}'$ bằng:
>
> $$
> \langle T_f, \varphi \rangle = \int_{\mathbb{R}} f(x)\, \varphi(x)\, dx
> $$
>
> Ánh xạ $f \mapsto T_f$ là injection: $T_f = T_g \Rightarrow f = g$ a.e. — nên ta đồng nhất $f$ với $T_f$ và viết $\langle f, \varphi \rangle$.

---

## Các Ví Dụ Quan Trọng

### Dirac Delta

> [!definition] Definition 9.4 — Dirac Delta Distribution
> **Dirac delta** tại điểm $a \in \mathbb{R}$ là distribution:
>
> $$
> \langle \delta_a, \varphi \rangle = \varphi(a) \qquad \forall\, \varphi \in \mathcal{S}
> $$
>
> Ký hiệu $\delta = \delta_0$ (tại gốc tọa độ).

> [!note] Remark 9.5 — $\delta$ không phải hàm số
> $\delta$ **không phải** hàm $L^p$ hay hàm đo được thông thường. Nếu $\delta$ là hàm, ta cần $\delta(x) = 0$ a.e. (do $\delta(x) = 0$ với $x \neq 0$), nhưng khi đó $\langle \delta, \varphi \rangle = 0 \neq \varphi(0)$. Mâu thuẫn.
>
> Cách nghĩ hữu ích: $\delta$ là giới hạn của các hàm Gaussian thu hẹp:
> $$
> \delta = \lim_{\varepsilon \to 0} \frac{1}{\varepsilon\sqrt{\pi}} e^{-x^2/\varepsilon^2} \quad \text{trong } \mathcal{S}'
> $$

> [!example] Example 9.6 — Tính Dirac delta
> - $\langle \delta, \cos \rangle = \cos(0) = 1$
> - $\langle \delta_2, e^{-x^2} \rangle = e^{-4}$
> - $\langle \delta, x^2 \rangle = 0^2 = 0$
> - $\langle \delta, \varphi(\cdot - a) \rangle = \varphi(a - a) = \varphi(0)$ — nên $\delta_a(\varphi) = \varphi(a)$ ✓

### Hàm Heaviside

> [!example] Example 9.7 — Hàm Heaviside $H$
> **Heaviside function** $H(x) = \mathbf{1}_{[0,\infty)}(x)$ là hàm $L^\infty$, nên định nghĩa distribution:
>
> $$
> \langle H, \varphi \rangle = \int_0^\infty \varphi(x)\, dx
> $$
>
> **Đạo hàm của $H$ theo nghĩa distributions** là $\delta$:
>
> $$
> H' = \delta \quad \text{trong } \mathcal{S}'
> $$
>
> *Verification*: $\langle H', \varphi \rangle = -\langle H, \varphi' \rangle = -\int_0^\infty \varphi'(x) dx = -[\varphi(\infty) - \varphi(0)] = \varphi(0) = \langle \delta, \varphi \rangle$. ✓

### Principal Value

> [!definition] Definition 9.8 — Cauchy Principal Value $\operatorname{p.v.}(1/x)$
> Hàm $1/x$ không khả tích gần $x = 0$, nhưng định nghĩa distribution:
>
> $$
> \left\langle \operatorname{p.v.}\frac{1}{x}, \varphi \right\rangle = \lim_{\varepsilon \to 0} \int_{|x|>\varepsilon} \frac{\varphi(x)}{x}\, dx
> $$
>
> Giới hạn này tồn tại với mọi $\varphi \in \mathcal{S}$ nhờ **symmetry**: đóng góp từ $(-x)$ và $x$ triệt tiêu nhau.

---

## Đạo Hàm và Phép Toán trên Distributions

> [!definition] Definition 9.9 — Đạo Hàm Distribution
> Với $T \in \mathcal{S}'$, **đạo hàm** $T'$ (hay $DT$ hay $\partial_x T$) được định nghĩa bằng:
>
> $$
> \langle T', \varphi \rangle = -\langle T, \varphi' \rangle \qquad \forall\, \varphi \in \mathcal{S}
> $$
>
> **Kết quả quan trọng**: Mọi tempered distribution đều **vô hạn lần khả vi** theo nghĩa distributions. Đây là một trong những lý do chính để làm việc với distributions thay vì hàm số cổ điển.

> [!note] Remark 9.10 — Tại sao dùng dấu trừ?
> Từ tích phân by parts với $T = T_f$ (hàm $f$ khả vi cổ điển): $\int f'(x)\varphi(x) dx = -\int f(x)\varphi'(x) dx$. Định nghĩa cho distributions tổng quát hóa đồng nhất này.

> [!example] Example 9.11 — Đạo hàm của hàm sign
> $\operatorname{sgn}(x) = \mathbf{1}_{(0,\infty)} - \mathbf{1}_{(-\infty,0)}$.
>
> $\langle (\operatorname{sgn})', \varphi \rangle = -\langle \operatorname{sgn}, \varphi' \rangle = -\int_0^\infty \varphi'(x) dx + \int_{-\infty}^0 \varphi'(x) dx$
>
> $= -[\varphi(\infty)-\varphi(0)] + [\varphi(0)-\varphi(-\infty)] = 2\varphi(0) = 2\langle \delta, \varphi \rangle$
>
> Vậy $(\operatorname{sgn})' = 2\delta$ trong $\mathcal{S}'$.

---

## Fourier Transform trên $\mathcal{S}'$

### Định nghĩa qua Duality

> [!definition] Definition 9.12 — Fourier Transform của Distribution
> Với $T \in \mathcal{S}'$, **Fourier transform** $\hat{T} \in \mathcal{S}'$ được định nghĩa bằng **transposition**:
>
> $$
> \langle \hat{T}, \varphi \rangle = \langle T, \hat{\varphi} \rangle \qquad \forall\, \varphi \in \mathcal{S}
> $$
>
> *Motivation*: Với $T = T_f$ (hàm $f \in L^1$), Multiplication Formula (Lesson 06) cho:
> $\int \hat{f}(\xi)\varphi(\xi) d\xi = \int f(x) \hat{\varphi}(x) dx$, tức $\langle \hat{T}_f, \varphi \rangle = \langle T_f, \hat{\varphi} \rangle$.

> [!theorem] Theorem 9.13 — $\mathcal{F}: \mathcal{S}' \to \mathcal{S}'$ là Automorphism
> Fourier transform $\mathcal{F}: \mathcal{S}' \to \mathcal{S}'$ là isomorphism — bijective và liên tục theo topology trên $\mathcal{S}'$.
>
> Nghịch đảo: $\langle \mathcal{F}^{-1}T, \varphi \rangle = \langle T, \mathcal{F}^{-1}\varphi \rangle$.

### Bảng Fourier Transform của Distributions Quan Trọng

> [!example] Example 9.14 — $\mathcal{F}[\delta] = 1$
> $\langle \hat{\delta}, \varphi \rangle = \langle \delta, \hat{\varphi} \rangle = \hat{\varphi}(0) = \int \varphi(x) dx = \langle 1, \varphi \rangle$.
>
> Vậy $\hat{\delta}(\xi) = 1$ — Fourier transform của Dirac delta là hàm hằng $1$.

> [!example] Example 9.15 — $\mathcal{F}[1] = 2\pi\delta$
> Là hệ quả của $\mathcal{F}^{-1}[\delta] = \frac{1}{2\pi}$ và tính đối ngẫu:
>
> $$
> \hat{1}(\xi) = 2\pi\, \delta(\xi)
> $$
>
> Diễn giải: hàm hằng $1$ chỉ chứa "tần số $0$" — phổ là một điểm tại $\xi = 0$.

> [!example] Example 9.16 — $\mathcal{F}[e^{i\xi_0 x}] = 2\pi\, \delta(\xi - \xi_0)$
> Sóng đơn tần số $\xi_0$ có Fourier transform là delta tại $\xi_0$. Đây là diễn giải **phổ tần số rời rạc** cho sóng sine/cosine thuần khiết.

> [!example] Example 9.17 — $\mathcal{F}[\operatorname{sgn}(x)] = \frac{2}{i\xi} = -\frac{2i}{\xi}$
> Dùng $(i\xi)\mathcal{F}[\operatorname{sgn}] = \mathcal{F}[(\operatorname{sgn})'] = \mathcal{F}[2\delta] = 2$, nên:
>
> $$
> \widehat{\operatorname{sgn}}(\xi) = \frac{2}{i\xi} = 2\operatorname{p.v.}\frac{1}{i\xi}
> $$

> [!example] Example 9.18 — Fourier Transform của Heaviside
> Từ $H = \frac{1}{2}(1 + \operatorname{sgn})$:
>
> $$
> \hat{H}(\xi) = \pi\, \delta(\xi) + \frac{1}{i\xi}
> $$

### Bảng Tổng Hợp

| Distribution $T$ | $\hat{T}(\xi)$ |
|-----------------|----------------|
| $\delta(x)$ | $1$ |
| $\delta(x - a)$ | $e^{-ia\xi}$ |
| $1$ | $2\pi\,\delta(\xi)$ |
| $e^{i\xi_0 x}$ | $2\pi\,\delta(\xi - \xi_0)$ |
| $\cos(\xi_0 x)$ | $\pi[\delta(\xi-\xi_0) + \delta(\xi+\xi_0)]$ |
| $\sin(\xi_0 x)$ | $-i\pi[\delta(\xi-\xi_0) - \delta(\xi+\xi_0)]$ |
| $\operatorname{sgn}(x)$ | $2/(i\xi)$ |
| $H(x)$ | $\pi\delta(\xi) + 1/(i\xi)$ |
| $x^n$ | $2\pi i^n \delta^{(n)}(\xi)$ |

---

## Ứng Dụng: Giải PDE trong $\mathcal{S}'$

> [!example] Example 9.19 — Giải $f'' = \delta$ trong $\mathcal{S}'$
> Áp dụng Fourier transform (trong $\mathcal{S}'$):
>
> $$
> \widehat{f''}(\xi) = (i\xi)^2 \hat{f}(\xi) = -\xi^2 \hat{f}(\xi) = \hat{\delta}(\xi) = 1
> $$
>
> Vậy $\hat{f}(\xi) = -1/\xi^2$. Nghịch đảo FT cho $f(x) = -|x|/2$ (trong nghĩa distribution).
>
> Kiểm tra: $\frac{d}{dx}\left(-\frac{|x|}{2}\right) = -\frac{\operatorname{sgn}(x)}{2}$, và $\frac{d^2}{dx^2}\left(-\frac{|x|}{2}\right) = -\frac{(\operatorname{sgn})'}{2} = -\frac{2\delta}{2} = -\delta$... hmm, ta cần $f'' = \delta$, nên $f(x) = \frac{|x|}{2}$. Kiểm tra lại: $f' = \frac{\operatorname{sgn}}{2}$, $f'' = \frac{2\delta}{2} = \delta$. ✓

> [!example] Example 9.20 — Poisson Summation Formula
> Cho $f \in \mathcal{S}(\mathbb{R})$. **Poisson Summation Formula**:
>
> $$
> \sum_{n \in \mathbb{Z}} f(n) = \sum_{k \in \mathbb{Z}} \hat{f}(2\pi k)
> $$
>
> Đây liên kết Fourier series và Fourier transform, và có tường minh distribution: cả hai vế bằng $\langle \operatorname{III}, f \rangle$ trong đó $\operatorname{III} = \sum_{n \in \mathbb{Z}} \delta_n$ là **Dirac comb** (Shah distribution).

---

## Python — Distributions bằng Approximate Limits

```python
import numpy as np
import matplotlib.pyplot as plt

# Trong Python ta minh hoa distributions qua gioi han cua ham so

x = np.linspace(-5, 5, 2000)
dx = x[1] - x[0]

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# --- Dirac delta = gioi han Gaussian ---
ax = axes[0, 0]; ax.set_title("Dirac delta: lim Gaussian thu hep")
for eps, c in zip([1.0, 0.4, 0.1], ['lightblue','steelblue','navy']):
    delta_approx = np.exp(-x**2/(2*eps**2)) / (eps * np.sqrt(2*np.pi))
    ax.plot(x, delta_approx, color=c, linewidth=1.5, label=f'ε={eps}')
    # Kiem tra: integral ≈ 1
    print(f"eps={eps}: integral ≈ {np.trapz(delta_approx, x):.4f}")
ax.set_ylim(-0.2, 5); ax.legend(); ax.axhline(0, color='k', lw=0.5)
ax.set_xlabel('x'); ax.set_ylabel('δ_ε(x)')

# --- FT cua delta = hang so ---
ax = axes[0, 1]; ax.set_title("FT(δ) = 1 (hang so)")
xi = np.linspace(-10, 10, 500)
# FT cua Gaussian eps: FT(delta_eps)(xi) = exp(-eps^2 * xi^2 / 2)
for eps, c in zip([1.0, 0.4, 0.1], ['lightblue','steelblue','navy']):
    ft_approx = np.exp(-eps**2 * xi**2 / 2)
    ax.plot(xi, ft_approx, color=c, linewidth=1.5, label=f'FT(δ_ε), ε={eps}')
ax.axhline(1, color='tomato', linestyle='--', linewidth=2, label='FT(δ)=1 (limit)')
ax.set_ylim(-0.1, 1.2); ax.legend(fontsize=8); ax.set_xlabel('ξ')

# --- Heaviside derivative = delta ---
ax = axes[1, 0]; ax.set_title("H' = δ trong nghen distributions")
H = np.where(x >= 0, 1.0, 0.0)  # Heaviside
# Xap xi numerically
H_smooth_eps = [0.5, 0.2, 0.05]
for eps, c in zip(H_smooth_eps, ['lightblue','steelblue','navy']):
    H_smooth = 1 / (1 + np.exp(-x/eps))  # smooth Heaviside
    dH = np.gradient(H_smooth, x)
    ax.plot(x, dH, color=c, linewidth=1.5, label=f"H_ε' → δ, ε={eps}")
ax.set_ylim(-0.5, 8); ax.legend(fontsize=8); ax.set_xlabel('x')
ax.set_title("Đạo hàm Heaviside → Dirac delta")

# --- FT cua cos, sin: delta peaks ---
ax = axes[1, 1]; ax.set_title("FT(cos(ξ₀x)) = π[δ(ξ-ξ₀) + δ(ξ+ξ₀)]")
N_sig = 4096
x_long = np.linspace(-30, 30, N_sig)
dx_long = x_long[1] - x_long[0]
xi_0 = 3.0

cos_sig = np.cos(xi_0 * x_long)
F_cos = np.fft.fftshift(np.fft.fft(cos_sig) * dx_long)
xi_fft = np.fft.fftshift(np.fft.fftfreq(N_sig, d=dx_long) * 2 * np.pi)

mask = np.abs(xi_fft) < 8
ax.plot(xi_fft[mask], np.abs(F_cos[mask]), 'steelblue', linewidth=1.5)
ax.axvline(xi_0, color='red', linestyle='--', alpha=0.7, label=f'ξ₀={xi_0}')
ax.axvline(-xi_0, color='red', linestyle='--', alpha=0.7, label=f'-ξ₀={-xi_0}')
ax.set_xlabel('ξ'); ax.set_ylabel('|FT|')
ax.legend(); ax.set_title("FT(cos) ≈ π δ(ξ±ξ₀) — delta peaks")

plt.suptitle("Distributions & Fourier Transform trong S'", fontsize=13)
plt.tight_layout()
plt.savefig("distributions.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Tempered distribution** $T \in \mathcal{S}'$ là functional tuyến tính liên tục trên $\mathcal{S}$ — mở rộng khái niệm hàm số cho phép "hàm" như $\delta$ tồn tại hợp lệ.
- **Embedding**: $\mathcal{S} \hookrightarrow L^p \hookrightarrow \mathcal{S}'$ — mọi hàm $L^p$ đều là distribution.
- **Dirac delta** $\delta$: $\langle \delta, \varphi \rangle = \varphi(0)$ — "sampling functional". Không phải hàm số nhưng là giới hạn của Gaussian.
- **Đạo hàm distribution**: $\langle T', \varphi \rangle = -\langle T, \varphi' \rangle$ — mọi distribution vô hạn lần khả vi!
- **Heaviside**: $H' = \delta$; $(\operatorname{sgn})' = 2\delta$ — đạo hàm tại điểm nhảy là delta.
- **FT trên $\mathcal{S}'$**: $\langle \hat{T}, \varphi \rangle = \langle T, \hat{\varphi} \rangle$ — định nghĩa qua duality, $\mathcal{F}: \mathcal{S}' \to \mathcal{S}'$ là automorphism.
- **Bảng quan trọng**: $\hat{\delta} = 1$; $\hat{1} = 2\pi\delta$; $\widehat{e^{i\xi_0 x}} = 2\pi\delta(\xi-\xi_0)$.
- **Poisson Summation**: $\sum f(n) = \sum \hat{f}(2\pi k)$ — nối Fourier series với Fourier transform.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Appendix.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 9.
- Schwartz, L. *Théorie des Distributions*. Hermann, 1950–51. (Bản gốc)
- Evans, L. C. *Partial Differential Equations* (2nd ed.). AMS, 2010. Appendix D.
- Vasy, A. *MATH 172: Tempered Distributions*. Stanford Lecture Notes.
