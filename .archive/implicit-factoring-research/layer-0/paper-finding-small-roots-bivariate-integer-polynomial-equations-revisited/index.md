---
title: "Coron — Bivariate Small Roots"
type: index
tags: [bivariate-small-roots, index]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations Revisited — Jean-Sébastien Coron, Eurocrypt 2004"
created: 2026-03-25
---

Paper của Coron (Eurocrypt 2004) đơn giản hóa thuật toán Coppersmith cho bài toán tìm nghiệm nhỏ của đa thức nguyên hai biến, dùng full-rank triangular lattice để tránh phức tạp của non-full-rank lattice gốc. Course này distill toàn bộ 14 trang paper ở độ sâu research-level với đầy đủ proof.

**Tài liệu gốc**: Finding Small Roots of Bivariate Integer Polynomial Equations Revisited (Coron, Eurocrypt 2004)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-lattice-foundations-key-lemmas|01. Lattice Foundations & Key Lemmas]]

Cover §1, §3.1, §3.2: bức tranh tổng quan (bài toán bivariate, Theorem 2 Coppersmith, vấn đề với non-full-rank lattice), LLL (Theorem 3), Lemma 1 (Howgrave-Graham), Lemma 2+3 (Mignotte-based bounds). Đây là toàn bộ công cụ toán học cần thiết cho thuật toán chính.

### [[02-illustration-delta-1|02. Illustration: The δ=1 Case]]

Cover §2 toàn bộ: walkthrough chi tiết với $p(x,y) = a+bx+cy+dxy$, xây 4×4 triangular lattice, áp dụng LLL, giải thích tại sao bound $XY < W^{1/2}/16$ còn yếu, và preview tại sao cần thêm đa thức (tham số $k$).

### [[03-main-algorithm-theorem-4|03. Main Algorithm: Coron's Theorem 4]]

Cover §4 đầy đủ: proof hoàn chỉnh của Theorem 4 với hai nhóm đa thức shift, full-rank lattice $\omega = (\delta+k+1)^2$, determinant formula (10), bound derivation từ (11) đến (18), exhaustive search trick, và recovery qua resultant. Đây là trung tâm của paper.

### [[04-variants-comparison-extension|04. Variants, Comparison & Extension]]

Cover §5, §6, Theorem 5, Appendix B: phân tích chi tiết tradeoff Coron vs Coppersmith ($W^{2/(3\delta)-\varepsilon}$ vs $W^{2/(3\delta)}$); Theorem 5 với total degree variant (bound $W^{1/\delta-\varepsilon}$) và proof từ Appendix B; heuristic extension sang 3+ biến và vấn đề algebraic independence.

### [[05-rsa-application-experiments|05. RSA Application & Experiments]]

Cover §7, §8, Theorem 6, Appendix C, Figures 2–3: proof đầy đủ Theorem 6 (factor RSA-$N$ biết $(1/4+\varepsilon)\log_2 N$ bits cao của $p$); phân tích thực nghiệm so sánh Coron (dim 36, 20 phút) vs HG (dim 11, 1 giây) trên RSA-1024; ứng dụng trong bug bounty context.

### [[a0-general-case|A0. General Case]]

Cover Appendix A: xử lý $p(0,0)=0$ (shift $p^*(x,y)=p(x+i^*,y)$) và $\gcd(p_{00},XY)\neq 1$ (thay $X,Y$ bằng primes coprime với $p_{00}$ dùng [Mau95]). Hoàn thiện Theorem 4 cho mọi đa thức nguyên bất khả quy.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $p(x,y) = \sum_{i,j} p_{ij} x^i y^j$ | Đa thức nguyên hai biến cần tìm nghiệm | $p(x,y)$ | [[01-lattice-foundations-key-lemmas\|Lesson 01]] |
| $\delta$ | Bậc tối đa theo từng biến | $\delta$ | [[01-lattice-foundations-key-lemmas\|Lesson 01]] |
| $(x_0, y_0)$ | Nghiệm nhỏ cần tìm | $(x_0,y_0)$ | [[01-lattice-foundations-key-lemmas\|Lesson 01]] |
| $X, Y$ | Bounds: $\lvert x_0\rvert \leq X$, $\lvert y_0\rvert \leq Y$ | $X, Y$ | [[01-lattice-foundations-key-lemmas\|Lesson 01]] |
| $W = \lVert p(xX,yY) \rVert_\infty$ | Scaled infinity norm = $\max_{i,j} \lvert p_{ij}\rvert X^i Y^j$ | $W$ | [[01-lattice-foundations-key-lemmas\|Lesson 01]] |
| $\omega = (\delta+k+1)^2$ | Số chiều lattice | $\omega$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $k \geq 0$ | Tham số lattice — kiểm soát precision/runtime tradeoff | $k$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $n = u \cdot (XY)^k$ | Modulus auxiliary | $n$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $q(x,y)$ | $= p_{00}^{-1} p(x,y) \bmod n$, normalized polynomial | $q(x,y)$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $q_{ij}(x,y)$ | Shift polynomials (Nhóm A hoặc B) | $q_{ij}$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $\tilde{q}_{ij}(x,y) = q_{ij}(xX,yY)$ | Scaled version | $\tilde{q}_{ij}$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $L$ | Full-rank triangular lattice | $L$ | [[02-illustration-delta-1\|Lesson 02]] |
| $h(x,y)$ | Short polynomial từ LLL (tổ hợp nguyên của $q_{ij}$) | $h(x,y)$ | [[02-illustration-delta-1\|Lesson 02]] |
| $\varepsilon > 0$ | Precision parameter; $k = \lfloor 1/\varepsilon \rfloor$ | $\varepsilon$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $\alpha, \beta$ | Exponents trong bound $XY < 2^{-\beta} W^\alpha$ | $\alpha, \beta$ | [[03-main-algorithm-theorem-4\|Lesson 03]] |
| $Q(x) = \text{Resultant}_y(h,p)$ | Univariate polynomial thoả $Q(x_0)=0$ | $Q(x)$ | [[02-illustration-delta-1\|Lesson 02]] |
| $\delta_{\text{tot}}$ | Tổng bậc (total degree) — dùng trong Theorem 5 | $\delta$ (total) | [[04-variants-comparison-extension\|Lesson 04]] |
| $p_0, q_0$ | Phần đã biết (high bits) của $p, q$ trong RSA attack | $p_0, q_0$ | [[05-rsa-application-experiments\|Lesson 05]] |
| $p^*(x,y) = p(x+i^*,y)$ | Shifted polynomial khi $p(0,0)=0$ | $p^*$ | [[a0-general-case\|A0]] |
| $X', Y'$ | Primes thay thế $X,Y$ khi $\gcd(p_{00},XY)\neq 1$ | $X', Y'$ | [[a0-general-case\|A0]] |

---

## References

### 🟡 Integrated

- [Cop96a] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, Eurocrypt 1996 — integrated in Lesson 01: Theorem 1
- [Cop97] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 — integrated in Lessons 01, 02, 03, 04: Theorem 2 (bound target), comparison
- [HG97] Howgrave-Graham — *Finding small roots of univariate modular equations revisited*, Cryptography and Coding 1997 — integrated in Lessons 01, 02, 03, 05: Lemma 1 + runtime comparison
- [Mig74] Mignotte — *An inequality about factors of polynomials*, Math Comp. 1974 — integrated in Lesson 01: basis của Lemma 2
- [Mau95] Maurer — *Fast Generation of Prime Numbers*, J. Cryptology 1995 — integrated in A0: prime generation cho coprimeness fix

### 🔴 Prerequisites

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, Math. Ann. 1982 — LLL algorithm background
- [Cop97] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 — original bivariate algorithm (đọc để so sánh)

### ⚪ Citations only

- [BonDur99] Boneh, Durfee — *Cryptanalysis of RSA with private key d < N^0.292*, Eurocrypt 1999
- [BDH99] Boneh, Durfee, Howgrave-Graham — *Factoring n=p^r*q for large r*, Crypto 1999
- [Cop01] Coppersmith — *Finding small solutions to small degree polynomials*, CALC 2001
- [Jut98] Jutla — *On finding small solutions of modular multivariate polynomial equations*, Eurocrypt 1998
- [Mau95] Maurer — *Fast Generation of Prime Numbers*, J. Cryptology 1995
- [NguSte01] Nguyen, Stern — *The two faces of lattices in cryptology*, CALC 2001
- [Sho01] Shoup — *OAEP reconsidered*, Crypto 2001
- [ShoNTL] Shoup — *NTL library version 5.3.1*
