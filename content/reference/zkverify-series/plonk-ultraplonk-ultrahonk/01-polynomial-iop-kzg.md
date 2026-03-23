---
title: "01. Polynomial IOP and KZG"
tags: [crypto, plonk, kzg, polynomial-commitment, lesson-01]
aliases: [Polynomial IOP and KZG]
created: 2026-03-13
---

> **Prerequisites**: Group theory (cyclic groups, generators), finite fields $\mathbb{F}_p$, elliptic curves cơ bản (point addition, scalar multiplication), discrete logarithm problem  
> **Objectives**:  
> - Hiểu mô hình Polynomial IOP (Interactive Oracle Proof) và tại sao nó là nền tảng của PLONK
> - Nắm vững cấu trúc KZG commitment: Setup, Commit, Open, Verify
> - Phân tích security properties: binding, hiding, knowledge soundness trong AGM
> - Nhận biết trusted setup ceremony và các rủi ro liên quan (bug bounty relevance)

---

## Motivation

Câu hỏi trung tâm của mọi zkSNARK: **Làm sao Prover thuyết phục Verifier rằng một computation đúng mà không tiết lộ witness?**

Ý tưởng cổ điển là encode computation thành các constraint thỏa mãn khi và chỉ khi computation đúng, rồi Prover gửi "bằng chứng" về sự thỏa mãn đó. Nhưng bằng chứng phải đủ ngắn (succinct) và Verifier không tốn quá nhiều công.

Giải pháp: **biểu diễn mọi thứ bằng đa thức (polynomials)**. Tính chất cốt lõi:

> Hai đa thức bậc $d$ trên $\mathbb{F}_p$ hoặc bằng nhau hoàn toàn, hoặc chỉ bằng nhau tại tối đa $d$ điểm (Schwartz-Zippel lemma). Nếu Verifier chọn ngẫu nhiên $r \in \mathbb{F}_p$ và kiểm tra $f(r) = 0$, xác suất "false positive" là $d/p \approx 0$.

Vì thế, thay vì kiểm tra toàn bộ constraint table (cỡ $n$), Verifier chỉ cần kiểm tra tại **một điểm ngẫu nhiên** — thay đổi mô hình từ $O(n)$ xuống $O(1)$ verification work.

Nhưng: Prover không thể gửi toàn bộ đa thức (cỡ $n$ coefficients). Ta cần **commitment scheme** — một cách "cam kết" vào đa thức rồi "chứng minh" evaluations tại điểm bất kỳ mà không reveal đa thức.

---

## Khái niệm cốt lõi (Concept / Model)

### Polynomial IOP

> [!definition] Definition 1.1 — Polynomial IOP (Interactive Oracle Proof)
> Một **Polynomial IOP** là interactive proof system trong đó:
> - Prover gửi các **oracle** $[f_1], [f_2], \ldots$ — mỗi oracle tương ứng một đa thức mà Verifier được phép query tại điểm tùy ý
> - Verifier gửi **challenges** ngẫu nhiên $\alpha_1, \alpha_2, \ldots \in \mathbb{F}$
> - Verifier cuối cùng **kiểm tra** một số identity đa thức tại các điểm query
>
> **Đặc điểm**: Verifier chỉ query một số hữu hạn điểm và chạy trong thời gian $\text{poly}(\log n)$. Prover chứng minh knowledge của witness thỏa mãn relation $\mathcal{R}$.

Trong PLONK, Polynomial IOP được **compile** thành SNARK bằng cách:
1. Thay các oracle $[f]$ bằng **cryptographic commitment** (KZG)
2. Thay Verifier challenges bằng **Fiat-Shamir** (hash of transcript)
3. Thay Verifier queries bằng **evaluation proofs**

### KZG Commitment Scheme

KZG (Kate-Zaverucha-Goldberg, 2010) là polynomial commitment scheme dựa trên **pairing-friendly elliptic curves** và **discrete logarithm hardness**.

> [!definition] Definition 1.2 — Bilinear Pairing
> Cho hai nhóm cyclic $\mathbb{G}_1, \mathbb{G}_2$ cấp $p$ (prime) với generators $G_1, G_2$. Một **bilinear pairing** là ánh xạ:
>
> $$e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$$
>
> thỏa mãn **bilinearity**: $e(aP, bQ) = e(P, Q)^{ab}$ với mọi $P \in \mathbb{G}_1$, $Q \in \mathbb{G}_2$, $a, b \in \mathbb{F}_p$.
>
> **Ví dụ thực tế**: Đường cong BN254 (dùng trong Ethereum, Barretenberg), BLS12-381 (Zcash).

> [!definition] Definition 1.3 — KZG Setup (Structured Reference String)
> **Input**: security parameter $\lambda$, bậc tối đa $d$ của đa thức.
>
> 1. Chọn ngẫu nhiên bí mật $\tau \in \mathbb{F}_p$ ("toxic waste")
> 2. Tính SRS (Structured Reference String):
>
> $$\text{SRS} = \left( G_1, \tau G_1, \tau^2 G_1, \ldots, \tau^d G_1,\ G_2, \tau G_2 \right)$$
>
> 3. **Xóa** $\tau$ — không ai được biết $\tau$ sau setup
>
> **Output**: $\text{SRS}$ là thông tin công khai. $\tau$ là "toxic waste" — nếu bị lộ, toàn bộ system bị phá.

Ký hiệu gọn: $[\tau^i]_1 = \tau^i G_1$ và $[\tau^i]_2 = \tau^i G_2$.

> [!definition] Definition 1.4 — KZG Commit
> Cho đa thức $f(X) = \sum_{i=0}^{d} f_i X^i \in \mathbb{F}_p[X]$.
>
> **Commitment**:
>
> $$[f]_1 = f(\tau) \cdot G_1 = \sum_{i=0}^{d} f_i \cdot [\tau^i]_1$$
>
> Prover tính commitment từ SRS mà **không cần biết $\tau$** — chỉ dùng $[\tau^i]_1$.

> [!definition] Definition 1.5 — KZG Open và Verify
> Prover muốn chứng minh: $f(z) = y$ tại điểm $z$ với value $y$.
>
> **Bước 1 (Open)**: Tính quotient polynomial:
>
> $$q(X) = \frac{f(X) - y}{X - z}$$
>
> Đây là đa thức hợp lệ (không có remainder) vì $(X-z)$ là ước của $(f(X) - y)$ khi $f(z) = y$.
>
> Gửi **proof** $\pi = [q]_1 = q(\tau) \cdot G_1$.
>
> **Bước 2 (Verify)**: Verifier kiểm tra bằng pairing equation:
>
> $$e\!\left([f]_1 - y \cdot G_1,\ G_2\right) \stackrel{?}{=} e\!\left(\pi,\ [\tau]_2 - z \cdot G_2\right)$$

**Tại sao equation này đúng khi $f(z) = y$?**

$$
e(q(\tau) G_1,\ (\tau - z) G_2) = e(G_1, G_2)^{q(\tau)(\tau - z)} = e(G_1, G_2)^{f(\tau) - y}
$$

vì $q(X)(X - z) = f(X) - y$.

---

## Security Properties

> [!theorem] Theorem 1.6 — Binding (trong AGM)
> Dưới giả thuyết $(d+1)\text{-DLOG}$ trong Algebraic Group Model (AGM), không có adversary nào có thể tìm được $f \neq f'$ với $[f]_1 = [f']_1$, tức là **commitment binding**.

> [!theorem] Theorem 1.7 — Evaluation Binding
> Trong AGM, nếu Verifier chấp nhận proof $\pi$ cho claim $f(z) = y$, thì Prover "knows" đa thức $f$ thỏa mãn $f(z) = y$.

> [!warning] Warning 1.8 — KZG Không Có Hiding (Mặc Định)
> KZG **không hiding** theo nghĩa information-theoretic: commitment $[f]_1 = f(\tau)G_1$ không tiết lộ coefficients của $f$ (do DL hardness), nhưng nếu ta biết evaluation $f(z)$ ở đủ nhiều điểm, có thể reconstruct $f$.
>
> Trong PLONK, zero-knowledge được đảm bảo bằng cách **thêm random masking** vào wire polynomials, không phải từ hiding của KZG.

### Algebraic Group Model (AGM)

> [!definition] Definition 1.9 — Algebraic Group Model
> Trong **AGM**, mọi adversary đưa ra group element $Z \in \mathbb{G}$ phải đồng thời cung cấp **linear representation**: các hệ số $\alpha_i$ sao cho $Z = \sum_i \alpha_i P_i$ với $P_i$ là các group elements mà adversary đã nhận.
>
> AGM yếu hơn Generic Group Model (GGM) nhưng đủ cho hầu hết proof trong thực tế. PLONK được proved secure trong AGM.

---

## Implementation — KZG cơ bản (minh họa)

```python
# KZG commitment minh họa trên nhóm cyclic đơn giản
# (Không dùng thực tế — chỉ minh họa cấu trúc)

from sympy import Poly, symbols, GF, div, factor_list
from sympy.abc import x

# --- Cài đặt field nhỏ để minh họa ---
p = 17  # Field Fp (nhỏ để debug)

def field_poly_eval(coeffs, point, mod):
    """Evaluate polynomial với coefficients list (low to high degree) tại point."""
    result = 0
    for i, c in enumerate(coeffs):
        result = (result + c * pow(point, i, mod)) % mod
    return result

def kzg_commit(coeffs, srs_g1, mod):
    """
    KZG commit: [f]_1 = sum(f_i * srs[i])
    Ở đây srs_g1[i] = tau^i (scalar, vì ta dùng số thay group element)
    """
    result = 0
    for i, c in enumerate(coeffs):
        result = (result + c * srs_g1[i]) % mod
    return result

def kzg_open(coeffs, z, y, mod):
    """
    Tính quotient q(X) = (f(X) - y) / (X - z) trong Fp[X].
    Trả về coefficients của q.
    """
    # f(X) - y: giảm constant term đi y
    f_minus_y = list(coeffs)
    f_minus_y[0] = (f_minus_y[0] - y) % mod

    # Polynomial long division bằng (X - z)
    # Dùng synthetic division
    n = len(f_minus_y)
    quotient = [0] * (n - 1)
    remainder = 0
    # Đảo chiều để high-degree trước
    rev = list(reversed(f_minus_y))
    carry = 0
    q_rev = []
    for coeff in rev[:-1]:
        carry = (coeff + carry * z) % mod
        q_rev.append(carry)
    remainder = (rev[-1] + carry * z) % mod
    quotient_coeffs = list(reversed(q_rev))
    return quotient_coeffs, remainder

# --- Demo ---
# f(X) = 3 + 2X + X^2  (coefficients: [3, 2, 1])
# tau = 5 (giả sử)
# SRS: [tau^0, tau^1, tau^2] = [1, 5, 25] mod 17 = [1, 5, 8]
tau = 5
srs = [pow(tau, i, p) for i in range(3)]
print(f"SRS (scalar demo): {srs}")  # [1, 5, 8]

f_coeffs = [3, 2, 1]  # 3 + 2X + X^2
commitment = kzg_commit(f_coeffs, srs, p)
print(f"Commitment [f]_1 (scalar): {commitment}")  # f(tau) mod p = 3+10+25 = 38 mod 17 = 4

# Muốn prove f(2) = ?
z = 2
y = field_poly_eval(f_coeffs, z, p)
print(f"f({z}) = {y}")  # 3 + 4 + 4 = 11

q_coeffs, rem = kzg_open(f_coeffs, z, y, p)
print(f"Quotient coeffs: {q_coeffs}")  # (X^2 + 2X + 3 - 11) / (X - 2)
print(f"Remainder (should be 0): {rem}")

# Verify: e([f]-y*G, G2) = e(pi, [tau]-z*G2)
# Trong scalar demo: commitment - y = pi * (tau - z)
pi = kzg_commit(q_coeffs, srs[:len(q_coeffs)], p)
lhs = (commitment - y) % p
rhs = (pi * (tau - z)) % p
print(f"Verify LHS = {lhs}, RHS = {rhs}, Match = {lhs == rhs}")
```

**Chú ý**: Đoạn code trên dùng scalar thay group elements để minh họa logic. Trong thực tế, `commitment` và `pi` là điểm trên đường cong $\mathbb{G}_1$, verification dùng bilinear pairing.

```python
# Verify code chạy đúng
import subprocess, sys

code = '''
p = 17
tau = 5
srs = [pow(tau, i, p) for i in range(3)]

def field_poly_eval(coeffs, point, mod):
    return sum(c * pow(point, i, mod) for i, c in enumerate(coeffs)) % mod

def kzg_commit(coeffs, srs_g1, mod):
    return sum(c * srs_g1[i] for i, c in enumerate(coeffs)) % mod

def kzg_open(coeffs, z, y, mod):
    f_minus_y = list(coeffs)
    f_minus_y[0] = (f_minus_y[0] - y) % mod
    rev = list(reversed(f_minus_y))
    carry = 0
    q_rev = []
    for coeff in rev[:-1]:
        carry = (coeff + carry * z) % mod
        q_rev.append(carry)
    remainder = (rev[-1] + carry * z) % mod
    return list(reversed(q_rev)), remainder

f_coeffs = [3, 2, 1]
commitment = kzg_commit(f_coeffs, srs, p)
z = 2
y = field_poly_eval(f_coeffs, z, p)
q_coeffs, rem = kzg_open(f_coeffs, z, y, p)
pi = kzg_commit(q_coeffs, srs[:len(q_coeffs)], p)
lhs = (commitment - y) % p
rhs = (pi * (tau - z)) % p
assert rem == 0, f"Remainder should be 0, got {rem}"
assert lhs == rhs, f"Verification failed: {lhs} != {rhs}"
print("KZG demo: OK")
'''

result = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)
print(result.stdout)
if result.returncode != 0:
    print("ERROR:", result.stderr)
```

---

## Batch Opening — Mở rộng quan trọng

PLONK cần prove nhiều evaluations cùng lúc. KZG hỗ trợ **batch opening** để giảm proof size.

> [!definition] Definition 1.10 — KZG Batch Opening (cùng điểm)
> Cho $k$ đa thức $f_1, \ldots, f_k$ và một điểm $z$. Verifier gửi challenge $\gamma$.
>
> Prover tính **linear combination**:
>
> $$h(X) = \sum_{i=1}^{k} \gamma^{i-1} f_i(X)$$
>
> và gửi một proof duy nhất $\pi_h$ cho $h(z) = \sum_{i=1}^{k} \gamma^{i-1} y_i$.
>
> Verifier kiểm tra một pairing equation thay vì $k$ equations.

Trong PLONK, tất cả openings ở round 5 đều dùng kỹ thuật này — **đây là lý do PLONK chỉ cần 2 pairing checks** dù có nhiều polynomials.

---

## Trusted Setup và Attack Surface

> [!danger] Bug Bounty Relevance — Trusted Setup Poisoning
> Nếu **toxic waste $\tau$** bị lộ:
> - Attacker có thể tạo commitment $[f]_1$ cho bất kỳ $f$ nào mà không biết $f$
> - Attacker có thể forge bất kỳ evaluation proof nào
> - Toàn bộ soundness của zkSNARK bị phá
>
> **Multi-party ceremony** (ví dụ: Aztec Ignition) giải quyết vấn đề này bằng cách: $\tau = \tau_1 + \tau_2 + \ldots$ — chỉ cần **một** participant honest là đủ.
>
> **Attack vector**: Nếu ceremony software có bug → có thể leak $\tau$. Đây là một attack class cần kiểm tra trong bug bounty.

---

## Summary

- **Polynomial IOP** là mô hình lý thuyết của PLONK: Prover gửi polynomial oracles, Verifier query evaluations.
- **KZG** compile Polynomial IOP thành cryptographic protocol: oracle $\to$ commitment, query $\to$ evaluation proof.
- **Setup** tạo SRS $= [\tau^i]_1$; $\tau$ là toxic waste, không ai được biết.
- **Commit**: $[f]_1 = f(\tau) G_1$ — tính từ SRS mà không cần $\tau$.
- **Open/Verify**: Quotient polynomial $q(X) = (f(X) - y)/(X-z)$, verify bằng pairing equation.
- **Batch opening** dùng linear combination — tiết kiệm proof size.
- **Security**: Binding trong AGM; không hiding theo mặc định (PLONK dùng random masking riêng).

---

## References

- Kate, Zaverucha, Goldberg — *Constant-Size Commitments to Polynomials and Their Applications* (Asiacrypt 2010)
- Gabizon, Williamson, Ciobotaru — *PLONK* (IACR ePrint 2019/953), Section 3
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 15 (toc.cryptobook.us)
- Aztec Ignition ceremony — https://aztec.network/ignition
- Dan Boneh — Stanford CS251 lecture on polynomial commitments
