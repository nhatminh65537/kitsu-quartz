---
title: "A3. Galois Solvability Criterion"
tags: [math, galois-theory, appendix]
created: 2026-03-24
---

> Bài học liên quan: [[13-solvable-groups-radical-extensions|13. Solvable Groups và Radical Extensions]], [[14-insolvability-quintic|14. Insolvability of the Quintic]]

## Galois Solvability Criterion — Chứng minh Đầy đủ

> [!abstract] Theorem A3.1 — Galois Solvability Criterion
> Cho $f \in \mathbb{Q}[x]$ separable. Khi đó $f$ solvable by radicals khi và chỉ khi $\operatorname{Gal}(f)$ là solvable group.

Ta chứng minh cả hai chiều.

---

## Bổ đề cần thiết

**Lemma A3.2 (Kummer).** Cho $K$ field với $\operatorname{char}(K) = 0$ và $\zeta_n \in K$. Khi đó $L/K$ là cyclic Galois extension bậc $n$ khi và chỉ khi $L = K(\alpha)$ với $\alpha^n \in K$.

*Chứng minh ($\Leftarrow$).* Giả sử $L = K(\alpha)$, $a = \alpha^n \in K$. Mỗi $\sigma \in \operatorname{Gal}(L/K)$ gửi $\alpha \mapsto \zeta_n^{k(\sigma)}\alpha$. Map $\sigma \mapsto k(\sigma) \pmod{n}$ là homomorphism $\operatorname{Gal}(L/K) \hookrightarrow \mathbb{Z}/n\mathbb{Z}$. Injective, nên $\operatorname{Gal}(L/K)$ cyclic.

*Chứng minh ($\Rightarrow$).* Giả sử $\operatorname{Gal}(L/K) = \langle \sigma \rangle \cong \mathbb{Z}/n\mathbb{Z}$. Dùng **linear independence of characters** (Theorem Artin): $\mathrm{id} + \zeta_n^{-1}\sigma + \zeta_n^{-2}\sigma^2 + \cdots + \zeta_n^{-(n-1)}\sigma^{n-1} \neq 0$ như hàm trên $L$. Lấy $\beta \in L$ với $\alpha := \sum_{k=0}^{n-1} \zeta_n^{-k}\sigma^k(\beta) \neq 0$ (Lagrange resolvent). Tính $\sigma(\alpha) = \zeta_n\alpha$, nên $\sigma(\alpha^n) = (\sigma\alpha)^n = (\zeta_n\alpha)^n = \alpha^n$. Vậy $\alpha^n \in L^{\langle\sigma\rangle} = K$, và $L = K(\alpha)$. $\blacksquare$

**Lemma A3.3.** Nếu $K/F$ là abelian extension và $E/F$ là bất kỳ extension nào (trong $\bar{F}$), thì $KE/E$ là abelian extension.

*Chứng minh.* $\operatorname{Gal}(KE/E) \hookrightarrow \operatorname{Gal}(K/K \cap E)$ (restriction), là subgroup của abelian group $\operatorname{Gal}(K/F)$. Subgroup của abelian là abelian. $\blacksquare$

---

## Proof của ($\Leftarrow$): Solvable $\Rightarrow$ Solvable by Radicals

**Setup.** Cho $f \in \mathbb{Q}[x]$ separable với splitting field $K/\mathbb{Q}$ và $G = \operatorname{Gal}(K/\mathbb{Q})$ solvable.

Vì $G$ solvable, có dãy:
$$
\{e\} = G_r \trianglelefteq G_{r-1} \trianglelefteq \cdots \trianglelefteq G_1 \trianglelefteq G_0 = G
$$
với mỗi $G_{i-1}/G_i$ cyclic bậc nguyên tố $p_i$.

Đặt $m = \operatorname{lcm}(p_1, \ldots, p_r)$ và $E = \mathbb{Q}(\zeta_m)$ là $m$-th cyclotomic field.

**Bước 1: Lift lên $EK$.**
$EK/E$ là Galois (compositum của Galois extensions). $\operatorname{Gal}(EK/E) \hookrightarrow \operatorname{Gal}(K/\mathbb{Q}) = G$ (restriction), nên $\operatorname{Gal}(EK/E)$ là subgroup của $G$, do đó **solvable** (Theorem 13.7).

**Bước 2: Dãy subfields của $EK/E$.**
Đặt $F_0 = E$ và $F_i = EK^{G_i}$ (fixed field của $G_i$ trong $EK$). Từ FTGT:
$$
F_0 \subseteq F_1 \subseteq \cdots \subseteq F_r = EK
$$
với $\operatorname{Gal}(F_i/F_{i-1}) \cong G_{i-1}/G_i$ (cyclic bậc $p_i$).

**Bước 3: Mỗi $F_i/F_{i-1}$ là radical.**
$F_{i-1}$ chứa $\zeta_{p_i}$ (vì $F_{i-1} \supseteq E = \mathbb{Q}(\zeta_m)$ và $p_i \mid m$). $F_i/F_{i-1}$ là cyclic Galois bậc $p_i$ và $F_{i-1}$ chứa $\zeta_{p_i}$. Từ Lemma A3.2: $F_i = F_{i-1}(\beta_i)$ với $\beta_i^{p_i} \in F_{i-1}$.

Vậy $F_i/F_{i-1}$ là **simple radical extension**.

**Bước 4: $EK/\mathbb{Q}$ là radical.**
Tháp: $\mathbb{Q} \subseteq E \subseteq F_1 \subseteq \cdots \subseteq F_r = EK$, trong đó $E/\mathbb{Q}$ là cyclotomic (radical: $E = \mathbb{Q}(\zeta_m)$, và $\zeta_m^m = 1 \in \mathbb{Q}$), và mỗi $F_i/F_{i-1}$ radical. Vậy $EK/\mathbb{Q}$ là radical extension.

$K \subseteq EK$, nên $f$ splits trong radical extension $EK$. Vậy $f$ solvable by radicals. $\blacksquare$

---

## Proof của ($\Rightarrow$): Solvable by Radicals $\Rightarrow$ Solvable

**Setup.** Giả sử $f$ solvable by radicals: splitting field $K \subseteq L$ với $L = L_r \supseteq \cdots \supseteq L_0 = \mathbb{Q}$ và $L_i = L_{i-1}(\alpha_{i-1})$, $\alpha_{i-1}^{n_{i-1}} \in L_{i-1}$.

**Bước 1: Mở rộng thành Galois radical extension.**
Đặt $N$ là Galois closure của $L$ trên $\mathbb{Q}$ (lấy splitting field của tích tất cả minimal polynomials). $N$ là radical extension của $\mathbb{Q}$ (vì conjugates của $\alpha_i$ cũng là $n_i$-th roots, nên Galois closure của một radical extension vẫn là radical). Vậy có tháp $\mathbb{Q} = N_0 \subseteq N_1 \subseteq \cdots \subseteq N_s = N$ với $N_i = N_{i-1}(\beta_i)$, $\beta_i^{n_i} \in N_{i-1}$, và $N/\mathbb{Q}$ Galois.

**Bước 2: Thêm roots of unity.**
Đặt $m = \operatorname{lcm}(n_i)$ và $M = N(\zeta_m)$. $M/\mathbb{Q}$ Galois (Galois extension của Galois extension). Tháp:
$$
\mathbb{Q} \subseteq \mathbb{Q}(\zeta_m) \subseteq \mathbb{Q}(\zeta_m, \beta_1) \subseteq \cdots \subseteq M
$$
Mỗi $\mathbb{Q}(\zeta_m, \beta_1, \ldots, \beta_i)/\mathbb{Q}(\zeta_m, \beta_1, \ldots, \beta_{i-1})$ là cyclic (bởi Lemma A3.2, vì base field chứa roots of unity).

**Bước 3: $\operatorname{Gal}(M/\mathbb{Q})$ solvable.**
Tháp Galois cyclic tương ứng với dãy subgroups của $\operatorname{Gal}(M/\mathbb{Q})$ với cyclic factors. Vậy $\operatorname{Gal}(M/\mathbb{Q})$ solvable.

**Bước 4: $\operatorname{Gal}(f) = \operatorname{Gal}(K/\mathbb{Q})$ solvable.**
$K \subseteq N \subseteq M$. $\operatorname{Gal}(K/\mathbb{Q}) \cong \operatorname{Gal}(M/\mathbb{Q})/\operatorname{Gal}(M/K)$ là quotient của solvable group. Quotient của solvable là solvable (Theorem 13.7.2). $\blacksquare$

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorems 14.19–14.23.
- Milne, J. S. *Fields and Galois Theory*, §13. Có tại https://www.jmilne.org/math/CourseNotes/FT.pdf
- Goldmakher, L. *Galois Theory: Lecture 22*. Có tại https://web.williams.edu/Mathematics/lg5/394/LS22.pdf
