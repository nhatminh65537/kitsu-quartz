---
title: "02. Coppersmith's Lattice Strategy & Howgrave-Graham"
type: math-component
tags: [rsa-cryptanalysis, coppersmith, lll, howgrave-graham, lattice, math-component, lesson-02]
aliases: [Coppersmith Lattice, Howgrave-Graham Lemma, LLL RSA]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: LLL algorithm & lattice reduction (biết kết quả, không cần chứng minh), đa thức nguyên nhiều biến, modular arithmetic  
> 🔴 **Prerequisite references**: Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients* [LLL82] (LLL algorithm); May — *New RSA Vulnerabilities Using Lattice Reduction Methods* [May03] (background lattice crypto); Coppersmith — *Small Solutions to Polynomial Equations* [Cop97] (original method)  
> **Lesson type**: Math Component  
> **Covers**: §2.2 đầy đủ (Lemmas 1–2, Assumption 1, 4-step lattice solving strategy)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\Lambda$ | Lattice — tập tổ hợp tuyến tính nguyên của các vector cơ sở |
> | $\omega$ | Số chiều (dimension) của lattice |
> | $\det(\Lambda)$ | Determinant của lattice |
> | $\mathbf{B}$ | Ma trận cơ sở của lattice (các hàng là basis vectors) |
> | $\|g\|$ | Norm Euclidean của đa thức $g$ — norm của vector hệ số |
> | $R$ | Modulus trong phương trình mô-đun $f(\mathbf{x}) \equiv 0 \pmod{R}$ |
> | $X_i$ | Bound trên độ lớn của nghiệm $x_i^*$ |
> | $f(x_1, \ldots, x_n)$ | Đa thức nguyên $n$ biến |
> | $g_{k,\ldots}$ | Shift polynomial xây từ $f$ |

---

## Tại Sao Cần Kỹ Thuật Lattice?

Bài toán cốt lõi trong cryptanalysis RSA thường có dạng: tìm **nghiệm nguyên nhỏ** của một phương trình đa thức mô-đun — chẳng hạn $f(x, y) \equiv 0 \pmod{e}$ với $x, y$ nhỏ. Đây không phải bài toán tổ hợp tầm thường; không có thuật toán naive nào hoạt động khi $e \sim N \sim 2^{1024}$.

Coppersmith (1997) và Howgrave-Graham (1997) đặt nền tảng cho một phương pháp thanh lịch: **chuyển bài toán tìm nghiệm mô-đun thành bài toán rút gọn lattice**, sau đó dùng LLL để tìm các vector ngắn — từ đó suy ra các đa thức nguyên chia sẻ nghiệm nhỏ với $f$. Nếu đủ nhiều đa thức như vậy được tìm thấy và chúng độc lập đại số, hệ phương trình kết quả giải được bằng phép tính chuẩn (Gröbner basis, resultants).

---

## Lattice và Determinant

> [!note] Định nghĩa 2.1 — Lattice
> Một **lattice** $\Lambda$ được sinh bởi các vector tuyến tính độc lập $\mathbf{b}_1, \ldots, \mathbf{b}_\omega \in \mathbb{R}^n$:
>
> $$
> \Lambda = \left\{ \sum_{i=1}^{\omega} z_i \mathbf{b}_i : z_i \in \mathbb{Z} \right\}
> $$
>
> **Determinant**: $\det(\Lambda) = \sqrt{\det(\mathbf{B}\mathbf{B}^T)}$ với $\mathbf{B}$ là ma trận cơ sở (các hàng là $\mathbf{b}_i$).  
> Khi $\omega = n$ (full-rank lattice): $\det(\Lambda) = |\det(\mathbf{B})|$.

Trong các tấn công RSA, lattice thường được xây dựng từ **shift polynomials** — các đa thức dẫn xuất từ $f$ sao cho chúng đồng thời có nghiệm mô-đun chung với $f$. Việc chọn shift polynomials tốt là nghệ thuật trung tâm của phương pháp.

---

## LLL Algorithm

> [!abstract] Lemma 2.2 — LLL Output Bound (Lemma 1 trong paper)
> Cho lattice $\Lambda$ chiều $\omega$. Thuật toán LLL [LLL82] tính một **reduced basis** $(\mathbf{v}_1, \ldots, \mathbf{v}_\omega)$ thỏa mãn:
>
> $$
> \|\mathbf{v}_i\| \leq 2^{\frac{\omega(\omega-1)}{4(\omega+1-i)}} \cdot \det(\Lambda)^{\frac{1}{\omega+1-i}}, \quad i = 1, 2, \ldots, \omega
> $$
>
> Thuật toán chạy trong thời gian đa thức theo $\omega$ và logarithm của hệ số input lớn nhất.

> [!info] 🟡 LLL algorithm [LLL82]
> LLL (Lenstra–Lenstra–Lovász, 1982) là thuật toán rút gọn cơ sở lattice đa thức đầu tiên. Với input là basis tùy ý, LLL output một basis "gần tối ưu": vector ngắn nhất không thể ngắn hơn bound ở Lemma 2.2 quá nhiều. LLL chạy trong poly-time — đây là điểm cốt yếu giúp các tấn công lattice trở thành polynomial-time algorithms.  
> *(theo [LLL82]: Lenstra, Lenstra, Lovász — Math. Ann. 261(4), 1982)*

---

## Howgrave-Graham: Nâng Nghiệm Mô-đun Lên Nghiệm Nguyên

Đây là bước then chốt: từ các vector ngắn tìm được bởi LLL, làm sao suy ra nghiệm nguyên của $f$?

> [!abstract] Lemma 2.3 — Howgrave-Graham Lemma (Lemma 2 trong paper)
> Cho $g(x_1, \ldots, x_n) \in \mathbb{Z}[x_1, \ldots, x_n]$ là đa thức gồm **tối đa $\omega$ monomial**. Cho $R, X_1, \ldots, X_n > 0$. Giả sử:
> 1. $g(x_1^*, \ldots, x_n^*) \equiv 0 \pmod{R}$ với $|x_i^*| \leq X_i$
> 2. $\|g(X_1 x_1, \ldots, X_n x_n)\| < \dfrac{R}{\sqrt{\omega}}$
>
> Khi đó $g(x_1^*, \ldots, x_n^*) = 0$ **trên số nguyên** (không chỉ mô-đun $R$).

**Proof sketch.** Biểu diễn $g(x_1^*, \ldots, x_n^*) = \sum_{\mathbf{i}} c_{\mathbf{i}} (x_1^*)^{i_1} \cdots (x_n^*)^{i_n}$. Dùng Cauchy-Schwarz:

$$
|g(x_1^*, \ldots, x_n^*)| \leq \sqrt{\omega} \cdot \|g(X_1 x_1, \ldots, X_n x_n)\| < R
$$

Vì $g \equiv 0 \pmod{R}$ và $|g| < R$, nên $g = 0$ trên $\mathbb{Z}$. $\blacksquare$

> [!info] 🟡 Howgrave-Graham [1997]
> Kết quả này xuất phát từ [Howgrave-Graham 1997] — bài báo reformulate phương pháp Coppersmith theo ngôn ngữ lattice, làm cho nó dễ áp dụng và mở rộng hơn đáng kể.  
> *(theo [HG97]: Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, Cryptography and Coding 1997)*

> [!tip] 💡 Agent note — Ý nghĩa của điều kiện 2
> Điều kiện $\|g(X_1 x_1, \ldots, X_n x_n)\| < R/\sqrt{\omega}$ là điều kiện **solvable**: nó đảm bảo nghiệm mô-đun "lift" lên nghiệm nguyên. Về mặt trực giác: rescaling $g(X_1 x_1, \ldots)$ đưa hệ số về cùng scale, và norm nhỏ nghĩa là đa thức "co lại" đủ nhiều so với $R$ để nghiệm nguyên tồn tại. Khi thiết kế lattice, toàn bộ mục tiêu là đảm bảo điều kiện này.

---

## Assumption về Độc Lập Đại Số

> [!abstract] Assumption 2.4 — Algebraic Independence (Assumption 1 trong paper)
> Các đa thức nguyên dẫn xuất từ LLL-reduced basis là **algebraically independent** và hệ phương trình có thể giải hiệu quả (via resultants hoặc Gröbner basis).

> [!warning] Tính heuristic của phương pháp
> Assumption 2.4 là **heuristic** — không có chứng minh lý thuyết tổng quát. Trong thực tế, với tham số được chọn cẩn thận, độc lập đại số gần như luôn đúng và các nghiệm thu được thành công. Đây là tiêu chuẩn của field: mọi lattice-based attack đều adopt assumption này.

---

## 4-Step Lattice Solving Strategy

> [!note] Scheme 2.5 — Lattice-Based Solving Strategy
> **Type**: Algorithmic framework cho tìm nghiệm nhỏ của $f(\mathbf{x}) \equiv 0 \pmod{R}$  
> **Setting**: Đa thức $f(x_1, \ldots, x_n)$, modulus $R$, bounds $X_1, \ldots, X_n$ trên nghiệm $x_i^*$
>
> **$\mathsf{LatticeAttack}(f, R, X_1, \ldots, X_n, m, t)$**
> - Input: đa thức $f$, modulus $R$, bounds $X_i$, tham số $m$ (level), $t$ (shift depth)
>
> - **Bước 1 — Xây dựng shift polynomials**:  
>   Từ $f$, tạo tập đa thức $\{g_{k, \ldots}\}$ sao cho mỗi $g_{k,\ldots}(x_1^*, \ldots, x_n^*) \equiv 0 \pmod{R^m}$ — tất cả chia sẻ nghiệm mô-đun chung với $f^m$.
>   Dạng điển hình: $g_{k,i}(\mathbf{x}) = x^i f(\mathbf{x})^k \cdot R^{m-k}$
>
> - **Bước 2 — Xây dựng lattice basis**:  
>   Vector hệ số của các đa thức scaled $g_{k,\ldots}(X_1 x_1, \ldots, X_n x_n)$ tạo thành các hàng của ma trận lattice $\mathbf{B}$. Sắp xếp theo thứ tự lexicographic của indices.
>   Nếu thứ tự monomial được chọn đúng, $\mathbf{B}$ là **tam giác** → $\det(\Lambda) = \prod$ các phần tử đường chéo.
>
> - **Bước 3 — Chạy LLL và kiểm tra điều kiện solvable**:  
>   Áp dụng LLL thu được reduced basis $(\mathbf{v}_1, \ldots, \mathbf{v}_\omega)$. Thành công nếu:
>
> $$
> 2^{\frac{\omega(\omega-1)}{4(\omega-2)}} \cdot \det(\Lambda)^{\frac{1}{\omega-2}} < \frac{R^m}{\sqrt{\omega}}
> $$
>
>   (Kết hợp Lemma 2.2 với $i=3$ và Lemma 2.3; điều kiện này là **điều kiện solvable** của attack)
>
> - **Bước 4 — Giải hệ và khôi phục nghiệm**:  
>   Các vector ngắn tương ứng với đa thức nguyên $h_j(x_1, \ldots, x_n)$ triệt tiêu tại $(x_1^*, \ldots, x_n^*)$.  
>   Giải hệ $\{h_j = 0\}$ bằng resultants hoặc Gröbner basis (dưới Assumption 2.4) → nghiệm $(x_1^*, \ldots, x_n^*)$.
>
> - Output: $(x_1^*, \ldots, x_n^*)$ — nghiệm nguyên nhỏ của $f(\mathbf{x}) \equiv 0 \pmod{R}$

---

## Điều Kiện Solvable và Tối Ưu Hóa Tham Số

Điều kiện solvable ở Bước 3 cho ra một bất đẳng thức theo $\alpha, \delta, \gamma, \ldots$ (các log-exponents của các đại lượng). Kỹ thuật chuẩn là:

**1.** Tính $\det(\Lambda)$ theo tham số $m, t$ và các bounds $X_i = N^{\beta_i}$.  
**2.** Viết điều kiện solvable dưới dạng bất đẳng thức đa thức theo các $\beta_i$ và $\tau = t/m$ (với $m \to \infty$, bỏ lower-order terms).  
**3.** Tối ưu $\tau$ để có bound tốt nhất (thường là đặt đạo hàm bằng 0).  
**4.** Bound kết quả là điều kiện tấn công thành công.

> [!info] 🟡 Chiến lược Jochemsz-May [2006]
> Paper Zheng et al. dùng chiến lược shift polynomial của Jochemsz & May (2006) cho đa thức 3 biến $f(x, y, z)$ trong Theorem 6. Jochemsz-May xác định **tập monomial tối ưu** $M_k \setminus M_{k+1}$ cho từng level $k$, đảm bảo ma trận lattice tam giác và determinant tính được tường minh.  
> *(theo [JM06]: Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants*, ASIACRYPT 2006)*

---

## Cấu Trúc Tấn Công Herrmann-May (Preview)

> [!info] 🟡 Herrmann-May [2010] — Preview cho Lesson 04
> Herrmann & May (2010) áp dụng framework trên vào phương trình khóa RSA $ed - k(p-1)(q-1) = 1$ với xấp xỉ $\varphi(N) \approx S - N - 1 + (p+q-S)$. Họ dùng **linearization**: đặt $u = xy - 1$ để biến đa thức bậc 2 thành đa thức bậc 1 theo 3 biến $(x, y, u)$. Chiến lược shift polynomial dẫn đến bound $\delta_0 < 1 - \sqrt{\alpha\gamma}$ (Theorem 5 trong paper, sẽ trình bày đầy đủ ở Lesson 04).  
> *(theo [HM10]: Herrmann, May — *Maximizing Small Root Bounds by Linearization*, PKC 2010)*

---

## Tóm Tắt

- **Lattice** $\Lambda$ sinh bởi shift polynomials; $\det(\Lambda)$ tính được tường minh nếu basis tam giác.
- **LLL** (Lemma 2.2): tìm vector ngắn với norm $\leq 2^{\omega^2/4} \det(\Lambda)^{1/\omega}$ trong poly-time.
- **Howgrave-Graham** (Lemma 2.3): nếu norm đủ nhỏ so với $R/\sqrt{\omega}$, nghiệm mô-đun → nghiệm nguyên.
- **4-step strategy**: (1) shift polynomials → (2) lattice basis → (3) LLL + solvable condition → (4) hệ phương trình nguyên.
- **Assumption 1**: algebraic independence — heuristic nhưng gần như luôn đúng trong thực tế.
- Nền tảng này dùng trực tiếp ở Lessons 04 (Herrmann-May) và 05 (Main Attack).

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261(4), 1982 (🔴 Prerequisite)
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities*, J. Cryptol. 10(4), 1997 (🔴 Prerequisite)
- [HG97] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, Cryptography and Coding 1997 (🟡 Lemma 2.3)
- [May03] May — *New RSA Vulnerabilities Using Lattice Reduction Methods*, PhD thesis, Univ. Paderborn, 2003 (🔴 Prerequisite)
- [JM06] Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials*, ASIACRYPT 2006 (🟡 Jochemsz-May strategy)
- [HM10] Herrmann, May — *Maximizing Small Root Bounds by Linearization*, PKC 2010 (🟡 preview Lesson 04)
