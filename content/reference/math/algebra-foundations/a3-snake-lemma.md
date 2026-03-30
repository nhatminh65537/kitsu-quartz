---
title: "A3. Snake Lemma"
tags: [math, algebra-foundations, appendix]
created: 2026-03-28
---

> Bài học liên quan: [[13-homological-algebra|13. Introduction to Homological Algebra]]

---

## Snake Lemma

> [!theorem] Theorem A3.1 — Snake Lemma
> Cho diagram giao hoán của $R$-modules với các hàng exact:
>
> $$
> \begin{aligned}
> &A \xrightarrow{f} B \xrightarrow{g} C \to 0 \\
> &\downarrow^{\alpha} \quad\; \downarrow^{\beta} \quad\; \downarrow^{\gamma} \\
> &0 \to A' \xrightarrow{f'} B' \xrightarrow{g'} C'
> \end{aligned}
> $$
>
> Khi đó có exact sequence tự nhiên:
>
> $$
> \ker \alpha \xrightarrow{\bar{f}} \ker \beta \xrightarrow{\bar{g}} \ker \gamma \xrightarrow{\;\delta\;} \operatorname{coker} \alpha \xrightarrow{\bar{f}'} \operatorname{coker} \beta \xrightarrow{\bar{g}'} \operatorname{coker} \gamma
> $$
>
> trong đó $\bar{f}, \bar{g}$ là các map cảm sinh từ $f, g$; $\bar{f}', \bar{g}'$ cảm sinh từ $f', g'$; và $\delta$ là **connecting homomorphism**.

---

## Proof

### Bước 1: Định nghĩa connecting homomorphism $\delta$

Cho $c \in \ker \gamma$. Ta xây dựng $\delta(c) \in \operatorname{coker} \alpha = A'/\operatorname{Im} \alpha$ theo các bước:

1. Vì $g : B \to C$ toàn ánh, chọn $b \in B$ với $g(b) = c$.
2. Tính $\beta(b) \in B'$. Vì $g'(\beta(b)) = \gamma(g(b)) = \gamma(c) = 0$ (diagram giao hoán), ta có $\beta(b) \in \ker g' = \operatorname{Im} f'$.
3. Vì $f' : A' \to B'$ đơn ánh, tồn tại duy nhất $a' \in A'$ với $f'(a') = \beta(b)$.
4. Đặt $\delta(c) = a' + \operatorname{Im} \alpha \in \operatorname{coker} \alpha$.

**$\delta$ well-defined:** Nếu chọn $b_1, b_2 \in B$ đều có $g(b_1) = g(b_2) = c$, thì $g(b_1 - b_2) = 0$, nên $b_1 - b_2 \in \ker g = \operatorname{Im} f$. Viết $b_1 - b_2 = f(a)$ với $a \in A$. Khi đó:

$$
\beta(b_1) - \beta(b_2) = \beta(f(a)) = f'(\alpha(a)) \in \operatorname{Im}(f' \circ \alpha) = f'(\operatorname{Im} \alpha)
$$

Vậy $a'$ tương ứng với $b_1$ và $b_2$ chênh nhau bởi phần tử trong $\operatorname{Im} \alpha$, tức $\delta(c)$ trong $\operatorname{coker} \alpha$ không phụ thuộc vào chọn $b$. $\square$

**$\delta$ là $R$-linear:** Thẳng từ tính tuyến tính của mọi map trong diagram. $\square$

### Bước 2: Exactness tại $\ker \beta$

*$\operatorname{Im} \bar{f} \subseteq \ker \bar{g}$:* $\bar{g} \circ \bar{f} = \overline{g \circ f} = 0$.

*$\ker \bar{g} \subseteq \operatorname{Im} \bar{f}$:* Cho $b \in \ker\beta$ với $g(b) = 0$. Exactness tại $B$: $b \in \ker g = \operatorname{Im} f$, viết $b = f(a)$. Thì $f'(\alpha(a)) = \beta(f(a)) = \beta(b) = 0$, và $f'$ đơn ánh nên $\alpha(a) = 0$, tức $a \in \ker\alpha$. Vậy $b = f(a) = \bar{f}(a)$ với $a \in \ker\alpha$. $\square$

### Bước 3: Exactness tại $\ker \gamma$

*$\operatorname{Im} \bar{g} \subseteq \ker \delta$:* Cho $c = g(b)$ với $b \in \ker\beta$. Trong bước xây dựng $\delta$: $\beta(b) = 0$, nên $a' = 0$, tức $\delta(c) = 0$.

*$\ker \delta \subseteq \operatorname{Im} \bar{g}$:* Cho $c \in \ker\gamma$ với $\delta(c) = 0$, tức $a' \in \operatorname{Im}\alpha$. Viết $a' = \alpha(a)$ với $a \in A$. Đặt $b_1 = b - f(a)$ (với $b$ từ bước 1). Thì $g(b_1) = g(b) - g(f(a)) = c - 0 = c$, và $\beta(b_1) = \beta(b) - \beta(f(a)) = f'(a') - f'(\alpha(a)) = 0$. Vậy $b_1 \in \ker\beta$ và $\bar{g}(b_1) = c$. $\square$

### Bước 4: Exactness tại $\operatorname{coker} \alpha$

*$\operatorname{Im} \delta \subseteq \ker \bar{f}'$:* Cho $\delta(c) = a' + \operatorname{Im}\alpha$. Thì $\bar{f}'(a' + \operatorname{Im}\alpha) = f'(a') + \operatorname{Im}\beta = \beta(b) + \operatorname{Im}\beta = \operatorname{Im}\beta = 0$ trong $\operatorname{coker}\beta$. $\square$

*$\ker \bar{f}' \subseteq \operatorname{Im} \delta$:* Cho $a' \in A'$ với $f'(a') \in \operatorname{Im}\beta$, viết $f'(a') = \beta(b)$ với $b \in B$. Đặt $c = g(b) \in C$. Thì $\gamma(c) = \gamma(g(b)) = g'(\beta(b)) = g'(f'(a')) = 0$, nên $c \in \ker\gamma$. Và $\delta(c) = a' + \operatorname{Im}\alpha$. $\square$

### Bước 5: Exactness tại $\operatorname{coker} \beta$ và $\operatorname{coker} \gamma$

Đây là diagram chase thuần túy, tương tự các bước trên (dùng exactness hàng dưới và tính toàn ánh của $g$). $\blacksquare$

---

## Nhận xét

Tên "Snake Lemma" xuất phát từ hình dạng của "con rắn" nếu ta vẽ connecting homomorphism $\delta$ đi từ góc phải trên ($\ker\gamma$) sang góc trái dưới ($\operatorname{coker}\alpha$) qua diagram.

Trong phim *It's My Turn* (1980), có cảnh diễn viên viết proof đầy đủ Snake Lemma trên bảng đen — đây là một trong số ít lần toán học graduate-level xuất hiện chính xác trên màn ảnh.

---

## References

- Weibel, C. A. *An Introduction to Homological Algebra*, Lemma 1.3.2.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter XX, Theorem 5.10.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Theorem 10.9.
