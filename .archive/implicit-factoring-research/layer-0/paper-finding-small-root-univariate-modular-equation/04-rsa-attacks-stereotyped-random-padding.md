---
title: "04. RSA Attacks: Stereotyped Messages & Random Padding"
type: attack
tags: [coppersmith, rsa, attack, lesson-04]
aliases: [Coppersmith RSA Attack, Stereotyped Messages Attack, Random Padding Attack]
source: "Finding a Small Root of a Univariate Modular Equation — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[01-problem-formulation|01. Problem Formulation & Strategy]]; [[03-lll-analysis-correctness|03. LLL Analysis & Correctness Proof]]; RSA encryption với số mũ nhỏ  
> 🔴 **Prerequisite references**: RSA encryption fundamentals  
> **Lesson type**: Attack  
> **Covers**: §4 RSA with Stereotyped Messages; §5 Application to RSA with Random Padding
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $e$ | RSA public exponent | $e$ (paper dùng $3$) |
> | $N$ | RSA modulus (composite) | $N$ |
> | $m$ | Plaintext message cần recover | $m$ |
> | $B$ | Phần đã biết của plaintext (§4) | $B = 2^k b$ |
> | $c$ | RSA ciphertext | $c$ |
> | $t$ | Padding value (§5) | $t$ (paper: $t_1, t_2$) |
> | $\Delta t$ | Hiệu padding $t_2 - t_1$ | $t$ (paper dùng $t$ cho hiệu) |
> | $\mathrm{Res}_m$ | Resultant theo biến $m$ | Resultant$_m$ |

---

## Motivation

Coppersmith Theorem 1 là một kết quả lý thuyết, nhưng giá trị thực tiễn của nó nằm ở hai tấn công RSA cụ thể trong §4–§5. Cả hai đều khai thác cùng một điểm yếu: **RSA với số mũ $e$ nhỏ (thường $e=3$) kết hợp với cấu trúc có thể dự đoán của plaintext** tạo ra phương trình đa thức nhỏ có thể giải được.

---

## Tấn Công 1 — Stereotyped Messages (§4)

### Context & Điều Kiện

> [!warning] Điều kiện tấn công — Stereotyped Messages
> - RSA exponent: $e = 3$
> - Attacker biết: toàn bộ ciphertext $c$ và phần "cố định" $B$ của plaintext (header, template, format string...)
> - Phần bí mật $m$ thoả $|m| < N^{1/3}$
> - Ciphertext được sinh bởi: $c \equiv (B + m)^3 \pmod{N}$

Trường hợp điển hình: plaintext gồm một phần header biết trước $B = 2^k b$ (ví dụ: ASCII representation của một template cố định) và phần bí mật $m$ chiếm $\leq 1/3$ số bit của $N$.

### Tấn Công Chính Thức

> [!note] Scheme 4.1 — Stereotyped Message Recovery
> **Type**: Cryptanalytic attack (plaintext recovery)  
> **Setting**: RSA với modulus $N$, exponent $e=3$; plaintext $= B + m$; ciphertext $c \equiv (B+m)^3 \pmod{N}$
>
> **$\mathsf{Attack}(N,\, e=3,\, c,\, B)$**
> - Input: $N$, $c$, phần đã biết $B$
> - Bước 1: Đặt đa thức $p(x) = (B + x)^3 - c \in \mathbb{Z}[x]$, bậc $k = 3$
> - Bước 2: Áp dụng Coppersmith Theorem 1 để tìm $x_0$ với $p(x_0) \equiv 0 \pmod{N}$ và $|x_0| < N^{1/3}$
> - Bước 3: Đặt $m = x_0$
> - Output: plaintext bí mật $m$

**Correctness**: $p(m) = (B+m)^3 - c \equiv c - c = 0 \pmod{N}$. Bound: $|m| < N^{1/3}$ theo giả thiết. $\square$

> [!tip] 💡 Agent note
> Khi $B = 0$ thì $p(x) = x^3 - c$ và tấn công quy về tính modular cube root $m \equiv c^{1/3} \pmod{N}$ — bài toán đã biết từ trước. Đóng góp của paper là xử lý $B \neq 0$ (nonzero known prefix/suffix), điều mà trước 1996 không giải được trong thời gian đa thức mà không cần factorization $N$.

### Phân Tích Độ Phức Tạp

| Tham số | Giá trị |
|---------|---------|
| Bậc đa thức $k$ | $3$ |
| Bound nghiệm | $|m| < N^{1/3}$ |
| Thời gian chạy | Poly($\log N$) — từ Theorem 1 |
| Điều kiện | $|m| < N^{1/3}$ — tức phần bí mật $< 1/3$ bits của $N$ |

Với RSA 1024-bit: $N^{1/3} \approx 2^{341}$, tức $m$ có thể dài tới 341 bit (≈ 42 bytes) và tấn công vẫn thành công.

---

## Tấn Công 2 — RSA với Random Padding (§5)

### Kết Quả Nền — Franklin–Reiter (trường hợp $t$ đã biết)

Paper xây dựng trên một kết quả của Franklin và Reiter [FR95]: nếu hai message liên quan tuyến tính $m' = m + t$ với $t$ **đã biết**, và ta có cả hai ciphertext:

$$
c \equiv m^3 \pmod{N}, \quad c' \equiv (m+t)^3 \pmod{N}
$$

thì có thể recover $m$ trực tiếp.

> [!info] 🟡 Franklin–Reiter Recovery (từ [FR95])
> Cho $c, c', t, N$ với $c \equiv m^3$, $c' \equiv (m+t)^3 \pmod{N}$ và $t$ đã biết. Khi đó:
>
> $$
> m \equiv \frac{t(c' + 2c - t^3)}{c' - c + 2t^3} \pmod{N}
> $$
>
> **Derivation**: $c' - c \equiv 3m^2 t + 3mt^2 + t^3 \pmod{N}$, suy ra $c' - c + 2t^3 \equiv 3mt^2 + 3m^2 t + 3t^3 = 3t(t^2 + mt + m^2)$ và $c' + 2c - t^3 \equiv 3m^2 t + 3mt^2 + 3m^3 \cdot 1$... Phép tính đại số tuyến tính cho công thức trên.
>
> *(theo [FR95]: Franklin, Reiter — A Linear Protocol Failure for RSA with Exponent Three, Crypto 95 rump session)*

### Context & Điều Kiện Tấn Công Chính

> [!warning] Điều kiện tấn công — Random Padding
> - RSA exponent: $e = 3$
> - Cùng một message $m$ được mã hoá **hai lần** với padding ngẫu nhiên khác nhau
> - Attacker biết: $c_1, c_2, N$ (nhưng không biết $m, t_1, t_2$)
> - Điều kiện thành công: $|t_2 - t_1| < N^{1/9}$

### Tấn Công Chính Thức

> [!note] Scheme 4.2 — Random Padding Attack (hai lần mã hoá)
> **Type**: Cryptanalytic attack (message recovery từ hai ciphertext)  
> **Setting**: RSA-3, modulus $N$; $c_1 \equiv (m+t_1)^3$, $c_2 \equiv (m+t_2)^3 \pmod{N}$; attacker biết $c_1, c_2, N$
>
> **$\mathsf{Attack}(N,\, c_1,\, c_2)$**
> - Input: $N$, $c_1$, $c_2$
> - Bước 1: Tính resultant để loại $m$:
>
> $$
> R(t) = \mathrm{Res}_m\!\bigl(m^3 - c_1,\ (m+t)^3 - c_2\bigr)
> $$
>
> - Bước 2: Khai triển — $R(t)$ là đa thức bậc **9** trong $t = t_2 - t_1$:
>
> $$
> R(t) = t^9 + (3c_1 - 3c_2)t^6 + (3c_1^2 + 21c_1 c_2 + 3c_2^2)t^3 + (c_1 - c_2)^3 \equiv 0 \pmod{N}
> $$
>
> - Bước 3: Áp dụng Coppersmith Theorem 1 với $k=9$: tìm $t_0$ với $R(t_0) \equiv 0 \pmod{N}$ và $|t_0| < N^{1/9}$
> - Bước 4: Đặt $t = t_0$. Áp dụng Franklin–Reiter (Scheme 4.1) với $t$ đã biết để recover $m$
> - Output: message $m$

**Correctness**: $R(t_2 - t_1) \equiv 0 \pmod{N}$ theo tính chất của resultant: $\gcd(m^3 - c_1, (m+t)^3 - c_2)$ có nghiệm chung $m$ khi $t = t_2 - t_1$. $\square$

### Tính Resultant Tường Minh

Đặt $f(m) = m^3 - c_1$ và $g(m) = (m+t)^3 - c_2 = m^3 + 3tm^2 + 3t^2 m + t^3 - c_2$. Resultant theo $m$:

$$
\mathrm{Res}_m(f, g) = t^9 + (3c_1 - 3c_2)t^6 + (3c_1^2 + 21c_1 c_2 + 3c_2^2)t^3 + (c_1-c_2)^3 \equiv 0 \pmod{N}
$$

Đây là đa thức **bậc 9** (không phải 27) vì nhiều term triệt tiêu nhau do cấu trúc đặc biệt của cubic.

### Vị Trí Padding — Không Phải Chỉ Low Bits

> [!tip] 💡 Agent note
> Tấn công hoạt động bất kể padding nằm ở đâu: high-order bits, low-order bits, hay giữa message. Nếu padding nằm ở high bits, chỉ cần chia ciphertext cho luỹ thừa $2$ thích hợp để "dịch" padding về low bits trước khi áp dụng. Điều này cho thấy không có vị trí padding nào "an toàn" nếu padding đủ ngắn.

### Phân Tích Độ Phức Tạp và Giới Hạn

| Tham số | Giá trị |
|---------|---------|
| Bậc resultant $k$ | $9$ |
| Bound padding | $|t_2 - t_1| < N^{1/9}$ |
| Thời gian chạy | Poly($\log N$) |
| Với RSA-1024 | Padding $< N^{1/9} \approx 2^{113.7}$, tức **≤ 113 bit** padding |

> [!warning] Cảnh báo: 113 bit padding hoàn toàn thực tế
> Với RSA-1024 và $e=3$, tấn công chịu được tới ~113 bit random padding. Nhiều giao thức padding thực tế (bao gồm một số implementation sơ sài trước OAEP) dùng padding ngắn hơn thế này, đặc biệt trong các context mà cùng key/exponent được dùng để mã hoá một message nhiều lần với timestamp hoặc session ID khác nhau.

---

## Các Biện Pháp Phòng Thủ (§5)

Coppersmith đề xuất các biện pháp để tránh tấn công, theo thứ tự tăng dần hiệu quả:

> [!note] Scheme 4.3 — Phân tích các biện pháp phòng thủ
>
> **(1) Chia padding thành nhiều block nhỏ**  
> Padding $t$ và $u$ ở hai vị trí khác nhau: $c = (2^l t + 2^k m + u)^3$. Resultant của hai encryption sẽ là phương trình một ẩn hai biến $t, u$ — thuộc bài toán multivariate (§3, Lesson 05). Tấn công vẫn có thể hoạt động với điều kiện $|t| \cdot |u| < N^{1/9}$, nhưng không còn đảm bảo.
>
> **(2) Rải padding xuyên suốt message**  
> Ví dụ: 2 bit random padding trong mỗi byte. Phá vỡ cấu trúc đa thức đủ để tấn công không còn áp dụng được. **Hiệu quả cao nhất trong danh sách này.**
>
> **(3) Tăng lượng padding**  
> Với $e=3$, nếu padding $> 1/6$ chiều dài $N$, tấn công nhiều encryption (§6) cũng không còn hiệu quả. Tuy nhiên làm giảm hiệu suất encryption.
>
> **(4) Padding deterministic theo message (hash-based)**  
> Ví dụ: padding $= H(m)$. Hai encryption cùng message sẽ cho cùng ciphertext, loại bỏ thông tin. **Cảnh báo**: nếu message bao gồm timestamp cạnh padding, attacker có thể gộp timestamp và padding thành một biến duy nhất $t$ và tấn công như cũ.
>
> **(5) Dùng exponent lớn hơn**  
> Với exponent $e$, attack chịu padding $\leq N^{1/e^2}$. Với $e=7$: bound là $N^{1/49} \approx 2^{20.9}$ cho RSA-1024 — quá nhỏ để practical, tốt hơn nên exhaustive search. **Khuyến nghị chuẩn hiện đại: OAEP (RSA-OAEP) thay vì custom padding.**

---

## Summary

- **Stereotyped messages**: biết $B$ và $c = (B+m)^3$, đặt $p(x) = (B+x)^3 - c$, dùng Coppersmith tìm $m$ nếu $|m| < N^{1/3}$.
- **Random padding (2 encryptions)**: tính resultant → đa thức bậc 9 trong $\Delta t$ → Coppersmith với bound $|\Delta t| < N^{1/9}$ → Franklin–Reiter recovery.
- **Ngưỡng an toàn thực tế**: RSA-1024 với $e=3$ chịu được ≤ 113 bit padding — quá thấp cho nhiều giao thức.
- **Phòng thủ hiệu quả nhất**: rải padding xuyên suốt message (option 2) hoặc dùng OAEP.

---

## References

- [Cop96] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996
- [FR95] Franklin, Reiter — *A Linear Protocol Failure for RSA with Exponent Three*, Crypto 95 rump session (🟡 Integrated above)
- [CFPR96] Coppersmith, Franklin, Patarin, Reiter — *Low Exponent RSA with Related Messages*, EUROCRYPT 1996 (⚪ companion paper)
