---
title: "Algebraic Geometry"
tags: [math, algebraic-geometry, index]
created: 2026-03-31
---

> **Level**: Graduate | **SageMath**: Có
> **Nguồn chính**: Vakil *The Rising Sea* (2024), Hartshorne *Algebraic Geometry*

---

## Roadmap

[[00-roadmap|00. Roadmap]] — 10 lessons, Graduate level

---

## Lessons

| Lesson | Nội dung chính |
|--------|---------------|
| [[01-category-theory-and-functors\|01. Category Theory & Functors]] | Category, functor, natural transformation, Yoneda lemma, limits/colimits. Ngôn ngữ nền tảng của Algebraic Geometry hiện đại. |
| [[02-sheaves-and-presheaves\|02. Sheaves and Presheaves]] | Presheaf, sheaf trên không gian topo, stalk, sheafification, morphism của sheaves. |
| [[03-affine-varieties-and-nullstellensatz\|03. Affine Varieties & Nullstellensatz]] | Tập đại số, Zariski topology, Hilbert Nullstellensatz, coordinate ring, irreducibility. |
| [[04-affine-schemes\|04. Affine Schemes: Spec & Structure Sheaf]] | Spec R, prime spectrum, structure sheaf $\mathcal{O}_X$, locally ringed space. |
| [[05-schemes-and-gluing\|05. Schemes & Gluing]] | Định nghĩa scheme, gluing construction, $\mathbb{A}^n$, $\mathbb{P}^n$. |
| [[06-morphisms-of-schemes\|06. Morphisms of Schemes]] | Morphism của locally ringed spaces, fiber products, base change, $S$-schemes. |
| [[07-properties-of-schemes\|07. Properties of Schemes & Morphisms]] | Reduced, integral, Noetherian schemes; separated, quasi-compact morphisms. |
| [[08-proper-and-projective-morphisms\|08. Proper & Projective Morphisms]] | Valuative criterion, finite morphisms, projective morphisms, Chow's lemma. |
| [[09-dimension-theory\|09. Dimension Theory]] | Krull dimension, transcendence degree, dimension của schemes và morphisms. |
| [[10-smoothness-and-singularities\|10. Smoothness & Singularities]] | Regular local ring, Zariski tangent space, smooth/étale/unramified, $\Omega_{X/S}$. |

---

## Appendix

| File | Nội dung |
|------|---------|
| [[a0-hilbert-nullstellensatz\|A0. Proof of Hilbert Nullstellensatz]] | Weak form và strong form, chứng minh qua Noether normalization |
| [[a1-yoneda-lemma\|A1. Proof of Yoneda Lemma]] | Chứng minh đầy đủ và các hệ quả |
| [[a2-fundamental-theorem-affine-schemes\|A2. Fundamental Theorem of Affine Schemes]] | $\mathcal{O}(\operatorname{Spec}R) \cong R$ |

---

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\operatorname{Spec} R$ | Prime spectrum của vành $R$ |
| $\mathcal{O}_X$ | Structure sheaf của scheme $X$ |
| $\mathcal{O}_{X,x}$ | Stalk của $\mathcal{O}_X$ tại điểm $x$ |
| $\mathfrak{m}_x$ | Maximal ideal của local ring $\mathcal{O}_{X,x}$ |
| $k(x)$ | Residue field tại $x$: $\mathcal{O}_{X,x}/\mathfrak{m}_x$ |
| $X \times_S Y$ | Fiber product của $X, Y$ trên $S$ |
| $\Omega_{X/S}$ | Sheaf of relative differentials |
| $\mathbb{A}^n_k$ | Affine $n$-space over $k$ |
| $\mathbb{P}^n_k$ | Projective $n$-space over $k$ |
