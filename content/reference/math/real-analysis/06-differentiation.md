---
title: "06. Differentiation"
tags: [math, real-analysis, lesson-06]
aliases: [Differentiation]
created: 2026-03-28
---

> **Prerequisites**: [[05-continuity|05. Continuity]] — Liên tục, đặc trưng theo dãy; [[04-sequences-and-series|04. Sequences & Series]] — Giới hạn
> **Objectives**:
> - Định nghĩa đạo hàm nghiêm ngặt và chứng minh liên tục không kéo theo khả vi
> - Nắm và vận dụng Mean Value Theorem cùng các hệ quả quan trọng
> - Hiểu L'Hôpital's Rule và các điều kiện áp dụng
> - Phát biểu và sử dụng Taylor's Theorem với remainder chính xác
> - Phân tích hàm lồi (convex functions) qua đạo hàm

---

## Motivation / Intuition

Đạo hàm là "tốc độ thay đổi" — nhưng định nghĩa chính xác đòi hỏi khái niệm giới hạn. Điều thú vị ở mức graduate là những gì mà Calculus coi là "hiển nhiên" lại không phải vậy: hàm liên tục khắp nơi nhưng **không khả vi ở đâu** (Weierstrass, 1872) — một cú sốc lớn với toán học thế kỷ 19.

Mean Value Theorem (MVT) là định lý trung tâm của chương: từ nó suy ra mọi thứ từ đơn điệu, L'Hôpital đến Taylor. Và Taylor's Theorem chính là "phiên bản hữu hạn" của khai triển power series — cầu nối sang phân tích phức và phân tích hàm.

---

## Đạo hàm (The Derivative)

### Definition

> [!definition] Definition 6.1 — Đạo hàm tại một điểm
> Cho $f: [a,b] \to \mathbb{R}$ và $x \in [a,b]$. **Đạo hàm** (derivative) của $f$ tại $x$ là:
>
> $$
> f'(x) = \lim_{t \to x} \frac{f(t) - f(x)}{t - x}
> $$
>
> nếu giới hạn này tồn tại (hữu hạn). Khi đó $f$ được gọi là **khả vi** (differentiable) tại $x$.
>
> Nếu $f$ khả vi tại mọi $x \in (a,b)$ thì $f$ khả vi trên $(a,b)$.

> [!theorem] Theorem 6.2 — Khả vi kéo theo liên tục
> Nếu $f$ khả vi tại $x$ thì $f$ liên tục tại $x$.

**Proof.**
Viết $f(t) - f(x) = \dfrac{f(t)-f(x)}{t-x} \cdot (t-x)$. Khi $t \to x$: vế phải tiến đến $f'(x) \cdot 0 = 0$. Vậy $\lim_{t \to x} f(t) = f(x)$. $\blacksquare$

> [!warning] Counterexample 6.3 — Liên tục **không** kéo theo khả vi
> **(a)** $f(x) = |x|$ liên tục tại $0$ nhưng không khả vi: tỉ số $\dfrac{|t|-0}{t-0} = \text{sign}(t)$ có giới hạn phải $+1$ và trái $-1$, không bằng nhau.
>
> **(b) Hàm Weierstrass** (1872):
>
> $$
> W(x) = \sum_{n=0}^\infty a^n \cos(b^n \pi x), \quad 0 < a < 1,\; ab > 1 + \tfrac{3\pi}{2}
> $$
>
> là hàm liên tục khắp nơi nhưng **không khả vi tại bất kỳ điểm nào** — phản ví dụ đánh đổ niềm tin rằng "hàm liên tục ắt phải trơn ở đâu đó".

### Theorem

> [!theorem] Theorem 6.4 — Quy tắc tính đạo hàm
> Nếu $f, g$ khả vi tại $x$:
>
> 1. $(f + g)' = f' + g'$, $(cf)' = cf'$
> 2. **Leibniz rule**: $(fg)' = f'g + fg'$
> 3. **Quotient rule**: $\left(\dfrac{f}{g}\right)' = \dfrac{f'g - fg'}{g^2}$ (khi $g(x) \neq 0$)
> 4. **Chain rule**: $(g \circ f)'(x) = g'(f(x)) \cdot f'(x)$ (khi $f$ khả vi tại $x$, $g$ khả vi tại $f(x)$)

> [!theorem] Theorem 6.5 — Điều kiện cần cho cực trị nội bộ
> Nếu $f: [a,b] \to \mathbb{R}$ có cực đại (hoặc cực tiểu) cục bộ tại $x \in (a,b)$ và $f$ khả vi tại $x$, thì $f'(x) = 0$.

**Proof.**
Giả sử $f$ đạt cực đại tại $x$, tức tồn tại $\delta > 0$: $f(t) \leq f(x)$ với $|t-x| < \delta$.

Với $t \in (x-\delta, x)$: $\dfrac{f(t)-f(x)}{t-x} \geq 0$ (tử $\leq 0$, mẫu $< 0$). Cho $t \to x^-$: $f'(x) \geq 0$.

Với $t \in (x, x+\delta)$: $\dfrac{f(t)-f(x)}{t-x} \leq 0$. Cho $t \to x^+$: $f'(x) \leq 0$.

Vậy $f'(x) = 0$. $\blacksquare$

---

## Mean Value Theorems

### Theorem

> [!theorem] Theorem 6.6 — Rolle's Theorem
> Nếu $f: [a,b] \to \mathbb{R}$ liên tục trên $[a,b]$, khả vi trên $(a,b)$, và $f(a) = f(b)$, thì tồn tại $c \in (a,b)$ sao cho $f'(c) = 0$.

**Proof.**
Theo EVT (Theorem 5.6), $f$ đạt max và min trên $[a,b]$. Nếu cả hai đều đạt tại đầu mút, $f$ hằng và $f' \equiv 0$. Ngược lại, $f$ đạt max hoặc min tại một điểm $c \in (a,b)$, và theo Theorem 6.5: $f'(c) = 0$. $\blacksquare$

> [!theorem] Theorem 6.7 — Mean Value Theorem (MVT)
> Nếu $f: [a,b] \to \mathbb{R}$ liên tục trên $[a,b]$ và khả vi trên $(a,b)$, thì tồn tại $c \in (a,b)$ sao cho:
>
> $$
> f'(c) = \frac{f(b) - f(a)}{b - a}
> $$

**Proof.**
Đặt $g(x) = f(x) - \dfrac{f(b)-f(a)}{b-a}(x-a)$. Khi đó $g(a) = f(a) = g(b)$. Áp dụng Rolle's Theorem cho $g$: tồn tại $c$ với $g'(c) = 0$, tức $f'(c) = \dfrac{f(b)-f(a)}{b-a}$. $\blacksquare$

> [!theorem] Theorem 6.8 — Cauchy's Mean Value Theorem
> Nếu $f, g: [a,b] \to \mathbb{R}$ liên tục trên $[a,b]$, khả vi trên $(a,b)$, thì tồn tại $c \in (a,b)$ sao cho:
>
> $$
> [f(b) - f(a)]\, g'(c) = [g(b) - g(a)]\, f'(c)
> $$

**Proof.**
Đặt $h(x) = [f(b)-f(a)]g(x) - [g(b)-g(a)]f(x)$. Thì $h(a) = f(b)g(a) - g(b)f(a) = h(b)$. Áp dụng Rolle cho $h$. $\blacksquare$

### Corollary

> [!corollary] Corollary 6.9 — Hệ quả của MVT
>
> **(a) Hàm hằng**: Nếu $f'(x) = 0$ với mọi $x \in (a,b)$ thì $f$ hằng trên $(a,b)$.
>
> **(b) Đơn điệu**: Nếu $f'(x) \geq 0$ (resp. $> 0$) với mọi $x \in (a,b)$ thì $f$ đơn điệu không giảm (resp. tăng nghiêm ngặt).
>
> **(c) Lipschitz**: Nếu $|f'(x)| \leq M$ với mọi $x \in (a,b)$ thì $|f(x) - f(y)| \leq M|x-y|$ với mọi $x, y \in (a,b)$.

**Proof của (a):** Với $x, y \in (a,b)$, $x < y$: theo MVT, $f(y) - f(x) = f'(c)(y-x) = 0$. $\blacksquare$

### Worked Example

> [!example] Example 6.10 — Áp dụng MVT
>
> **(a)** Chứng minh $|\sin x - \sin y| \leq |x - y|$ với mọi $x, y \in \mathbb{R}$.
>
> Áp dụng MVT: tồn tại $c$ với $\sin x - \sin y = \cos(c)(x-y)$. Vì $|\cos c| \leq 1$: $|\sin x - \sin y| \leq |x-y|$. ✓
>
> **(b)** Chứng minh $e^x \geq 1 + x$ với mọi $x \in \mathbb{R}$.
>
> Đặt $f(x) = e^x - 1 - x$. Thì $f(0) = 0$ và $f'(x) = e^x - 1$.
> - Với $x > 0$: $f'(x) > 0$, nên $f$ tăng, vậy $f(x) > f(0) = 0$.
> - Với $x < 0$: $f'(x) < 0$, nên $f$ giảm, vậy $f(x) > f(0) = 0$. ✓

---

## L'Hôpital's Rule

### Theorem

> [!theorem] Theorem 6.11 — L'Hôpital's Rule
> Giả sử $f, g: (a,b) \to \mathbb{R}$ khả vi, $g'(x) \neq 0$ trên $(a,b)$, và:
>
> $$
> \lim_{x \to a^+} \frac{f'(x)}{g'(x)} = L \in [-\infty, +\infty]
> $$
>
> Nếu $\lim_{x \to a^+} f(x) = \lim_{x \to a^+} g(x) = 0$ **(dạng $0/0$)**, hoặc $\lim_{x \to a^+} |g(x)| = +\infty$ **(dạng $\infty/\infty$)**, thì:
>
> $$
> \lim_{x \to a^+} \frac{f(x)}{g(x)} = L
> $$

**Proof sketch (dạng $0/0$).** Với $x \in (a,b)$, áp dụng Cauchy's MVT cho $f, g$ trên $[x, b']$ (với $b' < b$ gần $a$): tồn tại $c \in (a, x)$ sao cho:

$$
\frac{f(x)}{g(x)} = \frac{f(x) - f(a)}{g(x) - g(a)} = \frac{f'(c)}{g'(c)}
$$

(đặt $f(a) = g(a) = 0$). Khi $x \to a^+$, $c \to a^+$, nên vế phải $\to L$. $\blacksquare$

> [!warning] Counterexample 6.12 — Khi L'Hôpital **không** áp dụng được
>
> $\lim_{x \to \infty} \dfrac{x + \sin x}{x}$: Tử và mẫu đều $\to \infty$ (dạng $\infty/\infty$). Đạo hàm tỉ số: $\dfrac{1 + \cos x}{1}$ — **không có giới hạn** (dao động giữa $0$ và $2$). Nhưng giới hạn ban đầu tồn tại: $\dfrac{x + \sin x}{x} = 1 + \dfrac{\sin x}{x} \to 1$.
>
> L'Hôpital không áp dụng khi $\lim f'/g'$ không tồn tại (kể cả $\pm\infty$) — nhưng điều này **không** có nghĩa là giới hạn gốc không tồn tại.

---

## Taylor's Theorem

### Theorem

> [!theorem] Theorem 6.13 — Taylor's Theorem (với Lagrange Remainder)
> Giả sử $f: [a,b] \to \mathbb{R}$ có đạo hàm bậc $n$ liên tục trên $[a,b]$ và $f^{(n+1)}$ tồn tại trên $(a,b)$. Với bất kỳ $x, \alpha \in [a,b]$, tồn tại $c$ nằm giữa $x$ và $\alpha$ sao cho:
>
> $$
> f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(\alpha)}{k!}(x-\alpha)^k + \underbrace{\frac{f^{(n+1)}(c)}{(n+1)!}(x-\alpha)^{n+1}}_{\text{Lagrange remainder } R_n(x)}
> $$

**Proof.** Đặt $P(x) = \sum_{k=0}^n \dfrac{f^{(k)}(\alpha)}{k!}(x-\alpha)^k$ và $R_n(x) = f(x) - P(x)$. Đặt $M$ là hằng số thỏa:

$$
R_n(x) = M(x - \alpha)^{n+1}
$$

Định nghĩa $g(t) = f(x) - P_t(x) - M(x-t)^{n+1}$ trong đó $P_t(x) = \sum_{k=0}^n \dfrac{f^{(k)}(t)}{k!}(x-t)^k$. Ta có $g(\alpha) = 0$ và $g(x) = 0$. Áp dụng Rolle's Theorem $(n+1)$ lần, rút ra $g^{(n+1)}(c) = 0$ cho một $c$ giữa $\alpha$ và $x$, từ đó suy ra giá trị của $M$. $\blacksquare$

> [!corollary] Corollary 6.14 — Công thức Taylor với Cauchy Remainder
> Ngoài Lagrange remainder, còn có **Cauchy remainder**:
>
> $$
> R_n(x) = \frac{f^{(n+1)}(c)}{n!}(x-c)^n(x-\alpha)
> $$
>
> với $c$ giữa $\alpha$ và $x$. Hai dạng remainder cho kết quả khác nhau nhưng đều hữu ích.

### Worked Example

> [!example] Example 6.15 — Khai triển Taylor và ước lượng sai số
>
> **(a) Khai triển $e^x$ quanh $\alpha = 0$** đến bậc $n$:
>
> $$
> e^x = 1 + x + \frac{x^2}{2!} + \cdots + \frac{x^n}{n!} + \frac{e^c}{(n+1)!}x^{n+1}
> $$
>
> với $c$ giữa $0$ và $x$.
>
> *Ước lượng $e$ bằng $n = 10$*: Sai số $|R_{10}(1)| \leq \dfrac{e}{11!} < \dfrac{3}{39916800} < 10^{-7}$.
>
> **(b) Chứng minh $\pi$ vô tỷ** (ý tưởng qua Taylor): Khai triển $\sin(\pi) = 0$ và dùng Taylor để chứng minh không có phân số $p/q$ thỏa $\sin(p/q) = 0$ (ngoài $0$) — đây là ý tưởng sau định lý Lindemann-Weierstrass.
>
> **(c) $\ln(1+x)$ quanh $0$**:
>
> $$
> \ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots + (-1)^{n-1}\frac{x^n}{n} + R_n(x)
> $$
>
> với $|R_n(x)| \leq \dfrac{|x|^{n+1}}{(n+1)(1-|x|)^{n+1}}$ khi $|x| < 1$.

---

## Hàm lồi (Convex Functions)

### Definition

> [!definition] Definition 6.16 — Hàm lồi
> $f: (a,b) \to \mathbb{R}$ là **hàm lồi** (convex) nếu với mọi $x, y \in (a,b)$ và $\lambda \in [0,1]$:
>
> $$
> f(\lambda x + (1-\lambda)y) \leq \lambda f(x) + (1-\lambda)f(y)
> $$
>
> Hàm **lõm** (concave) nếu bất đẳng thức ngược lại.

> [!theorem] Theorem 6.17 — Đặc trưng hàm lồi qua đạo hàm
> Giả sử $f: (a,b) \to \mathbb{R}$ khả vi. Khi đó:
>
> **(a)** $f$ lồi $\Leftrightarrow$ $f'$ đơn điệu không giảm trên $(a,b)$.
>
> **(b)** Nếu $f$ hai lần khả vi: $f$ lồi $\Leftrightarrow$ $f''(x) \geq 0$ với mọi $x \in (a,b)$.

**Proof của (a) $(\Rightarrow)$.**
Cho $x < y$ trong $(a,b)$. Với $\varepsilon > 0$ nhỏ: lấy điểm $x < x+\varepsilon < y$. Tính convexity cho bộ $(x, x+\varepsilon, y)$:

$$
f'(x) \leq \frac{f(y)-f(x)}{y-x} \leq f'(y)
$$

(sử dụng định nghĩa convexity và cho $\varepsilon \to 0$). Vậy $f'$ không giảm. $\blacksquare$

> [!theorem] Theorem 6.18 — Jensen's Inequality
> Nếu $f$ lồi và $x_1, \ldots, x_n \in (a,b)$, $\lambda_i \geq 0$, $\sum \lambda_i = 1$:
>
> $$
> f\!\left(\sum_{i=1}^n \lambda_i x_i\right) \leq \sum_{i=1}^n \lambda_i f(x_i)
> $$

### Worked Example

> [!example] Example 6.19 — Hàm lồi và ứng dụng
>
> **(a)** $f(x) = e^x$ là lồi trên $\mathbb{R}$ vì $f''(x) = e^x > 0$.
>
> **Hệ quả (AM-GM qua Jensen):** Lấy $\lambda_i = 1/n$ và $x_i = \ln a_i$ ($a_i > 0$):
>
> $$
> e^{\frac{1}{n}\sum \ln a_i} \leq \frac{1}{n}\sum e^{\ln a_i} \Rightarrow \left(\prod a_i\right)^{1/n} \leq \frac{\sum a_i}{n}
> $$
>
> Đây chính là bất đẳng thức AM-GM!
>
> **(b)** $f(x) = -\ln x$ là lồi trên $(0,\infty)$ vì $f''(x) = 1/x^2 > 0$. Jensen cho bất đẳng thức:
>
> $$
> -\ln\!\left(\frac{\sum a_i}{n}\right) \leq -\frac{\sum \ln a_i}{n} \Rightarrow \frac{\sum a_i}{n} \geq \left(\prod a_i\right)^{1/n}
> $$

---

## SageMath Cheatsheet

```python
from sympy import *

x, c, a, b = symbols('x c a b', real=True)

# Tính đạo hàm
f = x**3 * sin(x)
print(diff(f, x))           # 3x^2 sin(x) + x^3 cos(x)
print(diff(f, x, 2))        # đạo hàm bậc 2

# Taylor expansion
f_exp = exp(x)
T5 = series(f_exp, x, 0, 6)  # Taylor đến bậc 5
print(T5)                    # 1 + x + x^2/2 + x^3/6 + x^4/24 + x^5/120 + O(x^6)

# Lagrange remainder ước lượng
# e^x tại x=1, n=5: R_5(1) = e^c / 6! với c trong (0,1)
import math
n = 5
remainder_bound = math.e / math.factorial(n + 1)
print(f"Lagrange remainder |R_{n}(1)| <= {remainder_bound:.8f}")

# L'Hôpital: kiểm tra
f_num = sin(x)
f_den = x
lim_val = limit(f_num / f_den, x, 0)
print(f"lim sin(x)/x = {lim_val}")   # 1

# Hàm lồi: kiểm tra f'' >= 0
f_conv = exp(x)
d2 = diff(f_conv, x, 2)
print(f"f''(x) = {d2} >= 0: {simplify(d2 > 0)}")  # True

# MVT: tìm c trong (a, b)
def find_mvt_c(f_sym, a_val, b_val):
    """Tìm c thỏa f'(c) = (f(b)-f(a))/(b-a)"""
    slope = (f_sym.subs(x, b_val) - f_sym.subs(x, a_val)) / (b_val - a_val)
    df = diff(f_sym, x)
    return solve(df - slope, x)

f_test = x**2
c_vals = find_mvt_c(f_test, 1, 3)
print(f"MVT: c = {c_vals} trong (1, 3)")  # c = 2, nằm trong (1,3) ✓

# Jensen's inequality: kiểm tra AM-GM
import numpy as np
a_vals = [1.0, 4.0, 9.0]
am = sum(a_vals) / len(a_vals)
gm = np.prod(a_vals) ** (1 / len(a_vals))
print(f"AM = {am:.4f} >= GM = {gm:.4f}: {am >= gm}")  # True
```

---

## Summary / Key Takeaways

- **Đạo hàm** $f'(x)$ là giới hạn của sai phân thương. Khả vi $\Rightarrow$ liên tục (chiều ngược sai: Weierstrass).
- **MVT**: $\exists c \in (a,b)$: $f'(c) = \dfrac{f(b)-f(a)}{b-a}$ — định lý trung tâm, kéo theo hàm hằng, đơn điệu, và Lipschitz.
- **L'Hôpital**: áp dụng cho dạng $0/0$ và $\infty/\infty$. Chú ý: không áp dụng khi $\lim f'/g'$ không tồn tại.
- **Taylor's Theorem**: $f(x) = \sum_{k=0}^n \dfrac{f^{(k)}(\alpha)}{k!}(x-\alpha)^k + R_n(x)$ với Lagrange remainder $R_n(x) = \dfrac{f^{(n+1)}(c)}{(n+1)!}(x-\alpha)^{n+1}$.
- **Hàm lồi**: $f'' \geq 0$ $\Leftrightarrow$ $f'$ không giảm $\Leftrightarrow$ $f$ thỏa định nghĩa convexity. **Jensen's inequality** là hệ quả trực tiếp, bao hàm AM-GM và nhiều BĐT quan trọng.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 5.
- Folland, G. B. *Real Analysis* (2nd ed.), Section 1.3.
- Abbott, S. *Understanding Analysis* (2nd ed.), Chapter 5.
- Lebl, J. *Basic Analysis I*, Chapter 4.
