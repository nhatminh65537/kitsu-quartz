---
title: "01. Complex Numbers and the Complex Plane"
tags: [math, complex-analysis, lesson-01]
aliases: [Complex Numbers and the Complex Plane]
created: 2026-03-31
---

> **Prerequisites**: Giải tích thực cơ bản, đại số tuyến tính
> **Objectives**:
> - Hiểu cấu trúc trường của số phức và các phép toán cơ bản
> - Làm quen với biểu diễn cực và công thức Euler
> - Nắm vững bất đẳng thức tam giác và module
> - Hiểu trực giác hình học qua mặt phẳng phức và cầu Riemann

---

## Motivation / Intuition

Số phức xuất hiện từ nhu cầu giải phương trình đa thức. Phương trình $x^2 + 1 = 0$ không có nghiệm thực, nhưng nếu ta mở rộng $\mathbb{R}$ bằng cách thêm một phần tử $i$ với tính chất $i^2 = -1$, ta thu được hệ số phức $\mathbb{C}$.

Điều kỳ diệu là phần mở rộng này **đủ để giải mọi phương trình đa thức** — đây chính là nội dung của Định lý Cơ bản Đại số. Hơn nữa, $\mathbb{C}$ không chỉ là một trường đại số mà còn mang cấu trúc giải tích cực kỳ phong phú: các hàm phức khả vi (holomorphic) có tính chất đẹp hơn rất nhiều so với các hàm thực tương ứng.

Về mặt hình học, $\mathbb{C}$ đồng nhất với mặt phẳng $\mathbb{R}^2$, cho phép ta trực quan hóa các phép toán phức bằng hình học phẳng. Đây là điểm xuất phát của toàn bộ môn Phân tích Phức.

---

## Số Phức (Complex Numbers)

### Definition

> [!info] Definition 1.1 — Số phức (Complex Number)
> Tập **số phức** là tập
>
> $$\mathbb{C} = \{a + bi \mid a, b \in \mathbb{R}\}$$
>
> trong đó $i$ là **đơn vị ảo** (imaginary unit) thỏa mãn $i^2 = -1$. Với $z = a + bi$:
> - $\operatorname{Re}(z) = a$ là **phần thực** (real part)
> - $\operatorname{Im}(z) = b$ là **phần ảo** (imaginary part)

Hai số phức $z_1 = a_1 + b_1 i$ và $z_2 = a_2 + b_2 i$ bằng nhau khi và chỉ khi $a_1 = a_2$ và $b_1 = b_2$.

### Phép toán

Phép cộng và nhân định nghĩa như sau:

$$z_1 + z_2 = (a_1 + a_2) + (b_1 + b_2)i$$

$$z_1 \cdot z_2 = (a_1 a_2 - b_1 b_2) + (a_1 b_2 + a_2 b_1)i$$

> [!abstract] Theorem 1.2 — Cấu trúc trường (Field Structure)
> $(\mathbb{C}, +, \cdot)$ là một **trường** (field). Cụ thể:
> - $(\mathbb{C}, +)$ là nhóm Abel với phần tử trung hòa $0 = 0 + 0i$
> - $(\mathbb{C} \setminus \{0\}, \cdot)$ là nhóm Abel với phần tử trung hòa $1 = 1 + 0i$
> - Phép nhân phân phối với phép cộng

**Proof.** Tất cả các tiên đề trường đều theo trực tiếp từ định nghĩa phép toán và tính chất của $\mathbb{R}$. Quan trọng nhất, nghịch đảo nhân của $z = a + bi \neq 0$ là:

$$z^{-1} = \frac{a - bi}{a^2 + b^2} = \frac{a}{a^2+b^2} - \frac{b}{a^2+b^2}i$$

Ta kiểm tra: $z \cdot z^{-1} = \frac{(a+bi)(a-bi)}{a^2+b^2} = \frac{a^2+b^2}{a^2+b^2} = 1$. $\blacksquare$

> [!note] Remark 1.3
> $\mathbb{C}$ chứa $\mathbb{R}$ như một trường con (đồng nhất $a \in \mathbb{R}$ với $a + 0i \in \mathbb{C}$). Tuy nhiên $\mathbb{C}$ **không** có thứ tự tương thích với phép toán — tức là không thể định nghĩa $<$ trên $\mathbb{C}$ sao cho nó tương thích với cấu trúc trường.

---

## Liên hợp và Module

### Definition

> [!info] Definition 1.4 — Liên hợp và Module
> Cho $z = a + bi \in \mathbb{C}$:
> - **Liên hợp phức** (complex conjugate): $\bar{z} = a - bi$
> - **Module** (modulus): $|z| = \sqrt{a^2 + b^2} = \sqrt{z\bar{z}}$

> [!abstract] Theorem 1.5 — Tính chất của module và liên hợp
> Với mọi $z, w \in \mathbb{C}$:
>
> $$|zw| = |z||w|, \quad \left|\frac{z}{w}\right| = \frac{|z|}{|w|} \quad (w \neq 0)$$
>
> $$\overline{z + w} = \bar{z} + \bar{w}, \quad \overline{zw} = \bar{z}\bar{w}$$
>
> $$\operatorname{Re}(z) = \frac{z + \bar{z}}{2}, \quad \operatorname{Im}(z) = \frac{z - \bar{z}}{2i}$$

**Proof.** Viết $z = a + bi$, $w = c + di$. Ta có:

$$|zw|^2 = |(ac - bd) + (ad + bc)i|^2 = (ac-bd)^2 + (ad+bc)^2$$

$$= a^2c^2 + b^2d^2 + a^2d^2 + b^2c^2 = (a^2+b^2)(c^2+d^2) = |z|^2|w|^2$$

Vì $|zw| \geq 0$ và $|z||w| \geq 0$, suy ra $|zw| = |z||w|$. Các công thức còn lại kiểm tra tương tự. $\blacksquare$

> [!abstract] Theorem 1.6 — Bất đẳng thức tam giác (Triangle Inequality)
> Với mọi $z, w \in \mathbb{C}$:
>
> $$|z + w| \leq |z| + |w|$$
>
> Dấu bằng xảy ra khi và chỉ khi $z$ và $w$ cùng chiều từ gốc tọa độ (tức $w = \lambda z$ với $\lambda \geq 0$ thực, hoặc một trong hai bằng $0$).

**Proof.** Ta tính:

$$|z + w|^2 = (z+w)\overline{(z+w)} = (z+w)(\bar{z}+\bar{w}) = |z|^2 + z\bar{w} + \bar{z}w + |w|^2$$

Lưu ý $z\bar{w} + \bar{z}w = 2\operatorname{Re}(z\bar{w}) \leq 2|z\bar{w}| = 2|z||w|$. Do đó:

$$|z+w|^2 \leq |z|^2 + 2|z||w| + |w|^2 = (|z|+|w|)^2$$

Lấy căn bậc hai hai vế ta được bất đẳng thức. $\blacksquare$

> [!example] Example 1.7 — Bất đẳng thức tam giác đảo
> **Bất đẳng thức tam giác đảo** (reverse triangle inequality):
>
> $$\big||z| - |w|\big| \leq |z - w|$$
>
> Chứng minh: $|z| = |(z-w) + w| \leq |z-w| + |w|$, suy ra $|z| - |w| \leq |z-w|$. Đổi vai trò $z, w$ ta được $|w| - |z| \leq |z-w|$. Kết hợp lại ta có điều phải chứng minh.

---

## Biểu Diễn Cực và Công Thức Euler

### Definition

> [!info] Definition 1.8 — Argument (Đối số)
> Cho $z \neq 0$, **argument** của $z$ là góc $\theta \in \mathbb{R}$ sao cho
>
> $$z = |z|(\cos\theta + i\sin\theta)$$
>
> Argument không duy nhất: $\theta$ và $\theta + 2\pi k$ ($k \in \mathbb{Z}$) đều là argument của $z$. **Argument chính** (principal argument) $\operatorname{Arg}(z) \in (-\pi, \pi]$.

> [!abstract] Theorem 1.9 — Công thức Euler (Euler's Formula)
> Với mọi $\theta \in \mathbb{R}$:
>
> $$e^{i\theta} = \cos\theta + i\sin\theta$$
>
> Do đó mọi số phức $z \neq 0$ viết được dưới dạng cực: $z = r e^{i\theta}$ với $r = |z| > 0$, $\theta = \arg z$.

Công thức Euler xuất phát từ chuỗi Taylor (sẽ được chứng minh chặt chẽ trong Bài 05 về Power Series):

$$e^{i\theta} = \sum_{n=0}^{\infty} \frac{(i\theta)^n}{n!} = \sum_{k=0}^{\infty} \frac{(-1)^k\theta^{2k}}{(2k)!} + i\sum_{k=0}^{\infty}\frac{(-1)^k\theta^{2k+1}}{(2k+1)!} = \cos\theta + i\sin\theta$$

> [!abstract] Theorem 1.10 — Công thức De Moivre
> Với $n \in \mathbb{Z}$:
>
> $$(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$$

**Proof.** Từ $e^{i\theta} = \cos\theta + i\sin\theta$ và $(e^{i\theta})^n = e^{in\theta}$. $\blacksquare$

> [!example] Example 1.11 — Căn bậc $n$ của đơn vị
> Các **căn bậc $n$ của đơn vị** (roots of unity) là các nghiệm của $z^n = 1$:
>
> $$\zeta_k = e^{2\pi i k/n} = \cos\frac{2\pi k}{n} + i\sin\frac{2\pi k}{n}, \quad k = 0, 1, \ldots, n-1$$
>
> Chúng tạo thành $n$ điểm phân bố đều trên đường tròn đơn vị $|z| = 1$, và tạo thành nhóm cyclic $\mathbb{Z}/n\mathbb{Z}$ dưới phép nhân.

> [!example] Example 1.12 — Phép nhân là phép quay và co giãn
> Nhân $z$ với $w = re^{i\theta}$ có tác dụng hình học: **xoay** $z$ một góc $\theta$ và **co/giãn** theo tỉ lệ $r$:
>
> $$w \cdot z = r e^{i\theta} \cdot |z|e^{i\phi} = r|z| \cdot e^{i(\theta+\phi)}$$
>
> Đây là trực giác cốt lõi cho toàn bộ lý thuyết ánh xạ bảo giác sau này.

---

## Cầu Riemann (Riemann Sphere)

### Definition

> [!info] Definition 1.13 — Mặt phẳng phức mở rộng
> **Mặt phẳng phức mở rộng** (extended complex plane) hay **cầu Riemann** là:
>
> $$\hat{\mathbb{C}} = \mathbb{C} \cup \{\infty\}$$
>
> Đây là không gian compact thu được bằng cách chiếu lập thể (stereographic projection) từ mặt cầu $S^2 \subset \mathbb{R}^3$ lên mặt phẳng $\mathbb{C}$.

Cụ thể, điểm $(x_1, x_2, x_3) \in S^2$ (với $x_3 \neq 1$) chiếu đến điểm:

$$z = \frac{x_1 + ix_2}{1 - x_3} \in \mathbb{C}$$

Điểm cực bắc $(0, 0, 1)$ chiếu đến $\infty$. Qua phép chiếu này:
- Vòng tròn lớn trên $S^2$ → đường tròn hoặc đường thẳng trên $\mathbb{C}$
- "Đường thẳng" là đường tròn đi qua $\infty$

> [!note] Remark 1.14
> Cầu Riemann $\hat{\mathbb{C}}$ là không gian Hausdorff compact, homeomorphic với $S^2$. Đây là "sân chơi tự nhiên" của lý thuyết hàm phức hữu tỉ và các ánh xạ Möbius (sẽ học trong Bài 11).

---

## SageMath Cheatsheet

```python
# Số phức trong SageMath
z = CC(3, 4)           # z = 3 + 4i
w = CC(1, -2)          # w = 1 - 2i

# Phần thực, phần ảo, module, liên hợp
z.real(), z.imag()     # 3.0, 4.0
abs(z)                 # 5.0 (|z| = sqrt(9+16))
z.conjugate()          # 3 - 4i

# Biểu diễn cực
z.abs(), z.arg()       # module và argument

# Căn bậc n của đơn vị
n = 5
roots = [CC(e^(2*pi*i*k/n)) for k in range(n)]

# Số phức tượng trưng
var('a b')
z_sym = a + b*I
z_sym.conjugate()
z_sym.abs()

# Vẽ mặt phẳng phức
import matplotlib.pyplot as plt
import numpy as np
theta = np.linspace(0, 2*np.pi, 100)
plt.plot(np.cos(theta), np.sin(theta))  # đường tròn đơn vị
```

---

## Summary / Key Takeaways

- $\mathbb{C} = \{a + bi \mid a, b \in \mathbb{R}, i^2 = -1\}$ là một trường, đồng nhất hình học với $\mathbb{R}^2$.
- Module $|z| = \sqrt{a^2+b^2}$ và bất đẳng thức tam giác $|z+w| \leq |z|+|w|$ là nền tảng cho topo học phức.
- Biểu diễn cực $z = re^{i\theta}$, kết hợp với công thức Euler $e^{i\theta} = \cos\theta + i\sin\theta$, cho thấy phép nhân phức chính là phép quay-co giãn trong mặt phẳng.
- Công thức De Moivre: $(e^{i\theta})^n = e^{in\theta}$, là công cụ tính căn bậc $n$ và dạng lượng giác.
- Cầu Riemann $\hat{\mathbb{C}} = \mathbb{C} \cup \{\infty\}$ là không gian compact tự nhiên để nghiên cứu hàm phức.
- Không có thứ tự trên $\mathbb{C}$ tương thích với cấu trúc trường.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 1.
- Stein, E. M. & Shakarchi, R. *Complex Analysis* (Princeton Lectures in Analysis II), Chapter 1.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 1.
