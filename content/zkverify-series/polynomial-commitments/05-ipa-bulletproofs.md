---
title: "05. IPA & Bulletproofs-style"
tags: [crypto, zk, polynomial-commitments, lesson-05]
aliases: [IPA and Bulletproofs]
created: 2026-03-12
---

> **Prerequisites**: [[02-commitment-scheme-fundamentals|02. Commitment Scheme Fundamentals]], Pedersen vector commitments, inner products
> **Objectives**:
> - Hiểu Inner Product Argument (IPA) là gì và tại sao nó là polynomial commitment
> - Follow được IPA protocol từng bước: recursive halving
> - Hiểu proof size $O(\log d)$ đến từ đâu
> - So sánh IPA với KZG — trade-offs cụ thể

---

## Motivation

KZG cần trusted setup và pairing-friendly curves. Có thể xây polynomial commitment không cần trusted setup không?

Câu trả lời: **có**, dùng Inner Product Argument. Trade-off là proof size tăng từ $O(1)$ lên $O(\log d)$, và verifier cần $O(d)$ thay vì $O(1)$.

IPA được dùng trong Halo2 (Zcash, Scroll), Plonky2, và là cốt lõi của Bulletproofs — một range proof scheme không cần trusted setup.

---

## Inner Product và Polynomial Evaluation

**Kết nối then chốt**: Evaluate đa thức tại điểm $z$ chính là **inner product**:

$$f(z) = \sum_{i=0}^{d} a_i z^i = \langle \mathbf{a},\; \mathbf{b}(z) \rangle$$

trong đó $\mathbf{a} = (a_0, a_1, \ldots, a_d)$ là coefficients, $\mathbf{b}(z) = (1, z, z^2, \ldots, z^d)$ là powers of $z$.

Vậy: **Polynomial evaluation = Inner product** của coefficient vector với powers vector.

> [!definition] Definition 5.1 — Inner Product Argument (IPA)
> Cho hai generators public $\mathbf{G} = (G_0, \ldots, G_{d-1})$ và $\mathbf{H} = (H_0, \ldots, H_{d-1})$ trong $\mathbb{G}$, plus blinding generator $U$.
>
> Prover muốn convince verifier rằng vector Pedersen commitment:
> $$C = \langle \mathbf{a}, \mathbf{G} \rangle + \langle \mathbf{b}, \mathbf{H} \rangle + r \cdot U$$
> encode hai vectors $\mathbf{a}, \mathbf{b}$ có inner product $v = \langle \mathbf{a}, \mathbf{b} \rangle$, mà không tiết lộ $\mathbf{a}$ hay $\mathbf{b}$.

---

## IPA Protocol — Recursive Halving

Ý tưởng cốt lõi: thay vì gửi $d$ scalar, **reduce** bài toán về một bài toán kích thước $d/2$, lặp lại $\log d$ lần.

### Một vòng halving

Cho $\mathbf{a}, \mathbf{b}$ kích thước $n = 2m$. Tách:

$$\mathbf{a} = (\mathbf{a}_L, \mathbf{a}_R), \quad \mathbf{b} = (\mathbf{b}_L, \mathbf{b}_R)$$

**Prover gửi**:

$$L = \langle \mathbf{a}_L, \mathbf{G}_R \rangle + \langle \mathbf{b}_R, \mathbf{H}_L \rangle + r_L \cdot U$$

$$R = \langle \mathbf{a}_R, \mathbf{G}_L \rangle + \langle \mathbf{b}_L, \mathbf{H}_R \rangle + r_R \cdot U$$

**Verifier gửi** challenge $x \xleftarrow{\$} \mathbb{F}_p$.

**Cả hai tính** (generators folded):

$$\mathbf{G}' = \mathbf{G}_L + x^{-1} \mathbf{G}_R, \quad \mathbf{H}' = x \mathbf{H}_L + \mathbf{H}_R$$

$$C' = x^{-1} L + C + x R$$

**Prover tính** (vectors folded):

$$\mathbf{a}' = x \mathbf{a}_L + \mathbf{a}_R, \quad \mathbf{b}' = x^{-1} \mathbf{b}_L + \mathbf{b}_R$$

> [!theorem] Theorem 5.2 — Folding Correctness
> Sau một vòng, $C'$ là commitment của $(\mathbf{a}', \mathbf{b}')$ có inner product $v$ không đổi:
>
> $$\langle \mathbf{a}', \mathbf{b}' \rangle = \langle x\mathbf{a}_L + \mathbf{a}_R,\; x^{-1}\mathbf{b}_L + \mathbf{b}_R \rangle = \langle \mathbf{a}_L, \mathbf{b}_L \rangle + \langle \mathbf{a}_R, \mathbf{b}_R \rangle + x \langle \mathbf{a}_L, \mathbf{b}_R \rangle + x^{-1} \langle \mathbf{a}_R, \mathbf{b}_L \rangle$$

Sau $\log_2 d$ vòng, $\mathbf{a}'$ và $\mathbf{b}'$ giảm xuống kích thước 1 — prover chỉ gửi hai scalars.

### Cấu trúc proof IPA

```
Round 1: L_1, R_1  (2 group elements)
Round 2: L_2, R_2  (2 group elements)
...
Round log(d): L_k, R_k  (2 group elements)
Final: a', b'  (2 scalars)
```

Tổng: $2\log d$ group elements + 2 scalars = **$O(\log d)$ proof size**.

---

## IPA như Polynomial Commitment

Để dùng IPA làm polynomial commitment cho $f(X) = \sum a_i X^i$:

1. **Commit**: $\text{com}_f = \sum_i a_i G_i$ (Pedersen vector commit to coefficients)
2. **Prove $f(z) = y$**: Đặt $\mathbf{b} = (1, z, z^2, \ldots, z^{d-1})$. Prove $\langle \mathbf{a}, \mathbf{b} \rangle = y$.
3. Vì $\mathbf{b}$ là public (verifier tự tính được), chỉ cần IPA trên $(\mathbf{a}, \mathbf{b})$.

---

## Soundness của IPA

> [!theorem] Theorem 5.3 — Special Soundness của IPA
> IPA có special soundness: từ $2k$ transcripts với cùng commitment nhưng challenges khác nhau ở các round, có thể extract $\mathbf{a}$ và $\mathbf{b}$.

Basis của security: **Discrete Logarithm hardness** — không có quan hệ DL đã biết giữa các generators $G_0, \ldots, G_{d-1}$.

Cụ thể: nếu prover có thể tạo proof với hai challenges $x$ và $x'$ khác nhau (ở bất kỳ round nào), extractor recover được $\mathbf{a}_L, \mathbf{a}_R$ tại round đó, rồi recurse.

---

## Verifier Cost — $O(d)$ thay vì $O(1)$

Một điểm yếu của IPA: verifier phải tính $C' = x^{-1}L + C + xR$ và fold generators $\mathbf{G}', \mathbf{H}'$ — mỗi vòng $O(d/2)$ phép tính, tổng $O(d)$.

Optimization: **Verifier can batch**: thay vì fold từng bước, verifier có thể tính trực tiếp:

$$G'_i = \prod_{j} x_j^{\pm 1} G_j$$

trong một pass $O(d \log d)$ dùng bit decomposition của $i$. Điều này vẫn là $O(d)$ nhưng constant nhỏ hơn.

---

## So sánh IPA vs KZG

| Tính chất | KZG | IPA |
|-----------|-----|-----|
| Trusted setup | ✅ Cần | ❌ Không |
| Proof size | $1$ group element | $2\log d$ group elements |
| Verifier time | $O(1)$ (2 pairings) | $O(d)$ scalar mults |
| Prover time | $O(d)$ MSM | $O(d)$ scalar mults |
| Assumptions | t-SDH + Pairing | Discrete Log |
| Post-quantum | ❌ | ❌ |
| Homomorphic | ✅ | ✅ |

**Khi nào dùng IPA?**
- Môi trường không muốn trusted setup (trust-minimized systems)
- Curves không có pairing (không cần BLS12-381 hay BN254 đắt tiền)
- Halo2 architecture: IPA + accumulation scheme để amortize verifier cost

---

## Security Bugs trong IPA

> [!danger] Bug 5.4 — Weak Fiat-Shamir trong IPA
> Khi transform IPA interactive → non-interactive với Fiat-Shamir, **mọi** public input phải được hash vào challenge.
>
> Nếu thiếu bất kỳ yếu tố nào (ví dụ thiếu hash $C$ vào challenge $x$), adversary có thể chọn $C$ sau khi biết $x$ — phá soundness hoàn toàn.
>
> Lỗi cụ thể này được gọi là **"Frozen Heart"** vulnerability (Trail of Bits, 2022).

> [!danger] Bug 5.5 — Generators không random
> Nếu discrete log giữa các generators $G_i$ bị biết (ví dụ $G_1 = k \cdot G_0$ với $k$ đã biết), adversary có thể forge commitments.
>
> Generators phải được chọn theo "nothing-up-my-sleeve" (hash-to-curve).

---

## Tóm tắt

- IPA là polynomial commitment không cần trusted setup, dựa trên DL hardness.
- Cốt lõi: **recursive halving** — reduce inner product của vector $d$ → $d/2$ → ... → $1$.
- Proof size $O(\log d)$, verifier cost $O(d)$ — trade-off so với KZG ($O(1)$ cả hai nhưng cần pairing + trusted setup).
- **Security bugs thường gặp**: Frozen Heart (thiếu transcript trong Fiat-Shamir), generators có quan hệ DL.

---

## References

- Bootle, Cerulli, Chaidos, Groth, Petit — *Efficient ZK Arguments in the DL Setting* (Eurocrypt 2016)
- Bünz, Bootle, Boneh, Poelstra, Wuille, Maxwell — *Bulletproofs* (S&P 2018)
- Trail of Bits — *The Frozen Heart Vulnerability in Bulletproofs* — https://blog.trailofbits.com/2022/04/15/the-frozen-heart-vulnerability-in-bulletproofs/
- ZKDocs — *IPA Polynomial Commitment* — https://www.zkdocs.com/docs/zkdocs/commitments/ipa-pcs/
