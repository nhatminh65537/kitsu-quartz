---
title: "Approximate Integer Common Divisors"
type: index
tags: [approximate-gcd, lattice-attacks, acdp, index]
source: "Approximate Integer Common Divisors — Nick Howgrave-Graham, CaLC 2001"
created: 2026-03-25
---

Paper của Howgrave-Graham (CaLC 2001) tổng quát hóa các kỹ thuật lattice của Coppersmith và Boneh-Durfee sang bài toán tìm ước chung chung của hai số nguyên chỉ được biết gần đúng — **Approximate Common Divisor Problem (ACDP)**. Course này distill toàn bộ 7 sections của paper, từ định nghĩa bài toán đến các thuật toán lattice và ứng dụng phá vỡ cryptosystem Okamoto.

**Tài liệu gốc**: Approximate Integer Common Divisors — Howgrave-Graham, LNCS 2146, pp. 51–66, 2001  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-acdp-framework|01. ACDP Framework & Algorithm Definitions]]

Giới thiệu bài toán ACDP, phân biệt hai dạng PACDP và GACDP, định nghĩa chính xác cả bốn thuật toán (Alg. 11–14) cùng hệ tham số α, β, M, X. Trình bày ứng dụng tấn công Okamoto cryptosystem như động lực.

### [[02-continued-fraction-acdp|02. Continued Fraction Attack on ACDP]]

Phương pháp phân số liên tiếp (continued fraction) để giải PACDP và GACDP. Distill Theorem 21 về convergents, chứng minh sự tồn tại của PACD_CF và GACD_CF, phân tích bound β < 2α − 1 và liên hệ với Wiener's attack.

### [[03-lattice-pacdp|03. Lattice Attack on PACDP]]

Reformulate PACDP thành bài toán small root; xây dựng lattice từ $p_i(x) = (a_0+x)^{u-i}b_0^i$; tính determinant $\Delta$; tối ưu $h \approx u/\alpha_0$ để đạt bound chính $\beta_0 < \alpha_0^2$ — hoạt động với mọi $\alpha \in (0,1)$. Kết nối với factoring known-bits và attack Okamoto.

### [[04-lattice-gacdp|04. Lattice Attack on GACDP]]

Extension sang bivariate polynomials $p_i(x,y) = (a_0+x)^{u-i}(b_0+y)^i$; kỹ thuật row-norm estimation; tính determinant non-square; optimal $\gamma^*$ → bound heuristic $\beta_0 < 1 - \alpha_0/2 - \sqrt{1-\alpha_0-\alpha_0^2/2}$. Figure 61 và Table 1 thực nghiệm.

### [[05-applications-results|05. Applications, Results & Open Problems]]

Small inverse problem ("= 1") vs PACDP ("= 0"): liên hệ và tại sao bound Boneh-Durfee $1-1/\sqrt{2}$ có thể là barrier tự nhiên. Tổng hợp Figure 61 và Table 1. Bảy open problems từ paper — trong đó algebraic independence và applications (FHE sau 2010) là nổi bật nhất.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $a, b$ | Hai số nguyên có ước chung lớn | $a, b$ | [[01-acdp-framework\|Lesson 01]] |
| $d$ | Ước chung lớn cần tìm | $d$ | [[01-acdp-framework\|Lesson 01]] |
| $a_0, b_0$ | Xấp xỉ (approximations) của $a, b$ | $a_0, b_0$ | [[01-acdp-framework\|Lesson 01]] |
| $x_0, y_0$ | Sai số: $x_0 = a - a_0$, $y_0 = b - b_0$ | $x_0, y_0$ | [[01-acdp-framework\|Lesson 01]] |
| $X, Y$ | Giới hạn trên của $\|x_0\|, \|y_0\|$ | $X, Y$ | [[01-acdp-framework\|Lesson 01]] |
| $\alpha$ | $\log_{b_0} d$ — kích thước tương đối của divisor | $\alpha \in (0\ldots 1)$ | [[01-acdp-framework\|Lesson 01]] |
| $\alpha_0$ | Lower bound đã biết cho $\alpha$ | $\alpha_0$ | [[01-acdp-framework\|Lesson 01]] |
| $\beta$ | $\log_{b_0} X$ — kích thước tương đối của error | $\beta$ | [[01-acdp-framework\|Lesson 01]] |
| $\beta_0$ | Giá trị $\beta$ được dùng trong lattice algorithms | $\beta_0$ | [[01-acdp-framework\|Lesson 01]] |
| $M$ | Lower bound trên $d$: $M = b_0^{\alpha_0}$ | $M$ | [[01-acdp-framework\|Lesson 01]] |
| $\varepsilon$ | Slack parameter nhỏ trong lattice bounds | $\varepsilon$ | [[01-acdp-framework\|Lesson 01]] |
| $g_i/h_i$ | Convergents của continued fraction expansion | $g_i/h_i$ | [[02-continued-fraction-acdp\|Lesson 02]] |
| $\rho$ | Số thực được xấp xỉ bởi continued fraction | $\rho$ | [[02-continued-fraction-acdp\|Lesson 02]] |

---

## References

### 🟡 Integrated

- [5] Howgrave-Graham — *Factoring with the Help of an Oracle*, PhD Thesis 1999 — integrated in Lesson 01 & 03: kỹ thuật lattice PACDP
- [11] Okamoto — *Fast public-key cryptosystem using congruent polynomials*, 1986 — integrated in Lesson 01: cryptosystem bị phá vỡ
- [15] Wiener — *Cryptanalysis of short RSA secret exponents*, IEEE Trans. 1990 — integrated in Lesson 02: continued fraction attack on RSA
- [3] Boneh & Durfee — *Cryptanalysis of RSA with d < N^{0.292}*, 2000 — integrated in Lesson 05: small inverse problem & bound comparison
- [1] Coppersmith — *Small root of bivariate integer equation*, Eurocrypt'96 — integrated in Lesson 03: lattice technique source

### 🔴 Prerequisites

- [8] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, 1982 — LLL algorithm (black box)
- [6] Hardy & Wright — *An Introduction to the Theory of Numbers* — nền tảng số học

### ⚪ Citations only

- [2] Boneh — *Twenty years of attacks on the RSA cryptosystem*, 1999
- [4] Boneh-Durfee EUROCRYPT'99 (earlier version of [3])
- [9] Manders & Adleman — *NP-complete decision problem for quadratics*, 1978
- [10] Nguyen & Stern — *Lattice reduction in cryptology: An update*, 2000
- [12] Schnorr — *A hierarchy of polynomial time lattice bases reduction algorithms*, 1987
- [13] Shoup — NTL Library (implementation tool)
- [14] Vallée, Girault, Toffin — Eurocrypt '88
