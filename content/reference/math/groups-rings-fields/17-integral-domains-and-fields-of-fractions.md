---
title: "17. Integral Domains and Fields of Fractions"
type: math-component
tags: [math, groups-rings-fields, ring-theory, integral-domains, lesson-17]
aliases: [Integral Domains and Fields of Fractions]
created: 2026-05-15
---

> **Prerequisites**: [[16-ring-homomorphisms-and-isomorphism-theorems|16. Ring Homomorphisms and Isomorphism Theorems]] — đồng cấu vành, vành thương; [[15-ideals-and-quotient-rings|15. Ideals and Quotient Rings]] — ideal nguyên tố, ideal tối đại.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{C}$ | Tập số phức |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $\mathbb{Z}[i]$ | Vành số nguyên Gauss |
> | $\mathbb{Z}[\sqrt{-5}]$ | Vành $\{a + b\sqrt{-5} : a, b \in \mathbb{Z}\}$ |
> | $R[x]$ | Vành đa thức với hệ số trong $R$ |
> | $\cong$ | Đẳng cấu (isomorphism) |
> | $R^\times$ | Nhóm đơn vị của vành $R$ |

> **Objectives**:
> - Định nghĩa và nhận diện miền nguyên (integral domain)
> - Hiểu và sử dụng đặc số (characteristic) của vành
> - Chứng minh luật hủy (cancellation law) trong miền nguyên
> - Xây dựng trường phân số (field of fractions) từ miền nguyên
> - Hiểu cách xây dựng $\mathbb{Q}$ từ $\mathbb{Z}$ như trường hợp đặc biệt

---

## Motivation / Intuition

Câu hỏi tự nhiên: trong vành nào thì phép nhân cư xử "tốt" nhất? Câu trả lời là **miền nguyên** — vành không có ước không. Trong miền nguyên, luật hủy $ac = bc, c \neq 0 \Rightarrow a = b$ đúng, y như trong $\mathbb{Z}$.

Câu hỏi tiếp theo: từ miền nguyên, có thể "thêm phân số" để được trường không? Câu trả lời là có — đây chính là cách $\mathbb{Q}$ được xây dựng từ $\mathbb{Z}$, hoặc tổng quát hơn, cách trường phân số $\operatorname{Frac}(R)$ được xây dựng từ miền nguyên $R$.

---

## Miền nguyên (Integral Domain)

> [!definition] Definition 17.1 — Miền nguyên (Integral Domain)
> Vành giao hoán có đơn vị $R$ gọi là **miền nguyên** nếu:
>
> - $1 \neq 0$ (tức $R$ không phải vành zero), **và**
> - $R$ không có ước không: với mọi $a, b \in R$, $ab = 0 \Rightarrow a = 0$ hoặc $b = 0$.

> [!example] Example 17.2 — Các miền nguyên quen thuộc
> - $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$: miền nguyên (thực ra $\mathbb{Q}, \mathbb{R}, \mathbb{C}$ còn là trường).
> - $\mathbb{Z}[i]$ (số nguyên Gauss): miền nguyên (vì $|z_1 z_2| = |z_1||z_2| > 0$ nếu $z_1, z_2 \neq 0$).
> - $\mathbb{Z}[\sqrt{-5}] = \{a + b\sqrt{-5} : a, b \in \mathbb{Z}\}$: miền nguyên.
> - $\mathbb{F}_p[x]$: miền nguyên (đa thức trên trường).
> - $\mathbb{Z}/p\mathbb{Z}$ với $p$ nguyên tố: miền nguyên (là trường).

> [!warning] Counterexample 17.3 — Không phải miền nguyên
> - $\mathbb{Z}/6\mathbb{Z}$: không phải miền nguyên ($2 \cdot 3 = 0$).
> - $M_2(\mathbb{R})$: không phải miền nguyên (và không giao hoán).
> - $\mathbb{Z} \times \mathbb{Z}$: không phải miền nguyên ($(1,0)(0,1) = (0,0)$).

> [!abstract] Theorem 17.4 — Đặc trưng qua ideal nguyên tố
> Vành giao hoán có đơn vị $R$ là miền nguyên khi và chỉ khi $\langle 0 \rangle = \{0\}$ là ideal nguyên tố.

**Proof.** Theo định nghĩa ideal nguyên tố: $ab \in \{0\} \Rightarrow a \in \{0\}$ hoặc $b \in \{0\}$, tức $ab = 0 \Rightarrow a = 0$ hoặc $b = 0$. Đúng bằng định nghĩa không có ước không. $\blacksquare$

---

## Luật hủy và tính chất cơ bản

> [!abstract] Theorem 17.5 — Luật hủy (Cancellation Law)
> Trong miền nguyên $R$: với mọi $a, b, c \in R$ với $c \neq 0$:
>
> $$
> ca = cb \implies a = b
> $$

**Proof.** $ca = cb \Rightarrow ca - cb = 0 \Rightarrow c(a - b) = 0$. Vì $c \neq 0$ và $R$ là miền nguyên, $a - b = 0$, tức $a = b$. $\blacksquare$

> [!abstract] Theorem 17.6 — Trường là miền nguyên
> Mọi **trường** (field) đều là miền nguyên.

**Proof.** Cho $F$ là trường, $ab = 0$ với $a \neq 0$. Vì $F$ là trường, $a$ có nghịch đảo $a^{-1}$. Nhân $a^{-1}$ vào: $b = a^{-1} \cdot 0 = 0$. $\blacksquare$

> [!abstract] Theorem 17.7 — Miền nguyên hữu hạn là trường
> Mọi **miền nguyên hữu hạn** (finite integral domain) đều là trường.

**Proof.** Cho $R$ là miền nguyên hữu hạn và $a \in R$, $a \neq 0$. Xét ánh xạ $\mu_a: R \to R$, $\mu_a(r) = ar$. Do luật hủy, $\mu_a$ là đơn ánh. Vì $R$ hữu hạn, $\mu_a$ cũng là toàn ánh. Đặc biệt, tồn tại $b \in R$ sao cho $ab = \mu_a(b) = 1$. Vậy $a$ có nghịch đảo. $\blacksquare$

> [!abstract] Corollary 17.8
> $\mathbb{Z}/p\mathbb{Z}$ là trường khi và chỉ khi $p$ là số nguyên tố.

**Proof.** ($\Rightarrow$) Nếu $p$ không nguyên tố, $p = ab$ với $1 < a, b < p$, nên $[a][b] = [0]$ trong $\mathbb{Z}/p\mathbb{Z}$ — tức có ước không, không phải miền nguyên, không phải trường.

($\Leftarrow$) Nếu $p$ nguyên tố thì $\mathbb{Z}/p\mathbb{Z}$ là miền nguyên (vì $p \mid ab \Rightarrow p \mid a$ hoặc $p \mid b$). Là miền nguyên hữu hạn, nên là trường theo Theorem 17.7. $\blacksquare$

---

## Đặc số (Characteristic)

> [!definition] Definition 17.9 — Đặc số (Characteristic)
> Cho $R$ là vành có đơn vị. **Đặc số** của $R$, ký hiệu $\operatorname{char}(R)$, là số nguyên dương nhỏ nhất $n$ sao cho:
>
> $$
> \underbrace{1 + 1 + \cdots + 1}_{n \text{ lần}} = 0
> $$
>
> Nếu không có $n$ như vậy, ta định nghĩa $\operatorname{char}(R) = 0$.

> [!example] Example 17.10 — Đặc số của các vành quen thuộc
> - $\operatorname{char}(\mathbb{Z}) = \operatorname{char}(\mathbb{Q}) = \operatorname{char}(\mathbb{R}) = \operatorname{char}(\mathbb{C}) = 0$.
> - $\operatorname{char}(\mathbb{Z}/n\mathbb{Z}) = n$.
> - $\operatorname{char}(\mathbb{F}_p) = p$ với $p$ nguyên tố.
> - $\operatorname{char}(\mathbb{F}_p[x]) = p$ (đa thức trên $\mathbb{F}_p$).

> [!abstract] Theorem 17.11 — Đặc số của miền nguyên
> Nếu $R$ là miền nguyên thì $\operatorname{char}(R) = 0$ hoặc $\operatorname{char}(R) = p$ với $p$ là số nguyên tố.

**Proof.** Giả sử $\operatorname{char}(R) = n > 0$. Cần chứng minh $n$ là nguyên tố. Giả sử $n = ab$ với $1 \leq a, b < n$. Khi đó:

$$
0 = \underbrace{1 + \cdots + 1}_{n} = \underbrace{1 + \cdots + 1}_{ab} = \left(\underbrace{1 + \cdots + 1}_{a}\right)\left(\underbrace{1 + \cdots + 1}_{b}\right)
$$

(đẳng thức cuối dùng phân phối lặp đi lặp lại). Đặt $\alpha = \underbrace{1+\cdots+1}_{a}$ và $\beta = \underbrace{1+\cdots+1}_{b}$. Ta có $\alpha\beta = 0$ trong miền nguyên. Nên $\alpha = 0$ hoặc $\beta = 0$. Điều này mâu thuẫn với định nghĩa $n$ là số nhỏ nhất (vì $a < n$ và $b < n$). $\blacksquare$

> [!definition] Definition 17.12 — Trường nguyên tố (Prime Subfield)
> Với mỗi miền nguyên $R$, tập giao của tất cả các trường con (hay vành con có đơn vị) của $R$ gọi là **trường nguyên tố** (prime subfield) của $R$:
>
> - Nếu $\operatorname{char}(R) = 0$: trường nguyên tố $\cong \mathbb{Q}$.
> - Nếu $\operatorname{char}(R) = p$: trường nguyên tố $\cong \mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$.

---

## Xây dựng trường phân số (Field of Fractions)

Ý tưởng: từ miền nguyên $R$ (chẳng hạn $\mathbb{Z}$), ta muốn xây dựng trường nhỏ nhất chứa $R$ (chẳng hạn $\mathbb{Q}$). Cách làm: "thêm vào" tất cả các phân số $a/b$ với $a, b \in R$, $b \neq 0$.

> [!definition] Definition 17.13 — Xây dựng trường phân số (Field of Fractions)
> Cho $R$ là miền nguyên. Xét tập:
>
> $$
> S = \{(a, b) : a, b \in R,\, b \neq 0\}
> $$
>
> Định nghĩa quan hệ tương đương trên $S$:
>
> $$
> (a, b) \sim (c, d) \iff ad = bc
> $$
>
> Ký hiệu lớp tương đương của $(a, b)$ là $\dfrac{a}{b}$ hay $a/b$. Đặt:
>
> $$
> \operatorname{Frac}(R) = S/{\sim}
> $$
>
> Định nghĩa phép toán trên $\operatorname{Frac}(R)$:
>
> $$
> \frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}, \qquad \frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}
> $$

> [!abstract] Theorem 17.14 — Trường phân số là trường
> Với các phép toán trên, $\operatorname{Frac}(R)$ là **trường**. Hơn nữa:
>
> 1. Ánh xạ $\iota: R \to \operatorname{Frac}(R)$, $\iota(a) = a/1$, là đơn cấu vành.
> 2. $\operatorname{Frac}(R)$ là trường nhỏ nhất chứa $R$ (theo nghĩa: mọi đồng cấu $R \hookrightarrow F$ với $F$ là trường đều mở rộng thành $\operatorname{Frac}(R) \hookrightarrow F$).

**Proof (phác thảo).**

*$\sim$ là quan hệ tương đương*:
- Phản xạ: $(a,b) \sim (a,b)$ vì $ab = ba$.
- Đối xứng: $(a,b) \sim (c,d) \Rightarrow ad = bc \Rightarrow cb = da \Rightarrow (c,d) \sim (a,b)$.
- Bắc cầu: Nếu $(a,b) \sim (c,d)$ và $(c,d) \sim (e,f)$ thì $ad = bc$ và $cf = de$. Nhân: $ad \cdot cf = bc \cdot de$, tức $a \cdot dcf = b \cdot dce$. Trong miền nguyên, nếu $dc \neq 0$ ta hủy $dc$ để được $af = be$, tức $(a,b) \sim (e,f)$. Nếu $c = 0$ thì từ giả thiết suy ra $a = e = 0$ và $(0,b) \sim (0,f)$ hiển nhiên đúng.

*Well-defined của phép toán*: kiểm tra phép cộng và nhân không phụ thuộc vào chọn đại diện.

*Tiên đề trường*: phần tử không $= 0/1$, đơn vị $= 1/1$, nghịch đảo cộng của $a/b$ là $-a/b$, nghịch đảo nhân của $a/b \neq 0$ (tức $a \neq 0$) là $b/a$.

*$\iota$ là đơn cấu*: $\iota(a+b) = (a+b)/1 = a/1 + b/1 = \iota(a) + \iota(b)$. Tương tự cho nhân. Đơn ánh: $a/1 = 0/1 \Rightarrow a \cdot 1 = 0 \cdot 1 = 0 \Rightarrow a = 0$. $\blacksquare$

> [!example] Example 17.15 — $\operatorname{Frac}(\mathbb{Z}) = \mathbb{Q}$
> Áp dụng xây dựng trên với $R = \mathbb{Z}$:
>
> $$
> \operatorname{Frac}(\mathbb{Z}) = \left\{\frac{a}{b} : a, b \in \mathbb{Z},\, b \neq 0\right\} / {\sim}
> $$
>
> với $(a, b) \sim (c, d) \Leftrightarrow ad = bc$. Đây chính là cách xây dựng số hữu tỉ $\mathbb{Q}$ từ $\mathbb{Z}$.

> [!example] Example 17.16 — $\operatorname{Frac}(\mathbb{F}_p[x]) = \mathbb{F}_p(x)$
> Trường phân số của vành đa thức $\mathbb{F}_p[x]$ là **trường hàm hữu tỉ** (field of rational functions):
>
> $$
> \operatorname{Frac}(\mathbb{F}_p[x]) = \mathbb{F}_p(x) = \left\{\frac{f(x)}{g(x)} : f, g \in \mathbb{F}_p[x],\, g \neq 0\right\}
> $$

> [!example] Example 17.17 — $\operatorname{Frac}(\mathbb{Z}[\sqrt{-5}])$
> $\mathbb{Z}[\sqrt{-5}]$ là miền nguyên. Trường phân số của nó là:
>
> $$
> \mathbb{Q}(\sqrt{-5}) = \{a + b\sqrt{-5} : a, b \in \mathbb{Q}\}
> $$
>
> — trường số đại số, là ví dụ quan trọng trong lý thuyết số đại số.

---

## Tính phổ quát của trường phân số

> [!abstract] Theorem 17.18 — Tính phổ quát (Universal Property)
> Cho $R$ là miền nguyên và $F$ là trường. Nếu $\varphi: R \to F$ là đơn cấu vành thì tồn tại duy nhất đơn cấu $\tilde\varphi: \operatorname{Frac}(R) \to F$ sao cho $\tilde\varphi \circ \iota = \varphi$, tức:
>
> $$
> \tilde\varphi\left(\frac{a}{b}\right) = \frac{\varphi(a)}{\varphi(b)}
> $$

**Proof.** Định nghĩa $\tilde\varphi(a/b) = \varphi(a)\varphi(b)^{-1}$. Well-defined: $(a/b) = (c/d) \Rightarrow ad = bc \Rightarrow \varphi(a)\varphi(d) = \varphi(b)\varphi(c) \Rightarrow \varphi(a)\varphi(b)^{-1} = \varphi(c)\varphi(d)^{-1}$. Còn lại là kiểm tra thường quy. $\blacksquare$

---

## SageMath — Miền nguyên và trường phân số

```python
# Kiểm tra miền nguyên
print(ZZ.is_integral_domain())           # True
print(Zmod(6).is_integral_domain())      # False (có ước không)
print(Zmod(7).is_integral_domain())      # True (là trường)
print(QQ['x'].is_integral_domain())      # True

# Đặc số
print(ZZ.characteristic())              # 0
print(GF(7).characteristic())           # 7
print(GF(4).characteristic())           # 2

# Trường phân số
print(ZZ.fraction_field())              # Rational Field
print(QQ == ZZ.fraction_field())        # True

# Trường phân số của vành đa thức
R = GF(5)['x']
F = R.fraction_field()
print(F)                                # Fraction Field of Univariate Polynomial Ring...

# Ví dụ phân số đa thức
x = R.gen()
f = x^2 + 1
g = x - 1
ratio = F(f) / F(g)
print(ratio)                            # (x^2 + 1)/(x - 1)

# Trường nguyên tố
print(GF(7).prime_subfield())          # Finite Field of size 7
print(GF(49).prime_subfield())         # Finite Field of size 7
```

---

## Summary — Lesson 17

- **Miền nguyên** (integral domain): vành giao hoán có đơn vị, $1 \neq 0$, không có ước không.
- **Luật hủy**: $ca = cb$, $c \neq 0 \Rightarrow a = b$ (tương đương không có ước không).
- Mọi trường là miền nguyên; miền nguyên **hữu hạn** là trường.
- **Đặc số** $\operatorname{char}(R)$: số $n$ nhỏ nhất sao cho $n \cdot 1 = 0$, hoặc $0$ nếu không có. Của miền nguyên là $0$ hoặc nguyên tố.
- **Trường phân số** $\operatorname{Frac}(R)$: xây dựng từ "phân số" $a/b$, là trường nhỏ nhất chứa $R$.
- $\operatorname{Frac}(\mathbb{Z}) = \mathbb{Q}$; $\operatorname{Frac}(F[x]) = F(x)$ (hàm hữu tỉ).

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §7.1, §7.5.
- Hungerford, T. W. *Algebra*, Chapter III §4.
- Atiyah, M. F., & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 1.
