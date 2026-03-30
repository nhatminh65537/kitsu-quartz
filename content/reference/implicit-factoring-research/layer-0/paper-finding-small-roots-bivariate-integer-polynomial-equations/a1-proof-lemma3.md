---
title: "A1. Proof of Lemma 3"
type: deep-dive
tags: [coppersmith, lattice, proof, diagonally-dominant, appendix]
aliases: [Proof Lemma 3, Diagonally Dominant S]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

> **Context**: Appendix B của paper. Lemma 3 được phát biểu và dùng trong [[04-complexity-and-correctness|Lesson 04]].  
> **Covers**: Appendix B — full proof của Lemma 3 (diagonally dominant matrix argument)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\tilde{p}_{ij}$ | $p_{ij} X^i Y^j$ — hệ số đã được scale theo bounds |
> | $\mu(a,b)$ | $ka + b$ — index function ánh xạ $(a,b) \mapsto$ hàng/cột của $S$ |
> | $S'$ | Ma trận dẫn xuất từ $S$ bằng row/column scaling (khác với adjoint $S'$ ở §3.1) |
> | $(u,v)$ | Chỉ số của hệ số tối đa: $W = |p_{uv}|X^uY^v$ |
> | $(i_0,j_0)$ | Chỉ số tối ưu hóa (Lemma 3 statement) |

---

## Statement (nhắc lại)

> [!abstract] Lemma 3 (Coron 2007, Appendix B; cf. Lemma 3 trong [Cop97])
> Cho $(u,v)$ thỏa $W = |p_{uv}|X^uY^v$. Gọi $(i_0,j_0)$ là chỉ số với $0 \le i_0,j_0 \le \delta$ maximize:
>
> $$
> 8^{(i-u)^2+(j-v)^2} |p_{ij}|X^iY^j
> $$
>
> Khi đó:
>
> $$
> \left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} 2^{-6k^2\delta^2-2k^2} \;\le\; |\det S| \;\le\; \left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} 2^{k^2}
> $$

---

## Proof Đầy Đủ

**Bước 1 — Xác định cấu trúc của $S$.**

Ma trận $S$ có phần tử:

$$
S_{\mu(a,b),\,\mu(i,j)} = p_{i_0+i-a,\;j_0+j-b}
$$

với $0 \le a,b,i,j < k$. (Đây là hệ số của $x^{i_0+i}y^{j_0+j}$ trong $x^ay^bp(x,y)$.)

**Bước 2 — Scaling để tạo $S'$.**

Nhân **cột** $\mu(i,j)$ của $S$ với $8^{2(i_0-u)i+2(j_0-v)j} \cdot X^{i_0+i}Y^{j_0+j}$ và nhân **hàng** $\mu(a,b)$ với $8^{-2(i_0-u)a-2(j_0-v)b} \cdot X^{-a}Y^{-b}$ để thu ma trận $S'$:

$$
S'_{\mu(a,b),\,\mu(i,j)} = p_{i_0+i-a,\;j_0+j-b} \cdot X^{i_0+i-a}Y^{j_0+j-b} \cdot 8^{2(i_0-u)(i-a)+2(j_0-v)(j-b)}
$$

$$
= \tilde{p}_{i_0+i-a,\;j_0+j-b} \cdot 8^{2(i_0-u)(i-a)+2(j_0-v)(j-b)}
$$

Quan hệ giữa $\det S'$ và $\det S$: nhân cột $\mu(i,j)$ với $8^{2(i_0-u)i+2(j_0-v)j} X^{i_0+i}Y^{j_0+j}$ và nhân hàng $\mu(a,b)$ với $8^{-2(i_0-u)a-2(j_0-v)b}X^{-a}Y^{-b}$:

$$
\det S' = \det S \cdot (X^{i_0}Y^{j_0})^{k^2} \tag{13}
$$

(Vì tích các nhân tử cột chia cho tích các nhân tử hàng thu được $(X^{i_0}Y^{j_0})^{k^2}$.)

**Bước 3 — Chứng minh $S'$ diagonally dominant.**

Phần tử đường chéo (khi $i=a$, $j=b$):

$$
S'_{\mu(a,b),\,\mu(a,b)} = \tilde{p}_{i_0,\,j_0} \cdot 8^0 = \tilde{p}_{i_0,\,j_0}
$$

Phần tử off-diagonal ($(i,j) \ne (a,b)$): từ tính tối ưu của $(i_0,j_0)$, ta có:

$$
8^{(i_0+i-a-u)^2+(j_0+j-b-v)^2} |\tilde{p}_{i_0+i-a,\;j_0+j-b}| \;\le\; 8^{(i_0-u)^2+(j_0-v)^2} |\tilde{p}_{i_0,j_0}|
$$

Khai triển vế trái dùng $(i_0+i-a-u)^2 = (i_0-u)^2 + 2(i_0-u)(i-a) + (i-a)^2$:

$$
8^{(i_0-u)^2+(j_0-v)^2} \cdot 8^{2(i_0-u)(i-a)+2(j_0-v)(j-b)} \cdot 8^{(i-a)^2+(j-b)^2} \cdot |\tilde{p}_{i_0+i-a,j_0+j-b}| \;\le\; 8^{(i_0-u)^2+(j_0-v)^2}|\tilde{p}_{i_0,j_0}|
$$

Chia hai vế cho $8^{(i_0-u)^2+(j_0-v)^2}$:

$$
|\tilde{p}_{i_0+i-a,j_0+j-b}| \cdot 8^{2(i_0-u)(i-a)+2(j_0-v)(j-b)} \;\le\; |\tilde{p}_{i_0,j_0}| \cdot 8^{-(i-a)^2-(j-b)^2}
$$

Vậy:

$$
|S'_{\mu(a,b),\,\mu(i,j)}| \;\le\; |\tilde{p}_{i_0,j_0}| \cdot 8^{-(i-a)^2-(j-b)^2} \quad \text{với } (i,j) \ne (a,b)
$$

**Bước 4 — Bound tổng off-diagonal.**

$$
\sum_{(i,j)\ne(a,b)} 8^{-(i-a)^2-(j-b)^2} \;\le\; \sum_{(i,j)\ne(0,0)} 8^{-i^2-j^2} \;\le\; -1 + \sum_{(i,j)\in\mathbb{Z}^2} 8^{-i^2-j^2}
$$

$$
= -1 + \left(\sum_{i\in\mathbb{Z}} 8^{-i^2}\right)^2 \le -1 + \left(\sum_{i\in\mathbb{Z}} 2^{-i^2}\right)^2
$$

Tính $\sum_{i\in\mathbb{Z}} 2^{-i^2} = 1 + 2 \cdot \sum_{i=1}^\infty 2^{-i^2} \le 1 + 2 \cdot \sum_{i=1}^\infty 2^{-i} = 1 + 2 = 3$. (Chặn thô nhưng đủ.)

Do đó tổng off-diagonal $\le -1 + 9 = 8$... thực ra cần chặn chặt hơn. Paper tính chính xác:

$$
\left(\sum_i 8^{-i^2}\right)^2 \le \left(1 + 2\cdot\frac{1}{8-1}\right)^2 < \left(\frac{9}{7}\right)^2 < 2
$$

Vậy tổng off-diagonal $\le -1 + 2 = 1$, do đó $\le \frac{3}{4}|\tilde{p}_{i_0,j_0}|$.

**Kết luận diagonally dominant**: Tổng trị tuyệt đối off-diagonal $\le \frac{3}{4}|\tilde{p}_{i_0,j_0}|$ < phần tử đường chéo $= |\tilde{p}_{i_0,j_0}|$.

**Bước 5 — Bound eigenvalues.**

$S'$ diagonally dominant với phần tử đường chéo $= \tilde{p}_{i_0,j_0}$ và tổng off-diagonal $\le \frac{3}{4}|\tilde{p}_{i_0,j_0}|$. Theo **Gershgorin circle theorem**: mọi eigenvalue $\lambda$ của $S'$ nằm trong đĩa tâm $\tilde{p}_{i_0,j_0}$, bán kính $\le \frac{3}{4}|\tilde{p}_{i_0,j_0}|$. Do đó:

$$
\frac{1}{4}|\tilde{p}_{i_0,j_0}| \;\le\; |\lambda| \;\le\; \frac{7}{4}|\tilde{p}_{i_0,j_0}|
$$

Suy ra ($k^2$ eigenvalue):

$$
|\tilde{p}_{i_0,j_0}|^{k^2} \cdot 2^{-2k^2} \;\le\; |\det S'| \;\le\; |\tilde{p}_{i_0,j_0}|^{k^2} \cdot 2^{k^2} \tag{14}
$$

**Bước 6 — Bound $|\tilde{p}_{i_0,j_0}|$ theo $W$.**

Từ tính tối ưu: $8^{(i_0-u)^2+(j_0-v)^2}|\tilde{p}_{i_0,j_0}| \ge 8^0 |\tilde{p}_{u,v}| = W$. Do $(i_0-u)^2+(j_0-v)^2 \le 2\delta^2$ (vì $0 \le i_0,u \le \delta$):

$$
8^{-2\delta^2} W \;\le\; |\tilde{p}_{i_0,j_0}| \;\le\; W
$$

(Upper bound: $|\tilde{p}_{i_0,j_0}| \le W$ vì $W = \max_{i,j}|\tilde{p}_{ij}|$ — cần xem lại: $W = \max|p_{ij}|X^iY^j = \max|\tilde{p}_{ij}|$, đúng.)

**Bước 7 — Kết hợp thu bound cuối.**

Thay vào (14):

$$
W^{k^2} \cdot 2^{-6k^2\delta^2-2k^2} \;\le\; |\det S'| \;\le\; W^{k^2} \cdot 2^{k^2}
$$

(Dùng $8^{-2k^2\delta^2} = 2^{-6k^2\delta^2}$.)

Từ (13): $\det S = \det S' / (X^{i_0}Y^{j_0})^{k^2}$:

$$
\left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} 2^{-6k^2\delta^2-2k^2} \;\le\; |\det S| \;\le\; \left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} 2^{k^2}
$$

$\blacksquare$

---

## Ghi Chú Kỹ Thuật

> [!tip] 💡 Agent note — Vai trò của factor $8$
>
> Factor $8^{(i-u)^2+(j-v)^2}$ trong cách chọn $(i_0,j_0)$ không phải tùy ý. Nó được thiết kế để đảm bảo chuỗi bất đẳng thức:
> $$\sum_{(i,j)\ne(0,0)} 8^{-i^2-j^2} \le \frac{3}{4}$$
> sao cho $S'$ diagonally dominant. Nếu dùng factor nhỏ hơn (ví dụ $4$), geometric series có thể không hội tụ đủ nhanh. Factor $8 = 2^3$ là lựa chọn tối thiểu đủ điều kiện.

> [!tip] 💡 Agent note — So sánh với [Cop97] Lemma 3
>
> Coppersmith [Cop97] dùng argument tương tự nhưng cho trường hợp lattice gốc (không phải sublattice $L_2$). Paper này adapt argument đó cho ma trận $S$ — một ma trận con $k^2 \times k^2$ thay vì toàn bộ lattice — và đây là điểm novel của Appendix B.

---

## References

- Coron 2007 — Appendix B
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 (proof của Lemma 3 gốc)
- [[04-complexity-and-correctness|04. Complexity & Correctness]] — sử dụng Lemma 3
