---
title: "11. The Multiplication-by-n Map"
tags: [math, abelian-varieties, module-01, lesson-11]
aliases: [Multiplication by n Map n-Torsion]
created: 2026-05-18
---

> **Prerequisites**: [[10-translation-maps-morphisms|10. Translation Maps and Morphisms of Abelian Varieties]]
> **Objectives**:
> - Định nghĩa và phân tích endomorphism $[n]: A \to A$
> - Tính degree của $[n]$ và khi nào $[n]$ là separable
> - Xác định cấu trúc nhóm của $n$-torsion $A[n]$
> - Hiểu ảnh hưởng của characteristic của trường lên $A[n]$

---

## Motivation / Intuition

Trên nhóm abelian bất kỳ, phép nhân $[n]: x \mapsto nx$ là endomorphism cơ bản nhất. Trên abelian variety, map $[n]: A \to A$ này không chỉ là endomorphism của nhóm mà còn là **morphism of varieties** — và đây là một morphism rất phong phú về mặt hình học.

Câu hỏi trung tâm: **$[n]$ làm gì?** Trả lời:
1. $[n]$ là surjective (lên phần $\bar{k}$-points).
2. Kernel của $[n]$ là $A[n]$ — tập các **$n$-torsion points** (điểm bị "giết" bởi $n$).
3. Cấu trúc của $A[n]$ phụ thuộc vào quan hệ giữa $n$ và $\operatorname{char}(k)$.

Trong cryptography, bạn đã làm việc với $E[n]$ cho elliptic curve: với $E/\mathbb{F}_p$ và $\gcd(n, p) = 1$, thì $E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$. Bài này tổng quát hóa điều này lên abelian variety tùy ý chiều $g$: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$.

---

## Định Nghĩa Và Tính Chất Cơ Bản

> [!definition] Definition 11.1 — Multiplication-by-$n$ Map
> Cho $A$ là abelian variety và $n \in \mathbb{Z}$. **Multiplication-by-$n$ map** là:
>
> $$
> [n]: A \to A
> $$
>
> định nghĩa bởi:
>
> $$
> [n](x) = \underbrace{x + x + \cdots + x}_{n \text{ lần}} \quad (n > 0)
> $$
>
> $$
> [0](x) = 0_A, \quad [-n](x) = [n](-x) = -\underbrace{x + \cdots + x}_{n \text{ lần}} \quad (n < 0)
> $$

> [!theorem] Theorem 11.2 — $[n]$ Là Endomorphism
> Với mọi $n \in \mathbb{Z}$, $[n]: A \to A$ là một **endomorphism of abelian varieties** (morphism of varieties thỏa group law).

**Proof.** Vì $A$ giao hoán, $[n](x + y) = n(x + y) = nx + ny = [n](x) + [n](y)$. Suy ra $[n]$ là group homomorphism. Theo Theorem 10.7 (morphism gửi $0 \to 0$, vì $[n](0_A) = 0_A$), $[n]$ là homomorphism. $\blacksquare$

---

## Degree Của $[n]$

> [!theorem] Theorem 11.3 — Degree Của $[n]$
> Cho $A$ là abelian variety of dimension $g$. Với mọi $n \neq 0$:
>
> $$
> \deg([n]) = n^{2g}
> $$
>
> Đặc biệt, với elliptic curve ($g = 1$): $\deg([n]) = n^2$.

**Proof sketch.** Proof đầy đủ cần dùng lý thuyết Tate module (Bài 20-22). Intuition từ elliptic curves: $[n]$ là rational map của degree $n^2$, có thể kiểm tra bằng division polynomials.

Một phương pháp khác (abstract): dùng Theorem of the Square (Bài 12) để tính $\deg([n])$ bằng cách biểu diễn $[n]$ qua line bundles. Kết quả $\deg([n]) = n^{2g}$ là analog đại số của công thức $|\mathbb{Z}^{2g}/n\mathbb{Z}^{2g}| = n^{2g}$ trong trường hợp phức. $\blacksquare$

> [!example] Example 11.4 — Degree Trên Elliptic Curve
> Cho $E: y^2 = x^3 + ax + b$ và map $[2]: E \to E$ (nhân đôi).
>
> Công thức nhân đôi cho $P = (x, y)$ với $2P = (x_3, y_3)$:
>
> $$
> \lambda = \frac{3x^2 + a}{2y}, \quad x_3 = \lambda^2 - 2x, \quad y_3 = \lambda(x - x_3) - y
> $$
>
> Tử số của tọa độ $x_3$ là đa thức bậc $4$ trong $x$ (sau khi đặt $y^2 = x^3 + ax + b$). Vậy $\deg([2]) = 4 = 2^2$. ✓
>
> Tổng quát: $\deg([n]) = n^2$ cho elliptic curve. Với abelian surface ($g = 2$): $\deg([n]) = n^4$.

---

## Separability Của $[n]$

> [!definition] Definition 11.5 — Separable vs. Inseparable Morphism
> Cho $f: A \to B$ là morphism surjective (non-constant) giữa varieties. Phân tách đại số:
>
> $$
> f = f_{\text{sep}} \circ \pi^{e}
> $$
>
> trong đó $\pi = \pi_A: A \to A^{(p)}$ là **Frobenius morphism** (với $p = \operatorname{char}(k)$) và $f_{\text{sep}}$ là **separable part** (flat, generic étale).
>
> $f$ được gọi là **separable** nếu $e = 0$ (không có nhân tố Frobenius).
>
> **Inseparable degree** $\deg_i(f) = p^e$, **separable degree** $\deg_s(f) = \deg(f)/\deg_i(f)$.
>
> Với morphism separable: $|\ker(f)(\bar{k})| = \deg_s(f) = \deg(f)$.

> [!theorem] Theorem 11.6 — Separability Của $[n]$
> Cho $A$ là abelian variety trên $k$ với $\operatorname{char}(k) = p \geq 0$.
>
> - Nếu $\gcd(n, p) = 1$ (hoặc $p = 0$): $[n]$ là **separable**. Suy ra $|A[n](\bar{k})| = \deg([n]) = n^{2g}$.
> - Nếu $p \mid n$ (đặc biệt $n = p^r$): $[n]$ là **inseparable** (thuần túy không separable hoặc một phần). Suy ra $|A[n](\bar{k})| < n^{2g}$.

**Proof.** (Cho elliptic curve, $g = 1$)

Differential map của $[n]$ tại $0$: $d[n]_0: T_0 A \to T_0 A$ là nhân với $n$ (trên $k$-vector space chiều $g$). Nếu $n \neq 0$ trong $k$ (tức $\gcd(n, p) = 1$), thì $d[n]_0$ là isomorphism, nên $[n]$ smooth, nên separable.

Nếu $p \mid n$: $d[n]_0$ là nhân với $n = 0$ trong $k$, tức zero map, nên $[n]$ không smooth → có inseparable factor. $\blacksquare$

---

## Cấu Trúc Nhóm Của $A[n]$

> [!definition] Definition 11.7 — $n$-Torsion Subgroup
> Với $n \geq 1$:
>
> $$
> A[n] = \ker([n]: A \to A) = \{P \in A(\bar{k}) \mid [n](P) = 0_A\}
> $$
>
> Đây là **$n$-torsion subgroup** (nhóm con $n$-xoắn) của $A$.

> [!theorem] Theorem 11.8 — Cấu Trúc Của $A[n]$ Khi $\gcd(n, p) = 1$
> Cho $A$ là abelian variety of dimension $g$ trên $k$ với $\operatorname{char}(k) = p$. Nếu $\gcd(n, p) = 1$, thì:
>
> $$
> A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
> $$
>
> như nhóm abelian. Đặc biệt $|A[n]| = n^{2g}$.

**Proof sketch.** Xem [[a1-torsion-structure-proof|A1. Proof: Structure of $A[n]$]].

Ý tưởng chính: giải bài toán cho các $n = \ell^k$ với $\ell \neq p$ prime (theo Chinese Remainder Theorem, đủ với prime powers).

Với $n = \ell$ prime: vì $[\ell]$ là separable ($\gcd(\ell, p) = 1$), $|A[\ell](\bar{k})| = \deg([\ell]) = \ell^{2g}$. Mỗi phần tử của $A[\ell]$ có order $\ell$ (hoặc $1$). Do đó $A[\ell] \cong (\mathbb{Z}/\ell\mathbb{Z})^r$ cho $r$ nào đó. Vì $|A[\ell]| = \ell^{2g}$, suy ra $r = 2g$.

Với $n = \ell^k$: thực hiện quy nạp. $\blacksquare$

---

### Trường Hợp $p \mid n$: Behavior Khác Biệt

> [!theorem] Theorem 11.9 — Cấu Trúc Của $A[p^r]$
> Cho $\operatorname{char}(k) = p > 0$ và $A$ là abelian variety of dimension $g$.
>
> Với $r \geq 1$:
>
> $$
> A[p^r] \cong (\mathbb{Z}/p^r\mathbb{Z})^f \oplus (\text{group scheme không étale})
> $$
>
> trong đó $0 \leq f \leq g$. Số $f$ gọi là **$p$-rank** của $A$.
>
> - Nếu $f = g$: $A$ là **ordinary** (thông thường). $A[p] \cong (\mathbb{Z}/p\mathbb{Z})^g \times (\mu_p)^g$ (as group scheme).
> - Nếu $f = 0$: $A$ là **supersingular**. $A[p](\bar{k}) = \{0\}$.

> [!example] Example 11.10 — Elliptic Curve: Ordinary vs. Supersingular
> Cho $E/\mathbb{F}_p$:
>
> - **Ordinary**: $E[p] \cong \mathbb{Z}/p\mathbb{Z}$ (có đúng $p$ điểm $p$-torsion visible).
> - **Supersingular**: $E[p](\bar{\mathbb{F}}_p) = \{O\}$ (không có điểm $p$-torsion ngoài identity).
>
> Ví dụ supersingular: $E: y^2 = x^3 - x$ trên $\mathbb{F}_p$ với $p \equiv 3 \pmod{4}$.
>
> Ví dụ ordinary: $E: y^2 = x^3 - x$ trên $\mathbb{F}_p$ với $p \equiv 1 \pmod{4}$.

---

## $A[n]$ Như Bảng Tóm Tắt

| Điều kiện | $|A[n](\bar{k})|$ | Cấu trúc | Tên gọi |
|---|---|---|---|
| $\gcd(n, p) = 1$ | $n^{2g}$ | $(\mathbb{Z}/n)^{2g}$ | Full $n$-torsion |
| $n = p$, $A$ ordinary | $p^g$ | $(\mathbb{Z}/p)^g$ | Ordinary $p$-torsion |
| $n = p$, $A$ supersingular | $1$ | $\{0\}$ | No $p$-torsion |
| $n = p^r$, general | $p^{rf}$ | $(\mathbb{Z}/p^r)^f \oplus \ldots$ | Mixed |

---

## Ví Dụ Tính Toán

> [!example] Example 11.11 — Tính $E[3]$ Trên $\mathbb{F}_{97}$
> Cho $E: y^2 = x^3 + 1$ trên $\mathbb{F}_{97}$ (với $\operatorname{char} = 97 \neq 3$).
>
> Vì $\gcd(3, 97) = 1$: $E[3] \cong \mathbb{Z}/3 \times \mathbb{Z}/3$ (9 điểm trên $\bar{\mathbb{F}}_{97}$).
>
> Trong SageMath: không phải tất cả 9 điểm đều defined over $\mathbb{F}_{97}$ — một số chỉ tồn tại trên extension $\mathbb{F}_{97^k}$ với $k > 1$.

> [!example] Example 11.12 — Division Polynomials Cho $[n]$ Trên Elliptic Curve
> Trên $E: y^2 = x^3 + ax + b$, tọa độ của $[n](P) = (x_n, y_n)$ với $P = (x, y)$ được cho bởi:
>
> $$
> x([n]P) = \frac{\phi_n(x, y)}{\psi_n(x, y)^2}, \quad y([n]P) = \frac{\omega_n(x, y)}{\psi_n(x, y)^3}
> $$
>
> trong đó $\psi_n \in \mathbb{Z}[x, y, a, b]$ là **division polynomial** (đa thức chia) của order $n$.
>
> $\ker([n]) = E[n]$ = tập nghiệm của $\psi_n(x, y) = 0$ trong $E(\bar{k})$.
>
> Degree của $\psi_n$ trong $x$: $\deg_x(\psi_n^2) = n^2 - 1$, phản ánh $|E[n]| = n^2$ (trừ đi điểm $O$).

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(97), [0, 1])

E_bar = E.base_extend(GF(97**6))
n = 3
three_torsion = [P for P in E_bar.points() if n*P == E_bar(0)]
print(f"|E[3]| over F_97^6 = {len(three_torsion)}")

div_poly_2 = E.division_polynomial(2)
print("Division polynomial psi_2:", div_poly_2)
div_poly_3 = E.division_polynomial(3)
print("Division polynomial psi_3:", div_poly_3)

print("deg([2]) = 4:", E.multiplication_by_m_isogeny(2).degree())
print("deg([3]) = 9:", E.multiplication_by_m_isogeny(3).degree())

p = 97
E_p = EllipticCurve(GF(p), [0, 1])
p_torsion = [P for P in E_p.points() if p*P == E_p(0)]
print(f"|E[p]| over F_p = {len(p_torsion)}")
```

---

## Summary / Key Takeaways

- $[n]: A \to A$ là endomorphism of abelian varieties với $\deg([n]) = n^{2g}$ (chiều $g$).
- $[n]$ là **separable** khi và chỉ khi $\gcd(n, \operatorname{char}(k)) = 1$.
- $A[n] = \ker([n])$ là $n$-torsion subgroup.
- Khi $\gcd(n, p) = 1$: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ — cấu trúc đẹp và đầy đủ.
- Khi $p \mid n$: $A[n]$ bé hơn, phụ thuộc vào **$p$-rank** $f \in [0, g]$. Ordinary: $f = g$; supersingular: $f = 0$.
- Trên elliptic curve: $[n]$ cho bởi **division polynomials** $\psi_n$; kernel là tập nghiệm.
- $A[n]$ là viên gạch để xây dựng **Tate module** $T_\ell(A)$ ở Module 3 — công cụ mạnh nhất của lý thuyết.

---

## References

- Mumford, D. *Abelian Varieties*, Chapter III, §6 (The $n$-th power map). Oxford University Press, 1970.
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, §III.4 (Torsion subgroups), §III.6 (Division polynomials).
- MIT 18.783, Lecture 6–7 (Separability, $n$-torsion structure). [https://math.mit.edu/classes/18.783/2019/LectureNotes7.pdf](https://math.mit.edu/classes/18.783/2019/LectureNotes7.pdf)
- Contemporary Mathematics: *A short guide to $p$-torsion of abelian varieties in characteristic $p$*. [https://www.math.colostate.edu/~pries/](https://www.math.colostate.edu/~pries/)
