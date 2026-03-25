---
title: "A1. Proof of FTGT"
tags: [math, galois-theory, appendix]
created: 2026-03-24
---

> Bài học liên quan: [[08-fundamental-theorem|08. Fundamental Theorem of Galois Theory]]

## Fundamental Theorem of Galois Theory — Chứng minh Đầy đủ

> [!abstract] Theorem A1.1 — FTGT
> Cho $L/K$ là Galois extension hữu hạn với $G = \operatorname{Gal}(L/K)$. Đặt $\mathcal{F}$ là tập các intermediate fields và $\mathcal{H}$ là tập các subgroups của $G$.
>
> Hai ánh xạ $\Phi: M \mapsto \operatorname{Gal}(L/M)$ và $\Gamma: H \mapsto L^H$ là bijections nghịch đảo nhau (order-reversing). Hơn nữa:
>
> (A) $\Gamma \circ \Phi = \mathrm{id}_\mathcal{F}$ và $\Phi \circ \Gamma = \mathrm{id}_\mathcal{H}$.
>
> (B) $[L:M] = |\operatorname{Gal}(L/M)|$ và $[M:K] = [G:\operatorname{Gal}(L/M)]$.
>
> (C) $M/K$ Galois $\iff$ $\operatorname{Gal}(L/M) \trianglelefteq G$, với $\operatorname{Gal}(M/K) \cong G/\operatorname{Gal}(L/M)$.

## Bổ đề chuẩn bị

**Bổ đề A1.2.** Với mọi intermediate field $M$ của $L/K$: $L/M$ là Galois extension.

*Chứng minh.* $L/K$ normal và $M \supseteq K$ $\Rightarrow$ $L/M$ normal (Bài 04, Example 4.10). $L/K$ separable và $M \supseteq K$ $\Rightarrow$ $L/M$ separable (minimal poly over $M$ chia hết minimal poly over $K$, và divisor của separable poly là separable). Vậy $L/M$ Galois. $\blacksquare$

## Proof của (A): Bijection

**Phần 1: $\Gamma(\Phi(M)) = M$**, tức $L^{\operatorname{Gal}(L/M)} = M$.

Từ Bổ đề A1.2, $L/M$ là Galois. Áp Artin's Theorem (A0): $[L:L^{\operatorname{Gal}(L/M)}] = |\operatorname{Gal}(L/M)| = [L:M]$ (dùng Galois condition: $|\operatorname{Gal}(L/M)| = [L:M]$).

Luôn có $M \subseteq L^{\operatorname{Gal}(L/M)}$ (vì mọi $\sigma \in \operatorname{Gal}(L/M)$ cố định $M$ theo định nghĩa). Nên $[L:M] \geq [L:L^{\operatorname{Gal}(L/M)}] = [L:M]$. Đẳng thức buộc $M = L^{\operatorname{Gal}(L/M)}$. $\blacksquare$

**Phần 2: $\Phi(\Gamma(H)) = H$**, tức $\operatorname{Gal}(L/L^H) = H$.

Trực tiếp từ Artin's Theorem (A0), phần (2): nếu $K = L^H$ thì $\operatorname{Aut}(L/K) = H$, tức $\operatorname{Gal}(L/L^H) = H$. $\blacksquare$

## Proof của (B): Degree và Index

$[L:M] = |\operatorname{Gal}(L/M)|$: từ $L/M$ Galois (Bổ đề A1.2) và định nghĩa Galois extension.

$[M:K] = [G:\operatorname{Gal}(L/M)]$: từ Tower Law

$$[L:K] = [L:M] \cdot [M:K]$$

và $|G| = [L:K]$ (vì $L/K$ Galois), $[L:M] = |\operatorname{Gal}(L/M)|$:

$$[M:K] = \frac{[L:K]}{[L:M]} = \frac{|G|}{|\operatorname{Gal}(L/M)|} = [G:\operatorname{Gal}(L/M)]. \quad \blacksquare$$

## Proof của (C): Normality Correspondence

**Lemma A1.3.** Với $\sigma \in G$ và intermediate field $M$: $\operatorname{Gal}(L/\sigma(M)) = \sigma\, \operatorname{Gal}(L/M)\, \sigma^{-1}$.

*Chứng minh.* $\tau \in \operatorname{Gal}(L/\sigma(M))$ $\iff$ $\tau(\sigma(m)) = \sigma(m)$ $\forall m \in M$ $\iff$ $\sigma^{-1}\tau\sigma(m) = m$ $\forall m \in M$ $\iff$ $\sigma^{-1}\tau\sigma \in \operatorname{Gal}(L/M)$ $\iff$ $\tau \in \sigma \operatorname{Gal}(L/M)\sigma^{-1}$. $\blacksquare$

**$(\Rightarrow)$:** Giả sử $M/K$ Galois. Cần chứng minh $H := \operatorname{Gal}(L/M) \trianglelefteq G$.

Với $\sigma \in G$: từ Lemma A1.3, $\sigma H \sigma^{-1} = \operatorname{Gal}(L/\sigma(M))$.

Vì $M/K$ Galois (đặc biệt normal), mọi $K$-automorphism của $L$ gửi $M$ về $M$: $\sigma(M) = M$ (Theorem 4.6, đặc trưng (3)). Vậy $\sigma H \sigma^{-1} = \operatorname{Gal}(L/M) = H$. $\blacksquare$

**$(\Leftarrow)$:** Giả sử $H \trianglelefteq G$. Đặt $M = L^H$. Cần chứng minh $M/K$ Galois.

Với $\sigma \in G$: $\sigma H \sigma^{-1} = H$ (vì $H$ normal). Từ Lemma A1.3: $\operatorname{Gal}(L/\sigma(M)) = \sigma H \sigma^{-1} = H$. Từ phần (A): $\sigma(M) = L^H = M$.

Vậy mọi $K$-automorphism của $L$ gửi $M$ về $M$, nên $\sigma|_M$ là automorphism của $M/K$. Điều này là điều kiện (3) trong Theorem 4.6, vậy $M/K$ normal.

$M/K$ separable: mọi $\alpha \in M \subseteq L$ separable over $K$ (vì $L/K$ separable). $\blacksquare$

**Isomorphism $\operatorname{Gal}(M/K) \cong G/H$:**

Xét restriction map $\rho: G \to \operatorname{Aut}(M/K)$, $\sigma \mapsto \sigma|_M$.

$\rho$ là well-defined (vì $\sigma(M) = M$ từ trên) và homomorphism nhóm.

$\ker\rho = \{\sigma \in G \mid \sigma|_M = \mathrm{id}_M\} = \operatorname{Gal}(L/M) = H$.

$\rho$ surjective: với $\phi \in \operatorname{Gal}(M/K)$, mở rộng $\phi: M \to M$ lên $L$ (tồn tại vì $L/M$ Galois) cho $\sigma \in G$ với $\sigma|_M = \phi$.

Từ First Isomorphism Theorem: $G/H \cong \operatorname{Im}(\rho) = \operatorname{Gal}(M/K)$. $\blacksquare$

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 14.5 and §14.2.
- Conrad, K. *The Galois Correspondence*, Theorem 5.8 and §6.
- Milne, J. S. *Fields and Galois Theory*, Theorem 3.16.
