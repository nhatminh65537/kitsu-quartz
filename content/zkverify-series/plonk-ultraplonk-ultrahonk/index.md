---
title: "PLONK, UltraPlonk & UltraHonk"
tags: [crypto, plonk, ultraplonk, ultrahonk, index]
created: 2026-03-13
---

## Lessons

- [[zkverify-series/plonk-ultraplonk-ultrahonk/00-roadmap|00. Roadmap]]
- [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]] — Polynomial IOP model, KZG commitment scheme, structured reference string (SRS), trusted setup, binding và hiding properties. Batch opening, AGM security, trusted setup attack surface.
- [[02-plonk-arithmetization|02. PLONK Arithmetization]] — Biểu diễn computation thành arithmetic circuit, selector polynomials ($q_L, q_R, q_O, q_M, q_C$), wire polynomials ($a, b, c$), copy constraints, vanishing polynomial $Z_H(X)$. Bug bounty: under-constrained circuits.
- [[03-plonk-permutation-argument|03. PLONK Permutation Argument]] — Grand product argument, permutation polynomial $z(X)$, Bayer-Groth, encode copy constraints thành multiset equality check. Bug bounty: missing copy constraints, sai coset params.
- [[04-plonk-prover-verifier|04. PLONK Prover and Verifier]] — Toàn bộ 5 rounds của Prover, quotient polynomial $t(X)$, linearization polynomial $r(X)$, multi-point opening, thuật toán Verifier đầy đủ.
- [[05-fiat-shamir-security-model|05. Fiat-Shamir and Security Model]] — Fiat-Shamir heuristic, transcript construction, ROM + AGM, Frozen Heart vulnerability class, knowledge soundness, ZK definition.
- [[06-turboplonk-custom-gates|06. TurboPlonk and Custom Gates]] — Custom gate arithmetization, selector mở rộng, EC point addition gate, XOR gate, constraint degree và trade-offs. Bug bounty: under-constrained custom gate, missing range check.
- [[07-plookup|07. Plookup]] — Lookup table argument, sorted multiset, grand product, log-derivative lookup, multi-column lookup. Bug bounty: multiplicity overflow, table not committed, padding issues.
- [[08-ultraplonk|08. UltraPlonk]] — Ultra arithmetization (4 wires), lookup integration, RAM/ROM memory argument, Barretenberg UltraCircuitBuilder, VK structure. Bug bounty: ACIR translation, point-at-infinity, timestamp overflow. Bug bounty: sai PI handling, sai $t$ split.
- [[05-fiat-shamir-security-model|05. Fiat-Shamir and Security Model]] — Fiat-Shamir transformation, Random Oracle Model, AGM, transcript construction đúng, knowledge soundness, ZK definition formal. Frozen Heart vulnerability.

- [[06-turboplonk-custom-gates|06. TurboPlonk and Custom Gates]] — Custom gate arithmetization, 4-wire system, selector extensions, EC addition gate, range check gate, XOR gate. Bug: under-constrained custom relations, degree overflow.
- [[07-plookup|07. Plookup]] — Lookup tables trong SNARK, Plookup sorted multiset grand product, log-derivative lookup (Haböck 2022), multiplicity polynomial. Bug: wrong table sort, missing multiplicity.
- [[08-ultraplonk|08. UltraPlonk]] — Ultra arithmetization 4-wire, kết hợp custom gates + plookup, RAM/ROM abstraction, UltraCircuitBuilder (Barretenberg). Bug: RAM read-write consistency, uninitialised memory.
- [[09-multilinear-sumcheck|09. Multilinear Extensions and Sumcheck]] — Multilinear Extension (MLE), Boolean hypercube, sumcheck protocol đầy đủ, ZeroMorph multilinear PCS — nền tảng cho UltraHonk.
- [[10-ultrahonk|10. UltraHonk]] — Kiến trúc UltraHonk: wire MLEs, Honk relation, log-derivative permutation, Flavor system (Barretenberg), UltraProver/Verifier flow. So sánh UltraPlonk vs UltraHonk.
- [[11-security-vulnerabilities|11. Security Vulnerabilities]] — Taxonomy đầy đủ: Frozen Heart, Point at Infinity, under-constrained circuit, lookup bypass, insufficient blinding, proof serialization. Khai thác + phòng chống.
- [[12-zkverify-bug-bounty|12. zkVerify Bug Bounty]] — zkVerify architecture, Rust verifier codebase map, audit checklist transcript/proof/verifier, differential testing, PoC report template, target list.

## Appendices

- [[a0-kzg-zeromorph-reference|A0. KZG and ZeroMorph Reference]] — Công thức đầy đủ KZG (commit, open, verify, batch), ZeroMorph (quotient decomp, univariatisation, degree check), PLONK opening table, BN254 parameters.
- [[a1-bug-bounty-checklist|A1. Bug Bounty Checklist]] — Checklist 30+ mục: Fiat-Shamir (T01–T07), proof parsing (P01–P06), verifier logic (V01–V15), UltraHonk (H01–H07), circuit design (C01–C06). Severity mapping Immunefi.
- [[a2-math-reference|A2. Math Reference]] — Finite fields, elliptic curve group ops, BN254/Grumpkin params, pairing equations, Lagrange interpolation, NTT/coset NTT, Schwartz-Zippel, ký hiệu toàn khoá học.

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `sympy` | Polynomial arithmetic, modular math | `pip install sympy` |
| `py_ecc` | BN254/BLS12-381 elliptic curve operations | `pip install py_ecc` |

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $\mathbb{F}$ | Finite field (thường là $\mathbb{F}_p$ với $p$ nguyên tố lớn) |
| $\mathbb{G}_1, \mathbb{G}_2$ | Hai nhóm điểm trên đường cong elliptic (pairing groups) |
| $[f]_1$ | Commitment KZG của polynomial $f$: $f(\tau) \cdot G_1$ |
| $Z_H(X)$ | Vanishing polynomial của tập $H$: $\prod_{h \in H}(X - h)$ |
| $L_i(X)$ | Lagrange basis polynomial thứ $i$ trên $H$ |
| $\omega$ | Generator của multiplicative subgroup $H$ (root of unity) |
| SRS | Structured Reference String — tham số từ trusted setup |
| AGM | Algebraic Group Model — mô hình bảo mật cho KZG |
| IOP | Interactive Oracle Proof |
