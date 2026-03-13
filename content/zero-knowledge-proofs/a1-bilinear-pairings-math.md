---
title: "A1. Bilinear Pairings — Nền tảng Toán Học"
tags: [cryptography, zero-knowledge-proofs, zkp, pairings, elliptic-curves, appendix]
aliases: [Bilinear Pairings Math]
created: 2026-03-13
---

> **Tham chiếu từ**: [[13-kzg-and-pairings|13. KZG & Pairing-Based Polynomial Commitments]]
> **Mục đích**: Trình bày nền tảng toán học của bilinear pairings — từ elliptic curves đến Weil/Tate pairing — cho người muốn hiểu sâu hơn phần "tại sao" pairing tồn tại.

---

## Nền Tảng: Elliptic Curves

### Đường Cong Elliptic

> [!definition] Definition A1.1 — Elliptic Curve
>
> Một **elliptic curve** $E$ trên trường $\mathbb{F}_p$ (với $p > 3$ nguyên tố) là tập nghiệm của phương trình Weierstrass:
>
> $$E: y^2 = x^3 + ax + b \quad (a, b \in \mathbb{F}_p, \; 4a^3 + 27b^2 \neq 0)$$
>
> cùng với "điểm vô cực" $\mathcal{O}$ (identity element).
>
> Tập hợp điểm $E(\mathbb{F}_p) = \{(x, y) \in \mathbb{F}_p^2 : y^2 = x^3 + ax + b\} \cup \{\mathcal{O}\}$ tạo thành **nhóm cộng abelian** với phép cộng điểm (point addition).

### Torsion Points

> [!definition] Definition A1.2 — $\ell$-Torsion Subgroup
>
> Với số nguyên $\ell \geq 1$, **$\ell$-torsion subgroup** của $E$ là:
>
> $$E[\ell] = \{P \in E(\overline{\mathbb{F}_p}) : \ell P = \mathcal{O}\}$$
>
> trong đó $\overline{\mathbb{F}_p}$ là đóng đại số của $\mathbb{F}_p$.
>
> Nếu $\ell \nmid p$: $E[\ell] \cong \mathbb{Z}/\ell\mathbb{Z} \times \mathbb{Z}/\ell\mathbb{Z}$ — nhóm rank 2.
>
> Pairing-based crypto dùng $E[\ell]$ với $\ell$ là số nguyên tố lớn (~254-bit).

### Twisted Curves và $\mathbb{G}_2$

Trong pairing curves (BN254, BLS12-381), $\mathbb{G}_2$ thường là subgroup của đường cong xoắn (twist) của $E$ trên extension field $\mathbb{F}_{p^k}$ (với $k$ là embedding degree):

$$\mathbb{G}_1 = E(\mathbb{F}_p)[\ell], \quad \mathbb{G}_2 = E'(\mathbb{F}_{p^k})[\ell]$$

---

## Weil Pairing

> [!definition] Definition A1.3 — Weil Pairing
>
> Cho $\ell \geq 1$ với $\ell \nmid p$. **Weil pairing** là ánh xạ:
>
> $$e_\ell: E[\ell] \times E[\ell] \to \mu_\ell \subset \overline{\mathbb{F}_p}^*$$
>
> trong đó $\mu_\ell = \{z \in \overline{\mathbb{F}_p} : z^\ell = 1\}$ là nhóm căn đơn vị bậc $\ell$.
>
> **Tính chất**:
> 1. **Bilinearity**: $e_\ell(P + P', Q) = e_\ell(P, Q) \cdot e_\ell(P', Q)$ và tương tự cho $Q$.
> 2. **Alternating**: $e_\ell(P, P) = 1$ với mọi $P$.
> 3. **Non-degeneracy**: nếu $P$ không phải identity, tồn tại $Q$ với $e_\ell(P, Q) \neq 1$.
> 4. **Galois equivariance**: compatible với Galois action của $\text{Gal}(\overline{\mathbb{F}_p}/\mathbb{F}_p)$.

> [!note] Remark — Alternating → Anti-symmetric
>
> Từ bilinearity và alternating: $e_\ell(P, Q) \cdot e_\ell(Q, P) = e_\ell(P+Q, P+Q) = 1$, suy ra $e_\ell(P, Q) = e_\ell(Q, P)^{-1}$.
>
> Weil pairing có $e_\ell(P, Q) = e_\ell(Q, P)^{-1}$ — **anti-symmetric**.
>
> Nhưng trong pairing-based crypto, ta muốn $e(P, Q) = e(Q, P)$ — phải dùng modified Weil pairing hoặc Tate pairing.

### Xây Dựng Weil Pairing

Weil pairing được định nghĩa qua **Miller function** $f_{m,P}$: hàm meromorphic trên $E$ với divisor $m[P] - m[\mathcal{O}]$.

$$e_\ell(P, Q) = \frac{f_{\ell, P}(Q + S)}{f_{\ell, P}(S)} \cdot \left(\frac{f_{\ell, Q}(P - S')}{f_{\ell, Q}(-S')}\right)^{-1}$$

trong đó $S, S'$ là các điểm phụ (auxiliary points) để tránh singularity.

**Miller's Algorithm**: tính $f_{\ell, P}(Q)$ hiệu quả trong $O(\log \ell)$ phép toán trên đường cong.

---

## Tate Pairing

Tate pairing dễ tính hơn Weil pairing và được dùng nhiều hơn trong practice.

> [!definition] Definition A1.4 — Reduced Tate Pairing
>
> Cho $P \in E[\ell](\mathbb{F}_p)$ và $Q \in E(\mathbb{F}_{p^k})$ (không cần $\ell P' = \mathcal{O}$). **Reduced Tate pairing**:
>
> $$\tau_\ell(P, Q) = f_{\ell, P}(Q)^{(p^k - 1)/\ell} \in \mathbb{F}_{p^k}^*$$
>
> trong đó $f_{\ell, P}$ là Miller function, và lũy thừa $(p^k-1)/\ell$ là "final exponentiation" để map về $\mu_\ell$.
>
> **Tính chất**: bilinear, non-degenerate (với chọn $k$ phù hợp).

### Embedding Degree

> [!definition] Definition A1.5 — Embedding Degree
>
> **Embedding degree** $k$ của $E$ với respect to $\ell$ là số nguyên nhỏ nhất $k \geq 1$ sao cho:
>
> $$\ell \mid (p^k - 1)$$
>
> Tức là $\mu_\ell \subset \mathbb{F}_{p^k}^*$ — group của căn đơn vị nằm trong extension field bậc $k$.

Embedding degree ảnh hưởng:
- **Nhỏ** ($k = 1, 2$): target group $\mathbb{G}_T = \mu_\ell \subset \mathbb{F}_{p^k}^*$ nhỏ → MOV attack (discrete log dễ hơn trong $\mathbb{F}_{p^k}^*$).
- **Phù hợp** ($k = 12$ cho BN254, BLS12-381): cân bằng giữa security và efficiency.
- **Lớn** ($k$ rất lớn): pairing khó tính — không dùng được.

---

## Pairing-Friendly Curves

Không phải mọi elliptic curve đều có pairing thực dụng. **Pairing-friendly curves** được xây dựng đặc biệt.

### BN254 (Barreto-Naehrig)

$$k = 12, \quad p \approx 2^{254}, \quad \text{security} \approx 100\text{-bit} \text{ (after NFS attacks)}$$

- $E: y^2 = x^3 + b$ trên $\mathbb{F}_p$
- $\mathbb{G}_1 = E(\mathbb{F}_p)[\ell]$ ($\ell$ là bậc subgroup lớn)
- $\mathbb{G}_2 = E'(\mathbb{F}_{p^2})[\ell]$ (twist bậc 2)
- $\mathbb{G}_T = \mu_\ell \subset \mathbb{F}_{p^{12}}^*$

Dùng trong: Groth16 (Zcash, Ethereum precompile), PLONK (nhiều circuits).

### BLS12-381 (Barreto-Lynn-Scott)

$$k = 12, \quad p \approx 2^{381}, \quad \text{security} \approx 128\text{-bit}$$

- $\mathbb{G}_1 = E(\mathbb{F}_p)[\ell]$
- $\mathbb{G}_2 = E'(\mathbb{F}_{p^2})[\ell]$ (twist bậc 6)
- $\mathbb{G}_T = \mu_\ell \subset \mathbb{F}_{p^{12}}^*$

Dùng trong: Ethereum 2.0 BLS signatures, Zcash Sapling, nhiều SNARK hiện đại.

### Phép Toán Cụ Thể

| Phép toán | BN254 | BLS12-381 |
|-----------|-------|-----------|
| $\mathbb{G}_1$ point size | 64 bytes (compressed 32) | 96 bytes (compressed 48) |
| $\mathbb{G}_2$ point size | 128 bytes (compressed 64) | 192 bytes (compressed 96) |
| $\mathbb{G}_T$ element size | 384 bytes | 576 bytes |
| Pairing time (Miller loop) | ~1ms | ~2ms |

---

## Hardness Assumptions

### DDH trong $\mathbb{G}_1$

**DDH (Decisional Diffie-Hellman)** trong $\mathbb{G}_1$: phân biệt $(g, g^a, g^b, g^{ab})$ và $(g, g^a, g^b, g^c)$ với $c$ random.

**Quan trọng**: DDH **KHÔNG** hard trong pairing groups — pairing cho phép kiểm tra $e(g^a, g^b) = e(g, g)^{ab}$ vs. $e(g, g^c)$.

Do đó cần giả định mạnh hơn:

### $q$-SDH Assumption (dùng trong KZG)

> [!definition] Definition A1.6 — $q$-Strong Diffie-Hellman
>
> Cho $g_1, g_2$ là generators. **$q$-SDH assumption**: với SRS $(g_1, g_1^\tau, \ldots, g_1^{\tau^q}, g_2, g_2^\tau)$, không PPT adversary nào tính được $(c, g_1^{1/(\tau+c)})$ cho bất kỳ $c \in \mathbb{F}_p^*$ (với $\tau + c \neq 0$).

Assumption này không bị phá bởi pairing vì cần tính $1/(\tau+c)$ mà không biết $\tau$.

### BSDH và Tương Quan

| Assumption | Mô tả | Dùng trong |
|------------|-------|------------|
| $q$-SDH | Không tính $g^{1/(\tau+c)}$ | KZG binding |
| $q$-PKE (Power Knowledge of Exponent) | Prover biết hệ số trong mọi commitment | Knowledge soundness |
| $q$-DLOG | Không tính discrete log từ $q$ powers | Các scheme khác |

$q$-PKE là **falsifiable** trong bounded sense nhưng không standard — Groth16 security dựa vào cả hai.

---

## Ate Pairing — Efficient Computation

Tate pairing cần final exponentiation lớn. **Ate pairing** (Hess et al. 2006) hiệu quả hơn:

$$a_T(Q, P) = f_{T, Q}(P)^{(p^k-1)/\ell}$$

trong đó $T = t - 1$ ($t$ là trace of Frobenius của $E$), và Miller loop chạy với $\log T$ bước — ngắn hơn $\log \ell$.

**Optimal Ate pairing**: cải thiện thêm, dùng trong nhiều library hiện đại (blst, arkworks).

---

## Tóm Tắt Cho KZG

KZG dùng:
- $\mathbb{G}_1 = E(\mathbb{F}_p)[\ell]$: commit polynomial $f$ bằng $[f(\tau)]_1$
- $\mathbb{G}_2 = E'(\mathbb{F}_{p^2})[\ell]$: SRS element $[\tau]_2$ để verify
- $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$: Ate pairing

Verify equation:
$$e(\mathsf{cm} - [v]_1, [1]_2) = e(\pi, [\tau]_2 - [z]_2)$$

Đây là bilinearity: $e([f(\tau)-v]_1, [1]_2) = e([q(\tau)]_1, [\tau-z]_2)$ vì $f(\tau) - v = q(\tau)(\tau-z)$ (Factor Theorem).

---

## References

- Silverman — *The Arithmetic of Elliptic Curves*, Springer (nền tảng toán học)
- Miller — *Short programs for functions on curves* (1986) — Miller's Algorithm gốc
- Barreto, Naehrig — *Pairing-Friendly Elliptic Curves of Prime Order* (2005)
- Hess, Smart, Vercauteren — *The Eta Pairing Revisited* (2006) — IEEE Trans. (Ate pairing)
- Boneh, Franklin — *Identity-Based Encryption from the Weil Pairing* (2001) — CRYPTO (ứng dụng đầu tiên của pairing trong crypto hiện đại)
- Boneh, Shoup — *A Graduate Course in Applied Cryptography*, Ch. 15 (toc.cryptobook.us)
- ZCash — *BLS12-381 For The Rest Of Us* (hackmd.io/@benjaminion/bls12-381)
