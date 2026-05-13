---
title: "A0. Blind Signature CTF Cheatsheet"
type: attack
tags: [crypto, blind-signature, ctf, cheatsheet, appendix-a0]
aliases: [Blind Signature CTF, Blind Sig Cheatsheet]
created: 2026-05-13
---

> **Liên quan**: [[11-rsa-blinding-multiplicative-forgery|11. RSA Multiplicative Forgery]], [[12-ros-attack|12. ROS Attack]], [[13-parallel-ros-mnm-attack|13. Parallel ROS & M&M]], [[14-weak-blinding-linkability-flaws|14. Weak Blinding & Linkability]]
>
> **Notation** (ký hiệu dùng mà không định nghĩa ở đây):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $N, e, d$ | RSA modulus, public/secret exponent |
> | $\mathbb{G}, g, q$ | Cyclic group, generator, order |
> | $x, X = g^x$ | Schnorr secret/public key |
> | $H$ | Hash function (random oracle) |

---

Tài liệu tra cứu nhanh cho CTF challenges liên quan đến blind signature. Tổ chức theo attack vector. Mỗi phần: nhận diện dấu hiệu, exploit template, phòng thủ.

---

## Pattern 1 — RSA Multiplicative Forgery

### Dấu hiệu nhận biết

- Server ký bằng RSA raw/unpadded (`pow(m, d, N)` không có OAEP/PSS)
- Có oracle ký bất kỳ message nào **trừ** một target $m^*$
- Message space là $\mathbb{Z}_N^*$ hoặc hash values trong $\mathbb{Z}_N^*$

### Attack 1A: Blinding Attack (1 oracle call)

Mục tiêu: lấy chữ ký $s^* = (m^*)^d \bmod N$ mà không ký trực tiếp $m^*$.

```python
from Crypto.Util.number import inverse

def rsa_blinding_attack(oracle_sign, N, e, m_star):
    r = randbelow(N)
    while gcd(r, N) != 1:
        r = randbelow(N)
    m_blinded = (m_star * pow(r, e, N)) % N
    s_blinded = oracle_sign(m_blinded)
    r_inv = inverse(r, N)
    s_star = (s_blinded * r_inv) % N
    return s_star
```

### Attack 1B: Factoring Attack (2 oracle calls)

Khi $m^* = m_1 \cdot m_2 \bmod N$ với $m_1, m_2$ không bị cấm:

```python
def rsa_factoring_attack(oracle_sign, N, m_star):
    from sympy import factorint
    m1 = find_factor_not_blocked(m_star, N, blocked)
    m2 = (m_star * pow(m1, -1, N)) % N
    s1 = oracle_sign(m1)
    s2 = oracle_sign(m2)
    s_star = (s1 * s2) % N
    return s_star
```

> [!tip] Khi nào dùng 1A vs 1B
> Dùng 1A khi oracle blacklist chỉ check `m == m_star` (exact match). Dùng 1B khi oracle blacklist check cả blinded version (vd: kiểm tra hash), nhưng không check tích số thành phần.

### CTF Template: Hash-then-Sign

Nhiều CTF dùng `H(m)` thay vì `m` trực tiếp. Adapt:

```python
m_star_hash = int(sha256(target_msg).hexdigest(), 16) % N
s_star = rsa_blinding_attack(oracle_sign, N, e, m_star_hash)
```

---

## Pattern 2 — Schnorr Blind Signature: Missing hoặc Weak Blinding

### Dấu hiệu nhận biết

- Server implement Schnorr blind signature
- Blinding parameters $\alpha, \beta$ không random hoặc bị hardcode
- Oracle trả về $(R, c, s)$ — có thể reconstruct $R'$ từ transcript

### Attack 2A: Zero Blinding ($\alpha = \beta = 0$)

Nếu challenge $c = H(R \| m)$ (không có blinding) → Signer thấy $m$ trực tiếp → không blind.

```python
def detect_zero_blinding(oracle):
    msg = b"test message"
    R, c, s = oracle.get_commitment_and_sign(msg)
    expected_c = H(R + msg)
    if c == expected_c:
        print("[!] No blinding: alpha=beta=0")
        return True
    return False
```

### Attack 2B: Deterministic Blinding từ Message

Nếu $r_\alpha = \mathsf{PRF}(m)$ (blinding derived từ message):

```python
def dictionary_attack(oracle, target_msg):
    wordlist = load_wordlist()
    for candidate in wordlist:
        r_alpha = prf(candidate)
        R_prime_candidate = blind(oracle.R, r_alpha, ...)
        c_candidate = H(R_prime_candidate + candidate)
        if oracle.verify(candidate, c_candidate):
            print(f"[+] Message is: {candidate}")
            return candidate
```

### Attack 2C: Object-level Nonce Caching

Python pattern phổ biến trong CTF — nonce $k$ được lưu trong instance và tái dùng:

```python
class VulnerableSigner:
    def __init__(self, sk):
        self.x = sk
        self.k = randrange(q)
        self.R = pow(g, self.k, p)
```

Nếu cùng $R$ xuất hiện trong hai signing sessions → nonce reuse → extract $x$:

```python
def extract_key_from_nonce_reuse(R1, c1, s1, R2, c2, s2, q):
    if R1 == R2 and c1 != c2:
        x = ((s1 - s2) * inverse(c2 - c1, q)) % q
        return x
    return None
```

---

## Pattern 3 — ROS-based Concurrent Forgery

### Dấu hiệu nhận biết

- Server cho phép nhiều concurrent signing sessions (không limit số session đang mở)
- Scheme là Schnorr, Okamoto-Schnorr, hoặc Abe-Okamoto type
- Challenge space $\mathcal{C} \subseteq \mathbb{Z}_p$ với $p$ lớn (≥ 256-bit) nhưng $\ell$ sessions đủ lớn

### ROS Solver (Benhamouda et al. — Small Parameters)

Cho small $p$ (CTF thường dùng $p \approx 2^{64}$ hoặc nhỏ hơn để bài giải được), solver polynomial-time:

```sage
def ros_solver(oracle, p, ell):
    rho_vecs = []
    for i in range(ell + 1):
        rho_i = [ZZ.random_element(p) for _ in range(ell)]
        rho_vecs.append(rho_i)

    Fp = GF(p)
    h_values = []
    for rho in rho_vecs:
        h_i = ZZ(oracle.query_hash(rho))
        h_values.append(Fp(h_i))

    A = Matrix(Fp, [[rho_vecs[i][j] for j in range(ell)]
                    for i in range(ell + 1)])
    h_vec = vector(Fp, h_values)
    try:
        c = A.solve_right(h_vec)
        return list(c)
    except ValueError:
        return None
```

### Template: Schnorr Concurrent Forgery

Kết hợp với $\ell + 1$ signing sessions để forge chữ ký thứ $\ell + 1$:

```python
def schnorr_concurrent_forge(oracle, pk, ell=32):
    sessions = []
    for _ in range(ell + 1):
        sid, R = oracle.open_session()
        sessions.append((sid, R))
    c_vec = ros_solver(oracle, p, ell)
    forged_sigs = []
    for i, (sid, R) in enumerate(sessions[:ell]):
        s = oracle.respond(sid, c_vec[i])
        forged_sigs.append((R, c_vec[i], s))
    return forge_from_ros_solution(forged_sigs, c_vec[-1], pk)
```

> [!warning] Điều kiện áp dụng ROS attack
> ROS attack chỉ áp dụng khi $\ell \geq \log_2 p$ — cần đủ sessions để overdetermine system. Với $p \approx 2^{256}$ và CTF challenge, thường $\ell = 256$ sessions. Nếu server limit concurrent sessions xuống dưới $\log_2 p$ → ROS không feasible.

---

## Pattern 4 — RSA Blinding: r Reuse và Linkability

### Dấu hiệu nhận biết

- Server cho phép nhiều lần rút cùng loại token (e-cash simulator)
- Có thể observe blinded messages được gửi đến oracle
- Suspect $r$ được reuse hoặc derived deterministally

### Detect r Reuse

Nếu cùng $\hat m_1 = H(m_1) \cdot r^e$ và sau đó $\hat m_2 = H(m_2) \cdot r^e$ với cùng $r$:

$$
\frac{\hat m_1}{\hat m_2} = \frac{H(m_1)}{H(m_2)} \bmod N
$$

Biết $m_1, m_2$ và quan sát $\hat m_1, \hat m_2$ → có thể verify nếu cùng $r$ bằng cách check ratio:

```python
def detect_r_reuse(m1_blind, m2_blind, m1, m2, N, H):
    ratio_blind = (m1_blind * inverse(m2_blind, N)) % N
    ratio_hash  = (H(m1) * inverse(H(m2), N)) % N
    if ratio_blind == ratio_hash:
        print("[!] Same blinding factor r used!")
        return True
    return False
```

---

## Pattern 5 — Schnorr Blind Sig: Missing $\beta$ Term

Khi blinding chỉ dùng $\alpha$ (commit blinding) mà thiếu $\beta$ (challenge blinding):

$$
R' = g^\alpha \cdot R, \quad c = c' \quad \text{(không trừ } \beta\text{)}
$$

Signer thấy $c = H(R' \| m)$ trực tiếp — có thể link message với session vì $c$ phụ thuộc vào $m$ không qua mask.

```python
def detect_missing_beta(oracle, msg1, msg2):
    R1, c1, s1 = oracle.sign_blind(msg1)
    R2, c2, s2 = oracle.sign_blind(msg2)
    if verify_challenge_derived_from_message(c1, msg1, R1):
        print("[!] Missing beta: challenge not masked")
        return True
    return False
```

---

## Fingerprinting Checklist — Quick Triage

Khi nhận một blind signature challenge:

```text
1. Xác định scheme:
   □ RSA raw/unpadded?  → Pattern 1 (blinding/factoring attack)
   □ Schnorr-type?       → Pattern 2, 3, 4, 5
   □ BLS/pairing-based?  → Hiếm trong CTF; check blindness

2. Kiểm tra source code (nếu có):
   □ Tìm class-level self.k hoặc self.R → nonce caching (Pattern 2C)
   □ Tìm alpha=0, beta=0 hoặc hardcoded → zero blinding (Pattern 2A)
   □ Tìm alpha = H(m) hoặc r = H(m) → deterministic (Pattern 2B, 4)
   □ Tìm limit trên concurrent sessions → nếu không có limit → ROS (Pattern 3)

3. Tương tác với oracle:
   □ Gửi cùng message hai lần → R có thay đổi không? Nếu không → nonce reuse
   □ Mở nhiều sessions song song → có timeout không? Có limit không?
   □ Gửi m=1: nếu signature là 1^d = 1 → raw RSA → Pattern 1

4. Đọc challenge description:
   □ "You cannot sign m*" → Pattern 1 (blinding/factoring)
   □ "Get a blind signature" → check blinding quality → Pattern 2
   □ "Multiple requests allowed" → Pattern 3 (ROS) nếu Schnorr-type
```

---

## References

- [[11-rsa-blinding-multiplicative-forgery|11. Attack I — RSA Blinding: Multiplicative Forgery]]
- [[12-ros-attack|12. Attack II — The ROS Attack]]
- [[13-parallel-ros-mnm-attack|13. Attack III — Parallel ROS & M&M Attack]]
- [[14-weak-blinding-linkability-flaws|14. Attack IV — Weak Blinding & Linkability Flaws]]
- VolgaCTF 2019 "Blind" — RSA blinding classic pattern
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 18–19
