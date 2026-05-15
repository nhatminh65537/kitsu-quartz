---
title: "03. Số Nguyên Tố và Định Lý Cơ Bản Số Học"
type: foundation
tags: [math, number-theory, lesson-03]
aliases: [Primes, Fundamental Theorem of Arithmetic, FTA]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]], [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]]
> **Objectives**:
> - Phân biệt số nguyên tố và hợp số; biết các tính chất đặc trưng
> - Phát biểu và chứng minh Định Lý Cơ Bản Số Học (FTA)
> - Viết biểu diễn chính tắc (canonical form) và tính GCD/LCM qua phân tích nguyên tố
> - Hiểu ý nghĩa của FTA trong cấu trúc của $\mathbb{Z}$

---

## Motivation / Intuition

Số nguyên tố là **"nguyên tử"** của số học: mọi số nguyên đều được tạo thành bằng cách nhân các số nguyên tố. Định Lý Cơ Bản Số Học (Fundamental Theorem of Arithmetic — FTA) khẳng định rằng sự phân tích này là **duy nhất** — không có số nguyên nào có hai cách phân tích nguyên tố khác nhau.

Tính duy nhất này tưởng như hiển nhiên nhưng thực ra cần chứng minh. Trong nhiều vành số khác, tính duy nhất thất bại — ví dụ trong $\mathbb{Z}[\sqrt{-5}]$: $6 = 2 \cdot 3 = (1 + \sqrt{-5})(1 - \sqrt{-5})$, hai cách phân tích khác nhau. Điều đặc biệt ở $\mathbb{Z}$ là thuật toán Euclid bảo đảm cho ta tính chất duy nhất này.

---

## Số Nguyên Tố (Primes)

### Định nghĩa

> [!definition] Definition 3.1 — Số nguyên tố và hợp số
> Một số nguyên $p \geq 2$ được gọi là **số nguyên tố** (prime) nếu ước duy nhất của $p$ trong $\mathbb{Z}^+$ là $1$ và $p$ (tức là $p$ không có ước nào trong $\{2, 3, \ldots, p-1\}$).
>
> Một số nguyên $n \geq 2$ không phải số nguyên tố được gọi là **hợp số** (composite).
>
> Số $1$ không phải số nguyên tố cũng không phải hợp số — nó là **đơn vị** (unit) của $\mathbb{Z}$.

> [!note] Remark 3.2 — Tại sao $1$ không phải số nguyên tố?
> Quy ước $1 \notin \text{Primes}$ không phải tùy tiện: nếu $1$ là số nguyên tố, thì $6 = 2 \times 3 = 1 \times 2 \times 3 = 1^{100} \times 2 \times 3 = \ldots$ cho vô số cách phân tích, phá vỡ tính duy nhất của FTA.

> [!example] Example 3.3 — Nhận dạng số nguyên tố
> Các số nguyên tố đầu tiên: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, \ldots$
>
> - $91 = 7 \times 13$ — **hợp số** (tuy trông có vẻ nguyên tố).
> - $97$ — **nguyên tố** (kiểm tra: không chia hết cho $2, 3, 5, 7$ và $\sqrt{97} < 10$).
> - $1$ — **không** là số nguyên tố.

### Tiêu chuẩn nhận biết số nguyên tố

> [!theorem] Theorem 3.4 — Tiêu chuẩn ước số nguyên tố
> Nếu $n \geq 2$ là hợp số, thì $n$ có ước nguyên tố $p \leq \sqrt{n}$.

**Proof.**
Vì $n$ là hợp số, tồn tại $1 < a \leq b < n$ với $n = ab$. Nếu cả $a$ và $b$ đều lớn hơn $\sqrt{n}$, thì $ab > \sqrt{n} \cdot \sqrt{n} = n$, mâu thuẫn. Nên $a \leq \sqrt{n}$.

Mọi số nguyên $\geq 2$ đều có ước nguyên tố (xem Proposition 3.6), nên $a$ có ước nguyên tố $p \leq a \leq \sqrt{n}$, và $p \mid a \mid n$. $\blacksquare$

**Hệ quả thực tế:** Để kiểm tra $n$ có phải số nguyên tố không, chỉ cần thử chia cho tất cả số nguyên tố $\leq \sqrt{n}$.

> [!example] Example 3.5 — Kiểm tra $n = 149$
> $\sqrt{149} < 13$. Thử chia: $149/2$ lẻ, $1+4+9=14$ không chia hết $3$, $149/5$ không nguyên, $149/7 = 21.28\ldots$, $149/11 = 13.5\ldots$. Không có ước nguyên tố $\leq 12$, vậy $149$ là số nguyên tố.

### Mọi số đều có ước nguyên tố

> [!proposition] Proposition 3.6
> Mọi số nguyên $n \geq 2$ đều có ít nhất một ước nguyên tố.

**Proof** (bằng quy nạp mạnh).
- Nếu $n$ là số nguyên tố: $n$ tự là ước nguyên tố của chính nó.
- Nếu $n$ là hợp số: tồn tại $1 < a < n$ với $a \mid n$. Theo giả thiết quy nạp (với $a < n$), $a$ có ước nguyên tố $p$. Khi đó $p \mid a \mid n$, suy ra $p$ là ước nguyên tố của $n$. $\blacksquare$

---

## Định Lý Cơ Bản Số Học (FTA)

> [!theorem] Theorem 3.7 — Định Lý Cơ Bản Số Học (Fundamental Theorem of Arithmetic)
> Mọi số nguyên $n \geq 2$ đều có thể viết thành tích của các số nguyên tố:
>
> $$
> n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}
> $$
>
> với $p_1 < p_2 < \cdots < p_k$ là các số nguyên tố phân biệt và $e_1, e_2, \ldots, e_k \geq 1$.
>
> Hơn nữa, biểu diễn này là **duy nhất** (ngoại trừ thứ tự các thừa số, đã được cố định bởi điều kiện $p_1 < p_2 < \cdots < p_k$).

Chứng minh dài và đáng chú ý — xem [[a0-proof-of-fta|Appendix A0]] để có chứng minh đầy đủ. Ở đây ta phác thảo ý tưởng chính.

**Phác thảo chứng minh.**

*Phần tồn tại* (bằng quy nạp mạnh trên $n$):
- Cơ sở: $n = 2$ là số nguyên tố. ✓
- Bước quy nạp: Nếu $n$ là nguyên tố, ta xong. Nếu $n$ là hợp số, $n = ab$ với $2 \leq a, b < n$. Theo giả thiết quy nạp, $a$ và $b$ đều phân tích được thành tích nguyên tố. Ghép lại được phân tích của $n$.

*Phần duy nhất* (bằng Corollary 2.11 từ Bổ đề Euclid):
Giả sử $n = p_1 p_2 \cdots p_s = q_1 q_2 \cdots q_t$ là hai phân tích nguyên tố. Vì $p_1 \mid q_1 q_2 \cdots q_t$ và $p_1$ nguyên tố, theo Corollary 2.11 (áp dụng nhiều lần), $p_1$ phải bằng một $q_j$ nào đó. Chia cả hai vế cho $p_1 = q_j$ và lặp lại, ta được $s = t$ và các thừa số bằng nhau (sau khi sắp xếp). (**Chi tiết**: xem Appendix A0.) $\blacksquare$

> [!warning] Remark 3.8 — Tầm quan trọng của Bổ đề Euclid
> Bước then chốt trong phần duy nhất là Corollary 2.11: **$p$ nguyên tố và $p \mid ab$ thì $p \mid a$ hoặc $p \mid b$**. Đây chính xác là lý do $1$ không được coi là số nguyên tố — không thỏa mãn tính chất này ($1 \mid 6$ nhưng $1 \nmid 2$ và $1 \nmid 3$ là vô lý trong định nghĩa).

---

## Biểu Diễn Chính Tắc (Canonical Form)

> [!definition] Definition 3.9 — Biểu diễn chính tắc
> Biểu diễn:
>
> $$
> n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}, \qquad p_1 < p_2 < \cdots < p_k \text{ nguyên tố},\; e_i \geq 1
> $$
>
> được gọi là **biểu diễn chính tắc** (canonical factorization) hoặc **phân tích nguyên tố chuẩn** của $n$.

Khi làm việc với nhiều số, ta thường viết dưới dạng **hợp nhất** (unified form) bằng cách sử dụng cùng tập số nguyên tố, cho phép số mũ bằng $0$. Ví dụ: $12 = 2^2 \cdot 3^1 \cdot 5^0$ và $45 = 2^0 \cdot 3^2 \cdot 5^1$.

### GCD và LCM qua phân tích nguyên tố

> [!theorem] Theorem 3.10 — GCD/LCM qua phân tích nguyên tố
> Cho $a = \prod_p p^{a_p}$ và $b = \prod_p p^{b_p}$ (tích chạy trên tất cả số nguyên tố, với $a_p, b_p \geq 0$ và hữu hạn số $p$ có số mũ khác $0$). Khi đó:
>
> $$
> \gcd(a, b) = \prod_p p^{\min(a_p,\, b_p)}, \qquad \text{lcm}(a, b) = \prod_p p^{\max(a_p,\, b_p)}
> $$

**Proof.** Đặt $d = \prod_p p^{\min(a_p, b_p)}$. Rõ ràng $d \mid a$ và $d \mid b$. Nếu $c \mid a$ và $c \mid b$, thì số mũ của $p$ trong $c$ không vượt $a_p$ và $b_p$, nên không vượt $\min(a_p, b_p)$. Do đó $c \mid d$. Vậy $d = \gcd(a, b)$.

Lập luận tương tự cho $\text{lcm}$ (thay $\min$ bằng $\max$). $\blacksquare$

> [!note] Remark 3.11 — Hệ thức $\min + \max = +$
> Hệ thức $\min(a,b) + \max(a,b) = a + b$ (đối với mỗi số nguyên tố $p$) giải thích tại sao $\gcd(a,b) \cdot \text{lcm}(a,b) = ab$ (Theorem 1.12).

> [!example] Example 3.12 — Tính GCD và LCM
> $a = 2^3 \cdot 3^1 \cdot 5^2 = 600$ và $b = 2^1 \cdot 3^3 \cdot 7^1 = 378$.
>
> | Nguyên tố | $a_p$ | $b_p$ | $\min$ | $\max$ |
> |-----------|--------|--------|--------|--------|
> | 2         | 3      | 1      | 1      | 3      |
> | 3         | 1      | 3      | 1      | 3      |
> | 5         | 2      | 0      | 0      | 2      |
> | 7         | 0      | 1      | 0      | 1      |
>
> $\gcd(600, 378) = 2^1 \cdot 3^1 = 6$.
>
> $\text{lcm}(600, 378) = 2^3 \cdot 3^3 \cdot 5^2 \cdot 7 = 8 \cdot 27 \cdot 25 \cdot 7 = 37800$.
>
> Kiểm tra: $\gcd \cdot \text{lcm} = 6 \cdot 37800 = 226800 = 600 \cdot 378$. ✓

### Số ước của $n$

> [!theorem] Theorem 3.13 — Đếm ước số
> Nếu $n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}$, thì số lượng ước dương của $n$ là:
>
> $$
> \tau(n) = (e_1 + 1)(e_2 + 1) \cdots (e_k + 1)
> $$

**Proof.** Mọi ước dương của $n$ có dạng $p_1^{f_1} \cdots p_k^{f_k}$ với $0 \leq f_i \leq e_i$. Có $(e_i + 1)$ lựa chọn cho $f_i$. Các lựa chọn độc lập, nên tổng số ước là tích. $\blacksquare$

> [!example] Example 3.14
> $n = 720 = 2^4 \cdot 3^2 \cdot 5^1$. Số ước: $\tau(720) = (4+1)(2+1)(1+1) = 5 \cdot 3 \cdot 2 = 30$.

---

## Sàng Eratosthenes (Sieve of Eratosthenes)

Để tìm tất cả số nguyên tố $\leq N$, thuật toán cổ điển là **sàng Eratosthenes**:

1. Lập danh sách $\{2, 3, \ldots, N\}$.
2. Bắt đầu với $p = 2$: gạch bỏ tất cả bội của $p$ lớn hơn $p$.
3. Chuyển sang số tiếp theo chưa bị gạch (đây là số nguyên tố mới).
4. Lặp đến khi $p > \sqrt{N}$.

Độ phức tạp: $O(N \log \log N)$ — gần tuyến tính với $N$.

> [!example] Example 3.15 — Sàng với $N = 30$
> Bắt đầu: $2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30$.
>
> Gạch bội của $2$: bỏ $4, 6, 8, \ldots, 30$.
>
> Gạch bội của $3$: bỏ $9, 15, 21, 27$ (các bội chẵn đã bỏ rồi).
>
> Gạch bội của $5$: bỏ $25$ (các bội khác đã bỏ).
>
> $\sqrt{30} < 6$, dừng. Số nguyên tố $\leq 30$: $\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29\}$.

---

## SageMath Cheatsheet

```python
# Kiểm tra số nguyên tố
is_prime(149)                    # True
is_prime(91)                     # False

# Phân tích nguyên tố
factor(720)                      # 2^4 * 3^2 * 5
factor(1000)                     # 2^3 * 5^3

# Lấy danh sách ước nguyên tố (có bội số)
720.prime_factors()              # [2, 3, 5]

# Danh sách (p, e) trong phân tích
list(factor(720))                # [(2, 4), (3, 2), (5, 1)]

# Số lượng ước
number_of_divisors(720)          # 30  (= tau(720))

# Liệt kê ước
divisors(30)                     # [1, 2, 3, 5, 6, 10, 15, 30]

# Sàng Eratosthenes: số nguyên tố <= N
primes(31)                       # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
prime_range(1, 31)               # như trên

# Số nguyên tố thứ n
nth_prime(10)                    # = 29

# GCD và LCM qua phân tích
a, b = 600, 378
print(gcd(a, b))                 # 6
print(lcm(a, b))                 # 37800
print(gcd(a,b) * lcm(a,b) == a*b)  # True
```

---

## Summary / Key Takeaways

- **Số nguyên tố** $p \geq 2$: ước dương duy nhất là $1$ và $p$. Số $1$ là đơn vị, không phải nguyên tố.
- **Tiêu chuẩn $\sqrt{n}$**: để kiểm tra $n$ có nguyên tố không, chỉ cần thử chia cho nguyên tố $\leq \sqrt{n}$.
- **FTA**: mọi $n \geq 2$ phân tích thành tích nguyên tố **tồn tại và duy nhất** — đây là hệ quả của Bổ đề Euclid.
- **Biểu diễn chính tắc**: $n = p_1^{e_1} \cdots p_k^{e_k}$ với $p_1 < \cdots < p_k$.
- **GCD/LCM qua phân tích**: $\gcd$ dùng $\min$ số mũ, $\text{lcm}$ dùng $\max$ số mũ.
- **Số ước**: $\tau(n) = \prod (e_i + 1)$.
- **Sàng Eratosthenes**: tìm tất cả nguyên tố $\leq N$ với $O(N \log \log N)$.
- Bằng chứng cho thấy $\mathbb{Z}$ là **Unique Factorization Domain (UFD)** — tính chất không phải vành nào cũng có.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §1.3.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. I.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), Ch. 1.
- [[a0-proof-of-fta|A0. Chứng Minh Đầy Đủ Định Lý Cơ Bản Số Học]]
