---
title: "Groups, Rings, and Fields"
type: index
tags: [math, groups-rings-fields, abstract-algebra, index]
created: 2026-05-15
---

**Groups, Rings, and Fields** là khóa học 26 bài về đại số trừu tượng (abstract algebra), xây dựng từ nền tảng toán học (tập hợp, logic, chứng minh) đến ba cấu trúc đại số cốt lõi: Nhóm (Groups), Vành (Rings), Trường (Fields). Toàn bộ khóa học đã được hoàn thành.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### Part 0 — Mathematical Foundations

#### [[01-sets|01. Sets and Set Operations]]
Ngôn ngữ tập hợp — subset, power set, union, intersection, complement, Cartesian product, indexed families, $\mathcal{P}(S)$. Nền móng cho mọi định nghĩa toán học về sau.

#### [[02-logic|02. Propositional and Predicate Logic]]
Connectives $(\lnot, \land, \lor, \to, \leftrightarrow)$, truth tables, quantifiers $(\forall, \exists)$, logical equivalences, negation of quantified statements. Công cụ then chốt để đọc và viết chứng minh.

#### [[03-proof-techniques|03. Proof Techniques]]
Direct proof, proof by contrapositive, proof by contradiction, proof by cases, existence & uniqueness proofs, mathematical induction (weak + strong). Kỹ năng thực hành: cách xây dựng một chứng minh chặt chẽ.

#### [[04-relations|04. Relations — Equivalence and Order]]
Binary relation, reflexive/symmetric/transitive, equivalence relation, equivalence classes, partition, quotient set $A/{\sim}$, partial order, total order, well-ordering. Công cụ phân hoạch cốt lõi cho coset và nhóm thương.

#### [[05-functions-cardinality|05. Functions, Cardinality, and Counting]]
Function as relation, injective/surjective/bijective, composition, inverse, image/preimage, pigeonhole principle, finite vs infinite sets, countable vs uncountable, Cantor–Schröder–Bernstein. Kết nối giữa giải tích và đại số.

### Transition

#### [[06-binary-operations|06. Binary Operations, Magmas, Semigroups, and Monoids]]
Binary operation, closure, associativity, commutativity, identity element, inverse element, Cayley table; hierarchy Magma → Semigroup → Monoid → Group (preview). Bước chuyển từ lý thuyết tập hợp sang đại số.

### Part I — Group Theory

#### [[07-groups-and-basic-properties|07. Groups and Basic Properties]]
Group axioms, Abelian group, uniqueness of identity & inverses, cancellation, examples: $(\mathbb{Z}, +)$, $(\mathbb{Z}/n\mathbb{Z}, +)$, $(\mathbb{Z}/n\mathbb{Z})^\times$, $GL_n(F)$, $S_n$, $D_{2n}$, $V_4$, $Q_8$. Định nghĩa order $|G|$.

#### [[08-subgroups-and-generators|08. Subgroups and Generators]]
Subgroup criteria (one-step & two-step), generated subgroup $\langle S \rangle$, subgroup lattice, centralizer, normalizer, center $Z(G)$. Bộ máy để phân tích cấu trúc nội tại của nhóm.

#### [[09-cyclic-groups-and-order-of-elements|09. Cyclic Groups and Order of Elements]]
Order of element $\operatorname{ord}(g)$, cyclic group $\langle g \rangle$, classification of cyclic groups ($\mathbb{Z}$ và $\mathbb{Z}/n\mathbb{Z}$), generators of $\mathbb{Z}/n\mathbb{Z}$, Euler's totient $\phi(n)$. Nhóm cyclic: cấu trúc đơn giản nhất nhưng xuất hiện khắp nơi.

#### [[10-cosets-and-lagranges-theorem|10. Cosets and Lagrange's Theorem]]
Left/right cosets, index $[G:H]$, Lagrange's theorem, consequences (order of element divides $|G|$), Euler's theorem, Fermat's little theorem. Định lý nền tảng đầu tiên của lý thuyết nhóm hữu hạn.

#### [[11-normal-subgroups-and-quotient-groups|11. Normal Subgroups and Quotient Groups]]
Normal subgroup $N \trianglelefteq G$, normality criteria, quotient group $G/N$, commutator subgroup $[G,G]$, abelianization. Cầu nối giữa cấu trúc nhóm và cấu trúc thương.

#### [[12-group-homomorphisms-and-isomorphism-theorems|12. Group Homomorphisms and Isomorphism Theorems]]
Homomorphism, kernel, image, isomorphism, First / Second / Third isomorphism theorems, correspondence theorem. Bộ ba định lý đẳng cấu — trái tim của đại số trừu tượng.

#### [[13-direct-products-and-ftfag|13. Direct Products and the Fundamental Theorem of Finite Abelian Groups]]
External & internal direct product, FTFAG (invariant factor form & primary decomposition), $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ iff $\gcd(m,n) = 1$. Phân loại hoàn toàn nhóm Abel hữu hạn.

### Part II — Ring Theory

#### [[14-rings-and-basic-properties|14. Rings and Basic Properties]]
Ring axioms, commutative ring, unity, zero divisors, units, nilpotents, idempotents; examples: $\mathbb{Z}$, $\mathbb{Z}/n\mathbb{Z}$, $M_n(R)$, product rings. Cấu trúc hai phép toán: mở rộng tự nhiên từ nhóm.

#### [[15-ideals-and-quotient-rings|15. Ideals and Quotient Rings]]
Left/right/two-sided ideals, principal ideal $\langle a \rangle$, quotient ring $R/I$, maximal ideal, prime ideal, correspondence theorem for rings. Ideal đóng vai trò tương tự normal subgroup trong lý thuyết vành.

#### [[16-ring-homomorphisms-and-isomorphism-theorems|16. Ring Homomorphisms and Isomorphism Theorems]]
Ring homomorphism, kernel = ideal, image, First / Second / Third isomorphism theorems; $R/\ker\phi \cong \operatorname{Im}\phi$. Cấu trúc đẳng cấu cho vành.

#### [[17-integral-domains-and-fields-of-fractions|17. Integral Domains and Fields of Fractions]]
Integral domain, characteristic, cancellation law, field $\Rightarrow$ integral domain, construction of $\operatorname{Frac}(R)$; $\mathbb{Q}$ from $\mathbb{Z}$. Xây dựng trường từ miền nguyên — mô phỏng cách $\mathbb{Q}$ ra đời từ $\mathbb{Z}$.

#### [[18-divisibility-euclidean-domains-pids-ufds|18. Divisibility — Euclidean Domains, PIDs, and UFDs]]
Associates, irreducibles vs primes, UFD, PID, Euclidean domain; hierarchy ED $\Rightarrow$ PID $\Rightarrow$ UFD; Bézout identity, GCD in PID. Lý thuyết chia hết trong vành — mở rộng số học từ $\mathbb{Z}$ lên vành tổng quát.

#### [[19-polynomial-rings|19. Polynomial Rings]]
$R[x]$ as ring, degree, leading coefficient; division algorithm in $F[x]$; roots and factor theorem; irreducibility criteria: Eisenstein, reduction mod $p$; $F[x]$ is a Euclidean domain; $F[x]/\langle p(x) \rangle$ is a field iff $p$ irreducible. Vành đa thức — cầu nối giữa đại số trừu tượng và lý thuyết phương trình.

#### [[20-chinese-remainder-theorem|20. Chinese Remainder Theorem]]
Coprime ideals, CRT for rings: $R/I_1 \cdots I_k \cong \prod R/I_i$; CRT for $\mathbb{Z}/n\mathbb{Z}$; structure of $(\mathbb{Z}/n\mathbb{Z})^\times$ via CRT. Định lý Thặng dư Trung Hoa — công cụ phân rã cấu trúc vành.

### Part III — Field Theory

#### [[21-fields-and-field-extensions|21. Fields and Field Extensions]]
Field axioms, subfield, prime subfield, field extension $K/F$, degree $[K:F]$, tower law, finite vs infinite extensions. Trường — cấu trúc đại số hoàn hảo nhất với đầy đủ bốn phép toán.

#### [[22-algebraic-elements-and-minimal-polynomials|22. Algebraic Elements and Minimal Polynomials]]
Algebraic vs transcendental element, minimal polynomial $m_\alpha(x)$, $F(\alpha) \cong F[x]/\langle m_\alpha \rangle$, simple extension, $[F(\alpha):F] = \deg m_\alpha$. Cơ chế "thêm nghiệm" vào trường một cách đại số.

#### [[23-splitting-fields|23. Splitting Fields]]
Splitting field of $f \in F[x]$, existence (Kronecker's theorem) & uniqueness up to isomorphism, algebraic closure $\overline{F}$, algebraic extensions. Trường nhỏ nhất chứa toàn bộ nghiệm của một đa thức.

#### [[24-finite-fields-existence-and-uniqueness|24. Finite Fields — Existence and Uniqueness]]
$\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$, $\mathbb{F}_{p^n}$ as splitting field of $x^{p^n} - x$ over $\mathbb{F}_p$, uniqueness up to isomorphism; every finite field has order $p^n$. Xây dựng và chứng minh tính duy nhất của trường hữu hạn.

#### [[25-structure-of-finite-fields|25. Structure of Finite Fields]]
Subfield lattice of $\mathbb{F}_{p^n}$ (subfields $\leftrightarrow$ divisors of $n$), Frobenius endomorphism $\phi: x \mapsto x^p$, $\operatorname{Gal}(\mathbb{F}_{p^n}/\mathbb{F}_p) \cong \mathbb{Z}/n\mathbb{Z}$ generated by Frobenius. Cấu trúc nội tại của trường hữu hạn: mạng trường con, tự đẳng cấu Frobenius, nhóm Galois.

#### [[26-primitive-elements|26. Primitive Elements]]
$\mathbb{F}_{p^n}^\times$ is cyclic (primitive root theorem), primitive element/generator, primitive polynomial, explicit construction $\mathbb{F}_{p^n} \cong \mathbb{F}_p[x]/\langle f(x) \rangle$ for $f$ primitive. Bài học đỉnh cao: chứng minh nhóm nhân của mọi trường hữu hạn đều cyclic.

---

## Appendices

| # | Title | File | Related Lesson |
|---|-------|------|---------------|
| A0 | Proof of Lagrange's Theorem | [[a0-lagrange-theorem\|A0. Proof of Lagrange's Theorem]] | [[10-cosets-and-lagranges-theorem\|10. Cosets and Lagrange's Theorem]] |
| A1 | Proof of First Isomorphism Theorem (Groups) | [[a1-first-isomorphism-theorem\|A1. Proof of First Isomorphism Theorem (Groups)]] | [[12-group-homomorphisms-and-isomorphism-theorems\|12. Group Homomorphisms]] |
| A2 | Fundamental Theorem of Finite Abelian Groups | [[a2-ftfag\|A2. Fundamental Theorem of Finite Abelian Groups]] | [[13-direct-products-and-ftfag\|13. Direct Products and FTFAG]] |
| A3 | Chinese Remainder Theorem (Ring Version) | [[a3-crt-ring-version\|A3. Chinese Remainder Theorem (Ring Version)]] | [[20-chinese-remainder-theorem\|20. Chinese Remainder Theorem]] |
| A4 | Existence and Uniqueness of Finite Fields | [[a4-finite-fields-existence\|A4. Existence and Uniqueness of Finite Fields]] | [[24-finite-fields-existence-and-uniqueness\|24. Finite Fields — Existence and Uniqueness]] |
| A5 | Proof of Primitive Root Theorem | [[a5-primitive-root-theorem\|A5. Proof of Primitive Root Theorem]] | [[26-primitive-elements\|26. Primitive Elements]] |

---

## Global Notation

Bảng ký hiệu dùng nhất quán xuyên suốt toàn bộ khóa học.

| Ký hiệu | Ý nghĩa | Định nghĩa tại |
|---------|---------|----------------|
| $\mathbb{N}$ | Tập số tự nhiên $\{0, 1, 2, \ldots\}$ | [[01-sets\|Lesson 01]] |
| $\mathbb{Z}$ | Tập số nguyên | [[01-sets\|Lesson 01]] |
| $\mathbb{Q}$ | Tập/Trường số hữu tỉ | [[01-sets\|Lesson 01]] |
| $\mathbb{R}$ | Tập/Trường số thực | [[01-sets\|Lesson 01]] |
| $\mathbb{C}$ | Tập/Trường số phức | [[01-sets\|Lesson 01]] |
| $\mathbb{Z}/n\mathbb{Z}$ | Vành/Nhóm cyclic cấp $n$ (modulo $n$) | [[07-groups-and-basic-properties\|Lesson 07]] |
| $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử ($p$ nguyên tố) | [[14-rings-and-basic-properties\|Lesson 14]] |
| $\mathbb{F}_{p^n}$ | Trường hữu hạn $p^n$ phần tử | [[24-finite-fields-existence-and-uniqueness\|Lesson 24]] |
| $\mathcal{P}(S)$ | Tập lũy thừa của $S$ | [[01-sets\|Lesson 01]] |
| $A \times B$ | Tích Descartes | [[01-sets\|Lesson 01]] |
| $\emptyset$ | Tập rỗng | [[01-sets\|Lesson 01]] |
| $\in$ | Quan hệ thuộc (element of) | [[01-sets\|Lesson 01]] |
| $\forall$ | Lượng từ toàn thể (for all) | [[02-logic\|Lesson 02]] |
| $\exists$ | Lượng từ tồn tại (there exists) | [[02-logic\|Lesson 02]] |
| $\lnot, \land, \lor, \to, \leftrightarrow$ | Phép nối logic | [[02-logic\|Lesson 02]] |
| $\gcd(a,b)$ | Ước chung lớn nhất | [[03-proof-techniques\|Lesson 03]] |
| $\operatorname{lcm}(a,b)$ | Bội chung nhỏ nhất | [[09-cyclic-groups-and-order-of-elements\|Lesson 09]] |
| $\phi(n)$ | Hàm Euler totient | [[09-cyclic-groups-and-order-of-elements\|Lesson 09]] |
| $\cong$ | Đẳng cấu (isomorphism) | [[12-group-homomorphisms-and-isomorphism-theorems\|Lesson 12]] |
| $G$ | Nhóm | [[07-groups-and-basic-properties\|Lesson 07]] |
| $H \leq G$ | $H$ là nhóm con của $G$ | [[08-subgroups-and-generators\|Lesson 08]] |
| $N \trianglelefteq G$ | $N$ là nhóm con chuẩn tắc của $G$ | [[11-normal-subgroups-and-quotient-groups\|Lesson 11]] |
| $G/N$ | Nhóm thương | [[11-normal-subgroups-and-quotient-groups\|Lesson 11]] |
| $|G|$ | Cấp (order) của nhóm $G$ | [[07-groups-and-basic-properties\|Lesson 07]] |
| $\operatorname{ord}(g)$ | Cấp của phần tử $g$ | [[09-cyclic-groups-and-order-of-elements\|Lesson 09]] |
| $\langle S \rangle$ | Nhóm con sinh bởi tập $S$ | [[08-subgroups-and-generators\|Lesson 08]] |
| $\langle a \rangle$ (vành) | Ideal chính sinh bởi $a$ | [[15-ideals-and-quotient-rings\|Lesson 15]] |
| $Z(G)$ | Tâm của nhóm $G$ | [[08-subgroups-and-generators\|Lesson 08]] |
| $[G:H]$ | Chỉ số của $H$ trong $G$ | [[10-cosets-and-lagranges-theorem\|Lesson 10]] |
| $\ker\phi$ | Kernel của đồng cấu $\phi$ | [[12-group-homomorphisms-and-isomorphism-theorems\|Lesson 12]] |
| $\operatorname{Im}\phi$ | Ảnh của đồng cấu $\phi$ | [[12-group-homomorphisms-and-isomorphism-theorems\|Lesson 12]] |
| $R$ | Vành | [[14-rings-and-basic-properties\|Lesson 14]] |
| $R^\times$ | Nhóm đơn vị của vành $R$ | [[14-rings-and-basic-properties\|Lesson 14]] |
| $R[x]$ | Vành đa thức với hệ số trong $R$ | [[19-polynomial-rings\|Lesson 19]] |
| $F[x]$ | Vành đa thức trên trường $F$ | [[19-polynomial-rings\|Lesson 19]] |
| $M_n(R)$ | Vành ma trận vuông $n \times n$ trên $R$ | [[14-rings-and-basic-properties\|Lesson 14]] |
| $S_n$ | Nhóm đối xứng bậc $n$ | [[07-groups-and-basic-properties\|Lesson 07]] |
| $A_n$ | Nhóm thay phiên bậc $n$ | [[07-groups-and-basic-properties\|Lesson 07]] |
| $GL_n(F)$ | Nhóm tuyến tính tổng quát trên trường $F$ | [[07-groups-and-basic-properties\|Lesson 07]] |
| $\operatorname{char}(F)$ | Đặc số của trường $F$ | [[17-integral-domains-and-fields-of-fractions\|Lesson 17]] |
| $[K:F]$ | Bậc của mở rộng trường $K/F$ | [[21-fields-and-field-extensions\|Lesson 21]] |
| $F(\alpha)$ | Mở rộng đơn của $F$ sinh bởi $\alpha$ | [[22-algebraic-elements-and-minimal-polynomials\|Lesson 22]] |
| $\overline{F}$ | Bao đóng đại số của $F$ | [[23-splitting-fields\|Lesson 23]] |
| $\operatorname{Gal}(K/F)$ | Nhóm Galois của mở rộng $K/F$ | [[25-structure-of-finite-fields\|Lesson 25]] |

---

## References

- Dummit, D. S. & Foote, R. M. — *Abstract Algebra* (3rd ed.)
- Hungerford, T. W. — *Algebra* (GTM 73)
- Lang, S. — *Algebra* (GTM 211, Revised 3rd ed.)
- Judson, T. W. — *Abstract Algebra: Theory and Applications* (open-source)
- Velleman, D. J. — *How to Prove It: A Structured Approach*

---

## Diagram Asset Registry

Không có HTML/CSS diagram nào trong topic này. Tất cả diagram đều là Mermaid nhúng trực tiếp trong file Markdown.

| File | Lesson | Mô tả |
|------|--------|--------|
| *(không có)* | — | — |

*(Cập nhật dần sau mỗi diagram được render.)*
