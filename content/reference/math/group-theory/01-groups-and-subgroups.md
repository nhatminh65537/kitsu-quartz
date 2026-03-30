---
title: "01. Groups and Subgroups"
tags: [math, group-theory, lesson-01]
aliases: [Groups and Subgroups]
created: 2026-03-26
---

> **Prerequisites**: Kiến thức đại số trừu tượng cơ bản (tập hợp, ánh xạ, quan hệ tương đương, cấu trúc đại số sơ cấp)
> **Objectives**:
> - Nắm vững định nghĩa tiên đề của nhóm và nhận diện nhóm trong các ví dụ cụ thể
> - Chứng minh các tính chất cơ bản: tính duy nhất của đơn vị và nghịch đảo, quy tắc xóa
> - Hiểu và áp dụng tiêu chuẩn nhóm con (subgroup criterion)
> - Phân biệt nhóm hữu hạn và vô hạn, nhóm Abel và không Abel

---

## Motivation / Intuition

Nhóm là cấu trúc đại số nền tảng nhất — tối giản đến mức chỉ giữ lại điều cốt yếu nhất của "phép biến đổi có thể đảo ngược". Ý tưởng xuất phát từ hai nguồn song song trong thế kỷ 19:

**Nguồn 1 — Lý thuyết phương trình**: Évariste Galois (1811–1832) quan sát rằng khả năng giải một phương trình đa thức bằng căn thức hoàn toàn được quyết định bởi cấu trúc của nhóm các hoán vị hoán đổi các nghiệm với nhau. Đây là khởi nguồn của Galois Theory — chủ đề mà ta sẽ trở lại ở bài 13.

**Nguồn 2 — Hình học và đối xứng**: Arthur Cayley (1821–1895) và Felix Klein (trong *Erlangen Program* 1872) nhận ra rằng mọi loại hình học đều được xác định bởi nhóm các phép biến đổi bảo toàn cấu trúc đó. Hình học Euclid ↔ nhóm phép dời hình; hình học xạ ảnh ↔ nhóm $\operatorname{PGL}$; v.v.

Trực giác cốt lõi: **nhóm nắm bắt chính xác khái niệm "đối xứng" — tập hợp các phép biến đổi có thể hợp thành và có thể đảo ngược**. Không hơn, không kém. Ba tiên đề của nhóm là sự mã hóa tối giản nhất của ý tưởng này.

Ở mức graduate, ta sẽ không chỉ kiểm tra định nghĩa mà còn khai thác cấu trúc: nhóm con nào tồn tại, chúng tương tác với nhau như thế nào, và nhóm có thể được "xây dựng" từ các mảnh nhỏ hơn như thế nào.

---

## Nhóm (Group)

### Definition

> [!definition] Definition 1.1 — Nhóm (Group)
> Một **nhóm** là một bộ $(G, \cdot)$ gồm một tập hợp $G \neq \emptyset$ và một phép toán hai ngôi $\cdot : G \times G \to G$ thỏa mãn ba tiên đề:
>
> **(G1) Kết hợp** (Associativity): $\forall\, a, b, c \in G$,
>
> $$
> (a \cdot b) \cdot c = a \cdot (b \cdot c)
> $$
>
> **(G2) Phần tử đơn vị** (Identity): $\exists\, e \in G$ sao cho $\forall\, a \in G$,
>
> $$
> e \cdot a = a \cdot e = a
> $$
>
> **(G3) Phần tử nghịch đảo** (Inverse): $\forall\, a \in G$, $\exists\, a^{-1} \in G$ sao cho
>
> $$
> a \cdot a^{-1} = a^{-1} \cdot a = e
> $$
>
> Nếu thêm **(G4) Giao hoán** (Commutativity): $a \cdot b = b \cdot a$ với mọi $a, b \in G$, ta gọi $G$ là **nhóm Abel** (Abelian group).
>
> [!note] Remark 1.2 — Về tính đóng
> Tính đóng (closure: $a \cdot b \in G$ với mọi $a, b \in G$) đã được hàm chứa trong định nghĩa $\cdot : G \times G \to G$ là phép toán trên $G$. Một số tài liệu liệt kê nó như tiên đề thứ tư, nhưng về bản chất đây chỉ là yêu cầu $\cdot$ phải là hàm đúng nghĩa (well-defined) trên $G$.
>
> [!info] Bảng ký hiệu
> Ta thường viết $ab$ thay cho $a \cdot b$ khi không có nhầm lẫn. Với nhóm cộng (additive group), phép toán viết là $+$, phần tử đơn vị là $0$, và nghịch đảo của $a$ là $-a$.

### Theorem

> [!abstract] Theorem 1.3 — Tính duy nhất của phần tử đơn vị
> Phần tử đơn vị của một nhóm $(G, \cdot)$ là duy nhất.

**Proof.**
Giả sử $e$ và $e'$ đều thỏa (G2). Khi đó, vì $e'$ là đơn vị, ta có $e \cdot e' = e$. Vì $e$ là đơn vị, ta có $e \cdot e' = e'$. Suy ra $e = e'$. $\blacksquare$

> [!abstract] Theorem 1.4 — Tính duy nhất của nghịch đảo
> Với mỗi $a \in G$, nghịch đảo $a^{-1}$ là duy nhất.

**Proof.**
Giả sử $b$ và $c$ đều là nghịch đảo của $a$, tức $ab = ba = e$ và $ac = ca = e$. Khi đó:

$$
b = be = b(ac) = (ba)c = ec = c
$$

Vậy $b = c$. $\blacksquare$

> [!abstract] Theorem 1.5 — Các hệ quả cơ bản
> Cho $(G, \cdot)$ là một nhóm. Khi đó:
>
> 1. $(a^{-1})^{-1} = a$ với mọi $a \in G$.
> 2. $(ab)^{-1} = b^{-1} a^{-1}$ với mọi $a, b \in G$.
> 3. **Quy tắc xóa trái** (Left cancellation): $ca = cb \Rightarrow a = b$.
> 4. **Quy tắc xóa phải** (Right cancellation): $ac = bc \Rightarrow a = b$.

**Proof.**
(1) Ta có $a \cdot a^{-1} = e$, nên $a$ là nghịch đảo của $a^{-1}$, tức $(a^{-1})^{-1} = a$.

(2) Kiểm tra: $(ab)(b^{-1}a^{-1}) = a(bb^{-1})a^{-1} = a \cdot e \cdot a^{-1} = aa^{-1} = e$. Tương tự phía trái. Vậy $(ab)^{-1} = b^{-1}a^{-1}$.

(3) Nếu $ca = cb$, nhân $c^{-1}$ vào bên trái: $c^{-1}(ca) = c^{-1}(cb)$, suy ra $(c^{-1}c)a = (c^{-1}c)b$, tức $ea = eb$, vậy $a = b$.

(4) Tương tự, nhân $c^{-1}$ vào bên phải. $\blacksquare$

> [!warning] Counterexample 1.6 — Phép nhân ma trận không giao hoán
> Tập $\operatorname{GL}_2(\mathbb{R})$ gồm các ma trận $2 \times 2$ khả nghịch với hệ số thực tạo thành một nhóm (gọi là **general linear group**) với phép nhân ma trận. Nhóm này **không Abel**:
>
> $$
> A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix}
> $$
>
> $$
> AB = \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix} \neq \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix} = BA
> $$

### Bảng ví dụ nhóm cơ bản

| Nhóm | Phép toán | Đơn vị | Nghịch đảo | Abel? | Hữu hạn? |
|------|-----------|--------|------------|-------|----------|
| $(\mathbb{Z}, +)$ | Cộng số nguyên | $0$ | $-n$ | ✓ | ✗ |
| $(\mathbb{Q}^*, \cdot)$ | Nhân số hữu tỉ ≠ 0 | $1$ | $1/q$ | ✓ | ✗ |
| $(\mathbb{Z}_n, +)$ | Cộng modulo $n$ | $0$ | $n - a$ | ✓ | ✓ |
| $(\mathbb{Z}_p^*, \cdot)$ | Nhân modulo $p$ nguyên tố | $1$ | $a^{p-2} \bmod p$ | ✓ | ✓ |
| $S_n$ | Hợp thành hoán vị | $\operatorname{id}$ | $\sigma^{-1}$ | ✗ ($n \geq 3$) | ✓ |
| $\operatorname{GL}_n(\mathbb{R})$ | Nhân ma trận | $I_n$ | $A^{-1}$ | ✗ ($n \geq 2$) | ✗ |

> [!example] Example 1.7 — Nhóm số phức đơn vị
> Tập $\mu_n = \left\{ e^{2\pi i k/n} : k = 0, 1, \ldots, n-1 \right\}$ gồm $n$ căn bậc $n$ của đơn vị tạo thành một nhóm Abel hữu hạn bậc $n$ với phép nhân số phức. Đây là một trong những ví dụ quan trọng nhất — ta sẽ thấy nó đẳng cấu với $\mathbb{Z}_n$ ở bài 02.

---

## Nhóm con (Subgroup)

### Definition

> [!definition] Definition 1.8 — Nhóm con (Subgroup)
> Cho $(G, \cdot)$ là một nhóm. Một tập con $H \subseteq G$ được gọi là **nhóm con** của $G$, ký hiệu $H \leq G$, nếu $(H, \cdot)$ cũng tạo thành một nhóm với cùng phép toán được thu hẹp lên $H$.
>
> Tương đương, $H \leq G$ khi và chỉ khi:
>
> - $H \neq \emptyset$
> - $\forall\, a, b \in H: ab \in H$ (đóng với phép toán)
> - $\forall\, a \in H: a^{-1} \in H$ (đóng với nghịch đảo)
>
> [!note] Remark 1.9 — Phần tử đơn vị của nhóm con
> Nếu $H \leq G$ thì phần tử đơn vị của $H$ trùng với phần tử đơn vị $e$ của $G$. Thật vậy, gọi $e_H$ là đơn vị của $H$, thì $e_H \cdot e_H = e_H$ trong $G$. Nhân $e_H^{-1}$ (nghịch đảo trong $G$) vào hai vế: $e_H = e$.

### Theorem

> [!abstract] Theorem 1.10 — Tiêu chuẩn nhóm con một điều kiện (One-Step Subgroup Test)
> Cho $G$ là nhóm và $\emptyset \neq H \subseteq G$. Khi đó
>
> $$
> H \leq G \iff \forall\, a, b \in H: \; ab^{-1} \in H
> $$

**Proof.**
($\Rightarrow$) Hiển nhiên: nếu $H$ là nhóm thì $b^{-1} \in H$ và $a \cdot b^{-1} \in H$.

($\Leftarrow$) Giả sử điều kiện thỏa. Ta chứng minh từng tiên đề:

- **Đơn vị**: Lấy $a \in H$ (tồn tại vì $H \neq \emptyset$). Đặt $b = a$: $a \cdot a^{-1} = e \in H$.
- **Nghịch đảo**: Với $a \in H$, đặt $b = a$ ta có $e \in H$. Đặt $a = e, b = a$: $e \cdot a^{-1} = a^{-1} \in H$.
- **Đóng**: Với $a, b \in H$, ta có $b^{-1} \in H$ (bước trên). Đặt $b' = b^{-1}$: $a \cdot (b^{-1})^{-1} = ab \in H$.
- **Kết hợp**: Kế thừa từ $G$.

Vậy $H \leq G$. $\blacksquare$

> [!abstract] Theorem 1.11 — Tiêu chuẩn nhóm con hữu hạn (Finite Subgroup Test)
> Cho $G$ là nhóm và $\emptyset \neq H \subseteq G$ **hữu hạn**. Khi đó
>
> $$
> H \leq G \iff \forall\, a, b \in H: \; ab \in H
> $$
> Tức là, với tập con hữu hạn, chỉ cần kiểm tra tính đóng.

**Proof.**
Chiều ($\Rightarrow$) hiển nhiên. Chiều ($\Leftarrow$): Ta cần chứng minh $a^{-1} \in H$ với mọi $a \in H$. Vì $H$ hữu hạn và đóng với phép nhân, xét dãy $a, a^2, a^3, \ldots$ Vì $H$ hữu hạn, tồn tại $m > n$ sao cho $a^m = a^n$. Áp dụng quy tắc xóa: $a^{m-n} = e$, tức $a^{m-n-1} \cdot a = e$, nên $a^{-1} = a^{m-n-1} \in H$ (vì $H$ đóng và $m - n - 1 \geq 0$). $\blacksquare$

> [!example] Example 1.12 — Nhóm con của $(\mathbb{Z}, +)$
> Mọi nhóm con của $(\mathbb{Z}, +)$ có dạng $n\mathbb{Z} = \left\{ nk : k \in \mathbb{Z} \right\}$ với $n \geq 0$.
>
> **Chứng minh**: Gọi $H \leq \mathbb{Z}$. Nếu $H = \{0\}$ thì $H = 0\mathbb{Z}$. Nếu $H \neq \{0\}$, đặt $n = \min\left\{ h \in H : h > 0 \right\}$ (tồn tại vì $H$ chứa phần tử dương). Rõ ràng $n\mathbb{Z} \subseteq H$. Với $h \in H$ bất kỳ, viết $h = qn + r$ ($0 \leq r < n$). Vì $h \in H$ và $qn \in H$ nên $r = h - qn \in H$. Tính tối tiểu của $n$ buộc $r = 0$, tức $h \in n\mathbb{Z}$.
>
> [!example] Example 1.13 — Center của một nhóm
> **Tâm** (center) của nhóm $G$, ký hiệu $Z(G)$, được định nghĩa:
>
> $$
> Z(G) = \left\{ z \in G : zg = gz \; \forall\, g \in G \right\}
> $$
>
> Đây là tập hợp tất cả các phần tử giao hoán với mọi phần tử của $G$. Ta kiểm tra $Z(G) \leq G$:
>
> Nếu $z_1, z_2 \in Z(G)$, thì với mọi $g \in G$:
>
> $$
> (z_1 z_2^{-1}) g = z_1 (z_2^{-1} g) = z_1 (g z_2^{-1}) = (z_1 g) z_2^{-1} = (g z_1) z_2^{-1} = g (z_1 z_2^{-1})
> $$
>
> Vậy $z_1 z_2^{-1} \in Z(G)$, theo Theorem 1.10, $Z(G) \leq G$.
>
> **Nhận xét**: $G$ là nhóm Abel $\iff$ $Z(G) = G$.
>
> [!warning] Counterexample 1.14 — Hợp của hai nhóm con không nhất thiết là nhóm con
> Trong $(\mathbb{Z}, +)$, đặt $H = 2\mathbb{Z}$ và $K = 3\mathbb{Z}$. Cả $H$ và $K$ đều là nhóm con, nhưng $H \cup K$ không phải nhóm con: $2 \in H \subseteq H \cup K$ và $3 \in K \subseteq H \cup K$, nhưng $2 + 3 = 5 \notin H \cup K$.
>
> [!abstract] Theorem 1.15 — Giao của nhóm con
> Giao của một họ nhóm con bất kỳ là một nhóm con.
>
> Chính xác hơn: nếu $\left\{ H_i \right\}_{i \in I}$ là một họ nhóm con của $G$, thì
>
> $$
> \bigcap_{i \in I} H_i \leq G
> $$

**Proof.**
Đặt $H = \bigcap_{i \in I} H_i$. Vì $e \in H_i$ với mọi $i$, nên $e \in H$, tức $H \neq \emptyset$. Với $a, b \in H$: với mỗi $i$, $a, b \in H_i \leq G$, nên $ab^{-1} \in H_i$. Vậy $ab^{-1} \in H$. Theo Theorem 1.10, $H \leq G$. $\blacksquare$

### Nhóm con sinh bởi một tập (Generated Subgroup)

> [!definition] Definition 1.16 — Nhóm con sinh bởi tập $S$
> Cho $S \subseteq G$. **Nhóm con sinh bởi $S$**, ký hiệu $\langle S \rangle$, là nhóm con nhỏ nhất của $G$ chứa $S$:
>
> $$
> \langle S \rangle = \bigcap \left\{ H \leq G : S \subseteq H \right\}
> $$
>
> Theo Theorem 1.15, đây là nhóm con. Một cách cụ thể:
>
> $$
> \langle S \rangle = \left\{ s_1^{\varepsilon_1} s_2^{\varepsilon_2} \cdots s_k^{\varepsilon_k} : k \geq 0, \; s_i \in S, \; \varepsilon_i \in \left\{ \pm 1 \right\} \right\}
> $$
>
> tức là tập hợp tất cả các **word** hữu hạn từ $S \cup S^{-1}$.
>
> [!note] Remark 1.17
> Quy ước: $\langle \emptyset \rangle = \{e\}$ (product rỗng bằng đơn vị).
>
> Nếu $S = \{g\}$ là một phần tử, ta viết $\langle g \rangle$ thay cho $\langle \{g\} \rangle$.

---

## Bậc của nhóm và phần tử (Order)

> [!definition] Definition 1.18 — Bậc (Order)
> - **Bậc của nhóm** $G$, ký hiệu $|G|$, là số phần tử của $G$ (có thể vô hạn).
> - **Bậc của phần tử** $g \in G$, ký hiệu $\operatorname{ord}(g)$, là số nguyên dương nhỏ nhất $n$ sao cho $g^n = e$. Nếu không tồn tại $n$ như vậy, ta nói $\operatorname{ord}(g) = \infty$.
>
> [!abstract] Theorem 1.19 — Bậc và lũy thừa
> Cho $g \in G$ có $\operatorname{ord}(g) = n < \infty$. Khi đó:
>
> $$
> g^m = e \iff n \mid m
> $$

**Proof.**
Viết $m = qn + r$ với $0 \leq r < n$. Khi đó $g^m = g^{qn+r} = (g^n)^q \cdot g^r = e^q \cdot g^r = g^r$. Vậy $g^m = e \iff g^r = e$. Vì $0 \leq r < n$ và $n$ là số nhỏ nhất thỏa $g^n = e$, điều này xảy ra khi và chỉ khi $r = 0$, tức $n \mid m$. $\blacksquare$

---

## SageMath Cheatsheet

Tạo và khám phá nhóm cơ bản trong SageMath:

```sage
G = SymmetricGroup(4)
G.order()

Z12 = Zmod(12)
Z12.list()

G = SymmetricGroup(5)
H = G.subgroup([G((1,2)), G((1,2,3))])
H.is_subgroup(G)
H.order()

G = DihedralGroup(6)
G.center()

g = SymmetricGroup(6)([(1,2,3),(4,5)])
g.order()

G = SymmetricGroup(4)
G.subgroups()
```

---

## Summary / Key Takeaways

- Nhóm $(G, \cdot)$ thỏa ba tiên đề: kết hợp, đơn vị, nghịch đảo. Tính đóng hàm chứa trong định nghĩa phép toán.
- Phần tử đơn vị là duy nhất; nghịch đảo của mỗi phần tử là duy nhất.
- Quy tắc xóa (cancellation) thỏa trong mọi nhóm; $(ab)^{-1} = b^{-1}a^{-1}$.
- **One-Step Subgroup Test**: $H \leq G \iff H \neq \emptyset$ và $ab^{-1} \in H$ với mọi $a, b \in H$.
- **Finite Subgroup Test**: với $H$ hữu hạn, chỉ cần kiểm tra tính đóng.
- Giao của nhóm con là nhóm con; hợp thì không nhất thiết.
- Tâm $Z(G) \leq G$ luôn là nhóm con Abel của $G$.
- Nhóm con sinh bởi $S$: nhóm con nhỏ nhất chứa $S$.
- Bậc phần tử: $g^m = e \iff \operatorname{ord}(g) \mid m$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapters 1–2.
- Hungerford, T. W. *Algebra*, Chapter I §§1–2.
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §§1–2.
- Milne, J. S. *Group Theory* (v4.00), Chapter 1. https://www.jmilne.org/math/CourseNotes/GT.pdf
- https://doc.sagemath.org/html/en/reference/groups/
