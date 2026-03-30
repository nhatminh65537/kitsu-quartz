---
title: "12. Sampling & Nyquist-Shannon Theorem"
tags: [math, fourier-analysis, sampling, dsp, nyquist, lesson-12]
aliases: [Sampling Theorem, Nyquist, Aliasing]
created: 2026-03-24
---

> **Prerequisites**: [[08-fourier-transform-l2|08. FT trên L²]] — Fourier transform, Plancherel; [[10-dft|10. DFT]] — frequency bins; [[09-distributions|09. Distributions]] — Dirac comb
> **Objectives**:
> - Xây dựng toán học chặt chẽ của quá trình lấy mẫu (sampling) qua Dirac comb
> - Phân tích phổ tần số của tín hiệu đã lấy mẫu — replicas và aliasing
> - Phát biểu và chứng minh Nyquist-Shannon Sampling Theorem qua Poisson Summation
> - Hiểu reconstruction (Whittaker-Shannon interpolation formula)
> - Minh họa aliasing bằng Python: audio, tín hiệu số

---

## Motivation / Intuition

Bất cứ hệ thống kỹ thuật số nào cũng phải **lấy mẫu** tín hiệu liên tục: micro ghi âm, ADC trong oscilloscope, pixel của camera. Câu hỏi cơ bản:

> *Khi lấy mẫu tín hiệu liên tục $f(t)$ tại các thời điểm rời rạc $t_n = nT$, ta mất bao nhiêu thông tin? Dưới điều kiện nào có thể khôi phục hoàn toàn $f$ từ các mẫu?*

Câu trả lời — **Nyquist-Shannon Sampling Theorem** — là một trong những kết quả quan trọng nhất của Fourier analysis ứng dụng, liên kết lý thuyết hàm liên tục với thực hành số.

---

## Mô Hình Toán Học của Sampling

### Dirac Comb và Ideal Sampling

> [!definition] Definition 12.1 — Dirac Comb (Shah Distribution)
> **Dirac comb** với chu kỳ $T$ là distribution:
>
> $$
> \operatorname{III}_T(t) = \sum_{n=-\infty}^{\infty} \delta(t - nT)
> $$
>
> **Ideal sampling** của $f$ tại tần số $f_s = 1/T$:
>
> $$
> f_s(t) = f(t) \cdot \operatorname{III}_T(t) = \sum_{n=-\infty}^{\infty} f(nT)\, \delta(t - nT)
> $$

> [!theorem] Theorem 12.2 — FT của Dirac Comb
> Fourier transform của Dirac comb là Dirac comb trong miền tần số:
>
> $$
> \widehat{\operatorname{III}_T}(\xi) = \frac{2\pi}{T} \sum_{k=-\infty}^{\infty} \delta\!\left(\xi - \frac{2\pi k}{T}\right) = \frac{2\pi}{T}\, \operatorname{III}_{2\pi/T}(\xi)
> $$
>
> **Ý nghĩa**: Sampling tại tần số $f_s = 1/T$ tạo ra các bản sao (replicas) của phổ cách nhau $\omega_s = 2\pi f_s = 2\pi/T$.

---

## Phổ Tần Số của Tín Hiệu Đã Lấy Mẫu

> [!theorem] Theorem 12.3 — Phổ của Tín Hiệu Đã Lấy Mẫu
> Với $f \in L^1 \cap L^2$ và $f_s = f \cdot \operatorname{III}_T$:
>
> $$
> \hat{f}_s(\xi) = \frac{1}{T} \sum_{k=-\infty}^{\infty} \hat{f}\!\left(\xi - \frac{2\pi k}{T}\right)
> $$
>
> Tức là phổ của tín hiệu đã lấy mẫu là **tổng của các bản sao (replicas)** của phổ gốc, cách nhau $\omega_s = 2\pi/T$.

**Proof.** Dùng Convolution Theorem: $f_s = f \cdot \operatorname{III}_T$, nên $\hat{f}_s = \frac{1}{2\pi} \hat{f} * \widehat{\operatorname{III}_T}$. Thay $\widehat{\operatorname{III}_T} = \frac{2\pi}{T} \operatorname{III}_{2\pi/T}$:
$$
\hat{f}_s(\xi) = \frac{1}{2\pi} \int \hat{f}(\xi - \eta) \cdot \frac{2\pi}{T} \sum_k \delta\!\left(\eta - \frac{2\pi k}{T}\right) d\eta = \frac{1}{T}\sum_k \hat{f}\!\left(\xi - \frac{2\pi k}{T}\right). \quad \blacksquare
$$

---

## Aliasing

> [!definition] Definition 12.4 — Aliasing
> **Aliasing** xảy ra khi các replicas của phổ **chồng lên nhau** ($\omega_s < 2B$ với $B$ là bandwidth). Trong trường hợp này, không thể phân biệt tín hiệu gốc với các alias của nó.
>
> Nếu $f$ là band-limited với $\operatorname{supp}(\hat{f}) \subseteq [-B, B]$, aliasing **không xảy ra** khi và chỉ khi:
>
> $$
> \frac{2\pi}{T} \geq 2B \quad \Leftrightarrow \quad \omega_s \geq 2B \quad \Leftrightarrow \quad f_s \geq \frac{B}{\pi} = 2f_{\max}
> $$

> [!example] Example 12.5 — Ví dụ Aliasing
> Xét $f(t) = \cos(2\pi \cdot 11 \cdot t)$ ($f_0 = 11$ Hz), lấy mẫu với $f_s = 8$ Hz.
>
> Vì $f_s < 2f_0$, tần số $11$ Hz aliased thành: $|f_0 - f_s| = |11 - 8| = 3$ Hz.
>
> Kết quả: $f_s[n] = \cos(2\pi \cdot 11 \cdot n/8)$ trông giống $\cos(2\pi \cdot 3 \cdot n/8)$ — không thể phân biệt!

---

## Định Lý Nyquist-Shannon

> [!theorem] Theorem 12.6 — Nyquist-Shannon Sampling Theorem
> Cho $f \in L^2(\mathbb{R})$ là tín hiệu **band-limited**: $\operatorname{supp}(\hat{f}) \subseteq [-B, B]$ (với $B < \infty$).
>
> **Nyquist rate**: $\omega_s^{\min} = 2B$ (hay $f_s^{\min} = B/\pi$).
>
> Nếu tần số lấy mẫu $\omega_s = 2\pi/T > 2B$, thì $f$ được **khôi phục hoàn toàn** từ các mẫu $\{f(nT)\}_{n \in \mathbb{Z}}$ qua công thức:
>
> $$
> f(t) = \sum_{n=-\infty}^{\infty} f(nT)\, \operatorname{sinc}\!\left(\frac{t - nT}{T}\right)
> $$
>
> trong đó $\operatorname{sinc}(x) = \frac{\sin(\pi x)}{\pi x}$ là hàm sinc chuẩn hóa.
>
> Đây gọi là **Whittaker-Shannon Interpolation Formula**.

**Proof.** Vì $f$ band-limited và không có aliasing, ta có:

$$
\hat{f}_s(\xi) = \frac{1}{T} \hat{f}(\xi) \quad \text{với } |\xi| < \pi/T
$$

Để khôi phục $\hat{f}$, nhân $\hat{f}_s$ với **low-pass filter** lý tưởng $H(\xi) = T \cdot \mathbf{1}_{[-\pi/T, \pi/T]}(\xi)$:

$$
\hat{f}(\xi) = \hat{f}_s(\xi) \cdot H(\xi) = \left[\sum_n f(nT)\, e^{-in\xi T}\right] \cdot H(\xi).
$$

Nghịch đảo FT: $f = \mathcal{F}^{-1}[\hat{f}]$. Biết $\mathcal{F}^{-1}[H]= \operatorname{sinc}(t/T)$ và dùng convolution:

$$
f(t) = \sum_n f(nT) \cdot \operatorname{sinc}\!\left(\frac{t - nT}{T}\right). \quad \blacksquare
$$

> [!note] Remark 12.7 — Ý nghĩa của sinc interpolation
> Hàm $\operatorname{sinc}\!\left(\frac{t-nT}{T}\right)$ bằng $1$ tại $t = nT$ và $0$ tại mọi điểm lấy mẫu khác — đây là **cardinal interpolation**: mỗi mẫu đóng góp đúng giá trị của nó tại điểm lấy mẫu và không can thiệp vào các mẫu khác.

### Chứng minh via Poisson Summation

> [!note] Remark 12.8 — Liên kết với Poisson Summation
> Poisson Summation Formula: $\sum_n f(nT) = \frac{1}{T}\sum_k \hat{f}(2\pi k/T)$.
>
> Nếu $f$ band-limited với $\operatorname{supp}(\hat{f}) \subseteq [-B, B]$ và $2\pi/T > 2B$, thì chỉ hạng $k=0$ còn lại trong tổng bên phải. Vậy $\sum_n f(nT) = \frac{1}{T}\hat{f}(0)$ — đây là trường hợp đặc biệt thể hiện tính consistent của sampling.

---

## Anti-Aliasing và Thực Hành

> [!note] Remark 12.9 — Anti-Aliasing Filter
> Trong thực tế, tín hiệu thực không bao giờ hoàn toàn band-limited. Trước khi ADC, luôn cần **anti-aliasing filter** (low-pass filter) để loại bỏ thành phần tần số cao hơn $f_s/2$.
>
> **Audio CD**: $f_s = 44.1$ kHz → Nyquist $= 22.05$ kHz $>$ 20 kHz (ngưỡng nghe của người). Anti-aliasing filter tại $\approx 22$ kHz.
>
> **Telephone**: $f_s = 8$ kHz → bandwidth $= 4$ kHz, đủ cho thoại ($300$–$3400$ Hz).

---

## Python — Minh Họa Aliasing và Nyquist

```python
import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# --- 1. Aliasing demo: cos(2pi*11*t) lay mau voi fs=8Hz ---
ax = axes[0, 0]; ax.set_title("Aliasing: cos(22π·11t) bị alias thành cos(2π·3t)")
t_cont = np.linspace(0, 1, 1000)
f0 = 11; fs_alias = 8  # aliasing!
f_true = np.cos(2*np.pi * f0 * t_cont)
f_alias = np.cos(2*np.pi * (f0 % fs_alias) * t_cont)

t_samples = np.arange(0, 1, 1/fs_alias)
samples_val = np.cos(2*np.pi * f0 * t_samples)

ax.plot(t_cont, f_true, 'steelblue', linewidth=1, alpha=0.5, label=f'f={f0}Hz (thật)')
ax.plot(t_cont, f_alias, 'tomato', linewidth=1.5, alpha=0.7, label=f'f={f0 % fs_alias}Hz (alias)')
ax.stem(t_samples, samples_val, 'k', markerfmt='ko', basefmt='k-', label=f'Mẫu (fs={fs_alias}Hz)')
ax.legend(fontsize=9); ax.set_xlabel("t (s)")

# --- 2. Reconstruction: sinc interpolation ---
ax = axes[0, 1]; ax.set_title("Whittaker-Shannon: sinc interpolation")
f_signal = lambda t: np.sinc(2*t) + 0.5*np.sinc(3*(t-0.2))
T = 0.25  # sampling period
n_samples = np.arange(-5, 6)
t_s = n_samples * T
f_s_vals = f_signal(t_s)
t_plot = np.linspace(-1.5, 1.5, 500)
# Reconstruct via sinc interpolation
f_reconstructed = sum(f_s_vals[i]*np.sinc((t_plot - t_s[i])/T) for i in range(len(t_s)))

ax.plot(t_plot, f_signal(t_plot), 'steelblue', linewidth=1.5, alpha=0.6, label='f(t) gốc')
ax.plot(t_plot, f_reconstructed, 'tomato', linewidth=1.5, linestyle='--', label='Sinc reconstruction')
ax.stem(t_s, f_s_vals, 'k', markerfmt='ko', basefmt='k-', label=f'Mẫu T={T}')
ax.legend(fontsize=9); ax.set_xlabel("t")
ax.set_xlim(-1.5, 1.5)

# --- 3. Phổ: replicas khi fs thay doi ---
ax = axes[1, 0]; ax.set_title("Phổ: replicas của tín hiệu đã lấy mẫu")
xi = np.linspace(-50, 50, 2000)  # rad/s
B = 10.0  # bandwidth

def spectrum_sampled(xi, B, fs_hz):
    """Tinh pho cua tin hieu da lay mau (tong cac replicas)."""
    omega_s = 2 * np.pi * fs_hz
    result = np.zeros_like(xi)
    # Sum over replicas k = -3..3
    for k in range(-3, 4):
        xi_shifted = xi - k * omega_s
        result += np.where(np.abs(xi_shifted) <= B, 1.0, 0.0)
    return result

for fs_hz, c, label in [(4, 'tomato', f'fs=4 (aliasing!): ωs=8π<2B={2*B:.0f}'),
                         (10, 'orange', f'fs=10 (biên): ωs=20π=2B'),
                         (20, 'steelblue', f'fs=20 (ok): ωs=40π>2B')]:
    ax.plot(xi, spectrum_sampled(xi, B, fs_hz), color=c, linewidth=1.5, label=label)
ax.axvline(B, color='k', linestyle=':', alpha=0.5, label=f'±B={B}')
ax.axvline(-B, color='k', linestyle=':', alpha=0.5)
ax.legend(fontsize=8); ax.set_xlabel("ξ (rad/s)")

# --- 4. Thực tế: audio aliasing ---
ax = axes[1, 1]; ax.set_title("Audio: phổ trước và sau anti-aliasing filter")
N = 2048; fs_audio = 44100.0; T_audio = 1.0/fs_audio
t_audio = np.arange(N) / fs_audio
# Tin hieu nhieu tan so
freqs_present = [1000, 5000, 15000, 25000]  # Hz — 25kHz vuot Nyquist
signal = sum(np.sin(2*np.pi*f*t_audio) for f in freqs_present)
# DFT
F = np.fft.rfft(signal)
f_axis = np.fft.rfftfreq(N, d=T_audio)
ax.semilogy(f_axis/1000, np.abs(F)+1e-10, 'steelblue', linewidth=1, label='Phổ đầu vào')
ax.axvline(22.05, color='red', linestyle='--', linewidth=2, label='Nyquist = 22.05 kHz')
# Anti-aliased
F_filtered = F.copy()
F_filtered[f_axis > 22050] = 0
ax.semilogy(f_axis/1000, np.abs(F_filtered)+1e-10, 'tomato', linewidth=1.5, label='Sau anti-aliasing')
ax.legend(fontsize=9); ax.set_xlabel("Frequency (kHz)")
ax.set_xlim(0, 30)

plt.suptitle("Nyquist-Shannon Sampling Theorem & Aliasing", fontsize=13)
plt.tight_layout()
plt.savefig("sampling.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Ideal sampling** = nhân $f$ với Dirac comb $\operatorname{III}_T$ → phổ là tổng replicas cách nhau $\omega_s = 2\pi/T$.
- **Aliasing**: replicas chồng nhau khi $\omega_s < 2B$ → mất thông tin không thể khôi phục.
- **Nyquist-Shannon**: nếu $f$ band-limited ($\operatorname{supp}(\hat{f}) \subseteq [-B,B]$) và $\omega_s > 2B$ thì $f$ khôi phục hoàn toàn từ mẫu.
- **Nyquist rate** $= 2f_{\max}$: tần số lấy mẫu tối thiểu. $f_s > 2f_{\max}$ để tránh aliasing.
- **Whittaker-Shannon interpolation**: $f(t) = \sum_n f(nT)\operatorname{sinc}\!\left(\frac{t-nT}{T}\right)$ — low-pass filter lý tưởng trong miền tần số.
- **Thực tế**: anti-aliasing filter trước ADC là bắt buộc; CD dùng $f_s = 44.1$ kHz cho ngưỡng nghe $\approx 20$ kHz.
- **Poisson Summation** = nền tảng lý thuyết của Sampling Theorem.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 5.
- Oppenheim, A. V. & Schafer, R. W. *Discrete-Time Signal Processing* (3rd ed.). Chương 4.
- Shannon, C. E. "Communication in the presence of noise." *Proc. IRE*, 37(1):10–21, 1949.
