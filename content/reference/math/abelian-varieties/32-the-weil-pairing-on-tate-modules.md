---
title: "32. The Weil Pairing on Tate Modules"
type: theory
tags: [math, abelian-varieties, weil-pairing, tate-module, lesson-32]
aliases: [Weil Pairing on Tate Modules]
created: 2026-05-18
---

> **Prerequisites**: [[31-properties-weil-pairing|31. Properties of the Weil Pairing]], [[20-tate-module|20. The ℓ-adic Tate Module]], [[19-inverse-limits|19. Inverse Limits]]
> **Objectives**:
> - Hiểu hệ thống compatibility của Weil pairings khi $n$ thay đổi
> - Định nghĩa pairing $e_\ell: T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)$
> - Hiểu $\mathbb{Z}_\ell(1)$ là Tate twist — inverse limit của $\mu_{\ell^n}$
> - Chứng minh đây vẫn là perfect pairing trên Tate module

---

## Motivation / Intuition

Trong các bài trước, ta đã xây dựng Weil pairing:

$$
e_n : A[n] \times \hat{A}[n] \to \mu_n
$$

cho mỗi $n$ riêng lẻ. Tuy nhiên, toán học hiện đại yêu cầu làm việc với **hệ thống** các $n$ thay đổi — đặc biệt là với $n = \ell^m$ khi $m \to \infty$. Lý do: Tate module $T_\ell(A) = \varprojlim A[\ell^m]$ là một đối tượng "liên tục" hơn, phù hợp hơn cho lý thuyết Galois $\ell$-adic.

Câu hỏi tự nhiên: các pairings $e_{\ell^m}: A[\ell^m] \times \hat{A}[\ell^m] \to \mu_{\ell^m}$ có **compatible** với nhau không? Nghĩa là, khi $m$ tăng, các pairings này "fit together" thành một pairing trên Tate module không?

Câu trả lời là **có**, và điều này dẫn đến:

$$
e_\ell : T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)
$$

trong đó $\mathbb{Z}_\ell(1) = \varprojlim \mu_{\ell^m}$ — đây là **Tate twist bậc 1** (first Tate twist), đối tượng quan trọng nhất trong lý thuyết $\ell$-adic.

---

## Nhắc Lại: Tate Module

Từ Bài 20 và 21:

> [!definition] Definition 32.1 — Tate Module $T_\ell(A)$
> Cho $A/k$ abelian variety, $\ell$ là prime khác $\operatorname{char}(k)$. **$\ell$-adic Tate module** là:
>
> $$
> T_\ell(A) = \varprojlim_{m} A[\ell^m]
> $$
>
> với transition maps $[\ell]: A[\ell^{m+1}] \to A[\ell^m]$ (nhân $\ell$). Đây là $\mathbb{Z}_\ell$-module free rank $2g$.
>
> Tương tự: $T_\ell(\hat{A}) = \varprojlim_{m} \hat{A}[\ell^m]$ — free $\mathbb{Z}_\ell$-module rank $2g$.

---

## Tate Twist $\mathbb{Z}_\ell(1)$

Đây là đối tượng mà Weil pairing nhận giá trị — quan trọng để hiểu trước khi đi vào pairing.

> [!definition] Definition 32.2 — Tate Twist $\mathbb{Z}_\ell(1)$
> **$\ell$-adic Tate twist** (hay Tate module của $\mathbb{G}_m$) là:
>
> $$
> \mathbb{Z}_\ell(1) = T_\ell(\mathbb{G}_m) = \varprojlim_{m} \mu_{\ell^m}
> $$
>
> với transition maps $[\ell]: \mu_{\ell^{m+1}} \to \mu_{\ell^m}$ (nâng lên bậc $\ell$: $\zeta \mapsto \zeta^\ell$).
>
> Đây là $\mathbb{Z}_\ell$-module free rank $1$. Một **generator** của $\mathbb{Z}_\ell(1)$ là hệ tương thích $(\zeta_{\ell^m})_{m \geq 1}$ với $\zeta_{\ell^m}^{\ell} = \zeta_{\ell^{m-1}}$ — tức là một **hệ căn đơn vị compatible**.

> [!example] Example 32.3 — Generator của $\mathbb{Z}_\ell(1)$
> Chọn $\ell = 2$. Ta cần hệ $(\zeta_2, \zeta_4, \zeta_8, \ldots)$ với $\zeta_2 = e^{i\pi} = -1$, $\zeta_4 = e^{i\pi/2} = i$, $\zeta_8 = e^{i\pi/4}$, ..., thỏa $\zeta_{2^m}^2 = \zeta_{2^{m-1}}$.
>
> Trong đặc số $0$ hoặc $p \neq \ell$: $\mathbb{Z}_\ell(1)$ tự do rank $1$ trên $\mathbb{Z}_\ell$.
>
> **Galois action**: $\sigma \in \operatorname{Gal}(\bar{k}/k)$ acts trên $\mathbb{Z}_\ell(1)$ bằng cách:
>
> $$
> \sigma \cdot (\zeta_{\ell^m}) = (\sigma(\zeta_{\ell^m})) = (\zeta_{\ell^m}^{\chi_\ell(\sigma)})
> $$
>
> với $\chi_\ell(\sigma) \in \mathbb{Z}_\ell^{\times}$ là **$\ell$-adic cyclotomic character**.

> [!note] Remark 32.4 — Tại Sao "Twist"?
> $\mathbb{Z}_\ell(1)$ được gọi là "twist" vì nó là $\mathbb{Z}_\ell$ với Galois action "vặn" bởi cyclotomic character: $\sigma$ acts bằng multiplication by $\chi_\ell(\sigma)$.
>
> $\mathbb{Z}_\ell(n) = \mathbb{Z}_\ell(1)^{\otimes n}$ — twist bậc $n$ — có Galois action qua $\chi_\ell^n$.
>
> $\mathbb{Z}_\ell(0) = \mathbb{Z}_\ell$ — trivial Galois action.

---

## Compatibility của Weil Pairings

### Định Nghĩa Compatibility

Ta có family of pairings $\{e_{\ell^m}\}_{m \geq 1}$:

$$
e_{\ell^m} : A[\ell^m] \times \hat{A}[\ell^m] \to \mu_{\ell^m}
$$

> [!definition] Definition 32.5 — Compatibility của Weil Pairings
> Family $\{e_{\ell^m}\}$ là **compatible** nếu với mọi $P_m \in A[\ell^{m+1}]$, $L_m \in \hat{A}[\ell^{m+1}]$:
>
> $$
> e_{\ell^m}([\ell] P_m, L_m) = e_{\ell^{m+1}}(P_m, [\ell] L_m)
> $$
>
> Nói cách khác: các transition maps của Tate modules (nhân $[\ell]$) "chuyển vị" giữa hai slots.

> [!theorem] Theorem 32.6 — Weil Pairings Là Compatible
> Family $\{e_{\ell^m}\}$ thỏa điều kiện compatibility trên.

**Proof.**
Từ functoriality (Theorem 31.11) áp dụng cho isogeny $f = [\ell]: A \to A$ với dual $\hat{f} = [\ell]: \hat{A} \to \hat{A}$ (vì $[\ell]$ là self-dual trên AV với polarization):

$$
e_{\ell^m}([\ell] P_m, L_m) = e_{\ell^m}(P_m', [\ell] L_m)
$$

Cần kiểm tra thêm: $P_m' = [\ell] P_m \in A[\ell^m]$, và biểu thức về $e_{\ell^{m+1}}$. Đây từ bilinear:

$$
e_{\ell^{m+1}}(P_m, [\ell] L_m) = e_{\ell^{m+1}}(P_m, L_m)^{\ell} \cdot (\text{correction}) = e_{\ell^m}([\ell] P_m, L_m)
$$

Bước cuối dùng định nghĩa: $e_{\ell^m}(P, L) = e_{\ell^{m+1}}(P', L')^{\ell}$ khi $[\ell]P' = P$. $\blacksquare$

---

## Định Nghĩa Pairing Trên Tate Module

### Limit Pairing

> [!theorem] Theorem 32.7 — Weil Pairing trên Tate Modules
> Tồn tại duy nhất pairing $\mathbb{Z}_\ell$-bilinear liên tục:
>
> $$
> e_\ell : T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)
> $$
>
> được cảm ứng bởi family $\{e_{\ell^m}\}$ và compatible với transition maps.
>
> Cụ thể: với $(P_m)_m \in T_\ell(A)$ và $(L_m)_m \in T_\ell(\hat{A})$:
>
> $$
> e_\ell\left( (P_m), (L_m) \right) = (e_{\ell^m}(P_m, L_m))_m \in \varprojlim \mu_{\ell^m} = \mathbb{Z}_\ell(1)
> $$

**Proof.**
Ta cần verify rằng $(e_{\ell^m}(P_m, L_m))_m$ là hệ tương thích trong $\varprojlim \mu_{\ell^m}$. Tức cần:

$$
e_{\ell^{m+1}}(P_{m+1}, L_{m+1})^{\ell} = e_{\ell^m}(P_m, L_m)
$$

Dùng compatibility và bilinearity:

$$
e_{\ell^{m+1}}(P_{m+1}, L_{m+1})^{\ell} = e_{\ell^{m+1}}([\ell] P_{m+1}, L_{m+1}) = e_{\ell^{m+1}}(P_m, L_{m+1})
$$

Và $e_{\ell^{m+1}}(P_m, L_{m+1}) = e_{\ell^m}(P_m, [\ell] L_{m+1}) = e_{\ell^m}(P_m, L_m)$ (từ compatibility theo chiều kia). $\blacksquare$

---

## Tính Perfect Trên Tate Module

> [!theorem] Theorem 32.8 — Perfect Pairing trên $T_\ell$
> Pairing $e_\ell: T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)$ là **perfect**: map cảm ứng
>
> $$
> T_\ell(A) \xrightarrow{\sim} \operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(\hat{A}), \mathbb{Z}_\ell(1))
> $$
>
> là isomorphism của $\mathbb{Z}_\ell$-modules (và của Galois modules).
>
> Tương tự $T_\ell(\hat{A}) \xrightarrow{\sim} \operatorname{Hom}_{\mathbb{Z}_\ell}(T_\ell(A), \mathbb{Z}_\ell(1))$.

**Proof.**
Từ non-degeneracy trên $A[\ell^m]$: map $A[\ell^m] \to \operatorname{Hom}(\hat{A}[\ell^m], \mu_{\ell^m})$ là isomorphism. Taking inverse limit: $T_\ell(A) \to \varprojlim \operatorname{Hom}(\hat{A}[\ell^m], \mu_{\ell^m})$.

Ta cần identify $\varprojlim \operatorname{Hom}(\hat{A}[\ell^m], \mu_{\ell^m}) \cong \operatorname{Hom}(T_\ell(\hat{A}), \mathbb{Z}_\ell(1))$.

Điều này từ công thức $\operatorname{Hom}_{\mathbb{Z}_\ell}(\varprojlim M_n, N) \cong \varinjlim \operatorname{Hom}(M_n, N)$ (khi các $M_n$ là finite và $N$ là complete). $\blacksquare$

---

## Pairing Sau Khi Tensor $\mathbb{Q}_\ell$

Thực tế, hay làm việc với $V_\ell(A) = T_\ell(A) \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell$ (vector space hữu chiều trên $\mathbb{Q}_\ell$).

> [!definition] Definition 32.9 — Rational Weil Pairing
> Tensor hóa pairing $e_\ell$ với $\mathbb{Q}_\ell$:
>
> $$
> e_\ell \otimes \mathbb{Q}_\ell : V_\ell(A) \times V_\ell(\hat{A}) \to \mathbb{Q}_\ell(1) = \mathbb{Z}_\ell(1) \otimes \mathbb{Q}_\ell
> $$
>
> Đây là $\mathbb{Q}_\ell$-bilinear perfect pairing giữa hai $\mathbb{Q}_\ell$-vector spaces chiều $2g$.

> [!note] Remark 32.10 — Symplectic Group
> Khi $A$ có polarization $\phi: A \xrightarrow{\sim} \hat{A}$, ta cảm ứng pairing alternating:
>
> $$
> e_\ell^\phi : V_\ell(A) \times V_\ell(A) \to \mathbb{Q}_\ell(1)
> $$
>
> Galois action bảo toàn pairing này, cho Galois representation:
>
> $$
> \rho_\ell : \operatorname{Gal}(\bar{k}/k) \to \operatorname{GSp}(V_\ell(A), e_\ell^\phi) \cong \operatorname{GSp}_{2g}(\mathbb{Q}_\ell)
> $$
>
> vào **symplectic similitude group** $\operatorname{GSp}_{2g}$. "Similitude factor" là cyclotomic character $\chi_\ell$.

---

## Ví Dụ Cụ Thể: Tate Module Của Elliptic Curve

Với $E/k$ elliptic curve và $\ell \neq \operatorname{char}(k)$:

$$
T_\ell(E) \cong \mathbb{Z}_\ell^2, \quad T_\ell(\hat{E}) \cong T_\ell(E) \cong \mathbb{Z}_\ell^2
$$

(vì $\hat{E} \cong E$).

> [!example] Example 32.11 — Weil Pairing Matrix trên $T_\ell(E)$
> Chọn bases $\{e_1, e_2\}$ cho $T_\ell(E)$. Pairing $e_\ell^\phi: T_\ell(E) \times T_\ell(E) \to \mathbb{Z}_\ell(1)$ được cho bởi matrix:
>
> $$
> J = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}
> $$
>
> (matrix symplectic chuẩn). Galois action: $\rho_\ell(\sigma) \in \operatorname{GL}_2(\mathbb{Z}_\ell)$ với:
>
> $$
> \rho_\ell(\sigma)^T J \rho_\ell(\sigma) = \chi_\ell(\sigma) \cdot J
> $$
>
> Tức $\rho_\ell: \operatorname{Gal}(\bar{k}/k) \to \operatorname{GSp}_2(\mathbb{Z}_\ell) \cong \operatorname{GL}_2(\mathbb{Z}_\ell)$ (cho $g=1$).

> [!example] Example 32.12 — Supersingular Curve và Weil Pairing
> Cho $E: y^2 = x^3 + x$ trên $\mathbb{F}_7$ (supersingular: $t = 0$). Frobenius $\pi_E$ có char poly $X^2 + 7$.
>
> Trên $T_\ell(E)$: $\pi_E$ acts với char poly $X^2 + 7 \in \mathbb{Z}[X]$.
>
> Galois-equivariance của Weil pairing: $\det(\rho_\ell(\pi_E)) = \chi_\ell(\pi_E) = 7$ (eigenvalue của Frobenius trên $\mathbb{Z}_\ell(1)$ là $q = 7$).
>
> Check: $\det(\rho_\ell(\pi_E))$ = constant term của char poly = $7$. Consistent! Đây là manifestation của Galois-equivariance.

---

## Duality Theorem (Tate)

Một trong những định lý sâu nhất kết nối Weil pairing trên Tate module với cấu trúc của endomorphism algebra:

> [!theorem] Theorem 32.13 — Tate's Duality for AV
> Cho $A/k$ abelian variety với $k$ finitely generated over its prime field. Weil pairing cảm ứng isomorphism:
>
> $$
> \operatorname{Hom}(A, \hat{A}) \otimes \mathbb{Z}_\ell \xrightarrow{\sim} \left\{ f \in \operatorname{Hom}(T_\ell(A), T_\ell(\hat{A})) \mid f \text{ preserves Weil pairing} \right\}
> $$
>
> Đặc biệt khi $k = \mathbb{F}_q$: mọi $\mathbb{Z}_\ell[\operatorname{Gal}]$-homomorphism $T_\ell(A) \to T_\ell(\hat{A})$ đến từ một geometric isogeny $A \to \hat{A}$.

---

## Mối Quan Hệ Với Poincaré Bundle

Weil pairing trên Tate module có mô tả đẹp qua Poincaré bundle $\mathcal{P}$ trên $A \times \hat{A}$:

$$
e_\ell = T_\ell(\text{restriction of } \mathcal{P} \text{ to } A[n] \times \hat{A}[n])
$$

Poincaré bundle restricted đến $A[\ell^m] \times \hat{A}[\ell^m]$ cho một $\mu_{\ell^m}$-torsor, và taking inverse limit cho $\mathbb{Z}_\ell(1)$-torsor. Weil pairing là "trivializer" của torsor này.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(QQ, [0, 1])
ell = 5
E_mod = E.change_ring(GF(7))
print("E mod 7:", E_mod)
print("|E(F_7)| =", E_mod.order())

P7 = E_mod(0, 1)
Q7 = E_mod(0, 6)
print("P7 =", P7, "order:", P7.order())
print("Q7 =", Q7, "order:", Q7.order())

for m in range(1, 4):
    n = ell**m
    print(f"Computing e_{n}...")

p = 5
for m in range(1, 5):
    nm = p**m
    print(f"mu_{nm} subset F_{p}: {(p-1) % nm == 0}")
    print(f"mu_{nm} subset F_{p^2}: {(p**2-1) % nm == 0}")
```

---

## Summary / Key Takeaways

- Weil pairings $e_{\ell^m}: A[\ell^m] \times \hat{A}[\ell^m] \to \mu_{\ell^m}$ tạo thành **compatible system**.
- Compatibility: $e_{\ell^{m+1}}(P_{m+1}, L_{m+1})^{\ell} = e_{\ell^m}(P_m, L_m)$ với transition maps đúng.
- $\mathbb{Z}_\ell(1) = \varprojlim \mu_{\ell^m}$ — **Tate twist bậc 1** — là rank-1 $\mathbb{Z}_\ell$-module với Galois action qua $\chi_\ell$.
- Limit pairing: $e_\ell: T_\ell(A) \times T_\ell(\hat{A}) \to \mathbb{Z}_\ell(1)$ là perfect $\mathbb{Z}_\ell$-bilinear.
- Với polarization: $e_\ell^\phi: T_\ell(A) \times T_\ell(A) \to \mathbb{Z}_\ell(1)$ cho cấu trúc symplectic.
- Galois representation: $\rho_\ell: \operatorname{Gal}(\bar{k}/k) \to \operatorname{GSp}_{2g}(\mathbb{Z}_\ell)$ với similitude $\chi_\ell$.
- Với $E/\mathbb{F}_q$: $\det(\rho_\ell(\operatorname{Frob}_q)) = q$ — consistent với Weil conjectures.

---

## References

- Milne, J. S. *Abelian Varieties*, Section 15 (Weil Pairings on Tate Modules). jmilne.org/math.
- Serre, J.-P. *Abelian ℓ-Adic Representations and Elliptic Curves*, Chapter II. Benjamin, 1968.
- Tate, J. "p-Divisible Groups." In *Proceedings of a Conference on Local Fields*, 1967.
- Mumford, D. *Abelian Varieties*, Chapter IV. Oxford University Press.
- Neukirch, J., Schmidt, A., Wingberg, K. *Cohomology of Number Fields*, Chapter VII.
