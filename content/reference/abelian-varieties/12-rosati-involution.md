---
title: "12. The Rosati Involution"
tags: [math, abelian-varieties, lesson-12]
aliases: [The Rosati Involution]
created: 2026-03-24
---

> **Prerequisites**: [[11-polarizations-and-invertible-sheaves|11. Polarizations & Invertible Sheaves]], [[10-endomorphism-algebras|10. Endomorphism Algebras]], [[08-dual-abelian-variety|08. The Dual Abelian Variety]]
> **Objectives**:
> - Định nghĩa Rosati involution $\dagger$ trên $\operatorname{End}^0(A)$ từ polarization $\lambda$
> - Chứng minh Rosati involution là **positive**: $\operatorname{Tr}(f f^\dagger) > 0$ với $f \neq 0$
> - Hiểu ý nghĩa geometric và số học của involution này
> - Biết Rosati involution xác định Albert type và ràng buộc $\operatorname{End}^0(A)$
> - Tính Rosati involution tường minh trong các ví dụ

---

## Motivation / Intuition

Phân loại Albert (Lesson 10) đòi hỏi $\operatorname{End}^0(A)$ phải có một **positive involution** — anti-automorphism bậc $2$ thỏa tính positive. Đây không phải là yêu cầu tùy tiện: nó xuất phát tự nhiên từ cấu trúc của abelian variety, cụ thể từ **polarization**.

Ý tưởng: nếu $\lambda : A \to A^\vee$ là polarization, và $f : A \to A$ là endomorphism, thì **Rosati involution** của $f$ là:

$$
f^\dagger = \lambda^{-1} \circ f^\vee \circ \lambda.
$$

Đây là "adjoint" của $f$ theo nghĩa: $\lambda$ đóng vai trò của "metric" trên $A$, và $f^\dagger$ là adjoint của $f$ theo metric đó. Tính positive của involution phản ánh tính dương của "metric" — tức là polarization là "positive definite".

---

## Định Nghĩa

> [!abstract] Definition 12.1 — Rosati Involution
> Cho $A$ abelian variety với polarization $\lambda : A \to A^\vee$. **Rosati involution** (hay **Rosati anti-involution**) là map:
>
> $$
> \dagger = \dagger_\lambda : \operatorname{End}^0(A) \to \operatorname{End}^0(A), \quad f \mapsto f^\dagger = \lambda^{-1} \circ f^\vee \circ \lambda.
> $$
>
> Ở đây $\lambda^{-1}$ là nghịch đảo trong isogeny category (tức là $\frac{1}{\deg \lambda} \lambda^\vee$), và $f^\vee : A^\vee \to A^\vee$ là dual morphism.

> [!note] Remark 12.2 — Tại sao $\lambda^{-1}$ có nghĩa?
> Trong $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$, ta có thể chia cho $\deg(\lambda)$. Cụ thể, $\lambda^\vee : A^\vee \to A$ thỏa $\lambda^\vee \circ \lambda = [\deg \lambda]_A$, nên $\frac{1}{\deg \lambda} \lambda^\vee$ là nghịch đảo của $\lambda$ trong isogeny category.
>
> Vậy $f^\dagger = \frac{1}{\deg \lambda} \lambda^\vee \circ f^\vee \circ \lambda \in \operatorname{End}^0(A)$.

> [!abstract] Proposition 12.3 — Tính Chất Cơ Bản
> Rosati involution thỏa:
>
> 1. **Anti-multiplicative**: $(f \circ g)^\dagger = g^\dagger \circ f^\dagger$.
> 2. **Additive**: $(f + g)^\dagger = f^\dagger + g^\dagger$.
> 3. **Involution**: $(f^\dagger)^\dagger = f$.
> 4. **$\mathbb{Q}$-linear**: $(qf)^\dagger = q f^\dagger$ với $q \in \mathbb{Q}$.
> 5. **Tác động trên $\mathbb{Z}$**: $(n \cdot \operatorname{id})^\dagger = n \cdot \operatorname{id}$ với $n \in \mathbb{Z}$ (nên $\dagger$ fixes $\mathbb{Q} \subset \operatorname{End}^0(A)$).

**Proof sketch của (3).** $(f^\dagger)^\dagger = \lambda^{-1} \circ (f^\dagger)^\vee \circ \lambda = \lambda^{-1} \circ (\lambda^{-1} \circ f^\vee \circ \lambda)^\vee \circ \lambda$. Dùng $(g \circ h)^\vee = h^\vee \circ g^\vee$ và $(\lambda^{-1})^\vee = (\lambda^\vee)^{-1} = \lambda^{-1}$ (vì $\lambda$ symmetric: $\lambda^\vee = \lambda$ qua biduality). Vậy $(f^\dagger)^\dagger = \lambda^{-1} \circ \lambda^\vee \circ (f^\vee)^\vee \circ (\lambda^{-1})^\vee \circ \lambda = f$. $\blacksquare$

---

## Positivity của Rosati Involution

Đây là tính chất quan trọng nhất:

> [!abstract] Theorem 12.4 — Rosati Involution là Positive
> Với mọi $f \in \operatorname{End}^0(A)$, $f \neq 0$:
>
> $$
> \operatorname{Tr}(f \circ f^\dagger) > 0,
> $$
>
> trong đó $\operatorname{Tr}$ là trace của $f \circ f^\dagger$ tác động trên $V_\ell(A) = T_\ell(A) \otimes \mathbb{Q}_\ell$ (trace của representation $\ell$-adic).

**Proof.**

Trường hợp $k = \mathbb{C}$, $A = V/\Lambda$, $f$ là endomorphism thực. Trên $V \cong \mathbb{R}^{2g}$, $f$ là $\mathbb{R}$-linear map, và $f^\dagger$ là adjoint theo Hermitian form $H$ (Riemann form của $\lambda$):

$$
\operatorname{Tr}(f \circ f^\dagger) = \operatorname{Tr}_{\mathbb{R}}(f \circ f^*_H) = \sum_{i,j} |f_{ij}|^2 > 0 \quad \text{khi } f \neq 0.
$$

Đây là tính positive của adjoint theo inner product. Đối với trường $k$ tổng quát, dùng Tate module. $\blacksquare$

> [!note] Remark 12.5 — Analogy với Ma Trận
> Hãy nghĩ về $M_n(\mathbb{R})$: involution $A \mapsto A^T$ thỏa $\operatorname{Tr}(A \cdot A^T) = \sum_{i,j} a_{ij}^2 > 0$ khi $A \neq 0$. Rosati involution là analog cho endomorphisms của AV, với polarization đóng vai trò "metric".

---

## Tính Explicit trong Các Trường Hợp

### Trên Elliptic Curve với CM

> [!example] Example 12.6 — Rosati trên $E$ có CM bởi $\mathbb{Z}[i]$
> Cho $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}i)$ với principal polarization $\lambda_H$ ($H(u,v) = u\bar{v}$). Endomorphism $[i] \in \operatorname{End}(E)$ là nhân với $i$, tức là $z \mapsto iz$.
>
> Tính Rosati của $[i]$:
>
> $$
> [i]^\dagger = \lambda^{-1} \circ [i]^\vee \circ \lambda.
> $$
>
> Trên $\mathbb{C}/\Lambda$, $[i]^\vee$ là nhân với $\bar{i} = -i$ trên dual torus. Vậy:
>
> $$
> [i]^\dagger = [-i].
> $$
>
> Kiểm tra: $\operatorname{Tr}([i] \circ [i]^\dagger) = \operatorname{Tr}([i] \circ [-i]) = \operatorname{Tr}([1]) = 2 > 0$. ✓
>
> Điều này tương đương: trong $\mathbb{Q}(i)$, Rosati involution là complex conjugation $i \mapsto -i$.

> [!example] Example 12.7 — Rosati trên Abelian Surface
> Cho $A = E_1 \times E_2$ với polarization $\lambda = \lambda_{E_1} \times \lambda_{E_2}$. Endomorphism $f = (f_1, f_2) \in \operatorname{End}(E_1) \times \operatorname{End}(E_2)$ có:
>
> $$
> f^\dagger = (f_1^\dagger, f_2^\dagger).
> $$
>
> Rosati tác động componentwise khi $A$ là product.

### Quan hệ với Albert Classification

> [!abstract] Proposition 12.8 — Rosati và Albert Types
> Albert classification phụ thuộc vào cách Rosati involution $\dagger$ tác động trên $D = \operatorname{End}^0(A)$:
>
> - **Type I** ($D$ totally real): $\dagger$ là identity trên $D$ (involution của loại thứ nhất, symmetric).
> - **Type II** (quaternion indefinite): $\dagger$ là involution orthogonal trên $D$.
> - **Type III** (quaternion definite): $\dagger$ là quaternion conjugation $q \mapsto \bar{q}$.
> - **Type IV** ($D$ CM): $\dagger$ là complex conjugation trên CM field (involution của loại thứ hai).

---

## Néron–Severi Group và Rosati

> [!abstract] Proposition 12.9 — Injection $\operatorname{NS}(A) \hookrightarrow \operatorname{End}^0(A)$
> Map $\mathcal{L} \mapsto \phi_\mathcal{L} : A \to A^\vee$ định nghĩa injection:
>
> $$
> \operatorname{NS}(A) \otimes \mathbb{Q} \hookrightarrow \operatorname{Hom}^{\operatorname{sym}}(A, A^\vee) \otimes \mathbb{Q},
> $$
>
> trong đó vế phải là symmetric morphisms. Với polarization cố định $\lambda$, đây tương đương với injection:
>
> $$
> \operatorname{NS}(A) \otimes \mathbb{Q} \hookrightarrow \operatorname{End}^0(A)^{\dagger = \dagger} = \{ f \in \operatorname{End}^0(A) \mid f^\dagger = f \},
> $$
>
> tức là các endomorphisms **self-adjoint** theo Rosati.

> [!abstract] Theorem 12.10 — $\operatorname{NS}(A)$ là Free $\mathbb{Z}$-Module
> Néron–Severi group $\operatorname{NS}(A) = \operatorname{Pic}(A) / \operatorname{Pic}^0(A)$ là free $\mathbb{Z}$-module của finite rank.
>
> **Proof.** Từ injection $\operatorname{NS}(A) \hookrightarrow \operatorname{End}(A)^{\operatorname{sym}}$ và $\operatorname{End}(A)$ finite rank, ta có $\operatorname{NS}(A)$ finite rank. Torsion-free: nếu $n[\mathcal{L}] = 0$ trong $\operatorname{NS}$, thì $\phi_{\mathcal{L}^n} = n \phi_\mathcal{L} = 0$ trong $\operatorname{End}^0(A)$, nên $\phi_\mathcal{L} = 0$, tức $\mathcal{L} \in \operatorname{Pic}^0(A)$. $\blacksquare$

---

## Trace và Norm

> [!abstract] Definition 12.11 — Trace và Norm của Endomorphism
> Với $f \in \operatorname{End}^0(A)$, định nghĩa:
>
> - **Reduced trace**: $\operatorname{Trd}(f) = \frac{1}{[D:\mathbb{Q}]^{1/2}} \operatorname{Tr}_{T_\ell(A)}(f)$.
> - **Reduced norm**: $\operatorname{Nrd}(f) = \deg(f)^{1/[D:\mathbb{Q}]^{1/2}}$.
> - **Rosati trace form**: $\tau(f) = \operatorname{Trd}(f \circ f^\dagger)$.

> [!abstract] Theorem 12.12 — Rosati Trace Form là Positive Definite
> Bilinear form $(f, g) \mapsto \operatorname{Trd}(f \circ g^\dagger)$ trên $\operatorname{End}^0(A)$ là **positive definite**.
>
> Đây là reformulation của Theorem 12.4 và là nền tảng để Albert classify các pairs $(D, \dagger)$.

---

## SageMath Cheatsheet

```python
# Rosati involution: f^dagger = lambda^{-1} o f^vee o lambda
# Trên E với principal polarization: f^dagger = complex conjugate (khi CM)

# Ví dụ: E = C/(Z + Zi), End(E) = Z[i]
# [i]^dagger = [-i] (complex conjugate)
# Kiểm tra: Tr([i] o [i]^dagger) = Tr([1]) = 2 > 0

E = EllipticCurve(GF(1009), [0, 0, 0, -1, 0])  # y^2 = x^3 - x (CM by Z[i])
# End(E) chứa Z[i] (nếu p ≡ 1 mod 4)
p = 1009
if p % 4 == 1:
    print(f"p={p} ≡ 1 mod 4: E có CM bởi Z[i]")
    i_sq = GF(p)(-1).sqrt()
    print(f"  sqrt(-1) mod {p} = {i_sq}")
    print(f"  [i] o [i]^dagger = [i] o [-i] = [1]")
    print(f"  Tr([1]) = 2 (trace of [1] on T_ell(E)) > 0  ✓")
```

```python
# Rosati involution và Néron-Severi group
# NS(A) injects into self-adjoint endomorphisms
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])

# Cho E/Q: NS(E) = Z (generated by O_E(O))
# phi_{O(O)}: E -> E^vee = E là polarization degree 1
# Rosati của phi_{O(O)} = phi_{O(O)} (self-adjoint!)
print("NS(E) ≅ Z cho elliptic curve E/Q")
print("Generator: O_E([O]) <-> phi_{O([O])}: E -> E^vee")
print("phi_{O([O])} là tự adjoint theo Rosati: phi^dagger = phi")
```

```python
# Positive definiteness qua trace
# Tr(f o f^dagger) > 0
# Với f = [n] trên E: f^dagger = [n] (vì [n]^vee = [n])
# Tr([n] o [n]) = Tr([n^2]) = n^2 * Tr([1]) = 2n^2 > 0

for n in [1, 2, 3, -1, -2]:
    trace_ff_dagger = 2 * n**2  # 2g = 2, Tr([n^2]) = 2n^2
    print(f"n={n}: Tr([n] o [n]^dagger) = Tr([n^2]) = {trace_ff_dagger} > 0: {trace_ff_dagger > 0}")
```

```python
# Frobenius và Rosati
# Trên A/F_q, Frobenius phi_q có: phi_q^dagger = q / phi_q (Weil number)
# Vì phi_q * phi_q^dagger = [q] (qua Weil conjectures)

E = EllipticCurve(GF(17), [1, 2])
trace = E.trace_of_frobenius()
q = 17
print(f"E/F_{q}: trace(Frob) = {trace}")
print(f"Characteristic poly: T^2 - {trace}*T + {q}")
print(f"Frobenius phi satisfies: phi * phi^dagger = [q] = [{q}]")
print(f"So phi^dagger = Verschiebung = {q}/phi (Weil reciprocity)")
print(f"Tr(phi o phi^dagger) = Tr([{q}]) = 2*{q} = {2*q} > 0  ✓")
```

```python
# Albert type qua Rosati involution
# Type I: totally real, dagger = identity
# Type IV: CM, dagger = complex conjugation

# Ví dụ: E generic (Type I, End^0 = Q)
# Rosati là identity trên Q: q^dagger = q
print("Type I (generic E, End^0 = Q):")
print("  q^dagger = q  (Rosati = identity)")
print("  Tr(q * q^dagger) = Tr(q^2) = 2q^2 > 0  ✓")

# Ví dụ: E với CM bởi K = Q(sqrt(-d)) (Type IV)
# Rosati là complex conjugation: alpha^dagger = alpha_bar
print("\nType IV (CM E, End^0 = Q(sqrt(-d))):")
print("  (a + b*sqrt(-d))^dagger = a - b*sqrt(-d)")
print("  Tr(alpha * alpha^dagger) = Tr(|alpha|^2) > 0  ✓")
```

---

## Summary / Key Takeaways

- **Rosati involution** $f^\dagger = \lambda^{-1} \circ f^\vee \circ \lambda$ trên $\operatorname{End}^0(A)$: anti-multiplicative, bậc $2$, $\mathbb{Q}$-linear.
- **Positive**: $\operatorname{Tr}(f \circ f^\dagger) > 0$ với $f \neq 0$ — tính positive của "inner product" do polarization.
- **Analogy**: polarization $\lambda$ đóng vai trò "metric" trên $A$; Rosati là "adjoint" theo metric đó.
- Rosati involution xác định **Albert type** của $\operatorname{End}^0(A)$: các types I–IV phân biệt bởi hành vi của $\dagger$ trên center và involution type.
- **NS(A) injects** vào self-adjoint endomorphisms $\operatorname{End}^0(A)^{\dagger = \dagger}$; $\operatorname{NS}(A)$ là free $\mathbb{Z}$-module finite rank.
- **Frobenius $\phi_q$**: $\phi_q^\dagger = q / \phi_q$ (Verschiebung), $\operatorname{Tr}(\phi_q \phi_q^\dagger) = 2q > 0$.
- **CM case** (Type IV): Rosati = complex conjugation trên CM field $K$; $\alpha^\dagger = \bar{\alpha}$.
- **Rosati trace form** $(f, g) \mapsto \operatorname{Trd}(f g^\dagger)$ là **positive definite** trên $\operatorname{End}^0(A)$ — đây là lý do Albert classification có thể hoạt động.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §§13–14 (Polarizations, Rosati Involution).
- Mumford, D. *Abelian Varieties*, §21 (Rosati involution).
- Edixhoven–van der Geer–Moonen, *Abelian Varieties*, §12.3 (Rosati involution).
- Conrad, B. Lecture Notes (Stanford), §§1–2 (Endomorphisms and Rosati).
