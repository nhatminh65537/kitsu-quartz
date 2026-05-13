---
title: "Strategy for Multivariate Roots & RSA Attacks"
type: index
tags: [coppersmith, lattice, rsa-attack, index]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

Paper của Jochemsz và May (ASIACRYPT 2006) đề xuất một chiến lược heuristic tổng quát để tìm nghiệm nhỏ của đa thức nhiều biến qua lattice — thống nhất nhiều kết quả Coppersmith đã biết và tấn công hai biến thể RSA mới: Qiao-Lam và Common Prime RSA. Course này cover toàn bộ paper từ nền tảng toán học đến attack với thực nghiệm.

**Tài liệu gốc**: Jochemsz & May — ASIACRYPT 2006, LNCS 4284, pp. 267–282  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-howgrave-graham-lll|01. Howgrave-Graham & LLL: Công cụ nền]]

Cover §1 (motivation, RSA example) và §2 (opening tools). Trình bày Lemma 1 (Howgrave-Graham: điều kiện đủ để nghiệm modular thành nghiệm nguyên) và Fact 1 (LLL: bound trên shortest vector). Kết hợp hai công cụ thành điều kiện determinant $\det(L) \leq N^{\omega+1-i}$ — nền tảng cho toàn bộ chiến lược.

### [[02-modular-roots-strategy|02. Chiến lược tìm nghiệm Modular nhỏ]]

Cover §2.1 đầy đủ (Basic + Extended Strategy). Định nghĩa tập $M_k$, shift polynomials $g_{i_1 \cdots i_n}$, và cách xây lattice lower-triangular. Rút ra điều kiện bound tổng quát $\prod_j X_j^{s_j} < N^{s_N}$ và giải thích example $f_N(x,y) = 1 + xy^2 + x^2y$ step-by-step. Extended Strategy với $t = \tau m$ extra shifts.

### [[03-integer-roots-strategy|03. Chiến lược tìm nghiệm Nguyên nhỏ]]

Cover §2.2 đầy đủ (Basic + Extended Strategy, integer case). Coron's reformulation tạo modulus nhân tạo $R = W\prod X_j^{l_j}$; hai loại shift polynomials $g$ (dùng $f'$) và $g'$ (dùng $R$); điều kiện bound $\prod X_j^{s_j} < W^{|S|}$. Hinek-Stinson Corollary 5 đảm bảo $h_i$ algebraically independent với $f$. Provably correct với $n=2$; heuristic với $n \geq 3$.

### [[04-trivariate-bound|04. Bound cho đa thức ba biến]]

Cover §3: áp dụng Extended Strategy cho $f(x,y,z) = a_0 + a_1x + a_2x^2 + \ldots + a_7yz$. Tính tường minh membership conditions của $S$ và $M$, exponent sums $s_x=(7/3+3\tau+\tau^2)m^3$, $s_y=s_z=(5/3+3\tau/2)m^3$, $|S|=(1+\tau)m^3$. Bound cuối: $X^{7+9\tau+3\tau^2}(YZ)^{5+9\tau/2} < W^{3+3\tau-\epsilon}$.

### [[05-attack-rsa-crt|05. Tấn công RSA-CRT với Known Difference]]

Cover §4.1–§4.2 và Theorem 1. Xây dựng polynomial từ RSA-CRT relations; bounds $X=N^\delta$, $Y=Z=N^{\delta+1/2}$, $W=N^{2+2\delta}$; tối ưu $\tau_{\text{opt}}=(1/2-4\delta)/(2\delta)$; rút ra $\delta < (4-\sqrt{13})/4 \approx 0.099$. Phá vỡ Qiao-Lam 96-bit exponents. Experiments table ($m=2$, dim$=54$) validate heuristic.

### [[06-attack-common-prime-rsa|06. Tấn công Common Prime RSA]]

Cover §5.1–§5.2 và Theorem 2. Xây dựng polynomial ba biến $f(x,y,z)=e^2x^2+ex(y+z-2)-(y+z-1)-(N-1)yz$ với nghiệm $(d,ka,kb)$ — cải tiến từ cách tiếp cận bốn biến của Hinek. Bounds $X=N^\delta$, $Y=Z=N^{\delta+1/2-\gamma}$, $W=N^{2+2\delta-2\gamma}$; tối ưu $\tau_{\text{opt}}=(1/2+\gamma-4\delta)/(2\delta)$; Theorem 2: $\delta < \frac{1}{4}(4+4\gamma-\sqrt{13+20\gamma+4\gamma^2})$.

### [[07-known-results-unification|07. Các kết quả đã biết như Special Cases]]

Cover Appendix A và B đầy đủ. Chứng minh Boneh-Durfee [1], Blömer-May [2][3], Ernst et al. [8], Generalized Rectangle/Lower Triangle [6] đều là special cases của Basic/Extended Strategy với $M_k$ hoặc $S/M$ tương ứng. Bảng tổng hợp và phân tích ý nghĩa thống nhất của framework.

*(Hoàn tất — 7/7 lessons.)*

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N$ | RSA modulus (composite, unknown factorization) | $N$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $n$ | Số biến của đa thức | $n$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $\omega$ | Số monomial của đa thức sau scale | $\omega$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $\lVert \cdot \rVert$ | Euclidean norm của vector hệ số | $\lVert \cdot \rVert$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $X_j$ | Bound trên của biến $x_j^{(0)}$: $\lvert x_j^{(0)} \rvert < X_j$ | $X_j$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $L$ | Lattice xây từ shift polynomials | $L$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $\det(L)$ | Determinant của lattice $L$ | $\det(L)$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $\epsilon$ | Arbitrarily small error constant | $\epsilon$ | [[01-howgrave-graham-lll\|Lesson 01]] |
| $f_N$ | Đa thức cần tìm nghiệm modulo $N$ | $f_N$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $l$ | Leading monomial của $f_N$ | $l$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $f'_N$ | $a_l^{-1} f_N \bmod N$ (chuẩn hóa) | $f'_N$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $M_k$ | Tập monomial thứ $k$ trong chiến lược | $M_k$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $m$ | Tham số cố định phụ thuộc $1/\epsilon$ | $m$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $t$ | Số extra shifts ($t = \tau m$) | $t$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $s_j$ | $\sum_{x^i \in M_0} i_j$ — mũ tổng của $x_j$ | $s_j$ | [[02-modular-roots-strategy\|Lesson 02]] |
| $s_N$ | $\sum_{k=1}^m \lvert M_k \rvert$ | $s_N$ | [[02-modular-roots-strategy\|Lesson 02]] |

| $f$ | Đa thức nguyên bất khả quy (integer roots case) | $f$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $d_j$ | Bậc tối đa của $x_j$ trong $f$ | $d_j$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $W$ | $\lVert f(x_1 X_1,\ldots) \rVert_\infty$ — hệ số tối đa sau scale | $W$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $R$ | Modulus nhân tạo: $W\prod X_j^{l_j}$ | $R$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $S$ | Tập monomial của $f^{m-1}$ (integer strategy) | $S$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $M$ | Tập monomial của $x^i \cdot f$ với $x^i \in S$ | $M$ | [[03-integer-roots-strategy\|Lesson 03]] |
| $\tau$ | $t = \tau m$ — tỉ lệ extra $x$-shifts | $\tau$ | [[04-trivariate-bound\|Lesson 04]] |
| $d_p, d_q$ | CRT exponents: $d_p \equiv d \pmod{p-1}$, $d_q \equiv d \pmod{q-1}$ | $d_p, d_q$ | [[05-attack-rsa-crt\|Lesson 05]] |
| $\bar{c}$ | Known difference: $\bar{c} = d_p - d_q$ | $\bar{c}$ | [[05-attack-rsa-crt\|Lesson 05]] |
| $\delta$ | Bitsize exponent: $\max\{d_p, d_q\} \approx N^\delta$ | $\delta$ | [[05-attack-rsa-crt\|Lesson 05]] |

| $g$ | Large prime factor chung của $p-1$ và $q-1$ (Common Prime RSA) | $g$ | [[06-attack-common-prime-rsa\|Lesson 06]] |
| $\gamma$ | $g = N^\gamma$ — bitsize exponent của $g$ | $\gamma$ | [[06-attack-common-prime-rsa\|Lesson 06]] |
| $D$ | Bậc tổng quát trong Generalized bounds | $D$ | [[07-known-results-unification\|Lesson 07]] |
| $\lambda_i$ | $\deg_{x_i}(f) = \lambda_i D$ — tỉ lệ bậc | $\lambda_i$ | [[07-known-results-unification\|Lesson 07]] |

*(Hoàn tất — notation table đầy đủ.)*

---

## References

### 🟡 Integrated

- [1] Boneh, Durfee — *Cryptanalysis of RSA with Private Key d Less Than N^{0.292}*, IEEE TIT 2000 — integrated in Lesson 01 (example §1), Lesson 02 (Appendix A special case), Lesson 07
- [3] Blömer, May — *A Tool Kit for Finding Small Roots of Bivariate Polynomials over the Integers*, EUROCRYPT 2005 — integrated in Lesson 03, Lesson 07
- [6] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 — integrated in Lesson 07 (Generalized Rectangle + Lower Triangle)
- [7] Coron — *Finding Small Roots of Bivariate Integer Equations Revisited*, EUROCRYPT 2004 — integrated in Lesson 03
- [9] Hinek — *Another Look at Small RSA Exponents*, CT-RSA 2006 — integrated in Lesson 06
- [10] Hinek, Stinson — *An Inequality About Factors of Multivariate Polynomials*, 2006 — integrated in Lesson 03
- [11] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, LNCS 1355, 1997 — Lemma 1, integrated in Lesson 01
- [17] Qiao, Lam — *RSA Signature Algorithm for Microcontroller Implementation*, CARDIS 2000 — integrated in Lesson 05

### 🔴 Prerequisites

- [4] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996
- [5] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, EUROCRYPT 1996
- [13] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982
- [19] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE TIT 1990

### ⚪ Citations only

- [2] Blömer, May — *New Partial Key Exposure Attacks on RSA*, CRYPTO 2003
- [8] Ernst, Jochemsz, May, de Weger — *Partial Key Exposure Attacks up to Full Size Exponents*, EUROCRYPT 2005
- [12] Lim, Lee — *Security and performance of server-aided RSA*, CRYPTO 1995
- [14] May — *New RSA Vulnerabilities Using Lattice Reduction Methods*, PhD Thesis 2003
- [15] McKee, Pinch — *Further attacks on server-aided RSA cryptosystems*, 1998
- [16] Nguyen, Stehlé — *Floating-Point LLL Revisited*, EUROCRYPT 2005
- [18] Shoup — *NTL: A Library for doing Number Theory*
