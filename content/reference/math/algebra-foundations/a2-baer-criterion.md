---
title: "A2. Baer's Criterion"
tags: [math, algebra-foundations, appendix]
created: 2026-03-28
---

> Bài học liên quan: [[11-projective-injective-flat|11. Projective, Injective, and Flat Modules]]

---

## Baer's Criterion

> [!theorem] Theorem A2.1 — Baer's Criterion
> $R$-module $Q$ là injective $\iff$ với mọi ideal $I \trianglelefteq R$ và mọi $R$-linear $f : I \to Q$, tồn tại $h : R \to Q$ sao cho $h|_I = f$:
>
> $$
> h(r) = r \cdot h(1), \qquad h(a) = f(a) \text{ với mọi } a \in I
> $$

---

## Proof

### ($\Rightarrow$) Injective $\Rightarrow$ Baer's Condition

Nếu $Q$ injective, áp dụng định nghĩa với monomorphism $\iota : I \hookrightarrow R$ (inclusion) và $f : I \to Q$: tồn tại $h : R \to Q$ với $h \circ \iota = f$, tức $h|_I = f$. $\square$

### ($\Leftarrow$) Baer's Condition $\Rightarrow$ Injective

Đây là chiều khó hơn. Cho monomorphism $\iota : L \hookrightarrow M$ và $g : L \to Q$. Cần tìm $h : M \to Q$ với $h \circ \iota = g$.

**Bước 1: Dùng Zorn's Lemma.**

Xét tập $\mathcal{P}$ gồm các cặp $(N, h_N)$ với:

- $L \subseteq N \subseteq M$ ($N$ là submodule chứa $L$, với $L$ được đồng nhất với $\iota(L)$).
- $h_N : N \to Q$ là $R$-linear.
- $h_N|_L = g$.

Định nghĩa thứ tự: $(N, h_N) \leq (N', h_{N'})$ nếu $N \subseteq N'$ và $h_{N'}|_N = h_N$.

$\mathcal{P} \neq \emptyset$ vì $(L, g) \in \mathcal{P}$.

Mọi chain trong $\mathcal{P}$ có upper bound: nếu $(N_\alpha, h_\alpha)$ là chain, đặt $N = \bigcup N_\alpha$ và $h(n) = h_\alpha(n)$ khi $n \in N_\alpha$ (well-defined vì chain nhất quán). Thì $(N, h) \in \mathcal{P}$.

Theo Zorn's Lemma, $\mathcal{P}$ có phần tử cực đại $(N^*, h^*)$.

**Bước 2: Chứng minh $N^* = M$.**

Giả sử $N^* \subsetneq M$: tồn tại $m \in M \setminus N^*$.

Xét ideal $I = \{r \in R \mid rm \in N^*\} \trianglelefteq R$ (annihilator của $m$ modulo $N^*$).

Định nghĩa $f : I \to Q$ bởi $f(r) = h^*(rm)$. Đây là $R$-linear và well-defined.

Theo giả thiết Baer, tồn tại $h_0 : R \to Q$ với $h_0|_I = f$. Tức $h_0(r) = rq_0$ với $q_0 = h_0(1) \in Q$, và $rq_0 = h^*(rm)$ với mọi $r \in I$.

Định nghĩa $N' = N^* + Rm$ và mở rộng $h^*$ sang $h' : N' \to Q$:

$$
h'(n^* + rm) = h^*(n^*) + rq_0 \quad (n^* \in N^*, r \in R)
$$

**Kiểm tra well-defined:** Nếu $n_1^* + r_1 m = n_2^* + r_2 m$, thì $(r_1 - r_2)m = n_2^* - n_1^* \in N^*$, nên $r_1 - r_2 \in I$. Vậy:

$$
h^*(n_1^*) + r_1 q_0 - h^*(n_2^*) - r_2 q_0 = h^*(n_1^* - n_2^*) + (r_1-r_2)q_0
$$

$$
= h^*((r_2-r_1)m) + (r_1-r_2)q_0 = -(r_1-r_2)q_0 + (r_1-r_2)q_0 = 0
$$

Kiểm tra $R$-linearity: routine.

Vậy $(N', h') \in \mathcal{P}$ và $(N^*, h^*) < (N', h')$ — mâu thuẫn với tính cực đại của $(N^*, h^*)$.

Vậy $N^* = M$, và $h^* : M \to Q$ là extension cần tìm. $\blacksquare$

---

## Nhận xét về Proof

Proof dùng Zorn's Lemma theo cách điển hình của Algebra: xây dựng extension từng bước, dùng Zorn để chọn extension "lớn nhất", và phân tích tại sao extension cực đại phải là toàn bộ $M$.

Bước khó nhất là kiểm tra well-defined của $h'$, đòi hỏi tính chính xác của điều kiện Baer để kiểm soát sự mở rộng tại phần tử $m$ mới thêm vào.

---

## References

- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Theorem 7.13.
- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Proposition 10.36.
- Weibel, C. A. *An Introduction to Homological Algebra*, Proposition 2.3.1.
