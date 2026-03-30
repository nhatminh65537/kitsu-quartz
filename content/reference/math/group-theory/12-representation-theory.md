---
title: "12. Introduction to Representation Theory"
tags: [math, group-theory, lesson-12]
aliases: [Introduction to Representation Theory]
created: 2026-03-26
---

> **Prerequisites**: [[09-direct-and-semidirect-products|09. Direct and Semidirect Products]], [[10-composition-series|10. Composition Series and Solvable Groups]]
> **Objectives**:
> - Định nghĩa biểu diễn nhóm (group representation) và module $\mathbb{C}[G]$
> - Phát biểu và hiểu ý nghĩa định lý Maschke (khả quy hoàn toàn)
> - Định nghĩa character và hiểu tính trực giao của character
> - Xây dựng bảng character cho nhóm nhỏ
> - Nắm sơ lược ứng dụng: phân tích phổ đối xứng trong vật lý/hóa học

---

## Motivation / Intuition

Biểu diễn nhóm là cách "hiện thực hóa" nhóm trừu tượng thành các phép biến đổi tuyến tính cụ thể. Thay vì nghiên cứu nhóm $G$ trực tiếp, ta nghiên cứu tất cả các cách $G$ có thể tác động lên không gian vector — và từ đó suy ra tính chất của $G$.

Lý thuyết này có ứng dụng rộng rãi trong vật lý lý thuyết (đối xứng lượng tử, phân tích phổ phân tử), hóa học (orbital phân tử), và toán học (định lý số học phức tạp như định lý Weil).

Kết quả cốt lõi: **định lý Maschke** nói rằng mọi biểu diễn phức (trên $\mathbb{C}$) của nhóm hữu hạn đều phân tích được thành tổng trực tiếp của các biểu diễn bất khả quy — điều này không đúng cho nhóm vô hạn hay trường đặc số dương.

---

## Biểu diễn nhóm (Group Representation)

### Definition

> [!definition] Definition 12.1 — Biểu diễn nhóm (Representation)
> Một **biểu diễn** (representation) của nhóm $G$ trên không gian vector $V$ (hữu chiều, trên trường $\mathbb{F}$) là đồng cấu nhóm:
>
> $$
> \rho : G \to \operatorname{GL}(V)
> $$
>
> Chiều của biểu diễn: $\dim_\mathbb{F} V$.
>
> Các biểu diễn quan trọng:
>
> - **Biểu diễn tầm thường** (trivial): $\rho(g) = \operatorname{Id}$ với mọi $g$.
> - **Biểu diễn chính quy** (regular): $V = \mathbb{F}[G]$ (không gian vector với basis $\{g : g \in G\}$), $\rho(g)(h) = gh$.
> - **Biểu diễn hoán vị**: từ action $G \curvearrowright X$, $V = \mathbb{F}^X$, $\rho(g)e_x = e_{g\cdot x}$.
>
> [!definition] Definition 12.2 — $\mathbb{C}[G]$-module và đẳng cấu biểu diễn
> Biểu diễn $\rho : G \to \operatorname{GL}(V)$ tương đương với cấu trúc $\mathbb{C}[G]$-module trên $V$, trong đó $\mathbb{C}[G] = \left\{ \sum_{g \in G} a_g g : a_g \in \mathbb{C} \right\}$ là **group algebra**.
>
> Hai biểu diễn $\rho : G \to \operatorname{GL}(V)$ và $\rho' : G \to \operatorname{GL}(W)$ **đẳng cấu** nếu tồn tại đẳng cấu tuyến tính $T : V \to W$ sao cho $T \circ \rho(g) = \rho'(g) \circ T$ với mọi $g \in G$.
>
> [!definition] Definition 12.3 — Biểu diễn con và bất khả quy
> Không gian con $W \subseteq V$ là **bất biến** (invariant) với $\rho$ nếu $\rho(g)W \subseteq W$ với mọi $g$.
>
> Biểu diễn $\rho$ gọi là:
>
> - **Khả quy** (reducible): nếu $V$ có không gian con bất biến khác $\{0\}$ và $V$.
> - **Bất khả quy** (irreducible) hay **irrep**: nếu $V$ không có không gian con bất biến nào khác $\{0\}$ và $V$.
> - **Khả quy hoàn toàn** (completely reducible): nếu $V = W_1 \oplus W_2 \oplus \cdots \oplus W_k$ với mọi $W_i$ bất biến và bất khả quy.

---

## Định lý Maschke

> [!abstract] Theorem 12.4 — Định lý Maschke (Maschke's Theorem)
> Nếu $G$ là nhóm hữu hạn và $\operatorname{char}(\mathbb{F}) \nmid |G|$ (đặc biệt, $\mathbb{F} = \mathbb{C}$), thì mọi biểu diễn hữu chiều của $G$ là **khả quy hoàn toàn**.
>
> Nói cách khác: mọi biểu diễn phức hữu hạn chiều của $G$ là tổng trực tiếp của các biểu diễn bất khả quy.

Xem chứng minh đầy đủ tại [[a3-proof-of-maschke|A3. Proof of Maschke's Theorem]].

**Proof sketch.**
Cho $W \subseteq V$ là không gian con bất biến. Cần tìm bổ sung bất biến $W' \subseteq V$ với $V = W \oplus W'$.

Lấy bất kỳ bổ sung $U$ (không nhất thiết bất biến). Chiếu $\pi_0 : V \to W$ theo $U$. Định nghĩa trung bình hóa:

$$
\pi = \frac{1}{|G|} \sum_{g \in G} \rho(g) \circ \pi_0 \circ \rho(g)^{-1}
$$

Khi đó $\pi : V \to W$ là chiếu bất biến (commute với mọi $\rho(g)$). Đặt $W' = \ker\pi$; đây là bất biến và $V = W \oplus W'$. $\blacksquare$

---

## Character

> [!definition] Definition 12.5 — Character của biểu diễn
> **Character** của biểu diễn $\rho : G \to \operatorname{GL}(V)$ là hàm:
>
> $$
> \chi_\rho : G \to \mathbb{C}, \quad \chi_\rho(g) = \operatorname{tr}(\rho(g))
> $$
>
> trong đó $\operatorname{tr}$ là trace (vết) của ma trận.
>
> [!abstract] Theorem 12.6 — Tính chất character
> 1. $\chi_\rho(e) = \dim V$ (chiều của biểu diễn).
> 2. $\chi_\rho(g^{-1}) = \overline{\chi_\rho(g)}$ (liên hợp phức).
> 3. $\chi_\rho$ là hàm lớp (class function): $\chi_\rho(hgh^{-1}) = \chi_\rho(g)$.
> 4. $\chi_{\rho \oplus \sigma} = \chi_\rho + \chi_\sigma$; $\chi_{\rho \otimes \sigma} = \chi_\rho \cdot \chi_\sigma$.
> 5. $\rho \cong \sigma \Rightarrow \chi_\rho = \chi_\sigma$.

**Proof (tính chất 3).**
$\chi_\rho(hgh^{-1}) = \operatorname{tr}(\rho(h)\rho(g)\rho(h)^{-1}) = \operatorname{tr}(\rho(g)) = \chi_\rho(g)$ (trace bất biến với phép liên hợp). $\blacksquare$

### Tích vô hướng character

> [!definition] Definition 12.7 — Tích vô hướng (Inner Product on Class Functions)
> Trên không gian hàm lớp $\operatorname{CF}(G)$, định nghĩa tích vô hướng:
>
> $$
> \langle \chi, \psi \rangle = \frac{1}{|G|} \sum_{g \in G} \chi(g) \overline{\psi(g)}
> $$
>
> [!abstract] Theorem 12.8 — Quan hệ trực giao thứ nhất (First Orthogonality)
> Nếu $\chi$ và $\psi$ là character của hai biểu diễn bất khả quy $\rho$ và $\sigma$:
>
> $$
> \langle \chi_\rho, \chi_\sigma \rangle = \begin{cases} 1 & \text{nếu } \rho \cong \sigma \\ 0 & \text{nếu } \rho \not\cong \sigma \end{cases}
> $$
>
> [!abstract] Theorem 12.9 — Số biểu diễn bất khả quy
> Số lớp biểu diễn bất khả quy phân biệt của $G$ (đến đẳng cấu) bằng **số lớp liên hợp** của $G$.
>
> Hơn nữa, nếu $\chi_1, \ldots, \chi_k$ là tất cả irreducible character thì:
>
> $$
> \sum_{i=1}^k (\chi_i(e))^2 = \sum_{i=1}^k (\dim V_i)^2 = |G|
> $$

---

## Bảng Character (Character Table)

> [!example] Example 12.10 — Bảng character của $S_3$
> $S_3$ có $3$ lớp liên hợp: $\{e\}$, $\{(12),(13),(23)\}$, $\{(123),(132)\}$. Nên có $3$ irrep.
>
> Từ điều kiện $1^2 + 1^2 + 2^2 = 6 = |S_3|$: ba chiều là $1, 1, 2$.
>
> | | $e$ | $(12)$ | $(123)$ |
> |-|-----|--------|---------|
> | $\chi_1$ (trivial) | $1$ | $1$ | $1$ |
> | $\chi_2$ (sign) | $1$ | $-1$ | $1$ |
> | $\chi_3$ (standard) | $2$ | $0$ | $-1$ |
>
> Kiểm tra trực giao: $\langle \chi_1, \chi_3 \rangle = \frac{1}{6}(1\cdot2 + 3\cdot1\cdot0 + 2\cdot1\cdot(-1)) = \frac{1}{6}(2+0-2) = 0$. ✓
>
> [!example] Example 12.11 — Bảng character của $\mathbb{Z}_4$
> $\mathbb{Z}_4 = \{0,1,2,3\}$ Abel, nên mọi irrep có chiều $1$. Số lớp liên hợp = $4$ (vì Abel). Tất cả $4$ irrep đều $1$-chiều.
>
> Đặt $\omega = e^{2\pi i/4} = i$. Character: $\chi_k(m) = \omega^{km} = i^{km}$, $k = 0,1,2,3$.
>
> | | $0$ | $1$ | $2$ | $3$ |
> |-|-----|-----|-----|-----|
> | $\chi_0$ | $1$ | $1$ | $1$ | $1$ |
> | $\chi_1$ | $1$ | $i$ | $-1$ | $-i$ |
> | $\chi_2$ | $1$ | $-1$ | $1$ | $-1$ |
> | $\chi_3$ | $1$ | $-i$ | $-1$ | $i$ |
>
> [!abstract] Theorem 12.12 — Quan hệ trực giao thứ hai (Second Orthogonality)
> Với mọi $g, h \in G$:
>
> $$
> \sum_{i=1}^k \chi_i(g) \overline{\chi_i(h)} = \begin{cases} |C_G(g)| & \text{nếu } g \text{ và } h \text{ liên hợp} \\ 0 & \text{nếu không} \end{cases}
> $$

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(3)
G.character_table()

G = CyclicPermutationGroup(4)
G.character_table()

G = SymmetricGroup(3)
rho = G.trivial_character()
rho.values()

G = SymmetricGroup(4)
chars = G.character_table()
chars.nrows()
```

---

## Summary / Key Takeaways

- Biểu diễn $\rho : G \to \operatorname{GL}(V)$: đồng cấu nhóm vào nhóm các phép biến đổi tuyến tính.
- Tương đương với cấu trúc $\mathbb{C}[G]$-module.
- **Định lý Maschke**: mọi biểu diễn phức của nhóm hữu hạn là khả quy hoàn toàn (tổng trực tiếp irrep).
- **Character** $\chi_\rho(g) = \operatorname{tr}(\rho(g))$: là hàm lớp, xác định biểu diễn đến đẳng cấu.
- Số irrep $=$ số lớp liên hợp; $\sum_i (\dim V_i)^2 = |G|$.
- **Quan hệ trực giao I**: $\langle \chi_\rho, \chi_\sigma \rangle = \delta_{\rho\sigma}$ (Kronecker delta).
- **Quan hệ trực giao II**: trực giao các cột bảng character.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 18.
- Serre, J.-P. *Linear Representations of Finite Groups*. Springer GTM 42.
- Fulton, W., Harris, J. *Representation Theory: A First Course*. Springer GTM 129.
- https://doc.sagemath.org/html/en/reference/groups/sage/groups/class_function.html
