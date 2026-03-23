---
title: "14. Bug Bounty Playbook — Checklist, Tools, Methodology"
tags: [cryptography, zk-hash, bug-bounty, audit, methodology, tools, lesson-14]
aliases: [Bug Bounty Playbook ZK Hash]
created: 2026-03-13
---

> **Prerequisites**: Tất cả bài trước, đặc biệt [[12-circuit-bugs|12]], [[13-implementation-integration-bugs|13]]  
> **Objectives**:  
> - Có checklist đầy đủ cho một ZK hash function audit engagement
> - Biết cách setup và dùng Circomspect, halo2-analyzer, SageMath cho automated analysis
> - Hiểu quy trình viết bug report chuyên nghiệp và estimate severity
> - Thực hành: Phân tích một ZK circuit nhỏ end-to-end

---

## Engagement Scoping — Trước khi Bắt đầu

### Xác định Scope

Trước khi audit bất kỳ ZK hash project nào, cần rõ:

```
SCOPE QUESTIONS:

1. Hash function nào được dùng?
   □ Poseidon (BN254 / BLS12-381 / Goldilocks / Pasta)
   □ MiMC / GMiMC
   □ Rescue-Prime
   □ Custom / thế hệ mới (Anemoi, Griffin, ...)

2. Circuit framework?
   □ Circom (R1CS) — dùng Circomspect
   □ Halo2 (PLONK) — dùng halo2-analyzer, MockProver
   □ Cairo (STARKs) — manual review chính
   □ Noir — manual + formal tools

3. Protocol context?
   □ Merkle tree membership proof
   □ Commitment scheme
   □ Nullifier / serial number
   □ PRF / signature scheme
   □ Recursive proof (hash nằm trong circuit verify circuit khác)

4. Chain của hash?
   □ Single hash call
   □ Repeated hashing (iterative)
   □ Hash-and-compare (output goes back as input)

5. Test vectors?
   □ Reference implementation có không?
   □ Known good inputs/outputs để compare?
```

---

## Methodology — 5 Bước Audit

### Bước 1: Cryptographic Parameters Review

Kiểm tra tham số mật mã trước mọi thứ khác.

```python
# audit_params.py — Script tự động kiểm tra tham số
import math
from math import gcd

def audit_hash_params(hash_type, field, params):
    """
    Audit cryptographic parameters của ZK hash instance.
    params: dict với keys tùy hash_type
    """
    issues = []

    if hash_type == "poseidon":
        p = field['p']
        alpha = params['alpha']
        R_F  = params['R_F']
        R_P  = params['R_P']
        t    = params['t']

        # Check 1: alpha phải coprime với p-1
        if gcd(alpha, p - 1) != 1:
            issues.append({
                "severity": "CRITICAL",
                "title": f"Invalid S-box: alpha={alpha} không coprime với p-1",
                "detail": f"gcd({alpha}, p-1) = {gcd(alpha, p-1)}, S-box x^{alpha} không là bijection",
                "fix": f"Dùng alpha tối thiểu thỏa gcd(alpha, p-1) = 1"
            })

        # Check 2: R_F >= 6 và chẵn
        if R_F < 6:
            issues.append({
                "severity": "CRITICAL",
                "title": f"Insufficient full rounds: R_F={R_F}",
                "detail": f"R_F=6 là minimum. Hiện tại {R_F} có thể insufficient",
                "fix": "Tăng R_F >= 6; chuẩn là 8"
            })

        # Check 3: R_P minimum bounds
        min_RP = max(
            math.ceil((128 - R_F * math.log2(alpha)) / math.log2(alpha)),
            math.ceil(0.184 * t + 13.5) - R_F  # Interpolation bound
        )
        if R_P < min_RP:
            issues.append({
                "severity": "CRITICAL",
                "title": f"Insufficient partial rounds: R_P={R_P} < minimum {min_RP}",
                "detail": f"Với t={t}, alpha={alpha}, R_F={R_F}: cần R_P >= {min_RP}",
                "fix": f"Tăng R_P đến ít nhất {min_RP}"
            })

        # Check 4: Test vector
        issues.append({
            "severity": "INFO",
            "title": "Verify test vectors",
            "detail": "Compare với circomlib reference: Poseidon([1,2]) BN254 = 0x115cc0f5...",
            "fix": "Chạy test vector comparison (xem bên dưới)"
        })

    elif hash_type == "mimc":
        p = field['p']
        alpha = params['alpha']
        num_rounds = params['num_rounds']

        # Check: alpha có đúng cho field không
        if gcd(alpha, p - 1) != 1:
            issues.append({
                "severity": "CRITICAL",
                "title": f"MiMC alpha={alpha} invalid",
                "detail": "S-box không là bijection",
                "fix": f"Tính alpha_min = min a s.t. gcd(a, p-1) = 1"
            })

        # Check: số rounds đủ
        min_rounds = math.ceil(math.log(p, alpha)) * 2
        if num_rounds < min_rounds:
            issues.append({
                "severity": "HIGH",
                "title": f"Insufficient MiMC rounds: {num_rounds} < {min_rounds}",
                "detail": f"Minimum cho 128-bit security là {min_rounds}",
                "fix": f"Tăng rounds đến {min_rounds}"
            })

    return issues

# Test với Poseidon BN254 đúng
p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
result = audit_hash_params(
    "poseidon",
    {"p": p_bn254},
    {"alpha": 5, "R_F": 8, "R_P": 57, "t": 3}
)
for issue in result:
    print(f"[{issue['severity']}] {issue['title']}")

print()
# Test với tham số sai
result_bad = audit_hash_params(
    "poseidon",
    {"p": p_bn254},
    {"alpha": 3, "R_F": 4, "R_P": 20, "t": 3}  # All wrong!
)
for issue in result_bad:
    if issue["severity"] in ("CRITICAL", "HIGH"):
        print(f"[{issue['severity']}] {issue['title']}")
```

### Bước 2: Test Vector Verification

```python
# test_vectors.py — Verify implementation khớp reference

# Test vectors chuẩn (từ circomlib + light-poseidon audit)
POSEIDON_TEST_VECTORS = {
    "BN254": {
        "t2": {  # nInputs=1
            "Poseidon([1])":   "0x29176100eaa962bdc1fe6c654d6a3c130e96a4d1168b33848b897dc502820c3",
        },
        "t3": {  # nInputs=2
            "Poseidon([1,2])": "0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a",
            "Poseidon([0,0])": "0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864",
        },
    }
}

MIMC_TEST_VECTORS = {
    "BN254_alpha7": {
        "MiMC7(1, 2, k=0)": "0x2de49b42...",  # Từ Lesson 04
    }
}

def run_test_vectors(implementation_fn, test_vectors, name=""):
    """
    Chạy tất cả test vectors với implementation được cung cấp.
    implementation_fn: callable(inputs: list) -> int
    """
    print(f"\n=== Test Vector Verification: {name} ===")
    all_pass = True

    for desc, expected_hex in test_vectors.items():
        # Parse inputs từ description
        import re
        nums = [int(x) for x in re.findall(r'\d+', desc.split('(')[1])]

        actual = implementation_fn(nums)
        expected = int(expected_hex, 16)

        status = "✓ PASS" if actual == expected else "✗ FAIL"
        all_pass = all_pass and (actual == expected)
        print(f"  {status}: {desc}")
        if actual != expected:
            print(f"    Expected: {hex(expected)[:20]}...")
            print(f"    Actual:   {hex(actual)[:20]}...")

    return all_pass

# Ví dụ (với mock function cho demo):
def mock_poseidon(inputs):
    # Placeholder - trong thực tế dùng real Poseidon implementation
    if inputs == [1, 2]:
        return 0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a
    if inputs == [0, 0]:
        return 0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864
    return 0  # unknown

result = run_test_vectors(
    mock_poseidon,
    POSEIDON_TEST_VECTORS["BN254"]["t3"],
    name="Poseidon BN254 t=3"
)
print(f"\nAll pass: {result}")
```

### Bước 3: Static Analysis Tools

```bash
#!/bin/bash
# audit_static.sh — Automated static analysis pipeline

CIRCUIT="$1"  # e.g., contracts/circuits/poseidon_hash.circom

echo "=== 1. Circomspect (Trail of Bits) ==="
circomspect "$CIRCUIT" \
    --report underconstrained \
    --report signal-assignments \
    --report non-quadratic \
    --output audit_circomspect.json

echo "=== 2. Đếm constraints ==="
# Compile với circom để đếm constraints
circom "$CIRCUIT" --r1cs --output /tmp/
node -e "
const r1cs = require('/tmp/$(basename $CIRCUIT .circom).r1cs');
console.log('Constraints:', r1cs.nConstraints);
console.log('Signals:', r1cs.nOutputs + r1cs.nPubInputs + r1cs.nPrvInputs + r1cs.nLabels);
"

echo "=== 3. Check <-- patterns ==="
grep -n "<--" "$CIRCUIT" | grep -v "//.*<--" | while read line; do
    echo "  [WARN] Potential unconstrained assignment: $line"
done

echo "=== 4. Check missing === after <-- ==="
# Heuristic: Nếu có <-- mà không có === trong 5 dòng tiếp -> warn
python3 - << 'PYEOF'
import re, sys

with open("$CIRCUIT") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<--' in line and '//' not in line.split('<--')[0]:
        # Check if constrained within next 5 lines
        context = ''.join(lines[i:i+5])
        if '===' not in context and '<==' not in context:
            print(f"  [HIGH] Line {i+1}: <-- without constraint nearby")
            print(f"         {line.rstrip()}")
PYEOF

echo "=== Done. Review audit_circomspect.json ==="
```

### Bước 4: Halo2 Analysis (nếu applicable)

```rust
// audit_halo2.rs — Chạy halo2-analyzer và MockProver tests

#[cfg(test)]
mod audit_tests {
    use halo2_proofs::dev::{MockProver, VerifyFailure};
    use halo2_analyzer::Analyzer;

    #[test]
    fn test_underconstrained_detection() {
        let circuit = YourPoseidonCircuit::default();

        // Bước 1: Chạy Analyzer
        let analysis = Analyzer::new(&circuit, 10).analyze();
        println!("Underconstrained cells: {:?}", analysis.underconstrained_cells);
        assert!(analysis.underconstrained_cells.is_empty(),
            "Found underconstrained cells: {:?}", analysis.underconstrained_cells);

        // Bước 2: Test với invalid witness
        // Thử thay đổi một giá trị nội bộ và verify vẫn fail
        let invalid_circuit = YourPoseidonCircuitWithMutation::new(
            /* inject wrong intermediate value */
        );
        let prover = MockProver::run(10, &invalid_circuit, vec![]).unwrap();
        assert!(
            prover.verify().is_err(),
            "SOUNDNESS BUG: circuit accepts invalid witness!"
        );
    }

    #[test]
    fn test_test_vectors() {
        let known_input = Fp::from(42u64);
        let expected_output = poseidon_reference(known_input); // from reference lib

        let circuit = PoseidonCircuit { input: known_input };
        let prover = MockProver::run(10, &circuit, vec![vec![expected_output]]).unwrap();
        prover.verify().expect("Test vector should pass");
    }
}
```

### Bước 5: Manual Review — Target Areas

Sau automated tools, manual review tập trung vào:

```
MANUAL REVIEW TARGETS (ưu tiên cao → thấp):

1. [CRITICAL] Round constant generation
   - Trace nguồn gốc constants -> phải transparent (hash("mimc0"), etc.)
   - Compare với reference script (generate_parameters_grain.sage)
   - Red flag: hardcoded array không có comment về source

2. [CRITICAL] Hash output extraction
   - Poseidon: lấy state[0] hay state[1]? Consistent across usages?
   - Rescue: lấy từ rate hay capacity?

3. [HIGH] Component output constraints
   - Mỗi component.output phải được constrain (không chỉ assign)
   - Pattern: h.out được dùng trong constraint hay chỉ trong signal assignment?

4. [HIGH] Domain separation
   - Có tag cho mỗi use case?
   - Merkle hash và commitment hash phải có tag khác nhau

5. [HIGH] Field parameters
   - Tham số có match với field của proof system?
   - Test với cross-field test vectors

6. [MEDIUM] Integer overflow / wrap-around
   - Arithmetic trước khi đưa vào hash: có range check không?

7. [MEDIUM] Fiat-Shamir completeness
   - Tất cả public values được hash vào challenge?

8. [LOW] Code quality
   - Magic numbers không có comment
   - Missing test coverage
```

---

## SageMath Tools cho Cryptographic Analysis

```python
# sage_audit_tools.sage — Công cụ SageMath cho audit
# (Chạy trong SageMath, không phải Python thuần)

SAGE_SCRIPT = """
# Tool 1: Verify MDS property
def verify_mds_sage(M_list, p):
    F = GF(p)
    M = Matrix(F, M_list)
    t = M.nrows()

    from itertools import combinations
    for k in range(1, t+1):
        for rows in combinations(range(t), k):
            for cols in combinations(range(t), k):
                sub = M[list(rows), list(cols)]
                if sub.det() == 0:
                    return False, f"Singular: rows={rows}, cols={cols}"
    return True, "MDS verified"

# Tool 2: Verify round constant independence (no patterns)
def check_constant_bias(constants, p):
    # Chi-squared test for uniformity
    n = len(constants)
    buckets = 256
    counts = [0] * buckets
    for c in constants:
        bucket = (c * buckets) // p
        counts[bucket] += 1
    expected = n / buckets
    chi2 = sum((c - expected)**2 / expected for c in counts)
    # chi2 < 310 for 95% confidence with 255 dof
    return chi2 < 310, chi2

# Tool 3: Algebraic degree estimation
def estimate_degree_sat(alpha, R_F, R_P, t):
    # Saturation round: minimum r s.t. alpha^r > p (p ~ 2^254)
    import math
    sat_round = math.ceil(254 / math.log2(alpha))
    full_sat = R_F >= sat_round
    partial_contribution = R_P * math.log2(alpha)
    return {
        "saturation_round": sat_round,
        "full_saturated": full_sat,
        "partial_degree_contribution": partial_contribution
    }

# Chạy tất cả checks
p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# Fake MDS for demo (real circomlib MDS is hardcoded)
import random; random.seed(42)
# (trong thực tế dùng matrix từ circomlib)

deg = estimate_degree_sat(5, 8, 57, 3)
print("Degree analysis:", deg)
"""

print("SageMath audit script ready")
print("Chạy trong SageMath: sage sage_audit_tools.sage")
```

---

## Bug Report Template

```markdown
# [SEVERITY] Title mô tả ngắn gọn vulnerability

**Severity**: CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL
**Category**: Underconstrained / Overconstrained / Spec Mismatch / Implementation / Integration
**Affected Component**: [file, function, line numbers]

## Summary

Một câu mô tả ngắn gọn vulnerability và impact.

## Description

Mô tả kỹ thuật đầy đủ:
- Vulnerability hoạt động như thế nào?
- Tại sao đây là bug (so với expected behavior)?
- Điều kiện để exploit?

## Proof of Concept

```python
# Code PoC thực tế, tái hiện vulnerability
# Include expected vs actual output
```

## Impact

- Severity justification (theo CVSS hoặc custom scale)
- Scenario khai thác thực tế
- Giá trị bị risk (nếu có)

## Recommendation

```diff
- // BUG CODE
+ // FIX CODE
```

Giải thích tại sao fix này đúng.

## References

- Link paper/spec liên quan
- Link to similar bugs (nếu có)
```

---

## Severity Estimation Guide

```python
def estimate_severity(bug_type, exploitability, impact):
    """
    Simplified severity calculator cho ZK bugs
    Dựa trên CVSS-inspired model
    """
    base_scores = {
        "underconstrained_soundness": 9.5,  # Critical: fake proofs
        "overconstrained_completeness": 6.0,  # High: DoS
        "spec_mismatch_rounds": 8.0,         # High: crypto weakness
        "fiat_shamir_incomplete": 9.0,        # Critical: forge proofs
        "domain_separation_missing": 7.0,     # High: cross-context
        "hash_to_field_wrong": 6.5,           # High: inconsistency
        "parameter_mismatch": 8.0,            # High: wrong security level
        "round_constant_weak": 7.5,           # High: crypto weakness
    }

    exploitability_modifiers = {
        "trivial": 1.0,    # Exploitable với basic tools
        "moderate": 0.85,  # Cần moderate effort
        "difficult": 0.7,  # Cần expert knowledge
    }

    impact_modifiers = {
        "fund_theft": 1.0,
        "proof_forgery": 0.95,
        "denial_of_service": 0.7,
        "information_leak": 0.5,
    }

    base = base_scores.get(bug_type, 5.0)
    score = base * exploitability_modifiers[exploitability] * impact_modifiers[impact]
    score = min(10.0, score)

    if score >= 9.0:  severity = "CRITICAL"
    elif score >= 7.0: severity = "HIGH"
    elif score >= 5.0: severity = "MEDIUM"
    elif score >= 3.0: severity = "LOW"
    else:              severity = "INFORMATIONAL"

    return severity, round(score, 1)

# Ví dụ
sev, score = estimate_severity("underconstrained_soundness", "trivial", "fund_theft")
print(f"Underconstrained + trivial exploit + fund theft: {sev} ({score}/10)")

sev2, score2 = estimate_severity("domain_separation_missing", "difficult", "proof_forgery")
print(f"Missing domain sep + difficult + forgery: {sev2} ({score2}/10)")
```

---

## CTF Exercise: Audit mini-circuit

Phân tích circuit sau và tìm tất cả bugs (đáp án ở cuối):

```circom
pragma circom 2.0.0;
include "circomlib/circuits/poseidon.circom";

// Circuit: Prove knowledge of preimage of a Poseidon hash
// Public: hash_value
// Private: preimage

template KnowledgeOfPreimage() {
    signal input preimage;      // private
    signal input hash_value;    // public

    // Compute hash
    component h = Poseidon(1);
    h.inputs[0] <== preimage;

    // Verify hash matches
    // ???

    signal computed_hash;
    computed_hash <-- h.out;    // [1] <-- instead of <==?
                                // [2] Missing constraint: computed_hash === hash_value?
}

component main { public [hash_value] } = KnowledgeOfPreimage();
```

**Bugs trong circuit này**:
1. `computed_hash <-- h.out`: Dùng `<--` thay vì `<==` — computed_hash không constrained bằng h.out
2. Thiếu constraint `computed_hash === hash_value` (hoặc `h.out === hash_value`)
3. Kết quả: Malicious prover có thể submit bất kỳ preimage nào với bất kỳ hash_value nào

**Fix đúng**:
```circom
template KnowledgeOfPreimage() {
    signal input preimage;
    signal input hash_value;

    component h = Poseidon(1);
    h.inputs[0] <== preimage;
    h.out === hash_value;    // Direct constraint — không cần signal trung gian
}
```

---

## Summary / Key Takeaways

- **Phương pháp 5 bước**: Params → Test vectors → Static analysis → Framework-specific → Manual
- **Circomspect** bắt underconstrained, `<--` misuse, non-quadratic — chạy trước manual review
- **MockProver (Halo2)**: Test với invalid witnesses để detect underconstrained
- **Test vectors** là ground truth — mọi implementation phải match reference
- **Bug report** phải có: title, severity, PoC code, impact justification, concrete fix
- **Severity**: Underconstrained soundness + trivial exploit = CRITICAL (9.5/10)
- **Không có silver bullet**: Tools bắt được ~50% bugs, phần còn lại cần manual expert review

---

## References

- Trail of Bits — *Circomspect: A Security Analyzer for Circom* (github.com/trailofbits/circomspect)
- Quantstamp — *Korrekt/halo2-analyzer* (github.com/quantstamp/halo2-analyzer)
- 0xPARC — *ZK Bug Tracker* (github.com/0xPARC/zk-bug-tracker)
- zkSecurity — *zkbugs: Repository of ZK security bugs* (github.com/zksecurity/zkbugs)
- Bernhard Mueller — *A Practical Guide to Finding Soundness Bugs in ZK Circuits* (Jan 2026)
- Zellic — *ZK Security Audit Methodology* (zellic.io)
- Pailoor et al. — *Automated Detection of Under-Constrained Circuits* (PLDI 2023)
- Chaliasos, Yu — *zkbugs: An Atlas of Real-World ZK Bugs* (2025)
- zkVerify — Bug Bounty Program (zkverify.io)
