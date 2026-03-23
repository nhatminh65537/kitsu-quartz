---
title: "A0. Math Reference"
tags: [cryptography, starks, math, reference, appendix]
aliases: [Math Reference, Cheatsheet Toán]
created: 2026-03-13
---

> **Mục đích**: Quick-reference cho tất cả định nghĩa, ký hiệu, và công thức dùng xuyên suốt series.

---

## Ký Hiệu Chuẩn

| Ký hiệu | Nghĩa |
|---------|-------|
| $\mathbb{F}_p$ | Trường hữu hạn modulo số nguyên tố $p$ |
| $\mathbb{F}_p[X]$ | Vành đa thức hệ số trong $\mathbb{F}_p$ |
| $\omega$ | Primitive $n$-th root of unity: $\omega^n = 1$, $\omega^k \neq 1$ với $k < n$ |
| $H$ | Trace evaluation domain: $H = \{1, \omega, \omega^2, \ldots, \omega^{n-1}\}$ |
| $D$ | FRI evaluation domain: $D = \{$LDE extension of $H\}$, $|D| = \rho^{-1} \cdot n$ |
| $\rho$ | Code rate: $\rho = k/n$ với $k$ = degree bound, $n$ = domain size |
| $\rho^{-1}$ | Blowup factor (thường 4, 8, hoặc 16) |
| $T[i][j]$ | Execution trace: step $i$, register $j$ |
| $t_j(X)$ | Trace polynomial cho register $j$: $t_j(\omega^i) = T[i][j]$ |
| $Z_H(X)$ | Full domain zerofier: $X^n - 1$ |
| $Z_{\text{trans}}(X)$ | Transition zerofier: $(X^n - 1)/(X - \omega^{n-1})$ |
| $Q_j(X)$ | Quotient polynomial: $C_j(X) / Z_j(X)$ |
| $C_{\text{comp}}(X)$ | Composition polynomial (ALI): $\sum_j \alpha_j Q_j(X)$ |
| $F(X)$ | DEEP composition polynomial |
| $\lambda$ | Security parameter (thường 128 bits) |
| $\epsilon$ | Soundness error (probability) |

---

## Định Nghĩa Cơ Bản

> [!definition] Trường Hữu Hạn $\mathbb{F}_p$
> Với số nguyên tố $p$: $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z} = \{0, 1, \ldots, p-1\}$
> - Cộng: $(a + b) \bmod p$
> - Nhân: $(a \cdot b) \bmod p$
> - Nghịch đảo: $a^{-1} = a^{p-2} \bmod p$ (Fermat's little theorem)
> - Generator $g$: $\{g^0, g^1, \ldots, g^{p-2}\} = \mathbb{F}_p^*$

> [!definition] Roots of Unity
> $\omega$ là primitive $n$-th root of unity trong $\mathbb{F}_p$ nếu:
> - $\omega^n = 1$
> - $\omega^k \neq 1$ với mọi $1 \leq k < n$
> - Tồn tại khi $n \mid (p-1)$
> - $\omega = g^{(p-1)/n}$ với $g$ là generator

> [!definition] Halving Property
> Nếu $\omega$ là primitive $n$-th root, thì $\omega^2$ là primitive $(n/2)$-th root.
> $$(\omega^{n/2})^2 = \omega^n = 1 \implies \omega^{n/2} = -1$$
> Domain $D = \{x : x^n = 1\}$ có property: $x \in D \Rightarrow -x \in D$, và $x^2 = (-x)^2$.

> [!definition] Lagrange Interpolation
> Polynomial bậc $< n$ qua $n$ điểm $(x_0, y_0), \ldots, (x_{n-1}, y_{n-1})$:
> $$f(X) = \sum_{i=0}^{n-1} y_i \cdot \prod_{j \neq i} \frac{X - x_j}{x_i - x_j}$$

> [!definition] Reed-Solomon Code
> $RS[\mathbb{F}_p, D, k]$: tập các evaluations của polynomials bậc $< k$ trên domain $D$.
> - Code rate: $\rho = k/|D|$
> - Distance: $\delta_{\min} = |D| - k + 1$ (minimum Hamming distance)

---

## Định Lý Quan Trọng

> [!theorem] Schwartz-Zippel Lemma
> Cho $f \in \mathbb{F}_p[X]$ bậc $d$, $f \not\equiv 0$. Với $r$ random từ $\mathbb{F}_p$:
> $$\Pr[f(r) = 0] \leq \frac{d}{p}$$

> [!theorem] Fermat's Little Theorem
> Với số nguyên tố $p$ và $a \not\equiv 0$:
> $$a^{p-1} \equiv 1 \pmod{p}$$
> Corollary: $a^{-1} \equiv a^{p-2} \pmod{p}$

> [!theorem] Zerofier Identity
> $$X^n - 1 = \prod_{i=0}^{n-1}(X - \omega^i)$$
> Transition zerofier (loại trừ $\omega^{n-1}$):
> $$Z_{\text{trans}}(X) = \frac{X^n - 1}{X - \omega^{n-1}} = \prod_{i=0}^{n-2}(X - \omega^i)$$

> [!theorem] Polynomial Splitting (FRI)
> Bất kỳ $f(X)$ bậc $< 2k$ đều viết được duy nhất:
> $$f(X) = f_E(X^2) + X \cdot f_O(X^2)$$
> Với $\deg(f_E), \deg(f_O) < k$.

---

## Công Thức FRI

**Folding formula** tại $y = x^2$:
$$g(y) = \frac{f(x) + f(-x)}{2} + \alpha \cdot \frac{f(x) - f(-x)}{2x}$$

**Soundness error** (FRI, $q$ queries, code rate $\rho$):
$$\epsilon_{\text{FRI}} \approx (1 - \delta)^q + r \cdot \frac{k}{|\mathbb{F}|}, \quad \delta = 1 - \sqrt{\rho}$$

**Số queries cần thiết** (Johnson bound):
$$q \geq \frac{\lambda}{\log_2(1/(1-\delta))} = \frac{\lambda}{\log_2(1/(1-\delta))}$$

---

## Các Trường Hay Dùng

| Tên | $p$ | Dạng | Dùng trong |
|-----|-----|------|-----------|
| BabyBear | $15 \cdot 2^{27} + 1 = 2013265921$ | NTT-friendly | RISC Zero, SP1 |
| Goldilocks | $2^{64} - 2^{32} + 1$ | NTT-friendly | Plonky2, Plonky3 |
| Mersenne31 | $2^{31} - 1$ | Fast reduction | Circle STARKs |
| BN254 scalar | $\approx 2^{254}$ | Pairing-friendly | Groth16, PLONK |
| Pasta (Pallas/Vesta) | $\approx 2^{255}$ | Pasta cycle | Halo2 |

---

## AIR Constraints Summary

| Loại | Formula | Zerofier | Áp dụng tại |
|------|---------|---------|------------|
| Boundary (start) | $t_j(1) = v$ | $X - 1$ | Step 0 |
| Boundary (end) | $t_j(\omega^{n-1}) = v$ | $X - \omega^{n-1}$ | Step $n-1$ |
| Transition | $C(t_j(X), t_j(\omega X)) = 0$ | $(X^n-1)/(X-\omega^{n-1})$ | Steps $0 \ldots n-2$ |
| Permutation | $\prod_{i} t_j(\omega^i) = \prod_i \sigma_j(\omega^i)$ | Full domain | All steps |

---

## Degree Bounds

| Polynomial | Degree |
|-----------|--------|
| Trace $t_j(X)$ | $n - 1$ |
| Transition constraint $C$ of degree $d$ | $d(n-1)$ |
| Transition zerofier $Z_{\text{trans}}$ | $n - 1$ |
| Quotient $Q^{(T)} = C/Z_{\text{trans}}$ | $d(n-1) - (n-1) = (d-1)(n-1)$ |
| Boundary quotient $Q^{(B)}$ | $n - 2$ |
| Composition $C_{\text{comp}}$ | $\max$ of above |

---

## Complexity Summary

| Component | Prover | Verifier | Proof size |
|-----------|--------|---------|------------|
| NTT | $O(n \log n)$ | — | — |
| LDE | $O(n \log n)$ | — | — |
| FRI commit | $O(n \log n)$ | — | $O(\log^2 n)$ hashes |
| FRI query | — | $O(\lambda \log^2 n)$ | $O(\lambda \log^2 n)$ hashes |
| Full STARK | $O(n \log n)$ | $O(\lambda \log^2 n)$ | $\approx 200$–$500$ KB |
