---
title: "02. Properties of Reduced Bases"
type: math-component
tags: [lll, lattice, reduced-basis, math-component, lesson-02]
aliases: [Reduced Basis Properties, LLL Bounds, Hadamard Inequality]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[01-lattice-basics-gram-schmidt|01. Lattice Basics & Gram-Schmidt]] — định nghĩa lattice, Gram-Schmidt, reduced basis  
> 🔴 **Prerequisite references**: Cassels — *An Introduction to the Geometry of Numbers* [4] (successive minima, Chap. VIII)  
> **Lesson type**: Math Component  
> **Covers**: §1: Proposition (1.6) với (1.7)–(1.9), Hadamard's inequality (1.10), Proposition (1.11), Proposition (1.12), Remark (1.14)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $b_1, \ldots, b_n$ | Reduced basis của lattice $L \subset \mathbb{R}^n$ |
> | $b_1^*, \ldots, b_n^*$ | Gram-Schmidt orthogonal vectors |
> | $\mu_{ij}$ | Gram-Schmidt coefficients, $\mu_{ij} = (b_i, b_j^*)/(b_j^*, b_j^*)$ |
> | $d(L)$ | Determinant của lattice |
> | $\lambda_1, \ldots, \lambda_n$ | Successive minima: $\lambda_i = \min\{r : \dim(\text{span}(L \cap B(0,r))) \ge i\}$ |

---

## Động lực

Reduced basis được định nghĩa bởi hai điều kiện (1.4) và (1.5). Câu hỏi tự nhiên là: các điều kiện này *mua lại* điều gì? Bài này trả lời bằng ba kết quả định lượng chính:

1. **Proposition (1.6)**: Các basis vector không quá dài so với Gram-Schmidt vectors, và $b_1$ gần với shortest lattice vector.
2. **Hadamard's inequality (1.10)**: Một bất đẳng thức về determinant không cần giả thiết reduced.
3. **Propositions (1.11), (1.12)**: Reduced basis cung cấp **xấp xỉ đa thức** của shortest vector và successive minima.

Đây là nền tảng lý thuyết giải thích tại sao LLL hoạt động: sau khi reduce, $b_1$ xấp xỉ vector ngắn nhất với hệ số $2^{(n-1)/2}$.

---

## Proposition (1.6) — Bounds trên Reduced Basis

> [!abstract] Proposition 1.6
> Cho $b_1, b_2, \ldots, b_n$ là một reduced basis của lattice $L \subset \mathbb{R}^n$, và $b_1^*, \ldots, b_n^*$ được định nghĩa như trong (1.2)–(1.3). Khi đó:
>
> $$
> |b_j|^2 \le 2^{i-1} \cdot |b_i^*|^2 \qquad \text{với mọi } 1 \le j \le i \le n
> \tag{1.7}
> $$
>
> $$
> d(L) \le \prod_{i=1}^{n} |b_i| \le 2^{n(n-1)/4} \cdot d(L)
> \tag{1.8}
> $$
>
> $$
> |b_1| \le 2^{(n-1)/4} \cdot d(L)^{1/n}
> \tag{1.9}
> $$

**Proof.**

**Bước 1 — Chứng minh (1.7).**

Từ điều kiện Lovász (1.5) và $|\mu_{i,i-1}| \le 1/2$ (từ (1.4)):

$$
|b_i^*|^2 \ge \left(\frac{3}{4} - \mu_{i,i-1}^2\right)|b_{i-1}^*|^2 \ge \left(\frac{3}{4} - \frac{1}{4}\right)|b_{i-1}^*|^2 = \frac{1}{2}|b_{i-1}^*|^2
$$

Áp dụng quy nạp: $|b_j^*|^2 \le 2^{i-j} \cdot |b_i^*|^2$ với $1 \le j \le i \le n$.

Từ (1.2) và $|\mu_{ij}| \le 1/2$:

$$
|b_i|^2 = |b_i^*|^2 + \sum_{j=1}^{i-1} \mu_{ij}^2 |b_j^*|^2 \le |b_i^*|^2 + \sum_{j=1}^{i-1} \frac{1}{4} \cdot 2^{i-j} |b_i^*|^2 = \left(1 + \frac{1}{4}(2^i - 2)\right)|b_i^*|^2 \le 2^{i-1}|b_i^*|^2
$$

Do đó $|b_j|^2 \le 2^{j-1}|b_j^*|^2 \le 2^{i-1}|b_i^*|^2$ với $j \le i$. $\checkmark$ (1.7) proved.

**Bước 2 — Chứng minh (1.8).**

Từ (1.1) và (1.2): $d(L) = |\det(b_1^*, \ldots, b_n^*)| = \prod_{i=1}^{n} |b_i^*|$.

- Bất đẳng thức trái: $|b_i^*| \le |b_i|$ (vì $b_i^*$ là hình chiếu của $b_i$), suy ra $d(L) \le \prod |b_i|$.
- Bất đẳng thức phải: từ $|b_i| \le 2^{(i-1)/2}|b_i^*|$ (từ bước 1 với $j=i$), suy ra

$$
\prod_{i=1}^{n} |b_i| \le \prod_{i=1}^{n} 2^{(i-1)/2} |b_i^*| = 2^{\sum_{i=1}^{n}(i-1)/2} \cdot d(L) = 2^{n(n-1)/4} \cdot d(L)
$$

$\checkmark$ (1.8) proved.

**Bước 3 — Chứng minh (1.9).**

Đặt $j = 1$ trong (1.7): $|b_1|^2 \le 2^{i-1}|b_i^*|^2$ với mọi $i$. Lấy tích theo $i = 1, \ldots, n$:

$$
|b_1|^{2n} \le \prod_{i=1}^{n} 2^{i-1} |b_i^*|^2 = 2^{n(n-1)/2} \prod_{i=1}^{n} |b_i^*|^2 = 2^{n(n-1)/2} \cdot d(L)^2
$$

Khai căn bậc $2n$: $|b_1| \le 2^{(n-1)/4} \cdot d(L)^{1/n}$. $\blacksquare$

> [!info] Remark — Thay đổi hằng số
> Nếu $\frac{3}{4}$ trong (1.5) được thay bằng $\gamma \in (\frac{1}{4}, 1)$, thì tất cả lũy thừa 2 trong (1.7), (1.8), (1.9) phải thay bằng lũy thừa của $\frac{4}{4\gamma - 1}$. Với $\gamma = 3/4$: $\frac{4}{4 \cdot 3/4 - 1} = \frac{4}{2} = 2$ — đây là lý do hằng số $3/4$ cho kết quả gọn.

---

## Hadamard's Inequality

> [!abstract] Proposition 1.7 — Hadamard's Inequality (1.10)
> Với **mọi** basis $b_1, \ldots, b_n$ của lattice $L$ (không cần reduced):
>
> $$
> d(L) \le \prod_{i=1}^{n} |b_i|
> \tag{1.10}
> $$

**Proof.** Vì $b_i^*$ là hình chiếu của $b_i$, ta có $|b_i^*| \le |b_i|$. Kết hợp với $d(L) = \prod |b_i^*|$ ta được kết quả. $\blacksquare$

Đây là bất đẳng thức **Hadamard** cổ điển: determinant bị chặn bởi tích các norm của các hàng (hoặc cột). Không cần giả thiết reduced. Nó sẽ được dùng trong §2 (proof của Proposition (2.7)) để ước lượng determinant của một lattice phụ trợ.

---

## Proposition (1.11) — Xấp xỉ Shortest Vector

> [!abstract] Proposition 1.11 — Shortest Vector Approximation
> Cho $L \subset \mathbb{R}^n$ là lattice với reduced basis $b_1, \ldots, b_n$. Với mọi $x \in L$, $x \ne 0$:
>
> $$
> |b_1|^2 \le 2^{n-1} \cdot |x|^2
> $$

**Proof.** Viết $x = \sum_{i=1}^{n} r_i b_i = \sum_{i=1}^{n} r_i' b_i^*$ với $r_i \in \mathbb{Z}$, $r_i' \in \mathbb{R}$. Gọi $\ell$ là chỉ số lớn nhất với $r_\ell \ne 0$.

Vì $b_i^*$ trực giao nhau và $r_\ell' = r_\ell$ (theo cấu trúc Gram-Schmidt):

$$
|x|^2 \ge |r_\ell'|^2 \cdot |b_\ell^*|^2 = r_\ell^2 \cdot |b_\ell^*|^2 \ge |b_\ell^*|^2
$$

Từ (1.7) với $j = 1$, $i = \ell$: $|b_1|^2 \le 2^{\ell-1}|b_\ell^*|^2 \le 2^{n-1}|b_\ell^*|^2$.

Kết hợp: $|b_1|^2 \le 2^{n-1}|b_\ell^*|^2 \le 2^{n-1}|x|^2$. $\blacksquare$

**Ý nghĩa**: Nếu gọi $\lambda_1(L)$ là độ dài của shortest nonzero lattice vector, thì $|b_1| \le 2^{(n-1)/2} \lambda_1(L)$. Thuật toán LLL tìm được một vector ngắn hơn shortest vector tối đa $2^{(n-1)/2}$ lần — đây là **xấp xỉ đa thức** vì $2^{(n-1)/2}$ phụ thuộc polynomial vào $n$ trong khi bài toán shortest vector là NP-hard.

> [!tip] 💡 Agent note
> Bài toán tìm **chính xác** shortest lattice vector (SVP) là NP-hard dưới các giả thiết phổ biến. Thuật toán LLL không giải SVP chính xác mà cho xấp xỉ theo hệ số $2^{(n-1)/2}$. Trong ứng dụng mật mã, hệ số xấp xỉ này thường là chấp nhận được cho dimension nhỏ, nhưng với dimension lớn (như trong lattice-based cryptography hiện đại, $n \approx 1000$), cần các thuật toán mạnh hơn (BKZ, Sieving).

---

## Proposition (1.12) — Bound cho t Vector Độc Lập

> [!abstract] Proposition 1.12
> Cho $L \subset \mathbb{R}^n$ là lattice với reduced basis $b_1, \ldots, b_n$. Cho $x_1, x_2, \ldots, x_t \in L$ là $t$ vector độc lập tuyến tính. Khi đó:
>
> $$
> |b_j|^2 \le 2^{n-1} \cdot \max\left\{|x_1|^2, |x_2|^2, \ldots, |x_t|^2\right\} \qquad \text{với } j = 1, 2, \ldots, t
> $$

**Proof.** Viết $x_j = \sum_{i=1}^{n} r_{ij} b_i$ với $r_{ij} \in \mathbb{Z}$. Với mỗi $j$, gọi $i(j)$ là chỉ số lớn nhất với $r_{i(j),j} \ne 0$. Bằng lý luận tương tự Prop (1.11):

$$
|x_j|^2 \ge |b_{i(j)}^*|^2 \tag{1.13}
$$

Sắp xếp lại $x_j$ để $i(1) \le i(2) \le \cdots \le i(t)$. Ta khẳng định $j \le i(j)$ với mọi $j$.

*Nếu không*: tồn tại $j$ sao cho $i(j) < j$, nghĩa là $x_1, \ldots, x_j$ đều thuộc $\text{span}_{\mathbb{R}}\{b_1, \ldots, b_{j-1}\}$ — mâu thuẫn với tính độc lập tuyến tính.

Do đó $j \le i(j)$, và từ (1.7):

$$
|b_j|^2 \le 2^{i(j)-1} |b_{i(j)}^*|^2 \le 2^{n-1} |b_{i(j)}^*|^2 \le 2^{n-1} |x_j|^2 \le 2^{n-1} \max_k|x_k|^2
$$

$\blacksquare$

**Ý nghĩa**: Đây là tổng quát hóa của (1.11). Nó nói rằng $t$ vector basis đầu tiên của một reduced basis xấp xỉ $t$ successive minima $\lambda_1, \ldots, \lambda_t$ theo hệ số $2^{n-1}$. Cụ thể, từ (1.7) và (1.12):

$$
2^{1-i} \lambda_i \le |b_i|^2 \le 2^{n-1} \lambda_i \qquad 1 \le i \le n
$$

nên $|b_i|^2$ là một **xấp xỉ hợp lý** của $\lambda_i$.

---

## Remark (1.14) — Tighten Hằng Số

> [!info] Remark 1.14
> Hằng số $2^{n-1}$ trong (1.11) có thể thay bằng $\max\{|b_1|^2/|b_i^*|^2 : 1 \le i \le n\}$.
>
> Trong (1.12), hằng số $2^{n-1}$ có thể thay bằng $\max\{|b_j|^2/|b_i^*|^2 : 1 \le j \le i \le n\}$.

Đây là các bound chặt hơn áp dụng cho một reduced basis cụ thể — thay vì bound worst-case theo $n$. Trong thực tế, nếu basis đã gần trực giao thì $|b_j|^2/|b_i^*|^2$ nhỏ hơn nhiều so với $2^{n-1}$. Remark này được dùng trong proof Proposition (2.13) ở §2 (xem [[06-factor-recovery|06. Factor Recovery]]).

---

## Summary

| Kết quả | Phát biểu | Ý nghĩa |
|--------|-----------|---------|
| (1.7) | $\|b_j\|^2 \le 2^{i-1}\|b_i^*\|^2$ | Basis vector bị chặn bởi Gram-Schmidt vector |
| (1.8) | $d(L) \le \prod\|b_i\| \le 2^{n(n-1)/4} d(L)$ | Tích norm basis xấp xỉ determinant |
| (1.9) | $\|b_1\| \le 2^{(n-1)/4} d(L)^{1/n}$ | $b_1$ gần shortest vector |
| (1.10) | $d(L) \le \prod\|b_i\|$ (không cần reduced) | Hadamard's inequality |
| (1.11) | $\|b_1\|^2 \le 2^{n-1}\|x\|^2$ mọi $x \in L$ | LLL xấp xỉ SVP với hệ số $2^{(n-1)/2}$ |
| (1.12) | $\|b_j\|^2 \le 2^{n-1}\max\|x_k\|^2$ | Xấp xỉ successive minima |

**Bài tiếp theo** ([[03-lll-reduction-algorithm|03. LLL Basis Reduction Algorithm]]) sẽ trình bày thuật toán thực sự biến đổi một basis tùy ý thành reduced basis, và chứng minh nó kết thúc trong hữu hạn bước.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite — Chap. I, II, VIII cho successive minima)
