---
title: "Poseidon2"
type: index
tags: [poseidon2, zk-hash, index]
source: "Poseidon2: A Faster Version of the Poseidon Hash Function — Grassi, Khovratovich, Schofnegger, AFRICACRYPT 2023"
created: 2026-03-15
---

**Poseidon2** là phiên bản tối ưu hóa của hash function Poseidon cho ZK proof systems, với linear layers mới $(M_E, M_I)$ giảm đến 90% phép nhân và thêm compression function mode hiệu quả cho Merkle tree. Course này distill toàn bộ 8 section của paper gốc thành 7 lesson textbook-style bằng tiếng Việt.

**Tài liệu gốc**: [eprint.iacr.org/2023/323](https://eprint.iacr.org/2023/323)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-zk-ao-hash-background|01. ZK Proof Systems and AO Hash Functions]]

Cover §1–§2: giới thiệu về ZK proof systems (SNARK, STARK, Plonk), arithmetization (R1CS, Plonk gates), và tại sao cần AO hash functions. Đặt context đầy đủ cho Poseidon2 và trình bày ba đóng góp chính của paper.

### [[02-poseidon-hades|02. Poseidon and the HADES Design Strategy]]

Cover §3: HADES design strategy $[R_F/2, R_P, R_F/2]$, cấu trúc round function của Poseidon_π (S-box $x^\alpha$, MDS matrix $M$, round constants NUMS), tham số instantiation, và điểm yếu linear layer dày đặc mà Poseidon2 sẽ giải quyết.

### [[03-linear-layers-me-mi|03. New Linear Layers: M_E and M_I]]

Cover §4: yêu cầu cho hai linear layers, cấu trúc circulant block của $M_E$ (dựa trên $M_4$ 4×4 MDS, chi phí $\approx 5t$ additions), và cấu trúc diagonal+rank-1 của $M_I$ (chi phí $t$ mults + $2t$ adds). Giải thích tại sao branch number $t/4+4$ đủ an toàn và điều kiện không có invariant subspace cho $M_I$.

### [[04-poseidon2-permutation|04. The Poseidon2 Permutation and Modes of Operation]]

Cover §5–§6: ba điểm khác biệt so với Poseidon_π (initial $M_E$, hai linear layers, 1 round constant trong partial rounds), full spec của $P_2$, Table 1 concrete instantiations, sponge mode (input tùy độ dài) và compression function mode (một permutation call cho Merkle tree — hiệu quả hơn 4x so với sponge).

### [[05-classical-security|05. Classical Security Analysis]]

Cover §7.1–7.2: differential/linear attacks (wide trail argument, branch number $t/4+4$ đủ với 3 cặp full rounds), interpolation attack [JK97] (yêu cầu $\alpha^{R_P} > p$), Gröbner basis attack và CICO problem, công thức chọn round numbers $R_F = 8$ và $R_P$ với 7.5% margin.

### [[06-algebraic-attacks|06. Algebraic Attacks and the Sauer Fix]]

Cover §7.3: attack [ABM23] phát hiện GB complexity bị overestimate ở $\lambda \geq 384$ bit do chain structure của partial rounds; không phá vỡ 128-bit instances. Fix đơn giản của GKS23: điều chỉnh công thức $R_P$ cho high-$\lambda$ settings. Subspace trail exploitation.

### [[07-performance-benchmarks|07. Performance, Plonk Arithmetization and Benchmarks]]

Cover §8: plain performance 3–5× nhanh hơn Poseidon (Rust benchmarks), kỹ thuật Plonk arithmetization mới kết hợp S-box và linear layer gate, Proposition constraint count $N_c = t \cdot R_F + R_P - t + 1$, Merkle tree benchmarks (11× plain + 5.6× fewer constraints), comparison với Griffin/Anemoi/Rescue/MiMC.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $\mathbb{F}_p$ | Finite field với $p$ nguyên tố | $\mathbb{F}_p$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $\mathbb{F}_p^t$ | Vector space chiều $t$ trên $\mathbb{F}_p$ | $\mathbb{F}_p^t$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $n$ | Bit-length của $p$: $n = \lceil \log_2 p \rceil$ | $n$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $t$ | State size (số phần tử trong state) | $t$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $R_F$ | Số full rounds tổng ($= 2R_f$) | $R_F$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $R_P$ | Số partial rounds | $R_P$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $\alpha$ | Bậc S-box, $\gcd(\alpha, p-1) = 1$ | $\alpha$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $\lambda$ | Security parameter (bit) | $\lambda$ | [[01-zk-ao-hash-background\|Lesson 01]] |
| $x \in \mathbb{F}_p^t$ | State của permutation | $x$ | [[02-poseidon-hades\|Lesson 02]] |
| $M \in \mathbb{F}_p^{t \times t}$ | MDS matrix (Poseidon linear layer) | $M$ | [[02-poseidon-hades\|Lesson 02]] |
| $C_i$ | Round constant vector cho round $i$ | $C_i$ | [[02-poseidon-hades\|Lesson 02]] |
| $S_\alpha$ | S-box: $S_\alpha(x) = x^\alpha$ | $S_\alpha$ | [[02-poseidon-hades\|Lesson 02]] |
| $B(M)$ | Branch number của matrix $M$ | $B(M)$ | [[02-poseidon-hades\|Lesson 02]] |
| $E_i$ | Full round thứ $i$ | $E_i$ | [[02-poseidon-hades\|Lesson 02]] |
| $I_j$ | Partial round thứ $j$ | $I_j$ | [[02-poseidon-hades\|Lesson 02]] |

| $M_E \in \mathbb{F}_p^{t \times t}$ | External matrix — full rounds | $M_E$ | [[03-linear-layers-me-mi\|Lesson 03]] |
| $M_I \in \mathbb{F}_p^{t \times t}$ | Internal matrix — partial rounds | $M_I$ | [[03-linear-layers-me-mi\|Lesson 03]] |
| $M_4 \in \mathbb{F}_p^{4 \times 4}$ | Base 4×4 MDS block cho $M_E$ | $M_4$ | [[03-linear-layers-me-mi\|Lesson 03]] |
| $\mu_i \in \mathbb{F}_p$ | Diagonal offsets của $M_I$ | $\mu_i$ | [[03-linear-layers-me-mi\|Lesson 03]] |
| $P_2$ | Poseidon2_π permutation | $\mathsf{Poseidon2}_\pi$ | [[04-poseidon2-permutation\|Lesson 04]] |
| $r$ | Rate (số phần tử input mỗi block, sponge) | $r$ | [[04-poseidon2-permutation\|Lesson 04]] |
| $c$ | Capacity ($t - r$, phần "bí mật") | $c$ | [[04-poseidon2-permutation\|Lesson 04]] |
| $d$ | Digest length (số phần tử output) | $d$ | [[04-poseidon2-permutation\|Lesson 04]] |

| $\Delta_I, \Delta_O$ | Input/output difference trong differential attack | $\Delta_I, \Delta_O$ | [[05-classical-security\|Lesson 05]] |
| $A_S$ | Số active S-boxes trong một differential trail | — | [[05-classical-security\|Lesson 05]] |
| CICO | Constrained-Input Constrained-Output problem | CICO | [[05-classical-security\|Lesson 05]] |
| $d_{\text{reg}}$ | Degree of regularity của hệ polynomial (GB attack) | $d_{\text{reg}}$ | [[05-classical-security\|Lesson 05]] |
| $N_c$ | Số Plonk multiplication constraints / permutation call | — | [[07-performance-benchmarks\|Lesson 07]] |

*(Thêm ký hiệu mới vào đây sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [GLRRS20] Grassi et al. — *On a Generalization of SPN: The HADES Design Strategy*, EUROCRYPT 2020 — integrated in Lesson 02: HADES full/partial round argument
- [PGWZS19] Gabizon, Williamson, Ciobotaru — *PLONK*, 2019 — integrated in Lesson 01 & 07: Plonk arithmetization model
- [DL18] Duval, Leurent — *MDS Matrices with Lightweight Circuits*, ToSC 2018 — integrated in Lesson 03: lightweight M_E construction
- [JK97] Jakobsen, Knudsen — *The Interpolation Attack*, FSE 1997 — integrated in Lesson 05: interpolation attack model
- [ABM23] Ashur, Buschman, Mahzoun — *Algebraic Cryptanalysis of HADES*, ePrint 2023/537 — integrated in Lesson 06: Sauer attack and fix

### 🔴 Prerequisites

- [GKR+21] Grassi et al. — *POSEIDON: A New Hash Function for ZK Proof Systems*, USENIX Security 2021
- [GLRRS20] Grassi et al. — *HADES Design Strategy*, EUROCRYPT 2020
- [BCGGMTV14] Ben-Sasson et al. — *SNARKs for C*, CRYPTO 2014
- [BBHR19] Ben-Sasson et al. — *STARKs*, 2019

### ⚪ Citations only

- [Griffin22] Grassi et al. — *Griffin for Zero-Knowledge Applications*, CRYPTO 2023
- [Anemoi22] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, 2022
- [MiMC16] Albrecht et al. — *MiMC*, ASIACRYPT 2016
- [Rescue19] Aly et al. — *Design of Symmetric-Key Primitives for Advanced Cryptographic Protocols*, ToSC 2020
