---
title: "06. Concrete Verifiers: Survey & Bug Hunting Guide"
type: survey
tags: [zkverify, groth16, risc0, plonky2, sp1, ultrahonk, ultraplonk, ezkl, tee, verifier, lesson-06]
aliases: [Concrete Verifiers, Verifier Survey, Groth16 Pallet, Risc0 Pallet]
source: "zkVerify Official Documentation — zkVerify Foundation, 2025–2026 — https://docs.zkverify.io"
created: 2026-03-28
---

> **Prerequisites**: Xem [[05-abstract-verifier-internals|05. Abstract Verifier & Statement Digest Internals]]  
> 🔴 **Prerequisite references**: Groth16 [Groth16]; PLONK [PLONK]; FRI/STARK [STARK]; Poseidon hash [Poseidon]; BN254/BLS12-381 curves [ECC]  
> **Lesson type**: Survey  
> **Covers**: §7.1–7.8 Concrete Verifier Pallets, §10 Supported Proofs table
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | BN128 / BN254 | Barreto-Naehrig curve; 128-bit / 254-bit; thường dùng trên Ethereum |
> | BLS12-381 | Barreto-Lynn-Scott curve; pairing-friendly, dùng trong Groth16/ETH2 |
> | FRI | Fast Reed-Solomon IOP — nền tảng của STARK |
> | cbor | Concise Binary Object Representation — serialization format |
> | SCALE | Substrate Canonical ACLE encoding |
> | arkworks | Rust library cho ZK math (ark-groth16) |
> | Barretenberg (bb) | Aztec Protocol's proving backend cho Noir |
> | image_id | Risc0's VK — hash của zkVM program binary |

---

## Tổng Quan Các Verifier

zkVerify hiện có 8 concrete verifier pallet. Mỗi pallet implement `hp_verifiers::Verifier` trait (xem lesson 05) với các tùy chỉnh riêng về proof format, VK encoding, và statement digest.

| Pallet | Proving Scheme | Loại Proof | Bug Hunting Priority |
|--------|---------------|------------|---------------------|
| `groth16` | Groth16 | SNARK (pairing-based) | ⭐⭐⭐ Cao nhất — user biết Groth16 |
| `risc0` | Risc0 STARK | STARK (FRI + Poseidon2) | ⭐⭐⭐ Cao — native STARK, nhiều edge cases |
| `ultraplonk` | UltraPlonk (Noir/Barretenberg) | SNARK | ⭐⭐ Trung bình |
| `ultrahonk` | UltraHonk (Noir/Barretenberg) | SNARK | ⭐⭐ Trung bình |
| `plonky2` | Plonky2 | SNARK (FRI-based hybrid) | ⭐⭐ Trung bình |
| `sp1` | SP1 zkVM | STARK → SNARK | ⭐⭐ Trung bình |
| `ezkl` | EZKL | SNARK (BN254, BDFG21) | ⭐ Thấp hơn — limited scope |
| `tee` | Intel TDX | Hardware attestation | ⭐ Thấp — non-ZK, khác biệt |

---

## 1 — Groth16 Verifier

> [!note] Specification 6.1 — Groth16 Pallet
>
> **Curves hỗ trợ**: BLS12-381, BN128, BN254  
> **Giới hạn**: Tối đa 64 public inputs  
> **Library**: `ark-groth16` (arkworks Rust)
>
> **verify_proof()**: Deserialize proof và public inputs → verify bằng ark-groth16.
>
> **VK encoding**: Theo arkworks format. SnarkJS users cần dùng `snarkjs2zkv` CLI để convert.
>
> **hash_context_data()**: `b"groth16"` (cộng với curve discriminant)
>
> **Curves và discriminant**:
> - BLS12-381: `b"groth16-bls12_381"`
> - BN128: `b"groth16-bn128"`
> - BN254: `b"groth16-bn254"`
>
> **vk_hash()**: Default `keccak256(SCALE(vk))` — VK là full proving key material (không phải hash sẵn)

> [!warning] Security Note 6.2 — Groth16 Bug Hunting Angles
>
> **1. Subgroup check**: Groth16 proof gồm 3 elliptic curve points ($A, B, C$). Nếu `verify_proof()` không kiểm tra các point có thuộc đúng subgroup của curve → kẻ tấn công có thể craft proof với points nằm ngoài subgroup, bypass verification.
> Câu hỏi kiểm tra: `ark-groth16` có thực hiện subgroup check không? Phiên bản nào của ark-groth16 được dùng?
>
> **2. Curve mismatch**: Groth16 pallet hỗ trợ 3 curves. Nếu proof được generate cho BN128 nhưng submitted với `curve=BN254` context → behavior không xác định. Liệu `hash_context_data()` có đủ domain separate 3 curves không?
>
> **3. Public input count boundary**: Giới hạn 64 public inputs. Off-by-one trong check → có thể submit 65 inputs, gây buffer issue.
>
> **4. SnarkJS vs arkworks encoding difference**: Nếu `snarkjs2zkv` convert không chính xác, proof/VK format sai → verification luôn fail (availability bug) hoặc pass sai (soundness bug).

---

## 2 — Risc0 Verifier

> [!note] Specification 6.3 — Risc0 Pallet
>
> **Phiên bản hỗ trợ**: v2.1, v2.2, v2.3  
> **Kiểu proof**: **STARK** (FRI + Poseidon2 hash) — không cần wrap thành Groth16!  
> **Giới hạn public inputs**: 2052 bytes total (2048 bytes user input); format: **cbor**  
> **VK**: = image_id (hash 32 bytes của zkVM binary)
>
> **verify_proof()**: STARK verifier — check FRI commitments, Poseidon2 hash chains.
>
> **vk_hash()**: **Override** — forward `image_id` trực tiếp (đã là 32-byte hash, không hash lại).
>
> **verifier_version_hash()**: **Override** — đọc version từ proof bytes:
> - v2.1 → version_hash_A
> - v2.2 → version_hash_B
> - v2.3 → version_hash_C
>
> **pubs_bytes()**: cbor-encode public inputs; sau đó keccak256 trong statement digest.

> [!warning] Security Note 6.4 — Risc0 Bug Hunting Angles
>
> **1. STARK soundness**: FRI protocol có nhiều parameter quan trọng (blowup factor, number of queries, grinding). Nếu các parameter không đủ secure → soundness error có thể chấp nhận được.
> Kiểm tra: FRI params trong Risc0 verifier Rust code có khớp với Risc0 security specs không?
>
> **2. cbor deserialization**: cbor là format phức tạp với nhiều edge cases. `cbor::from_slice()` trên untrusted data có thể panic (DoS) nếu không dùng safe parsing.
> Kiểm tra: cbor parser có handle malformed input gracefully không, hay panic?
>
> **3. version_hash extraction**: Đọc version từ proof bytes — nếu có thể craft proof với version field trỏ đến version chưa deploy, behavior không xác định.
>
> **4. image_id reuse**: VK = image_id = hash của program. Nếu hai program khác nhau có cùng image_id (collision trong hash function), proof từ program A có thể "verify" dưới image_id của program B. Tuy nhiên với 32-byte hash thì collision resistance rất cao.

---

## 3 — UltraPlonk Verifier (Noir)

> [!note] Specification 6.5 — UltraPlonk Pallet
>
> **Version hỗ trợ**: Noir >= v0.31.0, bbup <= v0.76.4  
> **Giới hạn**: 32 public inputs  
> **Backend**: Barretenberg (bb) — Aztec Protocol  
>
> **verify_proof()**: UltraPlonk verification — polynomial commitment scheme, lookup arguments.
>
> **pubs_bytes()**: public inputs được encode theo Barretenberg format (little-endian field elements).

> [!warning] Security Note 6.6 — UltraPlonk Bug Hunting Angles
>
> **1. Version pinning**: `bbup <= v0.76.4` — bất kỳ bug nào trong bb sau v0.76.4 không ảnh hưởng, nhưng bugs trong v0.76.4 trở về trước vẫn relevant.
>
> **2. numberOfPublicInputs boundary**: Giới hạn 32. Tương tự Groth16, kiểm tra off-by-one.
>
> **3. Proof format validation**: Proof bytes có được validate đủ trước khi pass vào bb verifier không? Hay raw bytes được pass thẳng → potential panic trong verifier C++ code.

---

## 4 — UltraHonk Verifier (Noir)

> [!note] Specification 6.7 — UltraHonk Pallet
>
> **Version hỗ trợ**: Noir v1.0.0-beta.6; `0.84.0 <= bb < 0.86.*` và `bb.js` tương ứng  
> **Giới hạn**: 32 public inputs  
> **Hash function**: **Keccak256 only** (không hỗ trợ Poseidon variant)  
> **Variants**: Hỗ trợ cả ZK và non-ZK variant  
>
> **Lưu ý quan trọng**: Từ zkVerifyJS v1.3.0+, `variant` option là bắt buộc để phân biệt ZK vs non-ZK.

> [!warning] Security Note 6.8 — UltraHonk Bug Hunting Angles
>
> **1. ZK vs non-ZK variant confusion**: Nếu proof được generate với ZK variant nhưng submit không khai báo variant (hoặc khai báo sai), verification sẽ fail. Nhưng quan trọng hơn: liệu non-ZK variant có leak witness data không? (Non-ZK variant chỉ check correctness, không ẩn witness.)
>
> **2. Keccak256-only restriction**: UltraHonk chỉ accept Keccak256 hash. Nếu user submit proof dùng Poseidon hash (compile với Poseidon backend), behavior không xác định — liệu pallet có detect và reject không?
>
> **3. bb version range**: `>= 0.84.0` và `< 0.86.*` — proof từ bb 0.86.0 sẽ bị reject. Có thể exploit: tìm proof từ bb 0.85.x có bug mà pass được verifier.

---

## 5 — Plonky2 Verifier

> [!note] Specification 6.9 — Plonky2 Pallet
>
> **Hash functions**: Keccak256 hoặc Poseidon  
> **Giới hạn**: 64 public inputs; proof size <= 256 KiB; VK size <= 50 KB  
> **Đặc điểm**: FRI-based hybrid SNARK (SNARK verifier + FRI commitment)
>
> **pubs_bytes()**: field elements theo Plonky2 format.
>
> **hashFunction**: phải khai báo tường minh (Keccak256 hoặc Poseidon) — ảnh hưởng đến cả proof và VK.

> [!warning] Security Note 6.10 — Plonky2 Bug Hunting Angles
>
> **1. Proof size bound**: 256 KiB là giới hạn lớn. Nếu pallet không kiểm tra size trước khi deserialize, attacker có thể submit proof lớn hơn → OOM / block time DoS.
>
> **2. Hash function mismatch**: Proof generate với Keccak256 nhưng submit với Poseidon context → verification fail (expected). Nhưng nếu `hash_context_data()` không include hash function identifier → cả hai context có cùng `verifier_ctx` → namespace collision.
> Kiểm tra: `hash_context_data()` của Plonky2 có distinguish Keccak vs Poseidon không?
>
> **3. VK size**: 50 KB là lớn. Attacker có thể register nhiều large VK → storage drain attack (nếu deposit không đủ).

---

## 6 — SP1 Verifier

> [!note] Specification 6.11 — SP1 Pallet
>
> **Version**: SP1 v5.x  
> **Giới hạn public inputs**: 2048 bytes  
> **VK**: BabyBear field hash — `hash_bytes()` method từ sp1-sdk, little-endian.  
> **pubs**: raw bytes từ `SP1ProofWithPublicValues`.
>
> **vk_hash()**: VK là hash BabyBear → có thể override để forward trực tiếp (tương tự Risc0).
>
> **sp1_zkv_sdk**: Crate wrapper để convert SP1 proof format cho zkVerify.

> [!warning] Security Note 6.12 — SP1 Bug Hunting Angles
>
> **1. BabyBear hash format**: Little-endian bytes của BabyBear hash. Nếu endianness handling sai (big-endian khi cần little-endian) → VK mismatch → soundness hoặc availability bug.
>
> **2. sp1_zkv_sdk wrapper**: Crate này nằm ở https://github.com/zkVerify/sp1-verifier. Nếu conversion logic sai (truncation, padding) → proof valid về mặt ZK nhưng fail verification trên zkVerify.
>
> **3. v5.x pinning**: SP1 v5 là breaking change từ v4. Proof từ SP1 v4 sẽ bị reject. Kiểm tra: version detection trong pallet có robust không?

---

## 7 — EZKL Verifier

> [!note] Specification 6.13 — EZKL Pallet
>
> **Version**: Reusable Verifier only (v0.1.0)  
> **Curve**: BN254  
> **Batch opening scheme**: BDFG21  
> **Accumulator**: Không hỗ trợ  
> **Giới hạn**: 32 public inputs  
>
> **Đặc điểm**: EZKL là framework để prove ML model inference bằng ZK. "Reusable Verifier" = một VK có thể verify nhiều proof với cùng circuit.

> [!warning] Security Note 6.14 — EZKL Bug Hunting Angles
>
> **1. Reusable verifier restriction**: Chỉ hỗ trợ "Reusable Verifier" mode. Nếu user submit proof từ non-reusable mode → behavior không xác định.
>
> **2. BDFG21 batch opening**: Ít phổ biến hơn KZG10 standard. Kiểm tra implementation có đúng BDFG21 spec không.
>
> **3. "Unaudited" status**: Theo community research, EZKL verifier chưa được audit kỹ (không nằm trong scope chính của cả Trail of Bits lẫn SRLabs). Đây là attack surface tiềm năng nhất.

---

## 8 — TEE Verifier (Intel TDX)

> [!note] Specification 6.15 — TEE Pallet
>
> **TEE type**: Intel TDX (Trust Domain Extensions)  
> **Giới hạn**: Proof size <= 8192 bytes; VK size <= 8192 bytes per field; Public inputs: none  
> **Đặc điểm**: Không phải ZK proof — là hardware attestation report từ Intel TDX. Verifier check chữ ký từ Intel CA chain.
>
> **CRL pallet**: Certificate Revocation List — permissionless update bởi bất kỳ ai cung cấp CRL hợp lệ từ registered CA. Đây là pallet đi kèm với TEE verifier.

> [!warning] Security Note 6.16 — TEE Bug Hunting Angles
>
> **1. CRL update permissionless**: Bất kỳ ai có thể update CRL với một CRL hợp lệ. Kiểm tra: validation logic có đủ robust không? (Community audit đã review và thấy validation đủ tốt).
>
> **2. CA chain verification**: Intel TDX attestation verify qua X.509 certificate chain đến Intel root CA. Nếu chain verification sai → forged attestation được accept.
>
> **3. No public inputs**: TEE proof không có public inputs. `pubs_bytes()` trả về empty → `keccak256([])` = `keccak256(b"")`. Kiểm tra: đây có gây issue gì trong statement digest không?
>
> **4. Proof size 8192 bytes**: Intel TDX attestation reports có thể lớn. Kiểm tra: pallet có validate size bound trước khi parse không?

---

## Supported Proofs — Bảng Tổng Hợp

| Proof Type | Curves / Backend | Giới hạn Public Inputs | Giới hạn Proof Size |
|-----------|-----------------|----------------------|---------------------|
| EZKL | BN254 (BDFG21) | 32 | — |
| Fflonk | BN128 | 1 | — |
| Groth16 | BLS12-381, BN128, BN254 | 64 | — |
| UltraHonk | Keccak256 only | 32 | — |
| UltraPlonk | Barretenberg | 32 | — |
| Risc0 | FRI + Poseidon2 | 2052 bytes total | — |
| Plonky2 | Keccak256 / Poseidon | 64 | 256 KiB |
| SP1 | BabyBear | 2048 bytes | — |
| TEE | Intel TDX | 0 (none) | 8192 bytes |

> [!tip] 💡 Agent note — Bug Hunting Prioritization
> Dựa trên background Groth16 + PLONK của người đọc và tình trạng audit:
>
> **Tier 1 (Ưu tiên cao nhất)**:
> - **EZKL verifier**: "unaudited" theo community research — attack surface lớn nhất
> - **Groth16 verifier**: biết rõ toán học → có thể detect subgroup check missing, encoding bugs
>
> **Tier 2**:
> - **Risc0**: STARK verifier với cbor parsing — DoS và FRI params
> - **Plonky2**: proof size bounds, hash function namespace collision
>
> **Tier 3**:
> - UltraPlonk/UltraHonk: ít biết Barretenberg internals hơn
> - SP1: BabyBear endianness issues
> - TEE: CRL permissionless update (community đã check, khó tìm mới)

---

## Summary

- 8 concrete verifiers: Groth16, Risc0, UltraPlonk, UltraHonk, Plonky2, SP1, EZKL, TEE.
- Mỗi verifier tùy chỉnh `verify_proof()`, `hash_context_data()`, `pubs_bytes()`, và optionally `vk_hash()`, `verifier_version_hash()`, `validate_vk()`.
- Bug hunting priorities: EZKL (unaudited) > Groth16 (known math, subgroup checks) > Risc0 (STARK + cbor) > Plonky2 (size bounds, hash namespace).
- Common patterns cần kiểm tra: subgroup check, size bounds, hash function namespace collision, version detection, cbor/format parsing DoS.

---

## References

- Verification Pallets: https://docs.zkverify.io/architecture/verification_pallets/abstract
- Supported Proofs table: https://docs.zkverify.io/architecture/supported_proofs
- Groth16 (arkworks): https://github.com/arkworks-rs/groth16
- Risc0: https://www.risczero.com
- Barretenberg: https://github.com/AztecProtocol/barretenberg
- EZKL: https://github.com/zkonduit/ezkl
- SP1 verifier SDK: https://github.com/zkVerify/sp1-verifier
