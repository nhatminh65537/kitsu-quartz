---
title: "08. Sylow Theorems"
tags: [math, group-theory, lesson-08]
aliases: [Sylow Theorems]
created: 2026-03-26
---

> **Prerequisites**: [[04-cosets-and-lagrange|04. Cosets and Lagrange's Theorem]], [[07-group-actions|07. Group Actions]]
> **Objectives**:
> - Định nghĩa $p$-nhóm Sylow và phát biểu ba định lý Sylow
> - Nắm vững các ứng dụng phân loại nhóm bậc nhỏ
> - Sử dụng định lý Sylow để chứng minh nhóm con chuẩn tắc tồn tại
> - Tính số lượng nhóm Sylow $n_p$ và áp dụng điều kiện ràng buộc

---

## Motivation / Intuition

Định lý Lagrange cho ta một ràng buộc *cần*: bậc nhóm con phải chia bậc nhóm. Nhưng chiều đảo không đúng tổng quát. Câu hỏi tự nhiên: **với mọi lũy thừa nguyên tố $p^k \mid |G|$, có tồn tại nhóm con bậc $p^k$ không?**

Câu trả lời là **có** — đây là nội dung Định lý Sylow thứ nhất, một trong những kết quả sâu sắc và ứng dụng rộng nhất của lý thuyết nhóm hữu hạn. Ba định lý Sylow cùng nhau không chỉ đảm bảo sự tồn tại mà còn kiểm soát số lượng và cấu trúc của các nhóm con $p$-Sylow.

Các ứng dụng điển hình: chứng minh không có nhóm đơn bậc nhỏ, phân loại nhóm bậc $pq$, $p^2$, hay $2p$, và kiểm tra khi nào mọi nhóm con Sylow đều chuẩn tắc (ứng với nhóm là tích trực tiếp của chúng).

---

## $p$-nhóm và $p$-nhóm Sylow

> [!definition] Definition 8.1 — $p$-nhóm và nhóm Sylow
> Cho $p$ là số nguyên tố và $G$ là nhóm hữu hạn với $|G| = p^a m$ trong đó $p \nmid m$.
>
> - **$p$-nhóm** ($p$-group): nhóm $G$ với $|G| = p^n$ cho $n \geq 1$.
> - **$p$-nhóm Sylow** (Sylow $p$-subgroup): nhóm con $P \leq G$ với $|P| = p^a$ (bậc tối đa là lũy thừa của $p$). Ký hiệu tập nhóm Sylow: $\operatorname{Syl}_p(G)$.
> - $n_p = |\operatorname{Syl}_p(G)|$: số lượng nhóm $p$-Sylow.
>
> [!note] Remark 8.2
> Định lý Lagrange cho ta $p^a \mid |G|$. Nhóm $p$-Sylow là nhóm con có bậc **bằng** $p^a$ — lũy thừa cao nhất của $p$ chia $|G|$. Nó là nhóm con $p$-nhóm **lớn nhất** của $G$.

---

## Ba định lý Sylow

> [!abstract] Theorem 8.3 — Định lý Sylow I (Tồn tại)
> Cho $G$ hữu hạn với $|G| = p^a m$ ($p \nmid m$). Khi đó:
>
> $$
> \operatorname{Syl}_p(G) \neq \emptyset
> $$
>
> tức là tồn tại ít nhất một nhóm $p$-Sylow. Hơn nữa, với mọi $0 \leq k \leq a$, $G$ có nhóm con bậc $p^k$.
>
> [!abstract] Theorem 8.4 — Định lý Sylow II (Liên hợp)
> Mọi $p$-nhóm con của $G$ đều nằm trong một nhóm $p$-Sylow. Đặc biệt, mọi hai nhóm $p$-Sylow đều **liên hợp** với nhau: nếu $P, Q \in \operatorname{Syl}_p(G)$ thì tồn tại $g \in G$ sao cho $Q = gPg^{-1}$.
>
> [!abstract] Theorem 8.5 — Định lý Sylow III (Đếm)
> Số lượng nhóm $p$-Sylow $n_p$ thỏa mãn:
>
> 1. $n_p \mid m$ (tức $n_p \mid |G|/p^a$)
> 2. $n_p \equiv 1 \pmod{p}$
>
> Hệ quả: $n_p = [G : N_G(P)]$ với $P \in \operatorname{Syl}_p(G)$.

Xem chứng minh đầy đủ tại [[a1-proof-of-sylow-theorems|A1. Proof of Sylow Theorems]].

**Proof sketch (Định lý I, bằng group action).**

**Bước 1**: Xét $G$ tác động lên tập $X = \left\{ S \subseteq G : |S| = p^a \right\}$ bởi phép dịch trái: $g \cdot S = gS$.

Ta có $|X| = \binom{p^a m}{p^a}$. Bằng tính toán lý thuyết số, $p \nmid \binom{p^a m}{p^a}$, nên tồn tại orbit $\mathcal{O}$ với $p \nmid |\mathcal{O}|$.

**Bước 2**: Chọn $S_0 \in \mathcal{O}$. Từ Orbit-Stabilizer: $|G_{S_0}| = |G|/|\mathcal{O}|$. Vì $p \nmid |\mathcal{O}|$ và $p^a \mid |G|$, ta có $p^a \mid |G_{S_0}|$.

**Bước 3**: Dễ thấy $|G_{S_0}| \leq p^a$ (vì $G_{S_0}$ tác động lên $S_0$ có $p^a$ phần tử). Vậy $|G_{S_0}| = p^a$ và $P = G_{S_0} \in \operatorname{Syl}_p(G)$. $\blacksquare$

**Proof sketch (Định lý II, bằng liên hợp).**

Cho $P \in \operatorname{Syl}_p(G)$ và $Q$ là $p$-nhóm con bất kỳ. Xét $Q$ tác động lên $G/P$ bởi phép dịch trái. Vì $|G/P| = m$ và $p \nmid m$, phương trình orbit cho tồn tại orbit singleton $\{gP\}$, tức $q \cdot (gP) = gP$ với mọi $q \in Q$, tức $g^{-1}Qg \subseteq P$. Vậy $Q \subseteq gPg^{-1}$. Nếu $Q$ là Sylow thì $|Q| = |P|$, nên $Q = gPg^{-1}$. $\blacksquare$

---

## Hệ quả và ứng dụng

> [!abstract] Corollary 8.6 — Nhóm Sylow duy nhất là chuẩn tắc
> $n_p = 1 \iff$ nhóm $p$-Sylow duy nhất $P \trianglelefteq G$.

**Proof.**
Theo Định lý II, mọi hai nhóm Sylow đều liên hợp. Nếu chỉ có một nhóm Sylow $P$, thì $gPg^{-1} = P$ với mọi $g \in G$, tức $P \trianglelefteq G$. Chiều ngược lại: nếu $P \trianglelefteq G$ thì $P$ là nhóm Sylow duy nhất liên hợp với chính nó. $\blacksquare$

> [!example] Example 8.7 — Không có nhóm đơn bậc $15$
> Cho $|G| = 15 = 3 \cdot 5$. Xác định $n_3$ và $n_5$:
>
> - $n_5 \equiv 1 \pmod 5$ và $n_5 \mid 3$: chỉ $n_5 = 1$.
> - $n_3 \equiv 1 \pmod 3$ và $n_3 \mid 5$: chỉ $n_3 = 1$.
>
> Vậy $G$ có nhóm $5$-Sylow và $3$-Sylow duy nhất, cả hai đều chuẩn tắc. Suy ra $G \cong \mathbb{Z}_3 \times \mathbb{Z}_5 \cong \mathbb{Z}_{15}$, không đơn.
>
> [!example] Example 8.8 — Phân tích nhóm bậc $12$
> Cho $|G| = 12 = 2^2 \cdot 3$.
>
> - $n_3 \equiv 1 \pmod 3$ và $n_3 \mid 4$: $n_3 \in \{1, 4\}$.
> - $n_2 \equiv 1 \pmod 2$ và $n_2 \mid 3$: $n_2 \in \{1, 3\}$.
>
> **Trường hợp $n_3 = 4$**: Có $4$ nhóm $3$-Sylow, mỗi nhóm có $2$ phần tử bậc $3$ phân biệt (không chứa $e$). Tổng $4 \times 2 = 8$ phần tử bậc $3$. Còn lại $12 - 8 = 4$ phần tử, phải nằm trong nhóm $2$-Sylow (bậc $4$). Nhóm $2$-Sylow duy nhất, nên $P_2 \trianglelefteq G$.
>
> **Ví dụ**: $A_4$ có $n_3 = 4$ và $n_2 = 1$; nhóm cyclic $\mathbb{Z}_{12}$ có $n_3 = 1$ và $n_2 = 1$.
>
> [!example] Example 8.9 — Nhóm bậc $pq$ ($p < q$ nguyên tố)
> Cho $|G| = pq$ với $p < q$ nguyên tố.
>
> - $n_q \equiv 1 \pmod q$ và $n_q \mid p$: vì $p < q$, chỉ có $n_q = 1$. Vậy có nhóm $q$-Sylow duy nhất $Q \trianglelefteq G$.
> - $n_p \equiv 1 \pmod p$ và $n_p \mid q$: $n_p = 1$ hoặc $n_p = q$.
>
> **Trường hợp $p \nmid (q-1)$**: $n_p = 1$, cả $P, Q$ đều chuẩn tắc, $G \cong \mathbb{Z}_p \times \mathbb{Z}_q \cong \mathbb{Z}_{pq}$.
>
> **Trường hợp $p \mid (q-1)$**: có thể $n_p = q$, và tồn tại nhóm không cyclic (tích nửa trực tiếp, bài 09). Ví dụ: $|G| = 21 = 3 \cdot 7$ và $3 \mid (7-1) = 6$, nên tồn tại nhóm không Abel bậc $21$.
>
> [!example] Example 8.10 — Nhóm bậc $30$
> $|G| = 30 = 2 \cdot 3 \cdot 5$.
>
> - $n_5 \in \{1, 6\}$; $n_3 \in \{1, 10\}$; $n_2 \in \{1, 3, 5, 15\}$.
>
> Nếu $n_5 = 6$ và $n_3 = 10$: tổng phần tử bậc 5 là $6 \times 4 = 24$, bậc 3 là $10 \times 2 = 20$. Nhưng $24 + 20 = 44 > 30$ — vô lý. Vậy $n_5 = 1$ hoặc $n_3 = 1$. Trong cả hai trường hợp, $G$ không đơn.

---

## Ứng dụng: phân loại nhóm bậc $\leq 20$ (trích)

| Bậc $|G|$ | $n_p$ có thể | Kết luận |
|-----------|-------------|---------|
| $p$ | — | $G \cong \mathbb{Z}_p$ (duy nhất) |
| $p^2$ | — | $G \cong \mathbb{Z}_{p^2}$ hoặc $\mathbb{Z}_p^2$ |
| $2p$ ($p$ lẻ nguyên tố) | $n_p \in \{1,2\}$ | $\mathbb{Z}_{2p}$ hoặc $D_{2p}$ |
| $pq$ ($p<q$, $p \nmid q-1$) | $n_p = n_q = 1$ | $G \cong \mathbb{Z}_{pq}$ |
| $12 = 2^2 \cdot 3$ | $n_3 \in \{1,4\}$ | $\mathbb{Z}_{12}$, $\mathbb{Z}_2 \times \mathbb{Z}_6$, $A_4$, $D_{12}$, $\text{Dic}_3$ |

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(4)
G.sylow_subgroup(2)
G.sylow_subgroup(3)

G = AlternatingGroup(4)
P = G.sylow_subgroup(3)
len(G.conjugacy_classes_subgroups())

G = SymmetricGroup(5)
P2 = G.sylow_subgroup(2)
P3 = G.sylow_subgroup(3)
P5 = G.sylow_subgroup(5)

def count_sylow(G, p):
    P = G.sylow_subgroup(p)
    return G.order() // G.normalizer(P).order()

G = SymmetricGroup(4)
count_sylow(G, 3)
```

---

## Summary / Key Takeaways

- $p$-nhóm Sylow của $G$ (với $|G| = p^a m$, $p \nmid m$): nhóm con bậc đúng $p^a$.
- **Sylow I**: tồn tại ít nhất một nhóm $p$-Sylow.
- **Sylow II**: mọi hai nhóm $p$-Sylow liên hợp nhau; mọi $p$-nhóm con nằm trong một nhóm Sylow.
- **Sylow III**: $n_p \mid m$ và $n_p \equiv 1 \pmod p$.
- $n_p = 1 \iff$ nhóm Sylow duy nhất $\iff$ nhóm Sylow chuẩn tắc.
- Chiến lược chuẩn: tính $n_p$ từ ràng buộc Sylow III → chứng minh $n_p = 1$ → nhóm Sylow chuẩn tắc → phân tích cấu trúc $G$.
- Nhóm bậc $pq$ ($p < q$, $p \nmid q-1$): $G \cong \mathbb{Z}_{pq}$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 4 §§4.4–4.5.
- Hungerford, T. W. *Algebra*, Chapter II §5.
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §6.
- Milne, J. S. *Group Theory* (v4.00), Chapter 5. https://www.jmilne.org/math/CourseNotes/GT.pdf
