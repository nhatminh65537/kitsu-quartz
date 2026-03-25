---
title: "05. Lý Thuyết L² của Chuỗi Fourier"
tags: [math, fourier-analysis, fourier-series, hilbert-space, l2-theory, lesson-05]
aliases: [L2 Theory, Parseval Identity, Completeness]
created: 2026-03-24
---

> **Prerequisites**: [[02-lebesgue-integral-lp|02. Tích phân Lebesgue & Không gian L^p]] — Hilbert space $L^2$; [[03-fourier-series-intro|03. Chuỗi Fourier]] — hệ số Fourier; [[04-pointwise-convergence|04. Hội Tụ Pointwise]] — density của trigonometric polynomials
> **Objectives**:
> - Phát biểu và chứng minh Parseval's Identity trong $L^2(\mathbb{T})$
> - Chứng minh $\{e^{inx}/\sqrt{2\pi}\}$ là complete orthonormal system (CONS) trong $L^2(\mathbb{T})$
> - Hiểu nghĩa của $L^2$ convergence vs pointwise convergence
> - Nắm Best Approximation Theorem: partial sum $S_N f$ là phép chiếu tối ưu
> - Hiểu isomorphism $L^2(\mathbb{T}) \cong \ell^2(\mathbb{Z})$ và ý nghĩa vật lý của Parseval

---

## Motivation / Intuition

Lesson 04 cho thấy hội tụ pointwise của chuỗi Fourier phức tạp và đòi hỏi điều kiện ngặt. Nhưng trong không gian $L^2(\mathbb{T})$, câu chuyện **hoàn toàn đẹp**:

> Với mọi $f \in L^2(\mathbb{T})$, chuỗi Fourier hội tụ về $f$ **theo nghĩa $L^2$**.

Hơn nữa, $L^2$ là **Hilbert space** — có inner product, có trực giao, có phép chiếu. Chuỗi Fourier trong $L^2$ hoàn toàn tương tự khai triển theo cơ sở trực chuẩn trong $\mathbb{R}^n$, chỉ khác là $n = \infty$.

Đây là lý thuyết Fourier "đúng nghĩa nhất" ở graduate level, và là nền tảng cho định lý Plancherel ở Lesson 08.

---

## Bessel's Inequality

> [!theorem] Theorem 5.1 — Bất Đẳng Thức Bessel (Bessel's Inequality)
> Cho $f \in L^2(\mathbb{T})$. Với mọi $N \geq 0$:
>
> $$
> \sum_{n=-N}^{N} |\hat{f}(n)|^2 \leq \lVert f \rVert_{L^2}^2 = \frac{1}{2\pi} \int_{-\pi}^{\pi} |f(x)|^2 \, dx
> $$
>
> Do đó chuỗi $\sum_{n=-\infty}^{\infty} |\hat{f}(n)|^2$ hội tụ và:
>
> $$
> \sum_{n \in \mathbb{Z}} |\hat{f}(n)|^2 \leq \lVert f \rVert_{L^2}^2
> $$

**Proof.** Tính:

$$
0 \leq \left\lVert f - S_N f \right\rVert_{L^2}^2 = \lVert f \rVert^2 - 2\operatorname{Re}\langle f, S_N f \rangle + \lVert S_N f \rVert^2.
$$

Do tính trực giao:

$$
\langle f, S_N f \rangle = \sum_{|n| \leq N} \hat{f}(n) \langle f, e^{inx} \rangle^* = \sum_{|n| \leq N} |\hat{f}(n)|^2
$$

$$
\lVert S_N f \rVert^2 = \sum_{|n| \leq N} |\hat{f}(n)|^2
$$

Vậy $\lVert f - S_N f \rVert^2 = \lVert f \rVert^2 - \sum_{|n| \leq N} |\hat{f}(n)|^2 \geq 0$, tức là $\sum_{|n| \leq N} |\hat{f}(n)|^2 \leq \lVert f \rVert^2$. $\blacksquare$

---

## Best Approximation Theorem

> [!theorem] Theorem 5.2 — Phép Chiếu Tối Ưu (Best Approximation)
> Trong tất cả các tổ hợp tuyến tính $\sum_{|n| \leq N} c_n e^{inx}$, partial sum $S_N f$ **gần** $f$ nhất theo nghĩa $L^2$:
>
> $$
> \left\lVert f - S_N f \right\rVert_{L^2} \leq \left\lVert f - \sum_{|n| \leq N} c_n e^{inx} \right\rVert_{L^2}
> $$
>
> với đẳng thức khi và chỉ khi $c_n = \hat{f}(n)$ với mọi $|n| \leq N$.
>
> Nói cách khác, $S_N f$ là **phép chiếu trực giao** của $f$ lên $V_N = \operatorname{span}\{e^{inx} : |n| \leq N\}$.

**Proof.** Với bất kỳ $c_n$:

$$
\left\lVert f - \sum c_n e^{inx} \right\rVert^2 = \left\lVert (f - S_N f) + \sum_{|n| \leq N} (\hat{f}(n) - c_n) e^{inx} \right\rVert^2
$$

Hai phần này **trực giao** nhau (vì $f - S_N f \perp V_N$), nên:

$$
= \lVert f - S_N f \rVert^2 + \sum_{|n| \leq N} |\hat{f}(n) - c_n|^2 \geq \lVert f - S_N f \rVert^2. \quad \blacksquare
$$

---

## Parseval's Identity và $L^2$ Convergence

> [!theorem] Theorem 5.3 — Parseval's Identity (Đồng Nhất thức Parseval)
> Cho $f \in L^2(\mathbb{T})$. Khi đó:
>
> $$
> \lVert f \rVert_{L^2}^2 = \sum_{n \in \mathbb{Z}} |\hat{f}(n)|^2
> $$
>
> Tương đương: $\lVert S_N f - f \rVert_{L^2} \to 0$ khi $N \to \infty$.
>
> Và dạng **phân cực (polarized)**:
>
> $$
> \langle f, g \rangle_{L^2} = \sum_{n \in \mathbb{Z}} \hat{f}(n)\, \overline{\hat{g}(n)}
> $$

**Proof.** Từ Bessel's inequality: $\sum_{n} |\hat{f}(n)|^2 \leq \lVert f \rVert^2$. Cần chứng minh đẳng thức, tức là $\lVert f - S_N f \rVert \to 0$.

Từ Lesson 04 (Corollary 4.14 và định lý Fejér): trigonometric polynomials **dense** trong $L^2(\mathbb{T})$. Vậy với mọi $\varepsilon > 0$, tồn tại trigonometric polynomial $p$ với $\lVert f - p \rVert_2 < \varepsilon$. Nếu $\deg(p) \leq M$, thì với $N \geq M$:

$$
\lVert f - S_N f \rVert_2 \leq \lVert f - p \rVert_2 \leq \varepsilon
$$

(vì $S_N f$ là best approximation bởi Theorem 5.2, và $p \in V_N$ khi $N \geq M$). $\blacksquare$

> [!example] Example 5.4 — Tính tổng chuỗi bằng Parseval
> Dùng $f(x) = x$ trên $[-\pi, \pi]$: hệ số Fourier $\hat{f}(n) = \frac{(-1)^{n+1}}{in}$ với $n \neq 0$, và $\hat{f}(0) = 0$.
>
> Parseval:
>
> $$
> \lVert f \rVert_2^2 = \frac{1}{2\pi}\int_{-\pi}^{\pi} x^2\, dx = \frac{\pi^2}{3}
> $$
>
> $$
> \sum_{n \neq 0} |\hat{f}(n)|^2 = \sum_{n \neq 0} \frac{1}{n^2} = 2\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{3}
> $$
>
> Vậy $\displaystyle\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}$ — đây là **Basel problem** (Euler, 1734), được giải bằng Fourier!

> [!example] Example 5.5 — Tính Basel problem $\pi^2/6$ từ sóng tam giác
> Với $f(x) = x^2$ trên $[-\pi, \pi]$: $\hat{f}(0) = \pi^2/3$ và $\hat{f}(n) = \frac{2(-1)^n}{n^2}$ với $n \neq 0$.
>
> Parseval:
> $$
> \frac{1}{2\pi}\int_{-\pi}^\pi x^4\, dx = \sum_n |\hat{f}(n)|^2
> $$
> $$
> \frac{\pi^4}{5} = \frac{\pi^4}{9} + 4 \sum_{n=1}^\infty \frac{1}{n^4}
> $$
>
> Suy ra $\displaystyle\sum_{n=1}^\infty \frac{1}{n^4} = \frac{\pi^4}{90}$.

---

## Tính Đầy Đủ: Complete Orthonormal System

> [!theorem] Theorem 5.6 — Tính Đầy Đủ của $\{e^{inx}\}$
> Hệ $\left\{\dfrac{e^{inx}}{\sqrt{2\pi}}\right\}_{n \in \mathbb{Z}}$ là **complete orthonormal system (CONS)** hay **orthonormal basis** của $L^2(\mathbb{T})$:
>
> $$
> f = \sum_{n \in \mathbb{Z}} \langle f, e_n \rangle\, e_n \quad \text{trong } L^2(\mathbb{T})
> $$
>
> trong đó $e_n(x) = e^{inx}/\sqrt{2\pi}$ và đẳng thức theo nghĩa $L^2$.

> [!note] Remark 5.7 — Tương đương với Parseval
> Trong Hilbert space $H$, một hệ trực chuẩn $\{e_n\}$ là đầy đủ (complete) khi và chỉ khi Parseval's identity $\lVert f \rVert^2 = \sum_n |\langle f, e_n \rangle|^2$ đúng với mọi $f \in H$.

**Proof.** Ta cần chứng minh: nếu $f \in L^2(\mathbb{T})$ thỏa $\hat{f}(n) = 0$ với mọi $n$, thì $f = 0$ a.e.

Nếu $\hat{f}(n) = 0$ với mọi $n$, thì $\sigma_N f = 0$ với mọi $N$ (trung bình Cesàro của chuỗi $0$). Nhưng theo định lý Fejér (Theorem 4.13), $\sigma_N f \to f$ trong $L^2$. Vậy $f = 0$ trong $L^2$, tức $f = 0$ a.e. $\blacksquare$

---

## Đẳng Cấu $L^2(\mathbb{T}) \cong \ell^2(\mathbb{Z})$

> [!theorem] Theorem 5.8 — Riesz-Fischer và Isomorphism Fourier
> Phép biến đổi Fourier:
>
> $$
> \mathcal{F}: L^2(\mathbb{T}) \to \ell^2(\mathbb{Z}), \qquad f \mapsto \left(\hat{f}(n)\right)_{n \in \mathbb{Z}}
> $$
>
> là một **isometric isomorphism** (ánh xạ tuyến tính, toàn ánh, bảo toàn inner product):
>
> $$
> \langle \mathcal{F} f, \mathcal{F} g \rangle_{\ell^2} = \langle f, g \rangle_{L^2}
> $$
>
> Hơn nữa, mọi dãy $(c_n)_{n \in \mathbb{Z}} \in \ell^2(\mathbb{Z})$ đều là dãy hệ số Fourier của một hàm $f \in L^2(\mathbb{T})$, tức là $\mathcal{F}$ **surjective**.

> [!note] Remark 5.9 — Ý nghĩa
> Định lý này nói: không gian hàm $L^2(\mathbb{T})$ và không gian dãy $\ell^2(\mathbb{Z})$ "giống nhau" một cách toán học. Phân tích trong miền không gian (spatial domain) tương đương với phân tích trong miền tần số (frequency domain).

---

## $L^2$ vs Pointwise — Hai Khái Niệm Độc Lập

> [!warning] Remark 5.10 — Hội tụ $L^2$ không kéo theo hội tụ pointwise
> $\lVert S_N f - f \rVert_2 \to 0$ **không** kéo theo $S_N f(x) \to f(x)$ với mọi $x$ hay a.e.
>
> Phản ví dụ kinh điển — "nón chuyển động" (moving bump): Đặt $f_n = \mathbf{1}_{I_n}$ với $I_n$ là các khoảng nhỏ $\subset [0, 2\pi]$ sắp xếp để $\lVert f_n \rVert_2 \to 0$ (hội tụ $L^2$) nhưng $f_n(x)$ phân kỳ với mọi $x$ do mỗi điểm bị "đánh trúng" vô hạn lần.
>
> Nói cách khác: $L^2$ convergence là "trung bình" (average sense), pointwise là "mọi điểm" — hai khái niệm không tương đương trong chiều nào cả!

---

## Ứng Dụng: Năng Lượng và Phổ Công Suất

> [!example] Example 5.11 — Định lý Parseval trong xử lý tín hiệu
> Trong kỹ thuật điện, Parseval's identity có nghĩa là **bảo toàn năng lượng**:
>
> $$
> \underbrace{\frac{1}{2\pi}\int_{-\pi}^{\pi} |f(t)|^2 \, dt}_{\text{năng lượng trong miền thời gian}} = \underbrace{\sum_{n \in \mathbb{Z}} |\hat{f}(n)|^2}_{\text{năng lượng trong miền tần số}}
> $$
>
> **Power spectral density**: $|\hat{f}(n)|^2$ là "năng lượng" đóng góp bởi tần số thứ $n$. Phổ công suất cho phép nhận diện các tần số chiếm ưu thế trong tín hiệu.

---

## Python — Parseval's Identity và Ứng Dụng

```python
import numpy as np
import matplotlib.pyplot as plt

# --- Kiem tra Parseval numerically ---
x = np.linspace(-np.pi, np.pi, 4096, endpoint=False)
dx = x[1] - x[0]

# Hai ham thu nghiem
f1 = x.copy()                              # f(x) = x
f2 = np.abs(np.sin(x))**0.7               # ham tuy y

for name, f in [("f(x) = x", f1), ("|sin x|^0.7", f2)]:
    # L2 norm truc tiep
    L2_sq = np.trapz(np.abs(f)**2, x) / (2*np.pi)
    # He so Fourier qua FFT
    coeffs = np.fft.fft(f) * dx / (2*np.pi)
    parseval_sum = np.sum(np.abs(coeffs)**2) * 2*np.pi / dx
    print(f"{name}: ||f||^2 = {L2_sq:.6f}, sum|hat_f|^2 = {parseval_sum:.6f}")

# --- So sanh partial sum approximation ---
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

f = x.copy()  # f(x) = x
F = np.fft.fft(f) / len(f)

errors = []
Ns = [1, 2, 5, 10, 20, 50, 100, 200]
for N in Ns:
    mask = np.zeros(len(f))
    mask[:N+1] = 1; mask[-(N):] = 1
    sN = np.real(np.fft.ifft(F * len(f) * mask))
    L2_error = np.sqrt(np.trapz((f - sN)**2, x) / (2*np.pi))
    errors.append(L2_error)

axes[0].loglog(Ns, errors, 'o-', color='steelblue')
axes[0].set_xlabel('N (so ham)'); axes[0].set_ylabel('||f - S_N f||_L2')
axes[0].set_title('L2 error giam khi N tang — f(x) = x')
axes[0].grid(True, alpha=0.3)

# --- Pho cong suat (power spectrum) ---
f_signal = 3*np.sin(2*x) + 1.5*np.cos(5*x) + 0.5*np.sin(11*x)
F_sig = np.fft.fftshift(np.fft.fft(f_signal)) / len(f_signal)
ns = np.arange(-len(x)//2, len(x)//2)
mask_plot = np.abs(ns) <= 15

axes[1].stem(ns[mask_plot], np.abs(F_sig[mask_plot]),
             linefmt='steelblue', markerfmt='o', basefmt='k-')
axes[1].set_xlabel('Tan so n'); axes[1].set_ylabel('|hat_f(n)|')
axes[1].set_title('Power spectrum: nhan dinh tan so chinh')
# Gia tri Parseval
parseval_approx = 2*np.pi * np.sum(np.abs(F_sig[mask_plot])**2) * (2*np.pi/len(f_signal))
L2_direct = np.trapz(np.abs(f_signal)**2, x) / (2*np.pi)
print(f"\nParseval check signal: direct={L2_direct:.4f}, sum_spectrum={np.sum(np.abs(F_sig)**2)*len(f_signal):.4f}")

plt.suptitle("L2 Theory & Parseval's Identity", fontsize=13)
plt.tight_layout()
plt.savefig("l2_theory.png", dpi=120)
plt.show()

# --- Basel problem numerically ---
N_terms = 1000
print(f"\nBasel: sum 1/n^2, N={N_terms}: {sum(1/n**2 for n in range(1,N_terms+1)):.8f}")
print(f"pi^2/6 = {np.pi**2/6:.8f}")
```

---

## Summary / Key Takeaways

- **Bessel's inequality**: $\sum_n |\hat{f}(n)|^2 \leq \lVert f \rVert_2^2$ — dãy hệ số Fourier luôn thuộc $\ell^2$.
- **Best approximation**: $S_N f$ là phép chiếu trực giao $f$ lên $V_N$ trong $L^2$ — tối ưu trong mọi xấp xỉ bởi $N$-frequency polynomial.
- **Parseval's Identity**: $\lVert f \rVert_2^2 = \sum_n |\hat{f}(n)|^2$ — đẳng thức Bessel, nghĩa là chuỗi Fourier hội tụ trong $L^2$.
- **$\{e^{inx}\}$ là CONS trong $L^2(\mathbb{T})$**: mọi $f \in L^2$ khai triển được theo $\{e^{inx}\}$ với hội tụ $L^2$.
- **Isomorphism $L^2(\mathbb{T}) \cong \ell^2(\mathbb{Z})$**: phân tích Fourier là đẳng cấu Hilbert space — bảo toàn inner product và norm.
- **Riesz-Fischer**: mọi dãy $\ell^2$ đều là hệ số Fourier của một hàm $L^2$ — surjectivity của phép biến đổi Fourier.
- **Hội tụ $L^2$ $\neq$ hội tụ pointwise**: hai khái niệm độc lập — $L^2$ là "trung bình", pointwise là "mọi điểm".
- **Ứng dụng**: Parseval = bảo toàn năng lượng; phổ công suất $|\hat{f}(n)|^2$ trong xử lý tín hiệu; tính tổng chuỗi số (Basel problem).

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis: An Introduction*. Princeton, 2003. Chương 3.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Kreyszig, E. *Introductory Functional Analysis with Applications*. Wiley, 1978. Chương 3 (Hilbert spaces).
- MIT OCW 18.102 Lecture 15 — Orthonormal Bases and Fourier Series.
