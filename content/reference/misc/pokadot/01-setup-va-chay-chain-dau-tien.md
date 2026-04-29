---
title: "01. Setup & Chạy Chain Đầu Tiên"
type: foundation+tool
tags: [substrate, setup, solochain-template, lesson-01]
aliases: [Setup Substrate]
created: 2026-04-18
---

> **Prerequisites**: Biết dùng terminal, Rust cơ bản (ownership, lifetimes)
> **Objectives**:
> - Cài đặt toàn bộ dependencies cần thiết cho Substrate development
> - Clone solochain-template và build thành công
> - Chạy node `--dev` và quan sát block được tạo ra
> - Kết nối Polkadot.js Apps với local node
> - Hiểu cấu trúc thư mục của project

---

## Tại Sao Dùng Substrate?

Nếu bạn đã làm qua EVM/Solidity, bạn biết rằng để deploy smart contract, bạn cần một chain **đã có sẵn** (Ethereum, BNB Chain...). Với Substrate, bạn **tự xây chain của mình** — quyết định toàn bộ: token, consensus, runtime logic.

So sánh nhanh với thứ bạn đã biết:

| | Solidity / EVM | Substrate / FRAME |
|---|---|---|
| Bạn viết | Smart contract | Pallet (runtime module) |
| Chạy trên | Chain có sẵn | Chain bạn tự deploy |
| Ngôn ngữ | Solidity | Rust |
| Logic xử lý | EVM bytecode | Wasm binary |
| Upgrade | Deploy contract mới | Forkless runtime upgrade |

Pallet giống smart contract nhưng là **tầng core của chain**, không phải tầng application layer. Bạn có quyền lực nhiều hơn (và trách nhiệm cũng nhiều hơn).

---

## 1. Cài Đặt Môi Trường

### 1.1 Hệ điều hành

Substrate hỗ trợ **Linux** và **macOS**. Nếu bạn dùng Windows thì cần WSL2 (Ubuntu 22.04 khuyến nghị).

> [!tip] Với WSL2 trên Windows
> ```bash
> wsl --install -d Ubuntu-22.04
> ```
> Sau đó mở Ubuntu terminal và thực hiện tất cả lệnh bên trong đó.

### 1.2 Cài Dependencies Hệ Thống

**Ubuntu / Debian / WSL2:**

```bash
sudo apt update && sudo apt install -y \
  build-essential \
  clang \
  curl \
  git \
  libssl-dev \
  llvm \
  pkg-config \
  protobuf-compiler
```

**macOS:**

```bash
brew update
brew install openssl protobuf
```

### 1.3 Cài Rust

Substrate yêu cầu Rust nightly vì dùng một số feature chưa stable. Ta cài qua `rustup`:

```bash
# Cài rustup nếu chưa có
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Kiểm tra version
rustc --version
cargo --version
```

Thêm toolchain và target cần thiết:

```bash
# Thêm nightly toolchain
rustup update nightly
rustup update stable

# Thêm Wasm target (bắt buộc — runtime compile sang Wasm)
rustup target add wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown --toolchain nightly

# Thêm rust-src (cần để compile no_std code)
rustup component add rust-src
```

> [!info] Tại sao cần `wasm32-unknown-unknown`?
> Runtime của Substrate chain được compile sang **WebAssembly (Wasm)**. Binary Wasm này được lưu **on-chain** và có thể upgrade mà không cần hard fork. Lesson 02 sẽ giải thích chi tiết cơ chế này.

Kiểm tra lại:

```bash
rustup show
# Phải thấy: wasm32-unknown-unknown trong danh sách targets
```

---

## 2. Clone Solochain Template

Substrate cung cấp template sẵn cho solochain (chain độc lập, không kết nối parachain). Đây là điểm khởi đầu của **SimpleChain**:

```bash
git clone https://github.com/paritytech/polkadot-sdk-solochain-template.git simplechain
cd simplechain
```

### Cấu Trúc Thư Mục

```
simplechain/
├── node/               # Node implementation — networking, RPC, consensus config
│   ├── src/
│   │   ├── main.rs     # Entry point
│   │   ├── command.rs  # CLI subcommands
│   │   ├── service.rs  # Node services (network, block import, finality)
│   │   └── rpc.rs      # RPC server setup
│   └── Cargo.toml
├── pallets/            # Custom pallets — đây là nơi bạn sẽ làm việc nhiều nhất
│   └── template/       # Pallet mẫu đã có sẵn
│       ├── src/
│       │   └── lib.rs  # Logic của pallet
│       └── Cargo.toml
├── runtime/            # Runtime — "bộ não" của chain
│   ├── src/
│   │   └── lib.rs      # Runtime configuration, đăng ký tất cả pallets
│   └── Cargo.toml
└── Cargo.toml          # Workspace root
```

> [!tip] Tư duy về cấu trúc
> - **`node/`** = tầng infrastructure: networking, database, RPC. Bạn ít phải chỉnh phần này.
> - **`pallets/`** = nơi bạn viết business logic. Tương đương `contracts/` trong Hardhat.
> - **`runtime/`** = nơi "lắp ráp" pallets lại với nhau, tạo thành chain hoàn chỉnh.

---

## 3. Build Project

Lần đầu build sẽ **mất khá lâu** (15–40 phút tùy máy) vì phải compile toàn bộ polkadot-sdk dependencies:

```bash
cargo build --release
```

> [!warning] Lưu ý bộ nhớ
> Build Substrate cần ít nhất **8GB RAM**. Nếu máy bạn ít RAM hơn, giảm số luồng build:
> ```bash
> cargo build --release -j 2
> ```

Trong khi chờ build, hãy đọc tiếp phần 4. Khi build xong, bạn sẽ thấy:

```
Compiling solochain-template-runtime v0.1.0
Compiling solochain-template-node v0.1.0
Finished `release` profile [optimized] target(s) in ...
```

Binary được tạo ra tại `./target/release/solochain-template-node`.

---

## 4. Chạy Node Dev Mode

Development mode (`--dev`) là cách nhanh nhất để test chain. Nó:
- Tự khởi tạo genesis state mặc định
- Có sẵn các account test (Alice, Bob, Charlie...)
- Tự tạo block liên tục (instant seal)

```bash
./target/release/solochain-template-node --dev
```

Nếu muốn xóa chain state cũ trước khi chạy (tránh conflict):

```bash
./target/release/solochain-template-node purge-chain --dev -y
./target/release/solochain-template-node --dev
```

### Đọc Output

```
2024-01-15 10:23:01 Substrate Node
2024-01-15 10:23:01 ✌️  version 0.1.0-...
2024-01-15 10:23:01 ❤️  by Substrate DevHub, 2017-2024
2024-01-15 10:23:01 📋 Chain specification: Development   ← chain spec đang dùng
2024-01-15 10:23:01 🏷  Node name: Alice                  ← tên node
2024-01-15 10:23:01 👤 Role: AUTHORITY                   ← node này là validator
2024-01-15 10:23:01 💾 Database: RocksDb at /tmp/...      ← nơi lưu chain state
2024-01-15 10:23:01 🔨 Initializing Genesis block/state   ← khởi tạo block 0
2024-01-15 10:23:01 🏆 Imported #1 (0x1a2b...)            ← block đang được tạo
2024-01-15 10:23:07 🏆 Imported #2 (0x3c4d...)
```

Mỗi ~6 giây, một block mới được tạo. Chain đang chạy!

---

## 5. Kết Nối Polkadot.js Apps

**Polkadot.js Apps** là web UI để tương tác với bất kỳ Substrate node nào — đọc storage, gửi transactions, xem events.

1. Mở trình duyệt, vào: **https://polkadot.js.org/apps/**
2. Phía trên cùng bên trái, click vào dropdown network hiện tại
3. Chọn **"Development"** → **"Local Node"** (ws://127.0.0.1:9944)
4. Click **"Switch"**

Nếu kết nối thành công, bạn sẽ thấy block number tăng dần ở góc trên.

> [!tip] Khám phá ngay
> - **Explorer** → **Chain Info**: xem chain spec, version
> - **Accounts**: thấy các account mặc định (Alice, Bob...) với số dư
> - **Developer** → **Chain State**: query on-chain storage
> - **Developer** → **Extrinsics**: gửi transaction thủ công

### Thử Transfer Token

1. Vào **Accounts** → thấy Alice có `1,152,921,504,606,846,975` tokens
2. Vào **Developer** → **Extrinsics**
3. Chọn account **alice**, pallet **balances**, call **transferKeepAlive**
4. Nhập địa chỉ của Bob và amount (ví dụ `1000000000000`)
5. Submit → xác nhận trong **Explorer** → **Recent Events**

Bạn vừa gửi transaction đầu tiên trên chain của mình! 🎉

---

## 6. Tìm Hiểu Pallet Template Có Sẵn

Template đã có một pallet mẫu tại `pallets/template/src/lib.rs`. Mở file này:

```bash
cat pallets/template/src/lib.rs
```

Bạn sẽ thấy cấu trúc cơ bản của một pallet FRAME. Chưa cần hiểu hết ngay — Lesson 03 sẽ phân tích từng phần. Nhưng hãy chú ý các macro:

```rust
#[frame_support::pallet]      // đánh dấu đây là FRAME pallet
pub mod pallet {
    #[pallet::config]         // trait Config — cấu hình của pallet
    #[pallet::pallet]         // struct Pallet chính
    #[pallet::storage]        // khai báo on-chain storage
    #[pallet::event]          // khai báo events
    #[pallet::error]          // khai báo error types
    #[pallet::call]           // khai báo các dispatchable functions
}
```

Đây là "bộ khung" bạn sẽ dùng suốt series này.

---

## Bài Tập Thực Hành

> [!example] Bài tập 1.1 — Xem block details
> Vào Polkadot.js Apps → Explorer → chọn một block bất kỳ → xem danh sách extrinsics trong block đó. Có extrinsic nào tên `timestamp.set` không? Đây là gì?

> [!example] Bài tập 1.2 — Tìm storage của pallet template
> Vào Developer → Chain State → chọn pallet `templateModule` → query storage `something`. Giá trị là gì? Tại sao lại như vậy?

> [!example] Bài tập 1.3 — Gọi dispatchable
> Vào Developer → Extrinsics → chọn pallet `templateModule`, call `doSomething`, nhập giá trị `42`. Submit. Sau đó query lại storage `something` — thấy gì?

---

## Tóm Tắt

Sau lesson này bạn đã:
- ✅ Cài đặt đủ môi trường Substrate (Rust, Wasm target, system deps)
- ✅ Hiểu cấu trúc `node/ / pallets/ / runtime/` của project
- ✅ Build và chạy solochain `--dev` thành công
- ✅ Kết nối Polkadot.js Apps, gửi transaction đầu tiên
- ✅ Biết pallet FRAME có cấu trúc macro-based

**Lesson tiếp theo** (02): Mình sẽ mổ xẻ kiến trúc Substrate — tại sao runtime compile sang Wasm, Node làm gì, FRAME là gì. Đây là nền tảng lý thuyết ngắn nhưng rất cần thiết trước khi viết pallet.

---

*[[00-roadmap|← Roadmap]] | [[02-kien-truc-substrate|Lesson 02 →]]*
