---
title: "Substrate Chain Development"
tags: [substrate, polkadot-sdk, blockchain, index]
created: 2026-04-18
---

## Giới Thiệu

Bộ lesson này hướng dẫn bạn xây dựng **SimpleChain** — một solochain thực tế từ đầu đến cuối bằng Substrate / polkadot-sdk. Thiên hướng **thực hành**: mỗi lesson là một tính năng mới được tích hợp vào project.

---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-setup-va-chay-chain-dau-tien|01. Setup & Chạy Chain Đầu Tiên]] — Cài Rust toolchain, clone solochain-template, build và chạy node `--dev` lần đầu.
- [[02-kien-truc-substrate|02. Kiến Trúc Substrate]] — Phân tích Node vs Runtime, FRAME stack, tại sao runtime compile sang Wasm.
- [[03-pallet-dau-tien-hello-pallet|03. Pallet Đầu Tiên: Hello Pallet]] — Viết pallet từ đầu: StorageValue, dispatchable call, events, errors, đăng ký vào runtime.
- [[04-storage-types-nang-cao|04. Storage Types Nâng Cao]] — StorageMap, StorageDoubleMap, BoundedVec; xây Notepad pallet.
- [[05-origins-va-quyen-han|05. Origins & Quyền Hạn]] — EnsureSigned, EnsureRoot, pallet_sudo, admin-only calls.
- [[06-balances-va-currency-trait|06. Balances & Currency Trait]] — Tích hợp pallet_balances, Currency/ReservableCurrency trait, transfer tokens.
- [[07-testing-pallets|07. Testing Pallets]] — Mock runtime, #[test], assert_ok!, assert_noop!, integration tests.
- [[08-chain-spec-va-genesis-config|08. Chain Spec & Genesis Config]] — ChainSpec, GenesisConfig, export JSON, custom genesis state.
- [[09-runtime-hooks|09. Runtime Hooks]] — on_initialize, on_finalize, off-chain workers cơ bản.
- [[10-multi-node-local-testnet|10. Multi-node Local Testnet]] — Chạy 2 validator nodes, Aura + GRANDPA consensus, kết nối peer-to-peer.

---

## Appendices

- [[a0-frame-macro-cheatsheet|A0. FRAME Macro Cheatsheet]] — Tổng hợp tất cả macros hay dùng: #[pallet::storage], #[pallet::call], v.v.
- [[a1-polkadotjs-guide|A1. Polkadot.js Apps — Hướng Dẫn Tương Tác]] — Kết nối UI, gửi extrinsics, query storage, xem events.

---

## Tool & Library Guide

| Tool / Library | Mục đích | Cài đặt |
|----------------|---------|---------|
| `rustup` | Quản lý Rust toolchain | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| `wasm32-unknown-unknown` | Compile runtime sang Wasm | `rustup target add wasm32-unknown-unknown` |
| `polkadot-sdk` | Core blockchain SDK | dependency trong `Cargo.toml` |
| `solochain-template` | Template khởi đầu | `git clone https://github.com/paritytech/polkadot-sdk-solochain-template` |
| Polkadot.js Apps | Web UI tương tác với node | [polkadot.js.org/apps](https://polkadot.js.org/apps) |
| `subkey` | Key management utility | `cargo install --git https://github.com/paritytech/polkadot-sdk subkey` |

---

## Thuật Ngữ Nhanh

| Thuật ngữ | Giải nghĩa |
|-----------|-----------|
| **Runtime** | Logic chính của blockchain — compile sang Wasm, lưu on-chain |
| **Pallet** | Module trong FRAME, tương đương "contract" nhưng là tầng runtime |
| **Extrinsic** | Transaction gửi từ bên ngoài vào runtime (signed / unsigned) |
| **Dispatchable** | Function trong pallet có thể được gọi qua extrinsic |
| **StorageValue** | Lưu một giá trị đơn lẻ on-chain |
| **StorageMap** | Key-value map lưu on-chain |
| **Origin** | "Ai" đang gọi dispatchable: signed account, root, none |
| **FRAME** | Framework for Runtime Aggregation of Modularized Entities |
| **Chain Spec** | File cấu hình chain: genesis state, bootnodes, protocol id |
| **Aura** | Cơ chế tạo block (block production) — dựa vào slot time |
| **GRANDPA** | Cơ chế finality — chốt block không thể rollback |
