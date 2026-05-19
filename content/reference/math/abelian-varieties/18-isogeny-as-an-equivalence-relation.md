---
title: "18. Isogeny as an Equivalence Relation"
type: theory
tags: [math, abelian-varieties, lesson-18]
aliases: [Isogeny as an Equivalence Relation]
created: 2026-05-17
---

> **Prerequisites**: [[16-the-dual-isogeny|16. The Dual Isogeny]], [[17-n-torsion-points-a-n|17. n-Torsion Points A[n]]], [[14-isogenies-definition-and-basic-examples|14. Isogenies — Definition and Basic Examples]]
> **Objectives**:
> - Chứng minh "isogenous" là quan hệ tương đương
> - Hiểu tại sao isogeny class là đơn vị nghiên cứu tự nhiên trong lý thuyết AV
> - Nắm cấu trúc của $\operatorname{Hom}(A, B)$ như $\mathbb{Z}$-module tự do hữu hạn rank
> - Hiểu $\operatorname{End}(A)$ là ring với involution, và Poincaré reducibility

---

## Motivation / Intuition

Khi nghiên cứu abelian varieties, câu hỏi tự nhiên là: khi nào hai abelian varieties "về cơ bản là như nhau"? Có hai mức độ:

- **Isomorphism**: giống hệt nhau, không thể phân biệt về mặt variety và group
- **Isogeny**: "almost the same" — liên kết nhau bởi một morphism với kernel hữu hạn

Hóa ra, đối với nhiều câu hỏi trong số học (đếm rational points, $L$-functions, Galois representations), hai abelian varieties isogenous cho kết quả **giống hệt nhau**. Vì vậy, **isogeny class** (lớp tương đương theo isogeny) là đơn vị nghiên cứu tự nhiên và quan trọng.

Để "isogenous" là một quan hệ tương đương tốt, ta cần chứng minh **tính đối xứng**: nếu $A \to B$ là isogeny, thì tồn tại isogeny $B \to A$. Đây không phải hiển nhiên (isogeny không có inverse!) nhưng **dual isogeny** $\hat{f}: \hat{B} \to \hat{A}$ kết hợp với các isomorphism canonical sẽ cho ta điều này.

Ngoài ra, tập $\operatorname{Hom}(A, B)$ của tất cả homomorphisms từ $A$ sang $B$ có cấu trúc **$\mathbb{Z}$-module tự do hữu hạn rank** — điều này không rõ ràng nhưng cực kỳ hữu ích. Nó có nghĩa là: số lượng isogeny "khác nhau" giữa $A$ và $B$ có thể mô tả hoàn toàn bởi một số hữu hạn generators.

---

## "Isogenous" là Quan Hệ Tương Đương

### Definition

> [!definition] Definition 18.1 — Quan hệ Isogenous
>
> Hai abelian varieties $A$ và $B$ trên $k$ gọi là **isogenous** (đẳng sinh), ký hiệu $A \sim B$, nếu tồn tại một isogeny $f: A \to B$.

### Theorem

> [!theorem] Theorem 18.2 — Isogeny là Equivalence Relation
>
> Quan hệ "isogenous" là một **quan hệ tương đương** trên tập các abelian varieties trên $k$ với cùng dimension. Cụ thể:
>
> 1. **Reflexive** (Phản xạ): $A \sim A$
> 2. **Symmetric** (Đối xứng): $A \sim B \Rightarrow B \sim A$
> 3. **Transitive** (Bắc cầu): $A \sim B$ và $B \sim C$ $\Rightarrow A \sim C$

**Proof.**

**(1) Reflexive:** $\operatorname{id}_A: A \to A$ là isogeny degree $1$. ✓

**(2) Symmetric:** Cho $f: A \to B$ isogeny. Xét dual isogeny $\hat{f}: \hat{B} \to \hat{A}$ (Bài 16).

Ta cần isogeny $B \to A$, không phải $\hat{B} \to \hat{A}$.

Dùng double duality $\hat{\hat{A}} \cong A$ và $\hat{\hat{B}} \cong B$ (bài 27, nhưng accept ở đây):

$$
B \cong \hat{\hat{B}} \xrightarrow{\hat{\hat{f}} = f} \hat{\hat{A}} \cong A
$$

Nhưng $\hat{\hat{f}} = f$, không phải isogeny $B \to A$.

**Cách đơn giản hơn cho elliptic curves:** Với $f: E_1 \to E_2$ isogeny degree $n$, dual isogeny $\hat{f}: E_2 \to E_1$ (trực tiếp, không qua dual variety). Vậy $E_2 \sim E_1$. ✓

**Cách cho AV tổng quát:** $\hat{f}: \hat{B} \to \hat{A}$ là isogeny. Kết hợp với isogenies $A \to \hat{A}$ và $\hat{B} \to B$ (từ polarization của $A$ và $B$ — mọi AV đều có polarization, bài 35), ta được isogeny $B \to A$ bằng cách compose.

Cụ thể: cho $\lambda_A: A \to \hat{A}$ và $\lambda_B: B \to \hat{B}$ là polarizations. Thì:

$$
B \xrightarrow{\lambda_B} \hat{B} \xrightarrow{\hat{f}} \hat{A} \xrightarrow{\lambda_A^{-1}} A
$$

nhưng $\lambda_A^{-1}$ không nhất thiết là morphism... Ta cần dùng $\hat{\lambda}_A \circ \lambda_A = [\deg \lambda_A]$ và tương tự.

**Kết quả đúng là:** tồn tại isogeny $B \to A$ (lấy ví dụ $\hat{f} \circ \lambda_B$ sau khi compose với isogeny ngược của $\hat{A} \to A$). Proof đầy đủ cần tool từ bài 24–27. ✓

**(3) Transitive:** Cho $f: A \to B$ và $g: B \to C$ là isogenies. Thì $g \circ f: A \to C$ là isogeny (bài 14, Remark 14.10). ✓ $\blacksquare$

> [!definition] Definition 18.3 — Isogeny Class
>
> **Isogeny class** (lớp đẳng sinh) của $A$, ký hiệu $[A]$ hay $[A]_\sim$, là tập tất cả abelian varieties isogenous với $A$:
>
> $$
> [A] = \{B \text{ abelian variety trên } k \mid B \sim A\}
> $$
>
> Nghiên cứu isogeny class là bài toán trung tâm trong số học của abelian varieties.

---

## Cấu trúc của $\operatorname{Hom}(A, B)$

### Theorem

> [!theorem] Theorem 18.4 — $\operatorname{Hom}(A, B)$ là $\mathbb{Z}$-Module Tự Do Hữu Hạn Rank
>
> Cho $A$ và $B$ là abelian varieties trên $k$ với $\dim A = g_A$, $\dim B = g_B$. Thì:
>
> $$
> \operatorname{Hom}(A, B) \text{ là } \mathbb{Z}\text{-module tự do hữu hạn rank}
> $$
>
> với:
>
> $$
> \operatorname{rank}_\mathbb{Z} \operatorname{Hom}(A, B) \leq 4 g_A g_B
> $$
>
> Khi $A = B$: $\operatorname{End}(A) = \operatorname{Hom}(A, A)$ là $\mathbb{Z}$-module tự do rank $\leq 4g^2$.

**Proof sketch (sử dụng Tate module).**
Fix prime $\ell \neq \operatorname{char}(k)$. Mỗi $f \in \operatorname{Hom}(A, B)$ induces $T_\ell(f): T_\ell(A) \to T_\ell(B)$ — linear map giữa hai $\mathbb{Z}_\ell$-modules free rank $2g_A$ và $2g_B$.

Map $\rho_\ell: \operatorname{Hom}(A, B) \to \operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(A), T_\ell(B))$ là **injective** (sẽ chứng minh trong bài 21).

Vì $\operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(A), T_\ell(B)) \cong M_{2g_B \times 2g_A}(\mathbb{Z}_\ell)$ là $\mathbb{Z}_\ell$-module tự do rank $4g_A g_B$, và $\operatorname{Hom}(A, B)$ là submodule của module này, nên $\operatorname{Hom}(A, B)$ là $\mathbb{Z}$-module tự do hữu hạn rank $\leq 4g_A g_B$. $\blacksquare$

> [!note] Remark 18.5 — Ý nghĩa của Theorem 18.4
>
> Kết quả này có hệ quả sâu:
>
> - $\operatorname{Hom}(A, B)$ không quá phức tạp — nó là lattice trong $\mathbb{Z}^N$ với $N \leq 4g_A g_B$
> - Có thể nghiên cứu $\operatorname{Hom}(A, B)$ qua linear algebra bằng cách embed vào $\mathbb{Q}_\ell$-vector space
> - Tất cả isogenies từ $A$ sang $B$ "gần như linear" — chúng sống trong một không gian vector hữu hạn chiều

### Worked Example

> [!example] Example 18.6 — $\operatorname{End}(E)$ cho Elliptic Curve
>
> Cho $E$ là elliptic curve trên $k$.
>
> Luôn có $\mathbb{Z} \hookrightarrow \operatorname{End}(E)$ qua $n \mapsto [n]$.
>
> **Case 1: $E$ generic** (không có complex multiplication). Khi đó $\operatorname{End}(E) = \mathbb{Z}$, rank $1$.
>
> **Case 2: $E$ có CM** (complex multiplication by $\mathcal{O}_K$, order trong imaginary quadratic field $K$). Khi đó $\operatorname{End}(E) \cong \mathcal{O}_K$, một lattice rank $2$ trong $\mathbb{Z}^2$.
>
> **Case 3: $E$ supersingular** trên $\bar{\mathbb{F}}_p$. Khi đó $\operatorname{End}(E)$ là **maximal order** trong quaternion algebra $B_{p,\infty}$, rank $4$ trên $\mathbb{Z}$.
>
> Rank của $\operatorname{End}(E)$ nằm trong $\{1, 2, 4\} \subset \{1, 2, 3, 4\}$ (bound $4g^2 = 4$ với $g=1$).

### Theorem

> [!theorem] Theorem 18.7 — $\operatorname{End}(A)$ là Ring
>
> Với $A$ abelian variety, $\operatorname{End}(A) = \operatorname{Hom}(A, A)$ là một **ring** (không nhất thiết commutative) với:
>
> - Phép cộng: $(f + g)(P) = f(P) + g(P)$ (group law của $A$)
> - Phép nhân (composition): $(f \cdot g) = f \circ g$
> - Đơn vị: $1 = \operatorname{id}_A$
>
> **Không gian endomorphism** hay **endomorphism algebra** là:
>
> $$
> \operatorname{End}^0(A) := \operatorname{End}(A) \otimes_\mathbb{Z} \mathbb{Q}
> $$
>
> Đây là $\mathbb{Q}$-algebra hữu hạn chiều, và là đối tượng trung tâm trong phân loại AV.

---

## Poincaré Reducibility

### Theorem

> [!theorem] Theorem 18.8 — Poincaré Reducibility (Poincaré's Theorem)
>
> Cho $A$ là abelian variety và $B \subset A$ là abelian subvariety. Thì tồn tại abelian subvariety $B' \subset A$ sao cho:
>
> $$
> B \cap B' \text{ là finite}, \quad B + B' = A
> $$
>
> Tức là $A$ **isogenous** (không nhất thiết isomorphic) với $B \times B'$:
>
> $$
> A \sim B \times B'
> $$

**Proof sketch.**
Sử dụng polarization $\lambda: A \to \hat{A}$ (mọi AV đều có). Đặt $C = \ker(\lambda|_B: B \to \hat{A})$ sau khi restrict $\lambda$ về $B$ rồi project... Cụ thể hơn: đặt $B' = \lambda^{-1}(\hat{A}/\hat{B})$ — đây là subvariety "orthogonal complement" của $B$ theo nghĩa của polarization. Xem Milne §12 cho proof đầy đủ. $\blacksquare$

### Corollary

> [!corollary] Corollary 18.9 — Phân tích thành Simple AV
>
> Mọi abelian variety $A$ đều isogenous với một product:
>
> $$
> A \sim A_1^{e_1} \times A_2^{e_2} \times \cdots \times A_r^{e_r}
> $$
>
> trong đó $A_1, \ldots, A_r$ là các **simple abelian varieties** (AV không có subvariety con nào ngoài $0$ và chính nó), và $e_i \geq 1$.
>
> Factorization này là **duy nhất up to isogeny và permutation** (tương tự Jordan-Hölder).

> [!note] Remark 18.10 — Simple AV và Endomorphism Ring
>
> Nếu $A$ là simple abelian variety, thì $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$ là một **division algebra** (mọi phần tử $\neq 0$ đều khả nghịch). Đây là hệ quả của tính simple: mọi endomorphism $\neq 0$ phải là surjective (vì kernel là subvariety), nên là isogeny, nên có dual isogeny = "inverse" trong $\operatorname{End}^0(A)$.
>
> Điều này analog với: module đơn giản (simple) có endomorphism ring là field (Schur's lemma).
>
> Danh sách các division algebras có thể xuất hiện là $\operatorname{End}^0(A)$ cho simple AV được phân loại hoàn toàn bởi **Albert's classification** (1939), bao gồm bốn loại: real multiplication (Type I), CM (Type II/III), quaternion (Type IV).

---

## Isogeny Category

### Definition

> [!definition] Definition 18.11 — Isogeny Category
>
> **Isogeny category** của abelian varieties trên $k$, ký hiệu $\mathcal{AV}^0(k)$, là category với:
>
> - **Objects**: abelian varieties trên $k$
> - **Morphisms**: $\operatorname{Hom}_{\mathcal{AV}^0}(A, B) = \operatorname{Hom}(A, B) \otimes_\mathbb{Z} \mathbb{Q} = \operatorname{Hom}^0(A, B)$
>
> Trong category này, mọi isogeny đều **khả nghịch**: nếu $f: A \to B$ là isogeny degree $d$, thì "inverse" là $\frac{1}{d}\hat{f}: B \to A$ (trong $\operatorname{Hom}^0$, chia được cho $d$).
>
> Isogeny category là một **semi-simple abelian category** (Theorem Poincaré reducibility).

> [!note] Remark 18.12 — Ý nghĩa của Isogeny Category
>
> Trong isogeny category:
>
> - $A \cong B$ (isomorphic in $\mathcal{AV}^0$) ↔ $A \sim B$ (isogenous as varieties)
> - Simple objects (objects without proper non-zero subobjects) = simple abelian varieties
> - $\operatorname{End}_{\mathcal{AV}^0}(A) = \operatorname{End}^0(A)$ là $\mathbb{Q}$-algebra
>
> Đây là "sân chơi" đúng đắn cho lý thuyết số về AV.

> [!example] Example 18.13 — Isogeny Class của $E/\mathbb{Q}$
>
> Theo **Faltings' Isogeny Theorem** (1983, trước đây là Tate Conjecture): hai elliptic curves $E_1, E_2$ trên số field $k$ là isogenous ↔ $L(E_1, s) = L(E_2, s)$ (cùng $L$-function) ↔ $|E_1(\mathbb{F}_p)| = |E_2(\mathbb{F}_p)|$ với mọi prime $p$ good reduction.
>
> Ví dụ: Tất cả elliptic curves trên $\mathbb{Q}$ có conductor $37$ thuộc cùng một isogeny class: $\{37a1, 37a2, 37a3\}$ (ba curves isogenous nhau với isogeny degrees $2$ và $3$).
>
> Đây là ví dụ về isogeny graph — graph với vertices là AV trong một isogeny class và edges là isogenies prime degree.

---

## SageMath Cheatsheet

```python
E1 = EllipticCurve('37a1')
E2 = EllipticCurve('37a2')
print('Same isogeny class:', E1.is_isogenous(E2))
print('Degree of isogeny:', E1.isogeny_degree(E2))
```

```python
E = EllipticCurve(QQ, [-1, 0])
End_rank = E.endomorphism_ring().rank()
print('rank of End(E):', End_rank)
```

```python
E = EllipticCurve(GF(101^2), [0, 1])
print('Supersingular:', E.is_supersingular())
print('End(E) quaternionic if supersingular')
```

---

## Summary / Key Takeaways

- "Isogenous" là **quan hệ tương đương**: reflexive (identity), symmetric (dual isogeny), transitive (compose).
- **Isogeny class** $[A]$ là đơn vị nghiên cứu tự nhiên — nhiều bất biến số học không thay đổi trong một isogeny class.
- $\operatorname{Hom}(A, B)$ là **$\mathbb{Z}$-module tự do** hữu hạn rank $\leq 4 g_A g_B$ — chứng minh qua injectivity của $\ell$-adic representation.
- $\operatorname{End}(A)$ là ring (không commutative); $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$ là $\mathbb{Q}$-algebra.
- $A$ simple $\Rightarrow$ $\operatorname{End}^0(A)$ là division algebra.
- **Poincaré reducibility**: mọi AV isogenous với product của simple AV (factorization duy nhất up to isogeny).
- **Isogeny category** $\mathcal{AV}^0(k)$: mọi isogeny trở thành isomorphism, là semi-simple abelian category.
- Faltings' theorem: hai AV isogenous ↔ cùng $L$-function ↔ cùng char poly of Frobenius (trên finite fields, đây là Tate's theorem).

---

## References

- Mumford, D. *Abelian Varieties*. Chapter 4 (Poincaré reducibility). Oxford University Press, 1974.
- Milne, J. S. *Abelian Varieties*. §12 (Poincaré irreducibility), §7 (Endomorphisms). https://www.jmilne.org/math/xnotes/AVs.pdf
- Bruin, P. *Endomorphism Rings of Abelian Varieties*. https://pub.math.leidenuniv.nl/~bruinpj/endomorphisms.pdf
- Conrad, B. *Lecture 1: Generalities on Endomorphisms* (2012). http://math.stanford.edu/~conrad/DarmonCM/2011Notes/NTLS021512.pdf
- Lang, S. *Abelian Varieties*. Springer, 1983. Chapter IV.
- Kieffer, J. *Isogeny Graphs of Abelian Varieties over Finite Fields*. https://members.loria.fr/JKieffer/files/isogenycourse.pdf
