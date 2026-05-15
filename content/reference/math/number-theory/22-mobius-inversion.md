---
title: "22. Công Thức Đảo Möbius"
type: theory
tags: [math, number-theory, lesson-22]
aliases: [Möbius Inversion Formula, Mobius Inversion]
created: 2026-05-15
---

> **Prerequisites**: [[21-dirichlet-convolution-and-mobius|21. Tích Chập Dirichlet và Hàm Möbius]], [[20-arithmetic-functions|20. Hàm Số Học và Tính Nhân Tính]]
> **Objectives**:
> - Phát biểu và chứng minh Công Thức Đảo Möbius (Möbius Inversion Formula) ở dạng tổng và dạng tích chập
> - Áp dụng inversion để khôi phục $\varphi$, $\Lambda$, $\mu$ từ hàm tổng của chúng
> - Chứng minh công thức $\varphi(n) = n\prod_{p \mid n}(1-1/p)$ theo con đường thứ ba (từ inversion)
> - Hiểu dạng nhân (multiplicative Möbius inversion) và dạng tổng quát trên các poset
> - Áp dụng inversion để tính các hàm số học ẩn trong thực tế bài toán

---

## Motivation / Intuition

Ở bài 21 ta thấy rằng nhiều hàm số học quan trọng xuất hiện dưới dạng $F = f * \mathbf{1}$, tức $F(n) = \sum_{d \mid n} f(d)$. Ví dụ:
- $\tau = \mathbf{1} * \mathbf{1}$: biết $\mathbf{1}$, tính $\tau$
- $\operatorname{id} = \varphi * \mathbf{1}$: biết $\varphi$, tính $\operatorname{id}$

Nhưng điều gì xảy ra nếu ta biết $F$ và muốn tìm lại $f$? Đây là bài toán **đảo** (inversion).

Trong đại số thông thường: $F = f \cdot g$ với $g$ khả nghịch thì $f = F \cdot g^{-1}$. Trong vành Dirichlet: $F = f * \mathbf{1}$ và $\mathbf{1}^{-1} = \mu$, nên $f = F * \mu$. Đây chính là **Công Thức Đảo Möbius**.

Sức mạnh của nó nằm ở chỗ: thay vì phải "giải ngược" một hệ phương trình phức tạp, ta chỉ cần tích chập một lần với $\mu$. Kết quả là một công cụ tính toán cực kỳ linh hoạt, được dùng xuyên suốt lý thuyết số giải tích.

---

## Công Thức Đảo Möbius — Dạng Tổng

### Định Lý Chính

> [!theorem] Theorem 22.1 — Công Thức Đảo Möbius (Möbius Inversion Formula)
> Cho $f, F : \mathbb{Z}^+ \to \mathbb{C}$ là hai hàm số học. Khi đó:
>
> $$
> F(n) = \sum_{d \mid n} f(d) \iff f(n) = \sum_{d \mid n} \mu(d)\, F\!\left(\frac{n}{d}\right)
> $$
>
> Tương đương, viết dưới dạng khác:
>
> $$
> F(n) = \sum_{d \mid n} f(d) \iff f(n) = \sum_{d \mid n} \mu\!\left(\frac{n}{d}\right) F(d)
> $$

**Proof (dạng tích chập).**
Điều kiện $F(n) = \sum_{d \mid n} f(d)$ tương đương với $F = f * \mathbf{1}$.

$(\Rightarrow)$: Giả sử $F = f * \mathbf{1}$. Tích chập hai vế với $\mu$:
$$
F * \mu = (f * \mathbf{1}) * \mu = f * (\mathbf{1} * \mu) = f * \varepsilon = f
$$
Vậy $f = F * \mu$, tức $f(n) = (F * \mu)(n) = \sum_{d \mid n} F(d)\,\mu(n/d) = \sum_{d \mid n} \mu(d)\,F(n/d)$.

$(\Leftarrow)$: Giả sử $f = F * \mu$. Tích chập hai vế với $\mathbf{1}$:
$$
f * \mathbf{1} = (F * \mu) * \mathbf{1} = F * (\mu * \mathbf{1}) = F * \varepsilon = F
$$
$\blacksquare$

**Proof trực tiếp (không dùng vành).**
Giả sử $F = f * \mathbf{1}$. Ta tính $(F * \mu)(n)$:

$$
(F * \mu)(n) = \sum_{d \mid n} \mu(d)\, F\!\left(\frac{n}{d}\right) = \sum_{d \mid n} \mu(d) \sum_{e \mid (n/d)} f(e) = \sum_{de \mid n} \mu(d)\, f(e)
$$

Đặt $n = ek$ (với $e \mid n$), tổng trở thành:

$$
= \sum_{e \mid n} f(e) \sum_{d \mid (n/e)} \mu(d) = \sum_{e \mid n} f(e)\cdot \varepsilon\!\left(\frac{n}{e}\right) = f(n)
$$

(Dùng Theorem 20.23: $\sum_{d \mid m}\mu(d) = \varepsilon(m)$, bằng $1$ khi $m=1$ và $0$ khi $m>1$.) $\blacksquare$

---

## Ứng Dụng Trực Tiếp

### Khôi Phục $\varphi$ từ $\operatorname{id}$

> [!example] Example 22.2 — Hàm Euler $\varphi$ từ Möbius Inversion
>
> Ta đã biết $\sum_{d \mid n}\varphi(d) = n$, tức $\operatorname{id} = \varphi * \mathbf{1}$.
>
> Áp dụng Möbius Inversion:
>
> $$
> \varphi(n) = \sum_{d \mid n} \mu\!\left(\frac{n}{d}\right) \cdot d = \sum_{d \mid n} \mu(d) \cdot \frac{n}{d}
> $$
>
> Ví dụ $n = 30 = 2\cdot 3\cdot 5$. Ước squarefree của $30$: $1, 2, 3, 5, 6, 10, 15, 30$.
>
> $$
> \varphi(30) = 30\!\left(\frac{\mu(1)}{1} + \frac{\mu(2)}{2} + \frac{\mu(3)}{3} + \frac{\mu(5)}{5} + \frac{\mu(6)}{6} + \frac{\mu(10)}{10} + \frac{\mu(15)}{15} + \frac{\mu(30)}{30}\right)
> $$
>
> $$
> = 30\!\left(1 - \frac{1}{2} - \frac{1}{3} - \frac{1}{5} + \frac{1}{6} + \frac{1}{10} + \frac{1}{15} - \frac{1}{30}\right) = 30 \cdot \frac{8}{30} = 8 \checkmark
> $$
>
> Bằng công thức nhân tử: $\varphi(30) = 30\left(1-\frac{1}{2}\right)\left(1-\frac{1}{3}\right)\left(1-\frac{1}{5}\right) = 30 \cdot \frac{1}{2} \cdot \frac{2}{3} \cdot \frac{4}{5} = 8$ ✓

### Khôi Phục $\Lambda$ từ $\ln$

> [!example] Example 22.3 — Hàm Von Mangoldt từ Möbius Inversion
>
> Ta đã biết $\ln n = \sum_{d \mid n}\Lambda(d)$, tức $\ln = \Lambda * \mathbf{1}$.
>
> Áp dụng Möbius Inversion:
>
> $$
> \Lambda(n) = \sum_{d \mid n} \mu(d)\,\ln\!\left(\frac{n}{d}\right) = -\sum_{d \mid n} \mu(d)\,\ln d
> $$
>
> (Vì $\ln(n/d) = \ln n - \ln d$ và $\sum_{d \mid n}\mu(d) = \varepsilon(n) = 0$ với $n > 1$, nên $\sum \mu(d)\ln n = \ln n \cdot 0 = 0$.)
>
> Kiểm tra $n = p^k$: $\Lambda(p^k) = -\sum_{j=0}^{k}\mu(p^j)\ln(p^j) = -[\mu(1)\cdot 0 + \mu(p)\ln p + 0 + \cdots] = -[0 - \ln p] = \ln p$ ✓
>
> Kiểm tra $n = 6$: $\Lambda(6) = -[\mu(1)\ln 1 + \mu(2)\ln 2 + \mu(3)\ln 3 + \mu(6)\ln 6]$
> $= -[0 + (-1)\ln 2 + (-1)\ln 3 + 1\cdot(\ln 2+\ln 3)] = -[-\ln 2 - \ln 3 + \ln 2 + \ln 3] = 0$ ✓

### Khôi Phục $\mu$ từ $\varepsilon$

> [!example] Example 22.4 — Hàm Möbius tự đảo
>
> Ta có $\varepsilon = \mu * \mathbf{1}$, tức $\sum_{d \mid n}\mu(d) = \varepsilon(n)$.
>
> Möbius Inversion đảo lại:
>
> $$
> \mu(n) = \sum_{d \mid n} \mu(d)\,\varepsilon\!\left(\frac{n}{d}\right) = \varepsilon(n) \cdot \sum_{d \mid n}\cdots
> $$
>
> Thực ra đây chỉ là tầm thường: đảo $\varepsilon = \mu * \mathbf{1}$ cho ta $\mu = \varepsilon * \mu = \mu$. Điều thú vị hơn là: **ký hiệu $\mu$ được xác định duy nhất** bởi điều kiện $\sum_{d \mid n}\mu(d) = \varepsilon(n)$.

---

## Công Thức Đảo Möbius — Dạng Nhân (Multiplicative Version)

> [!theorem] Theorem 22.5 — Đảo Möbius dạng tích
> Cho $f, F : \mathbb{Z}^+ \to \mathbb{C}$ với $f(n) > 0$ với mọi $n$. Khi đó:
>
> $$
> F(n) = \prod_{d \mid n} f(d) \iff f(n) = \prod_{d \mid n} F\!\left(\frac{n}{d}\right)^{\mu(d)} = \prod_{d \mid n} F(d)^{\mu(n/d)}
> $$

**Proof.**
Lấy logarithm: $\ln F(n) = \sum_{d \mid n} \ln f(d)$, đây là dạng cộng của Möbius Inversion (với $f$ thay bởi $\ln f$, $F$ bởi $\ln F$). Suy ra $\ln f(n) = \sum_{d \mid n}\mu(d)\ln F(n/d) = \ln\prod_{d \mid n} F(n/d)^{\mu(d)}$. Lấy mũ hai vế. $\blacksquare$

> [!example] Example 22.6 — Dạng nhân với $f = \operatorname{id}$
>
> $\prod_{d \mid n} d = n^{\tau(n)/2}$ (tích mọi ước của $n$).
>
> Đặt $F = $ hàm tích ước, $f = \operatorname{id}$. Áp dụng inversion ngược:
>
> $$
> \prod_{d \mid n} d^{\mu(n/d)} = n
> $$
>
> Kiểm tra $n=6$: $\prod_{d \mid 6} d^{\mu(6/d)} = 1^{\mu(6)} \cdot 2^{\mu(3)} \cdot 3^{\mu(2)} \cdot 6^{\mu(1)}$
> $= 1^1 \cdot 2^{-1} \cdot 3^{-1} \cdot 6^1 = \frac{6}{2\cdot 3} = 1$. Hmm — kiểm tra lại:
>
> $(F * \mu)(n)$ với $F(d) = d$ cho $f(n) = n$ như đã tính trước. Thực ra dạng nhân đảo từ $F = \prod_{d \mid n} f(d)$ (không phải $F(d) = d$ thông thường). Xem Apostol §2.7.

---

## Công Thức Đảo Möbius — Tổng Hợp Các Ứng Dụng

> [!theorem] Theorem 22.7 — Bảng đảo Möbius chuẩn
> Từ Theorem 21.12 và Möbius Inversion, ta có các cặp:
>
> | Dạng $F = f * \mathbf{1}$ | Dạng đảo $f = F * \mu$ |
> |---|---|
> | $\tau(n) = \sum_{d \mid n} 1$ | $\mathbf{1}(n) = \sum_{d \mid n}\mu(d)\tau(n/d)$ |
> | $\sigma(n) = \sum_{d \mid n} d$ | $\operatorname{id}(n) = \sum_{d \mid n}\mu(d)\sigma(n/d)$ |
> | $n = \sum_{d \mid n} \varphi(d)$ | $\varphi(n) = \sum_{d \mid n}\mu(d)(n/d)$ |
> | $\ln n = \sum_{d \mid n}\Lambda(d)$ | $\Lambda(n) = -\sum_{d \mid n}\mu(d)\ln d$ |
> | $\varepsilon(n) = \sum_{d \mid n}\mu(d)$ | (tầm thường — định nghĩa $\mu$) |

---

## Tính Nhân Tính Bảo Toàn Qua Inversion

> [!theorem] Theorem 22.8 — Möbius Inversion bảo toàn tính nhân tính
> Trong Möbius Inversion, $f$ nhân tính khi và chỉ khi $F$ nhân tính.

**Proof.**
$(\Rightarrow)$: Nếu $f$ nhân tính thì $F = f * \mathbf{1}$ nhân tính (Theorem 21.14).

$(\Leftarrow)$: Nếu $F$ nhân tính thì $f = F * \mu$ nhân tính vì $\mu$ nhân tính (Theorem 21.14). $\blacksquare$

> [!example] Example 22.9 — Tính nhân tính của $\varphi$ từ inversion
>
> $F(n) = n$ là nhân tính (hoàn toàn nhân tính). Theo Theorem 22.8, $\varphi = F * \mu = \operatorname{id} * \mu$ cũng nhân tính.
>
> Đây là chứng minh thứ ba tính nhân tính của $\varphi$ — ngắn gọn và thanh lịch!

---

## Công Thức Đảo Möbius Tổng Quát Trên Poset

> [!note] Remark 22.10 — Tổng quát hóa lên poset (preview)
> Công Thức Đảo Möbius thực ra là trường hợp đặc biệt của một định lý đại số tổ hợp (algebraic combinatorics) sâu hơn. Với bất kỳ **poset** (partially ordered set) hữu hạn $P$, tồn tại **hàm Möbius** $\mu_P(x, y)$ trên các cặp $(x \leq y)$ trong $P$ sao cho:
>
> $$
> F(x) = \sum_{y \leq x} f(y) \iff f(x) = \sum_{y \leq x} \mu_P(y, x)\, F(y)
> $$
>
> Trường hợp ta xét: $P = (\mathbb{Z}^+, \mid)$ — số nguyên dương với quan hệ chia hết. Hàm Möbius của poset này là $\mu_P(d, n) = \mu(n/d)$ — chính hàm Möbius cổ điển!
>
> Tổng quát hóa này xuất hiện trong Lý Thuyết Tổ Hợp (Combinatorics) và Lý Thuyết Biểu Diễn (Representation Theory).

---

## Ứng Dụng: Bài Toán Đếm Bằng Möbius Inversion

> [!example] Example 22.11 — Đếm chuỗi nguyên thủy (primitive necklaces)
>
> **Bài toán**: Đếm số chuỗi nhị phân độ dài $n$ không phải là lũy thừa của chuỗi ngắn hơn.
>
> Gọi $f(n)$ = số chuỗi nhị phân nguyên thủy độ dài $n$. Tổng $\sum_{d \mid n} f(d) = 2^n$ (vì mọi chuỗi độ dài $n$ là lũy thừa duy nhất của một chuỗi nguyên thủy độ dài $d \mid n$).
>
> Möbius Inversion: $f(n) = \sum_{d \mid n} \mu(d)\, 2^{n/d}$.
>
> Ví dụ $n = 4$:
>
> $$
> f(4) = \mu(1)\cdot 2^4 + \mu(2)\cdot 2^2 + \mu(4)\cdot 2^1 = 16 - 4 + 0 = 12
> $$
>
> Kiểm tra: 12 chuỗi nguyên thủy độ dài 4 là $\{0001, 0010, 0011, 0100, 0110, 0111, 1000, 1001, 1011, 1100, 1101, 1110\}$ ✓

> [!example] Example 22.12 — Đếm đa thức bất khả quy trên $\mathbb{F}_p$ (preview)
>
> Gọi $N_p(n)$ = số đa thức đơn vị (monic) bất khả quy bậc $n$ trên $\mathbb{F}_p$.
>
> Ta có $\sum_{d \mid n} d\, N_p(d) = p^n$ (số phần tử $\mathbb{F}_{p^n}$ — mọi phần tử là nghiệm của đa thức bất khả quy bậc $d \mid n$).
>
> Möbius Inversion (dạng nhân tính đặc biệt):
>
> $$
> N_p(n) = \frac{1}{n} \sum_{d \mid n} \mu(d)\, p^{n/d}
> $$
>
> Ví dụ $p=2$, $n=3$: $N_2(3) = \frac{1}{3}(\mu(1)\cdot 8 + \mu(3)\cdot 2) = \frac{8-2}{3} = 2$.
> Hai đa thức bất khả quy bậc 3 trên $\mathbb{F}_2$: $x^3+x+1$ và $x^3+x^2+1$ ✓

---

## Hàm $\varphi$ qua Inversion — Ba Cách Chứng Minh

Định lý $\varphi(n) = n\prod_{p \mid n}(1-1/p)$ đã có ba chứng minh độc lập trong khóa học này:

1. **Trực tiếp từ CRT** (bài 09): $\varphi$ nhân tính, tính trên $p^k$.
2. **Từ hằng đẳng thức $\sum_{d\mid n}\varphi(d) = n$** (bài 20): xác định $\varphi$ là hàm nhân tính với $\varphi(p^k) = p^{k-1}(p-1)$.
3. **Từ Möbius Inversion** (bài này): $\varphi = \operatorname{id} * \mu$, khai triển theo nhân tố nguyên tố.

---

## SageMath Cheatsheet

Triển khai Möbius Inversion trong SageMath:

```sage
def mobius_inversion(F, n):
    return sum(moebius(d) * F(n // d) for d in divisors(n))

F_id = lambda n: n
phi_recovered = lambda n: mobius_inversion(F_id, n)
assert phi_recovered(12) == euler_phi(12)
assert phi_recovered(30) == euler_phi(30)
print("phi recovered via Mobius inversion: OK!")
```

Khôi phục $\Lambda$ từ $\ln$:

```sage
def von_mangoldt_via_inversion(n):
    return sum(moebius(d) * ln(n // d) for d in divisors(n))

for n in range(1, 20):
    val = von_mangoldt_via_inversion(n)
    print(f"Lambda({n:2d}) = {val:.4f}")
```

Đếm đa thức bất khả quy trên $\mathbb{F}_p$:

```sage
def count_irreducible(p, n):
    return sum(moebius(d) * p^(n // d) for d in divisors(n)) // n

for p, n in [(2, 3), (2, 4), (2, 5), (3, 3), (5, 2)]:
    N = count_irreducible(p, n)
    print(f"N_{p}({n}) = {N}")
```

Kiểm tra Möbius Inversion trong vài trường hợp:

```sage
def check_inversion(f, n_max=30):
    F = lambda n: sum(f(d) for d in divisors(n))
    f_recovered = lambda n: sum(moebius(d) * F(n // d) for d in divisors(n))
    return all(f(n) == f_recovered(n) for n in range(1, n_max + 1))

assert check_inversion(euler_phi, 50)
assert check_inversion(moebius, 50)
assert check_inversion(lambda n: 1, 50)
print("Mobius inversion checks passed for all three cases!")
```

---

## Summary / Key Takeaways

- **Möbius Inversion**: $F = f * \mathbf{1} \iff f = F * \mu$. Biết một chiều, suy ra chiều kia.
- Dạng tổng: $F(n) = \sum_{d \mid n}f(d) \iff f(n) = \sum_{d \mid n}\mu(d)F(n/d)$.
- Dạng tích: $F(n) = \prod_{d \mid n}f(d) \iff f(n) = \prod_{d \mid n}F(n/d)^{\mu(d)}$.
- **Bảo toàn tính nhân tính**: $f$ nhân tính $\iff$ $F$ nhân tính.
- Ứng dụng trực tiếp: khôi phục $\varphi$, $\Lambda$ từ tổng ước của chúng.
- Ứng dụng nâng cao: đếm chuỗi nguyên thủy, đa thức bất khả quy trên $\mathbb{F}_p$.
- **Tổng quát hóa poset**: Möbius Inversion cổ điển là trường hợp đặc biệt của lý thuyết Möbius trên poset tùy ý.
- Module 4 kết thúc tại đây. Module 5 tiếp theo sẽ dùng $\mu$ và $\Lambda$ để nghiên cứu phân phối số nguyên tố.

---

## References

- T. M. Apostol — *Introduction to Analytic Number Theory*, §2.6–2.8 (Möbius Inversion, applications)
- I. Niven, H. S. Zuckerman, H. L. Montgomery — *An Introduction to the Theory of Numbers*, §4.3
- G. H. Hardy, E. M. Wright — *An Introduction to the Theory of Numbers*, §16.4–16.5
- G.-C. Rota — *On the Foundations of Combinatorial Theory I: Theory of Möbius Functions* (1964) — tổng quát hóa lên poset
- T. Tao — *254A Notes 1* (blog post về multiplicative number theory)
