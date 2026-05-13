---
title: "A1. Richelot Isogeny Formulas — Explicit Derivation"
type: appendix
tags: [crypto, richelot, formulas, appendix, castryck-decru]
aliases: [Richelot Formulas]
created: 2026-04-08
---

> **Xem bài chính**: [[08-richelot-isogenies|08. Richelot Isogenies]]
> **Lesson type**: Appendix
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f(x) = G_1 G_2 G_3$ | Factored form của $f$ với $G_i$ quadratic |
> | $\delta_{ij}$ | Bézout coefficient giữa $G_i$ và $G_j$ |
> | $\hat{G}_i$ | Quadratic polynomial codomain (Richelot image) |
> | $\delta$ | Splitting discriminant |

---

## A1.1. Setup

Cho $C : y^2 = f(x) = G_1(x) G_2(x) G_3(x)$ với mỗi $G_i$ là monic quadratic:

$$
G_i(x) = x^2 - s_i x + p_i, \quad i = 1, 2, 3
$$

và Richelot partition $(G_1, G_2, G_3)$ xác định một $(2,2)$-isogeny từ $J(C)$.

---

## A1.2. Bézout Coefficients

Để tính Richelot formulas, định nghĩa:

> [!note] Định Nghĩa A1.1 — Richelot Bézout Matrix
> Với các polynomials $G_i$, định nghĩa $\delta_{ij}$ là coeff của $x$ trong $G_i \cdot G_j' - G_j \cdot G_i'$ (Sylvester-type combination):
>
> $$
> \delta_{ij} = \frac{G_i \cdot G_j' - G_j \cdot G_i'}{x - \alpha_{ij}}
> $$
>
> trong đó $G_i'$ là derivative của $G_i$ và $\alpha_{ij}$ là common root nếu có. Trong trường hợp tổng quát (không có common roots), $\delta_{ij}$ là hằng số.
>
> Cụ thể với $G_i = x^2 - s_i x + p_i$: $G_i'(x) = 2x - s_i$. Do đó:
>
> $$
> G_i G_j' - G_j G_i' = (s_j - s_i)x^2 - 2(p_j - p_i)x + p_i s_j - p_j s_i
> $$

---

## A1.3. Formulas Cho Codomain

> [!note] Theorem A1.2 — Richelot Codomain Formulas
> Với $C : y^2 = G_1 G_2 G_3$ và Richelot partition $(G_1, G_2, G_3)$, định nghĩa:
>
> $$
> \hat{G}_i = \frac{G_j' G_k - G_k' G_j}{2} \quad \text{(up to scalar)}
> $$
>
> cho $(i,j,k)$ là permutation của $(1,2,3)$.
>
> Cụ thể:
>
> $$
> \hat{G}_1 = \frac{G_2' G_3 - G_3' G_2}{2}, \quad \hat{G}_2 = \frac{G_1' G_3 - G_3' G_1}{2}, \quad \hat{G}_3 = \frac{G_1' G_2 - G_2' G_1}{2}
> $$
>
> **Splitting discriminant**:
>
> $$
> \delta = \det \begin{pmatrix} G_1(r) & G_2(r) & G_3(r) \end{pmatrix} \cdot \text{(resultant terms)}
> $$
>
> hay đơn giản hơn: tính $\delta = \hat{G}_1(r) \hat{G}_2(r) - \hat{G}_1(r)\hat{G}_3(r) + \ldots$ tại roots của $\hat{G}_i$.
>
> **Nếu $\delta \neq 0$**: Codomain là $C' : y^2 = \hat{G}_1 \hat{G}_2 \hat{G}_3$ (genus-2 curve)
>
> **Nếu $\delta = 0$**: Codomain splits: $J(C)/G \cong E_1 \times E_2$

---

## A1.4. Explicit Formula Cho $\hat{G}_i$

Với $G_i = x^2 - s_i x + p_i$, tính tường minh:

$$
G_1'(x) = 2x - s_1, \quad G_2'(x) = 2x - s_2, \quad G_3'(x) = 2x - s_3
$$

Vậy:

$$
\hat{G}_3 = \frac{G_1'(x) G_2(x) - G_2'(x) G_1(x)}{2}
$$

$$
= \frac{(2x - s_1)(x^2 - s_2 x + p_2) - (2x - s_2)(x^2 - s_1 x + p_1)}{2}
$$

Expand:

$$
= \frac{(s_2 - s_1)x^2 + 2(p_1 - p_2)x + (s_1 p_2 - s_2 p_1)}{2}
$$

Đây là quadratic trong $x$ với leading coefficient $(s_2 - s_1)/2$. Tương tự cho $\hat{G}_1$ và $\hat{G}_2$.

---

## A1.5. Splitting Criterion Tường Minh

Khi nào $\delta = 0$? Điều này xảy ra khi hai trong ba $\hat{G}_i$ có common root.

> [!abstract] Proposition A1.3 — Splitting Condition
> $\delta = 0$ (Richelot isogeny splits) khi và chỉ khi:
>
> $$
> \text{Res}(\hat{G}_i, \hat{G}_j) = 0 \quad \text{cho một cặp } (i,j)
> $$
>
> trong đó $\text{Res}$ là resultant của hai polynomials.
>
> Nói cách khác: hai trong ba quadratics $\hat{G}_i, \hat{G}_j$ có chung một root.

**Proof.** Nếu $\hat{G}_i(\alpha) = \hat{G}_j(\alpha) = 0$ với $\alpha$ common root, thì tại $x = \alpha$:
- $G_l'(\alpha) G_m(\alpha) = G_m'(\alpha) G_l(\alpha)$ (từ definition của $\hat{G}_k$)

Điều này tương đương với $f(x) = G_1 G_2 G_3$ và $f'(x)$ chia sẻ factor tại $\alpha$, tức là $\alpha$ là root kép của $f$ — nghĩa là curve $C$ degenerate tại $\alpha$. Nhưng điều này không xảy ra với smooth genus-2 curve; thay vào đó, nó nói rằng codomain Jacobian degenerate. $\blacksquare$

---

## A1.6. Tính $E_1 \times E_2$ Khi $\delta = 0$

Giả sử $\hat{G}_2$ và $\hat{G}_3$ chia sẻ root $\alpha$:

$$
\hat{G}_2(\alpha) = \hat{G}_3(\alpha) = 0
$$

Khi đó $\hat{G}_1(\alpha) \neq 0$ (vì ba $\hat{G}_i$ không chia sẻ common root đồng thời trong general position).

Hai elliptic curves trong split codomain:

$$
E_1 : y^2 = \hat{G}_1(x)(x - \alpha)
$$

$$
E_2 : y^2 = \frac{\hat{G}_2(x) \hat{G}_3(x)}{(x - \alpha)^2}
$$

(Cả hai là cubics sau khi normalize — elliptic curves.) Isomorphisms cụ thể phụ thuộc vào normalization.

---

## A1.7. Numerical Example

Cho $C : y^2 = (x^2 - 1)(x^2 - 4)(x^2 - 9)$ với:

$$
G_1 = x^2 - 1, \quad G_2 = x^2 - 4, \quad G_3 = x^2 - 9
$$

Tính:

$$
\hat{G}_3 = \frac{(2x)(x^2-4) - (2x)(x^2-1)}{2} = \frac{-6x}{2} \cdot \frac{??}{...}
$$

Wait — với $G_1 = x^2 - 1$: $s_1 = 0, p_1 = -1$; $G_2 = x^2 - 4$: $s_2 = 0, p_2 = -4$:

$$
\hat{G}_3 = \frac{(s_2 - s_1)x^2 + 2(p_1 - p_2)x + (s_1 p_2 - s_2 p_1)}{2} = \frac{0 \cdot x^2 + 2 \cdot 3x + 0}{2} = 3x
$$

Vậy $\hat{G}_3 = 3x$ — linear, không phải quadratic, nghĩa là $\hat{G}_3$ degenerate → split! Codomain: $J(C)/G \cong E_1 \times E_2$.

Đây là ví dụ canonical của split Richelot — curve có tính đối xứng đặc biệt nên Jacobian tự nhiên split.

---

## References

- Richelot, F.J. — *De transformatione integralium Abelianorum primi ordinis commentatio*, J. reine angew. Math. 16 (1837)
- Castryck, W., Decru, T., Smith, B. — *Hash functions from superspecial genus-2 curves using Richelot isogenies*, J. Math. Cryptol. 14 (2020), pp. 268–292
- Bost, J.B. & Mestre, J.F. — *Moyenne arithmético-géométrique et périodes des courbes de genre 1 et 2*, Gazette des Mathématiciens (1988)
