---
title: "16. Abelian Varieties over Finite Fields"
tags: [math, abelian-varieties, lesson-16]
aliases: [Abelian Varieties over Finite Fields]
created: 2026-03-24
---

> **Prerequisites**: [[09-weil-pairings-and-tate-modules|09. Weil Pairings & Tate Modules]], [[10-endomorphism-algebras|10. Endomorphism Algebras]]
> **Objectives**:
> - Hiểu Frobenius endomorphism $\pi_A$ và eigenvalues Weil của nó
> - Nắm Weil conjecture (nay là định lý) cho abelian varieties: $|\alpha_i| = q^{1/2}$
> - Biết zeta function của $A/\mathbb{F}_q$ và quan hệ với char. poly của Frobenius
> - Hiểu Tate's theorem: isogeny $\Leftrightarrow$ same char. poly của Frobenius
> - Định nghĩa Weil $q$-numbers — bước chuẩn bị cho Honda–Tate theory

---

## Motivation / Intuition

Khi abelian variety $A$ được định nghĩa trên trường hữu hạn $\mathbb{F}_q$, có thêm một endomorphism đặc biệt không có analog trong đặc số $0$: **Frobenius endomorphism** $\pi_q : A \to A$.

Frobenius nắm giữ **tất cả** thông tin số học của $A$ trên $\mathbb{F}_q$: số điểm rational $|A(\mathbb{F}_{q^n})|$ cho mọi $n$, cấu trúc endomorphism algebra, và thậm chí cho phép **phân loại** isogeny classes của abelian varieties (Honda–Tate theorem).

Đây là bước đầu tiên trong chuỗi: Frobenius $\to$ Weil numbers $\to$ Honda–Tate $\to$ Complex Multiplication.

---

## Frobenius Endomorphism

> [!abstract] Definition 16.1 — Frobenius Morphism
> Cho $A$ abelian variety trên $\mathbb{F}_q$ với $q = p^r$. **Geometric Frobenius** $\pi_q = \pi_A : A \to A$ là endomorphism xác định trên $\mathbb{F}_q$-points bởi:
>
> $$
> \pi_q : (x_0 : x_1 : \cdots : x_N) \mapsto (x_0^q : x_1^q : \cdots : x_N^q).
> $$
>
> Đây là **endomorphism** của $A$ như abelian variety (không chỉ như variety):
>
> - $\pi_q \in \operatorname{End}_{\mathbb{F}_q}(A)$
> - $\ker(\pi_q - \operatorname{id}) = A(\mathbb{F}_q)$ — tập $\mathbb{F}_q$-rational points.

> [!note] Remark 16.2 — Geometric vs Arithmetic Frobenius
> Có hai convention: **geometric** Frobenius $\pi_q : x \mapsto x^q$ (trên varieties) và **arithmetic** Frobenius $\phi_q : x \mapsto x^{1/q}$ (trên Galois groups). Chúng là inverse của nhau. Ta dùng geometric Frobenius trong các tính toán về abelian varieties.

> [!example] Example 16.3 — Frobenius trên Elliptic Curve
> Với $E : y^2 = x^3 + ax + b$ trên $\mathbb{F}_p$:
>
> $$
> \pi_p(x, y) = (x^p, y^p).
> $$
>
> $E(\mathbb{F}_p) = \ker(\pi_p - [1]) = \{P \in E(\bar{\mathbb{F}}_p) : \pi_p(P) = P\} = \{(x, y) : x^p = x, y^p = y\}$.

---

## Weil Conjecture cho Abelian Varieties

> [!abstract] Theorem 16.4 — Weil Conjecture (Weil 1948, proved for AV)
> Cho $A$ abelian variety chiều $g$ trên $\mathbb{F}_q$. **Characteristic polynomial** của Frobenius $\pi_q$ tác động trên $T_\ell(A)$ ($\ell \neq p$) là:
>
> $$
> f_A(T) = \det(T \cdot \operatorname{id} - \pi_q \mid T_\ell(A)) \in \mathbb{Z}[T],
> $$
>
> là monic polynomial bậc $2g$ với hệ số nguyên, và không phụ thuộc $\ell$.
>
> Hơn nữa, mọi root $\alpha$ của $f_A$ (trong $\mathbb{C}$) thỏa:
>
> $$
> |\alpha| = q^{1/2} \quad (\text{Weil bound}).
> $$

**Proof sketch.** Từ Weil pairing $T_\ell(A) \times T_\ell(A^\vee) \to \mathbb{Z}_\ell(1)$ và tính positive của Rosati involution: nếu $\alpha$ là eigenvalue của $\pi_q$ trên $V_\ell(A)$, thì $q/\alpha$ là eigenvalue của $\pi_q^\dagger = $ Verschiebung. Vậy product $\alpha \cdot (q/\alpha) = q$, tức là $|\alpha|^2 = q$. $\blacksquare$

> [!example] Example 16.5 — Hasse Bound cho Elliptic Curve ($g = 1$)
> Với $E/\mathbb{F}_q$: $f_E(T) = T^2 - tT + q$ với $t = q + 1 - |E(\mathbb{F}_q)|$ (trace của Frobenius). Roots $\alpha, \bar{\alpha}$ với $|\alpha| = \sqrt{q}$, nên $|t| = |\alpha + \bar{\alpha}| \leq 2\sqrt{q}$:
>
> $$
> |q + 1 - |E(\mathbb{F}_q)|| \leq 2\sqrt{q} \quad \text{(Hasse Bound, 1936)}.
> $$

---

## Zeta Function

> [!abstract] Definition 16.6 — Zeta Function của $A/\mathbb{F}_q$
> **Zeta function** của $A$ trên $\mathbb{F}_q$ là:
>
> $$
> Z(A/\mathbb{F}_q, T) = \exp\left( \sum_{n=1}^\infty |A(\mathbb{F}_{q^n})| \frac{T^n}{n} \right).
> $$

> [!abstract] Theorem 16.7 — Zeta Function và Frobenius
> $$
> Z(A/\mathbb{F}_q, T) = \frac{f_A(T)}{(1-T)(1-qT) \cdots} \quad \text{(dạng rational)}.
> $$
>
> Cụ thể:
>
> $$
> |A(\mathbb{F}_{q^n})| = \prod_{i=1}^{2g} (1 - \alpha_i^n),
> $$
>
> trong đó $\alpha_1, \ldots, \alpha_{2g}$ là roots của $f_A$.

**Proof.** $|A(\mathbb{F}_{q^n})| = |\ker(\pi_{q^n} - \operatorname{id})| = \deg(\pi_{q^n} - \operatorname{id}) = \prod_{i=1}^{2g}(1 - \alpha_i^n)$ (từ char. poly và Weil). $\blacksquare$

> [!example] Example 16.8
> Với $E/\mathbb{F}_5$ có trace Frobenius $t = 2$: $f_E(T) = T^2 - 2T + 5$. Roots $\alpha, \bar{\alpha}$ với $|\alpha| = \sqrt{5}$.
>
> $|E(\mathbb{F}_{5^n})| = (1 - \alpha^n)(1 - \bar{\alpha}^n) = 1 - (\alpha^n + \bar{\alpha}^n) + 5^n$.
>
> $|E(\mathbb{F}_5)| = 1 - 2 + 5 = 4$. Kiểm tra: $5 + 1 - 2 = 4$. ✓

---

## Tate's Theorem: Isogeny $\Leftrightarrow$ Same Frobenius

> [!abstract] Theorem 16.9 — Tate's Theorem (1966)
> Cho $A, B$ abelian varieties trên $\mathbb{F}_q$. Các điều kiện sau tương đương:
>
> 1. $A$ và $B$ là $\mathbb{F}_q$-isogenous.
> 2. $f_A = f_B$ (cùng char. poly của Frobenius).
> 3. $T_\ell(A) \cong T_\ell(B)$ như $G_{\mathbb{F}_q}$-modules.
>
> Hơn nữa, $A$ là simple $\Leftrightarrow$ $f_A$ là **lũy thừa của một polynomial không thể phân tích** (irreducible power).

**Proof.** $(1) \Rightarrow (2)$: Isogeny preserve eigenvalues (Tate module functorial). $(2) \Rightarrow (3)$: Semisimplicity của Tate module (Zarhin 1975 cho đặc số $p > 0$). $(3) \Rightarrow (1)$: Tate conjecture for finite fields — Tate 1966. $\blacksquare$

> [!note] Remark 16.10 — Tầm quan trọng
> Tate's theorem nói: trên $\mathbb{F}_q$, **isogeny class của $A$ được xác định hoàn toàn bởi $f_A$**. Và $f_A$ là một polynomial với hệ số nguyên — có thể tính được! Đây là một kết quả phi thường: thay vì phân loại "geometric" objects (abelian varieties), ta phân loại "algebraic" objects (polynomials).

---

## Weil $q$-Numbers

> [!abstract] Definition 16.11 — Weil $q$-Number
> Một **Weil $q$-number** (hay $q$-Weil integer) là algebraic integer $\pi \in \bar{\mathbb{Q}}$ sao cho với mọi embedding $\sigma : \mathbb{Q}(\pi) \hookrightarrow \mathbb{C}$:
>
> $$
> |\sigma(\pi)| = q^{1/2}.
> $$
>
> Hai Weil $q$-numbers $\pi, \pi'$ **conjugate** nếu $\mathbb{Q}(\pi) \cong \mathbb{Q}(\pi')$ gửi $\pi \mapsto \pi'$.

> [!example] Example 16.12 — Weil $p$-Numbers
> - $\pi = \sqrt{p}$: $|\sqrt{p}| = p^{1/2}$. ✓ Đây là Weil $p$-number thực.
> - $\pi = e^{i\theta} \sqrt{p}$: $|e^{i\theta}\sqrt{p}| = \sqrt{p}$. ✓ Complex Weil numbers.
> - $\pi = p$: $|p| = p \neq p^{1/2}$. ✗ Không phải Weil $p$-number.
>
> Trên $\mathbb{F}_p$, elliptic curve có $\pi \in \mathbb{Z}[i\sqrt{p-1}]$... các trường hợp khác nhau tương ứng Albert types khác nhau.

> [!abstract] Theorem 16.13 — Weil Numbers và Abelian Varieties
> Frobenius của AV simple over $\mathbb{F}_q$ là Weil $q$-number (Theorem 16.4). Ngược lại:
>
> - $\pi$ **effective** nếu $\pi = \pi_A$ cho một AV $A/\mathbb{F}_q$.
> - **Honda-Tate Theorem** (Lesson 17): mọi Weil $q$-number đều effective.

---

## Phân Loại theo Frobenius: Ordinary vs Supersingular

> [!abstract] Definition 16.14 — Ordinary và Supersingular
> Cho $A$ abelian variety chiều $g$ trên $\mathbb{F}_q$ với $q = p^r$:
>
> - $A$ là **ordinary** nếu $p$-rank $= g$ (tức là $A[p](\bar{\mathbb{F}}_q) \cong (\mathbb{Z}/p\mathbb{Z})^g$).
> - $A$ là **supersingular** nếu $p$-rank $= 0$.
>
> Equivalently: $A$ ordinary $\Leftrightarrow$ $f_A \not\equiv 0 \pmod{p}$ tại $T = 0$ $\Leftrightarrow$ trace Frobenius $t \not\equiv 0 \pmod{p}$ (khi $g = 1$).

> [!example] Example 16.15 — Supersingular Elliptic Curves
> Với $E/\mathbb{F}_p$ ($p$ nguyên tố):
>
> - $E$ supersingular $\Leftrightarrow$ $|E(\mathbb{F}_p)| = p + 1$ $\Leftrightarrow$ trace $t = 0$ $\Leftrightarrow$ $f_E(T) = T^2 + p$.
> - Số supersingular $j$-values: $\approx (p-1)/12$ (finite!).
> - Supersingular curves có $j \in \mathbb{F}_{p^2}$.
> - $\operatorname{End}^0(E) \cong B_{p,\infty}$ (definite quaternion algebra, Albert type III).

---

## Số Điểm và Applications

> [!abstract] Theorem 16.16 — Counting Points
> Với $A/\mathbb{F}_q$ abelian variety, $f_A(T) = \prod_{i=1}^{2g}(T - \alpha_i)$:
>
> $$
> |A(\mathbb{F}_{q^n})| = \prod_{i=1}^{2g}(1 - \alpha_i^n) = f_A(1) \cdot \text{(more complex formula for } n > 1\text{)}.
> $$
>
> Đặc biệt: $|A(\mathbb{F}_q)| = f_A(1) = \prod_{i=1}^{2g}(1 - \alpha_i)$.

> [!example] Example 16.17 — Counting Points trên Jacobian
> Cho $C/\mathbb{F}_q$ genus $g$ curve với Frobenius eigenvalues $\alpha_1, \ldots, \alpha_g, \bar{\alpha}_1, \ldots, \bar{\alpha}_g$:
>
> $$
> |C(\mathbb{F}_{q^n})| = q^n + 1 - \sum_{i=1}^g (\alpha_i^n + \bar{\alpha}_i^n).
> $$
>
> $$
> |J(C)(\mathbb{F}_q)| = \prod_{i=1}^g (1 - \alpha_i)(1 - \bar{\alpha}_i) = \prod_{i=1}^g (1 - \alpha_i - \bar{\alpha}_i + q).
> $$

---

## SageMath Cheatsheet

```python
# Frobenius endomorphism và characteristic polynomial
E = EllipticCurve(GF(101), [1, 2])
trace = E.trace_of_frobenius()
q = 101
charpoly = E.frobenius_polynomial()
print(f"E/F_{q}: f_E(T) = {charpoly}")
print(f"Trace of Frobenius = {trace}")
print(f"|E(F_{q})| = q + 1 - trace = {q + 1 - trace}")
print(f"Weil bound: |trace| = {abs(trace)} ≤ 2√{q} ≈ {float(2*sqrt(q)):.2f}")
```

```python
# Tate's theorem: isogeny class determined by char poly
# Hai E trên F_p isogenous <=> same number of points
p = 101
same_count = {}
for a4 in range(5):
    for a6 in range(5):
        try:
            E = EllipticCurve(GF(p), [a4, a6])
            n = E.order()
            if n not in same_count:
                same_count[n] = []
            same_count[n].append((a4, a6))
        except:
            pass

# Tìm ví dụ với cùng order (isogenous)
for n, curves in same_count.items():
    if len(curves) > 1:
        print(f"|E(F_{p})| = {n}: có {len(curves)} curves với cùng count")
        print(f"  Ví dụ: {curves[:2]} (isogenous!)")
        break
```

```python
# Weil numbers: eigenvalues của Frobenius
E = EllipticCurve(GF(101), [1, 2])
charpoly = E.frobenius_polynomial()
roots = charpoly.roots(CC)
for r, mult in roots:
    alpha = complex(r)
    print(f"  alpha = {alpha:.4f}, |alpha| = {abs(alpha):.4f}, sqrt(q) = {float(sqrt(101)):.4f}")
    print(f"  Weil number: {abs(abs(alpha) - float(sqrt(101))) < 0.001}")
```

```python
# Zeta function và counting
# |A(F_{q^n})| = prod_i (1 - alpha_i^n)
E = EllipticCurve(GF(7), [1, 1])
trace = E.trace_of_frobenius()
q = 7
print(f"E/F_7: trace = {trace}")
print(f"\n|E(F_{{7^n}})| for n=1,...,5:")
for n in range(1, 6):
    count = E.base_extend(GF(7^n)).order()
    print(f"  n={n}: |E(F_{{7^{n}}})| = {count}")
```

```python
# Ordinary vs supersingular
p = 17
print(f"Elliptic curves over F_{p}:")
for a4 in range(4):
    for a6 in range(4):
        try:
            E = EllipticCurve(GF(p), [a4, a6])
            trace = E.trace_of_frobenius()
            is_ss = (trace % p == 0)
            if is_ss:
                print(f"  E=[{a4},{a6}]: |E|={E.order()}, trace={trace}, SUPERSINGULAR")
        except:
            pass
print("Ordinary curves: trace ≢ 0 (mod p)")
```

---

## Summary / Key Takeaways

- **Frobenius** $\pi_q \in \operatorname{End}_{\mathbb{F}_q}(A)$: endomorphism từ raising coordinates to $q$-th power; $\ker(\pi_q - \operatorname{id}) = A(\mathbb{F}_q)$.
- **Char. poly** $f_A(T) = \det(T - \pi_q | T_\ell(A)) \in \mathbb{Z}[T]$ bậc $2g$, không phụ thuộc $\ell$.
- **Weil bound**: mọi root $\alpha_i$ của $f_A$ thỏa $|\alpha_i| = q^{1/2}$.
- **Zeta function**: $|A(\mathbb{F}_{q^n})| = \prod_i (1 - \alpha_i^n)$; $|A(\mathbb{F}_q)| = f_A(1)$.
- **Tate's theorem**: $A \sim_{\mathbb{F}_q} B$ (isogenous over $\mathbb{F}_q$) $\Leftrightarrow$ $f_A = f_B$. Isogeny class = polynomial.
- **Weil $q$-number**: algebraic integer $\pi$ với $|\sigma(\pi)| = q^{1/2}$ cho mọi embedding.
- **Ordinary** ($p$-rank $= g$, $t \not\equiv 0 \pmod{p}$) vs **Supersingular** ($p$-rank $= 0$, $t \equiv 0 \pmod{p}$).
- **Supersingular $g=1$**: $|E(\mathbb{F}_p)| = p + 1$; $j \in \mathbb{F}_{p^2}$; $\operatorname{End}^0(E) = B_{p,\infty}$ (quaternion).
- Chuẩn bị cho Honda–Tate: mọi Weil $q$-number là Frobenius của một AV simple over $\mathbb{F}_q$.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §§15–17 (Abelian Varieties over Finite Fields, Zeta Function).
- Tate, J. *Endomorphisms of abelian varieties over finite fields*, Invent. Math. (1966).
- Oort, F. *Abelian Varieties over Finite Fields*, AWS 2024 lecture notes.
- Dembélé, L. *Abelian Varieties over Finite Fields: Honda–Tate's Theorem*, AWS 2024.
