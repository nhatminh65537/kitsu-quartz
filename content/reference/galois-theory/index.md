---
title: "Galois Theory"
tags: [math, galois-theory, index]
created: 2026-03-24
---

## Roadmap

- [[00-roadmap|00. Roadmap]] — Toàn bộ lộ trình học 17 bài, 5 module, dependency graph.

---

## Lessons

- [[01-rings-ideals-polynomial-rings|01. Rings, Ideals và Polynomial Rings]] — Ring và ideal, quotient ring $R/I$, polynomial ring $F[x]$, tính bất khả quy, tiêu chuẩn Eisenstein, hệ thống phân cấp ED/PID/UFD.
- [[02-field-extensions|02. Field Extensions]] — Field extension $L/K$, degree $[L:K]$, phần tử đại số & siêu việt, minimal polynomial, đẳng cấu $K(\alpha) \cong K[x]/(p)$, Tower Law.
- [[03-splitting-fields|03. Splitting Fields và Algebraic Closure]] — Splitting field (trường phân rã): tồn tại, duy nhất up to isomorphism, degree $\leq n!$. Algebraically closed field, algebraic closure $\bar{K}$, vai trò Zorn's Lemma.
- [[04-normal-extensions|04. Normal Extensions]] — Normal extension: ba đặc trưng tương đương (normal $\iff$ splitting field $\iff$ mọi $K$-embedding là automorphism). Counterexample $\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$. Normal closure $\tilde{L}$.
- [[05-separable-extensions|05. Separable Extensions]] — Formal derivative, tiêu chuẩn nghiệm bội ($\gcd(f,f')=1$), separable polynomial và extension. Perfect fields ($\mathbb{Q}$, $\mathbb{F}_q$). Inseparability ở char $p$: $f = g(x^p)$. Galois = normal + separable.
- [[06-galois-group-fixed-fields|06. Nhóm Galois và Fixed Fields]] — $K$-automorphism, $\operatorname{Aut}(L/K)$, fixed field $L^H$, hai ánh xạ đối lập $\Phi/\Gamma$. **Artin's Theorem**: $[L:L^H] = |H|$. Tính $G$ cho $\mathbb{Q}(\sqrt{2},\sqrt{3})$ (Klein 4), $x^3-2$ splitting field ($S_3$).
- [[07-galois-extensions|07. Galois Extensions]] — Bốn đặc trưng tương đương: normal+separable, $|G|=[L:K]$, fixed field $= K$, splitting field of separable. Primitive Element Theorem. Galois $\hookrightarrow S_n$ transitive. Bảng phân loại.
- [[08-fundamental-theorem|08. Fundamental Theorem of Galois Theory]] — **Bijection order-reversing** giữa intermediate fields và subgroups của $G$. Công thức degree/index. Normal subgroup $\leftrightarrow$ Galois intermediate extension, $\operatorname{Gal}(M/K) \cong G/H$. Ví dụ $V_4$ và $S_3$ đầy đủ.
- [[09-cyclotomic-extensions|09. Cyclotomic Extensions]] — Roots of unity $\mu_n$, cyclotomic polynomial $\Phi_n \in \mathbb{Z}[x]$, phân tích $x^n - 1 = \prod_{d|n} \Phi_d$. **$\Phi_n$ irreducible over $\mathbb{Q}$**. $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$. Kronecker-Weber.
- [[10-finite-fields-frobenius|10. Finite Fields và Frobenius]] — $\mathbb{F}_{p^n}$ là splitting field của $x^{p^n}-x$, tồn tại duy nhất. **Frobenius** $\varphi: x\mapsto x^p$ generate $\operatorname{Gal} \cong \mathbb{Z}/n\mathbb{Z}$. Subfields $\leftrightarrow$ divisors của $n$. Frobenius orbit = nghiệm của minimal poly.
- [[11-constructible-numbers|11. Constructible Numbers]] — Constructible $\alpha$ $\Rightarrow$ $[\mathbb{Q}(\alpha):\mathbb{Q}] = 2^k$. Ba bài toán bất khả thi: doubling cube ($\sqrt[3]{2}$ degree 3), trisecting $60°$ ($\cos 20°$ degree 3), squaring circle ($\pi$ transcendental). **Gauss-Wantzel**: regular $n$-gon $\iff$ $n = 2^k \prod F_i$ (Fermat primes).
- [[12-galois-groups-polynomials|12. Galois Groups của Polynomials]] — Discriminant $\Delta$ và $G \subseteq A_n$. Cubic: $A_3$ vs $S_3$ qua $\Delta$. Quartic: phân loại $V_4, \mathbb{Z}/4, D_4, A_4, S_4$ qua discriminant + resolvent cubic. Reduction mod $p$ cho cycle types.
- [[13-solvable-groups-radical-extensions|13. Solvable Groups và Radical Extensions]] — Derived series, commutator subgroup. Solvable group: đặc trưng, tính chất đóng. $A_5$ not solvable, $S_n$ not solvable ($n\geq5$). Radical extension, Kummer: cyclic $\iff$ adjoin $n$-th root. **Galois Solvability Criterion**: solvable by radicals $\iff$ $\operatorname{Gal}(f)$ solvable.
- [[14-insolvability-quintic|14. Insolvability of the Quintic]] — $A_5$ simple (proof bằng conjugacy classes). $S_5$ not solvable. Tiêu chuẩn $S_p$: irreducible bậc $p$ + 2 nghiệm phức → $\operatorname{Gal}=S_p$. **$x^5-6x+3$** không giải được. Abel-Ruffini Theorem.
- [[15-kummer-theory|15. Kummer Theory]] — **Hilbert's Theorem 90**: $\operatorname{N}(\alpha)=1 \iff \alpha=\sigma(\beta)/\beta$. Kummer correspondence: $\Delta \subseteq K^\times/(K^\times)^n \leftrightarrow$ abelian extensions of exponent $n$. Kummer pairing và Pontryagin duality $\operatorname{Gal}(L/K) \cong \widehat{\Delta}$. Artin-Schreier (char $p$).
- [[16-infinite-galois-extensions|16. Infinite Galois Extensions]] — **Krull topology**: $G$ là profinite group $= \varprojlim \operatorname{Gal}(F/K)$. **Krull's Theorem**: bijection với **closed subgroups**. $\operatorname{Gal}(\bar{\mathbb{F}}_p/\mathbb{F}_p) \cong \hat{\mathbb{Z}}$. Absolute Galois group $G_\mathbb{Q}$ — bài toán mở.
- [[17-research-connections|17. Research Connections]] — **Kronecker-Weber**: abelian extensions of $\mathbb{Q} \subseteq \mathbb{Q}(\zeta_n)$. Conductor. **Class Field Theory**: tổng quát cho number fields tùy ý, idèle groups. **Inverse Galois Problem**: mọi finite group là Galois group over $\mathbb{Q}$? Langlands Program. Crypto (ECC, pairing, isogeny, lattice).

---

## Appendices

- [[a0-artin-theorem|A0. Artin's Theorem]] — Chứng minh đầy đủ: $[L:L^H] = |H|$, $\operatorname{Aut}(L/L^H) = H$, $L/L^H$ là Galois extension.
- [[a1-proof-ftgt|A1. Proof of FTGT]] — Chứng minh đầy đủ: bijection, công thức degree, normality correspondence và isomorphism $G/H \cong \operatorname{Gal}(M/K)$.
- [[a2-primitive-element|A2. Primitive Element Theorem]] — Proof cho $K$ vô hạn (chọn $c$ tránh hữu hạn giá trị) và $K$ hữu hạn ($L^\times$ cyclic). Hệ quả cho Galois extensions.
- [[a3-galois-solvability|A3. Galois Solvability Criterion]] — Chứng minh đầy đủ cả hai chiều, dùng Kummer theory và Galois closure.

---

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $R, S$ | Ring |
| $I \trianglelefteq R$ | $I$ là ideal của $R$ |
| $R/I$ | Quotient ring |
| $F[x]$ | Polynomial ring trên field $F$ |
| $(p(x))$ | Ideal sinh bởi $p(x)$ trong $F[x]$ |
| $L/K$ | Field extension, $K \subseteq L$ |
| $[L:K]$ | Degree (bậc) của extension |
| $\operatorname{Irr}(\alpha, K)$ | Minimal polynomial của $\alpha$ trên $K$ |
| $K(\alpha)$ | Simple extension của $K$ bởi $\alpha$ |
| $K(\alpha_1, \ldots, \alpha_n)$ | Extension bởi nhiều phần tử |
| $\bar{K}$ | Algebraic closure của $K$ |
| $\operatorname{Aut}(L/K)$ | Nhóm các $K$-automorphism của $L$ |
| $\operatorname{Gal}(L/K)$ | Galois group của extension $L/K$ |
| $L^H$ | Fixed field của subgroup $H$ |
| $\mathbb{F}_{p^n}$ | Finite field có $p^n$ phần tử |
| $\zeta_n$ | Primitive $n$-th root of unity |
| $\Phi_n(x)$ | Cyclotomic polynomial bậc $n$ |
| $\mu_n$ | Nhóm các $n$-th roots of unity |
| $S_n, A_n$ | Symmetric group, alternating group |
