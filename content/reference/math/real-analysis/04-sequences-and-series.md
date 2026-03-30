---
title: "04. Sequences & Series"
tags: [math, real-analysis, lesson-04]
aliases: [Sequences and Series]
created: 2026-03-28
---

> **Prerequisites**: [[03-metric-spaces|03. Metric Spaces]] — Dãy Cauchy, completeness; [[01-the-real-number-system|01. Real Number System]] — sup/inf, Archimedean
> **Objectives**:
> - Định nghĩa và phân tích hội tụ của dãy số trong metric space
> - Hiểu và vận dụng limsup / liminf — công cụ then chốt cho dãy không hội tụ
> - Nắm Monotone Convergence Theorem và Bolzano-Weierstrass
> - Phân tích hội tụ chuỗi số: tiêu chuẩn Cauchy, ratio test, root test
> - Hiểu hiện tượng rearrangement và chuỗi hội tụ có điều kiện

---

## Motivation / Intuition

Dãy số là công cụ cơ bản nhất để tiếp cận giới hạn. Trong Calculus, ta đã làm quen với ý tưởng "$x_n \to L$" — nhưng định nghĩa chính xác là gì? Và khi một dãy không hội tụ, liệu vẫn có thể nói gì về nó?

**limsup** và **liminf** là câu trả lời: chúng tồn tại với *mọi* dãy bị chặn, nắm bắt "giới hạn trên" và "giới hạn dưới" của hành vi tiệm cận. Đây là công cụ thiết yếu trong phân tích hiện đại — xuất hiện trong root test, convergence của chuỗi Fourier, và lý thuyết xác suất.

---

## Dãy số trong Metric Space

### Definition

> [!definition] Definition 4.1 — Dãy hội tụ (Convergent Sequence)
> Cho $(X, d)$ là metric space. Dãy $(x_n)_{n=1}^\infty$ trong $X$ **hội tụ** (converges) về $x \in X$, ký hiệu $x_n \to x$ hay $\lim_{n \to \infty} x_n = x$, nếu:
>
> $$
> \forall \varepsilon > 0,\; \exists N \in \mathbb{N}:\; \forall n \geq N,\; d(x_n, x) < \varepsilon
> $$
>
> Điểm $x$ gọi là **giới hạn** (limit) của dãy. Dãy không hội tụ gọi là **phân kỳ** (divergent).

> [!theorem] Theorem 4.2 — Tính duy nhất của giới hạn
> Nếu $x_n \to x$ và $x_n \to y$ thì $x = y$.

**Proof.** Với mọi $\varepsilon > 0$, chọn $N$ sao cho $n \geq N$ dẫn đến $d(x_n, x) < \varepsilon/2$ và $d(x_n, y) < \varepsilon/2$. Khi đó $d(x, y) \leq d(x, x_n) + d(x_n, y) < \varepsilon$. Vì $\varepsilon$ tùy ý, $d(x,y) = 0$, tức $x = y$. $\blacksquare$

### Theorem

> [!theorem] Theorem 4.3 — Các tính chất của giới hạn dãy số trong $\mathbb{R}$
> Nếu $x_n \to x$ và $y_n \to y$ trong $\mathbb{R}$:
>
> 1. $x_n + y_n \to x + y$
> 2. $x_n \cdot y_n \to x \cdot y$
> 3. $x_n / y_n \to x / y$ (nếu $y \neq 0$)
> 4. Nếu $x_n \leq y_n$ với mọi $n$ thì $x \leq y$ (**Squeeze** được suy ra từ đây)

> [!theorem] Theorem 4.4 — Monotone Convergence Theorem (MCT)
> Dãy đơn điệu tăng bị chặn trên thì hội tụ; dãy đơn điệu giảm bị chặn dưới thì hội tụ.
>
> Cụ thể: nếu $x_1 \leq x_2 \leq \cdots$ và $x_n \leq M$ với mọi $n$, thì $x_n \to \sup_n x_n$.

**Proof.** Đặt $L = \sup_n x_n$ (tồn tại vì bị chặn trên). Với $\varepsilon > 0$, theo epsilon-characterization, tồn tại $N$: $x_N > L - \varepsilon$. Vì dãy tăng, với $n \geq N$: $L - \varepsilon < x_N \leq x_n \leq L$. Vậy $|x_n - L| < \varepsilon$. $\blacksquare$

### Worked Example

> [!example] Example 4.5 — Áp dụng MCT
>
> **(a)** Dãy $x_n = \left(1 + \dfrac{1}{n}\right)^n$: Có thể chứng minh dãy này đơn điệu tăng và bị chặn trên bởi $3$. Theo MCT, dãy hội tụ. Giới hạn chính là $e = 2.71828\ldots$
>
> **(b)** Dãy $x_n = \sqrt{2 + \sqrt{2 + \cdots}}$ ($n$ dấu căn): Đặt $x_1 = \sqrt{2}$, $x_{n+1} = \sqrt{2 + x_n}$. Chứng minh $x_n$ tăng và $x_n < 2$ với mọi $n$ (quy nạp). MCT cho $L = \lim x_n$ tồn tại. Từ $x_{n+1} = \sqrt{2 + x_n}$, lấy giới hạn hai vế: $L = \sqrt{2 + L}$, suy ra $L^2 - L - 2 = 0$, nghĩa là $L = 2$ (vì $L > 0$).

> [!theorem] Theorem 4.6 — Bolzano-Weierstrass
> Mọi dãy bị chặn trong $\mathbb{R}^n$ đều có dãy con hội tụ.

**Proof (trong $\mathbb{R}$).** Nếu $(x_n)$ bị chặn trong $[a, b]$, theo Heine-Borel $[a,b]$ compact tức sequentially compact, nên mọi dãy trong $[a,b]$ có dãy con hội tụ. $\blacksquare$

---

## Limsup và Liminf

### Definition

> [!definition] Definition 4.7 — Limsup và Liminf
> Cho $(x_n)$ dãy số thực bị chặn. Định nghĩa:
>
> $$
> \limsup_{n \to \infty} x_n = \lim_{n \to \infty} \left(\sup_{k \geq n} x_k\right) = \inf_{n \geq 1} \sup_{k \geq n} x_k
> $$
>
> $$
> \liminf_{n \to \infty} x_n = \lim_{n \to \infty} \left(\inf_{k \geq n} x_k\right) = \sup_{n \geq 1} \inf_{k \geq n} x_k
> $$
>
> Với dãy không bị chặn: cho phép nhận giá trị $\pm \infty$.

> [!note] Remark 4.8 — Tại sao limsup luôn tồn tại?
> Đặt $u_n = \sup_{k \geq n} x_k$. Dãy $(u_n)$ đơn điệu **giảm** (vì sup trên tập nhỏ hơn thì nhỏ hơn hoặc bằng). Nếu bị chặn dưới, theo MCT $u_n$ hội tụ. Nếu không bị chặn dưới, $u_n \to -\infty$. Vậy $\limsup x_n$ luôn tồn tại trong $[-\infty, +\infty]$.

### Theorem

> [!theorem] Theorem 4.9 — Đặc trưng của limsup
> Cho $(x_n)$ bị chặn và $L = \limsup_{n \to \infty} x_n$. Khi đó:
>
> 1. Với mọi $\varepsilon > 0$: chỉ có **hữu hạn** $n$ thỏa $x_n > L + \varepsilon$
> 2. Với mọi $\varepsilon > 0$: có **vô hạn** $n$ thỏa $x_n > L - \varepsilon$
>
> Tương đương: $L$ là giới hạn của dãy con lớn nhất có thể trích từ $(x_n)$.

> [!theorem] Theorem 4.10 — Hội tụ và limsup/liminf
> Dãy $(x_n)$ bị chặn hội tụ khi và chỉ khi:
>
> $$
> \liminf_{n \to \infty} x_n = \limsup_{n \to \infty} x_n
> $$
>
> Trong trường hợp đó, giới hạn chính bằng giá trị chung này.

### Worked Example

> [!example] Example 4.11 — Tính limsup và liminf
>
> **(a)** $x_n = (-1)^n$: Các giá trị xen kẽ $-1, 1, -1, 1, \ldots$
>
> $$
> \limsup x_n = 1, \quad \liminf x_n = -1
> $$
>
> Dãy phân kỳ (vì limsup $\neq$ liminf).
>
> **(b)** $x_n = \sin(n)$: Giá trị nằm trong $[-1, 1]$, và $\sin(n)$ dày đặc trong $[-1,1]$ (vì $\pi$ vô tỷ). Do đó:
>
> $$
> \limsup \sin(n) = 1, \quad \liminf \sin(n) = -1
> $$
>
> **(c)** $x_n = \dfrac{1}{n}$:
>
> $$
> \limsup \frac{1}{n} = \liminf \frac{1}{n} = 0
> $$
>
> Vậy $x_n \to 0$.

---

## Dãy Cauchy và Completeness

> [!theorem] Theorem 4.12 — Dãy Cauchy trong $\mathbb{R}$
> Trong $\mathbb{R}$ (hoặc $\mathbb{R}^n$): một dãy hội tụ khi và chỉ khi nó là dãy Cauchy.

**Proof.**
($\Rightarrow$) Nếu $x_n \to x$, với $\varepsilon > 0$, chọn $N$: $n \geq N \Rightarrow d(x_n, x) < \varepsilon/2$. Khi đó $m, n \geq N \Rightarrow d(x_m, x_n) \leq d(x_m, x) + d(x, x_n) < \varepsilon$.

($\Leftarrow$) Mọi dãy Cauchy bị chặn (chứng minh dễ). Theo Bolzano-Weierstrass, có dãy con $x_{n_k} \to x$. Vì dãy Cauchy có dãy con hội tụ thì chính nó hội tụ: với $\varepsilon > 0$, chọn $N$ từ Cauchy, chọn $k$ đủ lớn sao cho $n_k \geq N$ và $d(x_{n_k}, x) < \varepsilon/2$. Thì với $n \geq N$: $d(x_n, x) \leq d(x_n, x_{n_k}) + d(x_{n_k}, x) < \varepsilon$. $\blacksquare$

---

## Chuỗi số (Series)

### Definition

> [!definition] Definition 4.13 — Chuỗi số và hội tụ
> Cho dãy $(a_n)$. **Chuỗi số** $\sum_{n=1}^\infty a_n$ hội tụ về $S \in \mathbb{R}$ nếu dãy tổng riêng (partial sums) $s_N = \sum_{n=1}^N a_n$ hội tụ: $s_N \to S$.
>
> Chuỗi **hội tụ tuyệt đối** (absolutely convergent) nếu $\sum |a_n| < \infty$.
>
> Chuỗi **hội tụ có điều kiện** (conditionally convergent) nếu $\sum a_n$ hội tụ nhưng $\sum |a_n| = \infty$.

> [!theorem] Theorem 4.14 — Tiêu chuẩn Cauchy cho chuỗi
> Chuỗi $\sum a_n$ hội tụ khi và chỉ khi:
>
> $$
> \forall \varepsilon > 0,\; \exists N:\; \forall m > n \geq N,\; \left|\sum_{k=n+1}^m a_k\right| < \varepsilon
> $$

> [!corollary] Corollary 4.15 — Điều kiện cần
> Nếu $\sum a_n$ hội tụ thì $a_n \to 0$. (Đảo chiều **sai** — xem chuỗi điều hòa.)

### Theorem — Convergence Tests

> [!theorem] Theorem 4.16 — Root Test (Tiêu chuẩn căn Cauchy)
> Đặt $\alpha = \limsup_{n \to \infty} |a_n|^{1/n}$. Khi đó:
>
> - $\alpha < 1$: chuỗi **hội tụ tuyệt đối**
> - $\alpha > 1$: chuỗi **phân kỳ**
> - $\alpha = 1$: không kết luận được

**Proof ($\alpha < 1$).** Chọn $\beta$ với $\alpha < \beta < 1$. Vì $\alpha = \limsup |a_n|^{1/n}$, tồn tại $N$: với $n \geq N$, $|a_n|^{1/n} < \beta$, tức $|a_n| < \beta^n$. Vì $\sum \beta^n$ hội tụ (chuỗi hình học $|\beta| < 1$), theo so sánh $\sum |a_n|$ hội tụ. $\blacksquare$

> [!theorem] Theorem 4.17 — Ratio Test (Tiêu chuẩn d'Alembert)
> Đặt $L = \lim_{n \to \infty} \left|\dfrac{a_{n+1}}{a_n}\right|$ (nếu tồn tại). Khi đó:
>
> - $L < 1$: chuỗi hội tụ tuyệt đối
> - $L > 1$: chuỗi phân kỳ
> - $L = 1$: không kết luận

> [!theorem] Theorem 4.18 — Alternating Series Test (Leibniz)
> Nếu $(b_n)$ đơn điệu giảm về $0$ thì chuỗi xen kẽ $\sum (-1)^n b_n$ hội tụ.

### Worked Example

> [!example] Example 4.19 — Phân tích hội tụ các chuỗi quen thuộc
>
> **(a) Chuỗi điều hòa** $\sum \dfrac{1}{n}$: $a_n = 1/n \to 0$ nhưng chuỗi **phân kỳ**.
>
> Chứng minh: $\sum_{n=1}^{2^k} \frac{1}{n} \geq 1 + \frac{k}{2}$ (nhóm các số hạng thành khối $2^j$-nhiều, mỗi khối $\geq 1/2$).
>
> **(b) Chuỗi $p$** $\sum \dfrac{1}{n^p}$:
> - $p > 1$: hội tụ (dùng integral test hoặc Cauchy condensation)
> - $p \leq 1$: phân kỳ
>
> **(c) Chuỗi xen kẽ** $\sum \dfrac{(-1)^{n+1}}{n} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots = \ln 2$: hội tụ có điều kiện (Leibniz test).
>
> **(d)** $\sum \dfrac{n!}{n^n}$: Root test: $|a_n|^{1/n} = \dfrac{(n!)^{1/n}}{n} \to \dfrac{1}{e} < 1$. Vậy **hội tụ tuyệt đối**.

---

## Rearrangement — Hiện tượng kỳ diệu

### Theorem

> [!theorem] Theorem 4.20 — Riemann Rearrangement Theorem
> Nếu chuỗi $\sum a_n$ **hội tụ có điều kiện**, thì với mọi $L \in [-\infty, +\infty]$, có thể sắp xếp lại thứ tự các số hạng để chuỗi mới hội tụ về $L$.

> [!theorem] Theorem 4.21 — Chuỗi hội tụ tuyệt đối bền với rearrangement
> Nếu $\sum a_n$ hội tụ tuyệt đối thì mọi chuỗi rearrangement đều hội tụ về cùng giá trị $\sum a_n$.

### Worked Example

> [!example] Example 4.22 — Rearrangement của chuỗi $\ln 2$
>
> Chuỗi $1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots = \ln 2 \approx 0.693$.
>
> Sắp xếp lại: $1 + \frac{1}{3} - \frac{1}{2} + \frac{1}{5} + \frac{1}{7} - \frac{1}{4} + \cdots$ (2 số dương, 1 số âm xen kẽ) $= \dfrac{3}{2}\ln 2$.
>
> Cùng các số hạng, thứ tự khác, tổng khác hoàn toàn!

---

## SageMath Cheatsheet

```python
from sympy import *

n = symbols('n', positive=True, integer=True)

# Tính limsup, liminf trực quan
seq = [(-1)**k + 1/k for k in range(1, 50)]
print(f"max của 50 số hạng đầu: {max(seq):.4f}")  # xấp xỉ limsup
print(f"min của 50 số hạng đầu: {min(seq):.4f}")  # xấp xỉ liminf

# Kiểm tra hội tụ chuỗi với SymPy
s1 = summation(1/n**2, (n, 1, oo))
print(f"sum 1/n^2 = {s1}")  # pi^2/6

s2 = summation(1/n, (n, 1, oo))
print(f"sum 1/n = {s2}")    # oo (phân kỳ)

s3 = summation((-1)**(n+1)/n, (n, 1, oo))
print(f"sum (-1)^(n+1)/n = {s3}")  # log(2)

# Root test
a_n = factorial(n) / n**n
alpha = limit(Abs(a_n)**(Rational(1, 1)/n), n, oo)
print(f"Root test alpha = {alpha} = {float(alpha):.4f}")  # 1/e < 1 -> hội tụ

# Partial sums của chuỗi điều hòa (phân kỳ chậm)
from fractions import Fraction
S = Fraction(0)
for k in range(1, 1001):
    S += Fraction(1, k)
print(f"sum_{{n=1}}^{{1000}} 1/n ≈ {float(S):.4f}")  # ~7.485
```

---

## Summary / Key Takeaways

- **Hội tụ dãy**: $x_n \to x$ theo $\varepsilon$-$N$ definition. Giới hạn duy nhất. Phép toán bảo toàn giới hạn.
- **MCT**: dãy đơn điệu bị chặn thì hội tụ — hệ quả trực tiếp của completeness axiom.
- **Bolzano-Weierstrass**: dãy bị chặn trong $\mathbb{R}^n$ luôn có dãy con hội tụ — hệ quả của compactness.
- **limsup / liminf**: tồn tại với mọi dãy (trong $[-\infty, +\infty]$). Dãy hội tụ $\Leftrightarrow$ limsup $=$ liminf.
- **Dãy Cauchy** trong $\mathbb{R}$: hội tụ $\Leftrightarrow$ Cauchy (completeness của $\mathbb{R}$).
- **Root test**: dùng limsup $|a_n|^{1/n}$. Mạnh hơn ratio test.
- **Chuỗi điều hòa** $\sum 1/n$ phân kỳ; chuỗi $p$-series $\sum 1/n^p$ hội tụ khi $p > 1$.
- **Riemann Rearrangement**: chuỗi hội tụ có điều kiện rất "mong manh" — rearrangement có thể cho bất kỳ giá trị nào.

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapters 3–4.
- Folland, G. B. *Real Analysis* (2nd ed.), Section 1.4.
- Lebl, J. *Basic Analysis I*, Chapter 2.
- Northwestern Math 320-2 Lecture Notes.
