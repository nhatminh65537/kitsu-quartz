---
title: "04. First Type: Extensions"
type: deep-dive
tags: [lattice-cryptanalysis, linear-modular-equations, first-type, multivariate, deep-dive, lesson-04]
aliases: [First Type Extensions, Theorem 3, Proposition 1]
source: "Solving Linear Equations Modulo Unknown Divisors: Revisited — Lu, Zhang, Peng, Lin, ~2015"
created: 2026-03-26
---

> **Prerequisites**: [[03-first-type-core|03. First Type: Core Algorithm]], [[02-lattice-preliminaries|02. Lattice Preliminaries]]  
> **Lesson type**: Deep Dive  
> **Covers**: §3.1 — Theorem 3 (degree-$\delta$ extension), Proposition 1 ($n$-variable extension)
>
> **Notation** (thêm vào notation đã có):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\delta$ | Bậc của đa thức univariate (Theorem 3) |
> | $n$ | Số biến trong Proposition 1 |
> | $\gamma_i$ | Tham số kích thước nghiệm biến $x_i$: $\|y_i\| \le N^{\gamma_i}$ |
> | $X_i$ | Bound tuyệt đối: $X_i = N^{\gamma_i}$ |
> | $d$ | Dimension lattice trong Proposition 1 |
> | $s_{x_i}$ | Tổng exponent của $X_i$ trong $\det(L)$ (Prop 1) |

---

## Bối Cảnh

Lesson [[03-first-type-core|03]] đã thiết lập Theorem 2 — kết quả nền tảng cho đa thức **tuyến tính univariate** $f_1(x) = a_0 + a_1 x \bmod p^v$. Bài học này mở rộng theo hai hướng độc lập:

- **Hướng 1** (Theorem 3): Giữ nguyên univariate, mở rộng lên đa thức bậc $\delta$ tùy ý.
- **Hướng 2** (Proposition 1): Giữ nguyên tuyến tính, mở rộng lên $n$ biến.

Cả hai đều kế thừa trực tiếp skeleton từ Theorem 2 — chỉ thay đổi cách chọn họ đa thức shift $\{g_k\}$.

---

## Hướng 1 — Extension Lên Bậc $\delta$ Tùy Ý (Theorem 3)

### Phát Biểu

> [!abstract] Theorem 3 — Degree-$\delta$ Univariate Extension (Lu et al. §3.1)
> Với mọi $\epsilon > 0$, cho $N$ đủ lớn có ước số $p^u$ với $p \ge N^\beta$. Cho $f_1(x) \in \mathbb{Z}[x]$ là đa thức bậc $\delta$ với hệ số cao nguyên tố cùng nhau với $N$. Thì có thể tìm tất cả nghiệm $y$ của $f_1(x) \equiv 0 \pmod{p^v}$ với $|y| \le N^\gamma$, nếu:
>
> $$
> \gamma < \frac{uv\beta^2}{\delta} - \epsilon
> $$
>
> Độ phức tạp thời gian: $O(\epsilon^{-7}\delta^5 v^2 \log^2 N)$.

**Comparison với Theorem 2**: Khi $\delta = 1$ (tuyến tính), Theorem 3 khớp chính xác với Theorem 2. Với $\delta > 1$, bound giảm theo $1/\delta$ — phản ánh thực tế rằng đa thức bậc cao cứng hơn để giải.

**Comparison với Theorem 1 (Coppersmith/May)**: Theorem 1 cho bound $\beta^2/\delta$ (trường hợp $u = v = 1$). Theorem 3 cho $uv\beta^2/\delta$, tốt hơn đúng $uv$ lần khi khai thác $p^u \mid N$.

### Xây Dựng Thuật Toán

> [!note] Scheme 4.1 — Degree-$\delta$ Extension (Theorem 3)
> **Type**: Small Root Finding for Degree-$\delta$ Polynomial Modulo $p^v$  
> **Setting**: $N$ composite, $p^u \mid N$, $p \ge N^\beta$; đa thức bậc $\delta$: $f_1(x) \in \mathbb{Z}[x]$
>
> **$\mathsf{DegDeltaAlg}(N, f_1, \delta, \beta, u, v, \epsilon)$**
> - Input: $N$, $f_1$ bậc $\delta$, tham số $\beta, u, v, \epsilon$
> - **Bước 1**: Chuẩn hóa: đặt $f(x) = f_1(x) / \text{lc}(f_1) \bmod N$ (monic)
> - **Bước 2**: Chọn $m$, $t = \tau m$; bound $X = N^{uv\beta^2/\delta - \epsilon}$
> - **Bước 3 — Họ đa thức shift** (mở rộng so với Theorem 2):
>   $$g_{j,k}(x) := x^j \cdot f(x)^k \cdot N^{\max\!\left\{\left\lceil v(t-k)/u \right\rceil,\, 0\right\}}$$
>   với $k = 0, \ldots, m$ và $j = 0, \ldots, \delta - 1$
> - **Bước 4**: Xây lattice $L$ từ vector hệ số của $g_{j,k}(xX)$; dimension $d = \delta(m+1)$
> - **Bước 5**: Chạy LLL, trích nghiệm nguyên của đa thức output
> - Output: Tất cả nghiệm $y$ với $|y| \le X$

**Tại sao thêm $x^j$?** Trong Theorem 2 ($\delta = 1$), mỗi $g_k$ chỉ có một monomial dẫn đầu $x^k$. Với $\delta > 1$, $f^k$ có $k\delta + 1$ monomial nhưng ta cần lattice tam giác để tính $\det(L)$ dễ. Việc thêm $x^j f^k$ cho $j = 0, \ldots, \delta-1$ tạo ra đủ các "bậc" để điền đầy lattice một cách có kiểm soát.

**Proof sketch**: Giống Theorem 2 hoàn toàn. Thay $s = \sum_{k=0}^m k\delta$ thành $s = \delta \cdot m(m+1)/2$ và $d = \delta(m+1)$. Tối ưu $\tau = u\beta$ cho bound $\gamma < uv\beta^2/\delta$. $\blacksquare$

> [!tip] 💡 Agent note
> Paper đề cập rằng kết quả của [May10] là trường hợp đặc biệt $u = v$ của Theorem 3. Cụ thể, [May10, §3] xét đa thức bậc $\delta$ modulo $p^v$ với $p^v \mid N$ (tức $u = v$), và bound của May là $\gamma < v^2\beta^2/\delta \cdot (1/v) = v\beta^2/\delta$. Theorem 3 với $u = v$ cho $\gamma < v^2\beta^2/\delta$ — tốt hơn $v$ lần!

---

## Hướng 2 — Extension Lên $n$ Biến (Proposition 1)

### Phát Biểu

> [!abstract] Proposition 1 — $n$-Variable Linear Extension (Lu et al. §3.1, dưới Assumption 1)
> Với mọi $\epsilon > 0$, cho $N$ đủ lớn có ước số $p^u$ với $p \ge N^\beta$, $u \ge 1$. Cho $f_1(x_1, \ldots, x_n) \in \mathbb{Z}[x_1, \ldots, x_n]$ là đa thức tuyến tính monic trong $n \ge 2$ biến. Dưới Assumption 1, có thể tìm tất cả nghiệm $(y_1, \ldots, y_n)$ của $f_1 \equiv 0 \pmod{p^v}$ với $|y_i| \le N^{\gamma_i}$, nếu:
>
> $$
> \sum_{i=1}^{n} \gamma_i < \frac{v}{u} \cdot \frac{1 - (1-u\beta)^{n+1}}{n - (n+1)(1-u\beta)\bigl(1 - \sqrt[n]{1-u\beta}\bigr)} - \epsilon
> $$
>
> Độ phức tạp: polynomial trong $\epsilon^{-n}$ và $\epsilon^{-n} \log N$.

Bound này phức tạp hơn Theorem 2 vì liên quan $n$ biến. Với $n = 1$, $u = v = 1$: bound trở về $\beta^2$, khớp Howgrave-Graham.

### Họ Đa Thức Shift

> [!note] Scheme 4.2 — $n$-Variable Extension (Proposition 1)
> **Type**: Small Root Finding for Multivariate Linear Equation Modulo $p^v$  
> **Setting**: $p^u \mid N$, $p \ge N^\beta$; đa thức tuyến tính $f_1(x_1, \ldots, x_n)$
>
> **$\mathsf{MultiVarAlg}(N, f_1, n, \beta, u, v, \epsilon)$**
> - Input: $N$, $f_1$ tuyến tính $n$ biến, tham số $\beta, u, v, \epsilon$
> - **Bước 1**: Chuẩn hóa $f_1$ thành monic $f$
> - **Bước 2**: Chọn $m$, $t = \tau m$; bounds $X_i = N^{\gamma_i}$
> - **Bước 3 — Họ đa thức shift** (dùng "extra variable" trick của Herrmann-May [HM08]):
>   $$g_{i_2,\ldots,i_n,k}(x_1,\ldots,x_n) := x_2^{i_2} \cdots x_n^{i_n} \cdot f_1(x)^k \cdot N^{\max\!\left\{\left\lceil v(t-k)/u \right\rceil,\, 0\right\}}$$
>   với $k = 0, \ldots, m$ và $i_j \ge 0$ thỏa $\sum_{j=2}^{n} i_j \le m - k$
> - **Bước 4**: Xây lattice $L$ từ vector hệ số của $g_{\cdots}(x_1 X_1, \ldots, x_n X_n)$
> - **Bước 5**: LLL → $n$ đa thức với nghiệm chung $(y_1, \ldots, y_n)$
> - **Bước 6**: Giải hệ bằng Gröbner basis (Assumption 1)
> - Output: Tất cả nghiệm nhỏ $(y_1, \ldots, y_n)$

### Phân Tích Determinant

Dimension:

$$
d = \binom{m+n}{m} = \frac{1}{n!} m^n + o(m^n)
$$

Các tổng exponent trong $\det(L)$:

$$
s_{x_i} = \sum_{\substack{k,i_2,\ldots,i_n \\ \sum i_j \le m-k}} i_i = \binom{m+n}{m-1} = \frac{1}{(n+1)!} m^{n+1} + o(m^{n+1})
$$

$$
s_N = \sum_{k=0}^{t-1} \sum_{\substack{i_2,\ldots,i_n \\ \sum i_j \le m-k}} \left\lceil \frac{v(t-k)}{u} \right\rceil = \frac{v}{u} \cdot \frac{(n+1)\tau - 1 + (1-\tau)^{n+1}}{(n+1)!} m^{n+1} + o(m^{n+1})
$$

### Tối Ưu $\tau$

Từ điều kiện LLL + Howgrave-Graham, sau khi tối ưu $\tau = 1 - \sqrt[n]{1 - u\beta}$, ta thu được bound:

$$
\sum_{i=1}^{n} \gamma_i < \frac{v}{u} \cdot \frac{1 - (1-u\beta)^{n+1}}{n - (n+1)(1-u\beta)(1 - \sqrt[n]{1-u\beta})} - \epsilon
$$

> [!tip] 💡 Agent note
> Giá trị tối ưu $\tau = 1 - \sqrt[n]{1 - u\beta}$ xuất hiện khi đặo hàm theo $\tau$ của biểu thức bound bằng $0$, giải ra $\tau$. Đây là kỹ thuật chuẩn trong lattice-based cryptanalysis multivariate — xem [HM08] cho trường hợp $u = v = 1$.

> [!info] 🟡 So sánh với Herrmann-May [HM08]
> Herrmann-May xét $u = v = 1$ và dùng $\tau = 1 - (1-\beta)^{1/n} \cdot \sqrt[n]{1/n}$... Không, chính xác hơn: [HM08] cho bound $\sum \gamma_i < \frac{1 - (1-\beta)^{n+1}}{n - (n+1)(1-\beta)(1-(1-\beta)^{1/n})}$ với $u = v = 1$. Proposition 1 tổng quát hóa điều này thành $u, v$ tùy ý: thay $\beta \mapsto u\beta$ rồi nhân kết quả bởi $v/u$.
>
> *(theo [HM08]: Herrmann, May — Solving Linear Equations Modulo Divisors, Asiacrypt 2008)*

### Ví Dụ Tính Bound Cho $n = 2$

> [!example] Bivariate với $u = 1$, $v = 1$, $\beta = 0.5$
> Với $n = 2$, $\tau_{\text{opt}} = 1 - \sqrt{1 - \beta} = 1 - \sqrt{0.5} \approx 0.293$.
>
> Bound: $\gamma_1 + \gamma_2 < \frac{1 - (1-\beta)^3}{2 - 3(1-\beta)(1-\sqrt{1-\beta})}$
>
> Thay $\beta = 0.5$: numerator $= 1 - (0.5)^3 = 0.875$; denominator $= 2 - 3 \cdot 0.5 \cdot (1 - \sqrt{0.5}) \approx 2 - 1.5 \cdot 0.293 = 1.560$.
>
> Bound $\approx 0.875 / 1.560 \approx 0.561$.
>
> Herrmann-May [HM08, Table 1] cho bound $\approx 0.232$ với $u = v = 1$ (univariate). Proposition 1 với $n = 2$ cho $0.561$ — đây là bound cho tổng $\gamma_1 + \gamma_2$, tốt hơn bound univariate khi cả hai nghiệm nhỏ.

---

## So Sánh Hai Extension

| | **Theorem 3** | **Proposition 1** |
|---|---|---|
| Hướng mở rộng | Bậc $\delta > 1$, univariate | $n > 1$ biến, tuyến tính |
| Họ shift | $x^j f^k N^{\cdots}$ ($j = 0,\ldots,\delta{-}1$) | $x_2^{i_2} \cdots x_n^{i_n} f^k N^{\cdots}$ |
| Dimension $d$ | $\delta(m+1)$ | $\binom{m+n}{m}$ |
| Bound | $\sum\gamma_i < uv\beta^2/\delta$ | Biểu thức phức tạp hơn |
| Assumption 1 cần? | Không (univariate → factoring thông thường) | **Có** (multivariate → Gröbner basis) |
| Running time | $O(\epsilon^{-7}\delta^5 v^2 \log^2 N)$ | polynomial trong $\epsilon^{-n}$ |

---

## Liên Kết Với Ứng Dụng

Trong các ứng dụng cụ thể của paper:

- **Theorem 4 (Multi-Power RSA small exponent)**: Dùng **Theorem 2** (trường hợp tuyến tính univariate $n = 1$, $\delta = 1$) — không cần extension.
- **Proposition 1**: Áp dụng trong **factoring with known bits** khi các bit ẩn của $p$ rải rác qua nhiều khối — trường hợp multivariate của Herrmann-May, nhưng với $u = r$, $v = 1$ cho $N = p^r q$.

Lesson tiếp theo [[05-multi-power-rsa-attacks|05. Multi-Power RSA Attacks]] áp dụng trực tiếp Theorem 2 (không cần Theorem 3 hay Proposition 1) cho ba tấn công chính vào Multi-Power RSA.

---

## References

- [HM08] Herrmann, May — *Solving Linear Equations Modulo Divisors: On Factoring Given Any Bits*, Asiacrypt 2008
- [May10] May — *Using LLL-Reduction for Solving RSA and Factorization Problems*, 2010
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997
