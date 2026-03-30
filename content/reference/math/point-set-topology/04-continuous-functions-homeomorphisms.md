---
title: "04. Continuous Functions & Homeomorphisms"
tags: [math, point-set-topology, lesson-04]
aliases: [Continuous Functions Homeomorphisms]
created: 2026-03-29
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[02-constructing-topologies|02. Constructing Topologies]], [[03-closure-interior-limit-points|03. Closure, Interior, and Limit Points]]
> **Objectives**:
> - Định nghĩa liên tục qua open sets và chứng minh tương đương với các mô tả khác (closure, closed sets, neighborhoods)
> - Hiểu homeomorphism là "đẳng cấu topo" — khi nào hai không gian được coi là "giống nhau"
> - Nắm Pasting Lemma và áp dụng để xây dựng ánh xạ liên tục từng mảnh
> - Phân biệt homeomorphism với các loại ánh xạ yếu hơn (liên tục, mở, đóng)

---

## Motivation / Intuition

Khi ta đã có các không gian topo, câu hỏi tự nhiên tiếp theo là: **ánh xạ nào là "tự nhiên" giữa chúng?**

Trong đại số tuyến tính, ánh xạ tự nhiên là ánh xạ tuyến tính — bảo toàn cấu trúc cộng và nhân vô hướng. Trong topology, ánh xạ tự nhiên là **ánh xạ liên tục** — bảo toàn cấu trúc open sets. Định nghĩa chính xác: $f : X \to Y$ liên tục nếu nghịch ảnh của mọi open set là open set.

Khi ánh xạ liên tục là song ánh và ánh xạ ngược cũng liên tục, ta có **homeomorphism** — "đẳng cấu" của topology. Hai không gian homeomorphic thì topology học không phân biệt được chúng: mọi tính chất topo của không gian này đều đúng cho không gian kia.

Câu đố kinh điển: **tách cà phê và bánh donut là homeomorphic** (cả hai đều có đúng một lỗ). Nhưng mặt cầu $S^2$ và mặt phẳng $\mathbb{R}^2$ thì không — bài toán phân loại homeomorphism là trọng tâm của topology.

---

## Ánh xạ liên tục (Continuous Maps)

### Định nghĩa

> [!definition] Definition 4.1 — Ánh xạ liên tục (Continuous Map)
> Cho $(X, \mathcal{T}_X)$ và $(Y, \mathcal{T}_Y)$ là hai không gian topo. Ánh xạ $f : X \to Y$ gọi là **liên tục (continuous)** nếu với mọi open set $V \in \mathcal{T}_Y$, nghịch ảnh $f^{-1}(V) \in \mathcal{T}_X$.
>
> Nói ngắn gọn: **nghịch ảnh của open set là open set**.

> [!note] Remark 4.2 — Tại sao dùng nghịch ảnh?
> Có thể thắc mắc: tại sao không yêu cầu **ảnh** của open set là open set? Định nghĩa đó cho ta "open map" — một khái niệm khác và yếu hơn. Lý do dùng nghịch ảnh: nó tương thích với hợp ánh xạ ($f$ và $g$ liên tục thì $g \circ f$ liên tục) và với mọi phép xây dựng topology tự nhiên (subspace, product, quotient).

### Các cách đặc trưng tương đương

> [!theorem] Theorem 4.3 — Các đặc trưng tương đương của tính liên tục
> Cho $f : X \to Y$. Các điều sau tương đương:
>
> 1. $f$ liên tục.
> 2. Với mọi tập đóng $C \subseteq Y$, $f^{-1}(C)$ đóng trong $X$.
> 3. Với mọi $A \subseteq X$: $f(\overline{A}) \subseteq \overline{f(A)}$.
> 4. Với mọi $x \in X$ và mọi lân cận mở $V$ của $f(x)$, tồn tại lân cận mở $U$ của $x$ sao cho $f(U) \subseteq V$.

**Proof.**

$(1) \Rightarrow (2)$: Nếu $C$ đóng thì $Y \setminus C$ mở, nên $f^{-1}(Y \setminus C) = X \setminus f^{-1}(C)$ mở, vậy $f^{-1}(C)$ đóng.

$(2) \Rightarrow (3)$: $\overline{f(A)}$ đóng trong $Y$, nên $f^{-1}(\overline{f(A)})$ đóng trong $X$ và chứa $A$ (vì $f(A) \subseteq \overline{f(A)}$). Do đó $\overline{A} \subseteq f^{-1}(\overline{f(A)})$, tức $f(\overline{A}) \subseteq \overline{f(A)}$.

$(3) \Rightarrow (4)$: Cho $x \in X$ và $V$ mở chứa $f(x)$. Đặt $A = f^{-1}(Y \setminus V)$. Theo (3), $f(\overline{A}) \subseteq \overline{f(A)} \subseteq \overline{Y \setminus V} \subseteq Y \setminus V$. Vậy $x \notin \overline{A}$, tức tồn tại lân cận mở $U$ của $x$ với $U \cap A = \emptyset$, nên $f(U) \subseteq V$.

$(4) \Rightarrow (1)$: Cho $V$ mở trong $Y$. Với mỗi $x \in f^{-1}(V)$, theo (4) tồn tại lân cận mở $U_x$ của $x$ với $f(U_x) \subseteq V$, nên $U_x \subseteq f^{-1}(V)$. Vậy $f^{-1}(V) = \bigcup_{x \in f^{-1}(V)} U_x$ là hợp của open sets, tức mở. $\blacksquare$

### Các ví dụ quan trọng

> [!example] Example 4.4 — Ánh xạ hằng luôn liên tục
> Ánh xạ hằng $f : X \to Y$, $f(x) = y_0$ với mọi $x$, luôn liên tục: với $V$ mở trong $Y$, $f^{-1}(V)$ bằng $X$ nếu $y_0 \in V$, hoặc $\emptyset$ nếu $y_0 \notin V$ — cả hai đều mở.

> [!example] Example 4.5 — Identity liên tục khi topology mịn hơn
> Ánh xạ đồng nhất $\operatorname{id} : (X, \mathcal{T}_1) \to (X, \mathcal{T}_2)$ liên tục khi và chỉ khi $\mathcal{T}_2 \subseteq \mathcal{T}_1$ (tức $\mathcal{T}_1$ mịn hơn $\mathcal{T}_2$). Trực giác: đi từ topology mịn sang thô là liên tục; chiều ngược thì không.

> [!example] Example 4.6 — Inclusion map liên tục
> Nếu $Y \subseteq X$ có subspace topology, thì ánh xạ inclusion $\iota : Y \hookrightarrow X$, $\iota(y) = y$, là liên tục: $\iota^{-1}(U) = U \cap Y$ mở trong $Y$ với mọi $U$ mở trong $X$.

### Hợp của ánh xạ liên tục

> [!theorem] Theorem 4.7 — Hợp ánh xạ liên tục
> Nếu $f : X \to Y$ và $g : Y \to Z$ đều liên tục, thì $g \circ f : X \to Z$ liên tục.

**Proof.** Với $W$ mở trong $Z$: $(g \circ f)^{-1}(W) = f^{-1}(g^{-1}(W))$. Vì $g$ liên tục, $g^{-1}(W)$ mở; vì $f$ liên tục, $f^{-1}(g^{-1}(W))$ mở. $\blacksquare$

---

## Pasting Lemma

> [!theorem] Theorem 4.8 — Pasting Lemma (Bổ đề dán)
> **Phiên bản đóng**: Cho $X = A \cup B$ với $A, B$ đóng trong $X$, và $f : A \to Y$, $g : B \to Y$ là các ánh xạ liên tục thỏa $f(x) = g(x)$ với mọi $x \in A \cap B$. Khi đó ánh xạ $h : X \to Y$ định nghĩa bởi
>
> $$
> h(x) = \begin{cases} f(x) & x \in A \\ g(x) & x \in B \end{cases}
> $$
>
> là liên tục.
>
> **Phiên bản mở**: Kết quả tương tự đúng khi $A, B$ đều mở.

**Proof (phiên bản đóng).** Với $C$ đóng trong $Y$: $h^{-1}(C) = f^{-1}(C) \cup g^{-1}(C)$. Vì $f$ liên tục trên $A$ (có subspace topology), $f^{-1}(C)$ đóng trong $A$; mà $A$ đóng trong $X$ nên $f^{-1}(C)$ đóng trong $X$ (bài sau). Tương tự $g^{-1}(C)$ đóng trong $X$. Hợp hữu hạn của đóng là đóng. $\blacksquare$

> [!example] Example 4.9 — Xây dựng ánh xạ liên tục từng mảnh
> Trên $\mathbb{R}$, hàm $f(x) = |x|$ có thể viết là dán hai hàm: $f_1(x) = x$ trên $[0,+\infty)$ và $f_2(x) = -x$ trên $(-\infty, 0]$, với $f_1(0) = f_2(0) = 0$. Cả hai tập đều đóng, hai hàm thành phần liên tục và khớp tại $0$ — Pasting Lemma đảm bảo $|x|$ liên tục.

> [!warning] Counterexample 4.10 — Phiên bản mở cần bù nhau phủ X
> Pasting Lemma phiên bản mở yêu cầu $X = A \cup B$ (phủ đủ). Nếu $A$ và $B$ không phủ đủ $X$, ánh xạ $h$ không xác định trên $X \setminus (A \cup B)$ và kết quả không đúng.

---

## Homeomorphism (Đồng phôi)

### Định nghĩa

> [!definition] Definition 4.11 — Homeomorphism (Đồng phôi)
> Một **homeomorphism** là ánh xạ $f : X \to Y$ thỏa mãn:
>
> 1. $f$ là song ánh (bijection).
> 2. $f$ liên tục.
> 3. $f^{-1} : Y \to X$ cũng liên tục.
>
> Khi tồn tại homeomorphism giữa $X$ và $Y$, ta nói $X$ và $Y$ **homeomorphic**, ký hiệu $X \cong Y$.

> [!note] Remark 4.12 — Song ánh liên tục chưa đủ!
> Điều kiện (3) **không** suy ra từ (1) và (2). Ví dụ: ánh xạ $f : [0, 1) \to S^1$ định nghĩa bởi $f(t) = (\cos 2\pi t, \sin 2\pi t)$ là song ánh liên tục, nhưng $f^{-1}$ không liên tục tại $(1,0) = f(0)$: dãy $f(1 - 1/n) \to (1,0)$ nhưng $f^{-1}(f(1-1/n)) = 1 - 1/n \not\to 0 = f^{-1}(1,0)$.

### Tính chất topo (Topological Properties)

> [!definition] Definition 4.13 — Tính chất topo (Topological Property)
> Một tính chất $P$ của không gian topo gọi là **tính chất topo (topological property)** nếu: nếu $X$ có tính chất $P$ và $X \cong Y$ thì $Y$ cũng có tính chất $P$.
>
> Ví dụ: compactness, connectedness, số lượng connected components, số clopen sets, ... đều là tính chất topo. Khoảng cách giữa các điểm thì không (vì homeomorphism không cần bảo toàn khoảng cách).

### Ví dụ homeomorphism quan trọng

> [!example] Example 4.14 — Mọi khoảng mở hữu hạn homeomorphic nhau
> Mọi khoảng mở $(a,b)$ và $(c,d)$ trong $\mathbb{R}$ đều homeomorphic qua ánh xạ tuyến tính $f(x) = c + \frac{(d-c)(x-a)}{b-a}$. Hơn nữa, $(0,1) \cong \mathbb{R}$ qua $f(x) = \tan\!\left(\pi x - \frac{\pi}{2}\right)$.

> [!example] Example 4.15 — $(0,1) \cong \mathbb{R}$
> Ánh xạ $f : (0,1) \to \mathbb{R}$, $f(t) = \ln\!\left(\frac{t}{1-t}\right)$ là homeomorphism (hàm logit). Vậy đoạn mở hữu hạn và đường thẳng vô hạn là "giống nhau" về mặt topology — không gian topo không phân biệt "hữu hạn" hay "vô hạn" theo nghĩa đo.

> [!example] Example 4.16 — $\mathbb{R}^n \not\cong \mathbb{R}^m$ với $n \neq m$
> Đây là định lý sâu sắc (cần invariance of domain hoặc homology): $\mathbb{R}^n$ và $\mathbb{R}^m$ không homeomorphic khi $n \neq m$. Trường hợp $n=1, m=2$ có thể chứng minh bằng connectedness: $\mathbb{R} \setminus \{p\}$ không liên thông, nhưng $\mathbb{R}^2 \setminus \{p\}$ liên thông.

### Open Maps và Closed Maps

> [!definition] Definition 4.17 — Open Map / Closed Map
> - $f : X \to Y$ là **open map** nếu ảnh của mọi open set là open: $U$ mở $\Rightarrow f(U)$ mở.
> - $f : X \to Y$ là **closed map** nếu ảnh của mọi closed set là closed.
>
> Một song ánh liên tục là homeomorphism khi và chỉ khi nó là open map (hoặc tương đương, closed map).

> [!warning] Counterexample 4.18 — Open map không nhất thiết là closed map
> Phép chiếu $\pi_1 : \mathbb{R}^2 \to \mathbb{R}$, $(x,y) \mapsto x$, là open map (ảnh của hình chữ nhật mở là khoảng mở) nhưng **không** là closed map: tập $\{(x, y) : xy = 1, x > 0\}$ đóng trong $\mathbb{R}^2$ nhưng ảnh của nó qua $\pi_1$ là $(0, +\infty)$ — không đóng trong $\mathbb{R}$.

---

## Embedding (Nhúng)

> [!definition] Definition 4.19 — Topological Embedding (Nhúng topo)
> Ánh xạ $f : X \to Y$ gọi là **(topological) embedding** nếu $f$ là homeomorphism từ $X$ lên $f(X)$ (với subspace topology từ $Y$). Tức là $f$ đơn ánh, liên tục, và $f : X \to f(X)$ là homeomorphism.

> [!example] Example 4.20 — Nhúng $S^1$ vào $\mathbb{R}^2$
> Ánh xạ $f : [0, 2\pi) \to \mathbb{R}^2$, $f(t) = (\cos t, \sin t)$ là song ánh liên tục lên $S^1$ nhưng **không** là embedding (vì $f^{-1}$ không liên tục tại $(1,0)$, như ví dụ trước). Tuy nhiên, inclusion $\iota : S^1 \hookrightarrow \mathbb{R}^2$ là embedding tự nhiên.

---

## SageMath Cheatsheet

```python
# Kiểm tra tính liên tục (trên không gian topo hữu hạn)

def preimage(f, V, X):
    """Nghịch ảnh f^{-1}(V) với f: X -> Y"""
    return frozenset(x for x in X if f(x) in V)

def is_continuous(f, X, T_X, T_Y):
    """Kiểm tra f: (X, T_X) -> (Y, T_Y) có liên tục không"""
    for V in T_Y:
        preim = preimage(f, V, X)
        if preim not in T_X:
            print(f"  FAIL: f^(-1)({set(V)}) = {set(preim)} không mở")
            return False
    return True

# Ví dụ: X = Y = {1,2,3}
X = {1, 2, 3}
T = [frozenset(), frozenset(X), frozenset({1}), frozenset({2,3})]

# Ánh xạ hằng f(x) = 1
f_const = lambda x: 1
print("f hằng liên tục:", is_continuous(f_const, X, T, T))
# True

# Ánh xạ đồng nhất từ (X, T_disc) -> (X, T)
T_disc = list(map(frozenset, __import__('itertools').chain.from_iterable(
    __import__('itertools').combinations(X, r) for r in range(len(X)+1))))
f_id = lambda x: x
print("id: disc -> T liên tục:", is_continuous(f_id, X, T_disc, T))
# True (vì discrete mịn hơn T)
print("id: T -> disc liên tục:", is_continuous(f_id, X, T, T_disc))
# False (vì không thể kéo ngược)

# Homeomorphism: kiểm tra f và f^{-1} đều liên tục
def is_homeomorphism(f, f_inv, X, Y, T_X, T_Y):
    return (is_continuous(f, X, T_X, T_Y) and
            is_continuous(f_inv, Y, T_Y, T_X))
```

---

## Summary / Key Takeaways

- **Liên tục** = nghịch ảnh của open set là open set. Tương đương: nghịch ảnh closed → closed; $f(\overline{A}) \subseteq \overline{f(A)}$; local condition tại từng điểm.
- **Hợp** ánh xạ liên tục là liên tục.
- **Pasting Lemma**: dán hai ánh xạ liên tục trên hai tập đóng (hoặc mở) phủ $X$, khớp nhau trên giao — cho ánh xạ liên tục.
- **Homeomorphism**: song ánh liên tục với nghịch ảnh cũng liên tục = "đẳng cấu topo". Song ánh liên tục chưa đủ!
- **Tính chất topo**: bất biến qua homeomorphism — công cụ để chứng minh hai không gian **không** homeomorphic.
- **Open map / Closed map**: song ánh liên tục + open map $\iff$ homeomorphism.
- **Embedding**: homeomorphism lên ảnh — cách nhúng không gian này vào không gian kia.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§18, 22, 26.
- Willard, S. *General Topology*, §§7–8.
- Kelley, J. L. *General Topology*, Ch. 2.
- Hatcher, A. *Notes on Introductory Point-Set Topology*, §2.
