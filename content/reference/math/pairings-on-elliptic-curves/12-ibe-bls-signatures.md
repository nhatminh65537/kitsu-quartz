---
title: 12. IBE & BLS Signatures
tags: [math, pairing, elliptic-curves, cryptography, lesson-12]
aliases: [IBE, BLS Signatures, Boneh-Franklin]
created: 2026-03-09
---

# 12. Ứng dụng: IBE và BLS Signatures

> **Prerequisites**: [[11-mov-attack-frey-ruck-attack|MOV Attack & Frey–Rück Attack]], [[06-weil-pairing|Weil Pairing]]  
> **Objectives**:  
> - Hiểu Boneh–Franklin IBE: dùng pairing để encrypt trực tiếp vào identity
> - Nắm BLS short signatures: chữ ký ngắn nhất có thể, aggregatable
> - Thấy bilinearity là "kỹ năng" cốt lõi trong cả hai ứng dụng

---

## Motivation / Intuition

Tại sao pairing lại hữu ích cho crypto? Pairing có một tính chất mà không có primitive nào khác có: **bilinearity kết nối scalar multiplication trên EC với exponentiation trong $\mathbb{F}_{p^k}^*$**:

$$
e([a]P, [b]Q) = e(P, Q)^{ab} = e([ab]P, Q) = e(P, [ab]Q)
$$

Đây là công cụ toán học cho phép:
- **IBE**: party biết public key của người nhận (chỉ là string/identity) mà không cần cơ sở hạ tầng PKI phức tạp.
- **BLS**: chữ ký ngắn và có thể **aggregate** (gộp nhiều chữ ký thành một) — cực kỳ quan trọng cho blockchain consensus.

Lesson này là demo trực tiếp của "pairing-based crypto" trong thực tiễn.

---

## Joux Tripartite Diffie-Hellman

> [!theorem] Theorem 12.1 — Joux One-Round Tripartite DH (2000)
> Trên $(E, e, \mathbb{G}_1, \mathbb{G}_T)$ với $\mathbb{G}_1 = \mathbb{G}_2$ (curve có distortion map). Ba bên A, B, C với secrets $a, b, c \in \mathbb{Z}_r$:
>
> - A broadcasts $[a]G$; B broadcasts $[b]G$; C broadcasts $[c]G$.
>
> Mỗi bên tính shared key:
>
> $$
> K = e(G,G)^{abc}
> $$
>
> - A: $K_A = e([b]G, [c]G)^a = e(G,G)^{bc \cdot a}$
> - B: $K_B = e([a]G, [c]G)^b = e(G,G)^{ac \cdot b}$
> - C: $K_C = e([a]G, [b]G)^c = e(G,G)^{ab \cdot c}$
>
> $K_A = K_B = K_C = e(G,G)^{abc}$ ✓ — chỉ **một vòng** (so với DH thông thường cần ba vòng).

> [!note] Remark 12.2 — Tại sao cần $\mathbb{G}_1 = \mathbb{G}_2$?
> Bước A tính $e([b]G, [c]G)$: cả $[b]G$ và $[c]G$ đều thuộc $\mathbb{G}_1$. Để Ate/Weil pairing có hai inputs từ cùng nhóm, cần distortion map $\psi: \mathbb{G}_1 \to \mathbb{G}_2$, hoặc dùng Weil pairing trực tiếp trên curves với $\mathbb{G}_1 = \mathbb{G}_2$ (supersingular).
>
> Trong thực tế, Joux tripartite DH dùng **supersingular curves** — điều kỳ lạ là supersingular curves không an toàn cho ECDLP (MOV attack, Lesson 11) nhưng lại **an toàn** cho pairing-based crypto khi assumption đặt trên bài toán pairing!

---

## Boneh–Franklin IBE

> [!definition] Definition 12.3 — Identity-Based Encryption (IBE)
> **IBE** (mã hóa dựa trên định danh) cho phép encrypt trực tiếp cho identity string (email, số điện thoại...) mà không cần certificate PKI. Một **Private Key Generator (PKG)** giữ master secret và cấp private key cho users.

> [!definition] Definition 12.4 — Boneh–Franklin IBE Scheme
> **Setup** (PKG thực hiện):
> - Chọn pairing $e: \mathbb{G}_1 \times \mathbb{G}_1 \to \mathbb{G}_T$, generator $G \in \mathbb{G}_1$.
> - Chọn master secret $s \in \mathbb{Z}_r^*$; tính $P_{\text{pub}} = [s]G$.
> - Chọn hash functions $H_1: \{0,1\}^* \to \mathbb{G}_1$ và $H_2: \mathbb{G}_T \to \{0,1\}^n$.
> - **Public params**: $(e, G, P_{\text{pub}}, H_1, H_2)$. **Master secret**: $s$.
>
> **Extract** (PKG cấp private key cho user ID):
>
> $$
> d_{\text{ID}} = [s] H_1(\text{ID}) \in \mathbb{G}_1
> $$
>
> **Encrypt** (bất kỳ ai encrypt cho ID):
> - Chọn $r \xleftarrow{R} \mathbb{Z}_r^*$; tính $U = [r]G$.
> - Tính $V = M \oplus H_2\!\left(e(H_1(\text{ID}), P_{\text{pub}})^r\right)$.
> - **Ciphertext**: $(U, V)$.
>
> **Decrypt** (user ID dùng $d_{\text{ID}}$):
>
> $$
> M = V \oplus H_2(e(U, d_{\text{ID}}))
> $$

> [!theorem] Theorem 12.5 — Correctness of BF-IBE
> $\operatorname{Decrypt}(d_{\text{ID}}, \operatorname{Encrypt}(\text{ID}, M)) = M$.
>
> **Proof.** Ta cần chứng minh $e(U, d_{\text{ID}}) = e(H_1(\text{ID}), P_{\text{pub}})^r$:
>
> $$
> \begin{aligned}
> e(U, d_{\text{ID}}) &= e([r]G,\; [s]H_1(\text{ID})) \\
> &= e(G, H_1(\text{ID}))^{rs} \\
> &= e(H_1(\text{ID}), G)^{rs} \quad (\text{bilinearity, symmetry}) \\
> &= e(H_1(\text{ID}), [s]G)^r \\
> &= e(H_1(\text{ID}), P_{\text{pub}})^r
> \end{aligned}
> $$
>
> Vậy $V \oplus H_2(e(U, d_{\text{ID}})) = V \oplus H_2(e(H_1(\text{ID}), P_{\text{pub}})^r) = M$. $\blacksquare$

> [!note] Remark 12.6 — Bảo Mật BF-IBE
> BF-IBE an toàn trong Random Oracle Model dưới **BDH assumption** (Bilinear Diffie-Hellman):
>
> Cho $(G, [a]G, [b]G, [c]G)$, khó tính $e(G,G)^{abc}$ mà không biết $a, b, c$.
>
> Sau Kim–Barbulescu (2016): cần dùng BLS12-381 thay vì BN254 để đạt 128-bit BDH security.

> [!example] Example 12.7 — Sử Dụng BF-IBE
> Alice muốn gửi mật thư cho Bob với địa chỉ `bob@company.com`:
>
> 1. PKG tính $d_{\text{Bob}} = [s]H_1(\texttt{bob@company.com})$, gửi cho Bob qua kênh xác thực.
> 2. Alice: tính $e(H_1(\texttt{bob@company.com}), P_{\text{pub}})^r$, encrypt ciphertext $(U, V)$.
> 3. Bob: decrypt bằng $d_{\text{Bob}}$ — không cần certificate, không cần Bob có sẵn public key trước.
>
> **Lợi điểm**: Email address là public key! Không cần PKI overhead.

---

## BLS Short Signatures

> [!definition] Definition 12.8 — BLS Signature Scheme (Boneh–Lynn–Shacham, 2001)
> Cho pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$.
>
> **Key Generation**:
> - Chọn $s \xleftarrow{R} \mathbb{Z}_r^*$ (secret key).
> - Tính $\text{pk} = [s]G_2 \in \mathbb{G}_2$ (public key).
>
> **Sign** (message $m$, secret key $s$):
>
> $$
> \sigma = [s]\, H(m) \in \mathbb{G}_1
> $$
>
> trong đó $H: \{0,1\}^* \to \mathbb{G}_1$ là hash function ("hash-to-curve").
>
> **Verify** (message $m$, signature $\sigma$, public key $\text{pk}$):
>
> $$
> e(\sigma,\, G_2) \stackrel{?}{=} e(H(m),\, \text{pk})
> $$

> [!theorem] Theorem 12.9 — Correctness of BLS
> $e([s]H(m), G_2) = e(H(m), [s]G_2)$.
>
> **Proof.** $e([s]H(m), G_2) = e(H(m), G_2)^s = e(H(m), [s]G_2)$ theo bilinearity. $\blacksquare$

> [!theorem] Theorem 12.10 — BLS Signature Aggregation
> Cho $n$ users với public keys $\{\text{pk}_i = [s_i]G_2\}$ và signatures $\{\sigma_i = [s_i]H(m_i)\}$ trên messages $\{m_i\}$.
>
> **Aggregate signature**:
>
> $$
> \sigma_{\text{agg}} = \sum_{i=1}^n \sigma_i = \left[\sum_i s_i\right] (\cdots) \quad \text{(EC addition)}
> $$
>
> Thực tế: $\sigma_{\text{agg}} = \sigma_1 + \sigma_2 + \cdots + \sigma_n \in \mathbb{G}_1$ (một điểm duy nhất!).
>
> **Verify aggregate** (cùng message $m$ cho tất cả):
>
> $$
> e\!\left(\sigma_{\text{agg}}, G_2\right) \stackrel{?}{=} e\!\left(H(m), \sum_{i=1}^n \text{pk}_i\right)
> $$
>
> Chỉ cần **một pairing evaluation**!

> [!note] Remark 12.11 — Tại Sao Aggregation Quan Trọng?
> Trong **Ethereum 2.0 Beacon Chain**: có ~500,000 validators, mỗi epoch (~6.4 phút) cần ~$3\times 10^5$ chữ ký xác nhận block. Không aggregate: truyền $300,000 \times 48$ bytes = $\approx 14.4$ MB mỗi epoch. Với BLS aggregation: chỉ cần **48 bytes** (một $\mathbb{G}_1$ point) + $n$ public keys. Bandwidth giảm $300,000\times$.
>
> Đây là lý do BLS12-381 được chọn cho Ethereum 2.0.

> [!warning] Counterexample 12.12 — Rogue Key Attack
> **Rogue key attack**: kẻ tấn công tuyên bố public key $\text{pk}^* = [s^*]G_2 - \text{pk}_{\text{Alice}}$. Khi aggregate $\text{pk}_{\text{Alice}} + \text{pk}^* = [s^*]G_2$, signature của attacker "absorb" Alice.
>
> **Fix**: **Proof of Possession** — mỗi signer phải chứng minh biết secret key $s_i$ tương ứng với $\text{pk}_i$ (sign một message đặc biệt khi đăng ký). Ethereum 2.0 dùng PoP.
>
> Hoặc dùng **hash-of-public-keys** scheme (variant safe without PoP).

---

## Hash-to-Curve

> [!note] Remark 12.13 — Hash-to-Curve: $H: \{0,1\}^* \to \mathbb{G}_1$
> BLS cần map một message tùy ý vào $\mathbb{G}_1 \subset E(\mathbb{F}_p)$. Cách naive (hash → $x$, tìm $y$) không cho distribution đều.
>
> **RFC 9380** (IETF, 2023) chuẩn hóa hash-to-curve:
>
> 1. **Hash-to-field**: $u_0, u_1 \leftarrow H(\text{msg}) \in \mathbb{F}_p$ (expand_message_xmd với SHA-256).
> 2. **Map-to-curve**: $Q_0 = \text{SSWU}(u_0)$, $Q_1 = \text{SSWU}(u_1)$ (Simplified SWU map).
> 3. **Clear cofactor**: $P = Q_0 + Q_1$, rồi $[h_{\text{eff}}]P$ (cofactor clearing).
>
> Output: $P \in \mathbb{G}_1$ uniformly distributed.

---

## SageMath Cheatsheet

```python
# BLS-like signature verification (toy, dùng Weil pairing)
p = 631; E = EllipticCurve(GF(p), [30, 34])
r = 5  # prime order subgroup
G1_pts = [P for P in E if P.order() == r]
G1 = G1_pts[0]  # generator G1

# Simulate G2 = G1 for toy (no twist)
G2 = G1

# Key generation
s = 3  # secret key
pk = s * G2  # public key [s]G2

# Hash-to-curve (toy: pick fixed point based on message)
def H_msg(m, E, r):
    """Toy hash-to-curve: deterministic"""
    h = hash(m) % r
    return h * E(G1)

m = "hello"
Hm = H_msg(m, E, r)
sigma = s * Hm          # sign

# Verify
lhs = sigma.weil_pairing(G2, r)
rhs = Hm.weil_pairing(pk, r)
# Weil: e([s]Hm, G) = e(Hm, G)^s and e(Hm, [s]G) = e(Hm,G)^s → equal
print(lhs == rhs)        # True (up to sign from Weil)

# BLS aggregation (toy, 2 signers)
s1, s2 = 2, 4
pk1, pk2 = s1*G2, s2*G2
sig1 = s1 * H_msg("msg1", E, r)
sig2 = s2 * H_msg("msg2", E, r)
sig_agg = sig1 + sig2    # aggregate signature (one EC point)
pk_agg = pk1 + pk2

# Aggregate verify (same message only):
m_common = "vote_yes"
Hm_c = H_msg(m_common, E, r)
sig_common_agg = (s1 + s2) * Hm_c
e_lhs = sig_common_agg.weil_pairing(G2, r)
e_rhs = Hm_c.weil_pairing(pk_agg, r)
print(e_lhs == e_rhs)    # True
```

---

## Summary / Key Takeaways

- **Bilinearity** $e([a]P, [b]Q) = e(P,Q)^{ab}$ là nền tảng của cả BF-IBE và BLS.
- **BF-IBE**: $d_{\text{ID}} = [s]H_1(\text{ID})$; decrypt dùng $e(U, d_{\text{ID}}) = e(H_1(\text{ID}), P_{\text{pub}})^r$; an toàn dưới BDH.
- **BLS Sign**: $\sigma = [s]H(m)$ — một điểm $\mathbb{G}_1$ (48 bytes trên BLS12-381).
- **BLS Verify**: $e(\sigma, G_2) = e(H(m), \text{pk})$ — hai pairing evaluations.
- **BLS Aggregation**: $\sigma_{\text{agg}} = \sum \sigma_i$ — một điểm; verify với một pairing. Cực kỳ scalable.
- **Rogue key attack**: fix bằng Proof of Possession (PoP).
- **Hash-to-curve**: RFC 9380 chuẩn hóa map $\{0,1\}^* \to \mathbb{G}_1$ (SSWU + cofactor clearing).
- **Joux tripartite DH**: một vòng thay vì ba — ứng dụng đầu tiên của pairing trong crypto thực tế.
- BLS12-381: $|\mathbb{G}_1| = 48$ bytes, $|\mathbb{G}_2| = 96$ bytes — signatures ngắn hơn ECDSA đáng kể.

---

## References

- Boneh & Franklin (2001), "Identity-Based Encryption from the Weil Pairing" — IBE gốc.
- Boneh, Lynn & Shacham (2001), "Short Signatures from the Weil Pairing" — BLS signatures.
- Joux (2000), "A One Round Protocol for Tripartite Diffie-Hellman" — tripartite DH.
- Galbraith, MoPKC, §23.3 (BLS), §24.2 (IBE), §26.6 (BDH assumption).
- RFC 9380 (IETF, 2023) — Hashing to Elliptic Curves.
- Boneh et al. (2018), "Compact Multi-Signatures for Smaller Blockchains" — BLS aggregation variants.
- Ethereum 2.0 BLS spec: `ethereum.github.io/consensus-specs/`.