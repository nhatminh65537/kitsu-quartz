---
title: "10. Translation Maps and Morphisms of Abelian Varieties"
tags: [math, abelian-varieties, module-01, lesson-10]
aliases: [Translation Maps Morphisms Abelian Varieties]
created: 2026-05-18
---

> **Prerequisites**: [[09-abelian-varieties-commutativity|09. Abelian Varieties — Definition and Commutativity]]
> **Objectives**:
> - Định nghĩa và nắm rõ tính chất của translation map $t_a$
> - Hiểu morphism giữa hai abelian variety — khi nào là homomorphism?
> - Phân tích kernel của một homomorphism
> - Xây dựng trực giác cho endomorphism ring $\operatorname{End}(A)$

---

## Motivation / Intuition

Trên abelian variety $A$, mỗi điểm $a \in A$ định nghĩa một **phép dịch chuyển** (translation) $t_a: A \to A$, $x \mapsto x + a$. Đây là cấu trúc cơ bản nhất của mọi nhóm: tác động của nhóm lên chính nó bằng phép tịnh tiến.

Điều làm translation maps trên abelian variety đặc biệt: chúng là **automorphisms của variety** (không chỉ là bijection tập hợp). Thực ra $t_a$ là morphism với inverse $t_{-a}$, nên là isomorphism of varieties. Điều này dẫn đến một nguyên lý mạnh: **mọi điểm trên $A$ "trông như nhau"** từ góc độ hình học.

Từ translations, chúng ta xây dựng lý thuyết morphisms giữa abelian varieties. Đặc biệt, chúng ta sẽ thấy rằng đối với abelian varieties, điều kiện "gửi điểm đơn vị vào điểm đơn vị" đủ để đảm bảo morphism là homomorphism — một kết quả trực tiếp từ Rigidity Lemma.

---

## Translation Maps

> [!definition] Definition 10.1 — Translation Map $t_a$
> Cho $A$ là abelian variety và $a \in A$ (một $k$-point hoặc $S$-point cho scheme $S$). **Translation map** (hay **translation by $a$**) là:
>
> $$
> t_a: A \to A, \quad t_a(x) = x + a
> $$
>
> Khi cần phân biệt, viết $\tau_a$ thay vì $t_a$.

> [!theorem] Theorem 10.2 — $t_a$ Là Automorphism
> Với mọi $a \in A$, translation map $t_a: A \to A$ là một **automorphism của variety** (isomorphism $A \xrightarrow{\sim} A$). Inverse của nó là $t_{-a}$.

**Proof.** Vì $m: A \times A \to A$ là morphism và $t_a(x) = m(x, a) = m(\operatorname{id}_A(x), c_a(x))$ trong đó $c_a: A \to A$ là constant map về $a$, ta thấy $t_a$ là hợp thành của morphisms, nên là morphism. Tương tự $t_{-a}$ là morphism. Cuối cùng $t_{-a} \circ t_a = t_a \circ t_{-a} = \operatorname{id}_A$ (do tính kết hợp và $a + (-a) = 0$). $\blacksquare$

> [!corollary] Corollary 10.3 — Homogeneity của Abelian Variety
> Với mọi hai điểm $P, Q \in A$, tồn tại automorphism $t_{Q-P}: A \xrightarrow{\sim} A$ gửi $P$ vào $Q$. Vậy $A$ là **homogeneous** (mọi điểm hình học giống nhau nhau).

---

### Tính Chất Cơ Bản của Translation Maps

> [!theorem] Theorem 10.4 — Tính Chất Của $t_a$
> Cho $A$ là abelian variety. Với mọi $a, b \in A$:
>
> $$
> t_a \circ t_b = t_{a+b} = t_b \circ t_a
> $$
>
> $$
> t_0 = \operatorname{id}_A
> $$
>
> $$
> (t_a)^{-1} = t_{-a}
> $$
>
> Vậy $\{t_a \mid a \in A(k)\}$ là một **abelian group** (subgroup của $\operatorname{Aut}(A)$) isomorphic với $A(k)$.

**Proof.** $t_a \circ t_b(x) = t_a(x + b) = x + b + a = x + a + b = t_{a+b}(x)$ (dùng commutativity). $\blacksquare$

> [!example] Example 10.5 — Translation Trên Elliptic Curve
> Cho $E: y^2 = x^3 - x$ trên $\mathbb{F}_{101}$, và điểm $P = (0, 0)$.
>
> Translation $t_P: E \to E$ gửi $Q \mapsto Q + P$.
>
> Ví dụ: nếu $Q = (1, 0)$, thì $t_P(Q) = Q + P = (1, 0) + (0, 0)$.
>
> Theo công thức cộng: $\lambda = (0-0)/(0-1) = 0$, $x_3 = 0 - 1 - 0 = -1 \equiv 100$, $y_3 = 0 \cdot (1 - 100) - 0 = 0$.
>
> Vậy $t_P((1, 0)) = (100, 0)$.
>
> Đây là isomorphism: $t_{-P}((100, 0)) = (100, 0) + (-P) = (100, 0) + (0, 0) = ... $ sẽ ra $(1, 0)$.

---

## Morphisms of Abelian Varieties

> [!definition] Definition 10.6 — Homomorphism of Abelian Varieties
> Cho $A$ và $B$ là hai abelian varieties trên $k$. Một **homomorphism of abelian varieties** là một morphism of varieties $f: A \to B$ thỏa:
>
> $$
> f(x + y) = f(x) + f(y) \quad \text{cho mọi } x, y \in A
> $$
>
> Tương đương, biểu đồ sau commute:
>
> $$
> f \circ m_A = m_B \circ (f \times f)
> $$
>
> Ký hiệu tập hợp các homomorphisms: $\operatorname{Hom}(A, B)$.

> [!theorem] Theorem 10.7 — Morphism Gửi $0$ Vào $0$ Thì Là Homomorphism
> Cho $f: A \to B$ là morphism of varieties (không nhất thiết là homomorphism) thỏa $f(0_A) = 0_B$. Thì $f$ là homomorphism of abelian varieties.

**Proof.** Xét morphism $\phi: A \times A \to B$ định nghĩa bởi:

$$
\phi(x, y) = f(x + y) - f(x) - f(y)
$$

Ta tính:
- $\phi(x, 0_A) = f(x + 0) - f(x) - f(0_A) = f(x) - f(x) - 0_B = 0_B$
- $\phi(0_A, y) = f(0 + y) - f(0_A) - f(y) = f(y) - 0_B - f(y) = 0_B$

Vậy $\phi$ gửi $A \times \{0\}$ về $\{0_B\}$ và $\{0\} \times A$ về $\{0_B\}$. Vì $A$ là **complete** (abelian variety), **Rigidity Lemma** (Theorem 8.3) cho $\phi \equiv 0_B$. Tức là $f(x+y) = f(x) + f(y)$. $\blacksquare$

> [!corollary] Corollary 10.8 — Mọi Morphism Giữa Abelian Varieties Là "Gần Như" Homomorphism
> Nếu $f: A \to B$ là bất kỳ morphism of varieties nào, thì $g = f - f(0_A): A \to B$ (tức $g(x) = f(x) - f(0_A)$) là một homomorphism.

---

## Kernel của Homomorphism

> [!definition] Definition 10.9 — Kernel
> Cho $f: A \to B$ là homomorphism của abelian varieties. **Kernel** (nhân) của $f$ là:
>
> $$
> \ker(f) = f^{-1}(\{0_B\}) \subset A
> $$
>
> Đây là một **closed subgroup scheme** của $A$.

> [!theorem] Theorem 10.10 — Tính Chất của Kernel
> Cho $f: A \to B$ là homomorphism.
>
> (a) $\ker(f)$ là closed subgroup scheme của $A$ với group law kế thừa từ $A$.
>
> (b) Nếu $f$ là surjective (ngữ cảnh isogeny), thì $\ker(f)$ là **finite group scheme** và $\dim A = \dim B$.
>
> (c) $A/\ker(f) \cong \operatorname{Im}(f)$ (đồng cấu đẳng cấu, analog định lý đẳng cấu cho nhóm).

> [!example] Example 10.11 — Kernel Của $[n]: E \to E$
> Cho $[2]: E \to E$ là nhân đôi điểm trên $E: y^2 = x^3 - x$ (trên $\bar{k}$ với $\operatorname{char}(k) \neq 2$).
>
> $\ker([2]) = E[2] = \{P \in E(\bar{k}) \mid 2P = O\}$.
>
> 2-torsion points: $P = -P \Leftrightarrow (x, y) = (x, -y) \Leftrightarrow y = 0$.
>
> Từ phương trình $y^2 = x^3 - x = x(x-1)(x+1)$: các nghiệm $y = 0$ là $x = 0, 1, -1$.
>
> Vậy $E[2] = \{O, (0,0), (1,0), (-1,0)\} \cong \mathbb{Z}/2 \times \mathbb{Z}/2$.

---

## Endomorphism Ring

> [!definition] Definition 10.12 — Endomorphism Ring $\operatorname{End}(A)$
> **Endomorphism ring** (vành đồng cấu tự ánh) của abelian variety $A$ là:
>
> $$
> \operatorname{End}(A) = \operatorname{Hom}(A, A)
> $$
>
> với phép cộng: $(f + g)(x) = f(x) + g(x)$ (pointwise trong $A$), và phép nhân: $f \cdot g = f \circ g$ (composition).
>
> $\operatorname{End}(A)$ là một vành (không nhất thiết giao hoán).

> [!example] Example 10.13 — $\operatorname{End}(E)$ cho Elliptic Curve
> Với $E$ elliptic curve "chung" (không có complex multiplication):
>
> $$
> \operatorname{End}(E) \cong \mathbb{Z}
> $$
>
> Tức là endomorphism duy nhất là các phép nhân $[n]$ với $n \in \mathbb{Z}$ (bao gồm $n < 0$).
>
> Với $E$ có **complex multiplication** (CM): $\operatorname{End}(E)$ là order trong imaginary quadratic field $K = \mathbb{Q}(\sqrt{-d})$ cho $d > 0$.
>
> Ví dụ: $E: y^2 = x^3 - x$ có $\operatorname{End}(E) \cong \mathbb{Z}[i]$ (Gaussian integers) vì có automorphism $(x, y) \mapsto (-x, iy)$.

> [!theorem] Theorem 10.14 — $\operatorname{Hom}(A, B)$ Là $\mathbb{Z}$-Module Tự Do
> $\operatorname{Hom}(A, B)$ là một **torsion-free $\mathbb{Z}$-module** của rank hữu hạn $\leq (2g_A)(2g_B)$, trong đó $g_A = \dim A$ và $g_B = \dim B$.

**Proof sketch.** Sẽ theo sau từ lý thuyết Tate module (Bài 20-21): $\operatorname{Hom}(A, B) \hookrightarrow \operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(A), T_\ell(B))$, và vế phải là free $\mathbb{Z}_\ell$-module of rank $(2g_A)(2g_B)$.

---

## Phép Tịnh Tiến Tác Động Lên Line Bundles

Một ứng dụng quan trọng của translation maps là tác động lên line bundles (sẽ cần cho Bài 12):

> [!definition] Definition 10.15 — Pullback Của Line Bundle Qua Translation
> Cho $L$ là line bundle trên $A$ và $a \in A$. **Pullback** của $L$ qua $t_a$ là:
>
> $$
> t_a^* L = (t_a)^* L
> $$
>
> Đây là line bundle trên $A$ "dịch chuyển" theo $a$. Nếu $L = \mathcal{O}(D)$ cho divisor $D$, thì $t_a^* L = \mathcal{O}(t_a^* D) = \mathcal{O}(D - a)$ (trong ngôn ngữ divisor: dịch chuyển support của $D$ theo $-a$).

> [!note] Remark 10.16 — Ý Nghĩa Trong Picard Group
> Ánh xạ $a \mapsto [t_a^* L]$ từ $A(k)$ vào $\operatorname{Pic}(A)$ (Picard group) sẽ được nghiên cứu kỹ ở Bài 12 và trở thành công cụ định nghĩa **dual abelian variety** $\hat{A}$ ở Bài 24.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(101), [2, 3])

P = E.random_point()
Q = E.random_point()

def t_P(E, P, Q):
    return Q + P

R = t_P(E, P, Q)
print(f"t_P(Q) = {R}")
print(f"t_(-P)(t_P(Q)) = Q: {t_P(E, -P, R) == Q}")

f = E.multiplication_by_m(2)

n_points = E.order()
print(f"|E(F_q)| = {n_points}")

for n in [2, 3, 4, 5]:
    tor_pts = [p for p in E.points() if n*p == E(0)]
    print(f"|E[{n}]| = {len(tor_pts)}")
```

---

## Summary / Key Takeaways

- Translation map $t_a: A \to A$, $x \mapsto x + a$ là automorphism của $A$ với inverse $t_{-a}$.
- Tính **homogeneity**: mọi điểm trên $A$ "trông như nhau" nhờ translations.
- $t_a \circ t_b = t_{a+b}$: tập $\{t_a\}$ là nhóm abelian isomorphic với $A(k)$.
- Homomorphism $f: A \to B$: morphism of varieties tôn trọng group law.
- **Quan trọng**: nếu $f: A \to B$ là morphism gửi $0_A \to 0_B$, thì $f$ tự động là homomorphism (từ Rigidity Lemma).
- Kernel $\ker(f)$ là closed subgroup scheme; nếu $f$ là isogeny thì kernel hữu hạn.
- Endomorphism ring $\operatorname{End}(A)$: với elliptic curve thông thường $\cong \mathbb{Z}$, với CM curve lớn hơn.
- $t_a^* L$ là pullback của line bundle $L$ theo translation — sẽ là công cụ chính của Bài 12.

---

## References

- Mumford, D. *Abelian Varieties*, Chapter I, §3 (Morphisms). Oxford University Press, 1970.
- Milne, J.S. *Abelian Varieties* (2022), §2 (Corollary 2.2). [https://www.jmilne.org/math/xnotes/AVs.pdf](https://www.jmilne.org/math/xnotes/AVs.pdf)
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, Chapter III §4 (Isogenies, Endomorphisms).
- MIT 18.783 Elliptic Curves, Lecture 7 (Endomorphism rings). [https://math.mit.edu/classes/18.783/2019/LectureNotes7.pdf](https://math.mit.edu/classes/18.783/2019/LectureNotes7.pdf)
