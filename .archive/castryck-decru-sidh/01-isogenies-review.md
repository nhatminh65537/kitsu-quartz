---
title: "01. Isogenies between Elliptic Curves — Review & Attack-Relevant Tools"
type: math-component
tags: [crypto, isogeny, elliptic-curve, sidh, castryck-decru, lesson-01]
aliases: [Isogenies Review]
created: 2026-04-08
---

> **Prerequisites**: Elliptic curves over finite fields, group law, Weierstrass equation, finite field arithmetic
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E / \mathbb{F}_q$ | Elliptic curve định nghĩa trên trường hữu hạn $\mathbb{F}_q$ |
> | $\mathcal{O}$ | Điểm vô cực — identity element của group $E(\mathbb{F}_q)$ |
> | $[n]$ | Phép nhân vô hướng: ánh xạ $P \mapsto P + P + \cdots + P$ ($n$ lần) |
> | $\hat{\phi}$ | Dual isogeny của $\phi$ |
> | $\mathbb{F}_p$, $\mathbb{F}_{p^2}$ | Trường hữu hạn bậc $p$ và $p^2$ |
> | $E[n]$ | Nhóm $n$-torsion của $E$: $\{P \in E(\bar{\mathbb{F}}_q) : [n]P = \mathcal{O}\}$ |
> | $\text{End}(E)$ | Vành endomorphism của $E$ |

---

## Motivation

Castryck-Decru attack không thể hiểu được nếu không nắm vững ngôn ngữ của isogenies. Bài này không dạy lại từ đầu — mà là một **review có định hướng**: chúng ta ôn lại chính xác những công cụ sẽ xuất hiện trong attack, bao gồm Vélu formulas, dual isogeny, torsion subgroup structure, và đặc biệt là khái niệm **isogeny chain**. Những khái niệm này là ngôn ngữ chung cho toàn bộ series.

Điểm then chốt cần nhớ: trong SIDH, secret key của mỗi bên *là* một isogeny — cụ thể là một phần tử $\phi_A : E_0 \to E_A$ có degree biết trước. Castryck-Decru exploit chính xác sự kết hợp giữa việc **degree được biết công khai** và **images của torsion points được tiết lộ trong public key**.

---

## 1. Isogeny — Định nghĩa và Cấu trúc

> [!note] Định nghĩa 1.1 — Isogeny
> Cho hai elliptic curve $E_1, E_2$ định nghĩa trên trường $k$. Một **isogeny** từ $E_1$ đến $E_2$ là một morphism thuần túy (rational map)
>
> $$
> \phi : E_1 \to E_2
> $$
>
> không phải là zero map, và thỏa mãn $\phi(\mathcal{O}_{E_1}) = \mathcal{O}_{E_2}$.
>
> Hệ quả tự động: $\phi$ là **group homomorphism**, tức là $\phi(P + Q) = \phi(P) + \phi(Q)$ với mọi $P, Q \in E_1(\bar{k})$.

Tính chất đầu tiên cần nhớ là **surjectivity**: mọi isogeny không trivial đều là surjective (lên $E_2(\bar{k})$). Đây là kết quả từ lý thuyết đường cong đại số: morphism không zero giữa hai curves phải surjective.

Hệ quả: kernel $\ker \phi = \{P \in E_1(\bar{k}) : \phi(P) = \mathcal{O}\}$ là một **finite subgroup** của $E_1$.

---

## 2. Degree và Kernel

> [!note] Định nghĩa 1.2 — Degree của Isogeny
> **Degree** của isogeny $\phi : E_1 \to E_2$, ký hiệu $\deg \phi$, là bậc của phần tử tương ứng trong function field extension $[k(E_1) : \phi^* k(E_2)]$. Với isogeny separable (trường hợp ta luôn xét), $\deg \phi = \# \ker \phi$.

Mối quan hệ cốt lõi: **degree = cardinality of kernel**. Đây là lý do tại sao isogeny $\phi$ với $\deg \phi = n$ còn được gọi là "$n$-isogeny".

> [!abstract] Theorem 1.3 — Kernel xác định Isogeny (Silverman III.4.12)
> Cho $E / k$ là elliptic curve và $G \subset E(\bar{k})$ là một finite subgroup. Tồn tại duy nhất (lên đến isomorphism) một elliptic curve $E'$ và một separable isogeny $\phi : E \to E'$ với $\ker \phi = G$. Curve $E'$ được ký hiệu $E / G$.

**Proof sketch.** Existence và uniqueness của quotient $E/G$ là kết quả tiêu chuẩn trong algebraic geometry: với mọi finite subgroup $G$ của một algebraic group, quotient tồn tại trong category of algebraic varieties. Với elliptic curves, điều này được chứng minh constructively qua Vélu formulas (xem Section 4). $\blacksquare$

Điều này có nghĩa: để tạo ra một isogeny, chỉ cần **chọn một finite subgroup $G$** — curve đích và map đều được xác định hoàn toàn.

---

## 3. Torsion Subgroups và Cấu trúc $E[n]$

Trong SIDH, hai bên Alice và Bob mỗi người chọn một subgroup của **torsion subgroup** làm kernel của isogeny bí mật. Vì vậy phải hiểu rõ cấu trúc của $E[n]$.

> [!note] Định nghĩa 1.4 — $n$-Torsion Subgroup
> Với integer $n \geq 1$, nhóm $n$-torsion của $E$ là:
>
> $$
> E[n] = \ker([n]) = \{ P \in E(\bar{k}) : [n]P = \mathcal{O} \}
> $$

> [!abstract] Theorem 1.5 — Cấu trúc của $E[n]$
> Cho $E$ là elliptic curve trên trường $k$ với $\text{char}(k) = p$. Với integer $n \geq 1$ không chia hết bởi $p$:
>
> $$
> E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}
> $$

**Proof sketch.** Xét phép nhân $[n] : E \to E$ là separable isogeny (vì $p \nmid n$) có degree $n^2$. Vì $E(\bar{k})$ là abelian group với rank 2 trên $\mathbb{Z}$, và $E[n]$ là nhóm hữu hạn với mọi phần tử có order chia hết cho $n$, cấu trúc $(\mathbb{Z}/n\mathbb{Z})^2$ tất yếu theo classification theorem của finitely generated abelian groups. $\blacksquare$

**Trường hợp quan trọng cho SIDH**: Với $p$ nguyên tố và $E / \mathbb{F}_{p^2}$ supersingular, ta có:

$$
E[\ell^a] \cong \mathbb{Z}/\ell^a\mathbb{Z} \times \mathbb{Z}/\ell^a\mathbb{Z}
$$

với $\ell \in \{2, 3\}$, $\ell \neq p$. SIDH dùng chính cấu trúc này: chọn basis $\{P_A, Q_A\}$ cho $E[2^a]$ và $\{P_B, Q_B\}$ cho $E[3^b]$, rồi mỗi bên chọn một **cyclic subgroup** order $2^a$ (hoặc $3^b$) làm kernel.

---

## 4. Vélu Formulas — Tính Isogeny từ Kernel

Vélu (1971) đưa ra công thức tường minh: cho $E$ và finite subgroup $G$, tính ra rational map $\phi : E \to E/G$.

> [!note] Theorem 1.6 — Vélu Formulas (short Weierstrass)
> Cho $E : y^2 = x^3 + ax + b$ và $G \subset E(\bar{k})$ finite subgroup. Đặt $G^* = G \setminus \{\mathcal{O}\}$ và với $Q = (x_Q, y_Q) \in G^*$:
>
> $$
> t_Q = 3x_Q^2 + a, \quad u_Q = 2y_Q^2, \quad w_Q = u_Q + t_Q x_Q
> $$
>
> $$
> v = \sum_{Q \in G^*} t_Q, \quad w = \sum_{Q \in G^*} w_Q
> $$
>
> Khi đó isogeny $\phi : E \to E' = E/G$ với $E' : y^2 = x^3 + (a - 5v)x + (b - 7w)$ được cho bởi:
>
> $$
> \phi(x, y) = \left( x + \sum_{Q \in G^*} \left( \frac{t_Q}{x - x_Q} + \frac{u_Q}{(x-x_Q)^2} \right),\ y - \sum_{Q \in G^*} \left( \frac{2u_Q y}{(x-x_Q)^3} + \frac{t_Q y_Q - u_Q(y - y_Q)}{(x-x_Q)^2} \right) \right)
> $$

**Ý nghĩa thực tế**: Vélu formulas cho phép evaluate $\phi(P)$ tại bất kỳ điểm $P$ nào, cũng như tính ra equation của $E'$. Đây là công cụ tính toán cốt lõi trong SIDH — mỗi bước của isogeny chain dùng Vélu để compute một $\ell$-isogeny.

> [!tip] Complexity
> Với $G$ cyclic order $\ell$ (prime), $|G^*| = \ell - 1$, Vélu formulas chạy trong $O(\ell)$ phép tính trên $k$. Với $\ell$ nhỏ (2 hoặc 3), đây là constant time.

---

## 5. Dual Isogeny

> [!note] Định nghĩa 1.7 — Dual Isogeny
> Với mọi isogeny $\phi : E_1 \to E_2$ có degree $n$, tồn tại duy nhất một isogeny **dual** $\hat{\phi} : E_2 \to E_1$ thỏa mãn:
>
> $$
> \hat{\phi} \circ \phi = [n]_{E_1} \quad \text{và} \quad \phi \circ \hat{\phi} = [n]_{E_2}
> $$

Dual isogeny có cùng degree: $\deg \hat{\phi} = \deg \phi = n$.

> [!abstract] Theorem 1.8 — Tính chất của Dual Isogeny
> Với $\phi : E_1 \to E_2$ và $\psi : E_2 \to E_3$:
>
> 1. $\widehat{\phi \circ \psi} = \hat{\psi} \circ \hat{\phi}$ (anti-homomorphism)
> 2. $\hat{\hat{\phi}} = \phi$ (involution)
> 3. $\deg \hat{\phi} = \deg \phi$
> 4. Nếu $\phi$ là $[n]$, thì $\hat{\phi} = [n]$ và $\deg[n] = n^2$

**Proof.** (1) $\widehat{\phi \circ \psi} \circ (\phi \circ \psi) = [n^2]$, và $(\hat{\psi} \circ \hat{\phi}) \circ (\phi \circ \psi) = \hat{\psi} \circ [n] \circ \psi = [n^2]$. Uniqueness của dual cho kết quả. (2)-(4) tương tự. $\blacksquare$

**Tại sao quan trọng trong attack?** Castryck-Decru cần recover $\hat{\phi}_A$ (dual của isogeny bí mật Alice) để reconstruct Alice's private key. Dual isogeny và composition của isogenies sẽ xuất hiện liên tục trong isogeny diamond của attack (Lesson 11).

---

## 6. Isogeny Chain

Trong SIDH, không ai compute trực tiếp isogeny degree $2^a$ (degree quá lớn). Thay vào đó, mỗi bên compute một **chain** của $a$ isogenies, mỗi cái có degree 2 (hoặc 3).

> [!note] Định nghĩa 1.9 — Isogeny Chain
> Một **isogeny chain** độ dài $a$ với prime $\ell$ là một dãy:
>
> $$
> E_0 \xrightarrow{\phi_1} E_1 \xrightarrow{\phi_2} E_2 \xrightarrow{\phi_3} \cdots \xrightarrow{\phi_a} E_a
> $$
>
> trong đó mỗi $\phi_i$ là một $\ell$-isogeny (degree $\ell$). Composition $\phi = \phi_a \circ \cdots \circ \phi_1 : E_0 \to E_a$ là isogeny degree $\ell^a$.

> [!abstract] Lemma 1.10 — Degree của Composition
> Với $\phi : E_1 \to E_2$ và $\psi : E_2 \to E_3$: $\deg(\psi \circ \phi) = \deg \psi \cdot \deg \phi$.

**Proof.** Từ field theory: $[k(E_1) : (\psi \circ \phi)^* k(E_3)] = [k(E_1) : \phi^* k(E_2)] \cdot [k(E_2) : \psi^* k(E_3)]$. $\blacksquare$

**Hệ quả thực tế**: Alice compute $\phi_A = \phi_a \circ \cdots \circ \phi_1$ bằng cách đi $a$ bước, mỗi bước chọn kernel là một subgroup order 2. Cụ thể:

$$
\ker \phi_A = \langle P_A + [s_A] Q_A \rangle \subset E_0[2^a]
$$

với $s_A$ là secret key. Chọn một **cyclic subgroup** order $2^a$ tương đương với chọn một **path độ dài $a$** trong isogeny graph.

---

## 7. Weil Pairing và Anti-Isometry

Weil pairing là công cụ kết nối torsion points với structure của isogeny — và nó đóng vai trò then chốt trong Kani's theorem (Lesson 9).

> [!note] Định nghĩa 1.11 — Weil Pairing
> Với $n \geq 1$ và $\gcd(n, p) = 1$, **Weil pairing** là một bilinear map:
>
> $$
> e_n : E[n] \times E[n] \to \mu_n
> $$
>
> trong đó $\mu_n \subset \bar{k}^*$ là nhóm các $n$-th roots of unity. Weil pairing thỏa mãn:
> - **Bilinearity**: $e_n(P + Q, R) = e_n(P, R) \cdot e_n(Q, R)$ và tương tự cho slot thứ hai
> - **Alternating**: $e_n(P, P) = 1$, suy ra $e_n(P, Q) = e_n(Q, P)^{-1}$ (anti-symmetry)
> - **Non-degeneracy**: nếu $e_n(P, Q) = 1$ với mọi $Q$ thì $P = \mathcal{O}$
> - **Galois-equivariance**: $e_n(P^\sigma, Q^\sigma) = e_n(P, Q)^\sigma$ với mọi $\sigma \in \text{Gal}(\bar{k}/k)$

> [!abstract] Theorem 1.12 — Isogeny và Weil Pairing
> Với $\phi : E_1 \to E_2$ isogeny degree $n$, và $P, Q \in E_1[n]$:
>
> $$
> e_n(\phi(P), \phi(Q)) = e_n(P, Q)^{\deg \phi}
> $$

**Proof.** Đây là kết quả tiêu chuẩn từ algebraic geometry: isogeny kéo pullback Weil pairing bởi degree. Xem Silverman AEC, Proposition III.8.2. $\blacksquare$

> [!info] Hệ quả quan trọng — Anti-Isometry
> Dual isogeny $\hat{\phi} : E_2 \to E_1$ thỏa mãn:
>
> $$
> e_n(\hat{\phi}(P), Q) = e_n(P, \phi(Q))
> $$
>
> Nói cách khác, $\hat{\phi}$ là "adjoint" của $\phi$ đối với Weil pairing. Đây là lý do tại sao trong Kani's theorem ta cần khái niệm **anti-isometry** — một isometry đảo chiều Weil pairing.

---

## 8. Frobenius Endomorphism

Trong SIDH và attack, curve được định nghĩa trên $\mathbb{F}_{p^2}$, nhưng nhiều điểm và map sống trên extensions. Frobenius endomorphism kiểm soát điều này.

> [!note] Định nghĩa 1.13 — Frobenius Endomorphism
> Với $E / \mathbb{F}_q$ ($q = p^r$), **Frobenius endomorphism** là:
>
> $$
> \pi_q : E \to E, \quad (x, y) \mapsto (x^q, y^q)
> $$
>
> Đây là endomorphism bậc $q$ (purely inseparable), và $\ker \pi_q = \{\mathcal{O}\}$ trong characteristic $p$.

> [!abstract] Theorem 1.14 — Characteristic Polynomial của Frobenius
> Với $E / \mathbb{F}_q$ và $t = q + 1 - \#E(\mathbb{F}_q)$ (trace of Frobenius):
>
> $$
> \pi_q^2 - [t] \circ \pi_q + [q] = 0 \quad \text{trong } \text{End}(E)
> $$
>
> Trong supersingular case (Lesson 2), $t \equiv 0 \pmod{p}$.

**Tại sao liên quan?** Frobenius xác định **field of definition** của torsion points: điểm $P \in E[n]$ được định nghĩa trên $\mathbb{F}_{q^r}$ nhỏ nhất sao cho $\pi_q^r(P) = P$. Trong SIDH, basis của $E_0[2^a]$ và $E_0[3^b]$ phải được chọn sao cho tất cả các điểm cơ sở đều sống trên $\mathbb{F}_{p^2}$ — và điều này gắn chặt với Frobenius action trên torsion subgroups.

---

## 9. Tổng Kết — Các Công Cụ Sẽ Dùng Trong Attack

Dưới đây là bảng tra cứu nhanh cho toàn bộ series:

| Công cụ | Ký hiệu | Vai trò trong Attack |
|---------|---------|---------------------|
| Isogeny (separable) | $\phi : E \to E'$ | Secret key của Alice/Bob |
| Kernel | $\ker \phi = G \subset E[n]$ | Chọn từ cyclic subgroup của torsion |
| Vélu formulas | — | Compute mỗi bước trong isogeny chain |
| Degree | $\deg \phi = \#\ker \phi$ | Được biết công khai trong SIDH |
| Dual isogeny | $\hat{\phi} : E' \to E$ | $\hat{\phi} \circ \phi = [n]$; cần để close diamond |
| Weil pairing | $e_n : E[n] \times E[n] \to \mu_n$ | Kiểm tra anti-isometry trong Kani |
| Isogeny chain | $E_0 \to E_1 \to \cdots \to E_a$ | Structure của private key computation |
| Frobenius | $\pi_p$ | Xác định endomorphism $\gamma$ trên $E_0$ |

> [!warning] Điểm then chốt cần nhớ
> Trong SIDH, public key bao gồm KHÔNG CHỈ curve $E_A$ mà còn cả images $\phi_A(P_B), \phi_A(Q_B)$ của torsion basis của phía Bob. Đây là **auxiliary torsion point images** — và chính chúng là điểm yếu mà Castryck-Decru khai thác. Lesson 4 và 5 sẽ phân tích chính xác điều này tiết lộ gì.

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Springer GTM 106, 3rd ed. (Chương III: Isogenies, VIII: Weil Pairing)
- De Feo, L. — *Mathematics of Isogeny Based Cryptography* (arXiv:1711.04062), Sections 1–3
- Vélu, J. — *Isogénies entre courbes elliptiques*, C. R. Acad. Sci. Paris, 1971
- MIT 18.783 Lecture 6 — *Isogeny Kernels and Division Polynomials* (Sutherland, 2017)
