---
title: "14. The Abel–Jacobi Map"
tags: [math, abelian-varieties, lesson-14]
aliases: [The Abel-Jacobi Map]
created: 2026-03-24
---

> **Prerequisites**: [[13-jacobian-varieties|13. Abel's Theorem & Construction of Jacobian]], [[08-dual-abelian-variety|08. The Dual Abelian Variety]]
> **Objectives**:
> - Hiểu Abel–Jacobi map $f_{P_0} : C \to J(C)$ như morphism của varieties
> - Chứng minh $f_{P_0}$ là **immersion** (injective + injective on tangent vectors) khi $g \geq 1$
> - Hiểu injectivity của $f_{P_0}$ trên points và tại sao $f_{P_0}(C) \neq J(C)$ khi $g \geq 2$
> - Biết $C$ generates $J(C)$ như group và hệ quả
> - Hiểu Jacobian như moduli space qua symmetric powers $C^{(d)}$

---

## Motivation / Intuition

Trong Lesson 13, ta xây dựng $J(C)$ và biết $J(C)(\bar{k}) \cong \operatorname{Pic}^0(C)$. Nhưng curve $C$ tự nhúng vào $J(C)$ như thế nào?

Với base point $P_0 \in C(k)$, Abel–Jacobi map $f_{P_0} : C \to J(C)$ gửi $P \mapsto [P - P_0]$ là morphism của varieties (không chỉ là map trên points). Câu hỏi:

1. **$f_{P_0}$ có injective không?** Đây tương đương: "hai điểm khác nhau trên $C$ có cùng class trong $\operatorname{Pic}^0$ không?" — tức là có hàm hữu tỉ với zero tại $P$ và pole tại $Q$ không?
2. **$f_{P_0}(C)$ chiếm bao nhiêu của $J(C)$?** Khi $g = 1$: $f_{P_0} : E \to J(E) = E$ là isomorphism. Khi $g \geq 2$: $C$ chỉ là subvariety dim 1 trong $J(C)$ dim $g$.
3. **$C$ generate $J(C)$ như thế nào?** Sau khi "cộng" đủ points từ $C$, ta lấp đầy $J(C)$.

---

## Abel–Jacobi Map là Morphism

> [!abstract] Proposition 14.1 — $f_{P_0}$ là Morphism
> Cho $C$ smooth projective curve, $P_0 \in C(k)$ base point. Map:
>
> $$
> f_{P_0} : C \to J(C), \quad P \mapsto [\mathcal{O}_C(P - P_0)],
> $$
>
> là morphism của varieties trên $k$.

**Proof.** Cần xây dựng morphism của varieties, không chỉ map trên points. Với $P_0$ fixed, xét universal property: $\mathcal{O}_C(P - P_0)$ là family line bundle trên $C$ parametrized bởi $C$ (tức là line bundle trên $C \times C$ restrict đúng về mỗi fiber). Áp dụng universal property của $J(C) = \operatorname{Pic}^0_{C/k}$: family này xác định unique morphism $C \to J(C)$. $\blacksquare$

> [!abstract] Definition 14.2 — Abel–Jacobi Map
> **Abel–Jacobi map** tương ứng base point $P_0$ là morphism $f_{P_0} : C \to J(C)$, $P \mapsto [P - P_0]$.
>
> Thay đổi $P_0$: nếu $P_0' \in C(k)$ là base point khác, thì $f_{P_0'} = f_{P_0} + c$ với $c = [P_0 - P_0'] \in J(C)$ là translation. Vậy $f_{P_0}$ và $f_{P_0'}$ khác nhau đúng một translation — và translation không ảnh hưởng đến nhiều tính chất quan trọng.

---

## Injectivity

> [!abstract] Theorem 14.3 — $f_{P_0}$ là Injection (khi $g \geq 1$)
> Nếu $C$ có genus $g \geq 1$, thì Abel–Jacobi map $f_{P_0} : C \to J(C)$ là **injective** (khi nhìn trên $\bar{k}$-points).

**Proof.**

Giả sử $f_{P_0}(P) = f_{P_0}(Q)$ với $P, Q \in C(\bar{k})$. Khi đó $[P - P_0] = [Q - P_0]$ trong $\operatorname{Pic}^0(C)$, tức là $[P] - [Q]$ là divisor của một rational function $h \in k(C)^*$:

$$
\operatorname{div}(h) = [P] - [Q].
$$

Vậy $h : C \to \mathbb{P}^1$ là map với đúng một pole (tại $Q$) và một zero (tại $P$). Map này có degree $1$, nên là **isomorphism** $C \cong \mathbb{P}^1$.

Nhưng $g(C) = g \geq 1$ và $g(\mathbb{P}^1) = 0$ — **mâu thuẫn**! Vậy $P = Q$. $\blacksquare$

> [!note] Remark 14.4
> Chứng minh trên cho thấy: curve genus $\geq 1$ **không** là rational ($\not\cong \mathbb{P}^1$). Đây là lý do tại sao injectivity fail khi $g = 0$: $\mathbb{P}^1$ có $J = 0$ và $f_{P_0}$ gửi mọi điểm về $0$.

---

## Immersion

> [!abstract] Theorem 14.5 — $f_{P_0}$ là Immersion (khi $g \geq 1$)
> Abel–Jacobi map $f_{P_0} : C \hookrightarrow J(C)$ là **closed immersion** — injective và injective on tangent vectors tại mọi điểm.

**Proof** (injective on tangent vectors tại $P$).

Tangent vector của $C$ tại $P$ là element của $T_{C,P} = H^0(C, \mathcal{O}_C(2P)/\mathcal{O}_C(P))^*$... Đơn giản hơn: cần $df_{P_0} : T_{C,P} \to T_{J,f_{P_0}(P)} = H^1(C, \mathcal{O}_C)$ là injection.

Tangent map $df_{P_0}$ nhận $t \in T_{C,P}$ và gửi sang:
$$
df_{P_0}(t) \in H^1(C, \mathcal{O}_C) = \operatorname{Lie}(J(C)).
$$

Theo lý thuyết Picard scheme, $df_{P_0}(t)$ ứng với "first-order deformation" của line bundle $\mathcal{O}(P - P_0)$ theo hướng $t$. Điều này tương ứng với map (Kodaira-Spencer):

$$
T_{C,P} \xrightarrow{\cong} H^0(C, \mathcal{O}(2P)/\mathcal{O}(P)) \hookrightarrow H^1(C, \mathcal{O}_C).
$$

Map cuối là injection vì $H^0(C, \mathcal{O}(P)) = k$ (với $g \geq 1$, không có non-constant functions với single simple pole), nên không có "cancellation". $\blacksquare$

---

## $f_{P_0}(C)$ trong $J(C)$

### Symmetric powers và Abel maps

Để hiểu hình ảnh $C \subset J(C)$, ta xét **symmetric powers** $C^{(d)}$ và **extended Abel maps**:

> [!abstract] Definition 14.6 — Symmetric Power và $\sigma_d$
> $C^{(d)} = C^d / S_d$ là **$d$-th symmetric power** — moduli của effective divisors degree $d$ trên $C$.
>
> **Abel map bậc $d$**:
>
> $$
> \sigma_d : C^{(d)} \to J(C), \quad \{P_1, \ldots, P_d\} \mapsto \left[\sum_{i=1}^d P_i - d P_0\right].
> $$

> [!abstract] Theorem 14.7 — $\sigma_d$ là Birational khi $d = g$
> Abel map $\sigma_g : C^{(g)} \to J(C)$ là **birational** — isomorphism trên open dense subset.
>
> Cụ thể, trên $\bar{k}$: $\sigma_g$ surjective (Jacobi inversion) và generic fiber là singleton (Riemann–Roch).

**Proof sketch.** Fiber của $\sigma_g$ tại $[D_0] \in J(C)$: tập các effective divisors degree $g$ trong class $[D_0 + gP_0]$ = complete linear system $|D_0 + gP_0|$. Theo Riemann–Roch: $\dim |D_0 + gP_0| = \dim H^0(\mathcal{O}(D_0 + gP_0)) - 1 \geq g - g = 0$. Với "generic" $D_0$, $\dim = 0$, tức là fiber là single point. $\blacksquare$

> [!abstract] Theorem 14.8 — Image của $C$ Generates $J(C)$
> Hình ảnh $f_{P_0}(C) \subset J(C)$ **generates** $J(C)$ như algebraic group: nhóm con được sinh bởi $f_{P_0}(C)$ (qua cộng và trừ) là toàn bộ $J(C)$.
>
> **Proof.** Từ $\sigma_g$ surjective: mọi element của $J(C)$ viết được dạng $[P_1] + \cdots + [P_g] - g[P_0] = f_{P_0}(P_1) + \cdots + f_{P_0}(P_g)$. $\blacksquare$

---

## Wn: Subvarieties của Jacobian

> [!abstract] Definition 14.9 — $W_d \subset J(C)$
> Với $0 \leq d \leq g$, đặt:
>
> $$
> W_d = \sigma_d(C^{(d)}) \subset J(C)
> $$
>
> là ảnh của Abel map bậc $d$. Đây là **subvariety** chiều $d$ của $J(C)$ (khi $d \leq g$).
>
> Đặc biệt:
> - $W_0 = \{0\}$ (chỉ gồm điểm gốc).
> - $W_1 = f_{P_0}(C)$ (ảnh của $C$, chiều $1$).
> - $W_{g-1} = \Theta$ (theta divisor).
> - $W_g = J(C)$ (toàn bộ Jacobian).

> [!abstract] Theorem 14.10 — Riemann Singularity Theorem
> Với PPAV $(J(C), \Theta)$, singular locus của $\Theta$ là:
>
> $$
> \operatorname{Sing}(\Theta) = W_{g-2} + (g-2) \text{ copies}.
> $$
>
> Cụ thể, $\Theta$ có singularity ở $[D - (g-1)P_0]$ khi và chỉ khi $\dim H^0(\mathcal{O}(D)) \geq 2$, tức là $D$ là **special divisor**.

---

## Jacobian như Moduli Space

Jacobian có hai mô tả moduli quan trọng:

> [!abstract] Theorem 14.11 — Jacobian như Moduli của Degree-0 Line Bundles
> $J(C) = \operatorname{Pic}^0(C)$ — fine moduli space (với rigidification) của degree-0 line bundles trên $C$.

> [!abstract] Theorem 14.12 — Jacobian như Albanese
> $(J(C), f_{P_0})$ là **Albanese variety** của $C$: initial object trong category của (abelian variety, morphism từ $C$ gửi $P_0 \to 0$).
>
> Với mọi $\varphi : C \to A$ với $A$ abelian variety, $\varphi(P_0) = 0$: tồn tại unique $h : J(C) \to A$ với $\varphi = h \circ f_{P_0}$.

---

## Hệ Quả: Matsusaka's Theorem

> [!abstract] Theorem 14.13 — Matsusaka (1959)
> Mọi abelian variety $A$ là quotient của Jacobian của một curve:
>
> $$
> A \cong J(C) / B
> $$
>
> với $C$ curve, $B \subset J(C)$ abelian subvariety.
>
> **Tức là**: mọi AV isogenous với quotient của $J(C)$.

---

## SageMath Cheatsheet

```python
# Abel-Jacobi map: P |-> [P - P_0] trong J(C) = E
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P0 = E(0)  # base point (điểm gốc)

# Abel-Jacobi map trên E: P |-> [P] - [P0] = P - 0 = P
P = E([16, -61])
Q = E([-1, 4])

# f_{P0}(P) = P - P0 = P - O = P trong J(E) = E
abel_P = P - P0  # cộng trong E
abel_Q = Q - P0
print(f"f_O({P}) = {abel_P}")
print(f"f_O({Q}) = {abel_Q}")

# Injectivity: P != Q => f(P) != f(Q)
print(f"Injective: f(P) = f(Q)? {abel_P == abel_Q}")  # False
```

```python
# Abel map bậc d: C^(d) -> J(C)
# sigma_d({P1,...,Pd}) = [P1 + ... + Pd - d*P0]
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P0 = E(0)
P = E([16, -61])
Q = E([-1, 4])
R = E([0, 0])

# sigma_2({P, Q}) = [P + Q - 2*P0] = P + Q trong J(E) = E
sigma_2_PQ = (P + Q) - 2*P0
print(f"sigma_2({{P,Q}}) = {sigma_2_PQ}")

# sigma_3({P, Q, R}) = P + Q + R trong J(E) = E
sigma_3_PQR = (P + Q + R) - 3*P0
print(f"sigma_3({{P,Q,R}}) = {sigma_3_PQR}")
```

```python
# Symmetric power C^(g) -> J(C) là birational khi d=g
# Với g=1 (elliptic curve): sigma_1: C^(1) = C -> J(C) = C là isomorphism

E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
# sigma_1: C -> J(C) = E, P |-> [P - O] = P
P = E([16, -61])
print("sigma_1 = Abel map = identity (vì J(E) = E)")
print(f"sigma_1({P}) = {P - E(0)} = {P}")

# Với g=2: sigma_2: C^(2) -> J(C) birational
# Fiber generic: 1 điểm (Riemann-Roch)
# Fiber đặc biệt: P^r với r = dim |D| - 1
```

```python
# W_d subvarieties trong J(C)
# Với curve C genus g: W_0 = {0}, W_1 = C, ..., W_{g-1} = Theta, W_g = J

g = 3  # ví dụ genus 3
for d in range(g + 1):
    if d == 0:
        desc = "điểm gốc {0}"
    elif d == 1:
        desc = "ảnh của C (chiều 1)"
    elif d == g - 1:
        desc = "Theta divisor (chiều g-1)"
    elif d == g:
        desc = "toàn bộ J(C)"
    else:
        desc = f"subvariety chiều {d}"
    print(f"W_{d} = {desc}")
```

```python
# Abel-Jacobi map trên hyperelliptic curve genus 2
R.<x> = QQ[]
f = x^5 - x^3 + 1  # genus 2 hyperelliptic
C = HyperellipticCurve(f)
J = C.jacobian()
print(f"C: genus = {C.genus()}")
print(f"J(C): abelian surface dim 2")

# Điểm trên C
pt = C.lift_x(0)  # điểm trên C với x=0
print(f"Điểm trên C: {pt}")

# Abel-Jacobi map: điểm -> element của J(C)
j_pt = J(pt)
print(f"Abel-Jacobi map: {pt} -> {j_pt} trong J(C)")
```

---

## Summary / Key Takeaways

- **Abel–Jacobi map** $f_{P_0} : C \to J(C)$, $P \mapsto [P - P_0]$: morphism varieties canonical.
- **Injectivity**: $f_{P_0}$ injective khi $g \geq 1$ — $P \neq Q$ implies $[P] \neq [Q]$ trong $\operatorname{Pic}^0(C)$.
- **Closed immersion**: $f_{P_0}$ injective + injective on tangent vectors; $C \hookrightarrow J(C)$ là closed subvariety.
- **Symmetric power**: Abel map bậc $d$: $\sigma_d : C^{(d)} \to J(C)$, $\{P_i\} \mapsto [\sum P_i - dP_0]$.
- **$\sigma_g$ birational**: $C^{(g)} \to J(C)$ là birational — Jacobian "almost equals" symmetric power.
- **$f_{P_0}(C)$ generates** $J(C)$: cộng đủ điểm từ $C$ lấp đầy $J(C)$.
- **$W_d = \sigma_d(C^{(d)})$**: chain subvarieties $W_0 \subset W_1 \subset \cdots \subset W_{g-1} = \Theta \subset W_g = J(C)$.
- **Riemann Singularity**: $\operatorname{Sing}(\Theta) = W_{g-2}$ — singularities của theta divisor ứng với special divisors.
- **Albanese**: $(J(C), f_{P_0})$ thỏa universal property — initial map sang abelian varieties.
- **Matsusaka**: mọi AV là quotient của Jacobian.

---

## References

- Milne, J.S. *Jacobian Varieties* (course notes), §§3, 5, 6, jmilne.org.
- Griffiths, P. & Harris, J. *Principles of Algebraic Geometry*, §2.3.
- Arbarello et al. *Geometry of Algebraic Curves*, Vol. I, §1.3–1.5.
- Landesman, A. *Exercises on the Moduli Spaces and the Torelli Map* (AWS 2024).
