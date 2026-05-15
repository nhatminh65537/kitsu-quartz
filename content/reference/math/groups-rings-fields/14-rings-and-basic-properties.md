---
title: "14. Rings and Basic Properties"
type: math-component
tags: [math, groups-rings-fields, ring-theory, lesson-14]
aliases: [Rings and Basic Properties]
created: 2026-05-15
---

> **Prerequisites**: [[07-groups-and-basic-properties|07. Groups and Basic Properties]] — biết khái niệm nhóm (group), phép toán hai ngôi, tính kết hợp, phần tử đơn vị, nghịch đảo.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{N}$ | Tập số tự nhiên |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{C}$ | Tập số phức |
> | $\mathbb{Z}/n\mathbb{Z}$ | Vành số nguyên modulo $n$ |
> | $\gcd(a, n)$ | Ước chung lớn nhất của $a$ và $n$ |
> | $\phi(n)$ | Hàm Euler phi |
> | $M_n(R)$ | Tập ma trận vuông $n \times n$ trên vành $R$ |
> | $\cong$ | Đẳng cấu (isomorphism) |

> **Objectives**:
> - Phát biểu và áp dụng tiên đề vành (ring axioms)
> - Phân biệt vành giao hoán (commutative ring), vành có đơn vị (ring with unity)
> - Nhận diện zero divisor, unit, nilpotent, idempotent trong các ví dụ cụ thể
> - Nắm các ví dụ vành kinh điển: $\mathbb{Z}$, $\mathbb{Z}/n\mathbb{Z}$, $M_n(R)$, vành tích

---

## Motivation / Intuition

Lý thuyết nhóm nghiên cứu cấu trúc với **một phép toán**. Nhưng toán học cổ điển — số học, đa thức, ma trận — đều dùng **hai phép toán** tương tác với nhau: cộng và nhân. Một **vành** (ring) là cấu trúc đại số nắm bắt chính xác sự tương tác đó.

Ý tưởng chủ đạo rất đơn giản: ta muốn một cấu trúc mà
1. phép cộng cư xử như trong nhóm Abel,
2. phép nhân có tính kết hợp,
3. phép nhân phân phối qua phép cộng.

Điểm then chốt: ta **không** đòi hỏi phép nhân giao hoán hay mỗi phần tử phải có nghịch đảo nhân. Sự linh hoạt này cho phép lý thuyết vành bao quát cả $\mathbb{Z}$, đa thức, ma trận, và hàng loạt cấu trúc khác.

Ví dụ gợi cảm hứng ban đầu:
- Tập số nguyên $\mathbb{Z}$ với phép cộng và nhân thông thường.
- Tập đa thức $\mathbb{Z}[x]$, $\mathbb{R}[x]$ với cộng và nhân đa thức.
- Tập ma trận $M_2(\mathbb{R})$ với cộng và nhân ma trận.
- Tập số nguyên modulo $n$: $\mathbb{Z}/n\mathbb{Z}$.

Cả bốn ví dụ này đều dùng hai phép toán thỏa cùng một bộ tiên đề — đó là tiên đề vành.

---

## Định nghĩa vành (Ring)

> [!definition] Definition 14.1 — Vành (Ring)
> Một **vành** là bộ ba $(R, +, \cdot)$ gồm một tập hợp $R$ và hai phép toán hai ngôi $+, \cdot : R \times R \to R$ thỏa mãn các tiên đề sau:
>
> **(R1) $(R, +)$ là nhóm Abel:**
> - Kết hợp: $(a + b) + c = a + (b + c)$
> - Giao hoán: $a + b = b + a$
> - Phần tử đơn vị: tồn tại $0 \in R$ sao cho $a + 0 = a$
> - Phần tử đối: với mỗi $a \in R$, tồn tại $-a \in R$ sao cho $a + (-a) = 0$
>
> **(R2) $(R, \cdot)$ là nửa nhóm (semigroup):**
> - Kết hợp: $(a \cdot b) \cdot c = a \cdot (b \cdot c)$
>
> **(R3) Phép nhân phân phối qua phép cộng:**
> - Trái: $a \cdot (b + c) = a \cdot b + a \cdot c$
> - Phải: $(a + b) \cdot c = a \cdot c + b \cdot c$

> [!note] Remark 14.2 — Quy ước ký hiệu
> Thông thường ta viết $ab$ thay cho $a \cdot b$. Phép nhân có ưu tiên cao hơn phép cộng: $ab + c$ nghĩa là $(ab) + c$. Phần tử đơn vị của phép cộng (zero element) ký hiệu là $0_R$ hoặc chỉ $0$ khi không gây nhầm lẫn.

> [!definition] Definition 14.3 — Vành giao hoán (Commutative Ring) và Vành có đơn vị (Ring with Unity)
> - Vành $(R, +, \cdot)$ được gọi là **vành giao hoán** nếu $ab = ba$ với mọi $a, b \in R$.
> - Vành $(R, +, \cdot)$ được gọi là **vành có đơn vị** (hay **unital ring**) nếu tồn tại phần tử $1 \in R$ sao cho $1 \cdot a = a \cdot 1 = a$ với mọi $a \in R$. Phần tử $1$ gọi là **đơn vị nhân** (multiplicative identity) hay **phần tử đơn vị**.

> [!note] Remark 14.4
> Trong một số tài liệu (đặc biệt Hungerford), "ring" đã bao gồm yêu cầu có đơn vị nhân. Trong khóa học này, theo Dummit & Foote, ta **không** mặc định điều đó — một vành có thể không có đơn vị nhân. Khi muốn nói đến vành có đơn vị nhân, ta ghi rõ.

---

## Tính chất cơ bản của vành

> [!abstract] Theorem 14.5 — Phép nhân với số không
> Trong bất kỳ vành $(R, +, \cdot)$ nào, với mọi $a \in R$:
>
> $$
> a \cdot 0 = 0 \cdot a = 0
> $$

**Proof.**
Ta có $a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0$ (tính phân phối). Cộng $-(a \cdot 0)$ vào cả hai vế:

$$
0 = a \cdot 0 + (-(a \cdot 0)) = (a \cdot 0 + a \cdot 0) + (-(a \cdot 0)) = a \cdot 0 + (a \cdot 0 + (-(a \cdot 0))) = a \cdot 0 + 0 = a \cdot 0
$$

Vậy $a \cdot 0 = 0$. Chứng minh $0 \cdot a = 0$ tương tự. $\blacksquare$

> [!abstract] Theorem 14.6 — Quy tắc dấu
> Trong vành $R$, với mọi $a, b \in R$:
>
> $$
> (-a) \cdot b = a \cdot (-b) = -(ab), \qquad (-a)(-b) = ab
> $$

**Proof.**
Ta có $ab + (-a)b = (a + (-a))b = 0 \cdot b = 0$, nên $(-a)b = -(ab)$. Tương tự $a(-b) = -(ab)$. Kết hợp: $(-a)(-b) = -(a(-b)) = -(-(ab)) = ab$. $\blacksquare$

> [!abstract] Theorem 14.7 — Tính duy nhất của đơn vị nhân
> Nếu vành $R$ có đơn vị nhân thì đơn vị nhân là duy nhất.

**Proof.**
Giả sử $1$ và $1'$ đều là đơn vị nhân. Khi đó $1 = 1 \cdot 1' = 1'$. $\blacksquare$

---

## Các loại phần tử đặc biệt

> [!definition] Definition 14.8 — Ước của không (Zero Divisor)
> Phần tử $a \in R$ với $a \neq 0$ được gọi là **ước của không** (zero divisor, hay ước không) nếu tồn tại $b \in R$ với $b \neq 0$ sao cho $ab = 0$ hoặc $ba = 0$.
>
> - Nếu $ab = 0$ thì $a$ là **ước không trái** (left zero divisor).
> - Nếu $ba = 0$ thì $a$ là **ước không phải** (right zero divisor).
> - Trong vành giao hoán, hai khái niệm này trùng nhau.

> [!definition] Definition 14.9 — Đơn vị (Unit)
> Trong vành có đơn vị $(R, +, \cdot, 1)$, phần tử $u \in R$ gọi là **đơn vị** (unit) nếu tồn tại $v \in R$ sao cho $uv = vu = 1$. Phần tử $v$ như vậy gọi là **nghịch đảo nhân** của $u$, ký hiệu $u^{-1}$.
>
> Tập hợp tất cả các đơn vị của $R$ ký hiệu là $R^\times$ hay $U(R)$.

> [!abstract] Theorem 14.10 — $R^\times$ là nhóm
> Tập $R^\times$ cùng phép nhân tạo thành một **nhóm** (không nhất thiết giao hoán). Nhóm này gọi là **nhóm đơn vị** (group of units) của $R$.

**Proof.**
- **Đóng**: Nếu $u, v \in R^\times$ thì $(uv)(v^{-1}u^{-1}) = u(vv^{-1})u^{-1} = u \cdot 1 \cdot u^{-1} = uu^{-1} = 1$, nên $uv \in R^\times$.
- **Kết hợp**: Kế thừa từ vành.
- **Đơn vị**: $1 \in R^\times$ với $1 \cdot 1 = 1$.
- **Nghịch đảo**: Nếu $u \in R^\times$ thì $u^{-1} \in R^\times$ (vì $(u^{-1})^{-1} = u$). $\blacksquare$

> [!definition] Definition 14.11 — Phần tử lũy linh (Nilpotent Element)
> Phần tử $a \in R$ gọi là **lũy linh** (nilpotent) nếu tồn tại số nguyên dương $n$ sao cho $a^n = 0$.
>
> Số nguyên dương nhỏ nhất $n$ như vậy gọi là **chỉ số lũy linh** (nilpotency index) của $a$.

> [!definition] Definition 14.12 — Phần tử lũy đẳng (Idempotent Element)
> Phần tử $e \in R$ gọi là **lũy đẳng** (idempotent) nếu $e^2 = e$.

> [!note] Remark 14.13
> Trong bất kỳ vành nào, $0$ và $1$ (nếu tồn tại) đều là lũy đẳng tầm thường. Lũy đẳng không tầm thường (nontrivial idempotent) $e \neq 0, 1$ thường xuất hiện trong vành tích trực tiếp — xem ví dụ 14.19.

---

## Các ví dụ vành kinh điển

> [!example] Example 14.14 — Vành số nguyên $\mathbb{Z}$
> $(\mathbb{Z}, +, \cdot)$ là vành giao hoán có đơn vị với $1_{\mathbb{Z}} = 1$.
>
> - **Đơn vị**: $\mathbb{Z}^\times = \{1, -1\}$.
> - **Ước không**: không có (vì $\mathbb{Z}$ là miền nguyên — xem bài 17).
> - **Lũy linh**: chỉ có $0$ (vì $a^n = 0 \Rightarrow a = 0$ trong $\mathbb{Z}$).

> [!example] Example 14.15 — Vành $\mathbb{Z}/n\mathbb{Z}$
> Với $n \geq 2$, $\mathbb{Z}/n\mathbb{Z} = \{[0], [1], \ldots, [n-1]\}$ với phép cộng và nhân modulo $n$ là vành giao hoán có đơn vị.
>
> - **Đơn vị**: $(\mathbb{Z}/n\mathbb{Z})^\times = \{[a] : \gcd(a, n) = 1\}$, có $\phi(n)$ phần tử (hàm Euler).
> - **Ước không**: $[a]$ là ước không $\Leftrightarrow$ $1 < \gcd(a, n) < n$.
> - Ví dụ với $n = 6$: $[2] \cdot [3] = [6] = [0]$, nên $[2]$ và $[3]$ đều là ước không.
>
> Trường hợp đặc biệt: nếu $p$ là số nguyên tố thì $\mathbb{Z}/p\mathbb{Z} = \mathbb{F}_p$ không có ước không (mọi phần tử $\neq 0$ đều là đơn vị) — đây là **trường** (field).

> [!example] Example 14.16 — Vành ma trận $M_n(R)$
> Tập $M_n(R)$ gồm tất cả ma trận vuông $n \times n$ với hệ số trong vành $R$, cùng phép cộng và nhân ma trận thông thường, tạo thành một vành.
>
> - Nếu $n \geq 2$ thì $M_n(R)$ **không giao hoán** (thậm chí khi $R = \mathbb{R}$):
>
> $$
> \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}
> $$
>
> - **Đơn vị**: $M_n(R)^\times = GL_n(R)$ — tập ma trận khả nghịch.
> - **Ước không**: mọi ma trận không khả nghịch khác $0$ là ước không (ví dụ: $\begin{pmatrix}1 & 0 \\ 0 & 0\end{pmatrix} \cdot \begin{pmatrix}0 & 0 \\ 0 & 1\end{pmatrix} = \begin{pmatrix}0 & 0 \\ 0 & 0\end{pmatrix}$).
> - **Lũy đẳng**: các ma trận chiếu (projection matrix) $P$ thỏa $P^2 = P$.

> [!example] Example 14.17 — Vành $\mathbb{Z}[i]$ (Gaussian integers)
> $\mathbb{Z}[i] = \{a + bi : a, b \in \mathbb{Z}\}$ với phép cộng và nhân số phức tạo thành vành giao hoán có đơn vị.
>
> - **Đơn vị**: $\mathbb{Z}[i]^\times = \{1, -1, i, -i\}$ (phần tử có chuẩn $= 1$).
> - **Ước không**: không có (miền nguyên Gauss, sẽ chứng minh ở bài 17).

> [!example] Example 14.18 — Vành đa thức $R[x]$
> Với vành $R$ bất kỳ, tập tất cả đa thức với hệ số trong $R$ tạo thành vành $R[x]$. Đây là một trong những cấu trúc quan trọng nhất — sẽ được nghiên cứu kỹ ở bài 19.

> [!example] Example 14.19 — Vành tích trực tiếp (Direct Product Ring)
> Cho $(R_1, +_1, \cdot_1)$ và $(R_2, +_2, \cdot_2)$ là hai vành. Tích trực tiếp $R_1 \times R_2$ với phép toán theo tọa độ:
>
> $$
> (a_1, a_2) + (b_1, b_2) = (a_1 +_1 b_1,\; a_2 +_2 b_2)
> $$
>
> $$
> (a_1, a_2) \cdot (b_1, b_2) = (a_1 \cdot_1 b_1,\; a_2 \cdot_2 b_2)
> $$
>
> là một vành. Nếu $R_1, R_2$ có đơn vị thì $R_1 \times R_2$ có đơn vị $(1_1, 1_2)$.
>
> **Lũy đẳng không tầm thường**: $(1, 0)$ và $(0, 1)$ đều là lũy đẳng trong $R_1 \times R_2$, vì $(1,0)^2 = (1,0)$.
>
> **Ước không**: $(1, 0) \cdot (0, 1) = (0, 0)$ — ngay cả khi $R_1, R_2$ không có ước không.

---

## Ví dụ: Phân tích $\mathbb{Z}/12\mathbb{Z}$

Xét vành $\mathbb{Z}/12\mathbb{Z}$ một cách chi tiết:

> [!example] Example 14.20 — Phân tích đầy đủ $\mathbb{Z}/12\mathbb{Z}$
> **Đơn vị** ($\gcd(a, 12) = 1$): $\{1, 5, 7, 11\}$. Nhóm đơn vị $(\mathbb{Z}/12\mathbb{Z})^\times \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$.
>
> **Ước không** ($1 < \gcd(a, 12) < 12$, $a \neq 0$): $\{2, 3, 4, 6, 8, 9, 10\}$. Ví dụ: $4 \cdot 3 = 12 \equiv 0$.
>
> **Lũy linh**: $6^2 = 36 \equiv 0 \pmod{12}$, nên $6$ là lũy linh (chỉ số $2$). Thực ra $6 = 2 \cdot 3$ và $12 = 4 \cdot 3$, nên $6^2 = 36 = 3 \cdot 12 \equiv 0$. Các lũy linh trong $\mathbb{Z}/n\mathbb{Z}$ là $\{[a] : \text{mọi ước nguyên tố của } n \text{ đều chia } a\}$.
>
> **Lũy đẳng**: $4^2 = 16 \equiv 4 \pmod{12}$, $9^2 = 81 \equiv 9 \pmod{12}$. Vậy $0, 1, 4, 9$ đều là lũy đẳng trong $\mathbb{Z}/12\mathbb{Z}$.

---

## Vành con (Subring)

> [!definition] Definition 14.21 — Vành con (Subring)
> Tập con $S \subseteq R$ của vành $(R, +, \cdot)$ gọi là **vành con** (subring) của $R$ nếu $S$ cùng với phép toán thu hẹp từ $R$ cũng tạo thành một vành.
>
> **Tiêu chuẩn vành con**: $S$ là vành con của $R$ khi và chỉ khi:
> 1. $S \neq \emptyset$,
> 2. $a - b \in S$ với mọi $a, b \in S$ (đóng với phép trừ),
> 3. $ab \in S$ với mọi $a, b \in S$ (đóng với phép nhân).

> [!example] Example 14.22 — Vành con của $\mathbb{Z}$
> $n\mathbb{Z} = \{nk : k \in \mathbb{Z}\}$ là vành con của $\mathbb{Z}$ với mọi $n \geq 0$. Tuy nhiên $n\mathbb{Z}$ chỉ có đơn vị nhân khi $n = 1$ (vì $n\mathbb{Z}$ không chứa $1$ với $n > 1$).

---

## SageMath — Làm việc với vành

```python
# Vành Z/nZ
R = Zmod(12)
print(R)                     # Ring of integers modulo 12

# Liệt kê phần tử
print(list(R))               # [0, 1, 2, ..., 11]

# Nhóm đơn vị
G = R.unit_group()
print(G)                     # Multiplicative Abelian group isomorphic to C2 x C2
print(R.unit_group_order())  # 4 = phi(12)

# Kiểm tra ước không
a = R(4); b = R(3)
print(a * b == R(0))         # True: 4*3 = 12 ≡ 0

# Kiểm tra lũy linh
print(R(6)^2 == R(0))        # True

# Kiểm tra lũy đẳng
print(R(4)^2 == R(4))        # True

# Vành ma trận
M = MatrixSpace(ZZ, 2)
A = M([[1,0],[0,0]])
B = M([[0,0],[0,1]])
print(A * B)                 # Zero matrix — ước không
print(A^2 == A)              # True — lũy đẳng

# Vành tích trực tiếp
R1 = Zmod(3); R2 = Zmod(5)
Rprod = cartesian_product([R1, R2])
print(Rprod((1, 0)) * Rprod((0, 1)))  # (0, 0) — ước không
```

---

## Summary — Lesson 14

- Vành $(R, +, \cdot)$: phép cộng là nhóm Abel, phép nhân kết hợp, nhân phân phối qua cộng.
- **Vành giao hoán**: $ab = ba$. **Vành có đơn vị**: tồn tại $1$ với $1a = a1 = a$.
- Mọi vành thỏa: $a \cdot 0 = 0$, $(-a)b = -(ab)$, $(-a)(-b) = ab$.
- **Zero divisor** (ước không): $a \neq 0$ và tồn tại $b \neq 0$ với $ab = 0$ hoặc $ba = 0$.
- **Unit** (đơn vị): $u$ có nghịch đảo nhân. Tập đơn vị $R^\times$ là nhóm.
- **Nilpotent** (lũy linh): $a^n = 0$ với $n \geq 1$. **Idempotent** (lũy đẳng): $e^2 = e$.
- Ví dụ chuẩn: $\mathbb{Z}$, $\mathbb{Z}/n\mathbb{Z}$, $M_n(R)$, $R_1 \times R_2$, $R[x]$, $\mathbb{Z}[i]$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §7.1–7.2.
- Hungerford, T. W. *Algebra*, Chapter III §1.
- Lang, S. *Algebra* (3rd ed.), Chapter II §1.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 16.
