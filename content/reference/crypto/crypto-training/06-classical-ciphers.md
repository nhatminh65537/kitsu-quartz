---
title: "06. Classical Ciphers"
type: foundation+scheme
tags: [crypto, classical, substitution, transposition]
aliases: [Classical Ciphers, Mã hóa Cổ điển]
created: 2026-04-16
---

> **Prerequisites**: CTF big picture, modular arithmetic cơ bản, Python cơ bản  
> **Lesson type**: Foundation + Scheme (hybrid — nhiều scheme được khảo sát ở mức survey)
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}_{26}$ | Vành số nguyên modulo 26: $\{0, 1, \ldots, 25\}$ (tương ứng A–Z) |
> | $P, C, K$ | Plaintext, Ciphertext, Key |
> | $\phi$ | Hàm Euler totient (nhắc lại từ L01) |
> | $\gcd$ | Ước chung lớn nhất (nhắc lại từ L01) |

---

## 1. Motivation

Trước khi máy tính tồn tại, con người đã cần giữ bí mật thông tin từ hàng nghìn năm — từ Julius Caesar mã hóa lệnh quân sự cho đến Đức quốc xã bảo vệ kế hoạch chiến lược trong Thế chiến II. Tất cả những nỗ lực đó được thực hiện bằng tay, không cần thiết bị điện tử.

Hôm nay chúng ta nghiên cứu các **classical cipher** không phải vì chúng còn được dùng trong thực tế — chúng đều đã bị bẻ gãy từ lâu. Chúng ta học chúng vì ba lý do quan trọng: (1) chúng xuất hiện rất phổ biến trong CTF easy/intro; (2) chúng dạy ta tư duy về **pattern recognition** và **statistical analysis** — kỹ năng cốt lõi của cryptanalysis; và (3) chúng giới thiệu hai nguyên lý nền tảng mà Shannon sau này hệ thống hóa: **confusion** và **diffusion**.

![[assets/img-03-03-cipher-taxonomy.png]]
*Phân loại classical cipher thành hai nhóm chính: Substitution và Transposition*

---

## 2. Nguyên lý Cơ bản

Trước khi đi vào các cipher cụ thể, cần nắm hai nguyên lý phân loại:

**Substitution cipher** — giữ nguyên vị trí ký tự, thay thế giá trị của ký tự đó. Mỗi chữ cái trong plaintext được ánh xạ sang một hoặc nhiều chữ cái khác theo một quy tắc xác định bởi key.

**Transposition cipher** — giữ nguyên giá trị ký tự, thay đổi vị trí của chúng. Plaintext được sắp xếp lại theo một pattern nhất định, không có ký tự nào bị thay thế.

Một cipher có thể kết hợp cả hai (product cipher), và thực tế đó chính là hướng mà mật mã hiện đại phát triển.

---

## 3. Substitution Ciphers

### 3.1. Monoalphabetic Substitution

Trong **monoalphabetic substitution**, mỗi chữ cái plaintext luôn luôn ánh xạ đến cùng một chữ cái ciphertext, bất kể vị trí trong message. Đây là điểm yếu chí tử của chúng: tần suất xuất hiện của ký tự được bảo toàn.

> [!note] Scheme — Caesar Cipher (Shift Cipher)
> **Type**: Monoalphabetic Substitution
> **Key space**: $\mathcal{K} = \mathbb{Z}_{26}$, key $k \in \{0, 1, \ldots, 25\}$
>
> **$\mathsf{Enc}(k, P)$**
> - Input: key $k$, plaintext letter $P \in \mathbb{Z}_{26}$
> - Output: $C = (P + k) \bmod 26$
>
> **$\mathsf{Dec}(k, C)$**
> - Input: key $k$, ciphertext letter $C \in \mathbb{Z}_{26}$
> - Output: $P = (C - k) \bmod 26$

![[assets/img-03-01-caesar-shift.png]]
*Caesar shift với k = 3: mỗi chữ cái dịch sang phải 3 vị trí, cuộn vòng khi vượt qua Z*

**Tại sao yếu?** Key space chỉ có 26 giá trị (thực tế là 25 vì k=0 là identity). Brute-force toàn bộ key space chỉ mất vài giây.

> [!note] Scheme — Affine Cipher  
> **Type**: Monoalphabetic Substitution (tổng quát hóa Caesar)  
> **Key space**: $\mathcal{K} = \{(a, b) : a \in \mathbb{Z}_{26}^*, b \in \mathbb{Z}_{26}, \gcd(a, 26) = 1\}$
>
> **$\mathsf{Enc}((a,b), P)$**
> - Output: $C = (aP + b) \bmod 26$
>
> **$\mathsf{Dec}((a,b), C)$**
> - Output: $P = a^{-1}(C - b) \bmod 26$
> - với $a^{-1}$ là nghịch đảo modular của $a$ trong $\mathbb{Z}_{26}$

Điều kiện $\gcd(a, 26) = 1$ đảm bảo $a^{-1}$ tồn tại, và do đó decryption là duy nhất. Các giá trị $a$ hợp lệ trong $\mathbb{Z}_{26}$: $\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\}$ — có $\phi(26) = 12$ giá trị. Tổng key space: $12 \times 26 = 312$ — vẫn nhỏ, vẫn bị brute-force.

> [!info] Các biến thể monoalphabetic khác
> - **Atbash**: đặc biệt của Affine với $a = -1 \equiv 25$, $b = 25$. A→Z, B→Y, ... Z→A. Gốc từ tiếng Hebrew cổ.
> - **ROT13**: Caesar với $k = 13$. Tự đảo ngược ($\mathsf{Enc} = \mathsf{Dec}$). Dùng để "che" spoiler trên forums.
> - **Simple substitution (keyword cipher)**: thay thế toàn bộ alphabet bằng hoán vị tùy ý. Key space = $26! \approx 4 \times 10^{26}$, nhưng vẫn bị frequency analysis.

### 3.2. Polyalphabetic Substitution

Polyalphabetic ciphers sử dụng nhiều alphabet thay thế khác nhau cho các vị trí khác nhau trong message, làm phẳng phân bố tần suất của ciphertext.

> [!note] Scheme — Vigenère Cipher
> **Type**: Polyalphabetic Substitution  
> **Key**: chuỗi $K = k_1 k_2 \ldots k_m$ với $k_i \in \mathbb{Z}_{26}$
>
> **$\mathsf{Enc}(K, P)$** với $P = P_1 P_2 \ldots P_n$
> - Với vị trí $i$: $C_i = (P_i + k_{(i-1 \bmod m) + 1}) \bmod 26$
> - Key được lặp lại theo chu kỳ $m$ khi message dài hơn key
>
> **$\mathsf{Dec}(K, C)$**
> - $P_i = (C_i - k_{(i-1 \bmod m) + 1}) \bmod 26$

**Ví dụ**: Với key = "KEY", plaintext = "HELLO":
- H + K(10) = R, E + E(4) = I, L + Y(24) = J, L + K(10) = V, O + E(4) = S
- Ciphertext: RIJVS

Vigenère từng được gọi là "le chiffre indéchiffrable" (mật mã không thể phá) trong suốt ba thế kỷ — cho đến khi Charles Babbage (1854) và Friedrich Kasiski (1863) độc lập tìm ra cách phá nó.

> [!note] Scheme — Autokey Cipher (Autoclave Cipher)
> **Type**: Polyalphabetic Substitution (Vigenère variant)  
> **Priming key**: $k_0 = k_1 k_2 \ldots k_r$ — chuỗi khởi tạo ngắn, $r \ll |M|$
>
> **Key generation** (plaintext-autokey):
> $$K_i = \begin{cases} k_i & \text{nếu } i \leq r \\ P_{i-r} & \text{nếu } i > r \end{cases}$$
> Key thực tế = priming key $\|$ plaintext (message tự trở thành key của chính nó).
>
> **$\mathsf{Enc}(k_0, P)$**
> - $C_i = (P_i + K_i) \bmod 26$ — giống Vigenère nhưng key không lặp lại
>
> **$\mathsf{Dec}(k_0, C)$**
> - $P_i = (C_i - K_i) \bmod 26$
> - $i \leq r$: $K_i = k_i$ (đã biết từ priming key)
> - $i > r$: $K_i = P_{i-r}$ (đã recover từ bước trước)

**Ưu điểm so với Vigenère**: Key không lặp lại trong một message → **Kasiski examination thất bại** (không còn trigram lặp do key lặp), **IC test mất tác dụng** (không phát hiện được key length).

**Điểm yếu**:
- **Bootstrapping attack**: Nếu attacker đoán đúng $P_i$ thì biết $K_{i+r}$, từ đó recover $P_{i+r}$, tiếp tục cascades ra toàn bộ message.
- **Known-plaintext attack**: Biết phần đầu message → recover toàn bộ keystream.
- **Brute-force priming key**: Nếu priming key ngắn (1–3 ký tự), brute-force qua 26 / $26^2$ / $26^3$ khả năng là khả thi.

```python
def autokey_encrypt(plaintext, priming_key):
    pt = [ord(c) - 65 for c in plaintext.upper() if c.isalpha()]
    key = [ord(c) - 65 for c in priming_key.upper()] + pt
    return ''.join(chr((pt[i] + key[i]) % 26 + 65) for i in range(len(pt)))

def autokey_decrypt(ciphertext, priming_key):
    ct = [ord(c) - 65 for c in ciphertext.upper() if c.isalpha()]
    key = [ord(c) - 65 for c in priming_key.upper()]
    pt = []
    for i, c in enumerate(ct):
        k = key[i] if i < len(priming_key) else pt[i - len(priming_key)]
        p = (c - k) % 26
        pt.append(p)
        key.append(p)
    return ''.join(chr(p + 65) for p in pt)

def autokey_brute(ciphertext, known_crib, max_keylen=3):
    import itertools
    for keylen in range(1, max_keylen + 1):
        for combo in itertools.product(range(26), repeat=keylen):
            priming = ''.join(chr(k + 65) for k in combo)
            pt = autokey_decrypt(ciphertext, priming)
            if known_crib.upper() in pt:
                print(f"Key: {priming} → {pt}")
```

> [!info] Các Variant Khác Cùng Họ Polyalphabetic
> - **Beaufort Cipher**: $C_i = (K_i - P_i) \bmod 26$ — đảo vai trò so với Vigenère. Tự đảo ngược ($\mathsf{Enc} = \mathsf{Dec}$). Dùng trong máy mã Hagelin M-209 (thay thế Vigenère cơ bản).
> - **Running Key Cipher**: Key là một đoạn văn dài (một quyển sách, bài thơ). Không lặp key → Kasiski thất bại. Dễ bị phá bởi known-plaintext và coincidence index vì key cũng là ngôn ngữ tự nhiên (không ngẫu nhiên thực sự).
> - **Ciphertext Autokey**: $K_i = C_{i-r}$ (dùng ciphertext thay vì plaintext làm key). Khó decrypt hơn nếu bị lỗi transmission.

> [!tip] CTF Nhận dạng Autokey
> - Challenge description có từ "autoclave", "autokey", "running key", "self-keying".
> - Source code chứa `key += plaintext[i]` hoặc `key = priming_key + plaintext`.
> - Chiến lược: brute-force priming key (nếu ngắn), hoặc dùng known-plaintext đầu message để khởi động decrypt.

### 3.3. Polygraphic Substitution

Polygraphic ciphers mã hóa nhóm chữ cái cùng lúc, tạo ra sự phụ thuộc giữa các ký tự.

![[assets/img-03-02-playfair-grid.png]]
*Playfair cipher: key matrix 5×5 với keyword CRYPTOGRAPHY, mã hóa theo từng cặp chữ (digraph)*

> [!note] Scheme — Playfair Cipher
> **Type**: Polygraphic Substitution (digraph = cặp 2 chữ)  
> **Key**: keyword → 5×5 matrix (kết hợp I/J)
>
> **Quy tắc chuẩn bị plaintext**:
> - Loại bỏ spaces, uppercase toàn bộ, thay J bằng I
> - Tách thành digraphs; nếu cặp trùng nhau, chèn 'X' vào giữa
> - Nếu số ký tự lẻ, thêm 'X' vào cuối
>
> **$\mathsf{Enc}(\text{matrix}, (P_1, P_2))$** — ba trường hợp:
> - **Cùng hàng**: dịch mỗi ký tự sang phải 1 ô (cuộn vòng)
> - **Cùng cột**: dịch mỗi ký tự xuống dưới 1 ô (cuộn vòng)
> - **Hình chữ nhật**: mỗi ký tự lấy cột của ký tự kia, giữ nguyên hàng

Playfair an toàn hơn monoalphabetic vì nó mã hóa 26×26 = 676 digraph thay vì 26 monograph. Tuy nhiên, đủ ciphertext (vài trăm ký tự) là có thể crack bằng bigram frequency analysis.

> [!note] Scheme — Hill Cipher (Matrix Substitution)
> **Type**: Polygraphic, block size $n$
> **Key**: ma trận khả nghịch $K \in \mathbb{Z}_{26}^{n \times n}$, yêu cầu $\det(K)$ khả nghịch mod 26
>
> **$\mathsf{Enc}(K, \mathbf{P})$** với $\mathbf{P} \in \mathbb{Z}_{26}^n$
> - $\mathbf{C} = K\mathbf{P} \bmod 26$
>
> **$\mathsf{Dec}(K, \mathbf{C})$**
> - $\mathbf{P} = K^{-1}\mathbf{C} \bmod 26$
> - với $K^{-1}$ là nghịch đảo ma trận modular

Hill cipher bị phá bởi **known-plaintext attack**: nếu attacker biết $n$ cặp (plaintext block, ciphertext block), có thể dựng hệ phương trình tuyến tính để recover $K$.

---

## 4. Transposition Ciphers

Trong transposition cipher, bản thân ký tự không thay đổi — chỉ có vị trí của chúng bị xáo trộn. Điều này có nghĩa là frequency distribution của ký tự trong ciphertext giống hệt plaintext, nhưng thứ tự thì khác.

> [!note] Scheme — Columnar Transposition
> **Key**: chuỗi $K = k_1 k_2 \ldots k_m$ (xác định thứ tự cột)
>
> **$\mathsf{Enc}(K, P)$**:
> 1. Viết $P$ thành ma trận $\lceil n/m \rceil$ hàng, $m$ cột (điền null vào ô trống)
> 2. Đọc các cột theo thứ tự alphabetical của ký tự trong $K$

**Ví dụ** với key = "CRYPTO" và plaintext = "WEAREDISCOVEREDSAVEYOURSELF":

```text
Key:      C R Y P T O    (positions sorted alphabetically)
Order:    1 4 6 3 5 2

1 2 3 4 5 6
W E A R E D
I S C O V E
R E D S A V
E Y O U R S
E L F 

Đọc theo cột 1,4,6,3,5,2 → WIREE ROSUD EVSAC DOFE VARE SEYL
```

Transposition cipher bị phá bằng **anagram analysis**: người ta thử các hoán vị cột và kiểm tra xem có tạo ra văn bản có nghĩa không. Với key length ngắn, có thể brute-force hoàn toàn.

> [!info] Rail Fence Cipher
> Một dạng transposition đơn giản: viết plaintext theo pattern zigzag qua nhiều "rail" (hàng rào), sau đó đọc theo từng rail.
>
> Với 2 rails và plaintext "HELLOWORLD":
> ```text
> H . L . O . O . L .
> . E . L . W . R . D
> ```
> Ciphertext = HLOOL + ELWRD = HLOOI ELWRD (ghép các rail)

---

## 5. Hai Nguyên lý Thiết kế — Confusion & Diffusion

Claude Shannon trong bài báo kinh điển 1949 đề xuất hai thuộc tính mà một cipher tốt phải có:

> [!info] Shannon's Two Principles (1949)
> **Confusion (Nhầm lẫn)**: Làm cho mối quan hệ giữa key và ciphertext càng phức tạp càng tốt. Thay đổi một bit của key nên ảnh hưởng đến toàn bộ ciphertext theo cách không thể đoán được. *Thực hiện bởi: S-box trong AES, substitution layer.*
>
> **Diffusion (Khuếch tán)**: Mỗi bit plaintext ảnh hưởng đến nhiều bits ciphertext. Thay đổi 1 bit plaintext nên thay đổi ~50% bits ciphertext. *Thực hiện bởi: ShiftRows và MixColumns trong AES, permutation layer.*

Classical ciphers đạt được một trong hai nhưng không cả hai:
- Monoalphabetic: có confusion (từng bit), nhưng không có diffusion (mỗi ký tự độc lập).
- Transposition: có diffusion (ký tự lan ra khắp message), nhưng không có confusion (ký tự không thay đổi giá trị).
- **AES**: có cả hai → an toàn.

---

## 6. Kerckhoffs's Principle

> [!abstract] Nguyên lý Kerckhoffs (1883)
> *"A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."*
>
> **Hệ quả thực tiễn**: Security không được phụ thuộc vào việc giữ bí mật algorithm — chỉ giữ bí mật key. Algorithm có thể (và nên) được công khai để được phân tích và kiểm tra bởi cộng đồng.

Nguyên lý này trực tiếp phủ nhận **security through obscurity** — quan niệm sai lầm rằng giấu thuật toán giúp hệ thống an toàn hơn. Thực tế ngược lại: các hệ thống giữ bí mật algorithm thường chứa lỗ hổng ẩn. Ví dụ:

> [!warning] Security Through Obscurity — Ví dụ thất bại
> Thuật toán mã hóa A5/1 trong GSM (điện thoại 2G) được giữ bí mật từ 1987 đến 1994, nhưng reverse-engineer được và được phát hiện có nhiều điểm yếu nghiêm trọng. Nếu nó được public ngay từ đầu và phân tích, lỗ hổng đã được fix sớm hơn.

---

## 7. CTF Relevance

**Classical ciphers xuất hiện trong hầu hết mọi CTF easy/intro**. Kỹ năng quan trọng nhất không phải là nhớ từng cipher — mà là **nhận diện** loại cipher từ hình dạng của ciphertext.

> [!tip] Checklist nhận diện cipher trong CTF
> 1. **Chỉ gồm A-Z (uppercase, không space, không số)?** → Rất có thể là classical substitution/transposition
> 2. **Ciphertext length = plaintext length?** → Substitution (không thêm ký tự)
> 3. **Chỉ có chữ in hoa, xuất hiện theo pairs?** → Playfair (I/J merged, no repeated in pair)
> 4. **Có pattern lặp lại rõ ràng?** → Monoalphabetic → dùng frequency analysis
> 5. **Frequency distribution phẳng nhưng length giữ nguyên?** → Polyalphabetic (Vigenère)
> 6. **Tất cả chữ cái gốc còn đó, chỉ xáo trộn?** → Transposition → thử anagram
> 7. **Dùng CyberChef "Magic" để auto-detect**

> [!example] Nhận diện nhanh trong practice
> Ciphertext: `KHOOR ZRUOG` → Frequency analysis → H xuất hiện nhiều → H=E → shift=3 → Caesar với k=3 → "HELLO WORLD" (ví dụ này hơi ngắn phân tích tần suât chưa được)  
> Ciphertext: `aGVsbG8gV29ybGQ=` → Dấu `=` ở cuối, có cả chữ thường/hoa/số → Base64 encoding (không phải cipher!)  
> Ciphertext: `Gur dhvpx oebja sbk` → ROT13 (shift = 13, ciphertext có cả chữ thường)

---

## 8. Công cụ & Code

_(Code minh họa tham khảo)_
```python
def caesar_encrypt(text, shift):
    result = []
    for ch in text.upper():
        if ch.isalpha():
            result.append(chr((ord(ch) - 65 + shift) % 26 + 65))
        else:
            result.append(ch)
    return ''.join(result)

def caesar_brute(ciphertext):
    for shift in range(26):
        pt = caesar_encrypt(ciphertext, -shift)
        print(f"k={shift:2d}: {pt}")

def affine_encrypt(text, a, b):
    from math import gcd
    assert gcd(a, 26) == 1, "a phải coprime với 26"
    return ''.join(
        chr((a * (ord(c) - 65) + b) % 26 + 65) if c.isalpha() else c
        for c in text.upper()
    )

def vigenere_encrypt(text, key):
    key = key.upper()
    result, ki = [], 0
    for ch in text.upper():
        if ch.isalpha():
            shift = ord(key[ki % len(key)]) - 65
            result.append(chr((ord(ch) - 65 + shift) % 26 + 65))
            ki += 1
        else:
            result.append(ch)
    return ''.join(result)

def vigenere_decrypt(ct, key):
    key = key.upper()
    result, ki = [], 0
    for ch in ct.upper():
        if ch.isalpha():
            shift = ord(key[ki % len(key)]) - 65
            result.append(chr((ord(ch) - 65 - shift) % 26 + 65))
            ki += 1
        else:
            result.append(ch)
    return ''.join(result)
```

**Tools online:**
- **dcode.fr** — giải được gần như mọi classical cipher, có solver tự động (best choice)
- **CyberChef** — ROT13, Caesar brute, Vigenère decode
- **quipqiup.com** — AI-powered monoalphabetic substitution solver

---

## 9. Summary

- **Classical ciphers** chia thành hai loại: **Substitution** (thay thế ký tự) và **Transposition** (hoán vị vị trí)
- Monoalphabetic (Caesar, Affine, Atbash, ROT13): mỗi ký tự ánh xạ cố định → frequency analysis phá được
- Polyalphabetic (Vigenère): nhiều alphabet → frequency analysis khó hơn nhưng không impossible (xem L05)
- Polygraphic (Playfair, Hill): mã hóa theo nhóm → cần bigram/trigram analysis
- **Kerckhoffs's principle**: security phụ thuộc key, không phụ thuộc algorithm
- **Confusion vs Diffusion** (Shannon): hai nguyên lý thiết kế cipher hiện đại; classical cipher thiếu ít nhất một trong hai

---

## 10. References

- Shannon, C.E. — *Communication Theory of Secrecy Systems*, Bell System Technical Journal, 1949
- Kerckhoffs, A. — *La Cryptographie Militaire*, Journal des Sciences Militaires, 1883
- Stallings, W. — *Cryptography and Network Security*, Chapter 2 (Classical Encryption)
- Singh, S. — *The Code Book* (đọc thêm, rất dễ đọc, nhiều ví dụ lịch sử sinh động)
- **dcode.fr** — classical cipher solver tổng hợp
- **CryptoHack** — Introduction Challenges (https://cryptohack.org/challenges/introduction/)
