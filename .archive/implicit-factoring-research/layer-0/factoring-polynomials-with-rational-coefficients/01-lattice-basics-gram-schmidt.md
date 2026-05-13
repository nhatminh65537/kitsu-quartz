---
title: "01. Lattice Basics & Gram-Schmidt Orthogonalization"
type: math-component
tags: [lll, lattice, gram-schmidt, math-component, lesson-01]
aliases: [Lattice Basics, Gram-Schmidt, Reduced Basis Definition]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: Đại số tuyến tính (vector space, linear independence, inner product, orthogonality), số học nguyên tố cơ bản  
> 🔴 **Prerequisite references**: Cassels — *An Introduction to the Geometry of Numbers* [4] (lý thuyết lattice nền tảng, Chap. I–II)  
> **Lesson type**: Math Component  
> **Covers**: Introduction (algorithm outline), §1: (1.1)–(1.5) — Định nghĩa lattice, determinant, Gram-Schmidt, reduced basis
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{R}^n$ | Không gian vector thực $n$ chiều |
> | $\mathbb{Z}$ | Tập số nguyên |
> | $L$ | Lattice (tập điểm nguyên trong $\mathbb{R}^n$) |
> | $b_1, \ldots, b_n$ | Basis vectors của lattice |
> | $b_1^*, \ldots, b_n^*$ | Gram-Schmidt orthogonal vectors (ký hiệu paper: $b_i^*$) |
> | $\mu_{ij}$ | Gram-Schmidt coefficients ($1 \le j < i \le n$) |
> | $d(L)$ | Determinant của lattice $L$ |
> | $(\cdot, \cdot)$ | Inner product thông thường trên $\mathbb{R}^n$ |
> | $|\cdot|$ | Euclidean norm |

---

## Động lực

Paper Lenstra-Lenstra-Lovász (1982) giải quyết bài toán: *Cho đa thức $f \in \mathbb{Q}[X]$, tìm phân tích thành các nhân tử bất khả quy trong $\mathbb{Q}[X]$ trong thời gian đa thức.* Đây là bài toán cổ điển trong số học đại số, nhưng trước 1982 chưa có thuật toán đa thức nào được biết đến.

Ý tưởng cốt lõi của paper: nhân tử bất khả quy $h_0$ của $f$ vừa phải chia hết $f$, vừa phải có hệ số nhỏ. Điều này nghĩa là $h_0$ là một **phần tử ngắn** trong một lattice xác định. Bài toán tìm phần tử ngắn trong lattice được giải bằng **thuật toán LLL basis reduction** — đây là đóng góp chính của paper.

Bài học này xây dựng nền tảng toán học cần thiết: định nghĩa lattice, determinant, Gram-Schmidt orthogonalization, và khái niệm **reduced basis** — tiêu chuẩn chất lượng của một basis lattice.

---

## Lattice — Định nghĩa và Determinant

> [!note] Định nghĩa 1.1 — Lattice
> Cho $n$ là số nguyên dương. Một tập con $L$ của không gian vector thực $\mathbb{R}^n$ được gọi là **lattice** (mạng điểm) nếu tồn tại một basis $b_1, b_2, \ldots, b_n$ của $\mathbb{R}^n$ sao cho
>
> $$
> L = \sum_{i=1}^{n} \mathbb{Z} b_i = \left\{ \sum_{i=1}^{n} r_i b_i : r_i \in \mathbb{Z},\ 1 \le i \le n \right\}
> $$
>
> Ta nói $b_1, \ldots, b_n$ là một **basis** của $L$, hay chúng **span** $L$. Số $n$ được gọi là **rank** của $L$.

Trực quan: lattice là tập hợp tất cả các tổ hợp **nguyên** của các basis vector. Không gian vector cho phép hệ số thực, còn lattice chỉ cho hệ số nguyên.

> [!example] Ví dụ 1.1 — Lattice trong $\mathbb{R}^2$
> Cho $b_1 = (1, 0)$, $b_2 = (0, 1)$. Khi đó $L = \mathbb{Z}^2$ là tập tất cả các điểm có tọa độ nguyên trong mặt phẳng — đây là lattice đơn giản nhất.
>
> Cho $b_1 = (1, 0)$, $b_2 = (1/2, \sqrt{3}/2)$. Khi đó $L$ là **hexagonal lattice** — mỗi điểm có 6 láng giềng gần nhất.

**Determinant của lattice** đo "mật độ" của các điểm lattice:

> [!note] Định nghĩa 1.2 — Determinant
> **Determinant** $d(L)$ của lattice $L$ với basis $b_1, \ldots, b_n$ được định nghĩa bởi
>
> $$
> d(L) = |\det(b_1, b_2, \ldots, b_n)|
> $$
>
> trong đó các $b_i$ được viết dưới dạng column vectors. Đây là một số thực dương **không phụ thuộc vào chọn basis** [4, Sect. 1.2].

Tính độc lập basis quan trọng vì một lattice có vô số basis khác nhau, nhưng tất cả cùng cho determinant bằng nhau. $d(L)$ bằng thể tích của **fundamental parallelepiped** $\{t_1 b_1 + \cdots + t_n b_n : 0 \le t_i < 1\}$.

> [!tip] 💡 Agent note
> Tại sao determinant không phụ thuộc basis? Nếu $C = (b_1 | \cdots | b_n)$ và $C' = (b_1' | \cdots | b_n')$ là hai ma trận basis, thì $C' = C \cdot U$ với $U$ là ma trận nguyên khả nghịch (unimodular), tức $U \in GL_n(\mathbb{Z})$. Do đó $|\det C'| = |\det C| \cdot |\det U| = |\det C| \cdot 1 = |\det C|$.

---

## Gram-Schmidt Orthogonalization

Cho $b_1, \ldots, b_n \in \mathbb{R}^n$ là các vector độc lập tuyến tính (không nhất thiết là basis của lattice ngay). Quá trình Gram-Schmidt tạo ra một họ vector trực giao $b_1^*, \ldots, b_n^*$.

> [!note] Định nghĩa 1.3 — Gram-Schmidt Vectors và Coefficients
> Các vector $b_i^*$ và số thực $\mu_{ij}$ ($1 \le j < i \le n$) được định nghĩa quy nạp:
>
> $$
> b_i^* = b_i - \sum_{j=1}^{i-1} \mu_{ij} b_j^*
> \tag{1.2}
> $$
>
> $$
> \mu_{ij} = \frac{(b_i,\, b_j^*)}{(b_j^*,\, b_j^*)}
> \tag{1.3}
> $$
>
> trong đó $(\cdot, \cdot)$ là inner product thông thường trên $\mathbb{R}^n$.

**Diễn giải hình học**: $b_i^*$ là **hình chiếu vuông góc** (orthogonal projection) của $b_i$ lên phần bù trực giao của $\text{span}(b_1, \ldots, b_{i-1})$. Nói cách khác, $b_i^*$ là phần còn lại của $b_i$ sau khi loại bỏ các thành phần nằm trong $\text{span}\{b_1, \ldots, b_{i-1}\}$.

Hai tính chất quan trọng theo sau trực tiếp:

1. $b_1^*, b_2^*, \ldots, b_n^*$ là **họ vector trực giao** của $\mathbb{R}^n$ (không nhất thiết trực chuẩn).
2. $\text{span}_{\mathbb{R}}\{b_1, \ldots, b_i\} = \text{span}_{\mathbb{R}}\{b_1^*, \ldots, b_i^*\}$ với mọi $1 \le i \le n$.

> [!example] Ví dụ 1.2 — Gram-Schmidt trong $\mathbb{R}^2$
> Cho $b_1 = (1, 1)$, $b_2 = (2, 0)$.
>
> - $b_1^* = b_1 = (1, 1)$
> - $\mu_{21} = \frac{(b_2, b_1^*)}{(b_1^*, b_1^*)} = \frac{(2,0) \cdot (1,1)}{(1,1)\cdot(1,1)} = \frac{2}{2} = 1$
> - $b_2^* = b_2 - \mu_{21} b_1^* = (2, 0) - 1 \cdot (1, 1) = (1, -1)$
>
> Kiểm tra: $(b_1^*, b_2^*) = (1)(1) + (1)(-1) = 0$. ✓

**Quan sát từ paper**: Vì $b_i^*$ chỉ phụ thuộc vào $b_1, \ldots, b_i$, nên $b_i^* \ne 0$ với mọi $i$ (do $b_1, \ldots, b_n$ độc lập tuyến tính). Đặc biệt, $(b_i^*, b_i^*) > 0$ nên mẫu số trong (1.3) luôn khác 0. Ngoài ra:

$$
d(L) = |\det(b_1^*, \ldots, b_n^*)| = \prod_{i=1}^{n} |b_i^*|
$$

vì ma trận $M = (b_i^*)_i$ có $|\det M| = \prod |b_i^*|$ (do trực giao).

---

## Reduced Basis — Định nghĩa

Một basis $b_1, \ldots, b_n$ "tốt" là basis có các vector ngắn và gần trực giao. Paper định nghĩa chính xác "tốt" theo hai điều kiện:

> [!note] Định nghĩa 1.4 — Reduced Basis (LLL-reduced)
> Một basis $b_1, b_2, \ldots, b_n$ của lattice $L$ được gọi là **reduced** (LLL-reduced) nếu thỏa mãn đồng thời hai điều kiện sau:
>
> **Điều kiện 1 — Size reduction**:
>
> $$
> |\mu_{ij}| \le \frac{1}{2} \qquad \text{với mọi } 1 \le j < i \le n
> \tag{1.4}
> $$
>
> **Điều kiện 2 — Lovász condition**:
>
> $$
> \left| b_i^* + \mu_{i,i-1} b_{i-1}^* \right|^2 \ge \frac{3}{4} |b_{i-1}^*|^2 \qquad \text{với mọi } 1 < i \le n
> \tag{1.5}
> $$

**Giải thích điều kiện (1.4)**: $|\mu_{ij}| \le 1/2$ nghĩa là $b_i$ không thể rút ngắn thêm bằng cách trừ đi bội nguyên của $b_j$. Đây là điều kiện "size-reduced" — basis vector không quá "xiên" so với nhau.

**Giải thích điều kiện (1.5)**: Hãy nhìn hai vector $b_{i-1}$ và $b_i$. Sau khi chiếu lên phần bù trực giao của $\text{span}\{b_1, \ldots, b_{i-2}\}$, hình chiếu của $b_{i-1}$ là $b_{i-1}^*$ và hình chiếu của $b_i$ là $b_i^* + \mu_{i,i-1} b_{i-1}^*$. Điều kiện Lovász nói: hình chiếu của $b_i$ không được quá ngắn so với hình chiếu của $b_{i-1}$. Nếu vi phạm, tốt hơn nên **đổi chỗ** $b_{i-1}$ và $b_i$.

> [!info] Hằng số $3/4$ trong (1.5)
> Hằng số $\frac{3}{4}$ được chọn tùy ý; có thể thay bằng bất kỳ $\gamma \in (\frac{1}{4}, 1)$. Chọn $\frac{3}{4}$ cho kết quả tốt cả về lý thuyết (bounds đẹp với lũy thừa 2) lẫn thực hành. Nếu thay bằng $\gamma$, các lũy thừa 2 trong các bounds sau sẽ thay bằng lũy thừa của $\frac{4}{4\gamma - 1}$.

> [!tip] 💡 Agent note
> Điều kiện (1.5) có thể được viết tương đương bằng:
> $$(\gamma - \mu_{i,i-1}^2)|b_{i-1}^*|^2 \le |b_i^*|^2$$
> Với $\gamma = 3/4$: $(\frac{3}{4} - \mu_{i,i-1}^2)|b_{i-1}^*|^2 \le |b_i^*|^2$.
> Điều này sẽ dùng trong proof termination của thuật toán LLL.

---

## Summary

Bài này thiết lập ba khối nền tảng:

1. **Lattice** $L = \sum \mathbb{Z} b_i$ — tổ hợp nguyên của basis; determinant $d(L) = |\det(b_1, \ldots, b_n)|$ không phụ thuộc basis.

2. **Gram-Schmidt**: $b_i^* = b_i - \sum_{j<i} \mu_{ij} b_j^*$ với $\mu_{ij} = (b_i, b_j^*)/(b_j^*, b_j^*)$ — tạo họ trực giao trong $\mathbb{R}$-span, giữ nguyên $\mathbb{Z}$-span khi cộng với số nguyên.

3. **Reduced basis** (LLL-reduced) — hai điều kiện: $|\mu_{ij}| \le \frac{1}{2}$ (size reduction) và $|b_i^* + \mu_{i,i-1} b_{i-1}^*|^2 \ge \frac{3}{4}|b_{i-1}^*|^2$ (Lovász condition). Một reduced basis có các vector ngắn và gần trực giao — phẩm chất cốt lõi để thuật toán LLL khai thác.

**Bài tiếp theo** ([[02-reduced-basis-properties|02. Properties of Reduced Bases]]) sẽ chứng minh rằng một reduced basis theo nghĩa trên thỏa mãn nhiều bất đẳng thức đẹp về độ dài vector.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite)
