---
title: "13. Implementation & Integration Bugs"
tags: [cryptography, zk-hash, implementation-bugs, fiat-shamir, hash-to-field, lesson-13]
aliases: [Implementation Integration Bugs ZK]
created: 2026-03-13
---

> **Prerequisites**: [[12-circuit-bugs|12. Circuit-Level Bugs]], [[06-poseidon-implementations|06. Poseidon Implementations]], [[02-zk-proof-systems-circuits|02. ZK Proof Systems]]  
> **Objectives**:  
> - Hiểu Frozen Heart vulnerability và cách Fiat-Shamir bị implement sai
> - Nắm spec mismatch patterns: khi implementation khác spec về tham số hoặc output
> - Biết hash-to-field bugs: endianness, field overflow, truncation
> - Nhận biết domain separation failures trong protocol integration
> - Phân tích nullifier reuse pattern (Tornado Cash style)

---

## Motivation

Bài 12 tập trung vào bugs **trong circuit** (constraint layer). Bài này đi lên một layer trên: bugs trong **cách hash function được sử dụng** trong protocol và integration layer.

Phân loại của SoK (Chaliasos et al. 2024) cho thấy integration bugs chiếm ~15–20% tổng vulnerabilities nhưng thường có impact rất cao (exploit = theft).

---

## Frozen Heart — Fiat-Shamir Implementation Bug

**Frozen Heart** (Trail of Bits, 2022) là class vulnerability ảnh hưởng đến nhiều ZK implementations lớn: PlonK implementations, Bulletproofs, và nhiều custom protocols.

> [!definition] Definition 13.1 — Fiat-Shamir Transformation
> **Fiat-Shamir** biến interactive proof $(P \leftrightarrow V)$ thành non-interactive bằng cách thay verifier's random challenge bằng hash của transcript:
>
> $$\text{challenge} = H(\text{public\_params} \| \text{public\_inputs} \| \text{all\_prior\_commitments})$$
>
> **Bắt buộc**: Hash phải bao gồm **tất cả** thành phần public — bỏ sót bất kỳ phần nào cho phép prover manipulate challenge.

### Bulletproofs Frozen Heart

```python
# Bulletproofs range proof: prove v in [0, 2^n)
# Pedersen commitment: com = v*G + r*H (public)
# Fiat-Shamir challenge phải include com!

# BUG (theo Bulletproofs paper gốc):
def fiat_shamir_buggy(public_params, A, S):
    # Thiếu: không include Pedersen commitment!
    return H(public_params || A || S)  # ← BUG: thiếu com

# EXPLOIT:
# 1. Prover muốn prove v' (invalid) using commitment com = v*G + r*H
# 2. Prover tính challenge c = H(params || A || S) -- không phụ thuộc com
# 3. Prover có freedom để chọn A, S sao cho proof verify
# 4. Proof cho statement sai nhưng verifier accept!

# FIX (đúng):
def fiat_shamir_correct(public_params, com, A, S):
    # Include TẤT CẢ public values
    return H(public_params || com || A || S)  # ← ĐÚNG

print("Frozen Heart pattern:")
print("  BUG:  challenge = H(params, A, S)       -- thiếu commitment")
print("  FIX:  challenge = H(params, com, A, S)  -- đầy đủ")
```

### PlonK Frozen Heart

```python
# PlonK: Fiat-Shamir challenge phải hash TẤT CẢ public inputs
# Một số implementations (2022) bỏ sót một số public inputs:

# BUG: Hash chỉ commitments, không hash public inputs
def plonk_challenge_buggy(commitments):
    return H(commitments)  # ← thiếu public_inputs!

# Kết quả: Prover có thể chọn public inputs sau khi tính commitments
# Cho phép prove statement với wrong public inputs

# FIX:
def plonk_challenge_correct(commitments, public_inputs):
    return H(commitments || encode(public_inputs))
```

### Last Challenge Attack (KZG-based PLONK, 2024)

Ciobotaru et al. (eprint.iacr.org/2024/398) phát hiện attack tinh vi hơn: Transcript hash exclude **hai evaluation proofs cuối** $W_1, W_2$:

```python
# Simplified: KZG PLONK batching challenge
# BUG: challenge u = H(transcript) nhưng không bao gồm W1, W2

# Kết quả: W1, W2 độc lập với challenge u
# Prover có thể: giữ nguyên proof đúng, modify W1/W2 freely
# => Forge proof của statement sai với proof components sai

# Pattern nhận dạng trong audit:
def check_fiat_shamir_completeness(proof_system_code):
    """
    Audit checklist cho Fiat-Shamir:
    1. List tất cả interactive messages trong protocol
    2. Verify mỗi message được hash trước khi tạo challenge tiếp theo
    3. Đặc biệt: message CUỐI CÙNG cũng phải được hash
    """
    pass
```

---

## Spec Mismatch — Implementation vs Paper

Một loại bug subtle khác: Implementation implement đúng theo code nhưng **sai so với paper/spec** — gây ra hash output khác nhau giữa các implementations.

### MiMC Round Count Mismatch

```python
# MiMC-7 spec: 91 rounds cho BN254 (gcd(7, p-1) = 1, n=254 bits)
# Công thức: rounds >= ceil(log_7(p)) * 2 ≈ 91

p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
import math
min_rounds = math.ceil(math.log(p_bn254, 7)) * 2
print(f"MiMC-7 BN254 minimum rounds: {min_rounds}")  # ~91

# Tuy nhiên: Nếu developer đọc một paper cũ (trước 2018) cite 65 rounds
# hoặc dùng wrong formula -> 65 rounds cho alpha=7 BN254 -> INSECURE

# Pattern phát hiện trong audit:
# 1. Đọc spec từ CHÍNH paper gốc (không dùng thirdparty)
# 2. So sánh round count với reference implementation
# 3. Verify test vectors từ reference
```

### Poseidon Alpha Mismatch

```python
# BUG phổ biến: Copy Poseidon code từ BN254 sang BLS12-381 nhưng quên đổi alpha

# BN254: p-1 ≡ 0 mod 3 -> alpha=3 KHÔNG valid -> phải dùng alpha=5
# BLS12-381: p-1 ≡ 0 mod 3 -> alpha=3 KHÔNG valid -> phải dùng alpha=5
# Goldilocks: p-1 ≡ 0 mod 3 -> alpha=3 KHÔNG valid -> phải dùng alpha=7
# Pasta (Pallas): cần kiểm tra riêng

from math import gcd

def check_alpha_for_field(p, alpha):
    g = gcd(alpha, p - 1)
    valid = g == 1
    print(f"alpha={alpha} trên F_p (p≈2^{p.bit_length()}): {'VALID' if valid else 'INVALID'} (gcd={g})")
    return valid

p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
p_bls12 = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001
p_goldilocks = 2**64 - 2**32 + 1

for p, name in [(p_bn254, "BN254"), (p_bls12, "BLS12-381"), (p_goldilocks, "Goldilocks")]:
    print(f"\n{name}:")
    for alpha in [3, 5, 7]:
        check_alpha_for_field(p, alpha)
```

---

## Hash-to-Field Bugs

"Hash-to-field" là bước convert arbitrary bytes thành field element. Đây là điểm tiếp xúc giữa byte-world và field-world — nhiều bugs xảy ra tại đây.

### Bug 1: Endianness

```python
# Giả sử hash input là bytes: b"\x01\x02\x03\x04"
data = b"\x01\x02\x03\x04"

# Big-endian (Circomlib convention):
x_be = int.from_bytes(data, 'big')    # = 0x01020304 = 16909060

# Little-endian (một số Rust libs):
x_le = int.from_bytes(data, 'little') # = 0x04030201 = 67305985

print(f"Big-endian:    {x_be} = {hex(x_be)}")
print(f"Little-endian: {x_le} = {hex(x_le)}")
# Nếu JS prover dùng big-endian nhưng Rust verifier dùng little-endian:
# Hash output sẽ khác -> valid proof reject, hoặc tệ hơn: sai domain
```

### Bug 2: Reduction Modulo p (Field Overflow)

```python
# Khi convert 32-byte hash (256-bit) sang field element BN254 (254-bit):
# PHẢI reduce modulo p!

p = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# SHA-256 output: 256-bit random value
import hashlib
sha_output = int(hashlib.sha256(b"some data").hexdigest(), 16)
print(f"SHA-256 output (256-bit): {sha_output.bit_length()} bits")
print(f"Field p (254-bit):         {p.bit_length()} bits")

# BUG: Dùng trực tiếp không reduce
x_buggy = sha_output  # Có thể >= p!
is_in_field = x_buggy < p
print(f"\nBUG: Value in field? {is_in_field}")  # Có thể False!

# FIX: Reduce mod p
x_correct = sha_output % p
print(f"FIX: Value in field? {x_correct < p}")  # Luôn True

# Tại sao nguy hiểm?
# Nếu input >= p, arithmetic circuit sẽ wrap around
# => hash value thay đổi "nhảy" -> hash không deterministic
# => cross-implementation mismatch
```

### Bug 3: Truncation vs Reduction

```python
# Hai cách khác nhau để fit 256-bit value vào 254-bit field:
# 1. Truncation: chỉ lấy 254 bit thấp nhất -> khác reduction
# 2. Reduction: modulo p -> đúng securely

p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
sha_output = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff  # all-F

# Truncation (WRONG: bias, không uniform mod p):
x_truncated = sha_output & ((1 << 254) - 1)  # mask 254 bits

# Reduction (CORRECT: uniform mod p):
x_reduced = sha_output % p

print(f"Truncation: {hex(x_truncated)[:20]}...")
print(f"Reduction:  {hex(x_reduced)[:20]}...")
print(f"Chúng khác nhau: {x_truncated != x_reduced}")

# Nếu off-chain dùng truncation nhưng on-chain dùng reduction:
# Hash-to-field cho cùng input -> hai giá trị khác nhau -> proof fail
```

---

## Domain Separation Failures

Khi một hash function được tái sử dụng cho nhiều mục đích mà không có domain separation, cross-context attacks xảy ra.

> [!danger] Danger 13.2 — Cross-Context Forgery
> Protocol dùng `Poseidon(nullifier, secret)` cho:
> - **Commitment**: `com = Poseidon(value, rand)`
> - **Merkle leaf**: `leaf = Poseidon(left, right)`
>
> Nếu `value = left` và `rand = right`, thì `com = leaf`!
>
> Attacker có thể sử dụng Merkle proof của một leaf như là proof of commitment — cross-context forgery.

```python
# Domain separation ĐÚNG: thêm constant phân biệt use case
# Thường là thêm 1 input cố định (domain tag)

def poseidon_commitment(value, randomness):
    # domain_tag = 1 cho commitments
    return poseidon(value, randomness, 1)

def poseidon_merkle_hash(left, right):
    # domain_tag = 2 cho Merkle nodes
    return poseidon(left, right, 2)

def poseidon_nullifier(secret):
    # domain_tag = 3 cho nullifiers
    return poseidon(secret, 3)

# Với domain tags khác nhau, cross-context attack không còn khả thi
# vì poseidon(..., 1) != poseidon(..., 2) với cùng inputs
```

---

## Nullifier Reuse — Tornado Cash Pattern

Đây là integration bug kinh điển: Circuit đúng, hash function đúng, nhưng protocol logic sai.

```
Tornado Cash flow:
1. Deposit: user tạo (nullifier, secret) ngẫu nhiên
2. commitment = Poseidon(nullifier, secret)
3. commitment được thêm vào Merkle tree on-chain
4. Withdraw: user prove knowledge of (nullifier, secret) s.t.
   - Poseidon(nullifier, secret) là leaf trong Merkle tree
   - nullifier chưa được dùng (nullifier_hash chưa in spent set)

BUG potential: Nếu smart contract KHÔNG check nullifier_hash -> double spend
Tornado Cash đã fix điều này đúng trong smart contract.
```

```python
# Pseudo-code: Pattern kiểm tra nullifier on-chain

# BUG: Thiếu nullifier check
def withdraw_buggy(proof, nullifier_hash, recipient):
    # Verify ZK proof (circuit đúng)
    verify_proof(proof, nullifier_hash, merkle_root)
    # BUG: Không mark nullifier là đã dùng!
    transfer(recipient, DENOMINATION)
    # -> User có thể submit cùng proof vô số lần!

# FIX:
spent_nullifiers = set()

def withdraw_correct(proof, nullifier_hash, recipient):
    # Verify ZK proof
    verify_proof(proof, nullifier_hash, merkle_root)
    # PHẢI check và mark nullifier
    assert nullifier_hash not in spent_nullifiers, "Nullifier already spent!"
    spent_nullifiers.add(nullifier_hash)
    transfer(recipient, DENOMINATION)

print("Nullifier reuse pattern:")
print("  BUG:  circuit đúng, smart contract thiếu nullifier check")
print("  FIX:  verify_proof() + check spent set + mark spent")
```

---

## zkSync Era — Under-Constrained Memory Bug (2023, $50K)

Thực tế: ChainLight phát hiện bug trong zkSync Era ZK circuits (Sept 2023):

```
Bug: ZK-EVM memory circuit dùng LinearCombination để verify memory consistency.
     LinearCombination được compute đúng trong witness generation,
     nhưng thiếu một equality constraint liên kết LC output với expected value.

Effect: Malicious prover có thể modify memory values trong circuit
        -> Prove invalid EVM execution -> Verifier accept
        -> Potential: invalid state transition on L2

Fix: Thêm constraint: lc_output === expected_value
Reward: $50,000 USDC
```

**Lesson rút ra**:
- Integration giữa hash function và protocol logic phức tạp
- Bug không ở hash function, mà ở cách kết quả hash được dùng trong memory verification
- Ngay cả production systems đã audit vẫn có bugs — continuous security review quan trọng

---

## Audit Checklist — Integration Layer

```
Khi audit ZK protocol (không chỉ circuit):

Fiat-Shamir:
□ Tất cả public inputs được hash trước khi tạo challenge?
□ Tất cả prior commitments được hash?
□ LAST message của interactive protocol cũng được hash?
□ Transcript ordering nhất quán?

Hash-to-Field:
□ Endianness: big-endian hay little-endian? Nhất quán across components?
□ Reduction: bytes được reduce mod p, không truncate?
□ Input length: fixed-length hay variable? Hash mode có encode length không?

Domain Separation:
□ Có domain tag cho mỗi use case?
□ Tag có đủ distinguish tất cả contexts?
□ Merkle hash != commitment hash != nullifier hash?

Protocol Logic:
□ Nullifier/serial number được check on-chain?
□ Spent set được update atomic với transfer?
□ Re-entrancy attack nếu hash compute giữa check và update?

Cross-implementation:
□ Test vectors được verify giữa prover (off-chain) và verifier (on-chain)?
□ Field parameters nhất quán giữa circuit và native code?
```

---

## Summary / Key Takeaways

- **Frozen Heart**: Fiat-Shamir thiếu một message trong transcript → prover forges challenges. Fix: hash mọi public input và commitment
- **Spec mismatch**: Round count, alpha, field params khác paper → sai output hoặc insecure. Fix: verify với test vectors từ reference
- **Hash-to-field**: Endianness và truncation vs reduction → cross-implementation mismatch. Fix: uniform reduction mod p, document endianness
- **Domain separation**: Thiếu domain tag → cross-context forgery. Fix: encode use case trong hash input
- **Nullifier reuse**: Circuit đúng nhưng protocol sai (missing on-chain check). Fix: atomic check-and-mark trong smart contract
- **Layer separation**: Phân biệt circuit bug, implementation bug, và integration bug — mỗi loại cần approach khác nhau

---

## References

- Trail of Bits — *Disclosing Frozen Heart Vulnerabilities* (blog.trailofbits.com, 2022)
- Ciobotaru et al. — *The Last Challenge Attack: Exploiting Vulnerable Fiat-Shamir in KZG SNARK* (eprint.iacr.org/2024/398)
- Khovratovich, Rothblum, Soukhanov — *How to Prove False Statements: Practical Attacks on Fiat-Shamir* (eprint.iacr.org/2025/118)
- Chaliasos et al. — *SoK: What don't we know? Understanding Security Vulnerabilities in SNARKs* (arXiv 2402.15293)
- 0xPARC — *ZK Bug Tracker* (github.com/0xPARC/zk-bug-tracker)
- ChainLight — *zkSync Era Soundness Vulnerability Disclosure* (2023, $50K reward)
- zksecurity — *The First ZK Exploits Happened, and They Weren't What We Expected* (blog.zksecurity.xyz, 2025)
