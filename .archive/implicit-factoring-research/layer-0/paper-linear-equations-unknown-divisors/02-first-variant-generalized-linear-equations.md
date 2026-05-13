---
title: "02. First Variant: Generalized Linear Equations"
type: math-component
tags: [linear-equations-unknown-divisors, lattice, coppersmith, math-component, lesson-02]
aliases: [First Variant, Generalized Linear Equations]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: [[01-problem-setting-lattice-preliminaries|01. Problem Setting & Lattice Preliminaries]] (Lemma 1, Lemma 2, chiến lược 4 bước)  
> 🔴 **Prerequisite references**: Coppersmith [3], LLL [10]  
> **Lesson type**: Math Component  
> **Covers**: §3, §3.1 — Theorem 1 (univariate linear), Theorem 2 (arbitrary degree), Theorem 3 (n-variable, statement), Assumption 1
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $m$ | Lattice construction parameter (integer, $m \to \infty$) | $m$ |
> | $t$ | $t = \tau m$, tham số shift: $g_k(y) \equiv 0 \pmod{p^{vt}}$ | $t$ |
> | $\tau$ | $\tau \in [0,1)$, tỉ lệ tối ưu hóa | $\tau$ |
> | $X$ | Bound tuyệt đối: $X = N^\gamma$ | $X$ |
> | $s$ | $\sum_k k$ — đóng góp của $X$ vào $\det(L)$ | $s$ |
> | $s_N$ | $\sum_k \lceil v(t-k)/u \rceil$ — đóng góp của $N$ vào $\det(L)$ | $s_N$ |
> | $d$ | Dimension của lattice $L$ | $d$ |

---

## Motivation

Lesson này giải quyết câu hỏi kỹ thuật cốt lõi: **xây dựng lattice như thế nào để Lemma 1 + Lemma 2 phối hợp cho phép tìm nghiệm nhỏ của $f_1(x) \equiv 0 \pmod{p^v}$?**

Ý tưởng mới so với Herrmann–May [6] là chọn exponent của $N$ trong các polynomial $g_k$ một cách **tinh tế hơn**, khai thác đồng thời thông tin $p^u \mid N$ và cần giải mod $p^v$ — hai tham số có thể khác nhau.

---

## Theorem 1: Univariate Linear Equation

### Thiết lập

Xét đa thức univariate linear:

$$
f_1(x) = a_0 + a_1 x \equiv 0 \pmod{p^v}
$$

với $p$ ẩn, $p^u \mid N$, $p \geq N^\beta$. Không mất tổng quát, giả sử $a_1 = 1$ (nhân $a_1^{-1} \pmod{N}$ nếu cần; nếu inverse không tồn tại thì factorize $N$ được ngay). Đặt:

$$
f(x) = a_1^{-1} f_1(x) \pmod{N}
$$

### Xây dựng collection đa thức

> [!note] Construction 2.1 — Polynomial Collection cho First Variant
> Định nghĩa collection đa thức:
>
> $$
> g_k(x) := f^k(x) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil,\, 0\right\}}
> \quad \text{cho } k = 0, 1, \ldots, m
> $$
>
> với tham số nguyên $t = \tau m$ ($0 \leq \tau < 1$) được tối ưu hóa sau.

**Tại sao $g_k(y) \equiv 0 \pmod{p^{vt}}$?** Quan sát:

- $f(y) \equiv 0 \pmod{p^v}$ (giả thiết) → $f^k(y) \equiv 0 \pmod{p^{vk}}$.
- $N \equiv 0 \pmod{p^u}$ → $N^{\lceil v(t-k)/u \rceil} \equiv 0 \pmod{p^{v(t-k)}}$ (do $u \cdot \lceil v(t-k)/u \rceil \geq v(t-k)$).
- Kết hợp: $g_k(y) = f^k(y) \cdot N^{\lceil v(t-k)/u \rceil} \equiv 0 \pmod{p^{vk} \cdot p^{v(t-k)}} = 0 \pmod{p^{vt}}$.

Với $k \geq t$: exponent của $N$ bằng 0, tức $g_k(x) = f^k(x)$, và $f^k(y) \equiv 0 \pmod{p^{vk}} \supseteq p^{vt}$.

### Xây dựng lattice

Đặt $X = N^\gamma$. Dùng coefficient vector của $g_k(xX)$ làm các basis row của lattice $L$, dimension $d = m+1$, sắp xếp theo thứ tự $k = 0, 1, \ldots, m$.

Vì $f(x) = x + a_0$ là monic degree-1, $f^k(xX)$ có dạng tam giác (leading monomial là $X^k x^k$). Lattice $L$ có dạng **tam giác**, nên:

$$
\det(L) = X^s \cdot N^{s_N}
$$

trong đó:

$$
s = \sum_{k=0}^{m} k = \frac{m(m+1)}{2} = \frac{m^2}{2} + o(m^2)
$$

$$
s_N = \sum_{k=0}^{t-1} \left\lceil \frac{v(t-k)}{u} \right\rceil = \frac{v\tau^2 m^2}{2u} + o(m^2)
$$

> [!tip] 💡 Agent note
> Tính $s_N$: khi $k$ chạy từ $0$ đến $t-1$, phần tử thứ $k$ đóng góp $\approx v(t-k)/u$. Tổng xấp xỉ:
> $\sum_{k=0}^{t-1} v(t-k)/u = (v/u) \sum_{j=1}^{t} j = (v/u) \cdot t(t+1)/2 \approx v\tau^2 m^2/(2u)$.
> Các số hạng $o(m^2)$ từ ceiling operation và endpoint error đều không ảnh hưởng đến kết quả khi $m \to \infty$.

### Áp dụng LLL và điều kiện nghiệm

Áp dụng Lemma 1 trên lattice $L$ dimension $d = m+1$: LLL cho vector $v_1$ với

$$
\|v_1\| \leq 2^{\frac{d-1}{4}} \cdot \det(L)^{\frac{1}{d}}
$$

Để Lemma 2 áp dụng được (nghiệm modular → nghiệm nguyên), cần:

$$
2^{\frac{d-1}{4}} \cdot \det(L)^{\frac{1}{d}} < \frac{N^{v\beta\tau m}}{\sqrt{d}}
$$

vì $p^{vt} \geq N^{v\beta\tau m}$ (do $p \geq N^\beta$ và $t = \tau m$). Bỏ qua các hệ số không phụ thuộc $N$ (chúng biến mất khi $m \to \infty$), điều kiện rút gọn thành:

$$
X^s \cdot N^{s_N} < N^{v\beta\tau m \cdot d}
$$

Thay $X = N^\gamma$, $s = m^2/2$, $s_N = v\tau^2 m^2/(2u)$, $d = m+1 \approx m$:

$$
N^{\gamma \cdot m^2/2} \cdot N^{v\tau^2 m^2/(2u)} < N^{v\beta\tau m^2}
$$

Chia hai vế cho $N^{m^2/2}$ và lấy log:

$$
\gamma + \frac{v\tau^2}{u} < 2v\beta\tau
$$

$$
\gamma < 2v\beta\tau - \frac{v\tau^2}{u}
$$

Tối ưu hóa theo $\tau$: lấy đạo hàm và đặt bằng 0:

$$
\frac{d}{d\tau}\!\left(2v\beta\tau - \frac{v\tau^2}{u}\right) = 2v\beta - \frac{2v\tau}{u} = 0 \implies \tau^* = u\beta
$$

Thay $\tau = u\beta$ vào:

$$
\gamma < 2v\beta \cdot u\beta - \frac{v(u\beta)^2}{u} = 2uv\beta^2 - uv\beta^2 = uv\beta^2
$$

### Kết quả

> [!abstract] Theorem 1 — Univariate Linear Equation mod $p^v$ [Lu–Zhang–Lin]
> Cho $N$ composite đủ lớn với ước số $p^u$ ($p \geq N^\beta$, $u \geq 1$). Cho $f_1(x) \in \mathbb{Z}[x]$ là đa thức tuyến tính univariate. Khi đó có thể tìm tất cả nghiệm $y$ của $f_1(x) \equiv 0 \pmod{p^v}$ với $|y| \leq N^\gamma$ nếu:
>
> $$
> \gamma < uv\beta^2
> $$
>
> Độ phức tạp thời gian polynomial theo $\log N$.

**Proof.** Đã phác thảo ở trên (lattice construction + LLL + Howgrave-Graham + optimize $\tau = u\beta$). $\blacksquare$

> [!info] 🟡 So sánh với Howgrave-Graham '01 [8]
> Kết quả của Howgrave-Graham [8] cho ACDP là trường hợp đặc biệt của Theorem 1 khi $u = 1, v = 1$: bound $\gamma < \beta^2$.
>
> Paper này cải thiện bound thành $uv\beta^2$, tốt hơn đúng một hệ số $uv$ — yếu tố đến từ việc $N$ là bội của $p^u$ thay vì chỉ $p$.
>
> *(theo [8]: Howgrave-Graham — Approximate integer common divisors, 2001)*

---

## Theorem 2: Mở rộng lên Arbitrary Degree

Khi $f_1(x)$ có bậc $\delta > 1$, cần thêm **shift polynomials** để đảm bảo đủ nhiều đa thức trong collection:

> [!note] Construction 2.2 — Polynomial Collection cho Degree $\delta$
> Định nghĩa:
>
> $$
> g_{k,j}(x) := x^j \cdot f_1^k(x) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil,\, 0\right\}}
> $$
>
> cho $k = 0,\ldots,m$ và $j = 0,\ldots,\delta-1$.

Lattice dimension tăng lên $d = \delta(m+1)$, nhưng phân tích determinant tương tự cho:

> [!abstract] Theorem 2 — Arbitrary Degree $\delta$
> Trong cùng setting như Theorem 1, nếu $f_1(x)$ có bậc $\delta \geq 1$, có thể tìm nghiệm $|y| \leq N^\gamma$ khi:
>
> $$
> \gamma < \frac{uv\beta^2}{\delta}
> $$

**Proof sketch.** Các shift $x^j$ thêm vào nhân $X^j$ vào các đường chéo, làm tăng $s$ lên $\delta \cdot m^2/2$ (asymptotically), trong khi $s_N$ không thay đổi. Tối ưu hóa $\tau$ tương tự cho bound giảm xuống $uv\beta^2/\delta$. $\blacksquare$

> [!info] 🟡 Special case [13] May 2010
> Khi $u = v$, Theorem 2 recover kết quả của May [13] về LLL-reduction cho RSA với modular polynomial bậc $\delta$.
>
> *(theo [13]: May — Using LLL-reduction for solving RSA and factorization problems, 2010)*

---

## Theorem 3: Mở rộng lên $n$ Biến

Phần tổng quát nhất của First Variant. Proof đầy đủ — bao gồm tính $s_{x_i}$, $s_N$, $d$ cho trường hợp $n$ biến — nằm trong [[a0-n-variable-extensions|A0. N-Variable Extensions]]. Ở đây chỉ phát biểu kết quả.

**Collection đa thức** cho $n$ biến:

$$
g_{i_2,\ldots,i_n,k}(x_1,\ldots,x_n) = x_2^{i_2} \cdots x_n^{i_n} \cdot f_1^k(x_1,\ldots,x_n) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil,\, 0\right\}}
$$

với $i_j \in \{0,\ldots,m\}$ và $\sum_{j=2}^n i_j \leq m - k$.

> [!abstract] Theorem 3 — $n$-Variable Generalization (First Variant)
> Cho $N$ composite với $p^u \mid N$ ($p \geq N^\beta$). Cho $f_1(x_1,\ldots,x_n)$ là đa thức tuyến tính $n$ biến, monic. Dưới **Assumption 1**, có thể tìm nghiệm $(y_1,\ldots,y_n)$ của $f_1 \equiv 0 \pmod{p^v}$ với $|y_i| \leq N^{\gamma_i}$ nếu:
>
> $$
> \sum_{i=1}^n \gamma_i < \frac{v}{u} \cdot \frac{1 - \left(1 - \frac{u}{v}\beta\right)^{n+1}}{n - (n+1)\left(1 - \frac{u}{v}\beta\right)\left(1 - \sqrt[n]{1 - \frac{u}{v}\beta}\right)}
> $$
>
> Độ phức tạp: polynomial theo $\log N$, exponential theo $n$.

> [!note] Tham số tối ưu
> Bound đạt được với $\tau^* = 1 - \sqrt[n]{1 - \frac{u}{v}\beta}$. Khi $n = 1$: $\tau^* = u\beta/v$ và bound rút gọn về $uv\beta^2$ (consistent với Theorem 1).

> [!abstract] Assumption 1 — Algebraic Independence Heuristic
> Lattice construction trong Theorem 3 tạo ra $n$ đa thức $g^{(1)},\ldots,g^{(n)}$ (output của LLL). Assumption cho rằng các đa thức này **algebraically independent** và common roots của chúng có thể tính hiệu quả bằng **Gröbner basis**.
>
> Đây là heuristic được dùng rộng rãi trong lattice-based cryptanalysis [5,1,6]; không có chứng minh lý thuyết trong trường hợp tổng quát, nhưng hoạt động tốt trong thực nghiệm.

> [!warning] Giới hạn của Theorem 3
> Khi $n \geq 2$, thuật toán **exponential theo $n$** (do dimension lattice tăng exponentially). Trong thực tế, chỉ $n = 2, 3$ là khả thi. Các ứng dụng chính trong paper dùng $n = 1$ (Theorems 1, 2) hoặc $n = 2$ (§4).

---

## Phân tích Determinant chi tiết (Theorem 1)

Mục này trình bày lại phép tính $\det(L)$ một cách tường minh để người đọc có thể verify độc lập.

Lattice $L$ có $d = m+1$ row, mỗi row tương ứng $g_k(xX)$ với $k = 0,\ldots,m$. Vì $f(x) = x + a_0$ là monic bậc 1:

- $f^k(x) = x^k + (\text{lower terms})$
- $g_k(xX) = f^k(xX) \cdot N^{e_k}$ với $e_k = \max\!\left\{\lceil v(t-k)/u \rceil, 0\right\}$
- Phần tử đường chéo thứ $k$ (row $k$, column $k$): hệ số của $x^k$ trong $g_k(xX)$ là $X^k \cdot N^{e_k}$

Do đó:

$$
\det(L) = \prod_{k=0}^{m} X^k \cdot N^{e_k} = X^{\sum_{k=0}^m k} \cdot N^{\sum_{k=0}^{m} e_k}
$$

$$
= X^{m(m+1)/2} \cdot N^{s_N}
$$

với

$$
s_N = \sum_{k=0}^{t-1} \left\lceil \frac{v(t-k)}{u} \right\rceil \approx \frac{v}{u} \cdot \sum_{j=1}^{t} j = \frac{v}{u} \cdot \frac{t(t+1)}{2} \approx \frac{v\tau^2 m^2}{2u}
$$

> [!example] Ví dụ số với $u=2, v=3, \beta=0.5, m=4$
> - $\tau^* = u\beta = 2 \times 0.5 = 1$ → clamp $\tau = 0.99$ (vì $\tau < 1$), $t = 3$
> - $s = 0+1+2+3+4 = 10$; $s_N \approx v\tau^2 m^2/(2u) = 3 \times 1 \times 16 / 4 = 12$
> - Bound: $\gamma < uv\beta^2 = 2 \times 3 \times 0.25 = 1.5$ — lý thuyết cho phép nghiệm rất lớn nếu $N$ lớn.

---

## Summary

- **Theorem 1**: $f_1(x) \equiv 0 \pmod{p^v}$, $p^u \mid N$ → nghiệm $|y| \leq N^\gamma$ với $\gamma < uv\beta^2$.
  - Polynomial collection: $g_k = f^k \cdot N^{\lceil v(t-k)/u \rceil}$ cho $k = 0,\ldots,m$.
  - Tối ưu: $\tau^* = u\beta$.
  - Special case $u=v=1$: recover HG'01 [8].
- **Theorem 2**: Bậc $\delta$ → bound giảm xuống $uv\beta^2/\delta$. Special case $u=v$: recover May [13].
- **Theorem 3**: $n$ biến → bound phức tạp hơn; proof đầy đủ trong [[a0-n-variable-extensions|A0]].
- **Assumption 1**: Algebraic independence heuristic cho $n \geq 2$.

Ứng dụng của Theorem 1 vào Multi-Power RSA: xem [[03-multi-power-rsa-attacks|03. Multi-Power RSA Attacks]].

---

## References

- [3] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 (🔴 Prerequisite)
- [6] Herrmann & May — *Solving linear equations modulo divisors*, Asiacrypt 2008
- [8] Howgrave-Graham — *Approximate integer common divisors*, 2001
- [10] Lenstra, Lenstra, Lovász — LLL algorithm, 1982 (🔴 Prerequisite)
- [13] May — *Using LLL-reduction for solving RSA and factorization problems*, 2010
