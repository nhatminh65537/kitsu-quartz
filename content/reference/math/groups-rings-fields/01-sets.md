---
title: "01. Sets and Set Operations"
type: math-component
tags: [math, groups-rings-fields, foundations, set-theory, lesson-01]
aliases: [Sets and Set Operations]
created: 2026-05-15
---

> **Prerequisites**: Không có — đây là bài đầu tiên
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{N}$ | Tập số tự nhiên $\{0, 1, 2, \ldots\}$ |
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{R}$ | Tập số thực |
> | $\in$ | Quan hệ thuộc (element of) |

> **Objectives**:
> - Nắm vững ngôn ngữ tập hợp ở mức chính xác toán học
> - Phân biệt các phép toán trên tập hợp và tính chất của chúng
> - Hiểu tích Descartes và họ tập hợp có chỉ số
> - Vận dụng các đẳng thức tập hợp (De Morgan, phân phối, v.v.)

---

## Motivation

Toán học hiện đại được xây dựng trên một ngôn ngữ chung: ngôn ngữ **tập hợp** (set). Trước khi bàn đến nhóm, vành hay trường, ta cần một nền tảng vững chắc về tập hợp — vì mọi cấu trúc đại số đều là một tập hợp được trang bị thêm các phép toán và tính chất.

Lý thuyết tập hợp ngây thơ (naive set theory), do Georg Cantor (1845–1918) xây dựng, cung cấp đủ công cụ cho toàn bộ khóa học này. Ta chấp nhận trực giác "tập hợp là một bộ sưu tập các đối tượng" mà không đi sâu vào các hệ tiên đề hình thức (như ZFC).

---

## 1. Tập hợp và ký hiệu (Sets and Notation)

> [!definition] Definition 1.1 — Tập hợp (Set)
> Một **tập hợp** là một bộ sưu tập các đối tượng phân biệt, gọi là các **phần tử** (elements) hay **thành viên** (members) của tập hợp đó. Ta viết $a \in S$ để chỉ $a$ là phần tử của $S$, và $a \notin S$ nếu ngược lại.

Có hai cách ký hiệu tập hợp cơ bản:

**Liệt kê** (roster notation): liệt kê tường minh các phần tử giữa hai dấu ngoặc nhọn.

$$
A = \{1, 2, 3, 4, 5\}, \quad B = \{a, b, c\}, \quad \mathbb{N} = \{0, 1, 2, 3, \ldots\}
$$

**Định nghĩa bằng tính chất** (set-builder notation): mô tả tập hợp thông qua một điều kiện mà phần tử phải thỏa mãn.

$$
C = \{x \in \mathbb{Z} \mid x^2 < 10\} = \{-3, -2, -1, 0, 1, 2, 3\}
$$

$$
D = \{n \in \mathbb{N} \mid n \text{ là số chẵn}\} = \{0, 2, 4, 6, \ldots\}
$$

> [!definition] Definition 1.2 — Tập hợp rỗng (Empty Set)
> **Tập hợp rỗng**, ký hiệu $\emptyset$ hay $\{\}$, là tập hợp không chứa bất kỳ phần tử nào. Với mọi đối tượng $x$, ta có $x \notin \emptyset$.

> [!note] Remark 1.3
> Tập rỗng $\emptyset$ là duy nhất — mọi tập hợp "rỗng" đều là cùng một đối tượng toán học, vì chúng có cùng tập phần tử (không có phần tử nào). Đây là hệ quả của nguyên lý **ngoại diên** (extensionality): hai tập hợp bằng nhau khi và chỉ khi chúng có cùng các phần tử.

> [!definition] Definition 1.4 — Bằng nhau giữa hai tập hợp (Set Equality)
> Hai tập hợp $A$ và $B$ **bằng nhau**, viết $A = B$, khi và chỉ khi chúng có cùng các phần tử:
>
> $$
> A = B \iff (\forall x: x \in A \leftrightarrow x \in B)
> $$

> [!example] Example 1.5
> - $\{1, 2, 3\} = \{3, 1, 2\}$ — thứ tự liệt kê không quan trọng.
> - $\{1, 1, 2\} = \{1, 2\}$ — phần tử không được tính nhiều lần.
> - $\{0\} \neq \emptyset$ — tập hợp chứa một phần tử (là số $0$) khác tập rỗng.
> - $\{∅\} \neq \emptyset$ — tập hợp chứa một phần tử (là tập rỗng) khác tập rỗng.

---

## 2. Tập con (Subsets)

> [!definition] Definition 1.6 — Tập con (Subset)
> Tập hợp $A$ là **tập con** của tập hợp $B$, viết $A \subseteq B$, nếu mọi phần tử của $A$ đều là phần tử của $B$:
>
> $$
> A \subseteq B \iff (\forall x: x \in A \to x \in B)
> $$
>
> Ta nói $A$ là **tập con thực sự** (proper subset) của $B$, viết $A \subsetneq B$, nếu $A \subseteq B$ và $A \neq B$.

> [!theorem] Theorem 1.7 — Đặc trưng bằng nhau qua tập con
> $A = B$ khi và chỉ khi $A \subseteq B$ và $B \subseteq A$.

**Proof.** Theo Definition 1.4, $A = B \iff (\forall x: x \in A \leftrightarrow x \in B)$. Mệnh đề $P \leftrightarrow Q$ tương đương $(P \to Q) \land (Q \to P)$. Do đó $A = B \iff (\forall x: x \in A \to x \in B) \land (\forall x: x \in B \to x \in A) \iff A \subseteq B \land B \subseteq A$. $\blacksquare$

> [!note] Remark 1.8 — Vai trò của tập rỗng
> Với mọi tập hợp $A$, ta có $\emptyset \subseteq A$. Thật vậy, mệnh đề "$\forall x: x \in \emptyset \to x \in A$" là đúng vì mệnh đề giả thiết $x \in \emptyset$ luôn sai (vacuously true).

> [!definition] Definition 1.9 — Tập lũy thừa (Power Set)
> **Tập lũy thừa** (power set) của $A$, ký hiệu $\mathcal{P}(A)$ hay $2^A$, là tập hợp tất cả các tập con của $A$:
>
> $$
> \mathcal{P}(A) = \{B \mid B \subseteq A\}
> $$

> [!example] Example 1.10 — Tính tập lũy thừa
> Cho $A = \{1, 2, 3\}$. Khi đó:
>
> $$
> \mathcal{P}(A) = \bigl\{\emptyset,\, \{1\},\, \{2\},\, \{3\},\, \{1,2\},\, \{1,3\},\, \{2,3\},\, \{1,2,3\}\bigr\}
> $$
>
> Vậy $|\mathcal{P}(A)| = 8 = 2^3$. Tổng quát, nếu $|A| = n$ thì $|\mathcal{P}(A)| = 2^n$ (chứng minh bằng quy nạp hoặc đối số nhị phân).

---

## 3. Các phép toán trên tập hợp (Set Operations)

> [!definition] Definition 1.11 — Các phép toán cơ bản
> Cho $A$ và $B$ là các tập hợp (cùng sống trong một **tập vũ trụ** $U$):
>
> - **Hợp** (Union): $A \cup B = \{x \mid x \in A \lor x \in B\}$
> - **Giao** (Intersection): $A \cap B = \{x \mid x \in A \land x \in B\}$
> - **Hiệu** (Set Difference): $A \setminus B = \{x \mid x \in A \land x \notin B\}$
> - **Phần bù** (Complement): $A^c = U \setminus A = \{x \in U \mid x \notin A\}$
> - **Hiệu đối xứng** (Symmetric Difference): $A \triangle B = (A \setminus B) \cup (B \setminus A)$

> [!example] Example 1.12
> Cho $U = \{1,2,3,4,5,6,7,8\}$, $A = \{1,2,3,4\}$, $B = \{3,4,5,6\}$.
>
> - $A \cup B = \{1,2,3,4,5,6\}$
> - $A \cap B = \{3,4\}$
> - $A \setminus B = \{1,2\}$
> - $B \setminus A = \{5,6\}$
> - $A^c = \{5,6,7,8\}$
> - $A \triangle B = \{1,2,5,6\}$

> [!definition] Definition 1.13 — Tập rời nhau (Disjoint Sets)
> Hai tập hợp $A$ và $B$ được gọi là **rời nhau** (disjoint) nếu $A \cap B = \emptyset$.

> [!theorem] Theorem 1.14 — Các tính chất của phép toán tập hợp
> Cho $A$, $B$, $C$ là các tập hợp trong $U$. Các đẳng thức sau đây đều đúng:
>
> **(i) Giao hoán** (Commutativity):
>
> $$
> A \cup B = B \cup A, \quad A \cap B = B \cap A
> $$
>
> **(ii) Kết hợp** (Associativity):
>
> $$
> (A \cup B) \cup C = A \cup (B \cup C), \quad (A \cap B) \cap C = A \cap (B \cap C)
> $$
>
> **(iii) Phân phối** (Distributivity):
>
> $$
> A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
> $$
>
> $$
> A \cup (B \cap C) = (A \cup B) \cap (A \cup C)
> $$
>
> **(iv) De Morgan**:
>
> $$
> (A \cup B)^c = A^c \cap B^c, \quad (A \cap B)^c = A^c \cup B^c
> $$
>
> **(v) Phần tử trung hòa**:
>
> $$
> A \cup \emptyset = A, \quad A \cap U = A
> $$
>
> **(vi) Phần bù**:
>
> $$
> A \cup A^c = U, \quad A \cap A^c = \emptyset
> $$

**Proof của De Morgan (i).** Ta chứng minh $(A \cup B)^c = A^c \cap B^c$ bằng cách kiểm tra điều kiện thành viên:

$$
x \in (A \cup B)^c \iff x \notin (A \cup B) \iff \lnot(x \in A \lor x \in B)
$$

$$
\iff (x \notin A) \land (x \notin B) \iff x \in A^c \land x \in A^c \cap B^c
$$

Vậy $(A \cup B)^c = A^c \cap B^c$. $\blacksquare$

> [!note] Remark 1.15 — Hiệu đối xứng là phép cộng modulo 2
> Ta có $A \triangle B = (A \cup B) \setminus (A \cap B)$. Hơn nữa, $\triangle$ là giao hoán, kết hợp, và $\emptyset$ là phần tử trung hòa: $A \triangle \emptyset = A$. Mỗi tập hợp là nghịch đảo của chính nó: $A \triangle A = \emptyset$. Do đó $(\mathcal{P}(U), \triangle)$ là một nhóm Abel — đây là ví dụ sẽ gặp lại trong Part I.

---

## 4. Tích Descartes (Cartesian Product)

> [!definition] Definition 1.16 — Cặp có thứ tự (Ordered Pair)
> **Cặp có thứ tự** $(a, b)$ là một đối tượng được xác định bởi: $(a, b) = (c, d) \iff a = c \text{ và } b = d$. Khác với tập hợp $\{a, b\}$, thứ tự quan trọng: $(1, 2) \neq (2, 1)$.

> [!definition] Definition 1.17 — Tích Descartes (Cartesian Product)
> **Tích Descartes** của hai tập hợp $A$ và $B$ là:
>
> $$
> A \times B = \{(a, b) \mid a \in A,\, b \in B\}
> $$
>
> Tổng quát hóa: $A_1 \times A_2 \times \cdots \times A_n = \{(a_1, a_2, \ldots, a_n) \mid a_i \in A_i\}$.

> [!example] Example 1.18
> Cho $A = \{1, 2\}$, $B = \{x, y, z\}$.
>
> $$
> A \times B = \{(1,x),\, (1,y),\, (1,z),\, (2,x),\, (2,y),\, (2,z)\}
> $$
>
> $|A \times B| = 2 \times 3 = 6$. Tổng quát: $|A \times B| = |A| \cdot |B|$.
>
> Chú ý: $A \times B \neq B \times A$ (trừ khi $A = \emptyset$ hoặc $B = \emptyset$ hoặc $A = B$).

> [!note] Remark 1.19
> Ta ký hiệu $A^n = A \times A \times \cdots \times A$ ($n$ lần). Ví dụ: $\mathbb{R}^2 = \mathbb{R} \times \mathbb{R}$ là mặt phẳng Descartes quen thuộc.

---

## 5. Họ tập hợp có chỉ số (Indexed Families)

> [!definition] Definition 1.20 — Họ tập hợp có chỉ số
> Cho $I$ là một tập hợp (gọi là **tập chỉ số**). Một **họ tập hợp có chỉ số** bởi $I$ là một bộ $\{A_i\}_{i \in I}$ trong đó mỗi $i \in I$ tương ứng với một tập hợp $A_i$.
>
> - **Hợp**: $\displaystyle\bigcup_{i \in I} A_i = \{x \mid \exists i \in I: x \in A_i\}$
> - **Giao**: $\displaystyle\bigcap_{i \in I} A_i = \{x \mid \forall i \in I: x \in A_i\}$

> [!example] Example 1.21 — Họ các khoảng trong $\mathbb{R}$
> Cho $I = \mathbb{N}^+ = \{1, 2, 3, \ldots\}$ và $A_n = \left(0, \frac{1}{n}\right) \subseteq \mathbb{R}$.
>
> $$
> \bigcup_{n=1}^{\infty} A_n = (0, 1), \qquad \bigcap_{n=1}^{\infty} A_n = \emptyset
> $$
>
> Giao bằng rỗng vì với mọi $x > 0$, tồn tại $N$ đủ lớn sao cho $\frac{1}{N} < x$, tức $x \notin A_N$.

> [!theorem] Theorem 1.22 — De Morgan tổng quát
> Với mọi họ $\{A_i\}_{i \in I}$:
>
> $$
> \left(\bigcup_{i \in I} A_i\right)^c = \bigcap_{i \in I} A_i^c, \qquad \left(\bigcap_{i \in I} A_i\right)^c = \bigcup_{i \in I} A_i^c
> $$

**Proof.** Ta chứng minh đẳng thức đầu. Với mọi $x$:

$$
x \in \left(\bigcup_{i \in I} A_i\right)^c \iff x \notin \bigcup_{i \in I} A_i \iff \forall i \in I: x \notin A_i \iff \forall i \in I: x \in A_i^c \iff x \in \bigcap_{i \in I} A_i^c
$$

Đẳng thức thứ hai chứng minh tương tự. $\blacksquare$

---

## 6. Phân hoạch (Partitions)

> [!definition] Definition 1.23 — Phân hoạch (Partition)
> Một **phân hoạch** của tập hợp $A$ là một họ $\{A_i\}_{i \in I}$ các tập con **không rỗng** của $A$ sao cho:
>
> 1. $A_i \cap A_j = \emptyset$ với mọi $i \neq j$ (các phần rời nhau)
> 2. $\displaystyle\bigcup_{i \in I} A_i = A$ (các phần phủ hết $A$)
>
> Các $A_i$ được gọi là **các phần** (blocks hay cells) của phân hoạch.

> [!example] Example 1.24
> - Phân hoạch $\mathbb{Z}$ thành số chẵn và số lẻ: $\{\{2k \mid k \in \mathbb{Z}\},\, \{2k+1 \mid k \in \mathbb{Z}\}\}$.
> - Phân hoạch $\mathbb{Z}$ theo dư khi chia cho $3$: $\{[0], [1], [2]\}$ trong đó $[r] = \{n \in \mathbb{Z} \mid n \equiv r \pmod{3}\}$.

---

## SageMath Cheatsheet — Bài 01

```python
# Tạo tập hợp trong SageMath
A = Set([1, 2, 3, 4])
B = Set([3, 4, 5, 6])

# Phép toán cơ bản
A.union(B)             # A ∪ B
A.intersection(B)      # A ∩ B
A.difference(B)        # A \ B
A.symmetric_difference(B)  # A △ B

# Kiểm tra quan hệ
A.issubset(B)          # A ⊆ B?
A.issuperset(B)        # A ⊇ B?

# Tập lũy thừa (cẩn thận với tập lớn)
S = Set([1, 2, 3])
list(S.subsets())      # Liệt kê tất cả tập con

# Tích Descartes
C = Set([1, 2])
D = Set(['a', 'b', 'c'])
cartesian_product([C, D]).list()

# Kích thước
len(A)                 # |A|
```

---

## Summary — Lesson 01

- **Tập hợp** được xác định bởi phần tử của nó (nguyên lý ngoại diên). Hai cách ký hiệu: liệt kê và tập-builder.
- **Tập con**: $A \subseteq B \iff \forall x: x \in A \to x \in B$. Hai tập bằng nhau $\iff$ mỗi tập là tập con của tập kia.
- **Tập lũy thừa** $\mathcal{P}(A)$: tập tất cả tập con của $A$; $|\mathcal{P}(A)| = 2^{|A|}$ khi $A$ hữu hạn.
- **Phép toán**: $\cup$ (hợp), $\cap$ (giao), $\setminus$ (hiệu), complement $(\cdot)^c$, $\triangle$ (hiệu đối xứng).
- **Tính chất**: giao hoán, kết hợp, phân phối, De Morgan (cả dạng hữu hạn lẫn tổng quát).
- **Tích Descartes** $A \times B$: tập các cặp có thứ tự; $|A \times B| = |A| \cdot |B|$.
- **Phân hoạch**: họ các phần không rỗng, rời nhau, phủ hết tập gốc.
