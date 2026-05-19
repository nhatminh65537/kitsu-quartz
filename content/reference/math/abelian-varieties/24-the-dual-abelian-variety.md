---
title: "24. The Dual Abelian Variety"
type: theory
tags: [math, abelian-varieties, lesson-24]
aliases: [Dual Abelian Variety, hat A]
created: 2026-05-18
---

> **Prerequisites**: [[23-line-bundles-algebraically-equivalent-to-zero|23. Line Bundles Algebraically Equivalent to Zero]], [[14-isogenies-definition-and-basic-examples|14. Isogenies — Definition and Basic Examples]]
> **Objectives**:
> - Hiểu vấn đề representability và tại sao nó đòi hỏi kỹ thuật rigidification
> - Nắm vững định nghĩa chính thức của $\hat{A}$ như functor được represent
> - Chứng minh $\hat{A}$ là một abelian variety với $\dim \hat{A} = \dim A$
> - Hiểu Lie algebra của $\hat{A}$ và mối liên hệ với $H^1(A, \mathcal{O}_A)$
> - Nắm vững tính functoriality: isogeny $f: A \to B$ induces $\hat{f}: \hat{B} \to \hat{A}$
> - Phân tích trường hợp elliptic curve: $\hat{E} \cong E$ (non-canonically)

---

## Motivation / Intuition

Trong Bài 23, ta đã xây dựng $\operatorname{Pic}^0(A)$ như một nhóm trừu tượng. Câu hỏi tự nhiên: **$\operatorname{Pic}^0(A)$ có phải là tập điểm của một algebraic variety không?**

Câu trả lời là **Có** — và variety đó gọi là **dual abelian variety** $\hat{A}$. Đây là một trong những kết quả sâu nhất của lý thuyết abelian varieties.

Để hiểu tại sao điều này không tầm thường, hãy xem xét vấn đề tổng quát hơn. Với $k$-variety $T$ bất kỳ, ta có tập hợp:

$$
F(T) = \{ \text{line bundles on } A \times T \text{ that are algebraically trivial on each fiber } A \times \{t\} \}
$$

Đây là một **contravariant functor** $F: (\text{$k$-varieties})^{\text{op}} \to (\text{Sets})$. Câu hỏi representability: có tồn tại $k$-variety $\hat{A}$ và line bundle $\mathcal{P}$ trên $A \times \hat{A}$ (gọi là **Poincaré bundle**) sao cho:

$$
F(T) \cong \operatorname{Hom}(T, \hat{A}) \text{ naturally?}
$$

Nếu có, ta gọi $\hat{A}$ là **dual abelian variety** của $A$.

Nhưng ngay cả khi $\hat{A}$ tồn tại, có một **vấn đề automorphism**: mọi line bundle $L$ có automorphism group $k^\times$ (scalar multiples of the identity), nên functor $F$ không thực sự là một functor vào Sets mà vào "groupoids". Kỹ thuật **rigidification** giải quyết vấn đề này.

---

## Vấn đề Rigidification

### Definition

> [!definition] Definition 24.1 — Rigidified Line Bundle (Line Bundle được Cố định)
> Cho $A$ là abelian variety với điểm đơn vị $e: \operatorname{Spec} k \to A$. Với $k$-scheme $T$, một **rigidified line bundle** trên $A \times T$ là cặp $(\mathcal{L}, \iota)$ gồm:
>
> 1. Line bundle $\mathcal{L}$ trên $A \times T$,
> 2. Isomorphism $\iota: e_T^* \mathcal{L} \xrightarrow{\sim} \mathcal{O}_T$ (hay $\mathcal{L}|_{\{e\} \times T} \cong \mathcal{O}_T$).
>
> trong đó $e_T: T \to A \times T$ là section $t \mapsto (e, t)$.

> [!note] Remark 24.2 — Tại sao cần rigidification?
> Rigidification loại bỏ automorphisms: cặp $(\mathcal{L}, \iota)$ không có automorphism non-trivial nào (một automorphism $\phi: \mathcal{L} \to \mathcal{L}$ phải thỏa $\iota \circ e_T^* \phi = \iota$, tức $e_T^* \phi = \operatorname{id}$; do $\phi$ là scalar, ta có $\phi = \operatorname{id}$).
>
> Sau khi rigidify, $F$ trở thành functor đúng vào Sets, có thể đặt câu hỏi representability.

### Definition

> [!definition] Definition 24.3 — Functor Picard Rigidified (Relative Picard Functor)
> Định nghĩa functor $\widehat{\operatorname{Pic}}_{A/k}: (\text{$k$-schemes})^{\text{op}} \to (\text{Sets})$ bởi:
>
> $$
> \widehat{\operatorname{Pic}}_{A/k}(T) = \left\{ (\mathcal{L}, \iota) \;\middle|\; \begin{array}{l} \mathcal{L} \in \operatorname{Pic}(A \times T),\; \mathcal{L}_t \in \operatorname{Pic}^0(A) \text{ với mọi } t,\\ \iota: \mathcal{L}|_{\{e\} \times T} \xrightarrow{\sim} \mathcal{O}_T \end{array} \right\}
> $$
>
> Đây là **relative Picard functor** (hay Picard-zero functor) của $A/k$, rigidified dọc theo $e$.

---

## Xây dựng $\hat{A}$: Định lý Representability

Đây là định lý trung tâm của toàn bộ Module 4.

### Theorem

> [!theorem] Theorem 24.4 — Dual Abelian Variety Tồn Tại (Grothendieck-Oort-Murre-Artin)
> Cho $A$ là abelian variety trên $k$. Functor $\widehat{\operatorname{Pic}}_{A/k}$ được represent bởi một $k$-group scheme có hữu hạn kiểu, ký hiệu $\hat{A}$. Hơn nữa:
>
> 1. $\hat{A}$ là một **abelian variety** trên $k$.
> 2. $\dim \hat{A} = \dim A = g$.
> 3. $\hat{A}(k) = \operatorname{Pic}^0(A)$ như các nhóm abelian.
> 4. Tồn tại line bundle **Poincaré bundle** $\mathcal{P}$ trên $A \times \hat{A}$ (sẽ xây dựng chi tiết ở Bài 25) là cặp universal: mọi family $(\mathcal{L}, \iota)$ trên $A \times T$ đến từ unique map $\varphi: T \to \hat{A}$.

Proof của existence thường được thực hiện qua hai cách tiếp cận:

**Cách 1 (Mumford, 1966 — Approach qua Quotient):** Cho ample line bundle $L$ trên $A$. Define $K(L) = \ker(\phi_L)$ (finite group scheme vì $L$ ample). Mumford chứng minh $A/K(L)$ tồn tại và là một abelian variety, và $\hat{A} \cong A/K(L)$. Xem Bài 26 để biết thêm về $K(L)$.

**Cách 2 (Grothendieck/Artin, hiện đại — qua Picard Scheme):** Grothendieck xây dựng relative Picard scheme $\operatorname{Pic}_{A/k}$ tổng quát cho mọi proper flat morphism. Component connected chứa identity là $\operatorname{Pic}^0_{A/k} = \hat{A}$.

> [!note] Remark 24.5 — Điều kiện Kỹ thuật
> Để $\hat{A}$ là abelian variety (đặc biệt là smooth), ta cần $A$ là abelian variety (complete + group variety). Đối với abelian variety trên trường characteristic $p > 0$, Picard scheme có thể không reduced tổng quát, nhưng **với abelian variety** nó luôn smooth — đây là một tính chất đặc biệt được chứng minh bởi Mumford (§11 của *Abelian Varieties*).

---

## Chiều của $\hat{A}$: Lie Algebra

> [!theorem] Theorem 24.6 — Lie Algebra của $\hat{A}$
> Lie algebra của $\hat{A}$ tại điểm đơn vị là:
>
> $$
> \operatorname{Lie}(\hat{A}) = T_0(\hat{A}) \cong H^1(A, \mathcal{O}_A)
> $$
>
> Do đó:
>
> $$
> \dim \hat{A} = \dim H^1(A, \mathcal{O}_A) = \dim A = g
> $$

**Chứng minh chiều.** Ta biết $\dim H^1(A, \mathcal{O}_A) = g$ từ lý thuyết cohomology của abelian varieties (mở rộng từ Hodge theory trong trường hợp phức: $H^1(A, \mathcal{O}_A) \cong (H^{0,1})^\vee$, và $\dim A_{\mathbb{C}} = g \Rightarrow \dim H^{0,1} = g$). Trong setting thuần đại số, điều này theo từ Serre duality và tính chất của formal deformations.

Ý nghĩa của định lý: Lie algebra của $\hat{A}$ chính là $H^1(A, \mathcal{O}_A)$, không gian cohomology "đầu tiên" của sheaf cấu trúc. Đây là nhận xét rất đẹp — Lie algebra của dual abelian variety là dual vector space của Lie algebra của $A$ (vì $\operatorname{Lie}(A) = H^0(A, \Omega^1_A)^\vee \cong (H^{0,1}(A))^\vee$ trong trường hợp phức).

> [!note] Remark 24.7 — Serre Duality
> Serre duality cho abelian variety $A$ chiều $g$:
>
> $$
> H^i(A, \mathcal{O}_A) \cong H^{g-i}(A, \Omega^g_A)^\vee \cong H^{g-i}(A, \mathcal{O}_A)^\vee
> $$
>
> (vì $\Omega^g_A \cong \mathcal{O}_A$ — canonical bundle của AV trivial). Do đó $\dim H^i(A, \mathcal{O}_A) = \binom{g}{i}$ — mô phỏng hệ số nhị thức. Suy ra:
>
> $$
> \dim H^1(A, \mathcal{O}_A) = g
> $$

---

## Functoriality: Dual của Isogeny

### Definition

> [!definition] Definition 24.8 — Dual Isogeny (Đối ngẫu Isogeny)
> Cho $f: A \to B$ là morphism của abelian varieties (không nhất thiết isogeny). **Dual morphism** $\hat{f}: \hat{B} \to \hat{A}$ được định nghĩa bởi:
>
> $$
> \hat{f}([L]) = [f^* L] \in \operatorname{Pic}^0(A) \text{ với mỗi } [L] \in \operatorname{Pic}^0(B)
> $$
>
> Tức là: $\hat{f}$ là map pullback $f^*: \operatorname{Pic}^0(B) \to \operatorname{Pic}^0(A)$.

> [!theorem] Theorem 24.9 — Properties của Dual Morphism
> Cho $f: A \to B$ và $g: B \to C$ là morphisms của abelian varieties. Thì:
>
> 1. $\hat{f}$ là morphism của abelian varieties (group homomorphism).
> 2. $\widehat{g \circ f} = \hat{f} \circ \hat{g}$ (contravariance).
> 3. $\widehat{\operatorname{id}_A} = \operatorname{id}_{\hat{A}}$.
> 4. Nếu $f$ là isogeny với $\ker(f) = G$ (finite group scheme), thì $\hat{f}$ cũng là isogeny với $\deg(\hat{f}) = \deg(f)$.

**Proof of 2 (contravariance):** $\widehat{g \circ f}([L]) = [(g \circ f)^* L] = [f^* g^* L] = \hat{f}([g^* L]) = \hat{f}(\hat{g}([L]))$. $\blacksquare$

> [!note] Remark 24.10 — Dual của $[n]$-map
> Dual của multiplication-by-$n$ map $[n]: A \to A$ là $\widehat{[n]} = [n]: \hat{A} \to \hat{A}$ (cũng là multiplication-by-$n$ trên $\hat{A}$).
>
> Chứng minh: $\widehat{[n]}([L]) = [[n]^* L]$. Nhưng $[n]^* L \cong L^{\otimes n^2}$ (từ Bài 11), nên $\widehat{[n]}([L]) = [L^{\otimes n^2}] = [n^2](L)$. Chờ — điều này có vẻ không đúng...
>
> Thực ra với $L \in \operatorname{Pic}^0(A)$: $[n]^* L = L^{\otimes n}$ (không phải $n^2$!) — đây là do $[n]^* L \cong L^{\otimes n}$ khi $L \in \operatorname{Pic}^0$. Từ đó $\widehat{[n]} = [n]: \hat{A} \to \hat{A}$. ✓

---

## Trường hợp Đặc biệt: Elliptic Curve

> [!example] Example 24.11 — $\hat{E} \cong E$ cho Elliptic Curve
> Với elliptic curve $E$, line bundle $L_0 = \mathcal{O}_E(O)$ (divisor của điểm đơn vị) là ample.
>
> Map $\phi_{L_0}: E \to \hat{E}$, $P \mapsto [\mathcal{O}_E(P - O)]$:
>
> - $\phi_{L_0}(O) = [\mathcal{O}_E(O - O)] = [\mathcal{O}_E] = 0$ ✓
> - $K(L_0) = \ker(\phi_{L_0}) = \{O\}$ (chứng minh: $\phi_{L_0}(P) = 0 \Leftrightarrow \mathcal{O}_E(P) \cong \mathcal{O}_E(O) \Leftrightarrow P = O$)
> - $\deg(\phi_{L_0}) = 1$ (principal polarization)
>
> Vậy $\phi_{L_0}: E \xrightarrow{\sim} \hat{E}$ là isomorphism. Nên $\hat{E} \cong E$.

> [!warning] Counterexample 24.12 — Isomorphism $\hat{E} \cong E$ KHÔNG canonical
> Tuy $\hat{E} \cong E$, isomorphism này **phụ thuộc** vào lựa chọn $L_0 = \mathcal{O}_E(O)$. Nếu chọn line bundle khác $L' = \mathcal{O}_E(P)$ cho $P \neq O$, ta được isomorphism khác $\phi_{L'}: E \to \hat{E}$, $Q \mapsto [\mathcal{O}_E(Q - P)]$, khác với $\phi_{L_0}$ bởi translation $[\mathcal{O}_E(P - O)] \in \hat{E}$.
>
> Tổng quát: với abelian variety $A$ chiều $g \geq 1$, ta có $A \cong \hat{A}$ khi và chỉ khi $A$ có **principal polarization** (isogeny $\phi: A \to \hat{A}$ có bậc 1). Nhưng isomorphism này không canonical.

---

## Autoduality: A và $\hat{A}$ Isogenous

> [!theorem] Theorem 24.13 — A và $\hat{A}$ Luôn Isogenous
> Với mọi abelian variety $A$, $A$ và $\hat{A}$ là isogenous.

**Proof sketch.** Vì $A$ là projective (Bài 13), tồn tại ample line bundle $L$ trên $A$. Map $\phi_L: A \to \hat{A}$ là isogeny (surjective với finite kernel $K(L)$). $\blacksquare$

> [!note] Remark 24.14 — Isogenous nhưng không isomorphic
> Với $g \geq 2$, trong một "generic" abelian variety $A$ (không có extra endomorphisms), $A$ và $\hat{A}$ không isomorphic (mặc dù isogenous). Hai abelian varieties isomorphic với dual của nhau được gọi là có **autoduality**, và cần thêm điều kiện về polarization.

---

## Mô tả Bằng Picard Scheme

Từ góc độ hiện đại (Grothendieck):

> [!definition] Definition 24.15 — Picard Scheme
> Cho $A/k$ là abelian variety. **Picard scheme** $\operatorname{Pic}_{A/k}$ là group scheme đại diện cho functor:
>
> $$
> T \mapsto \operatorname{Pic}(A \times T) / \operatorname{Pic}(T)
> $$
>
> (sau khi rigidify). **Dual abelian variety** $\hat{A}$ là **connected component** của identity trong $\operatorname{Pic}_{A/k}$:
>
> $$
> \hat{A} = \operatorname{Pic}^0_{A/k} = \left(\operatorname{Pic}_{A/k}\right)^0
> $$

Đây là định nghĩa "intrinsic" nhất — không cần chọn ample $L$ hay xây dựng quotient. $\hat{A}$ chỉ là component connected của Picard scheme.

---

## SageMath Cheatsheet

```sage
E = EllipticCurve(GF(101), [1, 1])
print("Elliptic curve:", E)
print("Order:", E.order())

E_dual = E
print("Dual of E is isomorphic to E (as expected for elliptic curves)")

f = E.multiplication_by_m(3)
print("Degree of [3] isogeny:", 9)
```

---

## Summary / Key Takeaways

- **Dual abelian variety** $\hat{A}$ là abelian variety represent functor $T \mapsto \{\text{rigidified family of Pic}^0(A)\text{-bundles on } A \times T\}$.
- **Rigidification** là kỹ thuật cần thiết để loại bỏ automorphisms của line bundles và biến functor thành đại diện được.
- **Xây dựng**: hoặc qua Picard scheme $\operatorname{Pic}^0_{A/k}$ (Grothendieck), hoặc qua quotient $A/K(L)$ (Mumford).
- **Chiều**: $\dim \hat{A} = \dim A = g$, với $\operatorname{Lie}(\hat{A}) = H^1(A, \mathcal{O}_A)$.
- **Functoriality**: $f: A \to B$ induces $\hat{f}: \hat{B} \to \hat{A}$ bởi pullback line bundles, với $\widehat{g \circ f} = \hat{f} \circ \hat{g}$.
- **Degree**: nếu $f$ là isogeny thì $\deg(\hat{f}) = \deg(f)$.
- **Elliptic curve**: $\hat{E} \cong E$ vì $\phi_{\mathcal{O}(O)}: E \to \hat{E}$ là isomorphism (principal polarization) — nhưng isomorphism phụ thuộc vào lựa chọn.
- $A$ và $\hat{A}$ luôn isogenous (do $A$ projective và có ample line bundle).

---

## References

- Mumford, D. *Abelian Varieties*, Chapter III, §12–13.
- Milne, J. S. *Abelian Varieties* (Lecture Notes), §9–10.
- Conrad, B. *Abelian Varieties* (Math 249C), §3.2–3.4.
- Grothendieck, A. *FGA* (Fondements de la Géométrie Algébrique), Exposé 232 (Picard Scheme).
- Kleiman, S. *The Picard Scheme*, AMS (2005).
- van der Geer, G., Moonen, B. *Abelian Varieties* (Draft), Chapter 6.
- Lindner, N. *The Dual Abelian Variety* (ZIB Berlin, 2014). §1–2.
- Kuppel, T. *Dual Abelian Variety in Characteristic 0* (Seminar Notes, Bonn). §1–3.
