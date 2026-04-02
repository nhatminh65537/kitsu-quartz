---
title: "04. Elementary Complex Functions"
tags: [math, complex-analysis, lesson-04]
aliases: [Elementary Complex Functions]
created: 2026-03-31
---

> **Prerequisites**: [[03-holomorphic-functions|03. Holomorphic Functions and Cauchy–Riemann Equations]]
> **Objectives**:
> - Mở rộng hàm mũ, logarithm, lũy thừa, lượng giác sang $\mathbb{C}$
> - Hiểu tính đa trị của $\log z$ và $z^\alpha$, cách chọn nhánh
> - Tính toán thành thạo với các hàm sơ cấp phức

---

## Motivation / Intuition

Các hàm sơ cấp quen thuộc trên $\mathbb{R}$ — hàm mũ, logarithm, lượng giác — đều có thể mở rộng sang $\mathbb{C}$ một cách tự nhiên, nhưng với một điều bất ngờ: **logarithm và lũy thừa trở thành hàm đa trị**. Hiểu cách xử lý tính đa trị này là kỹ năng cốt lõi.

Hàm mũ phức $e^z$ là nền tảng: nó entire, không bao giờ triệt tiêu, và mọi hàm sơ cấp khác đều xây dựng từ nó.

---

## Hàm Mũ Phức (Complex Exponential)

### Definition

> [!info] Definition 4.1 — Hàm mũ phức
> Với $z = x + iy$, định nghĩa:
>
> $$e^z = e^x(\cos y + i\sin y)$$
>
> Tương đương: $e^z = \sum_{n=0}^\infty \frac{z^n}{n!}$ (hội tụ trên toàn $\mathbb{C}$, sẽ chứng minh trong Bài 05).

> [!abstract] Theorem 4.2 — Tính chất hàm mũ
> Hàm $e^z$ là **entire** và:
>
> $$\frac{d}{dz}e^z = e^z$$
>
> $$e^{z_1 + z_2} = e^{z_1} e^{z_2} \quad \forall z_1, z_2 \in \mathbb{C}$$
>
> $$|e^z| = e^{\operatorname{Re}(z)}, \quad \arg(e^z) = \operatorname{Im}(z)$$
>
> $$e^z \neq 0 \quad \forall z \in \mathbb{C}$$

**Proof (holomorphic).** Kiểm tra CR với $u = e^x\cos y$, $v = e^x\sin y$:

$$u_x = e^x\cos y = v_y, \quad u_y = -e^x\sin y = -v_x$$

CR thỏa. Đạo hàm: $(e^z)' = u_x + iv_x = e^x\cos y + ie^x\sin y = e^z$. $\blacksquare$

> [!example] Example 4.3 — Tính $e^z$
> $e^{1+i\pi} = e^1(\cos\pi + i\sin\pi) = e(-1+0) = -e$.
>
> Đây là dạng mở rộng của công thức Euler: $e^{i\pi} + 1 = 0$.

> [!warning] Counterexample 4.4 — $e^z$ là hàm tuần hoàn
> $e^z$ là hàm **tuần hoàn** (periodic) với chu kỳ $2\pi i$:
>
> $$e^{z + 2\pi i} = e^z \cdot e^{2\pi i} = e^z \cdot 1 = e^z$$
>
> Điều này rất khác hàm mũ thực. Hệ quả: $e^z$ là hàm **nhiều-một** (many-to-one): $e^z = e^w \Leftrightarrow z - w \in 2\pi i\mathbb{Z}$.

---

## Logarithm Phức (Complex Logarithm)

### Definition

> [!info] Definition 4.5 — Logarithm phức đa trị
> Với $z \neq 0$, **logarithm phức** là tập hợp:
>
> $$\log z = \ln|z| + i\arg z = \ln|z| + i(\operatorname{Arg}(z) + 2\pi k), \quad k \in \mathbb{Z}$$
>
> đây là tập **vô hạn đếm được** các giá trị.

> [!info] Definition 4.6 — Nhánh chính của logarithm (Principal Branch)
> **Nhánh chính** (principal value):
>
> $$\operatorname{Log}(z) = \ln|z| + i\operatorname{Arg}(z), \quad \operatorname{Arg}(z) \in (-\pi, \pi]$$
>
> $\operatorname{Log}(z)$ holomorphic trên $\mathbb{C} \setminus (-\infty, 0]$ (mặt phẳng bỏ tia âm thực).

> [!abstract] Theorem 4.7 — Đạo hàm của $\operatorname{Log}$
> Trên $\mathbb{C} \setminus (-\infty, 0]$:
>
> $$\frac{d}{dz}\operatorname{Log}(z) = \frac{1}{z}$$

**Proof.** $\operatorname{Log}(z)$ là hàm nghịch đảo của $e^w$ (cục bộ). Dùng quy tắc đạo hàm hàm nghịch: nếu $e^w = z$ thì $(e^w)' = e^w = z$, nên $(\operatorname{Log})'(z) = \frac{1}{z}$. $\blacksquare$

> [!example] Example 4.8 — Tính $\log$ phức
> - $\operatorname{Log}(-1) = \ln 1 + i\pi = i\pi$ (vì $|-1|=1$, $\operatorname{Arg}(-1)=\pi$)
> - $\operatorname{Log}(i) = \ln 1 + i\frac{\pi}{2} = \frac{i\pi}{2}$
> - $\operatorname{Log}(-i) = -\frac{i\pi}{2}$
> - $\operatorname{Log}(1+i) = \ln\sqrt{2} + i\frac{\pi}{4} = \frac{1}{2}\ln 2 + \frac{i\pi}{4}$

> [!warning] Counterexample 4.9 — Log không liên tục trên tia âm
> Khi $z \to -1$ từ trên ($\operatorname{Im}(z) \to 0^+$): $\operatorname{Arg}(z) \to \pi$, nên $\operatorname{Log}(z) \to i\pi$.
>
> Khi $z \to -1$ từ dưới ($\operatorname{Im}(z) \to 0^-$): $\operatorname{Arg}(z) \to -\pi$, nên $\operatorname{Log}(z) \to -i\pi$.
>
> Giới hạn không tồn tại: $\operatorname{Log}$ **không liên tục** (và không holomorphic) trên tia $(-\infty, 0]$.

### Nhánh tổng quát

> [!info] Definition 4.10 — Nhánh (Branch) của logarithm
> Một **nhánh** của $\log z$ trên miền $\Omega$ là hàm đơn trị liên tục $\ell: \Omega \to \mathbb{C}$ thỏa $e^{\ell(z)} = z$. Mọi nhánh có dạng $\ell(z) = \operatorname{Log}(z) + 2\pi ik$ với $k \in \mathbb{Z}$ cố định.
>
> Nhánh logarithm tồn tại trên $\Omega$ khi và chỉ khi $\Omega$ đơn liên và $0 \notin \Omega$.

---

## Lũy Thừa Phức (Complex Powers)

### Definition

> [!info] Definition 4.11 — Lũy thừa phức $z^\alpha$
> Với $z \neq 0$ và $\alpha \in \mathbb{C}$, định nghĩa:
>
> $$z^\alpha = e^{\alpha \log z}$$
>
> Vì $\log z$ đa trị, $z^\alpha$ nói chung là **đa trị**. Dùng nhánh chính:
>
> $$z^\alpha = e^{\alpha \operatorname{Log}(z)}$$

> [!example] Example 4.12 — Trường hợp đặc biệt
> - $\alpha = n \in \mathbb{Z}$: $z^n = e^{n\log z}$ đơn trị (vì $e^{2\pi i n} = 1$).
> - $\alpha = 1/n$: $z^{1/n} = e^{\frac{1}{n}\log z}$ có đúng $n$ giá trị (căn bậc $n$).
> - $\alpha = i$: $i^i = e^{i\operatorname{Log}(i)} = e^{i \cdot \frac{i\pi}{2}} = e^{-\pi/2} \approx 0.2079$ — số thực!

> [!example] Example 4.13 — Tính $(-1)^{\sqrt{2}}$
> $(-1)^{\sqrt{2}} = e^{\sqrt{2}\log(-1)} = e^{\sqrt{2}(i\pi + 2\pi ik)}$ với $k \in \mathbb{Z}$.
>
> Các giá trị: $e^{i\pi\sqrt{2}(2k+1)}$, $k \in \mathbb{Z}$ — vô hạn nhiều giá trị trên đường tròn đơn vị.

---

## Hàm Lượng Giác và Hyperbolic Phức

### Definition

> [!info] Definition 4.14 — Sine, Cosine phức
> $$\sin z = \frac{e^{iz} - e^{-iz}}{2i}, \qquad \cos z = \frac{e^{iz} + e^{-iz}}{2}$$
>
> Cả hai đều **entire**. Đạo hàm: $(\sin z)' = \cos z$, $(\cos z)' = -\sin z$.

> [!info] Definition 4.15 — Hàm hyperbolic phức
> $$\sinh z = \frac{e^z - e^{-z}}{2}, \qquad \cosh z = \frac{e^z + e^{-z}}{2}$$
>
> Liên hệ: $\sinh(iz) = i\sin z$, $\cosh(iz) = \cos z$.

> [!abstract] Theorem 4.16 — Tính chất
> - $\sin^2 z + \cos^2 z = 1$ (với $z \in \mathbb{C}$)
> - $\sin$ và $\cos$ **không bị chặn** trên $\mathbb{C}$: $|\sin z|$ có thể lớn tùy ý
> - Nghiệm của $\sin z = 0$: $z = n\pi$ ($n \in \mathbb{Z}$)
> - Nghiệm của $\cos z = 0$: $z = (n+\frac{1}{2})\pi$ ($n \in \mathbb{Z}$)

> [!example] Example 4.17 — $|\sin z|$ không bị chặn
> $\sin(iy) = \frac{e^{i(iy)} - e^{-i(iy)}}{2i} = \frac{e^{-y} - e^y}{2i} = i\sinh(y)$
>
> Nên $|\sin(iy)| = \sinh(|y|) \to \infty$ khi $|y| \to \infty$.
>
> Điều này rất khác $|\sin x| \leq 1$ với $x \in \mathbb{R}$.

---

## Arctangent và Hàm Ngược

> [!info] Definition 4.18 — Arcsin và Arctan phức
> $$\arcsin z = \frac{1}{i}\log(iz + \sqrt{1-z^2}), \qquad \arctan z = \frac{1}{2i}\log\frac{1+iz}{1-iz}$$
>
> Cả hai đều là hàm đa trị do chứa $\log$.

> [!example] Example 4.19 — Tính arctan
> Với $z \in \mathbb{R}$ và $z \neq \pm i$:
>
> $$\arctan z = \frac{1}{2i}\operatorname{Log}\frac{1+iz}{1-iz}$$
>
> cho nghiệm chính trùng với $\arctan$ thực khi $z \in \mathbb{R}$.

---

## SageMath Cheatsheet

```python
# Hàm mũ phức
z = CC(1 + pi*I)
exp(z)                      # e^(1+iπ) = -e

# Logarithm chính
log(CC(-1))                 # iπ
log(CC(0, 1))               # iπ/2
log(CC(1, 1))               # (ln2)/2 + iπ/4

# Lũy thừa phức
CC(0, 1)^CC(0, 1)           # i^i ≈ 0.2079

# Lượng giác phức
z = CC(0, 1)                # z = i
sin(z)                      # i*sinh(1)
cos(z)                      # cosh(1)

# Vẽ ảnh của hàm mũ
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(-2, 2, 200)
y = np.linspace(-np.pi, np.pi, 200)
X, Y = np.meshgrid(x, y)
Z = X + 1j*Y
W = np.exp(Z)
# W trải đều trên toàn mặt phẳng phức (ngoại trừ 0)

# Kiểm tra công thức de Moivre
n = 5
theta = CC(pi/6)
lhs = (cos(theta) + I*sin(theta))^n
rhs = cos(n*theta) + I*sin(n*theta)
print(abs(lhs - rhs) < 1e-10)   # True
```

---

## Summary / Key Takeaways

- $e^z = e^x(\cos y + i\sin y)$ là entire, tuần hoàn $2\pi i$, không bao giờ bằng $0$.
- $\log z = \ln|z| + i\arg z$ là hàm đa trị; nhánh chính $\operatorname{Log}$ holomorphic trên $\mathbb{C} \setminus(-\infty,0]$.
- $z^\alpha = e^{\alpha\log z}$ tổng quát đa trị; đơn trị khi $\alpha \in \mathbb{Z}$.
- $\sin z$, $\cos z$ entire, không bị chặn trên $\mathbb{C}$ (khác với trường hợp thực).
- Mọi hàm sơ cấp phức xây dựng từ $e^z$ và $\log z$.
- Tính đa trị của $\log$ gắn liền với tính không đơn liên của $\mathbb{C} \setminus \{0\}$.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 2, §3.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 1, §2.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 3.
