---
title: "A0. Proof of Lemma 1"
type: deep-dive
tags: [coppersmith, lattice, proof, unimodular, appendix]
aliases: [Proof Lemma 1, Column Operations Determinant]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

> **Context**: Appendix A của paper. Lemma 1 được phát biểu và dùng trong [[01-introduction-and-lattice-primitives|Lesson 01]] và [[03-determinant-computation|Lesson 03]].  
> **Covers**: Appendix A — full proof của Lemma 1

---

## Statement (nhắc lại)

> [!abstract] Lemma 1 (Coron 2007, Appendix A)
> Cho $M$ là ma trận số nguyên với $m$ hàng và $n$ cột ($m \ge n$). Gọi $L$ là lattice sinh bởi các hàng của $M$. Cho $M'$ là ma trận thu từ $M$ bằng **elementary column operations**, và $L'$ là lattice sinh bởi các hàng của $M'$. Nếu $L$ là full rank, thì $L'$ cũng full rank và $\det L' = \det L$.

---

## Proof Đầy Đủ

**Bước 1 — Biểu diễn elementary column operations bằng ma trận unimodular.**

Elementary column operations (cộng bội nguyên của một cột vào cột khác, hoán vị hai cột) tương đương với nhân $M$ từ **bên phải** bởi một ma trận unimodular $V$ ($n \times n$, $\det V = \pm 1$):

$$
M' = M \cdot V
$$

**Bước 2 — Thu cơ sở của $L$ từ $M$ qua ma trận unimodular trái.**

Vì $L$ full rank, tồn tại ma trận unimodular $U$ ($m \times m$) sao cho:

$$
U \cdot M = \begin{pmatrix} R \\ 0 \end{pmatrix}
$$

trong đó $R$ là ma trận $n \times n$ là một cơ sở của $L$ (các hàng của $R$ là basis vectors). Điều kiện full rank đảm bảo $R$ vuông và khả nghịch.

**Bước 3 — Xây dựng cơ sở của $L'$.**

Nhân từ trái bởi $U$:

$$
U \cdot M' = U \cdot M \cdot V = \begin{pmatrix} R \\ 0 \end{pmatrix} \cdot V = \begin{pmatrix} R \cdot V \\ 0 \end{pmatrix}
$$

Vậy $R' := R \cdot V$ là một cơ sở của $L'$ (các hàng của $R'$ sinh ra $L'$). $L'$ là full rank vì $R'$ là $n \times n$ khả nghịch ($\det R' = \det R \cdot \det V \ne 0$).

**Bước 4 — So sánh determinant.**

$$
\det L' = |\det R'| = |\det(R \cdot V)| = |\det R| \cdot |\det V| = |\det R| \cdot 1 = \det L
$$

(Dùng $|\det V| = 1$ vì $V$ unimodular.) $\blacksquare$

---

## Ý Nghĩa Trong Thuật Toán

Lemma 1 được dùng **hai lần** trong §3 của paper:

1. **Tính $\det L'$** (Lesson 03, Bước 1 của Section 4): Column operations đưa block $[S \mid T]$ về $[I_{k^2} \mid 0]$. Lemma 1 đảm bảo $\det L'$ không thay đổi → có thể đọc $\det L'$ từ dạng đơn giản hơn.

2. **Kết luận $\det L_2' = \det L_2$** về mặt nguyên lý: rescaling cột từ $L_2'$ về $L_2$ (nhân cột $x^iy^j$ với $X^iY^j$) tương đương với column operations → $\det$ thay đổi theo tỉ lệ xác định (được tính tường minh trong Lesson 03).

---

## References

- Coron 2007 — Appendix A
- [[01-introduction-and-lattice-primitives|01. Introduction & Lattice Primitives]] — Lemma 1 statement và proof sketch
- [[03-determinant-computation|03. Determinant Computation]] — ứng dụng của Lemma 1
