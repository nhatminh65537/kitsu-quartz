---
title: "11. Free Groups and Presentations"
tags: [math, group-theory, lesson-11]
aliases: [Free Groups and Presentations]
created: 2026-03-26
---

> **Prerequisites**: [[06-group-homomorphisms|06. Group Homomorphisms]]
> **Objectives**:
> - Xây dựng nhóm tự do (free group) bằng tính chất phổ quát
> - Hiểu biểu diễn nhóm bằng generators và relations
> - Nhận diện các nhóm thông dụng qua biểu diễn: $D_{2n}$, $Q_8$, $\mathbb{Z}_n$
> - Nắm sơ lược về word problem và bài toán đẳng cấu nhóm

---

## Motivation / Intuition

Cho đến nay ta đã gặp nhóm qua các ví dụ cụ thể: nhóm số, nhóm ma trận, nhóm hoán vị. Nhưng làm thế nào để **tạo ra** nhóm với tính chất đặc biệt mà ta muốn?

Nhóm tự do là "nhóm phổ quát nhất" sinh bởi một tập hợp $S$ — không có quan hệ nào ngoài những quan hệ bắt buộc từ tiên đề nhóm. Từ đó, **mọi nhóm** đều là nhóm thương của một nhóm tự do nào đó, và ta có thể mô tả nhóm bất kỳ bằng bộ **generators và relations**. Đây là ngôn ngữ tự nhiên của topology đại số, lý thuyết nhóm hình học, và khoa học máy tính lý thuyết.

---

## Nhóm tự do (Free Group)

### Definition

> [!definition] Definition 11.1 — Nhóm tự do (Free Group)
> Cho $S$ là tập hợp tùy ý (tập **generators**). **Nhóm tự do** (free group) sinh bởi $S$, ký hiệu $F(S)$ hay $F_S$, là nhóm thỏa **tính chất phổ quát** (universal property):
>
> Tồn tại ánh xạ $\iota : S \to F(S)$ sao cho với mọi nhóm $G$ và mọi ánh xạ $f : S \to G$, tồn tại duy nhất đồng cấu $\bar{f} : F(S) \to G$ thỏa $\bar{f} \circ \iota = f$:
>
> $$
> \begin{array}{ccc}
> S & \xrightarrow{\iota} & F(S) \\
> & \searrow f & \downarrow \exists!\,\bar{f} \\
> & & G
> \end{array}
> $$
>
> [!abstract] Theorem 11.2 — Xây dựng tường minh $F(S)$
> Đặt $S^{-1} = \{s^{-1} : s \in S\}$ (bản sao rời). **Word** là dãy hữu hạn từ $S \cup S^{-1}$:
>
> $$
> w = x_1^{\varepsilon_1} x_2^{\varepsilon_2} \cdots x_n^{\varepsilon_n}, \quad x_i \in S,\; \varepsilon_i \in \{\pm 1\}
> $$
>
> Word **rút gọn** (reduced): không chứa $ss^{-1}$ hay $s^{-1}s$ kề nhau. $F(S)$ là tập tất cả word rút gọn với phép nhân là ghép nối (concatenation) rồi rút gọn.
>
> Phần tử đơn vị: word rỗng $\varepsilon$. Nghịch đảo của $x_1^{\varepsilon_1}\cdots x_n^{\varepsilon_n}$: $x_n^{-\varepsilon_n} \cdots x_1^{-\varepsilon_1}$.
>
> [!abstract] Theorem 11.3 — Tính chất cơ bản của nhóm tự do
> 1. $F(S)$ tồn tại và duy nhất đến đẳng cấu.
> 2. $|S| = $ **rank** của $F(S)$; $F(S) \cong F(T) \iff |S| = |T|$.
> 3. $F(\emptyset) = \{e\}$, $F(\{s\}) \cong \mathbb{Z}$.
> 4. $F(S)$ không Abel (nếu $|S| \geq 2$): $ab \neq ba$ trong $F(\{a,b\})$.
> 5. Mọi nhóm là nhóm thương của một nhóm tự do.

**Proof (phần 5).**
Cho $G$ bất kỳ. Lấy $S = G$ và $f = \operatorname{id}_G : G \to G$. Theo tính chất phổ quát, có toàn cấu $\bar{f} : F(G) \to G$. Theo định lý đẳng cấu I: $F(G)/\ker\bar{f} \cong G$. $\blacksquare$

---

## Biểu diễn nhóm (Group Presentation)

> [!definition] Definition 11.4 — Biểu diễn nhóm (Presentation)
> Cho $S$ là tập generators và $R \subseteq F(S)$ là tập **relations** (word trong $F(S)$). **Biểu diễn** của nhóm $G$:
>
> $$
> G = \langle S \mid R \rangle = F(S) / \langle\!\langle R \rangle\!\rangle
> $$
>
> trong đó $\langle\!\langle R \rangle\!\rangle$ là nhóm con chuẩn tắc nhỏ nhất của $F(S)$ chứa $R$ (normal closure).
>
> Nhóm $G$ là phổ quát nhất với tính chất: mọi $s \in S$ thỏa mọi quan hệ $r = e$ với $r \in R$.
>
> [!example] Example 11.5 — Biểu diễn các nhóm thông dụng
>
> **Nhóm cyclic**: $\mathbb{Z}_n = \langle a \mid a^n \rangle$.
>
> **Nhóm dihedral**: $D_{2n} = \langle r, s \mid r^n, s^2, srs^{-1}r \rangle$ (tương đương $srs^{-1} = r^{-1}$).
>
> **Nhóm quaternion**: $Q_8 = \langle i, j \mid i^4, i^2 j^{-2}, ijij^{-1} \rangle$ (tương đương $i^4 = e$, $i^2 = j^2$, $ij = ji^{-1}$... hay ngắn hơn: $Q_8 = \langle i, j \mid i^4 = e,\; i^2 = j^2,\; ij = j^{-1}i\rangle$).
>
> **Nhóm tự do hạng 2**: $F_2 = \langle a, b \mid \emptyset \rangle$ — không có relation nào.
>
> **Nhóm Abel tự do hạng $n$**: $\mathbb{Z}^n = \langle a_1, \ldots, a_n \mid [a_i, a_j] = e \;\forall i,j \rangle$.
>
> [!abstract] Theorem 11.6 — Tính chất phổ quát của biểu diễn
> Nhóm $G = \langle S \mid R \rangle$ thỏa: với mọi nhóm $H$ và mọi ánh xạ $f : S \to H$ mà mọi relation $r \in R$ bằng $e_H$ khi thay $s \mapsto f(s)$, tồn tại duy nhất đồng cấu $\bar{f} : G \to H$ mở rộng $f$.

---

## Hệ quả cấu trúc

> [!abstract] Theorem 11.7 — Mọi nhóm hữu hạn có biểu diễn hữu hạn
> Nếu $|G| = n$, thì $G = \langle G \mid R \rangle$ với $R$ là tất cả quan hệ nhân trong bảng Cayley — một biểu diễn hữu hạn (nhưng thường không tối giản).
>
> [!abstract] Theorem 11.8 — Nhóm con của nhóm tự do là tự do (Schreier)
> Mọi nhóm con của nhóm tự do là nhóm tự do.
>
> Nếu $H \leq F_n$ và $[F_n : H] = k$, thì $\operatorname{rank}(H) = k(n-1) + 1$.
>
> [!example] Example 11.9 — Xác minh biểu diễn $D_8$
> $D_8 = \langle r, s \mid r^4 = s^2 = e,\; srs^{-1} = r^{-1} \rangle$.
>
> Các phần tử: $\{e, r, r^2, r^3, s, sr, sr^2, sr^3\}$, bậc $8$. ✓
>
> Kiểm tra: $(sr)^2 = srsr = s(rs)r = s(sr^{-1})r = s^2 r^{-1}r = e$. ✓
>
> [!warning] Counterexample 11.10 — Word Problem không thể giải được tổng quát
> Cho biểu diễn $G = \langle S \mid R \rangle$, **word problem** hỏi: cho word $w \in F(S)$, liệu $w = e$ trong $G$ không?
>
> Với nhóm hữu hạn, word problem luôn giải được. Nhưng tổng quát (nhóm vô hạn tùy ý), Novikov (1955) và Boone (1959) chứng minh tồn tại nhóm có word problem **không thể giải được** (undecidable). Đây là giao điểm sâu sắc giữa lý thuyết nhóm và lý thuyết tính toán.

---

## SageMath Cheatsheet

```sage
F = FreeGroup('a, b')
a, b = F.generators()
w = a * b * a^(-1) * b^(-1)
w

G = F / [F([1,1,1,1]), F([2,2]), F([2,1,-2,-1])]
G.order()

G = groups.presentation.Dihedral(4)
G.order()
G.generators()

G = groups.presentation.Quaternion()
G.order()
```

---

## Summary / Key Takeaways

- **Nhóm tự do** $F(S)$: nhóm phổ quát nhất sinh bởi $S$ — không có quan hệ ngoài tiên đề nhóm.
- $F(\{s\}) \cong \mathbb{Z}$; $F(S)$ không Abel với $|S| \geq 2$; rank duy nhất đến đẳng cấu.
- Mọi nhóm là thương của nhóm tự do: $G \cong F(S)/\langle\!\langle R \rangle\!\rangle$.
- **Biểu diễn** $G = \langle S \mid R \rangle$: ngôn ngữ tường minh mô tả nhóm.
- $D_{2n} = \langle r,s \mid r^n, s^2, srs^{-1}r \rangle$; $Q_8 = \langle i,j \mid i^4, i^2j^{-2}, iji^{-1}j \rangle$.
- Nhóm con của nhóm tự do là tự do (định lý Schreier).
- Word problem: giải được với nhóm hữu hạn, nhưng không thể giải được tổng quát.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 6.
- Hungerford, T. W. *Algebra*, Chapter II §9.
- Milne, J. S. *Group Theory* (v4.00), Chapter 2. https://www.jmilne.org/math/CourseNotes/GT.pdf
- Magnus, W., Karrass, A., Solitar, D. *Combinatorial Group Theory*.
