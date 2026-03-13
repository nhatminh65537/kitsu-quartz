---
title: "A0. Math Reference Sheet"
tags: [crypto, groth16, reference, math, appendix]
aliases: [Groth16 Math Reference]
created: 2026-03-12
---

## Notation Summary

| Ký hiệu | Định nghĩa | Ghi chú |
|---------|-----------|---------|
| $n$ | Số wires (bao gồm $z_0=1$) | $\mathbf{z} \in \mathbb{F}_p^n$, index $0 \ldots n{-}1$ |
| $m$ | Số constraints (gates) | Ma trận $A,B,C \in \mathbb{F}_p^{m \times n}$; $\deg(t) = m$ |
| $\ell$ | Số public inputs | $\ell < n$; private wires: index $\ell{+}1 \ldots n{-}1$ |
| $[a]_1 = a \cdot g_1$ | Scalar $a$ embedded vào $\mathbb{G}_1$ | $a \in \mathbb{F}_p$ |
| $[a]_2 = a \cdot g_2$ | Scalar $a$ embedded vào $\mathbb{G}_2$ | |
| $e([a]_1, [b]_2) = [ab]_T$ | Bilinear pairing | $[ab]_T \in \mathbb{G}_T$ |
| $\mathbf{z}$ | Full witness vector $(1, \mathbf{x}, \mathbf{w})$ | $\mathbf{x}$ public, $\mathbf{w}$ private |
| $A_i(x), B_i(x), C_i(x)$ | QAP polynomials từ column $i$ của R1CS | Degree $\leq m-1$ |
| $A(x) = \sum z_i A_i(x)$ | "Combined" QAP polynomial | |
| $t(x) = \prod_{k=1}^{m}(x - r_k)$ | Vanishing/target polynomial | Degree $m$ |
| $h(x) = (AB - C)/t$ | Quotient polynomial | Degree $m-2$ |
| $\tau, \alpha, \beta, \gamma, \delta$ | Toxic waste (setup secrets) | PHẢI hủy sau setup |

---

## BN254 (BN128) Parameters

| Parameter | Value |
|-----------|-------|
| Field prime $p$ | `21888242871839275222246405745257275088696311157297823662689037894645226208583` |
| Scalar order $r$ | `21888242871839275222246405745257275088548364400416034343698204186575808495617` |
| $\mathbb{G}_1$ generator $g_1$ | `(1, 2)` |
| $\mathbb{G}_2$ generator $g_2$ | `([10857046999023057135944570762232829481370756359578518086990519993285655852781, 11559732032986387107991004021392285783925812861821192530917403151452391805634], [8495653923123431417604973247489272438418190587263600148770280649306958101930, 4082367875863433681332203403145435568316851327593401208105741076214120093531])` |
| Embedding degree | 12 |
| Security level | ~100-bit (post-TNFS) |

---

## BLS12-381 Parameters

| Parameter | Value |
|-----------|-------|
| Field prime $p$ | 381-bit prime |
| Scalar order $r$ | 255-bit prime: `0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001` |
| Embedding degree | 12 |
| Security level | ~128-bit |
| $\mathbb{G}_1$ point size | 48 bytes (compressed) |
| $\mathbb{G}_2$ point size | 96 bytes (compressed) |

---

## Pairing Properties

$$e(aP, bQ) = e(P, Q)^{ab} \quad (a, b \in \mathbb{F}_p)$$

$$e(P + P', Q) = e(P, Q) \cdot e(P', Q)$$

$$e(P, Q + Q') = e(P, Q) \cdot e(P, Q')$$

$$e(-P, Q) = e(P, -Q) = e(P, Q)^{-1}$$

$$e(-P, -Q) = e(P, Q)$$

---

## CRS Structure (Full)

### Proving Key $\text{pk}$

$$\text{pk} = \Bigl([\alpha]_1,\ [\beta]_1,\ [\delta]_1,\ \{[\tau^i]_1\}_{i=0}^{n-1},\ \{[A_i(\tau)]_1\}_{i=0}^{n-1},$$
$$\{[B_i(\tau)]_1\}_{i=0}^{n-1},\ [\beta]_2,\ [\delta]_2,\ \{[\tau^i]_2\}_{i=0}^{n-1},\ \{[B_i(\tau)]_2\}_{i=0}^{n-1},$$
$$\left\{\left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\delta}\right]_1\right\}_{i=\ell+1}^{n-1},\ \left\{\left[\frac{\tau^i t(\tau)}{\delta}\right]_1\right\}_{i=0}^{m-2}\Bigr)$$

### Verifying Key $\text{vk}$

$$\text{vk} = \Bigl([\alpha]_1,\ [\beta]_2,\ [\gamma]_2,\ [\delta]_2,\ \left\{\left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\gamma}\right]_1\right\}_{i=0}^{\ell}\Bigr)$$

---

## Proving Algorithm (Summary)

**Input**: $\text{pk},\ \mathbf{z} = (1, z_1, \ldots, z_{n-1}),\ r, s \xleftarrow{\$} \mathbb{F}_p$

$$[A]_1 = [\alpha]_1 + \sum_{i=0}^{n-1} z_i [A_i(\tau)]_1 + r[\delta]_1$$

$$[B]_2 = [\beta]_2 + \sum_{i=0}^{n-1} z_i [B_i(\tau)]_2 + s[\delta]_2$$

$$[B]_1 = [\beta]_1 + \sum_{i=0}^{n-1} z_i [B_i(\tau)]_1 + s[\delta]_1$$

$$h(x) = \frac{A(x)B(x) - C(x)}{t(x)}$$

$$[C]_1 = \sum_{i=\ell+1}^{n-1} z_i \!\left[\frac{\beta A_i + \alpha B_i + C_i}{\delta}\right]_1 + \sum_{k=0}^{m-2} h_k \!\left[\frac{\tau^k t(\tau)}{\delta}\right]_1 + s[A]_1 + r[B]_1 - rs[\delta]_1$$

**Output**: $\pi = ([A]_1, [B]_2, [C]_1)$

---

## Verification Algorithm (Summary)

**Input**: $\text{vk}, \mathbf{x} = (z_1, \ldots, z_\ell), \pi = ([A]_1, [B]_2, [C]_1)$

$$[L_\text{pub}]_1 = \sum_{i=0}^{\ell} z_i \left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\gamma}\right]_1 \quad (z_0 = 1)$$

**Check**:

$$e([A]_1, [B]_2) \stackrel{?}{=} e([\alpha]_1, [\beta]_2) \cdot e([L_\text{pub}]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$$

---

## Lagrange Interpolation (Quick Ref)

Với $m$ điểm $(r_1, y_1), \ldots, (r_m, y_m)$:

$$L_i(x) = \prod_{j \neq i} \frac{x - r_j}{r_i - r_j} \quad \text{(basis polynomial)}$$

$$P(x) = \sum_{i=1}^{m} y_i L_i(x)$$

Trong Groth16, $r_k$ là roots of unity (để dùng FFT). $A_i(x) = \sum_{k=1}^{m} A_{k,i} \cdot L_k(x)$.

---

## Complexity Reference

| Operation | Prover | Verifier |
|-----------|--------|---------|
| MSM in $\mathbb{G}_1$ | $O(m)$ | $O(\ell)$ |
| MSM in $\mathbb{G}_2$ | $O(m)$ | — |
| FFT (polynomial ops) | $O(m \log m)$ | — |
| Pairing checks | — | 3 (2 effective) |
| **Total dominant cost** | $O(m \log m)$ | $O(\ell)$ + 2 pairings |
