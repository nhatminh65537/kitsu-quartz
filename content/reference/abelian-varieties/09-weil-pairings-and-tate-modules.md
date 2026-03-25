---
title: "09. Weil Pairings & Tate Modules"
tags: [math, abelian-varieties, lesson-09]
aliases: [Weil Pairings and Tate Modules]
created: 2026-03-24
---

> **Prerequisites**: [[08-dual-abelian-variety|08. The Dual Abelian Variety]], [[07-isogenies|07. Isogenies]]
> **Objectives**:
> - Hiểu Weil pairing $e_n : A[n] \times A^\vee[n] \to \mu_n$ và tính chất của nó
> - Nắm công thức tường minh của Weil pairing trên elliptic curves qua rational functions
> - Định nghĩa Tate module $T_\ell(A)$ và Galois representation $\ell$-adic
> - Hiểu Weil pairing trên Tate module $T_\ell(A) \times T_\ell(A^\vee) \to \mathbb{Z}_\ell(1)$
> - Biết ứng dụng trong cryptography (pairing-based crypto) và lý thuyết số

---

## Motivation / Intuition

Đối với elliptic curve $E$, torsion points $E[n]$ là nhóm $(\mathbb{Z}/n\mathbb{Z})^2$. Câu hỏi: liệu có thể đo "góc" giữa hai torsion points không? Weil pairing chính xác là một **bilinear form** trên $E[n]$ nhận giá trị trong roots of unity $\mu_n$ — thay vì $\mathbb{Z}$ (như inner product thông thường), nó nhận giá trị nhân tính.

Tại sao điều này quan trọng?

1. **Galois equivariance**: pairing tương thích với Galois action, nên nó mã hóa thông tin về Galois representation.
2. **Non-degeneracy**: pairing không suy biến — nếu $e_n(P, Q) = 1$ với mọi $Q$, thì $P = 0$.
3. **Cryptography**: Weil pairing và Tate pairing là nền tảng của **pairing-based cryptography** (bilinear Diffie-Hellman, identity-based encryption, zkSNARKs!).
4. **Tate module**: lấy inverse limit của $A[\ell^m]$ theo $\ell$ ta được $T_\ell(A)$ — module $\mathbb{Z}_\ell$-free rank $2g$, là công cụ cơ bản của lý thuyết $\ell$-adic.

---

## Weil Pairing: Phát Biểu

### Định nghĩa tổng quát

> [!abstract] Theorem 9.1 — Weil Pairing
> Cho $A$ abelian variety chiều $g$ trên trường $k$, và $n$ nguyên dương với $\gcd(n, \operatorname{char}(k)) = 1$. Tồn tại **Weil pairing** (cặp Weil) tự nhiên, non-degenerate, bilinear:
>
> $$
> e_n : A[n] \times A^\vee[n] \longrightarrow \mu_n,
> $$
>
> trong đó $\mu_n = \{ \zeta \in \bar{k}^* \mid \zeta^n = 1 \}$ là nhóm $n$-th roots of unity.
>
> Pairing này thỏa:
>
> 1. **Bilinear**: $e_n(P_1 + P_2, Q) = e_n(P_1, Q) \cdot e_n(P_2, Q)$ và $e_n(P, Q_1 + Q_2) = e_n(P, Q_1) \cdot e_n(P, Q_2)$.
> 2. **Non-degenerate**: Nếu $e_n(P, Q) = 1$ với mọi $Q \in A^\vee[n]$, thì $P = 0$.
> 3. **Galois equivariant**: $e_n(\sigma P, \sigma Q) = \sigma(e_n(P, Q))$ với mọi $\sigma \in G_k = \operatorname{Gal}(\bar{k}/k)$.
> 4. **Tương thích với isogeny**: nếu $f : A \to B$ isogeny, thì $e_n(P, f^\vee Q) = e_n(f P, Q)$.

> [!abstract] Corollary 9.2 — Weil Pairing đối với Polarization
> Với polarization $\lambda : A \to A^\vee$, ta thu được **alternating pairing**:
>
> $$
> e_n^\lambda : A[n] \times A[n] \to \mu_n, \quad e_n^\lambda(P, Q) = e_n(P, \lambda(Q)).
> $$
>
> Pairing này là **alternating**: $e_n^\lambda(P, Q) = e_n^\lambda(Q, P)^{-1}$, và đặc biệt $e_n^\lambda(P, P) = 1$.
>
> Khi $\lambda$ là **principal polarization**: $e_n^\lambda$ là **symplectic form** non-degenerate trên $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$, và hành động Galois bảo toàn $e_n^\lambda$ trong $\operatorname{GSp}_{2g}(\mathbb{Z}/n\mathbb{Z})$.

---

## Công Thức Tường Minh cho Elliptic Curves

Với $E$ elliptic curve và $E[n] = \ker([n])$, Weil pairing $e_n : E[n] \times E[n] \to \mu_n$ có công thức tường minh:

> [!abstract] Definition 9.3 — Weil Pairing qua Rational Functions
> Cho $P, Q \in E[n]$, $P \neq Q$. Tìm $f, g \in k(E)^*$ sao cho:
>
> $$
> \operatorname{div}(f) = n[P] - n[O], \quad \operatorname{div}(g) = n[Q] - n[O].
> $$
>
> Chọn điểm $S \in E(\bar{k})$ với $S \neq P, Q, P-Q, O$ (để support của $f, g$ disjoint sau khi translate). Khi đó:
>
> $$
> e_n(P, Q) = \frac{f(Q + S)}{f(S)} \cdot \frac{g(S)}{g(P + S)} \in \mu_n.
> $$
>
> Giá trị này không phụ thuộc vào lựa chọn $S$, $f$, $g$.

> [!example] Example 9.4 — Tính Weil Pairing trên $E/\mathbb{F}_{11}$
> Xét $E : y^2 = x^3 - x$ trên $\mathbb{F}_{11}$. Có $E[2] = \{O, (0,0), (1,0), (-1,0)\} = \{O, (0,0), (1,0), (10,0)\}$.
>
> Với $P = (0, 0)$, $Q = (1, 0)$ trong $E[2]$:
>
> - $\operatorname{div}(f)$ với $f = (x - 0)/1 = x$: zeros tại $(0,0)$ bậc $2$... (chi tiết kỹ thuật hơn)
>
> Kết quả: $e_2(P, Q) = -1 \in \mu_2 = \{1, -1\}$ (root of unity bậc $2$).
>
> Tổng quát: $e_2 : E[2] \times E[2] \to \mu_2$ là **symplectic form** trên $(\mathbb{Z}/2\mathbb{Z})^2$.

> [!note] Remark 9.5 — Miller Algorithm
> Công thức trên không khả thi về mặt tính toán khi $n$ lớn. **Miller algorithm** (1986) tính $f$ trong $O(\log n)$ steps qua "double-and-add" — tương tự tính $[n]P$ trên elliptic curve. Đây là cơ sở của pairing-based cryptography.

---

## Tate Module

### Định nghĩa

> [!abstract] Definition 9.6 — Tate Module
> Cho $A$ abelian variety và $\ell$ là prime $\neq \operatorname{char}(k)$. **Tate module** (mô-đun Tate) tại $\ell$ là:
>
> $$
> T_\ell(A) = \varprojlim_{m} A[\ell^m](\bar{k}),
> $$
>
> trong đó inverse limit qua các multiplication maps $[\ell] : A[\ell^{m+1}] \to A[\ell^m]$.
>
> Equivalently: một phần tử của $T_\ell(A)$ là một dãy tương thích $(P_1, P_2, P_3, \ldots)$ với $P_m \in A[\ell^m](\bar{k})$ và $\ell P_{m+1} = P_m$.

> [!abstract] Proposition 9.7 — Cấu trúc của Tate Module
> $T_\ell(A)$ là $\mathbb{Z}_\ell$-module **tự do** rank $2g$:
>
> $$
> T_\ell(A) \cong \mathbb{Z}_\ell^{2g}.
> $$
>
> **Proof sketch.** Từ $A[\ell^m](\bar{k}) \cong (\mathbb{Z}/\ell^m\mathbb{Z})^{2g}$ (đặc số $0$ hoặc $\ell \neq \operatorname{char}(k)$), inverse limit cho $\varprojlim (\mathbb{Z}/\ell^m\mathbb{Z})^{2g} \cong \mathbb{Z}_\ell^{2g}$. $\blacksquare$

> [!note] Remark 9.8 — Ý nghĩa trực giác
> $T_\ell(A)$ là "trực giác analog của $H_1(A, \mathbb{Z}_\ell)$" — homology $\ell$-adic của $A$. Trên $\mathbb{C}$, $T_\ell(A) \cong H_1(A(\mathbb{C}), \mathbb{Z}) \otimes \mathbb{Z}_\ell = \Lambda \otimes \mathbb{Z}_\ell$ (với $A = \mathbb{C}^g/\Lambda$).

### Galois Representation

> [!abstract] Theorem 9.9 — $\ell$-adic Galois Representation
> Galois group $G_k = \operatorname{Gal}(\bar{k}/k)$ tác động $\mathbb{Z}_\ell$-linearly trên $T_\ell(A)$, cho **$\ell$-adic representation**:
>
> $$
> \rho_{A, \ell} : G_k \longrightarrow \operatorname{Aut}_{\mathbb{Z}_\ell}(T_\ell(A)) \cong \operatorname{GL}_{2g}(\mathbb{Z}_\ell).
> $$
>
> Đây là representation **liên tục** (topology profinite trên $G_k$ và $\ell$-adic trên $\operatorname{GL}_{2g}(\mathbb{Z}_\ell)$).

> [!example] Example 9.10 — Cyclotomic character
> $T_\ell(\mathbb{G}_m) = T_\ell(\mu) = \varprojlim \mu_{\ell^m} \cong \mathbb{Z}_\ell$ (rank $1$).
>
> Galois action: $\sigma(\zeta) = \zeta^{\chi(\sigma)}$ với $\chi : G_k \to \mathbb{Z}_\ell^*$ là **cyclotomic character**. Với $k = \mathbb{Q}$, đây là "Galois action trên roots of unity".

### Weil Pairing trên Tate Module

> [!abstract] Theorem 9.11 — Weil Pairing trên Tate Module
> Các Weil pairings $e_{\ell^m}$ tương thích và tạo thành **perfect pairing**:
>
> $$
> T_\ell(A) \times T_\ell(A^\vee) \longrightarrow T_\ell(\mu) = \mathbb{Z}_\ell(1),
> $$
>
> trong đó $\mathbb{Z}_\ell(1) = T_\ell(\mathbb{G}_m) = \varprojlim \mu_{\ell^m}$.
>
> Pairing này:
> - **Perfect**: induce isomorphism $T_\ell(A^\vee) \cong \operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(A), \mathbb{Z}_\ell(1))$.
> - **$G_k$-equivariant**: $\langle \sigma u, \sigma v \rangle = \chi(\sigma) \langle u, v \rangle$ với $\chi$ cyclotomic character.
> - **Duality**: $T_\ell(A^\vee)$ là "Tate dual" của $T_\ell(A)$.

> [!abstract] Corollary 9.12 — Galois action trên $T_\ell(A)$ với Polarization
> Với principal polarization $\lambda : A \xrightarrow{\sim} A^\vee$, ta có isomorphism $T_\ell(A) \cong T_\ell(A^\vee)$ và pairing:
>
> $$
> T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1)
> $$
>
> là **alternating perfect pairing**. Vậy Galois action $\rho_{A,\ell}$ tác động trong:
>
> $$
> \rho_{A,\ell} : G_k \to \operatorname{GSp}_{2g}(\mathbb{Z}_\ell),
> $$
>
> trong đó $\operatorname{GSp}_{2g}$ là **general symplectic group** — bảo toàn symplectic form lên tới scalar.

---

## Tate Conjecture (Tato Giả thuyết)

> [!abstract] Theorem 9.13 — Tate Conjecture (Tate 1966, cho finite fields)
> Cho $A, B$ abelian varieties trên finite field $\mathbb{F}_q$ và prime $\ell \neq p$. Map tự nhiên:
>
> $$
> \operatorname{Hom}(A, B) \otimes_{\mathbb{Z}} \mathbb{Z}_\ell \longrightarrow \operatorname{Hom}_{G_{\mathbb{F}_q}}(T_\ell(A), T_\ell(B))
> $$
>
> là **isomorphism**.

> [!note] Remark 9.14
> Đây là một trong những định lý trung tâm của lý thuyết số hiện đại. Nó nói rằng **homomorphisms của AV có thể được hiểu hoàn toàn qua Tate modules** — tức là qua representations của Galois group. Faltings (1983) chứng minh điều này cho number fields (và từ đó suy ra Mordell conjecture).

---

## Ứng Dụng: Pairing-Based Cryptography

> [!abstract] Application 9.15 — Pairing-Based Cryptography
> Cho $E/\mathbb{F}_q$ elliptic curve với $r = |E(\mathbb{F}_q)|$ là prime lớn. **Embedding degree** $k$ là số nhỏ nhất sao cho $r \mid q^k - 1$ (tức là $\mu_r \subset \mathbb{F}_{q^k}$).
>
> **Weil pairing** (hoặc Tate pairing) cho:
>
> $$
> e : E[r] \times E[r] \to \mu_r \subset \mathbb{F}_{q^k}^*.
> $$
>
> **Ứng dụng**: Bài toán **Bilinear Diffie-Hellman** (BDH): cho $P, aP, bP, cP \in E[r]$, tính $e(P, P)^{abc}$. BDH là nền tảng của:
> - **Identity-based encryption** (Boneh–Franklin 2001)
> - **Short signatures** (Boneh–Lynn–Shacham)
> - **zkSNARKs** (pairings trong Groth16, PLONK, v.v.)
>
> Đây chính là lý do tại sao Weil pairing xuất hiện trong zkVerify!

> [!warning] Remark 9.16 — MOV Attack
> **MOV attack** (Menezes–Okamoto–Vanstone 1993) dùng Weil pairing để chuyển bài toán DLP trên $E(\mathbb{F}_q)$ thành DLP trong $\mathbb{F}_{q^k}^*$. Nếu $k$ nhỏ, điều này *phá* cryptosystem. Vì vậy, các curves dùng trong ZK (BLS12-381, BN254) được chọn cẩn thận để $k$ lớn ($k = 12$).

---

## SageMath Cheatsheet

```python
# Weil pairing trên elliptic curve
E = EllipticCurve(GF(1009), [0, -1])  # y^2 = x^3 - x
n = 4  # 4-torsion points

# Tìm điểm 4-torsion
P = E.torsion_points()
print(f"Số điểm torsion: {len(P)}")
four_tors = [pt for pt in P if 4*pt == E(0) and pt != E(0)]
print(f"4-torsion points: {four_tors[:4]}")
```

```python
# Weil pairing tường minh
E = EllipticCurve(GF(631), [30, 34])
n = 5
P = E([36, 60])   # điểm 5-torsion
Q = E([121, 387]) # điểm 5-torsion khác

# Kiểm tra P, Q là 5-torsion
print(f"5*P = {5*P}")  # phải là O
print(f"5*Q = {5*Q}")  # phải là O

# Weil pairing
wp = P.weil_pairing(Q, n)
print(f"e_5(P, Q) = {wp}")
print(f"e_5(P, Q)^5 = {wp^5}")  # phải là 1 (5th root of unity)
print(f"Alternating: e_5(Q, P) = {Q.weil_pairing(P, n)}")
print(f"e_5(P,Q) * e_5(Q,P) = {wp * Q.weil_pairing(P, n)}")  # phải = 1
```

```python
# Tate module: inverse limit của A[l^m]
# Với g=1 (elliptic curve), T_l(E) ≅ Z_l^2 (rank 2)
E = EllipticCurve(GF(1009), [0, -1])
ell = 3  # prime l

# E[3] ≅ (Z/3Z)^2
three_tors = [P for P in E if 3*P == E(0)]
print(f"|E[3]| = {len(three_tors)}")  # phải là 9 = 3^2

# E[9] ≅ (Z/9Z)^2
nine_tors = [P for P in E if 9*P == E(0)]
print(f"|E[9]| = {len(nine_tors)}")  # phải là 81 = 9^2

# T_l(E) ≅ Z_l^2: cần inverse limit
# Trong thực tế, làm việc với T_l(E) qua representation ma trận
```

```python
# Galois representation trên torsion
# Trên F_q, Galois group sinh bởi Frobenius phi_q
E = EllipticCurve(GF(101), [1, 0])
ell = 5  # prime != p = 101

# Frobenius action trên E[5]:
# phi_q(x, y) = (x^q, y^q)
# Characteristic polynomial của Frobenius trên T_l(E)
charpoly = E.frobenius_polynomial()
print(f"Char poly of Frob: {charpoly}")
# T^2 - trace*T + q

trace = E.trace_of_frobenius()
print(f"Trace of Frobenius = {trace}")
print(f"|E(F_101)| = {101 + 1 - trace} = {E.order()}")
```

```python
# Pairing-based crypto: Weil pairing cho bilinear DH
E = EllipticCurve(GF(631), [30, 34])
r = 5  # order của subgroup (phải là prime)

# Chọn generator P của E[r]
P = E([36, 60])
Q = E([121, 387])

# Weil pairing: bilinear
a, b = 3, 4
aP = a * P
bP = b * P
bQ = b * Q

# Bilinearity: e(aP, bQ) = e(P, Q)^{ab}
e_PQ = P.weil_pairing(Q, r)
e_aPbQ = aP.weil_pairing(bQ, r)
print(f"e(P,Q)^{{ab}} = {e_PQ^(a*b)}")
print(f"e(aP, bQ)  = {e_aPbQ}")
print(f"Bilinear check: {e_PQ^(a*b) == e_aPbQ}")
```

---

## Summary / Key Takeaways

- **Weil pairing** $e_n : A[n] \times A^\vee[n] \to \mu_n$: bilinear, non-degenerate, Galois equivariant.
- Với polarization $\lambda$: $e_n^\lambda(P, Q) = e_n(P, \lambda Q)$ là **alternating**, và Galois action nằm trong $\operatorname{GSp}_{2g}(\mathbb{Z}/n\mathbb{Z})$.
- **Công thức qua rational functions**: $e_n(P, Q) = f(Q+S)/f(S)$ (Miller algorithm cho $n$ lớn).
- **Tate module** $T_\ell(A) = \varprojlim A[\ell^m] \cong \mathbb{Z}_\ell^{2g}$: "homology $\ell$-adic" của $A$.
- **$\ell$-adic Galois representation**: $\rho_{A,\ell} : G_k \to \operatorname{GL}_{2g}(\mathbb{Z}_\ell)$, liên tục; với polarization nằm trong $\operatorname{GSp}_{2g}$.
- **Weil pairing trên Tate module**: perfect pairing $T_\ell(A) \times T_\ell(A^\vee) \to \mathbb{Z}_\ell(1)$; induce $T_\ell(A^\vee) \cong \operatorname{Hom}(T_\ell(A), \mathbb{Z}_\ell(1))$.
- **Tate Conjecture** (Tate 1966, finite fields; Faltings 1983, number fields): $\operatorname{Hom}(A,B) \otimes \mathbb{Z}_\ell \cong \operatorname{Hom}_{G_k}(T_\ell A, T_\ell B)$.
- **Pairing-based crypto**: Weil/Tate pairing nền tảng của BLS signatures, identity-based encryption, zkSNARKs (PLONK, Groth16). MOV attack dùng pairing để phá DLP khi embedding degree nhỏ.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §§12–13 (Étale Cohomology, Weil Pairings).
- Silverman, J. *The Arithmetic of Elliptic Curves*, §III.8 (Weil Pairing).
- Tate, J. *p-divisible groups* (Driebergen, 1967).
- Boneh, D. & Franklin, M. *Identity-based encryption from the Weil pairing* (CRYPTO 2001).
- MIT 18.783, Lecture 24 (Weil pairing, cryptographic applications).
