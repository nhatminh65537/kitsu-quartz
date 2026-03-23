---
title: "A0. KZG and ZeroMorph Reference"
tags: [crypto, kzg, zeromorph, reference, appendix]
aliases: [KZG ZeroMorph Reference]
created: 2026-03-13
---

> Đây là **tài liệu tra cứu nhanh** — công thức đầy đủ cho KZG và ZeroMorph, không có giải thích dài. Dùng khi audit hoặc implement.
> Xem giải thích chi tiết: [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]], [[09-multilinear-sumcheck|09. Multilinear Extensions and Sumcheck]]

---

## KZG — Univariate

### Setup

$$\text{SRS} = \left( [\tau^0]_1, [\tau^1]_1, \ldots, [\tau^{d-1}]_1,\ [\tau]_2,\ [1]_2 \right)$$

$\tau$ là toxic waste — bị xóa sau trusted setup. $d$ là max degree.

### Commit

$$[f]_1 = \sum_{i=0}^{\deg f} f_i \cdot [\tau^i]_1 = [f(\tau)]_1$$

### Prove Opening tại $z$

$$q(X) = \frac{f(X) - f(z)}{X - z}, \quad \pi = [q(\tau)]_1$$

### Verify

$$e\!\left([f]_1 - [y]_1,\ [1]_2\right) = e\!\left(\pi,\ [\tau]_2 - [z]_2\right)$$

trong đó $y = f(z)$ là claimed evaluation.

### Batch Opening (nhiều polynomials, cùng điểm $z$)

Challenge $v \stackrel{\$}{\leftarrow} \mathbb{F}$:

$$f_{\text{batch}}(X) = \sum_i v^i \cdot f_i(X)$$

$$q_{\text{batch}}(X) = \frac{f_{\text{batch}}(X) - f_{\text{batch}}(z)}{X - z}$$

Verify: một pairing check cho tất cả polynomials.

### Batch Opening (nhiều polynomials, nhiều điểm)

Thêm challenge $u$: kết hợp bằng random linear combination.

---

## PLONK — KZG Usage

| Polynomial | Số lần mở | Tại điểm |
|-----------|----------|----------|
| $a(X), b(X), c(X)$ | 1 mỗi cái | $\zeta$ |
| $S_{\sigma 1}(X), S_{\sigma 2}(X)$ | 1 mỗi cái | $\zeta$ |
| $z(X)$ | 2 | $\zeta$ và $\zeta\omega$ |
| $t(X) = t_{\text{lo}} + X^n t_{\text{mid}} + X^{2n} t_{\text{hi}}$ | 1 | $\zeta$ |

Tổng: **batch opening** → 2 pairing checks ($[W_\zeta]_1, [W_{\zeta\omega}]_1$).

---

## ZeroMorph — Multilinear

### Setup

Dùng lại KZG SRS. Thêm shifted SRS: $\left([\tau^{-1}]_1, \ldots\right)$ (cần để encode shift).

### Claim

Prover muốn prove: $\tilde{f}(\mathbf{u}) = v$ với $\tilde{f}: \mathbb{F}^k \to \mathbb{F}$ multilinear, $\mathbf{u} = (u_1,\ldots,u_k) \in \mathbb{F}^k$.

### Quotient Decomposition

$$\tilde{f}(\mathbf{X}) - v = \sum_{i=1}^{k} (X_i - u_i) \cdot \tilde{q}_i(\mathbf{X})$$

mỗi $\tilde{q}_i$ là multilinear trên $k-1$ biến (không phụ thuộc $X_i$).

### Univariatisation

Mỗi $\tilde{q}_i$ được "univariatised" thành polynomial $q_i(X)$ bậc $< 2^{k-1}$:

$$q_i(X) = \sum_{\mathbf{b} \in \{0,1\}^{k-1}} \tilde{q}_i(\mathbf{b}) \cdot X^{\text{bits}^{-1}(\mathbf{b})}$$

Commit: $[q_i]_1 = [q_i(\tau)]_1$.

### Degree Check

Cần đảm bảo $q_i(X)$ có degree $< 2^{k-1}$, không phải $< 2^k$. Dùng **degree-check polynomial**:

$$\hat{q}_i(X) = X^{2^k - 2^{k-1}} \cdot q_i(X)$$

Commit $[\hat{q}_i]_1$. Verifier kiểm tra bằng pairing:

$$e\!\left([\hat{q}_i]_1,\ [1]_2\right) = e\!\left([q_i]_1,\ [\tau^{2^k - 2^{k-1}}]_2\right)$$

### Batching

Challenge $\rho \stackrel{\$}{\leftarrow} \mathbb{F}$:

$$Q(X) = \sum_{i=1}^{k} \rho^i \cdot q_i(X), \quad \hat{Q}(X) = \sum_{i=1}^{k} \rho^i \cdot \hat{q}_i(X)$$

### Verify Opening

Verifier kiểm tra:

$$[f]_1 - v \cdot [1]_1 = \sum_{i=1}^{k} u_i \cdot [q_i]_1 - Q(\tau) \cdot [\tau]_1 + Q(\tau) \cdot [1]_1$$

(tất cả chuyển thành một KZG opening check tại $\tau = 0$ — nhờ SRS).

**Tổng pairing checks**: 2 (batch degree check + batch opening).

---

## ZeroMorph vs KZG — So Sánh

| | KZG Univariate | ZeroMorph Multilinear |
|-|---------------|----------------------|
| Input | $f(X)$ univariate degree $n$ | $\tilde{f}(\mathbf{X})$ multilinear $k$ biến, $n=2^k$ |
| Commitment | $[f(\tau)]_1$ (1 group element) | $[\tilde{f}(\tau)]_1$ via coefficients |
| Opening proof | $1$ group element $[q]_1$ | $k$ group elements $[q_1]_1,\ldots,[q_k]_1$ |
| Verify cost | 2 pairings | 2 pairings |
| SRS size | $n$ elements $[\tau^i]_1$ | $n$ elements + shift elements |
| Prover time | $O(n)$ multi-scalar mult | $O(n)$ + $k$ MSMs |

---

## Công Thức Hay Quên

**Lagrange basis trên $H = \{\omega^0,\ldots,\omega^{n-1}\}$:**

$$L_i(X) = \frac{\omega^i}{n} \cdot \frac{X^n - 1}{X - \omega^i}$$

**Vanishing polynomial:**

$$Z_H(X) = X^n - 1 = \prod_{i=0}^{n-1}(X - \omega^i)$$

**Coset shift** (dùng trong PLONK permutation):

$$k_j \cdot H = \{k_j \omega^0, k_j \omega^1, \ldots, k_j \omega^{n-1}\}, \quad k_j \notin H$$

Thường chọn $k_1 = 7, k_2 = 13$ (đảm bảo $k_j \notin H$ với typical $n$).

**Multilinear Lagrange basis:**

$$\text{eq}(\mathbf{x}, \mathbf{e}) = \prod_{i=1}^k \left(x_i e_i + (1-x_i)(1-e_i)\right), \quad \mathbf{e} \in \{0,1\}^k$$

**BN254 scalar field:** $p = 2^{254} + 2^{252} + \ldots$ (256-bit prime, order $r$ của $\mathbb{G}_1$):

$$r = 21888242871839275222246405745257275088548364400416034343698204186575808495617$$

**BN254 base field:**

$$q = 21888242871839275222246405745257275088696311157297823662689037894645226208583$$

