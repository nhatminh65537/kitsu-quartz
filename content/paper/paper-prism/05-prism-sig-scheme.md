---
title: "05. PRISM-sig: The Signature Scheme"
type: scheme
tags: [prism, isogeny, signature-scheme, hash-and-sign, post-quantum, lesson-05]
aliases: [PRISM-sig, PRISM signature, isogeny hash-and-sign]
source: "PRISM: Simple And Compact Identification and Signatures From Large Prime Degree Isogenies — Basso et al., PKC 2025"
created: 2026-03-16
---

> **Prerequisites**: PRISM-id protocol (xem [[04-prism-id-protocol|04. PRISM-id Protocol]]), hash-and-sign paradigm, EUF-CMA (xem [[02-ideal-to-isogeny-defs|02. IdealToIsogeny & Defs]])  
> 🔴 **Prerequisite references**: Leroux — *DeuringVUF* [Leroux25] (first hash-and-sign isogeny signature); Abdalla et al. — [Abdalla+02]  
> **Lesson type**: Scheme  
> **Covers**: §4.1 (hash-and-sign paradigm cho isogenies), §4.2 (PRISM-sig definition, Figure 5, $H_{\mathsf{prime}}$, signature sizes), §4 correctness
>
> **Notation** (ký hiệu mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $H_{\mathsf{prime}}$ | Hash function hashing vào $\mathsf{Primes}_a$ | $H_{\mathsf{prime}}$ |
> | $H_{a-2}$ | Cryptographic hash function $\{0,1\}^* \to [0, 2^{a-2})$ | $H_{a-2}$ |
> | $\mathsf{counter}$ | Counter dùng trong $H_{\mathsf{prime}}$ để hit prime | $\mathsf{counter}$ |
> | $\sigma_{\mathsf{sig}}$ | Isogeny response trong signature (bậc $q(2^a - q)$) | $\sigma$ |
> | $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ | Compact representation của $\sigma_{\mathsf{sig}}$ | — |
> | $m$ | Message được ký | $\mathsf{msg}$ |

---

## Motivation: Từ Protocol đến Signature

Lesson trước xây dựng PRISM-id — giao thức identification 2 vòng đơn giản và hiệu quả. Bước tiếp theo là **biến identification protocol thành signature scheme**.

Có hai cách tiếp cận phổ biến:

| Cách | Tên | Security model | Dùng trong |
|------|-----|----------------|-----------|
| $\mathsf{chall} = H(\mathsf{com} \| m)$ với $H$ là random oracle | Fiat-Shamir | ROM | Schnorr, SQIsign (một số biến thể) |
| $\mathsf{chall} = H(E_{vk} \| m)$ với $H$ collision-resistant | Hash-and-sign | Standard model | **PRISM-sig** |

PRISM-sig dùng **hash-and-sign**: challenge $q$ được xác định deterministically từ hash của public key và message. Không có commitment trong PRISM-id, nên không cần hash cả commitment — chỉ cần hash $(E_{vk}, m)$.

Đây là lần đầu tiên trong isogeny-based cryptography đạt được signature EUF-CMA trong **standard model** (không cần ROM) với hiệu quả thực tế.

> [!info] 🟡 Hash-and-Sign Isogeny — DeuringVUF (từ [Leroux25])
> Leroux [Leroux25] đề xuất **DeuringVUF** — bước tiên phong dùng hash-and-sign cho isogeny signatures, dựa trên hardness của tính isogeny bậc nguyên tố lớn. PRISM-sig distill và simplify construction này, đạt hiệu quả thực tế tốt hơn đáng kể.
>
> Điểm khác biệt chính: DeuringVUF dùng **fixed degree** (bậc cố định), còn PRISM dùng **variable challenge prime** $q = H_{\mathsf{prime}}(E_{vk} \| m)$. Điều này làm signing đơn giản hơn và không cần precomputation.
>
> *(theo [Leroux25]: Leroux — Verifiable random function from the Deuring correspondence and higher dimensional isogenies, EUROCRYPT 2025)*

---

## Hash Function $H_{\mathsf{prime}}$: Hashing vào $\mathsf{Primes}_a$

Để dùng hash-and-sign, ta cần hash function $H_{\mathsf{prime}} : \{0,1\}^* \to \mathsf{Primes}_a$. Xây dựng như sau:

> [!note] Construction 5.1 — $H_{\mathsf{prime}}$
> **Cho**: hash function collision-resistant $H_{a-2} : \{0,1\}^* \to [0, 2^{a-2})$
>
> **Định nghĩa** $H_{\mathsf{prime}}(E_{vk} \| m)$:
> 1. Đặt $\mathsf{counter} = 0$
> 2. Lặp:
>    - Tính $h = H_{a-2}(E_{vk} \| m \| \mathsf{counter})$
>    - Tính $q = 2^{a-1} + 2h + 1$ (tức là thêm bit 1 ở đầu và cuối của $h$)
>    - Nếu $q \in \mathsf{Primes}_a$ (là số nguyên tố $a$-bit lẻ): trả về $q$
>    - Tăng $\mathsf{counter}$
> 3. Output $q$

> [!tip] 💡 Agent note
> Tại sao phép biến đổi $q = 2^{a-1} + 2h + 1$? Hai lý do:
>
> 1. **Prepend bit 1**: đảm bảo $q \geq 2^{a-1}$ — $q$ có đúng $a$ bit
> 2. **Append bit 1 (odd)**: đảm bảo $q$ lẻ — điều kiện cần để $q$ là số nguyên tố (trừ $q = 2$)
>
> Bằng Prime Number Theorem, mật độ primes trong $[2^{a-1}, 2^a)$ là $\approx 1/a$, nên kỳ vọng số lần lặp là $O(a) = O(\lambda)$ — nhanh trong thực tế.
>
> Paper cũng nêu (Remark 4): cách thay thế là hash ra $2a$-bit odd integer rồi tăng dần đến prime — nhưng cách này tạo **bias** về phía primes sau gap dài, nên không dùng.

---

## PRISM-sig: Định Nghĩa Đầy Đủ

### Mathematical Setting

> [!note] Setting 5.2 — PRISM-sig Mathematical Setting
> - **Trường**: $\mathbb{F}_{p^2}$ với $p \equiv 3 \pmod{4}$, $\log_2 p = 2\lambda$
> - **Tham số**: $a$ bit-length của challenge prime; $2^a \approx p^{1/2}$; $E(\mathbb{F}_{p^2})$ có $\mathbb{F}_{p^2}$-rational $2^a$-torsion
> - **Starting curve**: $(E_0, \mathcal{O}_0)$ với endomorphism ring biết công khai
> - **Hash function**: $H_{\mathsf{prime}} : \{0,1\}^* \to \mathsf{Primes}_a$ (collision-resistant)
> - **Representation**: compact representation qua Montgomery curve + 2 torsion points

### Scheme Definition

> [!note] Scheme 5.3 — PRISM-sig (Figure 5)
> **Type**: Post-quantum Digital Signature Scheme  
> **Security**: EUF-CMA trong standard model, dưới SPEDIO hardness + collision-resistance của $H_{\mathsf{prime}}$
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Input: security parameter $\lambda$
> - Chọn ngẫu nhiên isogeny $\phi_{\mathsf{sk}} : E_0 \to E_{vk}$ (random walk)
> - Tính $\mathcal{O}_{vk} = \text{End}(E_{vk})$ via Deuring Correspondence
> - Output: $\mathsf{sk} = \mathcal{O}_{vk}$, $\mathsf{pk} = E_{vk}$
>
> **$\mathsf{Sign}(\mathsf{sk}, m)$**
> - Input: $\mathsf{sk} = \text{End}(E_{vk})$, message $m \in \{0,1\}^*$
> - Tính $q = H_{\mathsf{prime}}(E_{vk} \| m)$ — challenge prime deterministic
> - Tính isogeny $\sigma_{\mathsf{sig}} : E_{vk} \to E_{\mathsf{sig}}$ bậc $q(2^a - q)$, dùng $\text{End}(E_{vk})$:
>   - Factorize bậc: $q(2^a - q) = q \cdot (2^a - q)$
>   - Dùng Kani embedding: nhúng vào $(2^a, 2^a)$-isogeny trên abelian surface
>   - Chạy higher-dimensional isogeny computation (từ SQIsign2D-West [6])
> - Output signature $\sigma = (E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$
>
> **$\mathsf{Verify}(\mathsf{pk}, m, \sigma)$**
> - Input: $\mathsf{pk} = E_{vk}$, message $m$, $\sigma = (E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$
> - Tính $q = H_{\mathsf{prime}}(E_{vk} \| m)$
> - Kiểm tra $(P_{\mathsf{sig}}, Q_{\mathsf{sig}}) \in E_{\mathsf{sig}}[2^a]$ interpolate isogeny bậc $q(2^a - q)$ từ $E_{vk}$ về $E_{\mathsf{sig}}$
> - Output: $1$ (accept) nếu valid, $0$ (reject) nếu không

### Chi Tiết Signing: Kani Embedding

Signing là bước quan trọng nhất — đây là lúc dùng $\text{End}(E_{vk})$ như trapdoor:

> [!note] Algorithm 5.4 — Signing via Kani Embedding
> **Input**: $\text{End}(E_{vk})$, challenge prime $q$
>
> **Bước 1 — Factorize**: viết bậc mục tiêu là $q(2^a - q)$
>
> **Bước 2 — Kani setup**: cần $d_1 = q$ và $d_2 = 2^a - q$ với $d_1 + d_2 = 2^a$ (smooth)
>
> **Bước 3 — Ideal computation**: dùng Deuring Correspondence, tìm ideal $I \subset \text{End}(E_{vk})$ với $\text{nrd}(I) = q(2^a - q)$
>
> **Bước 4 — IdealToIsogeny**: chạy IdealToIsogeny$(I, E_{vk})$ từ SQIsign2D-West [6]
>   - Internally uses Kani's Lemma để build $(2,2)$-isogeny bậc $2^a$ trên $E_{vk} \times E'$
>   - Projects xuống 1 chiều để lấy $\sigma_{\mathsf{sig}} : E_{vk} \to E_{\mathsf{sig}}$
>
> **Bước 5 — Compact representation**: extract $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ từ kernel của phần $2^a$-smooth

---

## Correctness

> [!abstract] Theorem 5.5 — Correctness của PRISM-sig
> Với mọi $(\mathsf{sk}, \mathsf{pk})$ sinh bởi $\mathsf{KeyGen}$ và mọi $m \in \{0,1\}^*$:
>
> $$
> \mathsf{Verify}\!\bigl(\mathsf{pk},\, m,\, \mathsf{Sign}(\mathsf{sk}, m)\bigr) = 1
> $$

**Proof**: $q = H_{\mathsf{prime}}(E_{vk} \| m)$ là xác định (deterministic). $\mathsf{Sign}$ tính $\sigma_{\mathsf{sig}} : E_{vk} \to E_{\mathsf{sig}}$ bậc $q(2^a - q)$ bằng IdealToIsogeny — đúng theo Deuring Correspondence và Kani's Lemma. $\mathsf{Verify}$ tính lại cùng $q$ từ cùng $(E_{vk}, m)$, rồi kiểm tra compact representation của isogeny — valid by construction. $\blacksquare$

---

## Kích Thước Key và Signature

> [!note] Kích thước ở NIST Level I ($\lambda = 128$, $\log_2 p = 256$, $a \approx 128$)
>
> **Public key** ($E_{vk}$):
> - $j$-invariant hoặc Montgomery coefficient: $2 \log p = 256$ bits = **32 bytes**
>
> **Signature** $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$:
> - $E_{\mathsf{sig}}$: recover từ $P_{\mathsf{sig}}$ (Montgomery) → 0 extra bytes
> - $P_{\mathsf{sig}}$: tọa độ $x \in \mathbb{F}_{p^2}$ → $2 \log p = 256$ bits
> - $Q_{\mathsf{sig}}$: tọa độ $x + 1$ sign bit → $2 \log p + 1 \approx 257$ bits
> - **Tổng signature**: $\approx 8\lambda$ bits = **~65 bytes** (không counting $q$ vì derive từ hash)
>
> **Combined pk + sig**: **~97 bytes** ở Level I — tương đương SQIsign variants

> [!tip] 💡 Agent note
> Số $q = H_{\mathsf{prime}}(E_{vk} \| m)$ **không cần truyền trong signature** vì verifier tự tính lại từ $E_{vk}$ và $m$. Đây là ưu điểm của hash-and-sign: toàn bộ signature chỉ là compact isogeny representation $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$.

---

## Hiệu Quả: So Sánh với SQIsign

| Metric | PRISM-sig | SQIsign2D-West | SQIsign |
|--------|-----------|----------------|---------|
| **Signing time** | 1× (baseline) | ~1.8× chậm hơn | ~10× chậm hơn |
| **Verification time** | 1× (baseline) | ~0.7× nhanh hơn | ~5× nhanh hơn |
| **pk size** | ~32 bytes | ~64 bytes | ~64 bytes |
| **sig size** | ~97 bytes | ~148 bytes | ~177 bytes |
| **Security model** | Standard | Heuristic | Heuristic |
| **Signing simplicity** | Rất đơn giản | Phức tạp | Rất phức tạp |

> [!warning] Trade-off Signing vs Verification
> PRISM-sig signing nhanh hơn SQIsign2D-West ~1.8× vì không có commitment phase.  
> Nhưng verification chậm hơn ~1.4× vì verifier cần check isogeny bậc $q(2^a - q)$ — lớn hơn bậc smooth trong SQIsign.  
> Đây là trade-off có chủ đích: trong nhiều ứng dụng (TLS, code signing), signing thực hiện ít hơn verification, nên tối ưu signing quan trọng hơn.

---

## Tại sao Security trong Standard Model?

> [!info] 🟡 Hash-and-Sign → Standard Model Security (từ [Abdalla+02])
> Theo framework [Abdalla+02]: nếu identification protocol có **special soundness** và **HVZK** thì hash-and-sign với collision-resistant hash function cho EUF-CMA trong **standard model**.
>
> PRISM-sig thỏa điều kiện này vì PRISM-id có:
> - Special soundness với soundness error $1/|\mathsf{Primes}_a|$ (negligible)
> - HVZK với SPEDIO oracle (computational HVZK)
>
> **Khác biệt với Fiat-Shamir**: Fiat-Shamir transform cho security trong ROM; hash-and-sign (với collision-resistance thay vì random oracle) cho security trong standard model — mạnh hơn.
>
> *(theo [Abdalla+02], applied to PRISM identification protocol)*

**Ý nghĩa thực tế**: PRISM-sig không cần tin tưởng hash function là "truly random" — chỉ cần collision-resistance, là property tiêu chuẩn của SHA-3, BLAKE3, v.v.

---

## Summary

- **PRISM-sig = PRISM-id + hash-and-sign**: $q = H_{\mathsf{prime}}(E_{vk} \| m)$ deterministic, không có commitment.
- **$H_{\mathsf{prime}}$**: hash vào $\mathsf{Primes}_a$ qua retry với counter — $O(a)$ iterations expected.
- **KeyGen/Sign/Verify** đơn giản: Sign chỉ cần tính isogeny bậc $q(2^a-q)$ từ $E_{vk}$ dùng $\text{End}(E_{vk})$.
- **Correctness**: tự nhiên từ determinism của $H_{\mathsf{prime}}$ + correctness của IdealToIsogeny.
- **Signature size**: $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}}) \approx 8\lambda$ bits — tương đương SQIsign variants.
- **Standard model security**: hash-and-sign + special soundness + HVZK → EUF-CMA không cần ROM.
- **Trade-off**: signing 1.8× nhanh hơn SQIsign2D-West; verification 1.4× chậm hơn.

---

## References

- [Leroux25] Leroux — *Verifiable Random Function from the Deuring Correspondence and Higher Dimensional Isogenies*, EUROCRYPT 2025 (🟡 first hash-and-sign isogeny signature paradigm)
- [Abdalla+02] Abdalla, An, Bellare, Namprempre — *From identification to signatures via the Fiat-Shamir transform*, EUROCRYPT 2002 (🟡 standard model security framework)
- [6] / [Basso+24] Basso et al. — *SQIsign2D-West*, ASIACRYPT 2024 (🟡 IdealToIsogeny used in signing)
- [DKL+20] De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020 (🔴 Prerequisite)
