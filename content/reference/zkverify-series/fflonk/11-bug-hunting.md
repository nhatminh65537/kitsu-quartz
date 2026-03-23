---
title: "11. Bug Hunting on FFLONK"
tags: [crypto, zk-snark, fflonk, lesson-11, bug-hunting, immunefi, exploit]
aliases: [FFLONK Bug Hunting]
created: 2026-03-13
---

> **Prerequisites**: [[06-fflonk-verifier|06. FFLONK Verifier]], [[08-fiat-shamir|08. Fiat-Shamir]], [[09-security-analysis|09. Security Analysis]], [[10-zkverify-implementation|10. zkVerify Implementation]]  
> **Objectives**:  
> - Có workflow hoàn chỉnh để tìm bug trong FFLONK implementation
> - Biết cách viết PoC cho từng bug class
> - Nắm quy trình submission Immunefi
> - Áp dụng kỹ thuật audit vào `fflonk_verifier` crate

---

## 1. Bug Hunting Mindset

Mục tiêu của verifier là: **accept valid proofs, reject invalid proofs**. Bug = verifier vi phạm một trong hai điều này.

**Hai hướng attack**:
1. **Soundness bug**: verifier accept proof sai → Critical/High (steal funds)
2. **Completeness bug**: verifier reject proof đúng → High/Medium (DoS, liveness)

---

## 2. Bug Class 1: Missing Subgroup Check

### 2.1 Lý thuyết

BN254 $\mathbb{G}_1$ có order $h \cdot r$ trong $E(\mathbb{F}_p)$ với $h$ là cofactor (nhỏ với BN254). Một điểm trên curve nhưng **ngoài** $r$-torsion subgroup có thể pass `is_on_curve()` nhưng fail `is_in_subgroup()`.

Nếu attacker dùng điểm $P$ từ small subgroup, pairing equation có thể thỏa mãn với sai commitment.

### 2.2 Cách kiểm tra

```python
# Pattern tìm trong Rust code

# BAD — chỉ check on-curve:
# assert!(proof.c1.is_on_curve());

# GOOD — check cả subgroup:
# assert!(proof.c1.is_on_curve());
# assert!(proof.c1.is_in_correct_subgroup_assuming_on_curve());

# Trong ark_bn254:
# G1Affine::is_in_correct_subgroup_assuming_on_curve() check r * P == O

# Script: grep trong source
import subprocess

# Pseudo-grep pattern
check_patterns = [
    "is_in_correct_subgroup",
    "is_in_subgroup", 
    "subgroup_check",
    "mul_by_cofactor",
]

print("=== Subgroup Check Audit ===")
print("Tìm trong code:")
for p in check_patterns:
    print(f"  grep -r '{p}' src/")
print()
print("RED FLAG nếu không thấy bất kỳ pattern nào trên")
print("Mỗi G1 point trong proof (C1, C2, W1, W2) phải được check")
```

### 2.3 PoC Concept

Để tạo PoC cho subgroup check missing (cần ark_bn254):

```python
# PoC concept (không chạy được không có ark_bn254, mô tả ý tưởng)
"""
1. Tìm điểm P thuộc curve BN254 nhưng không thuộc G1 subgroup
   - BN254 cofactor h = 1 → tất cả điểm on-curve đều ở G1
   - NHƯNG: G2 subgroup (trên twist) có cofactor khác
   - Nếu implementation nhầm G1/G2 check → bug

2. Với G1 cofactor h=1, attack cụ hơn là twist attack:
   - Dùng điểm từ twist của BN254 thay vì BN254
   - Twist có order khác → pairing equation sai
   
3. PoC: craft proof với C1' từ twist
   → nếu implementation accept → BUG
   → nếu reject với "not on curve" → OK
   → nếu reject với "wrong subgroup" → OK but needs both checks
"""

# Test: verify point validation
def validate_g1_point(x, y, p_field, r_order):
    """
    Kiểm tra đầy đủ một G1 point.
    Trong thực tế: dùng ark_bn254 types
    """
    # Check 1: coordinates in range
    if not (0 <= x < p_field and 0 <= y < p_field):
        return False, "coordinates out of range"
    
    # Check 2: on-curve y^2 = x^3 + 3 (BN254)
    if y*y % p_field != (x**3 + 3) % p_field:
        return False, "not on BN254 curve"
    
    # Check 3: in prime-order subgroup (r * P = O)
    # For BN254, cofactor h = 1, so all on-curve points are in G1
    # But still good practice to verify
    # In practice: ark_bn254::G1Affine::is_in_correct_subgroup_assuming_on_curve()
    
    return True, "valid G1 point"

# BN254 G1 generator
p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
G1_x = 1
G1_y = 2

ok, msg = validate_g1_point(G1_x, G1_y, p, r)
print(f"G1 generator: {ok} — {msg}")

# Point at infinity (0, 0) — should be rejected
ok2, msg2 = validate_g1_point(0, 0, p, r)
print(f"Point (0,0): {ok2} — {msg2}")
```

---

## 3. Bug Class 2: Transcript Completeness

### 3.1 Kiểm tra trong code

```python
# Audit transcript: tìm hash calls và đối chiếu với expected elements

transcript_audit = """
=== Transcript Audit Pattern ===

Tìm trong transcript.rs hoặc verifier.rs:

# Bước 1: VK và pub_input
transcript.update(vk_hash)        # MUST HAVE
transcript.update(pub_input)      # MUST HAVE

# Bước 2: C1 → beta, gamma  
transcript.update(c1.x.to_bytes())  # MUST: cả x
transcript.update(c1.y.to_bytes())  # MUST: cả y
beta  = transcript.squeeze()
gamma = transcript.squeeze()       # hoặc hash(beta)

# Bước 3: C2 → alpha
transcript.update(c2.x.to_bytes())  # MUST
transcript.update(c2.y.to_bytes())  # MUST
alpha = transcript.squeeze()

# Bước 4: alpha → zeta
zeta = transcript.squeeze()  # hoặc hash(alpha)

# Bước 5: TẤT CẢ evaluations → upsilon  ← CRITICAL
# Đây là điểm hay bị miss (LCA)
transcript.update(eval_ql)   
transcript.update(eval_qr)
transcript.update(eval_qm)
transcript.update(eval_qo)
transcript.update(eval_qc)
transcript.update(eval_s1)
transcript.update(eval_s2)
transcript.update(eval_s3)
transcript.update(eval_a)
transcript.update(eval_b)
transcript.update(eval_c)
transcript.update(eval_z_omega)
transcript.update(eval_t1w)
transcript.update(eval_t2w)
upsilon = transcript.squeeze()   # ← MUST include all above

RED FLAG: nếu upsilon = hash(zeta, subset_of_evals) mà thiếu bất kỳ eval nào
"""
print(transcript_audit)

# Đếm evaluations phải có
required_evals = [
    "eval_ql", "eval_qr", "eval_qm", "eval_qo", "eval_qc",  # 5 selector
    "eval_s1", "eval_s2", "eval_s3",                          # 3 permutation
    "eval_a", "eval_b", "eval_c",                             # 3 wire
    "eval_z_omega",                                            # 1 accumulator
    "eval_t1w", "eval_t2w",                                    # 2 quotient shifts
]
print(f"Total required evaluations before υ: {len(required_evals)}")
print("Elements:", required_evals)
```

---

## 4. Bug Class 3: Field Arithmetic Overflow

### 4.1 Tìm trong Rust

```python
# Grep patterns cho unsafe field arithmetic

overflow_patterns = {
    "DANGEROUS": [
        "wrapping_add",     # modular wrap không reduce mod r
        "wrapping_mul",     # overflow không detect  
        "as u64",           # unsafe cast từ u256
        "unchecked_add",
        "unchecked_mul",
    ],
    "SAFE": [
        ".add(&",           # ark_ff Field::add (auto-reduce)
        ".mul(&",           # ark_ff Field::mul (auto-reduce)
        "Fr::from(",        # proper Fr element creation
        "into_repr()",      # safe representation
    ],
    "INVESTIGATE": [
        "+ 1",              # addition without field context
        "* 2",              # multiplication without field context
        "% r",              # explicit modular reduction (check if r is correct)
    ]
}

print("=== Field Arithmetic Audit ===")
for severity, patterns in overflow_patterns.items():
    print(f"\n[{severity}]")
    for p in patterns:
        print(f"  grep -r '{p}' src/field.rs src/verifier.rs")
```

### 4.2 Ví dụ bug

```python
# Demo: field arithmetic overflow

r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

# WRONG: Python int không có overflow, nhưng trong Rust u64/u128 thì có
a = r - 1  # Fr::MAX
b = 2

# Không reduce → WRONG kết quả
wrong_result = a + b  # = r + 1 (overflow in u256 arithmetic)
print(f"Wrong: a + b = {wrong_result} (should be {(a+b) % r})")
print(f"Difference: {wrong_result - (a+b)%r}")

# Correct: field addition
correct_result = (a + b) % r
print(f"Correct: (a + b) % r = {correct_result}")

# Trong Rust với ark_ff:
# let a = Fr::from(r - 1);
# let b = Fr::from(2u64);
# let result = a + b;  // automatically reduces mod r → = Fr::from(1)
print("\n✓ ark_ff Field arithmetic auto-reduces → safe")
print("✗ Raw u64/u128 addition → potential overflow → UNSAFE")
```

---

## 5. Bug Class 4: Public Input Not Bound

### 5.1 Cơ chế attack

Nếu `public_input` không được hash vào transcript trước challenge $\beta$:

```python
import hashlib

r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

def vulnerable_transcript(vk, C1):
    """
    BUG: pub_input không được hash vào transcript
    → challenges β, γ, α, ζ, υ đều không phụ thuộc pub_input
    → attacker có thể thay đổi public_input claim
    """
    # Thiếu: transcript.update(pub_input)
    h = hashlib.sha256(f"{vk}|{C1}".encode()).hexdigest()
    beta = int(h, 16) % r
    return beta

def secure_transcript(vk, pub_input, C1):
    """CORRECT: pub_input phải ở đây"""
    h = hashlib.sha256(f"{vk}|{pub_input}|{C1}".encode()).hexdigest()
    beta = int(h, 16) % r
    return beta

vk = "vk_demo"; C1 = "C1_commit"
pub_real = "state_root_abc123"   # thực sự đã verify
pub_fake = "state_root_000000"   # claim sai để steal funds

beta_v1 = vulnerable_transcript(vk, C1)
beta_v2 = vulnerable_transcript(vk, C1)  # same C1, different pub
print(f"Vulnerable: β same regardless of pub_input? {beta_v1 == beta_v2}")

beta_s1 = secure_transcript(vk, pub_real, C1)
beta_s2 = secure_transcript(vk, pub_fake, C1)
print(f"Secure: β different for different pub_input? {beta_s1 != beta_s2}")
```

---

## 6. Bug Class 5: VK Validation

### 6.1 Governance attack

Trong Substrate, VK được stored on-chain và có thể được update qua governance. Attack vector:

```python
# VK substitution attack concept
"""
1. Attacker tạo VK' với k1', k2' giả mạo, x2' = tau'_G2 (attacker biết tau')
2. Attacker propose governance update để replace VK với VK'
3. Sau khi update, attacker tạo proof forged dùng tau' → verifier accept

Detection:
- Xem pallet-fflonk-verifier: ai có quyền update VK?
- Nếu là Sudo hoặc Council: check audit history
- Nếu là permissionless: RED FLAG

Kiểm tra:
- grep "set_vk\|update_vk\|force_vk" pallets/fflonk/src/lib.rs
- Tìm access control: ensure_root? ensure_council? ensure_signed?
"""

# Dummy check: validate VK field values are BN254 G1 points
def check_vk_point(x, y, p, r):
    """VK G1 points phải: on-curve + in-subgroup"""
    # on-curve check
    if y*y % p != (x**3 + 3) % p:
        return False, "VK point not on BN254 curve"
    # For BN254 G1 with cofactor 1, all on-curve points are in subgroup
    return True, "VK point valid"

# BN254 params
p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
# G1 generator
ok, msg = check_vk_point(1, 2, p, None)
print(f"VK G1 generator check: {ok} — {msg}")
```

---

## 7. PoC Template cho Immunefi Submission

```python
# Template PoC cho soundness bug

poc_template = """
# FFLONK Verifier Bug PoC

## Bug Description
[Mô tả bug, ví dụ: "Missing subgroup check trên W1, W2 allows forge proof"]

## Impact
Critical: Attacker có thể submit proof cho invalid Polygon zkEVM state →
Ethereum bridge giải phóng funds cho invalid claim.

## Root Cause
[File + line number, ví dụ: fflonk_verifier/src/proof.rs:L45 missing is_in_subgroup()]

## Attack Steps
1. Bắt đầu với valid proof π = (C1, C2, W1, W2, evals) cho valid statement S
2. [Chi tiết attack theo bug class]
3. Submit π' với public_input = S' (sai statement)
4. Verifier accepts → attestation published to Ethereum
5. Bridge releases funds for S'

## PoC Code
[Rust code dùng fflonk_verifier crate để reproduce]

    #[test]
    fn poc_subgroup_check_missing() {
        let valid_proof = get_test_proof();
        let malicious_w1 = craft_non_subgroup_point();
        let mut forged_proof = valid_proof.clone();
        forged_proof.w1 = malicious_w1;
        let result = verify(&VerificationKey::default(), &forged_proof, &test_pubs());
        assert!(result.is_ok(), "BUG: forged proof accepted!");
    }

## Mitigation
Add `is_in_correct_subgroup_assuming_on_curve()` check for all G1 points.

## Severity
Critical — allows forging arbitrary proofs → all user funds at risk.
"""

print(poc_template)
```

---

## 8. Hunting Strategy: Step by Step

```python
hunting_workflow = {
    "Phase 1 — Setup (30 min)": [
        "Clone zkVerify/fflonk_verifier",
        "Build: cargo build && cargo test",
        "Run existing tests: cargo test -- --nocapture",
        "Identify test vectors, note passing ones",
    ],
    "Phase 2 — Static Analysis (2h)": [
        "Read lib.rs → identify verify() entry point",
        "Read transcript.rs → map all transcript.update() calls",
        "Read proof.rs → find all G1 validation checks",
        "Read field.rs → spot raw arithmetic (non-ark_ff)",
        "Cross-reference with checklist (L10, Q1-Q14)",
    ],
    "Phase 3 — Dynamic Testing (2h)": [
        "Modify test vectors: flip bits in proof bytes",
        "Test deserialization edge cases: all-zeros, all-ones",
        "Test boundary values: x = p-1 (field max), x = p (out of range)",
        "Check: does submitting zero-point W1 = (0,0) cause panic or silent accept?",
    ],
    "Phase 4 — Differential Testing (2h)": [
        "Compare with Polygon Solidity reference: FflonkVerifier.sol",
        "Find any step Rust does differently from Solidity",
        "Check endianness: Rust big-endian vs Solidity uint256",
        "Compare transcript hash inputs order",
    ],
    "Phase 5 — Exploit Development (if bug found)": [
        "Confirm bug is reproducible",
        "Write minimal PoC",
        "Assess impact: soundness (Critical) vs DoS (High) vs info leak (Low)",
        "Document: file, line, expected vs actual behavior",
        "Submit via Immunefi with PoC",
    ],
}

print("=== Bug Hunting Workflow ===\n")
for phase, steps in hunting_workflow.items():
    print(f"[{phase}]")
    for s in steps: print(f"  • {s}")
    print()
```

---

## 9. Quick Reference: Grep Commands

```bash
# Chạy trong repo zkVerify/fflonk_verifier

# Subgroup checks
grep -n "subgroup\|cofactor\|is_in_correct" src/*.rs

# Transcript elements
grep -n "update\|squeeze\|absorb" src/transcript.rs

# Field arithmetic
grep -n "wrapping_\|unchecked_\|saturating_" src/*.rs

# Point at infinity
grep -n "is_zero\|is_identity\|infinity" src/*.rs

# Deserialization validation
grep -n "try_from\|from_bytes\|deserialize" src/proof.rs

# Pairing call
grep -n "pairing\|miller_loop\|final_exp" src/*.rs

# VK validation
grep -n "verify_vk\|check_vk\|validate" src/*.rs pallets/fflonk/src/*.rs

# Weight
grep -n "WeightInfo\|weight\|ref_time" pallets/fflonk/src/weight.rs
```

---

## Summary

- **2 attack goals**: forge proof (Critical) → steal funds; reject valid proof (High) → DoS
- **8 bug classes** → PoC pattern khác nhau cho mỗi loại
- **Hunting workflow**: Setup → Static → Dynamic → Differential → Exploit
- **LCA là bug thực tế** (Linea 2024) — check transcript completeness là ưu tiên #1
- **Immunefi submission**: cần PoC, severity tính theo funds at risk × 5%, max $50k

---

## References

- OpenZeppelin — *The Last Challenge Attack* (Linea PLONK, 2024)
- Chaliasos et al. — *SoK: SNARK Security Vulnerabilities*, USENIX Security 2024
- Trail of Bits — *zkVerify Security Review*, Feb 2025
- Immunefi — *zkVerify Bug Bounty*, immunefi.com/bug-bounty/zkverify
- zkbugs — `github.com/zksecurity/zkbugs` (repository của known ZK bugs)
