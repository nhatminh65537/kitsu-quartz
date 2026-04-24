---
title: "18. Diffie-Hellman & DLP"
type: attack
tags: [crypto, diffie-hellman, dlp, bsgs, pohlig-hellman, elgamal]
aliases: [Diffie-Hellman, DLP, BSGS, Pohlig-Hellman, ElGamal]
created: 2026-04-17
---

> **Prerequisites**: [[04-modular-arithmetic|04. Modular Arithmetic]] — cyclic groups, order of elements, generator; [[15-rsa-fundamentals|15. RSA]] — hardness assumption framework  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (ký hiệu dùng mà không định nghĩa lại trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{G}$ | Nhóm cyclic hữu hạn (thường là $\mathbb{Z}_p^*$ hoặc $E(\mathbb{F}_p)$) |
> | $g$ | Generator của $\mathbb{G}$, bậc $n = \|\mathbb{G}\|$ |
> | $p$ | Số nguyên tố (prime modulus cho DH) |
> | $\log_g h$ | Discrete logarithm: $x$ sao cho $g^x = h$ trong $\mathbb{G}$ |
> | $\phi(p) = p - 1$ | Euler totient của prime $p$ |
> | $\text{ord}(g)$ | Bậc của $g$ trong nhóm |
> | $\text{lcm}$ | Bội số chung nhỏ nhất |

---

## 1. Discrete Logarithm Problem (DLP)

Trong nhóm cyclic $\mathbb{G} = \langle g \rangle$ bậc $n$, **bài toán logarithm rời rạc** (DLP) được phát biểu:

> Cho $g \in \mathbb{G}$ và $h = g^x \in \mathbb{G}$, tìm $x \in \{0, 1, \ldots, n-1\}$.

Đây là bài toán **dễ theo một chiều** (tính $h = g^x$ nhanh bằng fast exponentiation $O(\log x)$) nhưng **khó đảo ngược** (tìm $x$ từ $h$ là bài toán NP trong nhóm tổng quát). Với nhóm multiplicative $\mathbb{Z}_p^*$ kích thước phù hợp, không có thuật toán đa thức nào giải DLP.

> [!info] So sánh DLP và IFP
> | Tính chất | RSA / IFP | DH / DLP |
> |---|---|---|
> | Hard problem | Factor $n = pq$ | Tìm $x$ từ $g^x \bmod p$ |
> | Best general attack | GNFS: $L_n[1/3]$ | NFS-DL: $L_p[1/3]$ |
> | Quantum resistance | Bị phá (Shor) | Bị phá (Shor) |
> | Key size (128-bit sec) | 3072-bit RSA | 3072-bit DH |
> | Với ECC (L16) | — | ECDLP: 256-bit đủ |

**Tại sao DLP trong $\mathbb{Z}_p^*$ khó hơn trong nhóm nhỏ?** Vì có thuật toán sub-exponential (Index Calculus) cho nhóm multiplicative, nhưng không có Index Calculus cho nhóm điểm elliptic — đây là lý do ECC hiệu quả hơn DH về kích thước key.

---

## 2. Diffie-Hellman Key Exchange

Whitfield Diffie và Martin Hellman (1976) công bố giao thức trao đổi khóa đầu tiên trong lịch sử mật mã học công khai. Ý tưởng: Alice và Bob cùng tính được $g^{ab} \bmod p$ mà không ai nghe lén biết được $a$ hoặc $b$.

> [!note] Protocol — Diffie-Hellman Key Exchange
> **Participants:** Alice, Bob  
> **Public params:** Prime $p$, generator $g$ của $\mathbb{Z}_p^*$ (thường $g = 2$ hoặc $5$)  
> **Goal:** Alice và Bob tính shared secret $K = g^{ab} \bmod p$
>
> **Alice:**
> 1. Chọn secret $a \xleftarrow{R} \{1, \ldots, p-2\}$
> 2. Tính $A = g^a \bmod p$
> 3. Gửi $A$ cho Bob
> 4. Nhận $B$ từ Bob, tính $K = B^a \bmod p = g^{ab} \bmod p$
>
> **Bob:**
> 1. Chọn secret $b \xleftarrow{R} \{1, \ldots, p-2\}$
> 2. Tính $B = g^b \bmod p$
> 3. Gửi $B$ cho Alice
> 4. Nhận $A$ từ Alice, tính $K = A^b \bmod p = g^{ab} \bmod p$

![[assets/img-l15-01-dh-protocol.png]]
*DH key exchange: Alice và Bob đều tính ra $g^{ab} \bmod p$ mặc dù chỉ trao đổi $A$ và $B$ trên kênh công khai.*

> [!abstract] Theorem — DH Correctness
> Alice và Bob tính được cùng shared secret $K$:
>
> $$K_A = B^a \bmod p = (g^b)^a \bmod p = g^{ab} \bmod p = (g^a)^b \bmod p = A^b \bmod p = K_B$$

**Computational Diffie-Hellman (CDH) Assumption:** Biết $(g, p, g^a, g^b)$, khó tính $g^{ab}$.

**Decisional Diffie-Hellman (DDH) Assumption:** Không phân biệt được $(g^a, g^b, g^{ab})$ và $(g^a, g^b, g^c)$ với $c$ ngẫu nhiên.

> [!warning] DH không có authentication
> DH hoàn toàn không xác thực danh tính — Mallory có thể thực hiện **Man-in-the-Middle (MITM)**: giả Alice với Bob và Bob với Alice, tạo hai shared secret riêng biệt. Để an toàn cần thêm authentication layer (certificates, signatures, SRP...).

---

## 3. ElGamal Encryption

ElGamal (1985) xây dựng PKE từ DH:

> [!note] Scheme — ElGamal Encryption
> **Setting:** $\mathbb{G} = \mathbb{Z}_p^*$, generator $g$, hash $H$ (nếu dùng)  
> **$\mathsf{KeyGen}$:** Chọn $x \xleftarrow{R} \mathbb{Z}_{p-1}$; $\mathsf{sk} = x$, $\mathsf{pk} = h = g^x \bmod p$  
> **$\mathsf{Encrypt}(\mathsf{pk}, m)$:** Chọn $k \xleftarrow{R} \mathbb{Z}_{p-1}$; output $(c_1, c_2) = (g^k, m \cdot h^k) \bmod p$  
> **$\mathsf{Decrypt}(\mathsf{sk}, (c_1, c_2))$:** $m = c_2 \cdot c_1^{-x} \bmod p$

**Correctness:** $c_2 \cdot c_1^{-x} = m \cdot h^k \cdot g^{-kx} = m \cdot g^{kx} \cdot g^{-kx} = m$.

ElGamal là **IND-CPA** secure dưới DDH assumption nhưng **không IND-CCA** — vì malleable: $(c_1, c_2) \to (c_1, 2c_2)$ decrypt thành $2m$.

---

## 4. Attacks on DLP

Bài học này tập trung vào ba attack chính: BSGS (generic), Pohlig-Hellman (smooth order), và Small Subgroup (CTF phổ biến).

### 4.1. Baby-Step Giant-Step (BSGS)

Daniel Shanks (1971) đề xuất meet-in-the-middle cho DLP:

**Ý tưởng:** Viết $x = im + j$ với $m = \lceil\sqrt{n}\rceil$. Thay vào $g^x = h$:

$$
g^{im+j} = h \implies g^j = h \cdot (g^{-m})^i
$$

Precompute bảng baby steps $\{(g^j, j) : 0 \leq j < m\}$, rồi compute giant steps $h \cdot (g^{-m})^i$ cho $i = 0, 1, \ldots, m-1$ đến khi gặp collision.

> [!note] Attack — Baby-Step Giant-Step (BSGS)
> **Input:** $g, h, n$ (với $h = g^x$, $x \in [0, n)$)
>
> **Bước 1 — Baby Steps:** Tính $m = \lceil\sqrt{n}\rceil$. Lưu bảng $T = \{g^j \bmod p : 0 \leq j < m\}$  
> **Bước 2 — Giant Steps:** Tính $\gamma = g^{-m} \bmod p$. Với $i = 0, 1, \ldots, m-1$:
> - Tính $h \cdot \gamma^i \bmod p$
> - Nếu tìm thấy trong $T$: $h \cdot \gamma^i = g^j$ → $x = im + j$, return $x$
>
> **Output:** $x = \log_g h$  
> **Complexity:** $O(\sqrt{n})$ time, $O(\sqrt{n})$ space

![[assets/img-l15-02-bsgs-pohlig.png]]
*BSGS (trái) và Pohlig-Hellman (phải): hai algorithm cơ bản để giải DLP trong CTF.*

> [!example] Ví dụ 1 số nhỏ: $p = 433$, $g = 7$, $h = 166$
>
> $m = \lceil\sqrt{432}\rceil = 21$  
> Baby steps: tính $7^0, 7^1, \ldots, 7^{20} \bmod 433$ và lưu bảng  
> Giant steps: $\gamma = 7^{-21} \bmod 433$, tính $166 \cdot \gamma^i$ cho $i = 0, 1, \ldots$  
> Tại $i = 2$: $166 \cdot \gamma^2 = 7^5$ (từ bảng) → $x = 2 \times 21 + 5 = 47$
>
> Kiểm tra: $7^{47} \equiv 166 \pmod{433}$ ✓

---

### 4.2. Pohlig-Hellman Algorithm

Pohlig và Hellman (1978) nhận thấy: nếu $n = |\mathbb{G}|$ có nhiều factor nhỏ, DLP có thể giải hiệu quả bằng cách **phân rã về các subgroup nhỏ** rồi CRT.

Giả sử $n = \prod_{i=1}^r p_i^{e_i}$ (smooth). Với mỗi $p_i^{e_i}$:

1. Tính $g_i = g^{n/p_i^{e_i}}$ (generator của subgroup bậc $p_i^{e_i}$)
2. Tính $h_i = h^{n/p_i^{e_i}}$ (projection của $h$ vào subgroup)
3. Giải $x_i = \log_{g_i}(h_i)$ trong subgroup bậc $p_i^{e_i}$ (dùng BSGS cho $p_i$ nhỏ)
4. Kết hợp: $x \equiv x_i \pmod{p_i^{e_i}}$ → CRT cho $x$

> [!note] Attack — Pohlig-Hellman
> **Điều kiện:** $n = |\mathbb{G}|$ là $B$-smooth (mọi prime factor $\leq B$)  
> **Input:** $g, h \in \mathbb{G}$, factorization $n = \prod p_i^{e_i}$  
> **Với mỗi prime power $p_i^{e_i}$:**
> 1. $g_i \leftarrow g^{n/p_i^{e_i}}$, $h_i \leftarrow h^{n/p_i^{e_i}}$
> 2. Giải $g_i^{x_i} = h_i$ trong subgroup bậc $p_i^{e_i}$ bằng BSGS hoặc brute-force nếu $p_i$ nhỏ
> 3. Lưu $x \equiv x_i \pmod{p_i^{e_i}}$  
> **CRT:** Từ system $\{x \equiv x_i \pmod{p_i^{e_i}}\}$, tìm $x \pmod{n}$  
> **Complexity:** $O\!\left(\sum_{i=1}^{r} e_i \left(\log n + \sqrt{p_i}\right)\right)$

**Tại sao Pohlig-Hellman mạnh?** Nếu $n$ smooth (ví dụ $n = 2^{100} \times 3^{50}$), complexity giảm xuống $O(\sqrt{2} \cdot 100 + \sqrt{3} \cdot 50) \approx O(230)$ thay vì $O(\sqrt{n}) \approx O(10^{22})$.

> [!warning] Hệ quả quan trọng cho DH parameter selection
> DH an toàn đòi hỏi $n = |\mathbb{G}|$ có ít nhất một **large prime factor** (lý tưởng là $n$ chính nó là nguyên tố). Nếu $n$ smooth → Pohlig-Hellman giải được.
>
> **Safe prime:** $p$ là safe prime nếu $p = 2q + 1$ với $q$ nguyên tố (Sophie Germain prime). Khi đó $|\mathbb{Z}_p^*| = p - 1 = 2q$ — chỉ có two prime factors 2 và $q$ (lớn). Pohlig-Hellman không hiệu quả.

---

### 4.3. Small Subgroup Attack

Một variant của Pohlig-Hellman thường gặp trong CTF:

> [!warning] Attack — Small Subgroup Attack
> **Điều kiện:** DH dùng non-safe prime $p$ sao cho $p - 1$ có small prime factor $r$ (ví dụ $r = 7$).  
> **Ý tưởng:** Attacker gửi $g^{(p-1)/r}$ thay vì $g^a$ (điểm thuộc subgroup bậc $r$ nhỏ).  
> Khi server tính $K = \left(g^{(p-1)/r}\right)^b = g^{b(p-1)/r}$, giá trị $K$ chỉ có $r$ khả năng.  
> Với nhiều subgroup nhỏ $r_1, r_2, \ldots$, attacker recover $b \bmod r_i$ từng cái rồi CRT lại → recover $b$.

**Phòng thủ:** Dùng safe prime ($p = 2q + 1$) hoặc luôn validate rằng public key không thuộc small subgroup.

---

### 4.4. MOV Attack — Reducing ECDLP to DLP (Giới thiệu)

Tấn công này không áp dụng cho DLP trong $\mathbb{Z}_p^*$ mà dành cho **ECDLP** (discrete log trên elliptic curve — xem L16). Được đề cập ở đây vì nó dùng DLP như "target" để reduce về.

**Ý tưởng (Menezes, Okamoto, Vanstone — 1991):** Dùng **Weil pairing** (hoặc Tate pairing) để "chuyển" bài toán ECDLP trên curve $E(\mathbb{F}_p)$ thành DLP trong extension field $\mathbb{F}_{p^k}$:

$$
e(P, R)^{\log_P Q} = e(Q, R) \quad \in \mathbb{F}_{p^k}^*
$$

Biết $e(P, R) = \alpha$ và $e(Q, R) = \beta$, bài toán trở thành: tìm $x$ sao cho $\alpha^x = \beta$ trong $\mathbb{F}_{p^k}^*$ — đây là DLP thông thường, giải được bằng Index Calculus nếu $p^k$ không quá lớn.

**Embedding degree $k$:** Số nhỏ nhất sao cho $|E(\mathbb{F}_p)|$ chia hết cho $p^k - 1$:

| Loại curve | Embedding degree | Hệ quả |
|------------|------------------|--------|
| **Supersingular curves** | $k \leq 6$ | DLP trong $\mathbb{F}_{p^k}$ feasible → ECDLP bị phá |
| **Ordinary curves** (P-256, Curve25519) | $k \approx p$ | DLP trong $\mathbb{F}_{p^p}$ vô nghĩa → immune |

> [!warning] Supersingular Curves
> Mặc dù supersingular curves có nhiều tính chất đại số đẹp (dùng trong pairing-based crypto L30), chúng **không an toàn** cho ECDLP-based cryptography vì MOV attack.
>
> Tất cả standard curves (NIST P-256, P-384, Curve25519, secp256k1) đều là ordinary curves với embedding degree cực lớn — immune với MOV.

**CTF Pattern:**
```python
# Nếu challenge dùng curve lạ, kiểm tra embedding degree:
from sage.all import EllipticCurve, GF

E = EllipticCurve(GF(p), [a, b])
n = E.order()
k = 1
while (p^k - 1) % n != 0:
    k += 1
print(f"Embedding degree: {k}")
# Nếu k nhỏ (≤ 20): thử MOV attack
# discrete_log(E.weil_pairing(Q, R), E.weil_pairing(P, R))
```

---

### 4.5. Index Calculus (Giới thiệu)

Với $\mathbb{Z}_p^*$, có thuật toán **sub-exponential**: Index Calculus chọn factor base $\{q_1, \ldots, q_B\}$ (các số nguyên tố nhỏ), tìm nhiều quan hệ $g^{a_i} \equiv \prod q_j^{e_{ij}} \pmod{p}$, giải hệ tuyến tính mod $p-1$ để tìm $\log_g q_j$, rồi từ đó tính $\log_g h$.

$$
\text{Complexity: } L_p\left[\frac{1}{3}\right] = e^{O\left((\log p)^{1/3} (\log \log p)^{2/3}\right)}
$$

**Tại sao Index Calculus không áp dụng cho ECC (L16)?** Vì không có khái niệm "smooth" trong nhóm điểm elliptic — các phép tính không liên quan đến integers có thể factor. Đây là lý do ECDLP khó hơn DLP.

**Logjam Attack (2015):** NSA đã precompute DLP trong nhóm 512-bit cho export-grade DHE ciphersuite. Với $p = 512$ bit, Index Calculus chạy offline và cho phép decrypt nhiều HTTPS session. Kết quả: modern TLS cần $p \geq 2048$ bit cho DH.

---

## 5. Authenticated DH Protocols

DH key exchange cung cấp **confidentiality** (shared secret) nhưng không có **authentication** — Mallory có thể MITM. Các giao thức sau đây giải quyết vấn đề này.

### 5.1. Station-to-Station (STS) Protocol

Diffie, van Oorschot, Wiener (1987) thêm **digital signature** vào DH:

> [!note] Protocol 5.1 — Station-to-Station (STS)
> **Participants:** Alice ($\mathsf{sk}_A, \mathsf{pk}_A$), Bob ($\mathsf{sk}_B, \mathsf{pk}_B$)  
> **Public params:** Prime $p$, generator $g$; signature scheme $\mathsf{Sign}$; symmetric cipher $E$
>
> 1. **Alice → Bob:** $g^a \bmod p$ (Alice's DH value)
> 2. **Bob → Alice:** $g^b \bmod p$, $E_K(\mathsf{Sign}_{\mathsf{sk}_B}(g^b \| g^a))$
>    - $K = g^{ab} \bmod p$ (shared secret dùng encrypt signature)
> 3. **Alice → Bob:** $E_K(\mathsf{Sign}_{\mathsf{sk}_A}(g^a \| g^b))$

**Tính chất:**
- **Mutual authentication:** cả hai ký lên DH values → xác nhận danh tính
- **Forward Secrecy:** $a, b$ ephemeral, xóa sau session → lộ long-term key không hại past sessions
- **Key Confirmation:** signature chỉ decrypt được nếu có $K$ đúng → confirm possession of shared secret
- Không cần timestamp → đơn giản hơn Kerberos-style protocols

STS là nền tảng conceptual của **TLS handshake** và nhiều authenticated key exchange protocol khác.

---

### 5.2. X3DH — Extended Triple Diffie-Hellman (Signal Protocol, 2016)

Signal Protocol giải bài toán khó hơn: **asynchronous** key establishment — Bob có thể offline, Alice muốn gửi message ngay.

**Setup — Bob publish trên server:**
- $\mathsf{IK}_B$ (identity key — long-term)
- $\mathsf{SPK}_B$ (signed prekey — trung hạn, signed bởi $\mathsf{IK}_B$)
- $\{\mathsf{OPK}_B^{(i)}\}$ (one-time prekeys — mỗi cái dùng một lần)

**Alice compute shared secret** (khi Bob offline):

$$
SK = \mathsf{KDF}(\mathsf{DH}_1 \| \mathsf{DH}_2 \| \mathsf{DH}_3 \| \mathsf{DH}_4)
$$

| DH | Alice | Bob |
|----|-------|-----|
| $\mathsf{DH}_1 = $ | $\mathsf{IK}_A \cdot \mathsf{SPK}_B$ | — |
| $\mathsf{DH}_2 = $ | $\mathsf{EK}_A \cdot \mathsf{IK}_B$ | — |
| $\mathsf{DH}_3 = $ | $\mathsf{EK}_A \cdot \mathsf{SPK}_B$ | — |
| $\mathsf{DH}_4 = $ | $\mathsf{EK}_A \cdot \mathsf{OPK}_B$ | — |

($\mathsf{EK}_A$ là ephemeral key của Alice cho session này)

**Tính chất:**
- **Forward Secrecy:** $\mathsf{EK}_A$ bị xóa sau session; lộ $\mathsf{IK}_A$ chỉ phá future sessions
- **Deniability:** Không có explicit signature trên message → cả hai bên đều có thể "đã tạo" transcript → plausible deniability
- **Asynchronous:** Không cần Bob online; server chỉ relay prekeys
- **One-time prekeys:** $\mathsf{OPK}_B^{(i)}$ dùng một lần → thêm entropy, bảo vệ nếu $\mathsf{SPK}_B$ bị lộ

**Dùng trong:** Signal, WhatsApp, Google Messages, Matrix protocol

---

### 5.3. KCI Attack (Key Compromise Impersonation)

> [!warning] Attack — KCI
> Nếu Alice's **private key** $\mathsf{sk}_A$ bị lộ: attacker có thể giả mạo **bất kỳ entity nào** (không chỉ Alice) trong cuộc trò chuyện với Alice.
>
> **Lý do:** Trong STS/X3DH, $\mathsf{sk}_A$ được dùng trong DH computation. Attacker biết $\mathsf{sk}_A$ có thể compute shared secret với bất kỳ $\mathsf{pk}$ nào → giả mạo Bob với Alice mà không cần $\mathsf{sk}_B$.

**Protocols phòng chống KCI:**
- **SIGMA protocol** (Krawczyk 2003): dùng trong IKEv2; thêm MAC trên identities trong transcript
- **X3DH variant với explicit auth:** một số implementations thêm signature layer

---

## 6. DH Parameter Quality

| Tham số | Không an toàn | An toàn |
|---|---|---|
| Prime size | $p < 1024$ bit | $p \geq 2048$ bit (NIST: 3072 cho 128-bit security) |
| Group order | $p - 1$ smooth | $p$ là safe prime ($p = 2q+1$, $q$ nguyên tố) |
| Generator | $g = 1$ (trivial) | $g$ có order $q$ lớn |
| Key reuse | Static DH (fixed $a$) | Ephemeral DH (new $a$ mỗi session) → Forward Secrecy |

**Ephemeral DH (DHE):** Mỗi session chọn $a, b$ mới → lộ long-term key không ảnh hưởng past sessions. Đây là nền tảng của **Perfect Forward Secrecy (PFS)**.

---

## 7. CTF Relevance & Code

**Phổ biến** — DLP attacks xuất hiện thường xuyên trong medium/hard CTF.

**Dấu hiệu nhận biết:**
- Source code cho thấy $p - 1$ có nhiều factor nhỏ → Pohlig-Hellman
- $p$ không phải safe prime, $g$ order nhỏ → small subgroup
- Bài yêu cầu tìm secret $a$ từ $g^a \bmod p$ → BSGS hoặc Pohlig-Hellman
- Bài dùng $p$ nhỏ (< 40 bit) → brute-force hoặc BSGS nhanh

**Code snippets:**

```python
from math import ceil, sqrt, gcd

def bsgs(g, h, p, n=None):
    if n is None:
        n = p - 1
    m = ceil(sqrt(n))
    baby = {pow(g, j, p): j for j in range(m)}
    gm_inv = pow(g, m * (p - 2), p)
    gamma = h
    for i in range(m):
        if gamma in baby:
            return i * m + baby[gamma]
        gamma = gamma * gm_inv % p
    return None

def pohlig_hellman(g, h, p, factors):
    from sympy.ntheory.modular import crt
    n = p - 1
    residues = []
    moduli = []
    for (pi, ei) in factors:
        piei = pi ** ei
        gi = pow(g, n // piei, p)
        hi = pow(h, n // piei, p)
        xi = bsgs(gi, hi, p, piei)
        residues.append(xi)
        moduli.append(piei)
    return int(crt(moduli, residues)[0])
```

```python
from sage.all import *

p = 0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74  # example DH prime (truncated)
g = 2
h = Integer("...")

discrete_log(Mod(h, p), Mod(g, p))
```

**SageMath** gọi Pohlig-Hellman + BSGS tự động qua `discrete_log()`.

---

## 8. Tài liệu tham khảo

- Diffie & Hellman — *New Directions in Cryptography*, IEEE Trans. Info. Theory, 1976
- Pohlig & Hellman — *An Improved Algorithm for Computing Logarithms Over GF(p)*, IEEE Trans. Info. Theory, 1978
- Adrian et al. — *Imperfect Forward Secrecy: How Diffie-Hellman Fails in Practice* (Logjam), CCS 2015
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 10–11 (toc.cryptobook.us)
- CTF-Wiki: https://ctf-wiki.mahaloz.re/crypto/asymmetric/discrete-log/discrete-log/
- CryptoHack: Diffie-Hellman challenges
