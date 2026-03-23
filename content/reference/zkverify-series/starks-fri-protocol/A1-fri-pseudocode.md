---
title: "A1. FRI Pseudocode Reference"
tags: [cryptography, fri, pseudocode, reference, appendix]
aliases: [FRI Pseudocode, FRI Reference]
created: 2026-03-13
---

> **Mục đích**: Pseudocode chính xác cho FRI prover và verifier — dùng khi implement hoặc audit code thực.

---

## FRI Prover (Commit Phase)

```
PROCEDURE FRI_Commit(f₀, D₀, ρ, transcript):
  INPUT:
    f₀        : polynomial coefficients, degree < k
    D₀        : evaluation domain, |D₀| = n = k/ρ
    ρ         : code rate
    transcript: Fiat-Shamir transcript state

  OUTPUT: {roots, layers, alphas, final_poly}

  // Step 1: Initial evaluation
  evals₀ = [f₀(x) for x in D₀]   // O(n log n) via NTT
  root₀  = MerkleRoot(evals₀)
  transcript.absorb(root₀)
  roots  = [root₀]
  layers = [evals₀]
  alphas = []
  
  i = 0
  current_evals = evals₀
  current_domain = D₀

  // Step 2: Folding rounds
  WHILE |current_domain| > STOP_THRESHOLD:
    // Get verifier challenge via Fiat-Shamir
    αᵢ₊₁ = transcript.squeeze_field_element()
    alphas.append(αᵢ₊₁)

    // Fold: domain halves, polynomial degree halves
    n_half = |current_domain| / 2
    new_evals = []
    FOR j IN 0..n_half:
      x   = current_domain[j]
      fx  = current_evals[j]           // f(x)
      f_x = current_evals[j + n_half]  // f(-x)  [domain[j + n_half] = -domain[j]]
      
      // f_E(x²) = (f(x) + f(-x)) / 2
      fE = (fx + f_x) * inv(2)
      
      // f_O(x²) = (f(x) - f(-x)) / (2x)
      fO = (fx - f_x) * inv(2*x)
      
      // g(x²) = f_E(x²) + α * f_O(x²)
      new_evals[j] = fE + αᵢ₊₁ * fO
    
    new_domain = [x² for x in current_domain[:n_half]]
    
    root_i = MerkleRoot(new_evals)
    transcript.absorb(root_i)
    roots.append(root_i)
    layers.append(new_evals)

    current_evals  = new_evals
    current_domain = new_domain
    i += 1

  // Step 3: Final polynomial (small enough to send directly)
  final_poly = InterpolateFromEvals(current_evals, current_domain)
  transcript.absorb(Encode(final_poly))

  RETURN {roots, layers, alphas, final_poly}
```

---

## FRI Prover (Query Phase)

```
PROCEDURE FRI_Query(layers, alphas, transcript, num_queries):
  INPUT:
    layers     : list of (evals, MerkleTree) from commit phase
    alphas     : fold challenges from commit phase
    transcript : Fiat-Shamir transcript (after commit phase)
    num_queries: number of queries q

  OUTPUT: list of query proofs

  query_proofs = []

  FOR q IN 0..num_queries:
    // Derive query position via Fiat-Shamir
    ι = transcript.squeeze_index() mod (|layers[0].evals| / 2)

    proof = []
    current_ι = ι

    FOR i IN 0..len(alphas):
      evals_i, tree_i = layers[i]
      n_i = |evals_i|
      half_i = n_i / 2

      pos_x  = current_ι              // index for f(x)
      pos_nx = current_ι + half_i     // index for f(-x)

      f_x  = evals_i[pos_x]
      f_nx = evals_i[pos_nx]

      // Merkle auth paths for both positions
      path_x  = MerkleAuthPath(tree_i, pos_x)
      path_nx = MerkleAuthPath(tree_i, pos_nx)

      proof.append({
        round: i,
        f_x:   f_x,  f_nx:  f_nx,
        path_x: path_x, path_nx: path_nx
      })

      current_ι = current_ι mod (half_i / 2)

    query_proofs.append({index: ι, round_proofs: proof})

  RETURN query_proofs
```

---

## FRI Verifier

```
PROCEDURE FRI_Verify(roots, final_poly, query_proofs, alphas,
                     initial_domain, degree_bound):
  INPUT:
    roots         : Merkle roots from commit phase
    final_poly    : final low-degree polynomial
    query_proofs  : decommitments from query phase
    alphas        : RECOMPUTED from Fiat-Shamir (verifier side)
    initial_domain: D₀
    degree_bound  : k

  // Step 1: Verify final poly has correct degree
  IF deg(final_poly) > degree_bound / 2^(num_rounds):
    RETURN REJECT

  // Step 2: For each query, verify consistency
  FOR qproof IN query_proofs:
    ι = qproof.index
    current_ι = ι

    FOR i IN 0..len(alphas):
      rp = qproof.round_proofs[i]

      // Verify Merkle auth paths
      IF NOT MerkleVerify(roots[i], rp.pos_x,  rp.f_x,  rp.path_x):
        RETURN REJECT
      IF NOT MerkleVerify(roots[i], rp.pos_nx, rp.f_nx, rp.path_nx):
        RETURN REJECT

      // Get x for this position
      x = initial_domain[ι] ^ (2^i)   // x at round i

      // Verify colinearity (folding relation)
      fE = (rp.f_x + rp.f_nx) * inv(2)
      fO = (rp.f_x - rp.f_nx) * inv(2*x)
      expected_next = fE + alphas[i] * fO

      // Get actual next value
      IF i + 1 < len(alphas):
        actual_next = query_proofs[q].round_proofs[i+1].f_x_at_mapped_pos
      ELSE:
        actual_next = final_poly.eval(x ^ 2)

      IF expected_next != actual_next:
        RETURN REJECT

      current_ι = current_ι mod (|domain at round i| / 4)

  RETURN ACCEPT
```

---

## DEEP-FRI: Linking AIR to FRI

```
PROCEDURE DEEP_Commit(trace_polys, quotient_polys, transcript, domain):
  // Step 1: Get DEEP challenge z outside domain
  z = transcript.squeeze_field_element()
  ASSERT z NOT IN domain  // CRITICAL: z must be outside D

  // Step 2: Evaluate all polynomials at z (and ω*z for trace)
  omega = get_generator(domain)
  deep_values = {}
  FOR j, tpoly IN enumerate(trace_polys):
    deep_values[f"t_{j}(z)"]    = tpoly.eval(z)
    deep_values[f"t_{j}(wz)"]   = tpoly.eval(omega * z)
  FOR k, qpoly IN enumerate(quotient_polys):
    deep_values[f"q_{k}(z^S)"]  = qpoly.eval(z^S)  // S = trace domain size

  transcript.absorb(Encode(deep_values))

  // Step 3: Build DEEP composition polynomial F(X)
  // Random weights α, β, γ from transcript
  alphas = transcript.squeeze_n_field_elements(len(trace_polys))
  betas  = transcript.squeeze_n_field_elements(len(trace_polys))
  gammas = transcript.squeeze_n_field_elements(len(quotient_polys))

  // F(X) = Σ α_j * (t_j(X) - t_j(z)) / (X - z)
  //      + Σ β_j * (t_j(X) - t_j(wz)) / (X - wz)
  //      + Σ γ_k * (q_k(X) - q_k(z^S)) / (X - z^S)
  F = build_deep_poly(
    trace_polys, quotient_polys, deep_values,
    alphas, betas, gammas, z, omega
  )

  // Step 4: Commit F via standard FRI
  fri_proof = FRI_Commit(F, domain, rho, transcript)

  RETURN {deep_values, fri_proof, z}

PROCEDURE DEEP_Verify(roots_trace, roots_quotient, deep_values, z,
                      fri_proof, public_constraints, transcript):
  // Step 1: Re-derive z from transcript
  z_expected = transcript.squeeze_field_element()
  ASSERT z_expected == z  // Check transcript binding

  // Step 2: Verify deep_values are consistent with public constraints
  // (verifier can compute C_comp(z) from deep_values and public AIR)
  expected_comp = eval_composition(deep_values, public_constraints, z)
  actual_comp   = deep_values["C_comp_at_z"]
  ASSERT expected_comp == actual_comp

  // Step 3: Re-derive FRI weights
  alphas = transcript.squeeze_n_field_elements(...)
  // ...

  // Step 4: Verify FRI proof for F
  RETURN FRI_Verify(fri_proof.roots, fri_proof.final_poly, ...)
```

---

## Merkle Tree

```
PROCEDURE MerkleRoot(leaves):
  layer = [H("\x00" || encode(leaf)) for leaf in leaves]  // leaf prefix
  WHILE |layer| > 1:
    layer = [H("\x01" || layer[i] || layer[i+1])           // internal prefix
             for i in 0, 2, 4, ..., |layer|-2]
  RETURN layer[0]

PROCEDURE MerkleAuthPath(tree, index):
  path = []
  FOR each_layer IN tree[:-1]:
    sibling_idx = index XOR 1
    path.append(each_layer[sibling_idx])
    index >>= 1
  RETURN path

PROCEDURE MerkleVerify(root, index, leaf, path):
  current = H("\x00" || encode(leaf))
  FOR sibling IN path:
    IF index is odd:
      current = H("\x01" || sibling || current)
    ELSE:
      current = H("\x01" || current || sibling)
    index >>= 1
  RETURN current == root
```

---

## Non-Interactive Transformation (Fiat-Shamir)

```
PROCEDURE STARK_Prove(trace, public_inputs):
  state = H("stark_v1" || domain_params || Encode(public_inputs))

  // Phase 1: Trace commit
  trace_evals  = LDE(trace)
  root_trace   = MerkleRoot(trace_evals)
  state        = H(state || root_trace)

  // Phase 2: Constraint combination challenge
  alphas_air   = FieldElements(state, n=num_constraints)
  C_comp       = build_composition(trace, alphas_air)
  root_comp    = MerkleRoot(LDE(C_comp))
  state        = H(state || root_comp)

  // Phase 3: DEEP challenge
  z            = FieldElement(state)           // Outside domain: check!
  deep_values  = eval_all_at_z(trace, C_comp, z)
  state        = H(state || Encode(deep_values))

  // Phase 4: FRI fold challenges
  fri_roots = []
  fri_alphas = []
  FOR round IN 0..FRI_ROUNDS:
    alpha_fri = FieldElement(state)
    fri_alphas.append(alpha_fri)
    fold_polynomial(alpha_fri)
    root_fri = MerkleRoot(current_evals)
    fri_roots.append(root_fri)
    state = H(state || root_fri)

  // Phase 5: Query positions
  query_positions = [Int(H(state || i)) mod half_domain for i in 0..NUM_QUERIES]
  decommitments = open_all_layers(query_positions)

  RETURN Proof{
    root_trace, root_comp,
    deep_values,
    fri_roots, fri_final_poly,
    decommitments
  }
```

---

## Common Constants

| Parameter | Typical value | Source |
|-----------|--------------|--------|
| `STOP_THRESHOLD` | `max_remainder_size = 64` | ethSTARK |
| `NUM_QUERIES` | $80$–$128$ | $\approx \lambda$ |
| `BLOWUP` | $4$ hoặc $8$ | Code rate $1/4$ hoặc $1/8$ |
| Hash | BLAKE3, Poseidon | BLAKE3 for speed; Poseidon for ZK-friendly |
| Field | BabyBear hoặc Goldilocks | RISC Zero, Plonky2 |
