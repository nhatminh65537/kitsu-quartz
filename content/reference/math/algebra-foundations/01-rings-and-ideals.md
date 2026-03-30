---
title: "01. Rings and Ideals"
tags: [math, algebra-foundations, lesson-01]
aliases: [Rings and Ideals]
created: 2026-03-28
---

> **Prerequisites**: Group Theory cơ bản (định nghĩa nhóm, nhóm con, đồng cấu nhóm)
> **Objectives**:
> - Nắm vững định nghĩa ring và nhận diện các ví dụ quen thuộc
> - Hiểu khái niệm ideal và phân biệt ideal trái, phải, hai phía
> - Xây dựng và làm việc với quotient ring
> - Phát biểu và áp dụng các định lý đẳng cấu cho rings
> - Hiểu Correspondence Theorem và ứng dụng

---

## Motivation / Intuition

Trong Group Theory, ta nghiên cứu một tập hợp với **một** phép toán. Thực tế toán học phong phú hơn: số nguyên $\mathbb{Z}$ có cả phép cộng lẫn phép nhân, đa thức $\mathbb{Q}[x]$ cũng vậy. Câu hỏi tự nhiên: ta có thể nắm bắt cấu trúc "hai phép toán" này ở mức độ trừu tượng không?

Câu trả lời là **ring** (vành). Lý thuyết ring không chỉ hợp nhất $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$, $\mathbb{Z}/n\mathbb{Z}$, $\mathbb{Q}[x]$, $M_n(\mathbb{R})$ dưới cùng một mái nhà — nó còn là ngôn ngữ thiết yếu của Commutative Algebra, Algebraic Geometry, và Algebraic Number Theory.

Vai trò của **ideal** trong ring tương tự như vai trò của **normal subgroup** trong nhóm: chúng là đúng loại tập con cho phép ta xây dựng quotient và phát biểu các định lý đẳng cấu.

---

## Ring (Vành)

### Định nghĩa

> [!definition] Definition 1.1 — Ring (Vành)
> Một **ring** là một bộ $(R, +, \cdot)$ gồm một tập hợp $R$ cùng hai phép toán hai ngôi thỏa mãn:
>
> 1. $(R, +)$ là một nhóm Abel — phép cộng (addition) có đơn vị $0$ và nghịch đảo $-a$.
>
> 2. Phép nhân (multiplication) là kết hợp:
>
> $$
> \forall\, a,b,c \in R: \quad (a \cdot b) \cdot c = a \cdot (b \cdot c)
> $$
>
> 3. Phân phối (Distributivity) hai chiều:
>
> $$
> a \cdot (b + c) = a \cdot b + a \cdot c, \qquad (a + b) \cdot c = a \cdot c + b \cdot c
> $$

> [!note] Remark 1.2 — Ring có đơn vị (Unital Ring)
> Nhiều tác giả (D&F, Lang, Atiyah–MacDonald) yêu cầu thêm:
>
> 4. **Phần tử đơn vị nhân** (Multiplicative identity): $\exists\, 1 \in R$ sao cho $1 \cdot a = a \cdot 1 = a$ với mọi $a \in R$.
>
> Trong toàn bộ series này, ta luôn giả sử $R$ có đơn vị $1$ và $1 \neq 0$ (trừ khi ghi chú khác). Ring không nhất thiết giao hoán — tức $a \cdot b$ có thể $\neq b \cdot a$.

> [!definition] Definition 1.3 — Commutative Ring
> Ring $R$ được gọi là **giao hoán** (commutative) nếu $a \cdot b = b \cdot a$ với mọi $a, b \in R$.

### Các ví dụ nền tảng

> [!example] Example 1.4 — Các rings quen thuộc
> - $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$: commutative rings với $1$.
> - $\mathbb{Z}/n\mathbb{Z}$: ring các số nguyên modulo $n$, commutative.
> - $\mathbb{Z}[i] = \{a + bi \mid a, b \in \mathbb{Z}\}$: **Gaussian integers**, commutative.
> - $\mathbb{Z}[\sqrt{-5}] = \{a + b\sqrt{-5} \mid a, b \in \mathbb{Z}\}$: commutative, nhưng **không phải UFD** — đây là ví dụ kinh điển cho thấy sự phân tích thành nhân tử không nhất thiết duy nhất.
> - $M_n(R)$: ring các ma trận $n \times n$ với entries trong ring $R$, **không giao hoán** khi $n \geq 2$.
> - $R[x]$: vành đa thức (polynomial ring) với hệ số trong $R$ — sẽ nghiên cứu chi tiết ở Bài 03.

> [!warning] Counterexample 1.5 — $\mathbb{Z}/6\mathbb{Z}$ có zero divisors
> Trong $\mathbb{Z}/6\mathbb{Z}$: $2 \cdot 3 = 6 \equiv 0$, nhưng $2 \neq 0$ và $3 \neq 0$. Đây là ví dụ ring giao hoán **không** phải integral domain — một khái niệm sẽ được phân tích kỹ ở Bài 02.

### Tính chất cơ bản

> [!theorem] Theorem 1.6 — Các tính chất cơ bản của ring
> Trong bất kỳ ring $R$ nào:
>
> 1. $0 \cdot a = a \cdot 0 = 0$ với mọi $a \in R$.
> 2. $(-1) \cdot a = -a$ với mọi $a \in R$ (khi $R$ có đơn vị).
> 3. $(-a) \cdot b = a \cdot (-b) = -(a \cdot b)$.
> 4. Phần tử đơn vị $1$ là duy nhất.

**Proof.**
(1) $0 \cdot a = (0 + 0) \cdot a = 0 \cdot a + 0 \cdot a$. Triệt tiêu $0 \cdot a$ từ hai vế (trong nhóm Abel $(R,+)$) cho $0 \cdot a = 0$.

(2) $a + (-1) \cdot a = 1 \cdot a + (-1) \cdot a = (1 + (-1)) \cdot a = 0 \cdot a = 0$. Vậy $(-1) \cdot a = -a$.

(3) $(-a) \cdot b + a \cdot b = (-a + a) \cdot b = 0 \cdot b = 0$, suy ra $(-a) \cdot b = -(a \cdot b)$.

(4) Nếu $1, 1'$ đều là đơn vị thì $1 = 1 \cdot 1' = 1'$. $\blacksquare$

---

## Đơn vị và Ring Homomorphism

### Units

> [!definition] Definition 1.7 — Unit (Đơn vị)
> Phần tử $u \in R$ được gọi là **unit** (đơn vị) nếu tồn tại $v \in R$ sao cho $u \cdot v = v \cdot u = 1$. Tập tất cả các units của $R$ được ký hiệu $R^\times$ và tạo thành một **nhóm** (nhân).

> [!example] Example 1.8
> - $\mathbb{Z}^\times = \{1, -1\}$.
> - $\mathbb{Q}^\times = \mathbb{Q} \setminus \{0\}$.
> - $(\mathbb{Z}/n\mathbb{Z})^\times = \{[a] \mid \gcd(a,n) = 1\}$, có bậc $\varphi(n)$.
> - $M_n(k)^\times = GL_n(k)$ với $k$ là field.

### Ring Homomorphism

> [!definition] Definition 1.9 — Ring Homomorphism
> Một **ring homomorphism** từ $R$ đến $S$ là một ánh xạ $\varphi : R \to S$ thỏa mãn với mọi $a, b \in R$:
>
> $$
> \varphi(a + b) = \varphi(a) + \varphi(b), \qquad \varphi(a \cdot b) = \varphi(a) \cdot \varphi(b), \qquad \varphi(1_R) = 1_S
> $$
>
> - **Monomorphism**: $\varphi$ đơn ánh (injective).
> - **Epimorphism**: $\varphi$ toàn ánh (surjective).
> - **Isomorphism**: $\varphi$ song ánh; ký hiệu $R \cong S$.
> - **Endomorphism**: $\varphi : R \to R$.
> - **Automorphism**: isomorphism từ $R$ vào chính nó.

> [!example] Example 1.10 — Các ring homomorphism cơ bản
> - **Projection**: $\mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}$, $a \mapsto [a]$ — epimorphism.
> - **Inclusion**: $\mathbb{Z} \hookrightarrow \mathbb{Q}$ — monomorphism.
> - **Frobenius**: Trong ring characteristic $p > 0$, $\varphi(x) = x^p$ là ring homomorphism (sẽ gặp lại ở Bài 08).
> - **Evaluation**: $\operatorname{ev}_c : R[x] \to R$, $f \mapsto f(c)$ — epimorphism với kernel $(x - c)$.

> [!definition] Definition 1.11 — Kernel và Image
> Cho $\varphi : R \to S$ là ring homomorphism:
>
> $$
> \ker \varphi = \{r \in R \mid \varphi(r) = 0\}, \qquad \operatorname{Im} \varphi = \{\varphi(r) \mid r \in R\}
> $$

---

## Ideal

### Định nghĩa

> [!definition] Definition 1.12 — Ideal
> Cho $R$ là ring. Một tập con $I \subseteq R$ được gọi là:
>
> - **Left ideal** (ideal trái): $(I, +)$ là nhóm con của $(R, +)$ và $r \cdot a \in I$ với mọi $r \in R$, $a \in I$.
> - **Right ideal** (ideal phải): $(I, +)$ là nhóm con và $a \cdot r \in I$ với mọi $r \in R$, $a \in I$.
> - **Two-sided ideal** (ideal hai phía), viết $I \trianglelefteq R$: vừa là left ideal vừa là right ideal.
>
> Trong ring giao hoán, ba khái niệm này trùng nhau — ta chỉ nói **ideal**.

> [!note] Remark 1.13 — So sánh với Normal Subgroup
> Ideal đóng vai trò trong ring theory như normal subgroup đóng vai trò trong group theory: chúng là "kernel" của các homomorphism và cho phép ta xây dựng quotient.
>
> Cụ thể: $I \trianglelefteq R \iff I = \ker \varphi$ với $\varphi$ là ring homomorphism nào đó từ $R$.

### Ideal sinh bởi một tập

> [!definition] Definition 1.14 — Generated Ideal
> Ideal sinh bởi tập $S \subseteq R$ là ideal nhỏ nhất chứa $S$:
>
> $$
> (S) = \bigcap \{I \trianglelefteq R \mid S \subseteq I\}
> $$
>
> Trong ring giao hoán:
> - **Principal ideal** (ideal chính): $(a) = aR = \{ar \mid r \in R\}$.
> - **Finitely generated**: $(a_1, \ldots, a_n) = a_1 R + \cdots + a_n R$.

> [!example] Example 1.15 — Ideals trong $\mathbb{Z}$
> Mọi ideal của $\mathbb{Z}$ đều có dạng $(n) = n\mathbb{Z} = \{\ldots, -2n, -n, 0, n, 2n, \ldots\}$ với $n \geq 0$.
>
> Thật vậy: nếu $I \trianglelefteq \mathbb{Z}$, lấy $n = \min\{|a| \mid a \in I, a \neq 0\}$. Với mọi $m \in I$, chia Euclid: $m = nq + r$, $0 \leq r < n$. Vì $r = m - nq \in I$ và $r < n$, phải có $r = 0$. Vậy $n \mid m$, tức $I = n\mathbb{Z}$.
>
> $\mathbb{Z}$ là **principal ideal domain (PID)**.

### Phép toán trên Ideals

> [!definition] Definition 1.16 — Tổng, Tích, Giao của Ideals
> Cho $I, J \trianglelefteq R$:
>
> - **Tổng**: $I + J = \{a + b \mid a \in I, b \in J\}$ — ideal nhỏ nhất chứa $I$ và $J$.
> - **Giao**: $I \cap J$ — là ideal.
> - **Tích**: $IJ = \left\{\sum_{k=1}^n a_k b_k \mid a_k \in I, b_k \in J, n \geq 1\right\}$ — là ideal, và $IJ \subseteq I \cap J$.

> [!example] Example 1.17 — Tích ideal trong $\mathbb{Z}$
> $(m)(n) = (mn)$, $(m) + (n) = (\gcd(m,n))$, $(m) \cap (n) = (\operatorname{lcm}(m,n))$.
>
> Ví dụ: $(6) + (10) = (2)$, $(6)(10) = (60)$, $(6) \cap (10) = (30)$.

---

## Quotient Ring và Định lý Đẳng cấu

### Quotient Ring

> [!theorem] Theorem 1.18 — Quotient Ring (Vành Thương)
> Cho $I \trianglelefteq R$. Tập thương $R/I = \{a + I \mid a \in R\}$ với các phép toán:
>
> $$
> (a + I) + (b + I) = (a + b) + I, \qquad (a + I)(b + I) = ab + I
> $$
>
> tạo thành một ring, gọi là **quotient ring** (vành thương) của $R$ theo $I$.

**Proof.**
Phép cộng well-defined và $(R/I, +)$ là nhóm Abel vì $I \trianglelefteq (R, +)$. Cần kiểm tra phép nhân well-defined: nếu $a + I = a' + I$ và $b + I = b' + I$, tức $a - a' \in I$ và $b - b' \in I$, thì:

$$
ab - a'b' = ab - a'b + a'b - a'b' = (a-a')b + a'(b-b') \in I
$$

vì $I$ là ideal hai phía. Tính phân phối và kết hợp kế thừa từ $R$. Đơn vị nhân là $1 + I$. $\blacksquare$

> [!example] Example 1.19 — Quotient rings quen thuộc
> - $\mathbb{Z}/(n) \cong \mathbb{Z}/n\mathbb{Z}$: ring số nguyên modulo $n$.
> - $\mathbb{R}[x]/(x^2 + 1) \cong \mathbb{C}$: phức số! Phần tử $x + (x^2+1)$ đóng vai trò là $i$.
> - $\mathbb{Z}[x]/(x^2 + 1) \cong \mathbb{Z}[i]$: Gaussian integers.

### Các Định lý Đẳng cấu

> [!theorem] Theorem 1.20 — First Isomorphism Theorem
> Cho $\varphi : R \to S$ là ring homomorphism. Khi đó:
>
> 1. $\ker \varphi \trianglelefteq R$.
> 2. $\operatorname{Im} \varphi$ là subring của $S$.
> 3. $R / \ker \varphi \cong \operatorname{Im} \varphi$ qua đẳng cấu $\bar{\varphi}(a + \ker\varphi) = \varphi(a)$.

**Proof.**
(1) $\ker\varphi$ là nhóm con của $(R,+)$ vì $\varphi$ là group homomorphism. Nếu $a \in \ker\varphi$ và $r \in R$: $\varphi(ra) = \varphi(r)\varphi(a) = \varphi(r) \cdot 0 = 0$, nên $ra \in \ker\varphi$. Tương tự $ar \in \ker\varphi$.

(3) Đặt $I = \ker\varphi$. Map $\bar{\varphi} : R/I \to \operatorname{Im}\varphi$, $a + I \mapsto \varphi(a)$ là well-defined (vì $a - a' \in I \Rightarrow \varphi(a) = \varphi(a')$), là ring homomorphism, là đơn ánh ($\bar\varphi(a+I)=0 \Rightarrow \varphi(a)=0 \Rightarrow a \in I$), và toàn ánh lên $\operatorname{Im}\varphi$. $\blacksquare$

> [!theorem] Theorem 1.21 — Second Isomorphism Theorem
> Cho $I, J \trianglelefteq R$ với $I \subseteq J$. Khi đó $J/I \trianglelefteq R/I$ và:
>
> $$
> (R/I) \big/ (J/I) \cong R/J
> $$

> [!theorem] Theorem 1.22 — Third Isomorphism Theorem
> Cho $A$ là subring của $R$ và $I \trianglelefteq R$. Khi đó $A + I$ là subring, $A \cap I \trianglelefteq A$, và:
>
> $$
> A / (A \cap I) \cong (A + I) / I
> $$

### Correspondence Theorem

> [!theorem] Theorem 1.23 — Correspondence Theorem (Lattice Isomorphism Theorem)
> Cho $I \trianglelefteq R$ và $\pi : R \to R/I$ là projection tự nhiên. Có một song ánh bảo toàn thứ tự:
>
> $$
> \left\{ J \trianglelefteq R \mid I \subseteq J \right\} \longleftrightarrow \left\{ \bar{J} \trianglelefteq R/I \right\}
> $$
>
> cho bởi $J \mapsto J/I = \pi(J)$ và $\bar{J} \mapsto \pi^{-1}(\bar{J})$. Song ánh này bảo toàn tính chứa nhau, tổng, giao, và tích của ideals.

> [!example] Example 1.24 — Correspondence Theorem trong $\mathbb{Z}$
> Xét $I = (6) \trianglelefteq \mathbb{Z}$. Các ideals của $\mathbb{Z}$ chứa $(6)$ là các $(d)$ với $d \mid 6$:
>
> $$
> (1) \supset (2) \supset (6), \quad (1) \supset (3) \supset (6)
> $$
>
> Tương ứng, các ideals của $\mathbb{Z}/6\mathbb{Z}$ là: $\{0\}$, $(\bar{2}) = \{0,2,4\}$, $(\bar{3}) = \{0,3\}$, và $\mathbb{Z}/6\mathbb{Z}$ — đúng bốn ideals, bảo toàn cấu trúc lattice.

---

## Prime Ideals và Maximal Ideals

> [!definition] Definition 1.25 — Prime Ideal và Maximal Ideal
> Cho $R$ là commutative ring và $P, \mathfrak{m} \trianglelefteq R$ với $P, \mathfrak{m} \neq R$.
>
> - $P$ là **prime ideal** nếu: $ab \in P \Rightarrow a \in P$ hoặc $b \in P$.
> - $\mathfrak{m}$ là **maximal ideal** nếu không có ideal $I$ nào với $\mathfrak{m} \subsetneq I \subsetneq R$.

> [!theorem] Theorem 1.26 — Đặc trưng qua Quotient Ring
> Cho $R$ commutative và $I \trianglelefteq R$, $I \neq R$:
>
> - $I$ là prime ideal $\iff$ $R/I$ là integral domain.
> - $I$ là maximal ideal $\iff$ $R/I$ là field.
> - Mọi maximal ideal đều là prime ideal.

**Proof.**
($I$ prime $\iff$ $R/I$ integral domain): $ab \in I \iff (a+I)(b+I) = 0+I$ trong $R/I$. Vậy $I$ prime $\iff$ $R/I$ không có zero divisor $\iff$ $R/I$ là integral domain.

($I$ maximal $\iff$ $R/I$ field): Dùng Correspondence Theorem — $I$ maximal $\iff$ không có ideal nào nằm giữa $I$ và $R$ $\iff$ $R/I$ không có ideal nontrivial nào $\iff$ $R/I$ là field (một ring giao hoán là field khi và chỉ khi ideals của nó chỉ là $\{0\}$ và chính nó). $\blacksquare$

> [!example] Example 1.27 — Prime và Maximal ideals trong $\mathbb{Z}$
> - $(0) = \{0\}$: prime ($\mathbb{Z}/(0) \cong \mathbb{Z}$ là integral domain), nhưng **không** maximal.
> - $(p)$ với $p$ nguyên tố: prime và maximal ($\mathbb{Z}/(p) \cong \mathbb{F}_p$ là field).
> - $(n)$ với $n$ hợp số: **không** prime (ví dụ $(4)$: $2 \cdot 2 = 4 \in (4)$ nhưng $2 \notin (4)$).

---

## SageMath Cheatsheet

```python
R = ZZ.quotient(6)
print(R)
print(R(2) * R(3))

S = QQ['x']
x = S.gen()
T = S.quotient(x^2 + 1)
print(T)
i = T.gen()
print(i^2)

R = ZZ[I]
print(R)

R = ZZ
I = R.ideal(5)
print(I.is_prime())
print(I.is_maximal())

J = R.ideal(6)
print(J.is_prime())

S.<x> = QQ[]
I = S.ideal(x^2 - 2)
Q = S.quotient(I)
sqrt2 = Q.gen()
print(sqrt2^2)
```

---

## Summary / Key Takeaways

- Ring $(R, +, \cdot)$: $(R,+)$ là nhóm Abel, nhân kết hợp, phân phối — không nhất thiết giao hoán hay có đơn vị nhân (nhưng ta luôn giả sử có $1 \neq 0$).
- **Ideal** $I \trianglelefteq R$: đóng với cộng và hấp thụ nhân từ $R$ — vai trò như normal subgroup.
- **Quotient ring** $R/I$: well-defined khi và chỉ khi $I$ là ideal hai phía.
- **First Isomorphism Theorem**: $R/\ker\varphi \cong \operatorname{Im}\varphi$ — cầu nối giữa surjective homorphisms và quotient rings.
- **Correspondence Theorem**: ideals của $R/I$ ↔ ideals của $R$ chứa $I$ — công cụ để phân tích cấu trúc quotient.
- **Prime ideal** $P$: $R/P$ là integral domain — đặc trưng "không có zero divisor".
- **Maximal ideal** $\mathfrak{m}$: $R/\mathfrak{m}$ là field — mọi maximal ideal đều là prime.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 7.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter II.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 1.
- https://doc.sagemath.org/html/en/reference/rings/
