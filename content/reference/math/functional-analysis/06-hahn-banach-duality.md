---
title: "06. Hahn-Banach Theorem & Duality"
tags: [math, functional-analysis, lesson-06]
aliases: [Hahn-Banach Duality]
created: 2026-03-31
---

> **Prerequisites**: [[03-bounded-linear-operators|03. Bounded Linear Operators]], [[05-open-mapping-closed-graph|05. Fundamental Theorems II]]
> **Objectives**:
> - Hiểu và chứng minh Hahn-Banach Theorem (dạng giải tích)
> - Nắm vững dạng hình học (separation theorems)
> - Hiểu reflexive spaces và double dual $X^{**}$

---

## Motivation / Intuition

Ba định lý nền tảng: UBP và Open Mapping dùng tính đầy đủ của Banach space. **Hahn-Banach** thì khác — nó không cần đầy đủ, chỉ cần cấu trúc tuyến tính, và dùng **Zorn's Lemma** (tương đương Axiom of Choice).

Ý tưởng: ta muốn "kéo dài" một phiếm hàm tuyến tính định nghĩa trên không gian con $M \subsetneq X$ ra toàn bộ $X$ mà vẫn giữ được chặn (norm). Định lý Hahn-Banach đảm bảo điều này luôn làm được, và hệ quả của nó cực kỳ phong phú: không gian đối ngẫu đủ lớn để "tách" các điểm, tập lồi có thể được tách bằng siêu phẳng, v.v.

---

## Hahn-Banach Theorem (Dạng giải tích)

### Definition

> [!definition] Definition 6.1 — Phiếm hàm sublinear (Sublinear Functional)
> Hàm $p: X \to \mathbb{R}$ gọi là **sublinear** nếu:
>
> 1. **Subadditive**: $p(x + y) \leq p(x) + p(y)$ với mọi $x, y \in X$
> 2. **Thuần nhất dương**: $p(\alpha x) = \alpha p(x)$ với mọi $\alpha \geq 0$, $x \in X$

### Theorem

> [!theorem] Theorem 6.2 — Hahn-Banach Theorem (Dạng giải tích)
> Cho $X$ là không gian vector thực, $M \subseteq X$ là không gian con, $p: X \to \mathbb{R}$ là phiếm hàm sublinear, và $f: M \to \mathbb{R}$ là phiếm hàm tuyến tính thỏa:
>
> $$
> f(x) \leq p(x) \quad \forall\, x \in M
> $$
>
> Khi đó tồn tại phiếm hàm tuyến tính $F: X \to \mathbb{R}$ thỏa:
>
> $$
> F\big|_M = f \quad \text{và} \quad F(x) \leq p(x) \quad \forall\, x \in X
> $$

**Proof.** (Xem chứng minh đầy đủ tại [[a1-proof-hahn-banach|A1. Proof of Hahn-Banach Theorem]])

Phác thảo: Dùng Zorn's Lemma trên tập tất cả các cặp $(M', f')$ với $M \subseteq M'$ và $f'|_M = f$, $f' \leq p$, theo thứ tự mở rộng. Tập này có phần tử cực đại $(X, F)$ vì mọi dãy tăng đều có chặn trên. $\blacksquare$

---

## Hệ quả cho không gian chuẩn

> [!theorem] Theorem 6.3 — Hahn-Banach cho không gian chuẩn
> Cho $(X, \|\cdot\|)$ là không gian chuẩn (thực hoặc phức), $M \subseteq X$ là không gian con, và $f \in M^*$ (phiếm hàm tuyến tính bị chặn trên $M$). Khi đó tồn tại $F \in X^*$ thỏa:
>
> $$
> F\big|_M = f \quad \text{và} \quad \|F\|_{X^*} = \|f\|_{M^*}
> $$
>
> Tức là $f$ có thể mở rộng ra $X$ mà **không tăng norm**.

**Proof.** Áp dụng định lý 6.2 với $p(x) = \|f\|_{M^*} \cdot \|x\|_X$. $\blacksquare$

> [!corollary] Corollary 6.4 — Không gian đối ngẫu tách các điểm
> Với mọi $x_0 \neq 0$ trong không gian chuẩn $X$, tồn tại $F \in X^*$ sao cho:
>
> $$
> F(x_0) = \|x_0\| \quad \text{và} \quad \|F\|_{X^*} = 1
> $$

**Proof.** Trên $M = \operatorname{span}\{x_0\}$, định nghĩa $f(\alpha x_0) = \alpha\|x_0\|$. Thì $\|f\| = 1$. Theo HB mở rộng $f$ ra $X$. $\blacksquare$

> [!corollary] Corollary 6.5 — Norm biểu diễn qua dual
> Với mọi $x \in X$:
>
> $$
> \|x\| = \sup_{\substack{F \in X^* \\ \|F\| \leq 1}} |F(x)|
> $$

**Proof.** Rõ $|F(x)| \leq \|F\|\cdot\|x\| \leq \|x\|$. Dấu bằng đạt được bởi phần tử $F$ trong Corollary 6.4. $\blacksquare$

---

## Dạng hình học — Separation Theorems

> [!theorem] Theorem 6.6 — Hahn-Banach Separation Theorem (dạng 1)
> Cho $X$ là không gian chuẩn thực, $A, B \subseteq X$ là các tập lồi không rỗng rời nhau ($A \cap B = \emptyset$) với $A$ mở. Khi đó tồn tại $F \in X^*$ và $c \in \mathbb{R}$ sao cho:
>
> $$
> F(a) < c \leq F(b) \quad \forall\, a \in A,\ b \in B
> $$

> [!theorem] Theorem 6.7 — Strong Separation Theorem (dạng 2)
> Nếu $A$ compact lồi và $B$ đóng lồi với $A \cap B = \emptyset$, thì tồn tại $F \in X^*$ và $\alpha < \beta$ sao cho:
>
> $$
> F(a) \leq \alpha < \beta \leq F(b) \quad \forall\, a \in A,\ b \in B
> $$

> [!example] Example 6.8 — Ứng dụng: xấp xỉ tốt nhất
> Nếu $M$ là không gian con đóng của Banach space $X$ và $x_0 \notin M$, thì tồn tại $F \in X^*$ với $F|_M = 0$ và $F(x_0) \neq 0$. Điều này dùng để chứng minh tính dày đặc của $M$: $\overline{M} = X$ $\iff$ không có $F \in X^*$ nào triệt tiêu trên $M$ ngoài $F = 0$.

---

## Double Dual và Reflexive Spaces

> [!definition] Definition 6.9 — Double dual và nhúng chính tắc
> **Double dual** của $X$ là $X^{**} = (X^*)^*$. Xác định **nhúng chính tắc** (canonical embedding):
>
> $$
> \iota: X \to X^{**}, \quad (\iota x)(F) = F(x) \quad \forall\, F \in X^*
> $$

> [!theorem] Theorem 6.10 — $\iota$ là đẳng cự tuyến tính (isometric embedding)
> Ánh xạ $\iota: X \to X^{**}$ là toán tử tuyến tính bảo toàn norm: $\|\iota x\|_{X^{**}} = \|x\|_X$.

**Proof.** $\|\iota x\| = \sup_{\|F\|\leq 1} |(\iota x)(F)| = \sup_{\|F\|\leq 1} |F(x)| = \|x\|$ (theo Corollary 6.5). $\blacksquare$

> [!definition] Definition 6.11 — Không gian phản xạ (Reflexive Space)
> $X$ gọi là **reflexive** nếu $\iota: X \to X^{**}$ là **toàn ánh** (tức là một đẳng cấu — $X \cong X^{**}$).

> [!example] Example 6.12 — Reflexive và không reflexive
> - **Reflexive**: $\ell^p$ ($1 < p < \infty$), $L^p(\mu)$ ($1 < p < \infty$), mọi không gian Hilbert.
> - **Không reflexive**: $\ell^1$ (vì $(\ell^1)^* \cong \ell^\infty$ nhưng $(\ell^\infty)^* \supsetneq \ell^1$), $\ell^\infty$, $C[0,1]$, $L^1$, $L^\infty$.

> [!theorem] Theorem 6.13 — Hệ quả của reflexivity
> Nếu $X$ là không gian Banach reflexive, thì:
>
> 1. $X^*$ cũng reflexive.
> 2. Mọi không gian con đóng của $X$ cũng reflexive.
> 3. Mọi dãy bị chặn trong $X$ có dãy con **hội tụ yếu** (weakly convergent).

---

## Weak Topology

> [!definition] Definition 6.14 — Hội tụ yếu (Weak Convergence)
> Dãy $(x_n) \subseteq X$ **hội tụ yếu** về $x \in X$, ký hiệu $x_n \xrightarrow{w} x$, nếu:
>
> $$
> F(x_n) \to F(x) \quad \forall\, F \in X^*
> $$

> [!theorem] Theorem 6.15 — Weak vs. Strong Convergence
> 1. Hội tụ mạnh $\Rightarrow$ hội tụ yếu (không đảo lại trong vô hạn chiều).
> 2. Nếu $x_n \xrightarrow{w} x$ thì $\|x\| \leq \liminf_n \|x_n\|$ (lower semicontinuity của norm).
> 3. Trong không gian hữu hạn chiều, hai loại hội tụ tương đương.

> [!example] Example 6.16 — Hội tụ yếu nhưng không mạnh
> Trong $\ell^2$, dãy $e_n = (0, \ldots, 0, 1, 0, \ldots)$ (vector cơ sở chuẩn). Với mọi $F \in (\ell^2)^* \cong \ell^2$, $F = (a_n)$:
>
> $$
> F(e_n) = a_n \to 0 \quad (n \to \infty)
> $$
>
> vì $(a_n) \in \ell^2$ nên $a_n \to 0$. Vậy $e_n \xrightarrow{w} 0$.
>
> Nhưng $\|e_n - 0\| = \|e_n\| = 1 \not\to 0$, nên không hội tụ mạnh.

---

## SageMath Cheatsheet

```python
import numpy as np

# Minh họa Hahn-Banach: tìm phiếm hàm tuyến tính bị chặn đạt norm tại x_0
# Trong R^n, đây tương đương bài toán tối ưu tuyến tính

# Không gian R^3 với norm l^2
x0 = np.array([1.0, 2.0, -1.0])
norm_x0 = np.linalg.norm(x0)

# Phiếm hàm F đạt ||F|| = 1 và F(x0) = ||x0||: F = x0 / ||x0||
F = x0 / norm_x0
print(f"x0 = {x0},  ||x0|| = {norm_x0:.4f}")
print(f"F  = {F},   ||F|| = {np.linalg.norm(F):.4f}")
print(f"F(x0) = {F @ x0:.4f}  (should equal ||x0|| = {norm_x0:.4f})")

# Minh họa weak convergence: e_n -> 0 weakly trong l^2
def weak_convergence_demo(N=20):
    a = np.array([1/n**2 for n in range(1, N+1)])  # (a_n) in l^2
    # F(e_n) = a_n -> 0
    vals = [a[n-1] for n in range(1, N+1)]
    print("\nF(e_n) values (should -> 0):")
    for n in [1, 2, 5, 10, 20]:
        if n <= N:
            print(f"  n={n}: F(e_{n}) = a_{n} = {a[n-1]:.6f}")
    print(f"  ||e_n|| = 1.0 for all n (not strongly convergent)")

weak_convergence_demo()
```

---

## Summary / Key Takeaways

- **Hahn-Banach** cho phép mở rộng phiếm hàm tuyến tính bị chặn từ không gian con ra toàn bộ $X$ mà giữ nguyên norm (dùng Zorn's Lemma, không cần đầy đủ).
- **Hệ quả cốt lõi**: $X^*$ tách các điểm; $\|x\| = \sup_{\|F\|\leq 1} |F(x)|$.
- **Separation theorems**: tập lồi có thể tách bằng siêu phẳng — nền tảng của quy hoạch lồi.
- **Double dual** $X^{**}$: $\iota: X \to X^{**}$ là đẳng cự tuyến tính.
- **Reflexive**: $X \cong X^{**}$. Ví dụ: $L^p$ ($1 < p < \infty$), Hilbert spaces.
- **Hội tụ yếu** yếu hơn hội tụ mạnh; trong vô hạn chiều hai loại không tương đương.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapters 3–4.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 4.
- MIT 18.102, Lectures 5–6.
