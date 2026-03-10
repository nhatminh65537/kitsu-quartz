---
title: 14. Pairing-Based Cryptography Security
tags: [math, pairing, elliptic-curves, cryptography, security, lesson-14]
aliases: [Pairing Security, BDH, Security Analysis]
created: 2026-03-09
---

# 14. Bảo mật Pairing-Based Cryptography

> **Prerequisites**: [[10-pairing-friendly-curves|Pairing-Friendly Curves]], [[12-ibe-bls-signatures|IBE & BLS Signatures]], [[13-polynomial-commitments-kzg|Polynomial Commitments & KZG]]
> **Objectives**:
> - Nắm các hardness assumptions (BDH, DBDH, $q$-SDH, $q$-DLOG) và quan hệ giữa chúng
> - Hiểu security levels thực tế cho BN254 và BLS12-381 sau Kim–Barbulescu 2016
> - Biết các attack vectors: subgroup attacks, twist attacks, small subgroup attacks, pairing inversion

---

## Motivation / Intuition

Pairing-based cryptography an toàn không phải vì "pairing khó reverse" mà vì **các bài toán liên quan** được giả định là khó. Lesson này tổng hợp:

1. **Assumptions**: BDH, DBDH, $q$-SDH và tại sao chúng cần thiết.
2. **Security reductions**: scheme X an toàn *nếu* assumption Y là khó.
3. **Concrete security**: BN254 và BLS12-381 thực sự cho bao nhiêu bits of security?
4. **Attack taxonomy**: các attack vào implementation (không phải assumption) mà người code cần đề phòng.

---

## Computational Assumptions

### Definition

> [!definition] Definition 14.1 — CDH và ECDLP
> Cho pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$, generator $G_i \in \mathbb{G}_i$.
>
> **ECDLP** trên $\mathbb{G}_1$: Cho $[a]G_1$, tìm $a$.
>
> **CDH** trên $\mathbb{G}_1$: Cho $([a]G_1, [b]G_1)$, tính $[ab]G_1$.

> [!definition] Definition 14.2 — BDH (Bilinear Diffie-Hellman)
> **BDH problem**: Cho $(G_1, [a]G_1, [b]G_1, [c]G_1) \in \mathbb{G}_1^4$, tính $e(G_1,G_1)^{abc} \in \mathbb{G}_T$.
>
> **BDH assumption**: BDH là bài toán khó (polynomial-time algorithm tồn tại với xác suất negligible).

> [!definition] Definition 14.3 — DBDH (Decisional BDH)
> **DBDH problem**: Cho $(G_1, [a]G_1, [b]G_1, [c]G_1, T)$, phân biệt $T = e(G_1,G_1)^{abc}$ với $T$ random.
>
> DBDH là **Decisional** variant — khó hơn Computational BDH (DBDH hard $\Rightarrow$ BDH hard).

> [!theorem] Theorem 14.4 — Quan Hệ Giữa Các Assumptions
> Chuỗi implications (mũi tên = "hard implies hard"):
>
> $$
> \text{ECDLP hard} \Rightarrow \text{CDH hard} \Rightarrow \text{BDH hard} \Rightarrow \text{DBDH hard}
> $$
>
> Quan hệ ngược không biết/không đúng:
>
> - CDH hard không biết có $\Rightarrow$ ECDLP hard không.
> - BDH hard không biết có $\Rightarrow$ CDH hard không.
>
> **Proof của BDH $\Rightarrow$ DBDH**: Nếu tồn tại distinguisher $\mathcal{D}$ cho DBDH, có thể build solver cho BDH bằng self-reducibility. $\blacksquare$ (sketch)

> [!note] Remark 14.5 — Tại Sao Dùng DBDH Thay BDH?
> Nhiều schemes (BF-IBE, HIBE) cần **semantic security** (IND-CPA), cần Decisional assumption. CDH/BDH chỉ cho computational security. DBDH là assumption tối thiểu cho IND-CPA IBE.

---

## $q$-Type Assumptions

> [!definition] Definition 14.6 — $q$-SDH (Strong Diffie-Hellman)
> **$q$-SDH problem**: Cho $(G_1, [\tau]G_1, [\tau^2]G_1, \ldots, [\tau^q]G_1)$ từ SRS, tìm $(c, [1/(\tau+c)]G_1)$ với $c \in \mathbb{Z}_r$.
>
> **$q$-SDH assumption**: $q$-SDH là khó với $q$ polynomial trong security parameter.
>
> KZG **soundness** reduces từ $q$-SDH (với $q = \deg f$): forge opening proof $\Leftrightarrow$ giải $q$-SDH.

> [!definition] Definition 14.7 — $q$-DLOG (Discrete Log với SRS)
> **$q$-DLOG problem**: Cho $(G_1, [\tau]G_1, \ldots, [\tau^q]G_1)$, tìm $\tau \in \mathbb{Z}_r$.
>
> $q$-DLOG là $q$-type assumption mạnh hơn $q$-SDH: $q$-DLOG hard $\Rightarrow$ $q$-SDH hard.

> [!note] Remark 14.8 — $q$-Type vs Standard Assumptions
> $q$-type assumptions **không falsifiable** theo nghĩa của Naor (2003): verification condition phụ thuộc vào adversary input. Điều này là vấn đề lý thuyết nhưng thực tế vẫn chấp nhận được khi:
> - $q$ cố định và nhỏ (Groth16: $q = O(|C|)$ với circuit $C$).
> - Không có known break.
> - Sử dụng trong chuẩn (Ethereum, Zcash).
>
> **Transparent** systems (STARK, IPA) tránh trusted setup và $q$-type assumptions.

---

## Concrete Security: BN254 vs BLS12-381

> [!theorem] Theorem 14.9 — Security Levels (Post-Kim–Barbulescu 2016)
> Kim–Barbulescu cải thiện **Extended Tower NFS (TNFS)** cho DLP trong $\mathbb{F}_{p^k}$:
>
> | Curve | $\|p\|$ | $k$ | $\|p^k\|$ | EC security | $\mathbb{F}_{p^k}$ security | Tổng |
> |---|---|---|---|---|---|---|
> | BN254 | 254 | 12 | 3048 | ~127 bits | ~100 bits | **~100 bits** |
> | BLS12-381 | 381 | 12 | 4572 | ~127 bits | ~128 bits | **~128 bits** |
> | BLS12-461 | 461 | 12 | 5532 | ~128 bits | ~140 bits | **~128 bits** |
>
> "Tổng" = $\min(\text{EC}, \mathbb{F}_{p^k})$ — kẻ tấn công chọn bài toán dễ hơn.

> [!note] Remark 14.10 — Tại Sao BN254 Bị Suy Yếu?
> Trước 2016, ước tính NFS cho $\mathbb{F}_{p^{12}}$ với $|p^{12}|=3048$ bits $\approx 128$-bit security. Kim–Barbulescu (2016) áp dụng TNFS, giảm xuống ~100-bit cho $k=12$. Cần tăng $|p^{12}|$ lên ~4600 bits để đạt 128-bit → BLS12-381.
>
> **Hệ quả**: Groth16 với BN254 (Zcash Sprout, Ethereum EIP-196/197) có ~100-bit security. Vẫn an toàn thực tế ngắn hạn nhưng không nên dùng cho hệ thống cần 128-bit.

> [!example] Example 14.11 — Tính Security của BN254 (Rough Estimate)
> DLP trong $\mathbb{F}_{p^{12}}$, $|p^{12}| = 3048$ bits. Dùng công thức NFS:
>
> Complexity $\approx L_N[1/3, 1.923]$ với $N = p^{12}$:
>
> $$
> L_N[1/3, c] = \exp\!\left(c \cdot (\ln N)^{1/3} \cdot (\ln \ln N)^{2/3}\right)
> $$
>
> Với $\ln N \approx 3048 \cdot \ln 2 \approx 2112$:
>
> $$
> (\ln N)^{1/3} \approx 12.8, \quad (\ln \ln N)^{2/3} \approx (7.66)^{2/3} \approx 3.9
> $$
>
> Cost $\approx \exp(1.923 \times 12.8 \times 3.9) / \ln 2 \approx 2^{138}$ (trước TNFS). Với TNFS: giảm xuống $\approx 2^{100}$.

---

## Attack Taxonomy: Implementation Attacks

### Subgroup Attack

> [!definition] Definition 14.12 — Subgroup Attack
> $E(\mathbb{F}_p)$ có order $\#E = r \cdot h$ với cofactor $h > 1$.
>
> **Subgroup attack**: attacker gửi $Q' \in E(\mathbb{F}_p)$ với $Q' \notin \mathbb{G}_1$ (không phải $r$-torsion). Khi victim tính $e(P, Q')$, kết quả nằm trong subgroup nhỏ hơn của $\mathbb{G}_T$, có thể leak thông tin về $P$.
>
> **Fix**: trước khi dùng point $Q$, verify $[r]Q = \mathcal{O}$ (cofactor clearing, hoặc membership check).

### Twist Attack

> [!definition] Definition 14.13 — Twist Attack
> $E/\mathbb{F}_p$ có **quadratic twist** $E^t/\mathbb{F}_p$ với $\#E^t = p+1 + t$ (khi $\#E = p+1-t$). Nếu attacker gửi $P^t \in E^t$ thay vì $P \in E$, victim có thể tính pairing trên curve sai.
>
> **Fix**: validate point trước khi dùng: kiểm tra $P$ thỏa equation của $E$ (không phải $E^t$), và $[r]P = \mathcal{O}$.

> [!example] Example 14.14 — Twist Attack trên BLS12-381
> BLS12-381 có sextic twist $E'/\mathbb{F}_{p^2}$. $\mathbb{G}_2 \subset E'(\mathbb{F}_{p^2})$ với order $r$ nhưng cofactor $h_2 \approx 2^{305}$. Nếu không clear cofactor khi hash-to-$\mathbb{G}_2$, kết quả có thể ở subgroup nhỏ.
>
> **Fix**: RFC 9380 chuẩn hóa cofactor clearing cho BLS12-381 (Wahby-Boneh endomorphism method).

### Small Subgroup Attack

> [!warning] Counterexample 14.15 — Small Subgroup Attack trên $\mathbb{G}_T$
> $\mathbb{G}_T \subset \mathbb{F}_{p^{12}}^*$, $|\mathbb{G}_T| = r$. Nhưng $|\mathbb{F}_{p^{12}}^*| = p^{12}-1 = r \cdot s$ với $s$ lớn.
>
> Kẻ tấn công có thể gửi $T^* \in \mu_d \subset \mathbb{F}_{p^{12}}^*$ với $d \mid s$ nhỏ. Nếu protocol không verify $T^* \in \mu_r$, tính toán trên $T^*$ leak thông tin.
>
> **Fix**: Sau final exponentiation, verify $\hat{t}^r = 1$ (tức verify output $\in \mu_r$).

### Pairing Inversion

> [!note] Remark 14.16 — Pairing Inversion Problem (PIP)
> **PIP**: Cho $T \in \mathbb{G}_T$, tìm $P \in \mathbb{G}_1$ sao cho $e(P, G_2) = T$.
>
> PIP chưa có efficient algorithm biết đến. Nếu PIP dễ → ECDLP dễ (vì $T = e(P, G_2)$, $P' = e([a]G_1, G_2) = T^a$ → biết $a$ từ DLP trong $\mathbb{G}_T$).
>
> **PIP hard** không được chứng minh từ ECDLP/CDH — đây là assumption riêng. Không nên xây dựng scheme yêu cầu PIP hard trừ khi có reduction.

---

## So Sánh BN254 và BLS12-381

| Security property | BN254 | BLS12-381 |
|---|---|---|
| EC security ($\mathbb{G}_1$) | ~127 bits | ~127 bits |
| $\mathbb{F}_{p^{12}}$ security | ~100 bits (post-KB) | ~128 bits |
| **Tổng** | **~100 bits** | **~128 bits** |
| BDH security | ~100 bits | ~128 bits |
| $q$-SDH security | ~100 bits | ~128 bits |
| Cofactor $h_2$ ($\mathbb{G}_2$) | 1 (trivial) | ~305-bit (nặng) |
| Khuyến nghị | Không nên mới | Hiện tại standard |

---

## Lựa Chọn Curve Cho Ứng Dụng

> [!note] Remark 14.17 — Khi Nào Dùng Curve Nào?
> **BN254**:
> - Legacy Ethereum (EIP-196/197), Zcash Sprout, Groth16 trên Ethereum.
> - Cân nhắc: ~100-bit security đủ cho ngắn hạn (2025–2030), nhưng migrate nếu cần 128-bit.
>
> **BLS12-381**:
> - Ethereum 2.0 BLS signatures, Zcash Sapling/Orchard, Filecoin.
> - EIP-4844 KZG commitments.
> - **Khuyến nghị** cho hệ thống mới cần 128-bit security.
>
> **BLS12-461 hoặc BW6-761**:
> - Cần security > 128-bit (post-quantum margin, long-term).
> - BW6-761 cho phép recursive proofs (verify BLS12-381 proofs trong BLS12-381 circuit).

---

## SageMath Cheatsheet

```python
# Kiểm tra subgroup membership
E = EllipticCurve(GF(103), [0, 7])   # BN x=1
r = 97; h = E.order() // r
G = r * E.random_point()              # cofactor clearing
print([r]*G == E(0))                  # True → G ∈ G1

# Verify pairing output ∈ mu_r
# After computing t = pairing_output:
# t^r should be 1 (check membership in G_T)
# In SageMath Weil pairing, output already in mu_r by construction.
# For Tate: check t^r == 1
p=103; k=1
E2 = EllipticCurve(GF(p), [0,7])
P = E2.random_point()
while P.order() != r: P = E2.random_point()
Q = E2.random_point()
while Q.order() != r: Q = E2.random_point()
t = P.tate_pairing(Q, r, k)
print(t^r)                            # 1 → ∈ mu_r ✓

# Security estimate: NFS on F_p^k
import math
def security_bits_nfs(p_bits, k, c=1.923):
    """Rough NFS security estimate for F_{p^k}"""
    N_bits = p_bits * k
    ln_N = N_bits * math.log(2)
    ln_ln_N = math.log(ln_N)
    cost = c * (ln_N)**(1/3) * (ln_ln_N)**(2/3) / math.log(2)
    return cost

print(f"BN254:    ~{security_bits_nfs(254, 12):.0f} bits")
print(f"BLS12-381: ~{security_bits_nfs(381, 12):.0f} bits")
print(f"BLS12-461: ~{security_bits_nfs(461, 12):.0f} bits")
# Expected: ~138, ~164, ~177 (raw NFS; with TNFS corrections: ~100, ~128, ~140)
```

---

## Summary / Key Takeaways

- **BDH** và **DBDH** là hardness assumptions cốt lõi cho BF-IBE và BLS.
- **$q$-SDH**: KZG soundness giảm về $q$-SDH.
- **Hierarchy**: ECDLP $\Rightarrow$ CDH $\Rightarrow$ BDH $\Rightarrow$ DBDH (về phía "nếu cái trước khó thì cái sau khó").
- **BN254** (~100-bit sau KB 2016): an toàn ngắn hạn, không nên dùng cho hệ thống mới cần 128-bit.
- **BLS12-381** (~128-bit): standard hiện tại cho pairing-based crypto production.
- **Subgroup attack**: gửi point ngoài $\mathbb{G}_i$ — fix bằng membership check.
- **Twist attack**: gửi point trên twisted curve — fix bằng validate equation và cofactor clear.
- **Small subgroup ($\mathbb{G}_T$)**: gửi element ngoài $\mu_r$ — fix bằng verify $T^r = 1$.
- **Pairing inversion** là open problem; không assume PIP hard trừ khi có explicit reduction.

---

## References

- Kim & Barbulescu (2016), "Extended Tower Number Field Sieve: A New Complexity for the Medium Prime Case" — TNFS làm yếu BN254.
- Menezes, Sarkar & Singh (2017), "Challenges with Assessing the Impact of NFS on the Security of Pairing-Based Cryptography".
- Galbraith, MoPKC, §26.5–26.6 — security analysis, assumptions.
- Boneh, Boyen & Shacham (2004), "Short Group Signatures" — $q$-SDH introduction.
- Wahby & Boneh (2019), "Fast and Simple Constant-Time Hashing to the BLS12-381" — cofactor clearing.
- Guillevic (2020), "A Short-List of Pairing-Friendly Curves Resistant to Special TNFS" — security updates.
- RFC 9380 (IETF 2023) — hash-to-curve, including subgroup membership tests.