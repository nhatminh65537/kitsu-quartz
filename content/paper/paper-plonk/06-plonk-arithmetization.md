---
title: "06. PLONK Arithmetization"
type: math-component
tags: [plonk, arithmetization, constraint-system, math-component, lesson-06]
aliases: [PLONK Arithmetization, Constraint System, PlonK Circuit]
source: "PlonK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge — Gabizon, Williamson, Ciobotaru, 2019"
created: 2026-03-16
---

> **Prerequisites**: zk-SNARK landscape (xem [[01-plonk-overview|01. Overview]]), Polynomial Protocols (xem [[04-polynomial-protocols|04. Polynomial Protocols]]), Permutation Argument (xem [[05-permutation-argument|05. Permutation Argument]])  
> 🔴 **Prerequisite references**: Gabizon, Gentry, Parno, Raykova — *Quadratic Span Programs and SNARKs* [GGPR13] (R1CS arithmetization — để so sánh với gate-based approach của PlonK)  
> **Lesson type**: Math Component  
> **Covers**: §6 đầy đủ (constraint system $\mathcal{C} = (V, Q)$, Definition 6.1, gate constraints, copy constraints, relation $\mathcal{R}_\mathcal{C}$, instantiations, public inputs, encoding thành polynomials)
>
> **Notation** (ký hiệu mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathcal{C} = (V, Q)$ | Constraint system của circuit | $C = (V, Q)$ |
> | $V = (\mathbf{a}, \mathbf{b}, \mathbf{c})$ | Wire assignment: $\mathbf{a}, \mathbf{b}, \mathbf{c} \in [m]^n$ | $V = (a, b, c)$ |
> | $Q = (q_L, q_R, q_O, q_M, q_C)$ | Selector vectors: $q_L, q_R, q_O, q_M, q_C \in \mathbb{F}^n$ | $Q$ |
> | $n$ | Số gates (có bao gồm addition gates) | $n$ |
> | $m$ | Số wires (biến) phân biệt | $m$ |
> | $x = (x_1, \ldots, x_m) \in \mathbb{F}^m$ | Assignment (giá trị tất cả wires) | $x$ |
> | $I \subseteq [m]$ | Tập public input indices ($I = \{1, \ldots, \ell\}$) | $I$ |
> | $\mathcal{T}_\mathcal{C}$ | Partition của $[3n]$ theo copy constraints | $T_C$ |
> | $a(X), b(X), c(X)$ | Polynomial encoding left/right/output wire values trên $H$ | $f_L, f_R, f_O$ |
> | $q_L(X), \ldots, q_C(X)$ | Selector polynomials (preprocessed) | $q_L, \ldots, q_C$ |
> | $\mathsf{PI}(X)$ | Public input polynomial | $\mathsf{PI}(X)$ |
> | $Z_H(X)$ | Vanishing polynomial $X^n - 1$ | $Z_H(X)$ |

---

## Motivation

### Từ program đến polynomial equations

Mọi SNARK đều cần một bước **arithmetization** — chuyển statement cần chứng minh thành một hệ phương trình đại số. PlonK chọn **gate-based arithmetization** thay vì R1CS (Rank-1 Constraint System dùng trong Groth16).

Sự khác biệt then chốt: trong R1CS, addition gates là "miễn phí" (không tốn constraint), còn multiplication mới cần constraint. PlonK treat cả addition và multiplication như các gates độc lập với một constraint chung. Điều này làm wiring constraints trở thành equality constraints thuần túy → reducible về permutation check (Lesson 05), thay vì phải dùng bivariate polynomial phức tạp như Sonic.

---

## Arithmetic Circuit Fan-In-2

PlonK xét các circuit fan-in-2 với fan-out tùy ý: mỗi gate có đúng **2 inputs** (left, right) và **1 output**. Có $n$ gates và $m$ wires phân biệt trong circuit.

**Tại sao fan-in-2?** Đây là cách tự nhiên để represent phép cộng và nhân trong $\mathbb{F}$. Bất kỳ hàm số học nào đều có thể compile thành một circuit fan-in-2.

---

## Định nghĩa Constraint System

> [!note] Definition 6.1 — Constraint System $\mathcal{C} = (V, Q)$
> Cho circuit fan-in-2 với $n$ gates và $m$ wires. Constraint system $\mathcal{C}$ gồm:
>
> **Wire assignment** $V = (\mathbf{a}, \mathbf{b}, \mathbf{c})$ với $\mathbf{a}, \mathbf{b}, \mathbf{c} \in [m]^n$:
> - $a_i \in [m]$: index của wire đóng vai trò **left input** của gate $i$
> - $b_i \in [m]$: index của wire đóng vai trò **right input** của gate $i$
> - $c_i \in [m]$: index của wire đóng vai trò **output** của gate $i$
>
> **Selector vectors** $Q = (q_L, q_R, q_O, q_M, q_C)$ với $q_L, q_R, q_O, q_M, q_C \in \mathbb{F}^n$, mỗi vector có $n$ entries — một per gate.
>
> **Gate constraint** cho gate $i$: với assignment $x \in \mathbb{F}^m$,
>
> $$q_{L,i} \cdot x_{a_i} + q_{R,i} \cdot x_{b_i} + q_{O,i} \cdot x_{c_i} + q_{M,i} \cdot x_{a_i} x_{b_i} + q_{C,i} = 0$$
>
> **Copy constraints** (wiring): cho $\ell, \ell' \in [3n]$ nằm trong cùng block của partition $\mathcal{T}_\mathcal{C}$:
>
> $$x_{V_\ell} = x_{V_{\ell'}}$$
>
> trong đó $V_\ell$ là entry $\ell$ của vector $(a_1,\ldots,a_n, b_1,\ldots,b_n, c_1,\ldots,c_n) \in [m]^{3n}$.

**Đọc hiểu**: vector $V$ của circuit view $3n$ wire positions như một vector dài — $n$ positions cho left inputs, $n$ cho right inputs, $n$ cho outputs. Partition $\mathcal{T}_\mathcal{C}$ nhóm những positions nào phải có cùng wire value, encode toàn bộ wiring của circuit.

---

## Gate Types — Instantiations

Một gate constraint chung với 5 selectors đủ để encode nhiều loại gates phổ biến:

| Loại gate | $q_{L,i}$ | $q_{R,i}$ | $q_{O,i}$ | $q_{M,i}$ | $q_{C,i}$ | Constraint |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| Multiplication | $0$ | $0$ | $-1$ | $1$ | $0$ | $x_{a_i} x_{b_i} = x_{c_i}$ |
| Addition | $1$ | $1$ | $-1$ | $0$ | $0$ | $x_{a_i} + x_{b_i} = x_{c_i}$ |
| Constant | $0$ | $0$ | $0$ | $0$ | $c$ | $c = 0$ (enforce constant $c$ tại gate $i$) |
| Boolean | $1$ | $0$ | $0$ | $-1$ | $0$ | $x_{a_i} - x_{a_i}^2 = 0$ (tức là $x_{a_i}(1 - x_{a_i}) = 0$) |
| Public input | $1$ | $0$ | $0$ | $0$ | $0$ | $x_{a_i} + \mathsf{pi}_i = 0$ (offset bởi PI) |

> [!tip] 💡 Agent note
> Boolean gate minh họa sức mạnh của constraint chung: đặt $q_{L,i} = 1$, $q_{M,i} = -1$, ta có $x_{a_i} - x_{a_i}^2 = 0$, nghĩa là $x_{a_i} \in \{0, 1\}$. Đây không phải "gate" theo nghĩa vật lý nhưng là constraint hữu ích để enforce binary values mà không cần gate riêng. Custom gates (TurboPLonK) là extension: thêm selectors cho các algebraic constraints phức tạp hơn.

---

## Public Inputs

Cho tập public input indices $I \subseteq [m]$ (WLOG $I = \{1, \ldots, \ell\}$). Relation $\mathcal{R}_\mathcal{C}$ được định nghĩa:

$$\mathcal{R}_\mathcal{C} = \bigl\{(x, \omega) : x \in \mathbb{F}^\ell,\ \omega \in \mathbb{F}^{m-\ell},\ (x_1, \ldots, x_\ell, \omega_1, \ldots, \omega_{m-\ell}) \text{ satisfies } \mathcal{C}\bigr\}$$

Đây là relation PlonK cần prove: tồn tại private witness $\omega$ sao cho cùng với public input $x$, tất cả gate constraints và copy constraints thỏa mãn.

---

## Encoding thành Polynomials trên $H$

Khi arithmetize, ta cần biểu diễn constraint system bằng polynomials. Multiplicative subgroup $H = \{1, \omega, \omega^2, \ldots, \omega^{n-1}\}$ bậc $n$ được dùng như **index space** — gate $i$ tương ứng với điểm $\omega^{i-1}$.

**Wire polynomials** (prover gửi): $a(X), b(X), c(X) \in \mathbb{F}_{<n}[X]$ với:

$$a(\omega^{i-1}) = x_{a_i}, \quad b(\omega^{i-1}) = x_{b_i}, \quad c(\omega^{i-1}) = x_{c_i} \quad \forall i \in [n]$$

**Selector polynomials** (preprocessed — commit một lần): $q_L(X), q_R(X), q_O(X), q_M(X), q_C(X) \in \mathbb{F}_{<n}[X]$ với:

$$q_L(\omega^{i-1}) = q_{L,i}, \quad \ldots, \quad q_C(\omega^{i-1}) = q_{C,i}$$

**Public input polynomial**: $\mathsf{PI}(X) \in \mathbb{F}_{<n}[X]$ với $\mathsf{PI}(\omega^{i-1}) = -x_i$ cho $i \in I$ và $0$ cho $i \notin I$ (offset âm để gate constraint viết thống nhất).

**Gate constraint trên $H$** (dạng polynomial identity):

$$q_L(X) a(X) + q_R(X) b(X) + q_O(X) c(X) + q_M(X) a(X)b(X) + q_C(X) + \mathsf{PI}(X) \equiv 0 \pmod{Z_H(X)}$$

Nếu identity này đúng với mọi $X \in H$, thì tất cả $n$ gate constraints thỏa mãn.

**Copy constraints trên $H$**: Được kiểm tra bằng permutation argument (Lesson 05) với partition $\mathcal{T}_\mathcal{C}$.

---

## Permutation Polynomials (Preprocessed)

Từ wiring $V = (\mathbf{a}, \mathbf{b}, \mathbf{c})$ của circuit, định nghĩa permutation $\sigma$ trên $[3n]$: $\sigma(\ell) = \ell'$ nếu $\ell$ và $\ell'$ thuộc cùng copy-constraint block và là "người kế tiếp" trong block đó (theo quy ước vòng tròn trong block).

Từ $\sigma$, build 6 preprocessed polynomials:

$$S_{\mathsf{ID},1}(\omega^i) = \omega^i, \quad S_{\mathsf{ID},2}(\omega^i) = k_2 \omega^i, \quad S_{\mathsf{ID},3}(\omega^i) = k_3 \omega^i$$

$$S_{\sigma,1}(\omega^i) = \sigma(i),\quad S_{\sigma,2}(\omega^i) = \sigma(n+i), \quad S_{\sigma,3}(\omega^i) = \sigma(2n+i)$$

với $k_2, k_3$ là các coset representatives phân biệt (thường $k_2$ và $k_3$ được chọn trước khi circuit compile).

Tổng cộng có **8 preprocessed polynomials** được commit trong preprocessing: $q_L, q_R, q_O, q_M, q_C, S_{\sigma,1}, S_{\sigma,2}, S_{\sigma,3}$.

---

## So sánh: Gate-Based vs R1CS

| | PlonK gate-based | Groth16/Sonic R1CS |
|---|---|---|
| **Gate constraint** | $q_L a + q_R b + q_M ab + q_O c + q_C = 0$ | $\langle \mathbf{u}_i, \mathbf{x}\rangle \cdot \langle \mathbf{v}_i, \mathbf{x}\rangle = \langle \mathbf{w}_i, \mathbf{x}\rangle$ |
| **Addition fan-in** | Hằng số 2 | Tùy ý (addition "free") |
| **Wiring** | Copy constraints → permutation | Implicit trong matrix structure |
| **Số polynomials** | 8 preprocessed + 3 witness | 3 polynomials (A, B, C) |
| **Lợi thế** | Wiring → permutation check (simple) | Addition gates cheap |
| **Nhược điểm** | Addition gates tốn constraint | Wiring check phức tạp (bivariate) |

---

## Tổng Quan: Từ Circuit đến PlonK Statement

Sau khi arithmetize, ta có:

**Prover gửi** (phụ thuộc witness $\omega$): commitments của $a(X), b(X), c(X)$

**Preprocessed** (phụ thuộc circuit $\mathcal{C}$, commit một lần): $q_L, q_R, q_O, q_M, q_C, S_{\sigma,1}, S_{\sigma,2}, S_{\sigma,3}$

**Statement cần prove** (dưới dạng polynomial identities trên $H$):

1. **Gate constraint**: $q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot ab + q_C + \mathsf{PI} \equiv 0$
2. **Copy constraints**: $(a, b, c)$ copy-satisfy partition $\mathcal{T}_\mathcal{C}$ (qua permutation argument với $Z(X)$)

Đây chính xác là input cho PlonK Protocol (Lesson 07).

---

## Summary

- **Constraint system** $\mathcal{C} = (V, Q)$: $V = (\mathbf{a}, \mathbf{b}, \mathbf{c})$ mô tả wiring, $Q$ mô tả loại gate.
- **Gate constraint** universal: $q_L a_i + q_R b_i + q_O c_i + q_M a_i b_i + q_C = 0$ — một công thức cover multiplication, addition, constant, boolean, public input gates bằng cách chọn selectors phù hợp.
- **Copy constraints**: wiring partition $\mathcal{T}_\mathcal{C}$ xác định các positions phải bằng nhau — được verify bằng permutation argument.
- **Polynomial encoding**: wire values $\to$ $a(X), b(X), c(X)$; selectors $\to$ preprocessed polynomials $q_L, \ldots, S_{\sigma,j}$; gate constraints trở thành một polynomial identity modulo $Z_H(X)$.
- **8 preprocessed polynomials** được commit trong preprocessing — circuit-specific nhưng witness-independent, reuse cho mọi proof của cùng circuit.
- **Relation** $\mathcal{R}_\mathcal{C}$: PlonK prove rằng prover biết witness $\omega$ sao cho $(x, \omega)$ thỏa mãn đồng thời gate constraints và copy constraints của circuit $\mathcal{C}$.

---

## References

- [GWC19] Gabizon, Williamson, Ciobotaru — *PlonK*, ePrint 2019/953, §6
- [GGPR13] Gennaro, Gentry, Parno, Raykova — *Quadratic Span Programs and SNARKs*, EUROCRYPT 2013 (🔴 Prerequisite: R1CS arithmetization — để so sánh)
- [GW20] Gabizon, Williamson — *plookup*, ePrint 2020/315 (⚪ extension với lookup gates)
