---
title: "A2. Proof of Open Mapping Theorem"
tags: [math, functional-analysis, appendix]
aliases: [Proof Open Mapping Theorem]
created: 2026-03-31
---

> **Liên quan**: [[05-open-mapping-closed-graph|05. Fundamental Theorems II — Open Mapping & Closed Graph]]

---

## Phát biểu

> [!theorem] Theorem A2.1 — Open Mapping Theorem (Banach)
> Cho $X$, $Y$ là không gian Banach và $T \in B(X, Y)$ là toàn ánh. Khi đó tồn tại $r > 0$ sao cho:
>
> $$
> B_Y(0, r) \subseteq T(B_X(0, 1))
> $$
>
> Đặc biệt, $T$ là ánh xạ mở: ảnh của mọi tập mở là tập mở.

---

## Bổ đề — Tập hình ảnh trù mật

> [!theorem] Lemma A2.2
> Cho $T$ như trên. Khi đó tồn tại $s > 0$ sao cho:
>
> $$
> B_Y(0, s) \subseteq \overline{T(B_X(0, 1))}
> $$

**Proof.** Vì $T$ toàn ánh: $Y = T(X) = \bigcup_{n=1}^\infty T(\overline{B}_X(0, n)) = \bigcup_{n=1}^\infty \overline{T(B_X(0, n))}$.

Theo BCT ($Y$ Banach nên đầy đủ), tồn tại $n_0$ và điểm $y_0 \in Y$, $\delta > 0$ sao cho:

$$
\overline{B}_Y(y_0, \delta) \subseteq \overline{T(B_X(0, n_0))}
$$

Vì $T$ tuyến tính và $\overline{T(B_X(0, n_0))} = n_0 \cdot \overline{T(B_X(0, 1))}$:

$$
B_Y(y_0 / n_0, \delta/n_0) \subseteq \overline{T(B_X(0, 1))}
$$

Dùng tính thuần nhất: $B_Y(0, \delta/n_0) \subseteq \overline{T(B_X(0, 1))} - y_0/n_0 \subseteq \overline{T(B_X(0, 2))}$.

Bằng lập luận đối xứng (dùng $y_0 \in \overline{T(B_X(0,n_0))}$ và $-y_0 \in \overline{T(B_X(0,n_0))}$), rút ra $B_Y(0, s) \subseteq \overline{T(B_X(0,1))}$ với $s = \delta/(2n_0)$. $\blacksquare$

---

## Bước 2 — Đi từ bao đóng về chính tập

> [!theorem] Lemma A2.3
> Với $s$ trong Lemma A2.2, ta có $B_Y(0, s/2) \subseteq T(B_X(0, 1))$.

**Proof.** Cho $y \in B_Y(0, s/2)$. Ta xây dựng $x \in B_X(0, 1)$ với $Tx = y$ bằng cách "lọ mọ" xấp xỉ liên tiếp.

**Vòng lặp**: Áp dụng Lemma A2.2 cho các quả cầu co lại:

$$
B_Y(0, s \cdot 2^{-k}) \subseteq \overline{T(B_X(0, 2^{-k}))}
$$

Bước 1: $y \in B_Y(0, s/2) \subseteq \overline{T(B_X(0, 1/2))}$ (dùng Lemma A2.2 với tỉ lệ $1/2$).

Chọn $x_1 \in B_X(0, 1/2)$ sao cho $\|y - Tx_1\| < s/4$.

Đặt $y_1 = y - Tx_1 \in B_Y(0, s/4) \subseteq \overline{T(B_X(0, 1/4))}$.

Chọn $x_2 \in B_X(0, 1/4)$ sao cho $\|y_1 - Tx_2\| < s/8$, và tiếp tục.

Tổng quát, chọn $x_k \in B_X(0, 2^{-k})$ với $\|y_{k-1} - Tx_k\| < s \cdot 2^{-(k+1)}$ trong đó $y_{k-1} = y - T(x_1 + \cdots + x_{k-1})$.

**Chuỗi hội tụ**: $\sum_{k=1}^\infty \|x_k\| \leq \sum_{k=1}^\infty 2^{-k} = 1 < \infty$.

Vì $X$ Banach, chuỗi $x = \sum_{k=1}^\infty x_k$ hội tụ và $\|x\| \leq \sum \|x_k\| < 1$, tức $x \in B_X(0, 1)$.

**Kiểm tra $Tx = y$**: $\|y - T(x_1 + \cdots + x_k)\| = \|y_{k-1} - Tx_k\| < s \cdot 2^{-(k+1)} \to 0$.

Vì $T$ liên tục: $T(x) = T(\sum_k x_k) = \sum_k Tx_k$ (liên tục + tuyến tính), nên $Tx = y$. $\blacksquare$

---

## Chứng minh Open Mapping Theorem

**Proof của Theorem A2.1.** Đặt $r = s/2$ từ Lemma A2.3. Theo Lemma A2.3:

$$
B_Y(0, r) \subseteq T(B_X(0, 1))
$$

**Tính ánh xạ mở**: Cho $U \subseteq X$ mở và $y \in T(U)$. Chọn $x \in U$ với $Tx = y$. Vì $U$ mở, tồn tại $\varepsilon > 0$ với $B_X(x, \varepsilon) \subseteq U$. Khi đó:

$$
T(B_X(x, \varepsilon)) = Tx + T(B_X(0, \varepsilon)) = y + \varepsilon \cdot T(B_X(0, 1)) \supseteq y + \varepsilon \cdot B_Y(0, r) = B_Y(y, \varepsilon r)
$$

Vậy $B_Y(y, \varepsilon r) \subseteq T(U)$, tức $T(U)$ mở. $\blacksquare$

---

## Ghi chú

> [!note] Remark A2.4 — Cả hai điều kiện $X$ Banach và $Y$ Banach đều cần thiết
>
> - Nếu $X$ không đầy đủ: Lemma A2.3 (dùng $X$ Banach để chuỗi $\sum x_k$ hội tụ) thất bại.
> - Nếu $Y$ không đầy đủ: BCT (áp dụng cho $Y$ trong Lemma A2.2) thất bại.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Theorem 2.11.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Theorem 4.12-2.
- MIT 18.102, Lecture 4.
