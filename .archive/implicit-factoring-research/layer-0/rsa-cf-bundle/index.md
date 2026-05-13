---
title: "RSA Cryptanalysis: Combining Continued Fractions and Coppersmith"
type: index
tags: [rsa-cryptanalysis, continued-fractions, coppersmith, index]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

Paper này trình bày một tấn công cải thiện vào RSA với private exponent nhỏ bằng cách kết hợp phân số liên tục và kỹ thuật lattice Coppersmith, đạt bound $d < N^{1-\alpha/3-\gamma/2}$ vượt trội Herrmann–May. Course này distill toàn bộ nội dung paper thành 7 lessons theo thứ tự từ nền tảng toán học đến main attack, ứng dụng, và thực nghiệm.

**Tài liệu gốc**: Improving RSA Cryptanalysis — ACISP 2025 (full version)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-continued-fractions-rsa|01. Continued Fractions & Legendre's Theorem trong RSA]]

Xây dựng toàn bộ cơ sở toán học của phân số liên tục cho RSA: Euler-Wallis recurrence, interleaving inequality, Legendre's criterion (Theorem 1), relation (2) cho common convergents, và Lemma 6 — nền tảng cho Wiener's attack và main attack.

### [[02-coppersmith-lattice-strategy|02. Coppersmith's Lattice Strategy & Howgrave-Graham]]

Trình bày framework lattice-based attack: LLL output bound (Lemma 1), Howgrave-Graham lemma nâng nghiệm mô-đun lên nghiệm nguyên (Lemma 2), Assumption 1 về algebraic independence, và 4-step lattice solving strategy với tối ưu hóa tham số.

### [[03-wiener-attack-optimality|03. Wiener's Attack: Optimality và Giới Hạn]]

Phân tích tấn công Wiener, điều kiện để $k/d$ là common convergent của $e/N$ và $e/\varphi(N)$ (Theorems 2–3), và chứng minh Wiener gần tối ưu khi $e \approx N$: CF thuần túy không thể phá RSA nếu $d > N^{1/4}$ (Theorem 4).

### [[04-herrmann-may-attack|04. Herrmann–May Attack]]

Trình bày đầy đủ Theorem 5: reformulate phương trình khóa RSA thành $f(x,y) \equiv 0 \pmod{e}$ với xấp xỉ $S$ của $p+q$, linearization $u = xy-1$, xây lattice 3 biến $(x,y,u)$, tối ưu $\tau^*$ → bound $\delta_0 < 1 - \sqrt{\alpha\gamma}$.

### [[05-main-attack-cf-lattice|05. Main Attack — CF + Lattice]]

Trình bày Theorem 6 — main result của paper: dùng relation (2) từ continued fractions để biểu diễn $(k,d) = (up_r + vp_{r-1},\ uq_r + vq_{r-1})$, xây đa thức 3 biến $f(x,y,z)$ modulo $eq_r$, áp dụng Jochemsz-May strategy → bound $\delta_0 < 1 - \alpha/3 - \gamma/2$, vượt Herrmann-May trong hầu hết khoảng $e$ thực tế.

### [[06-msb-lsb-sharing-attacks|06. MSB/LSB Sharing Attacks]]

Trình bày Theorems 7–8 và Remark 2: MSB sharing ($p-q < N^{\beta_1}$) → $\gamma = 2\beta_1 - 1/2$ → $\delta_0 < 5/4 - \alpha/3 - \beta_1$; LSB sharing ($p-q = 2^n g$) → Lemma 5 → $\gamma = 1/2 - 2\beta_2$ → $\delta_0 < \beta_2 - \alpha/3 + 3/4$; bounds nhất quán tại biên $\beta = 1/4$.

### [[07-experimental-results|07. Experimental Results]]

Phân tích Table 1 (5 instances 1024-bit), walkthrough Example 1 (512-bit, $\delta_0 \approx 0.317$), SageMath implementation workflow, phân tích gap thực nghiệm vs lý thuyết (~33%), và open problems từ §6.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N = pq$ | RSA modulus, $q < p < 2q$ | $N$ | [[01-continued-fractions-rsa\|Lesson 01]] |
| $e$ | Public exponent | $e$ | [[01-continued-fractions-rsa\|Lesson 01]] |
| $d$ | Private exponent, $ed \equiv 1 \pmod{\varphi(N)}$ | $d$ | [[01-continued-fractions-rsa\|Lesson 01]] |
| $k$ | Số nguyên: $ed - k\varphi(N) = 1$ | $k$ | [[01-continued-fractions-rsa\|Lesson 01]] |
| $\varphi(N)$ | Euler's totient $= (p-1)(q-1)$ | $\varphi(N)$ | [[01-continued-fractions-rsa\|Lesson 01]] |
| $\alpha = \log_N e$ | Log-exponent của public exponent | $\alpha$ | [[03-wiener-attack-optimality\|Lesson 03]] |
| $\delta_0 = \log_N d$ | Log-exponent của private exponent | $\delta_0$ | [[03-wiener-attack-optimality\|Lesson 03]] |
| $[a_0, a_1, \ldots]$ | Continued fraction expansion | — | [[01-continued-fractions-rsa\|Lesson 01]] |
| $p_n / q_n$ | Convergent thứ $n$ | — | [[01-continued-fractions-rsa\|Lesson 01]] |
| $a_0 = \lfloor e/N \rfloor$ | Partial quotient đầu tiên của $e/N$ | $a_0$ | [[03-wiener-attack-optimality\|Lesson 03]] |
| $\Lambda$ | Lattice | $\Lambda$ | [[02-coppersmith-lattice-strategy\|Lesson 02]] |
| $\omega$ | Chiều lattice | $\omega$ | [[02-coppersmith-lattice-strategy\|Lesson 02]] |
| $\det(\Lambda)$ | Lattice determinant | $\det(\Lambda)$ | [[02-coppersmith-lattice-strategy\|Lesson 02]] |
| $R$ | Modulus trong phương trình mô-đun | $e$ hoặc $eq_r$ | [[02-coppersmith-lattice-strategy\|Lesson 02]] |
| $X_i$ | Bound trên nghiệm $x_i^*$ | $X, Y, Z$ | [[02-coppersmith-lattice-strategy\|Lesson 02]] |
| $\gamma = \log_N\|p+q-S\|$ | Log-exponent của sai số xấp xỉ $p+q$ | $\gamma$ | *(Lesson 04)* |
| $\delta = \log_N \max(\|u\|, \|v\|)$ | Log-exponent của hệ số CF | $\delta$ | *(Lesson 05)* |
| $u, v$ | Hệ số trong relation (2): $d = uq_r + vq_{r-1}$ | $u, v$ | *(Lesson 05)* |
| $\beta$ | Log-exponent: $p - q < N^\beta$ | $\beta$ | *(Lesson 06)* |
| $S$ | Xấp xỉ của $p + q$ | $S$ | *(Lesson 04)* |

---

## References

### 🟡 Integrated

- [Legendre 1798] Legendre — *Essai sur la Théorie des Nombres* — Lesson 01: Theorem 1 (Legendre criterion)
- [Nitaj et al. 2014] Nitaj, Ariffin, Nassr, Bahig — *New Attacks on the RSA Cryptosystem*, AFRICACRYPT 2014 — Lessons 01, 03: Lemmas 3–5
- [de Weger 2002] de Weger — *Cryptanalysis of RSA with Small Prime Difference*, AAECC 2002 — Lesson 03: Lemma 4 ($p+q \approx 2\sqrt{N}$)
- [Wiener 1990] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory 1990 — Lesson 03: original attack
- [Howgrave-Graham 1997] Howgrave-Graham — *Finding Small Roots*, Cryptography and Coding 1997 — Lesson 02: Lemma 2
- [Jochemsz & May 2006] Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials*, ASIACRYPT 2006 — Lesson 02, 05: shift polynomial strategy
- [Herrmann & May 2010] Herrmann, May — *Maximizing Small Root Bounds by Linearization*, PKC 2010 — Lesson 04: Theorem 5
- [Sun et al. 2008] Sun, Wu, Steinfeld, Guo, Wang — *Cryptanalysis of Short Exponent RSA with Primes Sharing LSBs*, CANS 2008 — Lesson 06: comparison Theorem 8

### 🔴 Prerequisites

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptol. 1997
- [May03] May — *New RSA Vulnerabilities Using Lattice Reduction Methods*, PhD thesis 2003
- [HW95] Hardy, Wright — *An Introduction to the Theory of Numbers*, Oxford 1995

### ⚪ Citations only

- [Boneh-Durfee 1999], [Blömer-May 2004], [Ernst et al. 2005], [Feng et al. 2024], [Li et al. 2023], [Susilo et al. 2019/2021], [Takayasu-Kunihiro 2016/2017]
