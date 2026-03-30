---
title: "05. Attack: Random Padding & Two-Message RSA"
type: attack
tags: [coppersmith, rsa, random-padding, franklin-reiter, resultant, lesson-05]
aliases: [Random Padding Attack, Two-Message RSA Attack]
source: "Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities — Don Coppersmith, 1997"
created: 2026-03-26
---

> **Prerequisites**: [[03-determinant-analysis-solution|03. Determinant Analysis & Solution]] (Theorem 1); [[04-stereotyped-messages-attack|04. Stereotyped Messages Attack]] (cùng framework)  
> 🔴 **Prerequisite references**: [RSA78] RSA; Lý thuyết resultant đa thức  
> **Lesson type**: Attack  
> **Covers**: §8 (Application to RSA with Random Padding: Two Messages), §9 (RSA Signatures)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $M$ | Message gốc (chưa biết) | $M$ (paper dùng $m$ cho plaintext đã pad) |
> | $m$ | Plaintext sau padding: $m = 2^k M + R$ | $m$ |
> | $R, R'$ | Hai random padding values (chưa biết) | $r_1, r_2$ |
> | $r$ | Hiệu hai padding: $r = R' - R = m' - m$ | $r$ |
> | $c, c'$ | Hai ciphertext tương ứng | $c, c'$ |
> | $\text{Res}_m(f,g)$ | Resultant của $f$ và $g$ theo biến $m$ | $\text{Resultant}_m$ |

---

## 1. Bối cảnh và Điều kiện tấn công

### 1.1 Giao thức bị tấn công

**Kịch bản**: Một giao thức mã hóa thực hiện **random padding** trước khi RSA encrypt với $e = 3$:

$$
m = 2^k M + R, \quad c = m^3 \bmod N
$$

với $M$ là message thực, $R$ là $k$-bit random pad. Mục đích của padding: ngăn attacker biết $m$ trực tiếp.

Alice gửi **cùng message $M$** hai lần với hai random pad khác nhau:

$$
c = (2^k M + R)^3 \bmod N
$$

$$
c' = (2^k M + R')^3 = (m + r)^3 \bmod N, \quad r = R' - R
$$

Attacker nhìn thấy $c, c', N$ — không biết $M$, $R$, $R'$.

> [!warning] Điều kiện khai thác
> Tấn công thành công khi:
> 1. $e = 3$; cùng một modulus $N$
> 2. Cùng message $M$ được encrypt **ít nhất 2 lần** với random padding
> 3. **Padding đủ ngắn**: $\lvert r\rvert = \lvert R' - R\rvert < N^{1/9}$
>
> Với $N$ 1024-bit: $N^{1/9} \approx 2^{113}$ → tấn công chịu được **113 bit padding**. Thực tế, $1/9 \times 1024 \approx 113$ bit — đây là ngưỡng an toàn mà protocol designer phải vượt qua.

### 1.2 Tại sao đây khác với Håstad

> [!info] 🟡 Håstad Broadcast Attack (từ [Has88])
> Håstad [Has88] tấn công kịch bản: cùng message $M$ được gửi đến **$e$ người nhận khác nhau**, mỗi người có modulus $N_i$ riêng. Dùng CRT ghép $e$ phương trình $c_i \equiv M^e \pmod{N_i}$ → tìm $M^e$ trên $\mathbb{Z}$ → lấy root nguyên.
>
> **Điểm khác biệt then chốt**: Håstad dùng $e$ moduli khác nhau. Coppersmith §8 dùng **một modulus duy nhất** — mạnh hơn đáng kể về điều kiện thông tin.
>
> *(theo [Has88]: Håstad — Solving simultaneous modular equations of low degree, SIAM J. Comput. 17, 1988)*

---

## 2. Bước 1 — Khử $m$ bằng Resultant

Ta có hai phương trình:

$$
f(m) = m^3 - c \equiv 0 \pmod{N}
$$

$$
g(m) = (m + r)^3 - c' \equiv 0 \pmod{N}
$$

Cả hai đều có $m$ là nghiệm. Để khử $m$, tính **resultant** theo $m$:

$$
Q(r) = \text{Res}_m\!\left(m^3 - c,\; (m+r)^3 - c'\right) \pmod{N}
$$

Resultant của hai đa thức $f$ và $g$ theo một biến bằng $0$ khi và chỉ khi $f$ và $g$ có common root. Vì $m$ là root chung, $Q(r) = 0$.

**Tính tường minh** (paper §8):

$$
\begin{aligned}
Q(r) &= r^9 + (3c - 3c')r^6 + (3c^2 + 21cc' + 3(c')^2)r^3 + (c - c')^3 \\
&\equiv 0 \pmod{N}
\end{aligned}
$$

Đây là **đa thức bậc 9 trong $r$** modulo $N$.

---

## 3. Bước 2 — Tìm $r$ bằng Theorem 1

$Q(r) \equiv 0 \pmod{N}$ với $\lvert r\rvert < N^{1/9}$ → bậc $\delta = 9$, cận $X = N^{1/9}$.

Áp dụng Theorem 1:

> [!note] Scheme 5.1 — Two-Message Padding Attack
> **Type**: Chosen-ciphertext-free attack (ciphertext-only, 2 ciphertexts)  
> **Setting**: RSA, $e = 3$, $N$ public, $c = m^3$, $c' = (m+r)^3$, $\lvert r\rvert < N^{1/9}$
>
> **$\mathsf{TwoMessageAttack}(N,\, c,\, c')$**
> - Input: $N$, hai ciphertext $c$, $c'$ (cùng message, khác padding)
> - **Bước 1**: Tính các hệ số $Q(r) = r^9 + \alpha_6 r^6 + \alpha_3 r^3 + \alpha_0 \bmod N$
>   - $\alpha_6 = 3(c - c')$
>   - $\alpha_3 = 3c^2 + 21cc' + 3(c')^2$
>   - $\alpha_0 = (c - c')^3$
> - **Bước 2**: Áp dụng $\mathsf{CoppersmithUnivariate}(Q,\, N,\, \delta=9,\, \varepsilon)$ → tìm $r$
> - **Bước 3**: Dùng kết quả Franklin-Reiter: từ $r$ đã biết, recover $m$
> - **Bước 4**: Strip padding: $M = (m - R) / 2^k$ (thử các giá trị $R$ nhỏ nếu cần)
> - Output: Message gốc $M$

---

## 4. Bước 3 — Recover $m$ từ $r$: Kết quả Franklin-Reiter

Sau khi tìm được $r = m' - m$, ta biết quan hệ affine giữa $m$ và $m'$: $m' = m + r$ với $r$ đã biết. Lúc này áp dụng kết quả của Franklin và Reiter:

> [!info] 🟡 Franklin-Reiter Related Message Attack (từ [FR95])
> **Điều kiện**: Biết $c = m^3 \bmod N$, $c' = (m+r)^3 \bmod N$ với $r$ đã biết.
>
> **Công thức recover $m$** (Franklin-Reiter [FR95]):
>
> $$
> m = \frac{r(c' + 2c - r^3)}{c' - c + 2r^3} \bmod N
> $$
>
> **Dẫn xuất**: Expand $c' = m^3 + 3m^2 r + 3mr^2 + r^3$. Khi đó $c' - c = 3m^2r + 3mr^2 + r^3$. Giải hệ hai phương trình tuyến tính theo $m^2$ và $m$ (sau khi biết $r$) cho công thức trên.
>
> *(theo [FR95]: Franklin, Reiter — A linear protocol failure for RSA with exponent three, Crypto '95 rump session)*

---

## 5. Phân tích: Tại sao $N^{1/9}$?

Chuỗi reduction:
- Hai ciphertext → resultant bậc $3 \times 3 = 9$ trong $r$
- Để Theorem 1 áp dụng với $\delta = 9$: cần $\lvert r\rvert < N^{1/9}$

**Hệ quả thực tiễn** (paper §8): Với RSA 1024-bit và $e = 3$:

$$
N^{1/9} \approx 2^{113.7}
$$

"For a 1024-bit RSA key, this attack tolerates 100 bits of padding fairly easily."

Vậy padding **nhỏ hơn 113 bit** là **không an toàn** khi dùng $e = 3$.

---

## 6. Biện pháp phòng chống

| Biện pháp | Hiệu quả | Lý do |
|-----------|---------|-------|
| **OAEP** [BR94] | ✅ Hoàn toàn | Padding non-linear, phá cấu trúc resultant |
| **Spread padding qua nhiều block** | ⚠️ Phức tạp hơn | Cần bivariate attack (§12); XY < $N^{1/9}$ |
| **Padding ≥ $\frac{1}{9}N$ bits** | ✅ Nếu thực hiện đúng | Vượt ngưỡng $N^{1/9}$ |
| **Tăng $e$** | ✅ Với $e \geq 7$ | Padding phải $< N^{1/49}$ ≈ 20 bit → dễ exhaust |
| **Không dùng $e = 3$** | ✅ | $e = 65537$ là chuẩn |

> [!tip] 💡 Agent note
> Paper §8 mention thêm Appendix 1 (Lesson 09): nếu có $k+1 \geq 3$ encryptions thay vì 2, tấn công chịu được padding lớn hơn (nhưng vẫn $< \frac{1}{6}N$). Với 14 encryptions ($k = 13$), chịu được ~150-bit padding trên 1024-bit RSA.

---

## 7. §9 — RSA Signatures với Exponent Nhỏ: An Toàn

Paper dành §9 để khẳng định rõ: các kỹ thuật trên **không** phá RSA signature với small validating exponent.

> [!abstract] Nhận xét §9 — Signatures an toàn
> Biết các signature $m_i^{1/3} \bmod N$ cho $m_0, m_1, \ldots, m_{99}$ **không giúp** tính signature $m_{100}^{1/3} \bmod N$.

**Tại sao analogy cube root trên $\mathbb{R}$ không áp dụng**:

Trên $\mathbb{R}$: $10^{1/3}, 11^{1/3}, 12^{1/3}, 13^{1/3}$ không giúp tính $14^{1/3}$ vì 5 giá trị này **độc lập tuyến tính** trên $\mathbb{Q}$.

Trên $\mathbb{Z}$: Ta có quan hệ tuyến tính $10^3 - 4 \times 11^3 + 6 \times 12^3 - 4 \times 13^3 + 14^3 = 0$ → biết lập phương của 4 số liền tiếp giúp tính lập phương của số thứ 5. Nhưng đây là về **giá trị cube**, không về **cube root modular**.

**Điểm mấu chốt**: Tấn công §7 và §8 dùng cấu trúc của **ciphertext** (giá trị cube); không dùng cấu trúc của signature (cube root). Hai bài toán này đảo chiều nhau và không có reduction tương tự.

---

## Summary

- **§8**: Hai RSA-e3 ciphertext của cùng message với padding khác nhau $r = m' - m$ → resultant 9 bậc trong $r$ → Theorem 1 với $\delta = 9$ → recover $r$ nếu $\lvert r\rvert < N^{1/9}$ → Franklin-Reiter recover $m$.
- Ngưỡng an toàn: padding $\geq N^{1/9}$ bit; với 1024-bit RSA là ~113 bit.
- **§9**: RSA signatures với small exponent **không** bị tấn công bởi các kỹ thuật này.
- Mitigation chính: OAEP, exponent lớn.

---

## References

- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, §8–§9
- [FR95] Franklin, Reiter — *A linear protocol failure for RSA with exponent three*, Crypto '95 rump session (🟡 Integrated — Bước 3: recover $m$ từ $r$)
- [Has88] Håstad — *Solving simultaneous modular equations of low degree*, SIAM J. Comput. 17, 1988 (🟡 Integrated — đối chiếu tấn công multi-moduli)
- [BR94] Bellare, Rogaway — *Optimal asymmetric encryption*, EUROCRYPT '94 (⚪ mitigation)
- [RSA78] Rivest, Shamir, Adleman — RSA (🔴 Prerequisite)
