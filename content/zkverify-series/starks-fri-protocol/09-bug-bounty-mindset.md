---
title: "09. Bug Bounty Mindset on zkVerify"
tags: [cryptography, starks, bug-bounty, immunefi, audit-methodology, proof-of-concept, lesson-09]
aliases: [Bug Bounty, Audit Methodology, PoC Construction]
created: 2026-03-13
---

> **Prerequisites**: [[07-zkverify-architecture|L07]] — zkVerify architecture; [[08-attack-vectors-bug-classes|L08]] — Attack vectors
> **Objectives**:
> - Hiểu mindset khác nhau giữa "học ZK" và "hunt ZK bugs"
> - Nắm quy trình audit Rust ZK codebase từ A đến Z
> - Học cách đọc code zkVerify có mục tiêu (targeted reading)
> - Biết cách construct PoC cho ZK bugs
> - Hiểu Immunefi program rules, scope, và submission process
> - Nhận diện unaudited attack surfaces (sau Trail of Bits + SRLabs)

---

## Mindset: Từ "Học" sang "Hunt"

Học ZK = hiểu protocol → trust nó hoạt động đúng.  
Bug hunt ZK = tìm điểm nào protocol **có thể** hoạt động sai.

Sự chuyển đổi quan trọng nhất là **adversarial thinking**:

```
Câu hỏi của người học:  "Tại sao prover không thể gian lận?"
Câu hỏi của bug hunter: "Trong trường hợp nào prover CÓ THỂ gian lận?"
```

> [!note] Bug Hunter Mindset Framework
> **1. Trust nothing — verify everything**  
> Mọi comment "// this is correct by construction" hay `expect("qed")` trong Rust đều là một **giả định cần verify**.
>
> **2. Assume the adversary controls inputs**  
> Prover là adversary. Họ kiểm soát proof, VK, public inputs. Verifier logic phải chịu được mọi input.
>
> **3. Think in counterexamples**  
> Với mỗi security property (soundness, completeness), hỏi: "Tồn tại input nào phá vỡ property này không?"
>
> **4. Follow the money**  
> Trong zkVerify context: soundness bug = proof giả được accepted = funds stolen from downstream L2. Đây là critical.

---

## Quy Trình Audit: 7 Bước

### Bước 1: Reconnaissance

Trước khi đọc một dòng code, gather context:

```python
RECON_CHECKLIST = """
=== zkVerify Bug Bounty Reconnaissance ===

1. Read the bug bounty program FIRST:
   https://immunefi.com/bug-bounty/zkverify/information/
   → Critical max: $50,000 (5% of funds affected, min $15K)
   → PoC required for ALL severities
   → KYC required for payout
   → Testing ONLY on local forks (not mainnet/testnet)

2. Check audit history:
   → Trail of Bits: Feb 2025 (pre-mainnet, comprehensive)
     https://github.com/trailofbits/publications/blob/master/reviews/2025-02-zkverify-foundation-blockchain-securityreview.pdf
   → SRLabs: Sep 2025 (post-mainnet, runtime upgrades)
     https://github.com/srlabs/audit-reports/blob/main/Polkadot/...
   → Implication: Core pallets (Groth16, Fflonk) are heavily audited.
     TARGET: newer, less-audited code

3. Find unaudited attack surfaces:
   → XCM integration (cross-chain messaging)
   → ParaVerifier pallet (newer)
   → EZKL verifier adapter (ML-based, complex)
   → Any pallet added AFTER Sep 2025 audit

4. Understand the threat model:
   → Who submits proofs? Any user with VFY tokens
   → What do they gain from a soundness bug?
   → Chain accepts invalid state transitions → fund theft

5. Map the codebase:
   git clone https://github.com/zkVerify/zkVerify
   find . -name "*.rs" | wc -l    # Count files
   git log --oneline -20           # Recent commits
   git log --oneline --since="2025-09-01" -- pallets/  # Post-audit changes
"""
print(RECON_CHECKLIST)
```

### Bước 2: Targeted Code Reading

**Đừng đọc toàn bộ codebase.** Đọc theo threat model:

```python
READING_STRATEGY = """
=== Targeted Code Reading Strategy ===

Priority 1 — Entry points (highest attack surface):
  pallets/*/src/lib.rs
  → Tìm: submit_proof extrinsic
  → Check: input validation trước khi gọi verifier
  → Grep: "decode", "try_into", "unwrap", "expect"

Priority 2 — Cryptographic core (soundness bugs):
  verifiers/*/src/lib.rs
  → Tìm: verify() function
  → Check: field arithmetic, constraint checks, degree bounds
  → Grep: "fri_", "fiat_shamir", "transcript", "challenge"

Priority 3 — Aggregation mechanism:
  pallets/proof_of_existence/src/lib.rs
  → Tìm: Merkle tree construction
  → Check: domain separation, leaf encoding

Priority 4 — Runtime upgrades và mới:
  git log --oneline pallets/ezkl/
  git log --oneline pallets/ultrahonk/
  → Focus vào code chưa được audit

Red flags để tìm ngay:
  grep -rn "unwrap()" pallets/  # panic potential
  grep -rn "expect(" pallets/   # every "qed" is an assumption
  grep -rn "as u64" verifiers/  # potential overflow
  grep -rn "unsafe" pallets/    # unsafe blocks
  grep -rn "TODO\\|FIXME\\|HACK" pallets/  # known issues
"""
print(READING_STRATEGY)
```

### Bước 3: Hypothesis Generation

Khi đọc code, liên tục hỏi: "Điều gì sẽ xảy ra nếu...?"

```python
HYPOTHESIS_TEMPLATE = """
Hypothesis: [Mô tả bug]
File: [path/to/file.rs]
Function: [function_name]
Root cause: [field arithmetic / missing constraint / Fiat-Shamir / etc.]

Normal path: [Input X → Expected behavior Y]
Attack path:  [Malicious input X' → Unexpected behavior Y' that bypasses security]

Security impact:
  - Soundness violated: [Yes/No — explain]
  - Completeness violated: [Yes/No — explain]
  - DoS potential: [Yes/No — explain]
  - Economic impact: [Est. funds at risk]

Requires:
  - Attacker controls: [proof data / VK / public inputs / node access]
  - Preconditions: [specific setup needed]

Falsification attempt: [How to check if hypothesis is WRONG?]
"""
print(HYPOTHESIS_TEMPLATE)
```

### Bước 4: PoC Construction

**Immunefi yêu cầu PoC cho mọi severity.** Không có PoC = report bị reject.

PoC structure cho ZK soundness bug:

```python
POC_TEMPLATE = """
=== PoC Template cho ZK Soundness Bug ===

# 1. Setup — mô tả rõ môi trường
# OS: Linux x86_64
# Rust: 1.75.0
# zkVerify commit: <hash>

# 2. Construct malicious inputs
# Proof của một computation SAI nhưng sẽ pass verifier

# 3. Submit và verify
# Show rằng verifier ACCEPTS proof giả

# 4. Impact demonstration  
# Show điều attacker có thể làm với điều này

# ---- Pseudo-code PoC ----

def construct_soundness_exploit():
    # Computation thực sự là: Fibonacci(100) = 354224848179261915075
    # Attacker muốn prove: Fibonacci(100) = 999 (sai)
    
    # Step 1: Generate VALID trace for wrong computation
    fake_trace = build_fake_fibonacci_trace(n=100, claimed_output=999)
    
    # Step 2: Find where AIR constraint fails
    # Ví dụ: transition constraint C2 bị vi phạm tại step 42
    
    # Step 3: Exploit under-constrained AIR (nếu tồn tại)
    # Tìm constraint bị thiếu, set trace để bypass nó
    
    # Step 4: Generate fake proof
    fake_proof = prover.prove(fake_trace, use_honest_prover=False)
    
    # Step 5: Submit
    result = zkverify.submit_proof(
        proof_type="risc_zero",
        proof=fake_proof,
        vk=honest_vk,
        public_inputs={"output": 999}  # wrong output!
    )
    
    assert result == "ProofVerified"  # Should FAIL in secure system
    
    print("EXPLOITED: fake Fibonacci accepted!")
    print("Attacker can now claim they ran computation with output=999")
    print("Impact: downstream L2 accepts fraudulent state transition")

# Để submit ke Immunefi:
# 1. Implement PoC trong local fork của zkVerify
# 2. Test thoroughly (Rust #[test] hoặc integration test)
# 3. Tạo minimal reproducible test case
# 4. Document step-by-step clearly
"""
print(POC_TEMPLATE)
```

### Bước 5: Đọc Audit Reports

**Đừng tái phát hiện bugs đã biết.** Đọc audit reports trước:

```python
AUDIT_READING_GUIDE = """
=== Đọc Audit Reports Hiệu Quả ===

Trail of Bits Report (Feb 2025):
  → Đọc "Executive Summary" và "Findings" sections
  → Phân loại: Critical, High, Medium, Low, Informational
  → Note: Những finding nào đã được FIX? (xem "Resolution")
  → Note: Những finding nào WONT FIX? (vẫn còn tồn tại!)
  → Đặc biệt quan tâm: Informational findings (có thể escalate)

SRLabs Report (Sep 2025):
  → Focus: runtime upgrades, NPoS security
  → Note: Scope của audit là gì? EZKL trong scope không?
  
Những gì audit KHÔNG cover (target của bạn):
  → Code merge sau ngày audit
  → Pallets mới thêm vào sau audit
  → Integration với external systems (XCM, bridges)
  → Edge cases mà test suite chưa cover
  → Composition bugs giữa hai pallets (inter-pallet interactions)

Tip: Tìm trong report "out of scope" và "future work"
"""
print(AUDIT_READING_GUIDE)
```

### Bước 6: Đặc Biệt — Đọc `expect("qed")` Comments

Đây là tip cụ thể cho zkVerify Substrate codebase:

> [!danger] Đọc Skeptically Mọi `expect("...qed")`
> Trong Substrate/Rust code, `unwrap_or_else(|| panic!("invariant holds; qed"))` nghĩa là developer tin rằng condition này **không bao giờ** fail. Mỗi cái này là một **claim cần verify**.
>
> ```rust
> // Ví dụ trong pallets:
> let proof = ProofOf::<T>::decode(&mut &raw_proof[..])
>     .expect("proof is well-formed; qed");
> //                                ^^^^ THIS IS AN ASSUMPTION
> // Nếu attacker gửi malformed proof, đây sẽ panic → DoS
> ```
>
> **Method**: `grep -rn "qed" pallets/` → xem xét từng cái → kiểm tra liệu invariant có thực sự được enforce không.

### Bước 7: Submission

Quy trình submit theo Immunefi:

```
1. Viết report theo template Immunefi:
   - Summary (1-2 câu)
   - Vulnerability Details (technical)
   - Impact (economic + security)
   - Steps to Reproduce (với PoC code)
   - Recommended Fix
   
2. Đính kèm PoC code (Rust test hoặc script)
   
3. Submit qua https://immunefi.com/bug-bounty/zkverify/
   
4. KYC nếu được award

5. KHÔNG public disclosure cho đến khi fix + Immunefi cho phép
```

---

## Fuzzing ZK Code

Một kỹ thuật mạnh để tìm bugs mà manual review bỏ qua:

```python
# =============================================================
# Fuzzing Strategy cho ZK Verifiers
# (Conceptual — actual fuzzing cần cargo-fuzz hoặc libFuzzer)
# =============================================================

import random
import struct

def generate_mutated_proof(valid_proof: bytes, mutation_rate: float = 0.01) -> bytes:
    """
    Cơ bản nhất: mutate random bytes trong valid proof.
    Nếu verifier crashes (panic) → DoS bug.
    Nếu verifier accepts → soundness bug!
    """
    proof_bytes = bytearray(valid_proof)
    for i in range(len(proof_bytes)):
        if random.random() < mutation_rate:
            proof_bytes[i] = random.randint(0, 255)
    return bytes(proof_bytes)

def generate_edge_case_proofs() -> list:
    """
    Structured edge cases — nhiều khả năng trigger bugs hơn random mutation.
    """
    cases = []
    
    # Edge case 1: Empty proof
    cases.append(("empty_proof", b""))
    
    # Edge case 2: Proof với tất cả bytes = 0
    cases.append(("all_zeros", b"\x00" * 1024))
    
    # Edge case 3: Proof với tất cả bytes = 0xFF
    cases.append(("all_ones", b"\xff" * 1024))
    
    # Edge case 4: Proof quá ngắn (partial data)
    for length in [1, 8, 32, 63, 64, 127, 128]:
        cases.append((f"short_{length}", b"\x00" * length))
    
    # Edge case 5: Proof quá dài (buffer overflow potential)
    cases.append(("very_long", b"\x42" * (10 * 1024 * 1024)))  # 10MB
    
    # Edge case 6: Field element = 0 (invalid in most ZK protocols)
    # Field element serialized as 32 bytes little-endian
    zero_fe = b"\x00" * 32
    cases.append(("zero_field_element_in_proof", zero_fe * 32))
    
    # Edge case 7: Field element = p (should be rejected, non-canonical)
    p_goldilocks = 2**64 - 2**32 + 1
    p_bytes = p_goldilocks.to_bytes(8, 'little')
    cases.append(("field_eq_p_goldilocks", p_bytes * 32))
    
    # Edge case 8: Field element = p + 1 (non-canonical)
    p_plus_1 = (p_goldilocks + 1).to_bytes(8, 'little')
    cases.append(("field_eq_p_plus_1", p_plus_1 * 32))
    
    return cases

print("=== Fuzzing Strategy Demo ===")
edge_cases = generate_edge_case_proofs()
print(f"Generated {len(edge_cases)} structured edge cases:")
for name, data in edge_cases:
    print(f"  '{name}': {len(data)} bytes")

print("\nFuzzing logic:")
print("""
for name, malformed_proof in edge_cases:
    result = submit_to_verifier(malformed_proof)
    
    if result == "PANIC":
        print(f"🚨 DoS bug: {name} causes panic!")
        
    elif result == "ACCEPTED":
        print(f"🚨 SOUNDNESS BUG: {name} accepted as valid!")
        
    elif result == "ERROR":
        # Expected — verifier rejects gracefully
        pass
""")

# Specific: Goldilocks field overflow fuzzing
print("=== Goldilocks Field Overflow Fuzzing ===")
P = 2**64 - 2**32 + 1

def test_goldilocks_edge_cases():
    test_values = [
        0,           # zero
        1,           # one
        P - 1,       # -1 in field
        P,           # p itself — INVALID, should be rejected
        P + 1,       # p+1 — INVALID
        2**63,       # halfway
        2**64 - 1,   # max u64
    ]
    
    for v in test_values:
        is_valid = 0 <= v < P
        is_canonical = 0 <= v < P
        print(f"  v = {v:>30} | valid: {is_valid} | canonical: {is_canonical}")

test_goldilocks_edge_cases()
print("\nNếu verifier không reject v >= P → field arithmetic vulnerability!")
```

---

## zkVerify Unaudited Attack Surfaces (2025–2026)

Dựa trên thông tin audit history:

| Attack Surface | Audit Status | Priority |
|----------------|-------------|----------|
| Core pallets (Groth16, Fflonk) | Trail of Bits + SRLabs ✅ | LOW |
| RISC Zero pallet | Trail of Bits ✅ | MEDIUM |
| Plonky2 pallet | Trail of Bits ✅ | MEDIUM |
| SP1 pallet | Trail of Bits ✅ | MEDIUM |
| **EZKL verifier adapter** | Partial ⚠️ | **HIGH** |
| **ParaVerifier pallet** | Unknown ⚠️ | **HIGH** |
| **XCM integration** | Unknown ⚠️ | **HIGH** |
| New pallets post-Sep 2025 | Unaudited 🔴 | **CRITICAL** |
| Aggregation engine changes | Partial ⚠️ | **HIGH** |

> [!danger] Key Intelligence từ Real Auditor
> Một security researcher đã audit 2 sessions và note: *"Check the audit history first. Two reputable audits means the obvious attack surface is covered. Target newer, less-audited code (runtime upgrades, new pallets)."*
>
> Và: *"Read the `qed` comments skeptically. Every `expect("...qed")` is a claim about invariants. Verify each one against the actual code paths."*

---

## Xây Dựng PoC: Demo Cụ Thể

```python
# =============================================================
# Demo PoC Construction cho "Incomplete Constraint" Bug
# Mô phỏng cách viết PoC report cho Immunefi
# =============================================================

class SimplifiedStarkVerifier:
    """
    Mô phỏng một STARK verifier có bug (for demonstration).
    Bug: transition constraint chỉ check cột a, bỏ sót cột b.
    """
    
    def verify(self, public_inputs: dict, proof: dict) -> bool:
        n = proof["trace_length"]
        trace_a = proof["trace_a"]
        trace_b = proof["trace_b"]
        
        # Boundary check (correct)
        if trace_a[0] != public_inputs["a_initial"]:
            return False
        
        # BUG: transition constraint CHỈ check: a'[i] = b[i]
        # Bị thiếu: b'[i] = a[i] + b[i]
        for i in range(n - 1):
            if trace_a[i+1] != trace_b[i]:  # Only C1!
                return False
            # MISSING: if trace_b[i+1] != (trace_a[i] + trace_b[i]) % p: return False
        
        # Output check (correct — but relies on honest trace!)
        if trace_a[-1] != public_inputs["a_final"]:
            return False
        
        return True  # VULNERABLE

def exploit_under_constrained_verifier():
    """
    Exploit: prove Fibonacci(7) = 999 instead of 21.
    """
    p = 10**9 + 7
    
    # Honest trace
    n = 8
    a_vals = [1, 1, 2, 3, 5, 8, 13, 21]
    b_vals = [1, 2, 3, 5, 8, 13, 21, 34]
    
    verifier = SimplifiedStarkVerifier()
    
    # Test honest proof
    honest_proof = {"trace_length": n, "trace_a": a_vals, "trace_b": b_vals}
    honest_inputs = {"a_initial": 1, "a_final": 21}
    honest_result = verifier.verify(honest_inputs, honest_proof)
    print(f"Honest proof (F_7=21): {honest_result} ✅")
    
    # EXPLOIT: fake trace where a[-1] = 999
    # We need: a[i+1] = b[i] (C1 satisfied)
    # But we can freely set b[i+1] = anything (C2 NOT enforced!)
    
    # Construct malicious trace:
    # Start with a[0]=1, b[0]=1
    # Set a[1] = b[0] = 1 (satisfies C1)
    # Set b[1] = ANYTHING — we choose to reach a[7]=999
    # We need a[7] = b[6] = 999, so set b[6] = 999
    # Set b[i] for i=1..6 freely
    
    fake_a = [1, 1, 1, 1, 1, 1, 1, 999]   # a[i+1] = b[i] must hold
    # For a[i+1] = b[i] to hold: b[i] = a[i+1]
    fake_b = [fake_a[1], fake_a[2], fake_a[3], fake_a[4], 
              fake_a[5], fake_a[6], fake_a[7], 0]
    # = [1, 1, 1, 1, 1, 1, 999, 0]
    
    # Verify C1: a[i+1] == b[i] for all i
    c1_holds = all(fake_a[i+1] == fake_b[i] for i in range(n-1))
    
    fake_proof = {"trace_length": n, "trace_a": fake_a, "trace_b": fake_b}
    fake_inputs = {"a_initial": 1, "a_final": 999}  # Claiming F(7) = 999!
    
    fake_result = verifier.verify(fake_inputs, fake_proof)
    
    print(f"\nFake proof (claiming F_7=999): {fake_result}")
    print(f"  C1 satisfied: {c1_holds}")
    print(f"  C2 (NOT enforced): b'[0]={fake_b[1]} but a[0]+b[0]={1+1}")
    
    if fake_result:
        print("\n🚨 EXPLOIT SUCCESS: Verifier accepted F(7)=999!")
        print("   PoC demonstrates: under-constrained AIR allows false claims.")
        print("   Impact: downstream applications trusting this proof are compromised.")
    
    print("\n=== Immunefi Report Summary ===")
    print("""
SEVERITY: Critical
TITLE: Under-constrained AIR in [Verifier Name] — Missing column b transition constraint

SUMMARY:
The transition constraint verification omits checking b'[i] = a[i] + b[i],
allowing a prover to set column b arbitrarily and claim any final value for
column a, regardless of the actual computation.

IMPACT:
An attacker can submit a proof claiming any output for a Fibonacci-like
computation. In zkVerify context, this means any computation using this
verifier can have its output forged, allowing:
- False state transitions accepted on downstream L2s
- Token minting without backing
- Any computation output spoofed

STEPS TO REPRODUCE:
1. Clone zkVerify at commit <hash>
2. Run: cargo test --package verifiers-fibonacci exploit_test
3. Observe: fake_proof with output=999 passes verification

POC CODE: [attached test file]

RECOMMENDED FIX:
Add transition constraint for column b:
  if trace_b[i+1] != (trace_a[i] + trace_b[i]) % p:
    return Err(VerificationError::TransitionConstraintViolated)
""")

exploit_under_constrained_verifier()
```

---

## Key Takeaways

- **Mindset shift**: từ "trust protocol" → "tìm counterexamples". Adversarial thinking là core skill.
- **7 bước**: Recon → Targeted reading → Hypothesis → PoC → Audit reports → `qed` comments → Submit.
- **Targeted reading**: `grep -rn "unwrap\|expect\|qed\|as u64\|TODO"` là điểm khởi đầu.
- **Immunefi rules**: Critical cap $50K (min $15K), PoC required mọi severity, KYC required, test trên local fork.
- **Unaudited surface** (2025–2026): EZKL adapter, ParaVerifier, XCM integration, post-Sep 2025 code.
- **PoC structure**: Setup → Malicious inputs → Submission → Impact demonstration.
- **Fuzzing**: structured edge cases (zero, p, p+1, max u64) hiệu quả hơn random mutation.
- **Goldilocks field overflow** trong Plonky2: `as u64` multiplication = common bug class.

---

## Final Challenge

Bây giờ bạn đã có đủ kiến thức. Thử challenge thực:

1. **Clone zkVerify**: `git clone https://github.com/zkVerify/zkVerify`
2. **Focus vào EZKL adapter** (ít được audit nhất)
3. **Đọc** `pallets/ezkl/src/lib.rs` + `verifiers/ezkl/src/lib.rs`
4. **Apply checklist từ L08**: constraint bounds, Fiat-Shamir, field arithmetic
5. **Tìm một `expect("qed")`** và verify invariant
6. **Construct một fuzzing test** cho Goldilocks overflow

**Series này đã cho bạn tất cả công cụ. Giờ là thực hành.**

---

## Self-Check

1. Tại sao `expect("...qed")` trong Substrate code là red flag? Cho ví dụ cụ thể.
2. Bạn tìm thấy EZKL verifier không có length check cho proof bytes. Viết pseudo-code PoC cho DoS attack.
3. Giải thích tại sao PoC là required ngay cả cho Low severity bugs trên Immunefi. Điều này ảnh hưởng đến chiến lược của bạn thế nào?
4. Sau khi Trail of Bits và SRLabs đã audit, phần nào của zkVerify còn là "unaudited"? Tại sao target những phần đó?
5. Bạn tìm thấy một bug soundness trong EZKL verifier. Trước khi submit, bạn cần làm gì? (Hint: ít nhất 3 bước)

---

## References

- zkVerify Immunefi Bug Bounty: https://immunefi.com/bug-bounty/zkverify/information/
- Trail of Bits zkVerify Audit (Feb 2025): https://github.com/trailofbits/publications/blob/master/reviews/2025-02-zkverify-foundation-blockchain-securityreview.pdf
- SRLabs zkVerify Assurance Report (Sep 2025): https://github.com/srlabs/audit-reports/blob/main/Polkadot/SRL-zkVerify_baseline_assurance-report-2025.pdf
- Immunefi Bug Report Template: https://immunefi.com/blog/immunefi-vulnerability-severity-classification-system-v2-2/
- zkVerify GitHub: https://github.com/zkVerify/zkVerify
- SoK: ZKP Vulnerabilities: https://arxiv.org/pdf/2402.15293
- Trail of Bits — *ZKDocs*: https://www.zkdocs.com/
