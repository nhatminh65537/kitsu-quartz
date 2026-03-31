---
title: "02. Modules"
tags: [math, commutative-algebra, lesson-02]
aliases: [Modules]
created: 2026-03-28
---

> **Prerequisites**: [[01-rings-ideals-homomorphisms|01. Rings, Ideals, and Homomorphisms]]
> **Objectives**:
> - Nắm định nghĩa module và nhận diện các ví dụ cơ bản (abelian groups, vector spaces, ideals)
> - Hiểu exact sequence và ý nghĩa của nó trong việc mô tả các cấu trúc ngắn hạn
> - Biết free module và tính chất universal property
> - Áp dụng Nakayama's Lemma — công cụ trung tâm của commutative algebra

---

## Motivation / Intuition

Nếu vành là sự mở rộng của trường, thì module là sự mở rộng của không gian vector. Thay vì nhân vô hướng từ một trường, ta có nhân vô hướng từ một vành tùy ý. Sự tổng quát hóa này cho phép chúng ta thống nhất nhiều đối tượng khác nhau dưới cùng một khung:

- **Nhóm Abel** là $\mathbb{Z}$-module (nhân bởi số nguyên = cộng nhiều lần).
- **Không gian vector** là $k$-module với $k$ là trường.
- **Ideal** $\mathfrak{a} \subseteq R$ là $R$-module.
- **Vành thương** $R/\mathfrak{a}$ là $R$-module.

Tại sao module lại quan trọng trong commutative algebra? Bởi vì mọi cấu trúc ta gặp — localization, completion, tensor product, homological algebra — đều hoạt động ở cấp độ module, không chỉ ở cấp độ vành. Hơn nữa, lý thuyết module cung cấp ngôn ngữ để nói về *độ phức tạp* của một vành: một vành "đơn giản" là một vành mà mọi module trên nó có cấu trúc tốt (ví dụ: free).

Bổ đề Nakayama — ra đời ở cuối bài này — là một trong những kết quả được dùng thường xuyên nhất trong toàn bộ commutative algebra. Nó nói (đơn giản hóa): nếu một module bị "thu nhỏ" bởi Jacobson radical thì về bản chất nó đã là $0$.

---

## Module

### Definition

> [!info] Definition 2.1 — $R$-Module
>
> Cho $R$ là vành giao hoán. Một **$R$-module** là nhóm Abel $(M, +)$ cùng một phép toán nhân vô hướng (scalar multiplication) $R \times M \to M$, $(r, m) \mapsto rm$, thỏa:
>
> 1. $r(m + n) = rm + rn$
> 2. $(r + s)m = rm + sm$
> 3. $(rs)m = r(sm)$
> 4. $1 \cdot m = m$
>
> với mọi $r, s \in R$ và $m, n \in M$.

> [!example] Example 2.2 — Các ví dụ cơ bản
>
> | $R$ | $M$ | Ghi chú |
> |-----|-----|---------|
> | $\mathbb{Z}$ | Nhóm Abel bất kỳ | $n \cdot m = m + \cdots + m$ ($n$ lần) |
> | Trường $k$ | Không gian vector | Module = không gian vector |
> | $R$ | $R$ (chính nó) | Phép nhân trong vành |
> | $R$ | Ideal $\mathfrak{a} \subseteq R$ | Submodule của $R$ |
> | $R$ | $R/\mathfrak{a}$ | $r \cdot (x + \mathfrak{a}) = rx + \mathfrak{a}$ |
> | $k[x]$ | $V$ cùng toán tử $T$ | $x \cdot v = T(v)$ — biến $V$ thành $k[x]$-module |

### Definition

> [!info] Definition 2.3 — Submodule, Quotient Module, Module Homomorphism
>
> Cho $M$ là $R$-module.
>
> - **Submodule**: $N \subseteq M$ là submodule nếu $N$ là nhóm con của $(M,+)$ và $rn \in N$ với mọi $r \in R$, $n \in N$.
> - **Quotient module**: Với $N \subseteq M$ submodule, tập $M/N = \{m + N : m \in M\}$ là $R$-module với $r(m + N) = rm + N$.
> - **Module homomorphism**: Ánh xạ $f: M \to M'$ thỏa $f(m + n) = f(m) + f(n)$ và $f(rm) = rf(m)$. Ký hiệu: $\operatorname{Hom}_R(M, M')$.

### Theorem

> [!abstract] Theorem 2.4 — Định lý đẳng cấu (cho module)
>
> Cho $f: M \to N$ là $R$-module homomorphism. Khi đó:
>
> $$
> M/\ker f \;\cong\; \operatorname{Im} f
> $$
>
> Hơn nữa, nếu $N \subseteq L \subseteq M$ là các submodule, thì:
>
> $$
> (M/N)/(L/N) \;\cong\; M/L
> $$

**Proof.** Hoàn toàn tương tự định lý đẳng cấu cho vành (Theorem 1.10). Ánh xạ $\bar{f}: M/\ker f \to \operatorname{Im} f$, $m + \ker f \mapsto f(m)$ là well-defined, là module homomorphism bijective. $\blacksquare$

---

## Direct Sum và Direct Product

### Definition

> [!info] Definition 2.5 — Tổng trực tiếp và Tích trực tiếp
>
> Cho $\{M_i\}_{i \in I}$ là một họ $R$-modules.
>
> - **Tích trực tiếp** (direct product): $\prod_{i \in I} M_i$ — tập tất cả các bộ $(m_i)_{i \in I}$ với $m_i \in M_i$, phép toán theo từng thành phần.
> - **Tổng trực tiếp** (direct sum): $\bigoplus_{i \in I} M_i$ — tập các bộ $(m_i)$ với $m_i = 0$ trừ hữu hạn $i$.
>
> Khi $I$ hữu hạn: $\prod_{i=1}^n M_i = \bigoplus_{i=1}^n M_i$, ký hiệu $M_1 \oplus \cdots \oplus M_n$.

> [!note] Remark 2.6 — Universal Properties
>
> - $\prod M_i$ là **tích** trong phạm trù $R$-modules: với mọi module $N$ và bộ homomorphisms $f_i: N \to M_i$, tồn tại duy nhất $f: N \to \prod M_i$ sao cho $\pi_i \circ f = f_i$.
> - $\bigoplus M_i$ là **coproduct**: với mọi $N$ và $g_i: M_i \to N$, tồn tại duy nhất $g: \bigoplus M_i \to N$ sao cho $g \circ \iota_i = g_i$.

---

## Exact Sequence

### Definition

> [!info] Definition 2.7 — Exact Sequence (Dãy khớp)
>
> Một dãy các $R$-module homomorphisms:
>
> $$
> \cdots \to M_{n-1} \xrightarrow{f_{n-1}} M_n \xrightarrow{f_n} M_{n+1} \to \cdots
> $$
>
> được gọi là **exact** (khớp) tại $M_n$ nếu $\operatorname{Im}(f_{n-1}) = \ker(f_n)$.
>
> Dãy **exact ngắn** (short exact sequence):
>
> $$
> 0 \to M' \xrightarrow{f} M \xrightarrow{g} M'' \to 0
> $$
>
> nghĩa là: $f$ injective, $g$ surjective, và $\operatorname{Im} f = \ker g$.

### Worked Example

> [!example] Example 2.8 — Các short exact sequences cơ bản
>
> **Ví dụ 1:** Với $\mathfrak{a} \subseteq R$ ideal:
>
> $$
> 0 \to \mathfrak{a} \xrightarrow{\text{bao hàm}} R \xrightarrow{\pi} R/\mathfrak{a} \to 0
> $$
>
> **Ví dụ 2:** Nhân với $n$ trong $\mathbb{Z}$:
>
> $$
> 0 \to \mathbb{Z} \xrightarrow{\times n} \mathbb{Z} \to \mathbb{Z}/n\mathbb{Z} \to 0
> $$
>
> **Ví dụ 3 (splitting):** Dãy $0 \to M' \to M' \oplus M'' \to M'' \to 0$ luôn exact và được gọi là **split**.

> [!abstract] Theorem 2.9 — Splitting Lemma
>
> Cho short exact sequence $0 \to M' \xrightarrow{f} M \xrightarrow{g} M'' \to 0$. Các điều sau tương đương:
>
> 1. Tồn tại $s: M'' \to M$ sao cho $g \circ s = \operatorname{id}_{M''}$ (section).
> 2. Tồn tại $r: M \to M'$ sao cho $r \circ f = \operatorname{id}_{M'}$ (retraction).
> 3. $M \cong M' \oplus M''$.

**Proof (phác thảo).** $(1) \Rightarrow (3)$: Định nghĩa $\phi: M \to M' \oplus M''$ bởi $\phi(m) = (r(m), g(m))$ với $r(m) = m - s(g(m))$ (chiếu lên $M'$ dọc theo $\operatorname{Im} s$). Kiểm tra $\phi$ là isomorphism. $\blacksquare$

---

## Free Module

### Definition

> [!info] Definition 2.10 — Free Module
>
> Một $R$-module $F$ là **free** (tự do) nếu có một cơ sở (basis): tập $\{e_i\}_{i \in I} \subseteq F$ sao cho mọi $m \in F$ được viết duy nhất dưới dạng:
>
> $$
> m = \sum_{i \in I} r_i e_i \quad (r_i \in R,\; r_i = 0 \text{ trừ hữu hạn } i)
> $$
>
> **Ký hiệu:** $R^n = R \oplus \cdots \oplus R$ ($n$ lần) là free module hữu hạn sinh.

> [!abstract] Theorem 2.11 — Universal Property của Free Module
>
> $F$ là free module với basis $\{e_i\}_{i \in I}$ khi và chỉ khi: với mọi $R$-module $M$ và bộ $\{m_i\}_{i \in I} \subseteq M$, tồn tại duy nhất homomorphism $f: F \to M$ sao cho $f(e_i) = m_i$.

**Proof.** Định nghĩa $f\!\left(\sum r_i e_i\right) = \sum r_i m_i$. Tính duy nhất của biểu diễn trong $F$ đảm bảo $f$ well-defined. $\blacksquare$

> [!note] Remark 2.12 — Module tự do vs. Không gian vector
>
> Mọi $k$-module (không gian vector) đều free (có cơ sở). Với vành tổng quát, điều này sai: $\mathbb{Z}/2\mathbb{Z}$ là $\mathbb{Z}$-module nhưng không free (vì $1 \cdot \bar{1} = \bar{1}$ nhưng $2 \cdot \bar{1} = \bar{0}$, tức mọi phần tử bị triệt tiêu bởi $2 \neq 0$).

---

## Finitely Generated Modules

### Definition

> [!info] Definition 2.13 — Module hữu hạn sinh (Finitely Generated Module)
>
> $M$ là **hữu hạn sinh** (finitely generated) nếu tồn tại $m_1, \ldots, m_n \in M$ sao cho:
>
> $$
> M = Rm_1 + \cdots + Rm_n = \left\{\sum_{i=1}^n r_i m_i : r_i \in R\right\}
> $$
>
> Tương đương: $M$ là quotient của một free module hữu hạn hạng $R^n \twoheadrightarrow M$.

### Theorem

> [!abstract] Theorem 2.14 — Nakayama's Lemma
>
> Cho $M$ là $R$-module hữu hạn sinh và $\mathfrak{a} \subseteq \operatorname{Jac}(R)$ là ideal nằm trong Jacobson radical. Nếu:
>
> $$
> \mathfrak{a} M = M
> $$
>
> thì $M = 0$.

**Proof.** Giả sử $M \neq 0$. Vì $M$ hữu hạn sinh, lấy hệ sinh tối giản $m_1, \ldots, m_n$ ($n \geq 1$). Vì $\mathfrak{a}M = M$, có thể viết:

$$
m_1 = \sum_{i=1}^n a_i m_i \quad (a_i \in \mathfrak{a})
$$

Suy ra $(1 - a_1)m_1 = \sum_{i=2}^n a_i m_i$. Vì $a_1 \in \mathfrak{a} \subseteq \operatorname{Jac}(R)$, theo Theorem 1.20, phần tử $1 - a_1$ là đơn vị trong $R$. Vậy:

$$
m_1 = (1-a_1)^{-1} \sum_{i=2}^n a_i m_i \in Rm_2 + \cdots + Rm_n
$$

Điều này mâu thuẫn với giả thiết $\{m_1, \ldots, m_n\}$ là hệ sinh tối giản. $\blacksquare$

### Corollary

> [!abstract] Corollary 2.15 — Nakayama's Lemma (dạng thường dùng)
>
> Cho $(R, \mathfrak{m})$ là local ring, $M$ là $R$-module hữu hạn sinh. Khi đó:
>
> $$
> \mathfrak{m}M = M \implies M = 0
> $$
>
> Hơn nữa, nếu $N \subseteq M$ là submodule sao cho $M = N + \mathfrak{m}M$, thì $M = N$.

**Proof.** Áp dụng Nakayama cho $M/N$: $\mathfrak{m}(M/N) = (N + \mathfrak{m}M)/N = M/N$, nên $M/N = 0$, tức $M = N$. $\blacksquare$

> [!tip] Ứng dụng quan trọng
>
> Nakayama cho phép "nâng" (lift) các kết quả từ $M/\mathfrak{m}M$ (module trên trường $R/\mathfrak{m}$, tức không gian vector) lên $M$. Ví dụ: một tập $\{m_1,\ldots,m_n\}$ sinh $M/\mathfrak{m}M$ (như không gian vector trên $R/\mathfrak{m}$) thì sinh $M$ (như $R$-module).

### Worked Example

> [!example] Example 2.16 — Ứng dụng Nakayama
>
> Cho $(R, \mathfrak{m})$ local ring, $M$ hữu hạn sinh. Tìm số sinh tối giản của $M$.
>
> Vì $R/\mathfrak{m}$ là trường, $M/\mathfrak{m}M$ là không gian vector hữu hạn chiều trên $R/\mathfrak{m}$. Gọi $\dim_{R/\mathfrak{m}}(M/\mathfrak{m}M) = n$.
>
> Lấy $m_1, \ldots, m_n \in M$ sao cho $\bar{m}_1, \ldots, \bar{m}_n$ là cơ sở của $M/\mathfrak{m}M$. Khi đó $M = Rm_1 + \cdots + Rm_n + \mathfrak{m}M$. Theo Nakayama (Corollary 2.15) với $N = Rm_1 + \cdots + Rm_n$: $M = N$.
>
> Vậy $M$ sinh bởi $n$ phần tử, và $n$ là tối giản (vì bất kỳ hệ sinh nào phải bao phủ $M/\mathfrak{m}M$).

---

## SageMath Cheatsheet

```sage
# Tạo free module
R = ZZ
M = R**3          # Z^3 (free module hạng 3)
M.basis()         # [(1, 0, 0), (0, 1, 0), (0, 0, 1)]

# Module trên vành đa thức (qua vector space)
R.<x> = QQ[]
M = R**2
v = M([x^2 + 1, x - 3])   # phần tử của M

# Submodule và quotient
R.<x,y> = QQ[]
M = R**2
N = M.submodule([M([x, y]), M([y, x^2])])

# Module homomorphism (qua matrix)
R = ZZ
phi = matrix(R, [[2, 0], [0, 3]])  # homomorphism Z^2 -> Z^2
phi.kernel()     # kernel
phi.image()      # image

# Kiểm tra finitely generated (với Groebner basis)
R.<x,y> = QQ[]
I = R.ideal(x^2 - y, y^2 - 1)
I.is_primary()
```

---

## Summary / Key Takeaways

- $R$-module tổng quát hóa không gian vector: nhân vô hướng từ vành $R$ thay vì trường.
- Mọi nhóm Abel là $\mathbb{Z}$-module; mọi ideal là $R$-module.
- Short exact sequence $0 \to M' \to M \to M'' \to 0$: $M'$ "nằm trong" $M$, còn $M''$ là "phần còn lại".
- Splitting Lemma: nếu dãy tách thì $M \cong M' \oplus M''$.
- Free module $R^n$: có basis, là "module tốt nhất" — mọi module là quotient của free module.
- Module hữu hạn sinh: sinh bởi hữu hạn phần tử; quan trọng vì Nakayama áp dụng được.
- **Nakayama's Lemma**: $M$ h.s. + $\mathfrak{a} \subseteq \operatorname{Jac}(R)$ + $\mathfrak{a}M = M$ $\Rightarrow$ $M = 0$.
- Hệ quả thực tiễn: để kiểm tra $M = N$, chỉ cần kiểm tra $M/\mathfrak{m}M = N/\mathfrak{m}N$ với local ring.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapters 2–3.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 4.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 4–8.
- Matsumura, H. *Commutative Ring Theory*, Chapter 2 (Nakayama's Lemma).
