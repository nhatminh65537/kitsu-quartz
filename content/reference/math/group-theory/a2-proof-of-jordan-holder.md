---
title: "A2. Proof of Jordan–Hölder Theorem"
tags: [math, group-theory, appendix]
created: 2026-03-26
---

> Bài học liên quan: [[10-composition-series|10. Composition Series and Solvable Groups]]

## Định lý Jordan–Hölder

> [!abstract] Theorem 10.4 — Định lý Jordan–Hölder
> Nếu $G$ hữu hạn, $G \neq \{e\}$, thì bất kỳ hai chuỗi hợp thành của $G$ đều có cùng độ dài và cùng tập hợp nhân tử hợp thành (đến thứ tự và đẳng cấu).

## Proof

Ta chứng minh bằng quy nạp theo $|G|$.

**Trường hợp cơ sở**: $|G|$ nguyên tố, $G \cong \mathbb{Z}_p$. Chuỗi hợp thành duy nhất là $G \supset \{e\}$, nhân tử là $\mathbb{Z}_p$.

**Bước quy nạp**: Giả sử định lý đúng với mọi nhóm có bậc $< |G|$.

Cho hai chuỗi hợp thành:

$$
\mathcal{C}_1: \quad G = G_0 \supsetneq G_1 \supsetneq \cdots \supsetneq G_r = \{e\}
$$

$$
\mathcal{C}_2: \quad G = H_0 \supsetneq H_1 \supsetneq \cdots \supsetneq H_s = \{e\}
$$

**Trường hợp $G_1 = H_1$**: Áp dụng giả thiết quy nạp cho $G_1$ (bậc nhỏ hơn): hai chuỗi hợp thành của $G_1$ — phần còn lại của $\mathcal{C}_1$ và $\mathcal{C}_2$ — có cùng độ dài và nhân tử. Cộng thêm nhân tử $G/G_1$: $r = s$ và cùng tập nhân tử.

**Trường hợp $G_1 \neq H_1$**: Đặt $D = G_1 \cap H_1$. Vì $G_1, H_1 \trianglelefteq G$: $G_1 H_1 \trianglelefteq G$ và $G_1 H_1 \supseteq G_1$. Vì $G_1$ cực đại chuẩn tắc (nhân tử $G/G_1$ đơn), $G_1 H_1 = G$. Theo định lý đẳng cấu II (Diamond):

$$
G/G_1 = G_1 H_1/G_1 \cong H_1/(G_1 \cap H_1) = H_1/D
$$

$$
G/H_1 = G_1 H_1/H_1 \cong G_1/(G_1 \cap H_1) = G_1/D
$$

Vì $G/G_1$ và $G/H_1$ đơn, $H_1/D$ và $G_1/D$ cũng đơn. Chọn chuỗi hợp thành cho $D$ (tồn tại vì $|D| < |G|$):

$$
\mathcal{D}: \quad D = D_0 \supsetneq \cdots \supsetneq D_t = \{e\}
$$

Xây dựng chuỗi tổng hợp qua $G_1$ và $D$:

$$
G \supsetneq G_1 \supsetneq D \supsetneq \cdots \supsetneq \{e\}
$$

và qua $H_1$ và $D$:

$$
G \supsetneq H_1 \supsetneq D \supsetneq \cdots \supsetneq \{e\}
$$

Theo giả thiết quy nạp cho $G_1$: chuỗi $\mathcal{C}_1$ (từ $G_1$) và chuỗi qua $G_1, D$ có cùng nhân tử, nên $\mathcal{C}_1$ có nhân tử $\{G/G_1\} \cup \{G_1/D\} \cup \text{(nhân tử của } \mathcal{D})$.

Tương tự: $\mathcal{C}_2$ có nhân tử $\{G/H_1\} \cup \{H_1/D\} \cup \text{(nhân tử của } \mathcal{D})$.

Vì $G/G_1 \cong H_1/D$ và $G/H_1 \cong G_1/D$, hai tập nhân tử trùng nhau (chỉ hoán vị). $\blacksquare$

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 11 (§3.4).
- Lang, S. *Algebra* (Revised 3rd ed.), Chapter I §7.
