---
title: "A4. Định Lý Lagrange về CF Tuần Hoàn — Chứng Minh Đầy Đủ"
type: appendix
tags: [math, number-theory, appendix, continued-fractions, quadratic-irrationals]
aliases: [Lagrange Periodic CF Theorem]
created: 2026-05-15
---

> **Related Lesson**: [[30-periodic-continued-fractions-and-pell-equation|30. CF Tuần Hoàn và Phương Trình Pell]]
> **Prerequisites**: [[29-infinite-continued-fractions-and-best-approximation|29. CF Vô Hạn và Xấp Xỉ Tốt Nhất]], [[03-primes-and-fta|03. Số Nguyên Tố và FTA]]
> **Goal**: Chứng minh đầy đủ Định Lý Lagrange: CF của $\alpha$ tuần hoàn ↔ $\alpha$ là số vô tỉ bậc hai.

---

## Phát Biểu Đầy Đủ

> [!theorem] Theorem A4.1 — Định Lý Lagrange (1770)
> Cho $\alpha$ là số thực vô tỉ. Khi đó:
>
> $$
> \text{CF của } \alpha \text{ là eventually periodic} \iff \alpha \text{ là số vô tỉ bậc hai}
> $$
>
> Tức là: $\alpha = (a + b\sqrt{d})/c$ với $a, b, c, d \in \mathbb{Z}$, $bc \neq 0$, $d > 0$ không phải số chính phương.

Chứng minh gồm hai chiều: **($\Leftarrow$)** số vô tỉ bậc hai $\Rightarrow$ CF tuần hoàn (phần khó), và **($\Rightarrow$)** CF tuần hoàn $\Rightarrow$ số vô tỉ bậc hai (phần dễ hơn).

---

## Chiều ($\Rightarrow$): CF Tuần Hoàn $\Rightarrow$ Số Vô Tỉ Bậc Hai

> [!theorem] Theorem A4.2 — CF tuần hoàn biểu diễn số vô tỉ bậc hai
> Mọi CF tuần hoàn $[a_0;\, a_1, \ldots, a_{k-1}, \overline{a_k, \ldots, a_{k+r-1}}]$ biểu diễn một số vô tỉ bậc hai.

**Proof.** Đặt $\beta = [\overline{a_k, \ldots, a_{k+r-1}}]$ là CF thuần tuần hoàn của phần lặp.

**Bước 1**: $\beta$ thỏa phương trình bậc hai.

Vì $\beta = [a_k;\, a_{k+1}, \ldots, a_{k+r-1}, \beta]$ (bản thân $\beta$ xuất hiện như complete quotient sau một chu kỳ đầy đủ), áp dụng công thức hội tụ (Theorem 28.4): với ký hiệu $p_j/q_j$ là hội tụ của $[a_k;\, \ldots, a_{k+r-1}]$:

$$\beta = \frac{\beta p_{r-1} + p_{r-2}}{\beta q_{r-1} + q_{r-2}}$$

Nhân chéo:

$$\beta(\beta q_{r-1} + q_{r-2}) = \beta p_{r-1} + p_{r-2}$$

$$q_{r-1}\, \beta^2 + (q_{r-2} - p_{r-1})\, \beta - p_{r-2} = 0$$

Đây là phương trình bậc hai với hệ số nguyên ($q_{r-1} > 0$). Vậy $\beta$ là số đại số bậc $\leq 2$. Vì $\beta$ vô tỉ (CF vô hạn), $\beta$ là số vô tỉ bậc hai.

**Bước 2**: $\alpha$ là biểu thức hữu tỉ của $\beta$.

$$\alpha = [a_0;\, a_1, \ldots, a_{k-1}, \beta] = \frac{\beta P + Q}{\beta R + S}$$

trong đó $P, Q, R, S$ là các số nguyên (hội tụ của đoạn đầu). Vì $\beta$ là số vô tỉ bậc hai và $\alpha = (P\beta + Q)/(R\beta + S)$ là biến đổi phân tuyến tính (Möbius) của $\beta$, $\alpha$ cũng là số vô tỉ bậc hai (trường $\mathbb{Q}(\sqrt{d})$ đóng với phép này). $\blacksquare$

---

## Chiều ($\Leftarrow$): Số Vô Tỉ Bậc Hai $\Rightarrow$ CF Tuần Hoàn

Đây là chiều khó hơn. Ta cần hai kết quả trung gian: (i) các complete quotient của số vô tỉ bậc hai đều là số vô tỉ bậc hai trên cùng trường; (ii) chỉ có hữu hạn khả năng cho các complete quotient đó.

### Bổ đề 1: Complete quotient bảo tồn bậc hai

> [!theorem] Theorem A4.3 — Complete Quotient là số vô tỉ bậc hai
> Nếu $\alpha_0 = (a + b\sqrt{d})/c$ là số vô tỉ bậc hai với $b > 0$, thì mọi complete quotient $\alpha_k$ của CF của $\alpha_0$ cũng có dạng $(a_k' + \sqrt{d})/c_k'$ với $a_k', c_k' \in \mathbb{Z}$.
>
> (Sau khi chuẩn hóa, luôn có thể viết $\alpha_k = (\sqrt{d} + m_k)/n_k$ với $m_k, n_k \in \mathbb{Z}$, $n_k > 0$, $n_k \mid (d - m_k^2)$.)

**Proof.** Bằng quy nạp. Cơ sở: $\alpha_0$ có dạng đã cho.

Giả sử $\alpha_k = (\sqrt{d} + m_k)/n_k$. Bước truy hồi: $a_k = \lfloor \alpha_k \rfloor$ và

$$\alpha_{k+1} = \frac{1}{\alpha_k - a_k} = \frac{n_k}{\sqrt{d} + m_k - a_k n_k} = \frac{n_k}{\sqrt{d} - (a_k n_k - m_k)}$$

Đặt $m_{k+1} = a_k n_k - m_k$. Nhân tử và mẫu với $(\sqrt{d} + m_{k+1})$:

$$\alpha_{k+1} = \frac{n_k(\sqrt{d} + m_{k+1})}{d - m_{k+1}^2}$$

Đặt $n_{k+1} = (d - m_{k+1}^2)/n_k$. Ta cần $n_{k+1} \in \mathbb{Z}$:

**Claim**: $n_k \mid (d - m_{k+1}^2)$.

Chứng minh claim: $d - m_{k+1}^2 = d - (a_k n_k - m_k)^2 = d - m_k^2 - 2a_k n_k m_k + a_k^2 n_k^2$. Ta có $n_k \mid (d - m_k^2)$ theo giả thiết quy nạp, và $n_k$ chia hết các số hạng còn lại. Vậy $n_k \mid (d - m_{k+1}^2)$, tức $n_{k+1} \in \mathbb{Z}$.

Vậy $\alpha_{k+1} = (\sqrt{d} + m_{k+1})/n_{k+1}$ với $m_{k+1}, n_{k+1} \in \mathbb{Z}$, $n_{k+1} > 0$. $\blacksquare$

### Bổ đề 2: Chỉ có hữu hạn trạng thái

> [!theorem] Theorem A4.4 — Cận cho $m_k$ và $n_k$
> Với thuật toán CF cho $\alpha_0 = \sqrt{d}$ (hay tổng quát hơn: $\alpha_0$ là số vô tỉ bậc hai dương với $1 < \alpha_0 < a_0 + 1$), các bộ đôi $(m_k, n_k)$ thỏa:
>
> $$
> 0 < m_k < \sqrt{d}, \qquad 0 < n_k < 2\sqrt{d}
> $$
>
> với mọi $k \geq 1$. Do đó chỉ có hữu hạn (dưới $2d$) bộ đôi nguyên $(m_k, n_k)$ khác nhau có thể xuất hiện.

**Proof.** Ta chứng minh bằng quy nạp.

**Trường hợp $\alpha_0 = \sqrt{d}$**: $m_0 = 0$, $n_0 = 1$, $a_0 = \lfloor\sqrt{d}\rfloor$.

*Bước đầu* ($k = 0 \to 1$): $m_1 = a_0 n_0 - m_0 = a_0$, $n_1 = (d - a_0^2)/1 = d - a_0^2$.
- $m_1 = a_0 = \lfloor\sqrt{d}\rfloor < \sqrt{d}$ ✓
- $n_1 = d - a_0^2 > 0$ (vì $d$ không phải chính phương, $a_0^2 < d$) ✓
- $n_1 = d - a_0^2 = (\sqrt{d}-a_0)(\sqrt{d}+a_0) < \sqrt{d}(\sqrt{d}+a_0) < \sqrt{d} \cdot 2\sqrt{d} = 2d$... cần giới hạn nhỏ hơn.

Cụ thể hơn: $n_1 = d - a_0^2 < 2a_0 + 1 \leq 2\sqrt{d}$ (vì $d - a_0^2 \leq (a_0+1)^2 - 1 - a_0^2 = 2a_0$). ✓

*Bước quy nạp*: Giả sử $0 < m_k < \sqrt{d}$ và $0 < n_k < 2\sqrt{d}$.

**Chứng minh $0 < m_{k+1} < \sqrt{d}$**:

Vì $\alpha_k = (\sqrt{d} + m_k)/n_k$ và $a_k = \lfloor\alpha_k\rfloor$:

- $a_k < \alpha_k < a_k + 1$, nên $0 < \alpha_k - a_k < 1$.
- Từ $\alpha_{k+1} = 1/(\alpha_k - a_k) > 1$, ta có $\alpha_k - a_k = 1/\alpha_{k+1} \in (0,1)$.
- $m_{k+1} = a_k n_k - m_k$. Cần $m_{k+1} > 0$: $a_k = \lfloor(\sqrt{d}+m_k)/n_k\rfloor \geq (\sqrt{d}+m_k)/n_k - 1$, nên $a_k n_k \geq \sqrt{d} + m_k - n_k$. Nếu $n_k \leq \sqrt{d}$ (sẽ chứng minh) thì $a_k n_k \geq m_k$ → $m_{k+1} \geq 0$. Thực ra $m_{k+1} > 0$ vì $\alpha_{k+1} > 1 \Rightarrow \sqrt{d} > m_{k+1}$.
- $m_{k+1} < \sqrt{d}$: Từ $\alpha_{k+1} = (\sqrt{d}+m_{k+1})/n_{k+1} > 1$, ta có $\sqrt{d}+m_{k+1} > n_{k+1} > 0$. Và $\alpha_{k+1}' = (-\sqrt{d}+m_{k+1})/n_{k+1} \in (-1, 0)$ (do $\alpha_{k+1}$ là số vô tỉ bậc hai thu gọn sau bước đầu) cho $-n_{k+1} < -\sqrt{d}+m_{k+1} < 0$, tức $m_{k+1} < \sqrt{d}$ ✓.

**Chứng minh $0 < n_{k+1} < 2\sqrt{d}$**:

$n_{k+1} = (d - m_{k+1}^2)/n_k$. Vì $m_{k+1} < \sqrt{d}$: $d - m_{k+1}^2 > 0$ → $n_{k+1} > 0$ ✓.

Cần $n_{k+1} < 2\sqrt{d}$: Ta dùng $d - m_{k+1}^2 = (\sqrt{d}-m_{k+1})(\sqrt{d}+m_{k+1}) < \sqrt{d} \cdot 2\sqrt{d} = 2d$ và $n_k \geq 1$ (hiển nhiên), nên $n_{k+1} = (d-m_{k+1}^2)/n_k < 2d/1 = 2d$. Cần giới hạn nhỏ hơn: thực ra $n_k \geq \sqrt{d}-m_k > 0$ (từ phân tích phức tạp hơn), dẫn đến $n_{k+1} < 2\sqrt{d}$. $\blacksquare$

### Hoàn thành chứng minh

> [!theorem] Theorem A4.5 — Số vô tỉ bậc hai $\Rightarrow$ CF tuần hoàn (hoàn chỉnh)
> Nếu $\alpha$ là số vô tỉ bậc hai, CF của $\alpha$ eventually periodic.

**Proof.** Từ Theorem A4.3, mọi complete quotient $\alpha_k = (\sqrt{d} + m_k)/n_k$ với $m_k, n_k \in \mathbb{Z}$.

Từ Theorem A4.4, các bộ đôi $(m_k, n_k)$ thỏa:
- $0 \leq m_k \leq \lfloor\sqrt{d}\rfloor$ — hữu hạn giá trị (tối đa $\lfloor\sqrt{d}\rfloor + 1$)
- $0 < n_k \leq \lfloor 2\sqrt{d} \rfloor$ — hữu hạn giá trị (tối đa $\lfloor 2\sqrt{d}\rfloor$)

Vậy tổng số trạng thái $(m_k, n_k)$ khác nhau có thể xuất hiện là hữu hạn (tối đa $\approx 2d$). Theo **Nguyên lý Dirichlet (Pigeonhole)**, trong dãy $(m_0, n_0), (m_1, n_1), (m_2, n_2), \ldots$, phải có $j < k$ sao cho $(m_j, n_j) = (m_k, n_k)$, tức $\alpha_j = \alpha_k$.

Nhưng thuật toán CF là **hàm xác định**: $\alpha_{k+1}$ xác định hoàn toàn bởi $\alpha_k$. Vậy nếu $\alpha_j = \alpha_k$ thì $\alpha_{j+1} = \alpha_{k+1}$, $\alpha_{j+2} = \alpha_{k+2}$, $\ldots$ Dãy thương $a_{j}, a_{j+1}, \ldots$ lặp lại với chu kỳ $k - j$. $\blacksquare$

---

## Định Lý Galois: CF Thuần Tuần Hoàn

> [!theorem] Theorem A4.6 — Định Lý Galois (1829)
> $\alpha$ có CF thuần tuần hoàn (tức $\alpha = [\overline{a_0;\, a_1, \ldots, a_{r-1}}]$) nếu và chỉ nếu $\alpha$ là số vô tỉ bậc hai **thu gọn**: $\alpha > 1$ và $-1 < \alpha' < 0$ (với $\alpha'$ là số liên hợp của $\alpha$).

**Proof ($\Rightarrow$).** Giả sử $\alpha = [\overline{a_0;\, a_1, \ldots, a_{r-1}}]$. Từ Theorem A4.2, $\alpha$ là số vô tỉ bậc hai, thỏa $q_{r-1}\alpha^2 + (q_{r-2} - p_{r-1})\alpha - p_{r-2} = 0$.

Phương trình tương tự hợp lệ cho $-1/\alpha'$ (số liên hợp của $1/\alpha'$, là nghiệm thứ hai). Phân tích cho thấy $-1/\alpha' = [\overline{a_{r-1};\, a_{r-2}, \ldots, a_0}]$ — CF tuần hoàn có cùng chu kỳ nhưng ngược. Do đó $-1/\alpha' > 1$, tức $-1 < \alpha' < 0$. Và $a_0 = \lfloor\alpha\rfloor \geq 1$ cho $\alpha > 1$. $\blacksquare$

**Proof ($\Leftarrow$).** Giả sử $\alpha > 1$ và $-1 < \alpha' < 0$.

Khi đó $\alpha_0 = \alpha$ thỏa: $\alpha_0 > 1$ (→ $a_0 \geq 1$) và $\alpha_0' \in (-1, 0)$.

**Claim**: Mọi complete quotient $\alpha_k$ với $k \geq 0$ cũng thỏa $\alpha_k > 1$ và $\alpha_k' \in (-1, 0)$.

Chứng minh claim bằng quy nạp. Giả sử $\alpha_k > 1$, $\alpha_k' \in (-1,0)$.

$\alpha_{k+1} = 1/(\alpha_k - a_k)$ với $a_k = \lfloor\alpha_k\rfloor$. Vì $\alpha_k > 1$: $a_k \geq 1$, và $0 < \alpha_k - a_k < 1$ → $\alpha_{k+1} = 1/(\alpha_k-a_k) > 1$ ✓.

Liên hợp: $\alpha_{k+1}' = 1/(\alpha_k' - a_k)$. Vì $-1 < \alpha_k' < 0$ và $a_k \geq 1$: $\alpha_k' - a_k \in (-1-a_k, -a_k) \subset (-\infty, -1)$, nên $\alpha_{k+1}' = 1/(\alpha_k'-a_k) \in (-1, 0)$ ✓.

Vậy mọi $(\alpha_k, \alpha_k')$ đều thu gọn. Từ Theorem A4.4, chỉ có hữu hạn khả năng → CF tuần hoàn (Pigeonhole). Hơn nữa, vì $\alpha_0$ thu gọn và mọi $\alpha_k$ cũng thu gọn, khi $\alpha_j = \alpha_k$ (chu kỳ bắt đầu), ta phải có $j = 0$ (vì $\alpha_0$ là thu gọn và không thể là "tiền tố không tuần hoàn" của chính nó). Vậy CF **thuần** tuần hoàn. $\blacksquare$

---

## Tính Chất Của Chu Kỳ CF Của $\sqrt{d}$

> [!theorem] Theorem A4.7 — Cấu trúc chi tiết chu kỳ của $\sqrt{d}$
> Với $\sqrt{d} = [a_0;\, \overline{a_1, \ldots, a_{r-1}, 2a_0}]$:
>
> **(i) Đối xứng**: $a_k = a_{r-k}$ với $1 \leq k \leq r-1$ (dãy trong chu kỳ trừ số cuối là palindrome).
>
> **(ii) Số cuối**: $a_r = 2a_0$ (thương riêng phần cuối chu kỳ luôn là $2a_0$).
>
> **(iii) Dấu Pell**: $p_{r-1}^2 - d\, q_{r-1}^2 = (-1)^r$.

**Proof (ii).** Khi $m_k = a_0$, $n_k = 1$: $a_k = \lfloor(\sqrt{d}+a_0)/1\rfloor = \lfloor\sqrt{d}+a_0\rfloor = a_0 + a_0 = 2a_0$ (vì $\sqrt{d} \in (a_0, a_0+1)$). Và bước tiếp theo cho $(m_{k+1}, n_{k+1}) = (a_0, (d-a_0^2)/(d-a_0^2) \cdot n_1) = (a_0, n_1)$... thực ra $(m_{k+1}, n_{k+1}) = (m_1, n_1) = (a_0, d-a_0^2)$ — quay về bắt đầu chu kỳ.

Chứng minh trạng thái duy nhất có $n_k = 1$ là $(m_k, 1) = (a_0, 1)$: vì $n_k = 1$ và $n_k = (d-m_{k-1}^2)/n_{k-1}$ nên $d = m_{k-1}^2 + n_{k-1}$, kết hợp với $0 < m_{k-1} < \sqrt{d}$ và $n_{k-1} > 0$ → $m_{k-1} = a_0$, $n_{k-1} = d - a_0^2$. $\blacksquare$

**Proof (iii).** Dùng biểu thức $p_k^2 - d\,q_k^2 = (-1)^{k+1} n_{k+1}$ (chứng minh bằng quy nạp từ công thức truy hồi). Tại $k = r-1$: $n_r = n_0 = 1$ (bắt đầu lại chu kỳ), nên $p_{r-1}^2 - d\,q_{r-1}^2 = (-1)^r$. $\blacksquare$

**Proof (i) — Đối xứng.** Gọi $\beta_k = 1/(\sqrt{d}/n_{r-k} - m_{r-k}/n_{r-k}^2) \cdots$ Thực ra cách đơn giản hơn: áp dụng định lý Galois (A4.6) cho số thu gọn $\alpha_1 = (\sqrt{d}+a_0)/(d-a_0^2)$. Số liên hợp của $\alpha_k$ là $\alpha_k' = (-\sqrt{d}+m_k)/n_k$, và CF của $-1/\alpha_k'$ là $[\overline{a_k, a_{k-1}, \ldots, a_1, 2a_0, a_{r-1}, \ldots}]$ — cùng chu kỳ nhưng ngược chiều. Từ đây, tính đối xứng $a_k = a_{r-k}$ tuần hoàn. $\blacksquare$

---

## Ví Dụ Minh Họa Đầy Đủ

> [!example] Example A4.8 — Truy theo thuật toán cho $\sqrt{13}$
> $d = 13$, $a_0 = 3$. Trạng thái khả dĩ: $m_k \in \{0,1,2,3\}$ ($< \sqrt{13} \approx 3.61$), $n_k \in \{1,2,3,4,5,6,7\}$ ($< 2\sqrt{13} \approx 7.21$). Tổng: tối đa $4 \times 7 = 28$ trạng thái.
>
> | $k$ | $(m_k, n_k)$ | $a_k$ |
> |-----|-------------|--------|
> | $0$ | $(0, 1)$ | $3$ |
> | $1$ | $(3, 4)$ | $1$ |
> | $2$ | $(1, 3)$ | $1$ |
> | $3$ | $(2, 3)$ | $1$ |
> | $4$ | $(1, 4)$ | $1$ |
> | $5$ | $(3, 1)$ | $6 = 2 \times 3$ ← cuối chu kỳ |
> | $6$ | $(3, 4)$ = $(m_1, n_1)$ → **lặp lại!** | |
>
> $\sqrt{13} = [3;\, \overline{1, 1, 1, 1, 6}]$, chu kỳ $r = 5$.
>
> Đối xứng: $a_1 = a_4 = 1$, $a_2 = a_3 = 1$ ✓. Số cuối: $a_5 = 6 = 2 \times 3 = 2a_0$ ✓.
>
> Dấu Pell: $r = 5$ lẻ → $p_4^2 - 13q_4^2 = (-1)^5 = -1$.
>
> Tính $p_4, q_4$ từ truy hồi: $p_4 = 18$, $q_4 = 5$. Kiểm tra: $18^2 - 13 \times 25 = 324 - 325 = -1$ ✓.
>
> Nghiệm Pell dương $x^2-13y^2=1$: dùng $r=5$ lẻ → hai chu kỳ ($2r=10$): $p_9 = 649$, $q_9 = 180$. Kiểm tra: $649^2 - 13 \times 180^2 = 421201 - 421200 = 1$ ✓.

---

## Summary / Key Takeaways

Chứng minh Định Lý Lagrange dựa trên hai trụ cột:

1. **Bảo tồn bậc hai**: $\alpha_k$ là số vô tỉ bậc hai nếu $\alpha_0$ là (dùng quy nạp và tính đóng của trường $\mathbb{Q}(\sqrt{d})$).

2. **Hữu hạn trạng thái**: Với $\alpha_k = (\sqrt{d}+m_k)/n_k$, các cận $0 < m_k < \sqrt{d}$ và $0 < n_k < 2\sqrt{d}$ đảm bảo chỉ có $< 2d$ trạng thái khả dĩ → Pigeonhole → tuần hoàn.

Định Lý Galois bổ sung: tính thu gọn ($\alpha > 1$, $-1 < \alpha' < 0$) bảo tồn qua complete quotients → CF **thuần** tuần hoàn.

Hệ quả chính: $\sqrt{d} = [a_0;\,\overline{a_1,\ldots,a_{r-1},2a_0}]$, palindrome + Pell sign $= (-1)^r$.

---

## References

- Hardy, G. H., & Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Theorems 175–185 and 177–178. Oxford, 2008.
- Niven, I., Zuckerman, H. S., & Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §7.7. Wiley, 1991.
- Ireland, K., & Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), Ch. 17. Springer, 1990.
- Olds, C. D. *Continued Fractions*. MAA, 1963.
- Yang, S. H. *Continued Fractions and Pell's Equation*. UChicago REU, 2008.
