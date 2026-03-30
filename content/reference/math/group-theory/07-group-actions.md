---
title: "07. Group Actions"
tags: [math, group-theory, lesson-07]
aliases: [Group Actions]
created: 2026-03-26
---

> **Prerequisites**: [[06-group-homomorphisms|06. Group Homomorphisms]]
> **Objectives**:
> - Định nghĩa group action và biểu diễn hoán vị (permutation representation)
> - Xác định orbit, stabilizer và chứng minh định lý Orbit-Stabilizer
> - Phát biểu và áp dụng phương trình lớp (class equation)
> - Chứng minh và áp dụng bổ đề Burnside để đếm quỹ đạo
> - Phân tích các ví dụ canonical: liên hợp, coset action, $p$-nhóm

---

## Motivation / Intuition

Group action là sự kết hợp đẹp đẽ giữa lý thuyết nhóm và lý thuyết tập hợp: ta cho nhóm $G$ "tác động" lên một tập hợp $X$, và nghiên cứu cấu trúc của $G$ thông qua cách nó hoán vị các phần tử của $X$.

Đây là ngôn ngữ tự nhiên cho hàng loạt ứng dụng: phép đối xứng hình học (nhóm tác động lên không gian), đếm tổ hợp (Burnside), và đặc biệt — chứng minh các định lý Sylow (bài 08). Tất cả các bằng chứng về $p$-nhóm và Sylow đều dùng kỹ thuật group action một cách thiết yếu.

---

## Định nghĩa Group Action

> [!definition] Definition 7.1 — Group Action (Left Action)
> Một **tác động trái** (left action) của nhóm $G$ lên tập hợp $X$ là ánh xạ
>
> $$
> \cdot : G \times X \to X, \quad (g, x) \mapsto g \cdot x
> $$
>
> thỏa hai tiên đề:
>
> 1. **Đơn vị**: $e \cdot x = x$ với mọi $x \in X$.
> 2. **Tương thích**: $(gh) \cdot x = g \cdot (h \cdot x)$ với mọi $g, h \in G$, $x \in X$.
>
> Ta nói $G$ **tác động** lên $X$ (viết tắt: $G \curvearrowright X$).
>
> [!abstract] Theorem 7.2 — Biểu diễn hoán vị (Permutation Representation)
> Mỗi action $G \curvearrowright X$ xác định duy nhất một đồng cấu:
>
> $$
> \rho : G \to \operatorname{Sym}(X), \quad g \mapsto \sigma_g, \quad \sigma_g(x) = g \cdot x
> $$
>
> Ngược lại, mọi đồng cấu $\rho : G \to \operatorname{Sym}(X)$ xác định một action.
>
> **Kernel** của action là $\ker\rho = \left\{ g \in G : g \cdot x = x\;\forall x \in X \right\}$ — tập các phần tử tác động trivially.

**Proof.**
$\sigma_g$ là song ánh (nghịch đảo là $\sigma_{g^{-1}}$). $\rho$ là đồng cấu: $\sigma_{gh}(x) = (gh)\cdot x = g\cdot(h\cdot x) = \sigma_g(\sigma_h(x))$. $\blacksquare$

> [!example] Example 7.3 — Các ví dụ action cơ bản
> **Tác động tầm thường**: $g \cdot x = x$ với mọi $g,x$. Kernel = $G$.
>
> **Tác động liên hợp**: $G \curvearrowright G$ bởi $g \cdot x = gxg^{-1}$. Kernel = $Z(G)$.
>
> **Coset action**: $G \curvearrowright G/H$ bởi $g \cdot (aH) = (ga)H$. Kernel = $\bigcap_{x \in G} xHx^{-1}$.
>
> **Nhân bên trái (Cayley)**: $G \curvearrowright G$ bởi $g \cdot x = gx$. Kernel = $\{e\}$ — đây chính là chứng minh định lý Cayley!

---

## Orbit và Stabilizer

> [!definition] Definition 7.4 — Orbit và Stabilizer
> Cho $G \curvearrowright X$ và $x \in X$.
>
> - **Orbit** của $x$:
>
> $$
> \mathcal{O}_x = G \cdot x = \left\{ g \cdot x : g \in G \right\} \subseteq X
> $$
>
> - **Stabilizer** (hay **isotropy subgroup**) của $x$:
>
> $$
> G_x = \operatorname{Stab}_G(x) = \left\{ g \in G : g \cdot x = x \right\} \leq G
> $$
>
> Action gọi là **transitive** nếu chỉ có một orbit, tức $G \cdot x = X$ với mọi $x$.
>
> [!abstract] Theorem 7.5 — Stabilizer là nhóm con
> $G_x \leq G$ với mọi $x \in X$.

**Proof.**
$G_x \neq \emptyset$ (chứa $e$). Nếu $g, h \in G_x$: $(gh^{-1}) \cdot x = g \cdot (h^{-1} \cdot x) = g \cdot x = x$. Vậy $gh^{-1} \in G_x$. $\blacksquare$

> [!abstract] Theorem 7.6 — Định lý Orbit-Stabilizer (Orbit-Stabilizer Theorem)
> Cho $G \curvearrowright X$ hữu hạn và $x \in X$. Khi đó:
>
> $$
> |\mathcal{O}_x| = [G : G_x] = \frac{|G|}{|G_x|}
> $$

**Proof.**
Xây dựng song ánh $f : G/G_x \to \mathcal{O}_x$, $gG_x \mapsto g \cdot x$.

**Well-defined**: $gG_x = hG_x \Rightarrow h^{-1}g \in G_x \Rightarrow (h^{-1}g)\cdot x = x \Rightarrow g\cdot x = h\cdot x$.

**Injective**: Nếu $g\cdot x = h\cdot x$ thì $h^{-1}g \in G_x$, nên $gG_x = hG_x$.

**Surjective**: Mọi $g\cdot x$ là ảnh của $gG_x$.

Vậy $|\mathcal{O}_x| = |G/G_x| = [G:G_x]$. $\blacksquare$

> [!example] Example 7.7 — Orbit-Stabilizer cho $S_4$ tác động lên cạnh
> $S_4$ tác động lên tập 6 cạnh của đồ thị đầy đủ $K_4$ (4 đỉnh). Xét cạnh $e_{12}$ nối đỉnh 1 và 2.
>
> $\operatorname{Stab}(e_{12}) = \left\{ \sigma \in S_4 : \sigma(\{1,2\}) = \{1,2\} \right\} = \left\{e, (12), (34), (12)(34)\right\}$, bậc $4$.
>
> Orbit của $e_{12}$: mọi cạnh của $K_4$ đều liên kết nhau, nên $|\mathcal{O}_{e_{12}}| = 6$.
>
> Kiểm tra: $[S_4 : \operatorname{Stab}(e_{12})] = 24/4 = 6$. ✓

---

## Phân hoạch thành orbit

> [!abstract] Theorem 7.8 — Các orbit phân hoạch $X$
> Các orbit của action $G \curvearrowright X$ tạo thành phân hoạch của $X$:
>
> $$
> X = \bigsqcup_{i} \mathcal{O}_{x_i}
> $$
>
> trong đó $\{x_i\}$ là tập đại diện của các orbit phân biệt.
>
> Vậy: $|X| = \sum_{i} |\mathcal{O}_{x_i}| = \sum_{i} [G : G_{x_i}]$.

---

## Phương trình lớp (Class Equation)

Áp dụng tác động liên hợp $G \curvearrowright G$ bởi $g \cdot x = gxg^{-1}$:

- Orbit của $x$: **lớp liên hợp** (conjugacy class) $C_G(x) = \left\{gxg^{-1} : g \in G\right\}$.
- Stabilizer của $x$: **centralizer** $C_G(x) = Z_G(x) = \left\{g \in G : gx = xg\right\}$.

> [!note] Remark 7.9 — Ký hiệu centralizer
> Dummit–Foote dùng $C_G(x)$ cho centralizer và $\operatorname{cl}(x)$ cho conjugacy class của $x$. Để tránh nhầm lẫn, ta ký hiệu: centralizer là $C_G(x)$, conjugacy class là $\operatorname{cl}(x)$.
>
> Orbit-Stabilizer cho: $|\operatorname{cl}(x)| = [G : C_G(x)]$.
>
> [!abstract] Theorem 7.10 — Phương trình lớp (Class Equation)
> Cho $G$ là nhóm hữu hạn. Chọn đại diện $x_1, \ldots, x_r$ từ các lớp liên hợp không tầm thường (tức $|\operatorname{cl}(x_i)| > 1$). Khi đó:
>
> $$
> |G| = |Z(G)| + \sum_{i=1}^{r} [G : C_G(x_i)]
> $$

**Proof.**
Phân hoạch $G$ thành các lớp liên hợp. Lớp liên hợp của $z \in Z(G)$ là $\{z\}$ (singleton). Gom tất cả singleton lại được $|Z(G)|$. Các lớp còn lại đóng góp $\sum_i [G:C_G(x_i)]$. $\blacksquare$

> [!abstract] Corollary 7.11 — $p$-nhóm có tâm không tầm thường
> Nếu $|G| = p^n$ với $p$ nguyên tố và $n \geq 1$, thì $Z(G) \neq \{e\}$.

**Proof.**
Từ phương trình lớp: $p^n = |Z(G)| + \sum_i [G : C_G(x_i)]$. Mỗi số hạng trong tổng chia hết cho $p$ (vì $[G:C_G(x_i)] > 1$ chia $|G| = p^n$). Vậy $|Z(G)| \equiv 0 \pmod{p}$. Vì $e \in Z(G)$, ta có $|Z(G)| \geq 1$, nên $|Z(G)| \geq p > 1$. $\blacksquare$

> [!abstract] Corollary 7.12 — Nhóm bậc $p^2$ là Abel
> Nếu $|G| = p^2$ thì $G \cong \mathbb{Z}_{p^2}$ hoặc $G \cong \mathbb{Z}_p \times \mathbb{Z}_p$. Đặc biệt, $G$ luôn Abel.

**Proof.**
Theo Corollary 7.11: $|Z(G)| \in \{p, p^2\}$. Nếu $|Z(G)| = p^2$ thì $G = Z(G)$ là Abel. Nếu $|Z(G)| = p$: $G/Z(G)$ có bậc $p$, nên cyclic. Nhưng nếu $G/Z(G)$ cyclic thì $G$ Abel (xem Theorem 7.13), mâu thuẫn $|Z(G)| = p < p^2$. Vậy $|Z(G)| = p^2$ và $G$ Abel. $\blacksquare$

> [!abstract] Theorem 7.13 — $G/Z(G)$ cyclic suy ra $G$ Abel
> Nếu $G/Z(G)$ cyclic thì $G$ là Abel.

**Proof.**
Đặt $Z = Z(G)$ và $G/Z = \langle gZ \rangle$. Mỗi phần tử của $G$ có dạng $g^k z$ với $z \in Z$. Với $g^{k_1}z_1, g^{k_2}z_2 \in G$:
$(g^{k_1}z_1)(g^{k_2}z_2) = g^{k_1+k_2}z_1 z_2 = (g^{k_2}z_2)(g^{k_1}z_1)$. Vậy $G$ Abel. $\blacksquare$

---

## Bổ đề Burnside

> [!abstract] Theorem 7.14 — Bổ đề Burnside (Burnside's Lemma)
> Cho $G \curvearrowright X$ (hữu hạn). Số orbit của action bằng số trung bình các điểm cố định:
>
> $$
> |\text{số orbit}| = \frac{1}{|G|} \sum_{g \in G} |X^g|
> $$
>
> trong đó $X^g = \left\{x \in X : g \cdot x = x\right\}$ là tập điểm cố định của $g$.

**Proof.**
Đếm các cặp $(g, x)$ với $g \cdot x = x$:

$$
\sum_{g \in G}|X^g| = |\{(g,x) : g\cdot x = x\}| = \sum_{x \in X}|G_x|
$$

Với mỗi orbit $\mathcal{O}$, chọn đại diện $x_0$. Theo Orbit-Stabilizer: $\sum_{x \in \mathcal{O}} |G_x| = |\mathcal{O}| \cdot |G_{x_0}| = [G:G_{x_0}] \cdot |G_{x_0}| = |G|$.

Tổng qua tất cả orbit: $\sum_{x \in X}|G_x| = |G| \cdot |\text{số orbit}|$. Chia cho $|G|$ ta được kết quả. $\blacksquare$

> [!example] Example 7.15 — Đếm vòng cổ tay với Burnside
> Cần đếm số vòng cổ tay phân biệt gồm 4 hạt, mỗi hạt có thể tô bằng 3 màu. Vòng cổ tay được coi là giống nhau nếu có thể xoay hoặc lật để chồng lên nhau. Nhóm đối xứng là nhóm dihedral $D_8$ (gồm 4 phép quay và 4 phép phản xạ), tác động lên $X = 3^4 = 81$ tô màu.
>
> Tính $|X^g|$ cho từng phần tử $g \in D_8$:
>
> | Loại $g$ | Số phần tử | $|X^g|$ | Đóng góp |
> |----------|-----------|---------|---------|
> | $e$ (đồng nhất) | $1$ | $3^4 = 81$ | $81$ |
> | Quay $90°, 270°$ | $2$ | $3^1 = 3$ | $6$ |
> | Quay $180°$ | $1$ | $3^2 = 9$ | $9$ |
> | Phản xạ qua cạnh | $2$ | $3^2 = 9$ | $18$ |
> | Phản xạ qua đỉnh | $2$ | $3^3 = 27$ | $54$ |
>
> Tổng: $81 + 6 + 9 + 18 + 54 = 168$.
>
> Số vòng cổ tay phân biệt $= 168/8 = 21$.

---

## Tác động liên hợp lên nhóm con

> [!definition] Definition 7.16 — Normalizer
> Cho $H \leq G$. **Normalizer** của $H$ trong $G$:
>
> $$
> N_G(H) = \left\{ g \in G : gHg^{-1} = H \right\}
> $$
>
> Đây là nhóm con lớn nhất của $G$ mà $H$ chuẩn tắc trong đó: $H \trianglelefteq N_G(H) \leq G$.
>
> [!abstract] Theorem 7.17 — Đếm liên hợp nhóm con
> Số nhóm con liên hợp với $H$ trong $G$ (tức số phần tử trong orbit của $H$ dưới tác động liên hợp) bằng $[G : N_G(H)]$.

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(4)
X = [1, 2, 3, 4]
g = G([(1,2,3)])
[g(x) for x in X]

G = CyclicPermutationGroup(6)
x = 1
orbit = G.orbit(x)
stabilizer = G.stabilizer(x)
len(orbit) * stabilizer.order() == G.order()

G = DihedralGroup(4)
G.conjugacy_classes()

G = SymmetricGroup(4)
g = G([(1,2)])
centralizer = G.centralizer(g)
[G.order() // centralizer.order()]

G = DihedralGroup(4)
G.center().order()
```

---

## Summary / Key Takeaways

- Group action $G \curvearrowright X$: hai tiên đề — đơn vị và tương thích với phép nhân nhóm.
- Mỗi action tương đương với đồng cấu $G \to \operatorname{Sym}(X)$ (permutation representation).
- **Orbit-Stabilizer**: $|\mathcal{O}_x| = [G : G_x]$ — kết quả tính toán cơ bản nhất.
- Các orbit phân hoạch $X$; $|X| = \sum_i [G : G_{x_i}]$.
- **Phương trình lớp**: $|G| = |Z(G)| + \sum_i [G:C_G(x_i)]$ — công cụ tối quan trọng cho $p$-nhóm.
- **$p$-nhóm**: nếu $|G| = p^n$ thì $Z(G) \neq \{e\}$; nếu $|G| = p^2$ thì $G$ Abel.
- **Burnside**: số orbit $= \frac{1}{|G|}\sum_{g}|X^g|$ — đếm tổ hợp với đối xứng.
- **Normalizer** $N_G(H)$: nhóm con lớn nhất của $G$ chứa $H$ như nhóm con chuẩn tắc.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 4.
- Hungerford, T. W. *Algebra*, Chapter II.
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §5.
- Milne, J. S. *Group Theory* (v4.00), Chapter 4. https://www.jmilne.org/math/CourseNotes/GT.pdf
