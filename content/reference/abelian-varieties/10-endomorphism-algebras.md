---
title: "10. Endomorphism Algebras"
tags: [math, abelian-varieties, lesson-10]
aliases: [Endomorphism Algebras]
created: 2026-03-24
---

> **Prerequisites**: [[09-weil-pairings-and-tate-modules|09. Weil Pairings & Tate Modules]], [[07-isogenies|07. Isogenies]]
> **Objectives**:
> - Hiểu $\operatorname{End}(A)$ là ring và $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes_{\mathbb{Z}} \mathbb{Q}$ là $\mathbb{Q}$-algebra semisimple
> - Nắm Albert classification: 4 loại division algebras với positive involution
> - Biết cấu trúc $\operatorname{End}^0(A)$ với $A$ simple (division algebra) vs không simple
> - Hiểu quan hệ giữa $\operatorname{End}^0(A)$ và Tate module
> - Phân biệt các trường hợp đặc biệt: CM (complex multiplication), ordinary, supersingular

---

## Motivation / Intuition

Endomorphisms của abelian variety $A$ là group homomorphisms $A \to A$. Tập tất cả endomorphisms tạo thành một ring $\operatorname{End}(A)$ (với phép cộng pointwise và hợp). Đây là ring rất đặc biệt:

- **Không thể là quá "lớn"**: $\operatorname{End}(A) \otimes \mathbb{Q}$ là semisimple algebra hữu hạn chiều trên $\mathbb{Q}$ — bị hạn chế bởi Tate module.
- **Không thể là quá "nhỏ"**: luôn chứa $\mathbb{Z}$ (các map $[n]$).
- **Đặc biệt trong đặc số $p$**: Frobenius là endomorphism không có analog trong đặc số $0$.

Cấu trúc của $\operatorname{End}^0(A)$ phân loại AV lên đến "isogeny gần như": hai AV trên $\mathbb{C}$ "có cùng type" khi chúng có cùng endomorphism algebra. Và Albert classification liệt kê tất cả division algebras có thể là $\operatorname{End}^0(A)$ với $A$ simple.

---

## $\operatorname{End}(A)$ và $\operatorname{End}^0(A)$

### Cấu trúc cơ bản

> [!abstract] Proposition 10.1 — $\operatorname{End}(A)$ là $\mathbb{Z}$-algebra hữu hạn sinh
> Cho $A$ abelian variety chiều $g$. Thì:
>
> 1. $\operatorname{End}(A)$ là $\mathbb{Z}$-algebra với phép cộng $(f + g)(x) = f(x) + g(x)$ và nhân $f \circ g$.
> 2. $\operatorname{End}(A)$ là **torsion-free** như $\mathbb{Z}$-module.
> 3. $\operatorname{End}(A)$ **hữu hạn sinh** như $\mathbb{Z}$-module, với rank $\leq 4g^2$.

**Proof sketch.** (3): Injection $\operatorname{End}(A) \hookrightarrow \operatorname{End}_{\mathbb{Z}_\ell}(T_\ell(A)) \cong M_{2g}(\mathbb{Z}_\ell)$ qua $\ell$-adic Tate module (Tate conjecture). Vì $M_{2g}(\mathbb{Z}_\ell)$ là $\mathbb{Z}_\ell$-module rank $(2g)^2 = 4g^2$, ta có bound. $\blacksquare$

> [!abstract] Definition 10.2 — Endomorphism Algebra
> **Endomorphism algebra** (đại số đồng cấu) của $A$ là:
>
> $$
> \operatorname{End}^0(A) = \operatorname{End}(A) \otimes_{\mathbb{Z}} \mathbb{Q}.
> $$
>
> Đây là "endomorphisms trong isogeny category" — ta cho phép chia cho số nguyên khác $0$.

> [!abstract] Theorem 10.3 — $\operatorname{End}^0(A)$ là Semisimple $\mathbb{Q}$-Algebra
> $\operatorname{End}^0(A)$ là **semisimple** $\mathbb{Q}$-algebra hữu hạn chiều. Khi $A \sim A_1^{e_1} \times \cdots \times A_r^{e_r}$ (Poincaré reducibility):
>
> $$
> \operatorname{End}^0(A) \cong M_{e_1}(D_1) \times \cdots \times M_{e_r}(D_r),
> $$
>
> trong đó $D_i = \operatorname{End}^0(A_i)$ là division algebra (khi $A_i$ simple).

**Proof.** Áp dụng Artin-Wedderburn: mọi semisimple algebra là product của matrix algebras trên division rings. Tính semisimple xuất phát từ Poincaré reducibility và đặc tính $\mathbb{Q}$-algebra. $\blacksquare$

---

## Albert Classification

### Involution Rosati

Trước khi phân loại, cần nhớ: mọi AV có polarization, và polarization định nghĩa **Rosati involution** trên $\operatorname{End}^0(A)$ (sẽ học chi tiết ở Lesson 12):

$$
f \mapsto f^\dagger = \lambda^{-1} \circ f^\vee \circ \lambda : A \to A.
$$

Involution này **positive**: $\operatorname{Tr}(f \circ f^\dagger) > 0$ với $f \neq 0$.

### Phân loại

> [!abstract] Theorem 10.4 — Albert Classification (Phân loại Albert)
> Cho $A$ simple abelian variety chiều $g$ trên trường đặc số $0$ hay trên $\overline{\mathbb{F}}_p$. Endomorphism algebra $D = \operatorname{End}^0(A)$ là **division algebra** trên $\mathbb{Q}$, và cặp $(D, \dagger)$ (với Rosati involution) thuộc đúng một trong bốn loại:
>
> | Type | Mô tả $D$ | $[D:\mathbb{Q}]$ | Điều kiện chiều |
> |------|-----------|-----------------|-----------------|
> | **I** | $F$ totally real number field | $e^2$ | $e \mid g$ |
> | **II** | $D$ quaternion trên $F$ totally real, $D \otimes_F \mathbb{R} \cong M_2(\mathbb{R})$ (indefinite) | $4e^2$ | $e \mid g$, $2e \mid g$ |
> | **III** | $D$ quaternion trên $F$ totally real, $D \otimes_F \mathbb{R} \cong \mathbb{H}$ (definite, Hamilton) | $4e^2$ | $e \mid g$, $e \mid g$ |
> | **IV** | $D$ central over CM field $K$ | $4e^2 f^2$ | phức tạp hơn |
>
> Trong đó $F = \mathbb{Q}$ hoặc totally real field với $[F:\mathbb{Q}] = e$, và $K$ là CM field (totally imaginary extension của totally real field) với $[K:\mathbb{Q}] = 2e$.

> [!abstract] Definition 10.5 — Totally Real và CM Fields
> - **Totally real field**: số field $F$ với tất cả embeddings $F \hookrightarrow \mathbb{C}$ đều có ảnh trong $\mathbb{R}$.
> - **CM field**: totally imaginary quadratic extension $K/F$ với $F$ totally real. Tức là $K = F(\sqrt{-d})$ với $d > 0$ và mọi embedding gửi $\sqrt{-d} \mapsto i\sqrt{|d|} \notin \mathbb{R}$.

---

## Các Ví Dụ Quan Trọng

### Type I — CM thấp nhất

> [!example] Example 10.6 — Type I: $D = \mathbb{Q}$
> Elliptic curve "generic" $E/\mathbb{C}$ (không có CM) có $\operatorname{End}^0(E) = \mathbb{Q}$. Đây là Type I với $F = \mathbb{Q}$, $e = 1$, $g = 1$.
>
> Ví dụ cụ thể: $E : y^2 = x^3 - x - 1$ trên $\mathbb{Q}$. $\operatorname{End}_{\mathbb{Q}}(E) = \mathbb{Z}$, $\operatorname{End}^0(E) = \mathbb{Q}$.

### Type IV — Complex Multiplication

> [!example] Example 10.7 — Type IV: CM elliptic curve
> Elliptic curve với **complex multiplication (CM)** bởi imaginary quadratic field $K = \mathbb{Q}(\sqrt{-d})$:
>
> $$
> \operatorname{End}^0(E) \cong K = \mathbb{Q}(\sqrt{-d}).
> $$
>
> Ví dụ: $E : y^2 = x^3 - x$ có CM bởi $\mathbb{Q}(i)$ (vì $E$ có automorphism $(x, y) \mapsto (-x, iy)$ của order $4$, tương ứng với nhân bởi $i \in \mathbb{Q}(i)$).
>
> $[K:\mathbb{Q}] = 2 = 4g^2 / \cdots$ → Type IV với $g = 1$, $e = f = 1$.

### Type III — Supersingular

> [!example] Example 10.8 — Type III: Supersingular Elliptic Curve
> Supersingular elliptic curve $E$ trên $\overline{\mathbb{F}}_p$ có:
>
> $$
> \operatorname{End}^0(E) \cong B_{p,\infty} \quad \text{(quaternion algebra over } \mathbb{Q}\text{, ramified at } p \text{ và } \infty\text{)}.
> $$
>
> Đây là **definite quaternion algebra** — Type III với $F = \mathbb{Q}$, $[D:\mathbb{Q}] = 4$. Điều kiện $g = 1$ thỏa (vì $e = 1$, $e \mid 1$).
>
> Đây là lý do tại sao supersingular curves "đặc biệt": endomorphism ring **không giao hoán** và lớn hơn nhiều so với trường hợp ordinary!

---

## Tate Module và Endomorphisms

> [!abstract] Theorem 10.9 — Embedding qua Tate Module
> Với prime $\ell \neq \operatorname{char}(k)$, có injection tự nhiên:
>
> $$
> \operatorname{End}(A) \otimes_{\mathbb{Z}} \mathbb{Z}_\ell \hookrightarrow \operatorname{End}_{\mathbb{Z}_\ell[G_k]}(T_\ell(A)),
> $$
>
> trong đó vế phải là $G_k$-equivariant $\mathbb{Z}_\ell$-linear endomorphisms của $T_\ell(A)$.
>
> **Tate Conjecture** (đã chứng minh cho finite fields và number fields) nói đây là **isomorphism** sau khi tensor với $\mathbb{Q}_\ell$:
>
> $$
> \operatorname{End}^0(A) \otimes_{\mathbb{Q}} \mathbb{Q}_\ell \xrightarrow{\sim} \operatorname{End}_{\mathbb{Q}_\ell[G_k]}(T_\ell(A) \otimes \mathbb{Q}_\ell).
> $$

**Ý nghĩa**: Tate Conjecture nói rằng "morphisms của AV" hoàn toàn được kiểm soát bởi "Galois-equivariant morphisms của Tate modules". Đây là nguyên lý trung tâm của lý thuyết số abelian varieties.

> [!abstract] Corollary 10.10 — Rank bound và Finiteness
> Từ injection trên: $\operatorname{rank}_{\mathbb{Z}} \operatorname{End}(A) \leq (2g)^2 = 4g^2$.
>
> Hơn nữa với $A$ simple: $[D:\mathbb{Q}] \leq 4g^2$ và $\operatorname{End}(A)$ là **order** trong division algebra $D$.

---

## Trace và Degree của Endomorphisms

> [!abstract] Definition 10.11 — Characteristic Polynomial của Endomorphism
> Với $\alpha \in \operatorname{End}(A)$, **characteristic polynomial** của $\alpha$ là:
>
> $$
> P_\alpha(T) = \det(T \cdot \operatorname{id} - \rho_\ell(\alpha)) \in \mathbb{Z}[T],
> $$
>
> trong đó $\rho_\ell(\alpha) \in M_{2g}(\mathbb{Z}_\ell)$ là ma trận của $\alpha$ tác động trên $T_\ell(A)$.
>
> Đây là monic polynomial bậc $2g$ với hệ số trong $\mathbb{Z}$ (không phụ thuộc $\ell$!).
>
> **Trace**: $\operatorname{tr}(\alpha) = P_\alpha'(0)/...$ — hệ số của $T^{2g-1}$ với dấu âm.
> **Degree**: $\deg(\alpha) = P_\alpha(0)$ (hệ số tự do = determinant).

> [!example] Example 10.12 — Char. poly của Frobenius
> Với $A/\mathbb{F}_q$ abelian variety chiều $g$ và $\pi = \phi_q$ là Frobenius endomorphism:
>
> $$
> P_\pi(T) = T^{2g} - a_{2g-1} T^{2g-1} + \cdots + q^g \in \mathbb{Z}[T].
> $$
>
> **Weil numbers**: mọi complex root $\alpha_i$ của $P_\pi$ thỏa $|\alpha_i| = q^{1/2}$.
>
> Số điểm rational: $|A(\mathbb{F}_q)| = P_\pi(1) = \prod_{i=1}^{2g} (1 - \alpha_i)$.
>
> Với $g = 1$ (elliptic curve): $P_\pi(T) = T^2 - tT + q$ với $t = \operatorname{trace}$ của Frobenius, và $|E(\mathbb{F}_q)| = q + 1 - t$.

---

## Complex Multiplication (CM)

> [!abstract] Definition 10.13 — Abelian Variety có CM
> AV $A$ chiều $g$ được gọi là **CM type** (hay có **complex multiplication**) nếu $\operatorname{End}^0(A)$ chứa CM field $K$ với $[K:\mathbb{Q}] = 2g$.
>
> Điều này tương đương: $A \sim A_1 \times \cdots \times A_r$ với mỗi $A_i$ simple và có CM.
>
> Khi $A$ simple: CM $\Leftrightarrow$ $[D:\mathbb{Q}] = 2g$ $\Leftrightarrow$ $D$ là CM field (đặc số $0$) hoặc $D$ là quaternion algebra (một số trường hợp đặc số $p$).

> [!note] Remark 10.14 — CM và Arithmetics
> AV có CM là "algebraically special" — có nhiều endomorphisms. Chúng đóng vai trò trung tâm trong:
> - **Main theorem of complex multiplication**: Shimura-Taniyama-Weil, Kronecker's Jugendtraum
> - **Class field theory**: abelian extensions của CM fields
> - **Cryptography**: pairing-friendly curves thường có CM đặc biệt

---

## SageMath Cheatsheet

```python
# End^0(E) = Q cho elliptic curve "generic"
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
# End_Q(E) = Z, End^0(E) = Q (Type I)
print("Endomorphism ring over Q:")
print(f"  Rank = {E.rank()}")  # Mordell-Weil rank (khác End)
# End(E) chứa Z: [n] cho mọi n
P = E([16, -61])
for n in [2, 3, -1]:
    print(f"  [{n}]P = {n * P}")
```

```python
# CM elliptic curve: End^0(E) là imaginary quadratic field
# E: y^2 = x^3 - x có CM bởi Z[i] (Gaussian integers)
E = EllipticCurve(CC, [0, 0, 0, -1, 0])  # y^2 = x^3 - x

# Endomorphism [i]: (x, y) -> (-x, i*y) (multiplication by i)
# Kiểm tra: nếu z = x + iy thì [i]z = iz = -y + ix
# Trên E/C, điều này tương ứng với (x,y) -> (-x, iy)
E2 = EllipticCurve(GF(1009), [0, 0, 0, -1, 0])
P = E2([0, 0])  # điểm 2-torsion
print(f"E: y^2 = x^3 - x")
print(f"P = {P}")

# CM morphism: (x, y) -> (-x, y*sqrt(-1))
# Trên GF(p), sqrt(-1) tồn tại nếu p ≡ 1 (mod 4)
p = 1009
if (p - 1) % 4 == 0:
    i = GF(p)(1).square_root()  # không đúng, cần root of -1
    i = GF(p)(-1).square_root()
    print(f"sqrt(-1) mod {p} = {i}")
    # CM endomorphism: (x, y) -> (-x, i*y)
    Q = E2([-P[0], i * P[1]])
    print(f"[i](P) = (-x, i*y) = {Q}")
```

```python
# Characteristic polynomial của Frobenius
E = EllipticCurve(GF(101), [1, 2])
trace = E.trace_of_frobenius()
q = 101
charpoly = E.frobenius_polynomial()
print(f"Char poly of Frobenius: {charpoly}")
print(f"= T^2 - {trace}*T + {q}")
print(f"|E(F_101)| = P_pi(1) = {charpoly(1)} = {E.order()}")

# Weil numbers: roots phải có |alpha| = sqrt(q)
roots = charpoly.roots(CC)
for r, mult in roots:
    print(f"  root: {complex(r):.4f}, |root| = {abs(complex(r)):.4f}, sqrt(q) = {float(sqrt(q)):.4f}")
```

```python
# Albert classification: Type III (supersingular)
# Supersingular iff trace = 0 (mod p) khi char = p
p = 7
supersingular_count = 0
for a4 in range(p):
    for a6 in range(p):
        try:
            E = EllipticCurve(GF(p), [a4, a6])
            if E.trace_of_frobenius() % p == 0:
                supersingular_count += 1
                # End^0(E) = quaternion algebra (Type III)
        except:
            pass

print(f"Số supersingular E/F_{p}: ~{supersingular_count}")
# Lý thuyết: có floor((p-1)/12) + epsilon supersingular j-values
print(f"Lý thuyết (approx): {(p-1)//12}")
```

```python
# Rank bound: rank_Z End(A) <= 4g^2
g = 1  # elliptic curve
print(f"Bound: rank_Z End(A) <= 4*{g}^2 = {4*g**2}")
# Với g=1: rank <= 4
# Với CM: rank = 2 (order trong imaginary quadratic field)
# Với supersingular: rank = 4 (order trong quaternion algebra)
# Với generic: rank = 1 (Z itself)

g = 2  # abelian surface
print(f"g=2: rank <= {4*g**2} = 16")
```

---

## Summary / Key Takeaways

- **$\operatorname{End}(A)$**: ring torsion-free, hữu hạn sinh, rank $\leq 4g^2$.
- **$\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$**: semisimple $\mathbb{Q}$-algebra; với $A$ simple thì là division algebra.
- **Albert classification** (4 types cho $A$ simple): phân loại bởi division algebra $D$ với positive involution (Rosati).
- **Type I** ($D$ totally real number field): "least CM" — endomorphisms không làm gì đặc biệt.
- **Type IV** ($D$ CM field): complex multiplication — xuất hiện khi $D$ imaginary quadratic, e.g. $E$ với CM bởi $\mathbb{Q}(i)$.
- **Type III** ($D$ definite quaternion): supersingular elliptic curves trong đặc số $p$.
- **Tate module embedding**: $\operatorname{End}(A) \otimes \mathbb{Z}_\ell \hookrightarrow \operatorname{End}_{G_k}(T_\ell A)$; đẳng cấu sau khi tensor $\mathbb{Q}_\ell$ (Tate conjecture).
- **Char. poly của endomorphism** $P_\alpha \in \mathbb{Z}[T]$ bậc $2g$: không phụ thuộc $\ell$; $P_\pi(1) = |A(\mathbb{F}_q)|$ cho Frobenius.
- **CM abelian variety**: $[K:\mathbb{Q}] = 2g$ với $K \subset \operatorname{End}^0(A)$; đóng vai trò trung tâm trong class field theory và arithmetic.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §§10, 13 (Endomorphisms, Rosati involution).
- Mumford, D. *Abelian Varieties*, Chapter V.
- Edixhoven–van der Geer–Moonen, *Abelian Varieties*, Chapter XII (Endomorphism ring).
- Albert, A.A. *A solution of the principal problem in the theory of Riemann matrices* (1934).
- Arapura, D. *Abelian Varieties and Moduli*, §3.3 (Albert classification).
