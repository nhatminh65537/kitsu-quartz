---
title: "03. Genus-2 Curves and Divisors"
type: math-component
tags: [crypto, isogeny, genus2, divisors, lesson-03]
aliases: [Genus-2 Curves and Divisors]
created: 2026-04-09
---

> **Prerequisites**: [[01-abelian-varieties-foundations|01. Abelian Varieties — Foundations]], elliptic curves (group law, Weierstrass), algebraic curve cơ bản
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $C$ | Smooth projective curve trên $k$ |
> | $k(C)$ | Function field của $C$ |
> | $g$ | Genus của curve |
> | $\text{Div}(C)$ | Group of divisors trên $C$ |
> | $\text{Div}^0(C)$ | Degree-0 divisors trên $C$ |
> | $\text{Prin}(C)$ | Principal divisors trên $C$ |
> | $\sim$ | Linear equivalence của divisors |
> | $\Omega^1_C$ | Sheaf of differential 1-forms trên $C$ |

---

## Tại sao Genus-2 Curves?

Genus-2 curves là "bước tiếp theo" sau elliptic curves. Trong khi elliptic curve (genus 1) có Jacobian bằng chính nó, **Jacobian của genus-2 curve là abelian surface** — loại đối tượng xuất hiện tự nhiên khi ta xây dựng (2,2)-isogenies trong Castryck-Decru attack. Muốn hiểu Jacobians, trước tiên phải hiểu curves và divisors.

---

## Algebraic Curves và Genus

> [!note] Định nghĩa 3.1 — Smooth Projective Curve
> Một **smooth projective curve** $C/k$ là variety dimension 1, projective, không có singular points. **Genus** $g$ của $C$ là:
>
> $$
> g = \dim_k H^0(C, \Omega^1_C)
> $$
>
> (số linearly independent holomorphic differentials).
>
> **Ví dụ theo genus**:
> - $g = 0$: Projective line $\mathbb{P}^1$
> - $g = 1$: Elliptic curve
> - $g = 2$: Genus-2 curve (hyperelliptic)

---

## Hyperelliptic Curves và Genus-2

Genus-2 curves là **hyperelliptic**: luôn có model dạng:

> [!note] Định nghĩa 3.2 — Genus-2 Curve
> Một **genus-2 curve** $C/k$ với $\text{char}(k) \neq 2$ có model affine:
>
> $$
> C: y^2 = f(x)
> $$
>
> trong đó $f(x) \in k[x]$ là squarefree polynomial, $\deg f \in \{5, 6\}$.
>
> Mọi genus-2 curve trên field $\text{char} \neq 2$ đều có dạng này (lên tới isomorphism).

**Tại sao $\deg f = 5$ hoặc $6$?** Genus được tính bởi công thức Riemann-Hurwitz: với hyperelliptic curve $y^2 = f(x)$, $g = \lfloor (\deg f - 1)/2 \rfloor$. Với $g = 2$: $\deg f = 5$ (model affine, một điểm tại vô cực) hoặc $\deg f = 6$ (hai điểm tại vô cực).

**Ví dụ cụ thể**:

$$
C: y^2 = x^5 - x, \quad C: y^2 = x^6 + x^3 + 1
$$

---

## Divisors

Divisors là ngôn ngữ cơ bản để xây dựng Jacobian và làm arithmetic trên curves.

> [!note] Định nghĩa 3.3 — Divisor trên Curve
> Một **divisor** trên $C$ là formal sum hữu hạn:
>
> $$
> D = \sum_{P \in C(\bar{k})} n_P \cdot P, \quad n_P \in \mathbb{Z}, \text{ almost all } n_P = 0
> $$
>
> **Degree** của $D$: $\deg D = \sum_{P} n_P$.
>
> **Divisor group**: $\text{Div}(C) = $ group of all divisors (under addition).
>
> **Degree-0 subgroup**: $\text{Div}^0(C) = \{D \in \text{Div}(C) : \deg D = 0\}$.

---

## Principal Divisors và Linear Equivalence

> [!note] Định nghĩa 3.4 — Principal Divisor
> Với $f \in k(C)^*$ (non-zero rational function trên $C$), **principal divisor** là:
>
> $$
> \text{div}(f) = \sum_{P \in C(\bar{k})} v_P(f) \cdot P
> $$
>
> trong đó $v_P(f)$ là order of vanishing của $f$ tại $P$ (dương nếu $f$ có zero, âm nếu có pole).
>
> **Principal divisor group**: $\text{Prin}(C) = \{\text{div}(f) : f \in k(C)^*\}$.
>
> Hai divisors $D_1, D_2$ **linearly equivalent** ($D_1 \sim D_2$) nếu $D_1 - D_2 \in \text{Prin}(C)$.

**Tính chất cơ bản**: $\deg(\text{div}(f)) = 0$ với mọi $f$ (số zeros = số poles, tính bội số).

---

## Riemann-Roch Theorem

> [!abstract] Theorem 3.5 — Riemann-Roch
> Với divisor $D$ trên smooth projective curve $C$ genus $g$, và $K_C$ là canonical divisor:
>
> $$
> \ell(D) - \ell(K_C - D) = \deg D - g + 1
> $$
>
> trong đó $\ell(D) = \dim_k H^0(C, \mathcal{O}(D))$ là số sections của line bundle $\mathcal{O}(D)$.

Riemann-Roch là công cụ tính toán cơ bản trên curves. Với $\deg K_C = 2g - 2$ (đối với genus-2 curve: $\deg K_C = 2$), Riemann-Roch cho ta biết kích thước của các linear systems.

**Ứng dụng trực tiếp**: Với genus-2 curve $C$ và $P \in C$, mọi divisor degree $\geq 2g - 1 = 3$ đều có duy nhất một "representative" trong linear equivalence class, tức là phép rút gọn trong Jacobian luôn kết thúc.

---

## Picard Group và Jacobian

> [!note] Định nghĩa 3.6 — Picard Group
> **Picard group** (hay **divisor class group**) của $C$ là:
>
> $$
> \text{Pic}(C) = \text{Div}(C) / \text{Prin}(C)
> $$
>
> **Degree-0 Picard group**:
>
> $$
> \text{Pic}^0(C) = \text{Div}^0(C) / \text{Prin}(C)
> $$

> [!abstract] Theorem 3.7 — Jacobian là Pic$^0$
> Với smooth projective curve $C$ genus $g$, **Jacobian variety** $\text{Jac}(C)$ là:
>
> $$
> \text{Jac}(C)(\bar{k}) = \text{Pic}^0(C)
> $$
>
> $\text{Jac}(C)$ là abelian variety dimension $g$ trên $k$.

Đây là định nghĩa functorial của Jacobian. Phần "variety" (tức là cấu trúc algebraic geometry) cần xây dựng cẩn thận — được làm rõ trong [[04-jacobians-genus2|04. Jacobians of Genus-2 Curves]].

---

## Divisors trên Genus-2 Curve — Cụ thể

Với $C: y^2 = f(x)$ genus 2, ta mô tả divisors cụ thể hơn.

**Involution hyperelliptic**: $C$ có involution $\iota: (x, y) \mapsto (x, -y)$. Với mỗi điểm affine $P = (x_0, y_0) \in C$ ($y_0 \neq 0$), điểm đối xứng là $\bar{P} = (x_0, -y_0)$.

**Weierstrass points**: Điểm cố định của $\iota$, tức là $P = (x_0, 0)$ với $f(x_0) = 0$. Có đúng $2g + 2 = 6$ Weierstrass points (hoặc $2g + 1 = 5$ affine và 1 tại $\infty$ khi $\deg f = 5$).

**Điểm tại vô cực**:
- Khi $\deg f = 5$: có duy nhất một điểm $\infty$ ở infinity, là Weierstrass point.
- Khi $\deg f = 6$: có hai điểm $\infty^+$, $\infty^-$ (không phải Weierstrass).

**Degree-0 divisor điển hình**: $D = P_1 + P_2 - 2\cdot\infty$ với $P_1, P_2 \in C(\bar{k})$. Đây là divisor degree 0 "kiểu" phổ biến nhất trong tính toán.

---

## Rút gọn Divisor (Reduction)

Một điểm quan trọng: trong $\text{Pic}^0(C)$, mỗi class được đại diện bởi một divisor **reduced** duy nhất — đây là nền tảng của Mumford representation sẽ học ở [[05-mumford-coordinates|Lesson 05]].

> [!abstract] Theorem 3.8 — Reduced Divisors (Genus 2)
> Mỗi element của $\text{Pic}^0(C)$ có đúng một đại diện dạng:
>
> $$
> D = P_1 + P_2 - 2\cdot\infty \quad \text{(hoặc } P - \infty \text{, hoặc } \mathcal{O}\text{)}
> $$
>
> với $P_1, P_2 \in C(\bar{k})$ và $P_2 \neq \bar{P}_1$ (không phải conjugate pairs). Dạng này gọi là **semi-reduced**.

Từ đây, arithmetic trên $\text{Jac}(C)$ được thực hiện qua thao tác trên các pair $(P_1, P_2)$, và rút gọn về dạng semi-reduced. Đây là cơ sở của Cantor's algorithm.

---

## Genus-2 trong SageMath

Làm việc với genus-2 curves trong SageMath:

```sage
k = GF(101)
R.<x> = k[]
f = x^5 - x + 1
C = HyperellipticCurve(f)
J = C.jacobian()
print(J)
P = C.random_point()
Q = C.random_point()
D = J(C([P[0], P[1]])) + J(C([Q[0], Q[1]]))
print(D)
```

---

## Summary

- Genus-2 curve $C: y^2 = f(x)$, $\deg f \in \{5, 6\}$, squarefree.
- **Divisor**: formal sum $\sum n_P \cdot P$; degree-0 divisors $\text{Div}^0(C)$.
- **Picard group** $\text{Pic}^0(C) = \text{Div}^0(C) / \text{Prin}(C)$: nhóm giao hoán cơ bản.
- **Jacobian** $\text{Jac}(C) = \text{Pic}^0(C)$ (variety): abelian surface.
- Mỗi element của $\text{Jac}(C)$ được đại diện bởi reduced divisor dạng $P_1 + P_2 - 2\cdot\infty$.
- Hyperelliptic involution $\iota: (x,y) \mapsto (x,-y)$ định nghĩa cấu trúc đặc trưng của genus-2.

---

## References

- Cassels, J.W.S. & Flynn, E.V. — *Prolegomena to a Middlebrow Arithmetic of Curves of Genus 2* (Cambridge, 1996), Ch. 1–2
- Cantor, D. — *Computing in the Jacobian of a Hyperelliptic Curve*, Math. Comp. 48 (1987)
- Milne, J.S. — *Jacobian Varieties* (lecture notes, jmilne.org)
- Galbraith, S. — *Mathematics of Public Key Cryptography*, Ch. 6 (hyperelliptic curves)
