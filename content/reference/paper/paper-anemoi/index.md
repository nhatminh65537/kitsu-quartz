---
title: "Anemoi"
tags: [anemoi, index]
source: "ePrint 2022/840 — Bouvier et al., CRYPTO 2023"
created: 2026-03-15
---

## Lesson Summaries

| # | File | Summary |
|---|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | Roadmap tổng thể, coverage map và dependency graph toàn khóa. |
| 01 | [[01-ao-hash-functions-and-cico\|01. AO Hash Functions & CICO]] | Tại sao ZK proof systems cần AO hash functions; landscape MiMC/Rescue/Poseidon; định nghĩa và ý nghĩa CICO problem. |
| 02 | [[02-sponge-construction\|02. Sponge Construction]] | Sponge absorption/squeezing; duplex construction; indifferentiability; hermetic sponge security claim của AnemoiSponge. |
| 03 | [[03-flystel-sbox\|03. The Flystel S-Box]] | Open Flystel $H$ (high-degree permutation) và Closed Flystel $V$ (low-degree function) từ butterfly structure; CCZ-equivalence $H \sim V$ cho phép verify $H$ cheaply; 2 Plonk custom gates per column. |
| 04 | [[04-anemoi-permutation\|04. The Anemoi Permutation]] | SPN construction: constant addition → MDS + PHT → Flystel S-box layer; Table 1 số rounds; correctness proof; concrete instance BLS12-381 ($\ell=1$, $\alpha=11$, 19 rounds). |
| 05 | [[05-jive-compression-mode\|05. Jive Compression Mode]] | Jive = feed-forward compression $z = \sum_i(x_i + u_i)$; Latin dance inspiration; collision resistance từ CICO; AnemoiJive-BLS12-381/BN-254 ($b=2$, $m=1$, formula $z=x+y+u+v$). |
| 06 | [[06-anemoi-instantiations\|06. Concrete Instantiations]] | AnemoiSponge (arbitrary-length hash, $r=c=1$); tất cả 4 concrete instances (BLS12-381/BN-254 × Jive/Sponge); security claims chính thức (hermetic sponge + secure compression). |
| 07 | [[07-security-analysis-algebraic-attacks\|07. Security Analysis]] | Statistical attacks trivially blocked; CICO polynomial system $\mathcal{F}_\text{CICO}$; GB attack pipeline DRL→FGLM→LEX; degree of regularity $d_\text{reg} = 2\ell n_r + \kappa_\alpha$; Equation (2) derivation; post-publication FreeLunch/resultant attacks (2024–2025). |
| 08 | [[08-performance-benchmarks\|08. Performance & Benchmarks]] | R1CS ~84 constraints (~3× better than Poseidon); Plonk ~38 gates (21–35% better than Poseidon); native 2–3× faster than Rescue-Prime; Merkle proof 7× fewer gates than lookup-based. |
| A0 | [[a0-security-proofs\|A0. Security Proofs]] | Proof đầy đủ CCZ-equivalence $H \sim V$ với bijection $\mathcal{L}$ tường minh; differential uniformity $\delta(H) = \alpha-1$ (APN với $\alpha=3$); Walsh spectrum bound $\leq p\log p$ (conjecture proved 2024 bởi Beyne & Bouvier). |

---

## Global Notation Table

| Ký hiệu | Ý nghĩa | Định nghĩa lần đầu |
|---------|---------|---------------------|
| $\mathbb{F}_q$ | Trường hữu hạn bậc $q$ | Lesson 01 |
| $\mathbb{F}_p$ | Trường bậc nguyên tố $p$ lớn | Lesson 01 |
| $\alpha$ | Exponent của power-map S-box ($x^\alpha$ hoặc $x^{1/\alpha}$) | Lesson 01 |
| $\lambda$ | Security parameter (bits) | Lesson 01 |
| CICO | Constrained-Input Constrained-Output problem | Lesson 01 |
| $P : \mathbb{F}_q^b \to \mathbb{F}_q^b$ | Anemoi permutation (nền của sponge) | Lesson 02 |
| $b = r + c$ | State size = rate + capacity | Lesson 02 |
| $r$ | Rate — phần tử absorb/squeeze mỗi bước | Lesson 02 |
| $c$ | Capacity — phần ẩn của state | Lesson 02 |
| $\ell$ | Số cột Anemoi: $b = 2\ell$ | Lesson 02 |
| $H$ | Open Flystel (high-degree permutation) | Lesson 03 |
| $V$ | Closed Flystel (low-degree function) | Lesson 03 |
| $Q_\gamma, Q_\delta$ | Quadratic functions dùng trong Flystel | Lesson 03 |
| $E$ | Permutation dùng trong Flystel: $x \mapsto x^{1/\alpha}$ | Lesson 03 |
| $g$ | Multiplicative constant trong Flystel | Lesson 03 |
| $M_X$ | MDS matrix $\ell \times \ell$ | Lesson 04 |
| $\rho$ | Cyclic left shift trên $\mathbb{F}_q^\ell$ | Lesson 04 |
| $\mathsf{PHT}$ | Pseudo-Hadamard Transform | Lesson 04 |
| $R_r$ | Round function thứ $r$ của Anemoi | Lesson 04 |
| $n_r$ | Số rounds của Anemoi | Lesson 04 |
| $C^r, D^r$ | Round constants tại round $r$ | Lesson 04 |
| $\mathsf{Jive}_b$ | Jive $b$-to-1 compression function | Lesson 05 |
| $b$ | Số branches của Jive | Lesson 05 |
| $q_\text{BLS}$ | Scalar field order của BLS12-381 | Lesson 06 |
| $q_\text{BN}$ | Scalar field order của BN-254 | Lesson 06 |
| $\mathcal{F}_\text{CICO}$ | Hệ phương trình đa thức encoding CICO | Lesson 07 |
| $d_\text{reg}$ | Degree of regularity của $\mathcal{F}_\text{CICO}$ | Lesson 07 |
| $\kappa_\alpha$ | Constant trong $d_\text{reg}$ formula: $\kappa_{11}=9$ | Lesson 07 |
| $\Gamma_F$ | Graph của hàm $F$ | Lesson A0 |
| $\delta(F)$ | Differential uniformity của $F$ | Lesson A0 |
| $\mathcal{W}_F$ | Walsh transform của $F$ | Lesson A0 |
