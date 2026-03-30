---
title: "A3. Proof of Maschke's Theorem"
tags: [math, group-theory, appendix]
created: 2026-03-26
---

> Bài học liên quan: [[12-representation-theory|12. Introduction to Representation Theory]]

## Định lý Maschke

> [!abstract] Theorem 12.4 — Định lý Maschke
> Nếu $G$ là nhóm hữu hạn và $\operatorname{char}(\mathbb{F}) \nmid |G|$, thì mọi biểu diễn hữu chiều $\rho : G \to \operatorname{GL}(V)$ là khả quy hoàn toàn.

## Proof

Ta chứng minh bổ đề cốt lõi: mọi không gian con bất biến đều có bổ sung bất biến.

**Bổ đề**: Cho $W \subseteq V$ là không gian con $G$-bất biến. Thì tồn tại $W' \subseteq V$ $G$-bất biến sao cho $V = W \oplus W'$.

**Chứng minh bổ đề:**

Bước 1 — Chọn bổ sung tùy ý. Vì $W$ là không gian con của $V$, tồn tại bổ sung tuyến tính $U$ (không nhất thiết bất biến): $V = W \oplus U$. Gọi $\pi_0 : V \to W$ là chiếu tuyến tính theo phân tích này, tức $\pi_0(w + u) = w$ với $w \in W$, $u \in U$.

Bước 2 — Trung bình hóa (averaging trick). Định nghĩa:

$$
\pi = \frac{1}{|G|} \sum_{g \in G} \rho(g) \circ \pi_0 \circ \rho(g)^{-1}
$$

Đây là ánh xạ tuyến tính $V \to V$. Ta kiểm tra ba tính chất:

**(a) $\pi$ là chiếu lên $W$**: Với mọi $v \in V$ và $g \in G$: $\pi_0(\rho(g)^{-1}v) \in W$ (vì $\pi_0$ chiếu lên $W$), nên $\rho(g)(\pi_0(\rho(g)^{-1}v)) \in W$ (vì $W$ bất biến). Vậy $\pi(v) \in W$.

Với $w \in W$ và bất kỳ $g$: $\rho(g)^{-1}w \in W$ (bất biến), nên $\pi_0(\rho(g)^{-1}w) = \rho(g)^{-1}w$, và $\rho(g)\pi_0(\rho(g)^{-1}w) = w$. Vậy $\pi(w) = \frac{1}{|G|}\sum_g w = w$. Tức $\pi^2 = \pi$ và $\operatorname{im}\pi = W$.

**(b) $\pi$ commute với mọi $\rho(h)$**: Với mọi $h \in G$:

$$
\rho(h) \circ \pi = \frac{1}{|G|} \sum_{g \in G} \rho(h)\rho(g)\pi_0\rho(g)^{-1} = \frac{1}{|G|} \sum_{g \in G} \rho(hg)\pi_0\rho(g)^{-1}
$$

Đổi biến $g' = hg$ (tổng vẫn qua mọi $g' \in G$):

$$
= \frac{1}{|G|} \sum_{g' \in G} \rho(g')\pi_0\rho(g'^{-1}h) = \frac{1}{|G|} \sum_{g' \in G} \rho(g')\pi_0\rho(g')^{-1}\rho(h) = \pi \circ \rho(h)
$$

**(c) Đặt $W' = \ker\pi$**. Vì $\pi$ commute với $\rho(h)$: nếu $v \in W'$ thì $\pi(\rho(h)v) = \rho(h)\pi(v) = \rho(h)\cdot 0 = 0$, nên $\rho(h)v \in W'$. Vậy $W'$ bất biến.

Vì $\pi$ là chiếu: $V = \operatorname{im}\pi \oplus \ker\pi = W \oplus W'$. $\blacksquare$

**Định lý Maschke từ bổ đề:** Áp dụng bổ đề lặp lại: từ $V = W_1 \oplus W_1'$, nếu $W_1$ chưa bất khả quy, áp dụng bổ đề cho $W_1$; tương tự với $W_1'$. Vì $\dim V$ hữu hạn, quá trình dừng và cho $V = V_1 \oplus V_2 \oplus \cdots \oplus V_k$ với mọi $V_i$ bất khả quy. $\blacksquare$

## Tại sao cần $\operatorname{char}(\mathbb{F}) \nmid |G|$?

Phép chia $\frac{1}{|G|}$ yêu cầu $|G| \neq 0$ trong $\mathbb{F}$, tức $\operatorname{char}(\mathbb{F}) \nmid |G|$.

**Phản ví dụ khi $\operatorname{char}(\mathbb{F}) = p = |G|$**: Xét $G = \mathbb{Z}_2$, $\mathbb{F} = \mathbb{F}_2$, $V = \mathbb{F}_2^2$ với $\rho(1)\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}x+y\\y\end{pmatrix}$. Không gian con $W = \langle \begin{pmatrix}1\\0\end{pmatrix} \rangle$ bất biến, nhưng không có bổ sung bất biến.

## References

- Serre, J.-P. *Linear Representations of Finite Groups*, §1.3.
- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 1 (§18.1).
