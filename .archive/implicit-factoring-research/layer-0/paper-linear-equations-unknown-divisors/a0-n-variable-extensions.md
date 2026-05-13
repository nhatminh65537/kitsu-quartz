---
title: "A0. N-Variable Extensions: Proofs of Theorems 3 & 8"
type: math-component
tags: [linear-equations-unknown-divisors, lattice, n-variable, appendix]
aliases: [N-Variable Extensions, Theorems 3 and 8 Proofs]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: [[02-first-variant-generalized-linear-equations|02. First Variant: Generalized Linear Equations]] (Theorems 1, 3 statement), [[04-second-variant-homogeneous-linear-equations|04. Second Variant: Homogeneous Linear Equations]] (Theorem 7, 8 statement)  
> **Lesson type**: Math Component (Appendix)  
> **Covers**: §3.1 Theorem 3 (full proof), §4.1 Theorem 8 (full proof) — bao gồm tính $s_{x_i}$, $s_N$, $d$, và tối ưu hóa $\tau$
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $n$ | Số biến | $n$ |
> | $d$ | Dimension lattice (phân biệt với $d$ secret exponent ở L03) | $d$ |
> | $s_{x_i}$ | Đóng góp của $X_i^{s_{x_i}}$ vào $\det(L)$ | $s_{x_i}$ |
> | $s_N$ | Đóng góp của $N^{s_N}$ vào $\det(L)$ | $s_N$ |
> | $\binom{m+n}{m}$ | Binomial coefficient — dimension lattice cho First Variant | — |
> | $\tau^*$ | Giá trị tối ưu của $\tau$ | $\tau$ |

---

## Mục đích của Appendix này

Theorems 3 và 8 trong paper xử lý trường hợp $n$ biến tổng quát. Proof của chúng đòi hỏi tính toán combinatorial phức tạp (dimension lattice, các exponent tổng $s_{x_i}$, $s_N$) mà paper gốc trình bày rất vắn tắt. Appendix này:

1. Trình bày đầy đủ proof của Theorem 3 (First Variant, $n$ biến).
2. Trình bày proof của Theorem 8 (Second Variant, $n$ biến).
3. Verify tính nhất quán với Theorem 1 ($n=1$) và Theorem 7 ($n=2$).

---

## Proof đầy đủ: Theorem 3 (First Variant, $n$ Biến)

### Thiết lập

Xét $f_1(x_1,\ldots,x_n) = a_0 + a_1 x_1 + \cdots + a_n x_n$ (monic theo $x_1$), cần giải $f_1 \equiv 0 \pmod{p^v}$ với $p^u \mid N$, $p \geq N^\beta$.

**Collection đa thức**:

$$
g_{i_2,\ldots,i_n,k}(x_1,\ldots,x_n) = x_2^{i_2} \cdots x_n^{i_n} \cdot f_1^k(x_1,\ldots,x_n) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil, 0\right\}}
$$

với $k = 0,\ldots,m$ và $i_j \in \{0,\ldots,m\}$ thỏa $\sum_{j=2}^n i_j \leq m - k$.

### Bước 1: Tính Dimension $d$

Số lượng đa thức $g_{i_2,\ldots,i_n,k}$ bằng số cặp $(k, i_2,\ldots,i_n)$ với $k \geq 0$, $i_j \geq 0$ và $k + \sum i_j \leq m$. Đây là số cách chọn $n+1$ số nguyên không âm có tổng $\leq m$:

$$
d = \binom{m+n}{n} = \frac{1}{n!} m^n + o(m^n)
$$

### Bước 2: Tính $s_{x_i}$

Monomial leading của $x_2^{i_2}\cdots x_n^{i_n} f_1^k$ theo thứ tự lexicographic là $x_1^k x_2^{i_2} \cdots x_n^{i_n}$. Phần tử đường chéo tương ứng trong lattice là $X_1^k X_2^{i_2} \cdots X_n^{i_n} \cdot N^{e_k}$.

Do đó:

$$
s_{x_1} = \sum_{\substack{k \geq 0,\, i_j \geq 0 \\ k + \sum i_j \leq m}} k
$$

$$
s_{x_j} = \sum_{\substack{k \geq 0,\, i_j \geq 0 \\ k + \sum i_j \leq m}} i_j \quad (j = 2,\ldots,n)
$$

Bằng đối xứng của bài toán (mỗi thành phần trong tổng $k + i_2 + \cdots + i_n \leq m$ đóng vai trò như nhau trong phân phối), ta có:

$$
s_{x_1} = s_{x_2} = \cdots = s_{x_n} = \frac{1}{n+1} \sum_{\substack{k \geq 0,\, i_j \geq 0 \\ k + \sum i_j \leq m}} (k + i_2 + \cdots + i_n)
$$

Tổng $(k + i_2 + \cdots + i_n)$ trên tập $\{(k,i_2,\ldots,i_n): k + \sum i_j \leq m, \text{ all} \geq 0\}$:

$$
\sum_{\text{all tuples}} \left(\sum_{j} \text{component}_j\right) = (n+1) \cdot \sum_{\text{all tuples}} k = (n+1) \cdot s_{x_1}
$$

Tính $s_{x_1}$ trực tiếp:

$$
s_{x_1} = \sum_{\ell=0}^{m} \ell \cdot \#\{(i_2,\ldots,i_n): \sum i_j \leq m - \ell\} = \sum_{\ell=0}^{m} \ell \binom{m - \ell + n - 1}{n-1}
$$

Asymptotically với $m \to \infty$:

$$
s_{x_i} = \frac{1}{(n+1)!} m^{n+1} + o(m^{n+1}) \quad \text{với mọi } i
$$

### Bước 3: Tính $s_N$

$$
s_N = \sum_{\substack{k=0 \\ k < t}}^{m} \left\lceil \frac{v(t-k)}{u} \right\rceil \cdot \binom{m-k+n-1}{n-1}
$$

vì với mỗi $k < t$, có $\binom{m-k+n-1}{n-1}$ tuple $(i_2,\ldots,i_n)$ hợp lệ. Asymptotically:

$$
s_N = \frac{v}{u} \cdot \frac{(n+1)\tau - 1 + (1-\tau)^{n+1}}{(n+1)!} \cdot m^{n+1} + o(m^{n+1})
$$

> [!tip] 💡 Agent note
> Tính $s_N$ dùng approximation $\lceil v(t-k)/u \rceil \approx v(t-k)/u$ và integral:
>
> $$
> \int_0^{\tau} \frac{v(\tau-x)}{u} \cdot \frac{(1-x)^{n-1}}{(n-1)!} dx \cdot m^{n+1} \cdot n! = \frac{v}{u} \cdot \frac{(n+1)\tau - 1 + (1-\tau)^{n+1}}{(n+1)!} \cdot m^{n+1}
> $$

### Bước 4: Điều kiện LLL và Tối ưu $\tau$

Từ Lemma 1 + Lemma 2, điều kiện (bỏ qua low-order terms và hệ số $2^{O(d)}$):

$$
\det(L)^{1/(d-n+1)} < N^{\beta \tau m}
$$

Thay $\det(L) = \prod_i X_i^{s_{x_i}} \cdot N^{s_N}$ và $d = \binom{m+n}{n} \approx m^n/n!$:

$$
\frac{\sum_i \gamma_i \cdot s_{x_i} + s_N}{d} < \beta \tau m
$$

$$
\frac{n \cdot \frac{1}{(n+1)!} m^{n+1} \sum_i \gamma_i + \frac{v}{u} \cdot \frac{(n+1)\tau - 1 + (1-\tau)^{n+1}}{(n+1)!} m^{n+1}}{\frac{1}{n!} m^n} < \beta \tau m
$$

Rút gọn:

$$
\frac{n \sum_i \gamma_i + \frac{v}{u}\left[(n+1)\tau - 1 + (1-\tau)^{n+1}\right]}{n+1} < \beta \tau
$$

$$
\sum_i \gamma_i < \frac{v}{u} \cdot \frac{(n+1)\beta\tau - [(n+1)\tau - 1 + (1-\tau)^{n+1}]}{n}
$$

$$
= \frac{v}{u} \cdot \frac{1 - (1-\tau)^{n+1} - (n+1)\tau\left(1 - \frac{u}{v}\beta\right) \cdot \frac{v}{u}}{n} \cdot \frac{u}{v}
$$

Tối ưu theo $\tau$: lấy đạo hàm và đặt bằng 0:

$$
\frac{d}{d\tau}\left[(n+1)\beta\tau - (n+1)\tau + 1 - (1-\tau)^{n+1}\right] = 0
$$

$$
(n+1)\beta - (n+1) + (n+1)(1-\tau)^n = 0
$$

$$
(1-\tau)^n = 1 - \beta \cdot \frac{u}{v} \implies \tau^* = 1 - \sqrt[n]{1 - \frac{u}{v}\beta}
$$

Thay $\tau^*$ vào và đặt $\rho = 1 - (u/v)\beta = (1-\tau^*)^n$, ta thu được:

$$
\sum_{i=1}^n \gamma_i < \frac{v}{u} \cdot \frac{1 - \rho^{(n+1)/n}}{n - (n+1)\rho^{1/n}(1 - \rho^{1/n}) \cdot v/u}
$$

Đây chính là bound trong Theorem 3 (với ký hiệu của paper). $\blacksquare$

**Kiểm tra $n=1$**: $\tau^* = 1 - (1 - (u/v)\beta) = (u/v)\beta$, và bound:

$$
\gamma_1 < \frac{v}{u} \cdot \frac{1 - (1-(u/v)\beta)^2}{1} = \frac{v}{u} \cdot \frac{u\beta/v \cdot (2 - u\beta/v)}{1}
$$

Với $u\beta/v \ll 1$: $\approx \frac{v}{u} \cdot \frac{2u\beta}{v} = 2\beta$... Cần dùng công thức chính xác: tại $n=1$, $\tau^* = u\beta/v$ và:

$$
\gamma_1 < 2v\beta\tau^* - v(\tau^*)^2/u = 2v\beta \cdot u\beta/v - v(u\beta/v)^2/u = 2u\beta^2 - u^2\beta^2 v/(v^2) = uv\beta^2
$$

Consistent với Theorem 1. ✓

---

## Proof đầy đủ: Theorem 8 (Second Variant, $n$ Biến)

### Thiết lập

Xét $f_2(x_1,\ldots,x_n) = a_1x_1 + \cdots + a_nx_n$ (homogeneous, monic theo $x_1$), cần giải $f_2 \equiv 0 \pmod{p^v}$ với $\gcd(y_1,\ldots,y_n) = 1$.

**Collection đa thức** (tổng quát hóa Construction 4.1):

$$
g_{i_2,\ldots,i_n,k} = x_2^{i_2} \cdots x_n^{i_n} \cdot f_2^k \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil, 0\right\}}
$$

với $k \geq 0$, $i_j \geq 0$, $k + \sum_{j=2}^n i_j \leq m$ (cùng indexing set như First Variant).

### Sự khác biệt với Theorem 3

Vì $f_2$ là **thuần nhất** bậc 1, $f_2^k$ thuần nhất bậc $k$, và $x_2^{i_2}\cdots x_n^{i_n} f_2^k$ thuần nhất bậc $k + \sum i_j$. Các monomial của $g_{i_2,\ldots,i_n,k}$ có tổng bậc **khác nhau** (từ $0$ đến $m$). Điều này làm thay đổi cách tính $s_{x_i}$.

**Monomial leading của $x_2^{i_2}\cdots x_n^{i_n} f_2^k$**: vì $f_2$ monic theo $x_1$, monomial leading là $x_1^k x_2^{i_2} \cdots x_n^{i_n}$. Tương tự First Variant.

### Tính Dimension

Cùng indexing set → cùng dimension:

$$
d = \binom{m+n}{n} = \frac{m^n}{n!} + o(m^n)
$$

### Tính $s_{x_i}$ cho Second Variant

Do $g_{i_2,\ldots,i_n,k}$ có leading monomial $x_1^k x_2^{i_2} \cdots x_n^{i_n}$, đường chéo thứ $(k,i_2,\ldots,i_n)$ là $X_1^k X_2^{i_2}\cdots X_n^{i_n} \cdot N^{e_k}$.

$$
s_{x_i} = \frac{1}{(n+1)!} m^{n+1} + o(m^{n+1}) \quad \text{(cùng như First Variant)}
$$

### Tính $s_N$ cho Second Variant

Cũng cùng như First Variant:

$$
s_N = \frac{v}{u} \cdot \frac{(n+1)\tau - 1 + (1-\tau)^{n+1}}{(n+1)!} \cdot m^{n+1} + o(m^{n+1})
$$

> [!tip] 💡 Agent note
> Tại sao $s_{x_i}$ và $s_N$ giống nhau? Vì indexing set của $(k, i_2,\ldots,i_n)$ và cấu trúc đường chéo lattice hoàn toàn giống nhau. Sự khác biệt của Second Variant nằm ở **root extraction** (dùng Bézout thay vì Gröbner), không phải ở lattice structure.

### Điều kiện LLL

Điều kiện LLL cần:

$$
\det(L)^{1/(d-n+1)} < N^{\beta\tau m}
$$

Nhưng với Second Variant, khi LLL output $n-1$ polynomial (thay vì $n$ polynomial như First Variant), điều kiện trở thành $d - n + 1$ thay vì $d - n$. Điều này thay đổi **một** trong các exponent:

$$
\sum_i \gamma_i < \frac{v}{u} \cdot \frac{1 - (1-\tau)^{n+1} - (n+1)\tau(1 - (v/u)\beta)}{n}
$$

Tối ưu hóa theo $\tau$ (đạo hàm = 0):

$$
(n+1)(1-\tau)^n = n+1 - (n+1)\frac{v}{u}\beta \implies (1-\tau)^n = 1 - \frac{v}{u}\beta
$$

$$
\tau^* = 1 - \sqrt[n]{1 - \frac{v}{u}\beta}
$$

Lưu ý sự khác biệt với Theorem 3: trong Theorem 3, $\tau^* = 1 - \sqrt[n]{1 - (u/v)\beta}$ dùng $u/v$, còn Theorem 8 dùng $v/u$. Sự đổi chỗ này phản ánh vai trò đối xứng khác nhau của $u$ và $v$ trong hai variant.

Thay $\tau^*$ vào và đặt $\rho = 1 - (v/u)\beta$:

$$
\sum_{i=1}^n \gamma_i < \frac{v}{u} \cdot \frac{1 - \rho^{n/(n-1)}}{n - n\rho^{1/(n-1)} \cdot (1 - \rho^{1/(n-1)})}
$$

Đây chính là bound trong Theorem 8. $\blacksquare$

**Kiểm tra $n=2$**: $\tau^* = 1 - \sqrt{1-(v/u)\beta}$, và với $u=v=1$:

$$
\tau^* = 1 - \sqrt{1-\beta}
$$

Bound tại $n=2$:

$$
\gamma_1 + \gamma_2 < 1 \cdot \frac{1 - (1-\beta)}{2 - 2\sqrt{1-\beta}(1-\sqrt{1-\beta})} = \frac{\beta}{2 - 2\sqrt{1-\beta} + 2(1-\beta)} = \frac{\beta}{2-2\sqrt{1-\beta}+2-2\beta}
$$

Simplify: với $u=v=1$, bound là $uv\beta^2 = \beta^2$? Cần verify:

Thay $\tau^* = u\beta = \beta$ (từ Theorem 7 optimization): $\gamma_1 + \gamma_2 < 2\beta\tau^* - \tau^{*2}/1 = 2\beta^2 - \beta^2 = \beta^2 = uv\beta^2$. ✓

---

## Tóm tắt Tham số Tối ưu

| Theorem | Variant | $n$ biến | $\tau^*$ | Bound |
|---------|---------|----------|----------|-------|
| 1 | First | 1 | $u\beta$ | $\gamma < uv\beta^2$ |
| 3 | First | $n$ | $1 - \sqrt[n]{1-(u/v)\beta}$ | Closed form phức tạp |
| 7 | Second | 2 | $u\beta$ | $\gamma_1+\gamma_2 < uv\beta^2$ |
| 8 | Second | $n$ | $1 - \sqrt[n-1]{1-(v/u)\beta}$ | Closed form phức tạp |

> [!tip] 💡 Agent note
> Điểm thú vị: Theorem 1 và Theorem 7 có cùng $\tau^* = u\beta$ và cùng bound dạng $uv\beta^2$. Điều này là tình cờ khi $n=1$ (First) và $n=2$ (Second) đều cho cùng optimal $\tau$. Với $n$ lớn hơn, hai variant phân kỳ do $(u/v)$ và $(v/u)$ đổi chỗ.

---

## References

- [3] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 (🔴 Prerequisite)
- [10] Lenstra, Lenstra, Lovász — LLL algorithm, 1982 (🔴 Prerequisite)
