---
title: "02. Tích phân Lebesgue & Không gian L^p"
tags: [math, fourier-analysis, measure-theory, lp-spaces, lesson-02]
aliases: [Lebesgue Integral, Lp Spaces]
created: 2026-03-24
---

> **Prerequisites**: [[01-lebesgue-measure|01. Lebesgue Measure & Sigma-Algebras]] — measurable sets, Lebesgue measure, null sets, a.e.
> **Objectives**:
> - Xây dựng tích phân Lebesgue theo ba bước: simple functions → hàm không âm → hàm tổng quát
> - Phát biểu và áp dụng ba định lý hội tụ: MCT, Fatou, DCT
> - Hiểu không gian $L^p$ như Banach space; chứng minh bất đẳng thức Hölder và Minkowski
> - Nắm định lý Riesz-Fischer (tính đầy đủ của $L^p$)
> - Hiểu vai trò của $L^2$ và $L^1$ trong lý thuyết Fourier

---

## Motivation / Intuition

Sau khi có Lebesgue measure, bước tiếp theo là định nghĩa **tích phân Lebesgue** — một khái niệm tích phân mạnh hơn Riemann ở chỗ:

1. Cho phép tích phân của *nhiều hàm không liên tục* hơn (ví dụ: $\mathbf{1}_{\mathbb{Q}}$)
2. Các **định lý hoán đổi giới hạn và tích phân** (MCT, DCT) đúng dưới điều kiện yếu hơn nhiều so với Riemann
3. Không gian $L^p$ tạo thành **Banach space** hoàn chỉnh — nền tảng của Fourier analysis hiện đại

Ý tưởng xây dựng: thay vì xấp xỉ hàm bằng các hình chữ nhật hẹp (Riemann), ta xấp xỉ bằng các **simple functions** — hàm chỉ nhận hữu hạn giá trị trên các tập đo được.

---

## Hàm Đo Được (Measurable Functions)

> [!definition] Definition 2.1 — Hàm Đo Được (Measurable Function)
> Cho $(X, \mathcal{M})$ là không gian đo được. Hàm $f: X \to \mathbb{R}$ (hoặc $\mathbb{C}$) được gọi là **measurable** nếu với mọi tập mở $U \subseteq \mathbb{R}$:
>
> $$
> f^{-1}(U) = \left\{ x \in X : f(x) \in U \right\} \in \mathcal{M}
> $$

> [!theorem] Theorem 2.2 — Tiêu chuẩn đơn giản hơn
> $f: \mathbb{R} \to \mathbb{R}$ là Lebesgue measurable khi và chỉ khi với mọi $a \in \mathbb{R}$:
>
> $$
> \left\{ x : f(x) > a \right\} \in \mathcal{L}(\mathbb{R})
> $$

> [!note] Remark 2.3
> Lớp hàm measurable đóng với: cộng, trừ, nhân, chia (trừ khi chia bởi $0$), lấy giới hạn điểm (pointwise limit), $\limsup$, $\liminf$, $|f|$, $\max(f,g)$, $\min(f,g)$.
> Mọi hàm liên tục và mọi hàm đơn điệu trên $\mathbb{R}$ đều measurable.

---

## Tích phân Lebesgue — Ba bước xây dựng

### Bước 1: Simple Functions

> [!definition] Definition 2.4 — Simple Function
> Hàm $\varphi: X \to \mathbb{R}$ được gọi là **simple function** nếu nó chỉ nhận hữu hạn giá trị và là measurable:
>
> $$
> \varphi = \sum_{k=1}^{n} a_k \mathbf{1}_{E_k}
> $$
>
> trong đó $a_1, \ldots, a_n \in \mathbb{R}$ phân biệt, $E_k = \varphi^{-1}(\{a_k\}) \in \mathcal{M}$ đôi một rời rạc, $\bigcup_k E_k = X$.
>
> **Tích phân** của simple function $\varphi \geq 0$:
>
> $$
> \int_X \varphi \, d\mu = \sum_{k=1}^{n} a_k \, \mu(E_k) \quad \in [0, +\infty]
> $$

> [!theorem] Theorem 2.5 — Xấp xỉ bằng Simple Functions
> Cho $f: X \to [0, +\infty]$ measurable. Tồn tại dãy simple functions $0 \leq \varphi_1 \leq \varphi_2 \leq \cdots$ sao cho $\varphi_n \nearrow f$ **pointwise** khi $n \to \infty$.

**Proof.** Định nghĩa:
$$
\varphi_n(x) = \begin{cases}
\frac{k-1}{2^n} & \text{nếu } \frac{k-1}{2^n} \leq f(x) < \frac{k}{2^n},\quad k = 1, 2, \ldots, n \cdot 2^n \\
n & \text{nếu } f(x) \geq n
\end{cases}
$$
Dãy $\{\varphi_n\}$ đơn điệu tăng và $|f(x) - \varphi_n(x)| \leq 1/2^n$ khi $f(x) \leq n$. $\blacksquare$

### Bước 2: Hàm Không Âm

> [!definition] Definition 2.6 — Tích phân của Hàm Không Âm
> Cho $f: X \to [0, +\infty]$ measurable. **Tích phân Lebesgue** của $f$:
>
> $$
> \int_X f \, d\mu = \sup \left\{ \int_X \varphi \, d\mu : \varphi \text{ simple}, \; 0 \leq \varphi \leq f \right\}
> $$

### Bước 3: Hàm Tổng Quát

> [!definition] Definition 2.7 — Tích phân của Hàm Tổng Quát
> Mọi measurable function $f: X \to \mathbb{R}$ đều phân tích được thành $f = f^+ - f^-$ với:
>
> $$
> f^+(x) = \max(f(x), 0) \geq 0, \qquad f^-(x) = \max(-f(x), 0) \geq 0
> $$
>
> $f$ được gọi là **integrable** (hay $f \in L^1$) nếu $\int f^+ d\mu < \infty$ **và** $\int f^- d\mu < \infty$. Khi đó:
>
> $$
> \int_X f \, d\mu = \int_X f^+ d\mu - \int_X f^- d\mu
> $$

> [!note] Remark 2.8 — Kết nối với Riemann
> Nếu $f$ bị chặn và liên tục a.e. trên $[a,b]$, thì tích phân Riemann và Lebesgue của $f$ trùng nhau. Tích phân Lebesgue **mở rộng** tích phân Riemann, không mâu thuẫn.

---

## Ba Định Lý Hội Tụ Quan Trọng

Đây là trái tim của lý thuyết tích phân Lebesgue — những công cụ không thể thiếu trong Fourier analysis.

### Monotone Convergence Theorem (MCT)

> [!theorem] Theorem 2.9 — MCT (Beppo Levi)
> Cho $\{f_n\}$ là dãy hàm measurable **không âm** với $f_1 \leq f_2 \leq \cdots$ và $f_n \to f$ pointwise a.e. Khi đó:
>
> $$
> \lim_{n \to \infty} \int_X f_n \, d\mu = \int_X f \, d\mu
> $$
>
> (cả hai vế có thể bằng $+\infty$)

**Proof sketch.** Vì $f_n \leq f_{n+1} \leq f$, ta có $\int f_n \leq \int f_{n+1} \leq \int f$, nên $\lim \int f_n \leq \int f$. Chiều ngược: với mọi simple function $0 \leq \varphi \leq f$ và $0 < c < 1$, đặt $A_n = \{x : f_n(x) \geq c\varphi(x)\}$. Chứng minh $\bigcup A_n = X$ a.e., rồi cho $n \to \infty$ và $c \to 1$. $\blacksquare$

### Fatou's Lemma

> [!theorem] Theorem 2.10 — Fatou's Lemma
> Cho $\{f_n\}$ là dãy hàm measurable **không âm**. Khi đó:
>
> $$
> \int_X \liminf_{n \to \infty} f_n \, d\mu \leq \liminf_{n \to \infty} \int_X f_n \, d\mu
> $$

> [!warning] Counterexample 2.11 — Đẳng thức có thể không xảy ra
> Xét $f_n = \mathbf{1}_{[n, n+1]}$ trên $\mathbb{R}$. Khi đó $f_n(x) \to 0$ pointwise với mọi $x$, nên $\liminf f_n = 0$ và $\int \liminf f_n = 0$. Nhưng $\int f_n = 1$ với mọi $n$. Bất đẳng thức là chặt: "khối lượng có thể chạy ra vô cực".

### Dominated Convergence Theorem (DCT)

> [!theorem] Theorem 2.12 — DCT (Lebesgue)
> Cho $\{f_n\}$ là dãy hàm measurable với $f_n \to f$ pointwise a.e. Giả sử tồn tại $g \in L^1(X)$ sao cho $|f_n(x)| \leq g(x)$ **a.e.** với mọi $n$. Khi đó $f \in L^1$ và:
>
> $$
> \lim_{n \to \infty} \int_X f_n \, d\mu = \int_X f \, d\mu
> $$
>
> Tương đương, $\lVert f_n - f \rVert_{L^1} \to 0$.

**Proof.** Áp dụng Fatou's Lemma cho $g + f_n \geq 0$ và $g - f_n \geq 0$:
$$
\int (g + f) \leq \liminf \int (g + f_n), \qquad \int (g - f) \leq \liminf \int (g - f_n).
$$
Từ bất đẳng thức thứ hai, $-\limsup \int f_n \leq -\int f$, tức $\int f \leq \liminf \int f_n$. Kết hợp: $\lim \int f_n = \int f$. $\blacksquare$

> [!example] Example 2.13 — Ứng dụng DCT
> Tính $\lim_{n \to \infty} \int_0^1 \frac{n x^{n-1}}{1 + x} \, dx$.
>
> Đặt $f_n(x) = \frac{n x^{n-1}}{1+x}$. Khi đó $f_n(x) \to 0$ với $x \in [0,1)$ vì $x^{n-1} \to 0$, và $f_n(1) = n/2 \to \infty$. Tuy nhiên $\{1\}$ là null set.
>
> Với dominating function: $f_n(x) \leq nx^{n-1}$, và $\int_0^1 nx^{n-1} dx = 1$. Cần cẩn thận hơn — thực tế $\int_0^1 f_n dx = \int_0^1 \frac{nx^{n-1}}{1+x} dx$. Dùng substitution ta tính được giới hạn bằng $\ln 2$ (chi tiết bỏ qua). Điểm quan trọng: DCT là công cụ chính để **đổi giới hạn và tích phân** trong Fourier analysis.

---

## Không gian $L^p$ — Banach Spaces

### Định nghĩa

> [!definition] Definition 2.14 — Không gian $L^p$
> Cho $(X, \mathcal{M}, \mu)$ là không gian đo và $1 \leq p < \infty$. Định nghĩa:
>
> $$
> L^p(X, \mu) = \left\{ f : X \to \mathbb{C} \;\text{measurable} : \int_X |f|^p \, d\mu < \infty \right\} \Big/ {\sim}
> $$
>
> trong đó $f \sim g \Leftrightarrow f = g$ a.e. (đồng nhất hóa các hàm bằng nhau a.e.). Norm:
>
> $$
> \lVert f \rVert_{L^p} = \left( \int_X |f(x)|^p \, d\mu(x) \right)^{1/p}
> $$
>
> Với $p = \infty$:
>
> $$
> \lVert f \rVert_{L^\infty} = \operatorname{ess\,sup}_{x \in X} |f(x)| = \inf \left\{ M \geq 0 : |f(x)| \leq M \text{ a.e.} \right\}
> $$

> [!note] Remark 2.15 — Tại sao đồng nhất hóa a.e.?
> Nếu không đồng nhất hóa, $\lVert f \rVert_p = 0$ chỉ khi $f = 0$ a.e., không nhất thiết $f \equiv 0$ — vi phạm tiên đề norm. Sau khi đồng nhất hóa, $L^p$ thực sự là không gian chuẩn.

### Bất đẳng thức Hölder

> [!theorem] Theorem 2.16 — Bất đẳng thức Hölder (Hölder's Inequality)
> Cho $1 \leq p \leq \infty$ và $q$ là **chỉ số liên hợp** (Hölder conjugate) của $p$, tức $\frac{1}{p} + \frac{1}{q} = 1$. Nếu $f \in L^p$ và $g \in L^q$ thì $fg \in L^1$ và:
>
> $$
> \int_X |f \cdot g| \, d\mu \leq \lVert f \rVert_{L^p} \cdot \lVert g \rVert_{L^q}
> $$

**Proof.** Trường hợp $p = q = 2$ là bất đẳng thức Cauchy-Schwarz. Trường hợp tổng quát: dùng **Young's inequality** — với $a, b \geq 0$:
$$
ab \leq \frac{a^p}{p} + \frac{b^q}{q}
$$
Chuẩn hóa: đặt $\tilde{f} = f/\lVert f \rVert_p$, $\tilde{g} = g/\lVert g \rVert_q$, tích phân bất đẳng thức Young cho $|\tilde{f}(x)|$ và $|\tilde{g}(x)|$:
$$
\int |\tilde{f}\tilde{g}| \leq \frac{1}{p}\int |\tilde{f}|^p + \frac{1}{q}\int |\tilde{g}|^q = \frac{1}{p} + \frac{1}{q} = 1. \quad \blacksquare
$$

### Bất đẳng thức Minkowski

> [!theorem] Theorem 2.17 — Bất đẳng thức Minkowski (Minkowski's Inequality)
> Với $1 \leq p \leq \infty$ và $f, g \in L^p$:
>
> $$
> \lVert f + g \rVert_{L^p} \leq \lVert f \rVert_{L^p} + \lVert g \rVert_{L^p}
> $$
>
> Đây chính là **bất đẳng thức tam giác** cho $L^p$ norm.

**Proof sketch** ($1 < p < \infty$). Ta có:
$$
\lVert f + g \rVert_p^p = \int |f+g|^p \leq \int |f+g|^{p-1}|f| + \int |f+g|^{p-1}|g|.
$$
Áp dụng Hölder cho mỗi tích với exponents $(p, q)$ — biết $|f+g|^{p-1} \in L^q$ vì $(p-1)q = p$:
$$
\leq \lVert (f+g)^{p-1} \rVert_q \left( \lVert f \rVert_p + \lVert g \rVert_p \right) = \lVert f+g \rVert_p^{p/q} \left( \lVert f \rVert_p + \lVert g \rVert_p \right).
$$
Chia hai vế cho $\lVert f+g \rVert_p^{p/q}$, dùng $p - p/q = 1$. $\blacksquare$

### Định lý Riesz-Fischer — $L^p$ là Banach Space

> [!theorem] Theorem 2.18 — Riesz-Fischer
> Với mọi $1 \leq p \leq \infty$, không gian $(L^p(X, \mu), \lVert \cdot \rVert_p)$ là một **Banach space** (không gian chuẩn đầy đủ).

**Proof** (ý tưởng chính, trường hợp $1 \leq p < \infty$). Dùng tiêu chuẩn: một không gian chuẩn là Banach $\Leftrightarrow$ mọi chuỗi hội tụ tuyệt đối đều hội tụ.

Cho $\{f_n\}$ với $\sum_{n=1}^\infty \lVert f_n \rVert_p < \infty$. Đặt $G_N = \sum_{n=1}^N |f_n|$. Bằng Minkowski: $\lVert G_N \rVert_p \leq \sum_n \lVert f_n \rVert_p < \infty$. Bằng MCT: $G = \lim G_N \in L^p$. Do đó $G < \infty$ a.e., và chuỗi $\sum f_n$ hội tụ pointwise a.e. tới một hàm $f$ với $|f| \leq G$. Bằng DCT: $\lVert f - \sum_{n=1}^N f_n \rVert_p \to 0$. $\blacksquare$

> [!note] Remark 2.19 — Tại sao Riesz-Fischer quan trọng với Fourier?
> Định lý này đảm bảo rằng trong $L^2([0, 2\pi])$, chuỗi Fourier của một hàm hội tụ (theo nghĩa $L^2$) tới chính hàm đó — không có giới hạn nào "chạy ra khỏi không gian". Đây là nền tảng cho Parseval's identity ở Lesson 05.

---

## Quan hệ giữa các không gian $L^p$

> [!theorem] Theorem 2.20 — Inclusion của $L^p$ trên tập đo hữu hạn
> Nếu $\mu(X) < \infty$ và $1 \leq p \leq q \leq \infty$, thì $L^q(X) \subseteq L^p(X)$ và:
>
> $$
> \lVert f \rVert_{L^p} \leq \mu(X)^{1/p - 1/q} \cdot \lVert f \rVert_{L^q}
> $$

**Proof.** Áp dụng Hölder với exponents $q/p$ và $(q/p)' = q/(q-p)$ cho hàm $|f|^p \cdot 1$. $\blacksquare$

> [!warning] Counterexample 2.21 — Trên $\mathbb{R}$ (tập vô hạn) không có inclusion ngược chiều
> Xét $f(x) = x^{-1/2} \mathbf{1}_{(0,1]}(x)$. Ta có $f \in L^1(\mathbb{R})$ vì $\int_0^1 x^{-1/2} dx = 2$, nhưng $f \notin L^2(\mathbb{R})$ vì $\int_0^1 x^{-1} dx = +\infty$.
>
> Xét $g(x) = x^{-1} \mathbf{1}_{[1,\infty)}(x)$. Ta có $g \in L^2(\mathbb{R})$ vì $\int_1^\infty x^{-2} dx = 1$, nhưng $g \notin L^1(\mathbb{R})$.

---

## Tính Dense (Xấp xỉ trong $L^p$)

> [!theorem] Theorem 2.22 — Tính Dense
> Với $1 \leq p < \infty$:
>
> 1. Simple functions với finite measure support **dense** trong $L^p(X)$
> 2. $C_c(\mathbb{R})$ (hàm liên tục compact support) **dense** trong $L^p(\mathbb{R})$
> 3. Hàm bậc thang (step functions) **dense** trong $L^p(\mathbb{R})$

> [!note] Remark 2.23 — Điều này nghĩa là gì?
> Mọi hàm trong $L^p$ đều có thể xấp xỉ tùy ý tốt bởi hàm đơn giản hơn. Đây là kỹ thuật cơ bản: chứng minh một tính chất cho hàm đơn giản rồi **mở rộng bằng mật độ** (density argument).

---

## Không gian $L^2$ và Hilbert Space

> [!theorem] Theorem 2.24 — $L^2$ là Hilbert Space
> Không gian $L^2(X, \mu)$ với tích vô hướng (inner product):
>
> $$
> \langle f, g \rangle = \int_X f(x) \overline{g(x)} \, d\mu(x)
> $$
>
> là một **Hilbert space** (Banach space với inner product sinh ra norm: $\lVert f \rVert_2 = \sqrt{\langle f, f \rangle}$).

> [!note] Remark 2.25 — Tại sao $L^2$ đặc biệt trong Fourier?
> Bộ $\{e^{inx}\}_{n \in \mathbb{Z}}$ tạo thành một **hệ trực chuẩn đầy đủ** (complete orthonormal system) trong $L^2([0, 2\pi])$:
>
> $$
> \langle e^{imx}, e^{inx} \rangle = \frac{1}{2\pi}\int_0^{2\pi} e^{i(m-n)x} dx = \delta_{mn}
> $$
>
> Mọi $f \in L^2$ khai triển được thành chuỗi Fourier hội tụ trong $L^2$ — đây là nội dung chính của Lesson 05.

---

## Python — Minh họa $L^p$ Spaces và Hội tụ

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import integrate

# Minh hoa bất đang thuc Holder: ||fg||_1 <= ||f||_p * ||g||_q
x = np.linspace(0, 1, 1000)
f = x**0.3        # f in L^2
g = np.sin(5*x)   # g in L^2

# Holder voi p=q=2 (Cauchy-Schwarz)
lhs = np.trapz(np.abs(f * g), x)
rhs = np.sqrt(np.trapz(f**2, x)) * np.sqrt(np.trapz(g**2, x))
print(f"Holder (p=q=2): ||fg||_1 = {lhs:.4f} <= ||f||_2 * ||g||_2 = {rhs:.4f}  OK: {lhs <= rhs + 1e-10}")

# Minh hoa DCT: gioi han duoi dau tich phan
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

x = np.linspace(0, 1, 1000)
ns = [1, 3, 10, 50]
colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6']

# Truong hop 1: fn = n*x^(n-1) tren [0,1], giao dong den 0 a.e.
axes[0].set_title("$f_n(x) = n\\cdot x^{n-1}$ — khoi luong chay ra bien", fontsize=11)
for n, c in zip(ns, colors):
    fn = n * x**(n-1)
    axes[0].plot(x, fn, color=c, label=f"n={n}", linewidth=1.5)
axes[0].set_ylim(0, 15)
axes[0].legend()
axes[0].set_xlabel("x"); axes[0].set_ylabel("$f_n(x)$")

# Truong hop 2: fn = sin(nx)/sqrt(n) — hoi tu L2 den 0
axes[1].set_title("$g_n(x) = \\sin(nx)/\\sqrt{n}$ — hoi tu trong $L^2$", fontsize=11)
for n, c in zip([1, 4, 16, 64], colors):
    gn = np.sin(n * x) / np.sqrt(n)
    l2_norm = np.sqrt(np.trapz(gn**2, x))
    axes[1].plot(x, gn, color=c, label=f"n={n}, ||g_n||_2={l2_norm:.3f}", linewidth=1.5)
axes[1].legend()
axes[1].set_xlabel("x"); axes[1].set_ylabel("$g_n(x)$")

plt.suptitle("Minh hoa hoi tu trong $L^p$", fontsize=13)
plt.tight_layout()
plt.savefig("lp_convergence.png", dpi=120)
plt.show()

# Comparison Lp norms for same function
f = lambda x: np.where(x > 0, x**(-0.4), 0)
x_grid = np.linspace(0.001, 1, 5000)
fv = f(x_grid)
for p in [1, 1.5, 2, 3]:
    norm_p = np.trapz(fv**p, x_grid)**(1/p)
    print(f"||f||_L^{p} = {norm_p:.4f}")
```

---

## Summary / Key Takeaways

- **Tích phân Lebesgue** xây dựng qua 3 bước: simple functions → hàm không âm → hàm tổng quát; mạnh hơn Riemann và hoàn toàn tương thích với nó.
- **Ba định lý hội tụ** là công cụ cốt lõi:
  - **MCT**: dãy tăng $\Rightarrow$ đổi $\lim$ và $\int$ tự do
  - **Fatou**: $\int \liminf \leq \liminf \int$ (dùng để chứng minh DCT)
  - **DCT**: có dominating $g \in L^1$ $\Rightarrow$ đổi $\lim$ và $\int$ tự do
- **Không gian $L^p$**: hàm measurable có $p$-th moment hữu hạn; đồng nhất hóa a.e.
- **Hölder**: $\lVert fg \rVert_1 \leq \lVert f \rVert_p \lVert g \rVert_q$ với $1/p + 1/q = 1$
- **Minkowski**: $\lVert f+g \rVert_p \leq \lVert f \rVert_p + \lVert g \rVert_p$ — bất đẳng thức tam giác
- **Riesz-Fischer**: $L^p$ là **Banach space** (đầy đủ) — không có giới hạn nào "chạy ra khỏi không gian"
- **$L^2$ là Hilbert space** với inner product $\langle f, g \rangle = \int f\bar{g}$ — nền tảng của lý thuyết Fourier $L^2$
- Trên tập đo **hữu hạn**: $L^q \subseteq L^p$ khi $p \leq q$; trên $\mathbb{R}$: không có inclusion tổng quát

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis: An Introduction*. Princeton, 2003. Appendix B.
- Folland, G. B. *Real Analysis* (2nd ed.). Wiley, 1999. Chương 2, 6.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.). Pearson, 2010. Chương 4, 7.
- Hunter, J. K. *Measure Theory*. UC Davis Lecture Notes. Chương 3–4, 7.
- Tao, T. *245B Notes 3: $L^p$ Spaces*. https://terrytao.wordpress.com/2009/01/09/245b-notes-3-lp-spaces/
