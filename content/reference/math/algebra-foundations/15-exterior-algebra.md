---
title: "15. Exterior Algebra and Determinants"
tags: [math, algebra-foundations, lesson-15]
aliases: [Exterior Algebra, Grassmann Algebra]
created: 2026-03-28
---

> **Prerequisites**: [[14-tensor-algebra|14. Tensor Algebra]] — tensor algebra $T(M)$, graded algebra, ideal hai phía, quotient. [[09-modules-definitions|09. Modules: Definitions and Basic Constructions]] — free module, linear map.
> **Objectives**:
> - Xây dựng exterior algebra $\bigwedge(M)$ qua quotient của $T(M)$
> - Chứng minh universal property của $\bigwedge(M)$ đối với alternating maps
> - Hiểu $\bigwedge^n(R^k)$ và cơ sở của nó
> - Xây dựng determinant một cách hoàn toàn algebra từ $\bigwedge^n$
> - Nắm vững tính chất của exterior algebra: graded-commutative, Poincaré duality

---

## Motivation / Intuition

Determinant của ma trận $n \times n$ là một hàm của $n$ vector cột thỏa ba tính chất: multilinear, alternating (đổi dấu khi hoán vị hai cột), và chuẩn hóa ($\det I = 1$). Đây không phải tình cờ — **exterior algebra** $\bigwedge(M)$ là cấu trúc đại số nắm bắt chính xác ý tưởng "alternating multilinear map".

Geometric intuition: $v_1 \wedge v_2$ trong $\bigwedge^2(\mathbb{R}^2)$ đại diện cho **oriented area** (diện tích có hướng) của hình bình hành sinh bởi $v_1$ và $v_2$. Điều kiện $v \wedge v = 0$ phản ánh thực tế: diện tích của hình bình hành với hai cạnh bằng nhau là $0$.

Exterior algebra xuất hiện khắp nơi trong toán học hiện đại: differential forms trên manifolds, determinant line bundle trong Algebraic Geometry, và Grassmannian variety — không gian các $k$-plane trong $\mathbb{R}^n$ — được parametrize bởi $\bigwedge^k$.

---

## Exterior Algebra

### Định nghĩa qua Quotient của $T(M)$

> [!definition] Definition 15.1 — Exterior Algebra
> Cho $M$ là $R$-module. **Exterior algebra** (đại số ngoài) hay **Grassmann algebra** của $M$ là:
>
> $$
> \bigwedge(M) = T(M) / I
> $$
>
> trong đó $I$ là two-sided ideal sinh bởi tất cả phần tử dạng $m \otimes m$ với $m \in M$:
>
> $$
> I = \langle m \otimes m \mid m \in M \rangle
> $$
>
> Ảnh của $m_1 \otimes \cdots \otimes m_n$ trong $\bigwedge(M)$ ký hiệu $m_1 \wedge \cdots \wedge m_n$ (wedge product).
>
> Grading kế thừa từ $T(M)$: $\bigwedge(M) = \bigoplus_{n \geq 0} \bigwedge^n(M)$ với $\bigwedge^n(M) = T^n(M)/(I \cap T^n(M))$.

> [!note] Remark 15.2 — Anticommutativity
> Từ $m \otimes m = 0$ trong $\bigwedge(M)$, suy ra tính **anticommutative**:
>
> $$
> m \wedge n + n \wedge m = 0, \quad \text{tức } m \wedge n = -n \wedge m
> $$
>
> *Proof:* $(m+n) \wedge (m+n) = 0 \Rightarrow m \wedge m + m \wedge n + n \wedge m + n \wedge n = 0 \Rightarrow m \wedge n + n \wedge m = 0$.
>
> Tổng quát: với $\sigma \in S_k$ là một hoán vị, $m_{\sigma(1)} \wedge \cdots \wedge m_{\sigma(k)} = \operatorname{sgn}(\sigma) \cdot m_1 \wedge \cdots \wedge m_k$.

### Universal Property

> [!theorem] Theorem 15.3 — Universal Property của $\bigwedge(M)$
> Có $R$-linear $\iota : M \to \bigwedge^1(M) \subset \bigwedge(M)$. Với mọi $R$-algebra $A$ và mọi $R$-linear $f : M \to A$ thỏa $f(m)^2 = 0$ với mọi $m \in M$, tồn tại duy nhất $R$-algebra homomorphism $\bar{f} : \bigwedge(M) \to A$ với $\bar{f} \circ \iota = f$:
>
> $$
> \bar{f}(m_1 \wedge \cdots \wedge m_n) = f(m_1) \cdot f(m_2) \cdots f(m_n)
> $$

**Proof.**
Theo universal property của $T(M)$, $f$ nâng thành $\tilde{f}: T(M) \to A$. Vì $f(m)^2 = 0$ trong $A$, $\tilde{f}$ triệt tiêu trên $I = \langle m \otimes m \rangle$. Vậy $\tilde{f}$ cảm sinh $\bar{f}: T(M)/I = \bigwedge(M) \to A$. $\blacksquare$

---

## Cấu trúc của $\bigwedge^n(R^k)$

> [!theorem] Theorem 15.4 — Basis của $\bigwedge^n(R^k)$
> Cho $M = R^k$ với basis chuẩn $e_1, \ldots, e_k$. Khi đó:
>
> 1. $\bigwedge^n(R^k)$ có basis $\{e_{i_1} \wedge e_{i_2} \wedge \cdots \wedge e_{i_n} \mid 1 \leq i_1 < i_2 < \cdots < i_n \leq k\}$.
> 2. $\dim_R \bigwedge^n(R^k) = \binom{k}{n}$.
> 3. $\bigwedge^n(R^k) = 0$ với $n > k$.
> 4. $\bigwedge^k(R^k) \cong R$ — module rank $1$ với generator $e_1 \wedge \cdots \wedge e_k$.
> 5. $\dim_R \bigwedge(R^k) = \sum_{n=0}^k \binom{k}{n} = 2^k$.

**Proof.**
Mọi phần tử của $\bigwedge^n(R^k)$ là tổ hợp tuyến tính của $e_{i_1} \wedge \cdots \wedge e_{i_n}$. Bằng tính anticommutative, ta có thể sắp xếp lại để $i_1 < i_2 < \cdots < i_n$ (mỗi phép hoán vị đổi dấu, và nếu $i_j = i_{j'}$ thì wedge bằng $0$). Các phần tử này tuyến tính độc lập (chứng minh qua đối ngẫu với alternating multilinear forms). $\blacksquare$

> [!example] Example 15.5 — $\bigwedge(\mathbb{R}^3)$
> $\bigwedge(\mathbb{R}^3) = \bigwedge^0 \oplus \bigwedge^1 \oplus \bigwedge^2 \oplus \bigwedge^3$:
>
> - $\bigwedge^0 = \mathbb{R}$, cơ sở $\{1\}$.
> - $\bigwedge^1 = \mathbb{R}^3$, cơ sở $\{e_1, e_2, e_3\}$.
> - $\bigwedge^2$, cơ sở $\{e_1 \wedge e_2, e_1 \wedge e_3, e_2 \wedge e_3\}$, chiều $3$.
> - $\bigwedge^3$, cơ sở $\{e_1 \wedge e_2 \wedge e_3\}$, chiều $1$.
>
> Tổng chiều: $1 + 3 + 3 + 1 = 8 = 2^3$. ✓

---

## Determinant từ Exterior Algebra

> [!theorem] Theorem 15.6 — Determinant via $\bigwedge^n$
> Cho $f : R^n \to R^n$ là $R$-linear map (tức ma trận $n \times n$). Ánh xạ $\bigwedge^n(f) : \bigwedge^n(R^n) \to \bigwedge^n(R^n)$ là nhân với một scalar $\det(f) \in R$, và:
>
> $$
> \bigwedge^n(f)(e_1 \wedge \cdots \wedge e_n) = \det(f) \cdot (e_1 \wedge \cdots \wedge e_n)
> $$
>
> Đây là **định nghĩa** của determinant. Mọi tính chất của $\det$ suy ra từ exterior algebra:
>
> 1. $\det(f \circ g) = \det(f) \cdot \det(g)$ (vì $\bigwedge^n(f \circ g) = \bigwedge^n(f) \circ \bigwedge^n(g)$).
> 2. $\det(\operatorname{id}) = 1$.
> 3. $\det(f) = 0 \iff f$ không đơn ánh.

**Proof của 3.**
$f$ không đơn ánh $\iff$ $f(v) = 0$ với $v \neq 0$ $\iff$ $\{f(e_1), \ldots, f(e_n)\}$ phụ thuộc tuyến tính $\iff$ $f(e_1) \wedge \cdots \wedge f(e_n) = 0$ trong $\bigwedge^n(R^n)$ $\iff$ $\det(f) = 0$. $\blacksquare$

> [!example] Example 15.7 — Tính $\det$ từ wedge product
> Cho $f : \mathbb{R}^2 \to \mathbb{R}^2$ với $f(e_1) = ae_1 + ce_2$ và $f(e_2) = be_1 + de_2$. Khi đó:
>
> $$
> f(e_1) \wedge f(e_2) = (ae_1 + ce_2) \wedge (be_1 + de_2)
> $$
>
> $$
> = ab(e_1 \wedge e_1) + ad(e_1 \wedge e_2) + cb(e_2 \wedge e_1) + cd(e_2 \wedge e_2)
> $$
>
> $$
> = 0 + ad(e_1 \wedge e_2) - cb(e_1 \wedge e_2) + 0 = (ad - bc)(e_1 \wedge e_2)
> $$
>
> Vậy $\det(f) = ad - bc$ — công thức determinant $2 \times 2$ suy ra tự nhiên!

---

## Alternating Maps và Differential Forms

> [!definition] Definition 15.8 — Alternating Multilinear Map
> Map $f : M^n = M \times \cdots \times M \to N$ là **alternating** nếu $f(\ldots, m, \ldots, m, \ldots) = 0$ khi hai đối số bằng nhau.
>
> Universal property cho: $\operatorname{Hom}_R(\bigwedge^n(M), N) \cong \operatorname{Alt}_R^n(M, N)$ (alternating $n$-linear maps $M^n \to N$).

> [!example] Example 15.9 — Differential Forms
> Trên manifold $X$ chiều $n$, **differential $k$-form** là section của $\bigwedge^k(T^*X)$. Toán tử exterior derivative $d : \Omega^k(X) \to \Omega^{k+1}(X)$ thỏa $d \circ d = 0$ — đây chính là điều kiện $d \wedge d = 0$ của exterior algebra.
>
> Tích phân của $k$-form trên $k$-manifold là tổng quát hóa của tích phân thông thường, và Stokes' Theorem $\int_M d\omega = \int_{\partial M} \omega$ là tổng quát hóa của mọi định lý vi tích phân cổ điển.

---

## Graded-Commutativity và Poincaré Duality

> [!theorem] Theorem 15.10 — Graded-Commutativity
> Trong $\bigwedge(M)$: với $\alpha \in \bigwedge^p(M)$ và $\beta \in \bigwedge^q(M)$:
>
> $$
> \alpha \wedge \beta = (-1)^{pq} \beta \wedge \alpha
> $$

**Proof.**
Đủ chứng minh cho $\alpha = m_1 \wedge \cdots \wedge m_p$ và $\beta = n_1 \wedge \cdots \wedge n_q$. Di chuyển $n_j$ qua $p$ phần tử $m_i$ bằng anticommutativity, mỗi lần đổi dấu. Tổng cộng $pq$ hoán vị, cho hệ số $(-1)^{pq}$. $\blacksquare$

> [!note] Remark 15.11 — Poincaré Duality (gợi ý)
> Khi $M = R^n$ (free, rank $n$), có isomorphism tự nhiên:
>
> $$
> \bigwedge^k(R^n) \cong \operatorname{Hom}_R\!\left(\bigwedge^{n-k}(R^n),\, \bigwedge^n(R^n)\right) \cong \operatorname{Hom}_R\!\left(\bigwedge^{n-k}(R^n),\, R\right)
> $$
>
> qua $\alpha \mapsto [\beta \mapsto \alpha \wedge \beta]$ (tính trên generator $e_1 \wedge \cdots \wedge e_n$). Đây là phiên bản algebraic của **Poincaré duality** trong topology: $H^k(M) \cong H^{n-k}(M)^\vee$.

---

## SageMath Cheatsheet

```python
E = ExteriorAlgebra(QQ, 'e', 3)
e1, e2, e3 = E.gens()
print(e1 * e2)
print(e2 * e1)
print(e1 * e1)

print(e1 * e2 * e3)
print((e1 + e2) * (e1 + e3))

M = matrix(QQ, [[1, 2], [3, 4]])
print(M.det())

v1 = vector(QQ, [1, 2, 0])
v2 = vector(QQ, [0, 1, 3])
v3 = vector(QQ, [1, 0, 1])
M = matrix([v1, v2, v3])
print(M.det())

E = ExteriorAlgebra(QQ, 'e', 4)
gens = E.gens()
basis_2 = [gens[i]*gens[j] for i in range(4) for j in range(i+1, 4)]
print(len(basis_2))
```

---

## Summary / Key Takeaways

- **Exterior algebra** $\bigwedge(M) = T(M)/\langle m \otimes m \rangle$: graded algebra với $m \wedge n = -n \wedge m$.
- **Universal property**: mọi $f: M \to A$ với $f(m)^2 = 0$ nâng thành duy nhất algebra hom $\bar{f}: \bigwedge(M) \to A$.
- $\bigwedge^n(R^k)$: basis $\{e_{i_1} \wedge \cdots \wedge e_{i_n}\}$ với $i_1 < \cdots < i_n$; chiều $\binom{k}{n}$; $\bigwedge^k(R^k) \cong R$.
- **Determinant**: $\det(f)$ là scalar qua $\bigwedge^n(f)$ trên $\bigwedge^n(R^n) \cong R$. Mọi tính chất của $\det$ suy ra từ functor $\bigwedge^n$.
- **Graded-commutativity**: $\alpha \wedge \beta = (-1)^{pq} \beta \wedge \alpha$ với $\alpha \in \bigwedge^p$, $\beta \in \bigwedge^q$.
- $\operatorname{Hom}(\bigwedge^n(M), N) \cong \operatorname{Alt}^n(M, N)$ — đại diện alternating multilinear maps.
- **Differential forms**: $\Omega^k(X) = \Gamma(\bigwedge^k T^*X)$; $d \circ d = 0$; Stokes' Theorem.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 11.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter XIX.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 8.
- Lam, T. Y. *A First Course in Noncommutative Rings*, Chapter 1.
