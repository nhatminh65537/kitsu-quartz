---
title: "Efficient ZK Arguments in the Discrete Log Setting"
type: index
tags: [zero-knowledge, discrete-log, qesa, bulletproofs, index]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

Paper này hệ thống hóa các kỹ thuật thiết kế zero-knowledge argument trong discrete log setting và giới thiệu LMPAZK + QESAZK — arguments hiệu quả với communication $O(\log n)$ cho hệ quadratic equations tổng quát hơn R1CS của Bulletproofs, không cần trusted setup. Course này giúp nắm vững toàn bộ construction, security analysis, và ứng dụng thực tế.

**Tài liệu gốc**: [ePrint 2019/944](https://eprint.iacr.org/2019/944)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-zk-dlog-foundation|01. ZK Arguments — Foundation]]

Cover §1–2.2: hệ thống bốn design principles (probabilistic verification, linear combination, uniform-or-unique responses, kernels/redundancy), implicit notation $[x] = x \cdot [1]$, hard kernel assumption (tổng quát dlog), Pedersen commitment, và định nghĩa HVZK + Fiat–Shamir.

### [[02-testing-distributions|02. Testing Distributions & Special Soundness]]

Cover §2.3–2.4: testing distribution $\chi_m$ (soundness error $\delta_\text{snd}$), Lemma Schwartz–Zippel mở rộng cho subdistributions, dual testing distribution (enforce $z=0$ không cần proof), $\mu$-special soundness, và short-circuit extraction — phân tích định lượng chặt cho extraction efficiency ($O(\log n)$ thay vì $O(n^{1.58})$).

### [[03-sigma-lmpabatch|03. Σstd & LMPAbatch]]

Cover §3.1–3.3: Protocol Σstd (3-move HVZK-PoK, perfectly complete, 2-special sound), Protocol LMPAbatch (5-move, loại bỏ phụ thuộc $m$ bằng commit-then-batch, $(m,2)$-special sound với $(1,2)$ short-circuit extraction), AND-compilation, commitment extending, và open problem Q3.7 về soundness của batching không commitment.

### [[04-lmpazk|04. LMPAnoZK và LMPAZK]]

Cover §3.4–3.5: outer product trick, off-diagonal testing distribution, Protocol LMPAnoZK (recursive witness compression, $O(\log n)$ communication), Lemma 3.10 (3 modes extraction + short-circuit bound $O(\log n)$), và ZK conversion thành LMPAZK (linear combination của hai instances, constant overhead, perfect HVZK). Pivot point của toàn course.

### [[05-ipa-almzk|05. IPAalmZK — Almost-ZK Inner Product Argument]]

Cover §4.1: IPA không ZK (Protocol 4.1, từ [Boo16]/[Bün18]), kỹ thuật kernel/redundancy để build masking vectors $r, s$ với $\langle r, y\rangle = \langle r,s\rangle = \langle x,s\rangle = 0$ dùng chỉ $\log n$ random components, và IPAalmZK ($\varepsilon$-statistical HVZK với constant communication overhead). Giải thích tại sao "almost" thay vì "perfect" ZK.

### [[06-qesazk|06. QESAZK — Quadratic Equation Satisfiability Argument]]

Cover §4.2–4.3 và §1.2.3: QESAZK là adaptive commit-and-prove argument cho $N$ quadratic equations $\langle w, \Gamma_i w\rangle = 0$ — batch thành $\Gamma = \sum r_i\Gamma_i$ rồi dùng IPAalmZK. So sánh QE vs R1CS: $\langle x,x\rangle=t$ cần 1 QE thay vì $n$ R1CS; polynomial degree $d^2$ cần $2d$ QE thay vì $O(d^2)$ R1CS. Prover computation $\approx 8n$ exponentiations so với $\approx 12n$ của Bulletproofs.

### [[07-range-proofs-impl|07. Range Proofs and Implementation]]

Cover §5 và §1.2.9: encoding range proof $v \in [0, 2^n)$ thành $n$ QE equations $b_i(b_i-1)=0$ + 1 linear constraint, aggregate range proofs với witness extension, và benchmark so sánh QESAZK generic với Bulletproofs dedicated — prover runtime $\approx 0.7\times$, với 140-bit exponents $\approx 0.63\times$. Implementation C++ dùng RELIC toolkit.

### [[08-design-principles|08. Design Principles Synthesized]]

Lesson tổng hợp: truy ngược 4 design principles (P1–P4) trong mọi protocol của course (Σstd → LMPAbatch → LMPAnoZK → LMPAZK → IPAalmZK → QESAZK). Mapping table đầy đủ, lý giải tại sao "almost ZK" không tránh được cho IPA, các open problems còn lại, và thông điệp thống nhất của paper.

### [[a0-shuffle-argument|A0. Shuffle Argument — Correctness of a Shuffle]]

Cover Appendix C: Protocol $\Pi_\text{shuffle}$ cho shuffle của $N$ ElGamal ciphertexts — framework Bayer-Groth [BGro12] với LMPAZK + QESAZK thay thế subprotocols, shared commitment linking hai phases, proof size $O(\log N)$ (first known), computation $O(N)$ với $2\text{–}3\times$ overhead. Ứng dụng e-voting, mix-nets.

### [[a1-wee-extraction|A1. Witness-Extended Emulation & Extraction Bounds]]

Cover Appendix D: Witness-extended emulation (WEE) là security notion mạnh hơn PoK; knowledge error tích lũy $O(\log n / p)$ qua multi-round; bounds $O(n \log n)$ transcripts cho LMPAZK/QESAZK (vs $O(n^3 N)$ của [Bün18]); loophole về TreeFinder runtime; conjectured optimal $O(n/\log n)$ (gap $O(\log^2 n)$ còn lại).

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $\kappa$ | Security parameter | $\kappa$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\mathsf{negl}(\kappa)$ | Negligible function | $\mathsf{negl}$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $p$ | Số nguyên tố bậc nhóm | $p$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\mathbb{F}_p$ | Trường $\mathbb{Z}/p\mathbb{Z}$ | $\mathbb{F}_p$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $G$ | Nhóm cyclic bậc nguyên tố $p$ | $\mathbb{G}$ (standard) | [[01-zk-dlog-foundation\|Lesson 01]] |
| $[x]$ | $x \cdot [1] \in G$ (implicit representation) | $[x]$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $[1]$ | Generator cố định công khai | $[1]$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $[A]$ | Ma trận nhóm $A_{ij} \cdot [1]$ | $[A]$ (bold) | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\mathsf{ck}$ | Commitment key | $\mathsf{ck}$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\mathsf{crs}$ | Common Reference String | $\mathsf{crs}$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $P, V$ | Prover, Verifier | $P, V$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\mathsf{st}, w$ | Statement và witness | $\mathsf{st}, w$ | [[01-zk-dlog-foundation\|Lesson 01]] |
| $\chi_m$ | Testing distribution trên $\mathbb{F}_p^m$ | $\chi_m$ | [[02-testing-distributions\|Lesson 02]] |
| $\delta_\text{snd}(\chi_m)$ | Soundness error của $\chi_m$ | $\delta_\mathsf{snd}$ | [[02-testing-distributions\|Lesson 02]] |
| $\psi$ | Subdistribution của $\chi_m$ | $\psi$ | [[02-testing-distributions\|Lesson 02]] |
| $p_\infty(\chi)$ | $\sup_x \chi(x)$ | $p_\infty(\chi)$ | [[02-testing-distributions\|Lesson 02]] |
| $\mu = (\mu_0, \ldots, \mu_{n-1})$ | Tuple kích thước $\mu$-tree | $\mu$ | [[02-testing-distributions\|Lesson 02]] |
| $\chi_m^\vee$ | Dual testing distribution | $\chi_m^\vee$ | [[02-testing-distributions\|Lesson 02]] |
| $[A] \in G^{m \times n}$ | Ma trận linear map | $[A]$ | [[03-sigma-lmpabatch\|Lesson 03]] |
| $[t] \in G^m$ | Target vector | $[t]$ | [[03-sigma-lmpabatch\|Lesson 03]] |
| $[a] \in G^m$ | Commitment $[A]r$ (first message) | $[a]$ | [[03-sigma-lmpabatch\|Lesson 03]] |
| $[c_w] \in G$ | Commitment to witness $w$ | $[c_w]$ | [[03-sigma-lmpabatch\|Lesson 03]] |
| $k$ | Reduction factor mỗi round | $k$ | [[04-lmpazk\|Lesson 04]] |
| $[u_\ell]$ | Off-diagonal partial sum $\sum_{j-i=\ell}[A_i]w_j$ | $[u_\ell]$ | [[04-lmpazk\|Lesson 04]] |
| $w_b$ | Compressed witness $\sum_i y_i w_i$ | $w_b$ | [[04-lmpazk\|Lesson 04]] |
| $\langle x, y \rangle$ | Inner product $\sum_i x_i y_i$ | $\langle x, y \rangle$ | [[05-ipa-almzk\|Lesson 05]] |
| $r, s$ | Masking vectors (kernel constraints) | $r, s$ | [[05-ipa-almzk\|Lesson 05]] |
| $\Gamma_i \in \mathbb{F}_p^{n \times n}$ | Quadratic equation matrix | $\Gamma_i$ | [[06-qesazk\|Lesson 06]] |
| $N$ | Số quadratic equations | $N$ | [[06-qesazk\|Lesson 06]] |
| $v \in [0, 2^n)$ | Secret value trong range proof | $v$ | [[07-range-proofs-impl\|Lesson 07]] |
| $b \in \{0,1\}^n$ | Bit decomposition của $v$ | $b$ | [[07-range-proofs-impl\|Lesson 07]] |
| $m$ | Số values aggregate | $m$ | [[07-range-proofs-impl\|Lesson 07]] |

*(Cập nhật sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [MRV16] Morillo, Ràfols, Villar — *The Kernel Matrix Diffie-Hellman Assumption*, ASIACRYPT 2016 — integrated in Lesson 01: Definition 2.1 (hard kernel assumption)
- [Att20] Attema, Fehr, Klooß — *Fiat-Shamir Transformation of Multi-Round Interactive Proofs*, TCC 2022 — integrated in Lesson 02: TreeFinder generalization, extraction runtime bounds
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 — integrated in Lesson 04: Protocol LMPAnoZK
- [Bün18] Bünz et al. — *Bulletproofs*, S&P 2018 — integrated in Lessons 05, 06, 07: IPA, QESAZK, benchmarks
- [BGro12] Bayer, Groth — *Efficient Zero-Knowledge Argument for Correctness of a Shuffle*, EUROCRYPT 2012 — integrated in A0: Shuffle argument

### 🔴 Prerequisites

- Boneh, Shoup — *A Graduate Course in Applied Cryptography* (DLP, Pedersen commitment, Sigma-protocols)
- [GK15] Groth, Kohlweiss — Ideal Linear Commitment model (background cho QE/ILC connection)

### ⚪ Citations only

- [Gro16] Groth — *On the Size of Pairing-based Non-interactive Arguments*, EUROCRYPT 2016
- [Ben18] Ben-Sasson et al. — *Scalable Zero Knowledge with No Trusted Setup*, CRYPTO 2019
- [FS86] Fiat, Shamir — *How to Prove Yourself*, CRYPTO 1986
