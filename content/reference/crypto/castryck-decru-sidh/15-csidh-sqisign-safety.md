---
title: "15. Why CSIDH and SQISign Are Not Broken"
type: foundation
tags: [crypto, csidh, sqisign, isogeny-security, castryck-decru, lesson-15]
aliases: [CSIDH SQISign Safety]
created: 2026-04-08
---

> **Prerequisites**: [[05-sike-parameters|05. SIKE Parameters]], [[14-generalizations|14. Generalizations]]
> **Lesson type**: Foundation
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | CSIDH | Commutative SIDH — key exchange trên ordinary curves |
> | SQISign | Signature scheme từ supersingular isogenies + quaternions |
> | $[\mathfrak{a}]$ | Group action của ideal class $\mathfrak{a}$ trong CSIDH |

---

## Motivation

Sau khi SIDH/SIKE sụp đổ, câu hỏi tự nhiên là: các isogeny-based scheme khác có an toàn không? Bài này phân tích tại sao **CSIDH** và **SQISign** không bị ảnh hưởng bởi Castryck-Decru family of attacks — và điều kiện cần thiết để một isogeny-based scheme tránh khỏi attacks này.

---

## 1. Hai Điều Kiện Cần Thiết Của Attack

Để Castryck-Decru attack hoạt động, cần đồng thời hai điều kiện:

> [!note] Điều Kiện 1 — Known Degree
> Secret isogeny có degree $N = \ell^e$ với $\ell, e$ **được biết công khai**.

> [!note] Điều Kiện 2 — Auxiliary Torsion Point Images
> Public key bao gồm **images** của torsion basis của một torsion group độc lập với kernel của secret isogeny.

Cả CSIDH lẫn SQISign đều thiếu ít nhất một trong hai điều kiện này.

---

## 2. CSIDH — Không Có Torsion Images

CSIDH (Castryck, Lange, Martindale, Panny, Renes 2018) là key exchange dùng group action của class group trên ordinary elliptic curves.

**Protocol sketch**:
- Public params: ordinary curve $E_0 / \mathbb{F}_p$ (không phải $\mathbb{F}_{p^2}$)
- Private key: vector $(e_1, \ldots, e_n) \in \mathbb{Z}^n$ của exponents
- Secret action: $\phi_A = [\mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}]$ là composition của ideal-class group actions
- Public key: $E_A = [\mathfrak{a}_A](E_0)$ — **chỉ** là endpoint curve, không có torsion images

> [!abstract] Theorem 15.1 — CSIDH Không Bị Ảnh Hưởng
> Castryck-Decru attack không áp dụng cho CSIDH vì:
>
> 1. **Không có auxiliary torsion images**: Public key chỉ là curve $E_A$, không có $\phi_A(P_B), \phi_A(Q_B)$
> 2. **Ordinary curves**: Endomorphism ring là imaginary quadratic order (rank 2), không có quaternion structure để exploit
> 3. **Commutative group action**: Key exchange dựa trên commutativity của class group action, không cần isogeny degree để be public

Để perform Castryck-Decru attack, cần biết images của specific torsion points qua $\phi_A$. Không có chúng, không thể build Kani's "glue kernel".

---

## 3. SQISign — Không Có Torsion Images Và Không Fixed Degree

SQISign (De Feo, Kohel, Leroux, Petit, Wesolowski 2020) là signature scheme dùng ideal-to-isogeny algorithm trên supersingular curves.

**Signing sketch**:
- Public key: supersingular curve $E_A$ (endpoint của long walk từ $E_0$)
- Signature: một isogeny $\sigma : E_A \to E_R$ với specific properties
- Không có auxiliary torsion points trong public key hay signature

> [!abstract] Theorem 15.2 — SQISign Không Bị Ảnh Hưởng
> Castryck-Decru attack không áp dụng cho SQISign vì:
>
> 1. **Không có torsion images**: Public key và signature không chứa images của torsion basis của bất kỳ group nào
> 2. **Degree của signature không fixed**: Degree của isogeny $\sigma$ thay đổi và phụ thuộc vào message — không public constant
> 3. **Identification protocol structure**: Security dựa trên DSDH assumption, không phải SSCDH với torsion images

---

## 4. Tổng Quát: Khi Nào Một Isogeny Scheme An Toàn?

> [!info] Safe Design Principles (Post-SIDH)
> Một isogeny-based scheme tránh Castryck-Decru nếu thỏa mãn ít nhất một trong:
>
> 1. **Không tiết lộ torsion images**: Public key không chứa $\phi(P), \phi(Q)$ cho basis $\{P, Q\}$ của torsion group độc lập
> 2. **Không public degree**: Degree của secret isogeny không được biết trước bởi adversary
> 3. **Randomized isogeny structure**: Mỗi session dùng isogeny với degree ngẫu nhiên (không predictable)

Bảng tóm tắt:

| Scheme | Torsion images? | Fixed degree? | Broken by CD? |
|--------|----------------|---------------|---------------|
| SIDH/SIKE | Có | Có | **Có** |
| CSIDH | Không | Không (degree là product của small primes với random exponents) | Không |
| SQISign | Không | Không (degree từ KLPT, variable) | Không |
| SQIsignHD | Không | Không | Không |
| B-SIDH | Có (other primes) | Có | **Có** (Castryck-Decru generalized) |
| FESTA | Có, nhưng masked | Không fixed | Under study |

---

## 5. Tại Sao CSIDH Vẫn Có Security Concerns?

Dù không bị Castryck-Decru, CSIDH có concerns khác:

- **Quantum subexponential attack**: Childs-Jao-Soukharev (2010) attack CSIDH trong quantum subexponential time $L_p(1/2)$ via hidden shift problem. Mạnh hơn classical $L_p(1/2)$.
- **Parameter selection**: Cần $p$ lớn hơn để đạt same quantum security level

CSIDH vẫn là post-quantum secure (không có polynomial-time quantum attack known), nhưng không đạt security level tưởng ban đầu với $p \approx 2^{512}$.

---

## 6. Tương Lai Của Isogeny-Based Crypto

Post-SIDH, cộng đồng tập trung vào:

1. **SQISign variants**: SQISignHD (EUROCRYPT 2024), SQIsign2D — compact signatures, không torsion images
2. **CSIDH improvements**: Faster algorithms, better parameter selection
3. **FESTA/FESTA**: New KEMs avoiding fixed degree
4. **Theoretical foundations**: Rigorous security proofs for remaining schemes

> [!tip] Lesson Quan Trọng
> Castryck-Decru không phá "isogeny-based crypto" — nó phá một **specific design pattern** (known degree + auxiliary torsion images). Nhiều isogeny-based schemes không có pattern này và vẫn an toàn.

---

## References

- Castryck, W. et al. — *CSIDH: An efficient post-quantum commutative group action* (ASIACRYPT 2018)
- De Feo, L. et al. — *SQISign: Compact post-quantum signatures from quaternions and isogenies* (ASIACRYPT 2020)
- Dartois, P. et al. — *SQIsignHD: New dimensions in cryptography* (EUROCRYPT 2024)
- Galbraith, S. — *Breaking supersingular isogeny Diffie-Hellman*, ellipticnews, 2022 (FAQ on what's broken and what's not)
