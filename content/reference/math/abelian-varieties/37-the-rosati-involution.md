---
title: "37. The Rosati Involution"
type: theory
tags: [math, abelian-varieties, lesson-37, rosati-involution, endomorphism-algebra]
aliases: [The Rosati Involution]
created: 2026-05-19
---

> **Prerequisites**: [[35-polarizations|35. Polarizations]], [[21-endomorphisms-on-tate-module|21. Endomorphisms on the Tate Module]], [[34-symmetric-isogenies|34. Symmetric Isogenies A → Â]]
> **Objectives**:
> - Xây dựng **Rosati involution** $f \mapsto f^\dagger$ trên $\operatorname{End}^0(A)$ từ một polarization $\phi$
> - Chứng minh $f^\dagger$ là anti-automorphism và involution (tức $(fg)^\dagger = g^\dagger f^\dagger$ và $(f^\dagger)^\dagger = f$)
> - Chứng minh **positivity**: $\operatorname{Tr}(f f^\dagger) > 0$ với $f \neq 0$
> - Hiểu hệ quả: $\operatorname{End}^0(A)$ semisimple và ý nghĩa của Albert classification
> - Phân tích các endomorphisms **fixed** bởi Rosati involution: liên hệ với Néron-Severi group

---

## Motivation / Intuition

Khi làm việc với abelian variety $A$, ring endomorphisms $\operatorname{End}(A)$ là một trong những bất biến quan trọng nhất. Về mặt $\mathbb{Z}$-module, $\operatorname{End}(A)$ là free abelian group hữu hạn hạng. Nhưng với đặc tính module, $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes_\mathbb{Z} \mathbb{Q}$ là một $\mathbb{Q}$-algebra — và câu hỏi là: algebra này có cấu trúc gì?

Câu trả lời cơ bản nhất đến từ một **involution** trên $\operatorname{End}^0(A)$ được tạo ra bởi một polarization $\phi: A \to \widehat{A}$. Involution này — gọi là **Rosati involution** (đặt theo tên nhà toán học Carlo Rosati, 1876–1929) — có tính chất **dương** (positive): $\operatorname{Tr}(f f^\dagger) > 0$ với $f \neq 0$. Điều này nghe có vẻ kỹ thuật, nhưng nó có hệ quả cơ bản: $\operatorname{End}^0(A)$ là **semisimple** (có thể phân tích thành product của simple algebras), và **Albert classification** phân loại hoàn toàn các algebras với involution dương — chỉ có 4 loại có thể xảy ra (được gọi là Albert algebras).

Hãy nhớ analogy với đại số tuyến tính: nếu $V$ là không gian vector với inner product $\langle \cdot, \cdot \rangle$, mỗi linear map $f: V \to V$ có **adjoint** $f^*$ thỏa $\langle f(v), w \rangle = \langle v, f^*(w) \rangle$. Map $f \mapsto f^*$ là involution trên $\operatorname{End}(V)$. Rosati involution chính xác là analog của adjoint trong context của abelian varieties.

---

## Định Nghĩa Rosati Involution

### Definition

> [!definition] Definition 37.1 — Rosati Involution
> Cho $(A, \phi)$ là polarized abelian variety ($\phi: A \to \widehat{A}$ là polarization). Vì $\phi$ là isogeny, nó invertible trong $\operatorname{Hom}^0(A, \widehat{A}) = \operatorname{Hom}(A, \widehat{A}) \otimes \mathbb{Q}$ (nghĩa là $\phi^{-1}$ tồn tại như phần tử của $\operatorname{Hom}^0(\widehat{A}, A)$).
>
> **Rosati involution** tương ứng với $\phi$ là map:
>
> $$
> \dagger \;=\; \dagger_\phi: \operatorname{End}^0(A) \to \operatorname{End}^0(A)
> $$
>
> được định nghĩa bởi:
>
> $$
> f^\dagger = \phi^{-1} \circ \widehat{f} \circ \phi,
> $$
>
> trong đó $\widehat{f}: \widehat{A} \to \widehat{A}$ là dual morphism của $f$ (definition 34.1 áp dụng với $f: A \to A$).

> [!note] Remark 37.2 — Tại Sao $\phi^{-1}$ Tồn Tại
> Vì $\phi$ là isogeny (không phải isomorphism nói chung), $\phi^{-1}$ **không** tồn tại như morphism $\widehat{A} \to A$ trong category abelian varieties. Tuy nhiên, nếu $\phi$ là polarization với degree $d$, thì tồn tại isogeny $\psi: \widehat{A} \to A$ sao cho $\psi \circ \phi = [d]_A$ (dual isogeny). Khi đó $\phi^{-1} = \frac{1}{d} \psi \in \operatorname{Hom}^0(\widehat{A}, A)$.
>
> Cụ thể, khi $\phi$ là **principal polarization** (isomorphism), $\phi^{-1}$ tồn tại thực sự và mọi thứ là đơn giản.

---

## Tính Chất Đại Số Của Rosati Involution

### Theorem

> [!theorem] Theorem 37.3 — Rosati Involution Là Involution Chống Nhân
> Rosati involution $f \mapsto f^\dagger$ thỏa các tính chất sau:
>
> **(a) Additive:** $(f + g)^\dagger = f^\dagger + g^\dagger$.
>
> **(b) Anti-multiplicative:** $(f \circ g)^\dagger = g^\dagger \circ f^\dagger$.
>
> **(c) Involution:** $(f^\dagger)^\dagger = f$.
>
> **(d) Scalar:** $(n \cdot f)^\dagger = n \cdot f^\dagger$ với $n \in \mathbb{Q}$.
>
> Nói cách khác, $f \mapsto f^\dagger$ là một **$\mathbb{Q}$-algebra anti-automorphism** của bậc 2 của $\operatorname{End}^0(A)$.

**Proof.**

**(a)** Tính additive của $\widehat{\cdot}$: $\widehat{f+g} = \widehat{f} + \widehat{g}$ (vì pullback phân phối qua tensor product). Do đó:

$$
(f+g)^\dagger = \phi^{-1} \circ \widehat{(f+g)} \circ \phi = \phi^{-1} \circ (\widehat{f} + \widehat{g}) \circ \phi = f^\dagger + g^\dagger.
$$

**(b)** Tính anti-multiplicative của $\widehat{\cdot}$: $\widehat{f \circ g} = \widehat{g} \circ \widehat{f}$ (Theorem 34.2(a)). Do đó:

$$
(f \circ g)^\dagger = \phi^{-1} \circ \widehat{f \circ g} \circ \phi = \phi^{-1} \circ \widehat{g} \circ \widehat{f} \circ \phi.
$$

Ta cần biến đổi thành $g^\dagger \circ f^\dagger$:

$$
g^\dagger \circ f^\dagger = (\phi^{-1} \circ \widehat{g} \circ \phi) \circ (\phi^{-1} \circ \widehat{f} \circ \phi) = \phi^{-1} \circ \widehat{g} \circ (\phi \circ \phi^{-1}) \circ \widehat{f} \circ \phi = \phi^{-1} \circ \widehat{g} \circ \widehat{f} \circ \phi.
$$

(Dùng $\phi \circ \phi^{-1} = \operatorname{id}$.) Vậy $(f \circ g)^\dagger = g^\dagger \circ f^\dagger$. $\square$

**(c)** Dùng symmetry của $\phi$ ($\phi = \widehat{\phi} \circ \operatorname{can}_A$):

$$
(f^\dagger)^\dagger = \phi^{-1} \circ \widehat{(f^\dagger)} \circ \phi = \phi^{-1} \circ \widehat{(\phi^{-1} \circ \widehat{f} \circ \phi)} \circ \phi.
$$

Dùng anti-multiplicativity của $\widehat{\cdot}$: $\widehat{(\phi^{-1} \circ \widehat{f} \circ \phi)} = \widehat{\phi} \circ \widehat{\widehat{f}} \circ \widehat{(\phi^{-1})}$.

Vì $\widehat{\widehat{f}} = f$ (double dual — qua canonical identification của $A$ với $\widehat{\widehat{A}}$) và $\widehat{(\phi^{-1})} = (\widehat{\phi})^{-1}$:

$$
(f^\dagger)^\dagger = \phi^{-1} \circ \widehat{\phi} \circ f \circ (\widehat{\phi})^{-1} \circ \phi.
$$

Dùng symmetry: $\widehat{\phi} = \phi \circ \operatorname{can}_A^{-1}$ (qua identification), và cẩn thận xử lý identification, ta thu được $(f^\dagger)^\dagger = f$. Xem [Mumford, §20] hoặc [Conrad] cho chi tiết đầy đủ. $\blacksquare$

### Worked Example

> [!example] Example 37.4 — Rosati Involution Trên Elliptic Curve
> Cho $E$ là elliptic curve với principal polarization $\phi: E \xrightarrow{\sim} \widehat{E}$.
>
> **(a) Frobenius:** Trên $E / \mathbb{F}_q$, Frobenius endomorphism $\pi_E: E \to E$ có:
>
> $$
> \pi_E^\dagger = \phi^{-1} \circ \widehat{\pi_E} \circ \phi = \phi^{-1} \circ \widehat{\pi_E} \circ \phi.
> $$
>
> Bằng lý thuyết của dual isogeny: $\widehat{\pi_E} = V_E$ (Verschiebung). Do đó $\pi_E^\dagger = \phi^{-1} \circ V_E \circ \phi$.
>
> Vì trên elliptic curve $\pi_E \circ V_E = [q]$ (và $V_E$ là "dual" của $\pi_E$), điều này cho:
>
> $$
> \pi_E \circ \pi_E^\dagger = [q] \in \operatorname{End}(E),
> $$
>
> nghĩa là $\pi_E^\dagger = [q] \circ \pi_E^{-1}$ (trong $\operatorname{End}^0(E)$). Hơn nữa, điều này liên quan tới Weil's theorem: các conjugates phức của $\alpha$ (eigenvalue của $\pi_E$) thỏa $|\alpha|^2 = q$.
>
> **(b) Multiplication-by-$n$:** $[n]^\dagger = \phi^{-1} \circ \widehat{[n]} \circ \phi = \phi^{-1} \circ [n] \circ \phi = [n]$. Vậy $[n]^\dagger = [n]$ — $[n]$ là **symmetric** (self-adjoint) dưới Rosati involution.

### Note

> [!note] Remark 37.5 — Rosati Involution Phụ Thuộc Vào $\phi$
> Quan trọng: Rosati involution $\dagger_\phi$ **phụ thuộc vào polarization $\phi$**. Hai polarizations khác nhau $\phi_1, \phi_2$ có thể cho Rosati involutions khác nhau.
>
> Tuy nhiên, có một điều bất biến: **kiểu** (type) của involution — khi $A$ simple, $(\operatorname{End}^0(A), \dagger_\phi)$ thuộc một trong 4 loại Albert (xem bên dưới) và loại này không phụ thuộc vào chọn $\phi$.

---

## Tính Adjoint Của Rosati Involution

Rosati involution không chỉ là involution đại số — nó còn là **adjoint** theo nghĩa của Weil pairing.

### Theorem

> [!theorem] Theorem 37.6 — Rosati Involution Là Adjoint Của Weil Pairing
> Với mọi $f \in \operatorname{End}(A)$ và $P, Q \in A[n]$ (với $\gcd(n, \operatorname{char}(k)) = 1$):
>
> $$
> e_\phi^n(f(P), Q) = e_\phi^n(P, f^\dagger(Q)).
> $$
>
> Nghĩa là $f^\dagger$ là **adjoint của $f$** với respect to symplectic pairing $e_\phi^n$.

**Proof.**
Tính trực tiếp:

$$
e_\phi^n(f(P), Q) = e_n(f(P), \phi(Q)).
$$

Dùng tính functorial của $e_n$ (bài 31): $e_n(f(P), \xi) = e_n(P, \widehat{f}(\xi))$ với $\xi \in \widehat{A}[n]$:

$$
e_n(f(P), \phi(Q)) = e_n(P, \widehat{f}(\phi(Q))).
$$

Bây giờ, $\widehat{f}(\phi(Q)) = \phi(f^\dagger(Q))$ vì:

$$
\widehat{f} \circ \phi = \phi \circ f^\dagger
$$

(đây là cách viết lại định nghĩa $f^\dagger = \phi^{-1} \circ \widehat{f} \circ \phi$). Do đó:

$$
e_n(P, \widehat{f}(\phi(Q))) = e_n(P, \phi(f^\dagger(Q))) = e_\phi^n(P, f^\dagger(Q)).
$$

$\blacksquare$

> [!note] Remark 37.7 — Ý Nghĩa Vật Lý Và Toán Học
> Định lý này nói: nếu bạn nhìn $(A[n] \otimes \mathbb{Q}, e_\phi^n)$ như một symplectic space, thì mỗi endomorphism $f$ có adjoint $f^\dagger$ trong symplectic sense. Đây là analog của self-adjoint operators trong Hilbert spaces — đây chính là ý tưởng của cơ học lượng tử!
>
> Hệ quả quan trọng: **endomorphisms symmetric under Rosati** ($f^\dagger = f$) là analog của **self-adjoint operators** (Hermitian operators) trong toán học phổ phân tích. Chúng có eigenvalues "real" (trong nghĩa phù hợp).

---

## Positivity Của Rosati Involution

Đây là tính chất sâu nhất và quan trọng nhất của Rosati involution.

### Definition

> [!definition] Definition 37.8 — Trace Của Endomorphism
> Với $f \in \operatorname{End}^0(A)$, **trace** của $f$ là:
>
> $$
> \operatorname{Tr}(f) \in \mathbb{Q},
> $$
>
> được định nghĩa là trace của $f$ tác động lên $V_\ell(A) = T_\ell(A) \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell$ (chia cho 2 — hay bằng sum of roots of characteristic polynomial). Cụ thể, nếu $P_f(t) \in \mathbb{Q}[t]$ là characteristic polynomial của $f$ (bài 22), thì:
>
> $$
> \operatorname{Tr}(f) = -[t^{2g-1}]\text{ coefficient of } P_f(t) \quad (\text{theo convention}).
> $$

### Theorem

> [!theorem] Theorem 37.9 — Positivity Của Rosati Involution
> Cho $(A, \phi)$ là polarized abelian variety. Với mọi $f \in \operatorname{End}^0(A)$, $f \neq 0$:
>
> $$
> \operatorname{Tr}(f \circ f^\dagger) > 0.
> $$
>
> Nghĩa là Rosati involution là **positive involution** (involution dương) trên $\operatorname{End}^0(A)$.

**Proof sketch.**
Đây là kết quả sâu. Phác thảo chứng minh:

Bước 1: Giả sử $k$ algebraically closed và $\phi = \phi_L$ với $L$ ample, $L = \mathcal{O}(D)$ cho divisor $D$ trên $A$.

Bước 2: Dùng công thức intersection theory (Mumford §21):

$$
\operatorname{Tr}(f \circ f^\dagger) = 2g \cdot \frac{(D^{g-1} \cdot f^* D)}{D^g}.
$$

Bước 3: Vì $L$ ample, $D^g > 0$ (Euler characteristic). Vì $f^* D$ là pullback của ample divisor, $D^{g-1} \cdot f^*D \geq 0$ theo Hodge Index Theorem. Thực ra nếu $f \neq 0$ thì $f^*D$ không zero và $D^{g-1} \cdot f^*D > 0$.

Do đó $\operatorname{Tr}(f \circ f^\dagger) > 0$. $\blacksquare$

> [!note] Remark 37.10 — Hệ Quả: $\operatorname{End}^0(A)$ Semisimple
> Một định lý đại số thuần túy: một $\mathbb{Q}$-algebra hữu chiều với một **positive involution** (involution thỏa $\operatorname{Tr}(x \cdot x^\dagger) > 0$ với $x \neq 0$) là **semisimple**. Tức là $\operatorname{End}^0(A) \cong D_1 \times \cdots \times D_r$ với mỗi $D_i$ là simple $\mathbb{Q}$-algebra (division algebra hoặc matrix ring). Đây là **kết quả cơ bản** về endomorphism algebra của abelian variety.

---

## Endomorphisms Cố Định Bởi Rosati và Néron-Severi Group

### Theorem

> [!theorem] Theorem 37.11 — Fixed Points Của Rosati = Néron-Severi Group
> Xác định map:
>
> $$
> \Phi: \operatorname{NS}(A) \otimes \mathbb{Q} \to \operatorname{End}^0(A), \quad [M] \mapsto \Phi_M = \phi^{-1} \circ \phi_M,
> $$
>
> trong đó $\phi_M: A \to \widehat{A}$ là map tương ứng với line bundle $M$. Khi đó:
>
> **(a)** $\Phi$ là injection $\mathbb{Q}$-linear (khi $A$ projective).
>
> **(b)** Image của $\Phi$ là chính xác các **symmetric elements** dưới Rosati:
>
> $$
> \operatorname{Im}(\Phi) = \left\{ f \in \operatorname{End}^0(A) \mid f^\dagger = f \right\}.
> $$

**Proof sketch.**
$\Phi_M^\dagger = (\phi^{-1} \circ \phi_M)^\dagger = \phi_M^\dagger \circ (\phi^{-1})^\dagger$. Vì $\phi_M$ và $\phi$ đều symmetric ($\phi_M = \phi_M^\dagger$ theo bài 34), ta tính được $\Phi_M^\dagger = \Phi_M$. Ngược lại, nếu $f^\dagger = f$ thì $f = \Phi_M$ cho một $M \in \operatorname{NS}(A) \otimes \mathbb{Q}$. $\blacksquare$

### Note

> [!note] Remark 37.12 — Ý Nghĩa
> Kết quả này nói: **Néron-Severi group (tensor Q) là đúng bằng tập các endomorphisms symmetric dưới Rosati**. Điều này là một cầu nối đẹp giữa hình học (line bundles, divisors) và đại số (endomorphisms, involutions).
>
> Thêm vào đó, $\operatorname{NS}(A) \otimes \mathbb{Q}$ với phép toán:
>
> $$
> [M] \star [N] = \frac{1}{2} \Phi^{-1}(\Phi_M \circ \Phi_N + \Phi_N \circ \Phi_M)
> $$
>
> tạo thành một **formally real Jordan algebra** — một cấu trúc đại số xuất hiện trong vật lý lý thuyết (quantum mechanics).

---

## Albert Classification (Tóm Lược)

Hệ quả của positivity: mọi abelian variety simple phải có endomorphism algebra thuộc một trong 4 loại.

### Theorem

> [!theorem] Theorem 37.13 — Albert Classification (Phân Loại Albert)
> Cho $A$ là **simple** abelian variety chiều $g$ over algebraically closed field. Đặt $D = \operatorname{End}^0(A)$ với Rosati involution $\dagger$. Thì $(D, \dagger)$ thuộc đúng một trong 4 loại:
>
> | Type | $D$ | Involution | Đặc tính | Ghi chú |
> |------|-----|-----------|----------|---------|
> | I | Totally real field $F$, $[F:\mathbb{Q}] = e$ | trivial ($f^\dagger = f$) | $\operatorname{char} = 0$ hoặc $p$ | $e \mid g$ |
> | II | Quaternion algebra over totally real $F$ | $\dagger$ of first kind | $\operatorname{char} = 0$ | $2e \mid g$ |
> | III | Quaternion algebra over totally real $F$ | $\dagger$ of first kind (standard conj.) | $\operatorname{char} = 0$ | $2e \mid g$ |
> | IV | Central simple algebra over CM field $K$ | $\dagger$ of second kind | $\operatorname{char} = 0$ hoặc $p$ | $e^2 \mid g$ |
>
> Trong đó $e = [F:\mathbb{Q}]$ và $K$ là CM field (totally imaginary quadratic extension of totally real field).

> [!note] Remark 37.14 — Ứng Dụng Của Albert Classification
> Albert classification có ứng dụng trong:
>
> - **Shimura varieties**: Moduli spaces của polarized abelian varieties với extra structure — mỗi type Albert cho một loại Shimura variety khác nhau.
> - **$\ell$-adic representations**: Hình dạng của $D = \operatorname{End}^0(A)$ ảnh hưởng đến $\ell$-adic Galois representation của $A$.
> - **Abelian varieties over finite fields**: Trên $\mathbb{F}_q$, Albert classification kết hợp với Honda-Tate cho phép phân loại hoàn toàn isogeny classes.
> - **CM abelian varieties**: Abelian variety với CM (complex multiplication) tương ứng với Albert type IV khi $D$ là field.

### Worked Example

> [!example] Example 37.15 — Elliptic Curves: Albert Types I Và IV
> Cho $E$ là elliptic curve (abelian variety chiều 1).
>
> - **Type I**: $\operatorname{End}^0(E) = \mathbb{Q}$. Đây là trường hợp "generic" — $E$ không có CM.
>
> - **Type IV (CM case)**: Nếu $E$ có complex multiplication bởi imaginary quadratic field $K = \mathbb{Q}(\sqrt{-d})$, thì $\operatorname{End}^0(E) = K$. Involution Rosati là complex conjugation trên $K$. Điều này tương ứng với Albert type IV với $e = 1$.
>
> **Ví dụ cụ thể:** $E: y^2 = x^3 - x$ over $\mathbb{Q}$. Endomorphism $(x,y) \mapsto (-x, iy)$ (với $i^2 = -1$) là multiplication-by-$i$ — CM bởi $\mathbb{Z}[i]$. Vậy $\operatorname{End}^0(E) = \mathbb{Q}(i)$, Albert type IV.

---

## Frobenius Và Rosati Involution Trên $\mathbb{F}_q$

Một ứng dụng quan trọng của positivity trong lý thuyết số:

### Theorem

> [!theorem] Theorem 37.16 — Frobenius Là Weil Number (Via Positivity)
> Cho $A$ là abelian variety over $\mathbb{F}_q$ và $\pi_A \in \operatorname{End}(A)$ là Frobenius endomorphism. Với polarization $\phi$ trên $A$:
>
> $$
> \pi_A \circ \pi_A^\dagger = [q] \in \operatorname{End}(A).
> $$
>
> Điều này tương đương với: mọi **eigenvalue** $\alpha$ của $\pi_A$ (tác động lên $V_\ell(A)$) thỏa $|\alpha|^2 = q$ (theo mọi embedding $\mathbb{Q}(\alpha) \hookrightarrow \mathbb{C}$). Đây chính là định nghĩa của **Weil $q$-number**.

**Proof sketch.**
Frobenius $\pi_A$ là isogeny của degree $q$ trên $\mathbb{F}_q$. Dual của $\pi_A$ là Verschiebung $V_A$, thỏa $\pi_A \circ V_A = [q]$. Đồng thời, Rosati involution của $\pi_A$ là $\pi_A^\dagger = \phi^{-1} \circ V_A \circ \phi = V_A$ (vì $\phi$ commutes với $V_A$ theo một nghĩa phù hợp — dùng tính chất của polarization trên $\mathbb{F}_q$). Do đó $\pi_A \circ \pi_A^\dagger = [q]$.

Hệ quả từ positivity: $\operatorname{Tr}(\pi_A \circ \pi_A^\dagger) = \operatorname{Tr}([q]) = 2g \cdot q > 0$ ✓. $\blacksquare$

> [!note] Remark 37.17 — Kết Nối Với Module 7
> Đây là một trong những kết quả nền tảng chuẩn bị cho Module 7 (Abelian Varieties over $\mathbb{F}_q$). Thực tế, **Weil $q$-numbers** (bài 40) được định nghĩa chính xác bởi điều kiện $|\alpha| = \sqrt{q}$ cho mọi embedding — và điều này được chứng minh từ positivity của Rosati involution.

---

## SageMath Cheatsheet

```sage
# Endomorphisms and Rosati involution on elliptic curve
p = 1009
# CM curve: y^2 = x^3 - x has CM by Z[i]
E = EllipticCurve(GF(p), [-1, 0])

# Frobenius: [p] - t*[1] + [1] where t = trace of Frobenius
t = E.trace_of_frobenius()
print(f"Trace of Frobenius t = {t}")
print(f"Char poly of pi_E: x^2 - {t}*x + {p}")

# Verify |eigenvalue|^2 = p (Weil condition)
import cmath
disc = t**2 - 4*p
if disc < 0:
    alpha = complex(t/2, cmath.sqrt(-disc)/2)
    print(f"Eigenvalue alpha = {alpha}")
    print(f"|alpha|^2 = {abs(alpha)**2} (should be {p})")
else:
    print(f"Supersingular? disc = {disc}")

# Rosati involution: pi_E^dagger = [q] / pi_E in End^0
# For EC: pi_E * pi_E^dagger = [p]
# pi_E^dagger is Verschiebung
print(f"pi * V = [p]: check t^2 - t*t + p = {p - t*t + t**2 - p}")

# For CM curve: End^0(E) = Q(i)
# [i]: E -> E given by (x,y) -> (-x, i*y)
# Check if -1 is a QR mod p (so that i exists in F_p)
print(f"p mod 4 = {p % 4}")  # CM by Z[i] works over F_p if -1 is QR
print(f"End^0(E) has CM: {(-1) % p in [x^2 % p for x in range(p)]}")
```

---

## Summary / Key Takeaways

- **Rosati involution** $f^\dagger = \phi^{-1} \circ \widehat{f} \circ \phi$ là $\mathbb{Q}$-algebra anti-automorphism bậc 2 của $\operatorname{End}^0(A)$, defined từ polarization $\phi$.
- **Adjoint property:** $e_\phi^n(f(P), Q) = e_\phi^n(P, f^\dagger(Q))$ — Rosati là adjoint của $f$ theo symplectic form.
- **Positivity:** $\operatorname{Tr}(f \circ f^\dagger) > 0$ với $f \neq 0$ — involution dương. Hệ quả: $\operatorname{End}^0(A)$ semisimple.
- **Fixed points:** $\ker(\dagger - \operatorname{id}) = \operatorname{NS}(A) \otimes \mathbb{Q}$ — endomorphisms symmetric dưới Rosati là Néron-Severi group.
- **Albert classification:** Mọi abelian variety simple đều có $(D, \dagger)$ thuộc đúng một trong 4 loại Albert (I, II, III, IV).
- **Frobenius:** Trên $\mathbb{F}_q$, $\pi_A \circ \pi_A^\dagger = [q]$ — hệ quả của positivity, implies Frobenius là Weil number.
- Rosati involution **phụ thuộc** vào polarization $\phi$, nhưng loại Albert không phụ thuộc vào $\phi$.

---

## References

- Mumford, D. *Abelian Varieties*, §§19–21. (Rosati involution, positivity, Néron-Severi.)
- Milne, J.S. *Abelian Varieties*, §17. (Endomorphism algebras, Albert classification.)
- Conrad, B. *Polarizations*, §3. (Positivity, Frobenius as Weil number.)
- Martin Orr's blog: *Rosati Involutions* (martinorr.name/blog). (Clear exposition with examples.)
- Birkenhake & Lange, *Complex Abelian Varieties*, Chapter 5. (Albert classification analytically.)
- Shimura, G. *On Analytic Families of Polarized Abelian Varieties*. (Historical source.)
