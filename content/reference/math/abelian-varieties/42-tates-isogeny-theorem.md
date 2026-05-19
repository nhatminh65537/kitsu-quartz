---
title: "42. Tate's Isogeny Theorem"
type: theory
tags: [math, abelian-varieties, lesson-42]
aliases: [Tate Isogeny Theorem, Tate Conjecture AV]
created: 2026-05-19
---

> **Prerequisites**: [[41-riemann-hypothesis-av|41. Riemann Hypothesis for AV over F_q]], [[21-endomorphisms-on-tate-module|21. Endomorphisms on the Tate Module]], [[14-isogenies-definition|14. Isogenies — Definition and Basic Examples]]
> **Objectives**:
> - Phát biểu chính xác Tate's Isogeny Theorem: $\operatorname{Hom}(A,B) \otimes \mathbb{Z}_\ell \cong \operatorname{Hom}_{\mathbb{Z}_\ell[G]}(T_\ell A, T_\ell B)$
> - Hiểu ý nghĩa: Tate module đủ để phân biệt isogeny classes
> - Nắm hệ quả: $A \sim_\text{isogeny} B \iff f_A = f_B$ (cùng char. poly. của Frobenius)
> - Phác thảo chiến lược chứng minh và điều kiện cần thiết

---

## Motivation / Intuition

Từ Bài 21, ta biết rằng $\ell$-adic Tate module $T_\ell(A) = \varprojlim A[\ell^n]$ cung cấp một "hình ảnh" của $A$ trong thế giới linear algebra: mọi isogeny $f: A \to B$ induces map $T_\ell(f): T_\ell(A) \to T_\ell(B)$, và map $\operatorname{End}(A) \hookrightarrow \operatorname{End}(T_\ell(A))$ là injective.

Câu hỏi sâu hơn: map này có surjective không? Tức là, mọi $\mathbb{Z}_\ell$-linear map $T_\ell(A) \to T_\ell(B)$ có đến từ một isogeny $A \to B$ không?

Câu trả lời là **KHÔNG** nói chung (over number fields, đây là **Tate Conjecture**, vẫn còn mở trong nhiều trường hợp). Nhưng over **finite fields**, câu trả lời là **CÓ** — và đây là **Tate's Isogeny Theorem** (1966), một trong những định lý đẹp nhất trong lý thuyết abelian variety.

Ý nghĩa hình học: trên trường hữu hạn, $T_\ell(A)$ (cùng với Galois action) **xác định hoàn toàn** $A$ trong isogeny class. "Biết" $T_\ell(A)$ là "biết" $A$ up to isogeny.

---

## Galois Action và Tate Module

Trước khi phát biểu định lý, ta nhắc lại vai trò của Galois group trong bức tranh.

### Definition

> [!definition] Definition 42.1 — Galois Action trên Tate Module  
> Cho $A/\mathbb{F}_q$ và $G = \operatorname{Gal}(\overline{\mathbb{F}}_q/\mathbb{F}_q)$. Group $G$ là topological group, được sinh bởi Frobenius $\phi_q: x \mapsto x^q$:
>
> $$
> G = \hat{\mathbb{Z}} = \varprojlim \mathbb{Z}/n\mathbb{Z}
> $$
>
> (với $\phi_q$ tương ứng với $1 \in \hat{\mathbb{Z}}$). Galois action của $G$ lên $T_\ell(A)$:
>
> $$
> \rho_\ell: G \to \operatorname{Aut}_{\mathbb{Z}_\ell}(T_\ell(A))
> $$
>
> được định nghĩa bởi: với $(P_1, P_2, \ldots) \in T_\ell(A) = \varprojlim A[\ell^n](\overline{\mathbb{F}}_q)$ và $\sigma \in G$:
>
> $$
> \sigma \cdot (P_1, P_2, \ldots) = (\sigma(P_1), \sigma(P_2), \ldots)
> $$
>
> Đặc biệt, Frobenius $\phi_q$ tác dụng trên $T_\ell(A)$ đúng bằng $T_\ell(\pi_A)$ (tác dụng của Frobenius endomorphism).

> [!note] Remark 42.2 — Tate Module là Galois Representation  
> $T_\ell(A)$ là một $\mathbb{Z}_\ell$-module free rank $2g$ với $G = \widehat{\mathbb{Z}}$-action. Sau khi tensoring với $\mathbb{Q}_\ell$, ta được $V_\ell(A) = T_\ell(A) \otimes \mathbb{Q}_\ell$, một $2g$-dimensional $\ell$-adic Galois representation.
>
> Vì $G = \widehat{\mathbb{Z}}$ được sinh bởi Frobenius $\phi_q$, toàn bộ Galois action được xác định bởi ma trận $T_\ell(\pi_A) \in M_{2g}(\mathbb{Z}_\ell)$.

---

## Tate's Isogeny Theorem

### Theorem

> [!theorem] Theorem 42.3 — Tate's Isogeny Theorem (Tate, 1966)  
> Cho $A, B$ là hai abelian varieties over $\mathbb{F}_q$, và $\ell \neq p$ là số nguyên tố. Khi đó map tự nhiên:
>
> $$
> \operatorname{Hom}_{\mathbb{F}_q}(A, B) \otimes_{\mathbb{Z}} \mathbb{Z}_\ell \xrightarrow{\sim} \operatorname{Hom}_{\mathbb{Z}_\ell[G]}(T_\ell(A), T_\ell(B))
> $$
>
> là một **đẳng cấu** (isomorphism), với $G = \operatorname{Gal}(\overline{\mathbb{F}}_q/\mathbb{F}_q) = \widehat{\mathbb{Z}}$.
>
> Tương đương, map tự nhiên:
>
> $$
> \operatorname{Hom}_{\mathbb{F}_q}(A,B) \otimes \mathbb{Q}_\ell \xrightarrow{\sim} \operatorname{Hom}_{\mathbb{Q}_\ell[G]}(V_\ell(A), V_\ell(B))
> $$
>
> là đẳng cấu.

**Proof (sketch — ý tưởng chính của Tate).**

**Injectivity** (tương đối dễ — đã biết từ Bài 21): Map $\operatorname{Hom}(A,B) \hookrightarrow \operatorname{Hom}(T_\ell A, T_\ell B)$ injective vì mọi isogeny $f \neq 0$ induces $T_\ell(f) \neq 0$.

**Surjectivity** (phần khó — đây là heart of the theorem): Giả sử $\phi: T_\ell(A) \to T_\ell(B)$ là một $G$-equivariant map. Ta cần tìm $f \in \operatorname{Hom}(A,B) \otimes \mathbb{Q}_\ell$ sao cho $T_\ell(f) = \phi$.

Chiến lược của Tate:

1. **Finiteness Lemma**: Trên $\mathbb{F}_q$, tập các isogeny classes của AV có fixed degree là **hữu hạn**. Điều này không đúng trên số trường vô hạn.

2. **Inverse limit argument**: Với $\phi: T_\ell(A) \to T_\ell(B)$ Galois-equivariant, ta xây dựng một dãy isogenies $f_n: A \to B$ sao cho $T_\ell(f_n)$ converge về $\phi$ modulo $\ell^n$.

3. **Compactness**: Từ finiteness, dãy $f_n$ có convergent subsequence (trong topology phù hợp), giới hạn của nó cho $f: A \to B$ (hoặc sau khi invert $\ell$).

4. **Conclusion**: $T_\ell(f) = \phi$.

Bước (1) là key: nó dùng tính hữu hạn của isomorphism classes of polarized AV over $\mathbb{F}_q$ với bounded degree. Điều này không đúng over $\overline{\mathbb{Q}}$ hay $\mathbb{R}$, đó là lý do Tate conjecture còn khó khăn ở đó. $\blacksquare$

Xem chứng minh đầy đủ: Tate, *Endomorphisms of Abelian Varieties over Finite Fields*, Inventiones Mathematicae (1966). Zarhin, *Homomorphisms of Abelian Varieties over Finite Fields* (version khác không dùng Frobenius).

---

## Hệ Quả: Phân Loại Isogeny Classes

Tate's Isogeny Theorem có một hệ quả cực kỳ quan trọng:

### Corollary

> [!corollary] Corollary 42.4 — Frobenius xác định Isogeny Class  
> Hai abelian varieties $A, B$ over $\mathbb{F}_q$ **isogenous** (với nhau) khi và chỉ khi chúng có cùng characteristic polynomial của Frobenius:
>
> $$
> A \sim_{\text{isogeny}} B \iff P_{\pi_A}(T) = P_{\pi_B}(T)
> $$
>
> Tương đương: $A$ và $B$ isogenous iff $T_\ell(A) \cong T_\ell(B)$ như $\mathbb{Z}_\ell[G]$-modules.

**Proof.**
($\Rightarrow$): Nếu $A \sim B$, tồn tại isogeny $f: A \to B$, nên $T_\ell(f): T_\ell(A) \cong T_\ell(B)$ (iso sau khi tensoring $\mathbb{Q}_\ell$). Vì $T_\ell(\pi_A)$ và $T_\ell(\pi_B)$ là conjugate via $T_\ell(f)$, chúng có cùng characteristic polynomial, tức $P_{\pi_A} = P_{\pi_B}$.

($\Leftarrow$): Nếu $P_{\pi_A} = P_{\pi_B}$, thì $T_\ell(\pi_A)$ và $T_\ell(\pi_B)$ có cùng characteristic polynomial, và vì $G = \widehat{\mathbb{Z}}$ được sinh bởi Frobenius, $T_\ell(A) \cong T_\ell(B)$ như $G$-modules. Theo Tate's theorem, tồn tại $f \in \operatorname{Hom}(A,B) \otimes \mathbb{Q}_\ell$ implementing isomorphism, nên $A \sim B$ (sau khi nhân $\ell^n$ đủ lớn để $f$ là genuine isogeny). $\blacksquare$

> [!note] Remark 42.5 — Ý nghĩa của Corollary  
> Trên $\mathbb{F}_q$, toàn bộ isogeny class của $A$ được xác định bởi **một đa thức** $P_{\pi_A}(T) \in \mathbb{Z}[T]$! Đây là một sự đơn giản hóa phi thường: thay vì phân loại abelian varieties (là các object hình học phức tạp), ta chỉ cần phân loại các đa thức số học thỏa điều kiện Weil.

### Corollary

> [!corollary] Corollary 42.6 — Cấu Trúc Hom(A, B)  
> $\operatorname{Hom}(A, B)$ là một $\mathbb{Z}$-module free của rank hữu hạn, và:
>
> $$
> \operatorname{rank}_\mathbb{Z} \operatorname{Hom}(A,B) = \dim_{\mathbb{Q}_\ell} \operatorname{Hom}_{G}(V_\ell A, V_\ell B)
> $$
>
> Đặc biệt với $A = B$:
>
> $$
> \operatorname{rank}_\mathbb{Z} \operatorname{End}(A) = \dim_{\mathbb{Q}_\ell} \operatorname{End}_G(V_\ell(A))
> $$

### Corollary

> [!corollary] Corollary 42.7 — $A$ isogenous to subvariety of $B$  
> $A$ isogenous với một abelian subvariety của $B$ khi và chỉ khi $P_{\pi_A}$ chia $P_{\pi_B}$ trong $\mathbb{Z}[T]$:
>
> $$
> A \lesssim_{\text{isogeny}} B \iff P_{\pi_A}(T) \mid P_{\pi_B}(T)
> $$

---

## Endomorphism Algebra

Từ Tate's theorem, ta thu được thông tin chính xác về $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes \mathbb{Q}$:

### Theorem

> [!theorem] Theorem 42.8 — Cấu trúc của $\operatorname{End}^0(A)$ over $\mathbb{F}_q$  
> Cho $A$ là **simple** abelian variety over $\mathbb{F}_q$. Khi đó $D = \operatorname{End}^0(A)$ là một **division algebra** (algebra phân bậc) finite-dimensional over $\mathbb{Q}$.
>
> Trung tâm của $D$ là $L = \mathbb{Q}(\pi_A)$ (trường được sinh bởi Frobenius). Đặc biệt:
>
> $$
> [D: \mathbb{Q}] = [D:L]^2 \cdot [L:\mathbb{Q}] \leq (2g)^2
> $$
>
> và $[D:L]$ là số chính phương.
>
> Trường hợp đặc biệt: $A$ là simple và $[L:\mathbb{Q}] = 2g$ (minimum polynomial of $\pi_A$ có bậc $2g$), thì $D = L$ là một trường (tức $D$ commutative), và $\operatorname{rank}_\mathbb{Z}\operatorname{End}(A) = 2g$.

> [!example] Example 42.9 — Elliptic Curve và Endomorphism Algebra  
> Cho $E$ là ordinary elliptic curve over $\mathbb{F}_q$ (với $t \neq 0, t^2 \neq 4q$). Khi đó:
>
> - $\pi_E$ có minimal polynomial $T^2 - tT + q$ (bậc $2 = 2g$).
> - $L = \mathbb{Q}(\pi_E)$ là imaginary quadratic field.
> - $D = \operatorname{End}^0(E) = L$ (commutative!).
> - $\operatorname{End}(E)$ là order trong $L$, chứa $\mathbb{Z}[\pi_E]$.
>
> Đây khác với trường hợp supersingular: nếu $E$ supersingular over $\mathbb{F}_p$, thì $\operatorname{End}^0(E)$ là quaternion algebra over $\mathbb{Q}$ (dimension $4$, không commutative).

---

## Chiến Lược Chứng Minh Tate's Theorem

Ta phác thảo chi tiết hơn ý tưởng của Tate:

> [!note] Remark 42.10 — Finiteness là Key  
> Sự khác biệt then chốt giữa finite fields và infinite fields (như số trường):
>
> **Trên $\mathbb{F}_q$**: Với fixed $A$ và $d$, chỉ có **hữu hạn** many isomorphism classes của abelian variety $B/\mathbb{F}_q$ mà $B$ isogenous với $A$ via isogeny bậc $\leq d$. Điều này là vì số điểm $|B(\mathbb{F}_{q^n})|$ bị xác định bởi char. poly. của Frobenius (finite number of polynomials), và trên một fixed finite field, $B$ với fixed char. poly. là hữu hạn (moduli space).
>
> **Trên $\mathbb{Q}$**: Điều này sai! Tate conjecture over $\mathbb{Q}$ (cho elliptic curves) bằng Faltings' theorem (1983), nhưng chứng minh khác hoàn toàn.

**Chi tiết hơn về Tate's proof (surjectivity):**

Cho $\phi \in \operatorname{Hom}_G(T_\ell A, T_\ell B)$. Ta muốn tìm $f \in \operatorname{Hom}(A,B)$ sao cho $T_\ell(f)$ là $\ell^N$-approximation của $\phi$ cho $N$ đủ lớn.

- Với mỗi $n$, $\phi$ cảm sinh $\phi_n: A[\ell^n] \to B[\ell^n]$ (Galois-equivariant map giữa torsion subgroups).
- Map Galois-equivariant $A[\ell^n] \to B[\ell^n]$ tương ứng với một isogeny (theo lý thuyết group schemes và tính hữu hạn).
- Dãy isogenies $\{f_n\}$ hội tụ nhờ compactness.

---

## Mở rộng: Tate Conjecture over Other Fields

> [!note] Remark 42.11 — Tate Conjecture  
> **Tate Conjecture** phát biểu tổng quát: với abelian variety $A$ over số trường $K$ (finitely generated over prime field):
>
> $$
> \operatorname{Hom}_K(A, B) \otimes \mathbb{Z}_\ell \xrightarrow{?} \operatorname{Hom}_{\text{Gal}(\bar{K}/K)}(T_\ell A, T_\ell B)
> $$
>
> Kết quả biết:
> - $K = \mathbb{F}_q$: ✓ (Tate 1966, chứng minh trong bài này).
> - $K = $ number field: ✓ cho abelian varieties (Faltings 1983, cùng với Mordell Conjecture!).
> - $K = $ function field char. $0$: ✓ (Zarhin 1975, sau đó Faltings).
> - $K = \mathbb{C}$: ✓ trivially (vì $\operatorname{End}(\mathbb{C}^g/\Lambda) \cong \{f\in M_g(\mathbb{C}): f\Lambda\subseteq\Lambda\}$).

---

## SageMath Cheatsheet

```python
# Demonstrating that isogeny class is determined by Frobenius polynomial
# over F_q

# Two non-isogenous elliptic curves over F_101 with different trace
E1 = EllipticCurve(GF(101), [1, 2])   # |E1(F_101)| = 100, trace = 2
E2 = EllipticCurve(GF(101), [3, 7])   # different curve

t1 = E1.trace_of_frobenius()
t2 = E2.trace_of_frobenius()
print(f"E1 trace: {t1}, E2 trace: {t2}")
print(f"E1 and E2 isogenous: {E1.is_isogenous(E2)}")

# Find an isogenous curve
# Two elliptic curves are isogenous iff same #points = same Frobenius poly
# Let's find all curves over F_101 with the same trace as E1

# In Sage, can enumerate j-invariants with given trace
# (This may be slow for large q)
q = 101
t = t1
target_order = q + 1 - t  # 100

count_same_class = 0
for j_inv in GF(101):
    try:
        E_test = EllipticCurve_from_j(j_inv)
        if E_test.order() == target_order:
            count_same_class += 1
    except:
        pass
print(f"Number of j-invariants with |E(F_101)| = {target_order}: {count_same_class}")

# Demonstrate: Hom(A,A) tensor Q_ell = End_G(V_ell)
# For an ordinary EC, End(E) is an order in quadratic field
# rank_Z End(E) = 2 = 2g (by Tate's theorem)
print(f"E1 endomorphism ring base ring: {E1.endomorphism_ring()}")
```

---

## Summary / Key Takeaways

- **Tate's Isogeny Theorem** (1966): $\operatorname{Hom}(A,B) \otimes \mathbb{Z}_\ell \cong \operatorname{Hom}_G(T_\ell A, T_\ell B)$ — over **finite fields** only.
- Key ingredient: **Finiteness** of isogeny classes over $\mathbb{F}_q$ (fails over infinite fields).
- **Injectivity** tương đối dễ (tổng quát cho mọi trường); **surjectivity** là kết quả sâu đặc trưng của $\mathbb{F}_q$.
- Hệ quả: $A \sim B$ iff $P_{\pi_A} = P_{\pi_B}$ (char. poly. của Frobenius xác định isogeny class).
- $P_{\pi_A} \mid P_{\pi_B}$ iff $A$ isogenous với abelian subvariety của $B$.
- Với $A$ simple: $D = \operatorname{End}^0(A)$ là division algebra, trung tâm $= \mathbb{Q}(\pi_A)$.
- **Tate conjecture** over number fields được Faltings chứng minh (1983, cùng Mordell Conjecture).
- Tate's theorem là nền tảng cho Honda-Tate theory (Bài 43).

---

## References

- Tate, J. "Endomorphisms of Abelian Varieties over Finite Fields." *Inventiones Mathematicae* **2** (1966), 134–144.
- Zarhin, Y.G. "Homomorphisms of Abelian Varieties over Finite Fields." arxiv.org/pdf/0711.1615
- Oort, F. "Abelian Varieties over Finite Fields." §5 (Tate's structure theorem). math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Dembélé, L. "Abelian Varieties over Finite Fields: Honda-Tate's Theorem." §2.3. swc-math.github.io/aws/2024/PAWSDembele/2023PAWSDembeleNotes.pdf
- Milne, J.S. *Abelian Varieties*, §12 (Tate's Theorem). jmilne.org/math.
- Faltings, G. "Endlichkeitssätze für abelsche Varietäten über Zahlkörpern." *Inventiones Mathematicae* **73** (1983), 349–366. (Proof over number fields.)
- Gao, A. "Tate Conjecture and Finiteness of Abelian Varieties over Finite Field." arxiv.org/pdf/1808.04783
