---
title: "03. Holomorphic Functions and Cauchy–Riemann Equations"
tags: [math, complex-analysis, lesson-03]
aliases: [Holomorphic Functions and Cauchy-Riemann Equations]
created: 2026-03-31
---

> **Prerequisites**: [[01-complex-numbers|01. Complex Numbers and the Complex Plane]], [[02-topology-complex-plane|02. Topology of the Complex Plane]]
> **Objectives**:
> - Định nghĩa đạo hàm phức và hiểu sự khác biệt với đạo hàm thực
> - Nắm vững phương trình Cauchy–Riemann như điều kiện cần và đủ cho tính holomorphic
> - Hiểu mối liên hệ giữa hàm holomorphic và hàm điều hòa
> - Nhận diện các ví dụ điển hình của hàm holomorphic và không holomorphic

---

## Motivation / Intuition

Trong giải tích thực, hàm $f: \mathbb{R} \to \mathbb{R}$ khả vi tại $x_0$ nếu tồn tại giới hạn $\lim_{h \to 0} \frac{f(x_0+h) - f(x_0)}{h}$. Định nghĩa này mang sang $\mathbb{C}$ một cách tự nhiên — nhưng với một khác biệt then chốt: $h \in \mathbb{C}$ có thể tiến về $0$ theo **mọi hướng** trong mặt phẳng phức.

Điều kiện để giới hạn này tồn tại bất kể hướng tiếp cận chính là **phương trình Cauchy–Riemann**. Đây là điều kiện **mạnh hơn rất nhiều** so với khả vi thực: hàm phức khả vi thực chất "cứng nhắc" đến mức chỉ cần biết giá trị trên một đường cong nhỏ đã xác định được toàn bộ hàm — tính chất gọi là **holomorphic** hay **analytic**.

---

## Đạo Hàm Phức (Complex Derivative)

### Definition

> [!info] Definition 3.1 — Đạo hàm phức
> Cho $\Omega \subseteq \mathbb{C}$ mở và $f: \Omega \to \mathbb{C}$. Hàm $f$ **phức khả vi** (complex differentiable) tại $z_0 \in \Omega$ nếu tồn tại giới hạn:
>
> $$f'(z_0) = \lim_{h \to 0} \frac{f(z_0 + h) - f(z_0)}{h}, \quad h \in \mathbb{C}, h \neq 0$$
>
> Khi tồn tại, $f'(z_0)$ gọi là **đạo hàm phức** của $f$ tại $z_0$.

> [!info] Definition 3.2 — Hàm holomorphic
> - $f$ **holomorphic** tại $z_0$ nếu $f$ phức khả vi trên một lân cận của $z_0$.
> - $f$ **holomorphic trên** $\Omega$ (ký hiệu $f \in \mathcal{O}(\Omega)$) nếu $f$ holomorphic tại mọi điểm của $\Omega$.
> - $f$ **entire** nếu $f$ holomorphic trên toàn bộ $\mathbb{C}$.

> [!note] Remark 3.3 — Holomorphic vs Analytic
> Trong phân tích phức, "holomorphic" và "analytic" đồng nghĩa — cả hai đều chỉ hàm có thể khai triển thành chuỗi lũy thừa hội tụ cục bộ. Điều này **không** hiển nhiên và sẽ được chứng minh sau (Bài 06–07).

### Các quy tắc tính đạo hàm

> [!abstract] Theorem 3.4 — Các quy tắc đạo hàm
> Nếu $f, g$ holomorphic trên $\Omega$ thì:
>
> $$(f + g)' = f' + g', \quad (fg)' = f'g + fg', \quad \left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2} \quad (g \neq 0)$$
>
> Nếu $f: \Omega \to \mathbb{C}$ và $g: f(\Omega) \to \mathbb{C}$ holomorphic, thì $(g \circ f)' = (g' \circ f) \cdot f'$ (quy tắc dây chuyền).

> [!example] Example 3.5 — Đạo hàm của hàm đa thức
> Hàm $f(z) = z^n$ ($n \in \mathbb{N}$) holomorphic trên $\mathbb{C}$ với $f'(z) = nz^{n-1}$:
>
> $$\lim_{h \to 0} \frac{(z+h)^n - z^n}{h} = \lim_{h \to 0} \left(nz^{n-1} + \binom{n}{2}z^{n-2}h + \cdots + h^{n-1}\right) = nz^{n-1}$$

> [!warning] Counterexample 3.6 — Hàm $f(z) = \bar{z}$ không holomorphic
> Xét $f(z) = \bar{z} = x - iy$ (với $z = x + iy$). Tính giới hạn theo hai hướng:
>
> - Theo hướng thực ($h = t \in \mathbb{R}$): $\lim_{t \to 0} \frac{\overline{z+t} - \bar{z}}{t} = \lim_{t\to 0}\frac{t}{t} = 1$
> - Theo hướng ảo ($h = it$, $t \in \mathbb{R}$): $\lim_{t \to 0} \frac{\overline{z+it} - \bar{z}}{it} = \lim_{t\to 0}\frac{-it}{it} = -1$
>
> Hai giới hạn khác nhau, nên $f(z) = \bar{z}$ **không** phức khả vi tại bất kỳ điểm nào.

---

## Phương Trình Cauchy–Riemann

### Definition và Định lý

Viết $f = u + iv$ với $u = \operatorname{Re}(f)$, $v = \operatorname{Im}(f)$ là các hàm thực.

> [!abstract] Theorem 3.7 — Phương trình Cauchy–Riemann (Cauchy–Riemann Equations)
> Cho $f = u + iv: \Omega \to \mathbb{C}$. Nếu $f$ phức khả vi tại $z_0 = x_0 + iy_0$, thì các đạo hàm riêng của $u$ và $v$ tồn tại tại $(x_0, y_0)$ và thỏa mãn **phương trình Cauchy–Riemann (CR)**:
>
> $$\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$$
>
> Hơn nữa, $f'(z_0) = \frac{\partial u}{\partial x}(z_0) + i\frac{\partial v}{\partial x}(z_0)$.

**Proof.** Vì $f'(z_0)$ tồn tại, giới hạn bằng nhau theo mọi hướng:

*Hướng thực* ($h = \Delta x$):
$$f'(z_0) = \lim_{\Delta x \to 0}\frac{f(z_0 + \Delta x) - f(z_0)}{\Delta x} = \frac{\partial u}{\partial x} + i\frac{\partial v}{\partial x}$$

*Hướng ảo* ($h = i\Delta y$):
$$f'(z_0) = \lim_{\Delta y \to 0}\frac{f(z_0 + i\Delta y) - f(z_0)}{i\Delta y} = \frac{1}{i}\frac{\partial u}{\partial y} + \frac{\partial v}{\partial y} = \frac{\partial v}{\partial y} - i\frac{\partial u}{\partial y}$$

Đồng nhất phần thực và phần ảo: $\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}$ và $\frac{\partial v}{\partial x} = -\frac{\partial u}{\partial y}$. $\blacksquare$

> [!abstract] Theorem 3.8 — Điều kiện đủ cho holomorphic
> Nếu $u, v: \Omega \to \mathbb{R}$ có đạo hàm riêng **liên tục** trên $\Omega$ và thỏa mãn phương trình CR, thì $f = u + iv$ holomorphic trên $\Omega$.

**Proof (phác thảo).** Từ tính khả vi hoàn toàn (total differentiability) của $u, v$ (được đảm bảo bởi đạo hàm riêng liên tục):

$$f(z_0 + h) - f(z_0) = \left(\frac{\partial u}{\partial x} + i\frac{\partial v}{\partial x}\right)h + o(|h|)$$

khi $h \to 0$. Dùng phương trình CR để xác nhận biểu thức này có dạng $\alpha h + o(|h|)$, suy ra $f'(z_0) = \alpha$ tồn tại. $\blacksquare$

### Ký hiệu Wirtinger

> [!info] Definition 3.9 — Đạo hàm Wirtinger
> Định nghĩa các toán tử vi phân:
>
> $$\frac{\partial}{\partial z} = \frac{1}{2}\left(\frac{\partial}{\partial x} - i\frac{\partial}{\partial y}\right), \qquad \frac{\partial}{\partial \bar{z}} = \frac{1}{2}\left(\frac{\partial}{\partial x} + i\frac{\partial}{\partial y}\right)$$
>
> Phương trình CR tương đương với:
>
> $$\frac{\partial f}{\partial \bar{z}} = 0$$

Đây là cách viết gọn và cực kỳ hữu ích: hàm holomorphic chính xác là các hàm "không phụ thuộc vào $\bar{z}$".

> [!example] Example 3.10 — Kiểm tra phương trình CR
> Cho $f(z) = z^2 = (x+iy)^2 = (x^2 - y^2) + 2xyi$.
>
> Ta có $u = x^2 - y^2$, $v = 2xy$. Kiểm tra:
>
> $$\frac{\partial u}{\partial x} = 2x = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -2y = -\frac{\partial v}{\partial x} = -2x \cdot \Big|_{...}$$
>
> Cụ thể: $\frac{\partial u}{\partial y} = -2y$ và $-\frac{\partial v}{\partial x} = -2y$. ✓
>
> Vậy $f(z) = z^2$ thỏa CR và holomorphic, với $f'(z) = 2x + 2yi = 2(x+iy) = 2z$.

> [!example] Example 3.11 — $f(z) = |z|^2$ không holomorphic
> $f(z) = |z|^2 = x^2 + y^2$, nên $u = x^2 + y^2$, $v = 0$.
>
> $\frac{\partial u}{\partial x} = 2x$ và $\frac{\partial v}{\partial y} = 0$. Phương trình CR đòi hỏi $2x = 0$, chỉ đúng khi $x = 0$.
>
> Vậy $f(z) = |z|^2$ chỉ phức khả vi tại $z = 0$ (và tại đó $f'(0) = 0$), nhưng **không** holomorphic ở bất kỳ đâu.

---

## Hàm Điều Hòa (Harmonic Functions)

### Definition

> [!info] Definition 3.12 — Hàm điều hòa (Harmonic Function)
> Hàm $u: \Omega \to \mathbb{R}$ là **điều hòa** (harmonic) nếu $u \in C^2(\Omega)$ và thỏa toán tử Laplace:
>
> $$\Delta u = \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} = 0$$

> [!abstract] Theorem 3.13 — Liên hệ với hàm holomorphic
> Nếu $f = u + iv$ holomorphic trên $\Omega$, thì cả $u$ và $v$ đều điều hòa trên $\Omega$.

**Proof.** Từ phương trình CR:

$$\frac{\partial^2 u}{\partial x^2} = \frac{\partial}{\partial x}\left(\frac{\partial v}{\partial y}\right) = \frac{\partial^2 v}{\partial x \partial y}$$

$$\frac{\partial^2 u}{\partial y^2} = \frac{\partial}{\partial y}\left(-\frac{\partial v}{\partial x}\right) = -\frac{\partial^2 v}{\partial y \partial x}$$

Cộng lại: $\Delta u = \frac{\partial^2 v}{\partial x\partial y} - \frac{\partial^2 v}{\partial y\partial x} = 0$ (bởi $C^2$ đảm bảo đổi thứ tự đạo hàm). $\blacksquare$

### Definition

> [!info] Definition 3.14 — Liên hợp điều hòa (Harmonic Conjugate)
> Cho $u$ điều hòa trên miền đơn liên $\Omega$. Hàm $v$ điều hòa trên $\Omega$ thỏa phương trình CR cùng $u$ được gọi là **liên hợp điều hòa** (harmonic conjugate) của $u$.

> [!abstract] Theorem 3.15 — Tồn tại liên hợp điều hòa
> Trên miền đơn liên $\Omega$, mọi hàm điều hòa $u$ đều có liên hợp điều hòa $v$ (duy nhất sai khác hằng số), và $f = u + iv$ holomorphic trên $\Omega$.

> [!example] Example 3.16 — Tìm liên hợp điều hòa
> Cho $u(x,y) = x^2 - y^2$ (phần thực của $z^2$). Tìm $v$:
>
> Từ CR: $\frac{\partial v}{\partial y} = \frac{\partial u}{\partial x} = 2x$, suy ra $v = 2xy + \varphi(x)$.
>
> Kiểm tra: $\frac{\partial v}{\partial x} = 2y + \varphi'(x)$ phải bằng $-\frac{\partial u}{\partial y} = 2y$, nên $\varphi'(x) = 0$, tức $\varphi = C$.
>
> Vậy $v(x,y) = 2xy + C$, và $f = (x^2-y^2) + 2xyi = z^2$. ✓

> [!warning] Counterexample 3.17 — Đơn liên là cần thiết
> Hàm $u(x,y) = \ln\sqrt{x^2+y^2} = \ln|z|$ là điều hòa trên $\mathbb{C} \setminus \{0\}$ (kiểm tra: $\Delta(\ln r) = 0$). Nhưng $\mathbb{C} \setminus \{0\}$ **không** đơn liên, và $u$ **không** có liên hợp điều hòa toàn cục trên $\mathbb{C} \setminus \{0\}$ vì $\log z$ là hàm đa trị.

---

## Diễn giải Hình Học của $f'(z)$

> [!tip] Key Insight 3.18 — Ý nghĩa hình học của đạo hàm phức
> Nếu $f$ holomorphic tại $z_0$ với $f'(z_0) \neq 0$, thì gần $z_0$:
>
> $$f(z_0 + h) \approx f(z_0) + f'(z_0) \cdot h$$
>
> Nhân với $f'(z_0) = |f'(z_0)|e^{i\arg f'(z_0)}$ là phép **quay một góc** $\arg f'(z_0)$ và **co giãn tỉ lệ** $|f'(z_0)|$. Do đó, $f$ bảo toàn góc giữa các đường cong (tính **bảo giác** / conformal) tại mọi điểm mà $f'(z_0) \neq 0$.

---

## SageMath Cheatsheet

```python
# Kiểm tra phương trình CR bằng SageMath
var('x y')
u = x^2 - y^2       # phần thực
v = 2*x*y            # phần ảo

# Kiểm tra CR
CR1 = diff(u, x) - diff(v, y)   # phải = 0
CR2 = diff(u, y) + diff(v, x)   # phải = 0
print("CR1 =", CR1, "| CR2 =", CR2)

# Kiểm tra Laplace
laplace_u = diff(u, x, 2) + diff(u, y, 2)
laplace_v = diff(v, x, 2) + diff(v, y, 2)
print("Δu =", laplace_u, "| Δv =", laplace_v)

# Đạo hàm phức tượng trưng
z = var('z')
f = z^2
diff(f, z)    # 2*z

# Ví dụ: f(z) = |z|^2 = z * conjugate(z)
# Kiểm tra CR cho |z|^2
u2 = x^2 + y^2   # |z|^2
v2 = 0
CR1_2 = diff(u2, x) - diff(v2, y)   # = 2x ≠ 0 trừ x=0
print("CR1 cho |z|^2:", CR1_2)
```

---

## Summary / Key Takeaways

- Đạo hàm phức: giới hạn sai phân phải tồn tại **theo mọi hướng** trong $\mathbb{C}$.
- Phương trình Cauchy–Riemann ($u_x = v_y$, $u_y = -v_x$) là điều kiện **cần** cho phức khả vi; cộng thêm đạo hàm riêng liên tục thì là điều kiện **đủ** cho holomorphic.
- Dùng Wirtinger: $f$ holomorphic $\Leftrightarrow$ $\partial f/\partial\bar{z} = 0$.
- Hàm holomorphic sinh ra các hàm điều hòa ($\Delta u = \Delta v = 0$).
- Trên miền đơn liên, mọi hàm điều hòa có liên hợp điều hòa, tạo thành hàm holomorphic.
- Hình học: $f'(z_0) \neq 0$ $\Rightarrow$ $f$ bảo toàn góc (conformal) tại $z_0$.
- $\bar{z}$ và $|z|^2$ là ví dụ tiêu biểu về hàm **không** holomorphic.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 2.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 1.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 2.
