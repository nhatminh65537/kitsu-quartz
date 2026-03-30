---
title: "Group Theory"
tags: [math, group-theory, index]
created: 2026-03-26
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-groups-and-subgroups|01. Groups and Subgroups]] — Tiên đề nhóm, nhóm Abel, tiêu chuẩn nhóm con, tính duy nhất của phần tử đơn vị và nghịch đảo.
- [[02-cyclic-groups|02. Cyclic Groups]] — Nhóm cyclic, bậc phần tử, định lý phân loại nhóm con cyclic, nhóm $\mathbb{Z}_n$ và $\mathbb{Z}$.
- [[03-permutation-groups|03. Permutation Groups]] — Cycle notation, phân tích thành chu trình rời nhau, tính chẵn lẻ, nhóm luân phiên $A_n$, định lý Cayley.
- [[04-cosets-and-lagrange|04. Cosets and Lagrange's Theorem]] — Coset trái/phải, phân hoạch $G$ bởi coset, chỉ số $[G:H]$, định lý Lagrange, Fermat nhỏ.
- [[05-normal-subgroups|05. Normal Subgroups and Quotient Groups]] — Nhóm con chuẩn tắc, nhóm thương $G/N$, commutator subgroup, abelianization.
- [[06-group-homomorphisms|06. Group Homomorphisms]] — Đồng cấu, kernel, image, ba định lý đẳng cấu, định lý tương ứng (Lattice Theorem).
- [[07-group-actions|07. Group Actions]] — Group action, orbit, stabilizer, Orbit-Stabilizer, phương trình lớp, $p$-nhóm, Burnside.
- [[08-sylow-theorems|08. Sylow Theorems]] — Ba định lý Sylow, $n_p \mid m$, $n_p \equiv 1 \pmod p$, phân loại nhóm bậc nhỏ.
- [[09-direct-and-semidirect-products|09. Direct and Semidirect Products]] — Tích trực tiếp, FTFAG, tích nửa trực tiếp, phân loại nhóm bậc $\leq 12$.
- [[10-composition-series|10. Composition Series and Solvable Groups]] — Chuỗi hợp thành, Jordan–Hölder, nhóm giải được, derived series, nhóm nilpotent.
- [[11-free-groups-and-presentations|11. Free Groups and Presentations]] — Nhóm tự do, tính chất phổ quát, biểu diễn $\langle S \mid R \rangle$, word problem.
- [[12-representation-theory|12. Introduction to Representation Theory]] — Biểu diễn nhóm, định lý Maschke, character, quan hệ trực giao, bảng character.
- [[13-galois-theory-preview|13. Applications: Galois Theory Preview]] — Nhóm Galois, định lý cơ bản Galois, $f$ giải được $\iff$ $\operatorname{Gal}(f)$ giải được, $S_5$ không giải được.

## Appendices

- [[a0-proof-of-lagrange-theorem|A0. Proof of Lagrange's Theorem]] — Chứng minh đầy đủ định lý Lagrange qua phân hoạch coset.
- [[a1-proof-of-sylow-theorems|A1. Proof of Sylow Theorems]] — Chứng minh ba định lý Sylow bằng group action.
- [[a2-proof-of-jordan-holder|A2. Proof of Jordan–Hölder Theorem]] — Chứng minh tính duy nhất nhân tử hợp thành bằng quy nạp và Diamond Theorem.
- [[a3-proof-of-maschke|A3. Proof of Maschke's Theorem]] — Chứng minh khả quy hoàn toàn bằng averaging trick.

---

_Cập nhật lần cuối: 2026-03-26 · **13/13 bài hoàn thành** · 4 appendices_

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $(G, \cdot)$ | Nhóm $G$ với phép toán $\cdot$ |
| $\|G\|$ | Bậc (order) của nhóm $G$ |
| $H \leq G$ | $H$ là nhóm con của $G$ |
| $H \trianglelefteq G$ | $H$ là nhóm con chuẩn tắc (normal subgroup) của $G$ |
| $G/H$ | Nhóm thương (quotient group) |
| $\langle g \rangle$ | Nhóm cyclic sinh bởi $g$ |
| $\operatorname{ord}(g)$ | Bậc của phần tử $g$ |
| $[G:H]$ | Chỉ số (index) của $H$ trong $G$ |
| $Z(G)$ | Tâm (center) của $G$ |
| $\mathbb{Z}_n$ | Nhóm thặng dư modulo $n$ |
| $C_G(x)$ | Centralizer của $x$ trong $G$ |
| $N_G(H)$ | Normalizer của $H$ trong $G$ |
| $\operatorname{Syl}_p(G)$ | Tập các $p$-nhóm Sylow của $G$ |
| $n_p$ | Số lượng $p$-nhóm Sylow |
| $[G,G] = G'$ | Commutator subgroup |
| $G^{(k)}$ | Đạo hàm thứ $k$ (derived series) |
| $F(S)$ | Nhóm tự do sinh bởi $S$ |
| $\langle S \mid R \rangle$ | Biểu diễn nhóm bằng generators và relations |
| $N \rtimes_\varphi H$ | Tích nửa trực tiếp (semidirect product) |
| $\rho : G \to \operatorname{GL}(V)$ | Biểu diễn nhóm |
| $\chi_\rho$ | Character của biểu diễn $\rho$ |
| $\operatorname{Gal}(K/F)$ | Nhóm Galois của extension $K/F$ |
| $\operatorname{sgn}(\sigma)$ | Dấu (sign) của hoán vị $\sigma$ |
