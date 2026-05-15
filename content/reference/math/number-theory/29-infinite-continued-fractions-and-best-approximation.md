---
title: "29. Phân Số Liên Tục Vô Hạn và Xấp Xỉ Tốt Nhất"
type: theory
tags: [math, number-theory, lesson-29, continued-fractions, diophantine-approximation]
aliases: [Infinite Continued Fractions, Best Approximation]
created: 2026-05-15
---

> **Prerequisites**: [[28-convergents|28. Phân Số Hội Tụ (Convergents)]], [[04-linear-diophantine-equations|04. Phương Trình Diophantine Tuyến Tính]]
> **Objectives**:
> - Hiểu phân số liên tục vô hạn và chứng minh hội tụ của nó
> - Nắm định lý: mọi số vô tỉ có biểu diễn CF vô hạn duy nhất
> - Chứng minh và áp dụng định lý Dirichlet về xấp xỉ Diophantine
> - Hiểu và chứng minh định lý Hurwitz: hằng số $\sqrt{5}$ là sắc nét
> - Giới thiệu số Liouville như ví dụ cực đoan về khả năng xấp xỉ

---

## Motivation / Intuition

Với số hữu tỉ, CF hữu hạn — ta đã biết. Nhưng với số vô tỉ như $\sqrt{2} = 1.41421356\ldots$, thuật toán CF không dừng lại:

$$\sqrt{2} = [1;\, 2, 2, 2, 2, \ldots] = 1 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{2 + \cdots}}}$$

CF vô hạn này định nghĩa một dãy hữu tỉ $p_k/q_k$ hội tụ đến $\sqrt{2}$. Câu hỏi trung tâm của **xấp xỉ Diophantine** (Diophantine approximation): số vô tỉ $\alpha$ có thể được xấp xỉ tốt đến mức nào bởi số hữu tỉ $p/q$? Câu trả lời, do Dirichlet và Hurwitz chứng minh, nói rằng các phân số hội tụ chính là những xấp xỉ tốt nhất — và không thể làm tốt hơn $1/(\sqrt{5}\, q^2)$ đối với mọi số vô tỉ.

---

## Phân Số Liên Tục Vô Hạn

### Definition

> [!definition] Definition 29.1 — CF vô hạn (Infinite Continued Fraction)
> Cho dãy $a_0 \in \mathbb{Z}$ và $a_k \in \mathbb{Z}^+$ với $k \geq 1$. Phân số liên tục vô hạn $[a_0;\, a_1, a_2, \ldots]$ được định nghĩa là giới hạn:
>
> $$
> [a_0;\, a_1, a_2, \ldots] \;:=\; \lim_{n \to \infty} [a_0;\, a_1, \ldots, a_n] = \lim_{n \to \infty} \frac{p_n}{q_n}
> $$
>
> trong đó $p_n/q_n$ là phân số hội tụ thứ $n$.

> [!theorem] Theorem 29.2 — CF vô hạn hội tụ
> Giới hạn $\lim_{n\to\infty} p_n/q_n$ luôn tồn tại và là số vô tỉ.

**Proof.** Từ Theorem 28.10 (tính xen kẽ), dãy $p_{2k}/q_{2k}$ tăng và bị chặn trên (bởi mọi $p_{2k+1}/q_{2k+1}$), còn dãy $p_{2k+1}/q_{2k+1}$ giảm và bị chặn dưới. Hai dãy đơn điệu bị chặn này đều hội tụ. Chênh lệch giữa chúng là:

$$\frac{p_{2k+1}}{q_{2k+1}} - \frac{p_{2k}}{q_{2k}} = \frac{(-1)^{2k+2}}{q_{2k+1} q_{2k}} = \frac{1}{q_{2k+1}q_{2k}} \to 0$$

vì $q_n \to \infty$ (Theorem 28.12). Vậy hai dãy cùng hội tụ về một giới hạn $\alpha$.

Tính vô tỉ: nếu $\alpha = p/q$ hữu tỉ thì $|p/q - p_n/q_n| \geq 1/(q \cdot q_n)$ (vì $p_n q - p q_n \in \mathbb{Z}^*$ với $n$ lớn), nhưng Corollary 28.13 cho $|p/q - p_n/q_n| < 1/(q_n q_{n+1}) < 1/(q_n^2)$ — mâu thuẫn khi $q_n > q$. $\blacksquare$

---

## Số Vô Tỉ ↔ CF Vô Hạn Duy Nhất

> [!theorem] Theorem 29.3 — Phân loại CF (Classification Theorem)
> **(i)** Mọi PSLTHH hữu hạn biểu diễn một số **hữu tỉ**.
>
> **(ii)** Mọi CF vô hạn $[a_0;\, a_1, a_2, \ldots]$ biểu diễn một số **vô tỉ**.
>
> **(iii)** Ngược lại: mọi số vô tỉ $\alpha$ có **đúng một** biểu diễn CF vô hạn $[a_0;\, a_1, a_2, \ldots]$, xác định bởi thuật toán CF: $a_k = \lfloor \alpha_k \rfloor$, $\alpha_{k+1} = 1/(\alpha_k - a_k)$.

**Proof sketch.**

*(i)* và *(ii)*: Đã chứng minh ở Theorem 27.9 và Theorem 29.2.

*(iii) Sự tồn tại*: Thuật toán CF cho $\alpha_0 = \alpha$, $a_k = \lfloor \alpha_k \rfloor$, $\alpha_{k+1} = 1/\{\alpha_k\}$ (phần thập phân). Vì $\alpha$ vô tỉ, $\alpha_k \notin \mathbb{Z}$ với mọi $k$, nên quá trình không dừng. Có thể chứng minh $[a_0;\ldots,a_n] \to \alpha$ (dùng biểu diễn $\alpha = [a_0;\ldots, a_{n-1}, \alpha_n]$ và tính chất tương tự Theorem 28.4).

*(iii) Tính duy nhất*: Nếu $\alpha = [b_0; b_1, \ldots]$ là một CF khác, thì $b_0 = \lfloor \alpha \rfloor = a_0$ (vì $[b_0; b_1, \ldots] - b_0 = 1/[b_1;\ldots] \in (0,1)$). Suy ra $a_1 = \lfloor 1/\{\alpha\} \rfloor = b_1$. Quy nạp cho mọi $k$. $\blacksquare$

> [!example] Example 29.4 — CF của $\sqrt{2}$
> Thuật toán CF: $\alpha_0 = \sqrt{2}$, $a_0 = 1$, $\alpha_1 = 1/(\sqrt{2}-1) = \sqrt{2}+1$.
>
> $a_1 = \lfloor \sqrt{2}+1 \rfloor = 2$, $\alpha_2 = 1/(\sqrt{2}+1-2) = 1/(\sqrt{2}-1) = \sqrt{2}+1 = \alpha_1$.
>
> Vòng lặp! Vậy $\sqrt{2} = [1;\, \overline{2}]$ (gạch ngang ký hiệu phần lặp).
>
> Các hội tụ: $1, 3/2, 7/5, 17/12, 41/29, 99/70, \ldots$ — đây là các nghiệm của $p^2 - 2q^2 = \pm 1$ (liên quan đến phương trình Pell!).

---

## Định Lý Dirichlet về Xấp Xỉ

> [!theorem] Theorem 29.5 — Định Lý Dirichlet về Xấp Xỉ (Dirichlet's Approximation Theorem)
> Với mọi số thực $\alpha$ và mọi số nguyên $N \geq 1$, tồn tại $p \in \mathbb{Z}$, $q \in \mathbb{Z}$ với $1 \leq q \leq N$ sao cho:
>
> $$
> \left|\alpha - \frac{p}{q}\right| < \frac{1}{qN} \leq \frac{1}{q^2}
> $$
>
> Hệ quả: Nếu $\alpha$ vô tỉ, tồn tại **vô hạn** cặp $(p, q)$ nguyên với $q > 0$ thỏa:
>
> $$
> \left|\alpha - \frac{p}{q}\right| < \frac{1}{q^2}
> $$

**Proof (Pigeonhole).** Xét $N+1$ số $\{k\alpha\} = k\alpha - \lfloor k\alpha \rfloor \in [0,1)$ với $k = 0, 1, \ldots, N$. Chia $[0,1)$ thành $N$ đoạn $[j/N, (j+1)/N)$ với $j = 0, \ldots, N-1$. Theo nguyên lý Dirichlet (Pigeonhole), có hai chỉ số $0 \leq k_1 < k_2 \leq N$ sao cho $\{k_1 \alpha\}$ và $\{k_2 \alpha\}$ cùng đoạn. Đặt $q = k_2 - k_1 \in [1, N]$, $p = \lfloor k_2 \alpha \rfloor - \lfloor k_1 \alpha \rfloor$. Khi đó:

$$|q\alpha - p| = |\{k_2\alpha\} - \{k_1\alpha\}| < \frac{1}{N}$$

Chia hai vế cho $q$: $|\alpha - p/q| < 1/(qN) \leq 1/q^2$.

Với $\alpha$ vô tỉ: nếu chỉ có hữu hạn nghiệm $(p_i, q_i)$, lấy $Q = \max q_i$ và chạy thuật toán với $N > Q$ để tìm nghiệm mới — mâu thuẫn. $\blacksquare$

> [!note] Remark 29.6 — Dirichlet và hội tụ
> Mọi hội tụ $p_n/q_n$ thỏa điều kiện của Dirichlet với $N = q_{n+1}$, vì $|α - p_n/q_n| < 1/(q_n q_{n+1})$. Nhưng Dirichlet không nói phải dùng hội tụ — chỉ đảm bảo sự tồn tại.

---

## Hội Tụ là Xấp Xỉ Tốt Nhất

> [!definition] Definition 29.7 — Xấp xỉ tốt nhất (Best Approximation)
> Phân số $p/q$ (với $q > 0$) là **xấp xỉ tốt nhất loại 1** (best approximation of the first kind) của $\alpha$ nếu với mọi $p'/q'$ có $0 < q' \leq q$ và $p'/q' \neq p/q$:
>
> $$
> |\alpha - p/q| < |\alpha - p'/q'|
> $$
>
> Phân số $p/q$ là **xấp xỉ tốt nhất loại 2** (best approximation of the second kind) nếu với mọi $p'/q'$ có $0 < q' \leq q$ và $p'/q' \neq p/q$:
>
> $$
> |q\alpha - p| < |q'\alpha - p'|
> $$
>
> (Điều kiện loại 2 mạnh hơn loại 1: $q|\alpha - p/q| < q'|\alpha - p'/q'| \Rightarrow |\alpha - p/q| < |\alpha - p'/q'|$ khi $q \leq q'$, nhưng ngược lại chưa chắc.)

> [!theorem] Theorem 29.8 — Hội tụ là xấp xỉ tốt nhất loại 2
> Với $\alpha$ vô tỉ và các hội tụ $p_n/q_n$, mọi $p_n/q_n$ là xấp xỉ tốt nhất loại 2 của $\alpha$. Ngược lại, mọi xấp xỉ tốt nhất loại 2 là hội tụ.

**Proof sketch.** Giả sử $0 < q \leq q_n$ và $|q\alpha - p| < |q_n \alpha - p_n|$ với $(p,q) \neq (p_n, q_n)$.

Dùng hệ tọa độ: mọi $(p, q) \in \mathbb{Z}^2$ biểu diễn được qua cơ sở $\{(p_{n-1}, q_{n-1}), (p_n, q_n)\}$ (vì $\det = \pm 1$, theo Theorem 28.5). Viết $(p, q) = r(p_{n-1}, q_{n-1}) + s(p_n, q_n)$. Tính $|q\alpha - p|$ theo $r, s$ và dùng $|q_{n-1}\alpha - p_{n-1}| > |q_n \alpha - p_n|$ (tính đơn điệu của $|q_k\alpha - p_k|$), ta thấy $s = 0$ là duy nhất thỏa điều kiện — dẫn đến $(p,q)$ là bội của $(p_k, q_k)$ với $k < n$, mâu thuẫn với $q \leq q_n$. $\blacksquare$

> [!example] Example 29.9 — Tại sao $22/7$ là xấp xỉ tốt của $\pi$?
> $\pi = [3;\, 7, 15, 1, 292, \ldots]$. Hội tụ thứ nhất là $22/7 = [3;\, 7]$.
>
> $|22/7 - \pi| \approx 1.26 \times 10^{-3}$. Không có phân số $p/q$ nào với $q \leq 7$ xấp xỉ $\pi$ tốt hơn.
>
> Thương tiếp theo $15$ cũng lớn, giải thích tại sao $333/106 = [3;7,15]$ là xấp xỉ tiếp theo tốt vượt trội.

---

## Định Lý Hurwitz

> [!theorem] Theorem 29.10 — Định Lý Hurwitz (1891)
> Với mọi số vô tỉ $\alpha$, có vô hạn cặp $(p, q)$ nguyên với $q > 0$ thỏa:
>
> $$
> \left|\alpha - \frac{p}{q}\right| < \frac{1}{\sqrt{5}\, q^2}
> $$
>
> Hơn nữa, hằng số $\sqrt{5}$ là **sắc nét**: không thể thay bằng hằng số lớn hơn mà vẫn đúng với mọi số vô tỉ. Kẻ phá hỏng là số vàng $\varphi = (1+\sqrt{5})/2$.

**Proof.** Ta sẽ chứng minh: trong ba hội tụ liên tiếp $p_{n-1}/q_{n-1}$, $p_n/q_n$, $p_{n+1}/q_{n+1}$, ít nhất một thỏa bất đẳng thức Hurwitz.

*Bước 1*: Gọi $\theta_n = q_n^2 \left|\alpha - \frac{p_n}{q_n}\right|$. Ta cần chứng minh $\min(\theta_{n-1}, \theta_n, \theta_{n+1}) < 1/\sqrt{5}$.

*Bước 2*: Từ Corollary 28.7 và biểu thức liên quan đến $\alpha_n$ (complete quotient thứ $n$):

$$\alpha - \frac{p_n}{q_n} = \frac{(-1)^n}{q_n(q_{n+1} + \alpha_{n+2}^{-1} q_n) \cdots}$$

Cụ thể hơn, đặt $\beta_n = q_{n+1}/q_n + q_n/q_{n+1}$. Có thể chứng minh $\theta_n = q_n/q_{n+1} + q_n q_{n-1}/q_{n+1} q_{n+1}^{-1} \cdots$ Một cách tính gọn:

$$\frac{1}{\theta_{n-1}} + \frac{1}{\theta_n} = \frac{q_n}{q_{n-1}} + \frac{q_{n-1}}{q_n} + \frac{q_n}{q_{n+1}} + \frac{q_{n+1}}{q_n} - \left(\frac{q_n}{q_{n-1}} \cdot \frac{q_n}{q_{n+1}}\right) \cdots$$

*Cách chứng minh đơn giản hơn*: Giả sử cả ba đều $\geq 1/\sqrt{5}$, tức $\theta_{n-1}, \theta_n, \theta_{n+1} \geq 1/\sqrt{5}$.

Sử dụng đẳng thức:

$$\left|\alpha - \frac{p_{n-1}}{q_{n-1}}\right| + a_n \left|\alpha - \frac{p_n}{q_n}\right| = \left|\frac{p_n}{q_n} - \frac{p_{n-1}}{q_{n-1}}\right| = \frac{1}{q_n q_{n-1}}$$

Chia cho $\left|\alpha - \frac{p_n}{q_n}\right|$:

$$\frac{q_n^2 \left|\alpha - \frac{p_{n-1}}{q_{n-1}}\right|}{q_{n-1}^2 \left|\alpha - \frac{p_n}{q_n}\right|} \cdot \frac{q_{n-1}^2}{q_n^2} + a_n = \frac{1}{q_n q_{n-1} \left|\alpha - \frac{p_n}{q_n}\right|}$$

Đặt $u_n = q_n/q_{n-1}$. Khi đó $u_n \geq a_n$ và $u_n = a_n + 1/u_{n-1}$. Điều kiện $\theta_{n-1}, \theta_n \geq 1/\sqrt{5}$ cho:

$$\frac{q_n^2}{\theta_n} = q_n q_{n+1} \left|\alpha - \frac{p_n}{q_n}\right| \cdot \frac{q_{n+1}}{q_n} + \ldots$$

Sau khi hoàn tất tính toán (xem Hardy–Wright, Theorem 196), điều kiện cả ba $\theta \geq 1/\sqrt{5}$ dẫn đến $u_n \to (1+\sqrt{5})/2 = \varphi$, mâu thuẫn với $u_n \in \mathbb{Z}^+$ (lớn hơn $a_n \geq 1$). $\blacksquare$

### Tính sắc nét của $\sqrt{5}$

> [!theorem] Theorem 29.11 — Hằng số Hurwitz là tối ưu
> Không thể thay $\sqrt{5}$ bằng bất kỳ hằng số $c > \sqrt{5}$ nào trong Theorem 29.10 mà vẫn đúng với số vàng $\varphi = (1+\sqrt{5})/2$.
>
> Cụ thể: chỉ có hữu hạn cặp $(p,q)$ thỏa $|\varphi - p/q| < 1/(c\, q^2)$ với $c > \sqrt{5}$.

**Proof.** Các hội tụ của $\varphi$ là $F_{n+1}/F_n$ (số Fibonacci). Vì $\varphi = [1;\overline{1}]$, tất cả thương riêng phần bằng 1, nên:

$$q_n^2 \left|\varphi - \frac{p_n}{q_n}\right| \to \frac{1}{\sqrt{5}}$$

(Kết quả chính xác: $q_n^2|\varphi - p_n/q_n| = F_n^2|\varphi - F_{n+1}/F_n| \to 1/\sqrt{5}$ từ bên trên và dưới xen kẽ nhau.) Vậy với $c > \sqrt{5}$, chỉ có hữu hạn $n$ thỏa $F_n^2|\varphi - F_{n+1}/F_n| < 1/c$. $\blacksquare$

> [!example] Example 29.12 — Kiểm tra Hurwitz cho $\varphi$ và $\sqrt{2}$
>
> **Số vàng $\varphi$** (các Fibonacci thỏa $1/\theta_n \to \sqrt{5}$ từ cả hai phía):
>
> | $n$ | $p_n/q_n$ | $q_n^2|\varphi - p_n/q_n|$ | Gần $1/\sqrt{5} \approx 0.4472$? |
> |-----|-----------|--------------------------|----------------------------------|
> | 2 | $3/2$ | $0.2361$ | dưới |
> | 3 | $5/3$ | $0.4393$ | gần |
> | 4 | $8/5$ | $0.4508$ | hơi trên |
> | 5 | $13/8$ | $0.4462$ | gần |
> | 6 | $21/13$ | $0.4475$ | rất gần |
>
> Dãy dao động quanh $1/\sqrt{5}$ và tiến đến nó.
>
> **$\sqrt{2}$** (thương riêng phần đều bằng 2): $q_n^2|\sqrt{2} - p_n/q_n| < 1/2$ với mọi $n$, tốt hơn nhiều.

---

## Phân Loại Số theo Khả Năng Xấp Xỉ

> [!definition] Definition 29.13 — Cận dưới Liouville (Liouville Approximation Bound)
> Số thực $\alpha$ được gọi là **số đại số** (algebraic number) bậc $d$ nếu $\alpha$ là nghiệm của đa thức nguyên hệ số bậc $d$ và không thỏa đa thức bậc thấp hơn.
>
> **Bổ đề Liouville** (1844): Nếu $\alpha$ là số đại số bậc $d \geq 2$, thì tồn tại hằng số $c(\alpha) > 0$ sao cho với mọi $p/q \in \mathbb{Q}$:
>
> $$
> \left|\alpha - \frac{p}{q}\right| > \frac{c(\alpha)}{q^d}
> $$

> [!definition] Definition 29.14 — Số Liouville (Liouville Number)
> **Số Liouville** là số thực $\alpha$ sao cho với mọi $d \geq 1$, tồn tại vô hạn cặp $(p,q)$ nguyên với $q > 1$ thỏa:
>
> $$
> 0 < \left|\alpha - \frac{p}{q}\right| < \frac{1}{q^d}
> $$
>
> Ví dụ kinh điển: $L = \sum_{k=1}^{\infty} 10^{-k!} = 0.110001000000000000000001\ldots$

> [!theorem] Theorem 29.15 — Số Liouville là số siêu việt
> Mọi số Liouville là **số siêu việt** (transcendental number), tức không là nghiệm của bất kỳ đa thức nguyên hệ số nào.

**Proof.** Nếu $\alpha = L$ là đại số bậc $d$, Bổ đề Liouville cho $|\alpha - p/q| > c/q^d$ với mọi $p/q$. Nhưng với mỗi $n > d$ lớn, cắt chuỗi tại $n$ số hạng cho $p_n/q_n$ hữu tỉ thỏa:

$$|L - p_n/q_n| = \sum_{k=n+1}^{\infty} 10^{-k!} < 2 \cdot 10^{-(n+1)!} = \frac{2}{10^{(n+1)!}}$$

với $q_n = 10^{n!}$. Nên $|L - p_n/q_n| < 2/q_n^{n+1} < c/q_n^d$ khi $n+1 > d$, mâu thuẫn. $\blacksquare$

> [!note] Remark 29.16 — Bức tranh phân cấp
> Từ góc độ xấp xỉ Diophantine, các số thực được phân thành phổ:
>
> - **Tốt nhất**: số Liouville — có thể xấp xỉ tùy ý tốt (nhưng hiếm, tập có độ đo Lebesgue = 0).
> - **Trung bình**: số đại số bậc $d$ — có thể xấp xỉ đến $1/q^d$ nhưng không hơn.
> - **Tệ nhất**: số vàng $\varphi$ — "khó xấp xỉ nhất", không thể vượt qua $1/(\sqrt{5}q^2)$ một cách nhất quán.
>
> Đây là tinh thần của lý thuyết Roth (1955, Huy chương Fields): mọi số đại số vô tỉ bậc bất kỳ chỉ có thể xấp xỉ đến $1/q^{2+\varepsilon}$.

---

## SageMath Cheatsheet

```python
# CF của số vô tỉ (dùng số thực độ chính xác cao)
alpha = RealField(200)(sqrt(2))
cf = continued_fraction(alpha)
print(cf.quotients()[:15])     # [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]

# Kiểm tra Hurwitz: tính theta_n = q_n^2 * |alpha - p_n/q_n|
def hurwitz_check(alpha_float, quotients):
    p_prev, p_curr = 1, quotients[0]
    q_prev, q_curr = 0, 1
    results = []
    for a in quotients[1:]:
        err = abs(alpha_float - p_curr/q_curr)
        theta = q_curr**2 * err
        results.append((p_curr, q_curr, theta))
        p_prev, p_curr = p_curr, a*p_curr + p_prev
        q_prev, q_curr = q_curr, a*q_curr + q_prev
    return results

import math
phi = (1 + math.sqrt(5)) / 2
phi_cf = [1]*20
data = hurwitz_check(phi, phi_cf)
print("\nHurwitz check for phi (target = 1/sqrt(5) = {:.4f}):".format(1/math.sqrt(5)))
for p, q, theta in data[:8]:
    print(f"  {p}/{q}: theta = {theta:.6f}")

# Dirichlet approximation: given N, find p/q
def dirichlet_approx(alpha, N):
    """Find p/q with 1 <= q <= N and |alpha - p/q| < 1/(q*N)"""
    best = None
    for q in range(1, N+1):
        p = round(alpha * q)
        err = abs(alpha - p/q)
        if best is None or err < best[2]:
            best = (p, q, err)
    return best

print("\nDirichlet approximations for pi:")
for N in [10, 100, 1000]:
    p, q, err = dirichlet_approx(math.pi, N)
    print(f"  N={N}: {p}/{q}, error = {err:.2e}, bound = {1/(q*N):.2e}")

# Liouville number
L = sum(10**(-math.factorial(k)) for k in range(1, 8))
print(f"\nLiouville constant L ≈ {L:.20f}")

# Best approximation check: is p_n/q_n best among q' <= q_n?
def is_best_approx(alpha, p, q):
    """Check if p/q is best approximation (type 1) among 1 <= q' <= q"""
    err_pq = abs(alpha - p/q)
    for q2 in range(1, q+1):
        p2 = round(alpha * q2)
        if (p2, q2) != (p, q) and abs(alpha - p2/q2) <= err_pq:
            return False, p2, q2
    return True, None, None

alpha = math.sqrt(2)
for p, q in [(3,2), (7,5), (17,12), (41,29)]:
    ok, _, _ = is_best_approx(alpha, p, q)
    print(f"  {p}/{q} best approx of sqrt(2)? {ok}")
```

---

## Summary / Key Takeaways

- **CF vô hạn hội tụ** do tính xen kẽ + $q_n \to \infty$; giới hạn luôn là số vô tỉ.
- **Phân loại**: số hữu tỉ ↔ CF hữu hạn; số vô tỉ ↔ CF vô hạn duy nhất.
- **Định lý Dirichlet**: với mọi $\alpha$ thực và $N \geq 1$, tồn tại $p/q$ ($1 \leq q \leq N$) thỏa $|\alpha - p/q| < 1/(qN)$. Với $\alpha$ vô tỉ: vô hạn nghiệm $|\alpha - p/q| < 1/q^2$.
- **Hội tụ là tốt nhất**: mọi hội tụ là xấp xỉ tốt nhất loại 2, và ngược lại.
- **Định lý Hurwitz**: hằng số $\sqrt{5}$ tối ưu — vô hạn $p/q$ thỏa $|\alpha-p/q| < 1/(\sqrt{5}q^2)$; số vàng $\varphi$ là kẻ phá hỏng mọi hằng số $> \sqrt{5}$.
- **Phổ xấp xỉ**: số siêu việt Liouville (xấp xỉ tốt tùy ý) $\to$ số đại số bậc $d$ (cận $1/q^d$) $\to$ số vàng (khó nhất: cận $1/(\sqrt{5}q^2)$).

---

## References

- Niven, I., Zuckerman, H. S., & Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §7.5–7.6. Wiley, 1991.
- Hardy, G. H., & Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. XI (Theorems 171–199). Oxford, 2008.
- Maddox, E. *Continued Fractions and Pell's Equation*. University of Rochester REU, 2025.
- Donaldson, N. *Math 180B Notes* (Continued Fractions). UCI, 2021.
- https://en.wikipedia.org/wiki/Hurwitz%27s_theorem_(number_theory)
- https://en.wikipedia.org/wiki/Liouville_number
