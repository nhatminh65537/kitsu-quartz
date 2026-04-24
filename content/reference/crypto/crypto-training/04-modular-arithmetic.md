---
title: "04. Modular Arithmetic"
type: math-component
tags: [crypto, math, modular-arithmetic, number-theory]
aliases: [L01, Modular Arithmetic, Số học modular]
created: 2026-04-16
---

> **Prerequisites**: Số nguyên, phép chia có dư (phổ thông).  
> **Lesson type**: Mathematical Component  
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$ |
> | $\mathbb{Z}/n\mathbb{Z}$ | Vành số nguyên modulo $n$: $\{0, 1, \ldots, n-1\}$ |
> | $a \mid b$ | $a$ chia hết $b$ ($a$ divides $b$) |
> | $\lfloor x \rfloor$ | Phần nguyên của $x$ (floor function) |

---

## 1. Tại sao số học modular là nền tảng của mật mã?

Hầu hết các primitive mật mã — RSA, Diffie-Hellman, ECDSA, ElGamal — đều sống trong thế giới của **phép tính theo modulo**. Không hiểu số học modular đồng nghĩa với không thể hiểu tại sao RSA hoạt động, tại sao `e=65537` được chọn, hay tại sao một số attacks "work" và những attacks khác thì không.

---

## 2. Modular Arithmetic — Số học theo vòng

### 2.1. Phép chia có dư

Với hai số nguyên $a$ và $n > 0$, luôn tồn tại duy nhất $q, r$ sao cho:

$$
a = q \cdot n + r, \quad 0 \le r < n
$$

Ta gọi $r$ là **phần dư** (remainder) của $a$ chia cho $n$, ký hiệu $r = a \bmod n$.

Ví dụ: $17 \bmod 5 = 2$ vì $17 = 3 \times 5 + 2$.

### 2.2. Quan hệ đồng dư

Ta nói $a \equiv b \pmod{n}$ (đọc: "$a$ đồng dư với $b$ theo modulo $n$") khi $n \mid (a - b)$, tức là $a$ và $b$ cho cùng phần dư khi chia cho $n$.

> [!note] Tính chất của quan hệ đồng dư
> Quan hệ đồng dư $\pmod{n}$ là một **quan hệ tương đương** (equivalence relation):
>
> - **Reflexive**: $a \equiv a \pmod{n}$
> - **Symmetric**: nếu $a \equiv b$ thì $b \equiv a \pmod{n}$
> - **Transitive**: nếu $a \equiv b$ và $b \equiv c$ thì $a \equiv c \pmod{n}$
>
> Hơn nữa, nếu $a \equiv a' \pmod{n}$ và $b \equiv b' \pmod{n}$, thì:
>
> $$
> a + b \equiv a' + b' \pmod{n}
> $$
>
> $$
> a \cdot b \equiv a' \cdot b' \pmod{n}
> $$
>
> Tính chất này cho phép làm tính với số dư thay vì số gốc — cực kỳ quan trọng khi số có hàng trăm chữ số.

**Model trực quan:** Hãy nghĩ đến đồng hồ mod 12. Sau 12 giờ, kim giờ quay về vị trí cũ. $14 \equiv 2 \pmod{12}$. Tương tự, $\mathbb{Z}/7\mathbb{Z}$ là đồng hồ 7 số:

![[assets/img-01-modular-arithmetic.png]]
*Vòng $\mathbb{Z}/7\mathbb{Z} = \{0,1,2,3,4,5,6\}$ với phép cộng mod 7. Ví dụ: $5 + 4 = 9 \equiv 2 \pmod{7}$ — đếm quanh vòng.*

---

## 3. GCD và Thuật toán Euclid

### 3.1. Ước chung lớn nhất

$\gcd(a, b)$ là số nguyên dương lớn nhất chia hết cả $a$ và $b$.

**Thuật toán Euclid** tính $\gcd$ hiệu quả bằng phép chia lặp:

$$
\gcd(a, b) = \gcd(b,\; a \bmod b), \quad \gcd(a, 0) = a
$$

Ví dụ: $\gcd(48, 18)$:

$$
\gcd(48, 18) = \gcd(18, 12) = \gcd(12, 6) = \gcd(6, 0) = 6
$$

> [!note] Vành Euclid (Khái niệm trong đại số trừu tượng)  
> Một điều thú vị là tập hợp có tính chất vành Euclid thì luôn chạy được thuật toán trên. Tức không chỉ phải là số mới chạy được mà có thể là tập các đa thức 1 biến với hệ số thức, Gaussian integer đều chạy được. Do đó tồn tại và ta có thể tìm gcd của 2 đa thức trên R.

### 3.2. Extended Euclidean Algorithm (EEA)

EEA không chỉ tính $\gcd(a, b)$ mà còn tìm $x, y \in \mathbb{Z}$ sao cho:

$$
ax + by = \gcd(a, b)
$$

Đây gọi là **Bezout's identity**. EEA là công cụ thiết yếu để tính **modular inverse**.

> [!example] Ví dụ EEA: tính $\gcd(35, 15)$ và tìm hệ số Bezout
>
> Áp dụng Euclid ngược:
>
> $$
> 35 = 2 \times 15 + 5
> $$  
> $$
> 15 = 3 \times 5 + 0
> $$
>
> Vậy $\gcd(35, 15) = 5$. Back-substitute:
>
> $$
> 5 = 35 - 2 \times 15
> $$
>
> Tức là $35 \times 1 + 15 \times (-2) = 5$ → Bezout: $x = 1$, $y = -2$.

```python
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y

g, x, y = extended_gcd(35, 15)
print(f"gcd={g}, x={x}, y={y}")
```

---

## 4. Modular Inverse

> [!note] Định nghĩa: Modular Inverse
> Phần tử nghịch đảo (inverse) của $a$ trong $\mathbb{Z}/n\mathbb{Z}$ là $a^{-1}$ thỏa:
>
> $$
> a \cdot a^{-1} \equiv 1 \pmod{n}
> $$
>
> **Điều kiện tồn tại**: $a^{-1} \bmod n$ tồn tại **khi và chỉ khi** $\gcd(a, n) = 1$ (tức là $a$ và $n$ nguyên tố cùng nhau — coprime).

**Cách tính:** Từ EEA với $\gcd(a, n) = 1$, tìm $x$ sao cho $ax + ny = 1$. Suy ra $ax \equiv 1 \pmod{n}$, vậy $a^{-1} = x \bmod n$.

> [!example] Tính $7^{-1} \pmod{11}$
>
> EEA: $7x + 11y = 1$.
> $11 = 1 \times 7 + 4$ → $7 = 1 \times 4 + 3$ → $4 = 1 \times 3 + 1$ → back-sub:
>
> $$
> 1 = 4 - 3 = 4 - (7 - 4) = 2 \times 4 - 7 = 2(11 - 7) - 7 = 2 \times 11 - 3 \times 7
> $$
>
> Vậy $7 \times (-3) \equiv 1 \pmod{11}$, tức $7^{-1} \equiv -3 \equiv 8 \pmod{11}$.
>
> Kiểm tra: $7 \times 8 = 56 = 5 \times 11 + 1$ ✓

```python
pow(7, -1, 11)        # Python 3.8+ built-in — trả về 8
```

---

## 5. Modular Exponentiation

Trong mật mã, ta thường cần tính $a^b \bmod n$ với $b$ rất lớn (hàng trăm chữ số).

**Fast exponentiation (square-and-multiply):** Thay vì nhân $b$ lần, dùng:

$$
a^b = \begin{cases} 1 & \text{nếu } b = 0 \\ (a^{b/2})^2 & \text{nếu } b \text{ chẵn} \\ a \cdot a^{b-1} & \text{nếu } b \text{ lẻ} \end{cases}
$$

Độ phức tạp: $O(\log b)$ phép nhân thay vì $O(b)$.

```python
pow(a, b, n)    # Python built-in, tối ưu, O(log b) modular multiplications
```

> [!tip] Không bao giờ tính `a**b % n` trực tiếp
> Với $b$ lớn, `a**b` sẽ tạo ra số cực lớn trước khi mod, làm cạn RAM. Luôn dùng `pow(a, b, n)` — Python tự dùng fast modular exponentiation.

---

## 6. Euler's Totient Function và Fermat/Euler

### 6.1. Euler's Totient Function $\varphi(n)$

$$
\varphi(n) = \#\{a \in \{1, \ldots, n\} : \gcd(a, n) = 1\}
$$

Tức là: số lượng số trong $\{1, \ldots, n\}$ nguyên tố cùng nhau với $n$.

**Công thức quan trọng:**

$$
\varphi(p) = p - 1 \quad (p \text{ nguyên tố})
$$

$$
\varphi(pq) = (p-1)(q-1) \quad (p, q \text{ nguyên tố phân biệt})
$$

$$
\varphi(p^k) = p^{k-1}(p-1)
$$

### 6.2. Fermat's Little Theorem

> [!abstract] Định lý Fermat nhỏ
> Nếu $p$ là số nguyên tố và $\gcd(a, p) = 1$, thì:
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$

**Proof sketch.** Xét tập $S = \{a, 2a, 3a, \ldots, (p-1)a\} \bmod p$. Vì $\gcd(a,p)=1$, tất cả các phần tử của $S$ phân biệt và khác 0, tức $S = \{1, 2, \ldots, p-1\}$. Nhân tất cả phần tử của $S$: $(p-1)! \cdot a^{p-1} \equiv (p-1)! \pmod{p}$. Chia cả hai vế cho $(p-1)!$ (có nghịch đảo vì $p$ nguyên tố): $a^{p-1} \equiv 1 \pmod{p}$. $\blacksquare$

**Ứng dụng trong CTF:** Tính modular inverse khi $p$ nguyên tố — thay vì EEA, dùng: $a^{-1} \equiv a^{p-2} \pmod{p}$ (từ $a^{p-1} \equiv 1$).

### 6.3. Euler's Theorem

> [!abstract] Định lý Euler
> Nếu $\gcd(a, n) = 1$, thì:
>
> $$
> a^{\varphi(n)} \equiv 1 \pmod{n}
> $$

Fermat's Little Theorem là trường hợp đặc biệt khi $n = p$ nguyên tố (vì $\varphi(p) = p-1$).

**Ứng dụng trong RSA:** Chọn $e, d$ sao cho $ed \equiv 1 \pmod{\varphi(n)}$, tức $d = e^{-1} \bmod \varphi(n)$. Khi đó:

$$
(m^e)^d = m^{ed} = m^{1 + k\varphi(n)} = m \cdot (m^{\varphi(n)})^k \equiv m \pmod{n}
$$

Đây chính xác là cơ chế RSA decrypt. Ta sẽ quay lại điều này ở L12.

---

## 7. Chinese Remainder Theorem (CRT)

> [!abstract] Chinese Remainder Theorem
> Cho $m_1, m_2, \ldots, m_k$ đôi một nguyên tố cùng nhau (pairwise coprime), và các dư $r_1, r_2, \ldots, r_k$ bất kỳ. Hệ phương trình:
>
> $$
> x \equiv r_1 \pmod{m_1}, \quad x \equiv r_2 \pmod{m_2}, \quad \ldots, \quad x \equiv r_k \pmod{m_k}
> $$
>
> có nghiệm duy nhất modulo $M = m_1 \cdot m_2 \cdots m_k$.

**Trực quan:** Nếu biết "số người chia hàng 3 còn dư 2, chia hàng 5 còn dư 3, chia hàng 7 còn dư 2", thì biết chính xác số người modulo $3 \times 5 \times 7 = 105$.

**Công thức giải (cho hai phương trình):**

Cho $x \equiv r_1 \pmod{m_1}$ và $x \equiv r_2 \pmod{m_2}$ với $\gcd(m_1, m_2) = 1$:

$$
x = r_1 + m_1 \cdot \bigl[(r_2 - r_1) \cdot m_1^{-1} \bmod m_2\bigr] \pmod{m_1 m_2}
$$

> [!example] CRT: tìm $x$ sao cho $x \equiv 2 \pmod{3}$ và $x \equiv 3 \pmod{5}$
>
> $M = 15$. $m_1^{-1} \bmod m_2 = 3^{-1} \bmod 5 = 2$ (vì $3 \times 2 = 6 \equiv 1$).
>
> $$
> x = 2 + 3 \times [(3 - 2) \times 2 \bmod 5] = 2 + 3 \times 2 = 8 \pmod{15}
> $$
>
> Kiểm tra: $8 = 2 \times 3 + 2$ ✓; $8 = 1 \times 5 + 3$ ✓.

```python
from sympy.ntheory.modular import crt
M, x = crt([3, 5], [2, 3])
print(x % M)
```

**CTF relevance của CRT:**
- **Hastad Broadcast Attack** (RSA với $e = 3$): từ 3 ciphertext $c_i = m^3 \bmod n_i$ → CRT cho $c = m^3 \bmod (n_1 n_2 n_3)$ → integer cube root cho $m$.
- **Pohlig-Hellman** (DLP): giải DLP từng prime factor của group order, kết hợp bằng CRT.
- **CRT trong RSA decrypt** (optimization): tính $m \bmod p$ và $m \bmod q$ riêng, nhanh hơn 4×.

---

## 8. Quadratic Residues (Giới thiệu)

Một số $a$ là **quadratic residue** (QR) modulo $n$ nếu tồn tại $x$ sao cho $x^2 \equiv a \pmod{n}$.

**Legendre symbol** $\left(\frac{a}{p}\right)$:

$$
\left(\frac{a}{p}\right) = \begin{cases} 0 & \text{nếu } p \mid a \\ 1 & \text{nếu } a \text{ là QR mod } p \\ -1 & \text{nếu } a \text{ không là QR mod } p \end{cases}
$$

Có thể tính nhanh: $\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod{p}$ (Euler's criterion).

> [!info] Tại sao cần QR?
> QR sẽ xuất hiện trong: Tonelli-Shanks algorithm (tính căn bậc hai modular), Goldwasser-Micali encryption (PKE dựa trên QR assumption), và nhiều attacks liên quan đến LSB parity oracle trong RSA.

---

## 9. Summary và Kết nối với RSA

Tất cả những gì học hôm nay sẽ hội tụ ở RSA:

| Công cụ hôm nay | Vai trò trong RSA |
|---|---|
| Modular exponentiation $a^b \bmod n$ | Encrypt: $c = m^e \bmod n$; Decrypt: $m = c^d \bmod n$ |
| EEA và modular inverse | Keygen: $d = e^{-1} \bmod \varphi(n)$ |
| Euler's theorem $a^{\varphi(n)} \equiv 1$ | Chứng minh correctness: $(m^e)^d = m$ |
| $\varphi(pq) = (p-1)(q-1)$ | Tính $\varphi(n)$ để generate private key |
| CRT | RSA-CRT optimization; Hastad broadcast attack |
| Factoring $n = pq$ | Điều kiện an toàn; factoring attack |

---

## 10. Công cụ thực hành

```python
from math import gcd
from sympy import isprime, factorint, mod_inverse, euler_phi

gcd(48, 18)
isprime(104729)
factorint(360)

pow(7, -1, 11)           # modular inverse
pow(a, b, n)             # modular exponentiation
euler_phi(100)           # φ(100) = 40

from sympy.ntheory.modular import crt
M, x = crt([3, 5, 7], [2, 3, 2])
```

**Sagemath**

```sage
p = next_prime(2^127)
Zmod(100)(37).inverse()
euler_phi(100)
crt([2, 3], [3, 5])
factor(2^64 - 1)
```

---

## 11. Phân số liên tục (Continued Fractions)

Phân số liên tục là công cụ toán học quan trọng trong mật mã học, nền tảng của **Wiener's Attack** (L13) và có kết nối với lattice reduction (L22).

### 11.1. Định nghĩa

Một **continued fraction** (phân số liên tục) có dạng:

$$
[a_0;\, a_1, a_2, \ldots] = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{\ddots}}}
$$

trong đó $a_i \in \mathbb{Z}^+$ (với $a_0 \in \mathbb{Z}$) gọi là **partial quotients**.

**Liên hệ với thuật toán Euclidean:** CF expansion của $a/b$ chính xác là các quotient trong các bước chia của Euclid:

$$
\gcd(43, 19): \quad 43 = 2 \cdot 19 + 5, \quad 19 = 3 \cdot 5 + 4, \quad 5 = 1 \cdot 4 + 1, \quad 4 = 4 \cdot 1
$$

$$
\Rightarrow \frac{43}{19} = [2;\, 3, 1, 4]
$$

---

### 11.2. Convergents $p_k/q_k$

**Convergent** thứ $k$ là phân số hữu tỉ xấp xỉ $\alpha = [a_0; a_1, \ldots]$ tốt nhất với mẫu $\leq q_k$:

$$
\frac{p_k}{q_k} = [a_0;\, a_1, \ldots, a_k]
$$

Xây dựng đệ quy:

$$
p_{-1} = 1, \; p_0 = a_0, \; p_k = a_k \cdot p_{k-1} + p_{k-2}
$$
$$
q_{-1} = 0, \; q_0 = 1, \; q_k = a_k \cdot q_{k-1} + q_{k-2}
$$

**Ví dụ:** $e/n = 43/19 = [2; 3, 1, 4]$

| $k$ | $a_k$ | $p_k$ | $q_k$ | $p_k/q_k$ |
|-----|-------|-------|-------|-----------|
| 0 | 2 | 2 | 1 | 2/1 |
| 1 | 3 | 7 | 3 | 7/3 |
| 2 | 1 | 9 | 4 | 9/4 |
| 3 | 4 | 43 | 19 | 43/19 |

---

### 11.3. Định lý Legendre (Nền tảng của Wiener's Attack)

> [!abstract] Định lý Legendre
> Nếu $\alpha$ là số thực và $p/q$ là phân số với $q > 0$ sao cho:
>
> $$\left| \alpha - \frac{p}{q} \right| < \frac{1}{2q^2}$$
>
> thì $p/q$ **nhất định là một convergent** trong continued fraction expansion của $\alpha$.

**Hệ quả cho Wiener:** Trong RSA với $e \approx \varphi(n)$ và $d$ nhỏ, tỉ số $e/n$ xấp xỉ $k/d$ với độ chính xác đủ để kích hoạt điều kiện Legendre. Suy ra $k/d$ là một trong $O(\log n)$ convergents của $e/n$ — liệt kê và kiểm tra từng cái.

---

### 11.4. Stern–Brocot Tree

Cây nhị phân biểu diễn mọi phân số dương theo thứ tự. Mỗi node là **mediant** của hai node lân cận trên và dưới:

$$
\text{mediant}\left(\frac{a}{b}, \frac{c}{d}\right) = \frac{a+c}{b+d}
$$

```text
           1/1
          /   \
        1/2   2/1
       /   \ /   \
     1/3 2/3 3/2 3/1
```

Traversal theo Stern-Brocot tree tương đương với quá trình xây convergents — mỗi bước "đi trái" hay "đi phải" tương ứng với một partial quotient.

---

### 11.5. Code SageMath

```python
from sage.all import continued_fraction, Integer

def cf_convergents(e, n):
    """Sinh toàn bộ convergents của e/n."""
    cf = continued_fraction(Integer(e) / Integer(n))
    for conv in cf.convergents():
        k = int(conv.numerator())
        d = int(conv.denominator())
        yield k, d

# Ví dụ thực hành:
for k, d in cf_convergents(17993, 90581):
    print(f"k={k}, d={d}")
```

```python
def cf_expansion(num, den):
    """Tính CF expansion của num/den thủ công."""
    result = []
    while den:
        result.append(num // den)
        num, den = den, num % den
    return result

def convergents(cf):
    """Sinh convergents từ CF coefficients."""
    p_prev, p_curr = 1, cf[0]
    q_prev, q_curr = 0, 1
    yield p_curr, q_curr
    for a in cf[1:]:
        p_prev, p_curr = p_curr, a * p_curr + p_prev
        q_prev, q_curr = q_curr, a * q_curr + q_prev
        yield p_curr, q_curr
```

---

## 12. References

- Khan Academy — Modular Arithmetic (khanacademy.org/computing/computer-science/cryptography)
- Hoffstein, Pipher, Silverman — *An Introduction to Mathematical Cryptography*, Chapter 1
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Chapter 2 (toc.cryptobook.us)
- Hardy & Wright — *An Introduction to the Theory of Numbers*, Chapter 10 (Continued Fractions)
- CryptoHack — Mathematics category: https://cryptohack.org/challenges/maths/
