---
title: "16. Tiêu Chuẩn Euler và Ký Hiệu Legendre (Euler's Criterion & Legendre Symbol)"
type: theory
tags: [math, number-theory, lesson-16]
aliases: [Legendre Symbol, Euler Criterion, Quadratic Character]
created: 2026-05-15
---

> **Prerequisites**: [[15-quadratic-residues|15. Thặng Dư Bậc Hai]], [[08-wilson-and-fermat|08. Định Lý Wilson và Fermat Nhỏ]], [[10-multiplicative-order|10. Bậc Nhân Tử]]
> **Objectives**:
> - Chứng minh Tiêu Chuẩn Euler: $a^{(p-1)/2} \equiv \pm 1 \pmod{p}$, dấu xác định QR/QNR
> - Định nghĩa ký hiệu Legendre $\left(\frac{a}{p}\right)$ và tính chất cơ bản
> - Chứng minh tính nhân tính: $\left(\frac{ab}{p}\right) = \left(\frac{a}{p}\right)\left(\frac{b}{p}\right)$
> - Tính $\left(\frac{-1}{p}\right)$ và $\left(\frac{2}{p}\right)$ tường minh
> - Sử dụng ký hiệu Legendre để kiểm tra QR nhanh không cần tính căn bậc hai

---

## Motivation / Intuition

Ở Bài 15, ta định nghĩa QR theo cách trực tiếp: $a$ là QR nếu $x^2 \equiv a$ có nghiệm. Nhưng để *kiểm tra* liệu $a$ có phải QR hay không, ta cần tìm căn bậc hai — không hiệu quả với $a$ lớn.

**Tiêu chuẩn Euler** (Euler's criterion) cho một cách kiểm tra hoàn toàn khác: chỉ cần tính $a^{(p-1)/2} \pmod{p}$. Nếu bằng $1$ thì QR, bằng $-1$ thì QNR. Đây là ý tưởng đột phá — dùng **lũy thừa** thay vì tìm căn.

**Ký hiệu Legendre** (Legendre symbol) $\left(\frac{a}{p}\right)$ đóng gói thông tin này thành một hàm đơn giản nhận giá trị $\pm 1$ (hoặc $0$). Với tính nhân tính của nó, ký hiệu Legendre trở thành công cụ trung tâm để chứng minh Luật Tương Hỗ Bậc Hai ở Bài 17.

---

## Tiêu Chuẩn Euler

### Theorem

> [!theorem] Theorem 16.1 — Tiêu Chuẩn Euler (Euler's Criterion)
> Cho $p$ là số nguyên tố lẻ, $a \in \mathbb{Z}$ với $p \nmid a$. Thì:
>
> $$
> a^{(p-1)/2} \equiv \begin{cases} 1 \pmod{p} & \text{nếu } a \in QR_p \\ -1 \pmod{p} & \text{nếu } a \in QNR_p \end{cases}
> $$

**Proof.**

Gọi $e = (p-1)/2$. Trước tiên, Fermat cho $a^{p-1} \equiv 1 \pmod{p}$, tức $(a^e)^2 \equiv 1$. Vì $p$ nguyên tố, các nghiệm của $y^2 \equiv 1$ chỉ là $y \equiv \pm 1$ (chứng minh: $p \mid y^2 - 1 = (y-1)(y+1)$). Do đó:

$$
a^e \equiv 1 \pmod{p} \quad \text{hoặc} \quad a^e \equiv -1 \pmod{p}.
$$

Bây giờ ta xác định dấu:

**Trường hợp 1: $a \in QR_p$.** Tồn tại $x$ với $x^2 \equiv a$. Thì:

$$
a^e = (x^2)^{(p-1)/2} = x^{p-1} \equiv 1 \pmod{p}
$$

bởi Fermat (với $p \nmid x$, vì $x^2 \equiv a$ và $p \nmid a$).

**Trường hợp 2: $a \in QNR_p$.** Phải có $a^e \equiv -1$ (không thể bằng $1$ vì trái với bên dưới).

*Lý luận:* Xét đa thức $f(y) = y^e - 1$ bậc $e = (p-1)/2$ trên $\mathbb{F}_p$. Theo định lý Lagrange về số nghiệm đa thức (polynomial roots over a field), $f$ có tối đa $e$ nghiệm trong $\mathbb{F}_p$. Ta biết $f$ có đúng $e = (p-1)/2$ nghiệm: chính xác là các phần tử của $QR_p$ (Trường hợp 1 cho thấy mỗi $a \in QR_p$ là nghiệm; Corollary 15.8 cho $|QR_p| = e$). Vì $f$ đạt đủ $e$ nghiệm, không còn nghiệm nào khác — mọi $a \notin QR_p$ (tức $a \in QNR_p$) đều thỏa $f(a) \neq 0$, tức $a^e \not\equiv 1$. Suy ra $a^e \equiv -1$. $\blacksquare$

> [!example] Example 16.2 — Kiểm Tra Euler modulo $11$
>
> $p = 11$, $e = 5$.
>
> | $a$ | $a^5 \bmod 11$ | QR? |
> |-----|--------------|-----|
> | $1$ | $1$ | QR ✓ |
> | $2$ | $10 \equiv -1$ | QNR ✓ |
> | $3$ | $1$ | QR ✓ |
> | $4$ | $1$ | QR ✓ |
> | $5$ | $1$ | QR ✓ |
> | $6$ | $10 \equiv -1$ | QNR ✓ |
> | $7$ | $10 \equiv -1$ | QNR ✓ |
> | $8$ | $10 \equiv -1$ | QNR ✓ |
> | $9$ | $1$ | QR ✓ |
> | $10$ | $10 \equiv -1$ | QNR ✓ |
>
> So sánh với $QR_{11} = \{1, 3, 4, 5, 9\}$ — khớp hoàn toàn.

> [!note] Remark 16.3 — Tại Sao Dùng Luỹ Thừa?
> Tính $a^{(p-1)/2} \bmod p$ chỉ cần $O(\log p)$ phép nhân (bằng **bình phương liên tiếp**, repeated squaring). Đây là thuật toán hiệu quả $O(\log^2 p)$ — nhanh hơn nhiều so với tìm căn bậc hai trực tiếp.

---

## Ký Hiệu Legendre

### Definition

> [!definition] Definition 16.4 — Ký Hiệu Legendre (Legendre Symbol)
> Cho $p$ là số nguyên tố lẻ, $a \in \mathbb{Z}$. **Ký hiệu Legendre** (Legendre symbol) $\left(\frac{a}{p}\right)$ được định nghĩa:
>
> $$
> \left(\frac{a}{p}\right) =
> \begin{cases}
> 0 & \text{nếu } p \mid a \\
> 1 & \text{nếu } p \nmid a \text{ và } a \in QR_p \\
> -1 & \text{nếu } a \in QNR_p
> \end{cases}
> $$

Từ Tiêu Chuẩn Euler, ta có công thức gọn:

$$
\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod{p}
$$

với quy ước $-1 \equiv p-1 \pmod{p}$.

> [!note] Remark 16.5 — Ký Hiệu Có Thể Nhầm Lẫn
> Ký hiệu $\left(\frac{a}{p}\right)$ trông giống phân số $a/p$ nhưng không phải! Đây là một hàm số học nhận giá trị trong $\{-1, 0, 1\}$. Luôn viết đầy đủ cả phân số để phân biệt.

### Theorem

> [!theorem] Theorem 16.6 — Tính Chất Cơ Bản của Ký Hiệu Legendre
> Cho $p$ là số nguyên tố lẻ. Với mọi $a, b \in \mathbb{Z}$:
>
> **(i) Nhân tính (Multiplicativity)**:
>
> $$
> \left(\frac{ab}{p}\right) = \left(\frac{a}{p}\right)\left(\frac{b}{p}\right)
> $$
>
> **(ii) Đồng dư**: Nếu $a \equiv b \pmod{p}$ thì $\left(\frac{a}{p}\right) = \left(\frac{b}{p}\right)$.
>
> **(iii) Bình phương**: $\left(\frac{a^2}{p}\right) = 1$ với mọi $a$ thỏa $p \nmid a$.
>
> **(iv) Euler**: $\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod{p}$.

**Proof (i).** Nếu $p \mid a$ hoặc $p \mid b$ thì cả hai vế đều $= 0$. Nếu $p \nmid a$ và $p \nmid b$:

$$
(ab)^{(p-1)/2} \equiv a^{(p-1)/2} \cdot b^{(p-1)/2} \pmod{p}
$$

Theo Tiêu Chuẩn Euler, mỗi vế bằng $\left(\frac{ab}{p}\right)$, $\left(\frac{a}{p}\right)$, $\left(\frac{b}{p}\right)$ trong $\{-1, +1\}$. Vì các giá trị này là $\pm 1$, và phép nhân trong $\mathbb{Z}$ của $\pm 1$ khớp phép nhân mod $p$ trong $\{-1,+1\}$, đẳng thức (i) theo sau. $\blacksquare$

**(ii)** $a \equiv b \pmod{p}$ thì $a^{(p-1)/2} \equiv b^{(p-1)/2} \pmod{p}$. $\blacksquare$

**(iii)** $a^2$ là bình phương, luôn là QR khi $p \nmid a$. $\blacksquare$

> [!corollary] Corollary 16.7 — Legendre Symbol là Nhân Tính Hoàn Toàn
> Ký hiệu Legendre là hàm nhân tính hoàn toàn theo biến $a$: với phân tích $a = \prod p_i^{e_i}$,
>
> $$
> \left(\frac{a}{p}\right) = \prod_i \left(\frac{p_i}{p}\right)^{e_i} = \prod_{\substack{i \\ e_i \text{ lẻ}}} \left(\frac{p_i}{p}\right)
> $$
>
> (vì $\left(\frac{p_i^{2k}}{p}\right) = 1$ từ (iii)).

---

## Tính $\left(\frac{-1}{p}\right)$ và $\left(\frac{2}{p}\right)$

Đây là hai công thức tường minh quan trọng nhất, cùng với Luật Tương Hỗ Bậc Hai, tạo thành bộ ba hoàn chỉnh để tính mọi ký hiệu Legendre.

### Theorem

> [!theorem] Theorem 16.8 — $\left(\frac{-1}{p}\right)$: Trường Hợp $p \equiv 1, 3 \pmod 4$
> Cho $p$ là số nguyên tố lẻ. Thì:
>
> $$
> \left(\frac{-1}{p}\right) = (-1)^{(p-1)/2} =
> \begin{cases}
> 1 & \text{nếu } p \equiv 1 \pmod{4} \\
> -1 & \text{nếu } p \equiv 3 \pmod{4}
> \end{cases}
> $$

**Proof.** Từ Tiêu Chuẩn Euler:

$$
\left(\frac{-1}{p}\right) \equiv (-1)^{(p-1)/2} \pmod{p}.
$$

Giá trị phải là $\pm 1 \in \mathbb{Z}$, không chỉ modulo $p$:

- Nếu $p \equiv 1 \pmod 4$: $(p-1)/2$ chẵn, $(-1)^{(p-1)/2} = 1$.
- Nếu $p \equiv 3 \pmod 4$: $(p-1)/2$ lẻ, $(-1)^{(p-1)/2} = -1$. $\blacksquare$

### Theorem

> [!theorem] Theorem 16.9 — $\left(\frac{2}{p}\right)$: Phụ Thuộc $p \bmod 8$
> Cho $p$ là số nguyên tố lẻ, $p > 2$. Thì:
>
> $$
> \left(\frac{2}{p}\right) = (-1)^{(p^2-1)/8} =
> \begin{cases}
> 1 & \text{nếu } p \equiv \pm 1 \pmod{8} \\
> -1 & \text{nếu } p \equiv \pm 3 \pmod{8}
> \end{cases}
> $$

**Proof.**

Dùng **Bổ Đề Gauss** (học kỹ ở Bài 17). Ta đếm số phần tử "âm" (tức lớn hơn $p/2$) trong tập $\left\{2 \cdot 1,\ 2 \cdot 2,\ \ldots,\ 2 \cdot \frac{p-1}{2}\right\}$ rút gọn modulo $p$.

Đây là tập $\{2, 4, 6, \ldots, p-1\}$. Ta cần đếm các $2k$ với $1 \leq k \leq \frac{p-1}{2}$ thỏa $2k > p/2$ (tức $k > p/4$):

- Nếu $p \equiv 1 \pmod 8$: $p = 8m+1$, số đếm $\nu = $ số $k$ trong $(p/4, (p-1)/2] = (2m, 4m]$ có $2m$ phần tử, tức $\nu = 2m$ chẵn $\Rightarrow \left(\frac{2}{p}\right) = 1$.
- Tương tự với các trường hợp $p \equiv 3, 5, 7 \pmod 8$ (phân tích kỹ trong Appendix A2).

Kết quả sau phân tích cẩn thận: $\nu \equiv \frac{p^2-1}{8} \pmod 2$, cho công thức trong định lý. $\blacksquare$

> [!example] Example 16.10 — Bảng $\left(\frac{2}{p}\right)$
>
> | $p$ | $p \bmod 8$ | $\left(\frac{2}{p}\right)$ | Kiểm Tra |
> |-----|------------|--------------------------|---------|
> | $7$ | $7 \equiv -1$ | $1$ | $3^2 = 9 \equiv 2 \pmod 7$ ✓ |
> | $11$ | $3$ | $-1$ | $2$ không là bình phương mod $11$ ✓ |
> | $17$ | $1$ | $1$ | $6^2 = 36 \equiv 2 \pmod{17}$ ✓ |
> | $19$ | $3$ | $-1$ | $2$ không là bình phương mod $19$ ✓ |
> | $23$ | $7 \equiv -1$ | $1$ | $5^2 = 25 \equiv 2 \pmod{23}$ ✓ |
> | $41$ | $1$ | $1$ | $17^2 = 289 \equiv 2 \pmod{41}$ ✓ |

---

## Tính Legendre Symbol Theo Công Thức Tổng Hợp

Với Theorem 16.8, 16.9 và Luật Tương Hỗ Bậc Hai (Bài 17), ta có thể tính mọi $\left(\frac{a}{p}\right)$.

### Worked Example

> [!example] Example 16.11 — Tính $\left(\frac{150}{1009}\right)$
>
> Phân tích $150 = 2 \times 3 \times 5^2$.
>
> $$
> \left(\frac{150}{1009}\right) = \left(\frac{2}{1009}\right)\left(\frac{3}{1009}\right)\left(\frac{5}{1009}\right)^2 = \left(\frac{2}{1009}\right)\left(\frac{3}{1009}\right) \cdot 1
> $$
>
> **Tính $\left(\frac{2}{1009}\right)$**: $1009 \equiv 1 \pmod 8$ (vì $1009 = 126 \times 8 + 1$), nên $\left(\frac{2}{1009}\right) = 1$.
>
> **Tính $\left(\frac{3}{1009}\right)$**: Dùng QR Law (Bài 17):
> $\left(\frac{3}{1009}\right)\left(\frac{1009}{3}\right) = (-1)^{\frac{3-1}{2}\cdot\frac{1009-1}{2}} = (-1)^{1 \cdot 504} = 1$.
> Nên $\left(\frac{3}{1009}\right) = \left(\frac{1009}{3}\right)$.
> $1009 \equiv 1 \pmod 3$, nên $\left(\frac{1009}{3}\right) = \left(\frac{1}{3}\right) = 1$.
> Vậy $\left(\frac{3}{1009}\right) = 1$.
>
> **Kết quả**: $\left(\frac{150}{1009}\right) = 1 \times 1 = 1$. Tức $150$ là QR mod $1009$.
>
> (Bài 17 sẽ giải thích Luật Tương Hỗ dùng ở bước tính $\left(\frac{3}{1009}\right)$.)

> [!example] Example 16.12 — Tính $\left(\frac{-13}{37}\right)$
>
> $$
> \left(\frac{-13}{37}\right) = \left(\frac{-1}{37}\right)\left(\frac{13}{37}\right)
> $$
>
> **$\left(\frac{-1}{37}\right)$**: $37 \equiv 1 \pmod 4$, nên $\left(\frac{-1}{37}\right) = 1$.
>
> **$\left(\frac{13}{37}\right)$**: Dùng QR Law. $13 \equiv 1 \pmod 4$, nên
> $\left(\frac{13}{37}\right) = \left(\frac{37}{13}\right) = \left(\frac{11}{13}\right)$.
> ($37 \equiv 11 \pmod{13}$.)
>
> $\left(\frac{11}{13}\right)$: $11 \equiv 3 \pmod 4$, $13 \equiv 1 \pmod 4$, nên theo QR Law
> $\left(\frac{11}{13}\right) = \left(\frac{13}{11}\right) = \left(\frac{2}{11}\right)$.
> ($13 \equiv 2 \pmod{11}$.)
>
> $\left(\frac{2}{11}\right)$: $11 \equiv 3 \pmod 8$, nên $\left(\frac{2}{11}\right) = -1$.
>
> Ngược lên: $\left(\frac{13}{37}\right) = \left(\frac{11}{13}\right) = -1$.
>
> **Kết quả**: $\left(\frac{-13}{37}\right) = 1 \times (-1) = -1$. Tức $-13$ là QNR mod $37$.

---

## Thuật Toán Tính Ký Hiệu Legendre

Tương tự thuật toán Euclid, có thuật toán hiệu quả tính $\left(\frac{a}{p}\right)$ bằng **rút gọn đệ quy** kết hợp QR Law:

```text
Input: a, p (p nguyên tố lẻ, gcd(a,p) = 1)
Output: (a/p) ∈ {-1, 1}

1. Rút gọn: a ← a mod p
2. Tách thừa số 2: a = 2^s · m (m lẻ). Kết quả ← (2/p)^s × (m/p)
3. Nếu m = 1: trả về kết quả hiện tại
4. Dùng QR Law: (m/p) = (p/m) × (-1)^((m-1)/2 · (p-1)/2)
5. Đệ quy: tính (p mod m / m) và lặp
```

Độ phức tạp: $O(\log^2 p)$ — tương tự Euclid.

---

## Bất Đồng Nhất Của Ký Hiệu Legendre và Jacobi

> [!warning] Counterexample 16.13 — Đảo Chiều Không Đúng!
> Ký hiệu Legendre $\left(\frac{a}{p}\right) = 1$ hoàn toàn tương đương $a \in QR_p$ (với $p$ nguyên tố).
>
> **Nhưng Jacobi symbol** $\left(\frac{a}{n}\right) = 1$ (với $n$ **hợp số**) **không** đảm bảo $a$ là QR mod $n$!
>
> Ví dụ: $\left(\frac{2}{15}\right) = \left(\frac{2}{3}\right)\left(\frac{2}{5}\right) = (-1)(-1) = 1$, nhưng $x^2 \equiv 2 \pmod{15}$ vô nghiệm (vì $x^2 \equiv 2 \pmod 3$ vô nghiệm — $QR_3 = \{1\}$).
>
> Đây là lý do tại sao Bài 18 phân biệt rõ Legendre symbol (với $p$ nguyên tố) và **Jacobi symbol** (với $n$ bất kỳ).

---

## SageMath Cheatsheet

```python
# Legendre symbol trong SageMath
p = 11
for a in range(1, p):
    ls = legendre_symbol(a, p)
    euler = int(power_mod(a, (p-1)//2, p))
    # Quy ước: euler ∈ {1, p-1}; p-1 tương ứng -1
    euler_signed = euler if euler == 1 else -1
    print(f"({a}/{p}) = {ls}, Euler a^{(p-1)//2} mod p = {euler_signed}")
    assert ls == euler_signed

# (-1/p) phụ thuộc p mod 4
for p in primes(3, 50):
    ls = legendre_symbol(-1, p)
    formula = (-1)**((p-1)//2)
    assert ls == formula
    print(f"(-1/{p}) = {ls}, p mod 4 = {p % 4}")

# (2/p) phụ thuộc p mod 8
for p in primes(3, 50):
    ls = legendre_symbol(2, p)
    formula = (-1)**((p*p - 1)//8)
    assert ls == formula
    print(f"(2/{p}) = {ls}, p mod 8 = {p % 8}")

# Tính nhân tính
p = 17
a, b = 5, 7
assert legendre_symbol(a*b, p) == legendre_symbol(a, p) * legendre_symbol(b, p)

# Tính Legendre symbol bằng phân tích thừa số
from sympy import factorint
def legendre_via_factoring(a, p):
    a = a % p
    if a == 0:
        return 0
    result = 1
    for q, e in factorint(a).items():
        if e % 2 == 1:
            result *= legendre_symbol(q, p)
    return result

p = 1009
a = 150
print(f"({a}/{p}) = {legendre_via_factoring(a, p)}")
print(f"Kiểm tra SageMath: {legendre_symbol(a, p)}")
assert legendre_via_factoring(a, p) == legendre_symbol(a, p)

# Thuật toán Euler criterion để kiểm tra QR nhanh
def is_qr_euler(a, p):
    """Kiểm tra a là QR mod p dùng tiêu chuẩn Euler. O(log^2 p)."""
    if a % p == 0:
        return True  # 0 là trường hợp đặc biệt
    result = power_mod(a, (p - 1) // 2, p)
    if result == 1:
        return True
    elif result == p - 1:  # tương đương -1 mod p
        return False
    else:
        raise ValueError(f"Kết quả bất ngờ {result}, p={p} không nguyên tố?")

for p in primes(5, 30):
    for a in range(1, p):
        assert is_qr_euler(a, p) == Mod(a, p).is_square()
print("Tiêu chuẩn Euler khớp hoàn toàn với is_square()")
```

---

## Summary / Key Takeaways

- **Tiêu Chuẩn Euler**: $a^{(p-1)/2} \equiv 1 \pmod p$ iff $a \in QR_p$; $\equiv -1$ iff $a \in QNR_p$.
- **Ký hiệu Legendre**: $\left(\frac{a}{p}\right) \in \{-1, 0, 1\}$ đóng gói thông tin QR/QNR/chia hết.
- **Tính nhân tính**: $\left(\frac{ab}{p}\right) = \left(\frac{a}{p}\right)\left(\frac{b}{p}\right)$ — ký hiệu Legendre là nhân tính hoàn toàn.
- **$\left(\frac{-1}{p}\right) = (-1)^{(p-1)/2}$**: bằng $1$ khi $p \equiv 1 \pmod 4$, bằng $-1$ khi $p \equiv 3 \pmod 4$.
- **$\left(\frac{2}{p}\right) = (-1)^{(p^2-1)/8}$**: bằng $1$ khi $p \equiv \pm 1 \pmod 8$, bằng $-1$ khi $p \equiv \pm 3 \pmod 8$.
- Tính Legendre symbol thực tế: phân tích thừa số nguyên tố, dùng tính nhân tính + Theorem 16.8/16.9 + QR Law (Bài 17).
- Với $p$ **nguyên tố**: $\left(\frac{a}{p}\right) = 1 \iff a \in QR_p$ (đảo lại đúng). Với $n$ **hợp số**: đảo lại **không đúng** — đây là Jacobi symbol (Bài 18).

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.2–3.3.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 5.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.5–6.6.
- Koblitz, N. *A Course in Number Theory and Cryptography* (2nd ed.), Ch. II §2.
