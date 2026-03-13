---
title: "A2. FFLONK Proof Structure Reference"
tags: [crypto, fflonk, proof-format, reference, appendix]
aliases: [FFLONK Proof Structure]
created: 2026-03-13
---

> **Quick reference**: Proof layout 768 bytes, VK fields, và transcript flow

---

## Proof Format: 768 bytes = 24 × 32 bytes (big-endian uint256)

```text
Byte offset  Size   Content                      Type    Description
─────────────────────────────────────────────────────────────────────
0x000        32     C1.x                         G1.x    Combined commitment 1, x-coord
0x020        32     C1.y                         G1.y    Combined commitment 1, y-coord
0x040        32     C2.x                         G1.x    Combined commitment 2, x-coord
0x060        32     C2.y                         G1.y    Combined commitment 2, y-coord
0x080        32     W1.x                         G1.x    Opening proof 1, x-coord
0x0A0        32     W1.y                         G1.y    Opening proof 1, y-coord
0x0C0        32     W2.x                         G1.x    Opening proof 2, x-coord
0x0E0        32     W2.y                         G1.y    Opening proof 2, y-coord
0x100        32     eval_ql                      Fr      qL(ζ) — left selector eval
0x120        32     eval_qr                      Fr      qR(ζ) — right selector eval
0x140        32     eval_qm                      Fr      qM(ζ) — mult selector eval
0x160        32     eval_qo                      Fr      qO(ζ) — output selector eval
0x180        32     eval_qc                      Fr      qC(ζ) — constant selector eval
0x1A0        32     eval_s1                      Fr      S₁(ζ) — perm poly 1 eval
0x1C0        32     eval_s2                      Fr      S₂(ζ) — perm poly 2 eval
0x1E0        32     eval_s3                      Fr      S₃(ζ) — perm poly 3 eval (⚠)
0x200        32     eval_a                       Fr      a(ζ) — left wire eval
0x220        32     eval_b                       Fr      b(ζ) — right wire eval
0x240        32     eval_c                       Fr      c(ζ) — output wire eval
0x260        32     eval_z_omega                 Fr      z(ζω) — acc at ζω
0x280        32     eval_t1w                     Fr      t₁(ζω) — quotient p1 shift
0x2A0        32     eval_t2w                     Fr      t₂(ζω) — quotient p2 shift
0x2C0        32     eval_inv                     Fr      auxiliary inverse element
─────────────────────────────────────────────────────────────────────
Total: 0x2E0 = 768 bytes = 24 elements
```

> [!warning] Note on eval_s3 vs eval_inv
> Index 15 (`0x1E0`) trong một số implementations là `eval_s3`, trong một số khác là precomputed inverse. Verify với `src/proof.rs` của cụ thể implementation.

---

## Proof Parsing Code

```python
def parse_fflonk_proof(proof_bytes: bytes) -> dict:
    """Parse 768-byte FFLONK proof into named fields"""
    assert len(proof_bytes) == 768, f"Expected 768 bytes, got {len(proof_bytes)}"
    
    p = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
    r = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    
    def u256(offset):
        return int.from_bytes(proof_bytes[offset:offset+32], 'big')
    
    fields = {
        # G1 points (must be in base field Fp)
        "C1": (u256(0x000), u256(0x020)),
        "C2": (u256(0x040), u256(0x060)),
        "W1": (u256(0x080), u256(0x0A0)),
        "W2": (u256(0x0C0), u256(0x0E0)),
        # Fr evaluations
        "eval_ql":      u256(0x100),
        "eval_qr":      u256(0x120),
        "eval_qm":      u256(0x140),
        "eval_qo":      u256(0x160),
        "eval_qc":      u256(0x180),
        "eval_s1":      u256(0x1A0),
        "eval_s2":      u256(0x1C0),
        "eval_s3":      u256(0x1E0),
        "eval_a":       u256(0x200),
        "eval_b":       u256(0x220),
        "eval_c":       u256(0x240),
        "eval_z_omega": u256(0x260),
        "eval_t1w":     u256(0x280),
        "eval_t2w":     u256(0x2A0),
        "eval_inv":     u256(0x2C0),
    }
    
    # Validate ranges
    errors = []
    for name, val in fields.items():
        if isinstance(val, tuple):  # G1 point
            x, y = val
            if x >= p: errors.append(f"{name}.x >= p")
            if y >= p: errors.append(f"{name}.y >= p")
        else:  # Fr element
            if val >= r: errors.append(f"{name} >= r")
    
    return fields, errors

# Test with real proof from zkVerify README
proof_hex = (
    "283e3f25323d02dabdb94a897dc2697a3b930d8781381ec574af89a201a91d5a"
    "2c2808c59f5c736ff728eedfea58effc2443722e78b2eb4e6759a278e9246d60"
    "0f9c56dc88e043ce0b90c402e96b1f4b1a246f4d0d69a4c340bc910e1f2fd805"
    "19e465e01bd7629f175931feed102cb6459a1be7b08018b93c142e961d0352d8"
    "0b8e5d340df28c2f454c5a2535ca01a230bb945ee24b1171481a9a2c6496fed6"
    "1cf8878e40adb52dc27da5e79718f118467319d15d64fed460d69d951376ac63"
    "1a6c44faaec76e296b43fe720d700a63fd530f9064878b5f72f2ffe7458c2f03"
    "1ac6ed8c1e0758dfb3702ed29bbc0c14b5e727c164b3ade07b9f164af0be54b0"
    "143b1a6534b2dcf2bd660e1b5b420d86c0c350fd9d614b639c5df98009f1375e"
    "141259679021d0a6a3aa3aae2516bace4a4a651265217ec0ea7c0d7f89b98710"
    "0abcc93d98ff40bae16eff6c29955f7a37155bb25672b12eb5074dcb7c3e2b00"
    "1718a257cca21ee593d1ba9f8e91e5168aed8e0b1893e11a6b583d975e747f80"
    "08a8c2150a04d8f867945ca1740dc3fc3b2fc4daff61b4725fb294435a1b9010"
    "1803690ae70fc212b7e929de9a22a4642ef4772546cf93ffd1b1196a3d9113a3"
    "009c506755578932ca3630508ca1ed6ee83df5ec9e26cb0b5800a70967a1a93a"
    "04d142b6a532935a31d84f75d16929df6d38c3a210ac4f435a8024dfb7e6c1f3"
    "246d58038a943f237325b44f03d106e523adfec4324615a2dd09e1e5b9143b41"
    "1c1cf09ee411cf9864d30df4904099920cee9ae8134d45dfeb29e46115d2e740"
    "098674b8fc2ca31fac6fcc9302860654fdc1b522b7e064b0759bc5924f332fa9"
    "21121b5af880f83fbce02f19dabb8f684593e7322fb80bfc0d054797b1d4eff4"
    "11b01bf68f81f2032ae4f7fc514bd76ca1b264f3989a92e6b3d74cda4f8a7149"
    "20e4c02f5a71082a8bcf5be0b5750a244bd040a776ec541dfc2c8ae73180e924"
    "0ada5414d66387211eec80d7d9d48498efa1e646d64bb1bf8775b3796a9fd0bf"
    "0fdf8244018ce57b018c093e2f75ed77d8dbdb1a7b60a2da671de2efe5f6b9d7"
)

fields, errors = parse_fflonk_proof(bytes.fromhex(proof_hex))
print("Parsed proof fields:")
for name, val in fields.items():
    if isinstance(val, tuple):
        print(f"  {name}: x=0x{val[0]:016x}..., y=0x{val[1]:016x}...")
    else:
        print(f"  {name}: 0x{val:016x}...")
print(f"\nValidation errors: {errors if errors else 'None — all in range'}")
```

---

## Verification Key (VK) Fields

```text
Field       Type      Description
─────────────────────────────────────────────────────────────────────
power       u8        log2(n) — circuit size = 2^power
k1          Fr        Coset shift 1 (typically 2)
k2          Fr        Coset shift 2 (typically 3)
Qm          G1        [qM(τ)]₁ — mult selector commitment
Ql          G1        [qL(τ)]₁ — left selector commitment
Qr          G1        [qR(τ)]₁ — right selector commitment
Qo          G1        [qO(τ)]₁ — output selector commitment
Qc          G1        [qC(τ)]₁ — constant selector commitment
S1          G1        [S₁(τ)]₁ — perm poly 1 commitment
S2          G1        [S₂(τ)]₁ — perm poly 2 commitment
S3          G1        [S₃(τ)]₁ — perm poly 3 commitment
X2          G2        [τ]₂ — from SRS (trusted setup)
omega       Fr        Primitive n-th root of unity
─────────────────────────────────────────────────────────────────────
```

**Polygon CDK Fork-id 6 VK** (`VerificationKey::default()`): hardcoded trong Rust crate, xem `src/lib.rs`.

---

## Fiat-Shamir Transcript Flow

```text
State:     T₀ = H("fflonk" || vk_hash)

Round 1:   T₁ = T₀ || C1.x || C1.y
           β  = H(T₁ || "beta")
           γ  = H(T₁ || "gamma")

Round 2:   T₂ = T₁ || C2.x || C2.y
           α  = H(T₂ || "alpha")

Round 3:   T₃ = T₂ || α
           ζ  = H(T₃ || "zeta")

Round 4:   T₄ = T₃ || ζ ||
                eval_ql || eval_qr || eval_qm || eval_qo || eval_qc ||
                eval_s1 || eval_s2 || eval_s3 ||
                eval_a  || eval_b  || eval_c  ||
                eval_z_omega || eval_t1w || eval_t2w
           υ  = H(T₄ || "upsilon")
```

> [!warning] Critical: Public input phải vào T₀ hoặc trước β
> Nếu `pub_input` không được hash trước challenge $\beta$, public input manipulation attack khả thi (Bug Class 7).

---

## Algebraic Constraint Summary

Tại evaluation point $\zeta$, verifier kiểm tra:

$$\underbrace{q_L \bar{a} + q_R \bar{b} + q_M \bar{a}\bar{b} + q_O \bar{c} + q_C + \text{PI}(\zeta)}_{\text{gate constraint}} = Z_H(\zeta) \cdot \bar{t}$$

$$\underbrace{\bar{z}_\omega \cdot (\bar{a}+\beta\zeta+\gamma)(\bar{b}+\beta k_1\zeta+\gamma)(\bar{c}+\beta k_2\zeta+\gamma)}_{\text{copy constraint LHS}} = \underbrace{\bar{z} \cdot (\bar{a}+\beta\bar{s}_1+\gamma)(\bar{b}+\beta\bar{s}_2+\gamma)(\bar{c}+\beta\bar{s}_3+\gamma)}_{\text{copy constraint RHS}}$$

$$L_1(\zeta) \cdot (\bar{z} - 1) = 0$$

---

## References

- [[05-fflonk-prover|05. FFLONK Prover]] — proof generation detail
- [[06-fflonk-verifier|06. FFLONK Verifier]] — verification steps
- [[08-fiat-shamir|08. Fiat-Shamir]] — transcript binding
- Polygon FflonkVerifier.sol — Solidity reference
