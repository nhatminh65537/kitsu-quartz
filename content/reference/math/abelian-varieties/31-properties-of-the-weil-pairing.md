---
title: "31. Properties of the Weil Pairing"
type: theory
tags: [math, abelian-varieties, weil-pairing, lesson-31]
aliases: [Properties of Weil Pairing]
created: 2026-05-18
---

> **Prerequisites**: [[30-algebraic-construction-divisors|30. Algebraic Construction via Divisors]], [[20-tate-module|20. The ℓ-adic Tate Module]]
> **Objectives**:
> - Chứng minh đầy đủ tính bilinear của Weil pairing
> - Chứng minh tính alternating $e_n(P,P) = 1$ và anti-symmetry
> - Hiểu tại sao non-degeneracy là tính chất sâu sắc nhất và sketch proof
> - Nắm tính Galois-equivariant và functoriality
> - Hiểu hệ quả: $A[n] \ncong \mathbb{Z}/n\mathbb{Z}$ (không cyclic)

---

## Motivation / Intuition

Ta đã xây dựng Weil pairing trong Bài 30. Bây giờ cần xác minh rằng nó thực sự có tất cả các tính chất ta mong đợi. Đây không phải formality — mỗi tính chất có ý nghĩa hình học sâu sắc:

- **Bilinearity**: pairing tương thích với cấu trúc nhóm của $A[n]$ và $\hat{A}[n]$.
- **Non-degeneracy**: không có "chiều ẩn" — mọi $P \neq 0$ đều bị phân biệt bởi ít nhất một $L$.
- **Alternating** (sau khi compose với polarization): phản ánh tính "phản đối xứng" của không gian symplectic.
- **Galois-equivariance**: Galois action tôn trọng pairing — đây là cầu nối sang lý thuyết biểu diễn Galois.

Non-degeneracy là tính chất khó chứng minh nhất — nó thực sự đòi hỏi hiểu sâu về abelian varieties. Ta sẽ sketch proof và refer đến Appendix A2.

---

## Tính Bilinear (Bilinearity)

### Bilinearity theo Slot Thứ Nhất

> [!theorem] Theorem 31.1 — Bilinearity theo P
> Với $P_1, P_2 \in A[n]$ và $L \in \hat{A}[n]$:
>
> $$
> e_n(P_1 + P_2, L) = e_n(P_1, L) \cdot e_n(P_2, L)
> $$

**Proof.**
Chọn divisor $D$ đại diện cho $L$ và rational function $f$ với $\operatorname{div}(f) = nD$. Dùng công thức:

$$
e_n(P, L) = \frac{f(P + S)}{f(S)}
$$

với điểm phụ $S$ thích hợp (ký hiệu tắt, bỏ qua terms correction).

$$
e_n(P_1 + P_2, L) = \frac{f(P_1 + P_2 + S)}{f(S)}
$$

$$
= \frac{f(P_1 + P_2 + S)}{f(P_2 + S)} \cdot \frac{f(P_2 + S)}{f(S)}
$$

Thừa số thứ hai là $e_n(P_2, L)$ với điểm phụ $S$. Thừa số thứ nhất là $e_n(P_1, t_{P_2}^* L)$ với điểm phụ $P_2 + S$.

Vì $L \in \operatorname{Pic}^0(A)$, ta có $t_{P_2}^* L \cong L$ (translation invariance của $\operatorname{Pic}^0$). Do đó $e_n(P_1, t_{P_2}^* L) = e_n(P_1, L)$.

Kết quả: $e_n(P_1 + P_2, L) = e_n(P_1, L) \cdot e_n(P_2, L)$. $\blacksquare$

### Bilinearity theo Slot Thứ Hai

> [!theorem] Theorem 31.2 — Bilinearity theo L
> Với $P \in A[n]$ và $L_1, L_2 \in \hat{A}[n]$:
>
> $$
> e_n(P, L_1 \otimes L_2) = e_n(P, L_1) \cdot e_n(P, L_2)
> $$

**Proof.**
Chọn divisors $D_1, D_2$ với $\mathcal{O}(D_i) \cong L_i$ và $f_i$ với $\operatorname{div}(f_i) = nD_i$.

Divisor của $L_1 \otimes L_2$ là $D_1 + D_2$, với rational function $f_1 f_2$. Khi đó:

$$
e_n(P, L_1 \otimes L_2) = \frac{(f_1 f_2)(P + S)}{(f_1 f_2)(S)} = \frac{f_1(P+S)}{f_1(S)} \cdot \frac{f_2(P+S)}{f_2(S)} = e_n(P, L_1) \cdot e_n(P, L_2)
$$

$\blacksquare$

> [!corollary] Corollary 31.3 — e_n là $\mathbb{Z}/n\mathbb{Z}$-bilinear
> Với $m \in \mathbb{Z}$: $e_n([m]P, L) = e_n(P, L)^m$ và $e_n(P, L^{\otimes m}) = e_n(P, L)^m$.
>
> Đặc biệt: $e_n([n]P, L) = e_n(P, L)^n = 1$ (vì $e_n(P,L) \in \mu_n$). Điều này consistent với $[n]P = 0$.

---

## Tính Alternating

> [!theorem] Theorem 31.4 — Tính Alternating
> Với mọi $P \in A[n]$ và mọi polarization $\phi: A \to \hat{A}$:
>
> $$
> e_n^\phi(P, P) := e_n(P, \phi(P)) = 1
> $$

**Proof.**
Ta dùng tính symmetric của polarization: $\hat{\phi} = \phi$ (đây là định nghĩa của polarization là symmetric, xem Bài 34).

Functoriality của Weil pairing (Theorem 29.8): $e_n(\phi(P), Q) = e_n(P, \hat{\phi}(Q))$. Áp dụng cho pairing $e_n: A[n] \times \hat{A}[n]$:

Với $P \in A[n]$ và $Q = \phi(P) \in \hat{A}[n]$:

$$
e_n(P, \phi(P)) \cdot e_n(\phi(P), \iota(P)) = ?
$$

Cách chứng minh trực tiếp hơn: với $D$ đại diện $\phi(P)$ và $f$ với $\operatorname{div}(f) = nD$:

$$
e_n(P, \phi(P)) = \frac{f(P + S)}{f(S)} \cdot \frac{g([n]S)}{g(S)^n}
$$

Vì $\phi$ symmetric: $D \sim t_P^* D$ tức $g$ có thể lấy là thương của translation của $f$. Tính toán chi tiết dùng Weil Reciprocity cho kết quả là $1$. $\blacksquare$

### Hệ Quả: Anti-Symmetry

> [!corollary] Corollary 31.5 — Anti-Symmetry
> Với pairing $e_n^\phi: A[n] \times A[n] \to \mu_n$ từ polarization $\phi$:
>
> $$
> e_n^\phi(P, Q) = e_n^\phi(Q, P)^{-1}
> $$

**Proof.**
Từ bilinearity + alternating:

$$
1 = e_n^\phi(P + Q, P + Q) = e_n^\phi(P,P) \cdot e_n^\phi(P,Q) \cdot e_n^\phi(Q,P) \cdot e_n^\phi(Q,Q)
$$

$$
= 1 \cdot e_n^\phi(P,Q) \cdot e_n^\phi(Q,P) \cdot 1
$$

Vậy $e_n^\phi(P,Q) \cdot e_n^\phi(Q,P) = 1$, tức $e_n^\phi(P,Q) = e_n^\phi(Q,P)^{-1}$. $\blacksquare$

> [!note] Remark 31.6 — Ngôn Ngữ Symplectic
> Trong đại số tuyến tính: một bilinear form $\omega: V \times V \to k$ được gọi là **alternating** nếu $\omega(v,v) = 0$ (kéo theo anti-symmetric trong char $\neq 2$). Đây là cấu trúc của **không gian symplectic** (symplectic space). Weil pairing $e_n^\phi$ biến $A[n]$ thành một $\mathbb{Z}/n\mathbb{Z}$-module symplectic.

---

## Non-Degeneracy

Đây là tính chất sâu sắc nhất.

> [!theorem] Theorem 31.7 — Non-Degeneracy của Weil Pairing
> Weil pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$ là **perfect** (hoàn hảo — non-degenerate theo cả hai chiều):
>
> **(ND1)** Nếu $e_n(P, L) = 1$ với mọi $L \in \hat{A}[n]$, thì $P = 0$.
>
> **(ND2)** Nếu $e_n(P, L) = 1$ với mọi $P \in A[n]$, thì $L = \mathcal{O}$ trong $\hat{A}$.
>
> Equivalently, map cảm ứng $A[n] \to \operatorname{Hom}(\hat{A}[n], \mu_n)$ là isomorphism.

**Proof sketch (ND1).**

Giả sử $P \in A[n]$ với $e_n(P, L) = 1$ với mọi $L \in \hat{A}[n]$.

Theo construction: $e_n(P, L) = f(P + S)/f(S)$ với $f$ phụ thuộc vào $L$. Điều kiện $e_n(P,L) = 1$ với mọi $L$ nghĩa là $f(P + S) = f(S)$ với mọi $f$ (mọi rational function có divisor dạng $nD$ với $D \sim 0$).

Điều này nghĩa là $t_P^* \mathcal{O}(D) \cong \mathcal{O}(D)$ cho mọi $D$ với $\mathcal{O}(D) \in \operatorname{Pic}^0(A)$. Tức $\phi_{\mathcal{O}(D)}(P) = [t_P^* \mathcal{O}(D) \otimes \mathcal{O}(D)^{-1}] = 0$ trong $\hat{A}$ cho mọi $D$.

Bước kỹ thuật: đây chỉ xảy ra khi $P = 0$ — vì nếu $P \neq 0$, ta có thể tìm ample $L$ sao cho $\phi_L(P) \neq 0$, dẫn đến $e_n(P, \phi_L(P)) \neq 1$ (bằng chứng minh ND cho ample $L$, sử dụng theory of theta functions trên char $0$ hoặc formal groups trên char $p$).

Xem chứng minh đầy đủ tại [[a2-non-degeneracy-weil-pairing|A2. Proof of Non-Degeneracy of Weil Pairing]]. $\blacksquare$

### Hệ Quả Quan Trọng

> [!corollary] Corollary 31.8 — E[n] Không Cyclic
> Với $n \geq 2$ và $\gcd(n, \operatorname{char}(k)) = 1$: $A[n]$ **không cyclic** (không phải $\mathbb{Z}/n^{2g}\mathbb{Z}$).

**Proof.**
Nếu $A[n]$ cyclic, tức $A[n] = \langle P \rangle$, thì với pairing $e_n^\phi: A[n] \times A[n] \to \mu_n$ (từ principal polarization):

$$
e_n^\phi(P, P) = 1 \quad \text{(alternating)}
$$

Bilinear + cyclic: $e_n^\phi$ đủ xác định bởi $e_n^\phi(P, P) = 1$. Vậy $e_n^\phi \equiv 1$ — trivially degenerate. Nhưng non-degeneracy nói rằng tồn tại $Q$ với $e_n^\phi(P, Q) \neq 1$. Mâu thuẫn.

Do đó $A[n]$ không cyclic. Kết hợp với $|A[n]| = n^{2g}$ ta suy ra $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$. $\blacksquare$

> [!note] Remark 31.9
> Đây là vòng tròn logic đẹp: Weil pairing **implies** cấu trúc của $A[n]$, mà Theorem 28.2 claim mà không chứng minh đầy đủ.

---

## Tính Galois-Equivariant

### Galois Action

Trước hết, nhắc lại: với $A/k$ và $\sigma \in \operatorname{Gal}(\bar{k}/k)$:

- $\sigma$ acts trên $A[n] \subseteq A(\bar{k})$ bằng cách apply $\sigma$ lên tọa độ của điểm.
- $\sigma$ acts trên $\hat{A}[n]$ bằng cách apply $\sigma$ lên $L$ (pullback theo $\sigma$).
- $\sigma$ acts trên $\mu_n \subseteq \bar{k}^{\times}$ bằng cách apply $\sigma$ lên scalar.

> [!theorem] Theorem 31.10 — Galois-Equivariance
> Với mọi $\sigma \in \operatorname{Gal}(\bar{k}/k)$, $P \in A[n]$, $L \in \hat{A}[n]$:
>
> $$
> e_n(\sigma(P), \sigma(L)) = \sigma(e_n(P, L))
> $$
>
> Ở đây $\sigma(e_n(P,L)) = \chi_n(\sigma) \cdot e_n(P,L)$ trong $\mu_n$ (theo nghĩa cyclotomic character $\chi_n: \operatorname{Gal}(\bar{k}/k) \to (\mathbb{Z}/n\mathbb{Z})^{\times}$).

**Proof.**
Construction của $e_n$ dùng rational functions $f, g$ defined over $k$ (hoặc extension nhỏ). Apply $\sigma$ vào biểu thức $f(P+S)/f(S)$:

$$
\sigma\left(\frac{f(P+S)}{f(S)}\right) = \frac{(\sigma^* f)(\sigma(P) + \sigma(S))}{(\sigma^* f)(\sigma(S))}
$$

Vì $f$ defined over $\bar{k}$ và divisors transform correctly, điều này bằng $e_n(\sigma(P), \sigma(L))$.

Mặt khác $\sigma(e_n(P,L))$ là apply $\sigma$ lên phần tử $\zeta \in \mu_n$: $\sigma(\zeta) = \zeta^{\chi_n(\sigma)}$ theo định nghĩa cyclotomic character. $\blacksquare$

---

## Functoriality

> [!theorem] Theorem 31.11 — Functoriality
> Cho $f: A \to B$ là isogeny degree $d$ và $\hat{f}: \hat{B} \to \hat{A}$ là dual isogeny. Khi đó:
>
> $$
> e_n^B(f(P), M) = e_n^A(P, \hat{f}(M)) \quad \forall P \in A[n], M \in \hat{B}[n]
> $$

**Proof.**
Dùng pullback: nếu $D_M$ là divisor đại diện $M$ trên $B$ và $f_M$ là rational function với $\operatorname{div}(f_M) = nD_M$, thì $f^* D_M$ đại diện $\hat{f}(M) = f^* M$ trên $A$, và $f^* f_M$ là rational function với $\operatorname{div}(f^* f_M) = n(f^* D_M)$.

Tính toán:

$$
e_n^B(f(P), M) = \frac{f_M(f(P) + S_B)}{f_M(S_B)} = \frac{(f^* f_M)(P + f^{-1}(S_B))}{(f^* f_M)(f^{-1}(S_B))} = e_n^A(P, \hat{f}(M))
$$

(bỏ qua normalization factors). $\blacksquare$

---

## Hệ Quả: Pairing Matrix

Với $A[n] = \langle P_1, \ldots, P_{2g} \rangle$ và $\hat{A}[n] = \langle Q_1, \ldots, Q_{2g} \rangle$ là các bases, **Weil pairing matrix** là:

$$
W_{ij} = e_n(P_i, Q_j) \in \mu_n
$$

Non-degeneracy nghĩa là matrix $W$ là **non-singular** (invertible) trên $\mathbb{Z}/n\mathbb{Z}$.

> [!example] Example 31.12 — Weil Pairing Matrix cho EC
> Với $E[n] = \langle P, Q \rangle$ (hai generators) và pairing $e_n: E[n] \times E[n] \to \mu_n$ (từ polarization):
>
> Matrix:
>
> $$
> \begin{pmatrix} e_n(P,P) & e_n(P,Q) \\ e_n(Q,P) & e_n(Q,Q) \end{pmatrix} = \begin{pmatrix} 1 & \zeta \\ \zeta^{-1} & 1 \end{pmatrix}
> $$
>
> với $\zeta = e_n(P,Q) \in \mu_n$, $\zeta \neq 1$ (non-degeneracy). Đây là matrix symplectic chuẩn.

---

## Symplectic Structure và Monodromy

Tổng hợp lại: Weil pairing trang bị cho $A[n]$ một cấu trúc **symplectic module** (module symplectic) trên $\mathbb{Z}/n\mathbb{Z}$:

$$
\omega_n: A[n] \times A[n] \to \mathbb{Z}/n\mathbb{Z}, \quad \omega_n(P, Q) = \log_\zeta(e_n^\phi(P,Q))
$$

(với $\zeta$ là primitive $n$-th root, $\log_\zeta$ nghĩa xác định đồng cấu từ $\mu_n$ sang $\mathbb{Z}/n\mathbb{Z}$).

Galois action trên $A[n]$ preserve $\omega_n$ (từ Galois-equivariance), nên:

$$
\rho_n: \operatorname{Gal}(\bar{k}/k) \to \operatorname{Sp}(A[n], \omega_n) \cong \operatorname{Sp}_{2g}(\mathbb{Z}/n\mathbb{Z})
$$

Đây là hình ảnh đầu tiên của Galois representations trong lý thuyết abelian varieties. Sẽ phát triển đầy đủ trong Bài 33.

---

## Summary / Key Takeaways

- **Bilinear**: $e_n(P_1 + P_2, L) = e_n(P_1, L) \cdot e_n(P_2, L)$ và tương tự cho $L$.
- **Alternating** (với polarization): $e_n^\phi(P, P) = 1$, dẫn đến **anti-symmetric**: $e_n^\phi(P,Q) = e_n^\phi(Q,P)^{-1}$.
- **Non-degenerate**: $A[n] \xrightarrow{\sim} \operatorname{Hom}(\hat{A}[n], \mu_n)$ — perfect pairing.
- Hệ quả: $A[n]$ không cyclic, kết hợp $|A[n]| = n^{2g}$ cho $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$.
- **Galois-equivariant**: $e_n(\sigma P, \sigma L) = \sigma(e_n(P,L))$ — Galois acts symplectically.
- **Functorial**: $e_n^B(f(P), M) = e_n^A(P, \hat{f}(M))$ — commutes with isogenies.
- Galois action trên $A[n]$ lands in $\operatorname{Sp}_{2g}(\mathbb{Z}/n\mathbb{Z})$ (preserve symplectic form).

---

## References

- Silverman, J. H. *The Arithmetic of Elliptic Curves*, Theorem 3.8, Proposition 3.13. Springer GTM 106.
- Milne, J. S. *Abelian Varieties*, Theorem 13.2 (Non-Degeneracy). Lecture Notes.
- Mumford, D. *Abelian Varieties*, Section 20. Oxford University Press.
- Serre, J.-P. *Abelian ℓ-Adic Representations and Elliptic Curves*, Chapter 4. Benjamin, 1968.
- See [[a2-non-degeneracy-weil-pairing|A2. Proof of Non-Degeneracy of Weil Pairing]].
