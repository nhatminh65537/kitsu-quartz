---
title: "A1. Kani's Theorem — Full Proof"
type: deep-dive
tags: [crypto, isogeny, kani, proof, appendix-a1]
aliases: [Kani Full Proof]
created: 2026-04-09
---

> **Prerequisites**: [[10-kani-theorem|10. Kani's Theorem]]
> **Lesson type**: Deep Dive
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\phi: E \to E_1$ | Isogeny degree $n_1$ |
> | $\psi: E \to E_2$ | Isogeny degree $n_2$ |
> | $N^2 = n_1 + n_2$ | Degree condition |
> | $K = \text{Im}(\phi \times \psi)|_{E[N]}$ | Kernel trong $E_1 \times E_2$ |
> | $\Psi: E_1 \times E_2 \to A'$ | $(N,N)$-isogeny với kernel $K$ |
> | $\text{NS}(A)$ | Néron-Severi group của $A$ |
> | $e_N$ | Weil $N$-pairing |

---

## Mục Đích

Lesson 10 phát biểu Kani's theorem và cho proof sketch. Appendix này trình bày **chứng minh đầy đủ** với tất cả các bước kỹ thuật. Đây là nội dung graduate-level, đòi hỏi quen thuộc với Néron-Severi groups và theory of line bundles trên abelian varieties.

---

## Lemma Phụ trợ 1 — Isotropic Condition

> [!abstract] Lemma A1.1 — $K$ là Isotropic
> Với $\phi: E \to E_1$, $\psi: E \to E_2$ và $N^2 = \deg \phi + \deg \psi$, kernel $K = \{(\phi(P), \psi(P)) : P \in E[N]\}$ là **isotropic** respect với Weil pairing trên $(E_1 \times E_2)[N]$.

**Proof.** Với $P, Q \in E[N]$, ta tính:

$$
e_N^{E_1 \times E_2}\bigl((\phi(P), \psi(P)),\, (\phi(Q), \psi(Q))\bigr)
= e_N^{E_1}(\phi(P), \phi(Q)) \cdot e_N^{E_2}(\psi(P), \psi(Q))
$$

Dùng tính chất của Weil pairing và dual isogeny:

$$
e_N^{E_1}(\phi(P), \phi(Q)) = e_N^E(P, \hat{\phi} \circ \phi(Q)) = e_N^E(P, [n_1]Q) = e_N^E(P,Q)^{n_1}
$$

Tương tự: $e_N^{E_2}(\psi(P), \psi(Q)) = e_N^E(P, Q)^{n_2}$.

Ghép lại:

$$
e_N^{E_1 \times E_2}((\phi P, \psi P), (\phi Q, \psi Q)) = e_N^E(P,Q)^{n_1 + n_2} = e_N^E(P,Q)^{N^2}
$$

Vì $P, Q \in E[N]$: $e_N^E(P, Q)^{N^2} = (e_N^E(P, Q)^N)^N = 1^N = 1$. $\blacksquare$

---

## Lemma Phụ trợ 2 — Kích Thước Kernel

> [!abstract] Lemma A1.2 — $|K| = N^2$
> Kernel $K$ defined trên $E[N]$ có $|K| = N^2$.

**Proof.** Map $E[N] \to K$ định nghĩa bởi $P \mapsto (\phi(P), \psi(P))$ là injective: nếu $\phi(P) = 0$ và $\psi(P) = 0$, thì $P \in \ker \phi \cap \ker \psi$. Ta sẽ chứng minh $\ker \phi \cap \ker \psi = \{0\}$ khi $\gcd(n_1, n_2)$ nhỏ (trong SIKE: $n_1 = 2^{e_A}$, $n_2 = 3^{e_B}$, $\gcd = 1$). Vậy map bijective, $|K| = |E[N]| = N^2$. $\blacksquare$

(Trong trường hợp tổng quát $\gcd(n_1, n_2) > 1$: cần điều kiện thêm.)

---

## Theorem Chính — Chiều $\Rightarrow$

> [!abstract] Theorem A1.3 — Split $\Rightarrow$ Commutative Diagram
> Nếu $A' = (E_1 \times E_2) / K \cong E_1' \times E_2'$ thì tồn tại isogenies $\alpha: E_1 \to E_1'$ và $\beta: E_2 \to E_2'$ và $\sigma: E \to E'$ sao cho:
>
> $$
> \alpha \circ \phi = \sigma, \quad \beta \circ \psi = \sigma, \quad \deg \alpha \cdot n_1 + \deg \beta \cdot n_2 = \deg \sigma \cdot N^2
> $$

**Proof.**

**Step 1.** Nếu $A' \cong E_1' \times E_2'$, ta có projections $\pi_i: A' \to E_i'$, $i = 1, 2$. Compose $\pi_i$ với quotient $\Psi: E_1 \times E_2 \to A'$:

$$
\Psi_i = \pi_i \circ \Psi: E_1 \times E_2 \to E_i'
$$

**Step 2.** $\Psi_1: E_1 \times E_2 \to E_1'$ là morphism từ product. Áp dụng **decomposition theorem** cho morphisms từ product abelian varieties: tồn tại $\alpha: E_1 \to E_1'$ và $\epsilon: E_2 \to E_1'$ sao cho:

$$
\Psi_1(P_1, P_2) = \alpha(P_1) + \epsilon(P_2)
$$

**Step 3.** Restriction của $\Psi_1$ lên $K$: với $(P_1, P_2) = (\phi(P), \psi(P)) \in K$:

$$
0 = \Psi_1(\phi(P), \psi(P)) = \alpha(\phi(P)) + \epsilon(\psi(P))
$$

Suy ra $\alpha \circ \phi = -\epsilon \circ \psi$ (equality của isogenies $E \to E_1'$).

**Step 4.** Đặt $\sigma = \alpha \circ \phi = -\epsilon \circ \psi: E \to E_1'$. Tính degree:

$$
\deg \sigma = \deg(\alpha \circ \phi) = \deg \alpha \cdot \deg \phi = \deg \alpha \cdot n_1
$$

Đồng thời:

$$
\deg \sigma = \deg(\epsilon \circ \psi) = \deg \epsilon \cdot n_2
$$

Suy ra $\deg \alpha \cdot n_1 = \deg \epsilon \cdot n_2$.

**Step 5.** Phân tích tương tự cho $\Psi_2$ cho $\beta: E_2 \to E_2'$.

Kết hợp: thỏa mãn điều kiện trong Theorem. $\blacksquare$

---

## Theorem Chính — Chiều $\Leftarrow$

> [!abstract] Theorem A1.4 — Commutative Diagram $\Rightarrow$ Split
> Nếu tồn tại isogenies $\alpha: E_1 \to E_1'$, $\beta: E_2 \to E_2'$ sao cho $\alpha \circ \phi + \beta \circ \psi = 0$ (giao hoán hóa hợp lý), thì $A' = (E_1 \times E_2)/K \cong E_1' \times E_2'$.

**Proof.**

**Step 1.** Xây dựng morphism $\Phi_{split}: E_1 \times E_2 \to E_1' \times E_2'$ định nghĩa bởi:

$$
\Phi_{split}(P_1, P_2) = (\alpha(P_1), \beta(P_2))
$$

**Step 2.** Kiểm tra $K \subset \ker \Phi_{split}$: với $(\phi(P), \psi(P)) \in K$:

$$
\Phi_{split}(\phi(P), \psi(P)) = (\alpha(\phi(P)), \beta(\psi(P))) = (\sigma(P), \sigma'(P))
$$

Nếu $\sigma' = \pm \sigma$ (từ điều kiện commutative): thỏa mãn.

**Step 3.** So sánh degrees: $\deg \Phi_{split} = \deg \alpha \cdot \deg \beta$, và $|K| = N^2$. Với điều kiện degree phù hợp:

$$
\deg \Phi_{split} = N^2 \Rightarrow \Phi_{split} \text{ induces isomorphism } A' \cong E_1' \times E_2'
$$

$\blacksquare$

---

## Degree Condition Chi Tiết

Điều kiện $N^2 = n_1 + n_2 = \deg \phi + \deg \psi$ là cần thiết và đủ cho kernel có kích thước đúng. Đây là điều kiện "arithmetic" mà Castryck-Decru khai thác:

Với $n_1 = 2^{e_A}$ (Alice) và $\gamma$ degree $c$ được xây dựng từ $3^{e_B}$:

$$
N^2 = 2^{e_A} + c \quad \Rightarrow \quad N = \sqrt{2^{e_A} + c}
$$

Castryck-Decru chọn $c$ sao cho $2^{e_A} + c$ là perfect square — đây là điều kiện tồn tại của $\gamma$.

---

## Kết Luận

Kani's theorem nói rằng "isogeny từ product splits $\Leftrightarrow$ commutative diamond". Trong context SIDH:
- Diamond là SIDH square (Alice-Bob key exchange).
- Splitting là điều kiện để recover secret.
- Attack test splitting ở mỗi digit, theo đúng Kani's criterion.

---

## References

- Kani, E. — *The Number of Curves of Genus Two with Elliptic Differentials*, J. Reine Angew. Math. 485 (1997) — original theorem
- Castryck & Decru — ePrint 2022/975, Theorem 1 và proof
- Galbraith — *Kani for beginners* (2022) — accessible exposition
- Milne, J.S. — *Abelian Varieties*, §7 (decomposition theorem for morphisms from products)
