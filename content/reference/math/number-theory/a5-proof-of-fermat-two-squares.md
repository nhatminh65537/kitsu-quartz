---
title: "A5. Định Lý Fermat về p = a^2 + b^2 — Chứng Minh Descent"
type: appendix
tags: [math, number-theory, appendix]
aliases: [Proof of Fermat's Two-Square Theorem]
created: 2026-05-15
---

> **Liên quan**: [[33-sums-of-two-squares|33. Tổng Hai Bình Phương — Định Lý Fermat]]
> **Yêu cầu**: [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]]

Appendix này trình bày chứng minh "descent vô hạn" (infinite descent) của Fermat cho định lý: mọi số nguyên tố $p \equiv 1 \pmod{4}$ đều biểu diễn được duy nhất thành tổng hai bình phương. Đây là chứng minh "sơ cấp" — không dùng Gaussian integers, chỉ dùng số học thông thường.

---

## Phát Biểu

> [!theorem] Theorem A5.1 — Định Lý Fermat về Tổng Hai Bình Phương
> Cho $p$ là số nguyên tố lẻ. Khi đó:
>
> $$
> p \equiv 1 \pmod{4} \iff \exists!\, (a,b) \in \mathbb{Z}^{+} \times \mathbb{Z}^{+},\; a > b,\; p = a^2 + b^2
> $$

Chiều ($\Leftarrow$) đơn giản (bình phương modulo 4). Appendix này tập trung vào chiều ($\Rightarrow$) bằng phương pháp descent.

---

## Bước 1 — Tồn tại bội $mp$ là tổng hai bình phương

> [!lemma] Lemma A5.2
> Nếu $p \equiv 1 \pmod{4}$ là số nguyên tố, thì tồn tại $x \in \mathbb{Z}$ và số nguyên $m$ với $1 \leq m < p$ sao cho:
>
> $$
> mp = x^2 + 1^2
> $$

**Proof.** Từ bài 16, $(-1 \mid p) = (-1)^{(p-1)/2} = 1$, nên tồn tại $u \in \mathbb{Z}$ với $u^2 \equiv -1 \pmod{p}$. Chọn $x$ là phần dư của $u$ khi chia cho $p$, với $|x| \leq (p-1)/2$. Khi đó:

$$
x^2 + 1 \equiv 0 \pmod{p} \quad\Longrightarrow\quad x^2 + 1 = mp
$$

với $m = (x^2+1)/p$. Vì $|x| \leq (p-1)/2$, ta có:

$$
x^2 + 1 \leq \left(\frac{p-1}{2}\right)^2 + 1 = \frac{p^2 - 2p + 5}{4} < \frac{p^2}{4} + 1 < p^2
$$

nên $m < p$. Hơn nữa $m \geq 1$ vì $x^2+1 \geq 1$. $\blacksquare$

> [!example] Example A5.3 — $p = 29$
> $12^2 \equiv -1 \pmod{29}$. $x = 12$, $12^2 + 1 = 145 = 5 \cdot 29$. Vậy $m = 5$, $5 \cdot 29 = 12^2 + 1^2$.

---

## Bước 2 — Nếu $m > 1$, "hạ" $m$ xuống

Đây là trái tim của chứng minh — descent step.

> [!lemma] Lemma A5.4 — Descent Step
> Cho $p$ là số nguyên tố lẻ. Giả sử tồn tại $a, b \in \mathbb{Z}$ và $m \in \mathbb{Z}^+$ với $1 < m < p$ sao cho:
>
> $$
> mp = a^2 + b^2
> $$
>
> Khi đó tồn tại $c, d \in \mathbb{Z}$ và $k \in \mathbb{Z}^+$ với $k < m$ sao cho:
>
> $$
> kp = c^2 + d^2
> $$

**Proof.** Chọn $u, v$ là các số nguyên gần $a/m, b/m$ nhất:

$$
u \equiv a \pmod{m}, \quad v \equiv b \pmod{m}, \qquad |u| \leq \frac{m}{2},\; |v| \leq \frac{m}{2}
$$

(Nếu $m$ chẵn và phần dư $= m/2$, chọn dấu âm để $|u| \leq m/2$.)

Xét $u^2 + v^2$. Vì $u \equiv a$ và $v \equiv b \pmod{m}$:

$$
u^2 + v^2 \equiv a^2 + b^2 = mp \equiv 0 \pmod{m}
$$

Vậy $u^2 + v^2 = km$ với $k \geq 0$. Từ $|u|, |v| \leq m/2$:

$$
k = \frac{u^2 + v^2}{m} \leq \frac{(m/2)^2 + (m/2)^2}{m} = \frac{m}{2}
$$

Nếu $k = 0$ thì $u = v = 0$, kéo theo $m \mid a$ và $m \mid b$, suy ra $m^2 \mid a^2+b^2 = mp$, tức $m \mid p$. Vì $p$ nguyên tố và $m < p$, buộc $m = 1$ — mâu thuẫn với $m > 1$. Vậy $k \geq 1$, và $k \leq m/2 < m$.

Bây giờ xét Brahmagupta–Fibonacci identity:

$$
(a^2+b^2)(u^2+v^2) = (au+bv)^2 + (av-bu)^2
$$

Thay $a^2+b^2 = mp$, $u^2+v^2 = km$:

$$
mp \cdot km = m^2 kp = (au+bv)^2 + (av-bu)^2
$$

Chia cả hai vế cho $m^2$ (kiểm tra $m \mid (au+bv)$ và $m \mid (av-bu)$):

$$
au+bv \equiv a^2+b^2 = mp \equiv 0 \pmod{m}
$$
$$
av-bu \equiv ab - ba = 0 \pmod{m}
$$

Đặt:

$$
c = \frac{au+bv}{m}, \qquad d = \frac{av-bu}{m}
$$

Khi đó:

$$
kp = c^2 + d^2
$$

với $c, d \in \mathbb{Z}$ và $k < m$. $\blacksquare$

> [!example] Example A5.5 — Descent cho $p = 29$, $m = 5$
> $5 \cdot 29 = 12^2 + 1^2$. $m = 5$, $a = 12$, $b = 1$.
>
> Chọn $u \equiv 12 \pmod{5} \Rightarrow u = 2$ (vì $|2| \leq 5/2$). $v \equiv 1 \pmod{5} \Rightarrow v = 1$.
>
> $u^2+v^2 = 4+1 = 5 = 1 \cdot 5$, nên $k = 1$.
>
> $(au+bv)/m = (24+1)/5 = 5$, $(av-bu)/m = (12-2)/5 = 2$.
>
> Vậy $1 \cdot 29 = 5^2 + 2^2$. **Descent thành công!**

---

## Bước 3 — Kết luận bằng descent vô hạn

> [!theorem] Theorem A5.6 — Hoàn thành chứng minh
> Nếu $p \equiv 1 \pmod{4}$, thì $p = a^2 + b^2$.

**Proof.** Từ Lemma A5.2, tồn tại $m \geq 1$ và $a, b$ sao cho $mp = a^2+b^2$ với $m < p$.

Gọi $m_0$ là giá trị **nhỏ nhất** của $m > 0$ sao cho $m_0 p = a^2+b^2$ với $a,b \in \mathbb{Z}$ nào đó (tồn tại theo well-ordering principle vì tập các $m$ như vậy khác rỗng).

Nếu $m_0 > 1$, áp dụng Lemma A5.4: tồn tại $k < m_0$ và $c,d$ với $kp = c^2+d^2$. Nhưng $k$ cũng là một giá trị dương với tính chất này — mâu thuẫn với tính nhỏ nhất của $m_0$.

Vậy $m_0 = 1$, tức $p = a^2+b^2$. $\blacksquare$

---

## Tính Duy Nhất

> [!theorem] Theorem A5.7 — Tính duy nhất của biểu diễn
> Nếu $p = a^2+b^2 = c^2+d^2$ với $a,b,c,d \in \mathbb{Z}^+$, $a > b$, $c > d$, thì $(a,b) = (c,d)$.

**Proof.** Nếu $a^2+b^2 = c^2+d^2 = p$, thì trong $\mathbb{Z}[i]$: $p = (a+bi)(a-bi) = (c+di)(c-di)$. Do unique factorization trong $\mathbb{Z}[i]$ và $p$ là rational prime, các factor phải là associates. Vì $a,b,c,d > 0$, ta có $(a,b) = (c,d)$ hoặc $(a,b) = (d,c)$. Với điều kiện $a > b$ và $c > d$, suy ra $(a,b) = (c,d)$. $\blacksquare$

---

## References

- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §16.9.
- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.7.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §17.1.
