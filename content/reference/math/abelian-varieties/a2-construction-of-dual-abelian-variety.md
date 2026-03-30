---
title: "A2. Construction of the Dual Abelian Variety"
tags: [math, abelian-varieties, appendix]
aliases: [Construction of the Dual Abelian Variety]
created: 2026-03-24
---

> **Xem thêm**: [[08-dual-abelian-variety|08. The Dual Abelian Variety]]
> **Mục tiêu**: Chi tiết kỹ thuật construction algebraic của $A^\vee$ và Poincaré bundle

---

## Tổng Quan

Trong Lesson 08, ta định nghĩa $A^\vee$ qua moduli problem (functor $F_A$) nhưng bỏ qua phần construction algebraic. Appendix này cung cấp chi tiết:

1. Định nghĩa $K(\mathcal{L})$ như group scheme
2. Construction $A^\vee = A / K(\mathcal{L})$ (đặc số 0)
3. Descent của Mumford bundle xuống $A \times A^\vee$
4. Universal property verification

---

## Bước 1: Group Scheme $K(\mathcal{L})$

> [!abstract] Definition A2.1 — $K(\mathcal{L})$ như Scheme
> Cho $A$ abelian variety và $\mathcal{L}$ invertible sheaf. **$K(\mathcal{L})$** là closed subgroup scheme của $A$ xác định bởi functor:
>
> $$
> K(\mathcal{L})(T) = \{ a \in A(T) : t_a^* \mathcal{L}_T \cong \mathcal{L}_T \},
> $$
>
> trong đó $\mathcal{L}_T = \mathcal{L} \times_k T$ (base change lên scheme $T$).

> [!abstract] Proposition A2.2 — Tính chất của $K(\mathcal{L})$
> - $K(\mathcal{L})$ là closed subgroup scheme của $A$.
> - $K(\mathcal{L})(\bar{k}) = \{ a \in A(\bar{k}) : t_a^*\mathcal{L} \cong \mathcal{L} \}$ (geometric points).
> - $\mathcal{L}$ ample $\Leftrightarrow$ $K(\mathcal{L})$ finite (Theorem 6.5, Lesson 06).

---

## Bước 2: Quotient $A^\vee = A / K(\mathcal{L})$

Đây là bước kỹ thuật nhất. Ta cần tồn tại quotient $A / K(\mathcal{L})$ như variety.

> [!abstract] Theorem A2.3 — Quotient bởi Finite Group Scheme
> Cho $A$ abelian variety và $G \subset A$ finite subgroup scheme. Thì quotient $A/G$ tồn tại và là abelian variety.
>
> **Construction**: Phủ $A$ bởi affine opens $U_i = \operatorname{Spec}(R_i)$. Quotient $G$-invariant:
>
> $$
> U_i / G = \operatorname{Spec}(R_i^G)
> $$
>
> (invariant subring). Dán lại bởi transitions, được $A/G$.

Với đặc số $0$ hay $\gcd(\operatorname{char}(k), |G|) = 1$: $G$ étale và $R_i^G \subset R_i$ là finite étale extension. Construction đơn giản hơn.

> [!abstract] Proposition A2.4 — $A^\vee = A / K(\mathcal{L})$ là PPAV (khi $\mathcal{L}$ principal polarization)
> Với $\mathcal{L}$ ample, định nghĩa $A^\vee = A / K(\mathcal{L})$ với projection $\phi_\mathcal{L} : A \to A/K(\mathcal{L}) = A^\vee$.
>
> Ta sẽ thấy $(A^\vee, \phi_\mathcal{L})$ thỏa universal property của dual abelian variety.

---

## Bước 3: Mumford Bundle và Descent

Cần xây dựng **Poincaré bundle** $\mathcal{P}$ trên $A \times A^\vee$.

**Idea**: Trên $A \times A$, xét **Mumford bundle**:
$$
\mathcal{M} = m^* \mathcal{L} \otimes p_1^* \mathcal{L}^{-1} \otimes p_2^* \mathcal{L}^{-1},
$$
trong đó $m : A \times A \to A$ là group law và $p_i$ là projections.

> [!abstract] Lemma A2.5 — Hành Động của $K(\mathcal{L})$ trên $\mathcal{M}$
> $K(\mathcal{L}) \subset A$ tác động trên nhân tử thứ hai của $A \times A$ (qua translation $t_a$ trên $p_2$). Sheaf $\mathcal{M}$ có **$K(\mathcal{L})$-equivariant structure** tương thích với action này.

**Proof.** Restrict $\mathcal{M}$ về $A \times \{a\}$:
$$
\mathcal{M}|_{A \times \{a\}} = t_a^* \mathcal{L} \otimes \mathcal{L}^{-1} = \phi_\mathcal{L}(a).
$$
Với $a \in K(\mathcal{L})$: $\phi_\mathcal{L}(a) = t_a^* \mathcal{L} \otimes \mathcal{L}^{-1}$ là trivial (bởi định nghĩa $K(\mathcal{L})$). $\blacksquare$

> [!abstract] Theorem A2.6 — Descent của $\mathcal{M}$
> Vì $K(\mathcal{L})$ tác động trivially trên fibers $\mathcal{M}|_{A \times \{a\}}$ với $a \in K(\mathcal{L})$, sheaf $\mathcal{M}$ "descends" theo quotient map $\operatorname{id} \times \phi_\mathcal{L} : A \times A \to A \times A^\vee$:
>
> $$
> \mathcal{M} \cong (\operatorname{id} \times \phi_\mathcal{L})^* \mathcal{P}
> $$
>
> cho một unique invertible sheaf $\mathcal{P}$ trên $A \times A^\vee$, gọi là **Poincaré bundle**.

**Descent** cụ thể: Theo lý thuyết descent của Grothendieck, một sheaf $\mathcal{F}$ trên $X$ descends qua $\pi : X \to Y$ khi $\pi$ fppf và $\mathcal{F}$ có **descent data** (isomorphism giữa hai pullbacks của $\mathcal{F}$ lên $X \times_Y X$).

Ở đây: $\pi = \operatorname{id} \times \phi_\mathcal{L}$, descent data cho $\mathcal{M}$ xuất phát từ tính chất $K(\mathcal{L})$-equivariant.

---

## Bước 4: Rigidification

Poincaré bundle cần được **rigidified** (chuẩn hóa) dọc theo $\{0\} \times A^\vee$:

> [!abstract] Definition A2.7 — Rigidification
> $(\mathcal{P}, \iota)$ là **rigidified Poincaré bundle** nếu:
>
> - $\mathcal{P}$ là invertible sheaf trên $A \times A^\vee$.
> - $\iota : \mathcal{P}|_{\{0\} \times A^\vee} \xrightarrow{\sim} \mathcal{O}_{A^\vee}$ là trivialization (chuẩn hóa).
>
> Rigidification đảm bảo uniqueness.

---

## Bước 5: Universal Property

> [!abstract] Theorem A2.8 — Universal Property
> Cặp $(A^\vee, \mathcal{P})$ vừa xây dựng thỏa universal property:
>
> Với mọi $k$-variety $T$ và $\mathcal{L}' \in F_A(T)$ (family of degree-0 line bundles, rigidified), tồn tại unique morphism $\phi : T \to A^\vee$ sao cho $(\operatorname{id} \times \phi)^* \mathcal{P} \cong \mathcal{L}'$.

**Proof sketch.**

**Existence**: Set-theoretically, $\phi(t)$ là unique $a \in A^\vee(\bar{k})$ sao cho $\mathcal{P}|_{A \times \{a\}} \cong \mathcal{L}'|_{A \times \{t\}}$. Vì $A^\vee(k) = \operatorname{Pic}^0(A)$, điều này xác định $\phi$ trên points.

**Morphism**: $\phi$ là morphism vì nó là "classifying map" của family line bundles $\mathcal{L}'$. Chuẩn xác: dùng representability của $F_A$ bởi $A^\vee$ (được xây dựng ở bước 2–4) và sự duy nhất của morphism đến fine moduli space.

**Uniqueness**: Từ rigidification, morphism đến $A^\vee$ xác định duy nhất bởi pulled back Poincaré bundle. $\blacksquare$

---

## Bước 6: Biduality

> [!abstract] Theorem A2.9 — $(A^\vee)^\vee \cong A$
> Xét $A$ như "dual của $A^\vee$": symmetric Poincaré bundle cho morphism $\kappa : A \to (A^\vee)^\vee$ qua universal property. $\kappa$ là isomorphism.

**Proof.** Trên complex tori: $(A^\vee)^\vee = (\bar{V}^\vee/\Lambda^\vee)^\vee = \overline{(\bar{V}^\vee)}^\vee / (\Lambda^\vee)^\vee = V / \Lambda = A$.

Algebraically: Kiểm tra $\kappa$ injective (finite kernel) và surjective ($\dim = \dim A = g$), nên isomorphism. $\blacksquare$

---

## Characteristic $p$ Case

> [!note] Remark A2.10 — Đặc Số $p$
> Trong đặc số $p$, $K(\mathcal{L})$ không cần étale — có thể có phần "infinitesimal" (connected-local group scheme). Construction vẫn hoạt động nhưng cần:
>
> - Group scheme $K(\mathcal{L})$ thay vì discrete group.
> - Quotient bởi **flat** group scheme (không chỉ étale).
> - Cartier duality cho $n$-torsion group schemes.
>
> Kết quả: $A^\vee$ tồn tại trong mọi đặc số, nhưng proof kỹ thuật hơn.

---

## Tóm Tắt Construction

```text
L ample trên A
     ↓
K(L) = ker(phi_L) là finite group scheme
     ↓
A^vee = A / K(L) (quotient abelian variety)
     ↓
Mumford bundle M trên A x A
     ↓
K(L)-equivariant structure của M
     ↓
Descent: M -> Poincare bundle P trên A x A^vee
     ↓
Rigidification: (P, iota)
     ↓
Verification: (A^vee, P) satisfies universal property F_A
     ↓
Biduality: (A^vee)^vee ≅ A
```

---

## References

- Mumford, D. *Abelian Varieties*, §§8–13 (Dual Abelian Variety construction).
- Milne, J.S. *Abelian Varieties* (v2.0), §§10–11 (Polarizations, Dual Exact Sequence).
- Notes from "Abelian reasons and a variety of examples" (Columbia), §§25–27.
- SGA 7, Exposé VIII (Dualité des variétés abéliennes sur un corps).
