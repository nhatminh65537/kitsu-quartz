---
title: "05. Groth16 Prover"
tags: [crypto, groth16, zksnark, prover, lesson-05]
aliases: [Groth16 Prover Algorithm]
created: 2026-03-12
---

> **Prerequisites**: [[04-trusted-setup-crs|04. Trusted Setup & CRS]]  
> **Objectives**:  
> - Hiểu đầy đủ thuật toán prove: tính $[A]_1, [B]_2, [C]_1$
> - Hiểu vai trò của randomness $r, s$ trong zero-knowledge
> - Hiểu tại sao cần $\alpha, \beta$ shifts trong $A, B$
> - Biết cách prover tính $h(x)$ và tại sao $t(x)$ phải divide evenly

---

## Đầu vào của Prover

Prover nhận:
- **Proving key** $\text{pk}$ (từ Trusted Setup)
- **Witness đầy đủ** $\mathbf{z} = (1, z_1, \ldots, z_\ell, z_{\ell+1}, \ldots, z_m)$
- **Hai random scalars** $r, s \xleftarrow{\$} \mathbb{F}_p$ (chọn mới mỗi lần prove)

Đầu ra: proof $\pi = ([A]_1, [B]_2, [C]_1)$

---

## Bước 1: Tính $[A]_1$

> [!definition] Definition 5.1 — Compute $[A]_1$
>
> $$[A]_1 = [\alpha]_1 + \sum_{i=0}^{n-1} z_i [A_i(\tau)]_1 + r [\delta]_1$$

Phân tích từng term:

| Term | Ý nghĩa |
|------|--------|
| $[\alpha]_1$ | "Tag" từ setup — force prover phải dùng đúng proving key |
| $\sum z_i [A_i(\tau)]_1$ | Commitment đến $A(\tau) = \sum z_i A_i(\tau)$ — encode "left wire" của QAP |
| $r[\delta]_1$ | Randomness — làm $[A]_1$ random hóa để ZK |

Prover compute bằng linear combination của proving key elements:

```
[A]₁ = [α]₁ + z₀[A₀(τ)]₁ + z₁[A₁(τ)]₁ + ... + zₘ[Aₘ(τ)]₁ + r[δ]₁
```

---

## Bước 2: Tính $[B]_2$ và $[B]_1$

> [!definition] Definition 5.2 — Compute $[B]_2$
>
> $$[B]_2 = [\beta]_2 + \sum_{i=0}^{n-1} z_i [B_i(\tau)]_2 + s [\delta]_2$$

Tương tự, có thêm $[B]_1$ (trong $\mathbb{G}_1$) dùng để tính $[C]_1$ sau:

$$[B]_1 = [\beta]_1 + \sum_{i=0}^{n-1} z_i [B_i(\tau)]_1 + s [\delta]_1$$

> [!warning] $[B]_2$ vs $[B]_1$
> $[B]_2$ đi vào **proof** (dùng để verify qua pairing với $[A]_1$).
> $[B]_1$ được tính **internally** bởi prover để compute $[C]_1$, nhưng **không được gửi** trong proof.
> Đây là lý do CRS chứa cả $[B_i(\tau)]_1$ lẫn $[B_i(\tau)]_2$.

---

## Bước 3: Tính $h(x)$ và $[h(\tau)t(\tau)]_1$

Đây là bước quan trọng nhất — prover phải chứng minh R1CS thỏa mãn.

**3a. Tính $A(x), B(x), C(x)$**:

$$A(x) = \sum_{i=0}^{n-1} z_i A_i(x), \quad B(x) = \sum_{i=0}^{n-1} z_i B_i(x), \quad C(x) = \sum_{i=0}^{n-1} z_i C_i(x)$$

**3b. Tính $h(x)$** bằng polynomial division:

$$h(x) = \frac{A(x) \cdot B(x) - C(x)}{t(x)}$$

Nếu R1CS thỏa mãn, phép chia này là **exact** (không có remainder). Nếu không, $h(x)$ không tồn tại dưới dạng polynomial nguyên → prover không thể hoàn thành step này → proof generation fail.

**3c. Commit $h(\tau)t(\tau)$**:

$$[h(\tau)t(\tau)/\delta]_1 = \sum_{k=0}^{m-2} h_k \cdot [\tau^k t(\tau)/\delta]_1$$

Trong đó $h_k$ là coefficients của $h(x)$.

---

## Bước 4: Tính $[C]_1$

> [!definition] Definition 5.3 — Compute $[C]_1$
>
> $$[C]_1 = \sum_{i=\ell+1}^{n-1} z_i \left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\delta}\right]_1 + [h(\tau)t(\tau)/\delta]_1 + s[A]_1 + r[B]_1 - rs[\delta]_1$$

Phân tích:

| Term | Ý nghĩa |
|------|--------|
| $\sum_{i=\ell+1}^{n-1} z_i [\ldots/\delta]_1$ | Commit private witness vào $C$ qua precomputed elements |
| $[h(\tau)t(\tau)/\delta]_1$ | Chứng minh $A \cdot B - C$ chia hết cho $t$ |
| $s[A]_1 + r[B]_1 - rs[\delta]_1$ | **Randomness cross-terms** — đây là phần quan trọng cho ZK |

### Tại sao cần cross-terms $s[A]_1 + r[B]_1 - rs[\delta]_1$?

Nếu không có $r, s$, proof $([A]_1, [B]_2, [C]_1)$ sẽ là deterministic — cùng witness $\mathbf{z}$ luôn cho cùng proof. Verifier có thể brute-force tất cả witnesses và compare.

Với $r, s$ random:
- $[A]_1$ bị "shift" bởi $r[\delta]_1$
- $[B]_2$ bị "shift" bởi $s[\delta]_2$
- $[C]_1$ phải "compensate" để verification equation vẫn balance → cần $s[A]_1 + r[B]_1 - rs[\delta]_1$

Đây là lý do cross-terms phải có dạng đó — chúng là kết quả của việc expand $([A] + r[\delta])([B] + s[\delta])$ và cancel các terms.

---

## Toàn bộ Proving Algorithm

```python
def groth16_prove(pk, z, r, s):
    """
    pk: proving key với tất cả CRS elements
    z: full witness vector [1, public_inputs..., private_witness...]
    r, s: random field elements
    """
    n = len(z)
    ell = pk.num_public_inputs  # số public inputs
    
    # Step 1: Compute [A]_1
    A = pk.alpha_g1
    for i in range(n):
        A = A + z[i] * pk.A_query[i]   # z_i * [A_i(τ)]_1
    A = A + r * pk.delta_g1
    
    # Step 2: Compute [B]_2 và [B]_1
    B2 = pk.beta_g2
    B1 = pk.beta_g1
    for i in range(n):
        B2 = B2 + z[i] * pk.B2_query[i]  # z_i * [B_i(τ)]_2
        B1 = B1 + z[i] * pk.B1_query[i]  # z_i * [B_i(τ)]_1
    B2 = B2 + s * pk.delta_g2
    B1 = B1 + s * pk.delta_g1
    
    # Step 3: Compute h(x) và [h(τ)t(τ)/δ]_1
    A_poly = linear_combine(z, pk.A_polys)   # A(x) = sum z_i * A_i(x)
    B_poly = linear_combine(z, pk.B_polys)   # B(x) = sum z_i * B_i(x)
    C_poly = linear_combine(z, pk.C_polys)   # C(x) = sum z_i * C_i(x)
    
    h_poly = (A_poly * B_poly - C_poly) / pk.t_poly  # exact division
    assert h_poly.degree <= pk.m - 2, "R1CS not satisfied!"
    
    Ht = pk.alpha_g1 * 0  # zero element
    for k in range(len(h_poly.coeffs)):
        Ht = Ht + h_poly.coeffs[k] * pk.H_query[k]  # h_k * [τ^k t(τ)/δ]_1
    
    # Step 4: Compute [C]_1
    C = Ht
    for i in range(ell + 1, n):
        C = C + z[i] * pk.L_query[i]  # z_i * [(βA_i + αB_i + C_i)/δ]_1
    
    # Cross-terms for ZK
    C = C + s * A + r * B1 - (r * s) * pk.delta_g1
    
    return (A, B2, C)
```

---

## Prover Cost

| Operation | Count | Bottleneck |
|-----------|-------|------------|
| MSM (multi-scalar mul) trong $\mathbb{G}_1$ | $O(m)$ | Chậm nhất |
| MSM trong $\mathbb{G}_2$ | $O(m)$ | Chậm thứ hai |
| Polynomial multiplication | $O(m \log m)$ | Với FFT |
| Polynomial division | $O(m \log m)$ | Với FFT |

Tổng prover complexity: $O(m \log m)$ field ops + $O(m)$ group ops. Với $m = 10^6$ constraints, proving time ~10-60 giây tùy hardware.

---

## Summary

- Proof $\pi = ([A]_1, [B]_2, [C]_1)$ được tính từ witness $\mathbf{z}$ và proving key
- $[A]_1, [B]_2$ encode $A(\tau), B(\tau)$ với $\alpha, \beta$ shifts và randomness $r, s$
- $[C]_1$ chứa: private witness commitment + $h(\tau)t(\tau)$ (bằng chứng QAP) + ZK cross-terms
- Prover tính $h(x)$ bằng polynomial division — **fail nếu R1CS không thỏa mãn**
- Randomness $r, s$ (chọn fresh mỗi lần) đảm bảo ZK — cross-terms $s[A] + r[B] - rs[\delta]$ là bắt buộc

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260), Section 3.2
- ZeroKnowledge Blog — *Groth16 Prover* (zeroknowledgeblog.com/index.php/groth16)
- RisenCrypto — *Groth16* (risencrypto.github.io/Groth16) — detailed prover walkthrough
