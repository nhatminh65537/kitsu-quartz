---
title: "A1. SageMath Scripts"
tags: [cryptography, zk-hash, sagemath, python, reference, appendix]
aliases: [ZK Hash SageMath Scripts]
created: 2026-03-14
---

> **Mục đích**: Reference implementations đầy đủ của MiMC-7, Poseidon, và Rescue-Prime bằng Python/SageMath. Dùng để verify test vectors, audit implementations, và nghiên cứu cấu trúc nội bộ.
> **Liên quan**: [[04-mimc-gmimc|04. MiMC & GMiMC]], [[05-poseidon-design|05. Poseidon Design]], [[07-rescue-rescue-prime|07. Rescue & Rescue-Prime]]

> [!note] Yêu cầu môi trường
> - **Python 3.8+**: Các script thuần Python không cần SageMath (dùng modular arithmetic thủ công)
> - **SageMath**: Các phần có `GF(p)` cần SageMath (hoặc thư viện `galois` trong Python)
> - **Cài SageMath**: `sudo apt install sagemath` hoặc `conda install -c conda-forge sage`
> - **Thư viện Python**: `pip install galois` (thay thế SageMath cho một số thao tác)

---

## Script 0 — Utilities chung

```python
# zk_hash_utils.py
# Các utility functions dùng chung cho tất cả implementations

import hashlib
from math import gcd

# ──────────────────────────────────────────────────────────
# Constants: các prime fields phổ biến
# ──────────────────────────────────────────────────────────

# BN254 scalar field (dùng trong Ethereum, Circom, Groth16, Poseidon)
P_BN254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# BLS12-381 scalar field (dùng trong Zcash, Filecoin)
P_BLS12_381 = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

# Goldilocks (Plonky2, Miden VM)
P_GOLDILOCKS = 2**64 - 2**32 + 1

# Pasta Pallas (Halo2, Zcash Orchard)
P_PALLAS = 0x40000000000000000000000000000000224698fc094cf91b992d30ed00000001


def check_alpha_valid(p: int, alpha: int) -> bool:
    """Kiểm tra alpha có phải là permutation exponent trên F_p không."""
    g = gcd(alpha, p - 1)
    if g == 1:
        print(f"  alpha={alpha}: VALID permutation trên F_p (gcd={g})")
    else:
        print(f"  alpha={alpha}: INVALID — không phải bijection (gcd={g})")
    return g == 1


def modinv(a: int, m: int) -> int:
    """Tính nghịch đảo modular a^{-1} mod m bằng Extended Euclidean."""
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        raise ValueError(f"{a} không có nghịch đảo mod {m}")
    return x % m


def extended_gcd(a: int, b: int):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y


def modpow(base: int, exp: int, mod: int) -> int:
    """Lũy thừa modular hiệu quả."""
    return pow(base, exp, mod)


def sha3_to_field(data: bytes, p: int) -> int:
    """Convert SHA3-256 hash thành field element (reduce mod p)."""
    h = int(hashlib.sha3_256(data).hexdigest(), 16)
    return h % p


# Demo kiểm tra alpha cho các fields phổ biến
if __name__ == "__main__":
    print("=== Kiểm tra alpha validity ===")
    for p, name in [(P_BN254, "BN254"), (P_BLS12_381, "BLS12-381"), (P_GOLDILOCKS, "Goldilocks")]:
        print(f"\n{name} (p ≈ 2^{p.bit_length()}):")
        for alpha in [3, 5, 7, 11]:
            check_alpha_valid(p, alpha)
```

---

## Script 1 — MiMC-7 trên BN254

```python
# mimc7_bn254.py
# MiMC-7 full implementation trên BN254
# Bao gồm: round constant generation, cipher, hash mode (Miyaguchi-Preneel)

import hashlib

P = 21888242871839275222246405745257275088548364400416034343698204186575808495617
NUM_ROUNDS = 91  # Số rounds an toàn cho MiMC-7 trên BN254


# ── Round Constants ──────────────────────────────────────────────────────────

def generate_mimc7_constants(num_rounds: int = NUM_ROUNDS, seed: str = "mimc") -> list:
    """
    Generate round constants theo chuẩn circomlib/iden3.
    - c_0 = 0 (theo convention)
    - c_i = SHA3-256("mimc{i}") % p  cho i >= 1
    """
    constants = [0]  # c_0 = 0
    for i in range(1, num_rounds):
        raw = hashlib.sha3_256(f"{seed}{i}".encode()).hexdigest()
        constants.append(int(raw, 16) % P)
    return constants


# ── Round Function ──────────────────────────────────────────────────────────

def mimc7_round(x: int, k: int, c: int) -> int:
    """
    Một round MiMC-7: output = (x + k + c)^7 mod p
    x^7 = x^4 * x^2 * x = ((x^2)^2) * x^2 * x  — 3 phép nhân
    """
    base = (x + k + c) % P
    x2 = (base * base) % P      # x^2
    x4 = (x2 * x2) % P          # x^4
    x6 = (x4 * x2) % P          # x^6
    x7 = (x6 * base) % P        # x^7
    return (x7 + k) % P


# ── Cipher ──────────────────────────────────────────────────────────────────

_CONSTANTS = None  # Cache

def mimc7_cipher(x: int, k: int = 0, num_rounds: int = NUM_ROUNDS) -> int:
    """
    MiMC-7 block cipher: E_k(x)
    x: plaintext (field element)
    k: key (0 cho hash mode)
    """
    global _CONSTANTS
    if _CONSTANTS is None or len(_CONSTANTS) < num_rounds:
        _CONSTANTS = generate_mimc7_constants(num_rounds)

    state = x
    for i in range(num_rounds):
        state = mimc7_round(state, k, _CONSTANTS[i])
    return (state + k) % P


# ── Hash Modes ───────────────────────────────────────────────────────────────

def mimc7_hash(inputs: list, k: int = 0) -> int:
    """
    MiMC-7 multi-input hash theo Miyaguchi-Preneel mode:
        h_0 = 0
        h_i = E_{h_{i-1}}(x_i) + h_{i-1} + x_i

    Đây là chính xác cách circomlib/MiMC implement.
    """
    h = 0
    for xi in inputs:
        cipher_out = mimc7_cipher(xi, k=h)
        h = (cipher_out + h + xi) % P
    return h


def mimc7_compress(left: int, right: int) -> int:
    """MiMC-7 Merkle compression: H(left, right)"""
    return mimc7_hash([left, right])


# ── MiMCsponge (simplified) ─────────────────────────────────────────────────

def mimc_feistel(s_l: int, s_r: int, k: int = 0, num_rounds: int = 220) -> tuple:
    """
    MiMC Feistel permutation (dùng trong MiMCSponge).
    220 rounds theo circomlib (nhiều hơn cipher mode vì sponge cần an toàn hơn).
    """
    constants = generate_mimc7_constants(num_rounds)
    for i in range(num_rounds):
        t = (s_l + k + constants[i]) % P
        t2 = (t * t) % P
        t4 = (t2 * t2) % P
        t6 = (t4 * t2) % P
        t7 = (t6 * t) % P
        new_s_l = (s_r + t7) % P
        new_s_r = s_l
        s_l, s_r = new_s_l, new_s_r
    return (s_l + k) % P, s_r


def mimc_sponge(inputs: list, num_outputs: int = 1, k: int = 0) -> list:
    """
    MiMCsponge: absorb inputs, squeeze outputs.
    State = (s_L, s_R), output từ s_L.
    """
    s_l, s_r = 0, 0
    # Absorb phase
    for xi in inputs:
        s_l = (s_l + xi) % P
        s_l, s_r = mimc_feistel(s_l, s_r, k)
    # Squeeze phase
    outputs = [s_l]
    for _ in range(num_outputs - 1):
        s_l, s_r = mimc_feistel(s_l, s_r, k)
        outputs.append(s_l)
    return outputs


# ── Test & Verification ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== MiMC-7 BN254 Tests ===\n")

    # Test 1: Kiểm tra avalanche effect
    h1 = mimc7_hash([1, 2])
    h2 = mimc7_hash([1, 3])
    print(f"H(1, 2) = {h1}")
    print(f"H(1, 3) = {h2}")
    print(f"Avalanche: {h1 != h2 and bin(h1 ^ h2).count('1') > 100}")

    # Test 2: Deterministic (cùng input → cùng output)
    h3 = mimc7_hash([1, 2])
    assert h1 == h3, "ERROR: Hash không deterministic!"
    print(f"\nDeterministic: PASS")

    # Test 3: Single input hash
    h_single = mimc7_hash([42])
    print(f"\nH(42) = {h_single}")

    # Test 4: MiMCsponge
    sponge_out = mimc_sponge([1, 2], num_outputs=1)
    print(f"\nMiMCSponge([1, 2]) = {sponge_out[0]}")

    # Test 5: Merkle compression
    root = mimc7_compress(
        mimc7_compress(1, 2),
        mimc7_compress(3, 4)
    )
    print(f"\nMerkle root H(H(1,2), H(3,4)) = {root}")
    print(f"  (hex): {hex(root)}")
```

---

## Script 2 — Poseidon Permutation (BN254)

```python
# poseidon_bn254.py
# Poseidon hash function implementation trên BN254
# Tham số: t=3, R_F=8, R_P=57, alpha=5

# NOTE: Round constants và MDS matrix đầy đủ cần generate từ Grain LFSR.
# Script này dùng simplified version để minh họa cấu trúc.
# Cho production: dùng test vectors từ https://extgit.iaik.tugraz.at/krypto/hadeshash

P = 21888242871839275222246405745257275088548364400416034343698204186575808495617
ALPHA = 5  # S-box exponent (gcd(5, p-1) = 1 cho BN254)

# Tham số Poseidon (t=3, rate=2, capacity=1)
T = 3        # State size
R_F = 8      # Full rounds
R_P = 57     # Partial rounds (BN254, t=3, 128-bit security)
R_TOTAL = R_F + R_P  # = 65


# ── S-box ────────────────────────────────────────────────────────────────────

def sbox(x: int) -> int:
    """S-box: x^5 mod p. Cần 3 phép nhân: x^2, x^4, x^5."""
    x2 = (x * x) % P       # x^2
    x4 = (x2 * x2) % P     # x^4
    x5 = (x4 * x) % P      # x^5
    return x5


# ── MDS Matrix ───────────────────────────────────────────────────────────────

def generate_cauchy_mds(t: int, p: int) -> list:
    """
    Generate Cauchy MDS matrix: M[i][j] = 1 / (x_i + y_j)
    với x_i = i, y_j = t + j (để x_i + y_j != 0 và các giá trị phân biệt).
    Cauchy matrix luôn là MDS — xem Bài 11.
    """
    M = []
    for i in range(t):
        row = []
        for j in range(t):
            x_i = i
            y_j = t + j
            denom = (x_i + y_j) % p
            row.append(pow(denom, p - 2, p))  # Nghịch đảo modular: Fermat's little theorem
        M.append(row)
    return M


def mds_multiply(state: list, M: list, t: int, p: int) -> list:
    """Nhân state với MDS matrix."""
    new_state = []
    for i in range(t):
        val = 0
        for j in range(t):
            val = (val + M[i][j] * state[j]) % p
        new_state.append(val)
    return new_state


# ── Round Constants ──────────────────────────────────────────────────────────

def generate_poseidon_constants_simple(num_constants: int, p: int) -> list:
    """
    Simplified round constant generation (minh họa).
    Production phải dùng Grain LFSR từ Poseidon spec.
    """
    import hashlib
    constants = []
    for i in range(num_constants):
        h = int(hashlib.sha256(f"poseidon_rc_{i}".encode()).hexdigest(), 16) % p
        constants.append(h)
    return constants


# ── Poseidon Permutation ─────────────────────────────────────────────────────

def poseidon_permutation(state: list, round_constants: list, MDS: list) -> list:
    """
    Poseidon permutation đầy đủ:
    - R_F/2 full rounds đầu
    - R_P partial rounds giữa
    - R_F/2 full rounds cuối
    """
    t = len(state)
    assert t == T
    assert len(round_constants) == R_TOTAL * T

    state = list(state)  # Copy để không modify in-place
    rc_idx = 0

    # Phase 1: R_F/2 = 4 full rounds đầu
    for _ in range(R_F // 2):
        # AddRoundConstants
        for i in range(T):
            state[i] = (state[i] + round_constants[rc_idx + i]) % P
        rc_idx += T
        # SubWords: S-box cho TẤT CẢ elements
        state = [sbox(x) for x in state]
        # MixLayer: MDS
        state = mds_multiply(state, MDS, T, P)

    # Phase 2: R_P = 57 partial rounds giữa
    for _ in range(R_P):
        # AddRoundConstants
        for i in range(T):
            state[i] = (state[i] + round_constants[rc_idx + i]) % P
        rc_idx += T
        # SubWords: S-box CHỈ cho element đầu tiên
        state[0] = sbox(state[0])
        # MixLayer: MDS
        state = mds_multiply(state, MDS, T, P)

    # Phase 3: R_F/2 = 4 full rounds cuối
    for _ in range(R_F // 2):
        # AddRoundConstants
        for i in range(T):
            state[i] = (state[i] + round_constants[rc_idx + i]) % P
        rc_idx += T
        # SubWords: S-box cho TẤT CẢ elements
        state = [sbox(x) for x in state]
        # MixLayer: MDS
        state = mds_multiply(state, MDS, T, P)

    return state


# ── Poseidon Sponge Hash ─────────────────────────────────────────────────────

def poseidon_hash(inputs: list) -> int:
    """
    Poseidon hash theo sponge mode:
    - Capacity = 1 (state[0], không exposed)
    - Rate = 2 (state[1], state[2], absorb inputs vào đây)
    - Output: state[1] sau khi absorb xong

    Đây là mode phổ biến nhất (dùng trong circomlib Poseidon template).
    """
    # Khởi tạo state = 0
    state = [0] * T
    # state[0] = capacity (bí mật, không absorb input vào)
    # state[1], state[2] = rate (absorb input vào)

    MDS = generate_cauchy_mds(T, P)
    rc = generate_poseidon_constants_simple(R_TOTAL * T, P)

    # Absorb inputs theo từng rate-block (rate = t-1 = 2)
    rate = T - 1  # = 2 elements per block
    for i in range(0, len(inputs), rate):
        block = inputs[i:i + rate]
        for j, xi in enumerate(block):
            state[j + 1] = (state[j + 1] + xi) % P
        state = poseidon_permutation(state, rc, MDS)

    # Squeeze: lấy rate elements đầu tiên từ output
    return state[1]


# ── Constraint Count ─────────────────────────────────────────────────────────

def count_poseidon_r1cs_constraints(t: int, R_F: int, R_P: int, alpha: int = 5) -> int:
    """
    Tính số R1CS constraints lý thuyết cho Poseidon permutation.
    S-box x^5 cần 3 constraints: x^2, x^4, x^5
    """
    sbox_constraints = alpha.bit_length() - 1  # = 3 cho alpha=5 (ceil(log2(5)) = 3)
    # Thực ra cho alpha=5: cần x^2 (1), x^4 (1), x^5 = x^4*x (1) = 3 constraints
    sbox_constraints = 3

    full_round_constraints = R_F * t * sbox_constraints
    partial_round_constraints = R_P * sbox_constraints
    total = full_round_constraints + partial_round_constraints
    return total


# ── Test & Verification ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== Poseidon BN254 Tests ===\n")

    # Test 1: Constraint count
    expected_constraints = count_poseidon_r1cs_constraints(T, R_F, R_P)
    print(f"Expected R1CS constraints (t={T}, R_F={R_F}, R_P={R_P}): {expected_constraints}")

    # Test 2: Basic hash
    h = poseidon_hash([1, 2])
    print(f"\nPoseidon([1, 2]) = {h}")
    print(f"  (hex): {hex(h)}")

    # Test 3: Avalanche
    h2 = poseidon_hash([1, 3])
    print(f"\nPoseidon([1, 3]) = {h2}")
    print(f"Avalanche check: {'PASS' if h != h2 else 'FAIL'}")

    # Test 4: Single input
    h_single = poseidon_hash([42])
    print(f"\nPoseidon([42]) = {h_single}")

    # NOTE: Để verify với circomlib, cần dùng round constants CHÍNH XÁC từ Poseidon spec.
    # Script này dùng simplified constants cho mục đích giáo dục.
    # Test vectors chính thức: https://extgit.iaik.tugraz.at/krypto/hadeshash
    print("\n[!] Script này dùng simplified constants.")
    print("    Để so sánh với circomlib, dùng constants từ poseidon spec repository.")
```

---

## Script 3 — Rescue-Prime trên Goldilocks

```python
# rescue_prime_goldilocks.py
# Rescue-Prime implementation trên Goldilocks field
# Tham số phổ biến: m=12, security=128 bits (dùng trong Miden VM)

# Goldilocks: p = 2^64 - 2^32 + 1
P = 2**64 - 2**32 + 1
ALPHA = 7          # S-box exponent (gcd(7, p-1) = 1 cho Goldilocks)
M = 12             # State size (Miden VM sponge)
NUM_ROUNDS = 7     # Số rounds (theo Rescue-Prime spec cho m=12, 128-bit)


# ── Alpha và Alpha Inverse ────────────────────────────────────────────────────

def compute_alpha_inv(alpha: int, p: int) -> int:
    """
    Tính alpha_inv sao cho alpha * alpha_inv ≡ 1 (mod p-1).
    Dùng Extended Euclidean Algorithm.
    """
    def extended_gcd(a, b):
        if b == 0:
            return a, 1, 0
        g, x, y = extended_gcd(b, a % b)
        return g, y, x - (a // b) * y

    g, x, _ = extended_gcd(alpha % (p - 1), p - 1)
    assert g == 1, f"gcd({alpha}, {p-1}) = {g} != 1 — alpha không valid!"
    return x % (p - 1)


ALPHA_INV = compute_alpha_inv(ALPHA, P)


# ── S-boxes ──────────────────────────────────────────────────────────────────

def forward_sbox(x: int) -> int:
    """Forward S-box: x^alpha mod p."""
    return pow(x, ALPHA, P)


def inverse_sbox(x: int) -> int:
    """
    Inverse S-box: x^{alpha_inv} mod p.
    CẢNH BÁO: Tốn kém vì alpha_inv có Hamming weight cao.
    Trong STARK, đây được biểu diễn bằng constraint y^alpha = x thay vì tính trực tiếp.
    """
    return pow(x, ALPHA_INV, P)


# ── MDS Matrix ───────────────────────────────────────────────────────────────

def generate_mds_circulant(m: int, p: int) -> list:
    """
    Generate circulant MDS matrix với first row = [0, 1, 2, ..., m-1].
    LƯU Ý: Không phải mọi circulant matrix đều là MDS — cần verify!
    Với m=12, Rescue-Prime dùng verified MDS constants từ spec.
    """
    # Simplified: dùng Cauchy matrix (luôn MDS)
    M_mat = []
    for i in range(m):
        row = []
        for j in range(m):
            x_i = i + 1
            y_j = m + j + 1
            denom = (x_i + y_j) % p
            row.append(pow(denom, p - 2, p))
        M_mat.append(row)
    return M_mat


def mds_mul(state: list, M: list, m: int, p: int) -> list:
    """Nhân state với MDS matrix."""
    result = []
    for i in range(m):
        val = sum(M[i][j] * state[j] for j in range(m)) % p
        result.append(val)
    return result


# ── Round Constants ──────────────────────────────────────────────────────────

def generate_rescue_constants(num_rounds: int, m: int, p: int) -> list:
    """
    Generate round constants đơn giản (minh họa).
    Production: dùng constants từ Rescue-Prime reference implementation.
    Rescue cần 2*num_rounds*m constants (2 sets mỗi round: sau forward, sau inverse).
    """
    import hashlib
    total = 2 * num_rounds * m
    constants = []
    for i in range(total):
        h = int(hashlib.sha256(f"rescue_rc_{i}".encode()).hexdigest(), 16) % p
        constants.append(h)
    return constants


# ── Rescue-XLIX Permutation ──────────────────────────────────────────────────

def rescue_permutation(state: list, MDS: list, constants: list) -> list:
    """
    Rescue-XLIX permutation: 1 round gồm 6 bước:
    1. Forward S-box (x^alpha) cho tất cả elements
    2. MDS matrix multiply
    3. Add round constants (set A)
    4. Inverse S-box (x^{1/alpha}) cho tất cả elements
    5. MDS matrix multiply
    6. Add round constants (set B)
    """
    m = len(state)
    state = list(state)

    for r in range(NUM_ROUNDS):
        # Bộ constants: mỗi round dùng 2*m constants
        rc_a = constants[r * 2 * m : r * 2 * m + m]
        rc_b = constants[r * 2 * m + m : r * 2 * m + 2 * m]

        # Step 1: Forward S-box
        state = [forward_sbox(x) for x in state]

        # Step 2: MDS
        state = mds_mul(state, MDS, m, P)

        # Step 3: Add round constants A
        state = [(state[i] + rc_a[i]) % P for i in range(m)]

        # Step 4: Inverse S-box
        state = [inverse_sbox(x) for x in state]

        # Step 5: MDS
        state = mds_mul(state, MDS, m, P)

        # Step 6: Add round constants B
        state = [(state[i] + rc_b[i]) % P for i in range(m)]

    return state


# ── Rescue Sponge Hash ────────────────────────────────────────────────────────

def rescue_hash(inputs: list) -> int:
    """
    Rescue-Prime sponge hash:
    - Rate = m-1 = 11 (số elements absorb mỗi lần)
    - Capacity = 1
    - Output: state[0] sau khi absorb
    """
    rate = M - 1  # = 11
    state = [0] * M
    MDS = generate_mds_circulant(M, P)
    constants = generate_rescue_constants(NUM_ROUNDS, M, P)

    # Absorb
    for i in range(0, len(inputs), rate):
        block = inputs[i:i + rate]
        for j, xi in enumerate(block):
            state[j] = (state[j] + xi) % P
        state = rescue_permutation(state, MDS, constants)

    # Squeeze: lấy capacity element
    return state[0]


# ── AIR Constraint Count ─────────────────────────────────────────────────────

def count_rescue_air_constraints(m: int, num_rounds: int, alpha: int = 7) -> dict:
    """
    Ước tính số AIR constraints cho Rescue-Prime permutation.

    Trong AIR, inverse S-box được biểu diễn bằng constraint:
        y^alpha = x   (thay vì tính y = x^{1/alpha} trực tiếp)
    Constraint này có degree alpha — hiệu quả trong STARK.

    Forward S-box: y = x^alpha — thể hiện bằng chain squarings
    """
    # Forward S-box: degree alpha = 7 — trong AIR dùng step columns
    # Inverse S-box: 1 degree-alpha constraint per element (y^7 = x)
    # MDS: linear, không tạo constraint multiplicative
    # Round constants: linear, không tạo constraint multiplicative

    per_round_nonlinear = 2 * m  # forward + inverse, mỗi loại m elements
    total_sbox_constraints = per_round_nonlinear * num_rounds

    return {
        "nonlinear_constraints": total_sbox_constraints,
        "linear_constraints": "numerous (MDS, ARC) — miễn phí trong AIR",
        "max_degree": alpha,  # Degree của constraint thấp nhất
        "note": "Hiệu quả hơn R1CS vì degree-alpha constraint được STARK handle tốt"
    }


# ── Test & Verification ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== Rescue-Prime Goldilocks Tests ===\n")

    print(f"Field: Goldilocks p = 2^64 - 2^32 + 1 = {P}")
    print(f"alpha = {ALPHA},  alpha_inv = {ALPHA_INV}")
    print(f"Verify: (alpha * alpha_inv) mod (p-1) = {(ALPHA * ALPHA_INV) % (P - 1)}")

    # Test S-box inverse
    x = 12345
    y_forward = forward_sbox(x)
    y_back = inverse_sbox(y_forward)
    print(f"\nS-box test: x = {x}")
    print(f"  forward_sbox({x}) = {y_forward}")
    print(f"  inverse_sbox({y_forward}) = {y_back}")
    print(f"  Roundtrip: {'PASS' if y_back == x else 'FAIL'}")

    # Test hash
    h1 = rescue_hash([1, 2, 3])
    h2 = rescue_hash([1, 2, 4])
    print(f"\nRescue_hash([1,2,3]) = {h1}")
    print(f"Rescue_hash([1,2,4]) = {h2}")
    print(f"Avalanche: {'PASS' if h1 != h2 else 'FAIL'}")

    # AIR constraints
    air = count_rescue_air_constraints(M, NUM_ROUNDS)
    print(f"\nAIR Constraints: {air}")
```

---

## Script 4 — Audit Utilities

```python
# audit_utils.py
# Các script hỗ trợ kiểm tra và audit ZK hash implementations

import hashlib
from math import gcd


P_BN254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617


# ── Kiểm tra tham số hash ────────────────────────────────────────────────────

def audit_hash_params(p: int, alpha: int, num_rounds: int, hash_name: str = "custom"):
    """
    Audit cơ bản cho tham số một ZK hash function.
    In ra cảnh báo nếu tham số không an toàn.
    """
    print(f"=== Audit: {hash_name} ===")
    print(f"  p = {p} (≈ 2^{p.bit_length()})")
    print(f"  alpha = {alpha}")
    print(f"  num_rounds = {num_rounds}")

    # Kiểm tra 1: alpha có phải permutation không?
    g = gcd(alpha, p - 1)
    if g != 1:
        print(f"\n  [CRITICAL] alpha={alpha} KHÔNG phải permutation trên F_p!")
        print(f"             gcd({alpha}, p-1) = {g} != 1")
        print(f"             Cần dùng alpha={alpha+1} hoặc alpha khác")
    else:
        print(f"\n  [OK] alpha={alpha} là permutation hợp lệ (gcd={g})")

    # Kiểm tra 2: Số rounds tối thiểu (interpolation bound cho MiMC-style)
    import math
    min_rounds_interpolation = math.ceil(math.log(p, alpha))
    if num_rounds < min_rounds_interpolation:
        print(f"\n  [WARNING] Số rounds {num_rounds} < minimum {min_rounds_interpolation}")
        print(f"            Có thể bị interpolation attack!")
    else:
        print(f"\n  [OK] num_rounds={num_rounds} >= min {min_rounds_interpolation} (interpolation bound)")

    # Kiểm tra 3: Số rounds cho 128-bit security (rule of thumb)
    target_security = 128
    required_degree = 2 ** target_security
    degree_after_rounds = alpha ** num_rounds
    if degree_after_rounds < required_degree:
        print(f"\n  [WARNING] Degree sau {num_rounds} rounds = alpha^r = {alpha}^{num_rounds}")
        print(f"            Cần degree > 2^{target_security} cho 128-bit security")
    else:
        print(f"\n  [OK] Algebraic degree sau {num_rounds} rounds: {alpha}^{num_rounds} >> 2^{target_security}")

    print()


# ── Verify Test Vectors ──────────────────────────────────────────────────────

def verify_test_vector(impl_hash, expected: int, inputs: list, name: str = "hash"):
    """
    Verify implementation cho ra đúng test vector.
    """
    actual = impl_hash(inputs)
    if actual == expected:
        print(f"[PASS] {name}({inputs}) = {expected}")
    else:
        print(f"[FAIL] {name}({inputs})")
        print(f"       Expected: {expected}")
        print(f"       Got:      {actual}")
    return actual == expected


# ── Hash-to-Field Converter ──────────────────────────────────────────────────

def safe_hash_to_field(data: bytes, p: int, endian: str = "big") -> int:
    """
    Convert arbitrary bytes thành field element an toàn:
    1. SHA-256 để expand
    2. Reduce mod p (không truncate!)
    3. Endianness rõ ràng
    """
    raw = int.from_bytes(hashlib.sha256(data).digest(), endian)
    field_elem = raw % p
    print(f"hash_to_field(endian={endian}): {hex(field_elem)} (in-field: {field_elem < p})")
    return field_elem


def demo_endianness_bug(data: bytes, p: int):
    """
    Demo: endianness bug khi hash-to-field.
    Nếu JS và Rust dùng khác endian -> mismatch.
    """
    print(f"Data: {data.hex()}")
    be = int.from_bytes(hashlib.sha256(data).digest(), 'big') % p
    le = int.from_bytes(hashlib.sha256(data).digest(), 'little') % p
    print(f"big-endian    result: {hex(be)}")
    print(f"little-endian result: {hex(le)}")
    print(f"Mismatch: {be != le}")


# ── MDS Matrix Verification ──────────────────────────────────────────────────

def verify_mds(M: list, p: int) -> bool:
    """
    Kiểm tra matrix M có phải MDS (Maximum Distance Separable) không.
    Một matrix t×t là MDS nếu mọi submatrix vuông có det != 0 (over F_p).
    """
    t = len(M)

    def determinant(mat, p):
        """Tính determinant modular (Gaussian elimination)."""
        import copy
        n = len(mat)
        m = [list(row) for row in mat]
        det = 1
        for col in range(n):
            # Tìm pivot
            pivot = -1
            for row in range(col, n):
                if m[row][col] % p != 0:
                    pivot = row
                    break
            if pivot == -1:
                return 0
            if pivot != col:
                m[col], m[pivot] = m[pivot], m[col]
                det = (-det) % p
            det = (det * m[col][col]) % p
            inv = pow(m[col][col], p - 2, p)
            for row in range(col + 1, n):
                factor = (m[row][col] * inv) % p
                for j in range(col, n):
                    m[row][j] = (m[row][j] - factor * m[col][j]) % p
        return det

    # Kiểm tra tất cả submatrices k×k với k từ 1 đến t
    from itertools import combinations
    is_mds = True
    for k in range(1, t + 1):
        for rows in combinations(range(t), k):
            for cols in combinations(range(t), k):
                sub = [[M[r][c] for c in cols] for r in rows]
                d = determinant(sub, p)
                if d == 0:
                    print(f"[FAIL] Submatrix rows={rows}, cols={cols} có det=0 -> NOT MDS")
                    is_mds = False
    if is_mds:
        print(f"[PASS] Matrix {t}×{t} là MDS trên F_p")
    return is_mds


# ── Demo tổng hợp ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== ZK Hash Audit Utilities Demo ===\n")

    # 1. Audit tham số MiMC-7
    audit_hash_params(P_BN254, alpha=7, num_rounds=91, hash_name="MiMC-7 BN254")

    # 2. Audit tham số sai (cảnh báo)
    print("--- Tham số sai (demo cảnh báo) ---")
    audit_hash_params(P_BN254, alpha=3, num_rounds=50, hash_name="MiMC-3 (SAI trên BN254)")

    # 3. Demo endianness bug
    print("=== Endianness Bug Demo ===")
    demo_endianness_bug(b"hello world", P_BN254)

    # 4. Hash-to-field an toàn
    print("\n=== Safe Hash-to-Field ===")
    safe_hash_to_field(b"secret_input", P_BN254, endian="big")
```

---

## Script 5 — Constraint Counter

```python
# constraint_counter.py
# Đếm và so sánh số R1CS constraints của các ZK hash functions

def count_mimc7_constraints(num_rounds: int = 91, num_inputs: int = 1) -> int:
    """
    MiMC-7: mỗi round x^7 cần 4 constraints (x^2, x^4, x^6, x^7).
    Multi-input theo Miyaguchi-Preneel: num_inputs lần cipher.
    """
    constraints_per_round = 4  # x2, x4, x6, x7
    constraints_per_cipher = num_rounds * constraints_per_round
    return constraints_per_cipher * num_inputs


def count_poseidon_constraints(t: int, R_F: int, R_P: int, alpha: int = 5) -> int:
    """
    Poseidon: x^5 cần 3 constraints (x^2, x^4, x^5).
    Full round: t S-boxes; partial round: 1 S-box.
    """
    sbox_constraints = 3  # cho alpha=5: x^2, x^4, x^5
    full = R_F * t * sbox_constraints
    partial = R_P * sbox_constraints
    return full + partial


def count_rescue_r1cs_constraints(m: int, num_rounds: int, alpha: int = 7) -> int:
    """
    Rescue-Prime trong R1CS: cả forward (x^alpha) VÀ inverse (x^{1/alpha}).
    Inverse S-box alpha_inv có Hamming weight cao -> cần nhiều squarings.
    Goldilocks alpha=7: alpha_inv ≈ 10,981,432,057,323,236,247 (≈ 63 bits) -> ~63 squarings.
    Xấp xỉ: 10 constraints per inverse S-box (thực tế phụ thuộc alpha_inv HW).
    """
    forward_per_element = 3   # cho alpha=7: x^2, x^4, x^7 (chain)
    inverse_per_element = 10  # xấp xỉ (conservative estimate)
    per_round = m * (forward_per_element + inverse_per_element)
    return per_round * num_rounds


def print_comparison_table():
    """In bảng so sánh constraints cho 2-input hash."""
    print("=" * 65)
    print(f"{'Hash Function':<25} {'R1CS Constraints':>20} {'Notes'}")
    print("=" * 65)

    # SHA-256 (for reference)
    print(f"{'SHA-256 (reference)':<25} {'~27,000':>20}  Binary ops — không ZK-friendly")

    # MiMC-7
    c = count_mimc7_constraints(91, 2)
    print(f"{'MiMC-7 (2 inputs)':<25} {c:>20}  91 rounds × 4 × 2 inputs")

    # GMiMC (approximate)
    print(f"{'GMiMC (t=3)':<25} {'~430':>20}  Multi-branch, tốt hơn MiMC")

    # Poseidon t=3
    c = count_poseidon_constraints(3, 8, 57, 5)
    print(f"{'Poseidon (t=3)':<25} {c:>20}  t=3, R_F=8, R_P=57")

    # Poseidon2 (approximate improvement ~20%)
    c2 = int(c * 0.8)
    print(f"{'Poseidon2 (t=3)':<25} {c2:>20}  ~20% tiết kiệm nhờ linear layer mới")

    # Rescue m=3 (approximate)
    c = count_rescue_r1cs_constraints(3, 22, 7)
    print(f"{'Rescue (m=3)':<25} {c:>20}  đắt vì inverse S-box costly")

    print("=" * 65)
    print("\nGhi chú: Constraints là R1CS (Rank-1 Constraint System).")
    print("STARK/AIR constraints có bảng số khác — xem [[a0-hash-comparison-table|A0]].")


if __name__ == "__main__":
    print_comparison_table()
```

---

## Cách chạy các scripts

```bash
# Yêu cầu: Python 3.8+

# Script 0: Utilities
python zk_hash_utils.py

# Script 1: MiMC-7
python mimc7_bn254.py

# Script 2: Poseidon (cần nhiều RAM cho R_TOTAL=65 rounds)
python poseidon_bn254.py

# Script 3: Rescue-Prime Goldilocks
python rescue_prime_goldilocks.py

# Script 4: Audit utilities
python audit_utils.py

# Script 5: Constraint comparison
python constraint_counter.py
```

> [!warning] Lưu ý quan trọng về production use
> Các scripts này là **reference implementations cho mục đích học tập**. Để dùng trong production:
> - **Poseidon**: Dùng `poseidon-rs` (Rust) hoặc `poseidon-py` với round constants chính xác từ spec
> - **MiMC-7**: Dùng `circomlib` (đã audit) hoặc `mimc-py` từ iden3
> - **Rescue-Prime**: Dùng `rescue-prime` library từ Alan Szepieniec hoặc Winterfell codebase
>
> **Round constants** trong scripts này là simplified — không match với test vectors chính thức!

---

## References

- Albrecht et al. — *MiMC* (eprint.iacr.org/2016/492)
- Grassi et al. — *Poseidon* (USENIX Security 2021)
- Szepieniec — *Rescue-Prime Standard Specification* (eprint.iacr.org/2022/508)
- iden3 circomlib — github.com/iden3/circomlib (MiMC reference implementation)
- IAIK/TU Graz — Poseidon reference implementation (extgit.iaik.tugraz.at/krypto/hadeshash)
- Winterfell STARK prover — github.com/facebook/winterfell (Rescue-Prime)
