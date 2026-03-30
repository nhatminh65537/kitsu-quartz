---
title: "14. Number Theoretic Transform (NTT)"
tags: [math, fourier-analysis, ntt, cryptography, finite-field, lesson-14]
aliases: [NTT, Number Theoretic Transform]
created: 2026-03-24
---

> **Prerequisites**: [[10-dft|10. DFT]] — định nghĩa, tính trực giao; [[11-fft|11. FFT]] — Cooley-Tukey, butterfly
> **Objectives**:
> - Hiểu tại sao DFT trên $\mathbb{C}$ không phù hợp cho cryptography (floating-point errors)
> - Định nghĩa NTT: DFT trên trường hữu hạn $\mathbb{Z}_q$
> - Điều kiện tồn tại primitive $n$-th root of unity trong $\mathbb{Z}_q$
> - Cyclic và negacyclic NTT — tích chập trong $\mathbb{Z}_q[x]/(x^n-1)$ và $\mathbb{Z}_q[x]/(x^n+1)$
> - Fast NTT: áp dụng Cooley-Tukey trong $\mathbb{Z}_q$, độ phức tạp $O(n \log n)$
> - Implement NTT bằng Python với ví dụ nhân đa thức

---

## Motivation / Tại Sao DFT Không Đủ cho Cryptography?

**Vấn đề của DFT chuẩn**:
- Twiddle factors $e^{2\pi i k/n}$ là số phức → **floating-point arithmetic**
- Nhân đa thức với hệ số nguyên qua DFT/IDFT gây **lỗi làm tròn** (rounding errors)
- Lattice-based cryptography cần kết quả **chính xác tuyệt đối** trong $\mathbb{Z}_q$

**Giải pháp**: Thực hiện DFT trong **trường hữu hạn** $\mathbb{Z}_q$ — toàn bộ arithmetic là modular, không có floating-point. Đây là **Number Theoretic Transform (NTT)**.

> [!note] Remark 14.1 — Lịch Sử
> J.M. Pollard đề xuất NTT năm 1971 (Mathematics of Computation). Mục đích ban đầu: nhân đa thức và số nguyên lớn. Ứng dụng trong cryptography: NTRU (1996), Ring-LWE/Kyber/Dilithium (2010s).

---

## Primitive Roots of Unity trong $\mathbb{Z}_q$

> [!definition] Definition 14.2 — Primitive $n$-th Root of Unity mod $q$
> Cho $q$ là nguyên tố và $n$ là một số nguyên dương. **Primitive $n$-th root of unity** trong $\mathbb{Z}_q$ là phần tử $\omega \in \mathbb{Z}_q^*$ thỏa:
>
> $$
> \omega^n \equiv 1 \pmod{q} \quad \text{và} \quad \omega^k \not\equiv 1 \pmod{q} \text{ với } 0 < k < n
> $$

> [!theorem] Theorem 14.3 — Điều Kiện Tồn Tại
> Primitive $n$-th root of unity tồn tại trong $\mathbb{Z}_q^*$ khi và chỉ khi:
>
> $$
> n \mid (q - 1)
> $$
>
> Nói cách khác, $q \equiv 1 \pmod{n}$.
>
> **Nếu $q \equiv 1 \pmod{n}$**: bậc của $\mathbb{Z}_q^*$ là $q-1$, chia hết cho $n$, nên tồn tại phần tử bậc $n$.

> [!example] Example 14.4 — Tìm $\omega$ trong $\mathbb{Z}_q$
> Xét $q = 7681$, $n = 256$. Kiểm tra: $7681 - 1 = 7680 = 256 \times 30$ → $n \mid q-1$ ✓.
>
> Để tìm $\omega$: lấy generator $g$ của $\mathbb{Z}_{7681}^*$ (primitive root mod $q$) rồi:
> $$
> \omega = g^{(q-1)/n} \bmod q
> $$
>
> Ví dụ với $g = 7$ (primitive root mod $7681$): $\omega = 7^{7680/256} = 7^{30} \bmod 7681 = 3383$.
>
> Kiểm tra: $3383^{256} \bmod 7681 = 1$ ✓, và không có $k < 256$ nào mà $3383^k = 1$ ✓.

---

## Định Nghĩa NTT

> [!definition] Definition 14.5 — Number Theoretic Transform (NTT)
> Cho $q$ nguyên tố, $n \mid q-1$, $\omega$ là primitive $n$-th root of unity trong $\mathbb{Z}_q$.
>
> **NTT** của vector $\mathbf{a} = (a_0, \ldots, a_{n-1}) \in \mathbb{Z}_q^n$:
>
> $$
> \hat{a}_k = \sum_{j=0}^{n-1} a_j\, \omega^{jk} \bmod q, \qquad k = 0, 1, \ldots, n-1
> $$
>
> **Inverse NTT (INTT)**:
>
> $$
> a_j = n^{-1} \sum_{k=0}^{n-1} \hat{a}_k\, \omega^{-jk} \bmod q
> $$
>
> trong đó $n^{-1}$ là nghịch đảo modular của $n$ trong $\mathbb{Z}_q$.

> [!note] Remark 14.6 — NTT vs DFT
> NTT và DFT giống nhau về cấu trúc, chỉ khác:
> - DFT dùng $\omega = e^{2\pi i/n} \in \mathbb{C}$ (roots of unity trong $\mathbb{C}$)
> - NTT dùng $\omega \in \mathbb{Z}_q$ (roots of unity trong $\mathbb{Z}_q$)
> - Tất cả arithmetic của NTT là **modular integer** — không có floating-point

### Tính Trực Giao và Convolution Theorem

> [!theorem] Theorem 14.7 — Tính Trực Giao trong $\mathbb{Z}_q$
> Với $\omega$ là primitive $n$-th root of unity mod $q$:
>
> $$
> \sum_{j=0}^{n-1} \omega^{jk} \equiv \begin{cases} n \pmod{q} & k \equiv 0 \pmod{n} \\ 0 \pmod{q} & k \not\equiv 0 \pmod{n} \end{cases}
> $$
>
> Cùng cách chứng minh như DFT (tổng geometric series mod $q$).

> [!theorem] Theorem 14.8 — NTT Convolution Theorem
> Nếu $\mathbf{c} = \mathbf{a} \circledast \mathbf{b}$ (cyclic convolution mod $n$, mod $q$), thì:
>
> $$
> \hat{c}_k \equiv \hat{a}_k \cdot \hat{b}_k \pmod{q}
> $$
>
> Vậy nhân đa thức trong $\mathbb{Z}_q[x]/(x^n - 1) = $ NTT $\to$ pointwise product $\to$ INTT.

---

## Cyclic và Negacyclic NTT

### Cyclic NTT cho $\mathbb{Z}_q[x]/(x^n - 1)$

> [!definition] Definition 14.9 — Cyclic Convolution
> Cyclic convolution trong $\mathbb{Z}_q[x]/(x^n - 1)$: nhân $a(x) \cdot b(x)$ rồi reduce mod $x^n - 1$ (i.e., wrap around: $x^n = 1$).
>
> **Điều kiện NTT**: $q \equiv 1 \pmod{n}$, tức tồn tại $n$-th root of unity $\omega$.

### Negacyclic NTT cho $\mathbb{Z}_q[x]/(x^n + 1)$

Trong lattice cryptography, ring ưa dùng là $\mathbb{Z}_q[x]/(x^n + 1)$ (cyclotomic ring) vì:
- $x^n + 1$ là cyclotomic polynomial — thuận tiện về mặt bảo mật
- Với $n = 2^k$: $x^n + 1$ irreducible hoặc factors thành tuyến tính nếu $q \equiv 1 \pmod{2n}$

> [!definition] Definition 14.10 — Negacyclic Convolution
> Negacyclic (hay negative-wrapped) convolution: nhân $a(x) \cdot b(x)$ rồi reduce mod $x^n + 1$ (i.e., $x^n = -1$).
>
> **Điều kiện NTT**: $q \equiv 1 \pmod{2n}$, cần tồn tại **$2n$-th root of unity** $\psi$ với $\psi^2 = \omega$ (primitive $n$-th root of unity).
>
> **NTT với negative wrap**: pre-multiply bởi powers of $\psi$:
>
> $$
> \hat{a}_k = \sum_{j=0}^{n-1} (a_j \psi^j)\, \omega^{jk} \bmod q
> $$
>
> Nghĩa là NTT của vector $(\psi^0 a_0, \psi^1 a_1, \ldots, \psi^{n-1} a_{n-1})$.

---

## Fast NTT: Cooley-Tukey trong $\mathbb{Z}_q$

Chính xác như FFT, nhưng tất cả arithmetic là modular.

> [!theorem] Theorem 14.11 — Fast NTT là $O(n \log n)$
> Với $n = 2^k$ và $q \equiv 1 \pmod{n}$, NTT tính trong $O(n \log n)$ phép tính modular.
>
> Butterfly trong NTT:
> $$
> A' = A + \omega^k B \bmod q, \qquad B' = A - \omega^k B \bmod q
> $$
>
> Tất cả giống Radix-2 FFT, thay phép toán phức bằng phép toán mod $q$.

---

## Python — NTT Implementation

```python
import numpy as np

# === NTT tren Z_q ===

def mod_pow(base, exp, mod):
    """Luy thua modular: base^exp mod mod."""
    return pow(int(base), int(exp), int(mod))

def find_primitive_root(q):
    """Tim primitive root mod q (q nguyen to)."""
    phi = q - 1
    factors = []
    n = phi
    for p in range(2, int(n**0.5)+1):
        if n % p == 0:
            factors.append(p)
            while n % p == 0: n //= p
    if n > 1: factors.append(n)
    
    for g in range(2, q):
        if all(mod_pow(g, phi//p, q) != 1 for p in factors):
            return g
    return None

def primitive_nth_root(q, n):
    """Tim primitive n-th root of unity trong Z_q."""
    assert (q - 1) % n == 0, f"n={n} khong chia het q-1={q-1}"
    g = find_primitive_root(q)
    omega = mod_pow(g, (q-1)//n, q)
    # Verify
    assert mod_pow(omega, n, q) == 1
    assert mod_pow(omega, n//2, q) != 1
    return omega

def ntt_naive(a, omega, q):
    """NTT O(n^2) theo dinh nghia."""
    n = len(a)
    A = []
    for k in range(n):
        s = sum(a[j] * mod_pow(omega, j*k, q) for j in range(n)) % q
        A.append(s)
    return A

def ntt_fast(a, omega, q):
    """Fast NTT: Cooley-Tukey Radix-2 (de qui), O(n log n)."""
    n = len(a)
    if n == 1:
        return list(a)
    
    # Phan chia chan/le
    a_even = ntt_fast([a[i] for i in range(0, n, 2)], mod_pow(omega, 2, q), q)
    a_odd  = ntt_fast([a[i] for i in range(1, n, 2)], mod_pow(omega, 2, q), q)
    
    A = [0] * n
    half = n // 2
    for k in range(half):
        w_k = mod_pow(omega, k, q)
        A[k]        = (a_even[k] + w_k * a_odd[k]) % q
        A[k + half] = (a_even[k] - w_k * a_odd[k]) % q
    return A

def intt_fast(A, omega, q):
    """Inverse NTT."""
    n = len(A)
    omega_inv = mod_pow(omega, q-2, q)  # omega^(-1) mod q via Fermat
    n_inv = mod_pow(n, q-2, q)          # n^(-1) mod q
    a = ntt_fast(A, omega_inv, q)
    return [(x * n_inv) % q for x in a]

def poly_mul_ntt(a, b, n, q, omega):
    """
    Nhan da thuc a(x)*b(x) trong Z_q[x]/(x^n - 1) dung NTT.
    a, b: list he so do dai n.
    """
    A = ntt_fast(a, omega, q)
    B = ntt_fast(b, omega, q)
    C = [(A[k] * B[k]) % q for k in range(n)]
    return intt_fast(C, omega, q)

# === Demo voi q=7681, n=4 ===
q = 7681
n = 4
print(f"q={q}, n={n}, q-1={q-1}, (q-1)/n={( q-1)//n}")
omega = primitive_nth_root(q, n)
print(f"Primitive {n}-th root of unity: omega = {omega}")
print(f"Verify: omega^{n} = {mod_pow(omega, n, q)} (should be 1)")
print(f"        omega^{n//2} = {mod_pow(omega, n//2, q)} (should be != 1)")

# Nhan da thuc: a(x) = 1 + 2x + 3x^2 + 4x^3
#               b(x) = 1 + 1x + 1x^2 + 1x^3
a = [1, 2, 3, 4]
b = [1, 1, 1, 1]

# Schoolbook multiplication mod x^4 - 1 (cyclic)
def poly_mul_schoolbook_cyclic(a, b, n, q):
    c = [0] * n
    for i in range(n):
        for j in range(n):
            c[(i+j) % n] = (c[(i+j) % n] + a[i]*b[j]) % q
    return c

c_schoolbook = poly_mul_schoolbook_cyclic(a, b, n, q)
c_ntt = poly_mul_ntt(a, b, n, q, omega)

print(f"\nNhan da thuc (cyclic mod x^4-1, mod {q}):")
print(f"  Schoolbook: {c_schoolbook}")
print(f"  NTT:        {c_ntt}")
print(f"  Match: {c_schoolbook == c_ntt}")

# === Demo lon hon: n=256, q=3329 (Kyber) ===
q_kyber = 3329   # Kyber modulus
n_kyber = 256    # Kyber degree (but actually Kyber uses negacyclic, simplified here)
# Kiem tra: q-1 = 3328 = 256 * 13 -> 256 | 3328 ✓
print(f"\nKyber parameters: q={q_kyber}, n={n_kyber}")
print(f"  q-1 = {q_kyber-1} = {n_kyber} * {(q_kyber-1)//n_kyber} -> n | q-1: {(q_kyber-1) % n_kyber == 0}")
omega_kyber = primitive_nth_root(q_kyber, n_kyber)
print(f"  Primitive {n_kyber}-th root of unity: omega = {omega_kyber}")

# Tao 2 da thuc ngau nhien
import random
random.seed(42)
a_big = [random.randint(0, q_kyber-1) for _ in range(n_kyber)]
b_big = [random.randint(0, q_kyber-1) for _ in range(n_kyber)]

# So sanh NTT vs schoolbook
c_schoolbook_big = poly_mul_schoolbook_cyclic(a_big, b_big, n_kyber, q_kyber)
c_ntt_big = poly_mul_ntt(a_big, b_big, n_kyber, q_kyber, omega_kyber)
print(f"\n  Nhan n={n_kyber} he so: NTT vs schoolbook match = {c_schoolbook_big == c_ntt_big}")

import time
t0 = time.time()
for _ in range(10):
    poly_mul_schoolbook_cyclic(a_big, b_big, n_kyber, q_kyber)
t_school = (time.time()-t0)/10

t0 = time.time()
for _ in range(10):
    poly_mul_ntt(a_big, b_big, n_kyber, q_kyber, omega_kyber)
t_ntt = (time.time()-t0)/10

print(f"\nPerformance n={n_kyber}:")
print(f"  Schoolbook: {t_school*1000:.1f}ms")
print(f"  NTT:        {t_ntt*1000:.1f}ms")
print(f"  Speedup:    {t_school/t_ntt:.1f}x")
```

---

## Summary / Key Takeaways

- **NTT** = DFT trong $\mathbb{Z}_q$ — thay complex roots of unity bằng integer primitive roots of unity mod $q$.
- **Điều kiện**: $q \equiv 1 \pmod{n}$ — primitive $n$-th root of unity $\omega \in \mathbb{Z}_q^*$ tồn tại.
- **NTT Convolution Theorem**: $\text{NTT}(a \circledast b) = \text{NTT}(a) \odot \text{NTT}(b)$ — nhân pointwise mod $q$.
- **Cyclic NTT** cho $\mathbb{Z}_q[x]/(x^n-1)$: cần $q \equiv 1 \pmod{n}$.
- **Negacyclic NTT** cho $\mathbb{Z}_q[x]/(x^n+1)$: cần $q \equiv 1 \pmod{2n}$, dùng $\psi$ với $\psi^2 = \omega$.
- **Fast NTT**: Cooley-Tukey butterfly trong $\mathbb{Z}_q$, $O(n \log n)$ phép tính modular.
- **Ưu điểm vs FFT**: không có floating-point errors — kết quả chính xác tuyệt đối trong $\mathbb{Z}_q$.
- **Ứng dụng**: Kyber (KEM), Dilithium/Falcon (signature), FHE, STARKs — bài tiếp theo.

---

## References

- Pollard, J. M. "The fast Fourier transform in a finite field." *Mathematics of Computation*, 25(114), 1971.
- Peng, J. et al. *Number Theoretic Transform and Its Applications in Lattice-based Cryptosystems: A Survey*. arXiv:2211.13546.
- Electric Dusk. "Intro to the NTT in ML-DSA and ML-KEM." electricdusk.com/ntt.html
