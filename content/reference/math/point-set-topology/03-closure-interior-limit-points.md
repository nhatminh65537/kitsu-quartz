---
title: "03. Closure, Interior, and Limit Points"
tags: [math, point-set-topology, lesson-03]
aliases: [Closure Interior Limit Points]
created: 2026-03-29
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[02-constructing-topologies|02. Constructing Topologies]]
> **Objectives**:
> - Hiểu và tính được closure, interior, boundary của một tập trong không gian topo bất kỳ
> - Nắm khái niệm limit point (điểm tụ) và phân biệt với điểm thuộc tập
> - Biết khi nào một tập là dense (trù mật) và ý nghĩa của nó
> - Hiểu khái niệm hội tụ dãy số trong không gian topo và hạn chế của nó

---

## Motivation / Intuition

Trong Giải tích trên $\mathbb{R}$, ta hay nói "điểm giới hạn", "phần bên trong", "bao đóng" của một tập. Ví dụ: khoảng mở $(0,1)$ có bao đóng $[0,1]$, phần trong là chính nó, và các điểm $0, 1$ là "điểm biên". Những khái niệm này hoàn toàn có thể định nghĩa lại thuần túy qua open sets — không cần $\varepsilon$-$\delta$.

Điều thú vị là khi chuyển sang không gian topo tổng quát, các khái niệm này vẫn sống tốt, nhưng **một số tính chất quen thuộc có thể mất đi**. Ví dụ: trong không gian không Hausdorff, dãy số hội tụ có thể có nhiều hơn một giới hạn! Bài này xây dựng nền tảng của "ngôn ngữ địa phương" trong topology.

---

## Closure (Bao đóng)

### Định nghĩa

> [!definition] Definition 3.1 — Closure (Bao đóng)
> Cho $(X, \mathcal{T})$ là không gian topo và $A \subseteq X$. **Closure** của $A$, ký hiệu $\overline{A}$, là giao của tất cả các **tập đóng** chứa $A$:
>
> $$
> \overline{A} = \bigcap \{ F \subseteq X : F \text{ đóng},\ A \subseteq F \}.
> $$

> [!note] Remark 3.2
> Giao của họ tập đóng là đóng (Theorem 1.9 bài trước), nên $\overline{A}$ luôn là tập đóng. Hơn nữa, $\overline{A}$ là tập đóng **nhỏ nhất** chứa $A$: nếu $F$ đóng và $A \subseteq F$ thì $\overline{A} \subseteq F$.

### Tính chất cơ bản

> [!theorem] Theorem 3.3 — Tính chất của Closure
> Với mọi $A, B \subseteq X$:
>
> 1. $A \subseteq \overline{A}$.
> 2. $\overline{\overline{A}} = \overline{A}$ (idempotent).
> 3. $\overline{A \cup B} = \overline{A} \cup \overline{B}$.
> 4. $\overline{\emptyset} = \emptyset$.
> 5. $A$ đóng $\iff$ $A = \overline{A}$.

**Proof.** (1) $A$ nằm trong mọi tập đóng chứa $A$, nên $A \subseteq \overline{A}$. (2) $\overline{A}$ đã đóng nên closure của nó là chính nó. (3) $\overline{A} \cup \overline{B}$ là tập đóng (hợp hữu hạn của đóng) chứa $A \cup B$, nên $\overline{A \cup B} \subseteq \overline{A} \cup \overline{B}$. Chiều ngược: $A \subseteq A \cup B$ nên $\overline{A} \subseteq \overline{A \cup B}$, tương tự $\overline{B} \subseteq \overline{A \cup B}$. (5) Hiển nhiên từ định nghĩa. $\blacksquare$

> [!warning] Counterexample 3.4 — Giao vô hạn không bảo toàn closure
> Trong $\mathbb{R}$: $\overline{\bigcap_{n=1}^\infty (0, \frac{1}{n})} = \overline{\emptyset} = \emptyset$, nhưng $\bigcap_{n=1}^\infty \overline{(0,\frac{1}{n})} = \bigcap_{n=1}^\infty [0, \frac{1}{n}] = \{0\}$. Vậy $\overline{\bigcap A_n} \neq \bigcap \overline{A_n}$ nói chung — chỉ có bao hàm $\overline{\bigcap A_n} \subseteq \bigcap \overline{A_n}$.

---

## Limit Point (Điểm tụ)

### Định nghĩa

> [!definition] Definition 3.5 — Limit Point (Điểm tụ / Điểm tích lũy)
> Cho $A \subseteq X$. Điểm $x \in X$ gọi là **limit point** (điểm tụ) của $A$ nếu mọi lân cận mở $U$ của $x$ đều giao với $A$ tại một điểm **khác** $x$:
>
> $$
> \forall\, U \in \mathcal{T},\ x \in U \implies (U \setminus \{x\}) \cap A \neq \emptyset.
> $$
>
> Tập tất cả limit points của $A$ gọi là **derived set**, ký hiệu $A'$.

> [!note] Remark 3.6
> Điểm $x$ là limit point của $A$ **không** có nghĩa là $x \in A$. Ví dụ, $x = 0$ là limit point của $(0,1)$ trong $\mathbb{R}$ mặc dù $0 \notin (0,1)$. Ngược lại, $x \in A$ không kéo theo $x$ là limit point: trong discrete topology, $\{x\}$ mở nên $(\{x\} \setminus \{x\}) \cap A = \emptyset$, vậy không điểm nào là limit point.

### Liên hệ Closure và Limit Points

> [!theorem] Theorem 3.7 — Closure = Tập hợp ∪ Limit Points
> Cho $A \subseteq X$. Khi đó:
>
> $$
> \overline{A} = A \cup A'.
> $$

**Proof.**

($\subseteq$) Giả sử $x \notin A$ và $x \notin A'$. Vì $x$ không là limit point, tồn tại lân cận mở $U$ của $x$ sao cho $(U \setminus \{x\}) \cap A = \emptyset$; mà $x \notin A$ nên $U \cap A = \emptyset$. Do đó $X \setminus U$ là tập đóng chứa $A$ không chứa $x$, suy ra $x \notin \overline{A}$.

($\supseteq$) Hiển nhiên $A \subseteq \overline{A}$. Nếu $x \in A'$ và $F$ đóng chứa $A$: giả sử $x \notin F$, thì $X \setminus F$ là lân cận mở của $x$ không giao $A$ — mâu thuẫn với $x \in A'$. Vậy $x \in F$ với mọi $F$ đóng chứa $A$, tức $x \in \overline{A}$. $\blacksquare$

> [!example] Example 3.8 — Closure trong $\mathbb{R}$
> Trong $\mathbb{R}$ với topology Euclidean:
>
> - $\overline{(0,1)} = [0,1]$: các điểm $0$ và $1$ đều là limit points của $(0,1)$.
> - $\overline{\mathbb{Q}} = \mathbb{R}$: mọi số thực đều là limit point của $\mathbb{Q}$ (vì $\mathbb{Q}$ dense trong $\mathbb{R}$).
> - $\overline{\mathbb{Z}} = \mathbb{Z}$: không điểm nào của $\mathbb{R} \setminus \mathbb{Z}$ là limit point của $\mathbb{Z}$ (khoảng cách giữa hai số nguyên là $\geq 1$).

> [!example] Example 3.9 — Closure trong Cofinite Topology
> Trong $\mathbb{R}$ với cofinite topology: với $A$ vô hạn bất kỳ, $\overline{A} = \mathbb{R}$. Lý do: nếu $F$ đóng và $F \neq \mathbb{R}$ thì $F$ hữu hạn, do đó không thể chứa $A$ vô hạn. Vậy tập đóng duy nhất chứa $A$ là $\mathbb{R}$.

---

## Interior (Phần trong)

### Định nghĩa

> [!definition] Definition 3.10 — Interior (Phần trong)
> **Interior** của $A \subseteq X$, ký hiệu $\operatorname{Int}(A)$ hoặc $A^\circ$, là hợp của tất cả các **tập mở** chứa trong $A$:
>
> $$
> \operatorname{Int}(A) = \bigcup \{ U \in \mathcal{T} : U \subseteq A \}.
> $$
>
> $\operatorname{Int}(A)$ là tập mở **lớn nhất** chứa trong $A$.

> [!theorem] Theorem 3.11 — Tính chất của Interior
> Với mọi $A, B \subseteq X$:
>
> 1. $\operatorname{Int}(A) \subseteq A$.
> 2. $\operatorname{Int}(\operatorname{Int}(A)) = \operatorname{Int}(A)$.
> 3. $\operatorname{Int}(A \cap B) = \operatorname{Int}(A) \cap \operatorname{Int}(B)$.
> 4. $A$ mở $\iff$ $A = \operatorname{Int}(A)$.

### Liên hệ Closure và Interior qua bù

> [!theorem] Theorem 3.12 — Duality
> Với $A \subseteq X$:
>
> $$
> \operatorname{Int}(A) = X \setminus \overline{X \setminus A}, \qquad \overline{A} = X \setminus \operatorname{Int}(X \setminus A).
> $$

**Proof.** $x \in \operatorname{Int}(A) \iff$ tồn tại $U$ mở với $x \in U \subseteq A \iff x \notin \overline{X \setminus A}$ (vì $U$ là lân cận mở của $x$ không giao $X \setminus A$). $\blacksquare$

---

## Boundary (Biên)

### Định nghĩa

> [!definition] Definition 3.13 — Boundary (Biên)
> **Boundary** của $A \subseteq X$, ký hiệu $\partial A$ hoặc $\operatorname{Bd}(A)$, là:
>
> $$
> \partial A = \overline{A} \cap \overline{X \setminus A} = \overline{A} \setminus \operatorname{Int}(A).
> $$
>
> Điểm $x \in \partial A$ khi và chỉ khi mọi lân cận mở của $x$ đều giao cả $A$ lẫn $X \setminus A$.

> [!example] Example 3.14 — Interior, Closure, Boundary trong $\mathbb{R}^2$
> Xét $A = \{(x,y) \in \mathbb{R}^2 : x^2 + y^2 < 1\}$ (đĩa mở đơn vị):
>
> - $\operatorname{Int}(A) = A$ (vì $A$ đã mở).
> - $\overline{A} = \{(x,y) : x^2 + y^2 \leq 1\}$ (đĩa đóng đơn vị).
> - $\partial A = \{(x,y) : x^2 + y^2 = 1\}$ (đường tròn đơn vị).
>
> Xét $B = \{(x,y) : x^2 + y^2 \leq 1\}$ (đĩa đóng đơn vị):
> - $\operatorname{Int}(B) = \{(x,y) : x^2 + y^2 < 1\}$, $\overline{B} = B$, $\partial B = \{(x,y) : x^2 + y^2 = 1\}$.
>
> Nhận xét: $A$ và $B$ có cùng boundary dù một cái mở, một cái đóng.

> [!warning] Counterexample 3.15 — Biên có thể bằng cả tập
> Trong $\mathbb{R}$: $\partial \mathbb{Q} = \mathbb{R}$ vì $\overline{\mathbb{Q}} = \mathbb{R}$ và $\overline{\mathbb{R} \setminus \mathbb{Q}} = \mathbb{R}$. Tập $\mathbb{Q}$ không mở không đóng, và biên của nó là toàn bộ $\mathbb{R}$.

---

## Dense Sets (Tập trù mật)

### Định nghĩa

> [!definition] Definition 3.16 — Dense Set (Tập trù mật)
> Tập $A \subseteq X$ gọi là **dense** (trù mật) trong $X$ nếu $\overline{A} = X$, tức mọi open set không rỗng trong $X$ đều giao $A$.

> [!example] Example 3.17 — $\mathbb{Q}$ trù mật trong $\mathbb{R}$
> Với mọi khoảng mở $(a,b) \neq \emptyset$ trong $\mathbb{R}$, tồn tại $q \in \mathbb{Q}$ với $a < q < b$ (tính trù mật của $\mathbb{Q}$). Vậy $\overline{\mathbb{Q}} = \mathbb{R}$: $\mathbb{Q}$ trù mật trong $\mathbb{R}$.

> [!definition] Definition 3.18 — Nowhere Dense (Tập rất thưa)
> $A$ gọi là **nowhere dense** nếu $\operatorname{Int}(\overline{A}) = \emptyset$: closure của $A$ không chứa open set nào không rỗng.
>
> Ví dụ: $\mathbb{Z}$ nowhere dense trong $\mathbb{R}$ vì $\overline{\mathbb{Z}} = \mathbb{Z}$ và $\operatorname{Int}(\mathbb{Z}) = \emptyset$.

---

## Hội tụ dãy (Sequential Convergence)

### Định nghĩa

> [!definition] Definition 3.19 — Hội tụ trong không gian topo
> Một dãy $(x_n)_{n \geq 1}$ trong không gian topo $(X, \mathcal{T})$ gọi là **hội tụ** về $x \in X$, ký hiệu $x_n \to x$, nếu với mọi lân cận mở $U$ của $x$, tồn tại $N \in \mathbb{N}$ sao cho $x_n \in U$ với mọi $n \geq N$.

> [!warning] Counterexample 3.20 — Giới hạn không duy nhất (Trivial Topology)
> Trong trivial topology trên $X = \{0, 1\}$: open sets chỉ là $\emptyset$ và $X$. Mọi lân cận của $0$ là $X$, và mọi dãy $(x_n)$ đều thỏa $x_n \in X$ với mọi $n$. Vậy **mọi dãy đều hội tụ về cả $0$ lẫn $1$ cùng lúc**!
>
> Điều này cho thấy hội tụ dãy trong không gian topo tổng quát không đủ mạnh — ta cần điều kiện thêm (như Hausdorff, bài 10) để đảm bảo giới hạn duy nhất.

> [!theorem] Theorem 3.21 — Dãy và Closure (trong không gian metric)
> Trong **không gian metric** $(X, d)$: $x \in \overline{A}$ khi và chỉ khi tồn tại dãy $(a_n)$ trong $A$ hội tụ về $x$.

> [!note] Remark 3.22 — Hạn chế của dãy số trong không gian topo tổng quát
> Theorem 3.21 **không còn đúng** trong không gian topo tổng quát. Để đặc trưng closure trong không gian topo tổng quát, ta cần khái niệm **net** hoặc **filter** (bài 15). Đây là một trong những lý do khiến topology tổng quát tinh tế hơn giải tích trên metric.

---

## SageMath Cheatsheet

```python
# Minh họa closure, interior, boundary trên tập hữu hạn

def closure(A, closed_sets):
    """Closure của A = giao tất cả closed sets chứa A"""
    A = frozenset(A)
    containing = [F for F in closed_sets if A <= F]
    if not containing:
        return None
    result = containing[0]
    for F in containing[1:]:
        result = result & F
    return result

def interior(A, open_sets):
    """Interior của A = hợp tất cả open sets chứa trong A"""
    A = frozenset(A)
    contained = [U for U in open_sets if U <= A]
    return frozenset().union(*contained) if contained else frozenset()

def boundary(A, open_sets, closed_sets):
    cl_A  = closure(A, closed_sets)
    cl_Ac = closure(frozenset(X) - frozenset(A), closed_sets)
    return cl_A & cl_Ac

# Ví dụ: X = {1,2,3,4,5}, topology T
X = {1, 2, 3, 4, 5}
T = [frozenset(), frozenset(X),
     frozenset({1,2}), frozenset({3,4,5}),
     frozenset({1}), frozenset({2,3,4,5})]
closed = [frozenset(X) - U for U in T]

A = frozenset({2, 3})
print("Closure({2,3})  =", set(closure(A, closed)))
print("Interior({2,3}) =", set(interior(A, T)))
print("Boundary({2,3}) =", set(boundary(A, T, closed)))

# Trong SageMath/Python để minh họa closure trên R (số học):
# "Closure" của (0,1) trong R là [0,1].
# Kiểm tra: 0 là limit point vì khoảng (-eps, eps) luôn giao (0,1).
def is_limit_point_in_R(x, a, b, eps_list):
    """Kiểm tra x có phải limit point của (a,b) không, thử nhiều lân cận"""
    for eps in eps_list:
        # Lân cận mở (x-eps, x+eps), kiểm tra giao (a,b) \ {x}
        lo, hi = x - eps, x + eps
        inter_nonempty = (max(lo, a) < min(hi, b)) and not (max(lo,a) == x == min(hi,b))
        if not inter_nonempty:
            return False
    return True

print(is_limit_point_in_R(0, 0, 1, [0.1, 0.01, 0.001]))  # True
print(is_limit_point_in_R(2, 0, 1, [0.1, 0.01, 0.001]))  # False
```

---

## Summary / Key Takeaways

- **Closure** $\overline{A}$: tập đóng nhỏ nhất chứa $A$ = giao mọi tập đóng chứa $A$ = $A \cup A'$.
- **Limit point** $x$ của $A$: mọi lân cận mở của $x$ đều giao $A \setminus \{x\}$.
- **Interior** $\operatorname{Int}(A)$: tập mở lớn nhất nằm trong $A$ = hợp mọi open set $\subseteq A$.
- **Boundary** $\partial A = \overline{A} \setminus \operatorname{Int}(A)$: các điểm không hoàn toàn bên trong hay bên ngoài $A$.
- **Duality**: $\operatorname{Int}(A) = X \setminus \overline{X \setminus A}$ — interior và closure là dual qua lấy bù.
- **Dense**: $\overline{A} = X \iff A$ giao mọi open set không rỗng. Ví dụ: $\mathbb{Q}$ dense trong $\mathbb{R}$.
- Hội tụ dãy trong không gian topo tổng quát có thể cho nhiều giới hạn — cần Hausdorff để có duy nhất.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§17, 21.
- Willard, S. *General Topology*, §§3, 10.
- Kelley, J. L. *General Topology*, Ch. 1.
