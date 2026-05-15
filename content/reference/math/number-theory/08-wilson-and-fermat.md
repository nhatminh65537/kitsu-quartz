---
title: "08. Định Lý Wilson và Fermat Nhỏ"
type: theory
tags: [math, number-theory, lesson-08]
aliases: [Wilson Theorem, Fermat Little Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]], [[05-congruences|05. Quan Hệ Đồng Dư]], [[06-linear-congruences|06. Đồng Dư Tuyến Tính]]
> **Objectives**:
> - Phát biểu và chứng minh Định Lý Wilson: $(p-1)! \equiv -1 \pmod{p}$
> - Phát biểu và chứng minh Định Lý Fermat Nhỏ: $a^{p-1} \equiv 1 \pmod{p}$
> - Hiểu ý nghĩa cấu trúc: các định lý này nói gì về $(\mathbb{Z}/p\mathbb{Z})^*$
> - Áp dụng để kiểm tra số nguyên tố và tính lũy thừa lớn modulo
> - Hiểu sự liên hệ giữa hai định lý và các hệ quả quan trọng

---

## Motivation / Intuition

Hai định lý trong bài này đều là "gương phản chiếu" cấu trúc của $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$:

**Định Lý Wilson** nói: *tích tất cả các phần tử khác không của $\mathbb{F}_p$ bằng $-1$*. Tại sao lại bằng $-1$ chứ không phải $1$? Vì khi "bắt đôi" mỗi phần tử với nghịch đảo của nó, hầu hết các cặp triệt tiêu (tích bằng $1$), chỉ còn lại $1$ và $-1$ là hai phần tử tự nghịch đảo.

**Định Lý Fermat Nhỏ** nói: *mọi phần tử khác không của $\mathbb{F}_p$ đều thỏa $a^{p-1} = 1$*. Điều này xuất phát từ thực tế $(\mathbb{Z}/p\mathbb{Z})^*$ là nhóm có $p-1$ phần tử, và bậc của bất kỳ phần tử nào đều chia $p-1$ (sẽ học kỹ hơn ở bài 10).

---

## Định Lý Wilson

### Bổ đề: phần tử tự nghịch đảo modulo $p$

> [!theorem] Lemma 8.1 — Tự Nghịch Đảo trong $\mathbb{F}_p$
> Nếu $p$ là số nguyên tố, thì $x^2 \equiv 1 \pmod{p}$ có đúng hai nghiệm: $x \equiv 1$ và $x \equiv -1 \equiv p-1 \pmod{p}$.

**Proof.** $x^2 \equiv 1 \pmod{p}$ tương đương $p \mid (x^2 - 1) = (x-1)(x+1)$. Vì $p$ là số nguyên tố, $p \mid (x-1)$ hoặc $p \mid (x+1)$, tức $x \equiv 1 \pmod{p}$ hoặc $x \equiv -1 \pmod{p}$.

Hai nghiệm này phân biệt trừ khi $1 \equiv -1 \pmod{p}$, tức $p \mid 2$, nghĩa là $p = 2$. Với $p > 2$, đó là hai nghiệm phân biệt. Với $p = 2$: $1 \equiv -1 \equiv 1 \pmod{2}$, chỉ một nghiệm. $\blacksquare$

### Định lý Wilson

> [!theorem] Theorem 8.2 — Định Lý Wilson (Wilson's Theorem)
> $n \geq 2$ là số nguyên tố **khi và chỉ khi**:
>
> $$
> (n-1)! \equiv -1 \pmod{n}
> $$

**Proof.**

*($\Rightarrow$) $p$ là số nguyên tố:*

Xét tập $\{1, 2, 3, \ldots, p-1\}$ — các phần tử khác không của $\mathbb{F}_p$.

Với mỗi $a \in \{1, \ldots, p-1\}$, phần tử nghịch đảo $a^{-1}$ cũng nằm trong tập này. Theo Lemma 8.1, $a = a^{-1}$ (tức $a^2 \equiv 1$) chỉ khi $a \equiv 1$ hoặc $a \equiv p-1$.

Do đó, có thể chia $\{2, 3, \ldots, p-2\}$ thành các **cặp ngịch đảo** $(a, a^{-1})$ phân biệt với $a \neq a^{-1}$. Mỗi cặp có tích $a \cdot a^{-1} = 1$.

Vì vậy:

$$
(p-1)! = 1 \cdot \underbrace{\left(\prod_{\substack{a=2 \\ a \neq a^{-1}}}^{p-2} a\right)}_{\text{các cặp}} \cdot (p-1) \equiv 1 \cdot 1 \cdot (p-1) \equiv -1 \pmod{p}
$$

*($\Leftarrow$) $n$ không phải số nguyên tố:*

Nếu $n$ là hợp số, tồn tại $1 < d < n$ với $d \mid n$. Vì $d \leq n-1$, ta có $d \mid (n-1)!$. Nếu $(n-1)! \equiv -1 \pmod{n}$ thì $d \mid ((n-1)! + 1)$, mà lại $d \mid (n-1)!$, suy ra $d \mid 1$ — mâu thuẫn vì $d > 1$.

Ngoại lệ: $n = 4$: $3! = 6 \equiv 2 \pmod{4} \neq -1 \equiv 3 \pmod{4}$. $\blacksquare$

> [!example] Example 8.3 — Kiểm tra với $p = 11$
>
> $10! = 3628800$. Tính $10! \pmod{11}$:
>
> Bắt đôi: $\{2, 6\}$: $2 \cdot 6 = 12 \equiv 1$. $\{3, 4\}$: $3 \cdot 4 = 12 \equiv 1$. $\{5, 9\}$: $5 \cdot 9 = 45 \equiv 1$. $\{7, 8\}$: $7 \cdot 8 = 56 \equiv 1$.
>
> Vậy $10! \equiv 1 \cdot 1 \cdot 1 \cdot 1 \cdot 1 \cdot 10 = 10 \equiv -1 \pmod{11}$. ✓

> [!example] Example 8.4 — Số nguyên tố Wilson
>
> Số nguyên tố $p$ gọi là **Wilson prime** nếu $p^2 \mid ((p-1)! + 1)$.
>
> Wilson prime đã biết: $5, 13, 563$. Chưa biết có vô hạn Wilson prime không.

> [!note] Remark 8.5 — Tiêu chuẩn nguyên tố không hiệu quả
> Mặc dù Wilson's Theorem cho tiêu chuẩn **khi và chỉ khi** để kiểm tra số nguyên tố, nó không hiệu quả trong thực tế vì tính $(n-1)!$ mod $n$ cần $O(n)$ phép nhân. Các tiêu chuẩn nguyên tố thực dụng sẽ học ở bài 26.

---

## Định Lý Fermat Nhỏ

> [!theorem] Theorem 8.6 — Định Lý Fermat Nhỏ (Fermat's Little Theorem)
> Cho $p$ là số nguyên tố và $a \in \mathbb{Z}$.
>
> **(i)** Nếu $p \nmid a$ (tức $\gcd(a, p) = 1$):
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$
>
> **(ii)** Với mọi $a$ (kể cả $p \mid a$):
>
> $$
> a^p \equiv a \pmod{p}
> $$

**Proof (từ Wilson's Theorem).**

Xét tập $S = \{a, 2a, 3a, \ldots, (p-1)a\}$. Vì $\gcd(a, p) = 1$, theo Theorem 5.13, $S$ là hệ thống thặng dư đầy đủ của $\{1, 2, \ldots, p-1\}$ modulo $p$ (thứ tự có thể khác).

Do đó:

$$
a \cdot 2a \cdot 3a \cdots (p-1)a \equiv 1 \cdot 2 \cdot 3 \cdots (p-1) \pmod{p}
$$

$$
a^{p-1} \cdot (p-1)! \equiv (p-1)! \pmod{p}
$$

Vì $\gcd((p-1)!, p) = 1$ (do $p$ nguyên tố), hủy $(p-1)!$:

$$
a^{p-1} \equiv 1 \pmod{p} \qquad \blacksquare
$$

*Phần (ii):* Nếu $p \nmid a$ thì $a \cdot a^{p-1} \equiv a \cdot 1 = a$. Nếu $p \mid a$ thì $a^p \equiv 0^p = 0 \equiv a \pmod{p}$. $\blacksquare$

**Chứng minh thay thế (Induction/Combinatorics).**

Ta chứng minh $a^p \equiv a \pmod{p}$ bằng quy nạp theo $a \geq 0$.

Cơ sở: $a = 0$: $0^p = 0 \equiv 0 \pmod{p}$.

Bước quy nạp: giả sử $a^p \equiv a \pmod{p}$. Khai triển:

$$
(a+1)^p = \sum_{k=0}^{p} \binom{p}{k} a^k
$$

Với $1 \leq k \leq p-1$: $\binom{p}{k} = \frac{p!}{k!(p-k)!}$. Vì $p$ nguyên tố và $p \nmid k!(p-k)!$ (do $k, p-k < p$), nên $p \mid \binom{p}{k}$.

Do đó $(a+1)^p \equiv a^p + 1^p \equiv a + 1 \pmod{p}$. $\blacksquare$

### Hệ quả quan trọng

> [!corollary] Corollary 8.7 — Rút Gọn Số Mũ
> Nếu $p$ là số nguyên tố và $\gcd(a, p) = 1$, thì:
>
> $$
> a^k \equiv a^{k \bmod (p-1)} \pmod{p}
> $$
>
> Tức là, để tính $a^k \pmod{p}$, chỉ cần xét $k$ theo modulo $p-1$.

**Proof.** Viết $k = q(p-1) + r$ với $r = k \bmod (p-1)$. Thì $a^k = (a^{p-1})^q \cdot a^r \equiv 1^q \cdot a^r = a^r \pmod{p}$. $\blacksquare$

> [!example] Example 8.8 — Tính $2^{1000} \pmod{13}$
>
> $p = 13$, $p - 1 = 12$. $1000 = 83 \cdot 12 + 4$, nên $1000 \equiv 4 \pmod{12}$.
>
> $2^{1000} \equiv 2^4 = 16 \equiv 3 \pmod{13}$.

> [!example] Example 8.9 — Tính $10^{100} \pmod{7}$
>
> $p - 1 = 6$. $100 = 16 \cdot 6 + 4$, nên $10^{100} \equiv 10^4 \equiv 3^4 \pmod{7}$ (vì $10 \equiv 3 \pmod{7}$).
>
> $3^2 = 9 \equiv 2$, $3^4 \equiv 4 \pmod{7}$.
>
> Vậy $10^{100} \equiv 4 \pmod{7}$.

> [!corollary] Corollary 8.10 — Tính Nghịch Đảo bằng Lũy Thừa
> Nếu $p$ là số nguyên tố và $p \nmid a$:
>
> $$
> a^{-1} \equiv a^{p-2} \pmod{p}
> $$

**Proof.** $a \cdot a^{p-2} = a^{p-1} \equiv 1 \pmod{p}$. $\blacksquare$

> [!example] Example 8.10 — Nghịch đảo $6^{-1} \pmod{11}$
>
> $6^{-1} \equiv 6^{9} \pmod{11}$.
>
> $6^2 = 36 \equiv 3$, $6^4 \equiv 9$, $6^8 \equiv 81 \equiv 4$, $6^9 = 6^8 \cdot 6 \equiv 4 \cdot 6 = 24 \equiv 2 \pmod{11}$.
>
> Kiểm tra: $6 \cdot 2 = 12 \equiv 1 \pmod{11}$. ✓

---

## Liên Hệ Giữa Hai Định Lý

Hai định lý không chỉ là kết quả độc lập mà liên kết sâu với nhau qua **cấu trúc nhóm** $(\mathbb{Z}/p\mathbb{Z})^*$:

| | Định Lý Wilson | Định Lý Fermat Nhỏ |
|---|---|---|
| **Phát biểu** | $\prod_{a=1}^{p-1} a \equiv -1 \pmod{p}$ | $a^{p-1} \equiv 1 \pmod{p}$ |
| **Ý nghĩa nhóm** | Tích tất cả phần tử của $(\mathbb{Z}/p\mathbb{Z})^*$ bằng $-1$ | Mọi phần tử có bậc chia $p-1$ (Lagrange cho nhóm) |
| **Hướng chứng minh** | Ghép đôi $a$ và $a^{-1}$ | Nhân bổ sung hệ thặng dư |

Thực ra, Định Lý Fermat Nhỏ là trường hợp đặc biệt của Định Lý Euler (bài 09): $a^{\varphi(n)} \equiv 1 \pmod{n}$ khi $\gcd(a,n)=1$, với $\varphi(p) = p-1$.

---

## Ứng Dụng Số Học

### Tính $n! \bmod p$ cho $n \geq p$

> [!example] Example 8.11 — Tính $20! \bmod 7$
>
> Vì $7 \mid 7, 7 \mid 14$, ta có $7 \mid 20!$, nên $20! \equiv 0 \pmod{7}$.
>
> Tổng quát: nếu $n \geq p$ thì $p \mid n!$, nên $n! \equiv 0 \pmod{p}$.

### Giải phương trình bậc cao modulo số nguyên tố

> [!example] Example 8.12 — Giải $x^{17} \equiv 3 \pmod{11}$
>
> Bước 1: rút gọn số mũ. $x^{17} \equiv x^{17 \bmod 10} = x^7 \pmod{11}$ (vì $p - 1 = 10$).
>
> Bước 2: cần tìm $x$ với $x^7 \equiv 3 \pmod{11}$.
>
> Bước 3: tìm nghịch đảo của $7$ modulo $10$: $7 \cdot 3 = 21 \equiv 1 \pmod{10}$, nên $7^{-1} \equiv 3 \pmod{10}$.
>
> Bước 4: $x \equiv 3^{7^{-1}} = 3^3 = 27 \equiv 5 \pmod{11}$.
>
> Kiểm tra: $5^7 = 5 \cdot 5^2 \cdot 5^4 = 5 \cdot 3 \cdot 9 = 135 \equiv 135 - 12 \cdot 11 = 3 \pmod{11}$. ✓

> [!note] Remark 8.13 — Điều kiện cần cho bước 3
> Phương pháp trên ($x \equiv b^{e^{-1} \bmod (p-1)} \pmod{p}$) hoạt động vì $\gcd(e, p-1) = 1$ (bảo đảm $e$ khả nghịch mod $p-1$). Nếu $\gcd(e, p-1) > 1$, bài toán phức tạp hơn (liên quan đến Quadratic Residues — Module 3).

### Số nguyên tố Fermat và định lý đảo

> [!warning] Warning 8.14 — Đảo Định Lý Fermat Không Đúng
> Nếu $a^{n-1} \equiv 1 \pmod{n}$ với $\gcd(a, n) = 1$, điều đó **không** đảm bảo $n$ là số nguyên tố.
>
> **Số giả nguyên tố Fermat** (Fermat pseudoprime): $n$ hợp số thỏa $2^{n-1} \equiv 1 \pmod{n}$.
>
> Ví dụ nhỏ nhất: $n = 341 = 11 \cdot 31$. Kiểm tra: $2^{340} \equiv 1 \pmod{341}$ (tuy $341$ không phải nguyên tố).
>
> **Số Carmichael**: $n$ hợp số thỏa $a^{n-1} \equiv 1 \pmod{n}$ với *mọi* $a$ nguyên tố cùng nhau với $n$. Ví dụ: $561 = 3 \cdot 11 \cdot 17$.
>
> Vấn đề này sẽ giải quyết đầy đủ ở bài 26 (Miller-Rabin test).

---

## SageMath Cheatsheet

```python
# Kiểm tra Wilson's Theorem
def wilson_check(p):
    return (factorial(p-1) % p) == (p - 1)

for p in primes(2, 30):
    print(f"p={p}: (p-1)! ≡ {factorial(p-1) % p} (mod p), Wilson: {wilson_check(p)}")

# Kiểm tra Fermat's Little Theorem
p = 17
for a in range(1, p):
    assert pow(a, p-1, p) == 1, f"FLT failed for a={a}, p={p}"
print(f"FLT verified for all a in [1, {p-1}] mod {p}")

# Rút gọn số mũ bằng Fermat
def fermat_pow(a, k, p):
    """Tính a^k mod p dùng Fermat: a^(p-1) ≡ 1, nên a^k ≡ a^(k mod p-1)"""
    if p.is_prime() and gcd(a, p) == 1:
        return pow(a, k % (p-1), p)
    return pow(a, k, p)

print(fermat_pow(2, 1000, 13))   # 2^(1000 mod 12) = 2^4 = 16 ≡ 3

# Nghịch đảo bằng lũy thừa Fermat
def fermat_inverse(a, p):
    """Tính a^(-1) mod p = a^(p-2) mod p (chỉ khi p nguyên tố)"""
    return pow(a, p-2, p)

print(fermat_inverse(6, 11))  # 2

# Tìm số giả nguyên tố Fermat (cơ sở 2)
def is_fermat_pseudoprime(n, base=2):
    return n > 1 and not n.is_prime() and pow(base, n-1, n) == 1

pseudoprimes = [n for n in range(2, 1000) if is_fermat_pseudoprime(n)]
print("Fermat pseudoprimes (base 2) < 1000:", pseudoprimes)
# [341, 561, 645, 771, 843, ...]

# Số Carmichael nhỏ nhất
carmichael = []
for n in range(4, 600):
    if not is_prime(n):
        if all(pow(a, n-1, n) == 1 for a in range(2, n) if gcd(a, n) == 1):
            carmichael.append(n)
print("Carmichael numbers < 600:", carmichael)  # [561]
```

---

## Summary / Key Takeaways

- **Wilson's Theorem**: $(p-1)! \equiv -1 \pmod{p}$ khi và chỉ khi $p$ là số nguyên tố. Chứng minh bằng cách ghép đôi mỗi $a$ với $a^{-1}$; chỉ $1$ và $p-1$ là tự ghép đôi.
- **Fermat's Little Theorem**: $a^{p-1} \equiv 1 \pmod{p}$ với $p$ nguyên tố, $\gcd(a,p)=1$. Hai cách chứng minh: (1) qua Wilson + hệ thặng dư; (2) quy nạp + hệ số nhị thức.
- **Rút gọn số mũ**: $a^k \equiv a^{k \bmod (p-1)} \pmod{p}$ — rất hữu ích trong tính toán.
- **Nghịch đảo**: $a^{-1} \equiv a^{p-2} \pmod{p}$ — phương pháp thứ hai bên cạnh XGCD.
- **Đảo không đúng**: tồn tại số giả nguyên tố Fermat và số Carmichael — cần test mạnh hơn (Miller-Rabin).
- Cả hai định lý là hệ quả của cấu trúc nhóm $(\mathbb{Z}/p\mathbb{Z})^*$, sẽ được hiểu sâu hơn qua bài 10-13.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.2.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.1–6.2.
- Chapman, R. J. *Three proofs of Wilson's Theorem*. Expository notes, University of Exeter (2005).
