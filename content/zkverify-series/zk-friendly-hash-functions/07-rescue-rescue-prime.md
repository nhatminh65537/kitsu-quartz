---
title: "07. Rescue & Rescue-Prime"
tags: [cryptography, zk-hash, rescue, rescue-prime, stark, lesson-07]
aliases: [Rescue Rescue-Prime]
created: 2026-03-13
---

> **Prerequisites**: [[03-zk-friendly-criteria|03. Tiêu chí ZK-Friendly]], [[04-mimc-gmimc|04. MiMC & GMiMC]], [[05-poseidon-design|05. Poseidon]], đã quen với AIR và STARK concepts
> **Objectives**:
> - Hiểu tại sao Rescue dùng cả forward lẫn inverse S-box trong cùng một round
> - Phân tích cấu trúc Rescue-XLIX và Rescue-Prime
> - So sánh Rescue với Poseidon: khi nào dùng cái nào
> - Implement Rescue-Prime đơn giản bằng Python/SageMath
> - Hiểu tại sao Rescue tốt hơn cho STARKs nhưng không tốt bằng Poseidon cho SNARKs

---

## Motivation

Rescue được Ashur, Dhooghe, và Szepieniec giới thiệu tại FSE 2020, cùng với Vision (bản binary field). Động lực thiết kế khác hoàn toàn với Poseidon:

**Poseidon**: "Dùng ít S-boxes nhất có thể (partial rounds)"
**Rescue**: "Dùng cả S-box thuận ($x^\alpha$) VÀ S-box nghịch ($x^{1/\alpha}$) luân phiên để bảo vệ từ cả hai hướng tấn công"

Rescue là hash function được StarkWare đề xuất và chọn sau quá trình phân tích nghiêm ngặt. Winterfell (Miden VM) và nhiều STARK systems dùng Rescue-Prime. Tuy nhiên Rescue chậm hơn Poseidon trong R1CS/SNARK vì inverse S-box ($x^{1/\alpha}$) có Hamming weight cao (cần nhiều squarings).

---

## Marvellous Design Strategy

Rescue là instantiation của **Marvellous design strategy** — framework tổng quát cho arithmetization-oriented hash functions.

> [!definition] Definition 7.1 — Marvellous Design Strategy
> **Marvellous** là SPN với hai loại S-box luân phiên:
>
> - **S-box thuận** $\pi_0$: Degree thấp forward, degree cao backward
>   → $\pi_0(x) = x^\alpha$ (power map bậc thấp)
>
> - **S-box nghịch** $\pi_1$: Degree cao forward, degree thấp backward
>   → $\pi_1(x) = x^{1/\alpha} = x^{\alpha^{-1} \bmod (p-1)}$ (inverse power map)
>
> Hai S-boxes luân phiên trong mỗi round đảm bảo: **Dù attacker tấn công từ hướng nào (forward hay backward), degree cũng cao**.

**Tại sao đây là innovation?** MiMC và Poseidon chỉ dùng forward power map. Một attacker có thể chọn tấn công từ hướng "dễ" hơn. Rescue đóng cả hai hướng bằng cách:
- Forward $x^\alpha$ → dễ forward (degree thấp), nhưng khó backward (degree cao = $x^{1/\alpha}$ phức tạp)
- Backward $x^{1/\alpha}$ → dễ backward (degree thấp), nhưng khó forward (degree cao)

---

## Rescue-XLIX Permutation

> [!definition] Definition 7.2 — Rescue-XLIX Round
> Mỗi round của **Rescue-XLIX** (tên gọi từ XLIX = 49, số tác giả) thực hiện **6 bước** trên state $\vec{x} \in \mathbb{F}_p^m$:
>
> 1. **Forward S-box**: $x_i \leftarrow x_i^\alpha$ cho tất cả $i$
> 2. **MDS**: $\vec{x} \leftarrow M \cdot \vec{x}$
> 3. **Round constants (trước)**: $x_i \leftarrow x_i + C_{2i \cdot m + j}$
> 4. **Backward (inverse) S-box**: $x_i \leftarrow x_i^{\alpha^{-1}}$ cho tất cả $i$
> 5. **MDS**: $\vec{x} \leftarrow M \cdot \vec{x}$
> 6. **Round constants (sau)**: $x_i \leftarrow x_i + C_{(2i+1) \cdot m + j}$

**Lưu ý**: Mỗi round dùng **2 lần MDS** và **2 lần S-box** (một forward, một backward). Đây là lý do Rescue có overhead so với Poseidon — nhưng đổi lại, security argument chặt chẽ hơn cho STARKs.

```
Round i:
┌─────────────────────────────────────────────────────┐
│  x^α (forward S-box) → MDS → + C_i → x^{1/α} → MDS → + C_{i+1} │
└─────────────────────────────────────────────────────┘
```

---

## Tính $\alpha^{-1} \bmod (p-1)$

Đây là bước quan trọng và dễ sai trong implementation:

> [!definition] Definition 7.3 — Inverse S-box Exponent
> Với prime $p$ và $\alpha$ coprime với $p-1$, **inverse S-box exponent** $\alpha^{-1}$ thỏa mãn:
>
> $$\alpha \cdot \alpha^{-1} \equiv 1 \pmod{p-1}$$
>
> Khi đó $x^{\alpha \cdot \alpha^{-1}} = x^{1 + k(p-1)} = x$ (theo Fermat's little theorem), nên $(x^\alpha)^{\alpha^{-1}} = x$.

```python
def compute_alpha_inv(alpha, p):
    """
    Tính alpha_inv sao cho alpha * alpha_inv ≡ 1 (mod p-1)
    Dùng Extended Euclidean Algorithm
    """
    from math import gcd

    # Verify alpha là valid
    assert gcd(alpha, p - 1) == 1, f"alpha={alpha} không coprime với p-1"

    # Extended Euclidean: tìm x sao cho alpha * x ≡ 1 (mod p-1)
    def extended_gcd(a, b):
        if b == 0:
            return a, 1, 0
        g, x, y = extended_gcd(b, a % b)
        return g, y, x - (a // b) * y

    g, x, _ = extended_gcd(alpha, p - 1)
    assert g == 1
    alpha_inv = x % (p - 1)
    assert (alpha * alpha_inv) % (p - 1) == 1

    return alpha_inv

# BN254
p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
alpha = 5
alpha_inv = compute_alpha_inv(alpha, p_bn254)
print(f"alpha = {alpha}")
print(f"alpha_inv mod (p-1) = {alpha_inv}")
print(f"Verify: (alpha * alpha_inv) mod (p-1) = {(alpha * alpha_inv) % (p_bn254 - 1)}")
# => 1

# Goldilocks
p_goldilocks = 2**64 - 2**32 + 1
alpha_g = 7
alpha_inv_g = compute_alpha_inv(alpha_g, p_goldilocks)
print(f"\nGoldilocks: alpha={alpha_g}, alpha_inv={alpha_inv_g}")
print(f"Hamming weight của alpha_inv (số bit 1): {bin(alpha_inv_g).count('1')}")
# Hamming weight cao => cần nhiều squarings => đắt hơn forward S-box
```

**Tại sao inverse S-box đắt trong R1CS?** Hamming weight của $\alpha^{-1}$ (số bit 1 trong biểu diễn nhị phân) quyết định số phép nhân khi tính $x^{\alpha^{-1}}$ bằng square-and-multiply. Với $\alpha = 5$, $\alpha^{-1} \bmod (p-1)$ là một số rất lớn với nhiều bit 1 — thường cần **100+ phép nhân** cho một inverse S-box, so với 3 phép nhân cho $x^5$.

---

## Rescue-Prime — Simplification

Rescue-Prime (2020) là cải tiến và chuẩn hóa của Rescue, với spec đơn giản hơn và security proof chặt chẽ hơn.

> [!definition] Definition 7.4 — Rescue-Prime Permutation
> **Rescue-Prime** với state size $m$, $N$ rounds, trên $\mathbb{F}_p$ ($\alpha$ là S-box exponent):
>
> **Input**: $\vec{s} \in \mathbb{F}_p^m$
>
> **Mỗi round** $i = 0, \ldots, N-1$:
>
> $$\vec{s} \leftarrow \text{SBoxFwd}(\vec{s})$$
> $$\vec{s} \leftarrow M \cdot \vec{s}$$
> $$\vec{s} \leftarrow \vec{s} + \vec{C}_{2i}$$
> $$\vec{s} \leftarrow \text{SBoxInv}(\vec{s})$$
> $$\vec{s} \leftarrow M \cdot \vec{s}$$
> $$\vec{s} \leftarrow \vec{s} + \vec{C}_{2i+1}$$
>
> **Output**: $\vec{s}$

Khác biệt với Rescue-XLIX: Rescue-Prime có spec rõ ràng hơn về parameter generation và security claims.

**Sponge construction**:
- Rate: $r = m - c$ (capacity $c$ elements, thường $c = \lceil 2\lambda / \log_2 p \rceil$)
- Absorb: $\vec{s}[0:r] \leftarrow \vec{s}[0:r] + \text{chunk}$, sau đó apply permutation
- Squeeze: lấy $\vec{s}[0:r]$

---

## Python Implementation: Rescue-Prime

```python
from math import gcd

# Parameters cho Rescue-Prime trên Goldilocks field
# Theo Winterfell/Miden implementation
p = 2**64 - 2**32 + 1  # Goldilocks prime
m = 12   # state size (dùng trong Miden)
alpha = 7
r = 8    # rate
c = 4    # capacity (128-bit security: c >= 2*128/64 = 4)
N = 7    # number of rounds (theo STARK SFH survey)

def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y

def modinv(a, m):
    g, x, _ = extended_gcd(a % m, m)
    assert g == 1
    return x % m

# Tính alpha_inv
alpha_inv = modinv(alpha, p - 1)

def rescue_sbox_fwd(state, p, alpha):
    """Forward S-box: x -> x^alpha"""
    return [pow(x, alpha, p) for x in state]

def rescue_sbox_inv(state, p, alpha_inv):
    """Inverse S-box: x -> x^{alpha_inv}"""
    return [pow(x, alpha_inv, p) for x in state]

def mds_multiply(state, M, p):
    """Nhân state với MDS matrix"""
    m = len(state)
    result = [0] * m
    for i in range(m):
        for j in range(m):
            result[i] = (result[i] + M[i][j] * state[j]) % p
    return result

def rescue_prime_permutation(state, M, round_constants, alpha, alpha_inv, N, p):
    """
    Rescue-Prime permutation
    round_constants: list của 2*N*m constants
    """
    m = len(state)

    for i in range(N):
        # Half 1: Forward S-box -> MDS -> Add constants
        state = rescue_sbox_fwd(state, p, alpha)
        state = mds_multiply(state, M, p)
        for j in range(m):
            state[j] = (state[j] + round_constants[2*i*m + j]) % p

        # Half 2: Inverse S-box -> MDS -> Add constants
        state = rescue_sbox_inv(state, p, alpha_inv)
        state = mds_multiply(state, M, p)
        for j in range(m):
            state[j] = (state[j] + round_constants[(2*i+1)*m + j]) % p

    return state

# Demo với parameters nhỏ để chạy nhanh
# Lưu ý: p = 2^31-1 có p-1 chia hết cho 3, nên phải dùng alpha=5 (không dùng 3)
p_small = 2**31 - 1  # Mersenne prime (demo only)
m_small = 4
alpha_small = 5  # gcd(5, p-1) = 1 for Mersenne-31; không dùng alpha=3 ở đây
alpha_inv_small = modinv(alpha_small, p_small - 1)
N_small = 3

# Tạo MDS matrix đơn giản (Cauchy)
def cauchy_mds(m, p):
    M = []
    for i in range(m):
        row = []
        for j in range(m):
            d = (i + m + j) % p
            row.append(pow(d, p-2, p))  # modular inverse
        M.append(row)
    return M

import random
random.seed(42)
M_small = cauchy_mds(m_small, p_small)
constants_small = [random.randint(1, p_small-1) for _ in range(2 * N_small * m_small)]

# Test
state = [1, 2, 3, 4]  # 4 field elements
result = rescue_prime_permutation(
    state, M_small, constants_small,
    alpha_small, alpha_inv_small, N_small, p_small
)
print(f"Input state:  {state}")
print(f"Output state: {result}")
print("Rescue-Prime permutation: OK")

# Verify invertibility: apply inverse should give back original
# (by symmetry of the structure)
```

---

## Rescue trong AIR — Tại sao tốt cho STARKs

AIR (Algebraic Intermediate Representation) là constraint format của STARKs. Rescue được thiết kế đặc biệt để có AIR representation nhỏ gọn.

> [!definition] Definition 7.5 — Rescue AIR Constraints
> Trong Rescue, transition constraint cho một round có thể được viết dưới dạng đa thức bậc thấp:
>
> **Vấn đề với $x^{1/\alpha}$ trong AIR**: Constraint $y = x^{1/\alpha}$ tương đương $y^\alpha = x$ — đây là đa thức bậc $\alpha$ trong $y$, tức là **bậc thấp trong chiều nghịch**!
>
> Thay vì viết $y = x^{\alpha^{-1}}$, ta viết:
> $$y^\alpha - x = 0$$
> Đây là constraint bậc $\alpha$ — ví dụ với $\alpha = 7$, constraint có degree 7, chấp nhận được trong AIR (thường cho phép degree đến vài chục).

**So sánh representation trong AIR**:

| | Poseidon | Rescue-Prime |
|--|---------|-------------|
| AIR degree per step | $\alpha$ | $\max(\alpha, \alpha) = \alpha$ |
| Partial rounds | Có | Không (all full) |
| AIR columns cần | $t$ | $t$ |
| Rounds cần | $R_F + R_P$ | $N$ (ít hơn vì full rounds mạnh hơn) |

Rescue-Prime với state $m=12$, $N=7$ rounds (Goldilocks): Mỗi round là 2 lớp S-boxes (12 forward + 12 backward) + 2 MDS = 24 nonlinear operations. Tổng: $7 \times 24 = 168$ nonlinear ops — nhiều hơn Poseidon nhưng AIR degree chỉ là 7.

---

## So sánh Rescue vs Poseidon

| Tiêu chí | Rescue-Prime | Poseidon |
|----------|-------------|---------|
| S-box | $x^\alpha$ + $x^{1/\alpha}$ (cả hai) | Chỉ $x^\alpha$ |
| All full rounds | Có | Không (partial rounds) |
| R1CS constraints | Cao (~5x Poseidon) | Thấp (~240, t=3) |
| AIR suitability | Xuất sắc | Tốt |
| STARK efficiency | Rất tốt | Tốt |
| SNARK efficiency | Kém | Xuất sắc |
| Security argument | Chặt chẽ hơn | Tốt (HADES) |
| Adoption STARK | Winterfell, Miden | StarkNet (Goldilocks) |
| Adoption SNARK | Ít | zkSync, Zcash, Polygon |

> [!note] Note 7.6 — Rescue-Prime Optimized (RPO)
> Rescue-Prime Optimized (RPO) là variant tối ưu dùng Goldilocks field với $m=12$, được Polygon Miden dùng. RPO giảm số rounds xuống 7 (thay vì 14) và tối ưu constants, cho throughput tốt hơn trong native STARK execution.

---

## Attack Surfaces của Rescue

### 1. Algebraic Attack via CICO Problem

> [!warning] Warning 7.7 — CICO Problem Attack
> **CICO (Constrained Input Constrained Output)** problem: Cho constraint trên input và output của Rescue permutation, tìm input thỏa mãn.
>
> StarkWare đã có analysis chính thức về CICO complexity cho Rescue. Nếu số rounds quá ít, algebraic complexity của CICO attack thấp hơn brute force.
>
> **Bug pattern**: Dùng Rescue với $N=3$ hoặc $N=4$ rounds (có vẻ "đủ" theo tính toán sơ bộ) nhưng thực tế không đủ margin cho CICO attacks với state nhỏ.

### 2. Round Constant Generation

Tương tự MiMC, Rescue cần round constants được generate một cách transparent:

```python
# Round constant generation cho Rescue-Prime (Goldilocks)
import hashlib

def rescue_prime_constants(m, N, p, seed="Rescue-STARK"):
    """Generate 2*N*m round constants"""
    constants = []
    for i in range(2 * N * m):
        h = int(hashlib.shake_256(f"{seed}{i}".encode()).hexdigest(32), 16) % p
        constants.append(h)
    return constants

# Quan trọng: nếu seed thay đổi, tất cả constants thay đổi
# => Output hash thay đổi hoàn toàn
# Phải dùng ĐÚNG seed match với spec
```

### 3. Invariant Subspace (Less Applicable)

Rescue ít bị ảnh hưởng hơn MiMC bởi invariant subspace attacks vì structure đối xứng của nó, nhưng một số analytical papers đã tìm thấy các đặc tính algebraic nhất định.

---

## Rescue-XLIX trong STARK: Anatomy of a STARK

Tutorial nổi tiếng nhất về Rescue trong STARKs là "Anatomy of a STARK" của Alan Szepieniec (tác giả Rescue-Prime). Đây là bài học thực hành tốt nhất:

```python
# Từ Anatomy of a STARK Part 5
# https://aszepieniec.github.io/stark-anatomy/rescue-prime.html

class RescuePrime:
    def __init__(self):
        # Tham số đơn giản cho tutorial
        self.p = 407 * (1 << 119) + 1  # 128-bit prime
        self.m = 2         # state size
        self.rate = 1      # rate
        self.capacity = 1  # capacity
        self.alpha = 3     # S-box exponent
        # alpha_inv computed separately
        self.N = 27        # rounds cho 128-bit security với m=2

    def hash(self, input_element):
        """Hash một field element"""
        # Absorb
        state = [input_element, self.p - 1]  # capacity init = -1 (domain sep)
        state = self.permutation(state)
        # Squeeze
        return state[0]  # output là rate element

    def permutation(self, state):
        # ... (full implementation trong tutorial)
        pass
```

---

## Summary / Key Takeaways

- **Rescue/Marvellous**: Dùng cả $x^\alpha$ (forward) và $x^{1/\alpha}$ (backward) S-box trong cùng round — bảo vệ từ cả hai hướng tấn công
- **Rescue-Prime**: Version chuẩn hóa với spec rõ ràng hơn, được StarkWare recommend
- **Tại sao tốt cho STARK**: Inverse S-box $y = x^{1/\alpha}$ ↔ constraint $y^\alpha = x$ có degree $\alpha$ — thấp trong AIR
- **Tại sao kém cho SNARK**: $x^{1/\alpha}$ có Hamming weight cao → nhiều R1CS constraints (~5x Poseidon)
- **Adoption**: Winterfell/Polygon Miden (Rescue-Prime trên Goldilocks), Ethereum SFH challenge (đề xuất Rescue)
- **Security**: Argument chặt chẽ hơn Poseidon vì không có partial rounds — nhưng mỗi round đắt hơn

---

## References

- Ashur, Dhooghe, Szepieniec — *Rescue-Prime: a Standard Specification* (eprint.iacr.org/2020/1143)
- Aly et al. — *Marvellous: a STARK-Friendly Family of Cryptographic Primitives* (FSE 2020)
- Ben-Sasson, Goldberg — *STARK Friendly Hash Survey and Recommendation* (eprint.iacr.org/2020/948)
- Szepieniec — *Anatomy of a STARK, Part 5: A Rescue-Prime STARK* (aszepieniec.github.io)
- itzmeanjan/rescue-prime — C++ implementation cho Goldilocks (github.com)
- Beyne, Canteaut et al. — *On the security of the Rescue hash function* (IACR 2022)
