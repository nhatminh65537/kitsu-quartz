---
title: "POSEIDON"
type: index
tags: [poseidon, hash-function, zk-proof, index]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

Course này distill toàn bộ paper **POSEIDON** (USENIX Security 2021) — hash function đại số tối ưu cho ZK proof systems, bao gồm thiết kế HADES, phân tích bảo mật chống tấn công thống kê và đại số, và đánh giá performance trên Groth16, PLONK, STARKs.

**Tài liệu gốc**: [POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems](https://eprint.iacr.org/2019/458)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-zk-hash-motivation|01. ZK-Friendly Hash Functions & POSEIDON Overview]]

Cover §1 đầy đủ: vì sao SHA-256 không phù hợp cho ZK circuits, POSEIDON là gì, so sánh hiệu suất (Table 1), quan hệ với HADES, và lịch sử thiết kế. Kết quả chính: POSEIDON dùng đến 8× ít constraints hơn Pedersen Hash trong Groth16.

### [[02-sponge-construction|02. Sponge Construction & POSEIDONπ Sponge]]

Cover §2.1: sponge construction tổng quát, sponge security theorem (capacity $c$ → $M = c/2$ bits), thích nghi lên $\mathbb{F}_p$ (XOR → cộng modular), Algorithm 1 (POSEIDON sponge), hai use case chính (compression function và variable-length hash).

### [[03-hades-round-function|03. HADES Design Strategy & Round Function]]

Cover §2.2 đầy đủ: cấu trúc $R_f$ full + $R_P$ partial + $R_f$ full rounds (HADES), ba bước mỗi round (ARC → SubWords → MixLayer), S-box $x^\alpha$ và điều kiện chọn $\alpha$, MDS matrix và Algorithm 2 (tránh insecure matrices), wide trail argument cho bảo mật thống kê, degree growth cho bảo mật đại số.

### [[04-instantiations-parameters|04. Concrete Instantiations & Parameter Selection]]

Cover §2.3 (domain separation qua capacity initialization) và §3 đầy đủ: Definition 1 (parameter tuple $(n, t, R_F, R_P, \alpha)$), 4 security claims (sponge bound, $R_F \geq 6$, interpolation round formula, Gröbner basis round formula), security margin 50%, và round constant generation qua Grain LFSR (NUMS).

### [[05-performance-zk-systems|05. Performance in ZK Proof Systems]]

Cover §4 đầy đủ: R1CS cost model cho Groth16 ($n_\times = C_\alpha(R_F \cdot t + R_P)$), PLONK gate model với partial round optimization, AET cost cho STARKs, và ứng dụng Merkle tree (arity-4 là sweet spot cho Groth16). Kết quả: POSEIDON ~8× rẻ hơn Pedersen Hash, ~100× rẻ hơn SHA-256 trong Groth16.

### [[06-statistical-attacks|06. Statistical Attacks on POSEIDON]]

Cover §5.1 đầy đủ: (1) linear cryptanalysis — character sum bound, DP/LP per S-box $x^\alpha$; (2) differential/rebound attacks — MDS branch number buộc active S-box count tăng nhanh qua full rounds; (3) invariant subspace attack — định nghĩa subspace trail, điều kiện an toàn, mitigation qua Algorithm 2. Kết luận: $R_F \geq 6$ đủ cho mọi statistical attack.

### [[07-algebraic-attacks|07. Algebraic Attacks on POSEIDON]]

Cover §5.2 đầy đủ: (1) CICO problem — abstraction tổng quát cho preimage attacks; (2) interpolation attack — univariate polynomial degree $D = \alpha^{R_F+R_P}$, Lagrange interpolation, bound $R_P \geq \lceil\log_\alpha(2)(M+t)\rceil - R_F$; (3) Gröbner basis attack — hệ $n_v = R_F t + R_P$ biến, F4/F5 complexity $\binom{n_v+d_{\text{reg}}}{d_{\text{reg}}}^\omega$, bound $R_P \geq \lceil 0.21M+1.26t-R_F\rceil$; (4) quy trình chọn $R_P$ cuối cùng với security margin 50%.

### [[a0-implementation|A0. Efficient Implementation & Round Constant Generation]]

Cover Appendix A (Grain LFSR 80-bit, seed construction từ instance parameters, rejection sampling → phân phối đều trên $\mathbb{F}_p$, NUMS rationale) và Appendix B (sparse matrix decomposition $M = \hat{M} + \mathbf{v}\mathbf{w}^T$ giảm partial round MixLayer cost từ $O(t^2)$ → $O(t)$, pre-accumulated matrix $M'$, ~5× speedup tổng).

---

> **Coverage Audit** ✅ — Mọi section, theorem, algorithm, figure của paper đều được cover:
> §1 → L01 | §2.1 → L02 | §2.2–2.2.3 → L03 | §2.3+§3 → L04 | §4 → L05 | §5.1 → L06 | §5.2 → L07 | App.A+B → A0

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $\mathbb{F}_p$ | Trường hữu hạn bậc nguyên tố $p$ | $\mathbb{F}_p$ | [[01-zk-hash-motivation\|Lesson 01]] |
| $n$ | Kích thước bit của một phần tử $\mathbb{F}_p$: $p \approx 2^n$ | $n$ | [[01-zk-hash-motivation\|Lesson 01]] |
| $t$ | Width của POSEIDON state (số phần tử $\mathbb{F}_p$) | $t$ | [[01-zk-hash-motivation\|Lesson 01]] |
| $r$ | Rate (số phần tử absorb mỗi lần) | $r$ | [[02-sponge-construction\|Lesson 02]] |
| $c$ | Capacity ($c = t - r$, tính bảo mật) | $c$ | [[02-sponge-construction\|Lesson 02]] |
| $M$ | Security level (bits): $M = c/2$ | $M$ | [[02-sponge-construction\|Lesson 02]] |
| $b$ | Tổng kích thước state: $b = r + c$ bits | $b$ | [[02-sponge-construction\|Lesson 02]] |
| $o$ | Số phần tử output | $o$ | [[02-sponge-construction\|Lesson 02]] |
| $\pi$ | Permutation $\mathsf{POSEIDON}^\pi$ | $f$ (trong [BDPA08]) | [[02-sponge-construction\|Lesson 02]] |
| $R_F$ | Tổng số full rounds ($= 2R_f$) | $R_F$ | [[03-hades-round-function\|Lesson 03]] |
| $R_f$ | Số full rounds mỗi phía | $R_f$ | [[03-hades-round-function\|Lesson 03]] |
| $R_P$ | Số partial rounds | $R_P$ | [[03-hades-round-function\|Lesson 03]] |
| $\alpha$ | S-box exponent: $x^\alpha$, $\gcd(\alpha, p-1) = 1$ | $\alpha$ | [[03-hades-round-function\|Lesson 03]] |
| $s$ | State vector $s \in \mathbb{F}_p^t$ | $x$ (trong paper) | [[03-hades-round-function\|Lesson 03]] |
| $\mathbf{c}^{(r)}$ | Round constant vector tại round $r$ | $C$ | [[03-hades-round-function\|Lesson 03]] |
| $M$ | MDS matrix $M \in \mathbb{F}_p^{t \times t}$ | $M$ | [[03-hades-round-function\|Lesson 03]] |
| R1CS | Rank-1 Constraint System (Groth16 model) | — | [[01-zk-hash-motivation\|Lesson 01]] |
| AET | Algebraic Execution Trace (STARK model) | — | [[01-zk-hash-motivation\|Lesson 01]] |

| $(n, t, R_F, R_P, \alpha)$ | POSEIDON parameter tuple | $(n, t, R_F, R_P, \alpha)$ | [[04-instantiations-parameters\|Lesson 04]] |
| $\kappa$ | Capacity initialization value (domain separation) | — | [[04-instantiations-parameters\|Lesson 04]] |
| $\lambda$ | Target security level trong attack complexity | $\lambda$ | [[04-instantiations-parameters\|Lesson 04]] |
| $C_\alpha$ | Multiplications per S-box: $C_3 = 2$, $C_5 = 3$ | — | [[05-performance-zk-systems\|Lesson 05]] |
| $n_\times$ | Số R1CS multiplication constraints | — | [[05-performance-zk-systems\|Lesson 05]] |
| $\Delta$ | Difference trong $\mathbb{F}_p$: $\Delta = x - x'$ | $\Delta$ | [[06-statistical-attacks\|Lesson 06]] |
| $\mathcal{B}$ | Branch number của MDS matrix: $\mathcal{B} = t+1$ | $\mathcal{B}$ | [[06-statistical-attacks\|Lesson 06]] |
| $\mathsf{AS}$ | Active S-box count trong differential/linear trail | — | [[06-statistical-attacks\|Lesson 06]] |
| $V_i$ | Subspace tại bước $i$ trong subspace trail | $V_i$ | [[06-statistical-attacks\|Lesson 06]] |

| $D$ | Degree tổng của $\mathsf{POSEIDON}^\pi$: $D = \alpha^{R_F+R_P}$ | $D$ | [[07-algebraic-attacks\|Lesson 07]] |
| $d_{\text{reg}}$ | Degree of regularity của hệ Gröbner basis | $d_{\text{reg}}$ | [[07-algebraic-attacks\|Lesson 07]] |
| $n_v$ | Số biến trong hệ phương trình: $n_v = R_F t + R_P$ | $n_v$ | [[07-algebraic-attacks\|Lesson 07]] |
| $\omega$ | Matrix multiplication exponent ($\approx 2.37$) | $\omega$ | [[07-algebraic-attacks\|Lesson 07]] |
| $\hat{M}$ | Sparse decomposition của MDS matrix | $\hat{M}$ | [[a0-implementation\|A0]] |
| $\mathbf{v}, \mathbf{w}$ | Rank-1 update vectors: $M = \hat{M} + \mathbf{v}\mathbf{w}^T$ | $v, w$ | [[a0-implementation\|A0]] |
| $M'$ | Pre-accumulated MixLayer matrix cho $R_P$ partial rounds | $M'$ | [[a0-implementation\|A0]] |

*(Bảng notation hoàn chỉnh — tất cả lessons đã được sinh.)*

---

## References

### 🟡 Integrated

- [GLR+20] Grassi, Lüftenegger, Rechberger, Rotaru, Schofnegger — *HADES Design Strategy*, EUROCRYPT 2020 — integrated trong Lesson 01 & 03: HADES full/partial round structure, wide trail argument
- [BDPA08] Bertoni, Daemen, Peeters, Van Assche — *On the Indifferentiability of the Sponge Construction*, EUROCRYPT 2008 — integrated trong Lesson 02: Sponge Security Theorem ($M = c/2$)
- [AGR+16] Albrecht, Grassi, Rechberger, Roy, Tiessen — *MiMC*, ASIACRYPT 2016 — integrated trong Lesson 01 & 05: multiplicative complexity baseline
- [ACD+19] Albrecht, Cid, Grassi et al. — *Algebraic Cryptanalysis of MARVELlous and MiMC*, ASIACRYPT 2019 — integrated trong Lesson 06: interpolation attack analysis
- [Gro16] Groth — *On the Size of Pairing-Based Non-interactive Arguments* — integrated trong Lesson 05: R1CS model
- [GWC19] Gabizon, Williamson, Ciobanu — *PLONK* — integrated trong Lesson 05: gate constraint model

### 🔴 Prerequisites

- [BDPA08] Bertoni et al. — *Sponge Functions* — sponge construction background
- [DR02] Daemen, Rijmen — *The Design of Rijndael* — wide trail strategy, SPN design
- [Sil86] Silverman — *Arithmetic of Elliptic Curves* — ECC background cho SNARK curves

### ⚪ Citations only

- [ARS+15] Albrecht, Rechberger et al. — *LowMC*, EUROCRYPT 2015 — inspiration cho partial S-box
- [BBHR19] Ben-Sasson et al. — *Scalable Zero Knowledge with No Trusted Setup*, CRYPTO 2019 — historical motivation
