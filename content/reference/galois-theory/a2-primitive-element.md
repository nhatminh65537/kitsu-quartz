---
title: "A2. Primitive Element Theorem"
tags: [math, galois-theory, appendix]
created: 2026-03-24
---

> Bài học liên quan: [[07-galois-extensions|07. Galois Extensions]]

## Primitive Element Theorem — Chứng minh Đầy đủ

> [!abstract] Theorem A2.1 — Primitive Element Theorem
> Mọi finite separable extension $L/K$ đều là simple extension: tồn tại $\theta \in L$ sao cho $L = K(\theta)$.
>
> $\theta$ gọi là **primitive element** của $L/K$.

---

## Trường hợp $K$ vô hạn: $L = K(\alpha, \beta)$

Ta chứng minh cho $L = K(\alpha, \beta)$ trước, rồi quy nạp.

**Setup.** Gọi $f = \operatorname{Irr}(\alpha, K)$ (degree $m$), $g = \operatorname{Irr}(\beta, K)$ (degree $n$). Vì $L/K$ separable, $f$ và $g$ đều separable. Gọi $\alpha = \alpha_1, \alpha_2, \ldots, \alpha_m$ là tất cả nghiệm của $f$ trong $\bar{K}$, và $\beta = \beta_1, \beta_2, \ldots, \beta_n$ là nghiệm của $g$.

**Claim:** Với $c \in K$ được chọn sao cho $c \neq \frac{\alpha_i - \alpha}{\beta - \beta_j}$ với mọi $i \in \{1,\ldots,m\}$ và $j \in \{2,\ldots,n\}$, thì $\theta = \alpha + c\beta$ là primitive element.

**Proof.** Đặt $\theta = \alpha + c\beta$. Ta sẽ chứng minh $K(\theta) = K(\alpha, \beta)$.

Xét $h(x) = f(\theta - cx) \in K(\theta)[x]$. Khi thay $x = \beta$:

$$h(\beta) = f(\theta - c\beta) = f(\alpha) = 0$$

Vậy $\beta$ là nghiệm của $h(x) \in K(\theta)[x]$.

$\beta$ cũng là nghiệm của $g(x) \in K[x] \subseteq K(\theta)[x]$.

Nên $\beta$ là nghiệm chung của $h$ và $g$ trong $K(\theta)[x]$, tức là $\gcd(h, g)$ trong $K(\theta)[x]$ có $\beta$ là nghiệm.

**Khẳng định:** $\gcd(h, g) = (x - \beta)$ trong $K(\theta)[x]$, tức $\beta \in K(\theta)$.

*Chứng minh:* Các nghiệm của $h$ trong $\bar{K}$: $h(x) = 0 \Leftrightarrow f(\theta - cx) = 0 \Leftrightarrow \theta - cx \in \{\alpha_1, \ldots, \alpha_m\}$. Vậy nghiệm của $h$ là $\frac{\theta - \alpha_i}{c}$ với $i = 1, \ldots, m$.

Các nghiệm chung của $h$ và $g$ là $\beta_j$ với $h(\beta_j) = 0$ và $g(\beta_j) = 0$, tức:

$$\theta = \alpha + c\beta = \alpha_i + c\beta_j \text{ với } i \in \{1,\ldots,m\}, j \in \{1,\ldots,n\}$$

$$\Leftrightarrow c = \frac{\alpha - \alpha_i}{\beta_j - \beta} \quad (j \neq 1 \text{ vì nếu } j = 1 \text{ thì } \alpha = \alpha_i, i = 1)$$

Theo cách chọn $c$, không có $i, j$ nào thỏa điều này (trừ $i = 1, j = 1$ tức $\beta_j = \beta$). Vậy $\gcd(h, g) = (x - \beta)$ trong $K(\theta)[x]$, suy ra $\beta \in K(\theta)$.

Từ $\beta \in K(\theta)$ và $\theta = \alpha + c\beta$: $\alpha = \theta - c\beta \in K(\theta)$.

Vậy $K(\alpha, \beta) \subseteq K(\theta) \subseteq K(\alpha, \beta)$, tức $K(\theta) = K(\alpha, \beta)$. $\blacksquare$

**Số lượng giá trị $c$ cần tránh:** $\leq m(n-1)$ giá trị (hữu hạn). Vì $K$ vô hạn, luôn tồn tại $c \in K$ hợp lệ.

---

## Trường hợp tổng quát: quy nạp

**Proof.** Với $L = K(\alpha_1, \ldots, \alpha_k)$: áp dụng bổ đề trên lần lượt:

$K(\alpha_1, \alpha_2) = K(\theta_1)$ (primitive element $\theta_1$).

$K(\theta_1, \alpha_3) = K(\theta_2)$.

$\cdots$

$K(\alpha_1, \ldots, \alpha_k) = K(\theta_{k-1})$.

Vậy $L = K(\theta_{k-1})$. $\blacksquare$

---

## Trường hợp $K$ hữu hạn

**Proof.** Vì $K$ hữu hạn và $L/K$ finite, $L$ cũng hữu hạn. $L^\times$ là nhóm nhân cyclic (tính chất của trường hữu hạn — Bài 10). Lấy $\theta$ là generator của $L^\times$. Khi đó $L = K(\theta)$.  $\blacksquare$

---

## Hệ quả và Ứng dụng

> [!abstract] Corollary A2.2
> Mọi finite Galois extension $L/K$ là simple (có primitive element).
>
> (Vì Galois extension là separable và finite.)

> [!example] Example A2.3
> $L = \mathbb{Q}(\sqrt{2}, \sqrt{3})$: separable, $[L:\mathbb{Q}] = 4$.
>
> Proof tồn tại primitive element: $c = 1$ không phải trong tập tránh $\left\{\frac{\sqrt{2} - (-\sqrt{2})}{\sqrt{3} - (-\sqrt{3})}\right\} = \left\{\frac{2\sqrt{2}}{2\sqrt{3}}\right\} = \left\{\frac{\sqrt{2}}{\sqrt{3}}\right\} = \left\{\sqrt{2/3}\right\} \notin \mathbb{Q}$.
>
> Vậy $\theta = \sqrt{2} + \sqrt{3}$ là primitive element: $\mathbb{Q}(\sqrt{2}+\sqrt{3}) = \mathbb{Q}(\sqrt{2},\sqrt{3})$.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 14.4.
- Lang, S. *Algebra* (3rd ed.), Chapter V §4.
- Milne, J. S. *Fields and Galois Theory*, Theorem 5.1.
