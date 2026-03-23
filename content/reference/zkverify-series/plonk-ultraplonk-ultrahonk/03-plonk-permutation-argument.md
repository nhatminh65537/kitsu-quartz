---
title: "03. PLONK Permutation Argument"
tags: [crypto, plonk, permutation, grand-product, lesson-03]
aliases: [PLONK Permutation Argument]
created: 2026-03-13
---

> **Prerequisites**: [[02-plonk-arithmetization|02. PLONK Arithmetization]] — copy constraints, wire polynomials, vanishing polynomial; [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]] — polynomial identities trên $H$  
> **Objectives**:  
> - Hiểu tại sao copy constraints cần một argument riêng (không encode được bằng gate equations)
> - Nắm vững multiset equality check và grand product argument (Bayer-Groth)
> - Derive permutation polynomial $z(X)$ và tại sao nó đủ để enforce copy constraints
> - Phân tích attack khi permutation argument bị implement sai

---

## Motivation

Sau khi có gate constraints, ta cần enforce **copy constraints**: nếu wire $a_2$ phải bằng $c_1$, Prover phải không thể dùng giá trị khác.

Ý tưởng ngây thơ: thêm gate riêng "$a_i = c_j$". Nhưng điều này sẽ tạo thêm $O(n)$ gates — không hiệu quả.

**Ý tưởng của PLONK**: Encode tất cả copy constraints thành một **permutation** duy nhất, rồi dùng một argument chứng minh permutation đúng với **một polynomial duy nhất** $z(X)$.

---

## Từ Copy Constraints đến Permutation

### 3n vị trí

Ta có $3n$ vị trí (cells): cột $a$ có $n$ cells, cột $b$ có $n$ cells, cột $c$ có $n$ cells.

Đánh số: vị trí $(a, i) \mapsto i$, $(b, i) \mapsto n+i$, $(c, i) \mapsto 2n+i$ với $i = 0, \ldots, n-1$.

Copy constraint "$a_i = c_j$" $\Leftrightarrow$ hai vị trí $i$ và $2n+j$ phải có cùng giá trị.

**Encode thành cycles**: Tất cả các vị trí phải có cùng giá trị được nhóm vào **một cycle** trong permutation $\sigma$.

> [!definition] Definition 3.1 — Permutation $\sigma$
> $\sigma: \{0, 1, \ldots, 3n-1\} \to \{0, 1, \ldots, 3n-1\}$ là permutation sao cho:
>
> Nếu các vị trí $p_1, p_2, \ldots, p_k$ phải có cùng giá trị, ta set $\sigma(p_1) = p_2$, $\sigma(p_2) = p_3$, ..., $\sigma(p_k) = p_1$ (một cycle).
>
> Nếu vị trí $p$ không có copy constraint nào, $\sigma(p) = p$ (fixed point).

**Giá trị ở vị trí $p$** là:
- $a_i$ nếu $p = i < n$
- $b_i$ nếu $p = n+i$
- $c_i$ nếu $p = 2n+i$

Gọi vector $\mathbf{v} = [a_0, \ldots, a_{n-1}, b_0, \ldots, b_{n-1}, c_0, \ldots, c_{n-1}]$.

**Copy constraints đúng** $\Leftrightarrow$ $v_p = v_{\sigma(p)}$ với mọi $p$.

---

## Multiset Equality Check

> [!definition] Definition 3.2 — Multiset Equality Problem
> Cho vector $\mathbf{f} = (f_0, \ldots, f_{m-1})$ và $\mathbf{t} = (t_0, \ldots, t_{m-1})$. Chứng minh $\mathbf{f}$ là một **hoán vị** (permutation) của $\mathbf{t}$, tức là hai vector giống nhau như multisets.

**Kỹ thuật**: Dùng hai challenges ngẫu nhiên $\beta, \gamma \in \mathbb{F}$. Nếu $\mathbf{f}$ là permutation của $\mathbf{t}$, thì:

$$\prod_{i=0}^{m-1} (f_i + \beta \cdot i + \gamma) = \prod_{i=0}^{m-1} (t_i + \beta \cdot \sigma(i) + \gamma)$$

**Lý giải**: Mỗi factor $(f_i + \beta \cdot i + \gamma)$ "fingerprint" cặp $(i, f_i)$. Nếu $\sigma$ là permutation và $f_i = f_{\sigma^{-1}(i)}$ (copy constraints đúng), thì hai tích bằng nhau vì chứa cùng tập factors.

---

## Grand Product Argument (Bayer-Groth)

Ta cần chứng minh:

$$\prod_{i=0}^{n-1} \frac{(a_i + \beta \cdot i + \gamma)(b_i + \beta(n+i) + \gamma)(c_i + \beta(2n+i) + \gamma)}{(a_i + \beta \cdot S_{\sigma 1}(i) + \gamma)(b_i + \beta \cdot S_{\sigma 2}(i) + \gamma)(c_i + \beta \cdot S_{\sigma 3}(i) + \gamma)} = 1$$

trong đó $S_{\sigma 1}, S_{\sigma 2}, S_{\sigma 3}$ encode permutation $\sigma$ trên 3 cột.

Thay $i$ bằng $\omega^i$ (roots of unity), dùng cosets $k_1 \omega^i$, $k_2 \omega^i$ thay cho $n+i$, $2n+i$:

> [!definition] Definition 3.3 — Permutation Polynomial $z(X)$
> Định nghĩa $z(X)$ bằng cách interpolate:
>
> $$z(1) = 1$$
>
> $$z(\omega^{i+1}) = z(\omega^i) \cdot \frac{(a_i + \beta \omega^i + \gamma)(b_i + \beta k_1 \omega^i + \gamma)(c_i + \beta k_2 \omega^i + \gamma)}{(a_i + \beta S_{\sigma 1}(\omega^i) + \gamma)(b_i + \beta S_{\sigma 2}(\omega^i) + \gamma)(c_i + \beta S_{\sigma 3}(\omega^i) + \gamma)}$$
>
> Đây là **accumulator** — tích luỹ dần dần. Nếu copy constraints đúng, $z(\omega^n) = z(1) = 1$.

> [!theorem] Theorem 3.4 — Correctness của Permutation Check
> Copy constraints thỏa mãn $\Leftrightarrow$ tồn tại $z(X)$ thỏa mãn hai điều kiện trên $H$:
>
> **Điều kiện 1 (khởi tạo)**: $(z(X) - 1) L_1(X) = 0$ trên $H$
>
> **Điều kiện 2 (accumulation)**: $z(\omega X) \cdot [(a + \beta S_{\sigma 1} + \gamma)(b + \beta S_{\sigma 2} + \gamma)(c + \beta S_{\sigma 3} + \gamma)]$
> $= z(X) \cdot [(a + \beta X + \gamma)(b + \beta k_1 X + \gamma)(c + \beta k_2 X + \gamma)]$ trên $H$

Hai điều kiện này kết hợp thành **polynomial identities** mà Prover phải prove — tức là chứng minh quotient polynomial tương ứng tồn tại.

---

## Implementation — Grand Product

```python
def compute_permutation_polynomial(a_vals, b_vals, c_vals,
                                    s_sigma1, s_sigma2, s_sigma3,
                                    beta, gamma, omega, p):
    """
    Tính z(omega^i) cho i = 0..n-1.
    a_vals, b_vals, c_vals: witness values
    s_sigma1/2/3: permutation sigma evaluations tại omega^i
    beta, gamma: random challenges
    """
    n = len(a_vals)
    k1 = 2   # coset shift for column b
    k2 = 3   # coset shift for column c (k1, k2 != 1, k1 != k2, không trong H)

    z = [0] * n
    z[0] = 1  # z(omega^0) = z(1) = 1

    H = [pow(omega, i, p) for i in range(n)]

    for i in range(n - 1):
        wi = H[i]
        # Numerator: "id permutation" side
        num = ((a_vals[i] + beta * wi + gamma) *
               (b_vals[i] + beta * k1 * wi + gamma) *
               (c_vals[i] + beta * k2 * wi + gamma)) % p
        # Denominator: "sigma permutation" side
        den = ((a_vals[i] + beta * s_sigma1[i] + gamma) *
               (b_vals[i] + beta * s_sigma2[i] + gamma) *
               (c_vals[i] + beta * s_sigma3[i] + gamma)) % p
        den_inv = pow(den, p - 2, p)
        z[i+1] = (z[i] * num * den_inv) % p

    return z

# Demo
p = 337
n = 4
g = 10
omega = pow(g, (p - 1) // n, p)
H = [pow(omega, i, p) for i in range(n)]

x_val = 3
a_vals = [x_val, x_val**2 % p, x_val**3 % p, (x_val**3 + x_val) % p]
b_vals = [x_val, x_val, x_val, 5]
c_vals = [x_val**2 % p, x_val**3 % p, (x_val**3 + x_val) % p, 35]

# Copy constraints: a[1] = c[0], a[2] = c[1], b[0]=b[1]=b[2]=a[0]
# Encode: sigma trên 3n = 12 positions
# Positions: a0=0, a1=1, a2=2, a3=3, b0=4, b1=5, b2=6, b3=7, c0=8, c1=9, c2=10, c3=11
# Cycles: {0,4,5,6} (x), {1,8} (x^2), {2,9} (x^3), {3,10} (x^3+x), {7} (5), {11} (35)

def make_sigma(n, cycles):
    """cycles: list of lists of positions in same cycle."""
    sigma = list(range(3 * n))
    for cycle in cycles:
        for i in range(len(cycle)):
            sigma[cycle[i]] = cycle[(i + 1) % len(cycle)]
    return sigma

cycles = [
    [0, 4, 5, 6],   # x appears at a0, b0, b1, b2
    [1, 8],          # x^2 at a1, c0
    [2, 9],          # x^3 at a2, c1
    [3, 10],         # x^3+x at a3, c2
    # b3=7, c3=11: single fixed points
]
sigma = make_sigma(n, cycles)

# Encode sigma into s_sigma1, s_sigma2, s_sigma3
# s_sigma_j(omega^i) = coset of sigma(j*n + i)
k1, k2 = 2, 3
def coset_rep(pos, H, k1, k2, n):
    """Map position to coset representative."""
    if pos < n:
        return H[pos]
    elif pos < 2 * n:
        return (k1 * H[pos - n]) % p
    else:
        return (k2 * H[pos - 2*n]) % p

s_sigma1 = [coset_rep(sigma[i], H, k1, k2, n) for i in range(n)]
s_sigma2 = [coset_rep(sigma[n+i], H, k1, k2, n) for i in range(n)]
s_sigma3 = [coset_rep(sigma[2*n+i], H, k1, k2, n) for i in range(n)]

# Random challenges
beta, gamma = 7, 13
z = compute_permutation_polynomial(
    a_vals, b_vals, c_vals,
    s_sigma1, s_sigma2, s_sigma3,
    beta, gamma, omega, p
)

# Verify: grand product should be 1
grand_product = 1
for i in range(n):
    wi = H[i]
    num = ((a_vals[i] + beta*wi + gamma) *
           (b_vals[i] + beta*k1*wi + gamma) *
           (c_vals[i] + beta*k2*wi + gamma)) % p
    den = ((a_vals[i] + beta*s_sigma1[i] + gamma) *
           (b_vals[i] + beta*s_sigma2[i] + gamma) *
           (c_vals[i] + beta*s_sigma3[i] + gamma)) % p
    grand_product = (grand_product * num * pow(den, p-2, p)) % p

print(f"Grand product = {grand_product} (expect 1: {grand_product == 1})")
print(f"z values: {z}")
print("Permutation argument demo: OK")
```

---

## Bug Bounty: Broken Permutation Argument

> [!danger] Vulnerability 3.5 — Missing Copy Constraint → Soundness Break
> Nếu một copy constraint bị thiếu (ví dụ: output của gate 1 không được link làm input của gate 2), Prover có thể dùng **giá trị tùy ý** tại vị trí đó mà vẫn pass verification.
>
> **Khai thác**: Đặt giá trị giả vào wire tự do, thoả mãn gate constraints cục bộ nhưng sai logic chung.

> [!danger] Vulnerability 3.6 — Wrong Coset Parameters $k_1, k_2$
> Nếu $k_1$ hoặc $k_2$ nằm trong subgroup $H$ (thay vì cosets của $H$), cột $b$ hoặc $c$ sẽ overlap với cột $a$ trong không gian domain.
>
> **Hậu quả**: Permutation check có thể pass ngay cả khi copy constraints sai, vì các element trong "identity permutation" bị collide.
>
> **Kiểm tra**: Đảm bảo $k_1, k_2 \notin H$ và $k_1 \neq k_2 \neq 1$.

> [!danger] Vulnerability 3.7 — Denominator Zero (Abort Leak)
> Nếu tại bước tính $z$, denominator bằng 0 (tức là $a_i + \beta S_{\sigma 1}(\omega^i) + \gamma = 0$), Prover **abort**. Điều này leak thông tin về witness (một dạng statistical ZK failure).
>
> **Trích từ PLONK paper (footnote 11)**: "prover aborts caused by denominators being zero in the computation of Z in Section 5 leak information about the witnesses." — đây là lý do PLONK chỉ đạt *statistical* ZK, không phải perfect ZK.

---

## Summary

- **Copy constraints** được encode thành permutation $\sigma$ trên $3n$ vị trí.
- **Grand product argument** kiểm tra multiset equality: hai sản phẩm bằng nhau $\Leftrightarrow$ permutation đúng.
- **Permutation polynomial** $z(X)$ là accumulator, khởi đầu $z(1) = 1$, chứng minh tích lũy đúng.
- **Hai polynomial identities** phải thỏa mãn trên $H$: init condition và accumulation step.
- **Bug bounty**: missing copy constraints, sai coset params $k_1/k_2$, denominator zero leak.

---

## References

- Gabizon, Williamson, Ciobotaru — *PLONK* (ePrint 2019/953), Section 5
- Bayer, Groth — *Efficient Zero-Knowledge Argument for Correctness of a Shuffle* (Eurocrypt 2012)
- Aztec — HackMD: *Notes on Plonk Prover's Algorithm* (Arijit Dutta)
- 0xPARC ZK Bug Tracker — Copy constraint bugs
