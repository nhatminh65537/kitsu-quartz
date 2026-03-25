---
title: "13. Filters & Spectral Analysis"
tags: [math, fourier-analysis, filters, spectral-analysis, dsp, lesson-13]
aliases: [Filters, FIR, IIR, STFT, Spectrogram]
created: 2026-03-24
---

> **Prerequisites**: [[10-dft|10. DFT]] — circular convolution, frequency bins; [[11-fft|11. FFT]] — computational efficiency; [[12-sampling|12. Sampling]] — aliasing, bandwidth
> **Objectives**:
> - Hiểu filter (lọc) là convolution và frequency response là FT của impulse response
> - Phân biệt FIR (Finite Impulse Response) và IIR (Infinite Impulse Response) filters
> - Xây dựng các filter cơ bản: low-pass, high-pass, band-pass, band-stop
> - Hiểu windowing và spectral leakage — tại sao không dùng rectangular window
> - Giới thiệu STFT (Short-Time Fourier Transform) và spectrogram
> - Python: scipy.signal, thiết kế filter thực tế

---

## Motivation / Intuition

Filtering là bài toán trung tâm của DSP: cho tín hiệu nhiều tần số, **chọn** (hoặc loại bỏ) một số tần số nhất định. Nhờ Convolution Theorem, filter = convolution trong miền thời gian = **nhân** trong miền tần số — thiết kế filter chỉ cần chọn frequency response phù hợp.

---

## Linear Time-Invariant (LTI) Filters

> [!definition] Definition 13.1 — LTI Filter và Impulse Response
> Một **linear time-invariant (LTI) filter** là phép convolution:
>
> $$
> y[n] = (x * h)[n] = \sum_{k=-\infty}^{\infty} x[k]\, h[n-k]
> $$
>
> trong đó $h[n]$ là **impulse response** (đáp ứng xung) của filter.
>
> **Frequency response** $H(\omega)$ là DTFT (Discrete-Time Fourier Transform) của $h$:
>
> $$
> H(\omega) = \sum_{n=-\infty}^{\infty} h[n]\, e^{-i\omega n}
> $$
>
> Khi đó $Y(\omega) = H(\omega) \cdot X(\omega)$ — nhân trong miền tần số.

> [!note] Remark 13.2 — FIR vs IIR
> - **FIR** (Finite Impulse Response): $h[n] = 0$ với $|n| > M$ — hữu hạn hạng. **Luôn stable**.
> - **IIR** (Infinite Impulse Response): $h[n]$ tắt dần nhưng vô hạn. **Có thể không stable** nhưng hiệu quả hơn.

---

## Các Loại Filter Cơ Bản

> [!definition] Definition 13.3 — Các Filter Lý Tưởng
> | Tên | Frequency Response | Tác dụng |
> |-----|-------------------|----------|
> | **Low-pass** | $H(\omega) = \mathbf{1}_{|\omega| \leq \omega_c}$ | Giữ tần số thấp, loại cao |
> | **High-pass** | $H(\omega) = \mathbf{1}_{|\omega| \geq \omega_c}$ | Giữ tần số cao, loại thấp |
> | **Band-pass** | $H(\omega) = \mathbf{1}_{\omega_l \leq |\omega| \leq \omega_h}$ | Giữ một băng tần |
> | **Band-stop** (notch) | $H(\omega) = 1 - \mathbf{1}_{\omega_l \leq |\omega| \leq \omega_h}$ | Loại một băng tần |
>
> Các filter **lý tưởng** có impulse response vô hạn (non-causal) — không thể thực hiện chính xác. Trong thực tế ta xấp xỉ.

### Ideal Low-Pass Filter

> [!example] Example 13.4 — Sinc là Ideal LPF
> Ideal low-pass filter với cutoff $\omega_c$:
>
> $$
> H_{LP}(\omega) = \mathbf{1}_{|\omega| \leq \omega_c} \quad \Rightarrow \quad h_{LP}[n] = \frac{\omega_c}{\pi}\, \operatorname{sinc}\!\left(\frac{\omega_c n}{\pi}\right)
> $$
>
> Không thể dùng trực tiếp vì $h$ vô hạn. **Truncation** (cắt ngắn) và **windowing** là cần thiết.

---

## Spectral Leakage và Windowing

> [!definition] Definition 13.5 — Spectral Leakage
> Khi tính DFT của một đoạn tín hiệu hữu hạn độ dài $N$, ta đang **nhân** tín hiệu với **cửa sổ chữ nhật** (rectangular window):
>
> $$
> x_w[n] = x[n] \cdot w[n], \quad w[n] = \mathbf{1}_{0 \leq n \leq N-1}
> $$
>
> Trong miền tần số: $X_w(\omega) = X(\omega) * W(\omega)$, trong đó $W(\omega) = \sum_{n=0}^{N-1} e^{-i\omega n} = e^{-i(N-1)\omega/2}\frac{\sin(N\omega/2)}{\sin(\omega/2)}$.
>
> $W(\omega)$ là **Dirichlet kernel** — có side lobes lớn → **spectral leakage**: năng lượng từ tần số này "rò" sang tần số khác.

> [!theorem] Theorem 13.6 — Trade-off: Frequency Resolution vs Leakage
> Với cửa sổ độ dài $N$:
> - **Frequency resolution** $\propto 1/N$: cần $N$ lớn để phân biệt hai tần số gần nhau
> - **Spectral leakage** phụ thuộc vào dạng cửa sổ: rectangular = leakage lớn nhất

> [!definition] Definition 13.7 — Các Cửa Sổ Phổ Biến
> | Window | Công thức $w[n]$ | Main lobe | Side lobe | Ứng dụng |
> |--------|-----------------|-----------|-----------|----------|
> | **Rectangular** | $1$ | Hẹp nhất | $-13$ dB | Không khuyến dùng |
> | **Hann** | $0.5(1-\cos(2\pi n/N))$ | Rộng hơn | $-31$ dB | Tổng quát |
> | **Hamming** | $0.54 - 0.46\cos(2\pi n/N)$ | Rộng hơn | $-41$ dB | Audio |
> | **Blackman** | $0.42-0.5\cos+0.08\cos(2\cdot)$ | Rộng nhất | $-58$ dB | Tần số gần nhau |
> | **Kaiser** | Dạng $I_0$ Bessel | Điều chỉnh | Điều chỉnh | Linh hoạt |

---

## Short-Time Fourier Transform (STFT) và Spectrogram

> [!definition] Definition 13.8 — Short-Time Fourier Transform (STFT)
> **STFT** của tín hiệu $x[n]$ với cửa sổ $w[n]$:
>
> $$
> X(m, \omega) = \sum_{n=-\infty}^{\infty} x[n]\, w[n - m]\, e^{-i\omega n}
> $$
>
> $m$ là **time index** (vị trí cửa sổ), $\omega$ là **frequency**. STFT cung cấp phân tích tần số **theo thời gian**.

> [!definition] Definition 13.9 — Spectrogram
> **Spectrogram** là magnitude bình phương của STFT:
>
> $$
> S(m, \omega) = |X(m, \omega)|^2
> $$
>
> Visualize dưới dạng heatmap: trục $x$ = thời gian, trục $y$ = tần số, màu = năng lượng.

> [!note] Remark 13.10 — Heisenberg-Gabor Limit cho STFT
> Không thể đồng thời có **time resolution** cao và **frequency resolution** cao — đây là Uncertainty Principle ứng dụng vào STFT (Gabor limit):
>
> $$
> \Delta t \cdot \Delta f \geq \frac{1}{4\pi}
> $$
>
> **Cửa sổ rộng** → frequency resolution tốt, time resolution kém.
> **Cửa sổ hẹp** → time resolution tốt, frequency resolution kém.

---

## Python — Thiết Kế Filter và Spectrogram

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal as sig

fs = 1000.0   # sampling frequency Hz
t = np.linspace(0, 1, int(fs), endpoint=False)

# --- Tin hieu test: sum cua nhieu tan so ---
# 50Hz + 200Hz + 400Hz (muon loc giu 200Hz)
x = (np.sin(2*np.pi*50*t) +
     2.0*np.sin(2*np.pi*200*t) +
     0.5*np.sin(2*np.pi*400*t) +
     0.3*np.random.randn(len(t)))

fig, axes = plt.subplots(3, 2, figsize=(13, 10))

# --- Power spectrum cua tin hieu goc ---
ax = axes[0, 0]; ax.set_title("Tín hiệu gốc: 50Hz + 200Hz + 400Hz")
ax.plot(t[:200], x[:200], 'steelblue', linewidth=1)
ax.set_xlabel("t (s)")

ax = axes[0, 1]; ax.set_title("Power spectrum (DFT)")
f_axis = np.fft.rfftfreq(len(x), d=1/fs)
X_fft = np.fft.rfft(x)
ax.semilogy(f_axis, np.abs(X_fft)**2 / len(x), 'steelblue', linewidth=1.2)
ax.axvline(50, color='red', linestyle='--', alpha=0.7, label='50Hz')
ax.axvline(200, color='green', linestyle='--', alpha=0.7, label='200Hz')
ax.axvline(400, color='orange', linestyle='--', alpha=0.7, label='400Hz')
ax.legend(fontsize=9); ax.set_xlabel("Frequency (Hz)")

# --- FIR band-pass filter: giu 150-250 Hz ---
# Dung scipy.signal.firwin (FIR window design)
order = 101
nyq = fs / 2
low_cut, high_cut = 150/nyq, 250/nyq
h_fir = sig.firwin(order, [low_cut, high_cut], pass_zero=False, window='hamming')
x_filtered = np.convolve(x, h_fir, mode='same')

ax = axes[1, 0]; ax.set_title("Band-pass FIR filter (150-250Hz): output")
ax.plot(t[:300], x[:300], 'gray', linewidth=0.8, alpha=0.5, label='Input')
ax.plot(t[:300], x_filtered[:300], 'tomato', linewidth=1.5, label='Filtered (200Hz)')
ax.legend(fontsize=9); ax.set_xlabel("t (s)")

# Frequency response cua filter
w_resp, H_resp = sig.freqz(h_fir, worN=1024, fs=fs)
ax = axes[1, 1]; ax.set_title("Frequency response: FIR Band-pass")
ax.plot(w_resp, 20*np.log10(np.abs(H_resp)+1e-10), 'tomato', linewidth=1.5)
ax.axvline(150, color='k', linestyle='--', alpha=0.5)
ax.axvline(250, color='k', linestyle='--', alpha=0.5)
ax.set_xlabel("Frequency (Hz)"); ax.set_ylabel("Gain (dB)")
ax.set_ylim(-80, 5); ax.grid(True, alpha=0.3)

# --- Windowing: leakage demo ---
ax = axes[2, 0]; ax.set_title("Spectral leakage: Rectangular vs Hann window")
# Tin hieu: 2 tan so rat gan nhau: 100Hz va 102Hz
t_win = np.linspace(0, 0.5, 512, endpoint=False)
x_two = np.sin(2*np.pi*100*t_win) + np.sin(2*np.pi*102*t_win)
f_win = np.fft.rfftfreq(512, d=0.5/512)
# Rectangular
X_rect = np.abs(np.fft.rfft(x_two))
# Hann window
hann = np.hanning(512)
X_hann = np.abs(np.fft.rfft(x_two * hann)) * 2/np.sum(hann)

ax.semilogy(f_win[:100], X_rect[:100]/512, 'steelblue', linewidth=1.2, label='Rectangular')
ax.semilogy(f_win[:100], X_hann[:100], 'tomato', linewidth=1.5, label='Hann')
ax.axvline(100, color='k', linestyle=':', alpha=0.5)
ax.axvline(102, color='k', linestyle=':', alpha=0.5)
ax.legend(fontsize=9); ax.set_xlabel("Frequency (Hz)")
ax.set_title("Spectral leakage: 100Hz + 102Hz (chua gần)")

# --- STFT Spectrogram ---
ax = axes[2, 1]
# Tin hieu vari-freq: chirp + burst
t_stft = np.linspace(0, 2, 2000, endpoint=False)
chirp = sig.chirp(t_stft, f0=50, f1=400, t1=2, method='linear')
burst = np.zeros_like(t_stft)
burst[800:1000] = np.sin(2*np.pi*300*t_stft[800:1000])
x_stft = chirp + burst + 0.1*np.random.randn(len(t_stft))

f_stft, t_stft_axis, Zxx = sig.stft(x_stft, fs=1000, nperseg=128, noverlap=120, window='hann')
ax.pcolormesh(t_stft_axis, f_stft, 20*np.log10(np.abs(Zxx)+1e-10),
              shading='gouraud', cmap='inferno', vmin=-30)
ax.set_title("Spectrogram (STFT): chirp + burst @ 300Hz")
ax.set_xlabel("Time (s)"); ax.set_ylabel("Frequency (Hz)")
ax.set_ylim(0, 500)

plt.suptitle("Filters & Spectral Analysis", fontsize=13)
plt.tight_layout()
plt.savefig("filters_spectral.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **LTI filter** = convolution với impulse response $h$; frequency response $H(\omega) = $ DTFT$(h)$.
- **FIR**: hữu hạn, luôn stable. **IIR**: vô hạn, có thể unstable nhưng hiệu quả hơn.
- **Low-pass**: giữ tần số thấp (sinc impulse response). **High-pass, band-pass, band-stop** tương tự.
- **Spectral leakage**: DFT của đoạn hữu hạn = nhân với rectangular window → side lobes.
- **Windowing**: Hann, Hamming, Blackman giảm side lobes nhưng mở rộng main lobe — trade-off.
- **STFT**: $X(m,\omega) = \sum_n x[n]w[n-m]e^{-i\omega n}$ — phân tích tần số theo thời gian.
- **Spectrogram**: $|X(m,\omega)|^2$ — heatmap time-frequency. Ứng dụng: speech, music, radar.
- **Gabor limit**: $\Delta t \cdot \Delta f \geq 1/(4\pi)$ — không thể có cả time và frequency resolution tốt đồng thời.

---

## References

- Oppenheim, A. V. & Schafer, R. W. *Discrete-Time Signal Processing* (3rd ed.). Chương 7.
- scipy.signal documentation: `scipy.signal.firwin`, `scipy.signal.stft`.
- Harris, F. J. "On the use of windows for harmonic analysis with the discrete Fourier transform." *Proc. IEEE*, 1978.
