---
title: "07. Thực Nghiệm và Phân Tích Kết Quả"
type: deep-dive
tags: [rsa-cryptanalysis, experimental, sagemath, implementation, deep-dive, lesson-07]
aliases: [Experimental Results RSA, SageMath RSA Attack, Gap Analysis]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: Main Attack (xem [[05-main-attack-cf-lattice|05. Main Attack — CF + Lattice]]), MSB/LSB applications (xem [[06-msb-lsb-sharing-attacks|06. MSB/LSB Sharing Attacks]])  
> **Lesson type**: Deep Dive  
> **Covers**: §5 đầy đủ (Table 1 — 5 instances, Example 1 — 512-bit numerical walkthrough), §6 (Concluding Remarks — gap thực nghiệm vs lý thuyết, open problems)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\log_2 N$ | Bit-length của modulus $N$ |
> | $\alpha = \log_N e$ | Trong thực nghiệm: $\log_2 e / \log_2 N$ |
> | $\delta = \log_N \max(\|u\|,\|v\|)$ | Log-exponent của hệ số CF |
> | $\gamma = \log_N \|p+q-S\|$ | Log-exponent của sai số xấp xỉ |
> | $\delta_0 = \log_N d$ | Log-exponent của private key thực tế |
> | $m, t, \omega$ | Tham số lattice: level, shift depth, dimension |

---

## Từ Lý Thuyết Đến Thực Nghiệm

Trong các Lessons 04–06, chúng ta đã phân tích bounds asymptotic: $\delta_0 < 1 - \alpha/3 - \gamma/2$ (Theorem 6). Đây là kết quả lý thuyết — đạt được khi chiều lattice $\omega \to \infty$ (tức là $m \to \infty$). Trong thực tế, LLL hoạt động trên lattice **hữu hạn**, và khi $m$ nhỏ (3–5 trong các thực nghiệm), bound thực nghiệm thấp hơn đáng kể.

Bài học này đi sâu vào ba câu hỏi thực tiễn:
1. Bộ tham số $(m, t)$ nào hoạt động cho kích thước $N$ thực tế?
2. Gap giữa lý thuyết và thực nghiệm là bao nhiêu, và tại sao?
3. SageMath implement attack này như thế nào?

---

## Table 1: Kết Quả Thực Nghiệm

Tất cả thực nghiệm chạy trên Ubuntu 22.04 (WSL 2) với SageMath 10.3. RSA modulus 1024-bit.

| $\log_2 N$ | $\alpha$ | $\delta$ | $\gamma$ | $\delta_0$ | $m$ | $t$ | $\omega$ | Time (s) |
|------------|----------|----------|----------|------------|-----|-----|----------|----------|
| 1024 | 0.999 | 0.051 | 0.426 | 0.301 | 3 | 8 | 158 | 59.4 |
| 1024 | 1.000 | 0.061 | 0.415 | 0.309 | 3 | 7 | 142 | 40.9 |
| 1024 | 0.998 | 0.072 | 0.393 | 0.319 | 3 | 6 | 126 | 26.9 |
| 1024 | 0.991 | 0.076 | 0.379 | 0.329 | 3 | 5 | 110 | 16.4 |
| 1024 | 0.998 | 0.101 | 0.361 | 0.350 | 4 | 5 | 180 | 236.1 |

> [!tip] 💡 Agent note — Đọc bảng này
> Mỗi hàng là một RSA instance với tham số được chọn ngẫu nhiên. Cột $\delta_0 = \log_N d$ là kích thước private key thực tế tấn công thành công. Cột $\delta$ là kích thước hệ số $(u,v)$ trong relation (2). Lưu ý: $\delta$ thực nghiệm (~0.05–0.10) thấp hơn nhiều so với bound lý thuyết $\alpha/6 - \gamma/2 + 1/4$ (~0.18–0.21) — đây là **gap thực nghiệm** cần hiểu.

> [!warning] Gap Lý Thuyết vs Thực Nghiệm
> Với $\alpha \approx 1, \gamma \approx 0.4$: bound lý thuyết $\delta < 1/6 - 0.2 + 0.25 \approx 0.217$, còn $\delta_0$ lý thuyết $< 1 - 1/3 - 0.2 = 0.467$. Thực nghiệm chỉ đạt $\delta_0 \approx 0.30$–$0.35$ với $m = 3$–$4$. Gap này đến từ hai nguồn: (1) LLL output bound có factor $2^{O(\omega^2)}$ — với $\omega$ nhỏ, factor này không negligible; (2) Điều kiện solvable asymptotic giả định $m \to \infty$ nhưng $m = 3, 4$ còn xa giới hạn này.

---

## Example 1: Walkthrough Đầy Đủ (512-bit)

Paper trình bày một ví dụ số học hoàn chỉnh với $N$ 512-bit ($\log_2 N = 512$), $\alpha \approx 1$, $\delta \approx 0.07$, $\gamma \approx 0.4$.

**RSA parameters**:

$$
N = 6678\ldots3203 \quad (\text{512-bit})
$$

$$
e = 1723\ldots4051 \quad (\approx N, \text{ tức là } \alpha \approx 1)
$$

$$
S = 1663\ldots1600 \quad (\approx \lfloor p+q \rfloor, \text{ 198-bit})
$$

**Bước 1 — Tìm convergents**: Tính $e/N = [a_0, a_1, \ldots]$. Lấy $p_{r-1}/q_{r-1}$ và $p_r/q_r$ là cặp lớn nhất thỏa $q_r < N^{3/4}/\sqrt{e} \approx N^{1/4}$.

**Bước 2 — Tính hằng số**: Từ $p_r, q_r, p_{r-1}, q_{r-1}, N, S$ tính $a_1, a_2, a_3, a_4 \pmod{eq_r}$.

**Bước 3 — Xây lattice**: $m = 3$, $t = 6$ tối ưu → $\omega = 126$. Xây 126×126 lattice matrix.

**Bước 4 — LLL**: Chạy LLL trên lattice → ~8 giây. Thu được đủ đa thức nguyên $h_j(x,y,z)$.

**Bước 5 — Giải hệ**: Resultants → nghiệm:

$$
x_0 = w = 1202\ldots7476, \quad y_0 = u = 24562461685, \quad z_0 = v = 8887884439
$$

**Bước 6 — Factorize**: $p + q = x_0 + S$ → giải $p^2 - (p+q)p + N = 0$:

$$
p = 9871\ldots2459, \quad q = 6766\ldots6617
$$

Verify: $N = p \cdot q$ ✓, $d \approx N^{0.317}$ — vượt bound Boneh-Durfee ($N^{0.292}$).

---

## SageMath Implementation

Dưới đây là workflow SageMath mô phỏng Example 1. Code này không chạy được trong bài lesson (thiếu giá trị cụ thể) nhưng phản ánh đúng cấu trúc của cài đặt thực tế từ repository `RSA_CFL` của paper.

```python
from sage.all import *

def find_convergents(e, N, bound):
    """Tìm hai convergent liên tiếp p_{r-1}/q_{r-1}, p_r/q_r với q_r < bound."""
    cf = continued_fraction(e / N)
    convergents = cf.convergents()
    result = []
    for i, c in enumerate(convergents):
        if c.denominator() >= bound:
            break
        result.append((c.numerator(), c.denominator()))
    if len(result) < 2:
        return None
    pr1, qr1 = result[-2]
    pr,  qr  = result[-1]
    return pr, qr, pr1, qr1

def compute_constants(pr, qr, pr1, qr1, N, S, e):
    """Tính a1, a2, a3, a4 mod (e*qr)."""
    R = e * qr
    pr_inv = inverse_mod(pr, R)
    A = S - N - 1
    a1 = (pr1 * pr_inv) % R
    a2 = (-( N + 1 - S)) % R
    a3 = (-(( N + 1 - S) * pr1 - e * qr1) * pr_inv) % R
    a4 = (-pr_inv) % R
    return a1, a2, a3, a4

def build_lattice(a1, a2, a3, a4, e, qr, X, Y, Z, m, t):
    """
    Xây shift polynomial lattice theo Jochemsz-May strategy.
    Trả về ma trận lattice và danh sách monomial tương ứng.
    """
    R = e * qr
    # f(x,y,z) = x*y + a1*x*z + a2*y + a3*z + a4
    PR = PolynomialRing(ZZ, 'x,y,z')
    x, y, z = PR.gens()
    f = x*y + a1*x*z + a2*y + a3*z + a4

    # Thu thập monomial set theo Jochemsz-May (simplified for illustration)
    # Chi tiết đầy đủ: xem https://github.com/MengceZheng/RSA_CFL
    polys = []
    for k in range(m + 1):
        for i in range(k, m + 1):
            for j in range(k, m + 1):
                for l in range(max(i - j, 0), m - j + t + 1):
                    gkijl = x^(i-k) * y^(j-k) * z^l * f^k * R^(m-k)
                    # Scale: thay x -> X*x, y -> Y*y, z -> Z*z
                    scaled = gkijl(X*x, Y*y, Z*z)
                    polys.append(scaled)

    # Xây ma trận từ hệ số (bước này cần sort monomial order nhất quán)
    # ... (chi tiết omitted — xem implementation đầy đủ tại repository)
    return polys

def herrmann_may_attack(N, e, S, gamma, m, t):
    """
    Main attack: Theorem 6.
    Trả về (p, q) nếu thành công, None nếu thất bại.
    """
    bound_qr = Integer(N)^(Rational(3,4)) / sqrt(e)
    result = find_convergents(e, N, bound_qr)
    if result is None:
        return None
    pr, qr, pr1, qr1 = result

    X = Integer(N)^gamma
    Y = Z = Integer(N)^(Rational(1,6) - gamma/2 + Rational(1,4))

    a1, a2, a3, a4 = compute_constants(pr, qr, pr1, qr1, N, S, e)

    polys = build_lattice(a1, a2, a3, a4, e, qr, X, Y, Z, m, t)
    # Chạy LLL và giải hệ -> (w, u, v)
    # ... (LLL và resultant computation)
    # w = x0 -> p+q = w + S -> factorize N
    pass
```

> [!tip] 💡 Agent note — Repository
> Implementation đầy đủ của paper (bao gồm lattice construction, LLL wrapper, và resultant solver) có sẵn tại: [https://github.com/MengceZheng/RSA_CFL](https://github.com/MengceZheng/RSA_CFL). Cài đặt: SageMath 10.3 trên Linux (paper dùng Ubuntu 22.04 via WSL 2).

---

## Phân Tích Gap và Tối Ưu Tham Số

### Lựa chọn $(m, t)$

Từ Table 1:

- $m = 3$: đủ nhanh (10–60s), nhưng $\delta$ thực tế chỉ ~0.05–0.08.
- $m = 4$: tốt hơn về $\delta_0$ (~0.35), nhưng $\omega = 180$ và thời gian tăng vọt (236s).
- Tăng $m$ → $\omega \sim O(m^3)$ → thời gian LLL tăng theo $O(\omega^3 \cdot \log)$ → thực tế $m > 5$ là không khả thi với hardware hiện tại.

### Tối Ưu $t$ Với $m$ Cho Trước

Với $m$ cố định, $t$ ảnh hưởng đến $\omega$ (dimension) và $\det(L)$ (determinant). Paper chọn $t$ tối ưu bằng cách:

1. Với mỗi $t$ thử: tính $\det(L)$ và $\omega$ tường minh.
2. Kiểm tra điều kiện solvable $\det(L)^{1/(\omega-2)} < (eq_r)^m / \sqrt{\omega}$ (không asymptotic — tính chính xác).
3. Lấy $t$ lớn nhất thỏa mãn điều kiện — cho $\delta$ và $\delta_0$ lớn nhất.

> [!example] Hàng 1 trong Table 1 ($m=3, t=8, \omega=158$)
>
> - $\alpha = 0.999$, $\gamma = 0.426$, $\delta = 0.051$ → $\delta_0 = 0.301$
> - Bound lý thuyết: $\delta_0 < 1 - 0.999/3 - 0.426/2 = 1 - 0.333 - 0.213 = 0.454$
> - **Gap**: $0.454 - 0.301 = 0.153$ — tức là attack thực nghiệm chỉ đạt ~66% của bound lý thuyết với $m=3$.
> - Thời gian: 59.4s — chủ yếu là LLL trên 158×158 matrix.

---

## Concluding Remarks và Open Problems

### Kết Luận Chính (§6)

Paper đạt được ba mục tiêu:
1. **Lý thuyết**: Chứng minh bound $\delta_0 < 1 - \alpha/3 - \gamma/2$ vượt Herrmann-May trong hầu hết khoảng $e$ thực tế.
2. **Mở rộng**: Áp dụng cho MSB và LSB sharing — hai scenario thực tế quan trọng.
3. **Thực nghiệm**: Validate attack với 5 instances 1024-bit; đạt $\delta_0 \approx 0.35$ với $m=4$.

### Open Problems

> [!question] Open Problem 1 — Khai Thác Cấu Trúc Ẩn
> Paper (§6) nhận xét: gap thực nghiệm vs lý thuyết ($\delta \approx 0.07$ thực tế so với $\delta < 0.21$ lý thuyết) gợi ý có thể còn **cấu trúc ẩn** trong attack chưa được khai thác. Cụ thể: các đa thức $h_j$ từ LLL thực tế có thể có các quan hệ phụ thêm mà Assumption 1 (algebraic independence) bỏ qua.

> [!question] Open Problem 2 — Tối Ưu Lattice Construction
> Remark 1 (Lesson 05) đề cập: thêm shift trên biến $x$ có thể cải thiện bounds trong vùng nhỏ $\gamma$. Một câu hỏi mở là liệu có tồn tại **monomial set tốt hơn** Jochemsz-May cho đa thức $f(x,y,z) = xy + a_1xz + a_2y + a_3z + a_4$ hay không.

> [!question] Open Problem 3 — Khoảng Cách đến N^{0.292}
> Boneh-Durfee đạt $\delta_0 < 0.292$ không cần thông tin thêm ($S$ không cần biết). Liệu kết hợp CF + Lattice có thể đạt bound $> 0.292$ mà không cần $S$? Hiện tại Theorem 4 (Lesson 03) cho thấy CF thuần túy không vượt $N^{1/4}$ — nhưng main attack của paper cần $S$.

---

## Checklist Thực Nghiệm

Để reproduce các kết quả trong paper:

```python
# Checklist: reproduce Table 1, Row 1
# Environment: SageMath 10.3, Ubuntu 22.04

# 1. Generate random RSA instance
bits_N = 1024
alpha_target = 0.999
gamma_target = 0.426
delta_target = 0.051

# p, q random 512-bit primes
# d random với log_N(d) ~ delta_0 = delta + 3/4 - alpha/2 ~ 0.301
# e = inverse(d, phi(N))
# S = floor(p+q) truncated to give |p+q-S| ~ N^gamma

# 2. Find convergents of e/N below N^(3/4)/sqrt(e)

# 3. Compute a1..a4

# 4. Set m=3, t=8 -> omega=158

# 5. Build and LLL-reduce lattice

# 6. Resultants -> (w, u, v) -> p+q -> factorize

# Expected: p, q recovered in ~60s
```

---

## Tóm Tắt

- **Table 1**: 5 instances 1024-bit; $\delta_0$ thực nghiệm từ 0.301 đến 0.350 với $m=3,4$.
- **Example 1**: 512-bit instance với $\delta_0 \approx 0.317 > 0.292$ (Boneh-Durfee) — attack thành công trong ~8s với $\omega=126$.
- **Gap thực nghiệm**: ~33% dưới bound lý thuyết với $m=3$; tăng $m$ cải thiện nhưng thời gian tăng mũ.
- **Tối ưu $(m,t)$**: $t$ chọn để maximize $\delta_0$ trong khi thỏa điều kiện solvable tính chính xác (không asymptotic).
- **Open problems**: cấu trúc ẩn trong attack, monomial set tối ưu hơn, bound không cần $S$.
- **Repository**: [https://github.com/MengceZheng/RSA_CFL](https://github.com/MengceZheng/RSA_CFL) — SageMath implementation đầy đủ.

---

## References

- [JM06] Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials*, ASIACRYPT 2006 (⚪ strategy reference)
- [HM10] Herrmann, May — *Maximizing Small Root Bounds by Linearization*, PKC 2010 (⚪ baseline comparison)
- [BD99] Boneh, Durfee — *Cryptanalysis of RSA with Private Key $d < N^{0.292}$*, EUROCRYPT 1999 (⚪ previous SOTA)
- [SageMath] The Sage Developers — SageMath Version 10.3, 2025. https://www.sagemath.org (⚪ implementation platform)
