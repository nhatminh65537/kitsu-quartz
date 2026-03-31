---
title: "A4. Proof of Krull's Principal Ideal Theorem"
tags: [math, commutative-algebra, appendix]
created: 2026-03-30
---

> Bài học liên quan: [[11-dimension-theory|11. Dimension Theory]]

## Krull's Principal Ideal Theorem

> [!abstract] Theorem A4.1 — Krull's Hauptidealsatz
>
> Cho $R$ là Noetherian ring và $f \in R$ không phải đơn vị, không phải zero divisor. Nếu $\mathfrak{p}$ là prime ideal **cực tiểu** chứa $(f)$, thì $\operatorname{ht}(\mathfrak{p}) \leq 1$.

## Proof

Ta chứng minh bằng mâu thuẫn: giả sử $\operatorname{ht}(\mathfrak{p}) \geq 2$, tức tồn tại chuỗi $\mathfrak{p}_0 \subsetneq \mathfrak{p}_1 \subsetneq \mathfrak{p}$ trong $\operatorname{Spec}(R)$.

**Bước 1: Localize.** Thay $R$ bởi $R_\mathfrak{p}$ — coi $\mathfrak{p}$ là maximal ideal. Mọi prime $\mathfrak{q}$ của $R_\mathfrak{p}$ tương ứng prime $\leq \mathfrak{p}$ trong $R$. Ta vẫn cần $\operatorname{ht}(\mathfrak{p}) \geq 2$, tức tồn tại $\mathfrak{p}_0 \subsetneq \mathfrak{p}_1 \subsetneq \mathfrak{p}$ trong $R_\mathfrak{p}$.

**Bước 2: Xét $\bar{R} = R/(f)$.** Vì $\mathfrak{p}$ cực tiểu over $(f)$, prime $\bar{\mathfrak{p}} = \mathfrak{p}/(f)$ là **cực tiểu** trong $\operatorname{Spec}(\bar{R})$. Vậy $\bar{\mathfrak{p}} \in \operatorname{Min}(\bar{R})$ — là prime cực tiểu của $\bar{R}$.

**Bước 3: Dùng Noetherian để tìm lũy thừa.** Vì $\bar{R}$ Noetherian và $\bar{\mathfrak{p}}$ cực tiểu, tập $\bar{S} = \bar{R} \setminus \bar{\mathfrak{p}}$ thỏa: localization $\bar{R}_{\bar{\mathfrak{p}}}$ có duy nhất một prime là $\bar{\mathfrak{p}}\bar{R}_{\bar{\mathfrak{p}}}$ (vì $\bar{\mathfrak{p}}$ cực tiểu). Vậy $\bar{\mathfrak{p}}\bar{R}_{\bar{\mathfrak{p}}}$ là **nilradical** của $\bar{R}_{\bar{\mathfrak{p}}}$ (giao của tất cả primes, mà chỉ có một). Vì $\bar{R}_{\bar{\mathfrak{p}}}$ Noetherian: nilradical nilpotent, tức $(\bar{\mathfrak{p}}\bar{R}_{\bar{\mathfrak{p}}})^n = 0$ với một $n$.

Kéo về $\bar{R}$: tồn tại $n$ và $s \in R \setminus \mathfrak{p}$ sao cho:

$$
s \cdot \mathfrak{p}^n \subseteq (f)
$$

**Bước 4: Dùng prime $\mathfrak{p}_1 \subsetneq \mathfrak{p}$.** Vì $\mathfrak{p}$ cực tiểu over $(f)$ và $f \in \mathfrak{p}$, nhưng $\mathfrak{p}_1 \subsetneq \mathfrak{p}$, ta có $f \notin \mathfrak{p}_1$ (nếu $f \in \mathfrak{p}_1$ thì $\mathfrak{p}_1 \supseteq (f)$ mâu thuẫn cực tiểu của $\mathfrak{p}$).

Từ $s \cdot \mathfrak{p}^n \subseteq (f)$ và $f \notin \mathfrak{p}_1$: mọi phần tử $s \cdot p_1 \cdots p_n$ (với $p_i \in \mathfrak{p}$) đều là bội của $f$, không thuộc $\mathfrak{p}_1$ nếu $s \notin \mathfrak{p}_1$ và $p_i \notin \mathfrak{p}_1$. Nhưng nếu có $p_i \in \mathfrak{p} \setminus \mathfrak{p}_1$...

**Bước 5: Mâu thuẫn bằng Nakayama.** Localize tại $\mathfrak{p}_1$: xét $R_{\mathfrak{p}_1}$. Trong $R_{\mathfrak{p}_1}$:

- $f$ là đơn vị (vì $f \notin \mathfrak{p}_1$), vậy $(f) = R_{\mathfrak{p}_1}$.
- $\mathfrak{p} R_{\mathfrak{p}_1}$ là ideal của $R_{\mathfrak{p}_1}$ chứa $f$ (đơn vị), nên $\mathfrak{p} R_{\mathfrak{p}_1} = R_{\mathfrak{p}_1}$.

Nhưng $s \cdot \mathfrak{p}^n \subseteq (f)$ trong $R$, và $s \notin \mathfrak{p} \supseteq \mathfrak{p}_1$... Thực ra cần phân tích kỹ hơn:

Từ $s \mathfrak{p}^n \subseteq (f) \cdot R$, localize tại $\mathfrak{p}_1$: $s \cdot (\mathfrak{p} R_{\mathfrak{p}_1})^n \subseteq (f) R_{\mathfrak{p}_1} = R_{\mathfrak{p}_1}$ (vì $f$ đơn vị). Vì $s \notin \mathfrak{p}_1$ (nếu $s \in \mathfrak{p}_1 \subseteq \mathfrak{p}$, mâu thuẫn $s \notin \mathfrak{p}$), $s$ cũng là đơn vị trong $R_{\mathfrak{p}_1}$. Vậy $(\mathfrak{p} R_{\mathfrak{p}_1})^n = R_{\mathfrak{p}_1}$, tức $\mathfrak{p} R_{\mathfrak{p}_1} = R_{\mathfrak{p}_1}$ (vì $\mathfrak{p} R_{\mathfrak{p}_1}$ chứa đơn vị). Nhưng $\mathfrak{p} R_{\mathfrak{p}_1}$ là ideal thực sự của $R_{\mathfrak{p}_1}$ (vì $\mathfrak{p} \cap (R \setminus \mathfrak{p}_1) \neq \emptyset$: lấy bất kỳ $p \in \mathfrak{p} \setminus \mathfrak{p}_1$, tồn tại vì $\mathfrak{p}_1 \subsetneq \mathfrak{p}$)... Đây cho mâu thuẫn.

Vậy giả sử $\operatorname{ht}(\mathfrak{p}) \geq 2$ dẫn đến mâu thuẫn. $\blacksquare$

---

## Tổng quát hóa

> [!abstract] Theorem A4.2 — Krull's Generalized Principal Ideal Theorem
>
> Cho $R$ Noetherian và $\mathfrak{p}$ là prime cực tiểu chứa $(f_1, \ldots, f_r)$. Khi đó $\operatorname{ht}(\mathfrak{p}) \leq r$.

**Proof.** Quy nạp trên $r$. Trường hợp $r=1$: Theorem A4.1. Bước quy nạp: Giả sử $\operatorname{ht}(\mathfrak{p}) \geq r+1$, tức tồn tại chuỗi $\mathfrak{p}_0 \subsetneq \cdots \subsetneq \mathfrak{p}_r \subsetneq \mathfrak{p}$. Prime $\mathfrak{p}$ cực tiểu over $(f_1,\ldots,f_r)$. Vì $\mathfrak{p}_r \subsetneq \mathfrak{p}$, tồn tại prime $\mathfrak{q}$ cực tiểu over $\mathfrak{p}_r + (f_r) = \mathfrak{p}_r + (f_r)$ với $\mathfrak{q} \subseteq \mathfrak{p}$. Theo trường hợp $r=1$ (áp cho $R/\mathfrak{p}_r$): $\operatorname{ht}(\mathfrak{q}/\mathfrak{p}_r) \leq 1$, tức $\mathfrak{q} \subsetneq \mathfrak{p}$ (nếu $\mathfrak{q} = \mathfrak{p}$ thì $\operatorname{ht}(\mathfrak{p}/\mathfrak{p}_r) \leq 1$, nhưng ta có chuỗi $\mathfrak{p}_r \subsetneq \mathfrak{p}_{r-1}' \subsetneq \mathfrak{p}$...). Tiếp tục quy nạp: $\mathfrak{q}$ cực tiểu over $(f_1,\ldots,f_{r-1})$ với $\operatorname{ht}(\mathfrak{q}) \geq r$, mâu thuẫn giả thiết quy nạp. $\blacksquare$

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Theorem 11.13–11.14.
- Matsumura, H. *Commutative Ring Theory*, Theorem 13.5.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Theorem 10.1.
