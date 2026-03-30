---
title: "11. Fast Fourier Transform (FFT)"
tags: [math, fourier-analysis, fft, cooley-tukey, algorithm, lesson-11]
aliases: [FFT, Fast Fourier Transform, Cooley-Tukey]
created: 2026-03-24
---

> **Prerequisites**: [[10-dft|10. DFT]] — định nghĩa DFT, tính trực giao, DFT matrix
> **Objectives**:
> - Hiểu tại sao DFT naïve $O(N^2)$ không thể dùng cho dữ liệu lớn
> - Nắm ý tưởng divide-and-conquer của Cooley-Tukey FFT
> - Chứng minh correctness và độ phức tạp $O(N \log N)$
> - Hiểu butterfly structure và bit-reversal permutation
> - Implement FFT từ đầu bằng Python
> - Biết các variant: Radix-4, mixed-radix, Bluestein cho $N$ tùy ý

---

## Motivation — Tại sao cần FFT?

DFT naïve tính $X[k] = \sum_{n=0}^{N-1} x[n]\omega_N^{nk}$ đòi hỏi $N$ phép nhân và $N-1$ phép cộng cho mỗi $k$ — tổng cộng $O(N^2)$ phép tính.

**Bài toán thực tế**:
- Audio CD: $44{,}100$ mẫu/giây. DFT $O(N^2)$ cho $N = 44100$: $\approx 2 \times 10^9$ phép tính/giây → **không thể real-time**.
- FFT $O(N \log N)$: $\approx 44100 \times 16 \approx 7 \times 10^5$ phép tính/giây → **dễ dàng**.

| $N$ | DFT $O(N^2)$ | FFT $O(N \log N)$ | Speedup |
|-----|-------------|-------------------|---------|
| $64$ | $4{,}096$ | $384$ | $\times 11$ |
| $1{,}024$ | $1{,}048{,}576$ | $10{,}240$ | $\times 102$ |
| $10^6$ | $10^{12}$ | $2 \times 10^7$ | $\times 50{,}000$ |

Cooley-Tukey (1965) làm nổ ra cách mạng xử lý tín hiệu số và computational science.

---

## Radix-2 Cooley-Tukey FFT

### Ý Tưởng Divide-and-Conquer

> [!theorem] Theorem 11.1 — Cooley-Tukey Decomposition (Radix-2)
> Với $N = 2M$ (N chẵn), DFT $N$-điểm phân rã thành **hai** DFT $M$-điểm:
>
> Chia $\mathbf{x}$ thành chẵn và lẻ:
> $$
> x_{\text{even}} = (x_0, x_2, x_4, \ldots, x_{N-2}), \qquad x_{\text{odd}} = (x_1, x_3, x_5, \ldots, x_{N-1})
> $$
>
> Đặt $E[k] = \operatorname{DFT}_M(x_{\text{even}})[k]$ và $O[k] = \operatorname{DFT}_M(x_{\text{odd}})[k]$.
>
> Khi đó với $k = 0, 1, \ldots, M-1$:
>
> $$
> \boxed{X[k] = E[k] + \omega_N^k \cdot O[k]}
> $$
>
> $$
> \boxed{X[k + M] = E[k] - \omega_N^k \cdot O[k]}
> $$
>
> trong đó $\omega_N^k = e^{-2\pi ik/N}$ gọi là **twiddle factor**.

**Proof.** Tách tổng $\sum_{n=0}^{N-1}$ thành $n$ chẵn và lẻ:
$$
X[k] = \sum_{n=0}^{M-1} x_{2n}\, \omega_N^{2nk} + \sum_{n=0}^{M-1} x_{2n+1}\, \omega_N^{(2n+1)k}.
$$

Do $\omega_N^{2} = e^{-4\pi i/N} = e^{-2\pi i/M} = \omega_M$:
$$
X[k] = \underbrace{\sum_{n=0}^{M-1} x_{2n}\, \omega_M^{nk}}_{E[k]} + \omega_N^k \underbrace{\sum_{n=0}^{M-1} x_{2n+1}\, \omega_M^{nk}}_{O[k]}.
$$

Với $k + M$: $\omega_N^{k+M} = \omega_N^k \cdot \omega_N^M = \omega_N^k \cdot e^{-\pi i} = -\omega_N^k$, và $E$, $O$ tuần hoàn chu kỳ $M$ ($E[k+M] = E[k]$):
$$
X[k+M] = E[k] - \omega_N^k \cdot O[k]. \quad \blacksquare
$$

### Butterfly Structure

> [!definition] Definition 11.2 — Butterfly Operation
> Mỗi bước $(E[k], O[k]) \to (X[k], X[k+M])$ gọi là một **butterfly**:
>
> ```
>   E[k] ────────┬──── X[k]   = E[k] + W·O[k]
>                │W
>   O[k] ──×W───┤
>                └──── X[k+M] = E[k] - W·O[k]
> ```
>
> với $W = \omega_N^k$ (twiddle factor). Mỗi butterfly cần **1 phép nhân** phức và **2 phép cộng**.

### Phân Tích Độ Phức Tạp

> [!theorem] Theorem 11.3 — Độ Phức Tạp FFT là $O(N \log N)$
> Với $N = 2^p$ (lũy thừa của 2), Radix-2 FFT tính DFT trong:
> $$
> T(N) = \frac{N}{2} \log_2 N \text{ butterflies} = O(N \log N) \text{ phép tính}
> $$

**Proof bằng recurrence.** Mỗi DFT $N$-điểm $=$ hai DFT $N/2$-điểm $+$ $N/2$ butterflies:
$$
T(N) = 2T(N/2) + N/2.
$$
Giải: $T(N) = \frac{N}{2}\log_2 N$. $\blacksquare$

---

## Bit-Reversal Permutation

> [!definition] Definition 11.4 — Bit-Reversal
> Trong Radix-2 FFT (Decimation In Time — DIT), các input cần được sắp xếp theo **bit-reversal permutation** trước khi xử lý.
>
> Với $N = 8$ ($p = 3$ bits):
>
> | Index $n$ | Binary | Bit-reversed | Vị trí mới |
> |-----------|--------|--------------|------------|
> | 0 | 000 | 000 | 0 |
> | 1 | 001 | 100 | 4 |
> | 2 | 010 | 010 | 2 |
> | 3 | 011 | 110 | 6 |
> | 4 | 100 | 001 | 1 |
> | 5 | 101 | 101 | 5 |
> | 6 | 110 | 011 | 3 |
> | 7 | 111 | 111 | 7 |

---

## Implement FFT từ Đầu bằng Python

```python
import numpy as np
import matplotlib.pyplot as plt
import time

# === Radix-2 Cooley-Tukey FFT (DIT) ===
def fft_recursive(x):
    """
    FFT de qui: Cooley-Tukey Radix-2 DIT.
    x: numpy array, do dai phai la luy thua 2.
    """
    N = len(x)
    if N <= 1:
        return x
    if N % 2 != 0:
        raise ValueError("N phai la luy thua cua 2")

    # De qui: DFT cua chan va le
    E = fft_recursive(x[0::2])   # even indices
    O = fft_recursive(x[1::2])   # odd indices

    # Twiddle factors
    k = np.arange(N // 2)
    W = np.exp(-2j * np.pi * k / N)   # omega_N^k

    # Butterfly combination
    X = np.empty(N, dtype=complex)
    X[:N//2] = E + W * O
    X[N//2:] = E - W * O
    return X


def fft_iterative(x):
    """
    FFT lap (khong de qui): Cooley-Tukey DIT, bit-reversal + in-place butterflies.
    Nhanh hon de qui do tranh overhead stack.
    """
    N = len(x)
    p = int(np.log2(N))
    assert 2**p == N, "N phai la luy thua cua 2"

    # Bit-reversal permutation
    x = x.copy().astype(complex)
    j = 0
    for i in range(1, N):
        bit = N >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            x[i], x[j] = x[j], x[i]

    # Butterfly stages
    length = 2
    while length <= N:
        half = length // 2
        # Twiddle factors cho stage nay
        W = np.exp(-2j * np.pi / length * np.arange(half))
        # Ap dung butterflies
        for start in range(0, N, length):
            for k in range(half):
                u = x[start + k]
                v = x[start + k + half] * W[k]
                x[start + k] = u + v
                x[start + k + half] = u - v
        length <<= 1  # length *= 2

    return x


# === Kiem tra chinh xac ===
N = 64
x_test = np.random.randn(N) + 1j * np.random.randn(N)

X_naive = np.array([sum(x_test[n]*np.exp(-2j*np.pi*k*n/N) for n in range(N)) for k in range(N)])
X_recur = fft_recursive(x_test)
X_iter  = fft_iterative(x_test)
X_numpy = np.fft.fft(x_test)

print("=== Kiem tra FFT implementations ===")
print(f"vs DFT naive:   max err = {np.max(np.abs(X_recur - X_naive)):.2e}")
print(f"iter vs recur:  max err = {np.max(np.abs(X_iter  - X_recur)):.2e}")
print(f"iter vs numpy:  max err = {np.max(np.abs(X_iter  - X_numpy)):.2e}")

# === Benchmark: O(N^2) vs O(N log N) ===
print("\n=== Benchmark DFT vs FFT ===")
sizes = [64, 256, 1024, 4096]
times_dft, times_fft = [], []

for N_bench in sizes:
    x_b = np.random.randn(N_bench)

    # DFT naive
    t0 = time.time()
    for _ in range(3):
        n_arr = np.arange(N_bench)
        k_arr = n_arr.reshape(-1, 1)
        _ = np.exp(-2j*np.pi*k_arr*n_arr/N_bench) @ x_b
    times_dft.append((time.time()-t0)/3)

    # FFT numpy
    t0 = time.time()
    for _ in range(100):
        _ = np.fft.fft(x_b)
    times_fft.append((time.time()-t0)/100)

    print(f"N={N_bench:5d}: DFT={times_dft[-1]*1000:.2f}ms, FFT={times_fft[-1]*1000:.3f}ms, "
          f"speedup={times_dft[-1]/times_fft[-1]:.0f}x")

# === Visualization ===
fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# Benchmark plot
ax = axes[0, 0]
ax.loglog(sizes, np.array(sizes)**2 * times_dft[-1]/sizes[-1]**2,
          'r--', linewidth=1.5, label='O(N²) theory')
ax.loglog(sizes, np.array(sizes)*np.log2(sizes) * times_fft[-1]/(sizes[-1]*np.log2(sizes[-1])),
          'b--', linewidth=1.5, label='O(N log N) theory')
ax.loglog(sizes, times_dft, 'rs-', markersize=8, label='DFT naïve (measured)')
ax.loglog(sizes, times_fft, 'bo-', markersize=8, label='numpy FFT (measured)')
ax.set_xlabel('N'); ax.set_ylabel('Time (s)')
ax.set_title('DFT O(N²) vs FFT O(N log N)'); ax.legend(fontsize=9)

# Butterfly diagram for N=8
ax = axes[0, 1]
ax.set_title("Butterfly diagram N=8 (3 stages)")
ax.set_xlim(-0.5, 3.5); ax.set_ylim(-0.5, 8.5)
ax.axis('off')

# Stage 0 positions (bit-reversed)
bit_rev_8 = [0, 4, 2, 6, 1, 5, 3, 7]
for i, pos in enumerate(bit_rev_8):
    ax.text(-0.3, 7-i, f'x[{pos}]', ha='right', va='center', fontsize=9)

# Draw butterfly connections for 3 stages
for stage in range(3):
    gap = 2**stage
    for group_start in range(0, 8, 2*gap):
        for k in range(gap):
            i1 = group_start + k
            i2 = group_start + k + gap
            y1, y2 = 7-i1, 7-i2
            x_s = stage
            ax.plot([x_s+0.1, x_s+0.9], [y1, y1], 'b-', linewidth=1.2)
            ax.plot([x_s+0.1, x_s+0.9], [y2, y2], 'b-', linewidth=1.2)
            ax.plot([x_s+0.5, x_s+0.9], [y1, y1], 'b-', linewidth=1.2)
            ax.plot([x_s+0.5, x_s+0.9], [y2, y2], 'b-', linewidth=1.2)
            ax.annotate('', xy=(x_s+0.9, y2), xytext=(x_s+0.5, y1),
                       arrowprops=dict(arrowstyle='->', color='tomato', lw=1.2))
ax.set_title("FFT Butterfly: N=8, 3 stages, log₂8=3")

# Real-world: spectral analysis cua ECG-like signal
ax = axes[1, 0]
t = np.linspace(0, 1, 1024, endpoint=False)
ecg_like = (np.sin(2*np.pi*1.2*t) +          # fundamental (heart rate 72 bpm)
            0.5*np.sin(2*np.pi*2.4*t) +       # 2nd harmonic
            0.3*np.cos(2*np.pi*5*t) +         # noise component
            0.1*np.random.randn(1024))
ax.plot(t[:200], ecg_like[:200], 'steelblue', linewidth=1)
ax.set_title("ECG-like signal (200/1024 mau)"); ax.set_xlabel("t (s)")

ax = axes[1, 1]
X_ecg = np.fft.rfft(ecg_like)
freqs_ecg = np.fft.rfftfreq(1024, d=1/1024)
ax.plot(freqs_ecg[:50], np.abs(X_ecg[:50])/1024, 'steelblue', linewidth=1.5)
ax.set_title("Power spectrum (FFT): peaks tai 1.2Hz, 2.4Hz, 5Hz")
ax.set_xlabel("Frequency (Hz)"); ax.set_ylabel("|X[k]|/N")
ax.set_xlim(0, 10)

plt.suptitle("Fast Fourier Transform — Cooley-Tukey O(N log N)", fontsize=13)
plt.tight_layout()
plt.savefig("fft.png", dpi=120)
plt.show()
```

---

## Các Variant FFT Khác

> [!note] Remark 11.5 — FFT cho $N$ không phải lũy thừa 2
> Radix-2 yêu cầu $N = 2^p$. Trong thực tế:
>
> - **Radix-4** ($N = 4^p$): tối ưu hơn nhờ ít twiddle factor hơn
> - **Mixed-radix**: $N = 2^a \cdot 3^b \cdot 5^c \cdots$ — dùng DFT con kích thước 2, 3, 5...
> - **Bluestein's algorithm** (chirp-Z): FFT cho $N$ **tùy ý**, kể cả số nguyên tố. Độ phức tạp $O(N \log N)$.
> - **scipy.fft** và **numpy.fft** sử dụng FFTPACK/pocketfft với mixed-radix — nhanh nhất cho $N$ smooth (ít thừa số nguyên tố lớn).

> [!note] Remark 11.6 — Lịch Sử
> - **Gauss (1805)**: Phát minh ý tưởng FFT (chưa công bố, dùng để tính quỹ đạo tiểu hành tinh).
> - **Cooley & Tukey (1965)**: Tái phát minh và phổ biến với paper nổi tiếng — bắt đầu kỷ nguyên DSP.
> - **Winograd (1978)**: Giảm số phép nhân xuống minimum.
> - **FFTW (Frigo & Johnson, 1998)**: Implementation tự điều chỉnh (self-tuning), hiện là chuẩn de facto.

---

## Summary / Key Takeaways

- **DFT naïve $O(N^2)$**: không khả dụng cho dữ liệu lớn — $N = 10^6$ cần $10^{12}$ phép tính.
- **Cooley-Tukey Radix-2 FFT**: chia tách $x$ thành chẵn/lẻ, tái dụng $E[k]$ và $O[k]$ cho cả hai nửa output.
- **Butterfly**: $(E[k], O[k]) \to (E[k] + W\cdot O[k],\; E[k] - W\cdot O[k])$ — chỉ 1 nhân + 2 cộng.
- **Recurrence**: $T(N) = 2T(N/2) + N/2 \Rightarrow T(N) = \frac{N}{2}\log_2 N$ — $O(N \log N)$.
- **Bit-reversal permutation**: input cần sắp xếp lại trước khi xử lý butterfly in-place.
- **Correctness proof**: bằng tính trực giao của roots of unity và induction.
- **Variant**: Radix-4, mixed-radix, Bluestein — `numpy.fft` và `scipy.fft` tự chọn tốt nhất.
- **Tầm quan trọng**: FFT là một trong các thuật toán quan trọng nhất thế kỷ 20 — nền tảng của audio/video processing, telecommunications, và cryptography (NTT ở Lesson 14).

---

## References

- Cooley, J. W. & Tukey, J. W. "An algorithm for the machine calculation of complex Fourier series." *Math. Comput.* 19(90), 1965.
- Oppenheim, A. V. & Schafer, R. W. *Discrete-Time Signal Processing* (3rd ed.). Chương 9.
- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 7.
- Chứng minh chi tiết correctness: [[a3-cooley-tukey-fft|A3. Cooley-Tukey FFT Derivation]]
