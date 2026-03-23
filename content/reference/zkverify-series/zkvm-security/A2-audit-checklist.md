---
title: "A2. Security Audit Checklist"
tags: [zk, zkvm, security, checklist, appendix, audit]
aliases: [Security Audit Checklist]
created: 2026-03-13
---

> Master checklist tổng hợp từ tất cả lessons — dùng khi audit Risc0/SP1 application hoặc hunt bugs trên zkVerify.

---

## Checklist 1 — Guest Code (Application Layer)

### Arithmetic Safety
- [ ] `overflow-checks = true` trong `[profile.release]` của guest `Cargo.toml`
- [ ] Không dùng `as` keyword cho user-controlled values — dùng `TryFrom` / `try_into()`
- [ ] Không dùng unchecked arithmetic (`.unwrap()` trên `checked_add`) — dùng `checked_*` hoặc `saturating_*`
- [ ] Floating point: tránh hoàn toàn, hoặc verify deterministic behavior

### Input Validation
- [ ] Tất cả `io::read()` values được validate trước khi dùng
- [ ] Loop bounds từ user input bị giới hạn (DoS prevention)
- [ ] Array indices validate trong range
- [ ] Struct fields từ untrusted inputs được validate semantically

### Public vs Private Values
- [ ] Review mỗi `io::commit()` / `env::commit()` — đây có nên là public không?
- [ ] Private data (keys, passwords) không bị commit vào journal
- [ ] Verifier nhận đủ thông tin để verify ý nghĩa của computation (không chỉ bool)
- [ ] Commit cả message hash khi verify signature — không chỉ commit "valid"

### Nondeterminism
- [ ] Không dùng `HashMap` với default hasher nếu iteration order matter
- [ ] Không dùng `rand::thread_rng()` — dùng deterministic RNG từ host-provided seed
- [ ] Không dùng `std::time::SystemTime`
- [ ] Không dùng `std::thread` (không available trong zkVM)

### Syscall / Precompile Usage
- [ ] SP1: Không gọi `syscall_halt(0)` trực tiếp
- [ ] SP1: Patched crates version match SP1 SDK version
- [ ] SP1: Precompile inputs validated trước khi gọi
- [ ] Risc0: Không dùng OS-dependent crates

---

## Checklist 2 — Host Code

### Prover Mode
- [ ] `RISC0_DEV_MODE` không được set trong production
- [ ] Risc0: `ProverOpts` không enable dev mode
- [ ] SP1: Không dùng `ProverClient::mock()` trong production
- [ ] CI/CD: Enforce non-dev build trong pipeline

### Receipt / Proof Verification
- [ ] Risc0: Verify receipt với đúng `IMAGE_ID`
- [ ] SP1: Verify proof với đúng `vkey_hash`
- [ ] Risc0 composition: Assumptions được resolved (`.with_assumptions()`)
- [ ] Journal decode order matches guest commit order

---

## Checklist 3 — On-chain Verifier (Smart Contract)

### Proof Verification
- [ ] `imageId` (Risc0) hoặc `vkeyHash` (SP1) hardcoded — không lấy từ user input
- [ ] Verify call includes imageId/vkeyHash trong signature
- [ ] Dùng official Verifier Router contract (không hardcode verifier trực tiếp)

### Public Values Processing
- [ ] Decoded values validated cho range (uint bounds, non-zero checks)
- [ ] Business logic constraints trên decoded values
- [ ] Địa chỉ trong journal được verify với `msg.sender` nếu cần
- [ ] Journal decode order matches guest commit order

### Replay Protection
- [ ] Nullifier tracking nếu proof có thể reuse
- [ ] `attestationId` không được reuse (nếu dùng zkVerify)
- [ ] One-time-use mechanism cho time-sensitive proofs

### Aggregation (nếu dùng zkVerify)
- [ ] `leaf = H(vkeyHash || publicInputsHash)` computed correctly
- [ ] Merkle path verification correct
- [ ] `attestationId` valid và exists on zkVerify

---

## Checklist 4 — Circuit Review (Risc0 Zirgen)

### Instruction Coverage
- [ ] Mỗi instruction trong rv32im có circuit riêng (không share circuit sai)
- [ ] 3-register instructions: rs1 và rs2 forced từ đúng bit-field của instruction word
- [ ] Division/remainder: rs2=0 edge case, INT_MIN/-1 edge case
- [ ] Shift instructions: amount masked to 5 bits (`rs2 & 0x1F`)
- [ ] Load instructions: sign extension constraints đúng
- [ ] LUI/AUIPC: immediate field constraints

### Register File Constraints
- [ ] Register reads: value forced từ đúng register index
- [ ] Register writes: destination register forced từ instruction's rd field
- [ ] x0 register: writes ignored (x0 luôn là 0)

### Witness Quality
- [ ] Mỗi `NondetReg()` có explicit constraint nếu range cần bounded
- [ ] `NondetBitReg()` dùng khi cần {0,1} (không phải `NondetTwitReg()`)
- [ ] Conditional logic: cả hai nhánh đều constrained

### Precompile Circuits
- [ ] SHA-256: tất cả 80 rounds fully constrained?
- [ ] Keccak: full permutation constrained?
- [ ] EC precompiles: point-at-infinity, field membership checks?
- [ ] External call interface: không có unconstrained intermediate values?

---

## Checklist 5 — Circuit Review (SP1 AIR Chips)

### Chip Constraints
- [ ] Mỗi witness column có đủ constraints
- [ ] Boolean witnesses: `assert_bool()` được gọi
- [ ] Range checks: giá trị bounded như expected
- [ ] Cross-table lookup claims: CPU chip và ALU/Memory chip sync

### LogUp Lookups
- [ ] Mỗi event được emit bởi một chip có matching consume ở chip kia
- [ ] Claimed sums trong LogUp được absorbed vào Fiat-Shamir transcript trước challenges

### Execution Boundaries
- [ ] `next_pc == 0` enforced khi `is_complete = true`
- [ ] COMMIT syscalls flushed trước khi proof completion
- [ ] Shard boundaries: state transfer constrained correctly

---

## Checklist 6 — zkVerify Integration

### Pallet Interaction
- [ ] Proof type matches pallet (Risc0 shrink? SP1 shrink?)
- [ ] vkey encoding correct (BabyBear little-endian cho SP1, hex imageId cho Risc0)
- [ ] Public inputs encoding matches pallet expectations

### Attestation Usage
- [ ] Leaf computation: `H(vkeyHash || publicInputsHash)` matches zkVerify's scheme
- [ ] Merkle path valid for claimed attestationId
- [ ] Attestation not expired (check timestamp if applicable)
- [ ] Replay: each attestation used at most once per claim

---

## Bug Hunting Priority Matrix

| Target | Effort | Potential Severity | Recommended? |
|--------|--------|-------------------|-------------|
| Zirgen circuit — new instructions | Medium | Critical | ✅ Yes |
| Zirgen circuit — existing instructions | High | Critical | ✅ If thorough |
| SP1 AIR chips — new chips | Medium | Critical | ✅ Yes |
| SP1 execution boundaries | Low | Critical | ✅ Yes |
| zkVerify pallets — deserialization | Medium | Critical | ✅ Yes |
| On-chain verifier contracts | Low | High | ✅ Always check |
| Fiat-Shamir in new protocols | High | Critical | ✅ If depth available |
| Guest code patterns | Low | Medium | ✅ Quick wins |
| Backend proof system | Very high | Varies | ⚠️ If expert level |
