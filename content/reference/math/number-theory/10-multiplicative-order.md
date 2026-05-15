---
title: "10. Bậc Nhân Tử (Multiplicative Order)"
type: theory
tags: [math, number-theory, lesson-10]
aliases: [Multiplicative Order, Order of an Element]
created: 2026-05-15
---

> **Prerequisites**: [[08-wilson-and-fermat|08. Định Lý Wilson và Fermat Nhỏ]], [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]]
> **Objectives**:
> - Định nghĩa bậc nhân tử (multiplicative order) $\text{ord}_n(a)$
> - Chứng minh định lý trung tâm: $a^k \equiv 1 \iff \text{ord}_n(a) \mid k$
> - Chứng minh $\text{ord}_n(a) \mid \varphi(n)$
> - Tính bậc của lũy thừa: $\text{ord}_n(a^m) = \text{ord}_n(a) / \gcd(m, \text{ord}_n(a))$
> - Hiểu cấu trúc nhóm con cyclic sinh bởi một phần tử

---

## Motivation / Intuition

Định Lý Euler nói $a^{\varphi(n)} \equiv 1 \pmod{n}$. Nhưng $\varphi(n)$ chưa chắc là số mũ **nhỏ nhất** để đưa $a$ về $1$. Câu hỏi: *số mũ nhỏ nhất đó là bao nhiêu?*

Ví dụ: với $n = 7$, ta có $\varphi(7) = 6$. Nhưng $2^3 = 8 \equiv 1 \pmod 7$, tức là $2$ quay về $1$ sau chỉ $3$ bước — không phải $6$ bước. Trong khi đó $3^6 \equiv 1 \pmod 7$ nhưng không có $3^k \equiv 1$ với $k < 6$.

Số mũ nhỏ nhất đó chính là **bậc nhân tử** (multiplicative order), ký hiệu $\text{ord}_n(a)$. Nó mô tả "chu kỳ" của dãy lũy thừa $a, a^2, a^3, \ldots$ modulo $n$.

---

## Định Nghĩa và Tồn Tại

> [!definition] Definition 10.1 — Bậc Nhân Tử (Multiplicative Order)
> Cho $\gcd(a, n) = 1$. **Bậc nhân tử** (multiplicative order) của $a$ modulo $n$, ký hiệu $\text{ord}_n(a)$, là số nguyên dương nhỏ nhất $d$ sao cho:
>
> $$
> a^d \equiv 1 \pmod{n}
> $$

**Tại sao $\text{ord}_n(a)$ luôn tồn tại?** Vì theo Định Lý Euler, $a^{\varphi(n)} \equiv 1 \pmod{n}$, nên tập $\{d \in \mathbb{Z}^+ : a^d \equiv 1 \pmod{n}\}$ khác rỗng. Phần tử nhỏ nhất của tập này chính là $\text{ord}_n(a)$.

> [!example] Example 10.2 — Bảng bậc modulo $7$
>
> Dãy lũy thừa mod $7$:
>
> | $a$ | $a^1$ | $a^2$ | $a^3$ | $a^4$ | $a^5$ | $a^6$ | $\text{ord}_7(a)$ |
> |-----|--------|--------|--------|--------|--------|--------|-------------------|
> | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
> | $2$ | $2$ | $4$ | $1$ | $2$ | $4$ | $1$ | $3$ |
> | $3$ | $3$ | $2$ | $6$ | $4$ | $5$ | $1$ | $6$ |
> | $4$ | $4$ | $2$ | $1$ | $4$ | $2$ | $1$ | $3$ |
> | $5$ | $5$ | $4$ | $6$ | $2$ | $3$ | $1$ | $6$ |
> | $6$ | $6$ | $1$ | $6$ | $1$ | $6$ | $1$ | $2$ |
>
> Nhận xét: bậc của mọi phần tử đều chia $\varphi(7) = 6$.

> [!note] Remark 10.3 — Ký hiệu và điều kiện
> Điều kiện $\gcd(a, n) = 1$ là bắt buộc. Nếu $\gcd(a, n) > 1$, không bao giờ có $a^k \equiv 1 \pmod{n}$ vì $\gcd(a^k, n) \geq \gcd(a, n) > 1$.

---

## Định Lý Trung Tâm về Bậc

> [!theorem] Theorem 10.4 — Tiêu Chuẩn Chia (Divisibility Criterion)
> Cho $\gcd(a, n) = 1$ và $d = \text{ord}_n(a)$. Thì:
>
> $$
> a^k \equiv 1 \pmod{n} \iff d \mid k
> $$

**Proof.**

$(\Leftarrow)$ Nếu $d \mid k$, viết $k = qd$. Thì $a^k = (a^d)^q \equiv 1^q = 1 \pmod{n}$.

$(\Rightarrow)$ Giả sử $a^k \equiv 1 \pmod{n}$. Chia Euclid: $k = qd + r$ với $0 \leq r < d$.

$$
1 \equiv a^k = a^{qd + r} = (a^d)^q \cdot a^r \equiv 1^q \cdot a^r = a^r \pmod{n}
$$

Nếu $r > 0$, ta có $a^r \equiv 1$ với $0 < r < d$ — mâu thuẫn với tính nhỏ nhất của $d = \text{ord}_n(a)$. Vậy $r = 0$, tức $d \mid k$. $\blacksquare$

> [!corollary] Corollary 10.5 — Bậc Chia $\varphi(n)$
> Với mọi $a$ nguyên tố cùng nhau với $n$:
>
> $$
> \text{ord}_n(a) \mid \varphi(n)
> $$

**Proof.** Theo Định Lý Euler, $a^{\varphi(n)} \equiv 1 \pmod{n}$. Áp dụng Theorem 10.4 với $k = \varphi(n)$: $\text{ord}_n(a) \mid \varphi(n)$. $\blacksquare$

> [!corollary] Corollary 10.6 — Phần Tử Cùng Bậc trong Dãy Lũy Thừa
> Nếu $\text{ord}_n(a) = d$, thì $a^i \equiv a^j \pmod{n}$ khi và chỉ khi $i \equiv j \pmod{d}$.

**Proof.** $a^i \equiv a^j \iff a^{i-j} \equiv 1$ (nhân cả hai vế với $a^{-j}$, tồn tại vì $\gcd(a,n)=1$) $\iff d \mid (i-j)$. $\blacksquare$

Hệ quả: dãy $a^0, a^1, a^2, \ldots$ theo modulo $n$ có **chu kỳ đúng bằng $d = \text{ord}_n(a)$**.

---

## Nhóm Con Cyclic Sinh Bởi $a$

Đây là lúc cấu trúc nhóm xuất hiện tự nhiên. Xét tập:

$$
\langle a \rangle = \left\{ a^0, a^1, a^2, \ldots, a^{d-1} \right\} \subset (\mathbb{Z}/n\mathbb{Z})^*
$$

> [!theorem] Theorem 10.7 — Nhóm Con Cyclic (Cyclic Subgroup)
> Nếu $\text{ord}_n(a) = d$, thì tập $\langle a \rangle = \{1, a, a^2, \ldots, a^{d-1}\}$ có đúng $d$ phần tử **phân biệt**, và là một **nhóm con** (subgroup) của $(\mathbb{Z}/n\mathbb{Z})^*$ có bậc $d$.

**Proof.**
*Phân biệt:* Nếu $a^i \equiv a^j \pmod{n}$ với $0 \leq i < j < d$, thì $a^{j-i} \equiv 1$ với $0 < j-i < d$ — mâu thuẫn định nghĩa bậc. Vậy $d$ lũy thừa là phân biệt.

*Đóng dưới phép nhân:* $a^i \cdot a^j = a^{i+j} \equiv a^{(i+j) \bmod d} \in \langle a \rangle$.

*Chứa nghịch đảo:* $(a^i)^{-1} = a^{d-i} \in \langle a \rangle$. $\blacksquare$

> [!note] Remark 10.8 — Tiên đoán về Lagrange
> Corollary 10.5 ($\text{ord}_n(a) \mid \varphi(n)$) thực chất là một trường hợp của **Định Lý Lagrange** trong lý thuyết nhóm: bậc của mọi nhóm con chia hết bậc của nhóm mẹ. Ở đây nhóm mẹ là $(\mathbb{Z}/n\mathbb{Z})^*$ có bậc $\varphi(n)$, và $\langle a \rangle$ là nhóm con có bậc $\text{ord}_n(a)$.

---

## Bậc của Lũy Thừa

Biết $\text{ord}_n(a) = d$, làm sao tính $\text{ord}_n(a^m)$ cho $m$ bất kỳ?

> [!theorem] Theorem 10.9 — Bậc của Lũy Thừa (Order of a Power)
> Nếu $\text{ord}_n(a) = d$ và $m \geq 0$, thì:
>
> $$
> \text{ord}_n(a^m) = \frac{d}{\gcd(m, d)}
> $$

**Proof.** Đặt $g = \gcd(m, d)$, $m = g m'$, $d = g d'$ với $\gcd(m', d') = 1$.

**Bước 1:** Tính $(a^m)^{d'} = a^{m \cdot d'} = a^{g m' \cdot d'} = (a^d)^{m'} \equiv 1^{m'} = 1 \pmod{n}$.

Nên $\text{ord}_n(a^m) \mid d' = d/g$.

**Bước 2:** Giả sử $(a^m)^k \equiv 1 \pmod{n}$, tức $a^{mk} \equiv 1$, suy ra $d \mid mk$ (Theorem 10.4).

$d \mid mk \iff g d' \mid g m' k \iff d' \mid m' k$. Vì $\gcd(d', m') = 1$, suy ra $d' \mid k$.

Vậy $\text{ord}_n(a^m) = d' = d / \gcd(m, d)$. $\blacksquare$

> [!example] Example 10.10 — Bậc của $2^3 \pmod{13}$
>
> Trước tiên tìm $\text{ord}_{13}(2)$:
>
> $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 3$, $2^5 = 6$, $2^6 = 12 \equiv -1$, $2^{12} \equiv 1$. Bậc của $2$ chia $\varphi(13) = 12$; thử ước $12$: $2^6 = -1 \neq 1$, $2^4 = 3 \neq 1$, $2^3 = 8 \neq 1$, $2^2 = 4 \neq 1$. Vậy $\text{ord}_{13}(2) = 12$.
>
> Bậc của $2^3 = 8 \pmod{13}$: $\text{ord}_{13}(8) = 12 / \gcd(3, 12) = 12/3 = 4$.
>
> Kiểm tra: $8^1 = 8$, $8^2 = 64 \equiv 12 \equiv -1$, $8^3 = 8 \cdot (-1) = -8 \equiv 5$, $8^4 = 8 \cdot 5 = 40 \equiv 1$. ✓

> [!example] Example 10.11 — Số phần tử bậc $d$ trong $(\mathbb{Z}/p\mathbb{Z})^*$
>
> Với $p = 13$, $\varphi(13) = 12$. Ước của $12$: $1, 2, 3, 4, 6, 12$.
>
> Với $g = 2$ (bậc $12$), số phần tử bậc $d$ trong $\langle 2 \rangle = (\mathbb{Z}/13\mathbb{Z})^*$ là:
>
> $\text{ord}_{13}(2^m) = 12/\gcd(m, 12)$. Phần tử bậc $d$ ứng với $m$ thỏa $12/\gcd(m,12) = d$, tức $\gcd(m,12) = 12/d$.
>
> Số $m \in \{1,\ldots,12\}$ với $\gcd(m,12) = 12/d$ đúng bằng $\varphi(d)$.
>
> Ví dụ: phần tử bậc $4$ ứng với $\gcd(m,12) = 3$, tức $m \in \{3, 9\}$ — có $\varphi(4) = 2$ phần tử.

---

## Phần Tử Cùng Bậc với Nhau

> [!theorem] Theorem 10.12 — Phần Tử Bậc $d$ trong Nhóm Cyclic
> Nếu $(\mathbb{Z}/n\mathbb{Z})^*$ có một phần tử bậc $d$, thì có đúng $\varphi(d)$ phần tử bậc $d$ trong $(\mathbb{Z}/n\mathbb{Z})^*$.

**Proof.** Giả sử $\text{ord}_n(g) = d$. Các phần tử bậc $d$ trong $\langle g \rangle = \{1, g, g^2, \ldots, g^{d-1}\}$ là những $g^m$ với $\text{ord}_n(g^m) = d$, tức $d / \gcd(m, d) = d$, tức $\gcd(m, d) = 1$.

Số $m \in \{0, 1, \ldots, d-1\}$ với $\gcd(m, d) = 1$ là $\varphi(d)$. $\blacksquare$

---

## Cách Tìm Bậc Hiệu Quả

Tìm $\text{ord}_n(a)$ bằng brute-force ($a^1, a^2, \ldots$) có độ phức tạp $O(\varphi(n))$. Có thể làm nhanh hơn dựa trên Corollary 10.5.

**Thuật toán:**

1. Tính $M = \varphi(n)$ (dùng phân tích nguyên tố của $n$).
2. Phân tích $M = p_1^{e_1} \cdots p_r^{e_r}$.
3. Bắt đầu với $d = M$. Với mỗi thừa nguyên tố $p_i$:
   - Trong khi $p_i \mid d$ và $a^{d/p_i} \equiv 1 \pmod{n}$: đặt $d \leftarrow d/p_i$.
4. Kết quả $d = \text{ord}_n(a)$.

**Tại sao đúng?** Bậc là ước của $\varphi(n)$. Thuật toán loại bỏ dần các thừa số nguyên tố "dư thừa" khỏi $M$.

> [!example] Example 10.13 — Tìm $\text{ord}_{100}(3)$
>
> $\varphi(100) = 40 = 2^3 \cdot 5$.
>
> Bắt đầu $d = 40$. Thừa nguyên tố: $2$ và $5$.
>
> Xét $p = 2$: $3^{40/2} = 3^{20} \pmod{100}$. Tính: $3^{10} = 59049 \equiv 49$, $3^{20} \equiv 49^2 = 2401 \equiv 1 \pmod{100}$. Vậy chia được, $d \leftarrow 20$.
>
> Xét $p = 2$ tiếp: $3^{10} \equiv 49 \not\equiv 1$. Dừng.
>
> Xét $p = 5$: $3^{20/5} = 3^4 = 81 \equiv 81 \not\equiv 1 \pmod{100}$. Dừng.
>
> Vậy $\text{ord}_{100}(3) = 20$.

---

## Ứng Dụng: Phân Loại Bậc Modulo Nguyên Tố

> [!theorem] Theorem 10.14 — Bậc Chia $p - 1$ (Hệ quả Fermat)
> Với $p$ nguyên tố và $\gcd(a, p) = 1$, $\text{ord}_p(a)$ là ước của $p - 1$.

**Proof.** Là Corollary 10.5 với $n = p$: $\text{ord}_p(a) \mid \varphi(p) = p-1$. $\blacksquare$

> [!example] Example 10.15 — Ứng dụng: tìm $x$ thỏa $x^2 \equiv -1 \pmod{p}$
>
> Tồn tại $x$ với $x^2 \equiv -1 \pmod{p}$ (với $p$ nguyên tố lẻ) khi và chỉ khi $p \equiv 1 \pmod{4}$.
>
> **Vì sao?** Nếu $x^2 \equiv -1$, thì $x^4 \equiv 1$ nên $\text{ord}_p(x) \mid 4$. Nhưng $x^2 \equiv -1 \not\equiv 1$, nên $\text{ord}_p(x) \nmid 2$. Vậy $\text{ord}_p(x) = 4$. Do $4 \mid p-1$, ta cần $p \equiv 1 \pmod 4$.
>
> Ngược lại, nếu $4 \mid p-1$, tồn tại phần tử bậc $4$ trong $(\mathbb{Z}/p\mathbb{Z})^*$ (sẽ chứng minh ở bài 11), và bình phương của nó là $-1$.

---

## SageMath Cheatsheet

```python
# Tính multiplicative order
a, n = 2, 13
print(Mod(a, n).multiplicative_order())  # 12

# Bảng order của tất cả phần tử mod n
n = 13
for a in range(1, n):
    if gcd(a, n) == 1:
        print(f"ord_{n}({a}) = {Mod(a, n).multiplicative_order()}")

# Bậc của lũy thừa: kiểm tra công thức
a, n, m = 2, 13, 3
d = Mod(a, n).multiplicative_order()
expected = d // gcd(m, d)
actual = Mod(a^m, n).multiplicative_order()
print(f"ord(a^{m}) expected {expected}, actual {actual}")  # phải bằng nhau

# Thuật toán tìm order hiệu quả
def fast_order(a, n):
    phi_n = euler_phi(n)
    d = phi_n
    for p, e in factor(phi_n):
        while d % p == 0 and pow(a, d // p, n) == 1:
            d //= p
    return d

print(fast_order(3, 100))  # 20

# Đếm phần tử theo bậc
n = 13
from collections import Counter
order_count = Counter(Mod(a, n).multiplicative_order() for a in range(1, n))
print(order_count)  # {12: 4, 6: 2, 4: 2, 3: 2, 2: 1, 1: 1}
# So sánh với phi(d) cho mỗi d|12
for d in divisors(12):
    print(f"Bac {d}: {order_count[d]} phan tu, phi({d}) = {euler_phi(d)}")

# Kiểm tra chu kỳ của dãy lũy thừa
a, n = 3, 7
d = Mod(a, n).multiplicative_order()
print([pow(a, k, n) for k in range(2*d)])  # chu kỳ rõ ràng

# Ứng dụng: tìm x với x^2 ≡ -1 (mod p)
def has_sqrt_neg1(p):
    """Tìm x với x^2 ≡ -1 (mod p)"""
    if p == 2:
        return 1
    if p % 4 != 1:
        return None  # không tồn tại
    for x in range(1, p):
        if pow(x, 2, p) == p - 1:
            return x
    return None

for p in primes(3, 50):
    sol = has_sqrt_neg1(p)
    print(f"p={p}: {'p ≡ 1 mod 4' if p%4==1 else 'p ≡ 3 mod 4'}, sqrt(-1) = {sol}")
```

---

## Summary / Key Takeaways

- **Bậc nhân tử** $\text{ord}_n(a)$: số mũ dương nhỏ nhất để $a^d \equiv 1 \pmod{n}$. Chỉ xác định khi $\gcd(a,n)=1$.
- **Tiêu chuẩn trung tâm**: $a^k \equiv 1 \iff \text{ord}_n(a) \mid k$. Đây là mọi thứ cần biết về khi nào $a^k = 1$.
- **Chia $\varphi(n)$**: $\text{ord}_n(a) \mid \varphi(n)$ — bậc là ước của kích thước nhóm (Lagrange).
- **Bậc của lũy thừa**: $\text{ord}_n(a^m) = \text{ord}_n(a) / \gcd(m, \text{ord}_n(a))$ — công thức chính xác.
- **Nhóm con cyclic** $\langle a \rangle$ có đúng $\text{ord}_n(a)$ phần tử phân biệt.
- **Phần tử bậc $d$**: trong nhóm cyclic, có đúng $\varphi(d)$ phần tử bậc $d$ với mỗi $d \mid |\text{nhóm}|$.
- Hiểu bậc là nền tảng để học primitive roots ở bài 11.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.8.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 4.
- Evan Chen. *Orders Modulo a Prime*, expository notes (2015).
