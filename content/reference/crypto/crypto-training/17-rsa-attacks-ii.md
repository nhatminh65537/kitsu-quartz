---
title: "17. RSA Attacks II"
type: attack
tags: [crypto, rsa, factoring, fermat, pollard, bleichenbacher, oracle]
aliases: [RSA Attacks II, Fermat Factoring, Pollard p-1, LSB Oracle, Bleichenbacher]
created: 2026-04-17
---

> **Prerequisites**: [[15-rsa-fundamentals|15. RSA Fundamentals]], [[16-rsa-attacks-i|16. RSA Attacks I]] — nắm vững keygen RSA, PKCS#1 v1.5 padding, tính chất malleable của textbook RSA  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (ký hiệu dùng mà không định nghĩa lại trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $n = pq$ | RSA modulus, $p, q$ nguyên tố lớn |
> | $(e, d)$ | Public/private exponent: $ed \equiv 1 \pmod{\lambda(n)}$ |
> | $c = m^e \bmod n$ | RSA encryption (textbook) |
> | $m = c^d \bmod n$ | RSA decryption |
> | $B = 2^{8(k-2)}$ | Bleichenbacher bound, $k$ = byte length của $n$ |
> | $\lfloor \cdot \rfloor, \lceil \cdot \rceil$ | Floor, ceiling function |
> | $\gcd(a, b)$ | Ước số chung lớn nhất |

---

## 1. Bức tranh tổng quan: Khi nào nào factor được $n$?

RSA an toàn vì giả thuyết **IFP** (Integer Factoring Problem): không có thuật toán đa thức nào factor được $n = pq$ khi $p, q$ là số nguyên tố lớn ngẫu nhiên. Tuy nhiên, trong thực tế và CTF, người triển khai thường mắc sai lầm khiến $n$ trở nên yếu hơn:

| Điều kiện yếu | Attack | Complexity |
|---|---|---|
| $p \approx q$ (quá gần nhau) | Fermat Factoring | $O(\|p-q\|^{1/2})$ |
| $p - 1$ toàn factor nhỏ | Pollard $p$-1 | $O(B \log B)$ |
| $p$ nhỏ hơn $q$ nhiều | Pollard Rho | $O(p^{1/4})$ |
| $n$ đã được factor trước | factordb.com | $O(1)$ |
| Server leak padding info | Bleichenbacher/LSB Oracle | $O(\log n)$ |

Bài này phân tích ba nhóm chính: **factoring thuần toán học**, **oracle attack**, và các tool tự động hóa trong CTF.

---

## 2. Phần I — Factoring Attacks

### 2.1. Fermat Factoring

Năm 1643, Pierre de Fermat phát hiện: mọi số nguyên tố lẻ $n$ đều có thể viết dưới dạng hiệu hai bình phương $n = a^2 - b^2 = (a+b)(a-b)$. Với $n = pq$, ta có:

$$
a = \frac{p+q}{2}, \quad b = \frac{p-q}{2}
$$

Nếu $p \approx q$, thì $a \approx \sqrt{n}$ và $b$ rất nhỏ — ta chỉ cần tìm $a$ gần $\sqrt{n}$ sao cho $a^2 - n$ là số chính phương.

> [!note] Attack — Fermat Factoring
> **Điều kiện:** $n = pq$ với $|p - q| < n^{1/4}$ (p và q quá gần nhau)
>
> **Input:** $n$
>
> **Bước 1.** Tính $a \leftarrow \lceil \sqrt{n} \rceil$  
> **Bước 2.** Tính $b^2 \leftarrow a^2 - n$  
> **Bước 3.** Nếu $b^2$ là số chính phương: $b \leftarrow \sqrt{b^2}$, return $(a-b,\, a+b)$  
> **Bước 4.** Tăng $a \leftarrow a + 1$, quay lại Bước 2.
>
> **Output:** $(p, q)$ với $p = a - b$, $q = a + b$

![[assets/img-l14-01-fermat-factoring.png]]
*Fermat Factoring: tìm $a$ gần $\sqrt{n}$ sao cho $a^2 - n$ là số chính phương.*

**Độ phức tạp:** $O\!\left(\frac{|p-q|}{2\sqrt{n}}\right)$ iterations — rất nhanh khi $p \approx q$.

> [!warning] Real-world case — Máy in Fujifilm/Canon (2022)
> Hanno Böck phát hiện hàng trăm RSA key từ máy in Fujifilm Apeos, DocuCentre, DocuPrint có $p$ và $q$ cách nhau chưa đến $2^{517}$ bit. Với RSA-2048, Fermat chạy chỉ vài giây. Nguyên nhân: PRNG của firmware dùng seed từ clock → $p$ và $q$ được sinh ra rất gần nhau trong thời gian ngắn.

> [!example] Ví dụ với số nhỏ
> $n = 5959 = 59 \times 101$
>
> $\lceil \sqrt{5959} \rceil = 78$, $b^2 = 78^2 - 5959 = 125$ — không phải số chính phương
>
> $a = 79$: $b^2 = 282$ — không phải
>
> $a = 80$: $b^2 = 441 = 21^2$ ✓ → $p = 80 - 21 = 59$, $q = 80 + 21 = 101$

**Phòng thủ:** Luôn kiểm tra $|p - q| \gg n^{1/4}$ sau khi generate. Các thư viện chuẩn như OpenSSL thực hiện điều này tự động.

---

### 2.2. Pollard's $p$-1 Algorithm

John Pollard (1974) nhận thấy: nếu $p - 1$ là **$B$-smooth** (mọi prime factor đều $\leq B$), thì theo định lý Fermat nhỏ, $a^{p-1} \equiv 1 \pmod{p}$. Ta có thể xây dựng $M$ chia hết cho $p-1$ mà không cần biết $p$:

$$
M = \prod_{\text{prime}\ q \leq B} q^{\lfloor \log_q n \rfloor}
$$

Khi đó $a^M \equiv 1 \pmod{p}$ và $\gcd(a^M - 1, n) = p$.

> [!note] Attack — Pollard $p$-1
> **Điều kiện:** $p - 1$ là $B$-smooth với $B$ đủ nhỏ để enumerate
>
> **Input:** $n$, bound $B$, base $a = 2$
>
> **Bước 1.** Với mỗi số nguyên tố $q \leq B$: tính $M_q \leftarrow q^{\lfloor \log_q n \rfloor}$  
> **Bước 2.** Cập nhật $a \leftarrow a^{M_q} \bmod n$ cho từng $q$ theo thứ tự  
> **Bước 3.** Tính $d \leftarrow \gcd(a - 1, n)$  
> **Bước 4.** Nếu $1 < d < n$: return $d$ (factor tìm thấy)
>
> **Output:** $p$ hoặc $q$

**Tại sao đúng?** Sau tất cả $M_q$, tích lũy $M = \prod M_q$ chia hết cho $p-1$ (vì mọi prime power trong $p-1$ đều $\leq B$). Fermat: $a^M \equiv 1 \pmod{p}$ → $p \mid a^M - 1$ → $\gcd(a^M - 1, n)$ chứa factor $p$.

![[assets/img-l14-02-pollard.png]]
*Pollard $p$-1 (trái): hiệu quả khi $p-1$ smooth. Pollard Rho (phải): Floyd's cycle detection trên $\mathbb{Z}_p$.*

**Pollard's Rho:** Một thuật toán khác của Pollard (1975) dùng **Floyd's cycle detection** trong hàm giả ngẫu nhiên $f(x) = x^2 + c \bmod n$. Hai pointer slow/fast di chuyển đến khi $\gcd(\text{slow} - \text{fast}, n) \neq 1$.

$$
\text{Complexity: } O\!\left(n^{1/4}\right) \text{ (mong đợi), space } O(1)
$$

Đây là lý do Pollard Rho được dùng rộng rãi: memory rất ít và hiệu quả với $p$ có kích thước trung bình.

> [!warning] Điều kiện để tấn công
> - **Pollard $p$-1:** Nguy hiểm khi $p - 1$ smooth (ví dụ: $p - 1 = 2 \times 3 \times 5 \times 7 \times 11 \times \ldots$). Safe prime $p = 2q + 1$ ($q$ nguyên tố) đảm bảo $p - 1 = 2q$ không smooth.
> - **Pollard Rho:** Hiệu quả khi $p < 10^{30}$ hoặc với GNFS cho $n$ lớn hơn.

> [!tip] CTF Workflow — Khi gặp bài factor $n$
> 1. Tra factordb.com trước — nhanh nhất nếu $n$ đã được factor
> 2. Thử Fermat nếu $p \approx q$ (hint: $n$ lạ, không phải 2 prime cùng size)
> 3. Pollard $p$-1 nếu có hint về $p-1$ smooth
> 4. Chạy yafu hoặc SageMath `factor(n)` cho các trường hợp còn lại

---

### 2.3. ECM — Elliptic Curve Method (Lenstra, 1987)

Pollard's $p$-1 thất bại khi $p - 1$ có large prime factor. **ECM** (Elliptic Curve Method) khắc phục bằng cách thay nhóm $\mathbb{Z}_p^*$ (cố định) bằng nhóm điểm elliptic curve **ngẫu nhiên** trên $\mathbb{Z}_p$.

**Ý tưởng:** Với mỗi curve ngẫu nhiên $E$, bậc nhóm $|E(\mathbb{F}_p)|$ nằm trong khoảng Hasse $[p + 1 - 2\sqrt{p},\; p + 1 + 2\sqrt{p}]$ và biến thiên theo $E$. Với đủ nhiều curves thử, xác suất cao rằng một curve có $|E(\mathbb{F}_p)|$ là $B$-smooth — dù $p - 1$ không smooth.

> [!note] Tại sao ECM vượt qua Pollard $p$-1?
> Pollard $p$-1 phụ thuộc cố định vào cấu trúc của $p-1$. ECM thử hàng trăm curves, mỗi curve có group order khác nhau — độc lập với $p - 1$.

**Complexity:** $O\!\left(\exp\!\left(\sqrt{2\ln p \cdot \ln\ln p}\right)\right)$ — phụ thuộc vào kích thước của $p$ (prime factor nhỏ nhất), **không** phụ thuộc vào tổng kích thước $n$. Đây là ưu điểm cốt lõi:

| Kích thước $p$ | ECM time estimate |
|---------------|-------------------|
| 30 digits | vài giây |
| 40 digits | vài phút |
| 50 digits | vài giờ |
| 60 digits | vài ngày |
| 70 digits | vài tuần |

> [!tip] Khi nào dùng ECM trong CTF?
> - Một trong $p$ hoặc $q$ nhỏ hơn bên kia đáng kể (ví dụ: $p \approx 10^{50}$, $q \approx 10^{250}$)
> - Pollard $p$-1 fail (vì $p-1$ không smooth)
> - Tool: `yafu` tích hợp ECM tự động; SageMath: `ecm.factor(n)`

```python
# SageMath — ECM factoring
from sage.all import ecm
p = ecm.factor(n)  # Returns smallest factor hoặc None
```

```bash
# yafu command line
yafu "factor(n)" -v
```

---

### 2.4. GNFS — Tổng quan (Tại sao RSA-2048 an toàn)

**General Number Field Sieve (GNFS)** là thuật toán factor nhanh nhất hiện tại cho số lớn. Nó là lý do tại sao RSA-2048 được chấp nhận là an toàn cho đến khi có máy tính lượng tử.

**Complexity:**

$$
L_n\!\left[\frac{1}{3},\; \left(\frac{64}{9}\right)^{1/3}\right] = \exp\!\left(\left(\frac{64}{9}\right)^{1/3} (\ln n)^{1/3} (\ln\ln n)^{2/3}\right)
$$

Đây là hàm **sub-exponential**: nhanh hơn exponential (như brute-force) nhưng chậm hơn polynomial.

**Tại sao RSA-2048 đủ an toàn?**

| RSA modulus | GNFS complexity estimate | Tình trạng |
|-------------|--------------------------|-----------|
| 512-bit | ~$2^{60}$ | Bị factor (1999) |
| 768-bit (232 digits) | ~$2^{80}$ | Bị factor (2009, ~2000 CPU-years) |
| 1024-bit | ~$2^{86}$ | Còn nhạy cảm — NIST không khuyến nghị |
| 2048-bit | ~$2^{112}$ | An toàn (NIST: 112-bit security) |
| 3072-bit | ~$2^{128}$ | Long-term security |

> [!warning] Quantum threat
> GNFS không giúp được gì trước Shor's algorithm. Shor giải IFP trong $O(\text{poly}(\log n))$ trên quantum computer — RSA-2048 sẽ bị phá trong vài giờ trên CRQC. NIST đang standardize PQC (ML-KEM, ML-DSA) — xem L26–L28.

**Bốn phase của GNFS** (để hiểu tổng quan):
1. **Polynomial selection:** Tìm polynomial $f(x) \in \mathbb{Z}[x]$ bậc 5–6 với root $m \bmod n$
2. **Sieving:** Tìm nhiều pairs $(a, b)$ sao cho $a - bm$ smooth trong $\mathbb{Z}$ và $a - b\theta$ smooth trong $\mathbb{Z}[\theta]$
3. **Linear algebra:** Gaussian elimination mod 2 trên matrix khổng lồ để tìm square root relation
4. **Square root:** Extract $p, q$ từ relation tìm được

---

### 2.5. Coppersmith's Method (Giới thiệu)

Coppersmith (1996) chứng minh: nếu biết **một phần của $p$** (ví dụ nửa bit trên), có thể factor $n$ trong thời gian đa thức bằng cách giải bài toán *small root of polynomial mod $n$* dùng LLL lattice reduction.

$$
\text{Biết } p_0 \approx p/2 \text{ bits trên: factor } n \text{ được trong } O(\text{poly}(\log n))
$$

---

## 3. Phần II — Oracle Attacks

Oracle attacks không cần factor $n$ — thay vào đó, attacker khai thác **information leak** từ server (thường là "đầu ra có hợp lệ không?") kết hợp với **homomorphic property** của RSA:

$$
\text{Nếu } c = m^e \bmod n \text{, thì } c \cdot s^e \bmod n = (ms)^e \bmod n
$$

Đây là tính **malleable** của textbook RSA: attacker có thể biến đổi ciphertext có kiểm soát.

### 3.1. LSB Parity Oracle

> [!note] Định nghĩa — LSB Oracle
> Oracle $\mathcal{O}_{\text{lsb}}(c)$ nhận ciphertext $c$ và trả về $m \bmod 2$ (LSB của plaintext $m = c^d \bmod n$).

Ý tưởng tấn công: nhân đôi plaintext bằng cách gửi $c' = c \cdot 2^e \bmod n$ → oracle trả về LSB của $2m \bmod n$. Căn cứ trên giá trị này, ta có thể xác định $m$ nằm ở nửa trên hay nửa dưới của $[0, n)$ và thực hiện binary search.

![[assets/img-l14-03-lsb-oracle.png]]
*LSB Oracle binary search: mỗi oracle call thu hẹp khoảng chứa $m$ xuống một nửa.*

> [!note] Attack — LSB Parity Oracle
> **Điều kiện:** server có decryption endpoint trả về LSB của plaintext (thường sau khi decrypt và check flag đầu tiên)
>
> **Input:** $c = m^e \bmod n$, oracle $\mathcal{O}_{\text{lsb}}$, public key $(n, e)$
>
> **Khởi tạo:** $\text{lo} \leftarrow 0$, $\text{hi} \leftarrow n$, $f \leftarrow c$  
> **Lặp** $\lceil \log_2 n \rceil$ lần:  
> 1. $f \leftarrow f \cdot 2^e \bmod n$ (nhân đôi plaintext)
> 2. $\text{mid} \leftarrow (\text{lo} + \text{hi}) \,/\, 2$
> 3. Nếu $\mathcal{O}_{\text{lsb}}(f) = 1$ (odd): $\text{lo} \leftarrow \text{mid}$
> 4. Ngược lại: $\text{hi} \leftarrow \text{mid}$
>
> **Output:** $m \approx \text{hi}$ (sau $\lceil \log_2 n \rceil$ queries, $\text{hi} - \text{lo} \leq 1$)

**Độ phức tạp:** $O(\log n)$ oracle queries — với RSA-2048, chỉ cần 2048 queries.

**Tại sao đúng?** Khi ta gửi $2^i m \bmod n$:
- Nếu $2^i m \bmod n$ chẵn (LSB = 0): $2^i m < kn$ → $m < kn/2^i$ → $\text{hi} \leftarrow \text{mid}$
- Nếu lẻ: $m \geq kn/2^i$ → $\text{lo} \leftarrow \text{mid}$

Sau đủ bước, khoảng $[\text{lo}, \text{hi})$ co lại thành một điểm duy nhất chứa $m$.

---

### 3.2. Bleichenbacher's Attack — "Million Message Attack"

Đây là oracle attack thực tế nguy hiểm nhất trên RSA. Bleichenbacher (1998) phát hiện rằng nhiều SSL server trả về error message khác nhau tùy thuộc vào việc decrypted plaintext có tuân theo **PKCS#1 v1.5 padding** hay không.

**PKCS#1 v1.5 padding format** ($k$ bytes):
```text
0x00 0x02 [random non-zero bytes PS ≥ 8 bytes] 0x00 [message M]
```

Cấu trúc này nghĩa là: plaintext hợp lệ phải nằm trong khoảng $[2B, 3B)$ với $B = 2^{8(k-2)}$.

> [!note] Attack — Bleichenbacher PKCS#1 v1.5 Padding Oracle
> **Điều kiện:** server có oracle $\mathcal{O}_{\text{pkcs}}(c)$ trả về `true` nếu decrypt $(c)$ bắt đầu bằng `0x00 0x02`, false otherwise
>
> **Adversary model:** IND-CCA2 (attacker query oracle adaptive)
>
> **Ý tưởng:** Tìm $s$ sao cho $c' = c \cdot s^e \bmod n$ là PKCS conforming → thu hẹp interval $[lo, hi]$ chứa $m$
>
> **Phase 1 — Blinding:** Nếu $c$ chưa conforming, tìm $s_0$ sao cho $c \cdot s_0^e$ conforming  
> **Phase 2 — Narrowing:** Với mỗi $s_i$ tìm thấy sao cho conforming:  
> $$[lo, hi] \leftarrow \bigcup_{\substack{r \geq 2m/n}} \left[\left\lceil \frac{2B + rn}{s_i} \right\rceil,\, \left\lfloor \frac{3B - 1 + rn}{s_i} \right\rfloor\right]$$  
> **Phase 3:** Khi $lo = hi$: $m = lo$
>
> **Complexity:** $O(n^{1/2})$ queries trong worst case, thực nghiệm cho thấy khoảng $10^4$–$10^6$ queries tùy implementation (RSA-1024: Bleichenbacher 1998 báo cáo trung bình ~$2^{20}$ queries với 50% probability)

> [!danger] ROBOT Attack (2017)
> Hanno Böck, Juraj Somorovsky, Craig Young phát hiện Bleichenbacher variant vẫn còn sống trong nhiều TLS 1.2 implementations sau 19 năm. Bao gồm Cisco, F5, Citrix, Radware. ROBOT cần ~1 triệu queries cho RSA-2048 nhưng vẫn thực thi được offline với computing power đủ lớn. Phòng chống: chỉ dùng OAEP, không dùng PKCS#1 v1.5 cho encryption.

**Manger's Attack (2001):** Nếu server dùng **RSA-OAEP** nhưng leak thông tin về "leading byte = 0x00?", Manger chứng minh có thể decrypt trong $O(\log_2 n)$ queries — gần tối ưu như LSB oracle.

---

## 4. Phần III — Attack Checklist & Tooling

### 4.1. Decision Tree cho RSA CTF

```text
Nhận được: (n, e, c) — hoặc nhiều keypairs

BƯỚC 0 (luôn làm trước):
├── Nhiều n? → tính pairwise gcd(n_i, n_j) → shared prime? ("Ron was Wrong" attack, L13)
├── Tra factordb.com → n đã factor? → decrypt ngay

BƯỚC 1 — Factoring theo điều kiện:
├── n nhỏ (<512 bit)? → factor(n) trong dcode.fr hoặc SageMath
├── p ≈ q (hint từ source / n lạ)? → Fermat factoring
├── Source hint về p-1 smooth? → Pollard p-1
├── Một prime nhỏ hơn đáng kể (~60 digits)? → ECM (yafu / SageMath ecm.factor)
├── p-1 không smooth nhưng p có thể nhỏ? → Pollard Rho
└── Hint về một phần bit của p? → Coppersmith (L22)

BƯỚC 2 — Oracle attacks (nếu có server endpoint):
├── Server trả về LSB của plaintext? → LSB oracle attack (O(log n) queries)
├── Server trả về "padding valid/invalid"? → Bleichenbacher (PKCS#1 v1.5)
└── Server trả về "first byte = 0x00"? → Manger (RSA-OAEP leak)

BƯỚC 3 — Weak parameters (xem L13):
├── e nhỏ (e=3) + message nhỏ? → small-e direct root
├── e nhỏ + nhiều keypairs cùng m? → Håstad broadcast
├── e lớn bất thường (lớn hơn n/4)? → Wiener (d nhỏ)
├── Cùng n, khác e? → Common modulus
├── Message phần lớn đã biết, e nhỏ? → Stereotyped message (Coppersmith, L13)
└── Hai message liên quan bởi linear relation, cùng (n,e)? → Franklin-Reiter (L13)
```

### 4.2. Code Snippets

_(Code chỉ mang tính tham khảo)_
```python
from gmpy2 import isqrt, is_perfect_square, gcd
from math import log2

def fermat_factor(n):
    a = isqrt(n) + 1
    while True:
        b2 = a * a - n
        if is_perfect_square(b2):
            b = isqrt(b2)
            return int(a - b), int(a + b)
        a += 1

def pollard_p1(n, B=100000):
    a = 2
    for p in primes_up_to(B):
        pk = p ** int(log2(n) / log2(p))
        a = pow(a, pk, n)
    d = gcd(a - 1, n)
    if 1 < d < n:
        return d
    return None

def pollard_rho(n, c=1):
    from math import gcd
    f = lambda x: (x * x + c) % n
    x, y, d = 2, 2, 1
    while d == 1:
        x = f(x)
        y = f(f(y))
        d = gcd(abs(x - y), n)
    return d if d != n else None

def lsb_oracle_attack(n, e, c, oracle):
    lo, hi = 0, n
    f = c
    for _ in range(n.bit_length()):
        f = (f * pow(2, e, n)) % n
        mid = (lo + hi) // 2
        if oracle(f) == 1:
            lo = mid
        else:
            hi = mid
    return hi
```

```python
from sympy import factorint

def primes_up_to(B):
    sieve = [True] * (B + 1)
    sieve[0] = sieve[1] = False
    for i in range(2, int(B**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, B+1, i):
                sieve[j] = False
    return [i for i in range(2, B+1) if sieve[i]]
```

**SageMath:**

```python
n = ...
factor(n)
```

---

## 5. CTF Relevance

**Rất phổ biến** — RSA factoring attack là nhóm CTF crypto xuất hiện nhiều nhất ở mọi cấp độ.

**Dấu hiệu nhận biết:**
- Source code generate $p$ và $q$ từ cùng seed hoặc seed yếu → Fermat
- $p - 1$ hiển thị nhiều factor nhỏ hoặc code dùng non-safe prime → Pollard $p$-1
- Server có endpoint `decrypt(c)` trả về error message phân biệt → padding oracle
- Nhiều challenge dùng cùng $n$ nhưng khác $e$ → kiểm tra GCD giữa các $n$

**Tools:**
- `factordb.com` — database số đã factor
- `yafu` — fast multi-algorithm factoring tool
- `RsaCtfTool` — `python RsaCtfTool.py -n N -e e --uncipher c --attack all`

---

## 6. Tài liệu tham khảo

- Bleichenbacher, D. — *Chosen Ciphertext Attacks Against Protocols Based on the RSA Encryption Standard*, CRYPTO 1998
- Manger, J. — *A Chosen Ciphertext Attack on RSA Optimal Asymmetric Encryption Padding*, CRYPTO 2001
- Böck, H. — *Fermat Factorization in the Wild*, IACR ePrint 2023
- Böck, Somorovsky, Young — *Return Of Bleichenbacher's Oracle Threat (ROBOT)*, USENIX Security 2018
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 11.4 (toc.cryptobook.us)
- Cryptopals Set 6: Challenge 46 (LSB Oracle), Challenge 47-48 (Bleichenbacher)
