---
title: "33. Tổng Hai Bình Phương — Định Lý Fermat"
type: theory
tags: [math, number-theory, lesson-33, sums-of-two-squares]
aliases: [Sums of Two Squares, Fermat's Theorem on Sums of Two Squares]
created: 2026-05-15
---

> **Prerequisites**: [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]], [[31-gaussian-integers|31. Số Nguyên Gauss Z[i]]], [[32-gaussian-primes|32. Số Nguyên Tố Gauss — Phân Loại]]
> **Objectives**:
> - Phát biểu và chứng minh Định Lý Fermat: $p \equiv 1 \pmod{4} \iff p = a^2 + b^2$
> - Chứng minh đặc trưng tổng quát: $n = a^2+b^2 \iff$ mọi $q \equiv 3 \pmod{4}$ có số mũ chẵn trong $n$
> - Vận dụng Brahmagupta–Fibonacci identity để kết hợp các biểu diễn
> - Giải bài toán cụ thể: kiểm tra và tìm biểu diễn tổng hai bình phương

---

## Motivation / Intuition

Bài toán "số nào biểu diễn được thành tổng hai bình phương?" có lịch sử lâu đời. Fermat (1640) tuyên bố rằng mọi số nguyên tố $p \equiv 1 \pmod{4}$ đều viết được thành $p = a^2+b^2$ một cách duy nhất, và phác thảo một chứng minh bằng "phương pháp descent vô hạn". Euler (1747) là người đầu tiên công bố chứng minh đầy đủ.

Nhưng chứng minh thanh lịch nhất đến từ Gauss, sử dụng $\mathbb{Z}[i]$: câu hỏi về tổng hai bình phương trong $\mathbb{Z}$ trở thành câu hỏi về norm trong $\mathbb{Z}[i]$. Chỉ trong vài dòng, toàn bộ đặc trưng được suy ra từ phân loại Gaussian primes.

---

## Brahmagupta–Fibonacci Identity

Trước khi đi vào chứng minh chính, ta cần một công cụ cơ bản:

> [!theorem] Theorem 33.1 — Brahmagupta–Fibonacci Identity
> Với mọi $a, b, c, d \in \mathbb{Z}$:
>
> $$
> (a^2 + b^2)(c^2 + d^2) = (ac - bd)^2 + (ad + bc)^2
> $$

**Proof.** Đây chính là tính nhân tính của norm trong $\mathbb{Z}[i]$: đặt $\alpha = a+bi$, $\beta = c+di$, thì:

$$
N(\alpha) N(\beta) = N(\alpha\beta) = N((ac-bd) + (ad+bc)i) = (ac-bd)^2 + (ad+bc)^2
$$

Hoặc kiểm tra trực tiếp bằng khai triển đại số. $\blacksquare$

> [!note] Remark 33.2 — Hệ quả quan trọng
> Nếu $m$ và $n$ đều biểu diễn được thành tổng hai bình phương, thì $mn$ cũng vậy. Tập các số biểu diễn được **đóng với phép nhân**. Vì vậy, bài toán quy về việc xác định các **số nguyên tố** nào biểu diễn được — mọi số khác là tích của chúng.

> [!example] Example 33.3 — Kết hợp biểu diễn
> $5 = 1^2+2^2$, $13 = 2^2+3^2$. Áp dụng identity với $(a,b)=(1,2)$, $(c,d)=(2,3)$:
>
> $$
> 5 \cdot 13 = (1\cdot 2 - 2\cdot 3)^2 + (1\cdot 3 + 2\cdot 2)^2 = (2-6)^2 + (3+4)^2 = (-4)^2 + 7^2 = 16+49 = 65
> $$
>
> Vậy $65 = 4^2 + 7^2$. Dùng hoán vị $(a,b)=(1,2)$, $(c,d)=(3,2)$:
>
> $$
> 5 \cdot 13 = (1\cdot 3 - 2\cdot 2)^2 + (1\cdot 2 + 2\cdot 3)^2 = (-1)^2 + 8^2 = 1 + 64 = 65
> $$
>
> Vậy $65$ còn có biểu diễn thứ hai: $65 = 1^2 + 8^2$.

---

## Định Lý Fermat: Số Nguyên Tố $p \equiv 1 \pmod{4}$

> [!theorem] Theorem 33.4 — Định Lý Fermat về Tổng Hai Bình Phương
> Cho $p$ là số nguyên tố lẻ. Khi đó:
>
> $$
> p \equiv 1 \pmod{4} \iff \exists!\, (a,b) \in \mathbb{Z}^{+} \times \mathbb{Z}^{+},\; a > b,\; p = a^2 + b^2
> $$
>
> (Tính duy nhất: sai khác thứ tự và dấu của $a,b$.)

**Proof (sử dụng Gaussian integers).**

**($\Rightarrow$)** Giả sử $p \equiv 1 \pmod{4}$. Từ bài 16, $(-1 \mid p) = (-1)^{(p-1)/2} = 1$, nên tồn tại $x \in \mathbb{Z}$ với $x^2 \equiv -1 \pmod{p}$, tức $p \mid (x^2+1)$.

Trong $\mathbb{Z}[i]$: $x^2+1 = (x+i)(x-i)$. Vậy $p \mid (x+i)(x-i)$.

Nếu $p$ là Gaussian prime, thì $p \mid (x+i)$ hoặc $p \mid (x-i)$. Nhưng $x \pm i = p(c+di)$ kéo theo $pc = x$ và $pd = \pm 1$ — vô lý vì $p \geq 5$. Do đó $p$ **không** là Gaussian prime.

Vậy $p = \alpha\beta$ với $\alpha, \beta$ không phải unit. Lấy norm: $p^2 = N(\alpha)N(\beta)$. Vì $N(\alpha), N(\beta) > 1$, buộc $N(\alpha) = N(\beta) = p$. Viết $\alpha = a+bi$, ta có $p = N(\alpha) = a^2 + b^2$.

**($\Leftarrow$)** Nếu $p = a^2+b^2$ với $a,b \in \mathbb{Z}$, xét modulo $4$: một bình phương $\equiv 0$ hoặc $1 \pmod{4}$. Với $p$ lẻ, $a^2+b^2 \equiv 0, 1, 2 \pmod{4}$. Vì $p$ lẻ, không thể $\equiv 0$ hoặc $2 \pmod{4}$, nên $p \equiv 1 \pmod{4}$. $\blacksquare$

> [!note] Remark 33.5 — Về tính duy nhất
> Nếu $p = a^2+b^2 = c^2+d^2$, thì trong $\mathbb{Z}[i]$: $p = (a+bi)(a-bi) = (c+di)(c-di)$. Do unique factorization và $p$ là rational prime, các biểu diễn này phải là associate của nhau. Suy ra $(c,d) = (\pm a, \pm b)$ hoặc $(c,d) = (\pm b, \pm a)$.

> [!example] Example 33.6 — Tìm biểu diễn cho $p=29$
> $29 \equiv 1 \pmod{4}$, nên $29 = a^2+b^2$. Để tìm $a,b$:
>
> Tìm $x$ với $x^2 \equiv -1 \pmod{29}$: $12^2 = 144 = 5\cdot 29 - 1 \equiv -1 \pmod{29}$. Vậy $29 \mid (12^2+1) = (12+i)(12-i)$.
>
> Tính $\gcd(29, 12+i)$ trong $\mathbb{Z}[i]$ (dùng thuật toán Euclid):
> $29/(12+i) = 29(12-i)/145 = (348-29i)/145 \approx 2.4 - 0.2i$. Chọn $2$:
> $\rho = 29 - 2(12+i) = 5-2i$.
>
> $(12+i)/(5-2i) = (12+i)(5+2i)/29 = (58+29i)/29 = 2+i$ — chia hết!
>
> Vậy $\gcd(29, 12+i) = 5-2i$ (sai khác unit). $N(5-2i) = 25+4 = 29$. Do đó $29 = 5^2+2^2$. ✓

---

## Đặc Trưng Tổng Quát

> [!theorem] Theorem 33.7 — Đặc trưng số biểu diễn được thành tổng hai bình phương
> Cho $n \in \mathbb{Z}^+$ với phân tích chính tắc:
>
> $$
> n = 2^{e} \prod_{p_i \equiv 1 (4)} p_i^{e_i} \prod_{q_j \equiv 3 (4)} q_j^{f_j}
> $$
>
> Khi đó:
>
> $$
> n = a^2 + b^2 \text{ với } a,b \in \mathbb{Z} \iff \text{mọi } f_j \text{ là số chẵn}
> $$
>
> Nói cách khác: $n$ biểu diễn được thành tổng hai bình phương khi và chỉ khi trong phân tích ra thừa số nguyên tố của $n$, mọi số nguyên tố $\equiv 3 \pmod{4}$ đều xuất hiện với **số mũ chẵn**.

**Proof.**

**($\Rightarrow$)** Giả sử $n = a^2+b^2 = N(a+bi)$. Đặt $\alpha = a+bi$. Phân tích $\alpha$ trong $\mathbb{Z}[i]$:

$$
\alpha = u \cdot (1+i)^{e'} \prod \pi_i^{s_i} \prod \overline{\pi_i}^{t_i} \prod q_j^{g_j}
$$

trong đó $\pi_i \overline{\pi_i} = p_i$ với $p_i \equiv 1 \pmod{4}$, và $q_j \equiv 3 \pmod{4}$ là các Gaussian primes trơ.

Lấy norm:

$$
n = N(\alpha) = 2^{e'} \prod p_i^{s_i+t_i} \prod q_j^{2g_j}
$$

So sánh với phân tích của $n$ trong $\mathbb{Z}$, số mũ của mỗi $q_j \equiv 3 \pmod{4}$ là $2g_j$ — **số chẵn**.

**($\Leftarrow$)** Giả sử mọi $f_j$ chẵn. Với mỗi $p_i \equiv 1 \pmod{4}$, tồn tại $\pi_i \in \mathbb{Z}[i]$ với $N(\pi_i) = p_i$ (Theorem 33.4). Với $2$, $N(1+i) = 2$. Với mỗi $q_j \equiv 3 \pmod{4}$, $f_j$ chẵn nên $q_j^{f_j} = (q_j^{f_j/2})^2 = N(q_j^{f_j/2})$.

Đặt:

$$
\alpha = (1+i)^e \prod \pi_i^{e_i} \prod q_j^{f_j/2}
$$

Khi đó $N(\alpha) = n$. Viết $\alpha = a+bi$, ta có $n = a^2+b^2$. $\blacksquare$

> [!example] Example 33.8 — Kiểm tra và tìm biểu diễn
>
> **(a)** $n = 45 = 3^2 \cdot 5$. $3 \equiv 3 \pmod{4}$, số mũ $2$ (chẵn). $5 \equiv 1 \pmod{4}$. Vậy $45$ biểu diễn được.
>
> Tìm: $5 = 2^2+1^2$. $3^2 = 9 = N(3)$. Vậy $\alpha = 3(2+i) = 6+3i$, $N(\alpha) = 36+9 = 45$. Biểu diễn: $45 = 6^2+3^2$. ✓
>
> **(b)** $n = 21 = 3 \cdot 7$. Cả $3$ và $7$ đều $\equiv 3 \pmod{4}$ với số mũ $1$ (lẻ). Vậy $21$ **không** biểu diễn được. (Kiểm tra: $21$ không phải tổng hai bình phương.)
>
> **(c)** $n = 2450 = 2 \cdot 5^2 \cdot 7^2$. $7 \equiv 3 \pmod{4}$, số mũ $2$ (chẵn). $5 \equiv 1 \pmod{4}$. Vậy $2450$ biểu diễn được.
>
> Tìm: $5 = 2^2+1^2$. $\alpha = (1+i) \cdot (2+i)^2 \cdot 7$. $N(2+i) = 5$, $N((2+i)^2) = N(2+i)^2 = 25$. $\alpha = (1+i)(3+4i) \cdot 7 = (-1+7i) \cdot 7 = -7+49i$. $N = 49+2401 = 2450$. Biểu diễn: $2450 = 7^2+49^2$. ✓

> [!warning] Counterexample 33.9 — Số mũ chẵn là cần thiết
> $n = 6 = 2 \cdot 3$. $3 \equiv 3 \pmod{4}$ với số mũ $1$ (lẻ). $6$ không biểu diễn được: $6 = a^2+b^2$ vô nghiệm nguyên. Tương tự: $12 = 2^2 \cdot 3$, $3$ có số mũ $1$ → không biểu diễn được.

---

## Kết Nối: Hai Cách Chứng Minh

> [!tip] So sánh hai phương pháp chứng minh
>
> **Phương pháp Gaussian integers** (trình bày ở trên):
> - Ngắn gọn, thanh lịch
> - Dựa trên UFD trong $\mathbb{Z}[i]$
> - Cho cả đặc trưng tổng quát
>
> **Phương pháp descent của Fermat** (xem Appendix A5):
> - Không cần đại số trừu tượng
> - Chứng minh trực tiếp $p \equiv 1 \pmod{4} \Rightarrow p = a^2+b^2$
> - Ý tưởng: giả sử $mp = a^2+b^2$ với $m > 1$ nhỏ nhất, rồi "hạ" $m$ xuống
> - Đẹp về mặt tổ hợp, nhưng dài hơn

---

## SageMath Cheatsheet

```python
# Kiểm tra n có phải tổng hai bình phương không
def is_sum_of_two_squares(n):
    for p, e in factor(n):
        if p % 4 == 3 and e % 2 == 1:
            return False
    return True

print(is_sum_of_two_squares(45))   # True
print(is_sum_of_two_squares(21))   # False
print(is_sum_of_two_squares(65))   # True

# Tìm biểu diễn tổng hai bình phương (dùng Z[i])
def find_sum_of_two_squares(n):
    if not is_sum_of_two_squares(n):
        return None
    ZI = GaussianIntegers()
    # Phân tích n trong Z[i] và "gom" thành a+bi
    alpha = ZI(1)
    for p, e in factor(n):
        if p == 2:
            alpha *= ZI(1 + i)^e
        elif p % 4 == 1:
            # Tìm a,b với a^2+b^2 = p
            for a in range(1, int(sqrt(p)) + 1):
                b2 = p - a^2
                if b2.is_square():
                    b = int(sqrt(b2))
                    pi = ZI(a + b*i)
                    alpha *= pi^e
                    break
        else:  # p % 4 == 3, e chẵn
            alpha *= ZI(p)^(e // 2)
    return (abs(int(alpha.real())), abs(int(alpha.imag())))

print(find_sum_of_two_squares(65))   # (1, 8) hoặc (4, 7)
print(find_sum_of_two_squares(45))   # (3, 6)
print(find_sum_of_two_squares(85))   # (2, 9) hoặc (6, 7) — 85 = 5*17

# Cách đơn giản hơn: dùng TwoSquares của SageMath
print(two_squares(65))   # (1, 8)
print(two_squares(29))   # (2, 5)
```

---

## Summary / Key Takeaways

- **Brahmagupta–Fibonacci identity**: $(a^2+b^2)(c^2+d^2) = (ac-bd)^2 + (ad+bc)^2$ — tập số biểu diễn được đóng với phép nhân.
- **Định Lý Fermat** (Theorem 33.4): $p \equiv 1 \pmod{4} \iff p = a^2+b^2$ (duy nhất). Chứng minh: $(-1\mid p)=1 \Rightarrow p \mid x^2+1 \Rightarrow p$ không là Gaussian prime $\Rightarrow p = \pi\overline{\pi} \Rightarrow p = N(\pi)$.
- **Đặc trưng tổng quát** (Theorem 33.7): $n$ là tổng hai bình phương $\iff$ mọi prime $q \equiv 3 \pmod{4}$ có số mũ chẵn trong $n$.
- Chứng minh đặc trưng tổng quát dùng unique factorization trong $\mathbb{Z}[i]$ và phép lấy norm — cực kỳ thanh lịch.
- $p=2$ luôn được: $2 = 1^2+1^2$.
- Để tìm biểu diễn cụ thể: tính $\gcd(p, x+i)$ trong $\mathbb{Z}[i]$ với $x^2 \equiv -1 \pmod{p}$.

---

## References

- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §8.3.
- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.7.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §16.9.
- Conrad, K. *The Gaussian Integers*. https://kconrad.math.uconn.edu/blurbs/ugradnumthy/Zinotes.pdf
