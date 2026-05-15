---
title: "02. Propositional and Predicate Logic"
type: math-component
tags: [math, groups-rings-fields, foundations, logic, lesson-02]
aliases: [Propositional and Predicate Logic]
created: 2026-05-15
---

> **Prerequisites**: [[01-sets\|01. Sets and Set Operations]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{N}$ | Tập số tự nhiên |
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{R}$ | Tập số thực |
> | $\in$ | Quan hệ thuộc |
> | $\emptyset$ | Tập rỗng |

> **Objectives**:
> - Hiểu cú pháp và ngữ nghĩa của logic mệnh đề
> - Xây dựng và phân tích bảng chân trị
> - Nắm vững các tương đương logic quan trọng
> - Sử dụng lượng từ $\forall$ và $\exists$ một cách chính xác
> - Phủ định các câu có lượng từ — kỹ năng thiết yếu khi viết chứng minh

---

## Motivation

Khi viết toán học, ta liên tục đưa ra các **khẳng định** (claims) và cần lý luận về tính đúng/sai của chúng. Logic cung cấp ngôn ngữ chính xác để làm điều này. Một câu như "Nếu $n$ là số nguyên tố lớn hơn $2$ thì $n$ lẻ" là một **mệnh đề** (proposition) — nó có giá trị chân lý xác định. Hiểu cấu trúc logic giúp ta đọc và viết chứng minh chính xác hơn, đặc biệt là biết khi nào cần phủ định một khẳng định.

---

## 1. Logic mệnh đề (Propositional Logic)

> [!definition] Definition 2.1 — Mệnh đề (Proposition)
> Một **mệnh đề** (proposition hay statement) là một câu khẳng định có giá trị chân lý xác định: hoặc **đúng** (true, ký hiệu $\top$ hay T) hoặc **sai** (false, ký hiệu $\bot$ hay F). Mệnh đề thường được ký hiệu bởi các chữ cái $P$, $Q$, $R$, ...

> [!example] Example 2.2
> - "$2 + 2 = 4$" — mệnh đề đúng.
> - "$\sqrt{2}$ là số hữu tỷ" — mệnh đề sai.
> - "$x > 0$" — **không** phải mệnh đề (giá trị chân lý phụ thuộc vào $x$); đây là **vị từ** (predicate).
> - "Hãy đóng cửa lại!" — không phải mệnh đề (câu cầu khiến).

### 1.1 Liên kết logic (Logical Connectives)

> [!definition] Definition 2.3 — Các liên kết logic cơ bản
> Cho $P$ và $Q$ là hai mệnh đề. Ta định nghĩa:
>
> | Liên kết | Ký hiệu | Đọc là | Giải thích |
> |---------|---------|--------|-----------|
> | Phủ định (Negation) | $\lnot P$ | "không $P$" | Đúng khi $P$ sai |
> | Hội (Conjunction) | $P \land Q$ | "$P$ và $Q$" | Đúng khi cả $P$ và $Q$ đúng |
> | Tuyển (Disjunction) | $P \lor Q$ | "$P$ hoặc $Q$" | Đúng khi ít nhất một trong hai đúng |
> | Kéo theo (Implication) | $P \to Q$ | "Nếu $P$ thì $Q$" | Sai khi $P$ đúng và $Q$ sai |
> | Tương đương (Biconditional) | $P \leftrightarrow Q$ | "$P$ khi và chỉ khi $Q$" | Đúng khi $P$ và $Q$ cùng giá trị |

### 1.2 Bảng chân trị (Truth Tables)

Bảng chân trị liệt kê giá trị của một biểu thức phức hợp cho tất cả các tổ hợp giá trị của các biến.

| $P$ | $Q$ | $\lnot P$ | $P \land Q$ | $P \lor Q$ | $P \to Q$ | $P \leftrightarrow Q$ |
|-----|-----|-----------|------------|-----------|----------|----------------------|
| T | T | F | T | T | T | T |
| T | F | F | F | T | F | F |
| F | T | T | F | T | T | F |
| F | F | T | F | F | T | T |

> [!note] Remark 2.4 — Về phép kéo theo $P \to Q$
> Dòng thứ ba ($P$ sai, $Q$ đúng) và dòng thứ tư ($P$ sai, $Q$ sai) đều cho $P \to Q$ đúng. Đây thường gây bối rối ban đầu. Giải thích: mệnh đề "$P \to Q$" chỉ đưa ra cam kết khi $P$ đúng. Nếu $P$ sai, cam kết không bị vi phạm — mệnh đề đúng một cách **vacuously** (tầm thường). Ví dụ: "Nếu $1 = 2$ thì mặt trăng làm bằng phô mai" là đúng về mặt logic (vì vế trái sai).
>
> Trong $P \to Q$: $P$ gọi là **giả thiết** (hypothesis/antecedent), $Q$ gọi là **kết luận** (conclusion/consequent).

> [!note] Remark 2.5 — Tuyển "hoặc" trong toán học
> Trong toán học, "hoặc" là **tuyển bao** (inclusive or): "$P$ hoặc $Q$" đúng khi $P$ đúng, $Q$ đúng, hoặc cả hai cùng đúng. Khác với "hoặc" trong ngôn ngữ hàng ngày đôi khi mang nghĩa độc quyền (exclusive or).

### 1.3 Tautology, Contradiction, Contingency

> [!definition] Definition 2.6
> - **Tautology** (Hằng đúng): biểu thức đúng với mọi tổ hợp giá trị của các biến. Ví dụ: $P \lor \lnot P$.
> - **Contradiction** (Hằng sai / Mâu thuẫn): biểu thức sai với mọi tổ hợp. Ví dụ: $P \land \lnot P$.
> - **Contingency** (Ngẫu nhiên): biểu thức đúng với một số tổ hợp, sai với một số tổ hợp.

---

## 2. Tương đương logic (Logical Equivalences)

> [!definition] Definition 2.7 — Tương đương logic
> Hai biểu thức logic $P$ và $Q$ là **tương đương logic**, viết $P \equiv Q$ hay $P \Leftrightarrow Q$, nếu $P \leftrightarrow Q$ là tautology, tức là chúng có cùng giá trị chân lý trong mọi trường hợp.

> [!theorem] Theorem 2.8 — Bảng tương đương logic quan trọng
> Cho $P$, $Q$, $R$ là các mệnh đề. Các tương đương sau đây đều là tautology:
>
> **(i) Giao hoán**:
> $$P \land Q \equiv Q \land P, \quad P \lor Q \equiv Q \lor P$$
>
> **(ii) Kết hợp**:
> $$
> (P \land Q) \land R \equiv P \land (Q \land R), \quad (P \lor Q) \lor R \equiv P \lor (Q \lor R)
> $$
>
> **(iii) Phân phối**:
> $$
> P \land (Q \lor R) \equiv (P \land Q) \lor (P \land R)
> $$
> $$
> P \lor (Q \land R) \equiv (P \lor Q) \land (P \lor R)
> $$
>
> **(iv) De Morgan**:
> $$
> \lnot(P \land Q) \equiv \lnot P \lor \lnot Q, \quad \lnot(P \lor Q) \equiv \lnot P \land \lnot Q
> $$
>
> **(v) Phủ định kép**:
> $$
> \lnot(\lnot P) \equiv P
> $$
>
> **(vi) Xuất nhập đề**:
> $$
> (P \to Q) \equiv (\lnot P \lor Q) \equiv (\lnot Q \to \lnot P)
> $$
>
> **(vii) Phân rã tương đương**:
> $$
> (P \leftrightarrow Q) \equiv (P \to Q) \land (Q \to P)
> $$

> [!example] Example 2.9 — Chứng minh tương đương bằng bảng chân trị
> Kiểm tra $(P \to Q) \equiv (\lnot Q \to \lnot P)$ (Contrapositive):
>
> | $P$ | $Q$ | $\lnot P$ | $\lnot Q$ | $P \to Q$ | $\lnot Q \to \lnot P$ |
> |-----|-----|-----------|-----------|----------|----------------------|
> | T | T | F | F | T | T |
> | T | F | F | T | F | F |
> | F | T | T | F | T | T |
> | F | F | T | T | T | T |
>
> Hai cột cuối giống hệt nhau — tương đương được chứng minh.

> [!definition] Definition 2.10 — Các câu liên quan đến $P \to Q$
> Với mệnh đề $P \to Q$ ("nếu $P$ thì $Q$"):
>
> | Tên | Dạng | Tương đương với gốc? |
> |-----|------|---------------------|
> | Gốc (Original) | $P \to Q$ | — |
> | Đảo (Converse) | $Q \to P$ | Không |
> | Phủ đảo (Inverse) | $\lnot P \to \lnot Q$ | Không |
> | Đảo phủ (Contrapositive) | $\lnot Q \to \lnot P$ | Có |

> [!warning] Counterexample 2.11 — Đảo không tương đương gốc
> "Nếu $n$ chia hết cho $4$ thì $n$ chia hết cho $2$" là đúng.
> Đảo của nó: "Nếu $n$ chia hết cho $2$ thì $n$ chia hết cho $4$" là **sai** ($n=6$).

---

## 3. Logic vị từ (Predicate Logic)

> [!definition] Definition 2.12 — Vị từ (Predicate)
> Một **vị từ** (predicate) $P(x)$ là một câu chứa biến $x$ sao cho khi thay $x$ bằng một giá trị cụ thể, ta được một mệnh đề. Ví dụ: "$P(x): x^2 > 0$" — với $x = 2$ cho mệnh đề đúng, với $x = 0$ cho mệnh đề sai.

### 3.1 Lượng từ (Quantifiers)

> [!definition] Definition 2.13 — Lượng từ toàn thể và tồn tại
> Cho vị từ $P(x)$ với biến $x$ thuộc miền $D$:
>
> - **Lượng từ toàn thể** (Universal quantifier): $\forall x \in D: P(x)$
>   Đọc: "Với mọi $x$ trong $D$, $P(x)$ đúng."
>   Đúng $\iff$ $P(x)$ đúng với **mọi** $x \in D$.
>
> - **Lượng từ tồn tại** (Existential quantifier): $\exists x \in D: P(x)$
>   Đọc: "Tồn tại $x$ trong $D$ sao cho $P(x)$ đúng."
>   Đúng $\iff$ $P(x)$ đúng với **ít nhất một** $x \in D$.

> [!example] Example 2.14
> Cho $D = \mathbb{Z}$, $P(x): x^2 = 1$.
>
> - $\forall x \in \mathbb{Z}: x^2 = 1$ — **Sai** (phản ví dụ: $x = 2$).
> - $\exists x \in \mathbb{Z}: x^2 = 1$ — **Đúng** ($x = 1$ hoặc $x = -1$).

### 3.2 Phủ định lượng từ (Negation of Quantifiers)

Đây là kỹ năng **cực kỳ quan trọng** khi viết chứng minh, đặc biệt là chứng minh phản chứng.

> [!theorem] Theorem 2.15 — Phủ định lượng từ
>
> $$
> \lnot(\forall x \in D: P(x)) \equiv \exists x \in D: \lnot P(x)
> $$
>
> $$
> \lnot(\exists x \in D: P(x)) \equiv \forall x \in D: \lnot P(x)
> $$

> [!example] Example 2.16 — Phủ định các mệnh đề toán học
>
> | Mệnh đề gốc | Phủ định |
> |------------|---------|
> | $\forall x \in \mathbb{R}: x^2 \geq 0$ | $\exists x \in \mathbb{R}: x^2 < 0$ |
> | $\exists n \in \mathbb{N}: n^2 = 2$ | $\forall n \in \mathbb{N}: n^2 \neq 2$ |
> | $\forall \varepsilon > 0, \exists \delta > 0: \lvert x - a \rvert < \delta \to \lvert f(x) - L \rvert < \varepsilon$ | $\exists \varepsilon > 0, \forall \delta > 0: \lvert x - a \rvert < \delta \land \lvert f(x) - L \rvert \geq \varepsilon$ |

> [!note] Remark 2.17 — Thứ tự của lượng từ
> Thứ tự của các lượng từ **quan trọng** khi các lượng từ khác nhau xuất hiện kế tiếp nhau:
>
> - $\forall x \in \mathbb{R}, \exists y \in \mathbb{R}: y > x$ — **Đúng**: với mọi $x$, ta lấy $y = x + 1$.
> - $\exists y \in \mathbb{R}, \forall x \in \mathbb{R}: y > x$ — **Sai**: không có số thực nào lớn hơn mọi số thực.

### 3.3 Phủ định mệnh đề phức hợp có lượng từ

> [!example] Example 2.18
> Phủ định: "$\forall x \in \mathbb{Z}, \exists y \in \mathbb{Z}: x + y = 0$"
>
> Phủ định: $\exists x \in \mathbb{Z}, \forall y \in \mathbb{Z}: x + y \neq 0$
>
> Mệnh đề gốc đúng (với $y = -x$). Phủ định sai.

---

## 4. Biến tự do và biến bị ràng buộc (Free and Bound Variables)

> [!definition] Definition 2.19
> Trong biểu thức $\forall x \in D: P(x)$ hay $\exists x \in D: P(x)$, biến $x$ được gọi là **biến bị ràng buộc** (bound variable). Một biến không bị ràng buộc bởi lượng từ nào được gọi là **biến tự do** (free variable).
>
> Một biểu thức có giá trị chân lý xác định khi và chỉ khi nó không có biến tự do.

> [!example] Example 2.20
> - "$\forall x \in \mathbb{R}: x^2 + 1 > 0$" — $x$ bị ràng buộc, biểu thức là mệnh đề (đúng).
> - "$x^2 + 1 > 0$" — $x$ tự do, đây là vị từ, không có giá trị chân lý cố định.
> - "$\exists x \in \mathbb{R}: x > y$" — $x$ bị ràng buộc, $y$ tự do; đây là vị từ theo $y$.

---

## SageMath Cheatsheet — Bài 02

```python
# SageMath không có hệ thống logic hình thức đầy đủ,
# nhưng ta có thể kiểm tra bảng chân trị thủ công

# Định nghĩa hàm boolean
def implies(p, q):
    return (not p) or q

def iff(p, q):
    return implies(p, q) and implies(q, p)

# Kiểm tra tautology: P → Q ≡ ¬Q → ¬P
for P in [True, False]:
    for Q in [True, False]:
        lhs = implies(P, Q)
        rhs = implies(not Q, not P)
        print(f"P={P}, Q={Q}: P->Q={lhs}, contrapos={rhs}, equiv={lhs == rhs}")

# Kiểm tra De Morgan: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q
for P in [True, False]:
    for Q in [True, False]:
        lhs = not (P and Q)
        rhs = (not P) or (not Q)
        print(f"P={P}, Q={Q}: De Morgan OK: {lhs == rhs}")
```

---

## Summary — Lesson 02

- **Mệnh đề** có giá trị chân lý xác định (T hoặc F). **Vị từ** chứa biến tự do.
- **Các liên kết**: $\lnot$ (phủ định), $\land$ (hội), $\lor$ (tuyển bao), $\to$ (kéo theo), $\leftrightarrow$ (tương đương).
- $P \to Q$ chỉ sai khi $P$ đúng và $Q$ sai. Kéo theo vacuously true khi giả thiết sai.
- **Contrapositive** $\lnot Q \to \lnot P$ tương đương với $P \to Q$. **Converse** $Q \to P$ **không** tương đương.
- **De Morgan**: $\lnot(P \land Q) \equiv \lnot P \lor \lnot Q$; $\lnot(P \lor Q) \equiv \lnot P \land \lnot Q$.
- **Lượng từ**: $\forall$ (toàn thể), $\exists$ (tồn tại). Thứ tự lượng từ khác nhau quan trọng.
- **Phủ định lượng từ**: $\lnot \forall \equiv \exists \lnot$; $\lnot \exists \equiv \forall \lnot$.
