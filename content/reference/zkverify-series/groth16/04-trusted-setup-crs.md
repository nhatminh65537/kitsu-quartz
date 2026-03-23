---
title: "04. Trusted Setup & CRS"
tags: [crypto, groth16, zksnark, trusted-setup, crs, lesson-04]
aliases: [Trusted Setup CRS Groth16]
created: 2026-03-12
---

> **Prerequisites**: [[01-r1cs-groth16-bridge|01]], [[02-qap-groth16-bridge|02]], [[03-pairings-groth16|03]]  
> **Objectives**:  
> - Hiểu đầy đủ cấu trúc CRS: proving key và verifying key chứa gì
> - Phân biệt Phase 1 (Powers of Tau) và Phase 2 (circuit-specific)
> - Hiểu "toxic waste" là gì và tại sao nó phải bị hủy
> - Hiểu MPC ceremony và tại sao nó giảm trust assumption
> - Nắm được attack surface từ trusted setup — chuẩn bị cho Bài 12

---

## Trusted Setup là gì và tại sao cần?

Groth16 là **preprocessing SNARK** — có một bước setup đặc biệt trước khi prove/verify. Setup sinh ra CRS (Common Reference String) gồm:

- **Proving key** $\text{pk}$: prover dùng để tạo proof
- **Verifying key** $\text{vk}$: verifier dùng để kiểm tra proof

Setup cần **5 random field elements** (toxic waste): $\tau, \alpha, \beta, \gamma, \delta \in \mathbb{F}_p$

Sau khi setup xong, **những elements này PHẢI bị hủy hoàn toàn**. Nếu ai biết bất kỳ element nào, họ có thể forge proof tùy ý.

---

## Cấu trúc CRS đầy đủ

> [!definition] Definition 4.1 — Proving Key (pk)
> Với QAP có $n$ wires, $m$ constraints, $\ell$ public inputs, proving key gồm:
>
> **Phase 1 elements** (powers of tau):
> $$\{[\tau^i]_1\}_{i=0}^{n-1}, \quad \{[\tau^i]_2\}_{i=0}^{n-1}$$
>
> **QAP evaluations**:
> $$\{[A_i(\tau)]_1\}_{i=0}^{n-1}, \quad \{[B_i(\tau)]_1\}_{i=0}^{n-1}, \quad \{[B_i(\tau)]_2\}_{i=0}^{n-1}$$
>
> **"Shifted" private wire elements** ($i = \ell+1, \ldots, n-1$):
> $$\left\{\left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\delta}\right]_1\right\}$$
>
> **H-query** (để prover tính $[h(\tau)t(\tau)/\delta]_1$):
> $$\left\{\left[\frac{\tau^i t(\tau)}{\delta}\right]_1\right\}_{i=0}^{m-2}$$
>
> **Blinding factors**:
> $$[\alpha]_1, \quad [\beta]_2, \quad [\delta]_1, \quad [\delta]_2$$

> [!definition] Definition 4.2 — Verifying Key (vk)
> $$[\alpha]_1, \quad [\beta]_2, \quad [\gamma]_2, \quad [\delta]_2$$
>
> **IC (Input Commitments)** — public input elements:
> $$\left\{\left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\gamma}\right]_1\right\}_{i=0}^{\ell}$$
>
> Precomputed: $e([\alpha]_1, [\beta]_2) \in \mathbb{G}_T$ (để verify nhanh hơn)

---

## Phase 1: Powers of Tau Ceremony

### Vấn đề của single-party setup

Nếu một người duy nhất chạy setup và giữ $\tau, \alpha, \beta, \gamma, \delta$ — họ có thể forge proof. Trust assumption quá cao.

### Giải pháp: Multi-Party Computation (MPC)

> [!definition] Definition 4.3 — Powers of Tau MPC (Phase 1)
> **Protocol**: $N$ participants đóng góp lần lượt.
>
> Ban đầu: $\text{SRS}_0 = \{[1]_1, [1]_2\}$
>
> Participant $k$ nhận $\text{SRS}_{k-1}$, chọn random $s_k$, và update:
> $$[\tau^i]_1 \leftarrow s_k^i \cdot [\tau^i]_1$$
>
> Sau $N$ participants: $[\tau^i]_1$ chứa $\tau = s_1 \cdot s_2 \cdots s_N$ (product của tất cả secrets).
>
> **Security guarantee**: Setup an toàn nếu **ít nhất 1** trong $N$ participants hủy secret của họ.

Đây là "1-of-N trust" — rất khác với "single trusted party". Perpetual Powers of Tau (của Ethereum cộng đồng) đã có hàng nghìn participants.

### Zcash Sapling Ceremony (2018)

Đây là ceremony Phase 2 nổi tiếng nhất cho Zcash Sapling circuit (Groth16). 6 participants thực hiện ceremony tại 6 địa điểm khác nhau trên thế giới, với các biện pháp bảo mật vật lý. Ceremony transcript được public để mọi người verify.

---

## Phase 2: Circuit-Specific Setup

Phase 1 (Powers of Tau) là **universal** — có thể dùng lại cho nhiều circuits có $m \leq$ max_constraints. Phase 2 là **circuit-specific** — phải làm lại cho mỗi circuit.

```
Phase 1: $\{[\tau^i]_1, [\tau^i]_2\}$ → Universal SRS

Phase 2: SRS + Circuit R1CS/QAP
        ↓
        Compute $[A_i(\tau)]_1, [B_i(\tau)]_2, \ldots$ (circuit-specific)
        ↓
        Proving Key + Verifying Key
```

Phase 2 cũng là MPC nhưng circuit-specific. Sau Phase 2, $\tau$ (và $\alpha, \beta, \gamma, \delta$) phải được hủy.

**Ví dụ thực tế với snarkjs**:

```bash
# Phase 1: Download Powers of Tau (community-generated)
snarkjs powersoftau new bn128 12 pot12_0000.ptau
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau

# Phase 2: Circuit-specific setup
snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor"
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json
```

---

## Vai trò của 5 Toxic Waste Elements

Tại sao cần đúng 5 elements $\tau, \alpha, \beta, \gamma, \delta$? Mỗi element có vai trò riêng:

| Element | Vai trò | Nếu lộ ra |
|---------|--------|-----------|
| $\tau$ | Evaluation point — "ẩn" polynomials vào group | Biết $\tau$ → tính được quotient giả → forge proof không hợp lệ |
| $\alpha, \beta$ | Force A, B, C dùng cùng witness vector | Biết $\alpha, \beta$ → có thể tạo $[A]_1, [B]_2, [C]_1$ không liên quan đến nhau mà vẫn pass |
| $\gamma$ | Tách biệt public input khỏi private witness | Biết $\gamma$ → có thể manipulate public input verification |
| $\delta$ | Tách biệt private witness và blinding | Biết $\delta$ → có thể loại bỏ randomness $r, s$ → break ZK |

> [!danger] Nếu $\gamma = \delta$
> Đây là một bug nghiêm trọng xảy ra trong thực tế (Bài 12). Nếu $\gamma = \delta$, verifier equation không còn tách biệt public/private correctly, cho phép forge proof. Đây là lỗi đã được khai thác trong production năm 2025.

---

## Verify Ceremony Transcript

Ai cũng có thể verify rằng ceremony đã được thực hiện đúng:

```bash
# Verify toàn bộ ceremony transcript
snarkjs powersoftau verify pot12_final.ptau

# Verify zkey (phase 2)
snarkjs zkey verify circuit.r1cs pot12_final.ptau circuit_final.zkey
```

Điều quan trọng: **transparency** của ceremony cho phép cộng đồng verify mà không cần trust anyone.

---

## So sánh: Groth16 Setup vs Universal SNARKs

| Property | Groth16 | PLONK | STARKs |
|----------|---------|-------|--------|
| Setup type | Circuit-specific | Universal | Transparent (không cần) |
| Trust assumption | 1-of-N | 1-of-N | None |
| CRS size | $O(m)$ | $O(m)$ | N/A |
| Cần redo khi thay circuit? | **Có** | Không | N/A |
| Proof size | **128 bytes (BN254)** | ~500 bytes | ~100-200 KB |
| Verification time | **Fast (2 pairings)** | Slower | Slower |

Trade-off của Groth16: phải redo setup khi circuit thay đổi, nhưng đổi lại có proof nhỏ và verify nhanh nhất.

---

## Summary

- CRS = proving key + verifying key, được sinh từ 5 toxic waste elements $\tau, \alpha, \beta, \gamma, \delta$
- **Phase 1** (Powers of Tau): universal, MPC với N participants, 1-of-N trust
- **Phase 2**: circuit-specific, cần redo mỗi khi thay circuit
- Mỗi toxic waste element có vai trò bảo mật riêng — lộ bất kỳ element nào đều nguy hiểm
- $\gamma = \delta$ là bug nghiêm trọng đã xảy ra trong thực tế
- Ceremony có thể được verify công khai bởi bất kỳ ai

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260), Section 3
- Bowe, Gabizon, Miers — *Scalable Multi-party Computation for zk-SNARK Parameters in the Random Beacon Model* (ePrint 2017/1050)
- Alin Tomescu — *Groth16* (alinush.github.io/groth16) — Phase 1 & 2 walkthrough
- ZKSecurity — *The First ZK Exploits: Groth16 Setup Exploit* (blog.zksecurity.xyz)
- snarkjs documentation — https://github.com/iden3/snarkjs
