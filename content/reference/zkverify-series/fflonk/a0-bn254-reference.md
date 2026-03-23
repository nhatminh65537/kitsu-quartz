---
title: "A0. BN254 Curve Reference"
tags: [crypto, bn254, elliptic-curve, reference, appendix]
aliases: [BN254 Reference]
created: 2026-03-13
---

> **Quick reference**: BN254 parameters, group operations, và pairing cho FFLONK implementation.

---

## Curve Parameters

> [!definition] BN254 Barreto-Naehrig Curve
>
> **Base field** $\mathbb{F}_p$ (coordinates):
> $$p = 21888242871839275222246405745257275088696311157297823662689037894645226208583$$
> $$p = \texttt{0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47}$$
>
> **Scalar field** $\mathbb{F}_r$ (exponents/challenges):
> $$r = 21888242871839275222246405745257275088548364400416034343698204186575808495617$$
> $$r = \texttt{0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001}$$
>
> **Curve equation**: $y^2 = x^3 + 3$ over $\mathbb{F}_p$
>
> **$\mathbb{G}_1$ generator**:
> $$G_1 = (1,\ 2)$$
>
> **Embedding degree**: $k = 12$ (BN = Barreto-Naehrig, ate pairing)
>
> **Cofactor**: $h_1 = 1$ (all on-curve $\mathbb{G}_1$ points are in $r$-torsion subgroup)

---

## $\mathbb{G}_2$ Parameters

$\mathbb{G}_2$ lives on the twisted curve $E'$ over $\mathbb{F}_{p^2} = \mathbb{F}_p[u]/(u^2 + 1)$:

$$y^2 = x^3 + \frac{3}{u+9}$$

> [!definition] $\mathbb{G}_2$ Generator
> $$G_2 = \big((x_0 + x_1 u),\ (y_0 + y_1 u)\big)$$
>
> $$x_0 = \texttt{0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed}$$
> $$x_1 = \texttt{0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2}$$
> $$y_0 = \texttt{0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa}$$
> $$y_1 = \texttt{0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b}$$

---

## BN254 Pairing

> [!definition] Optimal Ate Pairing
> $$e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T \subset \mathbb{F}_{p^{12}}^*$$
>
> **Bilinearity**: $e(aP, bQ) = e(P, Q)^{ab}$ for $a, b \in \mathbb{F}_r$
>
> **Non-degeneracy**: $e(G_1, G_2) \neq 1_{\mathbb{G}_T}$

---

## Useful Values

```python
# BN254 key constants
p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

# Field operations
def fr_add(a, b): return (a + b) % r
def fr_mul(a, b): return (a * b) % r
def fr_inv(a):    return pow(a, r-2, r)
def fr_neg(a):    return (r - a) % r
def fr_pow(a, e): return pow(a, e, r)

# Verify generator is on curve
G1 = (1, 2)
assert (G1[1]**2) % p == (G1[0]**3 + 3) % p
print(f"G1 on curve: True")
print(f"p = {hex(p)}")
print(f"r = {hex(r)}")
print(f"p > r? {p > r}")
print(f"log2(p) ≈ {p.bit_length()} bits")
print(f"log2(r) ≈ {r.bit_length()} bits")

# Primitive root of unity in Fr
# For circuit size n = 2^k, need ω: ω^n = 1 in Fr
# Fr has 2^28-smooth order
omega_28 = pow(5, (r - 1) >> 28, r)  # primitive 2^28-th root
print(f"\nomega_28^(2^28) mod r == 1: {pow(omega_28, 2**28, r) == 1}")

# For smaller domains (demo)
omega_4 = pow(omega_28, 2**26, r)    # primitive 4th root of unity
print(f"omega_4^4 mod r == 1: {pow(omega_4, 4, r) == 1}")
```

---

## Security Level

| Property | BN254 | BLS12-381 |
|---|---|---|
| Base field bits | 254 | 381 |
| Scalar field bits | 254 | 255 |
| Embedding degree | 12 | 12 |
| Security level | ~100 bits (pre-quantum) | ~128 bits |
| Pairing cost | Fast | Slower |

> [!warning] BN254 security
> BN254 cung cấp ~100-bit security (post-2016 estimates). Đủ cho production (không có known attack), nhưng thấp hơn BLS12-381's ~128-bit. Ethereum precompile hỗ trợ BN254 (EIP-197), nên được dùng trong Polygon/zkVerify.

---

## References

- IACR 2010/429 — Barreto & Naehrig original paper
- EIP-197 — Ethereum BN254 precompile
- ark_bn254 Rust crate — reference implementation
