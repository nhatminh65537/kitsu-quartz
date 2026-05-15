---
title: "A6. Công thức r_2(n) = 4(d1 - d3) — Chứng Minh Đầy Đủ"
type: appendix
tags: [math, number-theory, appendix]
aliases: [Proof of r2 Formula]
created: 2026-05-15
---

> **Liên quan**: [[34-counting-representations|34. Đếm Số Biểu Diễn và Ứng Dụng]]
> **Yêu cầu**: [[21-dirichlet-convolution-and-mobius|21. Tích Chập Dirichlet và Hàm Möbius]], [[32-gaussian-primes|32. Số Nguyên Tố Gauss — Phân Loại]], [[33-sums-of-two-squares|33. Tổng Hai Bình Phương — Định Lý Fermat]]

Appendix này trình bày chứng minh đầy đủ công thức của Gauss cho $r_2(n)$ — số cách biểu diễn $n$ thành tổng hai bình phương — sử dụng unique factorization trong $\mathbb{Z}[i]$.

---

## Phát Biểu

> [!theorem] Theorem A6.1 — Công thức $r_2(n)$ (Gauss)
> Cho $n \geq 1$. Đặt:
>
> $$
> d_1(n) = \sum_{\substack{d \mid n \\ d \equiv 1 (4)}} 1, \qquad
> d_3(n) = \sum_{\substack{d \mid n \\ d \equiv 3 (4)}} 1
> $$
>
> Khi đó số cặp $(x,y) \in \mathbb{Z}^2$ với $x^2 + y^2 = n$ là:
>
> $$
> r_2(n) = 4\big(d_1(n) - d_3(n)\big)
> $$

---

## Bước 1 — $r_2(n)$ qua số Gaussian integers có norm $n$

Nhắc lại: $r_2(n) = |\{\alpha \in \mathbb{Z}[i] : N(\alpha) = n\}|$. Mỗi biểu diễn $n = x^2+y^2$ tương ứng 1-1 với $\alpha = x+yi$.

Nếu $n$ không biểu diễn được (tồn tại $q \equiv 3 \pmod{4}$ với số mũ lẻ), thì $d_1(n) = d_3(n)$ và $r_2(n) = 0$. Công thức đúng. **Từ giờ giả sử $n$ biểu diễn được.**

---

## Bước 2 — Phân tích $n$ trong $\mathbb{Z}[i]$

Do $n$ biểu diễn được, phân tích chính tắc của $n$ trong $\mathbb{Z}$ có dạng:

$$
n = 2^{e} \prod_{i=1}^{r} p_i^{e_i} \prod_{j=1}^{s} q_j^{2f_j}
$$

với $p_i \equiv 1 \pmod{4}$, $q_j \equiv 3 \pmod{4}$.

Trong $\mathbb{Z}[i]$, áp dụng phân loại Gaussian primes (Theorem 32.5):
- $2 = -i(1+i)^2$ — ramified
- $p_i = \pi_i \overline{\pi_i}$ với $N(\pi_i) = N(\overline{\pi_i}) = p_i$, $\pi_i \neq \overline{\pi_i}$ (không associate) — split
- $q_j$ là Gaussian prime, $N(q_j) = q_j^2$ — inert

Phân tích của $n$ trong $\mathbb{Z}[i]$ (sai khác unit):

$$
n = u \cdot (1+i)^{2e} \prod_{i=1}^{r} \pi_i^{e_i} \overline{\pi_i}^{e_i} \prod_{j=1}^{s} q_j^{2f_j}
$$

---

## Bước 3 — Đếm số $\alpha$ với $N(\alpha) = n$

Mọi $\alpha \in \mathbb{Z}[i]$ với $N(\alpha) = n$ có phân tích (sai khác unit):

$$
\alpha = u' \cdot (1+i)^{e} \prod_{i=1}^{r} \pi_i^{a_i} \overline{\pi_i}^{e_i - a_i} \prod_{j=1}^{s} q_j^{f_j}
$$

trong đó $u' \in \{\pm 1, \pm i\}$ là unit, và $0 \leq a_i \leq e_i$.

**Giải thích:**
- $(1+i)^e$: số mũ của $(1+i)$ trong $\alpha$ phải là $e$, vì $N(1+i) = 2$ và $(1+i) \sim \overline{1+i}$ (associate — do $1-i = -i(1+i)$).
- $\pi_i^{a_i} \overline{\pi_i}^{e_i-a_i}$: tổng số mũ của $\pi_i$ và $\overline{\pi_i}$ là $e_i$, nhưng phân bố có thể khác nhau. Có $e_i+1$ cách chọn $a_i \in \{0, 1, \ldots, e_i\}$.
- $q_j^{f_j}$: số mũ cố định là $f_j$ (vì $q_j$ inert, không có lựa chọn conjugate).

**Số cách chọn factorization (chưa tính unit):**

$$
\prod_{i=1}^{r} (e_i + 1)
$$

**Tính thêm 4 units:** mỗi factorization cho 4 associates ($\pm 1, \pm i$). Vậy:

$$
r_2(n) = 4 \prod_{i=1}^{r} (e_i + 1)
$$

---

## Bước 4 — Liên hệ với $d_1(n) - d_3(n)$

Cần chứng minh:

$$
d_1(n) - d_3(n) = \prod_{i=1}^{r} (e_i + 1)
$$

Xét hàm $f(n) = d_1(n) - d_3(n)$. Ta chứng minh $f$ là **hàm nhân tính** (multiplicative).

> [!lemma] Lemma A6.2 — $f(n) = d_1(n) - d_3(n)$ là hàm nhân tính
> Nếu $\gcd(m, n) = 1$, thì $f(mn) = f(m) f(n)$.

**Proof.** Với $\gcd(m,n) = 1$, mỗi ước $d \mid mn$ phân tích duy nhất $d = d_m d_n$ với $d_m \mid m$, $d_n \mid n$. Đồng dư của $d$ modulo $4$ phụ thuộc vào đồng dư của $d_m$ và $d_n$:

$$
d \equiv 1 \pmod{4} \iff (d_m, d_n) \equiv (1,1) \text{ hoặc } (3,3) \pmod{4}
$$
$$
d \equiv 3 \pmod{4} \iff (d_m, d_n) \equiv (1,3) \text{ hoặc } (3,1) \pmod{4}
$$

Do đó:

$$
\begin{aligned}
d_1(mn) &= d_1(m)d_1(n) + d_3(m)d_3(n) \\
d_3(mn) &= d_1(m)d_3(n) + d_3(m)d_1(n)
\end{aligned}
$$

Suy ra:

$$
\begin{aligned}
f(mn) &= d_1(mn) - d_3(mn) \\
&= (d_1(m)d_1(n) + d_3(m)d_3(n)) - (d_1(m)d_3(n) + d_3(m)d_1(n)) \\
&= d_1(m)(d_1(n) - d_3(n)) - d_3(m)(d_1(n) - d_3(n)) \\
&= (d_1(m) - d_3(m))(d_1(n) - d_3(n)) = f(m)f(n) \quad\blacksquare
\end{aligned}
$$

> [!lemma] Lemma A6.3 — Giá trị của $f$ trên lũy thừa nguyên tố
>
> $$
> f(2^e) = 1, \qquad
> f(p^e) = e+1 \;\; (p \equiv 1 \pmod{4}), \qquad
> f(q^{2f}) = 1 \;\; (q \equiv 3 \pmod{4}), \qquad
> f(q^{2f+1}) = 0
> $$

**Proof.**

- **$2^e$:** Các ước là $1, 2, 4, \ldots, 2^e$. $1 \equiv 1 \pmod{4}$, còn $2, 4, 8, \ldots \equiv 0, 2 \pmod{4}$ (không tính vào $d_1$ hoặc $d_3$). Vậy $d_1(2^e)=1$, $d_3(2^e)=0$, $f(2^e)=1$.

- **$p^e$ với $p \equiv 1 \pmod{4}$:** Các ước là $1, p, p^2, \ldots, p^e$. Tất cả $\equiv 1 \pmod{4}$ (vì $p \equiv 1 \Rightarrow p^k \equiv 1$). Vậy $d_1(p^e) = e+1$, $d_3(p^e) = 0$, $f(p^e) = e+1$.

- **$q^{2f}$ với $q \equiv 3 \pmod{4}$:** Các ước: $q^k$ với $0 \leq k \leq 2f$.
  - $k$ chẵn: $q^{2m} \equiv (q^2)^m \equiv 1^m \equiv 1 \pmod{4}$ → đóng góp vào $d_1$.
  - $k$ lẻ: $q^{2m+1} \equiv 3 \cdot 1^m \equiv 3 \pmod{4}$ → đóng góp vào $d_3$.
  
  Có $f+1$ số mũ chẵn và $f$ số mũ lẻ. $d_1 = f+1$, $d_3 = f$, $f(q^{2f}) = 1$.

- **$q^{2f+1}$:** Tương tự, $d_1 = f+1$, $d_3 = f+1$, $f = 0$. $\blacksquare$

---

## Bước 5 — Tổng hợp

Với $n = 2^{e} \prod p_i^{e_i} \prod q_j^{2f_j}$ (biểu diễn được), dùng tính nhân tính:

$$
\begin{aligned}
d_1(n) - d_3(n) &= f(n) = f(2^e) \prod f(p_i^{e_i}) \prod f(q_j^{2f_j}) \\
&= 1 \cdot \prod (e_i+1) \cdot \prod 1 \\
&= \prod_{i=1}^{r} (e_i + 1)
\end{aligned}
$$

Kết hợp với Bước 3:

$$
r_2(n) = 4 \prod_{i=1}^{r} (e_i + 1) = 4(d_1(n) - d_3(n))
$$

Nếu $n$ không biểu diễn được (có $q_j$ với số mũ lẻ), $f(q_j^{\text{lẻ}}) = 0$, nên $d_1(n) - d_3(n) = 0$, và $r_2(n) = 0$. Công thức vẫn đúng. $\blacksquare$

---

## Ví Dụ Minh Họa

> [!example] Example A6.4 — $n = 65 = 5 \cdot 13$
> $p_1 = 5$, $e_1 = 1$; $p_2 = 13$, $e_2 = 1$. Không có $q \equiv 3 \pmod{4}$.
>
> $d_1(65) - d_3(65) = (1+1)(1+1) = 4$. $r_2(65) = 4 \cdot 4 = 16$.
>
> Các ước của $65$: $1, 5, 13, 65$ — tất cả $\equiv 1 \pmod{4}$, $d_1=4$, $d_3=0$, $4(4-0) = 16$. ✓

> [!example] Example A6.5 — $n = 50 = 2 \cdot 5^2$
> $2^1$: $f=1$; $5^2$: $e=2$, $f = 3$. $r_2(50) = 4 \cdot 1 \cdot 3 = 12$.
>
> Ước của $50$: $1, 2, 5, 10, 25, 50$. $d \equiv 1$: $1, 5, 25$ → $d_1=3$; $d \equiv 3$: không có → $d_3=0$. $r_2 = 4(3-0) = 12$. ✓
>
> Kiểm tra: $50 = 1^2+7^2 = 5^2+5^2$. Các hoán vị dấu: $(\pm1,\pm7), (\pm7,\pm1), (\pm5,\pm5)$ → $8+4 = 12$. ✓

---

## References

- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §16.10.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §8.3.
- Conrad, K. *The Gaussian Integers*, Theorem 8.5. https://kconrad.math.uconn.edu/blurbs/ugradnumthy/Zinotes.pdf
