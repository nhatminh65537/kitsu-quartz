---
title: "04. Cosets and Lagrange's Theorem"
tags: [math, group-theory, lesson-04]
aliases: [Cosets and Lagrange's Theorem]
created: 2026-03-26
---

> **Prerequisites**: [[01-groups-and-subgroups|01. Groups and Subgroups]], [[02-cyclic-groups|02. Cyclic Groups]]
> **Objectives**:
> - Định nghĩa coset trái và phải, chứng minh các tính chất phân hoạch
> - Chứng minh định lý Lagrange và hiểu rõ các hệ quả
> - Tính chỉ số $[G:H]$ và hiểu ý nghĩa của nó
> - Phân biệt coset trái và phải, nhận diện khi nào chúng trùng nhau

---

## Motivation / Intuition

Định lý Lagrange là kết quả cơ bản đầu tiên ràng buộc cấu trúc của nhóm con với cấu trúc của nhóm tổng thể: **bậc của nhóm con phải là ước của bậc nhóm**. Đây là một ràng buộc cực kỳ mạnh — nó loại bỏ ngay hầu hết các ứng viên tiềm năng là nhóm con của một nhóm hữu hạn.

Ý tưởng chứng minh rất đẹp: coset của $H$ là "bản sao dịch chuyển" của $H$. Các bản sao này rời nhau và lấp đầy $G$ — tức chúng tạo thành một phân hoạch của $G$. Vì mỗi bản sao có đúng $|H|$ phần tử, bậc $|G|$ phải chia hết cho $|H|$.

Về mặt lịch sử, Lagrange quan sát kết quả này vào khoảng 1770 khi nghiên cứu hoán vị nghiệm phương trình — nhưng ông chưa có khái niệm nhóm trừu tượng. Galois và Cauchy sau đó mới đặt nền tảng chính xác.

---

## Coset

### Definition

> [!definition] Definition 4.1 — Coset trái và phải
> Cho $H \leq G$ và $g \in G$.
>
> - **Coset trái** (left coset) của $H$ trong $G$ xác định bởi $g$:
>
> $$
> gH = \left\{ gh : h \in H \right\}
> $$
>
> - **Coset phải** (right coset) của $H$ trong $G$ xác định bởi $g$:
>
> $$
> Hg = \left\{ hg : h \in H \right\}
> $$
>
> Tập hợp tất cả coset trái của $H$ trong $G$ ký hiệu là $G/H$ (đọc: "$G$ mod $H$").
>
> [!note] Remark 4.2 — Coset không phải nhóm con nói chung
> $gH$ là nhóm con của $G$ khi và chỉ khi $g \in H$ (vì khi đó $gH = H$). Với $g \notin H$, coset $gH$ không chứa phần tử đơn vị $e$ nên không thể là nhóm con.

### Tính chất coset

> [!abstract] Theorem 4.3 — Tiêu chuẩn thuộc cùng coset
> Cho $H \leq G$ và $a, b \in G$. Các mệnh đề sau tương đương:
>
> 1. $aH = bH$
> 2. $b^{-1}a \in H$
> 3. $a \in bH$
> 4. $a$ và $b$ thuộc cùng một coset trái của $H$

**Proof.**
$(1) \Rightarrow (2)$: Nếu $aH = bH$ thì $a = ae \in aH = bH$, nên $a = bh$ với $h \in H$, tức $b^{-1}a = h \in H$.

$(2) \Rightarrow (1)$: Nếu $b^{-1}a = h \in H$ thì $a = bh$. Với mọi $ah' \in aH$: $ah' = bh h' \in bH$, nên $aH \subseteq bH$. Tương tự $bH \subseteq aH$. Vậy $aH = bH$.

$(1) \Leftrightarrow (3)$: $a \in bH \Leftrightarrow aH = bH$ (từ (2)).

$(3) \Leftrightarrow (4)$: Hiển nhiên. $\blacksquare$

> [!abstract] Theorem 4.4 — Coset tạo thành phân hoạch của $G$
> Họ các coset trái $\{aH : a \in G\}$ tạo thành một **phân hoạch** (partition) của $G$:
>
> 1. Mỗi $a \in G$ thuộc đúng một coset trái: $a \in aH$.
> 2. Hai coset hoặc bằng nhau hoặc rời nhau: $aH = bH$ hoặc $aH \cap bH = \emptyset$.

**Proof.**
(1) $a = ae \in aH$ vì $e \in H$.

(2) Giả sử $aH \cap bH \neq \emptyset$, tức tồn tại $c \in aH \cap bH$. Khi đó $c = ah_1 = bh_2$ với $h_1, h_2 \in H$. Suy ra $b^{-1}a = h_2 h_1^{-1} \in H$, nên theo Theorem 4.3, $aH = bH$. $\blacksquare$

> [!abstract] Theorem 4.5 — Mọi coset trái đều có cùng bậc
> Với mọi $g \in G$, ánh xạ $\phi_g : H \to gH$, $h \mapsto gh$ là song ánh. Do đó $|gH| = |H|$.

**Proof.**
$\phi_g$ surjective theo định nghĩa. $\phi_g$ injective: nếu $gh_1 = gh_2$ thì $h_1 = h_2$ theo quy tắc xóa. $\blacksquare$

---

## Chỉ số (Index)

> [!definition] Definition 4.6 — Chỉ số (Index)
> **Chỉ số** của $H$ trong $G$, ký hiệu $[G : H]$, là số lượng coset trái phân biệt của $H$ trong $G$:
>
> $$
> [G : H] = |G/H|
> $$

---

## Định lý Lagrange

> [!abstract] Theorem 4.7 — Định lý Lagrange (Lagrange's Theorem)
> Cho $G$ là nhóm hữu hạn và $H \leq G$. Khi đó:
>
> $$
> |G| = [G : H] \cdot |H|
> $$
>
> Đặc biệt, $|H|$ là ước của $|G|$.

Xem chứng minh đầy đủ tại [[a0-proof-of-lagrange-theorem|A0. Proof of Lagrange's Theorem]].

**Proof (sketch).**
Theo Theorem 4.4, các coset trái tạo phân hoạch $G = \bigsqcup_{i=1}^{[G:H]} a_i H$. Theo Theorem 4.5, mỗi $a_i H$ có đúng $|H|$ phần tử. Vậy $|G| = [G:H] \cdot |H|$. $\blacksquare$

### Hệ quả của định lý Lagrange

> [!abstract] Corollary 4.8 — Bậc phần tử chia bậc nhóm
> Nếu $G$ hữu hạn và $g \in G$, thì $\operatorname{ord}(g)$ chia $|G|$.

**Proof.**
$\operatorname{ord}(g) = |\langle g \rangle|$. Áp dụng Lagrange cho $\langle g \rangle \leq G$: $|\langle g \rangle|$ chia $|G|$. $\blacksquare$

> [!abstract] Corollary 4.9 — Lũy thừa bậc nhóm bằng đơn vị
> Nếu $|G| = n$ thì $g^n = e$ với mọi $g \in G$.

**Proof.**
$g^n = g^{\operatorname{ord}(g) \cdot (n / \operatorname{ord}(g))} = (g^{\operatorname{ord}(g)})^{n/\operatorname{ord}(g)} = e^{n/\operatorname{ord}(g)} = e$. $\blacksquare$

> [!abstract] Corollary 4.10 — Nhóm bậc nguyên tố là cyclic
> Nếu $|G| = p$ với $p$ nguyên tố, thì $G \cong \mathbb{Z}_p$ (cyclic).

**Proof.**
Lấy $g \in G$, $g \neq e$. Khi đó $\operatorname{ord}(g) \mid p$, nên $\operatorname{ord}(g) \in \{1, p\}$. Vì $g \neq e$, $\operatorname{ord}(g) = p$, tức $G = \langle g \rangle \cong \mathbb{Z}_p$. $\blacksquare$

> [!abstract] Corollary 4.11 — Định lý nhỏ Fermat (Fermat's Little Theorem)
> Với $p$ nguyên tố và $a \in \mathbb{Z}$ với $p \nmid a$:
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$

**Proof.**
$(\mathbb{Z}_p^*, \cdot)$ là nhóm bậc $p - 1$. Theo Corollary 4.9: $a^{p-1} \equiv 1 \pmod p$. $\blacksquare$

> [!example] Example 4.12 — Phân tích coset của $A_3$ trong $S_3$
> $S_3 = \left\{ e, (12), (13), (23), (123), (132) \right\}$, $|S_3| = 6$.
>
> $A_3 = \left\{ e, (123), (132) \right\}$, $|A_3| = 3$.
>
> Các coset trái của $A_3$ trong $S_3$:
>
> - $e \cdot A_3 = \left\{ e, (123), (132) \right\} = A_3$
> - $(12) \cdot A_3 = \left\{ (12), (12)(123), (12)(132) \right\} = \left\{ (12), (23), (13) \right\}$
>
> Kiểm tra: $[S_3 : A_3] = 2$ và $|S_3| = 2 \cdot 3 = 6$. ✓
>
> [!example] Example 4.13 — Coset trái $\neq$ coset phải
> Trong $S_3$, xét $H = \langle (12) \rangle = \left\{ e, (12) \right\}$.
>
> Coset **trái** của $(123)$: $(123)H = \left\{ (123), (123)(12) \right\} = \left\{ (123), (13) \right\}$.
>
> Coset **phải** của $(123)$: $H(123) = \left\{ (123), (12)(123) \right\} = \left\{ (123), (23) \right\}$.
>
> Vậy $(123)H \neq H(123)$ — coset trái và phải không nhất thiết bằng nhau.
>
> [!warning] Counterexample 4.14 — Đảo của Lagrange không đúng
> Đảo của định lý Lagrange **sai**: không phải mọi ước $d$ của $|G|$ đều có nhóm con bậc $d$.
>
> Ví dụ: $|A_4| = 12$. Số $6$ là ước của $12$, nhưng $A_4$ **không có** nhóm con bậc $6$.
>
> Tuy nhiên, với nhóm cyclic (hay nhóm Abel), đảo đúng. Định lý Sylow (bài 08) cho điều kiện đủ cho trường hợp tổng quát: với mọi lũy thừa nguyên tố $p^k \mid |G|$, tồn tại nhóm con bậc $p^k$.

---

## Định lý chỉ số (Index Theorem)

> [!abstract] Theorem 4.15 — Tính nhân của chỉ số
> Cho $K \leq H \leq G$. Nếu $[G:K] < \infty$, thì:
>
> $$
> [G : K] = [G : H] \cdot [H : K]
> $$

**Proof.**
Mỗi coset $gH$ chứa đúng $[H:K]$ coset của $K$ trong $G$ (vì $gH$ như một "bản sao" của $H$, và $H$ phân hoạch thành $[H:K]$ coset của $K$). Vì $G$ có $[G:H]$ coset của $H$, tổng số coset của $K$ là $[G:H] \cdot [H:K]$. $\blacksquare$

> [!abstract] Theorem 4.16 — Chỉ số và giao
> Nếu $H, K \leq G$ với $[G:H]$ và $[G:K]$ hữu hạn, thì:
>
> $$
> [G : H \cap K] \leq [G : H] \cdot [G : K]
> $$

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(4)
H = G.subgroup([G((1,2,3))])
G.cosets(H, side='left')

H.index(G)

G.order() // H.order()

G = DihedralGroup(6)
for H in G.subgroups():
    print(H.order(), G.order() // H.order())

G = CyclicPermutationGroup(7)
for g in G:
    print(g, g.order())
```

---

## Summary / Key Takeaways

- Coset trái $gH = \{gh : h \in H\}$; coset phải $Hg = \{hg : h \in H\}$.
- Các coset trái (hoặc phải) tạo thành phân hoạch của $G$; mọi coset có cùng bậc.
- $aH = bH \iff b^{-1}a \in H$ (tiêu chuẩn bằng nhau).
- **Định lý Lagrange**: $|G| = [G:H] \cdot |H|$, suy ra $|H| \mid |G|$.
- Hệ quả: $\operatorname{ord}(g) \mid |G|$; $g^{|G|} = e$; nhóm bậc nguyên tố là cyclic.
- **Fermat nhỏ**: $a^{p-1} \equiv 1 \pmod p$ (khi $p \nmid a$).
- Đảo Lagrange sai — $A_4$ không có nhóm con bậc $6$.
- Coset trái và phải không nhất thiết bằng nhau — điều kiện bằng nhau là chủ đề của bài 05.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §3.2.
- Hungerford, T. W. *Algebra*, Chapter I §4.
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §4.
- Milne, J. S. *Group Theory* (v4.00), Chapter 1. https://www.jmilne.org/math/CourseNotes/GT.pdf
