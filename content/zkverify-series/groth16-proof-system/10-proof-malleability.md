---
title: "10. Proof Malleability & Extensibility Attacks"
tags: [crypto, groth16, zksnark, malleability, security, lesson-10]
aliases: [Groth16 Proof Malleability]
created: 2026-03-12
---

> **Prerequisites**: [[05-groth16-prover|05]], [[06-groth16-verifier|06]]
> **Objectives**:
> - Hiểu Groth16 malleable như thế nào và tại sao
> - Biết các dạng transformation tạo proof mới từ proof cũ
> - Hiểu attack scenario thực tế: double-spending
> - Biết các mitigation patterns

---

## Groth16 là Malleable — Định nghĩa

> [!definition] Definition 10.1 — Proof Malleability
> Một proof system là **malleable** nếu adversary có thể tạo proof mới $\pi'$ từ proof $\pi$ mà không biết witness, sao cho $\pi' \neq \pi$ nhưng verify pass cho cùng statement.

Groth16 **là malleable**. Đây không phải bug, mà là **tính chất đã biết** của protocol. Vấn đề xảy ra khi application **dùng proof như identifier** (nullifier) — adversary có thể forge một proof khác để bypass deduplication.

---

## Các dạng Transformation

### Transformation 1: Negation (đơn giản nhất)

Cho proof hợp lệ $\pi = ([A]_1, [B]_2, [C]_1)$:

$$\pi' = (-[A]_1, -[B]_2, [C]_1)$$

> [!theorem] Theorem 10.2 — Negation Transformation hợp lệ
> $e(-[A]_1, -[B]_2) = e([A]_1, [B]_2)$
>
> **Proof**: $e(-P, -Q) = e(P, Q)^{(-1)(-1)} = e(P, Q)^1 = e(P, Q)$. $\blacksquare$

Vì vế trái của verification equation không đổi, $\pi'$ cũng verify pass.

### Transformation 2: Random Rerandomization

Cho $k \in \mathbb{F}_p$ random:

$$[A']_1 = [A]_1 + k[\delta]_1$$
$$[B']_2 = [B]_2 + k^{-1}[\delta]_2 \quad \text{(nếu biết } [\delta^{-1}]_T\text{)}$$

Cách này phức tạp hơn và cần thêm thông tin từ verifying key.

### Transformation đơn giản nhất trong thực tế

Thực ra attacker không cần tính toán phức tạp. Với một số verifier implementations:

- Swap $[A]_1 \leftrightarrow$ negative: nhiều implementations cho phép (nếu không check sub-group / sign)
- Thêm/trừ zero elements: một số implementations không check $[C]_1 + \mathcal{O}$ (infinity point)

---

## Attack Scenario: Double-Spending

Xét deposit/withdrawal system dùng ZK:

```
Deposit: user deposit 1 ETH
Withdraw: user gửi proof π chứng minh biết secret → nhận 1 ETH
```

Nếu contract dùng proof bytes làm nullifier:

```solidity
// VULNERABLE CODE
mapping(bytes32 => bool) public usedProofs;

function withdraw(Proof memory proof, ...) external {
    bytes32 proofHash = keccak256(abi.encode(proof));
    require(!usedProofs[proofHash], "Proof already used");
    require(verifier.verifyProof(proof, ...), "Invalid proof");
    
    usedProofs[proofHash] = true;  // Mark proof as used
    payable(msg.sender).transfer(1 ether);
}
```

**Attack**:
1. Alice gửi proof $\pi$ để withdraw
2. Attacker (hoặc Alice lần 2) tạo $\pi' = (-[A]_1, -[B]_2, [C]_1)$
3. `keccak256(π') ≠ keccak256(π)` → `usedProofs[hash(π')] = false`
4. `verifyProof(π', ...)` → true (vì transformation valid)
5. Withdraw lần 2 thành công → double-spending!

---

## Real-World Examples

### Tornado Cash

Tornado Cash sử dụng **nullifier pattern đúng cách** — proof không được dùng làm nullifier. Thay vào đó, circuit tính `nullifier = Poseidon(secret, 0)` và contract track nullifier hash. Transformation của proof không thay đổi nullifier (vì nó là public output của circuit) → chống double-spending.

### Zcash / BCTV-14 Issue

Trước khi Sapling upgrade, Zcash dùng BCTV-14 (không phải Groth16). BCTV-14 có malleability issue nghiêm trọng hơn — attacker có thể forge proof **cho statement khác** (không chỉ transform proof cho cùng statement). Zcash upgrade lên Groth16 để fix.

### gnark Extension Vulnerability (2024)

Zellic phát hiện trong gnark's extension to Groth16: một vulnerability cho phép extract private witness bits từ proof. Root cause: commitment mechanism không đủ hiding. Fixed in gnark v0.11.0.

---

## Giải thích kỹ thuật: Tại sao Groth16 Malleable?

Nhìn lại verification equation:

$$e([A]_1, [B]_2) = e([\alpha]_1, [\beta]_2) \cdot e([L]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$$

Chỉ có vế **trái** chứa $[A]_1, [B]_2$. Vế phải chứa $[C]_1$ độc lập. Pairing $e(-P, -Q) = e(P, Q)$, nên bất kỳ transformation nào preserve $e([A]_1, [B]_2)$ đều tạo proof mới hợp lệ.

Non-malleability sẽ yêu cầu **binding proof đến specific transcript/context** — Groth16 không có cơ chế này built-in.

---

## Mitigations

> [!important] Mitigation 1 — Không dùng proof làm nullifier
> Luôn dùng **circuit-computed nullifier** (như Poseidon hash của secret) làm identifier, không phải proof bytes.

> [!important] Mitigation 2 — Bind proof đến context
> Thêm `msg.sender` hoặc nonce vào **public inputs** của circuit. Proof chỉ valid cho một address cụ thể.
>
> ```circom
> signal input recipient_address;  // public — bind proof to recipient
> // Constraint: recipient_address phải match expected value
> ```

> [!important] Mitigation 3 — Sub-group check (chống transformation attack)
> Ensure proof points nằm trong đúng subgroup. snarkjs-generated verifier sau PR #36 đã enforce `proof.A, B, C < prime q`.

> [!important] Mitigation 4 — Strong signature over proof
> Prover ký proof với private key; contract verify signature trước khi verify proof.

---

## Kiểm tra Code: Nhận diện Vulnerable Pattern

Khi audit, tìm patterns này:

```solidity
// RED FLAG 1: Proof hash làm nullifier
bytes32 nullifier = keccak256(abi.encode(proof.pi_a, proof.pi_b, proof.pi_c));

// RED FLAG 2: Không check public inputs khớp với expected state
verifier.verifyProof(a, b, c, input);  // không validate input[] values

// RED FLAG 3: Missing sub-group check (verifier cũ)
// Check: verifier contract có require(proof.pi_a[0] < PRIME_Q) không?
```

---

## Summary

- Groth16 malleable: $(-[A]_1, -[B]_2, [C]_1)$ là proof hợp lệ cho cùng statement
- Root cause: $e(-P, -Q) = e(P, Q)$ — verification equation không phân biệt negated proof
- **Attack**: double-spending khi dùng proof hash làm nullifier
- **Fix**: dùng circuit-computed nullifier, bind proof đến context (recipient, nonce)
- Audit checklist: tìm `keccak256(proof)` làm nullifier → automatic red flag

---

## References

- Taras Shchybovyk — *zkSNARK Malleability Attack on Groth16* (Medium, 2023)
- SlowMist — *Extensibility Attacks on Groth16 Proofs* (slowmist.medium.com)
- Zellic — *Two Vulnerabilities in gnark's Groth16 Proofs* (zellic.io, 2024)
- iden3/snarkjs PR #36 — Sub-group check fix
