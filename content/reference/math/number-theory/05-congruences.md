---
title: "05. Quan Hệ Đồng Dư"
type: foundation
tags: [math, number-theory, lesson-05]
aliases: [Congruences, Modular Arithmetic]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]], [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]]
> **Objectives**:
> - Nắm vững định nghĩa quan hệ đồng dư và chứng minh nó là quan hệ tương đương
> - Hiểu cấu trúc của lớp đồng dư và hệ thống thặng dư
> - Thực hiện các phép tính cộng, trừ, nhân trong $\mathbb{Z}/n\mathbb{Z}$
> - Phân biệt phần tử khả nghịch, ước của không, và zero divisor
> - Nhận biết khi nào $\mathbb{Z}/n\mathbb{Z}$ là miền nguyên và khi nào là trường

---

## Motivation / Intuition

Trong cuộc sống hàng ngày, chúng ta quen với "số học theo chu kỳ": đồng hồ tính giờ theo modulo 12, lịch tính ngày trong tuần theo modulo 7. Hai thời điểm "cách nhau bội số của 12 giờ" đều chỉ cùng một giờ trên mặt đồng hồ — chúng ta tự nhiên đồng nhất chúng lại.

Gauss (1777–1855) trong cuốn *Disquisitiones Arithmeticae* (1801) đã hệ thống hóa trực giác này thành một ngôn ngữ toán học chính xác: **quan hệ đồng dư** (congruence relation). Thay vì nói "hai số có cùng số dư khi chia cho $n$", ông viết $a \equiv b \pmod{n}$ — một ký hiệu trở thành ngôn ngữ trung tâm của lý thuyết số hiện đại.

Điều làm quan hệ đồng dư mạnh mẽ là nó không chỉ là một cách viết tắt: các phép tính cộng và nhân "tương thích" với nó, cho phép ta xây dựng một hệ thống số học mới — vành số nguyên modulo $n$ — với cấu trúc đại số phong phú.

---

## Định Nghĩa và Tính Chất Cơ Bản

### Định nghĩa đồng dư

> [!definition] Definition 5.1 — Đồng Dư (Congruence)
> Cho $n \in \mathbb{Z}^+$, $n \geq 2$. Ta nói $a$ **đồng dư** với $b$ **modulo** $n$, ký hiệu:
>
> $$
> a \equiv b \pmod{n}
> $$
>
> nếu $n \mid (a - b)$, tức là $a - b = kn$ với một số nguyên $k$ nào đó.
>
> Tương đương: $a$ và $b$ có cùng số dư khi chia cho $n$.

> [!note] Remark 5.2 — Mối liên hệ với chia hết
> $a \equiv 0 \pmod{n}$ tương đương với $n \mid a$. Vì vậy, đồng dư là một sự mở rộng tự nhiên của quan hệ chia hết: thay vì hỏi "$n$ có chia hết $a$ không", ta hỏi "$a$ và $b$ có chia cho $n$ ra cùng số dư không".

> [!example] Example 5.3 — Các ví dụ cơ bản
> - $17 \equiv 5 \pmod{6}$ vì $17 - 5 = 12 = 2 \cdot 6$.
> - $-3 \equiv 9 \pmod{6}$ vì $-3 - 9 = -12 = (-2) \cdot 6$.
> - $100 \equiv 4 \pmod{12}$ vì $100 = 8 \cdot 12 + 4$.
> - $2^{10} = 1024 \equiv 4 \pmod{10}$ vì $1024 - 4 = 1020 = 102 \cdot 10$.

### Đồng dư là quan hệ tương đương

> [!theorem] Theorem 5.4 — Tính Tương Đương (Equivalence Relation)
> Quan hệ $\equiv \pmod{n}$ trên $\mathbb{Z}$ là một **quan hệ tương đương** (equivalence relation), tức là thỏa mãn:
>
> **(R) Phản xạ** (Reflexivity): $a \equiv a \pmod{n}$.
>
> **(S) Đối xứng** (Symmetry): Nếu $a \equiv b \pmod{n}$ thì $b \equiv a \pmod{n}$.
>
> **(T) Bắc cầu** (Transitivity): Nếu $a \equiv b$ và $b \equiv c \pmod{n}$ thì $a \equiv c \pmod{n}$.

**Proof.**

**(R)** $a - a = 0 = 0 \cdot n$, nên $n \mid (a - a)$. $\checkmark$

**(S)** Nếu $n \mid (a - b)$ thì $a - b = kn$, suy ra $b - a = (-k)n$, tức là $n \mid (b - a)$. $\checkmark$

**(T)** Nếu $a - b = kn$ và $b - c = ln$, thì $a - c = (a - b) + (b - c) = (k + l)n$, tức là $n \mid (a - c)$. $\checkmark$ $\blacksquare$

### Tính tương thích với phép tính

Đây là tính chất then chốt cho phép ta "tính toán trong đồng dư" một cách hợp lệ:

> [!theorem] Theorem 5.5 — Tính Tương Thích (Compatibility with Arithmetic)
> Cho $n \geq 2$. Nếu $a \equiv b \pmod{n}$ và $c \equiv d \pmod{n}$, thì:
>
> **(i)** $a + c \equiv b + d \pmod{n}$
>
> **(ii)** $a - c \equiv b - d \pmod{n}$
>
> **(iii)** $ac \equiv bd \pmod{n}$
>
> **(iv)** $a^k \equiv b^k \pmod{n}$ với mọi $k \in \mathbb{Z}_{\geq 0}$
>
> **(v)** $f(a) \equiv f(b) \pmod{n}$ với mọi đa thức $f \in \mathbb{Z}[x]$

**Proof.**

Đặt $a - b = sn$ và $c - d = tn$ với $s, t \in \mathbb{Z}$.

**(i)** $(a + c) - (b + d) = (a - b) + (c - d) = (s + t)n$. $\checkmark$

**(iii)** $ac - bd = ac - bc + bc - bd = c(a - b) + b(c - d) = csn + btn = (cs + bt)n$. $\checkmark$

**(iv)** Áp dụng (iii) lặp lại $k$ lần: $a^k \equiv b^k \pmod{n}$.

**(v)** Nếu $f(x) = \sum_{i=0}^m c_i x^i$ thì $f(a) - f(b) = \sum_{i=0}^m c_i(a^i - b^i)$, và mỗi $a^i - b^i \equiv 0 \pmod{n}$ theo (iv). $\blacksquare$

> [!example] Example 5.6 — Tính $7^{100} \pmod{6}$
> $7 \equiv 1 \pmod{6}$, nên $7^{100} \equiv 1^{100} = 1 \pmod{6}$.

> [!example] Example 5.7 — Tính $2^{100} \pmod{7}$
> $2^3 = 8 \equiv 1 \pmod{7}$, nên $2^{99} = (2^3)^{33} \equiv 1^{33} = 1 \pmod{7}$.
> Vậy $2^{100} = 2 \cdot 2^{99} \equiv 2 \cdot 1 = 2 \pmod{7}$.

### Tính chia — chú ý quan trọng

> [!warning] Warning 5.8 — Chia Không Tự Do như Nhân
> Nếu $ac \equiv bc \pmod{n}$, **KHÔNG** thể kết luận ngay $a \equiv b \pmod{n}$.
>
> **Ví dụ:** $2 \cdot 3 \equiv 4 \cdot 3 \pmod{6}$ (vì $6 \equiv 12 \equiv 0 \pmod{6}$), nhưng $2 \not\equiv 4 \pmod{6}$.
>
> Điều kiện để hủy: nếu $ac \equiv bc \pmod{n}$ và $\gcd(c, n) = 1$, thì $a \equiv b \pmod{n}$.

**Proof của điều kiện hủy:** $ac \equiv bc \pmod{n}$ nghĩa là $n \mid c(a - b)$. Vì $\gcd(c, n) = 1$, theo Bổ đề Euclid, $n \mid (a - b)$, tức $a \equiv b \pmod{n}$. $\blacksquare$

---

## Lớp Đồng Dư và Hệ Thống Thặng Dư

### Lớp đồng dư

> [!definition] Definition 5.9 — Lớp Đồng Dư (Congruence Class)
> **Lớp đồng dư** (residue class) của $a$ modulo $n$ là tập hợp tất cả số nguyên đồng dư với $a$ theo modulo $n$:
>
> $$
> [a]_n = \overline{a} = \left\{ a + kn \mid k \in \mathbb{Z} \right\} = \{\ldots, a-2n,\ a-n,\ a,\ a+n,\ a+2n,\ \ldots\}
> $$
>
> Vì đồng dư là quan hệ tương đương, các lớp đồng dư phân hoạch $\mathbb{Z}$ thành $n$ lớp rời nhau.

> [!example] Example 5.10 — Các lớp đồng dư modulo 4
> Các lớp đồng dư modulo 4:
>
> $$
> [0]_4 = \{\ldots, -8, -4, 0, 4, 8, 12, \ldots\}
> $$
>
> $$
> [1]_4 = \{\ldots, -7, -3, 1, 5, 9, 13, \ldots\}
> $$
>
> $$
> [2]_4 = \{\ldots, -6, -2, 2, 6, 10, 14, \ldots\}
> $$
>
> $$
> [3]_4 = \{\ldots, -5, -1, 3, 7, 11, 15, \ldots\}
> $$
>
> Bốn lớp này phân hoạch $\mathbb{Z}$ hoàn toàn.

### Hệ thống thặng dư

> [!definition] Definition 5.11 — Hệ Thống Thặng Dư (Residue System)
> Một tập $\{r_0, r_1, \ldots, r_{n-1}\} \subset \mathbb{Z}$ gọi là **hệ thống thặng dư đầy đủ** (complete residue system) modulo $n$ nếu mỗi số nguyên đồng dư với đúng một phần tử trong tập đó.
>
> **Hệ thống thặng dư tối giản** (reduced residue system) là tập các phần tử trong hệ thống thặng dư đầy đủ thỏa $\gcd(r_i, n) = 1$.

> [!note] Remark 5.12
> Hệ thống thặng dư đầy đủ chuẩn tắc nhất là $\{0, 1, 2, \ldots, n-1\}$. Hệ đối xứng $\left\{-\frac{n-1}{2}, \ldots, -1, 0, 1, \ldots, \frac{n-1}{2}\right\}$ (khi $n$ lẻ) đôi khi tiện hơn trong chứng minh.
>
> Hệ thống thặng dư tối giản modulo $n$ có đúng $\varphi(n)$ phần tử (sẽ học trong bài 09).

> [!theorem] Theorem 5.13 — Dịch Hệ Thặng Dư
> Nếu $\{r_0, r_1, \ldots, r_{n-1}\}$ là hệ thống thặng dư đầy đủ modulo $n$, và $\gcd(a, n) = 1$, thì $\{ar_0, ar_1, \ldots, ar_{n-1}\}$ cũng là hệ thống thặng dư đầy đủ modulo $n$.

**Proof.** Tập $\{ar_0, \ldots, ar_{n-1}\}$ có đúng $n$ phần tử. Nếu $ar_i \equiv ar_j \pmod{n}$, thì $n \mid a(r_i - r_j)$. Vì $\gcd(a, n) = 1$, nên $n \mid (r_i - r_j)$, tức $r_i \equiv r_j \pmod{n}$. Do các $r_i$ phân biệt nhau theo modulo $n$, suy ra $i = j$. Vậy $n$ phần tử $ar_i$ phân biệt nhau theo modulo $n$, nên chúng tạo thành hệ thống thặng dư đầy đủ. $\blacksquare$

---

## Vành $\mathbb{Z}/n\mathbb{Z}$

### Phép tính trên lớp đồng dư

> [!definition] Definition 5.14 — Vành Số Nguyên Modulo $n$
> Tập $\mathbb{Z}/n\mathbb{Z} = \left\{ [0], [1], [2], \ldots, [n-1] \right\}$ của $n$ lớp đồng dư modulo $n$, trang bị phép cộng và nhân:
>
> $$
> [a] + [b] = [a + b], \qquad [a] \cdot [b] = [ab]
> $$
>
> tạo thành một **vành giao hoán** (commutative ring) với phần tử đơn vị $[1]$.

> [!note] Remark 5.15 — Tính hợp lệ (Well-definedness)
> Các phép tính trên lớp đồng dư phải không phụ thuộc vào đại diện được chọn. Nghĩa là nếu $[a] = [a']$ và $[b] = [b']$, ta cần $[a + b] = [a' + b']$ và $[ab] = [a'b']$. Điều này đúng chính xác nhờ Theorem 5.5.

### Phần tử khả nghịch

> [!theorem] Theorem 5.16 — Điều Kiện Khả Nghịch
> Phần tử $[a]$ trong $\mathbb{Z}/n\mathbb{Z}$ có nghịch đảo nhân (tức $[a][x] = [1]$ có nghiệm $[x]$) **khi và chỉ khi** $\gcd(a, n) = 1$.

**Proof.**

($\Rightarrow$) Nếu $ax \equiv 1 \pmod{n}$, thì $ax - 1 = kn$ với $k \in \mathbb{Z}$, tức $ax - kn = 1$. Vậy $\gcd(a, n) \mid 1$, suy ra $\gcd(a, n) = 1$.

($\Leftarrow$) Nếu $\gcd(a, n) = 1$, theo Bézout's Identity (Theorem 2.1), tồn tại $x, y \in \mathbb{Z}$ với $ax + ny = 1$, tức $ax \equiv 1 \pmod{n}$. $\blacksquare$

> [!definition] Definition 5.17 — Nhóm Nhân $(\mathbb{Z}/n\mathbb{Z})^*$
> **Nhóm nhân** (multiplicative group) modulo $n$ là tập các lớp đồng dư khả nghịch:
>
> $$
> (\mathbb{Z}/n\mathbb{Z})^* = \left\{ [a] \mid 1 \leq a \leq n,\ \gcd(a, n) = 1 \right\}
> $$
>
> Nhóm này có $\varphi(n)$ phần tử (sẽ tính trong bài 09).

> [!example] Example 5.18 — Nhóm nhân $(\mathbb{Z}/10\mathbb{Z})^*$
> Các phần tử: $\{[1], [3], [7], [9]\}$ (vì $\gcd(1,10) = \gcd(3,10) = \gcd(7,10) = \gcd(9,10) = 1$).
>
> Bảng nhân:
>
> | $\cdot$ | $[1]$ | $[3]$ | $[7]$ | $[9]$ |
> |--------|-------|-------|-------|-------|
> | $[1]$  | $[1]$ | $[3]$ | $[7]$ | $[9]$ |
> | $[3]$  | $[3]$ | $[9]$ | $[1]$ | $[7]$ |
> | $[7]$  | $[7]$ | $[1]$ | $[9]$ | $[3]$ |
> | $[9]$  | $[9]$ | $[7]$ | $[3]$ | $[1]$ |
>
> Ta thấy mỗi phần tử đều có nghịch đảo: $[3]^{-1} = [7]$, $[9]^{-1} = [9]$.

### Zero divisor

> [!definition] Definition 5.19 — Ước Của Không (Zero Divisor)
> Phần tử $[a] \neq [0]$ trong $\mathbb{Z}/n\mathbb{Z}$ gọi là **ước của không** (zero divisor) nếu tồn tại $[b] \neq [0]$ sao cho $[a][b] = [0]$, tức $ab \equiv 0 \pmod{n}$ nhưng $a, b \not\equiv 0 \pmod{n}$.

> [!example] Example 5.20 — Zero divisor trong $\mathbb{Z}/6\mathbb{Z}$
> $[2] \cdot [3] = [6] = [0]$, nhưng $[2] \neq [0]$ và $[3] \neq [0]$.
>
> Vậy $[2]$ và $[3]$ đều là zero divisor trong $\mathbb{Z}/6\mathbb{Z}$.
>
> Chú ý: $6 = 2 \cdot 3$, tức zero divisor xuất hiện vì $6$ không phải số nguyên tố.

> [!theorem] Theorem 5.21 — Phân Loại Phần Tử trong $\mathbb{Z}/n\mathbb{Z}$
> Với $1 \leq a \leq n-1$:
>
> - $[a]$ là **đơn vị** (unit, có nghịch đảo) $\Leftrightarrow$ $\gcd(a, n) = 1$
> - $[a]$ là **zero divisor** $\Leftrightarrow$ $\gcd(a, n) > 1$
>
> (Một phần tử không thể vừa là đơn vị vừa là zero divisor.)

**Proof.** Trường hợp $\gcd(a,n) = 1$: $[a]$ khả nghịch theo Theorem 5.16. Nếu $[a][b] = [0]$ thì nhân hai vế với $[a]^{-1}$ được $[b] = [0]$, tức $[a]$ không phải zero divisor.

Trường hợp $d = \gcd(a,n) > 1$: đặt $b = n/d$. Thì $ab = a \cdot (n/d) = (a/d) \cdot n$, tức $ab \equiv 0 \pmod{n}$. Nhưng $b = n/d < n$, nên $[b] \neq [0]$. Vậy $[a]$ là zero divisor. $\blacksquare$

---

## $\mathbb{Z}/n\mathbb{Z}$ là Trường khi $n$ là Số Nguyên Tố

> [!theorem] Theorem 5.22 — $\mathbb{Z}/p\mathbb{Z}$ là Trường
> $\mathbb{Z}/n\mathbb{Z}$ là **miền nguyên** (integral domain, không có zero divisor khác không) **khi và chỉ khi** $n$ là số nguyên tố.
>
> Hơn nữa, $\mathbb{Z}/p\mathbb{Z}$ là **trường** (field) với $p$ phần tử, ký hiệu $\mathbb{F}_p$.

**Proof.**

($\Leftarrow$) Nếu $p$ là số nguyên tố, mọi $a \in \{1, 2, \ldots, p-1\}$ đều có $\gcd(a, p) = 1$ (vì $p$ không có ước nào khác $1$ và $p$). Theo Theorem 5.21, không có zero divisor.

($\Rightarrow$) Nếu $n = ab$ với $1 < a, b < n$, thì $[a][b] = [ab] = [n] = [0]$ nhưng $[a] \neq [0]$ và $[b] \neq [0]$, tức $[a]$ là zero divisor, nên $\mathbb{Z}/n\mathbb{Z}$ không phải miền nguyên.

Mọi miền nguyên hữu hạn là trường (vì ánh xạ $x \mapsto ax$ là đơn ánh trên tập hữu hạn, nên là toàn ánh, tức $a$ có nghịch đảo). $\blacksquare$

> [!example] Example 5.23 — $\mathbb{Z}/7\mathbb{Z} = \mathbb{F}_7$
> Các nghịch đảo trong $\mathbb{F}_7 = \{[0],[1],[2],[3],[4],[5],[6]\}$:
>
> | $[a]$ | $[a]^{-1}$ | Kiểm tra |
> |-------|-----------|----------|
> | $[1]$ | $[1]$ | $1 \cdot 1 = 1 \equiv 1$ |
> | $[2]$ | $[4]$ | $2 \cdot 4 = 8 \equiv 1$ |
> | $[3]$ | $[5]$ | $3 \cdot 5 = 15 \equiv 1$ |
> | $[4]$ | $[2]$ | $4 \cdot 2 = 8 \equiv 1$ |
> | $[5]$ | $[3]$ | $5 \cdot 3 = 15 \equiv 1$ |
> | $[6]$ | $[6]$ | $6 \cdot 6 = 36 \equiv 1$ |

---

## Tiêu Chuẩn Chia Hết Qua Đồng Dư

Một ứng dụng đẹp: các tiêu chuẩn chia hết đều xuất phát từ lý thuyết đồng dư.

> [!theorem] Theorem 5.24 — Tiêu Chuẩn Chia Hết
> Cho $n = \overline{d_k d_{k-1} \cdots d_1 d_0}$ (biểu diễn thập phân). Thì:
>
> **(i)** $2 \mid n \Leftrightarrow 2 \mid d_0$ (chữ số tận cùng).
>
> **(ii)** $3 \mid n \Leftrightarrow 3 \mid (d_0 + d_1 + \cdots + d_k)$ (tổng chữ số).
>
> **(iii)** $9 \mid n \Leftrightarrow 9 \mid (d_0 + d_1 + \cdots + d_k)$.
>
> **(iv)** $11 \mid n \Leftrightarrow 11 \mid (d_0 - d_1 + d_2 - \cdots)$ (tổng đan dấu).

**Proof (i) và (ii).** Viết $n = d_k \cdot 10^k + \cdots + d_1 \cdot 10 + d_0$. Vì $10 \equiv 0 \pmod{2}$, ta có $10^i \equiv 0 \pmod{2}$ với $i \geq 1$, nên $n \equiv d_0 \pmod{2}$.

Với (ii): $10 \equiv 1 \pmod{3}$, nên $10^i \equiv 1^i = 1 \pmod{3}$, suy ra:

$$
n \equiv d_k \cdot 1 + d_{k-1} \cdot 1 + \cdots + d_0 = d_0 + d_1 + \cdots + d_k \pmod{3}
$$

Với (iv): $10 \equiv -1 \pmod{11}$, nên $10^i \equiv (-1)^i \pmod{11}$, suy ra $n \equiv d_0 - d_1 + d_2 - \cdots \pmod{11}$. $\blacksquare$

> [!example] Example 5.25 — Kiểm tra chia hết của $n = 123456789$
> - Tổng chữ số: $1+2+3+4+5+6+7+8+9 = 45 = 9 \cdot 5$, nên $9 \mid n$, suy ra $3 \mid n$.
> - Tổng đan dấu: $9 - 8 + 7 - 6 + 5 - 4 + 3 - 2 + 1 = 5$, mà $11 \nmid 5$, nên $11 \nmid n$.

---

## Lũy Thừa Modulo — Thuật Toán Bình Phương Liên Tiếp

Tính $a^k \pmod{n}$ với $k$ lớn là bài toán nền tảng. Phương pháp hiệu quả là **square-and-multiply** (bình phương liên tiếp):

> [!example] Example 5.26 — Tính $3^{200} \pmod{13}$
> Phân tích nhị phân $200 = 128 + 64 + 8 = 2^7 + 2^6 + 2^3$, tức $200 = (11001000)_2$.
>
> Tính các lũy thừa bậc $2^i$ mod $13$:
>
> | $i$ | $3^{2^i} \pmod{13}$ |
> |-----|---------------------|
> | $0$ | $3$ |
> | $1$ | $9$ |
> | $2$ | $81 \equiv 3 \pmod{13}$ |
> | $3$ | $3^2 = 9$ (tính từ hàng trên: $3^{2^3} = (3^{2^2})^2 \equiv 3^2 = 9$) |
> | $4$ | $9^2 = 81 \equiv 3$ |
> | $5$ | $3^2 = 9$ |
> | $6$ | $9^2 \equiv 3$ |
> | $7$ | $3^2 = 9$ |
>
> Ta thấy $3^4 \equiv 3^2 \equiv 3 \pmod{13}$ — chu kỳ 3. Cụ thể:
>
> $$
> 3^{200} = 3^{128} \cdot 3^{64} \cdot 3^{8} \equiv 9 \cdot 3 \cdot 9 = 243 \equiv 243 - 18 \cdot 13 = 243 - 234 = 9 \pmod{13}
> $$

---

## SageMath Cheatsheet

```python
# Tính số học modulo
n = 13
print(Mod(3, n))           # Tạo phần tử [3] trong Z/13Z
print(Mod(3, n)^200)       # 3^200 mod 13

# Phần tử khả nghịch
a = Mod(7, 10)
print(a^(-1))              # Nghịch đảo của 7 mod 10 (nếu tồn tại)

# Kiểm tra phần tử khả nghịch
for a in range(1, 10):
    print(f"gcd(a, 10)={gcd(a, 10)}, invertible={gcd(a,10)==1}")

# Nhóm nhân (Z/nZ)*
G = Integers(12).unit_group()
print(G)                   # Nhóm nhân Z/12Z*

# Bảng nhân Z/nZ
R = Integers(6)
print(multiplication_table(R, operation='multiplication'))

# Square-and-multiply thủ công
def pow_mod(base, exp, mod):
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp //= 2
        base = (base * base) % mod
    return result

print(pow_mod(3, 200, 13))  # = 9

# Tìm zero divisors trong Z/nZ
n = 12
zero_divisors = []
for a in range(1, n):
    for b in range(1, n):
        if (a * b) % n == 0:
            zero_divisors.append((a, b))
            break
print("Zero divisors:", [a for a, _ in zero_divisors])
```

---

## Summary / Key Takeaways

- $a \equiv b \pmod{n}$ có nghĩa $n \mid (a - b)$; đây là quan hệ tương đương phân hoạch $\mathbb{Z}$ thành $n$ lớp đồng dư.
- Phép cộng và nhân tương thích với đồng dư: $a \equiv b$, $c \equiv d \Rightarrow ac \equiv bd \pmod{n}$. **Hủy nhân chỉ được khi** $\gcd(c, n) = 1$.
- $\mathbb{Z}/n\mathbb{Z}$ là vành giao hoán với $n$ phần tử; phần tử $[a]$ khả nghịch $\Leftrightarrow$ $\gcd(a, n) = 1$.
- Phần tử $[a] \neq [0]$ với $\gcd(a, n) > 1$ là zero divisor — không có nghịch đảo.
- $\mathbb{Z}/p\mathbb{Z} = \mathbb{F}_p$ là trường khi và chỉ khi $p$ là số nguyên tố.
- Các tiêu chuẩn chia hết (chia cho 3, 9, 11, ...) là hệ quả trực tiếp của $10^k \pmod{d}$.
- Lũy thừa lớn tính nhanh bằng square-and-multiply, chỉ cần $O(\log k)$ phép nhân.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), Ch. 2.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Ch. V.
- Gauss, C. F. *Disquisitiones Arithmeticae* (1801), Sect. I–II (nguồn gốc lịch sử).
