---
title: "01. Rings, Ideals, and Homomorphisms"
tags: [math, commutative-algebra, lesson-01]
aliases: [Rings, Ideals, and Homomorphisms]
created: 2026-03-28
---

> **Prerequisites**: Abstract Algebra cơ bản (vành, trường), Linear Algebra
> **Objectives**:
> - Nắm vững định nghĩa vành giao hoán và nhận diện các ví dụ cổ điển
> - Hiểu các loại ideal: prime ideal, maximal ideal, và mối liên hệ giữa chúng
> - Tính toán được nilradical và Jacobson radical
> - Áp dụng Chinese Remainder Theorem cho các bài toán cụ thể

---

## Motivation / Intuition

Đại số giao hoán (commutative algebra) là ngôn ngữ nền tảng của hình học đại số hiện đại. Khi Grothendieck xây dựng lại hình học đại số từ những năm 1960, ông đã nhận ra rằng mọi đối tượng hình học — đường cong, mặt, đa tạp — đều có thể được hiểu thông qua **vành các hàm trên nó**. Ví dụ, một tập đại số $V \subseteq \mathbb{A}^n$ tương ứng với vành $k[x_1,\ldots,x_n]/I(V)$; các điểm của $V$ tương ứng với maximal ideals của vành này.

Nhưng tại sao lại cần *ideal* thay vì chỉ dùng subring? Câu trả lời đến từ lý thuyết số: trong $\mathbb{Z}$, phép chia có thể không chính xác — $6 = 2 \times 3$ nhưng $\mathbb{Z}$ không phải trường. Khái niệm ideal cho phép chúng ta "chia" theo nghĩa tổng quát hơn, và vành thương $R/\mathfrak{a}$ đóng vai trò tương tự như không gian thương trong topo.

Lesson này đặt nền móng cho toàn bộ khóa học: mọi cấu trúc sau — localization, primary decomposition, dimension theory — đều được xây dựng trên các khái niệm cơ bản ở đây.

---

## Vành giao hoán (Commutative Ring)

### Definition

> [!info] Definition 1.1 — Vành giao hoán (Commutative Ring)
> Một **vành giao hoán** là bộ $(R, +, \cdot)$ gồm một tập hợp $R$ cùng hai phép toán thỏa:
>
> 1. $(R, +)$ là nhóm Abel (với phần tử đơn vị $0$).
> 2. Phép nhân $\cdot$ có tính kết hợp: $(ab)c = a(bc)$.
> 3. Phép nhân có tính giao hoán: $ab = ba$.
> 4. Tồn tại phần tử đơn vị nhân: $\exists\, 1 \in R$ sao cho $1 \cdot a = a$ với mọi $a$.
> 5. Phân phối: $a(b + c) = ab + ac$.
>
> Một phần tử $a \in R$ gọi là **đơn vị** (unit) nếu tồn tại $a^{-1} \in R$ sao cho $aa^{-1} = 1$. Tập hợp các đơn vị ký hiệu là $R^\times$.

> [!note] Remark 1.2
> Trong tài liệu này, **mọi vành đều giao hoán và có đơn vị**. Khi nói "vành" ta ngầm hiểu đây là vành giao hoán có $1$.
>
> Quy ước: ta không yêu cầu $1 \neq 0$. Vành có $1 = 0$ gọi là **vành không** (zero ring), ký hiệu $0$, với phần tử duy nhất là $0$.

### Worked Example

> [!example] Example 1.3 — Các ví dụ cơ bản
>
> | Vành | $R^\times$ | Ghi chú |
> |------|-----------|---------|
> | $\mathbb{Z}$ | $\{1, -1\}$ | Nguyên mẫu của mọi vành |
> | $\mathbb{Q}, \mathbb{R}, \mathbb{C}$ | $R \setminus \{0\}$ | Trường (field) |
> | $\mathbb{Z}/n\mathbb{Z}$ | $\{[a] : \gcd(a,n)=1\}$ | Vành số nguyên modulo $n$ |
> | $k[x_1,\ldots,x_n]$ | $k^\times$ | Vành đa thức, $k$ là trường |
> | $\mathbb{Z}[i]$ | $\{1,-1,i,-i\}$ | Gaussian integers |
> | $\prod_{i=1}^n R_i$ | $\prod R_i^\times$ | Tích trực tiếp các vành |

### Definition

> [!info] Definition 1.4 — Miền nguyên (Integral Domain) và Trường (Field)
>
> - $R$ là **miền nguyên** (integral domain) nếu $R \neq 0$ và $ab = 0 \Rightarrow a = 0$ hoặc $b = 0$ (không có ước của không).
> - $R$ là **trường** (field) nếu $R \neq 0$ và $R^\times = R \setminus \{0\}$.
> - Mọi trường là miền nguyên. Chiều ngược lại không đúng: $\mathbb{Z}$ là miền nguyên nhưng không phải trường.

---

## Ideal và Vành thương (Ideal and Quotient Ring)

### Definition

> [!info] Definition 1.5 — Ideal
>
> Một tập con $\mathfrak{a} \subseteq R$ gọi là **ideal** của $R$ nếu:
>
> 1. $(\mathfrak{a}, +)$ là nhóm con của $(R, +)$.
> 2. $\forall\, r \in R,\, a \in \mathfrak{a}$: $r \cdot a \in \mathfrak{a}$ (đóng với phép nhân từ $R$).
>
> **Ideal sinh bởi** tập $S \subseteq R$:
>
> $$
> (S) = \left\{ \sum_{i=1}^n r_i s_i \;:\; r_i \in R,\, s_i \in S,\, n \geq 0 \right\}
> $$
>
> Ideal sinh bởi một phần tử duy nhất $(a) = \{ra : r \in R\}$ gọi là **ideal chính** (principal ideal).

> [!note] Remark 1.6 — Ký hiệu ideal
> Ta dùng chữ Fraktur để ký hiệu ideal: $\mathfrak{a}, \mathfrak{b}$ (ideal tổng quát), $\mathfrak{p}$ (prime ideal), $\mathfrak{q}$ (primary ideal), $\mathfrak{m}$ (maximal ideal). Đây là quy ước phổ biến trong Commutative Algebra.

### Theorem

> [!abstract] Theorem 1.7 — Cấu trúc vành thương (Quotient Ring)
>
> Cho $\mathfrak{a}$ là ideal của $R$. Tập các lớp tương đương $R/\mathfrak{a} = \{r + \mathfrak{a} : r \in R\}$ tạo thành một vành giao hoán với:
>
> $$
> (r + \mathfrak{a}) + (s + \mathfrak{a}) = (r + s) + \mathfrak{a}, \qquad (r + \mathfrak{a})(s + \mathfrak{a}) = rs + \mathfrak{a}
> $$
>
> Ánh xạ chính tắc $\pi: R \to R/\mathfrak{a}$, $r \mapsto r + \mathfrak{a}$, là một ring homomorphism surjective với $\ker \pi = \mathfrak{a}$.

**Proof.**
Các phép toán được định nghĩa tốt (well-defined) vì $\mathfrak{a}$ là ideal: nếu $r + \mathfrak{a} = r' + \mathfrak{a}$ và $s + \mathfrak{a} = s' + \mathfrak{a}$, thì $r - r', s - s' \in \mathfrak{a}$, và

$$
rs - r's' = r(s - s') + (r - r')s' \in \mathfrak{a}
$$

vì $r(s-s') \in \mathfrak{a}$ (do $s - s' \in \mathfrak{a}$) và $(r-r')s' \in \mathfrak{a}$ (do $r - r' \in \mathfrak{a}$). Kiểm tra các tiên đề vành là thường lệ. $\blacksquare$

### Worked Example

> [!example] Example 1.8 — Vành thương cổ điển
>
> **Ví dụ 1:** $\mathbb{Z}/n\mathbb{Z}$. Ideal $(n) = n\mathbb{Z}$ trong $\mathbb{Z}$ cho vành thương $\mathbb{Z}/n\mathbb{Z}$.
>
> **Ví dụ 2:** $\mathbb{R}[x]/(x^2 + 1) \cong \mathbb{C}$. Đa thức $x^2 + 1$ bất khả quy trên $\mathbb{R}$, nên $(x^2+1)$ là maximal ideal, và vành thương là trường — chính là $\mathbb{C}$ với $x \mapsto i$.
>
> **Ví dụ 3:** $k[x]/(x^2) = k[\varepsilon]/(\varepsilon^2)$ gọi là *vành số đối ngẫu* (dual numbers). Đây là vành giao hoán nhưng không là miền nguyên vì $\varepsilon \cdot \varepsilon = 0$ với $\varepsilon \neq 0$.

---

## Ring Homomorphism

### Definition

> [!info] Definition 1.9 — Ring Homomorphism
>
> Một **ring homomorphism** (đồng cấu vành) là ánh xạ $f: R \to S$ thỏa:
>
> $$
> f(a + b) = f(a) + f(b), \quad f(ab) = f(a)f(b), \quad f(1_R) = 1_S
> $$
>
> - **Kernel**: $\ker f = \{r \in R : f(r) = 0\}$ — là ideal của $R$.
> - **Image**: $\operatorname{Im} f = \{f(r) : r \in R\}$ — là subring của $S$.
> - $f$ là **isomorphism** nếu là bijection.

### Theorem

> [!abstract] Theorem 1.10 — Định lý đẳng cấu thứ nhất (First Isomorphism Theorem)
>
> Cho $f: R \to S$ là ring homomorphism. Khi đó tồn tại isomorphism:
>
> $$
> R / \ker f \xrightarrow{\;\sim\;} \operatorname{Im} f, \quad r + \ker f \mapsto f(r)
> $$

**Proof.** Ánh xạ $\bar{f}(r + \ker f) = f(r)$ được định nghĩa tốt, là ring homomorphism (kiểm tra thường lệ), injective (vì $\bar{f}(r + \ker f) = 0 \Rightarrow f(r) = 0 \Rightarrow r \in \ker f$), và surjective lên $\operatorname{Im} f$ theo định nghĩa. $\blacksquare$

---

## Prime Ideal và Maximal Ideal

### Definition

> [!info] Definition 1.11 — Prime Ideal và Maximal Ideal
>
> Cho $\mathfrak{a} \subsetneq R$ là ideal thực sự (proper ideal).
>
> - $\mathfrak{p}$ là **prime ideal** nếu $ab \in \mathfrak{p} \Rightarrow a \in \mathfrak{p}$ hoặc $b \in \mathfrak{p}$.
> - $\mathfrak{m}$ là **maximal ideal** nếu không có ideal thực sự nào chứa $\mathfrak{m}$ (ngoài $\mathfrak{m}$ và $R$).
>
> Ký hiệu: $\operatorname{Spec}(R)$ = tập các prime ideals; $\operatorname{Max}(R)$ = tập các maximal ideals.

### Theorem

> [!abstract] Theorem 1.12 — Đặc trưng qua vành thương
>
> Cho $\mathfrak{p}$ là ideal thực sự của $R$. Khi đó:
>
> $$
> \mathfrak{p} \text{ là prime ideal} \iff R/\mathfrak{p} \text{ là miền nguyên}
> $$
>
> $$
> \mathfrak{m} \text{ là maximal ideal} \iff R/\mathfrak{m} \text{ là trường}
> $$

**Proof.**
($\mathfrak{p}$ prime): $R/\mathfrak{p}$ là miền nguyên $\iff$ $(a + \mathfrak{p})(b + \mathfrak{p}) = 0 \Rightarrow a + \mathfrak{p} = 0$ hoặc $b + \mathfrak{p} = 0$ $\iff$ $ab \in \mathfrak{p} \Rightarrow a \in \mathfrak{p}$ hoặc $b \in \mathfrak{p}$.

($\mathfrak{m}$ maximal): $R/\mathfrak{m}$ là trường $\iff$ mọi phần tử $\neq 0$ trong $R/\mathfrak{m}$ là đơn vị $\iff$ không có ideal thực sự nào của $R$ nằm giữa $\mathfrak{m}$ và $R$ (vì các ideal của $R/\mathfrak{m}$ tương ứng 1-1 với các ideal của $R$ chứa $\mathfrak{m}$). $\blacksquare$

> [!abstract] Corollary 1.13
>
> Mọi maximal ideal là prime ideal.

**Proof.** Mọi trường là miền nguyên, nên $R/\mathfrak{m}$ miền nguyên $\Rightarrow$ $\mathfrak{m}$ prime. $\blacksquare$

> [!warning] Counterexample 1.14 — Prime không nhất thiết là maximal
>
> Trong $\mathbb{Z}[x]$, ideal $\mathfrak{p} = (x)$ là prime vì $\mathbb{Z}[x]/(x) \cong \mathbb{Z}$ là miền nguyên. Nhưng $(x)$ không phải maximal vì $(x) \subsetneq (x, 2) \subsetneq \mathbb{Z}[x]$.
>
> Tuy nhiên, trong $\mathbb{Z}$, mọi prime ideal $\neq (0)$ đều là maximal: $(p)$ prime $\Rightarrow$ $\mathbb{Z}/(p) \cong \mathbb{F}_p$ là trường.

### Theorem

> [!abstract] Theorem 1.15 — Sự tồn tại của maximal ideal (Krull)
>
> Mọi vành $R \neq 0$ đều có ít nhất một maximal ideal.

**Proof.** (Dùng Bổ đề Zorn.) Xét họ $\mathcal{F}$ gồm tất cả proper ideals của $R$, sắp xếp theo bao hàm. $\mathcal{F} \neq \emptyset$ vì $(0) \in \mathcal{F}$. Với mọi dây (chain) trong $\mathcal{F}$, hội của chúng vẫn là proper ideal (vì $1 \notin$ hội). Theo Bổ đề Zorn, $\mathcal{F}$ có phần tử cực đại — đó chính là maximal ideal. $\blacksquare$

> [!note] Remark 1.16 — Vành địa phương (Local Ring)
>
> $R$ được gọi là **local ring** (vành địa phương) nếu có đúng một maximal ideal $\mathfrak{m}$. Ký hiệu: $(R, \mathfrak{m})$ hoặc $(R, \mathfrak{m}, k)$ với $k = R/\mathfrak{m}$ là **residue field**.
>
> Ví dụ: $k[[x]]$ (formal power series), $\mathbb{Z}_{(p)} = \{a/b \in \mathbb{Q} : p \nmid b\}$.

---

## Phép toán trên Ideal

### Definition

> [!info] Definition 1.17 — Các phép toán trên ideal
>
> Cho $\mathfrak{a}, \mathfrak{b}$ là các ideal của $R$:
>
> - **Tổng**: $\mathfrak{a} + \mathfrak{b} = \{a + b : a \in \mathfrak{a}, b \in \mathfrak{b}\}$ — ideal nhỏ nhất chứa cả $\mathfrak{a}$ và $\mathfrak{b}$.
> - **Giao**: $\mathfrak{a} \cap \mathfrak{b}$ — là ideal.
> - **Tích**: $\mathfrak{a}\mathfrak{b} = \left\{\sum_{i} a_i b_i : a_i \in \mathfrak{a}, b_i \in \mathfrak{b}\right\}$ — thỏa $\mathfrak{a}\mathfrak{b} \subseteq \mathfrak{a} \cap \mathfrak{b}$.
> - **Radical**: $\sqrt{\mathfrak{a}} = \{r \in R : r^n \in \mathfrak{a} \text{ với một số } n \geq 1\}$.

### Theorem

> [!abstract] Theorem 1.18 — Radical là intersection của prime ideals
>
> Với mọi ideal $\mathfrak{a}$ của $R$:
>
> $$
> \sqrt{\mathfrak{a}} = \bigcap_{\mathfrak{p} \supseteq \mathfrak{a},\, \mathfrak{p} \text{ prime}} \mathfrak{p}
> $$

**Proof.** ($\subseteq$) Nếu $r^n \in \mathfrak{a} \subseteq \mathfrak{p}$ và $\mathfrak{p}$ prime, thì $r \in \mathfrak{p}$ (vì $\mathfrak{p}$ prime $\Rightarrow r^n \in \mathfrak{p} \Rightarrow r \in \mathfrak{p}$).

($\supseteq$) Giả sử $r \notin \sqrt{\mathfrak{a}}$, tức $r^n \notin \mathfrak{a}$ với mọi $n$. Xét họ $\mathcal{F}$ gồm các ideal $\mathfrak{b}$ chứa $\mathfrak{a}$ và không chứa $r^n$ với mọi $n$. Áp dụng Zorn, tồn tại phần tử cực đại $\mathfrak{p}$ trong $\mathcal{F}$. Ta chứng minh $\mathfrak{p}$ là prime: nếu $xy \in \mathfrak{p}$ nhưng $x, y \notin \mathfrak{p}$, thì $\mathfrak{p} + (x)$ và $\mathfrak{p} + (y)$ chứa lũy thừa của $r$, dẫn đến mâu thuẫn. Do đó $\mathfrak{p}$ prime và $r \notin \mathfrak{p}$, tức $r \notin \bigcap \mathfrak{p}$. $\blacksquare$

---

## Nilradical và Jacobson Radical

### Definition

> [!info] Definition 1.19 — Nilradical và Jacobson Radical
>
> - **Nilradical** của $R$: $\operatorname{Nil}(R) = \sqrt{(0)} = \{r \in R : r^n = 0 \text{ với một số } n\}$ — tập các phần tử lũy linh (nilpotent).
> - **Jacobson radical**: $\operatorname{Jac}(R) = \bigcap_{\mathfrak{m} \in \operatorname{Max}(R)} \mathfrak{m}$ — giao của mọi maximal ideal.
>
> Luôn có $\operatorname{Nil}(R) \subseteq \operatorname{Jac}(R)$ (vì prime $\supseteq$ nilradical và maximal $\Rightarrow$ prime).

### Theorem

> [!abstract] Theorem 1.20 — Đặc trưng của Jacobson radical
>
> $$
> x \in \operatorname{Jac}(R) \iff \forall\, r \in R:\; 1 - rx \in R^\times
> $$

**Proof.** ($\Rightarrow$) Nếu $1 - rx \notin R^\times$, thì $(1-rx)$ nằm trong một maximal ideal $\mathfrak{m}$. Nhưng $x \in \operatorname{Jac}(R) \subseteq \mathfrak{m}$, nên $rx \in \mathfrak{m}$, suy ra $1 = (1-rx) + rx \in \mathfrak{m}$ — mâu thuẫn.

($\Leftarrow$) Nếu $x \notin \mathfrak{m}$ với một $\mathfrak{m}$ maximal nào đó, thì $\mathfrak{m} + (x) = R$, tức $m + rx = 1$ với $m \in \mathfrak{m}, r \in R$. Khi đó $1 - rx = m \in \mathfrak{m}$ không phải đơn vị — mâu thuẫn. $\blacksquare$

### Worked Example

> [!example] Example 1.21
>
> **Nilradical của $\mathbb{Z}/12\mathbb{Z}$:** Các phần tử nilpotent là $[0]$ và $[6]$ (vì $6^2 = 36 \equiv 0$). Ta có $\operatorname{Nil}(\mathbb{Z}/12\mathbb{Z}) = \{[0], [6]\} = (6)$.
>
> **Jacobson radical của $\mathbb{Z}/12\mathbb{Z}$:** Maximal ideals của $\mathbb{Z}/12\mathbb{Z}$ là $(2)$ và $(3)$ (tương ứng $12 = 4 \times 3$). Do đó $\operatorname{Jac} = (2) \cap (3) = (6)$.
>
> Vậy ở đây $\operatorname{Nil} = \operatorname{Jac}$. Tuy nhiên điều này không phải lúc nào cũng đúng.

---

## Chinese Remainder Theorem

### Theorem

> [!abstract] Theorem 1.22 — Chinese Remainder Theorem (CRT)
>
> Cho $\mathfrak{a}_1, \ldots, \mathfrak{a}_n$ là các ideal của $R$ thỏa điều kiện **coprime** từng đôi: $\mathfrak{a}_i + \mathfrak{a}_j = R$ với mọi $i \neq j$. Khi đó ánh xạ:
>
> $$
> R \;\longrightarrow\; \prod_{i=1}^n R/\mathfrak{a}_i, \quad r \mapsto (r + \mathfrak{a}_1, \ldots, r + \mathfrak{a}_n)
> $$
>
> là ring homomorphism surjective với kernel $\mathfrak{a}_1 \cap \cdots \cap \mathfrak{a}_n = \mathfrak{a}_1 \cdots \mathfrak{a}_n$. Từ đó:
>
> $$
> R/(\mathfrak{a}_1 \cdots \mathfrak{a}_n) \;\cong\; \prod_{i=1}^n R/\mathfrak{a}_i
> $$

**Proof (phác thảo).** Trước tiên chứng minh: $\mathfrak{a}_i + \mathfrak{a}_j = R$ với mọi $i \neq j$ $\Rightarrow$ $\mathfrak{a}_1 + (\mathfrak{a}_2 \cdots \mathfrak{a}_n) = R$ (bằng quy nạp). Tính surjective: với bộ $(r_1, \ldots, r_n)$ bất kỳ, tìm $e_i \in R$ sao cho $e_i \equiv 1 \pmod{\mathfrak{a}_i}$ và $e_i \equiv 0 \pmod{\mathfrak{a}_j}$ với $j \neq i$ (tồn tại nhờ coprime condition), sau đó $r = \sum r_i e_i$. Kernel bằng $\bigcap \mathfrak{a}_i = \prod \mathfrak{a}_i$ (dùng coprimeness). $\blacksquare$

### Worked Example

> [!example] Example 1.23 — CRT cho $\mathbb{Z}$
>
> Tìm $x \in \mathbb{Z}$ thỏa $x \equiv 2 \pmod{3}$, $x \equiv 3 \pmod{5}$, $x \equiv 2 \pmod{7}$.
>
> Các ideal $(3), (5), (7)$ trong $\mathbb{Z}$ đôi một coprime. Theo CRT:
>
> $$
> \mathbb{Z}/105\mathbb{Z} \cong \mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/5\mathbb{Z} \times \mathbb{Z}/7\mathbb{Z}
> $$
>
> Tính: $e_1 = 35 \cdot (35^{-1} \bmod 3) = 35 \cdot 2 = 70$; $e_2 = 21 \cdot (21^{-1} \bmod 5) = 21 \cdot 1 = 21$; $e_3 = 15 \cdot (15^{-1} \bmod 7) = 15 \cdot 1 = 15$.
>
> $$
> x = 2 \cdot 70 + 3 \cdot 21 + 2 \cdot 15 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}
> $$

---

## SageMath Cheatsheet

```sage
# Tạo vành thương
R = ZZ.quotient(12)           # Z/12Z
R = QQ['x'].quotient('x^2+1') # R[x]/(x^2+1) ~ CC

# Ideal trong vành đa thức
R.<x,y> = QQ[]
I = R.ideal(x^2 + y, y^2 - 1)
I.is_prime()        # kiểm tra prime
I.radical()         # tính radical

# Nilradical (dùng radical của ideal (0))
I = R.ideal(0)
I.radical()

# Prime ideals và maximal ideals
R = ZZ.quotient(12)
R.spec()            # Spec(Z/12Z) — không dùng trực tiếp, nhưng:
# Với vành đa thức:
R.<x> = QQ[]
I = R.ideal(x^2 - 1)
I.primary_decomposition()  # phân tích thành primary ideals

# Chinese Remainder Theorem
from sage.rings.integer import crt
crt([2, 3, 2], [3, 5, 7])   # trả về 23
```

---

## Summary / Key Takeaways

- Vành giao hoán $R$ là cấu trúc nền tảng; ta luôn giả sử $R$ có $1$.
- Ideal $\mathfrak{a} \subseteq R$ là "kernel" tổng quát; vành thương $R/\mathfrak{a}$ là "chia" bởi $\mathfrak{a}$.
- Prime ideal $\mathfrak{p}$: $R/\mathfrak{p}$ là miền nguyên. Maximal ideal $\mathfrak{m}$: $R/\mathfrak{m}$ là trường.
- Mọi maximal ideal là prime, nhưng không phải ngược lại.
- Nilradical $\operatorname{Nil}(R) = \bigcap_{\mathfrak{p} \in \operatorname{Spec}(R)} \mathfrak{p}$ = giao mọi prime ideal.
- Jacobson radical $\operatorname{Jac}(R) = \bigcap_{\mathfrak{m} \in \operatorname{Max}(R)} \mathfrak{m}$; $x \in \operatorname{Jac}(R) \iff 1 - rx$ là đơn vị với mọi $r$.
- CRT: $\mathfrak{a}_i$ coprime từng đôi $\Rightarrow R/(\prod \mathfrak{a}_i) \cong \prod R/\mathfrak{a}_i$.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapters 1–2.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapters 1–2.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 1–3.
- https://doc.sagemath.org/html/en/reference/rings/
