---
title: "Finding Small Roots of Bivariate Integer Polynomial Equations"
type: index
tags: [coppersmith, lattice, small-roots, bivariate, rsa, index]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

Paper của Coron đề xuất một thuật toán đơn giản hóa nhưng **polynomial-time** để tìm nghiệm nhỏ của phương trình đa thức hai biến trên $\mathbb{Z}$, khắc phục độ phức tạp sub-exponential của phiên bản đơn giản hóa trước đó (Coron 2004). Course này distill toàn bộ nội dung paper — từ nền tảng lattice, construction thuật toán, phân tích determinant, đến ứng dụng tấn công RSA.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-introduction-and-lattice-primitives|01. Introduction & Lattice Primitives]]

Giới thiệu bài toán tìm nghiệm nhỏ bivariate, context Coppersmith's two theorems, và nền tảng lattice cần thiết: định nghĩa lattice, Theorem 1 (LLL bound), Lemma 1 (column operations), Lemma 2 (Howgrave-Graham).

### [[02-algorithm-construction|02. Algorithm Construction]]

Xây dựng tập đa thức $s_{a,b}$, $r_{i,j}$; chọn $n = |\det S|$ tường minh; xây dựng ma trận $M$, sublattice $L_2$; điều kiện Howgrave-Graham (5); chứng minh $h(x,y)$ không phải bội của $p(x,y)$ → resultant.

### [[03-determinant-computation|03. Determinant Computation]]

Chuỗi biến đổi ma trận $M' \to M_2' \to \cdots \to M_6'$; chứng minh $\det L' = n^\omega$; suy ra $\det L_2' = n^{\omega-1}$; tính $\det L_2$ đầy đủ với nhân tử $X^i Y^j$.

*(Cập nhật dần sau mỗi lesson được sinh.)*

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $p(x,y)$ | Đa thức hai biến hệ số nguyên, bậc $\delta$ độc lập trong $x,y$ | $p(x,y)$ | [[01-introduction-and-lattice-primitives\|Lesson 01]] |
| $(x_0, y_0)$ | Nghiệm nguyên cần tìm | $(x_0, y_0)$ | [[01-introduction-and-lattice-primitives\|Lesson 01]] |
| $X, Y$ | Bound trên $\|x_0\|$, $\|y_0\|$ | $X, Y$ | [[01-introduction-and-lattice-primitives\|Lesson 01]] |
| $\delta$ | Bậc tối đa của $p$ trong mỗi biến | $\delta$ | [[01-introduction-and-lattice-primitives\|Lesson 01]] |
| $W$ | $\max_{i,j} \|p_{ij}\| X^i Y^j$ — weighted coefficient norm | $W$ | [[01-introduction-and-lattice-primitives\|Lesson 01]] |
| $k$ | Tham số điều chỉnh kích thước lattice ($k > 0$) | $k$ | [[02-algorithm-construction\|Lesson 02]] |
| $n$ | $|\det S|$ — modulus chọn tường minh | $n$ | [[02-algorithm-construction\|Lesson 02]] |
| $s_{a,b}(x,y)$ | $x^a y^b \cdot p(x,y)$ với $0 \le a,b < k$ | $s_{a,b}$ | [[02-algorithm-construction\|Lesson 02]] |
| $r_{i,j}(x,y)$ | $x^i y^j \cdot n$ với $0 \le i,j < k+\delta$ | $r_{i,j}$ | [[02-algorithm-construction\|Lesson 02]] |
| $S$ | Ma trận $k^2 \times k^2$ — hệ số của $s_{a,b}$ trong monomial $x^{i_0+i}y^{j_0+j}$ | $S$ | [[02-algorithm-construction\|Lesson 02]] |
| $(i_0, j_0)$ | Chỉ số tối ưu hóa $|\det S|$ | $(i_0, j_0)$ | [[02-algorithm-construction\|Lesson 02]] |
| $L$ | Lattice sinh bởi hệ số của $s_{a,b}(xX,yY)$ và $r_{i,j}(xX,yY)$ | $L$ | [[02-algorithm-construction\|Lesson 02]] |
| $L_2$ | Sublattice của $L$, chiều $\omega = \delta^2 + 2k\delta$ | $L_2$ | [[02-algorithm-construction\|Lesson 02]] |
| $\omega$ | $\dim L_2 = \delta^2 + 2k\delta$ | $\omega$ | [[02-algorithm-construction\|Lesson 02]] |
| $M$ | Ma trận chữ nhật đại diện cho $L$ | $M$ | [[02-algorithm-construction\|Lesson 02]] |
| $M'$ | Ma trận $M$ không có lũy thừa $X^i Y^j$ | $M'$ | [[03-determinant-computation\|Lesson 03]] |

---

## References

### 🟡 Integrated

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 1982 — integrated in Lesson 01: Theorem 1 (LLL bound và complexity)
- [HG97] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, Cryptography and Coding 1997 — integrated in Lesson 01: Lemma 2
- [NS05] Nguyen–Stehlé — *Floating-Point LLL Revisited*, Eurocrypt 2005 — integrated in Lesson 04: complexity $O(\log^{11} W)$ dùng L² algorithm
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997 — integrated in Lessons 03–04: Lemma 3 proof structure
- [Cor04] Coron — *Finding Small Roots of Bivariate Polynomial Equations Revisited*, Eurocrypt 2004 — integrated in Lesson 05: so sánh dimension và complexity
- [HM91] Hafner–McCurley — *Triangularization of Matrices over Rings*, SIAM 1991 — integrated in Lesson 04: triangularization complexity

### 🔴 Prerequisites

- [Cop96a] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, Eurocrypt 1996 — univariate Coppersmith technique
- [Cop96b] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, Eurocrypt 1996 — original bivariate algorithm

### ⚪ Citations only

- [BD99] Boneh–Durfee, *Cryptanalysis of RSA with d < N^0.292*, Eurocrypt 1999
- [BDH99] Boneh–Durfee–Howgrave-Graham, *Factoring N=p^r q for large r*, Crypto 1999
- [BM05] Blömer–May, *A Tool Kit for Finding Small Roots*, Eurocrypt 2005
- [JM06] Jochemsz–May, *Strategy for Finding Roots of Multivariate Polynomials*, Asiacrypt 2006
- [Sho] Shoup — *NTL library*, www.shoup.net
