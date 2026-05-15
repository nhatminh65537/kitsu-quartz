---
title: "30. CF Tuần Hoàn và Phương Trình Pell"
type: theory
tags: [math, number-theory, lesson-30, continued-fractions, pell-equation]
aliases: [Periodic Continued Fractions, Pell Equation]
created: 2026-05-15
---

> **Prerequisites**: [[29-infinite-continued-fractions-and-best-approximation|29. CF Vô Hạn và Xấp Xỉ Tốt Nhất]], [[05-congruences|05. Quan Hệ Đồng Dư]]
> **Objectives**:
> - Hiểu CF thuần tuần hoàn (purely periodic) và biểu diễn số vô tỉ bậc hai thu gọn
> - Phát biểu và hiểu ý nghĩa của Định Lý Lagrange về CF tuần hoàn
> - Tính CF của $\sqrt{d}$ và xác định chu kỳ, tính chất đặc biệt
> - Giải phương trình Pell $x^2 - dy^2 = 1$ bằng CF và mô tả toàn bộ nghiệm

---

## Motivation / Intuition

Khi tính CF của $\sqrt{19} = 4.35889\ldots$, thuật toán cho:

$$\sqrt{19} = [4;\, 2, 1, 3, 1, 2, 8, \; 2, 1, 3, 1, 2, 8, \; \ldots] = [4;\, \overline{2, 1, 3, 1, 2, 8}]$$

Dãy thương riêng phần **lặp lại** với chu kỳ 6! Đây không phải trùng hợp — **Định Lý Lagrange** (1770) nói rằng CF của $\alpha$ tuần hoàn nếu và chỉ nếu $\alpha$ là số vô tỉ bậc hai. Hơn nữa, CF của $\sqrt{d}$ luôn có dạng $[a_0;\, \overline{a_1, \ldots, a_{r-1}, 2a_0}]$, và hội tụ cuối chu kỳ cho nghiệm của **phương trình Pell** $x^2 - dy^2 = 1$ — bài toán đã quyến rũ các nhà toán học từ Ấn Độ thế kỷ 7 đến Fermat thế kỷ 17.

---

## Phân Số Liên Tục Tuần Hoàn

### Definition

> [!definition] Definition 30.1 — CF tuần hoàn (Periodic Continued Fraction)
> CF vô hạn $\alpha = [a_0;\, a_1, a_2, \ldots]$ được gọi là **tuần hoàn** (periodic) nếu tồn tại $k \geq 0$ và $r \geq 1$ sao cho $a_{n+r} = a_n$ với mọi $n \geq k$.
>
> Ký hiệu: $\alpha = [a_0;\, a_1, \ldots, a_{k-1}, \overline{a_k, \ldots, a_{k+r-1}}]$, trong đó phần được gạch ngang là chu kỳ (period) độ dài $r$.
>
> Nếu $k = 0$ (tuần hoàn ngay từ đầu), $\alpha$ được gọi là **thuần tuần hoàn** (purely periodic): $\alpha = [\overline{a_0;\, a_1, \ldots, a_{r-1}}]$.

> [!example] Example 30.2 — Ví dụ CF tuần hoàn
> - $\sqrt{2} = [1;\, \overline{2}]$: chu kỳ $= (2)$, độ dài $1$.
> - $\sqrt{3} = [1;\, \overline{1, 2}]$: chu kỳ $= (1, 2)$, độ dài $2$.
> - $\sqrt{19} = [4;\, \overline{2, 1, 3, 1, 2, 8}]$: chu kỳ độ dài $6$.
> - Số vàng $\varphi = [1;\, \overline{1}] = [\overline{1}]$: thuần tuần hoàn.
> - $(1+\sqrt{3})/2 = [\overline{1, 2}]$: thuần tuần hoàn, chu kỳ độ dài $2$.

### Số vô tỉ bậc hai thu gọn

> [!definition] Definition 30.3 — Số vô tỉ bậc hai thu gọn (Reduced Quadratic Irrational)
> Số thực $\alpha$ được gọi là **số vô tỉ bậc hai** (quadratic irrational) nếu $\alpha = (a + b\sqrt{d})/c$ với $a, b, c, d \in \mathbb{Z}$, $b, d > 0$, $d$ không phải số chính phương.
>
> Số liên hợp (conjugate) của $\alpha$ là $\alpha' = (a - b\sqrt{d})/c$.
>
> $\alpha$ được gọi là **thu gọn** (reduced) nếu $\alpha > 1$ và $-1 < \alpha' < 0$.

> [!theorem] Theorem 30.4 — CF thuần tuần hoàn ↔ số vô tỉ bậc hai thu gọn (Galois)
> $\alpha > 1$ có CF thuần tuần hoàn nếu và chỉ nếu $\alpha$ là số vô tỉ bậc hai thu gọn.

**Proof ($\Rightarrow$).** Giả sử $\alpha = [\overline{a_0;\, a_1, \ldots, a_{r-1}}]$. Khi đó $\alpha$ thỏa phương trình bậc hai có hệ số nguyên (vì tính tuần hoàn dẫn đến phương trình đại số — xem A4), nên $\alpha$ là số vô tỉ bậc hai. Điều kiện $\alpha > 1$ rõ vì $a_0 \geq 1$. Tính chất liên hợp $-1 < \alpha' < 0$ đòi hỏi phân tích kỹ hơn (xem A4). $\blacksquare$

**Proof ($\Leftarrow$).** Được chứng minh trong [[a4-proof-of-lagrange-periodic-cf-theorem|A4. Định Lý Lagrange]].

---

## Định Lý Lagrange về CF Tuần Hoàn

> [!theorem] Theorem 30.5 — Định Lý Lagrange (1770)
> CF vô hạn $[a_0;\, a_1, a_2, \ldots]$ là **tuần hoàn** (eventually periodic) nếu và chỉ nếu số mà nó biểu diễn là **số vô tỉ bậc hai** (quadratic irrational).

**Proof.** Chứng minh đầy đủ trong [[a4-proof-of-lagrange-periodic-cf-theorem|A4. Định Lý Lagrange]]. Ý tưởng:

- *Chiều $\Leftarrow$*: Nếu $\alpha$ là số vô tỉ bậc hai, các complete quotient $\alpha_k$ đều là số vô tỉ bậc hai trên cùng trường $\mathbb{Q}(\sqrt{d})$. Dữ liệu xác định $\alpha_k$ là bộ ba nguyên $(m_k, n_k, a_0)$ với $\alpha_k = (a_0 + m_k)/n_k$ (xem A4); có hữu hạn bộ ba như vậy, nên phải có $\alpha_j = \alpha_k$ với $j > k$ → tuần hoàn.

- *Chiều $\Rightarrow$*: CF tuần hoàn thỏa phương trình đại số bậc hai. $\blacksquare$

---

## CF của $\sqrt{d}$ — Cấu Trúc Đặc Biệt

> [!theorem] Theorem 30.6 — Cấu trúc CF của $\sqrt{d}$
> Với $d \in \mathbb{Z}^+$ không phải số chính phương, đặt $a_0 = \lfloor \sqrt{d} \rfloor$. Khi đó:
>
> $$
> \sqrt{d} = [a_0;\, \overline{a_1, a_2, \ldots, a_{r-1}, 2a_0}]
> $$
>
> Tức là: chu kỳ luôn kết thúc bằng $2a_0$, và các thương riêng phần trong chu kỳ (trừ số cuối) là **đối xứng**: $a_k = a_{r-k}$ với $1 \leq k \leq r-1$.

**Proof sketch.** Từ thuật toán CF với $\alpha_0 = \sqrt{d}$:
- $a_0 = \lfloor \sqrt{d} \rfloor$, $\alpha_1 = 1/(\sqrt{d} - a_0) = (\sqrt{d} + a_0)/(d - a_0^2)$.
- Dạng tổng quát: $\alpha_k = (\sqrt{d} + m_k)/n_k$ với các hệ thức truy hồi cho $m_k, n_k$.
- Khi $\alpha_k = \sqrt{d} + a_0$ (tức $m_k = a_0$, $n_k = 1$), ta có $a_k = \lfloor \sqrt{d} + a_0 \rfloor = 2a_0$ và chu kỳ kết thúc.
- Tính đối xứng xuất phát từ liên hệ giữa $\alpha_k$ và $1/(\sqrt{d}/n_{r-k} - m_{r-k}/n_{r-k})$. $\blacksquare$

> [!example] Example 30.7 — CF của $\sqrt{d}$ với các giá trị $d$ nhỏ
>
> | $d$ | $a_0$ | Chu kỳ | $r$ | Đối xứng |
> |-----|--------|---------|-----|----------|
> | $2$ | $1$ | $(2)$ | $1$ | $-$ |
> | $3$ | $1$ | $(1, 2)$ | $2$ | $(a_1 = a_1)$ |
> | $5$ | $2$ | $(4)$ | $1$ | $-$ |
> | $6$ | $2$ | $(2, 4)$ | $2$ | $(a_1 = a_1)$ |
> | $7$ | $2$ | $(1, 1, 1, 4)$ | $4$ | $(a_1 = a_3 = 1)$ |
> | $11$ | $3$ | $(3, 6)$ | $2$ | $(a_1 = a_1)$ |
> | $13$ | $3$ | $(1, 1, 1, 1, 6)$ | $5$ | $(a_1 = a_4 = 1, a_2 = a_3 = 1)$ |
> | $19$ | $4$ | $(2, 1, 3, 1, 2, 8)$ | $6$ | $(a_1=a_5=2, a_2=a_4=1, a_3=3)$ |
>
> Lưu ý: số cuối chu kỳ luôn là $2a_0$.

---

## Phương Trình Pell

> [!definition] Definition 30.8 — Phương Trình Pell (Pell Equation)
> Cho $d \in \mathbb{Z}^+$ không phải số chính phương. **Phương trình Pell** là:
>
> $$
> x^2 - d\, y^2 = 1, \qquad x, y \in \mathbb{Z}, \quad y > 0
> $$
>
> Biến thể: **Phương trình Pell âm**: $x^2 - dy^2 = -1$.

### Vì sao phương trình Pell quan trọng?

Bài toán Pell đã thu hút các nhà toán học nhiều thế kỷ. Brahmaguptapluralis (thế kỷ 7) và Bhāskara II (thế kỷ 12) giải trường hợp cụ thể. Fermat (1657) thách đố cộng đồng toán học châu Âu với $x^2 - 61y^2 = 1$. Lagrange (1768–1770) tổng quát hóa hoàn toàn bằng lý thuyết CF.

> [!theorem] Theorem 30.9 — Phương trình Pell và hội tụ
> Đặt $\sqrt{d} = [a_0;\, \overline{a_1, \ldots, a_{r-1}, 2a_0}]$ với chu kỳ độ dài $r$.
>
> **(i)** $x = p_{r-1}$, $y = q_{r-1}$ (hội tụ cuối chu kỳ thứ nhất) là nghiệm của:
>
> $$
> \begin{cases}
> x^2 - dy^2 = (-1)^r & \text{(dấu phụ thuộc vào độ lẻ-chẵn của } r\text{)}
> \end{cases}
> $$
>
> **(ii) Nghiệm cơ bản** của $x^2 - dy^2 = 1$:
> - Nếu $r$ chẵn: $(x_1, y_1) = (p_{r-1}, q_{r-1})$.
> - Nếu $r$ lẻ: $(x_1, y_1) = (p_{2r-1}, q_{2r-1})$ (phải chạy hai chu kỳ).
>
> **(iii)** Phương trình Pell âm $x^2 - dy^2 = -1$ có nghiệm nếu và chỉ nếu $r$ lẻ; nghiệm cơ bản là $(p_{r-1}, q_{r-1})$.
>
> **(iv)** Mọi nghiệm dương $(x_n, y_n)$ của $x^2 - dy^2 = 1$ được cho bởi:
>
> $$
> x_n + y_n \sqrt{d} = (x_1 + y_1\sqrt{d})^n, \quad n \geq 1
> $$

**Proof của (i).** Dùng biểu diễn $\alpha_k = (\sqrt{d} + m_k)/n_k$ và tính chất hội tụ. Cụ thể, có thể chứng minh:

$$p_{k}^2 - d\, q_{k}^2 = (-1)^{k+1} n_{k+1}$$

Khi $k = r-1$ (cuối chu kỳ), $n_r = 1$ (do $\alpha_r = \alpha_0 + 2a_0$ có $n_r = 1$), nên $p_{r-1}^2 - d\, q_{r-1}^2 = (-1)^r$. $\blacksquare$

**Proof của (iv).** Mọi nghiệm dương của phương trình Pell tạo thành nhóm $\mathbb{Z}$ với phép nhân trên $\mathbb{Z}[\sqrt{d}]$: $(x+y\sqrt{d})(x'+y'\sqrt{d})$ cũng thỏa phương trình Pell nếu $x^2-dy^2 = x'^2-dy'^2 = 1$. Phần tử nhỏ nhất (nghiệm cơ bản) sinh ra toàn nhóm. $\blacksquare$

> [!example] Example 30.10 — Giải $x^2 - 2y^2 = 1$
> $\sqrt{2} = [1;\, \overline{2}]$, chu kỳ $r = 1$ (lẻ) → cần hai chu kỳ: $[1;\, 2, 2]$.
>
> Bảng hội tụ:
>
> | $k$ | $a_k$ | $p_k$ | $q_k$ | $p_k^2 - 2q_k^2$ |
> |-----|--------|--------|--------|------------------|
> | $-1$ | — | $1$ | $0$ | — |
> | $0$ | $1$ | $1$ | $1$ | $-1$ |
> | $1$ | $2$ | $3$ | $2$ | $1$ ← **nghiệm!** |
>
> Nghiệm cơ bản: $(x_1, y_1) = (3, 2)$.
>
> Dãy nghiệm: $x_n + y_n\sqrt{2} = (3 + 2\sqrt{2})^n$:
>
> | $n$ | $(x_n, y_n)$ | Kiểm tra $x^2 - 2y^2$ |
> |-----|-------------|----------------------|
> | $1$ | $(3, 2)$ | $9 - 8 = 1$ ✓ |
> | $2$ | $(17, 12)$ | $289 - 288 = 1$ ✓ |
> | $3$ | $(99, 70)$ | $9801 - 9800 = 1$ ✓ |
> | $4$ | $(577, 408)$ | $332929 - 332928 = 1$ ✓ |

> [!example] Example 30.11 — Giải $x^2 - 7y^2 = 1$
> $\sqrt{7} = [2;\, \overline{1, 1, 1, 4}]$, chu kỳ $r = 4$ (chẵn).
>
> Hội tụ cuối chu kỳ $r-1 = 3$:
>
> | $k$ | $a_k$ | $p_k$ | $q_k$ | $p_k^2 - 7q_k^2$ |
> |-----|--------|--------|--------|------------------|
> | $0$ | $2$ | $2$ | $1$ | $-3$ |
> | $1$ | $1$ | $3$ | $1$ | $2$ |
> | $2$ | $1$ | $5$ | $2$ | $-3$ |
> | $3$ | $1$ | $8$ | $3$ | $1$ ← **nghiệm!** |
>
> Nghiệm cơ bản: $(x_1, y_1) = (8, 3)$. Kiểm tra: $64 - 7 \cdot 9 = 64 - 63 = 1$ ✓.

> [!example] Example 30.12 — Giải $x^2 - 61y^2 = 1$ (Thách đố Fermat)
> $\sqrt{61} = [7;\, \overline{1,4,3,1,2,2,1,3,4,1,14}]$, chu kỳ $r = 11$ (lẻ → cần 2 chu kỳ).
>
> Hội tụ $p_{21}, q_{21}$ cho nghiệm cơ bản:
>
> $$
> (x_1, y_1) = (1\,766\,319\,049,\; 226\,153\,980)
> $$
>
> Kiểm tra: $1766319049^2 - 61 \cdot 226153980^2 = 1$ ✓. Đây là con số khổng lồ mà Fermat yêu cầu!

---

## Phân Tích Sâu Hơn: Công Thức Truy Hồi

> [!theorem] Theorem 30.13 — Truy hồi cho thuật toán CF của $\sqrt{d}$
> Thuật toán CF cho $\sqrt{d}$ sản sinh các bộ ba nguyên $(m_k, n_k, a_k)$ theo quy tắc:
>
> $$
> \begin{aligned}
> m_0 &= 0, & n_0 &= 1, & a_0 &= \lfloor \sqrt{d} \rfloor \\
> m_{k+1} &= a_k n_k - m_k, & n_{k+1} &= \dfrac{d - m_{k+1}^2}{n_k}, & a_{k+1} &= \left\lfloor \dfrac{a_0 + m_{k+1}}{n_{k+1}} \right\rfloor
> \end{aligned}
> $$
>
> Với $\alpha_k = (\sqrt{d} + m_k)/n_k$, $a_k = \lfloor \alpha_k \rfloor$, các $m_k, n_k$ đều là số nguyên dương, và $n_k \mid (d - m_k^2)$.

**Proof.** Quy nạp: $\alpha_{k+1} = 1/(\alpha_k - a_k) = n_k/(\sqrt{d} - (a_k n_k - m_k)) = n_k/(\sqrt{d} - m_{k+1})$. Nhân tử và mẫu với $(\sqrt{d} + m_{k+1})$: $\alpha_{k+1} = n_k(\sqrt{d}+m_{k+1})/(d-m_{k+1}^2) = (\sqrt{d}+m_{k+1})/n_{k+1}$ với $n_{k+1} = (d-m_{k+1}^2)/n_k \in \mathbb{Z}$. $\blacksquare$

> [!example] Example 30.13b — Truy hồi cho $\sqrt{19}$
>
> | $k$ | $m_k$ | $n_k$ | $a_k$ | $\alpha_k = (\sqrt{19}+m_k)/n_k$ |
> |-----|--------|--------|--------|----------------------------------|
> | $0$ | $0$ | $1$ | $4$ | $\sqrt{19} \approx 4.359$ |
> | $1$ | $4$ | $3$ | $2$ | $(\sqrt{19}+4)/3 \approx 2.786$ |
> | $2$ | $2$ | $5$ | $1$ | $(\sqrt{19}+2)/5 \approx 1.272$ |
> | $3$ | $3$ | $2$ | $3$ | $(\sqrt{19}+3)/2 \approx 3.679$ |
> | $4$ | $3$ | $5$ | $1$ | $(\sqrt{19}+3)/5 \approx 1.472$ |
> | $5$ | $2$ | $3$ | $2$ | $(\sqrt{19}+2)/3 \approx 2.453$ |
> | $6$ | $4$ | $1$ | $8$ | $\sqrt{19}+4 \approx 8.359$ → $a_6 = 8 = 2a_0$ → hết chu kỳ |

---

## Tính Vô Hạn Nghiệm và Không Có Nghiệm

> [!theorem] Theorem 30.14 — Luôn có nghiệm, và vô hạn nghiệm
> Phương trình Pell $x^2 - dy^2 = 1$ với $d$ không phải số chính phương luôn có nghiệm nguyên dương $(x_1, y_1)$ — nghiệm cơ bản. Từ đó sinh ra vô hạn nghiệm.

**Proof.** Tồn tại: Vì CF của $\sqrt{d}$ tuần hoàn (Lagrange), hội tụ cuối chu kỳ cho nghiệm.

Vô hạn nghiệm: Nếu $(x_1, y_1)$ là nghiệm cơ bản, đặt $\varepsilon = x_1 + y_1\sqrt{d}$. Khi đó $\varepsilon^n > 1$ cho mọi $n \geq 1$, và mỗi $\varepsilon^n = x_n + y_n\sqrt{d}$ với $x_n, y_n \in \mathbb{Z}^+$ thỏa $x_n^2 - dy_n^2 = (x_1^2 - dy_1^2)^n = 1$. Các $\varepsilon^n$ tất cả khác nhau vì $\varepsilon > 1$. $\blacksquare$

> [!warning] Warning 30.15 — Khi $d$ là số chính phương
> Nếu $d = k^2$ thì $x^2 - dy^2 = (x-ky)(x+ky) = 1$ chỉ có nghiệm $y = 0$, $x = \pm 1$ (tầm thường). Lý thuyết Pell chỉ áp dụng cho $d$ không phải số chính phương.

---

## SageMath Cheatsheet

```python
# CF của sqrt(d)
cf = continued_fraction(sqrt(19))
print(cf)                   # [4; (2, 1, 3, 1, 2, 8)]  ← period in parens
print(cf.period())          # (2, 1, 3, 1, 2, 8)
print(len(cf.period()))     # 6

# Thuật toán CF thủ công cho sqrt(d)
def cf_sqrt(d):
    import math
    a0 = int(math.isqrt(d))
    if a0 * a0 == d:
        return [a0], []
    qs = [a0]
    m, n = 0, 1
    seen = {}
    period_start = None
    while True:
        m = n * qs[-1] - m
        n = (d - m * m) // n
        a = (a0 + m) // n
        state = (m, n)
        if state in seen:
            period_start = seen[state]
            break
        seen[state] = len(qs)
        qs.append(a)
    period = qs[period_start:]
    return qs[:period_start], period

pre, period = cf_sqrt(19)
print(f"sqrt(19) = {pre} + period {period}")  # [4] + [2,1,3,1,2,8]

# Nghiệm phương trình Pell x^2 - d*y^2 = 1
def pell_fundamental(d):
    pre, period = cf_sqrt(d)
    r = len(period)
    # Nếu r chẵn: lấy hội tụ thứ r-1, nếu r lẻ: thứ 2r-1
    quotients = pre + period * (2 if r % 2 == 1 else 1)
    p_prev, p_curr = 1, quotients[0]
    q_prev, q_curr = 0, 1
    for a in quotients[1:]:
        p_prev, p_curr = p_curr, a*p_curr + p_prev
        q_prev, q_curr = q_curr, a*q_curr + q_prev
    x, y = p_curr, q_curr
    assert x*x - d*y*y == 1, f"Verification failed: {x}^2 - {d}*{y}^2 = {x*x - d*y*y}"
    return x, y

for d in [2, 3, 5, 7, 11, 13, 19]:
    x, y = pell_fundamental(d)
    print(f"  x^2 - {d}y^2 = 1: fundamental solution ({x}, {y})")

# Từ nghiệm cơ bản sinh tất cả nghiệm
def pell_all_solutions(d, n_solutions=5):
    x1, y1 = pell_fundamental(d)
    import math
    sqrt_d = math.sqrt(d)
    solutions = []
    for n in range(1, n_solutions + 1):
        # x_n + y_n*sqrt(d) = (x1 + y1*sqrt(d))^n
        xn = round((x1 + y1*sqrt_d)**n / 2 + (x1 - y1*sqrt_d)**n / 2)
        yn = round(((x1 + y1*sqrt_d)**n - (x1 - y1*sqrt_d)**n) / (2*sqrt_d))
        solutions.append((xn, yn))
    return solutions

print("\nAll solutions of x^2 - 2y^2 = 1:")
for n, (x, y) in enumerate(pell_all_solutions(2), 1):
    print(f"  n={n}: ({x}, {y}), check = {x*x - 2*y*y}")

# Truy hồi hiệu quả hơn
def pell_solutions_recurrence(d, n):
    x1, y1 = pell_fundamental(d)
    xk, yk = x1, y1
    results = [(xk, yk)]
    for _ in range(n - 1):
        xk, yk = x1*xk + d*y1*yk, y1*xk + x1*yk
        results.append((xk, yk))
    return results

print("\nSolutions of x^2 - 7y^2 = 1 (via recurrence):")
for x, y in pell_solutions_recurrence(7, 4):
    print(f"  ({x}, {y}): check = {x*x - 7*y*y}")
```

---

## Summary / Key Takeaways

- **CF tuần hoàn** ↔ **số vô tỉ bậc hai** (Định Lý Lagrange, chứng minh trong A4).
- **CF thuần tuần hoàn** ↔ **số vô tỉ bậc hai thu gọn** (Định Lý Galois).
- $\sqrt{d} = [a_0;\, \overline{a_1, \ldots, a_{r-1}, 2a_0}]$ — chu kỳ kết thúc bằng $2a_0$, phần giữa đối xứng.
- Hội tụ cuối chu kỳ $(p_{r-1}, q_{r-1})$ thỏa $p_{r-1}^2 - dq_{r-1}^2 = (-1)^r$.
- **Nghiệm cơ bản** Pell: dùng chu kỳ $r$ nếu chẵn; hai chu kỳ $2r$ nếu lẻ.
- **Vô hạn nghiệm**: $x_n + y_n\sqrt{d} = (x_1 + y_1\sqrt{d})^n$ — sinh từ nghiệm cơ bản bằng lũy thừa.
- **Truy hồi**: $x_{n+1} = x_1 x_n + dy_1 y_n$, $y_{n+1} = y_1 x_n + x_1 y_n$ (không cần tính lũy thừa số thực).
- Phương trình Pell âm $x^2-dy^2=-1$ có nghiệm ↔ $r$ lẻ.

---

## References

- Niven, I., Zuckerman, H. S., & Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §7.7–7.9. Wiley, 1991.
- Hardy, G. H., & Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. X (Theorems 170–184). Oxford, 2008.
- Ireland, K., & Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), Ch. 17. Springer, 1990.
- Yang, S. H. *Continued Fractions and Pell's Equation*. UChicago REU, 2008. https://www.math.uchicago.edu/~may/VIGRE/VIGRE2008/REUPapers/Yang.pdf
- https://crypto.stanford.edu/pbc/notes/contfrac/pell.html
