---
title: "02. Building the Lattice: Univariate Modular Case"
type: deep-dive
tags: [coppersmith, lattice, matrix-construction, univariate, lesson-02]
aliases: [Coppersmith Matrix, Univariate Lattice Construction]
source: "Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities — Don Coppersmith, 1997"
created: 2026-03-26
---

> **Prerequisites**: [[01-lattice-reduction-motivation|01. Lattice Reduction & Motivation]] (Lemma 1, heuristic motivation, ý tưởng dùng nhiều quan hệ $q_{ij}$)  
> 🔴 **Prerequisite references**: [LLL82] LLL algorithm  
> **Lesson type**: Deep Dive  
> **Covers**: §4 (Building the Matrix: Univariate Modular Case) — toàn bộ
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $h$ | Tham số kích thước lattice, điều khiển số hàng ma trận | $h$ |
> | $q_{ij}(x)$ | Đa thức helper: $x^i \cdot p(x)^j$ | $q_{ij}$ |
> | $\gamma(i,j)$ | Hàm đánh chỉ số cột phải: $h\delta + i + (j-1)\delta$ | $\gamma(i,j)$ |
> | $\tau$ | Xấp xỉ $X^{-g}/\sqrt{h\delta}$, dùng trong diagonal block trái | $\tau$ |
> | $\hat{M}$ | Sub-lattice: $M \cap (\mathbb{R}^{h\delta} \times \{0\}^{h\delta-\delta})$ | $\hat{M}$ |
> | $\tilde{M}$ | Ma trận sau row operations, lower-right block = identity | $\tilde{M}$ |
> | $y_0$ | Số nguyên thỏa $p(x_0) = y_0 N$ | $y_0$ |

---

## 1. Bối cảnh và mục tiêu

Đây là phần kỹ thuật trung tâm của phương pháp Coppersmith cho bài toán univariate modular. Ta đang ở vị trí:

- Có đa thức monic bậc $\delta$: $p(x) = x^\delta + p_{\delta-1}x^{\delta-1} + \cdots + p_0$
- Cần tìm $x_0$ thỏa $p(x_0) \equiv 0 \pmod{N}$ với $\lvert x_0 \rvert < \frac{1}{2}N^{1/\delta - \varepsilon}$
- Ý tưởng: dùng họ đa thức $q_{ij}(x) = x^i p(x)^j$ để xây lattice chứa một vector ngắn liên quan đến $x_0$

Nhiệm vụ của §4: xây dựng **tường minh** ma trận $M$ của lattice này.

---

## 2. Chọn tham số $h$

Toàn bộ construction phụ thuộc vào một tham số nguyên $h$, được chọn thỏa **hai điều kiện**:

$$
h \geq \max\!\left(\frac{\delta - 1 + \varepsilon\delta}{\varepsilon\delta^2},\; \frac{7}{\delta}\right)
$$

**Điều kiện 1** đảm bảo:

$$
\frac{h-1}{h\delta - 1} \geq \frac{1}{\delta} - \varepsilon
$$

Đây là điều kiện cần để det của $\hat{M}$ đủ lớn (xem §5 — phân tích determinant trong Lesson 03).

**Điều kiện 2** đảm bảo $h\delta \geq 7$, một điều kiện kỹ thuật đảm bảo hệ số $2^{-(n-1)/4}$ từ Lemma 1 được triệt tiêu bởi $(h\delta)^{-1/(h\delta-1)}$.

> [!tip] 💡 Agent note
> Trong thực hành (và trong Theorem 1 của paper), người ta chọn $\varepsilon$ trước rồi tính $h$ tối thiểu. Với $\varepsilon = 1/\log N$ (dùng trong Corollary 1), $h = O(\delta/\varepsilon) = O(\delta \log N)$, kích thước ma trận là $O(\delta^2 \log N)$ — vẫn polynomial.

---

## 3. Họ đa thức helper $q_{ij}$

Với mỗi cặp $(i, j)$ thỏa $0 \leq i < \delta$ và $1 \leq j < h$, định nghĩa:

$$
q_{ij}(x) = x^i \cdot p(x)^j
$$

**Tính chất then chốt**: Vì $p(x_0) = y_0 N$ với $y_0 \in \mathbb{Z}$, nên:

$$
q_{ij}(x_0) = x_0^i \cdot p(x_0)^j = x_0^i \cdot (y_0 N)^j \equiv 0 \pmod{N^j}
$$

Mỗi $q_{ij}$ cho ta một **quan hệ modulo $N^j$** — và điều quan trọng là modulus tăng theo $j$, không cố định ở $N$. Đây chính là nguồn gốc của các nhân tử $N^j$ trong det mà §5 sẽ khai thác.

Số cặp $(i,j)$: $\delta \times (h-1)$ cặp, sinh ra $\delta(h-1)$ quan hệ.

---

## 4. Xây ma trận $M$

Ma trận $M$ có kích thước $(2h\delta - \delta) \times (2h\delta - \delta)$ với cấu trúc **block** như sau.

### 4.1 Đánh chỉ số

- **Chỉ số hàng/cột trái** (left block): $g = 0, 1, \ldots, h\delta - 1$ — đại diện cho lũy thừa $x^g$
- **Chỉ số cột phải** (right block): $\gamma(i,j) = h\delta + i + (j-1)\delta$ với $0 \leq i < \delta$, $1 \leq j < h$, nên $h\delta \leq \gamma(i,j) < 2h\delta - \delta$

### 4.2 Bốn block của $M$

> [!note] Scheme 4.1 — Coppersmith Matrix $M$ (Univariate Modular Case)
> **Type**: Lattice Matrix Construction  
> **Setting**: Đa thức $p(x)$ monic bậc $\delta$, modulus $N$, cận $X = \frac{1}{2}N^{1/\delta - \varepsilon}$, tham số $h$
>
> **$\mathsf{BuildMatrix}(p,\, N,\, X,\, h)$**
> - Input: $p(x)$, $N$, $X$, $h$ (thỏa điều kiện ở §2)
> - Tính các đa thức $q_{ij}(x) = x^i p(x)^j$ cho mọi $0 \leq i < \delta$, $1 \leq j < h$
> - Xây ma trận $M$ kích thước $(2h\delta - \delta) \times (2h\delta - \delta)$ với 4 block:
>
> **Block 1 — Upper-left** $(h\delta \times h\delta)$, diagonal:
>
> $$
> M_{g,g} = \frac{X^{-g}}{\sqrt{h\delta}}, \quad g = 0, 1, \ldots, h\delta-1
> $$
>
> **Block 2 — Upper-right** $(h\delta \times (h\delta - \delta))$:
>
> $$
> M_{g,\, \gamma(i,j)} = [x^g]\, q_{ij}(x)
> $$
>
> (hệ số của $x^g$ trong đa thức $q_{ij}(x)$)
>
> **Block 3 — Lower-left** $((h\delta-\delta) \times h\delta)$: ma trận **zero**
>
> **Block 4 — Lower-right** $((h\delta-\delta) \times (h\delta-\delta))$, diagonal:
>
> $$
> M_{\gamma(i,j),\, \gamma(i,j)} = N^j
> $$
>
> - Output: Ma trận $M$ hữu tỉ kích thước $(2h\delta-\delta)^2$

### 4.3 Ví dụ: $h = 3$, $\delta = 2$

Paper cho ví dụ tường minh với $p(x) = x^2 + ax + b$ và $p(x)^2 = x^4 + cx^3 + dx^2 + ex + f$. Viết $\tau = X^{-g}/\sqrt{h\delta}$ (gộp lại cho gọn):

$$
M = \begin{pmatrix}
\tau & 0 & 0 & 0 & 0 & 0 & b & 0 & f & 0 \\
0 & \tau X^{-1} & 0 & 0 & 0 & 0 & a & b & e & f \\
0 & 0 & \tau X^{-2} & 0 & 0 & 0 & 1 & a & d & e \\
0 & 0 & 0 & \tau X^{-3} & 0 & 0 & 0 & 1 & c & d \\
0 & 0 & 0 & 0 & \tau X^{-4} & 0 & 0 & 0 & 1 & c \\
0 & 0 & 0 & 0 & 0 & \tau X^{-5} & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N^2 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N^2
\end{pmatrix}
$$

- 6 hàng đầu: $h\delta = 6$ hàng của block trái (diagonal $\tau X^{-g}$) và block phải (hệ số $q_{ij}$)
- 4 hàng cuối: $h\delta - \delta = 4$ hàng của lower-right block diagonal ($N^1, N^1, N^2, N^2$)

---

## 5. Vector $\mathbf{r}$ và tích $\mathbf{s} = \mathbf{r}M$

Định nghĩa vector hàng $\mathbf{r}$ kích thước $2h\delta - \delta$:

$$
r_g = x_0^g \quad (g = 0, 1, \ldots, h\delta-1)
$$

$$
r_{\gamma(i,j)} = -x_0^i y_0^j \quad (0 \leq i < \delta,\; 1 \leq j < h)
$$

Tính $\mathbf{s} = \mathbf{r}M$:

**Phần trái** (chỉ số $g$):

$$
s_g = \frac{(x_0/X)^g}{\sqrt{h\delta}}
$$

**Phần phải** (chỉ số $\gamma(i,j)$):

$$
s_{\gamma(i,j)} = q_{ij}(x_0) - x_0^i y_0^j N^j = x_0^i p(x_0)^j - x_0^i (y_0 N)^j = 0
$$

Vì $p(x_0) = y_0 N$ nên $p(x_0)^j = y_0^j N^j$, và phần phải triệt tiêu hoàn toàn.

**Norm của $\mathbf{s}$:**

$$
\lvert\mathbf{s}\rvert = \left[\sum_{g=0}^{h\delta-1} \left(\frac{x_0/X}{\sqrt{h\delta}}\right)^{2g}\right]^{1/2} < \left[\sum_{g=0}^{h\delta-1} \frac{1}{h\delta}\right]^{1/2} = 1
$$

vì $\lvert x_0 \rvert < X$ nên $\lvert x_0/X \rvert < 1$.

> [!abstract] Kết luận Bước 4
> $\mathbf{s} = \mathbf{r}M$ là một phần tử của lattice sinh bởi các hàng của $M$ với $\lvert\mathbf{s}\rvert < 1$. Phần phải của $\mathbf{s}$ bằng $0$ hoàn toàn.

---

## 6. Thu gọn về Sub-Lattice $\hat{M}$

Vì $h\delta - \delta$ thành phần phải của $\mathbf{s}$ đều bằng 0, ta chỉ cần quan tâm đến **sub-lattice**:

$$
\hat{L} = L(M) \cap \left(\mathbb{R}^{h\delta} \times \{0\}^{h\delta-\delta}\right)
$$

**Làm thế nào để compute $\hat{L}$ tường minh?** Nhận xét quan trọng: vì $p(x)$ và $q_{ij}(x)$ đều là đa thức monic, $h\delta - \delta$ hàng nào đó của block upper-right tạo thành ma trận tam giác trên với $1$ trên đường chéo. Điều này cho phép thực hiện **row operations** trên $M$ để tạo $\tilde{M}$:

$$
\tilde{M} = \begin{pmatrix} \hat{M} & 0 \\ * & I_{h\delta-\delta} \end{pmatrix}
$$

Block lower-right của $\tilde{M}$ là ma trận đơn vị $I$, block upper-right là $0$.

**Block upper-left** $\hat{M}$ (kích thước $h\delta \times h\delta$) **chính là ma trận của sub-lattice** mà ta cần LLL reduce. Mọi phần tử của $\hat{L}$ tương ứng với một hàng của $\hat{M}$.

> [!tip] 💡 Agent note
> Row operations trên $M$ không thay đổi det: $\det(\tilde{M}) = \det(M)$. Vì $\tilde{M}$ block lower-right là $I$, nên $\det(\hat{M}) = \det(M)$. Đây là điểm quan trọng cho phân tích determinant ở §5 (Lesson 03).

---

## 7. Tóm tắt cấu trúc: tại sao mỗi block làm điều nó làm

| Block | Vai trò |
|-------|---------|
| **Upper-left diagonal** $X^{-g}/\sqrt{h\delta}$ | Scale các thành phần $x_0^g$ về $[0,1]$ → norm của $\mathbf{s}$ nhỏ hơn 1 |
| **Upper-right** (hệ số $q_{ij}$) | Mã hóa quan hệ $q_{ij}(x_0) \equiv 0 \pmod{N^j}$ |
| **Lower-right diagonal** $N^j$ | Đảm bảo phần phải của $\mathbf{s}$ triệt tiêu khi nhân $\mathbf{r}$ với $M$ |
| **Lower-left zero** | Tách hai phần của lattice; cho phép row reduction về $\hat{M}$ |

---

## Summary

- Xây ma trận $M$ kích thước $(2h\delta - \delta)^2$ với 4 block, trong đó block upper-right chứa hệ số các đa thức $q_{ij}(x) = x^i p(x)^j$.
- Vector $\mathbf{r}$ với thành phần $r_g = x_0^g$ và $r_{\gamma(i,j)} = -x_0^i y_0^j$ sinh ra $\mathbf{s} = \mathbf{r}M$ với $\lvert\mathbf{s}\rvert < 1$ và phần phải bằng $0$.
- Row operations rút gọn $M$ về $\tilde{M}$; block upper-left $\hat{M}$ ($h\delta \times h\delta$) là lattice thực sự cần LLL reduce.
- $\mathbf{s}$ là phần tử ngắn của $\hat{M}$ — áp dụng Lemma 1 sẽ giam $\mathbf{s}$ vào một siêu phẳng → đa thức $C(x)$ trên $\mathbb{Z}$ (Lesson 03).

---

## References

- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997, §4
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, 1982 (🔴 Prerequisite)
