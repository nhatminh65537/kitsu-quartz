---
title: "15. Separable vs Inseparable Isogenies"
type: theory
tags: [math, abelian-varieties, lesson-15]
aliases: [Separable vs Inseparable Isogenies]
created: 2026-05-17
---

> **Prerequisites**: [[14-isogenies-definition-and-basic-examples|14. Isogenies — Definition and Basic Examples]], [[11-the-multiplication-by-n-map|11. The Multiplication-by-n Map]]
> **Objectives**:
> - Hiểu sự khác biệt giữa separable isogeny và inseparable isogeny
> - Biết cách phân tích degree thành separable degree và inseparable degree
> - Hiểu tại sao Frobenius morphism là purely inseparable isogeny
> - Nắm được ảnh hưởng của đặc số trường $\operatorname{char}(k) = p$ đến cấu trúc của isogenies

---

## Motivation / Intuition

Trong lý thuyết trường, một field extension $L/K$ có thể là **separable** (không có phần tử với minimal polynomial có repeated roots), hoặc **inseparable** (có phần tử với minimal polynomial có repeated roots). Distinction này chỉ xảy ra khi $\operatorname{char}(K) = p > 0$.

Với morphisms giữa varieties, cũng có sự phân chia tương tự: một morphism $f: X \to Y$ (giữa hai smooth varieties chiều bằng nhau) induce một extension $f^*: k(Y) \hookrightarrow k(X)$ của function fields. Morphism gọi là:
- **Separable** nếu $k(X)/f^* k(Y)$ là separable extension
- **Purely inseparable** nếu $k(X)/f^* k(Y)$ là purely inseparable extension

Trong characteristic $0$, mọi dominant morphism giữa smooth varieties đều separable. Trong **characteristic $p > 0$**, xuất hiện những morphisms "xấu" — điển hình nhất là **Frobenius morphism** — mà hoàn toàn inseparable. Đây là điều thú vị và cũng là thách thức khi làm việc trên trường hữu hạn $\mathbb{F}_q$.

Sự phân biệt separable/inseparable **không chỉ là kỹ thuật** — nó có hệ quả sâu xa:
- Separable isogeny: kernel "nhìn thấy được" — là một nhóm étale với $|\ker(\bar{k})| = \deg$
- Purely inseparable isogeny: kernel "vô hình" theo nghĩa topological — mọi điểm kernel coincide trên underlying topological space, chỉ phân biệt qua nilpotent structure của ring
- Frobenius là purely inseparable — đây là lý do tại sao $A[p]$ trong char $p$ có cấu trúc phức tạp hơn $A[n]$ với $p \nmid n$

---

## Separability của Morphisms (Separable Morphism)

### Definition

> [!definition] Definition 15.1 — Separable và Inseparable Degree
>
> Cho $f: A \to B$ là một isogeny của abelian varieties trên trường $k$. Isogeny $f$ cảm sinh một extension của function fields:
>
> $$
> f^*: k(B) \hookrightarrow k(A)
> $$
>
> Mọi finite field extension đều có thể viết như $L = L_s \cdot L_i$ trong đó $L_s/K$ separable và $L_i/K$ purely inseparable. Áp dụng điều này:
>
> $$
> [k(A) : f^* k(B)] = [k(A) : k(A)_s] \cdot [k(A)_s : f^* k(B)]
> $$
>
> Ta định nghĩa:
>
> - **Separable degree**: $\deg_s(f) := [k(A)_s : f^* k(B)]$ — phần separable của extension
> - **Inseparable degree**: $\deg_i(f) := [k(A) : k(A)_s]$ — phần purely inseparable
>
> và ta luôn có:
>
> $$
> \deg(f) = \deg_s(f) \cdot \deg_i(f)
> $$

> [!definition] Definition 15.2 — Separable và Purely Inseparable Isogeny
>
> Một isogeny $f: A \to B$ gọi là:
>
> - **Separable** nếu $\deg_i(f) = 1$, tức là extension $k(A)/f^* k(B)$ là separable
> - **Purely inseparable** nếu $\deg_s(f) = 1$, tức là extension $k(A)/f^* k(B)$ là purely inseparable
> - **Étale** (đẳng phẳng tách) — từ đồng nghĩa với separable khi ta nói về isogeny

> [!note] Remark 15.3 — Đặc trưng qua Kernel
>
> Có một mô tả trực quan hơn qua kernel:
>
> - $f$ **separable** $\Leftrightarrow$ group scheme $\ker(f)$ là **étale** trên $k$, tức là $\ker(f)(\bar{k})$ có đúng $\deg(f)$ phần tử (không có nilpotent structure)
> - $f$ **purely inseparable** $\Leftrightarrow$ $\ker(f)$ là **connected** như một group scheme, tức là underlying topological space của $\ker(f)$ chỉ gồm một điểm $\{0\}$ (nhưng $\mathcal{O}_{\ker(f)} \neq k$)
>
> Nói cách khác, đối với purely inseparable isogeny, "không tìm được" điểm kernel trên $\bar{k}$ ngoài $0$, nhưng $\ker(f)$ vẫn có "khối lượng" scheme-theoretic bằng $\deg(f)$.

### Theorem

> [!theorem] Theorem 15.4 — Phân tích Isogeny theo Separability
>
> Cho $f: A \to B$ là một isogeny. Luôn tồn tại một factorization duy nhất:
>
> $$
> A \xrightarrow{f_i} C \xrightarrow{f_s} B
> $$
>
> trong đó $f_i$ là purely inseparable isogeny và $f_s$ là separable isogeny, với:
>
> $$
> \deg(f_i) = \deg_i(f), \quad \deg(f_s) = \deg_s(f)
> $$

**Proof sketch.**
Xét closure Galois của extension $k(A)/f^* k(B)$. Phần separable closure cho ta intermediate field $k(C)$ và factorization tương ứng. Tính duy nhất theo tính universal của separable closure. $\blacksquare$

---

## Frobenius — Ví dụ Chuẩn Mực của Purely Inseparable Isogeny

### Definition

> [!definition] Definition 15.5 — Frobenius Morphism
>
> Cho $k$ là trường với $\operatorname{char}(k) = p > 0$ và $A$ là abelian variety trên $k$.
>
> **Absolute Frobenius**: morphism $\operatorname{Frob}_A: A \to A$ tác động lên ring xấp xỉ affine: với $\operatorname{Spec}(R) \subset A$, nó tương ứng với $R \to R$, $r \mapsto r^p$.
>
> Trên $\bar{k}$: $\operatorname{Frob}_A(x_0: x_1: \cdots: x_n) = (x_0^p : x_1^p : \cdots : x_n^p)$ trong projective coordinates.
>
> **Relative Frobenius** (hay **Frobenius isogeny**): Vì $A$ là $k$-scheme, ta có morphism:
>
> $$
> F_{A/k}: A \longrightarrow A^{(p)}
> $$
>
> trong đó $A^{(p)} = A \times_{\operatorname{Spec}(k), \phi_p} \operatorname{Spec}(k)$ là **Frobenius twist** của $A$ (variety $A$ với $k$-structure "xoắn" bởi $\phi_p: k \to k$, $\lambda \mapsto \lambda^p$).
>
> Trên $\bar{k} = \mathbb{F}_q$ với $q = p^r$: **geometric Frobenius** là:
>
> $$
> \pi_A: A \longrightarrow A, \quad (x_0: \cdots: x_n) \mapsto (x_0^q: \cdots: x_n^q)
> $$

> [!note] Remark 15.6 — Cẩn thận với Convention
>
> Có hai Frobenius thường gặp:
>
> - **Arithmetic Frobenius**: $(x_0: \cdots) \mapsto (x_0^q: \cdots)$ — đây là endomorphism của $A/\mathbb{F}_q$
> - **Geometric Frobenius**: nghịch đảo của arithmetic Frobenius trong Galois action
>
> Trong context endomorphism của $A$ trên $\mathbb{F}_q$, ta luôn dùng arithmetic Frobenius $\pi_A: P \mapsto P^{(q)}$.

### Theorem

> [!theorem] Theorem 15.7 — Frobenius là Purely Inseparable Isogeny
>
> Cho $A$ là abelian variety trên $k$ với $\operatorname{char}(k) = p > 0$ và $\dim A = g$. Thì relative Frobenius:
>
> $$
> F_{A/k}: A \longrightarrow A^{(p)}
> $$
>
> là một **purely inseparable isogeny** với:
>
> $$
> \deg(F_{A/k}) = p^g, \quad \deg_s(F_{A/k}) = 1, \quad \deg_i(F_{A/k}) = p^g
> $$

**Proof.**
Ta cần chứng minh: (1) $F_{A/k}$ là isogeny, (2) nó purely inseparable.

**Bước 1: $F_{A/k}$ là group homomorphism.** Frobenius morphism tương thích với group law vì $(x+y)^p = x^p + y^p$ trong characteristic $p$ (Freshman's dream). Cụ thể hơn, trên affine opens $\operatorname{Spec}(R)$ của $A$, ring map $R \to R$ với $r \mapsto r^p$ commute với comultiplication $\Delta: R \to R \otimes R$ của group scheme $A$.

**Bước 2: $\ker(F_{A/k})$ là finite.** Viết $A[F] := \ker(F_{A/k})$. Xét một affine open $U = \operatorname{Spec}(A)$ quanh $0$, với $A = k[x_1, \ldots, x_r]/(f_1, \ldots, f_n)$ và $0$ ứng với maximal ideal $\mathfrak{m} = (x_1, \ldots, x_r)$.

Frobenius tương ứng với: $A^{(p)} = k[x_1, \ldots, x_r]/(f_1^{(p)}, \ldots, f_n^{(p)})$ (thay tất cả hệ số bởi lũy thừa $p$) và $F^*: A^{(p)} \to A$ gửi $x_i \mapsto x_i^p$.

$A[F] = \operatorname{Spec}(B)$ với $B = A \otimes_{A^{(p)}, F^*} k = A / (x_1^p, \ldots, x_r^p) \cdot A$, có $\dim_k B = p^g$ vì $B \cong k[x_1, \ldots, x_g]/(x_1^p, \ldots, x_g^p)$ locally (chỉ cần $g = \dim A$ generators). Vậy $\ker(F_{A/k})$ là finite scheme of length $p^g$.

**Bước 3: Purely inseparable.** Extension $k(A)/F^* k(A^{(p)})$ chính là $k(x_i)/k(x_i^p)$ locally, là purely inseparable extension degree $p$. Tổng hợp $g$ biến: $\deg_i = p^g$. $\blacksquare$

### Worked Example

> [!example] Example 15.8 — Frobenius trên Elliptic Curve over $\mathbb{F}_p$
>
> Cho $E: y^2 = x^3 + ax + b$ trên $\mathbb{F}_p$ (với $p > 3$).
>
> **Frobenius endomorphism** là:
>
> $$
> \pi_E: E \to E, \quad (x, y) \mapsto (x^p, y^p)
> $$
>
> Kiểm tra: $(y^p)^2 = y^{2p} = (y^2)^p = (x^3 + ax + b)^p = x^{3p} + a^p x^p + b^p$.
>
> Vì $a, b \in \mathbb{F}_p$: $a^p = a$, $b^p = b$, nên $(x^p)^3 + a(x^p) + b$. ✓ Điểm $(x^p, y^p)$ nằm trên $E$.
>
> **Degree:** $\deg(\pi_E) = p^1 = p$ (vì $g = 1$).
>
> **Purely inseparable:** $k(E)/\pi_E^* k(E)$ là extension sinh bởi $x$ over $x^p, y^p$ — purely inseparable degree $p$.
>
> **Geometric ý nghĩa:** $\pi_E(P) = P$ nếu và chỉ nếu $P \in E(\mathbb{F}_p)$. Nói cách khác, $\ker(\pi_E - \operatorname{id}) = E(\mathbb{F}_p)$ — tập các $\mathbb{F}_p$-rational points!
>
> Đây là lý do Frobenius trung tâm trong việc đếm: $|E(\mathbb{F}_p)| = |\ker(\pi_E - 1)| = \deg(\pi_E - 1) = p + 1 - a_p$ (Hasse's theorem).

> [!example] Example 15.9 — Verschiebung
>
> Cho $F = F_{A/k}: A \to A^{(p)}$ là Frobenius isogeny. Tồn tại một isogeny gọi là **Verschiebung** (dịch chuyển) đi theo chiều ngược:
>
> $$
> V_{A/k}: A^{(p)} \longrightarrow A
> $$
>
> thỏa mãn: $V_{A/k} \circ F_{A/k} = [p]_A$ và $F_{A/k} \circ V_{A/k} = [p]_{A^{(p)}}$.
>
> Verschiebung là **dual isogeny** của Frobenius (theo nghĩa của bài 16), và:
>
> $$
> \deg(V_{A/k}) = p^g
> $$
>
> Decomposition $[p] = V \circ F$ cho ta cái nhìn sâu vào cấu trúc của $p$-torsion: $A[p] = \ker([p]) = \ker(V \circ F)$ mang cả phần "inseparable" (từ $F$) và phần "separable" (từ $V$).

---

## Multiplication-by-n và Separability

### Theorem

> [!theorem] Theorem 15.10 — Separability của $[n]$
>
> Cho $A$ là abelian variety trên $k$ và $n \in \mathbb{Z}_{>0}$.
>
> $$
> [n]: A \to A \text{ là separable} \iff \gcd(n, \operatorname{char}(k)) = 1
> $$
>
> Cụ thể:
>
> - Nếu $\operatorname{char}(k) = 0$: $[n]$ luôn separable với mọi $n \geq 1$
> - Nếu $\operatorname{char}(k) = p > 0$: $[n]$ separable $\iff p \nmid n$
>
> Khi $p \mid n$, viết $n = p^s \cdot m$ với $\gcd(m, p) = 1$. Thì:
>
> $$
> \deg_s([n]) = m^{2g}, \quad \deg_i([n]) = p^{2sg}
> $$

**Proof sketch.**
Bằng cách tính derivative $d[n]$ tại điểm $0$: $d[n]_0 = n \cdot \operatorname{id}: T_0 A \to T_0 A$ (tangent map là nhân $n$). $[n]$ separable iff $d[n]_0 \neq 0$ (vì smoothness), tức iff $n \neq 0$ trong $k$, tức iff $\operatorname{char}(k) \nmid n$. Factorization $[n] = [m] \circ [p]^s$ cho phần degree. $\blacksquare$

> [!warning] Counterexample 15.11 — $[p]$ không separable trong char $p$
>
> Khi $\operatorname{char}(k) = p > 0$:
>
> - $[p]: A \to A$ có $\deg_s([p]) = 1$ và $\deg_i([p]) = p^{2g}$
> - $A[p](\bar{k})$ — số điểm $p$-torsion trên $\bar{k}$ — **không** bằng $p^{2g}$ (như trong char $0$)
> - Thay vào đó $|A[p](\bar{k})| = p^f$ với $0 \leq f \leq g$
> - $f = g$ khi $A$ **ordinary** và $f = 0$ khi $A$ **supersingular** (xem bài 44)
>
> Đây là ảnh hưởng cơ bản của characteristic $p$ lên cấu trúc torsion!

---

## Ví dụ Toàn Diện: $[p]$ trên Elliptic Curve

> [!example] Example 15.12 — Phân tích $[p]$ trên $E/\mathbb{F}_p$
>
> Cho $E: y^2 = x^3 + ax + b$ trên $k = \mathbb{F}_p$.
>
> Ta có factorization:
>
> $$
> [p]: E \xrightarrow{F} E^{(p)} \xrightarrow{V} E
> $$
>
> trong đó $E^{(p)}$ là Frobenius twist của $E$ (với $a \mapsto a^p = a$ và $b \mapsto b^p = b$ vì $a, b \in \mathbb{F}_p$, nên $E^{(p)} = E$!), $F = \pi_E$ là Frobenius, $V = \hat{\pi}_E$ là Verschiebung.
>
> Vậy: $[p] = V \circ \pi_E$ và $\pi_E \circ V = [p]$ trên $E$.
>
> **$E[p](\mathbb{F}_p)$:**
>
> - Nếu $E$ **ordinary**: $E[p](\bar{\mathbb{F}}_p) \cong \mathbb{Z}/p\mathbb{Z}$ (rank 1)
> - Nếu $E$ **supersingular**: $E[p](\bar{\mathbb{F}}_p) = \{O\}$ (rank 0)
>
> Hai loại elliptic curve này phân biệt nhau theo hành vi của $p$-torsion — chủ đề của bài 44.

---

## SageMath Cheatsheet

```python
p = 97
E = EllipticCurve(GF(p), [2, 3])
print('E.order():', E.order())
frob = E.frobenius_endomorphism()
print('Frobenius:', frob)
print('Char poly of Frobenius:', E.frobenius_polynomial())
```

```python
E = EllipticCurve(GF(5), [1, 1])
print('E[5] points (F_5bar):', E.torsion_polynomial(5).factor())
```

---

## Summary / Key Takeaways

- Isogeny $f: A \to B$ là **separable** nếu extension $k(A)/f^* k(B)$ là separable; **purely inseparable** nếu extension này purely inseparable.
- Mọi isogeny phân tích thành purely inseparable isogeny rồi đến separable isogeny.
- **Frobenius** $F_{A/k}: A \to A^{(p)}$ là purely inseparable isogeny với $\deg = p^g$.
- **Verschiebung** $V: A^{(p)} \to A$ là dual của Frobenius, với $V \circ F = [p]$.
- $[n]$ separable ↔ $\operatorname{char}(k) \nmid n$.
- Khi char $= p$ và $p \mid n$: $A[n](\bar{k})$ nhỏ hơn đáng kể so với $n^{2g}$.
- Distinction ordinary/supersingular xuất phát từ behavior của $p$-torsion.

---

## References

- van der Geer, G. & Moonen, B. *Abelian Varieties*. Chapter V §2 (Frobenius and Verschiebung). https://www.math.ru.nl/~bmoonen/BookAV/Isogs.pdf
- Milne, J. S. *Abelian Varieties*. Section 8 (The Dual Abelian Variety). https://www.jmilne.org/math/xnotes/AVs.pdf
- Mumford, D. *Abelian Varieties*. Chapter 2, §5. Oxford University Press, 1974.
- Silverman, J. H. *The Arithmetic of Elliptic Curves*. Chapter II.2 (Separable and Inseparable Maps). Springer GTM 106, 2009.
- Conrad, B. *Abelian Varieties* (Stanford lecture notes). Chapter 1. https://math.stanford.edu/~conrad/249CS15Page/handouts/abvarnotes.pdf
