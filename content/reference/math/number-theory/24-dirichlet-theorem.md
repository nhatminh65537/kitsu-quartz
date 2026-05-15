---
title: "24. Số Nguyên Tố Trong Cấp Số Cộng — Định Lý Dirichlet"
type: theory
tags: [math, number-theory, lesson-24]
aliases: [Dirichlet Theorem, Primes in Arithmetic Progressions]
created: 2026-05-15
---

> **Prerequisites**: [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]], [[21-dirichlet-convolution-and-mobius|21. Tích Chập Dirichlet và Hàm Möbius]], [[23-infinitude-of-primes|23. Vô Hạn Số Nguyên Tố]]
> **Objectives**:
> - Phát biểu chính xác Định Lý Dirichlet về số nguyên tố trong cấp số cộng
> - Chứng minh sơ cấp các trường hợp đặc biệt: $4k+3$ và $4k+1$
> - Hiểu ý tưởng tổng quát qua character Dirichlet và $L$-function (ở mức phác thảo)
> - Nắm khái niệm mật độ Dirichlet và ý nghĩa phân phối đều
> - Tính toán và khám phá phân phối số nguyên tố trong AP bằng SageMath

---

## Motivation / Intuition

Sau khi biết số nguyên tố vô hạn, câu hỏi tự nhiên tiếp theo là: chúng phân phối như thế nào trong các dãy số học?

Xét dãy số lẻ: $1, 3, 5, 7, 9, 11, 13, 15, \ldots$ Đây là cấp số cộng (arithmetic progression — AP) với $a = 1$, $d = 2$. Các số nguyên tố lẻ ($3, 5, 7, 11, 13, \ldots$) đều nằm trong dãy này — nhưng dãy này gồm cả hợp số như $9, 15, 21, \ldots$

Câu hỏi của Legendre (1788) và Dirichlet (1837): **Trong cấp số cộng $a, a+d, a+2d, \ldots$ (với $\gcd(a,d) = 1$), có vô hạn số nguyên tố không?**

Điều kiện $\gcd(a,d) = 1$ là bắt buộc: nếu $g = \gcd(a,d) > 1$ thì mọi số trong dãy đều chia hết cho $g$, nên chỉ có thể có tối đa một số nguyên tố.

Dirichlet (1837) đã trả lời: **Có**, và chứng minh bằng công cụ giải tích đột phá.

---

## Các Trường Hợp Sơ Cấp

Trước khi đến định lý tổng quát, ta chứng minh sơ cấp một số trường hợp đặc biệt — mỗi trường hợp là một bài tập kinh điển.

### Trường hợp $4k + 3$: Vô hạn số nguyên tố $\equiv 3 \pmod{4}$

> [!theorem] Theorem 24.1 — Vô Hạn Số Nguyên Tố Dạng $4k + 3$
> Có vô hạn số nguyên tố $p$ với $p \equiv 3 \pmod{4}$.

**Chứng minh.** Giả sử ngược lại, danh sách đầy đủ là $p_1 = 3, p_2, p_3, \ldots, p_r$ (tất cả các số nguyên tố $\equiv 3 \pmod 4$).

Xét:
$$
N = 4 p_1 p_2 \cdots p_r - 1 = 4(p_1 p_2 \cdots p_r) - 1
$$

Ta thấy $N \equiv 3 \pmod{4}$. Xét phân tích nguyên tố $N = q_1 q_2 \cdots q_s$.

Mỗi $q_i$ là số lẻ (vì $N$ lẻ), nên $q_i \equiv 1 \pmod 4$ hoặc $q_i \equiv 3 \pmod 4$.

Nếu **tất cả** $q_i \equiv 1 \pmod 4$, thì tích $N \equiv 1 \pmod 4$ — mâu thuẫn vì $N \equiv 3 \pmod 4$.

Do đó tồn tại ít nhất một $q_j \equiv 3 \pmod 4$. Nhưng $q_j \nmid p_i$ với mọi $i$ (vì $N = 4p_1\cdots p_r - 1 \equiv -1 \pmod{p_i}$). Vậy $q_j$ là số nguyên tố $\equiv 3 \pmod 4$ không nằm trong danh sách — mâu thuẫn. $\blacksquare$

> [!note] Remark 24.2 — Tại sao phương pháp này không hoạt động với $4k+1$?
> Với dạng $4k+1$, ta cần tích của các số $\equiv 1 \pmod 4$ vẫn $\equiv 1 \pmod 4$ — điều này đúng! Nên không có mâu thuẫn tương tự. Để chứng minh $4k+1$, cần dùng phương pháp khác (xem dưới).

### Trường hợp $4k + 1$: Vô hạn số nguyên tố $\equiv 1 \pmod{4}$

> [!theorem] Theorem 24.3 — Vô Hạn Số Nguyên Tố Dạng $4k + 1$
> Có vô hạn số nguyên tố $p$ với $p \equiv 1 \pmod{4}$.

**Chứng minh.** Bài 16 (Tiêu Chuẩn Euler) cho ta: số nguyên tố $p$ chia hết $m^2 + 1$ nếu và chỉ nếu $p = 2$ hoặc $p \equiv 1 \pmod 4$.

Giả sử danh sách đầy đủ là $p_1, p_2, \ldots, p_r$ (tất cả số nguyên tố $\equiv 1 \pmod 4$). Xét:
$$
N = (2 p_1 p_2 \cdots p_r)^2 + 1
$$

$N$ là dương và $N > 1$, nên có ước nguyên tố $q$. Thì $q \mid N$ tức $q \mid (2p_1\cdots p_r)^2 + 1$, nghĩa là $-1$ là thặng dư bậc hai modulo $q$.

Theo bài 16 (Euler's Criterion): $\left(\frac{-1}{q}\right) = 1$ khi và chỉ khi $q \equiv 1 \pmod 4$. Vậy $q \equiv 1 \pmod 4$.

Nhưng với mọi $i$: $p_i \mid 2p_1\cdots p_r$, nên $p_i^2 \mid (2p_1\cdots p_r)^2$, do đó $p_i \nmid N$ (vì $N \equiv 0 + 1 = 1 \pmod{p_i}$). Vậy $q$ là số nguyên tố $\equiv 1 \pmod 4$ không trong danh sách — mâu thuẫn. $\blacksquare$

### Trường hợp $6k + 5$ và $3k + 2$

> [!example] Example 24.4 — Vô hạn số nguyên tố $\equiv 2 \pmod{3}$
> **Chứng minh tương tự Theorem 24.1.** Xét $N = 3p_1p_2\cdots p_r - 1 \equiv 2 \pmod 3$. Vì mọi $q_j \equiv 1$ hoặc $2 \pmod 3$, và tích $\equiv 2$ nên phải có ít nhất một $q_j \equiv 2 \pmod 3$. Ta kiểm tra $q_j \nmid p_i$ tương tự, dẫn đến mâu thuẫn.

---

## Định Lý Dirichlet — Phát Biểu Tổng Quát

> [!theorem] Theorem 24.5 — Định Lý Dirichlet về Số Nguyên Tố Trong AP (1837)
> Cho $a, d \in \mathbb{Z}^+$ với $\gcd(a, d) = 1$. Khi đó có **vô hạn** số nguyên tố $p$ sao cho:
>
> $$
> p \equiv a \pmod{d}
> $$
>
> Hơn nữa, số nguyên tố **phân phối đều** giữa các lớp đồng dư $a$ với $\gcd(a,d)=1$:
>
> $$
> \lim_{x \to \infty} \frac{\pi(x; d, a)}{\pi(x)} = \frac{1}{\varphi(d)}
> $$
>
> trong đó $\pi(x; d, a) = |\{p \leq x : p \equiv a \pmod d\}|$.

> [!note] Remark 24.6 — Điều kiện $\gcd(a,d)=1$ là cần thiết
> Nếu $\gcd(a,d) = g > 1$ thì mọi $a + kd$ đều chia hết cho $g$, nên chỉ có thể có số nguyên tố nếu $a + kd = g$ (trường hợp đặc biệt $g$ nguyên tố), tức không có vô hạn.

---

## Ý Tưởng Chứng Minh: Character Dirichlet và $L$-Function

Phương pháp của Dirichlet (và cho đến ngày nay, không có chứng minh sơ cấp hoàn toàn tổng quát) dựa trên hai công cụ mạnh: **character Dirichlet** và **hàm $L$ của Dirichlet**.

### Character Dirichlet

> [!definition] Definition 24.7 — Character Dirichlet (Dirichlet Character)
> Một **character Dirichlet** modulo $d$ là hàm $\chi : \mathbb{Z} \to \mathbb{C}$ thỏa mãn:
>
> (i) **Tuần hoàn**: $\chi(n + d) = \chi(n)$ với mọi $n$.
>
> (ii) **Nhân tính**: $\chi(mn) = \chi(m)\chi(n)$ với mọi $m, n$.
>
> (iii) $\chi(n) = 0$ khi $\gcd(n, d) > 1$; $\chi(n) \neq 0$ khi $\gcd(n, d) = 1$.
>
> Character **tầm thường** (principal character) $\chi_0$ có $\chi_0(n) = 1$ khi $\gcd(n,d)=1$ và $0$ khi không.

**Ví dụ:** Với $d = 4$, có 2 character:
- $\chi_0$: $\chi_0(1) = 1$, $\chi_0(3) = 1$, $\chi_0(0) = \chi_0(2) = 0$
- $\chi_1$: $\chi_1(1) = 1$, $\chi_1(3) = -1$, $\chi_1(0) = \chi_1(2) = 0$

**Tính chất trực giao (Orthogonality).** Tập tất cả character modulo $d$ có đúng $\varphi(d)$ phần tử và thỏa mãn:

$$
\frac{1}{\varphi(d)} \sum_{\chi \bmod d} \chi(n) \overline{\chi(a)} = \begin{cases} 1 & \text{nếu } n \equiv a \pmod d \\ 0 & \text{ngược lại} \end{cases}
$$

Đây là **công thức trực giao** — chìa khóa để "lọc" lớp đồng dư cụ thể.

### Hàm $L$ của Dirichlet

> [!definition] Definition 24.8 — Hàm $L$ của Dirichlet
> Với character $\chi$ modulo $d$ và $s > 1$ thực:
>
> $$
> L(s, \chi) = \sum_{n=1}^{\infty} \frac{\chi(n)}{n^s} = \prod_{p \nmid d} \frac{1}{1 - \chi(p) p^{-s}}
> $$
>
> (Tích Euler tương tự như hàm zeta, nhưng được "điều chế" bởi character $\chi$.)

Kết hợp công thức trực giao với $L$-function:

$$
\sum_{\substack{p \leq x \\ p \equiv a \pmod d}} \frac{1}{p} = \frac{1}{\varphi(d)} \sum_{\chi \bmod d} \overline{\chi(a)} \sum_{p \leq x} \frac{\chi(p)}{p}
$$

### Bước quyết định: $L(1, \chi) \neq 0$ với $\chi \neq \chi_0$

Ý tưởng chứng minh của Dirichlet gồm hai phần:

**Phần 1 (character tầm thường $\chi_0$).** Ta có:

$$
L(s, \chi_0) = \prod_{p \nmid d} \frac{1}{1 - p^{-s}} = \zeta(s) \cdot \prod_{p \mid d} (1 - p^{-s})
$$

Khi $s \to 1^+$, $\zeta(s) \to \infty$, nên $\sum_p \chi_0(p)/p$ phân kỳ.

**Phần 2 (character không tầm thường $\chi \neq \chi_0$).** Ta cần chứng minh $L(1, \chi) \neq 0$.

Đây là phần khó nhất — Dirichlet phân chia thành hai trường hợp:
- **Character phức** ($\chi \neq \bar\chi$): $L(1,\chi) \neq 0$ theo lập luận đại số.
- **Character thực** ($\chi = \bar\chi$, tức $\chi$ nhận giá trị $0, \pm 1$): cần lập luận tinh tế hơn.

Cuối cùng:

$$
\sum_{\substack{p \leq x \\ p \equiv a \pmod d}} \frac{1}{p} \sim \frac{1}{\varphi(d)} \log\log x \to \infty
$$

Do đó có vô hạn số nguyên tố $p \equiv a \pmod d$. $\blacksquare$ (phác thảo)

---

## Mật Độ Dirichlet và Phân Phối Đều

### Mật độ tự nhiên và Dirichlet

> [!definition] Definition 24.9 — Mật Độ Dirichlet (Dirichlet Density)
> Tập $S$ các số nguyên tố có **mật độ Dirichlet** $\delta(S)$ nếu:
>
> $$
> \lim_{s \to 1^+} \frac{\sum_{p \in S} p^{-s}}{\log(1/(s-1))} = \delta(S)
> $$

> [!theorem] Theorem 24.10 — Phân Phối Đều Số Nguyên Tố (Dirichlet Density)
> Với $\gcd(a, d) = 1$, tập $\{p : p \equiv a \pmod d\}$ có mật độ Dirichlet $\frac{1}{\varphi(d)}$.

Kết quả này mạnh hơn: không chỉ có vô hạn số nguyên tố trong mỗi lớp, mà chúng còn **phân phối đều** giữa $\varphi(d)$ lớp khả nghịch. Ví dụ:

| $d$ | Các lớp $a$ có số nguyên tố | Số lớp = $\varphi(d)$ | Mật độ mỗi lớp |
|---|---|---|---|
| $4$ | $1, 3$ | $2$ | $1/2$ |
| $6$ | $1, 5$ | $2$ | $1/2$ |
| $10$ | $1, 3, 7, 9$ | $4$ | $1/4$ |
| $12$ | $1, 5, 7, 11$ | $4$ | $1/4$ |

### Hệ quả: Định lý Linnik

> [!theorem] Theorem 24.11 — Định Lý Linnik (1944, không chứng minh)
> Với $\gcd(a, d) = 1$, số nguyên tố nhỏ nhất $p \equiv a \pmod d$ thỏa mãn $p \leq C \cdot d^L$ với hằng số tuyệt đối $C, L > 0$.
>
> Hiện tại, giá trị tốt nhất đã biết là $L \leq 2$.

---

## Ví Dụ Tính Toán

> [!example] Example 24.12 — Phân Phối Số Nguyên Tố modulo 10
> Theo Theorem 24.5 với $d = 10$, số nguyên tố $> 5$ rơi vào đúng 4 lớp: $1, 3, 7, 9 \pmod{10}$.
>
> Kiểm tra thực nghiệm: trong 1000 số nguyên tố đầu tiên (lớn hơn 5):
>
> | Lớp $a \pmod{10}$ | Số lượng (trong 1000 số nguyên tố đầu) |
> |---|---|
> | $1$ | $\approx 250$ |
> | $3$ | $\approx 250$ |
> | $7$ | $\approx 250$ |
> | $9$ | $\approx 250$ |
>
> Phân phối rất gần đều.

> [!example] Example 24.13 — Số nguyên tố nhỏ nhất trong AP
> Số nguyên tố nhỏ nhất $\equiv 1 \pmod{100}$ là $\mathbf{101}$.
> Số nguyên tố nhỏ nhất $\equiv 1 \pmod{1000}$ là $\mathbf{1009}$.
> Số nguyên tố nhỏ nhất $\equiv 1 \pmod{9999991}$ là ... (bài tập, dùng SageMath).

---

## Các Trường Hợp Không Có Chứng Minh Sơ Cấp Thực Sự Đơn Giản

> [!note] Remark 24.14 — Giới hạn của phương pháp sơ cấp
> Phương pháp Euclid (xây dựng $N$ trực tiếp) hoạt động cho $d = 4$ vì ta khai thác tính chất đặc biệt của $-1$ là QNR mod $p$ khi $p \equiv 3 \pmod 4$.
>
> Với $d$ tổng quát, không có phương pháp sơ cấp đơn giản tương đương. Selberg (1949) và Erdős (1949) tìm được chứng minh sơ cấp của Định Lý Số Nguyên Tố, nhưng chứng minh đó cực kỳ phức tạp và không thực sự "sơ cấp" về tinh thần. Chứng minh Dirichlet qua $L$-function là con đường tự nhiên và thanh lịch nhất hiện nay.

---

## SageMath

```python
# Phân phối số nguyên tố trong các lớp đồng dư
from sage.all import primes, prime_pi, gcd

def count_primes_in_class(bound, d, a):
    """Đếm số nguyên tố <= bound trong lớp a mod d."""
    return sum(1 for p in primes(bound) if p % d == a)

# Kiểm tra phân phối đều mod 10
bound = 10000
d = 10
residues = [a for a in range(1, d) if gcd(a, d) == 1]
print(f"Lớp đồng dư mod {d} có số nguyên tố: {residues}")
total = sum(count_primes_in_class(bound, d, a) for a in residues)
for a in residues:
    cnt = count_primes_in_class(bound, d, a)
    print(f"  p ≡ {a} (mod {d}): {cnt} số nguyên tố  ({cnt/total*100:.1f}%)")

# Tìm số nguyên tố nhỏ nhất trong AP
def smallest_prime_in_ap(d, a):
    """Tìm số nguyên tố nhỏ nhất p ≡ a (mod d) với gcd(a,d)=1."""
    from sage.all import is_prime
    n = a % d
    while True:
        if n > 1 and is_prime(n):
            return n
        n += d

# Kiểm tra các ví dụ
for d, a in [(4, 1), (4, 3), (10, 7), (100, 1), (100, 3)]:
    p = smallest_prime_in_ap(d, a)
    print(f"Số nguyên tố nhỏ nhất ≡ {a} (mod {d}): {p}")

# Chứng minh sơ cấp 4k+3: xây dựng N
def euclid_4k3(primes_list):
    """Xây dựng N = 4*p1*...*pk - 1 và phân tích."""
    from sage.all import factor
    N = 4
    for p in primes_list:
        N *= p
    N -= 1
    return N, factor(N)

p_list = [3, 7, 11]
N, factored = euclid_4k3(p_list)
print(f"N = 4*{p_list} - 1 = {N} = {factored}")
# Kiểm tra: ít nhất một nhân tử ≡ 3 (mod 4)
for p, e in factored:
    print(f"  {p} ≡ {p % 4} (mod 4)")

# Mật độ thực nghiệm
import matplotlib
# Thay thế bằng đếm số lượng
for bound in [1000, 10000, 100000]:
    d = 4
    cnt1 = count_primes_in_class(bound, d, 1)
    cnt3 = count_primes_in_class(bound, d, 3)
    total_odd_primes = cnt1 + cnt3
    if total_odd_primes > 0:
        print(f"Bound {bound}: p≡1 có {cnt1} ({cnt1/total_odd_primes*100:.1f}%), "
              f"p≡3 có {cnt3} ({cnt3/total_odd_primes*100:.1f}%)")
```

---

## Tóm Tắt

**Định Lý Dirichlet (1837)**: Với $\gcd(a, d) = 1$, cấp số cộng $\{a, a+d, a+2d, \ldots\}$ chứa vô hạn số nguyên tố, và các số nguyên tố phân phối đều giữa $\varphi(d)$ lớp đồng dư khả nghịch (mật độ $1/\varphi(d)$ mỗi lớp).

**Các trường hợp sơ cấp:**
- $p \equiv 3 \pmod 4$: Dùng $N = 4p_1\cdots p_r - 1$, tích các số $\equiv 1$ không thể $\equiv 3$.
- $p \equiv 1 \pmod 4$: Dùng tính chất $-1$ là QR mod $p$ khi $p \equiv 1 \pmod 4$, xét $N = (2p_1\cdots p_r)^2 + 1$.

**Chứng minh tổng quát** dùng character Dirichlet $\chi : (\mathbb{Z}/d\mathbb{Z})^* \to \mathbb{C}^*$ và hàm $L(s,\chi) = \sum \chi(n)/n^s$. Bước quyết định là $L(1, \chi) \neq 0$ với $\chi \neq \chi_0$, đảm bảo chuỗi $\sum_{p \equiv a} 1/p$ phân kỳ.
