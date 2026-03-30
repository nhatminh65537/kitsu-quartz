---
title: "A1. Proof of Tychonoff's Theorem"
tags: [math, point-set-topology, appendix]
aliases: [Proof of Tychonoff Theorem]
created: 2026-03-30
---

> **Liên quan**: [[12-tychonoff-stone-cech|12. Tychonoff's Theorem & Stone-Čech Compactification]]
> Hai chứng minh đầy đủ Tychonoff's Theorem: qua Alexander Sub-base Theorem và qua ultrafilters.

---

## Phát biểu lại

> [!theorem] Theorem A1.1 — Tychonoff's Theorem
> Cho $\{X_\alpha\}_{\alpha \in I}$ là họ bất kỳ các không gian compact. Khi đó tích
>
> $$
> X = \prod_{\alpha \in I} X_\alpha
> $$
>
> với product topology là compact.

---

## Chứng minh 1: Qua Alexander Sub-base Theorem

### Bước 1: Alexander Sub-base Theorem

> [!theorem] Theorem A1.2 — Alexander Sub-base Theorem
> Cho $\mathcal{S}$ là subbasis của topology trên $X$. Nếu mọi open cover của $X$ bởi các phần tử của $\mathcal{S}$ đều có finite subcover, thì $X$ compact.

**Proof.** Giả sử $X$ không compact; có open cover $\mathcal{U}_0$ không có finite subcover. Xét họ:

$$
\Sigma = \{\mathcal{V} : \mathcal{V} \text{ là open cover của } X \text{ không có finite subcover}\}.
$$

$\Sigma \neq \emptyset$ (chứa $\mathcal{U}_0$). Sắp xếp $\Sigma$ bởi $\subseteq$; mọi chain có upper bound (hợp). Zorn's Lemma cho $\mathcal{U} \in \Sigma$ tối đại.

**Tính chất của $\mathcal{U}$ tối đại:**
- (a) Với mọi open set $V$: $V \in \mathcal{U}$ hoặc $\mathcal{U} \cup \{V\}$ có finite subcover (vì nếu không thì $\mathcal{U} \cup \{V\} \in \Sigma$ lớn hơn $\mathcal{U}$, mâu thuẫn tối đại).
- (b) $\mathcal{U}$ đóng với hợp hữu hạn: nếu $U_1, \ldots, U_n \in \mathcal{U}$ thì $U_1 \cup \cdots \cup U_n \in \mathcal{U}$ (vì nếu không thì $\mathcal{U}$ có finite subcover bởi (a)).

Vì $\mathcal{U}$ cover $X$ nhưng không có finite subcover, và $\mathcal{S}$ cũng cover $X$, tập $\mathcal{S} \cap \mathcal{U}$ phải cover $X$ (nếu không, mọi điểm $x$ bị phủ bởi phần tử $\mathcal{U} \setminus \mathcal{S}$ — nhưng phần tử đó là hợp hữu hạn của $\mathcal{S}$, và mỗi phần tử $\mathcal{S}$ đó phải ở trong $\mathcal{U}$ bởi (b) — contradiction). Vậy $\mathcal{S} \cap \mathcal{U}$ là $\mathcal{S}$-cover không có finite subcover — mâu thuẫn giả thiết của Theorem. $\blacksquare$

### Bước 2: Chứng minh Tychonoff

Subbasis của product topology là $\mathcal{S} = \{\pi_\alpha^{-1}(U_\alpha) : U_\alpha \subseteq X_\alpha \text{ mở}\}$.

Cho $\mathcal{C} \subseteq \mathcal{S}$ là cover của $X$ bởi các subbasis elements. Với mỗi $\alpha$, đặt $\mathcal{C}_\alpha = \{U_\alpha \subseteq X_\alpha \text{ mở} : \pi_\alpha^{-1}(U_\alpha) \in \mathcal{C}\}$.

**Claim**: Tồn tại $\alpha$ sao cho $\mathcal{C}_\alpha$ cover $X_\alpha$.

*Proof of Claim*: Nếu không, với mỗi $\alpha$ có $x_\alpha \in X_\alpha \setminus \bigcup_{U \in \mathcal{C}_\alpha} U$. Điểm $(x_\alpha)_{\alpha \in I} \in X$ không bị phủ bởi $\mathcal{C}$ — mâu thuẫn với $\mathcal{C}$ là cover. $\blacksquare$

Vậy $\mathcal{C}_\alpha$ cover $X_\alpha$ compact; có finite subcover $\{U_{\alpha,1}, \ldots, U_{\alpha,n}\}$. Khi đó $\{\pi_\alpha^{-1}(U_{\alpha,1}), \ldots, \pi_\alpha^{-1}(U_{\alpha,n})\}$ là finite subcover của $\mathcal{C}$. Theo Alexander Sub-base Theorem, $X$ compact. $\blacksquare$

---

## Chứng minh 2: Qua Ultrafilters

### Bước 1: Nhắc lại và bổ sung về ultrafilters

> [!theorem] Theorem A1.3 — Compact qua ultrafilters (nhắc lại Theorem 15.17)
> $X$ compact khi và chỉ khi mọi ultrafilter trên $X$ hội tụ.

### Bước 2: Chứng minh Tychonoff qua ultrafilters

Cho $\mathcal{U}$ là ultrafilter trên $X = \prod_\alpha X_\alpha$.

**Với mỗi $\alpha$**: projection filter $\pi_\alpha(\mathcal{U}) = \{A \subseteq X_\alpha : \pi_\alpha^{-1}(A) \in \mathcal{U}\}$ là ultrafilter trên $X_\alpha$ (kiểm tra: nếu $A \notin \pi_\alpha(\mathcal{U})$ thì $\pi_\alpha^{-1}(A) \notin \mathcal{U}$, nên $X \setminus \pi_\alpha^{-1}(A) = \pi_\alpha^{-1}(X_\alpha \setminus A) \in \mathcal{U}$, suy ra $X_\alpha \setminus A \in \pi_\alpha(\mathcal{U})$).

Vì $X_\alpha$ compact, $\pi_\alpha(\mathcal{U})$ hội tụ đến một điểm $x_\alpha \in X_\alpha$.

**Claim**: $\mathcal{U} \to x = (x_\alpha)_{\alpha \in I}$ trong $X$.

*Proof*: Đủ kiểm tra mọi subbasis element $\pi_\alpha^{-1}(V_\alpha)$ với $V_\alpha \ni x_\alpha$ mở đều thuộc $\mathcal{U}$. Vì $\pi_\alpha(\mathcal{U}) \to x_\alpha$ và $V_\alpha$ là neighborhood của $x_\alpha$, ta có $V_\alpha \in \pi_\alpha(\mathcal{U})$, tức $\pi_\alpha^{-1}(V_\alpha) \in \mathcal{U}$. ✓

Vậy mọi ultrafilter trên $X$ hội tụ, nên $X$ compact. $\blacksquare$

---

## So sánh hai chứng minh

| | Chứng minh 1 (Alexander) | Chứng minh 2 (Ultrafilter) |
|--|--|--|
| Công cụ chính | Alexander Sub-base + Zorn | Ultrafilter Lemma + compact = ultrafilter converge |
| Sử dụng AC | Qua Zorn's Lemma | Qua Ultrafilter Lemma |
| Ý tưởng | Kiểm tra compactness chỉ trên subbasis | Mọi ultrafilter "tự hội tụ" từ từng nhân tử |
| Độ thanh lịch | Kỹ thuật hơn | Ý tưởng rõ ràng hơn |
| Tổng quát | Tốt cho suy luận finite | Tốt cho suy luận vô hạn/AC |

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §37 (Alexander sub-base proof).
- Kelley, J. L. *General Topology*, Theorem 5.2 (ultrafilter proof).
- Willard, S. *General Topology*, Theorem 17.8.
- Kelley, J. L. *The Tychonoff product theorem implies the axiom of choice*, 1950.
