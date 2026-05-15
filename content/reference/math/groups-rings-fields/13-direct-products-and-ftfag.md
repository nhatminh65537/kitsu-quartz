---
title: "13. Direct Products and the Fundamental Theorem of Finite Abelian Groups"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-13]
aliases: [Direct Products and FTFAG, Fundamental Theorem of Finite Abelian Groups]
created: 2026-05-15
---

> **Prerequisites**: [[12-group-homomorphisms-and-isomorphism-theorems|12. Group Homomorphisms and Isomorphism Theorems]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}/n\mathbb{Z}$ | Nhóm cyclic cấp $n$ |
> | $\gcd(a,b)$ | Ước chung lớn nhất |
> | $\operatorname{lcm}(a,b)$ | Bội chung nhỏ nhất |
> | $\operatorname{ord}(g)$ | Cấp của phần tử $g$ |
> | $H \trianglelefteq G$ | $H$ là nhóm con chuẩn tắc của $G$ |
> | $\phi(n)$ | Hàm Euler totient |
> | $p$ | Số nguyên tố |

> **Objectives**:
> - Định nghĩa và tính chất của tích trực tiếp ngoài (external direct product) và trong (internal).
> - Phát biểu và ứng dụng Định lý cơ bản về nhóm Abel hữu hạn (FTFAG): dạng nhân tử bất biến và dạng phân tích sơ cấp.
> - Chứng minh $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ khi $\gcd(m,n)=1$.
> - Phân loại nhóm Abel hữu hạn có cấp nhỏ.

---

## Motivation

Ta đã biết nhiều nhóm: $\mathbb{Z}_2$, $\mathbb{Z}_3$, $\mathbb{Z}_4$, $\mathbb{Z}_6$, $S_3$, $Q_8$, $\ldots$ Câu hỏi: có cách nào **xây dựng** nhóm lớn từ các nhóm nhỏ hơn không? Và ngược lại: một nhóm Abel hữu hạn bất kỳ trông như thế nào?

Tích trực tiếp (direct product) cho phép ghép hai hoặc nhiều nhóm thành một nhóm lớn hơn. Định lý cơ bản về nhóm Abel hữu hạn (FTFAG) cho biết: **mọi** nhóm Abel hữu hạn đều đẳng cấu với tích trực tiếp của các nhóm cyclic. Đây là kết quả phân loại hoàn chỉnh — một trong những định lý đẹp nhất trong đại số.

---

## 1. Tích Trực Tiếp Ngoài (External Direct Product)

> [!definition] Definition 13.1 — Tích trực tiếp ngoài
> Cho $(G_1, \cdot_1)$ và $(G_2, \cdot_2)$ là hai nhóm. **Tích trực tiếp ngoài** của $G_1$ và $G_2$:
>
> $$
> G_1 \times G_2 = \{(g_1, g_2) \mid g_1 \in G_1, g_2 \in G_2\}
> $$
>
> với phép toán **theo thành phần** (component-wise):
>
> $$
> (g_1, g_2) \cdot (h_1, h_2) = (g_1 \cdot_1 h_1,\, g_2 \cdot_2 h_2)
> $$

> [!abstract] Theorem 13.2 — $G_1 \times G_2$ là nhóm
> $(G_1 \times G_2, \cdot)$ là nhóm với:
>
> - Phần tử đơn vị: $(e_1, e_2)$.
> - Nghịch đảo: $(g_1, g_2)^{-1} = (g_1^{-1}, g_2^{-1})$.
> - Cấp: $|G_1 \times G_2| = |G_1| \cdot |G_2|$.
>
> $G_1 \times G_2$ là Abel $\iff$ cả $G_1$ và $G_2$ đều Abel.

> [!note] Remark 13.3 — Tổng quát hóa
> Tích trực tiếp của $n$ nhóm:
>
> $$
> G_1 \times G_2 \times \cdots \times G_n = \prod_{i=1}^n G_i
> $$
>
> Phần tử là $n$-tuple $(g_1, \ldots, g_n)$, phép toán theo từng thành phần.

> [!abstract] Theorem 13.4 — Cấp của phần tử trong tích trực tiếp
> Trong $G_1 \times G_2$:
>
> $$
> \operatorname{ord}(g_1, g_2) = \operatorname{lcm}(\operatorname{ord}(g_1), \operatorname{ord}(g_2))
> $$

**Proof.** $(g_1, g_2)^n = (g_1^n, g_2^n) = (e_1, e_2) \iff g_1^n = e_1 \text{ và } g_2^n = e_2 \iff \operatorname{ord}(g_1) \mid n \text{ và } \operatorname{ord}(g_2) \mid n \iff \operatorname{lcm}(\operatorname{ord}(g_1), \operatorname{ord}(g_2)) \mid n$.

Vậy $\operatorname{ord}(g_1, g_2) = \operatorname{lcm}(\operatorname{ord}(g_1), \operatorname{ord}(g_2))$. $\blacksquare$

---

## 2. Khi Nào $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$?

> [!abstract] Theorem 13.5 — Tiêu chuẩn tích trực tiếp cyclic
> $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ khi và chỉ khi $\gcd(m, n) = 1$.

**Proof.**
$(\Rightarrow)$ Giả sử $\gcd(m,n) = d > 1$. Mọi phần tử $(a,b) \in \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ có cấp chia $\operatorname{lcm}(m,n) = mn/d < mn$. Vậy không có phần tử cấp $mn$ trong $\mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$, nên nhóm này không cyclic và không thể đẳng cấu với $\mathbb{Z}/mn\mathbb{Z}$ (cyclic cấp $mn$).

$(\Leftarrow)$ Giả sử $\gcd(m,n) = 1$. Xét $(1, 1) \in \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$. Cấp của $(1,1)$ là $\operatorname{lcm}(m,n) = mn$ (vì $\gcd(m,n)=1$). Vậy $(1,1)$ sinh toàn bộ nhóm $\mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$, nên nhóm này cyclic cấp $mn$, tức $\cong \mathbb{Z}/mn\mathbb{Z}$. $\blacksquare$

> [!abstract] Corollary 13.6 — Phân tích theo lũy thừa nguyên tố
> Nếu $n = p_1^{a_1} p_2^{a_2} \cdots p_r^{a_r}$, thì:
>
> $$
> \mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}/p_1^{a_1}\mathbb{Z} \times \mathbb{Z}/p_2^{a_2}\mathbb{Z} \times \cdots \times \mathbb{Z}/p_r^{a_r}\mathbb{Z}
> $$

**Proof.** Áp dụng Theorem 13.5 nhiều lần, các $p_i^{a_i}$ đôi một nguyên tố cùng nhau. $\blacksquare$

---

## 3. Tích Trực Tiếp Trong (Internal Direct Product)

> [!definition] Definition 13.7 — Tích trực tiếp trong (Internal Direct Product)
> Cho $G$ là nhóm và $H, K \leq G$. Ta nói $G$ là **tích trực tiếp trong** của $H$ và $K$, ký hiệu $G = H \times K$ (nội), nếu:
>
> 1. $H \trianglelefteq G$ và $K \trianglelefteq G$.
> 2. $H \cap K = \{e\}$.
> 3. $G = HK$ (tức mọi $g \in G$ viết được dạng $g = hk$ với $h \in H$, $k \in K$).

> [!abstract] Theorem 13.8 — Tương đương ngoài và trong
> Nếu $G = H \times K$ (tích trực tiếp trong), thì $G \cong H \times K$ (tích trực tiếp ngoài).

**Proof.**
Định nghĩa $\phi: H \times K \to G$ bởi $\phi(h, k) = hk$.

Trước hết chứng minh $hk = kh$ với mọi $h \in H$, $k \in K$: $hkh^{-1}k^{-1} = (hkh^{-1})k^{-1}$; vì $K \trianglelefteq G$, $hkh^{-1} \in K$, nên $hkh^{-1}k^{-1} \in K$. Tương tự $\in H$. Vậy $hkh^{-1}k^{-1} \in H \cap K = \{e\}$, tức $hk = kh$.

Từ đó: $\phi((h_1,k_1)(h_2,k_2)) = \phi(h_1h_2, k_1k_2) = h_1h_2k_1k_2 = h_1k_1h_2k_2 = \phi(h_1,k_1)\phi(h_2,k_2)$.

**Đơn ánh**: $\phi(h,k) = e \Rightarrow hk = e \Rightarrow h = k^{-1}$. Vì $h \in H$ và $k^{-1} \in K$, $h \in H \cap K = \{e\}$, tức $h = k = e$.

**Toàn ánh**: $G = HK$, mọi $g = hk$. $\blacksquare$

> [!tip] Practical Note 13.9
> Với $G$ hữu hạn, điều kiện $G = HK$ tương đương với $|G| = |H| \cdot |K|$ (khi đã biết $H \cap K = \{e\}$). Thật vậy: $|HK| = |H||K|/|H \cap K| = |H||K|$, nên $|HK| = |G|$ và $HK \subseteq G$ suy ra $HK = G$.

---

## 4. Định Lý Cơ Bản về Nhóm Abel Hữu Hạn (FTFAG)

> [!abstract] Theorem 13.10 — Định lý cơ bản về nhóm Abel hữu hạn (Fundamental Theorem of Finite Abelian Groups — FTFAG)
> Mọi nhóm Abel hữu hạn $G$ đều đẳng cấu với tích trực tiếp của các nhóm cyclic. Có **hai dạng phân tích** tương đương:
>
> **Dạng nhân tử bất biến** (Invariant Factor Form):
>
> $$
> G \cong \mathbb{Z}/d_1\mathbb{Z} \times \mathbb{Z}/d_2\mathbb{Z} \times \cdots \times \mathbb{Z}/d_k\mathbb{Z}
> $$
>
> với $d_1 \mid d_2 \mid \cdots \mid d_k$ và $d_i \geq 2$. Các $d_i$ được gọi là **nhân tử bất biến** (invariant factors) và xác định duy nhất $G$.
>
> **Dạng phân tích sơ cấp** (Primary Decomposition):
>
> $$
> G \cong \prod_p \prod_j \mathbb{Z}/p^{a_{p,j}}\mathbb{Z}
> $$
>
> là tích trực tiếp của các nhóm cyclic cấp là lũy thừa nguyên tố. Các lũy thừa này (gọi là **elementary divisors**) xác định duy nhất $G$.

> [!note] Remark 13.11 — Hậu quả phân loại
> FTFAG cho phép phân loại hoàn toàn các nhóm Abel hữu hạn: hai nhóm Abel hữu hạn đẳng cấu **khi và chỉ khi** chúng có cùng nhân tử bất biến (hay cùng elementary divisors).

**Proof Sketch** (sử dụng cấu trúc $p$-component).

**Bước 1 — Phân tích Sylow**: Với $G$ Abel hữu hạn, $|G| = p_1^{a_1} \cdots p_r^{a_r}$. Định nghĩa $p$-component: $G_p = \{g \in G \mid \operatorname{ord}(g) = p^k \text{ với một } k\}$. Khi đó $G = G_{p_1} \times G_{p_2} \times \cdots \times G_{p_r}$ (tích trực tiếp trong).

**Bước 2 — Cấu trúc $p$-group Abel**: Với $G$ là nhóm Abel hữu hạn $p$-group, cần chứng minh $G \cong \mathbb{Z}/p^{a_1}\mathbb{Z} \times \cdots \times \mathbb{Z}/p^{a_k}\mathbb{Z}$.

Ý tưởng: lấy phần tử $g_1$ có cấp lớn nhất $p^{a_1}$. Chứng minh tồn tại nhóm con $K_1 \leq G$ sao cho $G = \langle g_1 \rangle \times K_1$. Quy nạp trên $|G|$.

**Bước 3 — Tính duy nhất**: Dùng tính bất biến của hạng (rank) và cấu trúc của các quotient $p^k G / p^{k+1} G$ để chứng minh elementary divisors là bất biến đẳng cấu.

*(Chứng minh đầy đủ: xem Dummit & Foote §5.2, Hungerford Chapter II §2.)* $\blacksquare$

---

## 5. Ứng Dụng: Phân Loại Nhóm Abel Hữu Hạn Nhỏ

> [!example] Example 13.12 — Nhóm Abel cấp 12
> $12 = 4 \times 3 = 2^2 \times 3$. Tìm tất cả nhóm Abel cấp 12.
>
> **Phân tích sơ cấp**: Với $p = 2$: phân hoạch của $2$: $[2]$ hoặc $[1,1]$. Với $p = 3$: phân hoạch của $1$: $[1]$.
>
> Các khả năng:
> - $(2\text{-part}: \mathbb{Z}_4) \times (3\text{-part}: \mathbb{Z}_3) = \mathbb{Z}_4 \times \mathbb{Z}_3 \cong \mathbb{Z}_{12}$.
> - $(2\text{-part}: \mathbb{Z}_2 \times \mathbb{Z}_2) \times (3\text{-part}: \mathbb{Z}_3) = \mathbb{Z}_2 \times \mathbb{Z}_2 \times \mathbb{Z}_3 \cong \mathbb{Z}_2 \times \mathbb{Z}_6$.
>
> Vậy có **hai** nhóm Abel phân biệt (không đẳng cấu) cấp 12: $\mathbb{Z}_{12}$ và $\mathbb{Z}_2 \times \mathbb{Z}_6$.

> [!example] Example 13.13 — Nhóm Abel cấp 8
> $8 = 2^3$. Phân hoạch của $3$:
>
> - $[3]$: $\mathbb{Z}_8$.
> - $[2, 1]$: $\mathbb{Z}_4 \times \mathbb{Z}_2$.
> - $[1, 1, 1]$: $\mathbb{Z}_2 \times \mathbb{Z}_2 \times \mathbb{Z}_2$.
>
> Ba nhóm Abel phân biệt cấp 8. Dạng nhân tử bất biến:
> - $\mathbb{Z}_8$: nhân tử bất biến $(8)$.
> - $\mathbb{Z}_4 \times \mathbb{Z}_2$: nhân tử bất biến $(2, 4)$ (vì $2 \mid 4$).
> - $\mathbb{Z}_2^3$: nhân tử bất biến $(2, 2, 2)$.

> [!example] Example 13.14 — Nhóm Abel cấp 36
> $36 = 2^2 \times 3^2$. Nhóm Abel cấp 36:
>
> | $2$-part | $3$-part | Nhóm |
> |----------|----------|------|
> | $\mathbb{Z}_4$ | $\mathbb{Z}_9$ | $\mathbb{Z}_4 \times \mathbb{Z}_9 \cong \mathbb{Z}_{36}$ |
> | $\mathbb{Z}_4$ | $\mathbb{Z}_3 \times \mathbb{Z}_3$ | $\mathbb{Z}_4 \times \mathbb{Z}_3 \times \mathbb{Z}_3 \cong \mathbb{Z}_{12} \times \mathbb{Z}_3$ |
> | $\mathbb{Z}_2 \times \mathbb{Z}_2$ | $\mathbb{Z}_9$ | $\mathbb{Z}_2 \times \mathbb{Z}_2 \times \mathbb{Z}_9 \cong \mathbb{Z}_2 \times \mathbb{Z}_{18}$ |
> | $\mathbb{Z}_2 \times \mathbb{Z}_2$ | $\mathbb{Z}_3 \times \mathbb{Z}_3$ | $\mathbb{Z}_2 \times \mathbb{Z}_2 \times \mathbb{Z}_3 \times \mathbb{Z}_3 \cong \mathbb{Z}_6 \times \mathbb{Z}_6$ |
>
> Tổng cộng: **bốn** nhóm Abel phân biệt cấp 36.

---

## 6. Dạng Nhân Tử Bất Biến vs. Dạng Sơ Cấp

Chuyển đổi giữa hai dạng:

> [!example] Example 13.15 — Chuyển đổi dạng
> Cho $G = \mathbb{Z}_2 \times \mathbb{Z}_4 \times \mathbb{Z}_3 \times \mathbb{Z}_9$.
>
> **Dạng sơ cấp** (elementary divisors): $2, 2^2, 3, 3^2$.
>
> **Chuyển sang dạng nhân tử bất biến**: Sắp xếp elementary divisors theo nguyên tố và ghép từ lớn tới nhỏ theo mỗi nguyên tố:
>
> | Lượt | $p = 2$ | $p = 3$ |
> |------|---------|---------|
> | 1 (lớn nhất) | $4 = 2^2$ | $9 = 3^2$ |
> | 2 | $2 = 2^1$ | $3 = 3^1$ |
>
> Nhân tử bất biến: $d_1 = 2 \times 3 = 6$, $d_2 = 4 \times 9 = 36$.
>
> Kiểm tra: $6 \mid 36$. ✓
>
> Vậy $G \cong \mathbb{Z}_6 \times \mathbb{Z}_{36}$.

---

## 7. Số Lượng Nhóm Abel Cấp $n$

Số nhóm Abel hữu hạn phân biệt (không đẳng cấu) cấp $n = p_1^{a_1} \cdots p_r^{a_r}$ bằng:

$$
\prod_{i=1}^r p(a_i)
$$

trong đó $p(a)$ là **số phân hoạch** (partition number) của $a$ — số cách viết $a$ là tổng các số nguyên dương không tăng.

> [!example] Example 13.16 — Đếm nhóm Abel
> - Cấp $p^4$: $p(4) = 5$ nhóm ($\mathbb{Z}_{p^4}$, $\mathbb{Z}_{p^3} \times \mathbb{Z}_p$, $\mathbb{Z}_{p^2} \times \mathbb{Z}_{p^2}$, $\mathbb{Z}_{p^2} \times \mathbb{Z}_p^2$, $\mathbb{Z}_p^4$).
> - Cấp $p^2 q^2$ ($p \neq q$ nguyên tố): $p(2) \times p(2) = 2 \times 2 = 4$ nhóm.
> - Cấp $1000 = 2^3 \cdot 5^3$: $p(3) \times p(3) = 3 \times 3 = 9$ nhóm.
>
> Bảng $p(a)$ nhỏ: $p(1) = 1$, $p(2) = 2$, $p(3) = 3$, $p(4) = 5$, $p(5) = 7$, $p(6) = 11$.

---

## 8. SageMath Cheatsheet

```python
# ---- Tích trực tiếp của các nhóm hoán vị ----
G1 = CyclicPermutationGroup(4)
G2 = CyclicPermutationGroup(3)
G  = direct_product_permgroups([G1, G2])
print(G.order())              # 12
print(G.is_abelian())         # True
print(G.is_cyclic())          # True (vì gcd(4,3)=1)

# ---- Nhóm Abel từ các nhân tử bất biến ----
from sage.groups.abelian_gps.abelian_group import AbelianGroup

# Nhóm Abel cấp 8 — ba nhóm phân biệt
G8_1 = AbelianGroup([8])          # Z/8Z
G8_2 = AbelianGroup([4, 2])       # Z/4Z x Z/2Z
G8_3 = AbelianGroup([2, 2, 2])    # Z/2Z x Z/2Z x Z/2Z
for G in [G8_1, G8_2, G8_3]:
    print(G, "|G| =", G.order())

# ---- Nhóm Abel cấp 12 — hai nhóm phân biệt ----
G12_1 = AbelianGroup([12])
G12_2 = AbelianGroup([2, 6])      # Z/2Z x Z/6Z
print("Invariants of Z12:", G12_1.invariants())
print("Invariants of Z2 x Z6:", G12_2.invariants())

# ---- Nhân tử bất biến ----
G = AbelianGroup([2, 4, 3, 9])    # elementary divisors: 2,4,3,9
print("Invariant factors:", G.invariants())  # (6, 36)

# ---- Kiểm tra đẳng cấu ----
G_a = AbelianGroup([12])
G_b = AbelianGroup([3, 4])
print(G_a.is_isomorphic(G_b))     # True (gcd(3,4)=1)

G_c = AbelianGroup([2, 6])
print(G_a.is_isomorphic(G_c))     # False

# ---- Cấp của phần tử trong tích trực tiếp ----
# Z4 x Z6: phần tử (1,1)
G = AbelianGroup([4, 6])
g = G.gen(0)                       # generator của Z/4Z
h = G.gen(1)                       # generator của Z/6Z
print((g + h).order())             # lcm(4,6) = 12

# ---- Phân loại tất cả nhóm Abel cấp n ----
import sage.combinat.partition
def abelian_groups_of_order(n):
    """Liệt kê tất cả nhóm Abel phân biệt cấp n"""
    from sage.arith.misc import factor
    fac = factor(n)
    result = []
    for partitions in cartesian_product([Partitions(e) for p, e in fac]):
        elem_divs = []
        for (p, e), part in zip(fac, partitions):
            for a in part:
                elem_divs.append(p ** a)
        # Sắp xếp và tính invariant factors
        G = AbelianGroup(elem_divs)
        result.append(G.invariants())
    return result

print(abelian_groups_of_order(36)) # 4 nhóm
```

---

## 9. Summary

- **Tích trực tiếp ngoài** $G_1 \times G_2$: cặp $(g_1, g_2)$ với phép toán theo từng thành phần.
- $\operatorname{ord}(g_1, g_2) = \operatorname{lcm}(\operatorname{ord}(g_1), \operatorname{ord}(g_2))$.
- $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ $\iff$ $\gcd(m,n) = 1$.
- **Tích trực tiếp trong**: $G = HK$, $H \cap K = \{e\}$, $H,K \trianglelefteq G$ $\Rightarrow$ $G \cong H \times K$.
- **FTFAG**: Mọi nhóm Abel hữu hạn $\cong$ tích cyclic; phân loại hoàn toàn bởi:
  - *Dạng sơ cấp* (elementary divisors: lũy thừa nguyên tố).
  - *Dạng nhân tử bất biến* (invariant factors: $d_1 \mid d_2 \mid \cdots \mid d_k$).
- Số nhóm Abel cấp $n = \prod p_i^{a_i}$ bằng $\prod p(a_i)$ ($p$ = số phân hoạch).

---

## 10. References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), §5.1–§5.2.
- Judson, *Abstract Algebra: Theory and Applications*, Chapter 13.
- Hungerford, *Algebra*, Chapter II §2.
- Lang, *Algebra* (3rd ed.), Chapter I §10.
