---
title: "05. Noetherian Rings and Hilbert Basis Theorem"
tags: [math, commutative-algebra, lesson-05]
aliases: [Noetherian Rings and Hilbert Basis Theorem]
created: 2026-03-29
---

> **Prerequisites**: [[01-rings-ideals-homomorphisms|01. Rings, Ideals, and Homomorphisms]], [[02-modules|02. Modules]]
> **Objectives**:
> - Nắm định nghĩa và các đặc trưng tương đương của Noetherian ring/module
> - Chứng minh và áp dụng Hilbert Basis Theorem
> - Hiểu primary ideals và chuẩn bị cho Primary Decomposition (Bài 06)
> - Nhận diện tại sao Noetherian là giả thiết chuẩn trong Commutative Algebra

---

## Motivation / Intuition

Trong lý thuyết số cổ điển, $\mathbb{Z}$ có tính chất đẹp: mọi ideal đều là ideal chính, tức $(n) = n\mathbb{Z}$. Điều này dẫn đến thuật toán Euclid và phép phân tích nhân tử duy nhất. Nhưng khi chuyển sang vành tổng quát hơn — như $\mathbb{Z}[\sqrt{-5}]$ — tính chất này có thể mất đi.

Điều kiện **Noetherian** là một sự thỏa hiệp tinh tế: ta không yêu cầu mọi ideal đều là chính (quá mạnh), mà chỉ yêu cầu mọi dãy tăng của ideals phải dừng lại (ascending chain condition). Điều này đủ để đảm bảo:

- Mọi ideal đều *hữu hạn sinh* (có thể không chính).
- Phép phân tích *primary decomposition* tồn tại (Bài 06).
- Nhiều thuật toán tính toán tắt ở hữu hạn bước.

**Hilbert** (1890) đã gây chấn động cộng đồng toán học khi chứng minh rằng $k[x_1, \ldots, x_n]$ Noetherian — một kết quả thuần túy tồn tại, không constructive — phá vỡ quan niệm rằng mọi chứng minh phải tường minh. Gordan, người phản biện, ban đầu phản đối: *"This is not mathematics, but theology."* Nhưng phương pháp của Hilbert đã trở thành nền tảng của đại số hiện đại.

---

## Chain Conditions

### Definition

> [!info] Definition 5.1 — Ascending Chain Condition (ACC)
>
> Một $R$-module $M$ thỏa **ascending chain condition** (ACC) nếu mọi dãy tăng của submodules:
>
> $$
> N_1 \subseteq N_2 \subseteq N_3 \subseteq \cdots
> $$
>
> đều dừng lại (stationary): tồn tại $n_0$ sao cho $N_n = N_{n_0}$ với mọi $n \geq n_0$.

> [!info] Definition 5.2 — Noetherian Module và Noetherian Ring
>
> - $M$ là **Noetherian module** nếu $M$ thỏa ACC.
> - $R$ là **Noetherian ring** nếu $R$ là Noetherian như $R$-module (tức mọi dãy tăng của ideals dừng lại).

### Theorem

> [!abstract] Theorem 5.3 — Các đặc trưng tương đương của Noetherian module
>
> Cho $M$ là $R$-module. Các điều sau tương đương:
>
> 1. $M$ thỏa ACC (Noetherian).
> 2. Mọi submodule của $M$ đều hữu hạn sinh.
> 3. Mọi tập con không rỗng của submodules của $M$ có phần tử cực đại (theo bao hàm).

**Proof.**

$(1) \Rightarrow (2)$: Cho $N \subseteq M$ là submodule. Nếu $N$ không hữu hạn sinh, xây dựng dãy tăng thực sự: chọn $n_1 \in N$, sau đó $n_2 \in N \setminus Rn_1$, rồi $n_3 \in N \setminus (Rn_1 + Rn_2)$, ... Khi đó $Rn_1 \subsetneq Rn_1 + Rn_2 \subsetneq \cdots$ không dừng — mâu thuẫn với ACC.

$(2) \Rightarrow (3)$: Cho $\mathcal{F}$ là tập con không rỗng. Lấy $N_1 \in \mathcal{F}$; nếu $N_1$ chưa cực đại, lấy $N_2 \supsetneq N_1$; tiếp tục. Vì mọi $N_i$ hữu hạn sinh và dãy tăng, sau hữu hạn bước (do $(1)$, mà $(2) \Rightarrow (1)$ bên dưới) phải dừng.

$(3) \Rightarrow (1)$: Với dãy tăng $N_1 \subseteq N_2 \subseteq \cdots$, tập $\{N_i\}$ có phần tử cực đại $N_{n_0}$, tức $N_n = N_{n_0}$ với mọi $n \geq n_0$. $\blacksquare$

### Worked Example

> [!example] Example 5.4 — Noetherian và không Noetherian
>
> **Noetherian:**
> - $\mathbb{Z}$: mọi ideal là $(n)$, trivially hữu hạn sinh.
> - Mọi trường $k$: chỉ có hai ideal $\{0\}$ và $k$.
> - $k[x_1, \ldots, x_n]$: Noetherian theo Hilbert Basis Theorem (Theorem 5.7).
> - $\mathbb{Z}/n\mathbb{Z}$: hữu hạn, nên Noetherian.
>
> **Không Noetherian:**
> - $k[x_1, x_2, x_3, \ldots]$ (đa thức vô hạn biến số): dãy $(x_1) \subsetneq (x_1, x_2) \subsetneq (x_1, x_2, x_3) \subsetneq \cdots$ không dừng.
> - $\mathcal{C}^\infty(\mathbb{R})$ (hàm vô hạn khả vi): không Noetherian.

---

## Noetherian Rings: Tính chất cơ bản

### Theorem

> [!abstract] Theorem 5.5 — Tính ổn định của Noetherian
>
> 1. Quotient: Nếu $R$ Noetherian và $\mathfrak{a} \subseteq R$ là ideal, thì $R/\mathfrak{a}$ Noetherian.
> 2. Localization: Nếu $R$ Noetherian và $S$ là tập nhân, thì $S^{-1}R$ Noetherian.
> 3. Short exact sequence: Nếu $0 \to M' \to M \to M'' \to 0$ exact và $M'$, $M''$ Noetherian thì $M$ Noetherian.
> 4. Hữu hạn sinh: Nếu $R$ Noetherian và $M$ là $R$-module hữu hạn sinh, thì $M$ Noetherian.

**Proof của (1).** Các submodules của $R/\mathfrak{a}$ tương ứng 1-1 với ideals của $R$ chứa $\mathfrak{a}$. Dãy tăng của ideals trong $R/\mathfrak{a}$ kéo theo dãy tăng trong $R$, phải dừng vì $R$ Noetherian.

**Proof của (3).** Cho dãy $N_1 \subseteq N_2 \subseteq \cdots$ submodules của $M$. Dãy $N_i \cap M'$ trong $M'$ và ảnh $N_i$ trong $M''$ đều dừng tại một $n_0$. Với $n \geq n_0$: $N_n \cap M' = N_{n_0} \cap M'$ và $N_n \twoheadrightarrow N_{n_0}$-image trong $M''$. Dùng snake lemma: $N_n = N_{n_0}$. $\blacksquare$

---

## Hilbert Basis Theorem

### Theorem

> [!abstract] Theorem 5.6 — Hilbert Basis Theorem
>
> Nếu $R$ là Noetherian ring, thì $R[x]$ cũng là Noetherian ring.
>
> **Hệ quả**: $R[x_1, \ldots, x_n]$ Noetherian với mọi $n \geq 0$. Đặc biệt, $k[x_1, \ldots, x_n]$ Noetherian với mọi trường $k$.

Xem chứng minh đầy đủ tại [[a0-hilbert-basis-theorem|A0. Proof of Hilbert Basis Theorem]].

**Phác thảo chứng minh.** Cho $I \subseteq R[x]$ là ideal. Xây dựng ideal $L_n \subseteq R$ gồm các hệ số đầu (leading coefficients) của đa thức bậc $\leq n$ trong $I$:

$$
L_n = \{a \in R : \exists\, f \in I,\, \deg f = n,\, \text{leading coeff}(f) = a\} \cup \{0\}
$$

Thì $L_0 \subseteq L_1 \subseteq L_2 \subseteq \cdots$ là dãy tăng của ideals trong $R$, nên dừng tại $L_{n_0}$. Từ đó xây dựng hữu hạn sinh của $I$. $\blacksquare$

> [!example] Example 5.7 — Ứng dụng Hilbert Basis Theorem
>
> Mọi ideal $I \subseteq \mathbb{Q}[x, y, z]$ đều hữu hạn sinh. Ví dụ:
>
> $$
> I = (x^2 - y,\; y^2 - z,\; z^2 - x)
> $$
>
> Tập nghiệm của $I$ trong $\mathbb{A}^3$ là tập đại số (algebraic set) — Hilbert Basis Theorem đảm bảo mọi tập đại số được xác định bởi hữu hạn phương trình.

> [!note] Remark 5.8 — Chuỗi hình thức
>
> Chú ý: $R[[x]]$ (formal power series) cũng Noetherian khi $R$ Noetherian, nhưng chứng minh khác (dùng $\mathfrak{m}$-adic completion). Tuy nhiên, $R[x_1, x_2, \ldots]$ (đa thức vô hạn biến) **không** Noetherian ngay cả khi $R$ là trường.

---

## Primary Ideals

### Definition

> [!info] Definition 5.9 — Primary Ideal
>
> Ideal $\mathfrak{q} \subsetneq R$ gọi là **primary** (sơ cấp) nếu:
>
> $$
> ab \in \mathfrak{q} \implies a \in \mathfrak{q} \;\text{ hoặc }\; b^n \in \mathfrak{q} \text{ với một số } n \geq 1
> $$
>
> Tương đương: $R/\mathfrak{q} \neq 0$ và mọi zero divisor của $R/\mathfrak{q}$ đều nilpotent.
>
> Nếu $\mathfrak{q}$ là primary và $\sqrt{\mathfrak{q}} = \mathfrak{p}$, ta nói $\mathfrak{q}$ là **$\mathfrak{p}$-primary**.

> [!abstract] Theorem 5.10 — Radical của primary ideal là prime
>
> Nếu $\mathfrak{q}$ là primary, thì $\sqrt{\mathfrak{q}}$ là prime ideal. Cụ thể, $\sqrt{\mathfrak{q}}$ là prime ideal nhỏ nhất chứa $\mathfrak{q}$.

**Proof.** Giả sử $ab \in \sqrt{\mathfrak{q}}$, tức $(ab)^n \in \mathfrak{q}$ với một $n$. Suy ra $a^n b^n \in \mathfrak{q}$. Vì $\mathfrak{q}$ primary: hoặc $a^n \in \mathfrak{q}$ (tức $a \in \sqrt{\mathfrak{q}}$), hoặc $(b^n)^m \in \mathfrak{q}$ với một $m$ (tức $b \in \sqrt{\mathfrak{q}}$). Vậy $\sqrt{\mathfrak{q}}$ prime. $\blacksquare$

### Worked Example

> [!example] Example 5.11 — Primary ideals trong $\mathbb{Z}$ và $k[x,y]$
>
> **Trong $\mathbb{Z}$:** $(p^n)$ là $(p)$-primary với $p$ nguyên tố và $n \geq 1$. Thật vậy, $ab \in (p^n)$ tức $p^n \mid ab$; nếu $p \nmid a$ thì $p^n \mid b$, tức $b^1 \in (p^n)$. Radical: $\sqrt{(p^n)} = (p)$.
>
> **Trong $k[x,y]$:** Ideal $(x^2, y)$ là primary. Ta có $\sqrt{(x^2, y)} = (x, y)$ (maximal ideal). Kiểm tra: nếu $fg \in (x^2, y)$ thì trong $k[x,y]/(y) \cong k[x]$, ta có $\bar{f}\bar{g} \in (x^2)$. Đây là primary trong $k[x]$ (vì $(x^2)$ primary với $\sqrt{(x^2)} = (x)$), nên $\bar{f} \in (x)$ hoặc $\bar{g} \in (x^2)$,...

> [!warning] Counterexample 5.12 — Primary $\neq$ prime power
>
> Trong $R = k[x, y, z]/(xy - z^2)$, đặt $\bar{x}, \bar{y}, \bar{z}$ là ảnh của $x, y, z$. Ideal $(\bar{x}, \bar{z})$ là prime (vì $R/(\bar{x}, \bar{z}) \cong k[y]$ là miền nguyên) nhưng $(\bar{x}, \bar{z})^2$ **không primary**: $\bar{x}\bar{y} = \bar{z}^2 \in (\bar{x}, \bar{z})^2$ nhưng $\bar{x} \notin (\bar{x}, \bar{z})^2$ và không có lũy thừa nào của $\bar{y}$ thuộc $(\bar{x}, \bar{z})^2$.
>
> Đây cho thấy lũy thừa của prime ideal không nhất thiết primary — một lý do primary decomposition phức tạp hơn phân tích nhân tử thông thường.

### Lemma

> [!abstract] Lemma 5.13 — Giao hữu hạn của $\mathfrak{p}$-primary ideals là $\mathfrak{p}$-primary
>
> Nếu $\mathfrak{q}_1, \ldots, \mathfrak{q}_n$ đều là $\mathfrak{p}$-primary, thì $\mathfrak{q} = \mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n$ cũng là $\mathfrak{p}$-primary.

**Proof.** Trước tiên, $\sqrt{\mathfrak{q}} = \sqrt{\mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n} = \bigcap \sqrt{\mathfrak{q}_i} = \mathfrak{p}$. Tiếp theo, nếu $ab \in \mathfrak{q}$ và $a \notin \mathfrak{q}$, thì tồn tại $i$ với $a \notin \mathfrak{q}_i$. Vì $ab \in \mathfrak{q}_i$ và $\mathfrak{q}_i$ là $\mathfrak{p}$-primary: $b \in \sqrt{\mathfrak{q}_i} = \mathfrak{p} = \sqrt{\mathfrak{q}}$. $\blacksquare$

---

## SageMath Cheatsheet

```sage
R.<x,y,z> = QQ[]

I = R.ideal(x^2, y)
I.is_primary()
I.radical()

J = R.ideal(x*y - z^2)
R_quot = R.quotient(J)
R_quot.is_noetherian()

I2 = R.ideal(x^2, x*y, y^2)
I2.primary_decomposition()

R_poly = ZZ['x']
I3 = R_poly.ideal(6, 2*x + 4)
I3.is_primary()
I3.radical()

I4 = R.ideal(x^3, y^2, x*y)
I4.primary_decomposition()
```

---

## Summary / Key Takeaways

- **Noetherian module**: thỏa ACC $\iff$ mọi submodule hữu hạn sinh $\iff$ mọi tập submodules có phần tử cực đại.
- **Noetherian ring**: mọi ideal hữu hạn sinh; bền vững qua quotient, localization, finite extensions.
- **Hilbert Basis Theorem**: $R$ Noetherian $\Rightarrow$ $R[x]$ Noetherian $\Rightarrow$ $k[x_1,\ldots,x_n]$ Noetherian.
- **Primary ideal** $\mathfrak{q}$: $ab \in \mathfrak{q} \Rightarrow a \in \mathfrak{q}$ hoặc $b^n \in \mathfrak{q}$; tổng quát hóa prime ideal.
- $\sqrt{\mathfrak{q}}$ luôn là prime khi $\mathfrak{q}$ primary; $\mathfrak{q}$ được gọi là $\mathfrak{p}$-primary khi $\sqrt{\mathfrak{q}} = \mathfrak{p}$.
- Giao hữu hạn của $\mathfrak{p}$-primary ideals là $\mathfrak{p}$-primary.
- Lũy thừa prime ideal **không nhất thiết** primary — động lực cho Primary Decomposition (Bài 06).

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapters 6–7.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapters 1, 3.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 16–18.
- Cox, D., Little, J. & O'Shea, D. *Ideals, Varieties, and Algorithms*, Chapter 2 (Hilbert Basis Theorem).
