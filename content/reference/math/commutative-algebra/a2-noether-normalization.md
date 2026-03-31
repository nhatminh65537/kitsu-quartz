---
title: "A2. Proof of Noether Normalization Lemma"
tags: [math, commutative-algebra, appendix]
created: 2026-03-30
---

> Bài học liên quan: [[08-noether-normalization-nullstellensatz|08. Noether Normalization and Nullstellensatz]]

## Noether Normalization Lemma

> [!abstract] Theorem A2.1 — Noether Normalization Lemma
>
> Cho $k$ là trường và $A = k[a_1, \ldots, a_n] \neq 0$ là $k$-algebra hữu hạn sinh. Khi đó tồn tại $y_1, \ldots, y_d \in A$ đại số độc lập trên $k$ sao cho $A$ là integral extension của $k[y_1,\ldots,y_d]$.

## Proof

Ta chứng minh bằng quy nạp trên $n$ (số sinh).

**Bước cơ sở $n = 0$:** $A = k$, lấy $d = 0$, không cần $y_i$ nào. ✓

**Bước quy nạp:** Giả sử kết quả đúng với mọi $k$-algebra sinh bởi ít hơn $n$ phần tử. Xét $A = k[a_1, \ldots, a_n]$.

### Trường hợp 1: $a_1, \ldots, a_n$ đại số độc lập trên $k$

Lấy $d = n$ và $y_i = a_i$. Thì $A = k[y_1, \ldots, y_n]$ là tự do, hiển nhiên integral over chính nó. ✓

### Trường hợp 2: $a_1, \ldots, a_n$ không đại số độc lập

Tồn tại đa thức $0 \neq f \in k[x_1, \ldots, x_n]$ sao cho $f(a_1, \ldots, a_n) = 0$.

**Trường hợp 2a: $k$ vô hạn.**

Vì $f \neq 0$, tồn tại $\lambda_1, \ldots, \lambda_{n-1} \in k$ sao cho hệ số đầu của $f(x_1 + \lambda_1 x_n, \ldots, x_{n-1} + \lambda_{n-1} x_n, x_n)$ theo $x_n$ khác $0$.

Đặt $a_i' = a_i - \lambda_i a_n$ với $i = 1, \ldots, n-1$. Khi đó $A = k[a_1', \ldots, a_{n-1}', a_n]$ và:

$$
g(a_n) = f(a_1' + \lambda_1 a_n, \ldots, a_{n-1}' + \lambda_{n-1} a_n, a_n) = 0
$$

Vì ta chọn $\lambda_i$ sao cho hệ số đầu của $g(t) = f(\lambda_1 t + a_1', \ldots, \lambda_{n-1} t + a_{n-1}', t)$ theo $t$ (tức bậc cao nhất) thuộc $k^\times$, ta có thể chia để được $g$ monic. Vậy $a_n$ là integral over $k[a_1', \ldots, a_{n-1}']$.

Do đó $A = k[a_1',\ldots,a_{n-1}',a_n]$ là integral over $B = k[a_1',\ldots,a_{n-1}']$ (ring sinh bởi $n-1$ phần tử). Theo giả thiết quy nạp, $B$ integral over $k[y_1,\ldots,y_d]$ với $y_i$ đại số độc lập. Theo Corollary 7.5 (transitivity), $A$ integral over $k[y_1,\ldots,y_d]$. ✓

**Trường hợp 2b: $k$ hữu hạn.**

Dùng một biến đổi khác: lấy $N$ đủ lớn và đặt $a_i' = a_i - a_n^{N^{i-1}}$ với $i = 1,\ldots, n-1$. Khi đó:

$$
f\!\left(a_1' + a_n^{N^0}, a_2' + a_n^{N^1}, \ldots, a_{n-1}' + a_n^{N^{n-2}}, a_n\right) = 0
$$

Với $N$ đủ lớn, số mũ $\sum_{i=1}^n e_i N^{i-1}$ phân biệt với nhau cho mọi monomial $\prod x_i^{e_i}$ của $f$ (biểu diễn cơ số $N$ duy nhất). Vậy monomial có tổng số mũ lớn nhất sẽ cho hạng tử $c \cdot a_n^M$ với $c \in k^\times$, nên $a_n$ thỏa đa thức monic với hệ số trong $k[a_1',\ldots,a_{n-1}']$. Tiếp tục như Trường hợp 2a.

### Kết luận

Trong cả hai trường hợp, bằng quy nạp, tồn tại $y_1,\ldots,y_d$ đại số độc lập trên $k$ sao cho $A$ integral over $k[y_1,\ldots,y_d]$.

$\blacksquare$

---

## Proof rằng $d = \dim A$

> [!abstract] Corollary A2.2
>
> Số $d$ trong Noether Normalization bằng $\dim A$.

**Proof.** Vì $A$ integral over $k[y_1,\ldots,y_d]$, theo Theorem 7.14: $\dim A = \dim k[y_1,\ldots,y_d] = d$ (Theorem 11.6). $\blacksquare$

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Theorem 5.4 & Corollary 5.8.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Theorem 13.3.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Theorem 21.2.
