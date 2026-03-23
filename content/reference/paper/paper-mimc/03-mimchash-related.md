---
title: "03. MiMCHash and Related Designs"
type: scheme
tags: [mimc, hash-function, sponge, knudsen-nyberg, related-designs, lesson-03]
aliases: [MiMCHash, MiMCHash-256, MiMC Related Designs]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[02-mimc-block-cipher|02. MiMC Block Cipher]], sponge construction cơ bản, khái niệm PRF, hash function (collision resistance, preimage resistance)  
> 🔴 **Prerequisite references**: Menezes et al. — *HAC* [MVO96] (hash function definitions)  
> **Lesson type**: Scheme + Survey  
> **Covers**: §2.3 (MiMCHash), §3.1 (Knudsen-Nyberg cipher), §3.2 (Pohlig-Hellman), §3.3 (Naor-Reingold PRF), §3.4 (SWIFFT/SWIFFTX), §3.5 (SPRING)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $n$ | Kích thước permutation (bits) — lẻ | $n$ |
> | $r_\text{rate}$ | Rate (bits hấp thụ mỗi lần gọi permutation trong sponge) | $r$ (paper dùng $r$ cho cả rate lẫn số rounds — phân biệt theo context) |
> | $c$ | Capacity (bits) trong sponge | $c$ |
> | $s$ | Security level (bits) | $s$ |
> | $\ell$ | Độ dài output của hash (bits) | $\ell$, $t$ |
> | $\mathsf{MiMCP}$ | MiMC permutation (key $= 0$) | MiMCP |

---

## Motivation

Sau khi có permutation MiMCP (Lesson 02), câu hỏi tự nhiên là: làm sao xây dựng **hash function** từ nó? Paper chọn framework đã được chứng minh tốt nhất cho mục đích này — **sponge construction** — vì nó cho phép instantiate hash function từ bất kỳ permutation nào với security proof rõ ràng.

Đồng thời, để đặt MiMC vào context, paper khảo sát các thiết kế liên quan — từ cipher tổ tiên Knudsen-Nyberg đến các PRF và hash function arithmetic hiện đại.

---

## MiMCHash: Hash Function từ Sponge

### Sponge Construction

> [!info] 🟡 Sponge Construction [BDPA08]
> Bertoni, Daemen, Peeters, Van Assche (EUROCRYPT 2008) đề xuất **sponge construction** — framework xây dựng hash function từ một permutation $f$ bất kỳ trên $b = r_\text{rate} + c$ bits:
>
> - **Absorb phase**: Chia message (sau padding) thành các block $m_1, m_2, \ldots$, mỗi block $r_\text{rate}$ bits. XOR từng block vào phần rate của state rồi apply $f$.
> - **Squeeze phase**: Đọc $r_\text{rate}$ bits output từ phần rate, apply $f$ giữa các lần squeeze nếu cần nhiều output hơn.
> - **Security**: Collision resistance $\approx 2^{c/2}$, preimage resistance $\approx 2^{\min(r_\text{rate} + c,\, c)}$ bits.
>
> Throughput: $r_\text{rate}$ bits được hash mỗi lần gọi permutation.
>
> *(theo [BDPA08]: Bertoni, Daemen, Peeters, Van Assche — On the indifferentiability of the sponge construction, EUROCRYPT 2008)*

Với MiMC, ta instantiate sponge bằng $f = \mathsf{MiMCP}$ (permutation với key $= 0^n$).

### Scheme Definition

> [!note] Scheme 3.1 — MiMCHash-$\ell$
> **Type**: Cryptographic hash function (sponge mode)  
> **Setting**: Permutation $\mathsf{MiMCP}$ trên $\mathbb{F}_{2^n}$; desired security level $s$ bits; rate $r_\text{rate} = n - 2s$; capacity $c = 2s$; output length $\ell$ bits
>
> **$\mathsf{Hash}(m)$**:
> - Input: $m \in \{0,1\}^*$
> - Pad $m$ theo sponge specification để length là bội của $r_\text{rate}$
> - **Absorb**: Với mỗi block $m_i$ ($r_\text{rate}$ bits): XOR $m_i$ vào phần rate của state, apply $\mathsf{MiMCP}$
> - **Squeeze**: Đọc $\ell$ bits output từ phần rate (gọi thêm $\mathsf{MiMCP}$ nếu $\ell > r_\text{rate}$)
> - Output: digest $\in \{0,1\}^\ell$

### Instantiation Parameters

Paper đề xuất hai biến thể chính cho 256-bit security context:

> [!note] Instantiation 3.2 — MiMCHash-256 (full security)
> **Setting**: MiMC-n/n permutation với $n = 4t + 1$ và security level $s = 2t$; với $t = 64$ ta có:
>
> | Tham số | Giá trị |
> |---------|---------|
> | $n$ (permutation size) | $1025$ bits |
> | Rate $r_\text{rate}$ | $512$ bits |
> | Capacity $c$ | $513$ bits |
> | Collision security | $128$ bits ($\approx 2^{c/2} = 2^{256.5}$ — thực chất 128-bit) |
> | Preimage security | $256$ bits |
> | 2nd-preimage security | $256$ bits (độc lập với message length) |
> | minMULs (một block) | $\lceil 1025 / \log_2 3 \rceil = 647$ |
> | minMULs/bit | $647/512 \approx 1.26$ nhân per 512 bits input |
>
> So sánh: SHA-256 xử lý cùng 512-bit block với ~29000 AND gates (Boolean metric).

> [!note] Instantiation 3.3 — MiMCHash-256b (compact variant)
> **Setting**: MiMC-n/n với $n = 3t + 1$, $s = t + 1$; với $t = 128$:
>
> | Tham số | Giá trị |
> |---------|---------|
> | $n$ (permutation size) | $769$ bits |
> | Rate $r_\text{rate}$ | $512$ bits |
> | Capacity $c$ | $257$ bits |
> | Collision security | $128$ bits |
> | Preimage security | $128$ bits (tương tự SHAKE-256) |
> | minMULs (một block) | $\lceil 769 / \log_2 3 \rceil = 486$ |

**Tổng hợp số nhân (Table 2 của paper):**

| Hash | Coll. Resist. (bits) | minMULs | MULs/bit |
|------|---------------------|---------|----------|
| SWIFFTX | 112–256 | 16384 | 8.0 |
| **MiMCHash-256** | **128** | **1293** | **2.52** |
| **MiMCHash-256b** | **128** | **971** | **1.89** |

> [!tip] 💡 Agent note
> Con số 1293 trong bảng (thay vì 647) là vì paper tính tổng witness cho SNARK setting, trong đó mỗi round cần 2 constraints thay vì 1. Xem Lesson 07 để chi tiết.

### Correctness & Security

MiMCHash được hưởng trực tiếp security của sponge construction [BDPA08]: nếu $\mathsf{MiMCP}$ không phân biệt được với random permutation, thì MiMCHash đạt collision resistance $2^{c/2}$ và preimage resistance $2^{c}$ trong random permutation model.

Với MiMCHash-256: capacity $c = 513$, nên collision resistance $= 2^{256.5}$ (thực tế $\approx 2^{128}$ vì birthday bound). Preimage $= 2^{513}$ — vượt cả AES-256 keyspace.

> [!warning] Hash-specific security consideration
> Khi dùng MiMCHash, không cần tính inverse $x^s$ — mode sponge chỉ gọi permutation theo chiều thuận. Đây là lý do paper khuyến cáo dùng hash mode hơn là encryption mode trực tiếp. Chi tiết security analysis cho hash mode (inside-out approach) sẽ cover trong [[05-mimc-statistical-attacks|Lesson 05]].

---

## Related Designs — Khảo sát (§3.1–3.5)

Phần này đặt MiMC vào bối cảnh lịch sử và so sánh với các thiết kế arithmetic hiện có.

### 3.1 Knudsen-Nyberg Cipher (KN95)

> [!info] 🟡 Knudsen-Nyberg Cipher [KN95]
> Knudsen và Nyberg (1995) đề xuất một 64-bit Feistel cipher chứng minh bảo mật chống differential attack. Round function:
>
> $$
> (x_L, x_R) \;\to\; (x_R,\; x_L \oplus f(e(x_R) \oplus k_i))
> $$
>
> trong đó $e : \mathbb{F}_{2^{32}} \to \mathbb{F}_{2^{37}}$ là affine map (mở rộng 32 → 37 bits), sau đó apply $g : x \mapsto x^3$ trong $\mathbb{F}_{2^{37}}$, rồi truncate 5 bits xuống còn 32 bits. Cipher có 6 rounds, 6 independent round keys 37-bit.
>
> **Chứng minh an toàn**: chống differential attack (vì $x^3$ là APN trong $\mathbb{F}_{2^{37}}$).  
> **Điểm yếu**: dễ bị interpolation attack [JK97] vì degree của polynomial encryption function quá thấp với 6 rounds.
>
> *(theo [KN95]: Knudsen, Nyberg — Provable security against a differential attack, J. Cryptology 1995)*

**Kết nối với MiMC**:

MiMC-2n/n là simplified variant của KN cipher với ba thay đổi quan trọng:

| Thuộc tính | KN Cipher | MiMC-2n/n |
|-----------|-----------|-----------|
| Non-linear function | $x^3$ trong $\mathbb{F}_{2^{37}}$ + truncation | $x^3$ trong $\mathbb{F}_{2^n}$ — không truncate |
| Số rounds | 6 | $2\lceil n/\log_2 3 \rceil \approx 160+$ |
| Round keys | 6 independent keys | Cùng key $k$ + round constants $c_i$ |
| Bảo mật | Chỉ chống differential; fail interpolation | Chống cả interpolation, GCD, differential, linear |

MiMC cũng gần hơn với **PURE** — cipher do Jakobsen và Knudsen đề xuất trong [JK97] để minh họa interpolation attack. PURE dùng $F(x) = x^3$ không truncate, chính xác như MiMC. Điểm khác biệt duy nhất: MiMC dùng nhiều rounds hơn (~10× so với PURE).

### 3.2 Pohlig-Hellman Cipher

Cipher đơn giản: $\mathsf{Enc}_k(m) = m^k \bmod p$ với $p$ nguyên tố và $\gcd(k, p-1) = 1$. Bảo mật từ DLP trong $\mathbb{F}_p$. Vấn đề: với $n$-bit security, số multiplications cần thiết tăng nhanh hơn $O(n)$ — không competitive cho ứng dụng SNARK.

### 3.3 Naor-Reingold PRF

PRF với bảo mật từ DDH:

$$
f_{p,q,g,\mathbf{a}}(x_1, \ldots, x_n) = g^{a_0 \prod_{x_i=1} a_i} \in \mathbb{F}_p^*
$$

Mỗi evaluation cần một exponentiation trong $\mathbb{F}_p$ — equivalent với $\Theta(p)$ multiplications. Không competitive với MiMC.

### 3.4 SWIFFT và SWIFFTX

SWIFFT là hash family dựa trên hardness của SIS problem trong lattices. Dùng NTT (Number Theoretic Transform) trên $\mathbb{Z}_{257}$ với dimension 64 — cần 192 multiplications mỗi 64-bit block. SWIFFTX (SHA-3 submission) chạy 4 instances SWIFFT + S-box, cần ~16384 multiplications tổng. Cao hơn MiMCHash ~10×.

### 3.5 SPRING

PRF dựa trên LWE, dùng NTT trên $\mathbb{Z}_{257}$ dimension 128. Cần $448 + 128 = 576$ multiplications cho 128-bit input. Competitive nhưng security từ lattice assumption — không native trên $\mathbb{F}_{2^n}$ hay $\mathbb{F}_p$ lớn như SNARKs yêu cầu.

---

## Tại sao MiMC là "first of its kind"

> [!tip] 💡 Agent note
> Paper nhấn mạnh rằng MiMCHash là **hash function trên $\mathbb{F}_p$ đầu tiên** phù hợp cho SNARK. Trước MiMC, các ứng dụng như Zerocash buộc phải implement SHA-256 trong circuit ZK — dù SHA-256 hoạt động trên $\mathbb{F}_2$ và không native với SNARK field $\mathbb{F}_p$. MiMC giải quyết mismatch này bằng cách thiết kế natively trên trường mà SNARK dùng.

---

## Summary

- **MiMCHash** instantiate sponge construction [BDPA08] bằng permutation MiMCP. Rate = $n - 2s$ bits/call.
- **MiMCHash-256**: $n = 1025$, rate = $512$, capacity = $513$ → collision 128-bit, preimage 256-bit, 2nd-preimage 256-bit (độc lập message length).
- **MiMCHash-256b**: $n = 769$, rate = $512$, capacity = $257$ → collision + preimage 128-bit. Compact hơn, tương tự SHAKE-256.
- Tổ tiên trực tiếp của MiMC là **KN cipher** [KN95] — dùng $x^3$ nhưng truncate và chỉ có 6 rounds. MiMC loại bỏ truncation và tăng rounds.
- Các cipher arithmetic khác (Pohlig-Hellman, NR PRF, SWIFFTX, SPRING) đều kém competitive hơn MiMC về MULs/bit trong SNARK setting.

---

## References

- [BDPA08] Bertoni, Daemen, Peeters, Van Assche — *On the indifferentiability of the sponge construction*, EUROCRYPT 2008 (🟡 Integrated)
- [KN95] Knudsen, Nyberg — *Provable security against a differential attack*, J. Cryptology 1995 (🟡 Integrated)
- [JK97] Jakobsen, Knudsen — *The interpolation attack on block ciphers*, FSE 1997 (🟡 — chi tiết trong [[04-mimc-algebraic-attacks|Lesson 04]])
- [PH78] Pohlig, Hellman — *An improved algorithm...*, IEEE Trans. IT 1978 (⚪)
- [NR97] Naor, Reingold — *Number-theoretic constructions of efficient PRFs*, FOCS 1997 (⚪)
- [LMPR08] Lyubashevsky et al. — *SWIFFT*, FSE 2008 (⚪)
- [BBL+15] Banerjee et al. — *SPRING*, FSE 2014 (⚪)
- [BCG+14] Ben-Sasson et al. — *Zerocash*, IEEE S&P 2014 (⚪)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite)
