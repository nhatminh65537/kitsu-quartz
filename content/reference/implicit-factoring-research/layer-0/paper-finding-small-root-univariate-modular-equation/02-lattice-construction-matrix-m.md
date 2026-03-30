---
title: "02. Lattice Construction: Matrix M"
type: math-component
tags: [coppersmith, lattice, math-component, lesson-02]
aliases: [Coppersmith Matrix, Matrix M Construction]
source: "Finding a Small Root of a Univariate Modular Equation — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[01-problem-formulation|01. Problem Formulation & Strategy]]; LLL lattice basis reduction [LLL82]; polynomial algebra cơ bản  
> 🔴 **Prerequisite references**: Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients* [LLL82]  
> **Lesson type**: Math Component  
> **Covers**: §2 — phần xây dựng matrix $M$: họ đa thức $q_{ij}$, tham số $h$, cấu trúc 4 block của $M$, minh hoạ $h=3, k=2$, tính định thức, vector ngắn $\mathbf{r}$
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $h$ | Tham số điều khiển số lượng đa thức helper | $h$ |
> | $q_{ij}(x)$ | Đa thức helper $x^i p(x)^j$ | $q_{ij}(z)$ |
> | $y_0$ | Thương $p(x_0)/N$ (nguyên) | $y_0$ |
> | $\gamma(i,j)$ | Hàm index cột: $hk + i + (j-1)k$ | $\gamma(i,j)$ |
> | $X$ | Giới hạn trên $\frac{1}{2}N^{(1/k)-\varepsilon}$ | $X$ |
> | $\delta$ | Ký hiệu rút gọn $1/\sqrt{hk}$ (trong minh hoạ) | $\delta$ |
> | $M$ | Ma trận lattice kích thước $(2hk-k) \times (2hk-k)$ | $M$ |
> | $n$ | Chiều lattice chính $n = hk$ | $n$ (dùng từ Lesson 03) |

---

## Motivation

Sau khi đặt bài toán tại [[01-problem-formulation|Lesson 01]], câu hỏi then chốt là: làm thế nào để biến điều kiện $p(x_0) \equiv 0 \pmod{N}$ thành một đẳng thức trên $\mathbb{Z}$?

Ý tưởng là tạo ra **nhiều phương trình modular độc lập** cùng triệt tiêu tại $x_0$, mỗi phương trình với lũy thừa moduli cao hơn. Sau đó gộp chúng vào một ma trận lattice sao cho vector ứng với $x_0$ có chuẩn Euclidean đủ nhỏ. Khi LLL basis reduction tìm được toàn bộ các vector ngắn, ta trích ra một phương trình nguyên về $x_0$.

Lesson này xây dựng chi tiết ma trận $M$ đó — đây là trái tim kỹ thuật của toàn bộ paper.

---

## Họ Đa Thức Helper $q_{ij}$

Cho $p(x_0) \equiv 0 \pmod{N}$, đặt

$$
y_0 = \frac{p(x_0)}{N} \in \mathbb{Z}
$$

Đây là số nguyên vì $p(x_0)$ là bội số của $N$ theo giả thiết.

> [!note] Definition 2.1 — Họ đa thức $q_{ij}$
> Với mỗi cặp $(i, j)$ thoả $0 \leq i < k$, $1 \leq j < h$, định nghĩa:
>
> $$
> q_{ij}(x) = x^i \cdot p(x)^j
> $$
>
> **Tính chất quan trọng**: Tại nghiệm $x_0$,
>
> $$
> q_{ij}(x_0) = x_0^i \cdot p(x_0)^j = x_0^i \cdot (y_0 N)^j = x_0^i y_0^j N^j
> $$
>
> Do đó $q_{ij}(x_0) \equiv 0 \pmod{N^j}$ với mọi $j \geq 1$.

Điều này cho ta $(k-1)(h-1)$ phương trình modular, mỗi phương trình triệt tiêu tại $x_0$ theo $N^j$ với $j$ ngày càng lớn.

> [!tip] 💡 Agent note
> Ý tưởng "nâng lũy thừa moduli" ($N \to N^2 \to \cdots \to N^{h-1}$) là điểm then chốt phân biệt Coppersmith với Vallée et al. [VGT88]. Vallée et al. chỉ dùng $j=1$ (tức $q_{01}(x) = p(x)$ duy nhất), trong khi Coppersmith dùng toàn bộ họ $q_{ij}$ — đây là nguyên nhân trực tiếp dẫn đến cải thiện bound từ $N^{2/[k(k+1)]}$ lên $N^{1/k}$ (chi tiết ở [[03-lll-analysis-correctness|Lesson 03]]).

---

## Chọn Tham Số $h$

Tham số $h$ điều khiển số lượng đa thức helper và kích thước lattice. Coppersmith chọn:

$$
h \geq \max\!\left\{\frac{7}{k},\ \frac{k + \varepsilon k - 1}{\varepsilon k^2}\right\} \approx \frac{1}{k\varepsilon}
$$

sao cho đồng thời thoả mãn hai điều kiện:

$$
h - 1 \geq (hk-1)\!\left(\frac{1}{k} - \varepsilon\right) \qquad \text{và} \qquad hk \geq 7
$$

Điều kiện thứ nhất đảm bảo định thức của $M$ đủ lớn (cần cho phân tích LLL ở Lesson 03). Điều kiện $hk \geq 7$ là ràng buộc kỹ thuật trong bước tính $\det(M)$ để đảm bảo $hk < 2^{(hk-1)/2}$.

---

## Cấu Trúc Ma Trận $M$

Ma trận $M$ có kích thước $(2hk-k) \times (2hk-k)$. Các cột được chia làm hai nhóm:

- **Nhóm trái** (cột $0, 1, \ldots, hk-1$): ứng với các luỹ thừa $x^0, x^1, \ldots, x^{hk-1}$
- **Nhóm phải** (cột $\gamma(i,j)$): ứng với các đa thức $q_{ij}$, với hàm index

$$
\gamma(i,j) = hk + i + (j-1)k, \quad 0 \leq i < k,\ 1 \leq j < h
$$

nên $hk \leq \gamma(i,j) < 2hk - k$.

$M$ được chia thành **4 block**:

> [!note] Definition 2.2 — Cấu trúc 4 block của ma trận $M$
>
> **Block trên-trái** $hk \times hk$ (diagonal):
>
> $$
> M[g,g] = \frac{X^{-g}}{\sqrt{hk}}, \quad 0 \leq g < hk
> $$
>
> Đây là ma trận đường chéo scale các cột trái theo $X^{-g}/\sqrt{hk}$, để vector ứng với $(x_0^0, x_0^1, \ldots, x_0^{hk-1})$ có chuẩn $< 1$ khi $|x_0| \leq X$.
>
> **Block trên-phải** $hk \times (hk-k)$:
>
> $$
> M[g, \gamma(i,j)] = [x^g]\, q_{ij}(x)
> $$
>
> tức là hệ số của $x^g$ trong $q_{ij}(x)$.
>
> **Block dưới-phải** $(hk-k) \times (hk-k)$ (diagonal):
>
> $$
> M[\gamma(i,j),\, \gamma(i,j)] = N^j
> $$
>
> **Block dưới-trái** $(hk-k) \times hk$: ma trận không.

---

## Minh Hoạ: $h = 3$, $k = 2$

Với $h=3, k=2$: ta có $q_{01} = p(x)$, $q_{11} = xp(x)$, $q_{02} = p(x)^2$, $q_{12} = xp(x)^2$. Đặt $p(x) = x^2 + ax + b$ và $p(x)^2 = x^4 + cx^3 + dx^2 + ex + f$.

Kích thước ma trận: $(2\cdot3\cdot2 - 2) \times (2\cdot3\cdot2 - 2) = 10 \times 10$.

Dùng ký hiệu $\delta = 1/\sqrt{hk} = 1/\sqrt{6}$:

$$
M = \begin{pmatrix}
\delta & 0 & 0 & 0 & 0 & 0 & b & 0 & f & 0 \\
0 & \delta X^{-1} & 0 & 0 & 0 & 0 & a & b & e & f \\
0 & 0 & \delta X^{-2} & 0 & 0 & 0 & 1 & a & d & e \\
0 & 0 & 0 & \delta X^{-3} & 0 & 0 & 0 & 1 & c & d \\
0 & 0 & 0 & 0 & \delta X^{-4} & 0 & 0 & 0 & 1 & c \\
0 & 0 & 0 & 0 & 0 & \delta X^{-5} & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & N & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N^2 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & N^2
\end{pmatrix}
$$

6 hàng đầu tương ứng với 6 luỹ thừa $x^0, \ldots, x^5$ (block trên); 4 hàng sau tương ứng với 4 đa thức $q_{01}, q_{11}, q_{02}, q_{12}$ (block dưới).

> [!tip] 💡 Agent note
> Cột 6 (index $\gamma(0,1)=6$) chứa hệ số của $q_{01}(x) = p(x) = x^2 + ax + b$: các hệ số $b, a, 1$ ở hàng $g=0,1,2$ và $N$ ở hàng 6. Tương tự cột 8 chứa hệ số của $q_{02}(x) = p(x)^2 = x^4 + cx^3 + \cdots + f$. Kết cấu upper-triangular (sau khi sắp xếp lại) xuất phát từ tính monic của $p(x)$.

---

## Định Thức của $M$

Vì $M$ là ma trận tam giác trên (upper triangular), định thức là tích các phần tử đường chéo.

> [!abstract] Claim 2.3 — Công thức định thức
> Định thức của $M$ bằng:
>
> $$
> \det(M) = N^{kh(h-1)/2} \cdot X^{-(hk)(hk-1)/2} \cdot \left(\frac{1}{\sqrt{hk}}\right)^{hk}
> $$
>
> Có thể viết gọn hơn:
>
> $$
> \det(M) = \left(N^{h-1} \cdot X^{-(hk-1)} \cdot (hk)^{-1}\right)^{hk/2}
> $$

**Proof.** Phần tử đường chéo của block trên-trái là $\delta X^{-g} = X^{-g}/\sqrt{hk}$ với $g = 0, \ldots, hk-1$, đóng góp

$$
\prod_{g=0}^{hk-1} \frac{X^{-g}}{\sqrt{hk}} = \frac{X^{-0-1-\cdots-(hk-1)}}{(\sqrt{hk})^{hk}} = \frac{X^{-(hk)(hk-1)/2}}{(\sqrt{hk})^{hk}}
$$

Phần tử đường chéo của block dưới-phải là $N^j$ với $j$ chạy từ $1$ đến $h-1$, mỗi $j$ xuất hiện $k$ lần (vì $0 \leq i < k$), đóng góp

$$
\prod_{j=1}^{h-1} (N^j)^k = N^{k \sum_{j=1}^{h-1} j} = N^{k \cdot \frac{h(h-1)}{2}}
$$

Nhân hai phần lại và biến đổi đại số cho kết quả trên. $\blacksquare$

Tiếp theo, Coppersmith chứng minh rằng từ điều kiện $hk \geq 7$ suy ra $hk < 2^{(hk-1)/2}$, và từ đó:

$$
\det(M) > \left(N^{(h-1)-(hk-1)\left(\frac{1}{k}-\varepsilon\right)} \cdot 2^{(hk-1)/2}\right)^{hk/2}
$$

Áp dụng điều kiện $h - 1 \geq (hk-1)(1/k - \varepsilon)$, số mũ của $N$ trở thành $\geq 0$, và cuối cùng:

$$
\boxed{\det(M) > 2^{(hk)(hk-1)/4}}
$$

Đây là lower bound quan trọng — nó sẽ được dùng trong Lesson 03 để chứng minh rằng LLL buộc tất cả vector ngắn phải nằm trong subspace chiều $\leq hk - 1$.

---

## Vector Ngắn $\mathbf{r}$ Ứng Với $x_0$

Để áp dụng LLL có ích, ta cần biết rằng có *ít nhất* một vector ngắn trong lattice — đó là vector ứng trực tiếp với nghiệm $x_0$.

> [!note] Definition 2.4 — Row vector $\mathbf{r}$ ứng với $x_0$
> Định nghĩa row vector $\mathbf{r}$ kích thước $2hk - k$ như sau:
>
> - **Phần trái** (index $g = 0, \ldots, hk-1$): $r_g = x_0^g$
> - **Phần phải** (index $\gamma(i,j)$): $r_{\gamma(i,j)} = -x_0^i y_0^j$
>
> Viết tường minh:
>
> $$
> \mathbf{r} = \bigl(1,\, x_0,\, x_0^2,\, \ldots,\, x_0^{hk-1},\, -y_0,\, -x_0 y_0,\, \ldots,\, -x_0^{k-1} y_0,\, -y_0^2,\, \ldots,\, -x_0^{k-1} y_0^{h-1}\bigr)
> $$

> [!abstract] Claim 2.5 — $\mathbf{s} = \mathbf{r} M$ có chuẩn $< 1$
> Đặt $\mathbf{s} = \mathbf{r} M$. Khi đó:
>
> - **Phần trái** của $\mathbf{s}$: $s_g = \dfrac{x_0^g \cdot X^{-g}}{\sqrt{hk}} = \dfrac{(x_0/X)^g}{\sqrt{hk}}$
> - **Phần phải** của $\mathbf{s}$: $s_{\gamma(i,j)} = q_{ij}(x_0) - x_0^i y_0^j N^j = 0$
>
> Do đó chuẩn Euclidean:
>
> $$
> |\mathbf{s}| = \left[\sum_g s_g^2\right]^{1/2} = \left[\sum_{g=0}^{hk-1} \frac{(x_0/X)^{2g}}{hk}\right]^{1/2} < \left[\sum_{g=0}^{hk-1} \frac{1}{hk}\right]^{1/2} = 1
> $$
>
> vì $|x_0| \leq X$ theo giả thiết.

**Proof.** Phần phải bằng $0$ vì $q_{ij}(x_0) = x_0^i y_0^j N^j$ (theo Definition 2.1), nên $s_{\gamma(i,j)} = x_0^i y_0^j N^j - x_0^i y_0^j N^j = 0$. Bất đẳng thức chuẩn theo từ $|x_0/X| \leq 1$. $\blacksquare$

Kết hợp hai kết quả:
- $\det(M) > 2^{(hk)(hk-1)/4}$ → lattice không "quá dẹt" → vector ngắn nhất không thể quá nhỏ
- $|\mathbf{s}| < 1$ → $\mathbf{s}$ là một vector ngắn cụ thể trong lattice

LLL sẽ khai thác căng thẳng giữa hai sự thật này để buộc tất cả vector ngắn (chuẩn $< 1$) phải nằm trong subspace chiều $\leq hk - 1$ — và từ đó trích ra polynomial equation trên $\mathbb{Z}$. Đây là nội dung của [[03-lll-analysis-correctness|Lesson 03]].

---

## Summary

- Họ đa thức $q_{ij}(x) = x^i p(x)^j$ thoả $q_{ij}(x_0) \equiv 0 \pmod{N^j}$ vì $p(x_0) = y_0 N$.
- Tham số $h \approx 1/(k\varepsilon)$ cân bằng giữa số phương trình và kích thước lattice.
- Ma trận $M$ kích thước $(2hk-k)^2$ có cấu trúc 4 block: diagonal scaled $X^{-g}/\sqrt{hk}$ (trên-trái), hệ số $q_{ij}$ (trên-phải), diagonal $N^j$ (dưới-phải), zero (dưới-trái).
- $\det(M) > 2^{(hk)(hk-1)/4}$ — lower bound quan trọng cho phân tích LLL.
- Vector $\mathbf{r}$ với $r_g = x_0^g$ và $r_{\gamma(i,j)} = -x_0^i y_0^j$ thoả $|\mathbf{r}M| < 1$ — đây là vector ngắn cần tìm.

---

## References

- [Cop96] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients*, Math. Ann. 261 (1982) (🔴 Prerequisite)
- [VGT88] Vallée, Girault, Toffin — *How to Guess ℓ-th Roots Modulo n by Reducing Lattice Bases*, AAECC-6 (⚪ so sánh trong §2.1 — xem [[03-lll-analysis-correctness|Lesson 03]])
