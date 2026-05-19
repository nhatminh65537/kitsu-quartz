---
title: "A3. Sketch of Tate's Isogeny Theorem"
type: appendix
tags: [math, abelian-varieties, appendix, tate-theorem, isogeny]
aliases: [Sketch Tate Isogeny Theorem]
created: 2026-05-18
---

> Bài học liên quan: [[42-tates-isogeny-theorem|42. Tate's Isogeny Theorem]]

## Motivation và Tầm Quan Trọng

**Tate's Isogeny Theorem** (đôi khi gọi là **Tate's Theorem** hay **Tate Conjecture cho abelian varieties over finite fields**) là một trong những kết quả sâu sắc nhất trong số học hình học. Nó thiết lập một bijection hoàn toàn giữa:

- **Isogeny classes** của abelian varieties over $\mathbb{F}_q$
- **Galois-equivariant maps** giữa các Tate modules

Phát biểu chính xác:

> Cho $A, B/\mathbb{F}_q$ là abelian varieties và $\ell \neq p = \operatorname{char}(\mathbb{F}_q)$. Thì:
>
> $$
> \operatorname{Hom}_{\mathbb{F}_q}(A, B) \otimes_{\mathbb{Z}} \mathbb{Z}_\ell \xrightarrow{\sim} \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)
> $$
>
> là **isomorphism**, trong đó $G_k = \operatorname{Gal}(\bar{\mathbb{F}}_q / \mathbb{F}_q)$.

Điều này có nghĩa: hai abelian varieties $A, B$ **isogenous** khi và chỉ khi $T_\ell A \cong T_\ell B$ như $G_k$-modules, tức là khi và chỉ khi **characteristic polynomial của Frobenius** trên chúng **trùng nhau**.

---

## Phát Biểu Chính Thức

> [!theorem] Theorem A3.1 — Tate's Isogeny Theorem
> Cho $k = \mathbb{F}_q$ là finite field, $p = \operatorname{char}(k)$, và $A, B/k$ là abelian varieties. Cho $\ell \neq p$ là nguyên tố. Thì natural map:
>
> $$
> \alpha_\ell: \operatorname{Hom}_k(A, B) \otimes_{\mathbb{Z}} \mathbb{Z}_\ell \to \operatorname{Hom}_{G_k}(T_\ell(A), T_\ell(B))
> $$
>
> là **isomorphism** của $\mathbb{Z}_\ell$-modules, trong đó $G_k$ tác động lên $T_\ell(A), T_\ell(B)$ thông qua Galois representation.

**Hệ quả đặc biệt quan trọng:** Lấy $A = B$:

$$
\operatorname{End}_k(A) \otimes \mathbb{Z}_\ell \xrightarrow{\sim} \operatorname{End}_{G_k}(T_\ell(A))
$$

Và taking $\mathbb{Q}_\ell$-tensor:

$$
\operatorname{End}_k(A) \otimes \mathbb{Q}_\ell \xrightarrow{\sim} \operatorname{End}_{G_k}(V_\ell(A))
$$

> [!corollary] Corollary A3.2 — Isogeny ⟺ Isomorphism trên $T_\ell$
> $A$ và $B$ là $k$-isogenous khi và chỉ khi $T_\ell(A) \cong T_\ell(B)$ như $G_k$-modules.

**Proof of corollary từ theorem:**

$(\Rightarrow)$ Nếu $f: A \to B$ là isogeny, thì $T_\ell(f): T_\ell(A) \to T_\ell(B)$ là injective $G_k$-map. Lấy dual isogeny $\hat{f}$: $f \circ \hat{f} = [\deg f]$, nên $T_\ell(\hat{f}) \circ T_\ell(f) = \deg f \cdot \operatorname{id}$. Vì $\ell \neq \deg f$ (có thể chọn), $T_\ell(f)$ là isomorphism sau tensor với $\mathbb{Q}_\ell$.

$(\Leftarrow)$ Nếu $T_\ell(A) \cong T_\ell(B)$ như $G_k$-modules, thì tồn tại $\phi \in \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$ là isomorphism. Theo Tate's Theorem, tồn tại $f \in \operatorname{Hom}_k(A, B) \otimes \mathbb{Z}_\ell$ map sang $\phi$. Sau đó ta cần... (xem bên dưới). $\square$

---

## Bố Cục Chứng Minh

Tate chứng minh định lý này vào năm 1966 (đăng trong *Inventiones Mathematicae*). Proof có hai phần chính:

### Phần A: Injectivity của $\alpha_\ell$

> [!theorem] Theorem A3.3 — Injectivity (dễ hơn)
> Map $\alpha_\ell$ là injective.

**Proof.**

Đây là phần dễ và hoàn toàn tổng quát (đúng over mọi field, không chỉ finite field).

Giả sử $\sum_i f_i \otimes c_i \in \operatorname{Hom}_k(A, B) \otimes \mathbb{Z}_\ell$ bị gửi về $0$ trong $\operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$. Ta cần chứng minh $\sum_i f_i \otimes c_i = 0$.

Đặt $M = \operatorname{Hom}_k(A, B)$, ta biết $M$ là **free $\mathbb{Z}$-module hữu hạn rank** (vì Hom là finitely generated torsion-free abelian group). Nên $M \otimes \mathbb{Z}_\ell \hookrightarrow M \otimes \mathbb{Q}_\ell$.

Giả sử $\Phi = \sum_i c_i f_i \in \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$ bằng $0$. Thì $\Phi$ tác động là $0$ trên tất cả $A[\ell^n]$. Tức là với mọi $P \in A[\ell^\infty](\bar{k})$, $\Phi(P) = 0$. 

Nhưng $A[\ell^\infty](\bar{k})$ dense trong $A$ (theo topology $\ell$-adic). Hơn nữa, $\sum c_i f_i: A \to B$ là morphism vanish trên dense set ⟹ $\sum c_i f_i = 0$ như morphism. Vì $M \otimes \mathbb{Z}_\ell$ embeds vào $\operatorname{End}(A)$ torsion-freely, ta được $\sum c_i f_i = 0$ trong $M \otimes \mathbb{Z}_\ell$. $\blacksquare$

---

### Phần B: Surjectivity của $\alpha_\ell$ (phần khó)

> [!theorem] Theorem A3.4 — Surjectivity over Finite Fields
> Over $k = \mathbb{F}_q$, map $\alpha_\ell$ là surjective.

**Proof sketch.**

Đây là phần cần tính chất đặc biệt của finite fields. Không đúng over number fields hoặc over $\mathbb{C}$ mà không có thêm điều kiện.

**Chiến lược của Tate:**

Tate dùng **Finiteness Theorem** làm key input:

> **Finiteness Theorem:** Over $\mathbb{F}_q$, với mọi $g \geq 1$, có **hữu hạn** isogeny classes của abelian varieties of dimension $g$.

Đây không phải là điều hiển nhiên! Chứng minh dựa vào:
1. Weil's theorem: $|A(\mathbb{F}_{q^n})| = \prod_i (1 - \alpha_i^n)$ với $|\alpha_i| = \sqrt{q}$ (Riemann Hypothesis).
2. Số lượng Weil $q$-numbers có bound hữu hạn cho $g$ và $q$ cố định.
3. Hữu hạn Weil $q$-numbers ⟹ hữu hạn isogeny classes.

**Bước 1: Reduction sang group subschemes.**

Để chứng minh surjectivity, cho $\phi \in \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$. Ta muốn nâng $\phi$ lên thành morphism $f: A \to B$ of abelian varieties.

Định nghĩa $\Lambda_n = \phi^{-1}(T_\ell B)$ — đây là $G_k$-stable sublattice trong $T_\ell A$ (đối với mỗi $n$, lấy image finite-level).

**Bước 2: Xây dựng isogenies từ sublattices.**

Với mỗi $n$, xét sublattice $\Lambda_n \subseteq T_\ell A \otimes \mathbb{Z}/\ell^n = A[\ell^n]$. Đây là $G_k$-stable finite subgroup scheme của $A[\ell^n]$. Lấy quotient:

$$
A_n = A / \Lambda_n
$$

Đây là abelian variety isogenous to $A$, và isogeny $\pi_n: A \to A_n$ có kernel $\Lambda_n$.

**Bước 3: $A_n$ form an inverse system.**

Các $A_n$ và isogenies giữa chúng tạo thành inverse system. Theo Finiteness Theorem, có **hữu hạn** isogeny classes, nên có subsequence $A_{n_i}$ isomorphic nhau (infinitely many). Lấy limit và dùng "pro-finite" argument...

**Bước 4: Dùng Finiteness to conclude.**

Cụ thể: ta muốn chứng minh rằng tồn tại isogeny $f: A \to B$ với $T_\ell(f) = \phi$.

Key step: Ta đã có, với mỗi $n$, một abelian variety $C_n$ và isogenies:
- $\pi_n: A \to C_n$ (from $\Lambda_n$)
- $\psi_n: C_n \to B$ (vì $\phi: T_\ell A \to T_\ell B$)

thỏa $\psi_n \circ \pi_n = [\ell^n] \cdot f_n$ với $f_n \in \operatorname{Hom}(A, B)$.

Vì $\operatorname{Hom}(A, B)$ là finitely generated $\mathbb{Z}$-module, và có "infinitely many" $f_n$ này nhưng sau khi chuẩn hóa chúng phải nằm trong bounded set (theo Weil height argument hoặc finiteness), tồn tại $f \in \operatorname{Hom}(A, B)$ là limit của subsequence. Thì $T_\ell(f) = \phi$. $\square$

---

## Hệ Quả Trực Tiếp: Frobenius Xác Định Isogeny Class

> [!corollary] Corollary A3.5 — Char. Poly. của Frobenius Xác Định Isogeny Class
> Hai abelian varieties $A, B / \mathbb{F}_q$ isogenous khi và chỉ khi chúng có cùng **characteristic polynomial** của Frobenius endomorphism $\pi_A, \pi_B$.

**Proof.**

$A \sim B$ (isogenous) $\iff$ $T_\ell A \cong T_\ell B$ như $G_k$-modules (theo Corollary A3.2)

$\iff$ Frobenius $\pi$ tác động với cùng char. polynomial trên cả hai (vì $G_k = \hat{\mathbb{Z}}$ được generate bởi Frobenius $\operatorname{Frob}_q$).

$\iff$ $P_{A}(t) = P_{B}(t)$ (các polynomial đặc trưng của Frobenius). $\blacksquare$

---

## Ý Nghĩa: Tại Sao Frobenius Đủ?

$G_k = \operatorname{Gal}(\bar{\mathbb{F}}_q / \mathbb{F}_q) \cong \hat{\mathbb{Z}}$, được **generate bởi một phần tử duy nhất**: Frobenius $\operatorname{Frob}_q$ (hoặc $\pi_q$).

Một $G_k$-module $M$ (finite rank free $\mathbb{Z}_\ell$-module) được xác định **hoàn toàn** bởi action của generator duy nhất $\operatorname{Frob}_q$. Tức là bởi **một ma trận** $F \in \operatorname{GL}_{2g}(\mathbb{Z}_\ell)$, hay chính xác hơn, bởi **characteristic polynomial** $\det(tI - F) \in \mathbb{Z}[t]$.

Đây là điểm khác biệt căn bản so với number fields (ở đó $G_k$ là phức tạp hơn nhiều và có nhiều hơn một generator).

> [!note] Remark A3.6 — So sánh với Number Fields
> Over number field $K$:
> - Tate's theorem **vẫn đúng** (đây là **Faltings' Theorem**, hay *Mordell Conjecture approach*, 1983).
> - Nhưng chứng minh khó hơn nhiều: Faltings dùng **height functions** và machinery phức tạp.
> - Frobenius không đủ để xác định $G_K$-module; cần toàn bộ Galois representation.

---

## Chứng minh Finiteness Theorem (Sketch)

Đây là key input của Tate's proof:

> [!theorem] Theorem A3.7 — Finiteness over Finite Fields
> Over $\mathbb{F}_q$, có hữu hạn isomorphism classes của abelian varieties of dimension $g$ having a polarization of degree $d$.

**Proof sketch.**

**Bước 1:** Mọi abelian variety có polarization (vì over $\bar{\mathbb{F}}_q$, mọi complete group variety đều projective, và projection cho polarization).

**Bước 2:** Bounded polarization degree ⟹ bounded Weil numbers. Cụ thể: nếu $\deg(\lambda) = d$, thì characteristic polynomial $P_A(t) \in \mathbb{Z}[t]$ thỏa $P_A(0) = \pm q^g$ và các hệ số bị bound bởi $q^g$ theo Weil estimates.

**Bước 3:** Hữu hạn Weil $q$-numbers ⟹ hữu hạn possibilities cho $P_A(t) \in \mathbb{Z}[t]$ degree $2g$.

**Bước 4:** Mỗi isogeny class có hữu hạn polarized isomorphism classes: đây là phần non-trivial, dùng các moduli space techniques. $\square$

---

## Tate's Theorem và Tate Conjecture

Tate's Isogeny Theorem là trường hợp đặc biệt của **Tate Conjecture** (nay là Theorem trong nhiều trường hợp):

> **Tate Conjecture (divisors):** Cho $X$ smooth projective variety over finitely generated field $k$, map $\operatorname{NS}(X) \otimes \mathbb{Q}_\ell \to H^2(X_{\bar{k}}, \mathbb{Q}_\ell(1))^{G_k}$ là isomorphism.

Với abelian varieties, đây tương đương với Tate's Isogeny Theorem (vì $\operatorname{NS}(A) \cong \operatorname{Hom}(A, \hat{A})$ và $H^2$ liên quan đến $T_\ell \otimes T_\ell$).

Kết quả đã được chứng minh:
- Over $\mathbb{F}_q$: **Tate 1966** (abelian varieties).
- Over function fields of char $p$: **Zarhin 1975**.
- Over number fields: **Faltings 1983** (chứng minh Mordell conjecture như corollary).

---

## Summary

- Tate's Isogeny Theorem: $\operatorname{Hom}(A, B) \otimes \mathbb{Z}_\ell \cong \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$ over $\mathbb{F}_q$.
- Injectivity: tổng quát, dùng density argument.
- Surjectivity: đặc biệt cho finite fields, dùng Finiteness Theorem (có hữu hạn isogeny classes).
- Hệ quả: isogeny class ⟺ char. poly. của Frobenius ⟺ Weil $q$-numbers.
- Tầm quan trọng: là nền tảng của Honda-Tate theory; generalize thành Faltings' theorem over number fields.

---

## References

- Tate, J. *Endomorphisms of abelian varieties over finite fields*. Inventiones Mathematicae, 2, 1966, pp. 134–144.
- Milne, J.S. *Abelian Varieties* (Course Notes). §17 (Tate's Theorem). https://www.jmilne.org/math/CourseNotes/AV.pdf
- Milne, J.S. *The Tate Conjecture over Finite Fields (AIM Talk)*. https://www.jmilne.org/math/xnotes/TateAim.pdf
- Oort, F. *Abelian Varieties over Finite Fields*. NYU notes. https://math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Dembélé, L. *Abelian Varieties over Finite Fields: Honda–Tate's Theorem*. AWS 2024. §5.7–5.8. https://swc-math.github.io/aws/2024/PAWSDembele/2023PAWSDembeleNotes.pdf
- Best, A.J. *BUNTES Notes: Tate's Isogeny Theorem*. https://alexjbest.github.io/buntes/sec-tate-thm.html
- Zarhin, Y.G. *Homomorphisms of abelian varieties over finite fields*. arXiv:0711.1615.
