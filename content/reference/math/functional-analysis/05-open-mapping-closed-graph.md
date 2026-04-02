---
title: "05. Fundamental Theorems II — Open Mapping & Closed Graph"
tags: [math, functional-analysis, lesson-05]
aliases: [Open Mapping Closed Graph]
created: 2026-03-31
---

> **Prerequisites**: [[04-baire-ubp|04. Fundamental Theorems I — Baire & UBP]]
> **Objectives**:
> - Chứng minh và hiểu Open Mapping Theorem
> - Rút ra Bounded Inverse Theorem
> - Nắm vững Closed Graph Theorem và ứng dụng

---

## Motivation / Intuition

Trong giải tích sơ cấp, hàm liên tục một chiều tăng nghịch đảo cũng liên tục. Trong Functional Analysis, câu hỏi tương tự: nếu $T: X \to Y$ là toán tử tuyến tính bị chặn và là song ánh, thì $T^{-1}$ có liên tục không?

Câu trả lời là **có** — miễn là $X$ và $Y$ đều là Banach. Đây là **Open Mapping Theorem**, và hệ quả của nó là **Bounded Inverse Theorem**. Cùng bài, **Closed Graph Theorem** cho ta tiêu chuẩn tiện dụng để kiểm tra một toán tử có bị chặn hay không.

---

## Open Mapping Theorem

> [!definition] Definition 5.1 — Ánh xạ mở (Open Mapping)
> Ánh xạ $T: X \to Y$ gọi là **mở** (open map) nếu ảnh của mọi tập mở trong $X$ là tập mở trong $Y$:
>
> $$
> U \subseteq X \text{ mở} \implies T(U) \subseteq Y \text{ mở}
> $$

> [!theorem] Theorem 5.2 — Open Mapping Theorem (Banach)
> Cho $X$, $Y$ là các không gian Banach và $T \in B(X, Y)$ là **toàn ánh** (surjective). Khi đó $T$ là **ánh xạ mở**.
>
> Cụ thể hơn: tồn tại $r > 0$ sao cho $B_Y(0, r) \subseteq T(B_X(0, 1))$.

**Proof.** (Xem chứng minh đầy đủ tại [[a2-proof-open-mapping|A2. Proof of Open Mapping Theorem]])

Phác thảo hai bước:

**Bước 1** — $\overline{T(B_X(0,1))}$ chứa một quả cầu mở trong $Y$.

Vì $T$ toàn ánh: $Y = \bigcup_{n=1}^\infty T(\overline{B}_X(0,n)) = \bigcup_{n=1}^\infty \overline{T(B_X(0,n))}$.

Theo BCT (Y Banach nên đầy đủ), tồn tại $n_0$ sao cho $\overline{T(B_X(0,n_0))}$ có phần trong không rỗng. Do tính tuyến tính của $T$ và sự thuần nhất:

$$
B_Y(0, r) \subseteq \overline{T(B_X(0, 1))}
$$

với một $r > 0$.

**Bước 2** — Đi từ bao đóng sang chính $T(B_X(0,1))$.

Cho $y \in B_Y(0, r)$. Xây dựng dãy $x_n \in X$ sao cho $x_1 + x_2 + \cdots$ hội tụ tuyệt đối và $T(\sum x_n) = y$, dùng tính đầy đủ của $X$ để đảm bảo hội tụ. $\blacksquare$

---

## Bounded Inverse Theorem

> [!theorem] Theorem 5.3 — Bounded Inverse Theorem (Banach Isomorphism Theorem)
> Cho $X$, $Y$ là không gian Banach và $T \in B(X, Y)$ là **song ánh** (bijective). Khi đó $T^{-1} \in B(Y, X)$.
>
> Tức là: **nghịch đảo của toán tử tuyến tính bị chặn song ánh giữa hai Banach space cũng bị chặn**.

**Proof.** Theo Open Mapping Theorem, $T$ là ánh xạ mở. Với mọi tập mở $U \subseteq X$:

$$
(T^{-1})^{-1}(U) = T(U) \text{ mở trong } Y
$$

Vậy $T^{-1}$ liên tục, tức là $T^{-1} \in B(Y, X)$. $\blacksquare$

> [!warning] Counterexample 5.4 — Cần cả hai không gian Banach
> Xét $X = (C^1[0,1], \|\cdot\|_\infty)$ (không phải Banach) và $Y = (C[0,1], \|\cdot\|_\infty)$ (Banach). Toán tử tích phân $T: Y \to X$, $(Tf)(x) = \int_0^x f(t)\,dt$ là song ánh bị chặn nhưng $T^{-1} = D$ (đạo hàm) **không bị chặn** (xem Example 3.5).

---

## Equivalent Norms

> [!corollary] Corollary 5.5 — Hai norm tương đương trên không gian Banach
> Cho $X$ là không gian vector với hai norm $\|\cdot\|_1$ và $\|\cdot\|_2$. Nếu $(X, \|\cdot\|_1)$ và $(X, \|\cdot\|_2)$ đều là Banach và tồn tại $C > 0$ sao cho $\|x\|_2 \leq C\|x\|_1$ với mọi $x$, thì hai norm **tương đương**.

**Proof.** Toán tử đồng nhất $\operatorname{Id}: (X, \|\cdot\|_1) \to (X, \|\cdot\|_2)$ là song ánh bị chặn (với $\|\operatorname{Id}\| \leq C$). Theo Bounded Inverse Theorem, $\operatorname{Id}^{-1}$ bị chặn, cho $c\|x\|_1 \leq \|x\|_2$. $\blacksquare$

---

## Closed Graph Theorem

> [!definition] Definition 5.6 — Đồ thị đóng (Closed Graph)
> Cho $T: X \to Y$ là toán tử tuyến tính. **Đồ thị** của $T$ là:
>
> $$
> G(T) = \{(x, Tx) : x \in X\} \subseteq X \times Y
> $$
>
> $T$ gọi là **closed** (đóng) nếu $G(T)$ là tập đóng trong không gian tích $X \times Y$ (với norm $\|(x,y)\|_{X \times Y} = \|x\|_X + \|y\|_Y$).
>
> Tương đương: $x_n \to x$ và $Tx_n \to y$ $\implies$ $y = Tx$.

> [!theorem] Theorem 5.7 — Closed Graph Theorem
> Cho $X$, $Y$ là không gian Banach và $T: X \to Y$ là toán tử tuyến tính. Khi đó:
>
> $$
> T \in B(X, Y) \iff G(T) \text{ đóng trong } X \times Y
> $$

**Proof.**
($\Rightarrow$) Nếu $T$ bị chặn và $x_n \to x$, $Tx_n \to y$: thì $Tx_n \to Tx$ (liên tục), nên $y = Tx$.

($\Leftarrow$) Giả sử $G(T)$ đóng. Không gian $G(T) \subseteq X \times Y$ là Banach (đóng trong Banach). Xét ánh xạ $\pi_1: G(T) \to X$, $\pi_1(x, Tx) = x$. $\pi_1$ là toán tử tuyến tính song ánh bị chặn (với $\|\pi_1\| \leq 1$). Theo Bounded Inverse Theorem, $\pi_1^{-1}: X \to G(T)$ bị chặn. Vậy $T = \pi_2 \circ \pi_1^{-1}$ (với $\pi_2(x, Tx) = Tx$) là hợp của hai ánh xạ bị chặn, nên bị chặn. $\blacksquare$

> [!note] Remark 5.8 — Ý nghĩa thực tiễn
> Closed Graph Theorem thường được dùng để **chứng minh một toán tử bị chặn** bằng cách kiểm tra đồ thị đóng — thường dễ hơn trực tiếp ước lượng norm. Chiến lược: giả sử $x_n \to x$ và $Tx_n \to y$, rồi chứng minh $y = Tx$.

---

## Ứng dụng: Toán tử vi phân đóng nhưng không bị chặn

> [!example] Example 5.9 — Closed graph của toán tử đạo hàm
> Xét $T = D$ (đạo hàm) trên $X = L^2[0,1]$ với miền xác định $\mathcal{D}(T) = \{f \in L^2[0,1] : f' \in L^2[0,1]\}$ (không gian Sobolev $H^1[0,1]$).
>
> Nếu $f_n \to f$ trong $L^2$ và $f_n' \to g$ trong $L^2$, thì bằng tích phân từng phần:
>
> $$
> \int_0^1 f_n' \varphi \, dt = -\int_0^1 f_n \varphi' \, dt \quad \to \quad -\int_0^1 f \varphi' \, dt
> $$
>
> với mọi test function $\varphi \in C_c^\infty(0,1)$. Vậy $g = f'$ trong nghĩa phân phối, tức $G(D)$ đóng.
>
> Nhưng $D$ **không** bị chặn từ $L^2$ vào $L^2$ — đây không mâu thuẫn với Closed Graph Theorem vì miền xác định $\mathcal{D}(T) \subsetneq X$ (không phải toàn bộ $X$).

---

## SageMath Cheatsheet

```python
import numpy as np
import scipy.linalg as la

# Minh họa Bounded Inverse Theorem: nghịch đảo ma trận bị chặn
A = np.array([[2.0, 1.0], [1.0, 3.0]])

# Kiểm tra song ánh (det != 0)
det = np.linalg.det(A)
print(f"det(A) = {det:.4f}  -> {'song ánh' if abs(det) > 1e-10 else 'không song ánh'}")

# Norm A và norm A^{-1}
norm_A     = np.linalg.norm(A, ord=2)
A_inv      = np.linalg.inv(A)
norm_A_inv = np.linalg.norm(A_inv, ord=2)
print(f"||A|| = {norm_A:.4f},  ||A^{{-1}}|| = {norm_A_inv:.4f}")

# Condition number = ||A|| * ||A^{-1}||
cond = np.linalg.cond(A, p=2)
print(f"Condition number = {cond:.4f}")

# Kiểm tra Open Mapping: T(B(0,1)) chứa B(0, r) với r = 1/||T^{-1}||
r_lower = 1.0 / norm_A_inv
print(f"Quả cầu B(0, r) ⊆ T(B(0,1)) với r >= {r_lower:.4f}")
```

---

## Summary / Key Takeaways

- **Open Mapping Theorem**: Toán tử tuyến tính bị chặn toàn ánh giữa hai Banach space là ánh xạ mở.
- **Bounded Inverse Theorem**: Toán tử tuyến tính song ánh bị chặn giữa hai Banach space có nghịch đảo bị chặn.
- **Closed Graph Theorem**: $T: X \to Y$ (cả hai Banach) bị chặn $\iff$ $G(T)$ đóng.
- Chiến lược dùng CGT: giả sử $x_n \to x$, $Tx_n \to y$, chứng minh $y = Tx$.
- Cả ba định lý đều dựa vào BCT (đặc biệt là tính đầy đủ của không gian).

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 3.
- MIT 18.102, Lecture 4.
