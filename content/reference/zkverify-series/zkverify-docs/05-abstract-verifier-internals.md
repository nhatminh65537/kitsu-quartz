---
title: "05. Abstract Verifier & Statement Digest Internals"
type: deep-dive
tags: [zkverify, verifier, abstract-verifier, statement-digest, rust, substrate-pallet, lesson-05]
aliases: [Abstract Verifier, hp_verifiers::Verifier, Verifier Trait]
source: "zkVerify Official Documentation — zkVerify Foundation, 2025–2026 — https://docs.zkverify.io"
created: 2026-03-28
---

> **Prerequisites**: Xem [[03-proof-submission-flow-statement-digest|03. Proof Submission Flow & Statement Digest]], [[02-mainchain-substrate-runtime-consensus|02. Mainchain: Substrate Runtime & Consensus]]  
> 🔴 **Prerequisite references**: Rust trait system [Rust]; Substrate pallet development [Substrate]; keccak256 [NIST]  
> **Lesson type**: Deep Dive  
> **Covers**: §7.0 Abstract Verifier — hp_verifiers::Verifier trait, statement digest computation, registerVk extrinsic, submitProof extrinsic logic
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | `hp_verifiers::Verifier` | Rust trait định nghĩa interface cho mọi verifier pallet |
> | `V` | Một implementation cụ thể của `Verifier` trait |
> | `Proof` | Associated type: kiểu dữ liệu proof của verifier V |
> | `Vk` | Associated type: kiểu dữ liệu verification key của verifier V |
> | `Pubs` | Associated type: kiểu dữ liệu public inputs của verifier V |
> | `H256` | 256-bit hash value (Substrate type) |
> | `keccak_256(x)` | Keccak-256 hash của byte slice x |
> | `VkOrHash` | Enum: `Vk(V::Vk)` hoặc `Hash(H256)` |

---

## Context: Vai Trò Của Abstract Verifier

Abstract Verifier là **layer trung gian** giữa Substrate extrinsic system và các verifier cụ thể. Nó định nghĩa:
1. Interface mà mọi verifier phải implement (trait `hp_verifiers::Verifier`).
2. Logic chung: statement digest computation, VK storage, fee charging.
3. Extrinsics và events/errors được share bởi mọi verifier pallet.

Mỗi verifier pallet (groth16, risc0, plonky2, ...) chỉ cần implement trait này — phần còn lại được handle bởi Abstract Verifier.

---

## hp_verifiers::Verifier Trait

> [!note] Specification 5.1 — hp_verifiers::Verifier Trait (Rust)
>
> ```rust
> pub trait Verifier {
>     // Associated types — mỗi verifier tự định nghĩa
>     type Proof: /* Decode + Encode + ... */;
>     type Vk: /* Decode + Encode + ... */;
>     type Pubs: /* Decode + Encode + ... */;
>
>     // Required: core verification logic
>     fn verify_proof(
>         vk: &Self::Vk,
>         proof: &Self::Proof,
>         pubs: &Self::Pubs,
>     ) -> Result<(), VerifyError>;
>
>     // Required: unique context bytes cho verifier này
>     fn hash_context_data() -> &'static [u8];
>     // Ví dụ: b"risc0", b"groth16", b"ultraplonk"
>
>     // Required: encode public inputs thành bytes
>     fn pubs_bytes(pubs: &Self::Pubs) -> Cow<[u8]>;
>
>     // Optional (có default implementation):
>     fn validate_vk(vk: &Self::Vk) -> Result<(), InvalidVerificationKey> {
>         Ok(()) // default: accept tất cả VK
>     }
>
>     fn vk_bytes(vk: &Self::Vk) -> Cow<[u8]> {
>         // default: SCALE encode
>     }
>
>     fn vk_hash(vk: &Self::Vk) -> H256 {
>         keccak_256(&Self::vk_bytes(vk)).into()
>         // default: keccak256(SCALE(vk))
>     }
>
>     fn verifier_version_hash(proof: &Self::Proof) -> H256 {
>         // default: fixed digest (non-versioned)
>         // versioned verifiers PHẢI override cái này
>     }
> }
> ```

### Phân Tích 8 Methods

> [!note] Specification 5.2 — Method Analysis
>
> | Method | Required? | Mô tả | Default |
> |--------|-----------|-------|---------|
> | `verify_proof()` | ✅ | Core ZK verification | — |
> | `hash_context_data()` | ✅ | Unique verifier ID bytes | — |
> | `pubs_bytes()` | ✅ | Encode public inputs → bytes | — |
> | `validate_vk()` | Optional | Kiểm tra VK hợp lệ | `Ok(())` (accept all) |
> | `vk_bytes()` | Optional | Encode VK → bytes | SCALE encode |
> | `vk_hash()` | Optional | Hash VK bytes | `keccak256(vk_bytes())` |
> | `verifier_version_hash()` | Optional | Version fingerprint | Fixed digest |
> | — | — | (8th: các Substrate type bounds) | — |

---

## Statement Digest Computation — Chi Tiết

> [!note] Specification 5.3 — Statement Digest Algorithm
>
> **Input**: Implementation `V: Verifier`, verification key `vk: V::Vk`, proof `proof: V::Proof`, public inputs `pubs: V::Pubs`
>
> **Output**: `H256` — statement hash (= leaf_digest)
>
> **Steps**:
> ```
> 1. ctx         ← keccak_256(V::hash_context_data())
> 2. vk_hash     ← V::vk_hash(&vk)
> 3. pubs_bytes  ← V::pubs_bytes(&pubs)
> 4. version_hash← V::verifier_version_hash(&proof)
>
> 5. data_to_hash ← ctx ++ vk_hash ++ version_hash ++ keccak_256(pubs_bytes)
>                   [4 × 32 bytes = 128 bytes total]
> 6. statement   ← keccak_256(data_to_hash)
> ```
>
> **Lưu ý quan trọng**: `vk_hash` được extend trực tiếp vào buffer (không keccak lần nữa), trong khi `pubs_bytes` được keccak trước khi extend. Đây là **asymmetry có chủ ý**: VK thường đã là hash (ví dụ risc0), còn public inputs là raw bytes.

---

## submitProof Extrinsic — Full Logic

> [!note] Specification 5.4 — submitProof Extrinsic
>
> **Extrinsic**: `submitProof(vkOrHash: VkOrHash, proof: V::Proof, pubs: V::Pubs, domainId: Option<u32>)`
>
> **Steps**:
> ```
> 1. Resolve VK:
>    - Nếu vkOrHash = Hash(h) → load VK từ storage tại key h
>    - Nếu vkOrHash = Vk(vk) → dùng trực tiếp (không lưu storage)
>
> 2. Validate VK:
>    V::validate_vk(&vk)  → nếu Err → emit InvalidVerificationKey, charge fee, return
>
> 3. Deserialize proof:
>    decode proof bytes → nếu Err → emit InvalidProof, charge fee, return
>
> 4. Deserialize public inputs:
>    decode pubs bytes → nếu Err → emit InvalidPublicInputs, charge fee, return
>
> 5. Verify:
>    V::verify_proof(&vk, &proof, &pubs) → nếu Err → emit VerificationFailed, charge fee, return
>
> 6. Compute statement:
>    statement = compute_statement_hash(vk, proof, pubs)  [xem Spec 5.3]
>
> 7. Emit ProofVerified(statement)
>
> 8. Aggregate (nếu domainId.is_some()):
>    → Domain checks + fund hold + emit events [xem Spec 4.2]
> ```

> [!warning] Security Note 5.5 — Validate_vk Default Behavior
> Default implementation của `validate_vk()` chấp nhận **mọi** VK mà không kiểm tra. Điều này đúng về mặt type-safety (encoded bytes hợp lệ), nhưng có thể cho phép:
> - VK với các field không hợp lệ về mặt toán học (ví dụ: point không nằm trên curve).
> - VK "degenerate" khiến verification luôn pass (hoặc luôn fail không cần đến proof).
>
> **Bug bounty angle**: Nếu một verifier cụ thể không override `validate_vk()` mà lẽ ra phải override, kẻ tấn công có thể craft VK đặc biệt để bypass ZK soundness.

---

## registerVk Extrinsic

> [!note] Specification 5.6 — registerVk Extrinsic
>
> **Extrinsic**: `registerVk(vk: V::Vk)`
>
> **Steps**:
> ```
> 1. Validate VK: V::validate_vk(&vk)
> 2. Compute hash: h = V::vk_hash(&vk)
> 3. Store: Storage[h] = vk
> 4. Emit: VkRegistered(hash = h)
> ```
>
> **Mục đích**: Cho phép submitter register VK một lần, sau đó dùng hash thay VK full trong mọi lần `submitProof`. Tiết kiệm transaction size đáng kể.
>
> **Lưu ý**: Bất kỳ ai cũng có thể register VK của người khác (permissionless). Điều này được thiết kế có chủ ý — VK là public knowledge.

---

## vk_hash() Override — Case Quan Trọng

Một số verifier override `vk_hash()` theo cách đặc biệt:

> [!note] Specification 5.7 — vk_hash Override (ví dụ: Risc0)
>
> Đối với **Risc0**: VK chính là image ID — đã là hash 32 bytes. Override:
>
> ```rust
> fn vk_hash(vk: &Self::Vk) -> H256 {
>     // Không hash lại — forward trực tiếp VK (đã là hash)
>     H256::from(vk.image_id)
> }
> ```
>
> Tương tự, nếu VK là commitment/hash của một proving key lớn, `vk_hash()` chỉ forward nó, không double-hash.

> [!warning] Security Note 5.8 — Double-Hash vs Forward
> Nếu verifier **nhầm** không override `vk_hash()` khi VK đã là hash (để lại default `keccak256(vk_bytes())`), statement digest sẽ khác so với kỳ vọng. Smart contract trên Ethereum tính `leaf_digest` theo logic của verifier — nếu logic không khớp giữa Substrate và Solidity, `verifyProofAggregation` sẽ luôn return false dù proof hợp lệ.
>
> Ngược lại, nếu override sai (forward khi nên hash), hai VK khác nhau có thể cho cùng `vk_hash` → VK binding bị phá vỡ.

---

## verifier_version_hash() — Replay Protection

> [!note] Specification 5.9 — verifier_version_hash
>
> **Mục đích**: Khi verifier logic được upgrade (breaking change), `verifier_version_hash()` thay đổi → mọi proof cũ (submit trước upgrade) tạo `statement` khác với proof mới (submit sau upgrade).
>
> **Non-versioned verifier** (default): fixed hash — mọi version có cùng `version_hash`.
>
> **Versioned verifier**: đọc version từ proof bytes và return hash tương ứng.
>
> Ví dụ Risc0: version v2.1, v2.2, v2.3 có `version_hash` khác nhau để phân biệt.

> [!warning] Security Note 5.10 — Missing Version Hash Update
> Nếu verifier được upgrade (thay đổi proof format hoặc verification equation) nhưng **quên** cập nhật `verifier_version_hash()`:
> - Proof cũ (từ version trước, có thể invalid về mặt toán học với verifier mới) vẫn tạo ra `statement` giống hệt proof mới.
> - Nếu proof cũ đã được anchor vào Merkle tree trên Ethereum, attacker có thể claim proof mới đã được verify khi thực ra chưa.
>
> **Bug bounty angle**: Kiểm tra changelog của các verifier pallet — nếu có breaking change mà `verifier_version_hash` không thay đổi → potential replay vulnerability.

---

## Summary

- `hp_verifiers::Verifier` trait = interface 8 methods; 3 required (`verify_proof`, `hash_context_data`, `pubs_bytes`); 4 optional với default.
- Statement digest: 4-field keccak chain: `keccak256(ctx || vk_hash || version_hash || keccak256(pubs_bytes))`.
- `submitProof` flow: resolve VK → validate → deserialize → verify → compute digest → emit event → aggregate.
- `validate_vk()` default chấp nhận mọi VK → verifier phải tự override nếu cần validation.
- `vk_hash()` override: khi VK đã là hash, forward trực tiếp (tránh double-hash).
- `verifier_version_hash()`: fingerprint phiên bản → bảo vệ khỏi replay attack sau upgrade.

---

## References

- Abstract Verifier source: https://github.com/zkVerify/zkVerify/tree/main/pallets/verifiers
- Mainchain API: https://docs.zkverify.io/architecture/mainchain/mainchain_api
- Abstract Verifier docs: https://docs.zkverify.io/architecture/verification_pallets/abstract
