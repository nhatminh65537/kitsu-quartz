---
title: "03. Bilinear Pairings trong Groth16"
tags: [crypto, groth16, zksnark, pairings, bn254, bls12-381, lesson-03]
aliases: [Bilinear Pairings Groth16]
created: 2026-03-12
---

> **Prerequisites**: [[02-qap-groth16-bridge|02. QAP → Groth16 Bridge]], biết elliptic curve group, scalar multiplication, biết pairing cơ bản ($e(aP, bQ) = e(P, Q)^{ab}$)
> **Objectives**:
> - Hiểu tại sao Groth16 cần **asymmetric pairing** (Type III) thay vì symmetric
> - Nắm vững ký hiệu $[x]_1, [x]_2, [x]_T$ và các phép tính trên đó
> - Hiểu tại sao verification chỉ cần **3 pairing checks**
> - Biết BN254 và BLS12-381 khác nhau thế nào và khi nào dùng cái nào

---

## Tại sao bài này tồn tại

Groth16 proof $\pi = ([A]_1, [B]_2, [C]_1)$ chỉ có 3 group elements. Verifier kiểm tra proof bằng **pairing equations**. Nếu không hiểu pairing hoạt động thế nào trong Groth16, bạn sẽ không hiểu tại sao verification equation lại có dạng như vậy — và cũng không thể tìm ra lỗi trong implementation.

Bài này tập trung vào **pairing dưới góc nhìn của Groth16**: không phải pairing theory tổng quát, mà là các tính chất cụ thể mà Groth16 exploit.

---

## Type III Pairing — Lựa chọn của Groth16

### Ba loại pairing

| Type | Đặc điểm | Ví dụ curve |
|------|---------|-------------|
| Type I (symmetric) | $\mathbb{G}_1 = \mathbb{G}_2$ | BN128 cũ (deprecated) |
| Type II | $\mathbb{G}_1 \neq \mathbb{G}_2$ nhưng có efficient hom $\mathbb{G}_2 \to \mathbb{G}_1$ | Một số MNT curves |
| **Type III** | $\mathbb{G}_1 \neq \mathbb{G}_2$, **không có efficient hom** giữa hai nhóm | **BN254, BLS12-381** |

Groth16 dùng **Type III** vì:
1. Không có efficient hom $\mathbb{G}_2 \to \mathbb{G}_1$ → prover **không thể chuyển $\mathbb{G}_2$ elements sang $\mathbb{G}_1$** → tăng cường security
2. Proof size nhỏ hơn: chỉ cần $[A]_1 \in \mathbb{G}_1$ và $[B]_2 \in \mathbb{G}_2$ (không cần $[B]_1$ trong proof, chỉ cần trong proving key)
3. Verification cost thấp hơn Type I

### Cấu trúc group

> [!definition] Definition 3.1 — Bilinear Group (Type III)
> Groth16 hoạt động trên bộ $(p, \mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T, e)$ với:
> - $p$: số nguyên tố lớn (order của các groups)
> - $\mathbb{G}_1, \mathbb{G}_2$: cyclic groups bậc $p$, với generators $g_1, g_2$
> - $\mathbb{G}_T$: multiplicative group bậc $p$
> - $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$: bilinear map
> - **Không tồn tại efficient isomorphism** $\phi: \mathbb{G}_2 \to \mathbb{G}_1$

---

## Ký hiệu Groth16 (phải nắm vững)

> [!definition] Definition 3.2 — Groth16 Notation
> Cho $a \in \mathbb{F}_p$:
>
> $$[a]_1 = a \cdot g_1 \in \mathbb{G}_1, \qquad [a]_2 = a \cdot g_2 \in \mathbb{G}_2$$
>
> Cho $a, b \in \mathbb{F}_p$:
>
> $$e([a]_1, [b]_2) = e(g_1, g_2)^{ab} =: [ab]_T$$

Ký hiệu gọn hơn cho pairing của hai scaled generators:

$$e([a]_1, [b]_2) = [a \cdot b]_T$$

**Các phép tính hợp lệ** (với $a, b, c \in \mathbb{F}_p$):

| Operation | Hợp lệ? | Ví dụ |
|-----------|---------|-------|
| $[a]_1 + [b]_1$ | ✅ | $[a+b]_1$ |
| $c \cdot [a]_1$ | ✅ | $[ca]_1$ |
| $[a]_1 \cdot [b]_1$ | ❌ | Không tính được (DDH hard) |
| $e([a]_1, [b]_2)$ | ✅ | $[ab]_T$ |
| $e([a]_1, [b]_2) \cdot e([c]_1, [d]_2)$ | ✅ | $[ab+cd]_T$ |
| $e([a]_1, [b]_2) \cdot e([a]_1, [c]_2)$ | ✅ | $[a(b+c)]_T$ (bilinearity) |

> [!warning] Giới hạn quan trọng
> Sau khi thực hiện pairing, kết quả nằm trong $\mathbb{G}_T$. Không thể "unpair" hay làm pairing thêm lần nữa. Groth16 chỉ có đúng **một lớp pairing**.

---

## Tại sao Verification chỉ cần 3 Pairing Checks

Verification equation của Groth16 (sẽ phân tích đầy đủ ở Bài 06) là:

$$e([A]_1, [B]_2) = e([\alpha]_1, [\beta]_2) \cdot e\!\left(\sum_{i=1}^{\ell} z_i \left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\gamma}\right]_1, [\gamma]_2\right) \cdot e([C]_1, [\delta]_2)$$

Đây là **3 pairing computations** (tính cả vế trái). Tại sao chỉ cần 3?

**Lý do 1 — Bilinearity gom nhiều terms thành một pairing**:

$$e([\sum_i z_i L_i]_1, [\gamma]_2) = \prod_i e([z_i L_i]_1, [\gamma]_2) = e\!\left([\sum_i z_i L_i]_1, [\gamma]_2\right)$$

Verifier tính tổng $\sum_{i=1}^{\ell} z_i [L_i]_1$ (linear combination trong $\mathbb{G}_1$) trước, rồi chỉ cần 1 pairing.

**Lý do 2 — Precomputed pairing trong verifying key**:

$e([\alpha]_1, [\beta]_2)$ chỉ phụ thuộc vào verifying key, không phụ thuộc vào proof hay public inputs. Nó được precompute một lần và lưu trong verifying key — không tốn pairing cost khi verify.

**Kết quả**: Verification thực tế cần **2 pairing computations** (sau khi dùng precomputed $[\alpha\beta]_T$), cộng thêm một số EC additions cho linear combination.

---

## BN254 vs BLS12-381

Groth16 production thường dùng một trong hai curves:

> [!definition] Definition 3.3 — BN254 (BN128)
> - **Tên đầy đủ**: Barreto-Naehrig curve với $p \approx 2^{254}$
> - **Scalar field order**: $r \approx 2^{254}$  
> - **Security**: ~100-bit sau TNFS attacks (2016), được coi là "128-bit" trước đó
> - **Pairing cost**: Nhanh hơn BLS12-381
> - **Dùng trong**: Ethereum (precompiles EIP-196, EIP-197), Zcash Sprout, Tornado Cash, Groth16 mặc định trong snarkjs

> [!definition] Definition 3.4 — BLS12-381
> - **Tên đầy đủ**: Barreto-Lynn-Scott curve với embedding degree 12, $p \approx 2^{381}$
> - **Scalar field order**: $r \approx 2^{255}$
> - **Security**: ~128-bit (bền vững hơn sau TNFS)
> - **Pairing cost**: Chậm hơn BN254 ~20%
> - **Dùng trong**: Ethereum 2.0 (BLS signatures), Zcash Sapling/Orchard, Filecoin, Sui

**Lựa chọn khi implement**:
- Cần on-chain verification trên Ethereum (mainnet): dùng **BN254** (có precompile sẵn)
- Cần security mạnh hơn hoặc dùng trên chain khác: dùng **BLS12-381**

### Tham số quan trọng

| Parameter | BN254 | BLS12-381 |
|-----------|-------|-----------|
| Field prime $p$ | 254-bit | 381-bit |
| Scalar order $r$ | 254-bit | 255-bit |
| $\mathbb{G}_1$ point size | 32 bytes (compressed) | 48 bytes |
| $\mathbb{G}_2$ point size | 64 bytes (compressed) | 96 bytes |
| Embedding degree | 12 | 12 |

---

## Liên hệ Pairings với Groth16 Proof Size

Proof Groth16 = $([A]_1, [B]_2, [C]_1)$:
- $[A]_1 \in \mathbb{G}_1$: 32 bytes (BN254) hoặc 48 bytes (BLS12-381)
- $[B]_2 \in \mathbb{G}_2$: 64 bytes (BN254) hoặc 96 bytes (BLS12-381)
- $[C]_1 \in \mathbb{G}_1$: 32 bytes (BN254) hoặc 48 bytes (BLS12-381)

**Tổng proof size** (BN254): **128 bytes** — đây là lý do Groth16 được dùng rộng rãi trên blockchain.

> [!important] Tại sao $[B]$ phải ở $\mathbb{G}_2$?
> Trong verification equation, cần tính $e([A]_1, [B]_2)$. Nếu $[B] \in \mathbb{G}_1$, không thể tính pairing của hai $\mathbb{G}_1$ elements. Việc đặt $[B]$ ở $\mathbb{G}_2$ là thiết kế cố ý để pairing có thể check polynomial identity với một lần multiply.

---

## Discrete Log Assumption và Security

Groth16 dựa trên hai assumptions chính liên quan đến pairings:

> [!definition] Definition 3.5 — $q$-Strong Diffie-Hellman ($q$-SDH)
> Không có adversary PPT nào, khi nhận $g, g^\tau, g^{\tau^2}, \ldots, g^{\tau^q}$, có thể tính $(c, g^{1/(\tau+c)})$ cho bất kỳ $c$.

> [!definition] Definition 3.6 — Generic Group Model (GGM)
> Groth16 security proof hoạt động trong **Generic Group Model** — model này assume rằng adversary chỉ access group qua oracle (không thể exploit group structure). Đây là assumption mạnh hơn thực tế.

**Ý nghĩa thực tế**: Groth16 chưa có security proof dưới standard assumptions. Security dựa vào GGM — không phải điểm yếu trong thực tế nhưng là hạn chế lý thuyết.

---

## Python: Verify Pairing Properties với py_ecc

```python
from py_ecc.bn128 import G1, G2, multiply, add, pairing, neg, eq
from py_ecc.bn128 import field_modulus as p

# Generators
g1 = G1  # generator của G1
g2 = G2  # generator của G2

# Scalar multiplication: [a]_1 = a * g1
a = 7
b = 11
A = multiply(g1, a)   # [a]_1 = [7]_1
B = multiply(g2, b)   # [b]_2 = [11]_2
A2 = multiply(g1, 5)  # [5]_1

# Bilinearity check 1: e([a]_1, [b]_2) = e([1]_1, [ab]_2)
lhs = pairing(B, A)                          # e([a]_1, [b]_2) = e([7]_1, [11]_2)
rhs = pairing(multiply(g2, a * b % p), g1)   # e([1]_1, [ab]_2)
print("Bilinearity 1:", lhs == rhs)           # True

# Bilinearity check 2: e([a+c]_1, [b]_2) = e([a]_1, [b]_2) * e([c]_1, [b]_2)
c = 5
AC = add(A, A2)       # [a+c]_1 = [12]_1
lhs2 = pairing(B, AC)
rhs2_1 = pairing(B, A)
rhs2_2 = pairing(B, A2)
# Nhân trong G_T (field element)
from py_ecc.fields import optimized_bn128_FQ12 as FQ12
rhs2 = rhs2_1 * rhs2_2
print("Bilinearity 2:", lhs2 == rhs2)         # True

# Negation: e([-a]_1, [b]_2) * e([a]_1, [b]_2) = 1 (identity in G_T)
neg_A = neg(A)        # [-a]_1
prod = pairing(B, neg_A) * pairing(B, A)
print("Negation:", prod == FQ12.one())         # True
```

---

## Summary

- Groth16 dùng **Type III pairing** — $\mathbb{G}_1 \neq \mathbb{G}_2$, không có efficient hom giữa hai nhóm
- Ký hiệu $[a]_1, [a]_2$: scalar $a$ được "ẩn" vào group element; chỉ có thể làm linear combinations và pairings
- Verification chỉ cần **2 pairing computations thực sự** (1 precomputed) nhờ bilinearity
- **BN254**: nhanh, dùng cho Ethereum; **BLS12-381**: an toàn hơn, dùng cho Eth2/Filecoin
- Proof size BN254: **128 bytes** — đây là điểm mạnh nhất của Groth16
- Security trong **Generic Group Model** — không phải standard assumption

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260), Section 2
- Dan Boneh, Victor Shoup — *A Graduate Course in Applied Cryptography* (toc.cryptobook.us), Ch. 15
- py_ecc library — https://github.com/ethereum/py_ecc
- BLS12-381 spec — https://hackmd.io/@benjaminion/bls12-381
