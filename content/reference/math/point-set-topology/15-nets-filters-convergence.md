---
title: "15. Nets, Filters & Convergence"
tags: [math, point-set-topology, lesson-15]
aliases: [Nets Filters Convergence]
created: 2026-03-30
---

> **Prerequisites**: [[07-compactness-foundations|07. Compactness — Foundations]], [[10-separation-axioms|10. Separation Axioms]], [[12-tychonoff-stone-cech|12. Tychonoff's Theorem & Stone-Čech Compactification]]
> **Objectives**:
> - Hiểu tại sao dãy số không đủ để mô tả topology trong không gian tổng quát
> - Định nghĩa nets (Moore-Smith sequences) và hiểu chúng tổng quát hóa dãy số
> - Định nghĩa filters và ultrafilters, hiểu quan hệ với nets
> - Đặc trưng compactness và closure qua nets và filters

---

## Motivation / Intuition

Trong không gian first countable (đặc biệt metric spaces), **dãy số** đủ để mô tả mọi tính chất topo: closure ($x \in \overline{A}$ iff có dãy trong $A$ hội tụ đến $x$), liên tục (tương đương bảo toàn giới hạn dãy), compactness (tương đương sequential compactness). Nhưng trong không gian tổng quát — như $[0,1]^{[0,1]}$, không gian đối ngẫu của Banach với weak* topology, hay $\beta\mathbb{N}$ — dãy số **không đủ**.

Hai công cụ mạnh hơn được phát triển để lấp đầy khoảng trống này:
- **Nets** (Moore-Smith sequences, 1922): tổng quát hóa trực tiếp dãy số bằng cách dùng tập có hướng (directed set) thay $\mathbb{N}$.
- **Filters** (Cartan, 1937): tiếp cận qua họ các tập "lớn", gần với cách ultrafilters được dùng trong topo đại số và logic.

Cả hai đều cho định lý tổng quát: mọi tính chất topo học có thể được mô tả qua hội tụ của nets hoặc filters.

---

## Directed Sets và Nets

### Định nghĩa

> [!definition] Definition 15.1 — Directed Set (Tập có hướng)
> Một **directed set** (tập có hướng) là cặp $(I, \leq)$ trong đó $\leq$ là quan hệ tiền thứ tự (preorder: phản xạ và bắc cầu) trên $I$ thỏa: với mọi $\alpha, \beta \in I$, tồn tại $\gamma \in I$ sao cho $\alpha \leq \gamma$ và $\beta \leq \gamma$.

> [!example] Example 15.2 — Ví dụ directed sets
> - $(\mathbb{N}, \leq)$: tập chỉ số của dãy số thông thường.
> - Tập tất cả neighborhoods của $x$ với quan hệ $U \leq V \iff V \subseteq U$ (neighborhood nhỏ hơn = "lớn hơn" trong thứ tự).
> - Tập tất cả phân hoạch hữu hạn của $[a,b]$ với refinement: dùng trong định nghĩa tích phân Riemann.
> - Tập tất cả open sets mở của $X$ có hướng bởi $\subseteq$.

> [!definition] Definition 15.3 — Net (Lưới)
> Một **net** trong không gian topo $X$ là ánh xạ $x : I \to X$ với $(I, \leq)$ là directed set, ký hiệu $(x_\alpha)_{\alpha \in I}$ hay $(x_\alpha)$.

> [!definition] Definition 15.4 — Hội tụ của Net
> Net $(x_\alpha)_{\alpha \in I}$ **hội tụ** đến $x \in X$, ký hiệu $x_\alpha \to x$, nếu: với mọi open set $U \ni x$, tồn tại $\alpha_0 \in I$ sao cho $\alpha \geq \alpha_0 \Rightarrow x_\alpha \in U$.

> [!note] Remark 15.5
> Dãy số = net với $I = (\mathbb{N}, \leq)$. Mọi định lý về dãy số có phiên bản tương ứng cho nets.

---

## Nets và Tính chất Topo

> [!theorem] Theorem 15.6 — Closure qua nets
> Trong không gian topo bất kỳ: $x \in \overline{A}$ khi và chỉ khi tồn tại **net** $(a_\alpha)$ trong $A$ với $a_\alpha \to x$.

**Proof.** ($\Leftarrow$) Hiển nhiên: nếu $a_\alpha \to x$ và $a_\alpha \in A$, mọi neighborhood của $x$ gặp $A$.

($\Rightarrow$) Cho $x \in \overline{A}$; lấy $I = \{U : U \ni x \text{ mở}\}$ có hướng bởi $U \leq V \iff V \subseteq U$. Với mỗi $U \in I$: $U \cap A \neq \emptyset$ (vì $x \in \overline{A}$); chọn $a_U \in U \cap A$. Net $(a_U)_{U \in I}$ hội tụ đến $x$: với open $V \ni x$, mọi $W \leq V$ (tức $W \subseteq V$) có $a_W \in W \subseteq V$. $\blacksquare$

> [!theorem] Theorem 15.7 — Liên tục qua nets
> $f : X \to Y$ liên tục tại $x$ khi và chỉ khi: với mọi net $(x_\alpha) \to x$ trong $X$, ta có $f(x_\alpha) \to f(x)$ trong $Y$.

> [!theorem] Theorem 15.8 — Compactness qua nets
> $X$ compact khi và chỉ khi mọi net trong $X$ đều có **cluster point** (điểm tụ): $x$ là cluster point của $(x_\alpha)$ nếu với mọi $U \ni x$ mở và mọi $\alpha_0$, tồn tại $\alpha \geq \alpha_0$ với $x_\alpha \in U$.

**Proof.** ($\Rightarrow$) Cho net $(x_\alpha)$; với mỗi $\alpha$, đặt $A_\alpha = \overline{\{x_\beta : \beta \geq \alpha\}}$. Họ $\{A_\alpha\}$ có FIP (Theorem 7.17); vì $X$ compact, $\bigcap A_\alpha \neq \emptyset$; mỗi điểm trong giao là cluster point. ($\Leftarrow$) Dùng mọi net có cluster point để chứng minh FIP. $\blacksquare$

### Subnet

> [!definition] Definition 15.9 — Subnet (Lưới con)
> Một **subnet** của net $(x_\alpha)_{\alpha \in I}$ là một net $(x_{\phi(\beta)})_{\beta \in J}$ với $\phi : J \to I$ sao cho: với mọi $\alpha_0 \in I$, tồn tại $\beta_0 \in J$ với $\beta \geq \beta_0 \Rightarrow \phi(\beta) \geq \alpha_0$.

> [!note] Remark 15.10
> Subnet tổng quát hơn "dãy con": chỉ số không cần đơn điệu hay thậm chí từ $\mathbb{N}$. $X$ compact $\iff$ mọi net có subnet hội tụ.

---

## Filters và Ultrafilters

### Định nghĩa

> [!definition] Definition 15.11 — Filter (Bộ lọc)
> Một **filter** trên tập $X$ là họ $\mathcal{F}$ các tập con của $X$ thỏa:
>
> 1. $\emptyset \notin \mathcal{F}$ và $X \in \mathcal{F}$.
> 2. **Đóng với giao hữu hạn**: $A, B \in \mathcal{F} \Rightarrow A \cap B \in \mathcal{F}$.
> 3. **Đóng với superset**: $A \in \mathcal{F}$ và $A \subseteq B \Rightarrow B \in \mathcal{F}$.

> [!example] Example 15.12 — Ví dụ filters
> - **Fréchet filter** trên $\mathbb{N}$: $\mathcal{F} = \{A \subseteq \mathbb{N} : \mathbb{N} \setminus A \text{ hữu hạn}\}$ — tập "cofinite". Mô tả "đuôi" của dãy số.
> - **Neighborhood filter** tại $x$: $\mathcal{N}(x) = \{U : U \ni x \text{ mở}\}$. Filter này mô tả hội tụ đến $x$.
> - **Filter sinh bởi net**: từ net $(x_\alpha)$, định nghĩa $\mathcal{F} = \{A : \exists\, \alpha_0, \forall\, \alpha \geq \alpha_0, x_\alpha \in A\}$.

> [!definition] Definition 15.13 — Ultrafilter (Siêu bộ lọc)
> Filter $\mathcal{U}$ gọi là **ultrafilter** nếu nó **tối đại**: không có filter nào chứa $\mathcal{U}$ trừ chính nó. Tương đương: với mọi $A \subseteq X$, $A \in \mathcal{U}$ hoặc $X \setminus A \in \mathcal{U}$.

> [!theorem] Theorem 15.14 — Ultrafilter Lemma (AC)
> Mọi filter đều là tập con của một ultrafilter. (Hệ quả của Axiom of Choice / Zorn's Lemma.)

> [!example] Example 15.15 — Principal và Non-principal ultrafilters
> - **Principal ultrafilter** tại $x$: $\mathcal{U}_x = \{A : x \in A\}$ — tương ứng với điểm $x \in \beta X$.
> - **Non-principal ultrafilter**: tồn tại (nhờ AC) nhưng không tường minh — tương ứng với các điểm "ảo" trong $\beta X \setminus X$.

### Hội tụ của filter

> [!definition] Definition 15.16 — Hội tụ và Cluster Point của Filter
> Filter $\mathcal{F}$ trên $X$ **hội tụ** đến $x$, ký hiệu $\mathcal{F} \to x$, nếu $\mathcal{N}(x) \subseteq \mathcal{F}$ — mọi neighborhood của $x$ thuộc $\mathcal{F}$.
>
> $x$ là **cluster point** của $\mathcal{F}$ nếu $x \in \overline{A}$ với mọi $A \in \mathcal{F}$ — tương đương: mọi neighborhood của $x$ gặp mọi phần tử của $\mathcal{F}$.

> [!theorem] Theorem 15.17 — Compactness qua ultrafilters
> $X$ compact khi và chỉ khi mọi ultrafilter trên $X$ đều hội tụ.

**Proof.** ($\Rightarrow$) Cho $\mathcal{U}$ là ultrafilter; họ $\{\overline{A} : A \in \mathcal{U}\}$ có FIP; vì compact, giao $\neq \emptyset$; lấy $x$ trong giao; $\mathcal{U} \to x$ (kiểm tra mọi neighborhood). ($\Leftarrow$) Cho FIP họ đóng $\{C_\alpha\}$; filter sinh bởi chúng mở rộng thành ultrafilter $\mathcal{U}$; $\mathcal{U} \to x$ cho $x \in \bigcap C_\alpha$. $\blacksquare$

> [!note] Remark 15.18 — Tychonoff qua ultrafilters
> Theorem 15.17 là trái tim của chứng minh **Tychonoff's Theorem** qua ultrafilters: projection của ultrafilter trên product là ultrafilter trên từng nhân tử compact — hội tụ tại đó — lift lên cho cluster point trong product.

---

## So sánh Nets và Filters

| Tính chất | Nets | Filters |
|-----------|------|---------|
| Hội tụ | $x_\alpha \to x$ | $\mathcal{F} \to x$ |
| Closure | $x \in \overline{A}$ iff net trong $A \to x$ | $x \in \overline{A}$ iff $A \in$ mọi filter $\to x$ |
| Compact | Mọi net có cluster point | Mọi ultrafilter hội tụ |
| Liên tục | $f(x_\alpha) \to f(x)$ | $f(\mathcal{F}) \to f(x)$ |
| Tổng quát | Trực quan hơn (gần dãy số) | Mạnh hơn về đại số, dùng trong AC |

---

## SageMath Cheatsheet

```python
# Minh họa nets và hội tụ trong không gian tổng quát

# --- Net ví dụ: hội tụ theo neighborhood filter ---
class Net:
    """Net trong không gian topo (minh họa trên R)."""
    def __init__(self, directed_set, map_fn):
        self.I = directed_set      # list các chỉ số (tuples)
        self.x = map_fn            # I -> X

    def converges_to(self, x_limit, eps=1e-4):
        """Kiểm tra x_alpha -> x_limit trong R với metric."""
        # Tìm alpha_0 sao cho mọi alpha >= alpha_0 thỏa |x_alpha - x_limit| < eps
        for i, alpha in enumerate(self.I):
            if abs(self.x(alpha) - x_limit) < eps:
                # Kiểm tra tất cả alpha sau đó
                remaining = [self.x(a) for a in self.I[i:]]
                if all(abs(v - x_limit) < eps for v in remaining):
                    return True, alpha
        return False, None

# Net: x_{(m,n)} = 1/m + 1/n, directed set = N x N với (m,n) <= (m',n') nếu m<=m' và n<=n'
import itertools

def make_directed_pairs(N=10):
    """Tạo tập có hướng N x N."""
    pairs = [(m,n) for m in range(1,N+1) for n in range(1,N+1)]
    # Sắp xếp theo m+n để minh họa hướng
    return sorted(pairs, key=lambda p: p[0]+p[1])

directed = make_directed_pairs(8)
net = Net(directed, lambda a: 1/a[0] + 1/a[1])

converges, alpha0 = net.converges_to(0.0, eps=0.5)
print(f"Net x_{{m,n}} = 1/m + 1/n hội tụ về 0: {converges}")
print(f"Đạt eps=0.5 tại alpha = {alpha0}")
print(f"Giá trị tại alpha_0: {net.x(alpha0):.4f}")

# Minh họa filter Fréchet trên N
class Filter:
    def __init__(self, membership_fn, X):
        """Filter định nghĩa bởi hàm kiểm tra."""
        self.is_member = membership_fn  # A -> bool
        self.X = X

    def check_axioms(self, test_sets):
        """Kiểm tra ba tiên đề filter trên họ tập thử."""
        # Axiom 1: X ∈ F
        if not self.is_member(set(self.X)):
            return False, "X ∉ F"
        # Axiom 2: giao hữu hạn
        for A in test_sets:
            for B in test_sets:
                if self.is_member(A) and self.is_member(B):
                    if not self.is_member(A & B):
                        return False, f"A∩B ∉ F với A={A}, B={B}"
        # Axiom 3: superset
        for A in test_sets:
            if self.is_member(A):
                for B in test_sets:
                    if A <= B and not self.is_member(B):
                        return False, f"Superset {B} của {A} ∉ F"
        return True, "Tất cả tiên đề filter ✓"

# Fréchet filter trên {1,...,20}: cofinite sets
X = set(range(1, 21))
frechet = Filter(lambda A: len(X - A) < 5, X)  # bù hữu hạn (< 5 phần tử)

test_sets = [
    {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20},  # X
    {5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20},           # X \ {1,2,3,4}
    {1,2,3,4,5},                                              # tập nhỏ — không trong F
    {10,11,12,13,14,15,16,17,18,19,20},                      # X \ {1,...,9}
]
print("\nFréchet filter (cofinite) trên {1,...,20}:")
for A in test_sets:
    print(f"  A={sorted(A)[:5]}{'...' if len(A)>5 else ''} ∈ F? {frechet.is_member(A)}")
print(frechet.check_axioms([frozenset(A) for A in test_sets]))
```

---

## Summary / Key Takeaways

- **Dãy số không đủ** trong không gian tổng quát: cần nets hoặc filters để đặc trưng đầy đủ topology.
- **Net** $(x_\alpha)_{\alpha \in I}$: ánh xạ từ directed set $I$; hội tụ đến $x$ iff mọi open set chứa $x$ chứa đuôi của net.
- **Nets đặc trưng tất cả**: closure, liên tục, compactness — mọi tính chất topo đều viết lại được qua hội tụ net.
- **Filter**: họ tập "lớn" đóng với giao hữu hạn và superset; **ultrafilter** là filter tối đại.
- **Ultrafilter Lemma** (AC): mọi filter mở rộng thành ultrafilter.
- **Compact $\iff$ mọi ultrafilter hội tụ** — nền tảng của chứng minh Tychonoff qua ultrafilters.
- Nets trực quan hơn; filters mạnh hơn về mặt đại số và gần với logic (ultraproducts, nonstandard analysis).

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§37 (filters trong compact).
- Willard, S. *General Topology*, §§11–12 (nets), §§12 (filters).
- Kelley, J. L. *General Topology*, Ch. 2 (nets & filters).
- Bourbaki, N. *General Topology*, Ch. I §6 (filters).
- Moore, E. H. & Smith, H. L. *A general theory of limits*, 1922.
