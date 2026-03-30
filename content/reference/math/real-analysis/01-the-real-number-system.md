---
title: "01. The Real Number System"
tags: [math, real-analysis, lesson-01]
aliases: [The Real Number System]
created: 2026-03-28
---

> **Prerequisites**: Làm quen với tập hợp, ánh xạ; Calculus cơ bản (khái niệm trực quan về số thực)
> **Objectives**:
> - Hiểu $\mathbb{R}$ là một ordered field hoàn chỉnh và tại sao $\mathbb{Q}$ không đủ
> - Nắm vững định nghĩa và tính chất của supremum / infimum
> - Chứng minh được tính chất Archimedean và mật độ của $\mathbb{Q}$ trong $\mathbb{R}$
> - Biết sử dụng epsilon-characterization của sup/inf trong chứng minh

---

## Motivation / Intuition

Tại sao chúng ta cần số thực? Xét bài toán cực kỳ đơn giản: tìm $x > 0$ sao cho $x^2 = 2$. Người Hy Lạp cổ đại đã chứng minh rằng không có số hữu tỷ nào thỏa mãn — $\sqrt{2} \notin \mathbb{Q}$. Điều này có nghĩa là $\mathbb{Q}$ có "lỗ hổng" (gaps): tập $\{q \in \mathbb{Q} \mid q^2 < 2\}$ bị chặn trên nhưng không có cận trên nhỏ nhất trong $\mathbb{Q}$.

Real Analysis bắt đầu bằng cách **lấp đầy những lỗ hổng này**. Hệ số thực $\mathbb{R}$ được xây dựng để là ordered field lớn nhất không có lỗ hổng — mọi tập con khác rỗng bị chặn trên đều có supremum trong $\mathbb{R}$. Đây gọi là **completeness** (tính đầy đủ), và toàn bộ giải tích được xây dựng trên nền tảng này.

---

## Ordered Field

### Definition

> [!definition] Definition 1.1 — Trường (Field)
> Một **trường** là bộ $(F, +, \cdot)$ với hai phép toán cộng và nhân thỏa mãn các tiên đề:
>
> - $(F, +)$ là nhóm Abel với phần tử đơn vị $0$
> - $(F \setminus \{0\}, \cdot)$ là nhóm Abel với phần tử đơn vị $1$
> - **Phân phối**: $a \cdot (b + c) = a \cdot b + a \cdot c$ với mọi $a, b, c \in F$

> [!definition] Definition 1.2 — Trường thứ tự (Ordered Field)
> Một **ordered field** là trường $F$ kèm theo một quan hệ thứ tự $<$ thỏa:
>
> 1. **Tam phân**: Với mọi $a, b \in F$, đúng một trong ba điều kiện sau: $a < b$, $a = b$, hoặc $b < a$
> 2. **Bắc cầu**: $a < b$ và $b < c$ suy ra $a < c$
> 3. **Tương thích với cộng**: $a < b$ suy ra $a + c < b + c$
> 4. **Tương thích với nhân**: $a < b$ và $c > 0$ suy ra $ac < bc$

> [!note] Remark 1.3
> Cả $\mathbb{Q}$ lẫn $\mathbb{R}$ đều là ordered fields. Nhưng chúng khác nhau ở một tính chất then chốt: **completeness**.

---

## Supremum và Infimum

### Definition

> [!definition] Definition 1.4 — Cận trên, cận dưới (Bounds)
> Cho $S \subseteq F$ với $F$ là ordered field.
>
> - $b \in F$ là **cận trên** (upper bound) của $S$ nếu $x \leq b$ với mọi $x \in S$
> - $a \in F$ là **cận dưới** (lower bound) của $S$ nếu $x \geq a$ với mọi $x \in S$
> - $S$ **bị chặn trên** (bounded above) nếu tồn tại cận trên; **bị chặn dưới** (bounded below) nếu tồn tại cận dưới
> - $S$ **bị chặn** (bounded) nếu vừa bị chặn trên vừa bị chặn dưới

> [!definition] Definition 1.5 — Supremum và Infimum
> Cho $S \subseteq F$ khác rỗng.
>
> - $\alpha \in F$ là **supremum** (cận trên nhỏ nhất, least upper bound) của $S$, ký hiệu $\alpha = \sup S$, nếu:
>   1. $\alpha$ là cận trên của $S$: $x \leq \alpha$ với mọi $x \in S$
>   2. $\alpha$ là cận trên nhỏ nhất: nếu $M$ là cận trên của $S$ thì $\alpha \leq M$
>
> - $\beta \in F$ là **infimum** (cận dưới lớn nhất, greatest lower bound) của $S$, ký hiệu $\beta = \inf S$, nếu:
>   1. $\beta$ là cận dưới của $S$: $x \geq \beta$ với mọi $x \in S$
>   2. $\beta$ là cận dưới lớn nhất: nếu $m$ là cận dưới của $S$ thì $\beta \geq m$

### Theorem

> [!theorem] Theorem 1.6 — Tính duy nhất của sup và inf
> Nếu $\sup S$ tồn tại thì nó là duy nhất. Tương tự với $\inf S$.

**Proof.**
Giả sử $\alpha$ và $\alpha'$ đều là supremum của $S$. Vì $\alpha$ là supremum và $\alpha'$ là cận trên, ta có $\alpha \leq \alpha'$. Ngược lại, vì $\alpha'$ là supremum và $\alpha$ là cận trên, ta có $\alpha' \leq \alpha$. Suy ra $\alpha = \alpha'$. $\blacksquare$

### Worked Example

> [!example] Example 1.7 — Tính sup và inf
> Tìm $\sup S$ và $\inf S$ trong các trường hợp:
>
> **(a)** $S = (0, 3) = \{x \in \mathbb{R} \mid 0 < x < 3\}$
>
> Ta thấy $3$ là cận trên của $S$. Nếu $M < 3$ là cận trên thì với $\varepsilon = 3 - M > 0$, điểm $x = M + \varepsilon/2 = (M+3)/2$ thỏa $x < 3$ và $x > M$, mâu thuẫn. Vậy $\sup S = 3$. Lưu ý $3 \notin S$.
>
> Tương tự, $\inf S = 0 \notin S$.
>
> **(b)** $S = \left\{\dfrac{1}{n} \mid n \in \mathbb{N}\right\} = \left\{1, \dfrac{1}{2}, \dfrac{1}{3}, \ldots\right\}$
>
> $\sup S = 1 \in S$ (đạt được). $\inf S = 0 \notin S$ (không đạt được).

> [!note] Remark 1.8
> Supremum **không nhất thiết thuộc** $S$. Đây là điểm khác biệt then chốt với maximum (phần tử lớn nhất): $\max S$ tồn tại khi và chỉ khi $\sup S \in S$.

### Theorem — Epsilon Characterization

> [!theorem] Theorem 1.9 — Epsilon-characterization của sup
> Cho $S \subseteq \mathbb{R}$ khác rỗng và bị chặn trên. Khi đó $\alpha = \sup S$ khi và chỉ khi:
>
> 1. $x \leq \alpha$ với mọi $x \in S$
> 2. Với mọi $\varepsilon > 0$, tồn tại $x \in S$ sao cho $x > \alpha - \varepsilon$

**Proof.**
($\Rightarrow$) Điều kiện (1) hiển nhiên. Với $\varepsilon > 0$, vì $\alpha - \varepsilon < \alpha$ nên $\alpha - \varepsilon$ không phải cận trên (do $\alpha$ là cận trên nhỏ nhất), nên tồn tại $x \in S$ với $x > \alpha - \varepsilon$.

($\Leftarrow$) Điều kiện (1) cho thấy $\alpha$ là cận trên. Giả sử $M < \alpha$ là một cận trên khác, đặt $\varepsilon = \alpha - M > 0$. Theo (2), tồn tại $x \in S$ với $x > \alpha - \varepsilon = M$, mâu thuẫn với giả sử $M$ là cận trên. Vậy $\alpha = \sup S$. $\blacksquare$

> [!note] Remark 1.10
> Đây là công cụ chứng minh quan trọng nhất liên quan đến sup/inf. Hầu hết các chứng minh trong Real Analysis sử dụng "$\varepsilon$-trick" này.

---

## Completeness Axiom (Tiên đề đầy đủ)

### Definition

> [!definition] Definition 1.11 — Least Upper Bound Property
> Một ordered field $F$ có **least upper bound property** (hay **completeness**) nếu: mọi tập con $S \subseteq F$ khác rỗng và bị chặn trên đều có supremum trong $F$.

> [!definition] Definition 1.12 — Số thực (Real Numbers)
> Hệ số thực $\mathbb{R}$ là ordered field **duy nhất** (sai khác đẳng cấu) thỏa mãn least upper bound property và chứa $\mathbb{Q}$.
>
> **Completeness Axiom**: Mọi $S \subseteq \mathbb{R}$, $S \neq \emptyset$, bị chặn trên đều có $\sup S \in \mathbb{R}$.

> [!warning] Counterexample 1.13 — $\mathbb{Q}$ không có least upper bound property
> Xét $S = \{q \in \mathbb{Q} \mid q^2 < 2\}$. Tập $S$ khác rỗng (chứa $1$) và bị chặn trên trong $\mathbb{Q}$ (chứa $2$). Tuy nhiên $\sup S = \sqrt{2} \notin \mathbb{Q}$, nên $S$ không có supremum trong $\mathbb{Q}$.
>
> Đây chính là "lỗ hổng" của $\mathbb{Q}$.

### Theorem

> [!theorem] Theorem 1.14 — Completeness kéo theo Greatest Lower Bound Property
> Mọi $S \subseteq \mathbb{R}$, $S \neq \emptyset$, bị chặn dưới đều có $\inf S \in \mathbb{R}$.

**Proof.**
Đặt $L = \{-x \mid x \in S\}$. Vì $S$ bị chặn dưới bởi $m$, ta có $-m$ là cận trên của $L$. Theo completeness axiom, $\alpha = \sup L$ tồn tại trong $\mathbb{R}$. Ta sẽ chứng minh $\inf S = -\alpha$.

- Với mọi $x \in S$, ta có $-x \in L$, nên $-x \leq \alpha$, tức $x \geq -\alpha$. Vậy $-\alpha$ là cận dưới của $S$.
- Nếu $m$ là cận dưới của $S$ thì với mọi $x \in S$: $x \geq m$, suy ra $-x \leq -m$, tức $-m$ là cận trên của $L$. Vậy $\alpha \leq -m$, tức $-\alpha \geq m$.

Suy ra $-\alpha = \inf S$. $\blacksquare$

---

## Tính chất Archimedean và mật độ của $\mathbb{Q}$

### Theorem

> [!theorem] Theorem 1.15 — Tính chất Archimedean (Archimedean Property)
> Với mọi $x \in \mathbb{R}$, tồn tại $n \in \mathbb{N}$ sao cho $n > x$.

**Proof.**
Phản chứng: giả sử tồn tại $x \in \mathbb{R}$ sao cho $n \leq x$ với mọi $n \in \mathbb{N}$. Khi đó $\mathbb{N}$ bị chặn trên bởi $x$, nên theo completeness axiom, $\alpha = \sup \mathbb{N}$ tồn tại trong $\mathbb{R}$.

Vì $\alpha - 1 < \alpha$ không phải cận trên, tồn tại $m \in \mathbb{N}$ với $m > \alpha - 1$, tức $m + 1 > \alpha$. Nhưng $m + 1 \in \mathbb{N}$ và $m + 1 > \alpha = \sup \mathbb{N}$, mâu thuẫn. $\blacksquare$

> [!corollary] Corollary 1.16
> **(a)** Với mọi $x > 0$, tồn tại $n \in \mathbb{N}$ sao cho $\dfrac{1}{n} < x$.
>
> **(b)** Với mọi $x \in \mathbb{R}$, tồn tại $n \in \mathbb{Z}$ sao cho $n \leq x < n+1$ (phần nguyên của $x$).

> [!theorem] Theorem 1.17 — Mật độ của $\mathbb{Q}$ trong $\mathbb{R}$ (Density of Rationals)
> Với mọi $a, b \in \mathbb{R}$ với $a < b$, tồn tại $q \in \mathbb{Q}$ sao cho $a < q < b$.

**Proof.**
Vì $b - a > 0$, theo Corollary 1.16(a) tồn tại $n \in \mathbb{N}$ sao cho $\dfrac{1}{n} < b - a$, tức $na + 1 \leq nb$ (sau khi nhân $n$).

Theo Corollary 1.16(b), tồn tại $m \in \mathbb{Z}$ với $m - 1 \leq na < m$, tức $m \leq na + 1 \leq nb$.

Ta có: $na < m$ và $m \leq nb$, suy ra $a < \dfrac{m}{n} \leq b$. Nếu $\dfrac{m}{n} = b$ thì $m = nb$ nguyên và $m \leq na + 1 < m + 1$ suy ra $na < nb$ tức $a < b$, lấy $q = \dfrac{m-1}{n}$ thỏa $a < q < b$. Vậy tồn tại $q \in \mathbb{Q}$ với $a < q < b$. $\blacksquare$

> [!theorem] Theorem 1.18 — Mật độ của số vô tỷ trong $\mathbb{R}$
> Với mọi $a, b \in \mathbb{R}$ với $a < b$, tồn tại $x \in \mathbb{R} \setminus \mathbb{Q}$ sao cho $a < x < b$.

**Proof.**
Áp dụng Theorem 1.17 cho $a/\sqrt{2}$ và $b/\sqrt{2}$: tồn tại $q \in \mathbb{Q}$ với $a/\sqrt{2} < q < b/\sqrt{2}$. Đặt $x = q\sqrt{2}$. Vì $\sqrt{2} \notin \mathbb{Q}$ và $q \neq 0$, ta có $x \notin \mathbb{Q}$, và $a < x < b$. $\blacksquare$

---

## Căn bậc hai và số vô tỷ

### Theorem

> [!theorem] Theorem 1.19 — $\sqrt{2} \notin \mathbb{Q}$
> Không tồn tại số hữu tỷ $p/q$ (tối giản) nào thỏa $(p/q)^2 = 2$.

**Proof.**
Giả sử $p/q$ tối giản và $(p/q)^2 = 2$, tức $p^2 = 2q^2$. Suy ra $p^2$ chẵn, nên $p$ chẵn, đặt $p = 2k$. Khi đó $4k^2 = 2q^2$, suy ra $q^2 = 2k^2$, nên $q$ chẵn. Mâu thuẫn với $p/q$ tối giản. $\blacksquare$

> [!theorem] Theorem 1.20 — Tồn tại $\sqrt{2}$ trong $\mathbb{R}$
> Tồn tại $x \in \mathbb{R}$, $x > 0$, sao cho $x^2 = 2$.

**Proof.**
Xét $S = \{t \in \mathbb{R} \mid t > 0, t^2 < 2\}$. Ta thấy $S \neq \emptyset$ (chứa $1$) và bị chặn trên (bởi $2$). Đặt $x = \sup S$.

Ta sẽ loại bỏ hai trường hợp $x^2 < 2$ và $x^2 > 2$:

**Nếu $x^2 < 2$**: Đặt $\varepsilon = \dfrac{2 - x^2}{2x + 1} > 0$. Kiểm tra:

$$
(x + \varepsilon)^2 = x^2 + 2x\varepsilon + \varepsilon^2 < x^2 + (2x+1)\varepsilon = x^2 + (2 - x^2) = 2
$$

Vậy $x + \varepsilon \in S$, mâu thuẫn với $x = \sup S$.

**Nếu $x^2 > 2$**: Đặt $\delta = \dfrac{x^2 - 2}{2x} > 0$. Kiểm tra:

$$
(x - \delta)^2 = x^2 - 2x\delta + \delta^2 > x^2 - 2x\delta = x^2 - (x^2 - 2) = 2
$$

Vậy $x - \delta$ là cận trên của $S$ nhỏ hơn $x$, mâu thuẫn với $x = \sup S$.

Suy ra $x^2 = 2$. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Làm việc với sup/inf trong SageMath (symbolic)
from sympy import Rational, sqrt, S

# Kiểm tra sqrt(2) không phải hữu tỷ
print(sqrt(2).is_rational)  # False

# Interval arithmetic
from sympy import Interval
S_interval = Interval(0, 3, left_open=True, right_open=True)
print(S_interval.sup)  # 3
print(S_interval.inf)  # 0

# Archimedean property: tìm n > x
import math
x = 7.3
n = math.ceil(x) + 1
print(f"n = {n} > x = {x}")  # n = 8 > x = 7.3

# Density: tìm rational q trong (a, b)
from fractions import Fraction
def find_rational(a, b):
    # Tìm n sao cho 1/n < b - a
    n = math.ceil(1 / (b - a)) + 1
    m = math.floor(a * n) + 1
    return Fraction(m, n)

q = find_rational(1.4, 1.5)
print(f"q = {q} in (1.4, 1.5): {1.4 < float(q) < 1.5}")
```

---

## Summary / Key Takeaways

- $\mathbb{R}$ là ordered field duy nhất (sai khác đẳng cấu) có **least upper bound property** (completeness).
- $\mathbb{Q}$ thiếu completeness: tồn tại tập con bị chặn trên không có sup trong $\mathbb{Q}$.
- **Supremum** = cận trên nhỏ nhất; **Infimum** = cận dưới lớn nhất. Cả hai đều duy nhất (nếu tồn tại).
- **Epsilon-characterization**: $\alpha = \sup S \Leftrightarrow$ ($\alpha$ là cận trên) và ($\forall \varepsilon > 0$, $\exists x \in S$: $x > \alpha - \varepsilon$).
- **Archimedean property**: $\mathbb{N}$ không bị chặn trong $\mathbb{R}$; với mọi $\varepsilon > 0$, $\exists n \in \mathbb{N}$: $1/n < \varepsilon$.
- Cả $\mathbb{Q}$ và $\mathbb{R} \setminus \mathbb{Q}$ đều **dày đặc** (dense) trong $\mathbb{R}$: mọi khoảng $(a, b)$ đều chứa số hữu tỷ và số vô tỷ.
- $\sqrt{2} \notin \mathbb{Q}$ nhưng $\sqrt{2} \in \mathbb{R}$: sự tồn tại của $\sqrt{2}$ là hệ quả trực tiếp của completeness.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 1.
- Folland, G. B. *Real Analysis: Modern Techniques and Their Applications* (2nd ed.), Chapter 1.
- Lebl, J. *Basic Analysis I*, Chapter 1–2. (Free: https://www.jirka.org/ra/)
- MIT 18.100A Lecture Notes — Dr. Casey Rodriguez, Fall 2020.
