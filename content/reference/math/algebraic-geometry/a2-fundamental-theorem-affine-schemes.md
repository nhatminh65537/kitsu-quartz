---
title: "A2. Fundamental Theorem of Affine Schemes"
tags: [math, algebraic-geometry, appendix, affine-schemes, structure-sheaf]
aliases: [Fundamental Theorem of Affine Schemes]
created: 2026-03-31
---

> **Liên quan**: [[04-affine-schemes|04. Affine Schemes: Spec & Structure Sheaf]]
> **Mục đích**: Chứng minh $\mathcal{O}_{\operatorname{Spec}R}(\operatorname{Spec} R) \cong R$ và các tính chất cơ bản của structure sheaf.

---

## Bối cảnh

Định lý này là nền tảng của toàn bộ lý thuyết schemes: global sections của structure sheaf $\mathcal{O}_X$ trên affine scheme $X = \operatorname{Spec} R$ chính xác là $R$. Đây là cầu nối trực tiếp giữa algebra ($R$) và geometry ($X$).

---

## Cấu trúc của Structure Sheaf

Nhắc lại từ Lesson 04: với $X = \operatorname{Spec} R$ và $f \in R$, ta định nghĩa:

$$
\mathcal{O}_X(D(f)) := R_f = R[1/f].
$$

Với open set tổng quát $U = \bigcup_i D(f_i)$:

$$
\mathcal{O}_X(U) := \left\{ (s_i)_i \in \prod_i R_{f_i} \;\bigg|\; s_i|_{D(f_i f_j)} = s_j|_{D(f_i f_j)} \;\forall i,j \right\}.
$$

---

## Định lý chính

> [!theorem] Theorem A2.1 — Fundamental Theorem of Affine Schemes
> Cho $R$ là commutative ring (với 1) và $X = \operatorname{Spec} R$. Khi đó:
>
> 1. **Global sections**: $\mathcal{O}_X(X) \cong R$.
>
> 2. **Sections trên basic open**: $\mathcal{O}_X(D(f)) \cong R_f$ với mọi $f \in R$.
>
> 3. **Stalk tại prime**: $\mathcal{O}_{X,\mathfrak{p}} \cong R_\mathfrak{p}$ với mọi $\mathfrak{p} \in \operatorname{Spec} R$.
>
> 4. **$\mathcal{O}_X$ là sheaf**: Điều kiện identity và gluing đều thỏa trên $X$.

---

## Chứng minh

### Phần 1: $\mathcal{O}_X(D(f)) \cong R_f$

Đây là định nghĩa trực tiếp, nhưng cần kiểm tra $D(f) \cong \operatorname{Spec} R_f$:

Map $R_f \to \mathcal{O}_X(D(f))$ được định nghĩa tự nhiên; đây là isomorphism theo construction. $\blacksquare$

### Phần 2: $\mathcal{O}_X$ thỏa điều kiện sheaf trên basic opens

**Claim A2.2**: Nếu $D(f) = \bigcup_{i=1}^n D(g_i)$ (cover hữu hạn bởi basic opens) thì dãy

$$
0 \to R_f \to \prod_i R_{fg_i} \rightrightarrows \prod_{i,j} R_{fg_ig_j}
$$

là exact.

**Proof của Claim A2.2.**

*Step 1: Cover condition.*
$D(f) = \bigcup_i D(g_i)$ có nghĩa là $V(f) \supseteq V(g_1,\ldots,g_n)$, tức $\sqrt{(g_1,\ldots,g_n)} \supseteq \sqrt{(f)}$. Sau khi localize tại $f$, điều này có nghĩa $(g_1,\ldots,g_n)R_f = R_f$ (unit ideal), tức tồn tại $h_i \in R_f$ với $\sum h_i g_i = 1$ trong $R_f$.

*Step 2: Identity (injectivity).*
Giả sử $s \in R_f$ với $s|_{D(fg_i)} = 0$ trong $R_{fg_i}$ với mọi $i$. Tức là $s$ trở thành 0 sau khi localize tại $g_i$, có nghĩa $g_i^{N_i} s = 0$ trong $R_f$ với $N_i$ nào đó.

Vì $\sum h_i g_i = 1$, ta có $1 = \sum h_i g_i$ trong $R_f$, suy ra:

$$
1 = \left(\sum h_i g_i\right)^{N} = \sum_{|\alpha|=N} c_\alpha \prod g_i^{\alpha_i},
$$

với $N$ đủ lớn. Nhân với $s$:

$$
s = \sum c_\alpha \prod g_i^{\alpha_i} \cdot s.
$$

Với $N = \sum N_i$, mỗi term $\prod g_i^{\alpha_i} s = 0$ (vì $\alpha_i \geq N_i$ cho ít nhất một $i$). Vậy $s = 0$. ✓

*Step 3: Gluing (surjectivity).*
Cho $(s_i) \in \prod_i R_{fg_i}$ với $s_i|_{D(fg_ig_j)} = s_j|_{D(fg_ig_j)}$.

Vì $\sum h_i g_i = 1$ trong $R_f$, định nghĩa $s := \sum_i h_i s_i \in R_f$ (sau khi chọn $N$ phù hợp để xóa mẫu).

Kiểm tra $s|_{D(fg_j)} = s_j$: trong $R_{fg_j}$,

$$
s|_{fg_j} = \sum_i h_i (s_i|_{fg_j}) = \sum_i h_i (s_j|_{fg_j}) = s_j \cdot \underbrace{\sum_i h_i g_i}_{=1} = s_j.
$$

(Dòng thứ hai dùng $s_i = s_j$ trong $R_{fg_ig_j}$, và $h_i g_i$ trong $R_{fg_j}$ cộng lại thành 1.) ✓

$\blacksquare$ (Claim A2.2)

### Phần 3: $\mathcal{O}_X(X) \cong R$

$X = D(1)$ vì $1 \notin \mathfrak{p}$ với mọi prime $\mathfrak{p}$. Theo định nghĩa, $\mathcal{O}_X(D(1)) = R_1 = R$. $\blacksquare$

Cách khác, không dùng $D(1)$: Map tự nhiên $R \to \mathcal{O}_X(X)$ gửi $r$ về global section $r/1 \in R_\mathfrak{p}$ với mọi $\mathfrak{p}$.

- *Injective*: Nếu $r$ trở thành 0 trong mọi $R_\mathfrak{p}$, thì $\operatorname{Ann}(r) \not\subseteq \mathfrak{p}$ với mọi $\mathfrak{p}$, suy ra $\operatorname{Ann}(r) = R$, tức $r = 0$.

- *Surjective*: Một global section là họ $(s_\mathfrak{p}) \in \prod R_\mathfrak{p}$ tương thích. Phủ $X$ bởi $D(f_i)$ hữu hạn, và trên mỗi $D(f_i)$, section là $r_i/f_i^{N_i}$. Điều kiện tương thích trên giao $D(f_if_j)$ đảm bảo chúng ghép lại thành phần tử của $R$. $\blacksquare$

### Phần 4: Stalk tại $\mathfrak{p}$

$$
\mathcal{O}_{X,\mathfrak{p}} = \varinjlim_{f \notin \mathfrak{p}} \mathcal{O}_X(D(f)) = \varinjlim_{f \notin \mathfrak{p}} R_f = R_\mathfrak{p}.
$$

Đẳng thức cuối: $R_\mathfrak{p} = \{r/s \mid s \notin \mathfrak{p}\} = \varinjlim_{f \notin \mathfrak{p}} R_f$ (colimit directed trên hệ $f \notin \mathfrak{p}$, có $D(f) \ni \mathfrak{p}$). $\blacksquare$

---

## Hệ quả

> [!corollary] Corollary A2.3 — Anti-equivalence
> Functor $\Gamma : \mathbf{AffSch} \to \mathbf{CRing}^{op}$, $(X, \mathcal{O}_X) \mapsto \mathcal{O}_X(X)$ là quasi-inverse của $\operatorname{Spec}$. Suy ra:
>
> $$
> \mathbf{AffSch} \simeq \mathbf{CRing}^{op}.
> $$

> [!corollary] Corollary A2.4 — Morphisms via global sections
> Morphism $f : \operatorname{Spec} A \to \operatorname{Spec} B$ tương ứng duy nhất với ring hom $f^\# : B \to A$.

> [!note] Remark A2.5 — Tại sao định lý này không tầm thường?
> Một global section của $\mathcal{O}_X$ là một họ "elements locally defined" tương thích. Định lý nói rằng mọi global section thực ra là một element toàn cục của $R$. Điều này sai hoàn toàn với schemes không affine: $\Gamma(\mathbb{P}^n_k, \mathcal{O}) = k$ — các global sections chỉ là hằng số!

---

## Ví dụ kiểm tra

> [!example] Example A2.6
> Lấy $R = k[x]$, $X = \mathbb{A}^1_k = \operatorname{Spec} k[x]$.
>
> Cover $X$ bởi $D(x) = \operatorname{Spec} k[x,x^{-1}]$ và $D(x-1) = \operatorname{Spec} k[x,(x-1)^{-1}]$.
>
> Sections: $s_1 = g(x)/x^m \in k[x,x^{-1}]$, $s_2 = h(x)/(x-1)^n \in k[x,(x-1)^{-1}]$.
>
> Nếu $s_1 = s_2$ trên $D(x(x-1))$: họ này glue thành $f(x) \in k[x] = \mathcal{O}_X(X)$ bởi vì $k[x,x^{-1}] \cap k[x,(x-1)^{-1}] = k[x]$ trong $k(x)$.

---

## References

- Vakil, R. *The Rising Sea* (2024), §4.1–4.3.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §1, Proposition 1.2.
- Mumford, D. *The Red Book* (LNM 1358), Chapter II §1.
- Eisenbud & Harris. *The Geometry of Schemes*, Chapter I §2.
