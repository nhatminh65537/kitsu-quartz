---
title: "Polynomial Commitments"
tags: [crypto, zk, polynomial-commitments, index]
created: 2026-03-12
---

## Lessons

- [[zkverify-series/polynomial-commitments/00-roadmap|00. Roadmap]]
- [[01-polynomials-over-finite-fields|01. Polynomials over Finite Fields]] — Số học đa thức, đánh giá, nội suy Lagrange, Reed-Solomon encoding. Nền tảng toán học không thể thiếu.
- [[02-commitment-scheme-fundamentals|02. Commitment Scheme Fundamentals]] — Binding, hiding, correctness; vector commitments, Pedersen commitments; định nghĩa chính thức.
- [[03-kzg-commitments|03. KZG Commitments]] — Trusted setup (SRS), commit, open, verify; bilinear pairings; batch opening; Kate-Zaverucha-Goldberg scheme đầy đủ.
- [[04-kzg-security-analysis|04. KZG Security Analysis]] — t-SDH assumption, binding proof, evaluation binding; known attacks; so sánh với Pedersen.
- [[05-ipa-bulletproofs|05. IPA & Bulletproofs-style]] — Inner Product Argument, Pedersen vector commitment, proof logarithmic, không cần trusted setup.
- [[06-fri-protocol|06. FRI Protocol]] — Fast Reed-Solomon IOP of Proximity; commit phase, query phase; soundness; nền tảng của STARKs.
- [[07-plonk-multi-point-evaluation|07. PLONK & Multi-point Evaluation]] — PLONK dùng KZG, linearization trick, batch proof nhiều điểm nhiều đa thức.
- [[08-trusted-setup-vulnerabilities|08. Trusted Setup Vulnerabilities]] — Toxic waste attacks, Powers of Tau, subgroup attacks, rogue key attacks.
- [[09-implementation-bugs|09. Common Implementation Bugs]] — Soundness bugs, missing subgroup checks, weak Fiat-Shamir, transcript manipulation, blinding factor absence.
- [[10-zkverify-audit-targets|10. zkVerify Audit Targets]] — Attack surface mapping của zkVerify, verifier pallets, real bug patterns, PoC approach.

## Appendices

- [[a0-pairing-cheatsheet|A0. Pairing Cheatsheet]] — Bilinear pairings, BLS12-381, BN254 — reference nhanh cho các tính toán.
- [[a1-bug-checklist|A1. Bug Checklist]] — Toàn bộ lỗi tổng hợp dưới dạng checklist audit, phân loại theo severity.

## Tool & Library Guide

| Tool / Library | Mục đích | Cài đặt |
|----------------|----------|---------|
| `SageMath` | Tính toán đa thức, field arithmetic, elliptic curves | `sudo apt install sagemath` |
| `py_ecc` | Pairing-friendly curves (BLS12-381, BN254) trong Python | `pip install py_ecc` |
| `arkworks` (Rust) | Chuẩn production cho KZG, IPA | `cargo add ark-poly-commit` |
| `0xPARC zk-bug-tracker` | Community bug tracker ZK | https://github.com/0xPARC/zk-bug-tracker |
| `zkdocs` (Trail of Bits) | Reference vulnerabilities từng scheme | https://www.zkdocs.com |

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{F}_p$ | Trường hữu hạn (finite field) có $p$ phần tử |
| $f(X) \in \mathbb{F}_p[X]^{\leq d}$ | Đa thức bậc tối đa $d$ trên $\mathbb{F}_p$ |
| $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ | Ba nhóm trong bilinear pairing |
| $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ | Bilinear pairing map |
| $[x]_1 = x \cdot G_1$ | Scalar multiplication trên $\mathbb{G}_1$ |
| SRS | Structured Reference String — kết quả trusted setup |
| $\tau$ | Toxic waste — bí mật trong trusted setup |
| $\text{com}_f$ | Commitment của đa thức $f$ |
| $\pi$ | Evaluation proof |
| IOP | Interactive Oracle Proof |
| t-SDH | $t$-Strong Diffie-Hellman assumption |
