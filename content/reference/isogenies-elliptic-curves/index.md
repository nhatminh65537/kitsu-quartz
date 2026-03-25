---
title: "Isogenies on Elliptic Curves"
tags: [crypto, isogeny, post-quantum, index]
created: 2026-03-24
---

Khóa học **Isogenies on Elliptic Curves** xây dựng toàn bộ nền tảng toán học và ứng dụng mật mã của isogenies, từ định nghĩa thuần túy đến các giao thức post-quantum hiện đại như CSIDH, SIDH, và SQISign.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Tóm tắt các Lesson

| # | Lesson | Tóm tắt |
|---|--------|---------|
| 01 | [[01-isogeny-definition\|01. Isogeny: Definition, Degree & Separability]] | Định nghĩa isogeny, degree, separability, rational maps |
| 02 | [[02-dual-isogeny-torsion\|02. Dual Isogeny & Torsion Subgroups]] | Dual isogeny, cấu trúc torsion $E[\ell]$, Weil pairing |
| 03 | [[03-velu-formulas\|03. Vélu's Formulas]] | Tính isogeny từ kernel — công cụ tính toán cốt lõi |
| 04 | [[04-endomorphism-rings\|04. Endomorphism Rings & j-invariant]] | $\text{End}(E)$, j-invariant, CM curves |
| 05 | [[05-frobenius-finite-fields\|05. Frobenius & Curves over Finite Fields]] | Frobenius endomorphism, characteristic polynomial, Hasse's theorem |
| 06 | [[06-ordinary-supersingular\|06. Ordinary vs Supersingular Elliptic Curves]] | Phân loại đường cong, trace of Frobenius, supersingular characterizations |
| 07 | [[07-isogeny-graphs\|07. Isogeny Graphs: Volcanoes & Expanders]] | $\ell$-isogeny graph, volcano structure, Ramanujan property |
| 08 | [[08-quadratic-orders-ideal-class\|08. Imaginary Quadratic Orders & Ideal Class Groups]] | Orders trong $\mathbb{Q}(\sqrt{-d})$, ideal class group, CM theory |
| 09 | [[09-deuring-correspondence\|09. Deuring Correspondence]] | Equivalence: supersingular curves ↔ maximal orders in quaternion algebras |
| 10 | [[10-csidh\|10. CSIDH]] | Group action key exchange trên supersingular curves qua $\mathbb{F}_p$ |
| 11 | [[11-sidh\|11. SIDH]] | Non-commutative key exchange, torsion point images |
| 12 | [[12-castryck-decru-attack\|12. Castryck-Decru Attack on SIDH]] | Tấn công khôi phục khóa bằng genus-2 isogenies |
| 13 | [[13-klpt-quaternion\|13. KLPT Algorithm & Quaternion Algebras]] | Quaternion algebras, KLPT algorithm, ideal-to-isogeny translation |
| 14 | [[14-sqisign\|14. SQISign]] | Chữ ký compact từ Deuring correspondence, Fiat-Shamir paradigm |

---

## Bảng Ký hiệu Toàn cục

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $E, E'$ | Đường cong elliptic |
| $\phi, \psi$ | Isogeny giữa các đường cong |
| $\hat{\phi}$ | Dual isogeny của $\phi$ |
| $\deg \phi$ | Degree của isogeny $\phi$ |
| $\ker \phi$ | Kernel của $\phi$ (subgroup hữu hạn) |
| $E[\ell]$ | $\ell$-torsion subgroup của $E$ |
| $E[m]$ | $m$-torsion subgroup của $E$ |
| $j(E)$ | j-invariant của $E$ |
| $\text{End}(E)$ | Endomorphism ring của $E$ |
| $\text{End}^0(E)$ | $\text{End}(E) \otimes_{\mathbb{Z}} \mathbb{Q}$ |
| $\pi_q$ | Frobenius endomorphism (relative to $\mathbb{F}_q$) |
| $t$ | Trace of Frobenius: $t = q + 1 - \#E(\mathbb{F}_q)$ |
| $\mathbb{F}_q$ | Trường hữu hạn với $q = p^r$ phần tử |
| $\overline{\mathbb{F}}_p$ | Algebraic closure của $\mathbb{F}_p$ |
| $\mathcal{O}$ | Order trong imaginary quadratic field |
| $\mathcal{O}_K$ | Ring of integers của $K$ |
| $\text{cl}(\mathcal{O})$ | Ideal class group của $\mathcal{O}$ |
| $\mathfrak{a}, \mathfrak{b}$ | Ideal trong $\mathcal{O}$ |
| $\mathfrak{B}$ | Quaternion algebra $B_{p,\infty}$ ramified at $p$ and $\infty$ |
| $\mathcal{O}_0$ | Maximal order trong $\mathfrak{B}$ |
| $\text{Hom}(E, E')$ | $\mathbb{Z}$-module các isogenies từ $E$ đến $E'$ |
| $[m]$ | Multiplication-by-$m$ map |
| $\ell$ | Prime degree của isogeny (thường $= 2$ hoặc $3$) |
| $p$ | Characteristic của trường cơ sở |

---

## Topic Nâng cao (Sau khi hoàn thành khóa học)

Sau khi hoàn thành 14 lessons, bạn đã sẵn sàng đào sâu vào các chủ đề sau:

### Nâng cao về Lý thuyết
- **Complex Multiplication Theory** — Shimura reciprocity, Hilbert class polynomials, CM points trên modular curves
- **Quaternion Algebras & Maximal Orders** — Brandt matrices, Eichler orders, optimal embeddings
- **$\ell$-adic Representations** — Tate modules, Galois representations, applications to isogeny problems
- **Genus-2 & Higher Genus Isogenies** — Jacobians, $(n,n)$-isogenies, Richelot isogenies

### Nâng cao về Giao thức
- **SQISign 2.0 / SQISignHD** — Phiên bản cải tiến dùng $(2,2)$-isogenies trên Kummer surfaces
- **OSIDH** — Oriented Supersingular Isogeny DH, thay thế CSIDH
- **CTIDH** — Constant-time CSIDH, bảo vệ side-channel
- **FESTA / FESTA+** — Isogeny-based encryption từ torsion points
- **Verifiable Delay Functions (VDF)** từ isogenies

### Tấn công & Mật mã Phân tích
- **Subexponential Attacks on CSIDH** — quantum meet-in-the-middle, BKZ lattice attacks
- **Endomorphism Ring Attacks** — algorithms for computing $\text{End}(E)$, Kohel-Lauter-Petit-Tignol
- **Torsion Point Attacks** — generalizations of Castryck-Decru
- **Side-channel Attacks** — timing attacks on scalar multiplications in CSIDH

### Kết nối với các Lĩnh vực Khác
- **Modular Curves & Modular Polynomials** — $\Phi_\ell(X,Y)$, modular equations, class polynomials
- **Supersingular Isogeny Graphs as Cryptographic Hash Functions** — Charles-Lauter-Goren construction
- **Post-quantum Group Signatures** từ isogenies
- **Isogenies trong Zero-Knowledge Proofs** — SQISign as Sigma protocol, Fiat-Shamir heuristic
