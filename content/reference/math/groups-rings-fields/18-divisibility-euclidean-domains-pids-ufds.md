---
title: "18. Divisibility — Euclidean Domains, PIDs, and UFDs"
type: math-component
tags: [math, groups-rings-fields, ring-theory, divisibility, lesson-18]
aliases: [Divisibility, Euclidean Domains, PIDs, UFDs]
created: 2026-05-15
---

> **Prerequisites**: [[17-integral-domains-and-fields-of-fractions|17. Integral Domains and Fields of Fractions]] — miền nguyên, đặc số; [[15-ideals-and-quotient-rings|15. Ideals and Quotient Rings]] — ideal, ideal chính.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $\mathbb{Z}[i]$ | Vành số nguyên Gauss |
> | $\mathbb{Z}[\sqrt{-5}]$ | Vành $\{a + b\sqrt{-5} : a, b \in \mathbb{Z}\}$ |
> | $F[x]$ | Vành đa thức trên trường $F$ |
> | $R^\times$ | Nhóm đơn vị của vành $R$ |
> | $\langle a \rangle$ | Ideal chính sinh bởi $a$ |
> | $\gcd(a, b)$ | Ước chung lớn nhất |
> | $\cong$ | Đẳng cấu (isomorphism) |

> **Objectives**:
> - Hiểu lý thuyết chia hết trong miền nguyên: phần tử liên kết, nguyên tố, bất khả quy
> - Phân biệt phần tử nguyên tố (prime) và bất khả quy (irreducible)
> - Định nghĩa và nắm vững hệ thống phân cấp: ED $\Rightarrow$ PID $\Rightarrow$ UFD $\Rightarrow$ Integral Domain
> - Phát biểu và chứng minh định lý phân tích nhân tử trong UFD
> - Nắm đặc trưng của PID và áp dụng định lý Bézout

---

## Motivation / Intuition

Trong $\mathbb{Z}$, mọi số nguyên dương đều phân tích được thành tích các số nguyên tố, và phân tích đó là duy nhất (Định lý cơ bản của số học). Ta muốn xác định chính xác lớp các vành nào có tính chất "phân tích nhân tử duy nhất" này.

Hành trình dẫn qua ba lớp:
1. **Euclidean Domain (ED)**: có thuật toán chia Euclide — cụ thể nhất.
2. **Principal Ideal Domain (PID)**: mọi ideal là ideal chính — trung gian.
3. **Unique Factorization Domain (UFD)**: phân tích nhân tử duy nhất — tổng quát nhất.

Phân cấp: $\text{ED} \subsetneq \text{PID} \subsetneq \text{UFD} \subsetneq \text{Integral Domain}$.

---

## Lý thuyết chia hết trong miền nguyên

> [!definition] Definition 18.1 — Chia hết, phần tử liên kết, đơn vị
> Cho $R$ là miền nguyên và $a, b \in R$.
>
> - $a$ **chia hết** $b$ (hay $a$ là ước của $b$), ký hiệu $a \mid b$, nếu tồn tại $c \in R$ sao cho $b = ac$.
> - $a$ và $b$ gọi là **liên kết** (associates) nếu $a \mid b$ và $b \mid a$. Tương đương: tồn tại đơn vị $u \in R^\times$ sao cho $b = ua$.
> - Phần tử $a \in R \setminus \{0\}$ gọi là **đơn vị** nếu $a \mid 1$, tức $a \in R^\times$.

> [!definition] Definition 18.2 — Phần tử bất khả quy (Irreducible) và nguyên tố (Prime)
> Cho $R$ là miền nguyên và $p \in R \setminus \{0\}$, $p$ không phải đơn vị.
>
> - $p$ gọi là **bất khả quy** (irreducible) nếu: $p = ab \Rightarrow a \in R^\times$ hoặc $b \in R^\times$.
>   (Tức là $p$ không thể phân tích thành tích hai phần tử không phải đơn vị.)
>
> - $p$ gọi là **nguyên tố** (prime) nếu: $p \mid ab \Rightarrow p \mid a$ hoặc $p \mid b$.
>   (Tức là ideal $\langle p \rangle$ là ideal nguyên tố.)

> [!abstract] Theorem 18.3 — Nguyên tố $\Rightarrow$ Bất khả quy (trong miền nguyên)
> Trong miền nguyên, mọi phần tử nguyên tố đều bất khả quy.

**Proof.** Giả sử $p$ nguyên tố và $p = ab$. Ta có $p \mid ab$, nên $p \mid a$ hoặc $p \mid b$. WLOG $p \mid a$. Tức $a = pc$ với $c \in R$. Khi đó $p = ab = pcb$, nên $1 = cb$ (dùng luật hủy). Vậy $b$ là đơn vị. $\blacksquare$

> [!warning] Counterexample 18.4 — Bất khả quy không nguyên tố
> Trong $\mathbb{Z}[\sqrt{-5}]$, xét phần tử $2$:
>
> - $2$ là **bất khả quy**: nếu $2 = \alpha\beta$ thì $N(2) = 4 = N(\alpha)N(\beta)$, với $N(a + b\sqrt{-5}) = a^2 + 5b^2$. Các giá trị $N = 1, 2, 4$ — nhưng $N = 2$ không đạt được ($a^2 + 5b^2 = 2$ vô nghiệm nguyên). Nên $N(\alpha) = 1$ hoặc $N(\beta) = 1$, tức $\alpha$ hoặc $\beta$ là đơn vị.
>
> - $2$ **không phải nguyên tố**: $2 \mid (1+\sqrt{-5})(1-\sqrt{-5}) = 1 + 5 = 6 = 2 \cdot 3$, nhưng $2 \nmid (1+\sqrt{-5})$ và $2 \nmid (1-\sqrt{-5})$ trong $\mathbb{Z}[\sqrt{-5}]$.
>
> Đây là miền nguyên nhưng **không** là UFD (phân tích không duy nhất: $6 = 2 \cdot 3 = (1+\sqrt{-5})(1-\sqrt{-5})$).

---

## Miền phân tích nhân tử duy nhất (UFD)

> [!definition] Definition 18.5 — Miền Phân Tích Nhân Tử Duy Nhất (Unique Factorization Domain — UFD)
> Miền nguyên $R$ gọi là **UFD** nếu mọi $a \in R \setminus \{0\}$, $a$ không phải đơn vị, đều thỏa:
>
> **(Tồn tại)** $a$ viết được dưới dạng tích hữu hạn các phần tử bất khả quy:
>
> $$
> a = p_1 p_2 \cdots p_n
> $$
>
> **(Duy nhất đến liên kết)** Nếu $a = q_1 q_2 \cdots q_m$ là một phân tích khác với $q_i$ bất khả quy, thì $n = m$ và sau khi sắp xếp lại, $p_i$ liên kết với $q_i$ (tức $p_i = u_i q_i$ với $u_i$ là đơn vị).

> [!abstract] Theorem 18.6 — Đặc trưng UFD qua phần tử nguyên tố
> Miền nguyên $R$ là UFD khi và chỉ khi:
>
> 1. Mọi dãy tăng của ideal chính $\langle a_1 \rangle \subseteq \langle a_2 \rangle \subseteq \langle a_3 \rangle \subseteq \cdots$ dừng lại sau hữu hạn bước (**ACCP** — ascending chain condition on principal ideals).
> 2. Trong $R$, mọi phần tử bất khả quy đều là nguyên tố.

---

## Miền Ideal chính (PID)

> [!definition] Definition 18.7 — Miền Ideal Chính (Principal Ideal Domain — PID)
> Miền nguyên $R$ gọi là **PID** nếu mọi ideal $I \trianglelefteq R$ đều là ideal chính: $I = \langle a \rangle$ với $a \in R$.

> [!abstract] Theorem 18.8 — Mọi PID là UFD
> Mọi PID đều là UFD.

**Proof (phác thảo).**

*Bước 1 — ACCP trong PID*: Nếu $\langle a_1 \rangle \subseteq \langle a_2 \rangle \subseteq \cdots$, đặt $I = \bigcup \langle a_i \rangle$. Vì $R$ là PID, $I = \langle d \rangle$. Tồn tại $N$ sao cho $d \in \langle a_N \rangle$, tức $\langle d \rangle \subseteq \langle a_N \rangle \subseteq I = \langle d \rangle$, vậy $\langle a_N \rangle = \langle d \rangle = I$. Dãy dừng.

*Bước 2 — Bất khả quy = nguyên tố trong PID*: Giả sử $p$ bất khả quy trong PID $R$, và $p \mid ab$. Xét ideal $\langle p, a \rangle$. Vì $R$ là PID, $\langle p, a \rangle = \langle d \rangle$. Vì $p = d \cdot r$, tính bất khả quy của $p$ cho $d$ là đơn vị (tức $\langle d \rangle = R$) hoặc $r$ là đơn vị (tức $\langle d \rangle = \langle p \rangle$).

- Nếu $\langle d \rangle = R$: tồn tại $s, t$ sao cho $ps + at = 1$, nhân $b$: $pbs + abt = b$. Vì $p \mid ab$, cả hai hạng đều chia hết $p$, nên $p \mid b$.
- Nếu $\langle d \rangle = \langle p \rangle$: $p \mid a$. $\blacksquare$

> [!abstract] Theorem 18.9 — Định lý Bézout (Bézout's Identity trong PID)
> Trong PID $R$, $\gcd(a, b)$ tồn tại và thỏa:
>
> $$
> \langle a, b \rangle = \langle \gcd(a, b) \rangle
> $$
>
> Tức là tồn tại $s, t \in R$ sao cho $sa + tb = \gcd(a, b)$.

**Proof.** $\langle a, b \rangle$ là ideal, trong PID là $\langle d \rangle$. Vì $a, b \in \langle d \rangle$, ta có $d \mid a$ và $d \mid b$. Và $d = sa + tb \in \langle a, b \rangle$. Vậy $d = \gcd(a, b)$. $\blacksquare$

> [!example] Example 18.10 — $\mathbb{Z}$ là PID
> Mọi ideal $I$ của $\mathbb{Z}$ có dạng $n\mathbb{Z}$, tức là ideal chính. Định lý Bézout: $\gcd(6, 10) = 2$ và tồn tại $s, t \in \mathbb{Z}$ sao cho $6s + 10t = 2$: lấy $s = 2$, $t = -1$: $12 - 10 = 2$. ✓

---

## Miền Euclid (Euclidean Domain)

> [!definition] Definition 18.11 — Miền Euclid (Euclidean Domain — ED)
> Miền nguyên $R$ gọi là **Euclidean domain** nếu tồn tại hàm **norm Euclid** (Euclidean norm/function) $N: R \setminus \{0\} \to \mathbb{N}_{\geq 0}$ sao cho: với mọi $a, b \in R$, $b \neq 0$, tồn tại $q, r \in R$ thỏa:
>
> $$
> a = bq + r \quad \text{và} \quad (r = 0 \text{ hoặc } N(r) < N(b))
> $$
>
> $q$ gọi là **thương** (quotient), $r$ gọi là **dư** (remainder).

> [!abstract] Theorem 18.12 — Mọi ED là PID
> Mọi Euclidean domain đều là PID.

**Proof.** Cho $I \trianglelefteq R$ là ideal khác $\{0\}$. Chọn $d \in I \setminus \{0\}$ sao cho $N(d)$ nhỏ nhất. Với $a \in I$, chia Euclide: $a = dq + r$ với $r = 0$ hoặc $N(r) < N(d)$. Vì $r = a - dq \in I$ và $N(d)$ nhỏ nhất, $r = 0$. Vậy $a = dq \in \langle d \rangle$, nên $I = \langle d \rangle$. $\blacksquare$

> [!example] Example 18.13 — Các Euclidean Domain kinh điển
> - $\mathbb{Z}$: norm $N(n) = |n|$. Phép chia Euclide cho số nguyên.
> - $F[x]$ với $F$ là trường: norm $N(f) = \deg f$. Phép chia đa thức.
> - $\mathbb{Z}[i]$ (số nguyên Gauss): norm $N(a + bi) = a^2 + b^2$. Phép chia Gauss.
> - $\mathbb{Z}[\omega]$ với $\omega = e^{2\pi i/3}$ (số nguyên Eisenstein): norm $N(a + b\omega) = a^2 - ab + b^2$.

> [!example] Example 18.14 — Thuật toán Euclide trong $\mathbb{Z}[i]$
> Tính $\gcd(11 + 3i, 1 + 8i)$ trong $\mathbb{Z}[i]$:
>
> Chia $a = 11 + 3i$ cho $b = 1 + 8i$:
>
> $$
> \frac{a}{b} = \frac{(11+3i)(1-8i)}{(1+8i)(1-8i)} = \frac{11 - 88i + 3i + 24}{1 + 64} = \frac{35 - 85i}{65} = \frac{7}{13} - \frac{17}{13}i
> $$
>
> Làm tròn đến số nguyên Gauss gần nhất: $q = 1 - i$.
>
> $r = a - bq = (11 + 3i) - (1 + 8i)(1 - i) = (11 + 3i) - (1 - i + 8i + 8) = (11 + 3i) - (9 + 7i) = 2 - 4i$.
>
> $N(r) = 4 + 16 = 20 < 65 = N(b)$. ✓ Tiếp tục chia $b$ cho $r$...

---

## Tóm tắt phân cấp và ví dụ phản chứng

Sơ đồ phân cấp đầy đủ:

```
Fields ⊊ Euclidean Domains ⊊ PIDs ⊊ UFDs ⊊ Integral Domains
```

| Cấu trúc | Ví dụ | Phản ví dụ |
|----------|-------|-----------|
| ED | $\mathbb{Z}$, $F[x]$, $\mathbb{Z}[i]$ | |
| PID nhưng không ED | $\mathbb{Z}\left[\frac{1+\sqrt{-19}}{2}\right]$ | |
| UFD nhưng không PID | $\mathbb{Z}[x]$ (ideal $\langle 2, x \rangle$ không chính) | |
| ID nhưng không UFD | $\mathbb{Z}[\sqrt{-5}]$ | $6 = 2 \cdot 3 = (1+\sqrt{-5})(1-\sqrt{-5})$ |

> [!note] Remark 18.15 — $\mathbb{Z}[x]$ là UFD nhưng không PID
> $\mathbb{Z}[x]$ là UFD (phân tích nhân tử duy nhất qua Gauss's Lemma và tính UFD của $\mathbb{Z}$). Nhưng không phải PID: ideal $\langle 2, x \rangle$ không là ideal chính (như đã thảo luận ở Example 15.5).

> [!abstract] Theorem 18.16 — $R$ UFD $\Rightarrow$ $R[x]$ UFD (Định lý Gauss)
> Nếu $R$ là UFD thì $R[x]$ cũng là UFD.

Điều này cho phép kết luận: $\mathbb{Z}[x_1, \ldots, x_n]$, $F[x_1, \ldots, x_n]$ đều là UFD.

---

## GCD trong PID và thuật toán Euclide mở rộng

> [!definition] Definition 18.17 — Ước chung lớn nhất (GCD) trong miền nguyên
> Trong miền nguyên $R$, **ước chung lớn nhất** của $a, b \in R$ (không đồng thời bằng $0$) là phần tử $d \in R$ sao cho:
>
> 1. $d \mid a$ và $d \mid b$.
> 2. Nếu $c \mid a$ và $c \mid b$ thì $c \mid d$.
>
> $\gcd$ được xác định đến liên kết (associates).

> [!example] Example 18.18 — Thuật toán Euclide mở rộng trong $\mathbb{Z}$
> Tính $\gcd(48, 30)$ và biểu diễn theo Bézout:
>
> $$
> 48 = 1 \cdot 30 + 18
> $$
>
> $$
> 30 = 1 \cdot 18 + 12
> $$
>
> $$
> 18 = 1 \cdot 12 + 6
> $$
>
> $$
> 12 = 2 \cdot 6 + 0
> $$
>
> Vậy $\gcd(48, 30) = 6$. Truy vết ngược:
>
> $$
> 6 = 18 - 1 \cdot 12 = 18 - 1 \cdot (30 - 18) = 2 \cdot 18 - 30 = 2(48 - 30) - 30 = 2 \cdot 48 - 3 \cdot 30
> $$
>
> Vậy $6 = 2 \cdot 48 + (-3) \cdot 30$ — đây là biểu diễn Bézout.

> [!example] Example 18.19 — Thuật toán Euclide trong $\mathbb{Q}[x]$
> Tính $\gcd(x^3 - 1, x^2 - 1)$ trong $\mathbb{Q}[x]$:
>
> $$
> x^3 - 1 = (x)(x^2 - 1) + (x - 1)
> $$
>
> $$
> x^2 - 1 = (x + 1)(x - 1) + 0
> $$
>
> Vậy $\gcd(x^3 - 1, x^2 - 1) = x - 1$ (chọn bản chuẩn hóa là monic). Điều này nhất quán: $x-1$ là ước chung của $x^3 - 1 = (x-1)(x^2+x+1)$ và $x^2-1 = (x-1)(x+1)$.

---

## SageMath — Chia hết, GCD, phân tích nhân tử

```python
# Phân tích nhân tử trong Z
print(factor(360))         # 2^3 * 3^2 * 5

# GCD và Bézout
a, b = 48, 30
g = gcd(a, b)
print(g)                   # 6
g, s, t = xgcd(a, b)       # xgcd trả về (gcd, s, t) với s*a + t*b = gcd
print(s, t, g)             # 2 -3 6  (tức 2*48 + (-3)*30 = 6)

# GCD trong Z[i] (cần kiểm tra phiên bản SageMath)
# Zi = ZZ[I]
# a = Zi(11 + 3*I)
# b = Zi(1 + 8*I)
# print(gcd(a, b))

# Phân tích trong vành đa thức trên Q
R = QQ['x']
x = R.gen()
f = x^4 - 1
print(factor(f))           # (x - 1) * (x + 1) * (x^2 + 1)

# GCD đa thức
g = gcd(x^3 - 1, x^2 - 1)
print(g)                   # x - 1

# Mở rộng Bézout cho đa thức
f1 = x^3 - 1; f2 = x^2 - 1
d, u, v = xgcd(f1, f2)     # xgcd trả về (gcd, u, v) với u*f1 + v*f2 = gcd
print(d)                   # x - 1
print(u * f1 + v * f2)     # x - 1 (verify)

# Kiểm tra UFD, PID
print(ZZ.is_unique_factorization_domain())     # True
print(ZZ['x'].is_unique_factorization_domain()) # True
print(ZZ in PrincipalIdealDomains())           # True (Z là PID)
print(ZZ['x'] in PrincipalIdealDomains())      # False (Z[x] không là PID)
```

---

## Summary — Lesson 18

- **Ước, liên kết, đơn vị**: $a \mid b \Leftrightarrow b \in \langle a \rangle$; liên kết $\Leftrightarrow$ $b = ua$, $u$ đơn vị.
- **Bất khả quy** (irreducible): $p = ab \Rightarrow a$ hoặc $b$ là đơn vị.
- **Nguyên tố** (prime): $p \mid ab \Rightarrow p \mid a$ hoặc $p \mid b$.
- Nguyên tố $\Rightarrow$ bất khả quy (trong miền nguyên); ngược lại không đúng nói chung.
- **UFD**: tồn tại và duy nhất phân tích nhân tử.
- **PID**: mọi ideal là ideal chính. PID $\Rightarrow$ UFD.
- **ED**: có thuật toán chia Euclide. ED $\Rightarrow$ PID.
- Phân cấp: Trường $\subsetneq$ ED $\subsetneq$ PID $\subsetneq$ UFD $\subsetneq$ Miền nguyên.
- **Bézout trong PID**: $\langle a, b \rangle = \langle \gcd(a,b) \rangle$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §8.1–8.3.
- Hungerford, T. W. *Algebra*, Chapter III §3.
- Lang, S. *Algebra* (3rd ed.), Chapter II §5.
- Ireland, K., & Rosen, M. *A Classical Introduction to Modern Number Theory*, Chapter 1.
