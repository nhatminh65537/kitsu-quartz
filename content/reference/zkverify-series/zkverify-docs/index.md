---
title: "Index — zkVerify Documentation Course"
tags: [zkverify, index, zero-knowledge, blockchain, bug-bounty]
source: "zkVerify Official Documentation — zkVerify Foundation, 2025–2026 — https://docs.zkverify.io"
created: 2026-03-28
---

Course distill từ [docs.zkverify.io](https://docs.zkverify.io) — 7 lesson bao phủ toàn bộ kiến trúc zkVerify, tập trung góc độ bảo mật cho bug bounty Immunefi.

---

## Lesson Summaries

| # | Lesson | Tóm tắt |
|---|--------|---------|
| 01 | [[01-zkverify-zk-verification-as-a-service\|zkVerify Foundation]] | zkVerify = L1 blockchain chuyên verify ZK proof; giải quyết gas cost cao trên Ethereum và STARK không verify được trên EVM; 5 thành phần: Mainchain, Verifier Pallets, Aggregation, Relayer, Smart Contract. |
| 02 | [[02-mainchain-substrate-runtime-consensus\|Mainchain & Consensus]] | Substrate framework với WASM runtime; BABE (VRF slot-based block authoring) + GRANDPA (supermajority finality); custom extrinsics: `submitProof`, `registerVk`, `aggregate`; invalid proof vẫn tốn phí (chống DoS). |
| 03 | [[03-proof-submission-flow-statement-digest\|Proof Submission & Statement Digest]] | `leaf_digest = keccak256(keccak256(ctx) ‖ vk_hash ‖ version_hash ‖ keccak256(pubs))` — trung tâm bảo mật của toàn hệ thống; domain-separated aggregation; `aggregate_statementPath` RPC chỉ available tại block publish. |
| 04 | [[04-proof-aggregation-engine\|Aggregation Engine]] | Domain = ngữ cảnh aggregation; Hold formula = `2.64 + 0.1×(62+56A+22Q+56AQ)` VFY; permissionless publication với reward; aggregation chỉ sống 1 block; lifecycle: Ready→Hold→Removable→Unregistered. |
| 05 | [[05-abstract-verifier-internals\|Abstract Verifier Internals]] | `hp_verifiers::Verifier` trait — 3 required methods; statement digest là 4-field keccak chain; `validate_vk()` default chấp nhận tất cả; `vk_hash()` override khi VK đã là hash; `verifier_version_hash()` cho replay protection. |
| 06 | [[06-concrete-verifiers-survey\|Concrete Verifiers Survey]] | 8 verifier pallets; ưu tiên: EZKL (unaudited) > Groth16 (subgroup check) > Risc0 (cbor DoS, FRI params) > Plonky2 (size bounds, hash namespace); per-verifier bug angles được liệt kê chi tiết. |
| 07 | [[07-smart-contract-vflow\|Smart Contract & VFlow]] | Contract lưu Merkle roots; `verifyProofAggregation` dùng EigenDA Merkle.sol với adaptation cho Substrate non-complete Merkle; **Critical bug angle**: adaptation sai → forge proof ($10k); VFlow = EVM parachain (Invulnerable collators, AURA, sudo governance). |

---

## Global Notation Table

| Ký hiệu | Ý nghĩa | Defined in |
|---------|---------|-----------|
| `leaf_digest` / `statement` | Hash 32 bytes định danh proof đã verify | 03 |
| `verifier_ctx` | Unique byte sequence định danh verifier | 03, 05 |
| `vk_hash` | Hash của verification key | 03, 05 |
| `version_hash` | Fingerprint phiên bản verifier | 03, 05 |
| `pubs_bytes` | Byte encoding của public inputs | 03, 05 |
| `hp_verifiers::Verifier` | Rust trait interface cho mọi verifier | 05 |
| Domain | Ngữ cảnh aggregation với A, Q riêng | 04 |
| A | Aggregation size | 04 |
| Q | Publish queue size | 04 |
| `proofsAggregations` | Solidity mapping: domainId→aggId→bytes32 | 07 |
| OPERATOR | Role smart contract: chỉ relayer được submit | 07 |
| BABE | Block authoring: VRF slot assignment | 02 |
| GRANDPA | Block finality: supermajority voting | 02 |
| VFY | Native token của zkVerify | 02, 04 |
| VFlow | EVM System Parachain của zkVerify | 07 |
| AURA | Authority Round consensus của VFlow | 07 |

---

## Bug Bounty Quick Reference

| Attack Surface | Severity | Max Reward | Lesson |
|---------------|---------|-----------|--------|
| Verifier soundness bug (valid proof for wrong statement) | Critical | $50,000 | 05, 06 |
| leaf_digest collision / forgery | Critical | $50,000 | 03, 05 |
| Substrate Merkle tree adaptation bug trong smart contract | Critical (Web) | $10,000 | 07 |
| Node DoS (block time ≥ 500% slowdown) | High | $10,000 | 02, 06 |
| Aggregation fund accounting bug | High | $10,000 | 04 |
| Smart contract OPERATOR role bypass | Critical (Web) | $10,000 | 07 |
| verifier_version_hash missing update → replay | Critical | $50,000 | 05 |
| validate_vk missing → degenerate VK bypass | Critical | $50,000 | 05, 06 |
| cbor/format parsing panic → node crash | High | $10,000 | 06 |
| zkVerifyJS serialization bug | Critical (Web) | $10,000 | 07 |
