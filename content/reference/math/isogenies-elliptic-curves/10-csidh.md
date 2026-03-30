---
title: "10. CSIDH"
type: scheme
tags: [crypto, isogeny, CSIDH, post-quantum, key-exchange, lesson-10]
aliases: [CSIDH, Commutative Supersingular Isogeny DH]
created: 2026-03-24
---

> **Prerequisites**: [[08-quadratic-orders-ideal-class|08. Imaginary Quadratic Orders & Ideal Class Groups]], [[06-ordinary-supersingular|06. Ordinary vs Supersingular]], [[03-velu-formulas|03. Vélu's Formulas]]
> **Lesson type**: Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Prime $\equiv 3 \pmod 4$, dạng $p = 4\ell_1\cdots\ell_n - 1$ |
> | $E_0$ | Đường cong cơ sở: $y^2 = x^3 + x$ trên $\mathbb{F}_p$ |
> | $\mathcal{O}$ | Order $\mathbb{Z}[\pi_p] \cong \mathbb{Z}[\sqrt{-p}]$ trong $\mathbb{Q}(\sqrt{-p})$ |
> | $\ell_1, \ldots, \ell_n$ | Small odd primes chia hết $p+1$; basis của class group |
> | $\mathfrak{l}_i, \bar{\mathfrak{l}}_i$ | Prime ideals norm $\ell_i$ trong $\mathcal{O}$: $\ell_i\mathcal{O} = \mathfrak{l}_i\bar{\mathfrak{l}}_i$ |
> | $\mathbf{e} = (e_1, \ldots, e_n)$ | Secret key vector, $e_i \in \{-B, \ldots, B\}$ |
> | $E_A$ | Public key của Alice: $[\mathfrak{l}_1^{e_1}\cdots\mathfrak{l}_n^{e_n}] \star E_0$ |
> | $A \in \mathbb{F}_p$ | Montgomery coefficient: $E_A: y^2 = x^3 + Ax^2 + x$ |

---

## Motivation: Diffie-Hellman Post-Quantum

CSIDH (Castryck, Lange, Martindale, Panny, Renes — ASIACRYPT 2018) là câu trả lời cho bài toán: *làm sao xây dựng Diffie-Hellman key exchange an toàn trước quantum computers?*

Diffie-Hellman kinh điển dựa trên group action: $g^{ab} = (g^a)^b = (g^b)^a$. CSIDH thay thế group $\mathbb{Z}/p\mathbb{Z}$ bằng **ideal class group $\text{cl}(\mathcal{O})$** tác động lên tập supersingular curves trên $\mathbb{F}_p$:

$$
[\mathfrak{a}] \star ([\mathfrak{b}] \star E_0) = [\mathfrak{a}\mathfrak{b}] \star E_0 = [\mathfrak{b}] \star ([\mathfrak{a}] \star E_0)
$$

Commutativity của $\text{cl}(\mathcal{O})$ cho phép Alice và Bob tính shared secret mà không cần trao đổi thêm thông tin — **non-interactive key exchange**.

---

## 1. Mathematical Setting

> [!note] Mathematical Setting 10.1 — CSIDH Parameters
> **Trường cơ sở**: $\mathbb{F}_p$ với $p = 4\ell_1\ell_2\cdots\ell_n - 1$ là prime, $p \equiv 3 \pmod 4$.
>
> **Tính chất của $p$**: Vì $p \equiv 3 \pmod 4$, đường cong $E_0: y^2 = x^3 + x$ là supersingular trên $\mathbb{F}_p$ (j-invariant 1728, trace $t = 0$).
>
> **Frobenius**: $\pi_p^2 = -p$ trong $\text{End}(E_0)$, nên $\text{End}_{\mathbb{F}_p}(E_0) \cong \mathbb{Z}[\sqrt{-p}] =: \mathcal{O}$.
>
> **Tại sao $\ell_i \mid p+1$?** Vì $\#E_0(\mathbb{F}_p) = p + 1$ (supersingular), tất cả $\ell_i$ đều chia $p+1$, nên $E_0[\ell_i] \subset E_0(\mathbb{F}_p)$. Các kernel points cho isogenies $\ell_i$ đều **$\mathbb{F}_p$-rational** — không cần extension field.
>
> **Class group generators**: Mỗi $\ell_i$ splits trong $K = \mathbb{Q}(\sqrt{-p})$: $\ell_i\mathcal{O} = \mathfrak{l}_i\bar{\mathfrak{l}}_i$. Các $[\mathfrak{l}_i]$ và $[\bar{\mathfrak{l}}_i]$ generate $\text{cl}(\mathcal{O})$.

---

## 2. Scheme Definition

> [!note] Scheme 10.2 — CSIDH Key Exchange
>
> **$\mathsf{Setup}$**: Prime $p = 4\ell_1\cdots\ell_n - 1$, base curve $E_0: y^2 = x^3 + x$ trên $\mathbb{F}_p$, bound $B$.
>
> **$\mathsf{KeyGen}()$**
> - Input: None
> - Sample secret key: $\mathbf{e} = (e_1, \ldots, e_n) \stackrel{R}{\leftarrow} \{-B, \ldots, B\}^n$
> - Compute public key: $E_{\mathbf{e}} = [\mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}] \star E_0$
> - Output: $\mathsf{sk} = \mathbf{e}$, $\mathsf{pk} = A_{\mathbf{e}} \in \mathbb{F}_p$ (Montgomery coefficient của $E_{\mathbf{e}}$)
>
> **$\mathsf{KeyEx}(\mathsf{sk}_A, \mathsf{pk}_B)$** — tính shared secret
> - Input: $\mathsf{sk}_A = \mathbf{e}_A$, $\mathsf{pk}_B = A_B$ (curve $E_B$)
> - Compute: $E_{\text{shared}} = [\mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}] \star E_B$
> - Output: $A_{\text{shared}} \in \mathbb{F}_p$ (Montgomery coefficient, đây là shared secret)

---

## 3. Correctness

> [!abstract] Định lý 10.3 — Correctness của CSIDH
> Alice và Bob tính được cùng shared secret:
>
> $$
> [\mathbf{e}_A] \star E_B = [\mathbf{e}_A] \star ([\mathbf{e}_B] \star E_0) = [\mathbf{e}_A \cdot \mathbf{e}_B] \star E_0 = [\mathbf{e}_B] \star ([\mathbf{e}_A] \star E_0) = [\mathbf{e}_B] \star E_A
> $$

**Proof.** Trực tiếp từ commutativity của $\text{cl}(\mathcal{O})$: $[\mathfrak{a}][\mathfrak{b}] = [\mathfrak{b}][\mathfrak{a}]$ trong group abelian. $\blacksquare$

---

## 4. Tính Toán Group Action — Algorithm Cốt lõi

Phần kỹ thuật quan trọng nhất: làm sao evaluate $[\mathbf{e}] \star E_A$ hiệu quả?

> [!note] Algorithm 10.4 — CSIDH Group Action Evaluation
>
> **Input**: Montgomery coefficient $A$ (đại diện cho $E_A: y^2 = x^3 + Ax^2 + x$), exponents $\mathbf{e} = (e_1, \ldots, e_n)$
>
> **Output**: Montgomery coefficient $A'$ của $[\mathbf{e}] \star E_A$
>
> ```
> while exists i with e_i ≠ 0:
>     Sample random x ∈ F_p
>     Compute r = x³ + Ax² + x
>     s = +1 if r is a square in F_p, else s = -1
>     Let I = {i : e_i ≠ 0 và sign(e_i) = s}
>     if I = ∅: continue
>     Compute P = [(p+1) / ∏_{i∈I} ℓ_i] · (x : 1)  (point on E_A)
>     for i in I:
>         Q = [∏_{j∈I, j≠i} ℓ_j] · P
>         if Q ≠ O:
>             φ = ℓ_i-isogeny with kernel ⟨Q⟩  (Vélu's formulas)
>             A ← Montgomery coeff của codomain(φ)
>             P ← φ(P)
>             e_i ← e_i - s
> return A
> ```

**Ý tưởng**: điểm ngẫu nhiên $P$ trên $E_A(\mathbb{F}_p)$ được dùng để construct kernel của mỗi $\ell_i$-isogeny. Dấu `s` của $r$ xác định direction: $s = +1$ tương ứng với $\mathfrak{l}_i$ (hướng positive), $s = -1$ với $\bar{\mathfrak{l}}_i$ (hướng negative).

**Hiệu quả**: Mỗi isogeny degree $\ell_i$ tính bằng Vélu's formulas — $O(\ell_i)$ phép toán trên $\mathbb{F}_p$. Tổng cost: $O(B \cdot n \cdot \bar\ell)$ với $\bar\ell = \sum \ell_i / n$ là trung bình prime.

---

## 5. Security Analysis

### 5.1. Hard Problem

> [!note] Định nghĩa 10.5 — CSIDH Hard Problems
>
> **Problem 1 (Vectorization / Isogeny Finding)**: Cho $E_0$ và $E_A = [\mathbf{e}] \star E_0$, tìm $\mathbf{e}$ (hoặc một $\mathbf{e}'$ thỏa $[\mathbf{e}'] \star E_0 = E_A$).
>
> **Problem 2 (Decisional Diffie-Hellman / DDH)**: Phân biệt tuple $(E_A, E_B, E_{AB})$ với tuple $(E_A, E_B, E_R)$ với $E_R$ random, trong đó $E_{AB} = [\mathbf{e}_A] \star E_B = [\mathbf{e}_B] \star E_A$.

Vectorization tương đương với bài toán tìm **isogeny giữa hai supersingular curves** — bài toán được giả định khó về mặt classical và quantum.

### 5.2. Classical Security

Thuật toán tốt nhất hiện tại: **meet-in-the-middle** với complexity $O(|\text{cl}(\mathcal{O})|^{1/2}) = O(p^{1/4})$ classical operations.

### 5.3. Quantum Security

> [!warning] Điểm yếu Quantum — Subexponential Attack
>
> Vì $\text{cl}(\mathcal{O})$ là abelian, thuật toán **Kuperberg** (quantum hidden subgroup problem trên abelian groups) có thể phá CSIDH trong $\tilde{O}(2^{\sqrt{\log p}})$ quantum queries — subexponential nhưng vẫn nhanh hơn classical đáng kể.
>
> Để đạt quantum security 128-bit, cần $p \approx 2^{512}$ (CSIDH-512). So sánh: CSIDH-512 cho ~64-bit quantum security; CSIDH-1024 cho ~96-bit quantum security.

### 5.4. So sánh với Diffie-Hellman Kinh điển

| | Classical DH | CSIDH |
|---|-------------|-------|
| Group/Set | $(\mathbb{Z}/p\mathbb{Z})^*$ | $\text{Ell}(\mathcal{O})$ (supersingular curves/$\mathbb{F}_p$) |
| Hard problem | DLP | Vectorization |
| Commutativity | $g^{ab} = g^{ba}$ ✓ | $[\mathfrak{a}][\mathfrak{b}] = [\mathfrak{b}][\mathfrak{a}]$ ✓ |
| Quantum security | Shor's algorithm — exponential speedup | Kuperberg — subexponential |
| Public key size | $O(\log p)$ bits | 64 bytes (CSIDH-512) |

---

## 6. Phân tích Key Size và Parameters

**CSIDH-512** — tham số chuẩn (Castryck et al. 2018):

$$
p = 4 \cdot 3 \cdot 5 \cdot 7 \cdots \ell_{74} - 1 \approx 2^{512}
$$

- Dùng 74 small primes: $\ell_1 = 3, \ell_2 = 5, \ldots, \ell_{74}$
- Bound $B = 5$: mỗi $e_i \in \{-5, \ldots, 5\}$
- Public key: 64 bytes (1 phần tử $\mathbb{F}_p$, là Montgomery coefficient $A$)
- Conjectured classical security: 128 bits
- Conjectured quantum security: 64 bits (conservative: ~74 bits với phân tích hiện đại)

Điểm mạnh: **public key chỉ là 1 phần tử $\mathbb{F}_p$** — nhỏ hơn đáng kể so với RSA/DH (2048-bit key = 256 bytes) và SIDH (~330 bytes).

---

## 7. Correctness của Montgomery Form

> [!abstract] Mệnh đề 10.6 — Montgomery Coefficient là Unique Representative
> Với $p \equiv 3 \pmod 8$ và $E/\mathbb{F}_p$ supersingular với $\text{End}_{\mathbb{F}_p}(E) \cong \mathcal{O}$: tồn tại duy nhất $A \in \mathbb{F}_p$ sao cho $E \cong E_A: y^2 = x^3 + Ax^2 + x$ trên $\mathbb{F}_p$.

Điều này có nghĩa: Montgomery coefficient $A$ là **canonical representative** hoàn hảo cho $\mathbb{F}_p$-isomorphism class của $E$ — đó là lý do ta dùng $A$ làm public key thay vì j-invariant.

---

## 8. SageMath — CSIDH Proof of Concept

```python
def csidh_action(A, p, ell_list, exponents):
    F = GF(p)
    while any(e != 0 for e in exponents):
        x = F.random_element()
        rhs = x**3 + A*x**2 + x
        s = 1 if rhs.is_square() else -1

        active = [i for i, e in enumerate(exponents) if e != 0 and (s == 1) == (e > 0)]
        if not active:
            continue

        E = EllipticCurve(F, [0, A, 0, 1, 0])
        try:
            P = E.lift_x(x)
        except:
            continue

        k = prod(ell_list[i] for i in active)
        P = (p + 1) // k * P

        for i in active:
            ki = k // ell_list[i]
            Q = ki * P
            if Q.is_zero():
                continue
            phi = E.isogeny(Q)
            E = phi.codomain()
            P = phi(P)
            exponents[i] -= s

        coeffs = E.a_invariants()
        A = coeffs[1]
    return A
```

```python
p = 431
ell_list = [l for l in primes(3, 30) if (p + 1) % l == 0]
print(f"p = {p}, p+1 = {p+1}")
print(f"Split primes: {ell_list}")

import random
n = len(ell_list)
B = 2

e_alice = [random.randint(-B, B) for _ in range(n)]
e_bob   = [random.randint(-B, B) for _ in range(n)]

A0 = GF(p)(0)

A_alice = csidh_action(A0, p, ell_list, list(e_alice))
A_bob   = csidh_action(A0, p, ell_list, list(e_bob))

shared_alice = csidh_action(A_bob, p, ell_list, list(e_alice))
shared_bob   = csidh_action(A_alice, p, ell_list, list(e_bob))

print(f"Alice public: A_A = {A_alice}")
print(f"Bob public: A_B = {A_bob}")
print(f"Shared (Alice): {shared_alice}")
print(f"Shared (Bob):   {shared_bob}")
print(f"Match: {shared_alice == shared_bob}")
```

> [!tip] Pattern trong CTF — CSIDH Attacks
>
> Khi gặp CSIDH với tham số nhỏ (small $p$, small $B$):
> 1. **Meet-in-the-middle**: enumerate tất cả $[\mathfrak{l}_i^{e_i}] \star E_0$ cho $e_i \in \{0, \ldots, B\}$, lưu vào dictionary, rồi tìm collision với $[\mathfrak{l}_i^{-e_i}] \star E_A$.
> 2. **Brute force** khi $n \cdot B$ nhỏ: enumerate toàn bộ $(2B+1)^n$ public keys.
> 3. **Torsion point information**: nếu challenge leak thêm thông tin về kernel points → giảm search space.

---

## Tóm tắt

- CSIDH là **non-interactive key exchange** post-quantum dựa trên group action của $\text{cl}(\mathcal{O})$ trên supersingular curves/$\mathbb{F}_p$.
- **Setup**: $p = 4\ell_1\cdots\ell_n - 1$, $E_0: y^2 = x^3 + x$, $\mathcal{O} = \mathbb{Z}[\sqrt{-p}]$.
- **KeyGen**: secret $\mathbf{e} \in \{-B,\ldots,B\}^n$, public $A_{\mathbf{e}} \in \mathbb{F}_p$ (Montgomery coefficient).
- **KeyEx**: $[\mathbf{e}_A] \star E_B = [\mathbf{e}_B] \star E_A$ — correctness từ commutativity.
- **Security**: classical $O(p^{1/4})$ (meet-in-the-middle); quantum subexponential (Kuperberg).
- **Key size**: 64 bytes (CSIDH-512) — nhỏ nhất trong mọi post-quantum key exchange.
- Khác SIDH: không leak torsion point info → an toàn hơn trước certain attacks; nhưng quantum weaker hơn.

---

## References

- Castryck, Lange, Martindale, Panny, Renes — *CSIDH: An Efficient Post-Quantum Commutative Group Action*, ASIACRYPT 2018, eprint.iacr.org/2018/383
- Couveignes, J.-M. — *Hard Homogeneous Spaces*, ePrint 2006/291 (giao thức gốc)
- Rostovtsev, A., Stolbunov, A. — *Public-Key Cryptosystem Based on Isogenies*, ePrint 2006/145
- Peikert, C. — *He Gives C-Sieves on the CSIDH*, EUROCRYPT 2020 (quantum security analysis)
- Beullens, Kleinjung, Vercauteren — *CSI-FiSh: Efficient Isogeny Based Signatures*, ASIACRYPT 2019
