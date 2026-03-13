---
title: "Groth16"
tags: [crypto, groth16, zksnark, index]
created: 2026-03-12
---

## Navigation

- [[00-roadmap|00. Roadmap]] — Dependency graph, progress tracker, danh sách lesson đầy đủ

## Lessons

- [[01-r1cs-groth16-bridge|01. R1CS → Groth16 Bridge]] — Witness split public/private; $z_0 = 1$; R1CS → QAP bridge; homomorphic hiding; prover chỉ dùng CRS elements.
- [[02-qap-groth16-bridge|02. QAP → Groth16 Bridge]] — Schwartz-Zippel; tại sao evaluate tại $\tau$ ẩn; QAP polynomials $A_i, B_i, C_i$ trong CRS; role của $t(\tau)$ và $h(x)$.
- [[03-pairings-groth16|03. Bilinear Pairings trong Groth16]] — Type III pairing; ký hiệu $[x]_1, [x]_2$; 3 pairing checks; BN254 vs BLS12-381; proof size 128 bytes.
- [[04-trusted-setup-crs|04. Trusted Setup & CRS]] — Cấu trúc proving key và verifying key; Phase 1 (Powers of Tau MPC); Phase 2 (circuit-specific); 5 toxic waste elements; $\gamma \neq \delta$.
- [[05-groth16-prover|05. Groth16 Prover]] — Tính $[A]_1, [B]_2, [C]_1$; polynomial division $h(x)$; cross-terms $s[A] + r[B] - rs[\delta]$ cho ZK; prover cost $O(m \log m)$.
- [[06-groth16-verifier|06. Groth16 Verifier]] — Verification equation; public input aggregation $[L_\text{pub}]_1$; tại sao equation đúng (algebraic cancellation); sub-group check; on-chain Solidity.
- [[07-completeness-soundness-zk|07. Completeness, Soundness & Zero-Knowledge]] — Perfect completeness; computational knowledge soundness (GGM); perfect ZK với fresh $r, s$; malleability; simulation extractability.
- [[08-circom-snarkjs-workflow|08. Circom + snarkjs Workflow]] — `signal` vs `<==` vs `<--`; compile → setup → witness → prove → verify; file formats; debug workflow.
- [[09-worked-example|09. Worked Example: ZK Proof end-to-end]] — Age proof circuit; nullifier pattern; on-chain verifier; replay attack prevention.
- [[10-proof-malleability|10. Proof Malleability & Extensibility Attacks]] — Negation transformation; double-spending via proof hash; real examples (gnark, Tornado Cash); mitigations.
- [[11-under-over-constrained|11. Under/Over-Constrained Circuits]] — Assignment vs constraint; missing range check; non-bit selector; real bugs (Zcash, Light Protocol); detection tools.
- [[12-trusted-setup-attacks-audit|12. Trusted Setup Attacks & Audit Methodology]] — Toxic waste attacks; $\gamma = \delta$ exploit (2025 $1.5M); incomplete setup exploit; 4-layer audit checklist.

## Appendices

- [[a0-math-reference|A0. Math Reference Sheet]] — Notation, BN254/BLS12-381 params, full CRS structure, proving/verification algorithms, complexity reference.
- [[a1-tool-cheatsheet|A1. Tool Cheatsheet]] — snarkjs/circom commands đầy đủ; file formats; arkworks Rust; py_ecc Python; circomlib templates.
- [[a2-vulnerability-catalog|A2. Vulnerability & Bug Catalog]] — 15 vulnerabilities phân loại theo layer/severity; detection scripts; real exploits reference.

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $[x]_1 = x \cdot g_1$ | Điểm trong $\mathbb{G}_1$ với discrete log $x$ |
| $[x]_2 = x \cdot g_2$ | Điểm trong $\mathbb{G}_2$ với discrete log $x$ |
| $e : \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ | Bilinear pairing |
| $\tau, \alpha, \beta, \gamma, \delta$ | Toxic waste — 5 field elements bí mật trong setup |
| CRS | Common Reference String — proving key + verifying key |
| R1CS | Rank-1 Constraint System |
| QAP | Quadratic Arithmetic Program |
| $\mathbf{z}$ | Witness vector $(1, \text{public inputs}, \text{private inputs})$ |
| $A_i(x), B_i(x), C_i(x)$ | QAP polynomials từ cột $i$ của ma trận R1CS |
| $t(x)$ | Target polynomial (vanishing polynomial) |
| $h(x)$ | Quotient polynomial: $h(x) = \frac{A(x)B(x) - C(x)}{t(x)}$ |
| $\pi = ([A]_1, [B]_2, [C]_1)$ | Groth16 proof — 3 group elements |

## Tool & Library Guide

| Tool | Mục đích | Install |
|------|---------|---------|
| `circom` | Viết và compile ZK circuits → R1CS | `npm install -g circom` |
| `snarkjs` | Trusted setup, prove, verify với Groth16 | `npm install -g snarkjs` |
| `py_ecc` | Elliptic curve operations (BN128, BLS12-381) trong Python | `pip install py_ecc` |
| `sagemath` | Tính toán polynomial, pairing, field arithmetic | `sudo apt install sagemath` |
| `arkworks` | Rust library cho Groth16 (production-grade) | Xem A1 |
