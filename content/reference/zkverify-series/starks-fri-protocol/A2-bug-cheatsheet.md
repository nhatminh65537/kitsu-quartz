---
title: "A2. Bug Cheatsheet"
tags: [cryptography, starks, bugs, cheatsheet, audit, appendix]
aliases: [Bug Cheatsheet, ZK Bug Reference, Audit Cheatsheet]
created: 2026-03-13
---

> **Mục đích**: One-page reference cho tất cả bug classes — in ra và dùng khi audit zkVerify.  
> **Link bài liên quan**: [[08-attack-vectors-bug-classes|L08]] — chi tiết và demo code.

---

## TIER 1 — CRITICAL (Soundness Bugs)

### B-01: Under-Constrained AIR
- **Dấu hiệu**: Constraint không cover tất cả registers / states
- **Tìm trong code**: Đếm số constraints, verify mỗi column bị ràng buộc đủ
- **Test**: Tạo trace vi phạm 1 register nhưng không vi phạm constraint nào
- **Impact**: Prover tạo proof cho computation sai → funds stolen
- **Ref**: [[03-starks-air-arithmetization|L03]], [[08-attack-vectors-bug-classes|L08]]

### B-02: Over-Constrained AIR
- **Dấu hiệu**: Constraint scope sai (áp dụng ở bước cuối khi không nên)
- **Tìm trong code**: Kiểm tra zerofier scope, boundary constraint range
- **Test**: Chạy honest prover — completeness fail?
- **Impact**: DoS: valid transactions bị reject → chain halt
- **Ref**: [[03-starks-air-arithmetization|L03]]

### B-03: Degree Miscalculation
- **Dấu hiệu**: FRI proves wrong degree bound
- **Công thức đúng**: $\deg(Q^{(T)}) = \deg(C) - \deg(Z)$
- **Tìm trong code**: `grep -n "degree_bound\|max_degree\|composition_degree"`
- **Impact**: Soundness: polynomial bậc cao pass FRI
- **Ref**: [[08-attack-vectors-bug-classes|L08]]

### B-04: Missing Degree Correction
- **Dấu hiệu**: Composition poly $\sum \alpha_j Q_j$ thiếu $X^{d_{\max} - \deg Q_j}$ factor
- **Tìm trong code**: Tìm nơi composition polynomial được xây dựng
- **Impact**: Composition poly có bậc sai → FRI prove điều sai
- **Ref**: [[06-full-stark-pipeline|L06]]

### B-05: DEEP Point Inside Domain
- **Dấu hiệu**: Challenge $z$ từ transcript không được kiểm tra $z \notin D$
- **Tìm trong code**: `grep -n "deep_point\|z_point\|eval_point"` + kiểm tra domain membership
- **Impact**: DEEP quotient trivially low-degree → AIR constraint không được enforce
- **Ref**: [[05-fri-query-verification|L05]]

### B-06: Field Arithmetic Overflow
- **Dấu hiệu**: Goldilocks ($2^{64} - 2^{32} + 1$) multiplication dùng `u64` thuần
- **Tìm trong code**: `grep -rn "as u64\|wrapping_mul\| \* .*as u64"` trong Goldilocks/BabyBear code
- **Test**: Input $a = p - 1$, $b = p - 1$: kết quả phải là $1$, không phải $0$
- **Impact**: Sai field element → constraint check với wrong value
- **Ref**: [[07-zkverify-architecture|L07]], [[08-attack-vectors-bug-classes|L08]]

### B-07: Inverse of Zero Not Checked
- **Dấu hiệu**: `pow(x, p-2, p)` với `x=0` trả về `0` (Python), hoặc Rust code không check
- **Tìm trong code**: Tìm tất cả division operations: `inv(x)`, `x.inverse()`
- **Impact**: Constraint bypass khi denominator = 0
- **Ref**: [[08-attack-vectors-bug-classes|L08]]

---

## TIER 2 — HIGH (Fiat-Shamir & FRI Bugs)

### B-08: Weak Fiat-Shamir (Missing Instance)
- **Dấu hiệu**: Hash transcript không bao gồm public statement/instance
- **Tìm trong code**: Round 1 hash: có `public_inputs` không?
- **Test**: Dùng proof của statement A → submit cho statement B
- **Impact**: Proof reuse/replay across different statements
- **Ref**: [[02-zero-knowledge-proof-systems|L02]]

### B-09: Incomplete Transcript Hashing
- **Dấu hiệu**: Prover message $m_j$ không được hash trước khi tính challenge tiếp theo
- **Tìm trong code**: Kiểm tra thứ tự: commit → hash → challenge (không phải challenge → commit)
- **Impact**: Prover tùy chọn $m_j$ sau khi biết challenge → selective abort
- **Ref**: [[02-zero-knowledge-proof-systems|L02]], [[06-full-stark-pipeline|L06]]

### B-10: Grinding Attack (Soundness Error Too Large)
- **Dấu hiệu**: Soundness error per constraint $\epsilon \gg 2^{-128}$
- **Công thức check**: $\epsilon = k/p$ — với $p \approx 2^{31}$ và $k = 2^{20}$, $\epsilon = 2^{-11}$ (quá lớn!)
- **Impact**: Attacker thử $\sim 2^{1/\epsilon}$ lần để tìm "lucky" proof
- **Ref**: [[02-zero-knowledge-proof-systems|L02]]

### B-11: FRI Blowup Factor Insufficient
- **Dấu hiệu**: `domain_size < degree * blowup_factor` (blowup < 4)
- **Tìm trong code**: `grep -n "blowup\|domain_size\|lde_domain"`
- **Impact**: FRI proximity parameter $\delta$ giảm → cần nhiều queries hơn mà không được đảm bảo
- **Ref**: [[04-fri-commit-fold|L04]]

### B-12: FRI Stops Too Early
- **Dấu hiệu**: FRI terminates khi polynomial vẫn còn bậc cao (threshold sai)
- **Tìm trong code**: `grep -n "stop_threshold\|max_remainder\|num_layers"`
- **Impact**: Final polynomial không đủ nhỏ → verifier không thể verify đúng
- **Ref**: [[04-fri-commit-fold|L04]]

### B-13: FRI Insufficient Queries
- **Dấu hiệu**: `num_queries < λ / log₂(ρ⁻¹)`
- **Công thức**: Với $\rho = 1/4$: $q \geq 128$; với $\rho = 1/8$: $q \geq 86$
- **Tìm trong code**: `grep -n "num_queries\|query_count\|QUERIES"`
- **Impact**: Soundness error $> 2^{-\lambda}$
- **Ref**: [[05-fri-query-verification|L05]]

### B-14: Batching Coefficient Leaked Early
- **Dấu hiệu**: $\beta_i$ challenges trong batched FRI derived trước khi tất cả polynomials được committed
- **Tìm trong code**: Xem thứ tự hash trong transcript khi batch nhiều polynomials
- **Impact**: Prover chọn polynomials phụ thuộc vào challenges đã biết
- **Ref**: [[04-fri-commit-fold|L04]]

### B-15: Colinearity Check Skipped/Wrong
- **Dấu hiệu**: FRI verifier không check tất cả rounds
- **Tìm trong code**: Vòng lặp verify: có check round cuối không?
- **Impact**: Soundness bypass tại round bị skip
- **Ref**: [[05-fri-query-verification|L05]]

---

## TIER 3 — MEDIUM (Merkle & Protocol)

### B-16: Merkle Missing Domain Separation
- **Dấu hiệu**: Leaf hash $= H(\text{value})$ thay vì $H(\texttt{0x00} \|\text{value})$; internal $= H(l \| r)$ thay vì $H(\texttt{0x01} \| l \| r)$
- **Tìm trong code**: Tìm Merkle hash function implementation
- **Impact**: Second-preimage attack — fake Merkle proof cho giá trị không tồn tại
- **Ref**: [[08-attack-vectors-bug-classes|L08]]

### B-17: Replay Attack — Proof Accepted Twice
- **Dấu hiệu**: Không có nullifier/nonce trong proof receipt
- **Tìm trong code**: `grep -n "nullifier\|nonce\|proof_hash"` trong pallet
- **Impact**: Attacker claims same receipt twice → double-spend
- **Ref**: [[07-zkverify-architecture|L07]]

### B-18: VK Hash Collision Risk
- **Dấu hiệu**: VK registration hash không dùng collision-resistant function hoặc thiếu domain sep
- **Tìm trong code**: `grep -n "vk_hash\|register_vk"`
- **Impact**: Hai VK khác nhau map tới cùng hash → wrong verifier used
- **Ref**: [[07-zkverify-architecture|L07]]

### B-19: Trace Padding Bug
- **Dấu hiệu**: Padding rows không thỏa mãn transition constraints (giá trị non-zero)
- **Tìm trong code**: Cách trace được padded đến power-of-2 length
- **Impact**: Completeness fail cho computations với non-power-of-2 length
- **Ref**: [[06-full-stark-pipeline|L06]]

---

## TIER 4 — LOW/INFORMATIONAL (Implementation)

### B-20: `expect("qed")` Without Validation
- **Dấu hiệu**: `value.expect("invariant holds; qed")` mà invariant không được enforce externally
- **Tìm trong code**: `grep -rn "qed" pallets/`
- **Impact**: Panic on malformed input → DoS

### B-21: Missing Length Check on Deserialization
- **Dấu hiệu**: `decode(&mut &bytes[..])` không check `bytes.len()` trước
- **Tìm trong code**: `grep -n "decode\|deserialize"` trong extrinsic handlers
- **Impact**: OOM / panic với very large proof → DoS

### B-22: Integer Overflow in Rust
- **Dấu hiệu**: Arithmetic trên `usize`, `u32`, `u64` mà không dùng `checked_*` hay `saturating_*`
- **Tìm trong code**: `grep -rn "\.wrapping_\|usize::MAX\|u64::MAX"`
- **Impact**: Silently wraps → wrong index → OOB access

### B-23: Off-by-One in Step Iteration
- **Dấu hiệu**: `for i in 0..n` thay vì `0..n-1` trong transition constraint loop
- **Tìm trong code**: Constraint application loops
- **Impact**: Over/under-constrained AIR

### B-24: Weight Underestimate
- **Dấu hiệu**: Extrinsic weight < actual computation cost
- **Tìm trong code**: `#[pallet::weight(...)]` annotations
- **Impact**: Economic DoS — attacker spam cheap extrinsics blocking validator

---

## Quick Grep Commands

```bash
# Critical soundness
grep -rn "degree_bound\|max_degree"            verifiers/
grep -rn "as u64\|wrapping_mul"                verifiers/
grep -rn "z_point\|deep_point"                 verifiers/

# Fiat-Shamir
grep -rn "transcript\|challenge\|squeeze"      verifiers/
grep -rn "absorb\|observe\|hash"               verifiers/

# FRI parameters
grep -rn "num_queries\|query_count\|QUERIES"   verifiers/
grep -rn "blowup\|domain_size\|lde_domain"     verifiers/
grep -rn "stop_threshold\|max_remainder"       verifiers/

# Merkle
grep -rn "MerkleTree\|merkle_root\|leaf_hash"  verifiers/
grep -rn '\\x00\|\\x01\|0x00\|0x01'           verifiers/

# Deserialization / DoS
grep -rn "decode\|deserialize\|unwrap\|expect" pallets/
grep -rn "qed"                                 pallets/

# Field arithmetic
grep -rn "inverse\|inv(0)\|checked_mul"        verifiers/

# Replay protection
grep -rn "nullifier\|nonce\|proof_hash"        pallets/
```

---

## Impact Severity Matrix

| Bug | Soundness? | DoS? | Completeness? | Immunefi Tier |
|-----|-----------|------|---------------|---------------|
| B-01 Under-constrained | ✅ CRITICAL | ❌ | ❌ | Critical |
| B-05 DEEP inside domain | ✅ CRITICAL | ❌ | ❌ | Critical |
| B-06 Field overflow | ✅ | ❌ | ❌ | Critical |
| B-08 Weak FS | ✅ | ❌ | ❌ | High |
| B-02 Over-constrained | ❌ | ✅ | ✅ | High |
| B-11 Low blowup | ✅ | ❌ | ❌ | High |
| B-13 Low queries | ✅ | ❌ | ❌ | High |
| B-16 Merkle sep | ✅ | ❌ | ❌ | Medium |
| B-17 Replay | ❌ | ❌ | ❌ | Medium |
| B-20 `qed` panic | ❌ | ✅ | ❌ | Low |
| B-21 Deser panic | ❌ | ✅ | ❌ | Low |

---

## Decision Tree: Khi Tìm Thấy Anomaly

```
Tìm thấy anomaly trong zkVerify code?
│
├─ Affects proof ACCEPTANCE? (verifier accepts wrong proof)
│   └─ YES → SOUNDNESS BUG → Critical/High → Write PoC immediately
│
├─ Affects proof GENERATION? (honest prover fails)
│   └─ YES → COMPLETENESS BUG → High/Medium → Test with honest trace
│
├─ Can cause PANIC/crash?
│   └─ YES → DoS BUG → High/Medium → Fuzzing PoC
│
└─ Wrong state / logic error?
    └─ YES → Logic Bug → Medium/Low → Document impact clearly
```

---

## Links

- L03: [[03-starks-air-arithmetization]] — AIR, under/over-constrained
- L04: [[04-fri-commit-fold]] — FRI commit bugs
- L05: [[05-fri-query-verification]] — FRI query bugs
- L06: [[06-full-stark-pipeline]] — Pipeline bugs
- L07: [[07-zkverify-architecture]] — zkVerify-specific
- L08: [[08-attack-vectors-bug-classes]] — Full demo code
- L09: [[09-bug-bounty-mindset]] — Audit methodology
