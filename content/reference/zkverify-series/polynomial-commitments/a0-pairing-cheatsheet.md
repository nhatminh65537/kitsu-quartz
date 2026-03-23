---
title: "A0. Pairing Cheatsheet"
tags: [crypto, zk, polynomial-commitments, appendix, pairing]
aliases: [Pairing Cheatsheet]
created: 2026-03-12
---

> **Mục đích**: Reference nhanh cho pairing-based crypto khi đọc code và audit. Không cần đọc tuyến tính — tra cứu khi cần.

---

## Các Đường cong Phổ biến

| Curve | Base field $p$ | Scalar field $r$ | Security | Dùng trong |
|-------|----------------|-----------------|---------|-----------|
| **BN254** (alt_bn128) | ~254 bits | ~254 bits | ~100 bits | Ethereum (EIP-196/197), Groth16 |
| **BLS12-381** | 381 bits | 255 bits | ~128 bits | Ethereum 2.0, KZG EIP-4844, Zcash |
| **BLS12-377** | 377 bits | 253 bits | ~128 bits | Zexe, Aleo |
| **Pasta (Pallas/Vesta)** | 255 bits | 255 bits | ~128 bits | Halo2 (no pairing) |

---

## BLS12-381 — Key Parameters

```
Base field modulus p:
0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab

Scalar field / curve order r:
0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

G1 generator:
x = 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb
y = 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1

G2 generator:
x = 0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8
  + 0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e * i
y = 0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801
  + 0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be * i
```

---

## Bilinear Pairing Properties

```
e: G1 × G2 → GT

Bilinearity:
  e(a·P, b·Q) = e(P, Q)^(ab)
  e(P + P', Q) = e(P, Q) · e(P', Q)
  e(P, Q + Q') = e(P, Q) · e(P, Q')

Non-degeneracy:
  e(G1, G2) ≠ 1_GT

Key identities (dùng nhiều nhất):
  e([a]1, [b]2) = e([1]1, [ab]2) = e([ab]1, [1]2) = e([1]1, [1]2)^(ab)
  e([a]1, [b]2) = e([b]1, [a]2)   (chỉ khi G1 = G2, symmetric pairing)
```

---

## KZG Quick Reference

```
Setup:
  srs = ([τ^0]1, [τ^1]1, ..., [τ^d]1, [τ^0]2, [τ^1]2)
  τ = toxic waste (xóa sau setup)

Commit:
  com_f = f(τ)·G1 = Σ aᵢ·[τ^i]1

Prove f(z) = y:
  q(X) = (f(X) - y) / (X - z)
  π = [q(τ)]1

Verify:
  e(π, [τ]2 - [z]2) == e(com_f - [y]1, G2)
  ↔ q(τ)·(τ-z) == f(τ) - y   (trong exponent)

Batch prove f(z1)=y1, ..., f(zk)=yk:
  r(X) = Lagrange interpolation qua (zi, yi)
  Z(X) = Π(X - zi)
  q(X) = (f(X) - r(X)) / Z(X)
  π = [q(τ)]1
  Verify: e(π, [Z(τ)]2) == e(com_f - [r(τ)]1, G2)
```

---

## Subgroup Membership Checks

```python
# Python / py_ecc
from py_ecc.bls12_381 import G1, G2, curve_order, is_on_curve, multiply

def check_g1(point):
    """Full subgroup check cho G1 của BLS12-381."""
    # 1. On-curve check
    if not is_on_curve(point, b):
        return False
    # 2. Prime-order subgroup: r*P = infinity
    if multiply(point, curve_order) is not None:
        return False
    return True
```

```rust
// Rust / arkworks
use ark_bls12_381::{G1Affine, G2Affine};
use ark_ec::AffineCurve;

fn check_g1(point: &G1Affine) -> bool {
    point.is_on_curve() && point.is_in_correct_subgroup_assuming_on_curve()
    // Cả hai điều kiện đều cần!
}

fn check_g2(point: &G2Affine) -> bool {
    point.is_on_curve() && point.is_in_correct_subgroup_assuming_on_curve()
}
```

```solidity
// Solidity / BN254 (Ethereum)
// Subgroup check via ecMul precompile
function isInG1(uint256 px, uint256 py) internal view returns (bool) {
    // r * P = (0, 0) trong BN254
    uint256 BN254_ORDER = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;
    uint256[3] memory input = [px, py, BN254_ORDER];
    (bool success, bytes memory output) = address(7).staticcall(abi.encode(input));
    if (!success) return false;
    (uint256 rx, uint256 ry) = abi.decode(output, (uint256, uint256));
    return rx == 0 && ry == 0;  // infinity = (0,0) trong BN254
}
```

---

## Scalar Field Arithmetic

```python
# BLS12-381 scalar field
r = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

# Mọi phép tính polynomial coefficient phải mod r
a = (x + y) % r
b = (x * y) % r
inv_a = pow(a, r - 2, r)  # Fermat's little theorem

# BN254 scalar field  
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
```

---

## Ethereum Precompiles cho Pairing

```solidity
// EIP-196, EIP-197: BN254 pairing trong Ethereum
// ecAdd:    address(6)  — G1 point addition
// ecMul:    address(7)  — G1 scalar multiplication
// ecPairing: address(8) — multi-pairing

// KZG verify call (EIP-4844 style)
function kzgVerify(
    bytes32[2] memory commitment,  // G1 point
    bytes32[2] memory z,           // evaluation point (scalar)
    bytes32[2] memory y,           // claimed value (scalar)  
    bytes32[4] memory proof        // G1 point (π)
) internal view returns (bool) {
    // Construct pairing input:
    // e(π, [τ]2 - [z]2) == e(com - [y]1, G2)
    bytes memory input = abi.encodePacked(
        proof,                  // π  (G1)
        TAU_G2_MINUS_Z_G2,     // [τ-z]2 (G2) — precomputed từ SRS
        sub_g1(commitment, scalar_mul_g1(G1, y)),  // com - [y]1
        G2                     // [1]2
    );
    (bool success, bytes memory result) = address(8).staticcall(input);
    require(success, "Pairing call failed");
    return abi.decode(result, (bool));
}
```

---

## Cofactors và Subgroup

```
BN254:
  E(F_p) order = h * r
  h = 1  (cofactor = 1 cho G1 → mọi điểm trên curve thuộc prime-order subgroup)
  h_2 ≠ 1 cho G2 → G2 CẦN subgroup check!

BLS12-381:
  G1 cofactor h1 = 0x396c8c005555e1568c00aaab0000aaab  (lớn → CẦN check)
  G2 cofactor h2 (rất lớn)
  
  → Cả G1 lẫn G2 đều CẦN subgroup check trong BLS12-381!
```

---

## Tham chiếu Nhanh

| Cần làm gì | Dùng gì |
|-----------|---------|
| Check điểm G1 hợp lệ | `is_on_curve() && is_in_correct_subgroup()` |
| Compute commitment | `Σ aᵢ · srs_g1[i]` (MSM) |
| Prove f(z) = y | Tính quotient, commit quotient |
| Verify | `e(π, [τ-z]2) == e(com-[y]1, G2)` |
| Field inverse | `pow(a, p-2, p)` (Fermat) |
| Root of unity bậc n | Tìm `ω: ω^n = 1, ord(ω) = n` |
