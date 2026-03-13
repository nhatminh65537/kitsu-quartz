---
title: "A2. Math Reference"
tags: [crypto, math, bn254, grumpkin, pairing, reference, appendix]
aliases: [Math Reference]
created: 2026-03-13
---

> Công thức toán học tra cứu nhanh cho PLONK/Honk. Xem giải thích: [[01-polynomial-iop-kzg|01]], [[02-plonk-arithmetization|02]], [[09-multilinear-sumcheck|09]].

---

## Finite Fields

**Field $\mathbb{F}_p$ (prime field):** tập $\{0, 1, \ldots, p-1\}$ với cộng và nhân modulo $p$.

**Phần tử ngịch đảo:** $a^{-1} \equiv a^{p-2} \pmod{p}$ (Fermat's little theorem).

**Căn bậc hai:** tồn tại $\sqrt{a}$ khi $a^{(p-1)/2} \equiv 1$. Tính: $a^{(p+1)/4}$ nếu $p \equiv 3 \pmod{4}$.

**Multiplicative group:** $\mathbb{F}_p^* = \mathbb{F}_p \setminus \{0\}$ có order $p-1$, cyclic.

**Primitive root (generator):** $g \in \mathbb{F}_p^*$ sao cho $\text{ord}(g) = p-1$.

**Root of unity bậc $n$:** $\omega$ thỏa $\omega^n = 1$, $\omega^k \neq 1$ với $0 < k < n$. Tồn tại khi $n \mid p-1$.

---

## Group Operations (Elliptic Curve)

**Curve BN254 (aka alt-bn128):**

$$E: y^2 = x^3 + 3 \quad \text{over } \mathbb{F}_q$$

$$q = 21888242871839275222246405745257275088696311157297823662689037894645226208583$$

$$r = 21888242871839275222246405745257275088548364400416034343698204186575808495617$$

($r$ = order của $\mathbb{G}_1$, cũng là scalar field của KZG)

**Generator $G_1$:**

$$G_1 = (1,\ 2)$$

**Twist $\mathbb{G}_2$:** defined over $\mathbb{F}_{q^2}$ — dùng trong pairing.

**Point addition** (affine, $P \neq Q$):

$$\lambda = \frac{y_Q - y_P}{x_Q - x_P}, \quad x_R = \lambda^2 - x_P - x_Q, \quad y_R = \lambda(x_P - x_R) - y_P$$

**Point doubling** ($P = Q$):

$$\lambda = \frac{3x_P^2}{2y_P}, \quad x_R = \lambda^2 - 2x_P, \quad y_R = \lambda(x_P - x_R) - y_P$$

**Scalar multiplication:** $[k]P$ — dùng double-and-add.

---

## Pairing (BN254)

**Tate pairing / Ate pairing:**

$$e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$$

Bilinear: $e([a]G_1,\ [b]G_2) = e(G_1, G_2)^{ab}$

**KZG verify equation:**

$$e\!\left([f]_1 - y \cdot G_1,\ G_2\right) = e\!\left([q]_1,\ [\tau]_2 - z \cdot G_2\right)$$

Tương đương:

$$e\!\left([f]_1 - y \cdot G_1,\ G_2\right) \cdot e\!\left([q]_1,\ z \cdot G_2 - [\tau]_2\right) = 1_{\mathbb{G}_T}$$

---

## Grumpkin Curve

Dùng trong Barretenberg/UltraHonk cho **recursive proofs** và một số lookups.

$$E': y^2 = x^3 - 17 \quad \text{over } \mathbb{F}_r$$

(base field của Grumpkin = scalar field $r$ của BN254 — hai curve tạo thành cycle)

$$r' = q \quad \text{(scalar field của Grumpkin = base field của BN254)}$$

Tính chất: BN254 và Grumpkin tạo thành **2-cycle** — cho phép recursive SNARK hiệu quả.

---

## Polynomial Arithmetic

**Horner evaluation** tại $z$ (degree $d$):

$$f(z) = f_d z^{d} + \ldots = (\ldots((f_d \cdot z + f_{d-1}) \cdot z + f_{d-2}) \cdot z \ldots + f_0)$$

$O(d)$ mults thay vì $O(d)$ mults + $O(d)$ pows.

**Fast Multiplication** (NTT-based): $O(n \log n)$ thay vì $O(n^2)$.

**Lagrange Interpolation** qua $n$ điểm:

$$f(X) = \sum_{i=0}^{n-1} y_i \cdot L_i(X), \quad L_i(X) = \prod_{j \neq i} \frac{X - x_j}{x_i - x_j}$$

Trên subgroup $H = \{\omega^i\}$, tính hiệu quả bằng IFFT.

**Coset NTT:** Evaluate $f$ trên $g \cdot H = \{g, g\omega, \ldots, g\omega^{n-1}\}$ — dùng trong PLONK để tính $t = [\text{relation}(X)] / Z_H(X)$ trên coset (tránh chia cho 0).

---

## Schwartz-Zippel Lemma

> Cho $f: \mathbb{F}^k \to \mathbb{F}$ là polynomial không đồng nhất bằng 0, degree tổng $\leq d$. Với $r_1, \ldots, r_k \stackrel{\$}{\leftarrow} \mathbb{F}$:
>
> $$\Pr[f(r_1, \ldots, r_k) = 0] \leq \frac{d}{|\mathbb{F}|}$$

Dùng để: (1) check polynomial identity bằng random evaluation, (2) bound soundness error của sumcheck ($d/p$ mỗi round).

---

## Số Mũ Quan Trọng

| Expression | Value (BN254) | Ý nghĩa |
|------------|--------------|---------|
| $p$ (base) | $q \approx 2^{254}$ | Base field của BN254 |
| $r$ (scalar) | $\approx 2^{254}$ | Scalar field, order $\mathbb{G}_1$ |
| $p-1$ | $r - 1$ | Exponent cho inverse |
| $(p-1)/2$ | Legendre symbol exponent | Check square root existence |
| $(p+1)/4$ | Square root exponent (nếu $p \equiv 3 \pmod 4$) | BN254: không áp dụng trực tiếp |
| $\omega = r^{(p-1)/n}$ | primitive $n$-th root of unity | NTT domain |

---

## Bit Decomposition và Range

**$k$-bit range check:** $x < 2^k$ iff có tồn tại bits $b_0, \ldots, b_{k-1} \in \{0,1\}$ sao cho:

$$x = \sum_{i=0}^{k-1} b_i \cdot 2^i$$

kèm $b_i(b_i - 1) = 0$ với mỗi $i$.

Trong UltraPlonk: range gate kết hợp với lookup table $\{0,1,\ldots,2^k-1\}$ — $O(1)$ gates thay vì $O(k)$.

---

## Tóm tắt Ký hiệu Dùng Trong Cả Khoá Học

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{F}_p$ | Finite field modulo prime $p$ |
| $\mathbb{G}_1, \mathbb{G}_2$ | Subgroups của BN254 elliptic curve |
| $\mathbb{G}_T$ | Target group của pairing |
| $[x]_1$ | $x \cdot G_1$ — scalar mult trên $\mathbb{G}_1$ |
| $[x]_2$ | $x \cdot G_2$ — scalar mult trên $\mathbb{G}_2$ |
| $e(\cdot, \cdot)$ | Bilinear pairing $\mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ |
| $\omega$ | Primitive $n$-th root of unity trong $\mathbb{F}_r$ |
| $H$ | Multiplicative subgroup $\{1, \omega, \ldots, \omega^{n-1}\}$ |
| $Z_H(X)$ | Vanishing polynomial $X^n - 1$ |
| $L_i(X)$ | $i$-th Lagrange basis polynomial trên $H$ |
| $\tau$ | KZG trusted setup secret (toxic waste) |
| $\tilde{f}$ | Multilinear Extension của $f$ |
| $\mathbf{b}$ | Binary vector trong $\{0,1\}^k$ |
| $\text{eq}(\mathbf{x},\mathbf{r})$ | Equality polynomial |
| $\beta, \gamma$ | Permutation/lookup challenges |
| $\alpha$ | Gate-separation challenge |
| $\zeta$ | Evaluation point (PLONK opening) |
| $v, u$ | Batch opening challenges |
| SRS | Structured Reference String |
| VK | Verification Key |
| PI | Public Inputs |
| IOP | Interactive Oracle Proof |
| PCS | Polynomial Commitment Scheme |
| MLE | Multilinear Extension |
| MSM | Multi-Scalar Multiplication |

