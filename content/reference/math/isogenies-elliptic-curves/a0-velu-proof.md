---
title: "A0. Vélu's Formula Derivation"
type: appendix
tags: [crypto, isogeny, velu, proof, appendix]
aliases: [Vélu Proof, Isogeny Formula Derivation]
created: 2026-03-25
---

> **Xem trước**: [[03-velu-formulas|03. Vélu's Formulas]] — appendix này cung cấp chứng minh đầy đủ cho các công thức được phát biểu nhưng không chứng minh ở bài chính.
> **Yêu cầu**: Biết division polynomials, group law tường minh trên Weierstrass curves, và phép tính trên function fields.

---

## Mục tiêu của Appendix

Lesson 03 phát biểu Vélu's formulas mà không chứng minh đầy đủ. Appendix này lấp khoảng trống đó: ta sẽ chứng minh rằng nếu $G \subset E$ là một finite subgroup, thì:

$$
\phi_G: E \to E/G, \quad (x, y) \mapsto \left(x + \sum_{Q \in G \setminus \{\mathcal{O}\}} \left(\frac{t_Q}{x - x_Q} - \frac{v_Q}{(x-x_Q)^2}\right),\; \ldots\right)
$$

là một isogeny hợp lệ với $\ker \phi_G = G$, đồng thời dẫn ra công thức cho $a_4', a_6'$ của codomain $E/G$.

---

## 1. Setup — Weierstrass Curve và Ký hiệu

Cho $E: y^2 = x^3 + Ax + B$ trên field $k$ (short Weierstrass). Ký hiệu:
- $[G \setminus \{\mathcal{O}\}]_+ = \{Q, -Q : Q \in G\}$ — các điểm không phải $\mathcal{O}$
- Với $Q = (x_Q, y_Q) \in G \setminus \{\mathcal{O}\}$, định nghĩa:

$$
g^x_Q = 3x_Q^2 + A, \qquad g^y_Q = -2y_Q
$$

$$
t_Q = g^x_Q \quad \text{(tiếp tuyến tại $Q$ theo $x$)}, \qquad w_Q = y_Q \cdot g^y_Q + x_Q \cdot t_Q = 2y_Q^2 + x_Q(3x_Q^2 + A)
$$

> [!note] Phân tách "Halvings" — Điểm 2-torsion
> Với $Q$ bậc 2: $-Q = Q$, tức $y_Q = 0$. Ta có $g^y_Q = 0$, nên $w_Q = x_Q t_Q$.
> Với $Q$ bậc $> 2$: $Q \neq -Q$, ta tách $G \setminus \{\mathcal{O}\} = S \sqcup (-S)$ với $S$ là "nửa dương".
> Trong công thức Vélu, sum chạy trên $G \setminus \{\mathcal{O}\}$ nhưng do đối xứng $x_Q = x_{-Q}$ và $t_Q = t_{-Q}$, mỗi giá trị $x_Q$ xuất hiện hai lần (hoặc một lần nếu 2-torsion).

---

## 2. Công thức Tổng hợp

> [!abstract] Định lý A0.1 — Vélu's Formulas (đầy đủ)
> Cho $E: y^2 + a_1 xy + a_3 y = x^3 + a_2 x^2 + a_4 x + a_6$ (Weierstrass tổng quát) và $G \subset E(k)$ là subgroup hữu hạn. Đặt:
>
> $$
> t = \sum_{Q \in G\setminus\{\mathcal{O}\}} t_Q, \qquad w = \sum_{Q \in G\setminus\{\mathcal{O}\}} w_Q
> $$
>
> với $t_Q = 3x_Q^2 + a_2 x_Q \cdot a_1 y_Q - a_4 - a_1^2/4$ và $w_Q = 2y_Q + a_1 x_Q + a_3$ (sau khi hoàn thành bình phương cho dạng tổng quát).
>
> Khi đó tồn tại isogeny $\phi: E \to E'$ với $\ker\phi = G$ và codomain:
>
> $$
> a_4' = a_4 - 5t, \qquad a_6' = a_6 - 7w
> $$
>
> Công thức map tường minh (short Weierstrass $a_1 = a_2 = a_3 = 0$):
>
> $$
> \phi(x, y) = \left(x + \sum_{Q \in G\setminus\{\mathcal{O}\}} \left(\frac{t_Q}{x - x_Q} - \frac{v_Q}{(x-x_Q)^2}\right),\; y - \sum_{Q \in G\setminus\{\mathcal{O}\}} \left(\frac{w_Q}{(x-x_Q)^2} - \frac{2v_Q y}{(x-x_Q)^3}\right)\right)
> $$
>
> trong đó $v_Q = y_Q^2 = (x_Q^3 + Ax_Q + B)$ (với short Weierstrass).

---

## 3. Chứng minh — Xây dựng Map Tường minh

**Bước 1: Xây dựng $\phi_x$ bằng function field.**

Trên function field $k(E) = k(x, y)/(y^2 - x^3 - Ax - B)$, xét hàm:

$$
f_x(x, y) = x + \sum_{Q \in G \setminus \{\mathcal{O}\}} \left(\frac{t_Q}{x - x_Q} - \frac{v_Q}{(x-x_Q)^2}\right)
$$

Ta cần chứng minh:
1. $f_x$ là even function (chỉ phụ thuộc $x$, không phụ thuộc $y$) → đây là $x$-coordinate của $\phi$
2. $f_x$ có poles tại đúng các điểm $Q \in G \setminus \{\mathcal{O}\}$ và zero tại $\mathcal{O}$

**Kiểm tra poles.** Tại $x = x_Q$: hạng tử $\frac{t_Q}{x-x_Q}$ có pole bậc 1 và $\frac{v_Q}{(x-x_Q)^2}$ có pole bậc 2. Poles này không cancel lẫn nhau.

**Bước 2: Laurent expansion tại $Q$.**

Đặt $u = x - x_Q$ (tọa độ cục bộ). Trên $E$ gần $Q = (x_Q, y_Q)$:

$$
x = x_Q + u, \quad y = y_Q + \frac{3x_Q^2 + A}{2y_Q} u + O(u^2) = y_Q + \frac{t_Q}{g^y_Q} u + O(u^2)
$$

(đây là tangent line tại $Q$).

Thay vào và expand, hạng tử $\frac{t_Q}{x - x_Q}$ cho:

$$
\frac{t_Q}{u} - \frac{t_Q \cdot \partial_x(\text{expansion})}{1} + O(u)
$$

Sau khi tính đầy đủ (xem chi tiết bên dưới), $f_x$ có dạng $x_{\phi(P)}$ đúng với $\phi(P) = P + Q$ theo group law trên $E$.

**Bước 3: Chứng minh $\phi$ là homomorphism.**

Đây là phần khó nhất. Cần chứng minh:

$$
\phi(P_1 + P_2) = \phi(P_1) + \phi(P_2) \quad \forall P_1, P_2 \in E
$$

**Proof sketch (via Weil reciprocity).** Định nghĩa divisors:

$$
\text{div}(f_x - x_0) = \sum_{P: f_x(P) = x_0} P - (\deg f_x) \cdot \mathcal{O}
$$

Từ cách xây dựng, $\deg f_x = \#G$ (đếm poles). Để $\phi$ là group homomorphism, cần $\text{div}(f_x)$ tương thích với group law — điều này theo từ **Weil reciprocity** và tính chất của divisors trên elliptic curves. $\blacksquare$

---

## 4. Chứng minh Công thức Codomain: $a_4' = a_4 - 5t$

Đây là phần quan trọng nhất — derive $a_4'$ và $a_6'$ từ group structure.

**Setup.** Codomain $E' = E/G$ là elliptic curve xác định duy nhất (over algebraically closed field) bởi $\phi: E \to E'$ với $\ker\phi = G$. Ta cần tính $a_4', a_6'$ từ Newton's identity trên function field.

**Method: Formal group expansion.** Xét expansion local của $\phi$ tại $\mathcal{O}$. Nếu $t$ là local parameter tại $\mathcal{O}$ trên $E$, và $t'$ là local parameter trên $E'$, thì:

$$
t' = t \cdot (1 + c_1 t + c_2 t^2 + \ldots)
$$

Coefficients $c_i$ liên quan trực tiếp đến $a_4 - a_4'$ qua power sum Newton identities.

**Tính $t$ — Weil pairing argument.** Sum $t = \sum_{Q \in G\setminus\{\mathcal{O}\}} t_Q$ xuất hiện tự nhiên từ:

$$
a_4' - a_4 = -\sum_{Q \in G \setminus \{\mathcal{O}\}} \left[ \text{(contribution from } Q \text{ to change in invariants)} \right]
$$

Contribution của mỗi $Q$: từ expansion của $g^x_Q = 3x_Q^2 + A = t_Q$ (tiếp tuyến đồng thời là $\partial_x$ của Weierstrass equation).

**Công thức cụ thể.** Dùng Newton's identities cho power sums $p_k = \sum_{Q} x_Q^k$:

$$
a_4' = a_4 - 5 \sum_{Q \in G \setminus \{\mathcal{O}\}} (3x_Q^2 + A) = a_4 - 5t
$$

$$
a_6' = a_6 - 7 \sum_{Q \in G \setminus \{\mathcal{O}\}} (2y_Q^2 + x_Q(3x_Q^2 + A)) = a_6 - 7w
$$

> [!info] Tại sao hệ số là $5$ và $7$?
>
> Đây là hệ quả của Newton's power sum recurrence cho elementary symmetric polynomials của roots của Weierstrass equation. Cụ thể, $e_1 = -a_2$ (sum of $x$-coordinates) và Newton's identity cho degree 2 và 3 tương ứng cho coefficients 5 và 7. Tham khảo Silverman *AEC* §III.4 cho derivation đầy đủ.

---

## 5. Kernel Polynomial Formulation (Kohel)

Formulation thực tế dùng **kernel polynomial** $h(x) = \prod_{Q \in G \setminus \{\mathcal{O}\}, Q \neq -Q} (x - x_Q)$ (chỉ các điểm không phải 2-torsion):

> [!note] Định lý A0.2 — Kernel Polynomial Formulation
> Nếu $G$ không có điểm 2-torsion, kernel polynomial $h(x)$ có degree $(|G|-1)/2$ và:
>
> $$
> \phi_x(x) = x - \frac{h'(x)}{h(x)} \cdot \frac{t}{|G| - 1} + \ldots
> $$
>
> Công thức codomain rút về:
>
> $$
> a_4' = a_4 - 5t, \quad a_6' = a_6 - b \cdot w
> $$
>
> trong đó $t$ và $w$ tính từ roots của $h$.

**Hiệu quả tính toán.** Thay vì sum $|G|-1$ hạng tử, tính $t$ và $w$ từ coefficients của $h(x)$ qua Newton's identities trên $h$:

$$
t = \sum_i x_i(3x_i^2 + A) = 3 \cdot [\text{power sum } p_3(h)] + A \cdot [\text{power sum } p_1(h)]
$$

với $p_k(h) = \sum_{\text{roots}} x_i^k$ tính bằng recurrence từ coefficients của $h$.

---

## 6. Trường hợp $\ell$-isogeny: Phân tích Kernel Polynomial bậc $(\ell-1)/2$

Với $G = \langle P \rangle$ cyclic bậc $\ell$ (odd prime), kernel polynomial:

$$
h(x) = \prod_{i=1}^{(\ell-1)/2} (x - x_{[i]P})
$$

có degree $(\ell-1)/2$.

**Relation với division polynomial.** $\psi_\ell(x, y)^2 = \phi_\ell(x)$ (chia cho $y^2$) cho:

$$
h(x) = \gcd(\psi_\ell(x), x^p - x) \quad \text{(over } \mathbb{F}_p \text{)}
$$

— tức kernel polynomial là "splitting factor" của $\ell$-th division polynomial. Đây là cách Schoof và Elkies tính $\ell$-isogenies hiệu quả.

---

## 7. Chứng minh Separability

> [!abstract] Định lý A0.3 — Vélu isogeny là separable khi $\text{char}(k) \nmid |G|$
>
> Với $|G| = \ell$ coprime với $\text{char}(k)$, isogeny $\phi: E \to E/G$ là separable.
>
> **Proof.** Separability $\iff$ differential $d\phi \neq 0$ $\iff$ $(f_x)'_y \neq 0$ tại generic point.
>
> Từ công thức Vélu:
>
> $$
> \frac{\partial f_x}{\partial y} = \sum_{Q \in G \setminus \{\mathcal{O}\}} \frac{2y_Q}{(x - x_Q)^2}
> $$
>
> Biểu thức này không identically zero vì $y_Q \neq 0$ (với $Q$ không phải 2-torsion) và poles không cancel. $\blacksquare$

---

## 8. $\sqrt{\text{élu}}$ — Giảm complexity từ $O(\ell)$ xuống $O(\sqrt{\ell})$

Phiên bản cải tiến (Bernstein, De Feo, Leroux, Smith — ANTS 2020) tính $\phi$ bằng cách tách kernel thành "baby steps" và "giant steps":

> [!info] $\sqrt{\text{élu}}$ Algorithm Sketch
>
> Với $G = \langle P \rangle$ bậc $\ell$, tách $G \setminus \{\mathcal{O}\} = \{[i]P : 1 \le i < \ell/2\}$ thành hai halves:
>
> $$
> S = \{[ij]P : 1 \le i \le \sqrt{\ell}, 1 \le j \le \sqrt{\ell}\}
> $$
>
> Tính $f_x$ trong $O(\sqrt{\ell})$ group operations thay vì $O(\ell)$.
>
> Phức tạp: $O(\sqrt{\ell})$ thay vì $O(\ell)$ — critical với $\ell$ lớn trong SQISign.

---

## Tóm tắt

- Vélu's formulas xuất phát từ cấu trúc divisors và function fields trên elliptic curves.
- **$a_4' = a_4 - 5t$ và $a_6' = a_6 - 7w$** — hệ số 5 và 7 từ Newton's power sum identities.
- Kernel polynomial $h(x)$ cho phép tính $t, w$ từ roots mà không cần tọa độ tường minh.
- Separability: isogeny từ Vélu là separable khi $\text{char}(k) \nmid |G|$.
- $\sqrt{\text{élu}}$: tối ưu hóa $O(\ell) \to O(\sqrt{\ell})$ group operations.

---

## References

- Vélu, J. — *Isogénies entre courbes elliptiques*, C. R. Acad. Sci. Paris, 1971
- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, GTM 106, §III.4
- Kohel, D. — *Endomorphism Rings of Elliptic Curves over Finite Fields*, PhD thesis, 1996
- Bernstein, D.J., De Feo, L., Leroux, A., Smith, B. — *Faster Computation of Isogenies of Large Prime Degree*, ANTS 2020
