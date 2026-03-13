---
title: "12. Circuit-Level Bugs — Under/Over-Constrained, PoC"
tags: [cryptography, zk-hash, circuit-bugs, underconstrained, circom, halo2, lesson-12]
aliases: [Circuit Level Bugs ZK]
created: 2026-03-13
---

> **Prerequisites**: [[02-zk-proof-systems-circuits|02. ZK Proof Systems & Arithmetic Circuits]], [[06-poseidon-implementations|06. Poseidon Implementations]], quen Circom syntax
> **Objectives**:
> - Phân biệt underconstrained (soundness bug) vs overconstrained (completeness bug)
> - Nắm 6 bug patterns phổ biến nhất trong ZK hash circuits
> - Có khả năng viết PoC exploit cho underconstrained circuit
> - Hiểu cách Halo2's assign-vs-constrain gap tạo ra bugs

---

## Motivation

> "Over 80% of findings in ZK audit reports are traced back to the circuit layer."
> — Kudelski Security Research, 2024

Circuit-level bugs là category lớn nhất và thường có impact cao nhất trong ZK security. Một underconstrained bug có thể cho phép malicious prover tạo proof cho invalid statement — tức là "chứng minh điều sai". Với ZK rollups hay privacy protocols, điều này có thể dẫn đến mất tiền thực.

Bài này tập trung vào **hash-related circuit bugs** đặc thù, nhưng nhiều patterns cũng apply cho ZK circuits nói chung.

---

## Taxonomy: Ba loại Circuit Bugs

> [!definition] Definition 12.1 — Circuit Bug Taxonomy
>
> **Underconstrained (Soundness Bug)**
> Circuit $C(x, w)$ underconstrained nếu tồn tại input $x$ và hai witnesses khác nhau $w \neq w'$ sao cho $C(x, w)$ và $C(x, w')$ đều valid.
> → Malicious prover có thể chứng minh statement sai.
>
> **Overconstrained (Completeness Bug)**
> Circuit từ chối valid witness — honest prover không thể generate proof dù statement đúng.
> → Denial-of-service, không thể rút tiền, bridge bị kẹt.
>
> **Computation Error (Incorrect Logic)**
> Circuit compute sai giá trị — không phản ánh đúng intended semantics.
> → Output sai nhưng proof "hợp lệ" về mặt circuit.

---

## Bug Pattern 1 — Circom `<--` thay vì `<==`

Đây là lỗi phổ biến và nguy hiểm nhất trong Circom. Năm 2019, lỗi này gần như drain được Tornado Cash.

> [!definition] Definition 12.2 — Circom Operators
> - `<==`: **Assign AND constrain** — tạo R1CS constraint $a \cdot b = c$
> - `<--`: **Assign ONLY** — chỉ set giá trị trong witness, KHÔNG tạo constraint
> - `===`: **Constrain only** — tạo constraint mà không assign

```circom
// Ví dụ: MiMC hash trong circuit
// Reproduce từ incident thực tế (simplified)

template MiMCHashInsecure(rounds) {
    signal input x;
    signal output out;

    signal s[rounds + 1];
    s[0] <== x;

    for (var i = 0; i < rounds; i++) {
        // Tính s[i]^3 + c[i]
        signal tmp;
        // BUG: dùng <-- thay vì <==
        tmp <-- s[i] * s[i];          // Assign, nhưng KHÔNG constrain
        s[i+1] <-- tmp * s[i];        // Assign, nhưng KHÔNG constrain
        // ^^^ Malicious prover có thể set s[i+1] = BẤT KỲ GIÁ TRỊ nào!
    }

    out <== s[rounds];  // Output là underconstrained!
}

// FIX đúng:
template MiMCHashCorrect(rounds) {
    signal input x;
    signal output out;

    signal s[rounds + 1];
    s[0] <== x;

    for (var i = 0; i < rounds; i++) {
        signal tmp;
        tmp <== s[i] * s[i];          // ĐÚNG: constrain x^2
        s[i+1] <== tmp * s[i];        // ĐÚNG: constrain x^3
    }

    out <== s[rounds];
}
```

**Tornado Cash bug (2019)**:
```circom
// Trong MiMC circomlib (phiên bản cũ):
// Bug: outs[0] = S[nInputs - 1].xL_out;   (= không tạo constraint)
// Fix: outs[0] <== S[nInputs - 1].xL_out; (<== tạo constraint)
```

Tác giả bug đã dùng `=` (JavaScript-style assignment) thay vì `<==` (Circom constraint). Kết quả: output của MiMC hash hoàn toàn không bị ràng buộc — malicious prover có thể claim bất kỳ hash value nào.

**PoC exploit**:
```python
# Giả sử circuit: IsEqualToHash(preimage, hash)
# Bug: hash output không bị constrain

# Honest prover:
# witness = {preimage: secret, hash: H(secret)}

# Malicious prover (exploit):
# witness = {preimage: random_garbage, hash: target_hash}
# Proof vẫn verify vì hash signal không bị constrain!

def exploit_underconstrained_hash(target_hash, any_preimage):
    """
    PoC: Submit proof với fake preimage nhưng target hash
    """
    fake_witness = {
        "preimage": any_preimage,
        "hash": target_hash,  # Giả mạo — nhưng circuit không check!
    }
    # Circuit sẽ accept vì không có constraint liên kết preimage với hash
    return fake_witness

print("PoC: Exploit underconstrained hash output")
print("Target hash: 0xdeadbeef...")
print("Fake witness:", exploit_underconstrained_hash("0xdeadbeef", 12345))
```

---

## Bug Pattern 2 — Missing Range Check (Overflow)

ZK circuits làm việc trong trường $\mathbb{F}_p$. Khi circuit nhận input từ user và dùng nó như "integer" (ví dụ: số balance), **không có range check** là critical bug.

```circom
// BUG: Không có range check trên balance
template WithdrawBuggy(n) {
    signal input oldBal;    // Giả sử là 32-bit integer
    signal input amount;
    signal input newBal;    // PUBLIC OUTPUT

    // Kiểm tra amount <= oldBal
    component le = LessThan(n);
    le.in[0] <== amount;
    le.in[1] <== oldBal;
    le.out === 1;

    // Compute new balance
    signal computedNew;
    computedNew <== oldBal - amount;

    // BUG: computedNew KHÔNG được constrain bằng newBal!
    // Prover có thể set newBal = BẤT KỲ GIÁ TRỊ
}

// FIX:
template WithdrawCorrect(n) {
    signal input oldBal;
    signal input amount;
    signal input newBal;

    component le = LessThan(n);
    le.in[0] <== amount;
    le.in[1] <== oldBal;
    le.out === 1;

    // PHẢI constrain output bằng computed value
    newBal === oldBal - amount;  // Ràng buộc!
}
```

**Range check bug đặc biệt với modular arithmetic**:
```circom
// BUG: amount có thể = p-1 (tức -1 mod p) -> amount + 1 = 0 (overflow!)
// LessThan(32) chỉ đảm bảo input trong 32 bits nếu input đã được range-check trước

// Attack: oldBal = 100, amount = p-1 (rất lớn nhưng = -1 mod p)
// In F_p: amount <= oldBal? Phụ thuộc implementation LessThan!
// Nếu LessThan dùng bit decomposition: p-1 cần 254 bits, không fit trong 32 bits
// => Constraint REVERT, không thể prove — nhưng nếu bug khác, có thể bypass

// Range check đúng cách:
template RangeChecked(n) {
    signal input in;
    component n2b = Num2Bits(n);
    n2b.in <== in;
    // Sau khi qua Num2Bits(32), signal được đảm bảo trong [0, 2^32)
}
```

---

## Bug Pattern 3 — Không ràng buộc Component Output

Khi sử dụng Circom templates (components), **phải explicitly constrain output** của component.

```circom
// BUG: Tạo component nhưng không dùng output
template PoseidonHashBuggy() {
    signal input a;
    signal input b;
    signal output isEqual;

    // Tính hash(a)
    component h1 = Poseidon(1);
    h1.inputs[0] <== a;
    // h1.out tính toán đúng, nhưng không được dùng để constrain isEqual!

    // Tính hash(b)
    component h2 = Poseidon(1);
    h2.inputs[0] <== b;

    // BUG: isEqual được assign trực tiếp mà không liên kết với h1, h2
    isEqual <-- (a == b) ? 1 : 0;  // Chỉ witness generation!
    isEqual * (isEqual - 1) === 0;  // Check isEqual in {0, 1}

    // THIẾU: không constrain isEqual = (h1.out == h2.out)
    // Malicious prover có thể set isEqual = 1 ngay cả khi h1.out != h2.out
}

// FIX:
template PoseidonHashCorrect() {
    signal input a;
    signal input b;
    signal output isEqual;

    component h1 = Poseidon(1);
    h1.inputs[0] <== a;

    component h2 = Poseidon(1);
    h2.inputs[0] <== b;

    // Constrain isEqual thông qua IsEqual component
    component eq = IsEqual();
    eq.in[0] <== h1.out;
    eq.in[1] <== h2.out;
    isEqual <== eq.out;  // Properly constrained!
}
```

---

## Bug Pattern 4 — Hash Output Convention Mismatch

Đặc thù cho hash circuits: Khi hai components dùng Poseidon nhưng với **output convention khác nhau**, verification sẽ luôn fail hoặc luôn pass không đúng.

```circom
// Ví dụ: Merkle tree verifier
// Off-chain code dùng Poseidon với output = state[1] (rate element)
// On-chain Circom dùng Poseidon output = state[0] (capacity element)

// Kết quả: Off-chain Merkle root KHÁC với on-chain computed root
//          => Legitimate proofs bị reject (completeness bug)
//          => Hoặc tệ hơn: invalid proofs được accept nếu bug ngược lại

// Pattern phát hiện trong audit:
// 1. Test vector mismatch giữa off-chain và on-chain
// 2. Circuit verify fails với "valid" proofs

// CÁCH KIỂM TRA:
// Chạy test với known input/output từ reference implementation
// Verify cả hai bên (JS prover và Circom verifier) cho cùng kết quả
```

---

## Bug Pattern 5 — Insufficient Constraint Count

Circomspect và manual review đếm số constraints. Một circuit thiếu constraints thường underconstrained:

```python
# Script tính expected constraint count cho Poseidon
def expected_poseidon_constraints(t, R_F, R_P, alpha=5):
    """
    Expected R1CS constraints cho Poseidon permutation
    """
    # Mỗi S-box x^5 cần 3 constraints (x^2, x^4, x^5)
    # Full round: t S-boxes = 3t constraints
    # Partial round: 1 S-box = 3 constraints
    # MDS và ARC: free (linear)

    full_round_constraints = R_F * t * 3
    partial_round_constraints = R_P * 3
    total = full_round_constraints + partial_round_constraints

    return total

# BN254, t=3, R_F=8, R_P=57
expected = expected_poseidon_constraints(3, 8, 57)
print(f"Expected constraints cho Poseidon(t=3): {expected}")  # = 243

# Nếu actual constraints khi compile = 200 < 243:
# Có thể đã bỏ qua một số rounds -> SECURITY BUG
# Hoặc dùng optimization không đúng -> cần verify

# Tool: circomspect --circom circuit.circom
# Output: "Number of constraints: X"
# Red flag: X << expected
```

---

## Bug Pattern 6 — Halo2 Assign vs Constrain Gap

Halo2 tách biệt hoàn toàn **assignment** (điền witness) và **constraining** (tạo polynomial equation). Đây là nguồn gốc của nhiều bugs khó phát hiện.

```rust
// Halo2 chip structure
// ĐÚNG vs SAI

// SAI: Assign nhưng quên constrain
fn assign_buggy(
    &self,
    mut layouter: impl Layouter<F>,
    hash_input: AssignedCell<F, F>,
) -> Result<AssignedCell<F, F>, Error> {
    layouter.assign_region(|| "poseidon", |mut region| {
        // Assign output value
        let output = region.assign_advice(
            || "hash output",
            self.config.output,
            0,
            || hash_input.value().map(|x| poseidon_native(*x)),
        )?;

        // BUG: Không enable selector -> custom gate không được kích hoạt!
        // self.config.s_poseidon.enable(&mut region, 0)?;  // THIẾU DÒNG NÀY

        Ok(output)
    })
}

// ĐÚNG: Assign VÀ constrain
fn assign_correct(
    &self,
    mut layouter: impl Layouter<F>,
    hash_input: AssignedCell<F, F>,
) -> Result<AssignedCell<F, F>, Error> {
    layouter.assign_region(|| "poseidon", |mut region| {
        let output = region.assign_advice(
            || "hash output",
            self.config.output,
            0,
            || hash_input.value().map(|x| poseidon_native(*x)),
        )?;

        // ĐÚNG: Enable selector để kích hoạt polynomial gate
        self.config.s_poseidon.enable(&mut region, 0)?;

        // ĐÚNG: Copy constraint liên kết input với hash computation
        hash_input.copy_advice(
            || "hash input",
            &mut region,
            self.config.input,
            0,
        )?;

        Ok(output)
    })
}
```

**Halo2 MockProver** — công cụ debug quan trọng:

```rust
// Dùng MockProver để detect underconstrained trong development
#[cfg(test)]
mod tests {
    use halo2_proofs::dev::MockProver;

    #[test]
    fn test_poseidon_circuit() {
        let k = 10;  // circuit size
        let circuit = PoseidonCircuit { input: Fp::from(42) };
        let expected_output = poseidon_native(Fp::from(42));

        let prover = MockProver::run(k, &circuit, vec![vec![expected_output]]).unwrap();

        // Kiểm tra tất cả constraints satisfied
        prover.verify().expect("constraints should be satisfied");

        // TEST THÊM: Thử với wrong output -> phải fail
        let wrong_circuit = PoseidonCircuit { input: Fp::from(42) };
        let prover_wrong = MockProver::run(k, &wrong_circuit,
            vec![vec![Fp::from(0)]]).unwrap();
        // Nếu verify() SUCCEED với wrong output -> UNDERCONSTRAINED BUG
        assert!(prover_wrong.verify().is_err(),
            "Should reject wrong output — if this passes, circuit is underconstrained!");
    }
}
```

---

## Công cụ Static Analysis

```bash
# 1. Circomspect (Trail of Bits) — static analyzer cho Circom
cargo install circomspect
circomspect circuit.circom

# Tìm: underconstrained signals, non-quadratic constraints,
#       unused outputs, missing constraints

# 2. ZKAP — detector patterns
# github.com/whbjzzwjxxzwh/ZKAP

# 3. Circomscribe — visualize constraints
# circomscribe.xyz — paste code, xem từng signal bị constrain hay không

# 4. Halo2-analyzer (Korrekt, Quantstamp)
# Tự động verify underconstrained trong Halo2 circuits
cargo add halo2_analyzer
# Dùng Analyzer::new(circuit).analyze()

# 5. Picus (QED2) — formal verification
# Prove hoặc disprove underconstrained
```

---

## Summary / Key Takeaways

- **Underconstrained = soundness bug**: Malicious prover có thể fake proof — impact cao nhất
- **`<--` vs `<==`** trong Circom: Dễ nhầm, dẫn đến unconstrained signal — lỗi phổ biến nhất
- **Missing range check**: Overflow trong $\mathbb{F}_p$ có thể bypass logic checks
- **Component output quên constrain**: Tạo component không đủ — phải explicit liên kết output
- **Hash convention mismatch**: Off-chain vs on-chain dùng khác output index → completeness bug
- **Halo2 assign-constrain gap**: Assign không tạo constraint — phải enable selector và copy_advice
- **Tools**: Circomspect, ZKAP, MockProver, halo2-analyzer — chạy trước khi audit manual

---

## References

- Dao et al. — *Weak Fiat-Shamir Attacks on Modern Proof Systems* (IEEE S&P 2023)
- Pailoor et al. — *Automated Detection of Under-Constrained Circuits in ZKPs* (PLDI 2023)
- Trail of Bits — *A Deep Dive into Axiom's Halo2 Circuits* (blog.trailofbits.com, 2025)
- Bernhard Mueller — *A Practical Guide to Finding Soundness Bugs in ZK Circuits* (medium.com, Jan 2026)
- Kudelski Security — *On the Security of Halo2 Proof System* (2024)
- 0xPARC — *ZK Bug Tracker* (github.com/0xPARC/zk-bug-tracker)
- zksecurity — *zkbugs: Repository of ZK security bugs* (github.com/zksecurity/zkbugs)
- Chaliasos, Yu — *SoK: What don't we know? Understanding Security Vulnerabilities in SNARKs* (arXiv 2024)
