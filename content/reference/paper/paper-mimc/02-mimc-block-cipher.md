---
title: "02. MiMC Block Cipher Construction"
type: scheme
tags: [mimc, block-cipher, finite-field, permutation, lesson-02]
aliases: [MiMC Block Cipher, MiMC-n/n, MiMC-2n/n]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[01-mimc-motivation|01. MPC/FHE/ZK Motivation]], finite field arithmetic ($\mathbb{F}_{2^n}$, permutation polynomial, Fermat's little theorem), Feistel network cơ bản  
> 🔴 **Prerequisite references**: Menezes, van Oorschot, Vanstone — *HAC* [MVO96] (finite field arithmetic, §2.3–2.6)  
> **Lesson type**: Scheme  
> **Covers**: §2.1 (MiMC-n/n, MiMC-2n/n, Proposition 1, Lemma 1, Figure 1), §2.2 (permutation MiMCP)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $n$ | Kích thước block/key (bits) — phải lẻ | $n$ |
> | $k \in \mathbb{F}_{2^n}$ | Secret key | $k$ |
> | $c_i \in \mathbb{F}_{2^n}$ | Round constant thứ $i$ (với $c_0 = c_{r-1} = 0$) | $c_i$ |
> | $r$ | Số rounds: $r = \lceil n / \log_2 3 \rceil$ | $r$ |
> | $F(x) = x^3$ | Non-linear round function | $F(x) := x^3$ |
> | $E_k : \mathbb{F}_{2^n} \to \mathbb{F}_{2^n}$ | Encryption function với key $k$ | $E_k$ |
> | $\oplus$ | XOR = cộng trong $\mathbb{F}_{2^n}$ | $\oplus$ (hoặc $+$) |
> | $s$ | Exponent của inverse: $s = (2^{n+1}-1)/3$ | $s$ |
> | $x_L \| x_R$ | Ghép nối: left half $\| $ right half (Feistel) | $x_L \| x_R$ |

---

## Motivation

MiMC được xây dựng từ một câu hỏi cực kỳ trực tiếp: **round function đơn giản nhất có thể — chỉ là $x^3$ — liệu có thể tạo ra một block cipher bảo mật không, và cần bao nhiêu rounds?**

Thiết kế này là simplification của cipher Knudsen-Nyberg [KN95] từ 1995, và gần hơn với **PURE** — cipher dùng trong [JK97] để minh họa interpolation attack. Paper MiMC lấy lại ý tưởng 20 năm trước và hỏi: với số rounds đủ lớn (~100 thay vì ~10), design này có bảo mật và competitive không?

---

## Mathematical Setting

> [!note] Setting 2.0 — Finite Field $\mathbb{F}_{2^n}$
> MiMC hoạt động trên trường hữu hạn $\mathbb{F}_{2^n}$ với $n$ lẻ. Các phần tử là polynomials bậc $< n$ với coefficients trong $\mathbb{F}_2$. Phép cộng là XOR bitwise. Phép nhân là nhân polynomial modulo một irreducible polynomial $p(x)$ bậc $n$ trên $\mathbb{F}_2$.
>
> Paper không ràng buộc chọn irreducible polynomial cụ thể nào — đây là tự do implementation.

---

## Proposition 1: Điều kiện để $x^d$ là permutation

> [!abstract] Proposition 1
> Monomial $x^d$ là permutation trên $\mathbb{F}_{2^n}$ khi và chỉ khi $\gcd(d, 2^n - 1) = 1$.

**Tại sao điều này quan trọng**: Round function $F(x) = x^3$ phải là bijection để cipher có thể decrypt được. Nếu $F$ không phải permutation thì nhiều plaintexts map đến cùng một ciphertext — mất tính invertibility.

**Với $d = 3$**: Ta cần $\gcd(3, 2^n - 1) = 1$. Điều này tương đương $3 \nmid (2^n - 1)$, tức $3 \nmid 2^n - 1$. Dễ kiểm tra:

$$
2^n \equiv (-1)^n \pmod{3}
$$

- Nếu $n$ lẻ: $2^n \equiv -1 \equiv 2 \pmod{3}$, suy ra $2^n - 1 \equiv 1 \pmod{3}$, tức $\gcd(3, 2^n-1) = 1$. ✓
- Nếu $n$ chẵn: $2^n \equiv 1 \pmod{3}$, suy ra $3 \mid (2^n - 1)$. ✗

**Kết luận**: Chọn $n$ lẻ để đảm bảo $x^3$ là permutation trên $\mathbb{F}_{2^n}$. Đây là lý do MiMC yêu cầu $n$ phải lẻ. Paper recommend $n = 2t+1$ cho một số nguyên $t$.

---

## Lemma 1: Inverse của $x^3$

> [!abstract] Lemma 1
> Cho $n$ lẻ. Inverse của non-linear function $x^3$ trong $\mathbb{F}_{2^n}$ là $x^s$ với:
>
> $$
> s := \frac{2^{n+1} - 1}{3}
> $$

**Chứng minh** (trực tiếp theo paper):

Cho $y = x^3$, cần tìm $s$ sao cho $y^s = x$, tức $x^{3s} = x$ trong $\mathbb{F}_{2^n}$.

Theo định lý Fermat nhỏ trong trường hữu hạn: $x^{2^n - 1} = 1$ với mọi $x \neq 0$. Do đó $x^{3s} = x$ tương đương:

$$
3s \equiv 1 \pmod{2^n - 1}
$$

Tức cần tìm $s$ sao cho $3s = 1 + t(2^n - 1)$ với $t$ nào đó. Thử $t = 1$: $3s = 2^n$ — không nguyên (vì $2^n \not\equiv 0 \pmod{3}$ khi $n$ lẻ). Thử $t = 2$:

$$
3s = 2^{n+1} - 1
$$

Vì $n+1$ chẵn, ta có $2^{n+1} - 1 \equiv 0 \pmod{3}$ (vì $2^{n+1} \equiv 1 \pmod{3}$ khi $n+1$ chẵn). Do đó $3 \mid (2^{n+1} - 1)$, và:

$$
s = \frac{2^{n+1} - 1}{3}
$$

là số nguyên. Vì $x^3$ là permutation (Prop. 1), inverse là duy nhất, và $x^s$ chính là inverse đó. $\blacksquare$

**Ví dụ**: Với $n = 17$, $s = (2^{18} - 1)/3 = 262143/3 = 87381$. Kiểm tra: $3 \times 87381 = 262143 = 2^{18} - 1 \equiv 1 \pmod{2^{17} - 1}$. ✓

> [!warning] Decrypt đắt hơn Encrypt nhiều
> Exponent $s$ có Hamming weight lớn hơn nhiều so với $d = 3$. Trong $\mathbb{F}_{2^n}$, tính $x^s$ đòi hỏi nhiều multiplications hơn tính $x^3$. Do đó **decryption đắt hơn encryption đáng kể**. Paper khuyến cáo dùng chế độ không cần inverse (CTR mode, hash function) để tránh vấn đề này.

---

## MiMC-n/n: Block Cipher

> [!note] Scheme 2.1 — MiMC-n/n Block Cipher
> **Type**: Keyed block cipher  
> **Setting**: Trường $\mathbb{F}_{2^n}$ với $n$ lẻ; key $k \in \mathbb{F}_{2^n}$; round constants $c_0, c_1, \ldots, c_{r-1} \in \mathbb{F}_{2^n}$ với $c_0 = c_{r-1} = 0$, các $c_i$ còn lại là random elements cố định; số rounds $r = \lceil n / \log_2 3 \rceil$
>
> **$\mathsf{Encrypt}(k,\, x)$** — $x \in \mathbb{F}_{2^n}$ là plaintext:
> - Đặt $x_0 = x$
> - Với $i = 0, 1, \ldots, r-2$: $\quad x_{i+1} = (x_i \oplus k \oplus c_i)^3$
> - Output ciphertext: $\quad E_k(x) = x_{r-1} \oplus k$
>
> Tương đương, round function thứ $i$ là $F_i(x) = (x \oplus k \oplus c_i)^3$, và:
>
> $$
> E_k(x) = (F_{r-2} \circ F_{r-3} \circ \cdots \circ F_0)(x) \oplus k
> $$
>
> **$\mathsf{Decrypt}(k,\, y)$** — $y \in \mathbb{F}_{2^n}$ là ciphertext:
> - Dùng inverse round function $F^{-1}(x) = x^s$ với $s = (2^{n+1}-1)/3$
> - Đảo ngược thứ tự round constants: $c_{r-1}, c_{r-2}, \ldots, c_0$
> - Thực hiện $r-1$ rounds theo chiều ngược

**Luồng tính toán một round** (trực quan):

```
                ┌──────────┐
 xᵢ  ──⊕k──⊕cᵢ──│ (·)³    │──── xᵢ₊₁
       ↑    ↑    └──────────┘
       key  round_const
```

**Hình 1 trong paper** (tái hiện cho $r$ rounds):

```
x₀ ─⊕k─⊕c₀─(·)³─ x₁ ─⊕k─⊕c₁─(·)³─ ... ─⊕k─⊕cᵣ₋₂─(·)³─ ⊕k ─ y
```

Đặc điểm chính của thiết kế:

- **Round constants $c_i$** được tạo ngẫu nhiên một lần và hard-coded — không cần communication (giống AES, LowMC)
- **Cùng key $k$** được add ở mỗi round (key schedule cực đơn giản)
- $c_0 = c_{r-1} = 0$: round đầu và cuối không có constant để đảm bảo tính đối xứng của design
- **Chỉ 1 multiplication per round** (tính $x^3$) — đây là nguồn gốc của tên "Minimal Multiplicative Complexity"

**Số rounds**: $r = \lceil n / \log_2 3 \rceil \approx n \cdot \log_3 2 \approx 0.631 \cdot n$. Với $n = 129$: $r = \lceil 129/1.585 \rceil = 82$ rounds.

---

## MiMC-2n/n: Feistel Variant

> [!note] Scheme 2.2 — MiMC-2n/n (Feistel Network)
> **Type**: Keyed block cipher (Feistel structure)  
> **Setting**: Block size $2n$, key size $n$; cùng trường $\mathbb{F}_{2^n}$; state gồm hai nửa $(x_L, x_R) \in \mathbb{F}_{2^n}^2$; số rounds $r' = 2r = 2\lceil n/\log_2 3 \rceil$
>
> **Round function** thứ $i$:
>
> $$
> (x_L \| x_R) \;\leftarrow\; (x_R \oplus (x_L \oplus k \oplus c_i)^3) \;\|\; x_L
> $$
>
> (swap $L$ và $R$ sau mỗi round, ngoại trừ round cuối không swap)
>
> **Decrypt**: Dùng encryption function với reversed round constants — tính chất chuẩn của Feistel network.

**So sánh với MiMC-n/n**:

| Thuộc tính | MiMC-n/n | MiMC-2n/n |
|-----------|---------|-----------|
| Block size | $n$ bits | $2n$ bits |
| Key size | $n$ bits | $n$ bits |
| Rounds | $r = \lceil n/\log_2 3 \rceil$ | $r' = 2r$ |
| Multiplications | $r$ | $r'$ |
| Cơ sở rounds | Interpolation attack | MitM GCD attack (xem L04) |
| Decryption | Cần inverse $x^s$ (đắt) | Dùng encryption reversed (rẻ hơn) |

> [!tip] 💡 Agent note
> Feistel variant có ưu điểm là decryption rẻ hơn vì chỉ cần đảo thứ tự round constants, không cần tính inverse $x^s$. Nhược điểm là cần gấp đôi số rounds. Paper khuyến cáo dùng Feistel khi cần block size lớn hơn hoặc khi decryption là quan trọng.

---

## MiMCp: Permutation

> [!note] Scheme 2.3 — MiMCP (Permutation)
> **Type**: Keyed-with-zero permutation  
> **Construction**: Đặt $k = 0^n$ (key all-zero) trong MiMC-n/n hoặc MiMC-2n/n:
>
> $$
> \mathsf{MiMCP}(x) := E_{k=0}(x)
> $$

Permutation này là nền tảng để xây dựng hash function MiMCHash (xem Lesson 03). Việc fix key $= 0$ đơn giản hóa phân tích bảo mật vì không còn biến key.

---

## Correctness (tại sao Encrypt/Decrypt đúng)

**Cho MiMC-n/n**: Cần chứng minh $\mathsf{Decrypt}(k, E_k(x)) = x$.

Mỗi round forward $F_i(x) = (x \oplus k \oplus c_i)^3$ có inverse $F_i^{-1}(y) = y^s \oplus k \oplus c_i$. Vì:

$$
F_i^{-1}(F_i(x)) = ((x \oplus k \oplus c_i)^3)^s \oplus k \oplus c_i = (x \oplus k \oplus c_i)^{3s} \oplus k \oplus c_i
$$

Và $3s \equiv 1 \pmod{2^n - 1}$, suy ra $x^{3s} = x$ với mọi $x \in \mathbb{F}_{2^n}^*$ (và $0^{3s} = 0$), nên:

$$
F_i^{-1}(F_i(x)) = (x \oplus k \oplus c_i) \oplus k \oplus c_i = x \quad \checkmark
$$

Đảo chiều toàn bộ pipeline (kèm bước $\oplus k$ cuối) cho ra plaintext gốc. $\blacksquare$

**Cho MiMC-2n/n**: Tính chất chuẩn của Feistel network — đảo thứ tự round constants và rerun encryption là decryption. Không cần inverse round function. $\blacksquare$

---

## Instantiation Parameters

Paper đề xuất các tham số cụ thể:

| Variant | $n$ | $r$ | Block (bits) | Key (bits) | minMULs |
|---------|-----|-----|-------------|-----------|---------|
| MiMC-129/129 | 129 | 82 | 129 | 129 | 82 |
| MiMC-258/129 | 129 | 164 | 258 | 129 | 164 |

Với $n = 129$: $r = \lceil 129 / \log_2 3 \rceil = \lceil 129 / 1.585 \rceil = \lceil 81.4 \rceil = 82$.

> [!tip] 💡 Agent note
> Số 82 rounds nghe có vẻ nhiều so với AES (10 rounds) hay LowMC. Nhưng vì **mỗi round của MiMC chỉ là 1 phép nhân** — không có S-box, không có linear layer phức tạp — tổng chi phí vẫn thấp hơn. Đây là trade-off cốt lõi của MiMC: nhiều rounds hơn, nhưng mỗi round cực kỳ rẻ.

---

## Summary

- MiMC sử dụng round function $F_i(x) = (x \oplus k \oplus c_i)^3$ — đơn giản đến mức tối thiểu.
- Yêu cầu $n$ lẻ để $x^3$ là permutation (Proposition 1). Inverse là $x^s$ với $s = (2^{n+1}-1)/3$ (Lemma 1).
- **MiMC-n/n**: SPN-style với cùng key add mỗi round. $r \approx 0.631n$ rounds. Decrypt cần $x^s$ (đắt).
- **MiMC-2n/n**: Feistel variant với gấp đôi rounds nhưng decrypt rẻ hơn.
- **MiMCP**: Permutation với $k = 0$, dùng cho hash function.
- Số rounds được xác định bởi security analysis (interpolation attack và GCD attack — xem [[04-mimc-algebraic-attacks|Lesson 04]]).
- **1 multiplication per round** → tổng minMULs $= r \approx 82$ cho $n = 129$ — thấp hơn AES (~10×).

---

## References

- [KN95] Knudsen, Nyberg — *Provable security against a differential attack*, J. Cryptology 1995 (🟡 tiền thân thiết kế MiMC)
- [JK97] Jakobsen, Knudsen — *The interpolation attack on block ciphers*, FSE 1997 (🟡 nguồn gốc của round count — xem Lesson 04)
- [MVO96] Menezes, van Oorschot, Vanstone — *HAC*, 1996 (🔴 Prerequisite)
