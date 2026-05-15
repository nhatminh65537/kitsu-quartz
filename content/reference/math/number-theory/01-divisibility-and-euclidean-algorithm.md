---
title: "01. Tính Chia Hết và Thuật Toán Euclid"
type: foundation
tags: [math, number-theory, lesson-01]
aliases: [Divisibility, Euclidean Algorithm]
created: 2026-05-15
---

> **Prerequisites**: Toán phổ thông — tập hợp số nguyên $\mathbb{Z}$, bất đẳng thức, quy nạp toán học
> **Objectives**:
> - Nắm vững định nghĩa và các tính chất cơ bản của quan hệ chia hết
> - Phát biểu và chứng minh Định Lý Chia Có Dư (Division Algorithm)
> - Định nghĩa GCD và LCM, hiểu mối quan hệ giữa hai khái niệm
> - Thực hiện thuật toán Euclid và chứng minh tính đúng đắn của nó

---

## Motivation / Intuition

Lý thuyết số bắt đầu từ một câu hỏi rất cơ bản: **khi nào một số nguyên chia hết cho một số nguyên khác?** Câu hỏi tưởng chừng đơn giản này dẫn đến một tòa nhà lý thuyết phong phú, kết nối với hầu hết các nhánh toán học hiện đại.

Hai công cụ trung tâm của bài học này — **GCD** và **thuật toán Euclid** — có tuổi đời hơn 2300 năm (xuất hiện trong *Elements* của Euclid, quyển VII) nhưng vẫn là nền tảng không thể thiếu trong toán học và khoa học máy tính hiện đại.

Trực giác cốt lõi: *tính chia hết* định nghĩa một quan hệ thứ tự bộ phận trên $\mathbb{Z}^+$, và GCD chính là "phần tử lớn nhất" trong tập ước chung của hai số. Thuật toán Euclid biến việc tìm GCD thành một chuỗi phép chia — mỗi bước giảm kích thước bài toán, đảm bảo thuật toán luôn dừng.

---

## Tính Chia Hết (Divisibility)

### Định nghĩa

> [!definition] Definition 1.1 — Tính chia hết (Divisibility)
> Cho $a, b \in \mathbb{Z}$ với $a \neq 0$. Ta nói $a$ **chia hết** $b$ (hoặc $a$ là **ước** của $b$, hoặc $b$ là **bội** của $a$), ký hiệu $a \mid b$, nếu tồn tại $k \in \mathbb{Z}$ sao cho:
>
> $$
> b = k \cdot a
> $$
>
> Nếu không tồn tại $k$ như vậy, ta viết $a \nmid b$.

Lưu ý quan trọng: ký hiệu $a \mid b$ là một **mệnh đề** (đúng hoặc sai), không phải một phép tính. Ta phân biệt rõ $3 \mid 12$ (đúng) với $12 / 3 = 4$ (một số).

> [!example] Example 1.2 — Ví dụ cơ bản
> - $3 \mid 12$ vì $12 = 4 \cdot 3$. ✓
> - $7 \mid -35$ vì $-35 = (-5) \cdot 7$. ✓
> - $5 \nmid 13$ vì không có $k \in \mathbb{Z}$ với $13 = 5k$. ✗
> - $1 \mid n$ với mọi $n \in \mathbb{Z}$ vì $n = n \cdot 1$. ✓
> - $n \mid 0$ với mọi $n \neq 0$ vì $0 = 0 \cdot n$. ✓
> - $n \mid n$ với mọi $n \neq 0$ vì $n = 1 \cdot n$. ✓

### Các tính chất cơ bản

> [!theorem] Theorem 1.3 — Tính chất của quan hệ chia hết
> Cho $a, b, c \in \mathbb{Z}$ với $a \neq 0$. Các tính chất sau đây đúng:
>
> **(i) Phản xạ**: $a \mid a$.
>
> **(ii) Bắc cầu**: Nếu $a \mid b$ và $b \mid c$ thì $a \mid c$.
>
> **(iii) Tuyến tính**: Nếu $a \mid b$ và $a \mid c$ thì $a \mid (mb + nc)$ với mọi $m, n \in \mathbb{Z}$.
>
> **(iv) Tương thích với tích**: Nếu $a \mid b$ thì $a \mid bc$ với mọi $c \in \mathbb{Z}$.
>
> **(v) Đơn điệu**: Nếu $a \mid b$ và $b \neq 0$ thì $|a| \leq |b|$.
>
> **(vi) Đơn vị**: Nếu $a \mid b$ và $b \mid a$ thì $|a| = |b|$ (tức là $a = \pm b$).

**Proof.**
Gọi $b = k_1 a$ và $c = k_2 b$ là các biểu diễn tương ứng.

**(i)** Hiển nhiên: $a = 1 \cdot a$.

**(ii)** Từ $b = k_1 a$ và $c = k_2 b$, ta có $c = k_2 (k_1 a) = (k_1 k_2) a$. Do $k_1 k_2 \in \mathbb{Z}$, suy ra $a \mid c$.

**(iii)** Từ $b = k_1 a$ và $c = k_2 a$, ta có $mb + nc = m(k_1 a) + n(k_2 a) = (mk_1 + nk_2)a$. Do $mk_1 + nk_2 \in \mathbb{Z}$, suy ra $a \mid (mb + nc)$.

**(iv)** Từ $b = k_1 a$, ta có $bc = (k_1 c)a$, suy ra $a \mid bc$.

**(v)** Từ $b = k_1 a$ với $b \neq 0$, ta có $k_1 \neq 0$, nên $|k_1| \geq 1$. Do đó $|b| = |k_1| \cdot |a| \geq |a|$.

**(vi)** Từ $a \mid b$ và $b \mid a$: bởi (v), ta có $|a| \leq |b|$ và $|b| \leq |a|$, suy ra $|a| = |b|$. $\blacksquare$

> [!note] Remark 1.4 — Tổ hợp tuyến tính
> Tính chất (iii) đặc biệt hữu ích: nếu $d \mid a$ và $d \mid b$, thì $d$ chia hết mọi **tổ hợp tuyến tính** (linear combination) $ma + nb$ của $a$ và $b$ với $m, n \in \mathbb{Z}$. Đây là nền tảng cho toàn bộ lý thuyết GCD.

---

## Định Lý Chia Có Dư (Division Algorithm)

Đây là định lý nền tảng nhất của lý thuyết số sơ cấp, đảm bảo rằng phép chia luôn cho thương và số dư xác định.

> [!theorem] Theorem 1.5 — Định Lý Chia Có Dư (Division Algorithm)
> Cho $a \in \mathbb{Z}$ và $b \in \mathbb{Z}$ với $b > 0$. Khi đó tồn tại **duy nhất** cặp số nguyên $(q, r)$ sao cho:
>
> $$
> a = qb + r \qquad \text{và} \qquad 0 \leq r < b
> $$
>
> Ta gọi $q$ là **thương** (quotient) và $r$ là **số dư** (remainder) của phép chia $a$ cho $b$.

**Proof.**

*Phần tồn tại.* Xét tập:

$$
S = \{ a - xb \mid x \in \mathbb{Z},\; a - xb \geq 0 \}
$$

Tập $S$ không rỗng: nếu $a \geq 0$ thì $a - 0 \cdot b = a \in S$; nếu $a < 0$ thì $a - ab \cdot b = a(1 - b^2) \geq 0$ khi $b \geq 1$ (chọn $x = ab$ nếu $a < 0$, hoặc đơn giản hơn, chọn $x$ đủ âm). Cụ thể, chọn $x = \lfloor a/b \rfloor - 1$ ta luôn đảm bảo $a - xb > 0$.

Do $S$ là tập con không rỗng của các số nguyên không âm, theo **Nguyên lý sắp xếp tốt** (Well-Ordering Principle), $S$ có phần tử nhỏ nhất. Đặt $r = \min S$, và chọn $q \in \mathbb{Z}$ sao cho $r = a - qb$.

Ta cần chứng minh $r < b$. Giả sử ngược lại $r \geq b$, thì $r - b = a - (q+1)b \geq 0$, tức là $r - b \in S$. Nhưng $r - b < r$, mâu thuẫn với tính cực tiểu của $r$. Vậy $r < b$.

*Phần duy nhất.* Giả sử có hai cặp $(q, r)$ và $(q', r')$ đều thỏa mãn điều kiện. Khi đó:

$$
a = qb + r = q'b + r'
$$

Suy ra $(q - q')b = r' - r$. Do $0 \leq r, r' < b$, ta có $|r' - r| < b$, nên $|(q - q')b| < b$, tức $|q - q'| < 1$. Vì $q - q' \in \mathbb{Z}$, suy ra $q = q'$, và do đó $r = r'$. $\blacksquare$

> [!example] Example 1.6 — Áp dụng Định Lý Chia Có Dư
> Tìm $(q, r)$ khi:
>
> **(a)** $a = 73$, $b = 11$: $73 = 6 \cdot 11 + 7$, nên $q = 6$, $r = 7$.
>
> **(b)** $a = -29$, $b = 7$: $-29 = (-5) \cdot 7 + 6$ (vì $-29 + 35 = 6$), nên $q = -5$, $r = 6$.
>
> Chú ý: khi $a < 0$, thương $q$ là số âm nhưng số dư $r$ phải thỏa $0 \leq r < b$.

---

## Ước Chung Lớn Nhất và Bội Chung Nhỏ Nhất

### GCD

> [!definition] Definition 1.7 — Ước chung lớn nhất (GCD)
> Cho $a, b \in \mathbb{Z}$, không đồng thời bằng $0$. **Ước chung lớn nhất** (greatest common divisor) của $a$ và $b$, ký hiệu $\gcd(a, b)$, là số nguyên dương $d$ lớn nhất thỏa mãn $d \mid a$ và $d \mid b$.
>
> Nói chính xác hơn, $d = \gcd(a, b)$ là số nguyên dương duy nhất thỏa mãn:
> - $d \mid a$ và $d \mid b$ (d là ước chung)
> - Nếu $c \mid a$ và $c \mid b$ thì $c \mid d$ (d lớn nhất trong mọi ước chung)

Điều kiện thứ hai nói rằng $d$ là bội của mọi ước chung khác — điều này mạnh hơn chỉ nói "$d$ là số lớn nhất" và sẽ là định nghĩa đúng đắn khi mở rộng sang các vành đại số tổng quát.

> [!note] Remark 1.8
> Một số quy ước: $\gcd(a, 0) = |a|$ với $a \neq 0$; nếu $\gcd(a, b) = 1$ ta nói $a$ và $b$ **nguyên tố cùng nhau** (coprime / relatively prime), ký hiệu $a \perp b$.

> [!theorem] Theorem 1.9 — GCD là tổ hợp tuyến tính nhỏ nhất
> Cho $a, b \in \mathbb{Z}$ không đồng thời bằng $0$. Khi đó:
>
> $$
> \gcd(a, b) = \min\{ ma + nb \mid m, n \in \mathbb{Z},\; ma + nb > 0 \}
> $$
>
> Nói cách khác, $\gcd(a, b)$ là phần tử dương nhỏ nhất trong tập $\{ ma + nb \mid m, n \in \mathbb{Z} \}$.

**Proof.**
Đặt $d = \min\{ ma + nb > 0 \mid m, n \in \mathbb{Z} \}$ (tập này không rỗng, ví dụ $a \cdot a + b \cdot 0 = a^2 > 0$ hoặc tương tự). Gọi $d = m_0 a + n_0 b$.

Ta chứng minh $d = \gcd(a, b)$.

*Bước 1:* $d \mid a$. Chia $a = qd + r$ với $0 \leq r < d$. Thì $r = a - qd = a - q(m_0 a + n_0 b) = (1 - qm_0)a + (-qn_0)b$ là một tổ hợp tuyến tính của $a, b$. Nếu $r > 0$ thì mâu thuẫn với tính cực tiểu của $d$. Vậy $r = 0$ và $d \mid a$. Tương tự $d \mid b$.

*Bước 2:* Nếu $c \mid a$ và $c \mid b$ thì $c \mid (m_0 a + n_0 b) = d$ (theo Theorem 1.3(iii)).

Vậy $d$ thỏa mãn đúng định nghĩa của $\gcd(a,b)$. $\blacksquare$

Hệ quả ngay lập tức của định lý này là **Bézout's Identity** (sẽ được khai thác đầy đủ trong bài 02):

> [!corollary] Corollary 1.10 — Bézout's Identity
> Với mọi $a, b \in \mathbb{Z}$ không đồng thời bằng $0$, tồn tại $m, n \in \mathbb{Z}$ sao cho:
>
> $$
> ma + nb = \gcd(a, b)
> $$

### LCM

> [!definition] Definition 1.11 — Bội chung nhỏ nhất (LCM)
> Cho $a, b \in \mathbb{Z} \setminus \{0\}$. **Bội chung nhỏ nhất** (least common multiple) của $a$ và $b$, ký hiệu $\text{lcm}(a, b)$, là số nguyên dương $\ell$ nhỏ nhất thỏa mãn $a \mid \ell$ và $b \mid \ell$.

> [!theorem] Theorem 1.12 — Liên hệ GCD và LCM
> Với mọi $a, b \in \mathbb{Z} \setminus \{0\}$:
>
> $$
> \gcd(a, b) \cdot \text{lcm}(a, b) = |a \cdot b|
> $$

**Proof.**
Đặt $d = \gcd(a, b)$, viết $a = d\alpha$, $b = d\beta$ với $\gcd(\alpha, \beta) = 1$ (vì nếu $c \mid \alpha$ và $c \mid \beta$ thì $cd \mid a$ và $cd \mid b$, mâu thuẫn với $d = \gcd(a,b)$ nếu $c > 1$).

Đặt $\ell = d\alpha\beta = ab/d$. Ta chứng minh $\ell = \text{lcm}(a, b)$.

*$\ell$ là bội chung:* $a = d\alpha \mid d\alpha\beta = \ell$ và $b = d\beta \mid d\alpha\beta = \ell$. ✓

*$\ell$ nhỏ nhất:* Giả sử $m$ là bội chung, tức $a \mid m$ và $b \mid m$. Viết $m = a \cdot k = d\alpha k$. Do $b \mid m$ tức $d\beta \mid d\alpha k$, suy ra $\beta \mid \alpha k$. Vì $\gcd(\alpha, \beta) = 1$, theo Bổ đề Euclid (xem bài 03), suy ra $\beta \mid k$. Đặt $k = \beta t$, thì $m = d\alpha\beta t = \ell t$, nên $\ell \mid m$. Do $m > 0$, suy ra $m \geq \ell$.

Vậy $\ell = \text{lcm}(a, b)$ và $\gcd(a,b) \cdot \text{lcm}(a,b) = d \cdot d\alpha\beta = d \cdot |ab|/d = |ab|$. $\blacksquare$

---

## Thuật Toán Euclid (Euclidean Algorithm)

Theorem 1.9 cho ta sự tồn tại nhưng không cho thuật toán hiệu quả. Thuật toán Euclid giải quyết vấn đề này.

### Bổ đề chìa khóa

> [!lemma] Lemma 1.13 — Bổ đề Euclid cho GCD
> Với $a, b \in \mathbb{Z}$, $b \neq 0$, và $a = qb + r$, ta có:
>
> $$
> \gcd(a, b) = \gcd(b, r)
> $$

**Proof.**
Đặt $d_1 = \gcd(a, b)$ và $d_2 = \gcd(b, r)$.

Từ $r = a - qb$: mọi ước chung của $a$ và $b$ đều chia hết $r$ (theo Theorem 1.3(iii)), nên $d_1 \mid r$. Vậy $d_1$ là ước chung của $b$ và $r$, suy ra $d_1 \mid d_2$.

Từ $a = qb + r$: mọi ước chung của $b$ và $r$ đều chia hết $a$, nên $d_2 \mid a$. Vậy $d_2$ là ước chung của $a$ và $b$, suy ra $d_2 \mid d_1$.

Từ $d_1 \mid d_2$ và $d_2 \mid d_1$, và cả hai đều dương, suy ra $d_1 = d_2$. $\blacksquare$

Bổ đề này cho phép ta **thay bài toán tính $\gcd(a, b)$ bằng $\gcd(b, r)$** với $r < b$ — bài toán nhỏ hơn. Lặp lại quá trình này cho đến khi số dư bằng $0$.

### Thuật toán

> [!definition] Algorithm 1.14 — Thuật Toán Euclid
> Để tính $\gcd(a, b)$ với $a \geq b > 0$:
>
> $$
> \begin{aligned}
> a &= q_1 b + r_1 & (0 \leq r_1 < b) \\
> b &= q_2 r_1 + r_2 & (0 \leq r_2 < r_1) \\
> r_1 &= q_3 r_2 + r_3 & (0 \leq r_3 < r_2) \\
> &\vdots \\
> r_{n-2} &= q_n r_{n-1} + r_n & (0 \leq r_n < r_{n-1}) \\
> r_{n-1} &= q_{n+1} r_n + 0
> \end{aligned}
> $$
>
> Khi đó $\gcd(a, b) = r_n$ (số dư khác $0$ cuối cùng).

> [!theorem] Theorem 1.15 — Đúng đắn của Thuật Toán Euclid
> Thuật toán Euclid luôn **dừng** và cho kết quả $\gcd(a, b)$.

**Proof.**

*Dừng:* Dãy số dư $b > r_1 > r_2 > \cdots \geq 0$ là dãy giảm nghiêm ngặt của các số nguyên không âm, nên phải chạm $0$ sau hữu hạn bước.

*Đúng đắn:* Áp dụng Lemma 1.13 nhiều lần:

$$
\gcd(a, b) = \gcd(b, r_1) = \gcd(r_1, r_2) = \cdots = \gcd(r_{n-1}, r_n) = \gcd(r_n, 0) = r_n
$$

Bước cuối vì $\gcd(r_n, 0) = r_n$ (mọi số nguyên đều chia hết $0$). $\blacksquare$

### Ví dụ chi tiết

> [!example] Example 1.16 — Tính $\gcd(252, 105)$
>
> $$
> \begin{aligned}
> 252 &= 2 \cdot 105 + 42 \\
> 105 &= 2 \cdot 42 + 21 \\
> 42 &= 2 \cdot 21 + 0
> \end{aligned}
> $$
>
> Số dư khác $0$ cuối cùng là $21$, vậy $\gcd(252, 105) = 21$.
>
> Kiểm tra: $252 = 12 \cdot 21$ và $105 = 5 \cdot 21$. ✓

> [!example] Example 1.17 — Tính $\gcd(1337, 289)$
>
> $$
> \begin{aligned}
> 1337 &= 4 \cdot 289 + 181 \\
> 289 &= 1 \cdot 181 + 108 \\
> 181 &= 1 \cdot 108 + 73 \\
> 108 &= 1 \cdot 73 + 35 \\
> 73 &= 2 \cdot 35 + 3 \\
> 35 &= 11 \cdot 3 + 2 \\
> 3 &= 1 \cdot 2 + 1 \\
> 2 &= 2 \cdot 1 + 0
> \end{aligned}
> $$
>
> Vậy $\gcd(1337, 289) = 1$, tức $1337$ và $289$ nguyên tố cùng nhau.

### Độ phức tạp

> [!theorem] Theorem 1.18 — Định lý Lamé
> Số bước của thuật toán Euclid để tính $\gcd(a, b)$ (với $a > b > 0$) không vượt quá $5 \log_{10} b + 1$. Cụ thể hơn, nếu thuật toán dùng $n$ bước chia, thì $b \geq F_{n+1}$ (số Fibonacci thứ $(n+1)$).

*Ý nghĩa:* Số bước là $O(\log \min(a, b))$ — thuật toán Euclid cực kỳ hiệu quả, thậm chí với các số có hàng trăm chữ số.

> [!note] Remark 1.19 — Worst case của Euclid
> Cặp số làm thuật toán Euclid chậm nhất (số bước nhiều nhất) chính xác là các **số Fibonacci liên tiếp**: $\gcd(F_{n+1}, F_n)$ cần đúng $n$ bước, và mỗi bước cho thương $q_i = 1$.

---

## SageMath Cheatsheet

```python
# Tính GCD và LCM
gcd(252, 105)          # = 21
lcm(12, 18)            # = 36

# GCD của nhiều số
gcd([24, 36, 60])      # = 12

# Kiểm tra nguyên tố cùng nhau
gcd(17, 35) == 1       # True

# Thuật toán Euclid từng bước (minh họa)
def euclid_steps(a, b):
    steps = []
    while b != 0:
        q, r = divmod(a, b)
        steps.append((a, b, q, r))
        a, b = b, r
    return steps, a  # (danh sách bước, gcd)

steps, d = euclid_steps(1337, 289)
for (a, b, q, r) in steps:
    print(f"{a} = {q}·{b} + {r}")
print(f"GCD = {d}")

# Phép chia có dư
a, b = 73, 11
q, r = divmod(a, b)    # q = 6, r = 7

# Kiểm tra Theorem 1.12
a, b = 12, 18
assert gcd(a, b) * lcm(a, b) == abs(a * b)  # True
```

---

## Summary / Key Takeaways

- **Tính chia hết** $a \mid b$: tồn tại $k \in \mathbb{Z}$ với $b = ka$. Quan hệ này có tính bắc cầu và tuyến tính.
- **Division Algorithm**: với $b > 0$, mọi $a \in \mathbb{Z}$ viết được duy nhất thành $a = qb + r$ với $0 \leq r < b$.
- **GCD**: $\gcd(a, b)$ là ước chung lớn nhất, đồng thời là tổ hợp tuyến tính dương nhỏ nhất $ma + nb > 0$.
- **Bézout's Identity**: luôn tồn tại $m, n \in \mathbb{Z}$ với $ma + nb = \gcd(a, b)$.
- **LCM và GCD**: $\gcd(a,b) \cdot \text{lcm}(a,b) = |ab|$.
- **Thuật toán Euclid**: dựa trên $\gcd(a, b) = \gcd(b, r)$; chạy trong $O(\log b)$ bước — cực kỳ hiệu quả.
- Số bước nhiều nhất ứng với số Fibonacci — đây là worst case của thuật toán.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), Ch. 1.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. I–II.
- Apostol, T. M. *Introduction to Analytic Number Theory*, Ch. 1.
- Knuth, D. E. *The Art of Computer Programming*, Vol. 2, §4.5.2 (phân tích độ phức tạp Euclid).
