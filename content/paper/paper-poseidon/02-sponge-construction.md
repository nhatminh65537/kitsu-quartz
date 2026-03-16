---
title: "02. Sponge Construction & POSEIDONπ Sponge"
type: math-component
tags: [poseidon, sponge, hash-function, math-component, lesson-02]
aliases: [POSEIDON Sponge, Sponge Construction]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[01-zk-hash-motivation|01. ZK-Friendly Hash Functions]], hash function basics (preimage/collision resistance), permutation  
> 🔴 **Prerequisite references**: Bertoni et al. — *Sponge Functions* [BDPA08] (sponge security proof đầy đủ)  
> **Lesson type**: Math Component  
> **Covers**: §2.1 (The Sponge Construction, Sponge Security, Our POSEIDONπ Sponges, Algorithm 1, Figure 1)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $b$ | Tổng kích thước state: $b = r + c$ (bits) | $b$ |
> | $r$ | Rate (số bit absorb mỗi lần) | $r$ |
> | $c$ | Capacity (số bit bảo mật nội bộ) | $c$ |
> | $\pi$ | Permutation bên trong sponge | $f$ (ký hiệu gốc của [BDPA08]) |
> | $t$ | Width của $\mathsf{POSEIDON}^\pi$: số phần tử $\mathbb{F}_p$; $b = n \cdot t$ bits | $t$ |
> | $s$ | State vector: $s \in \mathbb{F}_p^t$ | $s$ |
> | $o$ | Số phần tử output (output length) | $o$ |
> | $M$ | Security level (bits): $M = c/2$ | $M$ |

---

## Motivation

Permutation $\mathsf{POSEIDON}^\pi$ là một hoán vị có hiệu năng cao trên $\mathbb{F}_p^t$, nhưng bản thân nó không phải là hash function — nó là hàm **có thể đảo ngược** (bijection). Để xây dựng hash function từ permutation, ta cần một **mode of operation** chuyển đổi bijection thành hàm một chiều.

**Sponge construction** là mode đó: được phát minh bởi Bertoni, Daemen, Peeters và Van Assche [BDPA08] — chính những tác giả của Keccak/SHA-3. Sponge cung cấp:

1. **Input length tùy ý** → output length tùy ý.
2. **Security proof chặt**: bảo mật chống collision và preimage attack theo capacity $c$.
3. **Đơn giản hóa thiết kế**: chỉ cần thiết kế permutation bảo mật; mode of operation đảm bảo phần còn lại.

---

## Sponge Construction Tổng Quát

State của sponge gồm $b$ bits, chia làm hai phần:

$$
s = \underbrace{s_r}_{r \text{ bits (rate)}} \| \underbrace{s_c}_{c \text{ bits (capacity)}}
$$

**Rate** $r$ xác định throughput: ta absorb $r$ bits message mỗi lần. **Capacity** $c$ là phần "bí mật" không bao giờ được output trực tiếp — nó tạo ra security.

### Absorb phase (nạp message)

Message $m$ được padding rồi chia thành các block $m_1, m_2, \ldots, m_k$ mỗi block $r$ bits:

$$
s \leftarrow \pi(s \oplus (m_i \| 0^c))
$$

Tức là XOR block message vào phần rate của state, rồi áp permutation $\pi$.

### Squeeze phase (lấy output)

Sau khi absorb xong:

$$
\text{output} \leftarrow s_r; \quad s \leftarrow \pi(s) \quad \text{(lặp lại nếu cần thêm output)}
$$

> [!info] 🟡 Sponge Security Theorem (từ [BDPA08])
> Nếu permutation $\pi$ là **random permutation** (không phân biệt được với hoán vị ngẫu nhiên), thì sponge construction với capacity $c$ đạt:
>
> - **Collision resistance**: $2^{c/2}$ operations.
> - **Preimage resistance**: $\min(2^{c/2},\ 2^{r \cdot o})$ operations (phụ thuộc output length $o$).
>
> Kết quả này theo từ phân tích indifferentiability trong random permutation model. Nói ngắn gọn: **capacity quyết định mức bảo mật**, rate quyết định throughput.
>
> *(theo [BDPA08]: Bertoni, Daemen, Peeters, Van Assche — On the Indifferentiability of the Sponge Construction, EUROCRYPT 2008)*

Do đó, để đạt $M$ bits bảo mật, cần $c \geq 2M$. Đây là lý do POSEIDON-128 dùng capacity 255 bits (≥ 256 bits = $2 \times 128$) trên các curve có $p \approx 2^{255}$.

---

## POSEIDONπ Sponge — Sponge Trên $\mathbb{F}_p$

Paper trình bày Sponge Construction cho binary field để theo chuẩn [BDPA08], nhưng POSEIDON thực chất vận hành trên **prime field** $\mathbb{F}_p$.

**Thích nghi prime-field**: Thay vì XOR trên bits, ta thực hiện **cộng trên $\mathbb{F}_p$**:

$$
s \leftarrow \mathsf{POSEIDON}^\pi(s + (m_i \| \mathbf{0}_c))
$$

trong đó $s \in \mathbb{F}_p^t$, message block $m_i \in \mathbb{F}_p^r$, và $\mathbf{0}_c \in \mathbb{F}_p^c$ là vector zero.

> [!note] Scheme 2.1 — POSEIDON Hash Function (Algorithm 1)
> **Type**: Hash Function (sponge mode)  
> **Setting**: Permutation $\mathsf{POSEIDON}^\pi : \mathbb{F}_p^t \to \mathbb{F}_p^t$; rate $r$, capacity $c = t - r$; security level $M$ với $c \geq 2M$ phần tử $\mathbb{F}_p$ (mỗi phần tử chứa $n \geq 1$ bits bảo mật).
>
> **$\mathsf{POSEIDON}(m_1, m_2, \ldots, m_k)$**
> - Input: $k$ phần tử $m_i \in \mathbb{F}_p$ (sau padding)
> - Step 1 (Khởi tạo): $s \leftarrow \mathbf{0}_t \in \mathbb{F}_p^t$ — zero state
> - Step 2 (Xác định capacity value): Tùy use case, set giá trị capacity ban đầu để domain separation (xem §2.3 và [[04-instantiations-parameters|Lesson 04]])
> - Step 3 (Absorb): Chia $m$ thành các chunk $c_1, c_2, \ldots$ mỗi chunk $r$ phần tử.  
>   Với mỗi chunk $c_i$: $s_{\text{rate}} \leftarrow s_{\text{rate}} + c_i$; áp dụng $s \leftarrow \mathsf{POSEIDON}^\pi(s)$
> - Step 4 (Squeeze): Output $o$ phần tử từ phần rate của $s$
> - Step 5 (Squeeze tiếp nếu cần): $s \leftarrow \mathsf{POSEIDON}^\pi(s)$; lấy thêm output
> - Output: $(s_1, \ldots, s_o) \in \mathbb{F}_p^o$

### Ví dụ minh họa (Figure 1 của paper)

Tính hash của $m = m_1 \| m_2 \| m_3 \| m_4$ (4 block, mỗi block $r$ phần tử):

```
State ban đầu: [0...0 | 0...0]   (rate | capacity)
                  r bits    c bits

Absorb m1:  [0^r + m1 | 0^c] → POSEIDON^π → s1
Absorb m2:  [s1_r + m2 | s1_c] → POSEIDON^π → s2
Absorb m3:  [s2_r + m3 | s2_c] → POSEIDON^π → s3
Absorb m4:  [s3_r + m4 | s3_c] → POSEIDON^π → s4

Squeeze:    output h1 = s4_r  (r phần tử đầu tiên)
            nếu cần h2: POSEIDON^π(s4) → s5; output h2 = s5_r
```

---

## Hai Chế Độ Dùng POSEIDON

Paper phân biệt rõ hai use case chính, ảnh hưởng đến cách chọn capacity:

### 1. Compression function (2-to-1 hash)

Dùng cho **Merkle tree**: hash hai nút con thành một nút cha.

- $t = r + 1$: rate $r$ là arity của cây, capacity = 1 phần tử $\mathbb{F}_p$
- Với $n \geq 2M$ (ví dụ curve BLS12-381 có $n = 255$ và $M = 128$ → $c = 1$ phần tử là đủ vì $255 \geq 256$ trên thực tế không đủ — cần $c \geq 2$ phần tử; paper dùng $c$ = phần tử đủ bits)

> [!tip] 💡 Agent note
> Ký hiệu trong paper đôi khi gây nhầm: "capacity $c$" có thể tính bằng *bits* hoặc bằng *số phần tử $\mathbb{F}_p$*. Để đạt $M = 128$ bits bảo mật với $n = 255$ bits/phần tử: $c \geq 2M = 256$ bits → cần $\lceil 256/255 \rceil = 2$ phần tử $\mathbb{F}_p$. Trên thực tế paper dùng $c = 1$ phần tử đủ $n$-bit, coi như $c \approx 2M$ bits là đủ vì $n = 255 \approx 256$.

### 2. Variable-length hash

Dùng cho **Pedersen-like hash** hoặc khi message có độ dài không cố định.

- Capacity value ban đầu mã hoá metadata (độ dài, use case) để domain separation.
- Output có thể nhiều hơn $r$ phần tử bằng cách squeeze thêm.

---

## Sponge Security Áp Dụng Cho POSEIDON

Từ định lý sponge của [BDPA08], bảo mật của POSEIDON được chia thành hai lớp:

> [!abstract] Claim 2.2 — POSEIDON Sponge Security
> Mọi tấn công vào POSEIDON hash function với complexity dưới $2^{c/2}$ đều **phải đến từ tấn công vào permutation $\mathsf{POSEIDON}^\pi$**.
>
> Nói cách khác: nếu $\mathsf{POSEIDON}^\pi$ không phân biệt được với random permutation, thì POSEIDON hash function đạt $M = c/2$ bits bảo mật.

**Hệ quả thiết kế**: Nhóm tác giả chỉ cần chứng minh **$\mathsf{POSEIDON}^\pi$ là pseudorandom permutation** (PRP) — phần còn lại được đảm bảo bởi sponge framework. Toàn bộ §5 của paper dành cho mục tiêu này.

> [!success] Phân tách trách nhiệm
> Sponge mode xử lý: input length tùy ý, domain separation, output length tùy ý.  
> Permutation $\mathsf{POSEIDON}^\pi$ xử lý: bảo mật cốt lõi chống tấn công thống kê và đại số.  
> Hai phần này **độc lập** — có thể phân tích riêng.

---

## Summary

- Sponge construction = absorb (XOR/add message vào rate, áp permutation) + squeeze (lấy output từ rate).
- Security theorem [BDPA08]: capacity $c$ → bảo mật $M = c/2$ bits nếu permutation là random.
- POSEIDON thích nghi sponge lên $\mathbb{F}_p$: XOR thay bằng cộng modular, domain separation qua capacity value.
- Mọi tấn công phức tạp < $2^{c/2}$ phải đi qua $\mathsf{POSEIDON}^\pi$ — thiết kế permutation là trọng tâm của §2.2–§5.
- Hai use case chính: **compression function** (Merkle tree, $t$ nhỏ) và **variable-length hash** ($t$ lớn hơn).

---

## References

- [BDPA08] Bertoni, Daemen, Peeters, Van Assche — *On the Indifferentiability of the Sponge Construction*, EUROCRYPT 2008 (🟡 Integrate — Sponge Security Theorem)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §2.1 (nguồn chính bài này)
