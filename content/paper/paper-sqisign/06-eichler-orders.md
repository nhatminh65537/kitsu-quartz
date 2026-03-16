---
title: "06. Eichler Orders & Extended Deuring Correspondence"
type: math-component
tags: [sqisign, eichler-orders, deuring-correspondence, class-set, math-component, lesson-06]
aliases: [Eichler Orders, Extended Deuring, ClO, Pushforward Ideals]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: [[02-quaternion-algebras\|02. Quaternion Algebras, Orders & Ideals]], [[03-deuring-correspondence\|03. The Deuring Correspondence]]  
> 🔴 **Prerequisite references**: Voight — *Quaternion Algebras* [Voi21] (Eichler orders, class numbers); Eichler [Eic38] (class number formula)  
> **Lesson type**: Math Component  
> **Covers**: §4 đầy đủ — Definition 1, Propositions 1–6, Lemma 3, Remark 2, Table 1 (new rows), Corollary 1; là nền tảng toán học cho Generalized KLPT và SigningKLPT
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ | Eichler order (giao của hai maximal orders) |
> | $N_\tau = \text{n}(I_\tau)$ | Norm của ideal $I_\tau$ (secret key) |
> | $\mathcal{O} = \mathcal{O}_A$ | Arbitrary maximal order ($\cong \text{End}(E_A)$) |
> | $I_N(\mathcal{O}_0)$ | Tập integral left $\mathcal{O}_0$-ideals norm $N$ với right order $\sim \mathcal{O}$ |
> | $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ | Tập equivalence classes trong $I_N(\mathcal{O}_0)$ dưới $\sim_\mathcal{O}$ |
> | $J \sim_\mathcal{O} K$ | Equivalent relative to $\mathcal{O}$: $\exists\, \beta \in \mathcal{O}$ s.t. $K = \chi_J(\beta)$ |
> | $[I_\tau]_* J$ | Pushforward của $J$ dọc $I_\tau$ |
> | $C \in \text{Cl}(\mathcal{O}_0)$ | Equivalence class trong ideal class set của $\mathcal{O}_0$ |
> | $\mathcal{O}_C = \mathcal{O}_R(L)$ | Right order của một representative $L \in C$ |

---

## Motivation

Sau Section 3.3 (Lesson 05), ta biết KLPT classic không áp dụng được an toàn cho arbitrary maximal orders. Section 4 xây dựng **nền tảng toán học** để giải quyết vấn đề này: lý thuyết Eichler orders và cách chúng xuất hiện dưới Deuring correspondence.

Có hai lý do Eichler orders quan trọng trong SQISign:

1. **Lý do cấu trúc**: Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ là suborder của $\mathcal{O}_0$ — cho phép áp dụng kỹ thuật KLPT (vốn chỉ dùng được với $\mathcal{O}_0$) vào ideals của $\mathcal{O}$ tùy ý.

2. **Lý do cryptographic**: Class set $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ của Eichler orders correspond bijection với $N$-isogenies dưới Deuring — đây là object mà SigningKLPT output, và phân phối của nó là cơ sở cho ZK proof.

> [!info] 🟡 Folklore về Eichler orders (theo [Voi21, Remark 42.3.10], Remark 2 trong paper)
> [Voight 2021, Remark 42.3.10] phát biểu rằng Eichler orders có thể xem như endomorphism rings của đường cong elliptic cùng một subgroup cho trước — nhưng không có proof hoặc reference. Paper SQISign §4 **chứng minh đầy đủ** điều này (Proposition 3 và 6), cùng với các tính chất trung gian cần thiết cho thiết kế thuật toán.

---

## Eichler Order: Định nghĩa và Cấu trúc Cơ bản

> [!note] Định nghĩa 6.1 — Eichler Order
> Cho hai maximal orders $\mathcal{O}_0$ và $\mathcal{O}$ trong $B_{p,\infty}$ kết nối bởi ideal $I_\tau$ norm $N_\tau$ (với $I_\tau \nmid N_\tau \mathcal{O}_L(I_\tau)$, tức là $I_\tau$ không chia hết tầm thường), **Eichler order** là:
>
> $$
> \mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}
> $$
>
> **Level** của $\mathfrak{O}$: $N_\tau = [\mathcal{O}_0 : \mathfrak{O}] = [\mathcal{O} : \mathfrak{O}]$ (index trong cả hai maximal orders).

Eichler orders đã được nghiên cứu rộng rãi trong lý thuyết quaternion algebras [Eichler 1938, Voight 2021]. Điều mới mẻ của §4 là **interpret** chúng qua Deuring correspondence trong bối cảnh cryptographic.

> [!abstract] Proposition 6.2 — Phân tích $\mathfrak{O} = \mathbb{Z} + I_\tau$ (Proposition 1 trong paper)
> Với Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ level $N_\tau$:
>
> $$
> \mathfrak{O} = \mathbb{Z} + I_\tau
> $$
>
> nghĩa là mọi phần tử $\alpha \in \mathfrak{O}$ viết được dưới dạng $n + \beta$ với $n \in \mathbb{Z}$ và $\beta \in I_\tau$.

**Proof sketch.** Inclusion $\mathbb{Z} + I_\tau \subseteq \mathfrak{O}$: $\mathbb{Z} \subset \mathcal{O}_0 \cap \mathcal{O}$ (integers nằm trong mọi order) và $I_\tau \subset \mathcal{O}_0$ (integral left $\mathcal{O}_0$-ideal), $I_\tau \subset \mathcal{O}$ (integral right $\mathcal{O}$-ideal). Equality: so sánh discriminants — $[\mathcal{O}_0 : \mathbb{Z} + I_\tau] = N_\tau = [\mathcal{O}_0 : \mathfrak{O}]$. $\blacksquare$

> [!tip] 💡 Agent note — Tại sao phân tích $\mathbb{Z} + I_\tau$ quan trọng
> Phân tích $\mathfrak{O} = \mathbb{Z} + I_\tau$ là **key insight** cho Generalized KLPT: khi tìm $\beta \in I \cap \mathfrak{O}$, điều kiện $\beta \in \mathfrak{O} = \mathbb{Z} + I_\tau$ được encode bởi một **modular constraint mod $I_\tau$**. Đây là lý do EichlerModConstraint (Lesson 08) tồn tại — nó solve constraint này tương tự như IdealModConstraint solve constraint từ $I$.

---

## Level Structure và Class Set $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$

> [!note] Định nghĩa 6.3 — Ideal norm $N$ với right order trong class $C$ (Definition 1)
> Với $N$ nguyên và $C \in \text{Cl}(\mathcal{O}_0)$ (equivalence class của maximal orders), định nghĩa:
>
> $$
> I_N(\mathcal{O}_0) = \{I \text{ integral left } \mathcal{O}_0\text{-ideal} : \text{n}(I) = N,\; \mathcal{O}_R(I) \in C\}
> $$
>
> Hai ideals $J, K \in I_N(\mathcal{O}_0)$ gọi là **$\mathcal{O}$-equivalent** (ký hiệu $J \sim_\mathcal{O} K$) nếu $\exists\, \beta \in \mathcal{O}$ sao cho $K = \chi_J(\beta)$ (nhân bởi $\beta$ từ phải trong $\mathcal{O}$).
>
> **Class set**: $\text{Cl}_\mathcal{O}(\mathcal{O}_0) = I_N(\mathcal{O}_0) / \sim_\mathcal{O}$

> [!abstract] Lemma 6.4 — Map $\text{Cl}_\mathcal{O}(\mathcal{O}_0) \to \text{Cl}(\mathcal{O}_0)$ (Lemma 3 trong paper)
> Map tự nhiên $[I] \mapsto [I]$ (từ $\mathcal{O}$-equivalence sang thông thường equivalence) là **well-defined** và **injective**.
>
> **Proof.** Nếu $J \sim_\mathcal{O} K$ (tức là $K = \chi_J(\beta)$ với $\beta \in \mathcal{O}$), thì $K \sim J$ trong $\text{Cl}(\mathcal{O}_0)$ (vì $\beta \in B_{p,\infty}^*$). Injectivity: nếu $J \sim K$ trong $\text{Cl}(\mathcal{O}_0)$, tức là $K = \chi_J(\beta)$ với $\beta \in B_{p,\infty}^*$, thì $\beta \in \mathcal{O}_R(J) = \mathcal{O}$ (vì cùng right order), nên $J \sim_\mathcal{O} K$. $\blacksquare$

---

## Pushforward Ideals và Equivalence

> [!abstract] Proposition 6.5 — Pushforward và $\mathcal{O}$-equivalence (Proposition 3 trong paper)
> Với $J, K \in I_N(\mathcal{O}_0)$:
>
> $$
> J \sim_\mathcal{O} K \iff \exists\, \beta \in \mathcal{O} \text{ s.t. } K = \chi_J(\beta)
> $$
>
> Đặc biệt, nếu $I_\tau$ là ideal connecting $\mathcal{O}_0$ và $\mathcal{O}$ (với $\mathcal{O}_R(I_\tau) = \mathcal{O}$):
>
> $$
> [I_\tau]_* J \sim_\mathcal{O} [I_\tau]_* K \iff J \sim_\mathcal{O} K
> $$
>
> Pushforward **bảo toàn** $\mathcal{O}$-equivalence.

> [!abstract] Corollary 6.6 — Corollary 1 (quan trọng nhất của §4)
> Với $J \in I_N(\mathcal{O}_0)$ và $\beta \in I \cap \mathcal{O}$:
>
> $$
> [I_\tau]_*(\chi_I(\beta)) = \chi_{[I_\tau]_* I}(\beta)
> $$
>
> Nói cách khác: **pushforward commutes với map $\chi$** khi $\beta \in \mathcal{O}$.

Corollary này là **cầu nối kỹ thuật** quan trọng nhất của §4: nó cho phép Generalized KLPT tìm $\beta \in I \cap \mathcal{O}$ (thay vì chỉ $\beta \in I$ như KLPT classic), và đảm bảo pushforward của kết quả vẫn trong equivalence class đúng. Không có Corollary này, Generalized KLPT không đúng.

---

## Class Set $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ và Orbits

> [!abstract] Proposition 6.7 — Cấu trúc $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ (Proposition 4 trong paper)
> Với $C \in \text{Cl}(\mathcal{O}_0)$, chọn $L \in C$ và đặt $\mathcal{O}_C = \mathcal{O}_R(L)$. Khi đó:
>
> $$
> \text{Cl}_{\mathcal{O}_C}(\mathcal{O}_0) \cong \text{Cl}(\mathcal{O}_C)
> $$
>
> **Số lượng classes**: $|\text{Cl}_\mathcal{O}(\mathcal{O}_0)|$ xấp xỉ bằng class number $h(\mathcal{O})$ theo công thức Eichler.

> [!abstract] Proposition 6.8 — Bijectivity (Proposition 5 trong paper)
> Với $N_\tau$ prime và inert trong $R$, map từ $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ sang $\text{Cl}(\mathcal{O}_0) / \sim_\mathcal{O}$ là **bijection**.
>
> **Ngoại lệ** (Remark 13): Kết quả fail khi $\mathcal{O}_C$ chứa non-trivial automorphisms (phụ thuộc $p \pmod{12}$). Số exceptions tối đa là 2.

---

## Extended Deuring Correspondence

Section 4 đỉnh điểm là mở rộng Deuring correspondence sang Eichler orders — điều mà [Voi21, Remark 42.3.10] phát biểu như folklore nhưng không chứng minh:

> [!abstract] Proposition 6.9 — N-isogenies dưới Deuring (Proposition 6 trong paper, [this work])
> Bijection sau well-defined:
>
> $$
> \left\{\begin{array}{c} N\text{-isogenies } E_0 \to E_1 \\ \text{(up to isomorphism)} \end{array}\right\} \longleftrightarrow \text{Cl}_\mathcal{O}(\mathcal{O}_0)
> $$
>
> trong đó $\mathcal{O} = \text{End}(E_1)$ và $N = \text{n}(I_\tau)$.

**Proof sketch.** Map $\varphi \mapsto [I_\varphi]_{\mathcal{O}}$ (lấy kernel ideal rồi lấy $\mathcal{O}$-equivalence class) là well-defined theo Proposition 6.5. Injectivity: nếu $I_\varphi \sim_\mathcal{O} I_\psi$ thì $\varphi$ và $\psi$ define cùng isogeny (up to iso của $E_1$). Surjectivity: mọi $\mathcal{O}$-class của ideal norm $N$ với right order $\mathcal{O}_R \cong \mathcal{O}$ correspond một $N$-isogeny. $\blacksquare$

> [!abstract] Proposition 6.10 — Eichler order dưới Deuring (từ §4, [this work])
> Với $\varphi_N: E_0 \to E_1$ là $N$-isogeny, kernel ideal $I_N = I_{\varphi_N}$:
>
> $$
> \text{End}(E_1, E_1[\hat{N}]) \cong \mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}_1
> $$
>
> nghĩa là **Eichler order** $\mathfrak{O}$ là endomorphism ring của cặp $(E_1, \text{subgroup})$ — chính là Remark 42.3.10 trong [Voi21] được chứng minh đầy đủ lần đầu.

Điều này bổ sung hai hàng vào **Table 1** (bảng Deuring correspondence):

| Thế giới isogeny | Thế giới quaternion |
|-----------------|---------------------|
| $N$-isogenies $E_0 \to E_1$ (up to iso.) [**Prop. 6**] | $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ |
| Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}_1$ level $N$ [**Prop. 3**] | $\text{End}(E_1, E_1[N])$ |

---

## Ứng dụng cho Generalized KLPT

Kết hợp tất cả kết quả của §4, ta có recipe cho Generalized KLPT (Lesson 07):

**Mục tiêu**: Cho left $\mathcal{O}$-ideal $I$ (tương ứng isogeny từ $E_A$), tìm $J \sim I$ với $\text{n}(J) = \ell^e$.

**Strategy** (dùng Eichler orders):

1. Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ là suborder của $\mathcal{O}_0$ — có thể dùng kỹ thuật KLPT.
2. Pullback $[I_\tau]_* I$ về $\mathcal{O}_0$-ideal (dùng pushforward ngược chiều).
3. Tìm $\beta \in ([I_\tau]_* I) \cap \mathcal{O}$ — đây là norm equation trong intersection.
4. Pushforward kết quả back: theo Corollary 6.6, $[I_\tau]_*(\chi_I(\beta)) = \chi_{[I_\tau]_* I}(\beta)$ nên vẫn trong equivalence class đúng.

> [!warning] Constraint thêm so với KLPT classic
> Trong KLPT classic, tìm $\beta \in I$ (không có constraint thêm). Trong Generalized KLPT, tìm $\beta \in I \cap \mathfrak{O} = I \cap (\mathbb{Z} + I_\tau)$ — constraint thêm là $\beta \equiv n \pmod{I_\tau}$ cho một $n \in \mathbb{Z}$. EichlerModConstraint (Algorithm 6, Lesson 08) giải constraint này.

---

## Summary

- **Eichler order** $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$: intersection của hai maximal orders, level $N_\tau$; phân tích $\mathfrak{O} = \mathbb{Z} + I_\tau$ (Proposition 1).
- **Class set** $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$: equivalence classes của ideals norm $N_\tau$ — tinh tế hơn $\text{Cl}(\mathcal{O}_0)$ thông thường.
- **Corollary 1**: Pushforward commutes với $\chi$ khi $\beta \in \mathcal{O}$ — kỹ thuật then chốt cho Generalized KLPT.
- **Proposition 6** [this work]: $N$-isogenies $E_0 \to E_1$ (up to iso.) ↔ $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ — mở rộng Deuring sang N-isogenies.
- **Proposition 3** [this work]: Eichler order = endomorphism ring của $(E_1, \text{subgroup})$ — chứng minh folklore [Voi21].
- **Strategy cho KLPT**: Dùng $\mathfrak{O} = \mathbb{Z} + I_\tau$ để encode constraint; EichlerModConstraint giải constraint này (Lesson 08).

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §4
- [Voi21] Voight — *Quaternion Algebras*, Springer 2021, Remark 42.3.10 (🟡 — folklore statement được paper prove)
- [Eic38] Eichler — *Über die Idealklassenzahl hyperkomplexer Systeme* (🔴 Prerequisite — class number formula)
- [KLPT14] Kohel, Lauter, Petit, Tignol (🟡 — background KLPT, Lesson 04)
