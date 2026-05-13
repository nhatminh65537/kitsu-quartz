---
title: "02. Chiến lược tìm nghiệm Modular nhỏ"
type: math-component
tags: [coppersmith, modular-roots, lattice, shift-polynomials, math-component, lesson-02]
aliases: [Modular Roots Strategy, Jochemsz-May Modular Strategy]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

> **Prerequisites**: [[01-howgrave-graham-lll|01. Howgrave-Graham & LLL]] (Lemma 1, Fact 1, determinant condition)  
> 🔴 **Prerequisite references**: Coppersmith [4, 5] — *Finding Small Roots* (univariate nền tảng); LLL [13]  
> **Lesson type**: Math Component  
> **Covers**: §2.1 Basic Strategy (modular), §2.1 Extended Strategy (modular), working example $f_N(x,y)=1+xy^2+x^2y$, Appendix A overview
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f_N$ | Đa thức cần tìm nghiệm, modulo $N$ |
> | $l$ | Leading monomial của $f_N$ |
> | $a_l$ | Hệ số của leading monomial $l$ |
> | $f'_N$ | $a_l^{-1} f_N \bmod N$ (chuẩn hóa leading coeff = 1) |
> | $M_k$ | Tập monomial thứ $k$ trong chiến lược (được định nghĩa dưới) |
> | $g_{i_1 \cdots i_n}$ | Shift polynomial tương ứng với monomial $x_1^{i_1} \cdots x_n^{i_n}$ |
> | $m$ | Tham số cố định phụ thuộc $1/\epsilon$ |
> | $t$ | Số extra shifts trong Extended Strategy |
> | $\tau$ | $t = \tau m$ (viết liên tục để tối ưu asymptotic) |
> | $s_j$ | Số mũ tổng của $x_j$ qua $M_0$ |
> | $s_N$ | Tổng $\sum_{k=1}^m \lvert M_k \rvert$ |

---

## Motivation

Từ Lesson 01, ta biết: để dùng Howgrave-Graham + LLL tìm nghiệm nhỏ của $f_N \equiv 0 \pmod{N}$, ta cần xây dựng một **lattice $L$ có $\det(L) \leq N^{\omega+1-i}$** từ các **shift polynomials** — tức các đa thức đều có cùng nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)})$ modulo một lũy thừa cao của $N$.

Câu hỏi: **làm thế nào chọn shift polynomials** để vừa đảm bảo nghiệm đúng, vừa tối thiểu hóa $\det(L)$?

Đây chính là nội dung của §2.1: một chiến lược hệ thống để xây dựng shift polynomials tối ưu cho **bất kỳ đa thức nhiều biến nào** có nghiệm modular nhỏ.

---

## Thiết lập bài toán

Cho $f_N(x_1, \ldots, x_n) \in \mathbb{Z}[x_1, \ldots, x_n]$ — đa thức có nghiệm nhỏ $(x_1^{(0)}, \ldots, x_n^{(0)})$ modulo $N$, tức:

$$
f_N\!\left(x_1^{(0)}, \ldots, x_n^{(0)}\right) \equiv 0 \pmod{N}
$$

Ta biết bound: $\lvert x_j^{(0)} \rvert < X_j$ với $j = 1, \ldots, n$.

**Leading monomial.** Gọi $l$ là **leading monomial** của $f_N$, với hệ số $a_l$. Tức là: không có monomial nào khác trong $f_N$ chia hết cho $l$. Khi đó $\gcd(N, a_l) = 1$ (hoặc ta đã tìm ra factor của $N$). Do đó ta có thể chuẩn hóa:

$$
f'_N := a_l^{-1} f_N \bmod N
$$

$f'_N$ có hệ số tại $l$ bằng $1$, và $f'_N$ có cùng nghiệm với $f_N$ modulo $N$.

---

## Basic Strategy

> [!note] Strategy 2.1 — Basic Strategy for Small Modular Roots (§2.1)
> **Input**: Đa thức $f_N$, leading monomial $l$, bounds $X_1, \ldots, X_n$, tham số $\epsilon > 0$
>
> **Bước 1 — Chọn $m$**: Cố định $m \in \mathbb{Z}^+$ phụ thuộc vào $1/\epsilon$.
>
> **Bước 2 — Định nghĩa tập $M_k$**: Với $k = 0, 1, \ldots, m+1$:
>
> $$
> M_k := \left\{ x_1^{i_1} \cdots x_n^{i_n} \ \middle|\ \begin{array}{l} x_1^{i_1} \cdots x_n^{i_n} \text{ là monomial của } f_N^m \\ \text{và } \dfrac{x_1^{i_1} \cdots x_n^{i_n}}{l^k} \text{ là monomial của } f_N^{m-k} \end{array} \right\}
> $$
>
> Theo định nghĩa: $M_0$ chứa toàn bộ monomial của $f_N^m$, và $M_{m+1} = \emptyset$.
>
> **Bước 3 — Xây dựng shift polynomials**: Với mỗi $k = 0, \ldots, m$ và $x_1^{i_1} \cdots x_n^{i_n} \in M_k \setminus M_{k+1}$:
>
> $$
> g_{i_1 \cdots i_n}(x_1, \ldots, x_n) := \frac{x_1^{i_1} \cdots x_n^{i_n}}{l^k} \cdot (f'_N)^k \cdot N^{m-k}
> $$
>
> **Bước 4 — Xây dựng lattice $L$**: Lấy các vector hệ số của $g_{i_1 \cdots i_n}(x_1 X_1, \ldots, x_n X_n)$ làm basis của $L$.
>
> **Output**: $n$ đa thức $h_1, \ldots, h_n$ từ LLL-reduced basis thỏa $h_i(x_1^{(0)}, \ldots, x_n^{(0)}) = 0$ trên $\mathbb{Z}$ (dưới Assumption 1).

### Tại sao mọi $g$ đều có nghiệm đúng?

Mỗi shift polynomial $g_{i_1 \cdots i_n}$ có nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)})$ **modulo $N^m$**:
- Factor $N^{m-k}$ đóng góp $N^{m-k}$ vào module.
- Factor $(f'_N)^k$ đóng góp: $(f'_N(x^{(0)}))^k \equiv 0^k = 0 \pmod{N^k}$.
- Tổng cộng: $g_{i_1 \cdots i_n}(x^{(0)}) \equiv 0 \pmod{N^{m-k} \cdot N^k} = 0 \pmod{N^m}$.

### Cấu trúc ma trận lattice

Ma trận $L$ được sắp xếp **lower triangular** theo thứ tự:
- Cột ứng với $x^{i_1} \cdots x^{i_n} \in M_k \setminus M_{k+1}$ có thứ tự nhỏ hơn nếu $k < k'$.
- Khi $k = k'$, dùng lexicographic ordering.
- Phần tử **đường chéo** của row tương ứng với monomial $l^k$ trong $(f'_N)^k$ là:

$$
X_1^{i_1} \cdots X_n^{i_n} \cdot N^{m-k} \quad \text{với mỗi tổ hợp } (k, i_1, \ldots, i_n)
$$

### Tính toán $\det(L)$ và điều kiện bound

$$
\det(L) = \prod_{\text{mọi row}} \text{(phần tử đường chéo)} = \prod_{j=1}^n X_j^{s_j} \cdot N^{s_N}
$$

trong đó:

$$
s_j = \sum_{x_1^{i_1} \cdots x_n^{i_n} \in M_0} i_j \qquad \text{và} \qquad s_N = \sum_{k=0}^m k\bigl(\lvert M_k \rvert - \lvert M_{k+1} \rvert\bigr) = \sum_{k=1}^m \lvert M_k \rvert
$$

Áp dụng điều kiện $\det(L) \leq N^{\omega+1-i}$ từ Lesson 01, với $i = n$ và $\omega = \lvert M_0 \rvert$, ta rút ra:

> [!abstract] Điều kiện Bound — Modular Case
> Nếu
>
> $$
> \prod_{j=1}^n X_j^{s_j} < N^{s_N} \tag{1}
> $$
>
> thì $n$ đa thức $h_1, \ldots, h_n$ từ LLL-reduced basis thỏa Howgrave-Graham bound, và dưới Assumption 1, resultant computations sẽ cho ra nghiệm $(x_1^{(0)}, \ldots, x_n^{(0)})$.

**Trực giác đằng sau $M_k$.** Mục tiêu là giữ $\det(L)$ nhỏ. Phần tử đường chéo tương ứng với monomial $x_1^{i_1} \cdots x_n^{i_n} \in f_N^m$ là $X_1^{i_1} \cdots X_n^{i_n} \cdot N^{m-k}$. Để tối thiểu hóa, ta muốn $k$ càng lớn càng tốt — tức dùng lũy thừa cao nhất có thể của $f_N$. Điều kiện "$x^{i_1} \cdots x^{i_n}/l^k$ là monomial của $f_N^{m-k}$" đảm bảo không có monomial mới xuất hiện ngoài $f_N^m$.

---

## Ví dụ minh họa (từ §2.1 paper)

Xét $f_N(x, y) = 1 + xy^2 + x^2y$ với $m = 2$.

**Chọn leading monomial**: $l = x^2 y$ (không có monomial nào khác chia hết cho $x^2y$).

**Tính $M_k$**:

$$
\begin{aligned}
f_N^2 &= (1 + xy^2 + x^2y)^2 \implies \text{monomials: } \{1,\, xy^2,\, x^2y,\, x^2y^4,\, x^3y^3,\, x^4y^2\} \\
M_0 &= \{1,\, xy^2,\, x^2y,\, x^2y^4,\, x^3y^3,\, x^4y^2\} \quad \text{(mọi monomial của } f_N^2) \\
M_1 &= \{x^2y,\, x^3y^3,\, x^4y^2\} \quad \text{(bị chia hết bởi } l = x^2y, \text{ thương là monomial của } f_N^1) \\
M_2 &= \{x^4y^2\} \quad \text{(bị chia hết bởi } l^2 = x^4y^2, \text{ thương là monomial của } f_N^0 = \{1\}) \\
M_3 &= \emptyset
\end{aligned}
$$

**Shift polynomials** (paper §2.1):

| Monomial | Thuộc $M_k \setminus M_{k+1}$ | Shift polynomial |
|----------|-------------------------------|-----------------|
| $1$ | $M_0 \setminus M_1$ | $N^2$ |
| $xy^2$ | $M_0 \setminus M_1$ | $xy^2 \cdot N^2$ |
| $x^2y^4$ | $M_0 \setminus M_1$ | $x^2y^4 \cdot N^2$ |
| $x^2y$ | $M_1 \setminus M_2$ | $f'_N \cdot N$ |
| $x^3y^3$ | $M_1 \setminus M_2$ | $xy^2 \cdot f'_N \cdot N$ |
| $x^4y^2$ | $M_2 \setminus M_3$ | $(f'_N)^2$ |

> [!tip] 💡 Agent note
> Lưu ý: monomial $x^2y^4$ thuộc $M_0 \setminus M_1$ dù nó chia hết cho $l = x^2y$. Lý do: dù $x^2y^4 / (x^2y) = y^3$ là monomial của $f_N^1$, nhưng nếu ta dùng shift $y^3 f_N \cdot N$ thì sẽ sinh ra monomial mới $y^3$ và $xy^5$ không thuộc $f_N^2$. Chiến lược tránh điều này bằng cách giữ $x^2y^4$ ở $M_0$ và gán shift đơn giản hơn.

---

## Extended Strategy

Với nhiều đa thức, việc thêm **extra shifts** cho một biến cụ thể giúp giảm $\det(L)$ và mở rộng vùng nghiệm tìm được.

> [!note] Strategy 2.2 — Extended Strategy (Extra $x_1$-shifts)
> Nếu thêm $t$ extra shifts của biến $x_1$, ta mở rộng định nghĩa $M_k$:
>
> $$
> M_k := \bigcup_{0 \leq j \leq t} \left\{ x_1^{i_1+j} x_2^{i_2} \cdots x_n^{i_n} \ \middle|\ \begin{array}{l} x_1^{i_1} \cdots x_n^{i_n} \in f_N^m \\ \dfrac{x_1^{i_1} \cdots x_n^{i_n}}{l^k} \text{ là monomial của } f_N^{m-k} \end{array} \right\}
> $$
>
> Phần còn lại của chiến lược không thay đổi. Tham số $t = \tau m$ được tối ưu hóa sau khi biết kích thước của $X_j$ và $N$.
>
> **Khi nào dùng extra shifts?** Khi biến $x_1$ xuất hiện với bậc thấp trong $f_N$ nhưng bound $X_1$ lớn — extra shifts thêm lũy thừa $x_1$ vào tập monomial, cho phép điều kiện (1) thỏa với $X_1$ lớn hơn.

Tương tự, có thể thêm extra shifts cho nhiều biến hoặc dùng **combined shifts** — nhưng phân tích trở nên phức tạp hơn và cần case-by-case.

---

## Từ Điều kiện Bound đến Nghiệm

Sau khi LLL cho $n$ đa thức $h_1, \ldots, h_n$ thỏa $h_i(x^{(0)}) = 0$ trên $\mathbb{Z}$:

1. Dùng **resultant** để loại dần các biến.
2. Nếu $h_1, \ldots, h_n$ algebraically independent (Assumption 1), resultant cho ra nghiệm.
3. Substitute ngược lại để recover từng $x_j^{(0)}$.

> [!warning] Assumption 1 (nhắc lại)
> Tất cả các phép tính resultant đều cho ra **đa thức khác không**. Assumption này heuristic — cần validate bằng thực nghiệm.

---

## Unification với Các Kết quả Đã Biết

Paper chứng minh rằng tất cả các kết quả known về modular roots đều là special cases của Basic hoặc Extended Strategy (xem Appendix A của paper). Ví dụ:

> [!info] 🟡 Boneh-Durfee [1] là Special Case (Appendix A)
> Với $f_N(x_1, x_2) = a_0 + a_1 x_1 + a_2 x_1 x_2$, Extended Strategy với:
>
> $$
> x_1^{i_1} x_2^{i_2} \in M_k \iff i_1 = k, \ldots, m;\ i_2 = k, \ldots, i_1 + t
> $$
>
> cho ra bound $X_1^{2+3\tau} X_2^{1+3\tau+3\tau^2} < N^{1+3\tau}$, đúng như kết quả của Boneh-Durfee [1].
>
> *(theo [1]: Boneh, Durfee — Cryptanalysis of RSA with d < N^{0.292}, IEEE Trans. Inf. Theory 2000)*

Chi tiết đầy đủ về unification này sẽ được cover trong [[07-known-results-unification|07. Known Results & Unification]].

---

## Summary

- **Mục tiêu**: xây shift polynomials $g_i$ có cùng nghiệm modulo $N^m$, tạo lattice $L$ với $\det(L)$ nhỏ.
- **Tập $M_k$**: monomial của $f_N^m$ mà khi chia $l^k$ vẫn là monomial của $f_N^{m-k}$ — đảm bảo không có monomial mới sinh ra ngoài $f_N^m$.
- **Shift polynomial**: $g = (x^{i}/l^k) \cdot (f'_N)^k \cdot N^{m-k}$ — hệ số $N^{m-k}$ đảm bảo mod $N^m$.
- **Điều kiện bound**: $\prod_j X_j^{s_j} < N^{s_N}$ — điều kiện tổng quát áp dụng cho bất kỳ $f_N$ nào.
- **Extended Strategy**: thêm $t = \tau m$ extra shifts của $x_1$ để mở rộng vùng nghiệm.
- **Kết quả**: $n$ đa thức $h_i$ triệt tiêu tại $(x^{(0)})$ trên $\mathbb{Z}$; resultant cho nghiệm (heuristic).

**Tiếp theo**: [[03-integer-roots-strategy|03. Integer Roots Strategy]] trình bày chiến lược tương tự cho **integer roots** — cấu trúc mirror nhưng với lattice được xây khác.

---

## References

- [1] Boneh, Durfee — *Cryptanalysis of RSA with Private Key d Less Than N^{0.292}*, IEEE Trans. Inf. Theory 2000 (🟡)
- [2] Blömer, May — *New Partial Key Exposure Attacks on RSA*, CRYPTO 2003 (🟡)
- [3] Blömer, May — *A Tool Kit for Finding Small Roots of Bivariate Polynomials over the Integers*, EUROCRYPT 2005 (🟡)
- [4] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996 (🔴)
- [6] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 (🟡)
- [13] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982 (🔴)
