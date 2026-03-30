---
title: "10. Finitely Generated Modules over PIDs"
tags: [math, algebra-foundations, lesson-10]
aliases: [Structure Theorem, Modules over PIDs]
created: 2026-03-28
---

> **Prerequisites**: [[02-special-rings-domains-fields|02. Special Rings: Domains and Fields]] — PID, UFD, gcd. [[09-modules-definitions|09. Modules: Definitions and Basic Constructions]] — submodule, quotient module, free module, torsion, finitely generated.
> **Objectives**:
> - Phát biểu và hiểu Structure Theorem cho finitely generated modules over PID
> - Làm việc với hai dạng: invariant factor form và elementary divisor form
> - Áp dụng định lý vào phân loại finitely generated abelian groups
> - Liên hệ với Jordan canonical form trong đại số tuyến tính

---

## Motivation / Intuition

Trên field $k$, mọi finitely generated module (tức vector space hữu hạn chiều) đều isomorphic với $k^n$ — phân loại hoàn toàn bởi một con số $n$. Điều gì xảy ra khi ta thay $k$ bằng $\mathbb{Z}$ hay $k[x]$?

Câu trả lời là **Structure Theorem** (định lý cấu trúc) — một trong những định lý đẹp nhất của Algebra. Nó nói rằng mọi finitely generated module trên PID đều phân tích thành tổng trực tiếp của các **cyclic modules** theo một cách duy nhất. Sự duy nhất này mạnh hơn nhiều so với trường hợp vector space: không chỉ một số $n$ mà còn là một dãy các **invariant factors** hoặc **elementary divisors**.

**Hai ứng dụng kinh điển:**
- $R = \mathbb{Z}$: phân loại đầy đủ **finitely generated abelian groups**.
- $R = k[x]$: phân loại các **linear operators** (tức là Jordan canonical form và rational canonical form).

---

## Torsion Module và Free Part

> [!definition] Definition 10.1 — Torsion Submodule
> Cho $M$ là $R$-module trên integral domain $R$. **Torsion submodule** (module con xoắn) của $M$ là:
>
> $$
> M_{\text{tor}} = \{m \in M \mid rm = 0 \text{ với } r \in R \text{ nào đó}, r \neq 0\}
> $$
>
> $M_{\text{tor}}$ là submodule của $M$. Quotient $M/M_{\text{tor}}$ là torsion-free.

> [!theorem] Theorem 10.2 — Phân tách Free và Torsion (trên PID)
> Cho $M$ là finitely generated module trên PID $R$. Khi đó:
>
> $$
> M \cong R^r \oplus M_{\text{tor}}
> $$
>
> với $r \geq 0$ là **rank** (hạng tự do) của $M$, và $M_{\text{tor}}$ là torsion submodule hữu hạn sinh.

---

## Structure Theorem — Invariant Factor Form

> [!theorem] Theorem 10.3 — Structure Theorem (Invariant Factor Form)
> Cho $M$ là finitely generated module trên PID $R$. Khi đó:
>
> $$
> M \cong R^r \oplus R/(d_1) \oplus R/(d_2) \oplus \cdots \oplus R/(d_k)
> $$
>
> với $r \geq 0$ và $d_1, d_2, \ldots, d_k \in R$ không phải unit, $d_i \neq 0$, thỏa:
>
> $$
> d_1 \mid d_2 \mid \cdots \mid d_k
> $$
>
> Dãy $(d_1, d_2, \ldots, d_k)$ (xác định đến associates) gọi là **invariant factors** của $M$. Phân tách này là duy nhất.

Xem chứng minh đầy đủ tại [[a0-structure-theorem-pid|A0. Structure Theorem for Modules over PIDs]].

> [!note] Remark 10.4 — Ý nghĩa các invariant factors
> - $d_k$ = phần tử **cực đại** (bị chia bởi mọi $d_i$) — gọi là **exponent** của module torsion.
> - $d_1$ = **content** nhỏ nhất.
> - Quan hệ $d_1 \mid d_2 \mid \cdots \mid d_k$ đảm bảo tính duy nhất.

---

## Structure Theorem — Elementary Divisor Form

> [!theorem] Theorem 10.5 — Structure Theorem (Elementary Divisor Form)
> Trong cùng điều kiện, $M_{\text{tor}}$ phân tách thành:
>
> $$
> M_{\text{tor}} \cong R/(p_1^{e_1}) \oplus R/(p_2^{e_2}) \oplus \cdots \oplus R/(p_m^{e_m})
> $$
>
> với $p_i$ là các primes (không nhất thiết phân biệt) và $e_i \geq 1$. Các lũy thừa $p_i^{e_i}$ (xác định đến associates và thứ tự) gọi là **elementary divisors** của $M$.

> [!note] Remark 10.6 — Chuyển đổi giữa hai dạng
> Hai dạng tương đương qua Chinese Remainder Theorem: $R/(d) \cong \bigoplus_p R/(p^{v_p(d)})$ khi $d = \prod p^{v_p(d)}$ (phân tích nhân tử trong PID).
>
> - Từ invariant factors $\to$ elementary divisors: phân tích mỗi $d_i$ thành prime powers.
> - Từ elementary divisors $\to$ invariant factors: nhóm theo prime và lấy lcm theo cột.

---

## Ứng dụng 1 — Finitely Generated Abelian Groups

> [!theorem] Theorem 10.7 — Phân loại Finitely Generated Abelian Groups
> Mọi finitely generated abelian group $G$ isomorphic với:
>
> $$
> G \cong \mathbb{Z}^r \oplus \mathbb{Z}/d_1\mathbb{Z} \oplus \cdots \oplus \mathbb{Z}/d_k\mathbb{Z}
> $$
>
> với $d_1 \mid d_2 \mid \cdots \mid d_k$, $d_i \geq 2$.
>
> Hoặc (dạng elementary divisor):
>
> $$
> G \cong \mathbb{Z}^r \oplus \mathbb{Z}/p_1^{e_1}\mathbb{Z} \oplus \cdots \oplus \mathbb{Z}/p_m^{e_m}\mathbb{Z}
> $$

> [!example] Example 10.8 — Phân loại abelian groups bậc 36
> $36 = 2^2 \cdot 3^2$. Các abelian groups hữu hạn bậc $36$ (tức $r = 0$):
>
> **Dạng elementary divisors** (phân theo từng prime):
>
> | $2$-part | $3$-part | Group |
> |----------|----------|-------|
> | $\mathbb{Z}/4$ | $\mathbb{Z}/9$ | $\mathbb{Z}/36$ |
> | $\mathbb{Z}/4$ | $\mathbb{Z}/3 \oplus \mathbb{Z}/3$ | $\mathbb{Z}/4 \oplus \mathbb{Z}/3 \oplus \mathbb{Z}/3$ |
> | $\mathbb{Z}/2 \oplus \mathbb{Z}/2$ | $\mathbb{Z}/9$ | $\mathbb{Z}/2 \oplus \mathbb{Z}/2 \oplus \mathbb{Z}/9$ |
> | $\mathbb{Z}/2 \oplus \mathbb{Z}/2$ | $\mathbb{Z}/3 \oplus \mathbb{Z}/3$ | $\mathbb{Z}/2 \oplus \mathbb{Z}/6 \oplus \mathbb{Z}/6$ |
>
> Vậy có đúng $4$ abelian groups (sai sai isomorphism) bậc $36$.

> [!example] Example 10.9 — Invariant factors của $\mathbb{Z}/2 \oplus \mathbb{Z}/4 \oplus \mathbb{Z}/3$
> Elementary divisors: $2, 4, 3$. Nhóm theo prime:
>
> - Prime $2$: $(2^1, 2^2)$ — ghi theo cột tăng dần.
> - Prime $3$: $(3^1)$.
>
> Lấy lcm theo cột (từ phải): $d_2 = \operatorname{lcm}(4, 3) = 12$, $d_1 = \operatorname{lcm}(2) = 2$.
>
> Kiểm tra: $d_1 = 2 \mid d_2 = 12$. ✓
>
> Vậy invariant factor form: $\mathbb{Z}/2 \oplus \mathbb{Z}/12$.

---

## Ứng dụng 2 — Rational Canonical Form và Jordan Form

Xét $V$ là $k$-vector space hữu hạn chiều và $T : V \to V$ là linear operator. Ta biến $V$ thành $k[x]$-module qua $f(x) \cdot v = f(T)(v)$.

> [!theorem] Theorem 10.10 — Rational Canonical Form
> Với $(V, T)$ như trên, áp dụng Structure Theorem cho $k[x]$-module $V$:
>
> $$
> V \cong k[x]/(f_1) \oplus k[x]/(f_2) \oplus \cdots \oplus k[x]/(f_k)
> $$
>
> với $f_1 \mid f_2 \mid \cdots \mid f_k$ (invariant factors, còn gọi là **invariant factors của $T$**).
>
> Dạng ma trận ứng với phân tích này gọi là **rational canonical form** của $T$, mỗi $k[x]/(f_i)$ ứng với một **companion matrix**.

> [!theorem] Theorem 10.11 — Jordan Canonical Form
> Nếu $k$ algebraically closed (ví dụ $k = \mathbb{C}$), áp dụng dạng elementary divisor:
>
> $$
> V \cong k[x]/((x-\lambda_1)^{e_1}) \oplus \cdots \oplus k[x]/((x-\lambda_m)^{e_m})
> $$
>
> với $\lambda_i \in k$. Đây cho **Jordan canonical form**: mỗi $(x-\lambda)^e$ ứng với một Jordan block $J_e(\lambda)$ kích thước $e \times e$.

> [!example] Example 10.12 — Jordan form qua Structure Theorem
> Cho $T$ có characteristic polynomial $(x-2)^3(x-5)^2$ trên $\mathbb{C}$.
>
> Phần $(x-2)$-primary: elementary divisors là $(x-2)^{e_1}, (x-2)^{e_2}, \ldots$ với $\sum e_i = 3$.
> Phần $(x-5)$-primary: $\sum e_j = 2$.
>
> Nếu minimal polynomial là $(x-2)^2(x-5)$, thì elementary divisors là $(x-2)^2, (x-2), (x-5), (x-5)$, cho Jordan form:
>
> $$
> J = \begin{pmatrix} 2&1&0&0&0 \\ 0&2&0&0&0 \\ 0&0&2&0&0 \\ 0&0&0&5&0 \\ 0&0&0&0&5 \end{pmatrix}
> $$

---

## Tính toán qua Smith Normal Form

Trên thực tế, Structure Theorem được tính toán qua **Smith Normal Form** của ma trận hệ số.

> [!definition] Definition 10.13 — Smith Normal Form
> Cho $A$ là ma trận $m \times n$ với entries trong PID $R$. **Smith Normal Form** của $A$ là ma trận:
>
> $$
> D = \operatorname{diag}(d_1, d_2, \ldots, d_r, 0, \ldots, 0)
> $$
>
> với $d_1 \mid d_2 \mid \cdots \mid d_r$, thu được từ $A$ qua **row và column operations**:
>
> - Hoán vị hai hàng (cột).
> - Nhân một hàng (cột) với unit.
> - Cộng bội nguyên của một hàng (cột) vào hàng (cột) khác.

> [!example] Example 10.14 — Tính Smith Normal Form
> Cho $M$ là $\mathbb{Z}$-module được trình bày bởi generators $\{e_1, e_2, e_3\}$ với relations:
>
> $$
> 2e_1 + 4e_2 = 0, \quad e_1 + e_2 + e_3 = 0
> $$
>
> Ma trận quan hệ (relation matrix):
>
> $$
> A = \begin{pmatrix} 2 & 4 & 0 \\ 1 & 1 & 1 \end{pmatrix}
> $$
>
> Khử về Smith Normal Form (bài toán Euclid trên $\mathbb{Z}$): $D = \operatorname{diag}(1, 2)$.
>
> Vậy $M \cong \mathbb{Z}/(1) \oplus \mathbb{Z}/(2) \oplus \mathbb{Z}^{3-2} = \mathbb{Z}/2\mathbb{Z} \oplus \mathbb{Z}$.

---

## SageMath Cheatsheet

```python
G = AbelianGroup([4, 6, 9])
print(G.invariants())

M = ZZ^3 / ZZ^3.submodule([[2,4,0],[1,1,1]])
print(M.invariants())

M = AbelianGroup([36])
print(M)

A = matrix(ZZ, [[6, 4], [3, 9]])
print(A.smith_form())

MS = MatrixSpace(QQ, 3)
A = MS([[2,1,0],[0,2,0],[0,0,5]])
print(A.rational_form())
print(A.jordan_form())

G = AbelianGroup([2, 4, 3])
print(G.invariants())
```

---

## Summary / Key Takeaways

- **Structure Theorem** (PID): mọi finitely generated module trên PID $\cong$ $R^r \oplus R/(d_1) \oplus \cdots \oplus R/(d_k)$ với $d_1 \mid \cdots \mid d_k$ — phân tích duy nhất.
- **Hai dạng**: invariant factor form (dùng $d_i$) và elementary divisor form (dùng $p^e$) — chuyển đổi qua CRT.
- **Finitely generated abelian groups**: phân loại đầy đủ qua $\mathbb{Z}^r \oplus \mathbb{Z}/d_1 \oplus \cdots \oplus \mathbb{Z}/d_k$.
- Số abelian groups bậc $n = \prod p_i^{a_i}$ bằng $\prod_i P(a_i)$ với $P(a)$ = số phân hoạch của $a$.
- **Linear algebra**: $k[x]$-module $(V,T)$ — Structure Theorem cho Rational Canonical Form (mọi field) và Jordan Form (algebraically closed field).
- **Smith Normal Form**: thuật toán tường minh tính invariant factors qua row/column operations.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 12.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter III §7.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 9.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 2.
