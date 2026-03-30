---
title: "10. Separation Axioms"
tags: [math, point-set-topology, lesson-10]
aliases: [Separation Axioms]
created: 2026-03-30
---

> **Prerequisites**: [[01-topological-spaces|01. Topological Spaces]], [[04-continuous-functions-homeomorphisms|04. Continuous Functions & Homeomorphisms]], [[09-countability-axioms|09. Countability Axioms]]
> **Objectives**:
> - Nắm chuỗi axiom phân tách $T_0$ đến $T_4$ và quan hệ bao hàm giữa chúng
> - Phân biệt Hausdorff ($T_2$), regular ($T_3$), normal ($T_4$) bằng ví dụ cụ thể
> - Hiểu tại sao normality là điều kiện tiên quyết cho Urysohn's Lemma (Bài 11)
> - Nhận biết các không gian thông thường thuộc lớp nào

---

## Motivation / Intuition

Topology học nghiên cứu cấu trúc qua open sets. Một câu hỏi tự nhiên: open sets có đủ phong phú để **phân tách** các điểm hay các tập đóng ra khỏi nhau không? Ví dụ, trong discrete topology mọi điểm đều cô lập — phân tách hoàn hảo. Trong trivial topology, không có gì được phân tách cả.

Các **separation axioms** ($T_0$, $T_1$, $T_2$, $T_3$, $T_4$) đặt ra những yêu cầu ngày càng mạnh về khả năng phân tách. Mỗi cấp bổ sung thêm sức mạnh:

- $T_0$: phân biệt điểm bằng open set.
- $T_1$: singleton đóng.
- $T_2$ (Hausdorff): hai điểm phân biệt có neighborhoods tách biệt.
- $T_3$ (Regular): điểm và tập đóng có neighborhoods tách biệt.
- $T_4$ (Normal): hai tập đóng có neighborhoods tách biệt.

Chuỗi $T_0 \subsetneq T_1 \subsetneq T_2 \subsetneq T_3 \subsetneq T_4$ (trong điều kiện phù hợp) dẫn đến các định lý sâu: Urysohn's Lemma ($T_4$) và Urysohn Metrization ($T_3$ + second countable).

---

## $T_0$ và $T_1$

> [!definition] Definition 10.1 — $T_0$ (Kolmogorov)
> $X$ gọi là **$T_0$** (hay **Kolmogorov**) nếu với mọi $x \neq y \in X$, tồn tại open set chứa đúng một trong hai điểm.

> [!definition] Definition 10.2 — $T_1$ (Fréchet)
> $X$ gọi là **$T_1$** (hay **Fréchet**) nếu với mọi $x \neq y$, tồn tại open set $U \ni x$ với $y \notin U$ **và** open set $V \ni y$ với $x \notin V$.

> [!theorem] Theorem 10.3 — Đặc trưng $T_1$ qua singleton đóng
> $X$ là $T_1$ khi và chỉ khi mọi singleton $\{x\}$ là tập **đóng** trong $X$.

**Proof.** ($\Rightarrow$) Với $y \neq x$, có $V_y \ni y$ với $x \notin V_y$; suy ra $X \setminus \{x\} = \bigcup_{y \neq x} V_y$ mở. ($\Leftarrow$) Nếu $\{x\}$ đóng thì $X \setminus \{x\}$ mở là neighborhood của mọi $y \neq x$ không chứa $x$; tương tự $X \setminus \{y\}$ là neighborhood của $x$ không chứa $y$. $\blacksquare$

> [!example] Example 10.4 — $T_0$ không kéo theo $T_1$
> Xét $X = \{0, 1\}$ với topology $\{\emptyset, \{0\}, \{0,1\}\}$ (Sierpiński space). Đây là $T_0$: $\{0\}$ chứa $0$ nhưng không chứa $1$. Nhưng không phải $T_1$: không có open set chứa $1$ mà không chứa $0$.

> [!warning] Counterexample 10.5 — $T_1$ không kéo theo $T_2$
> Tập vô hạn $X$ với **cofinite topology** là $T_1$ (mọi singleton đóng vì bù là cofinite, do đó mở). Nhưng không phải $T_2$: hai open sets bất kỳ đều có giao khác rỗng (vì giao hai cofinite complement là cofinite — không rỗng trên tập vô hạn).

---

## $T_2$: Hausdorff Spaces

> [!definition] Definition 10.6 — $T_2$ (Hausdorff)
> $X$ gọi là **Hausdorff** (hay **$T_2$**) nếu với mọi $x \neq y$, tồn tại open sets $U \ni x$ và $V \ni y$ với $U \cap V = \emptyset$.

Ta đã gặp Hausdorff nhiều lần: metric spaces Hausdorff (Theorem 5.16), compact subsets của Hausdorff đóng (Theorem 7.8), v.v.

> [!theorem] Theorem 10.7 — Tính chất của Hausdorff spaces
> Trong Hausdorff space $X$:
>
> 1. Limit của dãy là duy nhất: nếu $x_n \to x$ và $x_n \to y$ thì $x = y$.
> 2. Diagonal $\Delta = \{(x,x) : x \in X\} \subseteq X \times X$ là tập đóng.
> 3. Mọi compact subset là đóng.
> 4. Finite sets đóng.

**Proof.** (1) Nếu $x \neq y$, có $U \ni x$, $V \ni y$ rời nhau; từ $N$ nào đó $x_n \in U \cap V = \emptyset$ — vô lý. (2) $(X \times X) \setminus \Delta = \{(x,y) : x \neq y\}$: với mỗi cặp $(x,y)$ trong đó, có $U \times V$ tách $x,y$, nên mở. (3) Theorem 7.8. $\blacksquare$

> [!example] Example 10.8 — Ví dụ không gian Hausdorff
> - Mọi metric space: Hausdorff (Theorem 5.16).
> - $\mathbb{R}^n$, $S^n$, mọi manifold: Hausdorff.
> - Product của Hausdorff là Hausdorff: $(U_1 \times U_2) \cap (V_1 \times V_2) = \emptyset$ nếu $U_1 \cap V_1 = \emptyset$.

---

## $T_3$: Regular Spaces

> [!definition] Definition 10.9 — Regular ($T_3$)
> $X$ gọi là **regular** nếu: với mọi điểm $x$ và tập đóng $F$ với $x \notin F$, tồn tại open sets $U \supseteq F$ và $V \ni x$ với $U \cap V = \emptyset$.
>
> $X$ gọi là **$T_3$** nếu $X$ vừa $T_1$ vừa regular.

> [!note] Remark 10.10 — Thứ tự quy ước
> Cảnh báo: trong một số tài liệu (Willard, Kelley), $T_3$ định nghĩa khác với Munkres. Ta theo quy ước của Munkres: **regular = phân tách điểm và tập đóng**; $T_3$ = $T_1$ + regular.

> [!theorem] Theorem 10.11 — $T_3$ $\Rightarrow$ $T_2$
> Mọi $T_3$ space đều Hausdorff.

**Proof.** Cho $x \neq y$. Vì $T_1$, $\{y\}$ đóng và $x \notin \{y\}$; theo regular, có $U \ni \{y\}$ và $V \ni x$ rời nhau. $\blacksquare$

> [!theorem] Theorem 10.12 — Đặc trưng regular qua closure
> $X$ regular khi và chỉ khi: với mọi $x \in X$ và open set $U \ni x$, tồn tại open set $V$ sao cho $x \in V \subseteq \overline{V} \subseteq U$.

**Proof.** ($\Rightarrow$) Đặt $F = X \setminus U$ đóng; theo regular, có $W \ni x$ và $G \supseteq F$ rời nhau; đặt $V = W$: $\overline{V} \subseteq X \setminus G \subseteq X \setminus F = U$. ($\Leftarrow$) Cho $F$ đóng, $x \notin F$; đặt $U = X \setminus F$; có $V$ với $x \in V \subseteq \overline{V} \subseteq U$; thì $V \ni x$ và $X \setminus \overline{V} \supseteq F$ rời nhau. $\blacksquare$

> [!example] Example 10.13 — Mọi metric space là $T_3$
> Trong metric space: với $x \notin F$ (đóng), đặt $\varepsilon = d(x,F)/2 > 0$; thì $B(x,\varepsilon)$ và $\bigcup_{y \in F} B(y, \varepsilon)$ rời nhau.

> [!warning] Counterexample 10.14 — Hausdorff không kéo theo Regular
> Sorgenfrey plane $\mathbb{R}_\ell \times \mathbb{R}_\ell$ (product của hai Sorgenfrey lines) là Hausdorff nhưng **không regular**. Đây là ví dụ kinh điển — thật ra còn mạnh hơn: nó không normal.

---

## $T_4$: Normal Spaces

> [!definition] Definition 10.15 — Normal ($T_4$)
> $X$ gọi là **normal** nếu: với mọi hai tập đóng $F_1, F_2$ rời nhau, tồn tại open sets $U_1 \supseteq F_1$ và $U_2 \supseteq F_2$ với $U_1 \cap U_2 = \emptyset$.
>
> $X$ gọi là **$T_4$** nếu $X$ vừa $T_1$ vừa normal.

> [!theorem] Theorem 10.16 — $T_4$ $\Rightarrow$ $T_3$
> Mọi $T_4$ space đều $T_3$.

**Proof.** Cho $x \notin F$ (đóng). Vì $T_1$, $\{x\}$ đóng. Áp dụng normal cho $\{x\}$ và $F$. $\blacksquare$

> [!theorem] Theorem 10.17 — Compact Hausdorff là Normal
> Mọi compact Hausdorff space đều normal ($T_4$).

**Proof.** Cho $F_1, F_2$ đóng rời nhau trong compact Hausdorff $X$. Với mỗi $x \in F_1$: vì $X$ Hausdorff và $F_2$ compact, ta tách $x$ và $F_2$ bởi $U_x \ni x$ và $V_x \supseteq F_2$ rời nhau (bằng cách giao hữu hạn như trong chứng minh Theorem 7.8). Họ $\{U_x\}_{x \in F_1}$ phủ $F_1$ compact; finite subcover $U_{x_1}, \ldots, U_{x_n}$. Đặt $U = \bigcup U_{x_i}$ và $V = \bigcap V_{x_i}$: $U \supseteq F_1$, $V \supseteq F_2$, và $U \cap V = \emptyset$. $\blacksquare$

> [!theorem] Theorem 10.18 — Metric space là Normal
> Mọi metric space đều normal.

**Proof.** Cho $F_1, F_2$ đóng rời nhau. Định nghĩa $f : X \to \mathbb{R}$ bởi:

$$
f(x) = \frac{d(x, F_1)}{d(x, F_1) + d(x, F_2)}.
$$

Hàm này liên tục (vì $d(x, F_i)$ liên tục và mẫu $\neq 0$ vì $F_1 \cap F_2 = \emptyset$), $f|_{F_1} = 0$, $f|_{F_2} = 1$. Đặt $U_1 = f^{-1}([0, \frac{1}{2}))$ và $U_2 = f^{-1}((\frac{1}{2}, 1])$ — mở, rời nhau, phủ $F_1$ và $F_2$. $\blacksquare$

> [!theorem] Theorem 10.19 — Đặc trưng normal qua closure (Urysohn's condition)
> $X$ normal khi và chỉ khi: với mọi $F$ đóng và $U \supseteq F$ mở, tồn tại $V$ mở sao cho $F \subseteq V \subseteq \overline{V} \subseteq U$.

**Proof.** Đặt $F_2 = X \setminus U$ đóng, rời $F_1 = F$. Dùng normality để tách, rồi kiểm tra closure. $\blacksquare$

---

## Completely Regular: $T_{3\frac{1}{2}}$ (Tychonoff)

> [!definition] Definition 10.20 — Completely Regular ($T_{3\frac{1}{2}}$, Tychonoff)
> $X$ gọi là **completely regular** nếu: với mọi $x$ và tập đóng $F$, $x \notin F$, tồn tại hàm liên tục $f : X \to [0,1]$ với $f(x) = 0$ và $f|_F = 1$.
>
> $X$ gọi là **Tychonoff** (hay **$T_{3\frac{1}{2}}$**) nếu $T_1$ + completely regular.

> [!note] Remark 10.21 — Vị trí trong chuỗi
> $T_4 \Rightarrow T_{3\frac{1}{2}} \Rightarrow T_3 \Rightarrow T_2 \Rightarrow T_1 \Rightarrow T_0$.
>
> Completely regular là điều kiện tự nhiên nhất: nó tương đương với khả năng nhúng vào $[0,1]^I$ (Stone-Čech, Bài 12). Trong thực tế, hầu hết không gian "tự nhiên" đều ít nhất là Tychonoff.

---

## Bảng tóm tắt

| Axiom | Điều kiện | Ví dụ điển hình |
|-------|-----------|----------------|
| $T_0$ | Open set phân biệt điểm | Sierpiński space |
| $T_1$ | Singleton đóng | Cofinite topology trên $\mathbb{R}$ |
| $T_2$ (Hausdorff) | Điểm tách bằng open sets rời | Mọi metric space |
| $T_{3}$ (Regular) | Điểm và tập đóng tách bằng open sets rời | Metric spaces |
| $T_{3\frac{1}{2}}$ (Tychonoff) | Phân tách bằng hàm liên tục | Metric spaces, manifolds |
| $T_4$ (Normal) | Hai tập đóng rời nhau tách bằng open sets rời | Compact Hausdorff, metric spaces |

---

## Tính bảo toàn qua các phép xây dựng

> [!theorem] Theorem 10.22 — Subspace bảo toàn $T_0$–$T_3$ nhưng không nhất thiết $T_4$
> Với $T_0, T_1, T_2, T_3, T_{3\frac{1}{2}}$: mọi subspace của không gian thỏa axiom đó cũng thỏa. Nhưng subspace của $T_4$ không nhất thiết $T_4$.

> [!warning] Counterexample 10.23 — Subspace của normal không normal
> Tích $[0,1]^{[0,1]}$ (uncountable product của $[0,1]$) là compact Hausdorff — do đó normal. Nhưng Niemytzki plane (Sorgenfrey plane) là subspace của không gian normal mà không normal.

> [!theorem] Theorem 10.24 — Product bảo toàn $T_0$–$T_{3\frac{1}{2}}$ nhưng không $T_4$
> Product (Tychonoff) của họ bất kỳ không gian $T_k$ ($k = 0,1,2,3,3\tfrac{1}{2}$) vẫn $T_k$. Nhưng product vô hạn của $T_4$ không nhất thiết $T_4$.

---

## SageMath Cheatsheet

```python
# Minh họa separation axioms trên tập hữu hạn

def check_T0(X, T):
    """Kiểm tra T0: với mọi x≠y, có open set chứa đúng một trong hai."""
    T_s = [set(u) for u in T]
    for x in X:
        for y in X:
            if x == y: continue
            separated = any(
                (x in u) != (y in u) for u in T_s
            )
            if not separated:
                return False, f"Không phân biệt được {x} và {y}"
    return True, "T0 ✓"

def check_T1(X, T):
    """Kiểm tra T1: mọi singleton đóng."""
    T_s = [frozenset(u) for u in T]
    for x in X:
        complement = frozenset(X) - frozenset({x})
        # Tập {x} đóng ⟺ X\{x} mở
        if complement not in T_s and len(complement) > 0:
            return False, f"Singleton {{{x}}} không đóng"
    return True, "T1 ✓"

def check_T2(X, T):
    """Kiểm tra T2 (Hausdorff): với x≠y, có U∋x, V∋y rời nhau."""
    T_s = [set(u) for u in T]
    for x in X:
        for y in X:
            if x == y: continue
            found = any(
                x in u and y in v and not (u & v)
                for u in T_s for v in T_s
            )
            if not found:
                return False, f"Không tách được {x} và {y}"
    return True, "T2 (Hausdorff) ✓"

# Ví dụ 1: X={1,2,3}, topology không Hausdorff
X = [1, 2, 3]
T_cofinite = [
    frozenset(),
    frozenset(X),
    frozenset({2, 3}),   # X \ {1}
    frozenset({1, 3}),   # X \ {2}
    frozenset({1, 2}),   # X \ {3}
]
print("Cofinite topology trên {1,2,3}:")
print(" ", check_T0(X, T_cofinite))
print(" ", check_T1(X, T_cofinite))
print(" ", check_T2(X, T_cofinite))

# Ví dụ 2: Discrete topology — T4
T_discrete = [frozenset(s) for s in __import__('itertools').chain.from_iterable(
    __import__('itertools').combinations(X, r) for r in range(len(X)+1))]
print("\nDiscrete topology trên {1,2,3}:")
print(" ", check_T0(X, T_discrete))
print(" ", check_T1(X, T_discrete))
print(" ", check_T2(X, T_discrete))

# Minh họa hàm phân tách cho metric space (chứng minh Normal)
import numpy as np

def dist_to_set(x, F_points):
    """Khoảng cách từ x đến tập F."""
    return min(abs(x - f) for f in F_points)

# F1 = {0.2, 0.3}, F2 = {0.7, 0.8} — hai closed sets rời nhau trong [0,1]
F1, F2 = [0.2, 0.3], [0.7, 0.8]
xs = np.linspace(0, 1, 500)
f_vals = [dist_to_set(x, F1) / (dist_to_set(x, F1) + dist_to_set(x, F2)) for x in xs]

# U1 = f^{-1}([0, 0.5)), U2 = f^{-1}((0.5, 1])
U1 = [x for x, f in zip(xs, f_vals) if f < 0.5]
U2 = [x for x, f in zip(xs, f_vals) if f > 0.5]
print(f"\nNormality: F1={F1}, F2={F2}")
print(f"  U1 chứa F1? {all(any(abs(x-f)<0.01 for x in U1) for f in F1)}")
print(f"  U2 chứa F2? {all(any(abs(x-f)<0.01 for x in U2) for f in F2)}")
print(f"  U1 ∩ U2 rỗng? {len(set([round(x,3) for x in U1]) & set([round(x,3) for x in U2])) == 0}")
```

---

## Summary / Key Takeaways

- $T_0$: open set phân biệt điểm. $T_1$: singleton đóng. $T_2$ (Hausdorff): điểm tách bởi open sets rời.
- $T_3$ (Regular = $T_1$ + regular): điểm và tập đóng tách bởi open sets rời; đặc trưng: $x \in V \subseteq \overline{V} \subseteq U$.
- $T_{3\frac{1}{2}}$ (Tychonoff): phân tách bằng hàm liên tục $f : X \to [0,1]$.
- $T_4$ (Normal = $T_1$ + normal): hai tập đóng rời nhau tách bởi open sets rời; đặc trưng: $F \subseteq V \subseteq \overline{V} \subseteq U$.
- **Compact Hausdorff** $\Rightarrow$ Normal; **Metric space** $\Rightarrow$ Normal.
- Chuỗi: $T_4 \Rightarrow T_{3\frac{1}{2}} \Rightarrow T_3 \Rightarrow T_2 \Rightarrow T_1 \Rightarrow T_0$.
- Subspace bảo toàn $T_0$–$T_{3\frac{1}{2}}$ nhưng **không** $T_4$ nói chung.
- Normality là điều kiện tiên quyết cho **Urysohn's Lemma** (Bài 11) và **Tietze Extension** (Bài 11).

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§31–33.
- Willard, S. *General Topology*, §§13–15.
- Steen & Seebach. *Counterexamples in Topology* (2nd ed.).
- Kelley, J. L. *General Topology*, Ch. 4.
