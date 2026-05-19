---
title: "Abelian Varieties"
tags: [math, abelian-varieties, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]] — Sheaves, line bundles, divisors, và cohomology cơ bản; nền tảng ngôn ngữ algebraic geometry cần thiết cho toàn bộ khóa học.
- [[02-complex-tori-and-lattices|02. Complex Tori và Lattices]] — Lattice $\Lambda \subset \mathbb{C}^g$, complex torus $\mathbb{C}^g/\Lambda$, cấu trúc nhóm và topo; Riemann form và điều kiện để AV; Appell–Humbert theorem.
- [[03-definitions-and-basic-properties|03. Definitions & Basic Properties]] — Group variety, abelian variety (complete connected group variety); Rigidity Theorem; chứng minh commutativity bắt buộc; translation maps, homogeneity, tangent bundle trivial; Poincaré reducibility.
- [[04-abelian-varieties-over-c|04. Abelian Varieties over ℂ]] — Analytic uniformization $A(\mathbb{C}) = V/\Lambda$; equivalence of categories với polarizable complex tori; polarization, type, principal polarization; theta divisor; torsion points $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$; Betti numbers và Hodge decomposition.
- [[05-theorem-of-the-cube|05. Theorem of the Cube & Square]] — Seesaw Principle; Theorem of the Cube (trivial trên 3 mặt $\Rightarrow$ trivial toàn bộ); Theorem of the Square ($\phi_\mathcal{L}$ là group homomorphism); công thức $[n]^*\mathcal{L} \cong \mathcal{L}^{n^2}$ (symmetric) và $\mathcal{L}^n$ ($\operatorname{Pic}^0$); degree của $[n]_A = n^{2g}$.
- [[06-abelian-varieties-are-projective|06. Abelian Varieties are Projective]] — Mọi AV là projective (chiến lược $3D$ very ample); Lemma hai điểm nằm trong cùng open affine; $K(\mathcal{L}) = \ker(\phi_\mathcal{L})$ và ampleness $\Leftrightarrow$ $K(\mathcal{L})$ hữu hạn; $\mathcal{L}^{\otimes 3}$ very ample; embedding $E \hookrightarrow \mathbb{P}^2$ qua Weierstrass.

- [[07-isogenies|07. Isogenies]] — Isogeny (surjective, finite kernel, same dim); degree và dual isogeny $f^ee$ ($f^ee \circ f = [\deg f]$); torsion $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ (đặc số $0$) và $p$-rank (đặc số $p$); Frobenius isogeny; isogeny category semi-simple.
- [[08-dual-abelian-variety|08. The Dual Abelian Variety]] — $A^ee$ như moduli space degree-0 line bundles; Poincaré bundle $\mathcal{P}$ và universal property; analytic description $ar{V}^ee/\Lambda^ee$; algebraic construction $A/K(\mathcal{L})$; biduality $(A^ee)^ee \cong A$; dual morphism $f^ee$ contravariant; Jacobian là PPAV canonical.

- [[09-weil-pairings-and-tate-modules|09. Weil Pairings & Tate Modules]] — Weil pairing $e_n : A[n] \times A^\vee[n] \to \mu_n$ (bilinear, non-degenerate, Galois equivariant); công thức qua rational functions (Miller algorithm); Tate module $T_\ell(A) \cong \mathbb{Z}_\ell^{2g}$; Galois representation $\rho_{A,\ell} : G_k \to \operatorname{GSp}_{2g}(\mathbb{Z}_\ell)$; Tate conjecture; ứng dụng pairing-based crypto và zkSNARKs.
- [[10-endomorphism-algebras|10. Endomorphism Algebras]] — $\operatorname{End}(A)$ ring hữu hạn sinh; $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$ semisimple; Albert classification 4 types (totally real, indefinite quaternion, definite quaternion, CM field); Tate module embedding và Tate conjecture; char. poly của endomorphism; CM varieties.

- [[11-polarizations-and-invertible-sheaves|11. Polarizations & Invertible Sheaves]] — Polarization tổng hợp 3 góc nhìn; Riemann–Roch cho AV: $\chi(A, \mathcal{L}) = \sqrt{\deg \phi_\mathcal{L}}$; Mumford Vanishing ($H^i = 0$, $i > 0$ khi ample); index $i(\mathcal{L})$; $h^0(O(n\Theta)) = n^g$; moduli space $\mathcal{A}_g = \operatorname{Sp}_{2g}(\mathbb{Z}) \backslash \mathcal{H}_g$, dim $= g(g+1)/2$.
- [[12-rosati-involution|12. The Rosati Involution]] — Rosati involution $f^\dagger = \lambda^{-1} \circ f^\vee \circ \lambda$ trên $\operatorname{End}^0(A)$; positive: $\operatorname{Tr}(f f^\dagger) > 0$; xác định Albert type; $\operatorname{NS}(A) \hookrightarrow \operatorname{End}^0(A)^{\dagger=\dagger}$; CM case: Rosati = complex conjugation.

- [[13-jacobian-varieties|13. Abel's Theorem & Construction of Jacobian]] — $J(C) = \operatorname{Pic}^0(C)$; construction analytic $J = H^0(\Omega_C^1)^*/H_1(C,\mathbb{Z})$; period matrix $Z \in \mathcal{H}_g$; Abel's theorem ($\ker \mu = $ principal divisors) + Jacobi inversion ($\mu$ surjective) $\Rightarrow \operatorname{Pic}^0(C) \cong J(C)$; theta divisor $\Theta = W_{g-1}$; universal property; Schottky problem.
- [[14-abel-jacobi-map|14. The Abel–Jacobi Map]] — $f_{P_0} : C \hookrightarrow J(C)$ là closed immersion khi $g \geq 1$; injectivity qua Riemann–Roch; symmetric powers $\sigma_d : C^{(d)} \to J(C)$, $\sigma_g$ birational; $W_d = \sigma_d(C^{(d)})$ subvarieties; Riemann Singularity Theorem; Albanese universal property; Matsusaka's theorem.

- [[15-torelli-theorem|15. Torelli's Theorem]] — Torelli's Theorem: $(J(C),\Theta_C) \cong (J(C'),\Theta_{C'}) \Rightarrow C \cong C'$; proof qua $\Theta = W_{g-1}$ và singularities; Torelli map $\tau : \mathcal{M}_g \hookrightarrow \mathcal{A}_g$ injective; local Torelli (infinitesimal); Schottky problem và Shiota's KP theorem.
- [[16-abelian-varieties-over-finite-fields|16. Abelian Varieties over Finite Fields]] — Frobenius $\pi_q \in \operatorname{End}(A)$; char. poly $f_A(T) \in \mathbb{Z}[T]$ bậc $2g$; Weil bound $|\alpha_i| = q^{1/2}$; Hasse bound; zeta function; Tate's theorem (isogenous $\Leftrightarrow$ same $f_A$); Weil $q$-numbers; ordinary vs supersingular.

- [[17-honda-tate-theory|17. Honda–Tate Theory]] — Bijection: simple AV/$\mathbb{F}_q$ / isogeny $\leftrightarrow$ Weil $q$-numbers / conjugacy; injectivity (Tate 1966); surjectivity (Honda 1968); $\operatorname{End}^0(A)$ từ $\pi$: center $K=\mathbb{Q}(\pi)$, local invariants $\operatorname{inv}_v$; $\dim A = [D:K]^{1/2}[K:\mathbb{Q}]/2$; classification hoàn toàn $\operatorname{AV}_{\mathbb{F}_q}^{\rm iso}$.
- [[18-complex-multiplication|18. Complex Multiplication]] — CM field và CM-type $(K, \Phi)$; CM AV trên $\mathbb{C}$: $A = \mathbb{C}^g/\Phi(\mathfrak{a})$; reflex field $K^*$; Main Theorem of CM (Shimura–Taniyama): Galois action qua Artin map + reflex norm; Kronecker's Jugendtraum; ứng dụng: BLS12-381 ($D=-3$, $k=12$).

## Appendices

- [[a0-proof-of-theorem-of-the-cube|A0. Proof of the Theorem of the Cube]] — Seesaw Lemma; Trivial on Fibers Lemma; proof Theorem of the Cube qua induction; corollaries: $\phi_\mathcal{L}$ homomorphism, $[n]^*\mathcal{L} = \mathcal{L}^{n^2}$.
- [[a1-proof-of-lefschetz-embedding|A1. Proof of the Lefschetz Embedding Theorem]] — Theta functions; $h^0(\mathcal{L}^n) = n^g \cdot h^0(\mathcal{L})$; base-point free; separation of points và tangent vectors; $\mathcal{L}^3$ very ample; embedding $A \hookrightarrow \mathbb{P}^N$.
- [[a2-construction-of-dual-abelian-variety|A2. Construction of the Dual Abelian Variety]] — $K(\mathcal{L})$ như group scheme; quotient $A^\vee = A/K(\mathcal{L})$; Mumford bundle và descent; rigidification; universal property verification; biduality $(A^\vee)^\vee \cong A$.

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $A$, $B$ | Abelian variety |
| $g$ | Dimension của abelian variety |
| $k$ | Ground field (thường là $\mathbb{C}$ hoặc $\mathbb{F}_q$) |
| $\bar{k}$ | Algebraic closure của $k$ |
| $A[n]$ | Tập các $n$-torsion points của $A$ |
| $A^\vee$ | Dual abelian variety của $A$ |
| $T_\ell(A)$ | Tate module của $A$ tại $\ell$ |
| $\operatorname{End}(A)$ | Endomorphism ring của $A$ |
| $\operatorname{End}^0(A)$ | $\operatorname{End}(A) \otimes_{\mathbb{Z}} \mathbb{Q}$ |
| $\operatorname{Pic}^0(A)$ | Degree-0 part của Picard group |
| $\mathcal{L}$, $\mathcal{M}$ | Line bundle (invertible sheaf) |
| $\Theta$ | Theta divisor |
| $\Lambda$ | Lattice trong $\mathbb{C}^g$ |
| $J(C)$ | Jacobian variety của curve $C$ |
