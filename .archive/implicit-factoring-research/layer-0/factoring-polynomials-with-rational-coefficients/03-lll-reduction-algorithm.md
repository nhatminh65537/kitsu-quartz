---
title: "03. LLL Basis Reduction Algorithm"
type: scheme
tags: [lll, lattice, basis-reduction, algorithm, scheme, lesson-03]
aliases: [LLL Algorithm, LLL Reduction, Lattice Reduction Algorithm]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[01-lattice-basics-gram-schmidt|01. Lattice Basics & Gram-Schmidt]] — định nghĩa lattice, Gram-Schmidt, reduced basis; [[02-reduced-basis-properties|02. Properties of Reduced Bases]] — Propositions (1.6), (1.11), (1.12)  
> 🔴 **Prerequisite references**: Cassels — *An Introduction to the Geometry of Numbers* [4] (Chap. I Lemma 4, Chap. II Theorem I — dùng trong proof termination)  
> **Lesson type**: Scheme  
> **Covers**: §1: (1.15) mô tả thuật toán, Fig. 1 pseudocode, (1.22) formulae for Case 1, (1.23)–(1.25) proof of termination
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $b_1, \ldots, b_n$ | Basis hiện tại của lattice $L \subset \mathbb{Z}^n$, thay đổi trong quá trình chạy |
> | $b_1^*, \ldots, b_n^*$ | Gram-Schmidt vectors, cập nhật theo $b_i$ |
> | $\mu_{ij}$ | Gram-Schmidt coefficients |
> | $B_i = \|b_i^*\|^2$ | Bình phương norm của Gram-Schmidt vector thứ $i$ |
> | $k$ | Chỉ số hiện tại (current subscript) của thuật toán, $k \in \{1, \ldots, n+1\}$ |
> | $d_i$ | Quantity $\det((b_j, b_l))_{1 \le j,l \le i}$ — determinant của Gram matrix của $i$ vector đầu |
> | $D$ | Potential function $D = \prod_{i=1}^{n-1} d_i$ |
> | $m(L)$ | $\min\{\|x\|^2 : x \in L, x \ne 0\}$ — shortest vector squared length |

---

## Động lực

Lesson 01 định nghĩa **reduced basis** (thỏa $|\mu_{ij}| \le 1/2$ và Lovász condition), và Lesson 02 chứng minh rằng một reduced basis có các bounds tốt — đặc biệt $b_1$ xấp xỉ shortest vector. Nhưng: *làm thế nào để biến đổi một basis tùy ý thành reduced basis?*

Đây là câu hỏi thuật toán cốt lõi. Thuật toán LLL (mục 1.15) trả lời bằng một quá trình **hai thao tác lặp đi lặp lại**:

1. **Size reduction**: điều chỉnh $b_k$ để đảm bảo $|\mu_{kj}| \le 1/2$.
2. **Swap**: nếu Lovász condition vi phạm giữa $b_{k-1}$ và $b_k$, đổi chỗ chúng.

Mỗi swap giảm một **potential function** $D$ xuống ít nhất hệ số $3/4$. Vì $D$ bị chặn dưới, thuật toán phải kết thúc.

---

## Thuật Toán LLL

### Khởi tạo và Invariant

Thuật toán duy trì một **chỉ số hiện tại** $k \in \{2, \ldots, n+1\}$. Bắt đầu với $k = 2$.

Tại mỗi bước, thuật toán ở trong trạng thái thỏa mãn hai điều kiện sau cho tất cả $i < k$:

$$
|\mu_{ij}| \le \frac{1}{2} \quad \text{với mọi } 1 \le j < i < k \tag{1.16}
$$

$$
|b_i^* + \mu_{i,i-1} b_{i-1}^*|^2 \ge \frac{3}{4}|b_{i-1}^*|^2 \quad \text{với mọi } 1 < i < k \tag{1.17}
$$

Nói cách khác: $b_1, \ldots, b_{k-1}$ đã thỏa mãn cả hai điều kiện reduced basis — phần đã xử lý xong.

> [!note] Scheme 3.1 — LLL Basis Reduction Algorithm
> **Type**: Lattice Basis Transformation  
> **Setting**: Lattice $L \subset \mathbb{Z}^n$ với basis $b_1, \ldots, b_n \in \mathbb{Z}^n$
>
> **$\mathsf{LLLReduce}(b_1, \ldots, b_n)$**
> - Input: Basis $b_1, \ldots, b_n$ của lattice $L$
> - Output: Reduced basis $b_1, \ldots, b_n$ của cùng lattice $L$
>
> **Khởi tạo:**
> - Tính $b_i^*$, $\mu_{ij}$, $B_i = \|b_i^*\|^2$ theo (1.2)–(1.3) cho mọi $i$
> - Đặt $k := 2$
>
> **Lặp:** Trong khi $k \le n$:
>
> **Bước 1 — Size-reduce $b_k$ với $b_{k-1}$** (đạt điều kiện (1.18)):
> - Nếu $|\mu_{k,k-1}| > 1/2$: gọi $r = \mathsf{round}(\mu_{k,k-1})$; thực hiện $\mathsf{SizeReduce}(k, k-1, r)$
>
> **Bước 2 — Kiểm tra Lovász:**
> - Tính $B := B_k + \mu_{k,k-1}^2 B_{k-1}$
> - **Case 1** — Nếu $k \ge 2$ và $B_k < (3/4 - \mu_{k,k-1}^2) B_{k-1}$ (tức $B < \frac{3}{4} B_{k-1}$):
>   - Thực hiện $\mathsf{Swap}(k)$ — đổi chỗ $b_{k-1}$ và $b_k$, cập nhật $b^*$, $\mu$, $B$
>   - Đặt $k := \max(k-1, 2)$
> - **Case 2** — Ngược lại:
>   - Thực hiện $\mathsf{SizeReduce}(k, j, r)$ cho $j = k-2, k-3, \ldots, 1$ (từng $j$ theo thứ tự giảm)
>   - Đặt $k := k + 1$
>
> **Kết thúc:** Khi $k = n + 1$, basis $b_1, \ldots, b_n$ là reduced.

**Subroutine $\mathsf{SizeReduce}(k, l, r)$:**  
Thay $b_k := b_k - r \cdot b_l$; cập nhật $\mu_{kj} := \mu_{kj} - r \cdot \mu_{lj}$ với $j < l$; $\mu_{kl} := \mu_{kl} - r$. Các $b_i^*$ không đổi.

### Pseudocode (Fig. 1 trong paper)

```text
Khởi tạo:
  b*_i := b_i
  mu_ij := (b_i, b*_j) / B_j   for j = 1,...,i-1
  b*_i := b*_i - mu_ij * b*_j
  B_i  := (b*_i, b*_i)
  (for i = 1,...,n)
  k := 2

(1) Thực hiện (*) với l = k-1
    if B_k < (3/4 - mu_{k,k-1}^2) * B_{k-1}: goto (2)
    Thực hiện (*) với l = k-2, k-3, ..., 1
    if k = n: terminate
    k := k+1
    goto (1)

(2) mu := mu_{k,k-1}
    B  := B_k + mu^2 * B_{k-1}
    mu_{k,k-1} := mu * B_{k-1} / B
    B_k := B_{k-1} * B_k / B
    B_{k-1} := B
    swap(b_{k-1}, b_k)
    swap rows/cols trong mu theo công thức (1.22)
    if k > 2: k := k-1
    goto (1)

(*) Nếu |mu_{kl}| > 1/2:
      r := round(mu_{kl})
      b_k := b_k - r * b_l
      mu_{kj} := mu_{kj} - r * mu_{lj}   for j = 1,...,l-1
      mu_{kl} := mu_{kl} - r
```

---

## Formulae cho Case 1 — Swap Step

Khi swap $b_{k-1}$ và $b_k$, cần cập nhật $b^*$, $\mu$. Paper (mục 1.22) cho các công thức tường minh.

Gọi $c_i, c_i^*, \nu_{ij}$ là các giá trị mới sau swap. Basis mới:

$$
c_{k-1} = b_k, \quad c_k = b_{k-1}, \quad c_i = b_i \text{ với } i \ne k-1, k
$$

**Cập nhật $c_{k-1}^*$**: Do $c_{k-1}^*$ là hình chiếu của $b_k$ lên phần bù trực giao của $\text{span}\{b_1, \ldots, b_{k-2}\}$:

$$
c_{k-1}^* = b_k^* + \mu_{k,k-1} b_{k-1}^*
$$

**Cập nhật $c_k^*$** (hình chiếu của $b_{k-1}$ lên phần bù của $\mathbb{R} c_{k-1}^*$):

$$
\nu_{k,k-1} = \mu_{k,k-1} \frac{\|b_{k-1}^*\|^2}{\|c_{k-1}^*\|^2}, \qquad c_k^* = b_{k-1}^* - \nu_{k,k-1} c_{k-1}^*
$$

Chú ý: $\|c_{k-1}^*\|^2 = B_k + \mu_{k,k-1}^2 B_{k-1} = B$ (đã tính ở bước kiểm tra).

**Cập nhật $\mu$ cho $i > k$**:

$$
\nu_{i,k-1} = \mu_{i,k-1} \nu_{k,k-1} + \mu_{ik} \frac{\|b_k^*\|^2}{\|c_{k-1}^*\|^2}, \qquad \nu_{ik} = \mu_{i,k-1} - \mu_{ik} \mu_{k,k-1}
$$

**Các $\mu$ còn lại** không đổi: $\nu_{k-1,j} = \mu_{kj}$, $\nu_{kj} = \mu_{k-1,j}$ với $j < k-1$; và $\nu_{ij} = \mu_{ij}$ nếu $\{i,j\} \cap \{k-1, k\} = \emptyset$.

> [!tip] 💡 Agent note
> Quan sát then chốt từ swap: $\|c_{k-1}^*\|^2 = B < \frac{3}{4} B_{k-1} = \frac{3}{4}\|b_{k-1}^*\|^2$. Nghĩa là sau mỗi swap, Gram-Schmidt vector ở vị trí $k-1$ **giảm ít nhất hệ số $3/4$**. Đây là động lực giảm của potential function $D$.

---

## Proof Termination — Potential Function

### Định nghĩa $d_i$ và $D$

> [!note] Định nghĩa 3.2 — Quantities $d_i$
> Với $0 \le i \le n$, đặt:
>
> $$
> d_i = \det\bigl((b_j, b_l)\bigr)_{1 \le j, l \le i} \tag{1.24}
> $$
>
> (Gram matrix determinant của $i$ vector đầu tiên.) Quy ước $d_0 = 1$.
>
> Dễ kiểm tra:
>
> $$
> d_i = \prod_{j=1}^{i} \|b_j^*\|^2 = \prod_{j=1}^{i} B_j \tag{1.25}
> $$
>
> Đặt **potential function**:
>
> $$
> D = \prod_{i=1}^{n-1} d_i
> $$

Chú ý: $d_0 = 1$, $d_n = d(L)^2$ (không đổi suốt thuật toán).

### $D$ Giảm Trong Case 1, Bị Chặn Dưới

> [!abstract] Proposition 3.3 — Termination
> Thuật toán LLL kết thúc sau hữu hạn bước.

**Proof.**

**$D$ chỉ thay đổi trong Case 1 (swap).** Trong Case 2, basis thay đổi bằng phép trừ bội nguyên (unimodular operation) nên $d_i$ không đổi, và $D$ không đổi.

**Trong Case 1**, chỉ $d_{k-1}$ thay đổi. Từ (1.25):

$$
d_{k-1}^{\text{new}} = \prod_{j=1}^{k-1} \|c_j^*\|^2
$$

Các $c_j^* = b_j^*$ với $j < k-1$ không đổi. Còn $\|c_{k-1}^*\|^2 = B < \frac{3}{4} B_{k-1} = \frac{3}{4}\|b_{k-1}^*\|^2$, nên:

$$
d_{k-1}^{\text{new}} < \frac{3}{4} d_{k-1}^{\text{old}}
$$

Do đó $D$ giảm ít nhất hệ số $\frac{3}{4}$ mỗi lần qua Case 1.

**$D$ bị chặn dưới dương.** Với $i > 0$, giải thích $d_i$ là bình phương determinant của lattice rank $i$ được span bởi $b_1, \ldots, b_i$. Theo [4, Chap. I Lemma 4 và Chap. II Theorem I], lattice này chứa vector $x$ với $\|x\|^2 \le (4/3)^{(i-1)/2} d_i^{1/i}$, suy ra:

$$
d_i \ge \left(\frac{3}{4}\right)^{i(i-1)/2} m(L)^i > 0
$$

Do đó $D \ge \prod_{i=1}^{n-1} \left(\frac{3}{4}\right)^{i(i-1)/2} m(L)^i > 0$.

**Kết luận**: $D$ giảm theo hệ số $3/4$ mỗi Case 1, nhưng bị chặn dưới dương, nên số lần Case 1 là hữu hạn. Số lần Case 2 chỉ nhiều hơn Case 1 tối đa $n-1$ lần (vì $k$ tăng trong Case 2, giảm trong Case 1, và $2 \le k \le n+1$). Suy ra thuật toán kết thúc. $\blacksquare$

### Tương Quan Case 1 và Case 2

Trong Case 1: $k$ giảm 1 (quay lui). Trong Case 2: $k$ tăng 1 (tiến lên). Ban đầu $k = 2$, luôn $k \le n+1$. Do đó số lần Case 2 $\le$ số lần Case 1 $+ (n-1)$. Cả hai đều bị chặn.

---

## Tính Đúng Đắn

Khi $k = n+1$, hai điều kiện (1.16) và (1.17) được thỏa cho toàn bộ $i \le n$ — đúng nghĩa là reduced basis theo định nghĩa (1.4)–(1.5). Thuật toán duy trì các basis vector luôn span cùng lattice $L$ (vì tất cả phép biến đổi là unimodular). Do đó output là một reduced basis của $L$.

> [!success] Kết quả
> Thuật toán LLL nhận vào một basis tùy ý của lattice $L \subset \mathbb{Z}^n$ và trả về một **reduced basis** của cùng lattice $L$ sau hữu hạn bước.

---

## Remark (1.37) — Partial Reduction

> [!info] Remark 1.37 — Partial Reduction
> Cho $1 \le n' \le n$. Nếu $k$ lần đầu tiên đạt giá trị $n' + 1$ trong quá trình chạy thuật toán, thì tại thời điểm đó, $b_1, b_2, \ldots, b_{n'}$ tạo thành một **reduced basis** của lattice rank $n'$ được span bởi $n'$ vector đầu của basis ban đầu.

Remark này sẽ được dùng trong §3 (Remark 3.10): cho phép tránh bước gcd computation bằng cách nhận diện $h_0 = b_1$ ngay khi $k$ vượt qua $m_0 + 1$.

---

## Summary

Thuật toán LLL biến đổi basis tùy ý → reduced basis qua hai thao tác:

- **Size reduction** ($\mathsf{SizeReduce}$): khử các $\mu_{kj}$ lớn bằng phép trừ bội nguyên — không làm thay đổi $b_i^*$, không ảnh hưởng $D$.
- **Swap** (Case 1): đổi chỗ $b_{k-1}, b_k$ khi Lovász condition vi phạm — giảm $D$ ít nhất hệ số $3/4$.

Termination: $D$ giảm mỗi swap nhưng bị chặn dưới (từ lower bound của $m(L)$) → hữu hạn swaps → hữu hạn bước.

**Bài tiếp theo** ([[04-complexity-and-applications|04. Complexity Analysis & Diophantine Applications]]) sẽ phân tích chính xác **số lần** Case 1 và Case 2 xảy ra, từ đó rút ra bound $O(n^4 \log B)$ arithmetic operations, và trình bày hai ứng dụng: Simultaneous Diophantine Approximation và tìm quan hệ $\mathbb{Q}$-tuyến tính.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite — Chap. I Lemma 4, Chap. II Theorem I, dùng trong proof termination)
- [9] Lenstra HW — *Integer programming with a fixed number of variables* (🔴 Prerequisite — prior basis reduction algorithm được cải thiện ở đây)
