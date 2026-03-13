---
title: "Integration Layer Vulnerabilities"
tags: [zkp, snark, security, integration-layer, bug-bounty, index]
created: 2026-03-13
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-zkp-stack-and-integration-layer|01. ZKP Stack & Integration Layer]] — Kiến trúc 4 lớp SNARK, vị trí và vai trò của Integration Layer, các thành phần (on-chain verifier, auxiliary logic, nullifier). zkVerify architecture overview.
- [[02-zkp-foundations-for-auditors|02. ZKP Foundations for Auditors]] — Ba thuộc tính bảo mật (Completeness, Soundness, Zero-Knowledge); public input vs. private witness; Groth16 verification flow; threat model Integration Layer.
- [[03-v4-passing-unchecked-data|03. V4 — Passing Unchecked Data]] — Implicit constraints, 3 pattern lỗi (range, semantic, cross-input), exploit flow, PoC pattern, detection checklist.
- [[04-v5-proof-delegation-error|04. V5 — Proof Delegation Error]] — Witness leakage, witness manipulation, selective denial, design flaws, V5 trong zkVerify ecosystem.
- [[05-v6-proof-composition-error|05. V6 — Proof Composition Error]] — Missing linkage, inconsistent public inputs, recursive composition bug, V6 trong zkVerify aggregate pallet.
- [[06-v7-zkp-complementary-logic-error|06. V7 — ZKP Complementary Logic Error]] — Nullifier mismanagement, Merkle state mismatch, access control desync, fee-on-transfer bug, case study Tornado Cash, V7 trong zkVerify pallets.
- [[07-bug-hunting-on-zkverify|07. Bug Hunting on zkVerify (Immunefi)]] — zkVerify pallet architecture, Immunefi scope/rules, quy trình săn bug (Recon → Static → Dynamic → PoC → Report), attack surface map.

## Appendices

- [[a0-snark-stack-reference|A0. SNARK Stack Reference Sheet]] — Taxonomy đầy đủ SNARK stack, proof system comparison (Groth16/PLONK/STARK/RISC0), field arithmetic values, nullifier patterns, master checklist V4–V7, tools reference.
- [[a1-real-world-cases|A1. Real-World Case Studies]] — 7 case thực tế mapped tới V4–V7: Tornado Cash, Semaphore, zkSync subgroup, epoch nullifier, zkRollup state root, fee token, Jolt zkVM.

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `foundry` / `forge` | Test Solidity integration contracts, PoC on-chain verifier | `curl -L https://foundry.paradigm.xyz \| bash` |
| `snarkjs` | Groth16/PLONK end-to-end: compile, prove, verify, export verifier | `npm install -g snarkjs` |
| `circom` | Compile circuits từ DSL sang R1CS | `cargo install --git https://github.com/iden3/circom` |
| `arkworks` (Rust) | ZKP primitives, verify flow, field arithmetic | `cargo add ark-groth16` |
| `polkadot-js-api` | Interact với zkVerify Substrate node | `npm install @polkadot/api` |
| `web3.py` | Interact với EVM relay contract từ Python PoC | `pip install web3` |
| `cargo test` | Test Substrate pallets của zkVerify | Built-in Rust toolchain |

## Notation Guide

| Symbol / Thuật ngữ | Nghĩa |
|---------------------|-------|
| $\pi$ | ZKP proof (bằng chứng zero-knowledge) |
| $x$ | Public input (đầu vào công khai) |
| $w$ | Private witness (nhân chứng bí mật) |
| $\mathcal{C}$ | Circuit (mạch số học) |
| $\mathsf{Prove}(x, w) \to \pi$ | Thuật toán sinh proof |
| $\mathsf{Verify}(x, \pi) \to \{0,1\}$ | Thuật toán xác minh proof |
| $e(\cdot, \cdot)$ | Bilinear pairing (dùng trong Groth16 verification) |
| $\mathbb{F}_p$ | Finite field với modulus $p$ |
| R1CS | Rank-1 Constraint System — output của Circom |
| SNARK | Succinct Non-Interactive Argument of Knowledge |
| V4 | Passing Unchecked Data |
| V5 | Proof Delegation Error |
| V6 | Proof Composition Error |
| V7 | ZKP Complementary Logic Error |
| SoK | Systematization of Knowledge (Chaliasos et al., USENIX Security 2024) |
| nPoS | Nominated Proof-of-Stake (consensus của zkVerify) |
| VK | Verification Key (hardcoded trong verifier contract) |
