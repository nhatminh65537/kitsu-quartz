---
title: "A0. Proof of Riemann-Lebesgue Lemma"
tags: [math, fourier-analysis, appendix, riemann-lebesgue]
aliases: [Riemann-Lebesgue Proof]
created: 2026-03-24
---

> **Related lesson**: [[06-fourier-transform-l1|06. Fourier Transform trên L¹]]
> **Theorem**: Với mọi $f \in L^1(\mathbb{R})$, $\hat{f} \in C_0(\mathbb{R})$ — tức $\hat{f}$ liên tục và $\lim_{|\xi|\to\infty} \hat{f}(\xi) = 0$.

---

## Phát Biểu Đầy Đủ

> [!theorem] Riemann-Lebesgue Lemma
> Cho $f \in L^1(\mathbb{R})$. Khi đó $\hat{f}(\xi) = \int_{\mathbb{R}} f(x)\, e^{-ix\xi}\, dx$ thỏa:
>
> 1. $\hat{f}: \mathbb{R} \to \mathbb{C}$ là hàm **liên tục**
>
> 2. $\hat{f}$ **triệt tiêu tại vô cùng**: $\displaystyle\lim_{|\xi| \to \infty} \hat{f}(\xi) = 0$
>
> 3. **Bound**: $\lVert \hat{f} \rVert_\infty \leq \lVert f \rVert_{L^1}$
>
> Viết gọn: $\mathcal{F}: L^1(\mathbb{R}) \to C_0(\mathbb{R})$ là ánh xạ tuyến tính liên tục.

---

## Chứng Minh

### Phần 1: Tính Liên Tục của $\hat{f}$

**Mục tiêu**: Chứng minh $\hat{f}(\xi_n) \to \hat{f}(\xi)$ khi $\xi_n \to \xi$.

**Proof.** Với dãy $\xi_n \to \xi$, ta cần:

$$
\hat{f}(\xi_n) - \hat{f}(\xi) = \int_{\mathbb{R}} f(x)\left(e^{-ix\xi_n} - e^{-ix\xi}\right) dx \to 0.
$$

Ước lượng: $|f(x)(e^{-ix\xi_n} - e^{-ix\xi})| \leq 2|f(x)| \in L^1(\mathbb{R})$ (hàm trội).

Mặt khác, với mọi $x$: $e^{-ix\xi_n} \to e^{-ix\xi}$ (hàm mũ liên tục theo $\xi$).

Áp dụng **Dominated Convergence Theorem**:

$$
\lim_{n\to\infty} \int f(x) e^{-ix\xi_n} dx = \int f(x) \lim_{n\to\infty} e^{-ix\xi_n} dx = \int f(x) e^{-ix\xi} dx = \hat{f}(\xi).
$$

Vậy $\hat{f}$ liên tục. $\blacksquare$

**Phần 3** ($\lVert\hat{f}\rVert_\infty \leq \lVert f \rVert_1$) hiển nhiên từ $|\hat{f}(\xi)| \leq \int |f(x)| dx$.

---

### Phần 2: Triệt Tiêu tại $\infty$ — Proof bằng Xấp Xỉ

Đây là phần thực chất. Ta dùng chiến lược chuẩn: **chứng minh trên dense subset, rồi mở rộng**.

#### Bước 1: Trường hợp hàm chỉ thị khoảng

Xét $f = \mathbf{1}_{[a,b]}$. Khi đó:

$$
\hat{f}(\xi) = \int_a^b e^{-ix\xi} dx = \frac{e^{-ia\xi} - e^{-ib\xi}}{i\xi}
$$

(với $\xi \neq 0$). Ta có $|\hat{f}(\xi)| \leq \frac{2}{|\xi|} \to 0$ khi $|\xi| \to \infty$. $\checkmark$

#### Bước 2: Mở rộng sang Step Functions

Mọi **step function** (tổ hợp hữu hạn của hàm chỉ thị khoảng) có dạng $\varphi = \sum_{k=1}^N c_k \mathbf{1}_{[a_k,b_k]}$. Bằng tuyến tính:

$$
\hat{\varphi}(\xi) = \sum_{k=1}^N c_k \cdot \frac{e^{-ia_k\xi} - e^{-ib_k\xi}}{i\xi}
$$

và $|\hat{\varphi}(\xi)| \leq \frac{1}{|\xi|} \sum_{k=1}^N 2|c_k| \to 0$ khi $|\xi| \to \infty$. $\checkmark$

#### Bước 3: Mở Rộng bằng Mật Độ (Dense Argument)

> [!lemma] Lemma A0.1
> Step functions **dense** trong $L^1(\mathbb{R})$: với mọi $f \in L^1$ và $\varepsilon > 0$, tồn tại step function $\varphi$ với $\lVert f - \varphi \rVert_1 < \varepsilon$.

Với $f \in L^1(\mathbb{R})$ tùy ý và $\varepsilon > 0$:

1. Chọn step function $\varphi$ với $\lVert f - \varphi \rVert_1 < \varepsilon$ (Lemma A0.1).

2. Phân tách:
$$
|\hat{f}(\xi)| \leq |\widehat{f-\varphi}(\xi)| + |\hat{\varphi}(\xi)|.
$$

3. **Hạng thứ nhất**: $|\widehat{f-\varphi}(\xi)| \leq \lVert f - \varphi \rVert_1 < \varepsilon$ với mọi $\xi$.

4. **Hạng thứ hai**: Vì $\varphi$ là step function (Bước 2), $|\hat{\varphi}(\xi)| < \varepsilon$ với $|\xi|$ đủ lớn (tồn tại $\xi_0 = \xi_0(\varepsilon, \varphi)$).

5. Vậy với $|\xi| > \xi_0$:
$$
|\hat{f}(\xi)| < \varepsilon + \varepsilon = 2\varepsilon.
$$

Vì $\varepsilon > 0$ tùy ý, ta được $\hat{f}(\xi) \to 0$ khi $|\xi| \to \infty$. $\blacksquare$

---

### Bằng Chứng Thay Thế: Symmetry Argument

Có một chứng minh thanh lịch hơn dùng **tính đối xứng của $e^{-ix\xi}$**:

$$
\hat{f}(\xi) = \int f(x) e^{-ix\xi} dx \stackrel{x \mapsto x + \pi/\xi}{=} \int f\!\left(x + \frac{\pi}{\xi}\right) e^{-i(x+\pi/\xi)\xi} dx = -\int f\!\left(x + \frac{\pi}{\xi}\right) e^{-ix\xi} dx.
$$

(Dùng $e^{-i\pi} = -1$ và substitution $u = x - \pi/\xi$.) Cộng hai biểu thức:

$$
2\hat{f}(\xi) = \int \left[f(x) - f\!\left(x + \frac{\pi}{\xi}\right)\right] e^{-ix\xi} dx.
$$

Suy ra:

$$
|\hat{f}(\xi)| \leq \frac{1}{2} \int \left|f(x) - f\!\left(x + \frac{\pi}{\xi}\right)\right| dx = \frac{1}{2} \lVert f - \tau_{\pi/\xi} f \rVert_1.
$$

Khi $|\xi| \to \infty$, $\pi/\xi \to 0$. Bởi **tính liên tục translation mạnh** của $L^1$ (strong continuity): $\lVert f - \tau_h f \rVert_1 \to 0$ khi $h \to 0$. Do đó $|\hat{f}(\xi)| \to 0$. $\blacksquare$

---

## Hệ Quả và Ứng Dụng

> [!corollary] Corollary A0.2 — Phiên bản Fourier Series
> Với $f \in L^1(\mathbb{T})$:
>
> $$
> \hat{f}(n) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x) e^{-inx} dx \to 0 \quad \text{khi } |n| \to \infty
> $$
>
> Proof hoàn toàn tương tự.

> [!corollary] Corollary A0.3 — Phiên bản Sine/Cosine
> Với $f \in L^1(\mathbb{R})$:
> $$
> \int f(x) \cos(\xi x) dx \to 0 \quad \text{và} \quad \int f(x) \sin(\xi x) dx \to 0 \quad \text{khi } |\xi| \to \infty
> $$

> [!note] Remark A0.4 — Đảo Chiều Không Đúng
> Riemann-Lebesgue **không thể đảo**: $\hat{f} \in C_0$ không kéo theo $f \in L^1$.
>
> Ví dụ: $g(\xi) = \mathbf{1}_{[0,1]}(\xi) \in C_0$ nhưng không phải FT của bất kỳ $L^1$ function nào (vì $\hat{g}(x) = \frac{\sin x}{x} \notin L^1$).

---

## Ý Nghĩa Toán Học

Riemann-Lebesgue thể hiện nguyên tắc: **oscillation → cancellation**. Khi $|\xi|$ lớn, $e^{-ix\xi}$ oscillate rất nhanh, và tích phân của $f \cdot e^{-ix\xi}$ bị triệt tiêu do cancellation giữa phần dương và âm.

Điều này liên hệ chặt chẽ với tốc độ giảm của $|\hat{f}(\xi)|$:
- $f \in L^1$, không liên tục: $|\hat{f}(\xi)| = o(1)$
- $f$ Hölder continuous $\alpha > 0$: $|\hat{f}(\xi)| = O(|\xi|^{-\alpha})$
- $f \in C^k$ với $f^{(k)} \in L^1$: $|\hat{f}(\xi)| = O(|\xi|^{-k})$
- $f \in \mathcal{S}$ (Schwartz): $|\hat{f}(\xi)| = O(|\xi|^{-N})$ với mọi $N$ (rapid decay)

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Proposition 8.22.
- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Proposition 1.5.
- ProofWiki: Riemann-Lebesgue Lemma. https://proofwiki.org/wiki/Riemann-Lebesgue_Lemma
