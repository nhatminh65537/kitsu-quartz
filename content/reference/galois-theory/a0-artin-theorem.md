---
title: "A0. Artin's Theorem"
tags: [math, galois-theory, appendix]
created: 2026-03-24
---

> Bài học liên quan: [[06-galois-group-fixed-fields|06. Nhóm Galois và Fixed Fields]]

## Artin's Theorem

> [!abstract] Theorem A0.1 — Artin's Theorem
> Cho $L$ là field và $H = \{\sigma_1 = \mathrm{id}, \sigma_2, \ldots, \sigma_n\}$ là nhóm hữu hạn các automorphisms của $L$. Đặt $K = L^H$. Khi đó:
>
> 1. $[L:K] = |H| = n$.
> 2. $\operatorname{Aut}(L/K) = H$.
> 3. $L/K$ là Galois extension (normal và separable).

## Proof

Ta chứng minh theo ba bước.

**Bước 1: $[L:K] \leq n$.**

Ta cần chứng minh bất kỳ $n+1$ phần tử $\alpha_1, \ldots, \alpha_{n+1} \in L$ đều phụ thuộc tuyến tính trên $K$.

Xét hệ thuần nhất $n$ phương trình $n+1$ ẩn $(t_1, \ldots, t_{n+1})$ trong $L$:

$$
\sigma_i(\alpha_1) t_1 + \sigma_i(\alpha_2) t_2 + \cdots + \sigma_i(\alpha_{n+1}) t_{n+1} = 0, \quad i = 1, \ldots, n
$$

Hệ có $n+1$ ẩn và $n$ phương trình nên có nghiệm không tầm thường $(t_1, \ldots, t_{n+1}) \in L^{n+1}$.

Chọn nghiệm với **số thành phần khác không tối thiểu** $s \geq 1$. Sau khi đổi thứ tự, giả sử $t_1, \ldots, t_s \neq 0$ và $t_{s+1} = \cdots = t_{n+1} = 0$. Chia toàn bộ cho $t_s$, ta có thể giả sử $t_s = 1$.

Nếu $s = 1$: phương trình thứ nhất ($\sigma_1 = \mathrm{id}$) cho $\alpha_1 t_1 = 0$, vậy $t_1 = 0$, mâu thuẫn. Vậy $s \geq 2$.

Hệ cho $\sigma_1 = \mathrm{id}$:

$$
\alpha_1 t_1 + \cdots + \alpha_s = 0 \tag{*}
$$

Với $\sigma_j \in H$ bất kỳ, áp $\sigma_j$ vào $(*)$:

$$
\sigma_j(\alpha_1)\sigma_j(t_1) + \cdots + \sigma_j(\alpha_{s-1})\sigma_j(t_{s-1}) + \sigma_j(\alpha_s) = 0 \tag{**}
$$

Trừ $(*)$ của bộ automorphism $\sigma_j$ khỏi $(**)$: hệ ban đầu đánh chỉ số $i$ cho phương trình $\sigma_i$-th; xét $i = j$-th equation trong $(*)$ (dùng $\sigma_1 = \mathrm{id}$, sau đó nhân $\sigma_j$ vào):

$$
\sigma_j(\alpha_1)(\sigma_j(t_1) - t_1) + \cdots + \sigma_j(\alpha_{s-1})(\sigma_j(t_{s-1}) - t_{s-1}) = 0
$$

Đây là nghiệm với số thành phần khác không $< s$ (vì $t_s = 1 \Rightarrow \sigma_j(t_s) - t_s = 0$). Theo tính tối thiểu của $s$, nghiệm này là tầm thường: $\sigma_j(t_i) - t_i = 0$ với mọi $i < s$, tức $\sigma_j(t_i) = t_i$ với mọi $\sigma_j \in H$.

Vậy $t_i \in L^H = K$ với mọi $i = 1, \ldots, s-1$. Cùng với $t_s = 1 \in K$, phương trình $(*)$ trở thành:

$$
\alpha_1 t_1 + \cdots + \alpha_{s-1} t_{s-1} + \alpha_s = 0 \quad \text{với } t_1, \ldots, t_{s-1} \in K
$$

Đây là quan hệ phụ thuộc tuyến tính của $\alpha_1, \ldots, \alpha_s$ trên $K$. Vậy $[L:K] \leq n$.

**Bước 2: $[L:K] \geq n$.**

Ta cần chứng minh với mọi $\alpha \in L$, số $K$-embeddings $K(\alpha) \hookrightarrow \bar{K}$ đạt tối đa $[K(\alpha):K]$. Điều này tương đương với $\alpha$ separable over $K$.

Đặt $m_\alpha(x) = \prod_{\sigma \in H} (x - \sigma(\alpha)) \in L[x]$. Vì mọi $\tau \in H$ hoán vị tập $\{\sigma(\alpha) \mid \sigma \in H\}$ (do $\tau \circ H = H$), các hệ số của $m_\alpha$ bất biến qua $H$, nên $m_\alpha \in K[x]$.

$m_\alpha$ là đa thức trong $K[x]$ có $\alpha$ là nghiệm, nên $\operatorname{Irr}(\alpha, K) \mid m_\alpha$.

$m_\alpha$ là product của các nhân tử tuyến tính phân biệt (nếu $\sigma_i(\alpha) = \sigma_j(\alpha)$ với $i \neq j$, thì $\sigma_i^{-1}\sigma_j(\alpha) = \alpha$, tức $\sigma_i^{-1}\sigma_j$ cố định $\alpha$), nên $m_\alpha$ separable.

Vì divisor của đa thức separable là separable, $\operatorname{Irr}(\alpha, K)$ separable. Vậy $\alpha$ separable over $K$.

Từ Theorem 5.12: số $K$-embeddings của $K(\alpha) \hookrightarrow \bar{K}$ bằng đúng $[K(\alpha):K] = \deg \operatorname{Irr}(\alpha,K)$.

Bằng cách quy nạp theo tháp $K \subseteq K(\alpha_1) \subseteq \cdots \subseteq L$, số $K$-embeddings $L \hookrightarrow \bar{K}$ bằng $[L:K]$. Mỗi $\sigma_i \in H$ là một $K$-embedding $L \hookrightarrow \bar{K}$ (vì cố định $K$). Có $n$ phần tử phân biệt trong $H$. Vậy:

$$
n \leq \text{số $K$-embeddings} = [L:K] \leq n \quad \Rightarrow \quad [L:K] = n = |H|.
$$

**Bước 3: $\operatorname{Aut}(L/K) = H$ và $L/K$ là Galois.**

Từ Bước 1–2: $[L:K] = n$. Mọi $\sigma \in H$ là $K$-automorphism của $L$, nên $H \subseteq \operatorname{Aut}(L/K)$.

Từ Theorem 5.12 (separability): $|\operatorname{Aut}(L/K)| \leq [L:K] = n = |H|$.

Kết hợp: $\operatorname{Aut}(L/K) = H$.

Normality: từ argument trong Bước 2, mỗi $\operatorname{Irr}(\alpha, K)$ chia hết $m_\alpha = \prod_{\sigma \in H}(x - \sigma(\alpha))$. Do đó mọi nghiệm của $\operatorname{Irr}(\alpha, K)$ nằm trong $\{\sigma(\alpha) \mid \sigma \in H\} \subset L$. Vậy $L/K$ normal.

Separability đã chứng minh ở Bước 2. $\blacksquare$

## References

- Artin, E. *Galois Theory*, Notre Dame Mathematical Lectures 2 (1942), Theorem 14.
- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 14.14.
- Conrad, K. *The Galois Correspondence*, Theorem 5.2.
