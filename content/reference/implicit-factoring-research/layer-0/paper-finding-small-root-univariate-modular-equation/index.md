---
title: "Coppersmith Small Root (Univariate)"
type: index
tags: [coppersmith, lattice, rsa-attacks, index]
source: "Finding a Small Root of a Univariate Modular Equation — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

Paper của Coppersmith (EUROCRYPT 1996) trình bày thuật toán đột phá tìm nghiệm nguyên nhỏ của đa thức bậc $k$ modulo $N$ composite với bound $|x_0| < N^{1/k}$, dựa trên LLL lattice basis reduction. Course này distill toàn bộ nội dung — từ xây dựng lattice đến hai ứng dụng tấn công RSA với số mũ nhỏ.

**Tài liệu gốc**: Finding a Small Root of a Univariate Modular Equation — Coppersmith, EUROCRYPT '96, LNCS 1070  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-problem-formulation|01. Problem Formulation & Strategy]]

Đặt bài toán Small Root Problem chính thức, giải thích tại sao bài toán hard khi không biết factorization của $N$, và phác hoạ chiến lược 3 bước (họ đa thức $q_{ij}$ → lattice $M$ → LLL → polynomial trên $\mathbb{Z}$). Cover §1 và hai ứng dụng RSA preview.

### [[02-lattice-construction-matrix-m|02. Lattice Construction: Matrix M]]

Xây dựng chi tiết ma trận $M$ kích thước $(2hk-k)^2$ từ họ đa thức $q_{ij}(x) = x^i p(x)^j$, chứng minh $\det(M) > 2^{(hk)(hk-1)/4}$, và xác định vector ngắn $\mathbf{r}$ ứng với nghiệm $x_0$ có chuẩn $< 1$.

### [[03-lll-analysis-correctness|03. LLL Analysis & Correctness Proof]]

Phân tích LLL đầy đủ: block reduction về $\hat{M}$, lower bound $|\mathbf{b}_n^*| > 1$, nhốt vector ngắn vào subspace $n-1$ chiều, trích polynomial trên $\mathbb{Z}$. Chứng minh Theorem 1 và Corollary 2. So sánh với Vallée et al. [VGT88].

### [[04-rsa-attacks-stereotyped-random-padding|04. RSA Attacks: Stereotyped Messages & Random Padding]]

Hai tấn công RSA-$e=3$ cụ thể: (1) stereotyped messages — biết phần cố định $B$ và ciphertext, recover phần bí mật $m < N^{1/3}$ bằng Coppersmith; (2) random padding — hai encryption cùng message cho resultant bậc 9, giải với bound $|\Delta t| < N^{1/9}$, dùng Franklin–Reiter để finish. Cover §4, §5 và các biện pháp phòng thủ.

### [[05-multiple-encryptions-multivariate|05. Multiple Encryptions, Multivariate Extension & Open Problems]]

Tấn công heuristic với $k+1$ lần mã hoá: lattice từ $d_{ij} = t_it_j(t_i-t_j)$ và $e_{ij\ell}$, bound padding $\alpha < (k-2)/(6k-3) < 1/6$; với 14 encryptions RSA-1024 chịu ~150 bit padding. Extension multivariate (heuristic, §3) và câu hỏi mở về điều kiện đủ cho multivariate case. Cover §3, §6, §7.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N$ | Hợp số lớn chưa biết phân tích | $N$ | [[01-problem-formulation\|Lesson 01]] |
| $p(x)$ | Đa thức monic bậc $k$ hệ số nguyên | $p(z)$ (paper dùng $z$) | [[01-problem-formulation\|Lesson 01]] |
| $x_0$ | Nghiệm nguyên cần tìm | $z_0$ | [[01-problem-formulation\|Lesson 01]] |
| $k$ | Bậc của đa thức | $k$ | [[01-problem-formulation\|Lesson 01]] |
| $\varepsilon$ | Tham số sai số $\varepsilon > 0$ | $\varepsilon$ | [[01-problem-formulation\|Lesson 01]] |
| $X$ | Giới hạn trên $\frac{1}{2}N^{(1/k)-\varepsilon}$ | $X$ | [[01-problem-formulation\|Lesson 01]] |
| $h$ | Tham số điều khiển họ đa thức helper | $h$ | [[02-lattice-construction-matrix-m\|Lesson 02]] |
| $q_{ij}(x)$ | Đa thức helper $x^i p(x)^j$ | $q_{ij}(z)$ | [[02-lattice-construction-matrix-m\|Lesson 02]] |
| $y_0$ | Thương $p(x_0)/N$ (nguyên) | $y_0$ | [[02-lattice-construction-matrix-m\|Lesson 02]] |
| $\gamma(i,j)$ | Index cột: $hk + i + (j-1)k$ | $\gamma(i,j)$ | [[02-lattice-construction-matrix-m\|Lesson 02]] |
| $M$ | Ma trận lattice $(2hk-k)^2$ | $M$ | [[02-lattice-construction-matrix-m\|Lesson 02]] |
| $\hat{M}$ | Block reduced form $hk \times hk$ | $\hat{M}$ | [[03-lll-analysis-correctness\|Lesson 03]] |
| $n$ | Chiều lattice $n = hk$ | $n$ | [[03-lll-analysis-correctness\|Lesson 03]] |
| $\mathbf{b}_1, \ldots, \mathbf{b}_n$ | LLL-reduced row basis của $\hat{M}$ | $b_1, \ldots, b_n$ | [[03-lll-analysis-correctness\|Lesson 03]] |
| $\mathbf{b}_n^*$ | GS component của $\mathbf{b}_n$ | $b_n^*$ | [[03-lll-analysis-correctness\|Lesson 03]] |
| $f_0, \ldots, f_{hk-1}$ | Hệ số polynomial equation trên $\mathbb{Z}$ | $f_g$ | [[03-lll-analysis-correctness\|Lesson 03]] |
| $e$ | RSA public exponent | $e$ | [[04-rsa-attacks-stereotyped-random-padding\|Lesson 04]] |
| $m$ | Plaintext message cần recover | $m$ | [[04-rsa-attacks-stereotyped-random-padding\|Lesson 04]] |
| $B$ | Phần đã biết của plaintext (stereotyped) | $B$ | [[04-rsa-attacks-stereotyped-random-padding\|Lesson 04]] |
| $t, t_i$ | Padding value | $t, t_1, t_2$ | [[04-rsa-attacks-stereotyped-random-padding\|Lesson 04]] |
| $d_{ij}$ | $t_i t_j(t_i - t_j)$ | $d_{ij}$ | [[05-multiple-encryptions-multivariate\|Lesson 05]] |
| $e_{ij\ell}$ | $-t_i t_j t_\ell(t_i-t_j)(t_j-t_\ell)(t_\ell-t_i)$ | $e_{ij\ell}$ | [[05-multiple-encryptions-multivariate\|Lesson 05]] |
| $\alpha$ | Padding bound exponent: $\|t_i\| \leq \frac{1}{2}N^\alpha$ | $\alpha$ | [[05-multiple-encryptions-multivariate\|Lesson 05]] |

---

## References

### 🟡 Integrated

- [VGT88] Vallée, Girault, Toffin — *How to Guess ℓ-th Roots Modulo n by Reducing Lattice Bases*, AAECC-6 1988 — integrated in [[03-lll-analysis-correctness\|Lesson 03]]: bound comparison $N^{2/[k(k+1)]}$ vs $N^{1/k}$
- [FR95] Franklin, Reiter — *A Linear Protocol Failure for RSA with Exponent Three*, Crypto 95 rump session — integrated in [[04-rsa-attacks-stereotyped-random-padding\|Lesson 04]]: recovery formula cho $m$

### 🔴 Prerequisites

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients*, Math. Ann. 261 (1982) — LLL algorithm background

### ⚪ Citations only

- [CFPR96] Coppersmith, Franklin, Patarin, Reiter — *Low Exponent RSA with Related Messages*, EUROCRYPT 1996
