---
title: "10. Discrete Valuation Rings and Dedekind Domains"
tags: [math, commutative-algebra, lesson-10]
aliases: [Discrete Valuation Rings and Dedekind Domains]
created: 2026-03-30
---

> **Prerequisites**: [[07-integral-dependence|07. Integral Dependence]]
> **Objectives**:
> - Hiểu Discrete Valuation Rings (DVRs) và các đặc trưng tương đương
> - Nắm định nghĩa Dedekind domain và chứng minh phân tích nhân tử duy nhất của ideals
> - Hiểu fractional ideals và ideal class group
> - Kết nối với lý thuyết số: vành số nguyên của số trường là Dedekind domain

---

## Motivation / Intuition

Trong $\mathbb{Z}$, mọi số nguyên phân tích được thành tích các lũy thừa nguyên tố duy nhất. Nhưng trong $\mathbb{Z}[\sqrt{-5}]$, ta có:

$$
6 = 2 \cdot 3 = (1 + \sqrt{-5})(1 - \sqrt{-5})
$$

và tất cả bốn thừa số đều bất khả quy — phân tích nhân tử không duy nhất!

Kummer (1847) nhận ra vấn đề và đề xuất "ideal numbers" để phục hồi tính duy nhất. Dedekind (1871) làm điều này chính xác: trong $\mathbb{Z}[\sqrt{-5}]$, **ideal** $(2)$ phân tích thành $(2, 1+\sqrt{-5})^2$, và phân tích nhân tử **của ideals** là duy nhất.

Lớp vành có tính chất này — **Dedekind domains** — chính là nền tảng của lý thuyết số đại số hiện đại. DVRs là "atoms" cục bộ của Dedekind domains: mỗi localization tại prime ideal của Dedekind domain là một DVR.

---

## Discrete Valuation Rings

### Definition

> [!info] Definition 10.1 — Discrete Valuation
>
> Một **discrete valuation** trên trường $K$ là surjection $v: K^\times \to \mathbb{Z}$ thỏa:
>
> 1. $v(xy) = v(x) + v(y)$
> 2. $v(x + y) \geq \min(v(x), v(y))$ (ultrametric inequality)
>
> Quy ước $v(0) = +\infty$. **Valuation ring** tương ứng:
>
> $$
> \mathcal{O}_v = \{x \in K : v(x) \geq 0\}
> $$

> [!example] Example 10.2 — $p$-adic valuation
>
> Với $p$ nguyên tố, valuation $p$-adic trên $\mathbb{Q}$: mọi $q \in \mathbb{Q}^\times$ viết được dưới dạng $q = p^n \cdot \frac{a}{b}$ với $p \nmid a, p \nmid b$; đặt $v_p(q) = n$.
>
> Valuation ring: $\mathcal{O}_{v_p} = \mathbb{Z}_{(p)} = \{a/b \in \mathbb{Q} : p \nmid b\}$ — local ring với maximal ideal $(p)$.

### Definition

> [!info] Definition 10.3 — Discrete Valuation Ring (DVR)
>
> Một **discrete valuation ring** (DVR) là vành $R$ là valuation ring của một discrete valuation $v$ trên $\operatorname{Frac}(R)$.

> [!abstract] Theorem 10.4 — Đặc trưng tương đương của DVR
>
> Cho $R$ là miền nguyên địa phương, không phải trường. Các điều sau tương đương:
>
> 1. $R$ là DVR.
> 2. $R$ là Noetherian, local, và regular (maximal ideal sinh bởi một phần tử).
> 3. $R$ là Noetherian, local, integrally closed, và $\dim R = 1$.
> 4. $R$ là PID (principal ideal domain) local.
> 5. Mọi ideal khác $(0)$ của $R$ là lũy thừa của maximal ideal $\mathfrak{m}$: $\mathfrak{m}^n$ với $n \geq 1$.

**Proof của $(1) \Leftrightarrow (2)$ (phác thảo).** Gọi $\pi \in R$ là phần tử với $v(\pi) = 1$ (uniformizer). Thì $\mathfrak{m} = (\pi)$ (sinh bởi $\pi$), và $\mathfrak{m}^n = (\pi^n)$. Mọi $r \in R \setminus \{0\}$ có dạng $r = u\pi^{v(r)}$ với $u \in R^\times$. Vậy mọi ideal của $R$ có dạng $(\pi^n) = \mathfrak{m}^n$. $\blacksquare$

> [!example] Example 10.5 — Ví dụ DVRs
>
> - $\mathbb{Z}_{(p)}$: DVR với uniformizer $p$, $v = v_p$.
> - $k[[x]]$ (formal power series): DVR với uniformizer $x$, $v(f) = $ bậc thấp nhất của $f$.
> - $k[x]_{(x)}$ (localization của $k[x]$ tại $(x)$): DVR với uniformizer $x$.
> - $\mathcal{O}_{X,P}$ (vành địa phương tại điểm trơn $P$ trên đường cong $X$): DVR.

---

## Dedekind Domains

### Definition

> [!info] Definition 10.6 — Dedekind Domain
>
> Miền nguyên $R$ (không phải trường) gọi là **Dedekind domain** nếu thỏa một trong các điều kiện tương đương sau:
>
> 1. $R$ là Noetherian, integrally closed, và $\dim R = 1$ (mọi prime $\neq (0)$ là maximal).
> 2. Mọi ideal khác $(0)$ của $R$ phân tích được duy nhất thành tích các prime ideals.
> 3. Mọi ideal của $R$ là projective module.
> 4. $R_\mathfrak{m}$ là DVR với mọi maximal ideal $\mathfrak{m}$.

> [!example] Example 10.7 — Các Dedekind domains quan trọng
>
> - $\mathbb{Z}$: Noetherian, integrally closed ($\mathbb{Z}$ là UFD), $\dim = 1$. ✓
> - $\mathcal{O}_K$ (vành số nguyên của number field $K$): Dedekind domain — nền tảng của lý thuyết số đại số.
> - $k[C]$ với $C$ đường cong đại số trơn (smooth affine curve): Dedekind domain.
> - $k[x, y]$: **không** phải Dedekind domain ($\dim = 2 > 1$).

### Theorem

> [!abstract] Theorem 10.8 — Unique Factorization of Ideals
>
> Trong Dedekind domain $R$, mọi ideal khác $(0)$ phân tích được duy nhất (up to thứ tự) thành tích prime ideals:
>
> $$
> \mathfrak{a} = \mathfrak{p}_1^{e_1} \cdots \mathfrak{p}_r^{e_r}, \quad e_i \geq 1
> $$

**Proof (phác thảo).** Bước 1 (tồn tại): Tập các ideals không phân tích được thành prime (nếu không rỗng) có phần tử cực đại $\mathfrak{a}$ theo ACC. Thì $\mathfrak{a}$ nằm trong prime $\mathfrak{p}$, và $\mathfrak{a} = \mathfrak{p} \cdot \mathfrak{p}^{-1}\mathfrak{a}$. Dùng tính chất fractional ideal để chứng minh $\mathfrak{p}^{-1}\mathfrak{a} \supsetneq \mathfrak{a}$, mâu thuẫn với tính cực đại.

Bước 2 (duy nhất): Từ $\mathfrak{p}_1^{e_1} \cdots = \mathfrak{q}_1^{f_1} \cdots$, dùng tính prime của $\mathfrak{p}_i$ và localization tại từng prime. $\blacksquare$

> [!example] Example 10.9 — Phân tích ideal trong $\mathbb{Z}[\sqrt{-5}]$
>
> $R = \mathbb{Z}[\sqrt{-5}]$ là Dedekind domain (vành số nguyên của $\mathbb{Q}(\sqrt{-5})$).
>
> Phân tích ideals:
>
> $$
> (2) = \mathfrak{p}_2^2, \quad \mathfrak{p}_2 = (2, 1+\sqrt{-5})
> $$
>
> $$
> (3) = \mathfrak{p}_3 \cdot \mathfrak{p}_3', \quad \mathfrak{p}_3 = (3, 1+\sqrt{-5}),\; \mathfrak{p}_3' = (3, 1-\sqrt{-5})
> $$
>
> $$
> (6) = \mathfrak{p}_2^2 \cdot \mathfrak{p}_3 \cdot \mathfrak{p}_3'
> $$
>
> Phân tích $6 = 2 \cdot 3 = (1+\sqrt{-5})(1-\sqrt{-5})$ thực ra là:
>
> $$
> (1+\sqrt{-5}) = \mathfrak{p}_2 \cdot \mathfrak{p}_3, \quad (1-\sqrt{-5}) = \mathfrak{p}_2 \cdot \mathfrak{p}_3'
> $$
>
> Tính duy nhất khôi phục ở cấp độ **ideals**, không phải phần tử.

---

## Fractional Ideals và Ideal Class Group

### Definition

> [!info] Definition 10.10 — Fractional Ideal
>
> Cho $R$ Dedekind domain, $K = \operatorname{Frac}(R)$. Một **fractional ideal** là $R$-submodule $\mathfrak{a} \subseteq K$ khác $0$ sao cho tồn tại $d \in R \setminus \{0\}$ với $d\mathfrak{a} \subseteq R$ (tức $d\mathfrak{a}$ là ideal thực sự của $R$).
>
> - Fractional ideal **invertible**: $\mathfrak{a}^{-1} = \{x \in K : x\mathfrak{a} \subseteq R\}$ thỏa $\mathfrak{a} \cdot \mathfrak{a}^{-1} = R$.
> - Trong Dedekind domain, **mọi** fractional ideal đều invertible.
> - Tích $\mathfrak{a} \cdot \mathfrak{b} = \{\sum a_i b_i\}$ cho phép các fractional ideals lập thành nhóm Abel — **nhóm fractional ideals** $\mathcal{I}(R)$.

> [!info] Definition 10.11 — Ideal Class Group
>
> **Ideal class group** (nhóm lớp ideal) của Dedekind domain $R$:
>
> $$
> \operatorname{Cl}(R) = \mathcal{I}(R) / \mathcal{P}(R)
> $$
>
> trong đó $\mathcal{P}(R) = \{(x) : x \in K^\times\}$ là nhóm principal fractional ideals.
>
> $\operatorname{Cl}(R) = 1$ (trivial) $\iff$ $R$ là PID.

> [!example] Example 10.12 — Class group của $\mathbb{Z}[\sqrt{-5}]$
>
> $\operatorname{Cl}(\mathbb{Z}[\sqrt{-5}]) \cong \mathbb{Z}/2\mathbb{Z}$: lớp không tầm thường sinh bởi $\mathfrak{p}_2 = (2, 1+\sqrt{-5})$.
>
> $\mathfrak{p}_2^2 = (2)$ là principal, nên $[\mathfrak{p}_2]$ có bậc $2$ trong $\operatorname{Cl}$.
>
> Đây chính là lý do $\mathbb{Z}[\sqrt{-5}]$ không phải UFD: class group không trivial. Nếu $\operatorname{Cl}(R) = 1$ thì $R$ là UFD, và ngược lại cho Dedekind domains.

### Theorem

> [!abstract] Theorem 10.13 — Dedekind domain là UFD $\iff$ là PID
>
> Với Dedekind domain $R$: $R$ là UFD $\iff$ $R$ là PID $\iff$ $\operatorname{Cl}(R) = 0$.

**Proof.** Mọi PID là UFD (đại số cơ bản). Với UFD là Dedekind domain: mọi prime ideal $\mathfrak{p}$ (bậc 1) chứa một phần tử nguyên tố $p$ (trong UFD), nên $\mathfrak{p} = (p)$ là principal. Vì mọi ideal phân tích thành prime ideals (Dedekind) và mọi prime là principal: mọi ideal là principal. $\blacksquare$

---

## SageMath Cheatsheet

```sage
K.<a> = NumberField(x^2 + 5)
OK = K.ring_of_integers()
OK.is_dedekind_domain()

OK.class_group()

p2 = OK.ideal(2)
p2.factor()

p3 = OK.ideal(3)
p3.factor()

p6 = OK.ideal(6)
p6.factor()

K2.<b> = NumberField(x^2 - 5)
K2.ring_of_integers().class_number()

R = ZZ
p5 = R.ideal(5)
```

---

## Summary / Key Takeaways

- **DVR**: local + Noetherian + $\dim 1$ + integrally closed; uniformizer $\pi$ sinh maximal ideal; mọi ideal là $(\pi^n)$.
- **Dedekind domain**: Noetherian + integrally closed + $\dim 1$; localization tại mỗi prime là DVR.
- **Unique factorization of ideals**: $\mathfrak{a} = \mathfrak{p}_1^{e_1} \cdots \mathfrak{p}_r^{e_r}$ duy nhất — phục hồi "tính nguyên tố" ở cấp độ ideal.
- **Fractional ideals** lập thành nhóm Abel $\mathcal{I}(R)$; group $\operatorname{Cl}(R) = \mathcal{I}(R)/\mathcal{P}(R)$ đo "mức độ không phải PID".
- $\operatorname{Cl}(R) = 0 \iff R$ là PID $\iff R$ là UFD (với Dedekind domains).
- $\mathbb{Z}[\sqrt{-5}]$ không phải UFD vì $\operatorname{Cl} \cong \mathbb{Z}/2\mathbb{Z} \neq 0$.
- Vành số nguyên $\mathcal{O}_K$ của number field luôn là Dedekind domain.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 9.
- Neukirch, J. *Algebraic Number Theory*, Chapter I.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 11.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 24–25.
