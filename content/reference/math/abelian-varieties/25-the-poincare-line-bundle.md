---
title: "25. The Poincaré Line Bundle"
type: theory
tags: [math, abelian-varieties, lesson-25]
aliases: [Poincaré Line Bundle, Poincare bundle, Universal Line Bundle]
created: 2026-05-18
---

> **Prerequisites**: [[24-the-dual-abelian-variety|24. The Dual Abelian Variety]], [[05-line-bundles-and-picard-group|05. Line Bundles and the Picard Group]]
> **Objectives**:
> - Hiểu Poincaré bundle $\mathcal{P}$ trên $A \times \hat{A}$ và hai điều kiện rigidification
> - Nắm vững universal property của $\mathcal{P}$ và tại sao nó unique
> - Tính toán cohomology: $H^g(A \times \hat{A}, \mathcal{P}) = k$ và $H^i = 0$ với $i \neq g$
> - Hiểu Mumford line bundle $\Lambda(L) = (\operatorname{id}_A \times \phi_L)^* \mathcal{P}$
> - Tính Poincaré bundle cho trường hợp elliptic curve

---

## Motivation / Intuition

$\hat{A}$ được định nghĩa là variety represent functor "families of $\operatorname{Pic}^0$-bundles". Nhưng khi nói "represent", ta ngầm hiểu rằng tồn tại một **cặp universal** $(\hat{A}, \mathcal{P})$ — một variety $\hat{A}$ và một object $\mathcal{P}$ "chuẩn mực" trên $\hat{A}$ mà mọi object tương tự đều pullback từ đó.

Object chuẩn mực đó chính là **Poincaré line bundle** $\mathcal{P}$ — một line bundle trên $A \times \hat{A}$ mà:
- Khi restrict lên fiber $A \times \{[L]\}$, ta nhận được bundle $L$ trên $A$
- Khi restrict lên fiber $\{0\} \times \hat{A}$, ta nhận được bundle trivial $\mathcal{O}_{\hat{A}}$

Tên "Poincaré" được đặt theo Henri Poincaré, người đã nghiên cứu các "prym varieties" — tiền thân của dual abelian variety. Trong trường hợp elliptic curve, Poincaré bundle là một dạng "universal isogeny" parametrize tất cả các line bundles bậc 0.

---

## Định nghĩa Poincaré Bundle

### Definition

> [!definition] Definition 25.1 — Poincaré Line Bundle
> Cho $A$ là abelian variety và $\hat{A}$ là dual abelian variety của $A$. **Poincaré line bundle** là line bundle $\mathcal{P}$ trên $A \times_k \hat{A}$ thỏa mãn:
>
> **(R1) Rigidification dọc theo $\hat{A}$:** Có isomorphism $\mathcal{P}\big|_{\{e_A\} \times \hat{A}} \cong \mathcal{O}_{\hat{A}}$.
>
> **(R2) Universal property:** Với mọi $k$-scheme $T$ và mọi line bundle $\mathcal{L}$ trên $A \times T$ thỏa:
>
> - $\mathcal{L}|_{A \times \{t\}} \in \operatorname{Pic}^0(A)$ với mọi $t \in T$,
> - $\mathcal{L}|_{\{e_A\} \times T} \cong \mathcal{O}_T$ (rigidification dọc theo $e_A$),
>
> tồn tại **duy nhất** morphism $\varphi: T \to \hat{A}$ sao cho:
>
> $$
> (\operatorname{id}_A \times \varphi)^* \mathcal{P} \cong \mathcal{L}
> $$
>
> như các rigidified line bundles.

> [!note] Remark 25.2 — Uniqueness của Poincaré Bundle
> Cặp $(\hat{A}, \mathcal{P})$ là unique lên isomorphism unique: nếu $(\hat{A}', \mathcal{P}')$ cũng thỏa, thì có unique isomorphism $\alpha: \hat{A} \xrightarrow{\sim} \hat{A}'$ sao cho $(\operatorname{id}_A \times \alpha)^* \mathcal{P}' \cong \mathcal{P}$. Đây là ý nghĩa của "universal property unique up to unique isomorphism".

---

## Hai Rigidifications

Poincaré bundle thực ra được rigidify dọc theo **hai** zero sections:

> [!theorem] Theorem 25.3 — Double Rigidification của $\mathcal{P}$
> Tồn tại một và chỉ một isomorphism $\mathcal{P}|_{\{e_A\} \times \hat{A}} \cong \mathcal{O}_{\hat{A}}$ sao cho hai conditions sau đồng thời thỏa:
>
> 1. $\mathcal{P}|_{\{e_A\} \times \hat{A}} \cong \mathcal{O}_{\hat{A}}$ (rigidification dọc $e_A$)
> 2. $\mathcal{P}|_{A \times \{e_{\hat{A}}\}} \cong \mathcal{O}_A$ (rigidification dọc $e_{\hat{A}}$)
>
> và hai trivializations này **agree** trên $\mathcal{P}|_{\{e_A\} \times \{e_{\hat{A}}\}} = \mathcal{P}_{(e_A, e_{\hat{A}})} \cong k$.

**Proof sketch.** Điều kiện 1 là một phần của definition. Điều kiện 2 theo từ: áp dụng universal property của $\hat{A}$ với family $\mathcal{P}$ nhìn như family trên $\hat{A}$ parametrized bởi $A$ (sau khi swap factors): fiber $\mathcal{P}|_{A \times \{e_{\hat{A}}\}}$ ứng với điểm $e_{\hat{A}} \in \hat{A}(k) = \operatorname{Pic}^0(A)$, và điểm đơn vị $e_{\hat{A}}$ ứng với class $[\mathcal{O}_A]$, nên $\mathcal{P}|_{A \times \{e_{\hat{A}}\}} \cong \mathcal{O}_A$. $\blacksquare$

---

## Universal Property — Phát biểu Đầy đủ

> [!theorem] Theorem 25.4 — Universal Property của Poincaré Bundle
> Cặp $(\hat{A}, \mathcal{P})$ là **final** trong category sau:
>
> $\mathcal{C}$: objects là cặp $(T, \mathcal{L})$ với $T$ là $k$-scheme và $\mathcal{L}$ là rigidified line bundle trên $A \times T$ với $\mathcal{L}_t \in \operatorname{Pic}^0(A)$ với mọi $t$; morphisms là maps $f: T \to T'$ với $(\operatorname{id}_A \times f)^* \mathcal{L}' \cong \mathcal{L}$.
>
> Nói cách khác: với mọi $(T, \mathcal{L}) \in \mathcal{C}$, tồn tại duy nhất $\varphi: T \to \hat{A}$ sao cho $(\operatorname{id}_A \times \varphi)^* \mathcal{P} \cong \mathcal{L}$.

Đây là bản dịch của "representability of $\widehat{\operatorname{Pic}}_{A/k}$" sang ngôn ngữ cụ thể.

---

## Cohomology của Poincaré Bundle

Một trong những tính chất đẹp nhất của $\mathcal{P}$:

> [!theorem] Theorem 25.5 — Cohomology của $\mathcal{P}$
> Cho $A$ là abelian variety chiều $g$ và $\mathcal{P}$ là Poincaré bundle trên $A \times \hat{A}$. Thì:
>
> $$
> H^i(A \times \hat{A},\, \mathcal{P}) = \begin{cases} k & \text{nếu } i = g \\ 0 & \text{nếu } i \neq g \end{cases}
> $$
>
> Hay viết gọn: $\chi(A \times \hat{A}, \mathcal{P}) = (-1)^g$.

**Proof sketch.** Dùng Künneth formula và flat base change, ta tính $R^i p_{2*} \mathcal{P}$ (direct image theo $A$-direction). Bằng cách áp dụng "Mumford's cohomological trick" (sử dụng tính algebraically trivial của mọi fiber $\mathcal{P}|_{A \times \{t\}}$), ta chứng minh:

$$
R^i p_{2*} \mathcal{P} = \begin{cases} k(e_{\hat{A}}) & \text{nếu } i = g \\ 0 & \text{nếu } i \neq g \end{cases}
$$

(sheaf skyscraper tại $e_{\hat{A}}$ khi $i = g$). Cuối cùng, Leray spectral sequence cho kết quả. $\blacksquare$

> [!note] Remark 25.6 — Ý nghĩa của Kết quả Cohomological
> Kết quả $H^g(A \times \hat{A}, \mathcal{P}) = k$ nói rằng Poincaré bundle "tập trung cohomology" vào bậc giữa $g$. Đây là analogue của Fourier transform: "biến đổi" bundle trên $A$ (chiều $g$) thành bundle trên $\hat{A}$ (cũng chiều $g$), và "năng lượng" tập trung ở bậc $g$.
>
> Thực ra kết quả này là chìa khóa để chứng minh **Double Duality** $\hat{\hat{A}} \cong A$ (Bài 27): nó đảm bảo rằng Poincaré bundle không "dư thừa" ở một trong hai factors.

---

## Mumford Line Bundle $\Lambda(L)$

Có một cách rất đẹp để connect $\mathcal{P}$ với map $\phi_L$.

> [!definition] Definition 25.7 — Mumford Line Bundle
> Cho $L$ là line bundle trên $A$. **Mumford line bundle** (hay **Mumford bundle**) của $L$ là:
>
> $$
> \Lambda(L) = m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1} \in \operatorname{Pic}(A \times A)
> $$
>
> trong đó $m: A \times A \to A$ là multiplication và $p_1, p_2: A \times A \rightrightarrows A$ là hai projections.

> [!theorem] Theorem 25.8 — Mumford Bundle và Poincaré Bundle
> Map $\phi_L: A \to \hat{A}$ (từ Bài 26) thỏa:
>
> $$
> (\operatorname{id}_A \times \phi_L)^* \mathcal{P} \cong \Lambda(L)
> $$
>
> Nói cách khác: Mumford bundle $\Lambda(L)$ chính là **pullback của Poincaré bundle** dọc theo $\phi_L$.

**Proof.** Theo universal property của $(\hat{A}, \mathcal{P})$: ta cần check $\Lambda(L)$ là rigidified family trên $A \times A$ với fibers trong $\operatorname{Pic}^0(A)$, và map phát sinh chính là $\phi_L$.

Fiber của $\Lambda(L)$ lên $\{a\} \times A$: $\Lambda(L)|_{\{a\} \times A} = t_a^* L \otimes L^{-1} = \phi_L(a)$. Đây chính là định nghĩa $\phi_L$.

Rigidification dọc $e_A$: $\Lambda(L)|_{\{e_A\} \times A} = t_{e_A}^* L \otimes L^{-1} = L \otimes L^{-1} = \mathcal{O}_A$. ✓

Universal property cho unique map $\phi_L: A \to \hat{A}$ với $(\operatorname{id}_A \times \phi_L)^* \mathcal{P} \cong \Lambda(L)$. $\blacksquare$

> [!note] Remark 25.9 — Tại sao gọi là "Mumford bundle"?
> Mumford (trong *On the Equations Defining Abelian Varieties*, 1966) dùng $\Lambda(L)$ như là công cụ trung gian để xây dựng dual abelian variety và theta functions. Bundle này encode thông tin về "cách $L$ tương tác với group structure của $A$".

---

## Symmetry của Poincaré Bundle

> [!theorem] Theorem 25.10 — Symmetry của $\mathcal{P}$
> Cho $\sigma: A \times \hat{A} \to \hat{A} \times A$ là map hoán vị. Thì:
>
> $$
> \sigma^* \mathcal{P}_{\hat{A} \times A} \cong \mathcal{P}^{-1}
> $$
>
> trong đó $\mathcal{P}_{\hat{A} \times A}$ là Poincaré bundle của $(\hat{A}, A)$ (tức là, sau double duality $\hat{\hat{A}} \cong A$, Poincaré bundle trên $\hat{A} \times A$).

Đây là phát biểu kỹ thuật của double duality (sẽ được phân tích ở Bài 27). Ý nghĩa trực quan: "view $\mathcal{P}$ từ cả hai phía: như family on $A$ parametrized by $\hat{A}$, và như family on $\hat{A}$ parametrized by $A$."

Chính xác hơn, trong Theorem 25.10, cần double duality $\hat{\hat{A}} \cong A$ để phát biểu này có nghĩa. Sau khi chứng minh double duality (Bài 27), ta có:

$$
\sigma^* \mathcal{P} \cong (\operatorname{id}_{\hat{A}} \times \kappa_A)^* \mathcal{P}_{\hat{A} \times \hat{\hat{A}}}
$$

trong đó $\kappa_A: A \to \hat{\hat{A}}$ là canonical isomorphism.

---

## Worked Example: Poincaré Bundle cho Elliptic Curve

> [!example] Example 25.11 — Poincaré Bundle trên $E \times E$
> Với elliptic curve $E$ và principal polarization $\phi_0 = \phi_{\mathcal{O}(O)}: E \xrightarrow{\sim} \hat{E}$, ta đồng nhất $\hat{E} \cong E$ qua $\phi_0$.
>
> Poincaré bundle $\mathcal{P}$ trên $E \times E$ thoả:
>
> $$
> \mathcal{P}|_{E \times \{P\}} \cong \phi_0^{-1}(P) = \mathcal{O}_E(P - O)
> $$
>
> Cụ thể hơn: $\mathcal{P}$ là line bundle trên $E \times E$ tương ứng với divisor $\Delta - E \times \{O\} - \{O\} \times E$ (với $\Delta$ là đường chéo).
>
> Kiểm tra: $\mathcal{P}|_{\{O\} \times E} \cong \mathcal{O}_E(\Delta|_{O \times E} - O) = \mathcal{O}_E(O - O) = \mathcal{O}_E$. ✓
>
> Đây là một trường hợp của Lemma 11 trong Lindner's notes: $\mathcal{P} = \Lambda(\mathcal{O}_E(O)) = m^*\mathcal{O}(O) \otimes p_1^*\mathcal{O}(O)^{-1} \otimes p_2^*\mathcal{O}(O)^{-1}$.

---

## Kết Nối với Theta Functions (Remark)

> [!note] Remark 25.12 — Theta Functions và Poincaré Bundle
> Trong trường hợp phức $A = \mathbb{C}^g / \Lambda$ (complex torus), Poincaré bundle $\mathcal{P}$ được xây dựng qua **Appell-Humbert theorem**: line bundle trên complex torus tương ứng với dữ liệu $(H, \chi)$ gồm Hermitian form $H$ trên $\mathbb{C}^g$ và semi-character $\chi: \Lambda \to U(1)$.
>
> Poincaré bundle ứng với Hermitian form $H$ là pairing giữa $\mathbb{C}^g$ và $(\mathbb{C}^g)^* \cong \overline{\mathbb{C}^g}$ — đây chính là **canonical pairing** giữa $A$ và $\hat{A}$ trong ngôn ngữ phức.
>
> Theta function của $\mathcal{P}$ là hàm **theta hai biến** $\vartheta(z, w)$ với $z \in A$, $w \in \hat{A}$, thỏa functional equations kiểu $(z, w) \mapsto (z + \lambda, w)$ và $(z, w) \mapsto (z, w + \mu)$.

---

## SageMath Cheatsheet

```sage
E = EllipticCurve(GF(101), [1, 2])
O = E(0)
P = E.random_point()
Q = E.random_point()

L_P_minus_O = E.divisor(P) - E.divisor(O)
print("Degree of O(P-O):", L_P_minus_O.degree())

A = AbelianVariety(E)
```

---

## Summary / Key Takeaways

- **Poincaré bundle** $\mathcal{P}$ trên $A \times \hat{A}$ là cặp universal: mọi rigidified family $\mathcal{L}/T$ đến từ unique $\varphi: T \to \hat{A}$ với $(\operatorname{id} \times \varphi)^* \mathcal{P} \cong \mathcal{L}$.
- **Double rigidification**: $\mathcal{P}|_{\{e_A\} \times \hat{A}} \cong \mathcal{O}_{\hat{A}}$ và $\mathcal{P}|_{A \times \{e_{\hat{A}}\}} \cong \mathcal{O}_A$, consistent trên fiber $(e_A, e_{\hat{A}})$.
- **Cohomology**: $H^i(A \times \hat{A}, \mathcal{P}) = k$ nếu $i = g$, bằng $0$ nếu không — "cohomology tập trung ở bậc giữa".
- **Mumford bundle**: $\Lambda(L) = m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1}$ thỏa $(\operatorname{id}_A \times \phi_L)^* \mathcal{P} \cong \Lambda(L)$.
- **Elliptic curve**: $\mathcal{P}$ trên $E \times E \cong E \times \hat{E}$ ứng với divisor $\Delta - E \times \{O\} - \{O\} \times E$.
- **Kết nối sang Double Duality** (Bài 27): tính chất cohomological của $\mathcal{P}$ là chìa khóa chứng minh $\hat{\hat{A}} \cong A$.

---

## References

- Mumford, D. *Abelian Varieties*, Chapter III, §8, §13.
- Mumford, D. *On the Equations Defining Abelian Varieties* (1966), Inventiones Math.
- Milne, J. S. *Abelian Varieties* (Lecture Notes), §10.
- Moonen, B. *Algebraic Cycles on Abelian Varieties* (AWS 2024 Notes), §4.6–4.8.
- Conrad, B. *Abelian Varieties* (Math 249C), §3.3.
- Birkenhake, C., Lange, H. *Complex Abelian Varieties*, Chapter 2, §2.5–2.6.
- Mathew, A. *Duality for Abelian Varieties* (Blog, 2013). amathew.wordpress.com.
- Orr, M. *Dual Abelian Varieties and Line Bundles* (Blog, 2011). martinorr.name.
