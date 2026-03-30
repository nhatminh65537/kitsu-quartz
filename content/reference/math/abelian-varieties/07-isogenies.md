---
title: "07. Isogenies"
tags: [math, abelian-varieties, lesson-07]
aliases: [Isogenies]
created: 2026-03-24
---

> **Prerequisites**: [[06-abelian-varieties-are-projective|06. Abelian Varieties are Projective]], [[03-definitions-and-basic-properties|03. Definitions & Basic Properties]]
> **Objectives**:
> - Định nghĩa isogeny và nắm vững các tính chất cơ bản: surjective, finite kernel, same dimension
> - Hiểu degree và dual isogeny — công cụ "đảo chiều" một isogeny
> - Nắm cấu trúc torsion $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ và phân biệt đặc số 0 vs $p$
> - Biết $p$-rank và Frobenius isogeny trong đặc số $p > 0$
> - Hiểu isogeny category — ngôn ngữ làm việc "up to finite kernel"

---

## Motivation / Intuition

Trong lý thuyết nhóm, hai nhóm "gần giống nhau" nếu có homomorphism surjective giữa chúng với kernel hữu hạn. Trong thế giới abelian varieties, khái niệm tương đương là **isogeny** — morphism $f : A \to B$ surjective với finite kernel.

Isogeny quan trọng vì nó:

1. **Bảo toàn cấu trúc cơ bản** ($\dim A = \dim B$, torsion gần như giống nhau).
2. **Có tính khả nghịch "up to $\mathbb{Q}$"**: nếu $f : A \to B$ isogeny thì $\exists n$ và $g : B \to A$ isogeny sao cho $g \circ f = [n]_A$. Vậy isogenies là isomorphisms trong **isogeny category** $\operatorname{AV} \otimes \mathbb{Q}$.
3. **Phân loại torsion**: cấu trúc $A[n]$ là bất biến quan trọng, kiểm soát bởi isogenies $[n] : A \to A$.

Ví dụ điển hình từ elliptic curves: phép nhân đôi $[2] : E \to E$ là isogeny với $\ker([2]) = E[2] \cong (\mathbb{Z}/2\mathbb{Z})^2$ (4 điểm). Tương tự, $[n] : A \to A$ là isogeny với $\ker([n]) = A[n]$.

---

## Định nghĩa và Tính Chất Cơ Bản

> [!abstract] Definition 7.1 — Isogeny
> Cho $A, B$ là abelian varieties trên trường $k$. Một **isogeny** là morphism $f : A \to B$ thỏa:
>
> 1. $f$ là surjective (như morphism của varieties).
> 2. $\ker(f)$ là **finite group scheme** (scheme-theoretic kernel hữu hạn).
>
> Equivalently trên $\bar{k}$ đặc số $0$: $f$ là group homomorphism surjective với $|\ker f(\bar{k})| < \infty$.
>
> **Degree** của $f$ là $\deg(f) = |\ker(f)|$ (rank của finite group scheme $\ker f$).

> [!abstract] Proposition 7.2 — Isogeny bảo toàn chiều
> Nếu $f : A \to B$ là isogeny thì $\dim A = \dim B$.

**Proof.** Fiber của $f$ tại mọi điểm $b \in B$ là coset $f^{-1}(b) = $ translate của $\ker(f)$, hữu hạn. Vậy $\dim A = \dim B + \dim(\text{fiber}) = \dim B + 0 = \dim B$. $\blacksquare$

> [!abstract] Proposition 7.3 — Homomorphism surjective $\Leftrightarrow$ Isogeny
> Với abelian varieties $A, B$, một group homomorphism $f : A \to B$ là isogeny khi và chỉ khi $f$ surjective với finite kernel. Trên trường đặc số $0$ hay khi $f$ separable, điều này tương đương $f$ surjective và $\ker(f)(\bar{k})$ hữu hạn.

> [!example] Example 7.4 — Multiplication-by-$n$ là Isogeny
> Map $[n] : A \to A$ với $n \neq 0$ là isogeny với $\deg([n]) = n^{2g}$.
>
> **Proof.** Từ Theorem 5.7, $[n]^* \mathcal{L} \cong \mathcal{L}^{n^2}$ với $\mathcal{L}$ ample symmetric. Vậy $[n]$ kéo ample thành ample $\Rightarrow$ $[n]$ quasi-finite. Vì $A$ connected và $[n]$ là group homomorphism, $[n]$ surjective. Degree là $n^{2g}$ (từ lý thuyết intersection). $\blacksquare$

> [!warning] Counterexample 7.5 — Không phải mọi homomorphism là isogeny
> Zero map $0 : A \to B$ là group homomorphism nhưng **không** surjective (trừ khi $B = 0$). Map $A \to B = 0$ là isogeny khi và chỉ khi $A = 0$.

---

## Dual Isogeny

> [!abstract] Theorem 7.6 — Tồn tại Dual Isogeny
> Cho $f : A \to B$ isogeny degree $n$. Tồn tại duy nhất isogeny $f^\vee : B \to A$ (gọi là **dual isogeny**) sao cho:
>
> $$
> f^\vee \circ f = [n]_A \qquad \text{và} \qquad f \circ f^\vee = [n]_B.
> $$
>
> Hơn nữa, $\deg(f^\vee) = \deg(f) = n$.

**Proof sketch.** Xét $[n]_A : A \to A$. Vì $\ker(f) \subseteq A[n] = \ker([n]_A)$ (bởi $A[n]$ là $n$-torsion và $f$ map $\ker(f)$ sang $0$, và $[n]_A$ map $A[n]$ sang $0$), tồn tại factoring $[n]_A = f^\vee \circ f$ cho $f^\vee : B \to A$ duy nhất. Kiểm tra $f \circ f^\vee = [n]_B$ bằng cách kiểm tra trên $\bar{k}$-points. $\blacksquare$

> [!example] Example 7.7 — Dual isogeny của $[n]$
> Dual của $[n] : A \to A$ là chính $[n]$: $([ n])^\vee = [n]$.
>
> **Kiểm tra**: $[n] \circ [n] = [n^2] = [n]_{A}$ với $n^2 = \deg([n]) = n^{2g}$... Hmm, chú ý: $f^\vee \circ f = [n]_A$ với $n = \deg(f)$, không phải $n$ trong $[n]$. Với $f = [m]$, $\deg(f) = m^{2g}$, nên $f^\vee \circ f = [m^{2g}]_A$. Điều này cho $([m])^\vee = [m^{2g-1}]$ trên abelian variety chiều $g$ — nhưng đây không đúng.
>
> Trường hợp $g = 1$ (elliptic curve): $\deg([m]) = m^2$, dual của $[m]$ là $[m]$ vì $[m] \circ [m] = [m^2]$. ✓

> [!note] Remark 7.8
> Dual isogeny là "isogeny nghịch đảo lên tới bội số $n$". Trong **isogeny category** ($\operatorname{Hom}$ tensor với $\mathbb{Q}$), dual isogeny $\frac{1}{n} f^\vee$ là isomorphism nghịch đảo của $f$.

---

## Cấu Trúc Torsion

### Trường hợp đặc số 0

> [!abstract] Theorem 7.9 — $n$-Torsion trên $\bar{k}$ (đặc số $0$)
> Cho $A$ abelian variety chiều $g$ trên trường $k$ với $\operatorname{char}(k) = 0$. Với mọi $n \geq 1$:
>
> $$
> A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}.
> $$
>
> Đặc biệt, $|A[n](\bar{k})| = n^{2g}$.

**Proof sketch.** Bằng quy nạp trên $n$. Trường hợp $n = \ell$ nguyên tố: từ surjectivity của $[\ell] : A \to A$ và $\deg([\ell]) = \ell^{2g}$, ta có $|A[\ell](\bar{k})| = \ell^{2g}$. Vì $A[\ell](\bar{k})$ là group abelian mà mọi phần tử có order $\ell$, ta có $A[\ell](\bar{k}) \cong (\mathbb{Z}/\ell\mathbb{Z})^r$ với $r \leq 2g$. Mặt khác, từ analytic uniformization $A(\mathbb{C}) = \mathbb{C}^g/\Lambda$ (đặc số $0$), $A[n](\mathbb{C}) = \frac{1}{n}\Lambda/\Lambda \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ (Proposition 4.14). $\blacksquare$

### Trường hợp đặc số $p > 0$

> [!abstract] Theorem 7.10 — $n$-Torsion trong đặc số $p$
> Cho $A$ abelian variety chiều $g$ trên trường $k$, $\operatorname{char}(k) = p > 0$.
>
> - Nếu $\gcd(n, p) = 1$: $A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ (cùng như đặc số $0$).
> - Nếu $n = p^m$: $A[p^m](\bar{k}) \cong (\mathbb{Z}/p^m\mathbb{Z})^f$ với $0 \leq f \leq g$.
>
> Số nguyên $f$ gọi là **$p$-rank** của $A$ (không phụ thuộc $m$).

> [!abstract] Definition 7.11 — $p$-Rank
> $p$-rank của abelian variety $A$ trên trường đặc số $p$ là số nguyên $f = f(A)$ với $0 \leq f \leq g$ sao cho $A[p](\bar{k}) \cong (\mathbb{Z}/p\mathbb{Z})^f$.
>
> - $f = g$: $A$ được gọi là **ordinary** (phổ biến nhất khi $g = 1$).
> - $f = 0$: $A$ được gọi là **supersingular** (cực kỳ đặc biệt — có nhiều endomorphisms).
> - $0 < f < g$: trường hợp trung gian.

> [!example] Example 7.12 — Elliptic curves và $p$-rank
> Với elliptic curve $E$ trên $\mathbb{F}_p$: $E[p](\bar{\mathbb{F}}_p)$ hoặc $\cong \mathbb{Z}/p\mathbb{Z}$ ($p$-rank $1$, ordinary) hoặc $= \{0\}$ ($p$-rank $0$, supersingular).
>
> Đặc trưng của supersingular: $j$-invariant $j(E) \in \mathbb{F}_{p^2}$ (chỉ hữu hạn nhiều giá trị!), và $\operatorname{End}(E) \otimes \mathbb{Q}$ là **quaternion algebra** (không giao hoán!) thay vì imaginary quadratic field.

---

## Frobenius Isogeny

Trong đặc số $p > 0$, có một isogeny không có analog trong đặc số $0$:

> [!abstract] Definition 7.13 — Frobenius Isogeny
> Cho $A$ abelian variety trên $\mathbb{F}_q$ với $q = p^r$. **Frobenius morphism** $\pi : A \to A^{(p)}$ là morphism gửi mọi coordinate $(x_0 : x_1 : \cdots)$ sang $(x_0^p : x_1^p : \cdots)$.
>
> Trên $\mathbb{F}_q$ (với $q = p^r$), **arithmetic Frobenius** $\phi_q : A \to A$ là $\pi^r$ (áp dụng Frobenius $r$ lần). Đây là endomorphism của $A$ thỏa $\ker(\phi_q - \operatorname{id}) = A(\mathbb{F}_q)$.

> [!note] Remark 7.14
> Frobenius isogeny $\pi : A \to A^{(p)}$ là **purely inseparable** (kernel hữu hạn nhưng tất cả points nilpotent). Điều này khác với separable isogenies (đặc số $0$ hoặc $\gcd(n, p) = 1$) nơi mọi geometric point của kernel là reduced.
>
> Verschiebung $V : A^{(p)} \to A$ là dual của $\pi$, thỏa $V \circ \pi = [p]_A$.

---

## Isogeny Category

> [!abstract] Definition 7.15 — Isogeny Category
> **Isogeny category** $\operatorname{AV}_k$ của abelian varieties trên $k$ có:
> - **Objects**: abelian varieties trên $k$.
> - **Morphisms**: $\operatorname{Hom}_{\operatorname{AV}_k}(A, B) = \operatorname{Hom}(A, B) \otimes_{\mathbb{Z}} \mathbb{Q}$.
>
> Trong category này, isogeny $f : A \to B$ degree $n$ là **isomorphism** với inverse $\frac{1}{n} f^\vee$.

> [!abstract] Theorem 7.16 — Isogeny là Equivalence Relation
> "Isogenous" là equivalence relation trên abelian varieties:
>
> 1. **Reflexive**: $\operatorname{id}_A : A \to A$ là isogeny.
> 2. **Symmetric**: nếu $f : A \to B$ isogeny thì $f^\vee : B \to A$ là isogeny.
> 3. **Transitive**: nếu $f : A \to B$ và $g : B \to C$ isogenies thì $g \circ f : A \to C$ là isogeny.

> [!abstract] Corollary 7.17 — Poincaré Complete Reducibility (revisited)
> Mọi abelian variety $A$ là isogenous với product $A_1^{e_1} \times \cdots \times A_r^{e_r}$ của các simple abelian varieties $A_i$ phân biệt. Phân tích này duy nhất trong isogeny category.
>
> **Proof**: Dùng polarization $\lambda : A \to A^\vee$ để xây dựng complement cho mọi abelian subvariety $B \subset A$: đặt $B' = \ker(\lambda|_{B^\vee})^0$ (connected component). Khi đó $B \cap B'$ hữu hạn và $B + B' = A$. $\blacksquare$

---

## Torsion Points và Galois Action

> [!abstract] Proposition 7.18 — Galois Action trên Torsion
> Nhóm Galois $G_k = \operatorname{Gal}(\bar{k}/k)$ tác động trên $A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ bởi ring automorphisms. Điều này cho **Galois representation**:
>
> $$
> \rho_{A,n} : G_k \to \operatorname{Aut}(A[n]) \cong \operatorname{GL}_{2g}(\mathbb{Z}/n\mathbb{Z}).
> $$
>
> Khi $n$ chạy qua $\ell^m$ với $\ell$ prime cố định, các $\rho_{A,\ell^m}$ compatible và cho **Tate module** $T_\ell(A)$ (Lesson 09).

> [!example] Example 7.19 — Galois action trên $E[n]$ cho elliptic curve
> Với $E/\mathbb{Q}$ elliptic curve và $n = \ell$ nguyên tố, $E[\ell](\bar{\mathbb{Q}}) \cong (\mathbb{Z}/\ell\mathbb{Z})^2$ và:
>
> $$
> \rho_{E,\ell} : \operatorname{Gal}(\bar{\mathbb{Q}}/\mathbb{Q}) \to \operatorname{GL}_2(\mathbb{Z}/\ell\mathbb{Z}).
> $$
>
> Đây là đối tượng trung tâm của lý thuyết số hiện đại (Wiles sử dụng để chứng minh FLT).

---

## SageMath Cheatsheet

```python
# Isogeny [n]: A -> A với degree n^{2g}
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])

# [n] tương ứng với nhân n lần trong E(Q)
P = E([16, -61])
for n in [2, 3, 4]:
    nP = n * P
    print(f"[{n}]({P}) = {nP}")

# degree([n]) = n^{2g} = n^2 (g=1)
for n in [2, 3, 5]:
    print(f"deg([{n}]) = {n**2} (lý thuyết, g=1)")
```

```python
# Torsion points: E[n] ≅ (Z/nZ)^2 trên đặc số 0
E = EllipticCurve(GF(1009), [1, 0])  # trên F_1009 để tính được

# 2-torsion: E[2] ≅ (Z/2Z)^2 có 4 điểm
two_tors = [P for P in E if 2*P == E(0)]
print(f"|E[2]| = {len(two_tors)} (lý thuyết: {2**2})")
print(f"E[2] = {two_tors}")

# 3-torsion: E[3] ≅ (Z/3Z)^2 có 9 điểm
three_tors = [P for P in E.torsion_subgroup() if 3*P == E(0)]
```

```python
# Dual isogeny: f^vee ∘ f = [deg(f)]
# Trên elliptic curve, dual isogeny của [n] là [n]
E = EllipticCurve(QQ, [1, 0])
# Isogeny của degree 2 (2-isogeny)
isogenies_2 = E.isogenies_prime_degree(2)
if isogenies_2:
    f = isogenies_2[0]
    print(f"Isogeny f: E -> E', degree = {f.degree()}")
    print(f"Kernel of f: {f.kernel_polynomial()}")
    # dual isogeny f_dual: E' -> E
    f_dual = f.dual()
    print(f"Dual isogeny degree = {f_dual.degree()}")
    print(f"deg(f) == deg(f_dual): {f.degree() == f_dual.degree()}")
```

```python
# p-rank: ordinary vs supersingular
# Elliptic curve trên F_p: E[p] ≅ Z/pZ (ordinary) hoặc 0 (supersingular)

def p_rank_elliptic(p):
    """Tìm tỉ lệ supersingular/ordinary E/F_p."""
    ordinary = 0
    supersingular = 0
    for a4 in range(p):
        for a6 in range(p):
            try:
                E = EllipticCurve(GF(p), [a4, a6])
                trace = E.trace_of_frobenius()
                if trace % p == 0:
                    supersingular += 1
                else:
                    ordinary += 1
            except:
                pass
    return ordinary, supersingular

p = 7
ord_count, ss_count = p_rank_elliptic(p)
print(f"p={p}: ordinary={ord_count}, supersingular={ss_count}")
# Lý thuyết: có floor((p-1)/12) supersingular j-values
```

```python
# Frobenius morphism và torsion
E = EllipticCurve(GF(17), [1, 2])
q = 17
frob_trace = E.trace_of_frobenius()
print(f"E/F_17: trace of Frobenius = {frob_trace}")
print(f"|E(F_17)| = {E.order()} = {q + 1 - frob_trace}")

# Char. poly của Frobenius: T^2 - trace*T + q
R.<T> = ZZ[]
char_poly = T^2 - frob_trace * T + q
print(f"Char. poly of Frob = {char_poly}")
# Roots = eigenvalues α, ᾱ với |α| = sqrt(q)
roots = char_poly.roots(CC)
print(f"Roots: {[complex(r[0]) for r in roots]}")
print(f"|root| ≈ sqrt(17) = {float(sqrt(17)):.4f}")
```

---

## Summary / Key Takeaways

- **Isogeny** $f : A \to B$: group homomorphism surjective với finite kernel; bảo toàn $\dim A = \dim B$.
- **Degree** = rank của $\ker(f)$ như finite group scheme. $\deg([n]_A) = n^{2g}$.
- **Dual isogeny** $f^\vee : B \to A$: $f^\vee \circ f = [\deg f]_A$ và $f \circ f^\vee = [\deg f]_B$.
- **Torsion đặc số $0$**: $A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ — cấu trúc cực kỳ đều đặn.
- **Torsion đặc số $p$**: $A[\ell^m](\bar{k}) \cong (\mathbb{Z}/\ell^m\mathbb{Z})^{2g}$ nếu $\ell \neq p$; nhưng $A[p^m](\bar{k}) \cong (\mathbb{Z}/p^m\mathbb{Z})^f$ với $f \leq g$ là $p$-rank.
- **Ordinary** ($f = g$) vs **supersingular** ($f = 0$) — phân loại quan trọng trong đặc số $p$.
- **Frobenius isogeny** $\pi : A \to A^{(p)}$: purely inseparable, đặc trưng của đặc số $p$; Verschiebung $V$ là dual của nó.
- **Isogeny category**: AV với $\operatorname{Hom} \otimes \mathbb{Q}$; isogenies là isomorphisms; semi-simple abelian category (Poincaré reducibility).
- **Galois representation** trên $A[n](\bar{k})$: công cụ cơ bản nối AV với lý thuyết số.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §7–8 (Isogenies, Definition of Dual AV).
- Edixhoven–van der Geer–Moonen, *Abelian Varieties*, Chapter V (Isogenies).
- Mumford, D. *Abelian Varieties*, §§6–7.
- Conrad, B. *Mordell Seminar* (Stanford, 2006), Lecture 2.
