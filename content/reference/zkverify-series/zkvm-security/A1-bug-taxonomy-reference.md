---
title: "A1. ZK Bug Taxonomy Reference Card"
tags: [zk, zkvm, security, reference, appendix, taxonomy]
aliases: [Bug Taxonomy Reference]
created: 2026-03-13
---

> Quick-reference card — tóm tắt [[06-zk-bug-taxonomy|06]] và [[07-threat-models-zkvm|07]] để tra cứu nhanh khi audit.

---

## Security Properties

| Property | Định nghĩa | Bị break khi nào |
|----------|-----------|-----------------|
| **Soundness** | Prover gian lận không thể convince verifier | Circuit underconstrained / Fiat-Shamir bug |
| **Completeness** | Honest prover luôn succeed | Circuit overconstrained / Computational bug |
| **Zero-Knowledge** | Proof không leak witness info | ZK property violation (GHSA-5xgj) |

---

## Bug Taxonomy (USENIX'24 Corpus — 141 bugs)

### Layer Distribution

| Layer | % tổng | Priority khi audit |
|-------|--------|-------------------|
| Circuit | ~70% | ⭐⭐⭐⭐⭐ |
| Integration | ~15% | ⭐⭐⭐⭐ |
| Backend | ~10% | ⭐⭐⭐ |
| Frontend | ~5% | ⭐⭐⭐ |

### Circuit Bug Sub-classes

| Sub-class | % trong circuit bugs | Break | Example |
|-----------|---------------------|-------|---------|
| **Underconstrained** | ~97% | Soundness | CVE-2025-52484, ExpandU32 |
| **Overconstrained** | ~3% | Completeness | V-RISC0-VUL-005 |
| **Computational** | ~1% | Completeness | Witness generation error |

---

## Adversary Model

| Adversary | Mục tiêu | Có thể làm | Không thể làm (nếu circuit đúng) |
|-----------|---------|-----------|----------------------------------|
| **R3 Adversarial Prover** | Forge proof | Control host, inputs, witness | Convince honest verifier với circuit đúng |
| **R2 Adversarial User** | DoS / exploit | Craft public inputs | Change guest program |
| **R4 Adversarial Verifier** | Extract witness | Analyze proof | (ZK property issue nếu weak) |

---

## Underconstrained Patterns — Quick Detection

```
Signal X := NondetReg()  ← Không có explicit constraint?
                              → Red flag: Prover sets X = bất kỳ field element

Signal B := NondetTwitReg()  ← Context cần {0,1}?
                              → Red flag: B ∈ {0,1,2,3} không đủ

if opcode == FOO {
    rd = computation;    ← Khi opcode != FOO, rd không bị constrain?
}                        → Red flag: Missing else constraint

cross-table lookup claim ← Claim trong chip A được enforce bởi chip B?
                          → Red flag nếu lookup constraint thiếu
```

---

## Integration Bug Quick-check

```solidity
verifier.verify(seal, IMAGE_ID, sha256(journal));  // ✅ imageId checked
verifier.verify(seal, sha256(journal));             // 🚨 No imageId!

require(!nullifiers[n], "Used"); nullifiers[n] = true;  // ✅
// (no nullifier check)                                   // 🚨 Replay!

(uint64 amount, address to) = abi.decode(journal, (uint64, address));  // ✅ if order matches
(address to, uint64 amount) = abi.decode(journal, (address, uint64));  // 🚨 Mismatch!
```

---

## Fiat-Shamir Invariant

```
FOR EVERY value V that appears in a verifier equation:
    V MUST be absorbed into transcript BEFORE
    the challenge that gates that equation is sampled.

Violation → V is attacker-controlled → proof forgery
```

---

## Severity Classification

| Severity | Condition | Examples |
|----------|-----------|---------|
| **Critical** | Arbitrary proof forgery | CVE-2025-52484, SP1 LambdaClass, Unfaithful Claims |
| **High** | Class-specific forgery, major soundness | ExpandU32, Poseidon2 precompile |
| **Medium** | Completeness failure, limited DoS | Overconstrained bugs |
| **Low** | ZK property, minor completeness | GHSA-5xgj |
