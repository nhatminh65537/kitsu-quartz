---
title: "19. Alternative Public Key Encryption"
type: scheme
tags: [crypto, elgamal, rabin, goldwasser-micali, paillier, homomorphic, semantic-security]
aliases: [Alternative PKE]
created: 2026-04-23
---

> **Prerequisites**: [[15-rsa-fundamentals|15 — RSA Fundamentals]], [[16-rsa-attacks-i|16 — RSA Attacks I]], [[18-diffie-hellman-dlp|18 — Diffie-Hellman & DLP]]  
> **Lesson type**: Scheme
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{G}, g$ | Cyclic group, generator |
> | $p$ | Prime (DL context) hoặc prime factor (factoring context) |
> | $n = pq$ | RSA-like modulus |
> | $\mathbb{Z}_n^*$ | Multiplicative group mod $n$ |
> | $J(a, n)$ | Jacobi symbol của $a$ mod $n$ |
> | $\text{QR}(n)$ | Tập quadratic residues mod $n$ |
> | $\lambda(n)$ | Carmichael function của $n$ |
> | $L(x)$ | $(x - 1)/n$ (Paillier L-function) |

---

## 1. Motivation

RSA không phải public-key encryption system duy nhất. Bài này giới thiệu bốn hệ thống quan trọng — mỗi hệ thống giải quyết một vấn đề hoặc cung cấp một tính chất mà RSA không có:

| Hệ thống | Hard Problem | Tại sao quan trọng |
|----------|-------------|-------------------|
| **ElGamal** | CDH/DDH | IND-CPA với reduction đơn giản hơn RSA; nền tảng của nhiều protocols |
| **Rabin** | IFP (provably!) | Security **tương đương** factoring — RSA thiếu reduction này |
| **Goldwasser-Micali** | DQRP | Đầu tiên có formal IND-CPA proof; định nghĩa semantic security |
| **Paillier** | DCRA | **Additively homomorphic** — nền tảng của e-voting, MPC, ZK |

---

## 2. ElGamal Cryptosystem (Taher ElGamal, 1985)

### 2.1. Toán học nền tảng

ElGamal xây dựng PKE trực tiếp từ **Diffie-Hellman key exchange**. Security dựa trên:

- **CDH Assumption (Computational DH):** Biết $(g, g^a, g^b)$, khó tính $g^{ab}$
- **DDH Assumption (Decisional DH):** Không phân biệt được $(g^a, g^b, g^{ab})$ và $(g^a, g^b, g^c)$ với $c$ random

DDH chặt hơn CDH (DDH $\Rightarrow$ CDH, nhưng không ngược lại).

### 2.2. Scheme đầy đủ

> [!note] Scheme — ElGamal Encryption
> **Setting:** Group $\mathbb{G} = \mathbb{Z}_p^*$ (hoặc $E(\mathbb{F}_p)$), generator $g$, prime order $q = p - 1$
>
> **$\mathsf{KeyGen}(1^\lambda)$:**
> - Chọn $x \xleftarrow{R} \mathbb{Z}_q$ (private key)
> - Tính $h = g^x \bmod p$ (public key)
> - Output: $\mathsf{pk} = (p, g, h)$, $\mathsf{sk} = x$
>
> **$\mathsf{Enc}(\mathsf{pk}, m)$:**
> - Chọn ephemeral key $k \xleftarrow{R} \mathbb{Z}_q$
> - Output: $(c_1, c_2) = (g^k \bmod p,\; m \cdot h^k \bmod p)$
>
> **$\mathsf{Dec}(\mathsf{sk}, (c_1, c_2))$:**
> - $m = c_2 \cdot c_1^{-x} \bmod p$

**Correctness:**
$$c_2 \cdot c_1^{-x} = m \cdot h^k \cdot g^{-kx} = m \cdot g^{kx} \cdot g^{-kx} = m \pmod{p}$$

### 2.3. Security

> [!abstract] Theorem — ElGamal Security
> ElGamal là **IND-CPA** secure nếu DDH assumption holds trong $\mathbb{G}$.
>
> **Proof sketch:** Adversary nhận $(c_1, c_2) = (g^k, m_b \cdot h^k)$. Nếu DDH holds, $h^k = g^{xk}$ indistinguishable từ $g^r$ (random) → $c_2 = m_b \cdot g^r$ là one-time pad → adversary không thể phân biệt $m_0$ và $m_1$.

> [!warning] ElGamal không IND-CCA
> ElGamal **malleable**: từ $(c_1, c_2)$ là encryption của $m$, attacker tạo $(c_1, s \cdot c_2)$ là encryption hợp lệ của $s \cdot m$. Trong IND-CCA2 game, attacker query oracle decrypt này → vi phạm security.
>
> Fix: dùng **Cramer-Shoup** (xem mục 1.5) hoặc hybrid với MAC.

![[assets/img-D-02-homomorphism-properties.png]]
*Tổng quan homomorphic properties của các scheme: ElGamal (multiplicative), GM (XOR), Paillier và Exp. ElGamal (additive).*

### 2.4. Exponential ElGamal (Additive Homomorphism)

Variant dùng message ở exponent thay vì plaintext:

$$
\mathsf{Enc}(\mathsf{pk}, m) = (g^k,\; g^m \cdot h^k)
$$

**Additive homomorphism:**
$$
\mathsf{Enc}(m_1) \cdot \mathsf{Enc}(m_2) = (g^{k_1+k_2},\; g^{m_1+m_2} \cdot h^{k_1+k_2}) = \mathsf{Enc}(m_1 + m_2)
$$

**Hạn chế:** Decrypt phải tính $g^m$ từ ciphertext, sau đó giải DLP để recover $m$ → chỉ khả thi nếu $m$ nhỏ (dùng BSGS trên $m \in [0, 10^6]$). Dùng cho aggregation (cộng vote) không cần decrypt từng giá trị.

### 2.5. Cramer-Shoup Cryptosystem (1998) — ElGamal IND-CCA2

Ronald Cramer và Victor Shoup thêm **extra group element + hash** để chống CCA:

> [!note] Cramer-Shoup (Ý tưởng)
> Ciphertext gồm 4 thành phần: $(u_1, u_2, e, v)$
> - $u_1 = g_1^r$, $u_2 = g_2^r$, $e = m \cdot h^r$
> - $v = (c \cdot d^{\alpha})^r$ với $\alpha = H(u_1, u_2, e)$ (hash)
>
> Server decrypt từ chối bất kỳ ciphertext nào không pass verification $v$ → không thể modify và re-submit.

First practical IND-CCA2 scheme **without Random Oracle** (standard model proof).

### 2.6. Attacks

**k-reuse attack (nếu k được dùng lại):**

$$
c_1 = g^k, \quad c_2^{(1)} = m_1 \cdot h^k, \quad c_2^{(2)} = m_2 \cdot h^k
$$

$$
\Rightarrow \frac{c_2^{(1)}}{c_2^{(2)}} = \frac{m_1}{m_2} \pmod{p}
$$

Nếu biết một trong hai messages → recover cái kia. Tương tự ECDSA nonce reuse (L19).

**Cross-flavor attack trong OpenPGP:** Một số libraries dùng group $\mathbb{Z}_p^*$, một số dùng $\mathbb{Z}_p$ với convention khác → tương tác sai → leak thông tin về plaintext.

**DLP attacks trên underlying group:** BSGS, Pohlig-Hellman, Index Calculus (xem L15). Nếu $p-1$ smooth → private key $x$ recover được.

### 2.7. CTF Patterns

```python
# Pattern 1: Detect k-reuse
# Nếu hai ciphertexts có cùng c1 = g^k → cùng k
if c1_a == c1_b:
    # m1/m2 = c2_a/c2_b mod p
    ratio = c2_a * pow(c2_b, -1, p) % p
    print(f"m1/m2 = {ratio}")

# Pattern 2: Pohlig-Hellman nếu p-1 smooth
from sage.all import *
p, g, h = [...]
# Factor p-1
F = factor(p-1)
x = discrete_log(Mod(h, p), Mod(g, p))  # SageMath auto Pohlig-Hellman

# Pattern 3: Decrypt với private key
def elgamal_decrypt(p, sk_x, c1, c2):
    return c2 * pow(c1, -sk_x, p) % p
```

---

## 3. Rabin Cryptosystem (Michael Rabin, 1979)

### 3.1. Đặc điểm nổi bật: Provable Security

> [!info] Tính chất quan trọng nhất của Rabin
> **Breaking Rabin = Factoring $n$** (polynomial-time reduction)
>
> RSA chưa có reduction tương đương: chưa ai chứng minh được "break RSA ⟺ factor $n$". Rabin có thể có bằng chứng lý thuyết mạnh hơn RSA.

### 3.2. Scheme

> [!note] Scheme — Rabin Encryption
> **$\mathsf{KeyGen}(1^\lambda)$:**
> - Chọn primes $p, q$ với $p \equiv q \equiv 3 \pmod{4}$ (để tính square root dễ hơn)
> - Tính $n = p \cdot q$
> - Output: $\mathsf{pk} = n$, $\mathsf{sk} = (p, q)$
>
> **$\mathsf{Enc}(\mathsf{pk}, m)$:**
> - $c = m^2 \bmod n$
>
> **$\mathsf{Dec}(\mathsf{sk}, c)$:**
> - Tính $m_p = c^{(p+1)/4} \bmod p$ (vì $p \equiv 3 \pmod 4$)
> - Tính $m_q = c^{(q+1)/4} \bmod q$
> - Dùng CRT để kết hợp 4 roots: $\pm m_p, \pm m_q \pmod{n}$

**Tại sao có 4 roots?** Phương trình $x^2 \equiv c \pmod{n}$ với $n = pq$ có đúng 4 solutions (nếu $c$ là QR mod $n$): $\pm r \pmod p$ và $\pm s \pmod q$ cho $2 \times 2 = 4$ combinations qua CRT.

### 3.3. Provable Security Proof (Sketch)

> [!abstract] Theorem — Rabin ≡ Factoring
> Cho adversary $\mathcal{A}$ invert Rabin function. Xây $\mathcal{B}$ factor $n$ dùng $\mathcal{A}$:
>
> 1. $\mathcal{B}$ chọn random $x \xleftarrow{R} \mathbb{Z}_n^*$; tính $c = x^2 \bmod n$
> 2. $\mathcal{B}$ gọi $\mathcal{A}(n, c)$ → nhận $y$ với $y^2 \equiv c \pmod n$
> 3. Với xác suất $\geq 1/2$: $x \not\equiv \pm y \pmod n$
> 4. Khi đó $\gcd(x - y, n) \in \{p, q\}$ → factor thành công

**Tại sao xác suất $1/2$?** Trong 4 roots $\{r, -r, s, -s\}$, $\mathcal{A}$ trả về một root ngẫu nhiên. Xác suất trả về $\pm x$ (cùng root class với $x$) là $1/2$ → xác suất khác class là $1/2$ → factor $n$.

### 3.4. Vấn đề 4-to-1 và Redundancy

**Decryption ambiguity:** Từ $c$, nhận được 4 candidates $\{m_1, m_2, m_3, m_4\}$ — không biết cái nào là message gốc.

**Giải pháp thực tế:** Thêm **redundancy** vào message trước khi encrypt:
- Lặp lại 64 bits cuối: $m' = m \| m[-64:]$
- Sau decrypt, kiểm tra candidate nào có 64 bits cuối khớp với 64 bits đứng trước

> [!warning] Trade-off bảo mật
> Thêm redundancy **phá vỡ** reduction proof: adversary nhận random challenge $c$ nhưng cần trả về root với format đặc biệt → reduction không còn work. Rabin với redundancy không còn provably equivalent to factoring nữa.

### 3.5. CCA Vulnerability

> [!danger] Rabin CCA Vulnerability
> Rabin **insecure under CCA**: adversary có decryption oracle có thể factor $n$ trong **1 query**.
>
> **Attack:**
> 1. Chọn random $x \xleftarrow{R} \mathbb{Z}_n^*$; tính $c = x^2 \bmod n$
> 2. Query oracle: $y = \mathsf{Dec}(\mathsf{sk}, c)$
> 3. Với xác suất $1/2$: $y \neq \pm x \pmod n$
> 4. Tính $\gcd(x - y, n)$ → $p$ hoặc $q$

Đây là lý do Rabin không được dùng trong thực tế dù có provable security.

### 3.6. Rabin Variants

- **Williams' p+1 scheme:** Chọn $p \equiv 3 \pmod 8$, $q \equiv 7 \pmod 8$ → tính square root hiệu quả hơn
- **MECS (Message Enhancement by Ciphertext Splitting):** Hybrid để giảm ambiguity

### 3.7. Code

```python
from Crypto.Util.number import getPrime, bytes_to_long, long_to_bytes
from math import gcd

def rabin_keygen(bits):
    while True:
        p = getPrime(bits // 2)
        if p % 4 == 3:
            break
    while True:
        q = getPrime(bits // 2)
        if q % 4 == 3 and q != p:
            break
    n = p * q
    return n, p, q

def rabin_encrypt(n, m):
    return pow(m, 2, n)

def rabin_decrypt(p, q, c):
    n = p * q
    mp = pow(c, (p+1)//4, p)
    mq = pow(c, (q+1)//4, q)
    
    # CRT to combine
    yp = pow(q, -1, p)
    yq = pow(p, -1, q)
    
    r1 = (mp * q * yp + mq * p * yq) % n
    r2 = n - r1
    r3 = (mp * q * yp - mq * p * yq) % n
    r4 = n - r3
    return [r1, r2, r3, r4]

# CTF: nếu thấy c = m^2 mod n → Rabin
# Factor n → decrypt → identify correct plaintext bằng redundancy
```

---

## 4. Goldwasser–Micali Cryptosystem (Shafi Goldwasser & Silvio Micali, 1982)

### 4.1. Historical Significance

> [!info] Tại sao Goldwasser-Micali quan trọng lịch sử?
> - **Đầu tiên có IND-CPA proof** dưới standard computational assumption (không phải heuristic)
> - **Định nghĩa chính thức "semantic security"** — khái niệm nền tảng của mọi PKE hiện đại
> - **Turing Award 2012** trao cho Goldwasser và Micali (cùng với Manuel Blum) cho công trình này

**Semantic security** (IND-CPA theo định nghĩa của họ): Adversary biết $\mathsf{pk}$, encrypt $m_0$ hoặc $m_1$, nhận ciphertext $c$ → xác suất đoán đúng $\leq 1/2 + \mathsf{negl}(\lambda)$.

### 4.2. Quadratic Residuosity

> [!note] Định nghĩa — Quadratic Residue và Jacobi Symbol
> **Quadratic Residue mod $n$:** $a \in \mathbb{Z}_n^*$ là QR nếu $\exists x: x^2 \equiv a \pmod n$.
>
> **Jacobi Symbol** $J(a, n)$:
> - Nếu $J(a, n) = -1$: $a$ chắc chắn **không** là QR
> - Nếu $J(a, n) = +1$: $a$ có thể là QR **hoặc** QNR (non-residue)
>
> Tập "ambiguous" $J_n^+1 = \{a : J(a,n) = +1\}$ gồm cả QRs và "pseudosquares" (Jacobi +1 nhưng không là QR).

**Euler Criterion (cho prime $p$):** $a^{(p-1)/2} \equiv 1 \pmod p$ khi và chỉ khi $a$ là QR mod $p$.

Với $n = pq$: kiểm tra $a \in \text{QR}(n)$ **cần biết phân tích thừa số** của $n$ (kiểm tra mod $p$ và mod $q$ riêng). Nếu chỉ biết $n$, không thể phân biệt QR và pseudosquare trong $J_n^+$.

**Decisional QR Problem (DQRP):** Phân biệt $a \in \text{QR}(n)$ và $a \in J_n^+ \setminus \text{QR}(n)$ khi không biết $p, q$ — giả thuyết là hard.

### 4.3. Scheme

> [!note] Scheme — Goldwasser–Micali
> **$\mathsf{KeyGen}(1^\lambda)$:**
> - Chọn $p, q$ nguyên tố lớn; $n = pq$
> - Chọn $y \in J_n^+$ với $y \notin \text{QR}(n)$ (pseudosquare)
> - Output: $\mathsf{pk} = (n, y)$, $\mathsf{sk} = (p, q)$
>
> **$\mathsf{Enc}(\mathsf{pk}, b \in \{0,1\})$:** **(Mã hóa từng BIT)**
> - Chọn $r \xleftarrow{R} \mathbb{Z}_n^*$
> - Output: $c = y^b \cdot r^2 \bmod n$
>
> **$\mathsf{Dec}(\mathsf{sk}, c)$:**
> - Tính $c^{(p-1)/2} \bmod p$ (Euler criterion)
> - Nếu kết quả $= 1$: $c \in \text{QR}(n)$ → $b = 0$
> - Nếu kết quả $= -1$: $c \notin \text{QR}(n)$ → $b = 1$

**Correctness:**
- $b = 0$: $c = r^2$ là QR → decrypt đúng
- $b = 1$: $c = y \cdot r^2$; vì $y$ là pseudosquare và $r^2$ là QR, tích $y \cdot r^2$ là non-QR (tính QR modulo nhóm) → decrypt đúng

### 4.4. Security

> [!abstract] Theorem — Goldwasser–Micali Security
> GM đạt IND-CPA (semantic security) **nếu và chỉ nếu** DQRP hard trong $J_n^+$.
>
> **Proof:** Nếu adversary phân biệt $r^2$ và $y \cdot r^2$ → phân biệt QR và pseudosquare → giải DQRP.

### 4.5. XOR Homomorphism

$$
\mathsf{Enc}(b_1) \cdot \mathsf{Enc}(b_2) = (y^{b_1} r_1^2)(y^{b_2} r_2^2) = y^{b_1 + b_2} (r_1 r_2)^2 = \mathsf{Enc}(b_1 \oplus b_2)
$$

(vì $b_1 + b_2 \pmod 2 = b_1 \oplus b_2$)

GM là **XOR-homomorphic** (linearly homomorphic cho XOR). Không hỗ trợ AND.

### 4.6. Limitations

> [!warning] Ciphertext Expansion
> Mỗi **bit** plaintext → một số mod $n$ (**ciphertext expansion ~$n$ bits / bit**)
>
> Với 2048-bit $n$: 1 bit → 256 bytes; 1 KB plaintext → **256 KB ciphertext**
>
> Đây là lý do GM không dùng thực tế — chỉ dùng trong proofs và lý thuyết

### 4.7. Code

```python
from sympy import jacobi_symbol
from math import gcd
import os

def gm_keygen(p, q):
    n = p * q
    # Tìm pseudosquare: Jacobi(y,n)=+1 nhưng không là QR
    while True:
        y = int.from_bytes(os.urandom(n.bit_length()//8), 'big') % n
        if gcd(y, n) == 1 and jacobi_symbol(y, n) == 1:
            # Kiểm tra y không là QR: euler criterion mod p
            if pow(y, (p-1)//2, p) == p-1:  # = -1 mod p
                break
    return (n, y), (p, q)

def gm_encrypt(pk, bit):
    n, y = pk
    r = int.from_bytes(os.urandom(n.bit_length()//8), 'big') % n
    while gcd(r, n) != 1:
        r = int.from_bytes(os.urandom(n.bit_length()//8), 'big') % n
    return (pow(y, bit, n) * pow(r, 2, n)) % n

def gm_decrypt(sk, c, p):
    # Euler criterion mod p
    if pow(c, (p-1)//2, p) == 1:
        return 0  # c is QR
    else:
        return 1  # c is non-QR

def gm_xor_homomorphism(pk, c1, c2):
    n, y = pk
    return (c1 * c2) % n  # Enc(b1 XOR b2)
```

---

## 5. Paillier Cryptosystem (Pascal Paillier, 1999)

### 5.1. Toán học nền tảng

**Composite Residuosity:** Trong nhóm $\mathbb{Z}_{n^2}^*$ với $n = pq$, phần tử $z$ là **$n$-th power residue** nếu $\exists y: y^n \equiv z \pmod{n^2}$.

> [!note] Định lý căn bản (Paillier 1999)
> $\mathbb{Z}_{n^2}^* \cong \mathbb{Z}_n \times \mathbb{Z}_{n^2}^*[n] \times \mathbb{Z}_{\gcd(p-1,q-1)}$
>
> Phân tích này cho thấy mọi phần tử có dạng $g^m \cdot r^n$ với $m \in \mathbb{Z}_n$, $r \in \mathbb{Z}_n^*$.

**Phép tính quan trọng:**

$$
(1 + n)^m \equiv 1 + mn \pmod{n^2} \quad \text{(Binomial theorem, higher terms vanish)}
$$

Đây là identity cốt lõi: $g = n+1$ là generator "đơn giản" cho $\mathbb{Z}_{n^2}^*$.

**L-function:** $L(x) = \dfrac{x - 1}{n}$ (well-defined với $x \equiv 1 \pmod n$)

**DCRA (Decisional Composite Residuosity Assumption):** Phân biệt $n$-th power residues và non-residues trong $\mathbb{Z}_{n^2}^*$ là hard (khi không biết $p, q$).

### 5.2. Scheme đầy đủ

> [!note] Scheme — Paillier Cryptosystem
> **$\mathsf{KeyGen}(1^\lambda)$:**
> - Chọn $p, q$ nguyên tố, $n = pq$, $\gcd(p-1, q-1)$ nhỏ (thường $= 2$)
> - $\lambda = \mathsf{lcm}(p-1, q-1)$ (Carmichael function của $n$)
> - $g = n + 1$ (đơn giản hóa — hoạt động vì $(n+1)^m \equiv 1 + mn \pmod{n^2}$)
> - $\mu = L(g^\lambda \bmod n^2)^{-1} \bmod n$ (decryption factor)
> - Output: $\mathsf{pk} = n$, $\mathsf{sk} = (\lambda, \mu)$
>
> **$\mathsf{Enc}(\mathsf{pk}, m \in \mathbb{Z}_n)$:**
> - Chọn $r \xleftarrow{R} \mathbb{Z}_n^*$
> - Output: $c = g^m \cdot r^n \bmod n^2 = (1+n)^m \cdot r^n \bmod n^2$
>
> **$\mathsf{Dec}(\mathsf{sk}, c)$:**
> - Tính $u = c^\lambda \bmod n^2$
> - Output: $m = L(u) \cdot \mu \bmod n$

### 5.3. Correctness Proof

$$
c^\lambda = (g^m \cdot r^n)^\lambda = g^{m\lambda} \cdot r^{n\lambda} \pmod{n^2}
$$

Vì $r \in \mathbb{Z}_n^*$ và $n\lambda = n \cdot \text{lcm}(p-1,q-1)$: theo Carmichael theorem, $r^{n\lambda} \equiv 1 \pmod{n^2}$ (với điều kiện $p, q$ đủ lớn).

$$
c^\lambda \equiv g^{m\lambda} = (1+n)^{m\lambda} \equiv 1 + m\lambda n \pmod{n^2}
$$

$$
L(c^\lambda) = m\lambda \bmod n
$$

$$
L(c^\lambda) \cdot \mu = m\lambda \cdot (L(g^\lambda))^{-1} = m\lambda \cdot (\lambda)^{-1} = m \pmod n \quad \blacksquare
$$

### 5.4. Additive Homomorphism — Tính chất cốt lõi

> [!info] Additive Homomorphism của Paillier
>
> **Cộng hai ciphertexts:**
> $$\mathsf{Enc}(m_1) \cdot \mathsf{Enc}(m_2) \bmod n^2 = \mathsf{Enc}(m_1 + m_2 \bmod n)$$
>
> **Nhân ciphertext với scalar:**
> $$\mathsf{Enc}(m)^k \bmod n^2 = \mathsf{Enc}(k \cdot m \bmod n)$$
>
> **Cộng plaintext constant $a$:**
> $$\mathsf{Enc}(m) \cdot g^a \bmod n^2 = \mathsf{Enc}(m + a \bmod n)$$

**Chứng minh:**
$$
(g^{m_1} r_1^n)(g^{m_2} r_2^n) = g^{m_1+m_2} (r_1 r_2)^n = \mathsf{Enc}(m_1+m_2)
$$

(với randomness mới $r_1 r_2$ — vẫn uniform random trong $\mathbb{Z}_n^*$ nếu $r_1, r_2$ independent)

### 5.5. Ứng dụng thực tế

**E-voting với tallying:**
```
Mỗi voter i encrypt phiếu b_i ∈ {0, 1} → c_i = Enc(b_i)
Tally: c_total = ∏ c_i = Enc(∑ b_i) mod n²  [công khai, không cần decrypt từng phiếu]
Threshold decrypt c_total → tổng số phiếu
```

**Private Set Intersection:**
- Party A: encrypt elements $\{a_i\}$ → $\{\mathsf{Enc}(a_i)\}$
- Party B: evaluate polynomial $P(x) = \prod (x - b_j)$ trên $\{\mathsf{Enc}(a_i)\}$ bằng additive hom
- Kết quả: encrypted indicator "a_i ∈ B?"

**BGN Scheme (Boneh-Goh-Nissim 2005):** Kết hợp Paillier-like + bilinear pairing → thêm được **một phép nhân** encrypted (2-homomorphism) → compact proof cho depth-1 circuits

**Oblivious RAM, Secure Auctions, Federated Learning** đều dùng Paillier để sum gradient hoặc bid mà không reveal individual values.

### 5.6. Security và Attacks

> [!abstract] Theorem — Paillier Security
> Paillier đạt **IND-CPA** nếu DCRA holds.
>
> **Reduction:** Adversary phân biệt $\mathsf{Enc}(m_0)$ và $\mathsf{Enc}(m_1)$ → phân biệt $n$-th power residue và non-residue → break DCRA.

> [!danger] Paillier KHÔNG IND-CCA
> Homomorphism → malleability → tấn công qua decryption oracle:
>
> 1. Adversary nhận challenge ciphertext $c^* = \mathsf{Enc}(m_b)$
> 2. Tính $c' = c^* \cdot \mathsf{Enc}(1) = \mathsf{Enc}(m_b + 1)$
> 3. Query oracle: $m_b + 1$ → recover $m_b$
>
> **Fix — Paillier-Pointcheval (2000):** Ciphertext gồm $(c, H(m, r))$ → IND-CCA2 trong Random Oracle Model (tương tự RSA-OAEP).

**Threshold Paillier:**
- $\lambda$ được chia cho $n$ holders bằng Shamir secret sharing
- Decryption cần $t$-of-$n$ holders hợp tác
- Không holder nào biết đầy đủ $\lambda$
- Dùng trong: distributed key management, secure computation

### 5.7. Code đầy đủ

```python
from math import gcd, lcm
import os

class PaillierKeypair:
    def __init__(self, bits=2048):
        from Crypto.Util.number import getPrime
        while True:
            p = getPrime(bits // 2)
            q = getPrime(bits // 2)
            if gcd(p * q, (p-1) * (q-1)) == 1:
                break
        
        self.n = p * q
        self.n2 = self.n ** 2
        self.lam = lcm(p-1, q-1)
        
        g = self.n + 1  # simplified: g = 1 + n
        self.mu = pow(self._L(pow(g, self.lam, self.n2)), -1, self.n)
    
    def _L(self, x):
        return (x - 1) // self.n
    
    def encrypt(self, m):
        while True:
            r = int.from_bytes(os.urandom(self.n.bit_length()//8), 'big') % self.n
            if gcd(r, self.n) == 1:
                break
        g = self.n + 1
        return pow(g, m, self.n2) * pow(r, self.n, self.n2) % self.n2
    
    def decrypt(self, c):
        u = pow(c, self.lam, self.n2)
        return self._L(u) * self.mu % self.n
    
    def add_encrypted(self, c1, c2):
        """Homomorphic addition: Enc(m1) * Enc(m2) = Enc(m1 + m2)"""
        return c1 * c2 % self.n2
    
    def scalar_mult(self, c, k):
        """Homomorphic scalar multiplication: Enc(m)^k = Enc(k*m)"""
        return pow(c, k, self.n2)

# Demo
paillier = PaillierKeypair(bits=512)  # small for demo

c1 = paillier.encrypt(42)
c2 = paillier.encrypt(58)

c_sum = paillier.add_encrypted(c1, c2)
print(paillier.decrypt(c_sum))  # 100

c_scaled = paillier.scalar_mult(c1, 3)
print(paillier.decrypt(c_scaled))  # 126
```

---

## 6. Bảng so sánh tổng thể

![[assets/img-D-01-pke-comparison.png]]
*So sánh 4 hệ mã công khai: hard problem, IND level, homomorphism và ciphertext expansion.*

| Hệ thống | Hard Problem | IND Level | Homomorphism | Ciphertext Expansion | Dùng thực tế |
|----------|-------------|-----------|--------------|---------------------|--------------|
| **RSA-OAEP** | RSAP (IFP) | CCA2 (ROM) | Không | ~1× | TLS, SSH, PGP |
| **ElGamal** | CDH/DDH | CPA | Multiplicative | ~2× | PGP, various |
| **Cramer-Shoup** | CDH | CCA2 | Không | ~4× | Rare (theoretical) |
| **Rabin** | IFP (provably) | CCA vulnerable | Không | ~1× | Ít thực tế |
| **GM** | DQRP | CPA | XOR | **~1000×** | Lý thuyết |
| **Paillier** | DCRA | CPA (CCA2 với variant) | Additive | ~2× | MPC, e-voting, ZK |
| **Exp. ElGamal** | CDH/DDH | CPA | Additive (small $m$) | ~2× | ZK proofs, voting |

---

## 7. CTF Relevance

### 7.1. ElGamal CTF Checklist

```text
Thấy (p, g, h, c1, c2)?
├── c1 = g^k, c2 = m * h^k → ElGamal
├── Nhiều (c1_i, c2_i): c1_1 = c1_2? → k reuse → m1/m2 = c2_1/c2_2
├── p-1 smooth? → Pohlig-Hellman cho private key x
└── p nhỏ (<64 bit)? → brute-force DLP hoặc BSGS
```

### 7.2. Rabin CTF Checklist

```text
Thấy c = m^2 mod n?
├── Factor n (factordb, yafu, Fermat...)
├── Tính 4 square roots qua CRT
├── Identify đúng root: kiểm tra format (prefix/suffix biết trước)
└── Nếu có oracle: CCA → gửi c ngẫu nhiên → gcd(x-y, n)
```

### 7.3. GM CTF Checklist

```text
Ciphertext cực lớn (hàng KB cho message ngắn)?
├── Có thể là GM (1 bit → 1 số n-bit)
├── Tính số bits: len(ciphertext) / key_size = số bits encrypted
├── Thử XOR homomorphism nếu có nhiều ciphertexts
└── Nếu biết p,q: Euler criterion cho từng ciphertext
```

### 7.4. Paillier CTF Checklist

```text
Thấy ciphertext trong Z_{n^2} (ciphertext lớn gấp đôi n)?
├── Có thể là Paillier
├── Thử decrypt nếu biết lambda (lcm(p-1,q-1))
├── Nếu có oracle: CCA → c' = c * Enc(1) = Enc(m+1) → recover m
├── Tìm n (modulus): len(ciphertext)/2 bytes
└── Nếu có homomorphism oracle: compute linear combinations
```

---

## 8. References

- ElGamal, T. — *A Public Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms*, IEEE Trans. Info. Theory, 1985
- Rabin, M.O. — *Digitalized Signatures and Public-Key Functions as Intractable as Factorization*, MIT/LCS/TR-212, 1979
- Goldwasser, S. & Micali, S. — *Probabilistic Encryption*, J. Computer and System Sciences, 1984
- Paillier, P. — *Public-Key Cryptosystems Based on Composite Degree Residuosity Classes*, EUROCRYPT 1999
- Cramer, R. & Shoup, V. — *A Practical Public Key Cryptosystem Provably Secure Against Adaptive Chosen Ciphertext Attack*, CRYPTO 1998
- Paillier, P. & Pointcheval, D. — *Efficient Public-Key Cryptosystems Provably Secure Against Active Adversaries*, ASIACRYPT 2000
- Boneh, D., Goh, E., Nissim, K. — *Evaluating 2-DNF Formulas on Ciphertexts*, TCC 2005 (BGN scheme)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 11 (toc.cryptobook.us)
- CryptoHack — Crypto on the Web challenges (Paillier examples)
