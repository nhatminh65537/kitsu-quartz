---
title: "STARKs & FRI Protocol"
tags: [cryptography, starks, fri-protocol, zkverify, bug-bounty, index]
created: 2026-03-13
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-mathematical-foundations|01. Mathematical Foundations]] — Trường hữu hạn $\mathbb{F}_p$, primitive root, roots of unity, NTT/FFT $O(n \log n)$, Reed-Solomon code & code rate $\rho$, Schwartz-Zippel lemma, zerofier $X^n - 1$. Nền tảng toán học cho toàn bộ STARK/FRI pipeline.
- [[02-zero-knowledge-proof-systems|02. Zero-Knowledge Proof Systems]] — IP, PCP, IOP model, Completeness/Soundness/ZK, public-coin, Fiat-Shamir transform, 4 attack vectors.
- [[03-starks-air-arithmetization|03. STARKs Overview & Arithmetization (AIR)]] — Execution trace $T \in \mathbb{F}^{n \times w}$, boundary constraints, transition constraints, AIR, trace polynomials, quotient polynomials, zerofier $Z_{\text{trans}}$.
- [[04-fri-commit-fold|04. FRI Protocol — Commit & Fold]] — Low-degree testing, Reed-Solomon IOPP, split-and-fold $g(x^2) = \frac{f(x)+f(-x)}{2} + \alpha \cdot \frac{f(x)-f(-x)}{2x}$, Merkle commitments, batched FRI.
- [[05-fri-query-verification|05. FRI Protocol — Query & Verification]] — Query phase, colinearity check, decommitment, soundness error $\epsilon = (1-\delta)^q$, DEEP-FRI, proof size $O(\lambda \log^2 n)$.
- [[06-full-stark-pipeline|06. Full STARK Pipeline]] — LDE, constraint evaluation, DEEP-ALI composition, Fiat-Shamir non-interactive, prover/verifier flow, proof size analysis.
- [[07-zkverify-architecture|07. zkVerify Architecture]] — Substrate L1, verifier pallets (Groth16/Fflonk/RISC Zero/Plonky2/SP1/UltraPlonk/UltraHonk/EZKL/TEE), proof submission flow, proof receipts.
- [[08-attack-vectors-bug-classes|08. Attack Vectors & Bug Classes]] — 6 bug groups với Python demos: under-constrained AIR, degree miscalc, Fiat-Shamir weakness, Merkle second-preimage, field overflow, protocol bugs. 30-item audit checklist.
- [[09-bug-bounty-mindset|09. Bug Bounty Mindset on zkVerify]] — 7-step audit process, PoC construction, Immunefi submission template, fuzzing strategy, unaudited surfaces (EZKL, ParaVerifier, XCM).

## Appendices

- [[A0-math-reference|A0. Mathematical Reference Sheet]] — Tất cả ký hiệu, định nghĩa, định lý, công thức FRI/AIR/STARK. Bảng degree bounds, common fields, complexity summary.
- [[A1-fri-pseudocode|A1. FRI Full Pseudocode & Parameter Guide]] — Pseudocode đầy đủ: FRI_Commit, FRI_Query, FRI_Verify, DEEP_Commit, DEEP_Verify, STARK_Prove. Bảng security parameters.
- [[A2-bug-cheatsheet|A2. STARK/FRI Bug Cheatsheet]] — 24 bug classes B-01..B-24 (Critical/High/Medium/Low). Grep commands, impact matrix, decision tree.

## Tool & Library Guide

| Tool / Library | Purpose | Ngôn ngữ |
|----------------|---------|----------|
| `aszepieniec/stark-anatomy` | Tutorial STARK đầy đủ với Python implementation | Python |
| `facebook/winterfell` | Production STARK prover/verifier | Rust |
| `lambdaclass/lambdaworks` | FRI & STARK implementation dùng trong zkVerify | Rust |
| `srlabs audit report` | Báo cáo audit zkVerify baseline 2025 | PDF |
| `Immunefi zkVerify` | Bug bounty scope & reward tiers | Web |

## Notation Guide

| Symbol | Ý nghĩa |
|--------|---------|
| $\mathbb{F}_p$ | Trường hữu hạn (finite field) với $p$ là số nguyên tố |
| $\omega$ | Generator của subgroup $(\mathbb{F}_p^*, \times)$, dùng làm root of unity |
| $D$ | Evaluation domain — tập các điểm để evaluate polynomial |
| $\rho$ | Code rate của Reed-Solomon code: $\rho = \deg(f) / |D|$ |
| $f(X)$ | Polynomial cần chứng minh là low-degree |
| AIR | Algebraic Intermediate Representation — cách biểu diễn computation bằng constraints |
| IOP | Interactive Oracle Proof — mô hình proof system tổng quát |
| IOPP | IOP of Proximity — variant kiểm tra proximity to code |
| FRI | Fast Reed-Solomon IOP of Proximity |
| $\lambda$ | Security parameter (số bit bảo mật, thường 128) |
| $\epsilon$ | Soundness error — xác suất verifier bị lừa |
