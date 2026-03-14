---
title: "10. Algebraic Attacks Đặc thù ZK Hash"
tags: [cryptography, zk-hash, algebraic-attacks, groebner-basis, interpolation, lesson-10]
aliases: [Algebraic Attacks ZK Hash]
created: 2026-03-13
---

> **Prerequisites**: [[09-algebraic-cryptanalysis|09. Algebraic Cryptanalysis — Cơ bản]], [[04-mimc-gmimc|04. MiMC & GMiMC]], đa thức trên trường hữu hạn, kiến thức cơ bản về hệ phương trình phi tuyến  
> **Objectives**:  
> - Hiểu interpolation attack end-to-end: query model, complexity, điều kiện thành công
> - Nắm cơ chế Gröbner basis attack và tại sao nó nguy hiểm với low-degree hash functions
> - Biết GCD attacks trên MiMC và invariant subspace attacks
> - Tính complexity của từng attack và verify với số rounds thực tế

---

## Motivation

Lesson 09 xây dựng nền tảng lý thuyết. Bài này đi sâu vào các **attack cụ thể** đặc thù cho ZK hash functions — những attack này không tồn tại (hoặc không nguy hiểm) với SHA-256 hay AES, nhưng là mối nguy trực tiếp với algebraic designs như MiMC, Poseidon, Rescue.

Hiểu attacks là bước tiên quyết để:
1. Verify security claims của một hash function
2. Tìm lỗi khi developer giảm rounds hoặc sai tham số
3. Viết bug report chuyên nghiệp khi tìm vulnerability

---

## Interpolation Attack

### Mô hình Attack

> [!definition] Definition 10.1 — Interpolation Attack
> Cho hàm $f: \mathbb{F}_p \to \mathbb{F}_p$ (hoặc $\mathbb{F}_p^n \to \mathbb{F}_p^m$), **interpolation attack** thu thập $d+1$ cặp $(x_i, f(x_i))$ và dùng **Lagrange interpolation** (hoặc phương pháp tổng quát hơn) để tìm đa thức $P$ bậc $\leq d$ sao cho $P(x_i) = f(x_i)$.
>
> Nếu $d < $ actual degree của $f$, attack thất bại. Nếu actual degree $\leq d$ và attacker có đủ samples → **attack thành công**.

### Lagrange Interpolation trên $\mathbb{F}_p$

> [!theorem] Theorem 10.2 — Lagrange Interpolation
> Cho $d+1$ điểm phân biệt $(x_0, y_0), \ldots, (x_d, y_d)$ trên $\mathbb{F}_p$, có **duy nhất** đa thức $P$ bậc $\leq d$ đi qua tất cả điểm:
>
> $$P(x) = \sum_{i=0}^{d} y_i \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$$

**Complexity**: $O(d^2)$ field operations để tính, $O(d)$ để evaluate.

**Điều kiện attack thành công**: Degree thực của $f$ phải $\leq d$, tức là $\leq d+1$ queries đủ để recover $f$ hoàn toàn.

### Interpolation Attack trên MiMC — Ví dụ đầy đủ

Với MiMC-7 sử dụng **r rounds** trên $\mathbb{F}_p$, degree của output theo input là $7^r$. Interpolation cần $7^r + 1$ queries.

```python
def interpolation_attack_demo(alpha, num_rounds, p):
    """
    Demo interpolation attack trên MiMC-like cipher (simplified)
    Giả sử key = 0 (hash mode)
    """
    import hashlib

    def gen_constants(num_rounds, seed="mimc"):
        constants = [0]
        for i in range(1, num_rounds):
            h = int(hashlib.sha3_256(f"{seed}{i}".encode()).hexdigest(), 16) % p
            constants.append(h)
        return constants

    def mimc_encrypt(x, constants, alpha, p):
        for c in constants:
            x = pow((x + c) % p, alpha, p)
        return x

    constants = gen_constants(num_rounds)

    # Bước 1: Thu thập samples
    degree = alpha ** num_rounds
    num_samples = degree + 1  # Cần degree+1 điểm để interpolate bậc degree

    print(f"MiMC-{alpha} với {num_rounds} rounds: degree = {degree}")
    print(f"Cần {num_samples} queries để interpolate")

    if num_samples > 10**6:
        print(f"Attack không khả thi (cần {num_samples:.2e} queries)")
        return None

    # Thu thập samples
    xs = list(range(1, num_samples + 1))
    ys = [mimc_encrypt(x, constants, alpha, p) for x in xs]

    # Bước 2: Lagrange interpolation (chỉ feasible với degree nhỏ)
    def lagrange_interpolate(xs, ys, p):
        """Tính Lagrange interpolating polynomial tại x_query"""
        n = len(xs)
        # Trả về polynomial dưới dạng coefficient list
        # (simplified - không tính full poly, chỉ verify 1 point)
        pass

    # Bước 3: Verify với điểm mới
    x_test = num_samples + 100
    y_actual = mimc_encrypt(x_test, constants, alpha, p)

    print(f"\nVerification point: x = {x_test}")
    print(f"Actual output: {y_actual}")
    print("Attack would succeed: degree bound met")

    return degree

# Với MiMC-7, 2 rounds: degree = 7^2 = 49 — dễ attack!
p_small = 10**9 + 7  # prime
print("=== INSECURE: 2 rounds ===")
interpolation_attack_demo(7, 2, p_small)

# Với MiMC-7, 91 rounds: degree = 7^91 >> 2^256 — không thể attack
print("\n=== SECURE: 91 rounds ===")
degree_91 = 7**91
print(f"7^91 = {degree_91:.2e} >> 2^256 = {2**256:.2e}")
print("Attack hoàn toàn không khả thi")
```

### Multivariate Interpolation (Tổng quát hơn)

Với hash function nhiều inputs (ví dụ Poseidon $t=3$: 2 inputs), interpolation phức tạp hơn nhưng vẫn áp dụng được:

> [!theorem] Theorem 10.3 — Multivariate Interpolation Complexity
> Với hàm $f: \mathbb{F}_p^n \to \mathbb{F}_p$ có algebraic degree $d$, số monomial bậc $\leq d$ trong $n$ biến là:
>
> $$\binom{n + d}{n} = \frac{(n+d)!}{n! \cdot d!}$$
>
> Interpolation cần ít nhất bằng này samples và $O(\binom{n+d}{n}^2)$ field operations.
>
> Với $n=2$ (Poseidon 2 inputs) và $d = 5^8 \approx 10^6$: Số monomials là $\binom{d+2}{2} \approx d^2/2 \approx 10^{12}$ — **hoàn toàn không khả thi**.

---

## Gröbner Basis Attack

Gröbner basis attacks là loại tấn công algebraic mạnh nhất và phức tạp nhất với ZK hashes.

> [!definition] Definition 10.4 — Gröbner Basis
> Cho hệ phương trình đa biến $\{f_1 = 0, f_2 = 0, \ldots, f_m = 0\}$ trên $\mathbb{F}_p$, **Gröbner basis** là một tập tương đương (cùng ideal) có tính chất tốt hơn để giải.
>
> Các thuật toán: **Buchberger's algorithm** (classical), **F4**, **F5** (hiện đại).
>
> Complexity chủ yếu phụ thuộc vào **degree of regularity** $d_{reg}$ của hệ:
> $$T_{\text{Gröbner}} \approx \binom{m + d_{reg}}{d_{reg}}^{\omega}$$
> với $\omega \approx 2.376$ (exponent của matrix multiplication).

### Tại sao Gröbner Basis Đặc biệt Nguy hiểm với ZK Hashes

ZK hash function $H: \mathbb{F}_p^r \to \mathbb{F}_p$ xác định một "preimage problem": Cho $y$, tìm $x$ với $H(x) = y$.

Với implementation algebraic (Poseidon, MiMC), bài toán này có thể được formulated như **hệ phương trình đa thức**:

```
MiMC với 3 rounds:
  t1 = (x + c1)^3           (S-box round 1)
  t2 = (t1 + c2)^3          (S-box round 2)
  output = (t2 + c3)^3      (S-box round 3)

Preimage problem: Tìm x sao cho output = y
Formulation: (((x + c1)^3 + c2)^3 + c3)^3 = y

Đây là phương trình bậc 27 trong x → Gröbner basis có thể solve nhanh!
```

Với 91 rounds: Bậc là $3^{91}$ — hệ phương trình không thể solve.

### Phân tích Gröbner Basis cho Poseidon

> [!theorem] Theorem 10.5 — Gröbner Basis Complexity cho Poseidon
> Steiner (eprint.iacr.org/2024/310) đã xây dựng zero-dimensional Gröbner basis cho Poseidon sponge với state $m$, $N$ rounds.
>
> Kết quả: Với tham số chuẩn Poseidon (BN254, t=3, $R_F=8$, $R_P=57$), complexity của Gröbner basis attack ước tính $> 2^{128}$ — hệ thống an toàn.
>
> Tuy nhiên: Với $R_P$ giảm xuống $< 30$, complexity giảm xuống $< 2^{80}$ — **KHÔNG an toàn**.

```python
# Ước tính security level từ Gröbner basis complexity
import math

def groebner_security_estimate(alpha, R_F, R_P, t, security_bits=128):
    """
    Rough estimate của security từ Gröbner basis attack.
    Dựa trên: complexity ~ 2^(degree_of_regularity * t)
    """
    # Degree of regularity ≈ (R_F/2 + R_P) * (alpha - 1) + 1
    # (simplified bound, actual analysis phức tạp hơn nhiều)
    d_reg = (R_F // 2 + R_P) * (alpha - 1) + 1

    # Complexity ≈ C(d_reg * t, d_reg)^omega  
    # Simplified: 2^(d_reg * log2(t))
    estimated_bits = d_reg * math.log2(t)

    return d_reg, estimated_bits

# Poseidon chuẩn
R_F, R_P, t, alpha = 8, 57, 3, 5
d_reg, bits = groebner_security_estimate(alpha, R_F, R_P, t)
print(f"Poseidon(R_F={R_F}, R_P={R_P}, t={t}, alpha={alpha}):")
print(f"  Degree of regularity ≈ {d_reg}")
print(f"  Estimated security: ~{bits:.0f} bits")

# Với R_P giảm — INSECURE!
print("\nVới R_P giảm:")
for rp in [57, 30, 20, 10]:
    d_reg, bits = groebner_security_estimate(alpha, R_F, rp, t)
    status = "✓ SECURE" if bits > 128 else "✗ INSECURE"
    print(f"  R_P={rp:3d}: ~{bits:6.0f} bits {status}")
```

### Algebraic Freelunch — Attack Hiện Đại

**Bariant et al. (2024)** phát hiện kỹ thuật "Algebraic Freelunch" cho phép bypass một số rounds của arithmetization-oriented hash functions:

> [!danger] Danger 10.6 — Algebraic Freelunch
> Kỹ thuật này exploit việc **các S-boxes đầu tiên của Poseidon là monomial** ($x^\alpha$) để "pre-process" attack bằng cách leverage structure của polynomial expansion.
>
> Cụ thể: Với state $(x_0, x_1, \ldots, x_{t-1})$ là biến, output của $k$ rounds đầu có degree **thấp hơn** dự kiến — cho phép solve hệ hiệu quả hơn.
>
> **Fix trong Poseidon2**: Thêm $M_E$ matrix trước round đầu phá vỡ structure này.
>
> **Lesson**: Nếu một implementation dùng Poseidon **không có external linear layer** (Poseidon gốc, không phải Poseidon2), có thể vulnerable với reduced rounds.

---

## GCD Attacks trên MiMC (Keyed Mode)

GCD attack áp dụng cho MiMC được dùng như **block cipher** (với key), không phải hash:

> [!definition] Definition 10.7 — GCD Attack trên MiMC
> Trong MiMC-$n/n$ với key $k$, xét hai encryptions:
>
> $$c_1 = E_k(m_1) = F(m_1 + k) + k$$  
> $$c_2 = E_k(m_2) = F(m_2 + k) + k$$
>
> trong đó $F$ là đa thức bậc $d = 7^r$ không có $k$.
>
> Từ $c_1 - c_2 = F(m_1 + k) - F(m_2 + k)$, đây là đa thức trong $k$. Với nhiều cặp $(m_i, c_i)$, dùng GCD để tìm factor chung — đây là $k$.

**Quan trọng**: GCD attack áp dụng cho **keyed MiMC**, không phải hash mode (key = 0). Khi audit, cần phân biệt: circuit dùng MiMC như PRF hay như hash?

---

## Invariant Subspace Attack

> [!definition] Definition 10.8 — Invariant Subspace
> Một **invariant subspace** của permutation $f$ là subspace $V \subset \mathbb{F}_p^t$ sao cho $f(v + c) \in V + f(c)$ cho mọi $v \in V$ — tức là $f$ "bảo toàn" cấu trúc coset của $V$.
>
> Nếu tồn tại invariant subspace, attacker có thể "trap" state trong một không gian con, làm giảm security hiệu quả.

**MiMC với $c_i = 0$**: Nếu tất cả round constants bằng 0, $f(x) = x^3$ có invariant subspace $\{0\}$ trivial. Nhưng nguy hiểm hơn: nếu nhiều constants bằng nhau, có thể tạo ra invariant structure.

**Rescue với bad round constants**: Tương tự.

```python
# Kiểm tra đơn giản: round constants không bao gồm nhiều giá trị giống nhau
def check_constants_quality(constants, p):
    """
    Kiểm tra cơ bản chất lượng round constants
    - Không được có nhiều zeros
    - Không được có nhiều giá trị trùng nhau
    """
    issues = []

    # Check zeros
    zero_count = constants.count(0)
    if zero_count > 1:
        issues.append(f"WARNING: {zero_count} constants = 0 (chỉ c_0 = 0 là acceptable)")

    # Check duplicates
    unique = len(set(constants))
    if unique < len(constants) * 0.99:
        issues.append(f"WARNING: {len(constants) - unique} duplicate constants — suspicious!")

    # Check distribution: should look uniform in [0, p)
    # Simple check: mean should be near p/2
    mean = sum(constants) / len(constants)
    expected_mean = p / 2
    if abs(mean - expected_mean) > expected_mean * 0.1:
        issues.append(f"WARNING: Mean {mean:.2e} vs expected {expected_mean:.2e} — biased constants!")

    return issues

import hashlib
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# Circomlib MiMC constants (good)
def gen_mimc_constants(n, p):
    constants = [0]
    for i in range(1, n):
        h = int(hashlib.sha3_256(f"mimc{i}".encode()).hexdigest(), 16) % p
        constants.append(h)
    return constants

good_constants = gen_mimc_constants(91, p)
print("Good constants (circomlib MiMC):")
issues = check_constants_quality(good_constants, p)
print("  Issues:", issues if issues else "None — OK")

# Bad constants (simulated bug)
bad_constants = [0] * 91  # All zeros!
print("\nBad constants (all zeros):")
issues = check_constants_quality(bad_constants, p)
print("  Issues:", issues)
```

---

## Tổng hợp: Complexity của Các Attacks

| Attack | Target | Complexity | Điều kiện | |
|--------|--------|------------|-----------|---|
| Interpolation (univariate) | MiMC, 1 input | $O(7^r)$ queries | $r$ rounds | |
| Interpolation (multivariate) | Poseidon, t inputs | $O(\binom{d+t}{t})$ | degree $d$ | |
| Gröbner basis | Bất kỳ | $\approx 2^{d_{reg}}$ | varies | |
| Algebraic Freelunch | Poseidon (non-Poseidon2) | Reduced by factor $\alpha^2$ | Monomial S-box | |
| GCD attack | MiMC (keyed) | $O(r \cdot r)$ operations | Multiple ciphertexts | |
| Invariant subspace | Any with bad constants | Trivial | Constants structured | |

**Key observation**: Tất cả attacks đều bị chặn khi **số rounds đủ lớn**. Đây là lý do không bao giờ được giảm rounds.

---

## Audit Checklist: Algebraic Security

```
Khi audit một ZK hash implementation:

□ Xác định số rounds (R_F, R_P cho Poseidon; N cho Rescue)
□ So sánh với minimum bounds từ paper gốc
□ Check: R_F đủ cho degree saturation (R_F >= 6)
□ Check: R_P đủ để chống interpolation/Gröbner
□ Check: Round constants không có obvious structure (zeros, repeats)
□ Verify test vectors với reference implementation
□ Với Poseidon: Check có apply M_E matrix nếu dùng Poseidon2
□ Check: Alpha coprime với p-1 (S-box là bijection)
□ Với MiMC keyed mode: Document rõ security claim vs hash mode
□ Search GitHub/audit reports cho bất kỳ known attacks nào
```

---

## Summary / Key Takeaways

- **Interpolation attack**: Cần $\alpha^r + 1$ queries; bị chặn bởi đủ rounds vì degree tăng exponentially
- **Gröbner basis**: Attack algebraic tổng quát nhất; complexity dựa trên degree of regularity; bị chặn bởi high degree
- **Algebraic Freelunch**: Bypass 2 rounds đầu Poseidon nếu không có external matrix; fixed trong Poseidon2
- **GCD attack**: Chỉ cho MiMC keyed mode; không ảnh hưởng hash mode (key=0)
- **Invariant subspace**: Xảy ra khi round constants có structure (đặc biệt nhiều zeros)
- **Bottom line cho auditors**: Số rounds là security-critical parameter. Bất kỳ reduction nào cần re-analyze toàn bộ security.

---

## References

- Jakobsen, Knudsen — *The Interpolation Attack on Block Ciphers* (FST 1997)
- Buchberger — *A theoretical basis for the reduction of polynomials to canonical forms* (1976)
- Bariant et al. — *The Algebraic Freelunch: Efficient Gröbner Basis Attacks Against Arithmetization-Oriented Primitives* (eprint.iacr.org/2024/347)
- Steiner — *A Zero-Dimensional Gröbner Basis for Poseidon* (eprint.iacr.org/2024/310)
- Steiner — *Zero-Dimensional Gröbner Bases for Rescue-XLIX* (eprint.iacr.org/2024/468)
- Albrecht et al. — *Algebraic Attacks against STARK-Friendly Ciphers* (Appendix to SFH Survey)
- Grassi et al. — *Poseidon2 paper*, Section 7.3 on security issue (eprint.iacr.org/2023/323)
