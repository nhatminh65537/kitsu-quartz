---
title: "26. Kiểm Tra Tính Nguyên Tố — Fermat, Carmichael, Miller-Rabin"
type: application
tags: [math, number-theory, lesson-26]
aliases: [Primality Testing, Miller-Rabin, Carmichael Numbers]
created: 2026-05-15
---

> **Prerequisites**: [[08-wilson-and-fermat|08. Định Lý Wilson và Fermat Nhỏ]], [[10-multiplicative-order|10. Bậc Nhân Tử]], [[13-structure-of-multiplicative-group|13. Cấu Trúc của (Z/nZ)*]]
> **Objectives**:
> - Phân tích test Fermat và giới hạn của nó: Fermat pseudoprime, absolute pseudoprime
> - Định nghĩa và nhận dạng số Carmichael qua tiêu chuẩn Korselt
> - Chứng minh rằng Carmichael number là vô hạn
> - Xây dựng và phân tích thuật toán Miller-Rabin: strong pseudoprime, witness, xác suất sai số
> - Nắm các test tất định cho số dạng đặc biệt: Proth's theorem, Lucas test, Pocklington
> - Cài đặt và thực hành đầy đủ bằng SageMath

---

## Motivation / Intuition

Một trong những bài toán thực hành cốt lõi của lý thuyết số là: **cho $n$ một số lớn, làm sao kiểm tra nhanh liệu $n$ có nguyên tố không?**

Phương pháp thử chia hiển nhiên: thử tất cả ước $\leq \sqrt{n}$. Với $n$ có $k$ chữ số thập phân, $\sqrt{n} \approx 10^{k/2}$. Với $k = 100$ (số 100 chữ số), ta cần $10^{50}$ phép chia — không khả thi dù có máy tính nhanh nhất.

Giải pháp: dùng **số học modulo** để xây dựng các test xác suất nhanh. Hành trình từ Fermat đến Miller-Rabin là câu chuyện về cách "vá lỗi" liên tiếp khi kẻ tấn công (số giả nguyên tố) tìm được lỗ hổng.

---

## Test Fermat

### Ý Tưởng Cơ Bản

Fermat's Little Theorem (bài 08): nếu $p$ nguyên tố và $\gcd(a, p) = 1$ thì:

$$
a^{p-1} \equiv 1 \pmod{p}
$$

Điều này gợi ý: **nếu $a^{n-1} \not\equiv 1 \pmod n$, thì $n$ không nguyên tố.** Ngược lại (điều kiện cần), nếu $a^{n-1} \equiv 1$ thì $n$ **có thể** nguyên tố.

> [!definition] Definition 26.1 — Nhân Chứng Fermat (Fermat Witness)
> Với số nguyên dương lẻ $n$, ta gọi $a$ với $\gcd(a, n) = 1$ là **nhân chứng Fermat** (Fermat witness) cho tính hợp số của $n$ nếu:
>
> $$
> a^{n-1} \not\equiv 1 \pmod{n}
> $$
>
> Nếu $a^{n-1} \equiv 1 \pmod n$ nhưng $n$ hợp số, ta gọi $n$ là **giả nguyên tố Fermat** (Fermat pseudoprime) theo cơ số $a$.

### Thuật Toán Test Fermat

```text
Input: n (số lẻ cần kiểm tra), k (số lần thử)
Output: "probably prime" hoặc "composite"

For i = 1 to k:
    Chọn ngẫu nhiên a ∈ {2, 3, ..., n-2}
    Tính r = a^(n-1) mod n
    If r ≠ 1:
        Return "composite"   // Phát hiện nhân chứng Fermat
Return "probably prime"
```

> [!example] Example 26.2 — Kiểm tra $n = 341$ với $a = 2$
> $340 = 4 \times 85$. Ta tính $2^{340} \pmod{341}$:
>
> $2^{10} = 1024 = 3 \times 341 - 1 \equiv -1 \pmod{341}$ (vì $3 \times 341 = 1023$, $2^{10} = 1024 \equiv 1 \pmod{341}$... thực ra $1024 = 3 \times 341 + 1$, nên $2^{10} \equiv 1 \pmod{341}$).
>
> Do đó $2^{340} = (2^{10})^{34} \equiv 1^{34} = 1 \pmod{341}$.
>
> Nhưng $341 = 11 \times 31$ là **hợp số**! Đây là Fermat pseudoprime cơ số 2.

> [!definition] Definition 26.3 — Fermat Pseudoprime
> Số hợp số $n$ với $a^{n-1} \equiv 1 \pmod n$ (và $\gcd(a,n)=1$) gọi là **Fermat pseudoprime theo cơ số $a$** (ký hiệu: $n$ là $psp(a)$).
>
> Các ví dụ $psp(2)$ nhỏ nhất: $341, 561, 645, 1105, 1387, \ldots$

---

## Số Carmichael — Kẻ Thù Của Test Fermat

### Định Nghĩa

> [!definition] Definition 26.4 — Số Carmichael (Absolute Fermat Pseudoprime)
> Số hợp số $n$ được gọi là **số Carmichael** (Carmichael number) nếu với **mọi** $a$ với $\gcd(a, n) = 1$:
>
> $$
> a^{n-1} \equiv 1 \pmod{n}
> $$
>
> Tức là $n$ qua test Fermat với **mọi cơ số** $a$ nguyên tố cùng nhau với $n$.

Số Carmichael nhỏ nhất: $\mathbf{561} = 3 \times 11 \times 17$.

Kiểm tra $561$: $560 = 2^4 \times 5 \times 7$. Ta cần $a^{560} \equiv 1 \pmod{561}$ với mọi $\gcd(a, 561) = 1$.

### Tiêu Chuẩn Korselt

> [!theorem] Theorem 26.5 — Tiêu Chuẩn Korselt (Korselt's Criterion, 1899)
> Số nguyên dương lẻ $n$ là số Carmichael khi và chỉ khi:
>
> (K1) $n$ **square-free**: không có ước nguyên tố bình phương (tức $p^2 \nmid n$ với mọi $p \mid n$)
>
> (K2) Với mọi số nguyên tố $p \mid n$: $(p - 1) \mid (n - 1)$

**Chứng minh ($\Rightarrow$).**

Giả sử $n$ là Carmichael number và $p \mid n$.

**Bước 1: $n$ square-free.** Giả sử $p^2 \mid n$. Chọn $a = p^{n/p^2}$ (hoặc dùng đối số khác: với $a = p + 1$, ta có $a^{n-1} \equiv 1 \pmod{p^2}$, nhưng điều này dẫn đến mâu thuẫn vì $a^{n-1} - 1 \equiv (p+1)^{n-1} - 1 \equiv (n-1)p \not\equiv 0 \pmod{p^2}$ khi $p \nmid (n-1)$...). Lập luận chính xác hơn: tồn tại $a$ là primitive root mod $p^2$ nếu $p$ lẻ. Thì $\text{ord}_{p^2}(a) = p(p-1)$. Vì $a^{n-1} \equiv 1 \pmod{p^2}$ (do $a^{n-1} \equiv 1 \pmod n$ và $p^2 \mid n$), ta cần $p(p-1) \mid (n-1)$. Nhưng $p \mid n$ và $p \mid p(p-1)$ nên $p \mid (n-1)$, mâu thuẫn với $p \mid n$ và $\gcd(n, n-1) = 1$. Vậy $p^2 \nmid n$.

**Bước 2: $(p-1) \mid (n-1)$.** Xét $a$ là primitive root modulo $p$ (tồn tại vì $p$ nguyên tố, bài 11). Thì $\text{ord}_p(a) = p - 1$. Vì $n$ Carmichael, $a^{n-1} \equiv 1 \pmod n$, suy ra $a^{n-1} \equiv 1 \pmod p$. Vậy $(p-1) \mid (n-1)$.

**Chứng minh ($\Leftarrow$).**

Giả sử $n = p_1 p_2 \cdots p_r$ (square-free) và $(p_i - 1) \mid (n-1)$ với mọi $i$.

Với $\gcd(a, n) = 1$: $\gcd(a, p_i) = 1$ với mọi $i$. Fermat's Little Theorem: $a^{p_i - 1} \equiv 1 \pmod{p_i}$. Vì $(p_i - 1) \mid (n-1)$, ta có $a^{n-1} = (a^{p_i - 1})^{(n-1)/(p_i-1)} \equiv 1 \pmod{p_i}$.

Điều này đúng với mọi $p_i$, và vì $n = p_1 \cdots p_r$ (phân biệt), theo CRT: $a^{n-1} \equiv 1 \pmod n$. $\blacksquare$

> [!example] Example 26.6 — Xác nhận $561 = 3 \times 11 \times 17$ là Carmichael
> - $3 - 1 = 2 \mid 560$ ✓
> - $11 - 1 = 10 \mid 560$ ✓ (vì $560 = 10 \times 56$)
> - $17 - 1 = 16 \mid 560$ ✓ (vì $560 = 16 \times 35$)
>
> Tất cả điều kiện Korselt thỏa. Vậy $561$ là Carmichael number.

> [!example] Example 26.7 — Xây dựng Carmichael số từ 3 số nguyên tố
> Tìm Carmichael số dạng $n = pqr$ với $p < q < r$ số nguyên tố.
>
> Ta cần: $p-1 \mid n-1$, $q-1 \mid n-1$, $r-1 \mid n-1$.
>
> Thử $p=3, q=11, r=17$: $n = 561$, $n-1 = 560 = 2^4 \cdot 5 \cdot 7$. Check: $2 \mid 560$ ✓, $10 \mid 560$ ✓, $16 \mid 560$ ✓.
>
> Thử $p=3, q=7, r=13$: $n = 273$, $n-1=272=2^4 \cdot 17$. Check: $2 \mid 272$ ✓, $6 \mid 272$? $272/6 = 45.3...$ ✗. Không phải Carmichael.

### Số Carmichael Là Vô Hạn

> [!theorem] Theorem 26.8 — Vô Hạn Số Carmichael (Alford, Granville, Pomerance, 1994)
> Có vô hạn số Carmichael. Cụ thể, số Carmichael $\leq x$ là $\Omega(x^{2/7})$.

Đây là kết quả **không tầm thường**, được chứng minh năm 1994 sau hơn 80 năm là câu hỏi mở.

---

## Test Miller-Rabin

Test Fermat thất bại với số Carmichael. Miller-Rabin khắc phục bằng cách kiểm tra mạnh hơn.

### Ý Tưởng: Căn Bậc Hai Không Tầm Thường của 1

> [!theorem] Theorem 26.9 — Căn Bậc Hai của 1 Modulo Số Nguyên Tố
> Nếu $p$ là số nguyên tố, phương trình $x^2 \equiv 1 \pmod p$ chỉ có hai nghiệm: $x \equiv 1$ và $x \equiv -1$.

**Chứng minh.** $x^2 - 1 = (x-1)(x+1) \equiv 0 \pmod p$. Vì $p$ nguyên tố, $p \mid (x-1)$ hoặc $p \mid (x+1)$. $\blacksquare$

**Tư tưởng Miller-Rabin:** Nếu $n$ là số nguyên tố và $a^{n-1} \equiv 1 \pmod n$, ta có thể "theo dõi" chuỗi bình phương ngược:

$$
a^{n-1} = \left(\cdots \left((a^d)^2\right)^2 \cdots\right)^2
$$

Bất cứ lúc nào chuỗi này "nhảy" từ $1$ trở lại, bước trước đó phải là $\pm 1$ — vì $1$ chỉ có hai căn bậc hai là $\pm 1$.

### Phân Tích $n - 1 = 2^s \cdot d$ ($d$ Lẻ)

> [!definition] Definition 26.10 — Phân Tích 2-adic của $n - 1$
> Với số lẻ $n > 1$, ta viết:
>
> $$
> n - 1 = 2^s \cdot d, \qquad s \geq 1, \quad d \text{ lẻ}
> $$
>
> Ví dụ: $n = 561$, $n-1 = 560 = 2^4 \cdot 35$, nên $s = 4$, $d = 35$.

### Định Nghĩa Strong Pseudoprime

> [!definition] Definition 26.11 — Strong Pseudoprime và Miller-Rabin Witness
> Với số lẻ $n > 1$, $n-1 = 2^s d$ ($d$ lẻ), và $a$ với $\gcd(a,n) = 1$:
>
> Ta nói $n$ **vượt test Miller-Rabin cơ số $a$** (hoặc $n$ là **strong probable prime** theo cơ số $a$) nếu:
>
> $$
> a^d \equiv 1 \pmod n \qquad \text{(điều kiện A)}
> $$
>
> hoặc:
>
> $$
> a^{2^r d} \equiv -1 \pmod n \quad \text{với một } r \in \{0, 1, \ldots, s-1\} \qquad \text{(điều kiện B)}
> $$
>
> Nếu $n$ **không** vượt test (tức cả A và B đều sai), thì $a$ là **Miller-Rabin witness** (nhân chứng) cho tính hợp số của $n$.
>
> Nếu $n$ vượt test nhưng là hợp số, ta gọi $n$ là **strong pseudoprime** theo cơ số $a$.

### Tại Sao Số Nguyên Tố Luôn Vượt Test?

> [!theorem] Theorem 26.12 — Số Nguyên Tố Luôn Vượt Test Miller-Rabin
> Nếu $p$ là số nguyên tố và $\gcd(a, p) = 1$, thì $p$ vượt test Miller-Rabin với mọi cơ số $a$.

**Chứng minh.** Bằng Fermat's Little Theorem: $a^{p-1} = a^{2^s d} \equiv 1 \pmod p$.

Xét chuỗi $a^d, a^{2d}, a^{4d}, \ldots, a^{2^s d}$. Mỗi số hạng là bình phương của số hạng trước. Số hạng cuối $\equiv 1 \pmod p$.

Theo Theorem 26.9, mỗi lần chuỗi "đạt 1", bước trước phải là $\pm 1$. Vì $p$ nguyên tố và $\pm 1$ là hai căn bậc hai duy nhất của $1$ modulo $p$.

**Trường hợp 1:** $a^d \equiv 1 \pmod p$ → điều kiện A thỏa.

**Trường hợp 2:** $a^d \not\equiv 1 \pmod p$. Vì chuỗi kết thúc tại $1$, phải có lần đầu tiên $a^{2^r d} \equiv 1$. Khi đó $a^{2^{r-1} d}$ là căn bậc hai của $1$ modulo $p$, nên $a^{2^{r-1} d} \equiv \pm 1$. Không thể là $+1$ (vì đó là "lần đầu" đạt $1$). Vậy $a^{2^{r-1} d} \equiv -1$ → điều kiện B thỏa với $r' = r - 1$. $\blacksquare$

### Phân Tích Sai Số: Cận $1/4$

> [!theorem] Theorem 26.13 — Rabin-Monier (1980)
> Nếu $n$ là **số hợp số lẻ**, thì số cơ số $a \in \{1, 2, \ldots, n-1\}$ mà $n$ vượt test Miller-Rabin thỏa mãn:
>
> $$
> |\{a \in (\mathbb{Z}/n\mathbb{Z})^* : n \text{ vượt test với cơ số } a\}| \leq \frac{n-1}{4}
> $$
>
> Tức là ít nhất $3/4$ cơ số ngẫu nhiên phát hiện ra $n$ là hợp số.

Đây là kết quả mạnh hơn test Fermat nhiều: không tồn tại "Carmichael number" cho Miller-Rabin (vì cận $1/4$ đúng với **mọi** số hợp số, không có ngoại lệ).

**Chứng minh (phác thảo).** Tập các "không-nhân-chứng" (non-witnesses) tạo thành một **nhóm con** của $(\mathbb{Z}/n\mathbb{Z})^*$. Rabin–Monier chỉ ra nhóm con này có chỉ số ít nhất $4$ trong $(\mathbb{Z}/n\mathbb{Z})^*$, tức có bậc $\leq \varphi(n)/4 < n/4$. $\blacksquare$

### Thuật Toán Miller-Rabin Đầy Đủ

```text
Input: n (số lẻ > 1 cần kiểm tra), k (số vòng lặp)
Output: "probably prime" hoặc "composite"

1. Viết n - 1 = 2^s * d (d lẻ)
2. Repeat k times:
   a. Chọn ngẫu nhiên a ∈ {2, 3, ..., n-2}
   b. Tính x = a^d mod n
   c. If x == 1 or x == n-1: continue  // Điều kiện A hoặc B với r=0
   d. For r = 1 to s-1:
        x = x^2 mod n
        If x == n-1: goto next_iteration  // Điều kiện B
   e. Return "composite"  // Không thỏa A hoặc B
3. Return "probably prime"
```

**Độ phức tạp:** Mỗi vòng lặp cần tính $a^d \pmod n$ bằng fast exponentiation: $O(\log n \cdot \log^2 n)$ phép tính bit. Tổng: $O(k \log^3 n)$.

**Xác suất sai số:** Sau $k$ vòng độc lập, xác suất false positive (tức $n$ hợp số nhưng vượt tất cả $k$ test) là $\leq (1/4)^k$.

- $k = 10$: sai số $\leq 4^{-10} \approx 10^{-6}$
- $k = 40$: sai số $\leq 4^{-40} \approx 10^{-24}$

### Phiên Bản Quyết Định (Deterministic)

> [!theorem] Theorem 26.14 — Miller-Rabin Tất Định (Miller, 1976)
> Giả sử **Giả Thuyết Riemann Tổng Quát** (GRH), thì với mọi số hợp số $n$, tồn tại Miller-Rabin witness $a < 2(\ln n)^2$. Do đó kiểm tra tất cả cơ số $a \leq 2(\ln n)^2$ cho thuật toán **tất định, đa thức** để kiểm tra tính nguyên tố.

> [!theorem] Theorem 26.15 — Kết Quả Vô Điều Kiện (Pomerance et al.)
> Không cần GRH, nếu $n < 3{,}215{,}031{,}751$ thì chỉ cần kiểm tra $a \in \{2, 3, 5, 7\}$.
>
> Tổng quát hơn: có các giá trị hữu hạn cụ thể của $a$ đủ để test tất định lên đến các ngưỡng lớn:
>
> | Ngưỡng $n <$ | Tập cơ số đủ |
> |---|---|
> | $2{,}047$ | $\{2\}$ |
> | $1{,}373{,}653$ | $\{2, 3\}$ |
> | $9{,}080{,}191$ | $\{31, 73\}$ |
> | $3{,}215{,}031{,}751$ | $\{2, 3, 5, 7\}$ |
> | $3{,}317{,}044{,}064{,}679{,}887{,}385{,}961{,}981$ | $\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\}$ |

---

## Kiểm Tra Số Dạng Đặc Biệt

Một số dạng số đặc biệt cho phép kiểm tra tính nguyên tố **tất định** và nhanh hơn nhiều so với Miller-Rabin tổng quát.

### Định Lý Proth (Proth's Theorem)

> [!theorem] Theorem 26.16 — Định Lý Proth (Proth, 1878)
> Cho $n = k \cdot 2^m + 1$ với $k$ lẻ và $k < 2^m$. Nếu tồn tại $a$ sao cho:
>
> $$
> a^{(n-1)/2} \equiv -1 \pmod{n}
> $$
>
> thì $n$ là số nguyên tố.

> [!example] Example 26.17 — Kiểm tra Proth
>
> $n = 3 \times 2^3 + 1 = 25$: $k = 3 < 2^3 = 8$. $a = 2$: $2^{12} \equiv 4096 \equiv 21 \not\equiv -1 \pmod{25}$. Không kết luận được (và $25 = 5^2$ là hợp số). ✓
>
> $n = 5 \times 2^4 + 1 = 81$: $k = 5 < 16$. $81 = 9^2$ hợp số. Thử $a = 2$: $2^{40} \bmod 81 = ?$ Không cần vì $81$ hiển nhiên hợp số.
>
> $n = 3 \times 2^4 + 1 = 49$: $k = 3 < 16$. $49 = 7^2$ hợp số.

**Ứng dụng:** Định lý Proth được dùng để kiểm tra các số dạng $k \cdot 2^n + 1$ (Proth numbers) — những số này quan trọng trong việc tìm số nguyên tố lớn, bao gồm nhiều số nguyên tố lớn nhất từng được tìm thấy. Dự án PrimeGrid dùng Proth's theorem để tìm các số nguyên tố khổng lồ.

### Kiểm Tra Lucas (Lucas Primality Test)

> [!theorem] Theorem 26.18 — Lucas Primality Test
> Cho $n > 1$. Nếu tồn tại $a$ sao cho:
>
> $$
> a^{n-1} \equiv 1 \pmod{n}
> $$
>
> và với mọi ước nguyên tố $q$ của $n-1$:
>
> $$
> a^{(n-1)/q} \not\equiv 1 \pmod{n}
> $$
>
> thì $n$ là số nguyên tố. (Khi đó $a$ là primitive root modulo $n$.)

**Ý tưởng:** Điều kiện nói rằng $\text{ord}_n(a) = n-1$, tức $a$ là primitive root. Vì $\text{ord}_n(a) \mid \varphi(n)$ và $\varphi(n) \leq n-1$ (dấu bằng chỉ khi $n$ nguyên tố), ta có $n$ nguyên tố.

> [!note] Remark 26.19 — Lucas và chứng chỉ nguyên tố (Primality Certificate)
> Lucas test cần biết đầy đủ phân tích nguyên tố của $n-1$ — điều này hiếm khi xảy ra với số ngẫu nhiên. Nhưng khi có phân tích này, nó cung cấp **chứng chỉ nguyên tố** (primality certificate) có thể kiểm tra nhanh: một primitive root $a$ cùng danh sách ước nguyên tố của $n-1$.
>
> Biến thể **Pocklington** và **Brillhart–Lehmer–Selfridge** cho phép chứng minh tính nguyên tố khi chỉ biết phân tích một phần của $n-1$.

---

## So Sánh Các Test

| Test | Nền tảng | Sai số | Xử lý Carmichael | Độ phức tạp |
|---|---|---|---|---|
| Thử chia | Trực tiếp | Không sai | ✓ | $O(\sqrt{n})$ — quá chậm |
| Fermat | Fermat's Little Theorem | Sai với Carmichael | ✗ | $O(k \log^3 n)$ |
| Euler/Solovay-Strassen | Euler Criterion + Jacobi | $\leq (1/2)^k$ | Tốt hơn | $O(k \log^3 n)$ |
| **Miller-Rabin** | Căn bậc hai của 1 | $\leq (1/4)^k$ | ✓ (không ngoại lệ) | $O(k \log^3 n)$ |
| AKS | Toán học đại số | Tuyệt đối | ✓ | $O(\log^{6+\varepsilon} n)$ |

> [!note] Remark 26.16 — AKS và PRIMES $\in$ P
> Năm 2002, Agrawal, Kayal, Saxena (sinh viên IIT Kanpur) chứng minh **PRIMES $\in$ P**: kiểm tra tính nguyên tố có thuật toán tất định thời gian đa thức, không cần GRH. Thuật toán AKS là kết quả lý thuyết đột phá, nhưng trong thực hành vẫn dùng Miller-Rabin vì hiệu quả hơn với $k$ nhỏ.

---

## SageMath

```python
# Test Fermat
def fermat_test(n, a):
    """Kiểm tra Fermat: True nếu n vượt test cơ số a."""
    return pow(a, n - 1, n) == 1

# Fermat pseudoprimes nhỏ (base 2)
def find_fermat_pseudoprimes(bound):
    from sage.all import is_prime
    pseudoprimes = []
    for n in range(3, bound, 2):
        if not is_prime(n) and fermat_test(n, 2):
            pseudoprimes.append(n)
    return pseudoprimes

psp2 = find_fermat_pseudoprimes(10000)
print("Fermat pseudoprimes (base 2) < 10000:", psp2[:10])

# Tiêu chuẩn Korselt: kiểm tra Carmichael
def is_carmichael(n):
    """Kiểm tra n có phải Carmichael số không (dùng tiêu chuẩn Korselt)."""
    from sage.all import is_prime, factor
    if is_prime(n) or n < 2:
        return False
    f = factor(n)
    # Kiểm tra square-free
    if any(e > 1 for _, e in f):
        return False
    # Kiểm tra (p-1) | (n-1)
    n_minus_1 = n - 1
    for p, _ in f:
        if n_minus_1 % (p - 1) != 0:
            return False
    return True

carmichaels = [n for n in range(3, 10000, 2) if is_carmichael(n)]
print("Số Carmichael < 10000:", carmichaels)

# Miller-Rabin từ đầu
def miller_rabin_witness(n, a):
    """
    Kiểm tra Miller-Rabin: trả về True nếu a là witness (tức n CHẮC CHẮN hợp số).
    Trả về False nếu n vượt test với cơ số a.
    """
    if n % 2 == 0:
        return n != 2
    # Chuẩn hóa a về [2, n-2]; nếu a ⋮ n thì a không thể là witness hữu ích
    a = a % n
    if a <= 1 or a >= n - 1:
        return False
    # Viết n-1 = 2^s * d
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    # Tính x = a^d mod n
    x = pow(a, d, n)
    if x == 1 or x == n - 1:
        return False  # Không phải witness (vượt test, điều kiện A hoặc B với r=0)
    for _ in range(s - 1):
        x = pow(x, 2, n)
        if x == n - 1:
            return False  # Điều kiện B thỏa
    return True  # a là witness -> n hợp số

def miller_rabin(n, k=20):
    """
    Miller-Rabin test với k vòng ngẫu nhiên.
    Trả về True nếu n 'probably prime', False nếu chắc chắn hợp số.
    """
    import random
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    for _ in range(k):
        a = random.randrange(2, n - 1)
        if miller_rabin_witness(n, a):
            return False
    return True  # Probably prime

# Test trên các ví dụ
test_cases = [
    (341, False),   # Fermat pseudoprime, nhưng MR phát hiện hợp số
    (561, False),   # Carmichael, nhưng MR phát hiện hợp số
    (1009, True),   # Số nguyên tố thực
    (15, False),    # Hợp số hiển nhiên
    (104729, True), # Số nguyên tố lớn
]

for n, expected in test_cases:
    result = miller_rabin(n, k=20)
    status = "✓" if result == expected else "✗"
    print(f"{status} n={n}: MR={'prime' if result else 'composite'}, "
          f"actual={'prime' if expected else 'composite'}")

# Đếm strong pseudoprimes
def find_strong_pseudoprimes(bound, base):
    """Tìm strong pseudoprimes theo cơ số `base`."""
    from sage.all import is_prime
    spsp = []
    for n in range(3, bound, 2):
        if not is_prime(n) and not miller_rabin_witness(n, base):
            spsp.append(n)
    return spsp

spsp2 = find_strong_pseudoprimes(10000, 2)
print(f"Strong pseudoprimes (base 2) < 10000: {spsp2[:10]}")

# Phân tích chuỗi bình phương cho n = 341 (Fermat psp)
def analyze_miller_rabin_chain(n, a):
    """Truy vết chuỗi bình phương trong Miller-Rabin."""
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    x = pow(a, d, n)
    print(f"n={n}, a={a}, n-1=2^{s}*{d}")
    print(f"a^d mod n = {x}")
    chain = [x]
    for i in range(s):
        x = pow(x, 2, n)
        chain.append(x)
        print(f"a^(2^{i+1}*d) mod n = {x}")
    return chain

print("\nAnalysis of n=341, a=2:")
analyze_miller_rabin_chain(341, 2)

print("\nAnalysis of n=561 (Carmichael), a=2:")
analyze_miller_rabin_chain(561, 2)
```

---

## Tóm Tắt

**Test Fermat**: $a^{n-1} \equiv 1 \pmod n$ là điều kiện cần cho số nguyên tố. Số hợp số thỏa điều kiện này là **Fermat pseudoprime**. **Số Carmichael** (ví dụ $561 = 3 \times 11 \times 17$) là giả nguyên tố tuyệt đối — qua test với mọi cơ số $a$ nguyên tố cùng nhau với $n$.

**Tiêu chuẩn Korselt**: $n$ là Carmichael $\iff$ $n$ square-free và $(p-1) \mid (n-1)$ với mọi $p \mid n$.

**Test Miller-Rabin**: Phân tích $n - 1 = 2^s d$ ($d$ lẻ). Kiểm tra mạnh hơn: số nguyên tố phải thỏa $a^d \equiv 1$ hoặc $a^{2^r d} \equiv -1 \pmod n$ với một $r$. Không có Carmichael tương tự: với mọi số hợp số $n$, **ít nhất $3/4$ cơ số** là witness. Sau $k$ vòng độc lập, xác suất sai số $\leq (1/4)^k$.

**AKS (2002)**: PRIMES $\in$ P — thuật toán tất định thời gian đa thức, hoàn thiện về lý thuyết nhưng Miller-Rabin vẫn thực dụng hơn.
