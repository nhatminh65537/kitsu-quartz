---
title: "MiMC"
type: index
tags: [mimc, symmetric-crypto, mpc-friendly, index]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

MiMC là họ block cipher và hash function được thiết kế để tối thiểu số phép nhân trên trường hữu hạn $\mathbb{F}_{2^n}$ và $\mathbb{F}_p$, phục vụ các ứng dụng MPC/FHE/ZK-proofs (đặc biệt SNARKs) nơi phép nhân là bottleneck chính. Course này distill toàn bộ paper ASIACRYPT 2016 thành 7 lessons + 1 appendix.

**Tài liệu gốc**: [eprint.iacr.org/2016/492](https://eprint.iacr.org/2016/492)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-mimc-motivation|01. MPC/FHE/ZK Motivation and Multiplicative Complexity]]

Thiết lập context: tại sao MPC/FHE/ZK cần primitive tối thiểu số nhân trường lớn, sự khác biệt giữa Boolean và arithmetic circuit metrics (minANDs vs minMULs), và ưu thế cụ thể của MiMC so với AES, LowMC, Pohlig-Hellman trong Table 1–2 của paper.

### [[02-mimc-block-cipher|02. MiMC Block Cipher Construction]]

Xây dựng đầy đủ MiMC-n/n (SPN) và MiMC-2n/n (Feistel): Proposition 1 (điều kiện $x^3$ là permutation → $n$ lẻ), Lemma 1 (inverse $x^s$ với $s = (2^{n+1}-1)/3$), scheme definition, correctness proof, và permutation MiMCP.

### [[03-mimchash-related|03. MiMCHash and Related Designs]]

Xây dựng MiMCHash bằng sponge construction [BDPA08]: MiMCHash-256 ($n=1025$, rate=512, capacity=513) và MiMCHash-256b ($n=769$). Khảo sát các thiết kế liên quan: KN cipher [KN95] (tổ tiên trực tiếp của MiMC), Pohlig-Hellman, Naor-Reingold PRF, SWIFFT/SWIFFTX, SPRING.

### [[04-mimc-algebraic-attacks|04. Security Analysis — Algebraic Attacks]]

Phân tích ba tấn công đại số chính: interpolation attack [JK97] (dẫn đến $r = \lceil n/\log_2 3 \rceil$), GCD attack mới của paper (cùng bound), và MitM GCD attack cho Feistel (dẫn đến $r' = 2r$). Invariant subfield attack và mitigation bằng $n$ nguyên tố.

### [[05-mimc-statistical-attacks|05. Security Analysis — Statistical Attacks]]

Differential analysis: $x^3$ là APN (2-uniform) → $\Pr(\delta \to \delta') \leq 2^{1-n}$, negligible sau 2 rounds. Linear analysis: $x^3$ là almost bent (AB) → correlation negligible sau 2–3 rounds. Algebraic degree (trường và Boolean view). Hash-specific security với inside-out approach và lý do chọn $n = 4t+1$.

### [[06-mimc-variants|06. MiMC Variants]]

Ba hướng mở rộng: (1) MiMC-p/p trên prime fields với $\gcd(3,p-1)=1$, cost 2× do squaring không free; (2) larger keys với $\kappa$ segments — Gröbner basis và Resultant complexity; (3) different round functions — Lucas's Theorem (Theorem 1) giải thích sparsity của $x^{2^t+1}$, Algorithm 1 cho fast exponentiation $x^{2^t-1}$. Kết luận: $x^3$ là optimal.

### [[07-mimc-snark-impl|07. SNARK Applications and Implementation]]

Definition 1 (ACS) và Definition 2 (R1CS): mỗi multiplication → 1 constraint, prover time $O(N_c \log N_c)$. MiMC trong SNARK: 1 constraint/round sau combining, $N_c = 646$, total 7.8ms. So sánh LowMC (90–271ms do 8M+ XOR). Direct implementation với lookup-table algorithms (Table 4). CGPQR masking: MiMC tối ưu với 1 regular multiplication/round → $O(t^2)$ per round.

### [[a0-mimc-appendices|A0. SNARK Prover and Restricted Security Analysis]]

Appendix A: prover algorithm (iFFT → quotient polynomial → proof), MiMCHash-256 cần $N=1801$ (smallest divisor của $2^{1025}-1 \geq 647$). Appendix B: round count khi restricted pairs ($r$ giảm từ 82 xuống 74 với $m \leq 115$) và restricted memory ($r \approx m \log_3 2$). Appendix C: runtime gần linear theo $n$ (Fig. 2), tăng chậm khi fix rounds (Fig. 3).

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $\mathbb{F}_q$ | Trường hữu hạn bậc $q$ | $F_q$, $GF(q)$ | [[01-mimc-motivation\|Lesson 01]] |
| $\mathbb{F}_{2^n}$ | Trường nhị phân bậc $2^n$ | $F_{2^n}$, $GF(2^n)$ | [[01-mimc-motivation\|Lesson 01]] |
| $\mathbb{F}_p$ | Trường nguyên tố bậc $p$ | $F_p$, $GF(p)$ | [[01-mimc-motivation\|Lesson 01]] |
| minMULs | Số nhân trường tối thiểu để tính output | minMULs | [[01-mimc-motivation\|Lesson 01]] |
| MULs/bit | Số nhân trung bình trên mỗi bit input | MULs/bit | [[01-mimc-motivation\|Lesson 01]] |
| minANDs | Số cổng AND tối thiểu (cipher trên $\mathbb{F}_2$) | minANDs | [[01-mimc-motivation\|Lesson 01]] |
| $n$ | Kích thước block/key (bits), phải lẻ | $n$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $k \in \mathbb{F}_{2^n}$ | Secret key | $k$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $c_i \in \mathbb{F}_{2^n}$ | Round constant thứ $i$; $c_0 = c_{r-1} = 0$ | $c_i$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $r$ | Số rounds: $r = \lceil n / \log_2 3 \rceil$ | $r$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $F(x) = x^3$ | Non-linear round function | $F(x) := x^3$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $E_k$ | Encryption function với key $k$ | $E_k$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $s = (2^{n+1}-1)/3$ | Exponent của inverse permutation | $s$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $\oplus$ | XOR = cộng trong $\mathbb{F}_{2^n}$ | $\oplus$ hoặc $+$ | [[02-mimc-block-cipher\|Lesson 02]] |
| $r_\text{rate}$ | Rate (bits/call) trong sponge | $r$ (paper) | [[03-mimchash-related\|Lesson 03]] |
| $c$ (sponge) | Capacity (bits) trong sponge | $c$ | [[03-mimchash-related\|Lesson 03]] |
| $\mathsf{MiMCP}$ | MiMC permutation với key $= 0$ | MiMCP | [[03-mimchash-related\|Lesson 03]] |
| $P(x) \in \mathbb{F}_{2^n}[x]$ | Interpolation polynomial đại diện $E_k$ | $P(x)$ | [[04-mimc-algebraic-attacks\|Lesson 04]] |
| $E(K,x)$ | Encryption với key biến $K$ (polynomial trong $K$) | $E(K,x)$ | [[04-mimc-algebraic-attacks\|Lesson 04]] |
| $\delta \in \mathbb{F}_{2^n}^*$ | Input difference trong differential analysis | $\delta$ | [[05-mimc-statistical-attacks\|Lesson 05]] |
| $\Pr(\delta \to \delta')$ | Differential probability của round function | — | [[05-mimc-statistical-attacks\|Lesson 05]] |
| $\kappa$ | Số key segments trong larger-key construction | $\kappa$ | [[06-mimc-variants\|Lesson 06]] |
| $d$ | Round function exponent (tổng quát) | $d$ | [[06-mimc-variants\|Lesson 06]] |
| $N_c$ | Số rank-1 constraints trong R1CS | $N_c$ | [[07-mimc-snark-impl\|Lesson 07]] |
| $N_0$ | Số biến trong R1CS (witness size) | $N_0$ | [[07-mimc-snark-impl\|Lesson 07]] |
| $w \in \mathbb{F}^{N_0}$ | Witness vector | $w$ | [[07-mimc-snark-impl\|Lesson 07]] |
| $N$ | FFT domain size trong SNARK prover ($N \geq N_c$) | $N$ | [[a0-mimc-appendices\|A0]] |
| $\omega$ | $N$-th root of unity trong $\mathbb{F}$ | $\omega$ | [[a0-mimc-appendices\|A0]] |

*(Thêm ký hiệu mới vào đây sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [ARS+15] Albrecht, Rechberger et al. — *Ciphers for MPC and FHE*, EUROCRYPT 2015 — integrated in Lessons 01, 07: LowMC design và comparison
- [BSCG+13] Ben-Sasson et al. — *SNARKs for C*, CRYPTO 2013 — integrated in Lessons 01, 07, A0: SNARK construction, R1CS
- [JK97] Jakobsen, Knudsen — *The interpolation attack on block ciphers*, FSE 1997 — integrated in Lesson 04: attack construction và round count
- [KN95] Knudsen, Nyberg — *Provable security against a differential attack*, J. Cryptology 1995 — integrated in Lesson 03: tiền thân của MiMC
- [BDPA08] Bertoni et al. — *On the indifferentiability of the sponge construction*, EUROCRYPT 2008 — integrated in Lesson 03: sponge framework
- [CGP+12] Carlet et al. — *Higher-order masking schemes for S-boxes*, FSE 2012 — integrated in Lesson 07: CGPQR masking

### 🔴 Prerequisites

- [MVO96] Menezes, van Oorschot, Vanstone — *Handbook of Applied Cryptography* — finite field arithmetic cơ bản
- [BKW93] Becker, Kredel, Weispfenning — *Gröbner bases* — background cho §5.2 (larger keys)

### ⚪ Citations only

- [BCG+14] Ben-Sasson et al. — *Zerocash*, IEEE S&P 2014
- [PH78] Pohlig, Hellman — *An improved algorithm...*, IEEE Trans. IT 1978
- [NR97] Naor, Reingold — *Number-theoretic constructions of efficient PRFs*, FOCS 1997
- [LMPR08] Lyubashevsky et al. — *SWIFFT*, FSE 2008
- [BBL+15] Banerjee et al. — *SPRING*, FSE 2014
- [Nyb94] Nyberg — *Differentially uniform mappings*, EUROCRYPT 1993
- [BFS14] Bardet et al. — *On the Complexity of the F5 Gröbner basis Algorithm*, JSC 2014
- [PHGR16] Parno et al. — *Pinocchio*, CACM 2016
