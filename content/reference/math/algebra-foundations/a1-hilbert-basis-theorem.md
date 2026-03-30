---
title: "A1. Hilbert Basis Theorem"
tags: [math, algebra-foundations, appendix]
created: 2026-03-28
---

> Bài học liên quan: [[05-noetherian-rings|05. Noetherian Rings and the Hilbert Basis Theorem]]

---

## Hilbert Basis Theorem

> [!theorem] Theorem A1.1 — Hilbert Basis Theorem
> Nếu $R$ là Noetherian ring thì $R[x]$ là Noetherian ring.

---

## Proof

Ta chứng minh mọi ideal $I \trianglelefteq R[x]$ đều được sinh hữu hạn.

**Bước 1: Xây dựng ideal $J \trianglelefteq R$ từ các leading coefficients.**

Với mỗi $n \geq 0$, định nghĩa:

$$
J_n = \{a \in R \mid \exists\, f \in I \text{ với } \deg f \leq n \text{ và leading coefficient } a\} \cup \{0\}
$$

Kiểm tra $J_n \trianglelefteq R$: nếu $a \in J_n$ với $f \in I$, $\deg f \leq n$ có leading coefficient $a$, và $r \in R$, thì $rf \in I$ có leading coefficient $ra$ và $\deg(rf) \leq n$, nên $ra \in J_n$. Tính đóng với phép cộng tương tự.

Rõ ràng $J_0 \subseteq J_1 \subseteq J_2 \subseteq \cdots$ — đây là chuỗi tăng ideals trong $R$.

**Bước 2: Chuỗi ổn định vì $R$ Noetherian.**

Đặt $J = \bigcup_{n \geq 0} J_n \trianglelefteq R$. Vì $R$ Noetherian, $J$ được sinh hữu hạn:

$$
J = (a_1, \ldots, a_k), \qquad a_i \in J_{n_i}
$$

Đặt $N = \max(n_1, \ldots, n_k)$. Khi đó $J_n = J_N$ với mọi $n \geq N$ (vì mỗi generator $a_i \in J_{n_i} \subseteq J_N$).

**Bước 3: Với mỗi $m \leq N$, chọn generators hữu hạn cho $J_m$.**

Vì $R$ Noetherian, với mỗi $m = 0, 1, \ldots, N$:

$$
J_m = (a_{m,1}, \ldots, a_{m,k_m})
$$

Với mỗi $a_{m,i}$, chọn $f_{m,i} \in I$ với $\deg f_{m,i} \leq m$ và leading coefficient $a_{m,i}$.

**Bước 4: Tập $\mathcal{F}$ hữu hạn sau đây sinh $I$.**

$$
\mathcal{F} = \{f_{m,i} \mid 0 \leq m \leq N, 1 \leq i \leq k_m\}
$$

Đặt $I' = (\mathcal{F}) \subseteq I$. Ta cần chứng minh $I \subseteq I'$.

**Bước 5: Chứng minh $I \subseteq I'$ bằng induction trên bậc.**

Cho $f \in I$ bất kỳ với $\deg f = d$ và leading coefficient $a$.

*Trường hợp $d \leq N$*: $a \in J_d = (a_{d,1}, \ldots, a_{d,k_d})$, nên $a = \sum_i r_i a_{d,i}$ với $r_i \in R$. Đặt:

$$
g = \sum_i r_i f_{d,i}
$$

Thì $g \in I'$, $\deg g \leq d$, và $g$ có cùng leading coefficient là $a$ với $f$. Khi đó $f - g \in I$ và $\deg(f-g) < d$. Bằng induction trên bậc, $f - g \in I'$, suy ra $f \in I'$.

*Trường hợp $d > N$*: $a \in J_d = J_N = (a_{N,1}, \ldots, a_{N,k_N})$, nên $a = \sum_i r_i a_{N,i}$. Đặt:

$$
g = \sum_i r_i x^{d-N} f_{N,i}
$$

Thì $g \in I'$, $\deg g = d$, và leading coefficient của $g$ bằng $a$. Khi đó $f - g \in I$ và $\deg(f-g) < d$. Bằng induction trên bậc, $f - g \in I'$, suy ra $f \in I'$.

**Kết luận:** Mọi $f \in I$ đều thuộc $I'$, tức $I = I' = (\mathcal{F})$ được sinh hữu hạn. Vậy $R[x]$ Noetherian. $\blacksquare$

---

## Nhận xét về Proof

Chứng minh trên là **phi constructive** theo nghĩa: ta không xây dựng generators một cách explicit, mà chỉ dùng ACC của $R$ để đảm bảo chuỗi dừng. Đây chính là kiểu lập luận mà Gordan phàn nàn — nhưng cũng là điểm mạnh: nó áp dụng cho mọi Noetherian ring $R$, không cần biết cấu trúc cụ thể.

Về mặt tính toán, nếu $R = k$ là field, thuật toán **Gröbner basis** (Buchberger, 1965) cho phép tìm tập sinh hữu hạn tối tiểu (minimal generating set) một cách explicit — và đây là nền tảng của Computational Algebraic Geometry.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 15.8.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 7.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter X, Theorem 1.1.
