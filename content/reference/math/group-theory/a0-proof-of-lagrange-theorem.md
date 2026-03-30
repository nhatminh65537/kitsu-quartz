---
title: "A0. Proof of Lagrange's Theorem"
tags: [math, group-theory, appendix]
created: 2026-03-26
---

> Bài học liên quan: [[04-cosets-and-lagrange|04. Cosets and Lagrange's Theorem]]

## Định lý Lagrange

> [!abstract] Theorem 4.7 — Định lý Lagrange (Lagrange's Theorem)
> Cho $G$ là nhóm hữu hạn và $H \leq G$. Khi đó:
>
> $$
> |G| = [G : H] \cdot |H|
> $$
>
> Đặc biệt, $|H|$ chia hết $|G|$.

## Proof

Ta sẽ chứng minh định lý bằng cách xây dựng tường minh phân hoạch của $G$ thành các coset trái của $H$.

**Bước 1 — Các coset trái phân hoạch $G$.**

Định nghĩa quan hệ $\sim$ trên $G$ bởi:

$$
a \sim b \iff b^{-1}a \in H
$$

Ta chứng minh đây là quan hệ tương đương:

- **Phản xạ**: $a^{-1}a = e \in H$, nên $a \sim a$.
- **Đối xứng**: Nếu $b^{-1}a \in H$ thì $(b^{-1}a)^{-1} = a^{-1}b \in H$, nên $b \sim a$.
- **Bắc cầu**: Nếu $b^{-1}a \in H$ và $c^{-1}b \in H$ thì $c^{-1}a = (c^{-1}b)(b^{-1}a) \in H$, nên $a \sim c$.

Lớp tương đương của $a$ là:

$$
[a] = \left\{ b \in G : b^{-1}a \in H \right\} = \left\{ b \in G : b \in aH \right\} = aH
$$

Vậy các coset trái $\{aH : a \in G\}$ chính là các lớp tương đương theo $\sim$, do đó chúng tạo thành phân hoạch của $G$.

**Bước 2 — Mọi coset có cùng bậc.**

Với mọi $a \in G$, ánh xạ

$$
\phi_a : H \to aH, \quad h \mapsto ah
$$

là song ánh: surjective theo định nghĩa; injective vì $ah_1 = ah_2 \Rightarrow h_1 = h_2$ (quy tắc xóa). Vậy $|aH| = |H|$.

**Bước 3 — Đếm.**

Gọi $r = [G:H]$ là số coset trái phân biệt, và chọn đại diện $a_1, a_2, \ldots, a_r$ sao cho $G = a_1 H \sqcup a_2 H \sqcup \cdots \sqcup a_r H$ (phân hoạch). Khi đó:

$$
|G| = \sum_{i=1}^{r} |a_i H| = \sum_{i=1}^{r} |H| = r \cdot |H| = [G:H] \cdot |H|
$$

$\blacksquare$

## Remarks

Cùng lập luận áp dụng cho coset phải, cho $|G| = |H| \cdot [G:H]$ từ hướng phải — kết quả không đổi vì $[G:H]$ đếm đúng số coset trái lẫn phải (hai con số đó bằng nhau, dù từng coset trái và phải có thể khác nhau).

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 4 (§3.2).
- Hungerford, T. W. *Algebra*, Theorem I.4.5.
