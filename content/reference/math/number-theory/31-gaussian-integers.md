---
title: "31. Số Nguyên Gauss Z[i]"
type: foundation
tags: [math, number-theory, lesson-31, gaussian-integers]
aliases: [Gaussian Integers]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]], [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]], [[05-congruences|05. Quan Hệ Đồng Dư]]
> **Objectives**:
> - Định nghĩa vành số nguyên Gauss $\mathbb{Z}[i]$ và norm $N(a+bi)$
> - Xác định các phần tử khả nghịch (units) của $\mathbb{Z}[i]$
> - Chứng minh $\mathbb{Z}[i]$ là Euclidean Domain với norm là Euclidean function
> - Thực hiện thuật toán Euclid trong $\mathbb{Z}[i]$ và tính GCD

---

## Motivation / Intuition

Xét phương trình $x^2 + y^2 = 5$. Nghiệm nguyên $(x,y) = (1,2)$ cho ta $5 = 1^2 + 2^2$. Nhưng để ý rằng trong số phức:

$$
5 = (1+2i)(1-2i)
$$

Số $5$ — vốn là số nguyên tố trong $\mathbb{Z}$ — **phân tích được** khi ta chuyển sang thế giới số phức! Đây là khoảnh khắc "aha": thay vì hỏi "số nào là tổng hai bình phương", ta có thể hỏi "số nào phân tích được trong $\mathbb{Z}[i]$".

Gauss nhận ra rằng tập $\mathbb{Z}[i] = \{a+bi : a,b \in \mathbb{Z}\}$ — gọi là **số nguyên Gauss** (Gaussian integers) — là một mở rộng tự nhiên của $\mathbb{Z}$ với đầy đủ các tính chất số học: phép chia có dư, thuật toán Euclid, Bézout's identity, và quan trọng nhất — **phân tích duy nhất ra thừa số nguyên tố**. Nhưng "nguyên tố" ở đây là Gaussian primes, và câu chuyện phong phú hơn nhiều.

Bài này xây dựng nền tảng: định nghĩa, norm, units, và Euclidean algorithm trong $\mathbb{Z}[i]$.

---

## Định Nghĩa và Norm

### Định nghĩa vành $\mathbb{Z}[i]$

> [!definition] Definition 31.1 — Số nguyên Gauss (Gaussian Integers)
> Tập hợp **số nguyên Gauss**, ký hiệu $\mathbb{Z}[i]$, là:
>
> $$
> \mathbb{Z}[i] = \{a + bi \mid a, b \in \mathbb{Z}\}
> $$
>
> trong đó $i^2 = -1$. Đây là tập con của $\mathbb{C}$ gồm các số phức có cả phần thực và phần ảo là số nguyên.
>
> Với phép cộng và nhân thông thường của số phức, $\mathbb{Z}[i]$ là một **vành giao hoán có đơn vị** (commutative ring with unity).

> [!note] Remark 31.2 — Tại sao gọi là "số nguyên"?
> Cũng như $\mathbb{Z}$ là tập các điểm nguyên trên đường thẳng thực, $\mathbb{Z}[i]$ là tập các điểm nguyên trên mặt phẳng phức — một **lưới vuông** (square lattice) với khoảng cách đơn vị. Đây là $\mathbb{Z}$-module hạng 2 với cơ sở $\{1, i\}$.

### Norm — thước đo kích thước

> [!definition] Definition 31.3 — Norm của Gaussian integer
> **Norm** (chuẩn) của $\alpha = a + bi \in \mathbb{Z}[i]$ được định nghĩa:
>
> $$
> N(\alpha) = N(a+bi) = a^2 + b^2 = |\alpha|^2 = \alpha \overline{\alpha}
> $$
>
> trong đó $\overline{\alpha} = a - bi$ là liên hợp phức (complex conjugate) của $\alpha$.

Norm là một số nguyên không âm, đo "kích thước" của Gaussian integer. Về mặt hình học, $N(\alpha)$ là bình phương khoảng cách từ $\alpha$ đến gốc tọa độ trong mặt phẳng phức.

> [!example] Example 31.4 — Tính norm
> - $N(3+4i) = 3^2 + 4^2 = 9 + 16 = 25$.
> - $N(1+i) = 1^2 + 1^2 = 2$.
> - $N(7) = 7^2 + 0^2 = 49$.
> - $N(2i) = 0^2 + 2^2 = 4$.
> - $N(0) = 0$.

### Tính chất cơ bản của norm

> [!theorem] Theorem 31.5 — Tính chất của norm
> Cho $\alpha, \beta \in \mathbb{Z}[i]$:
>
> **(i) Tính nhân tính** (Multiplicativity): $N(\alpha\beta) = N(\alpha) N(\beta)$.
>
> **(ii)** $N(\alpha) = 0 \iff \alpha = 0$.
>
> **(iii)** Nếu $\alpha \mid \beta$ trong $\mathbb{Z}[i]$ thì $N(\alpha) \mid N(\beta)$ trong $\mathbb{Z}$.
>
> **(iv)** $N(\alpha) = 1 \iff \alpha \in \{\pm 1, \pm i\}$.

**Proof.**

**(i)** Viết $\alpha = a+bi$, $\beta = c+di$. Tính trực tiếp:

$$
N(\alpha\beta) = (ac-bd)^2 + (ad+bc)^2 = (a^2+b^2)(c^2+d^2) = N(\alpha)N(\beta)
$$

Đẳng thức $(a^2+b^2)(c^2+d^2) = (ac-bd)^2 + (ad+bc)^2$ chính là **Brahmagupta–Fibonacci identity**. Hoặc đơn giản: $N(\alpha\beta) = \alpha\beta\overline{\alpha\beta} = \alpha\overline{\alpha}\beta\overline{\beta} = N(\alpha)N(\beta)$.

**(ii)** $a^2+b^2 = 0 \iff a = b = 0$ (với $a,b \in \mathbb{Z}$).

**(iii)** Nếu $\beta = \alpha\gamma$, thì $N(\beta) = N(\alpha)N(\gamma)$, nên $N(\alpha) \mid N(\beta)$ trong $\mathbb{Z}$.

**(iv)** $a^2 + b^2 = 1$ với $a,b \in \mathbb{Z}$ chỉ có các nghiệm $(a,b) = (\pm 1, 0), (0, \pm 1)$, tương ứng với $\pm 1, \pm i$. $\blacksquare$

> [!note] Remark 31.6 — Chiều ngược của (iii)
> $N(\alpha) \mid N(\beta)$ trong $\mathbb{Z}$ **không** kéo theo $\alpha \mid \beta$ trong $\mathbb{Z}[i]$. Ví dụ: $\alpha = 1+i$ có $N(\alpha)=2$, $\beta = 2$ có $N(\beta)=4$. $2 \mid 4$ trong $\mathbb{Z}$, nhưng $2/(1+i) = 1-i \in \mathbb{Z}[i]$ nên thực ra $(1+i) \mid 2$ (trùng hợp). Phản ví dụ thực sự: $\alpha = 3$, $\beta = 1+2i$. $N(3)=9 \mid 5 = N(1+2i)$? Không, $9 \nmid 5$. Để có phản ví dụ: $N(2+i) = 5 \mid 25 = N(3+4i)$, kiểm tra $(3+4i)/(2+i) = 2+i \in \mathbb{Z}[i]$, nên thực ra chia hết. Phản ví dụ chuẩn: $\alpha = 1+2i$ ($N=5$), $\beta = 2+i$ ($N=5$). $5 \mid 5$ nhưng $(2+i)/(1+2i) = (2+i)(1-2i)/5 = (4-3i)/5 \notin \mathbb{Z}[i]$.

---

## Units — Phần Tử Khả Nghịch

Trong $\mathbb{Z}$, các phần tử khả nghịch (có nghịch đảo cũng là số nguyên) chỉ là $\pm 1$. Trong $\mathbb{Z}[i]$, có thêm $\pm i$.

> [!theorem] Theorem 31.7 — Units của $\mathbb{Z}[i]$
> Nhóm các phần tử khả nghịch của $\mathbb{Z}[i]$ là:
>
> $$
> \mathbb{Z}[i]^{\times} = \{\alpha \in \mathbb{Z}[i] \mid N(\alpha) = 1\} = \{1, -1, i, -i\}
> $$
>
> Nhóm này đẳng cấu với $\mathbb{Z}/4\mathbb{Z}$ (cyclic cấp $4$, sinh bởi $i$).

**Proof.** Nếu $\alpha$ khả nghịch, tồn tại $\beta \in \mathbb{Z}[i]$ với $\alpha\beta = 1$. Lấy norm: $N(\alpha)N(\beta) = 1$. Vì $N(\alpha), N(\beta) \in \mathbb{Z}_{\geq 0}$, suy ra $N(\alpha) = 1$. Từ Theorem 31.5(iv), $\alpha \in \{\pm 1, \pm i\}$. Ngược lại, mỗi phần tử này đều khả nghịch: $1 \cdot 1 = 1$, $(-1)(-1) = 1$, $i \cdot (-i) = 1$. $\blacksquare$

> [!definition] Definition 31.8 — Associates (Phần tử liên kết)
> Hai phần tử $\alpha, \beta \in \mathbb{Z}[i]$ gọi là **associates** (liên kết) nếu $\alpha = u\beta$ với $u$ là một unit. Đây là quan hệ tương đương.
>
> Mỗi lớp associate có đúng $4$ phần tử: $\{\alpha, -\alpha, i\alpha, -i\alpha\}$ (trừ khi $\alpha=0$).

> [!example] Example 31.9 — Associates
> Các associate của $2+i$: $\{2+i, -2-i, -1+2i, 1-2i\}$.
> Kiểm tra: $i(2+i) = -1+2i$, $-i(2+i) = 1-2i$.

---

## Division Algorithm trong $\mathbb{Z}[i]$

Trong $\mathbb{Z}$, với mọi $a,b \neq 0$, tồn tại $q,r$ với $a = bq + r$ và $0 \leq r < |b|$. Trong $\mathbb{Z}[i]$, "kích thước" được đo bằng norm.

> [!theorem] Theorem 31.10 — Division Algorithm trong $\mathbb{Z}[i]$
> Cho $\alpha, \beta \in \mathbb{Z}[i]$ với $\beta \neq 0$. Tồn tại $\gamma, \rho \in \mathbb{Z}[i]$ sao cho:
>
> $$
> \alpha = \beta\gamma + \rho, \qquad 0 \leq N(\rho) < N(\beta)
> $$

**Proof.** Xét thương phức $\alpha/\beta = u + vi$ với $u, v \in \mathbb{Q}$. Chọn $m, n \in \mathbb{Z}$ là các số nguyên gần $u, v$ nhất:

$$
|u - m| \leq \frac{1}{2}, \qquad |v - n| \leq \frac{1}{2}
$$

Đặt $\gamma = m + ni \in \mathbb{Z}[i]$ và $\rho = \alpha - \beta\gamma$. Khi đó:

$$
\rho = \beta\left(\frac{\alpha}{\beta} - \gamma\right) = \beta\big((u-m) + (v-n)i\big)
$$

Lấy norm:

$$
N(\rho) = N(\beta) \cdot \big((u-m)^2 + (v-n)^2\big) \leq N(\beta) \cdot \left(\frac{1}{4} + \frac{1}{4}\right) = \frac{1}{2} N(\beta) < N(\beta)
$$

Tồn tại $\gamma, \rho$ thỏa mãn. (Không đòi hỏi tính duy nhất.) $\blacksquare$

> [!tip] Ý tưởng hình học
> Chia $\alpha$ cho $\beta$ trong $\mathbb{C}$ được một điểm $z = \alpha/\beta$. Chọn điểm nguyên gần $z$ nhất trong lưới $\mathbb{Z}[i]$ làm thương $\gamma$. Phần dư $\rho$ nằm trong hình vuông cạnh $1$ quanh gốc, nên norm của nó tối đa bằng $1/2$ norm của $\beta$.

> [!example] Example 31.11 — Thực hiện phép chia
> Chia $\alpha = 3+5i$ cho $\beta = 1+i$:
>
> $$
> \frac{\alpha}{\beta} = \frac{3+5i}{1+i} = \frac{(3+5i)(1-i)}{2} = \frac{8+2i}{2} = 4 + i
> $$
>
> Thương là số nguyên sẵn: $\gamma = 4 + i$, $\rho = \alpha - \beta\gamma = (3+5i) - (1+i)(4+i) = (3+5i) - (3+5i) = 0$.
>
> $N(\rho) = 0 < N(\beta) = 2$. ✓

> [!example] Example 31.12 — Chia với phần dư khác 0
> Chia $\alpha = 5+3i$ cho $\beta = 2+i$:
>
> $$
> \frac{\alpha}{\beta} = \frac{5+3i}{2+i} = \frac{(5+3i)(2-i)}{5} = \frac{13+i}{5} = 2.6 + 0.2i
> $$
>
> Chọn $\gamma = 3 + 0i = 3$ (làm tròn $2.6 \mapsto 3$, $0.2 \mapsto 0$). Khi đó:
>
> $$
> \rho = \alpha - \beta\gamma = (5+3i) - (2+i) \cdot 3 = (5+3i) - (6+3i) = -1
> $$
>
> $N(\rho) = 1 < N(\beta) = 5$. ✓
>
> (Có thể chọn $\gamma = 2+0i = 2$, khi đó $\rho = 1+2i$, $N(\rho) = 5$ không thỏa mãn.)

---

## Hệ Quả: Euclidean Domain và UFD

> [!theorem] Theorem 31.13 — $\mathbb{Z}[i]$ là Euclidean Domain
> $\mathbb{Z}[i]$ với Euclidean function $N(\cdot)$ là một **Euclidean Domain** (miền Euclid). Hệ quả:
>
> **(i)** $\mathbb{Z}[i]$ là **Principal Ideal Domain** (PID) — mọi ideal đều là ideal chính.
>
> **(ii)** $\mathbb{Z}[i]$ là **Unique Factorization Domain** (UFD) — mọi phần tử khác $0$ và không phải unit đều phân tích duy nhất thành tích các irreducible (Gaussian primes), sai khác thứ tự và associates.
>
> **(iii)** Trong $\mathbb{Z}[i]$, irreducible $\iff$ prime.

**Proof.** Division algorithm (Theorem 31.10) chứng minh $\mathbb{Z}[i]$ là Euclidean. Phần còn lại là các định lý đại số chuẩn: Euclidean $\Rightarrow$ PID $\Rightarrow$ UFD, và trong UFD, irreducible = prime. $\blacksquare$

---

## Thuật Toán Euclid và GCD trong $\mathbb{Z}[i]$

### Định nghĩa GCD

> [!definition] Definition 31.14 — GCD trong $\mathbb{Z}[i]$
> Cho $\alpha, \beta \in \mathbb{Z}[i]$, không đồng thời bằng $0$. Một **greatest common divisor** (GCD) của $\alpha$ và $\beta$ là phần tử $\delta \in \mathbb{Z}[i]$ có norm lớn nhất trong số các ước chung của $\alpha$ và $\beta$.
>
> GCD được xác định sai khác phép nhân với một unit. Ta viết $\delta = \gcd(\alpha, \beta)$.

### Thuật toán Euclid

Do $\mathbb{Z}[i]$ là Euclidean, thuật toán Euclid hoạt động giống hệt trong $\mathbb{Z}$: lặp phép chia, mỗi bước thay $(\alpha, \beta)$ bởi $(\beta, \rho)$ với $\rho$ là phần dư, cho đến khi phần dư bằng $0$. GCD là phần dư khác $0$ cuối cùng (sai khác unit).

> [!example] Example 31.15 — Euclid trong $\mathbb{Z}[i]$
> Tính $\gcd(32+9i, 4+11i)$:
>
> **Bước 1:** $(32+9i)/(4+11i)$:
> $$
> \frac{32+9i}{4+11i} = \frac{(32+9i)(4-11i)}{16+121} = \frac{227-316i}{137} \approx 1.66 - 2.31i
> $$
> Chọn $\gamma_1 = 2 - 2i$. $\rho_1 = (32+9i) - (4+11i)(2-2i) = (32+9i) - (30+14i) = 2-5i$.
> $N(\rho_1) = 29 < N(4+11i) = 137$.
>
> **Bước 2:** $(4+11i)/(2-5i)$:
> $$
> \frac{4+11i}{2-5i} = \frac{(4+11i)(2+5i)}{4+25} = \frac{-47+42i}{29} \approx -1.62 + 1.45i
> $$
> Chọn $\gamma_2 = -2 + i$. $\rho_2 = (4+11i) - (2-5i)(-2+i) = (4+11i) - (1+12i) = 3-i$.
> $N(\rho_2) = 10 < N(2-5i) = 29$.
>
> **Bước 3:** $(2-5i)/(3-i)$:
> $$
> \frac{2-5i}{3-i} = \frac{(2-5i)(3+i)}{9+1} = \frac{11-13i}{10} = 1.1 - 1.3i
> $$
> Chọn $\gamma_3 = 1 - i$. $\rho_3 = (2-5i) - (3-i)(1-i) = (2-5i) - (2-4i) = -i$.
> $N(\rho_3) = 1$.
>
> **Bước 4:** $(3-i)/(-i) = (3-i)i = 1+3i$ (phép chia hết, $\rho_4 = 0$).
>
> GCD là phần dư khác $0$ cuối cùng: $\gcd(32+9i, 4+11i) = -i$, hoặc sau khi nhân unit: $1$.

> [!example] Example 31.16 — GCD đơn giản hơn
> $\gcd(3+i, 2+i)$:
>
> $(3+i)/(2+i) = (3+i)(2-i)/5 = (7-i)/5 = 1.4 - 0.2i$.
> Chọn $\gamma = 1$, $\rho = (3+i) - (2+i) = 1$. $N(\rho)=1$.
>
> Tiếp: $(2+i)/1 = 2+i$, dư $0$. Vậy $\gcd(3+i, 2+i) = 1$ (chúng nguyên tố cùng nhau).
>
> Kiểm tra: $N(3+i)=10$, $N(2+i)=5$, norm của GCD là $1$ — hợp lý.

---

## SageMath Cheatsheet

```python
# Khai báo vành Gaussian integers
ZI = GaussianIntegers()
a = ZI(3 + 5*i)
b = ZI(1 + i)

# Norm
print(a.norm())        # 34

# Phép chia
q, r = a.quo_rem(b)
print(q, r)            # 4 + i, 0

# GCD
print(gcd(a, b))       # i + 1 (sai khác unit)

# Factorization (sẽ dùng nhiều ở bài 32-33)
print(factor(ZI(5)))   # (-i) * (i + 2) * (2*i + 1)

# Units
print(ZI.units())      # [1, -1, i, -i]

# Kiểm tra có phải unit không
print(a.is_unit())     # False
print(ZI(i).is_unit()) # True

# Tính GCD bằng thuật toán Euclid tự viết
def gaussian_gcd(alpha, beta):
    while beta != 0:
        alpha, beta = beta, alpha % beta
    return alpha

print(gaussian_gcd(ZI(32+9*i), ZI(4+11*i)))  # -1 hoặc associate của 1
```

---

## Summary / Key Takeaways

- $\mathbb{Z}[i] = \{a+bi : a,b \in \mathbb{Z}\}$ là vành số nguyên Gauss — tập các điểm nguyên trên mặt phẳng phức.
- **Norm** $N(a+bi) = a^2+b^2$ là công cụ đo kích thước, có tính nhân tính: $N(\alpha\beta) = N(\alpha)N(\beta)$.
- **Units** của $\mathbb{Z}[i]$: $\{\pm 1, \pm i\}$ — nhóm cyclic cấp $4$. $N(\alpha)=1 \iff \alpha$ là unit.
- **Division Algorithm**: $\forall \alpha, \beta \neq 0$, $\exists \gamma, \rho$ với $\alpha = \beta\gamma + \rho$, $N(\rho) < N(\beta)$. Chọn $\gamma$ bằng cách làm tròn thương phức đến điểm nguyên gần nhất.
- $\mathbb{Z}[i]$ là **Euclidean Domain** $\Rightarrow$ PID $\Rightarrow$ UFD — có đầy đủ tính chất số học của $\mathbb{Z}$.
- **Thuật toán Euclid** trong $\mathbb{Z}[i]$ hoạt động tương tự $\mathbb{Z}$, dùng norm để đảm bảo giảm kích thước mỗi bước.
- **GCD** trong $\mathbb{Z}[i]$ xác định sai khác phép nhân unit.
- Norm kết nối số học của $\mathbb{Z}[i]$ với $\mathbb{Z}$: $N(\alpha) = a^2+b^2$ chính là **tổng hai bình phương** — chìa khóa cho các bài sau.

---

## References

- Conrad, K. *The Gaussian Integers*. https://kconrad.math.uconn.edu/blurbs/ugradnumthy/Zinotes.pdf
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §8.1.
- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.7.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §15.1.
- Stillwell, J. *Elements of Number Theory*, Ch. 6.
