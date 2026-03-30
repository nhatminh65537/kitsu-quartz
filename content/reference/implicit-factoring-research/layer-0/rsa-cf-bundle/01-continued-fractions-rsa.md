---
title: "01. Continued Fractions & Legendre's Theorem trong RSA"
type: math-component
tags: [rsa-cryptanalysis, continued-fractions, legendre, math-component, lesson-01]
aliases: [Continued Fractions RSA, Phân số liên tục RSA]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: RSA cơ bản ($ed \equiv 1 \pmod{\varphi(N)}$, khóa công khai $(N, e)$, khóa bí mật $d$)  
> 🔴 **Prerequisite references**: Hardy & Wright — *An Introduction to the Theory of Numbers* [HW95] (lý thuyết phân số liên tục nền tảng)  
> **Lesson type**: Math Component  
> **Covers**: §2.1 (định nghĩa, Euler-Wallis, Theorem 1, relation (2)), §3.1 (Lemma 6)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\xi$ | Số thực cần khai triển thành phân số liên tục |
> | $[a_0, a_1, a_2, \ldots]$ | Khai triển phân số liên tục của $\xi$ |
> | $a_i$ | Partial quotient thứ $i$ |
> | $p_n / q_n$ | Convergent thứ $n$ của $\xi$ |
> | $N = pq$ | RSA modulus với $q < p < 2q$ |
> | $e$ | Public exponent, $\gcd(e, \varphi(N)) = 1$ |
> | $d$ | Private exponent, $ed \equiv 1 \pmod{\varphi(N)}$ |
> | $k$ | Số nguyên dương sao cho $ed - k\varphi(N) = 1$ |
> | $\varphi(N)$ | Euler's totient, $\varphi(N) = (p-1)(q-1)$ |

---

## Tại Sao Cần Phân Số Liên Tục?

Tấn công Wiener 1990 — tấn công đầu tiên khai thác private exponent nhỏ trong RSA — hoạt động bằng một ý tưởng đơn giản đến mức thanh lịch: nếu $d$ đủ nhỏ, thì phân số $k/d$ (xuất phát từ phương trình khóa $ed - k\varphi(N) = 1$) **sẽ xuất hiện trong danh sách convergents** của $e/N$, và danh sách này có thể tính trong thời gian đa thức. Từ $k/d$, khôi phục $d$ là tầm thường.

Bài học này xây dựng toàn bộ cơ sở toán học cho cơ chế này: khai triển phân số liên tục, cách tính convergents qua công thức Euler-Wallis, tiêu chuẩn Legendre để nhận diện convergent, và quan hệ đại số quan trọng (relation (2)) mà paper dùng làm nền tảng cho main attack ở Lesson 05.

---

## Phân Số Liên Tục (Continued Fractions)

> [!note] Định nghĩa 1.1 — Continued Fraction Expansion
> Cho $\xi \in \mathbb{R} \setminus \{0\}$. **Khai triển phân số liên tục** (continued fraction expansion) của $\xi$ là biểu diễn:
>
> $$
> \xi = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3 + \cdots}}}
> $$
>
> ký hiệu gọn là $\xi = [a_0, a_1, a_2, a_3, \ldots]$, trong đó:
> - $a_0 = \lfloor \xi \rfloor \in \mathbb{Z}$
> - $a_1, a_2, \ldots$ là các số nguyên dương, gọi là **partial quotients**
>
> **Công thức đệ quy** để tính partial quotients:
>
> $$
> x_0 = \xi, \quad a_i = \lfloor x_i \rfloor, \quad x_{i+1} = \frac{1}{x_i - a_i}, \quad i \geq 0
> $$
>
> Quá trình dừng khi $x_i - a_i = 0$ (với số hữu tỉ) hoặc tiếp tục vô hạn (với số vô tỉ).

> [!example] Ví dụ 1.2 — Khai triển $e/N$ trong RSA
> Giả sử $e = 17, N = 77$ (ví dụ đồ chơi). Khi đó:
>
> $$
> \frac{17}{77} = 0 + \cfrac{1}{4 + \cfrac{1}{1 + \cfrac{1}{2 + \cdots}}}
> $$
>
> Vì $\lfloor 17/77 \rfloor = 0$, $x_1 = 77/17 \approx 4.52$, $a_1 = 4$, $x_2 = 1/(4.52 - 4) = 1/0.52 \approx 1.88$, v.v.
> Kết quả: $17/77 = [0, 4, 1, 2, 2]$.

---

## Convergents và Công Thức Euler-Wallis

> [!note] Định nghĩa 1.3 — Convergents
> **Convergent thứ $n$** của $\xi$ là số hữu tỉ:
>
> $$
> \frac{p_n}{q_n} = [a_0, a_1, \ldots, a_n]
> $$
>
> Chuỗi $p_0/q_0, p_1/q_1, p_2/q_2, \ldots$ gọi là **chuỗi convergents** của $\xi$.

> [!abstract] Theorem 1.4 — Euler-Wallis Recurrence
> Các numerator $p_n$ và denominator $q_n$ của convergents thỏa mãn công thức đệ quy:
>
> $$
> \begin{aligned}
> p_0 &= a_0, \quad p_1 = a_0 a_1 + 1, \quad p_n = a_n p_{n-1} + p_{n-2} \quad (n \geq 2) \\
> q_0 &= 1,\phantom{aaa} \quad q_1 = a_1,\phantom{aaaaaa} \quad q_n = a_n q_{n-1} + q_{n-2} \quad (n \geq 2)
> \end{aligned}
> $$
>
> **Hệ quả quan trọng** (chứng minh bằng induction):
>
> $$
> p_n q_{n-1} - p_{n-1} q_n = (-1)^{n+1}
> $$

**Proof.** Base case: $p_0 q_{-1} - p_{-1} q_0$, với convention $p_{-1} = 1, q_{-1} = 0$, cho $(-1)^1 = -1$. ✓  
Inductive step: giả sử đúng tại $n-1$. Khi đó:

$$
p_n q_{n-1} - p_{n-1} q_n = (a_n p_{n-1} + p_{n-2}) q_{n-1} - p_{n-1}(a_n q_{n-1} + q_{n-2})
= p_{n-2} q_{n-1} - p_{n-1} q_{n-2} = -(-1)^n = (-1)^{n+1}
$$

$\blacksquare$

Hệ quả này cực kỳ quan trọng vì nó đảm bảo $\gcd(p_n, q_n) = 1$ — mọi convergent đều là phân số tối giản.

> [!abstract] Theorem 1.5 — Bất Đẳng Thức Xen Kẽ (Interleaving Inequality)
> Các convergents xen kẽ nhau so với giá trị thực $\xi$:
>
> $$
> \frac{p_0}{q_0} < \frac{p_2}{q_2} < \cdots < \xi < \cdots < \frac{p_3}{q_3} < \frac{p_1}{q_1}
> $$
>
> Hơn nữa, $|p_n/q_n - \xi|$ giảm đơn điệu, và convergents là **xấp xỉ tốt nhất** cho $\xi$ trong nghĩa: không có phân số $a/b$ với $b \leq q_n$ nào xấp xỉ $\xi$ tốt hơn $p_n/q_n$.

---

## Quan Hệ Biểu Diễn (Relation (2))

Đây là thành phần toán học then chốt mà paper xây dựng riêng — là nền tảng cho toàn bộ main attack ở Theorem 6.

> [!abstract] Theorem 1.6 — Unique Representation via Consecutive Convergents
> Cho bất kỳ số nguyên $k$ và $d$, và cho $p_{r-1}/q_{r-1}$, $p_r/q_r$ là hai convergent **liên tiếp** của $\xi$. Khi đó tồn tại duy nhất cặp số nguyên $(u, v)$ sao cho:
>
> $$
> \begin{cases} k = u \cdot p_r + v \cdot p_{r-1} \\ d = u \cdot q_r + v \cdot q_{r-1} \end{cases}
> $$
>
> với nghiệm tường minh:
>
> $$
> u = \frac{k q_{r-1} - d p_{r-1}}{p_r q_{r-1} - q_r p_{r-1}}, \qquad v = \frac{d p_r - k q_r}{p_r q_{r-1} - q_r p_{r-1}}
> $$
>
> Mẫu số $p_r q_{r-1} - q_r p_{r-1} = (-1)^{r+1}$ (theo Theorem 1.4), nên $u, v$ luôn là số nguyên.

**Proof.** Hệ tuyến tính 2 phương trình 2 ẩn $(u, v)$. Ma trận hệ số là $\begin{pmatrix} p_r & p_{r-1} \\ q_r & q_{r-1} \end{pmatrix}$ với định thức $(-1)^{r+1} \neq 0$. Cramer's rule cho nghiệm duy nhất; Theorem 1.4 đảm bảo mẫu số $= \pm 1$ nên $u, v \in \mathbb{Z}$. $\blacksquare$

> [!tip] 💡 Agent note
> Relation (2) là điểm khởi đầu của Theorem 6 (main attack). Thay vì tìm trực tiếp $(k, d)$, paper tìm $(u, v)$ — các hệ số trong biểu diễn $(k, d)$ qua hai convergent liên tiếp $(p_{r-1}/q_{r-1}, p_r/q_r)$ của $e/N$. Nếu $|u|, |v|$ nhỏ (bounded bởi $N^\delta$ với $\delta$ nhỏ), bài toán trở nên tractable hơn nhiều so với tìm $d$ trực tiếp trong khoảng $[1, N]$.

---

## Tiêu Chuẩn Legendre

> [!abstract] Theorem 1.7 — Legendre's Criterion (Theorem 1 trong paper)
> Cho $\xi \in \mathbb{R}$ và $a, b \in \mathbb{Z}$ với $\gcd(a, b) = 1$. Nếu:
>
> $$
> \left| \xi - \frac{a}{b} \right| < \frac{1}{2b^2}
> $$
>
> thì $a/b$ là một convergent của $\xi$.

**Proof sketch** (theo [Legendre 1798], xem [HW95, Theorem 184]): Giả sử $a/b$ không phải convergent. Thì tồn tại convergent $p_n/q_n$ với $q_n \leq b$ xấp xỉ $\xi$ tốt hơn: $|\xi - p_n/q_n| \leq |\xi - a/b| < 1/(2b^2) \leq 1/(2q_n b)$. Điều này dẫn đến $|a q_n - b p_n| < 1/2$, tức là $a q_n = b p_n$, mâu thuẫn với $\gcd(a,b) = \gcd(p_n,q_n) = 1$ và $q_n \leq b$. $\blacksquare$

> [!info] 🟡 Nguồn gốc lịch sử
> Tiêu chuẩn này xuất phát từ *Essai sur la Théorie des Nombres* của Legendre (1798) — một trong những kết quả cổ điển nhất về xấp xỉ Diophantine. Paper của Wiener (1990) áp dụng trực tiếp định lý này vào RSA, và paper Zheng et al. xây dựng lên từ đây.  
> *(theo [Legendre 1798]; trình bày hiện đại trong [HW95])*

---

## Áp Dụng vào RSA: Lemma 6

Từ phương trình khóa RSA $ed - k\varphi(N) = 1$, ta rút ra khi nào $k/d$ (hoặc $e-k/\varphi(N)-d$) là convergent của $e/\varphi(N)$.

> [!abstract] Lemma 1.8 — Lemma 6 trong paper (Nitaj et al. 2014)
> Cho $N = pq$ với $\varphi(N) = (p-1)(q-1)$. Cho $e$ là public exponent và $d$ thỏa $ed \equiv 1 \pmod{\varphi(N)}$ với $ed - k\varphi(N) = 1$. Khi đó:
>
> - Nếu $d < \frac{1}{2}\varphi(N)$: thì $k/d$ là convergent của $e/\varphi(N)$.
> - Nếu $\frac{1}{2}\varphi(N) < d < \varphi(N)$: thì $(e-k)/(\varphi(N)-d)$ là convergent của $e/\varphi(N)$.

**Proof.** 

*Trường hợp 1*: $d < \frac{1}{2}\varphi(N)$. Từ $ed - k\varphi(N) = 1$:

$$
\left| \frac{e}{\varphi(N)} - \frac{k}{d} \right| = \frac{1}{d \cdot \varphi(N)} < \frac{1}{2d^2}
$$

(vì $\varphi(N) > 2d$). Theo Theorem 1.7 (Legendre), $k/d$ là convergent của $e/\varphi(N)$. $\square$

*Trường hợp 2*: $\frac{1}{2}\varphi(N) < d < \varphi(N)$. Khi đó $\varphi(N) - d < \frac{1}{2}\varphi(N)$. Từ phương trình $e(\varphi(N) - d) - \varphi(N)(e-k) = -1$, suy ra $\gcd(e-k, \varphi(N)-d) = 1$. Hơn nữa:

$$
\left| \frac{e}{\varphi(N)} - \frac{e-k}{\varphi(N)-d} \right| = \frac{1}{\varphi(N)(\varphi(N)-d)} < \frac{1}{2(\varphi(N)-d)^2}
$$

Áp dụng Legendre, $(e-k)/(\varphi(N)-d)$ là convergent của $e/\varphi(N)$. $\blacksquare$

> [!info] 🟡 Attribution
> Lemma 1.8 (Lemma 6 trong paper) được trích từ [Nitaj et al. 2014, §2]. Paper Zheng et al. sử dụng trực tiếp kết quả này.

> [!warning] Hạn chế của Lemma 1.8
> Lemma 1.8 cho biết $k/d$ là convergent của $e/\varphi(N)$ — nhưng ta **không biết** $\varphi(N)$ trực tiếp từ public key. Ta chỉ biết $N$. Bước tiếp theo (Lesson 03) phân tích khi nào $k/d$ đồng thời là convergent của cả $e/N$ và $e/\varphi(N)$ — nếu vậy ta có thể tìm nó từ $e/N$.

---

## Tóm Tắt

- Phân số liên tục $\xi = [a_0, a_1, \ldots]$ tạo ra chuỗi xấp xỉ hữu tỉ **convergents** $p_n/q_n$.
- **Euler-Wallis**: convergents tính đệ quy; $p_n q_{n-1} - p_{n-1} q_n = (-1)^{n+1}$.
- **Relation (2)**: mọi cặp $(k, d)$ biểu diễn duy nhất qua hai convergent liên tiếp $(p_r, q_r)$ và $(p_{r-1}, q_{r-1})$ với hệ số nguyên $(u, v)$.
- **Legendre**: nếu $|\xi - a/b| < 1/(2b^2)$ thì $a/b$ là convergent — tiêu chuẩn nhận diện convergent từ xấp xỉ tốt.
- **Lemma 6**: trong RSA, $k/d$ là convergent của $e/\varphi(N)$ khi $d < \varphi(N)/2$.
- Nền tảng này được dùng ở Lesson 03 (phân tích Wiener) và Lesson 05 (main attack).

---

## References

- [Legendre 1798] Legendre — *Essai sur la Théorie des Nombres*, Duprat, Paris (🟡 Theorem 1.7)
- [HW95] Hardy, Wright — *An Introduction to the Theory of Numbers*, Oxford University Press, 1995 (🔴 Prerequisite)
- [Nitaj et al. 2014] Nitaj, Ariffin, Nassr, Bahig — *New Attacks on the RSA Cryptosystem*, AFRICACRYPT 2014 (🟡 Lemma 1.8)
- [Wiener90] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory, 1990 (⚪ original Wiener attack)
