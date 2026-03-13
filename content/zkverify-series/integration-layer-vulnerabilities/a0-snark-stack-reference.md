---
title: "A0. SNARK Stack Reference Sheet"
tags: [zkp, snark, groth16, plonk, stark, reference, appendix]
aliases: [SNARK Stack Reference Sheet]
created: 2026-03-13
---

> **Mục đích**: Reference sheet nhanh cho các khái niệm kỹ thuật cần tra cứu khi audit.

---

## SNARK Stack — Taxonomy Đầy Đủ

```text
Layer 4: Integration Layer
  ├── Application contract / pallet
  ├── On-chain verifier contract
  ├── Auxiliary mechanisms (nullifier, Merkle tree, access control)
  └── Cross-chain relay

Layer 3: Frontend Layer
  ├── DSL (Domain-Specific Language)
  │   ├── Circom → R1CS
  │   ├── Noir → ACIR
  │   ├── Halo2 (eDSL in Rust) → PLONKish
  │   └── Leo (Aleo)
  ├── Compiler
  └── Witness Generator (WASM / native)

Layer 2: Backend Layer (Proof System)
  ├── Groth16 (pairing-based, requires trusted setup)
  ├── PLONK / UltraPlonk (universal setup)
  ├── fflonk (efficient PLONK variant)
  ├── STARK (hash-based, no trusted setup)
  └── Halo2 (recursive-friendly)

Layer 1: Circuit Layer
  ├── R1CS (Rank-1 Constraint System) — Circom output
  ├── PLONKish — Halo2 / PLONK output
  └── AIR (Algebraic Intermediate Representation) — STARK
```

---

## Proof System Comparison — Integration Layer Perspective

| Proof System | Setup | Verifier Contract Size | Field | Recursion | zkVerify support |
|---|---|---|---|---|---|
| **Groth16** | Trusted (per-circuit) | Small (~300 lines) | BN254 / BLS12-381 | Bằng Plonky2 | ✅ pallet-groth16 |
| **PLONK** | Universal | Medium | BN254 | Hỗ trợ | ✅ pallet-ultraplonk |
| **fflonk** | Universal | Small (batched) | BN254 | Không native | ✅ pallet-fflonk |
| **STARK** | None | Large (proof is large) | Binary field | Tự nhiên | ✅ (qua adapter) |
| **Halo2** | No trusted setup | Custom | Pasta / BN254 | Tốt | — |
| **RISC0** (zkVM) | None | Depends | BabyBear | Qua composition | ✅ pallet-risc0 |

**Integration Layer impact**:
- Groth16: VK hardcoded → phải redeploy khi circuit thay đổi. Risk: deploy sai VK.
- PLONK/Universal: VK có thể register on-chain → Risk: register malicious VK.
- RISC0: output là ImageID (hash của program) → Risk: ImageID không được validate.

---

## Public Input Flows — Theo Proof System

### Groth16 Public Input

```text
Circuit: [priv_in_1, priv_in_2 | pub_in_1, pub_in_2]
                                  ↕             ↕
Verifier: verifyProof(proof, [pub_in_1, pub_in_2])
```

Array `input[]` trong verifier contract tương ứng 1-1 với public signals trong circuit. Thứ tự quan trọng.

### RISC0 / zkVM Output

```text
zkVM proof chứa:
  - journal: public outputs (encoded bytes)
  - image_id: hash of program (verification key)

Integration Layer phải:
  1. Verify proof với đúng image_id
  2. Decode journal đúng format
  3. Validate decoded values
```

Risk V4 đặc biệt cao ở step 2-3: journal decode sai type → silent wrong value.

---

## Field Arithmetic — Các Giá Trị Cần Nhớ

| Field | Modulus (p) | Dùng trong |
|---|---|---|
| BN254 (bn128) | $2^{254} + 2^{252} + \ldots$ ≈ $2.18 \times 10^{76}$ | Groth16, PLONK, fflonk |
| BLS12-381 | ≈ $2^{381}$ | Ethereum PoS, some SNARKs |
| Pasta (Pallas/Vesta) | ≈ $2^{255}$ | Halo2 |
| BabyBear | $2^{31} - 2^{27} + 1$ | STARK, RISC0 |

**V4 relevance**: Public inputs phải < modulus p. Solidity uint256 có thể > p → implicit modular reduction.

---

## Nullifier Patterns — Reference Implementation

### Correct Nullifier Pattern (Semaphore-style)

```circom
// Trong circuit — nullifier PHẢI được constrain
template NullifierDerivation() {
    signal private input identityNullifier;
    signal input externalNullifier;     // public
    signal output nullifierHash;        // public

    // Derive nullifier từ private input và public context
    nullifierHash <== Poseidon(2)([identityNullifier, externalNullifier]);
}
```

```solidity
// Trong contract — check và store
mapping(uint256 => bool) public nullifierHashes;

function submitProof(uint256 nullifierHash, ...) external {
    require(!nullifierHashes[nullifierHash], "Already used");
    require(verifier.verifyProof(..., nullifierHash), "Invalid");
    nullifierHashes[nullifierHash] = true;  // Phải set TRƯỚC transfer
    // transfer...
}
```

### Anti-patterns Cần Nhận Diện

| Anti-pattern | Code dấu hiệu | Risk |
|---|---|---|
| Nullifier not in circuit | `nullifier = keccak(msg.sender, nonce)` off-chain | Forge nullifier |
| Per-epoch nullifier | `nullifiers[epoch][hash]` | Replay across epochs |
| Check-then-transfer (reentrancy) | `transfer()` trước `nullifiers[h] = true` | Reentrancy + V7 |
| Missing nullifier entirely | Không thấy `mapping` nào track proof usage | Replay attack |

---

## Checklist Master — Tổng Hợp V4–V7

### Khi đọc một Integration Layer contract/pallet

```text
=== V4 — Passing Unchecked Data ===
□ Liệt kê tất cả public inputs
□ Với mỗi input: range check? format check? semantic check?
□ Cross-input consistency?
□ Input có reference on-chain state không? State được validate không?

=== V5 — Proof Delegation Error ===
□ Ai generate proof? User hay third-party?
□ Witness được truyền cho ai? Qua channel nào?
□ Có commitment scheme bảo vệ delegator không?
□ Proving service có thể selectively deny không?

=== V6 — Proof Composition Error ===
□ Có nhiều hơn 1 proof trong hệ thống không?
□ Output proof A == Input proof B? Được enforce chưa?
□ Shared state giữa proofs có consistent không?
□ Recursive proof: VK match? Field match?

=== V7 — Complementary Logic Error ===
□ Nullifier: có, được check, đúng scope, atomic với action?
□ Merkle root: current root, not historical?
□ Access control: mọi condition được check trước action?
□ External protocols (tokens, etc.): actual vs. stated amounts?
□ State machine: proof chỉ valid ở đúng state?
```

---

## Tools Reference

| Tool | Install | Dùng cho |
|---|---|---|
| `snarkjs` | `npm install -g snarkjs` | Groth16/PLONK end-to-end, generate proof |
| `circom` | `cargo install --git https://github.com/iden3/circom` | Compile circuits |
| `foundry` | `curl -L https://foundry.paradigm.xyz \| bash` | Test Solidity verifier contracts |
| `cargo test` | Built-in Rust | Test Substrate pallets |
| `polkadot-js-api` | `npm install @polkadot/api` | Interact với zkVerify node |
| `web3.py` | `pip install web3` | Interact với EVM relay contract |
