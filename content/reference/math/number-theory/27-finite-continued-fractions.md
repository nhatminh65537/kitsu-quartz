---
title: "27. Phân Số Liên Tục Hữu Hạn"
type: foundation
tags: [math, number-theory, lesson-27, continued-fractions]
aliases: [Finite Continued Fractions]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]], [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]]
> **Objectives**:
> - Hiểu định nghĩa phân số liên tục đơn giản hữu hạn và ký hiệu $[a_0; a_1, \ldots, a_n]$
> - Nắm vững thuật toán chuyển đổi giữa phân số hữu tỉ và phân số liên tục
> - Chứng minh mọi số hữu tỉ tương ứng đúng với phân số liên tục hữu hạn
> - Phân biệt hai biểu diễn của một số hữu tỉ và chuẩn hóa về dạng chuẩn

---

## Motivation / Intuition

Thuật toán Euclid chia $a$ cho $b$, lấy thương nguyên $q_0$ và dư $r_0$, rồi lặp lại. Kết quả là một dãy thương nguyên $q_0, q_1, q_2, \ldots$ hoàn toàn xác định cặp $(a,b)$. Câu hỏi tự nhiên: liệu ta có thể "đọc ngược" dãy thương này để phục hồi $a/b$?

Câu trả lời chính là **phân số liên tục** (continued fraction). Thay vì chỉ tìm $\gcd(a,b)$, ta dùng toàn bộ thương nguyên từ Euclid để xây dựng một biểu diễn phân cấp của $a/b$:

$$\frac{43}{30} = 1 + \cfrac{1}{2 + \cfrac{1}{3 + \cfrac{1}{4}}}$$

Biểu diễn này nắm bắt "cấu trúc nội tại" của phân số theo cách mà tử số và mẫu số riêng lẻ không làm được. Phân số liên tục là công cụ trung tâm trong lý thuyết xấp xỉ Diophantine, giải phương trình Pell, và nhiều ứng dụng hiện đại.

---

## Phân Số Liên Tục Đơn Giản (Simple Continued Fraction)

### Definition

> [!definition] Definition 27.1 — Phân số liên tục hữu hạn (Finite Continued Fraction)
> Cho $a_0 \in \mathbb{Z}$ và $a_1, a_2, \ldots, a_n \in \mathbb{Z}^+$ (số nguyên dương). Biểu thức
>
> $$
> [a_0;\, a_1, a_2, \ldots, a_n] \;:=\; a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{\ddots + \cfrac{1}{a_n}}}}
> $$
>
> được gọi là **phân số liên tục đơn giản hữu hạn** (finite simple continued fraction) hay **PSLTHH**.
>
> Các số nguyên $a_0, a_1, \ldots, a_n$ được gọi là **thương riêng phần** (partial quotients). $a_0$ có thể là số nguyên bất kỳ; các $a_i$ với $i \geq 1$ phải là số nguyên dương.

> [!note] Remark 27.2 — Ký hiệu và quy ước
> Từ "đơn giản" (simple) hay "chính quy" (regular) chỉ trường hợp tất cả tử số của các phần phân số đều bằng 1. Trong khóa học này, "phân số liên tục" mặc định là phân số liên tục đơn giản.
>
> Ký hiệu $[a_0; a_1, \ldots, a_n]$ được đọc từ ngoài vào trong. Khi $n = 0$, ta có $[a_0] = a_0 \in \mathbb{Z}$.

> [!example] Example 27.3 — Tính giá trị các PSLTHH
> **Ví dụ 1**: $[3;\, 7, 16]$
>
> $$
> [3;\,7,16] = 3 + \cfrac{1}{7 + \cfrac{1}{16}} = 3 + \cfrac{1}{\frac{113}{16}} = 3 + \frac{16}{113} = \frac{339+16}{113} = \frac{355}{113}
> $$
>
> Đây là xấp xỉ nổi tiếng của $\pi \approx 3.14159265\ldots$ mà Zu Chongzhi (thế kỷ 5 SCN) đã tìm ra, với sai số $\approx 2.67 \times 10^{-7}$.
>
> **Ví dụ 2**: $[1;\, 2, 3, 4]$
>
> $$
> [1;\,2,3,4] = 1 + \cfrac{1}{2 + \cfrac{1}{3 + \frac{1}{4}}} = 1 + \cfrac{1}{2 + \cfrac{4}{13}} = 1 + \cfrac{1}{\frac{30}{13}} = 1 + \frac{13}{30} = \frac{43}{30}
> $$
>
> **Ví dụ 3**: $[-2;\, 1, 3, 2]$
>
> $$
> [-2;\,1,3,2] = -2 + \cfrac{1}{1 + \cfrac{1}{3+\frac{1}{2}}} = -2 + \cfrac{1}{1+\frac{2}{7}} = -2 + \cfrac{7}{9} = \frac{-11}{9}
> $$

### Tính toán đệ quy

> [!theorem] Theorem 27.4 — Công thức đệ quy (Recursive Expansion)
> Với $n \geq 1$, ta có
>
> $$
> [a_0;\, a_1, a_2, \ldots, a_n] = \left[a_0;\, [a_1;\, a_2, \ldots, a_n]\right] = a_0 + \dfrac{1}{[a_1;\, a_2, \ldots, a_n]}
> $$
>
> Đặc biệt, $[a_0;\, a_1, \ldots, a_{n-1}, a_n] = [a_0;\, a_1, \ldots, a_{n-1} + \frac{1}{a_n}]$ (hợp nhất hai số cuối).

**Proof.** Trực tiếp từ định nghĩa: $a_0 + \cfrac{1}{a_1 + \cfrac{1}{\cdots}} = a_0 + \cfrac{1}{[a_1;\ldots,a_n]}$. $\blacksquare$

Định lý này rất hữu ích để tính từ phải sang trái (bottom-up), nhanh hơn so với khai triển trực tiếp.

> [!example] Example 27.5 — Tính bottom-up
> $[1;\, 2, 3, 4]$:
>
> - Bước 1: $[4] = 4$
> - Bước 2: $[3;\, 4] = 3 + \frac{1}{4} = \frac{13}{4}$
> - Bước 3: $[2;\, 3, 4] = 2 + \frac{4}{13} = \frac{30}{13}$
> - Bước 4: $[1;\, 2, 3, 4] = 1 + \frac{13}{30} = \frac{43}{30}$

---

## Thuật Toán CF — Từ Phân Số Hữu Tỉ Sang PSLTHH

### Thuật toán

> [!definition] Definition 27.6 — Thuật toán CF (CF Algorithm)
> Cho $x = p/q \in \mathbb{Q}$ với $q > 0$. Định nghĩa dãy:
>
> $$
> x_0 = x, \quad a_k = \lfloor x_k \rfloor, \quad x_{k+1} = \dfrac{1}{x_k - a_k} \quad \text{(khi } x_k \notin \mathbb{Z}\text{)}
> $$
>
> Quá trình dừng tại bước $n$ khi $x_n = a_n \in \mathbb{Z}$ (tức $x_n - a_n = 0$). Khi đó $x = [a_0;\, a_1, \ldots, a_n]$.

> [!note] Remark 27.7 — Liên hệ với Euclid
> Khi $x = p/q$, bước $k$ của thuật toán CF tương ứng chính xác với bước $k$ của thuật toán Euclid áp dụng cho $(p, q)$:
>
> $$
> x_k = \frac{r_{k-1}}{r_k}, \quad a_k = q_k
> $$
>
> trong đó $r_k$ là các số dư và $q_k$ là các thương nguyên trong Euclid. Do Euclid dừng sau hữu hạn bước, thuật toán CF cũng vậy.

**Ví dụ chi tiết — $43/30$:**

| Bước $k$ | $x_k$ | $a_k = \lfloor x_k \rfloor$ | $x_k - a_k$ |
|----------|--------|------------------------------|-------------|
| 0 | $43/30$ | $1$ | $13/30$ |
| 1 | $30/13$ | $2$ | $4/13$ |
| 2 | $13/4$ | $3$ | $1/4$ |
| 3 | $4/1$ | $4$ | $0$ → dừng |

Kết quả: $43/30 = [1;\, 2, 3, 4]$.

Bảng bên trái khớp hoàn toàn với thuật toán Euclid:
$43 = 1 \cdot 30 + 13$, $30 = 2 \cdot 13 + 4$, $13 = 3 \cdot 4 + 1$, $4 = 4 \cdot 1 + 0$.

> [!example] Example 27.8 — Tính CF của $-11/9$
> $x_0 = -11/9$:
>
> - $a_0 = \lfloor -11/9 \rfloor = \lfloor -1.222\ldots \rfloor = -2$, vì $-2 \leq -11/9 < -1$.
> - $x_0 - a_0 = -11/9 - (-2) = 7/9 > 0$ ✓
> - $x_1 = 9/7$, $a_1 = 1$, $x_1 - a_1 = 2/7$
> - $x_2 = 7/2$, $a_2 = 3$, $x_2 - a_2 = 1/2$
> - $x_3 = 2$, $a_3 = 2$ → dừng
>
> Vậy $-11/9 = [-2;\, 1, 3, 2]$. Kiểm tra: $[-2;\,1,3,2] = -2 + \frac{1}{1+\frac{2}{7}} = -2 + \frac{7}{9} = -\frac{11}{9}$. ✓

---

## Định Lý Cơ Bản: Số Hữu Tỉ ↔ PSLTHH

> [!theorem] Theorem 27.9 — Số hữu tỉ và PSLTHH
> **(i) Mọi PSLTHH là số hữu tỉ.** Cụ thể, $[a_0;\, a_1, \ldots, a_n] \in \mathbb{Q}$.
>
> **(ii) Mọi số hữu tỉ là PSLTHH.** Cụ thể, với $x \in \mathbb{Q}$, thuật toán CF cho ta biểu diễn $x = [a_0;\, a_1, \ldots, a_n]$ hữu hạn.

**Proof (i).** Chứng minh bằng quy nạp trên $n$. Cơ sở: $[a_0] = a_0 \in \mathbb{Q}$. Bước quy nạp: giả sử $[a_1; \ldots, a_n] = r/s \in \mathbb{Q}$ với $r, s$ nguyên, $s > 0$. Khi đó $[a_0; a_1, \ldots, a_n] = a_0 + s/r = (a_0 r + s)/r \in \mathbb{Q}$. $\blacksquare$

**Proof (ii).** Thuật toán CF với $x = p/q$ ánh xạ song song với Euclid$(p, q)$, vốn dừng sau hữu hạn bước vì dãy số dư giảm nghiêm ngặt. Mỗi $a_k \geq 1$ với $k \geq 1$ vì $x_k - a_{k-1} \in (0,1)$ nên $x_k = 1/(x_{k-1} - a_{k-1}) > 1$. $\blacksquare$

---

## Tính Không Duy Nhất và Biểu Diễn Chuẩn

Không giống số thập phân (duy nhất cho số hữu tỉ không kết thúc bằng 0), mỗi số hữu tỉ có **đúng hai** biểu diễn PSLTHH.

> [!theorem] Theorem 27.10 — Hai biểu diễn
> Mọi số hữu tỉ $x$ có đúng hai biểu diễn PSLTHH:
>
> $$
> x = [a_0;\, a_1, \ldots, a_{n-1}, a_n] = [a_0;\, a_1, \ldots, a_{n-1}, a_n - 1, 1]
> $$
>
> trong đó $a_n \geq 2$ ở biểu diễn thứ nhất (nếu $n \geq 1$). Trường hợp $a_n = 1$ thì biểu diễn thứ hai là $[a_0;\, a_1, \ldots, a_{n-1}]$ (rút gọn).
>
> Chỉ có duy nhất **biểu diễn chuẩn**: $[a_0;\, a_1, \ldots, a_n]$ với $a_n \geq 2$ (khi $n \geq 1$).

**Proof.** Quan sát $a_n = [a_{n-1}+1] = (a_n - 1) + \frac{1}{1}$, tức $a_n = [a_n - 1;\, 1]$ với $a_n \geq 2$. Do đó:

$$[a_0;\ldots, a_n] = [a_0;\ldots, a_{n-1}, a_n - 1, 1]$$

Ngược lại, hai biểu diễn với $a_n \geq 2$ và $a_n' \geq 2$ (hay $n \neq n'$) là khác nhau vì Euclid có output duy nhất. $\blacksquare$

> [!example] Example 27.11 — Hai biểu diễn
> $$
> \frac{43}{30} = [1;\, 2, 3, 4] = [1;\, 2, 3, 3, 1]
> $$
>
> Kiểm tra: $[1;2,3,3,1] = 1 + \cfrac{1}{2+\cfrac{1}{3+\cfrac{1}{3+1}}} = 1 + \cfrac{1}{2 + \cfrac{4}{13}} = 1 + \frac{13}{30} = \frac{43}{30}$. ✓
>
> **Biểu diễn chuẩn**: $[1;\, 2, 3, 4]$ (thương cuối $a_3 = 4 \geq 2$).

> [!note] Remark 27.12 — Biểu diễn chuẩn và thuật toán CF
> Thuật toán CF luôn cho biểu diễn chuẩn (với $a_n \geq 2$ khi $n \geq 1$), vì số dư cuối cùng trong Euclid luôn bằng 1, tức là thương nguyên $a_n = a_n/1 \geq 2$ (trừ khi $x$ là số nguyên, lúc đó $n=0$).

---

## Một Số Ví Dụ Quan Trọng

> [!example] Example 27.13 — Số $\pi$ và $355/113$
> Các phân số hội tụ nổi tiếng của $\pi$ xuất phát từ CF của nó:
>
> $$
> \pi = [3;\, 7, 15, 1, 292, 1, 1, 1, 2, \ldots]
> $$
>
> - $[3] = 3$ (sai số $\approx 4.5\%$)
> - $[3;\, 7] = 22/7 \approx 3.1429$ (sai số $\approx 4 \times 10^{-4}$)
> - $[3;\, 7, 15] = 333/106 \approx 3.14151$ (sai số $\approx 2.6 \times 10^{-5}$)
> - $[3;\, 7, 15, 1] = 355/113 \approx 3.1415929$ (sai số $\approx 2.7 \times 10^{-7}$)
>
> Thương riêng phần $292$ rất lớn, lý giải tại sao $355/113$ là xấp xỉ cực kỳ tốt: số hạng tiếp theo $1/(292 \cdot 113^2)$ rất nhỏ.

> [!example] Example 27.14 — Số vàng $\varphi$
> Số vàng $\varphi = \frac{1+\sqrt{5}}{2} = 1.6180339\ldots$ có CF:
>
> $$
> \varphi = [1;\, 1, 1, 1, 1, \ldots]
> $$
>
> Đây là số vô tỉ "khó xấp xỉ nhất" — các thương riêng phần đều bằng 1, nhỏ nhất có thể. Các phân số hội tụ chính là tỉ số các số Fibonacci liên tiếp: $1/1, 2/1, 3/2, 5/3, 8/5, 13/8, \ldots$

> [!example] Example 27.15 — Số $e$
> Số Euler $e = 2.71828\ldots$ có CF đẹp:
>
> $$
> e = [2;\, 1, 2, 1, 1, 4, 1, 1, 6, 1, 1, 8, \ldots]
> $$
>
> Quy luật: sau $[2;\, 1]$, dãy là $2k, 1, 1$ lặp lại với $k = 1, 2, 3, \ldots$ Đây là một trong số ít hằng số toán học có CF với quy luật rõ ràng.

---

## Biểu Diễn Ma Trận

> [!theorem] Theorem 27.16 — Biểu diễn ma trận
> Với $[a_0;\, a_1, \ldots, a_n] = p_n / q_n$ (phân số tối giản), ta có:
>
> $$
> \begin{pmatrix} a_0 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} a_1 & 1 \\ 1 & 0 \end{pmatrix} \cdots \begin{pmatrix} a_n & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} p_n & p_{n-1} \\ q_n & q_{n-1} \end{pmatrix}
> $$
>
> Lấy định thức hai vế:
>
> $$
> (-1)^{n+1} = p_n q_{n-1} - p_{n-1} q_n
> $$
>
> (đây chính là đẳng thức then chốt sẽ được chứng minh chi tiết trong Bài 28).

**Proof sketch.** Quy nạp trên $n$: mỗi nhân tử ma trận có định thức $-1$, nên tích $n+1$ nhân tử có định thức $(-1)^{n+1}$. Đồng nhất thức vào với định nghĩa truy hồi của $p_n, q_n$. $\blacksquare$

> [!note] Remark 27.17
> Biểu diễn ma trận rất hữu ích để chứng minh đồng nhất thức và tính toán song song. Bài 28 sẽ phát triển đầy đủ lý thuyết về các phân số hội tụ $p_n/q_n$.

---

## SageMath Cheatsheet

```python
# Tính continued fraction của số hữu tỉ
r = continued_fraction(43/30)
print(r)                        # [1; 2, 3, 4]
print(r.quotients())            # [1, 2, 3, 4]
print(r.convergents())          # [1, 3/2, 10/7, 43/30]

# Tính CF của số vô tỉ (gần đúng)
cf_pi = continued_fraction(RealField(200)(pi))
print(cf_pi.quotients()[:10])   # [3, 7, 15, 1, 292, 1, 1, 1, 2, 1]

# Từ dãy thương về phân số
cf = continued_fraction([1, 2, 3, 4])
print(cf.value())               # 43/30

# Hai biểu diễn
cf1 = continued_fraction([1, 2, 3, 4])
cf2 = continued_fraction([1, 2, 3, 3, 1])
print(cf1.value() == cf2.value())  # True

# Triển khai tay thuật toán CF
def cf_algorithm(p, q):
    """Tính CF của p/q, trả về danh sách thương riêng phần."""
    quotients = []
    while q:
        a = p // q
        quotients.append(a)
        p, q = q, p - a * q
    return quotients

print(cf_algorithm(43, 30))     # [1, 2, 3, 4]
print(cf_algorithm(355, 113))   # [3, 7, 16]
print(cf_algorithm(-11, 9))     # [-2, 1, 3, 2]  ← chú ý floor division

# Tính giá trị từ danh sách (bottom-up)
def cf_value(quotients):
    from fractions import Fraction
    result = Fraction(quotients[-1])
    for a in reversed(quotients[:-1]):
        result = Fraction(a) + Fraction(1, result)
    return result

print(cf_value([1, 2, 3, 4]))   # 43/30
print(cf_value([3, 7, 16]))     # 355/113

# Biểu diễn chuẩn: chuẩn hóa về a_n >= 2
def cf_canonical(quotients):
    qs = list(quotients)
    if len(qs) > 1 and qs[-1] == 1:
        qs.pop()
        qs[-1] += 1
    return qs

print(cf_canonical([1, 2, 3, 3, 1]))  # [1, 2, 3, 4]
```

---

## Summary / Key Takeaways

- **Định nghĩa**: $[a_0;\, a_1, \ldots, a_n]$ với $a_0 \in \mathbb{Z}$, $a_i \in \mathbb{Z}^+$ ($i \geq 1$), là phân số liên tục đơn giản hữu hạn.
- **Thuật toán CF** = thuật toán Euclid: thương nguyên ở mỗi bước là thương riêng phần $a_k$.
- **Mọi số hữu tỉ** ↔ **mọi PSLTHH** (tương đương một-một sau chuẩn hóa).
- **Hai biểu diễn**: $[a_0;\ldots,a_n]$ với $a_n \geq 2$ và $[a_0;\ldots,a_n-1,1]$ cùng đại diện một số; biểu diễn chuẩn là cái có $a_n \geq 2$.
- Thương riêng phần **lớn** → xấp xỉ cực tốt tại bước đó (ví dụ 292 trong CF của $\pi$).
- **Biểu diễn ma trận**: tích ma trận $\begin{pmatrix}a_k & 1\\1&0\end{pmatrix}$ cho ta đồng thời $p_n$ và $q_n$.

---

## References

- Niven, I., Zuckerman, H. S., & Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §7.1–7.2. Wiley, 1991.
- Hardy, G. H., & Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. X. Oxford, 2008.
- Koblitz, N. *A Course in Number Theory and Cryptography* (2nd ed.), §II.3. Springer, 1994.
- https://cp-algorithms.com/algebra/continued-fractions.html
- https://doc.sagemath.org/html/en/reference/continued_fractions/
