---
title: "13. Solvable Groups và Radical Extensions"
tags: [math, galois-theory, lesson-13]
aliases: [Solvable Groups và Radical Extensions]
created: 2026-03-24
---

> **Prerequisites**: [[08-fundamental-theorem|08. Fundamental Theorem of Galois Theory]], [[09-cyclotomic-extensions|09. Cyclotomic Extensions]]
> **Objectives**:
> - Định nghĩa solvable group qua derived series và subnormal series
> - Nắm vững các tính chất đóng của lớp solvable groups
> - Định nghĩa radical extension và tower của radical extensions
> - Phát biểu **Galois Solvability Criterion**: solvable by radicals $\iff$ $\operatorname{Gal}(f)$ solvable
> - Chứng minh chiều $(\Leftarrow)$ bằng Kummer theory sketch

---

## Motivation / Intuition

Từ thời cổ đại, người ta biết giải phương trình bậc 2 bằng công thức $x = \frac{-b \pm \sqrt{b^2-4c}}{2}$ — dùng **căn bậc hai**. Thế kỷ 16, Cardano và Ferrari tìm ra công thức cho bậc 3 và 4 — dùng thêm **căn bậc ba** và **bậc bốn**. Tất cả đều là biểu diễn **bằng căn thức** (by radicals).

Câu hỏi: bậc 5 có công thức tương tự không?

Abel năm 1824 chứng minh không. Galois sau đó tiến thêm bước lớn: xác định **chính xác** khi nào một đa thức cụ thể có thể giải bằng căn thức — và điều đó tương đương với cấu trúc đại số của **Galois group**.

Bài này xây dựng hai khái niệm trung tâm: **solvable group** (nhóm giải được) và **radical extension** (mở rộng căn). Bài 14 sẽ dùng chúng để chứng minh insolvability của quintic.

---

## Solvable Groups

### Derived Series

> [!definition] Definition 13.1 — Commutator Subgroup và Derived Series
> Cho $G$ là nhóm. **Commutator subgroup** (nhóm giao hoán tử) của $G$ là:
>
> $$
> G' = [G, G] = \langle [a, b] \mid a, b \in G \rangle, \quad [a,b] = aba^{-1}b^{-1}
> $$
>
> **Derived series** (dãy dẫn xuất) của $G$ là:
>
> $$
> G = G^{(0)} \trianglerighteq G^{(1)} \trianglerighteq G^{(2)} \trianglerighteq \cdots
> $$
>
> với $G^{(0)} = G$ và $G^{(k+1)} = [G^{(k)}, G^{(k)}] = (G^{(k)})'$.

> [!note] Remark 13.2
> $G/G'$ là nhóm abelian lớn nhất là quotient của $G$ — gọi là **abelianization** của $G$. Mọi quotient abelian của $G$ đều là quotient của $G/G'$.

> [!definition] Definition 13.3 — Solvable Group
> Nhóm $G$ được gọi là **solvable** (giải được) nếu derived series của $G$ đạt tới nhóm trivial sau hữu hạn bước:
>
> $$
> G^{(k)} = \{e\} \quad \text{với } k \geq 1
> $$

### Đặc trưng tương đương

> [!abstract] Theorem 13.4 — Các đặc trưng tương đương
> Cho $G$ là nhóm hữu hạn. Các điều kiện sau **tương đương**:
>
> 1. $G$ solvable (derived series đạt $\{e\}$).
> 2. Tồn tại **subnormal series**: $\{e\} = G_0 \trianglelefteq G_1 \trianglelefteq \cdots \trianglelefteq G_k = G$ với mỗi $G_{i+1}/G_i$ là nhóm **abelian**.
> 3. Tồn tại **composition series**: $\{e\} = G_0 \trianglelefteq G_1 \trianglelefteq \cdots \trianglelefteq G_k = G$ với mỗi $G_{i+1}/G_i$ là nhóm **cyclic bậc nguyên tố**.

**Proof sketch.** $(1) \Rightarrow (2)$: Lấy $G_i = G^{(k-i)}$ (đảo ngược derived series) — mỗi quotient $G^{(i)}/G^{(i+1)}$ abelian.
$(2) \Rightarrow (1)$: Quy nạp theo số bước, dùng $[G_{i+1},G_{i+1}] \subseteq G_i$ (vì quotient abelian).
$(2) \Leftrightarrow (3)$: Mỗi factor abelian có thể refine thành cyclic bậc nguyên tố (dùng cấu trúc nhóm abelian hữu hạn). $\blacksquare$

### Ví dụ

> [!example] Example 13.5
> - Mọi nhóm **abelian** đều solvable: $G' = \{e\}$, derived series dừng sau 1 bước.
> - $S_3$ solvable: $S_3^{(1)} = A_3 = \{e, (123), (132)\} \cong \mathbb{Z}/3$, $S_3^{(2)} = [A_3,A_3] = \{e\}$ (vì $A_3$ abelian).
> - $S_4$ solvable: $S_4^{(1)} = A_4$, $A_4^{(1)} = V_4 = \{1,(12)(34),(13)(24),(14)(23)\}$, $V_4^{(1)} = \{e\}$.
> - $D_n$ solvable với mọi $n$ (vì $D_n$ có normal subgroup cyclic index 2).
> - $A_4$ solvable: $A_4^{(1)} = V_4$, $V_4^{(1)} = \{e\}$.

> [!warning] Counterexample 13.6 — $A_5$ KHÔNG solvable
> $A_5$ là nhóm simple (không có normal subgroup khác $\{e\}$ và $A_5$).
>
> $A_5^{(1)} = [A_5,A_5] = A_5$ (vì $A_5$ simple và non-abelian, $A_5/A_5^{(1)}$ trivial, còn $A_5^{(1)} \neq \{e\}$). Vậy derived series **không bao giờ** đạt $\{e\}$.
>
> $A_5$ không solvable. Đây là nhóm đơn non-abelian nhỏ nhất (bậc 60).

### Tính chất đóng

> [!abstract] Theorem 13.7 — Lớp Solvable Groups đóng dưới subgroup, quotient, extension
> 1. Subgroup của solvable group là solvable.
> 2. Quotient của solvable group là solvable.
> 3. Nếu $N \trianglelefteq G$ với $N$ và $G/N$ đều solvable, thì $G$ solvable.

**Proof.** (1) Nếu $H \leq G$ thì $H^{(k)} \leq G^{(k)}$ (quy nạp), vậy $G^{(k)} = \{e\} \Rightarrow H^{(k)} = \{e\}$.
(2) Nếu $\pi: G \to G/N$ thì $\pi(G^{(k)}) = (G/N)^{(k)}$ (hình ảnh của commutator là commutator của hình ảnh). Vậy $G^{(k)} = \{e\} \Rightarrow (G/N)^{(k)} = \{e\}$.
(3) Từ $N$ solvable: $N^{(j)} = \{e\}$. Từ $G/N$ solvable: $(G/N)^{(k)} = \{e\}$, tức $G^{(k)} \subseteq N$. Vậy $G^{(k+j)} \subseteq N^{(j)} = \{e\}$. $\blacksquare$

---

## Radical Extensions

### Definition

> [!definition] Definition 13.8 — Simple Radical Extension
> Extension $L/K$ được gọi là **simple radical extension** nếu $L = K(\alpha)$ với $\alpha^n \in K$ với $n \geq 1$ nào đó.

> [!definition] Definition 13.9 — Radical Extension (Radical Tower)
> Extension $L/K$ được gọi là **radical extension** (mở rộng căn thức) nếu có tháp:
>
> $$
> K = F_0 \subseteq F_1 \subseteq F_2 \subseteq \cdots \subseteq F_s = L
> $$
>
> trong đó mỗi $F_{i+1}/F_i$ là simple radical extension: $F_{i+1} = F_i(\alpha_i)$ với $\alpha_i^{n_i} \in F_i$.

> [!definition] Definition 13.10 — Solvable by Radicals
> Polynomial $f \in K[x]$ được gọi là **solvable by radicals** (giải được bằng căn thức) nếu splitting field của $f$ nằm trong một radical extension của $K$.

> [!example] Example 13.11 — Ví dụ cụ thể về radical extensions
> - $\mathbb{Q}(\sqrt{2})/\mathbb{Q}$: simple radical, $\alpha = \sqrt{2}$, $\alpha^2 = 2 \in \mathbb{Q}$.
> - $\mathbb{Q}(\sqrt{2}, \sqrt[3]{3})/\mathbb{Q}$: tower $\mathbb{Q} \subset \mathbb{Q}(\sqrt{2}) \subset \mathbb{Q}(\sqrt{2}, \sqrt[3]{3})$.
> - Nghiệm của $x^3 + px + q$: $\alpha = \sqrt[3]{-q/2 + \sqrt{q^2/4 + p^3/27}} + \sqrt[3]{-q/2 - \sqrt{q^2/4 + p^3/27}}$ — đây là radical extension bậc tháp 2, 3.

---

## Liên kết: Cyclic Extension và Căn $n$-th

Công cụ then chốt: **Kummer theory** (phiên bản đơn giản).

> [!abstract] Theorem 13.12 — Kummer: Cyclic extension $\iff$ adjoin $n$-th root (khi có roots of unity)
> Cho $K$ là field với $\operatorname{char}(K) \nmid n$ và $\zeta_n \in K$ (tức $K$ chứa primitive $n$-th root of unity). Khi đó:
>
> $L/K$ là **cyclic extension bậc $n$** khi và chỉ khi $L = K(\alpha)$ với $\alpha^n \in K$.
>
> Tức là: $L/K$ cyclic bậc $n$ $\iff$ $L/K$ là simple radical extension sinh bởi $n$-th root.

**Proof (chiều $\Leftarrow$).** Giả sử $L = K(\alpha)$ với $a = \alpha^n \in K$. Mọi $K$-automorphism $\sigma$ phải gửi $\alpha \mapsto \zeta_n^k \alpha$ với $k \in \{0,\ldots,n-1\}$ (vì $(\sigma(\alpha))^n = a$). Map $\sigma \mapsto k$ cho injection $\operatorname{Gal}(L/K) \hookrightarrow \mathbb{Z}/n\mathbb{Z}$, nên $G$ cyclic. $\blacksquare$

---

## Galois Solvability Criterion

Đây là định lý trung tâm kết nối solvable groups và radical extensions.

> [!abstract] Theorem 13.13 — Galois Solvability Criterion
> Cho $f \in \mathbb{Q}[x]$ separable. Khi đó:
>
> $$
> f \text{ solvable by radicals} \iff \operatorname{Gal}(f) \text{ là solvable group}
> $$

Xem chứng minh đầy đủ tại [[a3-galois-solvability|A3. Galois Solvability Criterion]].

**Proof sketch ($\Leftarrow$: solvable group $\Rightarrow$ solvable by radicals):**

Giả sử $G = \operatorname{Gal}(L/\mathbb{Q})$ solvable, với dãy $\{e\} = G_k \trianglelefteq \cdots \trianglelefteq G_0 = G$ và mỗi $G_i/G_{i+1}$ cyclic bậc nguyên tố $p_i$.

**Bước 1:** Thêm tất cả $p_i$-th roots of unity vào base field: đặt $E = \mathbb{Q}(\zeta_m)$ với $m = \operatorname{lcm}(p_i)$. Extension $E/\mathbb{Q}$ là abelian (Galois group của cyclotomic extension, Bài 09).

**Bước 2:** Xét tháp $E = E_0 \subseteq E_1 \subseteq \cdots \subseteq E_k = EL$ tương ứng với dãy subgroups.

**Bước 3:** Mỗi $E_{i+1}/E_i$ là cyclic (vì $G_{i}/G_{i+1}$ cyclic). Vì $E_i$ đã chứa roots of unity, Theorem 13.12 cho $E_{i+1} = E_i(\beta_i)$ với $\beta_i^{p_i} \in E_i$.

**Bước 4:** $EL/\mathbb{Q}$ là radical extension (từ tháp $\mathbb{Q} \subseteq E \subseteq E_1 \subseteq \cdots \subseteq EL$). Vì $L \subseteq EL$, tất cả nghiệm của $f$ nằm trong radical extension. $\blacksquare$

**Proof sketch ($\Rightarrow$: solvable by radicals $\Rightarrow$ solvable group):**

Giả sử $L$ là radical extension chứa splitting field $K$ của $f$. Bằng cách lấy Galois closure và thêm roots of unity, ta có thể giả sử $L/\mathbb{Q}$ là Galois. Tháp radical cho $\operatorname{Gal}(L/\mathbb{Q})$ solvable (mỗi bước cyclic dẫn đến factor abelian trong derived series). Từ đó $\operatorname{Gal}(f) = \operatorname{Gal}(K/\mathbb{Q})$ là quotient của $\operatorname{Gal}(L/\mathbb{Q})$, nên cũng solvable (Theorem 13.7.2). $\blacksquare$

---

## Solvability của Polynomials bậc thấp

> [!abstract] Corollary 13.14 — Polynomials bậc $\leq 4$ luôn solvable by radicals
> Mọi polynomial bậc $\leq 4$ trên $\mathbb{Q}$ đều solvable by radicals.

**Proof.** Galois group của polynomial bậc $n$ là transitive subgroup của $S_n$. Với $n \leq 4$:
- $n = 2$: $G \leq S_2 \cong \mathbb{Z}/2$, abelian, solvable.
- $n = 3$: $G \in \{A_3, S_3\}$. Cả hai solvable (Bài 12).
- $n = 4$: $G \in \{V_4, \mathbb{Z}/4, D_4, A_4, S_4\}$. Ta đã thấy $S_4$ solvable — và các subgroups của $S_4$ cũng solvable. $\blacksquare$

Điều này giải thích: công thức nghiệm bậc 2 (Bhaskara), Cardano (bậc 3), Ferrari (bậc 4) **đều tồn tại** vì Galois groups luôn solvable.

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(4)
print(G.is_solvable())

A5 = AlternatingGroup(5)
print(A5.is_solvable())

def derived_series(G):
    series = [G]
    while True:
        H = series[-1].commutator()
        if H.order() == 1:
            break
        series.append(H)
    return series

S4 = SymmetricGroup(4)
ds = derived_series(S4)
print([H.order() for H in ds])

f = QQ['x']('x^4 - 2')
L = f.splitting_field('a')
G = L.galois_group()
print(G.is_solvable())

g = QQ['x']('x^3 - 3*x + 1')
Lg = g.splitting_field('b')
print(Lg.galois_group().is_solvable())
```

---

## Summary / Key Takeaways

- **Derived series**: $G \trianglerighteq G' \trianglerighteq G'' \trianglerighteq \cdots$, với $G' = [G,G]$.
- $G$ **solvable** $\iff$ derived series đạt $\{e\}$ $\iff$ có subnormal series với factors abelian.
- Abelian $\Rightarrow$ solvable. $A_5$ là counterexample nhỏ nhất non-solvable.
- $S_n$ solvable khi $n \leq 4$; $S_n$ **không** solvable khi $n \geq 5$ (vì chứa $A_5$).
- **Radical extension**: tháp $K \subseteq K(\alpha_1) \subseteq \cdots$ với mỗi $\alpha_i^{n_i}$ ở layer trước.
- **Kummer**: khi $K$ có đủ roots of unity, cyclic extension $\iff$ adjoin $n$-th root.
- **Galois Solvability Criterion**: $f$ solvable by radicals $\iff$ $\operatorname{Gal}(f)$ solvable.
- Hệ quả: bậc $\leq 4$ luôn solvable (công thức nghiệm tồn tại); bậc $\geq 5$ có thể không solvable.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §§14.6–14.7.
- Milne, J. S. *Fields and Galois Theory*, §§12–13.
- Stewart, I. *Galois Theory* (4th ed.), Chapters 17–18.
- Lang, S. *Algebra* (3rd ed.), Chapter VI §§7–8.
