---
title: "25. PRNG Attacks"
type: attack
tags: [crypto, prng, mersenne-twister, lcg, attack, randomness]
aliases: [PRNG Attacks, Mersenne Twister Attack, LCG Attack]
created: 2026-04-18
---

> **Prerequisites**: [[09-stream-ciphers-lfsr|09. Stream Ciphers & LFSR]], [[04-modular-arithmetic|04. Modular Arithmetic]], [[05-toolbox|05. Toolbox]]  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $S$ | Internal state của PRNG (vector 624 words với MT19937) |
> | $X_n$ | Output thứ $n$ của PRNG |
> | $\mathsf{TEMPER}(s)$ | Hàm temper trong MT19937: ánh xạ state word → output word |
> | $\mathsf{UNTEMPER}(y)$ | Nghịch đảo của TEMPER |
> | $a, b, m$ | Parameters của LCG: multiplier, increment, modulus |
> | $\lambda$ | Security parameter |
> | $\mathsf{negl}(\lambda)$ | Negligible function |

---

## 1. Motivation — Ngẫu nhiên không phải là ngẫu nhiên

Mọi scheme mật mã hiện đại đều phụ thuộc vào **ngẫu nhiên thực sự** (true randomness): RSA cần prime ngẫu nhiên, ECDSA cần nonce $k$ ngẫu nhiên, AES-GCM cần nonce ngẫu nhiên, session key cần bits ngẫu nhiên. Điểm then chốt: *nếu "ngẫu nhiên" bị đoán được, toàn bộ hệ thống sụp đổ*.

Trong thực tế và trong CTF, lập trình viên thường nhầm lẫn giữa hai thứ:

- **PRNG (Pseudorandom Number Generator)**: Nhanh, deterministic, output trông ngẫu nhiên nhưng **hoàn toàn có thể đoán được** nếu biết state hoặc seed. Thiết kế cho simulation, game, random shuffle.
- **CSPRNG (Cryptographically Secure PRNG)**: Chậm hơn, entropy từ nguồn vật lý, **computationally indistinguishable từ true randomness** ngay cả khi adversary biết một phần output.

Bài này tập trung vào hai loại PRNG phổ biến nhất mà **không phải CSPRNG** nhưng thường bị dùng trong crypto code: **Mersenne Twister (MT19937)** và **Linear Congruential Generator (LCG)**.

---

## 2. Mersenne Twister MT19937 — Cấu trúc nội bộ

MT19937 được phát minh bởi Matsumoto và Nishimura (1998), là PRNG mặc định của Python (`random`), Ruby, PHP, R, và nhiều ngôn ngữ khác. Tên từ chu kỳ $2^{19937} - 1$ (Mersenne prime).

### 2.1. State và thuật toán

MT19937 duy trì một **state** gồm **624 từ 32-bit** (gần 2.5 KB) và một **index** từ 0 đến 624.

> [!note] Thuật toán MT19937 (3 bước)
>
> **Bước 1 — GENERATE_NUMBERS** (chạy khi index = 624, tức state đã dùng hết):
>
> Với mỗi $i = 0, 1, \ldots, 623$:
>
> > $$x = (S[i] \mathbin{\&} \texttt{0x80000000}) \mathbin{|} (S[(i+1)\%624] \mathbin{\&} \texttt{0x7FFFFFFF})$$
> >
> > $$xA = \begin{cases} x \gg 1 & \text{nếu } x \bmod 2 = 0 \\ (x \gg 1) \oplus \texttt{0x9908B0DF} & \text{nếu } x \bmod 2 = 1 \end{cases}$$
> >
> > $$S[i] = S[(i + 397) \% 624] \oplus xA$$
>
> Đây là **twist operation** — linear recurrence trên $\mathbb{F}_2^{32}$.
>
> **Bước 2 — TEMPER** (áp dụng cho output):
>
> > $$y \leftarrow S[\text{index}]; \quad \text{index} \mathbin{+}= 1$$
> >
> > $$y \mathbin{\oplus}= y \gg 11$$
> >
> > $$y \mathbin{\oplus}= (y \ll 7) \mathbin{\&} \texttt{0x9D2C5680}$$
> >
> > $$y \mathbin{\oplus}= (y \ll 15) \mathbin{\&} \texttt{0xEFC60000}$$
> >
> > $$y \mathbin{\oplus}= y \gg 18$$
> >
> > Output: $y$ (32-bit integer)
>
> **Bước 3 — Initialization** (từ seed $s_0$):
>
> > $$S[0] = s_0; \quad S[i] = f \cdot (S[i-1] \oplus (S[i-1] \gg 30)) + i \pmod{2^{32}}$$
> >
> > với $f = 1812433253$ (constant).

![[assets/img-21-mt19937.png]]
*Luồng attack MT19937: thu thập 624 outputs, invert TEMPER (untemper), nạp state vào Python để predict toàn bộ output tương lai.*

### 2.2. Vì sao MT19937 không phải CSPRNG?

Hai lý do chính:

1. **State hoàn toàn lộ từ 624 outputs liên tiếp**: TEMPER là bijection (hàm song ánh), tức là **invertible**. Từ một output $y$, ta recover đúng một state word $S[i]$ bằng UNTEMPER. Khi có đủ 624 outputs (một chu kỳ state), toàn bộ state được recover — từ đó predict tất cả output tiếp theo.

2. **Twist là linear over $\mathbb{F}_2$**: Kẻ tấn công có thể tính toán ngược (rewind) state về trước.

---

## 3. State Recovery Attack trên MT19937

### 3.1. Inverse của TEMPER (Untemper)

Mỗi bước temper dạng $y \mathbin{\oplus}= (y \gg k)$ hay $y \mathbin{\oplus}= (y \ll k) \mathbin{\&} C$ đều **invertible**.

> [!note] UNTEMPER — Invert từng bước temper
>
> **Undo** $y \mathbin{\oplus}= y \gg 18$:
>
> > Vì 18 > 16, và 32 - 18 = 14 bits thấp bị ảnh hưởng (XOR với bits cao): $y \mathbin{\oplus}= y \gg 18$ tự undo.
>
> **Undo** $y \mathbin{\oplus}= (y \ll 15) \mathbin{\&} \texttt{0xEFC60000}$:
>
> > Vì 15 > 16: bit 0–14 của $y$ không đổi; bit 15–29 bị XOR với (bit 0–14 shifted, masked). Undo: $y \mathbin{\oplus}= (y \ll 15) \mathbin{\&} \texttt{0xEFC60000}$ lần nữa (tự inverse).
>
> **Undo** $y \mathbin{\oplus}= (y \ll 7) \mathbin{\&} \texttt{0x9D2C5680}$ (7 passes):
>
> > Bits 0–6: không đổi. Bits 7–13: XOR với (bits 0–6 shifted, masked). ... Cần 5 passes để recover đủ.
>
> **Undo** $y \mathbin{\oplus}= y \gg 11$ (3 passes):
>
> > Bits 31–21: không đổi. Bits 20–11: XOR với (bits 31–21 shifted). Bits 10–0: XOR với (bits 20–11 shifted). Cần 3 passes.

```python
def untemper(y: int) -> int:
    y ^= y >> 18
    y ^= (y << 15) & 0xEFC60000
    for i in range(7):
        y ^= (y << 7) & (0x9D2C5680 & ~((1 << (7 * i)) - 1))
    for i in range(3):
        y ^= y >> 11
    return y & 0xFFFFFFFF
```

### 3.2. Attack hoàn chỉnh

> [!info] Attack — MT19937 State Recovery (624 Full Outputs)
>
> **Điều kiện**: Adversary có thể thu thập ít nhất 624 giá trị 32-bit liên tiếp từ `random.getrandbits(32)` (hoặc tương đương).
>
> **Bước 1**: Thu thập $y_0, y_1, \ldots, y_{623}$ (624 outputs liên tiếp).
>
> **Bước 2**: Tính $S[i] = \mathsf{UNTEMPER}(y_i)$ cho mỗi $i$.
>
> **Bước 3**: Nạp state vào instance Python:
>
> > ```python
> > import random
> > state = [untemper(y_i) for y_i in outputs]
> > random.setstate((3, tuple(state + [624]), None))
> > ```
>
> **Bước 4**: Từ đây, mọi lời gọi `random.getrandbits(32)` trên instance này cho đúng output tương lai của victim.
>
> **Độ phức tạp**: $O(624)$ — tuyến tính theo kích thước state.

> [!example] CTF Pattern — Ứng dụng điển hình
> Server generate 624 "nonces" để user quan sát, rồi dùng `random.getrandbits(128)` tạo một secret token. Sau khi clone state, attacker tính đúng token.
>
> ```python
> from mt19937predictor import MT19937Predictor
>
> predictor = MT19937Predictor()
> for _ in range(624):
>     x = int(input("Next 32-bit output: "))
>     predictor.setrandbits(x, 32)
>
> predicted_token = predictor.getrandbits(128)
> print(f"Predicted token: {predicted_token}")
> ```

### 3.3. Partial Output — Z3 Solver

Khi output bị **truncate** (chỉ thấy k bits cao thay vì 32 bits), không thể untemper trực tiếp. Dùng **Z3 SMT solver** để mô hình hóa toàn bộ MT19937 state bằng bitvector symbolic và solve:

```python
from z3 import *

def symbolic_mt_predict(outputs_16bit):
    state = [BitVec(f's{i}', 32) for i in range(624)]
    s = Solver()
    index = 0
    for obs in outputs_16bit:
        y = state[index]; index += 1
        y ^= LShR(y, 11)
        y ^= (y << 7) & 0x9D2C5680
        y ^= (y << 15) & 0xEFC60000
        y ^= LShR(y, 18)
        s.add(LShR(y, 16) == obs)
    if s.check() == sat:
        m = s.model()
        return [m[state[i]].as_long() for i in range(624)]
```

---

## 4. Linear Congruential Generator (LCG)

LCG là PRNG đơn giản nhất, được dùng trong `rand()` của C, `java.util.Random`, và nhiều hệ thống cũ.

![[assets/img-21-lcg.png]]
*LCG attack patterns và PRNG taxonomy theo mức độ an toàn cho ứng dụng crypto.*

> [!note] Định nghĩa — Linear Congruential Generator
> Một LCG được xác định bởi recurrence:  
> $$X_{n+1} = a \cdot X_n + b \pmod{m}$$  
> Với $a$ (multiplier), $b$ (increment), $m$ (modulus), và $X_0$ (seed).  
> Output thường là $X_n$ hoặc upper $k$ bits của $X_n$.

### 4.1. Full Output Attack — Recover Parameters

Nếu biết các outputs đầy đủ $X_0, X_1, X_2$:

$$X_1 - X_0 \equiv a(X_0 - 1) + (X_1 - X_0) \pmod{m}$$

Cụ thể hơn: từ $X_1 = aX_0 + b$ và $X_2 = aX_1 + b$, trừ hai phương trình:

$$X_2 - X_1 \equiv a(X_1 - X_0) \pmod{m}$$

Suy ra:

$$a \equiv (X_2 - X_1) \cdot (X_1 - X_0)^{-1} \pmod{m}$$

$$b \equiv X_1 - aX_0 \pmod{m}$$

Với $m$ chưa biết, dùng thêm outputs để tính $\gcd$ của các hiệu: $\gcd(|X_2 - 2X_1 + X_0|, |X_3 - 2X_2 + X_1|, \ldots)$ thường hội tụ về $m$ sau vài outputs.

```python
from math import gcd
from functools import reduce

def recover_lcg_modulus(outputs):
    diffs = [outputs[i+1] - outputs[i] for i in range(len(outputs)-1)]
    second_diffs = [diffs[i+1] * diffs[i] - diffs[i]**2
                    for i in range(len(diffs)-1)]
    return abs(reduce(gcd, second_diffs))

def recover_lcg_params(X0, X1, X2, m):
    a = (X2 - X1) * pow(X1 - X0, -1, m) % m
    b = (X1 - a * X0) % m
    return a, b
```

### 4.2. Truncated Output — Lattice Attack

Khi output bị cắt, chỉ biết upper $k$ bits: $\hat{X}_i = \lfloor X_i / 2^{32-k} \rfloor$.

Gọi $\varepsilon_i = X_i \bmod 2^{32-k}$ (phần không biết). Ta có:

$$X_{i+1} = a X_i + b \pmod{m} \quad \Rightarrow \quad 2^{32-k} \hat{X}_{i+1} + \varepsilon_{i+1} \equiv a(2^{32-k} \hat{X}_i + \varepsilon_i) + b \pmod{m}$$

Đây là dạng **Hidden Number Problem (HNP)**: tìm $\varepsilon_i$ nhỏ thỏa mãn hệ tuyến tính mod $m$. Giải bằng lattice reduction (LLL/BKZ) — xem L22.

### 4.3. Time-based Seed — Bruteforce

Trường hợp phổ biến nhất trong CTF: `random.seed(int(time.time()))`. Seed là unix timestamp 32-bit, không gian chỉ khoảng $2^{31}$.

```python
import random
import time

def bruteforce_seed(observed_value, time_window=120):
    now = int(time.time())
    for t in range(now - time_window, now + 1):
        random.seed(t)
        if random.getrandbits(32) == observed_value:
            return t
    return None
```

---

## 5. Dual EC DRBG — NSA Backdoor

Dual EC DRBG (2006, NIST SP 800-90A) là PRNG dựa trên elliptic curve được NIST chuẩn hóa năm 2006 và bị rút khỏi chuẩn năm 2014 sau khi phát hiện có backdoor do NSA cài.

**Cơ chế**: Dùng hai điểm $P, Q$ trên elliptic curve. State update: $s_{i+1} = x(s_i \cdot P)$ (x-coordinate). Output: $r_i = x(s_i \cdot Q) \bmod 2^{240}$ (cắt 16 bits).

**Backdoor**: Nếu NSA biết $e$ sao cho $Q = e \cdot P$, thì từ 30 bytes output, họ có thể recover toàn bộ state hiện tại và predict tất cả output tương lai.

> [!danger] Dual EC DRBG là Kleptographic Backdoor
> Tài liệu Snowden (2013) xác nhận NSA trả 10 triệu USD cho RSA Security để đặt Dual EC DRBG làm default trong BSAFE library. Hàng triệu thiết bị dùng library này từ 2006 đến 2013 có thể đã bị compromise.
>
> Bài học: **Đừng bao giờ dùng PRNG mà constants không có "nothing-up-my-sleeve" explanation rõ ràng** (verifiable randomness trong constant generation).

---

## 6. PRNG trong Python — Sử Dụng Đúng Cách

> [!warning] Không dùng `random` cho crypto
> `random` module Python dùng MT19937 — không phải CSPRNG. Không dùng cho: key generation, nonce, session token, OTP, bất kỳ thứ gì liên quan đến bảo mật.

```python
import random
import os
import secrets

random.getrandbits(256)

os.urandom(32)
secrets.token_bytes(32)
secrets.token_hex(32)
secrets.token_urlsafe(32)

from Crypto.Random import get_random_bytes
get_random_bytes(32)
```

> [!tip] Nguồn entropy của `/dev/urandom`
> Linux `/dev/urandom` lấy entropy từ: keyboard timing, disk I/O timing, network packet timing, hardware RNG (RDRAND instruction trên Intel). Được pool và mix qua CSPRNG (ChaCha20 trong kernel >= 5.6). **An toàn để dùng** — không block và không reuse state như MT.

---

## 7. Attack — PRNG trong CTF

> [!info] Chiến lược phân tích khi thấy PRNG trong CTF
>
> **Bước 1 — Identify PRNG type**:
> - `import random` → MT19937
> - `rand()` trong C → LCG (platform-specific)
> - `Math.random()` JavaScript → xorshift128+ (V8) hoặc xorshift64 (SpiderMonkey)
> - Custom recurrence → xem bậc và coefficients
>
> **Bước 2 — Identify attack vector**:
> - Server cho ≥ 624 values 32-bit → state recovery (untemper)
> - Server cho < 624 values / truncated → Z3 symbolic solver
> - Seed = timestamp → bruteforce
> - Seed = small integer → bruteforce
> - LCG full output → algebra
> - LCG truncated output → lattice (HNP)
>
> **Bước 3 — Implement attack và predict target value**:
> - Target thường là: session key, admin token, OTP code, AES key

> [!example] CTF Walkthrough — Classic MT19937
> **Scenario**: Server cho phép query `random.getrandbits(32)` không giới hạn, sau đó generate `secret = random.getrandbits(128)`.
>
> **Attack**:
> ```python
> from pwn import *
> from mt19937predictor import MT19937Predictor
>
> conn = remote("chall.ctf.com", 1337)
> predictor = MT19937Predictor()
>
> for _ in range(624):
>     conn.recvuntil(b"Random: ")
>     val = int(conn.recvline().strip())
>     predictor.setrandbits(val, 32)
>
> secret_low  = predictor.getrandbits(32)
> secret_high = predictor.getrandbits(32)
> secret_high2 = predictor.getrandbits(32)
> secret_high3 = predictor.getrandbits(32)
>
> print(f"Predicted secret (128-bit): {secret_low + (secret_high << 32) + ...}")
> ```

> [!question] Bài tập
> 1. **MT19937 full state recovery**: Viết script kết nối server CTF (mock) nhận 624 outputs, recover state, predict output tiếp theo. Dùng `mersenne-twister-predictor` hoặc implement untemper tự tay.
> 2. **LCG full output**: Cho 5 outputs của LCG, recover $a, b, m$ và predict output thứ 6.
> 3. **Time-based seed**: Server dùng `random.seed(int(time.time()) // 60)` (làm tròn xuống phút). Bruteforce seed trong window 5 phút.
> 4. **Truncated MT**: Chỉ có upper 16 bits của 800 outputs. Dùng Z3 để recover state. *(Nâng cao)*

---

## 8. LFSR-based PRNGs và Berlekamp-Massey

### 8.1. Linear Feedback Shift Register (LFSR)

LFSR là mạch đăng ký dịch với feedback tuyến tính, tạo ra chuỗi bit có chu kỳ rất dài. Chuỗi được xác định bởi:

$$s_{n} = c_1 s_{n-1} + c_2 s_{n-2} + \cdots + c_L s_{n-L} \pmod{2}$$

với $L$ là bậc LFSR, $c_i \in \{0, 1\}$ là các hệ số feedback, và $s_0, \ldots, s_{L-1}$ là trạng thái ban đầu.

LFSR bậc $L$ với primitive polynomial cho chuỗi tối đa chu kỳ $2^L - 1$. Chúng từng được dùng rộng rãi trong stream ciphers phần cứng (A5/1 trong GSM, E0 trong Bluetooth).

### 8.2. Berlekamp-Massey Algorithm — Tấn công LFSR

> [!note] Định lý — Berlekamp-Massey
> Cho biết $2L$ bits đầu ra của LFSR bậc $L$, thuật toán Berlekamp-Massey (1969) recover **connection polynomial** (tức toàn bộ cấu trúc LFSR) trong thời gian $O(L^2)$.

**Ý nghĩa tấn công**: Nếu stream cipher dùng LFSR đơn thuần mà output bits bị lộ, attacker chỉ cần $2L$ bits để phá hoàn toàn cipher. Với $L = 64$ bit LFSR, cần 128 bits output — tầm thường.

```python
def berlekamp_massey(s):
    """Returns shortest LFSR generating sequence s (over GF(2))."""
    n, L, m, b, C, B = len(s), 0, 1, 1, [1], [1]
    for i in range(n):
        d = s[i] ^ sum(C[j] * s[i-j] for j in range(1, L+1)) & 1
        if d == 0:
            m += 1
        elif 2 * L <= i:
            T = C[:]
            C = (C + [0]*m + [d*b_j for b_j in B])[:len(C)+m]
            L, m, b, B = i + 1 - L, 1, d, T
        else:
            C = (C + [0]*m + [d*b_j for b_j in B])[:max(len(C), m+len(B))]
            m += 1
    return C[1:L+1], L
```

### 8.3. Nonlinear Combination Generators

Để chống Berlekamp-Massey, một số stream cipher kết hợp nhiều LFSR qua **hàm nonlinear** $f: \{0,1\}^k \to \{0,1\}$.

**Geffe Generator**: Kết hợp 3 LFSR $L_1, L_2, L_3$ qua hàm $f(x_1, x_2, x_3) = x_1 x_2 \oplus (1 \oplus x_1) x_3$.

**Vấn đề — Correlation Attack**: Geffe generator vẫn bị phá bởi correlation attack (Siegenthaler, 1985). Mỗi LFSR có correlation tuyến tính với output: $P[\text{out} = L_1] = 3/4$. Attacker dùng exhaustive search trên từng LFSR độc lập ($3 \times 2^L$ thay vì $2^{3L}$) — giảm complexity theo hàm mũ.

**Summation Generator**: Kết hợp $k$ LFSR qua carry-based addition. Khả năng chống correlation attack tốt hơn Geffe nhưng vẫn bị algebraic attacks.

**A5/1 (GSM)**: Dùng 3 LFSR bậc 19, 22, 23 với clock control (irregular clocking). Bị phá bởi rainbow table attack (Biham & Dunkelman, 2000) và thực tế bởi Nohl et al. (2009) — crack trong giây với precomputed tables.

> [!warning] LFSR trong CTF
> Nếu thấy stream cipher dùng LFSR: xác định bậc $L$ (thường cho trong code), collect $2L$ output bits, áp dụng Berlekamp-Massey để recover polynomial, predict toàn bộ keystream tiếp theo.

---

## 9. ChaCha20-based CSPRNG

### 9.1. /dev/urandom và ChaCha20

Linux kernel từ version 5.6 (2020) dùng **ChaCha20** làm CSPRNG nội bộ cho `/dev/urandom` và `/dev/random` (hai thiết bị này thực sự đã được hợp nhất về behavior từ kernel 5.6+). Trước đó, kernel dùng SHA-1 based CSPRNG.

ChaCha20 là stream cipher được thiết kế bởi Bernstein (2008) — cùng tác giả Curve25519. Đặc điểm:
- Software-friendly: 32-bit additions, XOR, rotations — nhanh trên CPU hiện đại không có AES-NI
- Constant-time bởi thiết kế (không có table lookups)
- Security chứng minh được reduce về hardness of distinguishing ChaCha permutation

### 9.2. Forward Secrecy và Backtracking Resistance

Kernel CSPRNG duy trì một **entropy pool** (256 bits internal state). Khi cần output, ChaCha20 được chạy với state làm key.

> [!note] Forward Secrecy của CSPRNG
> Sau mỗi lần output, internal state được **re-key**: state mới = hash(state cũ ∥ entropy nguồn). Điều này đảm bảo:
> - **Forward secrecy**: biết state hiện tại không recover được output trước đó
> - **Backtracking resistance**: nếu state bị lộ, attacker không thể predict output tương lai sau khi entropy mới được inject

MT19937 **không có** forward secrecy — state hoàn toàn xác định tất cả output tương lai và quá khứ.

### 9.3. So sánh CSPRNG vs MT19937

| Tính chất | MT19937 | `/dev/urandom` (ChaCha20) |
|-----------|---------|--------------------------|
| Predictable từ output | Có (624 outputs) | Không (computationally secure) |
| Forward secrecy | Không | Có |
| Tốc độ | ~500 MB/s | ~350 MB/s (software ChaCha20) |
| Entropy nguồn | Seed tĩnh | Hardware events liên tục |
| Dùng cho crypto | **Không bao giờ** | Được |

---

## 10. Hardware RNG và Entropy Sources

### 10.1. True Random Number Generator (TRNG)

**TRNG** khai thác các hiện tượng vật lý không xác định (true randomness từ quantum mechanics hoặc thermal noise):

- **Thermal noise** trong điện trở: Johnson-Nyquist noise, khuếch đại và số hóa
- **Radioactive decay timing**: đo khoảng cách giữa các phân rã
- **Photon arrival timing** (quantum RNG): phân cực photon không xác định
- **Ring oscillator jitter**: timing jitter của oscillator trên chip

TRNG thường **chậm** (vài KB/s) nhưng đây là entropy thực sự — không phải pseudorandom.

### 10.2. Intel RDRAND và RDSEED

Intel Ivy Bridge (2012+) giới thiệu hai instruction phần cứng:

- **RDRAND**: Trả về output từ hardware CSPRNG on-chip (AES-CTR DRBG theo NIST SP 800-90A). Nhanh (~50 MB/s). **Không phải raw entropy** — là CSPRNG output, nhưng seeded từ entropy source.

- **RDSEED**: Trả về raw bits từ entropy source (thermal noise sampler). Chậm hơn, nhưng là entropy thực sự. Dùng để re-seed CSPRNG.

```python
import ctypes

# Gọi RDRAND qua ctypes (Linux x86_64)
def rdrand64():
    lib = ctypes.CDLL(None)
    # Thực tế cần assembly hoặc C extension
    # Python: dùng os.urandom() thay thế
    import os
    return int.from_bytes(os.urandom(8), 'little')
```

> [!warning] Controversy về RDRAND
> Sau Snowden revelations (2013), một số nhà nghiên cứu lo ngại RDRAND có thể có backdoor từ NSA (tương tự Dual EC DRBG). Linux kernel không dùng RDRAND làm nguồn entropy duy nhất — nó được **mix** vào entropy pool cùng các nguồn khác. Điều này an toàn vì mixing với bad source không giảm entropy nếu các nguồn khác tốt.

### 10.3. Entropy Pool Seeding và Debian Bug 2008

Linux kernel duy trì một **entropy pool** (128-256 bits entropy) được seeded từ:
- Keyboard/mouse event timing
- Disk I/O timing (interrupt timing)
- Network packet timing
- Hardware TRNG (RDRAND/RDSEED nếu có)

> [!danger] Debian OpenSSL Bug 2008 — Catastrophic PRNG Failure
> Năm 2006, một Debian maintainer "fix" một Valgrind warning trong OpenSSL bằng cách comment out 2 dòng code. Vô tình, đây là code seeding entropy pool từ process ID, memory address, và các nguồn ngẫu nhiên.
>
> **Kết quả**: SSH keys và TLS keys được generate trên Debian/Ubuntu từ 2006-2008 chỉ có **32,767 giá trị khả năng** (từ process PID). Toàn bộ có thể brute-force trong vài giây.
>
> **Bài học**: CSPRNG seeding phải từ nhiều nguồn entropy độc lập. Một điểm failure có thể phá toàn bộ security. Code review cho crypto code cần cực kỳ cẩn thận.

```python
# Kiểm tra entropy quality (Linux)
import subprocess
# Xem entropy pool level
result = subprocess.run(['cat', '/proc/sys/kernel/random/entropy_avail'],
                        capture_output=True, text=True)
print(f"Available entropy bits: {result.stdout.strip()}")
# Trên kernel >= 5.6, giá trị này ít quan trọng hơn vì
# /dev/urandom không block ngay cả khi entropy thấp
```

---

## 11. Tóm tắt

- **MT19937** (Python `random`) có state 624 × 32-bit; TEMPER là bijection → 624 full outputs đủ để recover toàn bộ state bằng UNTEMPER.
- **Untemper** invert từng bước XOR-shift: từ output $y$ recover state word $S[i]$.
- **Truncated output**: dùng Z3 symbolic solver với bitvector constraints.
- **LCG** (full output): recover parameters bằng algebra modular; (truncated): HNP → lattice.
- **Time-based seed**: bruteforce timestamp 32-bit là khả thi.
- **Dual EC DRBG**: backdoor NSA đã được xác nhận — không bao giờ dùng.
- **CSPRNG đúng**: `os.urandom()`, `secrets` module trong Python; lấy entropy từ hardware và kernel pool.

---

## 12. References

- Matsumoto, Nishimura — *Mersenne Twister: A 623-dimensionally Equidistributed Uniform PRNG*, ACM TOMACS 1998
- Knuth — *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms*, §3.2 (LCG)
- Bernstein, Lange — *SafeCurves: choosing safe curves for elliptic-curve cryptography* (randomness in ECC)
- Green — *The Many Flaws of Dual EC DRBG*, Blog post, 2013
- Practical CTF — https://book.jorianwoltjer.com/cryptography/pseudo-random-number-generators-prng
- GitHub: `kmyk/mersenne-twister-predictor`, `deut-erium/RNGeesus`
- Python docs: `secrets` module — https://docs.python.org/3/library/secrets.html
