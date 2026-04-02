---
title: "12. Riemann Mapping Theorem"
tags: [math, complex-analysis, lesson-12]
aliases: [Riemann Mapping Theorem]
created: 2026-03-31
---

> **Prerequisites**: [[10-harmonic-functions|10. Harmonic Functions]], [[11-conformal-mappings|11. Conformal Mappings]]
> **Objectives**:
> - Hiểu định nghĩa và ý nghĩa của họ chuẩn tắc (normal families)
> - Chứng minh Định lý Montel
> - Phát biểu và chứng minh Định lý Ánh xạ Riemann
> - Hiểu tính duy nhất và hệ quả của định lý

---

## Motivation / Intuition

Định lý Ánh xạ Riemann là một trong những kết quả đẹp nhất và sâu sắc nhất trong toán học: **mọi miền đơn liên thực sự** trong $\mathbb{C}$ đều đẳng cấu bảo giác với đĩa đơn vị. Nói cách khác, dù hình dạng của miền có phức tạp thế nào — hình dạng tùy ý, thậm chí có "vết nứt" vô hạn — nó vẫn nhìn giống hệt đĩa về mặt phân tích phức.

Điều kỳ diệu là chứng minh **không** xây dựng ánh xạ tường minh mà chỉ chứng minh sự tồn tại bằng một lập luận biến phân: trong một họ hàm số, chọn cực trị của $|f'(z_0)|$, và chứng minh nó phải là biholomorphism.

---

## Họ Chuẩn Tắc (Normal Families)

### Definition

> [!info] Definition 12.1 — Họ chuẩn tắc (Normal Family)
> Họ hàm $\mathcal{F} \subset \mathcal{O}(\Omega)$ là **chuẩn tắc** (normal) nếu mọi dãy trong $\mathcal{F}$ đều có dãy con hội tụ đồng đều trên compact (tới một hàm holomorphic, hoặc $\infty$).

> [!info] Definition 12.2 — Họ bị chặn cục bộ (Locally Bounded)
> Họ $\mathcal{F}$ là **bị chặn cục bộ** (locally bounded) nếu với mọi compact $K \subset \Omega$, tồn tại $M = M(K) < \infty$ sao cho $|f(z)| \leq M$ với mọi $f \in \mathcal{F}$, $z \in K$.

> [!abstract] Theorem 12.3 — Định lý Montel (Montel's Theorem)
> Nếu $\mathcal{F} \subset \mathcal{O}(\Omega)$ bị chặn cục bộ, thì $\mathcal{F}$ là họ chuẩn tắc.

**Proof.** Chứng minh gồm hai bước:

*Bước 1 (Equicontinuity).* Với compact $K$, chọn $K' \supset K$ nhỏ hơn $\Omega$. Từ Công thức Cauchy: với $z, w \in K$ và $|f| \leq M$ trên $K'$:

$$|f(z) - f(w)| = \left|\frac{1}{2\pi i}\int_{\partial K'} f(\zeta)\left(\frac{1}{\zeta-z} - \frac{1}{\zeta-w}\right)d\zeta\right| \leq \frac{M \cdot L(\partial K')}{\pi d^2}|z-w|$$

Vậy $\mathcal{F}$ equicontinuous trên $K$.

*Bước 2 (Arzelà–Ascoli + diagonal).* Chọn $\{w_j\}$ đếm được dày trong $\Omega$. Với dãy $\{f_n\}$, dùng đường chéo Cantor: chọn dãy con $\{f_{n_k}\}$ hội tụ tại mọi $w_j$. Equicontinuity đảm bảo hội tụ đồng đều trên mọi compact. $\blacksquare$

> [!abstract] Corollary 12.4 — Định lý Hurwitz (Hurwitz's Theorem)
> Nếu $f_n \to f$ đồng đều trên compact, $f_n$ không triệt tiêu trên $\Omega$ và $f \not\equiv 0$, thì $f$ không triệt tiêu trên $\Omega$.

**Proof.** Nếu $f(z_0) = 0$, dùng Rouché cho đường tròn nhỏ quanh $z_0$: $f_n$ phải có điểm không gần $z_0$, mâu thuẫn. $\blacksquare$

---

## Định Lý Ánh Xạ Riemann (Riemann Mapping Theorem)

> [!abstract] Theorem 12.5 — Định lý Ánh xạ Riemann (Riemann Mapping Theorem)
> Mọi miền đơn liên thực sự $\Omega \subsetneq \mathbb{C}$ đều biholomorphic với đĩa đơn vị $D(0,1)$.
>
> Cụ thể hơn: với $z_0 \in \Omega$ bất kỳ, tồn tại duy nhất biholomorphism $f: \Omega \to D(0,1)$ thỏa $f(z_0) = 0$ và $f'(z_0) > 0$.

**Proof.** Xem chứng minh đầy đủ tại [[a1-riemann-mapping-theorem|A1. Riemann Mapping Theorem]].

Phác thảo ý tưởng chính:

*Bước 1: $\mathcal{F}$ không rỗng.* Vì $\Omega \neq \mathbb{C}$, chọn $a \in \mathbb{C} \setminus \Omega$. Hàm $z - a$ không triệt tiêu trên $\Omega$ đơn liên, nên có căn bậc hai holomorphic $h$ với $h^2 = z-a$. $h$ đơn ánh (nếu $h(z_1) = h(z_2)$ thì $z_1 = z_2$) và $h(\Omega)$ chứa đĩa $D(h(z_0), \delta)$ nhưng $h(\Omega) \cap D(-h(z_0), \delta) = \emptyset$. Biến đổi phù hợp cho $f_0 \in \mathcal{F}$.

*Bước 2: Tồn tại cực trị.* Gọi:

$$\mathcal{F} = \{f \in \mathcal{O}(\Omega) : f \text{ đơn ánh}, f(\Omega) \subset D(0,1), f(z_0) = 0\}$$

$M = \sup_{f \in \mathcal{F}} |f'(z_0)| > 0$. Vì $\mathcal{F}$ bị chặn cục bộ (bởi $1$), Montel cho dãy con $f_{n_k} \to f$ đồng đều trên compact. Vì $|f'_{n_k}(z_0)| \to M$, $f \in \mathcal{F}$ (dùng Hurwitz để bảo toàn đơn ánh) và $|f'(z_0)| = M$.

*Bước 3: $f$ là biholomorphism.* Giả sử $f(\Omega) \subsetneq D(0,1)$. Chọn $w \in D(0,1) \setminus f(\Omega)$ và xây dựng $g \in \mathcal{F}$ với $|g'(z_0)| > M$ — mâu thuẫn. Vậy $f$ là surjection. $\blacksquare$

---

## Tính Duy Nhất và Chuẩn Hóa

> [!abstract] Theorem 12.6 — Tính duy nhất với chuẩn hóa
> Biholomorphism $f: \Omega \to D(0,1)$ với $f(z_0) = 0$ và $f'(z_0) > 0$ là **duy nhất**.

**Proof.** Nếu $f, g$ đều thỏa, thì $h = g \circ f^{-1}: D(0,1) \to D(0,1)$ với $h(0) = 0$, $h'(0) > 0$. Theo Schwarz lemma: $h(z) = e^{i\theta}z$. Vì $h'(0) > 0$: $e^{i\theta} = 1$, suy ra $h = \text{id}$, tức $g = f$. $\blacksquare$

> [!note] Remark 12.7 — Ba bậc tự do
> Biholomorphism $\Omega \to D(0,1)$ có đúng 3 bậc tự do thực (xác định bởi ảnh của một điểm và hướng của đạo hàm). Chuẩn hóa $f(z_0) = 0, f'(z_0) > 0$ loại bỏ hết.

---

## Hệ Quả Và Mở Rộng

> [!abstract] Corollary 12.8 — Phân loại các miền đơn liên
> Có đúng ba lớp miền đơn liên không đẳng cấu bảo giác:
>
> 1. $\hat{\mathbb{C}}$ (cầu Riemann)
> 2. $\mathbb{C}$ (mặt phẳng phức)
> 3. $D(0,1)$ (đĩa đơn vị)
>
> Mọi miền đơn liên đều thuộc đúng một trong ba lớp này (Định lý Uniformization).

**Proof phân biệt.**
- $\hat{\mathbb{C}} \not\cong \mathbb{C}$: $\hat{\mathbb{C}}$ compact, $\mathbb{C}$ không.
- $\mathbb{C} \not\cong D$: ánh xạ $\mathbb{C} \to D$ entire bị chặn, Liouville: hằng số.
- $D \not\cong \hat{\mathbb{C}}$: $D$ không compact. $\blacksquare$

> [!abstract] Corollary 12.9 — Tính tương đương bảo giác
> Hai miền đơn liên thực sự $\Omega_1, \Omega_2 \subsetneq \mathbb{C}$ luôn biholomorphic với nhau (thông qua $D(0,1)$).

> [!example] Example 12.10 — Áp dụng
> Các miền sau đây đều biholomorphic với $D(0,1)$:
>
> - Nửa mặt phẳng trên $\mathbb{H} = \{\operatorname{Im}(z) > 0\}$ — qua Cayley map.
> - Dải $\{0 < \operatorname{Im}(z) < 1\}$ — qua $z \mapsto e^{i\pi z}$ rồi Cayley.
> - Nội phần hình vuông $(0,1)^2$ — biholomorphic với $D$ (Riemann), nhưng không có công thức tường minh đơn giản.
> - Tam giác đều — qua Schwarz–Christoffel formula.

> [!note] Remark 12.11 — Hạn chế của định lý
> Định lý Riemann **không** áp dụng cho $\Omega = \mathbb{C}$ (toàn mặt phẳng) hay $\Omega = \hat{\mathbb{C}}$. Ngoài ra trong nhiều biến phức (Several Complex Variables), định lý tương tự hoàn toàn **sai**: đĩa đơn vị và polydisk trong $\mathbb{C}^n$ ($n \geq 2$) không biholomorphic dù cùng đơn liên!

---

## Định Lý Schwarz–Christoffel (Schwarz–Christoffel Formula)

> [!abstract] Theorem 12.12 — Công thức Schwarz–Christoffel
> Ánh xạ bảo giác từ $\mathbb{H}$ lên nội phần đa giác với góc $\alpha_k\pi$ tại các đỉnh $w_k$ ($k = 1, \ldots, n$) được cho bởi:
>
> $$f(z) = C\int_0^z \prod_{k=1}^n (t - x_k)^{\alpha_k - 1}\,dt + C'$$
>
> trong đó $x_1 < x_2 < \cdots < x_n$ là nghịch ảnh của các đỉnh trên $\mathbb{R}$.

> [!example] Example 12.13 — Ánh xạ lên nửa dải
> Biến đổi $f(z) = \arcsin(z)$ biến $D(0,1)$ lên nửa dải $\{-\pi/2 < \operatorname{Re}(w) < \pi/2, \operatorname{Im}(w) > 0\}$.

---

## SageMath Cheatsheet

```python
# Minh họa Định lý Riemann: ánh xạ nửa mặt phẳng lên đĩa
import numpy as np
import matplotlib.pyplot as plt

# Cayley map: H -> D, z -> (z-i)/(z+i)
cayley = lambda z: (z - 1j) / (z + 1j)
cayley_inv = lambda w: 1j * (1 + w) / (1 - w)  # D -> H

# Vẽ lưới trong H và ảnh trong D
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Lưới ngang (Im=const) và dọc (Re=const) trong H
for y in [0.5, 1, 2, 3]:
    x = np.linspace(-4, 4, 300)
    z = x + 1j*y
    w = cayley(z)
    axes[0].plot(x, y*np.ones_like(x), 'b-', alpha=0.5)
    axes[1].plot(w.real, w.imag, 'b-', alpha=0.5)

for x in [-3, -2, -1, 0, 1, 2, 3]:
    y = np.linspace(0.1, 5, 300)
    z = x + 1j*y
    w = cayley(z)
    axes[0].plot(x*np.ones_like(y), y, 'r-', alpha=0.5)
    axes[1].plot(w.real, w.imag, 'r-', alpha=0.5)

# Vòng tròn đơn vị
theta = np.linspace(0, 2*np.pi, 200)
axes[1].plot(np.cos(theta), np.sin(theta), 'k-', linewidth=2)

axes[0].set_xlim(-4, 4); axes[0].set_ylim(0, 4)
axes[0].set_title('Lưới trong $\\mathbb{H}$ (nửa mặt phẳng trên)')
axes[1].set_xlim(-1.2, 1.2); axes[1].set_ylim(-1.2, 1.2)
axes[1].set_title('Ảnh trong $D(0,1)$ qua Cayley map')
axes[1].set_aspect('equal')
plt.tight_layout()
plt.show()

# Kiểm tra Montel: họ bị chặn sinh dãy con hội tụ
# Xấp xỉ cực trị của |f'(z_0)| trên họ F
from scipy.optimize import minimize_scalar

def find_riemann_map_approx(Omega_sample_fn, z0=0):
    """
    Xấp xỉ giá trị |f'(z0)| tối ưu cho ánh xạ Riemann.
    Omega_sample_fn(z): True nếu z thuộc Omega.
    """
    # Ví dụ đơn giản: Omega = H (nửa mặt phẳng trên)
    # Biholomorphism: Cayley map
    dz = 1e-7
    f = cayley
    deriv_at_z0 = (f(z0 + dz) - f(z0 - dz)) / (2*dz)
    return abs(deriv_at_z0)

z0 = 1j  # điểm cơ sở trong H
print(f"|f'(z0)| tại z0=i qua Cayley: {find_riemann_map_approx(None, z0):.6f}")
# Công thức: f(z) = (z-i)/(z+i), f'(i) = 2i/(2i)^2 * ... = 1/(2i) * ... = -i/2
f_prime_exact = -1j / (z0 + 1j)**2 * (-1)
print(f"|f'(i)| chính xác: {abs(-2j/(1j+1j)**2):.6f}")
```

---

## Summary / Key Takeaways

- **Họ chuẩn tắc** (normal family): mọi dãy có dãy con hội tụ đồng đều trên compact.
- **Định lý Montel**: họ bị chặn cục bộ $\Rightarrow$ chuẩn tắc (dùng Cauchy + Arzelà–Ascoli).
- **Hurwitz**: giới hạn đồng đều của hàm không triệt tiêu hoặc không triệt tiêu hoặc hằng $0$.
- **Định lý Riemann**: $\Omega \subsetneq \mathbb{C}$ đơn liên $\Rightarrow$ biholomorphic với $D(0,1)$.
- **Chứng minh**: cực trị $|f'(z_0)|$ trong họ $\mathcal{F}$ bị chặn → dùng Montel → cực trị là biholomorphism.
- **Duy nhất**: với chuẩn hóa $f(z_0) = 0$, $f'(z_0) > 0$ → duy nhất.
- Ba lớp miền đơn liên: $\hat{\mathbb{C}}$, $\mathbb{C}$, $D$ — không đẳng cấu bảo giác với nhau.
- **Schwarz–Christoffel**: công thức tường minh cho ánh xạ lên đa giác.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 6.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 8.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 7.
- Xem chứng minh đầy đủ tại [[a1-riemann-mapping-theorem|A1. Riemann Mapping Theorem]].
