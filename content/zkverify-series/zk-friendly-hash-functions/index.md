---
title: "ZK-Friendly Hash Functions"
tags: [cryptography, zk-hash, index]
created: 2026-03-13
---

## Lessons

- [[zkverify-series/zk-friendly-hash-functions/00-roadmap|00. Roadmap]]
- [[01-hash-functions-overview|01. Hash Functions — Nền tảng & Baseline]] — Ba tính chất bảo mật, Merkle-Damgård, sponge construction, SHA-256 & Keccak internals. Phân tích tại sao bitwise ops làm tăng constraint count trong ZK.
- [[02-zk-proof-systems-circuits|02. ZK Proof Systems & Arithmetic Circuits]] — R1CS, PLONK, AIR constraint systems. Finite field arithmetic. Metric đo chi phí circuit: số constraints, circuit depth, multiplicative complexity.
- [[03-zk-friendly-criteria|03. Tiêu chí ZK-Friendly & Threat Model]] — ZK-friendly là gì, low-degree map, native field ops. SNARKs-friendly vs STARKs-friendly. Phân loại primitive theo proof system.
- [[04-mimc-gmimc|04. MiMC & GMiMC]] — Feistel structure, cube map $x^3$, round constants, key schedule. GMiMC multi-branch. Phân tích constraint count và attack surface.
- [[05-poseidon-design|05. Poseidon — Thiết kế (Phần 1)]] — HADES design strategy, SPN, full rounds và partial rounds, S-box $x^\alpha$, round constants (Grain LFSR), Cauchy MDS matrix, security bounds tính số rounds, Poseidon sponge mode.

- [[06-poseidon-implementations|06. Poseidon — Implementations (Phần 2)]] — Circomlib source analysis, test vectors (Poseidon([1,2]) BN254), Halo2 custom gate tiết kiệm 3x constraints, Poseidon2 ba cải tiến chính, domain separation, field parameter mismatch bug.
- [[07-rescue-rescue-prime|07. Rescue & Rescue-Prime]] — Marvellous strategy, forward + inverse S-box, Rescue-XLIX 6-step round, tính alpha_inv, Python implementation, AIR constraint formulation ($y^\alpha = x$), so sánh SNARK vs STARK.
- [[08-next-gen-hashes|08. Thế hệ mới: Anemoi, Griffin, Reinforced Concrete, Neptune]] — Flystel CCZ-equivalence, Griffin non-uniform nonlinearity, lookup-friendly RC, Tip5 split-and-lookup, Monolith small fields, bảng so sánh tổng hợp, known security issues.
- [[09-algebraic-cryptanalysis|09. Algebraic Cryptanalysis — Cơ bản]] — Differential uniformity power map, Wide Trail strategy, algebraic degree growth, degree distinguisher, security checklist.
- [[10-algebraic-attacks-zk|10. Algebraic Attacks Đặc thù ZK Hash]] — Interpolation attack complexity $O(\alpha^r)$, Gröbner basis degree of regularity, Algebraic Freelunch bypass, GCD attack trên MiMC keyed, invariant subspace attack.

- [[11-mds-matrix-diffusion|11. MDS Matrix & Diffusion Layer Theory]] — Branch number = t+1, Cauchy matrix luôn MDS, Circulant cần verify, Poseidon2 M_I sparse structure O(t), weak MDS configurations.
- [[12-circuit-bugs|12. Circuit-Level Bugs]] — `<--` vs `<==` (Tornado Cash 2019), missing range check, unconstrained component output, hash convention mismatch, Halo2 assign-constrain gap, MockProver tests.
- [[13-implementation-integration-bugs|13. Implementation & Integration Bugs]] — Frozen Heart (Fiat-Shamir thiếu component), Last Challenge Attack, spec mismatch (rounds/alpha), hash-to-field endianness và reduction, domain separation failure, nullifier reuse pattern.
- [[14-bug-bounty-playbook|14. Bug Bounty Playbook]] — 5-bước methodology, audit_hash_params script, test vector verification, Circomspect / halo2-analyzer / SageMath tools, bug report template, severity estimation, CTF exercise.

## Appendices

- [[a0-hash-comparison-table|A0. Hash Function Comparison Table]]
- [[a1-sagemath-scripts|A1. SageMath Scripts]]
- [[a2-circom-bug-patterns|A2. Circom Bug Pattern Reference]]
- [[a3-zk-hash-cve-database|A3. ZK Hash CVE & Finding Database]]

---

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `sagemath` | Field arithmetic, MDS matrix, attack scripts | `sudo apt install sagemath` |
| `circom` | Compile ZK circuits, generate R1CS | [docs.circom.io](https://docs.circom.io) |
| `snarkjs` | Generate/verify proofs từ Circom | `npm install -g snarkjs` |
| `circomspect` | Static analyzer tìm underconstrained bugs | `cargo install circomspect` |
| `halo2` (Rust) | ZK circuit framework của Zcash/PSE | `cargo add halo2_proofs` |
| `poseidon-rs` | Poseidon Rust implementation | `cargo add poseidon-rs` |

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $\mathbb{F}_p$ | Trường hữu hạn (finite field) modulo số nguyên tố $p$ |
| $\mathbb{F}_p^t$ | Vector space dimension $t$ trên $\mathbb{F}_p$ |
| $R_F$ | Số full rounds trong Poseidon |
| $R_P$ | Số partial rounds trong Poseidon |
| $\alpha$ | Mũ của S-box, thường là $3$ hoặc $5$ |
| $\alpha^{-1}$ | Mũ nghịch đảo, dùng trong Rescue |
| MDS | Maximum Distance Separable matrix |
| R1CS | Rank-1 Constraint System |
| AIR | Algebraic Intermediate Representation |
| PLONK | Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge |
| SPN | Substitution-Permutation Network |
