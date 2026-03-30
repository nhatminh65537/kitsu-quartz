---
title: "01. Introduction & Lattice Primitives"
type: math-component
tags: [coppersmith, lattice, lll, howgrave-graham, small-roots, lesson-01]
aliases: [Lattice Primitives, LLL Theorem, Howgrave-Graham Lemma]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

> **Prerequisites**: Lattice reduction cơ bản (LLL algorithm), polynomial arithmetic trên $\mathbb{Z}$, RSA cryptosystem  
> 🔴 **Prerequisite references**: Coppersmith — *Finding a Small Root of a Univariate Modular Equation* [Cop96a] (univariate case là background); Coppersmith — *Finding a Small Root of a Bivariate Integer Equation* [Cop96b] (original algorithm được simplify)  
> **Lesson type**: Math Component  
> **Covers**: §1 (Introduction), §2 (Preliminaries — Theorem 1, Lemma 1, Lemma 2)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $p(x,y) = \sum_{0 \le i,j \le \delta} p_{i,j} x^i y^j$ | Đa thức hai biến bậc $\delta$ trong mỗi biến, hệ số nguyên | $p(x,y)$ |
> | $(x_0, y_0)$ | Nghiệm nguyên cần tìm | $(x_0, y_0)$ |
> | $X, Y$ | Bound trên $|x_0|$, $|y_0|$ | $X, Y$ |
> | $W$ | $\max_{i,j} |p_{i,j}| X^i Y^j$ | $W$ |
> | $\delta$ | Bậc tối đa của $p$ trong mỗi biến riêng lẻ | $\delta$ |
> | $L$ | Lattice — tập tổ hợp số nguyên của các vector cơ sở | $L$ |
> | $\omega$ | Số chiều (rank) của lattice | $\omega$ |
> | $\det(L)$ | Determinant của lattice | $\det L$ |
> | $\|v\|$ | Chuẩn Euclidean của vector $v$ | $\|v\|$ |

---

## 1. Bối cảnh: Hai Định lý của Coppersmith

Coppersmith (Eurocrypt 1996) đã công bố hai kết quả nền tảng về việc tìm nghiệm nhỏ của phương trình đa thức.

**Định lý thứ nhất — trường hợp univariate modular:** Cho đa thức $p(x) \in \mathbb{Z}[x]$ bậc $\delta$ và modulus $N$ chưa biết nhân tử, tồn tại thuật toán polynomial-time tìm mọi nghiệm $x_0$ của $p(x_0) \equiv 0 \pmod{N}$ thỏa $|x_0| < N^{1/\delta}$. Sau đó Howgrave-Graham [HG97] đơn giản hóa thuật toán này bằng cách xây dựng lattice từ các bội của $p(x)$ và $N$ — cách tiếp cận trực tiếp hơn và dễ phân tích hơn.

**Định lý thứ hai — trường hợp bivariate integer:** Cho đa thức $p(x,y) \in \mathbb{Z}[x,y]$ bậc tối đa $\delta$ trong mỗi biến, tìm mọi nghiệm nguyên $(x_0, y_0)$ thỏa $|x_0| < X$, $|y_0| < Y$, và $XY < W^{2/(3\delta)}$ — trong đó $W := \max_{i,j} |p_{i,j}| X^i Y^j$ là một dạng chuẩn có trọng số của các hệ số. Đây là **trường hợp nguyên** (over $\mathbb{Z}$), không phải modular.

Paper này tập trung vào **Định lý thứ hai**. Trước công trình này, đã có hai hướng tiếp cận:

- **Thuật toán gốc của Coppersmith [Cop96b, Cop97]**: Polynomial-time (đúng nghĩa), nhưng phức tạp để implement và phân tích.
- **Đơn giản hóa của Coron [Cor04]**: Dễ implement hơn, nhưng chỉ đạt polynomial-time khi $XY < W^{2/(3\delta) - \varepsilon}$. Với đúng ngưỡng $XY < W^{2/(3\delta)}$, complexity là sub-exponential:

$$
\exp\!\left(O\!\left(\log^{2/3} W\right)\right)
$$

**Đóng góp của paper này**: Đơn giản hóa tương tự như [Cor04] nhưng **đạt complexity polynomial-time** tại đúng ngưỡng Coppersmith. Điểm mấu chốt: thay vì chọn $n$ arbitrary như trong [Cor04], paper chọn $n = |\det S|$ một cách **tường minh** dựa trên hệ số của $p(x,y)$. Điều này cho phép thu gọn lattice từ chiều $(δ+k)^2$ xuống $\omega = \delta^2 + 2k\delta$, loại bỏ nguồn gốc của exponential blowup.

---

## 2. Lattice — Định nghĩa và Determinant

> [!note] Định nghĩa 2.1 — Lattice
> Cho $u_1, \ldots, u_\omega \in \mathbb{Z}^n$ là các vector độc lập tuyến tính với $\omega \le n$. **Lattice** $L$ sinh bởi $\langle u_1, \ldots, u_\omega \rangle$ là tập tất cả tổ hợp số nguyên:
>
> $$
> L = \left\{ \sum_{i=1}^\omega c_i u_i \;\middle|\; c_i \in \mathbb{Z} \right\}
> $$
>
> Tập $\{u_i\}$ gọi là **lattice basis**. Lattice là **full rank** khi $\omega = n$.

Một tính chất quan trọng: bất kỳ hai cơ sở nào của cùng một lattice $L$ đều liên hệ với nhau qua một ma trận số nguyên có định thức $\pm 1$ (ma trận **unimodular**). Hệ quả: **mọi cơ sở đều có cùng Gramian determinant** $\det_{1 \le i,j \le \omega} \langle u_i, u_j \rangle$.

> [!note] Định nghĩa 2.2 — Determinant của Lattice
> **Determinant** của lattice $L$ là căn bậc hai của Gramian determinant. Khi $L$ là full rank, $\det(L)$ bằng giá trị tuyệt đối của determinant của ma trận $\omega \times \omega$ có các hàng là $u_1, \ldots, u_\omega$.

Paper còn xét lattice sinh bởi $m$ vector với $m \ge n$ (nhiều hàng hơn cột — không phải cơ sở). Cơ sở cho $L$ có thể thu từ triangularization của hệ $u_1, \ldots, u_m$ — thuật toán polynomial-time mô tả trong [HM91].

---

## 3. Theorem 1 — LLL Algorithm

> [!info] 🟡 Tích hợp từ [LLL82]: Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, 1982
>
> LLL là thuật toán lattice reduction cơ bản: với input là một cơ sở của lattice $L \subset \mathbb{Z}^n$, LLL tìm một vector ngắn (không nhất thiết ngắn nhất) trong thời gian polynomial. Cụ thể:

> [!abstract] Theorem 1 (LLL) — [LLL82]
> Cho lattice $L$ sinh bởi $(u_1, \ldots, u_\omega) \in \mathbb{Z}^n$ với chuẩn Euclidean mỗi vector bị chặn bởi $B$. Thuật toán LLL, nhận input $(u_1, \ldots, u_\omega)$, tìm trong thời gian $O(\omega^5 n \log^3 B)$ một vector $b_1$ thỏa:
>
> $$
> \|b_1\| \le 2^{(\omega-1)/4} \cdot \det(L)^{1/\omega}
> $$

**Proof.** *(Theo [LLL82], Proposition 1.26 và Corollary 1.28.)* Thuật toán LLL thực hiện **Gram-Schmidt orthogonalization** lặp đi lặp lại kết hợp với size reduction và swap operations. Sau khi kết thúc, cơ sở thu được là **LLL-reduced**: mọi cặp vector kề nhau thỏa một bất đẳng thức Lovász condition. Từ đây, vector đầu tiên $b_1$ của cơ sở LLL-reduced thỏa bound trên — chứng minh dựa trên telescoping product của các Gram-Schmidt norms. $\blacksquare$

> [!tip] 💡 Agent note
> Thuật toán **L² (L-squared)** của Nguyen–Stehlé [NS05] là cải tiến của LLL dùng floating-point arithmetic: đạt cùng bound $\|b_1\| \le 2^{(\omega-1)/4} \det(L)^{1/\omega}$ nhưng trong thời gian $O(\omega^4 n (\omega + \log B) \log B)$ — nhanh hơn đáng kể về asymptotic với $\omega$ lớn. Trong Theorem 2 của paper (§9), khi dùng L² thay LLL, complexity tổng thể giảm từ $O(\log^{15} W)$ xuống $O(\log^{11} W)$.

---

## 4. Lemma 1 — Column Operations Preserve Determinant

Đây là một bổ đề kỹ thuật dùng để phân tích determinant của lattice $L_2$ trong §3. Nó phát biểu rằng **elementary operations trên các cột của ma trận hàng không thay đổi determinant của lattice được sinh ra**.

> [!abstract] Lemma 1 (Coron 2007, §2)
> Cho $M$ là ma trận số nguyên với $m$ hàng và $n$ cột ($m \ge n$). Gọi $L$ là lattice sinh bởi các hàng của $M$. Cho $M'$ là ma trận thu từ $M$ bằng **elementary column operations**, và $L'$ là lattice sinh bởi các hàng của $M'$. Nếu $L$ là full rank thì $L'$ cũng full rank và $\det L' = \det L$.

**Proof.** (Xem [[a0-proof-lemma1|A0. Proof of Lemma 1]] để có full proof.) Tóm tắt: elementary column operations tương đương với nhân $M$ từ bên phải bởi một ma trận unimodular $V$: $M' = M \cdot V$. Tồn tại ma trận unimodular $U$ sao cho $U \cdot M = \begin{bmatrix} R \\ 0 \end{bmatrix}$ trong đó $R$ là cơ sở của $L$. Khi đó $U \cdot M' = \begin{bmatrix} R \cdot V \\ 0 \end{bmatrix}$, và $R \cdot V$ là cơ sở của $L'$. Do đó $\det L' = |\det(R \cdot V)| = |\det R| \cdot |\det V| = \det L$. $\blacksquare$

> [!tip] 💡 Agent note
> Lemma 1 được dùng trong Lesson 03 để biện minh cho việc cột-operate ma trận $M'$ mà không làm thay đổi $\det L'$ — một bước trung gian quan trọng trong chuỗi tính toán $\det L' = n^\omega$.

---

## 5. Lemma 2 — Howgrave-Graham

Đây là bổ đề cốt lõi nối kết lattice reduction với nghiệm của phương trình đa thức. Trực giác: nếu tìm được đa thức $h(x,y)$ có hệ số **đủ nhỏ** và $h(x_0, y_0) \equiv 0 \pmod{n}$, thì tự động $h(x_0, y_0) = 0$ trên $\mathbb{Z}$.

> [!info] 🟡 Tích hợp từ [HG97]: Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, 1997
>
> Howgrave-Graham đề xuất kỹ thuật này cho trường hợp univariate; Coron mở rộng cho bivariate. Phiên bản bivariate trong paper chính xác là Lemma 2 dưới đây.

> [!abstract] Lemma 2 (Howgrave-Graham) — [HG97, mở rộng bởi Coron 2007]
> Cho $h(x,y) \in \mathbb{Z}[x,y]$ là tổng của nhiều nhất $\omega$ monomial. Giả sử $h(x_0, y_0) \equiv 0 \pmod{n}$ với $|x_0| \le X$ và $|y_0| \le Y$ và:
>
> $$
> \|h(xX, yY)\| < \frac{n}{\sqrt{\omega}}
> $$
>
> Khi đó $h(x_0, y_0) = 0$ đúng trên $\mathbb{Z}$.

**Proof.** Đây là bổ đề chính của bài. Ta có:

$$
\begin{aligned}
|h(x_0, y_0)| &= \left|\sum_{i,j} h_{ij} x_0^i y_0^j\right| = \left|\sum_{i,j} h_{ij} X^i Y^j \cdot \left(\frac{x_0}{X}\right)^i \left(\frac{y_0}{Y}\right)^j\right| \\
&\le \sum_{i,j} \left|h_{ij} X^i Y^j\right| \cdot \underbrace{\left|\frac{x_0}{X}\right|^i}_{\le 1} \cdot \underbrace{\left|\frac{y_0}{Y}\right|^j}_{\le 1} \\
&\le \sum_{i,j} |h_{ij} X^i Y^j| \le \sqrt{\omega} \cdot \|h(xX, yY)\| < n
\end{aligned}
$$

Bước cuối dùng Cauchy-Schwarz: $\sum |c_i| \le \sqrt{\omega} \cdot \sqrt{\sum |c_i|^2}$. Vì $h(x_0, y_0) \equiv 0 \pmod{n}$ và $|h(x_0, y_0)| < n$, nên $h(x_0, y_0) = 0$. $\blacksquare$

**Ý nghĩa trong thuật toán:** Sau khi áp dụng LLL trên lattice $L_2$, ta thu được vector ngắn nhất $b_1$ tương ứng với đa thức $h(x,y)$. Lemma 2 đảm bảo: nếu $\|b_1\| = \|h(xX,yY)\|$ đủ nhỏ (so với $n/\sqrt{\omega}$), thì $h(x_0,y_0) = 0$ đúng trên $\mathbb{Z}$, không chỉ mod $n$. Điều kiện này cụ thể là bất đẳng thức (5) trong §3 — được phân tích trong [[02-algorithm-construction|Lesson 02]].

---

## 6. Bài Toán Cần Giải

Từ nay về sau, ta làm việc với bài toán sau:

> [!note] Problem Statement
> **Input**: Đa thức không khả quy $p(x,y) \in \mathbb{Z}[x,y]$ bậc tối đa $\delta$ trong mỗi biến; bounds $X, Y > 0$.  
> **Output**: Tất cả cặp $(x_0, y_0) \in \mathbb{Z}^2$ thỏa $p(x_0, y_0) = 0$, $|x_0| \le X$, $|y_0| \le Y$.  
> **Điều kiện đủ** (Theorem 2 sẽ chứng minh): Thuật toán hiệu quả khi $XY < W^{2/(3\delta)}$, trong đó $W = \max_{i,j} |p_{i,j}| X^i Y^j$.

Giả thiết $p(x,y)$ **không khả quy** (irreducible over $\mathbb{Z}$) là thiết yếu: nó đảm bảo rằng khi LLL cho ra đa thức $h(x,y)$ không phải bội của $p(x,y)$, hai đa thức này **algebraically independent** và ta có thể lấy resultant để đưa về phương trình một biến.

> [!tip] 💡 Agent note
> Điều kiện $XY < W^{2/(3\delta)}$ có thể đọc là: **tích hai bounds phải đủ nhỏ so với norm của đa thức**. Ví dụ, với RSA factoring (Theorem 4): $N = pq$, biết $N^{1/4}$ bits cao nhất của $p$, thì $X = Y = N^{1/4}$ và $XY = N^{1/2}$ trong khi $W^{2/3} \approx N^{1/3} \cdot X^{2/3}$. Với $X = N^{1/4}$, hai vế bằng nhau — đây là ngưỡng chính xác mà thuật toán hoạt động.

---

## Summary

- **Coppersmith's bivariate integer theorem** (Định lý 2): nếu $XY < W^{2/(3\delta)}$, tìm nghiệm trong thời gian polynomial — nhưng thuật toán gốc phức tạp.
- **[Cor04]** đơn giản hóa nhưng bị exponential khi tiệm cận ngưỡng chính xác.
- **Paper này**: chọn $n = |\det S|$ tường minh → thu gọn lattice → polynomial-time tại đúng ngưỡng.
- **Nền tảng cần nắm**: LLL bound $\|b_1\| \le 2^{(\omega-1)/4} \det(L)^{1/\omega}$ (Theorem 1); column ops preserve det (Lemma 1); small-norm mod $n$ → over $\mathbb{Z}$ (Lemma 2).

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261, 1982 (🟡 Integrated — Theorem 1)
- [HG97] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, Cryptography and Coding 1997 (🟡 Integrated — Lemma 2)
- [NS05] Nguyen–Stehlé — *Floating-Point LLL Revisited*, Eurocrypt 2005 (🟡 Integrated — L² complexity, dùng trong Lesson 04)
- [Cop96a] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, Eurocrypt 1996 (🔴 Prerequisite)
- [Cop96b] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, Eurocrypt 1996 (🔴 Prerequisite)
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 (🟡 Integrated — Lemma 3 proof, dùng trong Lesson 04)
- [HM91] Hafner–McCurley — *Triangularization of Matrices over Rings*, SIAM 1991 (🟡 Integrated — dùng trong Lesson 04)
