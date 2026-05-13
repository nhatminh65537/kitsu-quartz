---
title: "Index — Castryck-Decru Attack on SIDH"
type: index
tags: [crypto, isogeny, sidh, castryck-decru, index]
created: 2026-04-08
---

## Course Summary

Course này cover toàn bộ Castryck-Decru attack (EUROCRYPT 2023) phá SIDH/SIKE trong polynomial time. Mỗi lesson xây dựng trên các bài trước theo chuỗi: isogeny foundations → SIDH protocol → abelian surfaces → Kani's theorem → attack.

---

## Lesson Summaries

| # | Title | Tóm Tắt |
|---|-------|---------|
| 01 | Isogenies Review | Vélu formulas, dual isogeny, Weil pairing, isogeny chain — attack-relevant tools |
| 02 | Supersingular Curves | $j \in \mathbb{F}_{p^2}$, expander graph, SIKE parameters, starting curve $E_0$ |
| 03 | Endomorphism Rings | Quaternion algebra $B_{p,\infty}$, Deuring correspondence, endomorphism $\iota$ trên $E_0$ |
| 04 | SIDH Protocol | Commutative square, public key format, tại sao torsion images cần thiết |
| 05 | SIKE Parameters | Concrete parameters, action matrix $M_{\phi_A}$, two conditions of attack |
| 06 | Abelian Surfaces | Jacobian $J(C)$, split vs non-split, superspecial surfaces |
| 07 | Polarizations | Principal polarization, Weil pairing trên abelian surface, anti-isometry |
| 08 | Richelot Isogenies | $(2,2)$-isogenies, Richelot formulas, splitting criterion $\delta = 0$ |
| 09 | Kani's Theorem | Reducibility criterion: $F$ split $\Leftrightarrow$ $\psi \circ \gamma = \hat{\phi}_A$ trên $E_0[N]$ |
| 10 | Glue-and-Split Oracle | Intuition: mỗi bit test = một glue + Richelot chain + split check |
| 11 | Attack Full Description | Full formal: bit-by-bit recovery, kernel construction, correctness |
| 12 | Computing Gamma | $\gamma = [u] + 2i[v]$, smooth $N = 2^a + c$, evaluate $\gamma$ trên torsion points |
| 13 | Complexity Analysis | $\tilde{O}(\lambda^3)$ heuristic; $\epsilon_{\text{false}} \approx 10/p$; concrete timing |
| 14 | Generalizations | Maino-Martindale (subexponential arbitrary start), Robert (polynomial all cases) |
| 15 | CSIDH & SQISign Safety | Two conditions of attack; why no torsion images = no attack; safe design principles |
| A0 | Kani Proof | Chi tiết đầy đủ của Theorem 9.2 |
| A1 | Richelot Formulas | Explicit formulas cho $\hat{G}_i$, splitting condition |

---

## Global Notation Table

| Ký hiệu | Ý nghĩa | Defined in |
|---------|---------|------------|
| $E, E_0, E_A, E_B$ | Elliptic curves | L01 |
| $\phi, \phi_A, \phi_B$ | Isogenies | L01 |
| $\hat{\phi}$ | Dual isogeny | L01 |
| $\deg \phi$ | Degree của isogeny | L01 |
| $E[n]$ | $n$-torsion subgroup | L01 |
| $e_n$ | Weil pairing trên $E[n]$ | L01 |
| $\pi_p$ | Frobenius endomorphism | L01 |
| $j(E)$ | $j$-invariant | L02 |
| $\mathcal{G}_\ell(p)$ | Supersingular $\ell$-isogeny graph | L02 |
| $\text{End}(E)$ | Endomorphism ring | L03 |
| $B_{p,\infty}$ | Quaternion algebra ramified at $p, \infty$ | L03 |
| $\iota$ | Endomorphism $(x,y) \mapsto (-x,iy)$ trên $E_0$ | L03 |
| $P_A, Q_A, P_B, Q_B$ | Torsion bases | L04 |
| $s_A, s_B$ | Secret scalars | L04 |
| $R_B = \phi_A(P_B)$ | Torsion image trong pk Alice | L04 |
| $M_{\phi_A}$ | Action matrix trên $E_0[3^b]$ | L05 |
| $A, J(C)$ | Abelian surface, Jacobian | L06 |
| $\lambda : A \to \hat{A}$ | Polarization | L07 |
| $e_n^\lambda$ | Weil pairing từ polarization | L07 |
| $G \subset A[n]$ | Maximal isotropic subgroup | L07 |
| $(2,2)$-isogeny | Richelot isogeny | L08 |
| $\delta$ | Richelot splitting discriminant | L08 |
| $\gamma : E_0 \to C$ | Auxiliary isogeny trong attack | L09 |
| $N = 2^a + c$ | Smooth number trong Kani setup | L09 |
| $K = \{(x,-\gamma(x))\}$ | Anti-diagonal Kani kernel | L09 |
| $F : E_0 \times C \to ?$ | $(N,N)$-isogeny trong attack | L09 |
| $\kappa_i$ | Bit thứ $i$ của $s_A$ | L10-L11 |
| $\gamma = [u] + 2i[v]$ | Explicit endomorphism | L12 |
| $c = u^2 + 4v^2$ | Degree của $\gamma$ | L12 |

---

## Diagram Asset Registry

Tất cả diagrams trong course là Mermaid embedded — không có HTML/CSS assets riêng biệt.

| Lesson | Loại diagram | Mô tả |
|--------|-------------|-------|
| 04 | sequenceDiagram | SIDH key exchange protocol flow |
| 09 | graph TD | Isogeny diamond |
| 10 | graph TD | Glue-and-split oracle logic |
| 11 | graph TD | Bit recovery decision tree |
| 00 | graph TD | Full dependency graph |
