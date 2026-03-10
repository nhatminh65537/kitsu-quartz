---
title: 05. Torsion Points
tags: [math, pairing, elliptic-curves, lesson-05]
aliases: ["Torsion Points và Cấu trúc E[n]"]
created: 2026-03-09
---

# 5. Torsion Points và Cấu trúc $E[n]$

> **Prerequisites**: [[01-ecc-finite-field-review|ECC & Finite Field Review]], [[02-extension-fields-tower-extensions|Extension Fields & Tower Extensions]], [[04-divisors-on-elliptic-curve|Divisors on Elliptic Curve]]
> **Objectives**:
> - Chứng minh $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ khi $\gcd(n, \text{char}(k)) = 1$
> - Hiểu Galois action trên $E[n]$ và tại sao toàn bộ $E[n]$ thường không nằm trong $E(\mathbb{F}_q)$
> - Hiểu basis của $E[n]$, Weil pairing matrix, và tại sao cần phải lên $E(\mathbb{F}_{q^k})$

---

## Motivation / Intuition

Weil pairing nhận *hai điểm trong $E[n]$* làm đầu vào. Nhưng $E[n]$ không chỉ là các điểm định nghĩa được trên $\mathbb{F}_q$ — phần lớn $E[n]$ "sống" trong extension fields.

Ví dụ: trên $E/\mathbb{F}_{11}$ với $\#E(\mathbb{F}_{11}) = 13$, toàn bộ $E(\mathbb{F}_{11})$ là cyclic bậc 13, nên $E(\mathbb{F}_{11})[13] = E(\mathbb{F}_{11}) \cong \mathbb{Z}/13\mathbb{Z}$. Nhưng $E[13]$ đầy đủ là $(\mathbb{Z}/13\mathbb{Z})^2$ với $169$ điểm — 156 điểm còn lại nằm trong $E(\mathbb{F}_{11^{12}})$.

Lesson này giải thích **tại sao** $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$, **Galois action** trông như thế nào, và cách chọn basis $(P, Q)$ để tính toán Weil pairing.

---

## Cấu trúc của $E[n]$ trên $\bar{k}$

### Theorem

> [!theorem] Theorem 5.1 — Cấu trúc $E[n]$ (chính xác)
> Cho $E/k$ và $n \geq 1$ với $\gcd(n, \text{char}(k)) = 1$. Trên $\bar{k}$:
>
> $$
> E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}
> $$
>
> là direct product của hai nhóm cyclic bậc $n$. Đặc biệt $|E[n]| = n^2$.

**Proof sketch (hai bước).**

**Bước 1**: $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ nếu $n$ nguyên tố.

Xét multiplication-by-$n$ map $[n]: E \to E$. Đây là isogeny bậc $n^2$ (degree $= n^2$). Kernel của nó có order $\leq n^2$. Mặt khác, $E$ là variety abelian dimension 1, và $E[n]$ là kernel của $[n]$. Dùng lý thuyết isogeny (hoặc phân tích formal group), $E[n] \hookrightarrow (\mathbb{Z}/n\mathbb{Z})^2$. Để thấy đẳng thức, kiểm tra over $\mathbb{C}$: $E(\mathbb{C}) \cong \mathbb{C}/\Lambda$, nên $E[n](\mathbb{C}) = \frac{1}{n}\Lambda/\Lambda \cong (\mathbb{Z}/n\mathbb{Z})^2$.

**Bước 2**: Từ $n$ nguyên tố suy ra tổng quát bằng CRT. $\blacksquare$

> [!note] Remark 5.2 — Trường hợp $p \mid n$
> Nếu $\text{char}(k) = p$ và $p \mid n$, viết $n = p^s m$ với $\gcd(p,m)=1$. Khi đó:
>
> $$
> E[n] \cong E[m] \times E[p^s] \cong (\mathbb{Z}/m\mathbb{Z})^2 \times H
> $$
>
> trong đó $H$ là một trong hai trường hợp: $H = \{0\}$ (supersingular) hoặc $H \cong \mathbb{Z}/p^s\mathbb{Z}$ (ordinary). Torsion $p$-primary "collapsed" so với torsion coprime-to-$p$.

> [!example] Example 5.3 — $E[2]$ trên $E/\mathbb{F}_{11}$
> Trên $E: y^2 = x^3 + x + 6$ / $\mathbb{F}_{11}$: 2-torsion affine points là nghiệm của $x^3 + x + 6 = 0$ với $y=0$.
>
> Đa thức $x^3 + x + 6$ trên $\mathbb{F}_{11}$: thử $x=0,\ldots,10$: không có nghiệm trong $\mathbb{F}_{11}$.
>
> Nghiệm nằm trong extension: $x^3+x+6$ irreducible over $\mathbb{F}_{11}$? Vì không có nghiệm trong $\mathbb{F}_{11}$ và bậc 3, nó irreducible. Vậy $E[2]$ affine $\subset E(\mathbb{F}_{11^3})$.
>
> Toàn bộ $E[2] \cong (\mathbb{Z}/2\mathbb{Z})^2$ có 4 điểm: $\mathcal{O}$ và 3 điểm affine $\in E(\mathbb{F}_{11^3})$.

---

## Galois Action trên $E[n]$

### Definition

> [!definition] Definition 5.4 — Galois Representation trên $E[n]$
> Cho $E/\mathbb{F}_q$. Frobenius $\phi_q \in \text{Gal}(\bar{\mathbb{F}}_q/\mathbb{F}_q)$ tác động trên $E[n]$ qua:
>
> $$
> \phi_q: (x, y) \mapsto (x^q, y^q)
> $$
>
> Chọn basis $\{P_1, P_2\}$ của $E[n]$ (tức $E[n] = \langle P_1 \rangle \oplus \langle P_2 \rangle$ với $\text{ord}(P_1) = \text{ord}(P_2) = n$). Khi đó Frobenius biểu diễn bởi một ma trận:
>
> $$
> \phi_q(P_i) = a_{1i} P_1 + a_{2i} P_2, \quad \rho_n(\phi_q) = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix} \in \text{GL}_2(\mathbb{Z}/n\mathbb{Z})
> $$
>
> Ánh xạ $\rho_n: \text{Gal}(\bar{\mathbb{F}}_q/\mathbb{F}_q) \to \text{GL}_2(\mathbb{Z}/n\mathbb{Z})$ gọi là **$n$-torsion Galois representation** (hay mod-$n$ representation).

> [!theorem] Theorem 5.5 — Frobenius trên $E[n]$
> Đặc trưng của $\phi_q$ tác động trên $E[n]$ là:
>
> $$
> \phi_q^2 - t\phi_q + q \equiv 0 \pmod{n}
> $$
>
> trong đó $t$ là trace of Frobenius ($\#E(\mathbb{F}_q) = q+1-t$).
>
> Tương đương: ma trận $\rho_n(\phi_q)$ thỏa $\det(\rho_n(\phi_q)) = q \bmod n$ và $\text{tr}(\rho_n(\phi_q)) = t \bmod n$.

> [!example] Example 5.6 — Frobenius tác động trên $E(\mathbb{F}_{11})[13]$
> Với $E/\mathbb{F}_{11}$, $t = -1$, $n=13$:
>
> $\phi_{11}^2 + \phi_{11} + 11 \equiv 0 \pmod{13}$, tức $\phi_{11}^2 + \phi_{11} + 11 \equiv \phi_{11}^2 + \phi_{11} - 2 \equiv 0 \pmod{13}$.
>
> Nghiệm: $\phi_{11} \equiv 1 \pmod{13}$ hoặc $\phi_{11} \equiv -2 \equiv 11 \pmod{13}$.
>
> Điểm trong $E(\mathbb{F}_{11})[13]$ thoả $\phi_{11}(P) = P$ (tức eigenvalue 1). Điểm trong $E[13]$ nhưng không thuộc $E(\mathbb{F}_{11})$ thoả $\phi_{11}(P) = 11P$ (eigenvalue $q=11 \equiv 11 \pmod{13}$).
>
> Cụ thể: $E[13] = W_1 \oplus W_{11}$ với $W_1 = E(\mathbb{F}_{11})[13]$ (eigenspace của $\phi_{11}$, eigenvalue 1) và $W_{11}$ (eigenspace eigenvalue 11). $W_{11} \subset E(\mathbb{F}_{11^{12}})$ nhưng $\not\subset E(\mathbb{F}_{11^j})$ với $j < 12$.

---

## Basis của $E[n]$ và Weil Pairing Matrix

### Definition

> [!definition] Definition 5.7 — Basis của $E[n]$
> Một **basis** của $E[n]$ là cặp điểm $(P, Q)$ với $P, Q \in E[n](\bar{k})$ sao cho mọi $R \in E[n]$ đều viết được duy nhất:
>
> $$
> R = aP + bQ, \quad a, b \in \mathbb{Z}/n\mathbb{Z}
> $$
>
> Điều kiện: $e_n(P, Q)$ là **primitive $n$-th root of unity** (tức $e_n(P,Q)$ có bậc $n$ trong $\mu_n$). (Đây là hệ quả của non-degeneracy của Weil pairing — Lesson 06.)

> [!theorem] Theorem 5.8 — Weil Pairing Matrix là Anti-Symmetric
> Cho $(P, Q)$ là basis của $E[n]$ với $\zeta = e_n(P, Q)$ là primitive $n$-th root of unity. Khi đó:
>
> $$
> e_n(aP + bQ,\; cP + dQ) = \zeta^{ad - bc}
> $$
>
> Matrix $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ tác động như: $e_n(R_1, R_2) = \zeta^{\det(M)}$ trong đó $M$ biểu diễn $R_1, R_2$ theo basis $(P,Q)$.

**Proof.** Từ bilinearity và alternating:
$$
e_n(aP+bQ, cP+dQ) = e_n(P,P)^{ac} \cdot e_n(P,Q)^{ad} \cdot e_n(Q,P)^{bc} \cdot e_n(Q,Q)^{bd}
$$
$$
= 1^{ac} \cdot \zeta^{ad} \cdot \zeta^{-bc} \cdot 1^{bd} = \zeta^{ad-bc}
$$
(dùng $e_n(P,P) = 1$, $e_n(Q,Q) = 1$, $e_n(Q,P) = e_n(P,Q)^{-1} = \zeta^{-1}$). $\blacksquare$

---

## $E[n]$ trên các Extension Fields

> [!theorem] Theorem 5.9 — $E(\mathbb{F}_{q^k})$ chứa toàn bộ $E[n]$
> $E[n] \subseteq E(\mathbb{F}_{q^k})$ khi và chỉ khi $n \mid q^k - 1$ **và** $n \mid \#E(\mathbb{F}_{q^k})$.
>
> **Điều kiện đủ thực tế**: Nếu $k$ là embedding degree (tức $n \mid q^k - 1$), và $n \mid \#E(\mathbb{F}_q)$, thì $E[n] \subseteq E(\mathbb{F}_{q^k})$.

> [!example] Example 5.10 — $E[13] \subset E(\mathbb{F}_{11^{12}})$
> Ta đã biết embedding degree $k=12$, nên $13 \mid 11^{12}-1$ (tức $\mu_{13} \subset \mathbb{F}_{11^{12}}$). Hơn nữa $13 \mid \#E(\mathbb{F}_{11^{12}})$ (vì $13 \mid \#E(\mathbb{F}_{11}) = 13$, và $E(\mathbb{F}_{11})$ nhúng vào $E(\mathbb{F}_{11^{12}})$).
>
> Vậy $E[13] \subseteq E(\mathbb{F}_{11^{12}})$ nhưng $E[13] \not\subseteq E(\mathbb{F}_{11^j})$ với $j < 12$ (vì $13 \nmid 11^j - 1$).
>
> Điều này nghĩa là để tính Weil pairing $e_{13}(P, Q)$ với $Q \notin E(\mathbb{F}_{11})$, ta phải làm việc trong $\mathbb{F}_{11^{12}}$.

> [!note] Remark 5.11 — Distortion Maps và Pairing-Friendly Input
> Vấn đề thực tế: cả hai input $P, Q$ của $e_n(P,Q)$ phải thuộc $E[n]$. Nếu ta chỉ có $P \in E(\mathbb{F}_q)[n]$, cần $Q$ độc lập tuyến tính với $P$ trong $E[n]$ — nhưng $Q \notin E(\mathbb{F}_q)$.
>
> Với supersingular curves: tồn tại **distortion map** $\psi: E \to E$ (endomorphism không phải nhân với hằng số) sao cho $\{P, \psi(P)\}$ là basis của $E[n]$. Điều này cho phép dùng pairing kiểu $e_n(P, \psi(P))$ — gọi là **symmetric pairing** hay **self-pairing**. Dùng trong Joux's tripartite DH (Lesson 12).
>
> Với ordinary curves: phải dùng twist $E'$ của $E$ để chọn $Q \in E'(\mathbb{F}_q)$ và map sang $E[n]$ qua twist isomorphism.

---

## Galois-Equivariance và Ý Nghĩa Mật Mã

> [!theorem] Theorem 5.12 — Weil Pairing là Galois-Equivariant
> Với $\sigma \in \text{Gal}(\bar{k}/k)$ và $P, Q \in E[n]$:
>
> $$
> e_n(\sigma(P), \sigma(Q)) = \sigma(e_n(P, Q))
> $$
>
> trong đó $\sigma$ tác động trên $\mu_n \subset \bar{k}^\times$ theo tác động Galois thông thường trên các roots of unity.

**Hệ quả**: Nếu $P, Q \in E(\mathbb{F}_q)$, thì $\phi_q(e_n(P,Q)) = e_n(\phi_q(P), \phi_q(Q)) = e_n(P,Q)$, tức $e_n(P,Q) \in \mathbb{F}_q^\times$. Nhưng $e_n(P,Q) \in \mu_n$ và $\mu_n \cap \mathbb{F}_q^\times = \{1\}$ nếu $k > 1$ (embedding degree). Vậy $e_n(P,Q) = 1$ khi cả $P$ và $Q$ thuộc $E(\mathbb{F}_q)[n]$ — Weil pairing **degenerate** trên $E(\mathbb{F}_q)[n] \times E(\mathbb{F}_q)[n]$.

> [!warning] Counterexample 5.13 — Không thể dùng cả hai input từ $E(\mathbb{F}_q)$
> Đây là lý do tại sao trong MOV attack (Lesson 11), ta phải lấy $Q \in E(\mathbb{F}_{q^k}) \setminus E(\mathbb{F}_q)$: nếu cả $P$ và $Q$ đều trong $E(\mathbb{F}_q)$, pairing luôn cho output 1 và vô dụng.
>
> Trong ký hiệu pairing-based crypto: thường phân chia $E[n]$ thành hai subgroup:
> - $\mathbb{G}_1 = E(\mathbb{F}_q)[n]$ — "base field" subgroup
> - $\mathbb{G}_2 = E[n] \cap \ker(\phi_q - [q])$ — "non-base-field" subgroup
>
> Pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ với $\mathbb{G}_T = \mu_n \subset \mathbb{F}_{q^k}^\times$. Đây là cấu trúc Type-1, Type-2, Type-3 trong classification của Galbraith–Paterson–Smart.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(11), [1, 6])
k = 12
Fext = GF(11^k, 'a')
Eext = E.base_extend(Fext)

# Tìm generators của E[n] trên extension field
n = 13
Efull = Eext.order()
print(f'#E(F_11^12) = {Efull}')

# Tìm điểm order n trong E(F_11^12)
P_ext = Eext.random_point()
while True:
	cofactor = P_ext.order() // n
    Q_gen = cofactor * P_ext
    if Q_gen.order() == n:
        break
    P_ext = Eext.random_point()

# Basis của E[n]:
# P1 trong E(F_11)[n] = E(F_11) vì #E(F_11)=13=n
P1 = E.random_point()
P1_ext = Eext(P1)

# P2 độc lập tuyến tính với P1 trong E[n]
P2_ext = Q_gen
# Check: e_n(P1, P2) != 1
ep = P1_ext.weil_pairing(P2_ext, n)
print(f'e_n(P1,P2) = {ep}')
print(f'Is primitive n-th root: {ep.multiplicative_order() == n}')

# Galois equivariance: frobenius
frob = Fext.frobenius_endomorphism()   # x -> x^11
# frob(e_n(P,Q)) should equal e_n(frob(P), frob(Q))
```

---

## Summary / Key Takeaways

- $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ trên $\bar{k}$ (với $p \nmid n$): $n^2$ điểm, cần basis $(P_1, P_2)$.
- Frobenius tác động trên $E[n]$ qua ma trận trong $\text{GL}_2(\mathbb{Z}/n\mathbb{Z})$ với characteristic polynomial $X^2 - tX + q$.
- $E(\mathbb{F}_q)[n]$ là eigenspace của Frobenius (eigenvalue 1) — chỉ là $\mathbb{Z}/n\mathbb{Z}$ (một copy).
- Phần còn lại của $E[n]$ (eigenspace eigenvalue $q$) nằm trong $E(\mathbb{F}_{q^k})$ với $k$ = embedding degree.
- Weil pairing biểu diễn qua $e_n(aP+bQ, cP+dQ) = \zeta^{ad-bc}$ — đây là "determinant" của biến đổi tuyến tính trong $E[n]$.
- **Galois-equivariance** $\Rightarrow$ $e_n(P,Q) = 1$ khi $P, Q \in E(\mathbb{F}_q)[n]$ (embedding degree $k>1$).
- Cần $\mathbb{G}_1$ và $\mathbb{G}_2$ độc lập tuyến tính: một từ $E(\mathbb{F}_q)$, một từ $E(\mathbb{F}_{q^k})\setminus E(\mathbb{F}_q)$.

---

## References

- Silverman, AEC, Ch. III §7–§8 (torsion, Weil pairing).
- Washington, §3.2, §11.3 (Galois action, embedding degree).
- Sutherland, MIT 18.783 Lecture Notes 2022, Lectures 5–6 (torsion), Lecture 23 (eigenspaces).
- Galbraith–Paterson–Smart, *Pairings for Cryptographers*, Discrete Applied Mathematics (2008).