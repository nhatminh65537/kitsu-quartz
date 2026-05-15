---
title: "24. Finite Fields — Existence and Uniqueness"
type: math-component
tags: [math, groups-rings-fields, field-theory, finite-fields, lesson-24]
aliases: [Finite Fields, Existence and Uniqueness of Finite Fields, Galois Fields]
created: 2026-05-15
---

> **Prerequisites**: [[23-splitting-fields|23. Splitting Fields]], [[22-algebraic-elements-and-minimal-polynomials|22. Algebraic Elements and Minimal Polynomials]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử, $\mathbb{Z}/p\mathbb{Z}$ với $p$ nguyên tố |
> | $\mathbb{F}_{p^n}$, $\operatorname{GF}(p^n)$ | Trường hữu hạn $p^n$ phần tử |
> | $\operatorname{char}(F)$ | Đặc số của trường $F$ |
> | $\overline{\mathbb{F}_p}$ | Bao đóng đại số của $\mathbb{F}_p$ |
> | $F[x]$ | Vành đa thức một biến trên trường $F$ |
> | $[K:F]$ | Bậc của mở rộng trường $K/F$ |
> | $\gcd(f, f')$ | Ước chung lớn nhất của đa thức $f$ và đạo hàm $f'$ |

> **Objectives**:
> - Chứng minh mọi trường hữu hạn có cấp $p^n$ với $p$ nguyên tố
> - Xây dựng $\mathbb{F}_{p^n}$ như trường phân rã của $x^{p^n} - x$
> - Chứng minh sự tồn tại và tính duy nhất (tính đến đẳng cấu) của trường hữu hạn cấp $p^n$
> - Hiểu quan hệ giữa đặc số và cấu trúc của trường hữu hạn

---

## Motivation

Trường hữu hạn (finite field) hay **trường Galois** (Galois field) là nền tảng của mã hóa hiện đại: mã Reed-Solomon, AES (Advanced Encryption Standard), đường cong elliptic trên trường hữu hạn, mã BCH — tất cả đều được xây dựng trên trường hữu hạn.

Câu hỏi tự nhiên: trường hữu hạn nào tồn tại? Ta biết $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$ với $p$ nguyên tố là trường hữu hạn $p$ phần tử. Liệu có trường $6$ phần tử không? Trường $12$ phần tử? Câu trả lời ngắn gọn và đẹp đẽ: **chỉ các cấp $p^n$ mới có thể xảy ra**, và với mỗi cấp như vậy có **đúng một** trường (tính đến đẳng cấu).

Chứng minh phụ thuộc vào hai quan sát quan trọng: (1) nhóm nhân $\mathbb{F}^*$ của trường hữu hạn là nhóm cyclic (sẽ chứng minh trong [[26-primitive-elements|26. Primitive Elements]]), và (2) mọi phần tử của $\mathbb{F}_{p^n}$ đều là nghiệm của $x^{p^n} - x$.

---

## 1. Cấp của trường hữu hạn

> [!abstract] Theorem 24.1 — Cấp của trường hữu hạn là lũy thừa nguyên tố
> Nếu $F$ là trường hữu hạn, thì $|F| = p^n$ với $p = \operatorname{char}(F)$ nguyên tố và $n = [F : \mathbb{F}_p] \geq 1$.

**Proof.** Gọi $p = \operatorname{char}(F)$, đây là số nguyên tố (Theorem 21.5). Trường nguyên tố của $F$ là $\mathbb{F}_p$ (Theorem 21.6). Nhìn $F$ như $\mathbb{F}_p$-không gian vector, vì $F$ hữu hạn nên không gian này hữu hạn chiều; gọi $n = [F : \mathbb{F}_p]$. Chọn cơ sở $\{e_1, \ldots, e_n\}$ của $F$ trên $\mathbb{F}_p$, thì mọi phần tử của $F$ viết duy nhất dạng $\sum_{i=1}^n a_i e_i$ với $a_i \in \mathbb{F}_p$. Có $p$ lựa chọn cho mỗi $a_i$, vậy $|F| = p^n$. $\blacksquare$

> [!warning] Counterexample 24.2 — Không có trường 6 phần tử
> Không tồn tại trường với $6 = 2 \cdot 3$ phần tử: $6$ không phải lũy thừa của số nguyên tố. Tổng quát hơn, không tồn tại trường với $mn$ phần tử khi $\gcd(m, n) = 1$ và cả $m, n > 1$.

---

## 2. Bất đẳng thức Frobenius (Freshman's Dream)

> [!abstract] Theorem 24.3 — Freshman's Dream (Bất đẳng thức Frobenius)
> Trong một vành giao hoán $R$ với đặc số $\operatorname{char}(R) = p$ (nguyên tố), với mọi $a, b \in R$ và $n \geq 1$:
>
> $$
> (a + b)^{p^n} = a^{p^n} + b^{p^n}
> $$

**Proof.** Đủ chứng minh cho $n=1$. Khai triển nhị thức:

$$
(a + b)^p = \sum_{k=0}^{p} \binom{p}{k} a^k b^{p-k}
$$

Với $0 < k < p$: $\binom{p}{k} = \frac{p!}{k!(p-k)!}$. Vì $p$ nguyên tố và $0 < k < p$, $p$ không bị triệt tiêu trong tử số nhưng không xuất hiện trong mẫu, nên $p \mid \binom{p}{k}$. Vậy trong $\operatorname{char}(R) = p$, các số hạng trung gian biến mất: $(a+b)^p = a^p + b^p$. Áp dụng quy nạp cho $n$ lần cho kết quả tổng quát. $\blacksquare$

> [!abstract] Corollary 24.4 — Frobenius là đồng cấu
> Ánh xạ Frobenius $\phi: F \to F$, $\phi(a) = a^p$, với $F$ trường đặc số $p$, là đồng cấu vành (ring homomorphism). Đặc biệt, nếu $F$ hữu hạn thì $\phi$ là **tự đẳng cấu** (automorphism).

**Proof.** $\phi(a + b) = (a+b)^p = a^p + b^p = \phi(a) + \phi(b)$ (Freshman's Dream). $\phi(ab) = (ab)^p = a^p b^p = \phi(a)\phi(b)$. Vậy $\phi$ là đồng cấu vành. Tính đơn cấu: $\ker \phi = \{a \mid a^p = 0\} = \{0\}$ (trường không có ước của không). Nếu $F$ hữu hạn thì đơn cấu giữa các tập hữu hạn bằng nhau là toàn ánh. $\blacksquare$

---

## 3. Sự tồn tại của $\mathbb{F}_{p^n}$

> [!abstract] Theorem 24.5 — Sự tồn tại của trường $p^n$ phần tử
> Với mọi số nguyên tố $p$ và số nguyên $n \geq 1$, tồn tại trường với đúng $p^n$ phần tử.

**Proof.** Xét đa thức $f(x) = x^{p^n} - x \in \mathbb{F}_p[x]$. Gọi $K$ là trường phân rã của $f$ trên $\mathbb{F}_p$ (tồn tại theo Kronecker — Theorem 23.4). Định nghĩa:

$$
\mathbb{F}_{p^n} := \{\alpha \in K \mid \alpha^{p^n} = \alpha\} = \{\text{tập nghiệm của } x^{p^n} - x \text{ trong } K\}
$$

**Bước 1:** $\mathbb{F}_{p^n}$ là trường con của $K$. Ta cần kiểm tra đóng với $+, \cdot$ và nghịch đảo:
- $0^{p^n} = 0$, $1^{p^n} = 1$: $0, 1 \in \mathbb{F}_{p^n}$. ✓
- Nếu $a^{p^n} = a$ và $b^{p^n} = b$: $(a+b)^{p^n} = a^{p^n} + b^{p^n} = a + b$ ✓ (Freshman's Dream).
- $(ab)^{p^n} = a^{p^n} b^{p^n} = ab$ ✓.
- $(-a)^{p^n} = (-1)^{p^n} a^{p^n} = -a$ ✓ (vì $(-1)^p = -1$ khi $p$ nguyên tố, và khi $p=2$ thì $-1 = 1$).
- Nếu $a \neq 0$: $(a^{-1})^{p^n} = (a^{p^n})^{-1} = a^{-1}$ ✓.

**Bước 2:** $|\mathbb{F}_{p^n}| = p^n$. Đạo hàm hình thức $f'(x) = p^n x^{p^n - 1} - 1 = -1$ (vì $p^n \equiv 0 \pmod{p}$). Vì $\gcd(f, f') = \gcd(f, -1) = 1$, đa thức $f$ không có nghiệm bội. Vậy $f$ có đúng $p^n$ nghiệm phân biệt trong $K$, và $|\mathbb{F}_{p^n}| = p^n$.

**Bước 3:** $\mathbb{F}_{p^n}$ chứa $\mathbb{F}_p$: với $a \in \mathbb{F}_p$, $a^p = a$ (định lý Fermat nhỏ), nên $a^{p^n} = a$. ✓

**Bước 4:** $K = \mathbb{F}_{p^n}$: vì $f$ phân rã hoàn toàn trong $\mathbb{F}_{p^n}$ (mọi nghiệm đều trong $\mathbb{F}_{p^n}$) và $K$ là trường phân rã tối tiểu. $\blacksquare$

---

## 4. Tính duy nhất của $\mathbb{F}_{p^n}$

> [!abstract] Theorem 24.6 — Tính duy nhất của trường hữu hạn
> Với mọi $p$ nguyên tố và $n \geq 1$, bất kỳ hai trường có $p^n$ phần tử đều đẳng cấu.
>
> Nói cách khác, trường hữu hạn $\mathbb{F}_{p^n}$ (hay $\operatorname{GF}(p^n)$) là duy nhất tính đến đẳng cấu.

**Proof.** Giả sử $F$ là trường với $|F| = p^n$. Ta chứng minh $F$ là trường phân rã của $x^{p^n} - x$ trên $\mathbb{F}_p$.

$F^* = F \setminus \{0\}$ với $|F^*| = p^n - 1$. Với mọi $\alpha \in F^*$, theo định lý Lagrange: $\alpha^{p^n - 1} = 1$, suy ra $\alpha^{p^n} = \alpha$. Với $\alpha = 0$: $0^{p^n} = 0$. Vậy **mọi** phần tử $\alpha \in F$ thỏa mãn $\alpha^{p^n} = \alpha$.

Do đó $f(x) = x^{p^n} - x$ có $p^n$ nghiệm trong $F$ (tất cả phần tử của $F$). Vì $\deg f = p^n = |F|$, $f$ phân rã hoàn toàn trong $F$:

$$
x^{p^n} - x = \prod_{\alpha \in F} (x - \alpha)
$$

Hơn nữa, $F = \mathbb{F}_p(\{\alpha \in F\})$, nên $F$ là trường phân rã của $f$ trên $\mathbb{F}_p$. Theo tính duy nhất của trường phân rã (Theorem 23.5), $F \cong \mathbb{F}_{p^n}$. $\blacksquare$

> [!note] Remark 24.7 — Ký hiệu
> Ta dùng $\mathbb{F}_{p^n}$, $\operatorname{GF}(p^n)$ (Galois Field), hoặc $\mathbb{F}_q$ với $q = p^n$ để chỉ trường hữu hạn duy nhất (tính đến đẳng cấu) cấp $q = p^n$.

---

## 5. Tính chất cơ bản của $\mathbb{F}_{p^n}$

> [!abstract] Theorem 24.8 — Phân tích của $x^{p^n} - x$
> Trong $\mathbb{F}_p[x]$:
>
> $$
> x^{p^n} - x = \prod_{\substack{f \in \mathbb{F}_p[x] \\ f \text{ lũy đẳng bất khả quy} \\ \deg f \mid n}} f(x)
> $$
>
> Nói cách khác, $x^{p^n} - x$ là tích của tất cả các đa thức lũy đẳng bất khả quy trên $\mathbb{F}_p$ có bậc chia $n$.

**Proof.** Mỗi nghiệm $\alpha$ của $x^{p^n} - x$ trong $\overline{\mathbb{F}_p}$ thỏa mãn $\alpha^{p^n} = \alpha$, nên $\alpha \in \mathbb{F}_{p^n}$. Min poly của $\alpha$ trên $\mathbb{F}_p$ có bậc $[\mathbb{F}_p(\alpha) : \mathbb{F}_p]$, và $\mathbb{F}_p(\alpha) \subseteq \mathbb{F}_{p^n}$, nên bậc này chia $n$ (Tower Law — Theorem 21.10). Ngược lại, nếu $f$ bất khả quy bậc $d \mid n$, thì $\mathbb{F}_{p^d} \subseteq \mathbb{F}_{p^n}$, nên nghiệm của $f$ nằm trong $\mathbb{F}_{p^n}$, tức $f \mid x^{p^n} - x$. $\blacksquare$

> [!example] Example 24.9 — Phân tích $x^8 - x$ trên $\mathbb{F}_2$
> $n = 3$, $p = 2$: cần tích các đa thức bất khả quy bậc $d \mid 3$, tức $d \in \{1, 3\}$.
>
> **Bậc 1 trên $\mathbb{F}_2$:** $x$ và $x+1$ (hai đa thức bậc 1 lũy đẳng).
>
> **Bậc 3 trên $\mathbb{F}_2$:** Tất cả đa thức lũy đẳng bậc 3 là $x^3 + a_2x^2 + a_1x + a_0$ với $a_0 = 1$ (vì lũy đẳng, có hệ số tự do $\neq 0$). Kiểm tra bất khả quy: không có nghiệm $0$ hay $1$.
>
> - $x^3 + x^2 + 1$: $f(0) = 1 \neq 0$, $f(1) = 1 + 1 + 1 = 1 \neq 0$. ✓ Bất khả quy.
> - $x^3 + x + 1$: $f(0) = 1 \neq 0$, $f(1) = 1 + 1 + 1 = 1 \neq 0$. ✓ Bất khả quy.
> - $x^3 + x^2 + x + 1 = (x+1)^3$ trong $\mathbb{F}_2$ — không bất khả quy.
>
> Vậy: $x^8 - x = x(x+1)(x^3+x+1)(x^3+x^2+1)$ trong $\mathbb{F}_2[x]$.
>
> Kiểm tra: $1 + 1 + 3 + 3 = 8$ ✓.

> [!example] Example 24.10 — Xây dựng tường minh $\mathbb{F}_4$
> $p = 2$, $n = 2$: trường $\mathbb{F}_4$ phân rã $x^4 - x = x(x+1)(x^2+x+1)$ trên $\mathbb{F}_2$.
>
> (Kiểm tra: $x^2 + x + 1$ không có nghiệm trong $\{0, 1\}$, nên bất khả quy trên $\mathbb{F}_2$.)
>
> Xây dựng: $\mathbb{F}_4 = \mathbb{F}_2[x]/(x^2 + x + 1)$.
>
> Gọi $\alpha = \bar{x}$, quan hệ: $\alpha^2 = \alpha + 1$ (vì $\alpha^2 + \alpha + 1 = 0$).
>
> Bốn phần tử của $\mathbb{F}_4$: $\{0, 1, \alpha, \alpha + 1\}$.
>
> Bảng nhân (các phần tử $\neq 0$):
>
> | $\cdot$ | $1$ | $\alpha$ | $\alpha+1$ |
> |---------|-----|----------|------------|
> | $1$ | $1$ | $\alpha$ | $\alpha+1$ |
> | $\alpha$ | $\alpha$ | $\alpha^2 = \alpha+1$ | $\alpha(\alpha+1) = \alpha^2+\alpha = 1$ |
> | $\alpha+1$ | $\alpha+1$ | $1$ | $(\alpha+1)^2 = \alpha^2+1 = \alpha$ |
>
> (Dùng $\alpha^2 = \alpha + 1$ và tính chất đặc số 2: $2\alpha = 0$.)
>
> Xác nhận: $\mathbb{F}_4^* = \{1, \alpha, \alpha+1\}$ là nhóm cyclic cấp $3$ (sinh bởi $\alpha$: $\alpha^1 = \alpha$, $\alpha^2 = \alpha+1$, $\alpha^3 = 1$). ✓

---

## SageMath Cheatsheet — Bài 24

```sage
# Trường hữu hạn trong SageMath

# F_4
F4 = GF(4, 'a')
F4.list()                   # [0, a, a + 1, 1]
F4.characteristic()         # 2
a = F4.gen()
a^2                         # a + 1
a^3                         # 1 (vì a là primitive element)

# F_{2^8} (dùng trong AES)
F256 = GF(2^8, 'b')
F256.order()                # 256
F256.degree()               # 8
b = F256.gen()
b.minpoly()                 # đa thức tối tiểu của b trên F_2

# Phân tích x^{p^n} - x thành các đa thức bất khả quy
R.<x> = GF(2)[]
f = x^8 - x
f.factor()                  # x * (x + 1) * (x^3 + x + 1) * (x^3 + x^2 + 1)

# Kiểm tra: mọi phần tử thỏa x^{p^n} = x
K = GF(2^3, 'c')
c = K.gen()
c^(2^3) == c                # True
all(a^8 == a for a in K)    # True
```

---

## Summary — Bài 24

- Mọi trường hữu hạn có cấp $p^n$ với $p$ nguyên tố ($p = \operatorname{char}$, $n$ = bậc trên $\mathbb{F}_p$).
- **Tồn tại**: $\mathbb{F}_{p^n}$ = tập nghiệm của $x^{p^n} - x$ trong trường phân rã.
- **Tính duy nhất**: mọi trường $p^n$ phần tử đều đẳng cấu với $\mathbb{F}_{p^n}$.
- Mọi $\alpha \in \mathbb{F}_{p^n}$ thỏa $\alpha^{p^n} = \alpha$ — "Fermat tổng quát".
- $x^{p^n} - x = \prod_{d \mid n} (\text{tích đa thức bất khả quy bậc } d \text{ trên } \mathbb{F}_p)$.
- **Freshman's Dream**: $(a+b)^{p^n} = a^{p^n} + b^{p^n}$ trong trường đặc số $p$.

---

## References — Bài 24

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §13.5.
- Lang, S. *Algebra* (3rd ed.), Chapter V §5.
- Lidl, R., & Niederreiter, H. *Finite Fields* (2nd ed.), Chapter 2.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 22.
