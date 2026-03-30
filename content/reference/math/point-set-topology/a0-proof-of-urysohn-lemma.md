---
title: "A0. Proof of Urysohn's Lemma"
tags: [math, point-set-topology, appendix]
aliases: [Proof of Urysohn Lemma]
created: 2026-03-30
---

> **Liên quan**: [[11-urysohn-tietze|11. Urysohn's Lemma & Tietze Extension]]
> Chứng minh đầy đủ Urysohn's Lemma qua kỹ thuật dyadic rationals.

---

## Phát biểu lại

> [!theorem] Theorem A0.1 — Urysohn's Lemma
> Cho $X$ là không gian **normal** ($T_4$) và $A, B \subseteq X$ là hai tập đóng rời nhau ($A \cap B = \emptyset$). Tồn tại hàm liên tục $f : X \to [0,1]$ sao cho $f|_A = 0$ và $f|_B = 1$.

---

## Chuẩn bị: Dyadic Rationals

Ký hiệu $\mathbb{D} = \{\frac{k}{2^n} : n \geq 0,\, 0 \leq k \leq 2^n\} \cap [0,1]$ là tập các **số hữu tỉ nhị phân** (dyadic rationals) trong $[0,1]$. Đây là tập đếm được và trù mật trong $[0,1]$.

Sắp thứ tự: $\mathbb{D} = \{p_0, p_1, p_2, \ldots\}$ theo thứ tự liệt kê bước:
- Bước $0$: $\{0, 1\}$.
- Bước $1$: $\{\frac{1}{2}\}$.
- Bước $2$: $\{\frac{1}{4}, \frac{3}{4}\}$.
- Bước $n$: $\{\frac{k}{2^n} : k \text{ lẻ}\}$.

---

## Bước 1: Xây dựng họ open sets $\{U_p\}_{p \in \mathbb{D}}$

**Mục tiêu**: Xây dựng họ $\{U_p\}_{p \in \mathbb{D}}$ sao cho:

$$
p < q \implies \overline{U_p} \subseteq U_q, \quad A \subseteq U_0, \quad B \subseteq X \setminus U_1.
$$

**Xây dựng bằng quy nạp theo các bước liệt kê:**

**Bước khởi đầu** ($p = 0$ và $p = 1$): Vì $X$ normal và $A, B$ đóng rời nhau, tồn tại $U_0, U_1$ mở với $A \subseteq U_0$, $B \subseteq X \setminus \overline{U_0}$, và $\overline{U_0} \subseteq U_1 = X \setminus B$.

Cụ thể hơn: áp dụng Theorem 10.19 (đặc trưng normal qua closure) cho $F = A$ và $U = X \setminus B$:
$$
A \subseteq U_0 \subseteq \overline{U_0} \subseteq X \setminus B.
$$
Đặt $U_1 = X \setminus B$ (mở vì $B$ đóng).

**Bước quy nạp** (giả sử $U_p$ đã xây dựng cho mọi $p \in \mathbb{D}$ với mẫu số $\leq 2^{n-1}$): Với $p = \frac{2k-1}{2^n}$ (dyadic mới ở bước $n$), ta có $p_- = \frac{k-1}{2^{n-1}}$ và $p_+ = \frac{k}{2^{n-1}}$ đã được xây dựng với $\overline{U_{p_-}} \subseteq U_{p_+}$. Áp dụng Theorem 10.19 cho $F = \overline{U_{p_-}}$ và $U = U_{p_+}$:
$$
\overline{U_{p_-}} \subseteq U_p \subseteq \overline{U_p} \subseteq U_{p_+}.
$$

Kết quả: họ $\{U_p\}_{p \in \mathbb{D}}$ thỏa $p < q \Rightarrow \overline{U_p} \subseteq U_q$.

---

## Bước 2: Định nghĩa $f$

Định nghĩa $f : X \to [0,1]$ bởi:

$$
f(x) = \inf\{p \in \mathbb{D} : x \in U_p\}.
$$

Quy ước: nếu $x \notin U_p$ với mọi $p$ (không thể xảy ra vì $U_1 = X \setminus B$ và ta xét $x \notin B$), đặt $f(x) = 1$.

**Kiểm tra điều kiện biên:**
- Nếu $x \in A$: $x \in U_0$ nên $\inf\{p : x \in U_p\} \leq 0$, tức $f(x) = 0$. ✓
- Nếu $x \in B$: $x \notin U_1 = X \setminus B$; nhưng vì $\overline{U_p} \subseteq U_1$ với $p < 1$, ta có $x \notin U_p$ với mọi $p < 1$; nên $f(x) = \inf \emptyset = 1$. ✓

---

## Bước 3: Chứng minh $f$ liên tục

Đủ chứng minh $f^{-1}([0,a))$ và $f^{-1}((a,1])$ là mở với mọi $a \in [0,1]$.

**Lemma A0.2**: $f(x) < a \iff x \in U_p$ với một $p < a$, $p \in \mathbb{D}$.

**Proof:** $f(x) < a$ iff $\inf\{p : x \in U_p\} < a$ iff tồn tại $p \in \mathbb{D}$ với $p < a$ và $x \in U_p$. $\blacksquare$

**Lemma A0.3**: $f(x) > a \iff x \notin \overline{U_p}$ với một $p > a$, $p \in \mathbb{D}$.

**Proof:** $f(x) > a$ iff mọi $p \leq a$ đều có $x \notin U_p$ iff (vì $\mathbb{D}$ trù mật) tồn tại $p \in \mathbb{D}$ với $p > a$ và $x \notin \overline{U_p}$ (bởi vì nếu $x \in \overline{U_q}$ với mọi $q > a$, $q$ dyadic, thì $x \in U_{q'}$ với $q' > q$ gần $a$, mâu thuẫn $f(x) > a$). $\blacksquare$

Từ hai Lemma:

$$
f^{-1}([0, a)) = \bigcup_{p < a,\, p \in \mathbb{D}} U_p \quad \text{(hợp của open sets — mở)},
$$

$$
f^{-1}((a, 1]) = \bigcup_{p > a,\, p \in \mathbb{D}} (X \setminus \overline{U_p}) \quad \text{(hợp của open sets — mở)}.
$$

Vì mọi open set trong $[0,1]$ là hợp của các khoảng $[0,a)$ và $(a,1]$, suy ra $f$ liên tục. $\blacksquare$

---

## Nhận xét về kỹ thuật

Kỹ thuật dyadic rationals ở đây có thể tóm gọn thành ba bước:

1. **Dùng normality lặp lại**: mỗi bước quy nạp dùng Theorem 10.19 (đặc trưng normal qua closure) để "chèn" một open set mới vào giữa hai open sets đã có.

2. **Xây dựng hàm qua infimum**: định nghĩa $f(x) = \inf\{p : x \in U_p\}$ là một kỹ thuật chuẩn trong giải tích để xây dựng hàm liên tục từ họ sets.

3. **Chứng minh liên tục qua preimage**: thay vì kiểm tra $\varepsilon$-$\delta$, ta kiểm tra trực tiếp rằng nghịch ảnh của mọi open set là open — đây là định nghĩa topo của liên tục.

Kỹ thuật này xuất hiện lại gần như nguyên vẹn trong chứng minh **Tietze Extension Theorem** và **Urysohn Metrization Theorem**.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §33 (Theorem 33.1).
- Willard, S. *General Topology*, Theorem 15.6.
- Kelley, J. L. *General Topology*, Lemma 4.14.
