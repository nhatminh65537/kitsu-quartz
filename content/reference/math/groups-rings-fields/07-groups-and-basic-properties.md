---
title: "07. Groups and Basic Properties"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-07]
aliases: [Groups and Basic Properties]
created: 2026-05-15
---

> **Prerequisites**: [[06-binary-operations|06. Binary Operations, Magmas, Semigroups, and Monoids]] — quen với phép toán hai ngôi, tính kết hợp, phần tử đơn vị, và các cấu trúc magma, semigroup, monoid.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{N}$ | Tập số tự nhiên $\{0, 1, 2, \ldots\}$ |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{Q}$ | Tập số hữu tỉ |
> | $\mathbb{C}$ | Tập số phức |
> | $\cdot$ | Phép toán hai ngôi (nhân) trên nhóm |

> **Objectives**:
> - Nắm vững định nghĩa nhóm từ các tiên đề; phân biệt nhóm Abel và nhóm không Abel.
> - Chứng minh các tính chất cơ bản: tính duy nhất của đơn vị, nghịch đảo, luật rút gọn.
> - Nhận diện cấu trúc nhóm trong các ví dụ: $(\mathbb{Z}, +)$, $(\mathbb{Z}/n\mathbb{Z}, +)$, $(\mathbb{Z}/n\mathbb{Z})^\times$, $GL_n(F)$, $S_n$, $D_{2n}$, $V_4$, $Q_8$.
> - Làm quen với bảng Cayley và khái niệm cấp (order) của nhóm.

---

## Motivation

Trước khi định nghĩa nhóm một cách chính xác, hãy nhìn vào hai ví dụ gợi nhớ.

**Ví dụ 1 — Đối xứng của tam giác đều.** Xét một tam giác đều với ba đỉnh đánh số $1, 2, 3$. Có sáu phép biến đổi hình học giữ nguyên hình tam giác: ba phép quay ($r_0, r_1, r_2$ — quay $0^\circ, 120^\circ, 240^\circ$) và ba phép lật qua trục đối xứng ($s_1, s_2, s_3$). Tập $\{r_0, r_1, r_2, s_1, s_2, s_3\}$ cùng phép hợp thành biến đổi (composition) tạo thành một cấu trúc: hợp thành hai phép đối xứng vẫn là phép đối xứng, tồn tại phép "không làm gì" ($r_0$), và mỗi phép đều có phép ngược. Đây chính là **nhóm nhị diện** (dihedral group) $D_6$ (còn ký hiệu $D_3$), đẳng cấu với $S_3$.

**Ví dụ 2 — Số nguyên với phép cộng.** Tập $\mathbb{Z}$ với phép cộng: tổng hai số nguyên vẫn là số nguyên ($\mathbb{Z}$ đóng), phép cộng kết hợp, số $0$ đóng vai trò đơn vị, và mỗi $n \in \mathbb{Z}$ có nghịch đảo $-n$. Lại một nhóm.

Hai ví dụ trên, tuy xuất phát từ ngữ cảnh rất khác nhau (hình học đối xứng vs. số học), đều chia sẻ cùng một cấu trúc trừu tượng. Chính sự trừu tượng hóa này — bắt giữ bản chất chung của "tính đối xứng" và "phép biến đổi khả nghịch" — là lý do khái niệm nhóm trở thành nền tảng của đại số hiện đại.

Évariste Galois (1811–1832) là người đặt nền móng lý thuyết nhóm qua nghiên cứu tính giải được của phương trình đại số bằng căn. Arthur Cayley (1821–1895) sau đó định nghĩa nhóm trừu tượng. Ngày nay, nhóm xuất hiện khắp nơi: từ lý thuyết số, hình học đại số, đến cơ học lượng tử và mật mã học.

---

## 1. Định nghĩa Nhóm (Group)

> [!definition] Definition 7.1 — Nhóm (Group)
> Một **nhóm** là một bộ $(G, \cdot)$ gồm một tập hợp khác rỗng $G$ và một phép toán hai ngôi $\cdot : G \times G \to G$ thỏa mãn **ba tiên đề** (group axioms):
>
> **(G1) Kết hợp** (Associativity): $\forall\, a, b, c \in G$,
>
> $$
> (a \cdot b) \cdot c = a \cdot (b \cdot c)
> $$
>
> **(G2) Phần tử đơn vị** (Identity element): $\exists\, e \in G$ sao cho $\forall\, a \in G$,
>
> $$
> e \cdot a = a \cdot e = a
> $$
>
> **(G3) Phần tử nghịch đảo** (Inverse element): $\forall\, a \in G$, $\exists\, a^{-1} \in G$ sao cho
>
> $$
> a \cdot a^{-1} = a^{-1} \cdot a = e
> $$

> [!definition] Definition 7.2 — Nhóm Abel (Abelian Group)
> Nhóm $(G, \cdot)$ được gọi là **Abel** (hay **giao hoán**, commutative) nếu thêm tiên đề:
>
> **(G4) Giao hoán** (Commutativity): $\forall\, a, b \in G$,
>
> $$
> a \cdot b = b \cdot a
> $$
>
> Với nhóm Abel phép cộng, ta thường dùng ký hiệu cộng $+$, phần tử đơn vị là $0$, và nghịch đảo của $a$ là $-a$.

> [!note] Remark 7.3 — Quy ước ký hiệu
> Khi không nhầm lẫn, ta viết $ab$ thay cho $a \cdot b$, gọi phép toán là **tích** (product) hay **nhân** (multiplication). Đối với nhóm Abel kiểu cộng: $a + b$, đơn vị $0$, nghịch đảo $-a$.
>
> Trong cả hai trường hợp, **cấu trúc toán học hoàn toàn tương đương** — chỉ khác ký hiệu.

---

## 2. Cấp của Nhóm (Order of a Group)

> [!definition] Definition 7.4 — Cấp của nhóm (Order)
> **Cấp** của nhóm $G$, ký hiệu $|G|$ hoặc $\#G$, là số lượng phần tử của $G$.
>
> - Nếu $|G| < \infty$: $G$ là **nhóm hữu hạn** (finite group).
> - Nếu $|G| = \infty$: $G$ là **nhóm vô hạn** (infinite group).

---

## 3. Các Tính Chất Cơ Bản

> [!abstract] Theorem 7.5 — Tính duy nhất của phần tử đơn vị
> Phần tử đơn vị của nhóm $(G, \cdot)$ là **duy nhất**.

**Proof.** Giả sử $e$ và $e'$ đều thỏa tiên đề (G2). Khi đó:
$$
e = e \cdot e' = e'
$$
Đẳng thức thứ nhất: vì $e'$ là đơn vị, $e \cdot e' = e$. Đẳng thức thứ hai: vì $e$ là đơn vị, $e \cdot e' = e'$. Vậy $e = e'$. $\blacksquare$

> [!abstract] Theorem 7.6 — Tính duy nhất của phần tử nghịch đảo
> Với mỗi $a \in G$, phần tử nghịch đảo $a^{-1}$ là **duy nhất**.

**Proof.** Giả sử $b$ và $c$ đều là nghịch đảo của $a$, tức $ab = ba = e$ và $ac = ca = e$. Khi đó:
$$
b = b \cdot e = b \cdot (ac) = (ba) \cdot c = e \cdot c = c
$$
Vậy $b = c$. $\blacksquare$

> [!abstract] Theorem 7.7 — Luật rút gọn (Cancellation Laws)
> Trong nhóm $G$, với mọi $a, b, c \in G$:
>
> $$
> ab = ac \implies b = c \qquad \text{(luật rút gọn trái)}
> $$
>
> $$
> ba = ca \implies b = c \qquad \text{(luật rút gọn phải)}
> $$

**Proof.** Nhân trái bởi $a^{-1}$: $ab = ac \Rightarrow a^{-1}(ab) = a^{-1}(ac) \Rightarrow (a^{-1}a)b = (a^{-1}a)c \Rightarrow eb = ec \Rightarrow b = c$. Tương tự cho luật rút gọn phải. $\blacksquare$

> [!abstract] Corollary 7.8 — Các đẳng thức hữu ích
> Trong nhóm $G$:
>
> 1. $(a^{-1})^{-1} = a$ với mọi $a \in G$.
> 2. $(ab)^{-1} = b^{-1} a^{-1}$ với mọi $a, b \in G$ (nghịch đảo của tích — lưu ý thứ tự đảo ngược).
> 3. Phương trình $ax = b$ và $xa = b$ đều có **nghiệm duy nhất** trong $G$.

**Proof.**
1. Ta có $a \cdot a^{-1} = e$, nên $a$ là nghịch đảo của $a^{-1}$, tức $(a^{-1})^{-1} = a$.
2. Tính $(ab)(b^{-1}a^{-1}) = a(bb^{-1})a^{-1} = a \cdot e \cdot a^{-1} = aa^{-1} = e$. Tương tự phía trái. Vậy $b^{-1}a^{-1}$ là nghịch đảo của $ab$.
3. $ax = b \Rightarrow x = a^{-1}b$ (duy nhất theo Theorem 7.6 và luật rút gọn). $\blacksquare$

> [!note] Remark 7.9 — Lũy thừa trong nhóm
> Với $g \in G$ và $n \in \mathbb{Z}$, ta định nghĩa:
>
> $$
> g^0 = e, \quad g^n = \underbrace{g \cdot g \cdots g}_{n \text{ lần}} \text{ (với } n > 0\text{)}, \quad g^{-n} = (g^{-1})^n \text{ (với } n > 0\text{)}
> $$
>
> Khi đó: $g^m \cdot g^n = g^{m+n}$ và $(g^m)^n = g^{mn}$ với mọi $m, n \in \mathbb{Z}$.
>
> **Lưu ý**: $(gh)^n \neq g^n h^n$ nói chung nếu $G$ không Abel. Ví dụ trong $S_3$: $(r_1 s_1)^2 \neq r_1^2 s_1^2$.

---

## 4. Các Ví Dụ Quan Trọng

### 4.1 Nhóm số nguyên $(\mathbb{Z}, +)$

> [!example] Example 7.10 — $(\mathbb{Z}, +)$
> Tập số nguyên $\mathbb{Z} = \{\ldots, -2, -1, 0, 1, 2, \ldots\}$ với phép cộng là nhóm Abel vô hạn:
>
> - **Đóng**: $a + b \in \mathbb{Z}$ với mọi $a, b \in \mathbb{Z}$.
> - **Kết hợp**: $(a + b) + c = a + (b + c)$ — hiển nhiên.
> - **Đơn vị**: $e = 0$, vì $a + 0 = 0 + a = a$.
> - **Nghịch đảo**: $(-a) + a = a + (-a) = 0$.
> - **Abel**: $a + b = b + a$.
>
> Tương tự, $(\mathbb{Q}, +)$, $(\mathbb{R}, +)$, $(\mathbb{C}, +)$ đều là nhóm Abel vô hạn.

### 4.2 Nhóm số nguyên modulo $n$: $(\mathbb{Z}/n\mathbb{Z}, +)$

> [!definition] Definition 7.11 — $\mathbb{Z}/n\mathbb{Z}$
> Với $n \in \mathbb{N}$, $n \geq 1$, ta định nghĩa:
>
> $$
> \mathbb{Z}/n\mathbb{Z} = \mathbb{Z}_n = \{0, 1, 2, \ldots, n-1\}
> $$
>
> với phép cộng modulo $n$: $a +_n b = (a + b) \bmod n$.

> [!example] Example 7.12 — $(\mathbb{Z}/6\mathbb{Z}, +)$
> $\mathbb{Z}_6 = \{0, 1, 2, 3, 4, 5\}$, phép cộng mod $6$:
>
> | $+$ | 0 | 1 | 2 | 3 | 4 | 5 |
> |-----|---|---|---|---|---|---|
> | **0** | 0 | 1 | 2 | 3 | 4 | 5 |
> | **1** | 1 | 2 | 3 | 4 | 5 | 0 |
> | **2** | 2 | 3 | 4 | 5 | 0 | 1 |
> | **3** | 3 | 4 | 5 | 0 | 1 | 2 |
> | **4** | 4 | 5 | 0 | 1 | 2 | 3 |
> | **5** | 5 | 0 | 1 | 2 | 3 | 4 |
>
> Đây là **bảng Cayley** (Cayley table) của $\mathbb{Z}_6$.
>
> - Đơn vị: $e = 0$.
> - Nghịch đảo: $-0 = 0$, $-1 = 5$, $-2 = 4$, $-3 = 3$.
> - $|\mathbb{Z}_6| = 6$. Là nhóm Abel.

### 4.3 Nhóm nhân $(\mathbb{Z}/n\mathbb{Z})^\times$

> [!definition] Definition 7.13 — $(\mathbb{Z}/n\mathbb{Z})^\times$
> Tập các lớp dư nguyên tố cùng nhau với $n$:
>
> $$
> (\mathbb{Z}/n\mathbb{Z})^\times = \{[a] \in \mathbb{Z}/n\mathbb{Z} \mid \gcd(a, n) = 1\}
> $$
>
> với phép nhân modulo $n$.

> [!example] Example 7.14 — $(\mathbb{Z}/8\mathbb{Z})^\times$
> $(\mathbb{Z}/8\mathbb{Z})^\times = \{1, 3, 5, 7\}$ (các số lẻ từ $1$ đến $7$).
>
> Bảng Cayley (nhân mod 8):
>
> | $\times$ | 1 | 3 | 5 | 7 |
> |----------|---|---|---|---|
> | **1** | 1 | 3 | 5 | 7 |
> | **3** | 3 | 1 | 7 | 5 |
> | **5** | 5 | 7 | 1 | 3 |
> | **7** | 7 | 5 | 3 | 1 |
>
> - Đơn vị: $1$.
> - Nghịch đảo: $3^{-1} = 3$ (vì $3 \cdot 3 = 9 \equiv 1$), $5^{-1} = 5$, $7^{-1} = 7$.
> - $|(\mathbb{Z}/8\mathbb{Z})^\times| = 4$. Là nhóm Abel.
>
> Hàm số $\phi(n) = |(\mathbb{Z}/n\mathbb{Z})^\times|$ được gọi là **hàm Euler totient**, sẽ học kỹ trong [[09-cyclic-groups-and-order-of-elements|09. Cyclic Groups]].

### 4.4 Nhóm tuyến tính tổng quát $GL_n(F)$

> [!definition] Definition 7.15 — Nhóm tuyến tính tổng quát (General Linear Group)
> Cho $F$ là một trường, $n \geq 1$. **Nhóm tuyến tính tổng quát** là:
>
> $$
> GL_n(F) = \{A \in M_n(F) \mid \det(A) \neq 0\}
> $$
>
> với phép nhân ma trận. Đây là nhóm của tất cả các ma trận khả nghịch cỡ $n \times n$ trên $F$.

> [!example] Example 7.16 — $GL_2(\mathbb{F}_2)$
> $\mathbb{F}_2 = \{0, 1\}$ là trường hai phần tử. Các ma trận $2 \times 2$ khả nghịch trên $\mathbb{F}_2$:
>
> $$
> GL_2(\mathbb{F}_2) = \left\{
> \begin{pmatrix}1&0\\0&1\end{pmatrix},
> \begin{pmatrix}1&1\\0&1\end{pmatrix},
> \begin{pmatrix}1&0\\1&1\end{pmatrix},
> \begin{pmatrix}0&1\\1&0\end{pmatrix},
> \begin{pmatrix}1&1\\1&0\end{pmatrix},
> \begin{pmatrix}0&1\\1&1\end{pmatrix}
> \right\}
> $$
>
> $|GL_2(\mathbb{F}_2)| = 6$. Nhóm này **không Abel** (nhân ma trận không giao hoán). Thực tế $GL_2(\mathbb{F}_2) \cong S_3$.
>
> Với $F$ hữu hạn $|F| = q = p^k$:
>
> $$
> |GL_n(\mathbb{F}_q)| = \prod_{i=0}^{n-1}(q^n - q^i) = (q^n - 1)(q^n - q)(q^n - q^2)\cdots(q^n - q^{n-1})
> $$

### 4.5 Nhóm đối xứng $S_n$

> [!definition] Definition 7.17 — Nhóm đối xứng (Symmetric Group)
> **Nhóm đối xứng** $S_n$ là tập tất cả các song ánh (bijection) từ $\{1, 2, \ldots, n\}$ lên chính nó, với phép hợp thành ánh xạ:
>
> $$
> S_n = \{\sigma : \{1,\ldots,n\} \to \{1,\ldots,n\} \mid \sigma \text{ là song ánh}\}
> $$
>
> $|S_n| = n!$. Với $n \geq 3$, $S_n$ không Abel.

> [!example] Example 7.18 — $S_3$
> $|S_3| = 6$. Các phần tử viết dưới dạng chu trình (cycle notation):
>
> $$
> S_3 = \{e, (12), (13), (23), (123), (132)\}
> $$
>
> Tích: $(123)(12) = (13)$ (áp dụng $(12)$ trước, rồi $(123)$). Nhưng $(12)(123) = (23)$, vậy $S_3$ không Abel: $(123)(12) \neq (12)(123)$.

### 4.6 Nhóm nhị diện $D_{2n}$ (Dihedral Group)

> [!definition] Definition 7.19 — Nhóm nhị diện (Dihedral Group)
> **Nhóm nhị diện** $D_{2n}$ (cũng ký hiệu $D_n$) là nhóm đối xứng của đa giác đều $n$ cạnh, gồm $n$ phép quay và $n$ phép lật:
>
> $$
> D_{2n} = \langle r, s \mid r^n = e, s^2 = e, srs = r^{-1} \rangle
> $$
>
> $|D_{2n}| = 2n$. Với $n \geq 3$, $D_{2n}$ không Abel.

> [!example] Example 7.20 — $D_6$ (đối xứng tam giác đều)
> $D_6$ chính là nhóm đối xứng của tam giác đều trong ví dụ mở đầu: $D_6 \cong S_3$.
>
> $D_6 = \{e, r, r^2, s, rs, r^2s\}$ với $r^3 = e$, $s^2 = e$, $srs = r^{-1}$.

### 4.7 Nhóm bốn Klein $V_4$ (Klein Four-Group)

> [!example] Example 7.21 — Nhóm bốn Klein $V_4$
> $V_4 = \{e, a, b, c\}$ với $a^2 = b^2 = c^2 = e$ và $ab = c$, $bc = a$, $ca = b$. Đây là nhóm Abel cấp 4 không cyclic:
>
> $$
> V_4 \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}
> $$
>
> $V_4$ là nhóm không cyclic nhỏ nhất. Nó xuất hiện tự nhiên dưới dạng nhóm con của $S_4$: $V_4 \cong \{e, (12)(34), (13)(24), (14)(23)\}$.

### 4.8 Nhóm quaternion $Q_8$

> [!example] Example 7.22 — Nhóm quaternion (Quaternion Group)
> $Q_8 = \{\pm 1, \pm i, \pm j, \pm k\}$ với phép nhân xác định bởi $i^2 = j^2 = k^2 = ijk = -1$. Đây là nhóm không Abel cấp 8.
>
> $Q_8$ quan trọng vì nó là ví dụ nhỏ nhất của **nhóm Hamilton** (nhóm không Abel trong đó mọi nhóm con đều chuẩn tắc).

### 4.9 Nhóm tầm thường (Trivial Group)

> [!example] Example 7.23 — Nhóm tầm thường
> Nhóm chỉ gồm một phần tử $\{e\}$, với $e \cdot e = e$. Đây là nhóm nhỏ nhất, được gọi là **nhóm tầm thường** (trivial group), ký hiệu $\{e\}$ hay $1$ hay $0$ (tùy bối cảnh).

---

## 5. Bảng Cayley (Cayley Table)

> [!definition] Definition 7.24 — Bảng Cayley
> Cho nhóm hữu hạn $G = \{g_1, g_2, \ldots, g_n\}$ với $g_1 = e$. **Bảng Cayley** là bảng $n \times n$ trong đó ô hàng $i$, cột $j$ chứa $g_i \cdot g_j$.

Bảng Cayley mã hóa hoàn toàn cấu trúc của nhóm hữu hạn. Từ bảng Cayley, ta có thể đọc được: đơn vị (hàng/cột nào giữ nguyên thứ tự), nghịch đảo (tìm ô bằng $e$), và kiểm tra tính Abel (bảng đối xứng theo đường chéo chính).

> [!example] Example 7.25 — Bảng Cayley của $\mathbb{Z}_4$
> $\mathbb{Z}_4 = \{0, 1, 2, 3\}$, phép cộng mod 4:
>
> | $+$ | 0 | 1 | 2 | 3 |
> |-----|---|---|---|---|
> | **0** | 0 | 1 | 2 | 3 |
> | **1** | 1 | 2 | 3 | 0 |
> | **2** | 2 | 3 | 0 | 1 |
> | **3** | 3 | 0 | 1 | 2 |
>
> Bảng đối xứng qua đường chéo → nhóm Abel. Hàng $0$ = hàng tiêu đề → $0$ là đơn vị.

---

## 6. Counterexamples và Cấu Trúc Không Phải Nhóm

> [!warning] Counterexample 7.26 — $(\mathbb{N}, +)$ không phải nhóm
> $\mathbb{N} = \{0, 1, 2, \ldots\}$ với phép cộng thỏa mãn (G1) và (G2) với đơn vị $0$, nhưng vi phạm (G3): không tồn tại $n \in \mathbb{N}$ sao cho $3 + n = 0$.

> [!warning] Counterexample 7.27 — $(\mathbb{Z}, \cdot)$ không phải nhóm
> $\mathbb{Z}$ với phép nhân có đơn vị $1$ và thỏa (G1), nhưng vi phạm (G3): $2$ không có nghịch đảo trong $\mathbb{Z}$ (cần $\frac{1}{2} \notin \mathbb{Z}$).

> [!warning] Counterexample 7.28 — $M_n(\mathbb{R})$ với nhân ma trận không phải nhóm
> Tập tất cả ma trận thực $n \times n$ với phép nhân không phải nhóm vì ma trận kỳ dị (singular matrix) không có nghịch đảo. Đó là lý do phải lấy $GL_n(\mathbb{R})$ (chỉ các ma trận khả nghịch).

> [!warning] Counterexample 7.29 — $(\mathbb{Z}/n\mathbb{Z}, \cdot)$ không phải nhóm
> Phép nhân trên $\mathbb{Z}/n\mathbb{Z}$ có đơn vị $1$ nhưng các phần tử không nguyên tố cùng nhau với $n$ (như $2$ trong $\mathbb{Z}/6\mathbb{Z}$) không có nghịch đảo nhân. Đó là lý do ta chỉ lấy $(\mathbb{Z}/n\mathbb{Z})^\times$ — các phần tử khả nghịch.

---

## 7. SageMath Cheatsheet

```python
# ---- Nhóm đối xứng ----
G = SymmetricGroup(3)
print(G.order())          # 6
print(list(G))            # liệt kê các phần tử

# Phần tử và phép nhân
sigma = G([(1,2,3)])      # chu trình (1 2 3)
tau   = G([(1,2)])        # hoán vị (1 2)
print(sigma * tau)        # hợp thành: tau trước, rồi sigma

# ---- Nhóm cyclic Z_n ----
Z6 = CyclicPermutationGroup(6)
print(Z6.order())         # 6
print(Z6.is_abelian())    # True

# ---- Z/nZ dưới dạng nhóm cộng ----
Z4 = AdditiveAbelianGroup([4])  # Z/4Z
print(Z4.order())         # 4

# ---- (Z/nZ)^x ----
G = Integers(10).unit_group()   # nhóm nhân modulo 10
print(G.order())          # phi(10) = 4

# ---- GL_n(F_q) ----
GL2 = GL(2, GF(3))
print(GL2.order())        # (3^2-1)(3^2-3) = 48

# ---- Nhóm nhị diện ----
D6 = DihedralGroup(3)     # D_6 (đối xứng tam giác)
print(D6.order())         # 6
print(D6.is_abelian())    # False

# ---- Bảng Cayley ----
G = SymmetricGroup(3)
print(G.cayley_table())
```

---

## 8. Summary

- **Nhóm** $(G, \cdot)$: tập hợp với phép toán hai ngôi thỏa (G1) kết hợp, (G2) đơn vị, (G3) nghịch đảo.
- **Nhóm Abel**: thêm (G4) giao hoán.
- **Cấp** $|G|$: số phần tử; nhóm hữu hạn vs. vô hạn.
- **Tính chất cơ bản**: đơn vị duy nhất, nghịch đảo duy nhất, luật rút gọn, $(ab)^{-1} = b^{-1}a^{-1}$.
- **Ví dụ trọng yếu**: $(\mathbb{Z}, +)$, $(\mathbb{Z}_n, +)$, $(\mathbb{Z}_n)^\times$, $GL_n(F)$, $S_n$, $D_{2n}$, $V_4$, $Q_8$.
- **Bảng Cayley**: công cụ trực quan cho nhóm hữu hạn nhỏ.

---

## 9. References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §1.1–§1.3.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 3.
- Hungerford, T. W. *Algebra*, Chapter I §1.
- Lang, S. *Algebra* (3rd ed.), Chapter I §1–2.
