---
title: "07. Richelot Isogenies — the (2,2)-Construction"
type: math-component
tags: [crypto, isogeny, richelot, genus2, lesson-07]
aliases: [Richelot Isogenies]
created: 2026-04-09
---

> **Prerequisites**: [[05-mumford-coordinates|05. Mumford Coordinates and the Group Law]], [[06-isogenies-abelian-varieties|06. Isogenies between Abelian Varieties]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $C: y^2 = f(x)$ | Genus-2 curve |
> | $J = \text{Jac}(C)$ | Jacobian của $C$ |
> | $G_1, G_2, G_3$ | Quadratic factors của $f(x)$: $f = G_1 G_2 G_3$ |
> | $[G_i, G_j]$ | Commutator / resultant variant của hai quadratics |
> | $\delta$ | $\det$ của Richelot matrix |
> | $J'$ | Target Jacobian (hoặc split surface) |

---

## Giới Thiệu: Richelot Isogeny là gì?

**Richelot isogeny** là một $(2,2)$-isogeny đặc biệt từ Jacobian $J = \text{Jac}(C)$ của genus-2 curve $C$, được xây dựng một cách explicit từ một **factorization** của defining polynomial $f(x)$ thành tích ba quadratics. Đây là loại $(2,2)$-isogeny có công thức tường minh nhất, và là core computation của Castryck-Decru attack.

---

## Setup: Factorization Thành Ba Quadratics

> [!note] Định nghĩa 7.1 — Richelot Data
> Cho $C: y^2 = f(x)$ với $\deg f = 6$. Một **Richelot data** là factorization:
>
> $$
> f(x) = G_1(x) \cdot G_2(x) \cdot G_3(x)
> $$
>
> trong đó $G_1, G_2, G_3$ là các quadratic polynomials (không nhất thiết có hệ số trong $k$, có thể trong extension).
>
> Mỗi factorization như vậy tương ứng với một kernel của $(2,2)$-isogeny: $K = \{D \in J[2] : D \text{ supported on zeros of } G_i\}$.

Với $f$ squarefree degree 6: có $\binom{6}{2}/3 = 15$ cách chia 6 roots thành 3 pairs — khớp với 15 $(2,2)$-isogenies.

---

## Xây Dựng Richelot Isogeny

Cho factorization $f = G_1 G_2 G_3$ với $G_i = a_i x^2 + b_i x + c_i$.

> [!note] Định nghĩa 7.2 — Richelot Bracket
> Với hai quadratics $G_i = a_i x^2 + b_i x + c_i$ và $G_j = a_j x^2 + b_j x + c_j$:
>
> $$
> [G_i, G_j] = 2(a_i c_j - a_j c_i) x - (b_i c_j - b_j c_i) \cdot \frac{1}{...}
> $$
>
> Tổng quát hơn, đặt:
>
> $$
> \delta = \det \begin{pmatrix} a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3 \end{pmatrix}
> $$

> [!note] Algorithm 7.3 — Richelot Isogeny Construction
> Cho $f = G_1 G_2 G_3$. Xây dựng ba quadratics mới:
>
> $$
> H_i(x) = \frac{G_j'(x) G_k(x) - G_j(x) G_k'(x)}{2\delta}
> $$
>
> trong đó $\{i, j, k\} = \{1, 2, 3\}$ và $G'$ là đạo hàm. Đặt $h(x) = H_1(x) H_2(x) H_3(x)$.
>
> - Nếu $\delta \neq 0$: curve đích $C': y^2 = H_1(x) H_2(x) H_3(x)$ là genus-2 curve, và $\phi: \text{Jac}(C) \to \text{Jac}(C')$ là $(2,2)$-isogeny (**gluing** case).
> - Nếu $\delta = 0$: curve $C'$ degenerate, và $\text{Jac}(C')$ **splits** thành tích hai elliptic curves (**splitting** case).

---

## Trường Hợp Gluing ($\delta \neq 0$)

Khi $\delta \neq 0$, công thức $H_i$ cho ba quadratics mới, và $C': y^2 = H_1 H_2 H_3$ là một genus-2 curve hợp lệ. Isogeny tương ứng:

$$
\phi: \text{Jac}(C) \to \text{Jac}(C')
$$

là $(2,2)$-isogeny degree 4, với kernel là subgroup sinh bởi các pairs Weierstrass points tương ứng với $G_1, G_2, G_3$.

**Ý nghĩa trong attack**: Trường hợp này xảy ra khi ta "chọn sai digit" của Bob's secret. Ta nhận được Jacobian mới, không phải split surface. Cần tiếp tục chain.

---

## Trường Hợp Splitting ($\delta = 0$)

Khi $\delta = 0$, construction degenerate. Thay vào đó, có thể factor $h(x) = H_1 H_2 H_3$ như tích hai cubics (hoặc các factor khác), tương ứng với hai elliptic curves:

> [!note] Theorem 7.4 — Split Case
> Khi $\delta = 0$, tồn tại hai elliptic curves $E_1', E_2'$ và một $(2,2)$-isogeny:
>
> $$
> \phi: \text{Jac}(C) \to E_1' \times E_2'
> $$
>
> Các elliptic curves $E_1', E_2'$ có thể recover tường minh từ roots của $H_i$.

**Ý nghĩa trong attack**: Trường hợp này xảy ra khi ta "đoán đúng digit" của Bob's secret. Output là split surface $E_1' \times E_2'$, và ta đã extract thông tin về secret isogeny.

---

## Điều Kiện $\delta = 0$: Ý Nghĩa Hình Học

Điều kiện $\delta = 0$ nghĩa là 3 vectors $(a_i, b_i, c_i)$ linearly dependent — tức là 3 quadratics $G_1, G_2, G_3$ "thuộc cùng một pencil". Điều này tương đương với việc 6 Weierstrass points có một cấu trúc đặc biệt.

Trong attack, ta không bắt đầu với $\text{Jac}(C)$; ta bắt đầu với $E_0 \times E_0$ (split) và xây dựng chain. Ở mỗi bước, ta kiểm tra xem image split hay không — đây chính là "split test" từ Lesson 02.

---

## Dual Richelot Isogeny

> [!abstract] Theorem 7.5 — Dual là Richelot ngược
> Dual của Richelot isogeny $\phi: \text{Jac}(C) \to \text{Jac}(C')$ là Richelot isogeny:
>
> $$
> \hat{\phi}: \text{Jac}(C') \to \text{Jac}(C)
> $$
>
> tương ứng với factorization $h = H_1 H_2 H_3 \mapsto G_1 G_2 G_3$.

Symmetry này đảm bảo "glue-and-split" là hai chiều: nếu $\text{Jac}(C) \to E_1' \times E_2'$ là Richelot, thì tồn tại Richelot isogeny ngược từ $E_1' \times E_2'$ sang $\text{Jac}(C)$.

---

## Richelot từ $E_1 \times E_2$ (Domain là Split Surface)

Trong attack, domain ban đầu là $E_1 \times E_2$ (split), không phải Jacobian. Ta cần Richelot isogeny từ split surface:

**Setup**: $E_1 \times E_2$ với principal polarization. Ta chọn kernel $K = \ker \phi \cong (\mathbb{Z}/2\mathbb{Z})^2 \subset (E_1 \times E_2)[2]$.

**Kernel structure**: $K$ được sinh bởi hai điểm $T_1 = (P_1, Q_1)$ và $T_2 = (P_2, Q_2)$ trong $(E_1 \times E_2)[2]$, trong đó $P_i \in E_1[2]$, $Q_i \in E_2[2]$.

**Kani's condition** (sẽ học kỹ ở [[10-kani-theorem|Lesson 10]]): Lựa chọn kernel phù hợp với secret isogeny của Bob sẽ làm cho image split.

---

## Tính Toán Explicit

Trong implementation (Lesson 12, Appendix A0), Richelot isogenies từ $E_1 \times E_2$ được tính qua **theta coordinates** của Cosset-Robert, không phải Mumford coordinates. Lý do: Mumford coordinates phù hợp cho Jacobians (irreducible case), còn theta coordinates xử lý cả hai case (split và Jacobian) một cách thống nhất.

Nhưng ý tưởng cốt lõi vẫn là: chọn 2-torsion subgroup $K$, tính quotient $A/K$, kiểm tra xem $A/K$ split hay không.

---

## Summary

- **Richelot isogeny**: $(2,2)$-isogeny từ $\text{Jac}(C)$ xây dựng từ factorization $f = G_1 G_2 G_3$.
- **Gluing** ($\delta \neq 0$): image là $\text{Jac}(C')$, Jacobian mới.
- **Splitting** ($\delta = 0$): image là $E_1' \times E_2'$, split surface.
- Có đúng 15 Richelot isogenies từ mỗi $\text{Jac}(C)$ (tương ứng 15 factorizations $f = G_1 G_2 G_3$).
- Trong attack: áp dụng Richelot từ domain split ($E_1 \times E_2$), kiểm tra image.
- Formulas explicit: qua theta coordinates (Appendix A0).

---

## References

- Richelot, F. — *De transformatione integralium Abelianorum...* (1837, bài báo gốc)
- Bost, J.B. & Mestre, J.F. — *Moyenne arithmético-géométrique et périodes des courbes de genre 1 et 2* (1988)
- Smith, B. — *Isogenies and the Discrete Logarithm Problem in Jacobians of Genus 3 Hyperelliptic Curves* (2007)
- Cosset, R. & Robert, D. — *Computing $(ℓ,ℓ)$-isogenies in polynomial time*, §4 (Richelot case $\ell=2$)
- Castryck & Decru — ePrint 2022/975, §3 (Richelot trong attack context)
