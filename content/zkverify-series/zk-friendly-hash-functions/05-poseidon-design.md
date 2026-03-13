---
title: "05. Poseidon — Thiết kế (Phần 1)"
tags: [cryptography, zk-hash, poseidon, hades, lesson-05]
aliases: [Poseidon Design]
created: 2026-03-13
---

> **Prerequisites**: [[02-zk-proof-systems-circuits|02. ZK Proof Systems]], [[03-zk-friendly-criteria|03. Tiêu chí ZK-Friendly]], [[04-mimc-gmimc|04. MiMC & GMiMC]]
> **Objectives**:
> - Hiểu hoàn toàn HADES design strategy và tại sao nó cải thiện hiệu quả so với MiMC
> - Nắm kiến trúc Poseidon: full rounds, partial rounds, S-box, MDS matrix, round constants
> - Phân tích security argument của Poseidon theo từng attack class
> - Tính toán được tham số (số rounds) cho mức bảo mật cho trước

---

## Motivation

Poseidon là hash function ZK-friendly quan trọng nhất hiện tại, được đề xuất bởi Grassi et al. tại USENIX Security 2021. Nó được sử dụng trong:
- **zkSync Era** (ZK-EVM Ethereum L2)
- **StarkNet** (với biến thể cho Goldilocks field)
- **Filecoin** (proof of storage)
- **Polygon Hermez/zkEVM**
- **Zcash** (trong các protocol mới)
- Hầu hết các ZK Merkle tree implementations hiện đại

Poseidon không chỉ hiệu quả hơn MiMC ~2.7x, nó còn có **security argument chặt chẽ hơn** nhờ HADES strategy — cấu trúc kết hợp full rounds và partial rounds một cách khéo léo.

---

## HADES Design Strategy

HADES (HAsh DESign) là framework tổng quát, Poseidon là instantiation của nó với S-box là power map.

> [!definition] Definition 5.1 — HADES Strategy
> **HADES** là Substitution-Permutation Network (SPN) với $R = R_F + R_P$ rounds tổng, trong đó:
>
> - $R_F$ **full rounds**: Áp dụng S-box cho **tất cả** $t$ phần tử của state
> - $R_P$ **partial rounds**: Chỉ áp dụng S-box cho **một phần tử** (thường là phần tử đầu tiên)
>
> Mỗi round gồm ba bước:
> 1. **AddRoundConstants (ARC)**: $x_i \leftarrow x_i + c_i$
> 2. **SubWords (S-box layer)**: Áp dụng nonlinear S-box
> 3. **MixLayer (linear layer)**: Nhân với MDS matrix $M$

**Tại sao chia thành full và partial rounds?** Đây là key insight:

```
Full round:   [ARC] → [S S S ... S] → [MDS]   ← tốn nhiều constraint
Partial round:[ARC] → [S . . ... .] → [MDS]   ← chỉ 1 S-box, ít constraint
```

- **Full rounds** (đầu và cuối) đảm bảo **algebraic degree** cao — bảo vệ chống các attack cần degree thấp
- **Partial rounds** (giữa) tăng **diffusion** và số rounds mà không tốn nhiều phép nhân

> [!theorem] Theorem 5.2 — Security từ HADES Structure
> Với đủ full rounds $R_F$ và partial rounds $R_P$:
> - Chống **differential/linear cryptanalysis**: Đảm bảo bởi MDS matrix (xem Lesson 11)
> - Chống **algebraic attacks**: Đảm bảo bởi algebraic degree sau $R_F$ full rounds
> - Chống **Gröbner basis**: Đảm bảo bởi số phương trình không đủ để solve hệ
> - Chống **interpolation**: Degree đủ cao sau toàn bộ rounds

---

## Poseidon Permutation: Chi tiết đầy đủ

### State và Tham số

> [!definition] Definition 5.3 — Poseidon Parameters
> **Poseidon$_\pi$** là permutation trên state $\vec{x} \in \mathbb{F}_p^t$ với tham số:
>
> | Tham số | Ký hiệu | Ý nghĩa |
> |---------|---------|---------|
> | State size | $t$ | Số field elements trong state |
> | S-box exponent | $\alpha$ | Bậc của power map; $\alpha = 5$ cho BN254 |
> | Full rounds | $R_F$ | Thường $R_F = 8$ (chẵn, chia đôi) |
> | Partial rounds | $R_P$ | Phụ thuộc vào $t$ và target security |
> | Round constants | $\vec{c}_i$ | $t$ constants mỗi round, generate từ seed |
> | MDS matrix | $M$ | $t \times t$ matrix, Maximum Distance Separable |
>
> **Capacity**: $c = t - r$ field elements, với $r$ là **rate** (số elements absorb mỗi lần). Để đạt 128-bit security, $c \geq 2$ (tức $t \geq r + 2$).

### Một Round Đầy Đủ

**Full round** $i$ (với $0 \leq i < R_F/2$ hoặc $R - R_F/2 \leq i < R$):

$$\vec{x} \leftarrow M \cdot S_{\text{full}}(\vec{x} + \vec{c}_i)$$

trong đó $S_{\text{full}}(\vec{x}) = (x_0^\alpha, x_1^\alpha, \ldots, x_{t-1}^\alpha)$.

**Partial round** $i$ (với $R_F/2 \leq i < R - R_F/2$):

$$\vec{x} \leftarrow M \cdot S_{\text{partial}}(\vec{x} + \vec{c}_i)$$

trong đó $S_{\text{partial}}(\vec{x}) = (x_0^\alpha, x_1, x_2, \ldots, x_{t-1})$ — chỉ S-box trên $x_0$.

**Cấu trúc toàn bộ permutation**:

```
Input x ∈ F_p^t
    │
    ▼
┌─────────────────────────────────────────┐
│   R_F/2 Full Rounds                     │
│   [ARC] → [SSSS...S] → [MDS]            │ ← 4 rounds (mặc định)
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│   R_P Partial Rounds                    │
│   [ARC] → [S.......] → [MDS]            │ ← 57 rounds (t=3, BN254)
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│   R_F/2 Full Rounds                     │
│   [ARC] → [SSSS...S] → [MDS]            │ ← 4 rounds
└─────────────────────────────────────────┘
    │
    ▼
Output x ∈ F_p^t
```

---

## S-box: Power Map

> [!definition] Definition 5.4 — Poseidon S-box
> **Poseidon S-box** là hàm $\sigma: \mathbb{F}_p \to \mathbb{F}_p$ được định nghĩa là:
>
> $$\sigma(x) = x^\alpha$$
>
> với $\alpha$ được chọn là số nguyên dương nhỏ nhất sao cho $\gcd(\alpha, p-1) = 1$.
>
> Điều kiện $\gcd(\alpha, p-1) = 1$ đảm bảo $x^\alpha$ là **bijection** (permutation) trên $\mathbb{F}_p^*$.

**Chọn $\alpha$ cho các trường phổ biến**:

```python
from math import gcd

def find_alpha(p, preferred=[3, 5, 7, 11]):
    """Tìm alpha nhỏ nhất hợp lệ"""
    for a in preferred:
        if gcd(a, p - 1) == 1:
            return a
    # Fallback: tìm số nguyên tố nhỏ nhất coprime với p-1
    a = 3
    while True:
        if gcd(a, p - 1) == 1:
            return a
        a += 2

# BN254 scalar field
p_bn254 = 21888242871839275222246405745257275088548364400416034343698204186575808495617
alpha_bn254 = find_alpha(p_bn254)
print(f"BN254: alpha = {alpha_bn254}")  # 5

# BLS12-381 scalar field
p_bls = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001
alpha_bls = find_alpha(p_bls)
print(f"BLS12-381: alpha = {alpha_bls}")  # 5

# Goldilocks field (p = 2^64 - 2^32 + 1)
p_goldilocks = 2**64 - 2**32 + 1
alpha_goldilocks = find_alpha(p_goldilocks)
print(f"Goldilocks: alpha = {alpha_goldilocks}")  # 7
```

**Tại sao $\alpha = 5$ cho BN254?**

$x^5$ cần:
1. $t_1 = x \cdot x = x^2$ (1 mult)
2. $t_2 = t_1 \cdot t_1 = x^4$ (1 mult)
3. $\text{out} = t_2 \cdot x = x^5$ (1 mult)

Tổng: **3 phép nhân** — đây là số phép nhân tối thiểu cho $x^5$.

---

## Round Constants

> [!definition] Definition 5.5 — Round Constant Generation
> Round constants của Poseidon được generate theo **grain LFSR** (Linear Feedback Shift Register):
>
> 1. Khởi tạo LFSR với seed encoding các tham số $(p, \alpha, t, R_F, R_P)$
> 2. Chạy LFSR để tạo bits ngẫu nhiên
> 3. Convert sang field elements và filter để đảm bảo phân bố đều
>
> **Tại sao quan trọng**: Constants phải phụ thuộc vào tất cả tham số — nếu thay đổi $p$ hay $\alpha$ mà dùng cùng constants, security argument không còn valid.

```python
# Minh họa simplified constant generation (không phải full Grain LFSR)
# Trong thực tế dùng script từ https://github.com/ingonyama-zk/poseidon-hash

import hashlib

def poseidon_constants_simple(p, t, R_F, R_P, seed_str="poseidon"):
    """Simplified round constant generation (for illustration)"""
    total_rounds = R_F + R_P
    constants = []
    seed = f"{seed_str}_{p}_{t}_{R_F}_{R_P}".encode()

    for i in range(total_rounds * t):
        h = hashlib.sha256(seed + i.to_bytes(4, 'big')).digest()
        val = int.from_bytes(h, 'big') % p
        constants.append(val)

    return constants

# Ví dụ với tham số nhỏ để minh họa
p_small = 2**61 - 1  # Mersenne prime (chỉ để demo)
constants = poseidon_constants_simple(p_small, t=3, R_F=8, R_P=4)
print(f"Số constants: {len(constants)}")  # (8+4)*3 = 36
```

---

## MDS Matrix

> [!definition] Definition 5.6 — MDS Matrix
> Ma trận $M \in \mathbb{F}_p^{t \times t}$ là **MDS (Maximum Distance Separable)** nếu mọi ma trận con vuông của nó đều khả nghịch.
>
> Tương đương: **branch number** của $M$ là $B(M) = t + 1$ (giá trị tối đa có thể). *(Định nghĩa đầy đủ và chứng minh tại [[11-mds-matrix-diffusion|11. MDS Matrix & Diffusion Layer]].)*
>
> $$B(M) = \min_{\vec{x} \neq 0} \left( \text{wt}(\vec{x}) + \text{wt}(M\vec{x}) \right)$$
>
> trong đó $\text{wt}$ là Hamming weight.

**Tại sao MDS là bắt buộc?** MDS matrix đảm bảo rằng nếu $k$ phần tử của input state bằng 0 và $t-k$ phần tử nonzero, thì sau linear layer, tất cả $t$ phần tử đều nonzero. Điều này ngăn chặn các tấn công dựa trên "propagating zeros".

### Cách xây dựng MDS matrix cho Poseidon

Poseidon dùng **Cauchy matrix** hoặc **circulant matrix**:

**Cauchy matrix**: $M_{ij} = \frac{1}{x_i + y_j}$ với $x_i, y_j$ phân biệt trong $\mathbb{F}_p$.

```python
def cauchy_mds_matrix(t, p):
    """
    Xây dựng t×t Cauchy MDS matrix trên F_p
    Mọi Cauchy matrix với x_i, y_j phân biệt đều là MDS
    """
    # Chọn x_i = 0, 1, ..., t-1 và y_j = t, t+1, ..., 2t-1
    x = list(range(t))
    y = list(range(t, 2*t))

    M = []
    for i in range(t):
        row = []
        for j in range(t):
            # M[i][j] = 1 / (x_i + y_j) mod p
            denom = (x[i] + y[j]) % p
            # Modular inverse
            inv = pow(denom, p - 2, p)  # Fermat's little theorem
            row.append(inv)
        M.append(row)
    return M

# Test với t=3, p nhỏ
p_test = 101  # prime
M = cauchy_mds_matrix(3, p_test)
print("MDS Matrix (Cauchy):")
for row in M:
    print([f"{x:3d}" for x in row])

# Verify: mọi submatrix 2x2 phải khả nghịch
def det2x2(a, b, c, d, p):
    return (a*d - b*c) % p

# Kiểm tra một submatrix 2x2
d = det2x2(M[0][0], M[0][1], M[1][0], M[1][1], p_test)
print(f"Det of top-left 2x2: {d} (should be nonzero)")
assert d != 0, "MDS property violated!"
print("MDS property: OK")
```

> [!warning] Warning 5.7 — Insecure MDS Matrix
> Không phải mọi invertible matrix đều là MDS. Nếu branch number $B(M) < t + 1$, tồn tại input vector với ít active S-boxes, làm yếu security. Phải verify MDS property trước khi dùng.

---

## Tính Số Rounds

Security requirements quyết định số rounds. Paper Poseidon (updated 2023) dùng các bounds:

> [!definition] Definition 5.8 — Round Bounds cho Poseidon
> Số rounds tối thiểu để đạt 128-bit security:
>
> **Full rounds** $R_F$: Cần đủ để chống statistical attacks:
> $$R_F \geq 6 \quad \text{(in practice: } R_F = 8 \text{)}$$
>
> **Partial rounds** $R_P$: Cần đủ để algebraic degree $\geq 2^{128}$:
> $$R_P \geq \frac{128 + \log_2 t}{\log_2 \alpha} - R_F$$
>
> Với $\alpha = 5, t = 3$: $R_P \geq (128 + 1.58) / 2.32 - 8 \approx 47$. Safety margin thêm 10 rounds: $R_P = 57$.

```python
import math

def poseidon_min_rounds(alpha, t, security_bits=128, safety_margin=10):
    """
    Tính số rounds tối thiểu cho Poseidon
    Theo Poseidon paper (USENIX 2021, updated bounds)
    """
    # Full rounds: cố định theo recommendation
    R_F = 8  # 4 đầu + 4 cuối

    # Partial rounds: từ interpolation attack bound
    # Degree sau R rounds: alpha^(R_F + R_P)
    # Cần: alpha^R > 2^(security_bits + log2(t))
    min_partial = math.ceil(
        (security_bits + math.log2(t)) / math.log2(alpha)
    ) - R_F + safety_margin

    return R_F, max(min_partial, 0)

# Tính cho các configs phổ biến
configs = [
    ("BN254, t=2", 5, 2),
    ("BN254, t=3", 5, 3),
    ("BN254, t=5", 5, 5),
    ("Goldilocks, t=3", 7, 3),
    ("Goldilocks, t=5", 7, 5),
]

print(f"{'Config':<25} {'R_F':>5} {'R_P':>5} {'Total':>7}")
print("-" * 45)
for name, alpha, t in configs:
    rf, rp = poseidon_min_rounds(alpha, t)
    print(f"{name:<25} {rf:>5} {rp:>5} {rf+rp:>7}")
```

**Bảng tham số thực tế** (theo Poseidon spec):

| Field | $t$ | $\alpha$ | $R_F$ | $R_P$ | Ứng dụng |
|-------|-----|----------|-------|-------|----------|
| BN254 | 2 | 5 | 8 | 56 | Hash 1 input |
| BN254 | 3 | 5 | 8 | 57 | Hash 2 inputs (Merkle) |
| BN254 | 5 | 5 | 8 | 60 | Hash 4 inputs |
| BLS12-381 | 3 | 5 | 8 | 57 | Zcash, Filecoin |
| Goldilocks | 3 | 7 | 8 | 22 | StarkNet |
| Goldilocks | 8 | 7 | 8 | 22 | Poseidon RPO |

---

## Poseidon Hash Function (Sponge Mode)

Permutation Poseidon$_\pi$ được bọc trong sponge để xây dựng hash function:

> [!definition] Definition 5.9 — Poseidon Hash
> Với state size $t = r + c$ ($r$ rate, $c$ capacity):
>
> **Initialization**: $\vec{x} = \vec{0}$
>
> **Absorb**: Với mỗi chunk $r$ field elements của input:
> $$\vec{x}[0:r] \leftarrow \vec{x}[0:r] + \text{chunk}$$
> $$\vec{x} \leftarrow \text{Poseidon}_\pi(\vec{x})$$
>
> **Squeeze**: Output là $\vec{x}[0:r]$ (hoặc chỉ $\vec{x}[0]$ nếu output là 1 element)

**Ví dụ phổ biến nhất**: Poseidon với $t=3, r=2, c=1$ (2 inputs, 1 output). Không cần absorb nhiều lần nếu input $\leq 2$ field elements.

```python
def poseidon_permutation(state, round_constants, mds_matrix, alpha, R_F, R_P, p):
    """
    Poseidon permutation đầy đủ
    state: list t field elements
    """
    t = len(state)
    total_rounds = R_F + R_P
    const_idx = 0

    for round_num in range(total_rounds):
        # Step 1: AddRoundConstants
        state = [(state[i] + round_constants[const_idx + i]) % p
                 for i in range(t)]
        const_idx += t

        # Step 2: S-box layer
        is_full = (round_num < R_F // 2) or (round_num >= total_rounds - R_F // 2)

        if is_full:
            # Full round: apply S-box to all elements
            state = [pow(x, alpha, p) for x in state]
        else:
            # Partial round: apply S-box to first element only
            state = [pow(state[0], alpha, p)] + state[1:]

        # Step 3: MDS matrix multiplication
        new_state = []
        for i in range(t):
            val = sum(mds_matrix[i][j] * state[j] for j in range(t)) % p
            new_state.append(val)
        state = new_state

    return state

# Demo với parameters nhỏ (không phải production-safe)
p_demo = 2**31 - 1  # Mersenne prime
t_demo = 3
alpha_demo = 5
R_F_demo = 4
R_P_demo = 4
total = R_F_demo + R_P_demo

# Dummy constants và matrix (chỉ để minh họa cấu trúc)
import random
random.seed(42)
constants_demo = [random.randint(1, p_demo-1) for _ in range(total * t_demo)]
mds_demo = cauchy_mds_matrix(t_demo, p_demo)

state = [1, 2, 0]  # input [1, 2], capacity init 0
result = poseidon_permutation(state, constants_demo, mds_demo, alpha_demo, R_F_demo, R_P_demo, p_demo)
print(f"Poseidon({1}, {2}) = {result[0]}")
```

---

## So sánh Poseidon vs MiMC — Deep Dive

**Tại sao Poseidon hiệu quả hơn MiMC với nhiều inputs?**

MiMC xử lý từng input **tuần tự** — mỗi input thêm đầy đủ 91 rounds.

Poseidon xử lý $r$ inputs **song song** trong cùng state — $r-1$ inputs thêm vào không tốn thêm rounds.

```
MiMC hash(a, b, c):
  h1 = MiMC(a, k=0)
  h2 = MiMC(b, k=h1)
  h3 = MiMC(c, k=h2)
  => 3 * 91 rounds = 273 rounds total

Poseidon hash(a, b, c) với t=4, r=3:
  state = [a, b, c, 0]
  state = Poseidon_pi(state)
  => 1 permutation = R_F + R_P rounds
```

---

## Summary / Key Takeaways

- **HADES strategy**: Kết hợp full rounds (tất cả S-boxes) và partial rounds (1 S-box) để tối ưu security/efficiency
- **Full rounds**: Bảo vệ algebraic degree; **Partial rounds**: Tăng diffusion với chi phí thấp
- **S-box $x^\alpha$** ($\alpha = 5$ cho BN254): Power map bậc thấp nhất, 3 phép nhân
- **MDS matrix**: Đảm bảo diffusion hoàn toàn — phải verify branch number = $t+1$
- **Round constants**: Generate từ Grain LFSR với seed encode tham số — **PHẢI** dùng đúng constants cho đúng trường
- **Số rounds**: $R_F = 8$ full, $R_P \approx 57$ partial (t=3, BN254) — giảm xuống là bug bảo mật

---

## References

- Grassi, Khovratovich, Rechberger, Roy, Schofnegger — *POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems* (USENIX Security 2021, eprint.iacr.org/2019/458)
- Grassi et al. — *Poseidon2: A Faster Version of the Poseidon Hash Function* (eprint.iacr.org/2023/323)
- Grassi et al. — *HADES: A Hash Function for SNARK-friendly Computations* (EUROCRYPT 2020)
- Poseidon parameter generator — https://github.com/ingonyama-zk/poseidon-hash
- RareSkills — *Poseidon Hash Explained* (rareskills.io)
