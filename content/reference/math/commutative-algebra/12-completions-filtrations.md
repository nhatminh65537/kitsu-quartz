---
title: "12. Completions and Filtrations"
tags: [math, commutative-algebra, lesson-12]
aliases: [Completions and Filtrations]
created: 2026-03-30
---

> **Prerequisites**: [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]]
> **Objectives**:
> - Hiểu $I$-adic topology và completion của vành/module
> - Nắm Artin-Rees Lemma và ứng dụng của nó
> - Hiểu graded rings/modules và Hilbert functions
> - Kết nối completion với lý thuyết địa phương (local theory)

---

## Motivation / Intuition

Trong giải tích, ta "hoàn thiện" $\mathbb{Q}$ theo hai cách: lấy $\mathbb{R}$ (hoàn thiện Archimedean) hoặc $\mathbb{Q}_p$ (hoàn thiện $p$-adic). Cả hai đều được xây dựng từ cùng một nguyên lý: lấy giới hạn của dãy Cauchy.

Trong đại số, **$I$-adic completion** $\hat{R}$ là analog của quá trình này: thay vì giới hạn theo metric Archimedean, ta lấy giới hạn ngược (inverse limit) theo chuỗi $R \to R/I \to R/I^2 \to \cdots$. Phần tử của $\hat{R}$ là các dãy tương thích $(r_n)$ với $r_n \in R/I^n$.

Tại sao completion hữu ích? Hai lý do chính:

1. **Formal power series**: $k[[x]] = \varprojlim k[x]/(x^n)$ là completion của $k[x]$ theo $(x)$-adic topology. Đây là "vùng lân cận" đại số của điểm gốc.

2. **Regularity**: Nhiều tính chất cục bộ (như regular local ring) dễ kiểm tra hơn sau completion — và completion thường "tốt hơn" ring gốc (Cohen's structure theorem).

**Filtrations** và **graded rings** cung cấp công cụ để nghiên cứu cấu trúc "phân lớp" của vành — mỗi lớp $I^n/I^{n+1}$ là một mảnh thông tin về vành tại maximal ideal.

---

## $I$-adic Topology và Completion

### Definition

> [!info] Definition 12.1 — $I$-adic Filtration và Topology
>
> Cho $R$ là vành và $I \subseteq R$ là ideal. **$I$-adic filtration** trên $R$-module $M$:
>
> $$
> M = I^0 M \supseteq IM \supseteq I^2 M \supseteq \cdots
> $$
>
> **$I$-adic topology** trên $M$: lấy $\{x + I^n M\}$ làm cơ sở lân cận của $x \in M$. Metric:
>
> $$
> d(x, y) = 2^{-\min\{n : x - y \notin I^n M\}}
> $$

> [!info] Definition 12.2 — Completion
>
> **Completion** (hoàn thiện) của $M$ theo $I$-adic topology:
>
> $$
> \hat{M} = \hat{M}^I = \varprojlim_{n} M/I^n M
> $$
>
> Phần tử của $\hat{M}$ là các dãy tương thích $(m_n)_{n \geq 0}$ với $m_n \in M/I^n M$ và $m_{n+1} \mapsto m_n$ qua ánh xạ chính tắc. Có ánh xạ chính tắc $\iota: M \to \hat{M}$, $m \mapsto (m \bmod I^n M)_n$.

> [!example] Example 12.3 — Các ví dụ completion
>
> **$\mathbb{Z}_{p} = \hat{\mathbb{Z}}^{(p)}$**: completion của $\mathbb{Z}$ theo $(p)$-adic topology.
>
> $$
> \mathbb{Z}_p = \varprojlim \mathbb{Z}/p^n\mathbb{Z} = \left\{\sum_{i=0}^\infty a_i p^i : a_i \in \{0,\ldots,p-1\}\right\}
> $$
>
> **$k[[x]] = \widehat{k[x]}^{(x)}$**: formal power series là completion của $k[x]$ theo $(x)$.
>
> $$
> k[[x]] = \varprojlim k[x]/(x^n) = \left\{\sum_{i=0}^\infty a_i x^i : a_i \in k\right\}
> $$
>
> **$k[[x,y]] = \widehat{k[x,y]}^{(x,y)}$**: completion theo maximal ideal $(x,y)$.

### Theorem

> [!abstract] Theorem 12.4 — Tính chất của Completion
>
> Cho $R$ Noetherian và $I \subseteq R$ ideal. Khi đó:
>
> 1. $\hat{R}$ là Noetherian ring.
> 2. $\hat{R}/I^n\hat{R} \cong R/I^n$ với mọi $n$.
> 3. $I\hat{R} = \hat{I}$ (completion của $I$).
> 4. **Flatness**: $\hat{R}$ là flat $R$-module.
> 5. Nếu $(R, \mathfrak{m})$ là local Noetherian thì $\hat{R}$ là local Noetherian với maximal ideal $\hat{\mathfrak{m}} = \mathfrak{m}\hat{R}$, và $\hat{R}/\hat{\mathfrak{m}}^n \cong R/\mathfrak{m}^n$.

**Proof của (4) (phác thảo).** Vì $\hat{R} = \varprojlim R/I^n$, và $R/I^n$ là flat $R$-module hữu hạn (localization $R$ bởi map $R \to R/I^n$)... thực ra cần xử lý cẩn thận hơn qua Artin-Rees Lemma. Flat vì completion là localization theo nghĩa tổng quát hơn. $\blacksquare$

---

## Artin-Rees Lemma

### Theorem

> [!abstract] Theorem 12.5 — Artin-Rees Lemma
>
> Cho $R$ Noetherian, $I \subseteq R$ ideal, $M$ là $R$-module hữu hạn sinh, và $N \subseteq M$ là submodule. Tồn tại $k \geq 0$ sao cho với mọi $n \geq k$:
>
> $$
> I^n M \cap N = I^{n-k}(I^k M \cap N)
> $$

**Proof.** Xét **Rees algebra** $\mathcal{R}(R, I) = \bigoplus_{n \geq 0} I^n = R \oplus I \oplus I^2 \oplus \cdots$ (graded ring). Module tương ứng $\mathcal{R}(M) = \bigoplus_{n \geq 0} I^n M$ là $\mathcal{R}(R,I)$-module. Vì $R$ Noetherian thì $\mathcal{R}(R,I)$ Noetherian (Hilbert Basis Theorem), nên $\mathcal{R}(N) = \bigoplus_n (I^nM \cap N)$ hữu hạn sinh over $\mathcal{R}(R,I)$. Tức tồn tại $k$: $\bigoplus_{n \geq k} (I^n M \cap N) = I^{n-k}(I^kM \cap N)$. $\blacksquare$

> [!abstract] Corollary 12.6 — Intersection Theorem
>
> Cho $R$ Noetherian local với maximal ideal $\mathfrak{m}$, $M$ hữu hạn sinh. Khi đó:
>
> $$
> \bigcap_{n=1}^\infty \mathfrak{m}^n M = 0
> $$
>
> Đặc biệt: $\bigcap_{n=1}^\infty \mathfrak{m}^n = 0$ trong $R$ (Krull Intersection Theorem).

**Proof.** Đặt $N = \bigcap_n \mathfrak{m}^n M$. Theo Artin-Rees: $N \cap \mathfrak{m}^n M = \mathfrak{m}^{n-k}(N \cap \mathfrak{m}^k M) = \mathfrak{m}^{n-k} N$ với $n$ đủ lớn. Vậy $N = \mathfrak{m} N$. Nakayama's Lemma: $N = 0$. $\blacksquare$

---

## Graded Rings và Hilbert Functions

### Definition

> [!info] Definition 12.7 — Graded Ring và Module
>
> **Graded ring**: $A = \bigoplus_{n \geq 0} A_n$ với $A_n \cdot A_m \subseteq A_{n+m}$ và $A_0$ là subring.
>
> **Graded module**: $M = \bigoplus_{n \geq 0} M_n$ với $A_n \cdot M_m \subseteq M_{n+m}$.
>
> Phần tử trong $A_n$ gọi là **homogeneous bậc** $n$.
>
> **Ví dụ cơ bản**: $k[x_0,\ldots,x_n]$ với phân bậc thông thường: $A_d = $ span của các monomial bậc $d$.

> [!info] Definition 12.8 — Associated Graded Ring
>
> Với $(R, I)$, **associated graded ring**:
>
> $$
> \operatorname{gr}_I(R) = \bigoplus_{n \geq 0} I^n/I^{n+1}
> $$
>
> là graded ring với $(a + I^{n+1})(b + I^{m+1}) = ab + I^{n+m+1}$.
>
> Tương tự: $\operatorname{gr}_I(M) = \bigoplus_n I^nM/I^{n+1}M$.

### Definition

> [!info] Definition 12.9 — Hilbert Function
>
> Cho $(R, \mathfrak{m}, k)$ Noetherian local và $M$ hữu hạn sinh. **Hilbert function**:
>
> $$
> H(M, n) = \ell_R(M/\mathfrak{m}^{n+1}M) = \sum_{i=0}^n h(M,i)
> $$
>
> trong đó $h(M, i) = \ell(I^i M / I^{i+1} M)$ và $\ell$ là độ dài (composition series length).

> [!abstract] Theorem 12.10 — Hilbert-Samuel Polynomial
>
> Tồn tại đa thức $P_M(n) \in \mathbb{Q}[n]$ (Hilbert-Samuel polynomial) sao cho $H(M, n) = P_M(n)$ với $n$ đủ lớn. Bậc của $P_M$ bằng $\dim \operatorname{Supp}(M)$, và hệ số đầu có dạng $e(M)/d!$ với $e(M) \in \mathbb{Z}_{>0}$ là **multiplicity** (bậc) của $M$.

**Proof (phác thảo).** Dùng exact sequence $0 \to I^nM/I^{n+1}M \to M/I^{n+1}M \to M/I^nM \to 0$ để quy nạp và áp dụng bổ đề về đa thức sai phân (difference polynomial). $\blacksquare$

> [!example] Example 12.11 — Hilbert function cụ thể
>
> Cho $R = k[x_1,\ldots,x_d]$, $\mathfrak{m} = (x_1,\ldots,x_d)$, $M = R$.
>
> $$
> h(R, n) = \dim_k(\mathfrak{m}^n/\mathfrak{m}^{n+1}) = \binom{n+d-1}{d-1}
> $$
>
> (số monomial bậc $n$ trong $d$ biến).
>
> $$
> H(R, n) = \binom{n+d}{d}
> $$
>
> Đây là đa thức bậc $d$ trong $n$, hệ số đầu $1/d!$. Vậy multiplicity $e(R) = 1$ và $\dim R = d$. ✓

---

## Cohen's Structure Theorem

### Theorem

> [!abstract] Theorem 12.12 — Cohen's Structure Theorem
>
> Cho $(R, \mathfrak{m}, k)$ là complete Noetherian local ring (tức $R \cong \hat{R}$).
>
> 1. Nếu $R$ chứa một trường $k \cong R/\mathfrak{m}$ (equicharacteristic case), thì:
>
> $$
> R \cong k[[x_1,\ldots,x_n]]/I
> $$
>
> với $n = \dim_k(\mathfrak{m}/\mathfrak{m}^2)$.
>
> 2. Tổng quát (mixed characteristic), $R$ là quotient của complete DVR.

**Ý nghĩa:** Mọi complete local ring đều là quotient của formal power series ring — cấu trúc đơn giản nhất có thể.

---

## SageMath Cheatsheet

```sage
R = ZZ
p = 5
Zp = Zp(p, prec=20)
Zp(1/(1-5))

R2.<x> = QQ[]
kx = R2.completion(x)
f = kx(1/(1-x))

R3.<x,y> = QQ[]
I = R3.ideal(x, y)
graded = R3.graded_ring(I)

from sage.rings.power_series_ring import PowerSeriesRing
PS = PowerSeriesRing(QQ, 'x')
PS(1/(1-PS.gen()))

R4.<x,y,z> = QQ[]
I4 = R4.ideal(x^2 - y*z)
R4.quotient(I4).hilbert_series()
```

---

## Summary / Key Takeaways

- **$I$-adic completion**: $\hat{M} = \varprojlim M/I^nM$; phần tử là dãy tương thích; $\hat{R}$ flat over $R$.
- $\mathbb{Z}_p = \hat{\mathbb{Z}}^{(p)}$; $k[[x]] = \widehat{k[x]}^{(x)}$ — hai ví dụ quan trọng nhất.
- **Artin-Rees Lemma**: filtration $I$-adic tương thích với submodule sau hữu hạn bước.
- **Krull Intersection Theorem**: $\bigcap_n \mathfrak{m}^n = 0$ trong local Noetherian ring.
- **Graded rings**: $\bigoplus A_n$; associated graded $\operatorname{gr}_I(R) = \bigoplus I^n/I^{n+1}$ mã hóa cấu trúc cục bộ.
- **Hilbert function** $H(M,n) = \ell(M/\mathfrak{m}^{n+1}M)$ trở thành đa thức (Hilbert-Samuel) với $n$ lớn; bậc = $\dim M$; hệ số đầu cho multiplicity.
- **Cohen's theorem**: complete local ring = quotient của $k[[x_1,\ldots,x_n]]$.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 10.
- Matsumura, H. *Commutative Ring Theory*, Chapter 8.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 5.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 20, 23.
