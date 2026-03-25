---
title: "09. Cyclotomic Extensions"
tags: [math, galois-theory, lesson-09]
aliases: [Cyclotomic Extensions]
created: 2026-03-24
---

> **Prerequisites**: [[08-fundamental-theorem|08. Fundamental Theorem of Galois Theory]]
> **Objectives**:
> - Định nghĩa roots of unity, primitive root, và nhóm $\mu_n$
> - Xây dựng cyclotomic polynomial $\Phi_n(x)$ và chứng minh $\Phi_n \in \mathbb{Z}[x]$
> - Chứng minh $\Phi_n(x)$ irreducible over $\mathbb{Q}$
> - Tính $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$
> - Áp dụng FTGT xác định subfields của cyclotomic extensions

---

## Motivation / Intuition

Cyclotomic extensions — extensions sinh bởi roots of unity — là lớp Galois extensions đẹp nhất và có cấu trúc rõ ràng nhất. Chúng có vai trò trung tâm trong toàn bộ Algebra và Number Theory:

- **Cổ điển**: constructibility của regular $n$-gon bằng ruler-and-compass (sẽ thấy ở Bài 11).
- **Số học**: mọi abelian extension của $\mathbb{Q}$ được chứa trong một cyclotomic extension — đây là nội dung của **Kronecker-Weber Theorem** (Bài 17).
- **Mật mã học**: cấu trúc nhóm của $(\mathbb{Z}/n\mathbb{Z})^\times$ là nền tảng của RSA và nhiều hệ mật khác; lattice-based cryptography dùng cyclotomic polynomial $\Phi_{2^k}(x) = x^{2^{k-1}}+1$.

Kết quả đẹp: $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$. Galois group là nhóm nhân của $\mathbb{Z}/n\mathbb{Z}$ — đơn giản và hoàn toàn xác định.

---

## Roots of Unity và Nhóm $\mu_n$

> [!definition] Definition 9.1 — Roots of Unity
> Cho $K$ là field và $n \geq 1$ số nguyên với $\operatorname{char}(K) \nmid n$.
>
> - $\zeta \in \bar{K}$ là **$n$-th root of unity** nếu $\zeta^n = 1$.
> - $\zeta$ là **primitive $n$-th root of unity** nếu bậc của $\zeta$ trong nhóm nhân $\bar{K}^\times$ bằng đúng $n$ (tức $\zeta^k \neq 1$ với $0 < k < n$).
> - $\mu_n = \{\zeta \in \bar{K} \mid \zeta^n = 1\}$ là nhóm tất cả $n$-th roots of unity.

> [!abstract] Theorem 9.2 — $\mu_n$ là cyclic group bậc $n$
> Với $\operatorname{char}(K) \nmid n$: $\mu_n$ là cyclic group bậc $n$. Cụ thể: $\mu_n \cong \mathbb{Z}/n\mathbb{Z}$.

**Proof.** $x^n - 1$ separable (derivative $nx^{n-1} \neq 0$ vì $n \neq 0$ trong $K$), nên có đúng $n$ nghiệm phân biệt trong $\bar{K}$. Vậy $|\mu_n| = n$. Mọi subgroup hữu hạn của trường $\bar{K}^\times$ là cyclic. $\blacksquare$

> [!example] Example 9.3
> Với $K = \mathbb{Q}$ và $n = 6$: các $6$th roots of unity trong $\mathbb{C}$ là $\{1, -1, \omega, -\omega, \omega^2, -\omega^2\}$ với $\omega = e^{2\pi i/3}$. Các **primitive** $6$th roots là $\zeta_6 = e^{2\pi i/6} = e^{\pi i/3}$ và $\zeta_6^5 = e^{5\pi i/3}$ (những phần tử bậc đúng $6$).

> [!note] Remark 9.4
> Số primitive $n$-th roots of unity bằng $\varphi(n) = |(\mathbb{Z}/n\mathbb{Z})^\times|$ — hàm Euler $\varphi$.

---

## Cyclotomic Polynomials

> [!definition] Definition 9.5 — Cyclotomic Polynomial
> **Cyclotomic polynomial** (đa thức phân tử hội tụ) bậc $n$ là:
>
> $$
> \Phi_n(x) = \prod_{\substack{1 \leq k \leq n \\ \gcd(k,n) = 1}} (x - e^{2\pi i k/n}) = \prod_{\zeta \text{ primitive}} (x - \zeta)
> $$
>
> tức là tích của $(x - \zeta)$ trên tất cả primitive $n$-th roots of unity $\zeta$.

Degree của $\Phi_n$: $\deg \Phi_n = \varphi(n)$.

> [!abstract] Theorem 9.6 — Phân tích $x^n - 1$
> $$
> x^n - 1 = \prod_{d \mid n} \Phi_d(x)
> $$

**Proof.** Mọi $n$-th root of unity $\zeta$ có bậc $d$ chia $n$, và khi đó $\zeta$ là primitive $d$-th root. Vậy các tập $\{$primitive $d$-th roots$\}$ với $d \mid n$ phân hoạch tập $\mu_n$ thành $n$ phần tử. $\blacksquare$

Công thức này cho phép tính $\Phi_n$ quy nạp: $\Phi_n(x) = \frac{x^n - 1}{\prod_{d \mid n,\, d < n} \Phi_d(x)}$.

> [!example] Example 9.7 — Bảng cyclotomic polynomials nhỏ
>
> | $n$ | $\varphi(n)$ | $\Phi_n(x)$ |
> |-----|------------|-------------|
> | $1$ | $1$ | $x - 1$ |
> | $2$ | $1$ | $x + 1$ |
> | $3$ | $2$ | $x^2 + x + 1$ |
> | $4$ | $2$ | $x^2 + 1$ |
> | $5$ | $4$ | $x^4 + x^3 + x^2 + x + 1$ |
> | $6$ | $2$ | $x^2 - x + 1$ |
> | $8$ | $4$ | $x^4 + 1$ |
> | $p$ (prime) | $p-1$ | $x^{p-1} + x^{p-2} + \cdots + 1$ |
> | $2p$ (prime $p$ odd) | $p-1$ | $x^{p-1} - x^{p-2} + \cdots + 1$ |

> [!abstract] Theorem 9.8 — $\Phi_n(x) \in \mathbb{Z}[x]$
> Mọi cyclotomic polynomial $\Phi_n(x)$ có hệ số nguyên.

**Proof.** Quy nạp theo $n$. $\Phi_1(x) = x-1 \in \mathbb{Z}[x]$. Giả sử $\Phi_d \in \mathbb{Z}[x]$ với mọi $d < n$. Viết $x^n - 1 = \Phi_n(x) \cdot g(x)$ với $g(x) = \prod_{d \mid n, d < n} \Phi_d(x) \in \mathbb{Z}[x]$ (theo giả thuyết quy nạp). Cả $x^n - 1$ và $g(x)$ monic nguyên, và $g(x) \mid (x^n - 1)$ trong $\mathbb{Q}[x]$. Gauss' Lemma: $\Phi_n = (x^n-1)/g(x) \in \mathbb{Z}[x]$. $\blacksquare$

---

## Galois Group của Cyclotomic Extension

> [!abstract] Theorem 9.9 — $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$
>
> Với $n \geq 1$ và $\zeta_n$ là primitive $n$-th root of unity:
>
> 1. $\Phi_n(x) = \operatorname{Irr}(\zeta_n, \mathbb{Q})$, tức là $\Phi_n$ **irreducible** over $\mathbb{Q}$.
> 2. $[\mathbb{Q}(\zeta_n):\mathbb{Q}] = \varphi(n)$.
> 3. $\mathbb{Q}(\zeta_n)/\mathbb{Q}$ là **Galois extension** với Galois group isomorphic với $(\mathbb{Z}/n\mathbb{Z})^\times$:
>
> $$
> \operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \xrightarrow{\;\sim\;} (\mathbb{Z}/n\mathbb{Z})^\times, \quad \sigma \mapsto a \text{ trong đó } \sigma(\zeta_n) = \zeta_n^a
> $$

**Proof của (3)** (giả sử đã có (1)):

**Injective:** Map $\sigma \mapsto a_\sigma$ với $\sigma(\zeta_n) = \zeta_n^{a_\sigma}$ là injective (vì $\sigma$ xác định bởi $\sigma(\zeta_n)$). Giá trị $a_\sigma \in (\mathbb{Z}/n\mathbb{Z})^\times$ (vì $\sigma(\zeta_n)$ cũng phải là primitive $n$-th root, tức $\gcd(a_\sigma, n) = 1$).

**Homomorphism:** $(\sigma\tau)(\zeta_n) = \sigma(\zeta_n^{a_\tau}) = (\sigma(\zeta_n))^{a_\tau} = \zeta_n^{a_\sigma a_\tau}$. Vậy $a_{\sigma\tau} = a_\sigma a_\tau \pmod{n}$.

**Surjective:** Vì $\Phi_n$ irreducible và $\deg \Phi_n = \varphi(n) = [(\mathbb{Z}/n\mathbb{Z})^\times]$, có $|\operatorname{Gal}| = \varphi(n) = |(\mathbb{Z}/n\mathbb{Z})^\times|$. Injective homomorphism giữa hai nhóm cùng bậc là bijection. $\blacksquare$

**Proof của (1) — Irreducibility của $\Phi_n$** (phương pháp Gauss/Dedekind, sketch):

Giả sử $\Phi_n = f \cdot g$ với $f, g \in \mathbb{Z}[x]$ monic và $f$ irreducible, $\deg f \geq 1$. Lấy $\zeta$ là nghiệm của $f$.

*Claim:* $\zeta^p$ cũng là nghiệm của $f$ với mọi nguyên tố $p \nmid n$.

Nếu không: $\zeta^p$ là nghiệm của $g$, tức $\zeta$ là nghiệm của $g(x^p)$. Vì $f$ là minimal poly của $\zeta$: $f \mid g(x^p)$ trong $\mathbb{Q}[x]$. Reduce mod $p$: $\bar{f} \mid \bar{g}(x^p) = (\bar{g}(x))^p$ trong $\mathbb{F}_p[x]$.

Nhưng $\bar{f}$ và $\bar{g}$ chia hết $\overline{\Phi_n}$ divides $\overline{x^n-1}$ trong $\mathbb{F}_p[x]$. Vì $p \nmid n$, $x^n - 1$ separable trên $\mathbb{F}_p$, nên $\overline{\Phi_n}$ squarefree. Điều này mâu thuẫn với $\bar{f} \mid (\bar{g})^p$.

Vậy từ $\zeta$ ta build được mọi primitive $n$-th root $\zeta^m = \zeta^{p_1 \cdots p_k}$ (với $m = p_1\cdots p_k$ coprime to $n$), tất cả đều là nghiệm của $f$. Vậy $\Phi_n \mid f$, nên $f = \Phi_n$. $\blacksquare$

---

## Ứng dụng FTGT cho Cyclotomic Extensions

Vì $G = \operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$, mọi subfield của $\mathbb{Q}(\zeta_n)$ tương ứng với subgroup của $(\mathbb{Z}/n\mathbb{Z})^\times$.

> [!example] Example 9.10 — Subfields của $\mathbb{Q}(\zeta_5)$
> $n = 5$, $G \cong (\mathbb{Z}/5\mathbb{Z})^\times \cong \mathbb{Z}/4\mathbb{Z}$ (cyclic bậc 4).
>
> Subgroups: $\{1\}$, $\{1, 4\} \cong \mathbb{Z}/2\mathbb{Z}$, $G$ — chỉ có 3 subgroups.
>
> Intermediate fields: $\mathbb{Q}$, $\mathbb{Q}(\zeta_5)$, và đúng một field bậc 2 trên $\mathbb{Q}$.
>
> Field bậc 2 là $\mathbb{Q}(\sqrt{5})$! (Vì $\sqrt{5} = \zeta_5 + \zeta_5^4 - \zeta_5^2 - \zeta_5^3 \in \mathbb{Q}(\zeta_5)$, và $(\sqrt{5})^2 = 5 \in \mathbb{Q}$.)

> [!example] Example 9.11 — $\mathbb{Q}(\zeta_8)/\mathbb{Q}$
> $G \cong (\mathbb{Z}/8\mathbb{Z})^\times = \{1, 3, 5, 7\} \cong V_4$.
>
> $[\mathbb{Q}(\zeta_8):\mathbb{Q}] = \varphi(8) = 4$. Vì $G \cong V_4$, có 5 subgroups $\rightarrow$ 5 intermediate fields.
>
> Cụ thể: $\mathbb{Q}(\zeta_8) = \mathbb{Q}(i, \sqrt{2})$, các intermediate fields bậc 2 là $\mathbb{Q}(i)$, $\mathbb{Q}(\sqrt{2})$, $\mathbb{Q}(\sqrt{-2})$.

> [!abstract] Theorem 9.12 — Cyclotomic extensions là abelian
> $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$ là abelian. Vậy $\mathbb{Q}(\zeta_n)/\mathbb{Q}$ là **abelian extension** — mọi intermediate field đều Galois over $\mathbb{Q}$.

**Kronecker-Weber Theorem** (sẽ gặp ở Bài 17): *Mọi finite abelian extension của $\mathbb{Q}$ đều là subfield của $\mathbb{Q}(\zeta_n)$ với $n$ đủ lớn.* Đây là đảo chiều của Theorem 9.12.

---

## SageMath Cheatsheet

```sage
K = QQ
Kx.<x> = PolynomialRing(K)

print(cyclotomic_polynomial(7))
print(cyclotomic_polynomial(12))

for n in range(1, 13):
    Phi = cyclotomic_polynomial(n)
    print(f"n={n}: deg={euler_phi(n)}, Phi_n={Phi}")

zeta5 = QQ.extension(cyclotomic_polynomial(5), 'z5')
G = zeta5.galois_group()
print(G.order(), G.structure_description())

from sage.all import CyclotomicField
K = CyclotomicField(8)
print(K.degree())
print(K.galois_group().structure_description())
for H in K.galois_group().subgroups():
    print(H.order(), H.fixed_field()[0].absolute_degree())
```

---

## Summary / Key Takeaways

- $\mu_n$ là cyclic group bậc $n$ (khi $\operatorname{char} \nmid n$).
- $\Phi_n(x)$: product của $(x - \zeta)$ trên primitive $n$-th roots; $\deg \Phi_n = \varphi(n)$.
- $x^n - 1 = \prod_{d \mid n} \Phi_d(x)$ — phân tích thành cyclotomic polynomials.
- $\Phi_n \in \mathbb{Z}[x]$ và **irreducible over $\mathbb{Q}$** (Gauss/Dedekind).
- $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$: $\sigma \leftrightarrow a$ với $\sigma(\zeta_n) = \zeta_n^a$.
- Cyclotomic extensions là **abelian** — mọi intermediate field Galois over $\mathbb{Q}$.
- **Kronecker-Weber**: mọi abelian extension của $\mathbb{Q}$ nằm trong một cyclotomic extension.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §14.5.
- Conrad, K. *Cyclotomic Extensions*. Có tại https://kconrad.math.uconn.edu/blurbs/galoistheory/cyclotomic.pdf
- Milne, J. S. *Fields and Galois Theory*, §§9–10.
- Washington, L. C. *Introduction to Cyclotomic Fields*, Springer.
