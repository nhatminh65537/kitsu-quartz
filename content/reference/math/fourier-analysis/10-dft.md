---
title: "10. Discrete Fourier Transform (DFT)"
tags: [math, fourier-analysis, dft, discrete, lesson-10]
aliases: [DFT, Discrete Fourier Transform]
created: 2026-03-24
---

> **Prerequisites**: [[03-fourier-series-intro|03. Chuỗi Fourier]] — hệ trực giao, hệ số; [[06-fourier-transform-l1|06. Fourier Transform trên L¹]] — FT liên tục và tính chất
> **Objectives**:
> - Định nghĩa DFT và IDFT, hiểu ý nghĩa toán học và tín hiệu học
> - Nắm DFT matrix — DFT như nhân ma trận Vandermonde
> - Chứng minh DFT là unitary (khi chuẩn hóa) — Parseval rời rạc
> - Hiểu circular convolution và DFT Convolution Theorem
> - Dùng numpy.fft thành thạo: fft, ifft, fftshift, fftfreq

---

## Motivation / Intuition

Fourier Series và Transform làm việc với hàm liên tục — không thể tính trực tiếp trên máy tính. Trong thực tế, ta chỉ có:
- **Dữ liệu rời rạc**: $N$ mẫu $x_0, x_1, \ldots, x_{N-1}$ lấy tại các thời điểm đều nhau
- **Xử lý hữu hạn**: tất cả tính toán phải kết thúc trong thời gian hữu hạn

**DFT** (Discrete Fourier Transform) là phiên bản hữu hạn, rời rạc của Fourier transform — có thể tính chính xác bằng máy tính, bảo toàn hầu hết tính chất quan trọng.

### Ba "Fourier" khác nhau

| Loại | Domain $x$ | Domain $\xi$ | Tên |
|------|------------|-------------|-----|
| Fourier Series | $\mathbb{T}$ liên tục | $\mathbb{Z}$ rời rạc | $\hat{f}(n) = \int f e^{-inx} dx$ |
| Fourier Transform | $\mathbb{R}$ liên tục | $\mathbb{R}$ liên tục | $\hat{f}(\xi) = \int f e^{-ix\xi} dx$ |
| **DFT** | $\mathbb{Z}/N\mathbb{Z}$ **rời rạc** | $\mathbb{Z}/N\mathbb{Z}$ **rời rạc** | $X[k] = \sum_{n=0}^{N-1} x[n] e^{-2\pi ink/N}$ |

---

## Định Nghĩa DFT

> [!definition] Definition 10.1 — Discrete Fourier Transform
> Cho vector $\mathbf{x} = (x_0, x_1, \ldots, x_{N-1}) \in \mathbb{C}^N$. **DFT** của $\mathbf{x}$ là vector $\mathbf{X} = (X_0, X_1, \ldots, X_{N-1}) \in \mathbb{C}^N$ với:
>
> $$
> X[k] = \sum_{n=0}^{N-1} x[n]\, e^{-2\pi i nk/N}, \qquad k = 0, 1, \ldots, N-1
> $$
>
> **Inverse DFT (IDFT)**:
>
> $$
> x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k]\, e^{2\pi i nk/N}, \qquad n = 0, 1, \ldots, N-1
> $$

> [!note] Remark 10.2 — Ký hiệu roots of unity
> Đặt $\omega_N = e^{-2\pi i/N}$ là **primitive $N$-th root of unity**. Khi đó:
>
> $$
> X[k] = \sum_{n=0}^{N-1} x[n]\, \omega_N^{nk}
> $$
>
> Tính chất: $\omega_N^N = 1$, $\omega_N^{N/2} = -1$ (với $N$ chẵn), và $\omega_N^k = \omega_N^{k \bmod N}$ (tuần hoàn).

### Tính Trực Giao Rời Rạc

> [!theorem] Theorem 10.3 — Orthogonality của Roots of Unity
> Với $m, k \in \mathbb{Z}$:
>
> $$
> \sum_{n=0}^{N-1} \omega_N^{nk} \overline{\omega_N^{nm}} = \sum_{n=0}^{N-1} \omega_N^{n(k-m)} = \begin{cases} N & \text{nếu } k \equiv m \pmod{N} \\ 0 & \text{nếu } k \not\equiv m \pmod{N} \end{cases}
> $$

**Proof.** Nếu $k \equiv m$: mỗi hạng tử bằng $1$, tổng là $N$. Nếu $k \not\equiv m$: đây là tổng geometric với $r = \omega_N^{k-m} \neq 1$: $\sum_{n=0}^{N-1} r^n = \frac{r^N - 1}{r - 1} = \frac{(\omega_N^N)^{k-m} - 1}{r-1} = \frac{1-1}{r-1} = 0$. $\blacksquare$

---

## DFT Matrix — DFT như Nhân Ma Trận

> [!definition] Definition 10.4 — DFT Matrix
> **DFT matrix** $F_N$ là ma trận $N \times N$:
>
> $$
> F_N = \begin{pmatrix}
> 1 & 1 & 1 & \cdots & 1 \\
> 1 & \omega_N & \omega_N^2 & \cdots & \omega_N^{N-1} \\
> 1 & \omega_N^2 & \omega_N^4 & \cdots & \omega_N^{2(N-1)} \\
> \vdots & \vdots & \vdots & \ddots & \vdots \\
> 1 & \omega_N^{N-1} & \omega_N^{2(N-1)} & \cdots & \omega_N^{(N-1)^2}
> \end{pmatrix}
> $$
>
> tức $(F_N)_{k,n} = \omega_N^{kn}$, $k, n = 0, \ldots, N-1$.
>
> DFT có thể viết gọn: $\mathbf{X} = F_N \mathbf{x}$.

> [!example] Example 10.5 — DFT Matrix $4 \times 4$
> Với $N=4$: $\omega_4 = e^{-\pi i/2} = -i$. Ma trận:
>
> $$
> F_4 = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 1 & -i & -1 & i \\ 1 & -1 & 1 & -1 \\ 1 & i & -1 & -i \end{pmatrix}
> $$

### Tính Unitary

> [!theorem] Theorem 10.6 — DFT Matrix là Unitary (sau chuẩn hóa)
> Ma trận $W_N = \frac{1}{\sqrt{N}} F_N$ là **unitary**: $W_N W_N^* = W_N^* W_N = I_N$.
>
> Tương đương: $F_N \overline{F_N}^T = N \cdot I_N$, tức $F_N^{-1} = \frac{1}{N} \overline{F_N}^T$.
>
> Nghịch đảo DFT: $x[n] = \frac{1}{N}(F_N^*)_{n,\cdot} \cdot \mathbf{X}$ — đây chính là công thức IDFT.

**Proof.** $(F_N \overline{F_N}^T)_{k,m} = \sum_{n=0}^{N-1} \omega_N^{kn} \overline{\omega_N^{mn}} = \sum_{n=0}^{N-1} \omega_N^{(k-m)n}$. Theo Theorem 10.3, bằng $N\cdot\delta_{km}$. $\blacksquare$

> [!corollary] Corollary 10.7 — Parseval's Theorem rời rạc
> $$
> \sum_{n=0}^{N-1} |x[n]|^2 = \frac{1}{N} \sum_{k=0}^{N-1} |X[k]|^2
> $$
>
> "Năng lượng trong miền $n$" = "Năng lượng trong miền $k$" (sau chuẩn hóa).

---

## Tính Chất của DFT

> [!theorem] Theorem 10.8 — Tính Chất DFT
> Đặt $\mathbf{x} \leftrightarrow \mathbf{X}$ nghĩa là $\mathbf{X} = \operatorname{DFT}(\mathbf{x})$. Khi đó:
>
> 1. **(Tuyến tính)** $a\mathbf{x} + b\mathbf{y} \leftrightarrow a\mathbf{X} + b\mathbf{Y}$
>
> 2. **(Dịch vòng / Circular shift)** $x[(n-m) \bmod N] \leftrightarrow \omega_N^{-km} X[k]$
>
> 3. **(Modulation)** $\omega_N^{n\ell} x[n] \leftrightarrow X[(k-\ell) \bmod N]$
>
> 4. **(Đảo chiều)** $x[(-n) \bmod N] \leftrightarrow X[(-k) \bmod N]$
>
> 5. **(Conjugate)** Với $\mathbf{x}$ thực: $X[k] = \overline{X[N-k]}$ (Hermitian symmetry)
>
> 6. **(Tính tuần hoàn)** $X[k]$ tuần hoàn với chu kỳ $N$

> [!note] Remark 10.9 — Lý giải về frequency bins
> DFT cung cấp $N$ mẫu tần số:
> - $X[0]$: DC component (giá trị trung bình × $N$)
> - $X[1], \ldots, X[N/2-1]$: positive frequencies
> - $X[N/2]$: Nyquist frequency (với $N$ chẵn)
> - $X[N/2+1], \ldots, X[N-1]$: negative frequencies (từ $-(N/2-1)$ đến $-1$)
>
> Để visualize thông thường, dùng `fftshift` để di chuyển $0$-frequency về giữa.

---

## Circular Convolution

> [!definition] Definition 10.10 — Circular Convolution
> **Circular convolution** (tích chập vòng) của $\mathbf{x}$ và $\mathbf{h}$ độ dài $N$:
>
> $$
> (x \circledast h)[n] = \sum_{m=0}^{N-1} x[m]\, h[(n-m) \bmod N]
> $$
>
> Khác với **linear convolution** ở chỗ dùng modulo — wrap around.

> [!theorem] Theorem 10.11 — DFT Convolution Theorem
> $$
> \operatorname{DFT}(x \circledast h)[k] = X[k] \cdot H[k]
> $$
>
> Circular convolution trong miền $n$ = pointwise multiplication trong miền $k$.

**Proof.** Tương tự như continuous case — dùng Fubini và tính trực giao. $\blacksquare$

> [!note] Remark 10.12 — Linear vs Circular Convolution
> Để tính **linear convolution** (không circular) bằng DFT: **zero-pad** cả hai tín hiệu lên độ dài $\geq L_x + L_h - 1$ trước khi lấy DFT. Đây là kỹ thuật trung tâm của xử lý tín hiệu số.

---

## Thực Hành với NumPy

```python
import numpy as np
import matplotlib.pyplot as plt

# === DFT tu dau theo dinh nghia ===
def dft_naive(x):
    """DFT O(N^2) theo dinh nghia — chi dung de kiem tra."""
    N = len(x)
    n = np.arange(N)
    k = n.reshape((N, 1))
    W = np.exp(-2j * np.pi * k * n / N)   # DFT matrix
    return W @ x

# === Kiem tra voi numpy.fft ===
N = 8
x = np.array([1, 2, 3, 4, 4, 3, 2, 1], dtype=complex)

X_naive = dft_naive(x)
X_numpy = np.fft.fft(x)
print("DFT tu dau vs numpy.fft:")
print("Max diff:", np.max(np.abs(X_naive - X_numpy)))  # phai gan 0

# === Parseval's theorem ===
energy_time = np.sum(np.abs(x)**2)
energy_freq = np.sum(np.abs(X_numpy)**2) / N
print(f"\nParseval: sum|x|^2 = {energy_time:.4f}, sum|X|^2/N = {energy_freq:.4f}")

# === Circular convolution via DFT ===
N = 16
x_sig = np.zeros(N); x_sig[:4] = 1        # pulse
h_sig = np.exp(-np.arange(N) * 0.3)       # exponential decay

# Circular convolution directly
circ_direct = np.array([sum(x_sig[m]*h_sig[(n-m)%N] for m in range(N)) for n in range(N)])
# Via DFT
circ_dft = np.real(np.fft.ifft(np.fft.fft(x_sig) * np.fft.fft(h_sig)))
print(f"\nCircular conv diff: {np.max(np.abs(circ_direct - circ_dft)):.2e}")

# === Visualization ===
fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# Signal va DFT
x_demo = 2*np.cos(2*np.pi*3*np.arange(64)/64) + np.cos(2*np.pi*10*np.arange(64)/64)
X_demo = np.fft.fft(x_demo)
freqs = np.fft.fftfreq(64) * 64  # freq in bins

ax = axes[0, 0]; ax.plot(np.arange(64), x_demo, 'steelblue', linewidth=1.5)
ax.set_title("Tin hieu: 2cos(6πn/64) + cos(20πn/64)"); ax.set_xlabel("n")

ax = axes[0, 1]
ax.stem(np.fft.fftshift(freqs), np.abs(np.fft.fftshift(X_demo)),
        linefmt='steelblue', markerfmt='o', basefmt='k-')
ax.set_title("DFT: peaks tai k=3, k=10 (va doi xung)"); ax.set_xlabel("k (frequency bin)")

# DFT matrix visualization
ax = axes[1, 0]; ax.set_title("DFT Matrix F_8 — phan thuc")
F8 = np.array([[np.exp(-2j*np.pi*k*n/8) for n in range(8)] for k in range(8)])
im = ax.imshow(np.real(F8), cmap='RdBu', vmin=-1, vmax=1)
ax.set_xlabel("n"); ax.set_ylabel("k")
plt.colorbar(im, ax=ax)

# Circular vs Linear convolution
ax = axes[1, 1]; ax.set_title("Circular vs Linear Convolution")
N_demo = 16
x_p = np.zeros(N_demo); x_p[0] = 1; x_p[1] = 1  # [1,1,0,...,0]
h_p = np.zeros(N_demo); h_p[:4] = 1                # [1,1,1,1,0,...,0]
circ = np.real(np.fft.ifft(np.fft.fft(x_p)*np.fft.fft(h_p)))
linear = np.convolve(x_p[:2], h_p[:4])  # true linear
n_ax = np.arange(N_demo)
ax.stem(n_ax, circ[:N_demo], linefmt='steelblue', markerfmt='o',
        basefmt='k-', label='Circular conv')
ax.plot(np.arange(len(linear)), linear, 'r--o', markersize=5, label='Linear conv (5 terms)')
ax.legend(fontsize=9); ax.set_xlabel("n")

plt.suptitle("Discrete Fourier Transform (DFT)", fontsize=13)
plt.tight_layout()
plt.savefig("dft.png", dpi=120)
plt.show()

# === NumPy FFT cheat sheet ===
print("\n=== NumPy FFT Cheat Sheet ===")
print("np.fft.fft(x)         — forward DFT")
print("np.fft.ifft(X)        — inverse DFT (chia 1/N tu dong)")
print("np.fft.fftfreq(N,d)   — frequency bins (don vi 1/d)")
print("np.fft.fftshift(X)    — shift 0-freq ve giua")
print("np.fft.rfft(x)        — FFT cho tin hieu thuc (chi half spectrum)")
print("np.fft.fft2(img)      — 2D FFT cho anh")
```

---

## Summary / Key Takeaways

- **DFT**: $X[k] = \sum_{n=0}^{N-1} x[n]\omega_N^{nk}$ — biến đổi vector $N$ chiều sang miền tần số rời rạc.
- **DFT matrix** $F_N$: ma trận Vandermonde của roots of unity. $DFT = F_N \mathbf{x}$.
- **Tính unitary**: $W_N = F_N/\sqrt{N}$ là unitary $\Rightarrow$ **Parseval rời rạc**: $\sum|x|^2 = \frac{1}{N}\sum|X|^2$.
- **Tính chất**: shift $\leftrightarrow$ phase, modulation $\leftrightarrow$ circular shift, Hermitian symmetry cho tín hiệu thực.
- **Frequency bins**: $k=0$ là DC; $k=1,\ldots,N/2-1$ là positive freq; $k=N/2+1,\ldots,N-1$ là negative freq. Dùng `fftshift` để visualize.
- **Circular convolution** $\leftrightarrow$ pointwise multiplication của DFT — Convolution Theorem rời rạc.
- **Linear convolution** bằng DFT: zero-pad lên độ dài $\geq L_x + L_h - 1$ trước khi lấy DFT.
- **`numpy.fft`**: `fft`, `ifft`, `fftshift`, `fftfreq` — thư viện chuẩn, nền tảng của Module 4 (DSP) và Module 5 (NTT).

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 7.
- Oppenheim, A. V. & Schafer, R. W. *Discrete-Time Signal Processing* (3rd ed.). Prentice Hall, 2009. Chương 8.
- NumPy Documentation: `numpy.fft` module.
- Cooley, J. W. & Tukey, J. W. "An algorithm for the machine calculation of complex Fourier series." *Mathematics of Computation*, 19(90), 1965.
