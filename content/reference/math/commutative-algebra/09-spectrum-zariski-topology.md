---
title: "09. Spectrum and Zariski Topology"
tags: [math, commutative-algebra, lesson-09]
aliases: [Spectrum and Zariski Topology]
created: 2026-03-30
---

> **Prerequisites**: [[04-localization|04. Localization]], [[08-noether-normalization-nullstellensatz|08. Noether Normalization and Nullstellensatz]]
> **Objectives**:
> - Xây dựng $\operatorname{Spec}(R)$ như một không gian topo với Zariski topology
> - Hiểu các tính chất topo của $\operatorname{Spec}(R)$: quasi-compact, $T_0$, irreducible
> - Nắm cấu trúc sheaf $\mathcal{O}$ trên $\operatorname{Spec}(R)$ (giới thiệu)
> - Tính được $\operatorname{Spec}$ cho các vành cụ thể

---

## Motivation / Intuition

Ở Bài 08, Nullstellensatz thiết lập tương ứng giữa tập đại số trong $\mathbb{A}^n_k$ và radical ideals của $k[x_1,\ldots,x_n]$. Nhưng tại sao phải dùng maximal ideals thay vì tất cả prime ideals?

Câu trả lời của Grothendieck: **nên dùng tất cả prime ideals**, và xây dựng không gian topo $\operatorname{Spec}(R)$ trực tiếp từ chúng. Điều này cho phép:

1. Làm việc với vành bất kỳ (không cần $k$ đại số đóng).
2. Các prime ideals không cực đại tương ứng với "điểm tổng quát" (generic points) — ví dụ, điểm tổng quát của một đường cong là prime ideal tương ứng đường cong đó.
3. Nền tảng cho lý thuyết scheme (Grothendieck 1960), thống nhất số học và hình học.

Zariski topology trên $\operatorname{Spec}(R)$ rất "thô" (coarse): tập đóng được sinh bởi các đa thức, và tập mở cơ bản là $D(f) = \{\mathfrak{p} : f \notin \mathfrak{p}\}$ — "nơi $f$ không bằng 0". Topology này phản ánh cấu trúc đại số của $R$ một cách hoàn hảo.

---

## Không gian $\operatorname{Spec}(R)$

### Definition

> [!info] Definition 9.1 — Zariski Topology trên $\operatorname{Spec}(R)$
>
> Cho $R$ là vành. **Spectrum** $\operatorname{Spec}(R)$ là tập các prime ideals của $R$. Với mỗi ideal $\mathfrak{a} \subseteq R$, định nghĩa:
>
> $$
> V(\mathfrak{a}) = \{\mathfrak{p} \in \operatorname{Spec}(R) : \mathfrak{p} \supseteq \mathfrak{a}\}
> $$
>
> Họ $\{V(\mathfrak{a}) : \mathfrak{a} \text{ ideal của } R\}$ là các **tập đóng** của **Zariski topology** trên $\operatorname{Spec}(R)$.

> [!abstract] Theorem 9.2 — Zariski topology là topo hợp lệ
>
> Các tập $V(\mathfrak{a})$ thỏa các tiên đề topo (tập đóng):
>
> 1. $V(0) = \operatorname{Spec}(R)$ và $V(R) = \emptyset$.
> 2. $V(\mathfrak{a}) \cup V(\mathfrak{b}) = V(\mathfrak{a} \cap \mathfrak{b}) = V(\mathfrak{a}\mathfrak{b})$.
> 3. $\bigcap_i V(\mathfrak{a}_i) = V\!\left(\sum_i \mathfrak{a}_i\right)$.

**Proof.**

(1): $\mathfrak{p} \supseteq 0$ luôn đúng; $\mathfrak{p} \supseteq R$ không bao giờ đúng vì $\mathfrak{p}$ proper.

(2): $\mathfrak{p} \supseteq \mathfrak{a}\mathfrak{b}$ $\iff$ $\mathfrak{p} \supseteq \mathfrak{a}$ hoặc $\mathfrak{p} \supseteq \mathfrak{b}$ (vì $\mathfrak{p}$ prime). Và $\mathfrak{a} \cap \mathfrak{b} \supseteq \mathfrak{a}\mathfrak{b}$, còn $\mathfrak{p} \supseteq \mathfrak{a} \cap \mathfrak{b}$ kéo theo $\mathfrak{p} \supseteq \mathfrak{a}$ hoặc $\mathfrak{p} \supseteq \mathfrak{b}$ (nếu không, lấy $a \in \mathfrak{a}\setminus\mathfrak{p}$, $b \in \mathfrak{b}\setminus\mathfrak{p}$, thì $ab \in \mathfrak{a}\cap\mathfrak{b} \subseteq \mathfrak{p}$ mâu thuẫn).

(3): $\mathfrak{p} \supseteq \sum_i \mathfrak{a}_i$ $\iff$ $\mathfrak{p} \supseteq \mathfrak{a}_i$ với mọi $i$. $\blacksquare$

### Definition

> [!info] Definition 9.3 — Distinguished Open Sets
>
> Với $f \in R$, **tập mở cơ bản** (distinguished open set):
>
> $$
> D(f) = \operatorname{Spec}(R) \setminus V(f) = \{\mathfrak{p} \in \operatorname{Spec}(R) : f \notin \mathfrak{p}\}
> $$
>
> Các tập $D(f)$ tạo thành một **cơ sở** (basis) của Zariski topology. Hơn nữa, $D(f) \cong \operatorname{Spec}(R_f)$ như không gian topo (vì prime ideals của $R_f$ tương ứng prime ideals của $R$ không chứa $f$).

---

## Tính chất topo của $\operatorname{Spec}(R)$

### Theorem

> [!abstract] Theorem 9.4 — $\operatorname{Spec}(R)$ là quasi-compact $T_0$
>
> 1. **$T_0$**: Với hai điểm phân biệt $\mathfrak{p} \neq \mathfrak{q}$ trong $\operatorname{Spec}(R)$, tồn tại tập mở chứa đúng một trong hai điểm đó.
> 2. **Quasi-compact** (compact không Hausdorff): Mọi phủ mở của $\operatorname{Spec}(R)$ đều có phủ con hữu hạn.
> 3. **Không $T_1$** nói chung: Tập $\{\mathfrak{p}\}$ đóng $\iff$ $\mathfrak{p}$ là maximal ideal.

**Proof của (2).** Đủ kiểm tra với phủ bởi các $D(f_i)$. Nếu $\bigcup_i D(f_i) = \operatorname{Spec}(R)$, thì $\bigcap_i V(f_i) = V(\sum_i (f_i)) = \emptyset$, tức $(f_i)_{i \in I} = R$. Vậy $1 = \sum_{j=1}^n r_j f_{i_j}$ với hữu hạn $j$, tức $(f_{i_1}, \ldots, f_{i_n}) = R$, tức $\bigcup_{j=1}^n D(f_{i_j}) = \operatorname{Spec}(R)$.

**Proof của (3).** $\overline{\{\mathfrak{p}\}} = V(\mathfrak{p})$ (bao đóng của điểm $\mathfrak{p}$). Thì $\{\mathfrak{p}\}$ đóng $\iff$ $V(\mathfrak{p}) = \{\mathfrak{p}\}$ $\iff$ $\mathfrak{p}$ không nằm trong prime nào lớn hơn $\iff$ $\mathfrak{p}$ maximal. $\blacksquare$

### Definition

> [!info] Definition 9.5 — Điểm tổng quát (Generic Point)
>
> Điểm $\mathfrak{p} \in \operatorname{Spec}(R)$ gọi là **generic point** của tập đóng bất khả quy $Z = V(\mathfrak{p})$ nếu $\overline{\{\mathfrak{p}\}} = Z$.
>
> Trong $\operatorname{Spec}(\mathbb{Z})$: điểm $(0)$ là generic point của toàn bộ $\operatorname{Spec}(\mathbb{Z})$ (vì $V(0) = \operatorname{Spec}(\mathbb{Z})$). Còn $(p)$ với $p$ nguyên tố là các điểm đóng (maximal ideals).

### Theorem

> [!abstract] Theorem 9.6 — Thành phần bất khả quy
>
> $\operatorname{Spec}(R)$ là **irreducible** (không thể viết là hợp hai tập đóng proper) $\iff$ $\operatorname{Nil}(R)$ là prime ideal (tức $R/\operatorname{Nil}(R)$ là miền nguyên).
>
> Tổng quát, các **thành phần bất khả quy** (irreducible components) của $\operatorname{Spec}(R)$ tương ứng 1-1 với các prime ideals cực tiểu của $R$.

**Proof.** $\operatorname{Spec}(R)$ irreducible $\iff$ $V(\mathfrak{a}) \cup V(\mathfrak{b}) = \operatorname{Spec}(R)$ $\Rightarrow$ $V(\mathfrak{a}) = \operatorname{Spec}(R)$ hoặc $V(\mathfrak{b}) = \operatorname{Spec}(R)$ $\iff$ $\mathfrak{a}\mathfrak{b} \subseteq \operatorname{Nil}(R)$ $\Rightarrow$ $\mathfrak{a} \subseteq \operatorname{Nil}(R)$ hoặc $\mathfrak{b} \subseteq \operatorname{Nil}(R)$ $\iff$ $\operatorname{Nil}(R)$ prime. $\blacksquare$

---

## Ví dụ tính toán $\operatorname{Spec}$

### Worked Example

> [!example] Example 9.7 — Các $\operatorname{Spec}$ cổ điển
>
> **$\operatorname{Spec}(\mathbb{Z})$:** Gồm $(0)$ và $(p)$ với $p$ nguyên tố. Tập đóng hữu hạn (ngoài toàn bộ) gồm hữu hạn điểm $(p_i)$. Topo: toàn bộ không gian và các tập hữu hạn điểm đóng. Trực giác: "đường thẳng số học".
>
> **$\operatorname{Spec}(k[x])$ ($k$ đại số đóng):** Gồm $(0)$ (generic point) và $(x - a)$ với $a \in k$ (điểm đóng). Homeomorphic với $\mathbb{A}^1_k$ thêm generic point.
>
> **$\operatorname{Spec}(k[x,y])$ ($k$ đại số đóng):** Ba loại điểm:
> - $(0)$: generic point của toàn bộ mặt phẳng.
> - $(f)$ với $f$ bất khả quy: generic point của đường cong $V(f)$.
> - $(x-a, y-b)$: các điểm đóng (điểm thực sự trong $\mathbb{A}^2_k$).
>
> **$\operatorname{Spec}(\mathbb{Z}/12\mathbb{Z})$:** Prime ideals là $(2)$ và $(3)$ (cả hai đều maximal). $\operatorname{Spec} = \{(2), (3)\}$ — hai điểm đóng, rời rạc.
>
> **$\operatorname{Spec}(k)$ ($k$ trường):** Chỉ có $(0)$. Một điểm duy nhất.
>
> **$\operatorname{Spec}(k[[x]])$ ($k$ trường):** Hai điểm: $(0)$ (generic) và $(x)$ (maximal, điểm đóng). "Đường thẳng địa phương" — DVR.

### Worked Example

> [!example] Example 9.8 — Ring homomorphism và Spec
>
> Mọi ring homomorphism $f: R \to S$ cảm sinh ánh xạ liên tục:
>
> $$
> f^*: \operatorname{Spec}(S) \to \operatorname{Spec}(R), \quad \mathfrak{q} \mapsto f^{-1}(\mathfrak{q})
> $$
>
> **Ví dụ:** $f: \mathbb{Z} \to \mathbb{Z}/p\mathbb{Z}$. Thì $f^*: \operatorname{Spec}(\mathbb{F}_p) = \{(0)\} \to \operatorname{Spec}(\mathbb{Z})$ gửi $(0) \mapsto f^{-1}(0) = p\mathbb{Z} = (p)$.
>
> **Ví dụ:** $f: R \to S^{-1}R$ (localization). $f^*: \operatorname{Spec}(S^{-1}R) \hookrightarrow \operatorname{Spec}(R)$ là embedding homeomorphic lên $\{\mathfrak{p} : \mathfrak{p} \cap S = \emptyset\}$ (Theorem 4.8).

---

## Jacobson Rings

### Definition

> [!info] Definition 9.9 — Jacobson Ring
>
> Vành $R$ gọi là **Jacobson ring** nếu mọi prime ideal của $R$ đều là giao của các maximal ideals chứa nó:
>
> $$
> \forall\, \mathfrak{p} \in \operatorname{Spec}(R):\quad \mathfrak{p} = \bigcap_{\mathfrak{m} \supseteq \mathfrak{p},\, \mathfrak{m} \in \operatorname{Max}(R)} \mathfrak{m}
> $$
>
> Tương đương: mọi radical ideal đều là giao của maximal ideals.

> [!abstract] Theorem 9.10 — Các Jacobson rings quan trọng
>
> 1. $\mathbb{Z}$ là Jacobson ring.
> 2. Mọi trường $k$ là Jacobson ring.
> 3. Mọi $k$-algebra hữu hạn sinh (với $k$ trường) là Jacobson ring.
> 4. Quotient và localization của Jacobson ring là Jacobson.

**Proof của (3).** Đây là hệ quả của Nullstellensatz: với $\mathfrak{p}$ prime trong $A = k[x_1,\ldots,x_n]/I$, ta cần $\mathfrak{p} = \bigcap_{\mathfrak{m} \supseteq \mathfrak{p}} \mathfrak{m}$. Tương đương: $f \notin \mathfrak{p}$ $\Rightarrow$ tồn tại maximal ideal $\mathfrak{m}$ với $\mathfrak{p} \subseteq \mathfrak{m}$ và $f \notin \mathfrak{m}$. Điều này đúng theo Nullstellensatz áp dụng cho $A/\mathfrak{p}$: $f \neq 0$ trong $A/\mathfrak{p}$ $\Rightarrow$ tồn tại điểm trong $V(\mathfrak{p})$ mà $f \neq 0$ $\Rightarrow$ maximal ideal $\mathfrak{m}$ với $\mathfrak{p} \subseteq \mathfrak{m}$, $f \notin \mathfrak{m}$. $\blacksquare$

---

## SageMath Cheatsheet

```sage
R.<x,y> = QQ[]

# Spec qua primary decomposition và primes
I = R.ideal(x^2 - y, y^2 - x)
I.primary_decomposition()
I.radical().associated_primes()

# Distinguished open sets (qua localization)
Rx = R.localization(x)
Rx.spec()   # Spec(R_x) ~ D(x) in Spec(R)

# Ring map và Spec
R1 = ZZ
R2 = ZZ.quotient(12)
f = R1.hom([R2(1)])  # Z -> Z/12Z
# f^* gửi primes của Z/12Z về primes của Z

# Kiểm tra irreducible
R3 = ZZ['x']
I3 = R3.ideal(x^2 + 1)
R3.quotient(I3).is_integral_domain()  # True => V(I3) irreducible

# Jacobson ring
R4 = QQ['x,y']
R4.is_noetherian()   # True (finite-type k-algebra là Jacobson)
```

---

## Summary / Key Takeaways

- **Zariski topology**: tập đóng là $V(\mathfrak{a})$; tập mở cơ bản là $D(f) \cong \operatorname{Spec}(R_f)$.
- $\operatorname{Spec}(R)$ là $T_0$ và quasi-compact nhưng thường không $T_2$ (Hausdorff).
- $\overline{\{\mathfrak{p}\}} = V(\mathfrak{p})$: điểm $\mathfrak{p}$ đóng $\iff$ $\mathfrak{p}$ maximal.
- **Generic point**: $\mathfrak{p}$ là generic point của thành phần bất khả quy $V(\mathfrak{p})$.
- Thành phần bất khả quy $\leftrightarrow$ prime ideals cực tiểu.
- Ring homomorphism $f: R \to S$ cảm sinh ánh xạ liên tục $f^*: \operatorname{Spec}(S) \to \operatorname{Spec}(R)$.
- **Jacobson ring**: prime ideal = giao maximal ideals; các $k$-algebras hữu hạn sinh là Jacobson.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 1 & §5.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 4 & §13.
- Hartshorne, R. *Algebraic Geometry*, §II.2 (schemes and Spec).
- Görtz, U. & Wedhorn, T. *Algebraic Geometry I*, Chapter 2.
