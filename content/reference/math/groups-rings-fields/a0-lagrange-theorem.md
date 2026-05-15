---
title: "A0. Proof of Lagrange's Theorem"
type: math-component
tags: [math, groups-rings-fields, group-theory, lagrange, appendix, appendix-a0]
aliases: [Lagrange's Theorem Proof, A0]
created: 2026-05-15
---

> **Prerequisites**: [[10-cosets-and-lagranges-theorem|10. Cosets and Lagrange's Theorem]]
> **Lesson type**: Math Component — Appendix
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $G$ | Nhóm hữu hạn |
> | $H \leq G$ | $H$ là nhóm con của $G$ |
> | $\lvert G\rvert$ | Cấp (order) của nhóm $G$ |
> | $\operatorname{ord}(a)$ | Cấp của phần tử $a$ |
> | $\langle a \rangle$ | Nhóm con cyclic sinh bởi $a$ |
> | $[G:H]$ | Chỉ số (index) của $H$ trong $G$ |
> | $e$ | Phần tử đơn vị của nhóm |
> | $\mathbb{F}_p^\times$ | Nhóm nhân của trường $\mathbb{F}_p$ |
> | $\phi(n)$ | Hàm phi Euler |

---

## Motivation

Định lý Lagrange là một trong những kết quả nền tảng nhất của lý thuyết nhóm hữu hạn. Nó thiết lập mối quan hệ cơ bản giữa cấp của một nhóm con và cấp của toàn nhóm: **cấp của nhóm con luôn chia hết cấp của nhóm**. Hệ quả của nó trải rộng từ lý thuyết nhóm thuần túy (phân loại nhóm cấp nguyên tố) đến lý thuyết số (Định lý Fermat nhỏ, Định lý Euler). Phụ lục này trình bày chứng minh hoàn chỉnh với mọi chi tiết, cùng các hệ quả và phản ví dụ cho chiều ngược.

---

## 1. Coset — Nền tảng của chứng minh

> [!definition] Definition A0.1 — Coset trái (Left Coset)
> Cho $H \leq G$ và $a \in G$. **Coset trái** của $H$ xác định bởi $a$ là tập hợp:
>
> $$
> aH = \{ah \mid h \in H\}.
> $$

Tương tự, **coset phải** là $Ha = \{ha \mid h \in H\}$. Khi $G$ không giao hoán, coset trái và coset phải có thể khác nhau. Chứng minh dưới đây dùng coset trái; chứng minh với coset phải là hoàn toàn tương tự.

> [!note] Remark A0.2 — Coset như lớp tương đương
> Quan hệ $a \sim_L b \iff a^{-1}b \in H$ là một quan hệ tương đương trên $G$. Các lớp tương đương của $\sim_L$ chính là các coset trái $aH$. Điều này giải thích tại sao các coset tạo thành một **phân hoạch** của $G$ — một sự kiện then chốt trong chứng minh.

---

## 2. Định lý Lagrange

> [!abstract] Theorem A0.3 — Định lý Lagrange (Lagrange's Theorem)
> Cho $G$ là nhóm hữu hạn và $H \leq G$ là nhóm con. Khi đó:
>
> $$
> |H| \mid |G|, \qquad \text{cụ thể } |G| = [G:H] \cdot |H|.
> $$
>
> Trong đó $[G:H]$ là **chỉ số** (index) của $H$ trong $G$ — số lượng coset trái của $H$ trong $G$.

### Chứng minh

**Bước 1: Mỗi coset có đúng $|H|$ phần tử.**

Xét ánh xạ $f: H \to aH$ định bởi $f(h) = ah$.

- **Toàn ánh**: Hiển nhiên theo định nghĩa $aH = \{ah : h \in H\}$.
- **Đơn ánh**: $f(h_1) = f(h_2) \implies ah_1 = ah_2$. Nhân trái với $a^{-1}$: $h_1 = h_2$.

Vậy $f$ là song ánh, do đó $|aH| = |H|$ với mọi $a \in G$.

**Bước 2: Hai coset hoặc bằng nhau hoặc rời nhau.**

Ta chứng minh: $aH \cap bH \neq \emptyset \implies aH = bH$.

Giả sử $c \in aH \cap bH$. Khi đó tồn tại $h_1, h_2 \in H$ sao cho $c = ah_1 = bh_2$. Suy ra $a = bh_2h_1^{-1}$.

Với bất kỳ $ah \in aH$:
$$
ah = b(h_2h_1^{-1}h) \in bH
$$
(vì $h_2, h_1^{-1}, h \in H$ và $H$ đóng với phép nhân). Vậy $aH \subseteq bH$.

Đối xứng: $b = ah_1h_2^{-1}$ nên $bH \subseteq aH$. Suy ra $aH = bH$.

**Bước 3: Kết luận.**

Họ các coset trái phân hoạch $G$ thành các tập con đôi một rời nhau, mỗi tập có $|H|$ phần tử. Gọi số coset là $[G:H]$. Khi đó:

$$
|G| = \underbrace{|H| + |H| + \cdots + |H|}_{[G:H] \text{ lần}} = [G:H] \cdot |H|.
$$

Đặc biệt, $|H|$ chia hết $|G|$. $\blacksquare$

---

## 3. Các Hệ quả Chính

> [!abstract] Corollary A0.4 — Bậc phần tử chia hết $|G|$
> Với $a \in G$ hữu hạn, $\operatorname{ord}(a) = |\langle a \rangle|$ chia hết $|G|$. Đặc biệt, $a^{|G|} = e$ với mọi $a \in G$.

**Proof.** $\langle a \rangle \leq G$ là nhóm con cyclic sinh bởi $a$, có cấp bằng $\operatorname{ord}(a)$. Áp dụng Lagrange: $\operatorname{ord}(a) \mid |G|$. Hơn nữa $a^{|G|} = (a^{\operatorname{ord}(a)})^{|G|/\operatorname{ord}(a)} = e$. $\blacksquare$

> [!abstract] Corollary A0.5 — Nhóm cấp nguyên tố là cyclic
> Nếu $|G| = p$ là nguyên tố, thì $G \cong \mathbb{Z}/p\mathbb{Z}$ là cyclic. Hơn nữa, mọi phần tử $a \neq e$ đều là generator của $G$.

**Proof.** Lấy $a \neq e$ trong $G$. Khi đó $\operatorname{ord}(a) > 1$ và $\operatorname{ord}(a)$ chia hết $p$. Vì $p$ nguyên tố, $\operatorname{ord}(a) = p$. Vậy $\langle a \rangle$ là nhóm con cấp $p = |G|$, tức $G = \langle a \rangle$. $\blacksquare$

> [!abstract] Corollary A0.6 — Định lý nhỏ Fermat (Fermat's Little Theorem)
> Với $p$ nguyên tố và $a \not\equiv 0 \pmod p$: $a^{p-1} \equiv 1 \pmod p$.

**Proof.** $\mathbb{F}_p^\times = (\mathbb{Z}/p\mathbb{Z})^\times$ là nhóm nhân hữu hạn cấp $p-1$. Áp dụng Corollary A0.4 với $G = \mathbb{F}_p^\times$: $\operatorname{ord}(a)$ chia hết $p-1$, nên $a^{p-1} = (a^{\operatorname{ord}(a)})^{(p-1)/\operatorname{ord}(a)} = 1$. $\blacksquare$

> [!abstract] Corollary A0.7 — Định lý Euler
> Với $a, n$ nguyên dương, $\gcd(a, n) = 1$: $a^{\phi(n)} \equiv 1 \pmod n$.

**Proof.** Áp dụng Corollary A0.4 với $G = (\mathbb{Z}/n\mathbb{Z})^\times$, $|G| = \phi(n)$. $\blacksquare$

> [!abstract] Corollary A0.8 — Phân loại nhóm cấp $2p$
> Cho $p$ là số nguyên tố lẻ. Mọi nhóm cấp $2p$ hoặc là cyclic $\mathbb{Z}/2p\mathbb{Z}$ hoặc là nhóm dihedral $D_{2p}$.

**Proof (phác thảo).** Theo Định lý Cauchy (hệ quả của định lý Sylow), $G$ chứa phần tử $a$ cấp $p$ và phần tử $b$ cấp $2$. Nhóm con $\langle a \rangle$ có chỉ số $2$ nên là chuẩn tắc. Xét $bab^{-1} = a^k$. Vì $b^2 = e$, ta có $a = b^2 a b^{-2} = a^{k^2}$, suy ra $k^2 \equiv 1 \pmod p$, tức $k \equiv \pm 1 \pmod p$. Nếu $k \equiv 1$: $G$ giao hoán, $G \cong \mathbb{Z}/2p\mathbb{Z}$. Nếu $k \equiv -1$: $G \cong D_{2p}$. $\blacksquare$

---

## 4. Chiều ngược của Định lý Lagrange

> [!note] Remark A0.9 — Chiều ngược không đúng tổng quát
> Định lý Lagrange nói $|H|$ chia hết $|G|$, nhưng **chiều ngược không đúng tổng quát**: không phải mọi ước của $|G|$ đều là cấp của một nhóm con của $G$.

> [!example] Example A0.10 — $A_4$ không có nhóm con cấp $6$
> Nhóm thay phiên $A_4$ (nhóm các hoán vị chẵn của $4$ phần tử) có $|A_4| = 12$. Ước số của $12$ là $1, 2, 3, 4, 6, 12$. $A_4$ có nhóm con cấp $1, 2, 3, 4, 12$, nhưng **không có** nhóm con cấp $6$ dù $6 \mid 12$.
>
> **Lý do**: Nếu $H \leq A_4$ có cấp $6$ thì $[A_4:H] = 2$, suy ra $H \trianglelefteq A_4$. Nhưng $A_4$ không có nhóm con chuẩn tắc cấp $6$ (các nhóm con chuẩn tắc của $A_4$ là $\{e\}$, nhóm Klein $V_4$ cấp $4$, và $A_4$).

> [!info] CLT Groups (Converse Lagrange Theorem Groups)
> Một nhóm hữu hạn $G$ được gọi là **CLT group** nếu với mọi ước $d$ của $|G|$, tồn tại nhóm con của $G$ có cấp $d$. Các kết quả đã biết:
> - Mọi $p$-nhóm đều là CLT.
> - Mọi nhóm siêu giải được (supersolvable) đều là CLT.
> - Mọi CLT group đều giải được (solvable).
> - $A_4$ là ví dụ nhỏ nhất của nhóm không CLT.

Các định lý Sylow (Bài 25) cung cấp điều kiện đủ: với mỗi lũy thừa nguyên tố $p^k \mid |G|$, tồn tại nhóm con cấp $p^k$.

---

## 5. Ứng dụng trong Lý thuyết Nhóm

> [!example] Example A0.11 — Xác định nhanh cấu trúc nhóm
> **(a)** Nhóm cấp $15$: Theo Corollary A0.8 (với $p=...$ không áp dụng trực tiếp), ta dùng Sylow. Nhưng Lagrange cho ta biết: mọi phần tử không tầm thường có cấp $3$, $5$, hoặc $15$. Có thể chứng minh mọi nhóm cấp $15$ đều cyclic.
>
> **(b)** Nhóm cấp $4$: Mọi nhóm cấp $4$ hoặc là $\mathbb{Z}/4\mathbb{Z}$ (cyclic) hoặc là $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$ (nhóm Klein $V_4$). Lagrange loại trừ khả năng có phần tử cấp $3$ (vì $3 \nmid 4$).
>
> **(c)** $|G| = 6$: Mọi phần tử có cấp $1, 2, 3,$ hoặc $6$. Không thể có phần tử cấp $4$ hay $5$.

---

## 6. SageMath — Kiểm tra Coset và Lagrange

```sage
# Định nghĩa nhóm đối xứng S4
G = SymmetricGroup(4)
print(f"|S4| = {G.order()}")  # 24

# Lấy một nhóm con (cyclic cấp 4)
H = G.subgroup([G("(1,2,3,4)")])
print(f"|H| = {H.order()}")  # 4
print(f"24 / 4 = {G.order() // H.order()}")  # 6 = index

# Liệt kê tất cả coset trái
cosets = G.cosets(H, side='left')
print(f"Số coset trái: {len(cosets)}")  # 6
for i, c in enumerate(cosets):
    print(f"  Coset {i}: {sorted(c)}")

# Kiểm tra: mỗi coset có đúng |H| phần tử
for c in cosets:
    assert len(c) == H.order(), "Lỗi: coset không đúng kích thước!"
print("Tất cả coset có kích thước bằng |H| ✓")

# Kiểm tra A4 không có nhóm con cấp 6
A4 = AlternatingGroup(4)
print(f"\n|A4| = {A4.order()}")  # 12
has_subgroup_6 = any(
    H.order() == 6 for H in A4.subgroups()
)
print(f"A4 có nhóm con cấp 6? {has_subgroup_6}")  # False
```

---

## References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), Section 3.2, Theorem 3.
- Lang, *Algebra* (3rd ed.), Chapter I §2.
- Hungerford, *Algebra*, Theorem 4.1 (Chapter I).
- Conrad, K., *Cosets and Lagrange's Theorem* (UConn lecture notes).
- Judson, *Abstract Algebra: Theory and Applications*, Chapter 6.
