---
title: "10. Composition Series and Solvable Groups"
tags: [math, group-theory, lesson-10]
aliases: [Composition Series and Solvable Groups]
created: 2026-03-26
---

> **Prerequisites**: [[05-normal-subgroups|05. Normal Subgroups and Quotient Groups]], [[06-group-homomorphisms|06. Group Homomorphisms]]
> **Objectives**:
> - Định nghĩa chuỗi hợp thành và nhân tử hợp thành (composition factors)
> - Phát biểu và hiểu ý nghĩa định lý Jordan–Hölder
> - Định nghĩa nhóm giải được (solvable group) và nhóm nilpotent
> - Chứng minh các tính chất đóng của nhóm giải được
> - Liên hệ với giải phương trình bằng căn thức (preview bài 13)

---

## Motivation / Intuition

Ý tưởng cốt lõi: muốn phân tích nhóm $G$ thành các "mảnh nguyên tử" không thể chia nhỏ thêm. Phép phân tích này gọi là **chuỗi hợp thành** (composition series), và các mảnh nguyên tử — nhóm thương $G_i/G_{i+1}$ — gọi là **nhân tử hợp thành** (composition factors). Định lý Jordan–Hölder nói rằng dù ta phân tích theo con đường nào, các mảnh nguyên tử vẫn là như nhau.

Đây là analog của **Định lý phân tích nhân tử nguyên tố** trong số học, nhưng dành cho nhóm.

Từ đó, **nhóm giải được** (solvable group) là nhóm mà tất cả nhân tử hợp thành đều cyclic (thuộc $\mathbb{Z}_p$). Galois chứng minh: phương trình $f(x) = 0$ giải được bằng căn thức $\iff$ nhóm Galois của $f$ là nhóm giải được. Và vì $S_5$ không giải được, phương trình bậc 5 tổng quát không thể giải bằng căn.

---

## Chuỗi hợp thành (Composition Series)

### Definition

> [!definition] Definition 10.1 — Chuỗi con chuẩn tắc (Subnormal Series)
> Một **chuỗi con chuẩn tắc** (subnormal series) của $G$ là dãy nhóm con:
>
> $$
> G = G_0 \supsetneq G_1 \supsetneq G_2 \supsetneq \cdots \supsetneq G_n = \{e\}
> $$
>
> với $G_{i+1} \trianglelefteq G_i$ với mọi $i$.
>
> **Nhân tử** (factors) của chuỗi: các nhóm thương $G_i / G_{i+1}$.
>
> Chuỗi gọi là **chuỗi hợp thành** (composition series) nếu mỗi nhân tử $G_i/G_{i+1}$ là **nhóm đơn** (simple group), tức không có nhóm con chuẩn tắc khác $\{e\}$ và chính nó.
>
> [!note] Remark 10.2 — Nhóm đơn hữu hạn
> Nhóm đơn hữu hạn Abel duy nhất là $\mathbb{Z}_p$ ($p$ nguyên tố). Nhóm đơn hữu hạn không Abel: $A_5$ (bậc $60$), $A_6$, $\text{PSL}(2,7)$, ... Phân loại đầy đủ nhóm đơn hữu hạn là một thành tựu vĩ đại của thế kỷ 20 (hoàn thành 2004).
>
> [!example] Example 10.3 — Chuỗi hợp thành của $S_4$
> $$
> S_4 \supsetneq A_4 \supsetneq V_4 \supsetneq \langle (12)(34) \rangle \supsetneq \{e\}
> $$
>
> Nhân tử:
> - $S_4/A_4 \cong \mathbb{Z}_2$
> - $A_4/V_4 \cong \mathbb{Z}_3$
> - $V_4/\langle(12)(34)\rangle \cong \mathbb{Z}_2$
> - $\langle(12)(34)\rangle/\{e\} \cong \mathbb{Z}_2$
>
> Chuỗi dài $4$; các nhân tử đều là $\mathbb{Z}_2$ hoặc $\mathbb{Z}_3$ (nhóm đơn Abel).

---

## Định lý Jordan–Hölder

> [!abstract] Theorem 10.4 — Định lý Jordan–Hölder
> Nếu $G$ hữu hạn và $G \neq \{e\}$, thì:
>
> 1. $G$ có chuỗi hợp thành.
> 2. Bất kỳ hai chuỗi hợp thành của $G$ đều có cùng độ dài và cùng tập hợp nhân tử hợp thành (đến thứ tự và đẳng cấu).

Xem chứng minh đầy đủ tại [[a2-proof-of-jordan-holder|A2. Proof of Jordan–Hölder Theorem]].

**Proof sketch (tồn tại).**
Vì $G$ hữu hạn, mọi chuỗi con chuẩn tắc có độ dài hữu hạn. Nếu $G_i/G_{i+1}$ không đơn, ta có thể chèn thêm. Quá trình dừng vì $|G|$ hữu hạn. $\blacksquare$

> [!note] Remark 10.5 — Ý nghĩa
> Định lý Jordan–Hölder đảm bảo rằng **nhân tử hợp thành** là bất biến của nhóm, không phụ thuộc vào chuỗi cụ thể được chọn. Đây là lý do chúng ta có thể nói đến "phân tích nguyên tố" của nhóm hữu hạn.

---

## Nhóm giải được (Solvable Groups)

### Definition

> [!definition] Definition 10.6 — Nhóm giải được (Solvable Group)
> Nhóm $G$ gọi là **giải được** (solvable) nếu $G$ có chuỗi con chuẩn tắc:
>
> $$
> G = G_0 \supsetneq G_1 \supsetneq \cdots \supsetneq G_n = \{e\}
> $$
>
> với mọi nhân tử $G_i/G_{i+1}$ là **Abel**.
>
> Tương đương: $G$ giải được $\iff$ $G$ có chuỗi hợp thành với mọi nhân tử là $\mathbb{Z}_p$.
>
> [!note] Remark 10.7 — Liên hệ với derived series
> Chuỗi dẫn xuất (derived series) của $G$:
>
> $$
> G = G^{(0)} \supsetneq G^{(1)} = [G,G] \supsetneq G^{(2)} = [G^{(1)},G^{(1)}] \supsetneq \cdots
> $$
>
> $G$ giải được $\iff$ $G^{(n)} = \{e\}$ với một $n$ nào đó.
>
> [!abstract] Theorem 10.8 — Tính chất đóng của nhóm giải được
> 1. Nhóm con của nhóm giải được là giải được.
> 2. Nhóm thương của nhóm giải được là giải được.
> 3. Nếu $N \trianglelefteq G$, $N$ giải được, và $G/N$ giải được, thì $G$ giải được.

**Proof.**
(1) Nếu $G$ giải được với chuỗi $G = G_0 \supset \cdots \supset G_n = \{e\}$, thì với $H \leq G$, chuỗi $H = H \cap G_0 \supseteq H \cap G_1 \supseteq \cdots \supseteq \{e\}$ là chuỗi con chuẩn tắc của $H$ với nhân tử $H \cap G_i / H \cap G_{i+1}$ nhúng vào $G_i/G_{i+1}$ (Abel), nên Abel.

(2) Hình chiếu chuỗi của $G$ xuống $G/N$.

(3) Từ chuỗi của $N$ và ảnh ngược chuỗi của $G/N$, ghép lại. $\blacksquare$

> [!example] Example 10.9 — Các ví dụ nhóm giải được
> - Mọi nhóm Abel: giải được (chuỗi $G \supset \{e\}$ với nhân tử $G$ Abel).
> - $S_3$: giải được. Chuỗi $S_3 \supset A_3 \supset \{e\}$; nhân tử $S_3/A_3 \cong \mathbb{Z}_2$ và $A_3 \cong \mathbb{Z}_3$.
> - $S_4$: giải được (từ Example 10.3, mọi nhân tử là $\mathbb{Z}_2$ hoặc $\mathbb{Z}_3$).
> - $A_4$: giải được. Chuỗi $A_4 \supset V_4 \supset \langle(12)(34)\rangle \supset \{e\}$.
> - $S_5$, $A_5$: **không** giải được — $A_5$ là nhóm đơn không Abel (nhân tử hợp thành duy nhất là $A_5$ chính nó).
>
> [!warning] Counterexample 10.10 — $S_n$ không giải được với $n \geq 5$
> Với $n \geq 5$: $A_n$ là nhóm đơn không Abel. Chuỗi hợp thành của $S_n$ là $S_n \supset A_n \supset \{e\}$ với nhân tử $A_n$ không Abel, không đơn Abel. Vậy $S_n$ không giải được.

---

## Nhóm Nilpotent

> [!definition] Definition 10.11 — Dãy trung tâm trên (Upper Central Series)
> Dãy trung tâm trên của $G$:
>
> $$
> \{e\} = Z_0 \leq Z_1 = Z(G) \leq Z_2 \leq \cdots
> $$
>
> trong đó $Z_{i+1}/Z_i = Z(G/Z_i)$.
>
> $G$ gọi là **nilpotent** nếu $Z_c = G$ với một $c$ nào đó. Số $c$ nhỏ nhất như vậy gọi là **class nilpotent** của $G$.
>
> [!abstract] Theorem 10.12 — Tính chất nhóm nilpotent
> 1. Mọi $p$-nhóm hữu hạn là nilpotent.
> 2. Mọi nhóm nilpotent là giải được.
> 3. $G$ nilpotent hữu hạn $\iff$ $G$ là tích trực tiếp của các nhóm Sylow của nó.

**Proof (phần 2).**
Từ dãy trung tâm trên: mỗi nhân tử $Z_{i+1}/Z_i \leq Z(G/Z_i)$, nên Abel. $\blacksquare$

> [!example] Example 10.13 — Phân loại nilpotent
> - $\mathbb{Z}_n$: nilpotent class $1$ (vì $Z(\mathbb{Z}_n) = \mathbb{Z}_n$).
> - $\mathbb{Z}_4$: nilpotent class $1$.
> - $D_8$ (dihedral bậc $8$): nilpotent class $2$. $Z(D_8) = \{e, r^2\} \cong \mathbb{Z}_2$, và $D_8/Z(D_8) \cong \mathbb{Z}_2^2$ Abel.
> - $S_3$: **không** nilpotent (vì $Z(S_3) = \{e\}$, dãy dừng ngay).
> - Mọi $p$-nhóm: nilpotent (từ Corollary 7.11 và quy nạp).

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(4)
G.composition_series()

G = SymmetricGroup(4)
G.composition_factors()

G = SymmetricGroup(3)
G.is_solvable()

G = SymmetricGroup(5)
G.is_solvable()

G = DihedralGroup(4)
G.is_nilpotent()
G.nilpotency_class()

G = SymmetricGroup(4)
G.derived_series()
```

---

## Summary / Key Takeaways

- **Chuỗi hợp thành**: dãy $G = G_0 \supset \cdots \supset G_n = \{e\}$ với mọi nhân tử $G_i/G_{i+1}$ là nhóm đơn.
- **Định lý Jordan–Hölder**: mọi hai chuỗi hợp thành có cùng độ dài và cùng nhân tử (đến thứ tự và đẳng cấu).
- **Nhóm giải được**: nhân tử hợp thành đều là $\mathbb{Z}_p$; tương đương derived series kết thúc tại $\{e\}$.
- Nhóm giải được đóng với nhóm con, nhóm thương, và extension.
- $S_n$ giải được $\iff$ $n \leq 4$.
- **Nhóm nilpotent**: dãy trung tâm trên đạt $G$; mọi nilpotent là giải được; $p$-nhóm luôn nilpotent.
- Nhóm nilpotent hữu hạn $\cong$ tích trực tiếp các nhóm Sylow.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 6.
- Hungerford, T. W. *Algebra*, Chapter II §§7–8.
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §§7–8.
- Milne, J. S. *Group Theory* (v4.00), Chapter 6. https://www.jmilne.org/math/CourseNotes/GT.pdf
