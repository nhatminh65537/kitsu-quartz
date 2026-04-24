---
title: "15. RSA Fundamentals"
type: scheme
tags: [crypto, rsa, asymmetric, public-key]
aliases: [RSA Fundamentals, RSA Nền tảng]
created: 2026-04-17
---

> **Prerequisites**: [[04-modular-arithmetic|04 — Modular Arithmetic]] (GCD, Euler phi, Fermat's theorem, Carmichael function, CRT), [[07-encoding-xor-otp|07 — Encoding & XOR / OTP]] (khái niệm plaintext/ciphertext), [[05-toolbox|05 — Toolbox]]  
> **Lesson type**: Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa lại trong bài):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $n$ | RSA modulus: $n = p \cdot q$ |
> | $p, q$ | Hai số nguyên tố lớn (secret) |
> | $e$ | Public exponent (thường 65537) |
> | $d$ | Private exponent: $ed \equiv 1 \pmod{\lambda(n)}$ |
> | $\varphi(n)$ | Euler's totient: $\varphi(n) = (p-1)(q-1)$ |
> | $\lambda(n)$ | Carmichael function: $\lambda(n) = \operatorname{lcm}(p-1, q-1)$ |
> | $m$ | Plaintext (message), $m \in [0, n-1]$ |
> | $c$ | Ciphertext, $c \in [0, n-1]$ |
> | $\mathbb{Z}_n^*$ | Nhóm nhân modulo $n$: $\{a : \gcd(a,n) = 1\}$ |
> | $\mathsf{IFP}$ | Integer Factorization Problem |
> | $\mathsf{RSAP}$ | RSA Problem: tính $e$-th root mod $n$ |

---

## 1. Motivation

Năm 1976, Diffie và Hellman công bố ý tưởng về **public-key cryptography** — một hệ thống mà hai bên có thể truyền thông an toàn mà không cần trao đổi khóa bí mật trước. Đây là một bước ngoặt cách mạng, nhưng Diffie-Hellman chỉ giải quyết bài toán **key exchange**; họ chưa xây dựng được một hệ mã hóa bất đối xứng hoàn chỉnh.

Năm 1978, Ronald Rivest, Adi Shamir, và Leonard Adleman công bố **RSA** — hệ mã hóa public-key đầu tiên hoạt động được trong thực tế. Ý tưởng cốt lõi: dùng **one-way trapdoor function** — dễ tính theo một chiều ($m \mapsto m^e \bmod n$), nhưng khó đảo ngược ($c \mapsto c^{1/e} \bmod n$) trừ khi biết "trapdoor" là phân tích thừa số của $n$.

Hơn 45 năm sau, RSA vẫn là nền tảng của HTTPS, TLS, SSH, S/MIME, và vô số hệ thống khác. Là người học crypto, **RSA là bài toán bắt buộc phải thành thạo**.

---

## 2. Nền tảng toán học

Trước khi vào scheme, hãy xây dựng lại intuition cho ba kết quả toán học mà RSA dựa trên:

**Định lý Euler:** Với $\gcd(m, n) = 1$:

$$
m^{\varphi(n)} \equiv 1 \pmod{n}
$$

Suy ra: mọi lũy thừa $m^k$ chỉ phụ thuộc vào $k \bmod \varphi(n)$.

**Carmichael function $\lambda(n)$:** Thực ra $\varphi(n)$ là bound *đủ* nhưng không *chặt*. Với $n = pq$:

$$
\lambda(n) = \operatorname{lcm}(p-1, q-1)
$$

Ta có $\lambda(n) \mid \varphi(n)$, và $m^{\lambda(n)} \equiv 1 \pmod{n}$ với mọi $m$ coprime với $n$. Dùng $\lambda(n)$ thay cho $\varphi(n)$ cho private exponent $d$ nhỏ hơn (performance win) mà vẫn đúng.

**Integer Factorization Problem (IFP):** Không có thuật toán thời gian polynomial nào (trên máy tính cổ điển) factor số $n = pq$ khi $p, q$ là các số nguyên tố lớn ~1024 bit. Đây là **hard problem** nền tảng của RSA.

> [!note] Giới thiệu RSA Problem (RSAP)
> RSAP yếu hơn IFP: RSAP hỏi "tính $m$ từ $m^e \bmod n$ mà không biết $p, q$?" trong khi IFP hỏi "factor $n$?". Nếu IFP dễ thì RSAP dễ, nhưng chiều ngược lại chưa được chứng minh. Trong thực tế, phương pháp tốt nhất để break RSA hiện tại vẫn qua factoring $n$.

---

## 3. RSA Scheme

> [!note] Scheme — RSA Encryption (Textbook & OAEP)
> **Type**: Public-Key Encryption (PKE)
> **Setting**: Hai số nguyên tố $p, q$ lớn (512–2048 bit mỗi cái); $n = pq$; hash functions $G, H$ (Random Oracle Model cho OAEP)
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Sinh $p, q \stackrel{R}{\leftarrow} \mathsf{PrimeGen}(\lambda)$ (dùng Miller-Rabin)
> - Tính $n = p \cdot q$
> - Tính $\lambda(n) = \operatorname{lcm}(p-1, q-1)$
> - Chọn $e = 65537$ (thường cố định); kiểm tra $\gcd(e, \lambda(n)) = 1$
> - Tính $d = e^{-1} \bmod \lambda(n)$ (Extended Euclidean Algorithm)
> - Output: $\mathsf{pk} = (n, e)$, $\mathsf{sk} = (p, q, d)$
>
> **$\mathsf{Enc}(\mathsf{pk},\, m)$** — Textbook RSA (không dùng trong thực tế)
> - Input: $m \in [0, n-1]$ (đã encode thành integer)
> - Output: $c = m^e \bmod n$
>
> **$\mathsf{Enc}_{\text{OAEP}}(\mathsf{pk},\, m)$** — RSA-OAEP (PKCS#1 v2.2)
> - Chọn $r \stackrel{R}{\leftarrow} \{0,1\}^k$ (random seed)
> - Tính $X = m \| 0^{k_1} \oplus G(r)$ và $Y = r \oplus H(X)$
> - Đặt $m' = X \| Y$ (padded message)
> - Output: $c = (m')^e \bmod n$
>
> **$\mathsf{Dec}(\mathsf{sk},\, c)$** — Textbook
> - Output: $m = c^d \bmod n$
>
> **$\mathsf{Dec}_{\text{OAEP}}(\mathsf{sk},\, c)$** — OAEP
> - Tính $m' = c^d \bmod n$
> - Parse $m' = X \| Y$; recover $r = Y \oplus H(X)$; recover $m \| 0^{k_1} = X \oplus G(r)$
> - Kiểm tra padding $0^{k_1}$; nếu đúng → output $m$; nếu sai → output $\perp$

![[assets/img-01-rsa-scheme.png]]
*Sơ đồ tổng quan ba giai đoạn RSA: KeyGen, Encrypt, Decrypt với CRT optimization.*

![[assets/img-02-rsa-oaep.png]]
*So sánh Textbook RSA (không an toàn) và RSA-OAEP (IND-CCA2 in ROM), kèm thứ bậc security notions.*

---

## 4. Tại sao e = 65537?

Đây là câu hỏi rất hay mà người mới thường bỏ qua. Có ba lý do:

**Lý do 1 — Hiệu suất.** $65537 = 2^{16} + 1$ là *Fermat prime* thứ tư. Ở dạng nhị phân: `10000000000000001`. Chỉ có **2 bit "1"**, nên thuật toán square-and-multiply chỉ cần **17 phép nhân** (16 squarings + 1 multiplication) thay vì trung bình $1.5 \times 16 = 24$ nếu $e$ random. Điều này làm **encryption và verify signature nhanh đáng kể**.

**Lý do 2 — An toàn.** $e$ phải đủ lớn để tránh small-e attacks (xem L13). $e = 3$ và $e = 17$ đã bị exploit trong nhiều scenario. $65537$ đủ lớn để an toàn với các attack đã biết khi dùng kèm padding.

**Lý do 3 — Là số nguyên tố.** Nếu $e$ là số nguyên tố, xác suất $\gcd(e, \lambda(n)) > 1$ rất thấp (chỉ xảy ra khi $e \mid p-1$ hoặc $e \mid q-1$), giảm thiểu khả năng keygen fail.

---

## 5. Correctness

> [!abstract] Theorem — Correctness của RSA
> Với mọi $(n, e, d)$ sinh bởi $\mathsf{KeyGen}$ và mọi $m \in [0, n-1]$ với $\gcd(m, n) = 1$:
>
> $$
> \mathsf{Dec}(\mathsf{sk},\, \mathsf{Enc}(\mathsf{pk},\, m)) = m
> $$

**Proof.** Ta cần chứng minh $(m^e)^d \equiv m \pmod{n}$.

Vì $ed \equiv 1 \pmod{\lambda(n)}$, tồn tại $k \in \mathbb{Z}$ sao cho $ed = 1 + k\lambda(n)$.

Suy ra:
$$
m^{ed} = m^{1 + k\lambda(n)} = m \cdot (m^{\lambda(n)})^k
$$

Vì $\gcd(m, n) = 1$, theo định nghĩa $\lambda(n)$ (Carmichael function): $m^{\lambda(n)} \equiv 1 \pmod{n}$.

Vậy $m^{ed} = m \cdot 1^k = m \pmod{n}$.

**Trường hợp $\gcd(m, n) > 1$:** Vì $n = pq$ với $p, q$ nguyên tố, và $m \in [0, n-1]$, trường hợp duy nhất $\gcd(m,n) > 1$ là $p \mid m$ hoặc $q \mid m$. Chứng minh qua CRT: xét mod $p$ và mod $q$ riêng, dùng Fermat's Little Theorem, kết hợp lại vẫn cho $(m^e)^d \equiv m \pmod{n}$. $\blacksquare$

---

## 6. CRT Optimization cho Decryption

Trong thực tế, phép tính $c^d \bmod n$ với $d$ là số 2048-bit rất chậm. Kỹ thuật **Chinese Remainder Theorem (CRT) decryption** giảm thời gian xuống **4 lần**:

$$
d_p = d \bmod (p-1), \quad d_q = d \bmod (q-1)
$$

$$
m_p = c^{d_p} \bmod p, \quad m_q = c^{d_q} \bmod q
$$

Sau đó dùng CRT để ghép $m_p$ và $m_q$ thành $m \bmod n$. Vì $p$ và $q$ chỉ bằng nửa bit-length của $n$, mỗi phép exponentiation nhanh hơn 4× (modular multiplication với số 1024-bit nhanh hơn 4× so với 2048-bit).

> [!tip] Lưu ý CTF
> Trong nhiều CTF challenge, server cung cấp $d_p = d \bmod (p-1)$ hoặc $d_q = d \bmod (q-1)$ (do leak hoặc misconfiguration). Từ $d_p$ và $(n, e)$, có thể recover $p$ → factor $n$ → decrypt hoàn toàn. Đây là **CRT-RSA private key leak attack**.

---

## 7. Security Analysis

> [!abstract] Theorem — Security của Textbook RSA (không đủ)
> Textbook RSA **không đạt IND-CPA**: adversary chỉ cần encrypt candidate message $m_0$ hoặc $m_1$ với public key và so sánh với challenge ciphertext. Vì encryption là deterministic, so sánh trực tiếp cho biết plaintext.

> [!abstract] Theorem — Security của RSA-OAEP
> Dưới giả thiết RSA là one-way (RSAP hard) và trong Random Oracle Model, RSA-OAEP đạt **IND-CCA2** security. Chứng minh chính thức bởi Fujisaki, Okamoto, Pointcheval, Stern (2004).

*(Proof sketch: Adversary phải query random oracle $H$ hoặc $G$ để giải mã; mỗi query tiết lộ thêm thông tin về $r$ → có thể simulate môi trường và reduce về RSAP. Chi tiết xem Boneh-Shoup Ch. 11.)*

> [!warning] Attack — Malleability của Textbook RSA
> RSA textbook là **malleable**: nếu $c = m^e \bmod n$, thì $c' = s^e \cdot c \bmod n$ là encryption của $s \cdot m \bmod n$. Adversary có thể "nhân đôi" plaintext mà không biết $m$:
>
> $$
> c' = 2^e \cdot c \bmod n \implies c'^d = 2m \bmod n
> $$
>
> Đây là lỗ hổng cơ bản dẫn đến Bleichenbacher attack (L14).

> [!danger] Attack — Quantum Threat
> Shor's algorithm (1994) chạy trên quantum computer giải IFP trong $O(\text{poly}(\log n))$ time — phá RSA hoàn toàn. RSA-2048 sẽ không an toàn khi CRQC (Cryptographically Relevant Quantum Computer) xuất hiện. NIST khuyến cáo chuyển sang PQC (ML-KEM, ML-DSA) cho long-term security.

---

## 8. RSA Signature (giới thiệu)

Ngoài encryption, RSA còn được dùng làm digital signature. Cơ chế ngược lại: Alice **ký** bằng private key, Bob **verify** bằng public key.

> [!note] Scheme — RSA Signature (PSS)
> **$\mathsf{Sign}(\mathsf{sk},\, m)$**
> - Tính $h = H(m)$ (hash message)
> - Encode: $\mu = \mathsf{PSS\_Encode}(h, r)$ với $r$ random
> - Output: $\sigma = \mu^d \bmod n$
>
> **$\mathsf{Verify}(\mathsf{pk},\, m,\, \sigma)$**
> - Tính $\mu = \sigma^e \bmod n$
> - Kiểm tra $\mathsf{PSS\_Decode}(\mu) = H(m)$
> - Output: 1 nếu đúng, 0 nếu sai

RSA-PSS (Probabilistic Signature Scheme) đạt **EUF-CMA** trong Random Oracle Model, khác với PKCS#1 v1.5 signature (cũ, có nhiều điểm yếu).

---

## 9. Multi-Prime RSA

**Textbook RSA** dùng $n = p \cdot q$ (2 primes). **Multi-prime RSA** dùng $n = p_1 \cdot p_2 \cdots p_k$ với $k \geq 3$. Được standardized trong PKCS#1 v2.2 (RFC 8017).

**Lợi ích — CRT nhanh hơn:**

Với $k$ primes, CRT decryption tính $k$ modular exponentiations với moduli $\approx n^{1/k}$ thay vì $n^{1/2}$:

$$
\text{Speedup} \approx \frac{k^2}{4} \times \left(\frac{n^{1/2}}{n^{1/k}}\right)^2 = \frac{k^2}{4}
$$

Ví dụ: RSA-3072 với 3 primes → mỗi prime $\approx 1024$ bit → decryption nhanh hơn $\approx 2.25\times$ so với RSA-3072 với 2 primes.

**Trade-off bảo mật:**

Mỗi prime nhỏ hơn → dễ factor từng prime riêng (ECM, GNFS). Để an toàn:

| Modulus size | Max primes | Min prime size |
|-------------|-----------|----------------|
| 2048-bit | 3 | 683 bit |
| 3072-bit | 4 | 768 bit |
| 4096-bit | 5 | 819 bit |

> [!warning] Không dùng quá nhiều primes
> Với $k \geq 5$ và modulus $\leq 3072$ bit: từng prime $\leq 600$ bit — nằm trong tầm tấn công của ECM/GNFS. Trên thực tế $k = 3$ là lựa chọn phổ biến nhất cho performance optimization.

```python
from Crypto.Util.number import getPrime
from math import gcd, lcm

def multi_prime_keygen(bits, k=3):
    """Multi-prime RSA key generation."""
    prime_bits = bits // k + 1
    primes = []
    while len(primes) < k:
        p = getPrime(prime_bits)
        if all(gcd(p-1, q-1) == 1 for q in primes):  # avoid smooth relations
            primes.append(p)
    
    n = 1
    for p in primes:
        n *= p
    
    e = 65537
    lam = 1
    for p in primes:
        lam = lam * (p-1) // gcd(lam, p-1)
    
    d = pow(e, -1, lam)
    return n, e, d, primes

def crt_multi_prime_decrypt(c, d, primes):
    """CRT decryption với k primes."""
    n = 1
    for p in primes:
        n *= p
    
    residues = [pow(c, d % (p-1), p) for p in primes]
    
    result = 0
    for i, (r, p) in enumerate(zip(residues, primes)):
        N_i = n // p
        result += r * N_i * pow(N_i, -1, p)
    return result % n
```

---

## 10. RSA Blinding — Phòng chống Timing và Fault Attacks

**Vấn đề:** Decryption $m = c^d \bmod n$ mất thời gian phụ thuộc vào các bit của $d$ (square-and-multiply: mỗi bit "1" thêm một phép nhân). Nếu attacker đo được thời gian decryption → **timing side-channel attack** (Kocher 1996).

**Fault injection:** Attacker gây lỗi phần cứng trong khi decrypt → một số bit của CRT result sai → so sánh kết quả sai và đúng → recover $d$.

**RSA Blinding** phá vỡ correlation này bằng cách randomize input:

> [!note] Scheme — RSA Blinding
> **Trước decrypt:** Chọn $r \xleftarrow{R} \mathbb{Z}_n^*$; tính $c' = c \cdot r^e \bmod n$
>
> $c' = (m \cdot r)^e \bmod n$ — đây là encryption của $m \cdot r$
>
> **Decrypt bình thường:** $m' = (c')^d \bmod n = m \cdot r \bmod n$
>
> **Unblind:** $m = m' \cdot r^{-1} \bmod n$
>
> Attacker không biết $r$ → không thể correlate timing với $d$

**Overhead:** $\approx 2$–$10\%$ (2 extra multiplications + 1 modular inverse). Bắt buộc trong modern implementations: **OpenSSL** (kể từ 2003), **GnuTLS**, **mbedTLS**.

```python
import os

def blinded_decrypt(c, d, n, e):
    """RSA decryption với blinding."""
    while True:
        r = int.from_bytes(os.urandom(n.bit_length() // 8), 'big') % n
        if gcd_simple(r, n) == 1:
            break
    
    r_e = pow(r, e, n)
    c_blinded = c * r_e % n
    
    m_blinded = pow(c_blinded, d, n)
    
    r_inv = pow(r, -1, n)
    m = m_blinded * r_inv % n
    return m

def gcd_simple(a, b):
    while b:
        a, b = b, a % b
    return a
```

---

## 11. RSA-KEM — Key Encapsulation Mechanism

**Vấn đề với RSA encryption:** Encrypt message $m$ trực tiếp (dù có OAEP) có nhiều corner cases và padding oracle vulnerabilities (L14). Cách tiếp cận hiện đại hơn: **dùng RSA để encapsulate một symmetric key**, sau đó encrypt message bằng symmetric cipher.

> [!note] Scheme — RSA-KEM
> **Encapsulate:** Chọn random $r \xleftarrow{R} \{0, 1, \ldots, n-1\}$; tính:
> - $K = \mathsf{KDF}(r)$ (symmetric key từ KDF)
> - $c = r^e \bmod n$ (encapsulated key)
> - Gửi: $(c, \mathsf{Enc}_K(m))$
>
> **Decapsulate:** $r = c^d \bmod n$; recover $K = \mathsf{KDF}(r)$; decrypt $m$

**Ưu điểm so với RSA-OAEP:**
- **Simpler security proof:** Security giảm trực tiếp về one-wayness của RSA, không cần phân tích OAEP structure phức tạp
- **Không có padding oracle:** Không có padding → không có padding oracle attack (Bleichenbacher, Manger)
- **Hybrid encryption:** Symmetric cipher (AES-GCM) handle toàn bộ message → RSA chỉ protect key

RSA-KEM được chuẩn hóa trong **ISO/IEC 18033-2** và ảnh hưởng thiết kế của **NIST PQC KEMs** (ML-KEM dùng cùng pattern nhưng thay RSA bằng lattice-based encapsulation).

---

## 12. CTF Relevance

**Cực kỳ phổ biến — RSA là "king" của CTF crypto.**

**Nhận diện RSA challenge:**
- File `.pem` hoặc cặp số $(n, e)$ lớn → public key RSA
- Hai số $(p, q)$ nguyên tố lớn, hoặc $(n, e, c)$ → RSA encrypt/decrypt
- `pow(m, e, n)` trong source code → textbook RSA

**Pattern phổ biến nhất trong CTF:**
- Tham số yếu → attacks
- Factor $n$ từ thông tin cho sẵn
- Oracle-based attacks khi server có endpoint decrypt

**Bài tập trong lesson:**
1. Implement RSA từ đầu: tạo $p, q$, tính $n, \varphi(n), e, d$, encrypt/decrypt thủ công
2. Verify correctness: encode message `"hello"` → encrypt → decrypt → decode lại
3. Tốc độ: đo thời gian decrypt với và không CRT

---

## 13. Công cụ & Code

```python
from Crypto.Util.number import getPrime, bytes_to_long, long_to_bytes
from math import gcd, lcm

p = getPrime(512)
q = getPrime(512)
n = p * q
lam = lcm(p-1, q-1)

e = 65537
assert gcd(e, lam) == 1

d = pow(e, -1, lam)

m = bytes_to_long(b"hello CTF crypto!")
c = pow(m, e, n)
m_dec = pow(c, d, n)
assert m_dec == m
print(long_to_bytes(m_dec))
```

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

key = RSA.generate(2048)
pub = key.publickey()

cipher = PKCS1_OAEP.new(pub)
ct = cipher.encrypt(b"OAEP encryption demo")

cipher2 = PKCS1_OAEP.new(key)
pt = cipher2.decrypt(ct)
print(pt)
```

```python
def crt_decrypt(c, p, q, d):
    dp = d % (p - 1)
    dq = d % (q - 1)
    mp = pow(c, dp, p)
    mq = pow(c, dq, q)
    qinv = pow(q, -1, p)
    h = qinv * (mp - mq) % p
    return mq + h * q
```

```python
from Crypto.PublicKey import RSA

with open("public.pem", "rb") as f:
    key = RSA.import_key(f.read())
n, e = key.n, key.e
print(f"n = {n}")
print(f"e = {e}")
print(f"bits = {n.bit_length()}")
```

---

## 14. Tổng kết

- RSA là hệ mã hóa public-key dựa trên **IFP** (Integer Factorization Problem).
- **KeyGen**: chọn $p, q$ nguyên tố lớn; $n = pq$; $e = 65537$; $d = e^{-1} \bmod \lambda(n)$.
- **Encrypt (textbook)**: $c = m^e \bmod n$. **Decrypt**: $m = c^d \bmod n$.
- Correctness đến từ Carmichael's theorem: $m^{e \cdot d} = m^{1 + k\lambda(n)} \equiv m \pmod{n}$.
- **Textbook RSA**: deterministic, malleable → không đạt IND-CPA.
- **RSA-OAEP**: probabilistic, IND-CCA2 secure trong ROM.
- CRT decryption: 4× faster bằng cách tính riêng mod $p$ và mod $q$.
- e = 65537 = $2^{16}+1$: fast exponentiation (chỉ 17 phép nhân), đủ lớn để an toàn.

---

## 15. References

- Rivest, Shamir, Adleman — *A Method for Obtaining Digital Signatures and Public-Key Cryptosystems*, CACM 1978
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 11 (toc.cryptobook.us) — RSA & OAEP
- Galbraith — *Mathematics of Public Key Cryptography*, Ch. 24 (free PDF)
- Fujisaki, Okamoto, Pointcheval, Stern — *RSA-OAEP is Secure under the RSA Assumption*, J. Cryptology 2004
- NIST FIPS 186-5 — Digital Signature Standard (RSA-PSS parameter recommendations)
- RFC 8017 — PKCS#1 v2.2: RSA Cryptography Specifications
