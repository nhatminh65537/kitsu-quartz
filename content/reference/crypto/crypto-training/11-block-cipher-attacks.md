---
title: "11. Block Cipher Attacks"
type: attack
tags: [crypto, block-cipher, padding-oracle, bit-flipping, ecb, cbc, ctf]
aliases: [Block Cipher Attacks, Padding Oracle, CBC Bit Flip, ECB Cut Paste]
created: 2026-04-17
---

> **Prerequisites**: [[10-block-ciphers-modes|10 — Block Ciphers & Modes of Operation]], [[04-modular-arithmetic|04 — Modular Arithmetic]]  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_K, D_K$ | Block cipher encrypt/decrypt với key $K$ |
> | $C_i, P_i$ | Block ciphertext/plaintext thứ $i$, kích thước $b$ bytes |
> | $IV$ | Initialization Vector; $C_0 = IV$ theo quy ước CBC |
> | $I_i$ | Intermediate value: $I_i = D_K(C_i)$ trước bước XOR |
> | $\oplus$ | XOR bitwise |
> | $n$ | Kích thước block (AES: $n = 16$ bytes) |

---

## 1. Bức tranh toàn cảnh — Tại sao mode of operation quan trọng hơn cipher?

AES như một cỗ máy biến $n$ byte plaintext thành $n$ byte ciphertext bằng key — giống như một hàm băm có thể đảo ngược. Bản thân AES cực kỳ an toàn. Nhưng khi muốn mã hóa dữ liệu dài hơn $n$ byte, ta phải chọn **mode of operation** để chia nhỏ dữ liệu và kết nối các blocks lại với nhau.

Đây chính là nơi mà hầu hết lỗ hổng thực tế xuất hiện. Không phải từ AES bị phá, mà từ **cách sử dụng** AES sai. Ba cuộc tấn công kinh điển nhất:

- **ECB cut-and-paste** — ECB không có memory về context, mỗi block là độc lập
- **CBC bit-flipping** — Thay đổi một byte trong $C_i$ làm lật một byte tương ứng trong $P_{i+1}$
- **Padding Oracle** — Server rò rỉ "padding valid/invalid" → decrypt hoàn toàn mà không cần key

> [!info] Attack Taxonomy
> Ba tấn công này thuộc nhóm **Structural / Mode Attacks** trong taxonomy (xem Phần D của roadmap). Chúng khai thác cấu trúc của mode, không phải điểm yếu toán học của AES. Adversary model: **CCA2** (Chosen Ciphertext Attack) — attacker có thể query decryption oracle.

---

## 2. ECB — Electronic Codebook và sự nguy hiểm của tính độc lập

### 2.1. Vấn đề cốt lõi

ECB encrypt mỗi block $P_i$ hoàn toàn độc lập:

$$
C_i = E_K(P_i) \quad \text{với mọi } i
$$

Không có IV, không có feedback, không có "nhớ" về các block trước. Hệ quả trực tiếp: **hai block plaintext giống nhau → hai block ciphertext giống nhau**. Đây là lý do tại sao ECB gọi là "ECB penguin" — khi encrypt hình ảnh, cấu trúc visual vẫn còn thấy được trong ciphertext.

### 2.2. ECB Cut-and-Paste Attack

> [!warning] Attack — ECB Block Reordering
> **Điều kiện**: Ứng dụng dùng ECB để mã hóa token có cấu trúc cố định (ví dụ: cookie, session token, JWT-like structure), và attacker biết (hoặc có thể kiểm soát) một phần plaintext.

Nguyên lý: vì các blocks được encrypt độc lập, attacker có thể **cắt** block $C_j$ từ một ciphertext và **dán** vào vị trí khác trong ciphertext khác, tạo ra token hợp lệ về mặt cú pháp nhưng có nội dung tùy ý.

![[assets/img-08-ecb-cutpaste.png]]
*ECB cut-and-paste: block "ADMIN∥padding" được tách riêng và dán vào vị trí role trong token khác.*

**Cơ chế tấn công chi tiết:**

1. Attacker quan sát cấu trúc token: `email=...&role=user` (16-byte aligned)
2. Tạo email sao cho block thứ 2 chứa đúng `admin\x0b\x0b...\x0b` (PKCS#7 padding cho "admin")
3. Ghi lại block ciphertext thứ 2 = $E_K(\text{"admin"} \| \text{0x0b×11})$
4. Đăng ký account bình thường để lấy token `C_1' \| C_{\text{role}}'`
5. Ghép: $C_1' \| C_2$ → server decrypt ra `email=a@b.com&role=admin`

> [!example] Code — ECB byte-at-a-time attack
> Kỹ thuật mạnh hơn: recover từng byte của unknown plaintext bằng cách kiểm soát prefix:
>
> ```python
> from Crypto.Cipher import AES
> from Crypto.Util.Padding import pad
>
> def ecb_byte_at_a_time(oracle, block_size=16):
>     secret_len = len(oracle(b""))
>     recovered = b""
>     for i in range(secret_len):
>         block_idx = i // block_size
>         pad_len = block_size - (i % block_size) - 1
>         prefix = b"A" * pad_len
>         target_block = oracle(prefix)[block_idx*block_size:(block_idx+1)*block_size]
>         for byte_val in range(256):
>             candidate = prefix + recovered + bytes([byte_val])
>             if oracle(candidate)[:len(target_block)] == target_block:
>                 recovered += bytes([byte_val])
>                 break
>     return recovered
> ```

### 2.3. CTF Recognition Tips

> [!tip] Nhận diện ECB trong CTF
> - Ciphertext có **16-byte block lặp lại** → chắc chắn ECB
> - Source code: `AES.new(key, AES.MODE_ECB)` → không có IV
> - Gửi input `AAAA...` (32 bytes giống nhau) → nếu `C[0:16] == C[16:32]` → ECB
> - Server cho phép "đăng ký" hoặc "tạo token" với input tùy ý → tìm ECB oracle

---

## 3. CBC Bit-Flipping Attack

### 3.1. Khai thác CBC Decryption

Hãy nhìn lại công thức CBC decrypt:

$$
P_i = D_K(C_i) \oplus C_{i-1}
$$

![[assets/img-08-cbc-decryption.png]]
*CBC decrypt: mỗi plaintext block được XOR với ciphertext block liền trước.*

Khai thác trực tiếp từ tính chất XOR: nếu attacker **flip bit $j$ của $C_{i-1}$**, thì:

$$
P_i' = D_K(C_i) \oplus C_{i-1}' = \underbrace{D_K(C_i) \oplus C_{i-1}}_{P_i} \oplus \underbrace{C_{i-1} \oplus C_{i-1}'}_{\Delta}
$$

Tức là $P_i'[j] = P_i[j] \oplus \Delta[j]$. Attacker có thể **đặt bất kỳ byte nào** trong $P_i$ mà không cần biết key!

> [!warning] Attack — CBC Bit-Flip
> **Điều kiện**: (a) Attacker kiểm soát phần nào của plaintext, (b) server decrypt và dùng giá trị đó để quyết định logic (admin check, cookie parse, v.v.), (c) attacker có ciphertext tương ứng.
>
> **Side-effect**: $P_{i-1}$ bị corrupt hoàn toàn (random garbage) vì $C_{i-2}$ không bị thay đổi. Attacker phải chắc rằng $P_{i-1}$ bị corrupt không gây crash server.

> [!abstract] Lemma — Bit-Flip Formula
> Để biến byte $P_{i+1}[j]$ từ giá trị $\alpha$ thành giá trị $\beta$:
>
> $$
> C_i'[j] = C_i[j] \oplus \alpha \oplus \beta
> $$

**Proof.** Từ công thức decrypt: $P_{i+1}[j] = D_K(C_{i+1})[j] \oplus C_i[j]$.  
Sau khi flip: $P_{i+1}'[j] = D_K(C_{i+1})[j] \oplus C_i'[j] = D_K(C_{i+1})[j] \oplus C_i[j] \oplus \alpha \oplus \beta = \alpha \oplus \alpha \oplus \beta = \beta$. $\blacksquare$

![[assets/img-08-cbc-bitflip.png]]
*CBC bit-flip: thay đổi byte trong C₂ kiểm soát byte tương ứng trong P₃. P₂ bị corrupt.*

> [!example] Code — CBC Bit-Flip
> ```python
> def flip_bit(ciphertext, block_idx, byte_pos, original_byte, target_byte):
>     ct = bytearray(ciphertext)
>     offset = block_idx * 16 + byte_pos
>     ct[offset] ^= original_byte ^ target_byte
>     return bytes(ct)
>
> original = b"admin=false;role=user"
> ciphertext = encrypt(original)
> modified = flip_bit(ciphertext,
>     block_idx=0,
>     byte_pos=6,
>     original_byte=ord('f'),
>     target_byte=ord('t'))
> ```

---

## 4. Padding Oracle Attack — Phá CBC không cần key

Đây là cuộc tấn công đẹp nhất trong Phase 2. Ý tưởng: từ một **oracle duy nhất** (server trả lời "padding có valid không?"), ta có thể decrypt **toàn bộ ciphertext** mà không cần biết key, chỉ cần một lượng queries đa thức.

### 4.1. PKCS#7 Padding Review

> [!note] PKCS#7 Padding Rule
> Với block size $n = 16$ bytes, nếu plaintext cuối có $m$ bytes $(m < n)$, thêm $k = n - m$ bytes, mỗi byte có giá trị $k$:
>
> | Còn thiếu | Padding thêm |
> |---|---|
> | 1 byte | `\x01` |
> | 3 bytes | `\x03\x03\x03` |
> | 16 bytes (full block) | `\x10\x10...\x10` (16 bytes) |
>
> Padding **luôn được thêm** — kể cả khi message đã là bội của block size (thêm một block đầy 0x10).

### 4.2. The Oracle

Padding Oracle là bất kỳ hệ thống nào khi nhận ciphertext:
1. Decrypt
2. Kiểm tra padding
3. Trả về **thông tin khác nhau** nếu padding valid/invalid

Thông tin rò rỉ có thể là: HTTP 500 vs 200, error message khác nhau, response time khác nhau (Lucky13), hay thậm chí JSON field có mặt hay không.

### 4.3. Attack — Giải mã từng byte

**Mục tiêu**: Decrypt block $C_n$ (block cuối) mà không biết key.

**Bước 1 — Recover byte cuối $P_n[15]$:**

Attacker tạo block giả $C_{n-1}' = b_0 b_1 \ldots b_{14} \beta$, gửi $(C_{n-1}', C_n)$ đến oracle.

Server tính: $P_n'[15] = D_K(C_n)[15] \oplus \beta = I_n[15] \oplus \beta$

Với mỗi $\beta \in \{0, \ldots, 255\}$: nếu oracle trả về **VALID**, thì $P_n'[15] = \text{0x01}$ (single-byte valid padding).

$$
I_n[15] \oplus \beta = \text{0x01} \implies I_n[15] = \beta \oplus \text{0x01}
$$

Sau đó: $P_n[15] = I_n[15] \oplus C_{n-1}[15]$ (XOR với byte thật của $C_{n-1}$).

**Bước 2 — Recover $P_n[14]$:**

Đặt $C_{n-1}'[15] = I_n[15] \oplus \text{0x02}$ (để byte cuối decrypt thành 0x02).
Brute-force $C_{n-1}'[14]$ tương tự. Khi oracle VALID: padding là `0x02 0x02`.

**Tổng quát — Recover $P_n[j]$:**

> [!note] Công thức tổng quát
> Đặt target padding value $v = n - j$ (số byte cần là `v`).
>
> - Fix các byte đã biết: $C_{n-1}'[k] = I_n[k] \oplus v$ cho $k > j$
> - Brute-force: $\beta \in \{0,\ldots,255\}$ cho $C_{n-1}'[j]$
> - Khi oracle VALID: $I_n[j] = \beta \oplus v$ → $P_n[j] = I_n[j] \oplus C_{n-1}[j]$

![[assets/img-08-padding-oracle.png]]
*Padding oracle attack: bruteforce từng byte từ cuối, sử dụng intermediate value I = D_K(C).*

> [!abstract] Theorem — Complexity
> Padding oracle attack cần tối đa $256 \times n \times B$ queries để decrypt $B$ blocks, mỗi block $n$ bytes. Với AES-CBC ($n = 16$):
> $256 \times 16 \times B = 4096B$ queries.

**Proof.** Mỗi trong $n$ bytes của block cần tối đa 256 brute-force queries. Có $B$ blocks. Số queries trung bình còn nhỏ hơn nếu tính stopping early. $\blacksquare$

> [!note] Trung bình thực tế
> Trung bình ~128 queries/byte (kỳ vọng brute-force uniform $\{0,\ldots,255\}$), không phải 256. Tổng trung bình: $128 \times 16 \times B = 2048B$ queries. Con số 4096B là **upper bound**.

> [!example] Code — Padding Oracle Skeleton
> ```python
> def padding_oracle_decrypt(ciphertext, block_size, oracle):
>     blocks = [ciphertext[i:i+block_size]
>               for i in range(0, len(ciphertext), block_size)]
>     plaintext = b""
>     for block_idx in range(1, len(blocks)):
>         prev_block = bytearray(blocks[block_idx - 1])
>         curr_block = blocks[block_idx]
>         intermediate = bytearray(block_size)
>         for byte_pos in range(block_size - 1, -1, -1):
>             pad_val = block_size - byte_pos
>             fake_prev = bytearray(block_size)
>             for k in range(byte_pos + 1, block_size):
>                 fake_prev[k] = intermediate[k] ^ pad_val
>             for guess in range(256):
>                 fake_prev[byte_pos] = guess
>                 test_ct = bytes(fake_prev) + curr_block
>                 if oracle(test_ct):
>                     if byte_pos == block_size - 1:
>                         verify_prev = bytearray(fake_prev)
>                         verify_prev[byte_pos - 1] ^= 1
>                         if not oracle(bytes(verify_prev) + curr_block):
>                             continue
>                     intermediate[byte_pos] = guess ^ pad_val
>                     break
>         plaintext += bytes(x ^ y for x, y in zip(intermediate, prev_block))
>     return plaintext
> ```

> [!tip] Lưu ý edge case khi brute-force byte cuối
> Khi brute-force byte cuối cùng của block, có thể có **two valid values** — ví dụ `\x01` và `\x02\x02` đều valid nếu padding dài hơn. Phải verify bằng cách flip một byte phía trước và re-check.

### 4.4. Real-World Instances

| Tên | Năm | Mô tả |
|-----|-----|-------|
| **Vaudenay** | 2002 | Paper gốc — generic CBC padding oracle |
| **POODLE** | 2014 | SSLv3 padding oracle; downgrade HTTPS → SSL 3.0 |
| **Lucky13** | 2013 | Timing-based oracle trong TLS, không cần error message |
| **ASP.NET** | 2010 | View state decryption qua padding oracle (CVE-2010-3332) |
| **ROBOT** | 2017 | Bleichenbacher (RSA) còn tồn tại trong 27% HTTPS server |

---

## 5. Meet-in-the-Middle — Phá Double Encryption

### 5.1. Nguyên lý Tổng quát

Meet-in-the-Middle (MITM) áp dụng cho **bất kỳ cấu trúc** dạng $C = F_2(F_1(P))$ với $F_1$, $F_2$ độc lập nhau (key riêng biệt). Thay vì brute-force joint key $(K_1, K_2)$ trong $O(2^{|K_1|+|K_2|})$, chia thành hai pha:

$$\underbrace{P \xrightarrow{K_1} M}_{\text{Phase 1: Encrypt forward}} \xrightarrow{\quad\quad} \underbrace{M \xrightarrow{K_2} C}_{\text{Phase 2: Decrypt backward}}$$

- **Phase 1** — Encrypt forward: Tính $M = E_{K_1}(P)$ với mọi $K_1 \in \{0,1\}^{|K_1|}$. Lưu vào bảng $T: M \to K_1$.
- **Phase 2** — Decrypt backward: Với mỗi $K_2 \in \{0,1\}^{|K_2|}$, tính $M' = D_{K_2}(C)$, tra $T[M']$.
- **Match** khi $M' \in T$: tìm được ứng viên $(K_1, K_2)$.

> [!info] Tên gọi
> "Meet in the middle" vì Phase 1 đi từ trái sang (từ $P$) và Phase 2 đi từ phải sang (từ $C$), gặp nhau tại điểm giữa $M$.

### 5.2. Áp Dụng cho 2DES — Phân tích Đầy đủ

Double-DES: $C = E_{K_2}(E_{K_1}(P))$ với $|K_1| = |K_2| = 56$ bit. Keyspace lý thuyết $2^{112}$.

> [!abstract] Theorem — Meet-in-the-Middle trên 2DES
> Từ một known-plaintext pair $(P, C)$, có thể recover $(K_1, K_2)$ với time $O(2^{57})$ và space $O(2^{56})$.

**Proof.** Phase 1: Tính $E_{K_1}(P)$ với mọi $K_1 \in \{0,1\}^{56}$ → $2^{56}$ phép mã hóa. Lưu vào $T$.  
Phase 2: Tính $D_{K_2}(C)$ với mọi $K_2 \in \{0,1\}^{56}$ → tra $T$ → $2^{56}$ phép giải mã.  
Tổng time: $2 \times 2^{56} = O(2^{57})$. Space: $2^{56}$ entries $\times$ 8 bytes/entry $\approx$ **512 MB** — hoàn toàn khả thi. $\blacksquare$

**So sánh với keyspace**: 2DES có keyspace $2^{112}$, nhưng MITM phá trong $O(2^{57})$ — chỉ tốt hơn DES đơn ($2^{56}$) một yếu tố $2$, không phải $2^{56}$ như trông đợi.

**Xử lý False Positives**: Sau Phase 2, có thể nhiều cặp $(K_1, K_2)$ match trên $(P_1, C_1)$.  
Số false positives kỳ vọng: $\frac{2^{112}}{2^{64}} = 2^{48}$ — rất nhiều!

- Verify bằng pair thứ hai $(P_2, C_2)$: kiểm tra $E_{K_2}(E_{K_1}(P_2)) = C_2$.
- Xác suất false positive qua 2 pairs: $2^{48} \times 2^{-64} = 2^{-16}$ → gần như chắc chắn unique.
- Trong CTF: thường 1 pair đã đủ nếu keyspace nhỏ hơn DES.

```python
def mitm_2des(P, C, P2=None, C2=None):
    from Crypto.Cipher import DES
    table = {}
    # Phase 1: encrypt forward
    for k1_int in range(2**56):
        k1 = k1_int.to_bytes(8, 'big')
        k1 = add_parity_bits(k1)  # DES uses 64-bit key with parity
        M = DES.new(k1, DES.MODE_ECB).encrypt(P)
        table[M] = k1
    # Phase 2: decrypt backward
    for k2_int in range(2**56):
        k2 = k2_int.to_bytes(8, 'big')
        k2 = add_parity_bits(k2)
        M_prime = DES.new(k2, DES.MODE_ECB).decrypt(C)
        if M_prime in table:
            k1 = table[M_prime]
            if P2 and DES.new(k2, DES.MODE_ECB).encrypt(
                    DES.new(k1, DES.MODE_ECB).encrypt(P2)) == C2:
                return k1, k2
    return None
```

*(Lưu ý: Code trên chỉ minh họa ý tưởng — thực tế $2^{56}$ iterations cần hardware acceleration hoặc lookup table tối ưu.)*

### 5.3. Áp Dụng cho 3DES (EDE)

3DES: $C = E_{K_3}(D_{K_2}(E_{K_1}(P)))$ — ba key độc lập, tổng 168-bit.

MITM tại join point giữa $K_1$ và $(K_2, K_3)$:
- Phase 1: $M = E_{K_1}(P)$ với mọi $K_1 \in \{0,1\}^{56}$ → $2^{56}$ entries.
- Phase 2: $M' = E_{K_2}(D_{K_3}(C))$ với mọi $(K_2, K_3)$ → $2^{112}$ phép.
- **Time**: $O(2^{112})$, **Space**: $O(2^{56})$.

**Effective security**: $O(2^{112})$ — vẫn mạnh hơn 2DES đáng kể, nhưng không đạt $2^{168}$.

> [!warning] Tại sao 3DES vẫn bị deprecated?
> - **SWEET32 (2016)**: Birthday attack trên block size 64-bit — sau $2^{32}$ blocks (4 GB data), collision xảy ra với xác suất ~50%. Khai thác để recover plaintext trong TLS với 3DES-CBC. Đây là **birthday bound attack**, không phải MITM.
> - **Performance**: 3DES chậm hơn AES-128 tới 3–10 lần.
> - **NIST SP 800-131A Rev 2 (2019)**: Cấm 3DES sau năm 2023 cho mọi ứng dụng chính phủ.

### 5.4. Điều Kiện Tấn Công và CTF Checklist

| Yêu cầu | Chi tiết |
|---------|----------|
| Known-plaintext pairs | Ít nhất 1 pair $(P, C)$; 2–3 để loại false positives |
| Keyspace | Cả $K_1$ và $K_2$ phải đủ nhỏ để phase tương ứng khả thi |
| Independence | $F_1$ và $F_2$ phải độc lập — có join point ở giữa |

> [!tip] CTF Nhận dạng MITM
> - Challenge có "double encryption", "2DES", hoặc hai lần `encrypt()` với key khác nhau.
> - Được cho một plaintext và ciphertext tương ứng.
> - Key length mỗi phần ≤ 24–28 bits → Phase 1 và 2 mỗi cái $\leq 2^{28}$ → feasible.

---

## 6. CTF Checklist — Nhận diện và tấn công

> [!tip] Quy trình tấn công Block Cipher trong CTF
>
> **Bước 1 — Identify mode:**
> - Có IV không? Nếu không → ECB
> - `AES.new(key, AES.MODE_CBC, iv=iv)` → CBC
> - `AES.new(key, AES.MODE_CTR)` / `AES.new(key, AES.MODE_GCM)` → stream-like
>
> **Bước 2 — Identify oracle:**
> - Server có endpoint decrypt không?
> - Response khác nhau khi padding lỗi vs khi parse lỗi?
> - Response time khác nhau? (Lucky13-style)
>
> **Bước 3 — Identify controllable input:**
> - Attacker kiểm soát phần nào của plaintext? (ECB oracle / CBC prefix)
> - Attacker có ciphertext không? (bit-flip / padding oracle)
>
> **Bước 4 — Select attack:**
>
> | Condition | Attack |
> |---|---|
> | ECB + encrypt oracle | Byte-at-a-time OR cut-and-paste |
> | CBC + bit-flip kiểm soát CT | CBC bit-flip |
> | CBC + decrypt oracle (binary) | Padding oracle |
> | Double encryption | MITM |

---

## 7. Mitigation

> [!success] Cách phòng chống
>
> **Thay ECB bằng CBC/CTR/GCM**: ECB không bao giờ nên dùng cho dữ liệu thực tế. Chỉ dùng ECB như một primitive trong construction khác (ví dụ: key wrap).
>
> **Thay CBC bằng AEAD (GCM/ChaCha20-Poly1305)**: GCM cung cấp cả mã hóa lẫn xác thực. Server verify tag **trước** khi decrypt → padding oracle bị chặn hoàn toàn.
>
> **Generic error messages**: Thay vì "Padding Invalid" vs "MAC Failed", luôn trả về một lỗi chung. Nhưng chú ý: timing side-channel vẫn có thể leak (Lucky13 dùng số lượng MAC bytes processed).
>
> **Constant-time comparison**: Dùng `hmac.compare_digest()` thay vì `==` khi so sánh tags/padding.

---

## 8. Summary

Bài học cốt lõi: **mode of operation quyết định security**, không phải bản thân AES.

- **ECB**: Không có context → block độc lập → cut-and-paste, pattern visible. Không bao giờ dùng.
- **CBC bit-flip**: $P_{i+1}[j] = D_K(C_{i+1})[j] \oplus C_i[j]$ → flip $C_i[j]$ kiểm soát $P_{i+1}[j]$. Dùng để bypass authentication.
- **Padding oracle**: Binary oracle về padding → decrypt $O(256 \cdot n \cdot B)$ queries. Áp dụng với mọi scheme "decrypt-then-check-padding".
- **MITM**: $2 \times n$-bit key không cho $2n$-bit security. Time $O(2^n)$, Space $O(2^n)$.
- **Giải pháp thực tế**: Dùng AEAD (GCM, ChaCha20-Poly1305) thay vì CBC thuần túy.

---

## 9. References

- Vaudenay, S. — *Security Flaws Induced by CBC Padding: Applications to SSL, IPSEC, WTLS...*, EUROCRYPT 2002
- Möller, B. et al. — *This POODLE Bites: Exploiting the SSL 3.0 Fallback*, Google Security Research 2014
- AlFardan, N. & Paterson, K. — *Lucky Thirteen: Breaking the TLS and DTLS Record Protocols*, IEEE S&P 2013
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 5 (toc.cryptobook.us)
- Cryptopals Challenges — Set 2, Challenges 11–17 (cryptopals.com)

