---
title: "A2. Proof of Non-Degeneracy of Weil Pairing"
type: appendix
tags: [math, abelian-varieties, appendix, weil-pairing, non-degeneracy]
aliases: [Proof Non-Degeneracy Weil Pairing]
created: 2026-05-18
---

> Bài học liên quan: [[31-properties-of-weil-pairing|31. Properties of the Weil Pairing]]

## Motivation

Weil pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$ là bilinear và alternating. Nhưng tính chất quan trọng nhất — **non-degeneracy** — đòi hỏi chứng minh riêng, không tự nhiên xuất hiện từ định nghĩa.

Non-degeneracy có nghĩa là:
1. Nếu $e_n(P, \xi) = 1$ với mọi $\xi \in \hat{A}[n]$, thì $P = 0 \in A[n]$.
2. Nếu $e_n(P, \xi) = 1$ với mọi $P \in A[n]$, thì $\xi = 0 \in \hat{A}[n]$.

Tương đương, map $\psi: A[n] \to \operatorname{Hom}(\hat{A}[n], \mu_n)$ định nghĩa bởi $\psi(P)(\xi) = e_n(P, \xi)$ là **injective** (và do $A[n]$ và $\hat{A}[n]$ có cùng order $n^{2g}$, nó cũng là bijective).

Chứng minh non-degeneracy là khó nhất trong số các tính chất của Weil pairing. Ta sẽ trình bày theo hai cách: trường hợp elliptic curves (elementary) và trường hợp tổng quát (sử dụng dual abelian variety).

---

## Nhắc lại: Định Nghĩa Weil Pairing qua Divisors

Cho ngắn gọn, ta nhắc lại construction của $e_n$. Cho $P \in A[n]$ và $\xi \in \hat{A}[n]$ (một line bundle trên $A$ thuộc $\operatorname{Pic}^0(A)$ với $[n]^* \xi \cong \mathcal{O}_A$... theo nghĩa là $\xi$ là $n$-torsion trong $\hat{A}$).

**Construction (phiên bản divisor cho elliptic curves):**

Trên elliptic curve $E$, cho $P \in E[n]$ và $Q \in E[n]$. Chọn divisors $D_P, D_Q$ trên $E$ sao cho:
- $[n]^* D_P \sim \operatorname{div}(f_P)$ với $f_P \in k(E)^\times$
- $D_P$ có support không chứa các điểm trong $\operatorname{supp}(D_Q)$

Thì: $e_n(P, Q) = \frac{f_P(D_Q)}{f_Q(D_P)}$ (theo notation Weil reciprocity).

**Construction tổng quát ($A$ bất kỳ, $\hat{A}$ là dual):**

Cho $P \in A[n]$ và $\mathcal{L} \in \hat{A}[n] = \operatorname{Pic}^0(A)[n]$. Vì $\mathcal{L}^{\otimes n} \cong \mathcal{O}_A$ (do $\mathcal{L}$ là $n$-torsion trong $\hat{A}$), tồn tại section $s: A \to \mathcal{L}^{\otimes n}$ không biến mất đâu cả, tức là isomorphism $\mathcal{L}^{\otimes n} \cong \mathcal{O}_A$ qua $s$. Xét:

$$
e_n(P, \mathcal{L}) = \frac{t_P^* s}{s} \in H^0(A, \mathcal{O}_A^\times) = k^\times
$$

và điều này là $n$-th root of unity vì $t_P$ có order $n$.

---

## Chứng minh Non-Degeneracy: Trường Hợp Elliptic Curves

> [!theorem] Theorem A2.1 — Non-Degeneracy cho $g = 1$
> Cho $E/k$ elliptic curve, $k$ algebraically closed, $\gcd(n, \operatorname{char}(k)) = 1$. Weil pairing:
>
> $$
> e_n: E[n] \times E[n] \to \mu_n
> $$
>
> là **non-degenerate** (perfect pairing của $(\mathbb{Z}/n\mathbb{Z})^2$ với chính nó).

**Proof.**

Cho $P \in E[n]$ tùy ý, $P \neq O$. Ta cần tìm $Q \in E[n]$ sao cho $e_n(P, Q) \neq 1$.

**Bước 1: $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ cho ta cơ sở.**

Vì $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ (xem A1), tồn tại $P_1, P_2$ tạo thành $\mathbb{Z}/n\mathbb{Z}$-basis của $E[n]$. Mọi $P = a P_1 + b P_2$ với $(a, b) \neq (0, 0)$ (mod $n$).

**Bước 2: $e_n(P_1, P_2)$ là primitive $n$-th root of unity.**

Sử dụng một tính chất: Weil pairing là **alternating**: $e_n(Q, Q) = 1$ với mọi $Q$. Từ đó (bằng bilinearity):

$$
e_n(P_1, P_2) \cdot e_n(P_2, P_1) = e_n(P_1 + P_2, P_1 + P_2) / (e_n(P_1, P_1) e_n(P_2, P_2)) = 1
$$

nên $e_n(P_2, P_1) = e_n(P_1, P_2)^{-1}$.

Hơn nữa, $e_n(P_1, P_2)^n = e_n(nP_1, P_2) = e_n(0, P_2) = 1$, nên $e_n(P_1, P_2) \in \mu_n$.

Câu hỏi: $e_n(P_1, P_2)$ có phải là primitive $n$-th root of unity không?

**Bước 3: Argument bằng rational functions.**

Đây là phần kỹ thuật. Ta sẽ sử dụng đặc tính của Weil pairing qua Miller's algorithm.

Với $P_1 = (x_1, y_1)$ và chọn $P_2$ để $(P_1, P_2)$ là basis, xây dựng function $f$ trên $E$ với $\operatorname{div}(f) = n[P_1] - n[O]$. Thì:

$$
e_n(P_1, P_2) = f(P_2 + T) / f(T) \quad \text{cho general } T
$$

Để chứng minh đây là primitive root, ta dùng: nếu $e_n(P_1, P_2)^m = 1$ với $m \mid n$, thì $e_n(P_1, Q) = 1$ với mọi $Q \in E[m]$. Điều này có nghĩa là morphism $\phi: E \to \mu_n$ định nghĩa bởi $Q \mapsto e_n(P_1, Q)$ có kernel chứa $E[m]$, tức là $\phi$ factors through $[n/m]$...

Argument đầy đủ đòi hỏi dùng **normalized differentials** và liên quan đến hàm $\wp$-Weierstrass khi $k = \mathbb{C}$. Cho trường hợp tổng quát, xem Silverman AEC, Chapter III, Theorem 8.1. $\square$

**Bước 4: Non-degeneracy.**

Với $P = a P_1 + b P_2 \neq 0$, giả sử $e_n(P, Q) = 1$ với mọi $Q \in E[n]$.

Đặc biệt $Q = P_2$ (nếu $a \not\equiv 0$) hoặc $Q = P_1$ (nếu $b \not\equiv 0$):

$$
e_n(P, P_2) = e_n(aP_1 + bP_2, P_2) = e_n(P_1, P_2)^a \cdot e_n(P_2, P_2)^b = \zeta^a
$$

với $\zeta = e_n(P_1, P_2)$ là primitive $n$-th root. Vì $\zeta$ primitive, $\zeta^a = 1 \iff n \mid a$. Tương tự $e_n(P, P_1) = \zeta^{-b}$. Vậy nếu $e_n(P, \cdot) \equiv 1$ thì $n \mid a$ và $n \mid b$, tức $P = 0$. $\blacksquare$

---

## Chứng minh Non-Degeneracy: Trường Hợp Tổng Quát

> [!theorem] Theorem A2.2 — Non-Degeneracy tổng quát
> Cho $A/k$ abelian variety chiều $g$, $k$ algebraically closed, $\gcd(n, \operatorname{char}(k)) = 1$. Weil pairing:
>
> $$
> e_n: A[n] \times \hat{A}[n] \to \mu_n
> $$
>
> là perfect pairing của $(\mathbb{Z}/n\mathbb{Z})^{2g}$-modules.

**Proof.**

**Chiến lược:** Ta sẽ chứng minh rằng map:

$$
\Phi: A[n] \to \operatorname{Hom}(\hat{A}[n], \mu_n), \quad \Phi(P)(\mathcal{L}) = e_n(P, \mathcal{L})
$$

là injective. Vì $|A[n]| = |\hat{A}[n]| = n^{2g}$ và $|\operatorname{Hom}(\hat{A}[n], \mu_n)| = n^{2g}$ (vì $\hat{A}[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ và $|\mu_n| = n$), injectivity kéo theo bijectivity.

**Bước 1: Weil pairing qua line bundles.**

Cố định $P \in A[n]$. Xét map:

$$
\lambda_P: \hat{A}[n] \to \mu_n, \quad \mathcal{L} \mapsto e_n(P, \mathcal{L})
$$

Ta cần chứng minh: nếu $P \neq 0$, thì tồn tại $\mathcal{L} \in \hat{A}[n]$ sao cho $e_n(P, \mathcal{L}) \neq 1$.

**Bước 2: Reduction sang elliptic curve.**

Vì $A/k$ với $k$ algebraically closed, ta có thể tìm được elliptic curve $E$ trong $A$ (theo nghĩa: tồn tại abelian variety $B$ và isogeny $A \to E \times B$, hoặc map $i: E \to A$... Thực ra argument này phức tạp hơn).

Phương pháp tốt hơn: dùng **polarization**.

**Bước 3: Dùng polarization.**

Cho $\lambda: A \to \hat{A}$ là một polarization (isogeny). Xét pairing **Weil-Rosati**:

$$
e_n^\lambda: A[n] \times A[n] \to \mu_n, \quad e_n^\lambda(P, Q) = e_n(P, \lambda(Q))
$$

Đây là **alternating** và **non-degenerate** (ta sẽ chứng minh).

Để chứng minh non-degeneracy của $e_n^\lambda$, ta dùng **Zarhin's trick** hoặc lập luận bằng induction trên $g$.

**Bước 4: Non-degeneracy của $e_n^\lambda$ kéo theo non-degeneracy của $e_n$.**

Giả sử $e_n(P, \mathcal{L}) = 1$ với mọi $\mathcal{L} \in \hat{A}[n]$. Thì đặc biệt $e_n(P, \lambda(Q)) = 1$ với mọi $Q \in A[n]$, tức $e_n^\lambda(P, Q) = 1$ với mọi $Q$. Nếu $e_n^\lambda$ non-degenerate thì $P = 0$. 

**Bước 5: Chứng minh $e_n^\lambda$ non-degenerate.**

Ta sử dụng approach sau:

> **Lemma (Key):** Cho $\lambda: A \to \hat{A}$ là polarization. Thì $e_n^\lambda$ non-degenerate.

**Proof of Lemma.**

Xét map $\Psi: A[n] \to \operatorname{Hom}_{\mathbb{Z}/n\mathbb{Z}}(A[n], \mu_n)$ định nghĩa bởi $\Psi(P)(Q) = e_n^\lambda(P, Q) = e_n(P, \lambda(Q))$.

Từ cấu trúc của Weil pairing:

$$
e_n^\lambda(P, Q) = e_n(P, \phi_L(Q))
$$

với $\phi_L: A \to \hat{A}$ là map $Q \mapsto [t_Q^* L \otimes L^{-1}]$ (với $L$ ample line bundle định nghĩa polarization).

Dùng **Miller function** construction: với $P, Q \in A[n]$, chọn divisors $D_P, D_Q$ trên $A$ sao cho $[P] - [O] = D_P$ (modulo principal divisors), v.v. Thì:

$$
e_n^\lambda(P, Q) = \frac{f_P(\text{div nhất định liên quan đến } \phi_L(Q))}{f_Q(\text{div nhất định liên quan đến } \phi_L(P))}
$$

Đây là ratio của evaluations của rational functions. Key insight: nếu $P \neq 0$, thì tập $\{t_P^* L \otimes L^{-1} : P \in A[n]\}$ không tầm thường. Cụ thể, tồn tại $Q$ sao cho $\phi_L(Q)$ không tầm thường tại $P$...

**Argument bằng Theta groups (Mumford):**

Mumford định nghĩa **theta group** của line bundle $L$:

$$
\mathcal{G}(L) = \{(a, \phi): a \in A, \phi: L \xrightarrow{\sim} t_a^* L\}
$$

với group law $(a, \phi) \cdot (b, \psi) = (a+b, t_b^*\phi \circ \psi)$. Có extension trung tâm:

$$
1 \to k^\times \to \mathcal{G}(L) \to K(L) \to 0
$$

với $K(L) = \ker(\phi_L)$. Khi $L = L^n$ ($n$-th tensor power), $K(L^n) \supseteq A[n]$.

Non-degeneracy của Weil pairing tương đương với: commutator map $\mathcal{G}(L^n) \times \mathcal{G}(L^n) \to k^\times$ là non-degenerate trên $A[n]$, tức là $A[n]$ không commute với $A[n]$ trong $\mathcal{G}(L^n)$. Điều này xuất phát từ tính chất của theta group (xem Mumford §23).

Hoàn chỉnh: xem Mumford *Abelian Varieties*, §20 cho chi tiết đầy đủ. $\blacksquare$

---

## Hệ Quả của Non-Degeneracy

> [!corollary] Corollary A2.3 — $A[n]$ và $\hat{A}[n]$ là dual modules
> Non-degeneracy của $e_n: A[n] \times \hat{A}[n] \to \mu_n$ nói rằng:
>
> $$
> A[n] \cong \operatorname{Hom}_{\mathbb{Z}/n\mathbb{Z}}(\hat{A}[n], \mu_n) = \hat{A}[n]^\vee(1)
> $$
>
> (Tate twist). Đây là Cartier duality cho group schemes hữu hạn.

> [!corollary] Corollary A2.4 — Weil Pairing trên Tate Module là Non-Degenerate
> Lấy inverse limit: pairing:
>
> $$
> e_\ell: T_\ell(A) \times T_\ell(\hat{A}) \to T_\ell(\mathbb{G}_m) = \mathbb{Z}_\ell(1)
> $$
>
> là **perfect pairing** của free $\mathbb{Z}_\ell$-modules rank $2g$.

---

## Non-Degeneracy và MOV Attack

Non-degeneracy có hệ quả quan trọng trong cryptography:

> [!note] Remark A2.5 — MOV Attack
> Trong Menezes–Okamoto–Vanstone (MOV) attack, ta khai thác non-degeneracy của Weil pairing để giảm ECDLP (discrete logarithm trên $E[n]$) thành DLP trong $\mu_n \subseteq \mathbb{F}_{q^k}^\times$.
>
> Cụ thể: cho $P, Q \in E[n]$, nếu ta biết $e_n(P, Q) = \zeta$ (computed bằng Miller's algorithm), và biết $Q = mP$, thì $e_n(P, Q) = e_n(P, P)^m$. Non-degeneracy đảm bảo $e_n(P, \cdot)$ không tầm thường, cho phép "map vấn đề vào" $\mathbb{F}_{q^k}^\times$.

---

## Summary

- Non-degeneracy của Weil pairing: nếu $e_n(P, \xi) = 1$ với mọi $\xi$, thì $P = 0$.
- Với $g = 1$ (elliptic curves): argument trực tiếp dùng primitive root và bilinearity.
- Trường hợp tổng quát: dùng polarization $\lambda: A \to \hat{A}$ để reduce sang pairing $e_n^\lambda$ trên $A[n] \times A[n]$, rồi dùng theta group của Mumford.
- Hệ quả: $A[n] \cong (\hat{A}[n])^\vee(1)$ (Cartier duality); Tate module Weil pairing là perfect.
- Ứng dụng: MOV attack dựa trên non-degeneracy của Weil pairing.

---

## References

- Mumford, D. *Abelian Varieties*. OUP, 1970. §20 (Weil pairing) và §23 (theta groups, non-degeneracy).
- Milne, J.S. *Abelian Varieties* (Course Notes). §10–11. https://www.jmilne.org/math/CourseNotes/AV.pdf
- Silverman, J.H. *The Arithmetic of Elliptic Curves*. GTM 106. Chapter III, §8 (Weil Pairing).
- MIT 18.783 *Elliptic Curves* Lecture 24: Divisors and Weil Pairing. https://math.mit.edu/classes/18.783/2017/LectureNotes24.pdf
- Conrad, B. *Mordell's Conjecture* seminar notes, Lecture 2. http://virtualmath1.stanford.edu/~conrad/mordellsem/Notes/L02.pdf
- Galbraith, S.D. *Mathematics of Public Key Cryptography*. Cambridge, 2012. Chapter 6 (Weil Pairing và applications).
