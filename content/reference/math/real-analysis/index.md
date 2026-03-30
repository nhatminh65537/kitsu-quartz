---
title: "Real Analysis"
tags: [math, real-analysis, index]
created: 2026-03-28
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-the-real-number-system|01. The Real Number System]] — Ordered field, completeness axiom, sup/inf, tính chất Archimedean. Nền tảng tiên đề của $\mathbb{R}$ và sự khác biệt với $\mathbb{Q}$.
- [[02-cardinality-and-countability|02. Cardinality & Countability]] — Lực lượng tập hợp, tập đếm được, $\mathbb{Q}$ đếm được, $\mathbb{R}$ không đếm được (Cantor diagonal), định lý Cantor ($|A| < |\mathcal{P}(A)|$), Cantor-Schröder-Bernstein.
- [[03-metric-spaces|03. Metric Spaces]] — Metric và không gian metric, open/closed sets, closure/interior/boundary, compact sets, Heine-Borel, connectedness, complete metric spaces.
- [[04-sequences-and-series|04. Sequences & Series]] — Hội tụ dãy, MCT, Bolzano-Weierstrass, limsup/liminf, dãy Cauchy, chuỗi số, root test, ratio test, Riemann rearrangement.
- [[05-continuity|05. Continuity]] — Liên tục $\varepsilon$-$\delta$ và theo dãy, đặc trưng tô-pô (preimage), EVT, IVT, uniform continuity, phân loại điểm gián đoạn.
- [[06-differentiation|06. Differentiation]] — Đạo hàm, Rolle, MVT, Cauchy MVT, L'Hôpital, Taylor's Theorem với Lagrange remainder, hàm lồi và Jensen's inequality.
- [[07-riemann-integration|07. Riemann Integration]] — Darboux sums, tiêu chuẩn Riemann-Stieltjes, lớp hàm khả tích, FTC I & II, integration by parts, giới hạn của Riemann (động lực cho Lebesgue).
- [[08-sequences-of-functions|08. Sequences of Functions]] — Pointwise vs uniform convergence, ba định lý hoán vị (liên tục/tích phân/đạo hàm), Weierstrass M-test, Arzelà-Ascoli (equicontinuity), Stone-Weierstrass (đa thức dày đặc trong $C(K)$).
- [[09-measure-theory-foundations|09. Measure Theory Foundations]] — $\sigma$-algebra, Borel $\sigma$-algebra, measure và tính chất (liên tục từ dưới/trên), outer measure, tiêu chuẩn Carathéodory, Carathéodory Extension Theorem, almost everywhere.
- [[10-lebesgue-measure|10. Lebesgue Measure]] — Lebesgue outer measure, Lebesgue measurable sets $\mathcal{L}$, regularity, Cantor set (uncountable, measure $0$), hàm Cantor (Devil's Staircase), Vitali set (tập không đo được, dùng AC).
- [[08-sequences-of-functions|08. Sequences of Functions]] — Pointwise vs uniform convergence, uniform limit bảo toàn liên tục/tích phân/đạo hàm, Weierstrass M-test, equicontinuity, Arzelà-Ascoli, Stone-Weierstrass.
- [[09-measure-theory-foundations|09. Measure Theory Foundations]] — $\sigma$-algebra, Borel $\sigma$-algebra, measure space, tính chất cơ bản, outer measure, Carathéodory criterion, Carathéodory Extension Theorem, Borel-Cantelli.
- [[10-lebesgue-measure|10. Lebesgue Measure]] — Lebesgue outer measure, $\mathcal{L}$ vs $\mathcal{B}$, translation invariance, regularity, Cantor set (measure $0$ nhưng uncountable), Fat Cantor, tập Vitali không đo được.
- [[11-measurable-functions|11. Measurable Functions]] — Hàm đo được, tiêu chuẩn nhận biết, simple functions, Simple Approximation Theorem, almost everywhere, modes of convergence, Egorov's Theorem, Lusin's Theorem, Littlewood's three principles.
- [[12-lebesgue-integration|12. Lebesgue Integration]] — Tích phân Lebesgue (simple → nonneg → general), MCT (Beppo Levi), Fatou's Lemma, Dominated Convergence Theorem, Bounded Convergence Theorem, absolute continuity, Lebesgue vs Riemann.
- [[13-lp-spaces|13. Lᵖ Spaces]] — $L^p$ space và chuẩn $\|\cdot\|_p$, Hölder's inequality, Minkowski's inequality, Riesz-Fischer (Banach space), $L^2$ Hilbert space, Parseval's identity, duality $(L^p)^* \cong L^q$, inclusion giữa $L^p$ spaces.

## Appendices

- [[a0-heine-borel|A0. Heine-Borel Theorem]] — Chứng minh đầy đủ $(1) \Leftrightarrow (2) \Leftrightarrow (3)$: compact $\Leftrightarrow$ seq. compact $\Leftrightarrow$ closed + bounded trong $\mathbb{R}^n$. Phương pháp bisection + quy nạp trên $n$.
- [[a1-arzela-ascoli|A1. Arzelà-Ascoli Theorem]] — Chứng minh đầy đủ qua Diagonal Argument + uniform equicontinuity. Cả hai chiều của Compact Characterization. Ứng dụng: Peano existence theorem.
- [[a2-caratheodory-extension|A2. Carathéodory Extension Theorem]] — Chứng minh 5 bước: xây $\mu^*$ → Carathéodory criterion → $\mathcal{A} \subseteq \mathcal{M}^*$ → nhất quán → duy nhất (Monotone Class Theorem). Ứng dụng: xây dựng Lebesgue measure.

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{N}$ | Tập số tự nhiên $\{1, 2, 3, \ldots\}$ |
| $\mathbb{Z}$ | Tập số nguyên |
| $\mathbb{Q}$ | Tập số hữu tỷ |
| $\mathbb{R}$ | Tập số thực |
| $\sup S$ | Supremum (cận trên nhỏ nhất) của $S$ |
| $\inf S$ | Infimum (cận dưới lớn nhất) của $S$ |
| $\lvert x \rvert$ | Giá trị tuyệt đối của $x$ |
| $(a, b)$, $[a, b]$ | Khoảng mở, khoảng đóng trong $\mathbb{R}$ |
| $d(x, y)$ | Khoảng cách metric giữa $x$ và $y$ |
| $B(x, r)$ | Open ball tâm $x$ bán kính $r$ |
| $\limsup_{n}$ | Giới hạn trên của dãy |
| $\liminf_{n}$ | Giới hạn dưới của dãy |
