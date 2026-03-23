---
title: "zkVM Security — Risc0 & SP1"
tags: [zk, zkvm, security, risc0, sp1, bug-bounty, index]
created: 2026-03-13
---

## Lessons

- [[00-roadmap|00. Roadmap]]

### Module 0 — Nền tảng

- [[01-zk-proof-fundamentals|01. ZK Proof Fundamentals for zkVM]] — Ôn tập STARK/SNARK, soundness, completeness, execution trace, AIR. Nền tảng lý thuyết để đọc circuit.
- [[02-riscv-for-zkvm|02. RISC-V rv32im cho zkVM]] — ISA rv32im, registers, memory model, instruction format — hiểu để đọc circuit bug.

### Module 1 — Kiến trúc ✅

- [[03-zkvm-architecture-overview|03. zkVM Architecture Overview]] — Pipeline Compilation→Execution→Proving→Verification, prover/verifier model, trust model, so sánh Risc0 vs SP1. ✅
- [[04-risc0-deep-dive|04. Risc0 Deep Dive]] — Executor, Zirgen DSL, circuit rv32im, STARK→SNARK (Groth16), precompiles, journal/receipt/image ID, continuations. ✅
- [[05-sp1-deep-dive|05. SP1 Deep Dive]] — Plonky3 backend, STARK chip tables, LogUp cross-table lookup, syscalls/precompiles, host/guest separation, patched crates. ✅

### Module 2 — Lý thuyết bảo mật ✅

- [[06-zk-bug-taxonomy|06. ZK Bug Taxonomy]] — Phân loại bug: underconstrained, overconstrained, Fiat-Shamir, integration. Corpus 141 bugs USENIX'24. ✅
- [[07-threat-models-zkvm|07. Threat Models in zkVM]] — Adversarial prover/user/verifier, trust boundaries, attack surface map, zkVerify scope. ✅

### Module 3 — Bugs theo Layer ✅

- [[08-circuit-bugs|08. Circuit Bugs]] — Underconstrained trong Zirgen/AIR. CVE-2025-52484, ExpandU32, Poseidon2, ARGUZZ, SP1 LambdaClass exploit. ✅
- [[09-compiler-frontend-bugs|09. Compiler & Frontend Bugs]] — Zirgen compiler, executor semantic mismatch, RISC-V edge cases, SP1 is_complete. ✅
- [[10-host-guest-bugs|10. Host/Guest Bugs]] — Integer overflow, type cast, nondeterminism, input validation, syscall_halt, COMMIT ordering. ✅
- [[11-integration-bugs|11. Integration Bugs]] — vkey/imageId bypass, nullifier missing, verifier router, Groth16 setup, aggregation identity. ✅

### Module 4 — zkVerify Context ✅

- [[12-zkverify-architecture|12. zkVerify Architecture & Attack Surface]] — Substrate pallets, proof submission flow, aggregation engine, Merkle attestation, pallet-specific bugs. ✅

### Module 5 — Applied Bug Hunting ✅

- [[13-real-world-cves|13. Real-World CVEs Deep Dive]] — CVE-2025-52484, ExpandU32, SP1 LambdaClass compound exploit, Unfaithful Claims (6 zkVMs), GHSA-5xgj. ✅
- [[14-bug-hunting-methodology|14. Bug Hunting Methodology & Tools]] — Environment setup, attack surface enumeration, ARGUZZ/Picus tools, PoC building, responsible disclosure. ✅

## Appendices

- [[A1-bug-taxonomy-reference|A1. ZK Bug Taxonomy Reference Card]] — Quick-reference: security properties, bug distribution, adversary model, Fiat-Shamir invariant. ✅
- [[A2-audit-checklist|A2. Security Audit Checklist]] — Master checklist: guest code, host code, on-chain verifier, circuit (Zirgen + AIR), zkVerify integration. ✅

## Tool & Library Guide

| Tool / Library | Mục đích | Cài đặt |
|----------------|---------|---------|
| `cargo-risczero` / `rzup` | Risc0 toolchain, tạo project | `curl -L https://risczero.com/install \| bash` |
| `sp1up` | SP1 toolchain installer | `curl -L https://sp1.succinct.xyz \| bash` |
| Picus | Formal verification ZK circuits (underconstrained) | Veridise internal tool |
| ARGUZZ | Fuzzing soundness/completeness bugs trong zkVM | Academic tool (arxiv 2509.10819) |
| `cargo-audit` | Kiểm tra CVE trong Rust dependencies | `cargo install cargo-audit` |

## Notation Guide

| Symbol | Ý nghĩa |
|--------|---------|
| ELF | Executable and Linkable Format — binary compiled từ Rust/C |
| ISA | Instruction Set Architecture |
| rv32im | RISC-V 32-bit integer + multiply extension |
| AIR | Algebraic Intermediate Representation — mô tả circuit bằng polynomial |
| STARK | Scalable Transparent ARguments of Knowledge |
| SNARK | Succinct Non-interactive ARgument of Knowledge |
| Soundness | Prover không thể chứng minh statement sai |
| Completeness | Prover luôn có thể chứng minh statement đúng |
| Underconstrained | Circuit thiếu ràng buộc → prover có thể gian lận |
| Overconstrained | Circuit quá nhiều ràng buộc → valid execution bị reject |
| Receipt | Bằng chứng của Risc0: gồm journal + seal |
| Journal | Phần public output của Risc0 guest program |
| Seal | Cryptographic proof trong Risc0 receipt |
| Image ID | Merkle hash của memory image khi ELF binary được nạp vào zkVM — xác định program trong Risc0 |
| Precompile | Custom STARK chip tăng tốc các phép tính tốn kém |
