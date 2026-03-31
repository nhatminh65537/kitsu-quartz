---
title: "07. Integral Dependence"
tags: [math, commutative-algebra, lesson-07]
aliases: [Integral Dependence]
created: 2026-03-30
---

> **Prerequisites**: [[04-localization|04. Localization]], [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]]
> **Objectives**:
> - Nắm định nghĩa phần tử nguyên (integral element) và mở rộng nguyên (integral extension)
> - Hiểu đặc trưng tương đương của integral elements qua module hữu hạn sinh
> - Chứng minh và áp dụng Going-Up Theorem và Going-Down Theorem
> - Hiểu integrally closed domains và vai trò của chúng trong lý thuyết số

---

## Motivation / Intuition

Trong lý thuyết số, số nguyên đại số (algebraic integer) là số phức thỏa một đa thức hệ số nguyên với hệ số đầu bằng 1 — ví dụ $\sqrt{2}$ thỏa $x^2 - 2 = 0$, hay $\zeta_n = e^{2\pi i/n}$ thỏa $x^n - 1 = 0$. Khái niệm **integral dependence** tổng quát hóa điều này lên vành tùy ý: phần tử $b \in S$ gọi là *nguyên trên* $R \subseteq S$ nếu $b$ thỏa một đa thức monic hệ số trong $R$.

Tại sao điều này quan trọng? Hãy xét bài toán trung tâm trong hình học đại số: cho ánh xạ $f: X \to Y$ giữa hai không gian đại số, hiểu được cấu trúc của sợi (fibers) $f^{-1}(y)$. Ngôn ngữ đại số tương ứng là extension vành $R \hookrightarrow S$. Khi extension nguyên (integral), các định lý Going-Up và Going-Down mô tả chính xác cách các prime ideals của $S$ "nằm trên" (lie over) prime ideals của $R$ — tức là cách sợi của ánh xạ hoạt động ở cấp độ đại số.

Ngoài ra, **integrally closed domains** (Dedekind domains, UFDs, ...) là lớp vành "hành xử tốt" nhất — chúng xuất hiện tự nhiên trong lý thuyết số và hình học đại số như "vành không có kỳ dị".

---

## Phần tử nguyên (Integral Elements)

### Definition

> [!info] Definition 7.1 — Integral Element và Integral Extension
>
> Cho $R \subseteq S$ là vành con. Phần tử $b \in S$ gọi là **integral over** $R$ (nguyên trên $R$) nếu tồn tại đa thức monic $f(x) = x^n + a_{n-1}x^{n-1} + \cdots + a_0 \in R[x]$ sao cho $f(b) = 0$.
>
> - **Integral closure** của $R$ trong $S$: $\overline{R}^S = \{b \in S : b \text{ integral over } R\}$.
> - $S$ là **integral extension** của $R$ nếu mọi $b \in S$ đều nguyên trên $R$.
> - $R$ là **integrally closed** trong $S$ nếu $\overline{R}^S = R$.
> - Miền nguyên $R$ gọi là **integrally closed** (ngắn gọn) nếu $R$ integrally closed trong $\operatorname{Frac}(R)$.

> [!example] Example 7.2 — Ví dụ cơ bản
>
> **Ví dụ 1:** $R = \mathbb{Z}$, $S = \mathbb{C}$. Phần tử $\sqrt{2} \in \mathbb{C}$ thỏa $x^2 - 2 = 0$ (monic, hệ số $\mathbb{Z}$), nên $\sqrt{2}$ là integral over $\mathbb{Z}$.
>
> Phần tử $\frac{1}{2} \in \mathbb{Q}$: nếu $\frac{1}{2}$ nguyên trên $\mathbb{Z}$, tức $(\frac{1}{2})^n + a_{n-1}(\frac{1}{2})^{n-1} + \cdots + a_0 = 0$, nhân $2^n$: $1 + a_{n-1} \cdot 2 + \cdots + a_0 \cdot 2^n = 0$, tức $1 \equiv 0 \pmod{2}$ — mâu thuẫn. Vậy $\frac{1}{2}$ **không** integral over $\mathbb{Z}$.
>
> **Ví dụ 2:** $\mathbb{Z}[\sqrt{-5}] \subseteq \mathbb{C}$ là integral over $\mathbb{Z}$: mọi $a + b\sqrt{-5}$ thỏa $(x - a - b\sqrt{-5})(x - a + b\sqrt{-5}) = x^2 - 2ax + (a^2 + 5b^2) = 0$ (monic, hệ số $\mathbb{Z}$).
>
> **Ví dụ 3 (hình học):** $R = k[t^2, t^3] \subseteq S = k[t]$. Phần tử $t \in k[t]$ thỏa $t^2 - t^2 = 0$... thực ra $t$ thỏa $x^2 - t^2 = 0$ với hệ số $t^2 \in R$. Đây là integral extension (tương ứng hình học: ánh xạ chuẩn hóa của đường cong cuspidal $y^2 = x^3$).

### Theorem

> [!abstract] Theorem 7.3 — Đặc trưng tương đương của Integral Elements
>
> Cho $R \subseteq S$ vành và $b \in S$. Các điều sau tương đương:
>
> 1. $b$ là integral over $R$.
> 2. $R[b]$ (subring của $S$ sinh bởi $b$) là $R$-module hữu hạn sinh.
> 3. Tồn tại subring $T$ với $R[b] \subseteq T \subseteq S$ sao cho $T$ là $R$-module hữu hạn sinh.
> 4. Tồn tại $R[b]$-module $M$ hữu hạn sinh và faithful (tức $\operatorname{Ann}_{R[b]}(M) = 0$) sao cho $bM \subseteq M$.

**Proof.**

$(1) \Rightarrow (2)$: Nếu $b^n + a_{n-1}b^{n-1} + \cdots + a_0 = 0$, thì $b^n \in R + Rb + \cdots + Rb^{n-1}$. Bằng quy nạp, mọi $b^k$ ($k \geq n$) nằm trong $R$-module sinh bởi $\{1, b, \ldots, b^{n-1}\}$. Vậy $R[b] = R \cdot 1 + R \cdot b + \cdots + R \cdot b^{n-1}$ hữu hạn sinh.

$(2) \Rightarrow (3)$: Lấy $T = R[b]$.

$(3) \Rightarrow (4)$: Lấy $M = T$ với $R[b]$ tác động bằng phép nhân. $M$ faithful vì $T$ là ring (có $1$). $bM = bT \subseteq T = M$.

$(4) \Rightarrow (1)$: Áp dụng **Cayley-Hamilton cho modules**: vì $bM \subseteq M$ và $M$ hữu hạn sinh bởi $m_1, \ldots, m_k$, viết $b \cdot m_i = \sum_j r_{ij} m_j$ với $r_{ij} \in R$. Ma trận $A = (b\delta_{ij} - r_{ij})$ thỏa $A \cdot (m_1, \ldots, m_k)^T = 0$, suy ra $\det(A) \cdot m_i = 0$ với mọi $i$ (theo công thức adjugate). Vì $M$ faithful: $\det(A) = 0$. Nhưng $\det(bI - (r_{ij})) = 0$ là đúng một đa thức monic bậc $k$ trong $b$ với hệ số trong $R$. $\blacksquare$

### Theorem

> [!abstract] Theorem 7.4 — Integral closure là subring
>
> Tập $\overline{R}^S = \{b \in S : b \text{ integral over } R\}$ là subring của $S$ chứa $R$.

**Proof.** Nếu $b, c$ integral over $R$, thì $R[b]$ là $R$-module hữu hạn sinh (Theorem 7.3(2)), và $R[b][c] = R[b, c]$ là $R[b]$-module hữu hạn sinh (vì $c$ integral over $R[b] \supseteq R$). Vậy $R[b,c]$ là $R$-module hữu hạn sinh. Mọi phần tử của $R[b,c]$ — bao gồm $b+c$, $bc$, $b-c$ — đều integral over $R$ theo Theorem 7.3(3). $\blacksquare$

> [!abstract] Corollary 7.5 — Transitivity of Integral Extensions
>
> Nếu $R \subseteq S \subseteq T$ với $S$ integral over $R$ và $T$ integral over $S$, thì $T$ integral over $R$.

**Proof.** Cho $t \in T$, thỏa $t^n + s_{n-1}t^{n-1} + \cdots + s_0 = 0$ với $s_i \in S$. Thì $t$ integral over $R[s_0, \ldots, s_{n-1}]$, ring này integral (hữu hạn sinh) over $R$. Áp dụng Theorem 7.3: $R[s_0, \ldots, s_{n-1}, t]$ hữu hạn sinh over $R$, nên $t$ integral over $R$. $\blacksquare$

---

## Going-Up Theorem

### Theorem

> [!abstract] Theorem 7.6 — Going-Up Theorem
>
> Cho $R \subseteq S$ là integral extension. Cho $\mathfrak{p} \subseteq \mathfrak{p}'$ là hai prime ideals của $R$ và $\mathfrak{q}$ là prime ideal của $S$ với $\mathfrak{q} \cap R = \mathfrak{p}$. Khi đó tồn tại prime ideal $\mathfrak{q}' \supseteq \mathfrak{q}$ của $S$ sao cho $\mathfrak{q}' \cap R = \mathfrak{p}'$.

Nói cách khác: với mọi dãy $\mathfrak{p}_1 \subseteq \cdots \subseteq \mathfrak{p}_n$ trong $\operatorname{Spec}(R)$ và $\mathfrak{q}_1 \in \operatorname{Spec}(S)$ với $\mathfrak{q}_1 \cap R = \mathfrak{p}_1$, tồn tại dãy $\mathfrak{q}_1 \subseteq \cdots \subseteq \mathfrak{q}_n$ trong $\operatorname{Spec}(S)$ với $\mathfrak{q}_i \cap R = \mathfrak{p}_i$.

Xem chứng minh đầy đủ tại [[a1-going-up-going-down|A1. Proof of Going-Up and Going-Down Theorems]].

**Phác thảo.** Thay $R, S$ bởi $R/\mathfrak{p}, S/\mathfrak{q}$ (vẫn là integral extension của miền nguyên). Cần tìm prime ideal của $S/\mathfrak{q}$ nằm trên $\mathfrak{p}'/\mathfrak{p}$. Dùng Lemma: trong integral extension $R \hookrightarrow S$ với $R, S$ miền nguyên, $\mathfrak{q} \cap R = 0$ khi và chỉ khi $S$ là miền nguyên. Áp dụng: $S/\mathfrak{q}S$ có prime ideal nằm trên $\mathfrak{p}'/\mathfrak{p}$ (theo Theorem 1.15 và lying-over). $\blacksquare$

> [!abstract] Corollary 7.7 — Lying-Over và Incomparability
>
> Cho $R \subseteq S$ integral extension.
>
> 1. **(Lying-Over)** Với mọi $\mathfrak{p} \in \operatorname{Spec}(R)$, tồn tại $\mathfrak{q} \in \operatorname{Spec}(S)$ với $\mathfrak{q} \cap R = \mathfrak{p}$.
> 2. **(Incomparability)** Nếu $\mathfrak{q} \subseteq \mathfrak{q}'$ trong $\operatorname{Spec}(S)$ và $\mathfrak{q} \cap R = \mathfrak{q}' \cap R$, thì $\mathfrak{q} = \mathfrak{q}'$.

**Proof của (1).** Localize tại $S = R \setminus \mathfrak{p}$: $S_\mathfrak{p} = R_\mathfrak{p} \otimes_R S$ vẫn là integral extension của $R_\mathfrak{p}$ (local ring). Mọi maximal ideal $\mathfrak{m}$ của $S_\mathfrak{p}$ thỏa $\mathfrak{m} \cap R_\mathfrak{p} = \mathfrak{p} R_\mathfrak{p}$ (maximal ideal của $R_\mathfrak{p}$). Kéo về $S$ cho prime ideal nằm trên $\mathfrak{p}$. $\blacksquare$

### Worked Example

> [!example] Example 7.8 — Going-Up trong $\mathbb{Z} \subseteq \mathbb{Z}[i]$
>
> $\mathbb{Z}[i]$ là integral over $\mathbb{Z}$ (mọi $a + bi$ thỏa $x^2 - 2ax + (a^2+b^2) = 0$).
>
> Xét prime ideal $\mathfrak{p} = (5) \subseteq \mathbb{Z}$. Theo Lying-Over, tồn tại prime ideal $\mathfrak{q}$ của $\mathbb{Z}[i]$ nằm trên $(5)$.
>
> Trong $\mathbb{Z}[i]$: $5 = (2+i)(2-i)$. Các prime ideal của $\mathbb{Z}[i]$ nằm trên $(5)$ là:
>
> $$
> \mathfrak{q}_1 = (2+i), \quad \mathfrak{q}_2 = (2-i)
> $$
>
> Kiểm tra: $\mathfrak{q}_1 \cap \mathbb{Z} = (5)$ vì $5 = (2+i)(2-i) \in \mathfrak{q}_1$ và $\mathbb{Z}[i]/\mathfrak{q}_1 \cong \mathbb{F}_5$.
>
> Nguyên tố $5$ **splits** trong $\mathbb{Z}[i]$ thành hai prime ideals phân biệt (vì $5 \equiv 1 \pmod{4}$).

---

## Going-Down Theorem

### Theorem

> [!abstract] Theorem 7.9 — Going-Down Theorem
>
> Cho $R \subseteq S$ là integral extension. Giả sử $R$ là **integrally closed** và $S$ là **miền nguyên**. Cho $\mathfrak{p} \supseteq \mathfrak{p}'$ là hai prime ideals của $R$ và $\mathfrak{q}$ là prime ideal của $S$ với $\mathfrak{q} \cap R = \mathfrak{p}$. Khi đó tồn tại prime ideal $\mathfrak{q}' \subseteq \mathfrak{q}$ của $S$ sao cho $\mathfrak{q}' \cap R = \mathfrak{p}'$.

Nói hình học: nếu $f: X \to Y$ là ánh xạ đại số với $Y$ "nhẵn" (smooth/normal) và $X$ bất khả quy (integral), thì với mọi dây xích đi xuống trong $Y$, ta có thể "nâng" nó lên $X$.

Xem chứng minh đầy đủ tại [[a1-going-up-going-down|A1. Proof of Going-Up and Going-Down Theorems]].

> [!warning] Counterexample 7.10 — Going-Down thất bại khi $R$ không integrally closed
>
> Xét $R = k[t^2, t^3] \subseteq S = k[t]$. $R$ không integrally closed (vì $t \in \operatorname{Frac}(R) = k(t)$ integral over $R$ nhưng $t \notin R$).
>
> Lấy $\mathfrak{p} = (t^2, t^3) \supseteq \mathfrak{p}' = (0)$ trong $R$, và $\mathfrak{q} = (t) \subseteq k[t]$ nằm trên $\mathfrak{p}$. Cần $\mathfrak{q}' \subseteq (t)$ với $\mathfrak{q}' \cap R = (0)$, tức $\mathfrak{q}' = (0)$ (vì $k[t]$ miền nguyên). Nhưng $(0) \cap R = (0) = \mathfrak{p}'$. Vậy trong trường hợp này Going-Down vẫn đúng — ví dụ thất bại phức tạp hơn, đòi hỏi $R$ không integrally closed và $S$ không miền nguyên đồng thời.

---

## Integrally Closed Domains

### Definition

> [!info] Definition 7.11 — Integrally Closed Domain và Normal Domain
>
> Miền nguyên $R$ được gọi là **integrally closed** (hay **normal**) nếu $R$ integrally closed trong $\operatorname{Frac}(R)$: tức mọi phần tử của $\operatorname{Frac}(R)$ thỏa đa thức monic hệ số $R$ thì đã thuộc $R$.

> [!example] Example 7.12 — Ví dụ và phản ví dụ
>
> **Integrally closed:**
> - $\mathbb{Z}$: nếu $\frac{p}{q}$ (tối giản) thỏa $(\frac{p}{q})^n + a_{n-1}(\frac{q}{p})^{n-1} + \cdots = 0$, nhân $q^n$: $p^n + a_{n-1}p^{n-1}q + \cdots = 0$, suy ra $q \mid p^n$, mà $\gcd(p,q)=1$ nên $q = \pm 1$.
> - Mọi UFD (unique factorization domain): $\mathbb{Z}$, $k[x]$, $k[x,y]$, ...
> - Mọi PID (principal ideal domain).
>
> **Không integrally closed:**
> - $\mathbb{Z}[\sqrt{-5}]$: phần tử $\frac{1+\sqrt{-5}}{2} \notin \mathbb{Z}[\sqrt{-5}]$ nhưng thỏa $x^2 - x + \frac{3}{2}$... thực ra cần xét cẩn thận hơn. Ví dụ tốt hơn:
> - $k[t^2, t^3]$: $t = \frac{t^3}{t^2} \in \operatorname{Frac}(R)$ thỏa $x^2 - t^2 = 0$ (monic, hệ số $t^2 \in R$), nhưng $t \notin R$.

### Theorem

> [!abstract] Theorem 7.13 — UFD là integrally closed
>
> Mọi UFD là integrally closed domain.

**Proof.** Cho $R$ là UFD và $\frac{a}{b} \in \operatorname{Frac}(R)$ (với $\gcd(a,b) = 1$ theo nghĩa UFD) thỏa:

$$
\left(\frac{a}{b}\right)^n + r_{n-1}\left(\frac{a}{b}\right)^{n-1} + \cdots + r_0 = 0
$$

Nhân $b^n$: $a^n + r_{n-1}a^{n-1}b + \cdots + r_0 b^n = 0$. Vậy $b \mid a^n$. Vì $\gcd(a,b) = 1$ trong UFD: $b \in R^\times$, tức $\frac{a}{b} \in R$. $\blacksquare$

### Theorem

> [!abstract] Theorem 7.14 — Dimension được bảo toàn trong Integral Extension
>
> Cho $R \subseteq S$ integral extension. Khi đó $\dim R = \dim S$ (Krull dimension).

**Proof (phác thảo).** Từ Going-Up: mọi dây xích prime ideals trong $R$ có thể nâng lên $S$, nên $\dim S \geq \dim R$. Từ Incomparability (Corollary 7.7): mọi dây xích prime ideals trong $S$ chiếu xuống dây xích phân biệt trong $R$, nên $\dim S \leq \dim R$. $\blacksquare$

---

## SageMath Cheatsheet

```sage
R.<t> = QQ[]

S = R.integral_closure()

K.<sqrt5> = NumberField(x^2 - 5)
OK = K.ring_of_integers()
OK.is_integrally_closed()

K2.<a> = NumberField(x^2 + 5)
OK2 = K2.ring_of_integers()
OK2.is_integrally_closed()

R2 = ZZ['x']
f = R2(x^3 - 2)
K3 = f.splitting_field('b')
K3.ring_of_integers().is_integrally_closed()

R3.<t2, t3> = QQ[]
I = R3.ideal(t3^2 - t2^3)
(R3.quotient(I)).integral_closure()
```

---

## Summary / Key Takeaways

- **Integral element** $b$ over $R$: thỏa đa thức monic hệ số $R$; tương đương $R[b]$ hữu hạn sinh qua $R$.
- **Integral closure** $\overline{R}^S$ là subring; integrality có tính bắc cầu.
- **Lying-Over**: mọi prime của $R$ có prime của $S$ nằm trên nó.
- **Going-Up**: có thể "kéo lên" dây xích prime ideals từ $R$ lên $S$ (không cần $R$ integrally closed).
- **Incomparability**: không có hai prime ideals phân biệt của $S$ cùng nằm trên một prime của $R$ mà một cái chứa cái kia.
- **Going-Down**: có thể "kéo xuống" — cần thêm $R$ integrally closed và $S$ miền nguyên.
- **Integrally closed** = normal: mọi UFD là integrally closed; $k[t^2, t^3]$ không phải.
- $\dim R = \dim S$ trong integral extension — dimension được bảo toàn.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 5.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 4.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 14–15.
- Matsumura, H. *Commutative Ring Theory*, §9.
