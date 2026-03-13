---
title: "13. Real-World CVEs Deep Dive"
tags: [zk, zkvm, security, CVE, real-world, exploit, risc0, sp1, lesson-13]
aliases: [Real-World CVEs]
created: 2026-03-13
---

> **Prerequisites**: [[08-circuit-bugs|08. Circuit Bugs]], [[09-compiler-frontend-bugs|09. Compiler & Frontend Bugs]], [[10-host-guest-bugs|10. Host/Guest Bugs]]  
> **Objectives**:  
> - Phân tích kỹ 5 real-world bugs: CVE-2025-52484, ExpandU32, Poseidon2, SP1 LambdaClass, Unfaithful Claims
> - Hiểu root cause → attack vector → impact → fix cho mỗi bug
> - Học cách bug finder tiếp cận và verify từng finding
> - Rút ra "lessons learned" có thể áp dụng khi hunt bugs mới

---

## Tại sao học CVEs thực tế?

Bug taxonomy (Bài 06) và threat models (Bài 07) cung cấp khung lý thuyết. Nhưng để thực sự tìm bugs mới, cần hiểu **anatomy** của bugs đã tìm được: người tìm bug đã *nhìn vào đâu* và *phát hiện gì*.

---

## CVE 1 — CVE-2025-52484: Missing rs1/rs2 Constraint (Critical)

**Metadata:**
- **CVE**: CVE-2025-52484 / GHSA-g3qg-6746-3mg9
- **Severity**: Critical
- **Reported by**: Christoph "zkCrusher" Hochrainer, ngày 15/5/2025
- **Platform**: HackenProof bug bounty (Risc0)
- **Fixed in**: risc0-zkvm v2.1.0

**Root Cause Analysis:**

Trong RISC-V rv32im, 3-register instructions (ADD, SUB, MUL, DIV, REMU, ...) sử dụng R-type instruction encoding:

```
 31      25 24  20 19  15 14  12 11   7 6     0
| funct7  | rs2  | rs1  | funct3 | rd  | opcode |
```

Khi circuit xử lý instruction này, nó cần đọc giá trị từ registers `rs1` và `rs2`. Code Zirgen trong các components `DivInput`, `MulInput`, `MiscInput`, `MemStoreInput` sử dụng `NondetReg()` để receive giá trị registers — nhưng **không có constraint** buộc chúng phải là giá trị tại đúng register index được chỉ định bởi instruction word.

```text
// BUG (conceptual Zirgen — trước fix)
component DivInput(inst: Val, regFile: RegFile) {
    rs1_val := NondetReg();    // Prover cung cấp
    rs2_val := NondetReg();    // Prover cung cấp

    // Constraint kéo rs1_val từ regFile[rs1_idx]
    // Constraint kéo rs2_val từ regFile[rs2_idx]
    // NHƯNG: Không có constraint nào ngăn rs1_idx == rs2_idx
    // → Prover có thể set rs2_val = rs1_val dù chúng khác nhau
}
```

**Attack Vector:**

Với `REMU rd, rs1, rs2` (remainder unsigned: `rd = rs1 % rs2`):

```
Honest execution: REMU x5, x1, x2
  rs1 = x1 = 100, rs2 = x2 = 7
  rd = x5 = 100 % 7 = 2

Malicious prover:
  rs1 = x1 = 100, rs2 = x2 = 7 (instruction says rs2 = x2)
  BUT: Set rs2_val = rs1_val = 100 in witness
  Circuit sees: rs2_val = 100
  "Computes": 100 % 100 = 0 (or prover claims any value)
  → Proof verifies that "100 % 7 = 0" (false!)
```

**Impact:** Mọi 3-register instruction bị affected — arithmetic, bitwise, memory stores. Prover có thể forge kết quả của bất kỳ computation nào dùng 2 operands.

**Discovery Methodology:** Hochrainer sau đó công bố **ARGUZZ** — tool phát hiện bug này bằng fault injection. Nhưng ban đầu ông tìm bug này bằng **manual circuit review**: đọc Zirgen code cho từng instruction type và hỏi "register values có bị forced bởi constraints không?".

**Fix:**

```text
// FIX — zirgen/pull/238: ReadSourceRegs component mới
component ReadSourceRegs(inst: Val, regFile: RegFile) {
    rs1_idx := extract_bits(inst, 19, 15);  // bits [19:15]
    rs2_idx := extract_bits(inst, 24, 20);  // bits [24:20]
    
    // Constraint: nếu rs1 == rs2, read once (optimization)
    // Nếu rs1 != rs2, read both và verify chúng từ đúng register
    same := NondetBitReg();
    same * (rs1_idx - rs2_idx) = 0;
    // ... + additional constraints enforcing correct register reads
}
```

**Lesson Learned:** Khi circuit dùng `NondetReg()` để receive "input from register file", *luôn hỏi*: constraint nào buộc giá trị này phải match instruction's register index field?

---

## CVE 2 — ExpandU32: NondetTwitReg Underconstrained (High)

**Metadata:**
- **Finding ID**: V-RISC0-VUL-001 (Veridise Audit 2024)
- **Severity**: High
- **Found by**: Picus tool (automated), Veridise
- **Context**: 96 person-week audit, 41 total findings

**Root Cause Analysis:**

`ExpandU32` là component trong Risc0 circuit chuyển đổi một 32-bit value thành byte/bit decomposition. Nó dùng `NondetTwitReg()` (range {0,1,2,3}) cho các fields cần chỉ là bit (range {0,1}).

```text
// BUG
component ExpandU32(x: ValU32, signed: Val) {
    b3, b2, b1, b0 := split_bytes(x);  // Split thành 4 bytes
    
    // Decompose mỗi byte thành bits
    _rd_0 := NondetTwitReg();  // BUG: ∈ {0,1,2,3} thay vì {0,1}
    _rd_1 := NondetTwitReg();  // BUG
    // ...
    // Constraint: x == sum of _rd_i * 2^i (nhưng nếu _rd_i ∈ {0,1,2,3}
    // thì có nhiều cách decompose cùng value → underconstrained!)
}
```

**Ví dụ cụ thể:** Với `x = 5 = 0b101`:
- Honest decomposition: `[1, 0, 1, 0, ...]` (các bits từ thấp đến cao)
- Malicious decomposition: `[3, -1, 1, 0, ...]` → `3 * 1 + (-1) * 2 + 1 * 4 = 5` (vẫn thỏa mãn nếu field modulus lớn)

Trong Risc0's field $\mathbb{F}_p$ với $p$ lớn, `-1 \equiv p-1$, và $p-1 \in \{0,1,2,3\}$ không hold — nhưng có các combinations khác trong `NondetTwitReg` range {0,1,2,3} cho phép multiple valid decompositions.

**Impact:** Prover có thể đưa ra kết quả sai cho bất kỳ operation nào dùng ExpandU32 (arithmetic, bitwise, comparisons).

**Discovery Methodology:** Picus encode toàn bộ circuit thành SMT constraint system và query "có input x nào cho phép nhiều hơn một valid witness không?". Với ExpandU32 bug, SMT solver tìm được counterexample cụ thể.

**Lesson Learned:** Automated tools như Picus rất hiệu quả cho class này. Khi manual review: mỗi `NondetTwitReg()` trong context cần `{0,1}` là red flag.

---

## CVE 3 — SP1 LambdaClass Exploit (is_complete + COMMIT Bypass)

**Metadata:**
- **Version affected**: sp1-sdk 3.4.0 và các version trước
- **Severity**: Critical (proof forgery — arbitrary statements)
- **Found by**: 3MI Labs + Aligned + LambdaClass
- **Disclosed**: December 2025
- **Fixed in**: SP1 Turbo (v4.0.0)

**Two Bugs Combined:**

*Bug A — COMMIT syscall deferred flush:*

```rust
// SP1 runtime: COMMIT syscalls không được emit ngay
// Thay vào đó chúng được delay đến khi main() return
// Implementation (simplified):
fn handle_syscall(syscall: u32, args: ...) {
    if syscall == SYSCALL_COMMIT {
        // Delay: store in pending_commits
        self.pending_commits.push(value);
        // NOT emitted as ExecutionRecord event yet!
    }
}

// Chỉ khi main() return:
fn finalize_execution() {
    for commit in self.pending_commits {
        // NOW emit CommitEvent → generates constraints on committed_value_digest
        self.record.add_commit_event(commit);
    }
}
```

*Bug B — is_complete không enforce next_pc = 0:*

```rust
// SP1 v3.x CompressProver (simplified — affected: sp1-sdk ≤3.4.0):
fn compress_proof(shard: &ShardProof) -> CompressedProof {
    if shard.is_complete {
        // BUG: Không check next_pc == 0
        // Assumption: "is_complete means execution terminated"
        // Nhưng không enforce it!
        return compress_without_pc_check(shard);
    }
    // ...
}
```

**Combined Exploit:**

```
Step 1: Malicious executor
  - Run program until just before main() returns
  - At this point: pending_commits not yet flushed
  - Set next_pc = start_of_main (loop back instead of terminate)
  - Set is_complete = true

Step 2: Resulting state
  - committed_value_digest = [0,0,...,0] (never constrained!)
  - Shard proof generated without errors (Bug B: is_complete not checking next_pc)

Step 3: Exploitation
  - Deserialize the proof with custom public_values = [any_value_you_want]
  - Submit as valid SP1 proof
  - Honest verifier accepts → SOUNDNESS BROKEN

Demonstrated: "42 is prime" proven with valid SP1 proof
```

**Discovery Methodology:** LambdaClass team đọc kỹ SP1 source code, specifically:
1. Traced path của `io::commit()` → nhận ra deferred flush mechanism
2. Looked for "what happens if execution terminates early?" → thấy pending_commits không flush
3. Looked at CompressProver → thấy `is_complete` flag không enforce `next_pc == 0`
4. Combined two bugs để build complete exploit

**Lesson Learned:** Compound bugs (nhiều bugs kết hợp) thường là những bug nguy hiểm nhất và khó phát hiện nhất. Khi audit, hãy xem xét **interaction** giữa các components, không chỉ review từng component độc lập.

---

## CVE 4 — Unfaithful Claims: 6 zkVMs (March 2026)

**Metadata:**
- **Severity**: Critical (arbitrary proof forgery)
- **Found by**: OSEC research team
- **Disclosed**: March 3, 2026
- **Affected**: Jolt, Nexus, Cairo-M, Ceno, Expander, Binius64

**Root Cause:**

Fiat-Shamir transformation yêu cầu: "mọi giá trị ảnh hưởng đến verifier equation phải được hash vào transcript **trước khi** challenge tương ứng được sample."

Trong tất cả 6 systems, **public claim values** (input/output của chương trình) chưa được absorb vào Fiat-Shamir transcript trước khi challenges được derive. Điều này biến public values thành "biến tự do" trong verification equations.

```python
# Simplified verification flow với bug:
transcript = Hash()
transcript.absorb(proof_commitments)  # OK

challenge = transcript.squeeze()      # Sample challenge
# BUG: Public claims chưa được absorb!

# Verification equation (linear case):
# a * H + b = expected_eval
# where a, b determined by transcript (independent of H)
# H = public claim (statement about input/output)
# 
# H is FREE — attacker can choose H to satisfy equation!

# Attack: Solve for H:
# H = (expected_eval - b) / a
# Any H satisfying this passes verification!
```

**Attack cho LogUp-based systems (Jolt, Nexus, ...):**

```python
# LogUp accumulator: prover provides claimed_sum values per-chip
# These feed into verification equations
# If claimed_sum not in transcript before challenge sampling:
#   → claimed_sum is attacker-controlled
#   → Solve system: sum(claimed_sum_i) = 0 with desired public_values
```

**Discovery Methodology:** OSEC team:
1. Đọc Fiat-Shamir implementation cẩn thận, track khi nào mỗi value được absorb
2. Xác định transcript ordering: public claims → challenges → trong hay sau?
3. Verify: nếu public claims absorb *sau* challenges → biến tự do
4. Build PoC algebraic attack: giải system equations để forge claim

**Lesson Learned:** Fiat-Shamir transcript ordering là **non-negotiable invariant**. Khi audit proof system backend, trace every value appearing in a verifier check equation và verify nó was absorbed before the relevant challenge was sampled.

---

## CVE 5 — GHSA-5xgj: Risc0 ZK Property Advisory

**Metadata:**
- **ID**: GHSA-5xgj-pmjj-gw49
- **Severity**: Low (không break soundness/completeness)
- **Research by**: Ulrich Habock và Al Kindi
- **Context**: Affects Risc0 STARK ZK property

**Root Cause:**

Một số STARK implementations (bao gồm Risc0) không đáp ứng định nghĩa **strict zero-knowledge** trong tất cả threat models. Cụ thể: prover transcript có thể leak information về private inputs trong một số query patterns.

**Impact Assessment:**

Đây là **academic finding**, không phải practical exploit. Implications:
- Soundness: **Không bị ảnh hưởng** — attacker không thể forge proofs
- Completeness: **Không bị ảnh hưởng** — honest prover hoạt động bình thường
- Privacy (ZK property): Potentially affected cho applications cần **strong privacy guarantees**

**Ứng dụng bị ảnh hưởng**: Chỉ những ứng dụng cần *strict* ZK property — ví dụ: systems nơi proof của một computation nên không leak bất kỳ thông tin nào về private inputs, ngay cả khi adversary có thể query nhiều proofs.

**Ứng dụng KHÔNG bị ảnh hưởng**: ~99% use cases của Risc0 chỉ cần *computational integrity* (verify execution đúng), không cần strict ZK property.

**Lesson Learned:** Phân biệt giữa **soundness** bugs (attacker forge proof) và **ZK property** bugs (privacy leak). Chúng có impact khác nhau hoàn toàn và cần prioritization khác nhau.

---

## Bảng tóm tắt CVEs

| CVE / Finding | System | Layer | Class | Severity | Discovery Method |
|---------------|--------|-------|-------|----------|-----------------|
| CVE-2025-52484 | Risc0 v2.0.x | Circuit | Underconstrained | Critical | Manual + ARGUZZ |
| V-RISC0-VUL-001 | Risc0 V2 | Circuit | Underconstrained | High | Picus (automated) |
| V-RISC0-VUL-006/007 | Risc0 V2 | Circuit | Underconstrained | Medium | Picus (automated) |
| SP1 LambdaClass | SP1 v3.4.0 | Frontend+Circuit | Compound | Critical | Manual code review |
| Unfaithful Claims | 6 zkVMs | Backend | Fiat-Shamir | Critical | Protocol analysis |
| GHSA-5xgj | Risc0 | Backend | ZK Property | Low | Academic research |

---

## Summary

- **CVE-2025-52484**: Missing constraint trong 3-register instructions — rs1/rs2 không được forced từ instruction encoding. Critical → fix bằng `ReadSourceRegs` component.
- **ExpandU32**: `NondetTwitReg` thay vì `NondetBitReg` → multiple bit decompositions. Picus tìm tự động.
- **SP1 LambdaClass**: Hai bugs kết hợp (COMMIT deferred + is_complete không enforce next_pc=0) → forge arbitrary proof.
- **Unfaithful Claims**: Public claims không absorbed vào Fiat-Shamir transcript trước challenges → biến tự do → forge proof.
- **GHSA-5xgj**: ZK property (không phải soundness) — low practical impact.

---

## References

- CVE-2025-52484 Advisory: https://github.com/risc0/risc0/security/advisories/GHSA-g3qg-6746-3mg9
- HackenProof writeup: https://hackenproof.com/blog/for-hackers/risc-zero-zkvm-missing-constraint-vulnerability
- Veridise Risc0 Audit Report: https://veridise.com/wp-content/uploads/2025/04/VAR-Risc0-241028-Round2-V4.pdf
- Veridise Blog: https://veridise.com/blog/audit-insights/risc-zeros-zk-vm-security-how-veridise-enabled-risc-zero-to-achieve-provable-continuous-zk-security/
- LambdaClass SP1 Disclosure (Dec 2025): https://blog.lambdaclass.com/responsible-disclosure-of-an-exploit-in-succincts-sp1-zkvm-found-in-partnership-with-3mi-labs-and-aligned-which-arises-from-the-interaction-of-two-distinct-security-vulnerabilities/
- OSEC Unfaithful Claims (Mar 2026): https://osec.io/blog/2026-03-03-zkvms-unfaithful-claims/
- GHSA-5xgj Advisory: https://github.com/risc0/risc0/security/advisories/GHSA-5xgj-pmjj-gw49
- ARGUZZ Paper: https://arxiv.org/pdf/2509.10819
