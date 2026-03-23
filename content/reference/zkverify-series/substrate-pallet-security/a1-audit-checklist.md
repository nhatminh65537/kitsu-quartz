---
title: "A1. Pallet Audit Checklist"
tags: [security, substrate, audit, checklist, reference, appendix]
aliases: [Pallet Audit Checklist]
created: 2026-03-16
---

> **Checklist thực chiến** — Dùng khi mở một pallet mới để review. Đánh dấu từng item, note findings. Liên kết tới từng lesson cho context đầy đủ.

---

## Phase 0 — Chuẩn bị (5 phút)

```
[ ] Đọc pallet README hoặc module-level doc comment
[ ] Liệt kê tất cả extrinsics (#[pallet::call])
[ ] Liệt kê tất cả storage items (#[pallet::storage])
[ ] Liệt kê tất cả events và errors
[ ] Kiểm tra pallet có trong construct_runtime! không và index của nó
[ ] Có audit report cũ không? Đọc findings trước
```

---

## Phase 1 — Scan nhanh (15 phút)

Chạy các lệnh sau và note mọi hit để review sau:

```bash
# Tìm tất cả extrinsic functions
rg '#\[pallet::weight' pallets/TARGET/ --type rust -B 2

# Panic sources
rg '\.unwrap()\|\.expect(\|panic!\|assert!\|todo!\|unimplemented!' \
    pallets/TARGET/src/ --type rust | grep -v '#\[cfg(test)\]'

# Bare arithmetic (cần verify là safe hay không)
rg ' [+\-\*] | [+\-\*]= ' pallets/TARGET/src/lib.rs --type rust | \
    grep -v 'checked_\|saturating_\|wrapping_'

# Unbounded Vec trong storage
rg '#\[pallet::storage\]' pallets/TARGET/ -A 5 --type rust | grep 'Vec<'

# without_storage_info (pallet-level unbounded)
rg 'without_storage_info\|dev_mode' pallets/TARGET/ --type rust

# StorageMap iteration (potential unbounded)
rg '::iter()\|\.iter()\.count()' pallets/TARGET/src/lib.rs --type rust | \
    grep -v '#\[cfg(test)\]'

# ensure_none (unsigned extrinsics)
rg 'ensure_none' pallets/TARGET/ --type rust

# ValidateUnsigned
rg 'ValidateUnsigned\|validate_unsigned' pallets/TARGET/ --type rust

# Cross-pallet access
rg 'pallet_[a-z_]+::\w+::<T>::' pallets/TARGET/ --type rust | grep -v 'Pallet::'

# Root origin dispatch
rg 'RawOrigin::Root\|dispatch_bypass_filter' pallets/TARGET/ --type rust
```

---

## Phase 2 — Review từng Extrinsic (30–60 phút)

Với mỗi `pub fn ...` trong `#[pallet::call]`:

### 2.1 Origin Check — [[03-origin-and-access-control|L03]]

```
[ ] Dòng đầu tiên có gọi ensure_signed/ensure_root/ensure_none/EnsureOrigin không?
[ ] Nếu ensure_signed: AccountId trả về có được dùng để validate ownership không?
[ ] Nếu privileged operation (pause, force, admin): có dùng ensure_root hoặc Custom Origin không?
[ ] Nếu dùng ensure_signed_or_root: xử lý None (Root case) có đúng không?
```

### 2.2 Weight Annotation — [[05-weights-and-fees|L05]]

```
[ ] Có #[pallet::weight(...)] không?
[ ] Weight có phụ thuộc vào input size không (nếu function có Vec/loop)?
[ ] WeightInfo có dùng () placeholder không (WeightInfo for ())?
[ ] Input Vec có được bounded (BoundedVec) không?
[ ] on_initialize/on_finalize có return Weight thực tế không (không phải Weight::zero())?
```

### 2.3 Arithmetic Safety — [[04-arithmetic-overflow|L04]]

```
[ ] Mọi +, -, * trên balance/supply/amount đều dùng checked_* không?
[ ] Type cast (as u64, as u32) có dùng try_into().map_err() không?
[ ] Có sử dụng FixedU128/Perbill cho percentage operations không?
[ ] Code trong on_initialize có arithmetic không? (đặc biệt cẩn thận)
```

### 2.4 Panic Sources — [[06-dont-panic|L06]]

```
[ ] Không có .unwrap() nào (ngoài test code)?
[ ] .expect() có "qed" comment? Invariant có thực sự đúng không?
[ ] Không có array[index] trực tiếp (dùng .get() thay)?
[ ] Không có assert!/assert_eq! ngoài test code?
[ ] Không có panic!/todo!/unimplemented!?
```

### 2.5 Verify First — [[07-verify-first|L07]]

Đọc extrinsic từ trên xuống:

```
[ ] Mọi ensure!() và validation xuất hiện TRƯỚC bất kỳ storage mutation nào?
[ ] Nếu có mutation giữa extrinsic: extrinsic có #[transactional] không?
[ ] Cross-pallet calls (Currency::transfer, etc.) xuất hiện CUỐI CÙNG không?
[ ] try_mutate được dùng khi cần atomic check-and-set?
```

---

## Phase 3 — Review Storage Items (15 phút)

Với mỗi `#[pallet::storage]`:

### 3.1 Boundedness — [[10-storage-design-bugs|L10]]

```
[ ] StorageMap value chứa Vec<T>? Nếu có → phải là BoundedVec
[ ] Có MaxValues parameter trên StorageMap không?
[ ] Nếu map có thể grow vô hạn: có cleanup logic không?
[ ] Cleanup có bounded (số lượng xử lý mỗi block) không?
```

### 3.2 Hasher Safety — [[10-storage-design-bugs|L10]]

```
[ ] User-controlled keys dùng Blake2_128Concat không (không phải Twox64Concat)?
[ ] Keys là block number / incrementing ID → Twox64Concat là ok
[ ] Keys là T::Hash → Identity là ok
```

### 3.3 Missing Cleanup — [[10-storage-design-bugs|L10]]

```
[ ] Khi entity bị xóa/expired, tất cả related storage được cleanup không?
[ ] Nếu có multi-entry cho cùng account: tất cả entries được xóa không?
[ ] Deposit/bond được refund khi cleanup không?
```

---

## Phase 4 — Unsigned Extrinsics (nếu có) (15 phút)

```
[ ] Pallet có implement ValidateUnsigned không?
[ ] validate_unsigned có match cụ thể từng call variant không?
[ ] Có provides tag trong ValidTransaction không (không empty)?
[ ] provides tag có unique theo (block + submitter) hay tương tự không?
[ ] Longevity có hợp lý không (không phải u64::MAX)?
[ ] pre_dispatch có check cùng điều kiện với validate_unsigned không?
[ ] TransactionSource có được handle (InBlock luôn accept)?
```

→ [[08-unsigned-tx-validation|L08]] cho detail

---

## Phase 5 — Runtime Hooks (nếu có) (10 phút)

```
[ ] on_initialize có return Weight thực tế không?
[ ] on_initialize có iteration không bounded không?
[ ] on_initialize có panic source không?
[ ] on_finalize có variable weight không? (nếu có → chuyển sang on_initialize)
[ ] on_runtime_upgrade có StorageVersion guard không?
[ ] on_runtime_upgrade có pre_upgrade/post_upgrade không?
[ ] Nếu storage type thay đổi: có migration code không?
```

→ [[06-dont-panic|L06]], [[05-weights-and-fees|L05]], [[12-runtime-upgrade-safety|L12]]

---

## Phase 6 — Inter-Pallet Dependencies (10 phút)

```
[ ] Pallet có tight coupling (Config kế thừa Config của pallet khác) không?
[ ] Nếu có: upstream pallet thay đổi có break pallet này không?
[ ] Cross-pallet dispatch: origin có bị escalate không?
[ ] Pallet có assume state của pallet khác không thay đổi không?
[ ] Callback/hook có thể tạo circular call không?
```

→ [[11-inter-pallet-interactions|L11]]

---

## Phase 7 — Randomness (nếu dùng) (5 phút)

```
[ ] Randomness source là gì? (block_hash = NGUY HIỂM, collective_flip = chỉ test, BABE VRF = ok)
[ ] Stakes của randomness là gì? (lottery cao giá trị cần commit-reveal)
[ ] Randomness được dùng trong cùng block với user trigger không? (look-ahead risk)
```

→ [[09-bad-randomness|L09]]

---

## Phase 8 — XCM (nếu dùng) (15 phút)

```
[ ] XcmExecuteFilter: Everything hay Nothing?
[ ] OriginConverter: Có ParentAsSuperuser không? Có justify không?
[ ] Barrier: Yêu cầu BuyExecution không?
[ ] TrustedTeleporters/TrustedReserves: Có quá permissive không?
[ ] unimplemented!()/todo!() trong XCM handlers không?
```

→ [[13-xcm-security|L13]]

---

## Severity Classification (Immunefi)

| Finding | Severity |
|---------|----------|
| Chain halt (panic trong hooks) | Critical/High |
| Arbitrary token mint/burn | Critical |
| Origin escalation → Root | Critical |
| Double-spend / double-claim | Critical |
| DoS via panic trong extrinsic | High |
| Weight = 0 hoặc quá thấp (user-triggerable spam) | High |
| Unbounded storage (spam DoS) | Medium/High |
| Missing cleanup (storage bloat) | Medium |
| Bad randomness (lottery, gaming) | High |
| Stale data / invariant violation | Medium/High |
| Missing StorageVersion guard | Medium |

---

## Tổng hợp Finding Template

Khi tìm được bug, document theo format:

```
**Title**: [Tên ngắn mô tả bug]
**Severity**: Critical/High/Medium/Low
**Lesson**: L0X — [Tên lesson]

**Location**: pallets/NAME/src/lib.rs, line XXX

**Vulnerability**: [Mô tả kỹ thuật — loại lỗi là gì]

**Attack Scenario**:
1. Attacker calls `extrinsic_name` với input Y
2. Storage state thay đổi thành X
3. Attacker gọi lại `other_extrinsic`...
4. Result: [impact]

**Impact**: [Tổn thất tài chính? Chain halt? Token drain?]

**PoC** (pseudocode):
```rust
// Test case demonstrating the vulnerability
```

**Mitigation**: [Fix code ngắn]
```

---

## References

- Trail of Bits "Not So Smart Pallets" — secure-contracts.com/not-so-smart-contracts/substrate
- Substrate Vulnerability Scanner (Trail of Bits) — agentskills.so/skills/trailofbits
- pallet-verifier (Web3 Foundation) — github.com/davidsemakula/pallet-verifier
- MixBytes Substrate Audit Guide — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
- Immunefi bug bounty — immunefi.com/bug-bounty/zkverify
