---
title: "16. RSA Attacks I"
type: attack
tags: [crypto, rsa, attack, wiener, hastad, small-exponent, common-modulus]
aliases: [RSA Attacks I, RSA Tấn công tham số yếu]
created: 2026-04-17
---

> **Prerequisites**: [[15-rsa-fundamentals|15 — RSA Fundamentals]] (keygen, correctness, IFP), [[04-modular-arithmetic|04 — Modular Arithmetic]] (CRT, extended GCD, continued fractions), [[05-toolbox|05 — Toolbox]]  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (kế thừa từ L12, thêm ký hiệu mới):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $(n_i, e_i, c_i)$ | Bộ public key và ciphertext thứ $i$ |
> | $\lfloor \cdot \rfloor$ | Phần nguyên (floor) |
> | $[a_0; a_1, a_2, \ldots]$ | Continued fraction expansion |
> | $p_k/q_k$ | Convergent thứ $k$ của continued fraction |
> | $\gcd(a, b)$ | Ước chung lớn nhất |
> | $\lambda(n)$ | Carmichael function của $n$ |

---

## 1. Motivation

Bài trước ta đã hiểu RSA hoạt động **đúng** như thế nào. Bài này hỏi: RSA bị **phá** khi nào?

RSA an toàn **chỉ khi** tất cả tham số được chọn đúng cách. Trong thực tế — đặc biệt là trong CTF — nhiều implementation mắc những sai lầm kinh điển: $e$ quá nhỏ, $d$ quá nhỏ, hay nhiều user dùng chung $n$. Mỗi lỗi này mở ra một attack riêng biệt, thường **không cần factor $n$**.

Triết lý quan trọng: **"Attack the parameters, not the algorithm."** RSA textbook toán học không sai — chỉ có cách dùng sai.

![[assets/img-03-rsa-attacks-map.png]]
*Bản đồ các attack trong rsa theo điều kiện và nguồn gốc toán học.*

---

## 2. Attack — Small Public Exponent: Direct Root

### 2.1. Điều kiện và Intuition

Kẻ tấn công có: $(n, e, c)$ với $e$ rất nhỏ (thường $e = 3$).

Recall: $c = m^e \bmod n$. Phép tính mod $n$ chỉ "kick in" khi $m^e \geq n$. Nếu $m$ đủ nhỏ để $m^e < n$, thì **modular reduction không có tác dụng** và $c = m^e$ trên **số nguyên thông thường**.

Trong trường hợp đó, lấy $e$-th root của $c$ như số nguyên là đủ để recover $m$.

> [!note] Attack — Small-e Direct Integer Root
> **Điều kiện**: $e$ nhỏ (thường $e = 3$) và $m^e < n$ (message đủ nhỏ, không wrap mod)  
> **Bước 1**: Kiểm tra $\lfloor c^{1/e} \rfloor^e = c$ (kiểm tra $c$ là perfect $e$-th power)  
> **Bước 2**: Nếu đúng, $m = \lfloor c^{1/e} \rfloor$

> [!warning] Điểm yếu
> Attack này **thất bại** khi message đủ lớn để $m^e \geq n$ (wrap qua modulus). Tuy nhiên, với $e = 3$ và message ngắn (ví dụ: flag dạng `CTF{...}` vài chục bytes) khi $n$ là 2048 bit, xác suất $m^3 < n$ khá cao.

**Mitigations**: Dùng $e \geq 65537$; luôn dùng OAEP padding (randomized → message hiệu quả lớn hơn).

```python
from gmpy2 import iroot

def small_e_attack(c, e):
    m, is_perfect = iroot(c, e)
    if is_perfect:
        return int(m)
    return None
```

---

## 3. Attack — Håstad's Broadcast Attack

### 3.1. Điều kiện và Intuition

Kẻ tấn công có: cùng message $m$ được encrypt với $e$ keypairs khác nhau $(n_1, e), (n_2, e), \ldots, (n_e, e)$, thu được $e$ ciphertexts $c_1, c_2, \ldots, c_e$.

Vì $c_i = m^e \bmod n_i$, đây là một hệ **đồng dư tuyến tính** (hệ CRT):

$$
\begin{cases}
x \equiv c_1 \pmod{n_1} \\
x \equiv c_2 \pmod{n_2} \\
\vdots \\
x \equiv c_e \pmod{n_e}
\end{cases}
\quad \text{trong đó } x = m^e
$$

Bằng **Chinese Remainder Theorem**, giải hệ này cho:

$$
m^e \equiv C \pmod{N_1 N_2 \cdots N_e}
$$

Vì $m < n_i$ với mọi $i$, suy ra $m^e < n_1 \cdot n_2 \cdots n_e$ (modular reduction không kick in) → **$m^e$ trên số nguyên** → lấy $e$-th root.

> [!note] Attack — Håstad Broadcast Attack (1985)
> **Điều kiện**: Cùng $m$ (không padding) encrypt với $e$ keypairs độc lập $(n_i, e)$; $\gcd(n_i, n_j) = 1$ với $i \neq j$
>
> **Bước 1**: Thu thập $e$ ciphertexts $\{(c_i, n_i)\}_{i=1}^e$  
> **Bước 2**: Giải CRT: $C = \text{CRT}([c_1, \ldots, c_e], [n_1, \ldots, n_e])$ → thu được $C \equiv m^e$ trên $\mathbb{Z}$  
> **Bước 3**: Lấy integer $e$-th root: $m = \lfloor C^{1/e} \rfloor$
>
> **Complexity**: $O(e^2 \log^2 N)$ với $N = \prod n_i$ — polynomial time

> [!info] Håstad với Linear Padding
> Nếu $m_i = a_i \cdot m + b_i$ (linear padding khác nhau mỗi receiver), attack vẫn hoạt động qua **Coppersmith's method**: xây polynomial $g(x) = \sum T_i \cdot (a_i x + b_i)^e - c_i$ rồi tìm small root $x = m$. Điều này cho thấy **linear padding không bảo vệ** chống Håstad với $e$ đủ nhỏ.

```python
from sympy.ntheory.modular import crt
from gmpy2 import iroot

def hastad_broadcast(ciphertexts, moduli, e):
    C, _ = crt(moduli, ciphertexts)
    m, is_perfect = iroot(C, e)
    if is_perfect:
        return int(m)
    return None

e = 3
ns = [n1, n2, n3]
cs = [c1, c2, c3]
m = hastad_broadcast(cs, ns, e)
```

---

## 4. Attack — Common Modulus Attack

### 4.1. Điều kiện và Intuition

Tình huống: Một tổ chức cấp phát RSA keypairs nhưng **tái sử dụng cùng $n$** cho nhiều user, chỉ đổi $e$. Cùng message $m$ được encrypt hai lần với cùng $n$ nhưng khác $e_1, e_2$:

$$
c_1 = m^{e_1} \bmod n, \quad c_2 = m^{e_2} \bmod n
$$

Nếu $\gcd(e_1, e_2) = 1$, **Extended Euclidean Algorithm** cho $a, b$ sao cho:

$$
a \cdot e_1 + b \cdot e_2 = 1
$$

Khi đó:
$$
c_1^a \cdot c_2^b \equiv m^{a e_1} \cdot m^{b e_2} = m^{a e_1 + b e_2} = m^1 = m \pmod{n}
$$

> [!note] Attack — Common Modulus Attack (Simmons, 1983)
> **Điều kiện**: Cùng $n$, hai exponents $e_1, e_2$ với $\gcd(e_1, e_2) = 1$; cùng plaintext $m$
>
> **Bước 1**: Tính $a, b$ từ Extended GCD: $a \cdot e_1 + b \cdot e_2 = 1$  
> **Lưu ý**: Một trong $a, b$ thường âm. Khi $a < 0$: $c_1^a \bmod n = (c_1^{-1})^{|a|} \bmod n$  
> **Bước 2**: Tính $m = c_1^a \cdot c_2^b \bmod n$
>
> **Complexity**: $O(\log^2 n)$ — trivial

> [!warning] Hệ quả
> Bài học thiết kế: **Mỗi entity phải có modulus $n$ riêng**. Tái sử dụng $n$ là lỗi nghiêm trọng vì:
> - Common Modulus Attack recover plaintext (không cần factor $n$)
> - Nếu một user biết $d_1$, họ có thể factor $n$ → biết $d_2$ của user khác

```python
def common_modulus_attack(n, e1, e2, c1, c2):
    from math import gcd
    assert gcd(e1, e2) == 1

    g, a, b = extended_gcd(e1, e2)

    if a < 0:
        c1 = pow(c1, -1, n)
        a = -a
    if b < 0:
        c2 = pow(c2, -1, n)
        b = -b

    return pow(c1, a, n) * pow(c2, b, n) % n

def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y
```

---

## 5. Attack — Wiener's Attack (Small Private Exponent)

### 5.1. Bối cảnh

Một số implementation RSA cố tình chọn $d$ **nhỏ** để tăng tốc decryption (ít vòng square-and-multiply hơn). Đây là một sai lầm nghiêm trọng. Michael Wiener năm 1990 chứng minh rằng khi $d < n^{0.25}/3$, private key **có thể recover hoàn toàn** chỉ từ public key $(n, e)$.

### 5.2. Toán học nền tảng

**Điểm xuất phát:** Vì $ed \equiv 1 \pmod{\varphi(n)}$, tồn tại $k$ nguyên sao cho:

$$
ed - k\varphi(n) = 1
$$

Chia cả hai vế cho $d \cdot n$:

$$
\frac{e}{n} - \frac{k}{d} = \frac{1}{dn} - k \cdot \frac{\varphi(n)}{dn}
$$

Với $n = pq$ và $p, q$ xấp xỉ nhau, $\varphi(n) = (p-1)(q-1) \approx n$ (sai lệch chỉ khoảng $p + q \approx 2\sqrt{n}$). Khi $d$ nhỏ, vế phải tiến về 0, nghĩa là:

$$
\left|\frac{e}{n} - \frac{k}{d}\right| = \frac{1}{dn} + \frac{k(\varphi(n) - n)}{dn} \approx \frac{k(p+q)}{dn} < \frac{1}{2d^2}
$$

Đây chính xác là điều kiện của **định lý Legendre về continued fractions**: nếu $|e/n - k/d| < 1/(2d^2)$ thì $k/d$ **chắc chắn là một convergent** trong continued fraction expansion của $e/n$.

> [!note] Chú thích về λ(n) vs φ(n)
> Paper gốc của Wiener (1990) sử dụng $\varphi(n) = (p-1)(q-1)$. Nếu implementation dùng $\lambda(n) = \operatorname{lcm}(p-1, q-1) \approx \varphi(n)/2$ thì $e \cdot d - 1 = k' \cdot \lambda(n)$, và lập luận tương tự vẫn đúng vì $\lambda(n) \approx \varphi(n) \approx n$ đều là approximation hợp lệ cho bước Legendre.

**Tại sao điều kiện $d < n^{0.25}/3$ đảm bảo điều này?** Phép tính chi tiết cho thấy khi $q < p < 2q$ và $d < n^{0.25}/3$, bất đẳng thức Legendre tự động thỏa mãn. (Xem Wiener 1990, Boneh 1999 để có proof đầy đủ.)

> [!note] Attack — Wiener's Attack (1990)
> **Điều kiện**: $q < p < 2q$ và $d < \frac{1}{3} n^{1/4}$
>
> **Input**: $(n, e)$ public key, $c$ ciphertext
>
> **Bước 1 — CF Expansion**: Tính $[a_0; a_1, a_2, \ldots] = \text{CF}(e/n)$  
> **Bước 2 — Liệt kê convergents**: Sinh toàn bộ $p_0/q_0, p_1/q_1, \ldots$ (số lượng $O(\log n)$ convergents)  
> **Bước 3 — Test từng convergent $p_i/q_i$** làm ứng viên $(k, d)$:
> - Kiểm tra $q_i > 0$ và $e \cdot q_i \equiv 1 \pmod{p_i}$ (tức là $e \cdot d \equiv 1 \bmod k$)
> - Tính $\phi = (e \cdot q_i - 1) / p_i$; phải là số nguyên
> - Giải phương trình bậc 2: $x^2 - (n - \phi + 1)x + n = 0$
> - Nếu có nghiệm nguyên dương $\{p, q\}$ với $p \cdot q = n$ → tìm được!  
>
> **Bước 4 — Recover và decrypt**: $d = q_i$, hoặc tính lại $d = e^{-1} \bmod \lambda(n)$ → $m = c^d \bmod n$
>
> **Complexity**: $O(\log n)$ convergents cần test, mỗi test $O(\log^2 n)$ → tổng $O(\log^3 n)$

![[assets/img-04-wiener-flow.png]]
*Luồng tấn công Wiener từ input đến decrypt, kèm ví dụ số nhỏ minh họa.*

### 5.3. Ví dụ số nhỏ

Giả sử $n = 90581$, $e = 17993$.

Tính $\text{CF}(17993/90581) = [0; 5, 29, 4, 1, 3, 2, 4, 3]$.

Các convergents: $0/1, 1/5, 29/146, 117/589, \ldots$

Thử $k=1, d=5$: $e \cdot d = 17993 \times 5 = 89965$. $89965 - 1 = 89964 = k \times \phi(n)$ với $k = 1$ → $\phi(n) = 89964$.  
Giải $x^2 - (90581 - 89964 + 1)x + 90581 = x^2 - 618x + 90581 = 0$  
→ discriminant $= 618^2 - 4 \times 90581 = 19600 = 140^2$  
→ $x = (618 \pm 140)/2 \in \{379, 239\}$. Kiểm tra: $379 \times 239 = 90581$ ✓   
→ tìm được $p = 379, q = 239, d = 5$.

### 5.4. Implementation đầy đủ

```python
from Crypto.Util.number import long_to_bytes

def wiener_attack(e, n):
    cf = continued_fraction_expansion(e, n)
    convergents = get_convergents(cf)

    for k, d in convergents:
        if k == 0:
            continue
        if (e * d - 1) % k != 0:
            continue
        phi = (e * d - 1) // k
        discriminant = (n - phi + 1) ** 2 - 4 * n
        if discriminant < 0:
            continue
        sqrt_disc = integer_sqrt(discriminant)
        if sqrt_disc * sqrt_disc != discriminant:
            continue
        p = (n - phi + 1 + sqrt_disc) // 2
        q = (n - phi + 1 - sqrt_disc) // 2
        if p * q == n:
            return d, p, q
    return None

def continued_fraction_expansion(num, den):
    result = []
    while den:
        result.append(num // den)
        num, den = den, num % den
    return result

def get_convergents(cf):
    convergents = []
    p_prev, p_curr = 1, cf[0]
    q_prev, q_curr = 0, 1
    convergents.append((p_curr, q_curr))
    for a in cf[1:]:
        p_prev, p_curr = p_curr, a * p_curr + p_prev
        q_prev, q_curr = q_curr, a * q_curr + q_prev
        convergents.append((p_curr, q_curr))
    return convergents

def integer_sqrt(n):
    if n < 0:
        return -1
    x = int(n ** 0.5)
    while x * x > n:
        x -= 1
    while (x + 1) * (x + 1) <= n:
        x += 1
    return x
```

```python
from sage.all import continued_fraction, Integer

def wiener_sage(e, n):
    cf = continued_fraction(Integer(e) / Integer(n))
    for k, d in cf.convergents():
        k, d = int(k), int(d)
        if k == 0 or d % 2 == 0:
            continue
        if (e * d - 1) % k != 0:
            continue
        phi = (e * d - 1) // k
        R = ZZ['x']
        x = R.gen()
        f = x**2 - (n - phi + 1)*x + n
        roots = f.roots()
        if len(roots) == 2:
            p, q = int(roots[0][0]), int(roots[1][0])
            if p * q == n:
                return d
    return None
```

---

## 6. Attack — Boneh-Durfee Attack (preview)

Wiener's attack giới hạn ở $d < n^{0.25}/3$. Năm 2000, Boneh và Durfee dùng **lattice reduction (Coppersmith method)** để mở rộng bound lên $d < n^{0.292}$.

> [!info] Boneh-Durfee Attack (2000)
> Ý tưởng: quan hệ $ed \equiv 1 \pmod{\lambda(n)}$ là một phương trình tuyến tính $e \cdot d - k \cdot \lambda(n) = 1$ với ẩn nhỏ $(k, d)$. Xây dựng lattice từ các phiên bản biến thể của phương trình này, áp dụng LLL để tìm vector ngắn → recover $(k, d)$.
>
> **Bound**: $d < n^{0.292}$ — best known bound cho đến nay.
>
> **Complexity**: Polynomial trong $\log n$, nhưng yêu cầu lattice dimension $\sim 7$ → thực tế nhanh.

---

## 7. Attack — Known-d → Factor n

> [!info] Hệ quả: Biết d là đủ để phá RSA hoàn toàn
> Nếu adversary recover được $d$ (qua Wiener, Boneh-Durfee, hay bất kỳ phương tiện nào khác), họ có thể **factor $n$ trong expected $O(\log n)$ steps** bằng randomized algorithm của Miller (1975):
>
> **Ý tưởng**: $e \cdot d - 1 = 2^s \cdot t$ (với $t$ lẻ). Chọn random $a$; tính $a^t, a^{2t}, a^{4t}, \ldots$ mod $n$. Với xác suất $\geq 1/2$, $\gcd(a^{2^j t} - 1, n)$ cho ra $p$ hoặc $q$.

```python
from math import gcd
from random import randrange

def factor_from_d(n, e, d):
    k = e * d - 1
    t = k
    while t % 2 == 0:
        t //= 2
    while True:
        a = randrange(2, n - 1)
        x = pow(a, t, n)
        if x == 1 or x == n - 1:
            continue
        r = t
        while r < k:
            y = pow(x, 2, n)
            if y == 1:
                p = gcd(x - 1, n)
                if 1 < p < n:
                    return p, n // p
            x = y
            r *= 2
```

---

## 8. Attack — Franklin-Reiter Related Message Attack

### 8.1. Bối cảnh

Kẻ tấn công có: cùng public key $(n, e)$, hai ciphertext $c_1 = m_1^e \bmod n$ và $c_2 = m_2^e \bmod n$, trong đó $m_2 = f(m_1)$ cho một đa thức **đã biết** $f$ (thường là linear: $f(x) = ax + b$).

Tình huống thực tế: server encrypt cùng secret $m$ dưới dạng hai format khác nhau — ví dụ $m_1 = \texttt{"user: "} \| m$ và $m_2 = \texttt{"admin: "} \| m$ — tức là $m_2 = m_1 + (\texttt{"admin: "} - \texttt{"user: "}) \cdot 2^{8|m|}$.

### 8.2. Toán học

Cả hai đa thức sau đều nhận $m_1$ làm root trong $\mathbb{Z}_n[x]$:

$$
g_1(x) = x^e - c_1, \qquad g_2(x) = f(x)^e - c_2
$$

Bằng thuật toán **Euclidean GCD trên đa thức** (Euclid's algorithm cho polynomial ring $\mathbb{Z}_n[x]$), tính:

$$
\gcd(g_1(x),\; g_2(x)) = x - m_1
$$

→ recover $m_1$ trực tiếp.

> [!note] Attack — Franklin-Reiter Related Message Attack (1996)
> **Điều kiện:** Cùng $(n, e)$ với $e$ nhỏ (thường $e = 3$); hai ciphertexts $c_1, c_2$ của $m_1, m_2 = f(m_1)$ với $f$ đã biết và là linear polynomial
>
> **Bước 1:** Xây $g_1(x) = x^e - c_1$ và $g_2(x) = f(x)^e - c_2$ trong $\mathbb{Z}_n[x]$  
> **Bước 2:** Tính $\gcd(g_1, g_2)$ bằng Euclidean algorithm cho đa thức  
> **Bước 3:** Nếu $\gcd = x - m_1$ (linear) → $m_1 = -\text{constant}$  
>
> **Complexity:** $O(e^2)$ ring operations — rất nhanh với $e = 3$

> [!warning] Tấn công linear padding
> Hệ thống thêm prefix/suffix vào message trước khi encrypt với $e=3$:
> - Receiver 1: $m_1 = \texttt{prefix}_1 \| \text{msg}$
> - Receiver 2: $m_2 = \texttt{prefix}_2 \| \text{msg}$
> → $m_2 = m_1 + (\texttt{prefix}_2 - \texttt{prefix}_1) \cdot 2^{8 \cdot |\text{msg}|}$ → linear relation → attack thành công.
>
> **Fix:** OAEP padding — random seed $r$ khiến mỗi encryption hoàn toàn độc lập; không thể predict polynomial $f$.

```python
from sage.all import *

def franklin_reiter(n, e, c1, c2, f_coeffs):
    """
    f_coeffs = [a, b] nghĩa là f(x) = a*x + b (linear).
    Returns m1 nếu tìm thấy.
    """
    R = PolynomialRing(Zmod(n), 'x')
    x = R.gen()
    a, b = f_coeffs
    
    g1 = x^e - c1
    g2 = (a*x + b)^e - c2
    
    result = gcd(g1, g2)
    
    if result.degree() == 1:
        m1 = -int(result[0]) * pow(int(result[1]), -1, n) % n
        return m1
    return None

# CTF usage example:
# e = 3, f(m) = m + delta (two messages differ by known delta)
# c1 = pow(m, 3, n), c2 = pow(m + delta, 3, n)
# m = franklin_reiter(n, 3, c1, c2, [1, delta])
```

---

## 9. Attack — Stereotyped Message Attack (Coppersmith)

### 9.1. Bối cảnh

Kẻ tấn công biết **phần lớn message** — chỉ một phần nhỏ là ẩn. Ví dụ: message có dạng:

```text
"The secret flag is: CTF{XXXXXXXX}"
```

trong đó `XXXXXXXX` là 8 bytes ẩn (64 bits). Phần còn lại (prefix) đã biết.

### 9.2. Coppersmith's Small Root Method

Đặt $m = m_0 + x$ trong đó $m_0$ là phần biết (đã pad thành integer) và $x$ là phần ẩn nhỏ. Ta có:

$$
c = m^e = (m_0 + x)^e \bmod n
$$

→ $x$ là **small root** của đa thức $f(x) = (m_0 + x)^e - c$ modulo $n$.

> [!note] Attack — Stereotyped Message / Coppersmith Small Root
> **Điều kiện:** $e$ nhỏ (thường $e=3$); message $m = m_0 + x$ với $m_0$ phần lớn đã biết; phần ẩn $|x| < n^{1/e}$
>
> Với RSA-2048 và $e=3$: $x$ phải $< n^{1/3} \approx 2^{682}$ bits  
>
> **Bước 1:** Xây $f(x) = (m_0 + x)^e - c \in \mathbb{Z}[x]$  
> **Bước 2:** Dùng **LLL lattice reduction** để tìm polynomial $h(x)$ với small coefficients sao cho $h(x) \equiv 0 \pmod{n}$  
> **Bước 3:** Giải $h(x) = 0$ trên $\mathbb{Z}$ → tìm được $x$  
>
> **Complexity:** Polynomial trong $\log n$, nhanh với SageMath

```python
from sage.all import *

def stereotyped_message_attack(n, e, c, m0, unknown_bits):
    """
    n, e, c: RSA parameters
    m0: known part of message (as integer, padded to correct position)
    unknown_bits: number of unknown bits
    """
    P = PolynomialRing(Zmod(n), 'x')
    x = P.gen()
    
    f = (m0 + x)^e - c
    f = f.monic()
    
    roots = f.small_roots(X=2^unknown_bits, beta=0.3)
    
    return [int(m0 + r) for r in roots]

# CTF example:
# Flag = b"CTF{" + unknown_8_bytes + b"}"
# m0 = int.from_bytes(b"CTF{" + b"\x00"*8 + b"}", 'big')  # known skeleton
# unknown_bits = 64
# possible_msgs = stereotyped_message_attack(n, 3, c, m0, 64)
```

> [!info] Điều kiện thực tế
> - Với $e=3$: unknown phải $< 682$ bits — rất nhiều CTF challenge dùng flag 50-100 chars là đủ điều kiện
> - Với $e=65537$: unknown phải $< n^{1/65537} \approx 2^{0.031}$ bits — gần như không dùng được
> - Coppersmith bound $n^{1/e}$ là ngưỡng **lý thuyết** — thực tế SageMath dùng LLL với beta parameter và đôi khi fail nếu border

---

## 10. Attack — GCD Pairwise Attack ("Ron was Wrong, Whit is Right")

### 10.1. Bối cảnh

Năm 2012, Lenstra, Hughes, Kleinjung et al. thu thập $\approx 16$ triệu RSA public keys từ TLS certificates, SSH host keys, và PGP keys. Họ tính **pairwise GCD** của toàn bộ tập:

$$
\gcd(n_i, n_j) \quad \text{cho mọi cặp } i \neq j
$$

**Kết quả gây sốc:**
- Khoảng $2/1000$ keys chia sẻ một prime factor với key khác
- Hơn $10\,000$ RSA keys bị factor hoàn toàn — tức là decrypt được mọi traffic của chúng

### 10.2. Nguyên nhân

Thiết bị sinh keys trong lúc **entropy pool chưa khởi tạo** (lúc boot đầu tiên): PRNG không có đủ entropy → nhiều thiết bị khác nhau sinh ra cùng số nguyên tố $p$ → các $n$ khác nhau nhưng chia sẻ $p$.

Môi trường đặc biệt nguy hiểm:
- **Virtual machines:** snapshot hoặc clone chia sẻ PRNG state → cùng prime
- **Embedded devices:** startup entropy = 0 (không có HDD, không có user input)
- **Cloud instances:** chạy trên cùng hypervisor với cùng seed

### 10.3. Attack

> [!note] Attack — GCD Pairwise Attack
> **Điều kiện:** Có nhiều RSA public moduli $n_1, n_2, \ldots, n_k$; một số pairs chia sẻ common prime
>
> **Bước 1:** Với mọi cặp $(n_i, n_j)$: tính $p = \gcd(n_i, n_j)$  
> **Bước 2:** Nếu $1 < p < n_i$: factor $n_i = p \cdot q_i$; recover $d_i = e^{-1} \bmod \lambda(n_i)$  
>
> **Complexity:** Naive $O(k^2 \log n)$; batch GCD algorithm của Bernstein → $O(k \log^2 k \log n)$

```python
from math import gcd

def pairwise_gcd_attack(moduli, e):
    """
    moduli: list of RSA moduli n_1, n_2, ...
    Returns dict {index: (p, q, d)} for factored keys
    """
    factored = {}
    for i in range(len(moduli)):
        for j in range(i+1, len(moduli)):
            p = gcd(moduli[i], moduli[j])
            if 1 < p < moduli[i]:
                q = moduli[i] // p
                lam = (p-1) * (q-1) // gcd(p-1, q-1)
                d = pow(e, -1, lam)
                factored[i] = (p, q, d)
            if 1 < p < moduli[j]:
                q = moduli[j] // p
                lam = (p-1) * (q-1) // gcd(p-1, q-1)
                d = pow(e, -1, lam)
                factored[j] = (p, q, d)
    return factored

# CTF workflow: khi nhận được nhiều (n_i, e, c_i) → thử pairwise GCD trước
```

> [!tip] CTF Pattern
> Khi challenge cho **nhiều ciphertext** từ nhiều keypairs khác nhau → tính pairwise GCD **trước tiên** trước khi thử bất kỳ attack nào khác. Đây là bước $O(\log n)$ rất nhanh và có thể factor ngay.

---

## 11. CTF Recognition Guide

**Bài này cover các attack phổ biến nhất trong CTF RSA.**

**Checklist khi nhận được RSA challenge:**

```text
1. e rất nhỏ (e=3, e=17)?
   → Thử Small-e direct root: iroot(c, e)
   → Nếu fail: có nhiều (n_i, c_i)? → Hastad broadcast

2. e lớn bất thường (gần bằng n hoặc lớn hơn n/4)?
   → d nhỏ → Wiener's attack

3. Nhiều keypairs, cùng n?
   → Common modulus attack

4. Nhiều keypairs, cùng m, cùng e nhỏ?
   → Hastad broadcast

5. Bước 1-4 fail → chuyển sang L14 (factoring attacks)
```

**Tool tự động:** RsaCtfTool thử tất cả các attack trên và nhiều hơn nữa:

```bash
python RsaCtfTool.py -n N -e E --uncipher C
python RsaCtfTool.py --publickey public.pem --uncipher C
```

---

## 12. Công cụ & Code tổng hợp

```python
from Crypto.Util.number import long_to_bytes, bytes_to_long
from gmpy2 import iroot, gcd

def small_e_attack(c, e):
    m, exact = iroot(c, e)
    if exact:
        return long_to_bytes(int(m))
    return None

def hastad_broadcast(cs, ns, e):
    from sympy.ntheory.modular import crt
    C, _ = crt(ns, cs)
    m, exact = iroot(C, e)
    if exact:
        return long_to_bytes(int(m))
    return None

def common_modulus(n, e1, e2, c1, c2):
    from math import gcd as mgcd
    from sympy import gcdex
    a, b, _ = gcdex(e1, e2)
    a, b = int(a), int(b)
    if a < 0:
        c1 = pow(c1, -1, n)
        a = -a
    if b < 0:
        c2 = pow(c2, -1, n)
        b = -b
    return pow(c1, a, n) * pow(c2, b, n) % n
```

```python
from sage.all import *

def wiener_sage(e, n, c):
    cf = continued_fraction(Integer(e) / Integer(n))
    for conv in cf.convergents():
        k = int(conv.numerator())
        d = int(conv.denominator())
        if k == 0:
            continue
        if (e * d - 1) % k != 0:
            continue
        phi = (e * d - 1) // k
        R = ZZ['x']
        x = R.gen()
        f = x**2 - Integer(n - phi + 1) * x + n
        roots = f.roots()
        if len(roots) == 2:
            p = int(roots[0][0])
            q = int(roots[1][0])
            if p * q == n and p > 0 and q > 0:
                m = pow(c, d, n)
                from Crypto.Util.number import long_to_bytes
                return long_to_bytes(m)
    return None
```

---

## 13. Tổng kết

| Attack | Điều kiện | Công cụ chính | Complexity |
|--------|-----------|---------------|------------|
| Small-e Direct Root | $e$ nhỏ, $m^e < n$ | `iroot(c, e)` | $O(1)$ |
| Håstad Broadcast | $e$ copies cùng $m$, $e$ nhỏ | CRT + `iroot` | $O(e^2 \log^2 N)$ |
| Common Modulus | Cùng $n$, $\gcd(e_1, e_2) = 1$ | Extended GCD | $O(\log^2 n)$ |
| Wiener's Attack | $d < n^{0.25}/3$ | Continued fractions | $O(\log^3 n)$ |
| Boneh-Durfee | $d < n^{0.292}$ | LLL lattice | Polynomial |

**Nguyên tắc phòng thủ:**
- Luôn dùng OAEP padding — loại bỏ Small-e và Hastad (với unpadded messages)
- Mỗi entity phải có $n$ riêng — loại bỏ Common Modulus
- $d$ phải $\geq n^{0.3}$ bit — loại bỏ Wiener và Boneh-Durfee
- $e = 65537$ là lựa chọn chuẩn — không dùng $e = 3$ hay $e = 17$

---

## 14. References

- Wiener, M.J. — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory, 1990
- Håstad, J. — *Solving Simultaneous Modular Equations of Low Degree*, SIAM J. Computing, 1988
- Boneh, D. & Durfee, G. — *Cryptanalysis of RSA with Private Key d less than N^0.292*, IEEE Trans. Inf. Theory, 2000
- Boneh, D. — *Twenty Years of Attacks on the RSA Cryptosystem*, Notices of the AMS, 1999 (excellent survey)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 11 (small-e attacks), Ch. 20 (toc.cryptobook.us)
- Galbraith — *Mathematics of Public Key Cryptography*, Ch. 24 (factoring & RSA attacks)
- CryptoHack — RSA track: https://cryptohack.org/challenges/rsa/
- CTF Wiki — RSA attacks: https://ctf-wiki.org/crypto/asymmetric/rsa/
