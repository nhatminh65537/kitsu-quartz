---
title: "16. Ring Homomorphisms and Isomorphism Theorems"
type: math-component
tags: [math, groups-rings-fields, ring-theory, homomorphisms, lesson-16]
aliases: [Ring Homomorphisms and Isomorphism Theorems]
created: 2026-05-15
---

> **Prerequisites**: [[15-ideals-and-quotient-rings|15. Ideals and Quotient Rings]] — vành thương, correspondence theorem; [[12-group-homomorphisms-and-isomorphism-theorems|12. Group Homomorphisms and Isomorphism Theorems]] — đồng cấu nhóm, định lý đẳng cấu nhóm.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{C}$ | Tập số phức |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $\mathbb{Z}[i]$ | Vành số nguyên Gauss |
> | $R[x]$ | Vành đa thức với hệ số trong $R$ |
> | $M_n(R)$ | Vành ma trận vuông $n \times n$ trên $R$ |
> | $\ker\varphi$ | Kernel của đồng cấu $\varphi$ |
> | $\operatorname{Im}\varphi$ | Ảnh của đồng cấu $\varphi$ |
> | $\cong$ | Đẳng cấu (isomorphism) |

> **Objectives**:
> - Định nghĩa đồng cấu vành và kiểm tra các tính chất cơ bản
> - Chứng minh rằng kernel của đồng cấu vành là ideal hai phía
> - Phát biểu và chứng minh ba định lý đẳng cấu vành
> - Áp dụng định lý đẳng cấu thứ nhất để xác định cấu trúc vành thương

---

## Motivation / Intuition

Trong đại số, đồng cấu (homomorphism) là ánh xạ "tôn trọng cấu trúc". Đối với nhóm, ta chỉ cần tôn trọng một phép toán. Đối với vành, ta phải tôn trọng **cả hai** phép toán — phép cộng và phép nhân — đồng thời.

Tại sao lại quan tâm đến đồng cấu vành? Vì chúng là công cụ chính để:
1. **So sánh** hai vành với nhau.
2. **Xây dựng** các vành mới bằng cách lấy ảnh hoặc vành thương.
3. **Nhận dạng** các vành "cải trang" — ví dụ $\mathbb{R}[x]/\langle x^2+1 \rangle \cong \mathbb{C}$.
4. **Chuyển bài toán** từ vành phức tạp sang vành đơn giản hơn.

---

## Định nghĩa và tính chất cơ bản

> [!definition] Definition 16.1 — Đồng cấu vành (Ring Homomorphism)
> Cho $(R, +_R, \cdot_R)$ và $(S, +_S, \cdot_S)$ là hai vành. Ánh xạ $\varphi: R \to S$ gọi là **đồng cấu vành** nếu với mọi $a, b \in R$:
>
> $$
> \varphi(a +_R b) = \varphi(a) +_S \varphi(b)
> $$
>
> $$
> \varphi(a \cdot_R b) = \varphi(a) \cdot_S \varphi(b)
> $$
>
> Ngoài ra, nếu $R$ và $S$ là các vành có đơn vị, ta thường thêm điều kiện:
>
> $$
> \varphi(1_R) = 1_S
> $$
>
> (đồng cấu vành có đơn vị — unital ring homomorphism).

> [!note] Remark 16.2 — Về điều kiện $\varphi(1_R) = 1_S$
> Không phải mọi tài liệu đều yêu cầu $\varphi(1_R) = 1_S$. Dummit & Foote yêu cầu điều này đối với vành có đơn vị. Trong khóa học này, khi làm việc với vành có đơn vị, ta luôn giả sử đồng cấu vành bảo toàn phần tử đơn vị.
>
> **Ví dụ**: Ánh xạ $\varphi: \mathbb{Z} \to M_2(\mathbb{Z})$, $\varphi(n) = \begin{pmatrix}n & 0 \\ 0 & 0\end{pmatrix}$ thỏa $\varphi(mn) = \varphi(m)\varphi(n)$ và $\varphi(m+n) = \varphi(m)+\varphi(n)$, nhưng $\varphi(1) = \begin{pmatrix}1&0\\0&0\end{pmatrix} \neq I_2 = 1_{M_2}$, nên đây **không** phải đồng cấu vành có đơn vị.

> [!definition] Definition 16.3 — Kernel, Image, Đẳng cấu
> Cho $\varphi: R \to S$ là đồng cấu vành:
>
> - **Kernel**: $\ker \varphi = \{a \in R : \varphi(a) = 0_S\}$
> - **Image**: $\operatorname{Im} \varphi = \varphi(R) = \{\varphi(a) : a \in R\}$
> - $\varphi$ là **đơn cấu** (monomorphism/injection) nếu $\varphi$ là đơn ánh.
> - $\varphi$ là **toàn cấu** (epimorphism/surjection) nếu $\varphi$ là toàn ánh.
> - $\varphi$ là **đẳng cấu** (isomorphism) nếu $\varphi$ là song ánh. Ký hiệu: $R \cong S$.

> [!abstract] Theorem 16.4 — Kernel là ideal, Image là vành con
> Cho $\varphi: R \to S$ là đồng cấu vành. Khi đó:
>
> 1. $\ker \varphi \trianglelefteq R$ (ideal hai phía của $R$).
> 2. $\operatorname{Im} \varphi$ là vành con (subring) của $S$.
> 3. $\varphi$ là đơn cấu $\Leftrightarrow$ $\ker \varphi = \{0_R\}$.

**Proof của (1).**
*Nhóm con cộng*: $\varphi(0_R) = \varphi(0_R + 0_R) = \varphi(0_R) + \varphi(0_R)$, cộng $-\varphi(0_R)$ hai vế: $\varphi(0_R) = 0_S$. Vậy $0_R \in \ker\varphi$.

Nếu $a, b \in \ker\varphi$: $\varphi(a - b) = \varphi(a) - \varphi(b) = 0 - 0 = 0$, nên $a - b \in \ker\varphi$.

*Đóng với nhân từ R*: Lấy $r \in R$, $a \in \ker\varphi$. Khi đó $\varphi(ra) = \varphi(r)\varphi(a) = \varphi(r) \cdot 0 = 0$, nên $ra \in \ker\varphi$. Tương tự $ar \in \ker\varphi$.

Vậy $\ker\varphi$ là ideal hai phía. $\blacksquare$

**Proof của (3).**
$\varphi$ đơn ánh $\Leftrightarrow$ $\varphi(a) = \varphi(b) \Rightarrow a = b$ $\Leftrightarrow$ $\varphi(a - b) = 0 \Rightarrow a = b$ $\Leftrightarrow$ $\ker\varphi = \{0\}$. $\blacksquare$

---

## Ba định lý đẳng cấu vành

> [!abstract] Theorem 16.5 — Định lý đẳng cấu thứ nhất (First Isomorphism Theorem for Rings)
> Cho $\varphi: R \to S$ là đồng cấu vành. Khi đó:
>
> $$
> R / \ker\varphi \;\cong\; \operatorname{Im}\varphi
> $$
>
> Cụ thể, đẳng cấu cho bởi ánh xạ $\bar\varphi: R/\ker\varphi \to \operatorname{Im}\varphi$, $\bar\varphi(a + \ker\varphi) = \varphi(a)$.

**Proof.**
Đặt $K = \ker\varphi$. Từ lý thuyết nhóm (đồng cấu của nhóm cộng), $\bar\varphi$ là đẳng cấu nhóm cộng. Cần kiểm tra $\bar\varphi$ bảo toàn phép nhân:

$$
\bar\varphi\bigl((a+K)(b+K)\bigr) = \bar\varphi(ab + K) = \varphi(ab) = \varphi(a)\varphi(b) = \bar\varphi(a+K)\bar\varphi(b+K)
$$

Vậy $\bar\varphi$ là đẳng cấu vành. $\blacksquare$

> [!abstract] Theorem 16.6 — Định lý đẳng cấu thứ hai (Second Isomorphism Theorem for Rings)
> Cho $R$ là vành, $A$ là vành con của $R$, và $B \trianglelefteq R$ là ideal. Khi đó:
>
> 1. $A + B = \{a + b : a \in A, b \in B\}$ là vành con của $R$.
> 2. $A \cap B \trianglelefteq A$ (ideal của $A$).
> 3. Có đẳng cấu vành:
>
> $$
> \frac{A}{A \cap B} \;\cong\; \frac{A + B}{B}
> $$

**Proof.**
Xét đồng cấu $\psi: A \to (A+B)/B$ định nghĩa bởi $\psi(a) = a + B$. Đây là hạn chế của ánh xạ chiếu $R \to R/B$ xuống $A$.

*$\psi$ là đồng cấu vành*: $\psi(a_1 + a_2) = (a_1 + a_2) + B = (a_1 + B) + (a_2 + B) = \psi(a_1) + \psi(a_2)$. Tương tự cho nhân.

*$\psi$ toàn ánh*: Mọi phần tử $(a + b) + B = a + B = \psi(a)$ với $a \in A$.

*$\ker\psi$*: $a \in \ker\psi \Leftrightarrow a + B = B \Leftrightarrow a \in B$, nên $\ker\psi = A \cap B$.

Theo định lý thứ nhất: $A/(A \cap B) \cong (A+B)/B$. $\blacksquare$

> [!abstract] Theorem 16.7 — Định lý đẳng cấu thứ ba (Third Isomorphism Theorem for Rings)
> Cho $I \subseteq J$ là hai ideal của vành $R$ (tức $I \trianglelefteq R$, $J \trianglelefteq R$, $I \subseteq J$). Khi đó:
>
> 1. $J/I \trianglelefteq R/I$ (ideal của $R/I$).
> 2. Có đẳng cấu vành:
>
> $$
> \frac{R/I}{J/I} \;\cong\; \frac{R}{J}
> $$

**Proof.**
Xét đồng cấu $\theta: R/I \to R/J$, $\theta(a + I) = a + J$. Kiểm tra well-defined: nếu $a - a' \in I \subseteq J$ thì $a + J = a' + J$. $\theta$ rõ ràng là toàn ánh, và $\ker\theta = \{a + I : a \in J\} = J/I$. Theo định lý thứ nhất: $(R/I)/(J/I) \cong R/J$. $\blacksquare$

> [!abstract] Theorem 16.8 — Định lý đẳng cấu thứ tư (Correspondence Theorem — nhắc lại)
> Cho $I \trianglelefteq R$. Có song ánh bảo tồn thứ tự giữa tập các ideal của $R$ chứa $I$ và tập các ideal của $R/I$, cho bởi $J \mapsto J/I$. Hơn nữa, $J$ là ideal tối đại/nguyên tố trong $R$ $\Leftrightarrow$ $J/I$ là ideal tối đại/nguyên tố trong $R/I$.

---

## Ví dụ áp dụng định lý đẳng cấu

> [!example] Example 16.9 — Áp dụng định lý thứ nhất: $R[x]/\langle x - a \rangle \cong R$
> Xét vành $R$ bất kỳ và $a \in R$. Định nghĩa **đồng cấu lượng giá** (evaluation homomorphism):
>
> $$
> \operatorname{ev}_a: R[x] \to R, \quad \operatorname{ev}_a(f) = f(a)
> $$
>
> $\operatorname{ev}_a$ là đồng cấu vành toàn ánh (vì hằng số). $\ker \operatorname{ev}_a = \{f \in R[x] : f(a) = 0\}$.
>
> Khi $R$ là trường, $\ker \operatorname{ev}_a = \langle x - a \rangle$ (đa thức có $a$ là nghiệm $\Leftrightarrow$ chia hết cho $x - a$). Theo định lý thứ nhất:
>
> $$
> R[x]/\langle x - a \rangle \cong R
> $$
>
> Ví dụ cụ thể: $\mathbb{Q}[x]/\langle x - 3 \rangle \cong \mathbb{Q}$.

> [!example] Example 16.10 — $\mathbb{Z}[i]/\langle 1 + i \rangle \cong \mathbb{F}_2$
> Xét $\mathbb{Z}[i] = \{a + bi : a, b \in \mathbb{Z}\}$ (vành số nguyên Gauss). Định nghĩa:
>
> $$
> \varphi: \mathbb{Z}[i] \to \mathbb{F}_2, \quad \varphi(a + bi) = [a + b]_2
> $$
>
> (tức là lấy $a + b$ modulo $2$). Kiểm tra đồng cấu: $\varphi((a+bi)(c+di)) = \varphi((ac-bd) + (ad+bc)i) = [ac - bd + ad + bc]_2 = [(a+b)(c+d)]_2$. Cũng $\varphi(a+bi)\varphi(c+di) = [a+b][c+d] = [(a+b)(c+d)]_2$. ✓
>
> $\ker\varphi = \{a + bi : a + b \equiv 0 \pmod{2}\} = \{a + bi : b \equiv a \pmod 2\}$.
>
> Với $1 + i$: $(1+i) \in \ker\varphi$ ✓. Có thể chứng minh $\ker\varphi = \langle 1 + i \rangle$. Suy ra:
>
> $$
> \mathbb{Z}[i]/\langle 1 + i \rangle \cong \mathbb{F}_2
> $$

> [!example] Example 16.11 — Đồng cấu chiếu và vành tích
> Xét $R = R_1 \times R_2$ (vành tích). Các ánh xạ chiếu:
>
> $$
> \pi_1: R \to R_1, \quad \pi_1(a_1, a_2) = a_1
> $$
>
> $$
> \pi_2: R \to R_2, \quad \pi_2(a_1, a_2) = a_2
> $$
>
> đều là đồng cấu vành toàn ánh. $\ker\pi_1 = \{0\} \times R_2$ và $\ker\pi_2 = R_1 \times \{0\}$.
>
> Theo định lý thứ nhất: $(R_1 \times R_2)/(\{0\} \times R_2) \cong R_1$.

---

## Tính chất thêm của đồng cấu

> [!abstract] Theorem 16.12 — Đồng cấu bảo toàn cấu trúc
> Cho $\varphi: R \to S$ là đồng cấu vành. Khi đó:
>
> 1. $\varphi(0_R) = 0_S$.
> 2. $\varphi(-a) = -\varphi(a)$ với mọi $a \in R$.
> 3. Nếu $a$ là đơn vị trong $R$ thì $\varphi(a)$ là đơn vị trong $\operatorname{Im}\varphi$ với $\varphi(a)^{-1} = \varphi(a^{-1})$.
> 4. Nếu $a$ là lũy linh thì $\varphi(a)$ là lũy linh.
> 5. Nếu $a$ là lũy đẳng thì $\varphi(a)$ là lũy đẳng.

**Proof.** (3): $\varphi(a)\varphi(a^{-1}) = \varphi(aa^{-1}) = \varphi(1_R) = 1_S$. Các phần khác tương tự. $\blacksquare$

---

## Đồng cấu tự nhiên (Natural/Cannonical Homomorphism)

> [!definition] Definition 16.13 — Đồng cấu chiếu (Projection Homomorphism)
> Với $I \trianglelefteq R$, ánh xạ $\pi: R \to R/I$ định nghĩa bởi $\pi(a) = a + I$ là đồng cấu vành toàn ánh, gọi là **đồng cấu chiếu** (natural projection) hay **đồng cấu thương** (quotient map).
>
> $\ker\pi = I$, và mọi đồng cấu vành đều phân tích được qua đồng cấu chiếu: nếu $\varphi: R \to S$ là đồng cấu vành thì $\varphi = \tilde\varphi \circ \pi$ với $\pi: R \to R/\ker\varphi$ là chiếu và $\tilde\varphi: R/\ker\varphi \to \operatorname{Im}\varphi$ là đẳng cấu.

---

## SageMath — Đồng cấu vành

```python
# Đồng cấu Z -> Z/nZ (ánh xạ chiếu tự nhiên)
R = ZZ
S = Zmod(6)
phi = R.hom([S(1)])        # phi(1) = 1 mod 6, tức phi(n) = n mod 6
print(phi(7))              # 1
print(phi(12))             # 0

# Kernel (dùng ideal sinh bởi 6, vì phi(n)=0 ⇔ n ≡ 0 mod 6)
# Trong SageMath, kernel của đồng cấu ZZ → Zmod(n) là n*ZZ
print(phi(12) == S(0))     # True

# Đồng cấu đánh giá đa thức
Rx = QQ['x']
x = Rx.gen()
# Evaluation at x = 2
phi2 = Rx.hom([QQ(2)])     # gửi x -> 2
f = x^2 - 2*x + 1
print(phi2(f))             # f(2) = 4 - 4 + 1 = 1
# Kernel của ev_2 là <x-2> (không thể dùng .kernel() trực tiếp trong SageMath)
# Kiểm tra: (x-2) nằm trong kernel
print(phi2(x - 2))         # 0

# Đẳng cấu C ≅ R[x]/<x^2+1>
Rx_R = RR['x']
xr = Rx_R.gen()
I = Rx_R.ideal(xr^2 + 1)
Q = Rx_R.quotient(I)
print(Q)
xbar = Q.gen()
print(xbar^2 + 1)          # 0 (vì x^2 ≡ -1)

# Đồng cấu từ Z[i] -> F_2
# SageMath không có sẵn Z[i] qua cú pháp đơn giản, dùng GaussianIntegers()
from sage.rings.number_field.order import GaussianIntegers
Zi = GaussianIntegers()
print(Zi)
```

---

## Summary — Lesson 16

- **Đồng cấu vành** $\varphi: R \to S$: bảo toàn cả $+$ và $\cdot$ (và $1$ nếu unital).
- $\ker\varphi$ là **ideal hai phía** của $R$; $\operatorname{Im}\varphi$ là vành con của $S$.
- $\varphi$ đơn ánh $\Leftrightarrow$ $\ker\varphi = \{0\}$.
- **Định lý thứ nhất**: $R/\ker\varphi \cong \operatorname{Im}\varphi$.
- **Định lý thứ hai**: $A/(A \cap B) \cong (A+B)/B$.
- **Định lý thứ ba**: $(R/I)/(J/I) \cong R/J$ khi $I \subseteq J$.
- Công cụ mạnh: dùng định lý thứ nhất để nhận diện cấu trúc vành thương.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §7.3.
- Hungerford, T. W. *Algebra*, Chapter III §2–3.
- Lang, S. *Algebra* (3rd ed.), Chapter II §2.
