---
title: "09. Modules: Definitions and Basic Constructions"
tags: [math, algebra-foundations, lesson-09]
aliases: [Modules, R-modules]
created: 2026-03-28
---

> **Prerequisites**: [[01-rings-and-ideals|01. Rings and Ideals]] — ring, ideal, ring homomorphism, quotient ring. Kiến thức Group Theory cơ bản (nhóm Abel, đồng cấu).
> **Objectives**:
> - Định nghĩa $R$-module và nhận diện các ví dụ quen thuộc
> - Xây dựng submodule, quotient module, và các định lý đẳng cấu
> - Phân biệt free module, direct sum, và direct product
> - Hiểu vai trò của module như sự tổng quát hóa vector space và abelian group
> - Làm việc với module homomorphism và $\operatorname{Hom}_R(M, N)$

---

## Motivation / Intuition

Module là sự tổng quát hóa của hai cấu trúc quen thuộc:

- **Vector space** là một $k$-module với $k$ là field.
- **Abelian group** là một $\mathbb{Z}$-module (vì $\mathbb{Z}$ tác động tự nhiên lên mọi nhóm Abel qua $n \cdot a = a + \cdots + a$).

Khi ta thay field $k$ bằng ring tổng quát $R$, nhiều tính chất đẹp của vector space bị mất: module có thể không có basis, không phải mọi submodule đều là direct summand, và hai module rank bằng nhau có thể không isomorphic. Đây chính là nguồn gốc của sự phong phú — và khó khăn — của Module Theory.

**Tại sao module quan trọng với Commutative Algebra?** Trong ngôn ngữ hiện đại, hầu hết các đối tượng của Commutative Algebra được nghiên cứu qua module của chúng. Ví dụ: một ring extension $R \subseteq S$ có thể xem $S$ như $R$-module; ideal $I \trianglelefteq R$ là $R$-submodule của $R$; sheaf of rings trong Algebraic Geometry là một family of modules.

---

## Định nghĩa R-Module

> [!definition] Definition 9.1 — $R$-Module
> Cho $R$ là ring (commutative, có đơn vị). Một **$R$-module** (hay **module trên $R$**) là một nhóm Abel $(M, +)$ cùng một phép nhân vô hướng (scalar multiplication) $R \times M \to M$, $(r, m) \mapsto rm$, thỏa mãn với mọi $r, s \in R$, $m, n \in M$:
>
> 1. $r(m + n) = rm + rn$
> 2. $(r + s)m = rm + sm$
> 3. $(rs)m = r(sm)$
> 4. $1_R \cdot m = m$

> [!note] Remark 9.2 — Các trường hợp đặc biệt
> - Nếu $R = k$ là field: $R$-module = **$k$-vector space**.
> - Nếu $R = \mathbb{Z}$: $R$-module = **nhóm Abel** (vì $n \cdot m$ xác định duy nhất bởi cấu trúc nhóm).
> - Nếu $R = k[x]$ ($k$ là field): $R$-module = **$k$-vector space $V$ với một linear operator $T : V \to V$** (do $x$ tác động lên $V$ như $T$). Đây là cách nhìn đại số tuyến tính từ Module Theory.
> - Mọi **ideal** $I \trianglelefteq R$ là $R$-module (với phép nhân vô hướng là phép nhân của ring).
> - $R$ chính nó là $R$-module — gọi là **free module of rank 1**.

> [!example] Example 9.3 — Ví dụ cơ bản
> - $\mathbb{Z}^n$: $\mathbb{Z}$-module tự do rank $n$.
> - $\mathbb{Z}/n\mathbb{Z}$: $\mathbb{Z}$-module.
> - $\mathbb{Q}$: $\mathbb{Z}$-module (không free vì $\mathbb{Q}$ không có basis hữu hạn, và cũng không có basis vô hạn theo nghĩa free).
> - $k[x]/(f)$: $k[x]$-module, cũng là $k$-vector space chiều $\deg f$.
> - $\mathbb{Z}[\sqrt{-5}]$: $\mathbb{Z}$-module free rank $2$ với basis $\{1, \sqrt{-5}\}$.

---

## Module Homomorphism

> [!definition] Definition 9.4 — Module Homomorphism
> **$R$-module homomorphism** (hay $R$-linear map) từ $M$ đến $N$ là ánh xạ $f : M \to N$ thỏa mãn với mọi $r \in R$, $m, m' \in M$:
>
> $$
> f(m + m') = f(m) + f(m'), \qquad f(rm) = rf(m)
> $$
>
> Tập tất cả $R$-module homomorphisms từ $M$ đến $N$ được ký hiệu $\operatorname{Hom}_R(M, N)$.

> [!note] Remark 9.5 — $\operatorname{Hom}_R(M,N)$ là $R$-module
> Với $R$ commutative, $\operatorname{Hom}_R(M, N)$ là $R$-module với:
>
> $$
> (f + g)(m) = f(m) + g(m), \qquad (rf)(m) = r \cdot f(m)
> $$
>
> Khi $R = k$ là field: $\operatorname{Hom}_k(V, W)$ = không gian các linear maps, chiều $(\dim V)(\dim W)$.

> [!definition] Definition 9.6 — Kernel, Image, Isomorphism
> Cho $f : M \to N$ là $R$-module homomorphism:
>
> - $\ker f = \{m \in M \mid f(m) = 0\}$ — là **submodule** của $M$.
> - $\operatorname{Im} f = \{f(m) \mid m \in M\}$ — là **submodule** của $N$.
> - $f$ là **monomorphism** (đơn ánh), **epimorphism** (toàn ánh), **isomorphism** (song ánh) như thường.
> - $M \cong N$: $M$ và $N$ isomorphic (sai sai $R$-module isomorphism).

---

## Submodule và Quotient Module

> [!definition] Definition 9.7 — Submodule
> Tập con $N \subseteq M$ là **submodule** (module con) của $R$-module $M$ nếu:
>
> 1. $(N, +)$ là nhóm con của $(M, +)$.
> 2. $r \in R$, $n \in N$ $\Rightarrow$ $rn \in N$.

> [!example] Example 9.8 — Submodules trong các ngữ cảnh khác nhau
> - Submodule của $\mathbb{Z}$-module $M$ = subgroup của nhóm Abel $M$.
> - Submodule của $k$-vector space = subspace.
> - Submodule của $R$ (như $R$-module) = ideal của $R$.
> - Nếu $M = k[x]$-module ứng với $(V, T)$: submodule = $T$-invariant subspace của $V$.

> [!theorem] Theorem 9.9 — Quotient Module
> Cho $N$ là submodule của $M$. Tập thương $M/N = \{m + N \mid m \in M\}$ với:
>
> $$
> (m + N) + (m' + N) = (m + m') + N, \qquad r(m + N) = rm + N
> $$
>
> là $R$-module, gọi là **quotient module** (module thương). Ánh xạ projection $\pi : M \to M/N$, $m \mapsto m + N$ là epimorphism với $\ker\pi = N$.

---

## Các Định lý Đẳng cấu

> [!theorem] Theorem 9.10 — First Isomorphism Theorem
> Cho $f : M \to N$ là $R$-module homomorphism. Khi đó:
>
> $$
> M / \ker f \cong \operatorname{Im} f
> $$
>
> qua isomorphism $\bar{f}(m + \ker f) = f(m)$.

> [!theorem] Theorem 9.11 — Second và Third Isomorphism Theorems
> **(Second)** Cho $N_1, N_2$ là submodules của $M$. Khi đó:
>
> $$
> (N_1 + N_2)/N_2 \cong N_1/(N_1 \cap N_2)
> $$
>
> **(Third)** Cho $N \subseteq L \subseteq M$ là submodules. Khi đó $L/N$ là submodule của $M/N$ và:
>
> $$
> (M/N)/(L/N) \cong M/L
> $$

> [!theorem] Theorem 9.12 — Correspondence Theorem
> Cho $N \subseteq M$ là submodule. Có song ánh bảo toàn thứ tự:
>
> $$
> \{\text{submodules của } M \text{ chứa } N\} \longleftrightarrow \{\text{submodules của } M/N\}
> $$

Các chứng minh hoàn toàn tương tự như trường hợp groups và rings (Bài 01).

---

## Direct Sum và Direct Product

> [!definition] Definition 9.13 — Direct Product và Direct Sum
> Cho $\{M_i\}_{i \in I}$ là họ $R$-modules.
>
> - **Direct product** (tích trực tiếp):
>
> $$
> \prod_{i \in I} M_i = \left\{ (m_i)_{i \in I} \;\middle|\; m_i \in M_i \right\}
> $$
>
> với phép toán theo tọa độ. Đây là $R$-module.
>
> - **Direct sum** (tổng trực tiếp):
>
> $$
> \bigoplus_{i \in I} M_i = \left\{ (m_i)_{i \in I} \in \prod M_i \;\middle|\; m_i = 0 \text{ với hầu hết mọi } i \right\}
> $$
>
> Nếu $I$ hữu hạn: $\bigoplus_{i=1}^n M_i = \prod_{i=1}^n M_i = M_1 \oplus \cdots \oplus M_n$.

> [!note] Remark 9.14 — Direct sum vs Direct product
> Khi $I$ vô hạn, $\bigoplus M_i \subsetneq \prod M_i$: direct sum chỉ gồm các tuple có hữu hạn tọa độ khác $0$. Ví dụ: $\bigoplus_{n \geq 1} \mathbb{Z}$ gồm các dãy số nguyên chỉ có hữu hạn số khác $0$, còn $\prod_{n \geq 1} \mathbb{Z}$ gồm mọi dãy số nguyên.

> [!definition] Definition 9.15 — Internal Direct Sum
> $M$ là **internal direct sum** của các submodules $N_1, \ldots, N_k$, viết $M = N_1 \oplus \cdots \oplus N_k$, nếu:
>
> 1. $M = N_1 + \cdots + N_k$ (sinh bởi union).
> 2. $N_i \cap (N_1 + \cdots + \hat{N}_i + \cdots + N_k) = 0$ với mọi $i$.
>
> Tương đương: mọi $m \in M$ viết duy nhất $m = n_1 + \cdots + n_k$ với $n_i \in N_i$.

---

## Free Module và Basis

> [!definition] Definition 9.16 — Free Module và Basis
> $R$-module $M$ là **free** (tự do) nếu có **basis** $\{e_i\}_{i \in I}$ — tập con của $M$ sao cho mọi $m \in M$ viết duy nhất:
>
> $$
> m = \sum_{i \in I} r_i e_i \quad (r_i \in R, \text{ hầu hết bằng } 0)
> $$
>
> Free module trên $R$ với basis $n$ phần tử isomorphic với $R^n = R \oplus \cdots \oplus R$ ($n$ lần).

> [!theorem] Theorem 9.17 — Universal Property của Free Module
> $R^{(I)} = \bigoplus_{i \in I} R$ là free module với basis $\{e_i\}$ (với $e_i$ là tuple chỉ có $1$ ở vị trí $i$). Với mọi $R$-module $M$ và mọi ánh xạ $\varphi : I \to M$ (tập hợp), tồn tại duy nhất $R$-linear map $\bar\varphi : R^{(I)} \to M$ mở rộng $\varphi$:
>
> $$
> \bar\varphi(e_i) = \varphi(i)
> $$

> [!warning] Counterexample 9.18 — Module không free
> **$\mathbb{Q}$ như $\mathbb{Z}$-module không free:** Giả sử có basis $\{a/b\} \subseteq \mathbb{Q}$. Thì $1/b^2 = c \cdot (a/b)$ đòi $c = 1/(ab)$ — không thuộc $\mathbb{Z}$. Thực ra $\mathbb{Q}$ không có basis $\mathbb{Z}$-tuyến tính nào cả.
>
> **$\mathbb{Z}/n\mathbb{Z}$ như $\mathbb{Z}$-module không free:** Mọi phần tử bị annihilate bởi $n$, nhưng free module không có torsion.

> [!warning] Counterexample 9.19 — Rank không well-defined cho ring tổng quát
> Trên ring giao hoán $R \neq 0$: $R^m \cong R^n$ $\Rightarrow$ $m = n$ (**IBN — Invariant Basis Number**). Hầu hết rings quen thuộc (commutative, Noetherian, ...) đều có IBN. Tuy nhiên, có rings kỳ lạ với $R \cong R^2$ như $R$-module.

---

## Submodule sinh bởi tập, Module hữu hạn sinh

> [!definition] Definition 9.20 — Generated Submodule, Finitely Generated
> - Submodule **sinh bởi** $S \subseteq M$: $RS = \left\{\sum_{i=1}^k r_i s_i \mid r_i \in R, s_i \in S, k \geq 1\right\}$ — nhỏ nhất chứa $S$.
> - $M$ là **finitely generated** (hữu hạn sinh) nếu $M = R\{m_1, \ldots, m_k\}$ với $m_i \in M$ hữu hạn.
> - $M$ là **cyclic** nếu $M = Rm$ với $m \in M$ (sinh bởi một phần tử).

> [!example] Example 9.21
> - $R^n$ hữu hạn sinh bởi $\{e_1, \ldots, e_n\}$.
> - $\mathbb{Z}/n\mathbb{Z}$ cyclic như $\mathbb{Z}$-module: $\mathbb{Z}/n\mathbb{Z} = \mathbb{Z} \cdot \bar{1}$.
> - Ideals finitely generated trong Noetherian ring (Bài 05).
> - $\mathbb{Q}$ như $\mathbb{Z}$-module: **không** hữu hạn sinh. Giả sử $\mathbb{Q} = \mathbb{Z} \cdot \{p_1/q_1, \ldots, p_k/q_k\}$, thì $1/(q_1 \cdots q_k \cdot p)$ với $p$ nguyên tố khác $q_i$ không thuộc $\mathbb{Z}\{p_i/q_i\}$.

---

## Annihilator và Torsion

> [!definition] Definition 9.22 — Annihilator và Torsion
> Cho $M$ là $R$-module và $m \in M$:
>
> - **Annihilator** của $m$: $\operatorname{Ann}(m) = \{r \in R \mid rm = 0\} \trianglelefteq R$.
> - **Annihilator** của $M$: $\operatorname{Ann}(M) = \bigcap_{m \in M} \operatorname{Ann}(m) = \{r \in R \mid rm = 0 \;\forall m\} \trianglelefteq R$.
> - $m$ là **torsion element** nếu $\operatorname{Ann}(m) \neq 0$, tức $rm = 0$ với $r \neq 0$ nào đó.
> - $M$ là **torsion module** nếu mọi phần tử là torsion.
> - $M$ là **torsion-free** nếu không có torsion element khác $0$.

> [!example] Example 9.23
> - $\mathbb{Z}/n\mathbb{Z}$: torsion $\mathbb{Z}$-module. $\operatorname{Ann}(\bar{k}) = (n/\gcd(n,k))\mathbb{Z}$.
> - $\mathbb{Q}$: torsion-free $\mathbb{Z}$-module.
> - $\mathbb{Z} \oplus \mathbb{Z}/6\mathbb{Z}$: mixed — có cả torsion element lẫn torsion-free element.
> - Free module $R^n$: torsion-free khi $R$ là integral domain.

---

## Exact Sequences (giới thiệu)

> [!definition] Definition 9.24 — Exact Sequence
> Dãy các $R$-module homomorphisms:
>
> $$
> \cdots \to M_{i-1} \xrightarrow{f_{i-1}} M_i \xrightarrow{f_i} M_{i+1} \to \cdots
> $$
>
> là **exact** tại $M_i$ nếu $\operatorname{Im}(f_{i-1}) = \ker(f_i)$.
>
> Dãy là **exact sequence** (dãy khớp) nếu nó exact tại mọi vị trí.

> [!example] Example 9.25 — Short Exact Sequence
> **Short exact sequence** (dãy khớp ngắn) có dạng:
>
> $$
> 0 \to L \xrightarrow{f} M \xrightarrow{g} N \to 0
> $$
>
> - Exactness tại $L$: $f$ đơn ánh.
> - Exactness tại $M$: $\operatorname{Im} f = \ker g$.
> - Exactness tại $N$: $g$ toàn ánh.
>
> Tương đương: $L \cong \operatorname{Im} f \trianglelefteq M$ và $N \cong M/L$.

> [!example] Example 9.26 — Các exact sequences quen thuộc
> - $0 \to n\mathbb{Z} \to \mathbb{Z} \to \mathbb{Z}/n\mathbb{Z} \to 0$.
> - $0 \to \mathbb{Z} \xrightarrow{\times n} \mathbb{Z} \to \mathbb{Z}/n\mathbb{Z} \to 0$.
> - $0 \to I \to R \to R/I \to 0$ với $I \trianglelefteq R$.

---

## SageMath Cheatsheet

```python
M = ZZ^3
v = M([1, 2, 3])
w = M([0, 1, -1])
print(v + 2*w)

M = ZZ^2
N = M.submodule([[2, 0], [0, 3]])
Q = M.quotient(N)
print(Q)
print(Q.invariants())

R = ZZ
M = R.quotient(6)
print(M.annihilator())

M = ZZ^2
N = M.submodule([[1, 1], [2, 0]])
Q = M / N
print(Q.invariants())

M1 = ZZ^2
M2 = ZZ.quotient(4)
M = M1.direct_sum(M2)
print(M)

R = QQ['x']
x = R.gen()
M = R.quotient(x^2 - 1)
print(M)
```

---

## Summary / Key Takeaways

- **$R$-module** = nhóm Abel + scalar multiplication bởi $R$; tổng quát hóa vector space ($R = k$), abelian group ($R = \mathbb{Z}$), và linear algebra ($R = k[x]$).
- **Module homomorphism** $f : M \to N$: $R$-linear; $\ker f$ và $\operatorname{Im} f$ là submodules.
- **Quotient module** $M/N$: well-defined với $N$ submodule; $\operatorname{Hom}_R$ và các định lý đẳng cấu đều tương tự ring/group.
- **Direct sum** $\bigoplus M_i$: hữu hạn tọa độ khác $0$; **direct product** $\prod M_i$: mọi tọa độ.
- **Free module** $R^{(I)}$: có basis; universal property — ánh xạ tự do từ $I$ vào $M$ nâng thành linear map duy nhất.
- **Finitely generated**: $M = R m_1 + \cdots + R m_k$; không nhất thiết free.
- **Torsion**: $m$ torsion nếu $rm = 0$ ($r \neq 0$); free module trên domain là torsion-free.
- **Exact sequence**: $\operatorname{Im} f_{i-1} = \ker f_i$; short exact sequence $0 \to L \to M \to N \to 0$ mã hóa $M$ như extension của $N$ bởi $L$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 10.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter III.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 2.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 7.
