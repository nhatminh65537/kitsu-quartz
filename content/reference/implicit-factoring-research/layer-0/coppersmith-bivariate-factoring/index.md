---
title: "Coppersmith Bivariate Factoring"
type: index
tags: [coppersmith, lattice, rsa, index]
source: "Finding a Small Root of a Bivariate Integer Equation; Factoring with High Bits Known — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

Paper của Coppersmith (EUROCRYPT 1996) trình bày thuật toán giải phương trình đa thức nguyên hai biến với nghiệm bị chặn, và ứng dụng để phân tích $N = PQ$ chỉ cần biết $(1/4)\log_2 N$ bit cao của $P$ — cải thiện đáng kể so với bound $1/3$ trước đó. Course này distill toàn bộ paper thành 5 bài học + 1 appendix kỹ thuật.

**Tài liệu gốc**: Finding a Small Root of a Bivariate Integer Equation — Coppersmith, EUROCRYPT 1996, LNCS 1070 pp. 178–189  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-nen-tang-va-bai-toan|01. Setting and Problem Formulation]]

Cover §1–§2 (setup): phát biểu bài toán tìm nghiệm nhỏ của đa thức nguyên hai biến, polynomial $p(x,y) = (P_0+x)(Q_0+y)-N$, định nghĩa tham số $D$ và điều kiện thành công $(XY)^{3/2} < D$, so sánh với Rivest–Shamir [5].

### [[02-xay-dung-lattice-va-thuat-toan-chinh|02. Lattice Construction and Main Algorithm]]

Cover §2 (full algorithm) + §3: xây họ đa thức $q_{ij}$, ma trận $M_1 \to M_2 \to M_3$, vector nghiệm $\mathbf{s}$, LLL reduction, hyperplane argument → $u(x,y)$, resultant → giải một biến. Theorem 1, Corollary 2, và thảo luận tại sao nhiều polynomial cải thiện bound.

### [[03-chung-minh-dung-dan|03. Correctness Proof — Determinant Bound]]

Chứng minh $|\det(L)| > N^{k/4}$ từ Lemma 4, áp dụng LLL bound [2] để suy ra $|\mathbf{b}_n^*| > k+1 > |\mathbf{s}|$, hyperplane argument → $u(x,y)$, resultant → $v(x_0)=0$. Chứng minh đầy đủ Theorem 1 và Corollary 2.

### [[04-tong-quat-hoa-va-nhieu-bien|04. Generalization and More Variables]]

§4: tổng quát hóa cho bậc $(\delta,\tau)$ với tham số $\alpha$ — điều kiện $X^{\delta+\alpha\tau/2} Y^{\tau+\delta/(2\alpha)} < D$; bậc tổng $\delta$ → $(XY)^\delta < D \cdot 2^{-6\delta^2-2}$. §5: ba biến chỉ là heuristic, NP-hard tổng quát [3].

### [[05-ung-dung-va-so-sanh|05. Applications and Comparisons]]

§6: lý do lũy thừa $p^k$ không giúp trong integer case (khác univariate modular [1]). §7: so sánh với Rivest–Shamir [5] và các kết quả trước. §8: tấn công scheme Vanstone–Zuccherato [7] — lộ $> 1/4$ bits → bị phá.

### [[a0-toeplitz-lemma|A0. Toeplitz Near-Orthogonality — Lemma 4]]

Chứng minh đầy đủ Lemma 4: $M_4$ là Toeplitz 2D, chọn submatrix diagonally dominant, eigenvalue bound → $|\det| \ge D^{k^2} 2^{-6k^2\delta^2-2k^2}$; đúng bằng $D^{k^2}$ khi hệ số lớn nhất ở góc Newton polygon (trường hợp RSA).

---

## Global Notation

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $N = PQ$ | RSA modulus cần phân tích | $N$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $P_0, Q_0$ | Phần đã biết (high bits) của $P, Q$ | $P_0, Q_0$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $x_0, y_0$ | Phần ẩn: $P=P_0+x_0$, $Q=Q_0+y_0$ | $x_0, y_0$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $X, Y$ | Bounds: $\|x_0\| < X$, $\|y_0\| < Y$ | $X, Y$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $D$ | Max term size của $p(x,y)$ trong vùng nghiệm | $D$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $\delta$ | Bậc của $p$ trong mỗi biến riêng lẻ | $\delta$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $\varepsilon$ | Lượng bit dư: biết $(\frac{1}{4}+\varepsilon)\log_2 N$ bits | $\epsilon$ | [[01-nen-tang-va-bai-toan\|Lesson 01]] |
| $k$ | Tham số kích thước lattice; $k > 1/(4\varepsilon)$ | $k$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $q_{ij}(x,y) = x^i y^j p(x,y)$ | Họ đa thức lattice | $q_{ij}$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $r_{gh}$ | Biến nguyên đại diện $x_0^g y_0^h$ | $r_{gh}$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $M_1, M_2, M_3$ | Ma trận lattice qua các bước | $M_1, M_2, M_3$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $L$ | Submatrix vuông $(2k+1)\times(2k+1)$ của $M_3$ | $L$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $\mathbf{s}$ | Vector nghiệm ngắn trong lattice $L$ | $\mathbf{s}$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $u(x,y)$ | Đa thức mới từ hyperplane, $u(x_0,y_0)=0$ | $u(x,y)$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |
| $v(x)$ | Resultant của $p$ và $u$ theo $y$ | $v(x)$ | [[02-xay-dung-lattice-va-thuat-toan-chinh\|Lesson 02]] |

---

## References

### 🟡 Integrated

- [1] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996 — integrated in Lesson 05: so sánh bound $X$ và kỹ thuật $\bmod N^j$
- [5] Rivest & Shamir — *Efficient Factoring Based on Partial Information*, EUROCRYPT 1985 — integrated in Lessons 01, 05: bound $1/3$ bits và kỹ thuật một polynomial
- [7] Vanstone & Zuccherato — *Short RSA Keys and Their Generation*, J. Cryptology 1995 — integrated in Lesson 05: scheme bị tấn công trực tiếp

### 🔴 Prerequisites

- [2] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Integer Coefficients*, Math. Annalen 261, 1982 — LLL basis reduction (nền tảng toán xuyên suốt course)

### ⚪ Citations only

- [3] Manders & Adleman — *NP-complete decision problems for binary quadratics*, J. Comput. System Sci. 16 — giới hạn NP-hard cho 3 biến (§5)
- [4] Maurer — *Factoring with an Oracle*, EUROCRYPT 1992 — so sánh lịch sử (§7)
- [6] Vallée, Girault, Toffin — *How to Guess $\ell$-th Roots Modulo n*, AAECC 6, 1988 — so sánh kỹ thuật (§3, §7)
