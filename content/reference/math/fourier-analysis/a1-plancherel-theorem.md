---
title: "A1. Proof of Plancherel Theorem"
tags: [math, fourier-analysis, appendix, plancherel, l2-theory]
aliases: [Plancherel Proof]
created: 2026-03-24
---

> **Related lesson**: [[08-fourier-transform-l2|08. Fourier Transform trên L² & Plancherel]]
> **Theorem**: Fourier transform mở rộng thành unitary operator trên $L^2(\mathbb{R})$ với $\lVert\hat{f}\rVert_2 = \sqrt{2\pi}\lVert f\rVert_2$.

---

## Phát Biểu Đầy Đủ

> [!theorem] Plancherel Theorem
> **(a)** Với mọi $f \in \mathcal{S}(\mathbb{R})$ (Schwartz space):
>
> $$
> \int_{\mathbb{R}} |\hat{f}(\xi)|^2\, d\xi = 2\pi \int_{\mathbb{R}} |f(x)|^2\, dx
> $$
>
> tức $\lVert \hat{f} \rVert_{L^2} = \sqrt{2\pi}\, \lVert f \rVert_{L^2}$.
>
> **(b)** Fourier transform mở rộng duy nhất thành ánh xạ **bounded linear operator** $\mathcal{F}: L^2(\mathbb{R}) \to L^2(\mathbb{R})$ với:
>
> $$
> \lVert \mathcal{F}f \rVert_2 = \sqrt{2\pi}\, \lVert f \rVert_2, \quad \langle \mathcal{F}f, \mathcal{F}g \rangle_2 = 2\pi\, \langle f, g \rangle_2
> $$
>
> **(c)** $\tilde{\mathcal{F}} = \mathcal{F}/\sqrt{2\pi}$ là **unitary operator**: bijective, isometry, $\tilde{\mathcal{F}}^{-1} = \tilde{\mathcal{F}}^*$.

---

## Chứng Minh Phần (a): $\mathcal{S}(\mathbb{R})$

Proof gồm 3 bước: multiplication formula $\Rightarrow$ Gaussian case $\Rightarrow$ Plancherel trên $\mathcal{S}$.

### Bước 1: Multiplication Formula

> [!lemma] Lemma A1.1 — Multiplication Formula
> Với $f, g \in L^1(\mathbb{R})$:
>
> $$
> \int_{\mathbb{R}} \hat{f}(\xi)\, g(\xi)\, d\xi = \int_{\mathbb{R}} f(x)\, \hat{g}(x)\, dx
> $$

**Proof.** Dùng Fubini (tích phân tuyệt đối hội tụ vì $f, g \in L^1$):

$$
\int \hat{f}(\xi) g(\xi) d\xi = \int \left(\int f(x) e^{-ix\xi} dx\right) g(\xi) d\xi = \int f(x) \left(\int g(\xi) e^{-ix\xi} d\xi\right) dx = \int f(x) \hat{g}(x) dx.
$$

(Đổi thứ tự tích phân hợp lệ theo Fubini vì $|f(x)g(\xi)| \leq |f(x)|\cdot|g(\xi)|$ với tổng tích phân hữu hạn.) $\blacksquare$

### Bước 2: Fourier Transform của Gaussian

> [!lemma] Lemma A1.2 — Gaussian là Eigenfunction
> Đặt $\phi_t(x) = e^{-t|x|^2}$ với $t > 0$. Khi đó:
>
> $$
> \hat{\phi}_t(\xi) = \sqrt{\frac{\pi}{t}}\, e^{-|\xi|^2/(4t)}
> $$
>
> Đặc biệt với $t = 1/2$: $\hat{\phi}_{1/2}(\xi) = \sqrt{2\pi}\, e^{-|\xi|^2/2}$.

**Proof (1D).** Tính $I = \int_{-\infty}^\infty e^{-tx^2 - ix\xi} dx$. Hoàn thiện bình phương:

$$
tx^2 + ix\xi = t\!\left(x + \frac{i\xi}{2t}\right)^2 + \frac{\xi^2}{4t}.
$$

Vậy:

$$
I = e^{-\xi^2/(4t)} \int_{-\infty}^\infty e^{-t(x+i\xi/(2t))^2} dx.
$$

Tích phân còn lại: đường tích phân dịch chuyển $t \mapsto x + i\xi/(2t)$ trong mặt phẳng phức, nhưng do $e^{-tz^2}$ analytic và exponentially decaying, Cauchy's theorem cho phép dịch chuyển đường tích phân:

$$
\int_{-\infty}^\infty e^{-tu^2} du = \sqrt{\frac{\pi}{t}}.
$$

(Tích phân Gaussian chuẩn — dùng $\int_{-\infty}^\infty e^{-u^2} du = \sqrt{\pi}$ và co giãn $u \mapsto \sqrt{t}\, u$.) Vậy $\hat{\phi}_t(\xi) = \sqrt{\pi/t}\, e^{-\xi^2/(4t)}$. $\blacksquare$

### Bước 3: Plancherel trên $\mathcal{S}$

**Proof của (a).** Với $f \in \mathcal{S}(\mathbb{R})$, đặt $g(\xi) = \overline{\hat{f}(\xi)} \in \mathcal{S}$. Áp dụng Multiplication Formula (Lemma A1.1):

$$
\int |\hat{f}(\xi)|^2 d\xi = \int \hat{f}(\xi) \overline{\hat{f}(\xi)} d\xi = \int \hat{f}(\xi) g(\xi) d\xi = \int f(x) \hat{g}(x) dx.
$$

Tính $\hat{g}$: $g(\xi) = \overline{\hat{f}(\xi)} = \int \overline{f(x)} e^{ix\xi} dx$. Bằng Fourier Inversion trên $\mathcal{S}$:

$$
\hat{g}(x) = \int g(\xi) e^{-ix\xi} d\xi = \int \overline{\hat{f}(\xi)} e^{-ix\xi} d\xi = \overline{\int \hat{f}(\xi) e^{ix\xi} d\xi} = \overline{2\pi f(-(-x))} \cdot (\text{reflection}).
$$

Cẩn thận hơn: Fourier inversion cho $f(x) = \frac{1}{2\pi}\int \hat{f}(\xi) e^{ix\xi} d\xi$, nên $2\pi f(x) = \int \hat{f}(\xi) e^{ix\xi} d\xi$.

Do đó $\hat{g}(x) = \overline{2\pi f(x)} \cdot \text{sign correction}$... Cách chặt chẽ hơn:

Đặt $f_-(x) = \overline{f(-x)}$. Khi đó $\hat{f}_-(\xi) = \overline{\hat{f}(\xi)} = g(\xi)$, và Fourier Inversion: $\hat{g}(x) = \mathcal{F}[\hat{f}_-](x) = 2\pi f_-(-x) = 2\pi \overline{f(x)}$.

Vậy:

$$
\int |\hat{f}(\xi)|^2 d\xi = \int f(x) \cdot 2\pi\overline{f(x)} dx = 2\pi \int |f(x)|^2 dx. \quad \blacksquare
$$

---

## Chứng Minh Phần (b): Extension sang $L^2$

### Density Argument

> [!lemma] Lemma A1.3 — $\mathcal{S}$ dense trong $L^2$
> Với mọi $f \in L^2(\mathbb{R})$ và $\varepsilon > 0$, tồn tại $\varphi \in \mathcal{S}$ với $\lVert f - \varphi \rVert_2 < \varepsilon$.

**Proof.** Dùng $C_c^\infty \subseteq \mathcal{S}$ và $C_c^\infty$ dense trong $L^2$ (chuẩn Lebesgue). $\blacksquare$

### Extension bằng BLT Theorem

**Proof của (b).** Từ Phần (a): với mọi $\varphi \in \mathcal{S}$, $\lVert\hat{\varphi}\rVert_2 = \sqrt{2\pi}\lVert\varphi\rVert_2$.

Với $f \in L^2$ tùy ý, chọn $\varphi_n \in \mathcal{S}$ với $\varphi_n \to f$ trong $L^2$. Khi đó:

$$
\lVert\hat{\varphi}_m - \hat{\varphi}_n\rVert_2 = \sqrt{2\pi}\lVert\varphi_m - \varphi_n\rVert_2 \to 0
$$

nên $\{\hat{\varphi}_n\}$ là Cauchy sequence trong $L^2$. Do $L^2$ **Banach**, tồn tại giới hạn $F = \lim_n \hat{\varphi}_n$ trong $L^2$.

**Tính well-defined**: Nếu $\psi_n \to f$ cũng trong $L^2$, thì $\lVert\hat{\varphi}_n - \hat{\psi}_n\rVert_2 = \sqrt{2\pi}\lVert\varphi_n - \psi_n\rVert_2 \to 0$, nên $\lim\hat{\varphi}_n = \lim\hat{\psi}_n$. Vậy $F$ không phụ thuộc vào cách chọn $\varphi_n$.

**Định nghĩa**: $\mathcal{F}f = F = L^2\text{-}\lim_n \hat{\varphi}_n$.

**Isometry**: $\lVert\mathcal{F}f\rVert_2 = \lim_n\lVert\hat{\varphi}_n\rVert_2 = \sqrt{2\pi}\lim_n\lVert\varphi_n\rVert_2 = \sqrt{2\pi}\lVert f\rVert_2$.

**Inner product**: Bằng polarization identity, isometry $\Rightarrow$ inner product preservation. $\blacksquare$

---

## Chứng Minh Phần (c): Unitarity

### Surjectivity (Toàn Ánh)

**Proof.** Cần chứng minh $\mathcal{F}$ surjective lên $L^2$.

Gọi $V = \mathcal{F}(L^2)$ là image. $V$ là closed subspace (vì $\mathcal{F}$ isometry). Nếu $g \perp V$, tức $\langle \mathcal{F}f, g \rangle = 0$ với mọi $f \in L^2$, thì với mọi $\varphi \in \mathcal{S}$:

$$
0 = \langle \hat{\varphi}, g \rangle = 2\pi\langle \varphi, g \rangle
$$

(Multiplication Formula trên $\mathcal{S}$). Vậy $\langle \varphi, g \rangle = 0$ với mọi $\varphi \in \mathcal{S}$. Vì $\mathcal{S}$ dense trong $L^2$, suy ra $g = 0$.

Vậy $V^\perp = \{0\}$, tức $V = L^2$. $\mathcal{F}$ surjective. $\blacksquare$

### Kết Luận

$\tilde{\mathcal{F}} = \mathcal{F}/\sqrt{2\pi}$ là:
- **Isometry**: $\lVert\tilde{\mathcal{F}}f\rVert = \lVert f\rVert$ ✓
- **Surjective**: $\tilde{\mathcal{F}}(L^2) = L^2$ ✓
- **Injective**: isometry $\Rightarrow$ injective (nếu $\tilde{\mathcal{F}}f = 0$ thì $\lVert f\rVert = \lVert\tilde{\mathcal{F}}f\rVert = 0$) ✓

Do đó $\tilde{\mathcal{F}}$ là **unitary operator** và $\tilde{\mathcal{F}}^{-1} = \tilde{\mathcal{F}}^*$. $\blacksquare$

---

## Công Thức Nghịch Đảo trong $L^2$

> [!corollary] Corollary A1.4 — $L^2$ Inversion Formula
> Với $f \in L^2(\mathbb{R})$:
>
> $$
> f(x) = \frac{1}{2\pi} \lim_{R\to\infty} \int_{-R}^{R} \hat{f}(\xi)\, e^{ix\xi}\, d\xi \quad \text{(limit trong } L^2\text{)}
> $$

**Proof.** Với $f_R = f \cdot \mathbf{1}_{[-R,R]}$: $f_R \to f$ trong $L^2$ và $\hat{f}_R \to \hat{f}$ trong $L^2$. Áp dụng Fourier Inversion (classical) cho $f_R \in L^1 \cap L^2$, rồi lấy giới hạn trong $L^2$. $\blacksquare$

---

## Nhận Xét Quan Trọng

> [!note] Remark A1.5 — So Sánh với Parseval cho Fourier Series
> Parseval trên $\mathbb{T}$: $\lVert f \rVert_{L^2(\mathbb{T})}^2 = \sum_n |\hat{f}(n)|^2$
>
> Plancherel trên $\mathbb{R}$: $\lVert f \rVert_{L^2(\mathbb{R})}^2 = \frac{1}{2\pi}\lVert\hat{f}\rVert_{L^2(\mathbb{R})}^2$
>
> Hệ số $2\pi$ do convention $\hat{f}(\xi) = \int f e^{-ix\xi} dx$. Với convention $\hat{f}(\xi) = \int f e^{-2\pi ix\xi} dx$ (physics): $\lVert\hat{f}\rVert_2 = \lVert f\rVert_2$ (không có hệ số).

> [!note] Remark A1.6 — Định lý Plancherel là Đặc Trưng Fourier
> Plancherel không chỉ là equality — nó cho biết $\mathcal{F}: L^2 \to L^2$ là **isometric isomorphism**. Không gian hàm $L^2(\mathbb{R})$ và không gian phổ $L^2(\mathbb{R})$ "giống nhau" một cách toán học hoàn toàn. Phân tích trong miền thời gian và miền tần số là tương đương.

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Theorem 8.29.
- Rudin, W. *Real and Complex Analysis* (3rd ed.). McGraw-Hill, 1987. Theorem 9.13.
- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Theorem 2.2, Chapter 5.
