---
title: "08. Circuit Bugs in zkVM"
tags: [zk, zkvm, security, circuit-bugs, underconstrained, AIR, Zirgen, lesson-08]
aliases: [Circuit Bugs in zkVM]
created: 2026-03-13
---

> **Prerequisites**: [[06-zk-bug-taxonomy|06. ZK Bug Taxonomy]], [[04-risc0-deep-dive|04. Risc0 Deep Dive]], [[05-sp1-deep-dive|05. SP1 Deep Dive]]
> **Objectives**:
> - Hiểu anatomy chi tiết của circuit bugs trong Zirgen (Risc0) và AIR chips (SP1)
> - Phân tích từng bug thực tế: CVE-2025-52484, ExpandU32, Poseidon2, ARGUZZ bugs
> - Biết pattern nhận diện underconstrained bugs khi đọc Zirgen/AIR constraint code
> - Hiểu kỹ thuật phát hiện: Picus formal verification, ARGUZZ fuzzing, manual audit

---

## Motivation

Circuit bugs là class chiếm ~97% trong tất cả circuit-layer vulnerabilities và thường là **Critical severity**. Đây là layer mà toàn bộ security guarantee của zkVM phụ thuộc vào — nếu circuit sai, mọi application dùng zkVM đó đều có thể bị tấn công, bất kể application code có đúng đến đâu.

Trong bài này ta sẽ mổ xẻ các bug thực tế, học cách đọc Zirgen/AIR code để tìm chúng.

---

## Anatomy của Circuit Bug — Underconstrained

> [!definition] Definition 8.1 — Determinism vs Underconstrainedness
> Một circuit constraint system được gọi là **deterministic** nếu với mỗi input, chỉ tồn tại **đúng một** witness thỏa mãn toàn bộ constraints.
>
> Ngược lại, nếu tồn tại nhiều witness cho cùng một input, circuit là **underconstrained** và prover có thể chọn witness nào có lợi cho mình.
>
> Picus (Veridise) tự động hóa kiểm tra tính determinism này qua SMT solving.

**Mô hình toán học:**

Cho constraint system $\mathcal{C}$ với public input $x$ và witness (intermediate variables) $w$:

$$\mathcal{C}(x, w) = 0$$

- **Deterministic (đúng)**: $\forall x,\ \exists! w : \mathcal{C}(x, w) = 0$
- **Underconstrained (lỗi)**: $\exists x,\ \exists w_1 \neq w_2 : \mathcal{C}(x, w_1) = 0 \land \mathcal{C}(x, w_2) = 0$

Prover tạo proof cho $(x, w_2)$ nhưng claim output của $w_1$ — verifier accept vì không thể phân biệt.

---

## Cách đọc Zirgen (Risc0 Circuit DSL)

Trước khi xem bug thực tế, cần hiểu cú pháp Zirgen:

```text
// Zirgen syntax — định nghĩa một "component" (tương đương AIR row constraint)

component MyComp(input: Val) {
    // Declare intermediate registers (witnesses)
    reg := NondetReg();           // nondeterministic register (prover cung cấp)
    bit := NondetBitReg();        // nondeterministic, constrained: ∈ {0,1}
    twit := NondetTwitReg();      // nondeterministic, constrained: ∈ {0,1,2,3}

    // Constraints — polynomial equations must hold
    reg * (reg - 1) = 0;          // manually constrain reg to {0,1}
    input = bit * 2 + reg;        // define relationship

    // Return value
    reg
}
```

**Hai loại registers trong Zirgen:**
- `NondetReg()` — Prover có thể gán bất kỳ giá trị field element nào. **Không có implicit constraint**.
- `NondetBitReg()` — Auto-constrained: $x \cdot (x-1) = 0$, tức $x \in \{0, 1\}$.
- `NondetTwitReg()` — Auto-constrained: $x \cdot (x-1) \cdot (x-2) \cdot (x-3) = 0$, tức $x \in \{0, 1, 2, 3\}$.

**Bug pattern phổ biến nhất**: Dùng `NondetReg()` khi cần `NondetBitReg()` → thiếu range constraint.

---

## Bug 1 — ExpandU32: NondetTwitReg vs NondetBitReg

Đây là bug đầu tiên Veridise phát hiện trong Risc0 V2 circuit (V-RISC0-VUL-001).

> [!danger] Danger 8.2 — ExpandU32 Underconstrained (Veridise 2024)
>
> **Component**: `ExpandU32` — chuyển đổi một `ValU32` (32-bit value) thành 4 bytes rồi 32 bits.
>
> **Bug**: Các field trong component dùng `NondetTwitReg()` (range {0,1,2,3}) thay vì `NondetBitReg()` (range {0,1}).
>
> ```text
> // BUG — Zirgen code bị lỗi (simplified)
> component ExpandU32(x: ValU32, signed: Val) {
>     // ...
>     _rd_0 := NondetTwitReg();  // BUG: should be NondetBitReg()
>     _rd_1 := NondetTwitReg();  // BUG: should be NondetBitReg()
>     // constraints using _rd_0, _rd_1 ...
>     // ... nhưng _rd_0 ∈ {0,1,2,3} thay vì {0,1}
> }
>
> // FIX
> component ExpandU32(x: ValU32, signed: Val) {
>     _rd_0 := NondetBitReg();   // FIXED: _rd_0 ∈ {0,1}
>     _rd_1 := NondetBitReg();   // FIXED: _rd_1 ∈ {0,1}
>     // ...
> }
> ```
>
> **Impact**: Prover có thể set `_rd_0 = 2` hoặc `3`, khiến bit decomposition sai → arithmetic operations trên giá trị này có thể trả về sai → soundness break trong bất kỳ instruction nào dùng ExpandU32.

---

## Bug 2 — CVE-2025-52484: rs1/rs2 Confusion trong 3-Register Instructions

Đây là bug bounty critical nhất được tìm thấy trong Risc0, được Christoph "zkCrusher" Hochrainer report ngày 15/5/2025.

> [!danger] Danger 8.3 — CVE-2025-52484: Missing rs1≠rs2 Constraint
>
> **Affected versions**: risc0-zkvm 2.0.0, 2.0.1, 2.0.2
>
> **Root cause**: Circuit xử lý 3-register RISC-V instruction (`op rd, rs1, rs2`) không enforce constraint rằng `rs1` và `rs2` được đọc từ đúng bit-field trong instruction word.

**Anatomy của RISC-V 3-register instruction format:**

```text
R-type instruction (32 bits):
| funct7 | rs2  | rs1  | funct3 | rd   | opcode |
| 31..25 | 24..20 | 19..15 | 14..12 | 11..7 | 6..0 |

ADD x5, x1, x2:
  rd  = x5 (bits [11:7])
  rs1 = x1 (bits [19:15])
  rs2 = x2 (bits [24:20])
```

**Bug trong circuit:**

```text
// BUG (simplified Zirgen) — trong DivInput, MulInput, MiscInput, MemStoreInput
component DivInput(inst: Val, ...) {
    rs1_val := NondetReg();   // Prover cung cấp giá trị rs1
    rs2_val := NondetReg();   // Prover cung cấp giá trị rs2

    // Constraint: rs1_val phải match giá trị register được chỉ định bởi inst[19:15]
    // Constraint: rs2_val phải match giá trị register được chỉ định bởi inst[24:20]

    // BUG: Không có constraint ngăn rs1_idx == rs2_idx
    // Prover có thể set rs2_val = rs1_val ngay cả khi inst[24:20] != inst[19:15]
}

// FIX — Zirgen PR #238: Giới thiệu ReadSourceRegs component
component ReadSourceRegs(inst: Val, regs: RegFile) {
    rs1_idx := extract_bits(inst, 19, 15);
    rs2_idx := extract_bits(inst, 24, 20);

    // Explicit constraint: nếu rs1 == rs2, chỉ read một lần
    // Nếu rs1 != rs2, read cả hai, và verify chúng khác nhau
    same := NondetBitReg();
    same * (rs1_idx - rs2_idx) = 0;          // nếu same=1 thì rs1_idx = rs2_idx
    (1 - same) * check_different(...) = 0;   // nếu same=0 thì phải verify khác
}
```

**Attack scenario:**

```rust
// Guest code — sử dụng REMU (remainder unsigned)
let a: u64 = io::read();  // 100
let b: u64 = io::read();  // 7
let result = a % b;
io::commit(&result);      // Expected: 2

// Malicious prover exploit:
// 1. Bypass guest entirely
// 2. Trong circuit trace, set rs1 = rs2 = a cho REMU instruction
// 3. result = a % a = 0 trong circuit, nhưng claim result = 50000
// 4. Proof verifies vì circuit không check rs1 vs rs2 source
// → Verifier accept result = 50000 dù thực tế a % b = 2
```

**Fix được apply tại:**
- `zirgen/pull/238` — Circuit fix: `ReadSourceRegs` component mới
- `risc0/pull/3181` — Rust/C++/CUDA emulator fix
- On-chain verifiers: estop mechanism vô hiệu hóa v2.0.x verifiers tự động

---

## Bug 3 — Poseidon2 Precompile Bugs (V-RISC0-VUL-006/007)

> [!danger] Danger 8.4 — Poseidon2 External Call Underconstrained
>
> **Findings**: V-RISC0-VUL-006 và V-RISC0-VUL-007 — cả hai medium severity, phát hiện bởi Picus.
>
> **Root cause**: Trong circuit xử lý Poseidon2 hash precompile, một số intermediate values trong external call interface bị `NondetReg()` mà không có đủ constraint để tie chúng với computation thực tế.
>
> **Impact**: Prover có thể forge kết quả Poseidon2 hash trong một số edge cases. Vì Poseidon2 được dùng trong Merkle tree commitments của Risc0, đây là attack surface cho Merkle proof forgery.
>
> **Lesson**: Precompile circuits không chỉ là optimization — chúng là security-critical components. Mỗi precompile cần audit circuit riêng.

---

## Bug 4 — ARGUZZ Bugs trong Risc0 và Jolt

ARGUZZ (Hochrainer et al. 2025) — tool fuzzing zkVMs bằng fault injection — phát hiện thêm bugs:

> [!danger] Danger 8.5 — ARGUZZ Bug #3 (Risc0): LUI Instruction
>
> **Instruction**: `LUI rd, imm` — Load Upper Immediate: `rd = imm << 12`
>
> **Bug**: Thiếu constraint enforce rằng immediate operand (bits [31:12] của instruction) được decode đúng. Prover có thể thay đổi immediate value → control `rd` tùy ý.
>
> **Discovery**: ARGUZZ fault injection — inject thay đổi immediate, verify accept với output khác expected.
>
> **Fix**: Coordinated fix qua cả main Risc0 repo và Zirgen repo (hai repos riêng biệt phải sync).

> [!danger] Danger 8.6 — ARGUZZ Bug (Jolt): LUI Instruction
>
> Tương tự bug LUI trong Risc0, Jolt cũng có underconstrained LUI instruction. Bug này được phát hiện độc lập bởi ARGUZZ — cho thấy cùng một class bug có thể xuất hiện trong nhiều zkVM implementations.

---

## Cách đọc SP1 AIR Chip để tìm Circuit Bug

Trong SP1, circuits được viết dưới dạng Rust code implement trait `Air`:

```rust
// SP1 AIR chip structure (simplified)
pub struct AddSubChip;

impl<F: PrimeField32> Air<AB> for AddSubChip {
    fn eval(&self, builder: &mut AB) {
        let main = builder.main();
        let local = main.row_slice(0);  // current row
        
        // Đọc witnesses từ trace columns
        let a: AB::Var = local[COL_A];       // input a
        let b: AB::Var = local[COL_B];       // input b  
        let result: AB::Var = local[COL_RES]; // claimed result
        let carry: AB::Var = local[COL_CARRY]; // carry bit

        // CONSTRAINT 1: result = a + b (mod 2^32)
        // Phân tích carry để handle overflow
        builder.assert_eq(
            result + carry * AB::Expr::from_canonical_u32(1 << 16),
            a + b
        );

        // CONSTRAINT 2: carry là bit
        // Nếu thiếu dòng này → UNDERCONSTRAINED
        builder.assert_bool(carry);  // carry ∈ {0,1}
    }
}
```

**Pattern tìm bug trong SP1 AIR chips:**

1. Tìm tất cả columns được read từ `local[COL_*]` — đây là witnesses prover cung cấp
2. Kiểm tra mỗi witness có constraint không: `assert_bool`, `assert_eq`, range check
3. Kiểm tra cross-table lookup constraints — mỗi chip emit event có được chip kia consume không

---

## Bug 5 — SP1 LambdaClass Exploit (Dec 2025): is_complete Flag

Đây là một frontend/circuit interaction bug được 3MI Labs + Aligned + LambdaClass phát hiện và disclose tháng 12/2025.

> [!danger] Danger 8.7 — SP1 Early Halt + is_complete Bypass
>
> **Version affected**: sp1-sdk 3.4.0 và trước đó
>
> **Bug 1 — COMMIT deferred**: Khi guest gọi `io::commit()`, COMMIT syscalls được **delay** đến khi `main()` return. Nếu malicious executor **dừng execution trước khi `main()` return** (bằng cách set `next_pc` tới đầu `main()`), tất cả COMMIT syscalls không được emit → `committed_value_digest` ở all-zero, không bị constrain.
>
> **Bug 2 — is_complete không enforce next_pc=0**: Khi `is_complete = true` (shard cuối của execution), circuit SP1-2.2 **không enforce** `next_pc == 0`. Một malicious executor có thể set `is_complete = true` với `next_pc != 0` → CompressProver không phát hiện.
>
> **Combined exploit**:
> 1. Executor dừng program trước khi `main()` return, set `next_pc = start_of_main`
> 2. Set `is_complete = true` (circuit không check next_pc=0)
> 3. `committed_value_digest = 0` (không bị constrain)
> 4. Claim bất kỳ `public_values` nào — proof verifies!
>
> **PoC được demo**: Prove rằng 42 là số nguyên tố (clearly sai) với valid SP1 proof.

```rust
// Vulnerable execution scenario:
// 1. Guest program: is_prime(42) → should commit(false)
// 2. Malicious executor:
//    - Run until just before return of main()
//    - Force halt with next_pc = start_of_main (loop back)
//    - Set is_complete = true despite next_pc != 0
// 3. committed_value_digest = [0,0,...,0] (unconstrained)
// 4. Craft proof claiming public_values = [true] (42 is prime)
// 5. Honest verifier accepts! ← SOUNDNESS BREAK
```

**Fix**: SP1 Turbo (v4.0.0) — patches assertions về complete execution trong recursion layer.

---

## Các Pattern Nhận Diện Circuit Bug Khi Audit

Khi đọc circuit code (Zirgen / AIR Rust), tìm các pattern sau:

**Pattern 1 — Orphan NondetReg:**
```text
x := NondetReg();
// ... x được dùng trong constraints khác ...
// Nhưng KHÔNG có constraint ràng buộc range của x!
```
→ Hỏi: prover có thể set x = bất kỳ field element nào không? Nếu có → underconstrained.

**Pattern 2 — Missing Boolean Check:**
```text
flag := NondetReg();
result <== flag * a + (1 - flag) * b;
// BUG: Không có flag * (1 - flag) = 0
// Prover set flag = 2 → result = 2a - b (không phải a hoặc b)
```

**Pattern 3 — Conditional Logic Without All Branch Constraints:**
```text
if opcode == ADD {
    rd <== rs1 + rs2;  // Constraint cho ADD
}
// BUG: Khi opcode != ADD, rd không bị constrain!
// Prover có thể set rd = bất kỳ giá trị nào khi opcode != ADD
```

**Pattern 4 — Cross-table Lookup Miss:**
```text
// CPU chip emit: event(ADD, rs1=5, rs2=3, rd=8)
// AddSubChip: không có corresponding row cho event này
// BUG: Nếu lookup không enforce, CPU chip claim và AddSubChip không sync
```

**Pattern 5 — is_complete / terminal constraint thiếu:**
```text
// Trong shard cuối execution:
// BUG: Không enforce next_pc = 0 khi is_complete = true
// Prover set is_complete = true với next_pc trỏ đâu đó khác
```

---

## Công cụ Detection

**Picus (Veridise)** — Formal verification tool:
- Encode circuit constraints thành polynomial system
- Dùng SMT solver kiểm tra determinism
- Kết quả: "deterministic" (no underconstrained) hoặc counterexample
- Đã dùng cho Keccak accelerator và rv32im của Risc0

**ARGUZZ** — Fuzzing tool:
- Fault injection vào prover execution
- So sánh output giữa honest và malicious prover
- Phát hiện cả soundness và completeness bugs

**Manual audit** — Không thể thay thế hoàn toàn:
- Overconstrained bugs thường không bị detect bởi automated tools
- Semantic mismatch (circuit đúng về math nhưng implement sai RISC-V spec) cần manual review

---

## Summary

- **Circuit bugs = underconstrained** trong ~97% trường hợp — prover có thể chọn witness khác "đúng".
- **Zirgen**: `NondetReg()` là source phổ biến nhất — không có implicit constraint. Dùng `NondetBitReg()` hoặc thêm constraint thủ công.
- **CVE-2025-52484**: rs1/rs2 confusion trong 3-register instructions — thiếu constraint "rs1 và rs2 được decode từ đúng bit-field".
- **SP1 LambdaClass bug**: early halt + `is_complete` không enforce `next_pc=0` → committed values unconstrained.
- **Poseidon2 bugs**: Precompile circuits cần audit riêng — không phải chỉ vì optimization mà cũng là attack surface.
- **Picus** là tool formal verification tốt nhất hiện tại cho underconstrained detection; ARGUZZ cho fuzzing.

---

## References

- CVE-2025-52484 / GHSA-g3qg-6746-3mg9: https://github.com/risc0/risc0/security/advisories/GHSA-g3qg-6746-3mg9
- HackenProof — Circuit Breaker: The Missing Constraint That Compromised RISC Zero: https://hackenproof.com/blog/for-hackers/risc-zero-zkvm-missing-constraint-vulnerability
- Veridise — Risc0 zkVM Security Audit Report: https://veridise.com/wp-content/uploads/2025/04/VAR-Risc0-241028-Round2-V4.pdf
- Veridise Blog — RISC Zero's ZK-VM Security: https://veridise.com/blog/audit-insights/risc-zeros-zk-vm-security-how-veridise-enabled-risc-zero-to-achieve-provable-continuous-zk-security/
- RISC Zero — Path to First Formally Verified RISC-V zkVM: https://risczero.com/blog/RISCZero-formally-verified-zkvm
- LambdaClass — SP1 Exploit Disclosure (Dec 2025): https://blog.lambdaclass.com/responsible-disclosure-of-an-exploit-in-succincts-sp1-zkvm-found-in-partnership-with-3mi-labs-and-aligned-which-arises-from-the-interaction-of-two-distinct-security-vulnerabilities/
- Hochrainer et al. — ARGUZZ: Testing zkVMs for Soundness and Completeness Bugs: https://arxiv.org/pdf/2509.10819
