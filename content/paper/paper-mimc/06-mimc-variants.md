---
title: "06. MiMC Variants"
type: deep-dive
tags: [mimc, prime-field, larger-keys, groebner, round-function, lucas-theorem, lesson-06]
aliases: [MiMC Variants, MiMC Prime Field, MiMC Larger Key]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[02-mimc-block-cipher|02. MiMC Block Cipher]], [[04-mimc-algebraic-attacks|04. Algebraic Attacks]], Gröbner basis basics, modular exponentiation  
> 🔴 **Prerequisite references**: Becker, Kredel, Weispfenning — *Gröbner bases* [BKW93]  
> **Lesson type**: Deep Dive  
> **Covers**: §5.1 (MiMC over prime fields), §5.2 (larger keys — Gröbner bases, Resultants), §5.3 (different round functions, Theorem 1 Lucas, Algorithm 1)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $p$ | Số nguyên tố (modulus cho prime field) | $p$ |
> | $\mathbb{F}_p$ | Trường nguyên tố bậc $p$ | $F_p$, $GF(p)$ |
> | $\kappa$ | Số key segments trong larger-key construction | $\kappa$ |
> | $k_0, k_1, \ldots, k_{\kappa-1}$ | Key segments (cyclic addition) | $k_i$ |
> | $d$ | Round function exponent (tổng quát thay cho 3) | $d$ |
> | $t$ | Tham số cho exponent $d = 2^t \pm 1$ | $t$ |
> | $m, s$ | Số nhân và số squarings trong fast exponentiation | $m$, $s$ |
> | $g^e$ | Exponentiation trong $\mathbb{F}_{2^n}$ với $e = 2^t - 1$ | $g^e$ |

---

## Context

Sau khi thiết lập MiMC cơ bản (Lesson 02) và security analysis (Lessons 04–05), paper khảo sát ba hướng **mở rộng và điều chỉnh**:

1. **Prime fields** ($\mathbb{F}_p$): nhiều giao thức ZK dùng $\mathbb{F}_p$ natively — MiMC cần adapt
2. **Larger keys**: tăng key size để chống Gröbner basis attacks nếu cần
3. **Different round functions**: thay $x^3$ bằng $x^{2^t \pm 1}$ — phân tích trade-off

---

## §5.1 — MiMC trên Prime Fields

### Điều kiện permutation trong $\mathbb{F}_p$

Trong $\mathbb{F}_{2^n}$, điều kiện để $x^3$ là permutation là $n$ lẻ (Proposition 1, Lesson 02). Trên $\mathbb{F}_p$, điều kiện tương đương là:

$$
\gcd(3, p-1) = 1
$$

Vì order của nhóm nhân $\mathbb{F}_p^* $ là $p - 1$, monomial $x^3$ là bijection trên $\mathbb{F}_p^*$ (và trên $\mathbb{F}_p$) khi và chỉ khi $3 \nmid (p-1)$.

**Ví dụ thực tế**: Nhiều SNARK-friendly fields có $p$ dạng $p \equiv 2 \pmod{3}$ — đảm bảo $3 \nmid (p-1)$. Ví dụ, $p = 2^{254} + 2^{252} + \ldots$ (BN254 scalar field) thỏa mãn điều kiện này.

### MiMC-p/p và MiMC-2p/p

> [!note] Scheme 6.1 — MiMC-p/p (Prime Field Variant)
> **Type**: Keyed block cipher trên $\mathbb{F}_p$  
> **Setting**: Số nguyên tố $p$ với $\gcd(3, p-1) = 1$; key $k \in \mathbb{F}_p$; round constants $c_i \in \mathbb{F}_p$ (random, $c_0 = c_{r-1} = 0$)  
> **Số rounds**: $r = \lceil \log(p) / \log 3 \rceil = \lceil \log_3 p \rceil$
>
> **$\mathsf{Encrypt}(k, x)$**:
> - Với $i = 0, 1, \ldots, r-2$: $\quad x_{i+1} = (x_i + k + c_i)^3 \bmod p$
> - Output: $E_k(x) = x_{r-1} + k \bmod p$
>
> **$\mathsf{Decrypt}(k, y)$**: Dùng $F^{-1}(x) = x^s$ với $s = (2p-1)/3$ (nếu $p \equiv 2 \pmod 3$) hoặc inverse thích hợp.
>
> **Feistel variant MiMC-2p/p**: Tương tự MiMC-2n/n với $r' = 2\lceil \log_3 p \rceil$ rounds.

**Sự khác biệt so với $\mathbb{F}_{2^n}$**:

| Thuộc tính | $\mathbb{F}_{2^n}$ | $\mathbb{F}_p$ |
|-----------|-------------------|----------------|
| Phép cộng | XOR ($\oplus$) | Cộng modulo $p$ |
| Squaring | Tuyến tính (Frobenius) | **Không tuyến tính** — tốn 1 multiplication |
| Chi phí $x^3$ | 1 multiplication | **2 multiplications** (vì $x^2$ không free) |
| Subfield attack | Có thể có | **Không áp dụng** (không có proper subfields) |
| Security analysis | Giống — interpolation/GCD transfer | Giống — với adaptation |

> [!warning] Cost tăng gấp đôi trong $\mathbb{F}_p$
> Vì squaring không tuyến tính trên $\mathbb{F}_p$, mỗi round của MiMC-p/p cần **2 multiplications** thay vì 1. Paper note rằng "for the GF(p) version of MiMC, the number of multiplications has to be multiplied by 2" khi so sánh trong Table 1. Tuy nhiên, với nhiều SNARK systems native trên $\mathbb{F}_p$, đây vẫn là thiết kế tối ưu nhất.

**Security analysis transfer**: Subfield attack không áp dụng cho $\mathbb{F}_p$ (không có proper subfields). Interpolation, GCD, differential, linear attacks đều transfer tương tự từ $\mathbb{F}_{2^n}$.

---

## §5.2 — Larger Keys

### Tại sao cần larger keys?

Trong MiMC cơ bản, cùng key $k$ được add mỗi round. Adversary có thể exploit tính lặp lại này: GCD attack chỉ cần 2 cặp plaintext-ciphertext để recover $k$ (Lesson 04). Nếu muốn tăng complexity của key recovery attacks, có thể dùng key lớn hơn block size.

### Construction với $\kappa$ key segments

> [!note] Scheme 6.2 — MiMC với key size $\kappa \cdot n$ bits
> **Setting**: Key $= (k_0, k_1, \ldots, k_{\kappa-1}) \in \mathbb{F}_{2^n}^\kappa$ — $\kappa$ segments độc lập, mỗi segment $n$ bits  
> **Round function** thứ $i$:
>
> $$
> F_i(x) = (x \oplus k_{i \bmod \kappa} \oplus c_i)^3
> $$
>
> Key được add **cyclically**: round 0 dùng $k_0$, round 1 dùng $k_1$, ..., round $\kappa-1$ dùng $k_{\kappa-1}$, round $\kappa$ dùng $k_0$ lại, v.v.

**Bảo mật tăng thế nào?**

Simple GCD attack không còn hoạt động vì polynomial $E(K_0, K_1, \ldots, K_{\kappa-1}, x)$ là **đa biến** trong các key segments. Adversary phải dùng các kỹ thuật khó hơn:

> [!info] Gröbner Basis và Resultants
> Hai phương pháp chính để giải hệ đa thức đa biến:
>
> **Gröbner basis** [BKW93]: Giải hệ bằng cách tính cơ sở Gröbner. Với $\kappa = 2$, maximum degree trong tính toán bị giới hạn bởi $\leq 2 \cdot \max\deg(P) + 1 = 2 \cdot 3^r + 1$ [BKW93]. Complexity theo [BFS14]:
>
> $$
> O\!\left(\binom{2 \cdot 3^r + 3}{2}\right) \approx O\!\left((2 \cdot 3^r)^2\right) = O(9 \cdot 3^{2r})
> $$
>
> **Resultants** [LMS13]: Từ một hệ bivariate với max degree $3^r$, complexity:
>
> $$
> \tilde{O}(d^{4.69}) = \tilde{O}(3^{4.69r})
> $$
>
> Conservatively (MitM), expected complexity $\approx \sqrt{\text{above}}$.

**Round count để chống với $\kappa = 2$** (conservative, MitM):

$$
\sqrt{O(9 \cdot 3^{2r})} = O(3^r) \approx 2^n \implies r \approx n/\log_2 3
$$

— cùng round count cơ bản! Nhưng key space tăng từ $2^n$ lên $2^{2n}$, tăng cost cho exhaustive key search.

> [!tip] 💡 Agent note
> Paper không thay đổi số rounds cho larger-key variant — chỉ tăng key size. Trong thực tế, $\kappa = 1$ (key bằng block size) được dùng cho hầu hết ứng dụng. Larger key là tùy chọn cho những ai muốn extra margin chống algebraic key recovery.

---

## §5.3 — Different Round Functions

### Câu hỏi: Tại sao chọn $x^3$ mà không phải $x^{2^t+1}$ hay $x^{2^t-1}$?

Paper phân tích hai họ exponent thay thế và giải thích tại sao $x^3$ là lựa chọn tốt nhất.

### Họ $2^t + 1$ (với $t > 1$)

**Ưu điểm tưởng có**: $x^{2^t+1} = x^{2^t} \cdot x$ — cần 1 squaring + 1 multiplication = vẫn 1 non-linear multiplication (squaring free trong $\mathbb{F}_{2^n}$). Degree sau $r$ rounds: $(2^t+1)^r$ — cao hơn $3^r$ rất nhiều.

**Vấn đề — Interpolation polynomial sparse**: Dùng **Lucas's Theorem** để phân tích.

> [!abstract] Theorem 1 — Lucas's Theorem
> Cho số nguyên không âm $m, n$ và số nguyên tố $p$:
>
> $$
> \binom{m}{n} \equiv \prod_{k=0}^{s} \binom{m_k}{n_k} \pmod{p}
> $$
>
> trong đó $m = m_s p^s + \cdots + m_1 p + m_0$ và $n = n_s p^s + \cdots + n_1 p + n_0$ là base-$p$ expansions, với convention $\binom{a}{b} = 0$ nếu $a < b$.

**Ứng dụng**: Tính số terms của $(x \oplus k)^{2^t+1}$ sau 1 round (trong $\mathbb{F}_{2^n}$ với $\text{char} = 2$):

$$
(x \oplus k)^{2^t+1} \equiv_2 (x \oplus k)^{2^t} \cdot (x \oplus k) \equiv_2 (x^{2^t} \oplus k^{2^t})(x \oplus k)
$$

Khai triển: $x^{2^t+1} \oplus k \cdot x^{2^t} \oplus k^{2^t} \cdot x \oplus k^{2^t+1}$ — chỉ **4 terms** (thay vì $2^t + 2$).

Dùng Lucas's Theorem với $p = 2$: binomial coefficients $\binom{2^t+1}{i} \bmod 2 = 1$ chỉ với $i \in \{0, 1, 2^t, 2^t+1\}$ — xác nhận polynomial chỉ có 4 terms.

> [!abstract] Claim 6.1 — Sparsity của interpolation polynomial với $x^{2^t+1}$
> Sau $r$ rounds dùng round function $x^{2^t+1}$ (với $t > 1$), số terms của interpolation polynomial bị giới hạn bởi $3^r + 1$ — **cùng bound** với exponent $x^3$ (tức $t = 1$).
>
> Hệ quả: Mặc dù degree cao hơn, polynomial **sparse** hơn nhiều. Cùng số rounds cần thiết để chống interpolation attack.

**Kết luận**: Dùng $x^{2^t+1}$ với $t > 1$ không giảm số rounds cần thiết, nhưng có degree cao hơn (tốt), và chi phí vẫn 1 multiplication/round (tốt). Tuy nhiên không cải thiện so với $x^3$ về mặt security/multiplication trade-off.

**Và $x^3$ là trường hợp duy nhất thuộc cả hai họ**: $3 = 2^1 + 1 = 2^2 - 1$.

### Họ $2^t - 1$ (với $t \geq 2$) — Đáng chú ý hơn

**Ưu điểm**: Interpolation polynomial **không sparse**. Bằng Lucas's Theorem:

$$
\binom{2^t - 1}{i} \equiv_2 1 \quad \forall i \in \{0, 1, \ldots, 2^t - 1\}
$$

Do đó $(x \oplus k)^{2^t-1}$ có **đủ** $2^t$ terms sau 1 round — polynomial dense ngay từ đầu.

**Nhược điểm**: Tính $x^{2^t-1}$ cần nhiều multiplications và squarings hơn $x^3$. Paper đề xuất thuật toán tối ưu:

> [!note] Algorithm 1 — Modular Exponentiation với Cache ($e = 2^t - 1$)
> **Input**: $g \in \mathbb{F}_{2^n}$, $e = 2^t - 1$ với $t \geq 2$  
> **Output**: $g^e$
>
> **$\mathsf{FastExp}(g, t)$**:
> - $g_0 \leftarrow g$
> - $g_1 \leftarrow g^2 \cdot g$ (precompute $g^3$)
> - $A \leftarrow 1$
> - Với $i$ từ $0$ đến $\lfloor t/2 \rfloor$:
>   - $A \leftarrow (A^2)^2$ (double squaring)
>   - $A \leftarrow A \cdot g_1$
> - Nếu $t \bmod 2 \neq 0$:
>   - $A \leftarrow A^2$
>   - $A \leftarrow A \cdot g_0$
> - **Return** $A$
>
> **Số operations**:
> - Multiplications: $m = \lceil t/2 \rceil$
> - Squarings: $s = t - 1$

**Trade-off**: Với $n = 129$, exponent tốt nhất trong họ $2^t - 1$ là $t = 4$ (tức $d = 15$):

| Exponent | Multiplications $m$ | Squarings $s$ | Total non-linear ops |
|----------|--------------------|-----------|--------------------|
| $3 = 2^1+1 = 2^2-1$ | $r = 82$ | $0$ (free trong $\mathbb{F}_{2^n}$) | **82** |
| $15 = 2^4-1$ ($t=4$) | $\lceil 4/2 \rceil \cdot \lceil 129/\log_2 15 \rceil = 2 \cdot 33 = 66$ | $(4-1) \cdot 33 = 99$ | 165 (non-free) |
| $63 = 2^6-1$ ($t=6$) | Không dùng: $\gcd(63, 2^{129}-1) = 7 \neq 1$ | — | Không là permutation! |

**Kết luận cuối cùng**:

- Nếu **squaring là miễn phí** (trong $\mathbb{F}_{2^n}$ ngoài SNARK): $x^{2^t-1}$ với $t = 4$ (exponent 15) cho ít multiplications hơn $x^3$ (66 vs 82). Có thể dùng để tối ưu nếu cần.
- Nếu **squaring không miễn phí** (trong SNARK hoặc $\mathbb{F}_p$): $m + s$ gần như constant cho mọi $t$ — không có lợi so với $x^3$.
- **Kết luận của paper**: $x^3$ là lựa chọn tốt nhất cho trường hợp chung vì:
  - SNARK-friendly (cost 2 constraints/round — tối thiểu)
  - Thuộc cả họ $2^t+1$ (degree tăng nhanh) và $2^t-1$ (polynomial dense)
  - Công thức đơn giản nhất — dễ implement, dễ analyze

---

## Summary

**§5.1 — Prime fields**: MiMC transfer trực tiếp sang $\mathbb{F}_p$ với điều kiện $\gcd(3, p-1) = 1$. Chi phí tăng 2× (squaring không free) nhưng vẫn là option tốt nhất cho SNARK-friendly prime fields. Subfield attack không áp dụng.

**§5.2 — Larger keys**: Cyclic key schedule với $\kappa$ segments tăng key space lên $2^{\kappa n}$ và force adversary dùng Gröbner basis hoặc Resultants. Round count không thay đổi; complexity tăng exponentially với $\kappa$.

**§5.3 — Different round functions**:
- $x^{2^t+1}$ ($t > 1$): polynomial sparse → cùng round count, không cải thiện. $x^3$ ($t=1$) là tốt nhất trong họ này.
- $x^{2^t-1}$: polynomial dense, ít multiplications hơn khi squaring free (Algorithm 1). Nhưng khi squaring có cost (SNARK, $\mathbb{F}_p$) thì $m + s$ ≈ constant → không lợi hơn $x^3$.
- **Theorem 1** (Lucas) là công cụ lý thuyết giải thích tại sao $x^{2^t+1}$ cho sparse polynomials.
- **$x^3$ là lựa chọn tối ưu** cho mọi context: đơn giản, đủ dense, SNARK-friendly.

---

## References

- [BKW93] Becker, Kredel, Weispfenning — *Gröbner bases: a computational approach*, Springer 1993 (🔴 Prerequisite)
- [BFS14] Bardet, Faugère, Salvy — *On the Complexity of the F5 Gröbner basis Algorithm*, JSC 2014 (⚪ — complexity bound §5.2)
- [LMS13] Lebreton, Mehrabi, Schost — *On the complexity of solving bivariate systems*, ISSAC 2013 (⚪ — Resultant complexity)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite — modular exponentiation §14.6)
