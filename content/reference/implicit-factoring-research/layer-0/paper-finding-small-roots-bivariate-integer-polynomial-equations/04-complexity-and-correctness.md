---
title: "04. Complexity & Correctness"
type: scheme
tags: [coppersmith, lattice, complexity, lemma3, theorem2, lesson-04]
aliases: [Coppersmith Theorem 2, Complexity Analysis]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

> **Prerequisites**: [[03-determinant-computation|03. Determinant Computation]] — đặc biệt $\det L_2$ và điều kiện (9); [[02-algorithm-construction|02. Algorithm Construction]] — construction tổng thể  
> 🔴 **Prerequisite references**: Coppersmith — *Small Solutions to Polynomial Equations* [Cop97] (Lemma 3 gốc)  
> **Lesson type**: Scheme + Deep Dive  
> **Covers**: §3.1 (computing basis of $L_2$); Lemma 3 (bound $|\det S|$); điều kiện (11); Theorem 2 và Theorem 3 (Coppersmith bivariate); running time analysis
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $W$ | $\max_{i,j} \|p_{ij}\| X^i Y^j$ | $W$ |
> | $(u,v)$ | Chỉ số đạt max: $W = \|p_{uv}\| X^u Y^v$ | $(u,v)$ |
> | $\tilde{p}_{ij}$ | $p_{ij} X^i Y^j$ — hệ số đã được scale | $\tilde{p}_{ij}$ |
> | $S'$ | Ma trận adjoint của $S$ (dùng trong §3.1) | $S'$ |
> | $\alpha$ | Exponent trong điều kiện đủ $XY < W^\alpha$ | $\alpha$ |

---

## 1. §3.1 — Computing a Basis of $L_2$

Lesson 02 định nghĩa $L_2$ nhưng chưa nói cách tính cơ sở của nó. Paper mô tả hai cách tương đương.

**Cách 1 — Triangularization trực tiếp** ([HM91]):

Từ phương trình (6) trong Lesson 03:

$$
M_2' = \begin{pmatrix} S & T \\ 0 & T' \\ 0 & nI_\omega \end{pmatrix}
$$

Cơ sở của $L_2'$ thu được bằng cách triangularize ma trận $\begin{pmatrix} T' \\ nI_\omega \end{pmatrix}$ (kích thước $(k^2 + \omega) \times \omega$). Điều này yêu cầu tính $S'$ (adjoint của $S$) thỏa $S' \cdot S = nI_{k^2}$ — được implement trong **Shoup's NTL library** [Sho].

> [!info] 🟡 Tích hợp từ [HM91]: Hafner–McCurley — *Triangularization of Matrices over Rings*, SIAM 1991
>
> Với ma trận $m \times n$ có entries bị chặn bởi $B$, thuật toán triangularization chạy trong thời gian $O(n^{3+\varepsilon} m \log^{1+\varepsilon} B)$ với $\varepsilon > 0$ bất kỳ.

**Cách 2 — Hermite Normal Form (HNF)**:

Ma trận $m \times n$ rank $n$ có **Hermite Normal Form (HNF)** duy nhất: ma trận tam giác trên $H$ với $H_{ii} > 0$ và $0 \le H_{ij} < H_{jj}$ cho $i < j$. Tồn tại ma trận unimodular $U$ ($m \times m$) sao cho $U \cdot M = \begin{pmatrix} H \\ 0 \end{pmatrix}$. HNF cũng được implement trong NTL.

> [!tip] 💡 Agent note
> Trong thực tế, paper ghi chú rằng LLL trong NTL nhận input tốt hơn khi được cung cấp **lattice basis** (ma trận $\omega \times \omega$) thay vì ma trận chữ nhật $m \times \omega$ với $m > \omega$. Do đó bước triangularization / HNF là cần thiết trước khi gọi LLL.

---

## 2. Lemma 3 — Bound $|\det S|$

Đây là bổ đề kỹ thuật cốt lõi: nó liên kết $n = |\det S|$ với $W$ và $(X^{i_0}Y^{j_0})$. Proof đầy đủ nằm trong [[a1-proof-lemma3|A1. Proof of Lemma 3]]; ở đây trình bày statement và proof sketch.

> [!abstract] Lemma 3 (Coron 2007, §3; cf. Lemma 3 trong [Cop97])
> Cho $(u,v)$ thỏa $W = |p_{uv}|X^uY^v$. Gọi $(i_0,j_0)$ là chỉ số maximize:
>
> $$
> 8^{(i-u)^2+(j-v)^2} \cdot |p_{ij}|X^iY^j
> $$
>
> Khi đó:
>
> $$
> \left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} \!\! 2^{-6k^2\delta^2 - 2k^2} \;\le\; |\det S| \;\le\; \left(\frac{W}{X^{i_0}Y^{j_0}}\right)^{k^2} \!\! 2^{k^2}
> $$

**Proof sketch** (xem [[a1-proof-lemma3|A1]] để có proof đầy đủ):

Ta chuẩn hóa $S$ về ma trận $S'$ (khác với adjoint — đây là ma trận $S$ nhân với scaling factors). Cụ thể, nhân cột $\mu(i,j)$ với $8^{2(i_0-u)i+2(j_0-v)j} X^{i_0+i}Y^{j_0+j}$ và nhân hàng $\mu(a,b)$ với $8^{-2(i_0-u)a-2(j_0-v)b}X^{-a}Y^{-b}$. Phần tử $(a,b),(i,j)$ của $S'$ là:

$$
S'_{\mu(a,b),\mu(i,j)} = \tilde{p}_{i_0+i-a,\;j_0+j-b} \cdot 8^{2(i_0-u)(i-a)+2(j_0-v)(j-b)}
$$

Từ tính tối ưu của $(i_0,j_0)$, ta chứng minh $S'$ là **diagonally dominant**: phần tử đường chéo $= \tilde{p}_{i_0,j_0}$ trong khi tổng trị tuyệt đối off-diagonal trong mỗi hàng $\le \frac{3}{4}|\tilde{p}_{i_0,j_0}|$.

Suy ra: mỗi eigenvalue $\lambda$ của $S'$ thỏa $\frac{1}{4}|\tilde{p}_{i_0,j_0}| \le |\lambda| \le \frac{7}{4}|\tilde{p}_{i_0,j_0}|$, dẫn đến:

$$
|\tilde{p}_{i_0,j_0}|^{k^2} 2^{-2k^2} \le |\det S'| \le |\tilde{p}_{i_0,j_0}|^{k^2} 2^{k^2}
$$

Từ tính tối ưu: $8^{(i_0-u)^2+(j_0-v)^2}|\tilde{p}_{i_0,j_0}| \ge W$, suy ra $8^{-2\delta^2}W \le |\tilde{p}_{i_0,j_0}| \le W$.

Kết hợp với quan hệ $\det S = \det S' / (X^{i_0}Y^{j_0})^{k^2}$ ta thu được Lemma 3. $\blacksquare$

---

## 3. Điều Kiện Đủ: Từ (9) về (11)

Từ điều kiện (9) (Lesson 03) và bound Lemma 3, thay $n = |\det S| \ge (W/X^{i_0}Y^{j_0})^{k^2} \cdot 2^{-6k^2\delta^2-2k^2}$, đồng thời dùng $\sqrt{\omega} \le 2^{\omega/2}$:

$$
2^{\omega(\omega-1)/4} \cdot \frac{(XY)^{(k+\delta-1)(k+\delta)^2/2\;-\;(k-1)k^2/2}}{(X^{i_0}Y^{j_0})^{k^2}} \le W^{k^2} \cdot 2^{-6k^2\delta^2-2k^2} \cdot 2^{-\omega^2/2}
$$

Điều kiện này được thỏa nếu:

$$
XY < W^\alpha \cdot 2^{-9\delta}
$$

trong đó:

$$
\alpha = \frac{2k^2}{\delta \cdot (3k^2 + k(3\delta-2) + \delta^2 - \delta)}
$$

Khi $k \to \infty$, $\alpha \to \frac{2k^2}{3\delta k^2} = \frac{2}{3\delta}$. Cụ thể hơn, với $k$ hữu hạn:

$$
\boxed{XY < W^{2/(3\delta) - 1/k} \cdot 2^{-9\delta}} \tag{11}
$$

> [!tip] 💡 Agent note
> Điều kiện (11) có hai tham số: $k$ (kích thước lattice) và ngưỡng $W^{2/(3\delta)-1/k}$. Khi $k$ tăng, điều kiện trở nên **dễ thỏa hơn** (tiến tới $W^{2/(3\delta)}$) nhưng lattice lớn hơn (chi phí tính toán tăng). Đây là trade-off cốt lõi của thuật toán.

---

## 4. Theorem 2 — Coppersmith Bivariate (Phiên Bản Đầy Đủ)

Để đạt điều kiện chính xác $XY < W^{2/(3\delta)}$ (không có $-1/k$), paper dùng kỹ thuật **exhaustive search trên $O(\delta)$ bits cao** của $x_0$:

Đặt $k = \lfloor \log W \rfloor$. Khi đó $1/k \approx 1/\log W \approx 0$ và điều kiện (11) tiến về $W^{2/(3\delta)}$. Tuy nhiên ta cần exhaustive search trên $O(\delta)$ bits chưa biết của $x_0$, tốn thêm factor $2^\delta$ — vẫn polynomial trong $2^\delta$ và $\log W$.

> [!abstract] Theorem 2 (Coppersmith Bivariate Integer — Coron 2007, §3)
> Cho $p(x,y)$ là đa thức không khả quy trên $\mathbb{Z}$, bậc tối đa $\delta$ trong mỗi biến. Cho $X, Y$ là bounds và $W = \max_{i,j} |p_{ij}| X^i Y^j$.
>
> Nếu $XY < W^{2/(3\delta)}$, thì trong thời gian polynomial trong $(\log W,\; 2^\delta)$, có thể tìm tất cả cặp nguyên $(x_0, y_0)$ thỏa $p(x_0,y_0) = 0$, $|x_0| \le X$, $|y_0| \le Y$.

**Proof.** Đặt $k = \lfloor \log W \rfloor$. Áp dụng thuật toán của Lesson 02 với tham số này. Vì $1/k \to 0$, điều kiện (11) được thỏa với $O(\delta)$ bits cao của $x_0$ không biết — exhaustive search trên $2^\delta$ khả năng. Với mỗi giả thiết về bits cao, thuật toán chạy trong thời gian polynomial. $\blacksquare$

> [!abstract] Theorem 3 (Coppersmith — total degree version)
> Với giả thiết của Theorem 2, nhưng $p(x,y)$ có **tổng bậc** (total degree) $\delta$ (thay vì bậc riêng lẻ trong mỗi biến), bound trở thành:
>
> $$
> XY < W^{1/\delta}
> $$

**Proof.** Xem full version của paper. Ý tưởng: với total degree $\delta$, số monomial ít hơn → lattice nhỏ hơn → bound tốt hơn. $\blacksquare$

> [!tip] 💡 Agent note
> Theorem 3 (total degree) có bound **chặt hơn** Theorem 2 (per-variable degree): $W^{1/\delta} > W^{2/(3\delta)}$ vì $1/\delta > 2/(3\delta)$. Điều này đúng lý vì đa thức với total degree $\delta$ có ít monomial hơn → lattice dễ reduce hơn.

---

## 5. Phân Tích Running Time

**Bước bottleneck**: Chạy LLL trên lattice $L_2$ chiều $\omega = \delta^2 + 2k\delta$.

**Bound trên entries của $L_2$**: Các entries của cơ sở $L_2$ có thể reduce modulo $n \cdot X^iY^j$ trên cột tương ứng với monomial $x^iy^j$ (nhờ $r_{ij}(xX,yY) = nX^iY^j \cdot x^iy^j$). Do đó entries bị chặn bởi $O(nX^{\delta+k}Y^{\delta+k})$.

Từ Lemma 3: $n = O(W^{k^2})$. Từ điều kiện (11): $n \cdot X^{\delta+k}Y^{\delta+k} = O(W^{k^2})$. Vậy entries bị chặn bởi $B = O(W^{k^2})$.

Áp dụng Theorem 1 (LLL complexity $O(\omega^5 n \log^3 B)$ với $n = (k+\delta)^2$ cột):

$$
\text{Running time} = O\!\left(\delta^6 k^{12} \log^3 W\right) \quad \text{dùng LLL [LLL82]}
$$

$$
\text{Running time} = O\!\left(\delta^5 k^9 \log^2 W\right) \quad \text{dùng L}^2 \text{ [NS05]}
$$

> [!info] 🟡 Tích hợp từ [NS05]: Nguyen–Stehlé — *Floating-Point LLL Revisited*, Eurocrypt 2005
>
> L² algorithm đạt cùng bound $\|b_1\| \le 2^{(\omega-1)/4}\det(L)^{1/\omega}$ nhưng trong thời gian $O(\omega^4 n(\omega + \log B)\log B)$ — cải tiến so với $O(\omega^5 n \log^3 B)$ của LLL cổ điển. Với $\omega = O(k\delta)$ và $\log B = O(k^2 \log W)$, L² cho $O(\delta^5 k^9 \log^2 W)$.

**Dưới điều kiện yếu hơn** $XY < W^{2/(3\delta)}$ với $k = \lfloor \log W \rfloor$, running time (với $\delta$ cố định) là:

$$
O(\log^{15} W) \quad \text{dùng LLL}; \qquad O(\log^{11} W) \quad \text{dùng L}^2
$$

> [!abstract] Summary — Complexity of CoronBivariateRoots
>
> | Điều kiện | $k$ | Running time (LLL) | Running time (L²) |
> |-----------|-----|--------------------|-------------------|
> | $XY < W^{2/(3\delta)-1/k} \cdot 2^{-9\delta}$ | fixed | $O(\delta^6 k^{12} \log^3 W)$ | $O(\delta^5 k^9 \log^2 W)$ |
> | $XY < W^{2/(3\delta)}$ | $\lfloor\log W\rfloor$ | $O(\log^{15} W)$ | $O(\log^{11} W)$ |

---

## Summary

- **§3.1**: Cơ sở của $L_2$ thu từ triangularization / HNF của $M_2'$; adjoint $S'$ tính được trong NTL.
- **Lemma 3**: $|\det S| = n$ nằm giữa $(W/X^{i_0}Y^{j_0})^{k^2} \cdot 2^{-6k^2\delta^2-2k^2}$ và $(W/X^{i_0}Y^{j_0})^{k^2} \cdot 2^{k^2}$ — chứng minh qua ma trận diagonally dominant.
- **Condition (11)**: $XY < W^{2/(3\delta)-1/k} \cdot 2^{-9\delta}$ là điều kiện đủ để HG lemma áp dụng.
- **Theorem 2**: Dưới $XY < W^{2/(3\delta)}$, thuật toán polynomial trong $(\log W, 2^\delta)$.
- **Theorem 3**: Total degree $\delta$ cho bound tốt hơn: $XY < W^{1/\delta}$.
- **Running time**: $O(\log^{15} W)$ với LLL; $O(\log^{11} W)$ với L² — **polynomial** (khác với [Cor04] là sub-exponential).

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, 1982 (🟡 Integrated — Theorem 1, complexity)
- [NS05] Nguyen–Stehlé — *Floating-Point LLL Revisited*, Eurocrypt 2005 (🟡 Integrated — L² complexity)
- [HM91] Hafner–McCurley — *Triangularization of Matrices over Rings*, SIAM 1991 (🟡 Integrated — triangularization complexity)
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 (🟡 Integrated — Lemma 3 proof structure)
- [Sho] Shoup — *NTL library* (⚪ implementation tool)
