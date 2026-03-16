---
title: "04. MiMC & GMiMC"
tags: [cryptography, zk-hash, mimc, gmimc, lesson-04]
aliases: [MiMC GMiMC]
created: 2026-03-13
---

> **Prerequisites**: [[02-zk-proof-systems-circuits|02. ZK Proof Systems]], [[03-zk-friendly-criteria|03. Tiêu chí ZK-Friendly]]  
> **Objectives**:  
> - Hiểu thiết kế MiMC từ đầu: Feistel structure, cube map, round constants
> - Phân tích constraint count chính xác trong R1CS
> - Hiểu GMiMC và tại sao nó cải thiện throughput
> - Nhận biết các attack surfaces cụ thể của MiMC và lỗi triển khai phổ biến

---

## Motivation

MiMC (Minimal Multiplicative Complexity) là hash function ZK-friendly **đầu tiên** được đề xuất một cách nghiêm túc, do Albrecht et al. giới thiệu năm 2016. Dù ngày nay đã có những lựa chọn tốt hơn (Poseidon, Rescue), MiMC vẫn quan trọng vì:

1. **Lịch sử**: Là nền tảng của rất nhiều ZK systems ban đầu (Tornado Cash, Semaphore, nhiều Circomlib circuits)
2. **Tư duy thiết kế**: Minh họa rõ nhất triết lý "dùng phép toán algebraic thay vì bitwise"
3. **Còn trong production**: Nhiều hệ thống vẫn dùng MiMC vì tương thích ngược
4. **Attack surface**: Có bug thực tế liên quan đến round constant generation

---

## Thiết kế MiMC

### Block cipher MiMC-n/n

MiMC ban đầu là một **block cipher** (mã khối) có thể được dùng như permutation để xây dựng hash.

> [!definition] Definition 4.1 — MiMC-$n/n$ Block Cipher
> **MiMC-$n/n$** là block cipher với block size $n$ bits (= field element trong $\mathbb{F}_{2^n}$ hoặc $\mathbb{F}_p$), key size $n$ bits, và $r = \lceil n \log_2 3 / \log_2 p \rceil$ rounds.
>
> **Round function** (round thứ $i$, với $i = 0, \ldots, r-1$):
>
> $$x_{i+1} = (x_i + k + c_i)^3$$
>
> trong đó:
> - $x_i \in \mathbb{F}_p$: state hiện tại
> - $k \in \mathbb{F}_p$: key
> - $c_i \in \mathbb{F}_p$: round constant ($c_0 = 0$ theo convention)
> - $(\cdot)^3$: cube map — S-box của MiMC

> [!theorem] Theorem 4.2 — Số rounds tối thiểu của MiMC
> Để đảm bảo security chống interpolation attack, MiMC cần ít nhất:
>
> $$r \geq \left\lceil \frac{n}{\log_2 3} \right\rceil$$
>
> rounds. Với $n = 254$ bits (BN254), $r = \lceil 254 / 1.585 \rceil = 161$ rounds. Tuy nhiên thực tế hay dùng $r = 91$ rounds cho $n \approx 254$ khi dùng trong hashing mode với additional security margin từ key.

**Tại sao $x^3$?** Đây là power map bậc thấp nhất có thể dùng làm S-box trong $\mathbb{F}_p$ khi $\gcd(3, p-1) = 1$. Với BN254, $\gcd(3, p-1) = 1$ nên $x^3$ là permutation. Mỗi $x^3$ chỉ cần **2 phép nhân**: $t = x \cdot x$, sau đó $t \cdot x$.

**Với trường binary (MiMC-$n/n$ over $\mathbb{F}_{2^n}$)**: Phải dùng $x^3$ trong $\mathbb{F}_{2^n}$ thay vì $\mathbb{F}_p$. Cẩn thận: arithmetic hoàn toàn khác (không có carry, XOR thay cho cộng).

---

## MiMC Hash Function

MiMC block cipher được dùng để xây dựng hash theo chế độ **Miyaguchi-Preneel**:

> [!definition] Definition 4.3 — MiMC Hash (Miyaguchi-Preneel mode)
> Để hash input $(x_1, x_2, \ldots, x_\ell)$, dùng MiMC block cipher $E$ như compression function:
>
> $$h_0 = 0$$  
> $$h_i = E_{h_{i-1}}(x_i) + h_{i-1} + x_i$$
>
> Cụ thể với 2 inputs: $H(x_1, x_2) = E_{x_1}(x_2) + x_1 + x_2$

Trong Circom (circomlib), `MiMC7(n, 91)` implement hash này cho $n$ inputs với 91 rounds.

### MiMCsponge

Ngoài Miyaguchi-Preneel, MiMC còn được dùng theo **sponge mode**:

> [!definition] Definition 4.4 — MiMCsponge
> State gồm 2 field elements $(s_L, s_R)$. Với mỗi input block $m_i$:
>
> 1. $s_L \leftarrow s_L + m_i$  
> 2. $(s_L, s_R) \leftarrow \text{MiMC-Feistel}(s_L, s_R)$
>
> Output là $s_L$ sau khi absorb xong.

---

## Feistel Structure trong MiMC

MiMCsponge dùng **Feistel network** — một cấu trúc quan trọng cần hiểu sâu.

> [!definition] Definition 4.5 — Feistel Network
> **Feistel network** chia state thành hai nửa $(L, R)$ và áp dụng round function $F$ luân phiên:
>
> $$L_{i+1} = R_i$$  
> $$R_{i+1} = L_i + F(R_i, k_i)$$
>
> Tính chất quan trọng: **Dễ đảo ngược** (invertible) ngay cả khi $F$ không có inverse — chỉ cần chạy ngược. Đây là lý do Feistel network được dùng rộng rãi trong block ciphers (DES, Blowfish).

**MiMC-Feistel** với round function $F(x, k, c) = (x + k + c)^3$:

```
Round i:
  L_new = R
  R_new = L + (R + k + c_i)^3
```

---

## Phân Tích Constraint Count

Đây là phần quan trọng nhất để hiểu tại sao MiMC có một vị trí nhất định trong landscape ZK:

### Circom MiMC7 — Đếm constraints

```circom
// Simplified MiMC7 round (từ circomlib/circuits/mimc.circom)
template MiMC7Round() {
    signal input x;
    signal input k;
    signal input c;
    signal output out;

    signal x2;
    signal x4;
    signal x6;
    signal x7;

    x2 <== x * x;           // 1 constraint: tính x^2
    x4 <== x2 * x2;         // 1 constraint: tính x^4
    x6 <== x4 * x2;         // 1 constraint: tính x^6
    x7 <== x6 * (x + k + c);// 1 constraint: tính x^7 (dùng linear combo)

    out <== x7 + k;          // 0 constraints: linear
}
// Tổng: 4 constraints per round
```

**Tại sao x^7 thay vì x^3?** Circomlib thực tế dùng $x^7$ (không phải $x^3$) vì với BN254, $\gcd(3, p-1) = 3 \neq 1$ nên $x^3$ không phải permutation! Phải dùng $x^7$ ($\gcd(7, p-1) = 1$).

> [!warning] Warning 4.6 — BN254 và $x^3$
> BN254 có $p-1$ chia hết cho 3 (vì $p \equiv 1 \pmod{3}$). Do đó $x^3$ **không phải bijection** trên $\mathbb{F}_{BN254}$ — nhiều input cho cùng output! MiMC trên BN254 phải dùng $x^7$ (hay còn gọi là MiMC-7).

**Tổng constraints cho MiMC7 hash 1 input**:
- 91 rounds $\times$ 4 constraints/round = 364 constraints
- Thêm một số constraints cho hash mode
- Tổng: ~644 constraints (theo benchmark circomlib)

**So sánh với Poseidon (t=3)**:
- Poseidon: ~240 constraints
- MiMC7: ~644 constraints
- **Poseidon hiệu quả hơn ~2.7x**

Tuy nhiên với **multi-input**, MiMC tuyến tính (mỗi input thêm 91 rounds ≈ 364 constraints), trong khi Poseidon tận dụng state lớn hơn nên hiệu quả hơn nhiều với nhiều inputs.

---

## GMiMC — Generalized MiMC

GMiMC (Generalized MiMC) được thiết kế để cải thiện **throughput** của MiMC cho trường hợp cần hash nhiều inputs:

> [!definition] Definition 4.7 — GMiMC
> **GMiMC** dùng state $t$ field elements $(x_0, x_1, \ldots, x_{t-1})$ và round function:
>
> $$x_0' = x_0 + F(x_1)$$  
> $$x_1' = x_2, \quad x_2' = x_3, \quad \ldots, \quad x_{t-1}' = x_0$$
>
> Sau đó **rotate** state. Nghĩa là chỉ **một phần tử** được apply nonlinear function mỗi round, phần còn lại chỉ shift.

**Ưu điểm của GMiMC**:
- Với state t=3: 3 lần thông lượng MiMC thông thường
- Ít constraints hơn per output bit
- Phù hợp cho hash nhiều inputs (Merkle tree với arity cao)

**Nhược điểm**:
- Cryptanalysis phức tạp hơn — một số attack tốt hơn cho GMiMC so với MiMC
- Ít được dùng trong thực tế hơn Poseidon

---

## Round Constants: Nguồn Gốc Bug Quan Trọng

> [!danger] Danger 4.8 — Round Constant Generation Bug
> Trong paper MiMC gốc, cách generate round constants **không được specify**. Mỗi implementation có thể chọn cách khác nhau. Nếu round constants có structure ẩn hoặc được chọn không ngẫu nhiên, có thể bị **invariant subspace attack**.
>
> **Attack**: Tồn tại subspace $V \subset \mathbb{F}_p$ sao cho $E_k(V + v) = V + f(v)$ — hàm "bị kẹt" trong một subspace và không lan rộng ra toàn bộ field.
>
> **Yêu cầu**: Round constants phải được generate bằng cách transparent và không có structure ẩn (ví dụ: hash của string "MiMC" bằng SHA-256).

**Cách đúng** (theo Ethereum Foundation và circomlib):
```python
# Round constants cho MiMC7 trên BN254
import hashlib

def generate_mimc_constants(num_rounds, seed="mimc"):
    """Generate MiMC round constants theo chuẩn circomlib"""
    p = 21888242871839275222246405745257275088548364400416034343698204186575808495617  # BN254

    constants = [0]  # c_0 = 0 theo convention
    for i in range(1, num_rounds):
        # Hash "mimc{i}" bằng keccak và convert thành field element
        h = int(hashlib.sha3_256(f"{seed}{i}".encode()).hexdigest(), 16) % p
        constants.append(h)

    return constants

constants = generate_mimc_constants(91)
print(f"c_0 = {constants[0]}")  # 0
print(f"c_1 = {constants[1]}")  # random-looking field element
print(f"Số constants: {len(constants)}")
```

> [!warning] Warning 4.9 — Không dùng Round Constants Tự Tạo
> Nếu bạn thấy một MiMC implementation dùng round constants tự tạo mà không document nguồn gốc, **đây là red flag nghiêm trọng**. Round constants không rõ ràng có thể là backdoor hoặc dẫn đến invariant subspace attack.

---

## SageMath: MiMC Implementation đầy đủ

```python
# MiMC7 từ đầu bằng Python/SageMath
# Chạy với: sage (hoặc python3, thay GF bằng tính mod p thủ công)

import hashlib

# BN254 scalar field
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617

def mimc7_round(x, k, c, p):
    """Một round của MiMC7: (x + k + c)^7 mod p"""
    base = (x + k + c) % p
    # x^7 = x^4 * x^2 * x = ((x^2)^2) * x^2 * x
    x2 = (base * base) % p
    x4 = (x2 * x2) % p
    x6 = (x4 * x2) % p
    x7 = (x6 * base) % p
    return (x7 + k) % p

def generate_constants(num_rounds, seed="mimc"):
    constants = [0]
    for i in range(1, num_rounds):
        h = int(hashlib.sha3_256(f"{seed}{i}".encode()).hexdigest(), 16) % p
        constants.append(h)
    return constants

def mimc7_hash(x_in, k=0, num_rounds=91):
    """MiMC7 cipher (không phải hash mode, chỉ là cipher)"""
    constants = generate_constants(num_rounds)
    x = x_in
    for i in range(num_rounds):
        x = mimc7_round(x, k, constants[i], p)
    return (x + k) % p

def mimc7_multi_hash(inputs, k=0):
    """MiMC7 multi-input hash theo Miyaguchi-Preneel"""
    h = 0
    for xi in inputs:
        h = (mimc7_hash(xi, k=h) + h + xi) % p
    return h

# Test
x1 = 1
x2 = 2
h = mimc7_multi_hash([x1, x2])
print(f"MiMC7({x1}, {x2}) = {h}")
print(f"Hex: {hex(h)}")

# Verify: thay đổi input nhỏ tạo output hoàn toàn khác (avalanche effect)
h2 = mimc7_multi_hash([x1, x2 + 1])
print(f"MiMC7({x1}, {x2+1}) = {h2}")
print(f"Khác nhau: {h != h2}")
```

---

## Circom: MiMC trong Circuit

```circom
pragma circom 2.0.0;

// Simplified MiMCsponge - minh họa cách dùng
include "circomlib/circuits/mimcsponge.circom";

template ExampleMiMC() {
    signal input left;
    signal input right;
    signal output hash;

    // MiMCSponge(nInputs, nRounds, nOutputs)
    component hasher = MiMCSponge(2, 220, 1);

    hasher.ins[0] <== left;
    hasher.ins[1] <== right;
    hasher.k <== 0;  // key = 0 cho hash mode

    hash <== hasher.outs[0];
}

component main = ExampleMiMC();
```

**Lưu ý quan trọng**: `MiMCSponge(2, 220, 1)` dùng **220 rounds** không phải 91. Đây là vì sponge mode cần nhiều rounds hơn để đảm bảo security — một điểm dễ nhầm khi audit.

---

## Attack Surface của MiMC

### 1. Algebraic Degree Attack

Sau $r$ rounds của MiMC-7, algebraic degree của toàn bộ cipher là $7^r$. Cần $7^r > 2^{128}$ để chống interpolation, tức $r > 128/\log_2 7 \approx 53$ rounds. Với 91 rounds: degree $= 7^{91}$ — rất an toàn. Nhưng nếu số rounds bị giảm xuống...

> [!danger] Danger 4.10 — Reduced Round Attack (Thực tế)
> Nếu implementation dùng ít rounds hơn recommended (ví dụ: implement MiMC-3 thay vì MiMC-7/MiMC-91), attacker có thể dùng interpolation: với $7^r + 1$ queries, tìm đa thức biểu diễn toàn bộ cipher, từ đó tính ngược preimage.
>
> **Real bug pattern**: Developer tối ưu circuit để chạy nhanh hơn bằng cách giảm rounds, không nhận ra đây là security parameter.

### 2. GCD Attack trên Multi-Call

> [!warning] Warning 4.11 — GCD Attack
> Khi MiMC được dùng với nhiều keys khác nhau (không phải hash mode), tồn tại GCD-based attack. Không ảnh hưởng đến hash mode (key = 0) nhưng ảnh hưởng đến keyed use cases.

### 3. Invariant Subspace Attack

Nếu round constants $c_i$ có đặc điểm:
- $c_i = 0$ cho tất cả $i$ (hoặc nhiều $c_i = 0$): MiMC không còn an toàn
- Round constants được chọn từ subspace không tốt

---

## So sánh MiMC với Poseidon

| | MiMC-7 | Poseidon (t=3) |
|--|--------|----------------|
| S-box | $x^7$ | $x^5$ |
| Structure | Feistel | SPN |
| R1CS constraints (1 input) | ~644 | ~240 |
| R1CS constraints (2 inputs) | ~1288 | ~290 |
| Security argument | Interpolation-based | HADES strategy |
| Age (trust) | 2016 | 2019 |
| Ethereum adoption | Tornado Cash, Semaphore | zkSync, StarkNet |
| MiMC round constant bug risk | Có | Thấp hơn (process rõ ràng) |

---

## Summary / Key Takeaways

- **MiMC** dùng cube map ($x^3$ hoặc $x^7$) trong Feistel structure — algebraically simple, hiệu quả ZK
- **BN254 không cho phép dùng $x^3$** vì $p \equiv 1 \pmod 3$ → phải dùng $x^7$ (MiMC-7)
- **Constraint count**: ~644 (1 input), tuyến tính với số inputs — kém hiệu quả hơn Poseidon với nhiều inputs
- **GMiMC**: multi-branch variant, tốt hơn cho throughput nhưng ít adoption hơn
- **Round constant generation là critical security parameter** — phải transparent và documented
- **Bug phổ biến**: giảm rounds để optimize circuit, dùng $x^3$ thay vì $x^7$ trên BN254, round constants không rõ nguồn gốc

---

## References

- Albrecht et al. — *MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity* (eprint.iacr.org/2016/492)
- circomlib — `circuits/mimc.circom`, `circuits/mimcsponge.circom` (github.com/iden3/circomlib)
- Ethereum Foundation — MiMC round constants specification
- Grassi et al. — *Algebraic Distinguishers with Degrees beyond Proven Bounds* (tosc.iacr.org)
- RareSkills — *ZK Friendly Hash: MiMC Explained* (rareskills.io)
