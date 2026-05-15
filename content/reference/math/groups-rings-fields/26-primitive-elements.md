---
title: "26. Primitive Elements"
type: math-component
tags: [math, groups-rings-fields, field-theory, finite-fields, lesson-26]
aliases: [Primitive Elements, Primitive Polynomials, Cyclic Multiplicative Group]
created: 2026-05-15
---

> **Prerequisites**: [[25-structure-of-finite-fields|25. Structure of Finite Fields]], [[13-direct-products-and-ftfag|13. Direct Products and the Fundamental Theorem of Finite Abelian Groups]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_{p^n}$ | Trường hữu hạn $p^n$ phần tử |
> | $\mathbb{F}_{p^n}^*$ | Nhóm nhân của $\mathbb{F}_{p^n}$: $\mathbb{F}_{p^n} \setminus \{0\}$ |
> | $\phi(n)$ | Hàm Euler: số số nguyên $1 \leq k \leq n$ với $\gcd(k, n) = 1$ |
> | $\operatorname{ord}(\alpha)$ | Bậc của phần tử $\alpha$ trong nhóm nhân |
> | $\mathbb{F}_p[x]$ | Vành đa thức một biến trên $\mathbb{F}_p$ |
> | $\langle f(x) \rangle$ | Ideal chính sinh bởi $f(x)$ trong $\mathbb{F}_p[x]$ |
> | $\gcd(a, b)$ | Ước chung lớn nhất của $a$ và $b$ |

> **Objectives**:
> - Chứng minh nhóm nhân $\mathbb{F}_{p^n}^*$ là nhóm cyclic
> - Định nghĩa phần tử nguyên thủy (primitive element) và đa thức nguyên thủy (primitive polynomial)
> - Đếm số phần tử nguyên thủy và số đa thức nguyên thủy
> - Xây dựng tường minh $\mathbb{F}_{p^n} \cong \mathbb{F}_p[x]/\langle f(x) \rangle$ với $f$ nguyên thủy
> - Kiểm tra tính nguyên thủy của một đa thức

---

## Motivation

Khi làm việc thực tế với $\mathbb{F}_{p^n}$ (ví dụ AES dùng $\mathbb{F}_{2^8}$, hay mã Reed-Solomon), ta cần biểu diễn các phần tử một cách tường minh. Biểu diễn tốt nhất là dùng một phần tử đặc biệt $\alpha$ — **phần tử nguyên thủy** (primitive element) — mà mọi phần tử khác $0$ của $\mathbb{F}_{p^n}$ đều là lũy thừa của $\alpha$. Điều này cho phép:
- Mọi phần tử khác $0$ biểu diễn là $\alpha^k$ với $0 \leq k < p^n - 1$.
- **Nhân** trở thành cộng lũy thừa: $\alpha^a \cdot \alpha^b = \alpha^{a+b \pmod{p^n-1}}$.
- **Nghịch đảo**: $(\alpha^a)^{-1} = \alpha^{p^n - 1 - a}$.

Bài học này chứng minh phần tử nguyên thủy luôn tồn tại (nhóm nhân $\mathbb{F}_{p^n}^*$ là cyclic) và hướng dẫn cách tìm nó.

---

## 1. Nhóm nhân $\mathbb{F}_{p^n}^*$ là cyclic

> [!abstract] Theorem 26.1 — Nhóm nhân của trường hữu hạn là cyclic (Primitive Root Theorem)
> Nhóm nhân $\mathbb{F}_{p^n}^* = (\mathbb{F}_{p^n} \setminus \{0\}, \cdot)$ là nhóm cyclic cấp $p^n - 1$.
>
> Nói cách khác, tồn tại $\alpha \in \mathbb{F}_{p^n}$ sao cho mọi phần tử khác $0$ đều là lũy thừa của $\alpha$:
>
> $$
> \mathbb{F}_{p^n}^* = \{1, \alpha, \alpha^2, \ldots, \alpha^{p^n - 2}\}
> $$

**Proof.** Ta chứng minh kết quả mạnh hơn (dùng cho nhóm Abel hữu hạn bất kỳ):

> **Bổ đề (Lemma):** Nhóm Abel hữu hạn $G$ là cyclic khi và chỉ khi với mọi $n \geq 1$, phương trình $x^n = e$ có nhiều nhất $n$ nghiệm trong $G$.

Áp dụng cho $G = \mathbb{F}_{p^n}^*$: với mọi $n \geq 1$, phương trình $x^n = 1$ là đa thức bậc $n$ trong trường $\mathbb{F}_{p^n}$, nên có nhiều nhất $n$ nghiệm. Điều kiện bổ đề thỏa, vậy $\mathbb{F}_{p^n}^*$ là cyclic.

**Chứng minh bổ đề** ($\Leftarrow$): Theo Định lý cơ bản về nhóm Abel hữu hạn (FTFAG):

$$
G \cong \mathbb{Z}/d_1\mathbb{Z} \times \mathbb{Z}/d_2\mathbb{Z} \times \cdots \times \mathbb{Z}/d_k\mathbb{Z}
$$

với $d_1 \mid d_2 \mid \cdots \mid d_k$. Gọi $m = d_k$ (số hạng tử lớn nhất). Mọi phần tử $g \in G$ thỏa $g^m = e$ (vì $g^{d_i} = e$ với mọi $i$ và $d_i \mid d_k = m$). Vậy phương trình $x^m = e$ có tất cả $|G|$ nghiệm. Theo giả thiết: $|G| \leq m$. Mặt khác $m = d_k \leq |G|$. Vậy $|G| = m = d_k$, nên $k = 1$ và $G \cong \mathbb{Z}/|G|\mathbb{Z}$ là cyclic. $\blacksquare$

---

## 2. Phần tử nguyên thủy

> [!definition] Definition 26.2 — Phần tử nguyên thủy (Primitive Element)
> Một phần tử $\alpha \in \mathbb{F}_{p^n}^*$ được gọi là **phần tử nguyên thủy** (primitive element) nếu $\alpha$ là phần tử sinh của nhóm cyclic $\mathbb{F}_{p^n}^*$, tức:
>
> $$
> \operatorname{ord}(\alpha) = p^n - 1
> $$
>
> Hay tương đương: $\mathbb{F}_{p^n}^* = \langle \alpha \rangle$.

> [!abstract] Theorem 26.3 — Số phần tử nguyên thủy
> Số phần tử nguyên thủy trong $\mathbb{F}_{p^n}$ là $\phi(p^n - 1)$, trong đó $\phi$ là hàm Euler.

**Proof.** Vì $\mathbb{F}_{p^n}^*$ cyclic cấp $m = p^n - 1$, số phần tử sinh của nó là $\phi(m)$ (số phần tử có bậc $m$ trong nhóm cyclic $\mathbb{Z}/m\mathbb{Z}$, bằng số số nguyên $1 \leq k \leq m$ với $\gcd(k, m) = 1$). $\blacksquare$

> [!example] Example 26.4 — Phần tử nguyên thủy của $\mathbb{F}_7$
> $\mathbb{F}_7^*$ là nhóm cyclic cấp $6$. Số phần tử nguyên thủy: $\phi(6) = \phi(2) \cdot \phi(3) = 1 \cdot 2 = 2$.
>
> Tìm: phần tử có bậc $6$. Thử $\alpha = 3$:
> - $3^1 = 3$, $3^2 = 2$, $3^3 = 6 \equiv -1$, $3^4 \equiv -3 \equiv 4$, $3^5 \equiv -9 \equiv 5$, $3^6 \equiv 15 \equiv 1$.
> - Bậc của $3$ là $6$! Vậy $3$ là phần tử nguyên thủy.
>
> Phần tử nguyên thủy thứ hai: $3^5 = 5$ (vì $\gcd(5, 6) = 1$). Kiểm tra: $5^2 \equiv 4$, $5^3 \equiv 6$, $5^6 \equiv 1$, $5^1, 5^2, 5^3 \neq 1$. ✓
>
> Vậy hai phần tử nguyên thủy của $\mathbb{F}_7$ là $3$ và $5$.

> [!example] Example 26.5 — Phần tử nguyên thủy của $\mathbb{F}_{2^3}$
> Xây dựng $\mathbb{F}_8 = \mathbb{F}_2[x]/(x^3 + x + 1)$, $\alpha = \bar{x}$.
>
> Tính lũy thừa của $\alpha$ (nhớ: $\alpha^3 = \alpha + 1$):
>
> | $k$ | $\alpha^k$ | Biểu diễn nhị phân $(a_2, a_1, a_0)$ |
> |-----|-----------|---------------------------------------|
> | 0 | $1$ | $(0,0,1)$ |
> | 1 | $\alpha$ | $(0,1,0)$ |
> | 2 | $\alpha^2$ | $(1,0,0)$ |
> | 3 | $\alpha + 1$ | $(0,1,1)$ |
> | 4 | $\alpha^2 + \alpha$ | $(1,1,0)$ |
> | 5 | $\alpha^2 + \alpha + 1$ | $(1,1,1)$ |
> | 6 | $\alpha^2 + 1$ | $(1,0,1)$ |
> | 7 | $1$ | $(0,0,1)$ |
>
> (Bảng này liệt kê tất cả $7$ phần tử khác $0$ của $\mathbb{F}_8$.)
>
> $\operatorname{ord}(\alpha) = 7 = 2^3 - 1$ → $\alpha$ **là phần tử nguyên thủy**!
>
> Số phần tử nguyên thủy: $\phi(7) = 6$ (vì $7$ nguyên tố, $\phi(7) = 6$).
> Đó là: $\alpha^k$ với $\gcd(k, 7) = 1$, tức $k \in \{1,2,3,4,5,6\}$ — tức tất cả phần tử $\neq 0, 1$ của $\mathbb{F}_8$.

---

## 3. Đa thức nguyên thủy (Primitive Polynomial)

> [!definition] Definition 26.6 — Đa thức nguyên thủy (Primitive Polynomial)
> Một đa thức lũy đẳng bất khả quy $f(x) \in \mathbb{F}_p[x]$ bậc $n$ được gọi là **đa thức nguyên thủy** (primitive polynomial) nếu bậc của $\bar{x}$ trong $\mathbb{F}_p[x]/\langle f(x) \rangle$ bằng $p^n - 1$, tức $\bar{x}$ là phần tử nguyên thủy của $\mathbb{F}_p[x]/\langle f(x) \rangle \cong \mathbb{F}_{p^n}$.
>
> Tương đương: $f(x)$ là đa thức tối tiểu của một phần tử nguyên thủy của $\mathbb{F}_{p^n}$.

> [!note] Remark 26.7 — Đa thức nguyên thủy và đa thức bất khả quy
> Mọi đa thức nguyên thủy đều bất khả quy, nhưng không phải mọi đa thức bất khả quy đều nguyên thủy.
>
> Ví dụ trên $\mathbb{F}_2$, bậc $4$:
> - Đa thức bất khả quy bậc 4: $x^4+x+1$, $x^4+x^3+1$, $x^4+x^3+x^2+x+1$.
> - Đa thức nguyên thủy (bậc của $\bar{x} = 15$): $x^4+x+1$, $x^4+x^3+1$ — nguyên thủy.
> - $x^4+x^3+x^2+x+1$: bậc của $\bar{x}$ là $5$ (không phải $15$) — bất khả quy nhưng **không** nguyên thủy.

---

## 4. Tiêu chuẩn nguyên thủy

> [!abstract] Theorem 26.8 — Tiêu chuẩn đa thức nguyên thủy
> Đa thức lũy đẳng bất khả quy $f(x) \in \mathbb{F}_p[x]$ bậc $n$ là nguyên thủy khi và chỉ khi:
>
> 1. $f(x) \mid x^{p^n - 1} - 1$ trong $\mathbb{F}_p[x]$.
> 2. $f(x) \nmid x^d - 1$ với mọi ước thực sự $d \mid (p^n - 1)$, $d < p^n - 1$.
>
> Nói cách khác, $p^n - 1$ là số mũ (exponent) nhỏ nhất sao cho $x^{p^n-1} \equiv 1 \pmod{f(x)}$.

**Proof.** $f$ nguyên thủy $\Leftrightarrow$ $\bar{x}$ sinh $\mathbb{F}_{p^n}^*$ $\Leftrightarrow$ $\operatorname{ord}(\bar{x}) = p^n - 1$ $\Leftrightarrow$ $(p^n-1)$ là số dương nhỏ nhất sao cho $\bar{x}^{p^n-1} = 1$, tức $f(x) \mid x^{p^n-1}-1$ nhưng $f(x) \nmid x^d - 1$ với mọi $d < p^n - 1$, $d \mid (p^n-1)$. $\blacksquare$

> [!tip] Tip 26.9 — Cách kiểm tra một đa thức có nguyên thủy không
> Để kiểm tra $f(x) \in \mathbb{F}_p[x]$ bậc $n$ có phải đa thức nguyên thủy không:
>
> **Bước 1.** Kiểm tra $f$ bất khả quy (nếu không: dừng).
>
> **Bước 2.** Phân tích $p^n - 1 = q_1^{e_1} \cdots q_k^{e_k}$ thành thừa số nguyên tố.
>
> **Bước 3.** Với mỗi ước nguyên tố $q_i$: tính $\bar{x}^{(p^n-1)/q_i}$ trong $\mathbb{F}_p[x]/\langle f(x) \rangle$.
>
> **Bước 4.** $f$ là nguyên thủy $\Leftrightarrow$ $\bar{x}^{(p^n-1)/q_i} \neq 1$ với mọi $i = 1, \ldots, k$.
>
> (Lý do: nếu $\operatorname{ord}(\bar{x}) < p^n-1$ thì $\operatorname{ord}(\bar{x}) \mid (p^n-1)/q_i$ cho một $q_i$ nào đó.)

> [!example] Example 26.10 — Kiểm tra $f(x) = x^4 + x + 1$ trên $\mathbb{F}_2$
> **Bước 1.** $f(0) = 1 \neq 0$, $f(1) = 1+1+1 = 1 \neq 0$. Bậc 4, không nhân tử bậc 1. Kiểm tra bậc 2: chia $f$ cho $x^2+x+1$ (đa thức bất khả quy bậc 2 duy nhất trên $\mathbb{F}_2$). Ta có $x^4+x+1 = (x^2+x+1)^2 + x \pmod{2}$. Dư $x \neq 0$, vậy bất khả quy. ✓
>
> **Bước 2.** $p^n - 1 = 2^4 - 1 = 15 = 3 \cdot 5$. Hai thừa nguyên tố: $q_1 = 3$, $q_2 = 5$.
>
> **Bước 3.** Đặt $\alpha = \bar{x}$ trong $\mathbb{F}_2[x]/(x^4+x+1)$, quan hệ $\alpha^4 = \alpha + 1$.
>
> Tính $\alpha^{15/3} = \alpha^5$:
> $\alpha^5 = \alpha \cdot \alpha^4 = \alpha(\alpha+1) = \alpha^2 + \alpha \neq 1$. ✓
>
> Tính $\alpha^{15/5} = \alpha^3$:
> $\alpha^3 \neq 1$ (vì bậc của $\alpha$ là ước của $15$, và nếu $\alpha^3 = 1$ thì bậc $\leq 3 < 15$, mâu thuẫn). ✓
>
> **Bước 4.** Cả $\alpha^5 \neq 1$ và $\alpha^3 \neq 1$, vậy $\operatorname{ord}(\alpha) = 15$. Kết luận: $f(x) = x^4+x+1$ là đa thức nguyên thủy trên $\mathbb{F}_2$. ✓

---

## 5. Số lượng đa thức nguyên thủy

> [!abstract] Theorem 26.11 — Số đa thức nguyên thủy bậc $n$ trên $\mathbb{F}_p$
> Số đa thức nguyên thủy lũy đẳng bậc $n$ trên $\mathbb{F}_p$ là:
>
> $$
> \frac{\phi(p^n - 1)}{n}
> $$

**Proof.** Có $\phi(p^n - 1)$ phần tử nguyên thủy trong $\mathbb{F}_{p^n}^*$. Mỗi đa thức nguyên thủy bậc $n$ có đúng $n$ nghiệm trong $\overline{\mathbb{F}_p}$ (các liên hợp Galois), tất cả đều nguyên thủy. Và mỗi phần tử nguyên thủy có min poly là một đa thức nguyên thủy bậc $n$. Vì nhóm Galois hoán vị các nghiệm, mỗi đa thức nguyên thủy "đóng gói" đúng $n$ phần tử nguyên thủy. Suy ra số đa thức nguyên thủy là $\phi(p^n-1)/n$. $\blacksquare$

> [!example] Example 26.12 — Đếm đa thức nguyên thủy bậc 4 trên $\mathbb{F}_2$
> $p^n - 1 = 15$, $\phi(15) = \phi(3)\phi(5) = 2 \cdot 4 = 8$. Số đa thức: $8/4 = 2$.
>
> Hai đa thức nguyên thủy bậc 4 trên $\mathbb{F}_2$ là $x^4+x+1$ và $x^4+x^3+1$ (đây là hai đa thức nguyên thủy bậc 4 tiêu chuẩn trong lý thuyết mã hóa).

---

## 6. Xây dựng tường minh $\mathbb{F}_{p^n}$

> [!abstract] Theorem 26.13 — Cấu trúc tường minh của $\mathbb{F}_{p^n}$
> Cho $f(x) \in \mathbb{F}_p[x]$ là đa thức nguyên thủy bậc $n$. Khi đó:
>
> $$
> \mathbb{F}_{p^n} \cong \frac{\mathbb{F}_p[x]}{\langle f(x) \rangle}
> $$
>
> Với $\alpha = \bar{x}$ là phần tử nguyên thủy, mọi phần tử của $\mathbb{F}_{p^n}^*$ viết được dưới dạng:
>
> $$
> \alpha^k = a_{n-1}\alpha^{n-1} + \cdots + a_1\alpha + a_0, \quad a_i \in \mathbb{F}_p, \quad 0 \leq k \leq p^n - 2
> $$

> [!example] Example 26.14 — Xây dựng $\mathbb{F}_{2^8}$ cho AES
> AES (Advanced Encryption Standard) dùng $\mathbb{F}_{2^8} \cong \mathbb{F}_2[x]/\langle m(x) \rangle$ với đa thức **bất khả quy** (không nhất thiết nguyên thủy):
>
> $$
> m(x) = x^8 + x^4 + x^3 + x + 1
> $$
>
> Đa thức này bất khả quy (đủ để $\mathbb{F}_2[x]/\langle m(x)\rangle$ là trường) nhưng **không nguyên thủy**: bậc của $\bar{x}$ trong trường này là $51$, không phải $255$. Trong AES, phần tử nguyên thủy được chọn riêng (thường là $x+1$), và bảng log-antilog được xây dựng với phần tử đó.
>
> Quan hệ căn bản: $\alpha^8 = \alpha^4 + \alpha^3 + \alpha + 1$.
>
> Biểu diễn một byte $(b_7, \ldots, b_0)$ trong AES tương ứng với $b_7\alpha^7 + b_6\alpha^6 + \cdots + b_0 \in \mathbb{F}_{2^8}$.
>
> **Nhân trong AES** ($\times 2$, hay còn gọi là `xtime`):
>
> $$
> \alpha \cdot (b_7\alpha^7 + \cdots + b_0) = b_7\alpha^8 + b_6\alpha^7 + \cdots + b_0\alpha
> $$
>
> Nếu $b_7 = 0$: dịch trái 1 bit. Nếu $b_7 = 1$: dịch trái rồi XOR với $\texttt{0x1B} = 00011011_2$ (tương ứng $\alpha^4+\alpha^3+\alpha+1 = \alpha^8$ mod $m(\alpha)$).
>
> Đây là cơ sở của phép nhân GF trong AES!

---

## 7. Ứng dụng: Bảng log-antilog

> [!tip] Tip 26.15 — Tính toán hiệu quả với bảng log
> Trong $\mathbb{F}_{p^n}$ với phần tử nguyên thủy $\alpha$:
>
> - **Bảng log**: với mỗi $\beta \neq 0$, ghi $\log_\alpha \beta = k$ (tức $\beta = \alpha^k$).
> - **Bảng antilog (exp)**: $\operatorname{antilog}(k) = \alpha^k$.
>
> Nhân: $\beta \cdot \gamma = \alpha^{\log_\alpha \beta + \log_\alpha \gamma}$ — chuyển nhân thành cộng!
>
> Chia: $\beta / \gamma = \alpha^{\log_\alpha \beta - \log_\alpha \gamma}$.
>
> Nghịch đảo: $\beta^{-1} = \alpha^{p^n - 1 - \log_\alpha \beta}$.

---

## SageMath Cheatsheet — Bài 26

```sage
# Phần tử nguyên thủy và đa thức nguyên thủy

# Kiểm tra phần tử nguyên thủy trong F_7
F7 = GF(7)
for a in F7:
    if a != 0:
        print(f"{a}: order = {a.multiplicative_order()}")

# Tìm phần tử nguyên thủy trong F_16
F16 = GF(2^4, 'a')
a = F16.gen()
a.multiplicative_order()    # = 15 nếu a nguyên thủy

# Tìm tất cả phần tử nguyên thủy
primitive = [x for x in F16 if x != 0 and x.multiplicative_order() == 15]
len(primitive)  # = phi(15) = 8

# Kiểm tra đa thức có nguyên thủy không
R.<x> = GF(2)[]
f = x^4 + x + 1
f.is_primitive()    # True

# Tìm tất cả đa thức nguyên thủy bậc 4 trên F_2
[f for f in R.polynomials(of_degree=4) if f.is_monic() and f.is_primitive()]
# [x^4 + x + 1, x^4 + x^3 + 1]

# Số đa thức nguyên thủy
euler_phi(2^4 - 1) // 4   # = phi(15)/4 = 8/4 = 2

# Xây dựng F_{2^8} kiểu AES
R.<x> = GF(2)[]
aes_poly = x^8 + x^4 + x^3 + x + 1
aes_poly.is_irreducible()   # True (đủ để định nghĩa trường)
aes_poly.is_primitive()     # False (x không sinh toàn bộ nhóm nhân)
F256 = GF(2^8, name='a', modulus=aes_poly)
a = F256.gen()
a.multiplicative_order()    # = 51 (không phải 255)

# === Demo bảng log VỚI phần tử nguyên thủy (dùng GF(2^4)) ===
F16 = GF(2^4, 'a')          # a là primitive element (mặc định Sage chọn đa thức nguyên thủy)
g = F16.gen()
g.multiplicative_order()    # = 15 = 2^4 - 1

# Bảng log (discrete log) với primitive element g
(g^5).log(g)                # = 5

# Phép nhân = cộng log (modulo 15)
b, c = g^3, g^7
b * c == g^((3 + 7) % 15)   # True (vì g^15 = 1)

# Bảng log đầy đủ
log_table = {g^k: k for k in range(15)}
log_table[g^0]              # = 0

# xtime trong AES chỉ là nhân với x (không cần x là primitive)
def xtime(poly):
    return a * poly          # a = generator của F_{2^8} với AES modulus
```

---

## Summary — Bài 26

- $\mathbb{F}_{p^n}^*$ **là nhóm cyclic** cấp $p^n - 1$ — kết quả cơ bản nhất về trường hữu hạn.
- **Phần tử nguyên thủy**: $\alpha$ sinh toàn bộ $\mathbb{F}_{p^n}^*$, tức $\operatorname{ord}(\alpha) = p^n - 1$.
- Có $\phi(p^n - 1)$ phần tử nguyên thủy trong $\mathbb{F}_{p^n}$.
- **Đa thức nguyên thủy**: bất khả quy, min poly của phần tử nguyên thủy.
- Có $\phi(p^n-1)/n$ đa thức nguyên thủy bậc $n$ trên $\mathbb{F}_p$.
- Mọi đa thức nguyên thủy xác định biểu diễn cụ thể: $\mathbb{F}_{p^n} \cong \mathbb{F}_p[x]/\langle f(x) \rangle$.
- **Ứng dụng**: AES dùng $\mathbb{F}_{2^8}$ với đa thức bất khả quy $x^8+x^4+x^3+x+1$ (không nguyên thủy — nhưng đủ để định nghĩa trường); bảng log-antilog giúp tính toán nhanh trong $\mathbb{F}_{p^n}$ khi dùng phần tử nguyên thủy.

---

## References — Bài 26

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §13.5.
- Lidl, R., & Niederreiter, H. *Finite Fields* (2nd ed.), Chapter 2–3.
- Daemen, J., & Rijmen, V. *The Design of Rijndael: AES* — cơ sở toán học của AES.
- McEliece, R. J. *Finite Fields for Computer Scientists and Engineers*, Chapter 5.
- https://doc.sagemath.org/html/en/reference/finite_rings/sage/rings/finite_rings/finite_field_base.html
