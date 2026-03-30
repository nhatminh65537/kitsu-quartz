---
title: "12. Exact Functors and Hom/Tensor"
tags: [math, algebra-foundations, lesson-12]
aliases: [Hom and Tensor, Exact Functors]
created: 2026-03-28
---

> **Prerequisites**: [[09-modules-definitions|09. Modules: Definitions and Basic Constructions]] — $\operatorname{Hom}_R(M,N)$, exact sequence, free module. [[11-projective-injective-flat|11. Projective, Injective, and Flat Modules]] — projective, injective, flat, left/right exactness.
> **Objectives**:
> - Xây dựng tensor product $M \otimes_R N$ qua universal property
> - Chứng minh $\operatorname{Hom}_R(M,-)$ left exact và $- \otimes_R N$ right exact
> - Phát biểu và chứng minh Hom–Tensor Adjunction
> - Tính toán tensor product trong các ví dụ cụ thể
> - Hiểu base change và scalar extension qua tensor product

---

## Motivation / Intuition

Hai functor quan trọng nhất trong Module Theory là $\operatorname{Hom}_R(M, -)$ và $- \otimes_R N$. Chúng xuất hiện ở khắp nơi:

- $\operatorname{Hom}_R(M, N)$: không gian các "phép đo" module $M$ bằng $N$ — tổng quát hóa không gian dual.
- $M \otimes_R N$: "tích" hai modules theo cách phổ quát — tổng quát hóa tensor product của vector spaces, và cho phép **base change**: từ $R$-module sang $S$-module qua ring homomorphism $R \to S$.

Điều quan trọng nhất không phải là bản thân các functor, mà là **chúng không exact**: $\operatorname{Hom}$ chỉ left exact, còn $\otimes$ chỉ right exact. Sự thất bại exactness này đo bằng các **derived functors** $\operatorname{Ext}$ và $\operatorname{Tor}$ — trọng tâm của Bài 13.

**Hom–Tensor Adjunction** là mối quan hệ sâu sắc nhất giữa hai functor này: $\operatorname{Hom}_R(M \otimes_R N, L) \cong \operatorname{Hom}_R(M, \operatorname{Hom}_R(N, L))$. Đây là ví dụ nguyên mẫu của **adjoint functors** — một trong những khái niệm trung tâm của Category Theory.

---

## Tensor Product

### Xây dựng qua Universal Property

> [!definition] Definition 12.1 — Tensor Product
> Cho $M$ là right $R$-module và $N$ là left $R$-module (trong trường hợp $R$ commutative, mọi module vừa là left vừa là right). **Tensor product** $M \otimes_R N$ là $\mathbb{Z}$-module (hay $R$-module nếu $R$ commutative) thỏa **universal property**:
>
> Tồn tại bilinear map (trên $R$) $\otimes : M \times N \to M \otimes_R N$, $(m, n) \mapsto m \otimes n$, sao cho với mọi $\mathbb{Z}$-module $L$ và mọi $R$-bilinear map $f : M \times N \to L$, tồn tại duy nhất $\bar{f} : M \otimes_R N \to L$ với $\bar{f}(m \otimes n) = f(m, n)$.

> [!definition] Definition 12.2 — Xây dựng tường minh
> Đặt $F$ là free $\mathbb{Z}$-module với basis $M \times N$. Đặt $K$ là submodule của $F$ sinh bởi tất cả các phần tử dạng:
>
> - $(m + m', n) - (m, n) - (m', n)$
> - $(m, n + n') - (m, n) - (m, n')$
> - $(mr, n) - (m, rn)$
>
> Khi đó $M \otimes_R N = F/K$, và $m \otimes n$ là lớp tương đương của $(m, n)$.

> [!note] Remark 12.3 — Simple tensors vs general tensors
> Mọi phần tử của $M \otimes_R N$ là tổng hữu hạn của **simple tensors** (tensors đơn giản) $m \otimes n$, nhưng không phải mọi phần tử đều là simple tensor. Ví dụ: trong $\mathbb{R}^2 \otimes_\mathbb{R} \mathbb{R}^2$, phần tử $e_1 \otimes e_2 + e_2 \otimes e_1$ không viết được dạng $v \otimes w$.

### Các tính chất của Tensor Product

> [!theorem] Theorem 12.4 — Tính chất cơ bản
> Với $R$ commutative và $M, N, L$ là $R$-modules:
>
> 1. $M \otimes_R N \cong N \otimes_R M$ (giao hoán, qua $m \otimes n \mapsto n \otimes m$).
> 2. $(M \otimes_R N) \otimes_R L \cong M \otimes_R (N \otimes_R L)$ (kết hợp).
> 3. $R \otimes_R M \cong M$ (qua $r \otimes m \mapsto rm$).
> 4. $\left(\bigoplus_{i \in I} M_i\right) \otimes_R N \cong \bigoplus_{i \in I} (M_i \otimes_R N)$ (phân phối với direct sum).
> 5. $R^n \otimes_R M \cong M^n$.

**Proof của (4).**
Xét bilinear map $\left(\bigoplus M_i\right) \times N \to \bigoplus (M_i \otimes N)$ bởi $((m_i), n) \mapsto (m_i \otimes n)$. Universal property cho linear map $\bigoplus M_i \otimes N \to \bigoplus (M_i \otimes N)$. Ngược lại, inclusion $M_i \hookrightarrow \bigoplus M_i$ cho $M_i \otimes N \to \bigoplus M_j \otimes N$, cộng lại cho nghịch đảo. $\blacksquare$

### Tính toán Tensor Product

> [!example] Example 12.5 — Các tensor products cơ bản
> **(a)** $\mathbb{Z}/m\mathbb{Z} \otimes_\mathbb{Z} \mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}/\gcd(m,n)\mathbb{Z}$.
>
> *Proof:* $\mathbb{Z}/m\mathbb{Z} = \mathbb{Z}/(m)$. Dùng tính chất $M/IM \cong M \otimes_R R/I$ (Theorem 12.7 dưới):
>
> $$
> \mathbb{Z}/m\mathbb{Z} \otimes_\mathbb{Z} \mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}/n\mathbb{Z} / (m \cdot \mathbb{Z}/n\mathbb{Z}) = \mathbb{Z}/n\mathbb{Z} / (m\mathbb{Z}/n\mathbb{Z})
> $$
>
> Nhóm thương $\mathbb{Z}/n\mathbb{Z}$ theo subgroup sinh bởi $m$ (tức $m\mathbb{Z}/n\mathbb{Z}$) là $\mathbb{Z}/\gcd(m,n)\mathbb{Z}$.
>
> **(b)** $\mathbb{Q} \otimes_\mathbb{Z} \mathbb{Z}/n\mathbb{Z} = 0$.
>
> *Proof:* Với $\frac{p}{q} \otimes \bar{k}$: viết $\frac{p}{q} = \frac{pn}{qn}$, thì $\frac{pn}{qn} \otimes \bar{k} = \frac{p}{q} \otimes n\bar{k} = \frac{p}{q} \otimes 0 = 0$.
>
> **(c)** $\mathbb{Q} \otimes_\mathbb{Z} \mathbb{Q} \cong \mathbb{Q}$.
>
> *Proof:* Ánh xạ $\frac{p}{q} \otimes \frac{r}{s} \mapsto \frac{pr}{qs}$ là isomorphism (bilinear, well-defined, song ánh).

> [!theorem] Theorem 12.6 — Tensor với Quotient
> Cho $I \trianglelefteq R$ và $M$ là $R$-module. Khi đó:
>
> $$
> M \otimes_R R/I \cong M/IM
> $$
>
> qua isomorphism $m \otimes (r + I) \mapsto rm + IM$.

**Proof.**
Xét surjection $M \to M/IM$, $m \mapsto m + IM$. Bilinear map $M \times R/I \to M/IM$, $(m, r+I) \mapsto rm + IM$ cho linear map $M \otimes R/I \to M/IM$. Ngược lại, $M/IM \to M \otimes R/I$, $m + IM \mapsto m \otimes 1$ well-defined vì $m' \in IM \Rightarrow m' = \sum a_i m_i$ ($a_i \in I$) $\Rightarrow m' \otimes 1 = \sum m_i \otimes a_i = \sum m_i \otimes 0 = 0$. Hai map ngược nhau. $\blacksquare$

---

## Exactness của Hom và Tensor

### $\operatorname{Hom}_R(M, -)$ là Left Exact

> [!theorem] Theorem 12.7 — Left Exactness của $\operatorname{Hom}_R(M,-)$
> Cho exact sequence $0 \to L \xrightarrow{f} N \xrightarrow{g} P$ (không cần $g$ toàn ánh). Khi đó dãy sau exact:
>
> $$
> 0 \to \operatorname{Hom}_R(M, L) \xrightarrow{f_*} \operatorname{Hom}_R(M, N) \xrightarrow{g_*} \operatorname{Hom}_R(M, P)
> $$
>
> với $f_*(\varphi) = f \circ \varphi$ và $g_*(\psi) = g \circ \psi$.

**Proof.**
*Exactness tại $\operatorname{Hom}(M,L)$:* $f_*(\varphi) = 0 \Rightarrow f \circ \varphi = 0 \Rightarrow \varphi = 0$ (vì $f$ đơn ánh). Vậy $f_*$ đơn ánh.

*Exactness tại $\operatorname{Hom}(M,N)$:* Rõ ràng $g_* \circ f_* = 0$ (vì $g \circ f = 0$). Nếu $g_*(\psi) = g \circ \psi = 0$, thì $\operatorname{Im} \psi \subseteq \ker g = \operatorname{Im} f$. Vì $f$ đơn ánh, $f^{-1}$ xác định trên $\operatorname{Im} f$, đặt $\varphi = f^{-1} \circ \psi : M \to L$. Thì $f_*(\varphi) = \psi$. $\blacksquare$

> [!warning] Counterexample 12.8 — $\operatorname{Hom}(M,-)$ không Right Exact
> Exact sequence $0 \to \mathbb{Z} \xrightarrow{\times 2} \mathbb{Z} \to \mathbb{Z}/2\mathbb{Z} \to 0$ với $M = \mathbb{Z}/2\mathbb{Z}$ cho:
>
> $$
> 0 \to \operatorname{Hom}(\mathbb{Z}/2, \mathbb{Z}) \to \operatorname{Hom}(\mathbb{Z}/2, \mathbb{Z}) \to \operatorname{Hom}(\mathbb{Z}/2, \mathbb{Z}/2) \to ?
> $$
>
> Vì $\operatorname{Hom}(\mathbb{Z}/2\mathbb{Z}, \mathbb{Z}) = 0$ (không có homomorphism $\mathbb{Z}/2 \to \mathbb{Z}$ khác $0$) và $\operatorname{Hom}(\mathbb{Z}/2\mathbb{Z}, \mathbb{Z}/2\mathbb{Z}) \cong \mathbb{Z}/2\mathbb{Z}$, dãy trở thành $0 \to 0 \to \mathbb{Z}/2\mathbb{Z} \to ?$. Nếu right exact, $?$ sẽ cần là $0$, nhưng $\mathbb{Z}/2\mathbb{Z} \neq 0$. Sự thất bại này được đo bởi $\operatorname{Ext}^1(\mathbb{Z}/2\mathbb{Z}, \mathbb{Z}) \cong \mathbb{Z}/2\mathbb{Z}$.

### $\operatorname{Hom}_R(-, N)$ là Left Exact (Contravariant)

> [!theorem] Theorem 12.9 — Left Exactness của $\operatorname{Hom}_R(-,N)$
> Cho exact sequence $L \xrightarrow{f} M \xrightarrow{g} P \to 0$. Khi đó dãy sau exact:
>
> $$
> 0 \to \operatorname{Hom}_R(P, N) \xrightarrow{g^*} \operatorname{Hom}_R(M, N) \xrightarrow{f^*} \operatorname{Hom}_R(L, N)
> $$
>
> với $g^*(\psi) = \psi \circ g$ và $f^*(\varphi) = \varphi \circ f$.

Proof tương tự Theorem 12.7 (đảo mũi tên). $\blacksquare$

### $- \otimes_R N$ là Right Exact

> [!theorem] Theorem 12.10 — Right Exactness của $- \otimes_R N$
> Cho exact sequence $L \xrightarrow{f} M \xrightarrow{g} P \to 0$. Khi đó dãy sau exact:
>
> $$
> L \otimes_R N \xrightarrow{f \otimes \operatorname{id}} M \otimes_R N \xrightarrow{g \otimes \operatorname{id}} P \otimes_R N \to 0
> $$

**Proof.**
*$g \otimes \operatorname{id}$ toàn ánh:* Mọi generator $p \otimes n$ của $P \otimes N$ viết $g(m) = p$ với $m \in M$, nên $p \otimes n = g(m) \otimes n = (g \otimes \operatorname{id})(m \otimes n)$.

*Exactness tại $M \otimes N$:* $(g \otimes \operatorname{id}) \circ (f \otimes \operatorname{id}) = (g \circ f) \otimes \operatorname{id} = 0$. Ngược lại, nếu $z = \sum m_i \otimes n_i \in \ker(g \otimes \operatorname{id})$, viết $P \otimes N \cong M \otimes N / \ker(g \otimes \operatorname{id})$ và dùng tính toán trong $M \otimes N / \operatorname{Im}(f \otimes \operatorname{id})$. $\blacksquare$

> [!warning] Counterexample 12.11 — $\otimes$ không Left Exact
> Exact sequence $0 \to \mathbb{Z} \xrightarrow{\times 2} \mathbb{Z} \to \mathbb{Z}/2\mathbb{Z} \to 0$ tensor với $\mathbb{Z}/2\mathbb{Z}$:
>
> $$
> \mathbb{Z}/2\mathbb{Z} \xrightarrow{\times 2} \mathbb{Z}/2\mathbb{Z} \to \mathbb{Z}/2\mathbb{Z} \otimes \mathbb{Z}/2\mathbb{Z} \to 0
> $$
>
> Map đầu tiên là nhân với $2 = 0$ trong $\mathbb{Z}/2\mathbb{Z}$ — tức là $0$. Vậy dãy bắt đầu bằng $0 \to \mathbb{Z}/2\mathbb{Z} \xrightarrow{0} \mathbb{Z}/2\mathbb{Z}$, không exact tại vị trí thứ nhất. Sự thất bại này được đo bởi $\operatorname{Tor}_1(\mathbb{Z}/2, \mathbb{Z}/2) \cong \mathbb{Z}/2\mathbb{Z}$.

---

## Hom–Tensor Adjunction

> [!theorem] Theorem 12.12 — Hom–Tensor Adjunction
> Cho $M$, $N$, $L$ là $R$-modules. Có isomorphism tự nhiên (natural):
>
> $$
> \operatorname{Hom}_R(M \otimes_R N,\, L) \cong \operatorname{Hom}_R\!\left(M,\, \operatorname{Hom}_R(N, L)\right)
> $$
>
> cho bởi: $f \mapsto [m \mapsto [n \mapsto f(m \otimes n)]]$.

**Proof.**
Định nghĩa $\Phi : \operatorname{Hom}(M \otimes N, L) \to \operatorname{Hom}(M, \operatorname{Hom}(N,L))$ bởi $\Phi(f)(m)(n) = f(m \otimes n)$.

*Well-defined:* $\Phi(f)(m)$ là $R$-linear vì $f$ linear và $m \otimes -$ bilinear. $\Phi(f)$ là $R$-linear vì $f$ linear và $- \otimes n$ bilinear.

Định nghĩa $\Psi : \operatorname{Hom}(M, \operatorname{Hom}(N,L)) \to \operatorname{Hom}(M \otimes N, L)$ bởi $\Psi(g)(m \otimes n) = g(m)(n)$.

*Well-defined:* $\Psi(g)$ xác định trên simple tensors và mở rộng tuyến tính; bilinear map $(m,n) \mapsto g(m)(n)$ cảm sinh map trên $M \otimes N$ qua universal property.

$\Phi$ và $\Psi$ ngược nhau: $\Psi(\Phi(f))(m \otimes n) = \Phi(f)(m)(n) = f(m \otimes n)$. $\blacksquare$

> [!note] Remark 12.13 — Ý nghĩa của Adjunction
> Hom–Tensor Adjunction nói rằng $M \otimes_R -$ và $\operatorname{Hom}_R(M, -)$ là **adjoint functors**: tensor là left adjoint của Hom, và Hom là right adjoint của tensor.
>
> Hệ quả: vì left adjoint bảo toàn colimits (trong đó có cokernels), $\otimes$ là right exact. Vì right adjoint bảo toàn limits (trong đó có kernels), $\operatorname{Hom}$ là left exact.

---

## Base Change và Scalar Extension

> [!definition] Definition 12.14 — Base Change (Scalar Extension)
> Cho $\varphi : R \to S$ là ring homomorphism và $M$ là $R$-module. **Scalar extension** (mở rộng vô hướng) của $M$ sang $S$ là $S$-module:
>
> $$
> M_S = S \otimes_R M
> $$
>
> với scalar multiplication $s' \cdot (s \otimes m) = (s's) \otimes m$.

> [!example] Example 12.15 — Các ví dụ base change
> **(a)** $M = \mathbb{Z}^n$, $R \to S$ là $\mathbb{Z} \hookrightarrow \mathbb{Q}$:
>
> $$
> \mathbb{Q} \otimes_\mathbb{Z} \mathbb{Z}^n \cong \mathbb{Q}^n
> $$
>
> Base change "rationalize" module — đây là cách xây dựng không gian vector từ lattice.
>
> **(b)** $\mathbb{Q} \otimes_\mathbb{Z} \mathbb{Z}/n\mathbb{Z} = 0$ — torsion biến mất sau base change sang $\mathbb{Q}$.
>
> **(c)** $\mathbb{C} \otimes_\mathbb{R} \mathbb{R}[x]/(x^2+1) \cong \mathbb{C}[x]/(x^2+1) \cong \mathbb{C}[x]/(x+i) \oplus \mathbb{C}[x]/(x-i) \cong \mathbb{C} \oplus \mathbb{C}$.
>
> Extension bất khả quy trên $\mathbb{R}$ trở thành khả quy trên $\mathbb{C}$ — đây là cơ sở của lý thuyết representation.

> [!theorem] Theorem 12.16 — Base Change và Localization
> Cho $S = S^{-1}R$ (localization). Khi đó với mọi $R$-module $M$:
>
> $$
> S^{-1}R \otimes_R M \cong S^{-1}M
> $$
>
> Localization của module tương đương với tensor product với localization của ring.

---

## Tensor Product của Ring Extensions

> [!example] Example 12.17 — Tensor product của field extensions
> Cho $K/F$ và $L/F$ là hai field extensions. Tensor product $K \otimes_F L$ là một $F$-algebra (không nhất thiết là field hay domain).
>
> - $\mathbb{Q}(\sqrt{2}) \otimes_\mathbb{Q} \mathbb{Q}(\sqrt{2}) \cong \mathbb{Q}(\sqrt{2}) \times \mathbb{Q}(\sqrt{2})$ (qua CRT, vì $x^2 - 2 = (x-\sqrt{2})(x+\sqrt{2})$ splits trên $\mathbb{Q}(\sqrt{2})$).
> - $\mathbb{Q}(\sqrt[3]{2}) \otimes_\mathbb{Q} \mathbb{Q}(\omega) \cong \mathbb{Q}(\sqrt[3]{2}, \omega)$ nếu $[\mathbb{Q}(\sqrt[3]{2}, \omega) : \mathbb{Q}] = 6$ (tích trực tiếp không xảy ra vì extension không split hoàn toàn).
> - Tổng quát: $K \otimes_F L$ là field $\iff$ $K/F$ và $L/F$ "linearly disjoint" theo nghĩa tensor product vẫn là domain.

---

## SageMath Cheatsheet

```python
M = ZZ^2
N = ZZ.quotient(6).as_module(ZZ)

M = QQ^2
N = QQ^3
T = M.tensor_product(N)
print(T)
print(T.rank())

R = ZZ
M = R.quotient(6)
N = R.quotient(4)
T = M.tensor_product(N)
print(T.invariants())

K.<a> = QQ.extension(x^2 - 2)
L = K.tensor_product(K)
print(L)

R.<x> = QQ[]
M = R.quotient(x^2 - 1)
N = R.quotient(x - 1)
T = M.tensor_product(N)
print(T)
```

---

## Summary / Key Takeaways

- **Tensor product** $M \otimes_R N$: universal $R$-bilinear map; xây dựng qua free module quotient by bilinear relations.
- Tính chất: giao hoán, kết hợp, $R \otimes M \cong M$, phân phối với $\oplus$; $M \otimes R/I \cong M/IM$.
- **$\operatorname{Hom}_R(M,-)$ left exact** và **$-\otimes_R N$ right exact** — hai nửa của exactness; sự thất bại đo bởi $\operatorname{Ext}$ và $\operatorname{Tor}$.
- **Hom–Tensor Adjunction**: $\operatorname{Hom}(M\otimes N, L) \cong \operatorname{Hom}(M, \operatorname{Hom}(N,L))$ — tensor là left adjoint của Hom.
- **Base change** $S \otimes_R M$: mở rộng vô hướng sang ring mới; localization $S^{-1}M \cong S^{-1}R \otimes_R M$.
- Tính toán: $\mathbb{Z}/m \otimes \mathbb{Z}/n \cong \mathbb{Z}/\gcd(m,n)$; $\mathbb{Q} \otimes \mathbb{Z}/n = 0$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 10 §§4–5.
- Atiyah, M. F., & MacDonald, I. G. *Introduction to Commutative Algebra*, Chapter 2.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter XVI.
- Rotman, J. J. *Advanced Modern Algebra* (3rd ed.), Chapter 8.
- Weibel, C. A. *An Introduction to Homological Algebra*, Chapter 2.
