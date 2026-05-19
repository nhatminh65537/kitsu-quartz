---
title: "44. Ordinary vs Supersingular AV"
type: theory
tags: [math, abelian-varieties, lesson-44]
aliases: [Ordinary Abelian Variety, Supersingular Abelian Variety, Newton Polygon]
created: 2026-05-19
---

> **Prerequisites**: [[43-honda-tate-classification|43. Honda-Tate Classification]], [[39-frobenius-endomorphism|39. Frobenius Endomorphism π_A]], [[17-n-torsion-points|17. n-Torsion Points A[n]]]
> **Objectives**:
> - Định nghĩa ordinary và supersingular abelian variety qua $p$-torsion
> - Hiểu Newton polygon và slope phân loại abelian varieties
> - Nắm đặc trưng của ordinary AV ($p$-rank = $g$) và supersingular AV (tất cả slope $= 1/2$)
> - Biết tính đặc biệt của supersingular AV: endomorphism algebra lớn hơn
> - Kết nối với Honda-Tate: Frobenius polynomial phân loại ordinary/supersingular

---

## Motivation / Intuition

Trong đặc số $p > 0$, có một sự phân chia cơ bản giữa hai "cực": **ordinary** và **supersingular**. Ý tưởng: $p$-torsion của abelian variety có thể "lớn" (ordinary) hoặc "nhỏ" (supersingular), phản ánh hành vi của Frobenius ở prime $p$.

Với elliptic curve $E/\mathbb{F}_p$: nếu $E[p](\overline{\mathbb{F}}_p) \cong \mathbb{Z}/p$ thì $E$ là ordinary; nếu $E[p](\overline{\mathbb{F}}_p) = 0$ thì $E$ là supersingular. Điều đặc biệt: supersingular curves "hiếm" (chỉ có khoảng $p/12$ giá trị $j$ supersingular trong $\mathbb{F}_{p^2}$), nhưng lại cực kỳ đặc biệt về mặt số học — endomorphism ring của chúng là order trong **quaternion algebra** (dimension $4$ over $\mathbb{Q}$), trong khi elliptic curve ordinary chỉ có endomorphism ring trong imaginary quadratic field (dimension $2$).

Đối với abelian varieties chiều cao hơn, phân loại này được tinh chỉnh bởi **Newton polygon** — một đa giác mã hóa đầy đủ thông tin về $p$-divisible group của $A$.

---

## p-rank và Ordinary Abelian Variety

### Definition

> [!definition] Definition 44.1 — p-rank  
> Cho $A$ là abelian variety chiều $g$ over trường $k$ với $\text{char}(k) = p > 0$. **$p$-rank** của $A$ là số nguyên $f = f(A) \in \{0, 1, \ldots, g\}$ được định nghĩa bởi:
>
> $$
> |A[p](\overline{k})| = p^f
> $$
>
> Tương đương, $p$-rank $= \dim_{\mathbb{F}_p} \operatorname{Hom}(\mu_p, A[p])$ trong category of group schemes.

> [!definition] Definition 44.2 — Ordinary và Supersingular (Định nghĩa sơ bộ)  
> Abelian variety $A$ chiều $g$ gọi là:
>
> - **Ordinary** (thường): nếu $p$-rank tối đa, tức $f(A) = g$.
> - **Supersingular** (siêu kỳ dị): nếu $p$-rank bằng $0$, tức $|A[p](\overline{k})| = 1$ (tức $A[p]$ không có $\mathbb{F}_p$-points ngoài điểm $0$).

> [!note] Remark 44.3 — Ordinary vs Supersingular không phải là nhị phân  
> Với $g = 1$ (elliptic curves), $p$-rank $\in \{0, 1\}$, nên mọi elliptic curve hoặc ordinary hoặc supersingular. Nhưng với $g \geq 2$, có các trường hợp trung gian: $p$-rank $\in \{0, 1, \ldots, g\}$. Ví dụ với $g = 2$: abelian surface có thể có $p$-rank $0, 1$, hoặc $2$ (ordinary). Trường hợp $p$-rank $= 1$ không phải ordinary mà cũng không phải supersingular — cần Newton polygon để phân loại đầy đủ.

### Worked Example

> [!example] Example 44.4 — p-rank của Elliptic Curves  
> Cho $E/\mathbb{F}_p$, trace Frobenius $t = $ trace của $\pi_E$.
>
> - $p \nmid t$: $E$ ordinary, $p$-rank $= 1$, $|E[p](\overline{\mathbb{F}}_p)| = p$.
> - $p \mid t$ (tức $t \equiv 0 \pmod p$): $E$ supersingular, $p$-rank $= 0$, $|E[p](\overline{\mathbb{F}}_p)| = 1$.
>
> Cụ thể hơn: $E$ supersingular $\iff$ trace $t \equiv 0 \pmod p$. Với $p \geq 5$:
>
> $$
> E \text{ supersingular} \iff t = 0 \pmod p \iff t \in \{-p, 0, p\} \cap \{t:|t|\leq 2\sqrt{p}\}
> $$
>
> Số $j$-invariants supersingular modulo $p$: bằng $\lfloor p/12 \rfloor + \epsilon_p$ (với $\epsilon_p$ phụ thuộc vào $p \pmod{12}$). Tất cả $j$-invariants supersingular nằm trong $\mathbb{F}_{p^2}$.

---

## Newton Polygon

Newton polygon là công cụ mạnh mẽ để phân loại tinh tế hơn dựa trên $p$-divisible group.

### Definition

> [!definition] Definition 44.5 — p-divisible Group (Barsotti-Tate Group)  
> **$p$-divisible group** (hay Barsotti-Tate group) $A[p^\infty]$ của $A$ là hệ direct limit:
>
> $$
> A[p^\infty] = \varinjlim A[p^n]
> $$
>
> với các inclusion $A[p^n] \hookrightarrow A[p^{n+1}]$ via multiplication by $p$. $A[p^\infty]$ là group scheme của "chiều cao" $h = 2g$ trên $k$.

> [!definition] Definition 44.6 — Newton Polygon  
> Với $A$ chiều $g$ over $\overline{\mathbb{F}}_p$, **Newton polygon** của $A$ là đa giác phẳng được xây dựng từ phân tích $p$-divisible group:
>
> $$
> A[p^\infty] \sim_{\text{isogeny}} \bigoplus_i G_{m_i, n_i}^{r_i}
> $$
>
> với $G_{m,n}$ là $p$-divisible group chuẩn tắc (slope $= m/(m+n)$, chiều cao $m+n$).
>
> Newton polygon là đường nối các điểm $(0,0) \to (\sum r_i(m_i+n_i), \sum r_i m_i)$ với các đoạn có slope $m_i/(m_i+n_i)$ (xếp theo thứ tự tăng dần).
>
> **Slopes** của Newton polygon là các giá trị $\lambda_i = m_i/(m_i+n_i) \in [0,1] \cap \mathbb{Q}$.

> [!note] Remark 44.7 — Newton Polygon là Isogeny Invariant  
> Newton polygon của $A$ không thay đổi khi ta thay $A$ bằng một AV isogenous với nó. Đây là invariant của isogeny class.

### Worked Example

> [!example] Example 44.8 — Newton Polygon của Ordinary và Supersingular AV  
> **Ordinary** abelian variety chiều $g$:
>
> $$
> A[p^\infty] \sim_{\text{isogeny}} G_{1,0}^g \oplus G_{0,1}^g = \mu_{p^\infty}^g \oplus (\mathbb{Q}_p/\mathbb{Z}_p)^g
> $$
>
> Slopes: $g$ copies của slope $1 = 1/(1+0)$ và $g$ copies của slope $0 = 0/(0+1)$.
>
> Newton polygon: từ $(0,0)$ đến $(g, 0)$ (slope $0$) rồi đến $(2g, g)$ (slope $1$). Hình dạng: "chữ L" — nằm sát đáy rồi lên thẳng.
>
> **Supersingular** abelian variety chiều $g$:
>
> $$
> A[p^\infty] \sim_{\text{isogeny}} G_{1,1}^g
> $$
>
> Slopes: $2g$ copies của slope $1/2$.
>
> Newton polygon: đường thẳng duy nhất từ $(0,0)$ đến $(2g, g)$. Hình dạng: một đường thẳng duy nhất có slope $1/2$ (đường "thẳng hoàn hảo").

```
Newton Polygon examples (g=2):

Ordinary (slopes 0, 0, 1, 1):    Supersingular (slopes 1/2, 1/2, 1/2, 1/2):
 ^                                 ^
g|        *                       g|              *
 |       /                         |             /
 |      /  slope=1                 |            /
 |     /                           |           /  slope=1/2
 |____/                            |          /
 +---------->                      +----------->
 0  g  2g                          0   g  2g
```

---

## Ordinary Abelian Variety: Đặc Trưng

### Theorem

> [!theorem] Theorem 44.9 — Đặc Trưng của Ordinary AV  
> Cho $A$ là abelian variety chiều $g$ over $\mathbb{F}_q$ ($q = p^a$). Các điều kiện sau đây tương đương:
>
> (1) $A$ là ordinary: $p$-rank $= g$, tức $|A[p](\overline{\mathbb{F}}_q)| = p^g$.
>
> (2) Newton polygon của $A$ là convex hull của $(0,0)$, $(g,0)$, $(2g,g)$ (slopes $\{0^g, 1^g\}$).
>
> (3) $A[p^\infty] \sim \mu_{p^\infty}^g \oplus (\mathbb{Q}_p/\mathbb{Z}_p)^g$.
>
> (4) $p \nmid P_{\pi_A}(0) \cdot P_{\pi_A}'(0) \cdots$ (equivalently, $p \nmid \prod_{i: \text{slopes}=0} \alpha_i$ — không phải eigenvalue nào bằng $0$ modulo $p$).
>
> (5) Minimal polynomial của $\pi_A$ modulo $p$ có nghiệm đơn.

### Corollary

> [!corollary] Corollary 44.10 — Ordinary ↔ Frobenius Criterion  
> Elliptic curve $E/\mathbb{F}_p$ là ordinary $\iff$ $p \nmid t$ (trace của Frobenius).
>
> Abelian variety $A/\mathbb{F}_q$ là ordinary $\iff$ tất cả eigenvalues $p$-adic của Frobenius $\pi_A$ là $p$-adic units: $|\alpha_i|_p = 1$ với mọi $i$.

---

## Supersingular Abelian Variety: Đặc Trưng

### Theorem

> [!theorem] Theorem 44.11 — Đặc Trưng của Supersingular AV  
> Cho $A$ là abelian variety chiều $g$ over $\overline{\mathbb{F}}_p$. Các điều kiện sau tương đương:
>
> (1) $A$ là supersingular: $p$-rank $= 0$.
>
> (2) Newton polygon của $A$ là một đường thẳng duy nhất có slope $1/2$.
>
> (3) $A[p^\infty] \sim G_{1,1}^g$ (isoclinic $p$-divisible group of slope $1/2$).
>
> (4) Trên $\overline{\mathbb{F}}_p$: $A$ isogenous với $E^g$ với $E$ là một supersingular elliptic curve bất kỳ.
>
> (5) Tất cả eigenvalues $\alpha_i$ của Frobenius thỏa $v_p(\alpha_i) = a/2$ (với $q = p^a$), tức tất cả slopes của Newton polygon bằng $1/2$.

**Proof (sketch, đặc biệt (4)).**
Điều kiện (4) là kết quả của Oort (1974): với $\overline{\mathbb{F}}_p$, mọi supersingular AV isogenous với $E^g$. Điều này mạnh hơn rất nhiều so với ordinary case, nơi có nhiều isogeny classes khác nhau.

Chứng minh dùng Dieudonné module theory: $G_{1,1}^g$ là $p$-divisible group duy nhất (up to isogeny) của slope $1/2$ và height $2g$, nên tất cả supersingular AV chiều $g$ có cùng $p$-divisible group (up to isogeny), suy ra isogenous với nhau (trên $\overline{\mathbb{F}}_p$). $\blacksquare$

> [!warning] Remark 44.12 — Supersingular KHÔNG đồng nghĩa với "Superspecial"  
> Trong tài liệu có thêm khái niệm **superspecial**: $A$ superspecial nếu $a$-number (chiều của $\operatorname{Hom}(\alpha_p, A[p])$) bằng $g$ (tối đa). Superspecial $\Rightarrow$ supersingular, nhưng ngược lại không đúng với $g \geq 2$.
>
> Ví dụ với $g = 2$: abelian surface $A$ supersingular nhưng $a$-number $= 1 < 2$ (không superspecial).

### Worked Example

> [!example] Example 44.13 — Supersingular Elliptic Curves over $\mathbb{F}_p$  
> Cho $p \geq 5$. Elliptic curves supersingular over $\mathbb{F}_p$ có trace $t \equiv 0 \pmod p$, và vì $|t| \leq 2\sqrt{p} < 2p$, nên $t \in \{-p, 0, p\}$ nhưng $t = \pm p$ chỉ khi $p = 2\sqrt{p}$... thực ra $t = \pm p$ không xảy ra vì $|t| \leq 2\sqrt{p} < p$ với $p \geq 5$. Nên:
>
> $$
> \text{Supersingular} \iff t = 0 \pmod p \iff t = 0 \text{ (với } p \geq 5\text{)}
> $$
>
> Vì vậy: với $p \geq 5$, elliptic curve $E/\mathbb{F}_p$ supersingular $\iff$ $|E(\mathbb{F}_p)| = p + 1$.
>
> Ví dụ: $E: y^2 = x^3 - x$ over $\mathbb{F}_7$ có $|E(\mathbb{F}_7)| = 8 = 7+1$, nên $E$ supersingular.
>
> Tất cả $j$-invariants supersingular over $\mathbb{F}_p$ nằm trong $\mathbb{F}_{p^2}$. Số lượng: khoảng $\lfloor p/12 \rfloor$ (xem công thức Deuring).

> [!example] Example 44.14 — Phân loại theo Newton Polygon với $g=2$, $q=p$  
> Cho abelian surface $A/\mathbb{F}_p$. Newton polygon xác định bởi slopes $0 \leq \lambda_1 \leq \lambda_2 \leq 1$ (với $\lambda_1 + \lambda_2 = 1$ do tính đối xứng — functional equation):
>
> | Newton Polygon | Slopes | p-rank | Loại |
> |---|---|---|---|
> | $(0^2, 1^2)$ | $\{0, 0, 1, 1\}$ | $2$ | Ordinary |
> | $(0^1, 1/2^2, 1^1)$ | $\{0, 1/2, 1/2, 1\}$ | $1$ | "Almost ordinary" |
> | $(1/2^4)$ | $\{1/2, 1/2, 1/2, 1/2\}$ | $0$ | Supersingular |
>
> Với $p \geq 3$, tất cả ba trường hợp xảy ra.

---

## Endomorphism Algebra của Supersingular AV

Một trong những tính chất đặc trưng nhất của supersingular AV là endomorphism algebra của chúng "lớn bất thường":

### Theorem

> [!theorem] Theorem 44.15 — Endomorphism Algebra của Supersingular EC  
> Cho $E$ là supersingular elliptic curve over $\overline{\mathbb{F}}_p$. Khi đó:
>
> $$
> D = \operatorname{End}^0(E) = \operatorname{End}(E) \otimes \mathbb{Q}
> $$
>
> là quaternion division algebra over $\mathbb{Q}$, ramified chính xác tại $p$ và $\infty$. Đặc biệt:
>
> - $[D:\mathbb{Q}] = 4$ (so với $[D:\mathbb{Q}] = 2$ cho ordinary elliptic curve).
> - $\operatorname{rank}_\mathbb{Z} \operatorname{End}(E) = 4$ (so với $2$ cho ordinary EC).
>
> Với $E$ ordinary: $D = \operatorname{End}^0(E)$ là imaginary quadratic field, $[D:\mathbb{Q}] = 2$.

> [!note] Remark 44.16 — Hệ quả cho Cryptography  
> Supersingular elliptic curves có endomorphism ring giàu hơn nhiều so với ordinary curves. Điều này được tận dụng trong **isogeny-based cryptography** (e.g., SIDH/SIKE, SQISign), nơi ta làm việc trong isogeny graph của supersingular curves — các đồ thị "Ramanujan graph" với tính chất mixing tốt.
>
> Tuy nhiên, SIDH (Supersingular Isogeny Diffie-Hellman) đã bị phá vỡ năm 2022; các scheme tiếp theo như SQISign vẫn đang được nghiên cứu.

---

## Đặc Trưng Frobenius

Một trong những cách đơn giản nhất để kiểm tra ordinary/supersingular là qua Frobenius polynomial:

### Theorem

> [!theorem] Theorem 44.17 — Ordinary/Supersingular qua Frobenius  
> Cho $A$ chiều $g$ over $\mathbb{F}_q$ ($q = p^a$). Đặt $P_\pi(T) = \prod_i(T - \alpha_i)$ là characteristic polynomial của Frobenius.
>
> $A$ là **ordinary** $\iff$ đúng $g$ trong số $2g$ eigenvalues $\alpha_i$ là $p$-adic units (có $|\alpha_i|_p = 1$), và $g$ cái còn lại có $|\alpha_i|_p = 1/p^a$ (tức $v_p(\alpha_i) = a$).
>
> Tương đương, $A$ ordinary $\iff$ slopes của Newton polygon gồm $g$ slopes bằng $0$ và $g$ slopes bằng $1$.
>
> $A$ là **supersingular** $\iff$ tất cả $\alpha_i$ có $|\alpha_i|_p = p^{-a/2}$ (tức $v_p(\alpha_i) = a/2$).

### Worked Example

> [!example] Example 44.18 — Kiểm tra Ordinary/Supersingular từ Frobenius Polynomial  
> **(a)** $E/\mathbb{F}_{11}$ với $P_\pi(T) = T^2 - 2T + 11$.
>
> Eigenvalues: $\alpha = 1 + i\sqrt{10}$.
>
> $|\alpha|_{11} = $ ? Ta cần $v_{11}(\alpha)$. Vì $\alpha\bar\alpha = 11$, $v_{11}(\alpha) + v_{11}(\bar\alpha) = 1$. Và $v_{11}(\alpha) = v_{11}(\bar\alpha)$ (vì $\alpha, \bar\alpha$ là Galois conjugates over $\mathbb{Q}_{11}$). Nên $v_{11}(\alpha) = 1/2$.
>
> Wait — nhưng $t = 2$, $p = 11$, $p \nmid t = 2$. Theo Corollary 44.10, $E$ là **ordinary**. Mâu thuẫn?
>
> Lý do: khi $P_\pi$ là irreducible over $\mathbb{Q}_{11}$ (tức $\alpha$ và $\bar\alpha$ conjugate over $\mathbb{Q}_{11}$), cả hai đều có cùng $v_{11}$. Nhưng nếu $P_\pi$ splits over $\mathbb{Q}_{11}$, eigenvalues có $v_{11}$ khác nhau.
>
> Để $E$ ordinary, ta cần $P_\pi$ splits over $\mathbb{Q}_{11}$ với một root có $v_{11} = 0$ và một root có $v_{11} = 1$. Điều này xảy ra khi $p \nmid t$ (root mod $p$ phân biệt).
>
> **(b)** $E/\mathbb{F}_{11}$ với $P_\pi(T) = T^2 + 11$ (tức $t = 0$, $E$ supersingular).
>
> Over $\mathbb{Q}_{11}$: $P_\pi(T) = T^2 + 11$. Roots: $\pm\sqrt{-11}$. $v_{11}(\sqrt{-11}) = 1/2$. Cả hai eigenvalues đều có $v_{11} = 1/2$ ✓ (supersingular).

---

## Mật Độ Ordinary và Supersingular

> [!theorem] Theorem 44.19 — Mật độ của Ordinary AV  
> Với $g \geq 1$ cố định, khi $q \to \infty$ (qua prime powers với fixed $p$), "hầu hết" abelian varieties $g$-dimensional over $\mathbb{F}_q$ là **ordinary**. Cụ thể:
>
> - Số isogeny classes ordinary / Tổng số isogeny classes $\to 1$ khi $q \to \infty$.
>
> Ngược lại, số isogeny classes supersingular là hữu hạn (không phụ thuộc vào $q$ khi fixed $p$) với $g = 1$.
>
> Với $g \geq 2$: số isogeny classes supersingular cũng hữu hạn nhưng phức tạp hơn.

> [!example] Example 44.20 — Supersingular Elliptic Curves over $\mathbb{F}_p$  
> Số supersingular $j$-invariants over $\overline{\mathbb{F}}_p$ (với $p \geq 5$):
>
> $$
> \#\{j \in \overline{\mathbb{F}}_p : E_j \text{ supersingular}\} = \left\lfloor \frac{p-1}{12} \right\rfloor + \epsilon_p
> $$
>
> với $\epsilon_p$ là correction term phụ thuộc vào $p \pmod{12}$:
>
> | $p \pmod{12}$ | $\epsilon_p$ |
> |---|---|
> | $1$ | $0$ |
> | $5$ | $1$ |
> | $7$ | $1$ |
> | $11$ | $2$ |
>
> Ví dụ: $p = 11$: $\lfloor 10/12 \rfloor + 2 = 0 + 2 = 2$ supersingular $j$-invariants.
>
> $p = 23$: $\lfloor 22/12 \rfloor + 2 = 1 + 2 = 3$.
>
> Tất cả $j$-invariants supersingular nằm trong $\mathbb{F}_{p^2}$ (không nhất thiết trong $\mathbb{F}_p$).

---

## Newton Polygon và Manin's Conjecture

> [!theorem] Theorem 44.21 — Manin's Theorem (Honda's Theorem)  
> Mọi Newton polygon **đối xứng** đều xảy ra cho một abelian variety over $\overline{\mathbb{F}}_p$.
>
> "Đối xứng" ở đây nghĩa là: nếu $\lambda$ là slope thì $1-\lambda$ cũng là slope với cùng multiplicity.

Đây chính là điều Honda chứng minh (cùng với surjectivity trong Honda-Tate). Manin đề xuất conjecture này dựa trên điều kiện cần thiết; Honda chứng minh nó là đủ.

---

## SageMath Cheatsheet

```python
# Check ordinary vs supersingular for elliptic curves
def classify_ec(q, a, b):
    """Classify elliptic curve y^2 = x^3 + ax + b over F_q."""
    # Count points
    p = q  # assume q is prime for simplicity
    count = 1  # point at infinity
    for x in range(q):
        rhs = (pow(x, 3, q) + a*x + b) % q
        if rhs == 0:
            count += 1
        elif pow(rhs, (q-1)//2, q) == 1:
            count += 2
    trace = q + 1 - count
    is_supersingular = (trace % p == 0)
    return count, trace, is_supersingular

# Over F_11
for a, b in [(1, 0), (0, 1), (1, 1), (-1, 0)]:
    try:
        count, t, ss = classify_ec(11, a, b)
        print(f"y^2 = x^3 + {a}x + {b}: |E| = {count}, t = {t}, {'supersingular' if ss else 'ordinary'}")
    except:
        pass

# Newton polygon visualization
def newton_polygon_ordinary(g):
    """Points of Newton polygon for ordinary AV of dimension g."""
    return [(0, 0), (g, 0), (2*g, g)]

def newton_polygon_supersingular(g):
    """Points of Newton polygon for supersingular AV of dimension g."""
    return [(0, 0), (2*g, g)]

# Check supersingular condition via Frobenius polynomial
def is_supersingular_from_poly(poly_coeffs, p):
    """Check if Frobenius polynomial corresponds to supersingular AV.
    Supersingular: all slopes of Newton polygon = 1/2
    For an EC: supersingular iff p | trace (= -coeffs[1])"""
    degree = len(poly_coeffs) - 1
    g = degree // 2
    # Simple check for g=1: look at trace coefficient
    if g == 1:
        # poly = T^2 - t*T + q, trace = poly_coeffs[1] with sign
        # For T^2 - tT + q: coeffs = [1, -t, q]
        t = -poly_coeffs[1]
        return t % p == 0
    else:
        # For higher genus: use p-adic Newton polygon (more complex)
        return None  # Simplified

# Supersingular j-invariants count formula
def count_supersingular_j(p):
    """Approximate count of supersingular j-invariants over F_p^bar."""
    if p < 5:
        return 1 if p == 2 else 1  # special cases
    base = (p - 1) // 12
    p_mod_12 = p % 12
    corrections = {1: 0, 5: 1, 7: 1, 11: 2}
    return base + corrections.get(p_mod_12, 0)

for p in [5, 7, 11, 13, 17, 19, 23]:
    print(f"p = {p}: {count_supersingular_j(p)} supersingular j-invariants")
```

---

## Summary / Key Takeaways

- **p-rank** $f(A) \in \{0, \ldots, g\}$: số lượng $\mathbb{Z}/p$-summands trong $A[p](\overline{k})$.
- **Ordinary**: $f(A) = g$ (p-rank tối đa). **Supersingular**: $f(A) = 0$ (không có $p$-torsion).
- **Newton polygon**: đa giác mã hóa đầy đủ $p$-divisible group, slopes $\in [0,1] \cap \mathbb{Q}$.
- **Ordinary** $\leftrightarrow$ slopes $\{0^g, 1^g\}$ (Newton polygon "hình L").
- **Supersingular** $\leftrightarrow$ slopes $\{(1/2)^{2g}\}$ (Newton polygon "đường thẳng").
- Elliptic curve: supersingular $\iff$ $p \mid t$ (trace của Frobenius) $\iff$ $|E(\mathbb{F}_p)| = p+1$.
- Supersingular AV trên $\overline{\mathbb{F}}_p$: $A \sim E^g$ (với $E$ supersingular EC) — isogeny class duy nhất!
- **Endomorphism algebra** của supersingular EC: quaternion algebra (dimension $4$ over $\mathbb{Q}$) — lớn hơn ordinary ($2$).
- **Mật độ**: "hầu hết" AV ordinary; số supersingular hữu hạn và không phụ thuộc vào $q$.
- **Manin's Theorem** (chứng minh bởi Honda): mọi Newton polygon đối xứng đều xảy ra.
- **Isogeny-based crypto**: supersingular curves dùng trong SQISign vì isogeny graph có tính Ramanujan graph.

---

## References

- Oort, F. "A short guide to $p$-torsion of abelian varieties in characteristic $p$." math.colostate.edu/~pries/Preprints/00DecPreprints/08groupschemeconm1007.pdf
- Karemaker, V. "Geometry and Arithmetic of Moduli Spaces of Abelian Varieties." §2 (Newton Polygons, Dieudonné modules). swc-math.github.io/aws/2024/2024KaremakerNotes.pdf
- Dembélé, L. "Abelian Varieties over Finite Fields." Problem Set 5 (Newton polygons). swc-math.github.io/aws/2024/PAWSDembele/2023PAWSDembeleProblems5.pdf
- Moonen, B. "Isogenies." Chapter V. math.ru.nl/~bmoonen/BookAV/Isogs.pdf
- Wikipedia, "Supersingular variety." en.wikipedia.org/wiki/Supersingular_variety
- Pries, R. "p-torsion of curves in characteristic $p$." math.upenn.edu/~hartmann/galois/pries.pdf
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, Chapter V (Supersingular curves).
- Oort, F. "Abelian Varieties over Finite Fields." §15–§16 (Ordinary and supersingular). math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Mumford, D. *Abelian Varieties*, §15.
