---
title: "Commutative Algebra"
tags: [math, commutative-algebra, index]
created: 2026-03-28
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-rings-ideals-homomorphisms|01. Rings, Ideals, and Homomorphisms]] — Vành giao hoán, ideal, ring homomorphism, prime & maximal ideals, nilradical, Jacobson radical, Chinese Remainder Theorem.
- [[02-modules|02. Modules]] — $R$-module, submodule, quotient module, exact sequences, splitting, free modules, finitely generated modules, Nakayama's Lemma.
- [[03-tensor-product-and-hom|03. Tensor Product and Hom]] — Tensor product qua universal property, Tensor-Hom Adjunction, right-exactness của $\otimes$, left-exactness của $\operatorname{Hom}$, flat modules.
- [[04-localization|04. Localization]] — Tập nhân, $S^{-1}R$, universal property, $S^{-1}M \cong S^{-1}R \otimes_R M$, flatness của localization, tương ứng Spec, nguyên lý Local-Global.
- [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]] — ACC, ba đặc trưng Noetherian, Hilbert Basis Theorem ($R[x]$ Noetherian), primary ideals, radical của primary ideal là prime.
- [[06-primary-decomposition|06. Primary Decomposition]] — Associated primes $\operatorname{Ass}(M)$, Lasker–Noether (tồn tại), hai định lý duy nhất, isolated vs embedded primes, ý nghĩa hình học.
- [[07-integral-dependence|07. Integral Dependence]] — Phần tử nguyên (đặc trưng Cayley-Hamilton), integral closure là subring, Lying-Over, Going-Up, Incomparability, Going-Down, integrally closed domains.
- [[08-noether-normalization-nullstellensatz|08. Noether Normalization and Nullstellensatz]] — Noether Normalization, Weak & Strong Nullstellensatz, Rabinowitsch trick, dictionary hình học $\leftrightarrow$ đại số.
- [[09-spectrum-zariski-topology|09. Spectrum and Zariski Topology]] — Zariski topology, $D(f)$ cơ sở mở, quasi-compact, generic points, thành phần bất khả quy, Jacobson rings.
- [[10-dedekind-domains|10. Discrete Valuation Rings and Dedekind Domains]] — DVRs, Dedekind domains, unique factorization of ideals, fractional ideals, ideal class group, $\operatorname{Cl}(R) = 0 \iff$ PID $\iff$ UFD.
- [[11-dimension-theory|11. Dimension Theory]] — Krull dimension, height, $\dim k[\mathbf{x}] = n$, Krull's Principal Ideal Theorem, catenary rings, dimension theorem cho local rings.
- [[12-completions-filtrations|12. Completions and Filtrations]] — $I$-adic completion, Artin-Rees Lemma, Krull Intersection Theorem, graded rings, Hilbert-Samuel polynomial, multiplicity, Cohen's structure theorem.
- [[13-tor-and-ext|13. Homological Methods: Tor and Ext]] — Projective modules, $\operatorname{Tor}$ và $\operatorname{Ext}$, long exact sequences, Auslander-Buchsbaum formula, Serre's characterization.
- [[14-regular-local-rings|14. Regular Local Rings and Cohen–Macaulay Rings]] — Regular local rings, regularity $\Rightarrow$ UFD, depth, Cohen-Macaulay, Serre's normality criterion, phân cấp Regular $\subsetneq$ C.I. $\subsetneq$ Gorenstein $\subsetneq$ CM.

## Appendices

- [[a0-hilbert-basis-theorem|A0. Proof of Hilbert Basis Theorem]] — Quy nạp trên bậc với ideal $L_n$ của hệ số đầu; ACC đảm bảo dừng hữu hạn.
- [[a1-going-up-going-down|A1. Proof of Going-Up and Going-Down Theorems]] — Going-Up qua quotient + Lying-Over; Going-Down dùng $R$ integrally closed và Nakayama.
- [[a2-noether-normalization|A2. Proof of Noether Normalization Lemma]] — Hai trường hợp ($k$ vô hạn: linear substitution; $k$ hữu hạn: $N$-adic substitution); quy nạp trên số sinh.
- [[a4-krull-principal-ideal-theorem|A4. Proof of Krull's Principal Ideal Theorem]] — Localization + nilradical nilpotent + contradiction; tổng quát hóa cho $r$ generators.

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $(R, +, \cdot)$ | Vành giao hoán có $1$ |
| $R^\times$ | Nhóm các đơn vị của $R$ |
| $\mathfrak{a}, \mathfrak{b}, \mathfrak{p}, \mathfrak{q}, \mathfrak{m}$ | Ideal (Fraktur); $\mathfrak{p}$ prime, $\mathfrak{m}$ maximal |
| $\sqrt{\mathfrak{a}}$ | Radical của ideal $\mathfrak{a}$ |
| $\operatorname{Nil}(R)$ | Nilradical = $\sqrt{(0)}$ = giao mọi prime |
| $\operatorname{Jac}(R)$ | Jacobson radical = giao mọi maximal ideal |
| $\operatorname{Spec}(R)$ | Tập các prime ideals |
| $\operatorname{Max}(R)$ | Tập các maximal ideals |
| $\operatorname{Ass}(M)$ | Tập associated primes của module $M$ |
| $S^{-1}R$ | Localization tại tập nhân $S$ |
| $R_\mathfrak{p}$ | Localization tại prime $\mathfrak{p}$ |
| $R_f$ | Localization tại $\{1, f, f^2,\ldots\}$ |
| $M \otimes_R N$ | Tensor product của $R$-modules |
| $\operatorname{Hom}_R(M,N)$ | $R$-module homomorphisms từ $M$ đến $N$ |
| $\operatorname{Tor}_i^R(M,N)$ | $i$-th derived functor của $\otimes$ |
| $\operatorname{Ext}^i_R(M,N)$ | $i$-th derived functor của $\operatorname{Hom}$ |
| $\dim R$ | Krull dimension |
| $\operatorname{ht}(\mathfrak{p})$ | Height của prime ideal $\mathfrak{p}$ |
| $\operatorname{depth}(M)$ | Độ dài regular sequence tối đa |
| $\operatorname{pd}(M)$ | Projective dimension của $M$ |
| $\operatorname{gl.dim}(R)$ | Global dimension của $R$ |
| $\hat{R}$ | $I$-adic completion của $R$ |
| $\operatorname{gr}_I(R)$ | Associated graded ring $\bigoplus I^n/I^{n+1}$ |
| $\operatorname{Cl}(R)$ | Ideal class group của Dedekind domain |
| $\operatorname{Frac}(R)$ | Trường phân thức của miền nguyên $R$ |
| $V(\mathfrak{a})$ | Tập đóng trong $\operatorname{Spec}(R)$ ứng với $\mathfrak{a}$ |
| $D(f)$ | Tập mở cơ bản $\operatorname{Spec}(R) \setminus V(f)$ |
