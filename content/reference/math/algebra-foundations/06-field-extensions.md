---
title: "06. Field Extensions"
tags: [math, algebra-foundations, lesson-06]
aliases: [Field Extensions]
created: 2026-03-28
---

> **Prerequisites**: [[01-rings-and-ideals|01. Rings and Ideals]], [[02-special-rings-domains-fields|02. Special Rings: Domains and Fields]], [[03-polynomial-rings-and-factorization|03. Polynomial Rings and Factorization]] — field, ring homomorphism, bất khả quy, quotient ring $k[x]/(f)$.
> **Objectives**:
> - Định nghĩa field extension và degree $[K:F]$
> - Phân biệt algebraic và transcendental extension
> - Xây dựng và mô tả simple extension $F(\alpha)$
> - Phát biểu và chứng minh Tower Law
> - Hiểu vai trò của minimal polynomial và liên hệ $F(\alpha) \cong F[x]/(m_\alpha)$

---

## Motivation / Intuition

Phương trình $x^2 + 1 = 0$ không có nghiệm trong $\mathbb{R}$. Để "sửa" điều này, ta *mở rộng* $\mathbb{R}$ thành $\mathbb{C} = \mathbb{R}(i)$ bằng cách thêm vào một nghiệm $i$. Tương tự, $x^2 - 2 = 0$ không có nghiệm trong $\mathbb{Q}$, nhưng trong $\mathbb{Q}(\sqrt{2})$ thì có.

**Field extension** hệ thống hóa phép xây dựng này: ta bắt đầu từ một field $F$ và "thêm vào" các phần tử mới để giải quyết phương trình đa thức. Đây là chủ đề trung tâm của **Galois Theory** — ngành lý thuyết trả lời câu hỏi "phương trình bậc $n$ có giải được bằng căn thức không?" bằng cách nghiên cứu cấu trúc nhóm của các field extensions.

Nhưng field extensions không chỉ là công cụ của Galois Theory. Trong Commutative Algebra, field extensions xuất hiện khi ta nghiên cứu các fiber của ring homomorphisms và residue fields của prime ideals — những khái niệm nền tảng cho Algebraic Geometry.

---

## Field Extension

### Định nghĩa cơ bản

> [!definition] Definition 6.1 — Field Extension
> Một **field extension** (phần mở rộng trường) $K/F$ là một field $K$ cùng một ring homomorphism đơn ánh $\iota : F \hookrightarrow K$. Ta nói $F$ là **base field** (trường cơ sở) và $K$ là **extension field** (trường mở rộng).
>
> Vì mọi ring homomorphism từ field đều là đơn ánh (kernel là ideal của field, phải là $\{0\}$ hoặc $F$), ta thường đồng nhất $F$ với ảnh của nó trong $K$ và viết $F \subseteq K$.

> [!note] Remark 6.2 — $K$ như $F$-vector space
> Khi $F \subseteq K$, phép nhân của $K$ cho phép ta coi $K$ như một **$F$-vector space**: $F$ tác động lên $K$ bằng phép nhân. Điều này cho phép dùng công cụ của đại số tuyến tính để nghiên cứu field extensions.

> [!definition] Definition 6.3 — Degree của Extension
> **Degree** (bậc) của extension $K/F$, ký hiệu $[K : F]$, là chiều của $K$ như $F$-vector space:
>
> $$
> [K : F] = \dim_F K
> $$
>
> - $K/F$ là **finite extension** (phần mở rộng hữu hạn) nếu $[K:F] < \infty$.
> - $K/F$ là **infinite extension** nếu $[K:F] = \infty$.

> [!example] Example 6.4 — Các ví dụ cơ bản
> - $[\mathbb{C} : \mathbb{R}] = 2$, cơ sở $\{1, i\}$.
> - $[\mathbb{R} : \mathbb{Q}] = \infty$ (vì $\mathbb{R}$ vô chiều trên $\mathbb{Q}$).
> - $[\mathbb{Q}(\sqrt{2}) : \mathbb{Q}] = 2$, cơ sở $\{1, \sqrt{2}\}$.
> - $[\mathbb{Q}(\sqrt[3]{2}) : \mathbb{Q}] = 3$, cơ sở $\{1, \sqrt[3]{2}, \sqrt[3]{4}\}$.
> - $[\mathbb{F}_{p^n} : \mathbb{F}_p] = n$ (sẽ chứng minh ở Bài 08).

---

## Algebraic và Transcendental Elements

> [!definition] Definition 6.5 — Algebraic và Transcendental
> Cho $K/F$ là field extension và $\alpha \in K$.
>
> - $\alpha$ là **algebraic over $F$** (đại số trên $F$) nếu tồn tại đa thức $f \in F[x]$, $f \neq 0$, sao cho $f(\alpha) = 0$.
> - $\alpha$ là **transcendental over $F$** (siêu việt trên $F$) nếu không có đa thức nào như vậy.
>
> Extension $K/F$ là **algebraic extension** nếu mọi $\alpha \in K$ đều algebraic over $F$.

> [!example] Example 6.6
> - $\sqrt{2}, \sqrt[3]{2}, i, \zeta_n = e^{2\pi i/n}$ đều algebraic over $\mathbb{Q}$.
> - $\pi$ và $e$ là transcendental over $\mathbb{Q}$ (Lindemann, 1882; Hermite, 1873) — nhưng chứng minh rất khó.
> - Mọi phần tử của $\mathbb{F}_{p^n}$ algebraic over $\mathbb{F}_p$ (vì $\mathbb{F}_{p^n}$ hữu hạn và mọi phần tử thỏa $x^{p^n} - x = 0$).
> - $x \in F(x) = \operatorname{Frac}(F[x])$ transcendental over $F$.

### Evaluation homomorphism và kernel

> [!theorem] Theorem 6.7 — Kernel của Evaluation Map
> Cho $\alpha \in K$ algebraic over $F$. Xét evaluation map $\operatorname{ev}_\alpha : F[x] \to K$, $f \mapsto f(\alpha)$.
>
> Khi đó $\ker(\operatorname{ev}_\alpha)$ là một prime ideal khác $\{0\}$ trong $F[x]$. Vì $F[x]$ là PID, $\ker(\operatorname{ev}_\alpha) = (m_\alpha)$ với $m_\alpha \in F[x]$ monic bất khả quy duy nhất.

**Proof.**
Vì $\alpha$ algebraic, $\ker(\operatorname{ev}_\alpha) \neq \{0\}$. Trong $F[x]$ (PID), mọi ideal là principal: $\ker = (m_\alpha)$ với $m_\alpha$ monic bậc tối thiểu. Vì $F[x]/(m_\alpha) \hookrightarrow K$ là integral domain, $(m_\alpha)$ là prime ideal. Vì $F[x]$ là PID, prime ideal khác $\{0\}$ là maximal, suy ra $m_\alpha$ bất khả quy. $\blacksquare$

> [!definition] Definition 6.8 — Minimal Polynomial
> **Minimal polynomial** (đa thức tối tiểu) của $\alpha$ over $F$ là đa thức monic bất khả quy $m_\alpha \in F[x]$ sinh $\ker(\operatorname{ev}_\alpha)$. Ký hiệu $m_{\alpha, F}$ khi cần nhấn mạnh base field.
>
> Bậc của $m_\alpha$ gọi là **degree** (bậc) của $\alpha$ over $F$, ký hiệu $[F(\alpha) : F]$.

> [!note] Remark 6.9 — Đặc trưng của minimal polynomial
> $m_\alpha$ là đa thức monic bậc nhỏ nhất trong $F[x]$ có $\alpha$ là nghiệm. Hơn nữa, $f(\alpha) = 0$ với $f \in F[x]$ $\iff$ $m_\alpha \mid f$.

---

## Simple Extension

### Xây dựng $F(\alpha)$

> [!definition] Definition 6.10 — Simple Extension
> Cho $K/F$ và $\alpha \in K$. **Simple extension** (phần mở rộng đơn) $F(\alpha)$ là field nhỏ nhất trong $K$ chứa $F$ và $\alpha$:
>
> $$
> F(\alpha) = \bigcap \{L \mid F \subseteq L \subseteq K,\; \alpha \in L,\; L \text{ là field}\}
> $$

> [!theorem] Theorem 6.11 — Cấu trúc của $F(\alpha)$
> **(a)** Nếu $\alpha$ algebraic over $F$ với minimal polynomial $m_\alpha$ bậc $n$:
>
> $$
> F(\alpha) \cong F[x]/(m_\alpha)
> $$
>
> và $[F(\alpha) : F] = n$. Mọi phần tử của $F(\alpha)$ viết duy nhất dạng:
>
> $$
> a_0 + a_1 \alpha + \cdots + a_{n-1} \alpha^{n-1}, \quad a_i \in F
> $$
>
> **(b)** Nếu $\alpha$ transcendental over $F$:
>
> $$
> F(\alpha) \cong F(x) = \operatorname{Frac}(F[x])
> $$
>
> và $[F(\alpha) : F] = \infty$.

**Proof của (a).**
Evaluation map $\operatorname{ev}_\alpha : F[x] \to K$ có kernel $(m_\alpha)$ và image $F[\alpha] = \{f(\alpha) \mid f \in F[x]\}$. Vì $m_\alpha$ bất khả quy, $F[x]/(m_\alpha)$ là field (Theorem 3.20, Bài 03), suy ra $F[\alpha] \cong F[x]/(m_\alpha)$ là field. Vì $F[\alpha] \subseteq K$ và $\alpha \in F[\alpha]$, ta có $F(\alpha) \subseteq F[\alpha]$. Hiển nhiên $F[\alpha] \subseteq F(\alpha)$. Vậy $F(\alpha) = F[\alpha] \cong F[x]/(m_\alpha)$.

Tập $\{1, \alpha, \ldots, \alpha^{n-1}\}$ là cơ sở $F$-vector space của $F[x]/(m_\alpha)$ vì mọi đa thức bậc $< n$ là linearly independent modulo $(m_\alpha)$. $\blacksquare$

> [!example] Example 6.12 — Simple extensions quen thuộc
> - $\mathbb{Q}(\sqrt{2}) \cong \mathbb{Q}[x]/(x^2 - 2)$, degree $2$, cơ sở $\{1, \sqrt{2}\}$.
> - $\mathbb{Q}(\sqrt[3]{2}) \cong \mathbb{Q}[x]/(x^3 - 2)$, degree $3$, cơ sở $\{1, \sqrt[3]{2}, \sqrt[3]{4}\}$.
> - $\mathbb{Q}(i) \cong \mathbb{Q}[x]/(x^2+1) \cong \mathbb{Q}(i) = \mathbb{Q}(i)$, degree $2$.
> - $\mathbb{F}_2(\alpha)$ với $\alpha$ nghiệm của $x^2 + x + 1$ bất khả quy trên $\mathbb{F}_2$: field $4$ phần tử $\mathbb{F}_4 = \{0, 1, \alpha, \alpha+1\}$.

> [!example] Example 6.13 — Tính toán trong $\mathbb{Q}(\sqrt[3]{2})$
> Trong $\mathbb{Q}(\sqrt[3]{2})$, đặt $\theta = \sqrt[3]{2}$. Vì $\theta^3 = 2$, mọi phép tính rút về bậc $< 3$:
>
> $$
> (1 + \theta)(1 + \theta^2) = 1 + \theta + \theta^2 + \theta^3 = 1 + \theta + \theta^2 + 2 = 3 + \theta + \theta^2
> $$
>
> Để tính nghịch đảo của $1 + \theta$: viết $(1+\theta)(a + b\theta + c\theta^2) = 1$ và giải hệ phương trình tuyến tính trên $\mathbb{Q}$ cho $a, b, c$.

---

## Tower Law

> [!theorem] Theorem 6.14 — Tower Law (Multiplicativity of Degree)
> Cho tower of fields $F \subseteq K \subseteq L$. Khi đó:
>
> $$
> [L : F] = [L : K] \cdot [K : F]
> $$
>
> (trong đó $\infty \cdot n = \infty$ với $n > 0$, và cả hai vế cùng hữu hạn hoặc cùng vô hạn).

**Proof.**
Giả sử $[K:F] = m$ với cơ sở $\{u_1, \ldots, u_m\}$ và $[L:K] = n$ với cơ sở $\{v_1, \ldots, v_n\}$. Ta chứng minh $\{u_i v_j\}_{i,j}$ là cơ sở của $L$ trên $F$.

*Sinh*: Với $x \in L$, viết $x = \sum_j c_j v_j$ ($c_j \in K$) và $c_j = \sum_i a_{ij} u_i$ ($a_{ij} \in F$). Suy ra $x = \sum_{i,j} a_{ij} u_i v_j$.

*Độc lập tuyến tính*: Nếu $\sum_{i,j} a_{ij} u_i v_j = 0$ với $a_{ij} \in F$, thì $\sum_j \left(\sum_i a_{ij} u_i\right) v_j = 0$. Vì $v_j$ độc lập tuyến tính trên $K$, mỗi $\sum_i a_{ij} u_i = 0$ trong $K$. Vì $u_i$ độc lập tuyến tính trên $F$, mỗi $a_{ij} = 0$. $\blacksquare$

> [!corollary] Corollary 6.15
> Nếu $[K:F] = n$ thì $[F(\alpha):F]$ chia hết $n$ với mọi $\alpha \in K$.

> [!example] Example 6.16 — Áp dụng Tower Law
> Xét $\mathbb{Q} \subseteq \mathbb{Q}(\sqrt{2}) \subseteq \mathbb{Q}(\sqrt{2}, \sqrt{3})$:
>
> - $[\mathbb{Q}(\sqrt{2}) : \mathbb{Q}] = 2$.
> - $\sqrt{3} \notin \mathbb{Q}(\sqrt{2})$ (nếu $\sqrt{3} = a + b\sqrt{2}$ thì $3 = a^2 + 2b^2 + 2ab\sqrt{2}$ suy ra $ab = 0$; kiểm tra hai trường hợp đều mâu thuẫn).
> - Suy ra $[\mathbb{Q}(\sqrt{2}, \sqrt{3}) : \mathbb{Q}(\sqrt{2})] = 2$.
> - Tower Law: $[\mathbb{Q}(\sqrt{2}, \sqrt{3}) : \mathbb{Q}] = 4$, cơ sở $\{1, \sqrt{2}, \sqrt{3}, \sqrt{6}\}$.

> [!warning] Counterexample 6.17 — Tower Law với extension vô hạn
> $[\mathbb{R} : \mathbb{Q}] = \infty$ và $[\mathbb{C} : \mathbb{R}] = 2$, nhưng $[\mathbb{C} : \mathbb{Q}] = \infty$. Tower Law vẫn nhất quán: $\infty = 2 \cdot \infty$.

---

## Algebraic Extension và Tính chất

> [!theorem] Theorem 6.18 — Finite $\Rightarrow$ Algebraic
> Mọi finite extension đều là algebraic extension.

**Proof.**
Cho $[K:F] = n$ và $\alpha \in K$. Tập $\{1, \alpha, \alpha^2, \ldots, \alpha^n\}$ gồm $n+1$ phần tử trong $K$ nên phụ thuộc tuyến tính trên $F$: tồn tại $a_i \in F$ không đồng thời bằng $0$ với $\sum_{i=0}^n a_i \alpha^i = 0$. Vậy $\alpha$ là nghiệm của đa thức $\sum a_i x^i \in F[x]$. $\blacksquare$

> [!warning] Counterexample 6.19 — Algebraic không nhất thiết Finite
> $\overline{\mathbb{Q}}$ (algebraic closure của $\mathbb{Q}$) là algebraic over $\mathbb{Q}$ nhưng $[\overline{\mathbb{Q}} : \mathbb{Q}] = \infty$, vì với mọi $n$, $[\mathbb{Q}(\sqrt[n]{2}) : \mathbb{Q}] = n$.

> [!theorem] Theorem 6.20 — Tổ hợp và tính chất
> **(a)** Nếu $K/F$ và $L/K$ đều algebraic thì $L/F$ algebraic.
>
> **(b)** Tập $\overline{F}_K = \{\alpha \in K \mid \alpha \text{ algebraic over } F\}$ là subfield của $K$, gọi là **algebraic closure của $F$ trong $K$**.
>
> **(c)** Nếu $\alpha, \beta$ algebraic over $F$ thì $\alpha \pm \beta$, $\alpha\beta$, $\alpha/\beta$ ($\beta \neq 0$) đều algebraic over $F$.

**Proof của (b) và (c).**
Cho $\alpha, \beta$ algebraic over $F$ với $[F(\alpha):F] = m$ và $[F(\alpha,\beta):F(\alpha)] \leq \deg m_{\beta, F(\alpha)}$. Vì $m_{\beta,F} \in F[x] \subseteq F(\alpha)[x]$ và $\beta$ là nghiệm của nó, $[F(\alpha,\beta):F(\alpha)]$ hữu hạn. Tower Law cho $[F(\alpha,\beta):F]$ hữu hạn, tức mọi phần tử của $F(\alpha,\beta)$ algebraic over $F$. Vì $\alpha \pm \beta, \alpha\beta, \alpha/\beta \in F(\alpha,\beta)$, chúng algebraic. $\blacksquare$

---

## Compass-and-Straightedge Constructions (ứng dụng)

> [!example] Example 6.21 — Constructibility và Degree
> Một số thực $\alpha$ **constructible** (dựng được bằng thước và compa từ $\mathbb{Q}$) khi và chỉ khi $[\mathbb{Q}(\alpha) : \mathbb{Q}]$ là lũy thừa của $2$.
>
> Từ đây, ba bài toán cổ đại không giải được:
>
> - **Trisecting an angle** (chia ba góc): $\cos(20°)$ là nghiệm của $8x^3 - 6x - 1 = 0$, bậc $3$ trên $\mathbb{Q}$. Vì $3 \nmid 2^k$, không constructible.
> - **Doubling the cube** (nhân đôi hình lập phương): $\sqrt[3]{2}$ có degree $3$ — không constructible.
> - **Squaring the circle** (cầu phương vòng tròn): $\pi$ transcendental (Lindemann) — không constructible.

---

## SageMath Cheatsheet

```python
K.<a> = NumberField(x^2 - 2)
print(K)
print(K.degree())
print(K.basis())

R.<x> = QQ[]
f = x^3 - 2
K.<theta> = NumberField(f)
print(K.absolute_degree())

alpha = K.gen()
print((1 + alpha) * (1 + alpha^2))

L.<b> = K.extension(x^2 - 3)
print(L.absolute_degree())

F = GF(2)
R.<x> = F[]
f = x^2 + x + 1
print(f.is_irreducible())
K.<a> = GF(4)
print(K.list())

K.<a> = NumberField(x^2 - 2)
print(a.minpoly())
print(a.minpoly().degree())
```

---

## Summary / Key Takeaways

- **Field extension** $K/F$: $K$ là $F$-vector space; degree $[K:F] = \dim_F K$.
- **Algebraic** $\alpha$: có đa thức $f \in F[x]$ triệt tiêu — đặc trưng bởi **minimal polynomial** $m_\alpha$ monic bất khả quy duy nhất.
- **Simple extension**: $F(\alpha) \cong F[x]/(m_\alpha)$ với $[F(\alpha):F] = \deg m_\alpha$ (algebraic case).
- **Tower Law**: $[L:F] = [L:K]\cdot[K:F]$ — công cụ tính bậc composite extensions.
- **Finite $\Rightarrow$ Algebraic** (không đảo lại): $\overline{\mathbb{Q}}/\mathbb{Q}$ algebraic nhưng vô hạn chiều.
- Tập các phần tử algebraic trên $F$ trong $K$ là subfield — đóng với $\pm, \times, \div$.
- **Ứng dụng**: constructibility $\iff$ degree là lũy thừa của $2$ — giải quyết ba bài toán cổ đại.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 13.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter V.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 3.
- https://doc.sagemath.org/html/en/reference/number_fields/
