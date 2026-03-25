---
title: "01. Rings, Ideals và Polynomial Rings"
tags: [math, galois-theory, lesson-01]
aliases: [Rings, Ideals và Polynomial Rings]
created: 2026-03-24
---

> **Prerequisites**: Group Theory (nhóm, homomorphism, quotient group), Linear Algebra (vector space cơ bản)
> **Objectives**:
> - Hiểu định nghĩa ring và nhận diện các ví dụ cơ bản
> - Nắm vững khái niệm ideal và quotient ring $R/I$
> - Hiểu cấu trúc polynomial ring $F[x]$ và tính chất chia trong đó
> - Áp dụng tiêu chuẩn Eisenstein để kiểm tra tính bất khả quy
> - Phân biệt các lớp domain: Euclidean domain, PID, UFD

---

## Motivation / Intuition

Trong Group Theory, ta chỉ có **một** phép toán. Nhưng các đối tượng toán học quen thuộc nhất — số nguyên $\mathbb{Z}$, đa thức $\mathbb{Q}[x]$, ma trận — đều có **hai** phép toán: cộng và nhân. Cấu trúc nắm bắt điều này là **ring** (vành).

Lý do ring xuất hiện tự nhiên trong Galois Theory: để hiểu rằng $\sqrt{2}$ là nghiệm của $x^2 - 2$, ta cần làm việc trong ring đa thức $\mathbb{Q}[x]$. Để "tạo ra" field mới chứa $\sqrt{2}$, ta lấy quotient ring $\mathbb{Q}[x]/(x^2 - 2)$. Toàn bộ bộ máy của Galois Theory được xây trên ý tưởng này.

Hơn nữa, **ideal** đóng vai trò trong ring giống như **normal subgroup** đóng vai trò trong nhóm: chúng là đúng loại cấu trúc con cho phép ta tạo quotient có nghĩa. Sự tương tự này không ngẫu nhiên — cả hai đều là trường hợp đặc biệt của khái niệm **congruence** tổng quát hơn.

---

## Ring (Vành)

### Definition

> [!definition] Definition 1.1 — Ring
> Một **ring** là một bộ $(R, +, \cdot)$ gồm một tập hợp $R$ với hai phép toán thỏa mãn:
>
> 1. $(R, +)$ là một **nhóm Abel** (commutative group).
> 2. Phép nhân $\cdot$ **kết hợp**: $\forall\, a, b, c \in R$,
>
> $$
> (a \cdot b) \cdot c = a \cdot (b \cdot c)
> $$
>
> 3. **Phân phối** (Distributivity) hai chiều:
>
> $$
> a \cdot (b + c) = a \cdot b + a \cdot c, \quad (a + b) \cdot c = a \cdot c + b \cdot c
> $$
>
> Nếu ngoài ra $\exists\, 1 \in R$ sao cho $1 \cdot a = a \cdot 1 = a$ với mọi $a$, ta nói $R$ là **ring với đơn vị** (ring with unity). Nếu phép nhân giao hoán ($a \cdot b = b \cdot a$), ta nói $R$ là **commutative ring**.

> [!note] Remark 1.2
> Trong toàn bộ khóa học này, **ring** mặc định có nghĩa là *commutative ring with unity* trừ khi nói rõ khác. Đây là quy ước phổ biến trong Algebra hiện đại (Dummit–Foote, Atiyah–MacDonald).

### Các ví dụ quan trọng

> [!example] Example 1.3 — Bảng các ring cơ bản
> | Ring | Cộng | Nhân | Commutative? | Unity? |
> |------|------|------|--------------|--------|
> | $\mathbb{Z}$ | cộng thường | nhân thường | Có | $1$ |
> | $\mathbb{Z}/n\mathbb{Z}$ | cộng mod $n$ | nhân mod $n$ | Có | $\bar{1}$ |
> | $\mathbb{Q}, \mathbb{R}, \mathbb{C}$ | cộng thường | nhân thường | Có | $1$ |
> | $F[x]$ ($F$ là field) | cộng đa thức | nhân đa thức | Có | $1$ |
> | $M_n(\mathbb{R})$ (ma trận $n \times n$) | cộng ma trận | nhân ma trận | **Không** | $I_n$ |

### Zero divisors và Integral Domains

> [!definition] Definition 1.4 — Zero Divisor và Integral Domain
> Trong ring $R$, phần tử $a \neq 0$ được gọi là **zero divisor** (ước của không) nếu $\exists\, b \neq 0$ sao cho $a \cdot b = 0$.
>
> Ring commutative with unity được gọi là **integral domain** (miền nguyên) nếu nó không có zero divisor, tức là:
>
> $$
> a \cdot b = 0 \implies a = 0 \text{ hoặc } b = 0
> $$

> [!example] Example 1.5 — Zero divisors trong $\mathbb{Z}/6\mathbb{Z}$
> Trong $\mathbb{Z}/6\mathbb{Z}$: $\bar{2} \cdot \bar{3} = \bar{6} = \bar{0}$, nhưng $\bar{2} \neq \bar{0}$ và $\bar{3} \neq \bar{0}$.
>
> Vậy $\bar{2}$ và $\bar{3}$ là zero divisors. $\mathbb{Z}/6\mathbb{Z}$ **không** phải integral domain.
>
> Ngược lại, $\mathbb{Z}$ và $\mathbb{Q}[x]$ đều là integral domains.

---

## Ideal và Quotient Ring

### Definition

> [!definition] Definition 1.6 — Ideal
> Cho $R$ là ring commutative with unity. Một tập con $I \subseteq R$ được gọi là **ideal** của $R$, ký hiệu $I \trianglelefteq R$, nếu:
>
> 1. $(I, +)$ là subgroup của $(R, +)$: $0 \in I$; $a, b \in I \implies a - b \in I$.
> 2. **Đóng với nhân từ ngoài**: $r \in R$, $a \in I \implies r \cdot a \in I$.

Điều kiện (2) chính là điểm khác biệt giữa ideal và subring thông thường.

> [!example] Example 1.7 — Ideal trong $\mathbb{Z}$
> Với $n \in \mathbb{Z}$, tập hợp $n\mathbb{Z} = \{nk \mid k \in \mathbb{Z}\}$ là ideal của $\mathbb{Z}$.
>
> Nếu $a = nk \in n\mathbb{Z}$ và $r \in \mathbb{Z}$, thì $r \cdot a = r \cdot nk = n(rk) \in n\mathbb{Z}$. ✓
>
> Thực ra, **mọi** ideal của $\mathbb{Z}$ đều có dạng $n\mathbb{Z}$ với $n \geq 0$. ($\mathbb{Z}$ là principal ideal domain — ta sẽ thấy lý do bên dưới.)

> [!definition] Definition 1.8 — Principal Ideal
> Ideal **sinh bởi một phần tử** $a \in R$ là:
>
> $$
> (a) = aR = \left\{ ra \mid r \in R \right\}
> $$
>
> Đây gọi là **principal ideal**. Ideal sinh bởi tập $\{a_1, \ldots, a_k\}$ ký hiệu là $(a_1, \ldots, a_k)$.

### Quotient Ring

> [!definition] Definition 1.9 — Quotient Ring
> Cho $I \trianglelefteq R$. Ta định nghĩa **quotient ring** (ring thương) $R/I$ như sau:
>
> - Các phần tử: các coset $a + I = \{a + i \mid i \in I\}$, với $a \in R$.
> - Cộng: $(a + I) + (b + I) = (a + b) + I$.
> - Nhân: $(a + I) \cdot (b + I) = (ab) + I$.
>
> $R/I$ tạo thành một ring với đơn vị $1 + I$.

> [!abstract] Theorem 1.10 — Điều kiện tạo field từ quotient ring
> Cho $F$ là field và $p(x) \in F[x]$. Khi đó:
>
> $$
> F[x]/(p(x)) \text{ là field} \iff p(x) \text{ bất khả quy trên } F
> $$

**Proof.**
Nhắc lại: $F[x]$ là PID (xem Definition 1.16). Trong PID, một ideal $(p)$ là **maximal** khi và chỉ khi $p$ là phần tử bất khả quy. Và trong ring commutative with unity, một ideal $I$ là maximal khi và chỉ khi $R/I$ là field (đây là định lý chuẩn về maximal ideal).

Kết hợp hai điều: $F[x]/(p(x))$ là field $\iff$ $(p(x))$ là maximal ideal $\iff$ $p(x)$ bất khả quy. $\blacksquare$

Đây là **định lý trung tâm** mà chúng ta sẽ dùng xuyên suốt để xây dựng field extensions!

> [!example] Example 1.11 — $\mathbb{Q}[x]/(x^2 - 2) \cong \mathbb{Q}(\sqrt{2})$
> Vì $x^2 - 2$ bất khả quy trên $\mathbb{Q}$ (không có nghiệm hữu tỉ, theo định lý nghiệm hữu tỉ), nên $\mathbb{Q}[x]/(x^2 - 2)$ là field.
>
> Đặt $\alpha = x + (x^2 - 2)$ (lớp coset của $x$). Trong quotient này, $\alpha^2 - 2 = 0$, tức $\alpha^2 = 2$.
>
> Mọi phần tử của $\mathbb{Q}[x]/(x^2 - 2)$ có dạng $a + b\alpha$ với $a, b \in \mathbb{Q}$.
>
> Field này đẳng cấu với $\mathbb{Q}(\sqrt{2}) = \{a + b\sqrt{2} \mid a, b \in \mathbb{Q}\}$.

---

## Polynomial Ring $F[x]$

### Thuật toán chia và hệ quả

> [!definition] Definition 1.12 — Polynomial Ring
> Cho $F$ là field. **Polynomial ring** $F[x]$ là tập hợp các đa thức hệ số trong $F$:
>
> $$
> F[x] = \left\{ a_n x^n + a_{n-1} x^{n-1} + \cdots + a_0 \mid n \geq 0,\ a_i \in F \right\}
> $$
>
> với phép cộng và nhân đa thức thông thường. **Degree** của $f(x) \neq 0$ ký hiệu là $\deg f$.

> [!abstract] Theorem 1.13 — Division Algorithm (Thuật toán chia Euclid)
> Cho $F$ là field và $f(x), g(x) \in F[x]$ với $g(x) \neq 0$. Khi đó tồn tại **duy nhất** $q(x), r(x) \in F[x]$ sao cho:
>
> $$
> f(x) = q(x)\,g(x) + r(x), \quad \deg r < \deg g \text{ (hoặc } r = 0\text{)}
> $$

**Proof.** Chứng minh bằng thuật toán chia trường học, quy nạp theo $\deg f$. Tính duy nhất từ việc $g \neq 0$ trong field. $\blacksquare$

Điều này **không** đúng trong $\mathbb{Z}[x]$: ta không thể chia $2x + 1$ cho $2x$ trong $\mathbb{Z}[x]$!

> [!abstract] Theorem 1.14 — Factor Theorem (Định lý Thừa số)
> $\alpha \in F$ là nghiệm của $f(x) \in F[x]$ khi và chỉ khi $(x - \alpha) \mid f(x)$ trong $F[x]$.

**Proof.** Chia $f(x) = (x - \alpha)q(x) + r$ với $r \in F$ (vì $\deg r < 1$). Thay $x = \alpha$: $f(\alpha) = 0 + r = r$. Vậy $f(\alpha) = 0 \iff r = 0 \iff (x-\alpha) \mid f(x)$. $\blacksquare$

> [!note] Remark 1.15
> Hệ quả quan trọng: đa thức bậc $n$ có **nhiều nhất $n$ nghiệm** trong $F$ (không tính bội).

### Irreducible Polynomials

> [!definition] Definition 1.16 — Bất khả quy (Irreducible)
> $p(x) \in F[x]$ với $\deg p \geq 1$ được gọi là **irreducible** (bất khả quy) trên $F$ nếu nó không thể phân tích thành tích $p(x) = f(x)\,g(x)$ với $\deg f \geq 1$ và $\deg g \geq 1$.
>
> Ngược lại, $p(x)$ gọi là **reducible** (khả quy).

> [!example] Example 1.17
> - $x^2 - 2$ là irreducible trên $\mathbb{Q}$ (không có nghiệm hữu tỉ) nhưng **reducible** trên $\mathbb{R}$: $x^2 - 2 = (x - \sqrt{2})(x + \sqrt{2})$.
> - $x^2 + 1$ là irreducible trên $\mathbb{R}$ nhưng reducible trên $\mathbb{C}$: $x^2 + 1 = (x-i)(x+i)$.
> - $x^2 + x + 1$ là irreducible trên $\mathbb{F}_2 = \{0, 1\}$: thử $f(0) = 1 \neq 0$, $f(1) = 1 \neq 0$.

> [!warning] Counterexample 1.18 — Tính bất khả quy phụ thuộc vào field nền
> Cùng một đa thức có thể irreducible trên field này nhưng reducible trên field khác. Đây là lý do Galois Theory quan tâm đến "extension" — để phân tích được những đa thức hiện tại đang bất khả quy.

### Eisenstein Criterion

> [!abstract] Theorem 1.19 — Eisenstein Criterion
> Cho $f(x) = a_n x^n + \cdots + a_1 x + a_0 \in \mathbb{Z}[x]$. Giả sử tồn tại số nguyên tố $p$ sao cho:
>
> 1. $p \nmid a_n$ (hệ số bậc cao nhất),
> 2. $p \mid a_i$ với mọi $i < n$,
> 3. $p^2 \nmid a_0$.
>
> Khi đó $f(x)$ bất khả quy trên $\mathbb{Q}$.

**Proof.** Giả sử $f = gh$ với $g, h \in \mathbb{Z}[x]$, $\deg g, \deg h \geq 1$. Xét modulo $p$: $\bar{f} = \bar{g}\bar{h}$ trong $\mathbb{F}_p[x]$. Điều kiện 1–2 cho thấy $\bar{f} = \bar{a}_n x^n$ trong $\mathbb{F}_p[x]$. Vì $\mathbb{F}_p[x]$ là UFD, ta có $\bar{g} = c\,x^r$ và $\bar{h} = d\,x^s$. Điều này buộc hệ số tự do của $g$ và $h$ đều chia hết bởi $p$, nên $p^2 \mid a_0$ — mâu thuẫn với điều kiện 3. $\blacksquare$

> [!example] Example 1.20 — Ứng dụng Eisenstein
> **$x^n - 2$ bất khả quy trên $\mathbb{Q}$** với mọi $n \geq 1$: dùng $p = 2$. $p \nmid 1$ (hệ số $x^n$), $p \mid -2$ (hệ số tự do), $p^2 = 4 \nmid -2$. ✓
>
> **Cyclotomic polynomial $\Phi_p(x) = x^{p-1} + x^{p-2} + \cdots + 1$ bất khả quy trên $\mathbb{Q}$** (với $p$ nguyên tố): thay $x \to x+1$ rồi dùng Eisenstein với nguyên tố $p$.

---

## Hệ thống phân cấp: ED, PID, UFD

Ba lớp domain quan trọng, được sắp xếp từ "mạnh nhất" đến "yếu nhất":

$$
\text{Field} \subset \text{Euclidean Domain} \subset \text{PID} \subset \text{UFD} \subset \text{Integral Domain}
$$

> [!definition] Definition 1.21 — Euclidean Domain (ED)
> Integral domain $R$ được gọi là **Euclidean domain** nếu tồn tại hàm *kích thước* $\phi: R \setminus \{0\} \to \mathbb{Z}_{\geq 0}$ sao cho: với mọi $a, b \in R$, $b \neq 0$, tồn tại $q, r \in R$ với
>
> $$
> a = qb + r \quad \text{và} \quad r = 0 \text{ hoặc } \phi(r) < \phi(b)
> $$

> [!definition] Definition 1.22 — Principal Ideal Domain (PID)
> Integral domain $R$ được gọi là **PID** (miền principal ideal) nếu **mọi** ideal của $R$ đều là principal: $I = (a)$ với $a \in R$.

> [!definition] Definition 1.23 — Unique Factorization Domain (UFD)
> Integral domain $R$ được gọi là **UFD** (miền phân tích nhân tử duy nhất) nếu mọi phần tử $r \neq 0$ không phải unit đều viết được dưới dạng:
>
> $$
> r = p_1 p_2 \cdots p_k
> $$
>
> với $p_i$ là các phần tử bất khả quy (irreducible), và cách viết này là **duy nhất** (sai khác unit và hoán vị).

> [!abstract] Theorem 1.24 — Các ví dụ tiêu chuẩn
> - $\mathbb{Z}$ là Euclidean domain (với $\phi(n) = |n|$), do đó là PID và UFD.
> - $F[x]$ (với $F$ là field) là Euclidean domain (với $\phi(f) = \deg f$), do đó là PID và UFD.
> - $\mathbb{Z}[x]$ là UFD nhưng **không** phải PID: ideal $(2, x)$ không phải principal.

**Proof sketch của $F[x]$ là ED.** Division Algorithm (Theorem 1.13) chính là Euclidean algorithm với $\phi = \deg$. $\blacksquare$

Lý do ta cần các lớp này: trong $F[x]$, vì là UFD, mọi đa thức phân tích nhân tử thành các irreducible là **duy nhất**. Điều này đảm bảo minimal polynomial (sẽ gặp ở Lesson 02) được định nghĩa tốt.

---

## SageMath Cheatsheet

Tạo polynomial ring và làm việc với ideal và quotient ring:

```sage
F = QQ
Fx.<x> = PolynomialRing(F)

p = x^2 - 2
print(p.is_irreducible())

I = Fx.ideal(p)
Q.<a> = Fx.quotient(I)
print(a^2)

f = x^5 - 1
print(f.factor())

Fp = GF(5)
Fpx.<t> = PolynomialRing(Fp)
g = t^2 + t + 1
print(g.is_irreducible())

print(ZZ['x'].ideal([2, x]).is_principal())
```

---

## Summary / Key Takeaways

- Ring $(R, +, \cdot)$ có hai phép toán: $(R,+)$ là nhóm Abel, nhân kết hợp và phân phối.
- **Ideal** $I \trianglelefteq R$ đóng với nhân từ ngoài — đây là điều kiện để tạo quotient ring $R/I$.
- $F[x]/(p(x))$ là **field** khi và chỉ khi $p(x)$ irreducible trên $F$.
- $F[x]$ là **Euclidean domain** (thông qua Division Algorithm), do đó là PID và UFD.
- Mọi ideal của $F[x]$ đều là principal: $I = (g(x))$ với $g$ là GCD của các phần tử trong $I$.
- **Eisenstein criterion**: công cụ thực tế để chứng minh đa thức bất khả quy trên $\mathbb{Q}$.
- Tính bất khả quy **phụ thuộc vào field nền** — đây là động lực cốt lõi của lý thuyết field extensions.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapters 8–9.
- Lang, S. *Algebra* (3rd ed.), Chapter II.
- Milne, J. S. *Fields and Galois Theory*, §1. Có tại https://www.jmilne.org/math/CourseNotes/FT.pdf
- Stewart, I. *Galois Theory* (4th ed.), Chapters 2–3.
