---
title: "PLONK"
type: index
tags: [plonk, zk-snark, index]
source: "PlonK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge — Gabizon, Williamson, Ciobotaru, 2019"
created: 2026-03-16
---

PLONK [GWC19] là universal fully succinct zk-SNARK với prover time gần bằng Groth16 — đạt được qua gate-based arithmetization và permutation argument trên multiplicative subgroup. Course này giúp nắm toàn bộ paper từ security model (AGM/Q-DLOG), KZG commitment, polynomial protocols, permutation argument, đến protocol hoàn chỉnh và ZK variant.

**Tài liệu gốc**: [PlonK — eprint.iacr.org/2019/953](https://eprint.iacr.org/2019/953)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-plonk-overview|01. zk-SNARK Landscape & PLONK Overview]]

Giới thiệu bối cảnh universal SNARK, hai cải tiến kỹ thuật cốt lõi của PlonK (gate-based arithmetization + univariate permutation argument), và phân tích hiệu suất chi tiết so với Groth16 / Sonic / Marlin (Table 1–2, Figure 1).

### [[02-agm-qdlog|02. AGM & Q-DLOG]]

Thiết lập nền tảng security: Algebraic Group Model [FKL18] và Q-DLOG assumption. Lemma 2.2 (real pairing check ↔ ideal polynomial check) là công cụ trung tâm cho mọi security proof trong paper.

### [[03-kzg-pcs|03. KZG Polynomial Commitment Scheme (Batched)]]

Xây dựng $d$-polynomial commitment scheme (Def 3.1) dựa trên [KZG10]: $\mathsf{com}(f) = [f(x)]_1$, opening qua quotient polynomial, và batched opening tại hai điểm phân biệt (từ [MBKM] Appendix C). Lemma 3.3 cho thấy verifier chỉ cần 2 pairings bất kể số polynomials.

### [[04-polynomial-protocols|04. Idealised Polynomial Protocols]]

Định nghĩa abstraction layer giữa arithmetic circuit và SNARK: polynomial protocol (Def 4.1) với trusted oracle $\mathcal{I}$ nhận polynomials và check identities, và compilation theorem chuyển polynomial protocol → SNARK thực tế bằng KZG PCS qua Schwartz-Zippel.

### [[05-permutation-argument|05. Permutation Argument]]

Core kỹ thuật của PlonK: grand product argument [BG12] trên multiplicative subgroup $H$. Accumulator polynomial $Z(X)$ encode toàn bộ copy constraints thành 2 polynomial identities. Lemma 5.3: soundness với $\leq kn/|\mathbb{F}|$. Extended permutation cho $k=3$ columns ($f_L, f_R, f_O$) và copy-satisfy property.

### [[06-plonk-arithmetization|06. PLONK Arithmetization]]

Constraint system $\mathcal{C} = (V, Q)$ (Def 6.1): wire assignment $V = (\mathbf{a}, \mathbf{b}, \mathbf{c})$ và 5 selector vectors $Q$. Gate constraint universal cover multiplication/addition/constant/boolean/PI bằng một công thức. Encoding thành polynomials $a(X), b(X), c(X)$ và 8 preprocessed polynomials trên subgroup $H$.

### [[07-plonk-protocol|07. The PLONK Protocol]]

Protocol 7.1 đầy đủ: 5 rounds, wire commitments → accumulator $Z$ → quotient $t_{lo},t_{mid},t_{hi}$ → evaluations $\bar{a},\bar{b},\bar{c},\bar{s}_{\sigma1,2},\bar{z}_\omega$ → opening proofs $W_\zeta, W_{\zeta\omega}$ với linearization $r(X)$. Proof = 9 G₁ + 6 field elements. Verifier cần 2 pairings. Theorem 7.1: knowledge soundness in AGM.

### [[08-plonk-zk|08. Zero Knowledge in PLONK]]

ZK modification qua blinding polynomials: thêm $(b_i X + b_{i+1})Z_H(X)$ vào wire polynomials và $(b_7X^2+b_8X+b_9)Z_H(X)$ vào $Z(X)$. Ghi chú vulnerability 2022 trong §8 gốc (blinding bậc 1 cho $Z$ không đủ) và patch. Formal ZK proof của patched version bởi Sefranek [Sef24]. Proof size không thay đổi.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $\lambda$ | Security parameter | $\lambda$ | [[01-plonk-overview\|Lesson 01]] |
| $\mathbb{F}$ | Prime field bậc nguyên tố $r$ | $F$ | [[01-plonk-overview\|Lesson 01]] |
| $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_t$ | Pairing groups bậc $r$ | $G_1, G_2, G_t$ | [[02-agm-qdlog\|Lesson 02]] |
| $e : \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_t$ | Non-degenerate bilinear pairing | $e$ | [[02-agm-qdlog\|Lesson 02]] |
| $g_1, g_2$ | Generators của $\mathbb{G}_1, \mathbb{G}_2$ | $g_1, g_2$ | [[02-agm-qdlog\|Lesson 02]] |
| $[x]_1 := x \cdot g_1$ | Encoding scalar $x$ trong $\mathbb{G}_1$ | $[x]_1$ | [[02-agm-qdlog\|Lesson 02]] |
| $[x]_2 := x \cdot g_2$ | Encoding scalar $x$ trong $\mathbb{G}_2$ | $[x]_2$ | [[02-agm-qdlog\|Lesson 02]] |
| $\mathsf{srs}$ | Structured Reference String | $\mathsf{srs}$ | [[02-agm-qdlog\|Lesson 02]] |
| $Q$ | Degree của SRS | $Q$ | [[02-agm-qdlog\|Lesson 02]] |
| $\mathsf{negl}(\lambda)$ | Negligible function | $\mathsf{negl}(\lambda)$ | [[02-agm-qdlog\|Lesson 02]] |
| $\mathcal{A}$ | Adversary (PPT algorithm) | $A$ | [[02-agm-qdlog\|Lesson 02]] |
| $\mathcal{E}$ | Extractor | $E$ | [[02-agm-qdlog\|Lesson 02]] |
| $n$ | Số multiplication gates | $n$ | [[01-plonk-overview\|Lesson 01]] |
| $a$ | Số addition gates | $a$ | [[01-plonk-overview\|Lesson 01]] |
| $m$ | Số wires | $m$ | [[01-plonk-overview\|Lesson 01]] |
| $\mathbb{F}_{<d}[X]$ | Tập đa thức bậc $< d$ trên $\mathbb{F}$ | $F_{<d}[X]$ | [[03-kzg-pcs\|Lesson 03]] |
| $\mathsf{cm}$ | Commitment tới polynomial $f$ | $\mathsf{cm}$ | [[03-kzg-pcs\|Lesson 03]] |
| $W := [h(x)]_1$ | Witness commitment (proof of opening) | $W$ | [[03-kzg-pcs\|Lesson 03]] |
| $P_{\mathsf{poly}}, V_{\mathsf{poly}}$ | Prover/Verifier trong polynomial protocol | $P_{\mathsf{poly}}, V_{\mathsf{poly}}$ | [[04-polynomial-protocols\|Lesson 04]] |
| $\mathcal{I}$ | Trusted polynomial oracle | $I$ | [[04-polynomial-protocols\|Lesson 04]] |
| $g_1, \ldots, g_\ell$ | Preprocessed (circuit-specific) polynomials | $g_1, \ldots, g_\ell$ | [[04-polynomial-protocols\|Lesson 04]] |
| $H$ | Multiplicative subgroup bậc $n$ của $\mathbb{F}$ | $H$ | [[05-permutation-argument\|Lesson 05]] |
| $\omega$ | Primitive $n$-th root of unity (generator của $H$) | $g$ (paper) | [[05-permutation-argument\|Lesson 05]] |
| $Z_H(X) = X^n - 1$ | Vanishing polynomial của $H$ | $Z_H(X)$ | [[05-permutation-argument\|Lesson 05]] |
| $Z(X)$ | Accumulator polynomial (grand product) | $Z(X)$ | [[05-permutation-argument\|Lesson 05]] |
| $\beta, \gamma$ | Verifier challenges cho permutation check | $\beta, \gamma$ | [[05-permutation-argument\|Lesson 05]] |
| $S_{\mathsf{ID},j}, S_{\sigma,j}$ | Identity / permutation polynomials | $S_{\mathsf{ID},j}, S_{\sigma,j}$ | [[05-permutation-argument\|Lesson 05]] |
| $\mathcal{C} = (V, Q)$ | Constraint system | $C = (V, Q)$ | [[06-plonk-arithmetization\|Lesson 06]] |
| $a(X), b(X), c(X)$ | Wire polynomials (left/right/output) | $f_L, f_R, f_O$ | [[06-plonk-arithmetization\|Lesson 06]] |
| $q_L, q_R, q_O, q_M, q_C$ | Selector polynomials (preprocessed) | $q_L, q_R, q_O, q_M, q_C$ | [[06-plonk-arithmetization\|Lesson 06]] |
| $\mathsf{PI}(X)$ | Public input polynomial | $\mathsf{PI}(X)$ | [[06-plonk-arithmetization\|Lesson 06]] |
| $\alpha$ | Verifier challenge Round 2 | $\alpha$ | [[07-plonk-protocol\|Lesson 07]] |
| $\zeta$ | Verifier evaluation point | $\mathfrak{z}$ (paper) | [[07-plonk-protocol\|Lesson 07]] |
| $t(X) = t_{lo} + X^n t_{mid} + X^{2n} t_{hi}$ | Quotient polynomial | $t(X)$ | [[07-plonk-protocol\|Lesson 07]] |
| $r(X)$ | Linearization polynomial | $r(X)$ | [[07-plonk-protocol\|Lesson 07]] |
| $\bar{a}, \bar{b}, \bar{c}, \bar{s}_{\sigma i}, \bar{z}_\omega$ | Evaluations tại $\zeta$ | — | [[07-plonk-protocol\|Lesson 07]] |
| $W_\zeta, W_{\zeta\omega}$ | KZG opening proofs | $W_\mathfrak{z}, W_{\mathfrak{z}\omega}$ | [[07-plonk-protocol\|Lesson 07]] |

*(Thêm ký hiệu mới vào đây sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [FKL18] Fuchsbauer, Kiltz, Loss — *The Algebraic Group Model and its Applications*, CRYPTO 2018 — integrated in Lesson 02: AGM definition, ideal/real pairing check
- [KZG10] Kate, Zaverucha, Goldberg — *Constant-Size Commitments to Polynomials*, ASIACRYPT 2010 — to be integrated in Lesson 03
- [MBKM] Maller, Bowe, Kohlweiss, Meiklejohn — *Sonic*, CCS 2019 — to be integrated in Lesson 03: batched opening protocol
- [BG12] Bayer, Groth — *Efficient Zero-Knowledge Argument for Correctness of a Shuffle*, EUROCRYPT 2012 — to be integrated in Lesson 05

### 🔴 Prerequisites

- [Gro16] Groth — *On the Size of Pairing-based Non-interactive Arguments*, EUROCRYPT 2016
- [MBKM] Maller et al. — *Sonic* (cũng là 🟡 Integrate nhưng cần hiểu Sonic là tiền thân)
- [BGM17] Bowe, Gabizon, Miers — Universal updatable SRS construction

### ⚪ Citations only

- [CHM+19] Chiesa, Hu, Maller et al. — *Marlin*, EUROCRYPT 2020
- [COS19] Chiesa, Ojha, Spooner — *Fractal*, EUROCRYPT 2020
- [GGPR13] Gennaro, Gentry, Parno, Raykova — *Quadratic Span Programs and SNARKs*
- [CS10] Chatterjee, Scott — pairing optimization (30% speedup on fixed G₂)
