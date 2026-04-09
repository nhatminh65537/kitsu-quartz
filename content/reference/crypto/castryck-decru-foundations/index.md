---
title: "Castryck-Decru Foundations"
type: index
tags: [crypto, isogeny, sidh, castryck-decru, index]
created: 2026-04-09
---

Series này xây dựng toàn bộ nền tảng toán học để hiểu và implement **Castryck-Decru Attack** (2022) — cuộc tấn công phá vỡ SIDH/SIKE hoàn toàn. Xuất phát điểm: quen thuộc với elliptic curves, isogenies, SIDH protocol, Weil pairing.

---

## Lessons

| # | Title | Type | File |
|---|-------|------|------|
| 00 | Roadmap | — | [[00-roadmap\|00. Roadmap]] |
| 01 | Abelian Varieties — Foundations | Math Component | [[01-abelian-varieties-foundations\|01. Abelian Varieties]] |
| 02 | Polarizations and Principal Polarization | Math Component | [[02-polarizations\|02. Polarizations]] |
| 03 | Genus-2 Curves and Divisors | Math Component | [[03-genus2-curves-divisors\|03. Genus-2 Curves]] |
| 04 | Jacobians of Genus-2 Curves | Math Component | [[04-jacobians-genus2\|04. Jacobians]] |
| 05 | Mumford Coordinates and the Group Law | Deep Dive | [[05-mumford-coordinates\|05. Mumford Coordinates]] |
| 06 | Isogenies between Abelian Varieties | Math Component | [[06-isogenies-abelian-varieties\|06. Isogenies on AV]] |
| 07 | Richelot Isogenies — the (2,2)-Construction | Math Component | [[07-richelot-isogenies\|07. Richelot Isogenies]] |
| 08 | Glue and Split | Deep Dive | [[08-glue-and-split\|08. Glue and Split]] |
| 09 | Supersingular Endomorphism Rings and the γ Endomorphism | Math Component | [[09-endomorphism-ring-gamma\|09. Endomorphism + γ]] |
| 10 | Kani's Theorem | Foundation | [[10-kani-theorem\|10. Kani's Theorem]] |
| 11 | Castryck-Decru Attack — Mechanism | Attack | [[11-castryck-decru-attack\|11. Attack Mechanism]] |
| 12 | Castryck-Decru Attack — SageMath Implementation | Deep Dive | [[12-implementation-sagemath\|12. Implementation]] |
| A0 | Theta Coordinates for (2,2)-Isogenies | Deep Dive | [[a0-theta-coordinates\|A0. Theta Coordinates]] |
| A1 | Kani's Theorem — Full Proof | Deep Dive | [[a1-kani-proof\|A1. Kani Full Proof]] |

---

## Lesson Summaries

**01 — Abelian Varieties**: Abelian variety là projective algebraic variety + group morphism, tự động giao hoán (Rigidity Lemma). $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$. Hai loại PPAS: split $E_1 \times E_2$ và Jacobian $\text{Jac}(C)$.

**02 — Polarizations**: Polarization $\lambda: A \to \hat{A}$ từ line bundle. Principal polarization là isomorphism. Torelli theorem: genus-2 curve được encode bởi PPAS. "Split test" phân biệt hai loại PPAS.

**03 — Genus-2 Curves**: $C: y^2 = f(x)$, $\deg f \in \{5,6\}$, squarefree. Divisors, Picard group $\text{Pic}^0(C)$, linear equivalence, Riemann-Roch. $\text{Jac}(C) = \text{Pic}^0(C)$ là abelian surface.

**04 — Jacobians**: Theta divisor, Abel-Jacobi theorem, Cantor's algorithm. $J[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$. Weil pairing trên $J$. Phân biệt split vs. Jacobian.

**05 — Mumford Coordinates**: Cặp $(u,v)$ với $u$ monic $\deg \leq 2$, $u \mid (v^2 - f)$. Cantor's algorithm tường minh. $J[2]$: Mumford form $(u, 0)$, pairs of Weierstrass points.

**06 — Isogenies on AV**: $(n,n)$-isogeny: $\ker \cong (\mathbb{Z}/n\mathbb{Z})^2$, degree $n^2$. Kernel phải maximal isotropic. Có đúng 15 $(2,2)$-isogenies từ mỗi PPAS.

**07 — Richelot Isogenies**: $(2,2)$-isogeny explicit từ factorization $f = G_1 G_2 G_3$. $\delta \neq 0$: image là Jacobian. $\delta = 0$: image là split surface. 15 factorizations = 15 isogenies.

**08 — Glue and Split**: Gluing $E_1 \times E_2 \to A'$, split test, recovery của $E_1', E_2'$. Ba trường hợp: split / Jacobian / degenerate. Complexity: poly $\log p$ per chain.

**09 — Endomorphism Ring + $\gamma$**: $\text{End}(E_0)$ supersingular = maximal order quaternion. $E_0$ có $\iota$ degree 2. $\gamma = [u] + [2v] \cdot \iota$ với $u^2 + 4v^2 = 3^{e_B}$.

**10 — Kani's Theorem**: $(N,N)$-isogeny từ $E_1 \times E_2$ với kernel $K = \text{Im}(\phi \times \psi)|_{E[N]}$ split $\Leftrightarrow$ isogeny diamond commutes. "SIDH squares = Kani diamonds".

**11 — Attack Mechanism**: Input: SIDH public key. Xây dựng $\gamma$, kernel từ torsion images. Digit-by-digit recovery: test split ở mỗi bước. Complexity $O(\log^2 p)$. SIKEp434 trong ~1 giờ (original).

**12 — Implementation**: SageMath, baby SIKEp64 ($p = 2^{33} \cdot 3^{19} - 1$) chạy < 10 giây. `richelot_aux.sage` cho glue/split. Scale lên SIKEp434 bằng thay parameters.

**A0 — Theta Coordinates**: Theta constants $(\lambda, \mu, \nu, \rho)$, duplication formulas, split detection (theta = 0), recovery $j(E_i)$ từ theta constants.

**A1 — Kani Full Proof**: Isotropic lemma, degree condition, chiều $\Rightarrow$ (split → diamond), chiều $\Leftarrow$ (diamond → split). Đầy đủ kỹ thuật.

---

## Global Notation Table

| Ký hiệu | Ý nghĩa | Lesson định nghĩa |
|---------|---------|-------------------|
| $A$ | Abelian variety dimension $g$ | 01 |
| $\hat{A}$ | Dual abelian variety | 02 |
| $\lambda: A \to \hat{A}$ | Polarization (principal khi là isomorphism) | 02 |
| $J = \text{Jac}(C)$ | Jacobian của genus-2 curve $C$ | 04 |
| $\Theta$ | Theta divisor trong $J$ | 04 |
| $(u, v)$ | Mumford representation của divisor class | 05 |
| $\delta$ | Determinant trong Richelot construction | 07 |
| $G_1, G_2, G_3$ | Quadratic factors $f = G_1 G_2 G_3$ | 07 |
| $\iota: E_0 \to E_0$ | Non-scalar endomorphism degree 2 của $E_0$ | 09 |
| $\gamma: E_0 \to E_0$ | Endomorphism degree $3^{e_B}$, $\gamma = [u] + [2v] \cdot \iota$ | 09 |
| $K \subset A[N]$ | Kernel của $(N,N)$-isogeny, maximal isotropic | 06 |
| $\phi: E \to E_1$ | Isogeny degree $n_1 = 2^{e_A}$ (Alice) | 10 |
| $\psi: E \to E_2$ | Isogeny degree $n_2 = 3^{e_B}$ (Bob) | 10 |
| $\theta_{ab}$ | Theta constant với characteristic $(a,b)$ | A0 |

---

## Diagram Registry

| Lesson | File | Mô tả |
|--------|------|--------|
| 01 | `assets/img-01-abelian-variety-examples.html` | Split vs. Jacobian PPAS |
| 02 | `assets/img-02-polarization-map.html` | $A \to \hat{A}$ polarization |
| 04 | `assets/img-04-jacobian-construction.html` | Abel-Jacobi, divisor → Jacobian |
| 07 | `assets/img-07-richelot-diagram.html` | $(2,2)$-isogeny kernel structure |
| 08 | `assets/img-08-glue-split-cases.html` | Ba trường hợp glue/split |
| 10 | `assets/img-10-kani-diamond.html` | Kani diamond = SIDH square |
| 11 | `assets/img-11-attack-flow.html` | Attack digit-recovery loop |

> Diagrams HTML chưa được render — cần chạy `render.py` sau khi tạo từng file HTML.
