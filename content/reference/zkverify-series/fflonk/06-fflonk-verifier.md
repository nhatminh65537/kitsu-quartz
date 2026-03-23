---
title: "06. FFLONK Verifier Algorithm"
tags: [crypto, zk-snark, fflonk, lesson-06, verifier, pairing-check, bug-hunting]
aliases: [FFLONK Verifier Algorithm]
created: 2026-03-13
---

> **Prerequisites**: [[04-fflonk-core|04. FFLONK Core Idea]], [[05-fflonk-prover|05. FFLONK Prover Algorithm]]  
> **Objectives**:  
> - Nắm vững từng bước của FFLONK verifier: từ deserialize đến pairing check cuối cùng
> - Hiểu tại sao verifier chỉ cần 5 scalar multiplications + 2 pairings
> - Biết chính xác những gì verifier **kiểm tra** và **không kiểm tra** — đây là nguồn gốc bug
> - Có thể đọc và audit code Rust/Solidity của zkVerify/Polygon

---

## Motivation

Verifier là **attack surface chính** trong bất kỳ zk-SNARK nào. Prover chạy ở môi trường trusted; verifier chạy on-chain, tiếp nhận input từ bất kỳ ai — bao gồm cả attacker. Mỗi bước verifier bỏ qua là một bug class tiềm ẩn.

FFLONK verifier có 2 tầng kiểm tra:
1. **Algebraic check**: gate equations, permutation, boundary — thực hiện trong $\mathbb{F}_r$ (field arithmetic).
2. **Cryptographic check**: KZG opening via pairing — đảm bảo prover không giả mạo evaluations.

---

## 1. Tổng quan: Input và Output

> [!definition] Definition 1.1 — Verifier Interface
>
> **Input**:
> - $\pi$ — proof (768 bytes = 24 field elements, xem [[05-fflonk-prover|Lesson 05]])
> - $\text{vk}$ — verification key (circuit-specific, từ trusted setup)
> - $\text{pub}$ — public inputs (32 bytes = 1 field element trong Polygon CDK)
>
> **Output**: `Accept` hoặc `Reject`
>
> Verifier **không** nhận witness. Verifier **không** biết $a, b, c$ trực tiếp — chỉ thấy commitments và evaluations được prover gửi.

---

## 2. Step 1: Deserialize và Validate Range

**Bước đầu tiên và thường bị bỏ sót nhất**.

> [!definition] Definition 2.1 — Range Check Requirements
>
> Mỗi field element trong proof phải thỏa:
> - $\mathbb{F}_r$ elements: $0 \leq x < r$ (scalar field của BN254, $r \approx 2^{254}$)
> - $\mathbb{G}_1$ points: tọa độ $(x, y)$ phải thỏa $0 \leq x, y < p$ (base field, $p \approx 2^{254}$)
>
> $\mathbb{G}_1$ points còn phải thỏa:
> - **On-curve check**: $y^2 \equiv x^3 + 3 \pmod{p}$ (BN254 curve equation)
> - **Subgroup check**: $r \cdot P = \mathcal{O}$ (điểm nằm trong prime-order subgroup)

> [!danger] Bug Class 2.1 — Missing Subgroup Check
> Nếu chỉ check `is_on_curve` mà không check `is_in_subgroup`, attacker có thể dùng điểm từ một **twist** hoặc **small subgroup** của $\mathbb{G}_1$. Những điểm này pass pairing check nhưng không có discrete log trong $r$-torsion subgroup, cho phép forge proofs không có witness hợp lệ.
>
> **Trong Rust zkVerify**: tìm `is_in_correct_subgroup_assuming_on_curve()` — nếu không thấy, đây là bug.

```python
# Minh họa on-curve vs subgroup check
# BN254 parameters (simplified demo với đường cong nhỏ hơn)
p = 101  # demo base field
r = 17   # demo scalar field (prime order subgroup)

def is_on_curve(x, y, p):
    """Check y^2 = x^3 + 3 mod p (BN254 simplified)"""
    return (y*y) % p == (x*x*x + 3) % p

def point_add(P, Q, p):
    """Elliptic curve point addition mod p"""
    if P is None: return Q
    if Q is None: return P
    x1, y1 = P; x2, y2 = Q
    if x1 == x2 and y1 != y2: return None  # point at infinity
    if P == Q:  # doubling
        lam = (3*x1*x1) * pow(2*y1, p-2, p) % p
    else:
        lam = (y2 - y1) * pow(x2 - x1, p-2, p) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1 - x3) - y1) % p
    return (x3, y3)

def scalar_mul(P, k, p):
    """Scalar multiplication k*P mod p"""
    result = None
    addend = P
    while k:
        if k & 1:
            result = point_add(result, addend, p)
        addend = point_add(addend, addend, p)
        k >>= 1
    return result

# Generator of the r-torsion subgroup on our demo curve
G1 = (1, 2)  # traditional BN254 generator point
# Note: (1,2) trên BN254 thực, nhưng ở đây dùng p=101 để demo

# Verify G1 is on curve
print(f"G1 on curve: {is_on_curve(G1[0], G1[1], p)}")

# Example: a valid proof point (trong subgroup)
P_valid = scalar_mul(G1, 5, p)  # P = 5*G ← valid, order divides r
print(f"5*G = {P_valid}")
print(f"5*G on curve: {is_on_curve(P_valid[0], P_valid[1], p)}")

# Subgroup check: r * P should be identity (point at infinity)
# If missing this check → attacker can use points from other subgroups
check = scalar_mul(P_valid, r, p)
print(f"r * P (should be None/identity): {check}")
print(f"Subgroup check passed: {check is None}")
```

---

## 3. Step 2: Fiat-Shamir Challenges

Verifier phải **tự tính lại** tất cả challenges từ transcript — không tin vào bất kỳ challenge nào do prover cung cấp.

> [!definition] Definition 3.1 — FFLONK Challenge Derivation
>
> Thứ tự hash **phải chính xác** như prover đã dùng:
>
> ```text
> transcript = H(vk, pub)
> transcript += C1 → hash → β, γ
> transcript += C2 → hash → α
> transcript += C1, C2, α → hash → ζ
> transcript += evaluations → hash → υ
> ```
>
> **Mỗi challenge là một Fiat-Shamir hash** của tất cả messages trước đó.

Trong zkVerify/Polygon implementation, hash function là Poseidon hoặc Keccak256, tùy circuit.

> [!danger] Bug Class 3.1 — Incomplete Transcript
> Nếu bất kỳ commitment nào bị bỏ sót khi hash (ví dụ: bỏ qua `vk` khi hash `β`), attacker có thể manipulate commitment sau khi biết challenge. Đây là **Last Challenge Attack** — sẽ phân tích kỹ ở Lesson 08.

---

## 4. Step 3: Algebraic Constraint Check

Verifier kiểm tra rằng các evaluations mà prover gửi thỏa mãn các equations của PLONK.

### 4.1 Vanishing Polynomial

$$Z_H(\zeta) = \zeta^n - 1 \pmod{r}$$

Nếu $\zeta \in H$ thì $Z_H(\zeta) = 0$ — đây là điều kiện để quotient polynomial $t(X)$ hợp lệ. Verifier kiểm tra rằng:

$$Z_H(\zeta) \neq 0$$

(nếu $\zeta \in H$, evaluation vô nghĩa — thường được xử lý bằng cách chọn $\zeta$ ngẫu nhiên).

### 4.2 Gate Equation Check (trong field)

$$\bar{q}_L \cdot \bar{a} + \bar{q}_R \cdot \bar{b} + \bar{q}_M \cdot \bar{a}\bar{b} + \bar{q}_O \cdot \bar{c} + \bar{q}_C + \text{PI}(\zeta) = Z_H(\zeta) \cdot \bar{t}$$

trong đó $\text{PI}(\zeta) = $ public inputs polynomial evaluated tại $\zeta$.

### 4.3 Permutation Constraint Check

$$\bar{z}_\omega \cdot (\bar{a} + \beta\zeta + \gamma)(\bar{b} + \beta k_1\zeta + \gamma)(\bar{c} + \beta k_2\zeta + \gamma)$$
$$= \bar{z} \cdot (\bar{a} + \beta\bar{s}_1 + \gamma)(\bar{b} + \beta\bar{s}_2 + \gamma)(\bar{c} + \beta\bar{s}_3 + \gamma)$$

tất cả trong $\mathbb{F}_r$.

### 4.4 Accumulator Boundary Check (via Lagrange)

$$L_1(\zeta) \cdot (\bar{z} - 1) = 0 \pmod{Z_H(\zeta)}$$

trong đó $L_1(\zeta) = \frac{Z_H(\zeta)}{n(\zeta - 1)}$ là Lagrange polynomial tại $\omega^0$.

> [!danger] Bug Class 4.1 — Public Input Not Bound to Transcript
> Nếu verifier không include `pub` trong transcript khi tính challenges, attacker có thể submit proof với `pub` khác — proof vẫn valid về mặt cryptographic nhưng claim sai statement.

---

## 5. Step 4: Reconstruct Commitment Targets (5 Scalar Muls)

Đây là bước **quan trọng nhất** và là nơi FFLONK tiết kiệm nhất.

Verifier cần tính 2 target points:
- $[F]_1$ — "expected" combined commitment
- $[E]_1$ — "expected" evaluation

> [!definition] Definition 5.1 — F và E Points
>
> **$[E]_1$** — evaluation commitment:
> $$[E]_1 = \big(\text{evaluated value}\big) \cdot G_1$$
>
> Đây là $1$ scalar multiplication.
>
> **$[F]_1$** — combined proof commitment (SHPLONK aggregation):
> $$[F]_1 = [C_1]_1 + \upsilon \cdot [C_2]_1$$
>
> Đây là $1$ scalar multiplication ($\upsilon$ được dùng để batch $C_1$ và $C_2$).
>
> Tổng cộng cho pairing setup: **~5 scalar multiplications** — phần lớn cho tính các hệ số combine với SHPLONK.

**Lý do chỉ cần 5 thay vì 16–18**: Verifier không cần rebuild từng commitment $[q_L]_1, [q_R]_1, \ldots$ rời rạc. Combined polynomial $C_1$ đã encode tất cả — verifier chỉ cần verify $[C_1]_1$ trực tiếp.

---

## 6. Step 5: Pairing Check (2 Pairings)

Bước cuối cùng — xác nhận prover biết opening đúng của $C_1, C_2$.

> [!definition] Definition 6.1 — FFLONK Final Pairing Check
>
> Verifier kiểm tra:
>
> $$e\!\left([W_1]_1 + \upsilon[W_2]_1,\ [\tau]_2\right) \stackrel{?}{=} e\!\left([F]_1 - [E]_1 + \zeta[W_1]_1 + \upsilon\zeta\omega[W_2]_1,\ [1]_2\right)$$
>
> - $[W_1]_1, [W_2]_1$ — opening proof points từ proof
> - $[\tau]_2$ — từ SRS ($= \tau \cdot G_2$, từ trusted setup)
> - $[1]_2 = G_2$ — generator
> - $[F]_1, [E]_1$ — computed bởi verifier ở Step 4

**Tại sao equation này đúng khi proof honest?**

Đây là KZG multi-point check. Từ KZG (Lesson 02): nếu $C = f(\tau) \cdot G_1$ thì opening proof $\pi$ thỏa:
$$e(\pi,\ [\tau - z]_2) = e(C - [f(z)]_1,\ G_2)$$

FFLONK generalize điều này cho multi-point opening thông qua SHPLONK accumulation.

### 6.1 Khai triển để hiểu các scalars

Lấy $[F]_1 - [E]_1 + \zeta[W_1]_1 + \upsilon\zeta\omega[W_2]_1$:

| Term | Scalar muls cần |
|------|----------------|
| $[F]_1 = [C_1]_1 + \upsilon[C_2]_1$ | 1 (nhân $\upsilon$) |
| $[E]_1 = e_{\text{val}} \cdot G_1$ | 1 |
| $\zeta[W_1]_1$ | 1 (nhân $\zeta$) |
| $\upsilon\zeta\omega[W_2]_1$ | 1 (nhân $\upsilon\zeta\omega$, tính trước) |
| $[W_1]_1 + \upsilon[W_2]_1$ (vế trái) | 1 (nhân $\upsilon$) |
| **Tổng** | **~5 scalar muls** |

---

## 7. Verifier Algorithm: Pseudocode hoàn chỉnh

```python
# FFLONK Verifier — Full Pseudocode (field arithmetic)
# Không dùng bilinear pairing (cần py_ecc), chỉ show algebraic steps

import hashlib

def fiat_shamir_challenge(transcript_elements, mod):
    h = hashlib.sha256()
    for e in transcript_elements:
        h.update(str(e).encode())
    return int(h.hexdigest(), 16) % mod

def poly_eval(coeffs, x, mod):
    return sum(c * pow(x, i, mod) for i, c in enumerate(coeffs)) % mod

def lagrange_1(zeta, n, mod):
    """L1(zeta) = (zeta^n - 1) / (n * (zeta - 1))"""
    zh = (pow(zeta, n, mod) - 1) % mod
    denom = n * (zeta - 1) % mod
    return zh * pow(denom, mod-2, mod) % mod

# ========================================================
# Demo parameters
# ========================================================
r = 101       # scalar field (demo)
n = 4         # circuit size
k1 = 2; k2 = 3  # coset shifts

# "Proof" elements (evaluations — từ prover)
# Giả sử witness: a=[2,3,5,7], b=[1,2,3,4], c=a*b
eval_a  = 55  # a(zeta) — demo value
eval_b  = 30  # b(zeta)
eval_c  = 18  # c(zeta) = a*b không nhất thiết đúng tại zeta
eval_s1 = 7   # S_sigma1(zeta)
eval_s2 = 9   # S_sigma2(zeta)
eval_s3 = 11  # S_sigma3(zeta)
eval_z  = 45  # z(zeta)
eval_zw = 73  # z(zeta*omega) — từ prover

# Challenges (trong thực tế: hash từ transcript)
beta  = 17; gamma = 23; alpha = 31
zeta  = 37; omega = 4   # omega = primitive n-th root of unity mod r

print("=== FFLONK Verifier — Algebraic Steps ===")
print()

# ---- Step 1: Range check ----
print("[Step 1] Range check: all elements in [0, r)")
# In practice: assert 0 <= each_element < r
print(f"  All evaluations < r={r}: {all(0 <= x < r for x in [eval_a,eval_b,eval_c,eval_s1,eval_s2,eval_s3,eval_z,eval_zw])}")

# ---- Step 2: Vanishing polynomial ----
print("\n[Step 2] Z_H(zeta) = zeta^n - 1")
ZH = (pow(zeta, n, r) - 1) % r
print(f"  Z_H({zeta}) = {ZH}  (should be != 0 for valid zeta)")
assert ZH != 0, "zeta must not be in evaluation domain H!"

# ---- Step 3: Lagrange L1(zeta) ----
print("\n[Step 3] L1(zeta)")
L1 = lagrange_1(zeta, n, r)
print(f"  L1({zeta}) = {L1}")

# ---- Step 4: Permutation argument check ----
print("\n[Step 4] Permutation accumulator check")
num_perm = ((eval_a + beta*zeta + gamma) *
            (eval_b + beta*k1*zeta + gamma) *
            (eval_c + beta*k2*zeta + gamma)) % r
den_perm = ((eval_a + beta*eval_s1 + gamma) *
            (eval_b + beta*eval_s2 + gamma) *
            (eval_c + beta*eval_s3 + gamma)) % r
# z(zeta*omega) * den == z(zeta) * num  [in a valid proof]
lhs_perm = eval_zw * den_perm % r
rhs_perm = eval_z  * num_perm % r
print(f"  z(ζω)*den = {lhs_perm}")
print(f"  z(ζ)*num  = {rhs_perm}")
print(f"  Match: {lhs_perm == rhs_perm}  (False expected for random demo values)")

# ---- Step 5: Boundary check ----
print("\n[Step 5] Boundary check: L1(zeta)*(z(zeta)-1) == 0 mod Z_H")
boundary = L1 * (eval_z - 1) % r
print(f"  L1 * (z - 1) = {boundary}")

# ---- Step 6: Gate equation check ----
# qL*a + qR*b + qM*a*b + qO*c + qC = Z_H * t (in valid proof)
print("\n[Step 6] Gate equation check")
qL=1; qR=1; qM=1; qO=-1; qC=0  # for multiplication gate: a*b - c = 0
gate_lhs = (qL*eval_a + qR*eval_b + qM*eval_a*eval_b + qO*eval_c + qC) % r
print(f"  Gate LHS = qL*a + qR*b + qM*a*b + qO*c + qC = {gate_lhs}")
print(f"  (Should equal Z_H * t_eval in valid proof)")

print("\n=== Algebraic checks complete ===")
print("=== (KZG pairing check requires py_ecc — see notes below) ===")
```

---

## 8. KZG Pairing Check: Tại sao 2 pairings là đủ

KZG pairing check được generalize từ Lesson 02. Trong multi-point setting với SHPLONK:

> [!theorem] Theorem 8.1 — SHPLONK Pairing Soundness
> Nếu prover không biết $C_1(\tau)$ và $C_2(\tau)$ (không biết $\tau$), không thể tạo $[W_1]_1, [W_2]_1$ sao cho:
>
> $$e\!\left([W_1 + \upsilon W_2]_1,\ [\tau]_2\right) = e\!\left([F - E + \zeta W_1 + \upsilon\zeta\omega W_2]_1,\ G_2\right)$$
>
> kể cả với adversarially chosen $[C_1]_1, [C_2]_1$.
>
> **Security basis**: $q$-SDH assumption + algebraic group model (AGM).

Hai pairings này kiểm tra **đồng thời** cả $[W_1]_1$ (opening cho $C_1$ tại $\zeta$) và $[W_2]_1$ (opening cho $C_2$ tại $\zeta\omega$), nhờ random challenge $\upsilon$ để batch.

---

## 9. Điều verifier KHÔNG kiểm tra — Nguồn bug

> [!danger] Bug Class 9.1 — G1 Point tại vô cực
> Nếu verifier không check $[C_1]_1 \neq \mathcal{O}$ (điểm vô cực), pairing equation luôn thỏa với proof bất kỳ vì $e(\mathcal{O}, \cdot) = 1_{G_T}$.
>
> **In Rust**: `ark_bn254::G1Affine` sẽ **không** tự động reject point at infinity nếu code không check `!is_zero()`.

> [!danger] Bug Class 9.2 — VK Không Được Validate
> Nếu verifier không validate rằng VK đến từ đúng circuit (ví dụ: không check `n`, `k1`, `k2` match với expected values), attacker có thể supply crafted VK để bypass security. Đây là **VK substitution attack**.

> [!danger] Bug Class 9.3 — Scalar Field Reduction Overflow
> Khi tính `β*s1 + γ` trong field, nếu dùng integer arithmetic không reduce mod $r$, intermediate value có thể overflow. Trong Rust với `u256`, `wrapping_mul` không reduce — cần dùng `ark_ff::Field` arithmetic đúng cách.

---

## 10. Verifier Cost Summary

| Operation | Count | Cost trên BN254 |
|---|---|---|
| Fiat-Shamir hash | ~5 | Negligible |
| Field multiplications | ~50 | ~1 µs |
| Scalar multiplications $\mathbb{G}_1$ | **5** | ~250 µs mỗi |
| Pairings $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ | **2** | ~1 ms mỗi |
| **Total** | | **~3–4 ms** |

So sánh với PLONK (16–18 scalar muls + 2 pairings): FFLONK tiết kiệm ~50% thời gian verifier.

---

## Summary

- **FFLONK verifier = 5 bước**: Range check → Fiat-Shamir challenges → Algebraic constraint checks → Rebuild $[F]_1, [E]_1$ → Pairing check.
- **5 scalar muls + 2 pairings** — không phụ thuộc số polynomials $t$ nhờ FFT-like combining.
- **Pairing equation** kiểm tra tất cả openings cùng lúc nhờ SHPLONK batching với challenge $\upsilon$.
- **4 bug classes chính** ở verifier: missing subgroup check, incomplete transcript, missing infinity check, và field overflow.
- **VK validation** quan trọng không kém proof validation — VK substitution bypass toàn bộ security.

---

## References

- Gabizon & Williamson — *fflonk*, IACR 2021/1167, Section 7 (Verifier Algorithm)
- Boneh, Drake, Fisch, Gabizon — *SHPLONK*, IACR 2020/081
- zkVerify — *fflonk_verifier* Rust, `src/lib.rs` (github.com/zkVerify/fflonk_verifier)
- Polygon — *FflonkVerifier.sol* (0xPolygon/cdk-validium-contracts)
- Bowe et al. — *Zexe* (ark-works library, BN254 subgroup checks)
