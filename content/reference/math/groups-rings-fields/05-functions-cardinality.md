---
title: "05. Functions, Cardinality, and Counting"
type: math-component
tags: [math, groups-rings-fields, foundations, functions, cardinality, lesson-05]
aliases: [Functions, Cardinality, Counting]
created: 2026-05-15
---

> **Prerequisites**: [[01-sets\|01. Sets and Set Operations]], [[02-logic\|02. Propositional and Predicate Logic]], [[03-proof-techniques\|03. Proof Techniques]], [[04-relations\|04. Relations]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{N}$ | Tập số tự nhiên $\{0, 1, 2, \ldots\}$ |
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathcal{P}(A)$ | Tập lũy thừa của $A$ |
> | $A \times B$ | Tích Descartes |
> | $\emptyset$ | Tập rỗng |
> | $\sim$ | Quan hệ tương đương (trong ngữ cảnh lực lượng) |
> | $\gcd(a,b)$ | Ước chung lớn nhất |

---

> **Objectives**:
> - Hiểu định nghĩa hình thức của hàm như là quan hệ đặc biệt
> - Phân biệt đơn ánh, toàn ánh, song ánh và nắm tính chất của chúng
> - Thành thạo phép hợp và hàm ngược
> - Hiểu ảnh và tạo ảnh của tập hợp
> - Nắm khái niệm lực lượng (cardinality), tập đếm được và không đếm được
> - Hiểu các phép toán cơ bản trên lực lượng vô hạn

---

## Motivation

Hàm số (function) là khái niệm trung tâm của toàn bộ toán học. Trong đại số, các **đồng cấu** (homomorphism) và **đẳng cấu** (isomorphism) đều là những hàm số đặc biệt bảo toàn cấu trúc. Hiểu rõ hàm số ở mức chính xác (đặc biệt là phân biệt đơn ánh/toàn ánh/song ánh) là nền tảng không thể thiếu. Phần cardinality giới thiệu ý tưởng so sánh "kích thước" của các tập hợp vô hạn — một trong những phát hiện sâu sắc nhất của Cantor.

---

## 1. Hàm (Functions)

> [!definition] Definition 5.1 — Hàm (Function)
> Cho $A$ và $B$ là hai tập hợp. Một **hàm** (function / map) $f: A \to B$ là một quan hệ $f \subseteq A \times B$ sao cho với mỗi $a \in A$, tồn tại **đúng một** $b \in B$ sao cho $(a, b) \in f$. Ta viết $f(a) = b$.
>
> - $A$: **miền xác định** (domain).
> - $B$: **miền đối** (codomain).
> - $f(A) = \{f(a) \mid a \in A\}$: **miền giá trị** (image / range), luôn $f(A) \subseteq B$.

> [!note] Remark 5.2 — Sự khác biệt giữa codomain và image
> Codomain $B$ là tập hợp ta "hứa hẹn" rằng đầu ra nằm trong đó. Image $f(A)$ là tập hợp các đầu ra thực sự. Chúng có thể khác nhau: $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$ có codomain $\mathbb{R}$ nhưng image $[0, \infty)$.

> [!example] Example 5.3
> - $f: \mathbb{Z} \to \mathbb{Z}$, $f(n) = 2n$: mỗi số nguyên cho ra số nguyên chẵn.
> - $g: \mathbb{R} \to \mathbb{R}$, $g(x) = x^2$: hàm bình phương.
> - $h: \{1, 2, 3\} \to \{a, b\}$, $h(1) = a$, $h(2) = b$, $h(3) = a$: hàm hữu hạn.

---

## 2. Đơn ánh, Toàn ánh, Song ánh (Injective, Surjective, Bijective)

> [!definition] Definition 5.4
> Cho $f: A \to B$.
>
> - $f$ là **đơn ánh** (injective / one-to-one) nếu:
>
> $$
> \forall a_1, a_2 \in A: f(a_1) = f(a_2) \implies a_1 = a_2
> $$
>
> Tương đương: $a_1 \neq a_2 \implies f(a_1) \neq f(a_2)$ (các phần tử khác nhau cho ảnh khác nhau).
>
> - $f$ là **toàn ánh** (surjective / onto) nếu:
>
> $$
> \forall b \in B, \exists a \in A: f(a) = b
> $$
>
> Tương đương: $f(A) = B$ (mọi phần tử của codomain đều có tạo ảnh).
>
> - $f$ là **song ánh** (bijective) nếu $f$ vừa đơn ánh vừa toàn ánh.

> [!example] Example 5.5 — Phân loại hàm
>
> | Hàm | Đơn ánh? | Toàn ánh? |
> |-----|---------|---------|
> | $f: \mathbb{Z} \to \mathbb{Z}$, $f(n) = 2n$ | ✓ | ✗ ($1 \notin f(\mathbb{Z})$) |
> | $g: \mathbb{R} \to \mathbb{R}$, $g(x) = x^2$ | ✗ ($g(-1)=g(1)$) | ✗ ($-1 \notin g(\mathbb{R})$) |
> | $h: \mathbb{R} \to \mathbb{R}$, $h(x) = x^3$ | ✓ | ✓ (song ánh) |
> | $k: \mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}$, $k(m) = [m]$ | ✗ | ✓ |

> [!theorem] Theorem 5.6 — Đặc trưng đơn ánh bằng hàm ngược trái
> $f: A \to B$ đơn ánh khi và chỉ khi tồn tại $g: B \to A$ sao cho $g \circ f = \operatorname{id}_A$.

> [!theorem] Theorem 5.7 — Đặc trưng toàn ánh bằng hàm ngược phải
> $f: A \to B$ toàn ánh khi và chỉ khi tồn tại $g: B \to A$ sao cho $f \circ g = \operatorname{id}_B$.

**Proof của 5.6 ($\Leftarrow$).** Nếu $g \circ f = \operatorname{id}_A$, giả sử $f(a_1) = f(a_2)$. Áp dụng $g$: $g(f(a_1)) = g(f(a_2))$, tức $a_1 = a_2$. Vậy $f$ đơn ánh. $\blacksquare$

---

## 3. Hợp hàm và Hàm ngược (Composition and Inverse)

> [!definition] Definition 5.8 — Hợp hàm (Composition)
> Cho $f: A \to B$ và $g: B \to C$. **Hợp** của $g$ và $f$ là hàm $g \circ f: A \to C$ xác định bởi:
>
> $$
> (g \circ f)(a) = g(f(a)) \quad \forall a \in A
> $$

> [!theorem] Theorem 5.9 — Tính chất của hợp hàm
>
> **(i)** Hợp hàm có tính **kết hợp**: $(h \circ g) \circ f = h \circ (g \circ f)$ (khi tất cả hợp hàm xác định).
>
> **(ii)** Nếu $f$ và $g$ đơn ánh thì $g \circ f$ đơn ánh.
>
> **(iii)** Nếu $f$ và $g$ toàn ánh thì $g \circ f$ toàn ánh.
>
> **(iv)** Nếu $f$ và $g$ song ánh thì $g \circ f$ song ánh.
>
> **(v)** Nếu $g \circ f$ đơn ánh thì $f$ đơn ánh.
>
> **(vi)** Nếu $g \circ f$ toàn ánh thì $g$ toàn ánh.

**Proof của (ii).** Giả sử $(g \circ f)(a_1) = (g \circ f)(a_2)$, tức $g(f(a_1)) = g(f(a_2))$. Vì $g$ đơn ánh: $f(a_1) = f(a_2)$. Vì $f$ đơn ánh: $a_1 = a_2$. $\blacksquare$

> [!definition] Definition 5.10 — Hàm đơn vị và Hàm ngược
> - **Hàm đơn vị** (identity function) trên $A$: $\operatorname{id}_A: A \to A$, $\operatorname{id}_A(a) = a$.
>
> - Nếu $f: A \to B$ là song ánh, **hàm ngược** (inverse function) $f^{-1}: B \to A$ xác định bởi: $f^{-1}(b) = a \iff f(a) = b$.

> [!theorem] Theorem 5.11
> Nếu $f: A \to B$ song ánh thì $f^{-1}$ xác định tốt, là song ánh, và:
>
> $$
> f^{-1} \circ f = \operatorname{id}_A, \qquad f \circ f^{-1} = \operatorname{id}_B
> $$

---

## 4. Ảnh và Tạo ảnh của tập hợp (Image and Preimage)

> [!definition] Definition 5.12 — Ảnh và Tạo ảnh
> Cho $f: A \to B$.
>
> - **Ảnh** (image) của $S \subseteq A$: $f(S) = \{f(a) \mid a \in S\} \subseteq B$.
> - **Tạo ảnh** (preimage / inverse image) của $T \subseteq B$: $f^{-1}(T) = \{a \in A \mid f(a) \in T\} \subseteq A$.

> [!note] Remark 5.13
> Ký hiệu $f^{-1}(T)$ cho tạo ảnh dùng được kể cả khi $f$ không có hàm ngược. Đây là ký hiệu có thể gây nhầm lẫn nhưng rất tiêu chuẩn.

> [!theorem] Theorem 5.14 — Tính chất của ảnh và tạo ảnh
> Cho $f: A \to B$, $S_1, S_2 \subseteq A$, $T_1, T_2 \subseteq B$.
>
> **(i)** $f(S_1 \cup S_2) = f(S_1) \cup f(S_2)$.
>
> **(ii)** $f(S_1 \cap S_2) \subseteq f(S_1) \cap f(S_2)$ (bao hàm thức có thể nghiêm ngặt nếu $f$ không đơn ánh).
>
> **(iii)** $f^{-1}(T_1 \cup T_2) = f^{-1}(T_1) \cup f^{-1}(T_2)$.
>
> **(iv)** $f^{-1}(T_1 \cap T_2) = f^{-1}(T_1) \cap f^{-1}(T_2)$.
>
> **(v)** $f^{-1}(T^c) = (f^{-1}(T))^c$.

> [!example] Example 5.15 — Tạo ảnh hữu ích hơn ảnh
> Cho $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$. Khi đó:
>
> - $f(\{-1, 1\}) = \{1\}$ — thông tin bị mất (không biết $-1$ hay $1$ sinh ra $1$).
> - $f^{-1}(\{1\}) = \{-1, 1\}$ — đầy đủ thông tin.
> - $f^{-1}([-1, 0)) = \emptyset$ — không có $x$ nào cho $x^2 \in [-1, 0)$.

---

## 5. Nguyên lý chuồng chim bồ câu (Pigeonhole Principle)

> [!theorem] Theorem 5.16 — Pigeonhole Principle
> Nếu $m$ đối tượng được phân vào $n$ ngăn (pigeonholes) với $m > n$, thì ít nhất một ngăn chứa từ hai đối tượng trở lên.
>
> Dạng chính xác: Nếu $f: A \to B$ là hàm với $|A| > |B|$ (hữu hạn), thì $f$ không đơn ánh.

> [!example] Example 5.17
> - Trong bất kỳ nhóm $13$ người nào, ít nhất hai người sinh cùng tháng.
> - Trong bất kỳ nhóm $n+1$ số nguyên nào, ít nhất hai số có cùng dư khi chia cho $n$.
> - **Ứng dụng quan trọng**: Nếu $f: A \to A$ là đơn ánh và $|A|$ hữu hạn, thì $f$ là song ánh (vì nếu $f$ không toàn ánh, ta có $|f(A)| < |A|$ nhưng $f: A \to f(A)$ đơn ánh, mâu thuẫn với pigeonhole).

---

## 6. Lực lượng và Tập đếm được (Cardinality)

> [!definition] Definition 5.18 — Tương đẳng lực lượng (Equinumerous)
> Hai tập hợp $A$ và $B$ được gọi là **tương đẳng lực lượng**, viết $A \sim B$ hay $|A| = |B|$, nếu tồn tại một song ánh $f: A \to B$.
>
> Với tập hữu hạn, $|A|$ là số phần tử thông thường. Với tập vô hạn, lực lượng là khái niệm tổng quát hơn (cardinal number).

> [!theorem] Theorem 5.19 — Tương đẳng lực lượng là quan hệ tương đương
> Quan hệ $\sim$ (tương đẳng lực lượng) trên lớp tất cả các tập hợp là quan hệ tương đương:
>
> - *Phản xạ*: $\operatorname{id}_A: A \to A$ là song ánh, nên $A \sim A$.
> - *Đối xứng*: Nếu $f: A \to B$ song ánh thì $f^{-1}: B \to A$ song ánh.
> - *Bắc cầu*: Nếu $f: A \to B$ và $g: B \to C$ song ánh thì $g \circ f: A \to C$ song ánh.

### 6.1 Tập đếm được (Countable Sets)

> [!definition] Definition 5.20 — Tập đếm được
> - Tập $A$ là **hữu hạn** nếu $A \sim \{1, 2, \ldots, n\}$ với một $n \in \mathbb{N}$, hoặc $A = \emptyset$.
> - Tập $A$ là **đếm được vô hạn** (countably infinite) nếu $A \sim \mathbb{N}$.
> - Tập $A$ là **đếm được** (countable) nếu $A$ hữu hạn hoặc đếm được vô hạn.
> - Tập $A$ là **không đếm được** (uncountable) nếu $A$ không đếm được.

> [!theorem] Theorem 5.21 — $\mathbb{Z}$ và $\mathbb{Q}$ đếm được
>
> **(i)** $\mathbb{Z}$ đếm được vô hạn.
>
> **(ii)** $\mathbb{Z} \times \mathbb{Z}$ đếm được.
>
> **(iii)** $\mathbb{Q}$ đếm được vô hạn.

**Proof của (i).** Xét $f: \mathbb{N} \to \mathbb{Z}$ định nghĩa bởi:

$$
f(n) = \begin{cases} n/2 & \text{nếu } n \text{ chẵn} \\ -(n+1)/2 & \text{nếu } n \text{ lẻ} \end{cases}
$$

Khi đó $f(0) = 0$, $f(1) = -1$, $f(2) = 1$, $f(3) = -2$, $f(4) = 2$, ... Song ánh $\mathbb{N} \to \mathbb{Z}$. $\blacksquare$

**Proof phác thảo của (ii).** Sắp xếp $\mathbb{Z} \times \mathbb{Z}$ theo đường chéo (diagonal enumeration): $(0,0), (1,0), (0,1), (-1,0), (0,-1), (1,1), \ldots$ Đây là ý tưởng của Cantor.

**Proof phác thảo của (iii).** $\mathbb{Q} = \{p/q \mid p \in \mathbb{Z}, q \in \mathbb{N}^+, \gcd(|p|,q)=1\}$ có thể nhúng vào $\mathbb{Z} \times \mathbb{N}^+$ (đếm được), nên $\mathbb{Q}$ đếm được. $\blacksquare$

### 6.2 $\mathbb{R}$ không đếm được — Đối số đường chéo Cantor

> [!theorem] Theorem 5.22 — $\mathbb{R}$ không đếm được
> Tập hợp số thực $\mathbb{R}$ (hay cụ thể hơn, khoảng $(0, 1)$) là không đếm được.

**Proof** (Cantor's diagonal argument). Giả sử ngược lại, $(0, 1)$ đếm được, tức có thể liệt kê các phần tử: $x_1, x_2, x_3, \ldots$ Viết mỗi $x_i$ dưới dạng thập phân:

$$
x_1 = 0.d_{11}\, d_{12}\, d_{13}\, \ldots
$$

$$
x_2 = 0.d_{21}\, d_{22}\, d_{23}\, \ldots
$$

$$
x_3 = 0.d_{31}\, d_{32}\, d_{33}\, \ldots
$$

Xây dựng $y = 0.e_1 e_2 e_3 \ldots$ trong đó $e_i \neq d_{ii}$, $e_i \in \{1, 2\}$ (chọn $e_i = 1$ nếu $d_{ii} \neq 1$, ngược lại $e_i = 2$). Thì $y \in (0, 1)$ nhưng $y \neq x_i$ với mọi $i$ (vì $y$ và $x_i$ khác ở chữ số thứ $i$). Mâu thuẫn. $\blacksquare$

> [!theorem] Theorem 5.23 — Cantor–Schröder–Bernstein
> Nếu tồn tại đơn ánh $f: A \to B$ và đơn ánh $g: B \to A$, thì tồn tại song ánh $h: A \to B$.
>
> Nói cách khác: $|A| \leq |B|$ và $|B| \leq |A|$ suy ra $|A| = |B|$.

> [!note] Remark 5.24
> Định lý Cantor–Schröder–Bernstein cho phép chứng minh $|A| = |B|$ bằng cách xây dựng hai đơn ánh, thay vì phải tìm trực tiếp một song ánh — đôi khi dễ hơn đáng kể.

> [!example] Example 5.25 — $|(0,1)| = |\mathbb{R}|$
> - Đơn ánh $(0,1) \hookrightarrow \mathbb{R}$: hàm bao hàm $x \mapsto x$.
> - Đơn ánh $\mathbb{R} \hookrightarrow (0,1)$: $x \mapsto \frac{1}{\pi}\arctan(x) + \frac{1}{2}$.
>
> Theo CSB, $|(0,1)| = |\mathbb{R}|$.

---

## 7. Số học lực lượng (Cardinal Arithmetic)

> [!definition] Definition 5.26 — Các phép toán trên lực lượng
> Cho $\kappa = |A|$ và $\lambda = |B|$ với $A \cap B = \emptyset$ (có thể giả định bằng cách thay $B$ bởi $B \times \{0\}$). Định nghĩa:
>
> - **Cộng**: $\kappa + \lambda = |A \cup B|$ (hợp rời — disjoint union).
> - **Nhân**: $\kappa \cdot \lambda = |A \times B|$.
> - **Lũy thừa**: $\kappa^{\lambda} = |A^B| = |\{f \mid f: B \to A\}|$.

> [!theorem] Theorem 5.27 — Số học lực lượng vô hạn cơ bản
> Cho $\aleph_0 = |\mathbb{N}|$ (đọc là "aleph-null"). Với mọi $n \in \mathbb{N}^+$:
>
> **(i)** $\aleph_0 + n = \aleph_0$ và $\aleph_0 + \aleph_0 = \aleph_0$.
>
> **(ii)** $n \cdot \aleph_0 = \aleph_0$ và $\aleph_0 \cdot \aleph_0 = \aleph_0$.
>
> **(iii)** $2^{\aleph_0} = |\mathbb{R}| = \mathfrak{c}$ (lực lượng của continuum).

**Proof phác thảo.**
*(i)* $\aleph_0 + \aleph_0 = |\mathbb{N} \cup (\mathbb{N} \times \{1\})| = |\{0, 2, 4, \ldots\} \cup \{1, 3, 5, \ldots\}| = |\mathbb{N}| = \aleph_0$.

*(ii)* $\aleph_0 \cdot \aleph_0 = |\mathbb{N} \times \mathbb{N}|$. Đường chéo Cantor cho song ánh $\mathbb{N} \times \mathbb{N} \sim \mathbb{N}$.

*(iii)* Mỗi $f: \mathbb{N} \to \{0, 1\}$ tương ứng với một tập con của $\mathbb{N}$, tức $|\mathcal{P}(\mathbb{N})| = 2^{\aleph_0}$. Cantor chứng minh $2^{\aleph_0} = |\mathbb{R}|$. $\blacksquare$

> [!note] Remark 5.28 — Giả thuyết Continuum (CH)
> Cantor đặt câu hỏi: có tồn tại tập hợp $A$ sao cho $\aleph_0 < |A| < \mathfrak{c}$ không? **Giả thuyết Continuum** (Continuum Hypothesis — CH) khẳng định là **không**. Gödel (1940) chứng minh CH không thể bị bác bỏ từ ZFC; Cohen (1963) chứng minh CH không thể được chứng minh từ ZFC. Vậy CH **độc lập** với ZFC — một trong những kết quả sâu sắc nhất của logic toán thế kỷ 20.

> [!theorem] Theorem 5.29 — Định lý Cantor
> Với mọi tập $A$: $|A| < |\mathcal{P}(A)|$. Tức là tồn tại đơn ánh $A \hookrightarrow \mathcal{P}(A)$ nhưng không tồn tại song ánh.

**Proof.** Đơn ánh hiển nhiên: $a \mapsto \{a\}$. Giả sử tồn tại song ánh $f: A \to \mathcal{P}(A)$. Xét $B = \{a \in A \mid a \notin f(a)\}$. Vì $f$ toàn ánh, tồn tại $b \in A$ sao cho $f(b) = B$. Hỏi: $b \in B$? Nếu $b \in B$ thì $b \notin f(b) = B$, mâu thuẫn. Nếu $b \notin B$ thì $b \in f(b) = B$, mâu thuẫn. Vậy $f$ không thể tồn tại. $\blacksquare$

---

## 8. Phân cấp vô hạn

> [!note] Remark 5.30 — Phân cấp lực lượng (Cantor)
> Từ Theorem 5.29, ta có một phân cấp vô hạn các lực lượng:
>
> $$
> |\mathbb{N}| < |\mathcal{P}(\mathbb{N})| = |\mathbb{R}| < |\mathcal{P}(\mathbb{R})| < |\mathcal{P}(\mathcal{P}(\mathbb{R}))| < \cdots
> $$
>
> Tồn tại vô số mức độ vô cùng khác nhau. Ký hiệu $\aleph_1, \aleph_2, \ldots$ cho các lực lượng vô hạn tiếp theo (theo thứ tự của các ordinal).

---

## SageMath Cheatsheet — Bài 05

```sage
# Kiểm tra song ánh trong trường hợp hữu hạn
def is_injective(f, domain):
    images = [f(x) for x in domain]
    return len(images) == len(set(images))

def is_surjective(f, domain, codomain):
    images = set(f(x) for x in domain)
    return images == set(codomain)

# Ví dụ: f(n) = 2n trên {0,1,2,3,4}
domain = list(range(5))
codomain = list(range(10))
f = lambda n: 2*n
print("f(n)=2n đơn ánh:", is_injective(f, domain))
print("f(n)=2n toàn ánh lên {0..9}:", is_surjective(f, domain, codomain))

# Hợp hàm
g = lambda n: n + 1
fog = lambda n: f(g(n))
gof = lambda n: g(f(n))

# Ảnh và tạo ảnh
S = {-2, -1, 0, 1, 2}
h = lambda x: x**2
image_S = {h(x) for x in S}
T = {0, 1, 4}
preimage_T = {x for x in range(-5, 6) if h(x) in T}
print("h(S):", image_S)
print("h^{-1}(T):", preimage_T)

# Đường chéo Cantor trực quan
N = 10
diag = [(i, j) for s in range(N) for i in range(s+1) for j in range(s+1) if i+j==s]
print("Đường chéo NxN:", diag[:15])

# Xác minh |P({1..n})| = 2^n
for n in range(1, 7):
    p = len(list(Subsets(range(1, n+1))))
    print(f"|P({{1..{n}}})| = {p} = 2^{n} = {2**n}")
```

---

## Summary — Lesson 05

- **Hàm** $f: A \to B$ là quan hệ "mỗi phần tử có đúng một ảnh".
- **Đơn ánh**: phần tử khác nhau cho ảnh khác nhau. **Toàn ánh**: mọi phần tử codomain có tạo ảnh. **Song ánh**: cả hai.
- **Hợp hàm** có tính kết hợp. Hợp của hai song ánh là song ánh.
- **Hàm ngược** $f^{-1}$ tồn tại và duy nhất khi $f$ song ánh.
- **Ảnh** $f(S)$: ảnh của tập hợp. **Tạo ảnh** $f^{-1}(T)$ bảo toàn phép hợp, giao, bù.
- **Pigeonhole**: nếu $|A| > |B|$, không thể có đơn ánh $A \to B$.
- **Lực lượng**: $|A| = |B| \iff$ tồn tại song ánh. $\mathbb{Z}, \mathbb{Q}$ đếm được. $\mathbb{R}$ không đếm được (đối số đường chéo Cantor).
- **Cantor–Schröder–Bernstein**: $|A| \leq |B|$ và $|B| \leq |A|$ $\implies$ $|A| = |B|$.
- **Số học lực lượng**: $\aleph_0 + \aleph_0 = \aleph_0$, $\aleph_0 \cdot \aleph_0 = \aleph_0$, $2^{\aleph_0} = \mathfrak{c}$.
- **Định lý Cantor**: $|A| < |\mathcal{P}(A)|$ — dẫn đến phân cấp vô hạn các lực lượng.
- **Giả thuyết Continuum**: độc lập với ZFC (Gödel 1940, Cohen 1963).
