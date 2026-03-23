---
title: "06. Concrete Instantiations and Security Claims"
type: deep-dive
tags: [anemoi, instantiations, security-claims, anemoispo nge, deep-dive, lesson-06]
aliases: [AnemoiSponge, Anemoi Instantiations, Anemoi Security Claims]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Anemoi permutation (xem [[04-anemoi-permutation|04. The Anemoi Permutation]]), Jive mode (xem [[05-jive-compression-mode|05. Jive Compression Mode]]), sponge construction (xem [[02-sponge-construction|02. Sponge Construction]])
> **Lesson type**: Deep Dive
> **Covers**: §6.2 (AnemoiSponge), §6.3 (tất cả concrete instances — BLS12-381 và BN-254), §6.4 (security claims chính thức)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $q_\text{BLS}$ | Scalar field order của BLS12-381 (~254-bit prime) |
> | $q_\text{BN}$ | Scalar field order của BN-254 (~254-bit prime) |
> | $r, c$ | Rate và capacity của sponge (số phần tử $\mathbb{F}_q$) |
> | $\ell$ | Số cột Anemoi: $2\ell = r + c$ (state width) |
> | $n_r$ | Số rounds của Anemoi permutation |
> | $\lambda$ | Security level (bits) |

---

## Motivation

Hai lesson trước giới thiệu Jive (§6.1) và AnemoiSponge (§6.2) ở mức thiết kế. Bài này là **deep dive** vào §6.3–§6.4: toàn bộ tham số cụ thể cho các fields thực tế và security claims chính thức mà paper đưa ra.

Đây là bài học quan trọng để **implement** Anemoi: mọi số liệu cần thiết đều ở đây.

---

## 1. Context — Parent Scheme

Bài này drill vào §6 của paper, cụ thể hai sub-scheme:

| Sub-scheme | Lesson | Use case |
|-----------|--------|---------|
| AnemoiJive-BLS12-381 | [[05-jive-compression-mode\|Lesson 05]] | Merkle tree, BLS12-381 field |
| AnemoiJive-BN-254 | [[05-jive-compression-mode\|Lesson 05]] | Merkle tree, BN-254 field |
| **AnemoiSponge-BLS12-381** | **Bài này** | **General-purpose hash, BLS12-381** |
| **AnemoiSponge-BN-254** | **Bài này** | **General-purpose hash, BN-254** |

---

## 2. AnemoiSponge — General-Purpose Hash

### 2.1 Định nghĩa

AnemoiSponge là hash function thông dụng xây dựng từ Anemoi theo sponge construction đã phân tích trong [[02-sponge-construction|Lesson 02]].

> [!note] Scheme 2.1 — AnemoiSponge
> **Type**: Hash function (arbitrary-length input, fixed-length output)
> **Context**: AnemoiSponge là ứng dụng trực tiếp của sponge construction với permutation là Anemoi instance; đây là component analysis của sponge framework trong [[02-sponge-construction|Lesson 02]].
> **Setting**: Anemoi permutation $P = \mathsf{Anemoi}_{q,\alpha,\ell}$ trên $\mathbb{F}_q^{2\ell}$; rate $r$; capacity $c$ với $r + c = 2\ell$
>
> **$\mathsf{AnemoiSponge}(M, n)$** — hash message $M$, output $n$ phần tử:
>
> *Khởi tạo:*
> $$S = (S_\text{rate} \| S_\text{cap}) \leftarrow \mathbf{0} \in \mathbb{F}_q^{2\ell}$$
>
> *Padding:* chia $M$ thành blocks $m_1, \ldots, m_k \in \mathbb{F}_q^r$, thêm padding $1 \| 0^*$ nếu cần.
>
> *Absorbing:*
> $$\text{for } i = 1, \ldots, k: \quad S_\text{rate} \leftarrow S_\text{rate} + m_i; \quad S \leftarrow P(S)$$
>
> *Squeezing:*
> $$\text{output blocks} \leftarrow S_\text{rate}; \quad \text{nếu cần thêm}: S \leftarrow P(S), \text{ lấy thêm}$$
>
> **Output**: $n$ phần tử $\mathbb{F}_q$ đầu tiên thu được từ squeezing.

### 2.2 Tham số lựa chọn

Để đạt security $2^\lambda$, cần capacity $c \cdot \log_2 q \geq 2\lambda$:

- Với $q \approx 2^{255}$ (BLS12-381 hoặc BN-254) và $\lambda = 127$: cần $c \geq 1$ phần tử field.
- Paper chọn $\ell = 1$ (state = 2 phần tử) và $r = c = 1$ cho cả hash lẫn compression.

> [!tip] 💡 Agent note
> Với $r = 1$, AnemoiSponge absorb **1 phần tử $\mathbb{F}_q$ mỗi bước** — nghĩa là mỗi 255-bit chunk của message cần một Anemoi permutation call. Đây là rate chậm hơn sponge có state lớn hơn, nhưng phù hợp với constraint that $2\ell = 2$ cho BLS/BN applications với $\lambda = 127$.

---

## 3. Tất cả Concrete Instantiations — BLS12-381

### 3.1 Fields của BLS12-381

BLS12-381 là elliptic curve pairing-friendly phổ biến trong ZK (Zcash, Ethereum 2.0). Scalar field của nó:

$$
q_\text{BLS} = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001
$$

$\approx 2^{254.85}$, nguyên tố. Vì $11 \nmid (q_\text{BLS} - 1)$, $\alpha = 11$ là hợp lệ.

> [!note] Instance 3.1 — $\mathsf{AnemoiJive}\text{-BLS12-381}$
> | Parameter | Giá trị |
> |-----------|---------|
> | Field | $\mathbb{F}_{q_\text{BLS}}$ |
> | $\ell$ | 1 |
> | $\alpha$ | 11 |
> | $n_r$ (rounds) | 19 |
> | State size | 2 phần tử $\mathbb{F}_{q_\text{BLS}}$ |
> | Mode | Jive, $b = 2$ |
> | Input | 2 phần tử $\mathbb{F}_{q_\text{BLS}}$ |
> | Output | 1 phần tử $\mathbb{F}_{q_\text{BLS}}$ |
> | Security | 127-bit |
> | Use case | Merkle tree node ($2$-to-$1$) |

> [!note] Instance 3.2 — $\mathsf{AnemoiSponge}\text{-BLS12-381}$
> | Parameter | Giá trị |
> |-----------|---------|
> | Field | $\mathbb{F}_{q_\text{BLS}}$ |
> | $\ell$ | 1 |
> | $\alpha$ | 11 |
> | $n_r$ (rounds) | 19 |
> | State size | 2 phần tử ($r = 1$, $c = 1$) |
> | Mode | Sponge |
> | Input | Arbitrary length |
> | Output | Arbitrary length |
> | Security | 127-bit |
> | Use case | General-purpose hash |

---

## 4. Tất cả Concrete Instantiations — BN-254

### 4.1 Fields của BN-254

BN-254 (còn gọi là alt_bn128) là elliptic curve pairing-friendly phổ biến khác, dùng trong Ethereum (EVM precompiles), Groth16 implementations:

$$
q_\text{BN} = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
$$

$\approx 2^{254.85}$. Tương tự BLS12-381, $\alpha = 11$ hợp lệ.

> [!note] Instance 4.1 — $\mathsf{AnemoiJive}\text{-BN-254}$
> | Parameter | Giá trị |
> |-----------|---------|
> | Field | $\mathbb{F}_{q_\text{BN}}$ |
> | $\ell$ | 1 |
> | $\alpha$ | 11 |
> | $n_r$ (rounds) | 19 |
> | Mode | Jive, $b = 2$ |
> | Input/Output | 2 phần tử → 1 phần tử |
> | Security | 127-bit |

> [!note] Instance 4.2 — $\mathsf{AnemoiSponge}\text{-BN-254}$
> | Parameter | Giá trị |
> |-----------|---------|
> | Field | $\mathbb{F}_{q_\text{BN}}$ |
> | $\ell$ | 1 |
> | $\alpha$ | 11 |
> | $n_r$ (rounds) | 19 |
> | Rate / Capacity | $r = 1$, $c = 1$ |
> | Security | 127-bit |

---

## 5. Security Claims Chính Thức

Paper [Bou+22/23, §6.4] đưa ra hai loại security claims:

### 5.1 Hermetic Sponge Claim

> [!abstract] Claim 5.1 — Hermetic Sponge (theo [Bou+22/23, §6.4])
> Tất cả các instance AnemoiSponge được tham số hóa đúng ở trên đều thỏa mãn **hermetic sponge** claim — tức là chúng indifferentiable từ Random Oracle với security $2^{c/2 \cdot \log_2 q}$ bits, trong ideal permutation model.
>
> Điều kiện đủ: capacity $c \cdot \log_2 q \geq 2\lambda$ và Anemoi permutation "behaves like" random permutation — được support bởi algebraic attack analysis trong §7.

### 5.2 Secure Compression Function Claim

> [!abstract] Claim 5.2 — Secure $b$-to-1 Compression (theo [Bou+22/23, §6.4])
> Tất cả các instance AnemoiJive đều là **secure $b$-to-1 compression functions** — collision-resistant và one-way — với security $2^\lambda$, dưới giả thiết CICO hardness của underlying Anemoi permutation.

### 5.3 Tổng hợp security claims

| Instance | Mode | Security Level | Claim type |
|---------|------|---------------|-----------|
| AnemoiJive-BLS12-381 | Jive, $b=2$ | 127-bit | Secure compression |
| AnemoiJive-BN-254 | Jive, $b=2$ | 127-bit | Secure compression |
| AnemoiSponge-BLS12-381 | Sponge | 127-bit | Hermetic sponge |
| AnemoiSponge-BN-254 | Sponge | 127-bit | Hermetic sponge |

> [!warning] Tính chất "heuristic" của claims
> Các claims trên là **heuristic** theo chuẩn của symmetric cryptography: paper không có reduction từ hardness assumption cụ thể (như DLP hay LWE). Thay vào đó, security được argued thông qua:
> 1. Algebraic attack analysis (§7) — không có attack hiệu quả đã biết.
> 2. Statistical attack analysis (§7) — trivially handled.
> 3. Conservative design (SPN structure với MDS và full diffusion).
>
> Đây là chuẩn mực nhất quán với Poseidon, Rescue-Prime, và tất cả AO hash functions hiện tại.

---

## 6. Lựa chọn $g$ theo từng Field

Constant $g$ trong Flystel phải được chọn cẩn thận để đảm bảo Flystel có tính chất cryptographic tốt. Paper [Bou+22/23, §5] yêu cầu $g$ là một **non-square** trong $\mathbb{F}_p^*$ (tức là không phải quadratic residue) để ngăn ngừa các algebraic degeneracies.

| Field | $g$ value (hex) | Tính chất |
|-------|-----------------|-----------|
| $\mathbb{F}_{q_\text{BLS}}$ | Được specify trong paper | Non-square, $g \neq 0, \pm 1$ |
| $\mathbb{F}_{q_\text{BN}}$ | Được specify trong paper | Non-square, $g \neq 0, \pm 1$ |

> [!tip] 💡 Agent note
> Giá trị $g$ cụ thể (hex) có trong Table của paper gốc và trong [reference implementation](https://github.com/anemoi-hash/anemoi-rust). Lesson này không reproduce toàn bộ lookup tables nhưng chỉ ra cách chọn $g$.

---

## 7. Tóm tắt tất cả Parameters

| Instance | $q$ | $\alpha$ | $\ell$ | $n_r$ | Mode | Security |
|---------|-----|---------|--------|-------|------|---------|
| AnemoiJive-BLS12-381 | $q_\text{BLS}$ | 11 | 1 | 19 | Jive $b=2$ | 127-bit |
| AnemoiSponge-BLS12-381 | $q_\text{BLS}$ | 11 | 1 | 19 | Sponge $r=c=1$ | 127-bit |
| AnemoiJive-BN-254 | $q_\text{BN}$ | 11 | 1 | 19 | Jive $b=2$ | 127-bit |
| AnemoiSponge-BN-254 | $q_\text{BN}$ | 11 | 1 | 19 | Sponge $r=c=1$ | 127-bit |

Nhận xét: tất cả instances dùng cùng $\ell = 1$, $\alpha = 11$, $n_r = 19$ — sự thống nhất này đến từ việc cả BLS12-381 và BN-254 đều có field order xấp xỉ $2^{255}$ và cùng cấu trúc modular.

---

## 8. Connection — Component trong Parent Scheme

Bài này hoàn thành phần §6 của paper. Mối quan hệ với các bài khác:

- [[03-flystel-sbox|Lesson 03]] định nghĩa Flystel S-box — building block cho permutation.
- [[04-anemoi-permutation|Lesson 04]] định nghĩa Anemoi permutation $P$ — nền cho cả Jive lẫn Sponge.
- [[05-jive-compression-mode|Lesson 05]] định nghĩa Jive mode — dùng $P$ cho Merkle tree.
- **Bài này** cung cấp AnemoiSponge + tất cả concrete parameters.
- [[07-security-analysis-algebraic-attacks|Lesson 07]] giải thích *tại sao* 19 rounds là đủ — algebraic attack analysis.
- [[08-performance-benchmarks|Lesson 08]] so sánh performance của tất cả instances vs Poseidon/Rescue.

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- Reference implementation: https://github.com/anemoi-hash/anemoi-rust
- Companion note (TurboPlonk): ePrint 2022/1487
