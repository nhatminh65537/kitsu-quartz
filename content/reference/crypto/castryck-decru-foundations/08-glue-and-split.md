---
title: "08. Glue and Split"
type: deep-dive
tags: [crypto, isogeny, glue-split, lesson-08]
aliases: [Glue and Split]
created: 2026-04-09
---

> **Prerequisites**: [[07-richelot-isogenies|07. Richelot Isogenies — the (2,2)-Construction]]
> **Lesson type**: Deep Dive
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_1, E_2$ | Elliptic curves trên $\mathbb{F}_{p^2}$ |
> | $A = E_1 \times E_2$ | Abelian surface split |
> | $K \subset A[2]$ | Maximal isotropic subgroup, $|K| = 4$ |
> | $\phi: A \to A/K$ | $(2,2)$-isogeny |
> | $A/K$ | Quotient PPAS — hoặc split hoặc Jacobian |
> | $\text{Jac}(C)$ | Jacobian của genus-2 curve $C$ |
> | $\pi_1, \pi_2$ | Projections $E_1 \times E_2 \to E_i$ |

---

## Glue-and-Split: Trái Tim của Attack

"Glue-and-split" là tên của mechanism trung tâm trong Castryck-Decru attack. Ý tưởng là:

1. **Glue**: Từ domain $E_1 \times E_2$ (split), xây dựng $(2,2)$-isogeny $\phi: E_1 \times E_2 \to A'$ bằng cách chọn kernel $K$ phù hợp với secret.
2. **Split test**: Kiểm tra xem $A' \cong E_1' \times E_2'$ (split) hay $A' \cong \text{Jac}(C')$ (Jacobian).
3. **Kết quả**: Nếu split → đã recover một digit của Bob's key. Nếu Jacobian → đoán sai, thử digit khác.

Lesson này làm rõ cơ chế này chi tiết.

---

## Ba Trường Hợp của $(2,2)$-Isogeny từ $E_1 \times E_2$

Với $(2,2)$-isogeny $\phi: E_1 \times E_2 \to A'$, có ba trường hợp:

> [!info] Phân Loại Output
>
> **Trường hợp 1 — Split thành tích của hai elliptic curves**:
> $A' \cong E_1' \times E_2'$. Xảy ra khi kernel $K$ có dạng "diagonal" đặc biệt liên quan đến secret isogeny.
>
> **Trường hợp 2 — Jacobian không tách được**:
> $A' \cong \text{Jac}(C')$. Xảy ra khi kernel $K$ "random" hay không align với secret.
>
> **Trường hợp 3 — Degenerate**:
> $A' \cong E' \times E'$ (self-product). Xảy ra trong các trường hợp đặc biệt với extra endomorphisms.

---

## Kernel Structure và Kiểm Tra Split

Kernel $K \subset (E_1 \times E_2)[2]$ là subgroup order 4, được sinh bởi hai điểm:

$$
K = \langle T_1, T_2 \rangle, \quad T_1 = (P_1, Q_1), \quad T_2 = (P_2, Q_2)
$$

với $P_i \in E_1[2]$, $Q_i \in E_2[2]$.

**Điều kiện isotropic**: $e_2(T_1, T_2) = e_2^{E_1}(P_1, P_2) \cdot e_2^{E_2}(Q_1, Q_2) = 1$.

**Split condition**: $A/K \cong E_1' \times E_2'$ (split) khi và chỉ khi kernel $K$ có một structure đặc biệt — được mô tả bởi **Kani's theorem** (Lesson 10). Heuristically: $K$ phải "align" với các isogenies $\psi_i: E_i \to E_i'$ sao cho $K = \ker(\psi_1 \times \psi_2)$ factored qua product.

---

## Gluing: Chi Tiết Tính Toán

"Gluing" $E_1 \times E_2$ thành $\text{Jac}(C')$:

**Bước 1**: Chọn kernel $K = \langle T_1, T_2 \rangle \subset (E_1 \times E_2)[2]$, isotropic.

**Bước 2**: Xây dựng $(2,2)$-isogeny $\phi: E_1 \times E_2 \to \text{Jac}(C')$.

**Bước 3**: Curve $C'$ có thể được recover từ theta constants của $\text{Jac}(C')$.

Kỹ thuật explicit: qua **theta coordinates** (Appendix A0). Ở mức độ ý tưởng: giống như Richelot từ Lesson 07, nhưng domain bây giờ là split surface thay vì Jacobian.

---

## Split Test: Làm Thế Nào Kiểm Tra?

Sau khi tính $A' = A/K$, làm sao biết $A'$ split hay không?

> [!note] Split Criterion 8.1
> PPAS $A'$ split thành $E_1' \times E_2'$ khi và chỉ khi tồn tại một **non-trivial degree-1 homomorphism** $A' \to E'$ cho một elliptic curve $E'$, tức là $\text{Hom}(A', E') \neq 0$.

Trong practice, test split qua:

**Phương pháp 1 — Theta constants**: Tính theta constants của $A'$. Nếu một số theta constant nhất định bằng 0, $A'$ split.

**Phương pháp 2 — Weil pairing**: Kiểm tra cấu trúc Weil pairing trên $A'[2]$. Nếu có non-trivial decomposition thành hai sub-pairings, $A'$ split.

**Phương pháp trong implementation**: Trong code của Castryck-Decru (SageMath), split được detect bằng cách kiểm tra xem Jacobian của $A'$ có một **isotropic kernel** 2-torsion khác không — nếu có, tách ra hai elliptic curves.

---

## Splitting: Recovering $E_1'$ và $E_2'$

Khi đã biết $A' \cong E_1' \times E_2'$, làm sao recover $E_1'$ và $E_2'$ explicitly?

> [!note] Algorithm 8.2 — Recovery of Split Factors
>
> 1. Tính j-invariants $j_1, j_2$ từ theta constants của $A'$ (khi $A'$ known qua theta):
>
> $$
> j_i = j(E_i') = \text{function of theta constants}
> $$
>
> 2. Từ $j$-invariants, recover equations của $E_1'$ và $E_2'$.
> 3. Verify: check $|E_i'(\mathbb{F}_{p^2})| = p^2 + 1 \pm 2p$ (supersingular condition).

---

## Liên Kết với SIDH

Trong SIDH, Bob's secret isogeny là $\psi_B: E_0 \to E_B$ degree $3^{e_B}$. Attack xây dựng một $(2^{e_B}, 2^{e_B})$-isogeny $\Phi: E_0 \times E_0 \to A'$ sao cho nếu kernel được chọn đúng (dựa trên secret), $A'$ split thành $E_0 \times E_B$ (hay isomorphic variant). Đây chính xác là glue-and-split: ta "glue" $E_0 \times E_0$ qua một chain dài, và "split" khi đã recover secret.

---

## Complexity của Glue-and-Split

**Chi phí mỗi bước**: Một $(2,2)$-isogeny step tốn $O(\log p)$ field operations trong $\mathbb{F}_{p^2}$.

**Tổng chain**: Cần $e_B$ bước để recover toàn bộ Bob's secret. Với SIKE parameters: $e_B \approx 240$, mỗi bước $O(\log p)$ → tổng $O(e_B \log p) = \text{poly}(\log p)$.

Đây là lý do attack là **polynomial time** thay vì exponential.

---

## Ví dụ Nhỏ: SIKEp64

Với baby parameters $p = 2^{33} \cdot 3^{19} - 1$:
- $E_0: y^2 = x^3 + 6x^2 + x$ trên $\mathbb{F}_{p^2}$
- Bob's secret degree $3^{19}$
- Chain length $e_B = 19$ bước $(2,2)$-isogeny
- Attack runtime: < 10 giây trên laptop

---

## Summary

- **Glue**: $(2,2)$-isogeny $E_1 \times E_2 \to A'$, chọn kernel từ 2-torsion.
- **Split test**: $A'$ split ($E_1' \times E_2'$) hay Jacobian ($\text{Jac}(C')$)?
- **Split case**: recover $E_1', E_2'$ từ theta constants — đây là "đoán đúng" trong attack.
- **Jacobian case**: "đoán sai", thử digit khác của Bob's secret.
- Toàn bộ attack là chain glue-and-split steps — polynomial time.
- Split detection: qua theta constants hoặc Weil pairing structure.

---

## References

- Castryck & Decru — ePrint 2022/975, §4 (glue-and-split mechanism)
- Oudompheng & Pope — ePrint 2022/1283 (implementation details, split detection)
- Cosset & Robert — *Computing $(ℓ,ℓ)$-isogenies...*, §5 (splitting criterion)
- Galbraith — *Kani for beginners* (ellipticnews.wordpress.com, 2022) (high-level intuition)
