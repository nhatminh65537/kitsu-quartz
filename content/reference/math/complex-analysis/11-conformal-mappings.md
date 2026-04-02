---
title: "11. Conformal Mappings"
tags: [math, complex-analysis, lesson-11]
aliases: [Conformal Mappings]
created: 2026-03-31
---

> **Prerequisites**: [[03-holomorphic-functions|03. Holomorphic Functions and Cauchy–Riemann Equations]], [[09-residues|09. Calculus of Residues]]
> **Objectives**:
> - Hiểu tính bảo giác (conformal) và ý nghĩa hình học
> - Nắm vững biến đổi Möbius: tính chất, phân loại, nhóm tự đẳng cấu
> - Áp dụng bổ đề Schwarz–Pick và phân loại Aut($D$), Aut($\mathbb{H}$)
> - Xây dựng các ánh xạ bảo giác quan trọng trong ứng dụng

---

## Motivation / Intuition

Ánh xạ bảo giác (conformal mapping) là ánh xạ **bảo toàn góc** — biến đổi hình học giữ nguyên góc giữa các đường cong tại mọi điểm. Hàm holomorphic với đạo hàm không triệt tiêu chính xác là ánh xạ bảo giác.

Tại sao quan trọng? Vì phương trình Laplace $\Delta u = 0$ **bất biến** qua ánh xạ bảo giác: nếu $u$ điều hòa trên $\Omega$ và $f: \tilde\Omega \to \Omega$ bảo giác, thì $u \circ f$ điều hòa trên $\tilde\Omega$. Điều này cho phép **biến đổi bài toán Dirichlet** từ miền phức tạp về miền đơn giản hơn (như đĩa).

---

## Ánh Xạ Bảo Giác (Conformal Map)

### Definition

> [!info] Definition 11.1 — Ánh xạ bảo giác
> Hàm $f: \Omega \to \mathbb{C}$ là **bảo giác** (conformal) tại $z_0$ nếu $f$ holomorphic tại $z_0$ và $f'(z_0) \neq 0$.
>
> $f$ là **ánh xạ bảo giác** (conformal map) trên $\Omega$ nếu $f$ holomorphic và $f'(z) \neq 0$ với mọi $z \in \Omega$.
>
> $f$ là **đẳng cấu bảo giác** (biholomorphism / conformal equivalence) nếu $f$ còn là song ánh.

> [!abstract] Theorem 11.2 — Bảo toàn góc
> Nếu $f$ holomorphic tại $z_0$ với $f'(z_0) \neq 0$, và $\gamma_1, \gamma_2$ là hai đường cong giao nhau tại $z_0$ với góc $\alpha$, thì $f \circ \gamma_1$ và $f \circ \gamma_2$ giao nhau tại $f(z_0)$ với cùng góc $\alpha$.

**Proof.** Tiếp tuyến của $f \circ \gamma$ tại $f(z_0)$ là $(f \circ \gamma)'(0) = f'(z_0)\cdot\gamma'(0)$. Phép nhân với $f'(z_0) = |f'(z_0)|e^{i\phi}$ (với $\phi$ cố định) xoay tất cả tiếp tuyến cùng góc $\phi$ và co giãn cùng tỉ lệ $|f'(z_0)|$, do đó bảo toàn góc giữa chúng. $\blacksquare$

> [!warning] Counterexample 11.3 — Không bảo giác tại điểm có $f'=0$
> $f(z) = z^2$ có $f'(0) = 0$. Tại $z = 0$, hai đường thẳng tạo góc $\alpha$ được biến thành hai đường tạo góc $2\alpha$ — $f$ nhân đôi góc tại $0$. Nói chung nếu $f^{(n)}(z_0) \neq 0$ và $f^{(k)}(z_0) = 0$ với $k < n$, thì $f$ nhân góc lên $n$ lần tại $z_0$.

---

## Biến Đổi Möbius (Möbius Transformations)

### Definition

> [!info] Definition 11.4 — Biến đổi Möbius (Möbius Transformation)
> **Biến đổi Möbius** (hay phân tuyến tính / linear fractional transformation):
>
> $$M(z) = \frac{az + b}{cz + d}, \quad a, b, c, d \in \mathbb{C}, \quad ad - bc \neq 0$$
>
> Coi là ánh xạ $\hat{\mathbb{C}} \to \hat{\mathbb{C}}$ với $M(-d/c) = \infty$ và $M(\infty) = a/c$.

> [!abstract] Theorem 11.5 — Tính chất cơ bản
> - Mọi biến đổi Möbius là **đẳng cấu bảo giác** của $\hat{\mathbb{C}}$.
> - Hợp của hai Möbius là Möbius; nghịch đảo của Möbius là Möbius.
> - Nhóm tất cả biến đổi Möbius đồng cấu với $PGL_2(\mathbb{C}) = GL_2(\mathbb{C})/\mathbb{C}^*$.
> - Möbius **bảo toàn đường tròn tổng quát** (đường tròn hoặc đường thẳng trong $\hat{\mathbb{C}}$).

> [!abstract] Theorem 11.6 — Xác định duy nhất bởi 3 điểm
> Biến đổi Möbius được xác định duy nhất bởi ảnh của 3 điểm phân biệt. Công thức tỉ giao (cross-ratio):
>
> $$(z_1, z_2; z_3, z_4) = \frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$$
>
> bất biến dưới mọi biến đổi Möbius.

> [!example] Example 11.7 — Biến đổi Möbius quan trọng
> - **Phép dịch**: $z \mapsto z + b$ ($a=d=1, c=0$)
> - **Phép xoay-co giãn**: $z \mapsto az$ ($b=c=0, d=1$)
> - **Nghịch đảo**: $z \mapsto 1/z$ ($a=d=0, b=c=1$)
> - **Cayley map**: $z \mapsto \frac{z-i}{z+i}$ biến nửa mặt phẳng trên $\mathbb{H}$ sang đĩa $D(0,1)$
> - **Blaschke factor**: $z \mapsto \frac{z-a}{1-\bar{a}z}$ ($|a|<1$) biến $D(0,1)$ sang $D(0,1)$, $a \mapsto 0$

---

## Nhóm Tự Đẳng Cấu (Automorphism Groups)

> [!abstract] Theorem 11.8 — Aut($\hat{\mathbb{C}}$) = Möbius transformations
> Mọi đẳng cấu bảo giác $\hat{\mathbb{C}} \to \hat{\mathbb{C}}$ là biến đổi Möbius.

**Proof.** Hàm meromorphic song ánh trên $\hat{\mathbb{C}}$ là hàm hữu tỉ. Điều kiện song ánh buộc bậc bằng $1$, tức là $az+b/cz+d$. $\blacksquare$

> [!abstract] Theorem 11.9 — Aut($D$) — Automorphisms of the Unit Disk
> Mọi đẳng cấu bảo giác $D(0,1) \to D(0,1)$ có dạng:
>
> $$f(z) = e^{i\theta}\frac{z - a}{1 - \bar{a}z}, \quad \theta \in \mathbb{R}, \quad a \in D(0,1)$$
>
> Trong đó $e^{i\theta}$ là phép quay và $\varphi_a(z) = \frac{z-a}{1-\bar{a}z}$ là **Blaschke factor**.

**Proof.** Cho $f \in \text{Aut}(D)$ với $f(a) = 0$. Xét $g = f \circ \varphi_a^{-1}$: $g \in \text{Aut}(D)$ với $g(0) = 0$. Bổ đề Schwarz: $|g(z)| \leq |z|$. Áp dụng cho $g^{-1}$: $|z| = |g^{-1}(g(z))| \leq |g(z)|$. Suy ra $|g(z)| = |z|$, tức $g(z) = e^{i\theta}z$. Vậy $f = e^{i\theta}\varphi_a$. $\blacksquare$

> [!abstract] Theorem 11.10 — Aut($\mathbb{H}$) — Automorphisms of Upper Half-plane
> Mọi đẳng cấu bảo giác của nửa mặt phẳng trên $\mathbb{H} = \{z : \operatorname{Im}(z) > 0\}$ có dạng:
>
> $$f(z) = \frac{az + b}{cz + d}, \quad a, b, c, d \in \mathbb{R}, \quad ad - bc > 0$$
>
> Nhóm này đồng cấu với $PSL_2(\mathbb{R}) = SL_2(\mathbb{R})/\{\pm I\}$.

---

## Bổ Đề Schwarz–Pick

> [!abstract] Theorem 11.11 — Bổ đề Schwarz–Pick (Schwarz–Pick Lemma)
> Cho $f: D(0,1) \to D(0,1)$ holomorphic. Thì với mọi $z_1, z_2 \in D(0,1)$:
>
> $$\left|\frac{f(z_1) - f(z_2)}{1 - \overline{f(z_1)}f(z_2)}\right| \leq \left|\frac{z_1 - z_2}{1 - \bar{z}_1 z_2}\right|$$
>
> và:
>
> $$\frac{|f'(z)|}{1 - |f(z)|^2} \leq \frac{1}{1 - |z|^2}$$
>
> Đẳng thức xảy ra khi và chỉ khi $f \in \text{Aut}(D)$.

**Proof.** Cố định $z_1$, đặt $w_1 = f(z_1)$. Xét $g = \varphi_{w_1} \circ f \circ \varphi_{z_1}^{-1}$: $g: D \to D$ với $g(0) = 0$. Schwarz lemma: $|g(z)| \leq |z|$. Thay $z = \varphi_{z_1}(z_2)$:

$$\left|\varphi_{w_1}(f(z_2))\right| \leq |\varphi_{z_1}(z_2)|$$

Viết lại cho kết quả. $\blacksquare$

> [!tip] Key Insight 11.12 — Hình học Poincaré
> Schwarz–Pick phát biểu: hàm holomorphic $D \to D$ là **co** (contraction) theo **metric Poincaré** (hyperbolic metric):
>
> $$d_{\text{Poincaré}}(z_1, z_2) = \tanh^{-1}\left|\frac{z_1 - z_2}{1 - \bar{z}_1 z_2}\right|$$
>
> Đây là kết nối sâu giữa phân tích phức và hình học hyperbolic (Poincaré disk model).

---

## Các Ánh Xạ Bảo Giác Cụ Thể

> [!example] Example 11.13 — Bộ từ điển ánh xạ quan trọng
>
> | Miền nguồn | Miền đích | Ánh xạ |
> |-----------|-----------|---------|
> | $D(0,1)$ | $\mathbb{H}$ (nửa mặt phẳng trên) | $z \mapsto i\frac{1+z}{1-z}$ (Cayley ngược) |
> | $\mathbb{H}$ | $D(0,1)$ | $z \mapsto \frac{z-i}{z+i}$ (Cayley map) |
> | Dải $0 < \operatorname{Im}(z) < \pi$ | $\mathbb{H}$ | $z \mapsto e^z$ |
> | Góc phần tư $\{x>0, y>0\}$ | $\mathbb{H}$ | $z \mapsto z^2$ |
> | Sector $\{0<\arg z<\alpha\}$ | $\mathbb{H}$ | $z \mapsto z^{\pi/\alpha}$ |

> [!example] Example 11.14 — Ánh xạ nửa mặt phẳng lên đĩa
> Cayley map $\phi(z) = \frac{z-i}{z+i}$ biến:
> - $\mathbb{H} \to D(0,1)$ (biholomorphism)
> - $\mathbb{R} \to \partial D(0,1)$ (biên sang biên)
> - $i \mapsto 0$, $0 \mapsto -1$, $\infty \mapsto 1$
>
> Đây là ví dụ cụ thể của Định lý Ánh xạ Riemann (Bài 12).

> [!abstract] Theorem 11.15 — Hàm điều hòa bất biến dưới ánh xạ bảo giác
> Nếu $u$ điều hòa trên $\Omega$ và $f: \tilde\Omega \to \Omega$ holomorphic, thì $u \circ f$ điều hòa trên $\tilde\Omega$.

**Proof.** $u \circ f = \operatorname{Re}(F \circ f)$ với $F$ holomorphic thỏa $\operatorname{Re}(F) = u$. Hợp của hai hàm holomorphic là holomorphic, nên $F \circ f$ holomorphic và $u \circ f = \operatorname{Re}(F \circ f)$ điều hòa. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Biến đổi Möbius và ánh xạ bảo giác
import numpy as np
import matplotlib.pyplot as plt

def mobius(a, b, c, d):
    """Trả về hàm biến đổi Möbius M(z) = (az+b)/(cz+d)"""
    return lambda z: (a*z + b) / (c*z + d)

# Cayley map: H -> D
cayley = mobius(1, -1j, 1, 1j)   # (z-i)/(z+i)

# Kiểm tra: i -> 0, 0 -> -1, R -> unit circle
print(f"cayley(1j) = {cayley(1j):.4f}")   # ≈ 0
print(f"cayley(0)  = {cayley(0):.4f}")    # -1.0
print(f"|cayley(2)| = {abs(cayley(2)):.4f}")  # ≈ 1 (trên biên)

# Blaschke factor phi_a
def blaschke(a):
    """phi_a(z) = (z-a)/(1-conj(a)*z) : Aut(D)"""
    return lambda z: (z - a) / (1 - np.conj(a)*z)

# Kiểm tra: phi_a(a) = 0 và |phi_a(z)| = 1 khi |z| = 1
a = 0.3 + 0.4j
phi = blaschke(a)
print(f"phi_a(a) = {phi(a):.6f}")        # ≈ 0
z_boundary = np.exp(1j * np.pi/3)
print(f"|phi_a(e^{i pi/3})| = {abs(phi(z_boundary)):.6f}")  # ≈ 1

# Vẽ ảnh lưới dưới Möbius
theta = np.linspace(0, 2*np.pi, 100)
r_vals = [0.3, 0.6, 0.9]
colors = ['b', 'g', 'r']

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
f_map = cayley

for r, col in zip(r_vals, colors):
    z_circle = r * np.exp(1j*theta)
    w_circle = f_map(z_circle)
    axes[0].plot(z_circle.real, z_circle.imag, col)
    axes[1].plot(w_circle.real, w_circle.imag, col)

axes[0].set_title('Miền nguồn $\\mathbb{H}$ (nửa mặt phẳng)')
axes[1].set_title('Miền đích $D(0,1)$ (qua Cayley)')
for ax in axes:
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Schwarz-Pick: kiểm tra bất đẳng thức
def poincare_dist(z1, z2):
    """Khoảng cách Poincaré"""
    return np.arctanh(abs((z1-z2)/(1-np.conj(z1)*z2)))

# f(z) = z^2/2: D -> D (không là automorphism)
f_sq = lambda z: z**2 / 2
z1, z2 = 0.3+0.1j, 0.1+0.3j
lhs = poincare_dist(f_sq(z1), f_sq(z2))
rhs = poincare_dist(z1, z2)
print(f"Schwarz-Pick: d(f(z1),f(z2)) = {lhs:.4f} ≤ d(z1,z2) = {rhs:.4f}  →  {lhs <= rhs}")
```

---

## Summary / Key Takeaways

- Holomorphic với $f' \neq 0$ $\Leftrightarrow$ ánh xạ bảo giác (conformal): bảo toàn góc và hướng.
- **Möbius transformation** $\frac{az+b}{cz+d}$: đẳng cấu bảo giác $\hat{\mathbb{C}} \to \hat{\mathbb{C}}$, bảo toàn đường tròn tổng quát.
- **Cross-ratio** $(z_1,z_2;z_3,z_4)$ bất biến dưới Möbius; xác định duy nhất Möbius bởi 3 điểm.
- **Aut($D$)**: $e^{i\theta}\frac{z-a}{1-\bar{a}z}$, nhóm đẳng cấu với $PSU(1,1)$.
- **Aut($\mathbb{H}$)**: $\frac{az+b}{cz+d}$ với $a,b,c,d\in\mathbb{R}$, $ad-bc>0$, tương đương $PSL_2(\mathbb{R})$.
- **Schwarz–Pick**: ánh xạ holomorphic $D\to D$ là co theo metric Poincaré.
- Hàm điều hòa bất biến qua ánh xạ bảo giác → biến đổi bài toán Dirichlet về miền đơn giản.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapters 3–4.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 8.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 6.
- Tao, T. *246A Notes 5: Conformal mapping* (2016), available at terrytao.wordpress.com.
