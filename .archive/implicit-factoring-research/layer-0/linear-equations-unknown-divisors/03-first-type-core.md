---
title: "03. First Type: Core Algorithm"
type: scheme
tags: [lattice-cryptanalysis, linear-modular-equations, coppersmith, first-type, scheme, lesson-03]
aliases: [First Type Core, Theorem 2 Lu et al.]
source: "Solving Linear Equations Modulo Unknown Divisors: Revisited — Lu, Zhang, Peng, Lin, ~2015"
created: 2026-03-26
---

> **Prerequisites**: [[01-problem-landscape|01. Problem Landscape & Prior Work]], [[02-lattice-preliminaries|02. Lattice Preliminaries]]  
> **Lesson type**: Scheme  
> **Covers**: §3 (intro), §3.1 — Theorem 2 (đầy đủ với proof), Figure 1
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f_1(x) = a_0 + a_1 x$ | Đa thức tuyến tính univariate |
> | $f(x)$ | $f(x) = a_1^{-1} f_1(x) \bmod N$ (dạng monic) |
> | $u$ | Số mũ: $p^u \mid N$ |
> | $v$ | Số mũ modulus phương trình: giải modulo $p^v$ |
> | $m$ | Tham số lattice chính (dimension $= m+1$) |
> | $t$ | Tham số shift: $t = \tau m$ |
> | $\tau$ | Tỉ lệ tối ưu, sau cùng $= u\beta$ |
> | $g_k(x)$ | Đa thức shift thứ $k$ trong họ được chọn |
> | $X$ | Bound trên nghiệm: $X = N^{uv\beta^2 - \epsilon}$ |
> | $s, s_N$ | Tổng exponent của $X$ và $N$ trong $\det(L)$ |
> | $c_k$ | Phần lẻ: $\lceil v(t-k)/u \rceil = v(t-k)/u + c_k$ với $c_k \in [0,1)$ |

---

## Phát Biểu Bài Toán

Cho $f_1(x) = a_0 + a_1 x \in \mathbb{Z}[x]$. Ta muốn tìm tất cả nghiệm $y$ của:

$$
f_1(x) \equiv 0 \pmod{p^v}
$$

với $p$ **ẩn**, biết rằng $p \ge N^\beta$ và $p^u \mid N$ (tức $N \equiv 0 \pmod{p^u}$). Tham số $u \ge 1$, $v \ge 1$ là các số nguyên dương tùy ý.

> [!info] 🟡 Điểm xuất phát từ [HG01]
> Trường hợp $u = v = 1$ chính xác là bài toán ACDP của Howgrave-Graham [HG01]: tìm $x_0$ nhỏ của $f_1(x) = x + a \equiv 0 \pmod{p}$. Kết quả của [HG01] cho bound $|x_0| \le N^{\beta^2}$. Paper Lu et al. tổng quát hóa thành bound $N^{uv\beta^2}$, tốt hơn khi $u > 1$ hoặc $v > 1$.
>
> *(theo [HG01]: Howgrave-Graham — Approximate Integer Common Divisors, CaLC 2001)*

---

## Kết Quả Chính

> [!abstract] Theorem 2 — First Type, Univariate Linear (Lu et al. §3.1)
> Với mọi $\epsilon > 0$, cho $N$ đủ lớn có ước số $p^u$ với $p \ge N^\beta$, $u \ge 1$. Cho $f_1(x) \in \mathbb{Z}[x]$ là đa thức tuyến tính với hệ số cao nguyên tố cùng nhau với $N$. Thì có thể tìm tất cả nghiệm $y$ của $f_1(x) \equiv 0 \pmod{p^v}$ với $v \ge 1$, $|y| \le N^\gamma$, nếu:
>
> $$
> \gamma < uv\beta^2
> $$
>
> Độ phức tạp thời gian: $O(\epsilon^{-7} v^2 \log^2 N)$.

**Comparison với prior work:**

| Thuật toán | Setting | Bound $\gamma$ |
|-----------|---------|--------------|
| Howgrave-Graham [HG01] | $u=1, v=1$ | $\beta^2$ |
| May [May10] | $u=v$ (bất kỳ) | $u^2\beta^2 / u = u\beta^2$ (special case của Thm 2) |
| **Theorem 2 (paper này)** | $u, v$ độc lập | $uv\beta^2$ |

Khi $u = r$, $v = r-1$, $\beta = 1/(r+1)$ (trường hợp Multi-Power RSA): bound là $r(r-1)/(r+1)^2$, cải thiện so với kết quả trước.

---

## Xây Dựng Thuật Toán

> [!note] Scheme 3.1 — First Type Algorithm (Theorem 2)
> **Type**: Small Root Finding for Linear Equation Modulo $p^v$  
> **Setting**: $N$ composite, $p^u \mid N$, $p \ge N^\beta$; đa thức tuyến tính $f_1(x) = a_0 + a_1 x$
>
> **$\mathsf{FirstTypeAlg}(N, f_1, \beta, u, v, \epsilon)$**
> - Input: $N$, $f_1$, tham số $\beta$, $u$, $v$, độ chính xác $\epsilon$
> - **Bước 1 — Chuẩn hóa**: Vì $\gcd(a_1, N) = 1$, đặt $f(x) = a_1^{-1} f_1(x) \bmod N$, đây là đa thức monic
> - **Bước 2 — Chọn tham số**: Đặt $m = \lceil \beta(2u + v - uv\beta) / \epsilon \rceil - 1$, $t = \lceil \tau m \rceil$ với $\tau$ sẽ được tối ưu sau; bound $X = N^{uv\beta^2 - \epsilon}$
> - **Bước 3 — Xây họ đa thức shift**:
>   Với $k = 0, 1, \ldots, m$, định nghĩa:
>   $$g_k(x) := f(x)^k \cdot N^{\max\!\left\{\left\lceil v(t-k)/u \right\rceil,\, 0\right\}}$$
>   Nhận xét: $g_k(y) \equiv 0 \pmod{p^{vt}}$ với mọi $k$
> - **Bước 4 — Xây lattice $L$**: $L$ có dimension $d = m+1$, cơ sở là các vector hệ số của $g_k(xX)$, $k = 0, \ldots, m$; sắp xếp theo thứ tự tăng của $k$
> - **Bước 5 — LLL reduction**: Chạy LLL trên $L$, thu vector ngắn nhất $\mathbf{b}_1$
> - **Bước 6 — Trích nghiệm**: Vector $\mathbf{b}_1$ ứng với đa thức $g(x)$ thỏa $g(y) = 0$ trên $\mathbb{Z}$; tìm nghiệm nguyên của $g$
> - Output: Tất cả nghiệm $y$ với $|y| \le X$

---

## Phân Tích Lattice — Tính $\det(L)$

Đây là phần kỹ thuật cốt lõi. Ma trận cơ sở của $L$ là **tam giác** (triangular) — điều này suy ra từ thứ tự sắp xếp các đa thức.

**Ví dụ minh họa (Figure 1 của paper)**: Trường hợp $\beta = 0.25$, $u = 3$, $v = 2$, $t = 6$, $m = 8$:

```text
      1   X   X²  X³  X⁴  X⁵  X⁶  X⁷  X⁸
g₀:  [N⁴  *   *   *   *   *   *   *   *  ]  (k=0, N^{ceil(2·6/3)} = N^4)
g₁:  [    N³f *   *   *   *   *   *   *  ]  (k=1, N^{ceil(2·5/3)} = N^4... )
g₂:  [        f²N³*   *   *   *   *   *  ]  
g₃:  [           f³N² *   *   *   *   *  ]  
g₄:  [               f⁴N² *   *   *   *  ]  
g₅:  [                   f⁵N  *   *   *  ]  
g₆:  [                       f⁶   *   *  ]  
g₇:  [                           f⁷  *   ]  
g₈:  [                               f⁸  ]  
```

Ký hiệu `*` là các entry khác $0$. Diagonal entries là các entry quyết định $\det(L)$.

**Tính $\det(L)$**: Từ cấu trúc tam giác:

$$
\det(L) = X^s \cdot N^{s_N}
$$

với:

$$
s = \sum_{k=0}^{m} k = \frac{m(m+1)}{2}
$$

$$
s_N = \sum_{k=0}^{t-1} \left\lceil \frac{v(t-k)}{u} \right\rceil = \sum_{k=0}^{t-1} \left( \frac{v(t-k)}{u} + c_k \right) = \frac{v\tau m(\tau m + 1)}{2u} + \sum_{k=0}^{t-1} c_k
$$

Ở đây $c_k = \lceil v(t-k)/u \rceil - v(t-k)/u \in [0, 1)$ là phần lẻ (fractional part).

---

## Proof của Theorem 2

**Proof.** Không mất tổng quát, giả sử $a_1 = 1$ (nhân $f_1$ bởi $a_1^{-1} \bmod N$). Đặt $f(x) = f_1(x) \bmod N$.

**Bước 1 — Đa thức shift thỏa điều kiện modular.**

Với $g_k(x) = f(x)^k \cdot N^{\max\{\lceil v(t-k)/u \rceil, 0\}}$, ta claim $g_k(y) \equiv 0 \pmod{p^{vt}}$.

Vì $f(y) \equiv 0 \pmod{p^v}$, suy ra $f(y)^k \equiv 0 \pmod{p^{vk}}$.  
Mặt khác, $N \equiv 0 \pmod{p^u}$, nên $N^{\lceil v(t-k)/u \rceil} \equiv 0 \pmod{p^{u \lceil v(t-k)/u \rceil}} \equiv 0 \pmod{p^{v(t-k)}}$.  
Do đó: $g_k(y) = f(y)^k \cdot N^{\lceil v(t-k)/u \rceil} \equiv 0 \pmod{p^{vk} \cdot p^{v(t-k)}} = 0 \pmod{p^{vt}}$. ✓

**Bước 2 — Áp dụng Lemma 1 (LLL).**

Lattice $L$ có dimension $d = m + 1$. LLL cho vector ngắn nhất $v_1$ với:

$$
\lVert v_1 \rVert \le 2^{\frac{d-1}{4}} \det(L)^{\frac{1}{d}}
$$

**Bước 3 — Áp dụng Lemma 2 (Howgrave-Graham).**

Để $g(y) = 0$ trên $\mathbb{Z}$, ta cần:

$$
2^{\frac{d-1}{4}} \det(L)^{\frac{1}{d}} < \frac{p^{vt}}{\sqrt{d}}
$$

Vì $p^{vt} \ge N^{v\beta t} = N^{v\beta\tau m}$, đủ để yêu cầu:

$$
2^{\frac{m(m+1)}{4}} \cdot (m+1)^{\frac{m+1}{2}} \cdot X^{\frac{m(m+1)}{2}} < N^{v\beta\tau m(m+1) - s_N \cdot ? }
$$

Thay $\det(L) = X^{m(m+1)/2} \cdot N^{s_N}$ và $d = m+1$, bỏ qua các hạng tử không phụ thuộc $N$ khi $m \to \infty$, điều kiện trở thành:

$$
X < N^{2v\beta\tau - \frac{v\tau(\tau m + 1)}{u(m+1)} - \frac{2\sum_{k=0}^{t-1} c_k}{m(m+1)}}
$$

**Bước 4 — Tối ưu $\tau$.**

Đặt $\tau = u\beta$. Khi $m \to \infty$, các hạng tử $O(1/m)$ biến mất. Sử dụng ước lượng thô $\sum_{k=0}^{t-1} c_k \le t/3$ (footnote 3 của paper; chính xác hơn với $v=1$: $\le t/2 + 1$):

$$
X < N^{2v\beta \cdot u\beta - \frac{v \cdot u\beta \cdot (u\beta m + 1)}{u(m+1)} - O(1/m)}
= N^{2uv\beta^2 - uv\beta^2 - O(1/m)}
= N^{uv\beta^2 - O(1/m)}
$$

**Bước 5 — Chọn $m$ đủ lớn.**

Để bound tiệm cận $N^{uv\beta^2}$ trở thành $N^{uv\beta^2 - \epsilon}$, ta cần $m \ge m^* = \lceil \beta(2u + v - uv\beta)/\epsilon \rceil - 1$.

**Bước 6 — Running time.**

Theo thuật toán L² của Nguyen-Stehlé [NS05]:

> [!info] 🟡 L²-Algorithm [NS05]
> Thuật toán L² (Nguyen-Stehlé, Eurocrypt 2005) đạt cùng approximation quality như LLL nhưng với worst-case running time $O(d^5 (d + \log b_{\max}) \log b_{\max})$, trong đó $\log b_{\max}$ là maximal bit-size của entry trong lattice.
>
> *(theo [NS05]: Nguyen, Stehlé — Floating-Point LLL Revisited, Eurocrypt 2005)*

Trong trường hợp này: $d = m + 1 = O(\epsilon^{-1})$; bit-size của entries là $O(v \epsilon^{-1} \log N)$.  
Suy ra running time: $O(\epsilon^{-5} \cdot (\epsilon^{-1} + v\epsilon^{-1}\log N) \cdot v\epsilon^{-1}\log N) = O(\epsilon^{-7} v^2 \log^2 N)$. $\blacksquare$

---

## Trực Quan Hóa Bound

Để hiểu tại sao $uv\beta^2$ là bound đúng, xét ví dụ cụ thể:

> [!example] Ví dụ: Multi-Power RSA $N = p^3 q$
> - $\beta = 1/(r+1) = 1/4$ (vì $p \approx N^{1/(r+1)}$ với $r=3$)
> - $u = r = 3$ (vì $p^3 \mid N$)
> - $v = r - 1 = 2$ (phương trình modulo $p^{r-1} = p^2$)
>
> Bound mới: $\gamma < uv\beta^2 = 3 \cdot 2 \cdot (1/4)^2 = 6/16 = 0.375$
>
> Bound cũ (Herrmann-May với $u = v = 1$): $\gamma < \beta^2 = 1/16 = 0.0625$
>
> Cải thiện: gấp $uv = 6$ lần! Đây là sức mạnh của việc khai thác $p^u \mid N$ và phương trình modulo $p^v$.

---

## Điều Kiện Cần Để Thuật Toán Hoạt Động

> [!warning] Điều kiện $u\beta < 1$
> Để dimension lattice $d = O(\epsilon^{-1})$ hữu hạn và running time polynomial, cần $u\beta < 1$, tức là $p^u < N$. Điều này tự nhiên vì nếu $p^u = N$ thì $N$ chỉ có một thừa số và ta đã biết $p$ rồi.

> [!warning] $\gcd(a_1, N) = 1$
> Hệ số cao của $f_1$ phải nguyên tố cùng nhau với $N$ để có thể tạo đa thức monic. Trong các ứng dụng RSA, $a_1 = e$ (public exponent) và điều này luôn thỏa.

---

## Tóm Tắt Kỹ Thuật

**Ý tưởng mới so với Howgrave-Graham [HG01]**: Thay vì chỉ dùng $N^{t-k}$ làm "lift", paper dùng $N^{\lceil v(t-k)/u \rceil}$. Số mũ này tận dụng **đồng thời** hai mức thông tin:
- $v$: phương trình ở mức $p^v$ (cao hơn $p$ thông thường)
- $u$: $N$ chia hết cho $p^u$ (nhiều hơn chỉ $p$)

Tích $uv$ trong bound $uv\beta^2$ phản ánh chính xác việc kết hợp hai mức này.

> [!info] 🟡 So sánh với Herrmann-May [HM08]
> Herrmann-May dùng $g_{i_2,\ldots,i_n,k} = x_2^{i_2} \cdots x_n^{i_n} \cdot f^k \cdot N^{\max\{t-k, 0\}}$, tương ứng $u = v = 1$ trong framework này. Bound của họ là $3\beta - 2 + 2(1-\beta)^{3/2}$ cho bivariate (vẫn tốt hơn $\beta^2$ cho $n \ge 2$ biến, nhưng Theorem 2 của paper này cho univariate là $uv\beta^2$ tốt hơn $\beta^2$ khi $u, v > 1$).
>
> *(theo [HM08]: Herrmann, May — Solving Linear Equations Modulo Divisors, Asiacrypt 2008)*

---

## Lesson Tiếp Theo

Lesson [[04-first-type-extensions|04. First Type: Extensions]] sẽ trình bày hai extension của Theorem 2:
- **Theorem 3**: Mở rộng lên đa thức bậc $\delta$ tùy ý
- **Proposition 1**: Mở rộng lên $n$ biến

---

## References

- [HG01] Howgrave-Graham — *Approximate Integer Common Divisors*, CaLC 2001
- [HG97] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, IMACC 1997
- [HM08] Herrmann, May — *Solving Linear Equations Modulo Divisors*, Asiacrypt 2008
- [NS05] Nguyen, Stehlé — *Floating-Point LLL Revisited*, Eurocrypt 2005
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997
- [May10] May — *Using LLL-Reduction for Solving RSA and Factorization Problems*, 2010
