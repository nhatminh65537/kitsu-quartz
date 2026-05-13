---
title: "Linear Equations Modulo Unknown Divisors"
type: index
tags: [linear-equations-unknown-divisors, lattice, rsa-cryptanalysis, index]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

Paper của Lu, Zhang, Lin (SKLOIS/IIE, CAS) tổng quát hóa kỹ thuật Herrmann–May để giải phương trình tuyến tính $f(x_1,\ldots,x_n) \equiv 0 \pmod{p^v}$ với $p$ ẩn và $p^u \mid N$ đã biết, áp dụng vào tấn công RSA multi-power và weak encryption exponents với các kết quả tốt nhất hiện tại.

**Tài liệu gốc**: New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-problem-setting-lattice-preliminaries|01. Problem Setting & Lattice Preliminaries]]

Giới thiệu hai bài toán trung tâm (First Variant và Second Variant), lịch sử từ Howgrave-Graham → Herrmann–May → paper này, và nền tảng lattice gồm Lemma 1 (LLL bound) và Lemma 2 (Howgrave-Graham lifting). Phác thảo chiến lược 4 bước chung của toàn paper.

### [[02-first-variant-generalized-linear-equations|02. First Variant: Generalized Linear Equations]]

Trình bày kỹ thuật lattice construction cho First Variant: polynomial collection $g_k = f^k \cdot N^{\lceil v(t-k)/u \rceil}$, tính $\det(L)$, tối ưu $\tau^* = u\beta$. Theorem 1: bound $\gamma < uv\beta^2$; Theorem 2: arbitrary degree $\delta$; Theorem 3 (statement): $n$-variable với Assumption 1.

### [[03-multi-power-rsa-attacks|03. Multi-Power RSA Attacks]]

Áp dụng Theorem 1 vào multi-power RSA $N = p^r q$: Theorem 4 (small secret exponent $d < N^{r(r-1)/(r+1)^2}$), Theorem 5 (MSB partial key exposure), Theorem 6 (LSB partial key exposure). So sánh bound với May [12] và Sarkar [17]; bảng thực nghiệm Magma.

### [[04-second-variant-homogeneous-linear-equations|04. Second Variant: Homogeneous Linear Equations]]

Trình bày Second Variant: polynomial collection $g_k = x_2^{m-k} f^k N^{e_k}$ khai thác cấu trúc thuần nhất. Theorem 7: bound $\gamma_1 + \gamma_2 < uv\beta^2$, root extraction qua Bézout's theorem. So sánh với Herrmann–May [6] (0.25 vs 0.207) và Castagnos et al. [2] (ưu việt với unbalanced bounds). Theorem 8 (n-variable, statement).

### [[05-weak-encryption-exponent-attacks|05. Weak Encryption Exponent Attacks]]

Áp dụng Theorem 7 vào ba dạng tấn công: Theorem 9 (weak encryption exponents RSA, $\gamma+\delta \leq 0.25$), Theorem 10 (CRT-RSA, $d_p < N^{0.375}/\sqrt{e}$ khi $e < N^{0.75}$), Theorem 11 (CRT-RSA trên Takagi $N=p^r q$, $\delta < r\beta^2 + \beta - \alpha/2$). Bảng thực nghiệm Magma.

### [[a0-n-variable-extensions|A0. N-Variable Extensions]]

Proof đầy đủ của Theorem 3 (First Variant, $n$ biến) và Theorem 8 (Second Variant, $n$ biến): tính dimension $d = \binom{m+n}{n}$, exponent tổng $s_{x_i}$, $s_N$ bằng asymptotic combinatorics, tối ưu $\tau^*$. Bảng tóm tắt tham số tối ưu và verify consistency với $n=1,2$.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N$ | Composite modulus đã biết | $N$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $p$ | Ước số ẩn của $N$ | $p$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $\beta$ | $p \geq N^\beta$ | $\beta$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $u$ | $p^u \mid N$ (multiplicity đã biết) | $u$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $v$ | Modulus ẩn $p^v$ cần giải mod | $v$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $\gamma$ | Log-bound của nghiệm: $\|y\| \leq N^\gamma$ | $\gamma$ | [[01-problem-setting-lattice-preliminaries\|Lesson 01]] |
| $m$ | Lattice construction parameter | $m$ | [[02-first-variant-generalized-linear-equations\|Lesson 02]] |
| $\tau$ | $t = \tau m$ (tỉ lệ parameter) | $\tau$ | [[02-first-variant-generalized-linear-equations\|Lesson 02]] |
| $L$ | Lattice được construct | $L$ | [[02-first-variant-generalized-linear-equations\|Lesson 02]] |
| $\det(L)$ | Determinant của lattice | $\det(L)$ | [[02-first-variant-generalized-linear-equations\|Lesson 02]] |
| $r$ | Exponent trong $N = p^r q$ | $r$ | [[03-multi-power-rsa-attacks\|Lesson 03]] |
| $\delta$ | $d \approx N^\delta$ (exponent bí mật) | $\delta$ | [[03-multi-power-rsa-attacks\|Lesson 03]] |

*(Cập nhật sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [6] Herrmann & May — *Solving linear equations modulo divisors: On factoring given any bits*, Asiacrypt 2008 — integrated in Lessons 01, 02, 04
- [7] Howgrave-Graham — *Finding small roots of univariate modular equations revisited*, 1997 — Lemma 2, integrated in Lesson 01
- [8] Howgrave-Graham — *Approximate integer common divisors*, 2001 — integrated in Lessons 01, 02
- [11] May — *New RSA vulnerabilities using lattice reduction methods*, PhD thesis 2003 — integrated in Lesson 04
- [12] May — *Secret exponent attacks on RSA-type schemes with moduli N = p^r q*, PKC 2004 — integrated in Lesson 03
- [13] May — *Using LLL-reduction for solving RSA and factorization problems*, 2010 — integrated in Lesson 02
- [14] Nitaj — *A new attack on RSA and CRT-RSA*, Africacrypt 2012 — integrated in Lesson 05
- [16] Sarkar — *Reduction in lossiness of RSA trapdoor permutation*, 2012 — integrated in Lesson 05
- [17] Sarkar — *Small secret exponent attack on RSA variant with modulus N = p^r q*, 2014 — integrated in Lesson 03
- [19] Takagi — *Fast RSA-type cryptosystem modulo p^k q*, Crypto 1998 — integrated in Lessons 01, 03
- [2] Castagnos, Joux, Laguillaumie, Nguyen — *Factoring pq^2 with quadratic forms*, Asiacrypt 2009 — integrated in Lesson 04

### 🔴 Prerequisites

- [3] Coppersmith — *Small solutions to polynomial equations, and low exponent RSA vulnerabilities*, J. Cryptology 1997
- [10] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, 1982 (LLL algorithm)

### ⚪ Citations only

- [1] Boneh & Durfee — *Cryptanalysis of RSA with private key d less than N^0.292*, 2000
- [4] EPOC/ESIGN — IEEE P1363, 1998
- [5] Ernst et al. — *Partial key exposure attacks on RSA up to full size exponents*, EUROCRYPT 2005
- [9] Joux — *Algorithmic cryptanalysis*, Chapman & Hall/CRC 2009
- [15] Okamoto & Uchiyama — *A new public-key cryptosystem as secure as factoring*, Eurocrypt 1998
- [18] Shamir — *A polynomial time algorithm for breaking the basic Merkle-Hellman cryptosystem*, 1982
- [20] Van Dijk et al. — *Fully homomorphic encryption over the integers*, EUROCRYPT 2010
- [21] Magma — Bosma, Cannon, Playoust, 1997
