---
title: "12. Compact Operators"
tags: [math, functional-analysis, lesson-12]
aliases: [Compact Operators]
created: 2026-03-31
---

> **Prerequisites**: [[10-hilbert-spaces|10. Hilbert Spaces]], [[06-hahn-banach-duality|06. Hahn-Banach Theorem & Duality]]
> **Objectives**:
> - Định nghĩa và nhận diện toán tử compact
> - Nắm vững phổ của toán tử compact (eigenvalues tích lũy về 0)
> - Hiểu Fredholm Alternative và ứng dụng vào phương trình tích phân

---

## Motivation / Intuition

Toán tử compact là "toán tử gần giống ma trận nhất" trong vô hạn chiều — chúng ánh xạ tập bị chặn thành tập tương đối compact. Về mặt phổ lý thuyết, chúng có tính chất tương tự ma trận: phổ gồm eigenvalue tích lũy chỉ tại $0$, mỗi eigenvalue khác $0$ có không gian riêng hữu hạn chiều. Fredholm Alternative cho phép giải phương trình toán tử $(\lambda I - T)x = y$ tương tự như hệ tuyến tính hữu hạn chiều.

---

## Định nghĩa và tính chất cơ bản

> [!definition] Definition 12.1 — Toán tử compact (Compact Operator)
> Toán tử tuyến tính $T: X \to Y$ gọi là **compact** (hay toàn liên tục — completely continuous) nếu với mọi dãy bị chặn $(x_n) \subseteq X$, dãy $(Tx_n)$ có dãy con hội tụ trong $Y$.
>
> Tương đương: $T(B_X)$ là tập **tương đối compact** trong $Y$ (có bao đóng compact).
>
> Ký hiệu: $K(X, Y)$ là tập tất cả toán tử compact từ $X$ vào $Y$.

> [!theorem] Theorem 12.2 — Tính chất của toán tử compact
>
> 1. Mọi toán tử compact đều bị chặn: $K(X,Y) \subseteq B(X,Y)$.
> 2. Mọi toán tử **finite-rank** (miền ảnh hữu hạn chiều) đều compact.
> 3. $K(X,Y)$ là không gian con đóng của $B(X,Y)$ (trong norm toán tử).
> 4. Nếu $T \in K(X,Y)$ và $S \in B(Y,Z)$, thì $ST \in K(X,Z)$.
> 5. Nếu $T \in B(X,Y)$ và $S \in K(Y,Z)$, thì $ST \in K(X,Z)$.

> [!theorem] Theorem 12.3 — Compact là giới hạn của finite-rank (trên Hilbert space)
> Trên Hilbert space $H$, $K(H) = \overline{\text{finite-rank operators}}$ trong norm toán tử.

**Proof.** Chiều $\supseteq$: giới hạn uniform của finite-rank compact. Chiều $\subseteq$: Nếu $T$ compact và $(e_n)$ ONB, đặt $P_N$ là chiều lên $\operatorname{span}\{e_1, \ldots, e_N\}$. Thì $P_N T$ là finite-rank. Cần chứng minh $\|P_N T - T\| \to 0$: nếu không, tồn tại $x_n$ với $\|x_n\| = 1$ và $\|(I - P_N)Tx_n\| \geq \varepsilon > 0$. Vì $T$ compact, $(Tx_n)$ có dãy con hội tụ — mâu thuẫn. $\blacksquare$

---

## Ví dụ toán tử compact

> [!example] Example 12.4 — Toán tử tích phân Hilbert-Schmidt
> Cho $k \in L^2([0,1] \times [0,1])$. Toán tử:
>
> $$
> (Tf)(x) = \int_0^1 k(x, t) f(t)\,dt
> $$
>
> là compact từ $L^2[0,1]$ vào $L^2[0,1]$, và $\|T\| \leq \|k\|_{L^2([0,1]^2)}$.

**Proof sketch.** Xấp xỉ $k$ bằng hàm hữu hạn hạng: $k(x,t) \approx \sum_{m,n} c_{mn} e_m(x) e_n(t)$ trong $L^2$, cho finite-rank approximations hội tụ đến $T$. $\blacksquare$

> [!example] Example 12.5 — Toán tử dịch chuyển $R$ trên $\ell^2$ không compact
> Right shift $R(x_1, x_2, \ldots) = (0, x_1, x_2, \ldots)$: dãy $(Re_n) = e_{n+1}$ không có dãy con hội tụ (vì $\|e_{n+1} - e_{m+1}\| = \sqrt{2}$ với $n \neq m$). Vậy $R$ không compact.

> [!example] Example 12.6 — Nhúng Sobolev
> Toán tử nhúng $H^1[0,1] \hookrightarrow L^2[0,1]$ (Sobolev embedding) là compact — đây là ví dụ quan trọng trong lý thuyết PDE.

---

## Phổ của toán tử compact

> [!theorem] Theorem 12.7 — Phổ của toán tử compact (Riesz-Schauder)
> Cho $X$ là Banach space vô hạn chiều và $T \in K(X)$. Khi đó:
>
> 1. $0 \in \sigma(T)$ (phổ luôn chứa $0$).
> 2. Mọi $\lambda \neq 0$ trong $\sigma(T)$ đều là **eigenvalue** (giá trị riêng): $\ker(\lambda I - T) \neq \{0\}$.
> 3. Với mỗi $\lambda \neq 0$: $\ker(\lambda I - T)$ có chiều **hữu hạn**.
> 4. Các eigenvalue khác $0$ chỉ **tích lũy tại $0$**: với mọi $\varepsilon > 0$, chỉ có hữu hạn eigenvalue với $|\lambda| > \varepsilon$.
> 5. $\sigma(T)$ đếm được (có thể hữu hạn hoặc là dãy $\to 0$).

> [!note] Remark 12.8 — So sánh với ma trận
> Với ma trận $n \times n$: phổ là hữu hạn tập. Với compact operator: phổ là dãy hội tụ về $0$ (hoặc hữu hạn). Cả hai trường hợp đều "gần giống" phổ của ma trận — đây là điểm đặc biệt của compact operators, không đúng cho toán tử bị chặn tổng quát (phổ của right shift là đĩa đơn vị).

---

## Fredholm Alternative

> [!theorem] Theorem 12.9 — Fredholm Alternative
> Cho $H$ là Hilbert space, $T \in K(H)$ và $\lambda \neq 0$. Đặt $A = \lambda I - T$. Chính xác một trong hai khả năng sau xảy ra:
>
> **Khả năng I** (Fredholm — phương trình có nghiệm duy nhất):
> $A$ là song ánh. Với mọi $y \in H$, phương trình $Ax = y$ có nghiệm duy nhất, và $A^{-1} \in B(H)$.
>
> **Khả năng II** (Fredholm — phương trình đồng nhất có nghiệm không tầm thường):
> $\ker A \neq \{0\}$ và $\ker A^* \neq \{0\}$ với $\dim \ker A = \dim \ker A^* < \infty$.
> Phương trình $Ax = y$ có nghiệm khi và chỉ khi $y \perp \ker A^*$.

> [!example] Example 12.10 — Áp dụng Fredholm Alternative vào phương trình tích phân
> Xét phương trình Fredholm loại 2:
>
> $$
> \lambda f(x) - \int_0^1 k(x, t) f(t)\,dt = g(x)
> $$
>
> với $\lambda \neq 0$ và $k \in L^2([0,1]^2)$. Đây tương đương với $(\lambda I - T)f = g$ với $T$ compact. Theo Fredholm Alternative: hoặc phương trình có nghiệm duy nhất với mọi $g$, hoặc phương trình đồng nhất ($g = 0$) có nghiệm không tầm thường và phương trình chỉ có nghiệm khi $g$ vuông góc với không gian riêng của $T^*$.

---

## Toán tử Hilbert-Schmidt

> [!definition] Definition 12.11 — Hilbert-Schmidt Operator
> Toán tử $T \in B(H)$ gọi là **Hilbert-Schmidt** nếu với một (do đó mọi) ONB $(e_n)$:
>
> $$
> \|T\|_{HS}^2 = \sum_{n=1}^\infty \|Te_n\|^2 < \infty
> $$
>
> **Hilbert-Schmidt norm**: $\|T\|_{HS} = \left(\sum_n \|Te_n\|^2\right)^{1/2}$.

> [!theorem] Theorem 12.12 — Mọi Hilbert-Schmidt operator đều compact
> Nếu $T$ là Hilbert-Schmidt thì $T$ compact và $\|T\| \leq \|T\|_{HS}$.

---

## SageMath Cheatsheet

```python
import numpy as np
from scipy import linalg

# Toán tử compact: tích phân Fredholm (discretized)
n = 100
t = np.linspace(0, 1, n)
# k(x,t) = min(x,t) (Green's function của -d^2/dt^2)
K = np.array([[min(t[i], t[j]) for j in range(n)] for i in range(n)]) / n

# Eigenvalues (phải tích lũy về 0)
eigenvalues = np.sort(np.abs(np.linalg.eigvalsh(K)))[::-1]
print("Eigenvalues (compact operator, should -> 0):")
for i in [0, 1, 2, 3, 4, 9, 19, 49, 99]:
    print(f"  λ_{i+1} = {eigenvalues[i]:.6f}")

# Kiểm tra: eigenvalues của toán tử Fredholm lý thuyết ≈ 4/((2n-1)^2 π^2)
print("\nTheoretical: λ_n = 4/((2n-1)^2 π^2)")
for n_idx in range(1, 6):
    theory = 4 / ((2*n_idx - 1)**2 * np.pi**2)
    print(f"  n={n_idx}: theory={theory:.6f}, computed={eigenvalues[n_idx-1]:.6f}")

# Hilbert-Schmidt norm
K_full = np.array([[min(t[i], t[j]) for j in range(len(t))] for i in range(len(t))]) / len(t)
hs_norm = np.sqrt(np.sum(np.linalg.norm(K_full, axis=1)**2))
op_norm = np.linalg.norm(K_full, ord=2)
print(f"\n||T||_HS = {hs_norm:.4f},  ||T||_op = {op_norm:.4f}")
print(f"||T||_op <= ||T||_HS? {op_norm <= hs_norm + 1e-10}")
```

---

## Summary / Key Takeaways

- **Compact operator**: tập bị chặn $\to$ tập tương đối compact. Ví dụ: finite-rank, Hilbert-Schmidt, toán tử tích phân với kernel $L^2$.
- $K(H) = \overline{\text{finite-rank}}$ trên Hilbert space.
- **Phổ compact**: $0 \in \sigma(T)$; eigenvalue $\neq 0$ có số hữu hạn trên $|\lambda| > \varepsilon$; mỗi eigenspace hữu hạn chiều.
- **Fredholm Alternative**: hoặc $(\lambda I - T)$ song ánh, hoặc cả hai $\ker(\lambda I - T)$ và $\ker(\lambda I - T^*)$ khác $0$ với cùng chiều.
- Ứng dụng: phương trình tích phân Fredholm loại 2.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapter 4.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Chapter 8.
- MIT 18.102, Lectures 24–28.
