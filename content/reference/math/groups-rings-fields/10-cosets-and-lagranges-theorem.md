---
title: "10. Cosets and Lagrange's Theorem"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-10]
aliases: [Cosets and Lagrange's Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[09-cyclic-groups-and-order-of-elements|09. Cyclic Groups and Order of Elements]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $G$ | Nhóm (hữu hạn hoặc vô hạn) |
> | $H \leq G$ | $H$ là nhóm con của $G$ |
> | $|G|$ | Cấp của nhóm $G$ |
> | $\operatorname{ord}(g)$ | Cấp của phần tử $g$ |
> | $\langle g \rangle$ | Nhóm con cyclic sinh bởi $g$ |
> | $\gcd(a,b)$ | Ước chung lớn nhất |
> | $\phi(n)$ | Hàm Euler totient |

> **Objectives**:
> - Định nghĩa và tính chất của lớp ghép (coset); hiểu tại sao các lớp ghép phân hoạch $G$.
> - Định nghĩa chỉ số $[G:H]$.
> - Chứng minh và ứng dụng định lý Lagrange: $|H|$ chia $|G|$ khi $G$ hữu hạn.
> - Suy ra định lý Euler và định lý nhỏ Fermat.

---

## Motivation

Câu hỏi: khi nhúng nhóm con $H$ vào trong nhóm $G$, các phần tử của $G$ phân bố như thế nào quanh $H$? Ý tưởng: dịch chuyển $H$ bởi mỗi phần tử $g \in G$ tạo ra một "bản sao" $gH$ của $H$. Các bản sao này phân hoạch $G$ (partition $G$) thành các mảnh bằng nhau — đây là lớp ghép trái (left coset).

Định lý Lagrange (Joseph-Louis Lagrange, 1736–1813) phát biểu rằng với $G$ hữu hạn, cấp của mọi nhóm con đều chia cấp của $G$. Đây là kết quả nền tảng nhất trong lý thuyết nhóm hữu hạn — mọi định lý về cấu trúc nhóm hữu hạn đều bắt nguồn từ đây.

---

## 1. Lớp Ghép (Cosets)

> [!definition] Definition 10.1 — Lớp ghép trái và phải
> Cho $G$ là nhóm, $H \leq G$, và $g \in G$.
>
> - **Lớp ghép trái** (left coset) của $H$ bởi $g$:
>
> $$
> gH = \{gh \mid h \in H\}
> $$
>
> - **Lớp ghép phải** (right coset) của $H$ bởi $g$:
>
> $$
> Hg = \{hg \mid h \in H\}
> $$

> [!note] Remark 10.2
> Nói chung $gH \neq Hg$. Khi $G$ Abel, thì $gH = Hg$ với mọi $g$. Khi $H \trianglelefteq G$ (nhóm con chuẩn tắc, [[11-normal-subgroups-and-quotient-groups|11. Normal Subgroups]]), thì $gH = Hg$ với mọi $g$.

---

## 2. Tính Chất của Lớp Ghép

> [!abstract] Theorem 10.3 — Tính chất cơ bản của lớp ghép trái
> Cho $G$ là nhóm, $H \leq G$. Với mọi $a, b \in G$:
>
> 1. $a \in aH$ (mỗi phần tử nằm trong lớp ghép của chính nó).
> 2. $aH = H \iff a \in H$.
> 3. $aH = bH \iff a^{-1}b \in H \iff b \in aH$.
> 4. $aH$ và $bH$ hoặc bằng nhau, hoặc rời nhau (disjoint).
> 5. $|aH| = |H|$ (mọi lớp ghép có cùng cardinality với $H$).

**Proof.**
1. $a = a \cdot e \in aH$ vì $e \in H$.
2. $(\Rightarrow)$ $aH = H \Rightarrow a = ae \in H$. $(\Leftarrow)$ $a \in H \Rightarrow aH \subseteq H$ (đóng) và $H \subseteq aH$ (vì $h = a \cdot (a^{-1}h) \in aH$ với $a^{-1}h \in H$).
3. $aH = bH \iff a^{-1}(aH) = a^{-1}(bH) \iff H = a^{-1}bH \iff a^{-1}b \in H$ (theo (2)).
4. Giả sử $aH \cap bH \neq \emptyset$, lấy $c \in aH \cap bH$. Thì $c = ah_1 = bh_2$, nên $a^{-1}b = h_1 h_2^{-1} \in H$, nên $aH = bH$ theo (3). Mâu thuẫn với chúng rời nhau.
5. Ánh xạ $H \to aH$, $h \mapsto ah$ là song ánh (đơn ánh theo luật rút gọn, toàn ánh theo định nghĩa). $\blacksquare$

> [!abstract] Corollary 10.4 — Lớp ghép phân hoạch $G$
> Họ tất cả các lớp ghép trái $\{aH \mid a \in G\}$ là một **phân hoạch** (partition) của $G$:
>
> $$
> G = \bigsqcup_{a \in \mathcal{T}} aH
> $$
>
> trong đó $\mathcal{T}$ là hệ đại diện của các lớp ghép (chọn một phần tử từ mỗi lớp).

---

## 3. Chỉ Số (Index)

> [!definition] Definition 10.5 — Chỉ số (Index)
> **Chỉ số** của $H$ trong $G$, ký hiệu $[G : H]$, là số lớp ghép trái phân biệt của $H$ trong $G$:
>
> $$
> [G : H] = |\{aH \mid a \in G\}|
> $$
>
> Lưu ý: số lớp ghép trái luôn bằng số lớp ghép phải (dù từng lớp riêng lẻ có thể khác nhau).

---

## 4. Định Lý Lagrange

> [!abstract] Theorem 10.6 — Định lý Lagrange (Lagrange's Theorem)
> Cho $G$ là nhóm **hữu hạn** và $H \leq G$. Khi đó:
>
> $$
> |G| = |H| \cdot [G : H]
> $$
>
> Đặc biệt, $|H|$ là ước của $|G|$.

**Proof.**
Theo Corollary 10.4, $G$ là hợp rời của $[G:H]$ lớp ghép, mỗi lớp có đúng $|H|$ phần tử (Theorem 10.3(5)). Vậy $|G| = |H| \cdot [G:H]$. $\blacksquare$

*(Phiên bản chi tiết hơn của chứng minh này có trong [[a0-lagrange-theorem|A0. Proof of Lagrange's Theorem]].)*

> [!warning] Warning 10.7 — Đảo của định lý Lagrange không đúng tổng quát
> Từ $d \mid |G|$, không thể suy ra $G$ có nhóm con cấp $d$. Ví dụ: $G = A_4$ (nhóm hoán vị chẵn của 4 phần tử, $|A_4| = 12$) **không có** nhóm con cấp $6$ dù $6 \mid 12$.
>
> Tuy nhiên, **định lý Cauchy** (sẽ học sau) đảm bảo: nếu $p \mid |G|$ với $p$ là nguyên tố, thì $G$ có phần tử cấp $p$. Tổng quát hơn, **định lý Sylow** cho điều kiện đủ về sự tồn tại nhóm con cấp $p^k$.

---

## 5. Hệ Quả Quan Trọng

> [!abstract] Corollary 10.8 — Cấp phần tử chia cấp nhóm
> Nếu $G$ hữu hạn và $g \in G$, thì $\operatorname{ord}(g)$ chia $|G|$.

**Proof.** $\langle g \rangle$ là nhóm con cấp $\operatorname{ord}(g)$, theo Lagrange thì $\operatorname{ord}(g) \mid |G|$. $\blacksquare$

> [!abstract] Corollary 10.9 — $g^{|G|} = e$
> Nếu $G$ hữu hạn và $g \in G$, thì $g^{|G|} = e$.

**Proof.** $|G| = \operatorname{ord}(g) \cdot k$ cho $k = [G:\langle g \rangle]$. Vậy $g^{|G|} = (g^{\operatorname{ord}(g)})^k = e^k = e$. $\blacksquare$

> [!abstract] Corollary 10.10 — Nhóm cấp nguyên tố là cyclic
> Nếu $|G| = p$ là số nguyên tố, thì $G \cong \mathbb{Z}/p\mathbb{Z}$ (cyclic).

**Proof.** Lấy $g \neq e$ trong $G$. Khi đó $\operatorname{ord}(g) \mid p$ và $\operatorname{ord}(g) > 1$ (vì $g \neq e$). Vì $p$ nguyên tố, $\operatorname{ord}(g) = p$. Vậy $\langle g \rangle$ là nhóm con cấp $p = |G|$, nên $G = \langle g \rangle \cong \mathbb{Z}/p\mathbb{Z}$. $\blacksquare$

> [!abstract] Corollary 10.11 — Nhóm cấp $p^2$ là Abel
> Nếu $|G| = p^2$ với $p$ nguyên tố, thì $G$ là nhóm Abel. Hơn nữa, $G \cong \mathbb{Z}/p^2\mathbb{Z}$ hoặc $G \cong \mathbb{Z}/p\mathbb{Z} \times \mathbb{Z}/p\mathbb{Z}$.

**Proof Sketch.** Dùng kết quả: nếu $G/Z(G)$ cyclic thì $G$ Abel, và $Z(G) \neq \{e\}$ với $p$-group (định lý lớp liên hợp). Chi tiết sẽ được trình bày sau khi học về tác động nhóm. $\blacksquare$

---

## 6. Định Lý Euler và Định Lý Nhỏ Fermat

> [!abstract] Theorem 10.12 — Định lý Euler (Euler's Theorem)
> Với $n \geq 1$ và $a \in \mathbb{Z}$ với $\gcd(a, n) = 1$:
>
> $$
> a^{\phi(n)} \equiv 1 \pmod{n}
> $$

**Proof.** $(\mathbb{Z}/n\mathbb{Z})^\times$ là nhóm cấp $\phi(n)$. Lấy $[a] \in (\mathbb{Z}/n\mathbb{Z})^\times$. Theo Corollary 10.9: $[a]^{\phi(n)} = [1]$, tức $a^{\phi(n)} \equiv 1 \pmod n$. $\blacksquare$

> [!abstract] Theorem 10.13 — Định lý nhỏ Fermat (Fermat's Little Theorem)
> Với $p$ là nguyên tố và $a \in \mathbb{Z}$ với $p \nmid a$:
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$
>
> Tương đương: $a^p \equiv a \pmod{p}$ với mọi $a \in \mathbb{Z}$.

**Proof.** Vì $p$ nguyên tố, $|(\mathbb{Z}/p\mathbb{Z})^\times| = p - 1 = \phi(p)$. Áp dụng định lý Euler với $n = p$. $\blacksquare$

> [!example] Example 10.14 — Ứng dụng định lý Euler
> Tính $3^{100} \pmod{77}$.
>
> $77 = 7 \times 11$, $\phi(77) = \phi(7)\phi(11) = 6 \times 10 = 60$.
>
> $100 = 1 \times 60 + 40$. Vậy $3^{100} = 3^{60} \cdot 3^{40} \equiv 1 \cdot 3^{40} \pmod{77}$.
>
> Tính $3^{40} \pmod{77}$ bằng phương pháp bình phương liên tiếp:
> - $3^2 = 9$
> - $3^4 = 9^2 = 81 \equiv 4 \pmod{77}$
> - $3^8 = 4^2 = 16$
> - $3^{16} = 16^2 = 256 \equiv 256 - 3 \times 77 = 256 - 231 = 25 \pmod{77}$
> - $3^{32} = 25^2 = 625 \equiv 625 - 8 \times 77 = 625 - 616 = 9 \pmod{77}$
> - $3^{40} = 3^{32} \cdot 3^8 = 9 \cdot 16 = 144 \equiv 144 - 77 = 67 \pmod{77}$
>
> Vậy $3^{100} \equiv 67 \pmod{77}$. ✓

---

## 7. Chứng Minh Lagrange qua Quan Hệ Tương Đương

Để nhấn mạnh ý tưởng phân hoạch, ta có thể nhìn từ góc độ quan hệ tương đương (đã học trong [[04-relations|04. Relations — Equivalence and Order]]).

> [!note] Remark 10.15 — Coset là lớp tương đương
> Định nghĩa quan hệ $\sim_L$ trên $G$: $a \sim_L b \iff a^{-1}b \in H$. Khi đó:
>
> - **Phản xạ**: $a^{-1}a = e \in H$. ✓
> - **Đối xứng**: $a^{-1}b \in H \Rightarrow (a^{-1}b)^{-1} = b^{-1}a \in H$. ✓
> - **Bắc cầu**: $a^{-1}b, b^{-1}c \in H \Rightarrow a^{-1}c = (a^{-1}b)(b^{-1}c) \in H$. ✓
>
> Lớp tương đương của $a$ theo $\sim_L$ chính là $aH$. Theo lý thuyết quan hệ tương đương, các lớp này phân hoạch $G$, và $|G| = \sum_{\text{lớp}} |aH| = [G:H] \cdot |H|$.

---

## 8. Định Lý về Chỉ Số (Index Theorem)

> [!abstract] Theorem 10.16 — Tính nhân của chỉ số
> Nếu $K \leq H \leq G$ (với $G$ hữu hạn), thì:
>
> $$
> [G : K] = [G : H] \cdot [H : K]
> $$

**Proof.** $|G| = |H| \cdot [G:H] = (|K| \cdot [H:K]) \cdot [G:H]$. Mặt khác $|G| = |K| \cdot [G:K]$. Suy ra $[G:K] = [G:H] \cdot [H:K]$. $\blacksquare$

> [!abstract] Theorem 10.17 — Định lý Poincaré (giao của nhóm con chỉ số hữu hạn)
> Nếu $H, K \leq G$ với $[G:H]$ và $[G:K]$ hữu hạn, thì $[G : H \cap K]$ cũng hữu hạn và:
>
> $$
> [G : H \cap K] \leq [G : H] \cdot [G : K]
> $$
>
> Đặc biệt, giao của hữu hạn nhóm con chỉ số hữu hạn là nhóm con chỉ số hữu hạn.

---

## 9. SageMath Cheatsheet

```python
# ---- Lớp ghép (cosets) ----
G = SymmetricGroup(4)
H = G.subgroup([G([(1,2)]), G([(3,4)])])
print(H.order())                    # 4
print(G.order() / H.order())        # index = 6

# Liệt kê left cosets
cosets = G.cosets(H, side='left')
for C in cosets:
    print(sorted(C))                # mỗi coset là một tập

# ---- Kiểm tra định lý Lagrange ----
G = SymmetricGroup(5)
for H in G.subgroups():
    assert G.order() % H.order() == 0
print("Lagrange holds for all subgroups of S5")

# ---- Định lý Euler ----
print(pow(3, euler_phi(77), 77))    # 1
print(pow(3, 100, 77))              # 67

# ---- Fermat nhỏ ----
p = 17
print(pow(5, p-1, p))              # 1

# ---- Kiểm tra Corollary 10.9 ----
G = SymmetricGroup(4)
g = G([(1,2,3)])
print(g ** G.order())              # ()  (identity)
```

---

## 10. Summary

- **Lớp ghép trái** $gH = \{gh \mid h \in H\}$; hai lớp hoặc bằng nhau hoặc rời nhau.
- Lớp ghép phân hoạch $G$; mỗi lớp có cùng cỡ $|H|$.
- $[G:H]$ = số lớp ghép.
- **Định lý Lagrange**: $|G| = [G:H] \cdot |H|$, nên $|H| \mid |G|$.
- Hệ quả: $\operatorname{ord}(g) \mid |G|$, $g^{|G|} = e$, nhóm cấp nguyên tố là cyclic.
- **Định lý Euler**: $a^{\phi(n)} \equiv 1 \pmod n$ với $\gcd(a,n) = 1$.
- **Fermat nhỏ**: $a^{p-1} \equiv 1 \pmod p$ với $p$ nguyên tố và $p \nmid a$.

---

## 11. References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), §3.2.
- Judson, *Abstract Algebra: Theory and Applications*, Chapter 6.
- Hungerford, *Algebra*, Chapter I §4.
