---
title: "00. Roadmap"
tags: [crypto, zk, polynomial-commitments, roadmap]
created: 2026-03-12
---

> **Topic**: Polynomial Commitments  
> **Domain**: Cryptography (ZK)  
> **Level**: Advanced  
> **Background**: Modular arithmetic, group theory, elliptic curves cơ bản, Python  
> **Tools / Code**: SageMath, Python (py_ecc), Rust (arkworks)  
> **Context**: Bug bounty trên zkVerify — nắm sâu để audit verifier pallets  
> **Sources**: KZG original paper (Kate et al. 2010), Dankrad Feist's blog, ZKDocs (ToB), ZKP MOOC Berkeley, 0xPARC zk-bug-tracker  

---

## Lessons

| # | Title | Key Concepts | Prerequisites | Difficulty |
|---|-------|-------------|---------------|------------|
| 01 | Polynomials over Finite Fields | Đa thức, evaluation, Lagrange interpolation, FFT domains, Reed-Solomon | — | ★★☆☆☆ |
| 02 | Commitment Scheme Fundamentals | Binding/hiding/correctness, vector commitments, Pedersen, formal definitions | 01 | ★★★☆☆ |
| 03 | KZG Commitments | Trusted setup, SRS, commit, open, verify, batch opening | 02, pairing basics | ★★★★☆ |
| 04 | KZG Security Analysis | t-SDH, evaluation binding proof, knowledge soundness, known attacks | 03 | ★★★★★ |
| 05 | IPA & Bulletproofs-style | Inner Product Argument, Pedersen vector, log-size proof, no trusted setup | 02 | ★★★★☆ |
| 06 | FRI Protocol | Reed-Solomon proximity, commit/query phases, soundness, STARK foundation | 01, IOP concept | ★★★★★ |
| 07 | PLONK & Multi-point Evaluation | PLONK + KZG, linearization, batch multi-poly multi-point proofs | 03, 04 | ★★★★★ |
| 08 | Trusted Setup Vulnerabilities | Toxic waste, Powers of Tau, subgroup attacks, rogue key | 03 | ★★★★☆ |
| 09 | Common Implementation Bugs | Soundness bugs, subgroup check, Fiat-Shamir, transcript, blinding | 03–07 | ★★★★★ |
| 10 | zkVerify Audit Targets | Attack surface zkVerify, verifier pallets, bug patterns, PoC | 08, 09 | ★★★★★ |

## Appendix Candidates

| ID | Content | Related Lesson | Notes |
|----|---------|----------------|-------|
| A0 | Pairing Cheatsheet | 03, 04, 07 | BLS12-381, BN254, tính toán nhanh |
| A1 | Bug Checklist | 08, 09, 10 | Checklist đầy đủ dùng khi audit |

---

## Dependency Graph

```mermaid
graph TD
    L01[01 Polynomials<br>over Finite Fields] --> L02[02 Commitment<br>Scheme Fundamentals]
    L02 --> L03[03 KZG<br>Commitments]
    L03 --> L04[04 KZG Security<br>Analysis]
    L02 --> L05[05 IPA and<br>Bulletproofs]
    L01 --> L06[06 FRI<br>Protocol]
    L03 --> L07[07 PLONK and<br>Multi-point Eval]
    L04 --> L07
    L03 --> L08[08 Trusted Setup<br>Vulnerabilities]
    L04 --> L09[09 Implementation<br>Bugs]
    L05 --> L09
    L06 --> L09
    L08 --> L10[10 zkVerify<br>Audit Targets]
    L09 --> L10
```

---

## Progress Tracker

- [ ] [[00-roadmap|00. Roadmap]]
- [ ] [[01-polynomials-over-finite-fields|01. Polynomials over Finite Fields]]
- [ ] [[02-commitment-scheme-fundamentals|02. Commitment Scheme Fundamentals]]
- [ ] [[03-kzg-commitments|03. KZG Commitments]]
- [ ] [[04-kzg-security-analysis|04. KZG Security Analysis]]
- [ ] [[05-ipa-bulletproofs|05. IPA & Bulletproofs-style]]
- [ ] [[06-fri-protocol|06. FRI Protocol]]
- [ ] [[07-plonk-multi-point-evaluation|07. PLONK & Multi-point Evaluation]]
- [ ] [[08-trusted-setup-vulnerabilities|08. Trusted Setup Vulnerabilities]]
- [ ] [[09-implementation-bugs|09. Common Implementation Bugs]]
- [ ] [[10-zkverify-audit-targets|10. zkVerify Audit Targets]]
- [ ] [[a0-pairing-cheatsheet|A0. Pairing Cheatsheet]]
- [ ] [[a1-bug-checklist|A1. Bug Checklist]]
