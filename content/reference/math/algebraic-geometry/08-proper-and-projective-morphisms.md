---
title: "08. Proper & Projective Morphisms"
tags: [math, algebraic-geometry, lesson-08, proper, projective]
aliases: [Proper and Projective Morphisms]
created: 2026-03-31
---

> **Prerequisites**: [[07-properties-of-schemes|07. Properties of Schemes & Morphisms]]
> **Objectives**:
> - Định nghĩa proper morphism và hiểu vai trò của valuative criterion
> - Phân tích projective morphisms và quan hệ với proper
> - Nắm Chow's lemma: mọi proper morphism xấp xỉ projective
> - Thấy tại sao properness là analog algebraic của compactness

---

## Motivation / Intuition

Trong topo học, ánh xạ giữa các compact Hausdorff spaces gọi là "proper" khi preimage của compact là compact. Trong algebraic geometry:

- **Compact** $\leftrightarrow$ **proper over $\operatorname{Spec} k$** (hay **complete** trong ngôn ngữ cũ).
- $\mathbb{P}^n$ proper over $k$, còn $\mathbb{A}^n$ thì không.
- Proper morphisms "không cho điểm chạy ra vô cực" — hình dung: nếu một đường cong đến $X$ qua điểm generic thì nó phải có giới hạn tại điểm closed.

Properness đảm bảo nhiều định lý quan trọng: proper pushforward của coherent sheaf là coherent, cohomology hữu hạn chiều, v.v.

---

## Proper Morphism

### Definition

> [!definition] Definition 8.1 — Proper Morphism (ánh xạ proper)
> Morphism $f : X \to Y$ là **proper** nếu:
>
> 1. $f$ là **separated**,
> 2. $f$ là **of finite type**,
> 3. $f$ là **universally closed**: với mọi $Y' \to Y$, base change $f' : X \times_Y Y' \to Y'$ là closed map (trên underlying topological spaces).

> [!note] Remark 8.2
> "Universally closed" là điều kiện quan trọng — chỉ "closed" chưa đủ. Cần closed sau mọi base change.

### Worked Example

> [!example] Example 8.3 — Proper và không proper
>
> - $\mathbb{P}^n_k \to \operatorname{Spec} k$: **proper**. Đây là ví dụ căn bản nhất.
> - $\mathbb{A}^n_k \to \operatorname{Spec} k$: **không proper** ($n \geq 1$). Intuition: sequence điểm $(n, 0, \ldots)$ không có giới hạn trong $\mathbb{A}^n$.
> - Closed immersion: luôn **proper** (finite type, separated, universally closed vì closed maps stable under base change).
> - Finite morphism: luôn **proper**.
> - Composition của proper morphisms: **proper**.

---

## Valuative Criterion for Properness

### Theorem

> [!theorem] Theorem 8.4 — Valuative Criterion for Properness
> Morphism của finite type $f : X \to Y$ là proper $\iff$ với mọi valuation ring $R$, fraction field $K = \operatorname{Frac}(R)$, và mọi diagram commutative
>
> $$
> \begin{array}{ccc}
> \operatorname{Spec} K & \xrightarrow{u} & X \\
> \downarrow & & \downarrow f \\
> \operatorname{Spec} R & \xrightarrow{v} & Y
> \end{array}
> $$
>
> tồn tại **đúng một** morphism $w : \operatorname{Spec} R \to X$ sao cho $f \circ w = v$ và $w|_{\operatorname{Spec} K} = u$.

> [!note] Remark 8.5 — Hình học của valuative criterion
> $\operatorname{Spec} R$ là "đoạn cong" với điểm generic $\eta = \operatorname{Spec} K$ và điểm closed $s = \operatorname{Spec} k(s)$.
>
> - **Separated**: nhiều nhất một extension.
> - **Proper**: đúng một extension — mọi "đường cong" vào $X$ đều có giới hạn duy nhất. Đây là analog của: trong compact Hausdorff space, mọi net có subnet hội tụ, và limit là duy nhất (Hausdorff).

### Worked Example

> [!example] Example 8.6 — Properness của $\mathbb{P}^1$
> Lấy $k = \mathbb{C}$, $R = \mathbb{C}[[t]]$ (power series ring), $K = \mathbb{C}((t))$ (Laurent series).
>
> Morphism $u : \operatorname{Spec} K \to \mathbb{P}^1$ tương ứng với một điểm $[f_0(t): f_1(t)]$ với $f_i \in K$.
>
> Ta có thể viết $[f_0: f_1] = [t^a g_0: t^b g_1]$ với $g_i(0) \neq 0$ và $a \leq b$ chẳng hạn. Khi đó $[t^{a-b}g_0: g_1] \to [0: g_1(0)] \in \mathbb{P}^1$ khi $t \to 0$.
>
> Limit luôn tồn tại và duy nhất: $\mathbb{P}^1$ proper. Ngược lại, $[t^{-1}: 1] \in \mathbb{A}^1$ không có limit khi $t \to 0$: $\mathbb{A}^1$ không proper.

---

## Projective Morphisms

### Definition

> [!definition] Definition 8.7 — Projective Morphism
> Morphism $f : X \to Y$ là **projective** nếu có factorization
>
> $$
> X \hookrightarrow \mathbb{P}^n_Y \to Y
> $$
>
> trong đó $X \hookrightarrow \mathbb{P}^n_Y$ là closed immersion và $\mathbb{P}^n_Y := \mathbb{P}^n_\mathbb{Z} \times_{\operatorname{Spec}\mathbb{Z}} Y$.
>
> Tổng quát hơn, $f$ là **quasi-projective** nếu có factorization $X \hookrightarrow \mathbb{P}^n_Y \to Y$ với $X \hookrightarrow \mathbb{P}^n_Y$ là **locally closed immersion**.

> [!theorem] Theorem 8.8 — Projective $\Rightarrow$ Proper
> Mọi projective morphism (của finite type) là proper.

**Proof.**
Projective morphism = closed immersion (proper) + $\mathbb{P}^n_Y \to Y$ (cần chứng minh proper). $\mathbb{P}^n_Y \to Y$ là base change của $\mathbb{P}^n_\mathbb{Z} \to \operatorname{Spec}\mathbb{Z}$, và proper morphisms stable under base change và composition. $\mathbb{P}^n_\mathbb{Z}$ proper over $\mathbb{Z}$ được chứng minh bằng valuative criterion. $\blacksquare$

> [!warning] Counterexample 8.9 — Proper không nhất thiết projective
> Tồn tại proper varieties không phải projective — ví dụ của Nagata (1958) và Hironaka. Hironaka xây dựng proper 3-fold non-algebraic. Tuy nhiên, Chow's lemma cho thấy mọi proper morphism "gần" là projective.

---

## Chow's Lemma

### Theorem

> [!theorem] Theorem 8.10 — Chow's Lemma
> Cho $f : X \to S$ là proper morphism với $S$ Noetherian. Khi đó tồn tại scheme $X'$ và morphisms
>
> $$
> X' \xrightarrow{g} X, \quad X' \xrightarrow{h} S,
> $$
>
> với $h$ **projective** và $g$ birational (isomorphism trên open dense subset của $X$).
>
> Tức là, mọi proper scheme có "birational model" projective.

> [!note] Remark 8.11 — Ý nghĩa
> Chow's lemma cho phép ta "xấp xỉ" proper bằng projective và chứng minh nhiều định lý cho proper bằng cách reduce về projective case (dễ tính hơn).

---

## Finite Morphisms

### Definition

> [!definition] Definition 8.12 — Finite Morphism
> Morphism $f : X \to Y$ là **finite** nếu với mọi affine open $V = \operatorname{Spec} B \subseteq Y$, $f^{-1}(V) = \operatorname{Spec} A$ với $A$ là $B$-module **hữu hạn sinh** (finitely generated as $B$-module).

> [!theorem] Theorem 8.13 — Finite $\Rightarrow$ Proper, Affine
> Mọi finite morphism là proper và affine. Đặc biệt, finite morphism có finite fibers.

### Worked Example

> [!example] Example 8.14 — Finite morphisms
>
> **Normalization**: $\operatorname{Spec} k[t] \to \operatorname{Spec} k[t^2, t^3]$. Map $k[t^2,t^3] \hookrightarrow k[t]$ làm $k[t]$ thành $k[t^2,t^3]$-module sinh bởi $\{1, t\}$. Finite morphism.
>
> **Field extension**: $\operatorname{Spec} k[x]/(x^n-a) \to \operatorname{Spec} k[x]/(x^n - a, y) \cong \operatorname{Spec} k$ là finite khi $\deg = n$.
>
> **Ramification**: $\operatorname{Spec} \mathbb{Z}[i] \to \operatorname{Spec} \mathbb{Z}$. $\mathbb{Z}[i]$ là $\mathbb{Z}$-module với basis $\{1, i\}$. Finite morphism, ramified at $(2)$ (vì $(2) = (1+i)^2$ trong $\mathbb{Z}[i]$).

---

## Ample Line Bundles và Projective Embeddings

### Definition

> [!definition] Definition 8.15 — Very Ample và Ample
> Cho $f : X \to Y$ là morphism và $\mathcal{L}$ là line bundle (locally free $\mathcal{O}_X$-module of rank 1) trên $X$.
>
> $\mathcal{L}$ là **very ample relative to $f$** nếu có closed immersion $i : X \hookrightarrow \mathbb{P}^n_Y$ với $i^*\mathcal{O}(1) \cong \mathcal{L}$.
>
> $\mathcal{L}$ là **ample** nếu $\mathcal{L}^{\otimes m}$ là very ample cho $m$ đủ lớn.

> [!theorem] Theorem 8.16 — Characterization of Projective Morphisms
> Morphism $f : X \to Y$ of finite type với $Y$ Noetherian là projective $\iff$ có relatively ample line bundle trên $X$.

---

## SageMath Cheatsheet

```python
# Proper và projective morphisms trong Sage

# Projective variety (inherently proper over its base field)
P2 = ProjectiveSpace(2, QQ)
x, y, z = P2.coordinate_ring().gens()

# Closed subscheme of P^2 (projective curve - proper)
C = P2.subscheme(y^2*z - x^3 + x*z^2)  # Elliptic curve in P^2
print(C.dimension())                     # 1: curve
print(C.is_smooth())                     # True if smooth

# Finite morphisms: number field extensions
K.<a> = NumberField(x^3 - 2)    # Q(2^{1/3})
OK = K.ring_of_integers()        # Z[2^{1/3}], finite over Z
print(OK.rank())                 # 3: rank as Z-module

# Normalization (finite morphism)
R = QQ['t']
t = R.gen()
S = QQ['u', 'v'].quotient(QQ['u','v'].gen(0)^2 - QQ['u','v'].gen(1)^3)
# S = QQ[u,v]/(u^2-v^3): coordinate ring of cusp
# Normalization: QQ[t] via t -> (t^2, t^3)

# Valuative criterion: check properness of P^1
P1 = ProjectiveSpace(1, QQ)
# P1 is proper: every curve has limit
# Intuition: [1:t] -> [1:0] = [1:0] as t -> 0 in P^1
# Compare: 1/t has no limit as t -> 0 in A^1
```

---

## Summary / Key Takeaways

- **Proper** = separated + finite type + universally closed — analog algebraic của compact.
- **Valuative criterion (properness)**: mọi "đường cong vào $X$" có đúng một limit — uniqueness (separated) + existence (universally closed).
- **Projective** = closed immersion vào $\mathbb{P}^n_Y$ — projective $\Rightarrow$ proper.
- **Chow's lemma**: mọi proper scheme có birational projective model.
- **Finite** = proper + affine + finite fibers — "covering" hữu hạn.
- $\mathbb{P}^n$ proper, $\mathbb{A}^n$ không proper ($n \geq 1$).

---

## References

- Vakil, R. *The Rising Sea* (2024), Chapters 16–18.
- Hartshorne, R. *Algebraic Geometry*, Chapter II §4.
- Grothendieck, A. *EGA II*, §5–6.
- Liu, Q. *Algebraic Geometry and Arithmetic Curves*, Chapter 3, §3.
