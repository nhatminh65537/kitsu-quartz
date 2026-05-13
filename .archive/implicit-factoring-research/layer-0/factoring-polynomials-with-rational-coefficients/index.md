---
title: "Factoring Polynomials with Rational Coefficients"
type: index
tags: [lll, lattice, polynomial-factoring, index]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

Paper LLL (1982) trình bày thuật toán đa thức đầu tiên để phân tích $f \in \mathbb{Q}[X]$ thành nhân tử bất khả quy, dựa trên một thuật toán **lattice basis reduction** mới — được gọi là thuật toán LLL, một trong những thuật toán quan trọng nhất của thế kỷ 20 trong lý thuyết số và mật mã học. Course này giúp nắm đầy đủ toàn bộ paper: lý thuyết lattice reduction, kết nối nhân tử–lattice, và thuật toán factoring hoàn chỉnh.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-lattice-basics-gram-schmidt|01. Lattice Basics & Gram-Schmidt Orthogonalization]]

Cover Introduction và §1:(1.1)–(1.5). Định nghĩa lattice, determinant $d(L)$, quá trình Gram-Schmidt tạo họ vector trực giao $b_i^*$ và hệ số $\mu_{ij}$, và định nghĩa **reduced basis** (LLL-reduced) qua hai điều kiện size reduction $|\mu_{ij}| \le 1/2$ và Lovász condition.

### [[02-reduced-basis-properties|02. Properties of Reduced Bases]]

Cover §1:(1.6)–(1.14). Chứng minh ba kết quả chính: (1.7) bound $|b_j|^2 \le 2^{i-1}|b_i^*|^2$, (1.8)–(1.9) approximation bounds via $d(L)$, Hadamard's inequality (1.10), Proposition (1.11) xấp xỉ shortest vector với hệ số $2^{(n-1)/2}$, và Proposition (1.12) xấp xỉ $t$ successive minima.

### [[03-lll-reduction-algorithm|03. LLL Basis Reduction Algorithm]]

Cover §1:(1.15), Fig. 1, (1.22), (1.23)–(1.25). Trình bày thuật toán LLL đầy đủ với hai case: **size reduction** và **swap**. Proof termination qua potential function $D = \prod d_i$: mỗi swap giảm $D$ ít nhất hệ số $3/4$, bị chặn dưới bởi $m(L)$.

### [[04-complexity-and-applications|04. Complexity Analysis & Diophantine Applications]]

Cover §1:(1.26)–(1.39). Prop (1.26): LLL cần $O(n^4 \log B)$ arithmetic ops, binary length $O(n \log B)$, với integer representation dùng $d_i$ làm mẫu số. Hai ứng dụng: Diophantine Approximation (Prop 1.39) và tìm $\mathbb{Q}$-linear relations.

### [[05-factors-and-lattices-setup|05. Factors and Lattices — Setup]]

Cover §2:(2.1)–(2.8). Thiết lập pipeline: điều kiện (2.1)–(2.4) trên p-adic factor $h$, Prop (2.5) tồn tại/duy nhất $h_0$, lattice $L$ với basis $\{p^kX^i\} \cup \{hX^j\}$ và $d(L)=p^{kl}$, Prop (2.7): $b \in L$ ngắn thỏa (2.8) $\Rightarrow h_0 \mid b$.

### [[06-factor-recovery|06. Factor Recovery via LLL]]

Cover §2:(2.13),(2.14),(2.16). Tích hợp Mignotte bound $\|h_0\| \le \binom{2m}{m}^{1/2}\|f\|$ [10]. Proof Prop (2.13): $\deg(h_0) \le m \iff \|b_1\| < (p^{kl}/\|f\|^m)^{1/n}$. Proof Prop (2.16): $h_0 = \gcd(b_1,\ldots,b_t)$ với $t = \max J$ và $\deg(h_0) = m+1-t$.

### [[07-polynomial-factoring-algorithm|07. Main Polynomial Factoring Algorithm]]

Cover toàn bộ §3:(3.1)–(3.10). Sub-algorithm (3.1) và Prop (3.2) $O(m^4 k\log p)$; Algorithm (3.3) binary search trên $m$ và Prop (3.4); Main algorithm (3.5) với squarefree reduction và vòng lặp chính; Theorem (3.6) $O(n^{12} + n^9(\log\|f\|)^3)$ bit ops; tích hợp Rosser-Schoenfeld [12] và Hardy-Wright [6] để bound prime $p$; Remark (3.10) simplification dùng partial reduction.

### [[a0-proof-proposition-2-7|A0. Proof of Proposition (2.7)]]

Proof đầy đủ của Prop (2.7): vector ngắn $b \in L$ thỏa (2.8) $\Rightarrow h_0 \mid b$. Xây dựng lattice phụ trợ $M'$ từ tổ hợp $\lambda f + \mu b$, dùng Hadamard (upper bound $d(M') < p^{kl}$) và Bézout lift qua (2.9) (lower bound $d(M') \ge p^{kl}$) để có mâu thuẫn.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Paper | Định nghĩa tại |
|---------|---------|-------|----------------|
| $L$ | Lattice (mạng điểm trong $\mathbb{R}^n$) | $L$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $n$ | Rank của lattice / bậc đa thức | $n$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $b_1, \ldots, b_n$ | Basis vectors của lattice | $b_1, \ldots, b_n$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $b_1^*, \ldots, b_n^*$ | Gram-Schmidt orthogonal vectors | $b_i^*$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $\mu_{ij}$ | Gram-Schmidt coefficients | $\mu_{ij}$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $d(L)$ | Determinant của lattice | $d(L)$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $(\cdot,\cdot)$ | Inner product thông thường trên $\mathbb{R}^n$ | $(,)$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $\|\cdot\|$ | Euclidean norm | $\|\cdot\|$ | [[01-lattice-basics-gram-schmidt\|Lesson 01]] |
| $\lambda_i$ | Successive minima của $\|\cdot\|^2$ trên $L$ | $\lambda_i$ | [[02-reduced-basis-properties\|Lesson 02]] |
| $B_i = \|b_i^*\|^2$ | Bình phương norm Gram-Schmidt vector $i$ | $B_i$ | [[03-lll-reduction-algorithm\|Lesson 03]] |
| $d_i$ | $\det((b_j,b_l))_{1\le j,l\le i} = \prod_{j=1}^i B_j$ | $d_i$ | [[03-lll-reduction-algorithm\|Lesson 03]] |
| $D$ | Potential function $\prod_{i=1}^{n-1} d_i$ | $D$ | [[03-lll-reduction-algorithm\|Lesson 03]] |
| $m(L)$ | $\min\{\|x\|^2 : x \in L, x\ne 0\}$ | $m(L)$ | [[03-lll-reduction-algorithm\|Lesson 03]] |
| $p, k$ | Số nguyên tố và precision của p-adic lift | $p, k$ | [[05-factors-and-lattices-setup\|Lesson 05]] |
| $f, h, h_0$ | Đa thức cần factoring, p-adic factor, nhân tử bất khả quy thực sự | $f, h, h_0$ | [[05-factors-and-lattices-setup\|Lesson 05]] |
| $l = \deg(h)$, $m$ | Bậc của $h$ và bound tìm kiếm | $l, m$ | [[05-factors-and-lattices-setup\|Lesson 05]] |
| $\|\cdot\|$ (đa thức) | $\|\sum a_i X^i\| = (\sum a_i^2)^{1/2}$ | $\|\cdot\|$ | [[05-factors-and-lattices-setup\|Lesson 05]] |

---

## References

### 🟡 Integrated

- [8] Lenstra AK — *Lattices and factorization of polynomials*, Report IW 190/81, 1981 — integrated in Lessons 05, 06: phiên bản yếu của Prop (2.7)
- [10] Mignotte — *An inequality about factors of polynomials*, Math. Comp. 28 (1974) — integrated in Lesson 06: bound $|h_0| \le \binom{2m}{m}^{1/2}|f|$
- [12] Rosser, Schoenfeld — *Approximate formulas for some functions of prime numbers*, Ill. J. Math. 6 (1962) — integrated in Lesson 07: $\prod_{q<p} q > e^{0.84p}$
- [6] Hardy, Wright — *An Introduction to the Theory of Numbers* (1979) — integrated in Lesson 07: Sect. 22.2 prime bound

### 🔴 Prerequisites

- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 — lattice geometry nền tảng (Chap. I, II, VIII)
- [7] Knuth — *The Art of Computer Programming Vol. 2*, Addison-Wesley 1981 — Berlekamp's algorithm, Hensel's lemma, subresultant algorithm

### ⚪ Citations only

- [1] Adleman, Odlyzko — *Irreducibility testing and factorization of polynomials* (1981)
- [2] Brentjes — *Multi-dimensional continued fraction algorithms* (1981)
- [3] Cantor — *Irreducible polynomials with integral coefficients have succinct certificates* (1981)
- [5] Ferguson, Forcade — *Generalization of the Euclidean algorithm* (1979)
- [9] Lenstra HW — *Integer programming with a fixed number of variables* (to appear)
- [11] Pritchard — *A sublinear additive sieve for finding prime numbers* (1981)
- [13] Yun — *The Hensel lemma in algebraic manipulation* (1974)
- [14] Zassenhaus — *On Hensel factorization I* (1969)
- [15] Zassenhaus — *A remark on the Hensel factorization method* (1978)
- [16] Zassenhaus — *A new polynomial factorization algorithm* (1981, unpublished)
