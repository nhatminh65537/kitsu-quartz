---
title: "11. Normal Subgroups and Quotient Groups"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-11]
aliases: [Normal Subgroups and Quotient Groups]
created: 2026-05-15
---

> **Prerequisites**: [[10-cosets-and-lagranges-theorem|10. Cosets and Lagrange's Theorem]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $G$ | Nhóm |
> | $H \leq G$ | $H$ là nhóm con của $G$ |
> | $[G:H]$ | Chỉ số của $H$ trong $G$ |
> | $gH$, $Hg$ | Lớp ghép trái, lớp ghép phải |
> | $gHg^{-1}$ | Liên hợp của $H$ bởi $g$ |
> | $Z(G)$ | Tâm của $G$ |
> | $\operatorname{ord}(g)$ | Cấp của phần tử $g$ |

> **Objectives**:
> - Định nghĩa nhóm con chuẩn tắc (normal subgroup) và nhiều tiêu chuẩn nhận biết.
> - Xây dựng nhóm thương (quotient group) $G/N$ và kiểm tra tính hợp lệ (well-definedness).
> - Hiểu phần tử giao hoán (commutator), nhóm con giao hoán $[G,G]$, và abelianization.
> - Liên hệ nhóm thương với cấu trúc abelianization.

---

## Motivation

Từ [[10-cosets-and-lagranges-theorem|10. Cosets and Lagrange's Theorem]], ta biết lớp ghép trái và phải của $H$ trong $G$ không nhất thiết trùng nhau ($gH \neq Hg$ nói chung). Câu hỏi: khi nào ta có thể **nhân** các lớp ghép với nhau để tạo thành một nhóm?

Ta muốn định nghĩa $(aH) \cdot (bH) = (ab)H$. Để điều này hợp lệ (well-defined), cần: nếu $aH = a'H$ và $bH = b'H$ thì $(ab)H = (a'b')H$. Điều kiện cần và đủ để điều này thỏa mãn chính là $gH = Hg$ với mọi $g$ — tức $H$ là **nhóm con chuẩn tắc**.

---

## 1. Nhóm Con Chuẩn Tắc (Normal Subgroup)

> [!definition] Definition 11.1 — Nhóm con chuẩn tắc (Normal Subgroup)
> Cho $G$ là nhóm và $N \leq G$. Ta nói $N$ là **nhóm con chuẩn tắc** của $G$, ký hiệu $N \trianglelefteq G$, nếu:
>
> $$
> \forall\, g \in G: \quad gN = Ng
> $$
>
> Hay tương đương: $\forall\, g \in G: gNg^{-1} = N$.

> [!abstract] Theorem 11.2 — Các tiêu chuẩn nhóm con chuẩn tắc
> Cho $N \leq G$. Các điều kiện sau tương đương:
>
> 1. $N \trianglelefteq G$.
> 2. $\forall\, g \in G: gNg^{-1} = N$.
> 3. $\forall\, g \in G: gNg^{-1} \subseteq N$.
> 4. $\forall\, g \in G, n \in N: gng^{-1} \in N$.
> 5. Lớp ghép trái và phải của $N$ trong $G$ trùng nhau: $\{gN \mid g \in G\} = \{Ng \mid g \in G\}$.

**Proof.**
(1) $\Leftrightarrow$ (2): $gN = Ng \iff gNg^{-1} = Ngg^{-1} = N$.
(2) $\Rightarrow$ (3): hiển nhiên.
(3) $\Rightarrow$ (2): $gNg^{-1} \subseteq N$ với mọi $g$, áp dụng với $g^{-1}$: $g^{-1}Ng \subseteq N$, tức $N \subseteq gNg^{-1}$. Kết hợp: $gNg^{-1} = N$.
(2) $\Leftrightarrow$ (4): hiển nhiên (điều kiện setwise vs. elementwise). $\blacksquare$

> [!tip] Practical Note 11.3 — Cách kiểm tra nhanh tính chuẩn tắc
> Trong thực hành, cách nhanh nhất để kiểm tra $N \trianglelefteq G$ là dùng điều kiện (4): với mọi $g \in G$ (thực ra chỉ cần kiểm tra trên tập sinh của $G$) và $n \in N$ (kiểm tra trên tập sinh của $N$), tính $gng^{-1}$ và xem có thuộc $N$ không.

---

## 2. Ví Dụ Nhóm Con Chuẩn Tắc

> [!example] Example 11.4 — Mọi nhóm con của nhóm Abel là chuẩn tắc
> Nếu $G$ Abel thì $gN = Ng$ với mọi $g, N$. Vậy **mọi** nhóm con của $G$ là chuẩn tắc.

> [!example] Example 11.5 — Nhóm con chuẩn tắc của $S_3$
> $S_3 = \{e, (12), (13), (23), (123), (132)\}$.
>
> $A_3 = \{e, (123), (132)\} \leq S_3$ ($|A_3| = 3$, chỉ số $[S_3:A_3] = 2$).
>
> Kiểm tra: $(12) A_3 = \{(12), (12)(123), (12)(132)\} = \{(12), (23), (13)\}$.
> $A_3(12) = \{(12), (123)(12), (132)(12)\} = \{(12), (13), (23)\}$.
>
> Vậy $(12)A_3 = A_3(12)$. Tương tự mọi $g$, nên $A_3 \trianglelefteq S_3$.
>
> Nhưng $H = \{e, (12)\}$ **không** chuẩn tắc: $(13)\{e,(12)\}(13)^{-1} = \{e, (23)\} \neq H$.

> [!abstract] Theorem 11.6 — Nhóm con chỉ số 2 luôn chuẩn tắc
> Nếu $[G:H] = 2$, thì $H \trianglelefteq G$.

**Proof.**
Với $g \in H$: $gH = H = Hg$. Với $g \notin H$: vì $[G:H] = 2$, $G = H \sqcup gH$ (hai lớp ghép trái), nên $gH = G \setminus H$. Tương tự $G = H \sqcup Hg$, nên $Hg = G \setminus H = gH$. Vậy $gH = Hg$ với mọi $g \in G$. $\blacksquare$

> [!example] Example 11.7 — Nhóm $A_n \trianglelefteq S_n$
> $[S_n : A_n] = 2$ (các hoán vị chẵn vs. lẻ), nên $A_n \trianglelefteq S_n$.

> [!example] Example 11.8 — $Z(G) \trianglelefteq G$ và $[G,G] \trianglelefteq G$
> - $Z(G) \trianglelefteq G$: với $g \in G$, $n \in Z(G)$: $gng^{-1} = ngg^{-1} = n \in Z(G)$.
> - $[G,G] \trianglelefteq G$: sẽ chứng minh ở Mục 5.

> [!note] Remark 11.9 — Nhóm đơn (Simple Group)
> Nhóm $G$ được gọi là **nhóm đơn** (simple group) nếu các nhóm con chuẩn tắc duy nhất của $G$ là $\{e\}$ và $G$. Ví dụ:
> - $A_n$ là nhóm đơn với $n \geq 5$ (định lý Galois–Jordan).
> - $\mathbb{Z}/p\mathbb{Z}$ là nhóm đơn (và Abel) với $p$ nguyên tố.
> - $PSL_n(\mathbb{F}_q)$ là họ nhóm đơn hữu hạn quan trọng.
>
> Phân loại nhóm đơn hữu hạn (Classification of Finite Simple Groups — CFSG) là một trong những thành tựu vĩ đại nhất của toán học thế kỷ 20.

---

## 3. Nhóm Thương (Quotient Group)

> [!abstract] Theorem 11.10 — Nhóm thương (Quotient Group)
> Cho $N \trianglelefteq G$. Tập các lớp ghép trái $G/N = \{gN \mid g \in G\}$ tạo thành nhóm với phép toán:
>
> $$
> (aN)(bN) = (ab)N
> $$
>
> Nhóm này được gọi là **nhóm thương** (quotient group) hay **factor group** của $G$ bởi $N$.
>
> - **Đơn vị**: $eN = N$.
> - **Nghịch đảo**: $(gN)^{-1} = g^{-1}N$.
> - **Cấp**: $|G/N| = [G:N] = |G|/|N|$.

**Proof (well-definedness).** Giả sử $aN = a'N$ và $bN = b'N$. Cần chứng minh $(ab)N = (a'b')N$, tức $a^{-1}a' \in N$ và $b^{-1}b' \in N$ $\Rightarrow$ $(ab)^{-1}(a'b') \in N$.

$(ab)^{-1}(a'b') = b^{-1}a^{-1}a'b' = b^{-1}(a^{-1}a')b \cdot (b^{-1}b')$.

Đặt $n_1 = a^{-1}a' \in N$ và $n_2 = b^{-1}b' \in N$. Khi đó:

$(ab)^{-1}(a'b') = b^{-1}n_1 b \cdot n_2$.

Vì $N \trianglelefteq G$: $b^{-1}n_1 b \in N$. Và $n_2 \in N$. Vậy tích $(b^{-1}n_1 b) n_2 \in N$.

Nên $(ab)N = (a'b')N$. $\blacksquare$

> [!example] Example 11.11 — $\mathbb{Z}/n\mathbb{Z}$
> $n\mathbb{Z} \trianglelefteq \mathbb{Z}$ (vì $\mathbb{Z}$ Abel). Nhóm thương:
>
> $\mathbb{Z}/n\mathbb{Z} = \{0 + n\mathbb{Z}, 1 + n\mathbb{Z}, \ldots, (n-1) + n\mathbb{Z}\}$
>
> với phép cộng $(a + n\mathbb{Z}) + (b + n\mathbb{Z}) = (a+b) + n\mathbb{Z}$. Đây chính là $\mathbb{Z}_n$!

> [!example] Example 11.12 — $S_3 / A_3$
> $A_3 \trianglelefteq S_3$, $[S_3:A_3] = 2$.
>
> $S_3/A_3 = \{A_3, (12)A_3\}$.
>
> Bảng Cayley: $(12)A_3 \cdot (12)A_3 = A_3$ (vì $(12)^2 = e \in A_3$). Vậy $S_3/A_3 \cong \mathbb{Z}/2\mathbb{Z}$.

> [!example] Example 11.13 — $Q_8 / \{\pm 1\}$
> $Q_8 = \{\pm 1, \pm i, \pm j, \pm k\}$ với $Z(Q_8) = \{\pm 1\}$.
>
> $Q_8 / Z(Q_8) = \{Z(Q_8), iZ(Q_8), jZ(Q_8), kZ(Q_8)\} \cong V_4 \cong \mathbb{Z}_2 \times \mathbb{Z}_2$.
>
> Kiểm tra: $(iZ)(jZ) = (ij)Z = kZ$, $(jZ)(iZ) = (ji)Z = (-k)Z = kZ$ (vì $-k \in kZ$ do $(-k)^{-1}k = -k^2 = 1 \in Z$). Vậy thương là Abel dù $Q_8$ không Abel!

---

## 4. Phần Tử Giao Hoán và Nhóm Con Giao Hoán

> [!definition] Definition 11.14 — Commutator và Commutator Subgroup
> Cho $G$ là nhóm.
>
> - **Phần tử giao hoán** (commutator) của $a, b \in G$:
>
> $$
> [a, b] = aba^{-1}b^{-1}
> $$
>
> Lưu ý: $[a,b] = e \iff ab = ba$ (hai phần tử giao hoán).
>
> - **Nhóm con giao hoán** (commutator subgroup / derived subgroup):
>
> $$
> [G, G] = G' = \langle [a,b] \mid a, b \in G \rangle
> $$
>
> Sinh bởi tất cả các commutator. **Lưu ý**: $[G,G]$ không nhất thiết bằng tập các commutator — tập này có thể không đóng với phép nhân. Phản ví dụ nhỏ nhất: nhóm cấp 96.

> [!abstract] Theorem 11.15 — Tính chất của $[G,G]$
> 1. $[G,G] \trianglelefteq G$.
> 2. $G/[G,G]$ là nhóm Abel.
> 3. Nếu $N \trianglelefteq G$ và $G/N$ Abel, thì $[G,G] \leq N$.
>
> Tức là $[G,G]$ là nhóm con chuẩn tắc nhỏ nhất của $G$ sao cho $G/[G,G]$ Abel. Ta gọi $G^{ab} = G/[G,G]$ là **abelianization** của $G$.

**Proof.**
1. Với $g \in G$ và $[a,b] \in [G,G]$: $g[a,b]g^{-1} = g(aba^{-1}b^{-1})g^{-1} = (gag^{-1})(gbg^{-1})(ga^{-1}g^{-1})(gb^{-1}g^{-1}) = [gag^{-1}, gbg^{-1}] \in [G,G]$. Vì mọi phần tử của $[G,G]$ là tích hữu hạn của commutator, và conjugation bảo toàn tính đó, $g[G,G]g^{-1} \subseteq [G,G]$. Vậy $[G,G] \trianglelefteq G$.

2. Trong $G/[G,G]$, với $a[G,G]$ và $b[G,G]$:
$(a[G,G])(b[G,G]) = ab[G,G]$.
$(b[G,G])(a[G,G]) = ba[G,G]$.
Cần $ab[G,G] = ba[G,G]$, tức $(ba)^{-1}(ab) = a^{-1}b^{-1}ab = [b,a]^{-1} \in [G,G]$. Đúng vì $[b,a] \in [G,G]$.

3. Nếu $G/N$ Abel thì $\forall\, a,b \in G$: $(aN)(bN) = (bN)(aN)$, tức $ab N = ba N$, tức $(ba)^{-1}(ab) = [b,a] \in N$. Vậy mọi commutator $\in N$, nên $[G,G] \leq N$. $\blacksquare$

> [!example] Example 11.16 — Abelianization của $S_n$
> $[S_n, S_n] = A_n$ với $n \geq 2$.
>
> Vì $S_n/A_n \cong \mathbb{Z}/2\mathbb{Z}$ là Abel, nên $[S_n, S_n] \leq A_n$ (theo Theorem 11.15(3)).
>
> Ngược lại, mọi chu trình chẵn (3-cycle) đều là commutator: $(ijk) = (ij)(ik)(ij)^{-1}(ik)^{-1}$, và $A_n$ sinh bởi các 3-cycle với $n \geq 3$. Vậy $A_n \leq [S_n, S_n]$.
>
> Kết luận: $S_n^{ab} = S_n/A_n \cong \mathbb{Z}/2\mathbb{Z}$.

> [!example] Example 11.17 — Abelianization của nhóm Abel
> Nếu $G$ Abel thì $[G,G] = \{e\}$ và $G^{ab} = G/\{e\} \cong G$.

> [!example] Example 11.18 — Commutator của $Q_8$
> $[Q_8, Q_8] = \{\pm 1\} = Z(Q_8)$. Abelianization: $Q_8^{ab} \cong V_4$.

---

## 5. Mối Liên Hệ Chuẩn Tắc — Thương — Đồng Cấu

Mối liên hệ giữa ba khái niệm nhóm con chuẩn tắc, nhóm thương và đồng cấu (sẽ học trong [[12-group-homomorphisms-and-isomorphism-theorems|12. Group Homomorphisms]]) là nền tảng của lý thuyết nhóm:

- **Hạt nhân của mọi đồng cấu đều là nhóm con chuẩn tắc**: Nếu $\phi: G \to H$, thì $\ker\phi \trianglelefteq G$.
- **Mọi nhóm con chuẩn tắc đều là hạt nhân của một đồng cấu**: $N \trianglelefteq G$ là hạt nhân của phép chiếu chính tắc $\pi: G \to G/N$.
- **Định lý đẳng cấu thứ nhất**: $G/\ker\phi \cong \operatorname{Im}\phi$.

Vậy:
$$
\text{Chuẩn tắc} \longleftrightarrow \text{Hạt nhân đồng cấu} \longleftrightarrow \text{Thương}
$$

---

## 6. SageMath Cheatsheet

```python
# ---- Kiểm tra nhóm con chuẩn tắc ----
G = SymmetricGroup(4)
H = G.subgroup([G([(1,2,3,4)]), G([(1,3)])])
print(H.is_normal(G))         # True/False

# ---- Nhóm thương ----
G = SymmetricGroup(3)
A3 = G.subgroup([G([(1,2,3)])])
Q = G.quotient(A3)
print(Q.order())              # 2
print(Q.is_abelian())         # True

# ---- Commutator subgroup (derived subgroup) ----
G = SymmetricGroup(4)
D = G.derived_subgroup()
print(D.order())              # 12 (= |A4|, vì [S4,S4] = A4)
print(D.is_normal(G))         # True

# ---- Abelianization ----
G = SymmetricGroup(4)
D = G.derived_subgroup()
Ab = G.quotient(D)
print(Ab.order())              # 2 (= |S4/A4|)
print(Ab.is_abelian())         # True

# ---- Tâm ----
G = SymmetricGroup(4)
print(G.center().order())      # 1 (Z(S4) = {e})

# ---- Nhóm con chỉ số 2 (luôn chuẩn tắc) ----
G = SymmetricGroup(4)
for H in G.subgroups():
    if G.order() // H.order() == 2:
        print(f"H order {H.order()} is normal: {H.is_normal(G)}")

# ---- Nhóm thương và dàn nhóm con ----
G = CyclicPermutationGroup(12)
# Liệt kê tất cả nhóm con chuẩn tắc và thương
for H in G.subgroups():
    if H.is_normal(G):
        Q = G.quotient(H)
        print(f"|H| = {H.order()}, |G/H| = {Q.order()}, cyclic: {Q.is_cyclic()}")
```

---

## 7. Summary

- $N \trianglelefteq G$: $gN = Ng$ với mọi $g$, hay $gNg^{-1} = N$.
- Nhóm con chỉ số 2 luôn chuẩn tắc.
- $G/N$ (nhóm thương): tập lớp ghép với $(aN)(bN) = (ab)N$, hợp lệ nhờ $N$ chuẩn tắc.
- $|G/N| = |G|/|N|$.
- Commutator $[a,b] = aba^{-1}b^{-1}$; $[G,G] = \langle [a,b] \rangle$.
- $[G,G] \trianglelefteq G$; $G/[G,G]$ là nhóm Abel lớn nhất (abelianization).
- $N \trianglelefteq G$ $\iff$ $N = \ker\phi$ cho một đồng cấu $\phi$.

---

## 8. References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), §3.1, §5.4.
- Judson, *Abstract Algebra: Theory and Applications*, Chapter 10.
- Lang, *Algebra* (3rd ed.), Chapter I §5.
