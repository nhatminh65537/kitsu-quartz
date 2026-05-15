---
title: "23. Vô Hạn Số Nguyên Tố — Các Cách Chứng Minh"
type: theory
tags: [math, number-theory, lesson-23]
aliases: [Infinitude of Primes, Euclid Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]], [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]]
> **Objectives**:
> - Hiểu và phân tích 4 chứng minh độc lập về sự vô hạn của tập số nguyên tố
> - Phân biệt chứng minh trực tiếp (Euclid) với chứng minh giải tích (Euler)
> - Nắm chứng minh đếm của Erdős và hệ quả cận dưới $\pi(N) \geq \frac{1}{2}\log_2 N$
> - Hiểu kiến trúc tô-pô (Furstenberg) và ý nghĩa của nó
> - Biết sử dụng SageMath để khảo sát phân phối số nguyên tố

---

## Motivation / Intuition

Câu hỏi liệu có vô hạn số nguyên tố hay không là một trong những câu hỏi cổ xưa nhất toán học. Euclid đã trả lời khẳng định khoảng 300 TCN trong *Elements* quyển IX, định lý 20. Kể từ đó, đây trở thành "bài kiểm tra năng lực" kinh điển — một câu hỏi đơn giản nhưng cho phép nhiều cách tiếp cận phong phú, mỗi cách bộc lộ một khía cạnh khác nhau của lý thuyết số.

Ta sẽ xem xét bốn chứng minh, từ sơ cấp nhất đến trừu tượng nhất:

1. **Euclid (300 TCN)**: Trực tiếp, hoàn toàn sơ cấp
2. **Euler (1737)**: Qua chuỗi, kết nối với giải tích
3. **Erdős (1938)**: Đếm tổ hợp, cho thêm cận dưới $\pi(N)$
4. **Furstenberg (1955)**: Tô-pô trên $\mathbb{Z}$, trừu tượng nhưng thanh lịch

Mỗi cách chứng minh không chỉ trả lời câu hỏi mà còn mở ra hướng nghiên cứu mới.

---

## Chứng Minh 1: Euclid

### Phát biểu định lý

> [!theorem] Theorem 23.1 — Vô Hạn Số Nguyên Tố (Euclid)
> Tập hợp các số nguyên tố là vô hạn:
>
> $$
> |\{p \in \mathbb{Z}^+ : p \text{ nguyên tố}\}| = \infty
> $$

### Chứng minh

Ta trình bày đúng theo tinh thần của Euclid: đây là chứng minh **trực tiếp**, không phải bằng phản chứng như nhiều sách giáo khoa hiện đại hay trình bày.

**Mệnh đề phụ.** Với bất kỳ tập hữu hạn $\{p_1, p_2, \ldots, p_k\}$ các số nguyên tố, ta luôn tìm được một số nguyên tố không nằm trong tập đó.

**Chứng minh mệnh đề phụ.** Xét số:

$$
N = p_1 p_2 \cdots p_k + 1
$$

Vì $N > 1$, theo Theorem 3.x (mọi số $> 1$ có ước nguyên tố), $N$ có ít nhất một ước nguyên tố $p$. Ta kiểm tra: với mọi $i$, ta có $p_i \mid p_1 p_2 \cdots p_k$ và $p_i \nmid 1$, nên $p_i \nmid N$. Do đó $p \notin \{p_1, \ldots, p_k\}$.

$\blacksquare$

**Kết luận.** Vì với mọi tập hữu hạn các số nguyên tố ta đều tìm được số nguyên tố ngoài tập đó, không thể có tập hữu hạn nào chứa **tất cả** số nguyên tố. $\blacksquare$

> [!note] Remark 23.2 — Về bản chất chứng minh Euclid
> Lưu ý quan trọng: $N = p_1 p_2 \cdots p_k + 1$ **không nhất thiết** là số nguyên tố!
>
> Ví dụ: $2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 + 1 = 30031 = 59 \times 509$ (hợp số).
>
> Điều ta cần chỉ là $N$ **có một ước nguyên tố mới** — và điều đó luôn đúng.

### Biến thể: Sử dụng $n! + 1$

Một biến thể đơn giản hơn: với mọi $n \geq 1$, mọi ước nguyên tố của $n! + 1$ đều lớn hơn $n$ (vì $p \leq n \Rightarrow p \mid n! \Rightarrow p \nmid n! + 1$). Do đó luôn tồn tại số nguyên tố lớn hơn bất kỳ $n$ nào cho trước.

---

## Chứng Minh 2: Euler — Qua Tích Euler và Chuỗi Điều Hòa

Đây là bằng chứng đầu tiên kết hợp giải tích với lý thuyết số.

### Tích Euler

> [!theorem] Theorem 23.3 — Tích Euler (Euler Product Formula)
> Với $s > 1$ thực:
>
> $$
> \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ nguyên tố}} \frac{1}{1 - p^{-s}}
> $$
>
> Đây là **hàm zeta Riemann** $\zeta(s)$, và đẳng thức này phản ánh Định Lý Cơ Bản Số Học.

**Ý tưởng chứng minh.** Với mỗi số nguyên tố $p$, vì $|p^{-s}| < 1$, ta có:

$$
\frac{1}{1 - p^{-s}} = 1 + \frac{1}{p^s} + \frac{1}{p^{2s}} + \cdots = \sum_{k=0}^{\infty} \frac{1}{p^{ks}}
$$

Khi nhân tất cả các nhân tử này lại (với điều kiện hội tụ tuyệt đối, đảm bảo đổi thứ tự được), mỗi số nguyên dương $n = p_1^{e_1} \cdots p_k^{e_k}$ xuất hiện đúng một lần với hệ số $1/n^s$ — chính nhờ tính duy nhất của phân tích nguyên tố. $\blacksquare$

### Áp dụng: Sự phân kỳ của $\sum 1/p$

> [!theorem] Theorem 23.4 — Chuỗi Nghịch Đảo Số Nguyên Tố Phân Kỳ
>
> $$
> \sum_{p \text{ nguyên tố}} \frac{1}{p} = \infty
> $$
>
> Đặc biệt, tập số nguyên tố là vô hạn (và "đủ dày" để tổng nghịch đảo phân kỳ).

**Chứng minh (phác thảo).** Tại $s = 1$, chuỗi điều hòa phân kỳ: $\zeta(1) = \sum_{n=1}^\infty 1/n = \infty$.

Lấy logarithm hai vế của tích Euler tại $s = 1$:

$$
\log \zeta(1) = -\sum_p \log\!\left(1 - \frac{1}{p}\right) = \sum_p \left(\frac{1}{p} + \frac{1}{2p^2} + \frac{1}{3p^3} + \cdots\right)
$$

Phần đuôi $\sum_p \sum_{k \geq 2} 1/(kp^k)$ hội tụ (bị chặn bởi $\sum_p 1/(p^2 - p) < \infty$). Do đó $\sum_p 1/p$ phải phân kỳ cùng với $\zeta(1)$. $\blacksquare$

> [!note] Remark 23.5 — Ý nghĩa
> Theorem 23.4 mạnh hơn Theorem 23.1 rất nhiều: không chỉ có vô hạn số nguyên tố mà còn chúng **không thưa** (sparse) — tập số nguyên tố "dày" hơn mọi chuỗi có tổng nghịch đảo hội tụ (ví dụ dãy số chính phương $\{1, 4, 9, 16, \ldots\}$ có $\sum 1/n^2 < \infty$).

---

## Chứng Minh 3: Erdős — Đếm Tổ Hợp và Cận Dưới

Chứng minh của Erdős (1938, khi ông 25 tuổi) không chỉ chứng minh vô hạn mà còn cho cận dưới định lượng cho $\pi(N)$.

### Phân tích square-free

> [!definition] Definition 23.6 — Số Không Có Bình Phương (Square-free)
> Số nguyên dương $r$ là **square-free** (không có bình phương) nếu trong phân tích nguyên tố của $r$, mọi số nguyên tố đều xuất hiện với số mũ đúng bằng $1$:
>
> $$
> r = p_1 p_2 \cdots p_j, \quad p_1 < p_2 < \cdots < p_j \text{ phân biệt}
> $$

> [!theorem] Theorem 23.7 — Phân tích $n = r \cdot s^2$
> Mọi số nguyên dương $n$ đều viết được **duy nhất** dưới dạng $n = r \cdot s^2$ với $r$ square-free và $s \in \mathbb{Z}^+$.

**Chứng minh.** Viết $n = p_1^{e_1} p_2^{e_2} \cdots$. Đặt $r = \prod_{p_i : e_i \text{ lẻ}} p_i$ và $s = \prod_i p_i^{\lfloor e_i/2 \rfloor}$. Thì $r$ square-free, $n = r \cdot s^2$, và tính duy nhất theo phân tích nguyên tố. $\blacksquare$

### Đếm

Gọi $\pi(N)$ là số số nguyên tố $\leq N$. Ta đếm số số nguyên dương $\leq N$ theo cách:

**Bước 1: Đếm $r$.** Mỗi số square-free $\leq N$ là tích của một tập con các số nguyên tố $\leq N$. Số tập con của $\pi(N)$ số nguyên tố là $2^{\pi(N)}$. Do đó có **tối đa $2^{\pi(N)}$ số square-free $\leq N$**.

**Bước 2: Đếm $s$.** Ta cần $s^2 \leq N$, tức $s \leq \sqrt{N}$. Vậy có **tối đa $\sqrt{N}$ khả năng cho $s$**.

**Bước 3: Kết hợp.** Mọi số $n \leq N$ đều có phân tích $n = r \cdot s^2$, nên:

$$
N \leq 2^{\pi(N)} \cdot \sqrt{N}
$$

Chia hai vế cho $\sqrt{N}$:

$$
\sqrt{N} \leq 2^{\pi(N)}
$$

Lấy logarithm:

> [!theorem] Theorem 23.8 — Cận Dưới Erdős cho $\pi(N)$
>
> $$
> \pi(N) \geq \frac{1}{2} \log_2 N
> $$

**Hệ quả:** Vì $\frac{1}{2}\log_2 N \to \infty$, tập số nguyên tố là vô hạn. $\blacksquare$

> [!note] Remark 23.9 — Chất lượng cận
> Cận $\pi(N) \geq \frac{1}{2}\log_2 N$ khá yếu so với thực tế $\pi(N) \sim N/\ln N$ (Định Lý Số Nguyên Tố). Tuy nhiên chứng minh này **sơ cấp hoàn toàn** và cho cái nhìn định lượng đầu tiên về mật độ số nguyên tố.

### Ví dụ minh họa

Với $N = 100$, $\pi(100) = 25$. Ta có $\frac{1}{2}\log_2 100 \approx \frac{1}{2} \times 6.64 \approx 3.32$. Cận cho $25 \geq 3.32$ — đúng nhưng lỏng. Điều này phản ánh việc có nhiều số square-free hơn ta dự tính.

---

## Chứng Minh 4: Furstenberg — Tô-pô Trên $\mathbb{Z}$

Chứng minh của Furstenberg (1955, khi ông 20 tuổi, đăng trên *American Mathematical Monthly* trong đúng một đoạn văn) sử dụng ngôn ngữ tô-pô — nhưng thực chất là một lập luận sơ cấp được viết lại bằng ngôn ngữ khác.

### Xây dựng tô-pô

> [!definition] Definition 23.10 — Tập Hợp Cơ Sở (Basis Sets)
> Với $a \in \mathbb{Z}$ và $b \in \mathbb{Z}^+$, định nghĩa **cấp số cộng hai phía vô hạn**:
>
> $$
> S(a, b) = \{\ldots, a - 2b,\ a - b,\ a,\ a + b,\ a + 2b,\ \ldots\} = \{a + kb : k \in \mathbb{Z}\}
> $$

> [!theorem] Theorem 23.11 — Tô-pô Furstenberg trên $\mathbb{Z}$
> Các tập $\{S(a, b)\}$ tạo thành một cơ sở (basis) cho một tô-pô trên $\mathbb{Z}$, gọi là **tô-pô Furstenberg**. Trong tô-pô này:
>
> (i) Mọi tập $S(a, b)$ vừa mở vừa đóng (clopen).
>
> (ii) Mọi tập mở không rỗng là vô hạn.

**Chứng minh (i).** $S(a,b)$ mở theo định nghĩa (là phần tử cơ sở). Phần bù:
$$
\mathbb{Z} \setminus S(a, b) = S(a+1, b) \cup S(a+2, b) \cup \cdots \cup S(a+b-1, b)
$$
là hợp hữu hạn của tập mở, nên mở. Vậy $S(a,b)$ đóng.

**Chứng minh (ii).** Mọi tập mở không rỗng chứa một tập $S(a,b)$ nào đó, mà $S(a,b)$ là vô hạn. $\blacksquare$

### Chứng minh vô hạn số nguyên tố

> [!theorem] Theorem 23.12 — Furstenberg (1955)
> Tập số nguyên tố là vô hạn.

**Chứng minh.** Xét tập:

$$
A = \bigcup_{p \text{ nguyên tố}} S(0, p)
$$

Đây là tập tất cả các số nguyên chia hết cho ít nhất một số nguyên tố. Vì mọi số nguyên $n \neq \pm 1$ đều có ước nguyên tố, ta có:

$$
\mathbb{Z} \setminus A = \{-1, +1\}
$$

Bây giờ:
- Tập $\{-1, +1\}$ là **hữu hạn**, nên không mở (theo (ii)). Do đó phần bù $A$ **không đóng**.
- Mỗi $S(0, p)$ là đóng (theo (i)).
- Nếu chỉ có hữu hạn số nguyên tố $p_1, \ldots, p_k$ thì $A = S(0,p_1) \cup \cdots \cup S(0,p_k)$ là **hợp hữu hạn của tập đóng**, tức $A$ đóng.

Mâu thuẫn. Vậy phải có vô hạn số nguyên tố. $\blacksquare$

> [!note] Remark 23.13 — Bản chất thực sự của chứng minh Furstenberg
> Keith Conrad (UConn) đã chỉ ra rằng chứng minh Furstenberg có thể được diễn giải hoàn toàn không cần tô-pô: ý tưởng cốt lõi là
>
> *"Hợp hữu hạn của các cấp số cộng (với công sai khác nhau) không thể bằng $\mathbb{Z} \setminus \{-1, 1\}$."*
>
> Bằng chứng này là Euclid được "ngụy trang" bằng ngôn ngữ tô-pô — nhưng việc ngụy trang ấy không vô nghĩa, vì nó kết nối lý thuyết số với tô-pô học, gợi mở nhiều câu hỏi sâu hơn.

---

## So Sánh Bốn Chứng Minh

| Tính chất | Euclid | Euler | Erdős | Furstenberg |
|-----------|--------|-------|-------|-------------|
| Phong cách | Sơ cấp trực tiếp | Giải tích | Đếm tổ hợp | Tô-pô |
| Kết quả thêm | Không | $\sum 1/p = \infty$ | $\pi(N) \geq \frac{1}{2}\log_2 N$ | Không |
| Độ khó | ★☆☆☆ | ★★★☆ | ★★☆☆ | ★★★☆ |
| Năm | ~300 TCN | 1737 | 1938 | 1955 |

---

## Một Số Hệ Quả và Bình Luận

### Bản phân phối của số nguyên tố

Biết số nguyên tố vô hạn không cho ta biết chúng **phân phối** như thế nào. Câu hỏi này dẫn đến:
- **Định Lý Số Nguyên Tố** (bài 25): $\pi(x) \sim x / \ln x$
- **Định Lý Dirichlet** (bài 24): số nguyên tố phân phối đều trong các lớp đồng dư

### Các số nguyên tố đặc biệt

> [!example] Example 23.14 — Số nguyên tố Mersenne và Fermat
> - **Số nguyên tố Mersenne**: $M_p = 2^p - 1$ (nguyên tố chỉ khi $p$ nguyên tố, nhưng không phải lúc nào cũng vậy). Ví dụ $M_7 = 127$ nguyên tố, nhưng $M_{11} = 2047 = 23 \times 89$ không nguyên tố.
> - **Số nguyên tố Fermat**: $F_k = 2^{2^k} + 1$. Fermat đoán tất cả đều nguyên tố, nhưng $F_5 = 4294967297 = 641 \times 6700417$ (Euler, 1732).
>
> Chưa biết liệu có vô hạn số nguyên tố Mersenne hay không.

---

## SageMath

```python
# Liệt kê số nguyên tố bằng nhiều cách
from sage.all import primes, prime_pi, is_prime, factor

# Danh sách số nguyên tố đầu tiên
print(list(primes(50)))  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

# Hàm đếm pi(N)
for N in [100, 1000, 10000, 100000]:
    print(f"pi({N}) = {prime_pi(N)}, lower bound = {(N.log(2)/2).n(digits=3):.1f}")

# Kiểm tra N = p1*p2*...*pk + 1 (Euclid)
primes_list = [2, 3, 5, 7, 11, 13]
N = 1
for p in primes_list:
    N *= p
N += 1
print(f"N = {N}, factor = {factor(N)}")  # Không nhất thiết nguyên tố!

# Minh họa phân tích n = r*s^2
def square_free_part(n):
    """Trả về phần square-free r của n."""
    from sage.all import squarefree_part
    return squarefree_part(n)

for n in [12, 45, 72, 100, 360]:
    r = square_free_part(n)
    # s^2 = n/r, s = sqrt(n/r)
    s_sq = n // r
    print(f"n={n}: r={r}, s^2={s_sq}, check r*s^2={r*s_sq}")

# Tích Euler tại s=2: pi^2/6
def euler_product_approx(s, bound=1000):
    """Xấp xỉ tích Euler bằng cách nhân qua các số nguyên tố."""
    from sage.all import primes
    result = 1.0
    for p in primes(bound):
        result *= 1 / (1 - p**(-s))
    return result

approx = euler_product_approx(2)
print(f"Euler product at s=2 ≈ {approx:.6f}")
print(f"pi^2/6 = {(RealField(53)(pi)**2/6):.6f}")
```

---

## Tóm Tắt

Bài học này trình bày 4 chứng minh về sự vô hạn của tập số nguyên tố:

**Chứng minh Euclid**: Với mọi tập hữu hạn số nguyên tố, tích của chúng cộng 1 có ước nguyên tố mới. Đây là chứng minh trực tiếp, không phải phản chứng.

**Chứng minh Euler**: Chuỗi điều hòa phân kỳ và tích Euler ngụ ý $\sum_p 1/p = \infty$ — kết quả mạnh hơn nhiều, chứng tỏ số nguyên tố "dày".

**Chứng minh Erdős**: Phân tích $n = r \cdot s^2$ cho bất đẳng thức $N \leq 2^{\pi(N)} \cdot \sqrt{N}$, suy ra cận dưới định lượng $\pi(N) \geq \frac{1}{2}\log_2 N$.

**Chứng minh Furstenberg**: Tô-pô trên $\mathbb{Z}$ (tập mở = hợp cấp số cộng). Nếu có hữu hạn số nguyên tố thì $\mathbb{Z} \setminus \{-1,1\}$ là đóng — mâu thuẫn vì tập đóng khác $\mathbb{Z}$ phải là đồng hữu hạn (co-finite).
