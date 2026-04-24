---
title: "08. Information Theory"
type: foundation+attack
tags: [crypto, information-theory, frequency-analysis, entropy, kasiski, IC]
aliases: [Frequency Analysis, Index of Coincidence, Kasiski Examination, Shannon Entropy]
created: 2026-04-16
---

> **Prerequisites**: Classical Ciphers — đặc biệt Vigenère, Encoding & OTP, khái niệm perfect secrecy  
> **Lesson type**: Foundation + Attack (giới thiệu định nghĩa lý thuyết thông tin + áp dụng vào cryptanalysis)
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $H(X)$ | Shannon entropy của biến ngẫu nhiên $X$ (bits) |
> | $H(X \mid Y)$ | Conditional entropy: entropy của $X$ khi biết $Y$ |
> | $I(X;Y)$ | Mutual information: lượng thông tin chung giữa $X$ và $Y$ |
> | $\Pr[X = x]$ | Xác suất sự kiện $X = x$ |
> | $\log_2$ | Logarithm cơ số 2 |
> | $M, C, K$ | Message, Ciphertext, Key |
> | $n_i$ | Số lần chữ cái $i$ xuất hiện trong text |
> | $N$ | Tổng số chữ cái trong text |

---

## 1. Motivation

Tại sao Vigenère cipher — từng được gọi là "le chiffre indéchiffrable" (mật mã không thể phá được) — lại bị bẻ gãy chỉ bằng bút và giấy? Câu trả lời nằm trong một ngành toán học sâu sắc hơn mật mã học: **lý thuyết thông tin** (information theory).

Claude Shannon, trong bài báo năm 1948, đã đặt nền móng cho câu hỏi: *Thông tin là gì? Có bao nhiêu thông tin trong một tin nhắn? Khi nào một ciphertext "rò rỉ" thông tin về plaintext?* Những câu hỏi này không chỉ giải thích tại sao classical ciphers yếu, mà còn định nghĩa chính xác thế nào là "an toàn".

![[assets/img-05-01-english-frequency.png]]
*Phân bố tần suất chữ cái trong tiếng Anh — nền tảng của frequency analysis*

---

## 2. Shannon Entropy — Đo lường Thông tin

Trước Shannon, "thông tin" là một khái niệm mơ hồ. Shannon định nghĩa nó một cách chặt chẽ thông qua **entropy** — đo lượng sự bất định (uncertainty) trung bình trong một nguồn tin.

> [!note] Định nghĩa — Shannon Entropy
> Với biến ngẫu nhiên rời rạc $X$ lấy giá trị trong tập $\mathcal{X}$ với phân bố xác suất $\{p_x = \Pr[X=x]\}_{x \in \mathcal{X}}$, **Shannon entropy** được định nghĩa:
>
> > $$H(X) = -\sum_{x \in \mathcal{X}} p_x \log_2 p_x$$
>
> Đơn vị: bits. Quy ước: $0 \cdot \log_2 0 = 0$.

> [!example] Tính entropy — ví dụ trực quan
> **Tung đồng xu công bằng** (fair coin): $p_H = p_T = 0.5$
>
> > $$H(X) = -0.5\log_2(0.5) - 0.5\log_2(0.5) = -0.5 \cdot (-1) - 0.5 \cdot (-1) = 1 \text{ bit}$$
>
> **Đồng xu lệch** (biased coin): $p_H = 0.9, p_T = 0.1$
>
> > $$H(X) = -0.9\log_2(0.9) - 0.1\log_2(0.1) \approx 0.137 + 0.332 = 0.469 \text{ bits}$$
>
> **Kết luận**: Đồng xu công bằng có entropy tối đa (không chắc chắn nhất), đồng xu lệch có entropy thấp hơn (dễ đoán hơn).

**Entropy tối đa** đạt được khi phân bố đều: $H_{\max} = \log_2 |\mathcal{X}|$ bits. Với 26 chữ cái: $H_{\max} = \log_2 26 \approx 4.7$ bits/chữ cái.

### 2.1. Entropy của Ngôn ngữ Tự nhiên

**Tiếng Anh không có entropy tối đa** — một số chữ cái phổ biến hơn nhiều (E ≈ 12.7%, T ≈ 9.1%) và một số rất hiếm (Q ≈ 0.10%, Z ≈ 0.07%). Entropy của tiếng Anh theo ký tự đơn ≈ 4.14 bits/ký tự (dưới mức tối đa 4.7 bits).

Nếu tính cả **n-gram statistics** (tần suất cặp, bộ ba chữ,...) và ngữ nghĩa, Shannon ước tính entropy thực của tiếng Anh chỉ khoảng **1.0 – 1.5 bits/ký tự** — có nghĩa là văn bản tiếng Anh có rất nhiều redundancy (dư thừa).

> [!info] Redundancy của ngôn ngữ
> **Redundancy** = $1 - H(\text{ngôn ngữ}) / H_{\max}$
>
> Redundancy của tiếng Anh ≈ 70–75%. Nghĩa là khoảng 70% thông tin trong văn bản tiếng Anh là có thể đoán được từ ngữ cảnh. Đây chính là điểm yếu mà frequency analysis khai thác.

### 2.2. Entropy và Perfect Secrecy

Bây giờ ta có thể diễn đạt lại perfect secrecy (L04) theo ngôn ngữ information theory:

> [!abstract] Theorem — Perfect Secrecy ↔ Zero Mutual Information
> Một encryption scheme đạt perfect secrecy nếu và chỉ nếu:
>
> > $$I(M; C) = H(M) - H(M \mid C) = 0$$
>
> Nghĩa là **mutual information** giữa plaintext $M$ và ciphertext $C$ bằng 0 — ciphertext không chứa bất kỳ thông tin nào về plaintext.

**Proof sketch.** $I(M;C) = 0 \Leftrightarrow H(M \mid C) = H(M) \Leftrightarrow \Pr[M = m \mid C = c] = \Pr[M = m]$ với mọi $m, c$ — đây chính là định nghĩa perfect secrecy. $\blacksquare$

OTP: $I(M;C) = 0$ vì key che giấu hoàn toàn plaintext. Caesar cipher: $I(M;C) > 0$ vì ciphertext giữ nguyên frequency distribution của plaintext.

---

## 3. Frequency Analysis — Khai thác Redundancy

**Frequency analysis** là kỹ thuật cryptanalysis được Al-Kindi mô tả lần đầu vào thế kỷ 9, dựa trên quan sát đơn giản: mỗi ngôn ngữ có **đặc trưng tần suất ký tự** riêng biệt và ổn định.

### 3.1. Frequency Distribution của Tiếng Anh

Các chữ cái phổ biến nhất trong tiếng Anh (%) theo thứ tự giảm dần:

| E | T | A | O | I | N | S | H | R | D | L | C | U |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 12.7 | 9.1 | 8.2 | 7.5 | 7.0 | 6.7 | 6.3 | 6.1 | 6.0 | 4.3 | 4.0 | 2.8 | 2.8 |

Mẹo nhớ: **ETAOIN SHRDLU** — 12 chữ cái phổ biến nhất theo thứ tự.

### 3.2. Frequency Analysis trên Caesar/Monoalphabetic

> [!example] Crack Caesar bằng frequency analysis
> **Ciphertext**: `YMJXJHWJYRZWIBXIJXYWTKJ...`
>
> **Bước 1**: Đếm tần suất ký tự trong ciphertext:
> ```text
> J: 18%, X: 14%, W: 12%, Y: 10%, ...
> ```
>
> **Bước 2**: So sánh với tiếng Anh:
> J (thứ nhất trong CT) ↔ E (thứ nhất trong EN) → shift = J - E = 9 - 4 = 5
>
> **Bước 3**: Decrypt với k = 5:
> `THE SECRET WORDS DESTROYED...`

Với **simple substitution cipher** (26! keys), frequency analysis trở nên phức tạp hơn nhưng vẫn có thể: ánh xạ chữ phổ biến nhất trong CT với E, T, A, O, I, N của tiếng Anh, sau đó dùng common digrams (TH, HE, IN, ER, AN) và trigrams (THE, AND, ING) để xác nhận và điền vào.

---

## 4. Index of Coincidence — Nhận diện Cipher Type

Frequency analysis trực tiếp không hoạt động với Vigenère vì nhiều alphabet được dùng luân phiên. Ta cần một công cụ để đo "độ không đồng đều" của phân bố — đó là **Index of Coincidence**.

> [!note] Định nghĩa — Index of Coincidence (IC)
> Cho một chuỗi văn bản độ dài $N$ với chữ cái thứ $i$ xuất hiện $n_i$ lần ($i = A, B, \ldots, Z$):
>
> > $$\mathsf{IC} = \frac{\sum_{i=A}^{Z} n_i(n_i - 1)}{N(N-1)}$$
>
> IC đo **xác suất hai ký tự được chọn ngẫu nhiên từ text là giống nhau**.

> [!abstract] Các giá trị IC chuẩn
> - **English text**: $\mathsf{IC} \approx 0.0667$ (phân bố không đều)
> - **Monoalphabetic cipher** trên tiếng Anh: $\mathsf{IC} \approx 0.0660$ (giống tiếng Anh — vì substitution không đổi tần suất)
> - **Vigenère** với key length = 5: $\mathsf{IC} \approx 0.045$
> - **Random / OTP**: $\mathsf{IC} = 1/26 \approx 0.0385$ (phân bố đều)

**Tại sao monoalphabetic giữ IC?** Vì monoalphabetic chỉ thay thế ký tự, không thay đổi tần suất. Chữ E vẫn là phổ biến nhất, chỉ được gọi bằng tên khác.

**Tại sao Vigenère giảm IC?** Vì key làm cho cùng một ký tự plaintext được mã hóa thành nhiều ký tự ciphertext khác nhau, "phẳng hóa" phân bố. IC càng gần 0.0385 thì key length càng dài (càng giống random).

![[assets/img-05-02-kasiski-ic.png]]
*Kasiski Examination tìm key length, IC xác nhận và dẫn đường cho frequency analysis*

---

## 5. Kasiski Examination — Tìm Key Length

Được Friedrich Kasiski công bố năm 1863 (Charles Babbage độc lập tìm ra năm 1854 nhưng không publish), phương pháp này khai thác tính chất lặp lại của key trong Vigenère.

> [!note] Phương pháp Kasiski
> **Quan sát**: Nếu cùng một đoạn plaintext được mã hóa với cùng một đoạn key (vì key lặp lại), output sẽ giống nhau. Khoảng cách giữa hai lần xuất hiện của trigram lặp là **bội số của key length**.
>
> **Algorithm**:
> 1. Tìm tất cả trigrams (chuỗi 3 ký tự) lặp lại trong ciphertext
> 2. Ghi lại khoảng cách $d_1, d_2, \ldots$ giữa mỗi cặp lần xuất hiện
> 3. Tính $\gcd(d_1, d_2, \ldots)$ — kết quả rất có thể là key length (hoặc ước của nó)
> 4. Thử các ước của GCD làm key length; kiểm tra bằng IC

> [!example] Kasiski trong thực tế
> Ciphertext chứa trigram "NDE" tại vị trí 3 và 21: khoảng cách = 18.
> Trigram "QCP" tại vị trí 7 và 19: khoảng cách = 12.
>
> $\gcd(18, 12) = 6$ → Key length có thể là **6**, 3, 2, hoặc 1.
>
> Kiểm tra: Tách ciphertext thành 6 streams (các ký tự tại vị trí 0, 6, 12, ...; vị trí 1, 7, 13, ...; etc.)
> Tính IC mỗi stream → nếu IC ≈ 0.065 → xác nhận key length = 6.

### 5.1. Friedman Test — Phương pháp IC thay thế

> [!abstract] Friedman Test (1922)
> Dùng IC để ước tính key length trực tiếp:
>
> > $$\kappa = \frac{0.0265 \cdot N}{(0.0655 - 0.0385) \cdot N + (N \cdot \mathsf{IC} - 0.0655)}$$
>
> Trong đó $N$ là độ dài ciphertext và $\mathsf{IC}$ là IC của ciphertext. $\kappa$ là ước tính key length.
>
> Thực tế: chạy IC cho từng key length $m = 1, 2, \ldots$ và chọn $m$ sao cho IC của các sub-streams gần nhất với 0.065.

---

## 6. Full Pipeline: Crack Vigenère

Kết hợp Kasiski + IC + Frequency Analysis:

_(code tham khảo nhớ double check)_
```python
from collections import Counter
import math

def index_of_coincidence(text):
    text = [c for c in text.upper() if c.isalpha()]
    N = len(text)
    if N <= 1:
        return 0
    freq = Counter(text)
    return sum(v * (v - 1) for v in freq.values()) / (N * (N - 1))

def find_key_length_ic(ciphertext, max_keylen=20):
    ct = [c for c in ciphertext.upper() if c.isalpha()]
    results = []
    for keylen in range(1, max_keylen + 1):
        streams = [ct[i::keylen] for i in range(keylen)]
        avg_ic = sum(index_of_coincidence(s) for s in streams) / keylen
        results.append((keylen, avg_ic))
        print(f"Key length {keylen:2d}: avg IC = {avg_ic:.4f}")
    return results

def find_key_length_kasiski(ciphertext, trigram_len=3):
    ct = ciphertext.upper().replace(' ', '')
    positions = {}
    for i in range(len(ct) - trigram_len):
        tri = ct[i:i+trigram_len]
        if tri not in positions:
            positions[tri] = []
        positions[tri].append(i)
    
    distances = []
    for tri, pos_list in positions.items():
        if len(pos_list) > 1:
            for j in range(1, len(pos_list)):
                d = pos_list[j] - pos_list[j-1]
                distances.append(d)
                print(f"'{tri}' repeat at distance {d}")
    
    if distances:
        from math import gcd
        from functools import reduce
        result = reduce(gcd, distances)
        print(f"\nGCD of all distances = {result}")
        return result
    return None

def frequency_analysis_caesar(stream):
    stream = [c for c in stream.upper() if c.isalpha()]
    freq = Counter(stream)
    most_common = freq.most_common(1)[0][0]
    shift = (ord(most_common) - ord('E')) % 26
    return shift, chr(shift + ord('A'))

def crack_vigenere(ciphertext, keylen):
    ct = [c for c in ciphertext.upper() if c.isalpha()]
    key = ""
    for i in range(keylen):
        stream = ct[i::keylen]
        shift, key_char = frequency_analysis_caesar(stream)
        key += key_char
    print(f"Guessed key: {key}")
    
    result = []
    ki = 0
    for c in ciphertext.upper():
        if c.isalpha():
            shift = ord(key[ki % keylen]) - ord('A')
            result.append(chr((ord(c) - ord('A') - shift) % 26 + ord('A')))
            ki += 1
        else:
            result.append(c)
    return ''.join(result)
```

---

## 7. Unicity Distance — Bao nhiêu Ciphertext là Đủ để Crack?

Shannon đưa ra khái niệm **unicity distance** — độ dài ciphertext tối thiểu để có thể (về mặt lý thuyết) crack cipher một cách duy nhất.

> [!note] định nghĩa — Unicity Distance
> Với cipher có key space $\mathcal{K}$ và ngôn ngữ có redundancy $D$ bits/ký tự:
>
> > $$U = \frac{H(K)}{D}$$
>
> Với $H(K) = \log_2 |\mathcal{K}|$ (entropy của key khi key được chọn đều) và $D$ là redundancy của ngôn ngữ.

> [!example] Unicity distance của các cipher
> **Tiếng Anh**: redundancy $D \approx 3.5$ bits/char (từ entropy ~1.5 bits/char, so với max 4.7)
>
> **Caesar cipher**: $H(K) = \log_2 26 \approx 4.7$ bits → $U = 4.7/3.5 \approx 1.4$ ký tự. Nghĩa là chỉ cần ~2 ký tự ciphertext là đủ để crack uniquely!
>
> **Vigenère (key = 6 chữ)**: $H(K) = 6 \times \log_2 26 \approx 28$ bits → $U \approx 28/3.5 = 8$ ký tự. Rất ít — chỉ cần vài chục ký tự ciphertext là đủ.
>
> **OTP**: $H(K) = H(M) = \infty$ (key dài vô hạn) → $U = \infty$. Không bao giờ đủ ciphertext để crack!

Unicity distance **không phải là độ khó thực tế** — nó chỉ nói "về mặt lý thuyết, với bao nhiêu ciphertext thì có duy nhất một key hợp lệ". Trong thực tế, brute-force search vẫn cần tài nguyên lớn hơn nhiều.

---

## 8. IC theo Ngôn ngữ — Bảng Tham khảo

Khi CTF không nói rõ ngôn ngữ của plaintext, IC của ciphertext giúp xác định ngôn ngữ nguồn:

> [!info] Chỉ số IC theo ngôn ngữ (đơn ký tự, chuẩn hóa trên 26 chữ)
>
> | Ngôn ngữ | IC xấp xỉ | Ghi chú |
> |----------|-----------|---------|
> | **Tiếng Anh** | 0.0667 | Chuẩn tham chiếu |
> | **Tiếng Đức** | 0.0762 | IC cao nhất trong các ngôn ngữ Latin |
> | **Tiếng Pháp** | 0.0778 | Cao hơn tiếng Anh |
> | **Tiếng Ý** | 0.0738 | |
> | **Tiếng Tây Ban Nha** | 0.0777 | |
> | **Tiếng Nga** | 0.0529 | Tính trên 26 chữ (giảm vì mapping không hoàn hảo) |
> | **Ngẫu nhiên / OTP** | 0.0385 | $= 1/26$ — phân bố đều |
> | **Vigenère (key dài)** | 0.040–0.050 | Càng gần 0.0385 → key càng dài |
>
> **Ứng dụng CTF**: Nếu IC ≈ 0.075–0.078 nhưng frequency analysis tiếng Anh thất bại, thử tiếng Pháp hoặc Tây Ban Nha. Nếu IC ≈ 0.065 nhưng không match tiếng Anh, kiểm tra Vigenère key length 2–3.

## 9. Entropy để Phân biệt Encrypted vs Compressed

Một kỹ năng thực tế trong CTF và forensics: nhận dạng file đã mã hóa hay nén dựa vào **byte entropy**.

> [!info] Entropy theo loại file (bits/byte)
>
> | Loại file | Entropy xấp xỉ | Lý do |
> |-----------|---------------|-------|
> | Plaintext tiếng Anh | 3.5–5.0 | Tần suất ký tự không đều, nhiều redundancy |
> | File mã nguồn (code) | 5.0–6.5 | Syntax có cấu trúc nhưng ký tự đa dạng |
> | File nén (.zip, .gz) | 7.5–8.0 | Đã loại bỏ redundancy |
> | File mã hóa tốt | ≈ 8.0 | Không phân biệt được với ngẫu nhiên |
> | File ngẫu nhiên thuần | 8.0 | Lý thuyết tối đa |
>
> **Công thức**: Byte entropy = $-\sum_{b=0}^{255} p_b \log_2 p_b$ với $p_b$ = tần suất byte $b$.
>
> **Tools**:
> ```bash
> ent filename          # Linux/Mac: tool 'ent' tính entropy
> binwalk -E filename   # visualize entropy theo từng đoạn file
> ```
> ```python
> from collections import Counter
> import math
>
> def byte_entropy(data: bytes) -> float:
>     n = len(data)
>     counts = Counter(data)
>     return -sum((c/n) * math.log2(c/n) for c in counts.values())
> ```
>
> **Lưu ý**: Entropy ≈ 8.0 có thể là mã hóa hoặc nén. Kiểm tra magic bytes và file header để phân biệt. File `.zip` bắt đầu bằng `PK` (0x504B), file AES-GCM không có magic bytes rõ ràng.

---

## 10. Kết nối với Crypto Hiện đại

Những khái niệm của bài này không chỉ là lý thuyết cổ điển — chúng kết nối trực tiếp với mật mã hiện đại:

> [!info] Các kết nối quan trọng
> **Entropy → Randomness requirements**: Key generation phải có entropy cao. Đây là lý do `os.urandom()` (entropy từ OS) an toàn hơn `random.random()` (deterministic, low entropy).
>
> **IC → Distinguishing attacks**: IC thấp (gần random) = tốt cho cipher. Nếu attacker có thể phân biệt ciphertext với random (IC test), đó là dấu hiệu cipher bị break.
>
> **Redundancy → Birthday paradox** (L10, L11): Tần suất collision trong hash function liên quan trực tiếp đến birthday paradox — $O(2^{n/2})$ thay vì $O(2^n)$.
>
> **Perfect secrecy → Stream cipher design**: ChaCha20 và AES-CTR được thiết kế để output của chúng có IC ≈ 0.0385 (không phân biệt được với random) — đây là điều kiện cần cho computational indistinguishability.

---

## 11. CTF Relevance

**Frequency analysis cần để crack substitution ciphers, Vigenère trong CTF easy/medium**

> [!tip] CTF Checklist cho Frequency Analysis
> **Khi gặp ciphertext chỉ gồm chữ cái:**
> 1. Tính IC → gần 0.067? → Monoalphabetic → dùng frequency analysis ngay
> 2. IC gần 0.038? → Polyalphabetic → cần tìm key length trước
> 3. Dùng Kasiski + IC để tìm key length
> 4. Dùng frequency analysis trên từng stream
>
> **Tools tự động:**
> - `quipqiup.com` — AI-powered monoalphabetic solver (cho ~200+ ký tự)
> - `dcode.fr/vigenere-cipher` — Vigenère cracker tự động
> - `CyberChef` → "Vigenère Decode" với key tìm được

---

## 12. References

- Shannon, C.E. — *A Mathematical Theory of Communication*, Bell System Technical Journal, 1948 (entropy)
- Shannon, C.E. — *Communication Theory of Secrecy Systems*, Bell System Technical Journal, 1949 (unicity distance)
- Al-Kindi, Abu Yusuf — *Risalah fi Istikhraj al-Mu'amma* (~850 CE) — bản thảo gốc của frequency analysis
- Kasiski, F.W. — *Die Geheimschriften und die Dechiffrirkunst*, 1863
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Chapter 2 (toc.cryptobook.us)
- Friedman, W.F. — *The Index of Coincidence and Its Applications in Cryptanalysis*, 1922
- **quipqiup.com** — substitution cipher solver
- **CryptoHack** — Mathematics Category (https://cryptohack.org/challenges/maths/)
