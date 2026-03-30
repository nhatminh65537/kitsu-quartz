---
title: "04. Hội Tụ Pointwise & Đồng Đều"
tags: [math, fourier-analysis, fourier-series, convergence, lesson-04]
aliases: [Pointwise Convergence, Dirichlet Kernel, Fejer Kernel]
created: 2026-03-24
---

> **Prerequisites**: [[03-fourier-series-intro|03. Chuỗi Fourier — Định nghĩa & Ví dụ]] — hệ số Fourier, partial sums $S_N f$
> **Objectives**:
> - Xây dựng Dirichlet kernel và viết $S_N f$ như tích chập
> - Chứng minh tiêu chuẩn Dini và định lý Dirichlet-Jordan cho hội tụ pointwise
> - Xây dựng Fejér kernel, summability Cesàro và định lý Fejér (uniform convergence cho hàm liên tục)
> - Giải thích Gibbs phenomenon một cách chính xác
> - Hiểu sự khác biệt giữa Dirichlet kernel (không dương) và Fejér kernel (dương)
> - Biết kết quả âm: Kolmogorov ($L^1$ Fourier series phân kỳ a.e.) và định lý Carleson ($L^2$ hội tụ a.e.)

---

## Motivation / Intuition

Câu hỏi trung tâm: **Chuỗi Fourier $\sum_{n=-\infty}^\infty \hat{f}(n) e^{inx}$ có hội tụ về $f(x)$ không?**

Câu trả lời không đơn giản — tùy thuộc vào:
- Nghĩa hội tụ (pointwise? uniform? $L^2$? Cesàro?)
- Độ trơn (regularity) của $f$

Bài học này tập trung vào **hội tụ pointwise và đồng đều**, sử dụng hai công cụ chính: Dirichlet kernel và Fejér kernel. Bài Lesson 05 sẽ xử lý hội tụ $L^2$.

---

## Dirichlet Kernel và Công Thức Tích Chập

### Dirichlet Kernel

> [!definition] Definition 4.1 — Dirichlet Kernel
> **Dirichlet kernel** bậc $N$ là hàm $2\pi$-tuần hoàn:
>
> $$
> D_N(x) = \sum_{n=-N}^{N} e^{inx}
> $$
>
> Dùng tổng geometric series (đặt $r = e^{ix}$), ta tính được dạng đóng:
>
> $$
> D_N(x) = \frac{\sin\!\left((N + \tfrac{1}{2})x\right)}{\sin(x/2)}, \qquad x \neq 0 \pmod{2\pi}
> $$
>
> và $D_N(0) = 2N + 1$.

**Proof.** Khi $x \neq 0$:
$$
D_N(x) = e^{-iNx} \cdot \frac{e^{i(2N+1)x} - 1}{e^{ix} - 1} = e^{-iNx} \cdot e^{iNx} \cdot \frac{e^{i(N+1/2)x} - e^{-i(N+1/2)x}}{e^{ix/2} - e^{-ix/2}} = \frac{\sin((N+\frac{1}{2})x)}{\sin(x/2)}. \quad \blacksquare
$$

> [!theorem] Theorem 4.2 — Partial Sum là Tích Chập với Dirichlet Kernel
> Với $f \in L^1(\mathbb{T})$:
>
> $$
> S_N f(x) = (f * D_N)(x) = \frac{1}{2\pi} \int_{-\pi}^{\pi} f(t)\, D_N(x - t)\, dt
> $$

**Proof.** Tính trực tiếp:

$$
S_N f(x) = \sum_{n=-N}^{N} \hat{f}(n) e^{inx} = \sum_{n=-N}^{N} \left(\frac{1}{2\pi}\int f(t) e^{-int} dt\right) e^{inx}
= \frac{1}{2\pi}\int f(t) \underbrace{\sum_{n=-N}^{N} e^{in(x-t)}}_{D_N(x-t)} dt. \quad \blacksquare
$$

### Tính Chất Dirichlet Kernel

> [!theorem] Theorem 4.3 — Tính chất của $D_N$
> 1. $\dfrac{1}{2\pi}\int_{-\pi}^{\pi} D_N(x)\, dx = 1$ (chuẩn hóa)
> 2. $D_N$ là hàm chẵn: $D_N(-x) = D_N(x)$
> 3. $\lVert D_N \rVert_{L^1(\mathbb{T})} \sim \frac{4}{\pi^2} \ln N \to +\infty$ — **$D_N$ KHÔNG là approximate identity**!

> [!warning] Remark 4.4 — Tại sao $D_N$ gây khó khăn?
> Khác với các positive kernels, $D_N$ nhận cả giá trị âm với **biên độ lớn** gần $x = 0$. Điều này là **nguyên nhân sâu xa** của:
> 1. Gibbs phenomenon — vọt lố tại điểm gián đoạn
> 2. Sự tồn tại hàm liên tục có chuỗi Fourier phân kỳ pointwise
>
> $\lVert D_N \rVert_1 \to \infty$ nghĩa là phép toán $f \mapsto S_N f$ có norm toán tử $\to \infty$ trên $C(\mathbb{T})$.

---

## Tiêu Chuẩn Dini — Hội Tụ Pointwise

> [!theorem] Theorem 4.5 — Tiêu Chuẩn Dini (Dini's Criterion)
> Cho $f \in L^1(\mathbb{T})$ và $x_0 \in \mathbb{R}$. Nếu tồn tại $\ell \in \mathbb{C}$ và $\delta > 0$ sao cho:
>
> $$
> \int_0^{\delta} \frac{|f(x_0 + t) + f(x_0 - t) - 2\ell|}{t} \, dt < \infty
> $$
>
> thì $S_N f(x_0) \to \ell$ khi $N \to \infty$.

**Proof sketch.** Từ công thức tích chập và tính chẵn của $D_N$:
$$
S_N f(x_0) - \ell = \frac{1}{2\pi}\int_0^{\pi} [f(x_0+t) + f(x_0-t) - 2\ell] \frac{\sin((N+\frac{1}{2})t)}{\sin(t/2)} dt.
$$
Đặt $\varphi(t) = [f(x_0+t) + f(x_0-t) - 2\ell] \cdot \frac{t/2}{\sin(t/2)}$. Điều kiện Dini đảm bảo $\varphi \in L^1(0,\delta)$. Áp dụng Riemann-Lebesgue Lemma cho $\varphi(t) \cdot t^{-1} \sin((N+\frac{1}{2})t)$, ta kết luận tích phân $\to 0$. $\blacksquare$

> [!corollary] Corollary 4.6 — Các Điều Kiện Đủ
> Mỗi điều kiện sau đây đảm bảo $S_N f(x_0) \to f(x_0)$:
>
> 1. $f$ **khả vi** tại $x_0$
>
> 2. $f$ **Lipschitz** tại $x_0$: $|f(x_0 \pm t) - f(x_0)| \leq C|t|^{\alpha}$, $\alpha > 0$
>
> 3. $f$ **liên tục** tại $x_0$ và $f$ có **biến thiên hữu hạn** (bounded variation) trên lân cận $x_0$

### Định lý Dirichlet-Jordan

> [!theorem] Theorem 4.7 — Dirichlet-Jordan
> Nếu $f \in L^1(\mathbb{T})$ có **biến thiên hữu hạn** (bounded variation) trên $[a, b] \ni x_0$ thì:
>
> $$
> S_N f(x_0) \to \frac{f(x_0^+) + f(x_0^-)}{2}
> $$
>
> trong đó $f(x_0^\pm) = \lim_{t \to 0^\pm} f(x_0 + t)$ là các giới hạn một phía.
>
> Nếu $f$ liên tục tại $x_0$ thì $f(x_0^+) = f(x_0^-) = f(x_0)$, nên $S_N f(x_0) \to f(x_0)$.

> [!example] Example 4.8 — Sóng Vuông tại Điểm Nhảy
> Với $f = \operatorname{sgn}(\sin x)$, tại $x_0 = 0$: $f(0^+) = 1$, $f(0^-) = -1$. Định lý Dirichlet-Jordan dự đoán $S_N f(0) \to \frac{1 + (-1)}{2} = 0$, đúng với kết quả trực tiếp vì $S_N f(0) = 0$ với mọi $N$ (do $f$ là hàm lẻ nên tổng tại $0$ bằng $0$).

---

## Gibbs Phenomenon — Phân tích Chính Xác

> [!theorem] Theorem 4.9 — Gibbs Phenomenon
> Cho $f = \mathbf{1}_{(0,\pi)} - \mathbf{1}_{(-\pi,0)}$ (sóng vuông đơn vị). Khi $N \to \infty$:
>
> $$
> \max_{x \in (0, \pi)} S_N f(x) \to \frac{1}{\pi} \int_0^{\pi} \frac{\sin t}{t} \, dt \approx 1 + 0.179... > 1
> $$
>
> Chuỗi Fourier **luôn vọt lố** khoảng $9\%$ so với biên độ thực, **bất kể $N$ lớn thế nào**.

**Proof sketch.** Maximum của $S_N f$ gần $x = 0$ xảy ra tại $x_N = \pi/(2N+1) \to 0$. Tính:
$$
S_N f(x_N) = \frac{2}{\pi} \sum_{k=1}^{2N+1} \frac{\sin(k \pi/(2N+1))}{k} \approx \frac{2}{\pi} \int_0^\pi \frac{\sin t}{t} dt = \frac{2}{\pi} \cdot \operatorname{Si}(\pi)
$$
Vì $\operatorname{Si}(\pi) = \int_0^\pi \frac{\sin t}{t} dt \approx 1.852$, nên $\max \approx \frac{2}{\pi} \cdot 1.852 \approx 1.179$. Vọt lố $\approx 17.9\%$ so với giá trị $\pm 1$... Chuẩn hóa theo biên độ bước nhảy ($= 2$) cho $8.9\%$. $\blacksquare$

---

## Fejér Kernel và Cesàro Summability

Giải pháp cho vấn đề Gibbs: thay vì dùng partial sums $S_N f$, dùng **trung bình Cesàro** của chúng.

### Trung Bình Cesàro và Fejér Kernel

> [!definition] Definition 4.10 — Trung Bình Cesàro (Cesàro Means) và Fejér Kernel
> **Trung bình Cesàro** bậc $N$ của chuỗi Fourier:
>
> $$
> \sigma_N f(x) = \frac{1}{N} \sum_{k=0}^{N-1} S_k f(x) = \frac{1}{N} \sum_{k=0}^{N-1} (f * D_k)(x) = (f * F_N)(x)
> $$
>
> trong đó **Fejér kernel** $F_N$ là:
>
> $$
> F_N(x) = \frac{1}{N} \sum_{k=0}^{N-1} D_k(x) = \frac{1}{N} \cdot \frac{\sin^2(Nx/2)}{\sin^2(x/2)} = \frac{1}{N} \left( \frac{\sin(Nx/2)}{\sin(x/2)} \right)^2
> $$

> [!theorem] Theorem 4.11 — Tính Chất của Fejér Kernel
> 1. $\dfrac{1}{2\pi}\int_{-\pi}^{\pi} F_N(x) \, dx = 1$
> 2. $F_N(x) \geq 0$ với mọi $x$ — **đây là tính chất then chốt**, khác với $D_N$!
> 3. Với mọi $\delta > 0$: $\max_{|x| \geq \delta} F_N(x) \leq \dfrac{1}{N \sin^2(\delta/2)} \to 0$ khi $N \to \infty$

**Proof của (2).** $F_N(x) = \frac{1}{N} \cdot \frac{\sin^2(Nx/2)}{\sin^2(x/2)} \geq 0$ vì là bình phương chia bình phương. $\blacksquare$

> [!note] Remark 4.12 — Approximate Identity
> Vì $F_N \geq 0$, $\int F_N = 1$, và $F_N$ tập trung gần $0$ (tính chất 3), nên $\{F_N\}$ là **positive approximate identity** (xấp xỉ đơn vị dương) — hoàn toàn khác với $\{D_N\}$!

### Định Lý Fejér

> [!theorem] Theorem 4.13 — Định Lý Fejér (Fejér's Theorem)
> Cho $f: \mathbb{T} \to \mathbb{C}$.
>
> 1. Nếu $f$ **liên tục** tại $x_0$, thì $\sigma_N f(x_0) \to f(x_0)$.
>
> 2. Nếu $f$ **liên tục trên** $\mathbb{T}$, thì hội tụ là **đồng đều** (uniform): $\lVert \sigma_N f - f \rVert_\infty \to 0$.
>
> 3. Nếu $f \in L^p(\mathbb{T})$ với $1 \leq p < \infty$, thì $\lVert \sigma_N f - f \rVert_p \to 0$.

**Proof của (1).** Ta cần chứng minh $\sigma_N f(x_0) - f(x_0) \to 0$. Viết:
$$
\sigma_N f(x_0) - f(x_0) = \frac{1}{2\pi} \int_{-\pi}^{\pi} [f(x_0 - t) - f(x_0)] F_N(t) \, dt.
$$
Với $\varepsilon > 0$, chọn $\delta > 0$ để $|f(x_0 - t) - f(x_0)| < \varepsilon$ khi $|t| < \delta$ (liên tục). Chia tích phân thành hai phần $|t| < \delta$ và $|t| \geq \delta$:

- **Phần $|t| < \delta$**: $\leq \varepsilon \cdot \frac{1}{2\pi}\int F_N = \varepsilon$
- **Phần $|t| \geq \delta$**: $\leq 2\lVert f \rVert_\infty \cdot \max_{|t| \geq \delta} F_N(t) \to 0$ khi $N \to \infty$

Vậy $|\sigma_N f(x_0) - f(x_0)| < 2\varepsilon$ với $N$ đủ lớn. $\blacksquare$

> [!corollary] Corollary 4.14 — Hệ quả quan trọng
> 1. **Weierstrass Approximation**: Mọi hàm liên tục trên $\mathbb{T}$ đều xấp xỉ đồng đều bởi các **trigonometric polynomials** (vì $\sigma_N f$ là trigonometric polynomial).
>
> 2. **Mật độ trong $L^p$**: Trigonometric polynomials **dense** trong $L^p(\mathbb{T})$ với $1 \leq p < \infty$.
>
> 3. **Duy nhất Fourier coefficients**: Nếu $f \in L^1(\mathbb{T})$ và $\hat{f}(n) = 0$ với mọi $n \in \mathbb{Z}$, thì $f = 0$ a.e.

> [!note] Remark 4.15 — Cesàro vs Pointwise
> Nếu $S_N f(x_0) \to \ell$ (hội tụ thông thường), thì $\sigma_N f(x_0) \to \ell$ cũng vậy (tính chất Cesàro mean). Nhưng chiều ngược **không đúng**: $\sigma_N f$ có thể hội tụ dù $S_N f$ không hội tụ.
>
> Điều này đặc biệt hữu ích tại điểm nhảy: $\sigma_N f(x_0) \to \frac{f(x_0^+) + f(x_0^-)}{2}$ mà **không có Gibbs phenomenon**.

---

## Kết Quả Âm và Định Lý Carleson

> [!warning] Theorem 4.16 — Kết Quả Âm (Du Bois-Reymond, Kolmogorov)
> 1. **(Du Bois-Reymond, 1876)**: Tồn tại hàm **liên tục** $f \in C(\mathbb{T})$ có chuỗi Fourier **phân kỳ** tại ít nhất một điểm.
>
> 2. **(Kolmogorov, 1923)**: Tồn tại $f \in L^1(\mathbb{T})$ có chuỗi Fourier **phân kỳ almost everywhere** (thậm chí có thể mọi nơi).

> [!theorem] Theorem 4.17 — Định Lý Carleson (1966)
> Với mọi $f \in L^2(\mathbb{T})$ (hay rộng hơn, $f \in L^p(\mathbb{T})$ với $p > 1$):
>
> $$
> S_N f(x) \to f(x) \quad \text{a.e. khi } N \to \infty
> $$
>
> Đây là **định lý sâu sắc nhất trong lý thuyết chuỗi Fourier**, được chứng minh năm 1966 sau hơn 50 năm bỏ ngỏ (câu hỏi của Lusin, 1913).

> [!note] Remark 4.18
> Định lý Carleson **không** phủ được trường hợp $L^1$: đây chính là khoảng trống (Kolmogorov cho $L^1$, Carleson cho $L^2$). Ranh giới giữa hội tụ a.e. và phân kỳ a.e. nằm ở $p = 1$.

---

## Python — So Sánh Dirichlet vs Fejér

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-np.pi, np.pi, 2000)
x_safe = np.where(np.abs(x) < 1e-9, 1e-9, x)

def dirichlet_kernel(N, x):
    return np.where(np.abs(x) < 1e-9, 2*N+1,
                    np.sin((N+0.5)*x) / np.sin(x/2))

def fejer_kernel(N, x):
    return np.where(np.abs(x) < 1e-9, float(N),
                    (1/N) * (np.sin(N*x/2) / np.sin(x/2))**2)

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# --- Dirichlet kernels ---
ax = axes[0, 0]
for N, c in zip([5, 10, 20], ['steelblue', 'tomato', 'green']):
    ax.plot(x, dirichlet_kernel(N, x), color=c, linewidth=1.2, label=f'N={N}')
ax.axhline(0, color='k', linewidth=0.5)
ax.set_title('Dirichlet Kernel $D_N(x)$ — co gia tri am!')
ax.set_ylim(-10, 45); ax.legend()

# --- Fejer kernels ---
ax = axes[0, 1]
for N, c in zip([5, 10, 20], ['steelblue', 'tomato', 'green']):
    ax.plot(x, fejer_kernel(N, x), color=c, linewidth=1.2, label=f'N={N}')
ax.axhline(0, color='k', linewidth=0.5)
ax.set_title('Fejer Kernel $F_N(x)$ — luon khong am!')
ax.set_ylim(-0.5, 22); ax.legend()

# --- Song vuong: Gibbs voi Dirichlet ---
f = np.sign(np.sin(x)); f[np.abs(x) < 1e-9] = 0
dx = x[1] - x[0]

def convolve_kernel(f, K, x):
    """Tinh f * K bang tich phan so."""
    result = np.zeros(len(x))
    for i, xi in enumerate(x):
        shifted = np.roll(f, -i)
        result[i] = np.trapz(shifted * K[::-1], x) / (2*np.pi)
    return result

ax = axes[1, 0]
ax.plot(x, f, 'gray', linewidth=1, alpha=0.4, label='f(x)')
for N, c in zip([5, 20], ['steelblue', 'tomato']):
    D = dirichlet_kernel(N, x)
    sN = np.real(np.fft.ifft(np.fft.fft(f) * np.fft.fft(D)) * dx / (2*np.pi))
    # Cach don gian hon: dung FFT
    F_coeff = np.fft.fftshift(np.fft.fft(f)) / len(f)
    ns = np.arange(-len(x)//2, len(x)//2)
    mask = np.abs(ns) <= N
    sN = np.real(np.fft.ifft(np.fft.ifftshift(np.fft.fftshift(np.fft.fft(f)) * mask)))
    ax.plot(x, sN, color=c, linewidth=1.2, label=f'$S_{{{N}}}f$ (Dirichlet)')
ax.set_title('Gibbs: vot lo tai diem gay'); ax.legend(); ax.set_ylim(-1.5, 1.5)

ax = axes[1, 1]
ax.plot(x, f, 'gray', linewidth=1, alpha=0.4, label='f(x)')
for N, c in zip([5, 20], ['steelblue', 'tomato']):
    F_coeff_all = np.fft.fftshift(np.fft.fft(f))
    ns = np.arange(-len(x)//2, len(x)//2)
    sigN = np.zeros(len(x), dtype=complex)
    for k in range(N):
        mask = np.abs(ns) <= k
        sN_k = np.fft.ifft(np.fft.ifftshift(F_coeff_all * mask))
        sigN += sN_k
    sigN = np.real(sigN / N)
    ax.plot(x, sigN, color=c, linewidth=1.2, label=f'$\\sigma_{{{N}}}f$ (Fejer)')
ax.set_title('Fejer: khong co Gibbs, hoi tu day!'); ax.legend(); ax.set_ylim(-1.5, 1.5)

plt.suptitle('Dirichlet vs Fejer kernel — su khac biet cot loi', fontsize=13)
plt.tight_layout()
plt.savefig("dirichlet_vs_fejer.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **$S_N f = f * D_N$**: partial sum là tích chập với Dirichlet kernel — chìa khóa để phân tích hội tụ.
- **Dirichlet kernel** $D_N$: nhận cả giá trị âm, $\lVert D_N \rVert_1 \sim c \ln N \to \infty$ — **không** phải approximate identity → gây Gibbs phenomenon.
- **Tiêu chuẩn Dini**: $S_N f(x_0) \to f(x_0)$ nếu điều kiện Dini thỏa (bao gồm $f$ khả vi hay Hölder continuous).
- **Định lý Dirichlet-Jordan**: tại điểm nhảy, $S_N f(x_0) \to \frac{f(x_0^+) + f(x_0^-)}{2}$.
- **Gibbs phenomenon**: vọt lố $\approx 9\%$ tại điểm gián đoạn, **không biến mất** khi $N \to \infty$.
- **Fejér kernel** $F_N \geq 0$: positive approximate identity → hội tụ Cesàro $\sigma_N f = f * F_N$.
- **Định lý Fejér**: $\lVert \sigma_N f - f \rVert_\infty \to 0$ với $f$ liên tục, **không có Gibbs** — và $\lVert \sigma_N f - f \rVert_p \to 0$ với $f \in L^p$.
- Hệ quả: trigonometric polynomials dense trong $C(\mathbb{T})$ và $L^p(\mathbb{T})$; Fourier coefficients xác định $f$ duy nhất.
- **Carleson (1966)**: $f \in L^2 \Rightarrow S_N f \to f$ **a.e.** — định lý sâu nhất của lý thuyết; Kolmogorov cho thấy $L^1$ là ngoại lệ.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis: An Introduction*. Princeton, 2003. Chương 2–3.
- Körner, T. W. *Fourier Analysis*. Cambridge, 1988. Chương 4–8.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Katznelson, Y. *An Introduction to Harmonic Analysis* (3rd ed.). Cambridge, 2004. Chương 1.
- Chứng minh chi tiết Fejér's Theorem: [[a2-proof-of-fejer-theorem|A2. Proof of Fejér's Theorem]]
