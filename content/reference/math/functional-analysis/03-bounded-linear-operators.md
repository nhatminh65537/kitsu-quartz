---
title: "03. Bounded Linear Operators"
tags: [math, functional-analysis, lesson-03]
aliases: [Bounded Linear Operators]
created: 2026-03-31
---

> **Prerequisites**: [[02-normed-spaces-banach|02. Normed Spaces & Banach Spaces]]
> **Objectives**:
> - Hiểu định nghĩa toán tử tuyến tính bị chặn và tại sao "bị chặn" $\iff$ "liên tục"
> - Nắm vững không gian $B(X, Y)$ và norm toán tử
> - Giới thiệu không gian đối ngẫu $X^*$

---

## Motivation / Intuition

Trong đại số tuyến tính hữu hạn chiều, mọi ánh xạ tuyến tính $T: \mathbb{R}^n \to \mathbb{R}^m$ đều liên tục (biểu diễn bằng ma trận). Trong vô hạn chiều, điều này **không còn đúng** — có những ánh xạ tuyến tính không liên tục! Khái niệm **toán tử tuyến tính bị chặn** (bounded linear operator) là cách tự nhiên để chọn ra lớp các ánh xạ "tốt" giữa các không gian Banach. Đây là đối tượng trung tâm của Functional Analysis.

---

## Toán tử tuyến tính bị chặn

### Definition

> [!definition] Definition 3.1 — Toán tử tuyến tính (Linear Operator)
> Cho $(X, \|\cdot\|_X)$ và $(Y, \|\cdot\|_Y)$ là các không gian chuẩn. Ánh xạ $T: X \to Y$ gọi là **toán tử tuyến tính** nếu với mọi $x, y \in X$ và $\alpha, \beta \in \mathbb{F}$:
>
> $$
> T(\alpha x + \beta y) = \alpha T(x) + \beta T(y)
> $$

> [!definition] Definition 3.2 — Toán tử bị chặn (Bounded Operator)
> Toán tử tuyến tính $T: X \to Y$ gọi là **bị chặn** nếu tồn tại $M \geq 0$ sao cho:
>
> $$
> \|Tx\|_Y \leq M\|x\|_X \quad \forall\, x \in X
> $$
>
> **Norm toán tử** của $T$ được định nghĩa là số nhỏ nhất như vậy:
>
> $$
> \|T\| = \sup_{\substack{x \in X \\ x \neq 0}} \frac{\|Tx\|_Y}{\|x\|_X} = \sup_{\|x\|_X = 1} \|Tx\|_Y = \sup_{\|x\|_X \leq 1} \|Tx\|_Y
> $$

> [!note] Remark 3.3 — Ba biểu diễn tương đương của $\|T\|$
> Ba sup ở trên là bằng nhau và đều cho norm toán tử. Trong thực hành, tùy bài toán mà chọn biểu diễn thuận tiện nhất.

### Theorem — Bị chặn $\iff$ Liên tục

> [!theorem] Theorem 3.4 — Tương đương: bị chặn và liên tục
> Cho $T: X \to Y$ là toán tử tuyến tính. Các mệnh đề sau tương đương:
>
> 1. $T$ bị chặn.
> 2. $T$ liên tục trên $X$.
> 3. $T$ liên tục tại $x = 0$.
> 4. $T$ liên tục Lipschitz: $\|Tx - Ty\|_Y \leq \|T\| \cdot \|x - y\|_X$.

**Proof.**
$(1) \Rightarrow (4)$: $\|Tx - Ty\|_Y = \|T(x-y)\|_Y \leq \|T\|\cdot\|x-y\|_X$.

$(4) \Rightarrow (2) \Rightarrow (3)$: hiển nhiên.

$(3) \Rightarrow (1)$: $T$ liên tục tại $0$ nên tồn tại $\delta > 0$ với $\|x\| \leq \delta \Rightarrow \|Tx\| \leq 1$. Với $x \neq 0$ tùy ý, đặt $y = \delta x / \|x\|$, ta có $\|y\| = \delta$, nên $\|Ty\| \leq 1$. Suy ra:

$$
\|Tx\| = \frac{\|x\|}{\delta}\|Ty\| \leq \frac{1}{\delta}\|x\|
$$

Vậy $T$ bị chặn với $M = 1/\delta$. $\blacksquare$

> [!warning] Counterexample 3.5 — Toán tử tuyến tính không liên tục
> Trên $X = (C^1[0,1], \|\cdot\|_\infty)$ (hàm khả vi với sup-norm), toán tử **đạo hàm** $D: f \mapsto f'$ là tuyến tính nhưng **không bị chặn**.
>
> Lấy $f_n(t) = \sin(nt)/n$. Thì $\|f_n\|_\infty = 1/n \to 0$ nhưng $\|Df_n\|_\infty = \|\cos(nt)\|_\infty = 1$. Vậy $\|Df_n\|/\|f_n\| = n \to \infty$, không bị chặn.

---

## Không gian $B(X, Y)$

> [!definition] Definition 3.6 — Không gian các toán tử bị chặn $B(X, Y)$
> Ký hiệu $B(X, Y)$ là tập tất cả các toán tử tuyến tính bị chặn từ $X$ vào $Y$, với norm toán tử $\|T\|$.

> [!theorem] Theorem 3.7 — $B(X, Y)$ là không gian Banach
> Nếu $Y$ là không gian Banach, thì $(B(X, Y), \|\cdot\|)$ cũng là không gian Banach.

**Proof.** $B(X,Y)$ rõ ràng là không gian vector với $(S+T)(x) = Sx + Tx$ và $(\alpha T)(x) = \alpha Tx$. Kiểm tra $\|\cdot\|$ là norm: chỉ cần kiểm tra bất đẳng thức tam giác $\|S+T\| \leq \|S\| + \|T\|$, suy từ $\|(S+T)x\| \leq \|Sx\| + \|Tx\| \leq (\|S\|+\|T\|)\|x\|$.

**Tính đầy đủ**: Cho $(T_n)$ là dãy Cauchy trong $B(X,Y)$. Với mỗi $x \in X$, $\|T_n x - T_m x\| \leq \|T_n - T_m\|\cdot\|x\| \to 0$, nên $(T_n x)$ là Cauchy trong $Y$. Đặt $Tx = \lim_n T_n x$. $T$ tuyến tính (do giới hạn tuyến tính). Với $\varepsilon > 0$, chọn $N$ sao cho $\|T_n - T_m\| < \varepsilon$ với $n, m \geq N$:

$$
\|T_n x - Tx\| = \lim_{m\to\infty} \|T_n x - T_m x\| \leq \varepsilon \|x\|
$$

Suy ra $T_n \to T$ trong $B(X,Y)$, và $T = T_N + (T - T_N) \in B(X,Y)$. $\blacksquare$

> [!theorem] Theorem 3.8 — Không đẳng thức norm tích
> Nếu $T \in B(X, Y)$ và $S \in B(Y, Z)$, thì $ST \in B(X, Z)$ và:
>
> $$
> \|ST\| \leq \|S\| \cdot \|T\|
> $$

**Proof.** $\|ST x\| \leq \|S\|\cdot\|Tx\| \leq \|S\|\cdot\|T\|\cdot\|x\|$. $\blacksquare$

---

## Không gian đối ngẫu $X^*$

> [!definition] Definition 3.9 — Không gian đối ngẫu (Dual Space)
> **Không gian đối ngẫu** (hay dual space) của $X$, ký hiệu $X^*$, là không gian Banach $B(X, \mathbb{F})$ — tức là tập tất cả các **phiếm hàm tuyến tính bị chặn** (bounded linear functionals) $f: X \to \mathbb{F}$.
>
> Với $f \in X^*$: $\|f\|_{X^*} = \sup_{\|x\| \leq 1} |f(x)|$.

> [!example] Example 3.10 — Phiếm hàm tuyến tính cụ thể
> **a) Tích phân trên $C[a,b]$**: $f(g) = \int_a^b g(t)\,dt$ là phần tử của $C[a,b]^*$, với $\|f\| = b - a$.
>
> **b) Đánh giá tại điểm (evaluation functional)**: $\delta_t(g) = g(t)$ là phần tử của $C[a,b]^*$ với $\|\delta_t\| = 1$.
>
> **c) Trên $\ell^p$** ($1 < p < \infty$, $1/p + 1/q = 1$): Mọi $f \in (\ell^p)^*$ có dạng $f(x) = \sum_n a_n x_n$ với $(a_n) \in \ell^q$ và $\|f\| = \|(a_n)\|_q$. Tức là $(\ell^p)^* \cong \ell^q$.

---

## Kernel và Range

> [!definition] Definition 3.11 — Hạt nhân và miền ảnh (Kernel & Range)
> Cho $T \in B(X, Y)$:
>
> - **Hạt nhân** (kernel/null space): $\ker T = \{x \in X : Tx = 0\}$
> - **Miền ảnh** (range/image): $\operatorname{ran} T = \{Tx : x \in X\}$

> [!theorem] Theorem 3.12 — Tính chất của kernel và range
> Với $T \in B(X, Y)$:
>
> 1. $\ker T$ là không gian con **đóng** của $X$.
> 2. $\operatorname{ran} T$ là không gian con của $Y$ (không nhất thiết đóng).

**Proof.**
1. $\ker T = T^{-1}(\{0\})$ là nghịch ảnh của tập đóng $\{0\} \subseteq Y$ qua ánh xạ liên tục $T$, nên đóng. $\blacksquare$

---

## Các ví dụ toán tử quan trọng

> [!example] Example 3.13 — Toán tử dịch chuyển (Shift Operators) trên $\ell^2$
> **Left shift**: $(L(x_1, x_2, x_3, \ldots)) = (x_2, x_3, x_4, \ldots)$
>
> **Right shift**: $(R(x_1, x_2, x_3, \ldots)) = (0, x_1, x_2, x_3, \ldots)$
>
> Cả hai đều là toán tử bị chặn với $\|L\| = \|R\| = 1$.
> Lưu ý: $LR = I$ (toán tử đồng nhất) nhưng $RL \neq I$ — đây là ví dụ về tính không giao hoán đặc trưng cho vô hạn chiều.

> [!example] Example 3.14 — Toán tử tích phân (Integral Operator)
> Trên $X = C[0,1]$, cho $k \in C([0,1]\times[0,1])$:
>
> $$
> (Tf)(x) = \int_0^1 k(x, t) f(t)\,dt
> $$
>
> Thì $T \in B(C[0,1], C[0,1])$ với $\|T\| \leq \max_{x \in [0,1]} \int_0^1 |k(x,t)|\,dt \leq \|k\|_\infty$.

---

## SageMath Cheatsheet

```python
import numpy as np

# Toán tử tuyến tính bị chặn biểu diễn bằng ma trận (hữu hạn chiều)
A = np.array([[1, 2], [3, 4], [0, 1]], dtype=float)

# Norm toán tử = norm ma trận spectral (singular value lớn nhất)
norm_op = np.linalg.norm(A, ord=2)
print(f"||T|| (operator norm) = {norm_op:.4f}")

# Frobenius norm (khác operator norm)
norm_frob = np.linalg.norm(A, 'fro')
print(f"||T|| (Frobenius) = {norm_frob:.4f}")

# Left shift và right shift trên R^n (truncated)
n = 5
x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
# Left shift
L = np.diag(np.ones(n-1), 1)     # superdiagonal
# Right shift
R = np.diag(np.ones(n-1), -1)    # subdiagonal

Lx = L @ x
Rx = R @ x
print(f"Left shift: {Lx}")
print(f"Right shift: {Rx}")
print(f"LR = identity? {np.allclose(L @ R, np.eye(n))}")
print(f"RL = identity? {np.allclose(R @ L, np.eye(n))}")
```

---

## Summary / Key Takeaways

- Toán tử tuyến tính $T: X \to Y$ **bị chặn** $\iff$ **liên tục** $\iff$ $\|T\| < \infty$.
- Norm toán tử: $\|T\| = \sup_{\|x\|=1} \|Tx\|$.
- $B(X, Y)$ là Banach space (nếu $Y$ Banach); $\|ST\| \leq \|S\|\cdot\|T\|$.
- Không gian đối ngẫu $X^* = B(X, \mathbb{F})$: các phiếm hàm tuyến tính bị chặn.
- $(\ell^p)^* \cong \ell^q$ với $1/p + 1/q = 1$.
- $\ker T$ luôn đóng; $\operatorname{ran} T$ không nhất thiết đóng.
- Trong vô hạn chiều: toán tử đạo hàm không bị chặn; toán tử dịch chuyển không giao hoán.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 2.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 3.
- MIT 18.102, Lecture 2.
