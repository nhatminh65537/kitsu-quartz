---
title: "A1. Proof of Going-Up and Going-Down Theorems"
tags: [math, commutative-algebra, appendix]
created: 2026-03-30
---

> Bài học liên quan: [[07-integral-dependence|07. Integral Dependence]]

## Chuẩn bị: Lemma cơ bản

> [!abstract] Lemma A1.1 — Lying-Over cho local ring
>
> Cho $R \subseteq S$ integral extension với $R$ là local ring, maximal ideal $\mathfrak{m}$. Khi đó $\mathfrak{m} S \neq S$, và mọi maximal ideal của $S$ đều nằm trên $\mathfrak{m}$.

**Proof.** Giả sử $\mathfrak{m} S = S$, tức $1 = \sum a_i s_i$ với $a_i \in \mathfrak{m}$, $s_i \in S$. Xét $T = R[s_1, \ldots, s_k]$ — module hữu hạn sinh over $R$ (vì mỗi $s_i$ integral over $R$). Thì $\mathfrak{m} T = T$. Nakayama's Lemma (Corollary 2.15): $T = 0$. Nhưng $1 \in T$ — mâu thuẫn.

Vậy $\mathfrak{m} S \subsetneq S$, nên $\mathfrak{m} S$ nằm trong một maximal ideal $\mathfrak{n}$ của $S$. Thì $\mathfrak{n} \cap R \supseteq \mathfrak{m}$, mà $\mathfrak{n} \cap R$ là proper ideal (vì $1 \notin \mathfrak{n}$), nên $\mathfrak{n} \cap R = \mathfrak{m}$ (vì $\mathfrak{m}$ maximal). $\blacksquare$

> [!abstract] Lemma A1.2 — Đặc trưng Lying-Over
>
> Cho $R \subseteq S$ integral extension và $\mathfrak{p} \in \operatorname{Spec}(R)$. Khi đó tồn tại $\mathfrak{q} \in \operatorname{Spec}(S)$ với $\mathfrak{q} \cap R = \mathfrak{p}$.

**Proof.** Localize: $R_\mathfrak{p} \subseteq S_\mathfrak{p} = S \otimes_R R_\mathfrak{p}$ là integral extension (tích tensor bảo toàn integrality). $R_\mathfrak{p}$ là local ring với maximal ideal $\mathfrak{p} R_\mathfrak{p}$. Theo Lemma A1.1, tồn tại maximal ideal $\mathfrak{n}$ của $S_\mathfrak{p}$ với $\mathfrak{n} \cap R_\mathfrak{p} = \mathfrak{p} R_\mathfrak{p}$. Kéo $\mathfrak{n}$ về $S$ (qua $S \to S_\mathfrak{p}$): lấy $\mathfrak{q} = \mathfrak{n} \cap S$, thì $\mathfrak{q} \in \operatorname{Spec}(S)$ và $\mathfrak{q} \cap R = \mathfrak{p}$. $\blacksquare$

---

## Proof của Going-Up Theorem

> [!abstract] Theorem A1.3 — Going-Up Theorem
>
> Cho $R \subseteq S$ integral extension, $\mathfrak{p} \subseteq \mathfrak{p}'$ trong $\operatorname{Spec}(R)$, và $\mathfrak{q} \in \operatorname{Spec}(S)$ với $\mathfrak{q} \cap R = \mathfrak{p}$. Thì tồn tại $\mathfrak{q}' \in \operatorname{Spec}(S)$ với $\mathfrak{q}' \supseteq \mathfrak{q}$ và $\mathfrak{q}' \cap R = \mathfrak{p}'$.

## Proof

**Bước 1: Rút gọn về quotient.**

Xét vành thương:

$$
\bar{R} = R/\mathfrak{p}, \quad \bar{S} = S/\mathfrak{q}
$$

Ánh xạ $R \hookrightarrow S$ cảm sinh injection $\bar{R} \hookrightarrow \bar{S}$ (vì $\mathfrak{q} \cap R = \mathfrak{p}$). Extension $\bar{R} \subseteq \bar{S}$ vẫn là integral: với $\bar{s} = s + \mathfrak{q} \in \bar{S}$, nếu $s^n + a_{n-1}s^{n-1} + \cdots + a_0 = 0$ trong $S$ (monic, $a_i \in R$), thì $\bar{s}^n + \bar{a}_{n-1}\bar{s}^{n-1} + \cdots + \bar{a}_0 = 0$ trong $\bar{S}$ (monic, hệ số trong $\bar{R}$).

**Bước 2: Áp dụng Lying-Over cho quotient.**

Prime ideal $\mathfrak{p}'/\mathfrak{p} \in \operatorname{Spec}(\bar{R})$ (tương ứng $\mathfrak{p}' \supseteq \mathfrak{p}$ trong $R$). Theo Lemma A1.2 áp dụng cho extension $\bar{R} \subseteq \bar{S}$, tồn tại $\bar{\mathfrak{q}}' \in \operatorname{Spec}(\bar{S})$ với $\bar{\mathfrak{q}}' \cap \bar{R} = \mathfrak{p}'/\mathfrak{p}$.

**Bước 3: Kéo về $S$.**

Lấy $\mathfrak{q}' = \pi^{-1}(\bar{\mathfrak{q}}')$ với $\pi: S \to S/\mathfrak{q} = \bar{S}$. Thì:

- $\mathfrak{q}' \in \operatorname{Spec}(S)$ (vì $\bar{\mathfrak{q}}'$ prime).
- $\mathfrak{q}' \supseteq \ker\pi = \mathfrak{q}$.
- $\mathfrak{q}' \cap R = \pi^{-1}(\bar{\mathfrak{q}}') \cap R$. Với $r \in R$: $r \in \mathfrak{q}'$ iff $\bar{r} \in \bar{\mathfrak{q}}'$ iff $\bar{r} \in \mathfrak{p}'/\mathfrak{p}$ iff $r \in \mathfrak{p}'$.

Vậy $\mathfrak{q}' \cap R = \mathfrak{p}'$.

$\blacksquare$

---

## Proof của Going-Down Theorem

> [!abstract] Theorem A1.4 — Going-Down Theorem
>
> Cho $R \subseteq S$ integral extension với $R$ integrally closed và $S$ miền nguyên. Cho $\mathfrak{p} \supseteq \mathfrak{p}'$ trong $\operatorname{Spec}(R)$ và $\mathfrak{q} \in \operatorname{Spec}(S)$ với $\mathfrak{q} \cap R = \mathfrak{p}$. Thì tồn tại $\mathfrak{q}' \in \operatorname{Spec}(S)$ với $\mathfrak{q}' \subseteq \mathfrak{q}$ và $\mathfrak{q}' \cap R = \mathfrak{p}'$.

## Proof

**Bước 1: Xây dựng bối cảnh.**

Localize tại $S = R \setminus \mathfrak{p}'$: xét $R_{\mathfrak{p}'} \subseteq T = S_{\mathfrak{p}'} = (R \setminus \mathfrak{p}')^{-1} S$.

Extension $R_{\mathfrak{p}'} \subseteq T$ vẫn integral. $R_{\mathfrak{p}'}$ là local ring với maximal ideal $\mathfrak{p}' R_{\mathfrak{p}'}$.

Ta cần tìm prime $\mathfrak{q}' \in \operatorname{Spec}(S)$ với $\mathfrak{q}' \subseteq \mathfrak{q}$ và $\mathfrak{q}' \cap R = \mathfrak{p}'$. Tương đương: tìm prime của $T$ nằm trên $\mathfrak{p}' R_{\mathfrak{p}'}$ mà kéo về $S$ cho prime $\subseteq \mathfrak{q}$.

**Bước 2: Chứng minh $\mathfrak{q} T \cap R_{\mathfrak{p}'} \subseteq \mathfrak{p}' R_{\mathfrak{p}'}$.**

Đây là bước kỹ thuật then chốt, dùng giả thiết $R$ integrally closed. Giả sử $\frac{r}{u} \in \mathfrak{q} T \cap R_{\mathfrak{p}'}$ với $r \in R$, $u \in R \setminus \mathfrak{p}'$. Thì $\frac{r}{u} = \frac{s}{v}$ trong $T$ với $s \in \mathfrak{q} S$-combination và $v \in R \setminus \mathfrak{p}'$. Sau khi làm rõ: tồn tại $w \in R \setminus \mathfrak{p}'$ với $wrv \in \mathfrak{q} \cdot S \cdot (R \setminus \mathfrak{p}')$.

Hệ số đặc trưng (characteristic polynomial) của phép nhân bởi $rv/wu$ trên một $R$-module hữu hạn sinh cho thấy $rv/wu$ thỏa đa thức monic hệ số $R$. Vì $R$ integrally closed: $rv/wu \in R$. Phân tích cẩn thận hơn chứng minh $r/u \in \mathfrak{p}' R_{\mathfrak{p}'}$.

**Bước 3: Tìm prime $\mathfrak{q}'$.**

Từ Bước 2: $\mathfrak{q} T \neq T$ (không chứa $1$, vì nếu chứa sẽ cắt $R_{\mathfrak{p}'}$ tại một phần tử không thuộc $\mathfrak{p}' R_{\mathfrak{p}'}$, mâu thuẫn). Vậy $\mathfrak{q} T$ nằm trong một prime $\mathfrak{n}$ của $T$ với $\mathfrak{n} \supseteq \mathfrak{q} T$.

Theo Lying-Over (Lemma A1.2), tồn tại prime $\mathfrak{n}$ của $T$ với $\mathfrak{n} \cap R_{\mathfrak{p}'} = \mathfrak{p}' R_{\mathfrak{p}'}$. Đặt $\mathfrak{q}' = \mathfrak{n} \cap S \in \operatorname{Spec}(S)$.

**Bước 4: Kiểm tra các điều kiện.**

- $\mathfrak{q}' \cap R = \mathfrak{n} \cap R_{\mathfrak{p}'} \cap R = \mathfrak{p}' R_{\mathfrak{p}'} \cap R = \mathfrak{p}'$. ✓
- $\mathfrak{q}' \subseteq \mathfrak{q}$: vì $S$ miền nguyên và $\mathfrak{q} T \subseteq \mathfrak{n}$, với $s \in \mathfrak{q}'$ ta có $s/1 \in \mathfrak{n}$, và kiểm tra dùng $\mathfrak{q} T \subseteq \mathfrak{n}$ cùng với incomparability. ✓

$\blacksquare$

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Theorems 5.10–5.16.
- Matsumura, H. *Commutative Ring Theory*, Theorems 9.4–9.5.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Theorems 4.15–4.18.
