---
title: Pairings on Elliptic Curves
tags: [math, pairing, elliptic-curves, index]
created: 2026-03-09
---

# Index: Pairings on Elliptic Curves

## Lessons

### Giai đoạn A — Nền tảng
- [[01-ecc-finite-field-review|ECC & Finite Field Review]]
- [[02-extension-fields-tower-extensions|Extension Fields & Tower Extensions]]
- [[03-rational-functions-algebraic-geometry-on-curves|Rational Functions & Algebraic Geometry on Curves]]

### Giai đoạn B — Lý thuyết Pairing
- [[04-divisors-on-elliptic-curve|Divisors on Elliptic Curve]]
- [[05-torsion-points|Torsion Points]]
- [[06-weil-pairing|Weil Pairing]]
- [[07-millers-algorithm|Miller's Algorithm]]

### Giai đoạn C — Pairing thực tế
- [[08-tate-lichtenbaum-pairing|Tate-Lichtenbaum Pairing]]
- [[09-ate-pairing-optimal-ate|Ate Pairing & Optimal Ate]]
- [[10-pairing-friendly-curves|Pairing-Friendly Curves]]

### Giai đoạn D — Ứng dụng & Bảo mật
- [[11-mov-attack-frey-ruck-attack|MOV Attack & Frey-Ruck Attack]]
- [[12-ibe-bls-signatures|IBE & BLS Signatures]]
- [[13-polynomial-commitments-kzg|Polynomial Commitments & KZG]]
- [[14-pairing-based-cryptography-security|Pairing-Based Cryptography Security]]

---

## Quick Lookup

### Definitions

| Khái niệm                                      | Định nghĩa                                                  | Bài |
| ---------------------------------------------- | ----------------------------------------------------------- | --- |
| Elliptic curve group                           | [[01-ecc-finite-field-review|Definition 1.1]]             | 01  |
| Frobenius endomorphism                         | [[01-ecc-finite-field-review|Definition 1.17]]           | 01  |
| Embedding degree $k$                           | [[01-ecc-finite-field-review|Definition 1.22]]           | 01  |
| Finite field $\mathbb{F}_{q^k}$                | [[02-extension-fields-tower-extensions|Definition 2.1]]  | 02  |
| Roots of unity $\mu_n$                         | [[02-extension-fields-tower-extensions|Definition 2.10]] | 02  |
| Divisor group $\operatorname{Div}(E)$          | [[04-divisors-on-elliptic-curve|Definition 4.1]]         | 04  |
| Principal divisor                              | [[04-divisors-on-elliptic-curve|Definition 4.4]]         | 04  |
| Torsion group $E[n]$                           | [[05-torsion-points|Definition 5.1]]        | 05  |
| Weil pairing $e_n$                             | [[06-weil-pairing|Definition 6.2]]                          | 06  |
| Miller function $f_{n,P}$                      | [[06-weil-pairing|Definition 6.1]]                          | 06  |
| Tate pairing $\hat{t}_n$                       | [[08-tate-lichtenbaum-pairing|Definition 8.3]]              | 08  |
| Final exponentiation                           | [[08-tate-lichtenbaum-pairing|Definition 8.3]]              | 08  |
| $\mathbb{G}_1$, $\mathbb{G}_2$, $\mathbb{G}_T$ | [[09-ate-pairing-optimal-ate|Definition 9.1]]            | 09  |
| Ate pairing $a_T$                              | [[09-ate-pairing-optimal-ate|Definition 9.3]]            | 09  |
| Optimal pairing                                | [[09-ate-pairing-optimal-ate|Definition 9.9]]            | 09  |
| Pairing-friendly curve                         | [[10-pairing-friendly-curves|Definition 10.1]]              | 10  |
| $\rho$-value                                   | [[10-pairing-friendly-curves|Definition 10.2]]              | 10  |
| BN curve family                                | [[10-pairing-friendly-curves|Definition 10.4]]              | 10  |
| BLS12 curve family                             | [[10-pairing-friendly-curves|Definition 10.7]]              | 10  |
| Tower field $\mathbb{F}_{p^{12}}$              | [[10-pairing-friendly-curves|Definition 10.10]]             | 10  |
| IBE scheme                                     | [[12-ibe-bls-signatures|Definition 12.3]]                | 12  |
| BF-IBE scheme                                  | [[12-ibe-bls-signatures|Definition 12.4]]                | 12  |
| BLS signature                                  | [[12-ibe-bls-signatures|Definition 12.8]]                | 12  |
| KZG commitment                                 | [[13-polynomial-commitments-kzg|Definition 13.3]]           | 13  |
| KZG opening proof                              | [[13-polynomial-commitments-kzg|Definition 13.4]]           | 13  |
| BDH assumption                                 | [[14-pairing-based-cryptography-security|Definition 14.2]]                    | 14  |
| $q$-SDH assumption                             | [[14-pairing-based-cryptography-security|Definition 14.6]]                    | 14  |
| Subgroup attack                                | [[14-pairing-based-cryptography-security|Definition 14.12]]                   | 14  |

### Key Theorems

| Định lý                                      | Nội dung                                              | Bài                                                      |
| -------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$      | Cấu trúc nhóm torsion                                 | [[05-torsion-points|Theorem 5.4]]                       |
| Weil pairing: bilinear, non-deg, alternating | 5 tính chất chính                                     | [[06-weil-pairing|Theorem 6.4]]                         |
| Miller's Algorithm                           | $O(\log n)$ tính $f_{n,P}$                            | [[07-millers-algorithm|Definition 7.4]]                |
| Weil = tỷ số hai Miller                      | $e_n(P,Q) = (-1)^n \cdot M(P,Q)/M(Q,P)$               | [[07-millers-algorithm|Theorem 7.7]]                   |
| Reduced Tate well-defined                    | Final exp triệt tiêu ambiguity                        | [[08-tate-lichtenbaum-pairing|Theorem 8.4]]             |
| Weil = tỷ số hai Tate                        | $e_n = \hat{t}_n/\hat{t}_n(Q,P)$                      | [[08-tate-lichtenbaum-pairing|Theorem 8.8]]             |
| Ate pairing properties                       | Bilinear, non-degenerate                              | [[09-ate-pairing-optimal-ate|Theorem 9.5]]            |
| MOV reduction                                | ECDLP → DLP trong $\mathbb{F}_{q^k}^*$                | [[11-mov-attack-frey-ruck-attack|Theorem 11.3]]              |
| BKSV anomalous attack                        | $O(\log^2 p)$ trên anomalous curves                   | [[11-mov-attack-frey-ruck-attack|Theorem 11.13]]             |
| BF-IBE correctness                           | $e(U,d_{\text{ID}}) = e(H(\text{ID}),P_\text{pub})^r$ | [[12-ibe-bls-signatures|Theorem 12.5]]                |
| BLS correctness                              | $e([s]H(m), G_2) = e(H(m), [s]G_2)$                   | [[12-ibe-bls-signatures|Theorem 12.9]]                |
| BLS aggregation                              | Sum signatures, one pairing verify                    | [[12-ibe-bls-signatures|Theorem 12.10]]               |
| KZG verify equation                          | $e(C-[v]G_1, G_2) = e(\pi, [\tau-z]G_2)$              | [[13-polynomial-commitments-kzg|Theorem 13.5]]        |
| Assumptions hierarchy                        | ECDLP⇒CDH⇒BDH⇒DBDH                                    | [[14-pairing-based-cryptography-security|Theorem 14.4]] |
| Security levels                              | BN254 ~100b, BLS12-381 ~128b                          | [[14-pairing-based-cryptography-security|Theorem 14.9]] |

---

## Notation Guide

| Symbol                    | Meaning                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| $E/\mathbb{F}_q$          | Elliptic curve over finite field                                     |
| $E(\mathbb{F}_q)$         | Group of $\mathbb{F}_q$-rational points                              |
| $\#E(\mathbb{F}_q)$       | Number of points (group order)                                       |
| $E[n]$                    | $n$-torsion subgroup over $\bar{\mathbb{F}}_q$                       |
| $\mathcal{O}$             | Point at infinity (identity)                                         |
| $[n]P$                    | Scalar multiplication: $P+P+\cdots+P$ ($n$ times)                    |
| $\pi_q$                   | Frobenius endomorphism $(x,y) \mapsto (x^q, y^q)$                    |
| $k = k(q,r)$              | Embedding degree: $\min\{k : r \mid q^k-1\}$                         |
| $\mu_n$                   | Group of $n$-th roots of unity in $\bar{\mathbb{F}}_q$               |
| $\mathbb{G}_1$            | $E[r] \cap \ker(\pi_q - [1]) = E(\mathbb{F}_q)[r]$                   |
| $\mathbb{G}_2$            | $E[r] \cap \ker(\pi_q - [q])$ (Frobenius eigenspace)                 |
| $\mathbb{G}_T$            | $\mu_r \subset \mathbb{F}_{q^k}^*$ (target group)                    |
| $e_n(P,Q)$                | Weil pairing                                                         |
| $t_n(P,Q)$                | Tate pairing (unreduced)                                             |
| $\hat{t}_n(P,Q)$          | Reduced Tate pairing                                                 |
| $a_T(Q,P)$                | Ate pairing ($T = t-1$)                                              |
| $f_{n,P}$                 | Miller function: $\operatorname{div}(f_{n,P}) = n[P]-n[\mathcal{O}]$ |
| $h_{T_1,T_2}$             | Line function: $\ell_{T_1,T_2}/v_{T_1+T_2}$                          |
| $\operatorname{Div}(E)$   | Divisor group                                                        |
| $\operatorname{Div}^0(E)$ | Degree-0 divisors                                                    |
| $\operatorname{Pic}^0(E)$ | Picard group (degree-0 divisor classes)                              |
| $\rho$                    | $\rho$-value: $\log p / \log r$                                      |
| $\Phi_k(x)$               | $k$-th cyclotomic polynomial                                         |
| SRS                       | Structured Reference String (trusted setup)                          |
| $\tau$                    | Toxic waste of SRS                                                   |
| $C = [f(\tau)]G_1$        | KZG commitment to polynomial $f$                                     |
| $\pi = [q(\tau)]G_1$      | KZG opening proof                                                    |