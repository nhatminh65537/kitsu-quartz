---
title: "01. Abelian Varieties — Foundations"
type: math-component
tags: [crypto, isogeny, abelian-variety, lesson-01]
aliases: [Abelian Varieties Foundations]
created: 2026-04-09
---

> **Prerequisites**: Elliptic curves over finite fields (group law, Weierstrass form), projective geometry cơ bản (projective space, homogeneous coordinates), algebraic variety (khái niệm sơ lược)
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $k$ | Field đại số đóng (algebraically closed), hoặc $\mathbb{F}_q$ tùy ngữ cảnh |
> | $\bar{k}$ | Algebraic closure của $k$ |
> | $\mathbb{P}^n$ | Projective $n$-space trên $k$ |
> | $E/k$ | Elliptic curve định nghĩa trên $k$ |
> | $\mathcal{O}$ | Điểm $\mathcal{O}$ (identity) trên elliptic curve hoặc abelian variety |
> | $[n]$ | Phép nhân-bởi-$n$ trên nhóm |
> | $\text{char}(k)$ | Characteristic của field $k$ |

---

## Tại sao cần Abelian Varieties?

Elliptic curve là một abelian variety dimension 1. Mọi thứ quen thuộc — group law, isogenies, torsion subgroups, Weil pairing — đều là instance đặc biệt của các khái niệm tổng quát hơn sống trên abelian varieties dimension cao hơn. Để hiểu Castryck-Decru attack, ta cần làm việc với **abelian surfaces** (dimension 2): cụ thể là các variety có dạng tích $E_1 \times E_2$ của hai elliptic curves, và **Jacobians** của genus-2 curves — hai loại đối tượng trung tâm trong attack. Lesson này xây dựng ngôn ngữ nền tảng.

---

## Abelian Variety là gì?

Abelian variety là sự kết hợp của hai cấu trúc: cấu trúc hình học (projective algebraic variety) và cấu trúc đại số (nhóm giao hoán), trong đó phép nhóm phải là một **morphism** — tức là "liên tục" theo nghĩa đại số.

> [!note] Định nghĩa 1.1 — Abelian Variety
> Một **abelian variety** $A$ định nghĩa trên field $k$ là một projective algebraic variety $A/k$ được trang bị:
>
> - Một phần tử identity $\mathcal{O} \in A(k)$
> - Một morphism $\mu: A \times A \to A$ (phép nhóm)
> - Một morphism $\iota: A \to A$ (phép nghịch đảo)
>
> sao cho $(A(\bar{k}), \mu, \iota, \mathcal{O})$ là một nhóm giao hoán.
>
> **Dimension** của $A$ là dimension của $A$ như một algebraic variety. Ta ký hiệu $\dim A = g$.

Điều kiện "projective" là quan trọng: nó đảm bảo $A$ compact (trong topology Zariski), điều này dẫn đến tính giao hoán tự động qua Rigidity Lemma.

> [!abstract] Lemma 1.2 — Rigidity Lemma
> Nếu $f: A \times B \to C$ là một morphism giữa các varieties trong đó $A$ là projective và connected, và $f$ gửi $A \times \{b_0\}$ và $\{a_0\} \times B$ vào một điểm duy nhất $c_0 \in C$, thì $f$ là constant.

**Proof sketch.** Do $A$ projective và connected, image của $A$ dưới bất kỳ morphism nào vào affine variety là một điểm. Kỹ thuật này áp dụng fiber-by-fiber để kết luận $f$ không phụ thuộc vào biến $A$, suy ra $f$ constant. $\blacksquare$

> [!abstract] Corollary 1.3 — Abelian Variety là Giao Hoán
> Mọi abelian variety đều là nhóm giao hoán.

**Proof.** Xét morphism $f: A \times A \to A$ định nghĩa bởi $f(x, y) = xyx^{-1}y^{-1}$ (commutator). Ta có $f(x, \mathcal{O}) = \mathcal{O}$ và $f(\mathcal{O}, y) = \mathcal{O}$ với mọi $x, y$. Rigidity Lemma cho $f$ constant, tức là $f \equiv \mathcal{O}$, nghĩa là $xy = yx$. $\blacksquare$

---

## Các Ví dụ Cơ Bản

### Elliptic Curve (dimension 1)

Elliptic curve $E/k$ là abelian variety dimension 1. Đây là trường hợp đơn giản nhất và là xuất phát điểm cho mọi construction phức tạp hơn. Group law trên $E$ được mô tả bằng Weierstrass formulas.

### Tích của Abelian Varieties (dimension 2)

Nếu $A_1, A_2$ là các abelian varieties trên $k$, thì tích $A_1 \times A_2$ với phép nhóm component-wise cũng là một abelian variety, có dimension $\dim A_1 + \dim A_2$. Trường hợp quan trọng nhất cho attack là **$E_1 \times E_2$** với $E_1, E_2$ là elliptic curves — đây là abelian surface (dimension 2) dạng **split** (tách được).

### Jacobian của Genus-$g$ Curve (dimension $g$)

Nếu $C$ là smooth projective curve genus $g$ trên $k$, **Jacobian** $J(C) = \text{Jac}(C)$ là abelian variety dimension $g$ được xây dựng từ divisor class group của $C$. Sẽ được xây dựng chi tiết trong [[04-jacobians-genus2|04. Jacobians of Genus-2 Curves]].

Với $g = 1$: $\text{Jac}(C) \cong C$ (elliptic curve là Jacobian của chính nó).  
Với $g = 2$: $\text{Jac}(C)$ là abelian surface — loại đối tượng trung tâm của Castryck-Decru.

---

## Morphisms và Isogenies

> [!note] Định nghĩa 1.4 — Morphism và Isogeny giữa Abelian Varieties
> Một **morphism** $f: A \to B$ giữa hai abelian varieties là một morphism của varieties sao cho $f(\mathcal{O}_A) = \mathcal{O}_B$ (map identity về identity).
>
> Một **isogeny** $\phi: A \to B$ là một morphism surjective với $\ker \phi$ là finite. Nếu tồn tại isogeny $A \to B$ thì ta nói $A$ và $B$ **isogenous**, ký hiệu $A \sim B$.
>
> **Degree** của isogeny $\phi$ là $\deg \phi = |\ker \phi(\bar{k})|$.

Isogeny là tổng quát hóa trực tiếp của isogeny giữa elliptic curves. Mọi tính chất quen thuộc đều giữ nguyên:

> [!abstract] Theorem 1.5 — Dual Isogeny
> Với mỗi isogeny $\phi: A \to B$ degree $n$, tồn tại duy nhất isogeny $\hat{\phi}: B \to A$ (gọi là **dual isogeny**) sao cho:
>
> $$
> \hat{\phi} \circ \phi = [n]_A \qquad \text{và} \qquad \phi \circ \hat{\phi} = [n]_B
> $$

---

## Phép Nhân $[n]$ và Torsion Subgroups

> [!note] Định nghĩa 1.6 — Multiplication-by-$n$ và $n$-Torsion
> Với $n \geq 1$, **phép nhân bởi $n$** là morphism $[n]: A \to A$ định nghĩa bởi $P \mapsto P + P + \cdots + P$ ($n$ lần).
>
> **$n$-torsion subgroup** là $A[n] = \ker([n]) = \{P \in A(\bar{k}) : [n]P = \mathcal{O}\}$.

> [!abstract] Theorem 1.7 — Cấu Trúc của Torsion Subgroup
> Nếu $\text{char}(k) = 0$ hoặc $\gcd(n, \text{char}(k)) = 1$, thì:
>
> $$
> A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
> $$
>
> trong đó $g = \dim A$.

**Proof sketch.** $[n]$ là separable trong trường hợp này, degree của nó là $n^{2g}$ (bằng với số điểm trong kernel). Điều này đòi hỏi tính toán degree của $[n]$ qua theory of line bundles — kết quả là $\deg [n] = n^{2g}$ cho abelian variety dimension $g$. Kết hợp với cấu trúc abelian group và $n$-torsion, ta được isomorphism trên. $\blacksquare$

**Trường hợp đặc biệt**: Với $g = 1$ (elliptic curve): $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ — đây là kết quả quen thuộc.

Với $g = 2$ (abelian surface): $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$.

Điều này quan trọng cho SIDH/Castryck-Decru: khi ta làm việc với **tích $E_1 \times E_2$**, torsion subgroup $(E_1 \times E_2)[n] = E_1[n] \times E_2[n] \cong (\mathbb{Z}/n\mathbb{Z})^4$.

---

## Endomorphism Ring

> [!note] Định nghĩa 1.8 — Endomorphism Ring
> **Endomorphism ring** của $A$ là:
>
> $$
> \text{End}(A) = \{\phi: A \to A \mid \phi \text{ là isogeny hoặc morphism}\}
> $$
>
> với phép cộng $(f + g)(P) = f(P) + g(P)$ và phép nhân $f \circ g$.

Với $g = 1$ trên $\mathbb{F}_{p^2}$ và $E$ supersingular: $\text{End}(E)$ là maximal order trong quaternion algebra $B_{p,\infty}$ ramified tại $p$ và $\infty$.

Với abelian surface $A = E_1 \times E_2$:

$$
\text{End}(E_1 \times E_2) \supseteq \text{End}(E_1) \times \text{End}(E_2)
$$

Nhưng còn có thêm các morphism "chéo" từ $E_1$ sang $E_2$ và ngược lại, nếu chúng isogenous.

---

## Frobenius Endomorphism trên $\mathbb{F}_q$

Với $A$ định nghĩa trên $\mathbb{F}_q$ ($q = p^r$), **Frobenius endomorphism** $\pi_q: A \to A$ là morphism:

$$
\pi_q(x_0 : x_1 : \cdots : x_n) = (x_0^q : x_1^q : \cdots : x_n^q)
$$

Đây là endomorphism cơ bản nhất của $A$, và mọi kết quả về điểm rational đều đi qua $\pi_q$.

> [!abstract] Theorem 1.9 — Weil Conjectures (Abelian Varieties)
> $A(\mathbb{F}_{q^r}) = \ker(\pi_q^r - [1])$. Số điểm $|A(\mathbb{F}_q)|$ được xác định bởi characteristic polynomial của $\pi_q$ tác dụng lên $\ell$-adic Tate module $T_\ell(A)$.

Kết quả này tổng quát hóa Hasse's theorem cho elliptic curves.

---

## Tích $E_1 \times E_2$ — Abelian Surface Quan Trọng Nhất

Trong Castryck-Decru attack, cấu trúc trung tâm là **abelian surface** $A = E_1 \times E_2$. Ta cần biết cách làm việc với nó:

**Points**: $(P_1, P_2)$ với $P_1 \in E_1$, $P_2 \in E_2$.

**Group law**: $(P_1, P_2) + (Q_1, Q_2) = (P_1 + Q_1, P_2 + Q_2)$.

**Identity**: $(\mathcal{O}_1, \mathcal{O}_2)$.

**Torsion**: $(E_1 \times E_2)[n] = E_1[n] \times E_2[n]$.

**Isogenies từ $E_1 \times E_2$**: Ta có thể map $E_1 \times E_2$ sang một abelian surface khác. Câu hỏi cốt lõi của attack là: liệu abelian surface đích có **split** thành tích $E_1' \times E_2'$ không, hay nó là một Jacobian không tách được? Đây là câu hỏi mà Kani's theorem trả lời.

> [!info] Hai Loại Abelian Surface Dimension 2
> Mọi **principally polarized abelian surface** (PPAS) thuộc một trong hai loại:
>
> - **Split**: isomorphic với $E_1 \times E_2$ (tích hai elliptic curves)
> - **Irreducible**: isomorphic với $\text{Jac}(C)$ cho genus-2 curve $C$
>
> Phân biệt hai loại này là trung tâm của Castryck-Decru attack. Sẽ làm rõ trong [[02-polarizations|02. Polarizations]] và [[08-glue-and-split|08. Glue and Split]].

---

## Ứng dụng Crypto

Abelian varieties xuất hiện trong isogeny-based cryptography theo hai cách:

Thứ nhất, SIDH hoạt động trên elliptic curves (abelian varieties dimension 1). Tuy nhiên, attack của Castryck-Decru "nâng" bài toán lên dimension 2 — xây dựng một isogeny $E_1 \times E_2 \to A$ và phân tích cấu trúc của $A$.

Thứ hai, Jacobians của genus-2 curves (abelian surfaces) được dùng trong các scheme như **Genus-2 curve cryptography** và là công cụ tính toán trung tâm trong attack.

---

## Summary

- Abelian variety $A/k$ dimension $g$: projective variety + group morphism, tự động giao hoán (Rigidity Lemma).
- $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ khi $\gcd(n, \text{char}(k)) = 1$.
- Isogeny $\phi: A \to B$: surjective morphism, finite kernel, tồn tại dual $\hat{\phi}$.
- Hai loại abelian surface quan trọng: **split** $E_1 \times E_2$ và **Jacobian** $\text{Jac}(C)$.
- Phân biệt split vs. irreducible là câu hỏi trung tâm của Castryck-Decru.

---

## References

- Milne, J.S. — *Abelian Varieties* (lecture notes, jmilne.org/math), Ch. 1–3
- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Ch. III (cho dimension 1)
- Mumford, D. — *Abelian Varieties*, Tata Institute (định nghĩa đầy đủ, rigorous)
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, IACR ePrint 2017/1198, §2
