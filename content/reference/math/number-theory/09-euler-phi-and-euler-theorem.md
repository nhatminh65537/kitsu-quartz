---
title: "09. Hàm Euler φ và Định Lý Euler"
type: theory
tags: [math, number-theory, lesson-09]
aliases: [Euler Totient Function, Euler Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[05-congruences|05. Quan Hệ Đồng Dư]], [[07-chinese-remainder-theorem|07. Định Lý Thặng Dư Trung Hoa]], [[08-wilson-and-fermat|08. Định Lý Wilson và Fermat Nhỏ]]
> **Objectives**:
> - Định nghĩa và tính hàm Euler $\varphi(n)$ với mọi $n$
> - Chứng minh tính nhân tính của $\varphi$ qua CRT
> - Thiết lập công thức $\varphi(n) = n \prod_{p \mid n}\!\left(1 - \tfrac{1}{p}\right)$
> - Chứng minh đẳng thức $\sum_{d \mid n} \varphi(d) = n$
> - Chứng minh và áp dụng Định Lý Euler: $a^{\varphi(n)} \equiv 1 \pmod{n}$
> - Hiểu ứng dụng của Euler's Theorem trong RSA cryptography

---

## Motivation / Intuition

Định Lý Fermat Nhỏ ở bài 08 chỉ hoạt động với modulus là số nguyên tố: $a^{p-1} \equiv 1 \pmod{p}$. Câu hỏi tự nhiên: có mở rộng nào cho modulus tổng quát $n$ không?

Câu trả lời là **có**, và công cụ then chốt là **hàm Euler** $\varphi(n)$ — đếm xem trong $\{1, 2, \ldots, n\}$ có bao nhiêu số nguyên tố cùng nhau với $n$. Các số đó chính xác là tập $(\mathbb{Z}/n\mathbb{Z})^*$: những phần tử có nghịch đảo nhân tính.

Định Lý Euler ($a^{\varphi(n)} \equiv 1$) là phiên bản tổng quát hoàn toàn của Fermat Nhỏ, và $\varphi$ là "kích thước" của nhóm nhân $(\mathbb{Z}/n\mathbb{Z})^*$.

---

## Hàm Euler $\varphi$ (Euler's Totient Function)

> [!definition] Definition 9.1 — Hàm Euler (Euler's Totient Function)
> Với $n \geq 1$, **hàm Euler** $\varphi(n)$ là số nguyên dương $\leq n$ nguyên tố cùng nhau với $n$:
>
> $$
> \varphi(n) = \left|\left\{ k \in \mathbb{Z} \mid 1 \leq k \leq n,\ \gcd(k, n) = 1 \right\}\right|
> $$
>
> Quy ước: $\varphi(1) = 1$ (số duy nhất là $1$, và $\gcd(1,1)=1$).

Tập $\{k \in \mathbb{Z} \mid 1 \leq k \leq n,\ \gcd(k,n)=1\}$ còn gọi là **hệ thặng dư thu gọn** (reduced residue system) modulo $n$.

> [!example] Example 9.2 — Tính $\varphi$ cho vài giá trị nhỏ
>
> $\varphi(1) = 1$: $\{1\}$
>
> $\varphi(2) = 1$: $\{1\}$
>
> $\varphi(6) = 2$: $\{1, 5\}$ (vì $\gcd(2,6)=2$, $\gcd(3,6)=3$, $\gcd(4,6)=2$)
>
> $\varphi(12) = 4$: $\{1, 5, 7, 11\}$

---

## Công Thức Tính $\varphi(n)$

### Trường hợp số nguyên tố

> [!theorem] Theorem 9.3 — $\varphi$ của số nguyên tố
> Nếu $p$ là số nguyên tố thì:
>
> $$
> \varphi(p) = p - 1
> $$

**Proof.** Trong $\{1, 2, \ldots, p\}$, số duy nhất không nguyên tố cùng nhau với $p$ là chính $p$. Còn lại $p - 1$ số. $\blacksquare$

### Trường hợp lũy thừa số nguyên tố

> [!theorem] Theorem 9.4 — $\varphi$ của lũy thừa số nguyên tố
> Nếu $p$ là số nguyên tố và $k \geq 1$:
>
> $$
> \varphi(p^k) = p^k - p^{k-1} = p^{k-1}(p-1) = p^k\!\left(1 - \frac{1}{p}\right)
> $$

**Proof.** Trong $\{1, 2, \ldots, p^k\}$, một số $m$ **không** nguyên tố cùng nhau với $p^k$ khi và chỉ khi $p \mid m$. Các bội của $p$ trong phạm vi đó là $p, 2p, 3p, \ldots, p^{k-1} \cdot p = p^k$, tổng cộng $p^{k-1}$ số.

Vậy số phần tử nguyên tố cùng nhau với $p^k$ là:

$$
\varphi(p^k) = p^k - p^{k-1} \qquad \blacksquare
$$

> [!example] Example 9.5
>
> $\varphi(8) = \varphi(2^3) = 2^3 - 2^2 = 4$. Kiểm tra: $\{1, 3, 5, 7\}$ — bốn số lẻ trong $\{1,\ldots,8\}$.
>
> $\varphi(27) = \varphi(3^3) = 27 - 9 = 18$.

### Tính nhân tính (Multiplicativity)

> [!theorem] Theorem 9.6 — Tính Nhân Tính của $\varphi$
> Nếu $\gcd(m, n) = 1$ thì:
>
> $$
> \varphi(mn) = \varphi(m) \cdot \varphi(n)
> $$

**Proof.** Bởi CRT (Theorem 7.x), ánh xạ sau là một **đẳng cấu vành** (ring isomorphism):

$$
f: \mathbb{Z}/mn\mathbb{Z} \xrightarrow{\sim} \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}, \quad f([a]_{mn}) = ([a]_m, [a]_n)
$$

Ánh xạ này gửi các đơn vị sang đơn vị: $a$ nguyên tố cùng nhau với $mn$ khi và chỉ khi $a$ nguyên tố cùng nhau với cả $m$ và $n$ (vì $\gcd(a, mn) = 1 \iff \gcd(a,m) = 1$ và $\gcd(a,n) = 1$).

Do đó $f$ hạn chế thành một song ánh (bijection):

$$
(\mathbb{Z}/mn\mathbb{Z})^* \xrightarrow{\sim} (\mathbb{Z}/m\mathbb{Z})^* \times (\mathbb{Z}/n\mathbb{Z})^*
$$

Đếm hai vế:

$$
\varphi(mn) = \varphi(m) \cdot \varphi(n) \qquad \blacksquare
$$

> [!note] Remark 9.7 — Lưu ý điều kiện $\gcd(m,n) = 1$
> Tính nhân tính **thất bại** khi $\gcd(m,n) > 1$. Ví dụ: $\varphi(4) = 2$, $\varphi(2) = 1$, nhưng $\varphi(8) = 4 \neq 2 \cdot 1 = 2$.

### Công thức tổng quát (Product Formula)

> [!theorem] Theorem 9.8 — Công Thức Tích (Product Formula)
> Nếu $n = p_1^{a_1} p_2^{a_2} \cdots p_r^{a_r}$ là phân tích nguyên tố của $n$, thì:
>
> $$
> \varphi(n) = n \prod_{p \mid n} \left(1 - \frac{1}{p}\right) = \prod_{i=1}^{r} p_i^{a_i - 1}(p_i - 1)
> $$

**Proof.** Áp dụng Theorem 9.6 (tính nhân tính) lặp lại và Theorem 9.4:

$$
\varphi(n) = \varphi(p_1^{a_1}) \cdot \varphi(p_2^{a_2}) \cdots \varphi(p_r^{a_r})
= \prod_{i=1}^{r} p_i^{a_i - 1}(p_i - 1)
= n \prod_{i=1}^{r} \frac{p_i - 1}{p_i}
= n \prod_{p \mid n} \!\left(1 - \frac{1}{p}\right) \qquad \blacksquare
$$

> [!example] Example 9.9 — Tính $\varphi(360)$
>
> $360 = 2^3 \cdot 3^2 \cdot 5$.
>
> $$
> \varphi(360) = 360 \cdot \left(1 - \frac{1}{2}\right)\left(1 - \frac{1}{3}\right)\left(1 - \frac{1}{5}\right) = 360 \cdot \frac{1}{2} \cdot \frac{2}{3} \cdot \frac{4}{5} = 96
> $$

> [!example] Example 9.10 — Tìm $n$ với $\varphi(n) = 4$
>
> $\varphi(5) = 4$ (vì $5$ là số nguyên tố).
>
> $\varphi(8) = 4$ (vì $8 = 2^3$, $\varphi = 2^2 = 4$).
>
> $\varphi(10) = \varphi(2)\varphi(5) = 1 \cdot 4 = 4$.
>
> $\varphi(12) = \varphi(4)\varphi(3) = 2 \cdot 2 = 4$.
>
> Bốn giá trị $n = 5, 8, 10, 12$ đều cho $\varphi(n) = 4$ — đây là hệ quả của **Định lý Carmichael** về tính không đơn trị của $\varphi$.

---

## Tính Chất Quan Trọng của $\varphi$

### Đẳng thức tổng ước

> [!theorem] Theorem 9.11 — Tổng Ước (Divisor Sum Identity)
> Với mọi $n \geq 1$:
>
> $$
> \sum_{d \mid n} \varphi(d) = n
> $$

**Proof.** Xét tập $S = \{1, 2, \ldots, n\}$. Với mỗi $k \in S$, đặt $d = \gcd(k, n)$. Rõ ràng $d \mid n$.

Viết $k = d \cdot j$ với $\gcd(j, n/d) = 1$ và $1 \leq j \leq n/d$. Như vậy, ứng với mỗi ước $d$ của $n$, số phần tử $k \in S$ với $\gcd(k,n) = d$ đúng bằng $\varphi(n/d)$.

Phân hoạch $S$ theo giá trị của $\gcd(k, n)$:

$$
n = |S| = \sum_{d \mid n} \#\{k \in S : \gcd(k, n) = d\} = \sum_{d \mid n} \varphi\!\left(\frac{n}{d}\right) = \sum_{d \mid n} \varphi(d)
$$

(bước cuối đổi biến $d \to n/d$). $\blacksquare$

> [!example] Example 9.12 — Kiểm tra với $n = 12$
>
> Ước của $12$: $1, 2, 3, 4, 6, 12$.
>
> $\varphi(1) + \varphi(2) + \varphi(3) + \varphi(4) + \varphi(6) + \varphi(12) = 1 + 1 + 2 + 2 + 2 + 4 = 12$. ✓

### $\varphi(n)$ luôn chẵn với $n > 2$

> [!corollary] Corollary 9.13
> Với mọi $n > 2$, $\varphi(n)$ là số chẵn.

**Proof.** Nếu $\gcd(k, n) = 1$ thì $\gcd(n-k, n) = 1$ (vì $\gcd(n-k,n) = \gcd(k,n)$). Ánh xạ $k \mapsto n - k$ là một involution không điểm bất động trên hệ thặng dư thu gọn (không điểm bất động vì $n/2$ — nếu tồn tại — không nguyên tố cùng nhau với $n$ khi $n > 2$). Do đó các phần tử ghép đôi được thành cặp, suy ra $\varphi(n)$ chẵn. $\blacksquare$

---

## Định Lý Euler

> [!theorem] Theorem 9.14 — Định Lý Euler (Euler's Theorem)
> Nếu $\gcd(a, n) = 1$ thì:
>
> $$
> a^{\varphi(n)} \equiv 1 \pmod{n}
> $$

**Proof.** Gọi $\{r_1, r_2, \ldots, r_{\varphi(n)}\}$ là hệ thặng dư thu gọn modulo $n$ — tức là $\varphi(n)$ phần tử của $(\mathbb{Z}/n\mathbb{Z})^*$.

**Bước 1:** Nhân mỗi $r_i$ với $a$. Vì $\gcd(a, n) = 1$ và $\gcd(r_i, n) = 1$, ta có $\gcd(ar_i, n) = 1$, nên $\{ar_1, ar_2, \ldots, ar_{\varphi(n)}\}$ cũng là một hệ thặng dư thu gọn (theo thứ tự hoán vị).

**Bước 2:** Do cả hai tập biểu diễn cùng một hệ thặng dư thu gọn theo modulo $n$:

$$
\prod_{i=1}^{\varphi(n)} (ar_i) \equiv \prod_{i=1}^{\varphi(n)} r_i \pmod{n}
$$

$$
a^{\varphi(n)} \prod_{i=1}^{\varphi(n)} r_i \equiv \prod_{i=1}^{\varphi(n)} r_i \pmod{n}
$$

**Bước 3:** Vì $\gcd\!\left(\prod r_i,\, n\right) = 1$ (tích các số nguyên tố cùng nhau với $n$ vẫn nguyên tố cùng nhau với $n$), hủy $\prod r_i$:

$$
a^{\varphi(n)} \equiv 1 \pmod{n} \qquad \blacksquare
$$

> [!note] Remark 9.15 — Định Lý Fermat Nhỏ là trường hợp đặc biệt
> Khi $n = p$ nguyên tố: $\varphi(p) = p - 1$, nên Định Lý Euler cho $a^{p-1} \equiv 1 \pmod{p}$ — chính là Fermat Nhỏ. Euler là người tổng quát hóa kết quả của Fermat.

> [!example] Example 9.16 — Tính $7^{100} \pmod{24}$
>
> $24 = 2^3 \cdot 3$. $\varphi(24) = \varphi(8)\varphi(3) = 4 \cdot 2 = 8$.
>
> $\gcd(7, 24) = 1$, nên $7^8 \equiv 1 \pmod{24}$.
>
> $100 = 12 \cdot 8 + 4$, nên $7^{100} \equiv (7^8)^{12} \cdot 7^4 \equiv 1 \cdot 7^4 \pmod{24}$.
>
> $7^2 = 49 \equiv 1 \pmod{24}$, nên $7^4 = (7^2)^2 \equiv 1 \pmod{24}$.
>
> Vậy $7^{100} \equiv 1 \pmod{24}$.

> [!example] Example 9.17 — Tính $3^{1000} \pmod{100}$
>
> $100 = 2^2 \cdot 5^2$. $\varphi(100) = \varphi(4)\varphi(25) = 2 \cdot 20 = 40$.
>
> $\gcd(3, 100) = 1$, $1000 = 25 \cdot 40$, nên $3^{1000} = (3^{40})^{25} \equiv 1 \pmod{100}$.

### Hệ quả: Rút gọn số mũ

> [!corollary] Corollary 9.18 — Rút Gọn Số Mũ Tổng Quát
> Nếu $\gcd(a, n) = 1$, thì:
>
> $$
> a^k \equiv a^{k \bmod \varphi(n)} \pmod{n}
> $$
>
> Tức là số mũ $k$ có thể rút gọn modulo $\varphi(n)$.

**Proof.** Viết $k = q \cdot \varphi(n) + r$ với $r = k \bmod \varphi(n)$. Thì $a^k = (a^{\varphi(n)})^q \cdot a^r \equiv 1^q \cdot a^r = a^r \pmod{n}$. $\blacksquare$

> [!warning] Warning 9.19 — Cẩn thận khi $\gcd(a, n) > 1$
> Định Lý Euler **yêu cầu** $\gcd(a, n) = 1$. Khi điều kiện này không thỏa, định lý **không áp dụng được**. Ví dụ: $\gcd(2, 4) = 2$, và $2^{\varphi(4)} = 2^2 = 4 \equiv 0 \not\equiv 1 \pmod{4}$.

### Generalized Euler: khi $\gcd(a, n) > 1$

> [!theorem] Theorem 9.20 — Euler Tổng Quát Hóa (dành cho $\gcd(a,n)$ bất kỳ)
> Với mọi $a \in \mathbb{Z}$ và $n \geq 1$, nếu $k \geq \log_2 n$:
>
> $$
> a^k \equiv a^{\varphi(n) + (k \bmod \varphi(n))} \pmod{n}
> $$

Đây là kết quả tinh tế hơn, hữu ích trong lập trình thi đấu, không yêu cầu $\gcd(a,n) = 1$.

---

## Bảng Giá Trị $\varphi(n)$ và Cấu Trúc

| $n$ | Phân tích | $\varphi(n)$ | $(\mathbb{Z}/n\mathbb{Z})^*$ |
|-----|-----------|-------------|------------------------------|
| $1$ | $1$ | $1$ | $\{0\}$ |
| $2$ | $2$ | $1$ | $\{1\}$ |
| $4$ | $2^2$ | $2$ | $\{1, 3\}$ |
| $6$ | $2 \cdot 3$ | $2$ | $\{1, 5\}$ |
| $8$ | $2^3$ | $4$ | $\{1, 3, 5, 7\}$ |
| $12$ | $2^2 \cdot 3$ | $4$ | $\{1, 5, 7, 11\}$ |
| $p$ | số nguyên tố | $p-1$ | $\{1, 2, \ldots, p-1\}$ |
| $p^2$ | — | $p(p-1)$ | — |

---

## SageMath Cheatsheet

```python
# Tính phi(n)
n = 360
print(euler_phi(n))  # 96

# Kiểm tra công thức tích
n = 360
factored = factor(n)  # 2^3 * 3^2 * 5
result = n
for p, e in factored:
    result *= (1 - 1/p)
print(int(result))  # 96

# Hệ thặng dư thu gọn
n = 12
reduced = [k for k in range(1, n+1) if gcd(k, n) == 1]
print(reduced)  # [1, 5, 7, 11]
print(len(reduced))  # = phi(12) = 4

# Kiểm tra Định Lý Euler
a, n = 7, 24
phi_n = euler_phi(n)
print(pow(a, phi_n, n))  # 1

# Rút gọn số mũ
a, k, n = 3, 1000, 100
phi_n = euler_phi(n)
k_reduced = k % phi_n
print(pow(a, k, n), pow(a, k_reduced, n))  # phải bằng nhau: 1, 1

# Kiểm tra tổng ước: sum_{d|n} phi(d) = n
n = 60
total = sum(euler_phi(d) for d in divisors(n))
print(total)  # 60

# Bảng phi(n) từ 1 đến 30
for n in range(1, 31):
    print(f"phi({n}) = {euler_phi(n)}")

# Tìm tất cả n với phi(n) = k
k = 4
solutions = [n for n in range(1, 100) if euler_phi(n) == k]
print(f"phi(n) = {k}: n in {solutions}")  # [5, 8, 10, 12]

# Giải a^x ≡ b (mod n) dùng Euler khi gcd(a,n)=1
# Ví dụ: nghịch đảo tổng quát a^(phi(n)-1) mod n
def euler_inverse(a, n):
    assert gcd(a, n) == 1
    return pow(a, euler_phi(n) - 1, n)

print(euler_inverse(7, 24))  # 7^7 mod 24 = 7 (vì 7*7=49≡1 mod 24)
```

---

## Ứng Dụng: Hệ Mật RSA (RSA Cryptosystem)

Định Lý Euler là nền tảng toán học của **RSA** (Rivest–Shamir–Adleman, 1977) — một trong những hệ mật khóa công khai đầu tiên và được dùng rộng rãi nhất.

### Ý tưởng

> [!note] RSA — Nguyên Lý Cơ Bản
> **Sinh khóa:** Chọn hai số nguyên tố lớn $p, q$. Đặt $n = pq$. Chọn $e$ với $\gcd(e, \varphi(n)) = 1$. Khóa công khai: $(n, e)$. Khóa riêng: $d = e^{-1} \pmod{\varphi(n)}$.
>
> **Mã hóa:** $c \equiv m^e \pmod{n}$ (với $m$ là plaintext).
>
> **Giải mã:** $m \equiv c^d \equiv (m^e)^d = m^{ed} \equiv m^{1 + k\varphi(n)} \equiv m \pmod{n}$.

### Tại sao RSA hoạt động?

Vì $ed \equiv 1 \pmod{\varphi(n)}$, ta có $ed = 1 + k\varphi(n)$ với $k \in \mathbb{Z}$. Khi $\gcd(m, n) = 1$:

$$
m^{ed} = m^{1 + k\varphi(n)} = m \cdot (m^{\varphi(n)})^k \equiv m \cdot 1^k = m \pmod{n}
$$

(theo Định Lý Euler). Khi $\gcd(m, n) \neq 1$ (rất hiếm nếu $p, q$ lớn), có thể chứng minh RSA vẫn hoạt động nhờ Định Lý Thặng Dư Trung Hoa và Fermat Nhỏ trên từng thừa số $p, q$.

> [!tip] Bảo mật của RSA
> Tính bảo mật dựa trên độ khó của việc **phân tích $n = pq$** thành thừa số nguyên tố. Nếu phân tích được $n$, tính được $\varphi(n) = (p-1)(q-1)$, và từ đó tính được $d$ từ $e$. Hiện tại, với $n \approx 2^{2048}$ (617 chữ số thập phân), bài toán phân tích được coi là bất khả thi với công nghệ hiện tại.

> [!example] Example — RSA với số nhỏ
>
> Chọn $p = 11$, $q = 13$ → $n = 143$, $\varphi(n) = 10 \times 12 = 120$.
>
> Chọn $e = 7$ (nguyên tố cùng nhau với $120$). $d = 7^{-1} \pmod{120} = 103$ (vì $7 \times 103 = 721 \equiv 1 \pmod{120}$).
>
> Mã hóa $m = 5$: $c = 5^7 \pmod{143}$. $5^2 = 25$, $5^4 = 625 \equiv 53$, $5^7 = 5^4 \times 5^2 \times 5 \equiv 53 \times 25 \times 5 = 6625 \equiv 47 \pmod{143}$.
>
> Giải mã: $c^d = 47^{103} \pmod{143}$. Dùng Euler rút gọn số mũ: $103 \bmod 120 = 103$... (hoặc dùng SageMath để xác minh: `pow(47, 103, 143) = 5` ✓).

---

## Summary / Key Takeaways

- **Hàm Euler** $\varphi(n) = |(\mathbb{Z}/n\mathbb{Z})^*|$ đếm số phần tử khả nghịch modulo $n$.
- **Công thức tính**: $\varphi(n) = n \prod_{p \mid n}\!\left(1 - \tfrac{1}{p}\right)$, xây từ $\varphi(p^k) = p^{k-1}(p-1)$ và tính nhân tính.
- **Tính nhân tính**: $\gcd(m,n)=1 \Rightarrow \varphi(mn) = \varphi(m)\varphi(n)$ — hệ quả trực tiếp của CRT.
- **Tổng ước**: $\sum_{d \mid n} \varphi(d) = n$ — phân hoạch $\{1,\ldots,n\}$ theo GCD.
- **Định Lý Euler**: $\gcd(a,n)=1 \Rightarrow a^{\varphi(n)} \equiv 1 \pmod{n}$ — tổng quát hóa Fermat Nhỏ.
- **Rút gọn số mũ**: $a^k \equiv a^{k \bmod \varphi(n)} \pmod{n}$ khi $\gcd(a,n)=1$.
- Khi $n = p$ nguyên tố: $\varphi(p) = p-1$, Euler → Fermat.
- **RSA Cryptosystem**: $m^{ed} \equiv m \pmod{n}$ với $ed \equiv 1 \pmod{\varphi(n)}$ — ứng dụng trực tiếp của Euler's Theorem trong mật mã khóa công khai.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.3–2.4.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 3.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §5.5–5.6.
