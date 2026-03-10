---
title: 10. Pairing-Friendly Curves
tags: [math, pairing, elliptic-curves, lesson-10]
aliases: [Pairing-Friendly Curves, BN254, BLS12-381]
created: 2026-03-09
---

# 10. Pairing-Friendly Curves: BN254, BLS12-381, và Các Gia Đình Khác

> **Prerequisites**: [[09-ate-pairing-optimal-ate|Ate Pairing & Optimal Ate]], [[01-ecc-finite-field-review|ECC & Finite Field Review]], [[02-extension-fields-tower-extensions|Extension Fields & Tower Extensions]]
> **Objectives**:
> - Hiểu điều kiện "pairing-friendly": embedding degree $k$, rho-value $\rho$, và cân bằng bảo mật
> - Nắm cấu trúc tham số BN254 và BLS12-381 — hai curves quan trọng nhất hiện tại
> - Biết tower field arithmetic $\mathbb{F}_{p^{12}}$ và sextic twist tối ưu hóa $\mathbb{G}_2$

---

## Motivation / Intuition

Không phải đường cong elliptic nào cũng dùng được cho pairing-based cryptography. Một đường cong ngẫu nhiên $E/\mathbb{F}_p$ hầu như chắc chắn có embedding degree $k \approx p/\log_2 p$ — quá lớn để tính toán $\mathbb{F}_{p^k}$ arithmetic trong thực tế.

**Pairing-friendly curves** là kết quả của "bộ ba điều kiện" cân bằng tinh tế:

1. $r$ lớn (DLP trên $\mathbb{G}_1$, $\mathbb{G}_2$ khó — cần $r > 2^{128}$).
2. $k$ nhỏ và cụ thể — $k=12$ cho 128-bit security với $p \approx 2^{256}$.
3. $p$ không quá lớn hơn $r$ (tức $\rho = \log p/\log r \approx 1$).

Việc tìm curves thỏa mãn đồng thời ba điều này cần kỹ thuật **Complex Multiplication** (CM) hoặc construction đại số tinh vi.

---

## Định Nghĩa Pairing-Friendly

### Definition

> [!definition] Definition 10.1 — Pairing-Friendly Curve
> Đường cong $E/\mathbb{F}_p$ gọi là **pairing-friendly** (đường cong thân thiện pairing) nếu:
>
> 1. Tồn tại prime $r > \sqrt{p}$ sao cho $r \mid \#E(\mathbb{F}_p)$.
> 2. **Embedding degree** $k = \min\{j \geq 1 : r \mid p^j-1\}$ đủ nhỏ cho ứng dụng thực tế (thường $k \leq 50$).

> [!definition] Definition 10.2 — $\rho$-value
> **$\rho$-value** đo "lãng phí bit" của prime field so với group order:
>
> $$
> \rho = \frac{\log_2 p}{\log_2 r}
> $$
>
> - $\rho = 1$: lý tưởng ($p \approx r$, không lãng phí bit).
> - $\rho = 2$: $p \approx r^2$ — mỗi field element cần gấp đôi bits so với group element.
>
> BN curves: $\rho = 1$. BLS12: $\rho \approx 1.5$.

> [!note] Remark 10.3 — Cân Bằng Bảo Mật
> Tại 128-bit security level, cần hai điều kiện song song:
>
> - DLP trên EC ($\mathbb{G}_1$, $\mathbb{G}_2$): $r \geq 2^{256}$ để ECDLP $\approx 2^{128}$.
> - DLP trong $\mathbb{F}_{p^k}^*$: cần $p^k \geq 2^{3072}$ (NFS subexponential). Với $k=12$, $p \geq 2^{256}$ thỏa mãn ($12 \times 256 = 3072$).
>
> Sau Kim–Barbulescu (2016), NFS mạnh hơn → cần tăng $p^k$. BN254 ($p \approx 2^{254}$, $p^{12} \approx 2^{3048}$) chỉ đạt ~100-bit; BLS12-381 ($p \approx 2^{381}$, $p^{12} \approx 2^{4572}$) đạt ~128-bit.

---

## BN Curves (Barreto–Naehrig)

### Definition

> [!definition] Definition 10.4 — Gia Đình BN Curves
> **BN curves** (Barreto–Naehrig 2005) là gia đình $E: y^2 = x^3+b$ trên $\mathbb{F}_p$, $k=12$, parameterized bởi $x \in \mathbb{Z}$:
>
> $$
> p(x) = 36x^4 + 36x^3 + 24x^2 + 6x + 1
> $$
>
> $$
> r(x) = 36x^4 + 36x^3 + 18x^2 + 6x + 1
> $$
>
> $$
> t(x) = 6x^2 + 1 \quad (\text{trace of Frobenius})
> $$
>
> Khi $p(x)$ và $r(x)$ đều prime: $\#E(\mathbb{F}_p)=r$, $\rho=1$, $k=12$.

> [!example] Example 10.5 — BN $x=1$ (toy example)
> $x=1$: $p=103$, $r=97$, $t=7$.
>
> Kiểm tra: $p+1-t=97=r$ ✓; $\rho = \log 103/\log 97 \approx 1.003$ ✓.
>
> Kiểm tra $k=12$: $\Phi_{12}(p) = p^4-p^2+1 \equiv 0 \pmod{r}$ ✓.
>
> Loop parameter Optimal Ate: $6x+2=8$, $\lfloor\log_2 8\rfloor = 3$ iterations (vs 7 cho Tate).

> [!note] Remark 10.6 — BN254
> **BN254** (alt\_bn128): $x = 4965661367192848881$:
>
> - $p \approx 2^{254}$, $r \approx 2^{254}$, $k=12$, $\rho=1$.
> - Bảo mật ~100-bit (sau Kim–Barbulescu 2016).
> - Ứng dụng: **Ethereum** precompiles (EIP-196, EIP-197), **Groth16 zk-SNARKs**, **Zcash Sprout**.
>
> Curve equation: $E: y^2 = x^3 + 3$ trên $\mathbb{F}_p$ (CM discriminant $D=-3$, j-invariant $0$).

---

## BLS12 Curves (Barreto–Lynn–Scott)

### Definition

> [!definition] Definition 10.7 — Gia Đình BLS12 Curves
> **BLS12 curves** ($k=12$, parameterized bởi $x \in \mathbb{Z}$):
>
> $$
> r(x) = x^4 - x^2 + 1 = \Phi_{12}(x)
> $$
>
> $$
> p(x) = \frac{(x-1)^2(x^4-x^2+1)}{3} + x
> $$
>
> $$
> t(x) = x + 1
> $$
>
> $r(x) = \Phi_{12}(x)$ là cyclotomic polynomial bậc 12 — kết cấu này đảm bảo $k=12$ trực tiếp từ định nghĩa.

> [!example] Example 10.8 — BLS12 $x=4$
> $x=4$: $p=727$, $r=241$, $t=5$.
>
> $\Phi_{12}(727) = 727^4-727^2+1 \equiv 0 \pmod{241}$ → $k=12$ ✓.
>
> $\rho = \log 727/\log 241 \approx 1.20$.
>
> Loop Optimal Ate: $x=4$, $\lfloor\log_2 4\rfloor = 2$ iterations — cực ngắn!

> [!note] Remark 10.9 — BLS12-381
> **BLS12-381**: $x = -(2^{63}+2^{62}+2^{60}+2^{57}+2^{48}+2^{16})$, Hamming weight $= 6$:
>
> - $p \approx 2^{381}$, $r \approx 2^{255}$, $k=12$, $\rho \approx 1.5$.
> - Bảo mật ~128-bit.
> - Loop Optimal Ate: $|x| \approx 2^{63}$, 63 bits, chỉ 6 additions (low Hamming weight).
> - Ứng dụng: **Ethereum 2.0** (BLS signatures), **Zcash Sapling/Orchard**, **Filecoin**, **EIP-2537**.

---

## Tower Field $\mathbb{F}_{p^{12}}$

> [!definition] Definition 10.10 — Tower Field cho BN254
> BN254 dùng tower:
>
> $$
> \mathbb{F}_{p^2} = \mathbb{F}_p[u]/(u^2+1)
> $$
>
> $$
> \mathbb{F}_{p^6} = \mathbb{F}_{p^2}[v]/(v^3 - (u+9))
> $$
>
> $$
> \mathbb{F}_{p^{12}} = \mathbb{F}_{p^6}[w]/(w^2 - v)
> $$
>
> Mọi element $a \in \mathbb{F}_{p^{12}}$ viết: $a = \sum_{i=0}^{5} c_i w^i$ với $c_i \in \mathbb{F}_{p^2}$.

> [!note] Remark 10.11 — Tại Sao Tower?
> Arithmetic trực tiếp trong $\mathbb{F}_{p^{12}}$ đòi hỏi $12\times 12 = 144$ phép nhân $\mathbb{F}_p$ cho một multiplication. Tower decomposition giảm xuống $54$ (Karatsuba trên $\mathbb{F}_{p^6}$, etc.) — tiết kiệm ~$63\%$.
>
> **Frobenius trên tower**: $a^p$ tính bằng cách nhân mỗi coefficient với **Frobenius constant** precomputed — không cần full exponentiation.
>
> **Cyclotomic squaring**: elements trong $\mathbb{G}_T \subset \mathbb{F}_{p^{12}}^*$ có thể được bình phương với $18$ phép nhân $\mathbb{F}_p$ thay vì $54$ — quan trọng cho final exponentiation.

---

## Sextic Twist

> [!definition] Definition 10.12 — Sextic Twist và $\mathbb{G}_2$
> Với $E: y^2 = x^3+b$ trên $\mathbb{F}_p$ có $k=12$ và $d=6$:
>
> **Twist** $E': y^2 = x^3 + b'$ định nghĩa trên $\mathbb{F}_{p^2}$, với $b' = b/\xi$ ($\xi$ generator của $\mathbb{F}_{p^{12}}/\mathbb{F}_{p^2}$).
>
> **Twist isomorphism** $\phi: E'(\mathbb{F}_{p^2}) \to E(\mathbb{F}_{p^{12}})$:
>
> $$
> \phi(x', y') = (x' \cdot w^2, \; y' \cdot w^3), \quad w^6 = \xi
> $$
>
> **Hệ quả**: $\mathbb{G}_2 \cong E'(\mathbb{F}_{p^2})[r]$ — thao tác trên $\mathbb{G}_2$ thực hiện trong $\mathbb{F}_{p^2}$!

> [!example] Example 10.13 — Tiết Kiệm từ Sextic Twist
> Không dùng twist: double một điểm $Q \in \mathbb{G}_2 \subset E(\mathbb{F}_{p^{12}})$ cần arithmetic trên $\mathbb{F}_{p^{12}}$.
>
> Dùng twist: double $Q' \in E'(\mathbb{F}_{p^2})$ cần arithmetic trên $\mathbb{F}_{p^2}$ — nhanh hơn $k/2 = 6\times$ về field size, và còn tận dụng sparse representation của line functions.

---

## So Sánh BN254 và BLS12-381

| | BN254 | BLS12-381 |
|---|---|---|
| $\vert p \vert$ | 254 bits | 381 bits |
| $\vert r \vert$ | 254 bits | 255 bits |
| $k$ | 12 | 12 |
| $\rho$ | 1.00 | ~1.50 |
| Security (bits) | ~100 (post-2016) | ~128 |
| Cofactor $h_1$ | 1 | 1 |
| Cofactor $h_2$ | 1 | ~305-bit |
| Loop length (Opt. Ate) | $\approx 65$ bits | $\approx 63$ bits |
| Hamming weight loop | low | 6 (rất thấp) |
| Ứng dụng chính | Ethereum, Zcash Sprout | Eth2, BLS sigs |

---

## SageMath Cheatsheet

```python
# BN curve nhỏ x=1
p_bn = 103
for b in range(1, p_bn):
    E = EllipticCurve(GF(p_bn), [0, b])
    if E.order() == 97:
        print(f"BN x=1: b={b}")
        break

# Embedding degree
def emb_deg(p, r, max_k=20):
    for k in range(1, max_k+1):
        if (p^k - 1) % r == 0: return k
    return None

print(emb_deg(103, 97))   # 12
print(emb_deg(727, 241))  # 12

# Tower field construction
p = 103
R.<x> = PolynomialRing(GF(p))
Fp2.<u> = GF(p^2, modulus=x^2+1)
R2.<y> = PolynomialRing(Fp2)
Fp6.<v> = Fp2.extension(y^3 - (u+9))
R6.<z> = PolynomialRing(Fp6)
Fp12.<w> = Fp6.extension(z^2 - v)
print(f"F_{p}^12 degree = {Fp12.degree()}")   # 12

# Frobenius constant
a = Fp12.random_element()
frob = a.frobenius()         # a^p
print(a^p == frob)           # True

# rho-value
import math
p1, r1 = 103, 97
rho_bn = math.log(p1)/math.log(r1)
p2, r2 = 727, 241
rho_bls = math.log(p2)/math.log(r2)
print(f"rho BN x=1: {rho_bn:.3f}")     # ~1.003
print(f"rho BLS12 x=4: {rho_bls:.3f}") # ~1.20
```

**SageMath docs**: [Extension fields](https://doc.sagemath.org/html/en/reference/finite_rings/sage/rings/finite_rings/finite_field_constructor.html)

---

## Summary / Key Takeaways

- **Pairing-friendly** = $r \mid \#E(\mathbb{F}_p)$ với $r > \sqrt{p}$ và $k$ nhỏ.
- **$\rho = \log p/\log r$**: lý tưởng $= 1$ (BN), chấp nhận được $\leq 2$ (BLS12 $\approx 1.5$).
- **BN curves** ($k=12$, $\rho=1$): $p,r,t$ là polynomials trong $x$; BN254 phổ biến nhưng ~100-bit security.
- **BLS12 curves** ($k=12$, $\rho \approx 1.5$): $r = \Phi_{12}(x)$; BLS12-381 đạt 128-bit, dùng trong Eth2.
- **Tower field** $\mathbb{F}_p \to \mathbb{F}_{p^2} \to \mathbb{F}_{p^6} \to \mathbb{F}_{p^{12}}$: giảm số phép nhân, tận dụng Frobenius.
- **Sextic twist**: $\mathbb{G}_2$ tính trên $E'(\mathbb{F}_{p^2})$ thay vì $E(\mathbb{F}_{p^{12}})$ — tiết kiệm $6\times$.
- **BLS12-381 Hamming weight 6**: loop Optimal Ate chỉ cần 6 additions — thiết kế cực kỳ efficient.

---

## References

- Barreto & Naehrig (2005), "Pairing-Friendly Elliptic Curves of Prime Order".
- Barreto, Lynn, Scott (2002), "Constructing Elliptic Curves with Prescribed Embedding Degrees".
- Freeman, Scott, Teske (2010), "A Taxonomy of Pairing-Friendly Elliptic Curves" — survey đầy đủ nhất.
- Kim & Barbulescu (2016), "Extended Tower Number Field Sieve" — NFS attack BN254.
- Galbraith, MoPKC, §26.4 (tower arithmetic, twist), §26.5 (BN curves), Appendix (BLS12-381).
- Wahby & Boneh (2019), "Fast and Simple Constant-Time Hashing to the BLS12-381 Elliptic Curve".