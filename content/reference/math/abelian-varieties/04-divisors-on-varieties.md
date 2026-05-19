---
title: "04. Divisors on Varieties"
tags: [math, abelian-varieties, lesson-04]
aliases: [Divisors on Varieties]
created: 2026-05-17
---

> **Prerequisites**: [[01-affine-projective-varieties|01. Affine and Projective Varieties]], [[02-morphisms-of-varieties|02. Morphisms of Varieties]], [[03-completeness-and-proper-maps|03. Completeness and Proper Maps]] — affine/projective variety, morphism, function field.
> **Objectives**:
> - Hiểu ước (divisor) như "vật đếm zeros và poles" của hàm hữu tỉ
> - Định nghĩa Weil divisor và Cartier divisor, phân biệt hai cách tiếp cận
> - Xây dựng nhóm ước $\operatorname{Div}(X)$, ước chính (principal divisor), lớp ước (divisor class group)
> - Hiểu tương đương tuyến tính (linear equivalence) và ứng dụng trên đường cong elliptic

---

## Motivation / Intuition

Trong giải tích phức, một hàm hữu tỉ $f(z) = (z-a_1)^{n_1}(z-a_2)^{n_2}\cdots(z-b_1)^{-m_1}\cdots$ được đặc trưng hoàn toàn bởi tập zeros (với bội số) và poles (với bội số) của nó. Dữ liệu này — một "danh sách" các điểm với số nguyên — gọi là **ước** (divisor) của $f$.

Trong hình học đại số, ý tưởng tương tự nhưng tổng quát hơn: thay vì điểm trên $\mathbb{C}$, ta có các *subvariety codimension 1* (ví dụ: trên đường cong, đó là các điểm; trên mặt, đó là các đường cong con), mỗi cái gắn với một số nguyên (bội số).

Divisors là ngôn ngữ tự nhiên để nói về "cực" và "zero" của hàm số trên variety, và dẫn đến khái niệm **bó đường** (line bundle) — công cụ trung tâm trong lý thuyết abelian variety.

---

## Đa Tạp Trơn (Smooth Variety)

Trước khi định nghĩa divisor, ta cần giả thiết variety là **trơn** (smooth), vì divisors gắn với cấu trúc cục bộ tốt.

> [!definition] Definition 4.1 — Điểm trơn và đa tạp trơn (Smooth Point & Smooth Variety)
> Cho $X \subseteq \mathbb{A}^n$ là affine variety và $P \in X$. Điểm $P$ được gọi là **trơn** (smooth, hay nonsingular) nếu hạng (rank) của **ma trận Jacobi** của hệ phương trình định nghĩa $X$ tại $P$ bằng $n - \dim X$.
>
> Tương đương: $\mathcal{O}_{X,P}$ (vành local tại $P$) là vành chính quy local (regular local ring) — tức $\dim_k \mathfrak{m}_P/\mathfrak{m}_P^2 = \dim X$ với $\mathfrak{m}_P$ là ideal cực đại.
>
> $X$ là **đa tạp trơn** nếu mọi điểm đều trơn.

> [!example] Example 4.2 — Elliptic curve là smooth
> Đường cong elliptic $E: y^2 = x^3 + ax + b$ trơn khi và chỉ khi $\Delta = -16(4a^3 + 27b^2) \neq 0$. Đây chính là điều kiện ta đặt ra khi định nghĩa $E$ là đường cong elliptic — đảm bảo không có điểm kỳ dị (singular point).
>
> Tại điểm $P = (x_0, y_0) \in E$, Jacobi của $f = y^2 - x^3 - ax - b$ là $\nabla f = (-3x_0^2 - a, 2y_0)$. Nếu cả hai thành phần triệt tiêu thì $P$ là singular. Điều kiện $\Delta \neq 0$ chính xác là điều kiện loại trừ trường hợp này.

---

## Weil Divisors

> [!definition] Definition 4.3 — Ước nguyên tố và nhóm ước Weil
> Cho $X$ là smooth variety (irreducible).
>
> Một **prime Weil divisor** (ước nguyên tố Weil) của $X$ là một subvariety $Z \subseteq X$ bất khả quy, codimension $1$ (tức $\dim Z = \dim X - 1$).
>
> **Nhóm ước Weil** (Weil divisor group) là nhóm Abel tự do sinh bởi các prime divisors:
>
> $$
> \operatorname{Div}(X) = \left\{ D = \sum_Z n_Z \cdot Z \;\middle|\; n_Z \in \mathbb{Z}, \text{ chỉ hữu hạn số } n_Z \neq 0 \right\}.
> $$
>
> Phần tử $D = \sum_Z n_Z \cdot Z$ gọi là **Weil divisor** (ước Weil). Nếu mọi $n_Z \geq 0$, ta gọi $D$ là **ước hiệu quả** (effective divisor), ký hiệu $D \geq 0$.

**Trong trường hợp đường cong** ($\dim X = 1$): prime divisors chính là các điểm đóng. Vậy:

$$
\operatorname{Div}(C) = \left\{ \sum_{P \in C} n_P \cdot P \;\middle|\; n_P \in \mathbb{Z}, \text{ hữu hạn số } n_P \neq 0 \right\}.
$$

> [!definition] Definition 4.4 — Bậc (Degree) của divisor trên đường cong
> Với $C$ là đường cong xạ ảnh trơn và $D = \sum n_P \cdot P \in \operatorname{Div}(C)$, **bậc** của $D$ là:
>
> $$
> \deg(D) = \sum_P n_P \in \mathbb{Z}.
> $$
>
> Ánh xạ $\deg: \operatorname{Div}(C) \to \mathbb{Z}$ là homomorphism nhóm. Nhân $\operatorname{Div}^0(C) = \ker(\deg)$ là nhóm các divisors bậc $0$.

---

## Định Giá Tại Điểm Trơn (Valuation)

> [!definition] Definition 4.5 — Định giá Zariski (Local Valuation at a Point)
> Cho $X$ là smooth variety và $Z \subseteq X$ prime divisor. Vành local $\mathcal{O}_{X,Z}$ là DVR (discrete valuation ring) — vành định giá rời rạc. **Định giá** (valuation) tại $Z$ là homomorphism:
>
> $$
> v_Z: k(X)^\times \to \mathbb{Z}
> $$
>
> sao cho $v_Z(f) > 0$ nếu $f$ có zero trên $Z$, $v_Z(f) < 0$ nếu $f$ có cực trên $Z$, và $v_Z(f) = 0$ nếu $f$ xác định và không triệt tiêu tại một điểm generic của $Z$.
>
> Với đường cong, $Z = \{P\}$ là điểm và $v_P: k(C)^\times \to \mathbb{Z}$ là **bội số triệt tiêu** (order of vanishing) tại $P$.

> [!example] Example 4.6 — Valuation trên $\mathbb{A}^1$
> Với $C = \mathbb{A}^1 = \operatorname{Spec}(k[t])$ và $P = (a) \in \mathbb{A}^1$, valuation tại $P$ là:
>
> $$
> v_P(f) = \text{bội số của nghiệm } a \text{ trong } f(t).
> $$
>
> Ví dụ: $v_{t=0}(t^3(t-1)) = 3$; $v_{t=0}(1/(t^2)) = -2$; $v_{t=0}(t+1) = 0$.

---

## Ước Tử Chính (Principal Divisors)

> [!definition] Definition 4.7 — Ước tử chính (Principal Divisor)
> Cho $f \in k(X)^\times$ là hàm hữu tỉ không tầm thường. **Ước tử** của $f$ là:
>
> $$
> \operatorname{div}(f) = \sum_Z v_Z(f) \cdot Z \in \operatorname{Div}(X).
> $$
>
> (Tổng hữu hạn vì $f$ chỉ có hữu hạn zeros/poles trên variety compact.)
>
> Tập tất cả ước tử chính:
>
> $$
> \operatorname{PDiv}(X) = \left\{ \operatorname{div}(f) \;\middle|\; f \in k(X)^\times \right\} \subseteq \operatorname{Div}(X).
> $$

> [!theorem] Theorem 4.8 — $\operatorname{div}: k(X)^\times \to \operatorname{Div}(X)$ là homomorphism
> Ánh xạ $\operatorname{div}$ thỏa mãn:
>
> $$
> \operatorname{div}(fg) = \operatorname{div}(f) + \operatorname{div}(g), \quad \operatorname{div}(f^{-1}) = -\operatorname{div}(f).
> $$
>
> Tức $\operatorname{PDiv}(X)$ là subgroup của $\operatorname{Div}(X)$.

**Proof.** Trực tiếp từ tính chất của valuation: $v_Z(fg) = v_Z(f) + v_Z(g)$. $\blacksquare$

> [!theorem] Theorem 4.9 — Bậc của ước tử chính trên đường cong là 0
> Cho $C$ là đường cong xạ ảnh trơn và $f \in k(C)^\times$. Khi đó:
>
> $$
> \deg(\operatorname{div}(f)) = 0.
> $$

**Proof (sketch).** Đây là hệ quả của định lý Riemann–Hurwitz hoặc có thể chứng minh qua tích phân vòng (residue formula): tổng bội số của zeros bằng tổng bội số của poles cho mọi hàm hữu tỉ trên đường cong compact. Xem Silverman *AEC* Theorem II.3.1. $\blacksquare$

**Kết quả**: $\operatorname{div}: k(C)^\times \to \operatorname{Div}^0(C)$ là homomorphism nhóm (vào subgroup bậc-0).

> [!example] Example 4.10 — Ước tử của hàm hữu tỉ trên $\mathbb{P}^1$
> Trên $\mathbb{P}^1$, xét hàm $f(t) = (t-a)/(t-b)$ với $a \neq b$. Ở dạng tọa độ thuần nhất $[X:Y]$, $t = X/Y$:
>
> $$
> f = \frac{X - aY}{X - bY}.
> $$
>
> Zero: tại $[a:1]$ với bội $+1$. Pole: tại $[b:1]$ với bội $-1$. Vậy:
>
> $$
> \operatorname{div}(f) = [a:1] - [b:1], \quad \deg(\operatorname{div}(f)) = 1 - 1 = 0. \checkmark
> $$

---

## Tương Đương Tuyến Tính (Linear Equivalence)

> [!definition] Definition 4.11 — Tương đương tuyến tính và nhóm lớp ước
> Hai Weil divisors $D_1, D_2 \in \operatorname{Div}(X)$ được gọi là **tương đương tuyến tính** (linearly equivalent), ký hiệu $D_1 \sim D_2$, nếu hiệu $D_1 - D_2 = \operatorname{div}(f)$ cho một $f \in k(X)^\times$ nào đó.
>
> Đây là quan hệ tương đương. **Nhóm lớp ước** (divisor class group) là nhóm thương:
>
> $$
> \operatorname{Cl}(X) = \operatorname{Div}(X) / \operatorname{PDiv}(X) = \operatorname{Div}(X) / \!\sim.
> $$

> [!example] Example 4.12 — Lớp ước trên $\mathbb{P}^1$
> Trên $\mathbb{P}^1$, mọi hai điểm $P, Q \in \mathbb{P}^1$ đều tương đương tuyến tính: $[P] \sim [Q]$ vì $(t-a)/(t-b)$ là hàm hữu tỉ với $\operatorname{div} = [P]-[Q]$.
>
> Vậy $\operatorname{Cl}(\mathbb{P}^1) \cong \mathbb{Z}$ sinh bởi lớp của bất kỳ điểm nào. Isomorphism là ánh xạ bậc $\deg: \operatorname{Cl}(\mathbb{P}^1) \xrightarrow{\sim} \mathbb{Z}$.

---

## Cartier Divisors

Weil divisors được định nghĩa **toàn cục** bằng tổ hợp hình thức. **Cartier divisors** (ước Cartier) được định nghĩa **locally** bằng dữ liệu local — gần với cách ta thực sự "nhìn" vào một hàm:

> [!definition] Definition 4.13 — Cartier Divisor
> Một **Cartier divisor** trên $X$ là dữ liệu $\{(U_i, f_i)\}$ trong đó:
>
> - $\{U_i\}$ là phủ mở của $X$.
> - $f_i \in k(X)^\times$ là hàm hữu tỉ "local equation" trên $U_i$.
> - Trên $U_i \cap U_j$: $f_i / f_j \in \mathcal{O}^\times_{X}(U_i \cap U_j)$ — tức tỉ số là hàm chính quy không triệt tiêu.
>
> Hai bộ dữ liệu $\{(U_i, f_i)\}$ và $\{(V_j, g_j)\}$ xác định cùng Cartier divisor nếu trên mọi $U_i \cap V_j$, tỉ số $f_i/g_j$ là đơn vị chính quy.

**Nhóm ước Cartier** $\operatorname{CDiv}(X)$ với phép toán nhân: $\{(U_i, f_i)\} + \{(U_i, g_i)\} = \{(U_i, f_i g_i)\}$.

> [!theorem] Theorem 4.14 — Weil = Cartier trên smooth variety
> Nếu $X$ là smooth variety, thì có đẳng cấu tự nhiên:
>
> $$
> \operatorname{CDiv}(X) \xrightarrow{\sim} \operatorname{Div}(X).
> $$

**Proof.** Vì $X$ trơn, mọi $\mathcal{O}_{X,Z}$ là DVR. Cho Cartier divisor $\{(U_i, f_i)\}$, định nghĩa Weil divisor $D = \sum_Z v_Z(f_i) \cdot Z$ (với $Z \cap U_i \neq \emptyset$). Điều kiện gluing $f_i/f_j \in \mathcal{O}^\times$ đảm bảo $v_Z(f_i) = v_Z(f_j)$, nên $D$ xác định tốt. $\blacksquare$

---

## Ước Trên Elliptic Curve — Ví Dụ Chủ Đạo

> [!example] Example 4.15 — $\operatorname{Div}(E)$ và divisors bậc 0
> Trên đường cong elliptic $E$ (genus $1$), mọi divisor là tổ hợp hình thức $D = \sum_{P \in E} n_P \cdot [P]$ với $n_P \in \mathbb{Z}$ và hữu hạn $n_P \neq 0$.
>
> **Bậc**: $\deg(D) = \sum_P n_P$.
>
> **Divisors bậc 0**: $\operatorname{Div}^0(E) = \ker(\deg)$.
>
> **Ước tử chính**: $\operatorname{PDiv}(E) \subseteq \operatorname{Div}^0(E)$ (Theorem 4.9).

> [!example] Example 4.16 — Hàm $x - x_0$ và ước tử của nó trên $E$
> Cho $P_0 = (x_0, y_0) \in E$ với $y_0 \neq 0$ và $P_0' = (x_0, -y_0)$ là điểm đối nghịch. Xét hàm $f = x - x_0 \in k(E)$.
>
> Vì $(x-x_0) | (y^2 - x^3 - ax - b)$ khi $y_0 = 0$, nhưng với $y_0 \neq 0$: hàm $x - x_0$ có zeros tại $P_0$ và $P_0'$ (cả hai có $x$-tọa độ $x_0$) với bội 1. Nó có pole tại $\mathcal{O} = [0:1:0]$ với bội 2 (vì $\mathcal{O}$ là điểm zero bậc $2$ của tọa độ $x$). Vậy:
>
> $$
> \operatorname{div}(x - x_0) = [P_0] + [P_0'] - 2[\mathcal{O}].
> $$
>
> Kiểm tra: $\deg = 1 + 1 - 2 = 0$. ✓

> [!example] Example 4.17 — Đường thẳng cắt $E$
> Đường thẳng $\ell: y = \alpha x + \beta$ cắt $E$ tại đúng 3 điểm (đếm với bội số), gọi là $P_1, P_2, P_3$. Hàm $f = y - \alpha x - \beta \in k(E)$ có:
>
> $$
> \operatorname{div}(y - \alpha x - \beta) = [P_1] + [P_2] + [P_3] - 3[\mathcal{O}].
> $$
>
> Điều này chính là nền tảng của **luật nhóm trên $E$**: $P_1 + P_2 + P_3 = \mathcal{O}$ trong nhóm $E(k)$!

---

## Divisors Đặc Biệt và Linear Series

> [!definition] Definition 4.18 — Linear series
> Cho $D \in \operatorname{Div}(X)$ là effective divisor. **Linear series** liên quan đến $D$ là:
>
> $$
> |D| = \left\{ D' \in \operatorname{Div}(X) \;\middle|\; D' \sim D, D' \geq 0 \right\}
> $$
>
> — tập tất cả effective divisors tương đương tuyến tính với $D$. Tập này tương ứng tự nhiên với không gian xạ ảnh $\mathbb{P}(H^0(X, \mathcal{O}(D)))$ (sẽ được phát triển ở Bài 05).

> [!example] Example 4.19 — Divisors và Riemann–Roch trên $E$
> Trên đường cong genus $g$ (Riemann–Roch):
>
> $$
> \ell(D) - \ell(K_C - D) = \deg(D) - g + 1
> $$
>
> với $\ell(D) = \dim H^0(C, \mathcal{O}(D))$ và $K_C$ là **canonical divisor**. Với $E$ (genus $1$):
>
> - $D = n[\mathcal{O}]$, $n \geq 1$: $\ell(D) = n$.
> - $D = [P]$ với $P \neq \mathcal{O}$: $\ell(D) = 1$ (chỉ có hằng số).

---

## SageMath Cheatsheet

```python
E = EllipticCurve(QQ, [1, 1])
P = E([0, 1])
Q = E([1, -1])

print(P + Q)
print(3 * P)
print(-P)
```

```python
k = GF(97)
E = EllipticCurve(k, [2, 3])
P = E.random_point()
print(P)
print(P.order())
```

```python
from sage.schemes.curves.all import *
k = QQ
A2 = AffineSpace(k, 2, names='x,y')
x, y = A2.coordinate_ring().gens()
C = A2.curve(y^2 - x^3 - x - 1)
```

---

## Summary / Key Takeaways

- **Weil divisor**: tổ hợp nguyên hình thức của prime divisors — $D = \sum n_Z Z$.
- Trên **đường cong**: prime divisors = điểm; $D = \sum n_P [P]$.
- **Bậc** $\deg(D) = \sum n_P$; **ước hiệu quả** $D \geq 0$ nếu mọi $n_P \geq 0$.
- **Principal divisor**: $\operatorname{div}(f) = \sum v_Z(f) \cdot Z$; trên đường cong xạ ảnh $\deg(\operatorname{div}(f)) = 0$.
- **Tương đương tuyến tính**: $D_1 \sim D_2 \iff D_1 - D_2 = \operatorname{div}(f)$.
- **Nhóm lớp ước**: $\operatorname{Cl}(X) = \operatorname{Div}(X)/\operatorname{PDiv}(X)$.
- **Cartier divisor**: định nghĩa local, tương đương với Weil trên smooth variety.
- Trên $E$: luật nhóm ↔ tương đương tuyến tính divisors; $\operatorname{Cl}^0(E) \cong E(k)$ (tiếp tục ở Bài 05).

---

## References

- Hartshorne, R. *Algebraic Geometry* (GTM 52), Chapter II §6.
- Silverman, J.H. *The Arithmetic of Elliptic Curves* (GTM 106), Chapter II.
- Milne, J.S. *Algebraic Geometry* (v6.02), Chapter 14.
- Liu, Q. *Algebraic Geometry and Arithmetic Curves*, Chapter 7.
