---
title: "03. KZG Commitments"
tags: [crypto, zk, polynomial-commitments, lesson-03]
aliases: [KZG Commitments]
created: 2026-03-12
---

> **Prerequisites**: [[02-commitment-scheme-fundamentals|02. Commitment Scheme Fundamentals]], elliptic curves, bilinear pairings cơ bản  
> **Objectives**:  
> - Hiểu đầy đủ 4 bước KZG: Setup, Commit, Open/Prove, Verify
> - Tự derive được quotient polynomial trick và pairing check
> - Hiểu batch opening (nhiều điểm, nhiều đa thức)
> - Implement được KZG toy version trên SageMath

---

## Motivation

KZG (Kate-Zaverucha-Goldberg, 2010) là polynomial commitment scheme elegant nhất: **commitment chỉ là 1 group element, proof cũng chỉ là 1 group element**, bất kể đa thức có bậc bao nhiêu. Không có scheme nào nén gọn hơn thế.

Cái giá phải trả: cần **trusted setup** — một bên tin cậy phải sinh ra SRS (Structured Reference String) rồi xóa bí mật $\tau$ đi. Nếu $\tau$ bị lộ, toàn bộ hệ thống sụp đổ.

---

## Bilinear Pairings — Nhắc lại nhanh

> [!definition] Definition 3.1 — Bilinear Pairing
> Cho ba cyclic groups $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ có cùng bậc nguyên tố $q$. Một **bilinear pairing** là:
>
> $$e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$$
>
> thỏa:
> - **Bilinearity**: $e(aP, bQ) = e(P, Q)^{ab}$ với mọi $a, b \in \mathbb{F}_q$
> - **Non-degeneracy**: $e(G_1, G_2) \neq 1_{\mathbb{G}_T}$
> - **Efficient**: Tính được hiệu quả

**Tính chất quan trọng nhất** (dùng liên tục trong KZG):

$$e(aG_1, bG_2) = e(G_1, G_2)^{ab} = e(abG_1, G_2) = e(G_1, abG_2)$$

**Ký hiệu shorthand**: $[x]_1 = x \cdot G_1 \in \mathbb{G}_1$ và $[x]_2 = x \cdot G_2 \in \mathbb{G}_2$. Ký hiệu này ẩn scalar $x$ bên trong group element.

Với ký hiệu này: $e([a]_1, [b]_2) = e([1]_1, [ab]_2) = e([ab]_1, [1]_2)$.

---

## Bước 1: Setup (Trusted Setup)

> [!definition] Definition 3.2 — KZG Setup / Structured Reference String
> Một trusted party chọn ngẫu nhiên $\tau \xleftarrow{\$} \mathbb{F}_q^*$, tính và publish:
>
> $$\text{SRS} = \left(\underbrace{[\tau^0]_1, [\tau^1]_1, \ldots, [\tau^d]_1}_{\text{SRS}_1}, \underbrace{[\tau^0]_2, [\tau^1]_2}_{\text{SRS}_2}\right)$$
>
> Sau đó **xóa** $\tau$ — không ai được biết. $\tau$ được gọi là **toxic waste** (chất độc).

**Lý do cấu trúc này**: SRS cho phép evaluate đa thức $f(\tau)$ "trong exponent" mà không cần biết $\tau$. Cụ thể:

$$f(\tau) \cdot G_1 = \sum_{i=0}^{d} a_i \cdot [\tau^i]_1 = a_0 [\tau^0]_1 + a_1 [\tau^1]_1 + \cdots + a_d [\tau^d]_1$$

Đây là **linear combination** của các SRS elements — tính được mà không cần biết $\tau$.

---

## Bước 2: Commit

> [!definition] Definition 3.3 — KZG Commit
> Cho đa thức $f(X) = a_0 + a_1 X + \cdots + a_d X^d$:
>
> $$\text{com}_f = f(\tau) \cdot G_1 = \sum_{i=0}^{d} a_i \cdot [\tau^i]_1 \in \mathbb{G}_1$$

Đây là một **group element** duy nhất — commitment constant-size bất kể $d$.

---

## Bước 3: Open / Prove

Prover muốn prove $f(z) = y$ cho verifier (không tiết lộ $f$).

**Trick cốt lõi — Quotient Polynomial**:

Nếu $f(z) = y$, thì $(f(X) - y)$ có $z$ là nghiệm, nên chia hết cho $(X - z)$:

$$q(X) = \frac{f(X) - y}{X - z} \in \mathbb{F}_q[X]$$

$q(X)$ gọi là **quotient polynomial** (đa thức thương). Nếu $f(z) \neq y$, phép chia này không nguyên — $q(X)$ không là đa thức.

> [!definition] Definition 3.4 — KZG Evaluation Proof
> Proof cho $f(z) = y$ là:
>
> $$\pi = q(\tau) \cdot G_1 = [q(\tau)]_1 \in \mathbb{G}_1$$
>
> Prover tính $q(X) = (f(X) - y)/(X - z)$ rồi evaluate tại SRS.

---

## Bước 4: Verify

> [!definition] Definition 3.5 — KZG Verify
> Verifier nhận $(\text{com}_f, z, y, \pi)$, kiểm tra:
>
> $$e(\pi,\; [\tau]_2 - [z]_2) \stackrel{?}{=} e(\text{com}_f - [y]_1,\; [1]_2)$$

**Tại sao check này đúng?** Expand:

$$\text{LHS} = e([q(\tau)]_1,\; [(\tau - z)]_2) = e(G_1, G_2)^{q(\tau)(\tau - z)}$$

$$\text{RHS} = e([f(\tau) - y]_1,\; [1]_2) = e(G_1, G_2)^{f(\tau) - y}$$

Đẳng thức $q(\tau)(\tau - z) = f(\tau) - y$ chính là **đúng đắn** của đa thức khi $\tau$ là điểm ngẫu nhiên bí mật — nếu $q(X)(X-z) = f(X) - y$ là đồng nhất thức đa thức, thì nó đúng tại $\tau$ với xác suất 1.

---

## Batch Opening — Nhiều điểm trên một đa thức

Nếu prover muốn prove $f(z_1) = y_1, f(z_2) = y_2, \ldots, f(z_k) = y_k$:

Định nghĩa **interpolation polynomial** $r(X)$ bậc $< k$ qua tất cả $(z_i, y_i)$, và **vanishing polynomial** $Z(X) = \prod_i (X - z_i)$. Khi đó:

$$q(X) = \frac{f(X) - r(X)}{Z(X)}$$

Proof: $\pi = [q(\tau)]_1$.

Verifier check: $e(\pi, [Z(\tau)]_2) = e(\text{com}_f - [r(\tau)]_1, [1]_2)$.

**Chỉ một proof element cho $k$ điểm** — amortization mạnh mẽ.

## Batch Opening — Nhiều đa thức, cùng điểm

Prover có $f_1, \ldots, f_k$ muốn prove $f_i(z) = y_i$ với cùng $z$:

Verifier gửi challenge $\gamma \xleftarrow{\$} \mathbb{F}_q$. Prover combine:

$$h(X) = \sum_{i=1}^{k} \gamma^{i-1} f_i(X)$$

$$q(X) = \frac{h(X) - \sum_i \gamma^{i-1} y_i}{X - z}$$

Proof: $\pi = [q(\tau)]_1$. Vẫn chỉ một group element.

---

## Implementation — KZG Toy Example (SageMath)

```python
# KZG Toy Implementation trên BN-like curve nhỏ
# Dùng SageMath

# Setup: dùng một trường nhỏ để demo
p = 101  # base field
Fp = GF(p)
# Đường cong E: y^2 = x^3 + 3 trên Fp
E = EllipticCurve(Fp, [0, 3])
G1 = E(1, 2)  # generator G1
assert G1.order() == 17

# G2 trên extension field (tương tự)
Fp2.<u> = Fp.extension(x^2 + 2)
E2 = E.base_extend(Fp2)
G2 = E2(36, 31*u)
assert G2.order() == 17

F17 = GF(17)

# === SETUP ===
tau = F17(7)  # toxic waste (trong thực tế xóa sau setup)
d = 4
srs_g1 = [int(tau^i) * G1 for i in range(d+1)]  # [G1, tau*G1, tau^2*G1, ...]
srs_g2 = [G2, int(tau) * G2]                     # [G2, tau*G2]

print(f"SRS G1: {len(srs_g1)} elements")
print(f"SRS G2: {len(srs_g2)} elements")

# === COMMIT ===
def commit(poly_coeffs):
    """poly_coeffs = [a0, a1, ..., ad]"""
    result = E(0)  # identity
    for i, ai in enumerate(poly_coeffs):
        result = result + int(F17(ai)) * srs_g1[i]
    return result

# f(X) = 1 + 2X + 3X^2 (bậc 2)
f_coeffs = [1, 2, 3]
com_f = commit(f_coeffs)
print(f"Commitment com_f = {com_f}")

# === PROVE: f(z) = y ===
def poly_eval(coeffs, z, mod):
    """Horner's method"""
    result = 0
    for c in reversed(coeffs):
        result = (result * z + c) % mod
    return result

def poly_div(f_coeffs, z, mod):
    """Chia f(X) - f(z) cho (X - z) — polynomial long division"""
    y = poly_eval(f_coeffs, z, mod)
    # f(X) - y
    num = list(f_coeffs)
    num[0] = (num[0] - y) % mod
    # Chia cho (X - z) dùng synthetic division
    q = []
    remainder = 0
    for c in reversed(num):
        remainder = (remainder + c) % mod
        q.append(remainder)
        remainder = (remainder * z) % mod
    q.reverse()
    return q[1:], y  # quotient coeffs (bỏ leading 0), y

z = 3
q_coeffs, y = poly_div(f_coeffs, z, 17)
print(f"f({z}) = {y}")
print(f"Quotient q(X) coeffs: {q_coeffs}")

# Proof = [q(tau)]_1
proof = commit(q_coeffs)
print(f"Proof pi = {proof}")

# === VERIFY ===
from py_ecc.bn128 import pairing  # placeholder concept — trong SageMath toy dùng Weil pairing

def kzg_verify(com_f, z, y, proof, srs_g2, G1, G2):
    """
    Check: e(proof, [tau]_2 - [z]_2) == e(com_f - [y]_1, [1]_2)
    """
    lhs_g2 = srs_g2[1] - int(F17(z)) * G2      # [tau - z]_2
    rhs_g1 = com_f - int(F17(y)) * G1           # [f(tau) - y]_1
    
    # Weil pairing (toy example)
    lhs = proof.weil_pairing(lhs_g2, 17)
    rhs = rhs_g1.weil_pairing(G2, 17)
    
    return lhs == rhs

valid = kzg_verify(com_f, z, y, proof, srs_g2, G1, G2)
print(f"Verification: {valid}")  # True
```

---

## Tóm tắt

| Bước | Input | Output | Chi phí |
|------|-------|--------|---------|
| Setup | $d, \tau$ | SRS ($d+2$ group elements) | $O(d)$ |
| Commit | $f, \text{SRS}$ | $\text{com}_f \in \mathbb{G}_1$ | $O(d)$ MSM |
| Prove | $f, z, \text{SRS}$ | $(y, \pi \in \mathbb{G}_1)$ | $O(d)$ |
| Verify | $\text{com}_f, z, y, \pi, \text{SRS}$ | $\{0,1\}$ | $O(1)$ — 2 pairings |

KZG nổi bật với **verifier cost $O(1)$** — đây là lý do nó được dùng trong Ethereum (EIP-4844 dùng KZG để commit blobs).

---

## References

- Kate, Zaverucha & Goldberg — *Constant-Size Commitments to Polynomials* (ASIACRYPT 2010) — https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf
- Dankrad Feist — *KZG polynomial commitments* — https://dankradfeist.de/ethereum/2020/06/16/kate-polynomial-commitments.html
- ZKDocs — *KZG Polynomial Commitments* — https://www.zkdocs.com/docs/zkdocs/commitments/kzg_polynomial_commitment/
- Risen Crypto — *The KZG/Kate Polynomial Commitment Scheme* — https://risencrypto.github.io/Kate/
