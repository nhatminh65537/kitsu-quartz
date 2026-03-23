---
title: "05. Jive Compression Mode"
type: scheme
tags: [anemoi, jive, compression, merkle-tree, scheme, lesson-05]
aliases: [Jive, Jive Compression, AnemoiJive]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Anemoi permutation (xem [[04-anemoi-permutation|04. The Anemoi Permutation]]), sponge construction (xem [[02-sponge-construction|02. Sponge Construction]]), CICO problem (xem [[01-ao-hash-functions-and-cico|01. AO Hash Functions & CICO]])
> 🔴 **Prerequisite references**: Merkle tree construction (ví dụ: Merkle — *A Digital Signature Based on a Conventional Encryption Function*, CRYPTO 1987)
> **Lesson type**: Scheme
> **Covers**: §6.1 (Jive mode definition), §6.3 (AnemoiJive-BLS12-381 và BN-254 instantiations)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $P : \mathbb{F}_q^{2\ell} \to \mathbb{F}_q^{2\ell}$ | Anemoi permutation với state width $2\ell$ |
> | $b$ | Số branches (input blocks) của Jive: $b \geq 2$ |
> | $m$ | Kích thước mỗi branch: $m$ phần tử $\mathbb{F}_q$ |
> | $\mathsf{Jive}_b$ | Jive compression function với $b$ branches: $\mathbb{F}_q^{b \cdot m} \to \mathbb{F}_q^m$ |
> | $\mathbf{x}_1, \ldots, \mathbf{x}_b$ | Input branches, mỗi $\mathbf{x}_i \in \mathbb{F}_q^m$ |
> | $P(\mathbf{x}_1 \| \cdots \| \mathbf{x}_b)$ | Áp dụng permutation $P$ lên concatenation của $b$ branches |

---

## Motivation

AnemoiSponge là hàm hash thông dụng nhưng không được tối ưu cho một ứng dụng cụ thể và rất phổ biến trong ZK systems: **Merkle tree hashing**.

Trong một Merkle tree nhị phân, mỗi internal node được tính từ hai child nodes:

$$
\text{node} = \mathsf{compress}(\text{left\_child}, \text{right\_child})
$$

Đây là một bài toán **2-to-1 compression**: nhận $2m$ phần tử $\mathbb{F}_q$, output $m$ phần tử. Mọi ZK Merkle proof đều cần chứng minh nhiều lần invocation của compression function này — nên cost arithmetization của nó là bottleneck trực tiếp của proof size và prover time.

Paper [Bou+22/23, §6.1] đề xuất **Jive** — một mode hoạt động mới lấy cảm hứng từ "Latin dance" ciphers (Salsa20, ChaCha20) — để tối ưu hóa chính xác use case này.

---

## 1. Ý tưởng Jive — Latin Dance Inspiration

"Latin dance" ciphers như Salsa20/ChaCha20 có một kỹ thuật đặc trưng: **combine input với output của permutation**:

$$
\text{output} = \text{input} + P(\text{input})
$$

Kỹ thuật này (gọi là **Davies-Meyer variant** hoặc **feed-forward**) cho phép xây dựng one-way compression function từ một permutation mà không cần capacity riêng — khác với sponge vốn cần capacity như một "entropy buffer" ẩn.

Jive áp dụng chính xác kỹ thuật này, mở rộng cho $b$ branches:

$$
\mathsf{Jive}_b(\mathbf{x}_1, \ldots, \mathbf{x}_b) = \sum_{i=1}^{b} \mathbf{x}_i^{(\text{in})} + \sum_{i=1}^{b} \mathbf{x}_i^{(\text{out})}
$$

Trong đó $(\mathbf{x}_1^{(\text{out})}, \ldots, \mathbf{x}_b^{(\text{out})}) = P(\mathbf{x}_1^{(\text{in})}, \ldots, \mathbf{x}_b^{(\text{in})})$.

---

## 2. Jive Compression Function — Definition

> [!note] Scheme 2.1 — $\mathsf{Jive}_b$ Compression Function
> **Type**: Compression function ($b$-to-1)
> **Setting**: Permutation $P : \mathbb{F}_q^{b \cdot m} \to \mathbb{F}_q^{b \cdot m}$; kích thước branch $m$; số branches $b \geq 2$
> **Input**: $b$ branches $(\mathbf{x}_1, \ldots, \mathbf{x}_b)$, mỗi $\mathbf{x}_i \in \mathbb{F}_q^m$
> **Output**: $\mathbf{z} \in \mathbb{F}_q^m$ (một block duy nhất, $b$-to-1 compression)
>
> **$\mathsf{Jive}_b(\mathbf{x}_1, \ldots, \mathbf{x}_b)$:**
>
> *Bước 1 — Áp dụng permutation:*
> $$(\mathbf{u}_1, \ldots, \mathbf{u}_b) \leftarrow P(\mathbf{x}_1, \ldots, \mathbf{x}_b)$$
>
> *Bước 2 — Feed-forward (cộng input và output):*
> $$\mathbf{z} \leftarrow \sum_{i=1}^{b} (\mathbf{x}_i + \mathbf{u}_i)$$
>
> **Output**: $\mathbf{z} \in \mathbb{F}_q^m$

Hình minh họa cho $b = 2$ (trường hợp phổ biến nhất):

```
x₁ ──┬──→ [ P ] ──→ u₁ ──┐
     │                    ├──→ (x₁ + u₁) + (x₂ + u₂) = z
x₂ ──┴──→ [   ] ──→ u₂ ──┘
```

Với $b$ branches tổng quát:

```
x₁, x₂, ..., xb ──→ [ P ] ──→ u₁, u₂, ..., ub
         ↓                              ↓
   feed-forward: z = Σᵢ (xᵢ + uᵢ)
```

---

## 3. Correctness — Tại sao Jive là compression function an toàn?

### 3.1 Jive là one-way function

> [!abstract] Claim 3.1 — One-Wayness của $\mathsf{Jive}_b$ (theo [Bou+22/23, §6.1])
> Nếu CICO problem đối với $P$ là $(t, \epsilon)$-hard, thì không có adversary PPT nào có thể tìm preimage của $\mathsf{Jive}_b$ trong thời gian $t$ với xác suất $> \epsilon$.

**Intuition**: Để invert $\mathsf{Jive}_b$, adversary cần tìm $(\mathbf{x}_1, \ldots, \mathbf{x}_b)$ sao cho $\sum_i(\mathbf{x}_i + P(\mathbf{x}_i)_{[1:m]}) = \mathbf{z}$ với output cụ thể. Đây về cơ bản là bài toán CICO: kiểm soát một phần input và output của $P$ đồng thời.

### 3.2 Jive là collision-resistant

> [!abstract] Claim 3.2 — Collision Resistance của $\mathsf{Jive}_b$ (theo [Bou+22/23, §6.1])
> Nếu CICO là hard, thì $\mathsf{Jive}_b$ là collision-resistant: không adversary PPT nào tìm được $(\mathbf{x}_1, \ldots, \mathbf{x}_b) \neq (\mathbf{x}_1', \ldots, \mathbf{x}_b')$ với cùng output $\mathbf{z}$.

**Proof sketch**: Giả sử có collision. Khi đó:

$$
\sum_i (\mathbf{x}_i + \mathbf{u}_i) = \sum_i (\mathbf{x}_i' + \mathbf{u}_i')
$$

với $(\mathbf{u}_1, \ldots) = P(\mathbf{x}_1, \ldots)$ và $(\mathbf{u}_1', \ldots) = P(\mathbf{x}_1', \ldots)$.

Có thể reformulate: adversary biết một quan hệ tuyến tính giữa input/output của $P$ tại hai điểm khác nhau — đây là dạng mạnh hơn của CICO, nên CICO hardness implies collision resistance. $\square$

> [!warning] Jive không có capacity — điều này có ổn không?
> Sponge dùng capacity như một entropy buffer ẩn. Jive **không có capacity** — toàn bộ state ($b \cdot m$ phần tử) là "public" (từ input). Điều này ổn vì:
> 1. Jive là **compression function** (fixed-length input/output), không phải hash thông dụng.
> 2. Security dựa trên **preimage resistance của $P$** (CICO hardness), không phải entropy của hidden state.
> 3. Feed-forward $\sum_i (\mathbf{x}_i + \mathbf{u}_i)$ đảm bảo one-wayness ngay cả khi adversary thấy input.

---

## 4. Jive vs Sponge — So sánh

| Tính chất | Sponge (AnemoiSponge) | Jive (AnemoiJive) |
|-----------|----------------------|-------------------|
| Input length | Tùy ý (arbitrary) | Fixed ($b \cdot m$ phần tử) |
| Output | Arbitrary length | Fixed ($m$ phần tử) |
| Capacity | Cần $c \geq 2\lambda$ bits ẩn | Không cần capacity |
| Security model | Hermetic sponge (indifferentiability) | Collision resistance từ CICO |
| Use case | General-purpose hash | Merkle tree node compression |
| ZK cost | Rate $r$ phần tử/call | Toàn bộ $b \cdot m$ phần tử/call, nhưng 1 call = 1 node |
| Rounds needed | Nhiều hơn (full security cho sponge) | Giống Anemoi permutation |

> [!tip] 💡 Agent note
> Tên "Jive" là một điệu nhảy — tiếp nối truyền thống đặt tên cipher/hash theo điệu nhảy của Salsa20 và ChaCha20 (cũng là Latin dances). Paper [Bou+22/23] explicitly cite điều này trong phần đặt tên.

---

## 5. AnemoiJive cho Merkle Tree — Use Case

### 5.1 Merkle tree với Jive

Trong một binary Merkle tree ($b = 2$):

$$
\text{node}_{i,j} = \mathsf{Jive}_2(\text{node}_{i-1, 2j},\; \text{node}_{i-1, 2j+1})
$$

Với $m = 1$ phần tử $\mathbb{F}_q$, mỗi node là một phần tử field duy nhất. Input: 2 phần tử → output: 1 phần tử. Permutation $P$ là Anemoi với state width $b \cdot m = 2$ phần tử.

### 5.2 ZK Merkle membership proof

Để chứng minh $\text{leaf} \in \text{tree}$ trong ZK:
- Prover cần chứng minh $\log_2 N$ lần invocation của $\mathsf{Jive}_2$.
- Mỗi invocation: 1 Anemoi permutation call + 2 feed-forward additions.
- Với AnemoiJive-BLS12-381: mỗi invocation = **2 Plonk constraints** (nhờ custom gates).

Đây là **7× ít gate hơn** so với các approach trước đó dùng lookup tables (theo companion note eprint 2022/1487).

---

## 6. Concrete Instance: AnemoiJive-BLS12-381

> [!note] Scheme 6.1 — $\mathsf{AnemoiJive}\text{-BLS12-381}$ ($b = 2$)
> **Underlying permutation**: $\mathsf{Anemoi}_{\mathbb{F}_{q_\text{BLS}},\, 11,\, 1}$ (19 rounds, $\ell = 1$)
> **Branches**: $b = 2$, mỗi branch $m = 1$ phần tử $\mathbb{F}_{q_\text{BLS}}$
> **Input**: $(x, y) \in \mathbb{F}_{q_\text{BLS}}^2$ (hai node con trong Merkle tree)
> **Output**: $z \in \mathbb{F}_{q_\text{BLS}}$ (node cha)
>
> **$\mathsf{AnemoiJive}\text{-BLS12-381}(x, y)$:**
>
> *Bước 1:* $(u, v) \leftarrow \mathsf{Anemoi}(x, y)$
>
> *Bước 2:* $z \leftarrow x + y + u + v$
>
> **Output**: $z$
>
> **Security**: 127-bit collision resistance (vì $\log_2 q_\text{BLS} \approx 255 > 2 \times 127$)

### 6.1 Correctness đơn giản hóa

Với $b = 2$, $m = 1$: Jive formula là:

$$
z = (x + u) + (y + v) = x + y + u + v
$$

với $(u, v) = P(x, y)$. Đây là dạng đơn giản nhất của Jive, và cũng là dạng xuất hiện trong hầu hết ZK Merkle applications.

---

## 7. Concrete Instance: AnemoiJive-BN-254

> [!note] Scheme 7.1 — $\mathsf{AnemoiJive}\text{-BN-254}$ ($b = 2$)
> **Underlying permutation**: $\mathsf{Anemoi}_{\mathbb{F}_{q_\text{BN254}},\, 11,\, 1}$ (19 rounds, $\ell = 1$)
> **Branches**: $b = 2$, $m = 1$
> **Input/Output**: Giống BLS12-381 nhưng trên scalar field của BN-254
> **Security**: 127-bit (tương tự BLS12-381)
>
> **Lý do chọn $\alpha = 11$**: Trên BN-254, $\gcd(3, q-1) \neq 1$ và $\gcd(5, q-1) \neq 1$ (vì $q \equiv 1 \pmod{3}$ và $\pmod{5}$), nên $\alpha = 11$ là nhỏ nhất hợp lệ.

---

## 8. Summary

- **Jive** = feed-forward compression: $\mathbf{z} = \sum_i (\mathbf{x}_i + P(\mathbf{x}_i)_{[i]})$ — Latin dance inspired.
- **Không cần capacity**: security đến trực tiếp từ CICO hardness của $P$.
- **Collision resistance và one-wayness**: proved từ CICO hardness.
- **AnemoiJive-BLS12-381** và **-BN-254**: $b=2$, $m=1$, công thức $z = x+y+u+v$ — tối ưu cho Merkle tree.
- **ZK efficiency**: 2 Plonk custom gates per Merkle node — 7× tốt hơn lookup-based approaches.

Tiếp theo:
- [[06-anemoi-instantiations|06. Concrete Instantiations & Security Claims]] — AnemoiSponge, parameters đầy đủ, security claims.
- [[07-security-analysis-algebraic-attacks|07. Security Analysis]] — tại sao CICO hardness đảm bảo security của cả Jive lẫn sponge.

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- [BDPV07] Bertoni et al. — *Sponge Functions* (contrast với Jive — 🔴 Prerequisite)
- Merkle — *A Digital Signature Based on a Conventional Encryption Function*, CRYPTO 1987 (🔴 Prerequisite — Merkle tree)
