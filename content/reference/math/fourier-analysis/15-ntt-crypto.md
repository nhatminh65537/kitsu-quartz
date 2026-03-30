---
title: "15. NTT trong Lattice Crypto & ZK Proofs"
tags: [math, fourier-analysis, ntt, cryptography, lattice, ring-lwe, zk-proofs, lesson-15]
aliases: [NTT Cryptography, Ring-LWE, Kyber, Dilithium, STARKs]
created: 2026-03-24
---

> **Prerequisites**: [[14-ntt|14. NTT]] — NTT, negacyclic convolution, fast NTT; kiến thức cơ bản về lattice-based crypto và ZK proofs
> **Objectives**:
> - Hiểu tại sao polynomial rings xuất hiện tự nhiên trong Ring-LWE
> - Nắm cách NTT tăng tốc nhân đa thức trong Kyber/Dilithium/Falcon
> - Hiểu NTT trong STARKs và FRI — polynomial evaluation at many points
> - Biết NTT trong Groth16/PLONK via KZG commitment
> - Nhận thức về mối liên hệ sâu: FFT ↔ NTT ↔ Fast Polynomial Multiplication

---

## Từ Fourier đến Cryptography — Bức Tranh Tổng Thể

Hành trình trong khóa học này đi từ tích phân Lebesgue đến số học modular — nhưng sợi chỉ xuyên suốt là **polynomial multiplication**:

$$
\underbrace{\text{Fourier Series}}_{\text{$\sum \hat{f}(n) e^{inx}$}} \xrightarrow{\text{rời rạc}} \underbrace{\text{DFT}}_{\text{$\sum x_n \omega^{nk}$}} \xrightarrow{\text{mod $q$}} \underbrace{\text{NTT}}_{\text{$\sum a_j \omega^{jk} \bmod q$}}
$$

Tất cả ba phép biến đổi đều là **polynomial evaluation**: tính $p(x)$ tại các $n$ điểm. Khi các điểm là roots of unity, ta có Fourier/DFT/NTT. FFT/NTT là thuật toán nhanh để thực hiện evaluation này.

---

## Ring-LWE và Polynomial Multiplication

### Learning With Errors (LWE)

Bài toán **LWE**: cho $\mathbf{A} \in \mathbb{Z}_q^{m \times n}$, $\mathbf{s} \in \mathbb{Z}_q^n$ (secret), $\mathbf{e}$ (small error), phân biệt $(\mathbf{A}, \mathbf{As} + \mathbf{e})$ với $(\mathbf{A}, \mathbf{u})$ đồng đều. **NP-hard** và assumed quantum-resistant.

**Nhược điểm của LWE**: matrix $\mathbf{A}$ có kích thước $O(n^2)$ — quá lớn cho thực tế.

### Ring-LWE

> [!definition] Definition 15.1 — Ring-LWE
> **Ring-LWE** chuyển LWE sang ring $R_q = \mathbb{Z}_q[x]/(x^n + 1)$ (cyclotomic ring).
>
> Thay matrix-vector product $\mathbf{As}$ bằng **polynomial multiplication** $a(x) \cdot s(x)$ trong $R_q$.
>
> - **Compactness**: polynomial $a$ chỉ cần $n$ coefficients thay vì matrix $n \times n$
> - **Efficiency**: $a \cdot s$ tính trong $O(n \log n)$ dùng NTT, thay vì $O(n^2)$

> [!note] Remark 15.2 — Tại sao $x^n + 1$?
> Ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$ với $n = 2^k$ là **cyclotomic ring** của bậc $2n$:
> - Bảo mật: liên hệ với SVP/CVP trên ideal lattices
> - Hiệu quả: $x^n + 1$ irreducible over $\mathbb{Q}$; tồn tại NTT nếu $q \equiv 1 \pmod{2n}$
> - **Negacyclic NTT** = công cụ thực hiện phép nhân trong $R_q$

---

## Kyber (ML-KEM): NTT trong KEM

> [!example] Example 15.3 — Kyber Key Generation
> **Kyber** (CRYSTALS-Kyber, NIST FIPS 203) là Key Encapsulation Mechanism dựa trên Module-LWE.
>
> Ring: $R_q = \mathbb{Z}_q[x]/(x^{256} + 1)$, $q = 3329$.
>
> **Key generation** tổng quan:
> - Sampling: $\mathbf{A} \in R_q^{k \times k}$ (public matrix), $\mathbf{s}, \mathbf{e} \in R_q^k$ (small secret)
> - Public key: $\mathbf{t} = \mathbf{As} + \mathbf{e}$
>
> **Bottleneck**: tính $\mathbf{As}$ = $k^2$ phép nhân đa thức trong $R_q$.
>
> **NTT speedup**: Precompute $\hat{\mathbf{A}} = \text{NTT}(\mathbf{A})$, $\hat{\mathbf{s}} = \text{NTT}(\mathbf{s})$:
>
> $$
> \mathbf{t} = \text{INTT}(\hat{\mathbf{A}} \odot \hat{\mathbf{s}}) + \mathbf{e}
> $$
>
> Mỗi $\odot$ là pointwise product — $O(n)$ thay vì $O(n^2)$. Cả $\mathbf{t}$ tính trong $O(kn\log n)$.

> [!note] Remark 15.4 — Kyber's NTT Parameters
> Kyber dùng $q = 3329$, $n = 256$. Kiểm tra: $3329 - 1 = 3328 = 256 \times 13$ → $256 \mid 3328$ ✓.
>
> Tuy nhiên: $2n = 512$ và $3328 / 512 = 6.5$ → $512 \nmid 3328$. Vậy Kyber **không thể** dùng full negacyclic NTT! Kyber chỉ có thể factor $x^{256}+1$ thành 128 polynomials bậc 2, không phải 256 tuyến tính. Do đó NTT trong Kyber có 7 layers (thay vì 8), và "pointwise multiplication" cuối cùng là degree-1 polynomial multiplication.

---

## Dilithium và Falcon: NTT trong Signature

> [!example] Example 15.5 — Dilithium (ML-DSA)
> **Dilithium** (CRYSTALS-Dilithium, NIST FIPS 204) dùng $q = 8380417$, $n = 256$.
>
> $q - 1 = 8380416 = 2^{23} \times 3 \times ...$, và $2n = 512 \mid q-1$ ✓. Dilithium có thể dùng **full negacyclic NTT**.
>
> Signing sử dụng nhiều nhân đa thức: mỗi phép sign khoảng $5\text{--}8$ NTTs, với $n = 256$. NTT là bottleneck hiệu năng trên hardware.

> [!example] Example 15.6 — Falcon
> **Falcon** dùng $n = 512$ hoặc $1024$, $q = 12289$.
>
> $q - 1 = 12288 = 3 \times 2^{12}$. Với $n = 512$: $2n = 1024 = 2^{10} \mid 12288$ ✓. Full NTT.
>
> Falcon dùng NTRU lattices và Gaussian sampling — phức tạp hơn nhưng signature nhỏ hơn Dilithium.

---

## NTT trong ZK Proofs: STARKs và FRI

### Polynomial Commitment bằng Evaluation

Nhiều ZK proof systems dựa trên việc **evaluate polynomials tại nhiều điểm**. Ví dụ:

> [!example] Example 15.7 — FRI (Fast Reed-Solomon IOP)
> **FRI** (Fast Reed-Solomon Interactive Oracle Proof) là protocol để chứng minh một polynomial $p(x)$ có degree thấp, dùng trong STARKs.
>
> **Core operation**: Evaluate $p(x)$ tại $n$ điểm (coset của $\mathbb{F}_q^*$) → đây là **NTT**!
>
> Quy trình FRI:
> 1. Commit: Prover gửi $p$ tại $n = 2^k$ điểm → NTT evaluation
> 2. Fold: Reduce $p(x) = p_{even}(x^2) + x \cdot p_{odd}(x^2)$ → hai NTT kích thước $n/2$
> 3. Repeat: $\log n$ rounds, mỗi round NTT kích thước giảm đôi
>
> Tổng cộng $O(n \log n)$ NTT evaluations — đây chính là FFT/NTT!

> [!note] Remark 15.8 — FRI Field Requirements
> FRI cần **smooth subgroup** trong $\mathbb{F}_q^*$: nhóm có bậc $2^k$ để dùng radix-2 NTT.
>
> Trường thông dụng trong ZK:
> - **BabyBear**: $q = 2^{31} - 2^{27} + 1$, $2^{27} \mid q-1$ → rất nhiều NTT layers
> - **Goldilocks**: $q = 2^{64} - 2^{32} + 1$, $2^{32} \mid q-1$
> - **Mersenne31**: $q = 2^{31} - 1$ — không có smooth subgroup lớn, cần kỹ thuật khác

### PLONK và KZG

> [!example] Example 15.9 — KZG Commitment và NTT
> **PLONK** dùng **KZG polynomial commitment**: commit một polynomial $p(x)$ bằng $[p(\tau)]_1$ trong pairing group.
>
> **Setup** (trusted setup): tính $\{[\tau^i]_1\}_{i=0}^{n-1}$.
>
> **Proving**: cần evaluate $p(x)$ tại nhiều điểm (evaluation domain), tính quotient polynomial... tất cả đều là polynomial operations. NTT tăng tốc toàn bộ quá trình:
>
> $$
> \text{IFFT domain} \xrightarrow{\text{INTT}} \text{coeff domain} \xrightarrow{\text{NTT}} \text{evaluation domain}
> $$
>
> **Groth16** cũng dùng NTT để tính QAP (Quadratic Arithmetic Program) evaluation.

---

## Bức Tranh Tổng Thể: FFT/NTT trong Cryptography

```
                    POLYNOMIAL MULTIPLICATION
                           O(n log n)
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
    Lattice Crypto         ZK Proofs          FHE/HE
    ──────────────         ─────────          ──────
    Kyber (KEM)           STARKs/FRI         BFV/BGV
    Dilithium (sig)       PLONK/KZG          CKKS
    Falcon (sig)          Halo2/Nova         TFHE
    NTRU                  Groth16
           │                   │                   │
    NTT in R_q          NTT over F_q         NTT in Z_q^k
    (negacyclic)        (smooth order)       (RNS/CRT)
```

> [!note] Remark 15.10 — Tại Sao FFT = NTT về Bản Chất?
> Cả FFT và NTT đều là cùng một thuật toán: **evaluate $\sum a_j \omega^{jk}$ tại $n$ điểm** bằng divide-and-conquer. Chỉ khác ring:
> - FFT: ring $= \mathbb{C}$, $\omega = e^{2\pi i/n}$
> - NTT: ring $= \mathbb{Z}_q$, $\omega$ = primitive $n$-th root mod $q$
>
> Mọi tính chất của FFT (butterfly structure, $O(n\log n)$, convolution theorem) đều transfer sang NTT. Fourier analysis, dù liên tục hay rời rạc, thực chất là nghiên cứu **character theory** của các nhóm Abel!

---

## Python — NTT trong Polynomial Multiplication: Benchmark và Demo

```python
import numpy as np
import time

def mod_pow(base, exp, mod):
    return pow(int(base), int(exp), int(mod))

def primitive_nth_root(q, n):
    """Tim primitive n-th root of unity trong Z_q."""
    assert (q - 1) % n == 0
    # Tim primitive root mod q
    phi = q - 1
    factors = set()
    nn = phi
    for p in range(2, int(nn**0.5)+2):
        if nn % p == 0:
            factors.add(p)
            while nn % p == 0: nn //= p
    if nn > 1: factors.add(nn)
    
    for g in range(2, q):
        if all(mod_pow(g, phi//p, q) != 1 for p in factors):
            omega = mod_pow(g, (q-1)//n, q)
            if mod_pow(omega, n, q) == 1 and mod_pow(omega, n//2, q) != 1:
                return omega
    raise ValueError(f"Khong tim duoc: q={q}, n={n}")

def ntt(a, omega, q):
    n = len(a)
    if n == 1: return list(a)
    E = ntt([a[i] for i in range(0, n, 2)], mod_pow(omega, 2, q), q)
    O = ntt([a[i] for i in range(1, n, 2)], mod_pow(omega, 2, q), q)
    A = [0] * n
    half = n // 2
    for k in range(half):
        wk = mod_pow(omega, k, q)
        A[k]        = (E[k] + wk * O[k]) % q
        A[k + half] = (E[k] - wk * O[k]) % q
    return A

def intt(A, omega, q):
    n = len(A)
    omega_inv = mod_pow(omega, q-2, q)
    n_inv = mod_pow(n, q-2, q)
    a = ntt(A, omega_inv, q)
    return [(x * n_inv) % q for x in a]

def poly_mul_mod(a, b, n, q, omega):
    """Nhan a*b trong Z_q[x]/(x^n-1)."""
    A = ntt(a, omega, q)
    B = ntt(b, omega, q)
    C = [(A[k]*B[k]) % q for k in range(n)]
    return intt(C, omega, q)

# === Ung dung: Kyber-like polynomial multiplication ===
print("=== NTT trong Kyber-like ring ===")
# Dung tham so don gian: q=12289, n=16 de demo
q_demo = 12289  # Falcon/NewHope prime: 12289-1 = 2^12 * 3
n_demo = 16     # n = 2^4
omega_demo = primitive_nth_root(q_demo, n_demo)
print(f"q={q_demo}, n={n_demo}, omega={omega_demo}")

import random
random.seed(7)
a = [random.randint(0, q_demo-1) for _ in range(n_demo)]
b = [random.randint(0, q_demo-1) for _ in range(n_demo)]

# Schoolbook
def schoolbook_cyclic(a, b, n, q):
    c = [0]*n
    for i in range(n):
        for j in range(n):
            c[(i+j)%n] = (c[(i+j)%n] + a[i]*b[j]) % q
    return c

c_school = schoolbook_cyclic(a, b, n_demo, q_demo)
c_ntt = poly_mul_mod(a, b, n_demo, q_demo, omega_demo)
print(f"Schoolbook == NTT: {c_school == c_ntt}")

# === Performance benchmark ===
print("\n=== Benchmark: n=256, q=3329 (Kyber params) ===")
q_kyber = 3329
n_kyber = 256
omega_k = primitive_nth_root(q_kyber, n_kyber)

a256 = [random.randint(0, q_kyber-1) for _ in range(n_kyber)]
b256 = [random.randint(0, q_kyber-1) for _ in range(n_kyber)]

t0 = time.time()
for _ in range(5): schoolbook_cyclic(a256, b256, n_kyber, q_kyber)
t_s = (time.time()-t0)/5

t0 = time.time()
for _ in range(5): poly_mul_mod(a256, b256, n_kyber, q_kyber, omega_k)
t_n = (time.time()-t0)/5

print(f"  Schoolbook: {t_s*1000:.1f}ms")
print(f"  NTT:        {t_n*1000:.1f}ms")
print(f"  Speedup:    {t_s/t_n:.1f}x (ly thuyet: {n_kyber/np.log2(n_kyber):.1f}x)")

# === FRI-like polynomial evaluation ===
print("\n=== FRI-like: Evaluate polynomial at 2^k points ===")
# Trong STARK/FRI, prover evaluate p(x) tai n points = NTT
def fri_commit(coeffs, q, omega):
    """Commit = evaluate polynomial at NTT points."""
    return ntt(coeffs, omega, q)

q_fri = 3329
n_fri = 16
omega_fri = primitive_nth_root(q_fri, n_fri)
p_coeffs = [1, 2, 3, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  # p(x) = 1+2x+3x^2+5x^4
evaluations = fri_commit(p_coeffs, q_fri, omega_fri)
print(f"  Polynomial: p(x) = {p_coeffs[:5]}... (n={n_fri} coeffs)")
print(f"  FRI commit (NTT evaluations): {evaluations}")
# Verify: INTT should recover coefficients
recovered = intt(evaluations, omega_fri, q_fri)
print(f"  INTT recovery match: {recovered == p_coeffs}")
```

---

## Summary / Key Takeaways

- **Ring-LWE** chuyển LWE sang ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$ — nhỏ gọn hơn và hiệu quả hơn.
- **Polynomial multiplication trong $R_q$** là bottleneck của mọi lattice crypto scheme → NTT giải quyết.
- **Kyber** ($q=3329$, $n=256$): cyclic NTT, 7 layers do $512 \nmid q-1$; "pointwise" = nhân degree-1 polynomial.
- **Dilithium/Falcon** ($q=8380417$/$12289$): full negacyclic NTT, $512 \mid q-1$; pointwise = scalar multiply.
- **STARKs/FRI**: polynomial evaluation tại $2^k$ points = NTT trong field $\mathbb{F}_q$ với smooth order.
- **PLONK/KZG**: NTT để compute evaluations, quotients, witness polynomials.
- **Bản chất thống nhất**: FFT và NTT là cùng một thuật toán, khác ring: $\mathbb{C}$ vs $\mathbb{Z}_q$. Đây là **character theory của nhóm Abel**.
- **NTT-friendly primes**: BabyBear ($2^{31}-2^{27}+1$), Goldilocks ($2^{64}-2^{32}+1$), Mersenne/Babybear dành cho ZK; Kyber/Dilithium primes dành cho lattice.

---

## References

- Peng, J. et al. *NTT and Its Applications in Lattice-based Cryptosystems: A Survey*. arXiv:2211.13546, 2022.
- Pollard, J. M. "The fast Fourier transform in a finite field." *Math. Comput.* 25(114), 1971.
- Ben-Sasson, E. et al. "Scalable zero knowledge with no trusted setup." *CRYPTO 2019*. (FRI/STARKs)
- Gabizon, A. et al. "PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge." ePrint 2019/953.
- NIST FIPS 203 (Kyber/ML-KEM), FIPS 204 (Dilithium/ML-DSA), FIPS 206 (Falcon/SLH-DSA).
