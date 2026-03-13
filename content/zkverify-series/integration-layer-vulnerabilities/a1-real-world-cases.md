---
title: "A1. Real-World Case Studies"
tags: [zkp, integration-layer, case-study, tornado-cash, semaphore, audit, appendix]
aliases: [Real-World Case Studies]
created: 2026-03-13
---

> **Mục đích**: Tổng hợp các case study thực tế để tham khảo khi audit. Mỗi case được map tới loại lỗi V4–V7.

---

## Case 1 — Tornado Cash Nullifier (V7) — Hypothetical Drain Scenario

**Protocol**: Tornado Cash — Privacy-preserving ETH mixer
**Vulnerability type**: V7 — ZKP Complementary Logic Error
**Lesson learned from**: SoK paper example, production code analysis

### Mô Tả

Tornado Cash sử dụng ZKP để tách withdrawal khỏi deposit. Circuit chứng minh: *"Tôi biết (nullifier, secret) sao cho hash của chúng nằm trong Merkle tree deposits."*

**Vấn đề**: Nếu dòng `require(!nullifierHashes[nullifierHash])` bị remove hoặc bị bypass (ví dụ do upgrade bug), circuit vẫn valid nhưng user có thể withdraw vô hạn lần.

### Timeline Attack

```text
1. Attacker deposit 1 ETH → nhận commitment C = H(N, S)
2. Attacker generate valid proof π cho withdrawal
3. Attacker gọi withdraw(π, H(N)) → nhận 1 ETH (VALID)
4. Attacker gọi lại withdraw(π, H(N)) → nhận thêm 1 ETH (BUG)
5. Lặp đến khi pool cạn
```

### Code Pattern Bị Sai (Illustrative)

```solidity
// Nếu contract KHÔNG có nullifier check
function withdraw(bytes calldata proof, bytes32 nullifierHash, address recipient) external {
    require(verifier.verifyProof(proof, [nullifierHash, uint256(merkleRoot)]), "Invalid");
    // ← THIẾU: require(!nullifierHashes[nullifierHash], "Used");
    // ← THIẾU: nullifierHashes[nullifierHash] = true;
    payable(recipient).transfer(denomination);
}
```

### Lesson

Circuit đúng + Proof verify đúng ≠ Protocol đúng. V7 bugs vô hình với circuit-only audit.

---

## Case 2 — Semaphore Completeness Bug (V4) — GitHub Issue #90 (2022)

**Protocol**: Semaphore — Anonymous signaling/voting
**Vulnerability type**: V4 — Passing Unchecked Data (affecting Completeness)
**Source**: github.com/semaphore-protocol/semaphore/issues/90

### Mô Tả

Semaphore protocol sử dụng `externalNullifier` là public input để phân biệt các "groups" hoặc "epochs" khác nhau. Khi frontend gửi sai `externalNullifier` (ví dụ: gửi `groupId` thay vì `externalNullifier`), proof vẫn valid về mặt toán học nhưng contract reject do mismatch với expected `externalNullifier`.

**Loại lỗi**: Không phải soundness (attacker không gain gì) mà là **completeness**: honest user bị từ chối oan.

### Root Cause

Integration Layer (smart contract) kiểm tra `externalNullifier` phải match với registered group. Nhưng:
- Circuit accept bất kỳ `externalNullifier` nào
- Frontend có thể gửi sai value
- Contract reject → honest user thất bại

V4 ở đây là thiếu **documentation và validation** về format chính xác của `externalNullifier` mà Integration Layer expect.

### Fix

Thêm explicit validation và documentation về format của mỗi public input. Frontend library phải enforce đúng encoding.

---

## Case 3 — ZkSync Missing Subgroup Check (V4 variant)

**Protocol**: zkSync Era (zkEVM)
**Vulnerability type**: V4 adjacent — Missing curve point validation
**Pattern**: Proof points không được validate là trên đúng subgroup

### Mô Tả

Groth16 verifier contract phải kiểm tra proof elements (A, B, C) thuộc đúng subgroup của elliptic curve. Nếu bỏ qua:

```text
Attacker submit:
  A = point KHÔNG thuộc G1 subgroup (malformed)
  B = point KHÔNG thuộc G2 subgroup
  C = point KHÔNG thuộc G1 subgroup

Pairing equation:
  e(A, B) = e(α, β) * e(vk_x, γ) * e(C, δ)
  Có thể thỏa mãn dù proof hoàn toàn fake → soundness broken
```

### Integration Layer Fix

```solidity
// Thêm subgroup check trong verifier
function isOnCurveG1(uint256 x, uint256 y) internal pure returns (bool) {
    // Check y^2 = x^3 + 3 (mod p) cho BN254
    uint256 lhs = mulmod(y, y, P);
    uint256 rhs = addmod(mulmod(mulmod(x, x, P), x, P), 3, P);
    return lhs == rhs;
}

function verifyProof(uint[2] memory a, ...) public view returns (bool) {
    require(isOnCurveG1(a[0], a[1]), "A not on curve");
    // ...
}
```

---

## Case 4 — Voting System Epoch Nullifier (V7) — Cantina Pattern

**Protocol**: Anonymous voting (generic pattern từ Cantina audit)
**Vulnerability type**: V7 — Nullifier scope sai

### Mô Tả

Hệ thống vote ẩn danh sử dụng nullifier per-epoch. Mỗi epoch, user có thể vote một lần. Mapping: `nullifiers[epochId][nullifierHash] = bool`.

**Bug**: Khi epoch thay đổi (epochId tăng), nullifier cũ bị "reset". User có thể dùng cùng proof để vote lại ở epoch mới.

### Timeline Attack

```text
Epoch 0:
  User vote với nullifier N → nullifiers[0][H(N)] = true → OK

Epoch 1 bắt đầu:
  nullifiers[1][H(N)] = false (chưa set)
  User vote lại với cùng proof → nullifiers[1][H(N)] = true → ACCEPTED!

Kết quả: User vote 2 lần (1 mỗi epoch)
```

### Code Vulnerable vs. Fixed

```solidity
// ❌ VULNERABLE
mapping(uint256 => mapping(bytes32 => bool)) public epochNullifiers;
uint256 public epoch;

function vote(bytes32 nullHash, uint8 choice) external {
    require(!epochNullifiers[epoch][nullHash], "Already voted this epoch");
    epochNullifiers[epoch][nullHash] = true;
    // ...
}

// ✅ FIXED — Global nullifier set
mapping(bytes32 => bool) public usedNullifiers;

function vote(bytes32 nullHash, uint8 choice) external {
    require(!usedNullifiers[nullHash], "Nullifier used");
    usedNullifiers[nullHash] = true;
    // ...
}
```

---

## Case 5 — zkRollup Missing State Root Chain (V6)

**Protocol**: Generic zkRollup
**Vulnerability type**: V6 — Proof Composition Error (Missing Linkage)

### Mô Tả

zkRollup có hai loại proof:
- **Transaction proof** $\pi_{tx}$: chứng minh một batch transactions hợp lệ, output new state root $R_{new}$
- **State transition proof** $\pi_{st}$: chứng minh state đúng, sử dụng $R_{new}$ làm input

Nếu contract không enforce `π_st.input_root == π_tx.output_root`:

```text
Attacker:
  1. Submit tx_proof cho batch A → output root R_A
  2. Submit state_proof với input root R_B ≠ R_A → passes nếu không có linkage check!
  3. State transition happen based on R_B (sai state)
```

### Fix Pattern

```solidity
bytes32 public latestStateRoot;

function submitTxBatch(bytes calldata txProof, bytes32 newRoot) external {
    require(txVerifier.verify(txProof, [latestStateRoot, newRoot]), "Invalid tx proof");
    // Không update state root ở đây — chỉ store pending
    pendingRoot = newRoot;
}

function finalizeStateTransition(bytes calldata stateProof) external {
    // ✅ Enforce linkage: state proof phải chứng minh từ pendingRoot
    require(stateVerifier.verify(stateProof, [pendingRoot, finalRoot]), "Invalid state proof");
    require(stateProof.inputRoot == pendingRoot, "Root linkage broken");
    latestStateRoot = finalRoot;
}
```

---

## Case 6 — Fee-on-Transfer Token Bug (V7) — Cantina Real Case

**Protocol**: ZKP batch settlement (generic)
**Vulnerability type**: V7 — Auxiliary mechanism out of sync with ZKP outcome

### Mô Tả (đã phân tích trong Lesson 06)

Circuit chứng minh "transfer X tokens." Token có fee-on-transfer — recipient nhận X - fee. Integration Layer dùng `X` thay vì `X - fee` để update ledger.

### Impact

- Ledger overstate balances → có thể drain bằng cách exploit ledger discrepancy
- Severity: Medium–High tùy vào downstream usage của ledger

### Fix

```solidity
uint256 before = token.balanceOf(recipient);
token.transfer(recipient, amount);
uint256 actual = token.balanceOf(recipient) - before;
updateLedger(recipient, actual); // Dùng actual, không dùng amount
```

---

## Case 7 — Jolt zkVM Memory Layout Manipulation (V4 + V5 hybrid)

**Protocol**: Jolt zkVM (a16z)
**Vulnerability type**: V4 adjacent — zkSecurity report 2024

### Mô Tả

Trong Jolt zkVM, verifier nhận proof data bao gồm memory layout. **Bug**: Nếu verifier lấy memory layout trực tiếp từ proof data mà không re-derive từ circuit computation, malicious prover có thể:

```text
Normal flow:
  Circuit computes correct memory layout → committed in proof
  Verifier reads memory layout from proof

Bug:
  Verifier takes memory layout directly from proof data (not circuit output)
  Malicious prover: forge memory layout in proof data
  → Verifier accepts wrong memory state
  → Can overwrite output registers → fake computation result
```

### Integration Layer Lesson

Verifier contract/pallet không được tin tưởng bất kỳ field nào trong proof data mà không được circuit constrain. Phân biệt:
- **Constrained data**: Circuit enforce → an toàn
- **Metadata/auxiliary data**: Không constrained → phải re-validate trong Integration Layer

---

## Summary Table — Cases Mapped to Vulnerability Types

| Case | Protocol | Type | Impact | Fix Pattern |
|---|---|---|---|---|
| 1 | Tornado Cash | V7 — Missing nullifier | Critical (drain) | Store + check nullifier |
| 2 | Semaphore | V4 — Completeness | Medium (DoS users) | Validate public input format |
| 3 | zkSync | V4 — Subgroup check | Critical (forge proof) | Add curve point validation |
| 4 | Voting | V7 — Epoch nullifier | High (double vote) | Global nullifier set |
| 5 | zkRollup | V6 — Missing linkage | Critical (wrong state) | Enforce root chain |
| 6 | Batch settle | V7 — Fee token | Medium (accounting) | Measure actual balance |
| 7 | Jolt zkVM | V4 — Memory layout | Critical (fake result) | Derive, don't trust |
