---
title: "Algebra Foundations"
tags: [math, algebra-foundations, index]
created: 2026-03-28
---

Tập hợp bài học về Ring Theory, Field Theory, Module Theory, và Multilinear Algebra — nền tảng hoàn chỉnh để học Commutative Algebra (Atiyah–MacDonald, Matsumura).

**Level**: Graduate | **SageMath**: Có | **Ngôn ngữ**: Tiếng Việt, thuật ngữ tiếng Anh | **Tổng**: 16 bài + 4 appendix

---

## Phần A — Ring Theory

- [[00-roadmap|00. Roadmap]] — Lộ trình 16 bài, dependency graph, progress tracker.
- [[01-rings-and-ideals|01. Rings and Ideals]] — Ring, ring homomorphism, ideal (trái/phải/hai phía), quotient ring, 3 isomorphism theorems, correspondence theorem, prime và maximal ideals.
- [[02-special-rings-domains-fields|02. Special Rings: Domains and Fields]] — Integral domain, zero divisor, field, characteristic, phân cấp Fields ⊂ ED ⊂ PID ⊂ UFD ⊂ Domain. Counterexample: $\mathbb{Z}[\sqrt{-5}]$ không phải UFD.
- [[03-polynomial-rings-and-factorization|03. Polynomial Rings and Factorization]] — $R[x]$, division algorithm, content, primitive polynomial, Gauss's Lemma, Eisenstein Criterion, $R$ UFD $\Rightarrow$ $R[x]$ UFD.
- [[04-localization|04. Localization]] — Multiplicative set, $S^{-1}R$, universal property, $\operatorname{Frac}(R)$, $R_f$, $R_P$, local rings, correspondence của prime ideals, exactness.
- [[05-noetherian-rings|05. Noetherian Rings and the Hilbert Basis Theorem]] — ACC, 3 đặc trưng Noetherian, HBT, $\sqrt{I} = \bigcap P$, nilradical, Jacobson radical, Nakayama's Lemma, primary decomposition.

## Phần B — Field Theory

- [[06-field-extensions|06. Field Extensions]] — Degree $[K:F]$, algebraic/transcendental, minimal polynomial $m_\alpha$, simple extension $F(\alpha) \cong F[x]/(m_\alpha)$, Tower Law, constructibility.
- [[07-splitting-fields|07. Splitting Fields and Algebraic Closure]] — Splitting field, normal extension, separable extension, algebraic closure $\overline{F}$ (tồn tại và duy nhất), separable degree, Primitive Element Theorem.
- [[08-finite-fields|08. Finite Fields]] — $|\mathbb{F}| = p^n$, tồn tại và duy nhất $\mathbb{F}_{p^n}$, Frobenius automorphism $\phi$, $\mathbb{F}_{p^n}^\times$ cyclic, subfield lattice ($\mathbb{F}_{p^m} \subseteq \mathbb{F}_{p^n}$ iff $m \mid n$).

## Phần C — Module Theory

- [[09-modules-definitions|09. Modules: Definitions and Basic Constructions]] — $R$-module, submodule, quotient, 3 isomorphism theorems, free module, direct sum $\oplus$ vs direct product $\prod$, torsion, annihilator, exact sequences.
- [[10-modules-over-pids|10. Finitely Generated Modules over PIDs]] — Structure Theorem (invariant factor form: $d_1 \mid \cdots \mid d_k$; elementary divisor form: $p^e$), phân loại finitely generated abelian groups, Jordan/Rational canonical form, Smith Normal Form.
- [[11-projective-injective-flat|11. Projective, Injective, and Flat Modules]] — Split exact sequences, projective (lifting, direct summand of free, $\operatorname{Hom}(P,-)$ exact, free trên local ring), injective (Baer's Criterion, divisible), flat ($-\otimes$ exact, torsion-free trên PID).
- [[12-hom-and-tensor|12. Exact Functors and Hom/Tensor]] — Tensor product (universal property, $M \otimes R/I \cong M/IM$, tính toán), $\operatorname{Hom}(M,-)$ left exact, $-\otimes N$ right exact, Hom–Tensor Adjunction, base change $S \otimes_R M$.
- [[13-homological-algebra|13. Introduction to Homological Algebra]] — Chain complexes, homology, Snake Lemma, Five Lemma, projective resolution, $\operatorname{Tor}_n^R(M,N)$, $\operatorname{Ext}_R^n(M,N)$, long exact sequences, Hilbert Syzygy Theorem.

## Phần D — Multilinear Algebra

- [[14-tensor-algebra|14. Tensor Algebra]] — $T(M) = \bigoplus T^n(M)$, universal property (free algebra), $T(R^k) \cong R\langle x_1,\ldots,x_k\rangle$, quotient algebras, $T$ là functor.
- [[15-exterior-algebra|15. Exterior Algebra and Determinants]] — $\bigwedge(M) = T(M)/\langle m \otimes m\rangle$, anticommutativity, basis $\binom{k}{n}$ của $\bigwedge^n(R^k)$, determinant từ $\bigwedge^n(f)$, graded-commutativity, differential forms.
- [[16-symmetric-algebra|16. Symmetric Algebra and Applications]] — $\operatorname{Sym}(M) = T(M)/\langle m\otimes n - n\otimes m\rangle$, universal property, $\operatorname{Sym}(R^n) \cong R[x_1,\ldots,x_n]$, Rees algebra, projective space, representation theory.

---

## Appendices

- [[a0-structure-theorem-pid|A0. Structure Theorem for Modules over PIDs]] — Proof đầy đủ: free submodule của $R^n$ (induction), Smith Normal Form (thuật toán + correctness), tính duy nhất qua Fitting ideals.
- [[a1-hilbert-basis-theorem|A1. Hilbert Basis Theorem]] — Proof đầy đủ: induction trên bậc, xây dựng $J_n$ từ leading coefficients, ACC của $R$ đảm bảo dừng.
- [[a2-baer-criterion|A2. Baer's Criterion]] — Proof đầy đủ: $Q$ injective $\iff$ mọi map $I \to Q$ ($I$ ideal) extend sang $R \to Q$, dùng Zorn's Lemma trên partial extensions.
- [[a3-snake-lemma|A3. Snake Lemma]] — Diagram chase đầy đủ 5 bước: định nghĩa connecting homomorphism $\delta$ (well-defined) và exactness tại mỗi vị trí.

---

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $R, S$ | Ring (commutative, có đơn vị, trừ khi ghi chú) |
| $R^\times$ | Nhóm units của $R$ |
| $I \trianglelefteq R$ | $I$ là ideal của $R$ |
| $R/I$ | Quotient ring |
| $\operatorname{char}(R)$ | Characteristic của $R$ |
| $R[x]$, $R[x_1,\ldots,x_n]$ | Vành đa thức |
| $\operatorname{cont}(f)$ | Content của đa thức $f \in R[x]$ |
| $S^{-1}R$ | Localization của $R$ theo multiplicative set $S$ |
| $R_P$ | Localization của $R$ tại prime ideal $P$ |
| $R_f$ | Localization tại $\{1, f, f^2,\ldots\}$ |
| $\operatorname{Frac}(R)$ | Field of fractions của integral domain $R$ |
| $\sqrt{I}$ | Radical của ideal $I$; $\sqrt{I} = \bigcap_{P \supseteq I} P$ |
| $\operatorname{nil}(R)$ | Nilradical $= \sqrt{(0)}$ |
| $\operatorname{Jac}(R)$ | Jacobson radical $= \bigcap_{\mathfrak{m}} \mathfrak{m}$ |
| $[K:F]$ | Degree của field extension $K/F$ |
| $m_\alpha$, $m_{\alpha,F}$ | Minimal polynomial của $\alpha$ over $F$ |
| $\overline{F}$ | Algebraic closure của $F$ |
| $\mathbb{F}_{p^n}$, $\operatorname{GF}(p^n)$ | Finite field với $p^n$ phần tử |
| $\phi$ | Frobenius endomorphism $\alpha \mapsto \alpha^p$ |
| $M, N, L$ | $R$-module |
| $M \oplus N$, $\bigoplus M_i$ | Direct sum |
| $\prod M_i$ | Direct product |
| $M \otimes_R N$ | Tensor product |
| $\operatorname{Hom}_R(M, N)$ | $R$-linear maps từ $M$ vào $N$ |
| $\operatorname{Ann}(M)$, $\operatorname{Ann}(m)$ | Annihilator |
| $M_{\text{tor}}$ | Torsion submodule của $M$ |
| $\operatorname{Tor}_n^R(M,N)$ | $n$-th derived functor của $\otimes_R$ |
| $\operatorname{Ext}_R^n(M,N)$ | $n$-th derived functor của $\operatorname{Hom}_R$ |
| $\operatorname{pd}(M)$ | Projective dimension của $M$ |
| $\operatorname{gl.dim}(R)$ | Global dimension của $R$ |
| $T(M)$ | Tensor algebra $= \bigoplus_{n \geq 0} T^n(M)$ |
| $\bigwedge(M)$, $\bigwedge^n(M)$ | Exterior algebra và graded pieces |
| $\operatorname{Sym}(M)$, $\operatorname{Sym}^n(M)$ | Symmetric algebra và graded pieces |
