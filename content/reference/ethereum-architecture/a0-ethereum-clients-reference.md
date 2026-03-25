---
title: "A0. Ethereum Clients Reference"
tags: [ethereum, blockchain, appendix, clients, geth, reth, lighthouse]
aliases: [Ethereum Clients, Execution Clients, Consensus Clients]
created: 2026-03-24
---

> **Loại file**: Appendix — Reference sheet
> **Dùng khi**: Cần biết client nào để setup node, so sánh implementations, hay tìm hiểu client diversity

---

## Execution Clients

Execution client chạy EVM, quản lý world state, cung cấp JSON-RPC API, giao tiếp qua devp2p.

### Geth (Go Ethereum)

| | |
|---|---|
| **Language** | Go |
| **Repo** | [github.com/ethereum/go-ethereum](https://github.com/ethereum/go-ethereum) |
| **Market share** | ~40% (largest, đang giảm) |
| **Strengths** | Reference implementation, nhiều tài liệu nhất, ecosystem tools |
| **Weaknesses** | RAM cao (~8–16 GB), sync chậm hơn Reth |

```bash
# Cài đặt (Ubuntu)
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt install geth

# Chạy full node với Lighthouse
geth --mainnet \
     --authrpc.addr localhost \
     --authrpc.vhosts localhost \
     --authrpc.jwtsecret /path/to/jwt.hex \
     --http --http.api eth,net,web3
```

### Reth (Rust Ethereum)

| | |
|---|---|
| **Language** | Rust |
| **Repo** | [github.com/paradigmxyz/reth](https://github.com/paradigmxyz/reth) |
| **Market share** | ~10% (tăng nhanh) |
| **Strengths** | Nhanh nhất (sync ~2 giờ vs Geth ~3-5 ngày), RAM thấp, modular codebase |
| **Weaknesses** | Còn tương đối mới, ecosystem tools ít hơn |

```bash
# Cài đặt từ release binary
curl -L https://reth.rs/reth-linux-x86_64.tar.gz | tar xz
./reth node --authrpc.jwtsecret /path/to/jwt.hex --http
```

### Nethermind (.NET)

| | |
|---|---|
| **Language** | C# / .NET |
| **Repo** | [github.com/NethermindEth/nethermind](https://github.com/NethermindEth/nethermind) |
| **Market share** | ~20% |
| **Strengths** | Plugin architecture, tốt cho institutional use, built-in tracing |
| **Weaknesses** | .NET runtime dependency |

### Besu (Java)

| | |
|---|---|
| **Language** | Java |
| **Repo** | [github.com/hyperledger/besu](https://github.com/hyperledger/besu) |
| **Market share** | ~5% |
| **Strengths** | Hyperledger project, tốt cho enterprise, privacy extensions (Tessera) |
| **Weaknesses** | JVM overhead, chủ yếu dùng cho private chains |

### Erigon

| | |
|---|---|
| **Language** | Go |
| **Repo** | [github.com/ledgerwatch/erigon](https://github.com/ledgerwatch/erigon) |
| **Market share** | ~10% |
| **Strengths** | Storage hiệu quả nhất (~2 TB vs Geth ~1.2 TB), archive node tốt |
| **Weaknesses** | API khác biệt một số chỗ, ít tài liệu hơn |

---

## Consensus Clients

Consensus client chạy Beacon Chain, quản lý validators, giao tiếp qua libp2p.

### Lighthouse (Rust)

| | |
|---|---|
| **Language** | Rust |
| **Repo** | [github.com/sigp/lighthouse](https://github.com/sigp/lighthouse) |
| **Market share** | ~35% (largest) |
| **Strengths** | Performance tốt nhất, memory efficient, security audits |
| **Weaknesses** | Cú pháp CLI hơi khác các client khác |

```bash
# Chạy Lighthouse (Beacon Node)
lighthouse beacon_node \
    --network mainnet \
    --execution-endpoint http://localhost:8551 \
    --execution-jwt /path/to/jwt.hex \
    --checkpoint-sync-url https://mainnet.checkpoint.sigp.io

# Chạy Lighthouse Validator Client
lighthouse validator_client \
    --network mainnet \
    --beacon-nodes http://localhost:5052
```

### Prysm (Go)

| | |
|---|---|
| **Language** | Go |
| **Repo** | [github.com/prysmaticlabs/prysm](https://github.com/prysmaticlabs/prysm) |
| **Market share** | ~40% (largest historically, đang giảm) |
| **Strengths** | Phổ biến nhất, nhiều tài liệu, UI dashboard |
| **Weaknesses** | Higher resource usage, historical supermajority status (diversity concern) |

### Teku (Java)

| | |
|---|---|
| **Language** | Java |
| **Repo** | [github.com/ConsenSys/teku](https://github.com/ConsenSys/teku) |
| **Market share** | ~10% |
| **Strengths** | Enterprise features, tốt cho staking providers |
| **Weaknesses** | JVM overhead |

### Nimbus (Nim)

| | |
|---|---|
| **Language** | Nim |
| **Repo** | [github.com/status-im/nimbus-eth2](https://github.com/status-im/nimbus-eth2) |
| **Market share** | ~5% |
| **Strengths** | Cực kỳ nhẹ (chạy được trên Raspberry Pi), phù hợp solo staker |
| **Weaknesses** | Ecosystem nhỏ hơn |

### Lodestar (TypeScript)

| | |
|---|---|
| **Language** | TypeScript |
| **Repo** | [github.com/ChainSafe/lodestar](https://github.com/ChainSafe/lodestar) |
| **Market share** | ~3% |
| **Strengths** | Duy nhất viết bằng TypeScript — quan trọng cho ecosystem diversity |
| **Weaknesses** | Performance thấp hơn Rust/Go clients |

---

## Client Diversity — Tại Sao Quan Trọng?

Client diversity là một trong những ưu tiên cao nhất của Ethereum:

> [!warning] Nguy cơ supermajority
> Nếu một client chiếm >66.7% validators, một bug trong client đó có thể:
> - Finalize một chain sai → consensus failure toàn mạng
> - Validators bị slash đồng loạt vì bug, không phải gian lận

Lịch sử: Tháng 8/2021, Geth có bug làm một phần chain phân nhánh. Vì Geth chiếm ~75%, chain "sai" gần được finalize trước khi được phát hiện và fix. Đây là lời cảnh báo về concentration risk.

**Khuyến nghị**: Chạy execution client không phải Geth (Reth, Nethermind, Besu) và consensus client không phải Prysm (Lighthouse, Teku, Nimbus).

---

## Port Reference

| Service | Default Port | Protocol |
|---------|-------------|---------|
| Geth/Reth P2P | 30303 | TCP + UDP |
| Lighthouse/Prysm P2P | 9000 | TCP + UDP |
| JSON-RPC HTTP | 8545 | TCP (HTTP) |
| JSON-RPC WebSocket | 8546 | TCP (WS) |
| Engine API | 8551 | TCP (HTTP, auth) |
| Beacon API | 5052 | TCP (HTTP) |
| Metrics (Prometheus) | 9090 (EL), 8008 (CL) | TCP |

---

## Minimal Hardware Requirements

| Node Type | RAM | Storage | CPU |
|-----------|-----|---------|-----|
| Full node (archive=false) | 16 GB | 1.2 TB SSD | 4 cores |
| Archive node | 32 GB | 14+ TB SSD | 8 cores |
| Light client | 4 GB | 50 GB | 2 cores |

> [!note] SSD bắt buộc
> Ethereum state reads/writes cực kỳ random — HDD quá chậm để sync. NVMe SSD là ideal; SATA SSD là minimum.

---

## References

- clientdiversity.org — [clientdiversity.org](https://clientdiversity.org) — Tracking client market share
- ethereum.org — [Nodes and Clients](https://ethereum.org/en/developers/docs/nodes-and-clients/)
- Geth docs — [geth.ethereum.org/docs](https://geth.ethereum.org/docs)
- Reth docs — [reth.rs](https://reth.rs/docs)
- Lighthouse book — [lighthouse-book.sigmaprime.io](https://lighthouse-book.sigmaprime.io)
