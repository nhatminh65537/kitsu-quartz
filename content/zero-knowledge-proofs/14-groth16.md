---
title: "14. Groth16 — Kiến trúc & Ý tưởng"
tags: [cryptography, zero-knowledge-proofs, zkp, groth16, snark, qap, lesson-14]
aliases: [Groth16]
created: 2026-03-13
---

> **Prerequisites**: [[10-qap|10. QAP]] — Lagrange interpolation, vanishing polynomial, polynomial divisibility; [[13-kzg-and-pairings|13. KZG & Pairings]] — bilinear pairing, SRS, commitment scheme
> **Objectives**:
> - Hiểu cấu trúc tổng quát của Groth16: QAP + pairing-based verification
> - Nắm được ý nghĩa của bộ proof $(A, B, C)$ — ba group elements
> - Hiểu verification equation và tại sao nó đủ để kiểm tra QAP satisfiability
> - Phân biệt circuit-specific setup của Groth16 và ý nghĩa của nó
> - Hiểu tại sao Groth16 là SNARK nhỏ nhất hiện có

---

## Motivation

Ta đã có đầy đủ công cụ:
- **QAP** (Bài 10): encode R1CS thành điều kiện đa thức $Z_H \mid (A(X) \cdot B(X) - C(X))$
- **KZG** (Bài 13): commit đến đa thức, open tại điểm bất kỳ với proof constant-size

Groth16 (Jens Groth, 2016) là SNARK kết hợp hai công cụ này một cách tối ưu. Kết quả: proof chỉ gồm **3 group elements** (~192 bytes với BN254) — nhỏ nhất trong tất cả SNARK thực tế hiện nay.

Groth16 được dùng rộng rãi trong Zcash, các zkRollup đời đầu, và nhiều blockchain ZKP khác.

---

## Ôn Lại: QAP và Mục Tiêu

Từ Bài 10, R1CS có $m$ constraints và witness $\mathbf{w} = (w_0, w_1, \ldots, w_n)$ tương đương với:

**Tồn tại đa thức** $A(X), B(X), C(X), H(X)$ sao cho:

$$A(X) \cdot B(X) - C(X) = H(X) \cdot Z_H(X)$$

trong đó:
- $A(X) = \sum_{i=0}^n w_i \cdot u_i(X)$, với $u_i$ là Lagrange polynomials từ cột A của R1CS
- $B(X) = \sum_{i=0}^n w_i \cdot v_i(X)$ tương tự từ cột B
- $C(X) = \sum_{i=0}^n w_i \cdot w_i(X)$ tương tự từ cột C
- $Z_H(X) = \prod_{j=1}^m (X - r_j)$ là vanishing polynomial
- $H(X) = (A(X) \cdot B(X) - C(X)) / Z_H(X)$

Mục tiêu: prover biết witness $\mathbf{w}$ thỏa mãn R1CS ⟺ đa thức $H(X)$ tồn tại.

---

## Cấu Trúc Groth16

### Phân Tách Public và Private Witness

> [!definition] Definition 14.1 — Phân tách witness trong Groth16
>
> Witness $\mathbf{w} = (w_0, w_1, \ldots, w_n)$ được chia:
> - $w_0 = 1$ (hằng số)
> - $w_1, \ldots, w_\ell$: **public inputs** (verifier biết)
> - $w_{\ell+1}, \ldots, w_n$: **private inputs** (chỉ prover biết)
>
> Đặt $\mathbf{w}_{\text{pub}} = (w_0, \ldots, w_\ell)$ và $\mathbf{w}_{\text{priv}} = (w_{\ell+1}, \ldots, w_n)$.
>
> Tương ứng, phân tách:
> $$A(X) = A_{\text{pub}}(X) + A_{\text{priv}}(X)$$
> với $A_{\text{pub}}(X) = \sum_{i=0}^\ell w_i u_i(X)$, $A_{\text{priv}}(X) = \sum_{i=\ell+1}^n w_i u_i(X)$

### Ý Tưởng Groth16 (High-Level)

Groth16 yêu cầu prover tạo ba commitments $[A]_1, [B]_2, [C]_1$ và verifier kiểm tra một **pairing equation** duy nhất:

$$e([A]_1, [B]_2) = e([\alpha]_1, [\beta]_2) \cdot e([\text{public}]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$$

Tại sao một phương trình duy nhất là đủ? Vì bilinearity của pairing "chứa" toàn bộ QAP divisibility check.

### Trusted Setup của Groth16

> [!definition] Definition 14.2 — Groth16 Proving Key và Verification Key
>
> **Setup** $(1^\lambda, \mathcal{C})$ — phụ thuộc vào circuit $\mathcal{C}$:
>
> Chọn $\tau, \alpha, \beta, \gamma, \delta \xleftarrow{\$} \mathbb{F}_p^*$ (toxic waste).
>
> **Proving key** $\mathsf{pk}$ (prover cần để tạo proof):
> - $[\tau^i]_1$ cho $i = 0, \ldots, d$ (powers of tau, $\mathbb{G}_1$)
> - $[\tau^i]_2$ cho $i = 0, \ldots, d$ ($\mathbb{G}_2$)
> - $[\alpha \cdot u_i(\tau)]_1, [\beta \cdot v_i(\tau)]_1$ cho từng wire $i$
> - $[\frac{\beta u_i(\tau) + \alpha v_i(\tau) + w_i(\tau)}{\delta}]_1$ cho private wires $i > \ell$
> - $[\frac{\tau^j \cdot Z_H(\tau)}{\delta}]_1$ cho $j = 0, \ldots, d-2$ (để tính $[H(\tau) Z_H(\tau)/\delta]_1$)
>
> **Verification key** $\mathsf{vk}$ (verifier cần):
> - $[\alpha]_1, [\beta]_2, [\gamma]_2, [\delta]_2, [\tau]_2$
> - $[\frac{\beta u_i(\tau) + \alpha v_i(\tau) + w_i(\tau)}{\gamma}]_1$ cho public wires $i \leq \ell$

Setup là **circuit-specific**: $\mathsf{pk}$ và $\mathsf{vk}$ phụ thuộc vào đa thức $u_i, v_i, w_i$ của circuit cụ thể.

### Groth16 Proving

> [!definition] Definition 14.3 — Groth16 Prover
>
> **Prove** $(\mathsf{pk}, \mathbf{w}_{\text{pub}}, \mathbf{w}_{\text{priv}}) \to \pi = ([A]_1, [B]_2, [C]_1)$:
>
> Chọn blinding factors $r, s \xleftarrow{\$} \mathbb{F}_p$ (để đạt ZK).
>
> $$[A]_1 = [\alpha]_1 + \sum_{i=0}^n w_i [u_i(\tau)]_1 + r[\delta]_1$$
>
> $$[B]_2 = [\beta]_2 + \sum_{i=0}^n w_i [v_i(\tau)]_2 + s[\delta]_2$$
>
> $$[C]_1 = \frac{1}{\delta}\left[\sum_{i=\ell+1}^n w_i(\beta u_i(\tau) + \alpha v_i(\tau) + w_i(\tau))\right]_1 + [H(\tau) Z_H(\tau)/\delta]_1 + s[A]_1 + r[B]_1 - rs[\delta]_1$$
>
> Proof: $\pi = ([A]_1, [B]_2, [C]_1)$ — **3 group elements**.

### Groth16 Verification

> [!definition] Definition 14.4 — Groth16 Verifier
>
> **Verify** $(\mathsf{vk}, \mathbf{w}_{\text{pub}}, \pi) \to \{0,1\}$:
>
> Tính accumulated public input:
>
> $$[\text{pub}]_1 = \sum_{i=0}^\ell w_i \left[\frac{\beta u_i(\tau) + \alpha v_i(\tau) + w_i(\tau)}{\gamma}\right]_1$$
>
> Kiểm tra pairing equation:
>
> $$e([A]_1, [B]_2) \stackrel{?}{=} e([\alpha]_1, [\beta]_2) \cdot e([\text{pub}]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$$

Verification: **3 pairing operations** + tính $[\text{pub}]_1$ (tuyến tính theo số public inputs).

---

## Tại Sao Verification Equation Đúng?

Để hiểu tại sao equation trên encode QAP satisfiability, xét version đơn giản không có blinding ($r = s = 0$) và không phân tách public/private:

$$A(\tau) = \alpha + \sum_i w_i u_i(\tau)$$
$$B(\tau) = \beta + \sum_i w_i v_i(\tau)$$
$$C(\tau) \cdot \delta = \sum_i w_i (\beta u_i(\tau) + \alpha v_i(\tau) + w_i(\tau)) + H(\tau) Z_H(\tau)$$

Nhân $A \cdot B$:

$$A(\tau) \cdot B(\tau) = \alpha\beta + \alpha \sum_i w_i v_i(\tau) + \beta \sum_i w_i u_i(\tau) + \sum_i \sum_j w_i w_j u_i(\tau) v_j(\tau)$$

Sau khi sắp xếp (dùng tính chất bilinearity và linearity):

$$A(\tau) \cdot B(\tau) = \alpha\beta + \sum_i w_i(\beta u_i(\tau) + \alpha v_i(\tau)) + \left(\sum_i w_i u_i(\tau)\right)\left(\sum_j w_j v_j(\tau)\right)$$

Mặt khác, QAP satisfiability: $\sum_i w_i u_i \cdot \sum_j w_j v_j - \sum_i w_i w_i = H \cdot Z_H$, tức là:

$$\sum_i w_i(\beta u_i + \alpha v_i + w_i) = A \cdot B - \alpha\beta - H \cdot Z_H$$

Đây chính là $C \cdot \delta$ trong phương trình trên. Pairing equation encode chính xác điều này trong $\mathbb{G}_T$.

> [!note] Remark — Blinding và ZK
>
> Các blinding factors $r, s$ được thêm vào để đạt Perfect ZK: transcript $(A, B, C)$ của honest prover có phân phối đều trong $\mathbb{G}_1 \times \mathbb{G}_2 \times \mathbb{G}_1$ (conditional on public inputs). Mọi proof đều "giống nhau" về mặt phân phối.

---

## Bảng Đặc Trưng Groth16

| Đặc trưng | Giá trị |
|-----------|---------|
| Proof size | 3 group elements (~192 bytes, BN254; ~288 bytes BLS12-381) |
| Verify time | 3 pairings (~constant) |
| Prover time | $O(n \log n)$ field ops + FFTs |
| Trusted setup | Circuit-specific (phải redo nếu circuit thay đổi) |
| ZK | Perfect ZK |
| Soundness | Computational (dưới $q$-SDH + $q$-PKE) |
| Quantum safety | Không (dựa trên elliptic curve DLP) |

### Ưu Điểm

- **Proof nhỏ nhất**: 3 elements — không SNARK thực tế nào nhỏ hơn.
- **Verify nhanh nhất**: constant number of pairings — $O(|\mathbf{w}_{\text{pub}}|)$ thực ra.
- **Phổ biến**: nhiều library, audit, battle-tested (Zcash, Hermez, Tornado Cash).

### Nhược Điểm

- **Trusted setup circuit-specific**: mỗi circuit cần ceremony riêng → không linh hoạt.
- **Prover time**: tuy $O(n \log n)$ nhưng hằng số lớn do FFT và multi-scalar multiplication.
- **Không universal**: thay đổi circuit → phải setup lại.
- **Không transparent**: cần tin tưởng rằng $\tau, \alpha, \beta, \gamma, \delta$ đã bị xóa.

---

## Groth16 trong Thực Tế: Zcash

Zcash (2016) là ứng dụng thực tế đầu tiên của Groth16 ở quy mô lớn. Mỗi "shielded transaction" là một Groth16 proof cho circuit chứng minh:

1. Prover biết private key và coin value hợp lệ
2. Merkle path từ coin commitment đến Merkle root công khai
3. Nullifier (để tránh double-spend) được tính đúng

Circuit: ~50,000 R1CS constraints. Proof: 288 bytes. Verify: < 5ms.

---

## So Sánh: Groth16 vs. PLONK

| | Groth16 | PLONK |
|--|---------|-------|
| Proof size | 3 elements | ~9–12 elements |
| Verify | 3 pairings | $O(1)$ pairings |
| Setup | Circuit-specific | Universal |
| Prover | Fast FFT | Slightly larger const. |
| Aggregation | Khó | Dễ hơn |

Groth16 nhỏ hơn nhưng kém linh hoạt hơn PLONK (Bài 15).

---

## Summary

- **Groth16** = QAP (Bài 10) + bilinear pairings (Bài 13) + circuit-specific trusted setup.
- **Proof**: 3 group elements $([A]_1, [B]_2, [C]_1)$ — nhỏ nhất trong thực tế.
- **Verify**: một pairing equation $e(A, B) = e(\alpha, \beta) \cdot e(\text{pub}, \gamma) \cdot e(C, \delta)$.
- **Security**: dưới $q$-SDH và $q$-PKE assumptions (knowledge soundness).
- **ZK**: Perfect ZK nhờ blinding factors $r, s$.
- **Hạn chế chính**: circuit-specific setup — mỗi circuit cần trusted ceremony riêng.
- Động lực cho PLONK (Bài 15): giữ proof ngắn nhưng dùng universal setup.

---

## References

- Groth, Jens — *On the Size of Pairing-Based Non-interactive Arguments* (2016) — EUROCRYPT 2016 (bài báo gốc Groth16)
- Bowe, Gabizon, Miers — *Scalable Multi-party Computation for zk-SNARK Parameters in the Random Beacon Model* (2017) — ePrint 2017/1050 (ceremony protocol)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 19 (toc.cryptobook.us)
- Thaler — *Proofs, Arguments, and Zero-Knowledge*, Ch. 16 (people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf)
- Vitalik Buterin — *Exploring Elliptic Curve Pairings* (2017) (vitalik.ca)
- Electric Coin Company — *Zcash Protocol Specification* (zips.z.cash/protocol/protocol.pdf)
