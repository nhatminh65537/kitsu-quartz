---
title: "A3. Radon-Nikodym Theorem & Duality of Lp"
tags: [math, functional-analysis, appendix]
aliases: [Proof Lp Duality Radon-Nikodym]
created: 2026-03-31
---

> **Liên quan**: [[09-lp-spaces|09. Lp Spaces]]

---

## Phát biểu

> [!theorem] Theorem A3.1 — Radon-Nikodym Theorem
> Cho $(\Omega, \mathcal{M}, \mu)$ là không gian đo $\sigma$-hữu hạn, và $\nu$ là đo có dấu (signed measure) $\sigma$-hữu hạn trên $(\Omega, \mathcal{M})$ thỏa **absolutely continuous** với $\mu$ ($\nu \ll \mu$: $\mu(E) = 0 \Rightarrow \nu(E) = 0$). Khi đó tồn tại duy nhất (up to a.e.) hàm đo được $g: \Omega \to \mathbb{R}$ sao cho:
>
> $$
> \nu(E) = \int_E g \, d\mu \quad \forall\, E \in \mathcal{M}
> $$
>
> Hàm $g$ gọi là **Radon-Nikodym derivative** của $\nu$ so với $\mu$, ký hiệu $g = \frac{d\nu}{d\mu}$.

---

## Chứng minh Radon-Nikodym (Proof bằng Hilbert space)

**Proof** (von Neumann, dùng Riesz Representation Theorem).

**Bước 1 — Rút gọn về trường hợp hữu hạn và dương**: Đủ xét $\mu, \nu$ hữu hạn và $\nu \geq 0$.

**Bước 2 — Xây dựng trên $L^2$**: Xét tổng $\lambda = \mu + \nu$ (hữu hạn). Phiếm hàm:

$$
\ell: L^2(\lambda) \to \mathbb{R}, \quad \ell(f) = \int_\Omega f \, d\nu
$$

là tuyến tính bị chặn: $|\ell(f)| \leq \nu(\Omega)^{1/2} \|f\|_{L^2(\lambda)}$ (Cauchy-Schwarz). Theo Riesz Representation Theorem trên $L^2(\lambda)$: tồn tại duy nhất $h \in L^2(\lambda)$ sao cho:

$$
\int f \, d\nu = \int fh \, d\lambda = \int fh \, d\mu + \int fh \, d\nu \quad \forall\, f \in L^2(\lambda)
$$

**Bước 3 — Kiểm tra $0 \leq h < 1$ a.e.**: Với $f = \mathbf{1}_{\{h < 0\}}$:

$$
0 \leq \int_{\{h<0\}} d\nu = \int_{\{h<0\}} h \, d\lambda \leq 0 \implies \nu(\{h < 0\}) = 0
$$

Tương tự, $\nu(\{h \geq 1\}) = 0$. Vậy $0 \leq h < 1$ a.e.

**Bước 4 — Xây dựng $g$**: Đặt $g = h/(1-h)$ (xác định a.e. vì $h < 1$ a.e.). Từ:

$$
\int f(1-h) \, d\nu = \int fh \, d\mu
$$

Thay $f = \mathbf{1}_E / (1-h)$ (với $E \in \mathcal{M}$): $\nu(E) = \int_E g \, d\mu$. $\blacksquare$

---

## Áp dụng: Chứng minh Duality $(L^p)^* \cong L^q$

> [!theorem] Theorem A3.2 — Duality of $L^p$ ($1 < p < \infty$)
> Cho $(\Omega, \mathcal{M}, \mu)$ là không gian đo $\sigma$-hữu hạn và $1 < p < \infty$, $1/p + 1/q = 1$. Ánh xạ:
>
> $$
> \Phi: L^q(\mu) \to (L^p(\mu))^*, \quad \Phi(g)(f) = \int_\Omega fg \, d\mu
> $$
>
> là đẳng cấu đẳng cự: $\|\Phi(g)\| = \|g\|_q$ và $\Phi$ toàn ánh.

**Proof.**

**$\Phi$ đẳng cự**: Theo Hölder, $|\Phi(g)(f)| \leq \|f\|_p \|g\|_q$, nên $\|\Phi(g)\| \leq \|g\|_q$. Để thấy dấu bằng, chọn $f_0 = |g|^{q-1} \operatorname{sign}(g) / \|g\|_q^{q/p}$ — khi đó $\|f_0\|_p = 1$ và $\Phi(g)(f_0) = \|g\|_q$.

**$\Phi$ toàn ánh**: Cho $\Lambda \in (L^p)^*$ tùy ý. Định nghĩa đo:

$$
\nu(E) = \Lambda(\mathbf{1}_E) \quad \forall\, E \in \mathcal{M} \text{ với } \mu(E) < \infty
$$

$\nu$ là đo có dấu và $\nu \ll \mu$ (vì $\mu(E) = 0 \Rightarrow \mathbf{1}_E = 0$ trong $L^p \Rightarrow \Lambda(\mathbf{1}_E) = 0$). Theo Radon-Nikodym, tồn tại $g$ với $\nu(E) = \int_E g \, d\mu$, tức là:

$$
\Lambda(f) = \int fg \, d\mu \quad \text{với } f \text{ simple}
$$

Mở rộng ra toàn bộ $L^p$ bằng tính liên tục (simple functions trù mật) và kiểm tra $g \in L^q$ (dùng $\|\Lambda\| < \infty$). $\blacksquare$

---

## Trường hợp $p = 1$

> [!theorem] Theorem A3.3 — Duality $(L^1)^* \cong L^\infty$
> Với $\mu$ $\sigma$-hữu hạn: $(L^1(\mu))^* \cong L^\infty(\mu)$ qua $\Phi(g)(f) = \int fg \, d\mu$.

**Proof** tương tự. Chiều $\|\Phi(g)\| = \|g\|_\infty$: với mọi $\varepsilon > 0$, tập $\{|g| > \|g\|_\infty - \varepsilon\}$ có đo dương; chọn $f_0 = \mathbf{1}_E \cdot \operatorname{sign}(g) / \mu(E)$ trên tập đó. $\blacksquare$

---

## Tại sao $(L^\infty)^* \supsetneq L^1$?

> [!note] Remark A3.4 — $(L^\infty)^*$ không phải $L^1$
> Ánh xạ $\Phi: L^1 \to (L^\infty)^*$ là đẳng cự nhưng **không toàn ánh**: Banach limit là ví dụ phần tử của $(L^\infty)^*$ không thuộc ảnh của $\Phi$. Cụ thể, $\ell^\infty = L^\infty(\mathbb{N}, \text{counting measure})$ và $(\ell^\infty)^* \supsetneq \ell^1$.
>
> Đây là lý do $L^\infty$ không reflexive và $L^1$ không reflexive.

---

## References

- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 6.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 19.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 1.
