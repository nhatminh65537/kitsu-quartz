---
title: "FFLONK"
tags: [crypto, zk-snark, fflonk, index]
created: 2026-03-13
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-zk-foundations|01. ZK-SNARK Foundations]] — zk-SNARK là gì, ba tính chất Completeness/Soundness/Zero-Knowledge, bilinear pairing, đường cong BN254.
- [[02-polynomial-commitments|02. Polynomial Commitment Schemes]] — Định nghĩa PCS, KZG scheme đầy đủ, batch opening, hiding vs binding.
- [[03-plonk|03. PLONK Protocol]] — Arithmetization, permutation argument, linearization trick, prover/verifier pipeline.
- [[04-fflonk-core|04. FFLONK Core Idea]] — FFT-like identity $C(X) = \sum X^i f_i(X^t)$. Combining $t$ polynomials → 1. Trade-off prover/verifier. SHPLONK inner PCS.
- [[05-fflonk-prover|05. FFLONK Prover Algorithm]] — 5-round prover: commit $C_1,C_2$, evaluations, opening proofs $W_1,W_2$. Proof = 768 bytes. Blinding factors, accumulator boundary.
- [[06-fflonk-verifier|06. FFLONK Verifier Algorithm]] — 5 bước verifier: range/subgroup check → challenges → algebraic → $[F]_1,[E]_1$ → pairing. 5 scalar muls + 2 pairings. Bug classes: subgroup check, infinity, VK substitution.
- [[07-trusted-setup|07. Trusted Setup & Powers of Tau]] — Tại sao $\tau$ là "toxic waste". SRS $9n$ G1 elements. MPC ceremony: 1-of-n honest party. SRS consistency verification. Polygon CDK ceremony.
- [[08-fiat-shamir|08. Fiat-Shamir Transform in FFLONK]] — Transcript thứ tự chính xác. Last Challenge Attack (LCA): upsilon không bind $W_1,W_2$. Weak Fiat-Shamir taxonomy. Checklist audit transcript.
- [[09-security-analysis|09. Security Analysis & Threat Model]] — q-SDH assumption. Threat model zkVerify. Soundness per bug class. Formal security của FFLONK. Differential analysis FFLONK vs PLONK.
- [[10-zkverify-implementation|10. zkVerify FFLONK Implementation]] — Cấu trúc Rust crate `fflonk_verifier`. Entry point `verify()`, proof/VK deserialization, transcript Keccak256, audit checklist 14 items. Test vector từ Polygon CDK.
- [[11-bug-hunting|11. Bug Hunting on FFLONK]] — 5 bug classes chi tiết: subgroup check, transcript completeness, field overflow, public input binding, VK validation. PoC template cho Immunefi. Hunting workflow 5 phases, grep commands.

## Appendices

- [[a0-bn254-reference|A0. BN254 Curve Reference]] — Tham số BN254: $p, r, G_1, G_2$. Twists, cofactors, subgroup orders. Python verification code.
- [[a1-field-ops-cheatsheet|A1. Field Operations Cheatsheet]] — Arithmetic trong $\mathbb{F}_p$ và $\mathbb{F}_r$. Modular inverse, Lagrange, roots of unity. Common pitfalls.
- [[a2-proof-structure|A2. FFLONK Proof Structure Reference]] — 768-byte proof layout: 24 elements, byte offsets, types. VK field reference. Transcript state machine.

---

## Tool & Library Guide

| Tool / Library | Mục đích | Cài đặt |
|----------------|---------|---------|
| `py_ecc` | Elliptic curve operations, BN128/BN254, pairing | `pip install py_ecc` |
| `SageMath` | Polynomial rings, field arithmetic, symbolic math | `sudo apt install sagemath` |
| `snarkjs` | FFLONK prove/verify JavaScript CLI | `npm install -g snarkjs` |
| `circom` | Circuit compiler cho FFLONK | xem docs.circom.io |
| `fflonk_verifier` (zkVerify) | Rust implementation của FFLONK verifier | github.com/zkVerify/fflonk_verifier |

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{F}_p$ | Trường hữu hạn (finite field) với $p$ phần tử |
| $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ | Ba nhóm của bilinear pairing |
| $e(\cdot, \cdot)$ | Hàm pairing: $\mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ |
| $[x]_1$ | Điểm $x \cdot G_1$ trong $\mathbb{G}_1$ (scalar multiplication) |
| $[x]_2$ | Điểm $x \cdot G_2$ trong $\mathbb{G}_2$ |
| $\tau$ | Trapdoor của trusted setup (phải bị xóa sau ceremony) |
| SRS | Structured Reference String — output của trusted setup |
| PCS | Polynomial Commitment Scheme |
| KZG | Kate–Zaverucha–Goldberg — PCS dùng pairing |
| VK | Verification Key |
| $\text{negl}(\lambda)$ | Negligible function trong security parameter $\lambda$ |
| AGM | Algebraic Group Model |

## Lesson 04 — [[04-fflonk-core|FFLONK Core Idea]]
FFT-like identity: combining $t$ polynomials thành 1, evaluations tại $t$ roots of unity recover $f_i(z^t)$. Trade-off prover/verifier, SRS mở rộng, và SHPLONK làm inner PCS.
**Key concepts**: FFT-like identity, combined polynomial $C(X) = \sum X^i f_i(X^t)$, Vandermonde recover, SRS $9n$ vs $3n$

## Lesson 05 — [[05-fflonk-prover|FFLONK Prover Algorithm]]
5-round prover: commit $C_1, C_2$, tính evaluations, tạo opening proofs $W_1, W_2$. Proof format 768 bytes (24 elements). Blinding factors và accumulator boundary.
**Key concepts**: $C_1, C_2$ combined polynomials, Fiat-Shamir transcript, proof layout, blinding factors, accumulator $z$

## Lesson 06 — [[06-fflonk-verifier|FFLONK Verifier Algorithm]]
5-step verifier: range/subgroup check → challenges → algebraic constraints → rebuild $[F]_1, [E]_1$ → pairing. 5 scalar muls + 2 pairings. Các bug class: subgroup check thiếu, transcript không đầy đủ, infinity point, field overflow.
**Key concepts**: subgroup check, pairing equation, $[F]_1 = [C_1] + \upsilon[C_2]$, 5 scalar muls, VK substitution attack
