---
title: "A1. Bug Bounty Checklist"
tags: [crypto, bug-bounty, checklist, plonk, honk, appendix]
aliases: [Bug Bounty Checklist]
created: 2026-03-13
---

> Checklist tổng hợp để **audit PLONK/Honk verifier** trong một session bug bounty. Copy ra và tick từng mục.
> Xem context đầy đủ: [[11-security-vulnerabilities|11. Security Vulnerabilities]], [[12-zkverify-bug-bounty|12. zkVerify Bug Bounty]]

---

## 1. Fiat-Shamir Transcript

- [ ] **T01** — VK (verifier key / circuit description) hash vào transcript **trước** tất cả challenges
- [ ] **T02** — Public inputs (PI) hash vào transcript **trước** $\beta, \gamma$ (Round 1 challenges)
- [ ] **T03** — Tất cả commitments của từng round được hash **theo đúng thứ tự** vào transcript trước khi squeeze challenge của round đó
- [ ] **T04** — Mỗi challenge được derive từ **trạng thái transcript cộng dồn** (không reset giữa rounds)
- [ ] **T05** — Tất cả evaluations (openings $\bar{a}, \bar{b}, \ldots$) được hash vào transcript **trước** challenge $v, u$
- [ ] **T06** — Domain separator giữa VK, PI, commitment phân biệt rõ (không thể collide nhau)
- [ ] **T07** — Transcript hash function là **collision-resistant** (Keccak256, Poseidon — không phải MD5/SHA1)

**Nếu bất kỳ mục nào fail → potential Frozen Heart → Critical severity.**

---

## 2. Proof Parsing

- [ ] **P01** — Proof length được validate trước khi parse
- [ ] **P02** — Mỗi $\mathbb{G}_1$ point được check `is_on_curve()` **và** `!is_infinity()`
- [ ] **P03** — Mỗi field element $\mathbb{F}_r$ được check `< r` (scalar field modulus)
- [ ] **P04** — Base field elements $\mathbb{F}_q$ được check `< q` (pairing base field modulus)
- [ ] **P05** — Subgroup membership check nếu dùng curve với cofactor > 1
- [ ] **P06** — Không có integer overflow khi tính offset / index vào proof bytes

---

## 3. Verifier Logic

### Gate Constraints

- [ ] **V01** — Tất cả selector polynomials ($q_L, q_R, q_O, q_M, q_C$, custom) đều có mặt trong linearisation $r(X)$
- [ ] **V02** — Public input polynomial $\text{PI}(X)$ được cộng vào gate constraint (không bị bỏ quên)
- [ ] **V03** — Quotient split: $t(\zeta) = t_{\text{lo}}(\zeta) + \zeta^n t_{\text{mid}}(\zeta) + \zeta^{2n} t_{\text{hi}}(\zeta)$ — lũy thừa $\zeta^n$ đúng

### Permutation Argument

- [ ] **V04** — Initialisation: $L_1(\zeta)(z(\zeta) - 1) = 0$ được check (grand product starts at 1)
- [ ] **V05** — Accumulation relation: toàn bộ $\alpha$ term cho permutation có trong linearisation
- [ ] **V06** — Sigma polynomials $S_{\sigma 1}, S_{\sigma 2}$ được evaluate tại $\zeta$ và đưa vào check
- [ ] **V07** — $z(\zeta\omega)$ được đưa đúng vào linearisation (không nhầm $z(\zeta)$)

### Lookup (UltraPlonk / Honk)

- [ ] **V08** — Sorted table commitment được đưa vào transcript (table không thể bị swap)
- [ ] **V09** — Lookup grand product hoặc log-derivative identity được verify đầy đủ
- [ ] **V10** — Multiplicity polynomial $m_j$ được commit và validate
- [ ] **V11** — $\sum_i m_i = n$ (tổng multiplicities = số lookup queries) được enforce

### Opening Proof

- [ ] **V12** — Tất cả polynomials đã commit đều có evaluation tại opening point
- [ ] **V13** — Batch opening challenge $v$ được dùng **đúng lũy thừa** $v^0, v^1, \ldots$ cho từng polynomial
- [ ] **V14** — Pairing equation LHS và RHS đúng (không nhầm $[\tau]_2$ và $[1]_2$)
- [ ] **V15** — Multi-point opening ($\zeta$ và $\zeta\omega$): challenge $u$ kết hợp đúng cách

---

## 4. UltraHonk Specific (Sumcheck + ZeroMorph)

- [ ] **H01** — Sumcheck có đủ $k = \log_2 n$ rounds (không thiếu một round)
- [ ] **H02** — Mỗi round: $s_i(0) + s_i(1) \stackrel{?}{=} \text{prev\_claim}$ được check
- [ ] **H03** — Degree của $s_i(X)$ được verify (phải ≤ max relation degree, không phải bất kỳ)
- [ ] **H04** — Final sumcheck claim: $s_k(r_k) \stackrel{?}{=} F(r_1,\ldots,r_k)$ — final eval được check bằng ZeroMorph
- [ ] **H05** — ZeroMorph quotient polynomials $[q_1]_1, \ldots, [q_k]_1$ đều có mặt trong proof và được verify
- [ ] **H06** — ZeroMorph degree-check pairings đúng (đảm bảo $\deg q_i < 2^{k-1}$)
- [ ] **H07** — Tất cả MLEs (wires + selectors + permutation) đều được batch vào ZeroMorph

---

## 5. Circuit Design (Noir / ACIR)

- [ ] **C01** — Mọi boolean wire có constraint `b * (b-1) = 0`
- [ ] **C02** — Mọi range check có lookup gate range hoặc decomposition constraints đầy đủ
- [ ] **C03** — Mọi "output" wire từ gate $i$ có copy constraint sang "input" wire của gate dùng nó
- [ ] **C04** — Conditional selection: `cond * a + (1-cond) * b = out` — cond phải là boolean (C01)
- [ ] **C05** — Không có "nondeterministic hint" nào không được constraint (witness hoàn toàn xác định bởi public inputs + circuit)
- [ ] **C06** — ECDSA / hash circuits: output duy nhất hay nhiều preimages đều thoả mãn?

---

## 6. Severity Mapping (Immunefi)

| Mục fail | Bug class | Immunefi Severity | Bounty range |
|----------|-----------|------------------|--------------|
| T01–T07 | Soundness (Frozen Heart) | Critical | $50k–$250k+ |
| P02 | Soundness (Point at Infinity) | Critical | $50k–$250k+ |
| V01–V15 | Soundness (missing constraint) | Critical | $50k–$250k+ |
| H01–H07 | Soundness (Honk) | Critical | $50k–$250k+ |
| C01–C06 | Soundness (circuit) | High–Critical | $10k–$50k |
| P01, P03–P06 | DoS / incorrect behaviour | Medium–High | $1k–$10k |

---

## Quick Reference: Khi Tìm Thấy Bug

1. **Reproduce ngay**: viết test case tối giản chứng minh bug (không phụ thuộc external state)
2. **Estimate impact**: có thể forge bất kỳ proof không? Hay chỉ trong điều kiện đặc biệt?
3. **Draft report** theo template [[12-zkverify-bug-bounty|Lesson 12 PoC Template]]
4. **Submit private** qua Immunefi — không disclose public trước khi có response (90 ngày embargo)
5. **Không khai thác thật** — ngay cả với proof-of-concept on mainnet

