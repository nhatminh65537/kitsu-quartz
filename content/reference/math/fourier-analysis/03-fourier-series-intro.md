---
title: "03. Chuỗi Fourier — Định nghĩa & Ví dụ"
tags: [math, fourier-analysis, fourier-series, lesson-03]
aliases: [Fourier Series]
created: 2026-03-24
---

> **Prerequisites**: [[02-lebesgue-integral-lp|02. Tích phân Lebesgue & Không gian L^p]] — tích phân Lebesgue, $L^1$, $L^2$, inner product
> **Objectives**:
> - Hiểu hàm tuần hoàn và cách xây dựng chuỗi Fourier theo dạng lượng giác và phức
> - Tính hệ số Fourier cho các ví dụ kinh điển: sóng vuông, sóng tam giác, sóng răng cưa
> - Nắm trực giác phổ tần số (frequency spectrum) và phân tích hài (harmonic decomposition)
> - Hiểu tính trực giao của $\{e^{inx}\}$ — nền tảng cho lý thuyết $L^2$
> - Minh họa bằng Python/NumPy: vẽ chuỗi Fourier cắt ngắn và spectrum

---

## Motivation / Intuition

### Phân rã hàm thành "tần số"

Hãy tưởng tượng bạn nghe một nốt nhạc. Không khí dao động — nhưng dao động đó không chỉ là một tần số đơn thuần mà là **tổ hợp của nhiều sóng sine** ở các tần số khác nhau. Fourier (1807) phát hiện rằng *mọi hàm tuần hoàn* đều có thể viết như một tổng (vô hạn) của các sóng sine và cosine — đây là ý tưởng cách mạng hóa toán học và vật lý.

Về mặt toán học: đối với hàm tuần hoàn $f$ trên $[0, 2\pi]$, ta muốn viết:

$$
f(x) = \sum_{n=-\infty}^{\infty} \hat{f}(n)\, e^{inx}
$$

trong đó mỗi $e^{inx}$ là một **sóng tuần hoàn** (dao động ở tần số $n$), và $\hat{f}(n)$ cho biết "bao nhiêu phần" của $f$ chứa tần số đó. Phần còn lại của Module 1 (Lessons 03–05) sẽ làm chính xác hóa ý tưởng này.

---

## Hàm Tuần Hoàn và Không gian $L^p(\mathbb{T})$

> [!definition] Definition 3.1 — Hàm Tuần Hoàn
> Hàm $f: \mathbb{R} \to \mathbb{C}$ được gọi là **$2\pi$-tuần hoàn** (periodic) nếu $f(x + 2\pi) = f(x)$ với mọi $x \in \mathbb{R}$.
>
> Ta đồng nhất $f$ với hàm xác định trên **đường tròn đơn vị** $\mathbb{T} = \mathbb{R} / 2\pi\mathbb{Z}$, tức là coi $f: [-\pi, \pi] \to \mathbb{C}$ với điều kiện biên $f(-\pi) = f(\pi)$.
>
> Không gian $L^p(\mathbb{T})$ gồm các hàm $2\pi$-tuần hoàn với:
>
> $$
> \lVert f \rVert_{L^p(\mathbb{T})} = \left( \frac{1}{2\pi} \int_{-\pi}^{\pi} |f(x)|^p \, dx \right)^{1/p}
> $$

> [!note] Remark 3.2 — Chuẩn hóa $\frac{1}{2\pi}$
> Hệ số $\frac{1}{2\pi}$ được đưa vào để inner product của $L^2(\mathbb{T})$ tự nhiên hơn. Với quy ước này, hàm hằng $f \equiv 1$ có $\lVert f \rVert_2 = 1$.

---

## Hệ Số Fourier

### Tính trực giao của $e^{inx}$

> [!theorem] Theorem 3.3 — Tính Trực Giao (Orthogonality)
> Với $m, n \in \mathbb{Z}$:
>
> $$
> \langle e^{imx}, e^{inx} \rangle = \frac{1}{2\pi} \int_{-\pi}^{\pi} e^{imx} \overline{e^{inx}} \, dx = \frac{1}{2\pi} \int_{-\pi}^{\pi} e^{i(m-n)x} \, dx = \delta_{mn}
> $$
>
> Tức là $e^{imx} \perp e^{inx}$ với $m \neq n$, và $\lVert e^{inx} \rVert_2 = 1$. Do đó $\left\{ \frac{1}{\sqrt{2\pi}} e^{inx} \right\}_{n \in \mathbb{Z}}$ là hệ trực chuẩn trong $L^2(\mathbb{T})$.

**Proof.** Khi $m = n$: $\int_{-\pi}^{\pi} e^0 \, dx = 2\pi$, chia cho $2\pi$ được $1$. Khi $m \neq n$:

$$
\frac{1}{2\pi} \int_{-\pi}^{\pi} e^{i(m-n)x} \, dx = \frac{1}{2\pi} \cdot \frac{e^{i(m-n)x}}{i(m-n)} \bigg|_{-\pi}^{\pi} = \frac{e^{i(m-n)\pi} - e^{-i(m-n)\pi}}{2\pi i(m-n)} = \frac{\sin((m-n)\pi)}{\pi(m-n)} = 0
$$

vì $m - n \in \mathbb{Z} \setminus \{0\}$ nên $\sin((m-n)\pi) = 0$. $\blacksquare$

### Định nghĩa Hệ Số Fourier

> [!definition] Definition 3.4 — Hệ Số Fourier (Fourier Coefficients)
> Cho $f \in L^1(\mathbb{T})$. **Hệ số Fourier** thứ $n$ của $f$, ký hiệu $\hat{f}(n)$ hay $c_n$, được định nghĩa:
>
> $$
> \hat{f}(n) = \frac{1}{2\pi} \int_{-\pi}^{\pi} f(x)\, e^{-inx} \, dx, \qquad n \in \mathbb{Z}
> $$
>
> **Chuỗi Fourier** của $f$ là chuỗi hình thức:
>
> $$
> f(x) \sim \sum_{n=-\infty}^{\infty} \hat{f}(n)\, e^{inx}
> $$
>
> Ký hiệu "$\sim$" chỉ rằng đây là chuỗi Fourier của $f$, **chưa khẳng định** nó hội tụ về $f$ theo nghĩa nào.

> [!note] Remark 3.5 — Cách nhớ công thức
> Công thức $\hat{f}(n) = \langle f, e^{inx} \rangle$ chính là **chiếu** $f$ lên hướng $e^{inx}$ trong Hilbert space $L^2(\mathbb{T})$ — giống hệt như chiếu vector lên trục trong $\mathbb{R}^n$.
>
> Nhân $f(x)$ với $e^{-inx}$ rồi tích phân = "lọc ra tần số $n$".

### Dạng Lượng Giác

> [!definition] Definition 3.6 — Dạng Lượng Giác của Chuỗi Fourier
> Với $f$ thực, hệ số Fourier thỏa $\hat{f}(-n) = \overline{\hat{f}(n)}$. Đặt:
>
> $$
> a_0 = 2\hat{f}(0), \quad a_n = \hat{f}(n) + \hat{f}(-n),\quad b_n = i(\hat{f}(n) - \hat{f}(-n))
> $$
>
> Chuỗi Fourier viết lại thành dạng **lượng giác**:
>
> $$
> f(x) \sim \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos(nx) + b_n \sin(nx) \right)
> $$
>
> với:
>
> $$
> a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x) \cos(nx)\, dx, \qquad b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x) \sin(nx)\, dx
> $$

---

## Tính Chất của Hệ Số Fourier

> [!theorem] Theorem 3.7 — Tính chất cơ bản
> Cho $f, g \in L^1(\mathbb{T})$ và $n \in \mathbb{Z}$:
>
> 1. **(Tuyến tính)** $\widehat{f + \lambda g}(n) = \hat{f}(n) + \lambda \hat{g}(n)$
>
> 2. **(Dịch chuyển / Shift)** Nếu $f_h(x) = f(x - h)$ thì $\hat{f}_h(n) = e^{-inh} \hat{f}(n)$
>
> 3. **(Modulation)** $\widehat{e^{ikx}f(x)}(n) = \hat{f}(n-k)$
>
> 4. **(Phản xạ)** $\widehat{f(-x)}(n) = \hat{f}(-n)$
>
> 5. **(Liên hợp phức)** $\widehat{\overline{f(x)}}(n) = \overline{\hat{f}(-n)}$; với $f$ thực: $\hat{f}(-n) = \overline{\hat{f}(n)}$
>
> 6. **(Đạo hàm)** Nếu $f$ khả vi với $f' \in L^1(\mathbb{T})$ thì $\widehat{f'}(n) = in \cdot \hat{f}(n)$

**Proof của (2).** Tính trực tiếp:

$$
\hat{f}_h(n) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x-h) e^{-inx} dx \stackrel{y=x-h}{=} \frac{1}{2\pi}\int_{-\pi}^{\pi} f(y) e^{-in(y+h)} dy = e^{-inh} \hat{f}(n). \quad \blacksquare
$$

> [!note] Remark 3.8 — Đạo hàm trở thành nhân với $in$
> Tính chất (6) là một trong những lý do Fourier analysis hữu ích: **phương trình vi phân trở thành phương trình đại số** trong miền tần số. Ví dụ $f'' + f = g$ trở thành $-n^2 \hat{f}(n) + \hat{f}(n) = \hat{g}(n)$, tức $\hat{f}(n) = \hat{g}(n)/(1 - n^2)$.

---

## Các Ví Dụ Kinh Điển

### Sóng Vuông (Square Wave)

> [!example] Example 3.9 — Sóng Vuông
> Xét $f(x) = \operatorname{sgn}(\sin x)$ — hàm $2\pi$-tuần hoàn nhận giá trị $+1$ trên $(0, \pi)$ và $-1$ trên $(-\pi, 0)$.
>
> **Tính hệ số Fourier:**
>
> - $a_n = 0$ (do $f$ là hàm lẻ, $f \cdot \cos$ là hàm lẻ)
>
> $$
> b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x) \sin(nx) \, dx = \frac{2}{\pi} \int_0^{\pi} \sin(nx) \, dx = \frac{2}{\pi} \cdot \frac{1 - \cos(n\pi)}{n} = \begin{cases} \dfrac{4}{n\pi} & n \text{ lẻ} \\ 0 & n \text{ chẵn} \end{cases}
> $$
>
> **Chuỗi Fourier:**
>
> $$
> f(x) \sim \frac{4}{\pi} \sum_{k=0}^{\infty} \frac{\sin((2k+1)x)}{2k+1} = \frac{4}{\pi}\left( \sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots \right)
> $$
>
> Hệ số giảm như $O(1/n)$ — phản ánh sự không liên tục của $f$.

### Sóng Tam Giác (Triangle Wave)

> [!example] Example 3.10 — Sóng Tam Giác
> Xét $f(x) = |x|$ trên $[-\pi, \pi]$, mở rộng $2\pi$-tuần hoàn.
>
> - $a_0 = \dfrac{1}{\pi} \int_{-\pi}^{\pi} |x| \, dx = \pi$, nên hằng số là $\pi/2$
>
> $$
> a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} |x| \cos(nx) \, dx = \frac{2}{\pi} \int_0^{\pi} x \cos(nx) \, dx = \frac{2}{\pi} \cdot \frac{\cos(n\pi) - 1}{n^2} = \begin{cases} -\dfrac{4}{n^2\pi} & n \text{ lẻ} \\ 0 & n \text{ chẵn} \end{cases}
> $$
>
> **Chuỗi Fourier:**
>
> $$
> f(x) \sim \frac{\pi}{2} - \frac{4}{\pi} \sum_{k=0}^{\infty} \frac{\cos((2k+1)x)}{(2k+1)^2} = \frac{\pi}{2} - \frac{4}{\pi}\left( \cos x + \frac{\cos 3x}{9} + \frac{\cos 5x}{25} + \cdots \right)
> $$
>
> Hệ số giảm như $O(1/n^2)$ — $f$ liên tục nên hội tụ nhanh hơn sóng vuông. Điều này phản ánh quy tắc tổng quát: **hàm càng trơn, hệ số Fourier giảm càng nhanh**.

### Partial Sums và Hiện Tượng Gibbs

> [!definition] Definition 3.11 — Partial Sum (Tổng từng phần)
> **Partial sum** thứ $N$ của chuỗi Fourier:
>
> $$
> S_N f(x) = \sum_{n=-N}^{N} \hat{f}(n)\, e^{inx}
> $$

> [!warning] Remark 3.12 — Gibbs Phenomenon
> Với hàm có **điểm nhảy** (jump discontinuity), $S_N f$ không hội tụ đồng đều. Gần điểm nhảy, chuỗi Fourier cắt ngắn **vọt lố** (overshoot) khoảng $\approx 8.9\%$ biên độ của bước nhảy, **bất kể** $N$ lớn đến đâu.
>
> Với sóng vuông: gần điểm $x = 0$, $\lim_{N\to\infty} \max_{x \in (0, \pi/N)} S_N f(x) \approx 1 + \frac{2}{\pi} \int_0^\pi \frac{\sin t}{t} dt - 1 \approx 0.179$, tức vọt lố $\approx 9\%$.

---

## Phổ Tần Số (Frequency Spectrum)

> [!definition] Definition 3.13 — Magnitude Spectrum và Phase Spectrum
> Với hệ số Fourier $\hat{f}(n) = |\hat{f}(n)| e^{i\theta_n}$:
>
> - **Magnitude spectrum**: $|\hat{f}(n)|$ cho biết "năng lượng" tại tần số $n$
> - **Phase spectrum**: $\theta_n = \arg \hat{f}(n)$ cho biết "pha" của thành phần tần số $n$
>
> Với $f$ thực: magnitude spectrum là hàm chẵn ($|\hat{f}(-n)| = |\hat{f}(n)|$), phase spectrum là hàm lẻ.

> [!note] Remark 3.14 — Hài (Harmonics)
> Thành phần $e^{inx}$ ứng với **hài thứ $n$** (n-th harmonic). Hài cơ bản ($n=1$) có chu kỳ $2\pi$; hài thứ $n$ có chu kỳ $2\pi/n$. Phổ tần số là **rời rạc** cho hàm tuần hoàn (so với phổ liên tục của Fourier transform ở Lesson 06).

---

## Python — Minh họa Chuỗi Fourier

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-np.pi, np.pi, 2000)

# --- Ham tinh he so Fourier bang tich phan so ---
def fourier_coeffs(f_vals, x, N):
    """Tinh hat_f(n) cho n = -N, ..., N bang tich phan so."""
    dx = x[1] - x[0]
    coeffs = {}
    for n in range(-N, N+1):
        integrand = f_vals * np.exp(-1j * n * x)
        coeffs[n] = np.trapz(integrand, x) / (2 * np.pi)
    return coeffs

def partial_sum(coeffs, x, N):
    """Tinh S_N f(x)."""
    result = np.zeros(len(x), dtype=complex)
    for n in range(-N, N+1):
        result += coeffs[n] * np.exp(1j * n * x)
    return result.real

# --- Song vuong ---
sq = np.sign(np.sin(x))
sq[sq == 0] = 1  # xu ly diem 0

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

coeffs_sq = fourier_coeffs(sq, x, 50)
for N, ax in zip([1, 3, 10, 50], axes.flat):
    sN = partial_sum(coeffs_sq, x, N)
    ax.plot(x, sq, 'gray', linewidth=1, alpha=0.5, label='f(x)')
    ax.plot(x, sN, 'steelblue', linewidth=1.5, label=f'$S_{{{N}}}f$')
    ax.axhline(0, color='k', linewidth=0.5)
    ax.set_title(f'Song vuong — $S_{{{N}}}f$')
    ax.set_ylim(-1.5, 1.5)
    ax.legend(loc='upper right', fontsize=9)

plt.suptitle('Chuoi Fourier song vuong & Gibbs phenomenon', fontsize=13)
plt.tight_layout()
plt.savefig("fourier_square.png", dpi=120)
plt.show()

# --- Pho tan so song vuong ---
fig, ax = plt.subplots(figsize=(10, 4))
ns = np.arange(-20, 21)
mags = np.array([abs(coeffs_sq.get(n, 0)) for n in ns])
ax.stem(ns, mags, linefmt='steelblue', markerfmt='o', basefmt='k-')
ax.set_xlabel('Tan so n'); ax.set_ylabel('|hat_f(n)|')
ax.set_title('Magnitude Spectrum — Song Vuong (chi co hai le)')
plt.tight_layout()
plt.savefig("spectrum_square.png", dpi=120)
plt.show()

# --- Song tam giac vs song vuong: toc do giam he so ---
ns_pos = np.arange(1, 21, 2)  # chi hai le
sq_coeffs_pos = np.array([4/(n * np.pi) for n in ns_pos])
tri_coeffs_pos = np.array([4/(n**2 * np.pi) for n in ns_pos])

fig, ax = plt.subplots(figsize=(9, 4))
ax.semilogy(ns_pos, sq_coeffs_pos, 'o-', color='steelblue', label='Song vuong: O(1/n)')
ax.semilogy(ns_pos, tri_coeffs_pos, 's-', color='tomato', label='Song tam giac: O(1/n^2)')
ax.set_xlabel('Hai n (chi hai le)'); ax.set_ylabel('|hat_f(n)| (log scale)')
ax.set_title('Toc do giam he so Fourier: thanh la, hoi tu nhanh hon')
ax.legend(); plt.tight_layout()
plt.savefig("decay_rate.png", dpi=120)
plt.show()
```

---

## Summary / Key Takeaways

- **Chuỗi Fourier** phân tích hàm tuần hoàn thành tổ hợp tuyến tính của $\{e^{inx}\}$ — một hệ trực chuẩn trong $L^2(\mathbb{T})$.
- **Hệ số Fourier**: $\hat{f}(n) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x) e^{-inx} dx$ — "chiếu" $f$ lên hướng $e^{inx}$.
- **Tính trực giao** của $\{e^{inx}\}$: $\langle e^{imx}, e^{inx}\rangle = \delta_{mn}$ — là chìa khóa để tính hệ số.
- **Dạng lượng giác**: $a_n = \text{Re}$ components, $b_n = \text{Im}$ components; với $f$ thực có $\hat{f}(-n) = \overline{\hat{f}(n)}$.
- Hệ số Fourier phản ánh **độ mượt (regularity)** của hàm: $f$ liên tục → $|\hat{f}(n)| = o(1)$; $f$ khả vi → $|\hat{f}(n)| = O(1/n)$; $f$ khả vi $k$ lần → $|\hat{f}(n)| = O(1/n^k)$.
- **Gibbs phenomenon**: tại điểm gián đoạn, chuỗi Fourier cắt ngắn vọt lố $\approx 9\%$ — không biến mất khi tăng $N$.
- **Partial sum** $S_N f$ là phép chiếu trực giao $f$ lên $\text{span}\{e^{inx} : |n| \leq N\}$ trong $L^2$ (sẽ chứng minh ở Lesson 05).

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis: An Introduction*. Princeton, 2003. Chương 2.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 8.
- Körner, T. W. *Fourier Analysis*. Cambridge, 1988. Chương 1–3.
- Strang, G. *Introduction to Linear Algebra* (5th ed.). Wellesley, 2016. Chương 8 (Fourier matrix).
