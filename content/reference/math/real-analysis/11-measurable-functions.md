---
title: "11. Measurable Functions"
tags: [math, real-analysis, lesson-11]
aliases: [Measurable Functions]
created: 2026-03-28
---

> **Prerequisites**: [[10-lebesgue-measure|10. Lebesgue Measure]] — Lebesgue $\sigma$-algebra, measure space; [[05-continuity|05. Continuity]] — Hàm liên tục
> **Objectives**:
> - Định nghĩa hàm đo được và nắm các tiêu chuẩn nhận biết
> - Hiểu simple functions và Simple Approximation Theorem
> - Nắm các modes of convergence và quan hệ giữa chúng
> - Phát biểu và chứng minh Egorov's Theorem
> - Phát biểu và hiểu Lusin's Theorem (Littlewood's three principles)

---

## Motivation / Intuition

Trước khi tích phân một hàm theo Lebesgue, ta phải hỏi: hàm đó có "tương thích" với $\sigma$-algebra không? Điều kiện đó chính là **tính đo được** (measurability). Nó là analog của liên tục trong tích phân Riemann — nhưng yếu hơn nhiều: mọi hàm liên tục đều đo được, nhưng không ngược lại.

Bài này cũng trả lời câu hỏi: "Convergence trong Measure Theory là gì?" Ngoài pointwise và uniform, có thêm **convergence in measure**, **almost everywhere convergence**, v.v. Hai định lý then chốt — Egorov và Lusin — nói rằng dù các khái niệm này khác nhau, chúng đều "gần giống nhau" trên tập đo nhỏ có thể bỏ qua. Đây là nội dung của **Littlewood's three principles**.

---

## Hàm đo được (Measurable Functions)

### Definition

> [!definition] Definition 11.1 — Hàm đo được
> Cho $(X, \mathcal{M})$ và $(Y, \mathcal{N})$ là hai measurable spaces. Hàm $f: X \to Y$ là **$(\mathcal{M}, \mathcal{N})$-measurable** nếu:
>
> $$
> \forall E \in \mathcal{N}:\; f^{-1}(E) \in \mathcal{M}
> $$
>
> Trong trường hợp $Y = \mathbb{R}$ với Borel $\sigma$-algebra $\mathcal{B}(\mathbb{R})$: $f: (X, \mathcal{M}) \to \mathbb{R}$ đo được nếu preimage của mọi tập Borel thuộc $\mathcal{M}$.

> [!theorem] Theorem 11.2 — Tiêu chuẩn nhận biết hàm đo được
> Cho $(X, \mathcal{M})$ là measurable space. Hàm $f: X \to \mathbb{R}$ đo được khi và chỉ khi **một** trong các điều kiện sau đúng:
>
> **(a)** $\{x \in X \mid f(x) > a\} \in \mathcal{M}$ với mọi $a \in \mathbb{R}$
>
> **(b)** $\{x \in X \mid f(x) \geq a\} \in \mathcal{M}$ với mọi $a \in \mathbb{R}$
>
> **(c)** $\{x \in X \mid f(x) < a\} \in \mathcal{M}$ với mọi $a \in \mathbb{R}$
>
> **(d)** $\{x \in X \mid f(x) \leq a\} \in \mathcal{M}$ với mọi $a \in \mathbb{R}$

**Proof.** $(a) \Rightarrow (b)$: $\{f \geq a\} = \bigcap_{n=1}^\infty \{f > a - 1/n\} \in \mathcal{M}$. Tương tự cho các chiều khác. Các điều kiện này đủ vì $\mathcal{B}(\mathbb{R})$ sinh bởi các tập dạng $(a, \infty)$. $\blacksquare$

> [!theorem] Theorem 11.3 — Phép toán bảo toàn measurability
> Nếu $f, g: (X, \mathcal{M}) \to \mathbb{R}$ đo được và $c \in \mathbb{R}$:
>
> 1. $cf$, $f + g$, $f \cdot g$, $|f|$ đều đo được
> 2. $\max(f, g)$, $\min(f, g)$ đo được; đặc biệt $f^+ = \max(f,0)$, $f^- = \max(-f,0)$
> 3. $\sup_n f_n$, $\inf_n f_n$, $\limsup_n f_n$, $\liminf_n f_n$ đo được (với $\{f_n\}$ đo được)

**Proof của (3).** $\{\sup_n f_n > a\} = \bigcup_n \{f_n > a\} \in \mathcal{M}$ (hợp đếm được của tập đo được). Tương tự cho inf. Limsup và liminf suy ra từ đây. $\blacksquare$

> [!theorem] Theorem 11.4 — Hàm liên tục thì đo được
> Mọi hàm liên tục $f: \mathbb{R}^n \to \mathbb{R}$ đều Borel measurable (tức $\mathcal{B}(\mathbb{R}^n)$-measurable).

**Proof.** $\{f > a\} = f^{-1}((a, \infty))$ là preimage của tập mở, do đó mở, do đó Borel. $\blacksquare$

### Worked Example

> [!example] Example 11.5 — Nhận biết hàm đo được
>
> **(a)** $f = \mathbf{1}_E$ (hàm đặc trưng): đo được $\Leftrightarrow$ $E \in \mathcal{M}$. Vì $\{f > a\} = X$ nếu $a < 0$; $= E$ nếu $0 \leq a < 1$; $= \emptyset$ nếu $a \geq 1$.
>
> **(b)** Hàm Dirichlet $f = \mathbf{1}_\mathbb{Q}$ trên $\mathbb{R}$: $\mathbb{Q} \in \mathcal{B}(\mathbb{R})$ (là $F_\sigma$), nên $f$ đo được theo Lebesgue — dù không liên tục ở đâu.
>
> **(c)** $f(x) = \sin(x) + |x|^{1/3}$: tổng hợp thành của liên tục và liên tục, nên đo được. ✓

---

## Simple Functions và Xấp xỉ

### Definition

> [!definition] Definition 11.6 — Simple Function (Hàm đơn giản)
> Hàm $\phi: X \to \mathbb{R}$ là **simple function** nếu $\phi$ đo được và nhận hữu hạn giá trị khác nhau. Dạng chuẩn:
>
> $$
> \phi = \sum_{i=1}^n a_i \mathbf{1}_{A_i}, \quad A_i = \phi^{-1}(\{a_i\}),\; A_i \in \mathcal{M} \text{ rời nhau}
> $$

> [!theorem] Theorem 11.7 — Simple Approximation Theorem
> Cho $f: X \to [0, +\infty]$ đo được. Tồn tại dãy simple functions $\phi_n: X \to [0, +\infty)$ sao cho:
>
> 1. $0 \leq \phi_1 \leq \phi_2 \leq \cdots \leq f$ (đơn điệu tăng)
> 2. $\phi_n(x) \to f(x)$ với mọi $x \in X$ (hội tụ điểm-điểm)
> 3. Nếu $f$ bị chặn: hội tụ **đều**

**Proof (Construction).**
Với mỗi $n \in \mathbb{N}$, định nghĩa:

$$
\phi_n(x) = \begin{cases}
\dfrac{k-1}{2^n} & \text{nếu } \dfrac{k-1}{2^n} \leq f(x) < \dfrac{k}{2^n},\; k = 1, 2, \ldots, n \cdot 2^n \\[6pt]
n & \text{nếu } f(x) \geq n
\end{cases}
$$

Mỗi $\phi_n$ là simple (nhận hữu hạn giá trị, mỗi tập level đo được). Dãy $(\phi_n)$ tăng. Với $f(x) < \infty$: khi $n > f(x)$, ta có $\phi_n(x) \geq f(x) - 1/2^n$, nên $\phi_n(x) \to f(x)$. $\blacksquare$

---

## Almost Everywhere (a.e.)

### Definition

> [!definition] Definition 11.8 — Almost Everywhere
> Tính chất $P(x)$ đúng **almost everywhere** (a.e.) nếu tập $\{x \in X \mid P(x) \text{ sai}\}$ có measure $0$.
>
> Ví dụ: $f = g$ a.e. nếu $\mu(\{f \neq g\}) = 0$; $f_n \to f$ a.e. nếu $\mu(\{x \mid f_n(x) \not\to f(x)\}) = 0$.

> [!note] Remark 11.9
> Trong tích phân Lebesgue, các hàm bằng nhau a.e. được coi là **tương đương** — chúng có cùng tích phân. Đây là lý do $L^p$ spaces thực ra là các lớp tương đương, không phải hàm riêng lẻ (xem Bài 13).

---

## Các Modes of Convergence

### Definition

> [!definition] Definition 11.10 — Các kiểu hội tụ
> Cho $(X, \mathcal{M}, \mu)$ measure space, $f_n, f: X \to \mathbb{R}$ đo được. Định nghĩa:
>
> - **Pointwise a.e.**: $f_n \to f$ a.e. nếu $f_n(x) \to f(x)$ với $\mu$-a.e. $x$
> - **Uniform a.e.** (essentially uniform): $f_n \rightrightarrows f$ a.e. nếu $\exists E$ với $\mu(E) = 0$: $f_n \to f$ đều trên $X \setminus E$
> - **Convergence in measure**: $f_n \xrightarrow{\mu} f$ nếu với mọi $\varepsilon > 0$:
>
> $$
> \mu\!\left(\{x \mid |f_n(x) - f(x)| > \varepsilon\}\right) \to 0 \quad (n \to \infty)
> $$
>
> - **$L^p$ convergence**: $f_n \to f$ in $L^p$ nếu $\int |f_n - f|^p\, d\mu \to 0$ (xem Bài 13)

> [!theorem] Theorem 11.11 — Quan hệ giữa các modes of convergence
>
> Trong measure space tổng quát:
>
> $$
> \text{Uniform a.e.} \Rightarrow \text{Pointwise a.e.} \Rightarrow \text{Convergence in measure (nếu } \mu(X) < \infty\text{)}
> $$
>
> Không có chiều ngược lại nào đúng tổng quát.

> [!warning] Counterexample 11.12 — Pointwise a.e. $\not\Rightarrow$ Convergence in measure (measure vô hạn)
> $f_n = \mathbf{1}_{[n, n+1]}$ trên $\mathbb{R}$: $f_n \to 0$ pointwise ở mọi $x \in \mathbb{R}$ (với $x$ cố định, $x \notin [n, n+1]$ khi $n$ đủ lớn). Nhưng $\mu(\{f_n > 1/2\}) = 1 \not\to 0$. Không hội tụ in measure.
>
> *Ghi chú*: Khi $\mu(X) < \infty$, điều này không xảy ra.

> [!warning] Counterexample 11.13 — Convergence in measure $\not\Rightarrow$ Pointwise a.e.
> **Typewriter sequence** trên $[0,1]$: $f_1 = \mathbf{1}_{[0,1]}$, $f_2 = \mathbf{1}_{[0,1/2]}$, $f_3 = \mathbf{1}_{[1/2,1]}$, $f_4 = \mathbf{1}_{[0,1/3]}$, $f_5 = \mathbf{1}_{[1/3,2/3]}$, $f_6 = \mathbf{1}_{[2/3,1]}$, ...
>
> $\mu(\{f_n > \varepsilon\}) \to 0$ (hội tụ in measure về $0$). Nhưng với mọi $x \in [0,1]$, $f_n(x)$ dao động giữa $0$ và $1$ vô hạn lần — không hội tụ điểm-điểm ở đâu cả.

---

## Egorov's Theorem

### Theorem

> [!theorem] Theorem 11.14 — Egorov's Theorem
> Cho $(X, \mathcal{M}, \mu)$ với $\mu(X) < \infty$. Nếu $f_n, f$ đo được và $f_n \to f$ **a.e.** trên $X$, thì với mọi $\varepsilon > 0$, tồn tại $E \in \mathcal{M}$ sao cho:
>
> $$
> \mu(X \setminus E) < \varepsilon \quad \text{và} \quad f_n \to f \text{ đều trên } E
> $$

**Proof.**
Đặt $A_{n,k} = \bigcup_{m \geq n} \{|f_m - f| > 1/k\}$. Với $k$ cố định: $A_{1,k} \supseteq A_{2,k} \supseteq \cdots$ và $\bigcap_n A_{n,k} \subseteq \{f_m \not\to f\}$ — tập có measure $0$ (do giả thiết a.e.).

Vì $\mu(X) < \infty$, theo continuity from above: $\mu(A_{n,k}) \to 0$ khi $n \to \infty$.

Với $\varepsilon > 0$, chọn $N_k$ sao cho $\mu(A_{N_k, k}) < \varepsilon/2^k$. Đặt $F = \bigcup_{k=1}^\infty A_{N_k, k}$.

$$
\mu(F) \leq \sum_{k=1}^\infty \mu(A_{N_k, k}) < \sum_{k=1}^\infty \frac{\varepsilon}{2^k} = \varepsilon
$$

Đặt $E = X \setminus F$. Với $x \in E$: $x \notin A_{N_k, k}$ với mọi $k$, tức $|f_m(x) - f(x)| \leq 1/k$ với mọi $m \geq N_k$. Vậy $f_n \to f$ đều trên $E$. $\blacksquare$

> [!warning] Counterexample 11.15 — $\mu(X) < \infty$ là cần thiết
> $f_n = \mathbf{1}_{[n, n+1]}$ trên $(\mathbb{R}, \mathcal{L}, \mu)$: $f_n \to 0$ a.e. nhưng không có tập $E$ với $\mu(\mathbb{R} \setminus E) < 1$ mà $f_n \to 0$ đều trên $E$ — các hàm "chạy ra vô cực".

---

## Lusin's Theorem

### Theorem

> [!theorem] Theorem 11.16 — Lusin's Theorem
> Cho $\mu$ là Lebesgue measure trên $\mathbb{R}$, $E \in \mathcal{L}$ với $\mu(E) < \infty$, và $f: E \to \mathbb{R}$ đo được. Thì với mọi $\varepsilon > 0$, tồn tại tập compact $K \subseteq E$ sao cho:
>
> $$
> \mu(E \setminus K) < \varepsilon \quad \text{và} \quad f|_K \text{ liên tục}
> $$

**Proof sketch.**
Theo Simple Approximation Theorem, có dãy simple functions $\phi_n \to f$ pointwise a.e. Theo Egorov, tồn tại $F \subseteq E$ với $\mu(E \setminus F) < \varepsilon/2$ và $\phi_n \to f$ đều trên $F$. Mỗi $\phi_n$ liên tục trên tập $F_n \subseteq F$ compact với $\mu(F \setminus F_n) < \varepsilon/2^{n+1}$. Đặt $K = F \cap \bigcap_n F_n$: compact, $\mu(E \setminus K) < \varepsilon$, và $f = \lim \phi_n$ đều liên tục trên $K$. $\blacksquare$

---

## Littlewood's Three Principles

> [!note] Remark 11.17 — Ba nguyên lý của Littlewood
> Tất cả kết quả chính của bài này tóm gọn trong **Littlewood's three principles** (1944):
>
> 1. **Mọi tập đo được đều "gần như" là hợp hữu hạn khoảng**: $\forall E, \varepsilon > 0$, $\exists$ open set $U \supseteq E$: $\mu(U \setminus E) < \varepsilon$ (outer regularity).
>
> 2. **Mọi hàm đo được đều "gần như" liên tục** (Lusin's Theorem): $f$ measurable $\Rightarrow$ $f$ liên tục ngoại trừ tập measure nhỏ tùy ý.
>
> 3. **Mọi dãy hội tụ a.e. đều "gần như" hội tụ đều** (Egorov's Theorem): $f_n \to f$ a.e. trên tập measure hữu hạn $\Rightarrow$ hội tụ đều ngoại trừ tập measure nhỏ tùy ý.
>
> Ba nguyên lý này là la bàn trực giác cho Measure Theory: các đối tượng đo được "giống" các đối tượng cổ điển (khoảng, hàm liên tục, hội tụ đều) sau khi bỏ đi tập nhỏ tùy ý.

---

## SageMath Cheatsheet

```python
import numpy as np
import matplotlib.pyplot as plt

# 1. Simple Approximation: xấp xỉ f(x) = sqrt(x) bằng simple functions
def simple_approx(f_func, n, x_vals):
    """Tạo phi_n xấp xỉ f từ dưới"""
    phi = np.zeros_like(x_vals)
    for k in range(1, n * 2**n + 1):
        lower = (k - 1) / 2**n
        upper = k / 2**n
        mask = (lower <= f_func(x_vals)) & (f_func(x_vals) < upper)
        phi[mask] = lower
    phi[f_func(x_vals) >= n] = n
    return phi

x_vals = np.linspace(0, 4, 1000)
f_sq = np.sqrt

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
for idx, n_val in enumerate([2, 5, 10]):
    phi = simple_approx(f_sq, n_val, x_vals)
    axes[idx].plot(x_vals, f_sq(x_vals), 'b-', lw=2, label='f(x)=√x')
    axes[idx].step(x_vals, phi, 'r-', lw=1, label=f'φ_{n_val}')
    axes[idx].set_title(f'Simple approx n={n_val}')
    axes[idx].legend()
plt.tight_layout()
plt.savefig('simple_approx.png', dpi=100)

# 2. Typewriter sequence: convergence in measure but NOT pointwise a.e.
def typewriter_fn(n, x):
    """f_n(x) = indicator của khoảng thứ n trong decomp [0,1]"""
    k = 0
    length = 1
    total = 0
    while total + length <= n:
        total += length
        length *= 2  # độ dài mỗi hàng: 1, 2, 4, 8, ...
    pos = n - total  # vị trí trong hàng
    # hàng k có length=2^(k-1) khoảng, mỗi khoảng dài 1/2^(k-1)
    k_row = int(np.log2(length)) if length > 1 else 0
    interval_len = 1.0 / length
    a = pos * interval_len
    b = (pos + 1) * interval_len
    return 1.0 if a <= x <= b else 0.0

# Kiểm tra: tại x=0.5, hàm dao động
x0 = 0.5
vals_at_x0 = [typewriter_fn(n, x0) for n in range(1, 30)]
print(f"Typewriter tại x=0.5 (20 số hạng đầu): {vals_at_x0[:20]}")
print("(Dao động 0/1 vô hạn lần → không hội tụ pointwise)")

# 3. Egorov's Theorem minh họa
# f_n(x) = x^n trên [0,1]: hội tụ a.e. về 0 (ngoại trừ x=1)
# Egorov: hội tụ đều ngoại trừ [1-ε, 1]
x_vals2 = np.linspace(0, 1, 1000)
eps = 0.05  # bỏ [1-eps, 1]
E_x = x_vals2[x_vals2 <= 1 - eps]

plt.figure(figsize=(8, 5))
for n_val in [5, 10, 20, 50]:
    err_on_E = np.max(E_x**n_val)
    print(f"sup_E |x^{n_val}| = {err_on_E:.6f} (E = [0, {1-eps}])")

# Tại n=50: sup_E |x^50| ~ (0.95)^50 ~ 0.077 (hội tụ đều)
```

---

## Summary / Key Takeaways

- **Hàm đo được**: preimage của tập Borel thuộc $\mathcal{M}$. Tiêu chuẩn: $\{f > a\} \in \mathcal{M}$ với mọi $a$. Liên tục $\Rightarrow$ đo được; tổ hợp của hàm đo được là đo được.
- **Simple functions**: có hữu hạn giá trị, đo được. Mọi hàm đo được không âm là giới hạn tăng dần của simple functions (Simple Approximation Theorem).
- **Almost everywhere (a.e.)**: tính chất đúng ngoại trừ tập measure $0$. Hàm bằng nhau a.e. tương đương nhau trong tích phân Lebesgue.
- **Modes of convergence** (thứ tự mạnh → yếu trên tập có measure hữu hạn): Uniform $\Rightarrow$ Uniform a.e. $\Rightarrow$ Pointwise a.e. $\Rightarrow$ In measure. Không chiều ngược nào đúng tổng quát.
- **Egorov**: $f_n \to f$ a.e. trên tập có measure hữu hạn $\Rightarrow$ hội tụ **đều** ngoại trừ tập nhỏ tùy ý.
- **Lusin**: $f$ measurable trên tập measure hữu hạn $\Rightarrow$ $f$ **liên tục** ngoại trừ tập nhỏ tùy ý.
- **Littlewood's three principles**: tập đo được ≈ khoảng, hàm đo được ≈ liên tục, hội tụ a.e. ≈ đều — sau khi bỏ tập nhỏ.

---

## References

- Folland, G. B. *Real Analysis* (2nd ed.), Sections 2.1–2.4.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 3.
- Tao, T. *An Introduction to Measure Theory*, Section 1.4.
- Lebl, J. *Basic Analysis II*, Chapter 5.
