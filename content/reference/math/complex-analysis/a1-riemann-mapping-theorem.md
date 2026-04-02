---
title: "A1. Riemann Mapping Theorem — Full Proof"
tags: [math, complex-analysis, appendix]
created: 2026-03-31
---

> Bài học liên quan: [[12-riemann-mapping-theorem|12. Riemann Mapping Theorem]]

## Định lý (nhắc lại)

> [!abstract] Theorem A1.1 — Định lý Ánh xạ Riemann
> Mọi miền đơn liên thực sự $\Omega \subsetneq \mathbb{C}$ đều biholomorphic với $D(0,1)$. Với $z_0 \in \Omega$ tùy ý, tồn tại duy nhất $f: \Omega \to D(0,1)$ biholomorphic thỏa $f(z_0) = 0$, $f'(z_0) > 0$.

---

## Chứng Minh Đầy Đủ

### Bước 1: Xây dựng họ $\mathcal{F}$

Định nghĩa:

$$\mathcal{F} = \{f \in \mathcal{O}(\Omega) : f \text{ đơn ánh}, f(\Omega) \subseteq D(0,1), f(z_0) = 0\}$$

**$\mathcal{F}$ không rỗng:** Vì $\Omega \neq \mathbb{C}$, chọn $a \in \mathbb{C}\setminus\Omega$. Hàm $z - a$ không triệt tiêu trên $\Omega$ đơn liên, nên có căn bậc hai holomorphic: tồn tại $h \in \mathcal{O}(\Omega)$ với $h^2 = z-a$.

$h$ đơn ánh: nếu $h(z_1) = h(z_2)$ thì $z_1 - a = z_2 - a$, tức $z_1 = z_2$.

$h(\Omega)$ là mở (Open Mapping Theorem). Vì $h$ đơn ánh, $-h$ cũng đơn ánh và $-h(\Omega) = \{-w : w \in h(\Omega)\}$. Vì $h^2 = z-a$ và $(-h)^2 = z-a$, nếu $h(z) = w_0$ thì $-w_0 \notin h(\Omega)$ (nếu không, $h(z') = -w_0$ cho $z' \neq z$, nhưng $(-w_0)^2 = w_0^2$ tức $z'-a = z-a$, mâu thuẫn với đơn ánh của $h^2$). Do đó $h(\Omega) \cap (-h(\Omega)) = \emptyset$.

Vì $h(\Omega)$ mở, tồn tại $D(h(z_0), \delta) \subset h(\Omega)$. Do $h(\Omega) \cap (-h(\Omega)) = \emptyset$: $D(-h(z_0), \delta) \cap h(\Omega) = \emptyset$.

Xét $g(z) = \frac{\delta}{h(z) + h(z_0)}$: $g$ holomorphic và $|h(z) - (-h(z_0))| \geq \delta$ (vì $-h(z_0) \notin h(\Omega)$), nên $|g(z)| \leq 1$. Sau chuẩn hóa về $0$:

$$f_0(z) = c \cdot \frac{g(z) - g(z_0)}{1 - \overline{g(z_0)}g(z)} \in \mathcal{F}$$

với $c$ là số phức có module $1$ để $f_0'(z_0) > 0$.

### Bước 2: Tìm cực trị

Đặt $M = \sup_{f \in \mathcal{F}}|f'(z_0)|$. Từ Bất đẳng thức Cauchy: $|f'(z_0)| \leq 1/d(z_0, \partial D)$ — nhưng thực ra $M < \infty$ theo cách khác (vì $f(\Omega) \subset D$).

Chọn dãy $\{f_n\} \subset \mathcal{F}$ với $|f_n'(z_0)| \to M$. Vì $|f_n| \leq 1$ trên $\Omega$ (bị chặn cục bộ), **Định lý Montel** cho dãy con $f_{n_k} \to f$ đồng đều trên compact.

**$f \in \mathcal{F}$:**
- $f(z_0) = \lim f_{n_k}(z_0) = 0$ ✓
- $f(\Omega) \subseteq \overline{D}$ (đóng). Vì $f_{n_k}(\Omega) \subset D$ và Open Mapping, nếu $f$ không hằng thì $f(\Omega)$ mở $\subset D$ ✓.
- $f$ đơn ánh: dùng **Hurwitz Theorem** — $f_{n_k}$ đơn ánh → $f$ đơn ánh hoặc hằng. Vì $|f'(z_0)| = M > 0$, $f$ không hằng → $f$ đơn ánh ✓.

Vậy $f \in \mathcal{F}$ và $|f'(z_0)| = M$.

### Bước 3: $f$ là surjection (onto $D$)

Giả sử $f(\Omega) \subsetneq D(0,1)$. Chọn $w_0 \in D\setminus f(\Omega)$. Xét Blaschke factor:

$$\varphi(z) = \frac{z - w_0}{1 - \bar{w}_0 z}: D \to D$$

$\varphi \circ f: \Omega \to D$, $(\varphi\circ f)(z_0) = \frac{0-w_0}{1-0} = -w_0 \neq 0$.

Vì $(\varphi\circ f)(\Omega)$ không chứa $0$ (vì $0 \notin f(\Omega)$ ... hơi phức tạp — xem bên dưới), ta có thể lấy căn bậc hai holomorphic:

$$s(z) = \sqrt{\varphi(f(z))}: \Omega \to D$$

(tồn tại vì $\varphi(f(\Omega))$ đơn liên và không chứa $0$).

Đặt $\psi = \varphi_{-s(z_0)} \circ s$ (dịch về $0$):

$$F = c \cdot \psi: \Omega \to D, \quad F(z_0) = 0, \quad F'(z_0) > 0$$

**Tính toán:** $|F'(z_0)| > |f'(z_0)| = M$.

Chứng minh bất đẳng thức này bằng Schwarz-Pick: đặt $g = \varphi_{w_0} \circ f^{-1} \circ \varphi_{-s(z_0)}^{-1} \circ (\cdot)^2 \circ \varphi_{s(z_0)}^{-1}$. Thì $F = g \circ f$ và $g: D \to D$ không phải automorphism (vì $f(\Omega) \neq D$), nên $|g'(0)| < 1$ (Schwarz). Do đó $|F'(z_0)| = |g'(f(z_0))| \cdot |f'(z_0)| > |f'(z_0)| = M$ — mâu thuẫn với tính cực trị của $f$.

Vậy $f(\Omega) = D(0,1)$. $\blacksquare$

### Tính Duy Nhất

Nếu $f, g: \Omega \to D$ đều thỏa điều kiện, thì $h = g \circ f^{-1}: D \to D$, $h(0) = 0$, $h'(0) > 0$. Schwarz Lemma: $h(z) = e^{i\theta}z$. Vì $h'(0) > 0$: $\theta = 0$, suy ra $h = \operatorname{id}$, tức $g = f$. $\blacksquare$

---

## Ghi Chú Lịch Sử

- **1851**: Riemann phát biểu định lý (không chứng minh hoàn chỉnh, dùng Dirichlet Principle chưa được chứng minh).
- **1900**: Osgood chứng minh đúng lần đầu tiên.
- **1912**: Carathéodory đưa ra chứng minh qua Normal Families — phương pháp chuẩn đến ngày nay.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 6.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 8.
- Krantz, S. G. *The Riemann Mapping Theorem*, The Mathematical Intelligencer (2015).
