---
title: "03. Polynomial Rings and Factorization"
tags: [math, algebra-foundations, lesson-03]
aliases: [Polynomial Rings and Factorization]
created: 2026-03-28
---

> **Prerequisites**: [[01-rings-and-ideals|01. Rings and Ideals]], [[02-special-rings-domains-fields|02. Special Rings: Domains and Fields]] — integral domain, UFD, PID, irreducible, prime, characteristic.
> **Objectives**:
> - Hiểu cấu trúc đại số của vành đa thức $R[x]$ và mở rộng $R[x_1, \ldots, x_n]$
> - Phân biệt content, primitive polynomial và phát biểu Gauss's Lemma
> - Áp dụng Eisenstein Criterion để kiểm tra tính bất khả quy
> - Chứng minh định lý nền tảng: $R$ là UFD $\Rightarrow$ $R[x]$ là UFD
> - Hiểu tại sao $\mathbb{Z}[x]$ là UFD nhưng không phải PID

---

## Motivation / Intuition

Vành đa thức $R[x]$ là một trong những công cụ xây dựng quan trọng nhất trong đại số. Từ $\mathbb{Z}$ ta xây dựng $\mathbb{Z}[x]$, $\mathbb{Z}[x,y]$, và tiếp tục — đây chính là nguyên liệu thô của Algebraic Geometry (rings của hàm trên các variety đa thức).

Câu hỏi trung tâm: **khi nào một đa thức là bất khả quy?** Đây không chỉ là câu hỏi số học thuần túy — nó liên quan trực tiếp đến cấu trúc của field extensions (Bài 06–07): $f \in k[x]$ bất khả quy khi và chỉ khi $k[x]/(f)$ là field.

Bài này xây dựng bộ công cụ để trả lời câu hỏi đó: Gauss's Lemma cho phép ta "chuyển" bài toán từ $\mathbb{Q}[x]$ về $\mathbb{Z}[x]$, còn Eisenstein Criterion cho tiêu chuẩn đặc biệt hiệu quả.

---

## Vành đa thức (Polynomial Ring)

### Định nghĩa

> [!definition] Definition 3.1 — Polynomial Ring
> Cho $R$ là commutative ring. **Vành đa thức** (polynomial ring) $R[x]$ là tập các dãy hữu hạn:
>
> $$
> R[x] = \left\{ a_0 + a_1 x + \cdots + a_n x^n \;\middle|\; n \geq 0,\; a_i \in R \right\}
> $$
>
> với phép cộng theo hệ số (coefficient-wise) và phép nhân theo quy tắc Cauchy:
>
> $$
> \left(\sum_i a_i x^i\right)\left(\sum_j b_j x^j\right) = \sum_k \left(\sum_{i+j=k} a_i b_j\right) x^k
> $$

> [!definition] Definition 3.2 — Degree, Leading Coefficient, Monic
> Cho $f = a_0 + a_1 x + \cdots + a_n x^n \in R[x]$ với $a_n \neq 0$:
>
> - **Degree** (bậc): $\deg f = n$. Quy ước $\deg 0 = -\infty$.
> - **Leading coefficient** (hệ số dẫn đầu): $a_n$.
> - $f$ là **monic** nếu $a_n = 1$.

> [!theorem] Theorem 3.3 — Bậc và phép nhân
> Nếu $R$ là integral domain thì với $f, g \in R[x]$ khác $0$:
>
> $$
> \deg(fg) = \deg f + \deg g
> $$
>
> Đặc biệt, $R[x]$ là integral domain khi $R$ là integral domain.

**Proof.**
Cho $f$ bậc $m$ với leading coefficient $a_m$ và $g$ bậc $n$ với leading coefficient $b_n$. Hệ số của $x^{m+n}$ trong $fg$ là $a_m b_n$. Vì $R$ là integral domain và $a_m, b_n \neq 0$, ta có $a_m b_n \neq 0$. Vậy $\deg(fg) = m + n$. $\blacksquare$

> [!note] Remark 3.4 — Đa thức nhiều biến
> Ta định nghĩa đệ quy: $R[x_1, \ldots, x_n] = R[x_1, \ldots, x_{n-1}][x_n]$. Vành này giao hoán khi $R$ giao hoán và là integral domain khi $R$ là integral domain.

### Universal Property của $R[x]$

> [!theorem] Theorem 3.5 — Universal Property (Evaluation)
> Cho $R \to S$ là ring homomorphism và $s \in S$. Tồn tại duy nhất một ring homomorphism $\operatorname{ev}_s : R[x] \to S$ mở rộng $R \to S$ với $\operatorname{ev}_s(x) = s$:
>
> $$
> \operatorname{ev}_s\!\left(\sum a_i x^i\right) = \sum \varphi(a_i) s^i
> $$

Nói cách khác: $R[x]$ là "ring tự do nhất" chứa $R$ và một phần tử phân biệt $x$. Tính chất này xác định $R[x]$ duy nhất (sai sai isomorphism).

---

## Phép chia Euclid trong $k[x]$

> [!theorem] Theorem 3.6 — Division Algorithm
> Cho $k$ là field và $f, g \in k[x]$ với $g \neq 0$. Tồn tại duy nhất $q, r \in k[x]$ sao cho:
>
> $$
> f = qg + r, \qquad \deg r < \deg g \text{ (hoặc } r = 0\text{)}
> $$

**Proof.**
Sự tồn tại bằng induction trên $\deg f$. Nếu $\deg f < \deg g$, đặt $q = 0$, $r = f$. Nếu $\deg f \geq \deg g$: gọi $a$ là leading coefficient của $f$, $b$ là leading coefficient của $g$, $m = \deg f - \deg g$. Đặt $f_1 = f - ab^{-1}x^m g$, thì $\deg f_1 < \deg f$. Áp dụng induction cho $f_1$, $g$.

Tính duy nhất: nếu $f = qg + r = q'g + r'$ thì $(q-q')g = r'-r$. Nếu $q \neq q'$ thì $\deg((q-q')g) \geq \deg g > \deg(r'-r)$, mâu thuẫn. $\blacksquare$

> [!corollary] Corollary 3.7 — Factor Theorem
> $c \in k$ là nghiệm của $f \in k[x]$ khi và chỉ khi $(x - c) \mid f$.

> [!corollary] Corollary 3.8
> Đa thức bậc $n$ trên field có tối đa $n$ nghiệm.

---

## Content, Primitive Polynomial và Gauss's Lemma

### Content và Primitive

> [!definition] Definition 3.9 — Content và Primitive Polynomial
> Cho $R$ là UFD và $f = a_0 + a_1 x + \cdots + a_n x^n \in R[x]$.
>
> - **Content** (nội dung) của $f$: $\operatorname{cont}(f) = \gcd(a_0, a_1, \ldots, a_n)$ (xác định đến associates).
> - $f$ là **primitive** (nguyên thủy) nếu $\operatorname{cont}(f) = 1$, tức các hệ số không có ước chung khác unit.

> [!example] Example 3.10
> Trong $\mathbb{Z}[x]$:
>
> - $f = 6x^2 + 4x + 10$: $\operatorname{cont}(f) = \gcd(6,4,10) = 2$. Không primitive.
> - $g = 3x^2 + 2x + 5$: $\operatorname{cont}(g) = \gcd(3,2,5) = 1$. Primitive.
> - Mọi $f \in \mathbb{Z}[x]$ viết được: $f = \operatorname{cont}(f) \cdot f_0$ với $f_0$ primitive.

### Gauss's Lemma

> [!theorem] Theorem 3.11 — Gauss's Lemma
> Cho $R$ là UFD với field of fractions $K = \operatorname{Frac}(R)$.
>
> **(a)** Tích của hai primitive polynomials là primitive: nếu $f, g \in R[x]$ primitive thì $fg$ primitive.
>
> **(b)** $f \in R[x]$ primitive bất khả quy trong $R[x]$ $\iff$ $f$ bất khả quy trong $K[x]$.
>
> **(c)** Nếu $f \in R[x]$ có $\deg f \geq 1$ và $f = gh$ với $g, h \in K[x]$, thì $f = g_0 h_0$ với $g_0, h_0 \in R[x]$, $\deg g_0 = \deg g$, $\deg h_0 = \deg h$.

**Proof của (a).**
Giả sử $fg$ không primitive: tồn tại nguyên tố $p \in R$ với $p \mid \operatorname{cont}(fg)$. Xét $\bar{f}, \bar{g}$ là ảnh của $f, g$ trong $(R/(p))[x]$. Vì $p \mid \operatorname{cont}(fg)$, ta có $\bar{f}\bar{g} = 0$ trong $(R/(p))[x]$. Vì $p$ là nguyên tố, $R/(p)$ là integral domain, nên $(R/(p))[x]$ là integral domain. Vậy $\bar{f} = 0$ hoặc $\bar{g} = 0$, tức $p \mid \operatorname{cont}(f)$ hoặc $p \mid \operatorname{cont}(g)$ — mâu thuẫn với $f$, $g$ primitive. $\blacksquare$

**Proof của (b).**
($\Rightarrow$) Nếu $f$ bất khả quy trong $R[x]$, viết $f = gh$ trong $K[x]$. Nhân cả hai vế với mẫu chung và dùng (c), suy ra $f = g_0 h_0$ trong $R[x]$ với $g_0, h_0$ cùng bậc với $g, h$. Vì $f$ bất khả quy trong $R[x]$, một trong $g_0, h_0$ là unit trong $R[x]$ (tức là unit trong $R$, tức constant), do đó một trong $g, h$ là unit trong $K[x]$.

($\Leftarrow$) Nếu $f$ bất khả quy trong $K[x]$ và $f = g_0 h_0$ trong $R[x]$, thì trong $K[x]$ một trong $g_0, h_0$ là unit, tức constant $c \in K^\times$. Vì $f$ primitive, $c \in R^\times$. $\blacksquare$

> [!note] Remark 3.12 — Ý nghĩa thực tế
> Gauss's Lemma cho phép ta **chuyển bài toán** bất khả quy từ $\mathbb{Z}[x]$ lên $\mathbb{Q}[x]$: để kiểm tra $f \in \mathbb{Z}[x]$ primitive có bất khả quy không, ta chỉ cần kiểm tra trong $\mathbb{Q}[x]$ — nơi có phép chia Euclid và công cụ phân tích mạnh hơn nhiều.

---

## Eisenstein Criterion

> [!theorem] Theorem 3.13 — Eisenstein Irreducibility Criterion
> Cho $R$ là integral domain, $P \trianglelefteq R$ là prime ideal, và
>
> $$
> f = a_n x^n + a_{n-1} x^{n-1} + \cdots + a_1 x + a_0 \in R[x]
> $$
>
> Nếu:
>
> 1. $a_n \notin P$ (hệ số dẫn đầu không thuộc $P$),
> 2. $a_0, a_1, \ldots, a_{n-1} \in P$ (mọi hệ số khác thuộc $P$),
> 3. $a_0 \notin P^2$ (hệ số tự do không thuộc $P^2$),
>
> thì $f$ bất khả quy trong $R[x]$.

**Proof.**
Giả sử $f = gh$ với $g = b_r x^r + \cdots + b_0$ và $h = c_s x^s + \cdots + c_0$, $r + s = n$, và $g, h$ không phải unit. Xét projection $\pi : R \to R/P$ và mở rộng sang $\pi : R[x] \to (R/P)[x]$.

Vì $a_1, \ldots, a_{n-1} \in P$: $\pi(f) = \pi(a_n) x^n$. Vì $a_n \notin P$: $\pi(a_n) \neq 0$. Do $\pi(f) = \pi(g)\pi(h)$ và $(R/P)[x]$ là integral domain (vì $P$ prime nên $R/P$ là domain), nên:

$$
\pi(g) = \pi(b_r)x^r, \qquad \pi(h) = \pi(c_s)x^s
$$

Tức $b_0, b_1, \ldots, b_{r-1} \in P$ và $c_0, c_1, \ldots, c_{s-1} \in P$.

Nhưng $a_0 = b_0 c_0$. Vì $b_0, c_0 \in P$ nên $a_0 \in P^2$ — mâu thuẫn với giả thiết (3). $\blacksquare$

> [!example] Example 3.14 — Áp dụng Eisenstein
> **(a)** $f = x^p - p \in \mathbb{Z}[x]$ với $p$ nguyên tố, dùng ideal $(p)$: $p \nmid 1$ (leading), $p \mid p$ (constant), $p^2 \nmid p$. Eisenstein: $f$ bất khả quy trên $\mathbb{Q}$.
>
> **(b)** $f = x^4 + 4x^3 + 6x^2 + 4x + 2$, dùng $P = (2)$: hệ số tự do $2 \in (2)$, $2 \notin (4)$; các hệ số còn lại $4, 6, 4 \in (2)$; hệ số dẫn đầu $1 \notin (2)$. Eisenstein: $f$ bất khả quy trên $\mathbb{Q}$.
>
> **(c)** $f = x^4 + 1$: Eisenstein không áp dụng trực tiếp. Tuy nhiên, thay $x \mapsto x+1$: $(x+1)^4 + 1 = x^4 + 4x^3 + 6x^2 + 4x + 2$ — trường hợp (b). Vì phép thay thế này là automorphism của $\mathbb{Q}[x]$, $f$ bất khả quy trên $\mathbb{Q}$.

> [!warning] Counterexample 3.15 — Eisenstein không áp dụng được không có nghĩa là f khả quy
> $f = x^4 + 1$ bất khả quy trên $\mathbb{Q}$ nhưng Eisenstein không áp dụng trực tiếp — cần trick thay biến. Đây là nhắc nhở rằng Eisenstein là điều kiện **đủ**, không phải cần.

---

## $R$ là UFD kéo theo $R[x]$ là UFD

> [!theorem] Theorem 3.16 — Gauss's Theorem on UFD
> Nếu $R$ là UFD thì $R[x]$ là UFD.

**Proof.**
Cho $f \in R[x]$, $\deg f \geq 1$, không phải unit. Viết $f = \operatorname{cont}(f) \cdot f_0$ với $f_0$ primitive. Vì $R$ là UFD, $\operatorname{cont}(f)$ phân tích thành tích các primes của $R$.

Còn lại: chứng minh $f_0$ phân tích thành tích các primitives bất khả quy trong $R[x]$. Theo Gauss's Lemma (Theorem 3.11b), $f_0$ bất khả quy trong $R[x]$ $\iff$ bất khả quy trong $K[x]$ với $K = \operatorname{Frac}(R)$. Vì $K[x]$ là PID (do $K$ là field), $K[x]$ là UFD. Phân tích $f_0 = q_1 \cdots q_m$ trong $K[x]$ với $q_i$ bất khả quy. Nhân cả hai vế với mẫu số chung và dùng Gauss's Lemma (c), ta có phân tích trong $R[x]$.

Tính duy nhất: nếu $f_0 = p_1 \cdots p_r = q_1 \cdots q_s$ trong $R[x]$ với $p_i, q_j$ primitive bất khả quy, thì so sánh trong $K[x]$ (UFD) cho $r = s$ và mỗi $p_i$ associates với $q_{\sigma(i)}$ trong $K[x]$, suy ra associates trong $R[x]$ (dùng Gauss's Lemma). $\blacksquare$

> [!corollary] Corollary 3.17
> $\mathbb{Z}[x]$, $k[x_1, \ldots, x_n]$ (với $k$ là field), $\mathbb{Z}[x_1, \ldots, x_n]$ đều là UFD.

> [!warning] Counterexample 3.18 — $\mathbb{Z}[x]$ là UFD nhưng không phải PID
> Ideal $I = (2, x) \subset \mathbb{Z}[x]$ **không** phải principal.
>
> Chứng minh: giả sử $I = (f)$. Vì $2 \in I$, $f \mid 2$ trong $\mathbb{Z}[x]$, nên $f \in \{1, -1, 2, -2\}$. Nếu $f = \pm 1$: $I = \mathbb{Z}[x]$, nhưng $1 \notin I$ (mọi phần tử của $I$ có hệ số tự do chẵn khi thay $x = 0$). Nếu $f = \pm 2$: $x \in I$ nhưng $x/2 \notin \mathbb{Z}[x]$, suy ra $2 \nmid x$ — mâu thuẫn với $x \in (2)$.
>
> Đây là minh họa cho khoảng cách PID/UFD trong hệ thống phân cấp.

---

## Ideals trong $k[x]$ và Mối liên hệ với Field Extensions

> [!theorem] Theorem 3.19 — Ideals của $k[x]$
> Nếu $k$ là field, mọi ideal của $k[x]$ đều là principal: $k[x]$ là PID. Cụ thể, mọi ideal $\neq \{0\}$ có dạng $(f)$ với $f$ monic duy nhất.

> [!theorem] Theorem 3.20 — Khi nào $k[x]/(f)$ là field?
> Với $k$ field và $f \in k[x]$ không phải $0$:
>
> $$
> k[x]/(f) \text{ là field} \iff f \text{ bất khả quy trong } k[x]
> $$

**Proof.**
Dùng Theorem 1.26 từ Bài 01: $k[x]/(f)$ là field $\iff (f)$ là maximal ideal $\iff$ không có ideal nào nằm giữa $(f)$ và $k[x]$ $\iff$ không có $g \in k[x]$ với $f \mid g$ và $g$ không unit và $g \nmid f$ $\iff$ $f$ bất khả quy. $\blacksquare$

> [!example] Example 3.21 — Xây dựng field extensions qua quotient
> - $\mathbb{R}[x]/(x^2+1) \cong \mathbb{C}$ — ta "thêm" nghiệm của $x^2+1$ vào $\mathbb{R}$.
> - $\mathbb{Q}[x]/(x^2-2) \cong \mathbb{Q}(\sqrt{2})$ — ta "thêm" $\sqrt{2}$ vào $\mathbb{Q}$.
> - $\mathbb{F}_2[x]/(x^2+x+1) \cong \mathbb{F}_4$ — field 4 phần tử từ field 2 phần tử.
>
> Đây là preview cho Field Extensions (Bài 06): mọi algebraic extension $K/k$ sinh bởi một phần tử $\alpha$ đều đẳng cấu với $k[x]/(m_\alpha)$, với $m_\alpha$ là minimal polynomial của $\alpha$.

---

## SageMath Cheatsheet

```python
R.<x> = ZZ[]

f = 6*x^2 + 4*x + 10
print(f.content())

g = x^4 + 4*x^3 + 6*x^2 + 4*x + 2
print(g.is_irreducible())

h = x^3 - 2
print(h.is_irreducible())

S.<x> = QQ[]
f = x^4 + 1
print(f.is_irreducible())

p = x^5 - 5
print(p.is_irreducible())

T.<x> = GF(2)[]
f = x^2 + x + 1
print(f.is_irreducible())
K.<a> = GF(2).extension(f)
print(K)
print(K.order())

R.<x> = QQ[]
f = x^3 - 2
g = x^2 + x + 1
print(f.gcd(g))
q, r = f.quo_rem(g)
print(q, r)
```

---

## Summary / Key Takeaways

- $R[x]$ là integral domain khi $R$ là integral domain; $\deg(fg) = \deg f + \deg g$.
- **Division algorithm** đúng trong $k[x]$ với $k$ là field — đây là nền tảng để $k[x]$ là Euclidean domain, PID.
- **Content** và **primitive**: mọi $f \in R[x]$ viết được $f = \operatorname{cont}(f) \cdot f_{\text{prim}}$.
- **Gauss's Lemma**: tích primitive là primitive; $f$ primitive bất khả quy trong $R[x]$ $\iff$ bất khả quy trong $K[x]$.
- **Eisenstein Criterion**: điều kiện đủ mạnh để kết luận bất khả quy qua một prime ideal.
- **$R$ UFD $\Rightarrow$ $R[x]$ UFD** — định lý nền tảng, suy ra $k[x_1,\ldots,x_n]$ là UFD.
- $k[x]/(f)$ là field $\iff$ $f$ bất khả quy — cầu nối sang Field Extensions (Bài 06).

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapters 8–9.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter IV §§1–3.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 6.
- https://doc.sagemath.org/html/en/reference/polynomial_rings/
