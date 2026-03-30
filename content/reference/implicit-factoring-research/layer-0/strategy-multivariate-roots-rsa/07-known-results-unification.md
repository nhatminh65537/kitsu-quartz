---
title: "07. Các kết quả đã biết như Special Cases"
type: survey
tags: [coppersmith, unification, boneh-durfee, blomer-may, survey, lesson-07]
aliases: [Known Results Unification, Special Cases Survey]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

> **Prerequisites**: [[02-modular-roots-strategy|02. Modular Roots Strategy]], [[03-integer-roots-strategy|03. Integer Roots Strategy]]  
> **Lesson type**: Survey  
> **Covers**: Appendix A (modular roots known results), Appendix B (integer roots known results)
>
> **Notation**: Kế thừa toàn bộ từ Lesson 02 và 03. Thêm:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $D$ | Bậc tổng quát của đa thức trong các kết quả tổng quát hóa |
> | $\lambda_i$ | Tỉ lệ bậc của biến $x_i$ so với $D$: $\deg_{x_i}(f) = \lambda_i D$ |
> | $\lambda, \gamma$ | Tham số hình dạng monomial trong các bounds của Blömer-May |

---

## Motivation

Một trong những đóng góp quan trọng nhất của paper Jochemsz-May không phải là hai tấn công RSA cụ thể — mà là chứng minh rằng **toàn bộ literature về Coppersmith small roots là các special cases** của một chiến lược thống nhất duy nhất.

Appendix A và B của paper liệt kê và tái tạo tất cả các kết quả đã biết về nghiệm modular (A) và nghiệm nguyên (B) bằng cách chỉ ra $M_k$ (Appendix A) hoặc $S/M$ (Appendix B) tương ứng. Lesson này tổng hợp toàn bộ nội dung đó.

---

## Appendix A: Modular Roots — Các Kết quả Đã Biết

Tất cả các bounds sau đây được tái tạo bằng Basic hoặc Extended Strategy của §2.1. Ký hiệu $t = \tau m$ cho Extended Strategy.

---

### A1. Boneh-Durfee [1] — $f_N(x_1, x_2) = a_0 + a_1 x_1 + a_2 x_1 x_2$

> [!info] 🟡 Boneh-Durfee [1] — Cryptanalysis of RSA, $d < N^{0.292}$
> **Extended Strategy** với:
>
> $$
> x_1^{i_1} x_2^{i_2} \in M_k \iff i_1 = k, \ldots, m;\quad i_2 = k, \ldots, i_1 + t
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{2+3\tau} X_2^{1+3\tau+3\tau^2} < N^{1+3\tau}
> $$
>
> **Áp dụng**: $X_1 = N^{1/2}$, $X_2 = N^{1-d_{\text{size}}}$, tối ưu $\tau$ → $d < N^{0.292}$.
>
> *(theo [1]: Boneh, Durfee — Cryptanalysis of RSA with d < N^{0.292}, IEEE TIT 2000)*

---

### A2. Blömer-May [2] — $f_N(x_1, x_2, x_3) = a_0 + a_1 x_1 + a_2 x_2 + a_3 x_2 x_3$

> [!info] 🟡 Blömer-May [2] — Partial Key Exposure Attacks
> **Extended Strategy** với:
>
> $$
> x_1^{i_1} x_2^{i_2} x_3^{i_3} \in M_k \iff i_1 = k,\ldots,m;\quad i_2 = 0,\ldots,m-i_1;\quad i_3 = 0,\ldots,i_2+t
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{1+4\tau} X_2^{2+4\tau} X_3^{1+4\tau+6\tau^2} < N^{1+4\tau}
> $$
>
> *(theo [2]: Blömer, May — New Partial Key Exposure Attacks on RSA, CRYPTO 2003)*

---

### A3. Generalized Rectangle — Coppersmith [6]

> [!info] 🟡 Coppersmith [6] — Generalized Rectangle Bound
> Với $f_N(x_1, \ldots, x_n)$ có $\deg_{x_i}(f_N) = \lambda_i D$:
>
> **Basic Strategy** với:
>
> $$
> x_1^{i_1} \cdots x_n^{i_n} \in M_k \iff i_j = \lambda_j D k, \ldots, \lambda_j D m \quad (\text{với } j=1,\ldots,n)
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{\lambda_1} \cdots X_n^{\lambda_n} < N^{\frac{2}{(n+1)D}}
> $$
>
> **Ý nghĩa**: Khi các biến có bậc tỉ lệ đều, bound tối ưu theo tích của các bounds.
>
> *(theo [6]: Coppersmith — Small Solutions to Polynomial Equations, J. Cryptology 1997)*

---

### A4. Generalized Lower Triangle — Coppersmith [6]

> [!info] 🟡 Coppersmith [6] — Generalized Lower Triangle Bound
> Với $f_N(x_1, \ldots, x_n)$ có monomials $x_1^{i_1} \cdots x_n^{i_n}$ thỏa $0 \leq i_1 \leq \lambda_1 D$, $0 \leq i_2 \leq \lambda_2 D - \frac{\lambda_2}{\lambda_1}i_1$, ..., $0 \leq i_n \leq \lambda_n D - \sum_{r=1}^{n-1} \frac{\lambda_n}{\lambda_r} i_r$:
>
> **Basic Strategy** với:
>
> $$
> x_1^{i_1} \cdots x_n^{i_n} \in M_k \iff i_1 = \lambda_1 Dk,\ldots,\lambda_1 Dm;\quad i_j = 0,\ldots,\lambda_j Dm - \sum_{r=1}^{j-1}\frac{\lambda_j}{\lambda_r}i_r
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{\lambda_1} \cdots X_n^{\lambda_n} < N^{\frac{1}{D}}
> $$
>
> **Ý nghĩa**: Khi monomial tạo thành hình tam giác hạ, bound chặt hơn Rectangle ($1/D$ thay vì $2/((n+1)D)$).
>
> *(theo [6]: Coppersmith — Small Solutions to Polynomial Equations, J. Cryptology 1997)*

---

### Bảng tổng hợp Appendix A

| Kết quả | Đa thức | Strategy | Bound |
|---------|---------|----------|-------|
| Boneh-Durfee [1] | $a_0 + a_1x_1 + a_2x_1x_2$ | Extended | $X_1^{2+3\tau}X_2^{1+3\tau+3\tau^2} < N^{1+3\tau}$ |
| Blömer-May [2] | $a_0+a_1x_1+a_2x_2+a_3x_2x_3$ | Extended | $X_1^{1+4\tau}X_2^{2+4\tau}X_3^{1+4\tau+6\tau^2} < N^{1+4\tau}$ |
| Gen. Rectangle [6] | $\deg_{x_i}=\lambda_iD$ | Basic | $\prod X_i^{\lambda_i} < N^{2/((n+1)D)}$ |
| Gen. Lower Triangle [6] | Monomials dạng lower triangle | Basic | $\prod X_i^{\lambda_i} < N^{1/D}$ |

---

## Appendix B: Integer Roots — Các Kết quả Đã Biết

Tất cả các bounds sau đây được tái tạo bằng Basic hoặc Extended Strategy của §2.2. Dùng ký hiệu $S$ và $M$.

---

### B1. Blömer-May Upper Triangle [3]

> [!info] 🟡 Blömer-May [3] — Upper Triangle Integer Bound
> $f(x_1, x_2)$ có monomials $x_1^{i_1}x_2^{i_2}$ với $0 \leq i_1 \leq D$, $0 \leq i_2 \leq \lambda i_2$.
>
> **Extended Strategy** với:
>
> $$
> x_1^{i_1}x_2^{i_2} \in S \iff i_2 = 0,\ldots,D(m-1);\quad i_1 = 0,\ldots,\lambda i_2 + t
> $$
>
> $$
> x_1^{i_1}x_2^{i_2} \in M \iff i_2 = 0,\ldots,Dm;\quad i_1 = 0,\ldots,\lambda i_2 + t
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{(\lambda+\tau)^2} X_2^{2(\lambda+\tau)} < W^{\frac{1}{D}(\lambda+2\tau)}
> $$
>
> *(theo [3]: Blömer, May — Tool Kit for Small Roots of Bivariate Polynomials over the Integers, EUROCRYPT 2005)*

---

### B2. Blömer-May Extended Rectangle [3]

> [!info] 🟡 Blömer-May [3] — Extended Rectangle Integer Bound
> $f(x_1,x_2)$ với monomials $x_2^{i_2}$ ($0 \leq i_2 \leq D$) và $x_1^{i_1}$ ($0 \leq i_1 \leq \gamma D + \lambda(D-i_2)$). Ví dụ: $f = a_0+a_1x_1+a_2x_1^2+a_3x_1^3+a_4x_2+a_5x_1x_2$ với $D=1$, $\gamma=1$, $\lambda=2$.
>
> **Extended Strategy** với:
>
> $$
> x_1^{i_1}x_2^{i_2} \in S \iff i_2=0,\ldots,D(m-1);\quad i_1=0,\ldots,\gamma D(m-1)+\lambda(D(m-1)-i_2)+t
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{\lambda^2+3\gamma\lambda+2\tau\lambda+4\tau\gamma+\tau^2+3\gamma^2} X_2^{\lambda+3\gamma+2\tau} < W^{\frac{1}{D}(\lambda+2\gamma+2\tau)}
> $$
>
> *(theo [3]: Blömer, May — Tool Kit for Small Roots of Bivariate Polynomials over the Integers, EUROCRYPT 2005)*

---

### B3. Ernst et al. Case 1 [8] — $f(x_1,x_2,x_3) = a_0+a_1x_1+a_2x_2+a_3x_2x_3$

> [!info] Ernst et al. [8] — Partial Key Exposure, Case 1
> **Extended Strategy** với:
>
> $$
> x_1^{i_1}x_2^{i_2}x_3^{i_3} \in S \iff i_1=0,\ldots,m-1;\quad i_2=0,\ldots,m-1-i_1;\quad i_3=0,\ldots,i_2+t
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{1+3\tau} X_2^{2+3\tau} X_3^{1+3\tau+3\tau^2} < W^{1+3\tau}
> $$
>
> *(theo [8]: Ernst, Jochemsz, May, de Weger — Partial Key Exposure Attacks up to Full Size Exponents, EUROCRYPT 2005)*

---

### B4. Ernst et al. Case 2 [8] — $f(x_1,x_2,x_3) = a_0+a_1x_1+a_2x_2+a_3x_3+a_4x_2x_3$

> [!info] Ernst et al. [8] — Partial Key Exposure, Case 2
> **Extended Strategy** với:
>
> $$
> x_1^{i_1}x_2^{i_2}x_3^{i_3} \in S \iff i_1=0,\ldots,m-1;\quad i_2=0,\ldots,m-1-i_1+t;\quad i_3=0,\ldots,m-1-i_1
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{2+3\tau} X_2^{3+3\tau} X_3^{3+6\tau+3\tau^2} < W^{2+3\tau}
> $$
>
> *(theo [8]: Ernst, Jochemsz, May, de Weger — Partial Key Exposure Attacks up to Full Size Exponents, EUROCRYPT 2005)*

---

### B5. Generalized Rectangle (Integer) — Coppersmith [6]

> [!info] 🟡 Coppersmith [6] — Generalized Rectangle, Integer Case
> $f(x_1,\ldots,x_n)$ với $\deg_{x_i}(f) = \lambda_i D$.
>
> **Basic Strategy** với:
>
> $$
> x_1^{i_1}\cdots x_n^{i_n} \in S \iff i_j = 0,\ldots,\lambda_j D(m-1)
> $$
>
> $$
> x_1^{i_1}\cdots x_n^{i_n} \in M \iff i_j = 0,\ldots,\lambda_j Dm
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{\lambda_1}\cdots X_n^{\lambda_n} < W^{\frac{2}{(n+1)D}}
> $$
>
> *(theo [6]: Coppersmith — Small Solutions to Polynomial Equations, J. Cryptology 1997)*

---

### B6. Generalized Lower Triangle (Integer) — Coppersmith [6]

> [!info] 🟡 Coppersmith [6] — Generalized Lower Triangle, Integer Case
> $f(x_1,\ldots,x_n)$ có monomials $0 \leq i_j \leq \lambda_j D - \sum_{r=1}^{j-1} \frac{\lambda_j}{\lambda_r} i_r$.
>
> **Basic Strategy** với:
>
> $$
> x_1^{i_1}\cdots x_n^{i_n} \in S \iff i_j = 0,\ldots,\lambda_j D(m-1) - \sum_{r=1}^{j-1}\frac{\lambda_j}{\lambda_r}i_r
> $$
>
> **Bound tái tạo**:
>
> $$
> X_1^{\lambda_1}\cdots X_n^{\lambda_n} < W^{\frac{1}{D}}
> $$
>
> *(theo [6]: Coppersmith — Small Solutions to Polynomial Equations, J. Cryptology 1997)*

---

### Bảng tổng hợp Appendix B

| Kết quả | Đa thức | Strategy | Bound |
|---------|---------|----------|-------|
| Blömer-May Upper Tri [3] | $f(x_1,x_2)$ upper triangle | Extended | $X_1^{(\lambda+\tau)^2}X_2^{2(\lambda+\tau)} < W^{(\lambda+2\tau)/D}$ |
| Blömer-May Ext. Rect [3] | $f(x_1,x_2)$ extended rect | Extended | $X_1^{\lambda^2+3\gamma\lambda+\ldots}X_2^{\ldots} < W^{(\lambda+2\gamma+2\tau)/D}$ |
| Ernst et al. Case 1 [8] | $a_0+a_1x_1+a_2x_2+a_3x_2x_3$ | Extended | $X_1^{1+3\tau}X_2^{2+3\tau}X_3^{1+3\tau+3\tau^2} < W^{1+3\tau}$ |
| Ernst et al. Case 2 [8] | $a_0+\ldots+a_4x_2x_3$ | Extended | $X_1^{2+3\tau}X_2^{3+3\tau}X_3^{3+6\tau+3\tau^2} < W^{2+3\tau}$ |
| Gen. Rectangle [6] | $\deg_{x_i} = \lambda_i D$ | Basic | $\prod X_i^{\lambda_i} < W^{2/((n+1)D)}$ |
| Gen. Lower Triangle [6] | Monomials lower triangle | Basic | $\prod X_i^{\lambda_i} < W^{1/D}$ |

---

## Ý nghĩa Thống nhất

> [!tip] 💡 Agent note
> Phân tích unification trong Appendix A và B cho thấy điều sâu sắc hơn một danh sách kết quả: **chiến lược Jochemsz-May là một meta-algorithm**. Thay vì phân tích từng đa thức cụ thể (vốn là công việc tedious và non-trivial theo lời paper), người dùng có thể:
>
> 1. **Input**: đa thức $f_N$ (hoặc $f$) và bounds $X_j$.
> 2. **Run**: Basic Strategy → tính $\det(L)$ symbolically → kiểm tra điều kiện (1) hoặc (2).
> 3. **Nếu không đủ**: thêm extra shifts và run Extended Strategy với $\tau$ tự do.
> 4. **Output**: bound tối ưu sau khi tối ưu hóa $\tau$ (và các tham số khác nếu có).
>
> Quá trình này có thể **tự động hóa** — đây là lý do paper có ảnh hưởng lớn đến các công cụ cryptanalysis tự động sau này.

---

## Quan hệ Modular ↔ Integer Strategies

| Điểm so sánh | Modular (App A) | Integer (App B) |
|---|---|---|
| Tập phân cấp | $M_k$ ($k = 0, \ldots, m+1$) | $S$ và $M$ (hai tập phẳng) |
| Modulus | $N$ (đã biết) | $R = W\prod X_j^{l_j}$ (nhân tạo) |
| Diagonal (ma trận) | $X^{i_1}\cdots X^{i_n} \cdot N^{m-k}$ | $\prod X_j^{d_j(m-1)}$ (g) hoặc $R\cdot X^i$ (g') |
| Điều kiện bound | $\prod X_j^{s_j} < N^{s_N}$ | $\prod X_j^{s_j} < W^{|S|}$ |
| Ma trận | Lower triangular | Upper triangular |

Hai chiến lược này có **cùng skeleton** — khác nhau ở cách build modulus và cách xây ma trận. Kết quả bounds có cùng hình thức $\prod X_j^{s_j} < \text{Modulus}^{s_{\text{ref}}}$ với các $s_j$ tính từ tập monomial.

---

## Summary

- **Appendix A** (modular): Boneh-Durfee, Blömer-May [2], Generalized Rectangle và Lower Triangle của Coppersmith [6] — tất cả là Basic/Extended Strategy với $M_k$ tương ứng.
- **Appendix B** (integer): Blömer-May [3] (Upper Triangle, Extended Rectangle), Ernst et al. [8] (hai cases), Generalized Rect/Triangle [6] — tất cả là Basic/Extended Strategy với $S/M$ tương ứng.
- **Kết luận**: Chiến lược Jochemsz-May là **framework thống nhất** của toàn bộ Coppersmith small roots literature, cho phép phân tích hệ thống và tự động hóa tìm bounds tối ưu.

---

## References

- [1] Boneh, Durfee — *Cryptanalysis of RSA with d < N^{0.292}*, IEEE TIT 2000 (🟡)
- [2] Blömer, May — *New Partial Key Exposure Attacks on RSA*, CRYPTO 2003 (🟡)
- [3] Blömer, May — *A Tool Kit for Finding Small Roots of Bivariate Polynomials over the Integers*, EUROCRYPT 2005 (🟡)
- [6] Coppersmith — *Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities*, J. Cryptology 1997 (🟡)
- [8] Ernst, Jochemsz, May, de Weger — *Partial Key Exposure Attacks up to Full Size Exponents*, EUROCRYPT 2005 (⚪)
