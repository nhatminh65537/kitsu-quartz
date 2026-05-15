---
title: "18. Ký Hiệu Jacobi (Jacobi Symbol)"
type: theory
tags: [math, number-theory, lesson-18]
aliases: [Jacobi Symbol, Generalized Legendre]
created: 2026-05-15
---

> **Prerequisites**: [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]], [[17-law-of-quadratic-reciprocity|17. Luật Tương Hỗ Bậc Hai]]
> **Objectives**:
> - Định nghĩa ký hiệu Jacobi như mở rộng của ký hiệu Legendre sang mẫu số hợp số lẻ
> - Chứng minh các tính chất: nhân tính, $(-1/n)$, $(2/n)$, và quy luật tương hỗ Jacobi
> - Nắm vững sự khác biệt then chốt: $\left(\frac{a}{n}\right) = 1$ **không** kéo theo $a \in QR_n$
> - Ứng dụng: tính Legendre symbol nhanh hơn qua Jacobi (không cần phân tích thừa số)
> - Jacobi symbol trong kiểm tra nguyên thủy (Solovay-Strassen)

---

## Motivation / Intuition

Ký hiệu Legendre $\left(\frac{a}{p}\right)$ yêu cầu $p$ là **số nguyên tố**. Điều này gây bất tiện: để tính $\left(\frac{a}{p}\right)$ bằng Luật Tương Hỗ, ta đổi $p$ thành $a \bmod p$, rồi phân tích thừa số $a \bmod p$ và áp dụng với từng thừa số nguyên tố. Với $a$ lớn, phân tích thừa số là bước tốn kém.

**Ký hiệu Jacobi** (Jacobi symbol) giải quyết vấn đề này bằng cách **cho phép mẫu số là hợp số lẻ bất kỳ**. Với $n = p_1^{e_1} \cdots p_r^{e_r}$:

$$
\left(\frac{a}{n}\right) = \left(\frac{a}{p_1}\right)^{e_1} \cdots \left(\frac{a}{p_r}\right)^{e_r}
$$

Hóa ra ký hiệu Jacobi thỏa **cùng quy luật tương hỗ** như Legendre — cho phép tính mà không cần biết phân tích thừa số của $n$, giống như thuật toán Euclid tính GCD mà không cần phân tích.

Cái giá phải trả: Jacobi symbol mất đi sự tương đương với QR. Đây là điểm tinh tế quan trọng nhất của bài.

---

## Định Nghĩa Ký Hiệu Jacobi

### Definition

> [!definition] Definition 18.1 — Ký Hiệu Jacobi (Jacobi Symbol)
> Cho $n$ là số nguyên lẻ dương với phân tích thừa số nguyên tố $n = p_1^{e_1} p_2^{e_2} \cdots p_r^{e_r}$, và $a \in \mathbb{Z}$ với $\gcd(a, n) = 1$.
>
> **Ký hiệu Jacobi** $\left(\frac{a}{n}\right)$ được định nghĩa là:
>
> $$
> \left(\frac{a}{n}\right) = \left(\frac{a}{p_1}\right)^{e_1} \left(\frac{a}{p_2}\right)^{e_2} \cdots \left(\frac{a}{p_r}\right)^{e_r}
> $$
>
> trong đó mỗi $\left(\frac{a}{p_i}\right)$ là ký hiệu **Legendre**.
>
> Nếu $\gcd(a, n) > 1$: $\left(\frac{a}{n}\right) = 0$.
>
> Quy ước đặc biệt: $\left(\frac{a}{1}\right) = 1$ với mọi $a$.

> [!note] Remark 18.2 — Legendre là trường hợp đặc biệt
> Khi $n = p$ là số nguyên tố, $\left(\frac{a}{n}\right)_{\text{Jacobi}} = \left(\frac{a}{p}\right)_{\text{Legendre}}$. Vậy ký hiệu Jacobi **mở rộng** Legendre.

---

## Sự Khác Biệt Cốt Lõi: Jacobi $\neq$ QR

> [!warning] Counterexample 18.3 — Jacobi $= 1$ Không Nghĩa Là QR!
> Cho $n = 15 = 3 \times 5$, $a = 4$.
>
> $$
> \left(\frac{4}{15}\right) = \left(\frac{4}{3}\right)\left(\frac{4}{5}\right) = 1 \cdot 1 = 1
> $$
>
> Nhưng $4 \equiv 1^2 \pmod{15}$, nên $4 \in QR_{15}$. (OK trong ví dụ này.)
>
> Thử $a = 2$:
> $$
> \left(\frac{2}{15}\right) = \left(\frac{2}{3}\right)\left(\frac{2}{5}\right) = (-1)(-1) = 1
> $$
>
> Vậy Jacobi symbol bằng $1$, nhưng $x^2 \equiv 2 \pmod{15}$: cần $x^2 \equiv 2 \pmod{3}$ (vô nghiệm, vì $QR_3 = \{1\}$). **Vô nghiệm** — $2 \notin QR_{15}$!

> [!warning] Counterexample 18.4 — Thêm Ví Dụ
> $n = 35 = 5 \times 7$, $a = 6$.
>
> $$
> \left(\frac{6}{35}\right) = \left(\frac{6}{5}\right)\left(\frac{6}{7}\right) = \left(\frac{1}{5}\right)\left(\frac{6}{7}\right) = 1 \cdot (-1) = -1
> $$
>
> Jacobi $= -1$: **chắc chắn** $6 \notin QR_{35}$ (vì nếu $x^2 \equiv 6 \pmod{35}$ thì $x^2 \equiv 6 \pmod 5$ và $x^2 \equiv 6 \pmod 7$; $\left(\frac{6}{7}\right) = -1$ nên $x^2 \equiv 6 \pmod 7$ vô nghiệm). Nhất quán.

Tóm tắt hành vi:

| $\left(\frac{a}{n}\right)$ | Kết luận về QR |
|--------------------------|----------------|
| $-1$ | $a \notin QR_n$ (chắc chắn) |
| $0$ | $\gcd(a,n) > 1$ |
| $1$ | $a$ **có thể** là QR hoặc không (không xác định) |

---

## Tính Chất Của Ký Hiệu Jacobi

### Theorem

> [!theorem] Theorem 18.5 — Tính Chất Cơ Bản Jacobi Symbol
> Cho $m, n$ lẻ dương, $a, b \in \mathbb{Z}$:
>
> **(i) Nhân tính theo $a$**:
>
> $$
> \left(\frac{ab}{n}\right) = \left(\frac{a}{n}\right)\left(\frac{b}{n}\right)
> $$
>
> **(ii) Nhân tính theo $n$**:
>
> $$
> \left(\frac{a}{mn}\right) = \left(\frac{a}{m}\right)\left(\frac{a}{n}\right)
> $$
>
> **(iii) Đồng dư**: Nếu $a \equiv b \pmod{n}$ và $\gcd(a,n) = 1$ thì $\left(\frac{a}{n}\right) = \left(\frac{b}{n}\right)$.
>
> **(iv) Bình phương**: $\left(\frac{a^2}{n}\right) = 1$ với $\gcd(a,n)=1$.

**Proof.** Tất cả đều từ định nghĩa và tính chất của Legendre symbol. Ví dụ (i):

$$
\left(\frac{ab}{n}\right) = \prod_i \left(\frac{ab}{p_i}\right)^{e_i} = \prod_i \left(\frac{a}{p_i}\right)^{e_i}\left(\frac{b}{p_i}\right)^{e_i} = \left(\frac{a}{n}\right)\left(\frac{b}{n}\right). \quad \blacksquare
$$

### Theorem

> [!theorem] Theorem 18.6 — Jacobi Symbol: $\left(\frac{-1}{n}\right)$ và $\left(\frac{2}{n}\right)$
> Cho $n$ lẻ dương.
>
> **(I)**
>
> $$
> \left(\frac{-1}{n}\right) = (-1)^{(n-1)/2}
> $$
>
> **(II)**
>
> $$
> \left(\frac{2}{n}\right) = (-1)^{(n^2-1)/8}
> $$

> [!note] Remark 18.7 — Công Thức Giống Legendre!
> Đây là điều kỳ diệu: công thức $(-1/n)$ và $(2/n)$ cho **Jacobi symbol** có dạng **hệt như** Legendre symbol, chỉ thay $p$ bởi $n$. Điều này không hiển nhiên vì $n$ là hợp số.

**Proof (I).** Viết $n = p_1^{e_1} \cdots p_r^{e_r}$.

$$
\left(\frac{-1}{n}\right) = \prod_i \left(\frac{-1}{p_i}\right)^{e_i} = \prod_i (-1)^{e_i(p_i-1)/2}
$$

Cần chứng minh $\sum_i e_i \frac{p_i - 1}{2} \equiv \frac{n-1}{2} \pmod 2$.

Dùng đồng nhất thức: nếu $n = ab$ với $a, b$ lẻ thì

$$
\frac{n-1}{2} = \frac{ab-1}{2} = \frac{a-1}{2} + \frac{b-1}{2} + \frac{(a-1)(b-1)}{2}
$$

Vì $(a-1)(b-1) \equiv 0 \pmod 4$ (do $a-1$ và $b-1$ đều chẵn), suy ra $\frac{(a-1)(b-1)}{2} \equiv 0 \pmod 2$. Vậy $\frac{n-1}{2} \equiv \frac{a-1}{2} + \frac{b-1}{2} \pmod 2$.

Bằng quy nạp trên số thừa nguyên tố: $\sum_i e_i \frac{p_i-1}{2} \equiv \frac{n-1}{2} \pmod 2$. Suy ra $\left(\frac{-1}{n}\right) = (-1)^{(n-1)/2}$. $\blacksquare$

**Proof (II).** Tương tự, dùng đồng nhất thức: nếu $n = ab$ thì $\frac{n^2-1}{8} \equiv \frac{a^2-1}{8} + \frac{b^2-1}{8} \pmod 2$ (vì $\frac{a^2b^2-1}{8} - \frac{a^2-1}{8} - \frac{b^2-1}{8} = \frac{(a^2-1)(b^2-1)}{8}$, và $(a^2-1)(b^2-1) = (a-1)(a+1)(b-1)(b+1)$; với $a,b$ lẻ, mỗi nhân tử trong cặp $(a-1,a+1)$ là chẵn và tích chứa nhân tử $8$, nên $\frac{(a^2-1)(b^2-1)}{8} \equiv 0 \pmod 2$). $\blacksquare$

---

## Quy Luật Tương Hỗ Jacobi

### Theorem

> [!theorem] Theorem 18.8 — Luật Tương Hỗ Bậc Hai Jacobi (Jacobi Reciprocity)
> Cho $m, n$ là các số nguyên lẻ dương với $\gcd(m, n) = 1$. Thì:
>
> $$
> \left(\frac{m}{n}\right)\left(\frac{n}{m}\right) = (-1)^{\frac{m-1}{2}\cdot\frac{n-1}{2}}
> $$

**Proof.** Viết $m = \prod p_i^{e_i}$, $n = \prod q_j^{f_j}$ (phân tích nguyên tố phân biệt giữa $m$ và $n$ vì $\gcd(m,n)=1$).

$$
\left(\frac{m}{n}\right)\left(\frac{n}{m}\right) = \prod_{i,j} \left(\frac{p_i}{q_j}\right)^{e_i f_j} \cdot \prod_{i,j} \left(\frac{q_j}{p_i}\right)^{e_i f_j}
$$

$$
= \prod_{i,j} \left[\left(\frac{p_i}{q_j}\right)\left(\frac{q_j}{p_i}\right)\right]^{e_i f_j} = \prod_{i,j} (-1)^{e_i f_j \cdot \frac{p_i-1}{2} \cdot \frac{q_j-1}{2}}
$$

Số mũ tổng: $\left(\sum_i e_i \frac{p_i-1}{2}\right)\left(\sum_j f_j \frac{q_j-1}{2}\right) \equiv \frac{m-1}{2} \cdot \frac{n-1}{2} \pmod 2$ (từ Proof của Theorem 18.6 (I)). $\blacksquare$

> [!note] Remark 18.9 — Ý Nghĩa của Jacobi Reciprocity
> Jacobi Reciprocity **hệt như** QR Law cho Legendre, nhưng áp dụng cho **mọi** cặp số lẻ nguyên tố cùng nhau — không cần $m$, $n$ nguyên tố! Đây là lý do Jacobi symbol hữu ích: ta có thể tính $\left(\frac{a}{p}\right)$ bằng thuật toán đệ quy kiểu Euclid **mà không cần phân tích thừa số** của $a$.

---

## Thuật Toán Tính Jacobi Symbol (và Legendre Symbol)

Kết hợp Theorem 18.5-18.8, ta có thuật toán hiệu quả:

```text
Jacobi(a, n):  // n lẻ dương, a ∈ Z
  1. Nếu a = 0: trả về 0
  2. Nếu a = 1: trả về 1
  3. Nếu a = -1: trả về (-1)^((n-1)/2)
  4. Nếu a chẵn (a = 2b): trả về (-1)^((n^2-1)/8) * Jacobi(b, n)
  5. Nếu a < 0: trả về Jacobi(-1, n) * Jacobi(-a, n)
  6. Nếu a >= n: trả về Jacobi(a mod n, n)
  7. // a lẻ, 1 < a < n
     Dấu = (-1)^((a-1)/2 * (n-1)/2)   // từ Jacobi Reciprocity
     Trả về Dấu * Jacobi(n mod a, a)
```

Độ phức tạp: $O(\log^2 \max(a,n))$ — y hệt thuật toán Euclid.

> [!example] Example 18.10 — Tính $\left(\frac{1001}{9907}\right)$ (không phân tích thừa số)
>
> $9907$ là số nguyên tố? Không cần biết! Ta cứ dùng Jacobi.
>
> $\left(\frac{1001}{9907}\right)$. $1001 = 7 \times 11 \times 13$.
>
> Hoặc tính trực tiếp bằng thuật toán:
>
> $1001$ lẻ, $1001 < 9907$. Dùng Reciprocity:
>
> $\left(\frac{1001}{9907}\right) = (-1)^{\frac{1000}{2}\cdot\frac{9906}{2}} \cdot \left(\frac{9907 \bmod 1001}{1001}\right) = (-1)^{500 \times 4953} \cdot \left(\frac{9907 \bmod 1001}{1001}\right)$
>
> $500 \times 4953 = 2476500$ chẵn, nên dấu $= 1$.
>
> $9907 = 9 \times 1001 + 898$, nên $9907 \bmod 1001 = 898$.
>
> $\left(\frac{898}{1001}\right) = \left(\frac{2 \times 449}{1001}\right) = \left(\frac{2}{1001}\right)\left(\frac{449}{1001}\right)$.
>
> $1001 \equiv 1 \pmod 8$, nên $\left(\frac{2}{1001}\right) = 1$.
>
> $\left(\frac{449}{1001}\right)$: $449$ lẻ, $449 < 1001$.
> Dấu: $\frac{448}{2}\cdot\frac{1000}{2} = 224 \times 500 = 112000$ chẵn.
> $\left(\frac{449}{1001}\right) = \left(\frac{1001 \bmod 449}{449}\right) = \left(\frac{103}{449}\right)$.
>
> Tiếp tục đệ quy... (tương tự Euclid, kết thúc sau vài bước.)

> [!example] Example 18.11 — So Sánh Tính $\left(\frac{a}{p}\right)$ Bằng Legendre vs Jacobi
>
> Tính $\left(\frac{5765169}{1000003}\right)$ (giả sử $1000003$ nguyên tố).
>
> **Cách Legendre thuần túy**: Phân tích $5765169 = 3 \times 1921723 = \ldots$ (tốn thời gian).
>
> **Cách Jacobi**: Chạy thuật toán đệ quy như trên — không cần phân tích.

---

## Liên Hệ Với Kiểm Tra Nguyên Thủy (Solovay-Strassen)

> [!note] Remark 18.12 — Kiểm Tra Solovay-Strassen
> Nếu $n$ **nguyên tố**: với mọi $a$, $\gcd(a,n) = 1$:
>
> $$
> \left(\frac{a}{n}\right) \equiv a^{(n-1)/2} \pmod n
> $$
>
> (đây chính là Tiêu Chuẩn Euler).
>
> Nếu $n$ là **hợp số**: tồn tại ít nhất $\frac{n-1}{2}$ giá trị $a$ với $1 \leq a < n$ vi phạm đẳng thức trên.
>
> **Kiểm Tra Solovay-Strassen** (1977): Chọn ngẫu nhiên $a$ và kiểm tra $\left(\frac{a}{n}\right) \equiv a^{(n-1)/2} \pmod n$.
> - Nếu không bằng: $n$ chắc chắn hợp số.
> - Nếu bằng: $n$ có xác suất $\geq 1/2$ là nguyên tố. Lặp $k$ lần: sai số $\leq 2^{-k}$.
>
> Đây là ứng dụng quan trọng của Jacobi symbol trong kiểm tra nguyên thủy xác suất.

---

## SageMath Cheatsheet

```python
# Jacobi symbol trong SageMath
from sympy import jacobi_symbol

# Kiểm tra định nghĩa: Jacobi = tích Legendre
def jacobi_from_legendre(a, n):
    """Tính Jacobi(a/n) bằng tích Legendre theo định nghĩa."""
    if gcd(a, n) != 1:
        return 0
    result = 1
    for p, e in factor(n):
        result *= legendre_symbol(a, p)^e
    return result

for n in range(3, 50, 2):  # n lẻ
    for a in range(1, n):
        if gcd(a, n) == 1:
            j1 = jacobi_symbol(a, n)
            j2 = jacobi_from_legendre(a, n)
            assert j1 == j2, f"a={a}, n={n}"
print("Jacobi symbol khớp với tích Legendre")

# Xác nhận: Jacobi = 1 không nghĩa là QR
def is_qr_mod_n(a, n):
    """Kiểm tra x^2 ≡ a (mod n) có nghiệm."""
    for x in range(n):
        if pow(x, 2, n) == a % n:
            return True
    return False

n = 15
false_positives = []
for a in range(1, n):
    if gcd(a, n) == 1:
        j = jacobi_symbol(a, n)
        qr = is_qr_mod_n(a, n)
        if j == 1 and not qr:
            false_positives.append(a)
        print(f"a={a}: J({a}/{n})={j}, is_QR={qr}, {'⚠️ FALSE POSITIVE' if j==1 and not qr else ''}")

print(f"\nFalse positives (Jacobi=1 nhưng không là QR mod {n}): {false_positives}")

# Xác nhận: Jacobi = -1 ⟹ chắc chắn không là QR
for n in range(3, 30, 2):
    for a in range(1, n):
        if gcd(a, n) == 1 and jacobi_symbol(a, n) == -1:
            assert not is_qr_mod_n(a, n), f"Jacobi=-1 nhưng a={a} là QR mod n={n}??"

print("Xác nhận: Jacobi = -1 ⟹ không là QR (luôn đúng)")

# Tính chất nhân tính
n = 105  # = 3 * 5 * 7
for a in range(1, n, 2):
    for b in range(1, n, 2):
        if gcd(a*b, n) == 1:
            assert jacobi_symbol(a*b % n, n) == jacobi_symbol(a, n) * jacobi_symbol(b, n)
print("Tính nhân tính Jacobi xác nhận")

# Jacobi Reciprocity
for m in range(3, 40, 2):
    for n in range(3, 40, 2):
        if m != n and gcd(m, n) == 1:
            lhs = jacobi_symbol(m, n) * jacobi_symbol(n, m)
            rhs = (-1)**((m-1)//2 * (n-1)//2)
            assert lhs == rhs, f"Jacobi Reciprocity fails m={m}, n={n}"
print("Jacobi Reciprocity xác nhận")

# Solovay-Strassen test
import random

def solovay_strassen(n, k=20):
    """Kiểm tra nguyên thủy Solovay-Strassen."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for _ in range(k):
        a = random.randrange(2, n)
        if gcd(a, n) > 1:
            return False  # chắc chắn hợp số
        j = jacobi_symbol(a, n)
        if j == 0:
            return False
        euler = power_mod(a, (n-1)//2, n)
        # j có thể là -1, quy về n-1 mod n
        j_mod = j % n
        if euler != j_mod:
            return False  # chắc chắn hợp số
    return True  # có thể nguyên tố

# Kiểm tra với các số nguyên tố và hợp số
test_cases = [2, 3, 5, 7, 11, 13, 9, 15, 25, 97, 100, 101, 1009, 1001]
for n in test_cases:
    result = solovay_strassen(n)
    actual = n in Primes()
    print(f"n={n}: SS={result}, isPrime={actual}, {'✓' if result == actual else '⚠️ (false positive)'}")
```

---

## Summary / Key Takeaways

- **Ký hiệu Jacobi** $\left(\frac{a}{n}\right)$: mở rộng Legendre sang $n$ lẻ hợp số, định nghĩa bằng tích Legendre theo phân tích nguyên tố của $n$.
- **Nguy hiểm chính**: $\left(\frac{a}{n}\right) = 1$ **không** kéo theo $a \in QR_n$ khi $n$ là hợp số.
- **An toàn**: $\left(\frac{a}{n}\right) = -1$ **luôn** kéo theo $a \notin QR_n$ (ngay cả khi $n$ hợp số).
- **Tính chất**: Jacobi thỏa nhân tính theo cả $a$ lẫn $n$; $\left(\frac{-1}{n}\right) = (-1)^{(n-1)/2}$; $\left(\frac{2}{n}\right) = (-1)^{(n^2-1)/8}$.
- **Jacobi Reciprocity**: $\left(\frac{m}{n}\right)\left(\frac{n}{m}\right) = (-1)^{\frac{m-1}{2}\cdot\frac{n-1}{2}}$ — hệt như Legendre nhưng với mọi cặp lẻ nguyên tố cùng nhau.
- **Ứng dụng tính Legendre**: dùng thuật toán Jacobi kiểu Euclid để tính $\left(\frac{a}{p}\right)$ mà **không cần phân tích thừa số** — hiệu quả $O(\log^2 p)$.
- **Solovay-Strassen**: ứng dụng Jacobi symbol vào kiểm tra nguyên thủy xác suất.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.5.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 5.
- Jacobi, C. G. J. *Über die Kreisteilung und ihre Anwendung auf die Zahlentheorie* (1827).
- Solovay, R., Strassen, V. *A fast Monte-Carlo test for primality*, SIAM J. Comput. 6(1), 1977.
