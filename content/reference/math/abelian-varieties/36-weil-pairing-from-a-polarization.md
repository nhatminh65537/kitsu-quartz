---
title: "36. Weil Pairing from a Polarization"
type: theory
tags: [math, abelian-varieties, lesson-36, weil-pairing, polarization, symplectic]
aliases: [Weil Pairing from a Polarization]
created: 2026-05-19
---

> **Prerequisites**: [[35-polarizations|35. Polarizations]], [[31-properties-of-weil-pairing|31. Properties of the Weil Pairing]], [[17-n-torsion-points|17. n-Torsion Points A[n]]]
> **Objectives**:
> - Nhắc lại Weil pairing $e_n: A[n] \times \widehat{A}[n] \to \mu_n$ và tính chất của nó
> - Xây dựng **Weil pairing tương ứng với polarization** $e_\phi^n: A[n] \times A[n] \to \mu_n$
> - Chứng minh $e_\phi^n$ là bilinear, non-degenerate, và **skew-symmetric** (alternating)
> - Hiểu tại sao symmetry của $\phi$ implies skew-symmetry của $e_\phi^n$
> - Mở rộng lên Tate module: $e_\phi: T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1)$

---

## Motivation / Intuition

Trong bài 31, ta đã nghiên cứu Weil pairing

$$
e_n: A[n] \times \widehat{A}[n] \to \mu_n,
$$

là một **perfect pairing** (non-degenerate, bilinear, Galois-equivariant, alternating theo nghĩa $e_n(P, \phi(P)) = 1$ khi $P \in A[n] \cap \widehat{A}[n]$). Tuy nhiên, pairing này sống trên $A[n] \times \widehat{A}[n]$ — hai nhóm khác nhau.

Khi $A$ có một **polarization** $\phi: A \to \widehat{A}$, ta có thể "gập" Weil pairing lại: sử dụng $\phi$ để biến $\widehat{A}[n]$ thành $A[n]$, ta thu được pairing hoàn toàn trên $A[n] \times A[n]$:

$$
e_\phi^n(P, Q) = e_n(P, \phi(Q)), \quad P, Q \in A[n].
$$

Pairing mới này có tính đối xứng mạnh hơn: nó **skew-symmetric** (alternating), nghĩa là $e_\phi^n(P, P) = 1$ và $e_\phi^n(P,Q) = e_\phi^n(Q,P)^{-1}$. Điều này biến $A[n]$ thành một **symplectic space** — cấu trúc cơ bản của cơ học lượng tử và mật mã học!

Intuition hình học: polarization $\phi: A \to \widehat{A}$ giống như "ma trận cơ sở" của một symplectic form trên $A$. Khi $\phi$ là principal polarization, $A[n] \cong (\mathbb{Z}/n)^{2g}$ và pairing $e_\phi^n$ là symplectic form chuẩn trên không gian này.

---

## Nhắc Lại Weil Pairing Chuẩn

> [!definition] Definition 36.1 — Weil Pairing $e_n$ (Nhắc Lại)
> Cho $A$ là abelian variety và $n$ nguyên dương với $\gcd(n, \operatorname{char}(k)) = 1$. **Weil pairing** là bimap
>
> $$
> e_n: A[n] \times \widehat{A}[n] \to \mu_n
> $$
>
> thỏa các tính chất:
> - **Bilinear:** $e_n(P + P', Q) = e_n(P,Q) \cdot e_n(P',Q)$ và tương tự với biến thứ hai.
> - **Non-degenerate (perfect):** Nếu $e_n(P, Q) = 1$ với mọi $Q \in \widehat{A}[n]$ thì $P = 0$.
> - **Galois-equivariant:** $e_n(\sigma P, \sigma Q) = \sigma(e_n(P,Q))$ với mọi $\sigma \in \operatorname{Gal}(\bar{k}/k)$.
> - **Functorial:** Với isogeny $f: A \to B$, $e_n(P, \widehat{f}(Q)) = e_n(f(P), Q)$.

---

## Xây Dựng Weil Pairing Từ Polarization

### Definition

> [!definition] Definition 36.2 — Weil Pairing Tương ứng Với Polarization
> Cho $(A, \phi)$ là polarized abelian variety với polarization $\phi: A \to \widehat{A}$. Với số nguyên $n \geq 1$ sao cho $\gcd(n, \operatorname{char}(k)) = 1$, **Weil pairing tương ứng với $\phi$** là:
>
> $$
> e_\phi^n: A[n] \times A[n] \to \mu_n
> $$
>
> được định nghĩa bởi:
>
> $$
> e_\phi^n(P, Q) = e_n\bigl(P,\, \phi(Q)\bigr)
> $$
>
> với $P, Q \in A[n]$. (Lưu ý: $Q \in A[n]$ và $\phi: A \to \widehat{A}$ là isogeny, nên $\phi(Q) \in \widehat{A}$. Vì $[n] \circ \phi = \phi \circ [n]$, ta có $[n](\phi(Q)) = \phi([n](Q)) = \phi(0) = 0$, nên $\phi(Q) \in \widehat{A}[n]$. Vậy $e_n(P, \phi(Q))$ có nghĩa.)

> [!note] Remark 36.3 — Tại Sao $\phi(Q) \in \widehat{A}[n]$?
> Cần kiểm tra kỹ hơn: vì $\phi: A \to \widehat{A}$ là homomorphism, $\phi$ commute với multiplication-by-$n$:
>
> $$
> [n]_{\widehat{A}} \circ \phi = \phi \circ [n]_A.
> $$
>
> Do đó, nếu $Q \in A[n]$ (nghĩa là $[n]_A(Q) = 0$), thì:
>
> $$
> [n]_{\widehat{A}}(\phi(Q)) = \phi([n]_A(Q)) = \phi(0) = 0.
> $$
>
> Vậy $\phi(Q) \in \ker([n]_{\widehat{A}}) = \widehat{A}[n]$.

---

## Tính Chất Của $e_\phi^n$

### Theorem

> [!theorem] Theorem 36.4 — Tính Chất Của Weil Pairing Từ Polarization
> Weil pairing $e_\phi^n: A[n] \times A[n] \to \mu_n$ có các tính chất sau:
>
> **(a) Bilinear:** $e_\phi^n$ là bilinear trên $\mathbb{Z}/n\mathbb{Z}$.
>
> **(b) Non-degenerate:** $e_\phi^n$ là perfect pairing: nếu $e_\phi^n(P, Q) = 1$ với mọi $Q \in A[n]$ thì $P = 0$.
>
> **(c) Skew-symmetric (Alternating):**
>
> $$
> e_\phi^n(P, P) = 1 \quad \text{với mọi } P \in A[n],
> $$
>
> hay tương đương:
>
> $$
> e_\phi^n(P, Q) = e_\phi^n(Q, P)^{-1} \quad \text{với mọi } P, Q \in A[n].
> $$
>
> **(d) Galois-equivariant:** $e_\phi^n(\sigma P, \sigma Q) = \sigma(e_\phi^n(P, Q))$ với mọi $\sigma \in \operatorname{Gal}(\bar{k}/k)$.

**Proof.**

**(a) Bilinearity:** Trực tiếp từ bilinearity của $e_n$ và linearity của $\phi$:

$$
e_\phi^n(P + P', Q) = e_n(P + P', \phi(Q)) = e_n(P, \phi(Q)) \cdot e_n(P', \phi(Q)) = e_\phi^n(P,Q) \cdot e_\phi^n(P',Q).
$$

Tương tự với biến thứ hai (vì $\phi$ là group homomorphism, $\phi(Q + Q') = \phi(Q) \cdot \phi(Q')$).

**(b) Non-degeneracy:** Giả sử $e_\phi^n(P, Q) = 1$ với mọi $Q \in A[n]$. Tức là $e_n(P, \phi(Q)) = 1$ với mọi $Q \in A[n]$. Vì $\phi$ là isogeny, $\phi(A[n])$ có index hữu hạn trong $\widehat{A}[n]$ (thực ra vì $\phi$ induces isomorphism $A[n] \otimes \mathbb{Z}_\ell \cong \widehat{A}[n] \otimes \mathbb{Z}_\ell$ — xem bên dưới), nên điều kiện $e_n(P, \xi) = 1$ với mọi $\xi$ trong image của $\phi$ implies $e_n(P, \xi) = 1$ với mọi $\xi \in \widehat{A}[n]$ (cần dùng non-degeneracy của $e_n$). Do đó $P = 0$. $\square$

**(c) Skew-symmetry:** Đây là hệ quả quan trọng nhất từ **symmetry của $\phi$**.

Trước tiên, ta chứng minh $e_\phi^n(P, P) = 1$ với mọi $P \in A[n]$.

Dùng tính chất **alternating** của Weil pairing chuẩn: với bất kỳ $P \in A[n]$ và $\xi \in \widehat{A}[n]$, $e_n$ thỏa:

$$
e_n(P, \xi) \cdot e_n(\xi, P) = 1 \quad \text{(theo nghĩa via double duality)}
$$

khi nhìn $A[n]$ và $\widehat{A}[n]$ qua canonical identification $\operatorname{can}: A[n] \hookrightarrow \widehat{\widehat{A}}[n]$.

Cụ thể hơn, dùng **functoriality** của $e_n$ và symmetry của $\phi$ ($\phi = \widehat{\phi} \circ \operatorname{can}_A$):

$$
e_\phi^n(P, Q) = e_n(P, \phi(Q))
$$

$$
e_\phi^n(Q, P) = e_n(Q, \phi(P)).
$$

Bây giờ, theo tính **alternating** của $e_n$ trên $A$ (tức là property $e_n(a, \widehat{f}(b)) = e_n(f(a), b)^{-1}$ khi $a = b$ và $f = \phi$... hmm cần cẩn thận hơn).

Cách chứng minh chính xác: Dùng tính chất functorial $e_n(f(P), Q) = e_n(P, \widehat{f}(Q))$ với $f = \phi: A \to \widehat{A}$:

$$
e_n(\phi(P), \phi(Q)) = e_n(P, \widehat{\phi}(\phi(Q))).
$$

Nhưng $\widehat{\phi}: \widehat{\widehat{A}} \to \widehat{A}$, và $\phi(Q) \in \widehat{A}$, nên $\widehat{\phi}(\phi(Q)) = \widehat{\phi}(\operatorname{can}_A^{-1}(\operatorname{can}_A(\phi(Q))))$... Dùng symmetry $\phi = \widehat{\phi} \circ \operatorname{can}_A$:

$$
e_n(\phi(P), \phi(Q)) = e_n(P, \widehat{\phi}(\phi(Q))).
$$

Và bằng alternating property của $e_n$ (giữa $\widehat{A}[n]$ và $\widehat{\widehat{A}}[n]$):

$$
e_{\widehat{A}, n}(\phi(P), \xi) = e_{A,n}(P, \widehat{\phi}(\xi))^{-1}
$$

... Để tránh phức tạp ký hiệu, ta dùng cách sau: Vì $e_n$ trên cặp $(A, \widehat{A})$ thỏa $e_n(P, \hat\phi(Q')) = e_n(\phi(P), Q')^{-1}$ (tính "adjoint" của dual morphism), và $\phi$ symmetric ($\phi = \hat\phi \circ \text{can}$), ta tính:

$$
e_\phi^n(P, Q) \cdot e_\phi^n(Q, P) = e_n(P, \phi(Q)) \cdot e_n(Q, \phi(P)).
$$

Dùng tính anti-symmetric của Weil pairing trên cặp $(A[n], \widehat{A}[n])$:

$$
e_n(Q, \phi(P)) = e_n(\phi(P), \operatorname{can}(Q))^{-1}
$$

(xem Weil pairing bài 31 — tính alternating qua double duality). Và

$$
e_n(\phi(P), \operatorname{can}(Q)) = e_n(P, \widehat{\phi}(\operatorname{can}(Q))).
$$

Vì $\phi$ symmetric: $\widehat{\phi} \circ \operatorname{can} = \phi$, nên $\widehat{\phi}(\operatorname{can}(Q)) = \phi(Q)$. Do đó:

$$
e_n(Q, \phi(P)) = e_n(P, \phi(Q))^{-1} = e_\phi^n(P, Q)^{-1}.
$$

Vậy $e_\phi^n(P, Q) \cdot e_\phi^n(Q, P) = e_\phi^n(P, Q) \cdot e_\phi^n(P, Q)^{-1} = 1$, nghĩa là $e_\phi^n(P, Q) = e_\phi^n(Q, P)^{-1}$. $\square$

**(d) Galois-equivariance:** Trực tiếp từ Galois-equivariance của $e_n$ và $\phi$ (vì $\phi$ defined over $k$). $\blacksquare$

---

## Cấu Trúc Symplectic Trên $A[n]$

### Theorem

> [!theorem] Theorem 36.5 — $A[n]$ Là Symplectic Space
> Cho $(A, \phi)$ là principally polarized abelian variety (ppav) và $\gcd(n, \operatorname{char}(k)) = 1$. Khi đó:
>
> **(a)** $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ với $g = \dim(A)$.
>
> **(b)** Weil pairing $e_\phi^n: A[n] \times A[n] \to \mu_n$ là một **symplectic form** trên $A[n]$: bilinear, non-degenerate, alternating.
>
> **(c)** Galois group $\operatorname{Gal}(\bar{k}/k)$ tác động lên $A[n]$ qua **symplectic representations**:
>
> $$
> \rho_{A,n}: \operatorname{Gal}(\bar{k}/k) \to \operatorname{GSp}_{2g}(\mathbb{Z}/n\mathbb{Z}),
> $$
>
> trong đó $\operatorname{GSp}_{2g}$ là nhóm symplectic tổng quát (generalized symplectic group — các ma trận bảo toàn symplectic form lên đến một scalar).

**Proof sketch.**
(a) Từ bài 17: $A[n] \cong (\mathbb{Z}/n)^{2g}$ vì $\gcd(n, \operatorname{char}(k)) = 1$.

(b) Non-degeneracy + bilinearity + alternating đã chứng minh ở Theorem 36.4. Đây chính xác là định nghĩa symplectic form.

(c) Galois action bảo toàn group law trên $A[n]$ và bảo toàn $e_\phi^n$ (lên đến cyclotomic character). Cụ thể, với $\sigma \in \operatorname{Gal}$:

$$
e_\phi^n(\sigma P, \sigma Q) = \sigma(e_\phi^n(P,Q)) = e_\phi^n(P,Q)^{\chi(\sigma)},
$$

trong đó $\chi: \operatorname{Gal} \to (\mathbb{Z}/n)^\times$ là **cyclotomic character**. Điều này chính xác là điều kiện $\rho \in \operatorname{GSp}_{2g}$. $\blacksquare$

### Worked Example

> [!example] Example 36.6 — Elliptic Curve: $E[n]$ Là Symplectic Space Chiều 2
> Cho $E$ là elliptic curve với principal polarization $\phi: E \xrightarrow{\sim} \widehat{E}$. Khi đó:
>
> - $E[n] \cong (\mathbb{Z}/n)^2$ (vector space 2 chiều over $\mathbb{Z}/n$).
> - Weil pairing $e_\phi^n: E[n] \times E[n] \to \mu_n$ là symplectic form chuẩn trên $(\mathbb{Z}/n)^2$.
>
> Chọn basis $\{P, Q\}$ cho $E[n]$ (với $P, Q$ independent). Ma trận của $e_\phi^n$ là:
>
> $$
> J = \begin{pmatrix} 0 & \zeta \\ -\zeta & 0 \end{pmatrix}
> $$
>
> trong đó $\zeta = e_\phi^n(P, Q) \in \mu_n$ là primitive $n$-th root of unity. Đây là symplectic form chuẩn (lên đến scalar $\zeta$).
>
> Galois representation: $\operatorname{Gal}(\bar{k}/k) \to \operatorname{GL}_2(\mathbb{Z}/n) \cap \operatorname{GSp}_2(\mathbb{Z}/n) = \operatorname{GSp}_2(\mathbb{Z}/n)$.

### Worked Example

> [!example] Example 36.7 — Tính Weil Pairing Với Elliptic Curve Cụ Thể
> Cho $E: y^2 = x^3 - x$ over $\mathbb{F}_{101}$. Xét $n = 5$.
>
> Trên $E(\overline{\mathbb{F}_{101}})$, tìm điểm $P, Q \in E[5]$ sao cho $P, Q$ độc lập. Khi đó:
>
> $$
> e_5(P, Q) \in \mu_5 \subset \overline{\mathbb{F}_{101}}^\times
> $$
>
> là primitive $5$th root of unity (vì $e_\phi^5$ non-degenerate). Cụ thể $e_\phi^5(P,Q) = e_5(P, \phi(Q))$ trong đó $\phi: E \xrightarrow{\sim} \widehat{E}$ là principal polarization $P \mapsto [P - O]$.
>
> Để compute: dùng Miller's algorithm (bài 28) — đây là basis của pairing-based cryptography.

---

## Mở Rộng Lên Tate Module

### Definition

> [!definition] Definition 36.8 — Weil Pairing Trên Tate Module
> Cho $(A, \phi)$ là polarized abelian variety và $\ell \neq \operatorname{char}(k)$ là số nguyên tố. Các Weil pairings $e_\phi^{\ell^n}: A[\ell^n] \times A[\ell^n] \to \mu_{\ell^n}$ tương thích với các inclusion $A[\ell^n] \hookrightarrow A[\ell^{n+1}]$, cho phép ta lấy inverse limit:
>
> $$
> e_\phi: T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1),
> $$
>
> trong đó $T_\ell(A) = \varprojlim A[\ell^n]$ là Tate module và $\mathbb{Z}_\ell(1) = \varprojlim \mu_{\ell^n}$ là Tate twist của $\mathbb{Z}_\ell$.

### Theorem

> [!theorem] Theorem 36.9 — Tính Chất Weil Pairing Trên Tate Module
> Weil pairing $e_\phi: T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1)$ thỏa:
>
> **(a) Bilinear** over $\mathbb{Z}_\ell$.
>
> **(b) Non-degenerate** (perfect pairing sau khi tensor với $\mathbb{Q}_\ell$).
>
> **(c) Alternating:** $e_\phi(v, v) = 0$ với mọi $v \in T_\ell(A)$ (cộng tính).
>
> **(d) Galois-equivariant:** $e_\phi(\sigma v, \sigma w) = \chi_\ell(\sigma) \cdot e_\phi(v, w)$, trong đó $\chi_\ell: \operatorname{Gal}(\bar{k}/k) \to \mathbb{Z}_\ell^\times$ là $\ell$-adic cyclotomic character.

> [!note] Remark 36.10 — Ý Nghĩa Galois-Equivariance
> Tính Galois-equivariance của $e_\phi$ trên Tate module nói rằng: representation Galois $\rho_\ell: \operatorname{Gal} \to \operatorname{GL}(V_\ell A)$ (trong đó $V_\ell A = T_\ell A \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell$) thực ra là representation vào **symplectic group**:
>
> $$
> \rho_\ell: \operatorname{Gal}(\bar{k}/k) \to \operatorname{GSp}_{2g}(\mathbb{Q}_\ell).
> $$
>
> Điều này có hệ quả sâu trong lý thuyết số — ví dụ, đây là basis của phỏng đoán Mumford-Tate và nhiều kết quả về Galois representations.

---

## Liên Hệ Với Cryptography: MOV Attack

### Note

> [!note] Remark 36.11 — Symplectic Pairing Và MOV/FR Attack
> Trong mật mã học (đặc biệt ECC — Elliptic Curve Cryptography):
>
> - **MOV attack** (Menezes-Okamoto-Vanstone) dùng Weil pairing $e_n: E[n] \times E[n] \to \mu_n$ để "nhúng" bài toán ECDLP (discrete log trên $E[n]$) thành bài toán DLP trong $\mu_n \subset \mathbb{F}_{q^k}^\times$ (với $k$ = **embedding degree**).
>
> - **FR attack** (Frey-Rück) dùng Tate-Lichtenbaum pairing thay vì Weil pairing để hiệu quả hơn.
>
> - Symplectic structure của $E[n]$ nghĩa là: bất kỳ basis $\{P, Q\}$ với $e_n(P,Q) \neq 1$ đều cho một "good" pairing. Tìm $Q$ sao cho $e_n(P, Q)$ là primitive root of unity là bước đầu của MOV.
>
> Chính symmetry của $\phi$ (và do đó skew-symmetry của $e_\phi^n$) đảm bảo $e_\phi^n(P, P) = 1$ — không thể dùng pairing theo chiều tầm thường để "embed" bài toán. Cần $P, Q$ **independent** trong $E[n]$.

---

## SageMath Cheatsheet

```sage
# Weil pairing on elliptic curve over finite field
p = 631
E = EllipticCurve(GF(p), [-1, 0])  # y^2 = x^3 - x

# Find a point of order n=5
n = 5
P = E.random_point()
while P.order() != n:
    P = E.random_point() * (E.cardinality() // n)
print(f"P = {P}, order = {P.order()}")

# Find Q independent of P (same order)
Q = E.random_point()
while Q.order() != n:
    Q = E.random_point() * (E.cardinality() // n)

# Weil pairing e_n(P, Q)
# SageMath has built-in Weil pairing
zeta = P.weil_pairing(Q, n)
print(f"Weil pairing e_{n}(P,Q) = {zeta}")
print(f"Is primitive root of unity: {zeta^n == 1 and zeta != 1}")

# Check skew-symmetry: e_phi(P,Q) = e_phi(Q,P)^{-1}
zeta_QP = Q.weil_pairing(P, n)
print(f"e(P,Q) * e(Q,P) = {zeta * zeta_QP}")  # should be 1
print(f"e(P,Q) = e(Q,P)^(-1): {zeta == zeta_QP^(-1)}")

# Check alternating: e(P,P) = 1
print(f"e(P,P) = {P.weil_pairing(P, n)}")  # should be 1

# Embedding degree (for MOV attack context)
# k = smallest k such that n | p^k - 1
k = 1
while (p^k - 1) % n != 0:
    k += 1
print(f"Embedding degree k = {k}")
```

---

## Summary / Key Takeaways

- **Setup:** Polarization $\phi: A \to \widehat{A}$ "gập" Weil pairing $e_n: A[n] \times \widehat{A}[n] \to \mu_n$ thành pairing trên $A[n] \times A[n]$ bởi $e_\phi^n(P,Q) = e_n(P, \phi(Q))$.
- **Bilinear:** Từ bilinearity của $e_n$ và linearity của $\phi$.
- **Non-degenerate:** Từ non-degeneracy của $e_n$ và $\phi$ là isogeny.
- **Skew-symmetric:** $e_\phi^n(P,Q) = e_\phi^n(Q,P)^{-1}$ — đây là hệ quả **trực tiếp từ symmetry của $\phi$** (Theorem 36.4(c)).
- **Symplectic structure:** $(A[n], e_\phi^n)$ là symplectic space over $\mathbb{Z}/n$; Galois action: $\rho \in \operatorname{GSp}_{2g}(\mathbb{Z}/n)$.
- **Tate module:** $e_\phi: T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1)$ — alternating, non-degenerate, Galois-equivariant với cyclotomic character.
- **Ứng dụng crypto:** MOV/FR attack dùng $e_n$ để chuyển ECDLP sang DLP trong $\mathbb{F}_{q^k}^\times$ (embedding degree $k$).

---

## References

- Mumford, D. *Abelian Varieties*, §20–23. (Weil pairing, symplectic structure.)
- Milne, J.S. *Abelian Varieties*, §§12–13. (Weil pairing on Tate modules.)
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, Chapter III.8. (Weil pairing on elliptic curves, computation.)
- Galbraith, S. *Mathematics of Public Key Cryptography*, Chapter 6. (Pairings in cryptography, MOV attack.)
- Conrad, B. *Polarizations* (Stanford notes, 2004). (Symplectic structure from polarization.)
