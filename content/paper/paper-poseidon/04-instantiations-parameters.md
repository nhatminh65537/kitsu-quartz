---
title: "04. Concrete Instantiations & Parameter Selection"
type: scheme
tags: [poseidon, instantiation, parameters, security-claims, scheme, lesson-04]
aliases: [POSEIDON Parameters, POSEIDON Instantiation]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[02-sponge-construction|02. Sponge Construction]], [[03-hades-round-function|03. HADES & Round Function]]  
> 🔴 **Prerequisite references**: Grassi et al. — *HADES Design Strategy* [GLR+20] (algebraic security bounds đầy đủ)  
> **Lesson type**: Scheme  
> **Covers**: §2.3 (Domain Separation), §3.1 (Definition 1 — parameter tuple), §3.2 (Security Claims 1–4), §3.3 (Security Margin), §3.4 (Attack Details — round number formulae), Appendix A (Grain LFSR — mention)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $(n, t, R_F, R_P, \alpha)$ | POSEIDON parameter tuple | $(n, t, R_F, R_P, \alpha)$ |
> | $M$ | Security level (bits) | $M$ |
> | $c$ | Capacity: $c = t - r$ phần tử $\mathbb{F}_p$ | $c$ |
> | $R_F = 2R_f$ | Tổng full rounds | $R_F$ |
> | $R_P$ | Số partial rounds | $R_P$ |
> | $\alpha$ | S-box exponent | $\alpha$ |
> | $\lambda$ | Target security level trong attack complexity | $\lambda$ |

---

## Motivation

Đến đây ta đã có permutation $\mathsf{POSEIDON}^\pi$ với cấu trúc HADES. Câu hỏi thực tế là: **chọn $t$, $R_F$, $R_P$, $\alpha$ bằng bao nhiêu** để đạt mức bảo mật $M$ bits với chi phí ZK thấp nhất?

Bài này trả lời câu hỏi đó qua ba bước:

1. **Domain separation** — cách encode metadata vào state để tránh xung đột giữa các use case.
2. **Formal definition** — tuple tham số đầy đủ và ý nghĩa từng thành phần.
3. **Security claims** — công thức chọn $R_F$ và $R_P$ tối thiểu từ từng loại attack.

---

## Domain Separation (§2.3)

Một vấn đề thực tế khi dùng POSEIDON trong nhiều use case khác nhau (Merkle tree, commitment scheme, PRF, ...): nếu hai use case dùng cùng tham số $(n, t, R_F, R_P, \alpha)$ và cùng padding, output của chúng có thể **đụng độ** — tức là có input $x$ và $y$ từ hai use case khác nhau mà $\mathsf{POSEIDON}(x) = \mathsf{POSEIDON}(y)$.

**Giải pháp**: Encode thông tin về use case vào **capacity value ban đầu** trước khi bắt đầu absorb.

> [!note] Scheme 4.1 — Domain Separation cho POSEIDON
> **Type**: Encoding scheme cho capacity initialization  
> **Setting**: Sponge state $s \in \mathbb{F}_p^t$; capacity $c$ phần tử; rate $r$ phần tử; domain tag $D \in \mathbb{F}_p$
>
> **$\mathsf{Init}(D, r, o)$**
> - Input: domain tag $D$ (encode use case), rate $r$, output length $o$
> - Step 1: Tính capacity element $\kappa = 2^{64} \cdot M + 2^{24} \cdot o + 2^{16} \cdot r + D$  
>   (ghép các metadata vào một field element)
> - Step 2: $s \leftarrow (\underbrace{0, \ldots, 0}_{r \text{ elements}},\ \kappa,\ \underbrace{0, \ldots, 0}_{c-1 \text{ elements}})$
> - Output: Trạng thái khởi tạo $s \in \mathbb{F}_p^t$

Bằng cách này, mỗi cặp $(r, o, D)$ khác nhau tạo ra **IV (initial value) khác nhau**, đảm bảo rằng các hash function cho các use case khác nhau không bao giờ "gặp nhau" trong tính toán.

> [!tip] 💡 Agent note
> Trong triển khai thực tế (Filecoin, Zcash, Ethereum), domain tag thường được cố định theo convention: $D = 0$ cho compression function, $D = 1$ cho variable-length hash, v.v. Tham khảo [poseidon-hash.info](https://www.poseidon-hash.info/) cho bảng domain tags chuẩn.

---

## Định Nghĩa Formal (§3.1)

> [!note] Scheme 4.2 — POSEIDON Instance Definition (Definition 1)
> **Type**: Parameter specification  
> **Setting**: Prime $p \approx 2^n$; security level $M$
>
> Một **POSEIDON instance** được xác định bởi tuple:
>
> $$
> (n,\ t,\ R_F,\ R_P,\ \alpha)
> $$
>
> trong đó:
>
> - $n$: số bits của prime $p$ ($p \approx 2^n$, $n > 30$). Xác định trường $\mathbb{F}_p$.
> - $t \geq 2$: chiều rộng (width) của state. Xác định throughput ($r = t - c$) và capacity ($c$).
> - $R_F = 2R_f$: tổng số full rounds, với $R_f$ full rounds ở mỗi phía.
> - $R_P$: số partial rounds.
> - $\alpha \geq 3$: S-box exponent, $\gcd(\alpha, p-1) = 1$.
>
> **Ký hiệu ngắn**: $x^\alpha\text{-}\mathsf{POSEIDON}^\pi(n, t, R_F, R_P)$.
>
> **Ký hiệu thực dụng**: $\mathsf{POSEIDON}\text{-}M$ với $M$ là security level → instance có capacity $c$ sao cho $n \cdot c \geq 2M$.

---

## Security Claims (§3.2)

Paper đưa ra bốn claims tương ứng với bốn loại tấn công. Mỗi claim cho một **lower bound** trên $R_F$ hoặc $R_P$ cần thiết.

### Claim 1 — Sponge Security (preimage & collision)

> [!abstract] Claim 4.3 — Sponge Security
> POSEIDON-$M$ đạt $M$ bits bảo mật chống collision và preimage attack nếu:
>
> $$
> n \cdot c \geq 2M
> $$
>
> trong đó $c = t - r$ là capacity tính bằng số phần tử $\mathbb{F}_p$.

**Proof sketch**: Theo Sponge Security Theorem [BDPA08] (xem [[02-sponge-construction|Lesson 02]]): mọi tấn công với complexity $< 2^{c \cdot n / 2}$ phải đến từ tấn công vào permutation. Với $n \cdot c \geq 2M$, ta có $2^{c \cdot n / 2} \geq 2^M$. $\blacksquare$

### Claim 2 — Full Round Requirement (Statistical Security)

> [!abstract] Claim 4.4 — Minimum Full Rounds
> Để chống các tấn công thống kê (differential, linear), cần:
>
> $$
> R_F \geq 6
> $$

**Proof sketch**: Từ wide trail argument (xem [[03-hades-round-function|Lesson 03]] và [GLR+20]): với $R_F = 6$ full rounds và MDS matrix, số active S-boxes trong mọi differential trail vượt qua $3(t+1)$, khiến probability tổng $\ll 2^{-M}$ cho $M \leq 128$. Điều kiện $R_F \geq 6$ là threshold quan trọng — dưới 6, có thể xây dựng trail với probability không negligible. $\blacksquare$

> [!warning] Lý do chỉ dùng full rounds cho statistical bound
> Partial rounds chỉ có **một S-box** mỗi round → branch number của một partial round về mặt thống kê không đủ để áp dụng wide trail strategy. Do đó $R_P$ không tính vào bound này. Chỉ $R_F$ đảm bảo bảo mật thống kê.

### Claim 3 — Partial Round Requirement: Interpolation Attack

> [!abstract] Claim 4.5 — Minimum Partial Rounds (Interpolation)
> Để chống **interpolation attack** (xây dựng polynomial nội suy qua permutation), cần:
>
> $$
> R_P + R_F \geq \log_\alpha(2) \cdot (M + t)
> $$
>
> Hay tương đương, kết hợp với Claim 4.4 ($R_F \geq 6$):
>
> $$
> R_P \geq \left\lceil \log_\alpha(2) \cdot (M + t) \right\rceil - R_F
> $$

**Proof sketch**: Trong interpolation attack, adversary cố gắng biểu diễn $\mathsf{POSEIDON}^\pi$ như một multivariate polynomial và nội suy nó qua $2^M$ evaluation points. Degree của permutation sau $R$ rounds là $\alpha^R$ (do mỗi round tăng degree $\alpha$ lần, xem Claim 3.3 trong Lesson 03). Để nội suy một polynomial degree $d$ cần $d+1$ evaluation points. Yêu cầu $\alpha^{R_F + R_P} \geq 2^M \cdot t$ (đủ degree để làm nội suy khó) dẫn đến công thức trên. $\blacksquare$

> [!example] Ví dụ với $\alpha = 5$, $M = 128$, $t = 3$
> $$
> R_P \geq \lceil \log_5(2) \cdot (128 + 3) \rceil - 8 = \lceil 0.431 \cdot 131 \rceil - 8 = \lceil 56.5 \rceil - 8 = 57 - 8 = 49
> $$
>
> Paper dùng $R_P = 57$ (với security margin — xem §3.3).

### Claim 4 — Partial Round Requirement: Gröbner Basis Attack

> [!abstract] Claim 4.6 — Minimum Partial Rounds (Gröbner Basis / CICO)
> Để chống **Gröbner basis attack** trên bài toán CICO (Constrained-Input Constrained-Output), cần:
>
> $$
> R_P \geq \left\lceil 0.21 \cdot M + 1.26 \cdot t - R_F \right\rceil
> $$

**Proof sketch**: CICO problem: cho $x_2, y_1$, tìm $x_1, y_2$ sao cho $\mathsf{POSEIDON}^\pi(x_1 \| x_2) = y_1 \| y_2$. Giải CICO bằng Gröbner basis cần xây dựng hệ phương trình đa thức và tính degree of regularity $d_{\text{reg}}$. Complexity của F4/F5 algorithms là $\binom{n_v + d_{\text{reg}}}{d_{\text{reg}}}^{\omega}$ với $\omega \approx 2.37$. Phân tích số lượng biến $n_v$ và $d_{\text{reg}}$ theo $R_P, R_F, t$ cho ra bound trên. $\blacksquare$

> [!info] 🟡 CICO Problem
> CICO (Constrained-Input Constrained-Output) là bài toán tổng quát: cho trước một số input/output coordinates cố định, tìm phần còn lại. Đây là abstraction chung cho các preimage attacks trên sponge permutation. Một preimage attack trên sponge là một trường hợp đặc biệt của CICO với tất cả input coordinates của capacity cố định bằng 0.

---

## Security Margin (§3.3)

Để có thêm "đệm" an toàn trước cryptanalysis tương lai (đặc biệt các kỹ thuật Gröbner basis cải tiến), paper áp dụng **security margin** là **50%** trên tất cả $R_P$ đến từ các bounds đại số (Claims 4.5 và 4.6):

$$
R_P^{\text{final}} = \left\lceil 1.5 \cdot \max(R_P^{\text{interp}},\ R_P^{\text{gröbner}}) \right\rceil
$$

Trong khi đó, $R_F$ chỉ thêm **2 rounds** làm margin: $R_F^{\text{final}} = \max(6, R_F^{\text{stat}}) + 2$.

> [!tip] 💡 Agent note
> Security margin 50% cho $R_P$ là một lựa chọn thiết kế bảo thủ, được cân nhắc kỹ sau khi nhóm tác giả quan sát các tấn công Gröbner basis trên MiMC và Rescue. Các phiên bản sau của paper (2021, 2023) điều chỉnh margin khi có cryptanalysis mới — cụ thể sau kết quả của Bariant et al. [ToSC 2022] và Ashur et al. [2023]. Xem [[07-algebraic-attacks|Lesson 07]] để biết thêm.

---

## Bảng Tham Số Cụ Thể (§3.2, Table 2)

Với $\alpha = 5$ (curve BLS12-381/Ed25519, $p \equiv 1 \pmod 5$):

| Security level $M$ | Width $t$ | $R_F$ | $R_P$ | Merkle tree arity |
|-------------------|-----------|-------|-------|------------------|
| 128 bit | 3 | 8 | 57 | 2 (binary tree) |
| 128 bit | 5 | 8 | 60 | 4 (arity-4 tree) |
| 80 bit | 3 | 8 | 33 | 2 |
| 80 bit | 5 | 8 | 35 | 4 |

Với $\alpha = 3$ (curve BN254, $p \not\equiv 1 \pmod 3$):

| Security level $M$ | Width $t$ | $R_F$ | $R_P$ |
|-------------------|-----------|-------|-------|
| 128 bit | 3 | 8 | 84 |
| 128 bit | 5 | 8 | 84 |

> [!warning] Tại sao $R_P$ lớn hơn với $\alpha = 3$?
> $\log_3(2) > \log_5(2)$ → interpolation bound đòi hỏi nhiều partial rounds hơn khi degree tăng chậm hơn. Đây là trade-off: $\alpha = 3$ ít tốn kém hơn mỗi S-box nhưng cần nhiều round hơn; $\alpha = 5$ đắt hơn mỗi S-box nhưng ít round hơn.

---

## Round Constant Generation (Appendix A — tóm tắt)

Round constants và MDS matrices được sinh theo quy trình **NUMS (Nothing-Up-My-Sleeve)**:

1. Khởi tạo **Grain LFSR** (80-bit feedback shift register) với seed phụ thuộc vào instance parameters $(p, M, R_F, R_P, \alpha, t)$.
2. Chạy LFSR để sinh chuỗi pseudorandom bits.
3. Map các bits này thành phần tử $\mathbb{F}_p$ → round constants.
4. Dùng cách tương tự để sinh Cauchy matrix parameters → MDS matrix.

> [!note] Scheme 4.7 — Round Constant Generation (Grain LFSR)
> **Type**: Deterministic pseudorandom generation  
> **Setting**: Instance parameters $(p, M, R_F, R_P, \alpha, t)$; Grain LFSR với 80-bit state
>
> **$\mathsf{GenConstants}(p, M, R_F, R_P, \alpha, t)$**
> - Input: Instance parameters
> - Step 1: Tạo seed $= \mathsf{encode}(p, M, R_F, R_P, \alpha, t)$ — mỗi tham số được encode thành fixed-width bit string
> - Step 2: Khởi tạo Grain LFSR với seed này
> - Step 3: Với mỗi round constant cần thiết: lấy $n$ bits từ LFSR output; nếu giá trị $\geq p$, bỏ qua và lấy tiếp
> - Output: $t \cdot (R_F + R_P)$ round constants $\in \mathbb{F}_p$

Tính chất NUMS đảm bảo: ai cũng có thể verify rằng constants không được chọn có chủ ý để tạo backdoor, vì chúng phụ thuộc deterministically vào public parameters.

Chi tiết đầy đủ về Grain LFSR và sparse matrix optimization trong [[a0-implementation|A0. Implementation & Constants]].

---

## Summary

- **Domain separation**: encode $(r, o, D)$ vào capacity element ban đầu → tránh xung đột giữa các use case.
- **Parameter tuple** $(n, t, R_F, R_P, \alpha)$: xác định đầy đủ một POSEIDON instance.
- **Bốn security claims**:
  - Claim 1 (sponge): $n \cdot c \geq 2M$
  - Claim 2 (statistical): $R_F \geq 6$
  - Claim 3 (interpolation): $R_P \geq \lceil \log_\alpha(2) \cdot (M + t) \rceil - R_F$
  - Claim 4 (Gröbner): $R_P \geq \lceil 0.21M + 1.26t - R_F \rceil$
- **Security margin**: +50% trên $R_P$ đại số; +2 rounds trên $R_F$.
- **Round constants**: sinh từ Grain LFSR với seed = instance parameters (NUMS).

---

## References

- [GLR+20] Grassi et al. — *HADES Design Strategy*, EUROCRYPT 2020 (🟡 Integrate — algebraic security bounds)
- [BDPA08] Bertoni et al. — *Sponge Construction*, EUROCRYPT 2008 (🔴 Prerequisite — Claim 4.3)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §2.3, §3 (nguồn chính bài này)
