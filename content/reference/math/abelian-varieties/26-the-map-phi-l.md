---
title: "26. The Map phi_L: A to Hat(A)"
type: theory
tags: [math, abelian-varieties, lesson-26]
aliases: [phi_L map, polarization map, isogeny from ample line bundle]
created: 2026-05-18
---

> **Prerequisites**: [[25-the-poincare-line-bundle|25. The Poincaré Line Bundle]], [[12-theorem-of-the-square|12. Theorem of the Square]], [[14-isogenies-definition-and-basic-examples|14. Isogenies]]
> **Objectives**:
> - Định nghĩa và phân tích map $\phi_L: A \to \hat{A}$ một cách chặt chẽ
> - Chứng minh $\phi_L$ là group homomorphism dùng Theorem of the Square
> - Xây dựng kernel $K(L)$ và phân tích cấu trúc của nó
> - Chứng minh $\phi_L$ là isogeny khi và chỉ khi $L$ ample
> - Nắm vững degree formula: $\deg(\phi_L) = \chi(L)^2$
> - Chứng minh symmetry: $\hat{\phi}_L = \phi_L$ (via double duality)
> - Phân tích $\phi_{L \otimes M} = \phi_L + \phi_M$

---

## Motivation / Intuition

Ta đã biết từ Bài 12 (Theorem of the Square) rằng với mỗi line bundle $L$ trên $A$, map $a \mapsto [t_a^* L \otimes L^{-1}]$ là group homomorphism với ảnh trong $\operatorname{Pic}^0(A)$. Bây giờ, với sự tồn tại của $\hat{A}$, ta có thể viết map này thành:

$$
\phi_L: A \to \hat{A}
$$

Map này cực kỳ quan trọng vì nhiều lý do:

1. **Nó là cầu nối** giữa $A$ và $\hat{A}$: mỗi line bundle $L$ trên $A$ cho ta một morphism từ $A$ sang dual của nó.
2. **Nó detect ampleness**: $\phi_L$ là isogeny khi và chỉ khi $L$ ample — đây là tiêu chí "hình học" của ampleness.
3. **Nó sinh ra polarizations** (Module 6): một "polarization" là đúng một map kiểu $\phi_L$ với $L$ ample.
4. **Nó liên hệ với Weil pairing** (Module 5): pairing $e_n$ được xây dựng từ $\phi_L$.

---

## Định nghĩa $\phi_L$

### Definition

> [!definition] Definition 26.1 — Map $\phi_L: A \to \hat{A}$
> Cho $L$ là line bundle trên abelian variety $A$. **Map $\phi_L$** (hay **Mumford's map**) được định nghĩa bởi:
>
> $$
> \phi_L: A \to \hat{A}, \quad a \mapsto \left[ t_a^* L \otimes L^{-1} \right]
> $$
>
> trong đó $[M]$ biểu thị lớp của $M$ trong $\hat{A}(k) = \operatorname{Pic}^0(A)$.

Ta cần kiểm tra:
- $t_a^* L \otimes L^{-1} \in \operatorname{Pic}^0(A)$: đã chứng minh ở Lemma 23.8.
- $\phi_L$ là morphism (không chỉ là map trên $k$-points): theo từ tính representability của $\hat{A}$ và tính algebraic của family $\{t_a^* L \otimes L^{-1}\}_{a \in A}$.

---

## $\phi_L$ là Group Homomorphism

### Theorem

> [!theorem] Theorem 26.2 — $\phi_L$ là Group Homomorphism
> $\phi_L: A \to \hat{A}$ là morphism của abelian varieties, tức là group homomorphism.

**Proof.**
Ta cần chứng minh $\phi_L(a + b) = \phi_L(a) + \phi_L(b)$ trong $\hat{A}$ (tức là tensor product trong $\operatorname{Pic}^0(A)$).

LHS:

$$
\phi_L(a+b) = \left[ t_{a+b}^* L \otimes L^{-1} \right]
$$

RHS:

$$
\phi_L(a) + \phi_L(b) = \left[ t_a^* L \otimes L^{-1} \right] \otimes \left[ t_b^* L \otimes L^{-1} \right] = \left[ t_a^* L \otimes t_b^* L \otimes L^{-2} \right]
$$

Theo **Theorem of the Square** (Bài 12):

$$
t_{a+b}^* L \otimes L \cong t_a^* L \otimes t_b^* L
$$

Suy ra $t_{a+b}^* L \cong t_a^* L \otimes t_b^* L \otimes L^{-1}$. Vậy:

$$
\phi_L(a+b) = \left[ t_a^* L \otimes t_b^* L \otimes L^{-1} \otimes L^{-1} \right] = \left[ t_a^* L \otimes t_b^* L \otimes L^{-2} \right] = \phi_L(a) + \phi_L(b)
$$

$\blacksquare$

> [!corollary] Corollary 26.3 — Giá trị tại $e_A$
> $\phi_L(e_A) = [\mathcal{O}_A]$ (phần tử đơn vị của $\hat{A}$).
>
> **Proof:** $\phi_L(e_A) = [t_{e_A}^* L \otimes L^{-1}] = [L \otimes L^{-1}] = [\mathcal{O}_A]$. $\blacksquare$

---

## Kernel $K(L)$

> [!definition] Definition 26.4 — Kernel $K(L)$
> Với line bundle $L$ trên $A$, **kernel** của $\phi_L$ là subgroup scheme:
>
> $$
> K(L) = \ker(\phi_L) = \left\{ a \in A \mid t_a^* L \cong L \right\}
> $$
>
> Đây là closed subgroup scheme của $A$ (vì $\phi_L$ là morphism và $\{e_{\hat{A}}\}$ là closed).

> [!note] Remark 26.5 — Cấu trúc của $K(L)$
> Về mặt scheme: $K(L)$ được xây dựng như scheme-theoretic fiber:
>
> $$
> K(L) = \phi_L^{-1}(\{e_{\hat{A}}\})
> $$
>
> Trong char $= 0$: $K(L)$ reduced, tức là determined bởi các $k$-points.
>
> Trong char $p > 0$: $K(L)$ có thể không reduced (non-reduced group scheme).

### Worked Example

> [!example] Example 26.6 — Kernel cho Elliptic Curve
> Với $E$ elliptic curve và $L = \mathcal{O}_E(nO)$ (divisor của $n$ lần điểm $O$):
>
> $$
> K(L) = E[n] = \ker([n]: E \to E) = \{P \in E : nP = O\}
> $$
>
> Chứng minh: $P \in K(L)$ iff $t_P^* \mathcal{O}(nO) \cong \mathcal{O}(nO)$ iff $\mathcal{O}(n \cdot (-P)) \cong \mathcal{O}(nO)$ (dùng $t_P^* \mathcal{O}(Q) = \mathcal{O}(Q - P)$) iff $n(-P) \sim nO$ (linear equivalence) iff $(-P)^n = O$ iff $nP = O$ (trong group law). ✓
>
> Nên $\deg(\phi_L) = |K(L)| = n^2$ (vì $|E[n]| = n^2$ khi $\gcd(n, \operatorname{char}(k)) = 1$). Và $\chi(L) = n$, confirming $\deg(\phi_L) = \chi(L)^2 = n^2$.

---

## $\phi_L$ là Isogeny iff $L$ Ample

Đây là kết quả trung tâm của bài học này.

### Theorem

> [!theorem] Theorem 26.7 — Isogeny iff Ample
> Cho $L$ là line bundle trên abelian variety $A$. Các điều sau tương đương:
>
> **(a)** $\phi_L: A \to \hat{A}$ là isogeny (surjective với finite kernel).
>
> **(b)** $K(L)$ là finite group scheme.
>
> **(c)** $L$ là ample.

**Proof sketch.**

**(c) $\Rightarrow$ (b):** Nếu $L$ ample, dùng Riemann-Roch trên abelian varieties: $\chi(L^n) = n^g \chi(L) > 0$ với $\chi(L) > 0$ (từ Kodaira vanishing). Điều này cho thấy $L$ "cứng" — không thể dịch chuyển về chính nó theo nhiều hướng, nên $K(L)$ hữu hạn.

Cụ thể hơn: nếu $K(L)$ vô hạn, thì chứa một abelian subvariety $B \subseteq A$ (dimension $\geq 1$). Khi đó $L|_B \in \operatorname{Pic}^0(B)$ (vì dịch trên $B$ không thay đổi $L$). Nhưng $L$ ample nên $L|_B$ ample, mâu thuẫn với $L|_B \in \operatorname{Pic}^0(B)$ (line bundles trong $\operatorname{Pic}^0$ không có global sections trừ $\mathcal{O}$, không thể ample).

**(b) $\Rightarrow$ (a):** $\phi_L$ có finite kernel, và là morphism giữa hai abelian varieties cùng chiều, nên surjective.

**(a) $\Rightarrow$ (c):** Nếu $\phi_L$ là isogeny, thì tồn tại $M$ trên $\hat{A}$ ample sao cho $\phi_L^* M$ là ample trên $A$. Dùng formula $\phi_L^* M = \phi_M \circ \phi_L$... lý luận kỹ hơn dùng lý thuyết ample sheaves và morphisms finite. $\blacksquare$

> [!note] Remark 26.8 — Mumford's Original Approach
> Mumford xây dựng dual abelian variety như $\hat{A} = A/K(L)$ cho ample $L$, rồi chứng minh kết quả không phụ thuộc lựa chọn $L$. Theorem 26.7 chính là điều kiện để quotient này có ý nghĩa (finite kernel = $K(L)$ là subgroup scheme hữu hạn).

---

## Degree Formula

> [!theorem] Theorem 26.9 — Degree Formula
> Cho $L$ ample trên abelian variety $A$ chiều $g$. Thì:
>
> $$
> \deg(\phi_L) = \chi(L)^2
> $$
>
> trong đó $\chi(L) = \sum_{i=0}^{g} (-1)^i \dim H^i(A, L)$ là Euler characteristic của $L$.

> [!note] Remark 26.10 — Tính toán $\chi(L)$
> Khi $L$ ample, Kodaira vanishing cho $H^i(A, L) = 0$ với $i > 0$, nên $\chi(L) = \dim H^0(A, L) > 0$. Từ Riemann-Roch trên abelian varieties:
>
> $$
> \chi(L) = \frac{(L^g)}{g!}
> $$
>
> (degree của $L$ chia cho $g!$, với $(L^g) = \int_A c_1(L)^g$ là self-intersection number). Nếu $L$ có **type** $(d_1, \ldots, d_g)$ (elementary divisors của map $\phi_L$ trên Tate module), thì $\chi(L) = d_1 \cdots d_g$ và $\deg(\phi_L) = (d_1 \cdots d_g)^2$.

> [!example] Example 26.11 — Principal Polarization
> Khi $\chi(L) = 1$ (tức $L$ của type $(1, 1, \ldots, 1)$):
>
> $$
> \deg(\phi_L) = 1^2 = 1
> $$
>
> Vậy $\phi_L: A \to \hat{A}$ là isomorphism! Đây gọi là **principal polarization**. Elliptic curve $E$ luôn có principal polarization $\phi_{\mathcal{O}(O)}$.

---

## Additivity của $\phi_L$

> [!theorem] Theorem 26.12 — Additivity: $\phi_{L \otimes M} = \phi_L + \phi_M$
> Với hai line bundles $L, M$ trên $A$:
>
> $$
> \phi_{L \otimes M} = \phi_L + \phi_M: A \to \hat{A}
> $$

**Proof.**
Trực tiếp từ định nghĩa:

$$
\phi_{L \otimes M}(a) = \left[ t_a^*(L \otimes M) \otimes (L \otimes M)^{-1} \right] = \left[ (t_a^* L \otimes L^{-1}) \otimes (t_a^* M \otimes M^{-1}) \right]
$$

$$
= \phi_L(a) + \phi_M(a) = (\phi_L + \phi_M)(a)
$$

$\blacksquare$

> [!corollary] Corollary 26.13 — Hệ quả về Kernels
> $\ker(\phi_{L \otimes M}) \supseteq \ker(\phi_L) \cap \ker(\phi_M)$.
>
> Đặc biệt: $\phi_{L^n} = n \cdot \phi_L: A \to \hat{A}$.

> [!example] Example 26.14 — $\phi_{L^n} = n \phi_L$
> Với $L = \mathcal{O}_E(O)$ trên elliptic curve: $\phi_{L^n} = n \phi_L$. Vì $\phi_L$ là isomorphism $E \to \hat{E} \cong E$, ta có $\phi_{L^n}$ tương ứng với multiplication-by-$n$ trên $E$.
>
> Điều này consistent với $K(\mathcal{O}_E(nO)) = E[n]$ như tính ở Example 26.6.

---

## Symmetry: $\hat{\phi}_L = \phi_L$

Đây là một tính chất đẹp nhất của $\phi_L$ — nó "symmetric" theo một nghĩa cụ thể.

### Theorem

> [!theorem] Theorem 26.15 — Symmetry của $\phi_L$
> Với abelian variety $A$ và line bundle $L$ trên $A$, dưới canonical isomorphism $\hat{\hat{A}} \cong A$ (Bài 27):
>
> $$
> \hat{\phi}_L = \phi_L: A \to \hat{A}
> $$
>
> tức là dual isogeny của $\phi_L: A \to \hat{A}$ chính là $\phi_L$ khi nhìn từ $\hat{A}$ sang $\hat{\hat{A}} \cong A$.

**Proof sketch.** Ta cần chứng minh: với $\xi \in \hat{A}$ và $a \in A$:

$$
(\hat{\phi}_L)(\xi) = \kappa_A^{-1} \circ \phi_L^\vee (\xi) = ?
$$

Dùng cách tính qua Poincaré bundles và double duality (Bài 27), ta có thể verify $\hat{\phi}_L = \phi_L$ trực tiếp. Lý luận đầy đủ sử dụng seesaw principle và tính symmetric của Mumford bundle $\Lambda(L)$.

> [!note] Remark 26.16 — Ý nghĩa của Symmetry
> Tính chất $\hat{\phi}_L = \phi_L$ là lý do tại sao $\phi_L$ được gọi là map "symmetric" (sẽ thấy ở Module 6: polarization = symmetric isogeny $A \to \hat{A}$ của dạng $\phi_L$). Đây là tương tự của "adjoint bằng chính nó" (self-adjoint) trong linear algebra.

---

## Cấu trúc của $K(L)$

Khi $L$ ample, $K(L)$ là finite group scheme. Cấu trúc của nó như thế nào?

> [!theorem] Theorem 26.17 — Cấu trúc của $K(L)$
> Cho $L$ ample trên $A$ chiều $g$, với $\gcd(\chi(L), \operatorname{char}(k)) = 1$. Thì:
>
> $$
> K(L) \cong (\mathbb{Z}/d_1\mathbb{Z} \times \cdots \times \mathbb{Z}/d_g\mathbb{Z})^2
> $$
>
> trong đó $(d_1, \ldots, d_g)$ là **type** của $L$ (elementary divisors của $\phi_L$ trên Tate module $T_\ell(A)$).
>
> Đặc biệt: $|K(L)| = (d_1 \cdots d_g)^2 = \chi(L)^2 = \deg(\phi_L)$.

> [!note] Remark 26.18 — Type của Line Bundle
> **Type** của $L$ là bộ $(d_1 | d_2 | \cdots | d_g)$ với $d_1 \cdots d_g = \chi(L)$. Với **principal polarization**: $(d_1, \ldots, d_g) = (1, \ldots, 1)$, $K(L) = \{0\}$.
>
> Kết quả này tổng quát hóa: $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ (cho elliptic curve) với line bundle $\mathcal{O}(nO)$ có type $(n)$.

---

## Theta Group $\mathcal{G}(L)$

Ngoài $K(L)$, có một cấu trúc phong phú hơn:

> [!definition] Definition 26.19 — Theta Group (Nhóm Theta)
> **Theta group** $\mathcal{G}(L)$ là group scheme extension:
>
> $$
> 1 \to \mathbb{G}_m \to \mathcal{G}(L) \to K(L) \to 0
> $$
>
> trong đó $\mathcal{G}(L)(T) = \left\{ (a, \phi) \mid a \in K(L)(T),\; \phi: L \xrightarrow{\sim} t_a^* L \right\}$ — các cặp (dịch chuyển, isomorphism bổ sung).

Theta group encode thêm thông tin về **theta functions** của $L$. Đặc biệt, theta functions của $L$ là sections của một representation của $\mathcal{G}(L)$ — đây là nền tảng của Mumford's theory trong *On the Equations Defining Abelian Varieties*.

---

## Ký Hiệu $\phi_L$ và Picard Group

> [!theorem] Theorem 26.20 — $\phi_L$ Xác Định $L$ Modulo $\operatorname{Pic}^0(A)$
> Hai line bundles $L, M$ trên $A$ thỏa $\phi_L = \phi_M$ khi và chỉ khi $L \otimes M^{-1} \in \operatorname{Pic}^0(A)$, tức là $L$ và $M$ có cùng lớp trong $\operatorname{NS}(A)$.

**Proof.** $\phi_L = \phi_M$ iff $\phi_{L \otimes M^{-1}} = 0$ (từ Theorem 26.12) iff $L \otimes M^{-1} \in \operatorname{Pic}^0(A)$ (từ Corollary 23.9). $\blacksquare$

Vậy: map $[L] \mapsto \phi_L$ factor qua $\operatorname{NS}(A) \hookrightarrow \operatorname{Hom}(A, \hat{A})$.

---

## SageMath Cheatsheet

```sage
E = EllipticCurve(GF(101), [1, 2])
O = E(0)
n = 3

P = E.random_point()
print("P:", P)
print("n*P:", n * P)

print("E[n] has order:", n^2)

print("chi(O(nO)) =", n)
print("deg(phi_L) =", n^2)

print("K(O(3O)) = E[3], which has", 3^2, "elements")
```

---

## Summary / Key Takeaways

- $\phi_L: A \to \hat{A}$, $a \mapsto [t_a^* L \otimes L^{-1}]$, là **group homomorphism** nhờ Theorem of the Square.
- $\phi_{L \otimes M} = \phi_L + \phi_M$ (additivity) và $\phi_{L^n} = n \phi_L$ (scalar multiplication).
- $K(L) = \ker(\phi_L) = \{a : t_a^* L \cong L\}$ là closed subgroup scheme của $A$.
- **Trung tâm**: $\phi_L$ là isogeny $\Leftrightarrow$ $K(L)$ finite $\Leftrightarrow$ $L$ ample.
- **Degree formula**: $\deg(\phi_L) = \chi(L)^2$ khi $L$ ample.
- **Cấu trúc kernel**: $K(L) \cong (\mathbb{Z}/d_1 \times \cdots \times \mathbb{Z}/d_g)^2$ với $(d_i)$ là type của $L$.
- **Symmetry**: $\hat{\phi}_L = \phi_L$ (sẽ dùng trong Module 6 để định nghĩa polarization).
- $\phi_L$ xác định $L$ modulo $\operatorname{Pic}^0(A)$, tức là xác định lớp trong $\operatorname{NS}(A)$.
- **Elliptic curve**: $K(\mathcal{O}_E(nO)) = E[n]$, $\deg(\phi_{\mathcal{O}(nO)}) = n^2 = \chi(\mathcal{O}(nO))^2$.

---

## References

- Mumford, D. *Abelian Varieties*, Chapter II, §6 và Chapter III, §13.
- Mumford, D. *On the Equations Defining Abelian Varieties* (1966).
- Milne, J. S. *Abelian Varieties* (Lecture Notes), §8, §13.
- Conrad, B. *Abelian Varieties* (Math 249C, Notes by T. Feng), §3.4–3.5.
- Conrad, B. *Polarizations* (Stanford Preprint), §3. math.stanford.edu/~conrad.
- Lombardo, D. *Abelian Varieties* (Lecture Notes, Pisa), §6.
- Lindner, N. *The Dual Abelian Variety* (ZIB Berlin, 2014), Lemma 9–Theorem 7.
- van der Geer, G., Moonen, B. *Abelian Varieties* (Draft), Chapter 6–7.
