---
title: "25. Hàm Đếm Số Nguyên Tố và Định Lý Số Nguyên Tố"
type: theory
tags: [math, number-theory, lesson-25]
aliases: [Prime Counting Function, Prime Number Theorem, Bertrand Postulate]
created: 2026-05-15
---

> **Prerequisites**: [[22-mobius-inversion|22. Công Thức Đảo Möbius]], [[23-infinitude-of-primes|23. Vô Hạn Số Nguyên Tố]]
> **Objectives**:
> - Định nghĩa và phân tích ba hàm đếm số nguyên tố $\pi(x)$, $\theta(x)$, $\psi(x)$
> - Nắm các quan hệ giữa ba hàm và lý do chúng tương đương
> - Phát biểu Định Lý Số Nguyên Tố và hiểu ý nghĩa xác suất của nó
> - Chứng minh Bertrand's Postulate qua phân tích hệ số nhị thức trung tâm
> - So sánh xấp xỉ $x/\ln x$ với $\operatorname{li}(x)$ và hiểu sai số

---

## Motivation / Intuition

Biết số nguyên tố vô hạn, câu hỏi tiếp theo là: **có bao nhiêu số nguyên tố $\leq x$?** Đây là một trong những vấn đề trung tâm của lý thuyết số giải tích.

Nhìn vào bảng dữ liệu:

| $x$ | $\pi(x)$ | $x/\ln x$ | Sai số tương đối |
|---|---|---|---|
| $100$ | $25$ | $21.7$ | $13\%$ |
| $1{,}000$ | $168$ | $144.8$ | $14\%$ |
| $10{,}000$ | $1{,}229$ | $1{,}085.7$ | $12\%$ |
| $100{,}000$ | $9{,}592$ | $8{,}685.9$ | $9\%$ |
| $1{,}000{,}000$ | $78{,}498$ | $72{,}382.4$ | $8\%$ |
| $10^{10}$ | $455{,}052{,}511$ | $\approx 434{,}294{,}482$ | $5\%$ |

Rõ ràng $\pi(x) \approx x/\ln x$ với sai số ngày càng giảm. Đây là **Định Lý Số Nguyên Tố**.

---

## Ba Hàm Đếm Số Nguyên Tố

### Hàm $\pi(x)$ — Đếm Số Nguyên Tố

> [!definition] Definition 25.1 — Hàm Đếm Số Nguyên Tố (Prime Counting Function)
> Với $x > 0$ thực:
>
> $$
> \pi(x) = \sum_{\substack{p \leq x \\ p \text{ nguyên tố}}} 1 = |\{p : p \leq x, p \text{ nguyên tố}\}|
> $$

Đây là hàm bậc thang (step function): tăng $1$ tại mỗi số nguyên tố và không đổi ở nơi khác.

### Hàm $\theta(x)$ — Chebyshev Theta

> [!definition] Definition 25.2 — Hàm Theta Chebyshev
> $$
> \theta(x) = \sum_{p \leq x} \ln p
> $$
>
> Đây là logarithm của tích các số nguyên tố $\leq x$: $\theta(x) = \ln\!\left(\prod_{p \leq x} p\right)$.

Hàm $\theta(x)$ trơn hơn $\pi(x)$, thích hợp hơn cho tính toán giải tích.

### Hàm $\psi(x)$ — Chebyshev Psi và Hàm von Mangoldt

> [!definition] Definition 25.3 — Hàm Psi Chebyshev
> $$
> \psi(x) = \sum_{n \leq x} \Lambda(n)
> $$
>
> trong đó $\Lambda(n)$ là **hàm von Mangoldt** (định nghĩa ở bài 22):
>
> $$
> \Lambda(n) = \begin{cases} \ln p & \text{nếu } n = p^k \text{ với } p \text{ nguyên tố và } k \geq 1 \\ 0 & \text{ngược lại} \end{cases}
> $$
>
> Do đó:
>
> $$
> \psi(x) = \sum_{p^k \leq x} \ln p = \sum_{p \leq x} \ln p \cdot \left\lfloor \frac{\ln x}{\ln p} \right\rfloor
> $$

**Ý nghĩa:** $\psi(x)$ đếm tất cả các **lũy thừa số nguyên tố** $\leq x$, mỗi lũy thừa $p^k$ được tính với trọng $\ln p$.

### Quan Hệ Giữa Ba Hàm

> [!theorem] Theorem 25.4 — Biểu Diễn $\theta$ và $\pi$ Qua Nhau
> Với $x \geq 2$:
>
> $$
> \theta(x) = \sum_{p \leq x} \ln p, \qquad \pi(x) = \frac{\theta(x)}{\ln x} + \int_2^x \frac{\theta(t)}{t(\ln t)^2} \, dt
> $$
>
> Công thức thứ hai là **Abel summation** (phép lấy tổng tích phân từng phần).

> [!theorem] Theorem 25.5 — Quan Hệ $\psi$ và $\theta$
> $$
> \psi(x) = \theta(x) + \theta(x^{1/2}) + \theta(x^{1/3}) + \cdots = \sum_{k=1}^{\lfloor \log_2 x \rfloor} \theta(x^{1/k})
> $$
>
> Do đó $\psi(x) - \theta(x) = O(\sqrt{x})$ (sai số chỉ cỡ $\sqrt{x}$, không đáng kể so với bậc $x$).

**Chứng minh Theorem 25.5.** $\psi(x) = \sum_{p^k \leq x} \ln p = \sum_k \sum_{p \leq x^{1/k}} \ln p = \sum_k \theta(x^{1/k})$. Chuỗi hữu hạn vì $x^{1/k} < 2$ khi $k > \log_2 x$, lúc đó $\theta(x^{1/k}) = 0$. $\blacksquare$

### Tương Đương Ba Hàm

> [!theorem] Theorem 25.6 — Ba Hàm Tương Đương
> Ba hàm $\pi(x)$, $\theta(x)$, $\psi(x)$ **tương đương** theo nghĩa: nếu bất kỳ một trong ba hàm thỏa mãn quan hệ tiệm cận $\sim x$ (hay $\sim x/\ln x$ với $\pi$), thì cả ba đều thỏa mãn.
>
> Cụ thể, các điều kiện sau tương đương:
>
> (a) $\pi(x) \sim \dfrac{x}{\ln x}$
>
> (b) $\theta(x) \sim x$
>
> (c) $\psi(x) \sim x$

**Phác thảo.** Từ Abel summation, $\theta(x) \sim x$ kéo theo $\pi(x) \sim x/\ln x$. Từ Theorem 25.5, $\psi(x) \sim \theta(x) \sim x$ vì phần dư $O(\sqrt{x})$ là bậc thấp hơn. Chiều ngược lại tương tự.

---

## Định Lý Số Nguyên Tố (Prime Number Theorem)

> [!theorem] Theorem 25.7 — Định Lý Số Nguyên Tố (Prime Number Theorem — PNT)
> Khi $x \to \infty$:
>
> $$
> \pi(x) \sim \frac{x}{\ln x}
> $$
>
> Nghĩa là $\displaystyle\lim_{x \to \infty} \dfrac{\pi(x)}{x/\ln x} = 1$.
>
> Các dạng tương đương: $\theta(x) \sim x$ và $\psi(x) \sim x$.

**Lịch sử.** PNT được Legendre (1798) và Gauss (1792, ~15 tuổi!) dự đoán qua bảng số. Chứng minh đầu tiên được đưa ra độc lập bởi **Hadamard** và **de la Vallée Poussin** năm **1896**, dùng hàm zeta Riemann trong miền số phức. Chứng minh sơ cấp (không dùng giải tích phức) được Selberg và Erdős tìm ra năm **1949**, nhưng không đơn giản hơn về tinh thần.

### Xấp Xỉ Tốt Hơn: Tích Phân Logarithm

> [!definition] Definition 25.8 — Tích Phân Logarithm (Logarithmic Integral)
> $$
> \operatorname{li}(x) = \int_0^x \frac{dt}{\ln t} \qquad (\text{tích phân suy rộng bỏ qua điểm } t=1)
> $$
>
> Xấp xỉ thực dụng thường dùng:
>
> $$
> \operatorname{Li}(x) = \int_2^x \frac{dt}{\ln t}
> $$

> [!theorem] Theorem 25.9 — PNT với Sai Số
> Xấp xỉ $\operatorname{Li}(x)$ tốt hơn $x/\ln x$ đáng kể:
>
> $$
> \pi(x) = \operatorname{Li}(x) + O\!\left(x e^{-c\sqrt{\ln x}}\right)
> $$
>
> với hằng số $c > 0$. Nếu **Giả thuyết Riemann** đúng, sai số cải thiện thành $O(\sqrt{x} \ln x)$.

**So sánh số liệu tại $x = 10^{10}$:**
- $\pi(10^{10}) = 455{,}052{,}511$
- $10^{10}/\ln(10^{10}) \approx 434{,}294{,}482$ (sai $\approx 4.6\%$)
- $\operatorname{Li}(10^{10}) \approx 455{,}055{,}614$ (sai $\approx 0.0007\%$!)

> [!note] Remark 25.10 — Giả thuyết Riemann
> Giả thuyết Riemann (1859), một trong bảy Bài Toán Thiên Niên Kỷ còn mở, phát biểu rằng mọi **zero không tầm thường** của hàm zeta $\zeta(s)$ đều có phần thực bằng $1/2$. Đây tương đương với cận sai số tốt nhất có thể cho PNT.

### Ý Nghĩa Xác Suất

> [!theorem] Theorem 25.11 — Ý Nghĩa Xác Suất của PNT
> Với $n$ ngẫu nhiên gần $x$, **xác suất $n$ là số nguyên tố** xấp xỉ $\dfrac{1}{\ln x}$.

Ví dụ: một số ngẫu nhiên gần $10^{100}$ là nguyên tố với xác suất khoảng $1/(100 \ln 10) \approx 1/230$.

---

## Các Ước Lượng Sơ Cấp của Chebyshev

Trước khi PNT được chứng minh, Chebyshev (1851) đã thiết lập được cận hai phía:

> [!theorem] Theorem 25.12 — Bất Đẳng Thức Chebyshev
> Tồn tại hằng số $A < 1 < B$ sao cho với mọi $x \geq 2$:
>
> $$
> A \cdot \frac{x}{\ln x} \leq \pi(x) \leq B \cdot \frac{x}{\ln x}
> $$
>
> Chebyshev tìm được $A = \ln 2 \approx 0.693$ và $B = \ln 4 \approx 1.386$ (tức $A \approx 6/5 \cdot \ln(2^{1/2} 3^{1/3} 5^{1/5} / 30^{1/30})$... thực ra $A = 0.92129\ldots, B = 1.10555\ldots$ là giá trị Chebyshev tìm được với phân tích tinh tế hơn).

**Ý nghĩa:** Chebyshev chứng minh $\pi(x)$ đúng bậc $x/\ln x$, dù chưa xác định được hằng số chính xác là $1$.

> [!theorem] Theorem 25.13 — Cận Chebyshev Sơ Cấp qua $\binom{2n}{n}$
> Với mọi $n \geq 1$:
>
> $$
> \prod_{p \leq 2n} p \leq 4^{2n} \qquad \text{tức } e^{\theta(2n)} \leq 4^{2n}
> $$
>
> Suy ra $\theta(x) \leq 2x \ln 2$.

**Chứng minh.** Xét $(1+1)^{2n} = \sum_{k=0}^{2n} \binom{2n}{k} \geq \binom{2n}{n}$. Với số nguyên tố $n < p \leq 2n$, ta có $p \mid \binom{2n}{n}$ (vì $p$ xuất hiện ở tử số $(2n)!$ nhưng không ở mẫu số $n! \cdot n!$). Do đó $\prod_{n < p \leq 2n} p \mid \binom{2n}{n} \leq 4^n$.

Áp dụng đệ quy: $\prod_{p \leq 2n} p = \prod_{p \leq n} p \cdot \prod_{n < p \leq 2n} p \leq 4^{n-1} \cdot 4^n \cdot \ldots$ (phân tích chi tiết trong Appendix A3). $\blacksquare$

---

## Định Lý Mertens (Mertens' Theorems)

Các định lý Mertens (1874) là cầu nối giữa các ước lượng sơ cấp của Chebyshev và Định Lý Số Nguyên Tố. Chúng cho biết chính xác hằng số trong một số tổng và tích trên số nguyên tố — những hằng số không thể suy ra chỉ từ các cận Chebyshev.

> [!theorem] Theorem 25.14 — Mertens' First Theorem
>
> $$
> \sum_{p \leq x} \frac{\ln p}{p} = \ln x + O(1)
> $$
>
> Cụ thể hơn: $\left|\sum_{p \leq x} \frac{\ln p}{p} - \ln x\right| \leq 2$ với mọi $x \geq 1$.

**Ý nghĩa:** Trung bình, $\ln p / p$ hành xử như $1/p$ — nhưng với trọng $\ln p$, ta có tiệm cận chính xác $\ln x$ thay vì $\ln \ln x$.

> [!theorem] Theorem 25.15 — Mertens' Second Theorem
>
> $$
> \sum_{p \leq x} \frac{1}{p} = \ln \ln x + M + o(1)
> $$
>
> trong đó $M \approx 0.2614972128\ldots$ là **hằng số Meissel–Mertens**:
>
> $$
> M = \gamma + \sum_{p}\left[\ln\!\left(1 - \frac{1}{p}\right) + \frac{1}{p}\right]
> $$
>
> với $\gamma \approx 0.5772156649\ldots$ là hằng số Euler–Mascheroni.

**Ý nghĩa:** $\sum 1/p$ phân kỳ (như đã biết từ Euler, bài 23), nhưng phân kỳ **rất chậm** — cỡ $\ln \ln x$. Để tổng đạt $5$, cần $x \approx e^{e^5} \approx 10^{64}$!

> [!theorem] Theorem 25.16 — Mertens' Third Theorem
>
> $$
> \prod_{p \leq x} \left(1 - \frac{1}{p}\right) \sim \frac{e^{-\gamma}}{\ln x}
> $$
>
> trong đó $\gamma$ là hằng số Euler–Mascheroni. Hằng số $e^{-\gamma} \approx 0.5614594835\ldots$

**Ý nghĩa:** Tích $\prod_{p \leq x} (1 - 1/p)$ giảm với tốc độ $1/\ln x$ — chậm hơn nhiều so với trực giác. Định lý này có liên hệ trực tiếp với $\varphi(n)$: xác suất một số $\sim n$ nguyên tố cùng nhau với tất cả số nguyên tố $\leq \sqrt{n}$ xấp xỉ $e^{-\gamma} / \ln \sqrt{n} = 2e^{-\gamma} / \ln n$.

> [!note] Remark 25.17 — Mertens và PNT
> Định Lý Số Nguyên Tố tương đương với mệnh đề $\sum_{p \leq x} \frac{\ln p}{p} = \ln x + C + o(1)$ với $C = -1 - \gamma + \sum_k \sum_p p^{-k}/k$. Các định lý Mertens có thể chứng minh sơ cấp (không cần giải tích phức), trong khi PNT đòi hỏi giải tích phức hoặc chứng minh sơ cấp phức tạp hơn nhiều.

---

## Bertrand's Postulate (Định Lý Bertrand-Chebyshev)

> [!theorem] Theorem 25.18 — Bertrand's Postulate (Bertrand, 1845; Chebyshev, 1852; Erdős, 1932)
> Với mọi số nguyên $n \geq 1$, tồn tại số nguyên tố $p$ sao cho:
>
> $$
> n < p \leq 2n
> $$

Phát biểu cách khác: giữa $n$ và $2n$ luôn có ít nhất một số nguyên tố. Tức là **khoảng cách giữa hai số nguyên tố liên tiếp không bao giờ vượt quá số sau**.

**Chứng minh phác thảo (Erdős 1932).** Xét hệ số nhị thức trung tâm $\binom{2n}{n}$. Ý tưởng: chứng minh rằng $\binom{2n}{n}$ **quá lớn** để được giải thích chỉ bằng các số nguyên tố $\leq n$ — buộc phải có số nguyên tố trong $(n, 2n]$.

**Cận dưới:**

$$
\binom{2n}{n} \geq \frac{4^n}{2n}
$$

(vì $4^n = (1+1)^{2n} = \sum_{k=0}^{2n}\binom{2n}{k}$ và $\binom{2n}{n}$ là hạng tử lớn nhất trong $2n+1$ hạng tử.)

**Phân tích mũ số nguyên tố:** Với số nguyên tố $p$, mũ của $p$ trong $\binom{2n}{n}$ là:

$$
v_p\!\left(\binom{2n}{n}\right) = \sum_{i=1}^{\infty} \left(\left\lfloor \frac{2n}{p^i} \right\rfloor - 2\left\lfloor \frac{n}{p^i} \right\rfloor\right) \leq \left\lfloor \frac{\ln(2n)}{\ln p} \right\rfloor
$$

do mỗi số hạng $\leq 1$ và chuỗi có hữu hạn số hạng khác $0$.

**Loại trừ các số nguyên tố lớn:** Với $p > \sqrt{2n}$, mũ của $p$ trong $\binom{2n}{n}$ là $0$ hoặc $1$. Các số nguyên tố trong $(\frac{2n}{3}, n]$ không xuất hiện trong $\binom{2n}{n}$ (vì $2p > \frac{4n}{3} > n$, nên $\lfloor 2n/p \rfloor = 2$ và $\lfloor n/p \rfloor = 1$, đóng góp $0$).

Nếu không có số nguyên tố trong $(n, 2n]$:

$$
\binom{2n}{n} \leq \prod_{p \leq 2n/3} p^{\lfloor \log_{p}(2n) \rfloor} \cdot \prod_{\sqrt{2n} < p \leq n} p
$$

Các ước lượng chi tiết (xem Appendix A3) cho thấy tích này $< 4^n/(2n)$ với $n$ đủ lớn — mâu thuẫn với cận dưới. Với $n$ nhỏ ($n \leq 25$), kiểm tra trực tiếp. $\blacksquare$

> [!note] Remark 25.19 — Hệ quả
> Bertrand's Postulate ngụ ý: với số nguyên tố thứ $k$ là $p_k$, thì $p_{k+1} < 2p_k$. Nó cũng ngụ ý $\pi(2n) \geq \pi(n) + 1$, tức $\pi$ tăng ít nhất $1$ mỗi khi nhân đôi cận.

### Refinements: Tinh Chỉnh Bertrand

Bertrand's Postulate có nhiều tinh chỉnh mạnh hơn:

| Tác giả | Kết quả | Năm |
|---|---|---|
| Bertrand/Chebyshev | $\exists p: n < p \leq 2n$ | 1845/1852 |
| Nagura | $\exists p: n < p \leq \frac{6n}{5}$ với $n \geq 25$ | 1952 |
| Baker–Harman–Pintz | $\exists p: n < p \leq n + n^{0.525}$ với $n$ lớn | 2001 |
| PNT | $\pi(2n) - \pi(n) \sim \frac{n}{\ln n}$ (nhiều hơn nhiều) | 1896 |

---

## Về Giả Thuyết Riemann và Phân Phối Số Nguyên Tố

Mối liên hệ giữa phân phối số nguyên tố và hàm zeta Riemann là nội dung trung tâm của lý thuyết số giải tích:

$$
\pi(x) = \operatorname{Li}(x) - \sum_{\rho} \operatorname{Li}(x^\rho) + \text{(số hạng nhỏ)}
$$

trong đó tổng chạy qua các **zero** $\rho$ của $\zeta(s)$ trong dải $0 < \operatorname{Re}(s) < 1$. Giả Thuyết Riemann phát biểu tất cả $\rho$ đều có $\operatorname{Re}(\rho) = 1/2$.

---

## SageMath

```python
from sage.all import primes, prime_pi, nth_prime, log, li, is_prime_power

# Ba hàm đếm số nguyên tố
def theta(x):
    """Chebyshev theta: sum of log(p) for p <= x."""
    return sum(float(log(p)) for p in primes(int(x) + 1))

def psi(x):
    """Chebyshev psi: sum of Lambda(n) for n <= x (efficient)."""
    total = 0.0
    for p in primes(int(x) + 1):
        pk = p
        while pk <= x:
            total += float(log(p))
            pk *= p
    return total

# So sánh pi(x), theta(x)/ln(x), x/ln(x)
import math
for x in [100, 1000, 10000, 100000]:
    pi_x = prime_pi(x)
    th_x = theta(x)
    approx1 = x / math.log(x)
    approx2 = th_x / math.log(x)
    print(f"x={x:7d}: pi(x)={pi_x:5d}, x/ln(x)={approx1:6.1f}, "
          f"theta(x)/ln(x)={approx2:6.1f}")

# Hàm logarithm integral Li(x)
def Li(x):
    """Approximation of logarithmic integral."""
    from sage.all import numerical_integral
    if x <= 2:
        return 0.0
    result, _ = numerical_integral(lambda t: 1/log(t), 2, x)
    return result

# So sánh các xấp xỉ
for x in [1000, 10000, 100000, 1000000]:
    pi_x = prime_pi(x)
    approx_simple = x / math.log(x)
    approx_li = Li(x)
    err_simple = abs(pi_x - approx_simple) / pi_x * 100
    err_li = abs(pi_x - approx_li) / pi_x * 100
    print(f"x={x}: pi={pi_x}, x/lnx≈{approx_simple:.1f}({err_simple:.1f}%), "
          f"Li≈{approx_li:.1f}({err_li:.2f}%)")

# Mertens' Theorems — kiểm chứng số
print("\n=== Mertens' Theorems ===")
euler_gamma = 0.5772156649015329
M_const = 0.2614972128476428  # Meissel-Mertens constant

for x in [100, 1000, 10000, 100000]:
    p_list = list(primes(int(x) + 1))
    sum_lnp_over_p = sum(float(log(p))/p for p in p_list)
    sum_1_over_p = sum(1.0/p for p in p_list)
    prod_term = 1.0
    for p in p_list:
        prod_term *= (1.0 - 1.0/p)
    
    print(f"x={x:6d}: sum ln(p)/p = {sum_lnp_over_p:.4f} (ln x = {math.log(x):.4f})")
    print(f"       : sum 1/p     = {sum_1_over_p:.4f} (lnln x + M = {math.log(math.log(x)) + M_const:.4f})")
    print(f"       : prod(1-1/p) = {prod_term:.6f} (e^-g/ln x = {math.exp(-euler_gamma)/math.log(x):.6f})")

# Bertrand's Postulate: kiểm tra
def verify_bertrand(n_max):
    """Kiểm tra Bertrand cho n = 1 đến n_max."""
    from sage.all import is_prime
    for n in range(1, n_max + 1):
        found = any(is_prime(k) for k in range(n + 1, 2*n + 1))
        if not found:
            print(f"BERTRAND FAILS at n={n}!")
            return False
    print(f"\nBertrand's Postulate verified for all n <= {n_max}")
    return True

verify_bertrand(1000)

# Phân tích binom(2n, n) và số nguyên tố trong (n, 2n]
from sage.all import binomial
for n in [10, 20, 50]:
    binom = binomial(2*n, n)
    primes_in_range = [p for p in primes(n + 1, 2*n + 1)]
    print(f"n={n}: C(2n,n)={binom}, số nguyên tố trong ({n},{2*n}]: {primes_in_range}")
```

---

## Tóm Tắt

**Ba hàm đếm:**
- $\pi(x)$: đếm số nguyên tố $\leq x$, hàm bậc thang
- $\theta(x) = \sum_{p \leq x} \ln p$: logarithm tích các số nguyên tố
- $\psi(x) = \sum_{n \leq x} \Lambda(n)$: tổng von Mangoldt, đếm lũy thừa nguyên tố

Ba hàm **tương đương** trong nghĩa tiệm cận: $\pi(x) \sim x/\ln x \iff \theta(x) \sim x \iff \psi(x) \sim x$.

**Định Lý Số Nguyên Tố (Hadamard, de la Vallée Poussin, 1896):**

$$
\pi(x) \sim \frac{x}{\ln x}
$$

Xấp xỉ tốt hơn là $\operatorname{Li}(x) = \int_2^x dt/\ln t$, với sai số $O(x e^{-c\sqrt{\ln x}})$.

**Các Định Lý Mertens (1874):**
- $\sum_{p \leq x} \frac{\ln p}{p} = \ln x + O(1)$ — trung bình có trọng của $1/p$
- $\sum_{p \leq x} \frac{1}{p} = \ln \ln x + M + o(1)$ — tổng nghịch đảo phân kỳ rất chậm
- $\prod_{p \leq x} (1 - \frac{1}{p}) \sim \frac{e^{-\gamma}}{\ln x}$ — tích giảm với tốc độ $1/\ln x$

**Bertrand's Postulate:** Với mọi $n \geq 1$, luôn tồn tại số nguyên tố $p$ với $n < p \leq 2n$. Chứng minh Erdős dựa trên phân tích $\binom{2n}{n}$: nếu không có số nguyên tố trong $(n, 2n]$, tích này sẽ quá nhỏ so với cận dưới $4^n/(2n)$. Chứng minh đầy đủ ở [[a3-proof-of-bertrand-postulate|A3. Bertrand's Postulate — Chứng Minh Chebyshev]].
