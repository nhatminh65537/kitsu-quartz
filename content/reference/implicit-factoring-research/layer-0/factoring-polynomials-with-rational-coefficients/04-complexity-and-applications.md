---
title: "04. Complexity Analysis & Diophantine Applications"
type: deep-dive
tags: [lll, complexity, diophantine-approximation, deep-dive, lesson-04]
aliases: [LLL Complexity, Diophantine Approximation, Q-linear Relations]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[03-lll-reduction-algorithm|03. LLL Basis Reduction Algorithm]] — mô tả thuật toán, proof termination; [[02-reduced-basis-properties|02. Properties of Reduced Bases]] — Proposition (1.9), (1.11)  
> 🔴 **Prerequisite references**: Cassels — *An Introduction to the Geometry of Numbers* [4] (Sect. V.10 — Dirichlet's theorem on simultaneous approximation)  
> **Lesson type**: Deep Dive  
> **Covers**: §1: (1.26)–(1.35) complexity analysis, (1.37)–(1.38) remarks, (1.39) Proposition — Simultaneous Diophantine Approximation, Q-linear relations và algebraicity testing
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $B$ | Bound: $\|b_i\|^2 \le B$ với mọi $i$ (input bound) |
> | $d_i$ | $\det((b_j,b_l))_{1\le j,l\le i} = \prod_{j=1}^i B_j$ |
> | $D$ | Potential function $\prod_{i=1}^{n-1} d_i$ |
> | $\alpha_1, \ldots, \alpha_n$ | Số thực cần xấp xỉ đồng thời |
> | $\varepsilon$ | Sai số mục tiêu trong Diophantine approximation |
> | $p_i, q$ | Nghiệm nguyên: $|p_i - q\alpha_i| < \varepsilon$ |

---

## Động lực

Biết rằng thuật toán LLL kết thúc là chưa đủ — cần biết nó kết thúc **nhanh như thế nào** và các số trung gian **lớn đến đâu** để không bị overflow. Bài này trả lời hai câu hỏi đó qua Proposition (1.26), sau đó trình bày hai ứng dụng đẹp của LLL ngoài bài toán factoring: xấp xỉ Diophantine đồng thời và tìm quan hệ tuyến tính hữu tỉ.

---

## Proposition (1.26) — Complexity

> [!abstract] Proposition 1.26
> Cho $L \subset \mathbb{Z}^n$ là lattice với basis $b_1, \ldots, b_n \in \mathbb{Z}^n$, và $B \in \mathbb{R}$, $B \ge 2$, sao cho $\|b_i\|^2 \le B$ với mọi $1 \le i \le n$. Khi đó:
>
> - **Số arithmetic operations** cần bởi thuật toán LLL là $O(n^4 \log B)$.
> - **Các số nguyên** mà các operations này thao tác trên đó có **binary length** $O(n \log B)$.

**Remark về bit operations**: Dùng các thuật toán nhân/chia cổ điển, số **bit operations** là $O(n^6 (\log B)^3)$. Dùng fast multiplication, giảm xuống $O(n^{5+\varepsilon}(\log B)^{2+\varepsilon})$ với mọi $\varepsilon > 0$.

### Proof — Ước lượng số lần Case 1 và Case 2

**Khởi đầu**: Từ (1.25), $d_i \le B^i$ tại đầu thuật toán. Do đó:

$$
D \le \prod_{i=1}^{n-1} B^i = B^{n(n-1)/2}
$$

**Suốt thuật toán**: Vì $d_i \in \mathbb{Z}$ (từ (1.24), Gram matrix có entries nguyên khi $b_i \in \mathbb{Z}^n$) và $d_i > 0$, ta có $D \ge 1$ suốt quá trình chạy.

**Bound số Case 1**: Mỗi Case 1 giảm $D$ ít nhất hệ số $3/4$. Số lần Case 1 tối đa:

$$
\left(\frac{3}{4}\right)^{\#\text{Case 1}} \cdot D_{\text{init}} \ge D \ge 1 \implies \#\text{Case 1} \le \frac{\log D_{\text{init}}}{\log(4/3)} = O(n^2 \log B)
$$

Số Case 2 $\le$ số Case 1 $+ (n-1) = O(n^2 \log B)$.

**Số operations mỗi case**:
- Case 1: $O(n)$ operations (cập nhật $\mu$, $B$).
- Case 2: mỗi giá trị $l$ cần $O(n)$ operations; có $O(n)$ giá trị $l$ → $O(n^2)$ operations.

Nhưng Case 2 xảy ra $O(n^2 \log B)$ lần → tổng $O(n^4 \log B)$ operations. $\checkmark$

### Proof — Biểu Diễn Nguyên và Binary Length

Để biểu diễn tất cả số xuất hiện bằng số nguyên, paper theo dõi thêm $d_i$ (làm mẫu số chung). Ba bổ đề then chốt:

> [!note] Lemma 3.1 — Integer Representation
>
> $$
> \|b_i^*\|^2 = d_i / d_{i-1} \tag{1.27}
> $$
>
> $$
> d_{i-1} b_i^* \in L \subset \mathbb{Z}^n \tag{1.28}
> $$
>
> $$
> d_j \mu_{ij} \in \mathbb{Z} \qquad (1 \le j < i \le n) \tag{1.29}
> $$

**Proof của (1.27)**: trực tiếp từ (1.25): $d_i = \prod_{j=1}^i B_j$, suy ra $d_i/d_{i-1} = B_i = \|b_i^*\|^2$.

**Proof của (1.28)**: Viết $b_i^* = b_i - \sum_{r=1}^{i-1} \lambda_{ir} b_r$ với $\lambda_{ir} \in \mathbb{R}$. Giải $\lambda_{i1}, \ldots, \lambda_{i,i-1}$ từ hệ $(b_i, b_l) = \sum_{j=1}^{i-1} \lambda_{ij}(b_j, b_l)$ ($1 \le l \le i-1$). Dùng (1.24), Cramer's rule cho $d_{i-1} \lambda_{ij} \in \mathbb{Z}$, suy ra $d_{i-1} b_i^* \in \mathbb{Z}^n$.

**Proof của (1.29)**: $d_j \mu_{ij} = d_j (b_i, b_j^*)/(b_j^*, b_j^*) = d_{j-1}(b_i, b_j^*) = (b_i, d_{j-1} b_j^*) \in \mathbb{Z}$ theo (1.28).

**Ước lượng binary length**: Vì $d_i \le B^i$ suốt thuật toán (không bao giờ tăng), và $d_j \mu_{ij} \in \mathbb{Z}$, $d_j \le B^j$, nên mọi $\mu_{ij}$ có mẫu số $\le B^n$ và tử số bounded. Từ các bounds trong (1.30)–(1.35) của paper:

$$
\|b_i\|^2 \le n^2 (4B)^n, \qquad |\mu_{ij}| \le 2^{n-1}(nB^{n-1})^{1/2}
$$

Các số trung gian có binary length $O(n \log B)$. $\blacksquare$

### Remarks về Điều Kiện

> [!info] Remark (1.38) — Điều Kiện Tổng Quát Hơn
> Proof của (1.26) vẫn đúng nếu thay điều kiện $L \subset \mathbb{Z}^n$ bằng $(b_i, b_j) \in \mathbb{Z}$ với mọi $i, j$ (inner product nguyên). Điều kiện yếu hơn $(b_i, b_j) \in \mathbb{Q}$ cũng đủ, nhưng cần clear denominators trước khi áp dụng (1.26).

---

## Application 1 — Simultaneous Diophantine Approximation

**Bài toán cổ điển** (Dirichlet): Cho $\alpha_1, \ldots, \alpha_n \in \mathbb{R}$ và $0 < \varepsilon < 1$, tồn tại nguyên $p_1, \ldots, p_n, q$ sao cho:

$$
|p_i - q\alpha_i| \le \varepsilon \quad (1 \le i \le n), \qquad 1 \le q \le \varepsilon^{-n}
$$

Tuy nhiên, Dirichlet's theorem chỉ chứng minh *sự tồn tại*, không cho thuật toán đa thức. LLL giải quyết điều này:

> [!abstract] Proposition 1.39 — Simultaneous Diophantine Approximation
> Tồn tại thuật toán thời gian đa thức (dùng LLL) mà, cho $n \in \mathbb{Z}_{>0}$ và $\alpha_1, \ldots, \alpha_n, \varepsilon \in \mathbb{Q}$ với $0 < \varepsilon < 1$, tìm được nguyên $p_1, \ldots, p_n, q$ sao cho:
>
> $$
> |p_i - q\alpha_i| \le \varepsilon \quad (1 \le i \le n), \qquad 1 \le q \le 2^{n(n+1)/4} \varepsilon^{-n}
> $$

Bound $q$ yếu hơn Dirichlet tối đa hệ số $2^{n(n+1)/4}$ — nhưng đổi lại ta có thuật toán đa thức.

**Proof.**

Xây dựng lattice $L$ rank $n+1$ được span bởi các cột của ma trận $(n+1) \times (n+1)$:

$$
M = \begin{pmatrix} 1 & 0 & \cdots & 0 & -\alpha_1 \\ 0 & 1 & \cdots & 0 & -\alpha_2 \\ \vdots & & \ddots & & \vdots \\ 0 & 0 & \cdots & 1 & -\alpha_n \\ 0 & 0 & \cdots & 0 & 2^{-n(n+1)/4} \varepsilon^{n+1} \end{pmatrix}
$$

Inner product của hai cột bất kỳ là hữu tỉ (vì $\alpha_i \in \mathbb{Q}$), nên theo Remark (1.38), LLL áp dụng được trong thời gian đa thức để tìm reduced basis $b_1, \ldots, b_{n+1}$.

Tính $d(L) = 2^{-n(n+1)/4}\varepsilon^{n+1}$. Từ (1.9): $\|b_1\| \le 2^{n/4} d(L)^{1/(n+1)} = \varepsilon$.

Vì $b_1 \in L$, viết $b_1 = (p_1 - q\alpha_1, \ldots, p_n - q\alpha_n,\, q \cdot 2^{-n(n+1)/4}\varepsilon^{n+1})^\top$ với $p_i, q \in \mathbb{Z}$. Từ $\|b_1\| \le \varepsilon$:

$$
|p_i - q\alpha_i| \le \varepsilon \quad \text{và} \quad |q| \le 2^{n(n+1)/4}\varepsilon^{-n}
$$

Vì $\varepsilon < 1$ và $b_1 \ne 0$ nên $q \ne 0$; thay $b_1 \to -b_1$ nếu cần để $q > 0$. $\blacksquare$

---

## Application 2 — Q-linear Relations và Algebraicity Testing

**Bài toán**: Cho $\alpha_1, \ldots, \alpha_n \in \mathbb{R}$, tìm quan hệ $\mathbb{Q}$-tuyến tính $\sum m_i \alpha_i = 0$ với $m_i \in \mathbb{Z}$ nhỏ (hoặc xác nhận không tồn tại trong một ngưỡng nào đó).

**Phương pháp LLL**: Nhúng $\mathbb{Z}^n$ vào $\mathbb{R}^{n+1}$ bởi:

$$
(m_1, \ldots, m_n) \mapsto \left(m_1, \ldots, m_n,\; c \sum_{i=1}^n m_i \alpha_i'\right)
$$

trong đó $c$ là hằng số lớn và $\alpha_i'$ là xấp xỉ hữu tỉ tốt của $\alpha_i$. Vector đầu của reduced basis cho $m_1, \ldots, m_n$ không quá lớn sao cho $\sum m_i \alpha_i$ rất nhỏ.

**Ứng dụng testing algebraicity**: Đặt $\alpha_i = \alpha^{i-1}$. Nếu $\alpha$ thỏa đa thức bậc $\le n-1$ với hệ số nguyên nhỏ, LLL sẽ tìm ra đa thức bất khả quy của $\alpha$.

> [!tip] 💡 Agent note
> Ứng dụng này gợi ý một **thuật toán factoring khác** với p-adic method của §3: lấy $\alpha$ là nghiệm của $f$, dùng LLL trên monomials $1, \alpha, \ldots, \alpha^{n-1}$ để tìm nhân tử bất khả quy. Paper đề cập điều này nhưng không phát triển đầy đủ, và chọn p-adic approach cho §3 vì phân tích phức tạp hơn ít.

---

## Summary

| Kết quả | Nội dung |
|--------|---------|
| Prop (1.26) | LLL cần $O(n^4 \log B)$ arithmetic ops; integers có binary length $O(n \log B)$ |
| (1.27)–(1.29) | $d_i$ làm mẫu số chung: $\|b_i^*\|^2 = d_i/d_{i-1}$, $d_j\mu_{ij} \in \mathbb{Z}$ |
| Remark (1.37) | Partial reduction: khi $k$ đạt $n'+1$, $b_1,\ldots,b_{n'}$ là reduced basis rank $n'$ |
| Remark (1.38) | Điều kiện $L \subset \mathbb{Z}^n$ có thể thay bằng $(b_i,b_j) \in \mathbb{Z}$ |
| Prop (1.39) | Diophantine approximation đa thức: $q \le 2^{n(n+1)/4}\varepsilon^{-n}$ |

**Bài tiếp theo** ([[05-factors-and-lattices-setup|05. Factors and Lattices — Setup]]) bắt đầu §2: thiết lập kết nối giữa **nhân tử đa thức** và **phần tử ngắn của lattice** — bước then chốt để áp dụng LLL vào bài toán factoring.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite — Sect. V.10 Dirichlet's theorem)
