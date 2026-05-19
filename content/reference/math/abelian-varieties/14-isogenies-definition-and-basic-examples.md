---
title: "14. Isogenies — Definition and Basic Examples"
type: foundation
tags: [math, abelian-varieties, lesson-14]
aliases: [Isogenies Definition and Basic Examples]
created: 2026-05-17
---

> **Prerequisites**: [[13-abelian-varieties-are-projective|13. Abelian Varieties Are Projective]], [[10-translation-maps-and-morphisms|10. Translation Maps and Morphisms of Abelian Varieties]]
> **Objectives**:
> - Hiểu định nghĩa isogeny và phân biệt với homomorphism thông thường
> - Tính degree của isogeny và hiểu ý nghĩa hình học
> - Nhận diện các ví dụ isogeny cơ bản: multiplication-by-n, projection, quotient
> - Thấy lý do tại sao isogeny được gọi là "almost isomorphism"

---

## Motivation / Intuition

Trong lý thuyết về các nhóm hữu hạn, hai nhóm "gần giống nhau" khi tồn tại một đồng cấu nhóm (group homomorphism) giữa chúng với kernel nhỏ và image lớn. Với abelian varieties — những đối tượng vừa là variety vừa là nhóm — ta cần một khái niệm tương tự nhưng phải tôn trọng cả hai cấu trúc: hình học và đại số.

Một **isogeny** (đẳng sinh) là morphism giữa hai abelian varieties mà:
1. **Surjective** — ánh xạ lên toàn bộ đích (không "bỏ sót" phần nào)
2. **Finite kernel** — hạt nhân chỉ là một nhóm hữu hạn (không "xóa" quá nhiều)

Hãy tưởng tượng: isogeny là bản đồ giữa hai "hành tinh tròn" (abelian varieties) mà mỗi điểm trên hành tinh đích có đúng một số hữu hạn điểm nguồn — không nhiều, không ít. Số đó (tính theo nghĩa scheme-theoretic) chính là **degree** của isogeny.

Ví dụ trực quan nhất là phép nhân $[n]: E \to E$ trên elliptic curve $E$. Mỗi điểm $Q \in E$ có đúng $n^2$ nghiệm của phương trình $nP = Q$ (khi $\operatorname{char}(k) \nmid n$). Vậy $[n]$ là isogeny degree $n^2$.

Isogeny quan trọng vì:
- Chúng bảo tồn "bản chất" của abelian variety — hai abelian varieties **isogenous** chia sẻ rất nhiều tính chất số học (số lượng rational points, cấu trúc Tate module, Frobenius eigenvalues)
- Lý thuyết isogeny cho phép ta "di chuyển" giữa các abelian varieties mà không mất thông tin cốt lõi
- Trong mật mã học, isogeny là nền tảng của các giao thức post-quantum như SIDH

---

## Định nghĩa Isogeny (Isogeny)

### Definition

> [!definition] Definition 14.1 — Isogeny
>
> Cho $A$ và $B$ là hai abelian varieties trên cùng trường $k$. Một **isogeny** (đẳng sinh) từ $A$ sang $B$ là một morphism của varieties
>
> $$
> f: A \to B
> $$
>
> thỏa mãn đồng thời ba điều kiện:
>
> 1. $f$ là một group homomorphism: $f(a + a') = f(a) + f(a')$ với mọi $a, a' \in A$
> 2. $f$ là surjective (toàn ánh)
> 3. $\ker(f)$ là một group scheme hữu hạn trên $k$

> [!note] Remark 14.2 — Điều kiện surjectivity tự động
>
> Một kết quả quan trọng: nếu $f: A \to B$ là một group homomorphism của abelian varieties với $\dim A = \dim B$ và $f \neq 0$, thì $f$ **tự động surjective**. Lý do: image của $f$ là một abelian subvariety của $B$ (vì $f$ là group hom và là morphism của varieties), và nếu có cùng chiều thì buộc phải bằng $B$.
>
> Vì vậy, trên thực tế ta chỉ cần kiểm tra: $f$ là group hom, $f \neq 0$, và $\ker(f)$ hữu hạn.

> [!note] Remark 14.3 — Từ morphism to group homomorphism
>
> Có một kết quả sâu hơn: nếu $f: A \to B$ là một **morphism của varieties** (không nhất thiết là group hom) thỏa $f(0_A) = 0_B$, thì $f$ **tự động là group homomorphism**. Đây là hệ quả của **Rigidity Lemma** (Lemma 08). Vì vậy ta chỉ cần kiểm tra điều kiện hình học (surjective, finite kernel) và điều kiện $f(0) = 0$.

### Definition — Degree

> [!definition] Definition 14.4 — Degree của Isogeny
>
> Cho $f: A \to B$ là một isogeny. **Degree** (bậc) của $f$, ký hiệu $\deg(f)$, được định nghĩa là:
>
> $$
> \deg(f) = \#\ker(f) := \dim_k \mathcal{O}(\ker(f))
> $$
>
> tức là **độ dài của $\mathcal{O}_{\ker(f)}$ như một $k$-vector space** (hay tương đương, là order của group scheme $\ker(f)$).
>
> Nếu $k = \bar{k}$ và $\ker(f)$ là étale (reduced), thì $\deg(f) = |\ker(f)(\bar{k})|$ — đơn giản là số điểm $\bar{k}$-rational của kernel.

> [!note] Remark 14.5 — Degree qua function fields
>
> Có một cách tương đương: $f: A \to B$ induces một field extension $f^*: k(B) \hookrightarrow k(A)$. Khi đó:
>
> $$
> \deg(f) = [k(A) : f^* k(B)]
> $$
>
> tức là degree của extension function field tương ứng. Điều này nhất quán với định nghĩa degree của morphism giữa các variety.

### Worked Example

> [!example] Example 14.6 — Multiplication-by-n trên Elliptic Curve
>
> Cho $E: y^2 = x^3 + ax + b$ là elliptic curve trên $k$ với $\operatorname{char}(k) \nmid n$, và xét morphism:
>
> $$
> [n]: E \longrightarrow E, \quad P \mapsto \underbrace{P + P + \cdots + P}_{n \text{ lần}}
> $$
>
> **Claim:** $[n]$ là isogeny với $\deg([n]) = n^2$.
>
> **Kiểm tra điều kiện:**
>
> - **Group hom**: $[n](P + Q) = n(P + Q) = nP + nQ = [n](P) + [n](Q)$ ✓
> - **Surjective**: Trên $\bar{k}$, phương trình $nP = Q$ luôn có nghiệm (vì $E(\bar{k})$ là divisible abelian group, và $\gcd(n, \operatorname{char}) = 1$) ✓
> - **Finite kernel**: $\ker([n]) = E[n]$ là tập $n$-torsion, hữu hạn ✓
>
> **Degree:** Ta có $E[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^2$ (sẽ chứng minh trong bài 17), nên:
>
> $$
> \deg([n]) = |E[n]| = n^2 = n^{2 \cdot 1}
> $$
>
> vì $\dim E = g = 1$.
>
> **Tổng quát hóa:** Với abelian variety $A$ có $\dim A = g$:
>
> $$
> \deg([n]: A \to A) = n^{2g}
> $$

> [!example] Example 14.7 — Projection từ Product
>
> Cho $A$ và $B$ là hai abelian varieties, xét morphism projection:
>
> $$
> \pi_1: A \times B \longrightarrow A, \quad (a, b) \mapsto a
> $$
>
> **Nhận xét:** $\pi_1$ **không** phải isogeny vì $\ker(\pi_1) = \{0\} \times B \cong B$ là infinite (trừ khi $B = 0$).
>
> Tuy nhiên, nếu ta xét abelian variety $A \times A$ với morphism:
>
> $$
> s: A \times A \to A, \quad (a, b) \mapsto a + b
> $$
>
> thì $\ker(s) = \{(a, -a) \mid a \in A\}$ — isomorphic with $A$ qua $a \mapsto (a, -a)$, vẫn là infinite. Vậy $s$ cũng không là isogeny.
>
> **Bài học:** Không phải mọi surjective group hom đều là isogeny — cần kernel hữu hạn.

> [!example] Example 14.8 — Quotient Isogeny
>
> Cho $A$ là abelian variety và $G \subset A$ là một finite subgroup scheme. Khi đó tồn tại abelian variety $B = A/G$ và một isogeny natural:
>
> $$
> \pi: A \longrightarrow A/G
> $$
>
> với $\ker(\pi) = G$ và $\deg(\pi) = \#G$.
>
> Đây là cách tổng quát để xây dựng isogeny: mỗi finite subgroup scheme $G \subset A$ cho ta một isogeny. Ngược lại, mọi isogeny đều phát sinh theo cách này.
>
> **Ví dụ cụ thể trên elliptic curve:** Cho $E$ và $G = E[2] = \{P \in E \mid 2P = 0\}$. Khi đó $E/E[2] \cong E$ là một elliptic curve khác, và $[2]: E \to E/E[2] \cong E$ chính là isogeny degree 4.

### Theorem

> [!theorem] Theorem 14.9 — Mọi Isogeny Đến từ Quotient
>
> Cho $f: A \to B$ là một isogeny. Khi đó $B \cong A/\ker(f)$ và $f$ phân tích thành:
>
> $$
> A \xrightarrow{\pi} A/\ker(f) \xrightarrow{\sim} B
> $$
>
> trong đó $\pi$ là quotient isogeny và mũi tên thứ hai là isomorphism của abelian varieties.

**Proof sketch.**
Đây là hệ quả của lý thuyết quotient cho group schemes và tính complete của abelian varieties. Morphism $f$ tự nhiên factorizes qua $A/\ker(f)$ bởi tính universal của quotient. Morphism cảm sinh $A/\ker(f) \to B$ vừa injective (do factorization), vừa surjective (do $f$ surjective), nên là isomorphism. $\blacksquare$

> [!note] Remark 14.10 — Composition của Isogenies
>
> Nếu $f: A \to B$ và $g: B \to C$ là hai isogeny, thì $g \circ f: A \to C$ cũng là isogeny, và:
>
> $$
> \deg(g \circ f) = \deg(g) \cdot \deg(f)
> $$
>
> Điều này vì $\ker(g \circ f)$ là extension của $\ker(g)$ bởi $f^{-1}(\ker(g)) \cong \ker(g)$... cụ thể hơn, theo lý thuyết function fields: $[k(A) : (g \circ f)^* k(C)] = [k(A) : f^* k(B)] \cdot [k(B) : g^* k(C)]$.

---

## Isogeny và Isomorphism

### Definition

> [!definition] Definition 14.11 — Isomorphism of Abelian Varieties
>
> Một isogeny $f: A \to B$ gọi là **isomorphism** (đẳng cấu) nếu $\deg(f) = 1$, tức là $\ker(f) = \{0\}$.
>
> Tương đương: $f$ là isomorphism ↔ $f$ có inverse morphism $f^{-1}: B \to A$ là group hom.

> [!note] Remark 14.12 — Isogeny không phải Isomorphism
>
> Ngược với intuition từ lý thuyết nhóm thuần túy: hai abelian varieties có thể **isogenous** (có isogeny giữa chúng) mà **không isomorphic**. Ví dụ:
>
> - Hai elliptic curves $E_1$ và $E_2$ over $\mathbb{Q}$ trong cùng isogeny class (cùng $L$-function) nhưng khác $j$-invariant thì isogenous nhưng không isomorphic.
> - Ví dụ nổi tiếng: $E_1: y^2 = x^3 - x$ và $E_2: y^2 = x^3 + 4x$ isogenous qua isogeny degree 2, nhưng $j(E_1) = 1728$ và $j(E_2) = 1728 \cdot 4^3/\Delta$ khác nhau sau khi tính.

### Worked Example

> [!example] Example 14.13 — Isogeny không là Isomorphism: Elliptic Curve
>
> Xét $E: y^2 = x^3 - x$ trên $\mathbb{Q}$. Điểm $2$-torsion gồm $\{O, (0,0), (1,0), (-1,0)\}$.
>
> Chọn subgroup $G = \{O, (0,0)\}$. Quotient $E' = E/G$ có thể tính bằng Vélu's formulas:
>
> $$
> E': y^2 = x^3 + 4x
> $$
>
> và isogeny $\phi: E \to E'$ có degree $2$.
>
> Ta có $j(E) = 1728$ và $j(E') = 1728 \cdot 64 / \Delta'$... (tính cụ thể) — hai curve này không isomorphic trên $\mathbb{Q}$ vì $E$ có rank $0$ và $E'$ có rank khác.
>
> Đây minh họa: isogeny tạo ra đối tượng "khác" mà vẫn liên kết chặt chẽ với đối tượng gốc.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(QQ, [-1, 0])
phi = E.isogenies_prime_degree(2)[0]
print(phi.degree())
E2 = phi.codomain()
print(E2.j_invariant())
print(E.j_invariant())
```

```python
E = EllipticCurve(GF(97), [2, 3])
print('Order of E:', E.order())
mul3 = E.multiplication_by_m_isogeny(3)
print('Degree of [3]:', mul3.degree())
```

---

## Summary / Key Takeaways

- Isogeny $f: A \to B$ là group homomorphism của abelian varieties, surjective và có finite kernel.
- **Degree** = $|\ker(f)|$ (kể theo scheme) = $[k(A) : f^* k(B)]$.
- Ví dụ chuẩn: $[n]: A \to A$ là isogeny với $\deg([n]) = n^{2g}$ (khi $\operatorname{char}(k) \nmid n$).
- Mọi isogeny đều phát sinh từ quotient: $A \to A/G$ với $G = \ker(f)$ finite.
- Isogeny không nhất thiết là isomorphism — hai AV isogenous có thể không isomorphic.
- Composition của isogenies là isogeny, với degree nhân lên.
- Nếu $f(0_A) = 0_B$ và $f$ là morphism of varieties, thì $f$ tự động là group hom (Rigidity).

---

## References

- Mumford, D. *Abelian Varieties*. Oxford University Press, 1974. Chapter 2.
- Milne, J. S. *Abelian Varieties* (v2.00). https://www.jmilne.org/math/xnotes/AVs.pdf. Sections 7–8.
- van der Geer, G. & Moonen, B. *Abelian Varieties (Preliminary Version)*. https://www.math.ru.nl/~bmoonen/BookAV/Isogs.pdf. Chapter V.
- Silverman, J. H. *The Arithmetic of Elliptic Curves* (2nd ed.). Springer GTM 106, 2009. Chapter III.4.
- MIT 18.783 Lecture Notes 5 (2019). https://math.mit.edu/classes/18.783/2019/LectureNotes5.pdf
