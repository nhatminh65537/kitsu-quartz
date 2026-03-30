---
title: "01. Topological Spaces"
tags: [math, point-set-topology, lesson-01]
aliases: [Topological Spaces]
created: 2026-03-28
---

> **Prerequisites**: Lý thuyết tập hợp cơ bản (tập con, hợp, giao, bù), ánh xạ, logic mệnh đề
> **Objectives**:
> - Hiểu vì sao cần khái niệm "topology" và nó trừu tượng hóa điều gì từ $\mathbb{R}^n$
> - Nắm vững định nghĩa không gian topo và ba tiên đề open sets
> - Nhận biết các topology chuẩn: discrete, trivial, cofinite, Euclidean
> - Hiểu khái niệm basis và subbasis, cách chúng sinh ra một topology

---

## Motivation / Intuition

Trong Giải tích cổ điển, ta làm việc với $\mathbb{R}$ hay $\mathbb{R}^n$ và định nghĩa liên tục theo kiểu $\varepsilon$-$\delta$: hàm $f$ liên tục tại $x$ nếu với mọi $\varepsilon > 0$, tồn tại $\delta > 0$ sao cho $|x - y| < \delta \Rightarrow |f(x) - f(y)| < \varepsilon$. Nhưng nếu nhìn kỹ, định nghĩa này chỉ dùng một tính chất của khoảng cách: **"gần nhau theo nghĩa nào đó"**.

Câu hỏi: liệu ta có thể nói về liên tục, hội tụ, và compact mà **không cần khoảng cách**? Câu trả lời là có — và chìa khóa là khái niệm **tập mở (open set)**.

Ý tưởng chốt: thay vì dùng $\varepsilon$-$\delta$, ta quan sát rằng trong $\mathbb{R}^n$, các open set thỏa mãn ba tính chất đơn giản:
1. $\emptyset$ và $\mathbb{R}^n$ đều mở.
2. Hợp của bất kỳ họ open sets nào vẫn mở.
3. Giao **hữu hạn** của open sets vẫn mở.

Topology học là nghệ thuật **trừu tượng hóa đúng chỗ**: giữ lại ba tính chất này làm tiên đề, bỏ đi mọi thứ còn lại (kể cả khoảng cách). Kết quả là một framework đủ rộng để xử lý hàng trăm "không gian" khác nhau — từ không gian hàm, không gian xác suất, đến các cấu trúc tổ hợp — bằng cùng một ngôn ngữ.

---

## Không gian topo (Topological Space)

### Định nghĩa

> [!definition] Definition 1.1 — Topology và Không gian topo (Topological Space)
> Cho $X$ là một tập hợp. Một **topology** trên $X$ là một họ $\mathcal{T}$ các tập con của $X$ thỏa mãn ba tiên đề:
>
> 1. $\emptyset \in \mathcal{T}$ và $X \in \mathcal{T}$.
>
> 2. **Hợp tùy ý**: Nếu $\{U_\alpha\}_{\alpha \in I} \subseteq \mathcal{T}$ (với $I$ là tập chỉ số bất kỳ, kể cả vô hạn), thì
>
> $$
> \bigcup_{\alpha \in I} U_\alpha \in \mathcal{T}.
> $$
>
> 3. **Giao hữu hạn**: Nếu $U_1, U_2, \ldots, U_n \in \mathcal{T}$, thì
>
> $$
> \bigcap_{i=1}^{n} U_i \in \mathcal{T}.
> $$
>
> Cặp $(X, \mathcal{T})$ được gọi là một **không gian topo (topological space)**. Các phần tử của $\mathcal{T}$ được gọi là các **tập mở (open sets)** trong $X$.

> [!note] Remark 1.2
> Tiên đề (3) chỉ yêu cầu giao **hữu hạn** — đây là điểm tinh tế. Giao vô hạn của open sets không nhất thiết là open: trong $\mathbb{R}$, ta có $\bigcap_{n=1}^{\infty} \left(-\frac{1}{n}, \frac{1}{n}\right) = \{0\}$, mà $\{0\}$ là tập đóng (không mở) trong $\mathbb{R}$. Điều kiện (2) lại không giới hạn cardinality vì hợp của open sets luôn mở trong $\mathbb{R}^n$.

### Ví dụ cơ bản

> [!example] Example 1.3 — Discrete Topology
> Cho $X$ là tập hợp bất kỳ. Đặt $\mathcal{T}_{\text{disc}} = \mathcal{P}(X)$ (tập lũy thừa, tức tập tất cả tập con của $X$). Khi đó $(X, \mathcal{T}_{\text{disc}})$ là không gian topo — gọi là **discrete topology**.
>
> Mọi tập con của $X$ đều là open set. Đây là topology **mịn nhất (finest)**: không gian "kỳ dị" nhất, mọi điểm đều cô lập với nhau.

> [!example] Example 1.4 — Trivial (Indiscrete) Topology
> Đặt $\mathcal{T}_{\text{triv}} = \{\emptyset, X\}$. Đây là topology **thô nhất (coarsest)**: chỉ có đúng hai open sets là $\emptyset$ và $X$. Mọi hàm từ không gian trivial đến bất kỳ không gian nào đều liên tục (bài sau).

> [!example] Example 1.5 — Cofinite Topology (Topology hữu đồng)
> Cho $X$ là tập vô hạn. Định nghĩa $\mathcal{T}_{\text{cof}}$ gồm: $\emptyset$ và tất cả các tập $U \subseteq X$ sao cho $X \setminus U$ là tập **hữu hạn**.
>
> Kiểm tra tiên đề:
> - $\emptyset \in \mathcal{T}_{\text{cof}}$ theo định nghĩa; $X \in \mathcal{T}_{\text{cof}}$ vì $X \setminus X = \emptyset$ hữu hạn. ✓
> - Hợp: Nếu $X \setminus U_\alpha$ hữu hạn, thì $X \setminus \bigcup U_\alpha = \bigcap (X \setminus U_\alpha) \subseteq X \setminus U_{\alpha_0}$ hữu hạn. ✓
> - Giao hữu hạn: $X \setminus (U_1 \cap U_2) = (X \setminus U_1) \cup (X \setminus U_2)$ — hợp hai tập hữu hạn, hữu hạn. ✓

> [!example] Example 1.6 — Topology Euclidean trên $\mathbb{R}$
> Trên $\mathbb{R}$, ta đặt $U \in \mathcal{T}_{\text{Eucl}}$ khi và chỉ khi với mọi $x \in U$, tồn tại $\varepsilon > 0$ sao cho $(x-\varepsilon, x+\varepsilon) \subseteq U$. Đây chính là topology "thông thường" trên $\mathbb{R}$, tương thích với khoảng cách $|x - y|$.

---

## So sánh Topology (Finer / Coarser)

### Định nghĩa

> [!definition] Definition 1.7 — Finer / Coarser
> Cho hai topology $\mathcal{T}$ và $\mathcal{T}'$ trên cùng tập $X$. Ta nói $\mathcal{T}$ **mịn hơn (finer than)** $\mathcal{T}'$ nếu $\mathcal{T}' \subseteq \mathcal{T}$, tức mọi open set của $\mathcal{T}'$ đều là open set của $\mathcal{T}$. Khi đó $\mathcal{T}'$ **thô hơn (coarser than)** $\mathcal{T}$.

Trực giác: topology mịn hơn = nhiều open sets hơn = phân biệt được nhiều điểm hơn = "chính xác hơn".

$$
\mathcal{T}_{\text{triv}} \subseteq \mathcal{T}_{\text{cof}} \subseteq \mathcal{T}_{\text{Eucl}} \subseteq \mathcal{T}_{\text{disc}}
$$

(trên $\mathbb{R}$, tất cả bốn bao hàm đúng)

---

## Tập đóng (Closed Sets)

### Định nghĩa

> [!definition] Definition 1.8 — Tập đóng (Closed Set)
> Cho $(X, \mathcal{T})$ là không gian topo. Một tập $F \subseteq X$ gọi là **đóng (closed)** nếu bù của nó là mở:
>
> $$
> F \text{ đóng} \iff X \setminus F \in \mathcal{T}.
> $$

> [!theorem] Theorem 1.9 — Tính chất của tập đóng
> Trong không gian topo $(X, \mathcal{T})$, họ các tập đóng thỏa mãn:
>
> 1. $\emptyset$ và $X$ là đóng.
> 2. Giao tùy ý của tập đóng là đóng: nếu $\{F_\alpha\}$ là đóng thì $\bigcap_\alpha F_\alpha$ là đóng.
> 3. Hợp hữu hạn của tập đóng là đóng: $F_1 \cup F_2 \cup \cdots \cup F_n$ đóng.

**Proof.** Lấy bù và áp dụng luật De Morgan cùng các tiên đề topology. Ví dụ (2): $X \setminus \bigcap_\alpha F_\alpha = \bigcup_\alpha (X \setminus F_\alpha)$ là hợp của open sets, do đó mở — vậy $\bigcap_\alpha F_\alpha$ đóng. $\blacksquare$

> [!warning] Counterexample 1.10 — Một tập vừa mở vừa đóng (clopen)
> Tập $\emptyset$ và $X$ vừa mở vừa đóng trong mọi không gian topo. Trong discrete topology, **mọi** tập đều clopen. Điều này cho thấy "mở" và "đóng" không phải là đối lập nhau — một tập hoàn toàn có thể vừa mở vừa đóng, hoặc không mở không đóng.
>
> Ví dụ trong $\mathbb{R}$: khoảng $(0,1)$ mở nhưng không đóng; $[0,1]$ đóng nhưng không mở; $[0,1)$ không mở không đóng; $\emptyset$ và $\mathbb{R}$ clopen.

---

## Neighborhood (Lân cận)

### Định nghĩa

> [!definition] Definition 1.11 — Neighborhood (Lân cận)
> Cho $x \in X$. Một **lân cận (neighborhood)** của $x$ là một tập mở $U \in \mathcal{T}$ chứa $x$, tức $x \in U$.
>
> *(Một số tài liệu như Willard định nghĩa neighborhood là tập bất kỳ chứa một open set quanh $x$ — không nhất thiết phải mở. Ta dùng định nghĩa "neighborhood = open neighborhood" theo Munkres.)*

---

## Basis cho Topology

### Định nghĩa

> [!definition] Definition 1.12 — Basis (Cơ sở)
> Một **basis** cho một topology trên $X$ là một họ $\mathcal{B}$ các tập con của $X$ thỏa mãn:
>
> 1. Với mọi $x \in X$, tồn tại $B \in \mathcal{B}$ sao cho $x \in B$.
>
> 2. Nếu $x \in B_1 \cap B_2$ với $B_1, B_2 \in \mathcal{B}$, thì tồn tại $B_3 \in \mathcal{B}$ sao cho $x \in B_3 \subseteq B_1 \cap B_2$.
>
> Topology **sinh bởi $\mathcal{B}$** là họ $\mathcal{T}_\mathcal{B}$ gồm tất cả hợp của các phần tử trong $\mathcal{B}$ (kể cả hợp rỗng cho $\emptyset$).

> [!theorem] Theorem 1.13 — Basis sinh topology
> Nếu $\mathcal{B}$ là basis, thì $\mathcal{T}_\mathcal{B}$ là một topology trên $X$. Hơn nữa, $U \in \mathcal{T}_\mathcal{B}$ khi và chỉ khi với mọi $x \in U$, tồn tại $B \in \mathcal{B}$ sao cho $x \in B \subseteq U$.

**Proof sketch.** Kiểm tra ba tiên đề: $\emptyset$ là hợp rỗng của basis elements; $X$ được phủ nhờ điều kiện (1); hợp tùy ý là hợp của basis elements; giao hữu hạn dùng điều kiện (2) để tìm basis element nhỏ hơn tại mỗi điểm. $\blacksquare$

> [!example] Example 1.14 — Basis của topology Euclidean
> Họ $\mathcal{B} = \{(a, b) : a < b,\, a, b \in \mathbb{R}\}$ là một basis sinh ra topology Euclidean trên $\mathbb{R}$. Họ $\mathcal{B}' = \{(a, b) : a < b,\, a, b \in \mathbb{Q}\}$ cũng là một basis cho cùng topology (vì $\mathbb{Q}$ dense trong $\mathbb{R}$).

> [!example] Example 1.15 — Basis của discrete topology
> Họ $\mathcal{B} = \{\{x\} : x \in X\}$ là basis cho discrete topology: mọi tập con là hợp của các singleton.

### Lemma so sánh topology qua basis

> [!theorem] Lemma 1.16 — So sánh topology qua basis
> Cho $\mathcal{B}$ và $\mathcal{B}'$ là hai basis sinh ra hai topology $\mathcal{T}$ và $\mathcal{T}'$ trên cùng $X$. Khi đó $\mathcal{T} \subseteq \mathcal{T}'$ (tức $\mathcal{T}'$ mịn hơn) khi và chỉ khi: với mọi $x \in X$ và mọi $B \in \mathcal{B}$ chứa $x$, tồn tại $B' \in \mathcal{B}'$ sao cho $x \in B' \subseteq B$.

---

## Subbasis

### Định nghĩa

> [!definition] Definition 1.17 — Subbasis (Cơ sở con)
> Một **subbasis** $\mathcal{S}$ cho một topology trên $X$ là một họ tập con của $X$ sao cho $\bigcup_{S \in \mathcal{S}} S = X$. Topology **sinh bởi $\mathcal{S}$** là topology nhỏ nhất chứa $\mathcal{S}$, có basis gồm tất cả giao hữu hạn của các phần tử trong $\mathcal{S}$.

> [!example] Example 1.18 — Subbasis trên $\mathbb{R}$
> Họ $\mathcal{S} = \{(-\infty, a) : a \in \mathbb{R}\} \cup \{(b, +\infty) : b \in \mathbb{R}\}$ là một subbasis cho topology Euclidean trên $\mathbb{R}$: giao hữu hạn của các phần tử cho ra các khoảng mở hữu hạn $(b, a)$, là basis của topology Euclidean.

---

## SageMath Cheatsheet

```python
# Trong SageMath, topology thuần túy chủ yếu thao tác với tập hợp.
# Minh họa: kiểm tra tiên đề topology bằng Python sets.

X = {1, 2, 3}

# Định nghĩa một topology (ví dụ: không phải discrete, không phải trivial)
T = [frozenset(), frozenset(X), frozenset({1}), frozenset({1, 2})]

def is_topology(X, T):
    X_f = frozenset(X)
    # Kiểm tra tiên đề 1
    if frozenset() not in T or X_f not in T:
        return False, "Thiếu ∅ hoặc X"
    # Kiểm tra tiên đề 2: hợp tùy ý
    from itertools import combinations
    all_sets = list(T)
    for r in range(1, len(all_sets)+1):
        for subset in combinations(all_sets, r):
            union = frozenset().union(*subset)
            if union not in T:
                return False, f"Hợp {set(subset)} = {set(union)} không trong T"
    # Kiểm tra tiên đề 3: giao hữu hạn
    for i in range(len(all_sets)):
        for j in range(i, len(all_sets)):
            inter = all_sets[i] & all_sets[j]
            if inter not in T:
                return False, f"Giao {set(all_sets[i])} ∩ {set(all_sets[j])} không trong T"
    return True, "T là một topology hợp lệ"

print(is_topology(X, T))
# Output: (True, 'T là một topology hợp lệ')

# Discrete topology
T_disc = [frozenset(s) for s in __import__('itertools').chain.from_iterable(
    __import__('itertools').combinations(X, r) for r in range(len(X)+1))]
print(is_topology(X, T_disc))
# Output: (True, 'T là một topology hợp lệ')
```

---

## Summary / Key Takeaways

- Topology $\mathcal{T}$ trên $X$: họ open sets thỏa ba tiên đề — chứa $\emptyset$ và $X$, đóng với hợp tùy ý, đóng với giao hữu hạn.
- Closed sets là bù của open sets; đóng với giao tùy ý và hợp hữu hạn.
- Một tập có thể vừa mở vừa đóng (clopen), hoặc không mở không đóng.
- **Discrete topology**: mịn nhất — mọi tập đều mở. **Trivial topology**: thô nhất — chỉ $\emptyset$ và $X$ mở.
- **Basis** $\mathcal{B}$: họ "building blocks" nhỏ hơn, sinh topology bằng cách lấy hợp tùy ý.
- **Subbasis** $\mathcal{S}$: còn cơ bản hơn basis — sinh topology qua giao hữu hạn rồi hợp tùy ý.
- Topology mịn hơn = nhiều open sets hơn = phân biệt được nhiều điểm hơn.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§12–13.
- Willard, S. *General Topology*, §§3–4.
- Sharifi, R. *Point-Set Topology* (UCLA notes), §1.1.
- May, J. P. *An Outline of Point-Set Topology* (UChicago), §1.
