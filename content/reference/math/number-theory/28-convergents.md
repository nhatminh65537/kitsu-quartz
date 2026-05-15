---
title: "28. Phân Số Hội Tụ (Convergents)"
type: theory
tags: [math, number-theory, lesson-28, continued-fractions, convergents]
aliases: [Convergents of Continued Fractions]
created: 2026-05-15
---

> **Prerequisites**: [[27-finite-continued-fractions|27. Phân Số Liên Tục Hữu Hạn]]
> **Objectives**:
> - Xây dựng dãy phân số hội tụ (convergents) và nắm công thức truy hồi
> - Chứng minh đẳng thức then chốt $p_n q_{n-1} - p_{n-1} q_n = (-1)^{n+1}$
> - Hiểu tính xen kẽ và đơn điệu của các hội tụ con
> - Chứng minh $\gcd(p_n, q_n) = 1$ — các hội tụ luôn ở dạng tối giản

---

## Motivation / Intuition

Khi ta tính $[a_0;\, a_1, \ldots, a_n]$ bằng cách cắt bỏ đuôi, ta thu được các **phân số hội tụ** (convergents):

$$\frac{p_0}{q_0} = [a_0], \quad \frac{p_1}{q_1} = [a_0;\, a_1], \quad \frac{p_2}{q_2} = [a_0;\, a_1, a_2], \quad \ldots$$

Mỗi hội tụ là một "xấp xỉ tốt" cho số gốc. Điều đáng kinh ngạc là không cần tính lại từ đầu mỗi lần — các $p_n, q_n$ thỏa mãn **công thức truy hồi tuyến tính bậc hai** rất đơn giản, và dãy hội tụ **tiến đến số gốc theo kiểu xen kẽ** (alternating): hội tụ chẵn tiến lên từ dưới, hội tụ lẻ tiến xuống từ trên.

---

## Định Nghĩa và Công Thức Truy Hồi

> [!definition] Definition 28.1 — Phân số hội tụ (Convergent)
> Cho phân số liên tục $[a_0;\, a_1, \ldots, a_n]$. Phân số hội tụ thứ $k$ (hay **hội tụ con** thứ $k$) là:
>
> $$
> \frac{p_k}{q_k} = [a_0;\, a_1, \ldots, a_k], \qquad 0 \leq k \leq n
> $$
>
> Các tử số $p_k$ và mẫu số $q_k$ được xác định bởi **công thức truy hồi**:
>
> $$
> \begin{aligned}
> p_{-1} &= 1, & p_0 &= a_0, & p_k &= a_k p_{k-1} + p_{k-2} \quad (k \geq 1) \\
> q_{-1} &= 0, & q_0 &= 1,   & q_k &= a_k q_{k-1} + q_{k-2} \quad (k \geq 1)
> \end{aligned}
> $$

> [!note] Remark 28.2 — Ý nghĩa của $p_{-1}, q_{-1}$
> Các giá trị khởi tạo $p_{-1} = 1$, $q_{-1} = 0$ là "giá trị ảo" để công thức truy hồi hợp lệ ngay từ $k = 1$. Chúng không tương ứng với bất kỳ phân số hội tụ thực sự nào.
>
> Cũng cần lưu ý: $p_0/q_0 = a_0/1 = a_0$ (đúng vì $[a_0] = a_0$), và $p_1/q_1 = (a_1 a_0 + 1)/a_1$ (đúng vì $[a_0; a_1] = a_0 + 1/a_1$).

> [!example] Example 28.3 — Bảng hội tụ của $43/30 = [1;\, 2, 3, 4]$
>
> | $k$ | $a_k$ | $p_k = a_k p_{k-1} + p_{k-2}$ | $q_k = a_k q_{k-1} + q_{k-2}$ | $p_k/q_k$ |
> |-----|--------|-------------------------------|-------------------------------|-----------|
> | $-1$ | — | $1$ | $0$ | — |
> | $0$ | $1$ | $1$ | $1$ | $1/1 = 1$ |
> | $1$ | $2$ | $2 \cdot 1 + 1 = 3$ | $2 \cdot 1 + 0 = 2$ | $3/2 = 1.5$ |
> | $2$ | $3$ | $3 \cdot 3 + 1 = 10$ | $3 \cdot 2 + 1 = 7$ | $10/7 \approx 1.4286$ |
> | $3$ | $4$ | $4 \cdot 10 + 3 = 43$ | $4 \cdot 7 + 2 = 30$ | $43/30 \approx 1.4333$ |
>
> Kiểm tra hội tụ cuối bằng số gốc: $p_3/q_3 = 43/30$ ✓.
> Tính xen kẽ: $1 < 1.4286 < 1.4333 < 1.5$ — hội tụ chẵn tăng dần, hội tụ lẻ giảm dần.

> [!theorem] Theorem 28.4 — Công thức truy hồi là đúng
> Với $k \geq 0$:
>
> $$
> [a_0;\, a_1, \ldots, a_k] = \frac{p_k}{q_k}
> $$
>
> trong đó $p_k, q_k$ được xác định bởi công thức truy hồi trong Definition 28.1.

**Proof.** Quy nạp trên $k$.

*Cơ sở*: $k = 0$: $[a_0] = a_0 = p_0/q_0 = a_0/1$. ✓

*Bước quy nạp*: Giả sử định lý đúng cho $k-1$. Theo Theorem 27.4 (khai triển đệ quy):

$$[a_0;\, a_1, \ldots, a_k] = [a_0;\, a_1, \ldots, a_{k-1} + \tfrac{1}{a_k}]$$

Áp dụng giả thiết quy nạp với $k-1$ nhưng thay $a_{k-1} \to a_{k-1} + 1/a_k$ (tạm gọi $\tilde{a}_{k-1}$):

$$[a_0;\, \ldots, \tilde{a}_{k-1}] = \frac{\tilde{a}_{k-1} p_{k-2} + p_{k-3}}{\tilde{a}_{k-1} q_{k-2} + q_{k-3}} = \frac{(a_{k-1} + \frac{1}{a_k}) p_{k-2} + p_{k-3}}{(a_{k-1} + \frac{1}{a_k}) q_{k-2} + q_{k-3}}$$

Nhân tử số và mẫu số với $a_k$:

$$= \frac{a_k(a_{k-1} p_{k-2} + p_{k-3}) + p_{k-2}}{a_k(a_{k-1} q_{k-2} + q_{k-3}) + q_{k-2}} = \frac{a_k p_{k-1} + p_{k-2}}{a_k q_{k-1} + q_{k-2}} = \frac{p_k}{q_k}$$

$\blacksquare$

---

## Đẳng Thức Then Chốt

> [!theorem] Theorem 28.5 — Đẳng thức then chốt (Key Identity)
> Với mọi $k \geq 0$:
>
> $$
> p_k q_{k-1} - p_{k-1} q_k = (-1)^{k+1}
> $$
>
> Tương đương: $\det \begin{pmatrix} p_k & p_{k-1} \\ q_k & q_{k-1} \end{pmatrix} = (-1)^{k+1}$.

**Proof.** Quy nạp trên $k$.

*Cơ sở* $k = 0$: $p_0 q_{-1} - p_{-1} q_0 = a_0 \cdot 0 - 1 \cdot 1 = -1 = (-1)^1$. ✓

*Bước quy nạp*: Giả sử $p_{k-1} q_{k-2} - p_{k-2} q_{k-1} = (-1)^k$. Khi đó:

$$p_k q_{k-1} - p_{k-1} q_k = (a_k p_{k-1} + p_{k-2}) q_{k-1} - p_{k-1}(a_k q_{k-1} + q_{k-2})$$

$$= a_k p_{k-1} q_{k-1} + p_{k-2} q_{k-1} - a_k p_{k-1} q_{k-1} - p_{k-1} q_{k-2}$$

$$= p_{k-2} q_{k-1} - p_{k-1} q_{k-2} = -(p_{k-1} q_{k-2} - p_{k-2} q_{k-1}) = -(-1)^k = (-1)^{k+1}$$

$\blacksquare$

> [!corollary] Corollary 28.6 — Các hội tụ ở dạng tối giản
> Với mọi $k \geq 0$: $\gcd(p_k, q_k) = 1$.

**Proof.** Nếu $d = \gcd(p_k, q_k)$ thì $d \mid p_k q_{k-1} - p_{k-1} q_k = (-1)^{k+1}$, nên $d = 1$. $\blacksquare$

> [!corollary] Corollary 28.7 — Hội tụ liên tiếp khác nhau
> Hai hội tụ liên tiếp $p_{k-1}/q_{k-1}$ và $p_k/q_k$ luôn khác nhau, và khoảng cách của chúng là:
>
> $$
> \frac{p_k}{q_k} - \frac{p_{k-1}}{q_{k-1}} = \frac{p_k q_{k-1} - p_{k-1} q_k}{q_k q_{k-1}} = \frac{(-1)^{k+1}}{q_k q_{k-1}}
> $$

### Đẳng thức thứ hai

> [!theorem] Theorem 28.8 — Đẳng thức thứ hai
> Với mọi $k \geq 1$:
>
> $$
> p_k q_{k-2} - p_{k-2} q_k = (-1)^k a_k
> $$

**Proof.** Thay công thức truy hồi:

$$p_k q_{k-2} - p_{k-2} q_k = (a_k p_{k-1} + p_{k-2}) q_{k-2} - p_{k-2}(a_k q_{k-1} + q_{k-2})$$

$$= a_k (p_{k-1} q_{k-2} - p_{k-2} q_{k-1}) = a_k \cdot (-1)^k$$

trong đó bước cuối dùng Theorem 28.5 (với $k \to k-1$, cho $p_{k-1}q_{k-2} - p_{k-2}q_{k-1} = (-1)^k$). $\blacksquare$

> [!example] Example 28.9 — Xác minh hai đẳng thức với $43/30 = [1;2,3,4]$
>
> | $k$ | $p_k q_{k-1} - p_{k-1}q_k$ | $(-1)^{k+1}$ | OK? |
> |-----|-----------------------------|--------------|-----|
> | $0$ | $1 \cdot 0 - 1 \cdot 1 = -1$ | $-1$ | ✓ |
> | $1$ | $3 \cdot 1 - 1 \cdot 2 = 1$ | $1$ | ✓ |
> | $2$ | $10 \cdot 2 - 3 \cdot 7 = -1$ | $-1$ | ✓ |
> | $3$ | $43 \cdot 7 - 10 \cdot 30 = 1$ | $1$ | ✓ |
>
> | $k$ | $p_k q_{k-2} - p_{k-2}q_k$ | $(-1)^k a_k$ | OK? |
> |-----|-----------------------------|--------------|-----|
> | $1$ | $3 \cdot 0 - 1 \cdot 2 = -2$ | $(-1)^1 \cdot 2 = -2$ | ✓ |
> | $2$ | $10 \cdot 1 - 1 \cdot 7 = 3$ | $(-1)^2 \cdot 3 = 3$ | ✓ |
> | $3$ | $43 \cdot 2 - 3 \cdot 30 = -4$ | $(-1)^3 \cdot 4 = -4$ | ✓ |

---

## Tính Xen Kẽ và Đơn Điệu

> [!theorem] Theorem 28.10 — Tính xen kẽ (Alternating Property)
> Xét phân số liên tục hữu hạn $x = [a_0;\, a_1, \ldots, a_n]$ và các hội tụ $p_k/q_k$. Với $q_k > 0$ ($k \geq 0$):
>
> **(i) Hội tụ chẵn tăng dần**: $\dfrac{p_0}{q_0} < \dfrac{p_2}{q_2} < \dfrac{p_4}{q_4} < \cdots$
>
> **(ii) Hội tụ lẻ giảm dần**: $\dfrac{p_1}{q_1} > \dfrac{p_3}{q_3} > \dfrac{p_5}{q_5} > \cdots$
>
> **(iii) Mọi hội tụ chẵn nhỏ hơn mọi hội tụ lẻ**.
>
> **(iv) Hội tụ tiến đến số gốc**: $\dfrac{p_k}{q_k} \to x$ khi $k \to n$.

**Proof.**

**(i)**: Từ Corollary 28.7, $\frac{p_k}{q_k} - \frac{p_{k-1}}{q_{k-1}} = \frac{(-1)^{k+1}}{q_k q_{k-1}}$.

Khi $k$ lẻ: $(-1)^{k+1} > 0$, nên $p_k/q_k > p_{k-1}/q_{k-1}$.
Khi $k$ chẵn ($k \geq 2$): $(-1)^{k+1} < 0$, nên $p_k/q_k < p_{k-1}/q_{k-1}$.

Từ Theorem 28.8: $\frac{p_k}{q_k} - \frac{p_{k-2}}{q_{k-2}} = \frac{(-1)^k a_k}{q_k q_{k-2}}$.
Khi $k$ chẵn: $(-1)^k a_k > 0$, nên $p_k/q_k > p_{k-2}/q_{k-2}$ → dãy chẵn tăng.

**(ii)**: Khi $k$ lẻ: $(-1)^k a_k < 0$, nên $p_k/q_k < p_{k-2}/q_{k-2}$ → dãy lẻ giảm.

**(iii)**: Mọi hội tụ chẵn nằm dưới hội tụ lẻ liền kề (chênh lệch $> 0$), và dãy chẵn tăng, dãy lẻ giảm → mọi chẵn $<$ mọi lẻ.

**(iv)**: Hội tụ cuối chính là số gốc; bước nhảy $|p_k/q_k - p_{k-1}/q_{k-1}| = 1/(q_k q_{k-1})$ giảm đến 0 khi $k \to n$ vì $q_k \geq k$ (hệ quả của $q_k = a_k q_{k-1} + q_{k-2} \geq q_{k-1} + 1$). $\blacksquare$

> [!example] Example 28.11 — Minh họa tính xen kẽ với $43/30$
>
> $$
> \underbrace{\frac{1}{1}}_{k=0} < \underbrace{\frac{10}{7}}_{k=2} < \frac{43}{30} < \underbrace{\frac{3}{2}}_{k=1}
> $$
>
> Các hội tụ "siết chặt" dần về số gốc từ cả hai phía.

---

## Tăng Trưởng của Mẫu Số

> [!theorem] Theorem 28.12 — Mẫu số tăng nghiêm ngặt
> Với $k \geq 1$: $q_k \geq q_{k-1} + 1 > q_{k-1}$. Do đó $q_k \geq k$ với $k \geq 0$.
>
> Cụ thể hơn: $q_k \geq F_{k+1}$, trong đó $F_j$ là số Fibonacci (với $F_1 = F_2 = 1$).

**Proof.** Vì $a_k \geq 1$ với $k \geq 1$: $q_k = a_k q_{k-1} + q_{k-2} \geq q_{k-1} + q_{k-2}$. Đây chính là bất đẳng thức Fibonacci. Cơ sở: $q_0 = 1 = F_2$, $q_1 = a_1 \geq 1 = F_2$... Quy nạp cho $q_k \geq F_{k+1}$. $\blacksquare$

> [!corollary] Corollary 28.13 — Tốc độ hội tụ
> Sai số giữa hội tụ thứ $k$ và số gốc $x = [a_0;\ldots,a_n]$ thỏa:
>
> $$
> \left|\, x - \frac{p_k}{q_k}\right| < \frac{1}{q_k q_{k+1}} \leq \frac{1}{q_k^2}
> $$

**Proof.** Từ Corollary 28.7:

$$x - \frac{p_k}{q_k} = \sum_{j=k+1}^{n} \left(\frac{p_j}{q_j} - \frac{p_{j-1}}{q_{j-1}}\right)$$

Nhưng đây là chuỗi xen kẽ với các số hạng giảm dần về trị tuyệt đối, nên $|x - p_k/q_k| < |p_{k+1}/q_{k+1} - p_k/q_k| = 1/(q_{k+1} q_k)$. Dùng $q_{k+1} \geq q_k$: $1/(q_k q_{k+1}) \leq 1/q_k^2$. $\blacksquare$

---

## Biểu Diễn Ma Trận và Hệ Quả

> [!theorem] Theorem 28.14 — Tích ma trận
> Đặt $M_k = \begin{pmatrix} a_k & 1 \\ 1 & 0 \end{pmatrix}$. Khi đó:
>
> $$
> M_0 M_1 \cdots M_n = \begin{pmatrix} p_n & p_{n-1} \\ q_n & q_{n-1} \end{pmatrix}
> $$

**Proof.** Quy nạp. Cơ sở $n=0$: $M_0 = \begin{pmatrix}a_0&1\\1&0\end{pmatrix} = \begin{pmatrix}p_0&p_{-1}\\q_0&q_{-1}\end{pmatrix}$. ✓

Bước quy nạp: Giả sử đúng cho $n-1$. Khi đó:

$$M_0 \cdots M_{n-1} M_n = \begin{pmatrix} p_{n-1} & p_{n-2} \\ q_{n-1} & q_{n-2} \end{pmatrix} \begin{pmatrix} a_n & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} a_n p_{n-1} + p_{n-2} & p_{n-1} \\ a_n q_{n-1} + q_{n-2} & q_{n-1} \end{pmatrix} = \begin{pmatrix} p_n & p_{n-1} \\ q_n & q_{n-1} \end{pmatrix}$$

$\blacksquare$

> [!note] Remark 28.15 — Định thức và Key Identity
> Lấy định thức hai vế của Theorem 28.14:
>
> $$
> (-1)^{n+1} = \det(M_0 M_1 \cdots M_n) = \prod_{k=0}^n \det(M_k) = \prod_{k=0}^n (-1) = (-1)^{n+1}
> $$
>
> Điều này cho một cách chứng minh khác của Theorem 28.5 bằng đại số tuyến tính. Biểu diễn ma trận còn hữu ích trong thuật toán tính GCD tốc độ cao (Binary GCD) và mật mã học.

---

## SageMath Cheatsheet

```python
# Tính convergents của một CF
cf = continued_fraction([1, 2, 3, 4])
print(cf.convergents())        # [1, 3/2, 10/7, 43/30]
print(cf.numerators())         # [1, 3, 10, 43]
print(cf.denominators())       # [1, 2, 7, 30]

# Tính bằng công thức truy hồi thủ công
def convergents(quotients):
    p_prev, p_curr = 1, quotients[0]
    q_prev, q_curr = 0, 1
    result = [(p_curr, q_curr)]
    for a in quotients[1:]:
        p_prev, p_curr = p_curr, a * p_curr + p_prev
        q_prev, q_curr = q_curr, a * q_curr + q_prev
        result.append((p_curr, q_curr))
    return result

convs = convergents([1, 2, 3, 4])
print(convs)   # [(1,1), (3,2), (10,7), (43,30)]

# Kiểm tra đẳng thức then chốt
def verify_key_identity(quotients):
    convs = convergents(quotients)
    p_prev, q_prev = 1, 0  # p_{-1}, q_{-1}
    for k, (p, q) in enumerate(convs):
        val = p * q_prev - p_prev * q
        expected = (-1)**(k+1)
        assert val == expected, f"k={k}: got {val}, expected {expected}"
        p_prev, q_prev = p, q
    print("All key identities verified!")

verify_key_identity([1, 2, 3, 4])     # OK
verify_key_identity([3, 7, 15, 1])    # OK (convergents of pi)

# Kiểm tra gcd
import math
for p, q in convergents([1, 2, 3, 4]):
    assert math.gcd(p, q) == 1
print("All convergents are in lowest terms!")

# Tính sai số hội tụ
def convergent_errors(quotients):
    from fractions import Fraction
    target = Fraction(0)
    qs = list(quotients)
    result = Fraction(qs[-1])
    for a in reversed(qs[:-1]):
        result = Fraction(a) + Fraction(1, result)
    target = result
    for k, (p, q) in enumerate(convergents(quotients)):
        err = abs(Fraction(p, q) - target)
        print(f"  k={k}: p_k/q_k = {p}/{q}, error = {err} = {float(err):.6e}")

convergent_errors([1, 2, 3, 4])

# Ma trận nhân
def matrix_product(quotients):
    M = matrix(ZZ, [[quotients[0], 1], [1, 0]])
    for a in quotients[1:]:
        M = M * matrix(ZZ, [[a, 1], [1, 0]])
    return M

M = matrix_product([1, 2, 3, 4])
print(M)  # [[43, 10], [30, 7]]
print(M.det())  # 1 = (-1)^{3+1} = 1
```

---

## Summary / Key Takeaways

- **Công thức truy hồi**: $p_k = a_k p_{k-1} + p_{k-2}$, $q_k = a_k q_{k-1} + q_{k-2}$, khởi tạo $p_{-1}=1$, $q_{-1}=0$.
- **Đẳng thức then chốt**: $p_k q_{k-1} - p_{k-1} q_k = (-1)^{k+1}$ — nền tảng của mọi tính chất hội tụ.
- **Đẳng thức thứ hai**: $p_k q_{k-2} - p_{k-2} q_k = (-1)^k a_k$.
- **Tối giản**: $\gcd(p_k, q_k) = 1$ với mọi $k$.
- **Tính xen kẽ**: Hội tụ chẵn tăng, hội tụ lẻ giảm, siết chặt về số gốc từ hai phía.
- **Tốc độ hội tụ**: $|x - p_k/q_k| < 1/(q_k q_{k+1}) \leq 1/q_k^2$.
- **Mẫu số tăng**: $q_k \geq F_{k+1}$ (Fibonacci) — mẫu số tăng ít nhất như số Fibonacci.
- **Biểu diễn ma trận**: $\prod M_k = \begin{pmatrix}p_n & p_{n-1}\\q_n & q_{n-1}\end{pmatrix}$ → cách nhìn đại số cho mọi đồng nhất thức.

---

## References

- Niven, I., Zuckerman, H. S., & Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §7.3–7.4. Wiley, 1991.
- Hardy, G. H., & Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Theorems 150–154. Oxford, 2008.
- Olds, C. D. *Continued Fractions*. Mathematical Association of America, 1963.
- https://pi.math.cornell.edu/~gautam/ContinuedFractions.pdf
