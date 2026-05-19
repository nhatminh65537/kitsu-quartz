---
title: "Abelian Varieties"
type: index
tags: [math, abelian-varieties, index]
created: 2026-05-19
---

## Lessons

- [[00-roadmap|00. Roadmap]]

### Module 0 — Algebraic Geometry Foundations

- [[01-affine-and-projective-varieties|01. Affine and Projective Varieties]] — Định nghĩa affine variety và projective variety. Homogeneous coordinates, closed subset, Zariski topology. Tại sao cần projective space.
- [[02-morphisms-of-varieties|02. Morphisms of Varieties]] — Regular map, polynomial map, isomorphism giữa các variety. Product variety và universal property.
- [[03-completeness-and-proper-maps|03. Completeness and Proper Maps]] — Complete variety: ảnh của projective variety qua morphism luôn đóng. Proper morphism, closed image theorem.
- [[04-divisors-on-varieties|04. Divisors on Varieties]] — Weil divisor và Cartier divisor. Principal divisor của rational function. Linear equivalence giữa các divisor.
- [[05-line-bundles-and-the-picard-group|05. Line Bundles and the Picard Group]] — Invertible sheaf (line bundle). $\mathcal{O}(D)$ — line bundle liên kết với divisor. Picard group $\text{Pic}(X)$ phân loại line bundle.
- [[06-rational-functions-and-weil-reciprocity|06. Rational Functions and Weil Reciprocity]] — Rational function $f \in k(C)^\times$, divisor của $f$. Weil reciprocity: $\prod_P f(g(P))^{\text{ord}_P(g)} = \prod_P g(f(P))^{\text{ord}_P(f)}$.

### Module 1 — Group Varieties and Abelian Varieties

- [[07-algebraic-groups|07. Algebraic Groups — What Are They?]] — Group variety: một variety có cấu trúc nhóm. $\mathbb{G}_m$, $\mathbb{G}_a$, $\text{GL}_n$ là các ví dụ affine.
- [[08-the-rigidity-lemma|08. The Rigidity Lemma]] — Kết quả kỹ thuật quan trọng nhất: mọi map từ complete variety vào affine variety là constant. Hệ quả: group law trên AV là commutative.
- [[09-abelian-varieties-definition-and-commutativity|09. Abelian Varieties — Definition and Commutativity]] — Abelian variety = complete group variety. Chứng minh tính giao hoán từ Rigidity Lemma.
- [[10-translation-maps-and-morphisms-of-abelian-varieties|10. Translation Maps and Morphisms of Abelian Varieties]] — Translation map $t_a(x) = a + x$. Homomorphism of abelian varieties tôn trọng group law. Kernel của homomorphism.
- [[11-the-multiplication-by-n-map|11. The Multiplication-by-n Map]] — $[n]: A \to A$, $[n](x) = n \cdot x$. $[n]$ là finite surjective. Separability phụ thuộc char$(k)$.
- [[12-theorem-of-the-square|12. Theorem of the Square]] — $t_{a+b}^* L \otimes L \cong t_a^* L \otimes t_b^* L$. $\phi_L: A \to \text{Pic}(A)$ là homomorphism. Kết quả nền tảng cho dual AV.
- [[13-abelian-varieties-are-projective|13. Abelian Varieties Are Projective]] — Mọi abelian variety đều projective. Theorem of Cube, ample line bundle cho projective embedding.

### Module 2 — Isogenies

- [[14-isogenies-definition-and-basic-examples|14. Isogenies — Definition and Basic Examples]] — Isogeny = surjective homomorphism với finite kernel. Degree của isogeny. $[n]$ và Frobenius là isogeny.
- [[15-separable-vs-inseparable-isogenies|15. Separable vs Inseparable Isogenies]] — Separable degree và inseparable degree. Frobenius $\phi_q: A \to A^{(q)}$ là purely inseparable. Ảnh hưởng của char $p$.
- [[16-the-dual-isogeny|16. The Dual Isogeny]] — Mọi isogeny $f$ có dual isogeny $\hat{f}$: $\hat{f} \circ f = [\deg f]$, $f \circ \hat{f} = [\deg f]$. $\deg \hat{f} = \deg f$.
- [[17-n-torsion-points|17. n-Torsion Points A[n]]] — $A[n] = \ker([n])$. Khi $\gcd(n, \text{char}) = 1$: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$. Cấu trúc khi $n = p = \text{char}$.
- [[18-isogeny-as-an-equivalence-relation|18. Isogeny as an Equivalence Relation]] — "Isogenous" là quan hệ tương đương. $\text{Hom}(A,B)$ là $\mathbb{Z}$-module tự do hữu hạn rank. $\text{End}(A)$ là $\mathbb{Z}$-algebra.

### Module 3 — The ℓ-adic Tate Module

- [[19-inverse-limits|19. Inverse Limits — A Gentle Introduction]] — Inverse system, inverse limit $\varprojlim$. Ví dụ: $\mathbb{Z}_p = \varprojlim \mathbb{Z}/p^n\mathbb{Z}$. Universal property.
- [[20-the-l-adic-tate-module|20. The ℓ-adic Tate Module $T_\ell(A)$]] — $T_\ell(A) = \varprojlim A[\ell^n]$ là free $\mathbb{Z}_\ell$-module rank $2g$. $V_\ell(A) = T_\ell(A) \otimes \mathbb{Q}_\ell$.
- [[21-endomorphisms-on-the-tate-module|21. Endomorphisms on the Tate Module]] — $f \in \text{End}(A)$ induces $T_\ell(f): T_\ell(A) \to T_\ell(A)$. $\text{End}(A) \hookrightarrow \text{End}(T_\ell)$ là injective.
- [[22-characteristic-polynomial-of-an-endomorphism|22. Characteristic Polynomial of an Endomorphism]] — $P_f(t) \in \mathbb{Z}[t]$ monic bậc $2g$. $\deg f = P_f(0)$, $\deg([n] - f) = P_f(n)$.

### Module 4 — Dual Abelian Variety

- [[23-line-bundles-algebraically-equivalent-to-zero|23. Line Bundles Algebraically Equivalent to Zero]] — $\text{Pic}^0(A)$: line bundle algebraically equivalent to zero. Algebraic equivalence vs numerical equivalence.
- [[24-the-dual-abelian-variety|24. The Dual Abelian Variety $\hat{A} = \text{Pic}^0(A)$]] — $\hat{A}$ là một abelian variety. $\dim \hat{A} = \dim A$. Universal property của $\hat{A}$.
- [[25-the-poincare-line-bundle|25. The Poincaré Line Bundle $\mathcal{P}$]] — Poincaré bundle trên $A \times \hat{A}$. Rigidification: $\mathcal{P}|_{A \times \{0\}} \cong \mathcal{O}_A$, $\mathcal{P}|_{\{0\} \times \hat{A}} \cong \mathcal{O}_{\hat{A}}$.
- [[26-the-map-phi-l|26. The Map $\phi_L: A \to \hat{A}$]] — $\phi_L(a) = [t_a^* L \otimes L^{-1}]$. $\ker(\phi_L)$ là finite khi $L$ ample — khi đó $\phi_L$ là isogeny.
- [[27-double-duality|27. Double Duality $\hat{\hat{A}} \cong A$]] — Tồn tại natural isomorphism $A \xrightarrow{\sim} \hat{\hat{A}}$. Tính functorial của dual.

### Module 5 — The Weil Pairing

- [[28-motivation-weil-pairing-on-elliptic-curves|28. Motivation: Weil Pairing on Elliptic Curves]] — $e_n: E[n] \times E[n] \to \mu_n$ trên elliptic curve. Miller's algorithm sketch. $e_n(P,Q) \cdot e_n(Q,P) = 1$.
- [[29-the-natural-pairing|29. The Natural Pairing Between $A[n]$ and $\hat{A}[n]$]] — Setup tổng quát: pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$. Ý nghĩa: pairing canonical giữa torsion của $A$ và của $\hat{A}$.
- [[30-algebraic-construction-via-divisors|30. Algebraic Construction via Divisors]] — Xây dựng $e_n$ thuần đại số: chọn rational function $f$ với $\text{div}(f) = [n]^* D$, $e_n(P, \xi) = f(P + X)/f(X)$.
- [[31-properties-of-the-weil-pairing|31. Properties of the Weil Pairing]] — Bilinear, non-degenerate, alternating ($e_n(P,P)=1$), Galois-equivariant. Non-degeneracy là phần khó nhất.
- [[32-the-weil-pairing-on-tate-modules|32. The Weil Pairing on Tate Modules]] — Lifting pairing lên Tate module: $e_\ell: T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)$. Compatibility với $e_{\ell^n}$.
- [[33-weil-pairing-and-galois-representations|33. Weil Pairing and Galois Representations]] — Galois action tôn trọng Weil pairing. Cyclotomic character $\chi_\ell$. Ứng dụng: restriction lên Galois group.

### Module 6 — Polarizations

- [[34-symmetric-isogenies|34. Symmetric Isogenies $A \to \hat{A}$]] — Symmetric isogeny: $\hat{\phi} = \phi$. Mỗi symmetric isogeny đến từ một line bundle (up to algebraic equivalence).
- [[35-polarizations-definition-and-examples|35. Polarizations — Definition and Examples]] — Polarization = $\phi_L$ với $L$ ample. Degree của polarization. Principal polarization ($\deg = 1$).
- [[36-weil-pairing-from-a-polarization|36. Weil Pairing from a Polarization]] — $e_\phi(P, Q) = e_n(P, \phi(Q))$ là pairing trên $A[n] \times A[n]$. Skew-symmetry: $e_\phi(Q,P) = e_\phi(P,Q)^{-1}$.
- [[37-the-rosati-involution|37. The Rosati Involution]] — $f^\dagger = \phi^{-1} \circ \hat{f} \circ \phi$ là positive involution trên $\text{End}^0(A)$. $\text{Tr}(f f^\dagger) > 0$ với $f \neq 0$.
- [[38-jacobians-as-principally-polarized-av|38. Jacobians as Principally Polarized AV]] — $J(C) = \text{Pic}^0(C)$ với theta divisor $\Theta$ cho principal polarization. Ví dụ chuẩn mực nhất của PPAV.

### Module 7 — Abelian Varieties over $\mathbb{F}_q$

- [[39-frobenius-endomorphism|39. Frobenius Endomorphism $\pi_A$]] — Geometric Frobenius $\pi_A(x,y) = (x^q, y^q)$ là endomorphism của $A/\mathbb{F}_q$. Verschiebung $\hat{\pi}_A$ là dual.
- [[40-weil-numbers-and-their-properties|40. Weil Numbers and Their Properties]] — Weil $q$-number: algebraic integer $\pi$ với $|\sigma(\pi)| = \sqrt{q}$ cho mọi embedding. Characteristic polynomial của $\pi_A$.
- [[41-riemann-hypothesis-for-av-over-fq|41. Riemann Hypothesis for AV over $\mathbb{F}_q$]] — $|A(\mathbb{F}_q)| = \prod_{i=1}^{2g} (1 - \alpha_i)$ với $|\alpha_i| = \sqrt{q}$. Liên hệ Weil conjectures.
- [[42-tates-isogeny-theorem|42. Tate's Isogeny Theorem]] — $\text{Hom}(A,B) \otimes \mathbb{Z}_\ell \cong \text{Hom}_{\text{Gal}}(T_\ell A, T_\ell B)$. Isogeny class được xác định bởi char. poly. của Frobenius.
- [[43-honda-tate-classification|43. Honda-Tate Classification]] — Song ánh: isogeny classes của simple AV/$\mathbb{F}_q$ ↔ conjugacy classes của Weil $q$-numbers.
- [[44-ordinary-vs-supersingular-av|44. Ordinary vs Supersingular AV]] — Ordinary: $A[p] \cong (\mathbb{Z}/p\mathbb{Z})^g$. Supersingular: $A[p] = 0$. Newton polygon phân biệt hai loại.

### Module 8 — Applications to Cryptography

- [[45-pairings-in-cryptography|45. Pairings in Cryptography: From Theory to Practice]] — Ứng dụng $e_n$ trong crypto. MOV attack và FR attack: giảm DLP trên $E(\mathbb{F}_q)$ về $\mathbb{F}_{q^k}^\times$.
- [[46-tate-lichtenbaum-pairing|46. Tate–Lichtenbaum Pairing]] — Tate pairing: hiệu quả hơn Weil pairing. Reduced Tate pairing. Miller loop và final exponentiation.
- [[47-bls-signatures-and-optimal-ate-pairing|47. BLS Signatures and Optimal Ate Pairing]] — BLS signature scheme. Optimal Ate pairing — pairing nhanh nhất hiện nay. Ứng dụng Jacobian của hyperelliptic curve.

## Appendices

- [[a0-proof-of-rigidity-lemma|A0. Proof of Rigidity Lemma]] — Chứng minh chi tiết Rigidity Lemma: mọi map từ complete variety vào affine variety là constant.
- [[a1-proof-a-n-cong-z-nz-2g|A1. Proof: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$]] — Chứng minh cấu trúc nhóm $n$-torsion khi $\gcd(n, \text{char}) = 1$.
- [[a2-proof-of-non-degeneracy-of-weil-pairing|A2. Proof of Non-Degeneracy of Weil Pairing]] — Chứng minh tính non-degenerate của Weil pairing — phần kỹ thuật nhất.
- [[a3-sketch-of-tates-isogeny-theorem|A3. Sketch of Tate's Isogeny Theorem]] — Phác thảo chứng minh định lý Tate về isogeny.
- [[a4-weil-reciprocity|A4. Weil Reciprocity — Chứng Minh Đầy Đủ]] — Chứng minh đầy đủ Weil reciprocity cho rational functions trên curve.

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $k$ | Trường nền (field), thường là algebraically closed |
| $\overline{k}$ | Bao đóng đại số của $k$ |
| $\mathbb{F}_q$ | Trường hữu hạn $q$ phần tử ($q = p^r$) |
| $\mathbb{A}^n$ | Không gian affine $n$-chiều |
| $\mathbb{P}^n$ | Không gian xạ ảnh $n$-chiều |
| $A, B$ | Abelian variety |
| $\dim A = g$ | Chiều (dimension) của abelian variety |
| $t_a$ | Translation map: $t_a(x) = a + x$ |
| $[n]$ | Multiplication-by-$n$ map: $[n](x) = n \cdot x$ |
| $A[n]$ | $n$-torsion subgroup: $\ker([n]: A \to A)$ |
| $\text{End}(A)$ | Endomorphism ring của $A$ |
| $\text{End}^0(A)$ | $\text{End}(A) \otimes \mathbb{Q}$ |
| $\text{Pic}(X)$ | Picard group: nhóm các line bundle (up to isomorphism) |
| $\text{Pic}^0(A)$ | Line bundle algebraically equivalent to zero |
| $\hat{A}$ | Dual abelian variety: $\text{Pic}^0(A)$ |
| $\mathcal{P}$ | Poincaré line bundle trên $A \times \hat{A}$ |
| $\phi_L$ | Map $A \to \hat{A}$ induced bởi line bundle $L$ |
| $\ell$ | Số nguyên tố $\ell \neq \text{char}(k)$ |
| $T_\ell(A)$ | $\ell$-adic Tate module: $\varprojlim A[\ell^n]$ |
| $V_\ell(A)$ | $T_\ell(A) \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell$ |
| $\mu_n$ | Nhóm các căn bậc $n$ của unity |
| $e_n$ | Weil pairing: $A[n] \times \hat{A}[n] \to \mu_n$ |
| $\pi_A$ | Frobenius endomorphism của $A/\mathbb{F}_q$ |
| $\deg f$ | Degree của isogeny $f$ |
| $\hat{f}$ | Dual isogeny của $f$ |
| $f^\dagger$ | Rosati involution của $f$ |
