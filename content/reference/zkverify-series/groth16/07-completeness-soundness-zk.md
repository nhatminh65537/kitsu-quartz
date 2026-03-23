---
title: "07. Completeness, Soundness & Zero-Knowledge"
tags: [crypto, groth16, zksnark, security-properties, lesson-07]
aliases: [Groth16 Security Properties]
created: 2026-03-12
---

> **Prerequisites**: [[05-groth16-prover|05]], [[06-groth16-verifier|06]]  
> **Objectives**:  
> - Nắm formal definition của completeness, soundness, zero-knowledge trong ngữ cảnh Groth16
> - Hiểu tại sao Groth16 đạt **perfect completeness** và **perfect zero-knowledge**
> - Hiểu **computational knowledge soundness** và tại sao nó mạnh hơn soundness thông thường
> - Biết Groth16 security dựa trên **Generic Group Model** — ý nghĩa thực tiễn

---

## Ba Properties của zk-SNARK

> [!definition] Definition 7.1 — zk-SNARK Properties
> Một hệ thống $(Setup, Prove, Verify, Sim)$ cho relation $R$ là **zk-SNARK** nếu thỏa mãn:
>
> 1. **Perfect Completeness**: Nếu prover trung thực biết witness $w$ hợp lệ, verify luôn accept.
> 2. **Computational Knowledge Soundness**: Không có adversary PPT nào có thể convince verifier với statement false (trừ xác suất negligible).
> 3. **Perfect Zero-Knowledge**: Proof không tiết lộ bất kỳ thông tin nào về witness ngoài tính hợp lệ của statement.

---

## Perfect Completeness

> [!theorem] Theorem 7.2 — Groth16 là Perfectly Complete
> Nếu $(x, w) \in R$ (witness hợp lệ), thì với mọi $r, s \in \mathbb{F}_p$:
>
> $$\Pr[\text{Verify}(\text{vk}, x, \text{Prove}(\text{pk}, x, w, r, s)) = 1] = 1$$

**Proof sketch**: Bài 06 đã show rằng verification equation là algebraic identity khi $A(\tau)B(\tau) - C(\tau) = h(\tau)t(\tau)$. Nếu witness hợp lệ, $t | AB - C$ là exact, nên identity luôn đúng. Cross-terms $r, s$ cancel hoàn toàn. $\blacksquare$

**Ý nghĩa thực tiễn**: Prover trung thực **không bao giờ** có proof bị reject. Nếu proof generation thành công nhưng verify fail → implementation bug, không phải protocol lỗi.

---

## Computational Knowledge Soundness (và tại sao nó mạnh hơn thường)

Soundness thông thường chỉ nói: adversary không thể prove false statement. **Knowledge soundness** mạnh hơn:

> [!definition] Definition 7.3 — Knowledge Soundness
> Tồn tại **extractor** $\mathcal{E}$ sao cho: với mọi adversary $\mathcal{A}$ tạo được proof hợp lệ $\pi$ cho statement $x$, $\mathcal{E}$ (dùng same randomness, black-box access đến $\mathcal{A}$) có thể extract witness $w$ sao cho $(x, w) \in R$.

Nói nôm na: **Nếu bạn có thể prove, bạn phải "biết" witness**. Không thể prove mà không biết gì.

### Groth16: Computational (không phải perfect) Knowledge Soundness

Groth16 đạt **computational** knowledge soundness — tức là có adversary có thể break, nhưng adversary đó phải tốn thời gian exponential. Security proof của Groth16 hoạt động trong **Generic Group Model**.

> [!definition] Definition 7.4 — Generic Group Model (GGM)
> Trong GGM, adversary chỉ access group $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ qua oracle — không biết representation cụ thể của group elements, không thể exploit algebraic structure ngoài định nghĩa group.

**Ý nghĩa**: Security proof của Groth16 **chỉ valid trong GGM**, không phải trong standard model. Đây là điểm yếu lý thuyết. Tuy nhiên trong thực tế, các group (BN254, BLS12-381) được thiết kế để "behave like" generic groups với high probability.

---

## Perfect Zero-Knowledge

> [!theorem] Theorem 7.5 — Groth16 là Perfectly Zero-Knowledge
> Tồn tại simulator $\mathcal{S}$ (biết toxic waste $\alpha, \beta, \gamma, \delta$ nhưng **không biết witness**) có thể tạo proof $\pi^*$ sao cho phân phối của $\pi^*$ **identical** với phân phối của proof thật.

**Cách simulator hoạt động**:

Thay vì prove từ witness, simulator chọn random $A', C' \in \mathbb{G}_1$ và tính $B'$ để verification equation balance:

$$e([A']_1, [B']_2) = e([\alpha]_1, [\beta]_2) \cdot e([L_\text{pub}]_1, [\gamma]_2) \cdot e([C']_1, [\delta]_2)$$

Vì biết $\alpha, \beta, \gamma, \delta$, simulator có thể giải $[B']_2$ từ equation này. Proof $(A', B', C')$ là hợp lệ nhưng không liên quan gì đến witness.

**Tại sao thỏa mãn ZK?** Randomness $r, s$ khiến proof thật cũng là "random" trong $\mathbb{G}_1 \times \mathbb{G}_2 \times \mathbb{G}_1$ — phân phối giống hệt simulated proof.

> [!important] ZK chỉ với Fresh Randomness
> Nếu $r = 0$ hoặc $s = 0$ (do lỗi implementation), proof không còn ZK. Verifier có thể extract thông tin về witness.
> Đây là một lỗi implementation tiềm ẩn trong Groth16.

---

## Simulation Extractability

Groth16 thỏa mãn một property mạnh hơn standard ZK:

> [!definition] Definition 7.6 — Simulation Extractability
> Ngay cả khi adversary thấy nhiều simulated proofs (cho các statements khác nhau), họ vẫn không thể tạo proof mới hợp lệ mà không biết witness tương ứng.

Property này quan trọng cho composability — khi Groth16 được dùng như một sub-component trong protocol lớn hơn.

**Giới hạn**: Groth16 chỉ đạt **weak** simulation extractability trong standard model (không phải strong). Một số ứng dụng cần caution khi compose với other protocols.

---

## Non-Malleability và Groth16

Groth16 **không** phải non-malleable "out of the box":

> [!warning] Groth16 là Malleable
> Cho proof $\pi = ([A]_1, [B]_2, [C]_1)$ hợp lệ, attacker có thể tạo proof mới $\pi' = (-[A]_1, -[B]_2, [C]_1)$ cũng hợp lệ cho cùng statement.
>
> **Tại sao?** $e(-[A]_1, -[B]_2) = e([A]_1, [B]_2)$ (negation preserves pairing value).

Non-malleability phải được enforce ở application layer (ví dụ: thêm nullifier, binding proof đến specific context). Bài 10 sẽ cover chi tiết.

---

## Summary

| Property | Groth16 đạt được | Ghi chú |
|----------|-----------------|---------|
| Completeness | **Perfect** | Proof thật luôn verify |
| Soundness | **Computational (GGM)** | Security proof trong Generic Group Model |
| Zero-Knowledge | **Perfect** | Với fresh random $r, s$ |
| Knowledge Soundness | **Computational (GGM)** | Extractor tồn tại trong GGM |
| Non-Malleability | ❌ Không | Phải handle ở application layer |
| Simulation Extractability | **Weak** | Đủ cho nhiều ứng dụng |

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260), Section 3
- Boneh & Shoup — *A Graduate Course in Applied Cryptography* (toc.cryptobook.us), Ch. 20
- Bellare, Fuchsbauer, Scafuro — *NIZKs with an Untrusted CRS* (ePrint 2019/482) — simulation extractability
