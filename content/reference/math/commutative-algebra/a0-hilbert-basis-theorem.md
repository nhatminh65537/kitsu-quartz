---
title: "A0. Proof of Hilbert Basis Theorem"
tags: [math, commutative-algebra, appendix]
created: 2026-03-29
---

> Bài học liên quan: [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]]

## Hilbert Basis Theorem

> [!abstract] Theorem A0.1 — Hilbert Basis Theorem
>
> Nếu $R$ là Noetherian ring, thì $R[x]$ cũng là Noetherian ring.

## Proof

Ta cần chứng minh mọi ideal $I \subseteq R[x]$ đều hữu hạn sinh.

**Bước 1: Xây dựng dãy ideals trong $R$.**

Với mỗi $n \geq 0$, định nghĩa:

$$
L_n = \{a \in R : \exists\, f \in I \text{ bậc } n \text{ với hệ số đầu } a\} \cup \{0\}
$$

Ta kiểm tra $L_n$ là ideal của $R$: nếu $a, b \in L_n$ với $f, g \in I$ bậc $n$ và hệ số đầu $a, b$, thì $f + g$ (hoặc $f - g$) có hệ số đầu $a \pm b \in L_n$. Còn $ra \in L_n$ vì $rf \in I$ có hệ số đầu $ra$.

Hơn nữa, $L_n \subseteq L_{n+1}$: với $f \in I$ bậc $n$ và hệ số đầu $a$, thì $xf \in I$ có bậc $n+1$ và hệ số đầu $a$.

Vậy ta có dãy tăng:

$$
L_0 \subseteq L_1 \subseteq L_2 \subseteq \cdots
$$

**Bước 2: Dùng giả thiết $R$ Noetherian.**

Vì $R$ Noetherian, dãy $L_0 \subseteq L_1 \subseteq \cdots$ phải dừng. Gọi $N$ là chỉ số mà $L_N = L_{N+1} = L_{N+2} = \cdots$, tức:

$$
L_N = L_n \quad \forall\, n \geq N
$$

Vì mỗi $L_n$ ($0 \leq n \leq N$) là ideal của $R$ Noetherian, $L_n$ hữu hạn sinh. Chọn:

$$
L_n = (a_{n,1}, \ldots, a_{n,k_n})
$$

và với mỗi $a_{n,j}$, chọn $f_{n,j} \in I$ bậc $n$ có hệ số đầu $a_{n,j}$.

**Bước 3: Chứng minh $I$ được sinh bởi các $f_{n,j}$.**

Đặt $J = (f_{n,j} : 0 \leq n \leq N,\, 1 \leq j \leq k_n) \subseteq I$. Ta cần chứng minh $I = J$.

Lấy bất kỳ $f \in I$. Ta chứng minh $f \in J$ bằng quy nạp trên $\deg f$.

**Trường hợp cơ sở** $\deg f = 0$: $f \in I \cap R$, tức hệ số đầu của $f$ thuộc $L_0 = (a_{0,1}, \ldots, a_{0,k_0})$. Viết $f = \sum_j c_j a_{0,j}$ với $c_j \in R$, suy ra:

$$
f = \sum_j c_j f_{0,j} \in J
$$

**Bước quy nạp**: Giả sử mọi phần tử của $I$ bậc $< m$ đều thuộc $J$. Xét $f \in I$ bậc $m$ với hệ số đầu $a$.

*Trường hợp $m \leq N$:* Khi đó $a \in L_m = (a_{m,1}, \ldots, a_{m,k_m})$. Viết $a = \sum_j c_j a_{m,j}$. Đặt:

$$
g = f - \sum_j c_j f_{m,j}
$$

Thì $g \in I$ (vì $f, f_{m,j} \in I$) và $\deg g < m$ (hệ số bậc $m$ triệt tiêu). Theo giả thiết quy nạp, $g \in J$. Vậy $f = g + \sum_j c_j f_{m,j} \in J$.

*Trường hợp $m > N$:* Khi đó $a \in L_m = L_N = (a_{N,1}, \ldots, a_{N,k_N})$. Viết $a = \sum_j c_j a_{N,j}$. Đặt:

$$
g = f - \sum_j c_j x^{m-N} f_{N,j}
$$

Lưu ý $x^{m-N} f_{N,j} \in I$ (vì $I$ là ideal) có bậc $m$ và hệ số đầu $a_{N,j}$. Suy ra $g \in I$ và $\deg g < m$. Theo giả thiết quy nạp, $g \in J$. Vậy $f \in J$.

**Kết luận:** Mọi $f \in I$ đều thuộc $J$, tức $I = J$ là ideal hữu hạn sinh.

$\blacksquare$

---

## Hệ quả

> [!abstract] Corollary A0.2
>
> Với mọi Noetherian ring $R$ và $n \geq 0$, vành $R[x_1, \ldots, x_n]$ là Noetherian.

**Proof.** Quy nạp trên $n$: bước cơ sở $n = 0$ hiển nhiên. Bước quy nạp: $R[x_1, \ldots, x_n] = R[x_1, \ldots, x_{n-1}][x_n]$ Noetherian theo Theorem A0.1. $\blacksquare$

> [!abstract] Corollary A0.3
>
> Mọi $k$-algebra hữu hạn sinh $A = k[a_1, \ldots, a_n]$ (với $k$ là trường) là Noetherian.

**Proof.** $A$ là quotient của $k[x_1, \ldots, x_n]$ (Noetherian), và quotient của Noetherian ring là Noetherian (Theorem 5.5). $\blacksquare$

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Theorem 7.5.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Theorem 1.2.
- Cox, D., Little, J. & O'Shea, D. *Ideals, Varieties, and Algorithms*, §2.5, Theorem 4.
