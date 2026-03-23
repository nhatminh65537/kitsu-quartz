---
title: "14. zkVerify Pallets — Case Study"
tags: [security, substrate, zkverify, case-study, bug-bounty, immunefi, lesson-14]
aliases: [zkVerify Case Study]
created: 2026-03-16
---

> **Prerequisites**: Tất cả L01–L13. Đây là lesson tổng hợp áp dụng toàn bộ framework vào target thực tế.
> **Objectives**:
> - Hiểu kiến trúc và mô hình bảo mật của zkVerify
> - Áp dụng từng vulnerability class đã học vào 4 pallet đã audit + attack surface mới
> - Biết cách tiếp cận bug bounty Immunefi một cách hiệu quả
> - Xác định được attack surface ưu tiên cho zkVerify

---

## zkVerify là gì?

zkVerify là Substrate-based blockchain (parachain) với mục đích chuyên biệt: **offload ZK proof verification** khỏi Ethereum và các chain khác. Thay vì mỗi dApp tự verify proof trên-chain với gas fee cao ($2–50/proof trên Ethereum), các protocol submit proof đến zkVerify và nhận attestation rẻ hơn nhiều.

### Luồng chính

```
User/Protocol gửi ZK proof
        ↓
zkVerify pallet_aggregate: nhận proof, validate
        ↓
pallet_settlement_*: verify proof bằng verifier phù hợp
(Groth16, Fflonk, Risc0, EZKL, Ultraplonk...)
        ↓
Merkle root được compute từ tập hợp proofs
        ↓
Attestation được bridge về Ethereum/các chain
```

### Audit history

| Auditor | Thời gian | Scope |
|---------|-----------|-------|
| Trail of Bits | Feb 2025 | Runtime + core pallets |
| SRLabs | Sep 2025 | Runtime + post-mainnet additions |

Mainnet launch: September 2025. Bug bounty Immunefi: up to **$50,000**.

---

## 4 Pallet đã được Audit

### 1. `pallet_aggregate` — Core Business Logic

Pallet trung tâm: nhận proof submissions, organize thành domains, produce Merkle attestation.

**Architecture:**

```
register_domain(domain_id, params)
    └── Domains::<T>::insert(domain_id, state)

submit_proof(domain_id, vk_hash, proof)
    └── verify proof với registered verifier
    └── add to pending aggregation queue
    └── nếu queue đầy → produce attestation

publish_attestation(domain_id)
    └── compute Merkle root từ verified proofs
    └── emit AttestationEvent
```

**Áp dụng framework audit:**

| Vuln Class | Đã được kiểm tra? | Notes từ review |
|-----------|-------------------|-----------------|
| Bad Origin (L03) | Có | `register_domain` cần signed; `force_*` cần Root/ForceOrigin |
| Arithmetic (L04) | Có | `checked_*` được dùng trong aggregation math |
| Weight (L05) | Có | Benchmarks có trong codebase |
| Panic (L06) | Có | Vài `.expect("qed")` — invariants được justify |
| Verify First (L07) | Có | Pattern CEI được follow |
| Storage Design (L10) | Phần nào | `MaxPendingPublishingVerifiers` được enforce |

**Attack surface còn lại trên aggregate:**
- Weight của `submit_proof` có phản ánh đúng complexity của từng loại proof không? (Groth16 vs EZKL có thể rất khác nhau)
- Queue cleanup khi domain bị deregistered: có missing cleanup không?
- Merkle root computation: overflow khi số proof lớn?

### 2. `pallet_token_claim` — Merkle-based Token Distribution

Cho phép users claim token dựa trên Merkle proof (EIP-191 signature — cả Ethereum và Substrate format).

**Architecture:**
```
claim(ethereum_addr, substrate_addr, amount, merkle_proof, signature)
    └── verify EIP-191 signature
    └── verify Merkle proof
    └── mint/transfer tokens
    └── mark as claimed (prevent replay)
```

**Audit notes từ thực tế review (Aurora AI, March 2026):**
- Dual-format Ethereum verification (raw prefix + `<Bytes>` wrapped prefix) là intentional — different wallets encode messages differently
- Mempool replay protection qua claim deduplication hoạt động đúng
- **No critical findings** — code quality tốt

**Attack surface cần check:**

```bash
# Verify claimed flag được set TRƯỚC khi transfer (Verify First - L07)
rg 'ClaimedTokens\|is_claimed\|claimed' pallets/token-claim/ --type rust -A 10

# Verify không có double-claim path
rg 'fn claim' pallets/token-claim/ --type rust -A 30
```

### 3. `pallet_crl` — Certificate Revocation List cho TEE

Quản lý danh sách chứng chỉ X.509 bị revoke cho TEE (Trusted Execution Environment) attestations.

**Key design**: `update_crl` là **permissionless** — ai cũng có thể update CRL bằng cách cung cấp CRL hợp lệ từ registered Certificate Authority.

**Security model:**
- CRL phải được ký bởi registered CA → attacker không thể fake CRL mà không có CA key
- Bất kỳ ai có CRL mới hơn đều có thể submit → không cần quyền admin
- CA keys được quản lý bởi governance

**Attack surface:**
- Replay: có thể submit CRL cũ (với số serial thấp hơn) để revoke ít chứng chỉ hơn không?
- CRL size: `update_crl` có bounded không? (xem L05, L10)
- CA key management: ai có thể add/remove CAs? (xem L03)

### 4. `pallet_settlement_*` — Proof Verifier Adapters

Mỗi ZK proof system có một settlement pallet riêng: `pallet_settlement_fflonk`, `pallet_settlement_risc0`, v.v.

**Architecture chung:**
```
verify_proof(vk, proof, pubs)
    └── decode vk và proof từ bytes
    └── call native ZK verifier
    └── emit ProofVerified event
```

**Security concerns:**
- Decode `vk` và `proof` từ bytes: nếu decode fail → panic? (xem L06)
- Native verifier (off-chain Rust code) vs on-chain weight: có phản ánh đúng compute cost?
- `#[pallet::constant]` giới hạn kích thước proof/vk: có được enforce không?

---

## Attack Surface Chưa Được Audit Đầy đủ

### 5. `pallet_paraverifier` (Thêm sau SRLabs audit)

Theo người đã thực tế review codebase gần đây: "The unaudited attack surfaces are in the newer runtime additions — XCM integration, ParaVerifier pallet, and the EZKL verifier adapter."

ParaVerifier cho phép validators thực hiện ZK verification trong parachain context. Chưa có audit chuyên sâu.

**Câu hỏi audit priority:**

```bash
# Tìm ParaVerifier pallet
find . -path "*/para_verifier*" -name "*.rs"

# Kiểm tra origin checks trong ParaVerifier
rg 'ensure_signed\|ensure_root\|ensure_none' pallets/para-verifier/ --type rust

# Kiểm tra storage design
rg '#\[pallet::storage\]' pallets/para-verifier/ --type rust -A 5

# Tìm panic sources
rg '\.unwrap()\|\.expect(' pallets/para-verifier/ --type rust
```

### 6. EZKL Verifier Adapter

EZKL là ZK proving system cho neural networks — phức tạp hơn Groth16. Adapter mới, chưa được audit chuyên sâu.

**Câu hỏi audit priority:**
- Proof size: EZKL proofs có thể lớn hơn nhiều → weight có tính đúng không?
- Decode: EZKL format có edge cases gây panic không?
- Verification time: EZKL verification có thể variable cost → weight underestimate → DoS?

### 7. XCM Integration

Như đã phân tích ở Lesson 13 — XCM configuration chưa được audit đầy đủ.

---

## Chiến lược Hunt Bug Bounty trên zkVerify

### Scope hiệu quả nhất (theo Immunefi rewards)

**Critical ($15,000–$50,000):**
- Bất kỳ thứ gì cho phép mint/burn tokens trái phép
- Chain halt via panic trong runtime hooks
- Origin escalation — user thường thực thi với Root privilege
- Double-spend hoặc double-claim trong token distribution

**High ($5,000–$10,000):**
- DoS via panic trong extrinsics (user-triggerable)
- Weight misconfiguration cho phép spam
- Storage exhaustion không bị chặn

### Quy trình tiếp cận hiệu quả

**Bước 1 — Check audit reports trước**

Download và đọc kỹ:
- Trail of Bits report: `github.com/trailofbits/publications/.../2025-02-zkverify...`
- SRLabs report: `github.com/srlabs/audit-reports/.../SRL-zkVerify...`

Các findings đã biết = out of scope. Tập trung vào code thêm SAU audit.

**Bước 2 — Xác định code delta**

```bash
# Clone zkVerify
git clone https://github.com/HorizenLabs/zkVerify

# Check commits sau SRLabs audit (Sep 2025)
git log --after="2025-09-03" --oneline

# Tìm pallets mới hoặc file thay đổi nhiều
git diff v1.3.0..HEAD --stat | head -30
```

**Bước 3 — Scan theo vulnerability checklist**

Áp dụng từng checklist từ L03–L13:

```bash
# L03 — Bad Origin: tìm privileged ops
rg 'pause\|emergency\|force_\|admin_' pallets/ --type rust -l

# L04 — Arithmetic: bare operators
rg ' \+ | \- | \* ' pallets/para-verifier/ pallets/ezkl/ --type rust

# L05 — Weight: constant weight với Vec input
rg '#\[pallet::weight\(\d' pallets/ --type rust

# L06 — Panic
rg '\.unwrap()\|\.expect(\|panic!' pallets/para-verifier/ --type rust

# L08 — Unsigned TX
rg 'ensure_none\|ValidateUnsigned' pallets/ --type rust

# L10 — Storage
rg 'without_storage_info\|Vec<' pallets/para-verifier/ --type rust
```

**Bước 4 — Focus theo business logic**

Với zkVerify cụ thể:
- **Claim replay**: `pallet_token_claim` — có thể claim nhiều lần không?
- **Proof substitution**: `pallet_aggregate` — có thể thay proof hash sau khi submit không?
- **Verifier bypass**: settlement pallets — có thể submit proof không valid mà vẫn nhận attestation?
- **Domain manipulation**: có thể register domain với ID của người khác? Deregister domain của người khác?

### Checklist PoC requirement cho Immunefi

Immunefi yêu cầu PoC cho tất cả severities. PoC tốt cần:

```
1. Môi trường: local fork của testnet (không test trên mainnet)
2. Steps to reproduce rõ ràng
3. Code/script cụ thể (Rust test case hoặc Python script)
4. Expected behavior vs actual behavior
5. Impact: tại sao đây là security issue, không phải just a bug
```

---

## Vulnerability Map — Lesson → zkVerify Target

| Lesson | Vulnerability Class | zkVerify Target |
|--------|--------------------|--------------------|
| L03 | Bad Origin | `force_*` extrinsics, ParaVerifier admin |
| L04 | Arithmetic Overflow | Aggregation math, fee calculations |
| L05 | Incorrect Weight | EZKL verifier (variable cost), unbounded loops |
| L06 | Panic / Chain Halt | `unwrap()` trong verifier adapters |
| L07 | Verify First | `submit_proof`, `claim` |
| L08 | Unsigned Tx | Off-chain worker submissions (nếu có) |
| L09 | Bad Randomness | Nonce generation trong domains |
| L10 | Storage Design | Queue size, claim map cleanup |
| L11 | Inter-Pallet | aggregate ↔ settlement interaction |
| L12 | Runtime Upgrade | Storage migration khi thêm verifiers mới |
| L13 | XCM Security | XcmConfig, origin converter |

---

## Summary — Key Takeaways

- **zkVerify** là ZK proof aggregation parachain, bug bounty $50k, launch Sep 2025.
- **4 pallet đã audit** (Trail of Bits + SRLabs): aggregate, token-claim, crl, tee-verifier — code quality tốt.
- **Attack surface ưu tiên**: ParaVerifier, EZKL adapter, XCM integration — thêm sau audits, ít coverage hơn.
- **Chiến lược hiệu quả**: đọc audit reports → xác định code delta sau audits → scan theo checklist → focus business logic.
- **PoC bắt buộc** cho mọi severity trên Immunefi, không test trên mainnet.

---

## References

- zkVerify Immunefi Bug Bounty — immunefi.com/bug-bounty/zkverify
- Trail of Bits zkVerify audit (Feb 2025) — github.com/trailofbits/publications/.../2025-02-zkverify
- SRLabs zkVerify audit (Sep 2025) — github.com/srlabs/audit-reports/.../SRL-zkVerify
- Aurora AI zkVerify audit write-up — dev.to/theauroraai/i-spent-2-sessions-auditing-zkverifys-substrate-code
- zkVerify GitHub — github.com/HorizenLabs/zkVerify
