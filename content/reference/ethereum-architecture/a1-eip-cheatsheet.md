---
title: "A1. EIP Cheatsheet"
tags: [ethereum, blockchain, appendix, eip, cheatsheet]
aliases: [EIP Cheatsheet, Ethereum Improvement Proposals]
created: 2026-03-24
---

> **Loại file**: Appendix — Reference sheet
> **Dùng khi**: Cần tìm nhanh EIP nào làm gì, EIP thuộc hard fork nào

---

## EIP là gì?

**Ethereum Improvement Proposal (EIP)** là tài liệu đề xuất thay đổi cho Ethereum protocol. Có ba loại: **Core** (protocol changes, cần hard fork), **ERC** (application standards, không cần fork), **Meta** (process changes).

---

## Các EIP Core Quan Trọng Nhất

### Cryptography & Identity

| EIP | Tên | Hard Fork | Nội dung |
|-----|-----|-----------|---------|
| **EIP-155** | Replay Protection | Spurious Dragon (2016) | Đưa `chainId` vào tx signature để ngăn cross-chain replay attack |
| **EIP-2** | Homestead Changes | Homestead (2016) | Nhiều fix nhỏ, chuẩn hóa signing |
| **EIP-55** | Checksum Address | N/A (off-chain) | Mixed-case address checksum để phát hiện typo |
| **EIP-191** | Signed Data Standard | N/A | Định dạng chuẩn để ký arbitrary messages (không chỉ transactions) |
| **EIP-712** | Typed Structured Data | N/A | Ký structured data (JSON schema) — dùng trong MetaMask "Sign" dialogs |

### Transaction Types

| EIP | Tên | Hard Fork | Nội dung |
|-----|-----|-----------|---------|
| **EIP-2718** | Typed Transaction Envelope | Berlin (2021) | Framework cho nhiều loại transaction |
| **EIP-2930** | Optional Access Lists | Berlin (2021) | Type 1 tx với access list để pre-warm storage |
| **EIP-1559** | Fee Market Change | London (2021) | Base fee + priority fee, đốt base fee, Type 2 tx |
| **EIP-4844** | Shard Blob Transactions | Dencun (2024) | Type 3 tx với blob data cho rollups |

### EVM Changes

| EIP | Tên | Hard Fork | Nội dung |
|-----|-----|-----------|---------|
| **EIP-170** | Contract Size Limit | Spurious Dragon | Max contract size = 24,576 bytes |
| **EIP-1052** | EXTCODEHASH | Constantinople | Opcode để lấy keccak256 của contract code |
| **EIP-1283** | SSTORE gas metering | N/A (withdrawn, reintroduced) | Net metering cho storage writes |
| **EIP-2200** | SSTORE gas rebalancing | Istanbul (2019) | Rebalance SSTORE costs, basis cho EIP-2929 |
| **EIP-2929** | Gas cost increases | Berlin (2021) | Cold/warm access distinction: SLOAD 2100 cold, 100 warm |
| **EIP-3198** | BASEFEE opcode | London (2021) | Opcode để đọc base fee của block hiện tại |
| **EIP-3529** | Reduction in refunds | London (2021) | Giảm gas refund từ SSTORE, remove SELFDESTRUCT refund |
| **EIP-1153** | Transient Storage | Cancun (2024) | `TSTORE`/`TLOAD` — storage tạm thời, reset sau mỗi tx |
| **EIP-5656** | MCOPY | Cancun (2024) | Opcode copy memory hiệu quả hơn |
| **EIP-3651** | Warm COINBASE | Shanghai (2023) | Giảm gas khi access coinbase address |
| **EIP-7702** | Set EOA Code | Pectra (2025) | EOA có thể tạm thời set code (account abstraction) |

### Consensus & PoS

| EIP | Tên | Hard Fork | Nội dung |
|-----|-----|-----------|---------|
| **EIP-3675** | Upgrade to PoS | The Merge (2022) | Chính thức chuyển Ethereum sang Proof of Stake |
| **EIP-4895** | Beacon chain withdrawals | Shanghai (2023) | Cho phép rút ETH staking |
| **EIP-7251** | Increase MAX_EFFECTIVE_BALANCE | Pectra (2025) | Validator có thể stake hơn 32 ETH (lên đến 2048 ETH) |

### State & Data

| EIP | Tên | Hard Fork | Nội dung |
|-----|-----|-----------|---------|
| **EIP-778** | ENR — Ethereum Node Records | N/A | Định dạng chuẩn cho thông tin kết nối node |
| **EIP-1898** | Block parameter by hash | N/A | API: specify block bằng hash, không chỉ number/tag |
| **EIP-4788** | Beacon block root in EVM | Cancun (2024) | Expose CL block root trong EVM — cho bridges, restaking |

---

## Các ERC Quan Trọng Nhất

ERC (Ethereum Request for Comments) là application-level standards — không cần hard fork, chỉ cần smart contracts follow interface.

### Token Standards

| ERC | Tên | Nội dung |
|-----|-----|---------|
| **ERC-20** | Fungible Token Standard | Interface cho fungible token: `transfer`, `approve`, `allowance`, events `Transfer`/`Approval` |
| **ERC-721** | Non-Fungible Token | NFT standard: mỗi token có unique `tokenId`, `ownerOf`, `transferFrom` |
| **ERC-1155** | Multi Token Standard | Một contract chứa cả fungible + non-fungible tokens, batch transfers |
| **ERC-4626** | Tokenized Vault | Standard cho yield-bearing vaults (Aave, Yearn-compatible) |

### Account & Wallet

| ERC | Tên | Nội dung |
|-----|-----|---------|
| **ERC-4337** | Account Abstraction | Smart contract wallets, Bundler, UserOperation, Paymaster — không cần EOA gửi tx |
| **ERC-1271** | Signature Validation | Contract wallet có thể validate signatures (isValidSignature) |

### Proxy & Upgradeability

| ERC | Tên | Nội dung |
|-----|-----|---------|
| **EIP-1967** | Proxy Storage Slots | Standard slots để lưu implementation address trong proxy contracts |
| **EIP-1167** | Minimal Proxy | EIP để clone contract với minimal bytecode (cheap deployment) |

### Misc

| ERC | Tên | Nội dung |
|-----|-----|---------|
| **ERC-165** | Interface Detection | `supportsInterface(bytes4)` — contract declare which interfaces nó implement |
| **ERC-2612** | Permit — ERC-20 Approval via Signature | Approve ERC-20 spend bằng signature offline, không cần on-chain approve tx trước |
| **ERC-3525** | Semi-Fungible Token | Token vừa có slot (như NFT) vừa có value (như fungible) |

---

## Hard Fork Timeline

| Hard Fork | Date | Key EIPs |
|-----------|------|---------|
| Homestead | Mar 2016 | EIP-2, EIP-7 |
| Tangerine Whistle | Oct 2016 | EIP-150 (gas repricing) |
| Spurious Dragon | Nov 2016 | EIP-155 (replay protection), EIP-170 (contract size limit) |
| Byzantium | Oct 2017 | EIP-140 (REVERT), EIP-198 (big int modexp precompile) |
| Constantinople | Feb 2019 | EIP-1052, EIP-1234 (block reward reduction) |
| Istanbul | Dec 2019 | EIP-152, EIP-1108, EIP-2200 |
| Muir Glacier | Jan 2020 | EIP-2384 (difficulty bomb delay) |
| Berlin | Apr 2021 | EIP-2565, EIP-2929, EIP-2718, EIP-2930 |
| **London** | **Aug 2021** | **EIP-1559 (fee market), EIP-3198 (BASEFEE opcode)** |
| Arrow Glacier | Dec 2021 | EIP-4345 (difficulty bomb delay) |
| Gray Glacier | Jun 2022 | EIP-5133 (difficulty bomb delay) |
| **The Merge** | **Sep 2022** | **EIP-3675 (PoS transition)** |
| **Shanghai/Capella** | **Apr 2023** | **EIP-4895 (withdrawals), EIP-3651, EIP-3855 (PUSH0)** |
| **Dencun** | **Mar 2024** | **EIP-4844 (blobs), EIP-1153 (TSTORE), EIP-4788 (beacon root)** |
| **Pectra** | **May 2025** | **EIP-7702 (set EOA code), EIP-7251 (max effective balance)** |

---

## Cách Đọc EIP

Mọi EIP đều có cấu trúc chuẩn:

```text
Abstract     — Tóm tắt ngắn gọn
Motivation   — Tại sao cần EIP này
Specification — Chi tiết kỹ thuật (phần quan trọng nhất)
Rationale    — Lý do đưa ra quyết định thiết kế
Backwards Compatibility — Có breaking changes không
Test Cases   — Test vectors
Reference Implementation — Code implementation mẫu
```

**Tìm EIP**: [eips.ethereum.org](https://eips.ethereum.org) — tìm theo số hoặc keyword.

---

## References

- EIP repository — [eips.ethereum.org](https://eips.ethereum.org)
- ethereum.org hard fork history — [ethereum.org/history](https://ethereum.org/en/history/)
- ERC-20 — [eips.ethereum.org/EIPS/eip-20](https://eips.ethereum.org/EIPS/eip-20)
- ERC-721 — [eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721)
- ERC-4337 — [eips.ethereum.org/EIPS/eip-4337](https://eips.ethereum.org/EIPS/eip-4337)
