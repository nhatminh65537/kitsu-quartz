---
title: "01. Hash Functions — Nền tảng & Baseline"
tags: [cryptography, zk-hash, hash-functions, lesson-01]
aliases: [Hash Functions Overview]
created: 2026-03-13
---

> **Prerequisites**: Số học modular cơ bản, khái niệm XOR và bitwise operations  
> **Objectives**:  
> - Nắm vững ba tính chất bảo mật cốt lõi của hash function và phân biệt chúng chính xác
> - Hiểu cơ chế hoạt động của Merkle-Damgård và Sponge Construction ở mức internals
> - Phân tích SHA-256 và Keccak-256 đủ sâu để thấy tại sao chúng không phù hợp với ZK
> - Định lượng được "chi phí" của bitwise operations trong arithmetic circuits

---

## Motivation

Hàm băm mật mã (cryptographic hash function) là nền tảng của gần như mọi hệ thống mật mã hiện đại: chữ ký số, Merkle tree, commitment scheme, proof-of-work, và — quan trọng nhất với chúng ta — zero-knowledge proofs.

Tuy nhiên, khi bước vào thế giới ZK, ta gặp một nghịch lý: các hash function được tin dùng nhất như SHA-256 hay Keccak lại là những thứ tệ nhất để dùng trong ZK circuits. SHA-256 khi chạy trong zk-STARK chậm hơn **50–100 lần** so với các ZK-friendly alternatives. Hiểu *tại sao* điều này xảy ra chính là điểm xuất phát để nắm được toàn bộ chủ đề ZK-friendly hash functions.

Bài này xây dựng "baseline": những gì bạn đã biết về hash functions truyền thống, nhìn qua lăng kính ZK.

---

## Định nghĩa & Ba Tính Chất Bảo Mật

> [!definition] Definition 1.1 — Cryptographic Hash Function
> Một **hàm băm mật mã (cryptographic hash function)** là hàm $H: \{0,1\}^* \to \{0,1\}^n$ ánh xạ input có độ dài tùy ý thành output có độ dài cố định $n$ bits (gọi là **digest** hoặc **hash value**), thỏa mãn ba tính chất bảo mật sau.

> [!definition] Definition 1.2 — Preimage Resistance (One-Wayness)
> $H$ đạt **preimage resistance** nếu với mọi $y$ cho trước, không có thuật toán đa thức thời gian nào tìm được $x$ sao cho $H(x) = y$ với xác suất không negligible.
>
> Nói ngắn gọn: biết hash, không thể tìm ngược lại input.

> [!definition] Definition 1.3 — Second Preimage Resistance
> $H$ đạt **second preimage resistance** nếu với input $x$ cho trước, không thể tìm $x' \neq x$ sao cho $H(x') = H(x)$.
>
> Phân biệt với preimage resistance: ở đây input gốc $x$ đã biết.

> [!definition] Definition 1.4 — Collision Resistance
> $H$ đạt **collision resistance** nếu không thể tìm được cặp $(x, x')$ với $x \neq x'$ sao cho $H(x) = H(x')$.
>
> Đây là tính chất mạnh nhất: kẻ tấn công được tự do chọn cả hai input.

> [!theorem] Theorem 1.5 — Quan hệ giữa ba tính chất
> Collision resistance $\Rightarrow$ second preimage resistance, nhưng ngược lại không nhất thiết đúng. Preimage resistance không kéo theo collision resistance và ngược lại.

**Hệ quả quan trọng cho ZK**: Trong nhiều ZK protocol, hash function được dùng làm **commitment scheme** — người dùng cam kết với một giá trị bằng cách publish hash của nó. Khi đó, collision resistance là tính chất cốt tử: nếu attacker tìm được collision, họ có thể commit một giá trị nhưng sau đó "mở" bằng một giá trị khác.

---

## Merkle-Damgård Construction

Phần lớn các hash function thế hệ cũ (MD5, SHA-1, SHA-256) được xây dựng theo khung **Merkle-Damgård (MD)**.

> [!definition] Definition 1.6 — Merkle-Damgård Construction
> Cho một **compression function** $f: \{0,1\}^{n+b} \to \{0,1\}^n$ (ánh xạ state $n$ bits + block $b$ bits thành state $n$ bits mới), Merkle-Damgård xây dựng hash function xử lý input tùy ý như sau:
>
> 1. **Padding**: Thêm padding vào input $M$ để độ dài là bội số của $b$. Chuẩn MD padding thêm bit `1`, sau đó các bit `0`, và encode độ dài $|M|$ vào 64 bits cuối.
> 2. **Chia block**: $M_{\text{padded}} = m_1 \| m_2 \| \cdots \| m_k$, mỗi $m_i$ có $b$ bits.
> 3. **Lặp**: Bắt đầu từ giá trị khởi tạo $h_0 = \text{IV}$ (initialization vector), tính $h_i = f(h_{i-1}, m_i)$ cho $i = 1, \ldots, k$.
> 4. **Output**: $H(M) = h_k$.

```
IV ──► [f] ──► [f] ──► [f] ──► ... ──► [f] ──► hash
        ▲       ▲       ▲               ▲
        m₁      m₂      m₃              mₖ
```

**Tính chất của MD**: Nếu compression function $f$ là collision-resistant, thì $H$ cũng collision-resistant. Đây là **MD strengthening theorem**.

**Nhược điểm quan trọng — Length Extension Attack**: Nếu biết $H(M)$ và $|M|$, có thể tính $H(M \| \text{padding} \| M')$ mà không cần biết $M$. SHA-256 bị ảnh hưởng bởi attack này. SHA-3 (Keccak) không bị vì dùng sponge construction.

---

## Sponge Construction

SHA-3/Keccak và nhiều ZK hash functions dùng **sponge construction** — mô hình linh hoạt hơn MD.

> [!definition] Definition 1.7 — Sponge Construction
> Cho một **permutation** $f: \{0,1\}^b \to \{0,1\}^b$ trên state $b$ bits, trong đó state được chia thành **rate** $r$ bits (phần "tiếp xúc" với input/output) và **capacity** $c$ bits (phần "ẩn"), với $b = r + c$.
>
> Sponge hoạt động qua hai phase:
>
> **Absorb phase**: Với mỗi block $m_i$ (sau khi pad):
> $$\text{state} \leftarrow f(\text{state} \oplus (m_i \| 0^c))$$
>
> **Squeeze phase**: Output từng chunk $r$ bits của state, áp dụng $f$ giữa các chunk cho đến khi đủ output.

```
       Absorb Phase              Squeeze Phase
       ────────────              ─────────────
  m₁   m₂   m₃                  z₁   z₂
  ▼    ▼    ▼                   ▲    ▲
 ─┬─  ─┬─  ─┬─                 ─┴─  ─┴─
  │r   │r   │r   ◄─ rate ─►    │r   │r
  ├────┤    ├────┤              ├────┤
  │c   │    │c   ◄─capacity─►  │c   │
 ─┴─  ─┴─  ─┴─                 ─┴─  ─┴─
  [f]  [f]  [f]                 [f]  [f]
```

**Tại sao Sponge tốt hơn MD cho ZK?** Sponge không có length extension vulnerability, và permutation $f$ có thể được thiết kế algebraically-friendly — đây chính là hướng mà Poseidon và Rescue đi theo.

**Security của Sponge**: An toàn đến $\min(2^{c/2}, 2^n)$ operations, trong đó $c$ là capacity. Để đạt 128-bit security, cần $c \geq 256$ bits.

---

## SHA-256 Internals — Tại sao không ZK-friendly

SHA-256 xử lý input theo các block 512 bits, dùng state 256 bits (8 từ 32-bit).

### Round Function của SHA-256

Mỗi round của SHA-256 thực hiện các phép tính sau trên 8 từ 32-bit $a, b, c, d, e, f, g, h$:

$$T_1 = h + \Sigma_1(e) + \text{Ch}(e,f,g) + K_t + W_t$$
$$T_2 = \Sigma_0(a) + \text{Maj}(a,b,c)$$

Trong đó:
- $\Sigma_1(e) = \text{ROTR}^6(e) \oplus \text{ROTR}^{11}(e) \oplus \text{ROTR}^{25}(e)$ — rotation và XOR
- $\text{Ch}(e,f,g) = (e \wedge f) \oplus (\neg e \wedge g)$ — bitwise AND, NOT, XOR
- $\text{Maj}(a,b,c) = (a \wedge b) \oplus (a \wedge c) \oplus (b \wedge c)$ — bitwise AND, XOR

### Tại sao đây là thảm họa với ZK circuits

> [!danger] Problem 1.8 — Bitwise Operations trong Arithmetic Circuits
> Các ZK proof systems (R1CS, PLONK, ...) hoạt động trên **arithmetic circuits** — các phép tính cộng và nhân trên trường hữu hạn $\mathbb{F}_p$. Các phép tính bit như XOR, AND, ROTR **không phải native operations** trong $\mathbb{F}_p$, dẫn đến chi phí rất cao:
>
> | Operation | Số constraints trong R1CS |
> |-----------|--------------------------|
> | Cộng trường: $a + b$ | 0 (free, linear) |
> | Nhân trường: $a \cdot b$ | 1 |
> | XOR 32-bit | ~64 (mỗi bit cần ~2 constraints) |
> | AND 32-bit | ~32 |
> | ROTR 32-bit | ~64–96 (cần decompose thành bits) |
>
> SHA-256 có 64 rounds, mỗi round dùng nhiều operations bitwise. Tổng số constraints ước tính: **~25,000–30,000 constraints** cho một lần hash SHA-256 trong R1CS.

```python
# Minh họa: XOR trong arithmetic circuit cần range check
# Để enforce a XOR b = c trong Fp, ta phải:
# 1. Decompose a, b thành bits: a = sum(a_i * 2^i)
# 2. Enforce each a_i in {0, 1}: a_i * (1 - a_i) = 0
# 3. Compute c_i = a_i + b_i - 2 * a_i * b_i (XOR formula)
# 4. Recompose c = sum(c_i * 2^i)

# Mỗi bước decompose 32-bit số cần 32 range constraints
# => 1 XOR 32-bit = 32 + 32 + 32 + 0 = ~96+ constraints
```

---

## Keccak-256 Internals — Cũng không ZK-friendly

Keccak (SHA-3) dùng sponge construction với permutation Keccak-f[1600] trên state 1600 bits ($5 \times 5 \times 64$ bit).

### Năm phép biến đổi trong mỗi round của Keccak-f

| Bước | Ký hiệu | Mô tả |
|------|---------|-------|
| Theta ($\theta$) | $C[x] = A[x,0] \oplus \cdots \oplus A[x,4]$ | XOR từng column |
| Rho ($\rho$) | Rotate mỗi lane theo constant offset | Bitwise rotation |
| Pi ($\pi$) | Permute vị trí các lane | Index permutation |
| Chi ($\chi$) | $A'[x] = A[x] \oplus (\neg A[x+1]) \wedge A[x+2]$ | **Nonlinear**: AND + NOT |
| Iota ($\iota$) | XOR với round constant | XOR |

**Vấn đề**: Bước Chi ($\chi$) là nguồn nonlinearity duy nhất trong Keccak, nhưng nó dùng AND và NOT — bitwise operations. Tương tự SHA-256, mỗi bit phải được "expand" thành constraint riêng.

> [!warning] Warning 1.9 — Chi phí thực của SHA-256 và Keccak trong ZK
> - **SHA-256 trong R1CS (Circom)**: ~28,000 constraints per hash
> - **Keccak-256 trong R1CS**: ~150,000 constraints per hash
> - **Poseidon trong R1CS**: ~240 constraints per hash (t=3)
> - **MiMC trong R1CS**: ~642 constraints per hash
>
> Chênh lệch 100x–600x giải thích tại sao ZK-friendly hashes quan trọng đến vậy.

---

## SHA-256 vs Keccak: So sánh dưới góc nhìn ZK

| | SHA-256 | Keccak-256 |
|--|---------|------------|
| Construction | Merkle-Damgård | Sponge |
| Nonlinearity | Bitwise AND, XOR, ROTR | Chi: AND + NOT |
| State size | 256 bits | 1600 bits |
| R1CS constraints | ~28,000 | ~150,000 |
| Length extension | Bị ảnh hưởng | Không |
| ZK-friendly | ❌ Rất tệ | ❌ Tệ nhất |
| Dùng trong ZK khi nào | Ethereum state (bắt buộc) | EVM opcodes (bắt buộc) |

> [!note] Note 1.10 — Khi nào vẫn phải dùng SHA-256/Keccak trong ZK?
> Có một trường hợp **buộc** phải dùng non-ZK-friendly hashes: khi circuit cần verify tính đúng đắn của dữ liệu **on-chain** mà Ethereum đã hash bằng Keccak (ví dụ: verify Merkle proof của Ethereum state trie). Trong trường hợp này, chi phí là bắt buộc, và người ta dùng các kỹ thuật như recursive proof hoặc lookup arguments để giảm thiểu.

---

## Kết luận: Điều gì làm hash function trở nên "thân thiện" với ZK?

Qua phân tích SHA-256 và Keccak, ta thấy kẻ thù của ZK efficiency là:

1. **Bitwise operations** (XOR, AND, NOT, rotation) — cần decompose thành individual bits
2. **Non-algebraic structure** — không phải đa thức bậc thấp trên $\mathbb{F}_p$
3. **Nhiều rounds** — mỗi round nhân multiplicative complexity

Hash function ZK-friendly cần:
- Hoạt động **native** trên trường hữu hạn $\mathbb{F}_p$ (cộng và nhân trực tiếp)
- Nonlinearity đến từ **power maps** ($x^\alpha$) thay vì bitwise ops
- Ít rounds hơn nhưng vẫn an toàn về mặt algebraic

Bài tiếp theo (Lesson 02) sẽ xây dựng mô hình chính xác của arithmetic circuits và giải thích cách đo "chi phí" của một hàm trong ZK.

---

## Summary / Key Takeaways

- Hash function cần ba tính chất: **preimage resistance**, **second preimage resistance**, **collision resistance**. Collision resistance là mạnh nhất và quan trọng nhất trong ZK.
- **Merkle-Damgård** (SHA-256): lặp compression function. Có length extension vulnerability.
- **Sponge** (Keccak): linh hoạt hơn, không có length extension bug, cơ sở tốt hơn cho ZK-friendly designs.
- SHA-256 cần ~28,000 R1CS constraints, Keccak cần ~150,000 — vì bitwise ops phải được decompose.
- ZK-friendly hashes thay thế bitwise ops bằng **power maps trên finite field** — sẽ phân tích chi tiết từ Lesson 04 trở đi.

---

## References

- FIPS 180-4: Secure Hash Standard (SHA-2) — csrc.nist.gov
- Bertoni et al. — *Keccak reference* (keccak.team)
- Zellic Research — *ZK-Friendly Hash Functions* (zellic.io/blog, 2023)
- RareSkills — *ZK Friendly Hash Functions* (rareskills.io)
- Grassi et al. — *POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems*, USENIX Security 2021
