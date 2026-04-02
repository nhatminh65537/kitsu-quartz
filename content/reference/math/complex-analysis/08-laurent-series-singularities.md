---
title: "08. Laurent Series and Isolated Singularities"
tags: [math, complex-analysis, lesson-08]
aliases: [Laurent Series and Isolated Singularities]
created: 2026-03-31
---

> **Prerequisites**: [[06-complex-integration|06. Complex Integration]], [[07-local-properties|07. Local Properties of Analytic Functions]]
> **Objectives**:
> - Hiểu và tính chuỗi Laurent của hàm holomorphic trên vành khuyên
> - Phân loại điểm kỳ dị cô lập: khả khử, cực, thiết yếu
> - Nắm định lý Casorati–Weierstrass về điểm kỳ dị thiết yếu
> - Xác định bậc cực và tính thặng dư (residue) sơ bộ

---

## Motivation / Intuition

Đôi khi hàm holomorphic bị "hỏng" tại một điểm — ví dụ $\frac{\sin z}{z}$ tại $z = 0$, hay $\frac{1}{z^2}$. Những điểm này gọi là **điểm kỳ dị** (singularities). Công cụ để phân tích chúng là **chuỗi Laurent** — mở rộng của chuỗi Taylor cho phép có số hạng âm.

Ba loại điểm kỳ dị có hành vi hoàn toàn khác nhau, và phân loại chúng là bước then chốt trước khi tính thặng dư và tích phân bằng Định lý Thặng dư (Bài 09).

---

## Chuỗi Laurent (Laurent Series)

### Definition

> [!info] Definition 8.1 — Chuỗi Laurent
> Cho $0 \leq r_1 < r_2 \leq \infty$. **Chuỗi Laurent** trên vành khuyên $A(z_0; r_1, r_2) = \{z : r_1 < |z-z_0| < r_2\}$:
>
> $$f(z) = \sum_{n=-\infty}^{+\infty} c_n(z-z_0)^n = \cdots + \frac{c_{-2}}{(z-z_0)^2} + \frac{c_{-1}}{z-z_0} + c_0 + c_1(z-z_0) + \cdots$$
>
> - Phần $\sum_{n \geq 0} c_n(z-z_0)^n$: **phần chính quy** (regular part / analytic part)
> - Phần $\sum_{n \geq 1} c_{-n}(z-z_0)^{-n}$: **phần chính** (principal part)

> [!abstract] Theorem 8.2 — Định lý Laurent (Laurent's Theorem)
> Nếu $f$ holomorphic trên vành khuyên $A(z_0; r_1, r_2)$, thì $f$ có khai triển Laurent duy nhất hội tụ đều trên mọi vành khuyên đóng $\overline{A}(z_0; \rho_1, \rho_2)$ với $r_1 < \rho_1 < \rho_2 < r_2$, và các hệ số là:
>
> $$c_n = \frac{1}{2\pi i}\int_{|z-z_0|=\rho} \frac{f(z)}{(z-z_0)^{n+1}}\,dz$$
>
> với $\rho \in (r_1, r_2)$ bất kỳ.

**Proof (phác thảo).** Với $z \in A(z_0; r_1, r_2)$, chọn $\rho_1 < |z-z_0| < \rho_2$ và áp dụng Định lý Cauchy cho vành khuyên giữa $|z-z_0|=\rho_2$ và $|z-z_0|=\rho_1$:

$$f(z) = \frac{1}{2\pi i}\int_{|w-z_0|=\rho_2}\frac{f(w)}{w-z}\,dw - \frac{1}{2\pi i}\int_{|w-z_0|=\rho_1}\frac{f(w)}{w-z}\,dw$$

Khai triển $\frac{1}{w-z}$ thành chuỗi hình học theo hai hướng (từ vòng ngoài và từ vòng trong) cho ra hai phần của chuỗi Laurent. $\blacksquare$

> [!example] Example 8.3 — Tính chuỗi Laurent
> **$f(z) = \frac{1}{z(z-1)}$ trên vành khuyên $0 < |z| < 1$.**
>
> Phân tích từng phần:
>
> $$\frac{1}{z(z-1)} = \frac{1}{z} \cdot \frac{1}{z-1} = \frac{1}{z} \cdot \frac{-1}{1-z} = -\frac{1}{z}\sum_{n=0}^\infty z^n = -\sum_{n=0}^\infty z^{n-1}$$
>
> $$= -\frac{1}{z} - 1 - z - z^2 - \cdots$$
>
> Vậy $c_{-1} = -1$, $c_n = -1$ với $n \geq 0$.

> [!example] Example 8.4 — Chuỗi Laurent trên $1 < |z| < \infty$
> **$f(z) = \frac{1}{z(z-1)}$ trên $|z| > 1$.**
>
> $$\frac{1}{z(z-1)} = \frac{1}{z^2} \cdot \frac{1}{1 - 1/z} = \frac{1}{z^2}\sum_{n=0}^\infty z^{-n} = \sum_{n=0}^\infty z^{-(n+2)} = \frac{1}{z^2} + \frac{1}{z^3} + \cdots$$

---

## Điểm Kỳ Dị Cô Lập (Isolated Singularities)

### Definition

> [!info] Definition 8.5 — Điểm kỳ dị cô lập
> Điểm $z_0$ là **điểm kỳ dị cô lập** (isolated singularity) của $f$ nếu $f$ holomorphic trên đĩa đục $D'(z_0, r) = D(z_0,r) \setminus \{z_0\}$ nhưng không holomorphic (hay không định nghĩa) tại $z_0$.

Chuỗi Laurent của $f$ trên $D'(z_0, r)$ tồn tại và xác định loại điểm kỳ dị:

### Phân loại

> [!info] Definition 8.6 — Ba loại điểm kỳ dị
>
> | Loại | Điều kiện trên chuỗi Laurent | Ví dụ |
> |------|------------------------------|-------|
> | **Khả khử** (Removable) | $c_n = 0$ với mọi $n < 0$ | $\frac{\sin z}{z}$ tại $z=0$ |
> | **Cực** (Pole) bậc $m$ | $c_{-m} \neq 0$, $c_n = 0$ với $n < -m$ | $\frac{1}{z^2}$ tại $z=0$ (bậc 2) |
> | **Thiết yếu** (Essential) | Vô hạn nhiều $c_n \neq 0$ với $n < 0$ | $e^{1/z}$ tại $z=0$ |

---

## Điểm Kỳ Dị Khả Khử (Removable Singularities)

> [!abstract] Theorem 8.7 — Định lý Riemann về điểm kỳ dị khả khử
> Điểm $z_0$ là điểm kỳ dị khả khử của $f$ khi và chỉ khi:
>
> $$\lim_{z \to z_0}(z-z_0)f(z) = 0$$
>
> (tương đương: $f$ bị chặn trên lân cận đục của $z_0$).

**Proof.** ($\Rightarrow$): Nếu $c_n = 0$ với $n < 0$, thì $f(z) = c_0 + c_1(z-z_0) + \cdots$ có thể mở rộng tại $z_0$. ($\Leftarrow$): Đặt $g(z) = (z-z_0)f(z)$, $g(z_0) = 0$. Nếu $(z-z_0)f(z) \to 0$, thì $g$ holomorphic (Riemann removable singularity). Vậy $g(z) = (z-z_0)h(z)$ với $h$ holomorphic và $f = h$ trên $D'(z_0,r)$. $\blacksquare$

> [!example] Example 8.8 — Điểm kỳ dị khả khử
> $f(z) = \frac{\sin z}{z}$: tại $z = 0$, $\lim_{z\to 0}\frac{\sin z}{z} = 1$. Định nghĩa $f(0) = 1$ thì $f$ holomorphic trên $\mathbb{C}$.
>
> Chuỗi Laurent: $\frac{\sin z}{z} = \frac{1}{z}(z - z^3/6 + \cdots) = 1 - z^2/6 + z^4/120 - \cdots$ (không có số hạng âm). ✓

---

## Cực (Poles)

> [!abstract] Theorem 8.9 — Đặc trưng của cực
> $z_0$ là cực bậc $m$ của $f$ khi và chỉ khi:
>
> $$f(z) = \frac{h(z)}{(z-z_0)^m}$$
>
> với $h$ holomorphic tại $z_0$ và $h(z_0) \neq 0$. Tương đương:
>
> $$\lim_{z \to z_0}|f(z)| = +\infty$$

**Proof.** Nếu $f$ có cực bậc $m$ tại $z_0$, viết $f(z) = \frac{c_{-m}}{(z-z_0)^m} + \cdots = \frac{h(z)}{(z-z_0)^m}$ với $h(z_0) = c_{-m} \neq 0$. Ngược lại hiển nhiên. Vì $h(z_0) \neq 0$, $|f(z)| \to \infty$. $\blacksquare$

> [!example] Example 8.10 — Xác định bậc cực
> $f(z) = \frac{z^2 + 1}{(z-1)^3(z+2)}$:
> - Cực bậc $3$ tại $z = 1$ (tử số $\neq 0$ tại $z=1$ vì $1^2+1=2 \neq 0$)
> - Cực bậc $1$ (simple pole) tại $z = -2$ (tử số $(-2)^2+1=5 \neq 0$)

> [!tip] Key Insight 8.11 — Khai triển quanh cực
> Gần cực bậc $m$ tại $z_0$, $f$ trông như $\frac{c_{-m}}{(z-z_0)^m}$. Phần chính Laurent:
>
> $$\frac{c_{-m}}{(z-z_0)^m} + \frac{c_{-m+1}}{(z-z_0)^{m-1}} + \cdots + \frac{c_{-1}}{z-z_0}$$
>
> Hệ số $c_{-1}$ gọi là **thặng dư** (residue) của $f$ tại $z_0$ — sẽ học kỹ trong Bài 09.

---

## Điểm Kỳ Dị Thiết Yếu (Essential Singularities)

> [!abstract] Theorem 8.12 — Định lý Casorati–Weierstrass
> Nếu $z_0$ là điểm kỳ dị thiết yếu của $f$, thì với mọi đĩa đục $D'(z_0, r)$, ảnh $f(D'(z_0, r))$ **trù mật** (dense) trong $\mathbb{C}$:
>
> $$\overline{f(D'(z_0, r))} = \mathbb{C}$$
>
> Tức là với mọi $w \in \mathbb{C}$ và $\varepsilon > 0$, tồn tại $z \in D'(z_0, r)$ sao cho $|f(z) - w| < \varepsilon$.

**Proof.** Phản chứng: giả sử tồn tại $w_0$ và $\varepsilon > 0$ sao cho $|f(z) - w_0| \geq \varepsilon$ với mọi $z \in D'(z_0, r)$. Đặt $g(z) = \frac{1}{f(z) - w_0}$, thì $g$ holomorphic và $|g(z)| \leq 1/\varepsilon$ trên $D'(z_0,r)$.

Theo Định lý Riemann, $z_0$ là điểm kỳ dị **khả khử** của $g$; mở rộng $g$ tại $z_0$.

- Nếu $g(z_0) \neq 0$: $f(z) = w_0 + 1/g(z)$ có thể mở rộng holomorphic tại $z_0$, mâu thuẫn.
- Nếu $g(z_0) = 0$ với bậc $m$: $g(z) = (z-z_0)^m h(z)$, $h(z_0) \neq 0$, nên $f(z) - w_0 = \frac{1}{(z-z_0)^m h(z)}$ có cực bậc $m$ tại $z_0$, mâu thuẫn.

Cả hai trường hợp mâu thuẫn với giả thiết $z_0$ là điểm thiết yếu. $\blacksquare$

> [!note] Remark 8.13 — Định lý Picard mạnh
> Định lý Casorati–Weierstrass còn được tăng cường bởi **Định lý Picard Mạnh** (Big Picard): gần điểm kỳ dị thiết yếu, $f$ nhận mọi giá trị phức **vô hạn lần**, ngoại trừ ít nhất một giá trị. Đây là kết quả sâu hơn nhiều, thường được học ở trình độ cao hơn.

> [!example] Example 8.14 — $e^{1/z}$ gần $z = 0$
> $e^{1/z} = \sum_{n=0}^\infty \frac{1}{n! z^n}$ — chuỗi Laurent có vô hạn số hạng âm, nên $z=0$ là điểm thiết yếu.
>
> Theo Casorati–Weierstrass: $e^{1/z}$ nhận gần mọi giá trị gần $z=0$. Thực vậy, $e^{1/z} \to 0$ khi $z \to 0$ theo trục âm thực, còn $|e^{1/z}| \to \infty$ khi $z \to 0$ theo trục dương thực.

---

## SageMath Cheatsheet

```python
# Chuỗi Laurent trong SageMath
z = var('z')

# Khai triển Laurent (SageMath dùng laurent_series_ring)
R = LaurentSeriesRing(CC, 'z')
z_R = R.gen()

# Ví dụ: sin(z)/z
f_sin_over_z = sin(z_R) / z_R
print(f_sin_over_z.truncate(8))  # 1 - z^2/6 + z^4/120 - ...

# Ví dụ: 1/(z*(z-1)) quanh z=0
# Thủ công: phân tích từng phần
f = 1 / (z_R * (z_R - 1))
print(f.truncate(5))   # -1/z - 1 - z - z^2 - z^3 - ...

# Xác định bậc cực
from sympy import *
z_s = Symbol('z')
f_s = (z_s**2 + 1) / ((z_s - 1)**3 * (z_s + 2))

# Bậc cực tại z=1: xem bậc của mẫu
print(Poly((z_s-1)**3, z_s).degree())   # 3

# Thặng dư (residue) — xem trước Bài 09
print(residue(f_s, z_s, 1))    # thặng dư tại z=1
print(residue(f_s, z_s, -2))   # thặng dư tại z=-2

# Minh họa Casorati-Weierstrass: e^(1/z) gần z=0
import numpy as np
import matplotlib.pyplot as plt

z_vals = []
w_vals = []
for _ in range(5000):
    r = np.random.uniform(0.01, 0.3)
    theta = np.random.uniform(0, 2*np.pi)
    z = r * np.exp(1j * theta)
    w = np.exp(1/z)
    if np.isfinite(abs(w)):
        z_vals.append(z)
        w_vals.append(w)

w_arr = np.array(w_vals)
# Ảnh trải rộng khắp mặt phẳng phức — trù mật
plt.scatter(w_arr.real, w_arr.imag, s=0.5, alpha=0.3)
plt.title('Ảnh của $e^{1/z}$ gần $z=0$ — Casorati–Weierstrass')
plt.xlim(-10, 10); plt.ylim(-10, 10)
plt.show()
```

---

## Summary / Key Takeaways

- Chuỗi Laurent $\sum_{n=-\infty}^\infty c_n(z-z_0)^n$ hội tụ đều trên vành khuyên compact.
- Hệ số: $c_n = \frac{1}{2\pi i}\int_{|\cdot|=\rho}\frac{f(z)}{(z-z_0)^{n+1}}dz$.
- Ba loại điểm kỳ dị cô lập:
  - **Khả khử**: phần chính rỗng, $\lim_{z\to z_0}(z-z_0)f(z)=0$, mở rộng được holomorphic.
  - **Cực** bậc $m$: phần chính dừng ở $c_{-m}$, $|f| \to \infty$, $f = h/(z-z_0)^m$.
  - **Thiết yếu**: phần chính vô hạn, ảnh trù mật (Casorati–Weierstrass).
- Thặng dư $\operatorname{Res}(f, z_0) = c_{-1}$: hệ số $1/(z-z_0)$ trong chuỗi Laurent.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 5, §§1–2.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 3, §§1–2.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 5.
