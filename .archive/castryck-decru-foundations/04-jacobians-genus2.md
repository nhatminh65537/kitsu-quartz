---
title: "04. Jacobians of Genus-2 Curves"
type: math-component
tags: [crypto, isogeny, jacobian, genus2, lesson-04]
aliases: [Jacobians of Genus-2 Curves]
created: 2026-04-09
---

> **Prerequisites**: [[02-polarizations|02. Polarizations and Principal Polarization]], [[03-genus2-curves-divisors|03. Genus-2 Curves and Divisors]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $C$ | Genus-2 curve $y^2 = f(x)$ trên $k$ |
> | $J = \text{Jac}(C)$ | Jacobian của $C$ |
> | $\iota$ | Hyperelliptic involution $(x,y) \mapsto (x,-y)$ |
> | $\infty$ | Điểm tại vô cực (khi $\deg f = 5$) |
> | $P_1, P_2$ | Points trên $C(\bar{k})$ |
> | $\Theta$ | Theta divisor trên $J$ |

---

## Từ Divisors đến Variety

Lesson trước đã xác định $\text{Jac}(C)(\bar{k}) = \text{Pic}^0(C)$ như một nhóm giao hoán. Nhưng để sử dụng trong cryptography và attack, ta cần $\text{Jac}(C)$ là một **algebraic variety** có thể tính toán được — với tọa độ, công thức, và implementation. Lesson này xây dựng điều đó.

---

## Jacobian như Abelian Surface

> [!abstract] Theorem 4.1 — Jacobian là Abelian Surface
> Với genus-2 curve $C/k$, tồn tại duy nhất (lên tới isomorphism) abelian variety $J = \text{Jac}(C)$ dimension 2 trên $k$ sao cho:
>
> $$
> J(\bar{k}) \cong \text{Pic}^0(C) \quad \text{(như nhóm)}
> $$
>
> và $J$ mang một **principal polarization** $\lambda_\Theta$ được định nghĩa bởi theta divisor $\Theta \subset J$.

Đây là theorem tồn tại và duy nhất — chứng minh đầy đủ dùng GIT (geometric invariant theory) và vượt ra ngoài scope của series này. Ta chấp nhận kết quả này và tập trung vào cách tính toán trên $J$.

---

## Theta Divisor

> [!note] Định nghĩa 4.2 — Theta Divisor
> **Theta divisor** $\Theta \subset J$ là hypersurface:
>
> $$
> \Theta = \{[D] \in J : D \geq 0, \deg D = g - 1\} = \{[P - \infty] : P \in C\} \subset J
> $$
>
> (image của $C$ trong $J$ qua Abel map $P \mapsto [P - \infty]$).
>
> Polarization $\lambda_\Theta = \phi_{\mathcal{O}(\Theta)}: J \to \hat{J}$ là principal (isomorphism).

Theta divisor là "curve bên trong Jacobian", và là cấu trúc hình học đặc trưng nhất của $J$.

---

## Abel Map và Abel-Jacobi Theorem

> [!note] Định nghĩa 4.3 — Abel Map
> **Abel map** (degree 1) là:
>
> $$
> \alpha_1: C \to J, \quad P \mapsto [P - \infty]
> $$
>
> **Abel map** (degree 2) là:
>
> $$
> \alpha_2: C \times C \to J, \quad (P, Q) \mapsto [P + Q - 2\infty]
> $$

> [!abstract] Theorem 4.4 — Abel-Jacobi
> Abel map $\alpha_2: C^{(2)} \to J$ (từ symmetric square $C^{(2)} = C \times C / S_2$) là birational morphism. Hầu hết các điểm trong $J$ có đúng một preimage trong $C^{(2)}$.

Điều này nghĩa là: **hầu hết điểm trong $J$ được biểu diễn duy nhất bởi unordered pair $\{P_1, P_2\}$ trên $C$**, qua $[P_1 + P_2 - 2\infty]$. Đây là nền tảng của Mumford representation.

---

## Tính Toán Explicit: Cantor's Algorithm

Để làm arithmetic trên $J$, ta cần cộng hai divisors. Cantor (1987) đưa ra thuật toán explicit.

**Đầu vào**: Hai divisors $D_1 = [P_1 + P_2 - 2\infty]$ và $D_2 = [Q_1 + Q_2 - 2\infty]$.

**Đầu ra**: $D_1 + D_2$ ở dạng reduced.

Thuật toán gồm 2 bước:

**Bước 1 — Composition**: Tính $D_1 + D_2$ theo nghĩa literal: formal sum $P_1 + P_2 + Q_1 + Q_2 - 4\infty$. Đây là degree-0 divisor nhưng chưa reduced (degree của phần dương là 4, quá cao).

**Bước 2 — Reduction**: Rút gọn về dạng $R_1 + R_2 - 2\infty$ bằng cách tìm principal divisor phù hợp để trừ đi. Cụ thể: tìm $g \in k(C)^*$ sao cho $P_1 + P_2 + Q_1 + Q_2 - 4\infty - \text{div}(g) = R_1 + R_2 - 2\infty$.

Thuật toán này sẽ được biểu diễn tường minh qua **Mumford coordinates** trong [[05-mumford-coordinates|Lesson 05]].

---

## Cấu Trúc Torsion của Jacobian

> [!abstract] Theorem 4.5 — Torsion Subgroup của Jacobian Genus 2
> Với $\ell$ nguyên tố, $\ell \neq \text{char}(k)$:
>
> $$
> J[\ell] \cong (\mathbb{Z}/\ell\mathbb{Z})^4
> $$
>
> Với $n = \ell^e$:
>
> $$
> J[n] \cong (\mathbb{Z}/n\mathbb{Z})^4
> $$

Đây là hệ quả của Theorem 1.7 với $g = 2$.

**Ý nghĩa cụ thể**: Trong Castryck-Decru attack, ta làm việc với $(2,2)$-torsion của $J$: $J[2] \cong (\mathbb{Z}/2\mathbb{Z})^4$. Kernel của Richelot isogeny là một subgroup của $J[2]$ đồng cấu với $(\mathbb{Z}/2\mathbb{Z})^2$.

---

## Weil Pairing trên Jacobian

Kế thừa từ [[02-polarizations|Lesson 02]], Weil pairing trên $J$ với principal polarization $\lambda_\Theta$:

$$
e_n^J: J[n] \times J[n] \to \mu_n
$$

là alternating, non-degenerate, và **symplectic** — tức là $e_n^J(x, y) = e_n^J(y, x)^{-1}$.

> [!info] Tính Symplectic và Isogenies
> Nếu $\Phi: J_1 \to J_2$ là isogeny tương thích với polarizations, thì:
>
> $$
> e_n^{J_2}(\Phi(x), \Phi(y)) = e_n^{J_1}(x, y)^{\deg \Phi}
> $$
>
> Đây là công cụ để kiểm tra các điều kiện trong Kani's theorem.

---

## Jacobian vs. Tích $E_1 \times E_2$

Cả $\text{Jac}(C)$ và $E_1 \times E_2$ đều là PPAS. Sự khác biệt nằm ở:

| | $\text{Jac}(C)$ | $E_1 \times E_2$ |
|--|--|--|
| Loại | Irreducible | Split |
| Theta divisor | Curve $\cong C$ embedded | Union hai divisors từ $E_1$, $E_2$ |
| Isogeny với EC | Thường không trực tiếp | Có projection $E_1 \times E_2 \to E_i$ |
| Trong attack | Image khi chưa split | Domain và target khi split |

Phân biệt hai loại này — split test — là bước trung tâm của attack, sẽ được phân tích trong [[08-glue-and-split|Lesson 08]].

---

## Richelot Correspondence (Preview)

Với genus-2 curve $C: y^2 = f(x)$ trong đó $f = G_1 G_2 G_3$ là tích của 3 quadratics, có một construction tự nhiên gọi là **Richelot isogeny**: isogeny $(2,2)$ từ $\text{Jac}(C)$ sang $\text{Jac}(C')$ cho một genus-2 curve $C'$ được xây dựng từ $G_1, G_2, G_3$. Trong một số trường hợp, "curve" $C'$ thực ra là degenerate — và Jacobian $\text{Jac}(C')$ split thành tích $E_1' \times E_2'$.

Đây chính là "glue-and-split" mechanism sẽ được xây dựng đầy đủ trong [[07-richelot-isogenies|Lesson 07]] và [[08-glue-and-split|Lesson 08]].

---

## Ví dụ SageMath: Jacobian Arithmetic

```sage
p = 1019
k = GF(p)
R.<x> = k[]
f = x^5 + 3*x^3 + x + 1
C = HyperellipticCurve(f)
J = C.jacobian()

D1 = J(C.lift_x(k(2)))
D2 = J(C.lift_x(k(5)))
D3 = D1 + D2
print("D1 =", D1)
print("D2 =", D2)
print("D1 + D2 =", D3)
print("Order test:", 100 * D1)
```

---

## Summary

- $J = \text{Jac}(C)$: abelian surface, $J(\bar{k}) = \text{Pic}^0(C)$.
- **Theta divisor** $\Theta$: image của $C$ trong $J$, sinh ra principal polarization $\lambda_\Theta$.
- **Abel-Jacobi**: hầu hết điểm trong $J$ biểu diễn bởi unordered pair $\{P_1, P_2\}$ trên $C$.
- **Cantor's algorithm**: cộng divisors qua composition + reduction.
- $J[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$ — torsion cấu trúc tương tự tích $E[n]^2$.
- **Split test** phân biệt $J$ (irreducible) vs. $E_1 \times E_2$ (split): trung tâm của attack.

---

## References

- Cantor, D. — *Computing in the Jacobian of a Hyperelliptic Curve*, Math. Comp. 48 (1987)
- Cassels & Flynn — *Prolegomena to a Middlebrow Arithmetic of Curves of Genus 2*, Ch. 2–3
- Milne, J.S. — *Jacobian Varieties*, §1–4
- Costello, C. & Lauter, K. — *Group Law Computations on Jacobians of Hyperelliptic Curves* (2010)
