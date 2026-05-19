---
title: "23. Line Bundles Algebraically Equivalent to Zero"
type: theory
tags: [math, abelian-varieties, lesson-23]
aliases: [Line Bundles Algebraically Equivalent to Zero, Pic0]
created: 2026-05-18
---

> **Prerequisites**: [[05-line-bundles-and-picard-group|05. Line Bundles and the Picard Group]], [[12-theorem-of-the-square|12. Theorem of the Square]], [[10-translation-maps|10. Translation Maps and Morphisms of Abelian Varieties]]
> **Objectives**:
> - Nắm vững định nghĩa algebraic equivalence và phân biệt với linear equivalence
> - Xác định $\operatorname{Pic}^0(A)$ và chứng minh ba đặc trưng tương đương nhau
> - Hiểu See-Saw Principle như một công cụ kỹ thuật xuyên suốt lý thuyết line bundles
> - Nắm vững Néron-Severi group $\operatorname{NS}(A)$ và cấu trúc phân lớp của $\operatorname{Pic}(A)$
> - Nhận ra vai trò của $\operatorname{Pic}^0(A)$ như tiền thân của dual abelian variety $\hat{A}$

---

## Motivation / Intuition

Trong Module 0, ta đã xây dựng nhóm Picard $\operatorname{Pic}(A)$ — nhóm các lớp đẳng cấu của line bundles trên $A$. Đây là một nhóm Abel rất phong phú, nhưng cũng rất phức tạp. Nó chứa đựng thông tin từ nhiều nguồn khác nhau: bậc (degree) của line bundle, cấu trúc giao nhau (intersection), và cấu trúc group của $A$.

Câu hỏi trung tâm của Module 4 là: **làm thế nào biến $\operatorname{Pic}^0(A)$ thành một abelian variety?** Đây là bước đi không hề tầm thường — ta không chỉ cần biết $\operatorname{Pic}^0(A)$ là một tập hợp hay một nhóm trừu tượng, mà cần trang bị nó một cấu trúc hình học phong phú.

Hãy quan sát elliptic curve $E$ như một ví dụ mẫu. Nhóm Picard $\operatorname{Pic}(E)$ phân rã thành các "tầng" theo bậc:

$$
\operatorname{Pic}(E) = \bigsqcup_{n \in \mathbb{Z}} \operatorname{Pic}^n(E)
$$

trong đó $\operatorname{Pic}^n(E) = \{[L] : \deg L = n\}$. Tầng đặc biệt nhất là **$\operatorname{Pic}^0(E)$** — các line bundles bậc 0. Điều kỳ diệu xảy ra: $\operatorname{Pic}^0(E) \cong E(k)$ như các nhóm! Đây không phải ngẫu nhiên — cả hai đều là "phần hình học" của $E$.

Với abelian variety chiều cao hơn, ta cần một tiêu chí chính xác hơn để xác định phần nào của $\operatorname{Pic}(A)$ là "phần hình học". Đó chính là **algebraic equivalence** — tiêu chí phân biệt line bundles "liên thông được qua các deformations liên tục" với những bundle có thể phân biệt bởi các invariant rời rạc.

---

## Ôn lại: Nhóm Picard và Translation Maps

### Definition

> [!definition] Definition 23.1 — Nhóm Picard (Picard Group)
> Cho $A$ là một abelian variety trên trường $k$. **Nhóm Picard** của $A$ là nhóm abelian:
>
> $$
> \operatorname{Pic}(A) = \{\text{isomorphism classes of line bundles on } A\}
> $$
>
> Phép toán là tensor product: $[L] + [M] = [L \otimes M]$, phần tử đơn vị là $[\mathcal{O}_A]$, nghịch đảo là $[L^{-1}] = [L^\vee]$.

Về mặt cohomological, $\operatorname{Pic}(A) = H^1(A, \mathcal{O}_A^\times)$.

Từ Bài 10 và 12, với mỗi line bundle $L$ trên $A$, ta đã xây dựng map:

$$
\phi_L: A \to \operatorname{Pic}(A), \quad a \mapsto [t_a^* L \otimes L^{-1}]
$$

trong đó $t_a: A \to A$ là translation map $x \mapsto x + a$. Theo **Theorem of the Square** (Bài 12):

$$
t_{a+b}^* L \otimes L \cong t_a^* L \otimes t_b^* L
$$

suy ra $\phi_L(a+b) = \phi_L(a) + \phi_L(b)$, tức $\phi_L$ là group homomorphism.

---

## Algebraic Equivalence

### Definition

> [!definition] Definition 23.2 — Algebraic Equivalence (Tương đương đại số)
> Hai line bundles $L, M \in \operatorname{Pic}(X)$ trên $k$-variety $X$ được gọi là **algebraically equivalent** (tương đương đại số), ký hiệu $L \sim_{\text{alg}} M$, nếu tồn tại:
>
> 1. Một connected $k$-scheme $T$ cùng hai điểm $t_0, t_1 \in T(k)$,
> 2. Một line bundle $\mathcal{N}$ trên $X \times_k T$,
>
> sao cho $\mathcal{N}\big|_{X \times \{t_0\}} \cong L$ và $\mathcal{N}\big|_{X \times \{t_1\}} \cong M$.

Trực giác: $L$ và $M$ algebraically equivalent nếu chúng có thể được "nối liền" bởi một **family** line bundles liên tục (parametrized bởi connected scheme $T$). Đây là một dạng "homotopy" trong thế giới line bundles.

> [!note] Remark 23.3 — Algebraic vs. linear equivalence
> **Linear equivalence** là mối quan hệ mạnh hơn: $L \sim_{\text{lin}} M$ nếu $L \cong M \otimes \mathcal{O}(f)$ cho một rational function $f \in k(X)^\times$. Từ đây ta dễ dàng chứng minh:
>
> $$
> L \sim_{\text{lin}} M \implies L \sim_{\text{alg}} M
> $$
>
> nhưng chiều ngược không đúng tổng quát. Ví dụ trên elliptic curve $E$: với hai điểm $P \neq Q$, line bundles $\mathcal{O}(P)$ và $\mathcal{O}(Q)$ thỏa $\mathcal{O}(P) \sim_{\text{alg}} \mathcal{O}(Q)$ (cùng bậc 1, được nối qua family $\mathcal{O}(\cdot)$ parametrized bởi $E$), nhưng $\mathcal{O}(P) \not\sim_{\text{lin}} \mathcal{O}(Q)$ khi $P \neq Q$ (vì $P - Q$ không phải principal divisor trên $E$ generic).

Algebraic equivalence là một quan hệ tương đương tương thích với cấu trúc nhóm của $\operatorname{Pic}(X)$.

---

## Định nghĩa $\operatorname{Pic}^0(A)$

### Definition

> [!definition] Definition 23.4 — $\operatorname{Pic}^0(A)$ (Algebraically Trivial Line Bundles)
> **$\operatorname{Pic}^0(A)$** là subgroup của $\operatorname{Pic}(A)$ gồm các line bundles algebraically equivalent to $\mathcal{O}_A$:
>
> $$
> \operatorname{Pic}^0(A) = \big\{ [L] \in \operatorname{Pic}(A) \mid L \sim_{\text{alg}} \mathcal{O}_A \big\}
> $$
>
> Phần tử $L \in \operatorname{Pic}^0(A)$ được gọi là **algebraically trivial** (đại số tầm thường).

Tính chất subgroup: nếu $L, M \in \operatorname{Pic}^0(A)$ thì $L \otimes M \in \operatorname{Pic}^0(A)$ và $L^{-1} \in \operatorname{Pic}^0(A)$.

---

## Ba Đặc Trưng Tương Đương của $\operatorname{Pic}^0(A)$

Điều đặc biệt của abelian varieties: $\operatorname{Pic}^0(A)$ có ba mô tả hoàn toàn khác nhau, nhưng đều tương đương.

### Theorem

> [!theorem] Theorem 23.5 — Ba Đặc Trưng Tương Đương
> Cho $A$ là abelian variety trên $k$, và $L$ là line bundle trên $A$. Ba điều sau tương đương:
>
> **(i)** $L \in \operatorname{Pic}^0(A)$, tức $L \sim_{\text{alg}} \mathcal{O}_A$.
>
> **(ii)** $t_a^* L \cong L$ với mọi $a \in A(\bar{k})$ (*translation-invariant*).
>
> **(iii)** $m^* L \cong p_1^* L \otimes p_2^* L$ trên $A \times A$, trong đó $m: A \times A \to A$ là group law và $p_1, p_2: A \times A \rightrightarrows A$ là hai projections.

**Proof (outline).**

**(ii) $\Rightarrow$ (iii):** Đặt $\mathcal{M} = m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1}$ trên $A \times A$. Ta cần chứng minh $\mathcal{M} \cong \mathcal{O}_{A \times A}$.

Hạn chế lên slice $\{a\} \times A$ (với $a \in A$ bất kỳ):

$$
\mathcal{M}\big|_{\{a\} \times A} \cong t_a^* L \otimes L^{-1} \cong L \otimes L^{-1} \cong \mathcal{O}_A
$$

(dùng giả thiết (ii)). Theo **See-Saw Principle** (Theorem 23.6 bên dưới): khi mọi fiber đều trivial, bundle pullback từ base. Hạn chế lên $A \times \{0\}$:

$$
\mathcal{M}\big|_{A \times \{0\}} \cong L \otimes L^{-1} \cong \mathcal{O}_A
$$

suy ra $\mathcal{M} \cong \mathcal{O}_{A \times A}$.

**(iii) $\Rightarrow$ (i):** Điều kiện $m^* L \cong p_1^* L \otimes p_2^* L$ nghĩa là family $L$ trên $A$ (tham số hóa bởi "parameter space" $A$ qua identity) là một family algebraically trivial. Restrict sang điểm $0 \in A$ cho $\mathcal{O}_A$, nên $L \sim_{\text{alg}} \mathcal{O}_A$.

**(i) $\Rightarrow$ (ii):** Giả sử có family $\mathcal{N}$ trên $A \times T$ với $\mathcal{N}_{t_0} \cong L$, $\mathcal{N}_{t_1} \cong \mathcal{O}_A$. Áp dụng See-Saw vào family $t_a^* L \otimes L^{-1}$ và dùng tính connected để chứng minh map $a \mapsto [t_a^* L \otimes L^{-1}]$ là hằng số (vì ảnh của nó trong $\operatorname{Pic}^0(A)$ có thể xây dựng thành family liên tục và connected scheme). $\blacksquare$

### Theorem (See-Saw Principle)

> [!theorem] Theorem 23.6 — See-Saw Principle (Nguyên lý Cưa Gỗ)
> Cho $X$ là proper $k$-scheme geometrically reduced và geometrically connected, $T$ là $k$-scheme tùy ý, và $\mathcal{L}$ là line bundle trên $X \times_k T$. Đặt:
>
> $$
> T_1 = \big\{ t \in T \mid \mathcal{L}\big|_{X \times \{t\}} \cong \mathcal{O}_X \big\}
> $$
>
> Thì $T_1$ là một closed subscheme của $T$, và trên $X \times T_1$ ta có $\mathcal{L}\big|_{X \times T_1} \cong p_{T_1}^* \mathcal{M}$ cho một line bundle $\mathcal{M}$ trên $T_1$.

Ý nghĩa: nếu mọi fiber $\mathcal{L}|_{X \times \{t\}} \cong \mathcal{O}_X$ thì $\mathcal{L}$ "đến từ" base $T$ — không có thông tin "dọc" trong các fibers, chỉ có thông tin "ngang" từ $T$. Tên "See-Saw" (cưa gỗ) ám chỉ: thông tin "bập bênh" từ $X$-direction sang $T$-direction.

> [!note] Remark 23.7 — Ứng dụng của See-Saw
> See-Saw Principle là công cụ được dùng đi dùng lại trong toàn bộ lý thuyết abelian varieties. Bài 25 (Poincaré bundle), Bài 26 ($\phi_L$ là homomorphism), và Bài 27 (Double Duality) đều dùng nó. Bằng chứng là: khi ta nói "hạn chế lên $\{a\} \times A$ trivial cho mọi $a$, suy ra bundle là pullback từ $A$", đó là See-Saw đang được dùng.

---

## Lemma: Image của $\phi_L$ luôn nằm trong $\operatorname{Pic}^0(A)$

> [!lemma] Lemma 23.8 — $\phi_L(A) \subseteq \operatorname{Pic}^0(A)$
> Với mọi line bundle $L$ trên abelian variety $A$, map $\phi_L: A \to \operatorname{Pic}(A)$, $a \mapsto [t_a^* L \otimes L^{-1}]$ có ảnh trong $\operatorname{Pic}^0(A)$.

**Proof.**
Cần chứng minh $N_a := t_a^* L \otimes L^{-1}$ thỏa $t_b^* N_a \cong N_a$ với mọi $b$ (tức $N_a$ translation-invariant).

$$
t_b^* N_a = t_b^*(t_a^* L \otimes L^{-1}) = t_{a+b}^* L \otimes t_b^* L^{-1}
$$

Từ Theorem of the Square: $t_{a+b}^* L \otimes L \cong t_a^* L \otimes t_b^* L$, nên $t_{a+b}^* L \cong t_a^* L \otimes t_b^* L \otimes L^{-1}$. Thay vào:

$$
t_b^* N_a = t_a^* L \otimes t_b^* L \otimes L^{-1} \otimes t_b^* L^{-1} = t_a^* L \otimes L^{-1} = N_a
$$

Vậy $N_a \in \operatorname{Pic}^0(A)$ theo Theorem 23.5(ii). $\blacksquare$

> [!corollary] Corollary 23.9 — Đặc trưng thứ tư của $\operatorname{Pic}^0(A)$
> $L \in \operatorname{Pic}^0(A)$ khi và chỉ khi $\phi_L \equiv 0$, tức là $\phi_L(a) = [\mathcal{O}_A]$ với mọi $a$.

Đây chính là định nghĩa gốc của Mumford: $\operatorname{Pic}^0(A) = \ker(\phi_{(\cdot)})$ — những bundle mà "translation không làm thay đổi gì".

---

## Néron-Severi Group

> [!definition] Definition 23.10 — Néron-Severi Group
> **Néron-Severi group** của variety $X$ là quotient group:
>
> $$
> \operatorname{NS}(X) = \operatorname{Pic}(X) / \operatorname{Pic}^0(X)
> $$
>
> Ta có exact sequence:
>
> $$
> 0 \to \operatorname{Pic}^0(X) \to \operatorname{Pic}(X) \to \operatorname{NS}(X) \to 0
> $$

Hai line bundles $L, M$ có cùng lớp trong $\operatorname{NS}(X)$ khi và chỉ khi $L \otimes M^{-1} \in \operatorname{Pic}^0(X)$, tức là $L$ và $M$ algebraically equivalent.

> [!theorem] Theorem 23.11 — NS(A) là Finitely Generated
> Với abelian variety $A$ trên trường $k$ finitely generated trên prime field (chẳng hạn number field hay finite field), $\operatorname{NS}(A)$ là một nhóm abelian hữu hạn sinh.

Đây là **Néron-Severi theorem** (hay Severi's Theorem of the Base). Rank của $\operatorname{NS}(A)$ được gọi là **Picard number** $\rho(A)$. Với abelian variety chiều $g$: $1 \leq \rho(A) \leq g^2$.

> [!note] Remark 23.12 — Ý nghĩa của NS(A) trong lý thuyết AV
> $\operatorname{NS}(A)$ ghi nhận thông tin về "polarization structure" của $A$. Cụ thể, có injection:
>
> $$
> \operatorname{NS}(A) \hookrightarrow \operatorname{Hom}_{\text{sym}}(A, \hat{A})
> $$
>
> (các symmetric isogenies từ $A$ sang $\hat{A}$). Đây sẽ là chủ đề của Module 6. Đặc biệt, nếu $A$ có **principal polarization** thì $A \cong \hat{A}$ (nhưng không canonically!), và đây là điều kiện rất đặc biệt.

### Worked Example

> [!example] Example 23.13 — Cấu trúc Pic(E) của Elliptic Curve
> Với elliptic curve $E$ trên $k$, ta có exact sequence:
>
> $$
> 0 \to \operatorname{Pic}^0(E) \to \operatorname{Pic}(E) \xrightarrow{\deg} \mathbb{Z} \to 0
> $$
>
> (mọi bậc đều đạt được, ví dụ $\mathcal{O}(P)$ có bậc 1 với $P \in E(k)$).
>
> Vậy $\operatorname{NS}(E) \cong \mathbb{Z}$, generated bởi $[\mathcal{O}(O)]$ (line bundle của điểm đơn vị $O$).
>
> Picard number: $\rho(E) = 1$.
>
> $\operatorname{Pic}^0(E)$ gồm tất cả line bundles bậc 0: $\{[\mathcal{O}(P - O)] : P \in E(k)\} \cong E(k)$.

> [!example] Example 23.14 — Product $E_1 \times E_2$ với $E_1 \not\cong E_2$
> Xét $A = E_1 \times E_2$ với $E_1, E_2$ là hai elliptic curves không isomorphic. Thì:
>
> $$
> \operatorname{NS}(A) \cong \mathbb{Z}^2
> $$
>
> generated bởi $[p_1^* \mathcal{O}(O_1)]$ và $[p_2^* \mathcal{O}(O_2)]$ (hai polarizations từ hai factors).
>
> Nếu $E_1 \cong E_2 = E$, thì $\operatorname{NS}(E \times E) \cong M_{2 \times 2}(\mathbb{Z})$ (tập $2 \times 2$ integer matrices), và $\rho(E \times E) = 4$ trong trường hợp $E$ có complex multiplication, hoặc $\rho = 3$ nếu không có CM.

---

## Numerical Equivalence

Có một quan hệ tương đương yếu hơn algebraic: **numerical equivalence**.

### Definition

> [!definition] Definition 23.15 — Numerical Equivalence (Tương đương Số học)
> Line bundle $L$ trên $X$ là **numerically trivial** (tương đương số học với $\mathcal{O}$), ký hiệu $L \equiv_{\text{num}} 0$, nếu:
>
> $$
> \deg(L|_C) = 0 \text{ với mọi irreducible curve } C \subseteq X
> $$
>
> Equivalently: $(L \cdot C) = 0$ với mọi $1$-cycle $C$ trên $X$.
>
> Nhóm $\operatorname{Num}(X) = \operatorname{Pic}(X) / \equiv_{\text{num}}$ gọi là **numerical Picard group**.

Rõ ràng: $L \sim_{\text{alg}} 0 \Rightarrow L \equiv_{\text{num}} 0$, vì algebraic equivalence preserves intersection numbers. Chiều ngược không đúng tổng quát.

> [!theorem] Theorem 23.16 — Algebraic $\Leftrightarrow$ Numerical trên Abelian Varieties
> Với abelian variety $A$:
>
> $$
> \operatorname{Pic}^0(A) = \big\{ L \in \operatorname{Pic}(A) \mid L \equiv_{\text{num}} 0 \big\}
> $$
>
> Tức là, trên abelian variety, algebraic equivalence và numerical equivalence trùng nhau.

Đây là kết quả rất đặc biệt của abelian varieties — **không đúng** cho các varieties tổng quát hơn.

> [!warning] Counterexample 23.17 — K3 Surface
> Trên một K3 surface $S$ (variety phức chiều 2 với $K_S \cong \mathcal{O}_S$), có thể tồn tại line bundles numerically trivial nhưng không algebraically trivial. Sự trùng nhau của hai equivalences trên abelian variety phản ánh tính chất đặc biệt của group structure.

---

## Fourier-Mukai và $\operatorname{Pic}^0$

Một quan điểm hiện đại: $\operatorname{Pic}^0(A)$ đóng vai trò trung tâm trong **Fourier-Mukai transform** trên abelian variety.

> [!note] Remark 23.18 — Fourier-Mukai Transform
> Mukai (1981) đã xây dựng một equivalence của derived categories:
>
> $$
> \Phi_{\mathcal{P}}: D^b(\operatorname{Coh}(A)) \xrightarrow{\sim} D^b(\operatorname{Coh}(\hat{A}))
> $$
>
> trong đó $\mathcal{P}$ là Poincaré bundle trên $A \times \hat{A}$ (sẽ xây dựng ở Bài 25), và functor được định nghĩa bởi:
>
> $$
> \Phi_{\mathcal{P}}(\mathcal{F}) = Rp_{2*}(p_1^* \mathcal{F} \otimes \mathcal{P})
> $$
>
> Đây là một dạng "Fourier transform" trong hình học đại số. Các bundle trong $\operatorname{Pic}^0(\hat{A})$ đóng vai trò như "characters" (tương tự characters của nhóm compact trong Fourier analysis).

---

## Cohomology của Line Bundles trong $\operatorname{Pic}^0$

> [!theorem] Theorem 23.19 — Vanishing cho $L \in \operatorname{Pic}^0(A) \setminus \{0\}$
> Nếu $L \in \operatorname{Pic}^0(A)$ và $L \not\cong \mathcal{O}_A$, thì:
>
> $$
> H^i(A, L) = 0 \text{ với mọi } i \geq 0
> $$

**Proof sketch.**
Giả sử $H^0(A, L) \neq 0$: có section $s \neq 0$ của $L$. Vì $L \in \operatorname{Pic}^0(A)$, ta có $(-1_A)^* L \cong L^{-1}$ (do $L$ translation-invariant và $(-1_A)^* L \cong L^{-1}$ — chứng minh dùng Theorem 23.5(iii)). Nên cũng có section của $L^{-1}$, tức $L \cong \mathcal{O}_A$, mâu thuẫn.

Trường hợp $i > 0$ đòi hỏi Künneth formula và cấu trúc cohomological của AV. $\blacksquare$

Đây là kết quả rất mạnh: line bundles trong $\operatorname{Pic}^0$ "vô hình" về mặt cohomological, trừ $\mathcal{O}_A$.

---

## SageMath Cheatsheet

```sage
E = EllipticCurve(GF(97), [2, 3])
P = E.random_point()
O = E(0)

deg_P = 1
print("deg O(P) =", deg_P)

n = E.order()
print("|E(F_97)| =", n)

E2 = EllipticCurve(GF(97), [5, 7])
A = E.product(E2) if hasattr(E, 'product') else None

J = E.jacobian()
```

---

## Summary / Key Takeaways

- **Algebraic equivalence**: $L \sim_{\text{alg}} M$ nếu chúng thuộc cùng một connected family line bundles. Mạnh hơn numerical, yếu hơn linear equivalence.
- **$\operatorname{Pic}^0(A)$** có ba đặc trưng tương đương: (i) algebraically trivial, (ii) translation-invariant ($t_a^* L \cong L$), (iii) $m^* L \cong p_1^* L \otimes p_2^* L$.
- **See-Saw Principle**: công cụ kỹ thuật cơ bản — bundle có mọi fiber trivial thì pullback từ base.
- **Lemma 23.8**: $\phi_L$ luôn map vào $\operatorname{Pic}^0(A)$; và $L \in \operatorname{Pic}^0(A)$ iff $\phi_L \equiv 0$.
- **Néron-Severi group**: $\operatorname{NS}(A) = \operatorname{Pic}(A)/\operatorname{Pic}^0(A)$, hữu hạn sinh, với Picard number $\rho(A) \in [1, g^2]$.
- **Algebraic = Numerical** trên abelian varieties: tính chất đặc biệt không có trên các varieties khác.
- **Vanishing theorem**: $L \in \operatorname{Pic}^0(A) \setminus \{\mathcal{O}_A\}$ thì $H^i(A, L) = 0$ với mọi $i$ — "vô hình" về cohomology.
- **Bước tiếp**: $\operatorname{Pic}^0(A)$ không chỉ là một nhóm trừu tượng — nó là tập điểm của **dual abelian variety** $\hat{A}$ (Bài 24).

---

## References

- Mumford, D. *Abelian Varieties*, Tata Institute / Oxford University Press (1970). Chapter III, §10–11.
- Milne, J. S. *Abelian Varieties* (Lecture Notes, 2008). Available at jmilne.org/math. §8–9.
- Conrad, B. *Abelian Varieties* (Lecture Notes by T. Feng, Math 249C, 2015). Berkeley. §3.
- van der Geer, G., Moonen, B. *Abelian Varieties* (Draft). Chapter 7.
- Birkenhake, C., Lange, H. *Complex Abelian Varieties* (2nd ed., 2004), Springer GTM 302. Chapter 2, §2.5.
- Kleiman, S. *The Picard Scheme*, in *Fundamental Algebraic Geometry: Grothendieck's FGA Explained*, AMS (2005).
- Lindner, N. *The Dual Abelian Variety* (Seminar Notes, ZIB Berlin, 2014). zib.de.
