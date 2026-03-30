---
title: "Point-Set Topology"
tags: [math, point-set-topology, index]
created: 2026-03-30
---

> **Level**: Graduate | **SageMath**: Có
> **Textbooks chính**: Munkres – *Topology* (2nd ed.), Willard – *General Topology*
> **Tổng số bài**: 15 bài học + 4 appendix

---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-topological-spaces|01. Topological Spaces]] — Tiên đề topology, open/closed sets, discrete/trivial/cofinite topology, basis và subbasis.
- [[02-constructing-topologies|02. Constructing Topologies]] — Subspace, order, product topology (Tychonoff & box); universal property; subspace của product = product của subspaces.
- [[03-closure-interior-limit-points|03. Closure, Interior, and Limit Points]] — Closure, interior, boundary, limit points, dense sets, hội tụ dãy và giới hạn trong topo tổng quát.
- [[04-continuous-functions-homeomorphisms|04. Continuous Functions & Homeomorphisms]] — Liên tục qua open sets; Pasting Lemma; homeomorphism; topological properties; embedding.
- [[05-metric-spaces|05. Metric Spaces]] — Metric topology qua open balls; equivalent metrics; metric space là Hausdorff + first-countable; liên tục $\leftrightarrow$ $\varepsilon$-$\delta$.
- [[06-connectedness|06. Connectedness]] — Separation, connected space, IVT, components, path-connected, topologist's sine curve, local connectedness.
- [[07-compactness-foundations|07. Compactness — Foundations]] — Open cover, Heine-Borel, Extreme Value Theorem, FIP, ba tương đương trong metric spaces, Lebesgue Number Lemma.
- [[08-compactness-advanced|08. Compactness — Advanced]] — LCH, one-point compactification $(\mathbb{R}^n)^* \cong S^n$, Heine-Cantor, compact-open topology.
- [[09-countability-axioms|09. Countability Axioms]] — First/second countable, separable, Lindelöf; trong metric: ba khái niệm tương đương.
- [[10-separation-axioms|10. Separation Axioms]] — Chuỗi $T_0 \subset T_1 \subset T_2 \subset T_3 \subset T_{3\frac{1}{2}} \subset T_4$; compact Hausdorff $\Rightarrow$ normal; metric $\Rightarrow$ normal.
- [[11-urysohn-tietze|11. Urysohn's Lemma & Tietze Extension]] — Normal $\iff$ Urysohn function tồn tại; Tietze Extension; partition of unity.
- [[12-tychonoff-stone-cech|12. Tychonoff's Theorem & Stone-Čech Compactification]] — Tychonoff (tương đương AC); Alexander Sub-base; $\beta X$ qua embedding $X \hookrightarrow [0,1]^{\mathcal{F}}$; universal property.
- [[13-metrization-paracompactness|13. Metrization Theorems & Paracompactness]] — Urysohn Metrization (second countable + regular $\Rightarrow$ metrizable); Nagata-Smirnov; paracompact; partition of unity.
- [[14-complete-metric-function-spaces|14. Complete Metric Spaces & Function Spaces]] — Cauchy sequences, completeness, Baire Category Theorem, Arzelà-Ascoli, Stone-Weierstrass.
- [[15-nets-filters-convergence|15. Nets, Filters & Convergence]] — Directed sets, nets, hội tụ net đặc trưng topo; filters, ultrafilters, compact $\iff$ mọi ultrafilter hội tụ.

---

## Appendices

- [[a0-proof-of-urysohn-lemma|A0. Proof of Urysohn's Lemma]] — Xây dựng họ open sets $\{U_p\}_{p \in \mathbb{D}}$ qua dyadic rationals; $f(x) = \inf\{p : x \in U_p\}$; chứng minh liên tục.
- [[a1-proof-of-tychonoff-theorem|A1. Proof of Tychonoff's Theorem]] — Hai chứng minh: Alexander Sub-base + Zorn; và qua ultrafilters.
- [[a2-proof-of-urysohn-metrization|A2. Proof of Urysohn Metrization Theorem]] — Embedding $F: X \hookrightarrow [0,1]^\omega$ qua Urysohn functions trên các cặp basis.
- [[a3-proof-of-baire-category-theorem|A3. Proof of Baire Category Theorem]] — BCT1 (complete metric): closed balls Cauchy; BCT2 (LCH): compact closures + Nested compact sets.

---

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $(X, \mathcal{T})$ | Không gian topo $X$ với topology $\mathcal{T}$ |
| $\mathcal{T}_{\text{disc}}$, $\mathcal{T}_{\text{triv}}$, $\mathcal{T}_{\text{cof}}$ | Discrete, trivial, cofinite topology |
| $\mathcal{B}$, $\mathcal{S}$ | Basis, subbasis |
| $\overline{A}$, $\operatorname{Int}(A)$, $\partial A$, $A'$ | Closure, interior, boundary, limit points |
| $(X, d)$, $B(x,\varepsilon)$ | Metric space, open ball |
| $\mathcal{T}_Y$ | Subspace topology trên $Y \subseteq X$ |
| $\prod_\alpha X_\alpha$, $\pi_\alpha$ | Product topology, projection |
| $X^*$, $\beta X$ | One-point compactification, Stone-Čech compactification |
| $C(X, Y)$ | Không gian hàm liên tục |
| $\mathbb{D}$ | Dyadic rationals trong $[0,1]$ |
| $T_k$ ($k=0,1,2,3,3\tfrac{1}{2},4$) | Separation axioms |
| $X \cong Y$ | Homeomorphism |
