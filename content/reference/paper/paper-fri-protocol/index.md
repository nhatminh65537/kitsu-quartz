---
title: "FRI Protocol"
type: index
tags: [fri-protocol, index]
source: "Fast Reed-Solomon Interactive Oracle Proofs of Proximity — Ben-Sasson, Bentov, Horesh, Riabzev, ICALP 2018"
created: 2026-03-15
---

FRI (Fast RS IOPP) là Interactive Oracle Proof of Proximity đầu tiên cho họ mã Reed-Solomon đạt prover complexity tuyến tính nghiêm ngặt (< 6N) và verifier complexity logarithmic nghiêm ngặt (≤ 21 log N), đồng thời là nền tảng lý thuyết của ZK-STARK. Course này distill toàn bộ 17 trang ICALP 2018 thành 6 lessons, từ mô hình IOPP đến phân tích soundness và ứng dụng thực tế.

**Tài liệu gốc**: [Fast RS IOPP, ICALP 2018](https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-rs-iopp-foundations|01. RS Codes & IOPP Foundations]]

Xây dựng nền tảng cho toàn course: định nghĩa RS code $\mathsf{RS}[F, S, \rho]$ và RS proximity problem, so sánh ba mô hình giải bài toán (Testing / PCPP / IOPP), định nghĩa chính thức IOP (từ [BCS16]) và IOPP (Definition 1 từ [12]) với completeness và soundness function $s^-(\delta)$.

### [[02-fri-main-theorem|02. FRI Main Theorem & Complexity]]

Phát biểu chính xác Theorem 2 — bốn properties đồng thời của FRI: prover < 6N ops, verifier ≤ 21 log N ops, query complexity 2 log N, soundness $\min\{\delta, \delta_0\}$, và parallelization O(1)/message. Bổ sung Conjecture 3 (soundness tối ưu $\delta_0 \to 1 - \rho$) và Remark về space complexity $O(\log |F|)$.

### [[03-fri-commit-phase|03. FRI COMMIT Phase]]

Trình bày cơ chế degree-folding trung tâm của FRI: phân tách $P^{(0)}$ thành bivariate $Q^{(1)}(X,Y)$ qua IFFT decomposition, folding map $q^{(0)}(X) = X^2$ ánh xạ 2-to-1 từ $L^{(0)}$ sang $L^{(1)}$, và round consistency test (3 queries: 2 từ $f^{(0)}$, 1 từ $f^{(1)}$). Chứng minh completeness và phân tích complexity $O(N)$ prover qua geometric series. Integrate [23] (quasilinear PCPP): giải thích vì sao FRI "biased" ($\deg_X Q^{(1)} = 1$) loại bỏ constant soundness loss.

### [[04-fri-query-phase|04. FRI QUERY Phase & Formal Protocol]]

Cover §2.1.1: lý do binary fields cần folding map khác (Frobenius problem), affine subspace polynomial bậc 4 như $q^{(0)}$ (4-to-1, image là additive coset $L^{(1)}$ bậc $N/4$), linearized polynomials. Phân tách formal protocol thành COMMIT phase (prover gửi tất cả oracles trước) và QUERY phase (verifier query sau khi có đủ, dùng shared queries giữa rounds liền kề). Sequence diagram đầy đủ + bảng giải thích nguồn gốc từng con số của Theorem 2.

### [[05-fri-soundness|05. FRI Soundness Analysis]]

Phân tích cơ chế soundness của FRI: proof composition (mỗi round quy domain lớn → nhỏ), lý do prior works mất constant soundness per round qua bivariate testing theorem [PS94], và tại sao FRI "biased degrees" chỉ mất additive $O(1/|F|)$ per round dưới unique decoding radius. Theorem 5.1: $\varepsilon_\text{round} + \delta^{(1)} \geq \delta^{(0)} - \text{negl}$ với xác suất cao theo challenge $x^{(0)}$. Hệ quả: FRI có thể dùng $\Theta(\log N)$ rounds thay vì $O(\log\log N)$ của prior works.

### [[06-fri-applications|06. Applications, Concrete Complexity & Landscape]]

Đặt FRI vào bức tranh thực tế: ZK-STARK (transparent + universal + doubly scalable), chuỗi biên dịch FRI → Kilian (Merkle hash) → Micali (Fiat-Shamir) → non-interactive CS proof. Communication complexity formula $\mathsf{CC} = q \cdot \log|F| + \mathsf{AP} \cdot \lambda$ (Eq. 2) với ví dụ số cho $d \in [2^{12}, 2^{26}]$. Round-complexity trade-off và non-interactive compilation. So sánh với QSP-SNARK, SCI, các IOP/PCP liên quan.

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $F$ hoặc $\mathbb{F}$ | Finite field | $F$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $S \subseteq F$ | Evaluation set, $\lvert S \rvert = N$ | $S$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $N$ | Block-length $= \lvert S \rvert$ | $N$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $\rho \in (0,1]$ | Code rate | $\rho$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $d$ | Degree bound, $d < \rho N$ | $d$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $\mathsf{RS}[F, S, \rho]$ | Reed-Solomon code | $\mathsf{RS}[F, S, \rho]$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $\Delta(f, C)$ | Relative Hamming distance từ $f$ đến code $C$ | $\Delta$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $\delta$ | Proximity parameter | $\delta$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $r$ | Round complexity | $r$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $\ell(N)$ | Proof length | $\ell(N)$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $q(N)$ | Query complexity | $q(N)$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $s^-(\delta)$ | Soundness function | $s^-(\delta)$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $P, V$ | Prover và Verifier | $P, V$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $f^{(0)}$ | Input codeword (first prover message / claim) | $f^{(0)}$ | [[01-rs-iopp-foundations\|Lesson 01]] |
| $R$ | Rate exponent, $\rho = 2^{-R}$ | $R$ | [[02-fri-main-theorem\|Lesson 02]] |
| $\delta_0$ | Soundness radius trong Theorem 2 | $\delta_0$ | [[02-fri-main-theorem\|Lesson 02]] |
| $L^{(0)}$ | Binary additive evaluation domain (additive coset) | $L^{(0)}$ | [[02-fri-main-theorem\|Lesson 02]] |
| $H$ | Smooth multiplicative group ($\lvert H \rvert = 2^k$) | $H$ | [[02-fri-main-theorem\|Lesson 02]] |

| $\omega^{(i)}$ | Generator của domain $L^{(i)}$ (multiplicative setting) | $\omega^{(i)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $L^{(i)}$ | Domain tại round $i$; $\lvert L^{(i)} \rvert = N/2^i$ (×2 folding) hoặc $N/4^i$ (×4 folding) | $L^{(i)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $f^{(i)} : L^{(i)} \to F$ | Oracle prover gửi ở round $i$ ($f^{(0)}$ là input) | $f^{(i)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $q^{(i)}(X)$ | Folding map tại round $i$: $X^2$ (multiplicative) hoặc affine subspace poly bậc 4 (binary) | $q^{(i)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $Q^{(i+1)}(X,Y)$ | Bivariate polynomial từ IFFT decomposition: $\deg_X < 4$, $\deg_Y < \rho N/4^i$ | $Q^{(i+1)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $x^{(i)}$ | Verifier's random challenge ở round $i$: $x^{(i)} \stackrel{R}{\leftarrow} F$ | $x^{(i)}$ | [[03-fri-commit-phase\|Lesson 03]] |
| $y^{(i)}$ | Verifier's query point ở QUERY phase, $y^{(i)} \in L^{(i+1)}$ | $y^{(i)}$ | [[04-fri-query-phase\|Lesson 04]] |
| $Z_V(X)$ | Affine subspace polynomial của $\mathbb{F}_2$-linear space $V$ | $Z_V$ | [[04-fri-query-phase\|Lesson 04]] |

| $\delta^{(i)}$ | Distance của $f^{(i)}$ từ $\mathsf{RS}[F, L^{(i)}, \rho]$ | $\delta^{(i)}$ | [[05-fri-soundness\|Lesson 05]] |
| $\varepsilon_\text{round}$ | Round consistency error per round | — | [[05-fri-soundness\|Lesson 05]] |
| $\frac{1-\rho}{2}$ | Unique decoding radius | — | [[05-fri-soundness\|Lesson 05]] |
| $\mathsf{CC}_{\delta,\varepsilon}(N)$ | Communication complexity (bits) của compiled argument | $\mathsf{CC}_{\delta,\varepsilon}$ | [[06-fri-applications\|Lesson 06]] |
| $\mathsf{AP}_{\delta,\varepsilon}$ | Số nodes authentication paths trong Merkle trees | $\mathsf{AP}$ | [[06-fri-applications\|Lesson 06]] |
| $\lambda$ | Output length của hash function (bits) | $\lambda$ | [[06-fri-applications\|Lesson 06]] |

*(Notation table hoàn chỉnh — course đã cover toàn bộ paper.)*

---

## References

### 🟡 Integrated

- [BCS16] = [19] Ben-Sasson, Chiesa, Spooner — *Interactive Oracle Proofs*, TCC 2016 — integrated in [[01-rs-iopp-foundations|Lesson 01]]: IOP framework, transparency, compiler to non-interactive proof
- [12] Ben-Sasson, Chiesa, Forbes, Gabizon, Riabzev, Spooner — *On Probabilistic Checking in Perfect ZK*, ECCC 2016 — integrated in [[01-rs-iopp-foundations|Lesson 01]]: Definition 1 (IOPP), completeness/soundness conditions
- [23] Ben-Sasson, Sudan — *Short PCPs with polylog query complexity*, SICOMP 2008 — sẽ integrate sâu trong [[03-fri-commit-phase|Lesson 03]]: quasilinear RS-PCPP, bivariate decomposition
- [53] Polischuk, Spielman — *Nearly-linear holographic proofs*, STOC 1994 — sẽ integrate trong [[05-fri-soundness|Lesson 05]]: bivariate testing theorem
- [43] Kilian — *Efficient ZK proofs*, STOC 1992 — sẽ integrate trong [[06-fri-applications|Lesson 06]]: Merkle-hash compilation
- [49] Micali — *Computationally sound proofs*, SICOMP 2000 — sẽ integrate trong [[06-fri-applications|Lesson 06]]: CS proof / RO compilation

### 🔴 Prerequisites

- [RS60] Reed, Solomon — *Polynomial codes over certain finite fields*, JSIAM 1960 — RS code definition
- [BS08] = [23] Ben-Sasson, Sudan — *Short PCPs with polylog query complexity*, SICOMP 2008 — quasilinear PCPP background
- [BGHSV06] = [21] Ben-Sasson et al. — *Robust PCPs of proximity*, SICOMP 2006 — PCPP model
- [AS98] = [3] Arora, Safra — *Probabilistic checking of proofs*, J. ACM 1998 — PCP Theorem

### ⚪ Citations only

- [10] Ben-Sasson et al. — *Fast RS IOPP full version*, ECCC TR17-134, 2017
- [11] Ben-Sasson et al. — *ZK-STARK paper*, 2017
- [7] Ben-Sasson et al. — *SCI system*, ePrint 2016:646
- [26] Cooley, Tukey — *FFT algorithm*, Mathematics of Computation 1965
