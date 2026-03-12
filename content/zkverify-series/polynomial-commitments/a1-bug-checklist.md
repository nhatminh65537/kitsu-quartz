---
title: "A1. Bug Checklist"
tags: [crypto, zk, polynomial-commitments, appendix, audit, bug-bounty]
aliases: [Bug Checklist]
created: 2026-03-12
---

> **Mục đích**: Checklist audit đầy đủ, phân loại theo severity. Dùng trực tiếp khi review code. Mỗi item có: mô tả ngắn, cách tìm, và severity nếu tìm thấy.

---

## Cách dùng

1. Mở target codebase.
2. Đi qua từng item — tick ✅ nếu OK, ❌ nếu missing/buggy, ❓ nếu cần review kỹ hơn.
3. Mọi ❌ Critical/High → viết PoC → report.

---

## NHÓM 1: Point & Curve Validation

| # | Check | Tìm ở đâu | Severity nếu missing |
|---|-------|-----------|---------------------|
| 1.1 | Proof elements check on-curve | `verify()`, `deserialize()` | Critical |
| 1.2 | Proof elements check in prime-order subgroup | Sau on-curve check | Critical |
| 1.3 | Commitment check in correct subgroup | Trước khi dùng commitment | High |
| 1.4 | G2 elements check subgroup (không chỉ G1) | BLS12-381: cả G1 lẫn G2 | High |
| 1.5 | Điểm infinity không được accept làm proof | Serialize/deserialize | Medium |

**Cách kiểm tra nhanh** (Rust):
```bash
grep -r "is_in_correct_subgroup\|subgroup_check\|is_on_curve" --include="*.rs" .
# Nếu không tìm thấy gần verify() → khả năng cao missing
```

---

## NHÓM 2: Pairing Checks

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 2.1 | Pairing result được check (`.is_one()`) | Sau `final_exponentiation()` | Critical |
| 2.2 | Số lượng pairing pairs đúng theo spec | Multi-miller-loop input | High |
| 2.3 | Pairing precompile return value checked (Solidity) | `staticcall` sau call | Critical |
| 2.4 | Pairing input không zero | Check trước multi_miller_loop | Medium |
| 2.5 | Final exponentiation không bị skip | Xem flow sau miller loop | Critical |

**Cách kiểm tra nhanh** (Solidity):
```bash
grep -A5 "staticcall.*0x08\|ecPairing\|pairingCheck" contracts/**/*.sol
# Tìm pattern: staticcall không có require(success)
```

---

## NHÓM 3: Fiat-Shamir Transcript

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 3.1 | Tất cả commitments được absorb vào transcript | Challenge generation | Critical |
| 3.2 | Tất cả public inputs được hash vào | Trước challenges | High |
| 3.3 | Evaluation points ($z$) có trong transcript | Trước challenge của step | High |
| 3.4 | Domain separator / protocol tag | Đầu transcript | Medium |
| 3.5 | Transcript không bị reset giữa chừng | Flow control | High |
| 3.6 | Challenges không reuse giữa các proofs | Session management | Medium |

**Pattern nguy hiểm**:
```rust
// BUG: commitment không được hash
let challenge = transcript.challenge_scalar();
// Sau đó mới absorb commitment:
transcript.append(commitment);  // Quá muộn!

// ĐÚNG:
transcript.append(commitment);  // Trước
let challenge = transcript.challenge_scalar();  // Sau
```

---

## NHÓM 4: Input Validation

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 4.1 | Proof length/format validated | Đầu `verify()` | High |
| 4.2 | Public input count matches circuit | Trước xử lý | High |
| 4.3 | Public inputs trong valid range (< field modulus) | Deserialize | Medium |
| 4.4 | Evaluation point $z \neq \tau$ (KZG) | Prove/verify | High |
| 4.5 | Degree bound check: deg(f) ≤ d_SRS | KZG commit | Medium |

---

## NHÓM 5: Field Arithmetic

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 5.1 | Polynomial coefficients trong scalar field $\mathbb{F}_r$ (không phải $\mathbb{F}_p$) | Arithmetic operations | High |
| 5.2 | Không có overflow khi tính $(a + b) \bmod p$ | Cộng modular | Medium |
| 5.3 | Division bằng zero không xảy ra (inverse phải check) | `pow(x, p-2, p)` khi x=0 | High |
| 5.4 | FFT dùng đúng domain (multiplicative subgroup, không phải additive) | FFT setup | Medium |
| 5.5 | Root of unity đúng bậc cho domain size | Domain construction | Medium |

---

## NHÓM 6: Soundness — Circuit Level

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 6.1 | Không có under-constrained signals (`<--` không có constraint) | Circuit code (Circom) | Critical |
| 6.2 | Mọi intermediate variable có constraint | Full circuit review | High |
| 6.3 | Polynomial degree check sau arithmetic ops | Đa thức output của gates | Medium |
| 6.4 | Blinding factors có trong prover polynomials (PLONK) | Prover code | Medium (ZK break) |
| 6.5 | Copy constraints (permutation) đúng | Permutation argument | High |

---

## NHÓM 7: FRI-specific

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 7.1 | Số queries đủ cho $\lambda$ bits security | Parameter config | High |
| 7.2 | Rate $\rho$ và security tính đúng: $t \geq \lambda / \log_2(1/(1-\delta))$ | FRI params | High |
| 7.3 | Extra evaluation points (hoặc random shift) để prevent uniqueness attack | Domain setup | High |
| 7.4 | Commit và query phase dùng cùng Merkle root | Protocol flow | Critical |
| 7.5 | Final polynomial có degree ≤ $d_0$ được check | FRI termination | High |

---

## NHÓM 8: Trusted Setup (KZG)

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 8.1 | SRS consistency check: $e([\tau^{i+1}]_1, G_2) = e([\tau^i]_1, [\tau]_2)$ | SRS load | Critical |
| 8.2 | SRS source documented và từ ceremony đáng tin | README/docs | High |
| 8.3 | Không hardcode $\tau$ trong code | Source code | Critical |
| 8.4 | SRS version/identifier match với circuit | Deployment | Medium |

---

## NHÓM 9: Protocol Composition

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 9.1 | Linearization đúng — verifier dùng openings, không phải commitments trực tiếp | PLONK verifier | High |
| 9.2 | Batch opening consistent — challenge $v, u$ được apply đúng | Batch verification | High |
| 9.3 | Recursive proof verify đúng depth | Recursive SNARKs | Critical |
| 9.4 | Không reuse commitment từ khác instance | Cross-proof separation | High |
| 9.5 | Opening point $z$ được include trong final pairing | Multi-point opening | High |

---

## NHÓM 10: zkVerify-specific

| # | Check | Tìm ở đâu | Severity |
|---|-------|-----------|---------|
| 10.1 | Pallet verifier theo đúng spec của scheme | Pallet vs paper/spec | Critical |
| 10.2 | Event emission chỉ sau successful verify | `emit ProofAccepted` | High |
| 10.3 | Weight/gas đủ cho pairing operations | Weight benchmarks | Medium (DoS) |
| 10.4 | ParaVerifier pallet có access control | Governance checks | High |
| 10.5 | XCM message ordering và replay protection | XCM handler | Medium |
| 10.6 | EZKL input format validated đầy đủ | EZKL adapter | High |

---

## Template Báo cáo Nhanh

```markdown
## Bug: [Tên Bug]

**Severity**: Critical / High / Medium / Low

**Location**: `crate/pallet/src/lib.rs:L123`

**Description**: 
[Mô tả ngắn gọn lỗi là gì]

**Root Cause**:
[Tại sao xảy ra]

**Impact**:
[Hậu quả nếu exploit — proof forging? DoS?]

**Proof of Concept**:
```rust
// Code PoC tối giản demonstrate lỗi
```

**Recommended Fix**:
[Cách sửa cụ thể]
```

---

## References cho mỗi Bug Class

| Bug Class | Nguồn tham khảo |
|-----------|----------------|
| Subgroup attacks | ZKDocs — zkdocs.com |
| Frozen Heart | Trail of Bits Blog (2022) |
| Under-constrained circuits | 0xPARC zk-bug-tracker |
| Plonk bugs | Consensys Diligence audits |
| FRI uniqueness attack | Medium — On FRI-based commitments |
| Real-world ZK bugs | github.com/zksecurity/zkbugs |
