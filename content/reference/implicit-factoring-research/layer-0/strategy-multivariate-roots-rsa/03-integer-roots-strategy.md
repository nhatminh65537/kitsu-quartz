---
title: "03. Chiến lược tìm nghiệm Nguyên nhỏ"
type: math-component
tags: [coppersmith, integer-roots, lattice, shift-polynomials, coron, math-component, lesson-03]
aliases: [Integer Roots Strategy, Jochemsz-May Integer Strategy]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

> **Prerequisites**: [[01-howgrave-graham-lll|01. Howgrave-Graham & LLL]], [[02-modular-roots-strategy|02. Modular Roots Strategy]]  
> 🔴 **Prerequisite references**: Coppersmith [4, 5] — *Finding Small Roots*; LLL [13]  
> **Lesson type**: Math Component  
> **Covers**: §2.2 Basic Strategy (integer), §2.2 Extended Strategy (integer), Appendix B overview
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f$ | Đa thức **nguyên, bất khả quy** (irreducible over $\mathbb{Z}$) cần tìm nghiệm nguyên nhỏ |
> | $d_j$ | Bậc tối đa của $x_j$ trong $f$ |
> | $W$ | $\lVert f(x_1 X_1, \ldots, x_n X_n) \rVert_\infty$ — hệ số lớn nhất sau scale |
> | $R$ | Modulus nhân tạo: $R = W \prod_{j=1}^n X_j^{d_j(m-1)}$ (Basic); $R = W \prod_{j=1}^n X_j^{l_j}$ (Extended) |
> | $S$ | Tập monomial của $f^{m-1}$ |
> | $M$ | Tập monomial của $x_1^{i_1} \cdots x_n^{i_n} \cdot f$ với $x^i \in S$ |
> | $l_j$ | Bậc tối đa của $x_j$ xuất hiện trong $S$ |
> | $f'$ | $a_0^{-1} f \bmod R$ — chuẩn hóa constant term thành $1$ |
> | $g$ | Shift polynomial loại 1: dùng $f'$ |
> | $g'$ | Shift polynomial loại 2: dùng $R$ (cho $M \setminus S$) |

---

## Motivation

Trong §2.1 ta tìm **modular roots**: nghiệm của $f_N \equiv 0 \pmod{N}$ với $N$ là composite đã biết. Bây giờ bài toán khác hơn: ta muốn tìm **integer roots** — nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)}) \in \mathbb{Z}^n$ của đa thức $f(x_1, \ldots, x_n) = 0$ **trên $\mathbb{Z}$**, không có modulus ngoài. Nghiệm tồn tại và nhỏ theo nghĩa $|x_j^{(0)}| < X_j$.

**Tại sao lại khó hơn?** Không có $N$ để tạo ra "nhiều nghiệm tự động qua modular arithmetic." Ta phải tự tạo ra một modulus nhân tạo $R$ đủ lớn để kỹ thuật lattice vẫn áp dụng được.

> [!info] 🟡 Coron's Reformulation [7]
> Coron [7] reformulate bài toán integer roots của bivariate polynomial thành bài toán **tìm nghiệm nhỏ modulo $R$**, sau đó áp dụng Howgrave-Graham. Jochemsz-May extend ý tưởng này lên $n$ biến. Paper gốc ưu tiên dùng Coron's method thay vì Coppersmith's original vì: notation đơn giản hơn, implementation dễ hơn, và có cấu trúc song song với §2.1.
>
> *(theo [7]: Coron — Finding Small Roots of Bivariate Integer Equations Revisited, EUROCRYPT 2004)*

---

## Thiết lập bài toán

Cho $f(x_1, \ldots, x_n) \in \mathbb{Z}[x_1, \ldots, x_n]$ là đa thức **nguyên bất khả quy** (irreducible). Ta cần tìm nghiệm nguyên nhỏ $(x_1^{(0)}, \ldots, x_n^{(0)})$ với $|x_j^{(0)}| < X_j$.

**Các tham số cần tính trước:**
- $d_j$: bậc tối đa của $x_j$ trong $f$.
- $W = \lVert f(x_1 X_1, \ldots, x_n X_n) \rVert_\infty$: hệ số lớn nhất của $f$ sau khi scale.
- $R = W \prod_{j=1}^n X_j^{d_j(m-1)}$ (sẽ cập nhật với Extended Strategy).

**Xử lý constant term.** Để áp dụng chiến lược, $f$ cần có constant term $a_0 \neq 0$ với $\gcd(a_0, R) = 1$. Khi đó ta chuẩn hóa $f' = a_0^{-1} f \bmod R$, tức $f'$ có constant term bằng $1$.

**Trường hợp $a_0 = 0$**: Coron [7, Appendix A] chỉ ra cách xử lý cho bivariate. Với trường hợp tổng quát: tìm một điểm $(y_1, \ldots, y_n)$ với $f(y_1, \ldots, y_n) \neq 0$ (tồn tại trong thời gian polynomial vì số nghiệm trong bound là polynomial), sau đó đặt $f^*(x_1, \ldots, x_n) := f(x_1 + y_1, \ldots, x_n + y_n)$ — bây giờ $f^*(0, \ldots, 0) = f(y_1, \ldots, y_n) \neq 0$.

> [!warning] Lưu ý khi $a_0 = 0$
> Việc chuyển sang $f^*$ thay đổi tập monomial — có thể xuất hiện monomial mới trong $f^*$ không có trong $f$. Điều này ảnh hưởng đến phân tích và có thể cho bound Coppersmith khác. Với bivariate, Coron [7] chứng minh tập monomial không thay đổi trong trường hợp của ông, nhưng điều này không đúng tổng quát.

---

## Basic Strategy

Cấu trúc song song với §2.1, nhưng thay vì tập $M_k$ có $k$ level, ta dùng hai tập phẳng $S$ và $M$.

> [!note] Strategy 3.1 — Basic Strategy for Small Integer Roots (§2.2)
> **Input**: Đa thức bất khả quy $f$, bounds $X_1, \ldots, X_n$, tham số $\epsilon > 0$
>
> **Bước 1 — Chọn $m$**: Cố định $m \in \mathbb{Z}^+$ phụ thuộc vào $1/\epsilon$.
>
> **Bước 2 — Định nghĩa tập $S$ và $M$**:
>
> $$
> S := \text{tập tất cả monomial của } f^{m-1}
> $$
>
> $$
> M := \left\{ x_1^{i_1} \cdots x_n^{i_n} \cdot f \ \middle|\ x_1^{i_1} \cdots x_n^{i_n} \in S \right\} \text{ (lấy tất cả monomial)}
> $$
>
> Rõ ràng $S \subseteq M$ (vì $x^i \in S$ thì $x^i \cdot f$ sinh ra $x^i \cdot a_0 = a_0 x^i \in M$).
>
> **Bước 3 — Tính $R$**: Gọi $l_j = d_j(m-1)$ là bậc tối đa của $x_j$ trong $S$. Đặt:
>
> $$
> R = W \prod_{j=1}^n X_j^{l_j} = W \prod_{j=1}^n X_j^{d_j(m-1)}
> $$
>
> **Bước 4 — Xây dựng shift polynomials**: Hai loại $g$ và $g'$:
>
> $$
> g : x_1^{i_1} \cdots x_n^{i_n} \cdot f'(x_1, \ldots, x_n) \cdot \prod_{j=1}^n X_j^{l_j - i_j}, \quad \text{với } x_1^{i_1} \cdots x_n^{i_n} \in S
> $$
>
> $$
> g' : x_1^{i_1} \cdots x_n^{i_n} \cdot R, \quad \text{với } x_1^{i_1} \cdots x_n^{i_n} \in M \setminus S
> $$
>
> **Bước 5 — Xây dựng lattice $L$**: Lấy vector hệ số của $g(x_1 X_1, \ldots, x_n X_n)$ và $g'(x_1 X_1, \ldots, x_n X_n)$ làm basis của $L$, sắp theo **lexicographic ordering** (upper triangular).
>
> **Output**: $n-1$ đa thức $h_1, \ldots, h_{n-1}$ từ LLL-reduced basis, cùng với $f$, cho ra nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)})$ qua resultant (dưới Assumption 1).

### Tại sao mọi $g$ và $g'$ đều có nghiệm đúng?

Tất cả $g$ và $g'$ đều có nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)})$ **modulo $R$**:
- $g$: vì $f'(x^{(0)}) = a_0^{-1} f(x^{(0)}) = 0$ (do $f(x^{(0)}) = 0$ trên $\mathbb{Z}$, nên $\equiv 0 \pmod{R}$).
- $g'$: vì có factor $R$, nên $\equiv 0 \pmod{R}$ tự động.

### Cấu trúc ma trận và phần tử đường chéo

Với ordering lexicographic, ma trận là **upper triangular**. Phần tử đường chéo:
- Các row ứng với $g$ (monomial $x^i \in S$): diagonal entry là $\prod_{j=1}^n X_j^{d_j(m-1)}$ (từ constant term của $f'$, sau scale).
- Các row ứng với $g'$ (monomial $x^i \in M \setminus S$): diagonal entry là $W \prod_{j=1}^n X_j^{d_j(m-1)+i_j}$.

### Điều kiện Bound

> [!abstract] Điều kiện Bound — Integer Case (§2.2, equation (2))
> Từ điều kiện $\det(L) < R^{\omega+2-n}$, ta rút ra:
>
> $$
> \prod_{j=1}^n X_j^{s_j} < W^{s_W} \tag{2}
> $$
>
> trong đó:
>
> $$
> s_j = \sum_{x_1^{i_1} \cdots x_n^{i_n} \in M \setminus S} i_j \qquad \text{và} \qquad s_W = |S|
> $$
>
> Nếu (2) thỏa, ta thu được $n-1$ đa thức $h_i$ (từ LLL) thỏa $h_i(x^{(0)}) = 0$ trên $\mathbb{Z}$.

**Khác biệt so với modular case**: Ta cần $n-1$ đa thức (không phải $n$) vì $f$ itself cũng là một đa thức triệt tiêu tại nghiệm — ta dùng $f$ cùng với $h_1, \ldots, h_{n-1}$ để tính resultant.

---

## Vì sao $h_i$ Algebraically Independent với $f$?

Đây là điểm kỹ thuật quan trọng nhất phân biệt integer case với modular case.

> [!info] 🟡 Hinek-Stinson Corollary 5 [10]
> Theo [10, Corollary 5], một multiple $h(x_1, \ldots, x_n)$ của $f(x_1, \ldots, x_n)$ mà chia hết bởi $\prod_{j=1}^n X_j^{d_j(m-1)}$ có norm tối thiểu:
>
> $$
> \left\lVert h \right\rVert \geq 2^{-(\rho+1)^n + 1} \cdot \prod_{j=1}^n X_j^{d_j(m-1)} \cdot W = 2^{-(\rho+1)^n + 1} \cdot R
> $$
>
> trong đó $\rho$ là bậc tối đa của $f$ và $h$ theo từng biến riêng biệt.
>
> *(theo [10]: Hinek, Stinson — An Inequality About Factors of Multivariate Polynomials, 2006)*

**Ý nghĩa**: Nếu $h_i$ thỏa Howgrave-Graham bound $\lVert h_i(x_1 X_1, \ldots) \rVert < R/\sqrt{\omega}$, thì $h_i$ **không thể là bội của $f$** (vì norm sẽ phải $\geq 2^{-(\rho+1)^n+1} R$ — lớn hơn bound). Do $f$ bất khả quy, $h_i$ và $f$ phải **algebraically independent**.

Tuy nhiên, ta không thể đảm bảo các $h_i$ **với nhau** độc lập tuyến tính đại số — nên resultant computation vẫn cần Assumption 1 cho $n \geq 3$.

> [!warning] Heuristic cho $n \geq 3$
> Với $n = 2$ (bivariate): $f$ và $h_1$ đã đủ để tính resultant — algebraic independence được đảm bảo bởi Hinek-Stinson. Phương pháp **provably correct** cho bivariate (theo [3]).
>
> Với $n \geq 3$: cần Assumption 1 — các $h_i$ pairwise algebraically independent. Phương pháp trở thành **heuristic**.

---

## Extended Strategy

Tương tự §2.1, thêm $t$ extra shifts của biến $x_1$:

> [!note] Strategy 3.2 — Extended Strategy (Extra $x_1$-shifts, §2.2)
> Thay vì $S = \{\text{monomials of } f^{m-1}\}$, ta dùng:
>
> $$
> S := \bigcup_{0 \leq j \leq t} \left\{ x_1^{i_1+j} x_2^{i_2} \cdots x_n^{i_n} \ \middle|\ x_1^{i_1} \cdots x_n^{i_n} \text{ là monomial của } f^{m-1} \right\}
> $$
>
> $$
> M := \left\{ \text{monomials của } x_1^{i_1} \cdots x_n^{i_n} \cdot f \ \middle|\ x_1^{i_1} \cdots x_n^{i_n} \in S \right\}
> $$
>
> Cập nhật $R$: vì $l_j$ bây giờ là bậc tối đa của $x_j$ trong $S$ (không còn là $d_j(m-1)$ đơn thuần), ta đặt $l_j := \max\{i_j : x^i \in S\}$ và:
>
> $$
> R = W \prod_{j=1}^n X_j^{l_j}
> $$
>
> Phần còn lại của chiến lược giữ nguyên. Tham số $t = \tau m$ được tối ưu hóa theo kích thước của $X_j$ và $W$.

---

## So sánh Modular vs Integer Strategy

| Tiêu chí | Modular (§2.1) | Integer (§2.2) |
|----------|----------------|----------------|
| Đa thức đầu vào | $f_N \pmod{N}$ | $f$ bất khả quy trên $\mathbb{Z}$ |
| Modulus | $N$ (đã biết) | $R$ (nhân tạo, xây từ $W$ và $X_j$) |
| Tập monomial | $M_k$ (phân cấp $k=0,\ldots,m$) | $S$ và $M$ (hai tập phẳng) |
| Số shift types | Một loại $g$ | Hai loại: $g$ (dùng $f'$) và $g'$ (dùng $R$) |
| Ma trận | Lower triangular | Upper triangular |
| Số đa thức output | $n$ đa thức $h_i$ | $n-1$ đa thức $h_i$ (cộng $f$) |
| Provably correct | Với $n=1$ (Coppersmith) | Với $n=2$ (Blömer-May [3]) |
| Heuristic | $n \geq 2$ | $n \geq 3$ |

---

## Unification với Các Kết quả Đã Biết

Appendix B của paper chứng minh tất cả kết quả known về integer roots đều là special cases:

> [!info] 🟡 Blömer-May [3] là Special Case (Appendix B)
> Với bivariate $f(x_1, x_2)$ có monomials $x_1^{i_1} x_2^{i_2}$ với $i_1 \leq D$, $i_2 \leq \lambda i_2$, Extended Strategy với:
>
> $$
> x_1^{i_1} x_2^{i_2} \in S \iff i_2 = 0, \ldots, D(m-1);\ i_1 = 0, \ldots, \lambda i_2 + t
> $$
>
> tái tạo bound "Upper Triangle" của Blömer-May [3]. Tương tự với "Extended Rectangle" case.
>
> *(theo [3]: Blömer, May — A Tool Kit for Finding Small Roots of Bivariate Polynomials over the Integers, EUROCRYPT 2005)*

Chi tiết đầy đủ trong [[07-known-results-unification|07. Known Results & Unification]].

---

## Summary

- **Integer strategy** dùng modulus nhân tạo $R = W \prod X_j^{l_j}$ thay vì $N$ đã biết.
- **Hai loại shifts**: $g$ (nhân $f'$ với scaling) cho $x^i \in S$; $g'$ (nhân $R$) cho $x^i \in M \setminus S$.
- **Điều kiện bound**: $\prod_j X_j^{s_j} < W^{|S|}$ — hoàn toàn xác định bởi tập $S$ và $M$.
- **Hinek-Stinson** đảm bảo $h_i$ không phải bội của $f$ → $h_i$ và $f$ algebraically independent.
- **Provably correct** với $n=2$; **heuristic** với $n \geq 3$ (cần Assumption 1).
- **Extended Strategy**: extra $x_1$-shifts → $S$ mở rộng → $R$ lớn hơn → vùng nghiệm rộng hơn.

**Tiếp theo**: [[04-trivariate-bound|04. Trivariate Bound]] áp dụng Extended Strategy (integer) cho đa thức ba biến cụ thể $f(x,y,z)$ và tính ra bound tường minh.

---

## References

- [3] Blömer, May — *A Tool Kit for Finding Small Roots of Bivariate Polynomials over the Integers*, EUROCRYPT 2005 (🟡)
- [4] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996 (🔴)
- [7] Coron — *Finding Small Roots of Bivariate Integer Equations Revisited*, EUROCRYPT 2004 (🟡)
- [10] Hinek, Stinson — *An Inequality About Factors of Multivariate Polynomials*, 2006 (🟡)
- [13] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982 (🔴)
