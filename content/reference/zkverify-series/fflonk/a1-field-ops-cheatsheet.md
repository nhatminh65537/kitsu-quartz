---
title: "A1. Field Operations Cheatsheet"
tags: [crypto, field-arithmetic, bn254, reference, appendix]
aliases: [Field Ops Cheatsheet]
created: 2026-03-13
---

> **Quick reference**: $\mathbb{F}_r$ và $\mathbb{G}_1$ operations cho FFLONK verifier

---

## $\mathbb{F}_r$ Scalar Field Operations

```python
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47

# ─── Fr arithmetic ─────────────────────────────────────────────────
def fr_add(a, b):    return (a + b) % r
def fr_sub(a, b):    return (a - b) % r
def fr_mul(a, b):    return (a * b) % r
def fr_inv(a):       return pow(a, r - 2, r)    # Fermat's little theorem
def fr_div(a, b):    return fr_mul(a, fr_inv(b))
def fr_neg(a):       return (r - a) % r
def fr_pow(a, e):    return pow(a, e % (r-1), r)  # exponent mod (r-1)
def fr_sqrt(a):
    """Square root in Fr (BN254 r ≡ 3 mod 4)"""
    assert (r % 4) == 3
    root = pow(a, (r + 1) // 4, r)
    assert root * root % r == a, "a is not a quadratic residue"
    return root

# ─── Lagrange interpolation over Fr ───────────────────────────────
def lagrange_interp(xs, ys, x_eval, mod):
    """Compute polynomial through (xs, ys) evaluated at x_eval"""
    n = len(xs); total = 0
    for i in range(n):
        num = ys[i]; den = 1
        for j in range(n):
            if i != j:
                num = num * (x_eval - xs[j]) % mod
                den = den * (xs[i] - xs[j]) % mod
        total = (total + num * pow(den, mod-2, mod)) % mod
    return total

# ─── Polynomial evaluation ────────────────────────────────────────
def poly_eval(coeffs, x, mod):
    """Horner's method: sum(coeffs[i] * x^i)"""
    result = 0
    for c in reversed(coeffs):
        result = (result * x + c) % mod
    return result

# ─── Vanishing polynomial ─────────────────────────────────────────
def z_h(zeta, n, mod):   return (pow(zeta, n, mod) - 1) % mod

# ─── Lagrange basis L1 ────────────────────────────────────────────
def lagrange_1(zeta, n, mod):
    """L1(zeta) = (zeta^n - 1) / (n * (zeta - 1))"""
    zh = z_h(zeta, n, mod)
    den = n * (zeta - 1) % mod
    return zh * pow(den, mod-2, mod) % mod

# ─── Quick demo ───────────────────────────────────────────────────
print("Fr arithmetic demos:")
a = r - 1; b = 3
print(f"  (r-1) + 3  = {fr_add(a, b)}")   # = 2
print(f"  (r-1) * 3  = {fr_mul(a, b)}")   # = r*3 - 3 mod r = r-3+r = 2r-3 mod r = r-3
print(f"  inv(2)     = {fr_inv(2)}")       # (r+1)/2
print(f"  2*inv(2)   = {fr_mul(2, fr_inv(2))}")   # = 1
```

---

## $\mathbb{G}_1$ Point Operations (pure Python)

```python
p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

def g1_add(P, Q):
    """G1 point addition"""
    if P is None: return Q
    if Q is None: return P
    x1,y1 = P; x2,y2 = Q
    if x1 == x2:
        if y1 != y2: return None   # P + (-P) = O
        lam = (3*x1*x1) * pow(2*y1, p-2, p) % p   # tangent slope
    else:
        lam = (y2-y1) * pow(x2-x1, p-2, p) % p    # secant slope
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1-x3) - y1) % p
    return (x3, y3)

def g1_scalar_mul(P, k):
    """Double-and-add scalar multiplication"""
    if k == 0: return None
    if k < 0:  return g1_scalar_mul(g1_neg(P), -k)
    result = None; addend = P
    while k:
        if k & 1: result = g1_add(result, addend)
        addend = g1_add(addend, addend)
        k >>= 1
    return result

def g1_neg(P):
    """Negate a G1 point"""
    if P is None: return None
    return (P[0], (-P[1]) % p)

G1 = (1, 2)

# Verify group order: r * G1 = O (point at infinity)
rG1 = g1_scalar_mul(G1, r)
print(f"\ng1_scalar_mul demos:")
print(f"  r * G1 = O? {rG1 is None}")
print(f"  G1 + G1 = 2*G1? {g1_add(G1, G1) == g1_scalar_mul(G1, 2)}")
print(f"  (-G1) = (1, p-2)? {g1_neg(G1) == (1, p-2)}")
```

---

## SHPLONK Multi-point Opening: Key Equations

> | Symbol | Meaning |
> |---|---|
> | $\zeta$ | Primary evaluation point |
> | $\omega$ | Primitive $n$-th root of unity |
> | $\upsilon$ | Batching challenge (last FS challenge) |
> | $[C_1]_1$ | Combined commitment group 1 |
> | $[C_2]_1$ | Combined commitment group 2 |
> | $[W_1]_1$ | Opening proof at $\zeta$ |
> | $[W_2]_1$ | Opening proof at $\zeta\omega$ |
>
> **Pairing check**:
> $$e\!\big([W_1 + \upsilon W_2]_1,\ [\tau]_2\big) = e\!\big([F - E + \zeta W_1 + \upsilon\zeta\omega W_2]_1,\ G_2\big)$$
>
> Với $[F]_1 = [C_1]_1 + \upsilon[C_2]_1$

---

## Common Identities

```python
# ─── Useful identities for verifier ───────────────────────────────

# 1. Evaluation domain H = {omega^i : i=0..n-1}
#    Z_H(X) = X^n - 1 vanishes on H

# 2. Lagrange basis:
#    L_i(X) = (Z_H(X)) / (n * (X - omega^i))

# 3. Grand product boundary:
#    z(omega^0) = 1 ↔ L_1(zeta) * (z(zeta) - 1) = 0 mod Z_H(zeta)

# 4. FFLONK combining:
#    C(X) = f0(X^t) + X*f1(X^t) + ... + X^(t-1)*f_{t-1}(X^t)
#    C(z*omega_t^k) recovers f_i(z^t) via inverse DFT

# 5. KZG single-point opening:
#    pi = [(f(X) - f(z)) / (X - z)](tau)   [in G1]
#    Verify: e(pi, [tau - z]_2) == e([f(tau)] - [f(z)], G2)

# Demo: batch Z_H computation for multiple zeta
zeta_values = [37, 41, 53, 67, 71]
n = 4
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
print("\nZ_H(zeta) for various zeta:")
for z in zeta_values:
    zh = (pow(z, n, r) - 1) % r
    print(f"  Z_H({z}) = {zh}")
```

---

## BN254 Field Element Encoding

```python
# BN254 uses big-endian 32-byte encoding for field elements
# Standard in Polygon/zkVerify proof format
r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

def fr_to_bytes(x):
    """Encode Fr element as big-endian 32 bytes"""
    return x.to_bytes(32, 'big')

def fr_from_bytes(b):
    """Decode Fr element from big-endian 32 bytes, with range check"""
    x = int.from_bytes(b, 'big')
    assert x < r, f"Field element {x} >= r — INVALID"
    return x

# Test
x = 0x1234567890abcdef
enc = fr_to_bytes(x)
dec = fr_from_bytes(enc)
print(f"\nEncoding round-trip: {x == dec}")

# Edge case: r-1 (max valid value)
max_fr = r - 1
enc_max = fr_to_bytes(max_fr)
dec_max = fr_from_bytes(enc_max)
print(f"Max Fr value round-trip: {max_fr == dec_max}")

# Edge case: r (should fail)
try:
    fr_from_bytes(r.to_bytes(32, 'big'))
    print("ERROR: r should be rejected!")
except AssertionError as e:
    print(f"r correctly rejected: {e}")
```

---

## References

- [[a0-bn254-reference|A0. BN254 Curve Reference]]
- ark-ff Rust crate — field arithmetic reference implementation
- EIP-197 — Ethereum BN254 pairing precompile specification
