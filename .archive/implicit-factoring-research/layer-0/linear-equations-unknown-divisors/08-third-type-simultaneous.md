---
title: "08. Third Type: Simultaneous Equations"
type: scheme
tags: [lattice-cryptanalysis, linear-modular-equations, third-type, simultaneous, scheme, lesson-08]
aliases: [Third Type, Theorem 10 11, Simultaneous Modular Equations]
source: "Solving Linear Equations Modulo Unknown Divisors: Revisited — Lu, Zhang, Peng, Lin, ~2015"
created: 2026-03-26
---

> **Prerequisites**: [[02-lattice-preliminaries|02. Lattice Preliminaries]], [[03-first-type-core|03. First Type: Core Algorithm]]  
> **Lesson type**: Scheme  
> **Covers**: §5, §5.1 — Theorem 10 (simultaneous modular univariate linear), Theorem 11 (higher-degree extension)
>
> **Notation** (thêm vào notation đã có):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $r$ | Số mũ: $N \equiv 0 \pmod{p^r}$, $p \ge N^\eta$ |
> | $\eta$ | Tham số kích thước $p$ trong Third Type: $p \ge N^\eta$ |
> | $r_j$ | Số mũ của phương trình $j$: $f_j(x_j) \equiv 0 \pmod{p^{r_j}}$ |
> | $\gamma_j$ | Tham số kích thước nghiệm $j$: $\|x_j^{(0)}\| \le N^{\gamma_j}$ |
> | $n$ | Số phương trình trong hệ đồng thời |
> | $w$ | Dimension của lattice trong Third Type |
> | $s_N, s_{X_j}$ | Tổng exponent trong $\det(L)$ |
> | $\delta_j$ | Bậc của phương trình $j$ trong Theorem 11 |

---

## Bối Cảnh: Hệ Phương Trình Đồng Thời

Hai loại trước (First và Second Type) xét một phương trình với một hoặc nhiều biến. **Third Type** xét nhiều phương trình **đồng thời** trên cùng một ước số ẩn $p$, mỗi phương trình có modulus $p^{r_j}$ riêng:

$$
\begin{cases}
f_1(x_1) = a_1 + x_1 \equiv 0 \pmod{p^{r_1}} \\
f_2(x_2) = a_2 + x_2 \equiv 0 \pmod{p^{r_2}} \\
\quad \vdots \\
f_n(x_n) = a_n + x_n \equiv 0 \pmod{p^{r_n}}
\end{cases}
$$

> [!info] 🟡 Cohn-Heninger [CH12] — Trường Hợp Đặc Biệt
> Cohn và Heninger (ANTS 2012) xét hệ với $r_1 = r_2 = \cdots = r_n = 1$ (tất cả modulo $p$). Paper này tổng quát hóa lên $r_j$ tùy ý. Ứng dụng quan trọng nhất: **Common Prime RSA**, trong đó hai phương trình có modulus khác nhau ($r_1 = 1$, $r_2 = 2$).
>
> *(theo [CH12]: Cohn, Heninger — Approximate Common Divisors via Lattices, ANTS-X 2012)*

---

## Kết Quả Chính — Theorem 10

> [!abstract] Theorem 10 — Third Type, Simultaneous Linear (Lu et al. §5.1, dưới Assumption 1)
> Cho $N \equiv 0 \pmod{p^r}$, $p \ge N^\eta$. Hệ phương trình đồng thời trên có thể giải được (tìm tất cả nghiệm nhỏ $(x_1^{(0)}, \ldots, x_n^{(0)})$ với $|x_j^{(0)}| \le N^{\gamma_j}$) nếu:
>
> $$
> \frac{n}{r} \cdot \frac{\gamma_1 \cdots \gamma_n}{r_1 \cdots r_n} < \eta^{\frac{n+1}{n}}
> $$
>
> và $\eta \gg 1/\sqrt{\log N}$. Độ phức tạp: polynomial trong $\log N$ nhưng **exponential trong $n$**.

**Nhận xét về dạng bound**: Khác với First/Second Type, bound không có dạng tuyến tính $\sum \gamma_i < \text{const}$ mà có dạng **multiplicative** $\prod \gamma_j < \text{const}$. Điều này xuất phát từ bản chất của hệ $n$ phương trình độc lập: mỗi phương trình đóng góp theo nhân tử vào lattice determinant.

### Điều Kiện Tiền Kiểm Tra

Trước khi xây lattice, kiểm tra từng phương trình:

> [!note] Pre-check (Lu et al. §5.1)
> Với mỗi $j \in \{1, \ldots, n\}$, kiểm tra điều kiện $\gamma_j / r_j \le \eta$. Nếu $\gamma_k / r_k > \eta$ với một số $k$ nào đó, **loại bỏ** phương trình $f_k$ — phương trình này không cung cấp thông tin hữu ích (nghiệm quá lớn so với mức $p^{r_k}$ có thể đạt được).

---

## Xây Dựng Thuật Toán

> [!note] Scheme 8.1 — Third Type Algorithm (Theorem 10)
> **Type**: Simultaneous Small Root Finding  
> **Setting**: $N \equiv 0 \pmod{p^r}$, $p \ge N^\eta$; hệ $n$ phương trình $f_j(x_j) = a_j + x_j \equiv 0 \pmod{p^{r_j}}$
>
> **$\mathsf{ThirdTypeAlg}(N, \{f_j\}, \{r_j\}, r, \eta, \{\gamma_j\}, \epsilon)$**
> - Input: $N$, các $f_j$, tham số $r, r_j, \eta, \gamma_j$
> - **Bước 1 — Pre-check**: Loại bỏ $f_k$ nếu $\gamma_k/r_k > \eta$
> - **Bước 2 — Chọn tham số**: $t$ sẽ được tối ưu; $X_j = N^{\gamma_j}$
> - **Bước 3 — Họ đa thức shift** (nhiều chỉ số):
>   $$f_{[i_1,\ldots,i_n]}(x_1,\ldots,x_n) = (a_1+x_1)^{i_1}\cdots(a_n+x_n)^{i_n} \cdot N^{\max\!\left\{\left\lceil t - \sum_j r_j i_j/r \right\rceil,\, 0\right\}}$$
>   chọn các tuple $(i_1,\ldots,i_n)$ thỏa $0 \le \sum_j \gamma_j i_j \le \eta t$
> - **Bước 4**: Xây lattice $L$ từ vector hệ số của $f_{[\cdots]}$ evaluated tại $(x_j X_j)$
> - **Bước 5**: LLL → $n$ đa thức với nghiệm chung
> - **Bước 6**: Gröbner basis (Assumption 1) → tìm $(x_1^{(0)},\ldots,x_n^{(0)})$
> - Output: Tất cả nghiệm nhỏ

### Tại Sao Chọn Tuple $(i_1,\ldots,i_n)$ Với $\sum \gamma_j i_j \le \eta t$?

Ý tưởng: chọn **tất cả** các đa thức shift "hữu ích" — tức là những đa thức có nghiệm đủ nhỏ so với ngưỡng $p^{r_j}$ tương ứng. Điều kiện $\sum \gamma_j i_j \le \eta t$ đảm bảo $|f_{[\cdots]}(x_1^{(0)},\ldots,x_n^{(0)})| < p^t$ (điều kiện Howgrave-Graham).

---

## Phân Tích Determinant và Proof

### Tính Dimension và $\det(L)$

Dimension (số tuple thỏa $\sum \gamma_j i_j \le \eta t$):

$$
w = \dim(L) = \frac{(\eta t)^n}{n!} \cdot \frac{1}{\gamma_1 \cdots \gamma_n} + o(t^n)
$$

Tổng exponent của $N$ trong $\det(L)$:

$$
s_N = \frac{t^{n+1}}{(n+1)!} \cdot \frac{1}{r r_1 \cdots r_n} + o(t^{n+1})
$$

Tổng exponent của $X_j$:

$$
s_{X_j} = \frac{t^{n+1}}{(n+1)!} \cdot \frac{1}{\gamma_1 \cdots \gamma_{j-1} \gamma_j^2 \gamma_{j+1} \cdots \gamma_n} + o(t^{n+1})
$$

### Điều Kiện LLL + Howgrave-Graham

Từ điều kiện $2^{w/4} \det(L)^{1/w} < N^{\eta t}/\sqrt{w}$ (điều kiện chuẩn), bỏ qua lower-order terms và chia cả hai vế theo số hạng chính:

$$
s_N + \sum_{j=1}^{n} \gamma_j s_{X_j} < w \cdot \eta t
$$

Thay các giá trị và tính toán:

$$
\frac{1}{(n+1) r r_1 \cdots r_n} + \frac{n}{\gamma_1 \cdots \gamma_n (n+1)} < \frac{\eta^{n+1}}{n \cdot \gamma_1 \cdots \gamma_n}
$$

Rút gọn (nhân cả hai vế bởi $(n+1) r_1 \cdots r_n \gamma_1 \cdots \gamma_n$) và đơn giản hóa:

$$
\frac{n}{r} \cdot \frac{\gamma_1 \cdots \gamma_n}{r_1 \cdots r_n} < \eta^{(n+1)/n}
$$

### Điều Kiện $\eta \gg 1/\sqrt{\log N}$

Để bỏ qua số hạng $2^{w/4}$ (phần từ LLL bound):

$$
2^{w/4} \ll N^{\eta t} \implies \frac{w}{4} \ll \eta t \log_2 N
$$

Vì $w \sim (\eta t)^n / (n! \gamma_1\cdots\gamma_n)$, điều này tương đương $\eta^n t^{n-1} \ll \log N$. Với $t$ cố định, yêu cầu $\eta^2 \log N \gg 1$, tức $\eta \gg 1/\sqrt{\log N}$. $\blacksquare$

> [!warning] Exponential trong $n$
> Running time exponential trong $n$ vì dimension $w \sim (\eta t)^n / (n! \prod \gamma_j)$ tăng theo luỹ thừa $n$ của $t$, và chính $t$ cũng là hàm của $\epsilon^{-1}$. Với $n = 2$ (trường hợp Common Prime RSA), điều này vẫn thực tế được.

---

## Extension Bậc Cao — Theorem 11

> [!abstract] Theorem 11 — Higher-Degree Simultaneous Equations (Lu et al. §5.1, dưới Assumption 1)
> Xét hệ:
>
> $$
> h_j(x_j) = x_j^{\delta_j} + a_{\delta_j} x_j^{\delta_j - 1} + \cdots + a_0 \equiv 0 \pmod{p^{r_j}}, \quad j = 1,\ldots,n
> $$
>
> Hệ có thể giải được nếu:
>
> $$
> \frac{n}{r} \cdot \frac{\delta_1 \gamma_1 \cdots \delta_n \gamma_n}{r_1 \cdots r_n} < \eta^{\frac{n+1}{n}}
> $$
>
> và $\eta \gg 1/\sqrt{\log N}$.

Proof tương tự Theorem 10 nhưng dùng họ shift $h_1^{i_1} \cdots h_n^{i_n} N^{\cdots}$ với $h_j$ bậc $\delta_j$. So sánh với Theorem 10: mỗi $\gamma_j$ bị thay bởi $\delta_j \gamma_j$ — bound thu hẹp theo tích $\prod \delta_j$, phản ánh bậc cao làm khó bài toán.

---

## So Sánh Với Cohn-Heninger [CH12]

| | Cohn-Heninger [CH12] | **Theorem 10** |
|---|---|---|
| Setting | $r_1 = \cdots = r_n = 1$, $r = 1$ | $r_j$ tùy ý, $r$ tùy ý |
| Bound | $\gamma_1 \cdots \gamma_n < \eta^{(n+1)/n}$ | $\frac{n}{r} \frac{\gamma_1\cdots\gamma_n}{r_1\cdots r_n} < \eta^{(n+1)/n}$ |
| Special case | Theorem 10 với $r = r_j = 1$ | — |

Khi $r = r_1 = \cdots = r_n = 1$: Theorem 10 trở về $n \gamma_1 \cdots \gamma_n < \eta^{(n+1)/n}$, cùng dạng Cohn-Heninger.

---

## Liên Kết Với Ứng Dụng

Lesson tiếp theo [[09-common-prime-rsa|09. Common Prime RSA Attack]] áp dụng Theorem 10 với $n = 2$, $r = 1$, $r_1 = 1$, $r_2 = 2$ — dẫn đến điều kiện $\beta < 4\gamma^3$ và $\gamma > 1/4$.

---

## References

- [CH12] Cohn, Heninger — *Approximate Common Divisors via Lattices*, ANTS-X 2012
- [TK13] Takayasu, Kunihiro — *Better Lattice Constructions for Solving Multivariate Linear Equations Modulo Unknown Divisors*, ACISP 2013
- [HM08] Herrmann, May — *Solving Linear Equations Modulo Divisors*, Asiacrypt 2008
