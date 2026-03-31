---
title: "13. Homological Methods: Tor and Ext"
tags: [math, commutative-algebra, lesson-13]
aliases: [Homological Methods: Tor and Ext]
created: 2026-03-30
---

> **Prerequisites**: [[03-tensor-product-and-hom|03. Tensor Product and Hom]], [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]]
> **Objectives**:
> - Hiểu projective, injective, và flat resolutions
> - Tính $\operatorname{Tor}$ và $\operatorname{Ext}$ qua resolutions
> - Nắm long exact sequences và ứng dụng
> - Hiểu projective dimension và global dimension

---

## Motivation / Intuition

Ở Bài 03, ta thấy $\otimes$ right-exact nhưng không left-exact, và $\operatorname{Hom}$ left-exact nhưng không right-exact. Câu hỏi tự nhiên: **sai lệch so với exactness được đo như thế nào?**

Câu trả lời là **homological algebra**: thay vì tính trực tiếp $M \otimes N$ hay $\operatorname{Hom}(M,N)$, ta xây dựng **resolution** (phân giải) của $M$ — biểu diễn $M$ qua dãy exact của "modules đơn giản hơn" (free hay projective) — rồi áp dụng $\otimes$ hay $\operatorname{Hom}$ lên resolution đó.

Kết quả là các **derived functors**: $\operatorname{Tor}_i(M,N)$ và $\operatorname{Ext}^i(M,N)$. Chúng đo "mức độ không exact" và mang thông tin sâu về cấu trúc của modules:

- $\operatorname{Tor}_1(M, N) = 0$ với mọi $N$ $\iff$ $M$ là flat.
- $\operatorname{Ext}^1(M, N)$ phân loại các extensions của $N$ bởi $M$.
- $\operatorname{Ext}^i(M, k) = 0$ với $i > d$ $\iff$ projective dimension của $M$ là $\leq d$.

Homological algebra là ngôn ngữ của đại số và hình học đại số hiện đại — từ coherent sheaves đến K-theory.

---

## Projective và Flat Modules

### Definition

> [!info] Definition 13.1 — Projective Module
>
> $R$-module $P$ gọi là **projective** nếu với mọi surjection $f: M \twoheadrightarrow N$ và homomorphism $g: P \to N$, tồn tại $h: P \to M$ sao cho $f \circ h = g$:
>
> $$
> \begin{array}{ccc}
> & & P \\
> & \swarrow^h & \downarrow^g \\
> M & \xrightarrow{f} & N \to 0
> \end{array}
> $$
>
> Tương đương: $\operatorname{Hom}_R(P, -)$ là exact functor.

> [!abstract] Theorem 13.2 — Đặc trưng của Projective Modules
>
> Các điều sau tương đương cho $R$-module $P$:
>
> 1. $P$ là projective.
> 2. $P$ là direct summand của một free module: tồn tại $Q$ sao cho $P \oplus Q$ là free.
> 3. Mọi short exact sequence $0 \to M' \to M \to P \to 0$ splits.

**Proof của $(1) \Leftrightarrow (3)$.** Dãy $0 \to M' \to M \to P \to 0$ splits $\iff$ ánh xạ $M \to P$ có section $s: P \to M$ $\iff$ $\operatorname{id}_P: P \to P$ nâng được lên $M$ $\iff$ $P$ projective. $\blacksquare$

> [!note] Remark 13.3 — Hệ cấp bậc của modules
>
> $$
> \text{Free} \Rightarrow \text{Projective} \Rightarrow \text{Flat}
> $$
>
> Chiều ngược lại không đúng nói chung. Tuy nhiên: với local Noetherian ring, flat $\Rightarrow$ free (cho finitely generated modules, theo Nakayama + local criterion for flatness).

---

## Resolutions và Derived Functors

### Definition

> [!info] Definition 13.4 — Projective Resolution
>
> **Projective resolution** của $R$-module $M$ là dãy exact:
>
> $$
> \cdots \to P_2 \xrightarrow{d_2} P_1 \xrightarrow{d_1} P_0 \xrightarrow{\varepsilon} M \to 0
> $$
>
> với mỗi $P_i$ projective. Mọi module đều có projective resolution (lấy $P_0 \twoheadrightarrow M$ free, sau đó $P_1 \twoheadrightarrow \ker(P_0 \to M)$, ...).

### Definition

> [!info] Definition 13.5 — $\operatorname{Tor}$ và $\operatorname{Ext}$
>
> Cho projective resolution $P_\bullet \to M \to 0$ của $M$:
>
> **$\operatorname{Tor}$**: Áp dụng $- \otimes_R N$ lên $P_\bullet$ (bỏ $M$):
>
> $$
> \cdots \to P_2 \otimes N \to P_1 \otimes N \to P_0 \otimes N \to 0
> $$
>
> $$
> \operatorname{Tor}_i^R(M, N) = H_i(P_\bullet \otimes N) = \ker(d_i \otimes \operatorname{id}) / \operatorname{Im}(d_{i+1} \otimes \operatorname{id})
> $$
>
> **$\operatorname{Ext}$**: Áp dụng $\operatorname{Hom}_R(-, N)$ lên $P_\bullet$ (bỏ $M$, đảo chiều):
>
> $$
> 0 \to \operatorname{Hom}(P_0, N) \to \operatorname{Hom}(P_1, N) \to \operatorname{Hom}(P_2, N) \to \cdots
> $$
>
> $$
> \operatorname{Ext}^i_R(M, N) = H^i(\operatorname{Hom}(P_\bullet, N))
> $$

> [!note] Remark 13.6 — Independence of Resolution
>
> $\operatorname{Tor}_i(M,N)$ và $\operatorname{Ext}^i(M,N)$ không phụ thuộc vào việc chọn resolution nào của $M$ (hoặc của $N$) — đây là định lý cơ bản, được chứng minh qua comparison theorem của resolutions.

### Worked Example

> [!example] Example 13.7 — Tính $\operatorname{Tor}$ và $\operatorname{Ext}$ cho $\mathbb{Z}/n$
>
> Projective resolution của $\mathbb{Z}/n$ như $\mathbb{Z}$-module:
>
> $$
> 0 \to \mathbb{Z} \xrightarrow{\times n} \mathbb{Z} \xrightarrow{\pi} \mathbb{Z}/n \to 0
> $$
>
> **Tính $\operatorname{Tor}_i^\mathbb{Z}(\mathbb{Z}/n, \mathbb{Z}/m)$:** Áp $- \otimes \mathbb{Z}/m$:
>
> $$
> 0 \to \mathbb{Z}/m \xrightarrow{\times n} \mathbb{Z}/m \to 0
> $$
>
> - $\operatorname{Tor}_0 = \mathbb{Z}/m / n(\mathbb{Z}/m) = \mathbb{Z}/\gcd(m,n)$.
> - $\operatorname{Tor}_1 = \ker(\mathbb{Z}/m \xrightarrow{\times n}) = \{x \in \mathbb{Z}/m : nx = 0\} = \mathbb{Z}/\gcd(m,n)$.
> - $\operatorname{Tor}_i = 0$ với $i \geq 2$ (resolution dừng ở $P_1$).
>
> **Tính $\operatorname{Ext}^i_\mathbb{Z}(\mathbb{Z}/n, \mathbb{Z}/m)$:** Áp $\operatorname{Hom}(-, \mathbb{Z}/m)$:
>
> $$
> 0 \to \operatorname{Hom}(\mathbb{Z}/m) \xrightarrow{\times n} \operatorname{Hom}(\mathbb{Z}/m) \to 0
> $$
>
> Ta có $\operatorname{Hom}(\mathbb{Z}, \mathbb{Z}/m) \cong \mathbb{Z}/m$. Vậy:
>
> - $\operatorname{Ext}^0 = \operatorname{Hom}(\mathbb{Z}/n, \mathbb{Z}/m) = \mathbb{Z}/\gcd(m,n)$.
> - $\operatorname{Ext}^1 = \operatorname{coker}(\mathbb{Z}/m \xrightarrow{\times n} \mathbb{Z}/m) = \mathbb{Z}/\gcd(m,n)$.
> - $\operatorname{Ext}^i = 0$ với $i \geq 2$.

---

## Long Exact Sequences

### Theorem

> [!abstract] Theorem 13.8 — Long Exact Sequences cho Tor và Ext
>
> Cho $0 \to M' \to M \to M'' \to 0$ là short exact sequence. Khi đó tồn tại long exact sequences:
>
> $$
> \cdots \to \operatorname{Tor}_1(M'', N) \to \operatorname{Tor}_0(M', N) \to \operatorname{Tor}_0(M, N) \to \operatorname{Tor}_0(M'', N) \to 0
> $$
>
> $$
> 0 \to \operatorname{Hom}(M'', N) \to \operatorname{Hom}(M, N) \to \operatorname{Hom}(M', N) \to \operatorname{Ext}^1(M'', N) \to \cdots
> $$

**Proof (phác thảo).** Lấy projective resolutions $P_\bullet' \to M'$ và $P_\bullet'' \to M''$. Xây dựng resolution $P_\bullet \to M$ như horseshoe: $P_n = P_n' \oplus P_n''$. Dãy exact $0 \to P_\bullet' \to P_\bullet \to P_\bullet'' \to 0$ sau khi áp $\otimes N$ hoặc $\operatorname{Hom}(-,N)$ cho short exact sequence của chain complexes; snake lemma cho long exact sequence. $\blacksquare$

---

## Projective Dimension và Global Dimension

### Definition

> [!info] Definition 13.9 — Projective Dimension
>
> **Projective dimension** của $M$:
>
> $$
> \operatorname{pd}(M) = \min\{n : \text{tồn tại projective resolution độ dài } n\}
> $$
>
> (tức $P_n$ projective, $P_{n+1} = 0, \ldots$)
>
> **Global dimension** của $R$:
>
> $$
> \operatorname{gl.dim}(R) = \sup_M \operatorname{pd}(M)
> $$

> [!abstract] Theorem 13.10 — Đặc trưng qua Tor và Ext
>
> 1. $\operatorname{pd}(M) \leq n$ $\iff$ $\operatorname{Tor}_i(M, N) = 0$ với mọi $N$ và $i > n$.
> 2. $\operatorname{pd}(M) \leq n$ $\iff$ $\operatorname{Ext}^i(M, N) = 0$ với mọi $N$ và $i > n$.
> 3. $M$ flat $\iff$ $\operatorname{Tor}_1(M, N) = 0$ với mọi $N$.
> 4. $M$ projective $\iff$ $\operatorname{Ext}^1(M, N) = 0$ với mọi $N$.

### Theorem

> [!abstract] Theorem 13.11 — Auslander-Buchsbaum Formula
>
> Cho $(R, \mathfrak{m})$ Noetherian local và $M$ hữu hạn sinh với $\operatorname{pd}(M) < \infty$. Khi đó:
>
> $$
> \operatorname{pd}(M) + \operatorname{depth}(M) = \operatorname{depth}(R)
> $$
>
> trong đó $\operatorname{depth}(M) = \min\{i : \operatorname{Ext}^i_R(R/\mathfrak{m}, M) \neq 0\}$.

**Ý nghĩa:** Depth + projective dimension = depth của ring. Đây là định lý liên hệ homological algebra với dimension theory, là nền tảng để định nghĩa Cohen–Macaulay rings (Bài 14).

> [!example] Example 13.12 — Serre's Characterization of Regular Local Rings
>
> Serre (1958) chứng minh: $(R, \mathfrak{m})$ là **regular local ring** $\iff$ $\operatorname{gl.dim}(R) < \infty$. Và trong trường hợp đó $\operatorname{gl.dim}(R) = \dim R$.
>
> Ví dụ: $k[[x_1,\ldots,x_n]]$ có $\operatorname{gl.dim} = n = \dim$. Còn $k[[x,y]]/(xy)$ có $\operatorname{gl.dim} = \infty$ (không regular — có kỳ dị tại gốc).

---

## SageMath Cheatsheet

```sage
R.<x,y,z> = QQ[]

M = R.quotient(R.ideal(x, y))
M.projective_dimension()

I = R.ideal(x^2, y^3)
R.quotient(I).projective_dimension()

from sage.modules.fp_graded.free_graded_module import FreeGradedModule
F = FreeGradedModule(R, degrees=(0,))

R2 = ZZ
M2 = R2.quotient(6)
M2.projective_dimension()

R3 = QQ['x']
I3 = R3.ideal((R3.gen() - 1)^3)
(R3.quotient(I3)).global_dimension()
```

---

## Summary / Key Takeaways

- **Projective module**: $\operatorname{Hom}(P,-)$ exact; tương đương direct summand of free; SES với $P$ splits.
- Thứ bậc: Free $\Rightarrow$ Projective $\Rightarrow$ Flat (với f.g. modules trên local ring: Flat = Free).
- **Projective resolution**: $\cdots \to P_1 \to P_0 \to M \to 0$ exact, mỗi $P_i$ projective.
- $\operatorname{Tor}_i(M,N)$: áp $\otimes N$ lên resolution của $M$; đo sai lệch left-exactness của $\otimes$.
- $\operatorname{Ext}^i(M,N)$: áp $\operatorname{Hom}(-,N)$ lên resolution của $M$; đo sai lệch right-exactness của $\operatorname{Hom}$.
- **Long exact sequences**: SES của modules $\to$ LES của Tor/Ext.
- $\operatorname{pd}(M)$: độ dài resolution ngắn nhất; $\operatorname{gl.dim}(R) = \sup_M \operatorname{pd}(M)$.
- **Auslander-Buchsbaum**: $\operatorname{pd}(M) + \operatorname{depth}(M) = \operatorname{depth}(R)$.
- **Serre**: $R$ regular local $\iff$ $\operatorname{gl.dim}(R) = \dim R < \infty$.

---

## References

- Weibel, C. *An Introduction to Homological Algebra*, Chapters 2–3.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapters 17–18.
- Matsumura, H. *Commutative Ring Theory*, Chapter 7.
- Rotman, J. J. *An Introduction to Homological Algebra*, Chapters 7–8.
