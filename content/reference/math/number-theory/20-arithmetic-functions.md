---
title: "20. Hàm Số Học và Tính Nhân Tính"
type: foundation
tags: [math, number-theory, lesson-20]
aliases: [Arithmetic Functions, Multiplicative Functions]
created: 2026-05-15
---

> **Prerequisites**: [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]], [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]]
> **Objectives**:
> - Hiểu định nghĩa hàm số học và phân loại: hoàn toàn nhân tính vs nhân tính
> - Nắm vững các hàm cổ điển $\tau$, $\sigma_k$, $\varphi$, $\mu$, $\Lambda$ và tính toán chúng trên lũy thừa nguyên tố
> - Chứng minh định lý: tổng trên ước của hàm nhân tính lại là hàm nhân tính
> - Thiết lập công thức tính $\tau(n)$, $\sigma(n)$ và $\varphi(n)$ từ phân tích nguyên tố
> - Hiểu hệ thức $\sum_{d \mid n} \varphi(d) = n$ từ góc độ hàm số học

---

## Motivation / Intuition

Trong toán học, nhiều đại lượng quan trọng phụ thuộc vào cấu trúc nguyên tố của $n$: số ước, tổng ước, số phần tử nguyên tố cùng nhau, v.v. Tất cả những đại lượng này đều là **hàm số học** (arithmetic function) — ánh xạ từ số nguyên dương vào số thực hay số phức.

Điều kỳ diệu là nhiều hàm trong số đó có tính **nhân tính** (multiplicativity): nếu $\gcd(m, n) = 1$ thì $f(mn) = f(m)f(n)$. Tính chất này cực kỳ mạnh vì nó cho phép **tính hoàn toàn dựa trên lũy thừa nguyên tố** — nhờ Định Lý Cơ Bản Số Học, ta chỉ cần biết $f(p^k)$ là suy ra $f$ trên mọi số tự nhiên.

Mô-đun này xây dựng bộ công cụ hàm số học cốt lõi — nền tảng của Lý Thuyết Số Giải Tích (Analytic Number Theory) và là ngôn ngữ để phát biểu các định lý sâu về số nguyên tố.

---

## Hàm Số Học (Arithmetic Function)

### Định Nghĩa

> [!definition] Definition 20.1 — Hàm Số Học (Arithmetic Function)
> Một **hàm số học** là một hàm
>
> $$
> f : \mathbb{Z}^+ \to \mathbb{C}
> $$
>
> xác định trên mọi số nguyên dương, nhận giá trị trong $\mathbb{C}$ (thường là $\mathbb{Z}$ hoặc $\mathbb{R}$).

> [!note] Remark 20.2 — Không yêu cầu tính liên tục
> Khác với hàm giải tích thông thường, hàm số học **không** yêu cầu bất kỳ tính liên tục hay trơn nào. Tập định nghĩa là $\mathbb{Z}^+ = \{1, 2, 3, \ldots\}$, rời rạc hoàn toàn.

### Phân Loại: Tính Nhân Tính

> [!definition] Definition 20.3 — Hàm Nhân Tính (Multiplicative Function)
> Hàm số học $f$ (không đồng nhất bằng $0$) được gọi là **nhân tính** (multiplicative) nếu:
>
> $$
> \gcd(m, n) = 1 \implies f(mn) = f(m) \cdot f(n)
> $$
>
> Hàm $f$ được gọi là **hoàn toàn nhân tính** (completely multiplicative) nếu điều kiện trên đúng với **mọi** $m, n \in \mathbb{Z}^+$, không cần giả thiết nguyên tố cùng nhau.

> [!theorem] Theorem 20.4 — Giá trị tại 1 của hàm nhân tính
> Nếu $f$ nhân tính thì $f(1) = 1$.

**Proof.**
Lấy bất kỳ $n$ với $f(n) \neq 0$ (tồn tại vì $f$ không đồng nhất $0$). Áp dụng định nghĩa với $\gcd(n, 1) = 1$:

$$
f(n \cdot 1) = f(n) \cdot f(1) \implies f(n) = f(n) \cdot f(1)
$$

Vì $f(n) \neq 0$, chia cả hai vế: $f(1) = 1$. $\blacksquare$

> [!theorem] Theorem 20.5 — Hàm nhân tính xác định bởi lũy thừa nguyên tố
> Nếu $f$ nhân tính và $n = p_1^{a_1} p_2^{a_2} \cdots p_k^{a_k}$ (phân tích nguyên tố) thì:
>
> $$
> f(n) = f(p_1^{a_1}) \cdot f(p_2^{a_2}) \cdots f(p_k^{a_k})
> $$

**Proof.**
Áp dụng định nghĩa tính nhân tính lặp đi lặp lại: các cặp $p_i^{a_i}$ và $p_j^{a_j}$ với $i \neq j$ có $\gcd(p_i^{a_i}, p_j^{a_j}) = 1$, do đó ta tách tích ra từng thừa số nguyên tố một. $\blacksquare$

> [!warning] Counterexample 20.6 — Sự khác biệt giữa nhân tính và hoàn toàn nhân tính
> Hàm $\varphi$ (Euler totient) là nhân tính **nhưng không** hoàn toàn nhân tính.
> Ví dụ: $\varphi(4) = 2$, nhưng $\varphi(2)\cdot\varphi(2) = 1 \cdot 1 = 1 \neq 2$.
>
> Trong khi đó, hàm $f(n) = n$ là hoàn toàn nhân tính: $mn = m \cdot n$ với mọi $m, n$.

---

## Các Hàm Số Học Cổ Điển

### Hàm Đếm Ước $\tau$ (hay $d$)

> [!definition] Definition 20.7 — Hàm Đếm Ước (Divisor Counting Function)
> Với $n \in \mathbb{Z}^+$, định nghĩa:
>
> $$
> \tau(n) = \sum_{d \mid n} 1 = \left|\{d \in \mathbb{Z}^+ : d \mid n\}\right|
> $$
>
> $\tau(n)$ là số ước dương của $n$. Ký hiệu $d(n)$ cũng thường được dùng.

> [!example] Example 20.8 — Tính $\tau$
>
> $\tau(1) = 1$: chỉ có ước là $1$.
>
> $\tau(6) = 4$: ước là $\{1, 2, 3, 6\}$.
>
> $\tau(12) = 6$: ước là $\{1, 2, 3, 4, 6, 12\}$.
>
> $\tau(p) = 2$ với $p$ nguyên tố: chỉ có $1$ và $p$.

> [!theorem] Theorem 20.9 — Công thức $\tau$ từ phân tích nguyên tố
> Nếu $n = p_1^{a_1} p_2^{a_2} \cdots p_k^{a_k}$ thì:
>
> $$
> \tau(n) = (a_1 + 1)(a_2 + 1) \cdots (a_k + 1)
> $$
>
> Hơn nữa, $\tau$ là hàm **nhân tính** (nhưng không hoàn toàn nhân tính).

**Proof.**
Mọi ước $d$ của $n = p_1^{a_1} \cdots p_k^{a_k}$ có dạng $d = p_1^{b_1} \cdots p_k^{b_k}$ với $0 \leq b_i \leq a_i$. Mỗi $b_i$ chọn độc lập trong $\{0, 1, \ldots, a_i\}$ (có $a_i + 1$ lựa chọn), nên tổng số ước là tích $(a_1+1)(a_2+1)\cdots(a_k+1)$.

Tính nhân tính: nếu $\gcd(m,n)=1$ thì mọi ước của $mn$ viết duy nhất thành tích ước của $m$ nhân ước của $n$, nên $\tau(mn) = \tau(m)\tau(n)$. $\blacksquare$

> [!warning] Counterexample 20.10 — $\tau$ không hoàn toàn nhân tính
> $\tau(4) = 3$, nhưng $\tau(2)\tau(2) = 2 \cdot 2 = 4 \neq 3$.

> [!example] Example 20.11 — Tính $\tau(360)$
>
> $360 = 2^3 \cdot 3^2 \cdot 5^1$
>
> $$
> \tau(360) = (3+1)(2+1)(1+1) = 4 \cdot 3 \cdot 2 = 24
> $$

### Hàm Tổng Ước $\sigma_k$

> [!definition] Definition 20.12 — Hàm Tổng Lũy Thừa Ước (Sum of Divisor Powers)
> Với $k \geq 0$ nguyên, định nghĩa:
>
> $$
> \sigma_k(n) = \sum_{d \mid n} d^k
> $$
>
> Hai trường hợp đặc biệt quan trọng:
> - $\sigma_0(n) = \tau(n)$ (đếm số ước)
> - $\sigma_1(n) = \sigma(n)$ (tổng các ước — thường viết $\sigma(n)$)

> [!example] Example 20.13 — Tính $\sigma(12)$
>
> Ước của $12$: $\{1, 2, 3, 4, 6, 12\}$
>
> $$
> \sigma(12) = 1 + 2 + 3 + 4 + 6 + 12 = 28
> $$

> [!theorem] Theorem 20.14 — Công thức $\sigma_k$ từ phân tích nguyên tố
> Nếu $n = p_1^{a_1} \cdots p_r^{a_r}$ thì với mọi $k \geq 1$:
>
> $$
> \sigma_k(n) = \prod_{i=1}^{r} \frac{p_i^{k(a_i+1)} - 1}{p_i^k - 1} = \prod_{i=1}^{r} \left(1 + p_i^k + p_i^{2k} + \cdots + p_i^{a_i k}\right)
> $$
>
> Trường hợp $k = 0$: $\sigma_0(n) = \tau(n) = \prod(a_i + 1)$.
>
> $\sigma_k$ là hàm nhân tính với mọi $k \geq 0$.

**Proof.**
Do $\sigma_k$ nhân tính (chứng minh tương tự $\tau$), ta chỉ cần tính trên lũy thừa nguyên tố. Với $n = p^a$, các ước là $1, p, p^2, \ldots, p^a$, nên:

$$
\sigma_k(p^a) = 1^k + p^k + p^{2k} + \cdots + p^{ak} = \frac{p^{k(a+1)} - 1}{p^k - 1}
$$

(tổng cấp số nhân với công bội $p^k$). Áp dụng tính nhân tính cho tích tổng quát. $\blacksquare$

> [!example] Example 20.15 — Tính $\sigma(360)$
>
> $360 = 2^3 \cdot 3^2 \cdot 5^1$
>
> $$
> \sigma(360) = \sigma(2^3)\cdot\sigma(3^2)\cdot\sigma(5^1)
> $$
>
> $$
> = (1+2+4+8)(1+3+9)(1+5) = 15 \cdot 13 \cdot 6 = 1170
> $$

### Số Hoàn Hảo và $\sigma$

> [!definition] Definition 20.16 — Số Hoàn Hảo (Perfect Number)
> $n$ là **số hoàn hảo** nếu $\sigma(n) = 2n$, tức là tổng tất cả ước đúng bằng hai lần chính nó (hay tổng ước thực sự — trừ $n$ — bằng $n$).

> [!theorem] Theorem 20.17 — Số hoàn hảo chẵn (Euclid–Euler)
> $n$ là số hoàn hảo chẵn khi và chỉ khi $n = 2^{p-1}(2^p - 1)$ trong đó $2^p - 1$ là số nguyên tố (số nguyên tố Mersenne).

**Proof sketch.**
($\Leftarrow$) Gọi $q = 2^p - 1$ nguyên tố, $n = 2^{p-1}q$. Vì $\gcd(2^{p-1}, q) = 1$:

$$
\sigma(n) = \sigma(2^{p-1})\sigma(q) = (2^p - 1)(q+1) = (2^p - 1) \cdot 2^p = 2n \checkmark
$$

($\Rightarrow$) Euler chứng minh mọi số hoàn hảo chẵn đều có dạng này — chi tiết xem Niven–Zuckerman–Montgomery, Chapter 6. $\blacksquare$

> [!example] Example 20.18 — Vài số hoàn hảo đầu tiên
>
> $p=2$: $2^1(2^2-1) = 2 \cdot 3 = 6 = \sigma(6)/2$? $\sigma(6) = 12 = 2 \cdot 6$ ✓
>
> $p=3$: $2^2 \cdot 7 = 28$. $\sigma(28) = 56 = 2 \cdot 28$ ✓
>
> $p=5$: $2^4 \cdot 31 = 496$. $\sigma(496) = 992 = 2 \cdot 496$ ✓
>
> $p=7$: $2^6 \cdot 127 = 8128$ ✓

### Hàm Hằng và Hàm Đồng Nhất

> [!definition] Definition 20.19 — Các Hàm Đặc Biệt
> Định nghĩa các hàm số học chuẩn sau:
>
> - **Hàm đơn vị** (unit function): $\varepsilon(n) = \begin{cases} 1 & n = 1 \\ 0 & n > 1 \end{cases}$
>
> - **Hàm hằng 1**: $\mathbf{1}(n) = 1$ với mọi $n$
>
> - **Hàm đồng nhất** (identity): $\operatorname{id}(n) = n$
>
> - **Hàm lũy thừa**: $\operatorname{id}_k(n) = n^k$ với $k \geq 0$ cố định
>
> Tất cả đều là hàm hoàn toàn nhân tính. Hàm $\varepsilon$ là **phần tử đơn vị** đối với tích chập Dirichlet (sẽ học ở bài 21).

---

## Hàm Möbius $\mu$

### Định Nghĩa

> [!definition] Definition 20.20 — Hàm Möbius (Möbius Function)
> Định nghĩa $\mu : \mathbb{Z}^+ \to \{-1, 0, 1\}$ bởi:
>
> $$
> \mu(n) = \begin{cases}
> 1 & \text{nếu } n = 1 \\
> (-1)^k & \text{nếu } n = p_1 p_2 \cdots p_k \text{ (tích } k \text{ số nguyên tố phân biệt)} \\
> 0 & \text{nếu } n \text{ có ước chính phương } > 1 \ (\text{tức là } p^2 \mid n \text{ cho một số nguyên tố } p)
> \end{cases}
> $$

> [!example] Example 20.21 — Bảng giá trị $\mu$
>
> | $n$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ | $12$ | $30$ |
> |---|---|---|---|---|---|---|---|---|---|---|---|---|
> | $\mu(n)$ | $1$ | $-1$ | $-1$ | $0$ | $-1$ | $1$ | $-1$ | $0$ | $0$ | $1$ | $0$ | $-1$ |
>
> Giải thích:
> - $\mu(6) = \mu(2 \cdot 3) = (-1)^2 = 1$
> - $\mu(4) = 0$ vì $4 = 2^2$ (có ước chính phương $4$)
> - $\mu(30) = \mu(2 \cdot 3 \cdot 5) = (-1)^3 = -1$

> [!theorem] Theorem 20.22 — Tính nhân tính của $\mu$
> Hàm Möbius $\mu$ là nhân tính.

**Proof.**
Xét $m, n$ với $\gcd(m,n) = 1$.

- Nếu $p^2 \mid m$ hoặc $p^2 \mid n$ cho một số nguyên tố $p$, thì $p^2 \mid mn$ nên $\mu(mn) = 0$. Đồng thời $\mu(m) = 0$ hoặc $\mu(n) = 0$, suy ra $\mu(m)\mu(n) = 0$ ✓
- Nếu cả $m$ và $n$ đều không có ước chính phương: $m = p_1\cdots p_j$, $n = q_1\cdots q_k$ với tất cả nguyên tố phân biệt (vì $\gcd(m,n)=1$), thì $mn = p_1\cdots p_j q_1\cdots q_k$ gồm $j+k$ số nguyên tố phân biệt, nên $\mu(mn) = (-1)^{j+k} = (-1)^j(-1)^k = \mu(m)\mu(n)$ ✓ $\blacksquare$

### Tính Chất Tổng Quan Trọng

> [!theorem] Theorem 20.23 — Tổng $\mu$ trên ước
> Với mọi $n \geq 1$:
>
> $$
> \sum_{d \mid n} \mu(d) = \varepsilon(n) = \begin{cases} 1 & n = 1 \\ 0 & n > 1 \end{cases}
> $$

**Proof.**
Gọi $F(n) = \sum_{d \mid n} \mu(d)$. Vì $\mu$ nhân tính, theo Theorem 20.25 bên dưới, $F$ cũng nhân tính. Do đó đủ tính $F(p^a)$ với $p$ nguyên tố, $a \geq 1$:

$$
F(p^a) = \mu(1) + \mu(p) + \mu(p^2) + \cdots + \mu(p^a) = 1 + (-1) + 0 + \cdots + 0 = 0
$$

Với $n = 1$: $F(1) = \mu(1) = 1$. Với $n > 1$: $n = p_1^{a_1}\cdots p_k^{a_k}$, do tính nhân tính và $F(p_i^{a_i}) = 0$ với mọi $i$, ta có $F(n) = 0$. $\blacksquare$

> [!note] Remark 20.24 — Ý nghĩa của Theorem 20.23
> Đây là tính chất trung tâm của $\mu$: nó "phát hiện" $n = 1$ trong các tổng trên ước. Định lý này là động cơ của Công Thức Đảo Möbius (bài 22).

---

## Định Lý: Tổng Hàm Nhân Tính Là Nhân Tính

> [!theorem] Theorem 20.25 — Tổng trên ước bảo toàn tính nhân tính
> Nếu $f$ là hàm nhân tính và
>
> $$
> F(n) = \sum_{d \mid n} f(d)
> $$
>
> thì $F$ cũng là hàm nhân tính.

**Proof.**
Lấy $\gcd(m, n) = 1$. Ta cần chứng minh $F(mn) = F(m)F(n)$.

Quan sát then chốt: khi $\gcd(m,n)=1$, mọi ước $d$ của $mn$ **viết duy nhất** thành $d = d_1 d_2$ với $d_1 \mid m$, $d_2 \mid n$, $\gcd(d_1, d_2) = 1$. Ánh xạ $d \leftrightarrow (d_1, d_2)$ là song ánh giữa tập ước của $mn$ và tích Đề-các tập ước của $m$ với tập ước của $n$.

Do đó:

$$
F(mn) = \sum_{d \mid mn} f(d) = \sum_{d_1 \mid m} \sum_{d_2 \mid n} f(d_1 d_2)
$$

Vì $\gcd(d_1, d_2) = 1$ và $f$ nhân tính: $f(d_1 d_2) = f(d_1)f(d_2)$. Suy ra:

$$
F(mn) = \sum_{d_1 \mid m} \sum_{d_2 \mid n} f(d_1)f(d_2) = \left(\sum_{d_1 \mid m} f(d_1)\right)\left(\sum_{d_2 \mid n} f(d_2)\right) = F(m)F(n)
$$

$\blacksquare$

> [!note] Remark 20.26 — Hệ quả ngay lập tức
> Theorem 20.25 áp dụng ngay cho:
> - $f = \mathbf{1}$: $F(n) = \sum_{d \mid n} 1 = \tau(n)$ → $\tau$ nhân tính ✓
> - $f = \operatorname{id}_k$: $F(n) = \sum_{d \mid n} d^k = \sigma_k(n)$ → $\sigma_k$ nhân tính ✓
> - $f = \varphi$: $F(n) = \sum_{d \mid n} \varphi(d) = n$ → sẽ chứng minh ngay dưới

---

## Đồng Nhất Thức $\sum_{d \mid n} \varphi(d) = n$

> [!theorem] Theorem 20.27 — Tổng Euler Phi Trên Ước
> Với mọi $n \geq 1$:
>
> $$
> \sum_{d \mid n} \varphi(d) = n
> $$

**Proof (đếm phân lớp).**
Xét tập $\{1, 2, \ldots, n\}$. Phân hoạch nó theo $\gcd(k, n)$:

$$
\{1, \ldots, n\} = \bigsqcup_{d \mid n} \left\{ k : 1 \leq k \leq n,\ \gcd(k,n) = d \right\}
$$

Lớp ứng với $d$ gồm các $k = d \cdot j$ với $\gcd(j, n/d) = 1$ và $1 \leq j \leq n/d$. Số phần tử trong lớp này là $\varphi(n/d)$.

Khi $d$ chạy qua tất cả ước của $n$, $n/d$ cũng chạy qua tất cả ước của $n$, nên:

$$
n = \sum_{d \mid n} \varphi(n/d) = \sum_{d \mid n} \varphi(d) \qquad \blacksquare
$$

**Chứng minh thứ hai (tính nhân tính).**
Gọi $G(n) = \sum_{d \mid n} \varphi(d)$. Vì $\varphi$ nhân tính, theo Theorem 20.25, $G$ nhân tính. Tính $G(p^a)$:

$$
G(p^a) = \varphi(1) + \varphi(p) + \cdots + \varphi(p^a) = 1 + (p-1) + p(p-1) + \cdots + p^{a-1}(p-1) = p^a
$$

(tổng cấp số nhân). Vì $G$ nhân tính và $G(p^a) = p^a = \operatorname{id}(p^a)$, suy ra $G = \operatorname{id}$, tức là $G(n) = n$. $\blacksquare$

> [!example] Example 20.28 — Kiểm tra với $n = 12$
>
> Ước của $12$: $1, 2, 3, 4, 6, 12$
>
> $$
> \varphi(1) + \varphi(2) + \varphi(3) + \varphi(4) + \varphi(6) + \varphi(12)
> = 1 + 1 + 2 + 2 + 2 + 4 = 12 \checkmark
> $$

---

## Hàm Von Mangoldt $\Lambda$

> [!definition] Definition 20.29 — Hàm Von Mangoldt (Von Mangoldt Function)
> Định nghĩa:
>
> $$
> \Lambda(n) = \begin{cases}
> \ln p & \text{nếu } n = p^k \text{ với } p \text{ nguyên tố và } k \geq 1 \\
> 0 & \text{trong trường hợp khác}
> \end{cases}
> $$

> [!example] Example 20.30 — Giá trị $\Lambda$
>
> $\Lambda(1) = 0$, $\Lambda(2) = \ln 2$, $\Lambda(3) = \ln 3$, $\Lambda(4) = \ln 2$, $\Lambda(5) = \ln 5$, $\Lambda(6) = 0$, $\Lambda(8) = \ln 2$, $\Lambda(9) = \ln 3$.

> [!theorem] Theorem 20.31 — Hệ thức log và $\Lambda$
> Với mọi $n \geq 1$:
>
> $$
> \ln n = \sum_{d \mid n} \Lambda(d)
> $$

**Proof.**
Gọi $n = p_1^{a_1} \cdots p_k^{a_k}$. Lấy logarithm:

$$
\ln n = \sum_{i=1}^{k} a_i \ln p_i
$$

Bên tay phải của đẳng thức cần chứng minh: $\Lambda(d) \neq 0$ chỉ khi $d = p_j^m$ cho một số nguyên tố $p_j \mid n$ và $1 \leq m \leq a_j$. Với mỗi $p_j$, đóng góp là $\sum_{m=1}^{a_j} \Lambda(p_j^m) = \sum_{m=1}^{a_j} \ln p_j = a_j \ln p_j$. $\blacksquare$

> [!note] Remark 20.32 — Vai trò của $\Lambda$ trong lý thuyết số giải tích
> Hàm $\Lambda$ là "người đại diện trọng số" của các lũy thừa nguyên tố. Nó xuất hiện trong định nghĩa hàm $\psi(x) = \sum_{n \leq x} \Lambda(n)$ (Chebyshev's second function) và là công cụ trung tâm trong Định Lý Số Nguyên Tố (bài 25).
>
> Lưu ý: $\Lambda$ **không** nhân tính (vì $\Lambda(1) = 0 \neq 1$).

---

## Số Hoàn Hảo (Perfect Numbers)

Một ứng dụng kinh điển của hàm $\sigma$ là lý thuyết về **số hoàn hảo** (perfect numbers) — một chủ đề đã được Euclid và Euler nghiên cứu từ thời cổ đại.

> [!definition] Definition 20.33 — Số Hoàn Hảo (Perfect Number)
> Số nguyên dương $n$ được gọi là **hoàn hảo** nếu tổng các ước dương thực sự (proper divisors) của $n$ bằng chính $n$:
>
> $$
> \sigma(n) - n = n \quad \text{hay} \quad \sigma(n) = 2n
> $$
>
> Nếu $\sigma(n) < 2n$, $n$ được gọi là **thiếu** (deficient). Nếu $\sigma(n) > 2n$, $n$ được gọi là **thặng dư** (abundant).

> [!example] Example 20.34 — Các số hoàn hảo đầu tiên
>
> - $n = 6$: ước thực sự $\{1, 2, 3\}$, tổng $1+2+3 = 6$. ✓
> - $n = 28$: ước thực sự $\{1, 2, 4, 7, 14\}$, tổng $= 28$. ✓
> - $n = 496$: $\sigma(496) = 992 = 2 \times 496$. ✓
> - $n = 8128$: $\sigma(8128) = 16256 = 2 \times 8128$. ✓

> [!theorem] Theorem 20.35 — Euclid–Euler (Số Hoàn Hảo Chẵn)
> $n$ là số hoàn hảo **chẵn** khi và chỉ khi:
>
> $$
> n = 2^{p-1}(2^p - 1)
> $$
>
> trong đó $2^p - 1$ là **số nguyên tố Mersenne** (tức $p$ nguyên tố và $M_p = 2^p - 1$ nguyên tố).

**Proof ($\Leftarrow$, Euclid).** Giả sử $M_p = 2^p - 1$ nguyên tố. Thì $n = 2^{p-1} M_p$. Vì $\gcd(2^{p-1}, M_p) = 1$ và $\sigma$ nhân tính:

$$
\sigma(n) = \sigma(2^{p-1}) \cdot \sigma(M_p) = (2^p - 1) \cdot (M_p + 1) = (2^p - 1) \cdot 2^p = 2n
$$

**Proof ($\Rightarrow$, Euler).** Giả sử $n$ hoàn hảo chẵn. Viết $n = 2^{k-1} m$ với $m$ lẻ, $k \geq 2$. Vì $\sigma$ nhân tính:

$$
\sigma(n) = \sigma(2^{k-1})\sigma(m) = (2^k - 1)\sigma(m)
$$

Điều kiện hoàn hảo: $2n = 2^k m = (2^k - 1)\sigma(m)$, suy ra:

$$
\sigma(m) = \frac{2^k m}{2^k - 1} = m + \frac{m}{2^k - 1}
$$

Vì $\sigma(m)$ và $m$ nguyên, $\frac{m}{2^k-1}$ phải nguyên. Đặt $d = \frac{m}{2^k-1}$. Thì $\sigma(m) = m + d$. Nhưng $d$ và $m$ đều là ước của $m$ (vì $m = d(2^k-1)$), nên $m$ chỉ có đúng hai ước: $d$ và $m$. Vậy $m$ nguyên tố, $d = 1$, suy ra $m = 2^k - 1$ là số nguyên tố Mersenne. $\blacksquare$

> [!note] Remark 20.36 — Bài toán mở
> Hiện chưa biết liệu có **số hoàn hảo lẻ** hay không — đây là một trong những bài toán mở lâu đời nhất toán học. Nếu tồn tại, nó phải $> 10^{1500}$ và thỏa nhiều điều kiện phức tạp.
>
> Cũng chưa biết có vô hạn số nguyên tố Mersenne hay không — và do đó chưa biết có vô hạn số hoàn hảo chẵn hay không.

---

## Bảng Tổng Hợp Các Hàm Số Học

| Hàm | Ký hiệu | Định nghĩa | Nhân tính | $f(p^a)$ |
|-----|---------|-----------|-----------|----------|
| Đơn vị | $\varepsilon$ | $[n=1]$ | Hoàn toàn | $0$ |
| Hằng 1 | $\mathbf{1}$ | $1$ | Hoàn toàn | $1$ |
| Đồng nhất | $\operatorname{id}$ | $n$ | Hoàn toàn | $p^a$ |
| Đếm ước | $\tau$ | $\sum_{d\mid n}1$ | Nhân tính | $a+1$ |
| Tổng ước | $\sigma$ | $\sum_{d\mid n}d$ | Nhân tính | $\frac{p^{a+1}-1}{p-1}$ |
| Euler phi | $\varphi$ | $\lvert(\mathbb{Z}/n\mathbb{Z})^*\rvert$ | Nhân tính | $p^{a-1}(p-1)$ |
| Möbius | $\mu$ | $(-1)^k$ hay $0$ | Nhân tính | $-1$ (nếu $a=1$), $0$ (nếu $a>1$) |
| Von Mangoldt | $\Lambda$ | $\ln p$ hay $0$ | Không | $\ln p$ |

---

## SageMath Cheatsheet

Tính các hàm số học trong SageMath:

```sage
n = 360

# Số ước (divisor count): sigma(n, 0) hoặc len(divisors(n))
tau_n = sigma(n, 0)
print(f"tau({n}) = {tau_n}")

# Danh sách ước
print(f"Uớc của {n}: {divisors(n)}")

# Tổng ước: sigma(n, 1)
sigma_n = sigma(n, 1)
print(f"sigma({n}) = {sigma_n}")

# Tổng bình phương các ước: sigma(n, 2)
sigma2_n = sigma(n, 2)
print(f"sigma_2({n}) = {sigma2_n}")

# Euler phi
phi_n = euler_phi(n)
print(f"phi({n}) = {phi_n}")

# Hàm Mobius
print(f"mu(12) = {moebius(12)}")
print(f"mu(30) = {moebius(30)}")

# Hàm von Mangoldt (tự cài đặt)
def mangoldt(n):
    if n == 1:
        return 0
    f = factor(n)
    if len(f) == 1:
        p, k = f[0]
        return ln(p)
    return 0

for k in range(1, 13):
    print(f"Lambda({k}) = {mangoldt(k)}")
```

Kiểm tra tính nhân tính bằng ví dụ:

```sage
m, n = 9, 16
assert gcd(m, n) == 1
# Kiểm tra tau nhân tính
assert sigma(m * n, 0) == sigma(m, 0) * sigma(n, 0)
# Kiểm tra sigma nhân tính
assert sigma(m * n, 1) == sigma(m, 1) * sigma(n, 1)
# Kiểm tra phi nhân tính
assert euler_phi(m * n) == euler_phi(m) * euler_phi(n)
print("Tính nhân tính được xác nhận!")
```

Bảng giá trị $\mu$ từ $1$ đến $20$:

```sage
for n in range(1, 21):
    print(f"mu({n:2d}) = {moebius(n):2d}")
```

Kiểm tra đẳng thức $\sum_{d \mid n} \varphi(d) = n$:

```sage
for n in [12, 30, 60, 100]:
    s = sum(euler_phi(d) for d in divisors(n))
    assert s == n
    print(f"Sum phi(d) for d|{n} = {s} = n ✓")
```

---

## Summary / Key Takeaways

- **Hàm số học** là hàm từ $\mathbb{Z}^+$ vào $\mathbb{C}$; không yêu cầu bất kỳ tính liên tục nào.
- Hàm **nhân tính** thỏa $f(mn) = f(m)f(n)$ khi $\gcd(m,n)=1$; hàm **hoàn toàn nhân tính** thỏa không điều kiện.
- Mọi hàm nhân tính được xác định hoàn toàn bởi giá trị trên **lũy thừa nguyên tố** $p^k$.
- **Hàm nhân tính** thỏa $f(1) = 1$ (tự động từ định nghĩa).
- **Định lý then chốt**: $F(n) = \sum_{d \mid n} f(d)$ nhân tính nếu $f$ nhân tính. Hệ quả: $\tau$, $\sigma_k$ đều nhân tính.
- **Hàm Möbius** $\mu$: bằng $0$ nếu có nhân tố bình phương, bằng $(-1)^k$ nếu squarefree với $k$ nhân tố nguyên tố. Tổng $\sum_{d \mid n}\mu(d) = \varepsilon(n)$.
- **Đồng nhất thức Euler**: $\sum_{d \mid n} \varphi(d) = n$ — chứng minh được bằng cả đếm trực tiếp lẫn tính nhân tính.
- **Hàm Von Mangoldt** $\Lambda$: bằng $\ln p$ nếu $n = p^k$, bằng $0$ ngoài ra. Thỏa $\sum_{d \mid n}\Lambda(d) = \ln n$.
- Module tiếp theo (bài 21) sẽ đưa các hàm này vào một **cấu trúc đại số thống nhất**: vành tích chập Dirichlet.

---

## References

- I. Niven, H. S. Zuckerman, H. L. Montgomery — *An Introduction to the Theory of Numbers*, 5th ed., Ch. 4
- T. M. Apostol — *Introduction to Analytic Number Theory*, Ch. 2
- G. H. Hardy, E. M. Wright — *An Introduction to the Theory of Numbers*, Ch. 16–17
- K. Ireland, M. Rosen — *A Classical Introduction to Modern Number Theory*, Ch. 2
