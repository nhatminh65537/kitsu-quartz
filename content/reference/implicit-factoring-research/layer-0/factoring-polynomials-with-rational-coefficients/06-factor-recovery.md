---
title: "06. Factor Recovery via LLL"
type: deep-dive
tags: [lll, polynomial-factoring, factor-recovery, mignotte, deep-dive, lesson-06]
aliases: [Factor Recovery, Degree Detection, Mignotte Bound]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[05-factors-and-lattices-setup|05. Factors and Lattices — Setup]] — lattice $L$, Prop (2.5), Prop (2.7); [[02-reduced-basis-properties|02. Properties of Reduced Bases]] — Prop (1.11), Prop (1.12), Remark (1.14)  
> 🔴 **Prerequisite references**: Cassels [4] (Chap. I Theorem I.A — basis with prescribed degrees)  
> **Lesson type**: Deep Dive  
> **Covers**: §2: Proposition (2.13) — degree detection, sufficient condition (2.14), Proposition (2.16) — full factor recovery $h_0 = \gcd(b_1,\ldots,b_t)$
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $b_1, \ldots, b_{m+1}$ | Reduced basis của lattice $L$ (từ LLL) |
> | $b_1^*, \ldots, b_{m+1}^*$ | Gram-Schmidt vectors của basis trên |
> | $h_0$ | Nhân tử bất khả quy thực sự của $f$ (từ Prop 2.5) |
> | $m$ | Bound bậc tìm kiếm ($m \ge l = \deg h$) |
> | $J$ | Tập chỉ số $j$ sao cho $\|b_j\| < (p^{kl}/\|f\|^m)^{1/n}$ |
> | $t$ | $\max J$ — chỉ số lớn nhất thỏa (2.17) |

---

## Động lực

Từ Prop (2.7): nếu $b \in L$ và $\|b\|$ đủ nhỏ (thỏa (2.8)) thì $h_0 \mid b$. Nhưng chưa biết:

1. Khi nào $b_1$ (vector đầu của reduced basis) đủ nhỏ?
2. Từ reduced basis, làm thế nào recover $h_0$ tường minh?

Hai Propositions (2.13) và (2.16) trả lời hai câu hỏi này.

---

## Mignotte Bound — Tích Hợp từ [10]

Một thành phần then chốt trong cả hai proof là bound của Mignotte về hệ số nhân tử đa thức:

> [!info] 🟡 Mignotte's Inequality (theo [10] Mignotte 1974)
> Cho $f \in \mathbb{Z}[X]$ bậc $n$ và $g$ là nhân tử của $f$ trong $\mathbb{Z}[X]$ với $\deg(g) \le m$. Khi đó:
>
> $$
> \|g\| \le \binom{2m}{m}^{1/2} \cdot \|f\|
> $$
>
> *(theo [10]: M. Mignotte — An inequality about factors of polynomials, Math. Comp. 28, 1153–1157, 1974)*

Đây là bound quan trọng: nhân tử của $f$ không thể có norm quá lớn so với $f$. Cụ thể, $h_0$ (nhân tử bậc $\le m$) thỏa $\|h_0\| \le \binom{2m}{m}^{1/2} \|f\|$.

---

## Điều Kiện Đủ (2.14)

Để hai Propositions dưới đây áp dụng được, cần $p^k$ đủ lớn:

> [!note] Điều Kiện (2.14)
>
> $$
> p^{kl} > 2^{mn/2} \binom{2m}{m}^{n/2} \|f\|^{m+n} \tag{2.14}
> $$

Đây là điều kiện chọn $k$ trong thuật toán §3: $k$ phải đủ lớn sao cho (2.14) thỏa mãn với $m = n - 1$ (trường hợp tệ nhất, $h_0$ có thể có bậc tối đa $n-1$).

---

## Proposition (2.13) — Degree Detection

> [!abstract] Proposition 2.13
> Cho $b_1, \ldots, b_{m+1}$ là reduced basis của $L$ (từ LLL), và giả sử (2.14) thỏa. Khi đó:
>
> $$
> \deg(h_0) \le m \iff \|b_1\| < \left(\frac{p^{kl}}{\|f\|^m}\right)^{1/n}
> \tag{2.15}
> $$

**Proof.**

**Chiều "if" ($\Leftarrow$)**: Nếu $\|b_1\| < (p^{kl}/\|f\|^m)^{1/n}$, tức $\|b_1\|^n \|f\|^m < p^{kl}$, tức (2.8) thỏa với $b = b_1$. Từ Prop (2.7), $h_0 \mid b_1$, suy ra $\deg(h_0) \le \deg(b_1) \le m$.

**Chiều "only if" ($\Rightarrow$)**: Giả sử $\deg(h_0) \le m$. Theo Prop (2.5), $h_0 \in L$ (vì $(h \bmod p^k) \mid (h_0 \bmod p^k)$ và $\deg(h_0) \le m$).

Từ Mignotte: $\|h_0\| \le \binom{2m}{m}^{1/2} \|f\|$.

Từ Prop (1.11) áp dụng cho $x = h_0 \in L$:

$$
\|b_1\|^2 \le 2^m \|h_0\|^2 \le 2^m \binom{2m}{m} \|f\|^2
$$

Từ (2.14):

$$
\|b_1\|^n \le 2^{mn/2} \binom{2m}{m}^{n/2} \|f\|^n < \frac{p^{kl}}{\|f\|^m}
$$

Suy ra $\|b_1\| < (p^{kl}/\|f\|^m)^{1/n}$, tức (2.15) thỏa. $\blacksquare$

**Ý nghĩa**: Prop (2.13) cho một **test đơn giản**: chỉ cần so sánh $\|b_1\|$ với ngưỡng để biết liệu $h_0$ có bậc $\le m$ hay không. Nếu không, tăng $m$ và thử lại.

---

## Proposition (2.16) — Full Factor Recovery

Khi $\deg(h_0) \le m$, không chỉ $b_1$ chia hết bởi $h_0$ — mà nhiều basis vector hơn cũng vậy, và $h_0$ recover được từ gcd của chúng.

> [!abstract] Proposition 2.16
> Giả sử cùng điều kiện như (2.13), và giả sử tồn tại chỉ số $j \in \{1, \ldots, m+1\}$ sao cho:
>
> $$
> \|b_j\| < \left(\frac{p^{kl}}{\|f\|^m}\right)^{1/n} \tag{2.17}
> $$
>
> Đặt $t$ là chỉ số **lớn nhất** thỏa (2.17). Khi đó:
>
> $$
> \deg(h_0) = m + 1 - t, \qquad h_0 = \gcd(b_1, b_2, \ldots, b_t)
> $$
>
> và (2.17) thỏa với mọi $j \le t$.

**Proof.**

Đặt $J = \{j \in \{1,\ldots,m+1\} : (2.17) \text{ thỏa}\}$. Từ Prop (2.7): $h_0 \mid b_j$ với mọi $j \in J$.

**Bước 1**: Đặt $h_1 = \gcd(\{b_j : j \in J\})$. Thì $h_0 \mid h_1$.

Mỗi $b_j$ với $j \in J$ chia hết bởi $h_1$ và có bậc $\le m$, nên $b_j \in \mathbb{Z} h_1 + \mathbb{Z} h_1 X + \cdots$. Vì $b_j$ độc lập tuyến tính:

$$
\#J \le m + 1 - \deg(h_1) \tag{2.18}
$$

**Bước 2**: Ngược lại, với $i = 0, 1, \ldots, m - \deg(h_0)$, ta có $h_0 X^i \in L$ (từ Prop (2.5) và $\deg(h_0 X^i) = \deg(h_0) + i \le m$). Từ Mignotte: $\|h_0 X^i\| = \|h_0\| \le \binom{2m}{m}^{1/2}\|f\|$.

Áp dụng Prop (1.12) cho các vector $h_0 X^0, h_0 X^1, \ldots, h_0 X^{m-\deg(h_0)} \in L$ (tổng cộng $m+1-\deg(h_0)$ vector độc lập tuyến tính):

$$
\|b_j\|^2 \le 2^m \|h_0\|^2 \le 2^m \binom{2m}{m}\|f\|^2 \quad \text{với } j = 1, \ldots, m+1-\deg(h_0)
$$

Từ (2.14), điều này nghĩa là (2.17) thỏa với $j = 1, \ldots, m+1-\deg(h_0)$, tức:

$$
\{1, 2, \ldots, m+1-\deg(h_0)\} \subset J \tag{2.19}
$$

**Bước 3**: Từ (2.18) và (2.19), và $h_0 \mid h_1$:

$$
m+1-\deg(h_0) \le \#J \le m+1-\deg(h_1) \le m+1-\deg(h_0)
$$

Suy ra tất cả bất đẳng thức là đẳng thức: $\deg(h_0) = \deg(h_1)$, $\#J = m+1-\deg(h_0)$, $J = \{1,\ldots,t\}$ với $t = m+1-\deg(h_0)$.

**Bước 4**: Vì $h_0 \mid h_1$ và $\deg(h_0) = \deg(h_1)$, chỉ cần kiểm tra $h_1$ primitive. Chọn bất kỳ $j \in J$, gọi $d_j$ là content của $b_j$. Thì $b_j/d_j \in L$ (vì $L$ là $\mathbb{Z}$-module), $h_0 \mid b_j/d_j$, và $h_0 \in L$, suy ra $d_j = 1$ và $b_j$ primitive, $h_1$ primitive. Do đó $h_0 = \pm h_1 = \pm\gcd(b_1,\ldots,b_t)$. $\blacksquare$

> [!success] Kết quả
> Từ reduced basis $b_1,\ldots,b_{m+1}$ của $L$:
> 1. Tìm $t = \max\{j : \|b_j\| < (p^{kl}/\|f\|^m)^{1/n}\}$.
> 2. $h_0 = \gcd(b_1, \ldots, b_t)$ — tính bằng subresultant algorithm.
> 3. $\deg(h_0) = m+1-t$.

> [!tip] 💡 Agent note — Trường hợp $t = 1$
> Nếu $t = 1$, thì $h_0 = b_1$ trực tiếp — không cần tính gcd. Đây là trường hợp phổ biến trong thực tế khi $h_0$ có bậc lớn (gần $m$).

> [!info] Remark — Tighten Điều Kiện (2.14)
> Từ Remark (1.14), điều kiện (2.14) có thể thay bằng
> $$p^{kl} > \beta^n \gamma^n \|f\|^m$$
> trong đó $\beta = \max\{|b_j|/|b_i^*| : 1 \le j \le i \le m+1\}$ và $\gamma$ là bound cho mọi nhân tử bậc $\le m$ của $f$.

---

## Summary

| Kết quả | Nội dung |
|--------|---------|
| Mignotte [10] | $\|h_0\| \le \binom{2m}{m}^{1/2}\|f\|$ — bound hệ số nhân tử |
| (2.14) | Điều kiện đủ cho $p^k$: đảm bảo LLL "thấy" $h_0$ |
| Prop (2.13) | $\deg(h_0) \le m \iff \|b_1\| < (p^{kl}/\|f\|^m)^{1/n}$ — test đơn giản |
| Prop (2.16) | $h_0 = \gcd(b_1,\ldots,b_t)$ với $t = \max J$; $\deg(h_0) = m+1-t$ |

**Bài tiếp theo** ([[07-polynomial-factoring-algorithm|07. Main Polynomial Factoring Algorithm]]) lắp ráp tất cả thành thuật toán factoring hoàn chỉnh và phân tích running time tổng thể $O(n^6 + n^5\log\|f\|)$.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [10] Mignotte — *An inequality about factors of polynomials*, Math. Comp. 28, 1153–1157 (1974) (🟡 Integrate)
- [8] Lenstra AK — *Lattices and factorization of polynomials*, Report IW 190/81, 1981 (🟡 Integrate — phiên bản yếu của Prop 2.7)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite)
