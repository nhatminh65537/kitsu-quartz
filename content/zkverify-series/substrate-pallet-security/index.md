---
title: "Substrate FRAME Pallet Security"
tags: [security, substrate, frame, pallet, index, bug-bounty, zkverify]
created: 2026-03-16
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-frame-architecture|01. FRAME Architecture]] — Substrate vs FRAME vs Pallet. Anatomy 7 thành phần: Config, Pallet struct, Storage, Event, Error, Call, Hooks. `construct_runtime!`. Security relevance của từng thành phần.
- [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]] — 3 loại extrinsic: Signed, Unsigned, Inherent. Dispatch pipeline 13 bước từ transaction pool đến state commit. `DispatchResult`, `DispatchError`, `ArithmeticError`. Fee model, state rollback, `SignedExtension` chain.
- [[03-origin-and-access-control|03. Origin & Access Control]] — Ba origin nguyên thủy (Root, Signed, None). Bốn lớp lỗi Bad Origin: thiếu check, sai level, thiếu ownership, misuse ensure_signed_or_root. Custom Origin qua `EnsureOrigin` trait. Audit scan pattern.
- [[04-arithmetic-overflow|04. Arithmetic Overflow]] — Overflow trong WASM release mode wrap silently. `checked_*` vs `saturating_*` vs `wrapping_*`. Type cast nguy hiểm. Acala aUSD incident 2022: 1.28B token mint từ misconfigured rate + no arithmetic guard. Checklist scan.
- [[05-weights-and-fees|05. Weights & Fees]] — Weight hai chiều: ref_time + proof_size. Weight → Fee formula. Bốn lớp lỗi: weight = 0, constant weight cho variable complexity, thiếu hook weight, benchmark không cover worst case. `BoundedVec` bắt buộc. Audit scan với `rg`.
- [[06-dont-panic|06. Don't Panic!]] — Bảy nguồn panic: unwrap, array index, arithmetic, panic!, assert!, codec decode. Panic trong extrinsic vs hooks (chain halt). `.expect("qed")` pattern và cách evaluate. Audit scan commands.
- [[07-verify-first|07. Verify First]] — Nguyên lý Check-Effects-Interactions cho Substrate. Ba vulnerability class: mutate trước validate, multi-step mutation xen validate, cross-pallet call inconsistency. `#[transactional]` và giới hạn. `try_mutate` pattern. Audit: đọc extrinsic từ trên xuống, flag mutation trước `ensure!`.
- [[08-unsigned-tx-validation|08. Unsigned Tx Validation]] — `ValidateUnsigned` trait, `ValidTransaction` struct (priority, provides, longevity). Năm lỗi: thiếu validate, không filter call, empty provides (replay attack), validate/pre_dispatch inconsistency, bỏ qua TransactionSource. Full off-chain worker pattern example.
- [[09-bad-randomness|09. Bad Randomness]] — Vấn đề cốt lõi: blockchain determinism vs true randomness. Block author control. Ba nguồn: block_hash (không bao giờ), collective_flip (chỉ test), BABE VRF (production, có giới hạn). Look-ahead attack. Commit-reveal pattern an toàn.
- [[10-storage-design-bugs|10. Storage Design Bugs]] — Năm lớp lỗi: unbounded Vec (BoundedVec fix), missing cleanup (take() vs get()+remove()), double-spend via stale state, Twox64Concat với user-controlled keys, StorageMap iteration không giới hạn. Time-bucketing pattern.
- [[11-inter-pallet-interactions|11. Inter-Pallet Interactions]] — Tight vs loose coupling. Bốn lớp lỗi: storage key collision, origin escalation khi dispatch cross-pallet, invariant violation qua stale flags, callback anti-pattern (circular calls). Hook notification pattern.
- [[12-runtime-upgrade-safety|12. Runtime Upgrade Safety]] — Forkless upgrade cơ chế. `spec_version`, `StorageVersion` guard. Bốn lỗi migration: thiếu migration, double-run, ordering sai, thiếu pre/post verification. `try-runtime` CLI. Migration checklist.
- [[13-xcm-security|13. XCM Security]] — XCVM instruction model. Sáu điểm cấu hình XCM: Filters, OriginConverter, Barrier, TrustedOrigins, Weighers, Sender. `XcmExecuteFilter = Everything` = critical. `ParentAsSuperuser`, `unimplemented!()` trong handlers. zkVerify XCM attack surface.
- [[14-zkverify-case-study|14. zkVerify Case Study]] — Kiến trúc zkVerify. Phân tích 4 pallet đã audit: aggregate, token-claim, crl, tee-verifier. Attack surface ưu tiên: ParaVerifier, EZKL adapter, XCM integration. Chiến lược hunt bug bounty Immunefi.

## Appendices

- [[a0-rust-safety-patterns|A0. Rust Safety Patterns]] — Reference card: checked/saturating/wrapping, Option/Result handling, try_mutate, BoundedVec, #[transactional], Verify First pattern, hasher selection.
- [[a1-audit-checklist|A1. Pallet Audit Checklist]] — Checklist 8 phases: chuẩn bị → scan → mỗi extrinsic → storage → unsigned tx → hooks → inter-pallet → XCM. Severity classification và finding template cho Immunefi.

## Tool & Library Guide

| Tool / Library | Purpose | Ghi chú |
|----------------|---------|---------|
| `cargo` | Build, test, benchmark Substrate runtime | Standard Rust toolchain |
| `pallet-verifier` | Static analysis — phát hiện 7 lớp lỗi FRAME phổ biến | Web3 Foundation grant tool |
| `try-runtime` | Test runtime migration an toàn trước khi upgrade | CLI feature của Substrate node |
| `cargo test --features runtime-benchmarks` | Chạy benchmarks để generate weight chính xác | Bắt buộc khi fix weight bugs |

## Vulnerability Class Index

| Lớp lỗi | Lesson | Severity tiềm năng (Immunefi) |
|---------|--------|------------------------------|
| Bad Origin | [[03-origin-and-access-control\|03]] | Critical / High |
| Arithmetic Overflow | [[04-arithmetic-overflow\|04]] | Critical |
| Incorrect Weights | [[05-weights-and-fees\|05]] | High (DoS) |
| Panic / Chain Halt | [[06-dont-panic\|06]] | High (DoS) |
| Verify-After-Write | [[07-verify-first\|07]] | Critical |
| Unsigned Tx Bypass | [[08-unsigned-tx-validation\|08]] | High |
| Bad Randomness | [[09-bad-randomness\|09]] | High |
| Storage Abuse | [[10-storage-design-bugs\|10]] | Medium / High |
| Cross-Pallet Bugs | [[11-inter-pallet-interactions\|11]] | Critical |
| Migration Bugs | [[12-runtime-upgrade-safety\|12]] | Critical |
| XCM Origin Manipulation | [[13-xcm-security\|13]] | Critical |

## Notation Guide

| Symbol / Term | Nghĩa |
|---------------|-------|
| `T: Config` | Generic config trait của pallet |
| `OriginFor<T>` | Origin của extrinsic (ai gọi) |
| `DispatchResult` | `Result<(), DispatchError>` — kết quả dispatch |
| `ensure!(cond, err)` | Macro assert: nếu `cond` sai → return `Err(err)` |
| `#[pallet::call]` | Block chứa các extrinsic functions |
| `#[pallet::storage]` | Block khai báo storage items |
| `#[pallet::weight(...)]` | Annotation khai báo weight của extrinsic |
| Weight | Đơn vị đo computational cost: `ref_time` + `proof_size` |
| Extrinsic | Transaction từ ngoài vào runtime (≈ transaction trong EVM) |
| Pallet | Module runtime (≈ smart contract nhưng native) |
| Runtime | Tập hợp các pallets compose thành blockchain logic |
