---
title: "A1. Tool Cheatsheet"
tags: [crypto, groth16, tools, circom, snarkjs, appendix]
aliases: [Groth16 Tool Cheatsheet]
created: 2026-03-12
---

## snarkjs — Command Reference

### Powers of Tau (Phase 1)

```bash
# Tạo mới
snarkjs powersoftau new <curve> <power> <output.ptau>
# curve: bn128 | bls12_381
# power: 10..28 → hỗ trợ tối đa 2^power constraints

# Contribute
snarkjs powersoftau contribute <in.ptau> <out.ptau> --name="Name" -e="entropy"

# Add random beacon
snarkjs powersoftau beacon <in.ptau> <out.ptau> <beacon_hash_hex> <n_iter>

# Prepare for phase 2
snarkjs powersoftau prepare phase2 <in.ptau> <out.ptau>

# Verify
snarkjs powersoftau verify <ptau_file>

# Export challenge (for MPC tools)
snarkjs powersoftau export challenge <ptau> <challenge>
```

### Circuit Setup (Phase 2)

```bash
# Setup circuit
snarkjs groth16 setup <circuit.r1cs> <pot_final.ptau> <output_0000.zkey>

# Contribute to zkey
snarkjs zkey contribute <in.zkey> <out.zkey> --name="Name" -e="entropy"

# Add beacon
snarkjs zkey beacon <in.zkey> <out.zkey> <beacon_hash> <n_iter>

# Verify zkey
snarkjs zkey verify <circuit.r1cs> <pot_final.ptau> <circuit.zkey>

# Export verification key
snarkjs zkey export verificationkey <circuit.zkey> <vk.json>

# Export Solidity verifier
snarkjs zkey export solidityverifier <circuit.zkey> <verifier.sol>

# Show zkey info
snarkjs zkey info <circuit.zkey>
```

### R1CS Inspection

```bash
# Info (stats)
snarkjs r1cs info <circuit.r1cs>

# Print constraints (cần .sym file)
snarkjs r1cs print <circuit.r1cs> <circuit.sym>

# Export to JSON (để debug)
snarkjs r1cs export json <circuit.r1cs> <circuit.json>
```

### Witness

```bash
# Generate witness
node <circuit_js/generate_witness.js> <circuit.wasm> <input.json> <witness.wtns>

# Inspect witness
snarkjs wtns export json <witness.wtns> <witness.json>

# Check witness satisfies R1CS
snarkjs wtns check <circuit.r1cs> <witness.wtns>

# Debug witness (size)
snarkjs wtns info <witness.wtns>
```

### Prove & Verify

```bash
# Prove
snarkjs groth16 prove <circuit.zkey> <witness.wtns> <proof.json> <public.json>

# Verify
snarkjs groth16 verify <vk.json> <public.json> <proof.json>

# Generate Solidity calldata
snarkjs zkey export soliditycalldata <public.json> <proof.json>
```

---

## Circom — Command Reference

```bash
# Compile
circom <circuit.circom> --r1cs --wasm --sym --json -o <output_dir>
# Options:
#   --r1cs     generate .r1cs file
#   --wasm     generate witness calculator WASM
#   --sym      generate symbol table (for debug)
#   --json     generate constraints JSON (verbose debug)
#   --inspect  warn about unconstrained signals
#   --O2       optimization level 2 (recommended)
#   --prime    field prime (default: bn128)

# Full command for production
circom circuit.circom --r1cs --wasm --sym --O2 -o build/

# With inspect for audit
circom circuit.circom --r1cs --wasm --sym --inspect -o build/
```

---

## File Formats

### proof.json

```json
{
  "pi_a": ["<x>", "<y>", "1"],          // [A]_1 in G1 (projective)
  "pi_b": [["<x0>","<x1>"],["<y0>","<y1>"],["1","0"]],  // [B]_2 in G2
  "pi_c": ["<x>", "<y>", "1"],          // [C]_1 in G1
  "protocol": "groth16",
  "curve": "bn128"
}
```

### verification_key.json

```json
{
  "protocol": "groth16",
  "curve": "bn128",
  "nPublic": 2,
  "vk_alpha_1": [...],    // [α]_1
  "vk_beta_2": [...],     // [β]_2
  "vk_gamma_2": [...],    // [γ]_2  ← MUST != vk_delta_2
  "vk_delta_2": [...],    // [δ]_2  ← MUST != vk_gamma_2
  "vk_alphabeta_12": [...],  // precomputed e([α]_1, [β]_2)
  "IC": [...]             // Input Commitments — length = nPublic + 1
}
```

### Verification Key Security Check

```python
import json

with open("verification_key.json") as f:
    vk = json.load(f)

# Critical: gamma != delta
gamma = vk["vk_gamma_2"]
delta = vk["vk_delta_2"]
assert gamma != delta, "CRITICAL: gamma == delta! Vulnerable to forge attack!"

# Check IC length matches circuit
n_public = vk["nPublic"]
assert len(vk["IC"]) == n_public + 1, f"IC length mismatch: expected {n_public+1}"

print("Verification key looks OK")
```

---

## arkworks (Rust) — Groth16

```rust
use ark_bn254::Bn254;
use ark_circom::{CircomBuilder, CircomConfig};
use ark_groth16::{Groth16, prepare_verifying_key};
use ark_snark::SNARK;
use rand::rngs::StdRng;
use rand::SeedableRng;

fn main() {
    // Load circuit
    let cfg = CircomConfig::<Bn254>::new("circuit.wasm", "circuit.r1cs").unwrap();
    let mut builder = CircomBuilder::new(cfg);
    
    // Set inputs
    builder.push_input("a", 3);
    builder.push_input("b", 11);
    
    let circuit = builder.setup();
    
    // Generate proving key (or load from file)
    let mut rng = StdRng::seed_from_u64(42u64);
    let params = Groth16::<Bn254>::generate_random_parameters_with_reduction(
        circuit.clone(), &mut rng
    ).unwrap();
    
    // Prove
    let circuit = builder.build().unwrap();
    let proof = Groth16::<Bn254>::prove(&params, circuit, &mut rng).unwrap();
    
    // Verify
    let pvk = prepare_verifying_key(&params.vk);
    let public_inputs = vec![/* public input field elements */];
    let verified = Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof).unwrap();
    
    println!("Verified: {}", verified);
}
```

---

## py_ecc (Python) — BN128 Pairing

```python
from py_ecc.bn128 import (
    G1, G2,
    multiply,   # scalar multiplication
    add,        # point addition
    neg,        # point negation
    pairing,    # pairing e(G2_point, G1_point) [note: G2 first!]
    eq,         # point equality
    field_modulus as p,
    curve_order as r,
)

# [a]_1 = a * G1
a = 7
A = multiply(G1, a)

# [b]_2 = b * G2
b = 11
B = multiply(G2, b)

# e([a]_1, [b]_2) = e(G1, G2)^(ab)
e_AB = pairing(B, A)  # NOTE: py_ecc takes G2 first!

# Verify bilinearity
AB = a * b % r
e_direct = pairing(multiply(G2, AB), G1)
assert e_AB == e_direct
```

> [!warning] py_ecc argument order
> `pairing(G2_point, G1_point)` — G2 **trước** G1. Ngược với convention toán học $e([A]_1, [B]_2)$.

---

## circomlib — Key Templates

| Template | File | Mục đích |
|----------|------|---------|
| `Poseidon(n)` | `poseidon.circom` | ZK-friendly hash, $n$ inputs |
| `MiMC7(n)` | `mimcsponge.circom` | Alternative ZK hash |
| `LessThan(n)` | `comparators.circom` | $a < b$ cho $n$-bit values |
| `GreaterEqThan(n)` | `comparators.circom` | $a \geq b$ |
| `IsZero()` | `comparators.circom` | Check $a = 0$ |
| `IsEqual()` | `comparators.circom` | Check $a = b$ |
| `Bits2Num(n)` | `bitify.circom` | Bits → number, adds range constraint |
| `Num2Bits(n)` | `bitify.circom` | Number → bits |
| `MerkleTreeChecker(n)` | `merkletree.circom` | Merkle membership proof |
| `EdDSAMiMCVerifier()` | `eddsamimc.circom` | EdDSA signature verify |
