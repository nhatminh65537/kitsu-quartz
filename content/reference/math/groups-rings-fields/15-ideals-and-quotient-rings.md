---
title: "15. Ideals and Quotient Rings"
type: math-component
tags: [math, groups-rings-fields, ring-theory, ideals, lesson-15]
aliases: [Ideals and Quotient Rings]
created: 2026-05-15
---

> **Prerequisites**: [[14-rings-and-basic-properties|14. Rings and Basic Properties]] — tiên đề vành, ví dụ cơ bản; [[11-normal-subgroups-and-quotient-groups|11. Normal Subgroups and Quotient Groups]] — nhóm thương, nhóm con chuẩn tắc.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{C}$ | Tập số phức |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $R[x]$ | Vành đa thức với hệ số trong $R$ |
> | $\langle a \rangle$ | Ideal chính sinh bởi $a$ |
> | $R^\times$ | Nhóm đơn vị của vành $R$ |
> | $\cong$ | Đẳng cấu (isomorphism) |

> **Objectives**:
> - Định nghĩa và phân biệt ideal trái/phải/hai phía
> - Xây dựng vành thương $R/I$ và kiểm tra tính well-defined
> - Nhận diện và phân biệt ideal tối đại (maximal ideal) và ideal nguyên tố (prime ideal)
> - Phát biểu định lý tương ứng (correspondence theorem) cho vành

---

## Motivation / Intuition

Trong lý thuyết nhóm, để tạo nhóm thương $G/N$, ta cần $N$ là nhóm con **chuẩn tắc** — đây là điều kiện cần để phép toán thương được định nghĩa tốt. Trong vành, ta cần một khái niệm tương tự nhưng tương thích với **cả hai** phép toán.

Câu hỏi: tập con $I \subseteq R$ nào cho phép xây dựng vành thương $R/I$?

Câu trả lời là **ideal**: $I$ phải đóng với phép cộng (tức là nhóm con cộng) **và** còn phải "hút" phép nhân từ mọi phía — đây là điều kiện mà không nhóm con cộng thông thường nào tự động có.

Lý do trực quan: trong $R/I$, ta muốn $[a] \cdot [b] = [ab]$ — tức là lớp tương đương nhân với nhau được. Điều này đòi hỏi nếu $[a] = [a']$ (tức $a - a' \in I$) thì $[ab] = [a'b]$, tức $(a-a')b = ab - a'b \in I$. Điều này đúng khi và chỉ khi $I$ hút phép nhân từ phía phải.

---

## Định nghĩa Ideal

> [!definition] Definition 15.1 — Ideal trái, phải, hai phía
> Cho $(R, +, \cdot)$ là vành và $I \subseteq R$. Ta nói:
>
> - $I$ là **ideal trái** (left ideal) của $R$ nếu:
>   1. $(I, +) \leq (R, +)$ (nhóm con cộng)
>   2. $\forall r \in R,\, \forall a \in I: r \cdot a \in I$
>
> - $I$ là **ideal phải** (right ideal) của $R$ nếu:
>   1. $(I, +) \leq (R, +)$
>   2. $\forall r \in R,\, \forall a \in I: a \cdot r \in I$
>
> - $I$ là **ideal hai phía** (two-sided ideal), hay chỉ gọi là **ideal**, của $R$ nếu $I$ vừa là ideal trái vừa là ideal phải.
>
> Ký hiệu: $I \trianglelefteq R$ (ideal hai phía).

> [!note] Remark 15.2
> Trong vành giao hoán, ba khái niệm ideal trái, phải, hai phía trùng nhau. Trong khóa học này, trừ khi ghi rõ, "ideal" nghĩa là ideal hai phía trong vành giao hoán.

> [!tip] Tiêu chuẩn kiểm tra ideal
> Để kiểm tra $I \subseteq R$ là ideal (hai phía), chỉ cần kiểm tra:
> 1. $0 \in I$ (hoặc $I \neq \emptyset$),
> 2. $a - b \in I$ với mọi $a, b \in I$ (đóng với phép trừ),
> 3. $ra \in I$ và $ar \in I$ với mọi $r \in R$, $a \in I$.

> [!example] Example 15.3 — Ideal trong $\mathbb{Z}$
> Mọi ideal của $\mathbb{Z}$ có dạng $n\mathbb{Z} = \{nk : k \in \mathbb{Z}\}$ với $n \geq 0$ cố định.
>
> Kiểm tra: $n\mathbb{Z}$ là nhóm con cộng của $\mathbb{Z}$. Hơn nữa, với $r \in \mathbb{Z}$ và $nk \in n\mathbb{Z}$, ta có $r \cdot nk = n(rk) \in n\mathbb{Z}$. ✓
>
> Đây là ví dụ của **ideal chính** (principal ideal) — sinh bởi một phần tử.

> [!definition] Definition 15.4 — Ideal chính (Principal Ideal)
> Trong vành giao hoán có đơn vị $R$, **ideal chính sinh bởi $a$** là:
>
> $$
> \langle a \rangle = aR = \{ar : r \in R\} = \{ra : r \in R\}
> $$
>
> Đây là ideal nhỏ nhất chứa $a$.

**Verification.** $\langle a \rangle$ là nhóm con cộng: $ar - as = a(r-s) \in \langle a \rangle$, và $0 = a \cdot 0 \in \langle a \rangle$. Hút phép nhân: $r \cdot (as) = a(rs) \in \langle a \rangle$. $\blacksquare$

> [!example] Example 15.5 — Ideal không phải ideal chính trong $\mathbb{Z}[x]$
> Xét $I = \langle 2, x \rangle = \{2f(x) + xg(x) : f, g \in \mathbb{Z}[x]\}$ trong $\mathbb{Z}[x]$.
>
> $I$ là tập tất cả đa thức với hệ số tự do chẵn. Đây là ideal nhưng **không** là ideal chính: không tồn tại $h(x) \in \mathbb{Z}[x]$ sao cho $I = \langle h(x) \rangle$ (vì $h(x)$ phải vừa chia $2$ vừa chia $x$, tức $h = \pm 1$ — nhưng $\langle 1 \rangle = \mathbb{Z}[x] \neq I$ vì $1 \notin I$).

---

## Vành thương (Quotient Ring)

> [!abstract] Theorem 15.6 — Xây dựng vành thương
> Cho $I \trianglelefteq R$ là ideal hai phía. Đặt $R/I = \{a + I : a \in R\}$ là tập tất cả lớp tương đương modulo $I$ (nhóm thương cộng). Định nghĩa phép nhân:
>
> $$
> (a + I)(b + I) := ab + I
> $$
>
> Khi đó $(R/I, +, \cdot)$ là vành, gọi là **vành thương** (quotient ring). Nếu $R$ giao hoán thì $R/I$ giao hoán. Nếu $R$ có đơn vị thì $R/I$ có đơn vị $1 + I$.

**Proof.**
*Well-definedness của phép nhân*: Giả sử $a + I = a' + I$ (tức $a - a' \in I$) và $b + I = b' + I$ (tức $b - b' \in I$). Cần chứng minh $ab + I = a'b' + I$, tức $ab - a'b' \in I$.

$$
ab - a'b' = ab - a'b + a'b - a'b' = (a - a')b + a'(b - b')
$$

Vì $a - a' \in I$ và $I$ là ideal phải, $(a - a')b \in I$. Vì $b - b' \in I$ và $I$ là ideal trái, $a'(b - b') \in I$. Do $I$ là nhóm con cộng, tổng của hai phần tử trong $I$ cũng thuộc $I$. Vậy $ab - a'b' \in I$.

*Tiên đề vành*: $(R/I, +)$ là nhóm Abel (đã biết từ nhóm thương). Tính kết hợp và phân phối của phép nhân kế thừa từ $R$. $\blacksquare$

> [!example] Example 15.7 — Vành thương $\mathbb{Z}/n\mathbb{Z}$
> Xét $I = n\mathbb{Z} \trianglelefteq \mathbb{Z}$. Vành thương $\mathbb{Z}/n\mathbb{Z}$ là vành quen thuộc với phép cộng và nhân modulo $n$.
>
> Ví dụ cụ thể: $\mathbb{Z}/6\mathbb{Z}$. Phần tử: $[0], [1], [2], [3], [4], [5]$.
>
> $$
> [2] \cdot [4] = [8] = [2], \quad [3] \cdot [2] = [6] = [0]
> $$
>
> $[3]$ là ước không vì $[3] \cdot [2] = [0]$.

> [!example] Example 15.8 — Vành $\mathbb{R}[x]/\langle x^2 + 1 \rangle \cong \mathbb{C}$
> Xét $I = \langle x^2 + 1 \rangle \trianglelefteq \mathbb{R}[x]$. Mỗi lớp trong $\mathbb{R}[x]/I$ đại diện bởi một đa thức bậc $\leq 1$ (chia đa thức cho $x^2 + 1$): $[a + bx]$ với $a, b \in \mathbb{R}$.
>
> Phép nhân: $[x] \cdot [x] = [x^2] = [x^2 + 1 - 1] = [-1]$, vì $x^2 \equiv -1 \pmod{x^2 + 1}$.
>
> Vậy $\mathbb{R}[x]/\langle x^2 + 1 \rangle \cong \mathbb{C}$, với $[x]$ tương ứng với $i = \sqrt{-1}$.

---

## Ideal tối đại và Ideal nguyên tố

Hai loại ideal đặc biệt quan trọng nhất trong lý thuyết vành:

> [!definition] Definition 15.9 — Ideal tối đại (Maximal Ideal)
> Ideal $\mathfrak{m} \subsetneq R$ (ideal thực sự) trong vành có đơn vị $R$ gọi là **ideal tối đại** nếu không tồn tại ideal $J$ thỏa:
>
> $$
> \mathfrak{m} \subsetneq J \subsetneq R
> $$
>
> Hay tương đương: nếu $I$ là ideal với $\mathfrak{m} \subseteq I \subseteq R$ thì $I = \mathfrak{m}$ hoặc $I = R$.

> [!definition] Definition 15.10 — Ideal nguyên tố (Prime Ideal)
> Ideal $\mathfrak{p} \subsetneq R$ (ideal thực sự) trong vành giao hoán có đơn vị $R$ gọi là **ideal nguyên tố** nếu với mọi $a, b \in R$:
>
> $$
> ab \in \mathfrak{p} \implies a \in \mathfrak{p} \text{ hoặc } b \in \mathfrak{p}
> $$

> [!abstract] Theorem 15.11 — Đặc trưng qua vành thương
> Cho $R$ là vành giao hoán có đơn vị và $I \subsetneq R$ là ideal. Khi đó:
>
> 1. $I$ là ideal tối đại $\Longleftrightarrow$ $R/I$ là **trường** (field).
> 2. $I$ là ideal nguyên tố $\Longleftrightarrow$ $R/I$ là **miền nguyên** (integral domain).

**Proof của (1).**
$(\Rightarrow)$ Giả sử $I$ là ideal tối đại. Lấy $[a] \in R/I$ với $[a] \neq [0]$, tức $a \notin I$. Xét ideal $J = I + \langle a \rangle = \{i + ra : i \in I, r \in R\}$. Vì $a \notin I$, ta có $I \subsetneq J$. Do $I$ tối đại, $J = R$. Nên tồn tại $i \in I$ và $r \in R$ sao cho $i + ra = 1$, tức $ra \equiv 1 \pmod{I}$, tức $[r][a] = [1]$. Vậy $[a]$ có nghịch đảo. Nên $R/I$ là trường.

$(\Leftarrow)$ Giả sử $R/I$ là trường. Lấy ideal $J$ với $I \subsetneq J$. Tồn tại $a \in J \setminus I$. Vì $R/I$ là trường, tồn tại $r \in R$ với $[r][a] = [1]$, tức $ra - 1 \in I \subseteq J$. Vì $ra \in J$ và $ra - 1 \in J$, nên $1 \in J$, nên $J = R$. Vậy $I$ là ideal tối đại.

**Proof của (2).**
$ab \in \mathfrak{p} \Leftrightarrow [ab] = [0]$ trong $R/\mathfrak{p}$, tức $[a][b] = [0]$. Điều kiện "không có ước không" trong $R/\mathfrak{p}$ tương đương $[a] = [0]$ hoặc $[b] = [0]$, tức $a \in \mathfrak{p}$ hoặc $b \in \mathfrak{p}$. $\blacksquare$

> [!abstract] Corollary 15.12 — Mọi ideal tối đại là ideal nguyên tố
> Trong vành giao hoán có đơn vị, mọi ideal tối đại là ideal nguyên tố.

**Proof.** Mọi trường là miền nguyên (vì trong trường, nếu $ab = 0$ và $a \neq 0$ thì $b = a^{-1} \cdot ab = 0$). Theo Theorem 15.11, ideal tối đại $\Rightarrow$ $R/I$ là trường $\Rightarrow$ $R/I$ là miền nguyên $\Rightarrow$ $I$ là ideal nguyên tố. $\blacksquare$

> [!warning] Counterexample 15.13 — Ideal nguyên tố không nhất thiết tối đại
> Trong $\mathbb{Z}$, ideal $\langle 0 \rangle = \{0\}$ là ideal nguyên tố (vì $\mathbb{Z}/\langle 0 \rangle \cong \mathbb{Z}$ là miền nguyên) nhưng **không** tối đại (vì $\langle 0 \rangle \subsetneq \langle 2 \rangle \subsetneq \mathbb{Z}$).
>
> Tuy nhiên, trong **vành Artin** (ví dụ $\mathbb{Z}/n\mathbb{Z}$ với $n$ có ít nhất một thừa số nguyên tố), mọi ideal nguyên tố đều là ideal tối đại.

> [!example] Example 15.14 — Phân tích ideal trong $\mathbb{Z}$
> Các ideal của $\mathbb{Z}$ là $n\mathbb{Z}$ với $n \geq 0$.
>
> - $\langle p \rangle = p\mathbb{Z}$ với $p$ nguyên tố là **ideal nguyên tố**: nếu $p \mid ab$ thì $p \mid a$ hoặc $p \mid b$ (tính chất số nguyên tố). Cũng là **ideal tối đại** vì $\mathbb{Z}/p\mathbb{Z} = \mathbb{F}_p$ là trường.
> - $\langle 0 \rangle$ là ideal nguyên tố nhưng không tối đại (xem Counterexample 15.13).
> - $\langle 4 \rangle = 4\mathbb{Z}$: không phải nguyên tố vì $2 \cdot 2 = 4 \in \langle 4 \rangle$ nhưng $2 \notin \langle 4 \rangle$.
> - $\langle 1 \rangle = \mathbb{Z}$: không phải ideal thực sự (bằng toàn bộ vành), theo định nghĩa không phải ideal tối đại hay nguyên tố.

---

## Định lý tương ứng cho vành (Correspondence Theorem)

> [!abstract] Theorem 15.15 — Correspondence Theorem for Rings
> Cho $I \trianglelefteq R$ và $\pi: R \to R/I$ là ánh xạ chiếu $\pi(a) = a + I$. Khi đó có một song ánh bảo tồn thứ tự giữa:
>
> $$
> \{J \trianglelefteq R : I \subseteq J\} \longleftrightarrow \{K \trianglelefteq R/I\}
> $$
>
> cho bởi $J \mapsto J/I = \{a + I : a \in J\}$ và $K \mapsto \pi^{-1}(K)$.
>
> Dưới song ánh này:
> - $J$ là ideal tối đại (trong $R$, chứa $I$) $\Leftrightarrow$ $J/I$ là ideal tối đại của $R/I$.
> - $J$ là ideal nguyên tố (trong $R$, chứa $I$) $\Leftrightarrow$ $J/I$ là ideal nguyên tố của $R/I$.

**Ý nghĩa**: Cấu trúc ideal của $R/I$ "phản chiếu" đúng cấu trúc ideal của $R$ nằm trên $I$.

> [!example] Example 15.16 — Ideal tối đại của $\mathbb{Z}[x]$ chứa $\langle x-2 \rangle$
> Trong $\mathbb{Z}[x]$, xét $I = \langle x - 2 \rangle$. Vành thương $\mathbb{Z}[x]/\langle x-2 \rangle \cong \mathbb{Z}$ (bằng cách thay $x = 2$). Các ideal tối đại của $\mathbb{Z}$ là $\langle p \rangle$ với $p$ nguyên tố. Theo Correspondence Theorem, các ideal tối đại của $\mathbb{Z}[x]$ chứa $\langle x-2 \rangle$ là $\langle x-2, p \rangle$ với $p$ nguyên tố.
>
> Ví dụ: $\langle x-2, 3 \rangle$ là ideal tối đại của $\mathbb{Z}[x]$, và $\mathbb{Z}[x]/\langle x-2, 3 \rangle \cong \mathbb{Z}/3\mathbb{Z} = \mathbb{F}_3$.

---

## Các phép toán trên ideal

> [!definition] Definition 15.17 — Tổng, tích, và giao của ideal
> Cho $I, J \trianglelefteq R$ là các ideal của vành $R$. Ta định nghĩa:
>
> - **Tổng**: $I + J = \{a + b : a \in I, b \in J\}$ — cũng là ideal của $R$.
> - **Tích**: $IJ = \{\sum_{k=1}^{n} a_k b_k : a_k \in I, b_k \in J, n \geq 1\}$ — ideal sinh bởi các tích $ab$ với $a \in I, b \in J$.
> - **Giao**: $I \cap J$ — cũng là ideal của $R$.
>
> Luôn có: $IJ \subseteq I \cap J \subseteq I, J \subseteq I + J$.

---

## SageMath — Ideal và vành thương

```python
# Ideal trong Z
R = ZZ
I = R.ideal(6)
print(I)               # Principal ideal (6) of Integer Ring

# Vành thương Z/6Z
Q = R.quotient(I)
print(Q)               # Ring of integers modulo 6

# Kiểm tra ideal nguyên tố và tối đại trong Z
for n in [0, 2, 3, 4, 5, 6]:
    I = ZZ.ideal(n)
    print(f"<{n}>: prime={I.is_prime()}, maximal={I.is_maximal()}")

# Vành đa thức và ideal
Rx = QQ['x']
x = Rx.gen()
f = x^2 + 1
I = Rx.ideal(f)
print(f.is_irreducible())     # True over QQ
Q = Rx.quotient(I)
print(Q)                      # Univariate Quotient Polynomial Ring over Rational Field

# Lớp tương đương trong R[x]/<x^2+1>
xbar = Q.gen()
print(xbar^2)                 # -1 (vì x^2 ≡ -1 mod x^2+1)

# Kiểm tra ideal <2, x> trong Z[x] không là ideal chính
Zx = ZZ['x']
x = Zx.gen()
I = Zx.ideal(2, x)
# Lưu ý: Z[x] không phải PID nên <2,x> không thể là ideal chính
# (SageMath không implements is_principal cho vành không phải PID)
print(I.gens())               # (2, x) — hai phần tử sinh
```

---

## Summary — Lesson 15

- **Ideal** $I \trianglelefteq R$: nhóm con cộng, đóng với phép nhân từ $R$. Trong vành giao hoán, ideal trái = phải = hai phía.
- **Vành thương** $R/I$: tập các lớp $a + I$, phép nhân $(a+I)(b+I) = ab + I$, well-defined vì $I$ là ideal hai phía.
- **Ideal chính** $\langle a \rangle = aR$: ideal nhỏ nhất chứa $a$ trong vành giao hoán có đơn vị.
- **Ideal tối đại** $\mathfrak{m}$: $R/\mathfrak{m}$ là **trường**.
- **Ideal nguyên tố** $\mathfrak{p}$: $R/\mathfrak{p}$ là **miền nguyên**.
- Mọi ideal tối đại là ideal nguyên tố (nhưng không đảo lại).
- **Correspondence Theorem**: ideal của $R/I$ tương ứng 1-1 với ideal của $R$ chứa $I$.
- Các phép toán trên ideal: $I+J$, $IJ$, $I \cap J$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §7.3–7.4.
- Hungerford, T. W. *Algebra*, Chapter III §2.
- Atiyah, M. F., & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 1.
