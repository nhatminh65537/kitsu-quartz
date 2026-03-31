---
title: "06. Primary Decomposition"
tags: [math, commutative-algebra, lesson-06]
aliases: [Primary Decomposition]
created: 2026-03-29
---

> **Prerequisites**: [[04-localization|04. Localization]], [[05-noetherian-rings|05. Noetherian Rings and Hilbert Basis Theorem]]
> **Objectives**:
> - Hiểu associated primes và vai trò của chúng trong cấu trúc của module
> - Nắm định lý tồn tại và tính duy nhất (có điều kiện) của primary decomposition
> - Tính được primary decomposition trong các ví dụ cụ thể
> - Kết nối primary decomposition với hình học đại số qua tập nghiệm

---

## Motivation / Intuition

Trong $\mathbb{Z}$, mọi số nguyên dương phân tích được thành tích các lũy thừa nguyên tố: $360 = 2^3 \cdot 3^2 \cdot 5$. Dịch sang ngôn ngữ ideal: $(360) = (8) \cap (9) \cap (5)$, và mỗi $(p^k)$ là primary ideal với radical $(p)$.

Câu hỏi tự nhiên: liệu mọi ideal trong vành tổng quát có thể "phân tích" thành primary ideals không? Câu trả lời là **có** — ít nhất khi vành Noetherian. Đây chính là định lý **Lasker–Noether** (1905–1921): một sự tổng quát hóa sâu sắc của phân tích nhân tử nguyên tố.

Nhưng primary decomposition không chỉ là đại số thuần túy — nó có ý nghĩa **hình học** rõ ràng. Xét ideal $I \subseteq k[x,y]$ xác định một tập đại số $V(I) \subseteq \mathbb{A}^2$. Nếu $V(I)$ là hợp của nhiều thành phần bất khả quy (irreducible components), thì primary decomposition của $I$ "tách" các thành phần đó ra. Ví dụ:

$$
I = (xy) = (x) \cap (y)
$$

tách đường thẳng $V(x)$ và $V(y)$ trong $\mathbb{A}^2$. Associated primes của $I$ chính là các prime ideals ứng với các thành phần này.

---

## Associated Primes

### Definition

> [!info] Definition 6.1 — Associated Prime
>
> Cho $M$ là $R$-module. Prime ideal $\mathfrak{p} \in \operatorname{Spec}(R)$ gọi là **associated prime** của $M$ nếu tồn tại $m \in M$ sao cho:
>
> $$
> \mathfrak{p} = \operatorname{Ann}(m) = \{r \in R : rm = 0\}
> $$
>
> Tập các associated primes của $M$ ký hiệu là $\operatorname{Ass}(M)$ hay $\operatorname{Ass}_R(M)$.
>
> Với ideal $\mathfrak{a} \subseteq R$, ta viết $\operatorname{Ass}(\mathfrak{a})$ thay cho $\operatorname{Ass}(R/\mathfrak{a})$.

> [!example] Example 6.2 — Associated primes cụ thể
>
> **Ví dụ 1:** $R = \mathbb{Z}$, $M = \mathbb{Z}/12\mathbb{Z}$.
>
> $\operatorname{Ann}(\bar{4}) = \{n \in \mathbb{Z} : 4n \equiv 0 \pmod{12}\} = 3\mathbb{Z} = (3)$.
>
> $\operatorname{Ann}(\bar{6}) = \{n : 6n \equiv 0\} = 2\mathbb{Z} = (2)$.
>
> Vậy $(2), (3) \in \operatorname{Ass}(\mathbb{Z}/12\mathbb{Z})$. Thực ra $\operatorname{Ass}(\mathbb{Z}/12\mathbb{Z}) = \{(2), (3)\}$ (tương ứng phân tích $12 = 4 \cdot 3$).
>
> **Ví dụ 2:** $R = k[x,y]$, $\mathfrak{a} = (x^2, xy)$.
>
> Ta có $R/\mathfrak{a} \cong k[x,y]/(x^2,xy)$. Phần tử $\bar{x}$: $\operatorname{Ann}(\bar{x}) = \{f : fx \in (x^2,xy)\} = (x, y)$. Phần tử $\bar{1}$: $\operatorname{Ann}(\bar{1}) = (x^2, xy)$... nhưng điều này cần $\sqrt{(x^2,xy)} = (x)$ để là prime. Thực ra $\operatorname{Ass}(R/\mathfrak{a}) = \{(x), (x,y)\}$.

### Theorem

> [!abstract] Theorem 6.3 — Tính chất cơ bản của Associated Primes
>
> Cho $R$ là Noetherian ring và $M \neq 0$ là $R$-module hữu hạn sinh.
>
> 1. $\operatorname{Ass}(M) \neq \emptyset$.
> 2. $\operatorname{Ass}(M) \subseteq \operatorname{Supp}(M) = \{\mathfrak{p} : M_\mathfrak{p} \neq 0\}$.
> 3. Các phần tử cực tiểu của $\operatorname{Supp}(M)$ thuộc $\operatorname{Ass}(M)$.
> 4. $\operatorname{Ass}(M)$ là tập hữu hạn.
> 5. Tập các zero divisors của $M$: $\displaystyle\bigcup_{\mathfrak{p} \in \operatorname{Ass}(M)} \mathfrak{p} = \{r \in R : rm = 0 \text{ với một số } m \neq 0\}$.

**Proof của (1).** Vì $M \neq 0$ và $M$ hữu hạn sinh, xét tập $\mathcal{F} = \{\operatorname{Ann}(m) : m \in M \setminus \{0\}\}$. Đây là tập không rỗng các ideals; vì $R$ Noetherian, $\mathcal{F}$ có phần tử cực đại $\mathfrak{p} = \operatorname{Ann}(m_0)$. Ta chứng minh $\mathfrak{p}$ là prime: nếu $ab \in \mathfrak{p}$ và $b \notin \mathfrak{p}$, thì $bm_0 \neq 0$. Xét $\operatorname{Ann}(bm_0) \supseteq \operatorname{Ann}(m_0) = \mathfrak{p}$; vì $a(bm_0) = (ab)m_0 = 0$, ta có $a \in \operatorname{Ann}(bm_0)$. Vì $\mathfrak{p}$ cực đại và $\operatorname{Ann}(bm_0) \supseteq \mathfrak{p}$: $\operatorname{Ann}(bm_0) = \mathfrak{p}$, tức $a \in \mathfrak{p}$. $\blacksquare$

**Proof của (4).** Dùng filtration: vì $R$ Noetherian và $M$ hữu hạn sinh, tồn tại filtration $0 = M_0 \subsetneq M_1 \subsetneq \cdots \subsetneq M_n = M$ với $M_i/M_{i-1} \cong R/\mathfrak{p}_i$ ($\mathfrak{p}_i$ prime). Thì $\operatorname{Ass}(M) \subseteq \{\mathfrak{p}_1, \ldots, \mathfrak{p}_n\}$ — hữu hạn. $\blacksquare$

---

## Primary Decomposition

### Definition

> [!info] Definition 6.4 — Primary Decomposition
>
> Cho $\mathfrak{a} \subseteq R$ là ideal. Một **primary decomposition** (phân tích sơ cấp) của $\mathfrak{a}$ là biểu diễn:
>
> $$
> \mathfrak{a} = \mathfrak{q}_1 \cap \mathfrak{q}_2 \cap \cdots \cap \mathfrak{q}_n
> $$
>
> với mỗi $\mathfrak{q}_i$ là primary ideal. Phân tích gọi là **tối giản** (minimal/irredundant) nếu:
>
> 1. $\sqrt{\mathfrak{q}_i}$ đôi một phân biệt (không có hai primary components cùng radical).
> 2. Không có $\mathfrak{q}_i$ nào thừa: $\mathfrak{q}_i \not\supseteq \bigcap_{j \neq i} \mathfrak{q}_j$.

### Theorem

> [!abstract] Theorem 6.5 — Lasker–Noether: Tồn tại Primary Decomposition
>
> Nếu $R$ là Noetherian ring, thì mọi ideal $\mathfrak{a} \subsetneq R$ đều có primary decomposition tối giản.

**Proof.** Gọi ideal $\mathfrak{b}$ là **irreducible** nếu $\mathfrak{b} = \mathfrak{c} \cap \mathfrak{d} \Rightarrow \mathfrak{b} = \mathfrak{c}$ hoặc $\mathfrak{b} = \mathfrak{d}$.

*Bước 1: Mọi ideal irreducible là primary.* Giả sử $\mathfrak{b}$ irreducible và $ab \in \mathfrak{b}$, $a \notin \mathfrak{b}$. Xét dãy tăng $\operatorname{Ann}(b^n) \cap \mathfrak{b}$ trong $R/\mathfrak{b}$... (dùng ACC) dừng tại $n_0$. Đặt $\mathfrak{c} = (b^{n_0}) + \mathfrak{b}$ và $\mathfrak{d} = \mathfrak{b} : (a)^{\infty}$. Chứng minh $\mathfrak{b} = \mathfrak{c} \cap \mathfrak{d}$ và tính irreducibility buộc $b^{n_0} \in \mathfrak{b}$.

*Bước 2: Mọi ideal là giao hữu hạn các ideal irreducible.* Vì $R$ Noetherian, nếu tồn tại ideal không viết được như vậy, tập các ideal như vậy có phần tử cực đại $\mathfrak{a}$. Vì $\mathfrak{a}$ không irreducible, $\mathfrak{a} = \mathfrak{c} \cap \mathfrak{d}$ với $\mathfrak{c}, \mathfrak{d} \supsetneq \mathfrak{a}$. Cả $\mathfrak{c}$ và $\mathfrak{d}$ (lớn hơn $\mathfrak{a}$) phân tích được, nên $\mathfrak{a}$ cũng phân tích được — mâu thuẫn.

Kết hợp: $\mathfrak{a} = \bigcap_i \mathfrak{q}_i$ với $\mathfrak{q}_i$ primary. Tối giản hóa bằng cách gộp các $\mathfrak{q}_i$ cùng radical (Lemma 5.13) và loại bỏ những thành phần thừa. $\blacksquare$

---

## Tính duy nhất của Primary Decomposition

### Theorem

> [!abstract] Theorem 6.6 — First Uniqueness Theorem
>
> Cho $\mathfrak{a} = \mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n$ là primary decomposition tối giản với $\sqrt{\mathfrak{q}_i} = \mathfrak{p}_i$. Khi đó tập $\{\mathfrak{p}_1, \ldots, \mathfrak{p}_n\} = \operatorname{Ass}(R/\mathfrak{a})$ — **không phụ thuộc vào cách phân tích**.

**Proof.** Ta chứng minh $\mathfrak{p} \in \operatorname{Ass}(R/\mathfrak{a}) \iff \mathfrak{p} \in \{\mathfrak{p}_1, \ldots, \mathfrak{p}_n\}$.

Với mỗi ideal $\mathfrak{b} \subseteq R$ và prime $\mathfrak{p}$, ta có:

$$
\mathfrak{p} \in \operatorname{Ass}(R/\mathfrak{b}) \iff \mathfrak{b} : r = \mathfrak{p} \text{ với một số } r \in R
$$

Dùng quan hệ $(\mathfrak{a} : r) = \bigcap_i (\mathfrak{q}_i : r)$ và tính primary của $\mathfrak{q}_i$: khi $r \notin \mathfrak{q}_i$ thì $(\mathfrak{q}_i : r) \supseteq \mathfrak{p}_i$; khi $r \in \mathfrak{q}_i$ thì $(\mathfrak{q}_i : r) = R$. Bằng cách chọn $r$ phù hợp (dùng tính tối giản), ta thấy $\mathfrak{a} : r = \mathfrak{p}_i$ với $r$ nào đó. $\blacksquare$

> [!abstract] Theorem 6.7 — Second Uniqueness Theorem (Isolated Components)
>
> Trong primary decomposition tối giản $\mathfrak{a} = \mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n$, gọi $\mathfrak{p}_i = \sqrt{\mathfrak{q}_i}$. Nếu $\mathfrak{p}_j$ là **isolated** (cực tiểu trong $\{\mathfrak{p}_1, \ldots, \mathfrak{p}_n\}$), thì $\mathfrak{q}_j$ được xác định duy nhất bởi $\mathfrak{a}$:
>
> $$
> \mathfrak{q}_j = \mathfrak{a} \cdot R_{\mathfrak{p}_j} \cap R = \ker(R \to R_{\mathfrak{p}_j}/\mathfrak{a} R_{\mathfrak{p}_j})
> $$

> [!warning] Remark 6.8 — Embedded primes không duy nhất
>
> Các **embedded components** (ứng với prime không cực tiểu) **không** xác định duy nhất. Ví dụ: trong $R = k[x,y]$, ideal $(x^2, xy)$ có hai primary decomposition tối giản:
>
> $$
> (x^2, xy) = (x) \cap (x^2, y) = (x) \cap (x^2, xy, y^2)
> $$
>
> Cả hai đều tối giản với associated primes $\{(x), (x,y)\}$, nhưng component ứng với $(x,y)$ (embedded prime) khác nhau. Prime $(x)$ là isolated và $\mathfrak{q} = (x)$ là duy nhất; còn $(x,y)$ là embedded.

### Worked Example

> [!example] Example 6.9 — Tính primary decomposition trong $k[x,y]$
>
> **Ví dụ 1:** $I = (x^2, xy) \subseteq k[x,y]$.
>
> Ta có $x^2, xy \in I$. Nhận xét: $x(x, y) \subseteq I$ và $(x) \cap (x, y)^2 \supseteq I$? Thử:
>
> $$
> (x^2, xy) = (x) \cap (x^2, y)
> $$
>
> Kiểm tra: $(x) \cap (x^2, y)$: lấy $f \in (x)$, tức $f = xg$; và $f \in (x^2,y)$. Nếu $g = ax + by + \cdots$ thì $f = ax^2 + bxy + \cdots \in (x^2, xy)$. ✓
>
> Associated primes: $\sqrt{(x)} = (x)$ và $\sqrt{(x^2, y)} = (x, y)$.
>
> Vậy $\operatorname{Ass}(k[x,y]/(x^2,xy)) = \{(x), (x,y)\}$; $(x)$ là isolated, $(x,y)$ là embedded.
>
> **Ý nghĩa hình học:** $V(x^2, xy) = V(x) = $ đường thẳng $x = 0$ (không gian vector ảnh), nhưng embedded prime $(x,y)$ biểu thị sự "dày lên" tại gốc tọa độ.
>
> **Ví dụ 2:** $I = (xy, xz, yz) \subseteq k[x,y,z]$.
>
> $$
> (xy, xz, yz) = (x, y) \cap (x, z) \cap (y, z)
> $$
>
> Ba thành phần ứng với ba prime $\{(x,y), (x,z), (y,z)\}$ — đều isolated, tất cả đều duy nhất. Hình học: $V(xy, xz, yz)$ là hợp của ba đường thẳng tọa độ trong $\mathbb{A}^3$.

---

## Kết nối với Localization

### Theorem

> [!abstract] Theorem 6.10 — Primary Decomposition qua Localization
>
> Cho $\mathfrak{a} = \mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n$ là primary decomposition tối giản, $\mathfrak{p}_i = \sqrt{\mathfrak{q}_i}$. Với tập nhân $S$ và $\mathfrak{p}_i \cap S = \emptyset$ iff $i \in J \subseteq \{1,\ldots,n\}$:
>
> $$
> S^{-1}\mathfrak{a} = \bigcap_{i \in J} S^{-1}\mathfrak{q}_i
> $$
>
> và đây là primary decomposition tối giản của $S^{-1}\mathfrak{a}$ trong $S^{-1}R$.

**Proof.** Localization bảo toàn primary ideals (khi $\mathfrak{p}_i \cap S = \emptyset$) và triệt tiêu những primary ideal có radical giao với $S$. Tính tối giản được bảo toàn vì localization exact. $\blacksquare$

> [!tip] Cách tính isolated components
>
> Để tính $\mathfrak{q}_j$ (isolated component, $\mathfrak{p}_j$ cực tiểu): localize tại $S = R \setminus \mathfrak{p}_j$, tính $S^{-1}\mathfrak{a} = S^{-1}\mathfrak{q}_j$ (chỉ còn một thành phần), rồi "kéo về" $R$:
>
> $$
> \mathfrak{q}_j = S^{-1}\mathfrak{a} \cap R
> $$

---

## SageMath Cheatsheet

```sage
R.<x,y,z> = QQ[]

I = R.ideal(x^2, x*y)
I.primary_decomposition()
I.associated_primes()

J = R.ideal(x*y, x*z, y*z)
J.primary_decomposition()
J.associated_primes()

K = R.ideal(x^2 - y*z, x*y - x*z)
K.primary_decomposition()

R2.<x,y> = ZZ[]
I2 = R2.ideal(6*x, 10*y)
I2.primary_decomposition()

R3 = ZZ
I3 = R3.ideal(360)
I3.primary_decomposition()
```

---

## Summary / Key Takeaways

- **Associated primes** $\operatorname{Ass}(M)$: primes có dạng $\operatorname{Ann}(m)$ với $m \in M$; luôn không rỗng và hữu hạn khi $R$ Noetherian, $M$ hữu hạn sinh.
- **Primary decomposition**: $\mathfrak{a} = \mathfrak{q}_1 \cap \cdots \cap \mathfrak{q}_n$ với mỗi $\mathfrak{q}_i$ primary — tổng quát hóa phân tích nhân tử nguyên tố.
- **Lasker–Noether**: mọi ideal trong Noetherian ring đều có primary decomposition tối giản.
- **Tính duy nhất thứ nhất**: tập $\{\sqrt{\mathfrak{q}_i}\} = \operatorname{Ass}(R/\mathfrak{a})$ duy nhất (không phụ thuộc phân tích).
- **Tính duy nhất thứ hai**: isolated components (ứng với prime cực tiểu) duy nhất; embedded components không duy nhất.
- **Isolated component** $\mathfrak{q}_j$: tính qua localization $\mathfrak{q}_j = S^{-1}\mathfrak{a} \cap R$ với $S = R \setminus \mathfrak{p}_j$.
- **Hình học**: associated primes ứng với các thành phần bất khả quy của $V(\mathfrak{a})$; embedded primes ứng với "dày lên" tại các thành phần nhỏ hơn.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 4.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 3.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 18–19.
- Matsumura, H. *Commutative Ring Theory*, §6.
