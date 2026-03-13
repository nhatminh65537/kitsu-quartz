---
title: "05. Fiat-Shamir and Security Model"
tags: [crypto, plonk, fiat-shamir, security, agm, lesson-05]
aliases: [Fiat-Shamir and Security Model]
created: 2026-03-13
---

> **Prerequisites**: [[04-plonk-prover-verifier|04. PLONK Prover and Verifier]] — rounds, challenges, transcript; [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]] — AGM  
> **Objectives**:  
> - Hiểu Fiat-Shamir transformation và Random Oracle Model
> - Nắm formal security definitions: knowledge soundness, zero-knowledge, succinctness
> - Biết cách xây dựng transcript đúng cho PLONK
> - Phân tích Frozen Heart vulnerability chi tiết — đây là bug class thực tế quan trọng nhất
> - Nhận biết các dấu hiệu Fiat-Shamir implement sai trong source code

---

## Motivation

PLONK là **interactive proof** — Verifier gửi challenges ngẫu nhiên qua 5 rounds. Nhưng trong thực tế, không ai muốn interaction. **Fiat-Shamir** biến interactive proof thành non-interactive bằng cách thay challenges bằng hash outputs. Nếu làm sai, toàn bộ soundness sụp đổ.

---

## Fiat-Shamir Transformation

> [!definition] Definition 5.1 — Fiat-Shamir Heuristic
> Cho interactive proof $(P, V)$ public-coin (Verifier chỉ gửi random strings). Fiat-Shamir biến nó thành non-interactive bằng cách:
>
> - Prover tự tính challenges bằng hash của **transcript tích lũy đến thời điểm đó**
> - $\text{challenge}_i = H(\text{vk} \| \text{public\_inputs} \| \text{msg}_1 \| \ldots \| \text{msg}_i)$
>
> trong đó $H$ là hash function, được model như **Random Oracle** trong proof of security.

> [!definition] Definition 5.2 — Random Oracle Model (ROM)
> Trong ROM, hash function $H: \{0,1\}^* \to \{0,1\}^\lambda$ được xem là **truly random function** — adversary chỉ truy cập $H$ qua queries, và $H(x)$ cho $x$ mới là uniformly random độc lập với tất cả queries trước.
>
> ROM cho phép chứng minh security của Fiat-Shamir, nhưng là **heuristic** — không có hash function thực tế nào được chứng minh là random oracle.

**Tại sao Fiat-Shamir an toàn (heuristically)?**

Trong interactive proof, challenges ngẫu nhiên ngăn Prover "cheat" bằng cách chọn message sau khi đã biết challenge. Với Fiat-Shamir, challenges phụ thuộc vào hash của messages đã gửi — Prover không thể back-compute messages để match một challenge cụ thể (vì hash là one-way).

---

## Security Definitions

> [!definition] Definition 5.3 — Knowledge Soundness
> Một proof system $(\text{Setup}, P, V)$ có **knowledge soundness** với extractor $E$ nếu:
>
> Với mọi adversary $A^*$ tạo được proof $\pi$ khiến Verifier accept với non-negligible probability, tồn tại extractor $E$ có thể **extract witness** $w$ sao cho $(x, w) \in \mathcal{R}$, chỉ bằng cách black-box rewind $A^*$.
>
> **Trong PLONK**: Nếu Prover thuyết phục Verifier, extractor có thể tìm được wire polynomials $a, b, c$ hợp lệ (bằng cách rewinding Prover với các challenges khác nhau).

> [!definition] Definition 5.4 — Zero-Knowledge (Computational ZK)
> Proof system có **computational ZK** nếu tồn tại simulator $S$ sao cho: với mọi adversary $A$ (PPT), distribution của transcript thật $(P(x, w) \leftrightarrow V)$ không phân biệt được với simulated transcript $S(x)$ — tức là transcript không leak thông tin về $w$.
>
> **Trong PLONK**: Random blinding terms trong wire polynomials và $z(X)$ đảm bảo ZK. ZK là statistical (không perfect, do footnote 11 — denominator zero).

> [!definition] Definition 5.5 — Succinctness
> Proof size là $O(\text{poly}(\lambda))$ (độc lập với circuit size $n$). Verification time là $O(\text{poly}(\lambda) + |\text{public inputs}|)$ — không phụ thuộc vào $n$ (chỉ cần $O(1)$ pairings).

---

## Transcript Construction đúng cho PLONK

> [!definition] Definition 5.6 — PLONK Transcript
> Transcript đầy đủ phải gồm (theo thứ tự):
>
> 1. **Verification key** (circuit description): $[q_M]_1, [q_L]_1, [q_R]_1, [q_O]_1, [q_C]_1, [S_{\sigma 1}]_1, [S_{\sigma 2}]_1, [S_{\sigma 3}]_1$
> 2. **Public inputs**: tất cả $\text{PI}_i$ (field elements)
> 3. **Round 1 messages**: $[a]_1, [b]_1, [c]_1$ → hash → $\beta, \gamma$
> 4. **Round 2 message**: $[z]_1$ → hash → $\alpha$
> 5. **Round 3 messages**: $[t_{lo}]_1, [t_{mid}]_1, [t_{hi}]_1$ → hash → $\zeta$
> 6. **Round 4 messages**: $\bar{a}, \bar{b}, \bar{c}, \bar{S}_{\sigma 1}, \bar{S}_{\sigma 2}, \bar{z}_\omega$ → hash → $\nu$
> 7. **Round 5 messages**: $[W_\zeta]_1, [W_{\zeta\omega}]_1$ → hash → $u$

**Quy tắc vàng**: Fiat-Shamir hash phải bao gồm **tất cả public values** đã tạo ra cho đến thời điểm đó — bao gồm verification key, public inputs, VÀ tất cả messages đã gửi.

---

## Frozen Heart Vulnerability

> [!danger] Vulnerability 5.7 — Frozen Heart (Fiat-Shamir thiếu Public Inputs)
> **Nguồn gốc**: Paper PLONK không mô tả rõ transcript construction. Nhiều implementation **bỏ qua public inputs** khi hash để tạo challenges.
>
> **Hậu quả**: Prover có thể forge proof cho bất kỳ public inputs nào.
>
> **Ảnh hưởng thực tế (disclosed 2022)**:
> - Dusk Network's plonk
> - Iden3's SnarkJS
> - ConsenSys' gnark
>
> Xem: Trail of Bits Blog, April 2022.

**Phân tích cơ chế attack:**

Kịch bản: Circuit kiểm tra "balance > 0". Public input là balance. Prover muốn prove balance = 1000 dù thực ra chỉ có 0.

```text
Attack flow (Frozen Heart):

1. Tạo random polynomials a'(X), b'(X), c'(X) (không liên quan đến witness thật)
2. Commit: [a']₁, [b']₁, [c']₁
3. Hash transcript → β', γ' (KHÔNG có public inputs → có thể control!)
4. Tính z'(X) sao cho permutation check pass với challenges β', γ'
   (vì Prover chọn a', b', c' tùy ý, có thể tạo z' hợp lệ)
5. Chọn α để gate constraint pass tại evaluation point
6. Gửi proof...
7. Khi gửi, claim public input = 1000 (khác với gì Prover thực sự dùng)
8. Verifier verify: dùng claimed public inputs → pass
   (vì challenges không depend on public inputs)
```

> [!warning] Warning 5.8 — Dấu hiệu trong Code
> Tìm trong implementation:
> ```text
> # BAD: hash chỉ từ commitments
> beta = hash(commitment_a, commitment_b, commitment_c)
>
> # GOOD: hash từ vk + public inputs + commitments
> beta = hash(vk, public_inputs, commitment_a, commitment_b, commitment_c)
> ```
> Nếu thấy pattern đầu → Frozen Heart.

---

## Algebraic Group Model và PLONK Security

> [!definition] Definition 5.9 — PLONK Security Statement (informal)
> Dưới giả thuyết $(n+5)$-DLOG trong AGM và Fiat-Shamir trong ROM, PLONK là:
> - **Knowledge sound**: với extractor time $O(\text{poly}(n))$
> - **Computational ZK**: với simulator time $O(n \log n)$
> - **Succinct**: proof size $|π| = O(1)$ group elements + $O(1)$ field elements

**Tại sao AGM cần thiết?** KZG binding trong standard model chỉ được chứng minh dưới $(d+1)$-DLOG assumption, nhưng đây là assumption về **specific algebraic structure**. AGM cho phép reduction gọn hơn bằng cách giả sử adversary luôn cung cấp linear representation khi tạo group element mới.

---

## Python: Minh họa Fiat-Shamir đúng vs sai

```python
import hashlib

def hash_to_field(data: bytes, p: int) -> int:
    """Hash bytes to field element mod p."""
    h = hashlib.sha256(data).digest()
    return int.from_bytes(h, 'big') % p

def encode_g1(commitment: int) -> bytes:
    """Encode group element (scalar demo) to bytes."""
    return commitment.to_bytes(32, 'big')

def encode_field(x: int) -> bytes:
    return x.to_bytes(32, 'big')

# --- BAD: Fiat-Shamir không có public inputs ---
def bad_compute_beta_gamma(comm_a, comm_b, comm_c, p):
    transcript = encode_g1(comm_a) + encode_g1(comm_b) + encode_g1(comm_c)
    beta = hash_to_field(b'beta' + transcript, p)
    gamma = hash_to_field(b'gamma' + transcript, p)
    return beta, gamma

# --- GOOD: Fiat-Shamir với verification key + public inputs ---
def good_compute_beta_gamma(vk_hash, public_inputs, comm_a, comm_b, comm_c, p):
    transcript = vk_hash
    for pi in public_inputs:
        transcript += encode_field(pi)
    transcript += encode_g1(comm_a) + encode_g1(comm_b) + encode_g1(comm_c)
    beta = hash_to_field(b'beta' + transcript, p)
    gamma = hash_to_field(b'gamma' + transcript, p)
    return beta, gamma

p = 2**255 - 19  # demo field

# Giả sử same commitments nhưng khác public inputs
vk_hash = b'\x00' * 32
comm_a, comm_b, comm_c = 123, 456, 789

# BAD: challenges không thay đổi khi đổi public inputs!
beta_bad1, _ = bad_compute_beta_gamma(comm_a, comm_b, comm_c, p)
beta_bad2, _ = bad_compute_beta_gamma(comm_a, comm_b, comm_c, p)
assert beta_bad1 == beta_bad2, "BAD: same challenges for ANY public inputs!"
print(f"BAD Fiat-Shamir: beta is identical regardless of public inputs: {beta_bad1 == beta_bad2}")

# GOOD: challenges thay đổi khi đổi public inputs
beta_good1, _ = good_compute_beta_gamma(vk_hash, [100], comm_a, comm_b, comm_c, p)
beta_good2, _ = good_compute_beta_gamma(vk_hash, [999], comm_a, comm_b, comm_c, p)
assert beta_good1 != beta_good2, "GOOD: different challenges for different public inputs"
print(f"GOOD Fiat-Shamir: betas differ for different PIs: {beta_good1 != beta_good2}")
print("Fiat-Shamir demo: OK")
```

---

## Checklist Audit Fiat-Shamir

Khi review PLONK implementation:

```text
□ VK (selector commitments, permutation commitments) có trong transcript không?
□ Public inputs có trong transcript trước khi tính β, γ không?
□ Mỗi round message được thêm vào transcript TRƯỚC khi hash challenge tiếp theo?
□ Domain separator (prefix "beta", "gamma", v.v.) có unique không?
□ Transcript encoding có canonical/deterministic không?
  → (ví dụ: "5" có thể encode thành 1 byte hay 32 bytes — nếu không nhất quán, có thể manipulate)
□ Hash function có đủ security (SHA-256, BLAKE2, Keccak-256)?
□ Verifier reconstruct transcript độc lập (không trust Prover về thứ tự)?
```

---

## Summary

- **Fiat-Shamir**: biến interactive → non-interactive bằng cách replace challenges với hash(transcript).
- **Transcript** phải gồm: VK + public inputs + tất cả round messages (theo đúng thứ tự).
- **Frozen Heart**: thiếu public inputs trong hash → Prover forge proof cho arbitrary public inputs.
- **Security**: PLONK là knowledge sound + computational ZK trong AGM + ROM.
- **Audit**: tìm chỗ hash challenge, kiểm tra xem có đủ input không.

---

## References

- Trail of Bits — *Coordinated Disclosure: Frozen Heart* (April 2022)
- Trail of Bits — *The Frozen Heart Vulnerability in PlonK* (Part 4, April 2022)
- Gabizon, Williamson, Ciobotaru — *PLONK* (ePrint 2019/953), Section 8
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 19 (Fiat-Shamir)
- 0xPARC — ZK Bug Tracker: Frozen Heart entries
