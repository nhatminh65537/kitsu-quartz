---
title: "21. Fields and Field Extensions"
type: math-component
tags: [math, groups-rings-fields, field-theory, lesson-21]
aliases: [Fields and Field Extensions, Field Theory, Lesson 21]
created: 2026-05-15
---

> **Prerequisites**: [[17-integral-domains-and-fields-of-fractions|17. Integral Domains and Fields of Fractions]], [[19-polynomial-rings|19. Polynomial Rings]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Trường số hữu tỉ |
> | $\mathbb{R}$ | Trường số thực |
> | $\mathbb{C}$ | Trường số phức |
> | $\mathbb{Z}/n\mathbb{Z}$ | Vành số nguyên modulo $n$ |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử, $\mathbb{Z}/p\mathbb{Z}$ với $p$ nguyên tố |
> | $\dim_F V$ | Số chiều của $F$-không gian vector $V$ |
> | $\ker\phi$ | Kernel của đồng cấu $\phi$ |

> **Objectives**:
> - Nắm vững định nghĩa trường (field) và nhận biết cấu trúc trường trong các đối tượng quen thuộc
> - Hiểu khái niệm mở rộng trường (field extension) và bậc của mở rộng $[K:F]$
> - Chứng minh và áp dụng Tower Law
> - Phân biệt mở rộng hữu hạn và mở rộng vô hạn

---

## Motivation

Trong các bài học trước về Ring Theory, ta đã thấy rằng $\mathbb{Z}/p\mathbb{Z}$ với $p$ nguyên tố là một vành đặc biệt: mọi phần tử khác $0$ đều khả nghịch. Đây là ví dụ đầu tiên của một **trường** (field) — cấu trúc đại số "đẹp nhất" trong hệ thống phân cấp: monoid → nhóm → vành → miền nguyên → trường.

Lý do trường quan trọng: **đại số tuyến tính hoạt động hoàn hảo trên trường**. Khi làm việc trên $\mathbb{R}$ hay $\mathbb{C}$, ta có thể chia — và phép chia là nền tảng của hầu hết mọi thuật toán. Nhưng điều gì xảy ra nếu ta muốn làm đại số tuyến tính trên $\mathbb{F}_2 = \{0, 1\}$? Hay giải phương trình đa thức trong một "số" chưa tồn tại như $\sqrt{-1}$?

**Lý thuyết mở rộng trường** (field extension theory) trả lời chính xác câu hỏi này: làm sao "tạo ra" một trường lớn hơn chứa nghiệm của một đa thức cho trước? Đây là cầu nối giữa đại số trừu tượng và lý thuyết số, mã hóa, và lý thuyết Galois.

---

## 1. Trường (Field)

> [!definition] Definition 21.1 — Trường (Field)
> Một **trường** (field) là một bộ $(F, +, \cdot)$ gồm tập hợp $F$ cùng hai phép toán hai ngôi thỏa mãn:
>
> 1. $(F, +)$ là nhóm Abel với phần tử đơn vị $0$.
> 2. $(F \setminus \{0\}, \cdot)$ là nhóm Abel với phần tử đơn vị $1$.
> 3. **Phân phối** (Distributivity): $\forall\, a, b, c \in F$,
>
> $$
> a \cdot (b + c) = a \cdot b + a \cdot c
> $$
>
> Nói cách khác, $F$ là một vành giao hoán có đơn vị trong đó mọi phần tử khác $0$ đều có nghịch đảo nhân.

> [!note] Remark 21.2 — So sánh với vành
> Mọi trường đều là một **miền nguyên** (integral domain): nếu $ab = 0$ thì $a = 0$ hoặc $b = 0$. Thật vậy, nếu $a \neq 0$ thì $a^{-1}$ tồn tại, và $ab = 0 \Rightarrow b = a^{-1} \cdot 0 = 0$. Tuy nhiên, chiều ngược lại không đúng: $\mathbb{Z}$ là miền nguyên nhưng không là trường vì $2$ không có nghịch đảo trong $\mathbb{Z}$.

> [!example] Example 21.3 — Các trường quen thuộc
> Các trường "kinh điển":
>
> - $\mathbb{Q}$: trường số hữu tỉ, $\operatorname{char}(\mathbb{Q}) = 0$.
> - $\mathbb{R}$: trường số thực, $\operatorname{char}(\mathbb{R}) = 0$.
> - $\mathbb{C}$: trường số phức, $\operatorname{char}(\mathbb{C}) = 0$.
> - $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$: trường hữu hạn với $p$ phần tử, $p$ nguyên tố, $\operatorname{char}(\mathbb{F}_p) = p$.
> - $\mathbb{F}_{p^n}$ ($\operatorname{GF}(p^n)$): trường hữu hạn với $p^n$ phần tử (sẽ xây dựng trong [[24-finite-fields-existence-and-uniqueness|24. Finite Fields]]).

---

## 2. Đặc số (Characteristic)

> [!definition] Definition 21.4 — Đặc số (Characteristic)
> **Đặc số** của trường $F$, ký hiệu $\operatorname{char}(F)$, là số nguyên dương nhỏ nhất $p$ sao cho
>
> $$
> \underbrace{1 + 1 + \cdots + 1}_{p \text{ lần}} = 0
> $$
>
> Nếu không tồn tại số $p$ như vậy, ta nói $\operatorname{char}(F) = 0$.

> [!abstract] Theorem 21.5 — Đặc số là 0 hoặc nguyên tố
> Đặc số của một trường $F$ hoặc bằng $0$ hoặc là số nguyên tố.

**Proof.** Gọi $\operatorname{char}(F) = n > 0$. Giả sử $n = ab$ với $1 \leq a, b < n$. Xét phần tử $\alpha = \underbrace{1 + \cdots + 1}_{a}$ và $\beta = \underbrace{1 + \cdots + 1}_{b}$ trong $F$. Ta có $\alpha \cdot \beta = \underbrace{1 + \cdots + 1}_{n} = 0$. Vì $F$ là miền nguyên, hoặc $\alpha = 0$ hoặc $\beta = 0$. Nếu $\alpha = 0$ thì $\underbrace{1+\cdots+1}_{a} = 0$, mâu thuẫn với $a < n = \operatorname{char}(F)$ (tính tối tiểu). Tương tự cho $\beta$. Vậy $n$ không thể phân tích thành tích hai số nhỏ hơn $n$, tức $n$ nguyên tố. $\blacksquare$

> [!definition] Definition 21.6 — Trường nguyên tố (Prime Subfield)
> **Trường nguyên tố** (prime subfield) của $F$ là trường con nhỏ nhất của $F$, ký hiệu $\operatorname{Prim}(F)$:
>
> - Nếu $\operatorname{char}(F) = 0$: $\operatorname{Prim}(F) \cong \mathbb{Q}$.
> - Nếu $\operatorname{char}(F) = p$: $\operatorname{Prim}(F) \cong \mathbb{F}_p$.

**Proof (sketch).** Ánh xạ $\phi: \mathbb{Z} \to F$ xác định bởi $\phi(n) = \underbrace{1+\cdots+1}_{n}$ là đồng cấu vành. Nếu $\operatorname{char}(F) = p$, thì $\ker \phi = p\mathbb{Z}$, nên $\operatorname{Im}(\phi) \cong \mathbb{Z}/p\mathbb{Z} = \mathbb{F}_p$. Nếu $\operatorname{char}(F) = 0$, thì $\phi$ đơn cấu, và ta mở rộng sang $\mathbb{Q}$ bằng cách thêm nghịch đảo. $\blacksquare$

---

## 3. Mở rộng trường (Field Extension)

> [!definition] Definition 21.7 — Mở rộng trường (Field Extension)
> Cho $F \subseteq K$ là hai trường. Ta nói $K$ là một **mở rộng** của $F$ (hoặc $K/F$ là một mở rộng trường), ký hiệu $K/F$, nếu các phép toán của $F$ là thu hẹp của phép toán $K$.
>
> Trong tình huống này:
> - $F$ gọi là **trường cơ sở** (base field) hay trường **dưới** (ground field).
> - $K$ gọi là trường **trên** (extension field).
> - $K$ nhìn nhận tự nhiên như một **không gian vector** (vector space) trên $F$.

> [!definition] Definition 21.8 — Bậc của mở rộng (Degree of Extension)
> **Bậc** của mở rộng $K/F$, ký hiệu $[K : F]$, là **số chiều** của $K$ như một không gian vector trên $F$:
>
> $$
> [K : F] = \dim_F K
> $$
>
> - Nếu $[K:F] < \infty$, ta gọi $K/F$ là **mở rộng hữu hạn** (finite extension).
> - Nếu $[K:F] = \infty$, ta gọi $K/F$ là **mở rộng vô hạn** (infinite extension).

> [!example] Example 21.9 — Tính bậc một số mở rộng cơ bản
> **(a)** $[\mathbb{C} : \mathbb{R}] = 2$.
> Cơ sở của $\mathbb{C}$ như $\mathbb{R}$-không gian vector là $\{1, i\}$, vì mọi $a + bi \in \mathbb{C}$ đều viết được duy nhất dưới dạng $a \cdot 1 + b \cdot i$ với $a, b \in \mathbb{R}$.
>
> **(b)** $[\mathbb{Q}(\sqrt{2}) : \mathbb{Q}] = 2$.
> Đặt $\mathbb{Q}(\sqrt{2}) = \{a + b\sqrt{2} \mid a, b \in \mathbb{Q}\}$. Cơ sở là $\{1, \sqrt{2}\}$. Độc lập tuyến tính: nếu $a + b\sqrt{2} = 0$ với $a, b \in \mathbb{Q}$ thì $b = 0$ (vì $\sqrt{2} \notin \mathbb{Q}$), rồi $a = 0$.
>
> **(c)** $[\mathbb{Q}(\sqrt[3]{2}) : \mathbb{Q}] = 3$.
> Cơ sở là $\{1, \sqrt[3]{2}, \sqrt[3]{4}\}$. Đa thức tối tiểu của $\sqrt[3]{2}$ là $x^3 - 2$, bậc $3$ (sẽ chứng minh trong [[22-algebraic-elements-and-minimal-polynomials|22. Algebraic Elements]]).
>
> **(d)** $[\mathbb{R} : \mathbb{Q}] = \infty$.
> $\mathbb{R}$ không có cơ sở hữu hạn trên $\mathbb{Q}$ (cơ sở của $\mathbb{R}$ là không đếm được).

---

## 4. Tower Law (Định lý tháp)

> [!abstract] Theorem 21.10 — Tower Law
> Cho $F \subseteq K \subseteq L$ là ba trường với $L/K$ và $K/F$ đều là mở rộng hữu hạn. Khi đó $L/F$ hữu hạn và:
>
> $$
> [L : F] = [L : K] \cdot [K : F]
> $$

**Proof.** Đặt $[K:F] = m$ và $[L:K] = n$. Gọi $\{v_1, \ldots, v_m\}$ là cơ sở của $K$ trên $F$ và $\{w_1, \ldots, w_n\}$ là cơ sở của $L$ trên $K$. Ta chứng minh $\{v_i w_j \mid 1 \leq i \leq m,\, 1 \leq j \leq n\}$ là cơ sở của $L$ trên $F$.

**Sinh:** Lấy tùy ý $l \in L$. Vì $\{w_j\}$ sinh $L$ trên $K$, ta có $l = \sum_j k_j w_j$ với $k_j \in K$. Vì $\{v_i\}$ sinh $K$ trên $F$, ta có $k_j = \sum_i f_{ij} v_i$ với $f_{ij} \in F$. Thay vào:

$$
l = \sum_j \left(\sum_i f_{ij} v_i\right) w_j = \sum_{i,j} f_{ij} (v_i w_j)
$$

Vậy $\{v_i w_j\}$ sinh $L$ trên $F$.

**Độc lập tuyến tính:** Giả sử $\sum_{i,j} f_{ij} (v_i w_j) = 0$ với $f_{ij} \in F$. Viết lại:

$$
\sum_j \left(\sum_i f_{ij} v_i\right) w_j = 0
$$

Đặt $k_j = \sum_i f_{ij} v_i \in K$. Vì $\{w_j\}$ độc lập tuyến tính trên $K$, ta có $k_j = 0$ với mọi $j$, tức $\sum_i f_{ij} v_i = 0$. Vì $\{v_i\}$ độc lập tuyến tính trên $F$, ta có $f_{ij} = 0$ với mọi $i, j$.

Vậy $\{v_i w_j\}$ là cơ sở, và $[L:F] = mn = [L:K] \cdot [K:F]$. $\blacksquare$

> [!example] Example 21.11 — Áp dụng Tower Law
> Xét chuỗi $\mathbb{Q} \subseteq \mathbb{Q}(\sqrt{2}) \subseteq \mathbb{Q}(\sqrt{2}, \sqrt{3})$.
>
> - $[\mathbb{Q}(\sqrt{2}) : \mathbb{Q}] = 2$ (min poly $x^2 - 2$).
> - $[\mathbb{Q}(\sqrt{2}, \sqrt{3}) : \mathbb{Q}(\sqrt{2})] = 2$: ta cần $\sqrt{3} \notin \mathbb{Q}(\sqrt{2})$. Nếu $\sqrt{3} = a + b\sqrt{2}$ với $a, b \in \mathbb{Q}$ thì bình phương hai vế: $3 = a^2 + 2b^2 + 2ab\sqrt{2}$, suy ra $ab = 0$. Nếu $b = 0$ thì $\sqrt{3} = a \in \mathbb{Q}$, vô lý. Nếu $a = 0$ thì $\sqrt{3} = b\sqrt{2}$, suy ra $\sqrt{3/2} = b \in \mathbb{Q}$, vô lý. Vậy $\sqrt{3} \notin \mathbb{Q}(\sqrt{2})$.
> - Tower Law: $[\mathbb{Q}(\sqrt{2}, \sqrt{3}) : \mathbb{Q}] = 2 \cdot 2 = 4$.
>
> Cơ sở của $\mathbb{Q}(\sqrt{2}, \sqrt{3})$ trên $\mathbb{Q}$ là $\{1, \sqrt{2}, \sqrt{3}, \sqrt{6}\}$.

> [!abstract] Corollary 21.12 — Bậc mở rộng thành phần chia bậc toàn phần
> Nếu $F \subseteq K \subseteq L$ và $[L:F]$ hữu hạn thì $[K:F]$ và $[L:K]$ đều hữu hạn và chia $[L:F]$.

---

## 5. Mở rộng đơn (Simple Extension)

> [!definition] Definition 21.13 — Mở rộng đơn (Simple Extension)
> Cho $K/F$ là mở rộng trường và $\alpha \in K$. **Mở rộng đơn** sinh bởi $\alpha$ là trường con nhỏ nhất của $K$ chứa $F$ và $\alpha$, ký hiệu:
>
> $$
> F(\alpha) = \bigcap \{E \mid F \subseteq E \subseteq K,\; \alpha \in E,\; E \text{ là trường}\}
> $$
>
> Tổng quát hơn, $F(\alpha_1, \ldots, \alpha_n)$ là trường con nhỏ nhất chứa $F$ và $\alpha_1, \ldots, \alpha_n$.

> [!note] Remark 21.14 — Mô tả tường minh của $F(\alpha)$
> Nếu $\alpha$ **đại số** trên $F$ (sẽ định nghĩa trong [[22-algebraic-elements-and-minimal-polynomials|22. Algebraic Elements]]), thì:
>
> $$
> F(\alpha) = \left\{ \frac{f(\alpha)}{g(\alpha)} \;\middle|\; f, g \in F[x],\; g(\alpha) \neq 0 \right\}
> $$
>
> Nhưng trong trường hợp này ta sẽ thấy $F(\alpha) = F[\alpha] = \{f(\alpha) \mid f \in F[x]\}$ (không cần mẫu) vì $F(\alpha)$ hữu hạn chiều trên $F$. Nếu $\alpha$ **siêu việt** (transcendental), thì $F(\alpha) \cong F(x)$ (trường phân thức của $F[x]$).

---

## SageMath Cheatsheet — Bài 21

```sage
# Định nghĩa mở rộng trường trong SageMath

R.<x> = QQ[]

# Q(sqrt(2))
K.<a> = NumberField(x^2 - 2)
K.degree()          # = 2, tức [K:Q] = 2
K.power_basis()     # [1, a]

# Q(sqrt(2), sqrt(3))
R.<x> = QQ[]
K.<a> = NumberField(x^2 - 2)
L.<b> = K.extension(x^2 - 3)
L.relative_degree()     # = 2, tức [L:K] = 2
L.absolute_degree()     # = 4, tức [L:Q] = 4

# Trường hữu hạn F_p
F = GF(7)
F.characteristic()  # = 7
F.prime_subfield()  # GF(7)

# Mở rộng trường hữu hạn F_{p^n}
F16 = GF(2^4)
F16.degree()        # = 4 (degree over GF(2))
F16.characteristic()# = 2
```

---

## Summary — Bài 21

- **Trường** = vành giao hoán có đơn vị + mọi phần tử $\neq 0$ khả nghịch $\Rightarrow$ mọi trường là miền nguyên.
- **Đặc số** $\operatorname{char}(F)$ là $0$ hoặc một số nguyên tố $p$.
- **Trường nguyên tố** của $F$: $\cong \mathbb{Q}$ nếu $\operatorname{char}=0$; $\cong \mathbb{F}_p$ nếu $\operatorname{char}=p$.
- **Mở rộng trường** $K/F$: $K$ là không gian vector trên $F$.
- **Bậc** $[K:F] = \dim_F K$.
- **Tower Law**: $[L:F] = [L:K] \cdot [K:F]$ — công cụ tính bậc cơ bản nhất.
- Mở rộng hữu hạn $\Leftrightarrow$ $K$ hữu hạn chiều như $F$-không gian vector.

---

## References — Bài 21

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 13.
- Lang, S. *Algebra* (3rd ed.), Chapter V.
- Hungerford, T. W. *Algebra*, Chapter V.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 17.
