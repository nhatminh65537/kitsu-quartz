---
title: "05. Multiple Encryptions, Multivariate Extension & Open Problems"
type: attack
tags: [coppersmith, rsa, lattice, attack, lesson-05]
aliases: [Coppersmith Multiple Encryptions, Multivariate Coppersmith]
source: "Finding a Small Root of a Univariate Modular Equation — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[03-lll-analysis-correctness|03. LLL Analysis & Correctness Proof]]; [[04-rsa-attacks-stereotyped-random-padding|04. RSA Attacks: Stereotyped Messages & Random Padding]]  
> 🔴 **Prerequisite references**: Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients* [LLL82]  
> **Lesson type**: Attack  
> **Covers**: §3 Extension to Multivariate Polynomials; §6 Another Solution for Multiple Encryptions; §7 Conclusions and Open Problems
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $k+1$ | Số lần mã hoá (§6) | $k+1$ |
> | $t_i$ | Padding của lần mã hoá thứ $i$ | $t_i$ |
> | $A_i$ | Ciphertext thứ $i$: $(m+t_i)^3 \bmod N$ | $A_i$ |
> | $c_i$ | Hiệu $A_i - A_0$ | $c_i$ |
> | $d_{ij}$ | Số hạng bậc 3 của $t_i, t_j$: $t_i t_j(t_i - t_j)$ | $d_{ij}$ |
> | $e_{ij\ell}$ | Số hạng bậc 6 của $t_i,t_j,t_\ell$: $-t_i t_j t_\ell(t_i-t_j)(t_j-t_\ell)(t_\ell-t_i)$ | $e_{ij\ell}$ |
> | $\alpha$ | Bound exponent: $\|t_i\| \leq \frac{1}{2}N^\alpha$ | $\alpha$ |
> | $C(k,r)$ | Tổ hợp chập $r$ của $k$ phần tử | $C(k,2), C(k,3)$ |
> | $m, n$ | Số biến, tổng bậc (§3 multivariate) | $m, k$ |

---

## Motivation

Lesson [[04-rsa-attacks-stereotyped-random-padding|04]] xử lý trường hợp **hai** lần mã hoá với padding ngẫu nhiên, dẫn đến đa thức bậc 9 univariate có thể giải với bound $N^{1/9}$. Hai câu hỏi tự nhiên tiếp theo:

1. **Nếu có nhiều hơn 2 lần mã hoá**: bound cho padding có thể tăng lên không?
2. **Bài toán multivariate**: khi có nhiều biến nhỏ, phương pháp có mở rộng được không?

Section §6 trả lời câu hỏi 1 bằng một tấn công heuristic (không đảm bảo) chịu được padding tới $\sim N^{1/6}$. Section §3 trả lời câu hỏi 2 với kết quả heuristic và nhiều câu hỏi mở.

---

## Tấn Công Nhiều Lần Mã Hoá (§6)

### Thiết Lập

Giả sử có $k+1$ lần mã hoá cùng message $m$ với padding khác nhau:

$$
A_0 \equiv m^3 \pmod{N}, \qquad A_i \equiv (m + t_i)^3 \pmod{N}, \quad i = 1, \ldots, k
$$

Attacker biết $A_0, A_1, \ldots, A_k$ và $N$. Đặt $c_i = A_i - A_0$:

$$
c_i \equiv 3m^2 t_i + 3m t_i^2 + t_i^3 \pmod{N}
$$

Giả thiết padding nhỏ: $|t_i| \leq \frac{1}{2}N^\alpha$.

### Định Nghĩa Các Đại Lượng Khoá

Coppersmith định nghĩa hai họ số hạng, đóng vai trò là "ẩn phụ" trong lattice:

$$
d_{ij} = t_i t_j (t_i - t_j), \quad i < j
$$

$$
e_{ij\ell} = -t_i t_j t_\ell (t_i - t_j)(t_j - t_\ell)(t_\ell - t_i), \quad i < j < \ell
$$

Bounds: $|d_{ij}| < N^{3\alpha}$ và $|e_{ij\ell}| < N^{6\alpha}$.

Số lượng đại lượng độc lập: $C(k,2)$ đại lượng $d_{ij}$ và $C(k,3)$ đại lượng $e_{ij\ell}$.

### Identity Kết Nối

Điểm mấu chốt là identity sau đây kiểm chứng được bằng đại số:

$$
d_{ij} c_\ell + d_{j\ell} c_i - d_{i\ell} c_j \equiv e_{ij\ell} \pmod{N}
$$

Identity này biến $e_{ij\ell}$ thành một tổ hợp tuyến tính của các $d_{ij}$ và $c_i$ (đã biết) — đây là cơ sở để xây dựng lattice.

### Cấu Trúc Ma Trận $M$ (§6)

> [!note] Scheme 5.1 — Matrix cho tấn công nhiều encryption
> **Type**: Lattice construction cho multiple-encryption attack  
> **Setting**: $k+1$ ciphertext, $C(k,2)$ đại lượng $d_{ij}$, $C(k,3)$ đại lượng $e_{ij\ell}$
>
> $M$ là ma trận nguyên vuông kích thước $(C(k,2) + C(k,3)) \times (C(k,2) + C(k,3))$:
>
> - **Block trên-trái** $C(k,2) \times C(k,2)$: identity nhân với xấp xỉ nguyên của $N^{3\alpha}$
> - **Block dưới-trái** $C(k,3) \times C(k,2)$: ma trận không
> - **Block dưới-phải** $C(k,3) \times C(k,3)$: $N$ nhân identity
> - **Block trên-phải** $C(k,2) \times C(k,3)$: hàng $(i,j)$, cột $(i,j,\ell)$ chứa:
>   $c_\ell$ tại hàng $(i,j)$; $c_i$ tại hàng $(j,\ell)$; $-c_j$ tại hàng $(i,\ell)$

Minh hoạ $k=4$ ($C(4,2)=6$ hàng đầu, $C(4,3)=4$ cột cuối):

$$
M = \begin{pmatrix}
N^{3\alpha} & 0 & 0 & 0 & 0 & 0 & c_3 & c_4 & 0 & 0 \\
0 & N^{3\alpha} & 0 & 0 & 0 & 0 & -c_2 & 0 & c_4 & 0 \\
0 & 0 & N^{3\alpha} & 0 & 0 & 0 & 0 & -c_2 & -c_3 & 0 \\
0 & 0 & 0 & N^{3\alpha} & 0 & 0 & c_1 & 0 & 0 & c_4 \\
0 & 0 & 0 & 0 & N^{3\alpha} & 0 & 0 & c_1 & 0 & -c_3 \\
0 & 0 & 0 & 0 & 0 & N^{3\alpha} & 0 & 0 & c_1 & c_2 \\
0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N
\end{pmatrix}
$$

### Vector Target và Phân Tích

Row vector $\mathbf{r}$ có $C(k,2)$ entries đầu là $d_{ij}$ và $C(k,3)$ entries cuối là $(e_{ij\ell} - (d_{ij}c_\ell + d_{j\ell}c_i - d_{i\ell}c_j))/N$.

Tích $\mathbf{r}M = \mathbf{s}$ có entries trái bằng $d_{ij} N^{3\alpha}$ và entries phải bằng $e_{ij\ell}$ — tất cả bounded bởi $N^{6\alpha}$.

$\det(M) = N^{3\alpha \cdot C(k,2) + C(k,3)}$. Với $\alpha < (k-2)/(6k-3)$:

$$
\det(M) > (N^{6\alpha})^{C(k,2)+C(k,3)}
$$

Do đó $\mathbf{s}$ là một trong những vector ngắn hơn của lattice và LLL có thể recover $\mathbf{s}$.

### Recovery của $m$

Sau khi LLL tìm được $\mathbf{s}$, recover $\mathbf{r} = \mathbf{s} M^{-1}$, từ đó lấy gcd:

$$
\gcd\{d_{1,2},\, d_{1,3},\, \ldots,\, d_{1,k}\} = t_1 \cdot \gcd\{t_2(t_1-t_2),\, t_3(t_1-t_3),\, \ldots\}
$$

Nếu gcd phụ nhỏ, exhaustive search tìm $t_1$. Sau khi có $t_1$, dùng Franklin–Reiter để recover $m$.

### Bound Padding và Ví Dụ

> [!abstract] Claim 5.2 — Bound padding cho $k+1$ encryptions (heuristic)
> Tấn công (heuristic) chịu được padding tới $\alpha$ lần chiều dài $N$, với:
>
> $$
> \alpha < \frac{k-2}{6k-3} < \frac{1}{6}
> $$
>
> Bound này tăng dần khi $k \to \infty$ nhưng không bao giờ vượt $1/6$.

| Số lần mã hoá $k+1$ | $k$ | Bound $\alpha < (k-2)/(6k-3)$ | Padding max (RSA-1024) |
|--------------------|----|-------------------------------|------------------------|
| 3 | 2 | $0/9 = 0$ | — (không hoạt động) |
| 4 | 3 | $1/15 \approx 0.067$ | ~68 bit |
| 5 | 4 | $2/21 \approx 0.095$ | ~97 bit |
| 10 | 9 | $7/51 \approx 0.137$ | ~140 bit |
| 14 | 13 | $11/75 \approx 0.147$ | **~150 bit** |

> [!tip] 💡 Agent note
> Với 14 lần mã hoá cùng message trên RSA-1024 ($k=13$), tấn công (heuristic) chịu được tới ~150 bit padding — cải thiện đáng kể so với 113 bit của tấn công 2-encryption. Paper nhấn mạnh đây là **heuristic**: không có đảm bảo thành công vì bước tìm $\mathbf{s}$ phụ thuộc vào rank của $\mathbf{s}$ trong tập vector ngắn của lattice, không được phân tích nghiêm ngặt.

---

## Mở Rộng Multivariate (§3)

### Bài Toán Multivariate

Khi thay vì một biến nhỏ ta có nhiều biến nhỏ:

> [!note] Definition 5.3 — Bài toán Small Root Multivariate
> **Input**: Đa thức $p(x_1, \ldots, x_m) \pmod{N}$ tổng bậc $k$, và biết tồn tại solution $x_i = y_i$ với $|y_i| < N^{\alpha_i}$.
>
> **Mục tiêu**: Tìm $(y_1, \ldots, y_m)$ nếu $\sum \alpha_i < 1/k - \varepsilon$.

### Xây Dựng Lattice Multivariate

Coppersmith mở rộng construction tương tự: định nghĩa

$$
z = \frac{p(y_1, \ldots, y_m)}{N}, \quad q_{i_1 \ldots i_m j}(x_1, \ldots, x_m) = x_1^{i_1} \cdots x_m^{i_m} \cdot p(x_1, \ldots, x_m)^j
$$

Xây dựng ma trận $M$ tương tự §2 nhưng với tất cả monomial $x_1^{i_1} \cdots x_m^{i_m}$ bậc tổng $\leq T$.

Với $\sum \alpha_i < 1/k - \varepsilon$: $\det(M) > 1$, và vector $\mathbf{s}$ ứng với $(y_1, \ldots, y_m)$ ngắn.

### Tại Sao Extension Là Heuristic

> [!warning] Breakdown ở bước trích xuất
> Trong univariate, subspace $n-1$ chiều luôn cho một polynomial equation duy nhất về $x_0$ — đủ để giải.
>
> Trong multivariate với $m$ biến, LLL cũng nhốt vector ngắn vào subspace chiều $\leq n-1$. Nhưng để giải hệ $m$ biến, ta cần **$m$ phương trình độc lập**. Có thể nhận được 0, 1, 2, ..., hoặc $m$ phương trình — và không có đảm bảo nào về số lượng hay tính độc lập của chúng.
>
> Đây là lý do §3 là heuristic: trong trường hợp tốt nhất (khi lattice "đủ generic"), $m$ phương trình độc lập sẽ xuất hiện và hệ giải được. Nhưng không thể đảm bảo điều này trong mọi trường hợp.

---

## Kết Luận và Câu Hỏi Mở (§7)

Coppersmith kết thúc paper với tổng kết các kết quả và mở ra các hướng nghiên cứu quan trọng:

> [!abstract] Theorem 5.4 — Tổng kết kết quả (Conclusions §7)
> Paper chứng minh (rigorous):
>
> 1. Tìm nghiệm nguyên $x_0$ của $p(x_0) \equiv 0 \pmod{N}$ với $|x_0| < N^{1/k}$ trong thời gian poly.
> 2. RSA-3 stereotyped messages: recover plaintext khi biết $2/3$ số bit và ciphertext.
> 3. RSA-3 random padding: hai lần mã hoá với padding $< 1/9$ chiều dài $N$ → message bị lộ.
>
> Paper mô tả (heuristic):
>
> 4. Nhiều lần mã hoá RSA-3: padding $< 1/6$ chiều dài $N$ (với đủ nhiều ciphertext).

**Câu hỏi mở quan trọng nhất** (trực tiếp từ §7):

> [!question] Open Problem 1 — Điều kiện cho multivariate case
> Trong điều kiện nào bài toán multivariate small root đảm bảo giải được? Đặc biệt: với **hai biến nhỏ** $t$ và $u$ ở hai block padding riêng biệt (§5, option 1), hiệu quả thực tế là bao nhiêu?

> [!question] Open Problem 2 — Tight bound
> Bound $N^{1/k}$ có tight không? Tức là có phương trình bậc $k$ nào mà mọi thuật toán đều thất bại với $|x_0| = N^{1/k}$? (Câu trả lời cho univariate: theo hướng nào để phân biệt hard case và easy case?)

> [!tip] 💡 Agent note — Hậu duệ của paper
> Câu hỏi mở về multivariate đã được giải một phần bởi Howgrave-Graham (1997), Coppersmith (1997 — bivariate), và sau này Boneh–Durfee (1999) áp dụng cho tấn công RSA với private exponent nhỏ ($d < N^{0.292}$). Đây là một trong những dòng kết quả quan trọng nhất trong công nghệ lattice-based cryptanalysis. Tuy nhiên bài toán multivariate tổng quát vẫn còn nhiều điểm chưa được giải quyết thoả đáng đến tận ngày nay.

---

## Summary

**Tấn công nhiều encryptions (§6)**:

- Cấu trúc: $k+1$ ciphertext → $C(k,2)$ đại lượng $d_{ij}$ và $C(k,3)$ đại lượng $e_{ij\ell}$ → lattice mới → LLL → recover $t_i$ → recover $m$.
- Identity khoá: $d_{ij}c_\ell + d_{j\ell}c_i - d_{i\ell}c_j \equiv e_{ij\ell} \pmod{N}$.
- Bound padding: $\alpha < (k-2)/(6k-3) < 1/6$ — heuristic, không guaranteed.
- Với 14 encryptions trên RSA-1024: chịu được ~150 bit padding.

**Multivariate extension (§3)**:

- Construction tương tự với monomial $x_1^{i_1} \cdots x_m^{i_m}$; điều kiện $\sum \alpha_i < 1/k - \varepsilon$.
- Heuristic vì không đảm bảo có đủ $m$ phương trình độc lập để giải hệ.

**Câu hỏi mở**: điều kiện đủ cho multivariate case; tight bound cho univariate case.

---

## References

- [Cop96] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996
- [FR95] Franklin, Reiter — *A Linear Protocol Failure for RSA with Exponent Three*, Crypto 95 rump session (🟡 dùng trong Lesson 04)
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients*, Math. Ann. 261 (1982) (🔴 Prerequisite)
- [CFPR96] Coppersmith, Franklin, Patarin, Reiter — *Low Exponent RSA with Related Messages*, EUROCRYPT 1996 (⚪ companion paper)
