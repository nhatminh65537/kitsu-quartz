---
title: "Substrate FRAME"
tags: [blockchain, substrate, frame, index]
created: 2026-03-16
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-substrate-frame-overview|01. Tổng quan Substrate & FRAME]] — Polkadot ecosystem, so sánh Ethereum vs Substrate, runtime là gì, Polkadot SDK components (Substrate, FRAME, Cumulus). Tại sao không dùng smart contract mà build runtime?
- [[02-node-and-runtime-architecture|02. Kiến trúc Node & Runtime]] — Host vs Runtime, Wasm execution và forkless upgrade, `frame_system` / `frame_support` / `frame_executive`, state transition function, SCALE codec, Runtime API.
- [[03-pallet-anatomy|03. Pallet Anatomy]] — Skeleton đầy đủ của một pallet, tất cả `#[pallet::*]` macros, `Config` trait và associated types, Events/Errors/Hooks, dispatchable calls, Origin types, tích hợp vào runtime.
- [[04-storage-in-frame|04. Storage trong FRAME]] — `StorageValue`, `StorageMap`, `StorageDoubleMap`, `QueryKind` (OptionQuery/ValueQuery), storage hashers (Blake2/Twox64), `BoundedVec`, trait bounds, API `get/insert/mutate/try_mutate/remove`.
- [[05-dispatchables-extrinsics-weights|05. Dispatchables, Extrinsics & Weights]] — Ba loại extrinsic (signed/unsigned/inherent), quy trình 5 bước, `ensure!`, safe arithmetic (`checked_*`/`saturating_*`), Weight (ref_time + proof_size), `DispatchResult` vs `DispatchResultWithPostInfo`, `Pays::No`, `#[pallet::compact]`.
- [[06-testing-pallets|06. Testing Pallets]] — Mock runtime (`mock.rs`), `TestExternalities`, test macros (`assert_ok!`/`assert_noop!`), NOE-Rule pattern, test events với `System::assert_last_event`, simulate block progression, `run_to_block`, genesis config.
- [[07-build-and-deploy-local|07. Build & Deploy Local]] — Cài toolchain (Rust wasm32, `polkadot-omni-node`, `chain-spec-builder`), clone parachain template, thêm pallet vào runtime, build Wasm, tạo chain spec, chạy `--dev` node, tương tác Polkadot.js Apps.
- [[08-deploy-to-paseo-testnet|08. Deploy lên Paseo Testnet]] — Paseo faucet (PAS tokens), reserve ParaID, collator keypairs, chain spec cho Paseo, export genesis Wasm/state, register parachain, chạy collator, on-demand coretime, forkless runtime upgrade.

- [[09-mini-project-notarization|09. Mini Project: Pallet Notarization]] — Pallet hoàn chỉnh: `create_claim`/`revoke_claim`/`transfer_claim`, `BoundedVec` key, `StorageMap` + `StorageValue`, 14 unit tests (NOE-Rule), tích hợp vào parachain template, deploy và tương tác local.

## Appendices

- [[a0-frame-macros-cheatsheet|A0. FRAME Macros Cheatsheet]] — Skeleton đầy đủ, tất cả `#[pallet::*]` attributes, storage types + API nhanh, origin checks, safe arithmetic, Weight patterns, `construct_runtime!`, derive traits, test macros, pitfalls.
- [[a1-polkadotjs-interaction-guide|A1. Polkadot.js Interaction Guide]] — Kết nối local/Paseo, gọi extrinsic, đọc storage, xem events qua UI; Polkadot.js API (JS): query, signAndSend, subscribe events; development accounts, troubleshooting, Paseo endpoints.

## Tool & Setup Guide

| Tool | Mục đích | Cài đặt |
|------|---------|---------|
| Rust + `wasm32` target | Biên dịch runtime sang Wasm | `rustup target add wasm32-unknown-unknown` |
| `polkadot-omni-node` | Chạy node local từ chain spec | `cargo install polkadot-omni-node` |
| `chain-spec-builder` | Tạo chain spec JSON | `cargo install staging-chain-spec-builder` |
| Polkadot.js Apps | UI tương tác với chain | https://polkadot.js.org/apps |
| `subkey` | Tạo keypair Substrate | `cargo install subkey` |

## Thuật ngữ Nhanh

| Thuật ngữ | Ý nghĩa tóm tắt |
|-----------|----------------|
| Runtime | Logic nghiệp vụ của blockchain, compile sang Wasm |
| Pallet | Module runtime, tương đương "smart contract" nhưng ở tầng runtime |
| Extrinsic | Giao dịch gửi lên chain (signed/unsigned/inherent) |
| Dispatchable | Hàm trong pallet có thể gọi từ bên ngoài |
| SCALE | Codec nhị phân dùng để encode/decode data on-chain |
| Origin | "Ai" đang gọi một dispatchable (account, root, none) |
| Weight | Đơn vị đo chi phí tính toán của một extrinsic |
| Chain Spec | File JSON mô tả genesis state của chain |
| Parachain | Chain con kết nối vào Polkadot relay chain |
| Coretime | "Slot" thời gian xử lý block trên relay chain |
