# 🔍 Audit Intelligence Report — zkVerify Bug Bounty

> Tổng hợp từ: Trail of Bits (02/2025), SRLabs (09/2025), community research (03/2026), runtime changelog
> Mục đích: Xác định attack surface chưa được audit và các bypass tiềm năng

---

## 1. Tình Trạng Audit

| Audit | Thời điểm | Phạm vi | Số findings |
|-------|----------|---------|------------|
| Trail of Bits | 02/2025 (pre-mainnet) | Comprehensive — toàn bộ codebase tại thời điểm đó | 3 findings |
| SRLabs | 09/2025 (mainnet launch) | Runtime upgrades, focused review | N/A (public PDF) |
| Community research (Aurora AI) | 03/2026 | aggregate, token-claim, crl, TEE pallets | 1 Low finding |

**Runtime upgrades SAU SRLabs audit (09/2025 → 03/2026):**

| Version | Ngày | Thay đổi quan trọng |
|---------|------|---------------------|
| 1.2.0 | 10/2025 | Mainnet launch, multi-chain attestations |
| 1.3.1 | 11/2025 | **EZKL verifier** (mới), allowlist controls, non-ZK UltraHonk |
| 1.1.0 | 12/2025 | **ParaVerifier parachain** (mới) |
| 1.4.x–1.5.x | 01–03/2026 | Parameter changes, XCM groundwork |

> ⚠️ **Kết luận**: Tất cả code được thêm sau 09/2025 **chưa được audit bởi bất kỳ firm nào**.

---

## 2. Confirmed Low Finding (Community, 03/2026)

**Bug**: Panic trong `is_authorized_to_add_proof()` khi domain có `OnlyOwner` rules nhưng owner là `User::Manager` (thay vì `User::Account`).

```rust
ProofSecurityRules::OnlyOwner => {
    self.owner
        .as_ref()
        .expect("The domain does not have an owner; qed")  // PANICS khi None
        == submitter
}
```

**Root cause**: `qed` comment không đúng — governance có thể register domain với `OnlyOwner` và owner = `User::Manager`, khiến `as_owner()` trả về `None`.

**Impact**: WASM trap; mọi `submit_proof` call đến domain đó fail vĩnh viễn. Severity: **Low** (cần governance misconfiguration).

**Trạng thái**: Chưa được submit lên Immunefi (community researcher đánh giá không đáng công sức với Low tier).

> 💡 **Nếu tìm được cách trigger mà không cần governance action** → có thể nâng lên Medium/High.

---

## 3. Unaudited Attack Surfaces — Ưu Tiên Cao

### 3A. EZKL Verifier Pallet (Runtime 1.3.1, tháng 11/2025) ⭐⭐⭐

**Tại sao đây là mục tiêu ưu tiên nhất:**

1. **Pallet mới, chưa audit**: Được thêm vào sau cả hai audit. Không có firm nào review.
2. **Upstream EZKL có lịch sử lỗ hổng nghiêm trọng**: Trail of Bits audit upstream EZKL (01/2025) phát hiện **8 high-severity issues**, tất cả được fix trong EZKL v21.0.0.
3. **Version dependency unknown**: Câu hỏi then chốt — zkVerify EZKL pallet dùng version nào của `ezkl-verifier` library?

**Các lỗ hổng đã được fix trong upstream EZKL (nhưng có thể vẫn present nếu zkVerify dùng cũ version):**
- **Shuffle argument missing multiplicity constraint**: Prover có thể claim `[5,5,5,5,5]` là valid shuffle của `[1,2,3,4,5]` — soundness bug nghiêm trọng.
- **Data Attestation (DA) contract bypass**: Malicious prover có thể bypass on-chain data attestation checks.
- **Missing constraints trong core circuit**: Nhiều under-constrained polynomial relations.

**Action plan:**
```bash
# 1. Xác định version EZKL dependency trong zkVerify
# Tìm trong zkVerify/Cargo.toml hoặc pallets/ezkl/Cargo.toml
grep -r "ezkl" Cargo.toml
grep -r "ezkl-verifier" Cargo.lock

# 2. So sánh với v21.0.0 changelog
# 3. Nếu < v21.0.0 → các lỗ hổng trên potentially applicable
```

**Nếu zkVerify EZKL pallet dùng version < v21.0.0 với shuffle bug:**
- Construct proof claim `[5,5,5,5,5]` là permutation của `[1,2,3,4,5]`
- Submit lên zkVerify EZKL pallet
- Nếu accept → **Critical soundness bug** → $50,000 reward

---

### 3B. ParaVerifier Pallet (Runtime 1.1.0, tháng 12/2025) ⭐⭐⭐

**Tại sao là mục tiêu ưu tiên:**
- Pallet mới nhất, chưa audit
- Parachain architecture có attack surface khác với standalone chain
- Liên quan đến XCM (Cross-Chain Messaging) — lớp phức tạp nhất của Polkadot

**ParaVerifier = dedicated parachain cho ZK proof verification:**
- Tách verification computation ra khỏi mainchain
- Mục tiêu: 10x throughput increase
- Para-blocks được finalize bởi zkVerify relay chain validators

**Attack angles cần test:**

| Vector | Mô tả | Severity tiềm năng |
|--------|-------|-------------------|
| Para-block validity bypass | Nếu para-block có invalid proof được accept bởi para-validators | Critical |
| XCM message manipulation | Craft XCM message để trigger unauthorized action trên mainchain | Critical |
| Collator centralization | Nếu collator set nhỏ → collator có thể censor proofs | High |
| Parachain → mainchain state inconsistency | Race condition giữa para-block finalization và mainchain state | High |

---

### 3C. XCM Integration (Q1 2026 roadmap) ⭐⭐

**XCM (Cross-Chain Messaging)** là lớp phức tạp nhất trong Polkadot ecosystem, với lịch sử lỗ hổng nghiêm trọng trong nhiều parachain khác.

**Common XCM bugs trong Polkadot ecosystem:**

| Bug pattern | Mô tả |
|------------|-------|
| Weight miscalculation | XCM instruction weight không đủ → execution bị truncate giữa chừng |
| Reentrancy via XCM | XCM callback trigger state change trong giữa execution |
| Asset teleport accounting | Mint assets trên destination mà không burn trên source |
| Barrier bypass | Filtered XCM instructions slip through |
| Origin impersonation | Craft message với origin khác với thực tế |

**Action**: Khi XCM integration được deploy, đây là first-mover advantage — review code ngay khi merge vào main.

---

### 3D. Non-ZK UltraHonk Variant (Runtime 1.3.x) ⭐⭐

Được thêm vào sau SRLabs audit. UltraHonk giờ support cả ZK và non-ZK variant.

**Bug angle**: Non-ZK variant **không ẩn witness data**. Nếu:
- User submit proof với non-ZK variant (để tiết kiệm proving time)
- Nhưng circuit có private inputs mà họ muốn giữ bí mật
- → Witness bị exposed on-chain

Đây không phải bug của zkVerify mà là misuse của non-ZK variant. Tuy nhiên, nếu zkVerify không clearly warn về điều này trong documentation → potential disclosure bug trong Web/App scope.

Quan trọng hơn: **Kiểm tra xem pallet có correctly domain-separate ZK vs non-ZK variant trong `hash_context_data()` không**. Nếu cả hai variant dùng cùng `verifier_ctx`:
```
verifier_ctx("ultrahonk-zk") == verifier_ctx("ultrahonk-non-zk")
```
→ proof từ ZK variant có thể được "verify" dưới non-ZK context → potential replay/confusion attack.

---

## 4. Lỗ Hổng Từ Các Audit Reports (Đã Fixed — Tìm Bypass)

Mặc dù không thể đọc PDF của Trail of Bits và SRLabs trực tiếp, từ pattern của audit và community research:

### Bypass Angles Tiềm Năng

**Pattern 1 — "Mitigated but not fully fixed" trong weight benchmarks:**

Community researcher xác nhận weight benchmarks là correct cho code hiện tại. Tuy nhiên sau mỗi runtime upgrade, benchmarks cần được re-run. Nếu một pallet mới (EZKL, ParaVerifier) chưa có correct benchmark:

```rust
// Nếu weight quá thấp so với thực tế:
#[pallet::weight(T::WeightInfo::submit_proof())]
pub fn submit_proof(...) { ... }  // Thực tế tốn nhiều hơn weight claim
```

→ Attacker có thể submit proof với weight đã declared thấp → nhét nhiều extrinsics vào một block hơn cho phép → block overweight → DoS.

**Pattern 2 — `expect("...qed")` pattern:**

Community researcher đã tìm 1 instance. Tìm thêm các instance khác trong code mới (EZKL pallet, ParaVerifier):

```bash
grep -r 'expect(".*qed")' pallets/ezkl/
grep -r 'expect(".*qed")' pallets/para-verifier/
grep -r '.unwrap()' pallets/ezkl/src/
```

Mỗi `.unwrap()` hoặc `.expect()` là potential panic point → WASM trap → node instability.

**Pattern 3 — Max encoded length bounds:**

```bash
grep -r 'max_encoded_len' pallets/ezkl/
# Nếu thiếu → unbounded storage growth → DoS
```

---

## 5. Concrete Hunting Plan — Thứ Tự Ưu Tiên

### Week 1: EZKL Verifier Pallet

```
Mục tiêu: Xác định EZKL library version và test soundness
```

1. Clone zkVerify repo
2. Đọc `pallets/ezkl/Cargo.toml` → xác định `ezkl-verifier` version
3. So sánh với EZKL v21.0.0 release notes
4. Nếu < v21.0.0:
   - Reproduce shuffle argument bug trong local test
   - Craft proof và submit qua zkVerify EZKL pallet trên local fork
   - Document PoC với witness data + proof + expected vs actual verification result

### Week 2: ParaVerifier Pallet

```
Mục tiêu: XCM message handling và para-block validity
```

1. Đọc `pallets/para-verifier/src/lib.rs` (hoặc tương đương)
2. Map ra tất cả extrinsics và XCM handlers
3. Kiểm tra:
   - Weight benchmarks có đủ không?
   - Origin checks có đúng không?
   - State rollback nếu XCM thất bại?
4. Test với local relay chain + parachain setup

### Week 3: UltraHonk Non-ZK Variant + qed Pattern Hunt

```
Mục tiêu: Domain separation và panic conditions
```

1. Check `hash_context_data()` của UltraHonk pallet — ZK vs non-ZK có khác nhau không?
2. grep toàn bộ code sau 09/2025 cho `.unwrap()`, `.expect()`
3. Với mỗi instance: trace code path xem có user-controllable input dẫn đến đó không?

### Week 4: Weight Benchmark Audit

```
Mục tiêu: Missing/incorrect benchmarks trong new pallets
```

1. Xem `pallets/ezkl/src/benchmarking.rs` có tồn tại không
2. Chạy benchmark locally: `cargo test --features runtime-benchmarks`
3. So sánh declared weight vs actual execution time với proof size lớn nhất (32 public inputs)

---

## 6. Tools Setup

```bash
# Clone repo
git clone https://github.com/zkVerify/zkVerify
cd zkVerify

# Build
cargo build --release

# Run local testnet
./target/release/zkverify-node --dev --tmp

# Run tests
cargo test -p pallet-ezkl
cargo test -p pallet-aggregate

# Check for panics với untrusted input
cargo fuzz run fuzz_ezkl_verify  # nếu fuzz target tồn tại
```

---

## 7. Submission Checklist (Immunefi)

Trước khi submit bất kỳ finding nào:
- [ ] KYC completed trên Immunefi
- [ ] Test chỉ trên **local fork** (không phải mainnet/testnet)
- [ ] PoC hoàn chỉnh (code chạy được, không chỉ lý thuyết)
- [ ] Severity assessment theo Immunefi criteria
- [ ] Không public disclosure trước khi approved

---

*Cập nhật: tháng 3/2026 — Tổng hợp từ public sources và community research*
