---
title: "15. Kummer Theory"
tags: [math, galois-theory, lesson-15]
aliases: [Kummer Theory]
created: 2026-03-24
---

> **Prerequisites**: [[09-cyclotomic-extensions|09. Cyclotomic Extensions]], [[13-solvable-groups-radical-extensions|13. Solvable Groups và Radical Extensions]]
> **Objectives**:
> - Phát biểu và chứng minh Hilbert's Theorem 90
> - Nắm vững Kummer correspondence: abelian extensions of exponent $n \leftrightarrow$ subgroups of $K^\times/(K^\times)^n$
> - Hiểu Kummer pairing và tính duality
> - Áp dụng Kummer Theory vào phân loại abelian extensions
> - Kết nối với Class Field Theory và nghiên cứu

---

## Motivation / Intuition

Từ Bài 13, ta biết: nếu $K$ chứa $\zeta_n$ thì cyclic extension bậc $n$ của $K$ có dạng $K(\alpha)$ với $\alpha^n \in K$. Kummer Theory mở rộng này thành một lý thuyết **tổng quát và đối xứng** cho tất cả abelian extensions của exponent $n$: chúng được phân loại hoàn toàn bởi các subgroup của nhóm nhân $K^\times/(K^\times)^n$.

Điều này tạo ra một "duality" đẹp: thay vì làm việc trực tiếp với các extensions (đối tượng hình học phức tạp), ta có thể hoàn toàn làm việc trong $K^\times$ (nhóm nhân, đại số thuần túy).

Kummer Theory là cầu nối then chốt sang **Class Field Theory** — lý thuyết phân loại tất cả abelian extensions của number fields (Bài 17).

---

## Hilbert's Theorem 90

Nền tảng kỹ thuật của Kummer Theory.

> [!abstract] Theorem 15.1 — Hilbert's Theorem 90 (Multiplicative)
> Cho $L/K$ là Galois extension với $G = \operatorname{Gal}(L/K)$ **cyclic**, generator $\sigma$. Khi đó:
>
> $$
> \operatorname{N}_{L/K}(\alpha) = 1 \iff \alpha = \frac{\sigma(\beta)}{\beta} \text{ với một } \beta \in L^\times
> $$
>
> Trong đó norm $\operatorname{N}_{L/K}(\alpha) = \prod_{\tau \in G} \tau(\alpha)$.

**Proof ($\Rightarrow$).** Giả sử $\operatorname{N}_{L/K}(\alpha) = 1$ với $\alpha \in L^\times$.

Xét **Lagrange resolvent**: $f = \mathrm{id} + \alpha \sigma + (\alpha \cdot \sigma(\alpha)) \sigma^2 + \cdots + (\alpha \cdots \sigma^{n-2}(\alpha)) \sigma^{n-1}$.

Theo linear independence of characters (Artin), $f \neq 0$ như hàm trên $L^\times$. Chọn $x \in L^\times$ với $\beta := f(x) \neq 0$.

Tính: $\sigma(\beta) = \sigma(f(x)) = \sigma(x) + \sigma(\alpha)\sigma^2(x) + \cdots + \operatorname{N}(\alpha)\sigma^n(x)$.

Vì $\operatorname{N}(\alpha) = 1$ và $\sigma^n = \mathrm{id}$: $\sigma(\beta) = \frac{1}{\alpha}(\alpha\sigma(x) + \alpha\sigma(\alpha)\sigma^2(x) + \cdots) = \frac{\beta}{\alpha}$.

Vậy $\alpha = \beta/\sigma(\beta) = \sigma(\beta^{-1})/\beta^{-1}$... tức $\alpha = \sigma(\beta^{-1})/\beta^{-1}$, đặt $\beta' = \beta^{-1}$ thì $\alpha = \sigma(\beta')/\beta'$. $\blacksquare$

> [!note] Remark 15.2 — Additive Hilbert 90
> Có phiên bản cộng: $\operatorname{Tr}_{L/K}(\alpha) = 0 \iff \alpha = \sigma(\beta) - \beta$ với $\beta \in L$. Dùng cho Artin-Schreier theory (characteristic $p$).

> [!note] Remark 15.3 — Hilbert 90 trong Group Cohomology
> Hilbert's Theorem 90 tương đương với $H^1(G, L^\times) = 0$ (vanishing của group cohomology). Đây là ngôn ngữ hiện đại của lý thuyết — dẫn đến toàn bộ Galois cohomology và Class Field Theory.

---

## Kummer Extension và Kummer Correspondence

### Cyclic Kummer Extensions

> [!abstract] Theorem 15.4 — Kummer Extension (Cyclic Case)
> Cho $K$ field, $\operatorname{char}(K) \nmid n$, $\mu_n \subset K$ (tức $K$ chứa tất cả $n$-th roots of unity). Khi đó:
>
> - Với mọi $a \in K^\times$: $K(\sqrt[n]{a})/K$ là Galois với Galois group cyclic, bậc chia $n$.
> - **Đảo lại** (dùng Hilbert 90): nếu $L/K$ là cyclic Galois bậc $n$, thì $L = K(\sqrt[n]{a})$ với $a \in K^\times$.
>
> Hai extension $K(\sqrt[n]{a})$ và $K(\sqrt[n]{b})$ **bằng nhau** khi và chỉ khi $a/b \in (K^\times)^n$.

**Proof (chiều cyclic $\Rightarrow$ radical, dùng Hilbert 90).**
Cho $\sigma$ là generator của $G = \operatorname{Gal}(L/K) \cong \mathbb{Z}/n$. Vì $\sigma$ là automorphism bậc $n$, $\sigma^n = \mathrm{id}$.

Xét $\zeta_n \in K$. Tính $\operatorname{N}_{L/K}(\zeta_n) = \zeta_n^n = 1$. Từ Hilbert 90, $\zeta_n = \sigma(\alpha)/\alpha$ với $\alpha \in L^\times$.

Khi đó $\sigma(\alpha) = \zeta_n \alpha$, nên $\sigma(\alpha^n) = (\sigma\alpha)^n = (\zeta_n\alpha)^n = \zeta_n^n\alpha^n = \alpha^n$.

Vậy $\alpha^n \in L^G = K$, và $K(\alpha) = L$ (vì $\alpha$ có bậc $n$ trên $K$). $\blacksquare$

### Kummer Correspondence (Abelian Case)

> [!abstract] Theorem 15.5 — Kummer Correspondence
> Cho $K$ field, $\operatorname{char}(K) \nmid n$, $\mu_n \subset K$. Khi đó:
>
> Có **bijection order-preserving** giữa:
>
> $$
> \left\{\text{Subgroups } \Delta \subseteq K^\times/(K^\times)^n\right\} \longleftrightarrow \left\{\text{Abelian extensions } L/K \text{ of exponent } \mid n\right\}
> $$
>
> Cho bởi $\Delta \mapsto K(\Delta^{1/n}) = K\!\left(\!\left\{\sqrt[n]{a} \mid a \in \Delta\right\}\!\right)$, với inverse $L \mapsto (L^\times)^n \cap K^\times / (K^\times)^n$.
>
> Dưới bijection này: $[L:K] = |\Delta|$ và $\operatorname{Gal}(L/K) \cong \widehat{\Delta} := \operatorname{Hom}(\Delta, \mu_n)$ (**Pontryagin dual** của $\Delta$).

> [!example] Example 15.6 — $n = 2$, $K = \mathbb{Q}$
> $K^\times/(K^\times)^2 = \mathbb{Q}^\times/(\mathbb{Q}^\times)^2$: mỗi phần tử là lớp tương đương của số hữu tỉ "squarefree" (phần tử đại diện là tích của primes phân biệt).
>
> Các subgroups hữu hạn $\Delta$ tương ứng với các multiquadratic extensions $\mathbb{Q}(\sqrt{a_1}, \ldots, \sqrt{a_k})$.
>
> Ví dụ: $\Delta = \langle -1, 2, 3 \rangle / (\mathbb{Q}^\times)^2$ (bậc 4) $\leftrightarrow$ $\mathbb{Q}(\sqrt{-1}, \sqrt{2}, \sqrt{3})/\mathbb{Q}$ (bậc $4 = |\Delta|$).

---

## Kummer Pairing

> [!definition] Definition 15.7 — Kummer Pairing
> Cho $L/K$ là Kummer extension với $\Delta \subseteq K^\times/(K^\times)^n$. **Kummer pairing** là:
>
> $$
> \langle \cdot, \cdot \rangle: \operatorname{Gal}(L/K) \times \Delta \to \mu_n, \quad \langle \sigma, a \rangle = \frac{\sigma(\sqrt[n]{a})}{\sqrt[n]{a}}
> $$

> [!abstract] Theorem 15.8 — Kummer Pairing là Perfect Pairing (Duality)
> Kummer pairing là **non-degenerate** (perfect pairing): nó cảm sinh isomorphisms:
>
> $$
> \operatorname{Gal}(L/K) \cong \operatorname{Hom}(\Delta, \mu_n), \qquad \Delta \cong \operatorname{Hom}(\operatorname{Gal}(L/K), \mu_n)
> $$

**Proof sketch.** Nếu $\langle \sigma, a \rangle = 1$ với mọi $a \in \Delta$ thì $\sigma$ cố định mọi $\sqrt[n]{a}$, tức $\sigma = \mathrm{id}$. Nếu $\langle \sigma, a \rangle = 1$ với mọi $\sigma$ thì $\sqrt[n]{a} \in L^G = K$, tức $a \in (K^\times)^n$ là trivial. Vậy non-degenerate. $\blacksquare$

---

## Ứng dụng: Phân loại Abelian Extensions của Exponent $n$

> [!example] Example 15.9 — Tất cả quadratic extensions của $\mathbb{Q}$
> $n = 2$, $\mu_2 = \{1, -1\} \subset \mathbb{Q}$.
>
> Kummer correspondence: quadratic extensions của $\mathbb{Q}$ $\leftrightarrow$ subgroups bậc 2 của $\mathbb{Q}^\times/(\mathbb{Q}^\times)^2$.
>
> Mỗi subgroup bậc 2 sinh bởi một squarefree integer $d$. Các quadratic extensions là $\mathbb{Q}(\sqrt{d})$ với $d$ squarefree, $d \neq 1$. Đây là phân loại hoàn toàn tất cả quadratic extensions của $\mathbb{Q}$.

> [!example] Example 15.10 — Abelian extensions của $\mathbb{Q}_p$
> $\mathbb{Q}_p$ ($p$-adic field): Kummer Theory mô tả abelian extensions của exponent $n$ qua $\mathbb{Q}_p^\times/(\mathbb{Q}_p^\times)^n$. Kết hợp với Local Class Field Theory, ta phân loại được **mọi** abelian extension của $\mathbb{Q}_p$. Đây là điểm xuất phát của Local Class Field Theory.

---

## Kết nối: Kummer Theory và Galois Solvability

> [!abstract] Corollary 15.11 — Kummer Theory trong Proof of Galois Criterion
> Kummer Theory (Theorem 15.4) là công cụ then chốt trong proof của Galois Solvability Criterion (Bài 13): **cyclic extension** (factor group trong derived series của solvable group) $\leftrightarrow$ **adjoin $n$-th root** (step trong radical tower). Đây là cầu nối giữa group theory và field theory.

---

## Artin-Schreier: Kummer Theory cho Characteristic $p$

> [!note] Remark 15.12 — Artin-Schreier Theory
> Khi $\operatorname{char}(K) = p > 0$, Kummer Theory không áp dụng cho $n = p$ (không có primitive $p$-th roots of unity trong char $p$). Thay vào đó có **Artin-Schreier Theory**:
>
> Extension cyclic bậc $p$ của $K$ (char $p$) tương ứng với $L = K(\beta)$ với $\beta^p - \beta = a \in K$.
>
> Đây quan trọng cho: elliptic curves over finite fields, wildly ramified extensions, cryptographic applications.

---

## SageMath Cheatsheet

```sage
K = QQ
n = 2

Kx.<x> = PolynomialRing(K)

for d in [-3, -2, -1, 2, 3, 5, 6, 7, 10]:
    L = K.extension(x^2 - d, 'sqrtd')
    print(f"d={d}: Q(sqrt({d})), Gal={L.galois_group().structure_description()}")

K3 = CyclotomicField(3)
K3x.<t> = PolynomialRing(K3)
for a in [2, 3, 5]:
    L = K3.extension(t^3 - a, 'cbrt')
    print(f"a={a}: K3(cbrt({a})), degree={L.absolute_degree()}")

K5 = CyclotomicField(5)
K5x.<u> = PolynomialRing(K5)
L5 = K5.extension(u^5 - 2, 'v')
G = L5.galois_group()
print(G.structure_description(), G.is_abelian())
```

---

## Summary / Key Takeaways

- **Hilbert's Theorem 90**: trong cyclic $L/K$, $\operatorname{N}(\alpha) = 1 \iff \alpha = \sigma(\beta)/\beta$ — dùng Lagrange resolvent.
- **Cyclic Kummer**: khi $\mu_n \subset K$, cyclic bậc $n$ $\iff$ adjoin $n$-th root.
- **Kummer Correspondence**: bijection $\Delta \subseteq K^\times/(K^\times)^n \leftrightarrow$ abelian extensions of exponent $n$.
- **Kummer Pairing**: perfect duality $\operatorname{Gal}(L/K) \cong \widehat{\Delta}$ — "Galois group và Kummer group là Pontryagin dual của nhau".
- Hai extensions bằng nhau $\iff$ $a/b \in (K^\times)^n$.
- **Kết nối**: Kummer Theory $\to$ Galois Solvability Criterion $\to$ Abel-Ruffini; Kummer Theory $\to$ Class Field Theory.
- **Artin-Schreier**: analog trong char $p$, dùng $\beta^p - \beta = a$.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §14.7.
- Conrad, K. *Linear Independence of Characters* + *Kummer Extensions*. Có tại https://kconrad.math.uconn.edu/blurbs/galoistheory/linearchar.pdf
- Milne, J. S. *Fields and Galois Theory*, §§12–13.
- Kedlaya, K. *Class Field Theory (notes)*, §1. Có tại https://kskedlaya.org/cft/
