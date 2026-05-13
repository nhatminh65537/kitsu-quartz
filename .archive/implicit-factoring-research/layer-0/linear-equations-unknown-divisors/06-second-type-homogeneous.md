---
title: "06. Second Type: Homogeneous Equations"
type: scheme
tags: [lattice-cryptanalysis, linear-modular-equations, second-type, homogeneous, scheme, lesson-06]
aliases: [Second Type, Theorem 7, Homogeneous Linear Equations]
source: "Solving Linear Equations Modulo Unknown Divisors: Revisited — Lu, Zhang, Peng, Lin, ~2015"
created: 2026-03-26
---

> **Prerequisites**: [[03-first-type-core|03. First Type: Core Algorithm]], [[02-lattice-preliminaries|02. Lattice Preliminaries]]  
> **Lesson type**: Scheme  
> **Covers**: §4, §4.1 — Theorem 7 (homogeneous bivariate), comparisons with Herrmann-May & Castagnos et al., Proposition 2 ($n$-variable homogeneous)
>
> **Notation** (thêm vào notation đã có):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f_2(x_1, x_2) = a_1 x_1 + a_2 x_2$ | Đa thức tuyến tính thuần nhất (homogeneous) — không có hằng số |
> | $(y_1, y_2)$ | Nghiệm nhỏ của $f_2$; giả thiết $\gcd(y_1, y_2) = 1$ |
> | $X_1, X_2$ | Bounds: $\|y_1\| \le X_1 = N^{\gamma_1}$, $\|y_2\| \le X_2 = N^{\gamma_2}$ |
> | $s_1 = s_2$ | Tổng exponent của $X_1$ và $X_2$ trong $\det(L)$ (bằng nhau do đối xứng) |
> | $z$ | Biến phụ $z = x_1/x_2$ trong bước trích nghiệm |

---

## Bối Cảnh và Motivation

Lesson [[03-first-type-core|03]] xét phương trình **không thuần nhất** (inhomogeneous):

$$
f_1(x_1, \ldots, x_n) = a_0 + a_1 x_1 + \cdots + a_n x_n \equiv 0 \pmod{p^v}
$$

Bài học này xét trường hợp đặc biệt $a_0 = 0$ — tức là phương trình **thuần nhất** (homogeneous):

$$
f_2(x_1, x_2) = a_1 x_1 + a_2 x_2 \equiv 0 \pmod{p^v}
$$

Thoạt nhìn đây chỉ là trường hợp con của Proposition 1, nhưng cấu trúc homogeneous cho phép **cải thiện bound** đáng kể thông qua một lattice construction khác.

**Tại sao homogeneous quan trọng?** Trong nhiều ứng dụng crypto (ví dụ tấn công của Nitaj [Nit12] trên RSA với weak encryption exponents), phương trình tự nhiên có dạng $ex + y \equiv 0 \pmod{p}$ — thuần nhất, không có hằng số. Khai thác tính thuần nhất cho phép bound tốt hơn.

---

## Kết Quả Chính (Theorem 7)

> [!abstract] Theorem 7 — Second Type, Homogeneous Bivariate (Lu et al. §4.1)
> Với mọi $\epsilon > 0$, cho $N$ đủ lớn có ước số $p^u$ với $p \ge N^\beta$. Cho $f_2(x_1, x_2) = a_1 x_1 + a_2 x_2 \in \mathbb{Z}[x_1, x_2]$ với các hệ số nguyên tố cùng nhau với $N$. Thì có thể tìm tất cả nghiệm $(y_1, y_2)$ của $f_2 \equiv 0 \pmod{p^v}$ với $\gcd(y_1, y_2) = 1$, $|y_1| \le N^{\gamma_1}$, $|y_2| \le N^{\gamma_2}$, nếu:
>
> $$
> \gamma_1 + \gamma_2 < uv\beta^2 - \epsilon
> $$
>
> Độ phức tạp: $O(\epsilon^{-7} v^2 \log^2 N)$.

**Nhận xét về bound**: Cùng dạng với Theorem 2 nhưng cho **tổng** $\gamma_1 + \gamma_2$ thay vì $\gamma$ đơn. Đây là cải thiện so với Herrmann-May [HM08] cho trường hợp $a_0 = 0$: Herrmann-May cho bound $3\beta - 2 + 2(1-\beta)^{3/2}$ (bivariate với $a_0 \ne 0$); Theorem 7 cho $uv\beta^2$ (bivariate với $a_0 = 0$, $u = v = 1$).

---

## Xây Dựng Thuật Toán

### Họ Đa Thức Shift — Ý Tưởng Then Chốt

So sánh hai trường hợp:

| | Theorem 2 (First Type, univariate) | Theorem 7 (Second Type, bivariate) |
|---|---|---|
| Đa thức | $f(x) = x + a$ | $f(x_1, x_2) = x_1 + a_2 x_2$ (sau chuẩn hóa) |
| Shift | $g_k = f^k N^{\cdots}$ | $g_k = x_2^{m-k} f^k N^{\cdots}$ |
| Vai trò của $x_2^{m-k}$ | — | Thay thế vai trò của "constant term" |

Lý do thêm $x_2^{m-k}$: Phương trình thuần nhất $f_2 = a_1 x_1 + a_2 x_2$ không có constant term, nên họ $\{f^k\}$ không tạo thành lattice có đủ degree $0$ để điền ma trận tam giác. Nhân thêm $x_2^{m-k}$ bù vào phần còn thiếu này.

> [!note] Scheme 6.1 — Second Type Algorithm (Theorem 7)
> **Type**: Small Root Finding for Homogeneous Linear Equation Modulo $p^v$  
> **Setting**: $p^u \mid N$, $p \ge N^\beta$; đa thức thuần nhất $f_2(x_1, x_2) = a_1 x_1 + a_2 x_2$
>
> **$\mathsf{SecondTypeAlg}(N, f_2, \beta, u, v, \epsilon)$**
> - Input: $N$, $f_2$, tham số $\beta, u, v, \epsilon$
> - **Bước 1**: Chuẩn hóa: đặt $f(x_1, x_2) = a_1^{-1} f_2 \bmod N$ (monic trong $x_1$)
> - **Bước 2**: Chọn $m = \lceil \beta(2u + v - uv\beta)/\epsilon \rceil$, $t = \tau m$; bounds $X_1 X_2 := N^{uv\beta^2 - \epsilon}$
> - **Bước 3 — Họ đa thức shift**:
>   $$g_k(x_1, x_2) := x_2^{m-k} \cdot f(x_1, x_2)^k \cdot N^{\max\!\left\{\left\lceil v(t-k)/u\right\rceil,\, 0\right\}}$$
>   với $k = 0, 1, \ldots, m$; mọi $g_k(y_1, y_2) \equiv 0 \pmod{p^{vt}}$
> - **Bước 4**: Xây lattice $L$ dim $d = m+1$ từ vector hệ số của $g_k(x_1 X_1, x_2 X_2)$; sắp theo thứ tự tăng $k$
> - **Bước 5**: Chạy LLL, thu vector ngắn nhất ứng với đa thức $f'(x_1, x_2)$
> - **Bước 6 — Trích nghiệm**: Đặt $z = x_1/x_2$; tìm nghiệm hữu tỉ của $f'(z, 1)$ = $x_2^{-m} f'(x_1, x_2)\big|_{x_2=1}$; nghiệm $y_1/y_2$ là nghiệm hữu tỉ của đa thức này
> - Output: Tất cả nghiệm $(y_1, y_2)$ với $|y_1| \le X_1$, $|y_2| \le X_2$, $\gcd(y_1, y_2) = 1$

### Tính $\det(L)$

Vì ma trận tam giác với $d = m + 1$:

$$
\det(L) = X_1^{s_1} X_2^{s_2} N^{s_N}
$$

với:

$$
s_1 = s_2 = \sum_{k=0}^{m} k = \frac{m(m+1)}{2}
$$

(đối xứng: $x_1$ xuất hiện từ $f^k$, $x_2$ xuất hiện từ cả $f^k$ và $x_2^{m-k}$, và tổng bằng nhau)

$$
s_N = \sum_{k=0}^{t-1} \left\lceil \frac{v(t-k)}{u} \right\rceil = \frac{v\tau m(\tau m + 1)}{2u} + \sum c_k
$$

Hoàn toàn giống Theorem 2! Suy ra:

$$
\gamma_1 + \gamma_2 \le uv\beta^2 - \frac{\beta(2u + v - uv\beta)}{m}
$$

và đặt $m \ge m^*$ cho bound $\gamma_1 + \gamma_2 < uv\beta^2 - \epsilon$. $\blacksquare$

---

## So Sánh Với Các Phương Pháp Trước

### 1. Herrmann-May [HM08] — Trường Hợp $a_0 \ne 0$

> [!info] 🟡 Herrmann-May [HM08] — Inhomogeneous vs. Homogeneous
> Herrmann-May cho bound $3\beta - 2 + 2(1-\beta)^{3/2}$ với bivariate **không thuần nhất** $f = a_0 + a_1 x_1 + a_2 x_2$ ($a_0 \ne 0$, $u = v = 1$).
>
> Với $a_0 = 0$ (homogeneous), paper này (Theorem 7, $u = v = 1$) cho bound $\beta^2$ — tốt hơn đáng kể. Ví dụ: $\beta = 0.5$ → Herrmann-May: $N^{0.207}$; Theorem 7: $N^{0.25}$ (tốt hơn $\approx 21\%$).
>
> *(theo [HM08]: Herrmann, May — Solving Linear Equations Modulo Divisors, Asiacrypt 2008)*

**Tại sao homogeneous tốt hơn?** Với $a_0 = 0$, việc nhân thêm $x_2^{m-k}$ thay thế vai trò của constant term trong lattice, cho phép dimension $d = m+1$ thay vì $d$ lớn hơn trong Proposition 1.

### 2. May [May03] — Univariate Rational Roots

Thực ra bài toán tìm nghiệm nhỏ của $f_2(x_1, x_2) = a_1 x_1 + a_2 x_2 \equiv 0 \pmod{p}$ tương đương tìm nghiệm hữu tỉ nhỏ $z = y_1/y_2$ của phương trình $f(z) = a_1 z + a_2 \equiv 0 \pmod{p}$. Kết quả $u = v = 1$, $\gamma_1 + \gamma_2 < \beta^2$ khớp với bound univariate của May [May03] cho $F(z) = z + c$ với $|z| \le N^{\beta^2}$.

### 3. Castagnos et al. [CJLN09] — Homogeneous Polynomial Bậc Cao

> [!info] Castagnos-Joux-Laguillaumie-Nguyen [CJLN09] — Giới Hạn
> Castagnos et al. xét đa thức thuần nhất dạng $(a_1 x_1 + a_2 x_2)^{u/v} \bmod p$, chỉ áp dụng được khi $u/v \in \mathbb{Z}$. Với bivariate tuyến tính (bậc 1), thuật toán của họ dùng lattice dimension $m \cdot (u/v)$ — gấp $u/v$ lần so với Theorem 7 (dimension $m+1$).
>
> Thêm nữa, thuật toán của [CJLN09] **không hoạt động tốt** khi hai nghiệm $y_1, y_2$ **unbalanced** ($X_1 \gg X_2$ hoặc ngược lại), vì họ xây lattice từ $g(x, y)$ thay vì $g(xX_1, yX_2)$. Theorem 7 dùng $X_1, X_2$ riêng biệt → vẫn hiệu quả với unbalanced roots.

> [!warning] Khi nào unbalanced roots xuất hiện?
> Trong tấn công CRT-RSA của Nitaj (Lesson [[07-weak-encryption-exponents|07]]), $x_0 = d_p$ nhỏ còn $y_0 = k_p - 1$ thường lớn hơn đáng kể. Đây là lý do Theorem 7 phù hợp hơn [CJLN09] cho ứng dụng này.

---

## Extension Lên $n$ Biến (Proposition 2)

> [!abstract] Proposition 2 — $n$-Variable Homogeneous Extension (Lu et al. §4.1, dưới Assumption 1)
> Với mọi $\epsilon > 0$, cho $N$ đủ lớn có ước số $p^u$ với $p \ge N^\beta$. Cho $f_2(x_1, \ldots, x_n) \in \mathbb{Z}[x_1, \ldots, x_n]$ là đa thức tuyến tính **thuần nhất** trong $n \ge 3$ biến. Dưới Assumption 1, có thể tìm tất cả nghiệm với $\gcd(y_1, \ldots, y_n) = 1$, $|y_i| \le N^{\gamma_i}$, nếu:
>
> $$
> \sum_{i=1}^{n} \gamma_i < \frac{v}{u} \cdot \frac{1 - (1-u\beta)^{n/(n-1)} - n(1-u\beta)(1 - \sqrt[n-1]{1-u\beta})}{1} - \epsilon
> $$
>
> (Biểu thức chính xác xem paper, Proposition 2.)

Điểm khác với Proposition 1: exponent trong công thức là $n/(n-1)$ thay vì $(n+1)/n$ — phản ánh việc mất đi một "bậc tự do" do tính thuần nhất (thực chất chỉ còn $n-1$ biến độc lập vì $f_2(y_1, \ldots, y_n) = 0$ buộc một biến phụ thuộc các biến còn lại).

---

## Tóm Tắt và Liên Kết

**Điểm mấu chốt của Second Type**: Tính thuần nhất cho phép "gập" bài toán $n$-biến về $(n-1)$-chiều thực sự, mang lại bound tốt hơn Proposition 1 cho cùng số biến.

Lesson tiếp theo [[07-weak-encryption-exponents|07. Weak Encryption Exponents]] áp dụng Theorem 7 trực tiếp để cải thiện kết quả của Nitaj [Nit12] trên RSA và CRT-RSA, với ứng dụng quan trọng trong thực tế.

---

## References

- [HM08] Herrmann, May — *Solving Linear Equations Modulo Divisors*, Asiacrypt 2008
- [Nit12] Nitaj — *A New Attack on RSA and CRT-RSA*, Africacrypt 2012
- [CJLN09] Castagnos, Joux, Laguillaumie, Nguyen — *Factoring $pq^2$ with Quadratic Forms*, Asiacrypt 2009
- [May03] May — *New RSA Vulnerabilities Using Lattice Reduction Methods*, PhD thesis, 2003
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982
