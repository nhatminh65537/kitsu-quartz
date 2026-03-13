---
title: "09. Algebraic Cryptanalysis — Cơ bản"
tags: [cryptography, zk-hash, cryptanalysis, algebraic, differential, linear, lesson-09]
aliases: [Algebraic Cryptanalysis Basics]
created: 2026-03-13
---

> **Prerequisites**: [[03-zk-friendly-criteria|03. Tiêu chí ZK-Friendly]], [[04-mimc-gmimc|04. MiMC & GMiMC]], [[05-poseidon-design|05. Poseidon]], đại số tuyến tính cơ bản, đa thức trên trường hữu hạn
> **Objectives**:
> - Hiểu differential và linear cryptanalysis trong setting algebraic (khác với setting bitwise)
> - Nắm khái niệm algebraic degree và tại sao nó là metric bảo mật
> - Biết differential uniformity và linear bias trong context ZK hash
> - Phân tích được tại sao từng attack không hiệu quả với số rounds đủ lớn

---

## Motivation

Để đánh giá bảo mật của một ZK hash function — hoặc tìm vulnerability trong implementation — cần hiểu các công cụ tấn công mà các nhà mật mã học dùng. Bài này và bài tiếp theo (Lesson 10) xây dựng nền tảng cryptanalysis cho ZK hashes.

Điểm khác biệt cơ bản: Cryptanalysis của ZK hashes là **algebraic cryptanalysis** — tấn công bằng cách khai thác cấu trúc đa thức, khác với cryptanalysis của AES/DES (dùng nhiều statistical/bitwise analysis hơn).

---

## Differential Cryptanalysis trong Algebraic Setting

Differential cryptanalysis (Biham, Shamir 1990) là attack kinh điển cho block ciphers. Trong ZK hashes, nó có dạng khác.

> [!definition] Definition 9.1 — Differential
> Với hàm $f: \mathbb{F}_p^n \to \mathbb{F}_p^m$, một **differential** là cặp $(a, b)$ với:
>
> $$\Pr_{x \in \mathbb{F}_p^n}[f(x + a) - f(x) = b] = \epsilon$$
>
> $\epsilon$ được gọi là **differential probability** của $(a, b)$.
>
> Với random function, $\epsilon \approx p^{-m}$ (mỗi output difference xảy ra với probability đều). Nếu có $(a, b)$ với $\epsilon \gg p^{-m}$, hàm có **differential bias**.

**Trong ZK hash context**: Ta quan tâm đến differential của toàn bộ permutation, không chỉ từng S-box.

### Differential của Power Map $x^\alpha$

> [!theorem] Theorem 9.2 — Differential Uniformity của Power Map
> Với $f(x) = x^\alpha$ trên $\mathbb{F}_p$ và $\gcd(\alpha, p-1) = 1$ (bijection), số lượng solutions của $f(x+a) - f(x) = b$ với $a \neq 0$ bị bounded:
>
> $$\#\{x : (x+a)^\alpha - x^\alpha = b\} \leq (\alpha - 1)$$
>
> Với $\alpha = 5$: Tối đa 4 solutions → differential probability $\leq 4/p$.
>
> Với $\alpha = 3$: Tối đa 2 solutions → differential probability $\leq 2/p$.

Đây là lý do power maps được ưa thích — differential probability thấp và bounded.

```python
def compute_differential_distribution(alpha, p, num_samples=1000):
    """
    Tính phân phối differential probability cho f(x) = x^alpha
    Ước lượng bằng sampling (không full search vì p lớn)
    """
    import random

    max_solutions = 0
    for _ in range(num_samples):
        a = random.randint(1, p-1)
        b = random.randint(0, p-1)

        # Đếm số solutions x sao cho (x+a)^alpha - x^alpha = b (mod p)
        count = 0
        # Với p nhỏ, brute force được
        for x in range(p):
            lhs = (pow(x + a, alpha, p) - pow(x, alpha, p)) % p
            if lhs == b:
                count += 1

        max_solutions = max(max_solutions, count)

    return max_solutions

# Demo với prime nhỏ
p_small = 101

for alpha in [3, 5, 7]:
    max_sol = compute_differential_distribution(alpha, p_small, num_samples=200)
    print(f"x^{alpha} mod {p_small}: max differential solutions = {max_sol} (bound = {alpha-1})")
```

### Differential Attack Bị Chặn bởi MDS Matrix

> [!theorem] Theorem 9.3 — Wide Trail Strategy
> Trong SPN với MDS matrix $M$ (branch number $B(M) = t+1$), nếu một differential trail qua $r$ full rounds có $w$ active S-boxes, thì:
>
> $$w \geq (t+1) \cdot \lfloor r/2 \rfloor$$
>
> Với differential probability mỗi S-box $\leq \delta$, probability của toàn trail $\leq \delta^w$.
>
> Để attack thực tế cần $\delta^w \cdot p < 1$ (tổng probability qua tất cả trails < 1), điều này xảy ra khi đủ rounds.

---

## Linear Cryptanalysis trong Algebraic Setting

> [!definition] Definition 9.4 — Linear Approximation
> Với hàm $f: \mathbb{F}_p \to \mathbb{F}_p$, **linear bias** của xấp xỉ $(\alpha, \beta)$ là:
>
> $$\text{bias}(\alpha, \beta) = \left| \Pr_{x}[\alpha \cdot x = \beta \cdot f(x)] - \frac{1}{p} \right|$$
>
> Với power map $f(x) = x^d$, có thể tính bias bằng **exponential sums** (character sums).

**Quan trọng cho ZK hashes**: Linear cryptanalysis trực tiếp ít relevant hơn với prime fields lớn. Nhưng **linear structures** (invariant subspaces) có thể bị khai thác — xem Lesson 10.

---

## Algebraic Degree — Metric Bảo Mật Cốt Lõi

Đây là metric quan trọng nhất riêng với ZK hashes (ít liên quan đến AES/SHA):

> [!definition] Definition 9.5 — Algebraic Degree của Hàm
> Mỗi hàm $f: \mathbb{F}_p^n \to \mathbb{F}_p$ có thể biểu diễn duy nhất bằng **multivariate polynomial** (theo định lý biểu diễn trong trường hữu hạn). **Algebraic degree** của $f$ là bậc cao nhất của đơn thức trong biểu diễn đó.
>
> Ví dụ: $f(x_1, x_2) = x_1^3 x_2 + x_1 x_2^2 + 5$ có degree 4.

### Degree Growth qua Composition

> [!theorem] Theorem 9.6 — Degree Multiplication
> Nếu $f$ có degree $d_f$ và $g$ có degree $d_g$, thì $f \circ g$ có degree $\leq d_f \cdot d_g$.
>
> Trong SPN với S-box degree $d$, sau $r$ rounds: degree $\leq d^r$.
>
> **Saturation**: Khi degree đạt $p-1$ (tối đa trong $\mathbb{F}_p$), gọi là **degree saturation** — function trở thành "random-looking" từ góc độ polynomial.

```python
def analyze_degree_growth(alpha, num_rounds, t_state):
    """
    Phân tích growth của algebraic degree qua các rounds
    Full SPN với S-box x^alpha, state size t
    """
    # Sau r full rounds, degree của toàn bộ permutation tối đa là alpha^r
    # Partial rounds phức tạp hơn - simplification: chỉ count full rounds

    print(f"S-box: x^{alpha}, State: t={t_state}")
    print(f"{'Round':>6} {'Max Degree':>12} {'128-bit?':>10}")
    print("-" * 32)

    for r in range(1, num_rounds + 1):
        max_degree = alpha ** r
        ok = "✓" if max_degree > 2**128 else "✗"
        if r <= 5 or max_degree > 2**120:
            print(f"{r:>6} {max_degree:>12,.0f} {ok:>10}")
        if max_degree > 2**256:
            print(f"  ... (degree saturated)")
            break

# Poseidon full rounds analysis
print("=== Poseidon (alpha=5, only full rounds) ===")
analyze_degree_growth(5, 20, 3)

print("\n=== MiMC-7 ===")
analyze_degree_growth(7, 15, 1)
```

### Tại sao degree thấp là nguy hiểm

> [!danger] Danger 9.7 — Insufficient Degree
> Nếu sau toàn bộ rounds, algebraic degree của permutation $< 2^{128}$, attacker có thể:
>
> 1. **Collect samples**: Thu thập các cặp $(x, f(x))$
> 2. **Interpolation**: Nếu degree $= d$ và attacker có $d+1$ sample, họ có thể tìm đa thức $f$ chính xác
> 3. **Inversion**: Dùng đa thức đó để tính $f^{-1}(y)$ cho bất kỳ $y$ nào
>
> Đây là **interpolation attack** — cực kỳ nguy hiểm với ZK hashes thiết kế kém. Sẽ phân tích kỹ ở Lesson 10.

---

## Statistical Distinguishers

> [!definition] Definition 9.8 — Distinguisher
> Một **distinguisher** cho $f$ là thuật toán $\mathcal{D}$ có thể phân biệt $f$ khỏi **random oracle** (một hàm ngẫu nhiên lý tưởng) với advantage đáng kể:
>
> $$\text{Adv}(\mathcal{D}) = \left| \Pr[\mathcal{D}^f = 1] - \Pr[\mathcal{D}^{\mathcal{F}} = 1] \right| > \text{negl}(\lambda)$$

**Loại distinguisher với ZK hashes**:

1. **Differential distinguisher**: Tìm $(a, b)$ với probability cao hơn random
2. **Degree distinguisher**: Degree của $f$ thấp hơn $p-1$ → detectible
3. **Truncated differential**: Ignore một số output bits, tăng probability
4. **Algebraic distinguisher**: Tìm algebraic relation ít phức tạp hơn full degree

> [!example] Example 9.9 — Degree Distinguisher (Ví dụ đơn giản)
> Giả sử có hash $H: \mathbb{F}_p^2 \to \mathbb{F}_p$ với algebraic degree thực sự là 10 (không phải max $p-1$).
>
> **Distinguishing attack**:
> 1. Collect $11$ cặp $(x_1, H(x_1, 0)), (x_2, H(x_2, 0)), \ldots, (x_{11}, H(x_{11}, 0))$ (fix second input = 0)
> 2. Fit univariate polynomial bậc 10 qua 11 điểm
> 3. **Test**: Với $x_{12}$ mới, check nếu polynomial value = $H(x_{12}, 0)$
> 4. Với random oracle: test sẽ fail với probability $\approx 1$
> 5. Với weak $H$: test sẽ pass với probability $\approx 1$
>
> **Conclusion**: $H$ bị distinguished với $O(11)$ queries — trivial!

---

## Tóm tắt Security Arguments

Một ZK hash function có claim "128-bit security" phải đảm bảo:

```
Security Checklist (Cryptographic Level):

□ Differential bound: max_diff_prob ≤ 2^{-128}
  → Cần đủ rounds và MDS matrix tốt (branch number = t+1)

□ Linear bound: max_linear_bias ≤ 2^{-64}
  → Tương tự differential

□ Algebraic degree: degree ≥ 2^{128} sau full permutation
  → Số rounds đủ theo Theorem 9.6

□ No structural distinguishers (degree/invariant)
  → Không có algebraic relation "ngắn" nào

□ No interpolation attack với < 2^{128} queries
  → Degree phải đủ cao (Lesson 10)

□ No Gröbner basis attack trong < 2^{128} ops
  → Số equations và degree đủ cao (Lesson 10)
```

Với **Poseidon** và tham số chuẩn (BN254, t=3, $R_F=8$, $R_P=57$): Tất cả checks đều pass.

Với **Poseidon giảm rounds** (ví dụ: tự ý dùng $R_F=4$, $R_P=20$): Algebraic degree check FAIL → **critical vulnerability**.

---

## Công cụ SageMath để Phân tích

```python
# SageMath: Tính algebraic degree của SPN toy
# Chạy trong SageMath (không phải Python thuần)

# NOTE: Đây là SageMath pseudocode - cần chạy trong Sage environment
SAGE_CODE = """
p = 101  # small prime for demo
F = GF(p)
R = PolynomialRing(F, 'x')
x = R.gen()

# S-box: x^3
def sbox(val):
    return F(val)^3

# Tính algebraic degree sau r rounds (simplified - 1D)
def check_degree_1d(num_rounds):
    # Bắt đầu với identity polynomial
    coeffs = [0] * p
    coeffs[1] = 1  # poly = x

    # Apply rounds
    for r in range(num_rounds):
        # Apply S-box: x -> x^3
        # Bình phương degree
        pass  # simplified

    # Degree của f sau num_rounds rounds (SPN với S-box x^3)
    max_degree = 3 ** num_rounds
    return min(max_degree, p - 1)

for r in range(1, 10):
    d = check_degree_1d(r)
    print(f"Round {r}: degree = {d}")
"""

# Minh họa bằng Python thuần (approximation)
def degree_after_rounds(alpha, num_rounds, p):
    raw = alpha ** num_rounds
    return min(raw, p - 1)

p = 101
for alpha, name in [(3, "MiMC-3"), (5, "Poseidon"), (7, "Rescue-7")]:
    print(f"\n{name} (p={p}):")
    for r in range(1, 8):
        d = degree_after_rounds(alpha, r, p)
        print(f"  {r} rounds: degree = {d}", "(saturated)" if d == p-1 else "")
```

---

## Summary / Key Takeaways

- **Differential cryptanalysis**: Power maps $x^\alpha$ có differential probability $\leq (\alpha-1)/p$ — thấp với prime lớn
- **MDS matrix và Wide Trail**: Đảm bảo minimum active S-boxes qua mỗi round → bound differential probability
- **Algebraic degree**: Metric bảo mật cốt lõi cho ZK hashes. Sau $r$ full rounds: degree $\leq \alpha^r$. Phải $> 2^{128}$
- **Degree saturation**: Khi degree đạt $p-1$, permutation "random-looking" — nhưng đây là upper bound, không guarantee security
- **Distinguishers**: Tồn tại khi structure có thể phân biệt khỏi random oracle trong $< 2^{128}$ queries
- **Số rounds là critical security parameter** — giảm rounds = giảm degree = tăng risk interpolation attack

---

## References

- Biham, Shamir — *Differential Cryptanalysis of DES-like Cryptosystems* (1990)
- Matsui — *Linear Cryptanalysis Method for DES Cipher* (1993)
- Daemen, Rijmen — *The Design of Rijndael* (AES), Ch. on Wide Trail strategy
- Grassi et al. — *POSEIDON* paper, Section on Security Analysis (eprint.iacr.org/2019/458)
- Bariant et al. — *Algebraic Attacks against Some Arithmetization-Oriented Primitives* (ToSC 2022)
- Boneh, Shoup — *A Graduate Course in Applied Cryptography*, Ch. on Block Ciphers (toc.cryptobook.us)
