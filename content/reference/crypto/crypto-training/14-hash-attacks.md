---
title: "14. Hash Attacks"
type: attack
tags: [crypto, hash, length-extension, md5-collision, rainbow-table, hashpump]
aliases: [Hash Attacks]
created: 2026-04-17
---

> **Prerequisites**: [[13-hash-functions|13 — Hash Functions: Structure & Properties]]  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $H$ | Hash function (MD5, SHA-1, SHA-256, ...) |
> | $K$ | Secret key dùng trong MAC |
> | $M$ | Known message (attacker biết) |
> | $\text{pad}(M, \ell_K)$ | Merkle–Damgård padding của $K \| M$ với key length $\ell_K$ |
> | $\text{ext}$ | Extension data do attacker chọn |
> | $S$ | Internal state sau khi hash $K \| M \| \text{pad}$ |
> | $n$ | Hash output size (bits) |

---

## 1. Tổng quan

Bài trước cho thấy hash functions có thể được xây dựng an toàn về mặt lý thuyết. Bài này đi sang phía ngược lại: **khi implementation sử dụng hash functions sai cách**, các tính chất bảo mật của hàm hash không giúp ích gì.

Ba attack được học trong bài này đều là **misuse attacks** — không phải break hash function, mà là break hệ thống dùng hash function sai cách:

1. **Length Extension Attack** — khai thác cấu trúc Merkle–Damgård để forge MAC mà không biết key
2. **MD5 Collision** — tìm hai file khác nhau có cùng hash; khai thác trong chứng chỉ và malware
3. **Rainbow Table Attack** — precomputed lookup để crack password hash không có salt

---

## 2. Attack — Length Extension Attack

### 2.1. Context & Conditions

> [!warning] Điều kiện tấn công
> Attack áp dụng khi **đồng thời** tất cả điều kiện sau:
> 1. MAC được tính bằng $H(K \| M)$ hoặc $H(M \| K)$ (không phải HMAC)
> 2. $H$ dùng Merkle–Damgård construction: **MD5, SHA-1, SHA-256, SHA-512**
> 3. Attacker biết: $H(K \| M)$, $M$, $\ell_K = |K|$ (độ dài key, hoặc có thể brute-force)
>
> **Không áp dụng** với: SHA-384, SHA-512/256 (truncated), SHA-3, BLAKE2, HMAC.

### 2.2. Intuition

Trong Merkle–Damgård, hash output $H(M) = H_\ell$ chính là **internal state** sau khi xử lý toàn bộ message. State này là đủ để "tiếp tục" quá trình hashing — cộng thêm block mới mà không cần biết gì về message đã hash.

Attacker đã có $H(K \| M)$ = internal state $S$ sau khi xử lý $K \| M \| \text{pad}$. Từ đó, attacker có thể tính $H(K \| M \| \text{pad} \| \text{ext})$ cho bất kỳ `ext` nào mà không cần biết $K$.

![[assets/img-11-length-extension.png]]
*Length Extension Attack: attacker dùng MAC như internal state để tiếp tục hashing, forge MAC mới hợp lệ.*

### 2.3. Formal Attack

> [!note] Algorithm — Length Extension Attack
> **Input**:
> - Hash value $h = H(K \| M)$ (là MAC attacker nhận được)
> - Message $M$ (known plaintext)
> - Key length $\ell_K$ (biết hoặc brute-force)
> - Extension data $\text{ext}$ (attacker chọn tùy ý)
>
> **Bước 1 — Tính padding**: Tính padding $P$ mà hash function sẽ thêm vào sau $K \| M$:
>
> $$
> P = \texttt{0x80} \| \texttt{0x00}^k \| \langle \ell_K + |M| \rangle_{64}
> $$
>
> trong đó $k$ được chọn để $(\ell_K + |M| + 1 + k + 8)$ là bội của block size (64 bytes với SHA-256).
>
> **Bước 2 — Khôi phục state**: Load $h$ như initial state $S$ của SHA-256. Đặt internal counter = $(\ell_K + |M| + |P|) / 64$ blocks (đã xử lý).
>
> **Bước 3 — Tiếp tục hash**: Tính $h' = \text{SHA256\_continue}(S, \text{ext})$ — hash `ext` từ state $S$.
>
> **Output**: Forged MAC $h'$ cho message $M' = M \| P \| \text{ext}$
>
> **Kết quả**: Server sẽ chấp nhận $(M', h')$ là hợp lệ vì:
>
> $$
> H(K \| M \| P \| \text{ext}) = \text{SHA256\_continue}(H(K \| M \| P),\; \text{ext}) = h'
> $$

### 2.4. Complexity

- **Time**: $O(|\text{ext}| / B)$ — tuyến tính theo độ dài extension, cực nhanh
- **Queries**: $O(\ell_{K,\max})$ nếu phải brute-force key length — thường $\leq 256$ iterations
- **Success probability**: 1 (deterministic attack)

### 2.5. Implement: hashpumpy

> [!example] CTF Exploit Pattern — Length Extension với hashpumpy
>
> ```python
> import hashpumpy
> import requests
>
> known_hash = "6fc3b5d7a8e2f1c4..."
> known_msg  = "user=alice&role=user"
> append_msg = "&role=admin"
> key_length = 16
>
> new_hash, new_msg = hashpumpy.hashpump(
>     known_hash,
>     known_msg,
>     append_msg,
>     key_length
> )
>
> print(f"New hash: {new_hash}")
> print(f"New msg: {new_msg}")
> ```
>
> `hashpumpy` tự động tính padding và tiếp tục hash từ state. Nếu không biết key length, loop từ 1 đến 64:
>
> ```python
> for key_len in range(1, 65):
>     new_hash, new_msg = hashpumpy.hashpump(
>         known_hash, known_msg, append_msg, key_len
>     )
>     resp = send_to_server(new_msg, new_hash)
>     if resp != "invalid":
>         print(f"Key length: {key_len}")
>         break
> ```

> [!example] Implement thủ công (không dùng hashpumpy)
>
> ```python
> import struct
>
> def md_padding(msg_len):
>     """Compute Merkle-Damgard padding for SHA-256."""
>     padding = b'\x80'
>     padding += b'\x00' * ((55 - msg_len) % 64)
>     padding += struct.pack('>Q', msg_len * 8)
>     return padding
>
> def sha256_from_state(state_hex, data, prev_len):
>     """Continue SHA-256 from a known state.
>     state_hex: 64-char hex string (32 bytes)
>     data: bytes to hash
>     prev_len: number of bytes already processed (for counter)
>     """
>     import hashlib, ctypes
>
>     h = hashlib.sha256()
>     state = [int(state_hex[i:i+8], 16) for i in range(0, 64, 8)]
>
>     h._state = state
>     h._count[0] = (prev_len * 8) & 0xFFFFFFFF
>     h._count[1] = (prev_len * 8) >> 32
>
>     h.update(data)
>     return h.hexdigest()
> ```
>
> Lưu ý: Python's `hashlib` không expose state trực tiếp — trong CTF thường dùng `hashpumpy` hoặc implement SHA-256 từ đầu (SageMath có thể giúp).

### 2.6. Mitigation

- Dùng **HMAC** thay vì $H(K \| M)$
- Dùng SHA-3 hoặc BLAKE2 — sponge construction không bị length extension
- Dùng SHA-256 nhưng theo dạng **HMAC-SHA256** — cũng an toàn dù SHA-256 bị LEA

---

## 3. Attack — MD5 Collision và Chosen-Prefix Collision

### 3.1. Context & Conditions

> [!warning] Điều kiện
> - Hash function là **MD5** hoặc **SHA-1**
> - Attacker muốn tạo hai documents $D_1 \neq D_2$ sao cho $H(D_1) = H(D_2)$
> - **Chosen-prefix collision** (mạnh hơn): chọn trước hai prefix $P_1 \neq P_2$, tìm suffix $S_1, S_2$ sao cho $H(P_1 \| S_1) = H(P_2 \| S_2)$

![[assets/img-11-md5-collision.png]]
*MD5 collision và các hậu quả thực tế; so sánh password hashing đúng vs sai.*

### 3.2. MD5 Collision (Wang et al. 2004)

Xiaoyun Wang và nhóm Shandong University công bố năm 2004: tìm collision MD5 trong $\approx 2^{39}$ operations — thực tế chỉ mất **vài giây** trên PC hiện đại.

**Core idea**: Differential cryptanalysis — kiểm soát sự khác biệt giữa hai messages theo cách truyền qua các round của MD5 để "cancel out" ở output.

```text
M₁ = [block₁_variant_A]  →  MD5 → HASH_X
M₂ = [block₁_variant_B]  →  MD5 → HASH_X   ← SAME
```

Tool **fastcoll** tạo MD5 collision trong < 1 giây:

> [!example] Demo MD5 Collision
>
> ```bash
> # Tạo MD5 collision
> fastcoll -o file_a.bin file_b.bin
>
> # Verify
> md5sum file_a.bin file_b.bin
> # a1b2c3d4...  file_a.bin
> # a1b2c3d4...  file_b.bin  ← SAME HASH!
>
> diff file_a.bin file_b.bin
> # Binary files differ  ← DIFFERENT CONTENT!
> ```
>
> ```python
> import hashlib
>
> with open("file_a.bin","rb") as f: data_a = f.read()
> with open("file_b.bin","rb") as f: data_b = f.read()
>
> print(hashlib.md5(data_a).hexdigest())
> print(hashlib.md5(data_b).hexdigest())
> print("Collision:", data_a != data_b and
>       hashlib.md5(data_a).digest() == hashlib.md5(data_b).digest())
> ```

### 3.3. Chosen-Prefix Collision và SHA-1 SHAttered

**Chosen-prefix collision** mạnh hơn nhiều: attacker chọn trước nội dung hai documents, sau đó tìm thêm vài block để hashes match. Điều này cho phép forge documents với content tùy ý.

> [!danger] Real-World Impact
>
> **2008 — Rogue CA Attack (Sotirov et al.)**
> Dùng MD5 chosen-prefix collision để forge một intermediate CA certificate. Certificate giả trông hợp lệ vì có chữ ký của CA thật (ký trên file có cùng MD5 với file giả). Tất cả browsers lúc đó tin tưởng certificate này.
>
> **2012 — Flame Malware**
> Nation-state malware giả mạo Windows Update bằng cách exploit MD5 collision trong code signing mechanism của Microsoft. Máy victims tự động tải và cài Flame vì nghĩ đó là Windows Update hợp lệ.
>
> **2017 — SHAttered (Google/CWI)**
> SHA-1 chosen-prefix collision. Tạo 2 file PDF khác nhau hoàn toàn (nội dung, màu sắc) nhưng cùng SHA-1 hash. Cost: ~$110,000 GPU compute. Chứng minh SHA-1 không thể dùng cho bất kỳ security purpose nào.

### 3.4. CTF Pattern: Collision Exploit

> [!example] CTF Pattern — Exploit MD5 Collision
>
> ```python
> import hashlib
>
> # Scenario: server dùng MD5 làm signature
> # Attacker có legitimate file và muốn forge
>
> # Dùng fastcoll để tạo collision pair
> # fastcoll -p legitimate_prefix.bin -o good.bin evil.bin
>
> # Both hash to same MD5 value
> # Submit evil.bin nhưng dùng MD5 của good.bin
>
> # Python: detect nếu challenge dùng MD5 as integrity check
> def vulnerable_check(file_bytes, expected_md5):
>     return hashlib.md5(file_bytes).hexdigest() == expected_md5
>
> # Correct check dùng SHA-256:
> def secure_check(file_bytes, expected_sha256):
>     return hashlib.sha256(file_bytes).hexdigest() == expected_sha256
> ```

### 3.5. Mitigation

- **Không dùng MD5 hoặc SHA-1** cho bất kỳ security purpose nào
- Dùng SHA-256 trở lên, hoặc SHA-3
- Git đang migrate từ SHA-1 sang SHA-256 (Git 2.29+)

---

## 4. Attack — Rainbow Table và Password Cracking

### 4.1. Context & Conditions

> [!warning] Điều kiện
> - Attacker có database bị leak chứa password hashes
> - Hash không dùng salt, hoặc salt bị lộ và là constant
> - Hash function nhanh (MD5, SHA-1, SHA-256 plain)

### 4.2. Rainbow Table Attack

**Rainbow table** là cấu trúc dữ liệu precomputed kết hợp nhiều chuỗi hash:

> [!note] Algorithm — Rainbow Table Lookup
> **Offline phase** (tạo table — tốn thời gian, làm một lần):
> - Khởi đầu nhiều "chains" từ các password ngẫu nhiên
> - Mỗi chain xen kẽ hash $H$ và reduction function $R_i$:
>
> $$
> p_0 \xrightarrow{H} h_0 \xrightarrow{R_0} p_1 \xrightarrow{H} h_1 \xrightarrow{R_1} \cdots \xrightarrow{H} h_k
> $$
>
> - Lưu cặp (head $p_0$, tail $h_k$) cho mỗi chain
>
> **Online phase** (crack một hash $h^*$ — nhanh):
> - Apply $R_{k-1}(h^*), H(\cdot), R_{k-2}(\cdot), H(\cdot), \ldots$ cho đến khi tìm được tail trong table
> - Tái tạo chain từ head tương ứng để tìm password

**Ưu điểm**: Tradeoff time-memory — table nhỏ hơn nhiều so với full precomputed table.

> [!example] Thực tế trong CTF và Security
>
> ```bash
> # CrackStation, Hashes.com — online rainbow tables (MD5, SHA-1, NTLM)
> # Chỉ cần paste hash vào, kết quả ra ngay nếu password phổ biến
>
> # hashcat với wordlist (nhanh hơn rainbow table với GPU)
> hashcat -m 0 -a 0 hashes.txt rockyou.txt     # MD5
> hashcat -m 100 -a 0 hashes.txt rockyou.txt   # SHA-1
>
> # Rule-based attack: thêm numbers, leet-speak, v.v.
> hashcat -m 0 -a 0 hashes.txt rockyou.txt -r best64.rule
>
> # Mask attack: password dạng Word + 4 digits
> hashcat -m 0 -a 3 hashes.txt ?u?l?l?l?l?d?d?d?d
> ```

### 4.3. Salt vô hiệu hóa Rainbow Table

> [!success] Tại sao Salt hoạt động
> Với salt, hash function trở thành $H(\text{salt} \| \text{password})$.
>
> Để crack, attacker cần tạo rainbow table **riêng cho từng salt** — không thể precompute vì salt khác nhau cho mỗi user. Cost tăng lên $n$ lần với $n$ users.
>
> ```python
> import hashlib, os
>
> def hash_password(password: str) -> tuple:
>     salt = os.urandom(32)
>     h = hashlib.sha256(salt + password.encode()).hexdigest()
>     return salt.hex(), h
>
> def verify_password(password: str, salt_hex: str, stored_hash: str) -> bool:
>     salt = bytes.fromhex(salt_hex)
>     h = hashlib.sha256(salt + password.encode()).hexdigest()
>     return h == stored_hash
>
>
> # CORRECT: dùng Argon2
> from argon2 import PasswordHasher
> ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)
> stored = ph.hash("my_password")
> ph.verify(stored, "my_password")  # True
> ```

### 4.4. Password Cracking Workflow (CTF)

> [!example] CTF Workflow: Crack Password Hash
>
> ```python
> import hashlib
>
> def identify_and_crack(hash_str: str, wordlist_path: str) -> str:
>     lengths_to_algo = {32: "md5", 40: "sha1", 64: "sha256"}
>     algo = lengths_to_algo.get(len(hash_str), "unknown")
>
>     with open(wordlist_path, "r", encoding="latin-1") as f:
>         for word in f:
>             word = word.strip()
>             h = getattr(hashlib, algo)(word.encode()).hexdigest()
>             if h == hash_str:
>                 return word
>     return "Not found"
>
> result = identify_and_crack(
>     "5d41402abc4b2a76b9719d911017c592",
>     "rockyou.txt"
> )
> print(result)  # "hello"
> ```

---

## 5. Attack — HMAC Timing Attack (bonus)

> [!info] HMAC Timing Attack
> Một lỗi implementation phổ biến: so sánh HMAC bằng `==` thông thường.
>
> ```python
> # VULNERABLE: so sánh dừng sớm khi gặp byte khác
> if user_mac == expected_mac:  # timing leak!
>     allow()
>
> # SECURE: constant-time comparison
> import hmac
> if hmac.compare_digest(user_mac, expected_mac):
>     allow()
> ```
>
> `==` dừng ngay khi gặp byte đầu tiên khác → thời gian thực thi phụ thuộc vào số byte đúng → attacker đo thời gian để recover MAC byte-by-byte. `hmac.compare_digest` luôn compare đủ toàn bộ, constant time.

---

## 6. Attack — Pollard's Rho: O(1)-Space Collision Finding

### 6.1. Vấn đề với Birthday Attack

Birthday attack (L10) tìm collision trong $O(2^{n/2})$ hash evaluations, nhưng đòi hỏi **lưu toàn bộ** $2^{n/2}$ values trong bảng. Với $n = 128$ (MD5), đây là $2^{64}$ entries — khoảng $147\,\text{exabytes}$ — không khả thi.

**Câu hỏi:** Có thể tìm collision với $O(1)$ extra space không, vẫn với $O(2^{n/2})$ time?

**Trả lời:** Có — dùng cycle detection trên chuỗi lặp.

### 6.2. Nguyên lý: Chuỗi lặp trên Domain Hữu Hạn

Với bất kỳ hàm $f : S \to S$ trên tập hữu hạn $S = \{0,1\}^n$, chuỗi:

$$
x_0, \; x_1 = f(x_0), \; x_2 = f(x_1), \; \ldots
$$

bắt buộc phải **lặp lại** sau nhiều nhất $|S|$ bước (Pigeonhole). Khi $x_i = x_j$ với $i \neq j$: $f(x_{i-1}) = f(x_{j-1})$, dẫn đến collision ứng viên.

![[assets/img-11-rho-cycle.png]]
*Cấu trúc "rho" (ρ): đuôi + cycle — Floyd's algorithm phát hiện cycle trong $O(1)$ space.*

Để ứng dụng cho hash function $H$, xây dựng $f$ sao cho $f(x) = H(x)$ với output được truncate về $n$ bits (nếu $H$ output > $n$ bits thì dùng cấu trúc "iterate and reduce").

### 6.3. Floyd's Cycle Detection (Rùa và Thỏ)

> [!note] Algorithm — Floyd's Cycle Detection
> **Input:** Hàm $f : S \to S$, điểm xuất phát $x_0$  
> **Output:** Pair $(x_i, x_j)$ với $i \neq j$, $f(x_i) = f(x_j)$ (collision ứng viên)
>
> **Phase 1 — Phát hiện cycle:**
> - Khởi tạo: $\text{slow} \leftarrow x_0$, $\text{fast} \leftarrow x_0$
> - Lặp: $\text{slow} \leftarrow f(\text{slow})$; $\text{fast} \leftarrow f(f(\text{fast}))$
> - Dừng khi $\text{slow} = \text{fast}$ → đã vào cycle
>
> **Phase 2 — Tìm entry point của cycle:**
> - Reset $\text{slow} \leftarrow x_0$; giữ nguyên $\text{fast}$
> - Lặp cùng tốc độ: $\text{slow} \leftarrow f(\text{slow})$; $\text{fast} \leftarrow f(\text{fast})$
> - Dừng khi $\text{slow} = \text{fast}$ → đây là entry point $\mu$
>
> **Phase 3 — Extract collision:**
> - Tại entry point $\mu$: $f(\text{pre\_slow}) = f(\text{pre\_fast}) = \mu$ → nếu $\text{pre\_slow} \neq \text{pre\_fast}$ → **collision!**

**Complexity:**
- **Time:** $O(\lambda + \mu) \approx O(2^{n/2})$ — tương đương birthday attack về time
- **Space:** $O(1)$ — chỉ lưu hai con trỏ slow và fast

**Lưu ý kỹ thuật:** Khi slow = fast tại entry point, ta biết có cycle nhưng hai con trỏ có cùng giá trị → chưa phải collision cho $f$. Cần tìm **predecessors** của entry point từ hai "đường đi" khác nhau (đường đuôi và đường cycle) để extract actual collision pair $(m_1, m_2)$ với $H(m_1) = H(m_2)$.

### 6.4. Pollard's Rho với Distinguished Points

Floyd's algorithm khó parallelized. Phiên bản thực tế hơn dùng **distinguished points**:

> [!note] Algorithm — Pollard's Rho with Distinguished Points
> **Định nghĩa:** Một điểm $x$ là *distinguished* nếu thỏa mãn điều kiện dễ kiểm tra (ví dụ: 32 bit đầu của $x$ đều là 0 → xác suất $2^{-32}$)
>
> **Chạy nhiều chains song song từ các starting points khác nhau:**
> 1. Từ $x_0^{(i)}$ (random), chạy chuỗi $x_k^{(i)} = f(x_{k-1}^{(i)})$ đến khi gặp distinguished point
> 2. Lưu pair: $(x_0^{(i)}, \text{distinguished\_point}^{(i)})$
>
> **Collision detection:**
> - Nếu hai chains $i$ và $j$ đến **cùng distinguished point** → chúng đã merge tại một điểm trong cycle
> - Tái tạo cả hai chains để tìm điểm merge → extract collision pair

**Ưu điểm:**
- Dễ parallelized: $m$ processors chạy độc lập, gặp distinguished point thì gửi kết quả về central server
- **van Oorschot–Wiener (1994):** với $m$ processors → $O(2^{n/2} / m)$ time

```python
def pollard_rho_collision(H, n_bits, num_chains=1000):
    """
    Tìm collision cho H dùng distinguished points.
    H: hash function, n_bits: output size
    """
    import os, hashlib
    
    def f(x):
        return int(H(x.to_bytes(32, 'big')), 16) % (2**n_bits)
    
    DISTINGUISHED_MASK = (1 << (n_bits // 4)) - 1
    
    table = {}
    
    for _ in range(num_chains):
        start = int.from_bytes(os.urandom(32), 'big') % (2**n_bits)
        x = start
        while (x & DISTINGUISHED_MASK) != 0:
            x = f(x)
        
        if x in table:
            prev_start = table[x]
            a, b = prev_start, start
            while a != b:
                a, b = f(a), f(b)
            if f(prev_start) == f(start) and prev_start != start:
                return (prev_start, start)
        else:
            table[x] = start
    
    return None
```

### 6.5. So sánh các phương pháp tìm Collision

| Phương pháp | Time | Space | Parallelizable |
|-------------|------|-------|----------------|
| Birthday (naive store-all) | $O(2^{n/2})$ | $O(2^{n/2})$ | Khó |
| Floyd's Cycle Detection | $O(2^{n/2})$ | $O(1)$ | Khó |
| Pollard Rho (dist. points) | $O(2^{n/2})$ | $O(\sqrt{\text{threshold}})$ | **Dễ** |
| van Oorschot–Wiener (1994) | $O(2^{n/2}/m)$ | $O(\sqrt{m})$ | $m$ processors |

### 6.6. Kết nối với các attack khác

Cycle detection là kỹ thuật nền tảng xuất hiện ở nhiều nơi:

- **Pollard's Rho factoring (L14):** $f(x) = x^2 + c \bmod n$, tìm cycle trong $\mathbb{Z}_n$ → factor $n$
- **Pollard's Rho DLP (L15):** $f(x) = g^x \cdot h^y$ với bảng exponent, tìm cycle → solve DLP
- **Cả ba:** cùng pattern O(1)-space, $O(\sqrt{|domain|})$ time, dễ parallelize với distinguished points

> [!tip] CTF Relevance
> - Hash output ngắn ($n \leq 64$ bit): Pollard Rho khả thi trực tiếp
> - Challenge yêu cầu "tìm collision với memory limit": đây là attack cần dùng
> - Bài hỏi về "cycle detection trong hash chain" hoặc "rho structure": Floyd's algorithm

---

## 7. CTF Checklist — Hash Challenges

> [!tip] Quy trình nhận diện Hash Attack
>
> ```text
> Thấy hash trong challenge?
>
> 1. Nhận diện loại hash (dựa trên độ dài hex)
>    32 → MD5 | 40 → SHA-1 | 64 → SHA-256/SHA3-256
>
> 2. Source code có H(secret + msg)?
>    YES → Length Extension Attack (hashpumpy)
>
> 3. Database hash, không có salt?
>    YES → Rainbow table (online) hoặc hashcat
>
> 4. Challenge yêu cầu tìm 2 files cùng hash?
>    YES → MD5 collision (fastcoll) hoặc SHA-1 (shattered tool)
>
> 5. Hash so sánh bằng ==?
>    YES → Timing attack (measure response time)
>
> 6. HMAC nhưng algo có thể thay đổi?
>    YES → Algorithm confusion (L24 territory)
> ```

---

## 8. Summary

- **Length Extension Attack**: khai thác internal state của Merkle–Damgård. Nếu MAC = $H(K \| M)$, attacker forge $H(K \| M \| \text{pad} \| \text{ext})$ mà không biết $K$. Fix: dùng HMAC.
- **MD5 Collision**: feasible (< 1s), được dùng trong thực tế (Flame, Rogue CA). SHA-1 cũng bị (SHAttered 2017). Fix: dùng SHA-256+.
- **Rainbow Table**: precomputed hash chains để crack password nhanh. Bị vô hiệu hóa bởi **salt** per-user. Fix: bcrypt/Argon2id.
- **Timing Attack trên HMAC**: so sánh bằng `==` leak số byte đúng. Fix: `hmac.compare_digest`.
- Nguyên tắc chung: hash function an toàn về lý thuyết nhưng bị phá khi **dùng sai cách** (wrong construction, no salt, no constant-time comparison).

---

## 9. References

- Kelsey & Schneier — *Second Preimages on n-Bit Hash Functions for Much Less than 2n Work* (Eurocrypt 2005)
- Wang & Yu — *How to Break MD5 and Other Hash Functions* (Eurocrypt 2005)
- Stevens, Bursztein, Karpman, Albertini, Markov — *The First Collision for Full SHA-1* (2017) — shattered.io
- Sotirov et al. — *MD5 considered harmful today: Creating a rogue CA certificate* (25C3, 2008)
- Bellare — *New Proofs for NMAC and HMAC: Security Without Collision-Resistance* (Crypto 2006)
- Wikipedia — Length extension attack: https://en.wikipedia.org/wiki/Length_extension_attack
- HashPump: https://github.com/bwall/HashPump — CLI tool
- hashpumpy: `pip install hashpumpy` — Python bindings
- CryptoPals Challenge Set 4: https://cryptopals.com/sets/4 (length extension challenges)
- CryptoHack Hash Functions track: https://cryptohack.org/challenges/hashing/
