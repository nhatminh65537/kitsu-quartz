---
title: "13. Introduction to Homological Algebra"
tags: [math, algebra-foundations, lesson-13]
aliases: [Homological Algebra, Tor and Ext]
created: 2026-03-28
---

> **Prerequisites**: [[09-modules-definitions|09. Modules: Definitions and Basic Constructions]] — exact sequences. [[11-projective-injective-flat|11. Projective, Injective, and Flat Modules]] — projective, injective, flat. [[12-hom-and-tensor|12. Exact Functors and Hom/Tensor]] — left/right exactness, $\operatorname{Hom}_R$, $\otimes_R$.
> **Objectives**:
> - Xây dựng chain complexes và cohomology
> - Chứng minh Snake Lemma và Five Lemma
> - Định nghĩa projective/injective resolutions và derived functors
> - Tính toán $\operatorname{Tor}_n^R(M,N)$ và $\operatorname{Ext}_R^n(M,N)$
> - Hiểu long exact sequence trong homology

---

## Motivation / Intuition

Trong Bài 12, ta thấy $\operatorname{Hom}_R(M,-)$ và $-\otimes_R N$ không exact. Homological Algebra sinh ra để **đo** sự thất bại exactness này một cách hệ thống.

Ý tưởng then chốt: thay vì làm việc trực tiếp với module $M$, ta **resolve** $M$ bằng một chuỗi các modules "tốt" hơn (projective hoặc injective). Áp dụng functor vào resolution và lấy homology sẽ cho ra **derived functors** $\operatorname{Tor}$ và $\operatorname{Ext}$ — những bất biến quan trọng nhất của Commutative Algebra và Algebraic Topology.

Homological Algebra là ngôn ngữ chung của nhiều nhánh toán học hiện đại. Lý thuyết không gian topo dùng singular homology; Algebraic Geometry dùng sheaf cohomology; Number Theory dùng Galois cohomology — tất cả đều là các trường hợp đặc biệt của cùng một bộ máy categorical.

---

## Chain Complexes và Homology

> [!definition] Definition 13.1 — Chain Complex
> Một **chain complex** (phức dây chuyền) của $R$-modules là dãy:
>
> $$
> \cdots \to C_{n+1} \xrightarrow{d_{n+1}} C_n \xrightarrow{d_n} C_{n-1} \to \cdots
> $$
>
> với điều kiện $d_n \circ d_{n+1} = 0$ với mọi $n$ (tức $\operatorname{Im} d_{n+1} \subseteq \ker d_n$).
>
> Các $d_n$ gọi là **boundary maps** (ánh xạ biên). Ký hiệu complex: $(C_\bullet, d_\bullet)$ hay chỉ $C_\bullet$.

> [!definition] Definition 13.2 — Homology
> **Homology** (đồng điều) tại vị trí $n$ của $C_\bullet$ là:
>
> $$
> H_n(C_\bullet) = \ker d_n / \operatorname{Im} d_{n+1}
> $$
>
> - **Cycles** tại $n$: $Z_n = \ker d_n$.
> - **Boundaries** tại $n$: $B_n = \operatorname{Im} d_{n+1}$.
> - $H_n = Z_n / B_n$ đo "bao nhiêu cycles không phải boundaries".

> [!note] Remark 13.3 — Exact $\Leftrightarrow$ Homology trivial
> Complex $C_\bullet$ là **exact sequence** tại $n$ $\iff$ $H_n(C_\bullet) = 0$. Exact sequences là chain complexes với homology trivial — homology đo sự "thất bại exactness".

> [!example] Example 13.4 — Complex đơn giản
> Complex $0 \to \mathbb{Z} \xrightarrow{\times 6} \mathbb{Z} \xrightarrow{\pi} \mathbb{Z}/2\mathbb{Z} \to 0$ với $\pi(n) = n \mod 2$:
>
> - $H_0 = \mathbb{Z}/2\mathbb{Z} / \operatorname{Im}\pi = 0$ (vì $\pi$ toàn ánh).
> - $H_1 = \ker \pi / \operatorname{Im}(\times 6) = 2\mathbb{Z} / 6\mathbb{Z} \cong \mathbb{Z}/3\mathbb{Z}$.
> - $H_2 = \ker(\times 6) / 0 = 0$ (vì $\times 6$ đơn ánh).
>
> Homology $\mathbb{Z}/3\mathbb{Z}$ tại bậc $1$ phản ánh sự thất bại exactness.

---

## Snake Lemma

> [!theorem] Theorem 13.5 — Snake Lemma
> Cho diagram giao hoán với hàng exact:
>
> $$
> \begin{aligned}
> &A \xrightarrow{f} B \xrightarrow{g} C \to 0 \\
> &\downarrow^{\alpha} \quad \downarrow^{\beta} \quad \downarrow^{\gamma} \\
> &0 \to A' \xrightarrow{f'} B' \xrightarrow{g'} C'
> \end{aligned}
> $$
>
> Khi đó có exact sequence:
>
> $$
> \ker \alpha \to \ker \beta \to \ker \gamma \xrightarrow{\delta} \operatorname{coker} \alpha \to \operatorname{coker} \beta \to \operatorname{coker} \gamma
> $$
>
> với **connecting homomorphism** $\delta$ (còn gọi là "snake map"): với $c \in \ker\gamma$, chọn $b \in B$ với $g(b) = c$; vì $\gamma(c) = 0$ nên $g'(\beta(b)) = 0$, tức $\beta(b) \in \ker g' = \operatorname{Im} f'$; chọn $a' \in A'$ với $f'(a') = \beta(b)$; đặt $\delta(c) = a' + \operatorname{Im} \alpha$.

Xem chứng minh đầy đủ tại [[a3-snake-lemma|A3. Snake Lemma]].

> [!example] Example 13.6 — Snake Lemma trong hành động
> Áp dụng Snake Lemma vào:
>
> $$
> \begin{aligned}
> &\mathbb{Z} \xrightarrow{\times 2} \mathbb{Z} \to \mathbb{Z}/2\mathbb{Z} \to 0 \\
> &\downarrow^{\times 3} \quad \downarrow^{\times 3} \quad \downarrow^{\times 3} \\
> &0 \to \mathbb{Z} \xrightarrow{\times 2} \mathbb{Z} \to \mathbb{Z}/2\mathbb{Z}
> \end{aligned}
> $$
>
> Cho exact sequence: $\ker(\times 3 \text{ trên } \mathbb{Z}/2) \to \operatorname{coker}(\times 3 \text{ trên } \mathbb{Z}) \to \cdots$.

---

## Five Lemma

> [!theorem] Theorem 13.7 — Five Lemma
> Cho diagram giao hoán với hàng exact:
>
> $$
> \begin{aligned}
> &A_1 \to A_2 \to A_3 \to A_4 \to A_5 \\
> &\downarrow^{f_1} \downarrow^{f_2} \downarrow^{f_3} \downarrow^{f_4} \downarrow^{f_5} \\
> &B_1 \to B_2 \to B_3 \to B_4 \to B_5
> \end{aligned}
> $$
>
> Nếu $f_1, f_2, f_4, f_5$ là isomorphisms, thì $f_3$ cũng là isomorphism.
>
> (Phiên bản yếu hơn: $f_1$ epi, $f_2, f_4$ iso, $f_5$ mono $\Rightarrow$ $f_3$ iso.)

**Proof (diagram chase).**
*$f_3$ đơn ánh:* Cho $a \in \ker f_3$. Ảnh của $a$ trong $A_4$ là $0$ sau khi đi qua $f_3$ rồi $B_3 \to B_4$. Vì $f_4$ iso, ảnh trong $A_4$ bằng $0$. Exactness tại $A_3$: $a$ đến từ $A_2$. Vì $f_2$ iso, ảnh trong $B_2$ bằng $0$. Exactness tại $B_2$: đến từ $B_1$. Vì $f_1$ epi, đến từ $A_1$. Từ diagram: $a = 0$.

*$f_3$ toàn ánh:* Tương tự diagram chase dùng $f_5$ mono. $\blacksquare$

---

## Projective Resolution và Derived Functors

### Projective Resolution

> [!definition] Definition 13.8 — Projective Resolution
> **Projective resolution** (phân giải projective) của $R$-module $M$ là exact sequence:
>
> $$
> \cdots \to P_2 \xrightarrow{d_2} P_1 \xrightarrow{d_1} P_0 \xrightarrow{\varepsilon} M \to 0
> $$
>
> với mỗi $P_n$ là projective $R$-module.

> [!theorem] Theorem 13.9 — Tồn tại Projective Resolution
> Mọi $R$-module đều có projective resolution.

**Proof.**
Chọn surjection $\varepsilon : P_0 \to M$ với $P_0$ free (lấy $P_0 = R^{(M)}$ free trên tập $M$). Đặt $M_1 = \ker \varepsilon$. Chọn surjection $d_1 : P_1 \to M_1$ với $P_1$ free. Đặt $M_2 = \ker d_1$. Tiếp tục đệ quy. $\blacksquare$

> [!example] Example 13.10 — Projective resolution của $\mathbb{Z}/n\mathbb{Z}$
> $$
> \cdots \to 0 \to \mathbb{Z} \xrightarrow{\times n} \mathbb{Z} \xrightarrow{\pi} \mathbb{Z}/n\mathbb{Z} \to 0
> $$
>
> Đây là projective resolution độ dài $1$ (vì $\mathbb{Z}$ là free $\mathbb{Z}$-module).

> [!example] Example 13.11 — Projective resolution của $k = R/\mathfrak{m}$ (Koszul complex)
> Cho $R = k[x_1, \ldots, x_n]$ và $M = k = R/(x_1,\ldots,x_n)$. Koszul complex cho projective resolution độ dài $n$:
>
> $$
> 0 \to \bigwedge^n R^n \to \cdots \to \bigwedge^2 R^n \to R^n \to R \to k \to 0
> $$
>
> Đây là nền tảng của Regular Sequence Theory trong Commutative Algebra.

### Derived Functors: $\operatorname{Tor}$

> [!definition] Definition 13.12 — $\operatorname{Tor}$
> Cho projective resolution $P_\bullet \to M \to 0$ của $M$. **Tor** được định nghĩa là homology của complex $P_\bullet \otimes_R N$:
>
> $$
> \operatorname{Tor}_n^R(M, N) = H_n(P_\bullet \otimes_R N)
> $$
>
> Cụ thể: $\operatorname{Tor}_0^R(M,N) = M \otimes_R N$.

> [!theorem] Theorem 13.13 — Tính chất của $\operatorname{Tor}$
> 1. $\operatorname{Tor}_n^R(M,N)$ well-defined (không phụ thuộc vào chọn projective resolution).
> 2. $\operatorname{Tor}_n^R(M,N) \cong \operatorname{Tor}_n^R(N,M)$ (symmetry).
> 3. $\operatorname{Tor}_n^R(M,N) = 0$ với $n > 0$ khi $M$ (hoặc $N$) là flat.
> 4. $\operatorname{Tor}_1^R(M, R/I) \cong \ker(M \otimes_R I \to M \otimes_R R) = \operatorname{Ann}_M(I)/IM$.
> 5. $N$ là flat $\iff$ $\operatorname{Tor}_1^R(M,N) = 0$ với mọi $M$.

> [!example] Example 13.14 — Tính $\operatorname{Tor}$ cụ thể
> Tính $\operatorname{Tor}_n^\mathbb{Z}(\mathbb{Z}/m\mathbb{Z}, \mathbb{Z}/n\mathbb{Z})$.
>
> Dùng projective resolution $0 \to \mathbb{Z} \xrightarrow{\times m} \mathbb{Z} \to \mathbb{Z}/m\mathbb{Z} \to 0$. Tensor với $\mathbb{Z}/n\mathbb{Z}$:
>
> $$
> 0 \to \mathbb{Z}/n\mathbb{Z} \xrightarrow{\times m} \mathbb{Z}/n\mathbb{Z} \to 0
> $$
>
> - $\operatorname{Tor}_0 = \operatorname{coker}(\times m) = \mathbb{Z}/n\mathbb{Z} / (m \cdot \mathbb{Z}/n\mathbb{Z}) \cong \mathbb{Z}/\gcd(m,n)\mathbb{Z}$ (như đã biết).
> - $\operatorname{Tor}_1 = \ker(\times m : \mathbb{Z}/n\mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}) \cong \mathbb{Z}/\gcd(m,n)\mathbb{Z}$.
> - $\operatorname{Tor}_k = 0$ với $k \geq 2$ (vì resolution độ dài $1$).

### Derived Functors: $\operatorname{Ext}$

> [!definition] Definition 13.15 — $\operatorname{Ext}$
> Cho projective resolution $P_\bullet \to M \to 0$. **Ext** được định nghĩa là cohomology của complex $\operatorname{Hom}_R(P_\bullet, N)$:
>
> $$
> \operatorname{Ext}_R^n(M, N) = H^n(\operatorname{Hom}_R(P_\bullet, N))
> $$
>
> Cụ thể: $\operatorname{Ext}_R^0(M,N) = \operatorname{Hom}_R(M,N)$.

> [!theorem] Theorem 13.16 — Tính chất của $\operatorname{Ext}$
> 1. $\operatorname{Ext}_R^n(M,N)$ well-defined (không phụ thuộc vào projective resolution của $M$ hay injective resolution của $N$).
> 2. $\operatorname{Ext}_R^n(M,N) = 0$ với $n > 0$ khi $M$ projective hoặc $N$ injective.
> 3. $\operatorname{Ext}_R^1(M,N)$ phân loại các extensions: $0 \to N \to E \to M \to 0$ (sai sai equivalence).
> 4. $M$ projective $\iff$ $\operatorname{Ext}_R^1(M,N) = 0$ với mọi $N$.
> 5. $N$ injective $\iff$ $\operatorname{Ext}_R^1(M,N) = 0$ với mọi $M$.

> [!example] Example 13.17 — Tính $\operatorname{Ext}$ cụ thể
> Tính $\operatorname{Ext}_\mathbb{Z}^n(\mathbb{Z}/m\mathbb{Z}, \mathbb{Z})$.
>
> Dùng resolution $0 \to \mathbb{Z} \xrightarrow{\times m} \mathbb{Z} \to \mathbb{Z}/m\mathbb{Z} \to 0$. Áp $\operatorname{Hom}_\mathbb{Z}(-, \mathbb{Z})$:
>
> $$
> 0 \to \operatorname{Hom}(\mathbb{Z}, \mathbb{Z}) \xrightarrow{(\times m)^*} \operatorname{Hom}(\mathbb{Z}, \mathbb{Z}) \to 0
> $$
>
> Tức: $0 \to \mathbb{Z} \xrightarrow{\times m} \mathbb{Z} \to 0$.
>
> - $\operatorname{Ext}^0 = \ker(\times m) = 0$.
> - $\operatorname{Ext}^1 = \operatorname{coker}(\times m) = \mathbb{Z}/m\mathbb{Z}$.
> - $\operatorname{Ext}^k = 0$ với $k \geq 2$.

> [!example] Example 13.18 — $\operatorname{Ext}^1$ phân loại extensions
> $\operatorname{Ext}_\mathbb{Z}^1(\mathbb{Z}/2, \mathbb{Z}/2) \cong \mathbb{Z}/2\mathbb{Z}$ có hai phần tử, tương ứng:
>
> - $0$ (phần tử đơn vị): extension split $0 \to \mathbb{Z}/2 \to \mathbb{Z}/2 \oplus \mathbb{Z}/2 \to \mathbb{Z}/2 \to 0$.
> - Phần tử khác $0$: extension không split $0 \to \mathbb{Z}/2 \to \mathbb{Z}/4 \to \mathbb{Z}/2 \to 0$.

---

## Long Exact Sequence

> [!theorem] Theorem 13.19 — Long Exact Sequence trong Homology
> Cho short exact sequence của chain complexes $0 \to A_\bullet \to B_\bullet \to C_\bullet \to 0$. Khi đó có long exact sequence:
>
> $$
> \cdots \to H_n(A) \to H_n(B) \to H_n(C) \xrightarrow{\delta_n} H_{n-1}(A) \to H_{n-1}(B) \to \cdots
> $$

> [!corollary] Corollary 13.20 — Long Exact Sequence cho $\operatorname{Tor}$
> Cho short exact sequence $0 \to L \to M \to N \to 0$ và $R$-module $T$. Khi đó:
>
> $$
> \cdots \to \operatorname{Tor}_1(N,T) \to L \otimes T \to M \otimes T \to N \otimes T \to 0
> $$
>
> và tổng quát có long exact sequence:
>
> $$
> \cdots \to \operatorname{Tor}_n(M,T) \to \operatorname{Tor}_n(N,T) \xrightarrow{\delta} \operatorname{Tor}_{n-1}(L,T) \to \cdots
> $$

> [!corollary] Corollary 13.21 — Long Exact Sequence cho $\operatorname{Ext}$
> Cho short exact sequence $0 \to L \to M \to N \to 0$ và $R$-module $T$. Khi đó:
>
> $$
> 0 \to \operatorname{Hom}(N,T) \to \operatorname{Hom}(M,T) \to \operatorname{Hom}(L,T) \to \operatorname{Ext}^1(N,T) \to \operatorname{Ext}^1(M,T) \to \cdots
> $$

---

## Projective Dimension và Global Dimension

> [!definition] Definition 13.22 — Projective Dimension
> **Projective dimension** $\operatorname{pd}(M)$ của $R$-module $M$ là độ dài ngắn nhất của projective resolution của $M$:
>
> $$
> \operatorname{pd}(M) = \min\{n \mid \exists \text{ projective resolution độ dài } n\}
> $$
>
> **Global dimension** của $R$:
>
> $$
> \operatorname{gl.dim}(R) = \sup_{M} \operatorname{pd}(M) = \sup_{M,N} \{n \mid \operatorname{Ext}_R^n(M,N) \neq 0\}
> $$

> [!example] Example 13.23 — Ví dụ Projective Dimension
> - $\operatorname{pd}(R) = 0$ (free $\Rightarrow$ projective $\Rightarrow$ pd = 0).
> - $\operatorname{pd}(\mathbb{Z}/n\mathbb{Z}) = 1$ như $\mathbb{Z}$-module (resolution độ dài 1, không ngắn hơn vì $\mathbb{Z}/n$ không projective khi $n > 1$).
> - $\operatorname{gl.dim}(\mathbb{Z}) = 1$ (mọi $\mathbb{Z}$-module có pd $\leq 1$, vì submodule của free $\mathbb{Z}$-module cũng free).
> - $\operatorname{gl.dim}(k[x_1,\ldots,x_n]) = n$ — **Hilbert Syzygy Theorem**.

> [!theorem] Theorem 13.24 — Hilbert Syzygy Theorem
> $\operatorname{gl.dim}(k[x_1, \ldots, x_n]) = n$.
>
> Tức: mọi finitely generated $k[x_1,\ldots,x_n]$-module có projective resolution độ dài $\leq n$, và tồn tại module cần đúng $n$ bước.

---

## SageMath Cheatsheet

```python
R = ZZ
M = R.quotient(6)
N = R.quotient(4)

E = M.Ext(N, 1)
print(E)

R.<x> = QQ[]
M = R.quotient(x^2 - 1)
N = R.quotient(x - 1)

T = M.tensor_product(N)
print(T)

R = ZZ
M = R.quotient(12)
print(M.projective_resolution())

A = ChainComplex({0: matrix(ZZ, 1, 1, [6]), 1: matrix(ZZ, 1, 1, [2])}, degree_of_differential=-1)
print(A.homology())
```

---

## Summary / Key Takeaways

- **Chain complex**: $d_n \circ d_{n+1} = 0$; **homology** $H_n = \ker d_n / \operatorname{Im} d_{n+1}$ đo sự thất bại exactness.
- **Snake Lemma**: connecting homomorphism $\delta$ nối kernel và cokernel qua diagram giao hoán — nền tảng của long exact sequences.
- **Five Lemma**: nếu 4 trong 5 maps là iso, map giữa cũng là iso.
- **Projective resolution**: $P_\bullet \to M \to 0$ với $P_n$ projective; luôn tồn tại.
- $\operatorname{Tor}_n^R(M,N) = H_n(P_\bullet \otimes N)$: đo sự thất bại left exactness của $\otimes$.
  - $\operatorname{Tor}_0 = M \otimes N$; $\operatorname{Tor}_n = 0$ ($n>0$) khi $M$ flat.
- $\operatorname{Ext}_R^n(M,N) = H^n(\operatorname{Hom}(P_\bullet, N))$: đo sự thất bại right exactness của $\operatorname{Hom}$.
  - $\operatorname{Ext}^0 = \operatorname{Hom}$; $\operatorname{Ext}^1$ phân loại extensions; $\operatorname{Ext}^n=0$ ($n>0$) khi $M$ projective.
- **Long exact sequences**: từ SES của modules $\to$ LES của Tor/Ext — công cụ tính toán chính.
- **Hilbert Syzygy Theorem**: $\operatorname{gl.dim}(k[x_1,\ldots,x_n]) = n$ — kết nối dimension lý thuyết với algebra đa thức.

---

## References

- Weibel, C. A. *An Introduction to Homological Algebra*, Chapters 1–3.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapters 10–11.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 2.
- Matsumura, H. *Commutative Ring Theory*, Chapter 4.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter XX.
