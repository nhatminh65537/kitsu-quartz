---
title: "A1. Polkadot.js Apps — Hướng Dẫn Tương Tác"
type: reference
tags: [substrate, polkadotjs, ui, rpc, appendix]
aliases: [Polkadot.js Guide]
created: 2026-04-18
---

> **Mục đích**: Hướng dẫn dùng Polkadot.js Apps để tương tác với SimpleChain — query storage, gửi transactions, xem events, dùng Sudo.

---

## 1. Kết Nối Đến Node

**URL**: https://polkadot.js.org/apps/

1. Click network dropdown (góc trên trái)
2. **Development** → **Local Node** → `ws://127.0.0.1:9944`
3. Click **Switch**

Kết nối thành công khi block number tăng dần ở góc trên phải.

> [!tip] Kết nối đến node thứ 2 (Bob)
> Đổi URL thành `ws://127.0.0.1:9945` để kết nối Bob node trong multi-node setup.

---

## 2. Xem Chain Info

**Explorer → Chain Info**:
- **best** — block cao nhất đã thấy (chưa finalized)
- **finalized** — block đã được GRANDPA finalize (không thể revert)
- Khoảng cách best − finalized ≤ 2-3 blocks là bình thường

---

## 3. Accounts — Pre-funded Dev Accounts

Trong dev mode, các accounts sau có sẵn với balance lớn:

| Name | Address (SS58) | Seed |
|------|----------------|------|
| Alice | 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY | `//Alice` |
| Bob | 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty | `//Bob` |
| Charlie | 5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y | `//Charlie` |
| Dave | 5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy | `//Dave` |

---

## 4. Gửi Transaction (Extrinsics)

**Developer → Extrinsics**

1. Chọn **account** (signer)
2. Chọn **pallet** (ví dụ `counter`)
3. Chọn **call** (ví dụ `increment`)
4. Điền arguments (nếu có)
5. Click **Submit Transaction**
6. Xác nhận trong dialog → **Sign and Submit**

### Các kiểu arguments hay gặp

| Kiểu | Ví dụ nhập |
|------|-----------|
| `u32`, `u64`, `u128` | Số nguyên: `42`, `1000000000000` |
| `AccountId` (SS58) | `5GrwvaEF5zXb26...` hoặc chọn từ dropdown |
| `Vec<u8>` / bytes | Hex: `0x48656c6c6f` = "Hello" |
| `bool` | Toggle Yes/No |

---

## 5. Query Storage

**Developer → Chain State**

1. Chọn **pallet** (ví dụ `counter`)
2. Chọn **storage item** (ví dụ `counter()`)
3. Điền key nếu cần (StorageMap yêu cầu key)
4. Click **+**

### Iterate Toàn Bộ StorageMap

Với StorageMap / StorageDoubleMap, để query tất cả entries:
1. Chọn storage item nhưng **không nhập key**
2. Chọn **include option** → bỏ tick
3. Click **+**
4. UI sẽ trả về tất cả entries

---

## 6. Xem Events

**Explorer → Recent Events** hoặc **Network → Explorer**

Sau mỗi block, events được liệt kê. Click vào event để xem chi tiết.

Events hay gặp:
- `system.ExtrinsicSuccess` — extrinsic thành công
- `system.ExtrinsicFailed` — extrinsic thất bại + error code
- `balances.Transfer` — chuyển token
- `counter.CounterIncremented` — event từ pallet tự viết

---

## 7. Sudo — Root Calls

**Developer → Sudo** (chỉ hiện khi pallet_sudo có trong runtime)

1. Chọn call muốn thực hiện với Root privilege
2. Submit
3. Ký bằng **sudo key** (mặc định là Alice trong dev mode)

Ví dụ: force-set balance cho account:

```
Sudo → balances → forceSetBalance
  who: [địa chỉ target]
  newFree: 5000000000000
```

---

## 8. RPC Calls Trực Tiếp

**Developer → RPC Calls**

Gọi thẳng RPC methods của node:

| RPC | Dùng để |
|-----|---------|
| `chain_getBlock` | Lấy block data theo hash |
| `chain_getBlockHash(number)` | Hash của block theo số |
| `state_getStorage(key)` | Raw storage tại key cụ thể |
| `system_health` | Kiểm tra node health |
| `system_peers` | Danh sách peers đang kết nối |

---

## 9. Runtime Upgrade (Forkless)

**Developer → Sudo → system → setCode**

1. Upload file Wasm: `target/release/wbuild/solochain-template-runtime/solochain_template_runtime.compact.compressed.wasm`
2. Submit với sudo key
3. Quan sát logs: node sẽ log `✨ Imported #N ... (runtime upgraded)`
4. Polkadot.js tự detect metadata thay đổi và reload

> [!warning] Chỉ dùng `setCode` với Wasm đã build từ cùng Cargo.toml
> Upload Wasm không tương thích sẽ làm chain panic. Luôn test trên dev trước.

---

## 10. Xem Metadata

**Developer → Runtime** → metadata

Metadata chứa toàn bộ thông tin về pallets, calls, storage, events hiện có trên chain — tự động generate từ macros. Polkadot.js dùng metadata để build UI động.

---

*[[a0-frame-macro-cheatsheet|← A0. FRAME Cheatsheet]] | [[00-roadmap|Roadmap]]*
