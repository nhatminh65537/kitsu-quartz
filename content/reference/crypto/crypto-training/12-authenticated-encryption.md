---
title: "12. Authenticated Encryption"
type: scheme
tags: [crypto, aead, gcm, authenticated-encryption, nonce-misuse, forbidden-attack]
aliases: [Authenticated Encryption, AES-GCM, Forbidden Attack, AEAD, Nonce Reuse]
created: 2026-04-17
---

> **Prerequisites**: [[10-block-ciphers-modes|10 — Block Ciphers & Modes]] (CTR mode, GCM overview), [[11-block-cipher-attacks|11 — Block Cipher Attacks]] (padding oracle, MAC-then-Encrypt)  
> **Lesson type**: Scheme + Attack
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_K(X)$ | AES encrypt block $X$ với key $K$ |
> | $N$ | Nonce (number used once), 96 bits trong GCM chuẩn |
> | $J_0, J_i$ | Counter blocks: $J_0 = N \| 0^{31} \| 1$, $J_i = \text{inc}_{32}(J_{i-1})$ |
> | $H$ | GHASH authentication key: $H = E_K(0^{128})$ |
> | $A$ | Associated Data — được xác thực nhưng không mã hóa |
> | $\oplus$ | XOR bitwise |
> | $\otimes$ | Nhân trong $\text{GF}(2^{128})$ |
> | $\text{GHASH}_H$ | Polynomial hash với key $H$ trên $\text{GF}(2^{128})$ |

---

## 1. Vấn đề: Confidentiality thôi là chưa đủ

Bài học từ L08 đặt ra một câu hỏi căn bản: nếu chúng ta dùng CBC và thêm MAC để chống bit-flipping, thì nên **MAC cái gì** và theo **thứ tự nào**?

Câu trả lời đã được Shannon định nghĩa rõ từ lý thuyết, và Bellare & Namprempre (2000) chứng minh bằng reduction: chỉ có **Encrypt-then-MAC** mới đảm bảo IND-CCA2.

Nhưng implement đúng Encrypt-then-MAC với hai key riêng biệt ($K_{\text{enc}}$, $K_{\text{mac}}$), quản lý nonce, đảm bảo thứ tự — rất dễ mắc lỗi. Đó là lý do **AEAD** (Authenticated Encryption with Associated Data) ra đời: một primitive duy nhất cung cấp **cả confidentiality lẫn authenticity** trong một API.

> [!note] Định nghĩa — Authenticated Encryption with Associated Data (AEAD)
> AEAD là một primitive với:
>
> - **$\mathsf{Enc}(K, N, A, M) \to (C, T)$**: Encrypt plaintext $M$ với key $K$, nonce $N$, associated data $A$. Output ciphertext $C$ và authentication tag $T$.
> - **$\mathsf{Dec}(K, N, A, C, T) \to M$ hoặc $\perp$**: Decrypt nếu tag hợp lệ, ngược lại trả $\perp$ (reject).
>
> Tính chất bắt buộc:
> - **Confidentiality**: $C$ không rò rỉ thông tin về $M$ (IND-CPA của phần mã hóa)
> - **Integrity**: Không thể forge $(C, T)$ hợp lệ mà không biết $K$ (EUF-CMA của phần MAC)
> - **Combined**: IND-CCA2 cho toàn bộ scheme

---

## 2. Các cách compose Encryption và MAC

Trước khi có AEAD chuẩn, người ta "tự compose" AES-CBC với HMAC. Có ba cách — chỉ một cách an toàn.

![[assets/img-09-etm-comparison.png]]
*Encrypt-then-MAC là cách duy nhất đạt IND-CCA2. MAC-then-Encrypt dẫn đến padding oracle.*

> [!abstract] Theorem — Bellare & Namprempre 2000
> Trong ba composition (EtM, MtE, E&M):
> - **Encrypt-then-MAC (EtM)**: Đạt IND-CCA2 nếu encryption đạt IND-CPA và MAC đạt EUF-CMA.
> - **MAC-then-Encrypt (MtE)**: Không đạt IND-CCA2 nói chung.
> - **Encrypt-and-MAC (E&M)**: Không đạt IND-CCA2 vì MAC rò rỉ thông tin về $M$.

**Proof sketch cho EtM.** Adversary gửi $q$ ciphertext queries đến decryption oracle.  
Với EtM: $\mathsf{Dec}$ kiểm tra $T = \mathsf{MAC}(K_{\text{mac}}, C)$ **trước** → nếu fail, trả $\perp$ ngay, không decrypt.  
Bất kỳ ciphertext forge nào phải qua MAC verification → EUF-CMA của MAC đảm bảo adversary không thể tạo $(C', T')$ hợp lệ với xác suất đáng kể. $\square$

**Tại sao MtE fail?** MtE decrypt trước rồi mới verify MAC → attacker có thể khai thác padding oracle (L08) để query decryption oracle trước khi MAC check. Đây chính xác là cơ chế của Lucky13 và POODLE.

---

## 3. AES-GCM — Galois/Counter Mode

GCM là AEAD được dùng rộng rãi nhất trong TLS 1.3, QUIC, SSH, và hầu hết hệ thống hiện đại. Nó kết hợp **CTR mode** (cho confidentiality) với **GHASH** (cho authenticity).

### 3.1. Cơ chế hoạt động

> [!note] Scheme — AES-GCM
> **Setting**: Block cipher $E_K: \{0,1\}^{128} \to \{0,1\}^{128}$ (AES). Nonce $N$ thường 96 bits.
>
> **$\mathsf{KeySetup}(K)$**
> - $H = E_K(0^{128})$ — GHASH authentication key (128-bit)
>
> **$\mathsf{Enc}(K, N, A, M)$**
> - $J_0 = N \| 0^{31} \| 1$ (nếu $|N| = 96$) hoặc $J_0 = \text{GHASH}_H(N)$ (nếu nonce khác 96 bits)
> - $C_i = M_i \oplus E_K(J_i)$ với $J_i = \text{inc}_{32}(J_{i-1})$ (CTR mode từ $J_1$)
> - $S = \text{GHASH}_H(A, C)$
> - $T = S \oplus E_K(J_0)$
> - Output: $(C, T)$
>
> **$\mathsf{Dec}(K, N, A, C, T)$**
> - Tính lại $T' = \text{GHASH}_H(A, C) \oplus E_K(J_0)$
> - Nếu $T' \neq T$: trả $\perp$ (reject)
> - Ngược lại: decrypt CTR để recover $M$

### 3.2. GHASH — Polynomial Hash trên GF(2¹²⁸)

GHASH là trung tâm của GCM authentication. Về bản chất, nó đánh giá một polynomial tại $H$ trong trường $\text{GF}(2^{128})$.

> [!note] Định nghĩa GHASH
> Với associated data $A = A_1 \| \ldots \| A_m$ và ciphertext $C = C_1 \| \ldots \| C_n$ (mỗi block 128 bits):
>
> $$
> \text{GHASH}_H(A, C) = A_1 \cdot H^{m+n+1} + \cdots + A_m \cdot H^{n+2} + C_1 \cdot H^{n+1} + \cdots + C_n \cdot H^2 + L \cdot H
> $$
>
> Trong đó $L = \text{len}(A) \| \text{len}(C)$ (64-bit big-endian mỗi phần), và phép cộng/nhân là trong $\text{GF}(2^{128})$ với irreducible polynomial $f = 1 + x + x^2 + x^7 + x^{128}$.

Viết compact hơn: định nghĩa polynomial $g$ chứa các coefficients đã biết:

$$
g(X) = A_1 X^{m+n+1} + \cdots + A_m X^{n+2} + C_1 X^{n+1} + \cdots + C_n X^2 + L \cdot X
$$

Thì $\text{GHASH}_H(A, C) = g(H)$ và tag là:

$$T = g(H) \oplus S, \qquad S = E_K(J_0)$$

Trong đó $S = E_K(J_0)$ là hằng số bí mật phụ thuộc nonce và key. Lưu ý $g$ **không** chứa $S$ như constant term — $S$ được XOR vào bên ngoài sau khi tính GHASH.

> [!info] Tại sao dùng GF(2¹²⁸)?
> Phép cộng trong $\text{GF}(2^{128})$ = XOR. Phép nhân là polynomial multiplication mod $f$. Hardware có instruction PCLMULQDQ để thực hiện Galois multiplication cực nhanh. Đây là lý do GCM nhanh hơn đáng kể so với các AEAD khác trên CPU hiện đại.

---

## 4. Forbidden Attack — Hậu quả của Nonce Reuse

### 4.1. Điều kiện và Intuition

GCM được thiết kế với giả định tuyệt đối: **mỗi (K, N) pair chỉ được dùng một lần**. Nếu vi phạm điều này, Antoine Joux (2006) chỉ ra hậu quả thảm khốc: attacker recover được $H$ → forge được **bất kỳ authentication tag nào**.

> [!danger] Forbidden Attack (Joux 2006)
> **Điều kiện**: Attacker quan sát hai ciphertext $(C_1, T_1)$ và $(C_2, T_2)$ được tạo với **cùng key $K$ và cùng nonce $N$**.
>
> **Hậu quả**: Attacker có thể:
> 1. Recover GHASH key $H = E_K(0^{128})$
> 2. Recover keystream (nonce reuse → two-time pad)
> 3. Forge tag $T'$ cho **bất kỳ ciphertext $C'$ nào**
>
> **Authentication bị phá hoàn toàn. Confidentiality cũng bị phá hoàn toàn (plaintext recover).**

![[assets/img-09-gcm-forbidden.png]]
*Nonce reuse trong AES-GCM cho phép attacker recover H (GHASH key) bằng cách giải polynomial equation trong GF(2¹²⁸), sau đó forge authentication tag cho bất kỳ ciphertext nào.*

### 4.2. Cơ chế tấn công chi tiết

**Bước 1 — Setup polynomial equation:**

Với hai message $(A_1, M_1)$ và $(A_2, M_2)$ dùng cùng nonce $N$:

$$
T_1 = g_1(H) \oplus S, \quad T_2 = g_2(H) \oplus S
$$

Vì cùng nonce → $J_0$ như nhau → $S = E_K(J_0)$ **như nhau**.

XOR hai phương trình:

$$
T_1 \oplus T_2 = g_1(H) \oplus g_2(H) = (g_1 \oplus g_2)(H)
$$

Định nghĩa $f(X) = g_1(X) \oplus g_2(X) \oplus T_1 \oplus T_2$. Thì:

$$
f(H) = 0 \quad \Longleftrightarrow \quad H \text{ là root của } f \text{ trong } \text{GF}(2^{128})
$$

Tất cả coefficients của $f$ đều **biết** (từ $A_1, C_1, A_2, C_2, T_1, T_2$). Chỉ $H$ là ẩn.

**Bước 2 — Factor polynomial:**

Factor $f(X)$ trong $\text{GF}(2^{128})[X]$ bằng Cantor-Zassenhaus algorithm → tìm tất cả roots (giá trị $H$ ứng viên).

Nếu có nhiều ứng viên, dùng message thứ 3 $(C_3, T_3)$ cùng nonce để xác định đúng $H$.

**Bước 3 — Recover S và plaintext:**

Sau khi biết $H$, tính $\text{GHASH}_H(A_1, C_1)$ từ các giá trị đã biết, rồi:

$$S = T_1 \oplus \text{GHASH}_H(A_1, C_1)$$

Nonce reuse → $J_1, J_2, \ldots$ như nhau → CTR keystream như nhau. Nếu biết $M_2$ → recover keystream → decrypt $M_1$.

**Bước 4 — Forge tag cho ciphertext tùy ý:**

$$
T' = \text{GHASH}_H(A', C') \oplus S
$$

> [!example] Code — Forbidden Attack (SageMath)
> ```python
> from sage.all import GF, PolynomialRing
>
> # Khai báo biến x trước khi dùng trong modulus
> R_modulus = PolynomialRing(GF(2), 'x')
> x = R_modulus.gen()
> modulus = x**128 + x**7 + x**2 + x + 1
>
> F = GF(2**128, name='a', modulus=modulus)
>
> def forbidden_attack(C1, T1, A1, C2, T2, A2, block_size=16):
>     def bytes_to_ghash_elem(b):
>         return F.fetch_int(int.from_bytes(b, 'big'))
>
>     def build_ghash_poly(C, T, A=b""):
>         blocks = [C[i:i+16] for i in range(0, len(C), 16)]
>         R = PolynomialRing(F, 'h')
>         h = R.gen()
>         poly = R(0)
>         exp = len(blocks) + 1
>         for blk in blocks:
>             poly += bytes_to_ghash_elem(blk) * h**exp
>             exp -= 1
>         # GCM spec: L = (len(A) * 8) || (len(C) * 8) in bits, 64-bit each
>         L = (len(A) * 8).to_bytes(8, 'big') + (len(C) * 8).to_bytes(8, 'big')
>         poly += bytes_to_ghash_elem(L) * h
>         poly += bytes_to_ghash_elem(T)  # T là constant term → f(H)=0 khi đúng H
>         return poly
>
>     poly1 = build_ghash_poly(C1, T1, A1)
>     poly2 = build_ghash_poly(C2, T2, A2)
>     diff_poly = poly1 + poly2  # = (g1 ⊕ g2)(X) ⊕ (T1 ⊕ T2); roots = H
>     roots = diff_poly.roots(multiplicities=False)
>     return roots
> ```

### 4.3. Phân tích Complexity

Số queries cần thiết: **2 ciphertext** cùng nonce là đủ để bắt đầu tấn công. Factor polynomial trong $\text{GF}(2^{128})$: thực tế, polynomial có degree = số blocks → thường degree nhỏ (vài chục), factor rất nhanh.

---

## 5. Nonce Generation — Best Practices và Lỗi thường gặp

> [!warning] Lỗi thường gặp trong CTF và thực tế
>
> ```python
> import os, random, time
>
> KEY = os.urandom(16)
>
> def bad_nonce_1():
>     NONCE = os.urandom(12)
>     return NONCE
>
> def bad_nonce_2():
>     return int(time.time()).to_bytes(12, 'big')
>
> def bad_nonce_3():
>     return random.randbytes(12)
> ```
>
> - `bad_nonce_1`: `os.urandom` mỗi lần gọi → **dễ collision** (birthday paradox với 96-bit nonce: sau $2^{48}$ encryptions có ~50% collision). Với trường hợp CTF: nonce random nhưng cùng session → thường dùng lại sau vài calls.
> - `bad_nonce_2`: Timestamp nonce → predictable + nhiều calls trong 1 giây → collision ngay.
> - `bad_nonce_3`: `random` không phải CSPRNG → predictable.

> [!success] Cách dùng đúng
>
> ```python
> import struct
>
> class AES_GCM_Safe:
>     def __init__(self, key):
>         self.key = key
>         self._counter = 0
>
>     def encrypt(self, plaintext, aad=b""):
>         nonce = struct.pack(">Q", self._counter).ljust(12, b'\x00')
>         self._counter += 1
>         cipher = AES.new(self.key, AES.MODE_GCM, nonce=nonce)
>         cipher.update(aad)
>         ct, tag = cipher.encrypt_and_digest(plaintext)
>         return nonce, ct, tag
>
>     def decrypt(self, nonce, ct, tag, aad=b""):
>         cipher = AES.new(self.key, AES.MODE_GCM, nonce=nonce)
>         cipher.update(aad)
>         return cipher.decrypt_and_verify(ct, tag)
> ```
>
> Dùng **monotonic counter** làm nonce — đảm bảo unique tuyệt đối. Nếu cần random: dùng `os.urandom(12)` nhưng chỉ cho số lần encrypt ít ($\ll 2^{32}$).

---

## 6. AES-GCM-SIV — Nonce-Misuse Resistant

AES-GCM-SIV (RFC 8452, Gueron & Lindell 2017) là variant được thiết kế để **chịu được** nonce reuse một cách graceful: nếu cùng $(K, N, M)$ → cùng $C$; nếu cùng $(K, N)$ nhưng $M$ khác → attacker **chỉ biết hai plaintext bằng nhau hay không**, không nhiều hơn.

> [!note] AES-GCM-SIV Key Idea
> Trong GCM-SIV, tag $T$ được derive từ **cả plaintext và nonce** trước khi tạo keystream. Cụ thể:
>
> - $T = \text{POLYVAL}_{H}(M, A) \oplus J_0$ (tag commit cả $M$)
> - $J_0 = T \oplus N$ (counter block phụ thuộc vào tag)
> - Keystream = CTR(K', J₀) với $K'$ derived key
>
> Hệ quả: nếu nonce reuse nhưng **message khác** → tag khác → keystream khác → **không repeat keystream**.

> [!info] POLYVAL vs GHASH — Điểm khác biệt
> GCM dùng **GHASH**; GCM-SIV dùng **POLYVAL**. Cả hai đều là polynomial hash trên $\text{GF}(2^{128})$, nhưng khác nhau về byte order và irreducible polynomial:
>
> | | GHASH | POLYVAL |
> |---|---|---|
> | **Định nghĩa trong** | GCM (NIST SP 800-38D) | GCM-SIV (RFC 8452) |
> | **Byte order** | Big-endian (MSB first), bit-reflection của polynomial | Little-endian friendly, không cần bit-reflection |
> | **Irreducible poly** | $x^{128} + x^7 + x^2 + x + 1$ | $x^{128} + x^{127} + x^{126} + x^{121} + 1$ (reflected) |
> | **Quan hệ** | $\text{POLYVAL}(H, X) = \text{ByteReverse}(\text{GHASH}(\text{ByteReverse}(H), \text{ByteReverse}(X)))$ | |
>
> **Lý do tồn tại của POLYVAL**: GHASH yêu cầu bit-reflection khi cài đặt trên phần cứng little-endian (x86). POLYVAL được thiết kế để tự nhiên trên little-endian — không cần swap bits, chỉ cần swap bytes — nên nhanh hơn trong software và tránh lỗi cài đặt.
>
> Trong CTF: khi thấy GCM-SIV challenge, dùng `pycryptodome` hoặc `cryptography` library thay vì tự cài đặt POLYVAL để tránh subtle bugs.

---

## 7. Các AEAD Modern Alternatives

> [!info] AEAD Schemes hiện đại
>
> | Scheme | Based on | Nonce size | Tag size | Notes |
> |--------|----------|-----------|---------|-------|
> | **AES-GCM** | AES + GHASH | 96 bits | 128 bits | Fastest trên AES-NI hw |
> | **ChaCha20-Poly1305** | ChaCha20 + Poly1305 | 96 bits | 128 bits | Fast trên sw, no AES-NI needed |
> | **AES-GCM-SIV** | AES + POLYVAL | 96 bits | 128 bits | Nonce-misuse resistant |
> | **AES-CCM** | AES + CBC-MAC | variable | variable | Embedded/IoT |
> | **AES-SIV** | AES + CMAC | Deterministic | 128 bits | Stateful, nonce-misuse resistant |
>
> TLS 1.3 mandates: AES-128-GCM, AES-256-GCM, hoặc ChaCha20-Poly1305.

---

## 8. Integrity vs Authenticity vs Confidentiality

Ba tính chất hay bị nhầm lẫn, cần phân biệt rõ:

> [!note] Phân biệt 3 tính chất
>
> - **Confidentiality**: Message không bị đọc bởi người không có quyền. Stream cipher (CTR) cung cấp confidentiality.
> - **Integrity**: Message không bị thay đổi. Hash function (SHA-256 của message) cung cấp integrity nhưng **không có key** → attacker có thể replace cả message + hash.
> - **Authenticity**: Message đến từ người có key đúng và không bị thay đổi. MAC / AEAD cung cấp authenticity.
>
> AEAD = Confidentiality + Authenticity. Integrity (không có key) không đủ cho crypto.

---

## 9. CTF Pattern Recognition

> [!tip] Nhận diện GCM nonce reuse trong CTF
>
> **Code patterns:**
> ```python
> KEY = os.urandom(16)
> NONCE = os.urandom(12)
>
> def encrypt(msg):
>     cipher = AES.new(KEY, AES.MODE_GCM, nonce=NONCE)
>     ct, tag = cipher.encrypt_and_digest(msg)
>     return ct, tag
> ```
> `NONCE` là constant → nonce reuse với mọi encryption → Forbidden Attack!
>
> **Attack flow:**
> 1. Gọi `encrypt(known_msg_1)` → $(C_1, T_1)$
> 2. Gọi `encrypt(known_msg_2)` → $(C_2, T_2)$
> 3. XOR ciphertexts → $C_1 \oplus C_2 = M_1 \oplus M_2$ (two-time pad)
> 4. Nếu biết $M_1$ → recover $M_2$ (flag!)
> 5. Forbidden attack → recover $H$ → forge tag cho bất kỳ message

> [!example] Code — CTR Two-Time Pad (phần dễ hơn Forbidden Attack)
> ```python
> flag_ct, flag_tag = encrypt(flag)
> known_pt = b'A' * len(flag_ct)
> known_ct, _ = encrypt(known_pt)
>
> keystream = bytes(a ^ b for a, b in zip(known_ct, known_pt))
> recovered_flag = bytes(a ^ b for a, b in zip(flag_ct, keystream))
> print(recovered_flag)
> ```

---

## 10. Summary

- **AEAD** là standard hiện đại: mã hóa + xác thực trong một primitive. Không bao giờ implement thủ công với CBC + HMAC trừ khi biết mình đang làm gì.
- **Encrypt-then-MAC** là thứ tự đúng duy nhất. MAC-then-Encrypt dẫn đến padding oracle (Lucky13, POODLE).
- **AES-GCM**: CTR mode + GHASH polynomial MAC. Nhanh với phần cứng AES-NI.
- **Forbidden Attack**: Nonce reuse trong GCM → recover GHASH key $H$ → forge bất kỳ tag → authentication phá hoàn toàn + plaintext recovery qua two-time pad.
- **Nonce discipline**: Counter là cách an toàn nhất. Random nonce an toàn nếu số lần encrypt rất nhỏ so với $2^{48}$.
- **Phòng chống**: AES-GCM-SIV nếu cần nonce-misuse resistance; ChaCha20-Poly1305 nếu không có AES-NI.

---

## 11. References

- Joux, A. — *Authentication Failures in NIST version of GCM*, NIST Comment, 2006 (csrc.nist.gov)
- Bellare, M. & Namprempre, C. — *Authenticated Encryption: Relations among Notions and Analysis of the Generic Composition Paradigm*, ASIACRYPT 2000
- Gueron, S. & Lindell, Y. — *GCM-SIV: Full Nonce Misuse-Resistant Authenticated Encryption at Under One Cycle per Byte*, CCS 2015
- Bock, H. et al. — *Nonce-Disrespecting Adversaries: Practical Forgery Attacks on GCM in TLS*, USENIX WOOT 2016 (github.com/nonce-disrespect)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 9 (toc.cryptobook.us)
- RFC 5116 — *An Interface and Algorithms for Authenticated Encryption* (rfc-editor.org)
- RFC 8452 — *AES-GCM-SIV: Nonce Misuse-Resistant Authenticated Encryption* (rfc-editor.org)

