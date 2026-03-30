---
title: "18. Complex Multiplication"
tags: [math, abelian-varieties, lesson-18]
aliases: [Complex Multiplication]
created: 2026-03-24
---

> **Prerequisites**: [[17-honda-tate-theory|17. Honda–Tate Theory]], [[10-endomorphism-algebras|10. Endomorphism Algebras]], [[02-complex-tori-and-lattices|02. Complex Tori & Lattices]]
> **Objectives**:
> - Định nghĩa CM-type $(K, \Phi)$ và abelian variety với CM
> - Hiểu construction của CM abelian variety trên $\mathbb{C}$ từ $(K, \Phi, \mathfrak{a})$
> - Phát biểu Main Theorem of Complex Multiplication: Galois action trên CM AV
> - Biết reflex field $K^*$ và reflex norm
> - Hiểu ứng dụng: Kronecker's Jugendtraum và explicit class fields

---

## Motivation / Intuition

Trong Lesson 10, ta thấy elliptic curve $E$ có CM bởi imaginary quadratic field $K$ khi $\operatorname{End}^0(E) \cong K$. Đây là trường hợp đặc biệt nhất của abelian variety: nó có **nhiều endomorphisms nhất có thể** theo nghĩa algebraic (chiều $[K:\mathbb{Q}] = 2g$).

Abelian variety với complex multiplication (CM) giữ vai trò trung tâm trong:

1. **Class field theory**: CM AV cung cấp **explicit** generators của abelian extensions của CM fields — giải quyết "Jugendtraum" của Kronecker.
2. **Honda–Tate theory**: mọi AV simple over $\mathbb{F}_q$ là reduction của CM AV.
3. **Cryptography**: CM curves được dùng để xây dựng pairing-friendly elliptic curves cho zkSNARKs (BLS12-381 có CM!).

---

## CM-Type

> [!abstract] Definition 18.1 — CM Field
> **CM field** là totally imaginary quadratic extension $K/K^+$ với $K^+$ totally real field. Equivalently, $K$ là number field sao cho complex conjugation (trên $K \otimes \mathbb{R}$) là non-trivial involution, và $K$ không totally real.
>
> Ví dụ: $K = \mathbb{Q}(i)$, $K = \mathbb{Q}(\sqrt{-5})$, $K = \mathbb{Q}(\zeta_5)$ (với $K^+ = \mathbb{Q}(\sqrt{5})$).

> [!abstract] Definition 18.2 — CM-Type
> Cho $K$ CM field với $[K:\mathbb{Q}] = 2g$. Tập tất cả embeddings $\operatorname{Hom}(K, \mathbb{C})$ có $2g$ phần tử. Vì $K$ CM, complex conjugation $\rho$ tác động: $\sigma \mapsto \bar\sigma = \rho \circ \sigma$.
>
> Một **CM-type** trên $K$ là subset $\Phi \subset \operatorname{Hom}(K, \mathbb{C})$ sao cho:
>
> $$
> \Phi \sqcup \bar\Phi = \operatorname{Hom}(K, \mathbb{C}), \quad |\Phi| = g.
> $$
>
> Tức là $\Phi$ là "một nửa" của embeddings, chọn đúng một từ mỗi cặp $\{\sigma, \bar\sigma\}$.

> [!example] Example 18.3 — CM-Type của $K = \mathbb{Q}(i)$
> $[K:\mathbb{Q}] = 2$, hai embeddings: $\sigma_1 : i \mapsto i$ và $\sigma_2 : i \mapsto -i = \bar\sigma_1$.
>
> CM-types: $\Phi_1 = \{\sigma_1\}$ và $\Phi_2 = \{\sigma_2\}$ (hai lựa chọn, nhưng conjugate nên equivalent).

---

## Abelian Variety với CM

> [!abstract] Definition 18.4 — Abelian Variety với CM
> Cho $(K, \Phi)$ là CM-type với $[K:\mathbb{Q}] = 2g$. Một abelian variety $A$ chiều $g$ **có CM bởi $(K, \Phi)$** nếu tồn tại injection:
>
> $$
> \iota : K \hookrightarrow \operatorname{End}^0(A)
> $$
>
> sao cho tác động của $K$ trên $\operatorname{Lie}(A) = T_0 A$ (Lie algebra = tangent space tại 0) là:
>
> $$
> \operatorname{Lie}(A) \cong \bigoplus_{\varphi \in \Phi} K \otimes_{K,\varphi} \mathbb{C} \cong \mathbb{C}^g \quad \text{(qua } \Phi\text{)}.
> $$

### Construction trên $\mathbb{C}$

> [!abstract] Proposition 18.5 — CM AV trên $\mathbb{C}$
> Cho $(K, \Phi)$ CM-type và $\mathfrak{a} \subset K$ một lattice (fractional ideal). Xét:
>
> $$
> A = \mathbb{C}^g / \Phi(\mathfrak{a}),
> $$
>
> trong đó $\Phi(\mathfrak{a}) = \{ (\varphi_1(a), \ldots, \varphi_g(a)) : a \in \mathfrak{a} \} \subset \mathbb{C}^g$ (với $\Phi = \{\varphi_1, \ldots, \varphi_g\}$).
>
> Khi đó $A$ là abelian variety với CM bởi $(K, \Phi)$, và $\mathcal{O}_K$ tác động qua $\iota(a)(z) = (\varphi_1(a) z_1, \ldots, \varphi_g(a) z_g)$.

> [!example] Example 18.6 — Elliptic Curve với CM bởi $\mathbb{Z}[i]$
> $K = \mathbb{Q}(i)$, $\Phi = \{\sigma : i \mapsto i\}$, $\mathfrak{a} = \mathbb{Z}[i] = \mathbb{Z} \cdot 1 + \mathbb{Z} \cdot i$.
>
> $A = \mathbb{C}/\Phi(\mathbb{Z}[i]) = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}i)$.
>
> Endomorphisms: $\iota(i)(z) = iz$ — nhân với $i$, làm xoay $90°$ trên mặt phẳng phức. $\operatorname{End}(A) \cong \mathbb{Z}[i]$, $\operatorname{End}^0(A) \cong \mathbb{Q}(i)$. ✓

---

## Reflex Field và Reflex Norm

> [!abstract] Definition 18.7 — Reflex Field $K^*$
> Cho $(K, \Phi)$ CM-type. **Reflex field** $K^*$ là number field (subfield của $\bar{\mathbb{Q}}$) sinh bởi:
>
> $$
> K^* = \mathbb{Q}\left( \left\{ \sum_{\varphi \in \Phi} \varphi(a) : a \in K \right\} \right).
> $$
>
> $K^*$ cũng là CM field (hoặc $\mathbb{Q}$), với $[K^*:\mathbb{Q}]$ là divisor của $[K:\mathbb{Q}] = 2g$.

> [!abstract] Definition 18.8 — Reflex Norm
> **Reflex norm** là map:
>
> $$
> N_\Phi : (K^*)^* \to K^*, \quad x \mapsto \prod_{\varphi \in \Phi} \varphi^{-1}(x)
> $$
>
> (khi restrict đến units), hoặc chính xác hơn là map $\mathbb{A}_{K^*}^* \to \mathbb{A}_K^*$ trên adeles.

> [!example] Example 18.9 — Reflex Field cho $K = \mathbb{Q}(i)$
> $(K, \Phi)$ với $\Phi = \{\sigma : i \mapsto i\}$.
>
> $\sum_{\varphi \in \Phi} \varphi(a) = \sigma(a)$ với $a \in \mathbb{Q}(i)$. Vì $\sigma(\mathbb{Q}(i)) = \mathbb{Q}(i)$, reflex field $K^* = \mathbb{Q}(i) = K$.
>
> Đây là trường hợp "self-dual": $K^* \cong K$.

---

## Main Theorem of Complex Multiplication

Đây là định lý trung tâm kết nối CM abelian varieties với class field theory:

> [!abstract] Theorem 18.10 — Main Theorem of CM (Shimura–Taniyama)
> Cho $(A, \iota)$ abelian variety với CM bởi $(K, \Phi)$ trên number field $F \subset \mathbb{C}$, với $K^* \subset F$.
>
> Cho $s \in \mathbb{A}_{K^*}^*$ (idele của $K^*$) với $\operatorname{Art}(s) = \sigma|_{F^{ab}} \in \operatorname{Gal}(F^{ab}/F)$ (qua Artin map).
>
> Thì tồn tại unique isogeny $\lambda : A \to A^\sigma$ (conjugate qua $\sigma$) sao cho:
>
> $$
> \lambda \circ \iota(a) = \iota(\sigma(a)) \circ \lambda \quad \forall a \in K
> $$
>
> và $\lambda$ tương thích với tác động của $s$ trên torsion points qua reflex norm $N_\Phi(s)$.
>
> **Corollary**: Abelian extensions của $K^*$ được sinh bởi **torsion points** của CM abelian varieties.

> [!note] Remark 18.11 — Jugendtraum của Kronecker
> Với $K = \mathbb{Q}(i)$ ($K^* = K$), Main Theorem nói: tất cả abelian extensions của $\mathbb{Q}(i)$ được sinh bởi torsion points của $E = \mathbb{C}/\mathbb{Z}[i]$ (elliptic curve với CM bởi $\mathbb{Z}[i]$).
>
> Đây là analog của **Kronecker–Weber theorem** (abelian extensions của $\mathbb{Q}$ sinh bởi roots of unity = torsion points của $\mathbb{G}_m$) nhưng cho imaginary quadratic fields.

---

## CM và Honda–Tate

> [!abstract] Theorem 18.12 — CM AV và Finite Fields
> Mọi simple AV over $\mathbb{F}_q$ là **reduction** của một CM abelian variety trên $\bar{\mathbb{Q}}$.
>
> Cụ thể: với Weil $q$-number $\pi$, đặt $K = \mathbb{Q}(\pi)$. Nếu $K$ là CM field degree $2g$ (trường hợp "generic"), thì $\pi$ xác định CM-type $\Phi$ và AV $A/\bar{\mathbb{Q}}$ với CM bởi $(K, \Phi)$ có reduction là simple AV/\mathbb{F}_q với Frobenius $\pi$.

---

## CM và Cryptography

> [!abstract] Application 18.13 — Pairing-Friendly Curves via CM
> Để xây dựng elliptic curve với embedding degree $k$ cụ thể (cho zkSNARKs), dùng **CM method**:
>
> 1. Chọn CM field $K = \mathbb{Q}(\sqrt{-D})$ và CM discriminant $D$.
> 2. Tính **Hilbert class polynomial** $H_D(x) = \prod_{j(\mathfrak{a})} (x - j(\mathfrak{a}))$ (tích theo ideal classes).
> 3. Roots của $H_D$ là $j$-invariants của CM elliptic curves.
> 4. Chọn prime $p$ và $k$ sao cho tồn tại root của $H_D$ trong $\mathbb{F}_p$.
>
> **BLS12-381**: $D = -3$ (CM bởi $\mathbb{Q}(\sqrt{-3}) = \mathbb{Q}(\zeta_3)$), $k = 12$. Embedding degree 12 với 381-bit prime $p$.

> [!example] Example 18.14 — Hilbert Class Polynomial
> $D = 1$ (CM bởi $\mathbb{Z}[i]$): $H_{-4}(x) = x - 1728$. Vậy $j = 1728$ là $j$-invariant của elliptic curve với CM bởi $\mathbb{Z}[i]$.
>
> Curve $E : y^2 = x^3 - x$ có $j(E) = 1728$, CM bởi $\mathbb{Z}[i]$.
>
> $D = 3$ (CM bởi $\mathbb{Z}[\zeta_3]$): $H_{-3}(x) = x - 0$. $j = 0$ tương ứng $E : y^2 = x^3 + 1$.

---

## SageMath Cheatsheet

```python
# CM elliptic curves: j-invariant đặc biệt
# j = 1728: CM bởi Z[i] (discriminant -4)
E1 = EllipticCurve(QQ, [0, 0, 0, -1, 0])  # y^2 = x^3 - x
print(f"j(E1) = {E1.j_invariant()}")  # phải là 1728

# j = 0: CM bởi Z[omega], omega = e^{2pi*i/3} (discriminant -3)
E2 = EllipticCurve(QQ, [0, 0, 0, 0, -1])  # y^2 = x^3 - 1
print(f"j(E2) = {E2.j_invariant()}")  # phải là 0

# CM endomorphism trên E1: [i] là (x, y) -> (-x, iy)
# Trên F_p với p ≡ 1 mod 4, sqrt(-1) tồn tại
p = 5  # 5 ≡ 1 mod 4
E = EllipticCurve(GF(p), [0, 0, 0, -1, 0])  # y^2 = x^3 - x
print(f"\nE/F_{p}: y^2 = x^3 - x")
print(f"|E(F_{p})| = {E.order()}")
i_val = GF(p)(-1).sqrt()  # sqrt(-1) mod p
print(f"sqrt(-1) mod {p} = {i_val}")
```

```python
# Hilbert class polynomial
# H_D(x) = product của (x - j(a)) qua ideal classes của Q(sqrt(-D))
for D in [1, 2, 3, 4, 7, 8, 11]:
    K = QuadraticField(-D)
    h = K.class_number()
    # Hilbert class poly
    pol = hilbert_class_polynomial(-D)
    print(f"D={D}: h(-{D})={h}, H_{{-{D}}}(x) = {pol}")
```

```python
# CM AV trên C: construction từ (K, Phi, a)
# K = Q(i), Phi = {sigma: i -> i}, a = Z[i]
# A = C / Phi(Z[i]) = C / (Z + Zi)
import cmath
omega = complex(0, 1)  # i
# Lattice: Z + Z*i
lattice_basis = [complex(1, 0), complex(0, 1)]
print("CM elliptic curve = C/Lattice:")
print(f"  Lattice = Z + Z*i = {lattice_basis}")
print(f"  Torus = C/(Z + Zi) = elliptic curve y^2 = x^3 - x (j=1728)")
print(f"  CM endomorphism: z -> i*z (rotation by pi/2)")
```

```python
# Reflex field và reflex norm
# Với K = Q(i), Phi = {sigma_1}, reflex field K* = K = Q(i)
# Reflex norm: N_Phi(x) = sigma_1^{-1}(x) = conjugate(x) for x in K

K.<i> = NumberField(x^2 + 1)
Phi = [K.hom([K.gen()])]  # sigma: i -> i

# Reflex norm của element a in K*:
a = 1 + i  # example element
reflex_norm = a.conjugate()  # = 1 - i
print(f"a = {a}")
print(f"N_Phi(a) = reflex norm = {reflex_norm}")
print(f"|N_Phi(a)| = {float(abs(complex(*reflex_norm))):.4f}")
```

```python
# BLS12-381: CM bởi Q(sqrt(-3)), k=12
# j = 0, D = -3
print("BLS12-381 elliptic curve:")
print("  CM discriminant: D = -3")
print("  CM field: Q(sqrt(-3)) = Q(zeta_3)")
print("  j-invariant: j = 0")
print("  Embedding degree: k = 12")
print("  Prime p: 381-bit prime")
print("  Ứng dụng: zkSNARKs (Groth16, PLONK)")

# Verify: j=0 curve y^2 = x^3 + b (với D=-3)
D = -3
pol = hilbert_class_polynomial(D)
print(f"\nH_{{-3}}(x) = {pol}")
print(f"Root: j = {pol.roots(QQ)}")
```

---

## Summary / Key Takeaways

- **CM field** $K$: totally imaginary quadratic extension của totally real $K^+$; $[K:\mathbb{Q}] = 2g$.
- **CM-type** $(K, \Phi)$: half-system $\Phi$ của embeddings $K \hookrightarrow \mathbb{C}$, $|\Phi| = g$.
- **CM AV trên $\mathbb{C}$**: $A = \mathbb{C}^g / \Phi(\mathfrak{a})$ với $\mathfrak{a}$ fractional ideal; $\mathcal{O}_K$ tác động qua $\Phi$.
- **Reflex field $K^*$**: CM field (hoặc $\mathbb{Q}$), subfield của $\bar{\mathbb{Q}}$; thường $K^* = K$ (self-dual).
- **Main Theorem of CM**: Galois action trên torsion points của CM AV $\leftrightarrow$ Artin map trên $K^*$ qua reflex norm.
- **Jugendtraum**: abelian extensions của CM fields sinh bởi torsion points của CM AV (class field theory explicit!).
- **Liên hệ Honda–Tate**: mọi simple AV/$\mathbb{F}_q$ là reduction của CM AV; $\pi = $ Frobenius thuộc $K$.
- **Ứng dụng crypto**: CM method để xây dựng pairing-friendly curves (BLS12-381: $D = -3$, $j = 0$, $k = 12$).

---

## References

- Shimura, G. & Taniyama, Y. *Complex Multiplication of Abelian Varieties* (1961).
- Milne, J.S. *Abelian Varieties* (v2.0), §§19–20 (Complex Multiplication).
- Silverman, J. *Advanced Topics in the Arithmetic of Elliptic Curves*, Chapter II (CM).
- Boneh, D. & Shoup, V. *A Graduate Course in Applied Cryptography*, Ch. 18 (Pairing-based crypto).
- Freeman, D., Scott, M., Teske, E. *A Taxonomy of Pairing-Friendly Elliptic Curves*, J. Cryptology (2010).
