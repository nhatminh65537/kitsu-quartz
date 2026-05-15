---
title: "22. Algebraic Elements and Minimal Polynomials"
type: math-component
tags: [math, groups-rings-fields, field-theory, lesson-22]
aliases: [Algebraic Elements and Minimal Polynomials, Algebraic Elements, Minimal Polynomials]
created: 2026-05-15
---

> **Prerequisites**: [[21-fields-and-field-extensions|21. Fields and Field Extensions]], [[19-polynomial-rings|19. Polynomial Rings]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $F[x]$ | Vành đa thức một biến trên trường $F$ |
> | $F(\alpha)$ | Mở rộng đơn của $F$ sinh bởi $\alpha$ |
> | $[K:F]$ | Bậc của mở rộng trường $K/F$ |
> | $\langle p(x) \rangle$ | Ideal chính sinh bởi $p(x)$ trong $F[x]$ |
> | $\ker\phi$ | Kernel của đồng cấu $\phi$ |
> | $\operatorname{Im}(\phi)$ | Ảnh của đồng cấu $\phi$ |
> | $R/I$ | Vành thương của $R$ modulo ideal $I$ |

> **Objectives**:
> - Phân biệt phần tử đại số (algebraic) và siêu việt (transcendental) trên một trường
> - Xây dựng đa thức tối tiểu (minimal polynomial) và chứng minh tính duy nhất của nó
> - Hiểu đồng cấu đánh giá (evaluation homomorphism) và cấu trúc của $F[x]/\langle m_\alpha(x) \rangle$
> - Tính $[F(\alpha) : F] = \deg m_\alpha$ và áp dụng Tower Law

---

## Motivation

Trong [[21-fields-and-field-extensions|21. Fields and Field Extensions]], ta đã xây dựng $\mathbb{Q}(\sqrt{2})$ bằng cách "thêm" $\sqrt{2}$ vào $\mathbb{Q}$. Nhưng tại sao $[\mathbb{Q}(\sqrt{2}):\mathbb{Q}] = 2$ mà không phải $3$ hay $7$? Câu trả lời nằm ở **đa thức tối tiểu**: $\sqrt{2}$ là nghiệm của $x^2 - 2$, và bậc của đa thức này — $2$ — chính xác là bậc của mở rộng.

Ý tưởng cốt lõi: khi ta "thêm" một phần tử $\alpha$ vào trường $F$, kết quả $F(\alpha)$ được xác định hoàn toàn bởi "quan hệ đại số nhỏ nhất" mà $\alpha$ thỏa mãn, tức là **đa thức tối tiểu** (minimal polynomial) của $\alpha$ trên $F$. Đây là đa thức bậc thấp nhất có hệ số trong $F$ nhận $\alpha$ làm nghiệm.

Kết quả chính của bài này — $F(\alpha) \cong F[x]/\langle m_\alpha(x) \rangle$ — cho phép ta hiểu hoàn toàn cấu trúc của $F(\alpha)$ thông qua một đối tượng đại số quen thuộc.

---

## 1. Phần tử đại số và siêu việt

> [!definition] Definition 22.1 — Phần tử đại số và siêu việt (Algebraic and Transcendental)
> Cho $K/F$ là mở rộng trường và $\alpha \in K$.
>
> - $\alpha$ được gọi là **đại số** (algebraic) trên $F$ nếu tồn tại đa thức không tầm thường $f \in F[x]$, $f \neq 0$, sao cho $f(\alpha) = 0$.
> - $\alpha$ được gọi là **siêu việt** (transcendental) trên $F$ nếu không có đa thức không tầm thường nào trong $F[x]$ nhận $\alpha$ làm nghiệm, tức mọi $f \in F[x]$ với $f(\alpha) = 0$ đều phải có $f = 0$.
>
> Nếu mọi phần tử của $K$ đều đại số trên $F$, ta gọi $K/F$ là **mở rộng đại số** (algebraic extension).

> [!example] Example 22.2 — Ví dụ đại số và siêu việt
> - $\sqrt{2} \in \mathbb{R}$ là đại số trên $\mathbb{Q}$: nó là nghiệm của $x^2 - 2 \in \mathbb{Q}[x]$.
> - $\sqrt[3]{2} \in \mathbb{R}$ là đại số trên $\mathbb{Q}$: nghiệm của $x^3 - 2$.
> - $i \in \mathbb{C}$ là đại số trên $\mathbb{R}$ và trên $\mathbb{Q}$: nghiệm của $x^2 + 1$.
> - $\omega = e^{2\pi i/n}$ (căn đơn vị bậc $n$) là đại số trên $\mathbb{Q}$: nghiệm của $x^n - 1$.
> - $\pi \in \mathbb{R}$ là siêu việt trên $\mathbb{Q}$ (Lindemann, 1882) — không là nghiệm của bất kỳ đa thức hữu tỉ nào.
> - $e \in \mathbb{R}$ là siêu việt trên $\mathbb{Q}$ (Hermite, 1873).

---

## 2. Đồng cấu đánh giá (Evaluation Homomorphism)

> [!definition] Definition 22.3 — Đồng cấu đánh giá (Evaluation Homomorphism)
> Cho $K/F$ là mở rộng trường và $\alpha \in K$. Định nghĩa **đồng cấu đánh giá**:
>
> $$
> \phi_\alpha : F[x] \to K, \quad f(x) \mapsto f(\alpha)
> $$
>
> Đây là đồng cấu vành (ring homomorphism). Kernel của $\phi_\alpha$ là:
>
> $$
> \ker \phi_\alpha = \{f \in F[x] \mid f(\alpha) = 0\}
> $$

> [!abstract] Theorem 22.4 — Cấu trúc của kernel
> Cho $\alpha \in K$ với $K/F$ là mở rộng trường.
>
> **(a)** Nếu $\alpha$ **siêu việt** trên $F$: $\ker \phi_\alpha = \{0\}$, và $F[\alpha] \cong F[x]$ (miền đa thức). Hơn nữa, $F(\alpha) \cong F(x)$ (trường phân thức).
>
> **(b)** Nếu $\alpha$ **đại số** trên $F$: $\ker \phi_\alpha = \langle m_\alpha(x) \rangle$ với $m_\alpha(x) \in F[x]$ là một đa thức bất khả quy (irreducible) duy nhất (tính đến hằng số nhân) — gọi là **đa thức tối tiểu** (minimal polynomial) của $\alpha$ trên $F$.

**Proof.** $F[x]$ là PID (miền ideal chính), nên mọi ideal của nó đều là ideal chính. Vậy $\ker \phi_\alpha = \langle p(x) \rangle$ với $p(x) \in F[x]$.

*Trường hợp (a):* $\alpha$ siêu việt $\Leftrightarrow$ $f(\alpha) \neq 0$ với mọi $f \neq 0$ $\Leftrightarrow$ $\ker \phi_\alpha = \{0\}$ $\Leftrightarrow$ $p(x) = 0$.

*Trường hợp (b):* $\alpha$ đại số $\Rightarrow$ $\ker \phi_\alpha \neq \{0\}$, nên $p(x) \neq 0$. Chuẩn hóa $p(x)$ thành lũy đẳng (monic). Nếu $p = gh$ với $\deg g, \deg h < \deg p$, thì $p(\alpha) = g(\alpha) h(\alpha) = 0$, nên trong $K$ (miền nguyên) có $g(\alpha) = 0$ hoặc $h(\alpha) = 0$, mâu thuẫn với tính tối tiểu của $\deg p$ (vì $p$ sinh ra kernel). Vậy $p$ bất khả quy.

Tính duy nhất: nếu $q$ cũng là đa thức lũy đẳng bất khả quy trong $\ker \phi_\alpha$, thì $q \in \langle p \rangle$ và $p \in \langle q \rangle$, từ đó $p = q$ (vì cả hai đều lũy đẳng). $\blacksquare$

---

## 3. Đa thức tối tiểu (Minimal Polynomial)

> [!definition] Definition 22.5 — Đa thức tối tiểu (Minimal Polynomial)
> Cho $\alpha \in K$ là đại số trên $F$. **Đa thức tối tiểu** của $\alpha$ trên $F$ là đa thức lũy đẳng $m_\alpha(x) \in F[x]$ thỏa mãn:
>
> 1. $m_\alpha(\alpha) = 0$.
> 2. $m_\alpha$ bất khả quy trên $F$.
> 3. Với mọi $f \in F[x]$: $f(\alpha) = 0 \Rightarrow m_\alpha(x) \mid f(x)$.
>
> Ký hiệu: $m_\alpha(x)$ hoặc $\operatorname{Irr}(\alpha, F)$ hay $\operatorname{min}(\alpha, F)$.

> [!note] Remark 22.6 — Cách nhận biết đa thức tối tiểu
> Để xác định $m_\alpha(x)$:
> 1. Tìm một đa thức $f \in F[x]$ có $f(\alpha) = 0$.
> 2. Kiểm tra $f$ có bất khả quy trên $F$ không.
> 3. Nếu bất khả quy và lũy đẳng: đó chính là $m_\alpha$.
> 4. Nếu không: phân tích $f$ thành các nhân tử bất khả quy, nhân tử nào nhận $\alpha$ làm nghiệm chính là $m_\alpha$.

> [!example] Example 22.7 — Tính đa thức tối tiểu
>
> **(a) $\alpha = \sqrt{2}$ trên $\mathbb{Q}$:**
> $\alpha^2 = 2$, nên $f(x) = x^2 - 2$. Kiểm tra bất khả quy: $f$ không có nghiệm hữu tỉ (nghiệm hữu tỉ phải là $\pm 1$ hoặc $\pm 2$, đều không thỏa). Vậy $m_{\sqrt{2}}(x) = x^2 - 2$.
>
> **(b) $\alpha = \sqrt[3]{2}$ trên $\mathbb{Q}$:**
> $\alpha^3 = 2$, nên $f(x) = x^3 - 2$. Eisenstein với $p = 2$: $2 \mid -2$, $2 \nmid 1$, $4 \nmid -2$ → bất khả quy. Vậy $m_{\sqrt[3]{2}}(x) = x^3 - 2$.
>
> **(c) $\alpha = i$ trên $\mathbb{Q}$ và $\mathbb{R}$:**
> $i^2 = -1$, nên $f(x) = x^2 + 1$. Không có nghiệm thực → bất khả quy trên $\mathbb{R}$, và không có nghiệm hữu tỉ → bất khả quy trên $\mathbb{Q}$. Vậy $m_i(x) = x^2 + 1$ trên cả $\mathbb{Q}$ và $\mathbb{R}$.
>
> **(d) $\alpha = \sqrt{2} + \sqrt{3}$ trên $\mathbb{Q}$:**
> Đặt $\alpha = \sqrt{2} + \sqrt{3}$. Ta có: $\alpha - \sqrt{2} = \sqrt{3}$, bình phương: $\alpha^2 - 2\alpha\sqrt{2} + 2 = 3$, suy ra $2\alpha\sqrt{2} = \alpha^2 - 1$, bình phương: $8\alpha^2 = (\alpha^2 - 1)^2$. Rút gọn:
>
> $$
> \alpha^4 - 10\alpha^2 + 1 = 0
> $$
>
> Vậy $f(x) = x^4 - 10x^2 + 1$. Kiểm tra bất khả quy: không có nghiệm hữu tỉ, và không phân tích được thành hai đa thức bậc 2 có hệ số hữu tỉ (kiểm tra chi tiết). Vậy $m_\alpha(x) = x^4 - 10x^2 + 1$.

---

## 4. Cấu trúc của $F(\alpha)$

> [!abstract] Theorem 22.8 — Cấu trúc của mở rộng đơn đại số
> Cho $\alpha \in K$ đại số trên $F$ với đa thức tối tiểu $m_\alpha(x)$ bậc $n$. Khi đó:
>
> $$
> F(\alpha) \cong \frac{F[x]}{\langle m_\alpha(x) \rangle}
> $$
>
> và $[F(\alpha) : F] = n = \deg m_\alpha$. Cơ sở của $F(\alpha)$ trên $F$ là $\{1, \alpha, \alpha^2, \ldots, \alpha^{n-1}\}$.

**Proof.** Xét đồng cấu đánh giá $\phi_\alpha : F[x] \to K$. Ảnh của $\phi_\alpha$ là:

$$
F[\alpha] = \{f(\alpha) \mid f \in F[x]\} \subseteq K
$$

Theo định lý đồng cấu thứ nhất: $F[\alpha] = \operatorname{Im}(\phi_\alpha) \cong F[x] / \ker \phi_\alpha = F[x] / \langle m_\alpha(x) \rangle$.

Vì $m_\alpha$ bất khả quy trên $F$ và $F[x]$ là PID, ideal $\langle m_\alpha \rangle$ là ideal tối đại (maximal), nên $F[x]/\langle m_\alpha \rangle$ là **trường** (field).

Vậy $F[\alpha]$ đã là trường! Và $F[\alpha]$ chứa $F$ và $\alpha$, nên $F[\alpha] \supseteq F(\alpha)$. Mặt khác $F(\alpha)$ chứa $F[\alpha]$ theo định nghĩa. Vậy $F(\alpha) = F[\alpha] \cong F[x]/\langle m_\alpha \rangle$.

**Bậc:** $F[x]/\langle m_\alpha \rangle$ có cơ sở $\{\bar{1}, \bar{x}, \bar{x}^2, \ldots, \bar{x}^{n-1}\}$ như $F$-không gian vector (vì mọi đa thức chia cho $m_\alpha$ đều có số dư bậc $< n$). Vậy $[F(\alpha):F] = n$. $\blacksquare$

> [!tip] Tip 22.9 — Ý nghĩa thực tế
> Định lý này cực kỳ quan trọng trong thực hành:
>
> - **Cộng và trừ** trong $F(\alpha)$: hoàn toàn tự nhiên ($n$-tuple hệ số).
> - **Nhân** trong $F(\alpha)$: nhân đa thức rồi rút gọn modulo $m_\alpha(\alpha) = 0$ (dùng quan hệ $\alpha^n =$ tổ hợp tuyến tính của $1, \alpha, \ldots, \alpha^{n-1}$).
> - **Nghịch đảo** trong $F(\alpha)$: dùng thuật toán Euclid mở rộng để tìm $f(\alpha)^{-1}$.

> [!example] Example 22.10 — Tính toán trong $\mathbb{Q}(\sqrt[3]{2})$
> Ta có $m_{\sqrt[3]{2}}(x) = x^3 - 2$, đặt $\alpha = \sqrt[3]{2}$, và $\mathbb{Q}(\alpha) \cong \mathbb{Q}[x]/(x^3 - 2)$.
>
> Quan hệ căn bản: $\alpha^3 = 2$.
>
> **Nhân:** $(1 + \alpha)(1 + \alpha + \alpha^2)$
>
> $$
> = 1 + \alpha + \alpha^2 + \alpha + \alpha^2 + \alpha^3 = 1 + 2\alpha + 2\alpha^2 + 2
> $$
>
> (dùng $\alpha^3 = 2$)
>
> $$
> = 3 + 2\alpha + 2\alpha^2
> $$
>
> **Nghịch đảo của $\alpha$:** Tìm $f(\alpha)$ sao cho $\alpha \cdot f(\alpha) = 1$. Dùng Euclid mở rộng cho $x$ và $x^3 - 2$:
>
> $$
> x^3 - 2 = x^2 \cdot x + (-2), \quad x = \left(-\frac{x}{2}\right)(-2) + 0
> $$
>
> Suy ra: $-2 = (x^3 - 2) - x^2 \cdot x$, nên $1 = x \cdot \left(-\frac{x^2}{2}\right) + \frac{1}{2}(x^3 - 2)$.
>
> Vậy trong $\mathbb{Q}[x]/(x^3-2)$: $\alpha \cdot \left(-\frac{\alpha^2}{2}\right) \equiv 1$, tức $\alpha^{-1} = \frac{\alpha^2}{2}$. Kiểm tra: $\alpha \cdot \frac{\alpha^2}{2} = \frac{\alpha^3}{2} = \frac{2}{2} = 1$. ✓

---

## 5. Tính chất đại số của mở rộng

> [!abstract] Theorem 22.11 — Mở rộng hữu hạn là mở rộng đại số
> Nếu $K/F$ là mở rộng hữu hạn, thì $K/F$ là mở rộng đại số (tức mọi $\alpha \in K$ đều đại số trên $F$).

**Proof.** Giả sử $[K:F] = n$. Với tùy ý $\alpha \in K$, xét $n+1$ phần tử $1, \alpha, \alpha^2, \ldots, \alpha^n \in K$. Vì $\dim_F K = n < n+1$, tập này phụ thuộc tuyến tính trên $F$: tồn tại $c_0, c_1, \ldots, c_n \in F$ không toàn bằng $0$ sao cho $c_0 + c_1 \alpha + \cdots + c_n \alpha^n = 0$. Đặt $f(x) = c_0 + c_1 x + \cdots + c_n x^n \in F[x]$, ta có $f \neq 0$ và $f(\alpha) = 0$. Vậy $\alpha$ đại số trên $F$. $\blacksquare$

> [!warning] Counterexample 22.12 — Mở rộng đại số không nhất thiết hữu hạn
> $\overline{\mathbb{Q}} = \{\alpha \in \mathbb{C} \mid \alpha \text{ đại số trên } \mathbb{Q}\}$ là mở rộng đại số vô hạn của $\mathbb{Q}$: nó chứa mọi $\sqrt[n]{p}$, căn đơn vị bậc mọi $n$, v.v., nhưng $[\overline{\mathbb{Q}} : \mathbb{Q}] = \infty$.

> [!abstract] Theorem 22.13 — Tổ hợp của mở rộng đại số là đại số
> Nếu $K/F$ và $L/K$ đều là mở rộng đại số, thì $L/F$ cũng là mở rộng đại số.

**Proof.** Lấy tùy ý $\alpha \in L$. Vì $\alpha$ đại số trên $K$, tồn tại $m_\alpha(x) = x^n + k_{n-1}x^{n-1} + \cdots + k_0 \in K[x]$ với $m_\alpha(\alpha) = 0$. Các hệ số $k_0, \ldots, k_{n-1} \in K$ đều đại số trên $F$ (vì $K/F$ đại số). Xét chuỗi tháp:

$$
F \subseteq F(k_0) \subseteq F(k_0, k_1) \subseteq \cdots \subseteq F(k_0, \ldots, k_{n-1}) \subseteq F(k_0, \ldots, k_{n-1}, \alpha)
$$

Mỗi bước hữu hạn vì thêm một phần tử đại số. Vậy $[F(k_0, \ldots, k_{n-1}, \alpha) : F]$ hữu hạn, nên theo Theorem 22.11, $\alpha$ đại số trên $F$. $\blacksquare$

---

## SageMath Cheatsheet — Bài 22

```sage
# Tính đa thức tối tiểu

R.<x> = QQ[]

# Đa thức tối tiểu của sqrt(2) trên Q
K.<a> = NumberField(x^2 - 2)
a.minpoly()         # x^2 - 2

# Đa thức tối tiểu của sqrt(2)+sqrt(3) trên Q
L.<b> = NumberField(x^4 - 10*x^2 + 1)
b.minpoly()         # x^4 - 10*x^2 + 1

# Kiểm tra bất khả quy
f = x^3 - 2
f.is_irreducible()  # True

# Tính trong F(alpha) = Q[x]/(x^3-2)
K.<a> = NumberField(x^3 - 2)
K.degree()                  # 3
(1 + a) * (1 + a + a^2)    # 3*a^2 + 2*a + 3
a^(-1)                      # 1/2*a^2

# Lấy vector hệ số trong cơ sở {1, a, a^2}
v = 3 + 2*a + 2*a^2
v.list()                    # [3, 2, 2]
```

---

## Summary — Bài 22

- $\alpha \in K$ **đại số** trên $F$ $\Leftrightarrow$ $\exists f \in F[x]$, $f \neq 0$, $f(\alpha) = 0$.
- **Đa thức tối tiểu** $m_\alpha$: lũy đẳng, bất khả quy, bậc thấp nhất nhận $\alpha$ làm nghiệm.
- $F(\alpha) \cong F[x]/\langle m_\alpha(x) \rangle$ — cấu trúc hoàn toàn xác định bởi $m_\alpha$.
- $[F(\alpha):F] = \deg m_\alpha$.
- Cơ sở của $F(\alpha)$ trên $F$: $\{1, \alpha, \ldots, \alpha^{n-1}\}$ với $n = \deg m_\alpha$.
- Mở rộng hữu hạn $\Rightarrow$ mở rộng đại số. Ngược lại không đúng.
- Tổ hợp hai mở rộng đại số vẫn là mở rộng đại số.

---

## References — Bài 22

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §13.1–13.2.
- Lang, S. *Algebra* (3rd ed.), Chapter V §1.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 17.
