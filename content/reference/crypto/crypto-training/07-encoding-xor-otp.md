---
title: "07. Encoding & XOR / OTP"
type: foundation+scheme
tags: [crypto, encoding, xor, otp, perfect-secrecy, lesson-04, phase-1]
aliases: [OTP, One-Time Pad, XOR Cipher, Perfect Secrecy]
created: 2026-04-16
---

> **Prerequisites**: CTF big picture, modular arithmetic, classical ciphers  
> **Lesson type**: Foundation + Scheme (hybrid — OTP là scheme đạt security definition chặt chẽ nhất)
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\oplus$ | Bitwise XOR (Exclusive OR) |
> | $\{0,1\}^n$ | Tập tất cả binary strings độ dài $n$ |
> | $\{0,1\}^*$ | Tập tất cả binary strings độ dài tùy ý |
> | $M, C, K$ | Message (plaintext), Ciphertext, Key |
> | $\Pr[\cdot]$ | Xác suất của một sự kiện |
> | $H(\cdot)$ | Shannon entropy (giới thiệu sơ lược; chi tiết ở L05) |

---

## 1. Motivation

Bài học này bắt đầu bằng một sự phân biệt tưởng chừng đơn giản nhưng cực kỳ quan trọng và thường bị người mới nhầm lẫn: **encoding** và **encryption** là hai thứ hoàn toàn khác nhau. Hiểu rõ điều này là bước đầu tiên để không bị "lừa" trong CTF.

Tiếp theo, chúng ta đi vào một trong những primitive đơn giản nhất trong mật mã — **XOR cipher** — và từ đó leo thang đến **One-Time Pad (OTP)**: cipher duy nhất trong lịch sử loài người được *chứng minh toán học* là không thể phá, dù cho đối thủ có vô hạn tài nguyên tính toán.

![[assets/img-04-01-encoding-vs-encryption.png]]
*Encoding biến đổi định dạng mà không ẩn thông tin; Encryption ẩn thông tin bằng key bí mật*

---

## 2. Encoding — Không phải Mã hóa

**Encoding** là quá trình biến đổi dữ liệu từ định dạng này sang định dạng khác nhằm mục đích compatibility hoặc transport — **không phải bảo mật**. Bất kỳ ai cũng có thể decode mà không cần bất kỳ thông tin bí mật nào.

> [!warning] Sai lầm phổ biến nhất của người mới
> Base64, Hex, URL encoding **KHÔNG phải là mã hóa**. Chúng không cung cấp bất kỳ sự bảo mật nào. Khi thấy chúng trong CTF, hãy decode ngay — chúng không phải là thách thức mà thường là bước trung gian để lộ ciphertext thực sự.

### 2.1. Base64

Base64 mã hóa dữ liệu nhị phân thành ký tự ASCII printable, dùng bảng 64 ký tự: A-Z, a-z, 0-9, +, /. Mỗi 3 bytes đầu vào → 4 ký tự Base64. Dấu `=` là padding khi số bytes không chia hết cho 3.

> [!example] Base64 encoding từng bước
> Plaintext: `Hi!` = bytes `0x48 0x69 0x21`  
> Chuyển sang binary:
> `01001000 01101001 00100001`  
> Tách thành nhóm 6-bit (thay vì 8-bit):
> `010010 | 000110 | 100100 | 100001`
> = 18, 6, 36, 33  
> Tra bảng Base64:
> `S`, `G`, `k`, `h` → `SGkh`

**Nhận dạng nhanh**: chuỗi Base64 chỉ gồm ký tự `[A-Za-z0-9+/=]`, thường kết thúc bằng `=` hoặc `==`. Độ dài luôn là bội của 4.

### 2.2. Hex Encoding

Mỗi byte (8 bit) được biểu diễn bằng 2 ký tự hexadecimal (0-9, a-f). Một string hex chỉ gồm `[0-9a-fA-F]` và có độ dài chẵn.

> [!example] Hex encoding
> `hello` = bytes `68 65 6c 6c 6f` → hex string `68656c6c6f`

### 2.3. Các Encoding Khác

| Encoding | Bảng ký tự | Đặc điểm nhận dạng |
|----------|-----------|-------------------|
| Base32 | A-Z, 2-7 | Uppercase, padding `=`, không có số 0,1,8,9 |
| Base58 | `[1-9A-HJ-NP-Za-km-z]` — Base64 bỏ 0, O, I, l và `+/` | Bitcoin/Ethereum address, IPFS CID |
| Base85 (Ascii85) | 85 ký tự ASCII printable | 4 bytes → 5 ký tự; dùng trong PDF, Git bundle |
| URL encoding | `%XX` với XX là hex byte | Dấu `%` trước ký tự đặc biệt; phổ biến trong web CTF |
| ASCII | 0-127 | Printable text |

> [!info] Base58 và Base85 trong CTF
> - **Base58**: Dễ nhầm với Base64 nhưng không có `0`, `O`, `I`, `l`, `+`, `/`. Thường gặp trong challenge liên quan đến blockchain hoặc khi chuỗi trông như Base64 nhưng decode bị lỗi.
> - **Base85**: Có nhiều variant (RFC 1924, Ascii85/btoa, Z85). Chuỗi Ascii85 thường bắt đầu bằng `<~` và kết thúc bằng `~>`. Trong Python: `import base64; base64.a85decode(...)`.
> - **Tip**: Khi gặp chuỗi lạ không decode được bằng Base64/Hex, thử `CyberChef → From Base58`, `From Base85`, hoặc `Magic` mode.

---

## 3. XOR — Phép Toán Nền tảng

XOR (Exclusive OR, ký hiệu $\oplus$) là phép toán bit-by-bit theo bảng chân trị:

| $a$ | $b$ | $a \oplus b$ |
|-----|-----|-------------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

> [!abstract] Các tính chất quan trọng của XOR
> Với $a, b, c \in \{0,1\}^n$ bất kỳ:
>
> > $$a \oplus 0 = a \qquad \text{(identity)}$$  
> > $$a \oplus a = 0 \qquad \text{(self-inverse)}$$  
> > $$a \oplus b = b \oplus a \qquad \text{(commutative)}$$  
> > $$(a \oplus b) \oplus c = a \oplus (b \oplus c) \qquad \text{(associative)}$$  
> > $$(a \oplus b) \oplus a = b \qquad \text{(cancellation — quan trọng nhất)}$$

Tính chất cuối — **cancellation** — là nền tảng của cả mã hóa lẫn giải mã XOR: nếu $C = M \oplus K$, thì $C \oplus K = M \oplus K \oplus K = M \oplus 0 = M$.

### 3.1. XOR Cipher

> [!note] Scheme — XOR Cipher (Stream Cipher đơn giản)
> **Key space**: $\mathcal{K} = \{0,1\}^n$ với $n$ là độ dài message
>
> **$\mathsf{Enc}(K, M)$**
> - Input: key $K$, message $M$, cả hai là bitstrings độ dài $n$
> - Output: $C = M \oplus K$
>
> **$\mathsf{Dec}(K, C)$**
> - Input: key $K$, ciphertext $C$
> - Output: $M = C \oplus K$
>
> **Correctness**: $\mathsf{Dec}(K, \mathsf{Enc}(K, M)) = (M \oplus K) \oplus K = M \oplus (K \oplus K) = M \oplus 0 = M$

XOR cipher là dạng stream cipher đơn giản nhất. Security của nó phụ thuộc hoàn toàn vào key: nếu key dài bằng message và ngẫu nhiên thực sự → đây chính là One-Time Pad. Nếu key ngắn hơn và được lặp lại → dễ bị phá (xem phần Many-Time Pad Attack).

---

## 4. One-Time Pad — Perfect Secrecy

> [!note] Scheme — One-Time Pad (Vernam Cipher)
> **Type**: Symmetric Encryption
> **Key**: $K \stackrel{R}{\leftarrow} \{0,1\}^n$ — hoàn toàn ngẫu nhiên, dài đúng bằng message, **chỉ dùng một lần**
>
> **$\mathsf{Enc}(K, M)$**
> - Input: $M \in \{0,1\}^n$, $K \in \{0,1\}^n$ ngẫu nhiên thực sự
> - Output: $C = M \oplus K \in \{0,1\}^n$
>
> **$\mathsf{Dec}(K, C)$**
> - Input: $C \in \{0,1\}^n$, $K \in \{0,1\}^n$
> - Output: $M = C \oplus K$

![[assets/img-04-02-otp-flow.png]]
*OTP encrypt/decrypt flow và Many-Time Pad attack khi key bị tái sử dụng*

**Lịch sử ngắn gọn**: Gilbert Vernam (AT&T, 1917) phát minh ra cơ chế XOR cho teletype. Captain Joseph Mauborgne nhận ra key cần hoàn toàn ngẫu nhiên và chỉ dùng một lần. Claude Shannon (1949) sau đó chứng minh toán học rằng OTP đạt **perfect secrecy**.

### 4.1. Perfect Secrecy — Định nghĩa Chặt chẽ

> [!abstract] định nghĩa — Perfect Secrecy (Shannon, 1949)
> Một encryption scheme $(\mathsf{Enc}, \mathsf{Dec})$ đạt **perfect secrecy** (còn gọi là unconditional security hay information-theoretic security) nếu với mọi phân bố xác suất trên message space, với mọi message $m_0, m_1 \in \mathcal{M}$, và với mọi ciphertext $c \in \mathcal{C}$:
>
> > $$\Pr[\mathsf{Enc}(K, m_0) = c] = \Pr[\mathsf{Enc}(K, m_1) = c]$$
>
> Tương đương: $\Pr[M = m \mid C = c] = \Pr[M = m]$ với mọi $m, c$.
>
> Nghĩa là: biết ciphertext $c$ không cho bất kỳ thông tin nào về plaintext, kể cả khi adversary có vô hạn tài nguyên tính toán.

> [!abstract] Theorem — OTP đạt Perfect Secrecy
> One-Time Pad đạt perfect secrecy khi $K$ được phân bố đều trên $\{0,1\}^n$ và độc lập với $M$.

**Proof.** Với key $K \stackrel{R}{\leftarrow} \{0,1\}^n$ đều:

$$\Pr[\mathsf{Enc}(K, m) = c] = \Pr[m \oplus K = c] = \Pr[K = m \oplus c] = \frac{1}{2^n}$$

Xác suất này không phụ thuộc vào $m$ — với bất kỳ message nào, xác suất tạo ra ciphertext $c$ đều bằng $\frac{1}{2^n}$. Do đó $\Pr[M = m \mid C = c] = \Pr[M = m]$. $\blacksquare$

**Hệ quả quan trọng**: Nếu đối thủ bắt được ciphertext `a3f8...`, họ không thể biết plaintext là "ATTACK AT DAWN" hay "DO NOT ATTACK" hay bất kỳ chuỗi nào khác có cùng độ dài — tất cả đều có xác suất như nhau. Không có thuật toán, dù mạnh đến đâu, kể cả máy tính lượng tử, có thể phá OTP.

> [!abstract] Theorem — Shannon Lower Bound
> Bất kỳ encryption scheme nào đạt perfect secrecy đều cần $|\mathcal{K}| \geq |\mathcal{M}|$, tức là **key space phải lớn ít nhất bằng message space**.

**Proof sketch.** Giả sử $|\mathcal{K}| < |\mathcal{M}|$. Fix một ciphertext $c^*$. Tập các plaintext có thể decrypt từ $c^*$ là $\{\mathsf{Dec}(k, c^*) : k \in \mathcal{K}\}$, có nhiều nhất $|\mathcal{K}| < |\mathcal{M}|$ phần tử. Tồn tại message $m^*$ không decode được từ $c^*$ với bất kỳ key nào. Khi đó $\Pr[M = m^* \mid C = c^*] = 0 \neq \Pr[M = m^*]$ — vi phạm perfect secrecy. $\blacksquare$

**Hệ quả**: OTP không thể thực tiễn. Key cần dài bằng tổng dung lượng dữ liệu cần bảo vệ, và cần được trao đổi qua kênh an toàn. Đây là lý do mật mã hiện đại chuyển sang **computational security** — đủ an toàn với adversary có tài nguyên giới hạn.

### 4.2. Ba Điều kiện để OTP An toàn

> [!warning] Ba điều kiện — vi phạm bất kỳ điều nào → phá vỡ hoàn toàn
> **Điều kiện 1**: Key $K$ phải hoàn toàn ngẫu nhiên (truly random, không phải pseudo-random)
> - Vi phạm: VENONA project (1946-1980) — CIA phá được OTP của Liên Xô vì key được sinh từ non-random source
>
> **Điều kiện 2**: $|K| \geq |M|$ — key phải dài ít nhất bằng message
> - Vi phạm: key ngắn hơn phải repeat → trở thành Vigenère cipher → bị phá bởi Kasiski examination (L05)
>
> **Điều kiện 3**: Key phải được dùng **đúng một lần duy nhất**
> - Vi phạm: Many-Time Pad Attack (xem phần 3.3)

### 4.3. Many-Time Pad Attack — Key Reuse là Thảm họa

Khi cùng một key $K$ được dùng để mã hóa hai message khác nhau $M_1, M_2$:

$$C_1 = M_1 \oplus K, \quad C_2 = M_2 \oplus K$$

Attacker tính:

$$C_1 \oplus C_2 = (M_1 \oplus K) \oplus (M_2 \oplus K) = M_1 \oplus M_2 \oplus (K \oplus K) = M_1 \oplus M_2$$

Key $K$ bị loại bỏ hoàn toàn. Từ $M_1 \oplus M_2$, attacker áp dụng kỹ thuật **crib dragging** (kéo lê bản thử):

1. Giả sử một từ phổ biến trong tiếng Anh (crib) xuất hiện tại vị trí $i$ trong $M_1$: ví dụ " the "
2. XOR crib với $C_1 \oplus C_2$ tại vị trí $i$ → nhận được phần của $M_2$ tại đó
3. Kiểm tra xem phần $M_2$ có hợp lệ về mặt ngôn ngữ không
4. Nếu có → tiếp tục mở rộng; nếu không → thử vị trí khác

> [!example] Many-Time Pad trong CTF
> Bài CTF điển hình: server cung cấp 10-20 ciphertext được mã hóa với cùng key. Nhiệm vụ: recover flag.
>
> **Chiến lược**: XOR tất cả cặp ciphertext → thu được nhiều $M_i \oplus M_j$ → từ đó dùng crib dragging hoặc frequency analysis để recover từng $M_i$.
>
> Tool Python:
> ```python
> from itertools import combinations
> cts = [bytes.fromhex(c) for c in ciphertexts]
> for i, j in combinations(range(len(cts)), 2):
>     xored = bytes(a^b for a,b in zip(cts[i], cts[j]))
>     print(f"CT{i} XOR CT{j}: {xored}")
> ```

**Ví dụ lịch sử thực tế**: Chiến dịch VENONA (1944-1980) — NSA phá được OTP của tình báo Liên Xô vì các nhân viên đã tái sử dụng một số key pages của sổ mật mã.

---

## 5. XOR Properties trong Cryptanalysis

> [!abstract] Lemma L1 — XOR với Known Plaintext
> Nếu attacker biết cặp $(M, C)$ và $C = M \oplus K$, họ có thể recover key ngay lập tức:
>
> > $$K = M \oplus C$$

Đây là lý do tại sao OTP **không an toàn dưới known-plaintext attack** — nhưng điều này không mâu thuẫn với perfect secrecy, vì perfect secrecy chỉ bảo vệ confidentiality của message chưa biết, không bảo vệ key khi plaintext bị lộ.

> [!info] XOR một-byte vs XOR nhiều-byte
> Trong nhiều bài CTF, key là một byte hoặc một chuỗi ngắn, được XOR lặp lại với toàn bộ ciphertext:
> ```python
> def xor_repeated_key(ct, key):
>     key = key if isinstance(key, bytes) else key.encode()
>     return bytes(ct[i] ^ key[i % len(key)] for i in range(len(ct)))
>
> def brute_single_byte_xor(ct):
>     best = (0, None, "")
>     for key in range(256):
>         pt = bytes(b ^ key for b in ct)
>         try:
>             text = pt.decode('ascii', errors='replace')
>             score = sum(text.count(c) for c in 'etaoinshrdlu ETAOINSHRDLU')
>             if score > best[0]:
>                 best = (score, key, text)
>         except:
>             pass
>     return best
> ```

---

## 6. Tóm tắt Security Model

Bài học này giới thiệu khái niệm **security definition** — sau này chúng ta sẽ gặp nhiều dạng mạnh hơn (IND-CPA, IND-CCA2). Perfect secrecy là định nghĩa mạnh nhất có thể (information-theoretic), nhưng cũng là định nghĩa không thực tế:

| Security Model | Adversary | Ứng dụng |
|---|---|---|
| **Perfect secrecy** | Vô hạn tài nguyên | OTP (không thực tế) |
| **Computational security** | PPT (polynomial-time) | AES, RSA, ECC (thực tế) |

Mật mã hiện đại hy sinh perfect secrecy để đổi lấy key ngắn hơn và có thể reuse, bằng cách dựa vào giả thuyết rằng một số bài toán toán học (như factoring, DLP) rất khó giải.

---

## 7. CTF Relevance

**Encoding + XOR là kỹ năng bắt buộc trong mọi CTF**

> [!tip] CTF Checklist cho Encoding & XOR
> **Nhận diện encoding**:
> - Cuối string có `=` hoặc `==` → Base64
> - Chỉ ký tự 0-9a-fA-F → Hex
> - Chỉ chữ hoa A-Z và 2-7 → Base32
> - Chỉ gồm `[1-9A-HJ-NP-Za-km-z]` (không có 0/O/I/l/+/) → Base58
> - Bắt đầu `<~` và kết thúc `~>` → Ascii85 (Base85)
> - Có `%xx` patterns → URL encoding
>
> **Nhận diện XOR cipher trong source code**:
> - Tìm `^` operator trong Python/C/Java
> - Tìm `xor`, `XOR`, `oplus` trong pseudocode
> - Nếu ciphertext length = plaintext length → không phải block cipher
>
> **Dấu hiệu many-time pad**:
> - Server generate key một lần và encrypt nhiều message
> - Nhiều ciphertext cho sẵn, cùng độ dài hoặc tương đương

---

## 8. Công cụ & Code

_(code mang tính tham khảo)_
```python
import base64

base64.b64encode(b"hello world")
base64.b64decode("aGVsbG8gd29ybGQ=")
bytes.fromhex("68656c6c6f")
b"hello".hex()

from pwn import xor
xor(b"hello", b"world")
xor(b"hello", b"\x42")

def many_time_pad_attack(ciphertexts):
    n = min(len(c) for c in ciphertexts)
    key_guess = bytearray(n)
    for pos in range(n):
        votes = {}
        for i, ci in enumerate(ciphertexts):
            for j, cj in enumerate(ciphertexts):
                if i >= j:
                    continue
                xored = ci[pos] ^ cj[pos]
                for char in b' etaoinshrdlu':
                    k_guess = ci[pos] ^ char
                    votes[k_guess] = votes.get(k_guess, 0) + 1
        key_guess[pos] = max(votes, key=votes.get)
    return bytes(key_guess)

def otp_encrypt(message: bytes, key: bytes) -> bytes:
    assert len(key) >= len(message), "Key phải dài ít nhất bằng message"
    return bytes(m ^ k for m, k in zip(message, key))
```

---

## 9. Summary

- **Encoding** (Base64, Hex, ...) ≠ **Encryption**: encoding không ẩn thông tin, không có key, không có security
- **XOR** có tính chất tự đảo ngược: $(A \oplus B) \oplus A = B$ — nền tảng của mọi stream cipher
- **One-Time Pad**: $C = M \oplus K$ với key ngẫu nhiên thực sự, dài bằng message, chỉ dùng 1 lần → **perfect secrecy** (Shannon 1949)
- **Perfect secrecy**: biết ciphertext không cho thêm bất kỳ thông tin nào về plaintext, kể cả với adversary vô hạn tài nguyên
- **Shannon Lower Bound**: $|\mathcal{K}| \geq |\mathcal{M}|$ là điều kiện cần cho perfect secrecy → OTP không thực tế
- **Many-Time Pad Attack**: $C_1 \oplus C_2 = M_1 \oplus M_2$ → key bị loại bỏ → plaintext bị lộ qua crib dragging

---

## 10. References

- Shannon, C.E. — *Communication Theory of Secrecy Systems*, Bell System Technical Journal, 1949 (bài báo gốc)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Chapter 2: Perfect Secrecy (toc.cryptobook.us, miễn phí)
- Katz & Lindell — *Introduction to Modern Cryptography*, Chapter 2 (Perfect Secrecy)
- VENONA Project — NSA declassified documents (https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Releases/VENONA/)
- CryptoHack — Introduction challenges: Encoding (https://cryptohack.org/challenges/introduction/)
- Cryptopals — Set 1, Challenge 6: Break repeating-key XOR (https://cryptopals.com/sets/1/challenges/6)
