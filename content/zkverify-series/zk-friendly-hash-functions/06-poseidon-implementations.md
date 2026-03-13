---
title: "06. Poseidon — Implementations (Phần 2)"
tags: [cryptography, zk-hash, poseidon, circom, halo2, lesson-06]
aliases: [Poseidon Implementations]
created: 2026-03-13
---

> **Prerequisites**: [[05-poseidon-design|05. Poseidon — Thiết kế (Phần 1)]], quen thuộc Circom cơ bản  
> **Objectives**:  
> - Đọc và phân tích Circom implementation của Poseidon từ circomlib một cách chi tiết
> - Hiểu Halo2 Poseidon chip: cách custom gates tiết kiệm constraints
> - Nhận biết sự khác biệt giữa tham số của các trường khác nhau — nguồn gốc của nhiều bugs
> - Hiểu Poseidon2: ba cải tiến chính và lý do tại sao nhanh hơn trong PLONK
> - Biết test vector để verify một implementation có đúng hay không

---

## Motivation

Thiết kế Poseidon (Lesson 05) là "spec trên giấy". Nhưng khi implement thực tế, có **nhiều cạm bẫy nguy hiểm** mà không đọc code kỹ sẽ không thấy:

- Circom dùng tham số nào? BN254, BLS12-381, hay something else?
- Output là phần tử đầu hay phần tử cuối của state sau khi squeeze?
- Poseidon2 thay đổi gì so với Poseidon gốc?
- Khi circuit kết hợp Poseidon với protocol khác, domain separation được thực hiện thế nào?

Bài này đi sâu vào code thực tế — đây là phần trực tiếp nhất liên quan đến bug bounty.

---

## Circom Implementation — circomlib/circuits/poseidon.circom

### Cấu trúc file

Circomlib implement Poseidon trong một file duy nhất:

```
circomlib/circuits/
├── poseidon.circom          — Poseidon hash template chính
├── poseidon_constants.circom — Round constants cho BN254
└── poseidon_constants_opt.circom — Optimized constants
```

### Template Poseidon(nInputs)

```circom
pragma circom 2.0.0;

include "poseidon_constants.circom";

// S-box: tính x^5 = x^4 * x = (x^2)^2 * x
// Cần 3 constraints (3 phép nhân)
template Sigma() {
    signal input in;
    signal output out;

    signal in2;
    signal in4;

    in2 <== in * in;       // x^2: 1 constraint
    in4 <== in2 * in2;     // x^4: 1 constraint
    out <== in4 * in;      // x^5: 1 constraint
}

// Ark: AddRoundConstants — không tốn constraint (linear)
template Ark(t, C, r) {
    signal input in[t];
    signal output out[t];

    for (var i = 0; i < t; i++) {
        out[i] <== in[i] + C[r * t + i];
    }
}

// Mix layer: nhân với MDS matrix
// Note: matrix multiplication chỉ dùng phép cộng và nhân với hằng số
// => free (linear), không tốn constraints
template Mix(t, M) {
    signal input in[t];
    signal output out[t];

    var lc;
    for (var i = 0; i < t; i++) {
        lc = 0;
        for (var j = 0; j < t; j++) {
            lc += M[i][j] * in[j];
        }
        out[i] <== lc;
    }
}

// Poseidon hash function
// nInputs: số field elements đầu vào (1 đến 16)
template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;

    // Tham số cho BN254, theo circomlib convention
    var t = nInputs + 1;   // state size = nInputs + 1 capacity element
    var nRoundsF = 8;       // full rounds (≡ R_F trong paper)
    var nRoundsP[17] = [56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68, 60];
    // nRoundsP[t-2] = số partial rounds cho state size t (≡ R_P trong paper)

    // Load round constants từ file constants
    var C[...] = POSEIDON_C(t);  // Round constants
    var M[...] = POSEIDON_M(t);  // MDS matrix

    // ...
    // (implementation chi tiết tiếp theo)
}
```

> [!warning] Warning 6.1 — `nRoundsP` Array là Critical Parameter
> Array `nRoundsP[17]` trong circomlib encode số partial rounds cho mỗi state size $t$ (từ $t=2$ đến $t=17$):
>
> ```
> t=2: 56 partial rounds
> t=3: 57 partial rounds
> t=4: 56 partial rounds
> t=5: 60 partial rounds
> ...
> ```
>
> Nếu một implementation **hardcode** sai số partial rounds — ví dụ dùng 56 thay vì 57 cho $t=3$ — circuit vẫn compile và chạy bình thường, nhưng **security margin thấp hơn expected**. Đây là bug tinh vi không có runtime error.

### Full Circom Poseidon (Simplified, annotated)

```circom
pragma circom 2.0.0;

// Minh họa đầy đủ cho t=3 (2 inputs)
// Dựa trên circomlib nhưng simplified để dễ hiểu
template PoseidonEx(nInputs, nOuts) {
    signal input inputs[nInputs];
    signal input initialState;    // capacity init (thường = 0)
    signal output out[nOuts];

    var t = nInputs + 1;  // t=3 cho nInputs=2
    var nRoundsF = 8;
    var nRoundsP = 57;    // cho t=3 trên BN254

    // State khởi tạo: [inputs[0], inputs[1], initialState]
    // capacity element ở cuối

    // Phase 1: R_F/2 = 4 full rounds
    // Phase 2: R_P = 57 partial rounds
    // Phase 3: R_F/2 = 4 full rounds

    // Mỗi round: ARC → S-box layer → MDS
    // Full round: tất cả t S-boxes
    // Partial round: chỉ S-box đầu tiên

    // ... (chi tiết trong circomlib source)
    // Output: state[0] sau khi squeeze
}
```

**Quan sát quan trọng**: Circomlib dùng `state[0]` (phần tử **đầu tiên**) làm output — đây là **capacity element**, không phải rate element. Điều này khác với Poseidon paper gốc suggest dùng phần tử thứ hai (rate element). Đây là một trong những "convention" gây nhầm lẫn khi so sánh implementations.

---

## Test Vectors — Verify Implementation

Test vectors là công cụ quan trọng nhất để detect lỗi implementation. Nếu một implementation không khớp test vectors, nó bị sai (dù circuit có compile không lỗi).

**Test vector chuẩn cho Poseidon trên BN254 (t=3, 2 inputs)**:

```python
# Test vectors từ circomlib và light-poseidon (đã audit bởi Veridise)
# Field: BN254 scalar field
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# Test case 1: Poseidon([1, 2])
# Expected (từ circomlib reference):
EXPECTED_1_2 = 0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a

# Test case 2: Poseidon([0, 0])
EXPECTED_0_0 = 0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864

# Test case 3: Poseidon([1])  (nInputs=1, t=2)
EXPECTED_1 = 0x29176100eaa962bdc1fe6c654d6a3c130e96a4d1168b33848b897dc502820c3

print("Test vectors cho Poseidon BN254:")
print(f"Poseidon([1, 2]) = {hex(EXPECTED_1_2)}")
print(f"Poseidon([0, 0]) = {hex(EXPECTED_0_0)}")
print(f"Poseidon([1])    = {hex(EXPECTED_1)}")

# Nếu implementation của bạn cho kết quả khác -> BUG
# Nguyên nhân thường gặp:
# 1. Sai field (dùng BLS12-381 params cho BN254 circuit)
# 2. Sai số rounds
# 3. Sai round constants (dùng wrong seed)
# 4. Sai output convention (lấy wrong state element)
# 5. Sai endianness khi convert bytes -> field element
```

> [!danger] Danger 6.2 — Lỗi Endianness trong Hash-to-Field
> Khi input là bytes (không phải field elements), phải convert sang field element trước khi hash. Nếu convert sai endianness (big-endian vs little-endian), hash output sẽ hoàn toàn khác — nhưng trong circuit vẫn "hợp lệ" về mặt constraint. Đây là bug integration thường gặp.
>
> ```python
> # BIG-ENDIAN (circomlib convention):
> x = int.from_bytes(b"\x01\x02\x03", 'big')   # = 0x010203
>
> # LITTLE-ENDIAN (một số Rust implementations):
> x = int.from_bytes(b"\x01\x02\x03", 'little') # = 0x030201
>
> # Hai giá trị này cho Poseidon hash KHÁC NHAU hoàn toàn!
> ```

---

## Circom: Poseidon trong Thực tế (Merkle Tree)

Cách Poseidon được dùng phổ biến nhất: Merkle tree commitment scheme.

```circom
pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

// Verify Merkle proof: prove leaf ở position index trong tree có root đã biết
template MerkleProof(levels) {
    signal input leaf;                    // leaf value (private)
    signal input pathElements[levels];    // sibling nodes (private)
    signal input pathIndices[levels];     // 0=left, 1=right (private)
    signal output root;                   // Merkle root (public)

    component hashers[levels];
    component muxes[levels];

    signal levelHashes[levels + 1];
    levelHashes[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        // Chọn thứ tự left/right dựa vào pathIndices[i]
        muxes[i] = MultiMux1(2);
        muxes[i].c[0][0] <== levelHashes[i];      // current = left
        muxes[i].c[0][1] <== pathElements[i];
        muxes[i].c[1][0] <== pathElements[i];
        muxes[i].c[1][1] <== levelHashes[i];      // current = right
        muxes[i].s <== pathIndices[i];

        // Hash hai nodes
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== muxes[i].out[0];
        hashers[i].inputs[1] <== muxes[i].out[1];

        levelHashes[i + 1] <== hashers[i].out;
    }

    root <== levelHashes[levels];
}

component main {public [root]} = MerkleProof(20);
```

**Phân tích constraints**:
- 20 levels × 243 constraints (Poseidon t=3, R_F=8, R_P=57) = ~4,860 constraints cho hash
- Thêm ~20 constraints cho Mux1
- Tổng: ~5,000 constraints cho một Merkle proof 20 levels

So sánh nếu dùng SHA-256: 20 × 28,000 = 560,000 constraints — **112 lần nhiều hơn**.

---

## Halo2 Poseidon Chip

Trong Halo2 (PLONK-based), Poseidon được implement dưới dạng **chip** — một gadget có custom gates riêng, hiệu quả hơn R1CS nhiều.

### Custom Gate cho S-box $x^5$

```rust
// Simplified Halo2 Poseidon chip (halo2_gadgets crate)
use halo2_proofs::{
    circuit::{Layouter, Value},
    plonk::{Advice, Column, ConstraintSystem, Error, Expression, Selector},
    poly::Rotation,
};

struct PoseidonConfig {
    state: [Column<Advice>; 3],   // t=3: 3 advice columns
    round_constant: Column<Advice>,
    s_full: Selector,              // selector cho full rounds
    s_partial: Selector,           // selector cho partial rounds
}

// Custom gate cho full round S-box (x^5)
// Thay vì R1CS cần 3 constraints cho x^5,
// custom gate encode x^5 trong 1 PLONK row!
//
// PLONK gate: q * (x^5 - out) = 0
// Tại compile time, degree-5 constraint được phép trong PLONK
fn configure_sbox(meta: &mut ConstraintSystem<F>) -> Selector {
    let s = meta.selector();
    let x = meta.advice_column();
    let out = meta.advice_column();

    meta.create_gate("poseidon s-box x^5", |meta| {
        let s = meta.query_selector(s);
        let x = meta.query_advice(x, Rotation::cur());
        let out = meta.query_advice(out, Rotation::cur());

        // Constraint: s * (x^5 - out) = 0
        vec![s * (x.clone().pow(5) - out)]
        // Trong PLONK, x.pow(5) là degree-5 polynomial — OK!
    });
    s
}
```

**Tại sao Halo2 hiệu quả hơn cho Poseidon?**

| Operation | R1CS (Circom) | PLONK (Halo2) |
|-----------|--------------|---------------|
| $x^5$ S-box | 3 constraints | 1 custom gate row |
| AddRoundConstants | 0 (free) | 0 (free) |
| MDS matrix (t=3) | 0 (free linear) | 0 (free linear) |
| **Full round (t=3)** | **9 constraints** | **3 rows** |
| **Partial round** | **3 constraints** | **1 row** |
| **Tổng (R_F=8, R_P=57)** | **243 constraints** | **~81 rows** |

Với Halo2, proof generation nhanh hơn ~3x cho Poseidon so với R1CS.

---

## Poseidon2 — Cải tiến Chính

Poseidon2 (eprint.iacr.org/2023/323) giới thiệu ba cải tiến quan trọng:

### Cải tiến 1: External Linear Layer (ME) trước permutation

Poseidon2 thêm một lần nhân MDS matrix **trước** round đầu tiên:

$$\vec{x} \leftarrow M_E \cdot \vec{x}$$

Mục đích: Ngăn algebraic attack "bypass" hai round đầu. Paper gốc Poseidon có vulnerability tiềm ẩn khi attacker có thể treat hai round đầu như "preprocessing" không đóng góp vào security.

### Cải tiến 2: Hai loại MDS matrix khác nhau

- **Full rounds dùng** $M_E$ (external matrix): MDS matrix đầy đủ
- **Partial rounds dùng** $M_I$ (internal matrix): Cấu trúc đặc biệt chỉ cần $O(t)$ multiplications thay vì $O(t^2)$

$M_I$ có dạng:

$$M_I = \mathbf{1} \cdot \vec{\mu}^T + D$$

với $\vec{\mu}$ là vector và $D$ là diagonal matrix. Phép nhân với $M_I$ chỉ cần $O(t)$ operations thay vì $O(t^2)$.

### Cải tiến 3: Chỉ một round constant trong partial rounds

Poseidon gốc: Mỗi partial round cần $t$ round constants (một cho mỗi state element).
Poseidon2: Partial rounds chỉ cần **1 round constant** (cho element đầu tiên).

**Tổng tiết kiệm**: Poseidon2 nhanh hơn **2–3x** trong PLONK circuits so với Poseidon gốc.

```python
# So sánh số lượng round constants cần lưu
# (ảnh hưởng đến memory và constant loading)

t = 3
R_F = 8
R_P = 57

# Poseidon gốc: mỗi round cần t constants
poseidon_constants = (R_F + R_P) * t
print(f"Poseidon constants: {poseidon_constants}")  # 195

# Poseidon2: full rounds cần t, partial rounds chỉ cần 1
poseidon2_constants = R_F * t + R_P * 1
print(f"Poseidon2 constants: {poseidon2_constants}")  # 81

print(f"Giảm {poseidon_constants - poseidon2_constants} constants ({100*(poseidon_constants-poseidon2_constants)/poseidon_constants:.0f}%)")
```

---

## Tham số Theo Field — Nguồn Gốc Bug Nghiêm Trọng

> [!danger] Danger 6.3 — Field Parameter Mismatch
> Poseidon KHÔNG có tham số universal. Mỗi field cần bộ tham số riêng:
>
> | Field | $p$ (hex) | $\alpha$ | $R_F$ | $R_P$ (t=3) | Round constants |
> |-------|-----------|---------|-------|-------------|-----------------|
> | BN254 | `0x30644e72...` | 5 | 8 | 57 | Circomlib constants |
> | BLS12-381 | `0x73eda753...` | 5 | 8 | 57 | Khác circomlib! |
> | Goldilocks | $2^{64}-2^{32}+1$ | 7 | 8 | 22 | Rescue-Prime style |
> | Pasta (Pallas) | `0x40000000...` | 5 | 8 | 56 | Khác BN254! |
>
> **Bug scenario**: Developer copy-paste Circomlib Poseidon vào Halo2 project dùng Pasta field, nhưng quên đổi round constants. Circuit compile không lỗi, nhưng **hash output sai hoàn toàn** — và security argument không còn valid.

**Cách detect bug này khi audit**:

```python
# Script kiểm tra tham số Poseidon có đúng với field không
from math import gcd

def validate_poseidon_params(p, alpha, t, R_F, R_P):
    issues = []

    # Check 1: alpha phải coprime với p-1
    if gcd(alpha, p - 1) != 1:
        issues.append(f"CRITICAL: gcd(alpha={alpha}, p-1) = {gcd(alpha, p-1)} != 1")
        issues.append(f"  => S-box x^{alpha} KHÔNG là bijection trên F_p!")

    # Check 2: alpha phải là minimum valid
    for a in range(2, alpha):
        if gcd(a, p - 1) == 1:
            issues.append(f"WARNING: alpha={alpha} không minimal, có thể dùng alpha={a} nhỏ hơn")
            break

    # Check 3: R_F phải chẵn và >= 6
    if R_F < 6:
        issues.append(f"CRITICAL: R_F={R_F} < 6, không đủ full rounds!")
    if R_F % 2 != 0:
        issues.append(f"WARNING: R_F={R_F} lẻ — không cân bằng đầu/cuối")

    # Check 4: R_P theo minimum bounds
    import math
    min_RP = math.ceil((128 + math.log2(t)) / math.log2(alpha)) - R_F
    if R_P < min_RP:
        issues.append(f"CRITICAL: R_P={R_P} < minimum {min_RP} cho 128-bit security!")

    return issues

# Test với BN254 đúng
p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
issues = validate_poseidon_params(p_bn254, alpha=5, t=3, R_F=8, R_P=57)
print("BN254 valid params:", "OK" if not issues else issues)

# Test với bug: wrong alpha (dùng 3 thay vì 5 trên BN254)
issues_bad = validate_poseidon_params(p_bn254, alpha=3, t=3, R_F=8, R_P=57)
print("BN254 alpha=3:", issues_bad)
```

---

## Domain Separation trong Poseidon

Khi dùng Poseidon cho nhiều mục đích khác nhau (hash, commitment, PRF), **domain separation** phải được enforce để tránh cross-context attacks.

> [!definition] Definition 6.4 — Domain Separation
> **Domain separation** đảm bảo rằng Poseidon dùng cho mục đích A không thể bị adversary dùng để giả mạo kết quả của mục đích B, ngay cả khi input giống nhau.

**Cách implement đúng**:

```circom
// ĐÚNG: Domain separator là field element, được đưa vào capacity
template PoseidonCommit() {
    signal input value;
    signal input randomness;
    signal output commitment;

    component h = Poseidon(3);  // nInputs=3
    h.inputs[0] <== value;
    h.inputs[1] <== randomness;
    h.inputs[2] <== 1;  // domain tag = 1 (commitment scheme)
    // Hash for Merkle: domain tag = 2
    // Hash for PRF:    domain tag = 3
    commitment <== h.out;
}

// SAI: Không có domain separation
template PoseidonCommitInsecure() {
    signal input value;
    signal input randomness;
    signal output commitment;

    component h = Poseidon(2);  // Không có domain tag!
    h.inputs[0] <== value;
    h.inputs[1] <== randomness;
    commitment <== h.out;
}
```

> [!danger] Danger 6.5 — Cross-Context Attack
> Nếu `PoseidonCommitInsecure` và một Merkle hash đều dùng `Poseidon(2)` với cùng inputs, adversary có thể dùng Merkle proof của một giá trị để forge commitment của giá trị đó.

---

## Rust: Poseidon với light-poseidon

```rust
// Cargo.toml: light-poseidon = "0.3"
use light_poseidon::{Poseidon, PoseidonBytesHasher, parameters::bn254_x5};
use ark_bn254::Fr;
use ark_ff::{BigInteger, PrimeField};

fn poseidon_example() -> Result<(), Box<dyn std::error::Error>> {
    // Khởi tạo với 2 inputs (t=3), BN254 params
    let mut hasher = Poseidon::<Fr>::new_circom(2)?;

    // Hash [1, 2] (dưới dạng 32-byte big-endian)
    let input1 = [0u8; 31].iter().chain(&[1u8]).cloned().collect::<Vec<_>>();
    let input2 = [0u8; 31].iter().chain(&[2u8]).cloned().collect::<Vec<_>>();

    let hash = hasher.hash_bytes_be(&[&input1, &input2])?;

    // Expected: 0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a
    println!("Poseidon([1, 2]) = {}", hex::encode(hash));

    // Verify khớp với test vector
    let expected = hex::decode("115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a")?;
    assert_eq!(hash.to_vec(), expected, "Test vector mismatch!");

    Ok(())
}
```

---

## Checklist Audit Poseidon Implementation

Khi audit một Poseidon implementation, kiểm tra theo thứ tự:

```
□ 1. Field nào được dùng? (BN254, BLS12-381, Goldilocks, Pasta?)
□ 2. alpha có đúng cho field đó không? (gcd(alpha, p-1) == 1?)
□ 3. R_F và R_P có đúng không? (dùng bảng tham số chính thức)
□ 4. Round constants có match circomlib/reference không? (test vectors)
□ 5. MDS matrix có match không? (test vectors hoặc verify MDS property)
□ 6. Output convention: lấy state[0] hay state[1]? (phải nhất quán)
□ 7. Domain separation: có domain tag trong inputs không?
□ 8. Endianness khi convert bytes->field: big-endian hay little-endian?
□ 9. Với Poseidon2: có apply ME matrix trước round đầu không?
□ 10. Số inputs có trong range [1, t-1] không? (circomlib max 16)
```

---

## Summary / Key Takeaways

- **Circomlib Poseidon**: Dùng `state[0]` (capacity element) làm output — khác một số paper
- **Tham số là field-specific**: BN254 ≠ BLS12-381 ≠ Goldilocks — nhầm tham số là bug nghiêm trọng
- **Test vectors**: Công cụ thiết yếu; Poseidon([1,2]) trên BN254 phải = `0x115cc0f5...`
- **Halo2 custom gates**: `x^5` trong 1 row thay vì 3 constraints — hiệu quả hơn ~3x
- **Poseidon2**: Thêm ME matrix, dùng $M_I$ cho partial rounds, ít constants hơn — 2-3x nhanh hơn trong PLONK
- **Domain separation**: Phải encode use case vào capacity hoặc thêm domain tag vào input

---

## References

- iden3/circomlib — `circuits/poseidon.circom` (github.com/iden3/circomlib)
- Grassi et al. — *Poseidon2: A Faster Version of the Poseidon Hash Function* (eprint.iacr.org/2023/323)
- light-poseidon — Rust implementation audited by Veridise (github.com/Lightprotocol/light-poseidon)
- TACEO Blog — *Poseidon2 for Noir* (blog.taceo.io, 2024)
- Aragon ZK Research — *Poseidon in Noir* (research.aragon.org/poseidon-noir.html)
- poseidon-hash.info — Parameter guide chính thức
