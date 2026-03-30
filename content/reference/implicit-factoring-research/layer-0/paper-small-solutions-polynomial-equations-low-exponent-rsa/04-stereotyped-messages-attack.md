---
title: "04. Attack: Stereotyped Messages (Partial Known Plaintext)"
type: attack
tags: [coppersmith, rsa, stereotyped-messages, low-exponent, lesson-04]
aliases: [Stereotyped Message Attack, Partial Plaintext Attack]
source: "Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities — Don Coppersmith, 1997"
created: 2026-03-26
---

> **Prerequisites**: [[03-determinant-analysis-solution|03. Determinant Analysis & Solution]] (Theorem 1 — tìm nghiệm nhỏ univariate); RSA encryption cơ bản  
> 🔴 **Prerequisite references**: [RSA78] Rivest, Shamir, Adleman — RSA  
> **Lesson type**: Attack  
> **Covers**: §7 (Application: Stereotyped Messages) — toàn bộ
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $e$ | RSA public exponent (thường = 3) | $e$ (ngầm định) |
> | $B$ | Phần plaintext **đã biết** (known piece) | $B$ |
> | $x_0$ | Phần plaintext **chưa biết** (unknown piece) | $x$ |
> | $m$ | Plaintext đầy đủ: $m = B + x_0$ | $m$ |
> | $c$ | Ciphertext: $c = m^e \bmod N$ | $c$ |
> | $k$ | Bit-shift: $B = 2^k b$ nếu phần biết ở high bits | $k$ |

---

## 1. Bối cảnh và Điều kiện tấn công

### 1.1 Mô hình mối đe dọa

**Kịch bản**: Alice dùng RSA với exponent nhỏ $e = 3$ để mã hóa một message có cấu trúc cố định — điển hình trong các giao thức cũ không có proper padding:

> `"October 19, 1995. The secret key for the day is [SECRET]."`

Attacker biết:
- Modulus $N$, exponent $e = 3$
- Ciphertext $c$
- **Phần lớn** của plaintext (header template $B$)
- Chỉ **không biết** phần ngắn $x_0$ (secret key thực sự)

**Câu hỏi**: Attacker có thể recover $x_0$ không?

### 1.2 Điều kiện để tấn công thành công

> [!warning] Điều kiện khai thác
> Tấn công thành công khi:
> 1. $e = 3$ (hoặc exponent nhỏ bất kỳ $e$)
> 2. Plaintext có dạng $m = B + x_0$ với $B$ đã biết
> 3. Phần ẩn thỏa: $\lvert x_0 \rvert < N^{1/e}$ — tức là $x_0$ chiếm **ít hơn $1/e$ số bit** của $N$
>
> Ví dụ: $e = 3$, $N$ 1024-bit → cần $\lvert x_0\rvert < N^{1/3}$, tức $x_0$ dưới ~341 bit. Nếu $N$ là 1024-bit và $x_0$ là 250-bit, tấn công thành công.

---

## 2. Cơ chế tấn công

### 2.1 Đưa về bài toán nghiệm nhỏ

Từ phương trình RSA:

$$
c \equiv m^3 \equiv (B + x_0)^3 \pmod{N}
$$

Định nghĩa đa thức:

$$
p(x) = (B + x)^3 - c
$$

Khi đó $x_0$ là **nghiệm của $p(x)$ modulo $N$**:

$$
p(x_0) = (B + x_0)^3 - c \equiv m^3 - c \equiv 0 \pmod{N}
$$

Đây chính xác là dạng bài toán của Theorem 1 với $\delta = 3$.

### 2.2 Áp dụng Theorem 1

> [!note] Scheme 4.1 — Stereotyped Message Recovery
> **Type**: Chosen-ciphertext-free attack (ciphertext-only)  
> **Setting**: RSA với $e = 3$, $N$ public, $B$ đã biết, $c$ đã biết
>
> **$\mathsf{StereoAttack}(N,\, e,\, B,\, c)$**
> - Input: $N$, $e = 3$, known piece $B = 2^k b$, ciphertext $c$
> - **Bước 1**: Xây đa thức $p(x) = (B + x)^3 - c \bmod N$ — bậc $\delta = 3$
> - **Bước 2**: Áp dụng $\mathsf{CoppersmithUnivariate}(p,\, N,\, \delta=3,\, \varepsilon)$ (Lesson 03)
> - **Bước 3**: Thuật toán trả về tập nghiệm; kiểm tra mỗi $x_*$: có $p(x_*) \equiv 0 \pmod{N}$?
> - Output: $x_0$ — phần ẩn của plaintext

**Kết quả**: Recover $x_0$ trong thời gian polynomial miễn là $\lvert x_0\rvert < N^{1/3}$.

### 2.3 Trường hợp hiển nhiên — và tại sao $B \neq 0$ mới thú vị

> [!example] Trường hợp $B = 0$ (trivial)
> Nếu plaintext chỉ là $x_0 < N^{1/3}$, thì $c = x_0^3$ là lập phương thực sự (không wrap modulo), nên attacker chỉ cần tính $x_0 = \lfloor c^{1/3} \rfloor$. Không cần Coppersmith.

Điều làm paper này có giá trị: tấn công hoạt động cho **$B$ tùy ý, không bằng $0$**. Khi $B \neq 0$, đa thức $(B+x)^3 - c$ không còn đơn giản và cube root thông thường không work. Đây là đóng góp thực sự của §7.

---

## 3. Phân tích và mở rộng

### 3.1 Vị trí của phần ẩn không quan trọng

Tấn công work bất kể $x_0$ nằm ở:
- **Low-order bits** (kịch bản cơ bản): $m = B + x_0$
- **High-order bits**: $m = 2^k x_0 + B$. Chỉ cần nhân $x_0$ với hằng số $2^k$ đã biết → substitute $x \leftarrow 2^k x$ vào đa thức

### 3.2 Hai ẩn không biết — hai từ trong message

> [!example] Ví dụ hai ẩn: "TODAY'S KEY IS [swordfish] AND PASSWORD IS [joe]"
> Plaintext: $m = B + 2^k x + y$ với $x = \texttt{"swordfish"}$, $y = \texttt{"joe"}$, $B$ đã biết.
>
> Phương trình: $p(x,y) = c - (B + 2^k x + y)^3 \equiv 0 \pmod{N}$
>
> Đây là đa thức **hai biến** — cần phiên bản bivariate modular của Coppersmith (§12, Lesson 08). Với $XY < N^{1/3 - \varepsilon}$ thì tấn công thành công.

### 3.3 Cảnh báo thực tiễn

> [!warning] Khi nào tấn công không thành công
> Nếu $x_0$ dài **250 bit** và $N$ chỉ **512 bit**, thì $x_0 > N^{1/3}$ → tấn công thất bại.  
> Nhưng nếu upgrade lên $N$ **1024-bit** trong khi giữ $x_0$ 250-bit, thì $x_0 < N^{1/3}$ → **vulnerable**.
>
> Hệ quả: tăng kích thước key không luôn làm tăng bảo mật nếu message structure không thay đổi!

---

## 4. Mitigation

| Biện pháp | Cơ chế bảo vệ |
|-----------|---------------|
| **Dùng OAEP padding** [BR94] | Randomize toàn bộ message trước khi mã hóa; phá vỡ cấu trúc $B + x_0$ |
| **Tăng $e$** | Với $e \geq 17$, phần ẩn cần $< N^{1/17}$ — thực tế không đủ nhỏ |
| **Không dùng exponent nhỏ** | $e = 65537$ là chuẩn hiện đại |
| **Message randomization** | Bất kỳ biến đổi non-linear nào trên plaintext trước khi raise lên $e$ |

---

## 5. So sánh với các tấn công RSA exponent nhỏ khác

| Tấn công | Điều kiện | Moduli | Công cụ |
|---------|-----------|--------|---------|
| **Håstad broadcast** [Has88] | Cùng $m$, $e$ moduli khác nhau | $e$ moduli khác nhau | CRT + root |
| **Franklin-Reiter** [FR95] | Hai message quan hệ affine, cùng modulus | 1 | Resultant + GCD |
| **Coppersmith stereotyped** (§7) | $m = B + x_0$, $\lvert x_0\rvert < N^{1/e}$ | 1 | LLL lattice |

Ba tấn công hoàn toàn khác nhau về mô hình — Coppersmith §7 mạnh nhất về điều kiện thông tin (chỉ cần 1 ciphertext, 1 modulus).

---

## Summary

- RSA-e3 với message dạng $m = B + x_0$ ($B$ biết, $\lvert x_0\rvert < N^{1/3}$) → xây $p(x) = (B+x)^3 - c$, áp dụng Theorem 1 → recover $x_0$ trong poly time.
- Tấn công work bất kể $x_0$ ở low bits hay high bits.
- **Hệ quả quan trọng**: tăng key size có thể làm message trở nên vulnerable hơn nếu phần ẩn giữ nguyên.
- Mitigation: OAEP, exponent lớn, message randomization.

---

## References

- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, §7
- [BR94] Bellare, Rogaway — *Optimal asymmetric encryption*, EUROCRYPT '94 (⚪ mitigation)
- [RSA78] Rivest, Shamir, Adleman — RSA (🔴 Prerequisite)
