---
title: "A2. Proof of Fejér's Theorem"
tags: [math, fourier-analysis, appendix, fejer, cesaro-summability]
aliases: [Fejer Proof, Cesaro Summability]
created: 2026-03-24
---

> **Related lesson**: [[04-pointwise-convergence|04. Hội Tụ Pointwise & Đồng Đều]]
> **Theorem**: Nếu $f \in C(\mathbb{T})$ (liên tục trên $\mathbb{T}$), thì trung bình Cesàro của chuỗi Fourier hội tụ **đồng đều** về $f$.

---

## Phát Biểu Đầy Đủ

> [!theorem] Fejér's Theorem
> Cho $f: \mathbb{T} \to \mathbb{C}$ và các partial sums $S_N f(x) = \sum_{|n|\leq N} \hat{f}(n) e^{inx}$.
>
> Định nghĩa **trung bình Cesàro** bậc $N$:
>
> $$
> \sigma_N f(x) = \frac{1}{N}\sum_{k=0}^{N-1} S_k f(x) = (f * F_N)(x)
> $$
>
> trong đó $F_N$ là **Fejér kernel**:
>
> $$
> F_N(x) = \frac{1}{N}\sum_{k=0}^{N-1} D_k(x) = \frac{1}{N}\cdot\frac{\sin^2(Nx/2)}{\sin^2(x/2)}
> $$
>
> **Kết quả**:
>
> 1. Nếu $f \in C(\mathbb{T})$ thì $\lVert \sigma_N f - f \rVert_\infty \to 0$ (**đồng đều**)
>
> 2. Nếu $f \in L^p(\mathbb{T})$, $1 \leq p < \infty$, thì $\lVert \sigma_N f - f \rVert_p \to 0$
>
> 3. Nếu $f \in L^1(\mathbb{T})$ liên tục tại $x_0$ thì $\sigma_N f(x_0) \to f(x_0)$ (pointwise)

---

## Chứng Minh Công Thức Đóng của Fejér Kernel

> [!lemma] Lemma A2.1 — Công Thức Đóng của $F_N$
>
> $$
> F_N(x) = \frac{1}{N}\cdot\frac{\sin^2(Nx/2)}{\sin^2(x/2)}, \quad x \neq 0 \pmod{2\pi}; \qquad F_N(0) = N
> $$

**Proof.** Nhắc lại Dirichlet kernel: $D_k(x) = \sum_{n=-k}^{k} e^{inx} = \frac{\sin((k+\frac{1}{2})x)}{\sin(x/2)}$.

Viết $\alpha = e^{ix/2}$. Ta cần tính $S = \sum_{k=0}^{N-1} D_k(x)$.

**Cách 1 — Tổng trực tiếp**:

$$
S = \sum_{k=0}^{N-1} \sum_{n=-k}^{k} e^{inx} = \sum_{n=-(N-1)}^{N-1} (N - |n|) e^{inx}
$$

(mỗi hạng $e^{inx}$ xuất hiện trong $D_k$ với $k \geq |n|$, tức $(N-|n|)$ lần).

**Cách 2 — Geometric series của sin**:

$$
\sum_{k=0}^{N-1} \sin\!\left((k+\tfrac{1}{2})x\right) = \operatorname{Im}\left(e^{ix/2}\sum_{k=0}^{N-1} e^{ikx}\right) = \operatorname{Im}\!\left(\frac{e^{ix/2}(e^{iNx}-1)}{e^{ix}-1}\right).
$$

Tính phần ảo:

$$
= \operatorname{Im}\!\left(\frac{e^{i(N+\frac{1}{2})x} - e^{ix/2}}{e^{ix}-1}\right) = \operatorname{Im}\!\left(\frac{e^{iNx/2}\cdot 2i\sin(Nx/2)}{2i\sin(x/2)}\right) = \frac{\sin(Nx/2)\sin(Nx/2 + \phi)}{\sin(x/2)}.
$$

Sau khi simplify:

$$
N F_N(x) = \sum_{k=0}^{N-1} D_k(x) = \frac{1}{\sin(x/2)}\sum_{k=0}^{N-1} \sin\!\left((k+\tfrac{1}{2})x\right) = \frac{\sin^2(Nx/2)}{\sin^2(x/2)}.
$$

(Sử dụng telescope: $\sum_{k=0}^{N-1}\sin((k+\frac{1}{2})x)\sin(x/2) = \frac{1}{2}\sum_{k=0}^{N-1}[\cos(kx) - \cos((k+1)x)] = \frac{1}{2}[1-\cos(Nx)] = \sin^2(Nx/2)$.)

Vậy $F_N(x) = \frac{1}{N}\cdot\frac{\sin^2(Nx/2)}{\sin^2(x/2)}$. $\blacksquare$

---

## Tính Chất Của Fejér Kernel

> [!lemma] Lemma A2.2 — Fejér Kernel là Positive Approximate Identity
> $F_N$ thỏa ba điều kiện của approximate identity:
>
> 1. $\dfrac{1}{2\pi}\int_{-\pi}^{\pi} F_N(x)\, dx = 1$
>
> 2. $F_N(x) \geq 0$ với mọi $x$
>
> 3. Với mọi $\delta > 0$: $\displaystyle\max_{|x|\geq\delta} F_N(x) \leq \frac{1}{N\sin^2(\delta/2)} \to 0$ khi $N\to\infty$

**Proof.**

**(1)**: $\int F_N = \frac{1}{N}\sum_{k=0}^{N-1}\int D_k = \frac{1}{N}\sum_{k=0}^{N-1} 2\pi = 2\pi$.

**(2)**: $F_N(x) = \frac{\sin^2(Nx/2)}{N\sin^2(x/2)} \geq 0$ (bình phương chia bình phương).

**(3)**: Với $|x| \geq \delta$: $\sin^2(x/2) \geq \sin^2(\delta/2) > 0$, nên:

$$
F_N(x) = \frac{\sin^2(Nx/2)}{N\sin^2(x/2)} \leq \frac{1}{N\sin^2(\delta/2)} \to 0. \quad \blacksquare
$$

---

## Chứng Minh Định Lý Fejér

### Phần 1: Hội Tụ Đồng Đều cho $f \in C(\mathbb{T})$

**Proof.** Ta cần chứng minh $\lVert\sigma_N f - f\rVert_\infty \to 0$.

Viết:

$$
\sigma_N f(x) - f(x) = \frac{1}{2\pi}\int_{-\pi}^{\pi} [f(x-t) - f(x)] F_N(t)\, dt
$$

(vì $\frac{1}{2\pi}\int F_N = 1$).

Với $\varepsilon > 0$, vì $f$ **liên tục đồng đều** trên $\mathbb{T}$ (compact), tồn tại $\delta > 0$ sao cho $|f(x-t) - f(x)| < \varepsilon$ với mọi $x$ khi $|t| < \delta$.

Chia tích phân:

$$
|\sigma_N f(x) - f(x)| \leq \underbrace{\frac{1}{2\pi}\int_{|t|<\delta} |f(x-t)-f(x)| F_N(t) dt}_{I_1} + \underbrace{\frac{1}{2\pi}\int_{\delta\leq|t|\leq\pi} |f(x-t)-f(x)| F_N(t) dt}_{I_2}
$$

**Ước lượng $I_1$**:

$$
I_1 \leq \varepsilon \cdot \frac{1}{2\pi}\int_{|t|<\delta} F_N(t) dt \leq \varepsilon \cdot \frac{1}{2\pi}\int_{-\pi}^{\pi} F_N(t) dt = \varepsilon.
$$

**Ước lượng $I_2$**: Đặt $M = \lVert f\rVert_\infty$. Thì $|f(x-t)-f(x)| \leq 2M$. Dùng Lemma A2.2(3):

$$
I_2 \leq 2M \cdot \frac{1}{2\pi}\int_{\delta\leq|t|\leq\pi} F_N(t) dt \leq 2M \cdot \frac{1}{N\sin^2(\delta/2)}.
$$

Chọn $N_0$ đủ lớn sao cho $\frac{2M}{N_0\sin^2(\delta/2)} < \varepsilon$.

Với $N \geq N_0$, với mọi $x$:

$$
|\sigma_N f(x) - f(x)| \leq I_1 + I_2 < \varepsilon + \varepsilon = 2\varepsilon.
$$

Vì $\varepsilon > 0$ tùy ý và bound **đồng đều theo $x$**: $\lVert\sigma_N f - f\rVert_\infty < 2\varepsilon$ với $N \geq N_0$. $\blacksquare$

### Phần 2: Hội Tụ $L^p$ cho $f \in L^p(\mathbb{T})$

**Proof.** Dùng $F_N \geq 0$ và $\int F_N = 2\pi$:

$$
\lVert\sigma_N f - f\rVert_p^p = \int |\sigma_N f(x) - f(x)|^p dx.
$$

Dùng **Jensen's inequality** (với $F_N/(2\pi)$ là xác suất):

$$
|\sigma_N f(x) - f(x)|^p = \left|\frac{1}{2\pi}\int (f(x-t)-f(x)) F_N(t) dt\right|^p \leq \frac{1}{2\pi}\int |f(x-t)-f(x)|^p F_N(t) dt.
$$

Tích phân theo $x$ và dùng Fubini:

$$
\lVert\sigma_N f - f\rVert_p^p \leq \frac{1}{2\pi}\int F_N(t) \left(\int |f(x-t)-f(x)|^p dx\right) dt = \frac{1}{2\pi}\int F_N(t) \lVert\tau_t f - f\rVert_p^p dt.
$$

Với $\varepsilon > 0$, tính **liên tục translation mạnh**: $\lVert\tau_t f - f\rVert_p \to 0$ khi $t\to 0$. Chọn $\delta$ để $\lVert\tau_t f - f\rVert_p < \varepsilon$ khi $|t| < \delta$. Chia tích phân (như Phần 1). Kết quả tương tự: $\lVert\sigma_N f - f\rVert_p \to 0$. $\blacksquare$

### Phần 3: Hội Tụ Pointwise tại Điểm Liên Tục

**Proof.** Tương tự Phần 1, nhưng thay "liên tục đồng đều" bằng "liên tục tại $x_0$": với $|t|<\delta$, $|f(x_0-t)-f(x_0)| < \varepsilon$. Proof của $I_1$ và $I_2$ giữ nguyên. $\blacksquare$

---

## Hệ Quả Quan Trọng

> [!corollary] Corollary A2.3 — Weierstrass Approximation Theorem (Trigonometric version)
> Với mọi $f \in C(\mathbb{T})$ và $\varepsilon > 0$, tồn tại **trigonometric polynomial** $P_N(x) = \sum_{|n|\leq N} c_n e^{inx}$ sao cho $\lVert f - P_N\rVert_\infty < \varepsilon$.

**Proof.** $\sigma_N f$ là trigonometric polynomial và $\lVert\sigma_N f - f\rVert_\infty \to 0$. $\blacksquare$

> [!corollary] Corollary A2.4 — Mật độ Trigonometric Polynomials
> Trigonometric polynomials **dense** trong $C(\mathbb{T})$ và $L^p(\mathbb{T})$ với $1 \leq p < \infty$.

> [!corollary] Corollary A2.5 — Duy Nhất Hệ Số Fourier
> Nếu $f \in L^1(\mathbb{T})$ và $\hat{f}(n) = 0$ với mọi $n \in \mathbb{Z}$, thì $f = 0$ a.e.

**Proof.** $\sigma_N f = 0$ với mọi $N$ (do mọi hệ số bằng $0$). Nhưng $\sigma_N f \to f$ trong $L^1$. Vậy $f = 0$ trong $L^1$. $\blacksquare$

> [!note] Remark A2.6 — Gibbs Phenomenon Biến Mất
> Fejér summation ($\sigma_N f$) **không** có Gibbs phenomenon. Tại điểm nhảy $x_0$: $\sigma_N f(x_0) \to \frac{f(x_0^+)+f(x_0^-)}{2}$ trơn tru, không vọt lố. Đây là do $F_N \geq 0$ — positive kernels không thể gây overshooting.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chương 3, §2.
- Katznelson, Y. *An Introduction to Harmonic Analysis* (3rd ed.). Cambridge, 2004. Chương 1.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Theorem 8.43.
- Fejér, L. "Untersuchungen über Fouriersche Reihen." *Math. Annalen* 58, 1904.
