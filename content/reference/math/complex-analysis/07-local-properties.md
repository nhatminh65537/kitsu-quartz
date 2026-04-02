---
title: "07. Local Properties of Analytic Functions"
tags: [math, complex-analysis, lesson-07]
aliases: [Local Properties of Analytic Functions]
created: 2026-03-31
---

> **Prerequisites**: [[06-complex-integration|06. Complex Integration]]
> **Objectives**:
> - Hiểu và chứng minh Định lý Ánh xạ Mở
> - Nắm vững Nguyên lý Module Cực đại và các hệ quả
> - Phân tích cấu trúc điểm không (zeros) của hàm analytic
> - Chứng minh Định lý Đồng nhất (Identity Theorem)

---

## Motivation / Intuition

Bài này khám phá một trong những đặc trưng mạnh nhất của hàm holomorphic: chúng **"hành xử toàn cục từ thông tin cục bộ"**. Chẳng hạn, nếu một hàm holomorphic bằng $0$ trên một tập có điểm tụ, thì nó bằng $0$ ở **khắp nơi** trên miền liên thông — tính chất không có trong giải tích thực.

Tương tự, module $|f|$ của hàm holomorphic không thể đạt cực đại bên trong miền (trừ khi hằng số) — nó luôn đạt max trên biên.

---

## Điểm Không và Bậc (Zeros and Order)

### Definition

> [!info] Definition 7.1 — Bậc của điểm không (Order of a Zero)
> Cho $f$ holomorphic tại $z_0$ với $f(z_0) = 0$. **Bậc** (order hay multiplicity) của $z_0$ là số nguyên dương $m$ sao cho:
>
> $$f(z) = (z - z_0)^m g(z)$$
>
> với $g$ holomorphic tại $z_0$ và $g(z_0) \neq 0$.

Tương đương: $m$ là chỉ số nhỏ nhất sao cho $f^{(m)}(z_0) \neq 0$ (trong khi $f(z_0) = f'(z_0) = \cdots = f^{(m-1)}(z_0) = 0$).

> [!abstract] Theorem 7.2 — Điểm không cô lập (Isolated Zeros)
> Nếu $f$ holomorphic, không hằng bằng $0$ trên miền liên thông $\Omega$, thì mọi điểm không của $f$ đều **cô lập**: tồn tại $r > 0$ sao cho $f(z) \neq 0$ với $0 < |z - z_0| < r$.

**Proof.** Nếu $f(z_0) = 0$, viết $f(z) = (z-z_0)^m g(z)$ với $g(z_0) \neq 0$. Vì $g$ liên tục, tồn tại lân cận của $z_0$ mà $g \neq 0$. Trên lân cận đó $f(z) = 0 \Leftrightarrow z = z_0$. $\blacksquare$

---

## Định Lý Đồng Nhất (Identity Theorem)

> [!abstract] Theorem 7.3 — Định lý Đồng nhất (Identity Theorem)
> Cho $f, g$ holomorphic trên miền liên thông $\Omega$. Nếu $f(z) = g(z)$ trên một tập $A \subset \Omega$ có **điểm tụ** (accumulation point) trong $\Omega$, thì $f \equiv g$ trên toàn $\Omega$.

**Proof.** Xét $h = f - g$, holomorphic trên $\Omega$ với $h = 0$ trên $A$. Gọi $Z = \{z \in \Omega : h \equiv 0 \text{ gần } z\}$.

$Z$ **mở**: nếu $z_0 \in Z$, thì $h \equiv 0$ trên lân cận $z_0$, nên toàn bộ lân cận đó thuộc $Z$.

$Z$ **đóng** trong $\Omega$: nếu $z_n \to z^* \in \Omega$ với $z_n \in Z$. Vì $h(z_n) = 0$ và $h$ liên tục, $h(z^*) = 0$. Thực ra $h^{(k)}(z^*) = 0$ với mọi $k$ (bằng giới hạn từ $z_n$), nên khai triển Taylor của $h$ tại $z^*$ bằng $0$, tức $z^* \in Z$.

Vì $\Omega$ liên thông và $A$ có điểm tụ trong $\Omega$, tập $A$'s accumulation point thuộc $Z$, nên $Z \neq \emptyset$. Từ $Z$ mở, đóng, khác rỗng trong $\Omega$ liên thông: $Z = \Omega$. $\blacksquare$

> [!example] Example 7.4 — Ứng dụng Identity Theorem
> Hàm $\sin z$ thỏa $\sin z = 0$ khi $z = n\pi$ ($n \in \mathbb{Z}$). Nếu một hàm entire $f$ thỏa $f(n\pi) = 0$ với mọi $n \in \mathbb{Z}$, Identity Theorem **không** trực tiếp cho $f \equiv 0$ vì $\{n\pi\}$ không có điểm tụ trong $\mathbb{C}$.
>
> Nhưng nếu $f(z) = \sin z$ với $z \in (-\varepsilon, \varepsilon)$ cho một $\varepsilon > 0$ nào đó, thì $f \equiv \sin z$ trên toàn $\mathbb{C}$.

> [!example] Example 7.5 — Hàm thực không thỏa Identity Theorem
> Trong $\mathbb{R}$: hàm $f(x) = e^{-1/x^2}$ (cho $x \neq 0$), $f(0) = 0$ là $C^\infty$ và bằng $0$ cùng tất cả đạo hàm tại $0$, nhưng $f \not\equiv 0$. Hiện tượng này **không xảy ra** với hàm holomorphic.

---

## Nguyên Lý Module Cực Đại (Maximum Modulus Principle)

> [!abstract] Theorem 7.6 — Nguyên lý Module Cực đại (Maximum Modulus Principle)
> Nếu $f$ holomorphic trên miền liên thông $\Omega$ và $|f|$ đạt giá trị cực đại tại điểm $z_0 \in \Omega$, thì $f$ hằng số trên $\Omega$.

**Proof.** Giả sử $|f(z)| \leq |f(z_0)|$ với mọi $z \in \Omega$. Từ Công thức Tích phân Cauchy:

$$f(z_0) = \frac{1}{2\pi}\int_0^{2\pi} f(z_0 + re^{i\theta})\,d\theta$$

Do đó:

$$|f(z_0)| \leq \frac{1}{2\pi}\int_0^{2\pi}|f(z_0 + re^{i\theta})|\,d\theta \leq |f(z_0)|$$

Đẳng thức xảy ra khi và chỉ khi $|f(z_0 + re^{i\theta})| = |f(z_0)|$ với mọi $\theta$. Bằng cách phân tích tích phân, điều này kéo theo $f(z_0 + re^{i\theta}) = f(z_0)$ với mọi $\theta$ (nếu không, $\operatorname{Re}(f(z_0+re^{i\theta})/f(z_0)) < 1$ trên tập có độ đo dương, mâu thuẫn). Áp dụng Identity Theorem: $f$ hằng số. $\blacksquare$

> [!abstract] Corollary 7.7 — Dạng mạnh hơn
> Nếu $f$ holomorphic trên $\Omega$ và liên tục trên $\overline{\Omega}$ (compact), thì:
>
> $$\max_{z \in \overline{\Omega}} |f(z)| = \max_{z \in \partial\Omega} |f(z)|$$
>
> tức module cực đại đạt được trên **biên**, không phải bên trong.

> [!abstract] Corollary 7.8 — Nguyên lý Module Cực tiểu
> Nếu $f$ holomorphic trên $\Omega$ và $f \neq 0$ trên $\Omega$, thì $|f|$ không đạt cực tiểu cục bộ bên trong $\Omega$ (trừ khi $f$ hằng số).

**Proof.** Áp dụng Nguyên lý Module Cực đại cho $1/f$ (holomorphic vì $f \neq 0$). $\blacksquare$

> [!example] Example 7.9 — Ứng dụng tính boundary values
> Cho $f$ holomorphic trên $D(0,1)$, liên tục trên $\overline{D}(0,1)$, và $|f(z)| = 1$ với $|z|=1$. Thì $|f(z)| \leq 1$ với $|z| < 1$.

---

## Định Lý Ánh Xạ Mở (Open Mapping Theorem)

> [!abstract] Theorem 7.10 — Định lý Ánh xạ Mở (Open Mapping Theorem)
> Nếu $f: \Omega \to \mathbb{C}$ holomorphic và không hằng số, thì $f$ là **ánh xạ mở**: ảnh của tập mở là tập mở.

**Proof.** Đủ chứng minh: với $z_0 \in \Omega$ và $w_0 = f(z_0)$, $f(\Omega)$ chứa một đĩa $D(w_0, \varepsilon)$.

Xét $g(z) = f(z) - w_0$. Vì $f$ không hằng, $z_0$ là điểm không cô lập của $g$; gọi bậc của nó là $m \geq 1$. Chọn $r > 0$ đủ nhỏ sao cho $g$ không có điểm không nào khác trong $\overline{D}(z_0, r)$.

Đặt $\delta = \min_{|z-z_0|=r}|f(z)-w_0| > 0$. Ta chứng minh $D(w_0, \delta) \subset f(D(z_0, r))$. Với $|w - w_0| < \delta$, số nghiệm của $f(z) = w$ trong $D(z_0, r)$ (tính theo bội) bằng:

$$\frac{1}{2\pi i}\int_{|z-z_0|=r}\frac{f'(z)}{f(z)-w}\,dz$$

Biểu thức này liên tục theo $w$ và bằng $m \geq 1$ khi $w = w_0$. Do đó với $|w-w_0| < \delta$ đủ nhỏ, $f(z) = w$ có nghiệm, tức $w \in f(D(z_0,r))$. $\blacksquare$

> [!abstract] Corollary 7.11 — Đẳng cấu holomorphic
> Nếu $f: \Omega \to \mathbb{C}$ holomorphic và đơn ánh, thì $f^{-1}: f(\Omega) \to \Omega$ cũng holomorphic và $(f^{-1})'(w) = 1/f'(f^{-1}(w))$.

---

## Bổ Đề Schwarz (Schwarz Lemma)

> [!abstract] Theorem 7.12 — Bổ đề Schwarz (Schwarz Lemma)
> Cho $f: D(0,1) \to D(0,1)$ holomorphic với $f(0) = 0$. Thì:
>
> $$|f(z)| \leq |z| \quad \forall z \in D(0,1), \qquad |f'(0)| \leq 1$$
>
> Đẳng thức $|f(z_0)| = |z_0|$ với $z_0 \neq 0$, hoặc $|f'(0)| = 1$, khi và chỉ khi $f(z) = e^{i\theta}z$ với $\theta \in \mathbb{R}$.

**Proof.** Vì $f(0) = 0$, đặt $g(z) = f(z)/z$ (điểm không khả khử tại $0$, $g(0) = f'(0)$). Thì $g$ holomorphic trên $D(0,1)$. Trên $|z| = r < 1$: $|g(z)| = |f(z)|/r \leq 1/r$. Nguyên lý Module Cực đại: $|g(z)| \leq 1/r$ trên $|z| \leq r$. Cho $r \to 1^-$: $|g(z)| \leq 1$, tức $|f(z)| \leq |z|$.

Nếu $|g(z_0)| = 1$ tại $z_0 \in D(0,1)$, thì $|g|$ đạt cực đại bên trong, nên $g \equiv e^{i\theta}$ hằng số. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Minh họa Nguyên lý Module Cực đại
import numpy as np
import matplotlib.pyplot as plt

# f(z) = sin(z) trên đĩa D(0, π/2)
theta = np.linspace(0, 2*np.pi, 500)
r = np.pi / 2

# Giá trị trên biên
z_boundary = r * np.exp(1j * theta)
f_boundary = np.sin(z_boundary)

# Giá trị bên trong
x = np.linspace(-r, r, 200)
y = np.linspace(-r, r, 200)
X, Y = np.meshgrid(x, y)
Z = X + 1j*Y
mask = np.abs(Z) < r
F = np.sin(Z)
F_mod = np.abs(F)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Vẽ |f| trên đĩa
im = axes[0].contourf(X, Y, np.where(mask, F_mod, np.nan), levels=50, cmap='viridis')
axes[0].plot(z_boundary.real, z_boundary.imag, 'r-', linewidth=2, label='Biên')
axes[0].set_title('|sin(z)| — Max trên biên')
plt.colorbar(im, ax=axes[0])

# Xác nhận max trên biên > max bên trong
max_boundary = np.max(np.abs(f_boundary))
max_interior = np.nanmax(np.where(mask, F_mod, np.nan))
print(f"Max |f| trên biên: {max_boundary:.4f}")
print(f"Max |f| bên trong: {max_interior:.4f}")
print(f"Nguyên lý cực đại đúng: {max_boundary >= max_interior}")

# Bổ đề Schwarz
def schwarz_check(f, n=1000):
    """Kiểm tra |f(z)| <= |z| cho f: D(0,1) -> D(0,1) với f(0)=0"""
    r_vals = np.linspace(0.01, 0.99, n)
    theta_vals = np.linspace(0, 2*np.pi, n)
    violations = 0
    for r in r_vals[::10]:
        for theta in theta_vals[::10]:
            z = r * np.exp(1j*theta)
            if abs(f(z)) > abs(z) + 1e-10:
                violations += 1
    return violations

# Ví dụ: f(z) = z^2 (thỏa Schwarz)
f_sq = lambda z: z**2
print(f"Vi phạm Schwarz cho z^2: {schwarz_check(f_sq)}")  # 0
```

---

## Summary / Key Takeaways

- Điểm không của hàm holomorphic không hằng luôn **cô lập** và có **bậc** hữu hạn.
- **Identity Theorem**: holomorphic trên miền liên thông, bằng $0$ trên tập có điểm tụ $\Rightarrow$ hằng $0$.
- **Maximum Modulus Principle**: $|f|$ không đạt cực đại bên trong miền (trừ khi $f$ hằng).
- Hệ quả: $\max_{\overline\Omega}|f| = \max_{\partial\Omega}|f|$ — module cực đại đạt trên biên.
- **Open Mapping Theorem**: hàm holomorphic không hằng ánh xạ tập mở sang tập mở.
- Hệ quả: holomorphic đơn ánh $\Rightarrow$ đạo hàm ngược holomorphic.
- **Schwarz Lemma**: ánh xạ holomorphic $D(0,1) \to D(0,1)$ cố định $0$ bị "co" (contraction).

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 4, §§3–4.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 2.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 4, §§3–5.
