---
title: "Linear Equations Modulo Unknown Divisors"
type: index
tags: [lattice-cryptanalysis, linear-modular-equations, rsa-variants, index]
source: "Solving Linear Equations Modulo Unknown Divisors: Revisited — Lu, Zhang, Peng, Lin, ~2015"
created: 2026-03-26
---

Paper của Lu, Zhang, Peng và Lin tổng quát hóa ba dạng phương trình tuyến tính modulo ước số ẩn $p$ — mở rộng Howgrave-Graham, Herrmann-May và Cohn-Heninger qua các tham số bậc cao $u, v, r_i$ — và áp dụng để đạt kết quả tốt nhất hiện tại cho một loạt tấn công vào RSA variants. Course này distill toàn bộ nội dung paper thành 9 lessons theo thứ tự từ nền tảng đến ứng dụng.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-problem-landscape|01. Problem Landscape & Prior Work]]

Giới thiệu bài toán tìm nghiệm nhỏ modulo ước số ẩn $p$, ba công trình nền tảng (Howgrave-Graham, Herrmann-May, Cohn-Heninger), và ba dạng phương trình mới mà paper đề xuất. Tóm tắt toàn bộ đóng góp chính của paper.

### [[02-lattice-preliminaries|02. Lattice Preliminaries]]

Cover §2: Lemma 1 (LLL bound), Lemma 2 (Howgrave-Graham sufficient condition — nền tảng cho mọi proof), Theorem 1 (Coppersmith/May univariate), Assumption 1 (algebraic independence). Trình bày quy trình Coppersmith tổng quát như một Scheme Definition.

### [[03-first-type-core|03. First Type: Core Algorithm]]

Cover §3, §3.1: Theorem 2 với proof đầy đủ 6-bước — xây dựng họ đa thức shift $g_k(x) = f^k N^{\lceil v(t-k)/u\rceil}$, tính $\det(L)$, tối ưu $\tau = u\beta$, thu bound $\gamma < uv\beta^2$. Minh họa Figure 1 (lattice matrix $\beta=0.25, u=3, v=2$) và phân tích running time $O(\epsilon^{-7}v^2\log^2 N)$.

### [[04-first-type-extensions|04. First Type: Extensions]]

Cover §3.1 (Theorem 3 + Proposition 1): mở rộng Theorem 2 lên đa thức bậc $\delta$ (họ shift thêm $x^j$, bound $uv\beta^2/\delta$) và lên $n$ biến tuyến tính (họ shift dùng $x_2^{i_2}\cdots x_n^{i_n} f^k N^{\cdots}$, tối ưu $\tau$ bằng đạo hàm).

### [[05-multi-power-rsa-attacks|05. Multi-Power RSA Attacks]]

Cover §3.2 đầy đủ: Theorem 4 (small secret exponent, bound $r(r-1)/(r+1)^2$, chứng minh và so sánh Table 1), Theorem 5 (MSBs partial exposure), Theorem 6 (LSBs), BDH factoring with known bits — cùng asymptotic bound nhưng linh hoạt hơn về lattice dimension, với kết quả thực nghiệm Tables 2–3.

### [[06-second-type-homogeneous|06. Second Type: Homogeneous Equations]]

Cover §4, §4.1: Theorem 7 (homogeneous bivariate $f_2 = a_1x_1 + a_2x_2 \bmod p^v$, bound $\gamma_1+\gamma_2 < uv\beta^2$) với full proof, so sánh với Herrmann-May/Castagnos et al./May, Proposition 2 ($n$-variable extension, exponent $n/(n-1)$ do tính thuần nhất).

### [[07-weak-encryption-exponents|07. Weak Encryption Exponents]]

Cover §4.2: Theorem 8 (weak RSA exponents, bound $\gamma+\delta \le 0.25$) và Theorem 9 (CRT-RSA, điều kiện $2\delta+\alpha < 0.75$, cải thiện Nitaj [Nit12] từ $0.707$ lên $0.75$). Proof đầy đủ cho Theorem 9 qua ước lượng $k_p$. Table 4 experimental.

### [[08-third-type-simultaneous|08. Third Type: Simultaneous Equations]]

Cover §5, §5.1: Theorem 10 (hệ $n$ phương trình đồng thời modulo $p^{r_j}$ khác nhau, bound multiplicative $\frac{n}{r}\frac{\prod\gamma_j}{\prod r_j} < \eta^{(n+1)/n}$) với proof đầy đủ tính dimension và $\det(L)$. Theorem 11 (higher-degree extension). So sánh với Cohn-Heninger.

### [[09-common-prime-rsa|09. Common Prime RSA Attack]]

Cover §5.2 và §6: Theorem 12 ($\beta < 4\gamma^3$, $\gamma > 1/4$) áp dụng Theorem 10 với $n=2$, $r_1=1$, $r_2=2$. So sánh với Jochemsz-May (Figure 3). Table 5 experimental (cải thiện lớn khi $\gamma \ge 0.4$). Kết luận toàn paper.

---

## Global Notation

Bảng này được cập nhật sau mỗi lesson. Ký hiệu nhất quán xuyên suốt toàn course.

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N$ | Composite modulus đã biết | $N$ | [[01-problem-landscape\|Lesson 01]] |
| $p$ | Ước số nguyên tố ẩn của $N$ | $p$ | [[01-problem-landscape\|Lesson 01]] |
| $\beta$ | Tham số kích thước: $p \ge N^\beta$ | $\beta$ | [[01-problem-landscape\|Lesson 01]] |
| $u$ | Số mũ: $p^u \mid N$ (bội số đã biết) | $u$ | [[03-first-type-core\|Lesson 03]] |
| $v$ | Số mũ: modulus của phương trình là $p^v$ | $v$ | [[03-first-type-core\|Lesson 03]] |
| $\gamma$ | Tham số kích thước nghiệm: $\|y\| \le N^\gamma$ | $\gamma$ | [[03-first-type-core\|Lesson 03]] |
| $\epsilon$ | Slack nhỏ tùy ý (trong bound $\gamma < uv\beta^2 - \epsilon$) | $\epsilon$ | [[03-first-type-core\|Lesson 03]] |
| $m$ | Tham số lattice (dimension $= m+1$) | $m$ | [[03-first-type-core\|Lesson 03]] |
| $t$ | Tham số shift: $t = \tau m$ | $t$ | [[03-first-type-core\|Lesson 03]] |
| $\tau$ | Tỉ lệ tối ưu $\tau = u\beta$ | $\tau$ | [[03-first-type-core\|Lesson 03]] |
| $L$ | Lattice được xây dựng | $L$ | [[03-first-type-core\|Lesson 03]] |
| $d$ | Dimension của $L$ ($= m+1$ trong Thm 2) | $w, d$ | [[03-first-type-core\|Lesson 03]] |
| $g_k(x)$ | Đa thức shift thứ $k$ | $g_k$ | [[03-first-type-core\|Lesson 03]] |
| $X$ | Bound trên nghiệm: $X = N^\gamma$ | $X$ | [[03-first-type-core\|Lesson 03]] |
| $r$ | Số mũ trong $N = p^r q$ | $r$ | [[05-multi-power-rsa-attacks\|Lesson 05]] |

*(Cập nhật dần sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, Math. Ann. 1982 — Lemma 1 (LLL bound), dùng trong Lesson 02, 03
- [HG97] Howgrave-Graham — *Finding small roots of univariate modular equations revisited*, IMACC 1997 — Lemma 2 (HG sufficient condition), dùng trong Lesson 02
- [Cop97] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 — Theorem 1, dùng trong Lesson 02
- [May10] May — *Using LLL-reduction for solving RSA and factorization problems*, 2010 — Theorem 1 co-attribution; special case $u=v$, dùng trong Lesson 02–03
- [HG01] Howgrave-Graham — *Approximate integer common divisors*, CaLC 2001 — ACDP origin; special case $u=v=1$, dùng trong Lesson 03
- [HM08] Herrmann-May — *Solving linear equations modulo divisors*, Asiacrypt 2008 — bound cải thiện trong Lessons 03, 06
- [NS05] Nguyen-Stehlé — *Floating-Point LLL revisited*, Eurocrypt 2005 — running time L²-algorithm, dùng trong Lesson 03
- [CH12] Cohn-Heninger — *Approximate common divisors via lattices*, ANTS 2012 — special case của Thm 10, dùng trong Lesson 08
- [Tak98] Takagi — *Fast RSA-type cryptosystem modulo $p^k q$*, Crypto 1998 — định nghĩa Multi-Power RSA, dùng trong Lesson 05
- [May04] May — *Secret exponent attacks on RSA-type schemes with moduli $N=p^r q$*, PKC 2004 — bound cải thiện bởi Thm 4, dùng trong Lesson 05
- [BDH99] Boneh-Durfee-HG — *Factoring $N=p^r q$ for large $r$*, Crypto 1999 — BDH method so sánh, dùng trong Lesson 05
- [Nit12] Nitaj — *A new attack on RSA and CRT-RSA*, Africacrypt 2012 — kết quả được extend trong Lessons 06–07
- [JM06] Jochemsz-May — *A strategy for finding roots of multivariate polynomials*, Asiacrypt 2006 — bound cải thiện bởi Thm 12, dùng trong Lesson 09
- [Hin06] Hinek — *Another look at small RSA exponents*, CT-RSA 2006 — định nghĩa Common Prime RSA, dùng trong Lesson 09

### ⚪ Citations only

- [Sar14] Sarkar — *Small secret exponent attack on RSA variant with modulus $N=p^r q$*, DCC 2014
- [Sar15] Sarkar — *Revisiting prime power RSA*, ePrint 2015
- [SM13] Sarkar-Maitra — *Cryptanalytic results on Dual CRT and Common Prime RSA*, DCC 2013
- [Wie90] Wiener — *Cryptanalysis of short RSA secret exponents*, IEEE Trans. IT 1990
- [CJLN09] Castagnos-Joux-Laguillaumie-Nguyen — *Factoring $pq^2$ with quadratic forms*, Asiacrypt 2009
- [TK13] Takayasu-Kunihiro — *Better lattice constructions for solving multivariate linear equations*, ACISP 2013
- [vDGHV10] Van Dijk-Gentry-Halevi-Vaikuntanathan — *FHE over the integers*, Eurocrypt 2010
- [SM11] Sarkar-Maitra — *Approximate integer common divisor problem*, IEEE Trans. IT 2011
- [Fou13] Fouque et al. — *Attacking RSA-CRT signatures with faults*, J. Crypt. Eng. 2013
- [IKK08] Itoh-Kunihiro-Kurosawa — *Small secret key attack on a variant of RSA*, CT-RSA 2008
- [Sar12] Sarkar — *Reduction in lossiness of RSA trapdoor permutation*, SPACE 2012
