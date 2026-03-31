---
title: "04. Localization"
tags: [math, commutative-algebra, lesson-04]
aliases: [Localization]
created: 2026-03-29
---

> **Prerequisites**: [[01-rings-ideals-homomorphisms|01. Rings, Ideals, and Homomorphisms]], [[02-modules|02. Modules]]
> **Objectives**:
> - Hiểu localization như một phép "thêm nghịch đảo" cho các phần tử của vành
> - Tính toán localization trong các tình huống cổ điển ($R_\mathfrak{p}$, $R_f$, $S^{-1}R$)
> - Nắm vững tính chất universal của localization và tương ứng ideal
> - Hiểu tại sao localization là flat và liên kết với $\operatorname{Spec}(R)$

---

## Motivation / Intuition

Localization xuất phát từ một câu hỏi tự nhiên trong lý thuyết số: từ $\mathbb{Z}$, ta có thể "thêm nghịch đảo" để được $\mathbb{Q}$. Nhưng tại sao phải thêm nghịch đảo của *tất cả* số nguyên $\neq 0$? Đôi khi ta chỉ muốn thêm nghịch đảo của một số phần tử cụ thể.

Ví dụ: **localization tại $p$-adic** $\mathbb{Z}_{(p)} = \{a/b \in \mathbb{Q} : p \nmid b\}$ — đây là vành nhận $\mathbb{Z}$ và thêm nghịch đảo của tất cả số nguyên không chia hết bởi $p$. Vành $\mathbb{Z}_{(p)}$ chỉ có một maximal ideal là $(p)$, và "nhìn thấy" số học tại nguyên tố $p$ tốt hơn $\mathbb{Z}$.

Trong hình học đại số, localization có ý nghĩa hình học rõ ràng: $\operatorname{Spec}(R)$ là "không gian" đại số gắn với $R$. Localization $R_\mathfrak{p}$ tương ứng với việc nhìn vào **một điểm** (một prime ideal $\mathfrak{p}$) của không gian đó. Localization $R_f$ tương ứng với việc giới hạn lên **tập mở** $D(f) = \{\mathfrak{p} : f \notin \mathfrak{p}\}$.

Localization là công cụ "địa phương hóa" mọi vấn đề: muốn chứng minh một tính chất toàn cục của $R$, ta có thể chứng minh nó tại mọi localization $R_\mathfrak{p}$, rồi "dán lại".

---

## Tập nhân và Localization của Vành

### Definition

> [!info] Definition 4.1 — Multiplicative Subset (Tập nhân)
>
> Một tập con $S \subseteq R$ gọi là **multiplicative subset** (tập nhân) nếu:
>
> 1. $1 \in S$
> 2. $s, t \in S \Rightarrow st \in S$
>
> **Các ví dụ điển hình:**
>
> | Tập nhân $S$ | Localization $S^{-1}R$ | Ý nghĩa |
> |-------------|----------------------|---------|
> | $R \setminus \mathfrak{p}$ ($\mathfrak{p}$ prime) | $R_\mathfrak{p}$ | Localization tại prime ideal |
> | $\{1, f, f^2, \ldots\}$ | $R_f = R[f^{-1}]$ | Localization tại phần tử $f$ |
> | $R \setminus \{0\}$ ($R$ miền nguyên) | $\operatorname{Frac}(R)$ | Trường phân thức |
> | $R^\times$ | $R$ | Không thay đổi gì |

### Definition

> [!info] Definition 4.2 — Localization của Vành
>
> Cho $S$ là tập nhân của $R$. **Localization** $S^{-1}R$ là vành các "phân thức" $r/s$ ($r \in R$, $s \in S$) với quan hệ tương đương:
>
> $$
> \frac{r}{s} \sim \frac{r'}{s'} \iff \exists\, u \in S:\; u(rs' - r's) = 0
> $$
>
> Phép toán:
>
> $$
> \frac{r}{s} + \frac{r'}{s'} = \frac{rs' + r's}{ss'}, \qquad \frac{r}{s} \cdot \frac{r'}{s'} = \frac{rr'}{ss'}
> $$
>
> Có ring homomorphism chính tắc $\varphi: R \to S^{-1}R$, $r \mapsto r/1$.

> [!note] Remark 4.3 — Tại sao cần nhân tử $u$?
>
> Điều kiện $u(rs' - r's) = 0$ (thay vì chỉ $rs' = r's$) là cần thiết vì $R$ có thể có ước của không. Ví dụ: trong $R = \mathbb{Z}/6\mathbb{Z}$, $S = \{1, 2, 4\}$, phân thức $3/2$: ta muốn $3/2 = 0/1$ không? Tức $1 \cdot (3 \cdot 1 - 0 \cdot 2) = 3 \neq 0$, nhưng $2 \cdot (3 \cdot 1 - 0 \cdot 2) = 6 = 0$ trong $R$. Vậy $3/2 = 0/1$, đúng: $3$ bị "triệt tiêu" vì $2$ là ước của không.
>
> Nếu $R$ là miền nguyên và $0 \notin S$, điều kiện đơn giản hóa thành $rs' = r's$.

### Theorem

> [!abstract] Theorem 4.4 — Universal Property của Localization
>
> Cho $S$ tập nhân của $R$ và $\varphi: R \to S^{-1}R$ là ánh xạ chính tắc. Với mọi ring homomorphism $f: R \to T$ sao cho $f(s) \in T^\times$ với mọi $s \in S$, tồn tại duy nhất $g: S^{-1}R \to T$ sao cho $g \circ \varphi = f$:
>
> $$
> \begin{array}{ccc}
> R & \xrightarrow{\varphi} & S^{-1}R \\
> & \searrow^{f} & \downarrow^{\exists!\, g} \\
> & & T
> \end{array}
> $$
>
> Cụ thể: $g(r/s) = f(r) \cdot f(s)^{-1}$.

**Proof.** Tính well-defined: nếu $r/s = r'/s'$, tức $u(rs' - r's) = 0$ với $u \in S$, thì $f(u)(f(r)f(s') - f(r')f(s)) = 0$. Vì $f(u) \in T^\times$, suy ra $f(r)f(s)^{-1} = f(r')f(s')^{-1}$. Còn tính ring homomorphism và tính duy nhất là thường lệ. $\blacksquare$

---

## Localization của Module

### Definition

> [!info] Definition 4.5 — Localization của Module
>
> Cho $M$ là $R$-module và $S$ tập nhân. **Localization** $S^{-1}M$ là $S^{-1}R$-module gồm các phân thức $m/s$ ($m \in M$, $s \in S$) với:
>
> $$
> \frac{m}{s} \sim \frac{m'}{s'} \iff \exists\, u \in S:\; u(sm' - s'm) = 0
> $$
>
> Có đẳng cấu tự nhiên:
>
> $$
> S^{-1}M \;\cong\; S^{-1}R \otimes_R M
> $$

> [!abstract] Theorem 4.6 — Localization là Exact Functor
>
> Nếu $0 \to M' \to M \to M'' \to 0$ là short exact sequence của $R$-modules, thì:
>
> $$
> 0 \to S^{-1}M' \to S^{-1}M \to S^{-1}M'' \to 0
> $$
>
> cũng là short exact sequence (của $S^{-1}R$-modules). Tức là localization là **exact functor**.

**Proof.** Vì $S^{-1}M \cong S^{-1}R \otimes_R M$ (Definition 4.5), và $S^{-1}R$ là $R$-module flat (sẽ chứng minh ngay bên dưới), $\otimes_R S^{-1}R$ bảo toàn exact sequences. $\blacksquare$

> [!abstract] Theorem 4.7 — $S^{-1}R$ là Flat $R$-module
>
> Với mọi tập nhân $S$, $S^{-1}R$ là flat như $R$-module.

**Proof.** Theo Theorem 3.14(2), cần chứng minh: với mọi ideal $\mathfrak{a} \subseteq R$, ánh xạ $\mathfrak{a} \otimes_R S^{-1}R \to S^{-1}R$ là injective. Ta có $\mathfrak{a} \otimes_R S^{-1}R \cong S^{-1}\mathfrak{a} = \{a/s : a \in \mathfrak{a}, s \in S\}$, và đây là submodule của $S^{-1}R$ theo cách đặt tự nhiên. $\blacksquare$

---

## Tương ứng Ideal và Spec

### Theorem

> [!abstract] Theorem 4.8 — Tương ứng Ideal trong Localization
>
> Cho $\varphi: R \to S^{-1}R$ là ánh xạ chính tắc. Có song ánh:
>
> $$
> \left\{\text{prime ideals của } S^{-1}R\right\} \;\longleftrightarrow\; \left\{\mathfrak{p} \in \operatorname{Spec}(R) : \mathfrak{p} \cap S = \emptyset\right\}
> $$
>
> Cho bởi: $\mathfrak{q} \mapsto \varphi^{-1}(\mathfrak{q}) = \mathfrak{q}^c$ và $\mathfrak{p} \mapsto S^{-1}\mathfrak{p} = \{a/s : a \in \mathfrak{p}, s \in S\}$.

**Proof (phác thảo).** $S^{-1}\mathfrak{p}$ là prime ideal của $S^{-1}R$ khi $\mathfrak{p} \cap S = \emptyset$ (vì nếu $(a/s)(b/t) \in S^{-1}\mathfrak{p}$ thì $\exists u \in S: uab \in \mathfrak{p}$, và $u \in S$ nên $u \notin \mathfrak{p}$, suy ra $ab \in \mathfrak{p}$, tức $a \in \mathfrak{p}$ hoặc $b \in \mathfrak{p}$). Kiểm tra hai ánh xạ nghịch đảo nhau. $\blacksquare$

> [!example] Example 4.9 — Spec của Localization
>
> **Ví dụ 1: $R_\mathfrak{p}$ với $\mathfrak{p}$ prime.**
>
> $S = R \setminus \mathfrak{p}$, nên $\mathfrak{q} \cap S = \emptyset \iff \mathfrak{q} \subseteq \mathfrak{p}$. Vậy:
>
> $$
> \operatorname{Spec}(R_\mathfrak{p}) \longleftrightarrow \{\mathfrak{q} \in \operatorname{Spec}(R) : \mathfrak{q} \subseteq \mathfrak{p}\}
> $$
>
> Đặc biệt, $\mathfrak{p} R_\mathfrak{p}$ là maximal ideal duy nhất của $R_\mathfrak{p}$, nên **$R_\mathfrak{p}$ là local ring**.
>
> **Ví dụ 2: $\mathbb{Z}_{(p)} = \mathbb{Z} \setminus (p)^{-1}\mathbb{Z}$.**
>
> $\operatorname{Spec}(\mathbb{Z}_{(p)}) = \{(0), (p)\mathbb{Z}_{(p)}\}$: chỉ có hai prime ideals — maximal ideal $(p)$ và prime ideal $(0)$.

### Worked Example

> [!example] Example 4.10 — Tính toán localization cụ thể
>
> **Ví dụ 1:** $R = \mathbb{Z}$, $S = \{1, 2, 4, 8, \ldots\} = \{2^n : n \geq 0\}$.
>
> $$
> S^{-1}\mathbb{Z} = \mathbb{Z}[1/2] = \left\{\frac{a}{2^n} : a \in \mathbb{Z}, n \geq 0\right\}
> $$
>
> Đây là subring của $\mathbb{Q}$ gồm các phân số có mẫu là lũy thừa của $2$.
>
> **Ví dụ 2:** $R = k[x, y]$, $\mathfrak{p} = (x, y)$, $S = R \setminus \mathfrak{p}$.
>
> $$
> R_\mathfrak{p} = \left\{\frac{f}{g} : f, g \in k[x,y],\; g(0,0) \neq 0\right\}
> $$
>
> Đây là "vành các hàm hữu tỉ xác định tại gốc tọa độ" — ý nghĩa hình học rõ ràng.
>
> **Ví dụ 3:** $R = \mathbb{Z}/6\mathbb{Z}$, $\mathfrak{p} = (2)$ (prime vì $\mathbb{Z}/6/(2) \cong \mathbb{Z}/2$ là trường).
>
> $S = R \setminus (2) = \{\bar{1}, \bar{3}, \bar{5}\}$. Thêm nghịch đảo của $\bar{3}$ ($\bar{3}^{-1} = \bar{3}$ vì $3^2 = 9 \equiv 3$, nên $3 \cdot 3 = \bar{3}$ không phải $\bar{1}$... thực ra $\bar{3} \cdot \bar{3} = \bar{9} = \bar{3}$, và $\bar{3} \cdot \bar{5} = \bar{15} = \bar{3}$, $\bar{5} \cdot \bar{5} = \bar{25} = \bar{1}$). Sau khi localize: $R_\mathfrak{p} \cong \mathbb{Z}/2\mathbb{Z}$ (local ring với maximal ideal $(0)$).

---

## Tính chất Local-Global

### Theorem

> [!abstract] Theorem 4.11 — Nguyên lý Local-Global
>
> Cho $M$ là $R$-module. Các điều sau tương đương:
>
> 1. $M = 0$
> 2. $M_\mathfrak{p} = 0$ với mọi $\mathfrak{p} \in \operatorname{Spec}(R)$
> 3. $M_\mathfrak{m} = 0$ với mọi $\mathfrak{m} \in \operatorname{Max}(R)$

**Proof.** $(1) \Rightarrow (2) \Rightarrow (3)$ hiển nhiên. Chứng minh $(3) \Rightarrow (1)$: Giả sử $m \in M$, $m \neq 0$. Xét ideal $\operatorname{Ann}(m) = \{r \in R : rm = 0\} \subsetneq R$ (proper vì $1 \cdot m = m \neq 0$). Theo Theorem 1.15, tồn tại $\mathfrak{m} \in \operatorname{Max}(R)$ chứa $\operatorname{Ann}(m)$. Trong $M_\mathfrak{m}$, phần tử $m/1 \neq 0$ (vì nếu $m/1 = 0$ thì $\exists s \notin \mathfrak{m}: sm = 0$, tức $s \in \operatorname{Ann}(m) \subseteq \mathfrak{m}$ — mâu thuẫn). Vậy $M_\mathfrak{m} \neq 0$. $\blacksquare$

> [!abstract] Corollary 4.12 — Kiểm tra đẳng cấu cục bộ
>
> Một $R$-module homomorphism $f: M \to N$ là injective (resp. surjective, isomorphism) khi và chỉ khi $f_\mathfrak{m}: M_\mathfrak{m} \to N_\mathfrak{m}$ là injective (resp. surjective, isomorphism) với mọi $\mathfrak{m} \in \operatorname{Max}(R)$.

**Proof.** Áp dụng Theorem 4.11 cho $\ker f$ (resp. $\operatorname{coker} f$, cả hai). $\blacksquare$

> [!tip] Chiến lược Local-Global
>
> Đây là một trong những công cụ mạnh nhất trong Commutative Algebra: để chứng minh một tính chất của $R$-module $M$ (ví dụ: flat, projective, free), ta **địa phương hóa** về mọi $\mathfrak{m} \in \operatorname{Max}(R)$ và chứng minh $M_\mathfrak{m}$ có tính chất đó. Nhiều tính chất "bảo toàn qua localization" và "có thể dán lại" theo nghĩa này.

---

## SageMath Cheatsheet

```sage
# Localization của ZZ tại tập nhân {2^n}
R = ZZ
S = R.localization(2)   # ZZ[1/2]
S(3/4)    # 3/4 thuộc ZZ[1/2]? Có: 3/2^2

# Localization của vành đa thức
R.<x, y> = QQ[]
# Localize tại phần tử f = x
Rf = R.localization(x)   # QQ[x,y,x^{-1}]
Rf(1/x)   # x^{-1}

# Trường phân thức của miền nguyên
R.<x> = ZZ[]
F = R.fraction_field()   # QQ(x)
F(x/(x^2 - 1))

# Localization tại prime ideal
R = ZZ
# ZZ_(p) = các phân số a/b với p nmid b
# Trong SageMath: dùng LocalizationPrime
from sage.rings.localization import Localization
S = Localization(ZZ, (ZZ.ideal(5),))   # ZZ_(5)
S(3/7)    # 3/7 thuộc ZZ_(5) vì 5 nmid 7

# Spec và prime ideals
R.<x,y> = QQ[]
I = R.ideal(x^2 + y^2 - 1)
R_I = R.quotient(I)
R_I.spec()   # không dùng trực tiếp, nhưng:
[p for p in R.ideal(x, y).associated_primes()]
```

---

## Summary / Key Takeaways

- **Localization** $S^{-1}R$: thêm nghịch đảo của các phần tử trong tập nhân $S \subseteq R$.
- Ba trường hợp quan trọng: $R_\mathfrak{p}$ (tại prime ideal), $R_f$ (tại phần tử), $\operatorname{Frac}(R)$ (tại toàn bộ).
- **Universal property**: $S^{-1}R$ là vành duy nhất (up to isomorphism) nhận $R$ và biến mọi $s \in S$ thành đơn vị.
- $S^{-1}M \cong S^{-1}R \otimes_R M$: localization là tensor product.
- **Localization là exact functor**: $S^{-1}R$ là flat $R$-module.
- **Tương ứng Spec**: $\operatorname{Spec}(S^{-1}R) \leftrightarrow \{\mathfrak{p} \in \operatorname{Spec}(R) : \mathfrak{p} \cap S = \emptyset\}$.
- **$R_\mathfrak{p}$ là local ring** với maximal ideal $\mathfrak{p} R_\mathfrak{p}$.
- **Nguyên lý Local-Global**: $M = 0 \iff M_\mathfrak{m} = 0$ với mọi maximal ideal $\mathfrak{m}$.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 3.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 2.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 11–12.
- Matsumura, H. *Commutative Ring Theory*, Chapter 2.
