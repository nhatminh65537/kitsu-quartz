---
title: 11. MOV Attack & Frey–Rück Attack
tags: [math, pairing, elliptic-curves, lesson-11]
aliases: [MOV Attack & Frey–Rück Attack]
created: 2026-03-09
---

# 11. MOV Attack và Frey–Rück Attack

> **Prerequisites**: [[06-weil-pairing|Weil Pairing]], [[08-tate-lichtenbaum-pairing|Tate–Lichtenbaum Pairing]], [[10-pairing-friendly-curves|Pairing-Friendly Curves]]
> **Objectives**:
> - Hiểu MOV attack: dùng Weil pairing để biến ECDLP thành DLP trong extension field
> - Hiểu Frey–Rück attack: phiên bản dùng Tate pairing, hiệu quả hơn
> - Nắm điều kiện để attacks này work và cách phòng tránh (embedding degree lớn)

---

## Motivation / Intuition

Cho đến nay ta đã xây dựng pairings như công cụ mật mã học (IBE, BLS, KZG). Nhưng pairings cũng là **vũ khí tấn công**: chúng có thể **phá ECDLP** trên một số lớp đường cong nhất định.

Ý tưởng cốt lõi: ECDLP (tìm $k$ từ $P$ và $Q = kP$) khó trên $E(\mathbb{F}_q)$ — best algorithm là Pollard's rho, $O(\sqrt{n})$. Nhưng DLP trong $\mathbb{F}_{q^k}^*$ có thể dễ hơn nhiều nếu $k$ nhỏ — NFS/index calculus chạy sub-exponential.

Nếu embedding degree $k$ nhỏ, pairing **map** ECDLP → DLP trong $\mathbb{F}_{q^k}^*$:
$$
e(P, Q) = e(P, kP) = e(P,P)^k
$$
Biết $e(P,P)$ và $e(P,Q)$, ta solve DLP trong $\mu_n \subset \mathbb{F}_{q^k}^*$ để tìm $k$.

---

## MOV Attack — Menezes–Okamoto–Vanstone (1991)

### Theorem

> [!theorem] Theorem 11.1 — MOV Reduction (ECDLP → DLP)
> Cho $E/\mathbb{F}_q$, $P \in E(\mathbb{F}_q)$ có order $n$, và $Q = [k]P$ là instance ECDLP. Nếu embedding degree $\ell$ (tức $n \mid q^\ell - 1$) thỏa $\ell$ "nhỏ", thì:
>
> 1. Chọn $R \in E[n]$ sao cho $e_n(P, R)$ là primitive $n$-th root of unity $\zeta \in \mathbb{F}_{q^\ell}^*$
> 2. Tính $\alpha = e_n(P, R) = \zeta$ và $\beta = e_n(Q, R) = e_n([k]P, R) = \zeta^k$
> 3. Solve DLP: tìm $k$ sao cho $\alpha^k = \beta$ trong $\mathbb{F}_{q^\ell}^*$
>
> Bước 3 là **DLP trong $\mathbb{F}_{q^\ell}^*$**, có thể giải bằng index calculus (NFS) trong $\tilde{O}(q^{\ell/3})$ nếu $\ell$ nhỏ.

**Proof.** Bước 2 dùng bilinearity: $e_n(Q, R) = e_n([k]P, R) = e_n(P,R)^k = \zeta^k$. $\blacksquare$

> [!note] Remark 11.2 — Điều kiện để MOV work
> MOV attack hiệu quả khi:
> - $\ell$ (embedding degree) đủ nhỏ để DLP trong $\mathbb{F}_{q^\ell}^*$ khả thi
> - Cụ thể: nếu $\ell \cdot \log_2 q < 3000$ bits, NFS attack có thể giải DLP
> - Với $n \approx 2^{256}$ (ECDLP hard): cần $\ell \cdot \log_2 q \geq 3072$ bits để cả hai khó
>
> **Điều kiện an toàn**: embedding degree $k \geq 20$ với $q \approx 2^{256}$ (nghĩa là DLP trong $\mathbb{F}_{q^k}$ ở level 256-bit $\times$ 20 = 5120+ bits). Trong thực tế, các curves production dùng $k \geq 12$ với $q \approx 2^{381}$ → $12 \times 381 = 4572$ bits.

---

## Supersingular Curves — Mục Tiêu Ưu Tiên của MOV

> [!theorem] Theorem 11.3 — Embedding Degree của Supersingular Curves
> Cho $E/\mathbb{F}_q$ supersingular ($t = 0$ khi $\text{char}(\mathbb{F}_q) > 3$). Khi đó:
>
> - Nếu $q = p$ (prime): embedding degree $k \leq 6$ (cụ thể: $k \in \{1, 2, 3, 4, 6\}$ tùy theo $p \bmod 12$)
> - Nếu $q = 2^m$: $k = 4$
> - Nếu $q = 3^m$: $k = 6$

> [!example] Example 11.4 — MOV trên Supersingular E/$\mathbb{F}_p$
> **Supersingular curve**: $E: y^2 = x^3 + x$ / $\mathbb{F}_{11}$ (vì $11 \equiv 3 \pmod{4}$, nên $t = 0$).
>
> $\#E(\mathbb{F}_{11}) = 12$. Tác động của Frobenius: $\phi_{11}^2 = -11$ trên $E[n]$ → $t = 0$ → $\phi_{11}^2 = [-q]$.
>
> Embedding degree: ta cần $n \mid 11^k - 1$. Với $n = 12$: $11^1 - 1 = 10$ ($12 \nmid 10$), $11^2 - 1 = 120 = 12 \times 10$ ($12 \mid 120$) → $k = 2$.
>
> **Attack**: ECDLP trên $E(\mathbb{F}_{11})$ với bậc 12 → DLP trong $\mathbb{F}_{121}^*$ (bậc 120). Với $n = 12$: DLP trong nhóm bậc 12 trong $\mathbb{F}_{121}^*$ — **trivial** bằng BSGS ($O(\sqrt{12}) = 4$ steps).
>
> Với $p$ lớn hơn: ECDLP trên supersingular curve bậc $n \approx p$ reduces to DLP trong $\mathbb{F}_{p^2}^*$ ($\approx 2p$ bits) — dễ hơn nhiều so với $\mathbb{F}_{p^{12}}^*$.

> [!warning] Counterexample 11.5 — Supersingular Curves KHÔNG an toàn cho ECDLP
> **Không bao giờ** dùng supersingular curves trong ECDLP-based protocols (ECDH, ECDSA). Chúng bị phá bởi MOV attack với $k \leq 6$.
>
> Nhầm lẫn phổ biến: "supersingular curves dùng trong pairing-based crypto nên phải an toàn cho ECDLP." SAI — chúng an toàn **vì** pairing là primitive, không phải vì ECDLP khó.

---

## Frey–Rück Attack (1994)

> [!theorem] Theorem 11.6 — Frey–Rück Reduction
> Frey và Rück (1994) đề xuất dùng **Tate pairing** thay vì Weil để thực hiện cùng reduction:
>
> Với $P \in E(\mathbb{F}_q)[n]$, $Q = [k]P$, và $R \in E(\mathbb{F}_{q^\ell})[n]$ sao cho $\hat{t}_n(P, R)$ là primitive $n$-th root of unity:
>
> $$
> \hat{t}_n(P, R) = \zeta, \qquad \hat{t}_n(Q, R) = \hat{t}_n([k]P, R) = \zeta^k
> $$
>
> → Giải DLP $\zeta^k = \beta$ trong $\mathbb{F}_{q^\ell}^*$.

> [!note] Remark 11.7 — Frey–Rück vs MOV
> - **MOV**: dùng Weil pairing $e_n: E[n] \times E[n] \to \mu_n$. Cần tìm $R \in E[n](\mathbb{F}_{q^\ell})$ với $e_n(P,R) \neq 1$ — đôi khi khó hơn.
> - **Frey–Rück**: dùng Tate pairing — không cần $R \in E[n]$, chỉ cần $R \in E(\mathbb{F}_{q^\ell})$ generic. Hiệu quả hơn trong thực tế và áp dụng cho ordinary curves (không chỉ supersingular).
>
> Cả hai đều bị chặn bởi embedding degree lớn.

---

## Điều Kiện Phòng Thủ

> [!theorem] Theorem 11.8 — MOV Threshold
> **MOV threshold**: một đường cong $E/\mathbb{F}_q$ với subgroup bậc $n$ **an toàn trước MOV/FR attacks** khi và chỉ khi embedding degree $k$ thỏa mãn:
>
> $$
> k \cdot \log_2 q \geq L_\text{target}
> $$
>
> trong đó $L_\text{target}$ là mức bảo mật mục tiêu cho DLP trong $\mathbb{F}_{q^k}^*$ (ví dụ 3072 bits cho 128-bit security theo NIST 2023).

> [!example] Example 11.9 — Kiểm tra an toàn các curves thực tế
> | Curve | $\log_2 q$ | $k$ | $k \cdot \log_2 q$ | Safe? |
> |-------|-----------|-----|-------------------|-------|
> | Supersingular/$\mathbb{F}_p$, $p=256$ | 256 | 2 | 512 | ❌ WEAK |
> | MNT6, $p=256$ | 256 | 6 | 1536 | ❌ MARGINAL |
> | BN254 | 254 | 12 | 3048 | ⚠ ~110-bit |
> | BLS12-381 | 381 | 12 | 4572 | ✅ 128-bit |
> | NIST P-256 (non-pairing) | 256 | ~$2^{200}$ | $\gg$ | ✅ (no pairing) |

> [!note] Remark 11.10 — NIST curves và MOV
> NIST curves (P-256, P-384, P-521) có embedding degree $k \approx n/2 \approx 2^{128}$ — **cực kỳ lớn**. MOV attack hoàn toàn không thực tế. Nhưng đổi lại, pairings cũng **không thể tính** được (loop quá dài), nên NIST curves không dùng được trong pairing-based crypto.
>
> Đây là trade-off cơ bản: pairing-friendly ↔ MOV-resistant là hai yêu cầu đối lập, chỉ được balance tốt ở "goldilocks zone" $k \in [12, 50]$.

---

## Ordinary vs Supersingular — Tóm Tắt

> [!note] Remark 11.11 — So sánh từ góc độ tấn công
> | Property | Supersingular | Ordinary (random) | Ordinary (pairing-friendly) |
> |----------|--------------|-------------------|---------------------------|
> | Embedding degree $k$ | 1–6 | $\approx n$ (huge) | 12–50 (designed) |
> | MOV/FR attack | **Practical** | Infeasible | Infeasible (k*log q large) |
> | ECDLP security | ❌ LOW | ✅ HIGH | ✅ HIGH |
> | Pairing computation | Fast | Infeasible | Fast |
> | Use case | **Pairing-based crypto only** | ECDH/ECDSA | Both |

---

## SageMath Cheatsheet

```python
# MOV attack demonstration (pedagogical, small curve)
def mov_attack(E, P, Q, n, ell):
    """
    MOV: reduce ECDLP (P, Q=kP) to DLP in F_q^ell.
    Returns k such that k*P = Q.
    """
    Fext = GF(E.base_field().order()^ell, 'a')
    Eext = E.base_extend(Fext)
    P_ext = Eext(P)
    Q_ext = Eext(Q)

    # Find R in E[n](F_{q^ell}) such that e_n(P_ext, R) is primitive
    from random import randint
    cofactor = Eext.order() // n
    while True:
        R = cofactor * Eext.random_point()
        if R.order() == n:
            break

    alpha = P_ext.weil_pairing(R, n)
    beta  = Q_ext.weil_pairing(R, n)
    if alpha.multiplicative_order() != n:
        raise ValueError("e(P,R) not primitive")

    # DLP in mu_n: find k s.t. alpha^k = beta
    # (BSGS for small n)
    table = {alpha^i: i for i in range(n)}
    if beta in table:
        return table[beta]
    raise ValueError("DLP failed")

# Test on supersingular curve
E = EllipticCurve(GF(11), [1, 0])   # y^2 = x^3 + x, supersingular
P = E.random_point()
while P.order() != 4:
    P = E.random_point()
k_secret = 3
Q = k_secret * P
k_found = mov_attack(E, P, Q, 4, 2)  # ell=2 for supersingular
print(f"Secret k={k_secret}, found k={k_found}")

# Check embedding degree
def embedding_degree(E, n):
    q = E.base_field().order()
    k = 1
    while (q^k - 1) % n != 0:
        k += 1
    return k
```

---

## Anomalous Curves và BKSV Attack

> [!definition] Definition 11.12 — Anomalous Curve
> $E/\mathbb{F}_p$ gọi là **anomalous** (dị thường) nếu $\#E(\mathbb{F}_p) = p$, tức trace of Frobenius $t = 1$.

> [!theorem] Theorem 11.13 — BKSV Attack (Semaev–Smart–Satoh–Araki, 1998–1999)
> Với $E/\mathbb{F}_p$ anomalous ($\#E(\mathbb{F}_p) = p$), ECDLP giải được trong thời gian **tuyến tính** $O(\log^2 p)$ bằng kỹ thuật **p-adic lifting**.
>
> **Ý tưởng**: Lift $P, Q \in E(\mathbb{F}_p)$ lên $E(\mathbb{Z}/p^2\mathbb{Z})$ (nhóm điểm trên ring). Trong nhóm formal $\hat{E}(p\mathbb{Z}_p)$, logarithm:
>
> $$
> \ell_p(P) = -\frac{x([p]\tilde{P})}{y([p]\tilde{P})} \cdot p \in p\mathbb{Z}_p
> $$
>
> thỏa $\ell_p([a]P) = a \cdot \ell_p(P)$ (homomorphism!), nên:
>
> $$
> a \equiv \frac{\ell_p(Q)}{\ell_p(P)} \pmod{p}
> $$
>
> hoàn toàn tính được trong $O(\log^2 p)$.

> [!warning] Counterexample 11.14 — Anomalous = Hoàn Toàn Không An Toàn
> Đường cong $E/\mathbb{F}_{127}$ với $\#E = 127$ (anomalous): ECDLP trên đây giải được trong **microseconds** bằng BKSV. Đây không phải "weakened security" — đây là bài toán **solved**.
>
> Kiểm tra bắt buộc: khi chọn curve, luôn verify $\#E(\mathbb{F}_p) \neq p$.

> [!note] Remark 11.15 — Checklist An Toàn Đầy Đủ
> Một curve $E/\mathbb{F}_p$ an toàn cho ECDLP:
>
> 1. **Không anomalous**: $\#E(\mathbb{F}_p) \neq p$. (tránh BKSV)
> 2. **Không supersingular**: $t \neq 0$ mod $p$. (tránh MOV k≤6)
> 3. **MOV-safe**: embedding degree $k \gg \log_2 r$ (thực tế $k > 10^6$). (tránh MOV/FR)
> 4. **Order $r$ prime lớn**: $r \geq 2^{256}$. (tránh Pohlig-Hellman)
> 5. **CM discriminant $|D|$ lớn**: không có hiệu ứng CM đặc biệt.

---

## Summary / Key Takeaways

- **MOV attack** (1993): $e_n(P,R) = \zeta$, $e_n(Q,R) = \zeta^k$ → giải DLP trong $\mathbb{F}_{q^k}^*$ thay vì ECDLP.
- **Frey–Rück** (1994): cùng ý tưởng với Tate pairing — hiệu quả hơn, áp dụng rộng hơn.
- Reduction: ECDLP ($O(\sqrt{n})$ Pollard) → DLP trong $\mathbb{F}_{q^k}^*$ (NFS sub-exponential).
- **Supersingular** luôn có $k \leq 6$ → **không an toàn** cho ECDLP.
- **MOV threshold**: cần $k \cdot \log_2 q \geq 3072$ bits cho 128-bit security.
- BN254: $12 \times 254 = 3048$ bits → ~110-bit security sau Kim–Barbulescu 2016.
- BLS12-381: $12 \times 381 = 4572$ bits → robust 128-bit security.
- NIST curves: $k \approx 2^{128}$ → MOV infeasible nhưng cũng không dùng pairing.
- Trade-off cơ bản: pairing-friendly ↔ MOV-resistant balance ở $k \in [12, 50]$.

---

## References

- A. Menezes, T. Okamoto, S. Vanstone, "Reducing elliptic curve logarithms to logarithms in a finite field," IEEE Trans. Inf. Theory 39 (1993) — MOV paper gốc.
- G. Frey, H.-G. Rück, "A remark concerning $m$-divisibility and the discrete logarithm in the divisor class group of curves," Math. Comp. 62 (1994) — FR attack gốc.
- Washington, *Elliptic Curves*, §11.5 (MOV attack, FR attack, embedding degree).
- Galbraith, MoPKC, §26.5 (MOV/FR, supersingular, security analysis).
- T. Kim, R. Barbulescu, "Extended tower number field sieve," CRYPTO 2016 — explains BN254 weakness.
- Sutherland, MIT 18.783 Lecture Notes 2022, Lectures 24–25 (MOV, security).
- Semaev (1998); Smart (1999); Satoh & Araki (1998) — BKSV attack trên anomalous curves.