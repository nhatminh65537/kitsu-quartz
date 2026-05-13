---
title: "03. LLL Analysis & Correctness Proof"
type: math-component
tags: [coppersmith, lattice, lll, math-component, lesson-03]
aliases: [Coppersmith LLL Analysis, Theorem 1 Proof]
source: "Finding a Small Root of a Univariate Modular Equation — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[01-problem-formulation|01. Problem Formulation & Strategy]]; [[02-lattice-construction-matrix-m|02. Lattice Construction: Matrix M]]; LLL basis reduction [LLL82]  
> 🔴 **Prerequisite references**: Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients* [LLL82] (LLL algorithm và các bounds chuẩn)  
> **Lesson type**: Math Component  
> **Covers**: §2 — phần LLL argument, block reduction về $\hat{M}$, Theorem 1, Corollary 2, hai Remark cuối §2; §2.1 Comparison to Previous Work
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\hat{M}$ | Block reduced form của $M$ (upper $hk \times hk$) | $\hat{M}$ |
> | $n$ | Chiều lattice $n = hk$ | $n$ |
> | $\mathbf{b}_1, \ldots, \mathbf{b}_n$ | LLL-reduced row basis của $\hat{M}$ | $b_1, \ldots, b_n$ |
> | $\mathbf{b}_n^*$ | Thành phần của $\mathbf{b}_n$ trực giao với $\mathbf{b}_1, \ldots, \mathbf{b}_{n-1}$ | $b_n^*$ |
> | $f_0, \ldots, f_{hk-1}$ | Hệ số của polynomial equation trên $\mathbb{Z}$ | $f_0, \ldots, f_{hk-1}$ |
> | $d_g$ | Toạ độ trái của một lattice element ngắn | $d_g$ |

---

## Motivation

Lesson trước đã xây dựng matrix $M$ và chứng minh:

1. $\det(M) > 2^{(hk)(hk-1)/4}$ — lattice không dẹt
2. Vector $\mathbf{s} = \mathbf{r}M$ có chuẩn $|\mathbf{s}| < 1$

Bây giờ ta cần trả lời: từ hai sự thật này, làm thế nào LLL cho ta polynomial equation trên $\mathbb{Z}$?

Ý tưởng là: **tất cả vector lattice ngắn (chuẩn $< 1$) đều nằm trong một subspace chiều $\leq n-1 = hk-1$**. Bởi vì subspace này có chiều nhỏ hơn $hk$, tồn tại một quan hệ tuyến tính (không tầm thường) trên các toạ độ — và quan hệ đó chính là polynomial equation về $x_0$ trên $\mathbb{Z}$.

---

## Bước 1 — Giản Lược Block: Từ $M$ về $\hat{M}$

Do $p(x)$ và mọi $q_{ij}(x)$ là monic, block con của $M$ gồm hàng $k$ đến $hk-1$ và cột $hk$ đến $2hk-k-1$ (tức block trên-phải tương ứng với các monomial bậc $\geq k$) là **ma trận tam giác trên với 1 trên đường chéo**. 

Điều này cho phép thực hiện elementary row operations (tổ hợp hàng nguyên) để đưa $M$ về dạng block $\hat{M}$:

> [!note] Definition 3.1 — Block reduced form $\hat{M}$
> Bằng elementary row operations trên $M$, thu được block matrix $\hat{M}$ với:
>
> - Block dưới-phải $(hk-k) \times (hk-k)$: **ma trận đơn vị** $I$
> - Block trên-phải $hk \times (hk-k)$: **ma trận không** $0$
> - Block trên-trái $hk \times hk$: $\hat{M}$ (lattice ta quan tâm)
>
> Và $\det(\hat{M}) = \det(M) > 2^{(hk)(hk-1)/4}$.

Lý do đẳng thức định thức: elementary row operations không thay đổi giá trị tuyệt đối của det, và block dưới có det $= 1$ nên không đóng góp vào $\det(\hat{M})$.

Từ đây, ta **chỉ làm việc với phần trên** của $\hat{M}$, tức là lattice $\hat{M}$ kích thước $n = hk$. Các phần tử lattice là các vector nguyên trong $\mathbb{R}^n$ (toạ độ trái), với phần phải (toạ độ $\gamma(i,j)$) đã bị loại bỏ nhờ block dưới là đơn vị.

---

## Bước 2 — Áp Dụng LLL và Bound Trên $|\mathbf{b}_n^*|$

> [!note] Definition 3.2 — LLL basis reduction (nhắc lại từ [LLL82])
> Cho một lattice $\Lambda \subset \mathbb{R}^n$, thuật toán LLL tính một basis $\mathbf{b}_1, \ldots, \mathbf{b}_n$ sao cho:
>
> $$
> |\mathbf{b}_i^*| \geq \frac{1}{\sqrt{2}} |\mathbf{b}_{i+1}^*|, \quad i = 1, \ldots, n-1
> $$
>
> trong đó $\mathbf{b}_i^*$ là thành phần của $\mathbf{b}_i$ trực giao với $\text{span}(\mathbf{b}_1, \ldots, \mathbf{b}_{i-1})$ (Gram-Schmidt component).

Từ bất đẳng thức LLL và tính chất định thức, Coppersmith áp dụng kết quả chuẩn từ [LLL82]:

> [!abstract] Lemma 3.3 — Lower bound trên $|\mathbf{b}_n^*|$
> Sau LLL basis reduction trên $\hat{M}$, last Gram-Schmidt component $\mathbf{b}_n^*$ thoả:
>
> $$
> |\mathbf{b}_n^*| \geq \{\det(\hat{M})\}^{1/n} \cdot 2^{-(n-1)/4} > 1
> $$

**Proof sketch.** Từ định nghĩa $\det(\hat{M}) = \prod_{i=1}^n |\mathbf{b}_i^*|$ và bất đẳng thức LLL $|\mathbf{b}_i^*| \geq 2^{-(n-i)/2} |\mathbf{b}_n^*|$, ta có:

$$
\det(\hat{M}) = \prod_{i=1}^n |\mathbf{b}_i^*| \leq |\mathbf{b}_n^*|^n \cdot \prod_{i=1}^n 2^{(n-i)/2} = |\mathbf{b}_n^*|^n \cdot 2^{n(n-1)/4}
$$

Suy ra $|\mathbf{b}_n^*|^n \geq \det(\hat{M}) \cdot 2^{-n(n-1)/4}$, tức là:

$$
|\mathbf{b}_n^*| \geq \{\det(\hat{M})\}^{1/n} \cdot 2^{-(n-1)/4}
$$

Thay $\det(\hat{M}) > 2^{n(n-1)/4}$ (với $n = hk$) vào:

$$
|\mathbf{b}_n^*| > \left(2^{n(n-1)/4}\right)^{1/n} \cdot 2^{-(n-1)/4} = 2^{(n-1)/4} \cdot 2^{-(n-1)/4} = 1
$$

$\blacksquare$

---

## Bước 3 — Các Vector Ngắn Bị Nhốt Trong Subspace

Đây là bước then chốt — và cũng là điểm **mới lạ về kỹ thuật** mà Coppersmith nhấn mạnh: ta không cần tìm vector ngắn nhất, mà chỉ cần *nhốt* toàn bộ vector ngắn vào một subspace.

> [!abstract] Lemma 3.4 — Mọi lattice element chuẩn $< 1$ nằm trong subspace $n-1$ chiều
> Mọi element $\mathbf{v} = \sum_i c_i \mathbf{b}_i$ của lattice $\hat{M}$ với $|\mathbf{v}| < 1$ đều có $c_n = 0$.

**Proof.** Chuẩn Euclidean của $\mathbf{v}$ thoả:

$$
|\mathbf{v}|^2 = \left|\sum_i c_i \mathbf{b}_i\right|^2 \geq |c_n|^2 |\mathbf{b}_n^*|^2
$$

vì $\mathbf{b}_n^*$ là thành phần trực giao của $\mathbf{b}_n$ với toàn bộ $\mathbf{b}_1, \ldots, \mathbf{b}_{n-1}$.

Nếu $|\mathbf{v}| < 1$ thì $|c_n|^2 |\mathbf{b}_n^*|^2 < 1$. Nhưng $|\mathbf{b}_n^*| > 1$ (Lemma 3.3), nên $|c_n|^2 < 1$. Vì $c_n \in \mathbb{Z}$, ta có $c_n = 0$. $\blacksquare$

Do đó tất cả lattice elements chuẩn $< 1$ nằm trong $\text{span}(\mathbf{b}_1, \ldots, \mathbf{b}_{n-1})$ — một subspace chiều $\leq n-1 = hk-1$.

---

## Bước 4 — Trích Xuất Polynomial Equation Trên $\mathbb{Z}$

Xét các "short rows" của $M$ (trước khi giản lược block): mỗi short row là một vector dạng

$$
(d_0, d_1, \ldots, d_{hk-1},\, e_{\gamma(0,1)}, \ldots, e_{\gamma(k-1,h-1)}) \cdot M
$$

với chuẩn $< 1$ và phần phải bằng $0$.

Từ Lemma 3.4, tập hợp tất cả các short rows này span một **subspace chiều $\leq hk - 1$** trong $\mathbb{R}^{hk}$ (phần toạ độ trái). Áp dụng đại số tuyến tính:

> [!abstract] Claim 3.5 — Tồn tại polynomial equation trên $\mathbb{Z}$
> Tồn tại các số nguyên $f_0, f_1, \ldots, f_{hk-1}$ (không đồng thời bằng $0$) sao cho với mọi short row $(d_g)$:
>
> $$
> \sum_{g=0}^{hk-1} f_g \cdot d_g = 0 \quad \text{(đẳng thức trên } \mathbb{Z}\text{)}
> $$

**Proof.** Subspace $hk-1$ chiều trong $\mathbb{R}^{hk}$ có orthogonal complement chiều $\geq 1$, tức là tồn tại vector $(f_0, \ldots, f_{hk-1}) \neq \mathbf{0}$ trực giao với toàn bộ subspace đó. Vì tất cả vectors là nguyên và orthogonality là điều kiện tuyến tính, có thể chọn $(f_g)$ là nguyên. $\blacksquare$

Bây giờ áp dụng điều này cho chính $\mathbf{s} = \mathbf{r}M$ — đây cũng là một short row với $d_g = r_g = x_0^g$. Do đó:

$$
\sum_{g=0}^{hk-1} f_g \cdot x_0^g = 0
$$

Đây là **đẳng thức trên $\mathbb{Z}$** (không phải mod $N$). Đặt $f(x) = \sum_g f_g x^g \in \mathbb{Z}[x]$ — ta vừa tìm được một đa thức hệ số nguyên mà $x_0$ là nghiệm thực sự.

> [!tip] 💡 Agent note
> Điểm quan trọng: bước trích xuất $(f_g)$ là pure linear algebra trên subspace — không cần biết $x_0$ hay $y_0$ tường minh. Sau khi có $f(x)$, giải $f(x) = 0$ trên $\mathbb{Z}$ bằng các kỹ thuật chuẩn (e.g., integer root finding, Hensel lifting) trong thời gian đa thức.

---

## Theorem 1 và Corollary 2

> [!abstract] Theorem 1 (Coppersmith 1996)
> Cho $p(x)$ là đa thức monic bậc $k$ hệ số nguyên, $N$ là hợp số dương chưa biết phân tích, và $\varepsilon > 0$. Tồn tại thuật toán tìm tất cả nghiệm nguyên $x_0$ của
>
> $$
> p(x_0) \equiv 0 \pmod{N}
> $$
>
> với $|x_0| < \frac{1}{2}N^{(1/k)-\varepsilon}$, chạy trong **thời gian đa thức** theo $\log N$, $k$, và $1/\varepsilon$.

**Proof.** Thuật toán gồm các bước:

1. Chọn $h \geq \max\{7/k,\ (k + \varepsilon k - 1)/(\varepsilon k^2)\}$ (đa thức theo $1/\varepsilon$).
2. Xây dựng ma trận $M$ kích thước $(2hk-k)^2$ (đa thức theo $k, 1/\varepsilon$).
3. Giản lược block về $\hat{M}$ kích thước $hk \times hk$.
4. Chạy LLL trên $\hat{M}$ — thời gian đa thức theo chiều $hk$ và $\log$ của kích thước entries.
5. Trích xuất $(f_g)$ bằng linear algebra — thời gian đa thức.
6. Giải $f(x_0) = 0$ trên $\mathbb{Z}$ — thời gian đa thức.

Chiều lattice là $hk$ = đa thức theo $k, 1/\varepsilon$. Kích thước entries của $M$: phần trái $\sim X^{-hk}$ rational (bounded bởi $N$), phần phải $\leq N^h$ và hệ số đa thức của $p$ — tất cả có logarithm đa thức theo $\log N, k, 1/\varepsilon$. LLL chạy trong thời gian đa thức theo dimension và logarithm of entries. Do đó toàn bộ thuật toán chạy trong thời gian đa thức. $\blacksquare$

> [!abstract] Corollary 2 (Coppersmith 1996)
> Cùng điều kiện như Theorem 1, nhưng không cần $\varepsilon$: tồn tại thuật toán tìm tất cả nghiệm nguyên $x_0$ với $|x_0| < N^{1/k}$, chạy trong **thời gian đa thức** theo $\log N$ và $k$.

**Proof.** Đặt $\varepsilon = 1/\log_2 N$. Khi đó $X = \frac{1}{2}N^{(1/k) - 1/\log_2 N} = \frac{1}{2} N^{1/k} / 2 < N^{1/k}$.

Với $\varepsilon = 1/\log_2 N$, ta cần $1/\varepsilon = \log_2 N$ phép thử exhaustive search trên $O(1)$ high-order bits chưa biết của $x_0$ (để mở rộng từ bound $\frac{1}{2}N^{(1/k)-\varepsilon}$ lên $N^{1/k}$). Mỗi lần thử tốn thời gian đa thức theo Theorem 1, và số lần thử là $O(\log N)$ = đa thức. $\blacksquare$

---

## Hai Remark Quan Trọng

> [!tip] 💡 Remark 1 — Kỹ thuật mới: nhốt vào subspace
> Coppersmith nhấn mạnh rằng mục tiêu **không phải** là tìm vector ngắn nhất của lattice (như SVP thông thường). Thay vào đó, mục tiêu là *nhốt* toàn bộ vector ngắn vào subspace chiều $n-1$. Đây là một cách dùng LLL novel: ta luôn tìm được solution (không phải chỉ "với xác suất cao"), và vector ứng với $x_0$ có thể không phải là vector ngắn nhất.

> [!tip] 💡 Remark 2 — Nhiều nghiệm nhỏ
> Nếu có nhiều nghiệm $x_0$ nhỏ, thuật toán tìm được **tất cả đồng thời**: các nghiệm đều thoả polynomial equation trên $\mathbb{Z}$ vừa tìm được, và giải $f(x) = 0$ trên $\mathbb{Z}$ trả về toàn bộ tập nghiệm.

---

## So Sánh Với Vallée et al. [VGT88]

> [!info] 🟡 So sánh với [VGT88] — Vallée, Girault, Toffin (1988)
> Vallée et al. [VGT88] dùng phương pháp LLL tương tự nhưng chỉ xét **một đa thức duy nhất** $q_{01}(x) = p(x)$, thu được bound $|x_0| < N^{2/[k(k+1)]}$. Với $k=2$ cho bound $N^{1/3}$, còn Coppersmith cho $N^{1/2}$ — cải thiện $50\%$ kích thước không gian nghiệm.
>
> **Nguyên nhân cải tiến** (theo §2.1 của paper):
>
> Mỗi phương trình $q_{ij}(x) \equiv 0 \pmod{N^j}$ đóng góp một nhân tử $N^j$ vào $\det(M)$, trong khi mỗi biến $x^g$ "tiêu thụ" một nhân tử $\sim X^{-g}$. Để $\det(M) > 1$ (điều kiện cần cho LLL hoạt động), ta cần balance hai đóng góp này.
>
> Coppersmith **phân bổ chi phí biến cho nhiều phương trình** (amortization): thay vì $k$ biến phục vụ 1 phương trình, $k$ biến phục vụ $h$ phương trình — từ đó "chiết khấu" hiệu quả hơn và cho phép bound lớn hơn.
>
> *(theo [VGT88]: Vallée, Girault, Toffin — How to Guess ℓ-th Roots Modulo n by Reducing Lattice Bases, AAECC-6, 1988)*

| Phương pháp | Đa thức dùng | Bound nghiệm | $k=2$ | $k=3$ |
|-------------|-------------|-------------|-------|-------|
| Vallée et al. [VGT88] | $p(x)$ duy nhất | $N^{2/[k(k+1)]}$ | $N^{1/3}$ | $N^{1/6}$ |
| **Coppersmith [Cop96]** | $\{x^i p(x)^j\}$ | $N^{1/k}$ | $N^{1/2}$ | $N^{1/3}$ |

**Khác biệt thứ hai**: Vallée et al. tìm *vector ngắn nhất* (SVP heuristic) → thành công với xác suất cao nhưng không đảm bảo. Coppersmith *nhốt vào subspace* → luôn thành công nếu nghiệm tồn tại.

---

## Summary

- **Block reduction** $M \to \hat{M}$: loại bỏ block dưới-phải bằng elementary row operations, giữ $\det(\hat{M}) = \det(M) > 2^{(hk)(hk-1)/4}$.
- **LLL key lemma**: $|\mathbf{b}_n^*| > 1$ → mọi lattice element chuẩn $< 1$ có $c_n = 0$ → nằm trong subspace chiều $\leq hk-1$.
- **Polynomial extraction**: subspace $hk-1$ chiều có orthogonal complement $\geq 1$ chiều → tồn tại $(f_g) \neq 0$ với $\sum f_g x_0^g = 0$ trên $\mathbb{Z}$.
- **Theorem 1**: tìm nghiệm $|x_0| < \frac{1}{2}N^{(1/k)-\varepsilon}$ trong thời gian poly($\log N, k, 1/\varepsilon$).
- **Corollary 2**: mở rộng tới $N^{1/k}$ bằng $O(\log N)$ lần thử trên high bits.
- **Cải tiến vs [VGT88]**: dùng nhiều phương trình thay vì một → amortization → bound $N^{1/k}$ thay vì $N^{2/[k(k+1)]}$; và guaranteed success thay vì probabilistic.

---

## References

- [Cop96] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients*, Math. Ann. 261 (1982) (🔴 Prerequisite)
- [VGT88] Vallée, Girault, Toffin — *How to Guess ℓ-th Roots Modulo n by Reducing Lattice Bases*, AAECC-6, LNCS 357 (1988) (🟡 Integrated above)
