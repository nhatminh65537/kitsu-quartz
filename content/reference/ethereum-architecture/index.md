---
title: "Ethereum Architecture"
tags: [ethereum, blockchain, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-ethereum-big-picture|01. Ethereum — Big Picture & Design Philosophy]] — Ethereum là gì, "World Computer", kiến trúc node 2 lớp (execution/consensus), lịch sử từ PoW đến PoS, các khái niệm nền tảng.
- [[02-account-model-world-state|02. Account Model & World State]] — EOA vs Contract Account, 4 trường của account, World State là gì, hàm state transition, genesis block.
- [[03-rlp-encoding|03. RLP Encoding]] — 5 quy tắc RLP, encode byte string và list lồng nhau, implement từ đầu bằng Python, RLP trong transaction hash và contract address.
- [[04-merkle-patricia-trie|04. Merkle Patricia Trie]] — 3 loại node (branch/extension/leaf), hex-prefix encoding, 4 loại trie trong Ethereum (State/Tx/Receipt/Storage), Merkle proof cho light client.
- [[05-keccak-ecdsa-addresses|05. Keccak-256, ECDSA & Ethereum Addresses]] — Keccak-256 vs SHA3, secp256k1, private→public→address, ECDSA sign/recovery, EIP-155 replay protection, EIP-55 checksum.
- [[06-transaction-lifecycle|06. Transaction Lifecycle & Types]] — 5 giai đoạn lifecycle, mempool pending/queued, Type 0/2/3 transaction, EIP-1559 fee model, EIP-4844 blob data.
- [[07-gas-model-eip1559|07. Gas Model & EIP-1559]] — Intrinsic gas, cold/warm access, EIP-1559 formula, base fee ±12.5% adjustment algorithm, ETH burn.
- [[08-evm-architecture|08. EVM Architecture]] — Stack machine, 4 vùng dữ liệu (stack/memory/calldata/storage), execution context, trace bytecode step-by-step, creation vs runtime code, CALL/STATICCALL/DELEGATECALL.
- [[09-smart-contracts-abi-logs|09. Smart Contracts, ABI & Logs]] — Function selector, ABI encoding static/dynamic types, calldata layout, Event log structure (topics/data), Bloom filter, fallback/receive.
- [[10-p2p-network-layer|10. P2P Network Layer]] — Discovery stack vs devP2P stack, ENR/Node ID, Kademlia XOR distance, discv5, RLPx handshake (ECIES), Ethereum Wire Protocol eth/68, libp2p cho Consensus Layer.
- [[11-json-rpc-external-interaction|11. JSON-RPC & External Interaction]] — JSON-RPC 2.0 format, block tags (latest/safe/finalized), eth_call vs eth_sendRawTransaction, eth_getLogs filters, WebSocket subscriptions, web3.py/ethers.js.
- [[12-proof-of-stake-beacon-chain|12. Proof of Stake & Beacon Chain]] — Slot/epoch/checkpoint, validator duties (propose/attest), Gasper = LMD-GHOST + Casper FFG, justification/finalization, inactivity leak, slashing.
- [[13-post-merge-architecture|13. Post-Merge Architecture]] — Engine API (forkchoiceUpdated/getPayload/newPayload), luồng block building 12s, MEV (arbitrage/sandwich/liquidation), MEV-Boost/PBS, withdrawals.
- [[14-layer2-rollup-architecture|14. Layer 2 & Rollup Architecture]] — Blockchain trilemma, Optimistic Rollup (fraud proof, 7-day challenge), ZK Rollup (validity proof, zkEVM types), EIP-4844 blobs 128KB/prune 18 days, sequencer, canonical bridge.
- [[15-oracles-bridges|15. Oracles & Cross-chain Bridges]] — Oracle problem, push/pull/request-response oracles, Chainlink OCR architecture, 5 bridge trust models (canonical → liquidity network), bridge hack patterns.

## Appendices

- [[a0-ethereum-clients-reference|A0. Ethereum Clients Reference]] — Geth/Reth/Nethermind/Besu/Erigon (execution) và Lighthouse/Prysm/Teku/Nimbus/Lodestar (consensus): market share, strengths, port reference, hardware requirements.
- [[a1-eip-cheatsheet|A1. EIP Cheatsheet]] — Core EIPs theo category (cryptography, tx types, EVM, PoS), ERC standards (ERC-20/721/1155/4337), hard fork timeline từ Homestead đến Pectra.

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `web3.py` | Tương tác với Ethereum node qua Python | `pip install web3` |
| `ethers.js` | Tương tác với Ethereum node qua JavaScript | `npm install ethers` |
| `eth_abi` | Encode/decode ABI data trong Python | `pip install eth-abi` |
| `rlp` | RLP encode/decode trong Python | `pip install rlp` |
| Geth | Execution client phổ biến nhất (Go) | [geth.ethereum.org](https://geth.ethereum.org) |

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| EOA | Externally Owned Account — tài khoản do người dùng nắm giữ |
| CA | Contract Account — tài khoản smart contract |
| EVM | Ethereum Virtual Machine |
| MPT | Merkle Patricia Trie |
| RLP | Recursive Length Prefix — định dạng encoding của Ethereum |
| EL | Execution Layer (trước đây: Eth1) |
| CL | Consensus Layer (trước đây: Eth2 / Beacon Chain) |
| EIP | Ethereum Improvement Proposal |
| PoS | Proof of Stake |
| wei | Đơn vị nhỏ nhất của Ether: 1 ETH = 10^18 wei |
| gwei | 10^9 wei — thường dùng cho gas price |
