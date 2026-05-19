---
title: "30. Algebraic Construction via Divisors"
type: theory
tags: [math, abelian-varieties, weil-pairing, lesson-30]
aliases: [Algebraic Construction Weil Pairing Divisors]
created: 2026-05-18
---

> **Prerequisites**: [[29-natural-pairing-setup|29. The Natural Pairing Between A[n] and Â[n]]], [[06-rational-functions-weil-reciprocity|06. Rational Functions and Weil Reciprocity]], [[04-divisors-on-varieties|04. Divisors on Varieties]]
> **Objectives**:
> - Xây dựng Weil pairing $e_n(P, L)$ hoàn toàn bằng ngôn ngữ algebraic (divisors + rational functions)
> - Chứng minh biểu thức này well-defined (không phụ thuộc vào lựa chọn)
> - Hiểu vai trò của Weil Reciprocity trong chứng minh bilinearity
> - Thấy construction này không cần gì từ ℂ — hoàn toàn algebraic trên trường tùy ý

---

## Motivation / Intuition

Cho đến nay ta đã có *ý tưởng* về Weil pairing, nhưng chưa có định nghĩa **chặt chẽ** hoàn toàn bằng ngôn ngữ đại số. Bài này điền vào khoảng trống đó.

Ý tưởng cốt lõi đến từ một nhận xét đơn giản: nếu $L \in \hat{A}[n]$, thì $L^{\otimes n} \cong \mathcal{O}$. Trong ngôn ngữ divisors, nếu $D$ là divisor đại diện cho $L$ (tức $\mathcal{O}(D) \cong L$), thì $nD$ là divisor của một rational function $f$. Hàm $f$ này mã hóa thông tin về "cách $L^{\otimes n}$ trở thành trivial".

Bây giờ, nếu $P \in A[n]$, ta có thể "đo" hàm $f$ tại $P$ theo một nghĩa nào đó. Cụ thể, **Weil Reciprocity** cho ta một cách so sánh $f$ tại điểm $P$ với một hàm khác tại $D$. Kết quả là một scalar — căn đơn vị bậc $n$ — và đó chính là $e_n(P, L)$.

Xây dựng này hoàn toàn algebraic: không dùng topo, không dùng giải tích phức, không dùng lattices. Chỉ cần: abelian varieties, divisors, và rational functions.

---

## Nhắc Lại: Weil Reciprocity

Weil Reciprocity (đã giới thiệu trong Bài 06) là công cụ kỹ thuật then chốt. Ta nhắc lại dưới dạng cần dùng.

> [!theorem] Theorem 30.1 — Weil Reciprocity trên Curves
> Cho $C/k$ là curve smooth projective và $f, g \in k(C)^{\times}$ là hai rational functions với $\operatorname{supp}(\operatorname{div}(f)) \cap \operatorname{supp}(\operatorname{div}(g)) = \emptyset$. Khi đó:
>
> $$
> f(\operatorname{div}(g)) = g(\operatorname{div}(f))
> $$
>
> trong đó $h(D) = \prod_{x \in C} h(x)^{n_x}$ với $D = \sum n_x [x]$.

Hệ quả quan trọng nhất cho chúng ta:

> [!corollary] Corollary 30.2 — Tỉ số Không Phụ Thuộc Điểm Base
> Cho $f \in k(C)^{\times}$ và $D$ là divisor với $\operatorname{div}(f) = nD$ (tức $D$ là "$1/n$ của $\operatorname{div}(f)$"). Với điểm $P \in C$ không thuộc $\operatorname{supp}(D)$:
>
> $$
> \frac{f(P + Q)}{f(Q)} \text{ (hiểu theo nghĩa divisor) không phụ thuộc vào } Q
> $$
>
> khi $P$ là $n$-torsion. Đây là nội dung cốt lõi mà Weil Reciprocity đảm bảo.

---

## Xây Dựng Chính Thức

### Step 1: Chọn Đại Diện

Cho $P \in A[n]$ và $L \in \hat{A}[n]$. Ta cần:

1. Divisor $D$ trên $A$ với $\mathcal{O}(D) \cong L$ (tức $D$ "đại diện" cho line bundle $L$)
2. Rational function $f \in k(A)^{\times}$ với $\operatorname{div}(f) = nD$

Điều kiện $L^{\otimes n} \cong \mathcal{O}$ trong ngôn ngữ divisors nói rằng $nD \sim 0$ (linearly equivalent to zero), tức tồn tại $f$ với $\operatorname{div}(f) = nD$.

### Step 2: Điểm Phụ

Vì $P \in A[n]$, map $[n]: A \to A$ là surjective (isogeny). Xét map translation $t_P: A \to A$, $Q \mapsto Q + P$.

Pullback của $D$ qua $t_P$ là $t_P^* D$. Điều kiện $L \in \operatorname{Pic}^0(A)$ đảm bảo rằng $t_P^* D \sim D$ (linearly equivalent), tức tồn tại rational function $g \in k(A)^{\times}$ với:

$$
\operatorname{div}(g) = t_P^* D - D
$$

### Step 3: Định Nghĩa Pairing

> [!definition] Definition 30.3 — Weil Pairing qua Divisors (Formal Definition)
> Cho $P \in A[n]$, $L \in \hat{A}[n]$. Chọn:
>
> - Divisor $D$ với $\mathcal{O}(D) \cong L$
> - Rational function $f$ với $\operatorname{div}(f) = nD$
> - Rational function $g$ với $\operatorname{div}(g) = t_P^* D - D$ (tức $g$ "đo sự khác biệt" của $D$ khi dịch bởi $P$)
>
> **Weil pairing** là:
>
> $$
> e_n(P, L) = \frac{g(Q_0)^n}{f(P + Q_0)/f(Q_0)}
> $$
>
> với $Q_0$ là điểm tổng quát tránh support của các divisors liên quan.
>
> Tuy nhiên, định nghĩa dạng thực hành hơn (và tương đương) là:
>
> $$
> \boxed{e_n(P, L) = \frac{f(t_P(S))}{f(S)} \cdot \left( \frac{g([n]S)}{g(S)^n} \right)^{-1}}
> $$
>
> với $S$ là điểm tổng quát.

Công thức này trông phức tạp. Hãy nhìn nó theo cách khác: về bản chất, $e_n(P, L)$ đo "phần twist" khi pull $L$ back qua translation $t_P$.

### Công Thức Thực Hành (Miller's Formula)

Trên thực tế, với $A = E$ là elliptic curve, có công thức thực hành hơn:

> [!definition] Definition 30.4 — Miller Formula cho Weil Pairing
> Cho $E/k$ là elliptic curve, $P, Q \in E[n]$ với $P \neq Q$ và $P \neq \mathcal{O}$. Chọn điểm phụ $S \in E$ "tổng quát". Khi đó:
>
> $$
> e_n(P, Q) = \frac{f_{n,P}(Q + S)}{f_{n,P}(S)} \bigg/ \frac{f_{n,Q}(P + S)}{f_{n,Q}(S)}
> $$
>
> trong đó $f_{n,P}$ là Miller function với $\operatorname{div}(f_{n,P}) = n[P] - n[\mathcal{O}]$.

---

## Chứng Minh Well-Definedness

Đây là bước kỹ thuật quan trọng nhất.

> [!theorem] Theorem 30.5 — Weil Pairing Well-Defined
> Định nghĩa $e_n(P, L)$ trong Definition 30.3 không phụ thuộc vào:
> 1. Lựa chọn divisor $D$ đại diện cho $L$ (trong lớp $\operatorname{Pic}^0$)
> 2. Lựa chọn rational function $f$ (xác định đến scalar)
> 3. Lựa chọn rational function $g$
> 4. Lựa chọn điểm phụ $Q_0$ (hay $S$)

**Proof sketch.**

**(1) Không phụ thuộc vào $Q_0$.**

Ta cần chứng minh $\frac{f(Q_0 + P)}{f(Q_0)}$ không phụ thuộc vào $Q_0$ khi $Q_0$ tránh support của $D$.

Xét $h(Q_0) = \frac{f(Q_0 + P)}{f(Q_0)}$. Tính divisor của $h$ như hàm của $Q_0$:

$$
\operatorname{div}(h) = t_{-P}^*(\operatorname{div}(f)) - \operatorname{div}(f) = n \cdot t_{-P}^* D - nD = n(t_{-P}^* D - D)
$$

Vì $L \in \operatorname{Pic}^0(A)$, với mọi $P' \in A$: $t_{P'}^* L \cong L$, tức $t_{P'}^* D \sim D$. Vậy $t_{-P}^* D - D \sim 0$, tức tồn tại $\alpha \in k^{\times}$ sao cho $t_{-P}^* D - D = \operatorname{div}(\alpha') $ với $\alpha'$ là rational function degree $0$...

Thực ra cần dùng Weil Reciprocity: $f(\operatorname{div}(h)) = h(\operatorname{div}(f))$. Vì $\operatorname{div}(f) = nD$ và $\operatorname{div}(h) = n(t_{-P}^* D - D)$, ta có thể rút ra rằng $h$ là constant. $\blacksquare$ (Chi tiết đầy đủ trong Silverman AEC Theorem 3.8.)

**(4) Không phụ thuộc vào $D$.**

Nếu $D' \sim D$, tức $D' = D + \operatorname{div}(h)$ cho một $h \in k(A)^{\times}$. Thì $f$ thay bằng $f' = f \cdot h^n$ và $g$ thay bằng $g' = g \cdot (t_P^* h / h)$. Tính ra $e_n(P, L)$ không đổi. $\blacksquare$

---

## Weil Reciprocity Trong Action

Hãy nhìn rõ hơn vai trò của Weil Reciprocity trong chứng minh bilinearity.

> [!theorem] Theorem 30.6 — Bilinearity từ Weil Reciprocity
> Weil pairing là bilinear: với $P_1, P_2 \in A[n]$ và $L \in \hat{A}[n]$:
>
> $$
> e_n(P_1 + P_2, L) = e_n(P_1, L) \cdot e_n(P_2, L)
> $$

**Proof.**
Chọn divisor $D$ với $\mathcal{O}(D) \cong L$ và $f$ với $\operatorname{div}(f) = nD$.

Dùng công thức thực hành:

$$
e_n(P_i, L) = \frac{f(P_i + S)}{f(S)} \cdot (\text{correction terms})
$$

Với hai điểm phụ $S_1, S_2$ thích hợp:

$$
e_n(P_1 + P_2, L) = \frac{f(P_1 + P_2 + S)}{f(S)}
$$

$$
= \frac{f(P_1 + P_2 + S)}{f(P_2 + S)} \cdot \frac{f(P_2 + S)}{f(S)}
$$

$$
= e_n(P_1, t_{P_2}^* L) \cdot e_n(P_2, L)
$$

Vì $L \in \operatorname{Pic}^0(A)$: $t_{P_2}^* L \cong L$. Do đó $e_n(P_1, t_{P_2}^* L) = e_n(P_1, L)$.

Kết quả: $e_n(P_1 + P_2, L) = e_n(P_1, L) \cdot e_n(P_2, L)$. $\blacksquare$

Bilinearity theo slot thứ hai ($L$) tương tự — tích của line bundles tương ứng với tích của giá trị pairing.

---

## Ví Dụ Chi Tiết: Elliptic Curve Case

### Setup

Cho $E: y^2 = x^3 + ax + b$ trên $k$, $P \in E[n]$. Miller function $f_{n,P}$ xây dựng theo thuật toán Miller:

**Khởi tạo:** $f_{1,P} = 1$ (constant function, divisor $[P] - [\mathcal{O}]$... thực ra $f_{1,P}$ không tồn tại theo nghĩa chặt, khởi tạo bằng $T = P$, $f = 1$).

**Lặp (double-and-add):** Với mỗi bit của $n$ trong nhị phân:
- **Doubling step:** $T \leftarrow [2]T$, $f \leftarrow f^2 \cdot \ell_{T,T} / v_{[2]T}$
- **Addition step** (khi bit = 1): $T \leftarrow T + P$, $f \leftarrow f \cdot \ell_{T,P} / v_{T+P}$

trong đó $\ell_{T,P}$ là **đường thẳng qua $T$ và $P$** (hay tiếp tuyến tại $T$ nếu $T=P$), và $v_{R}$ là **đường dọc qua $R$** (tức $x - x_R$). Cả hai là rational functions trên $E$.

> [!example] Example 30.7 — Tính $e_3$ thủ công trên EC nhỏ
> Xét $E: y^2 = x^3 + x + 1$ trên $\mathbb{F}_5$.
>
> Các điểm trên $\mathbb{F}_5$: tính $y^2 = x^3 + x + 1$ với $x \in \{0,1,2,3,4\}$:
>
> - $x=0$: $y^2 = 1$, $y = 1, 4$. Điểm $(0,1), (0,4)$.
> - $x=1$: $y^2 = 3$. Không có nghiệm trong $\mathbb{F}_5$ ($1^2=1, 2^2=4, 3^2=4, 4^2=1$).
> - $x=2$: $y^2 = 11 = 1$. Điểm $(2,1), (2,4)$.
> - $x=3$: $y^2 = 31 = 1$. Điểm $(3,1), (3,4)$.
> - $x=4$: $y^2 = 69 = 4$. Điểm $(4,2), (4,3)$.
>
> Cộng với $\mathcal{O}$: $|E(\mathbb{F}_5)| = 9$. Nhóm cyclic bậc $9$... hay $(\mathbb{Z}/3\mathbb{Z})^2$?
>
> Sinh viên có thể dùng SageMath để tính $e_3(P,Q)$ và kiểm tra các tính chất.

### Miller's Algorithm Pseudocode

```python
def miller(P, Q, n, E):
    T = P
    f = 1
    n_bits = n.bits()[:-1]
    for bit in reversed(n_bits[:-1]):
        l = line_function(T, T, E)
        v = vertical_function(2*T, E)
        f = f**2 * l(Q) / v(Q)
        T = 2 * T
        if bit == 1:
            l = line_function(T, P, E)
            v = vertical_function(T + P, E)
            f = f * l(Q) / v(Q)
            T = T + P
    return f

def weil_pairing(P, Q, n, E):
    fp = miller(P, Q, n, E)
    fq = miller(Q, P, n, E)
    return fp / fq
```

---

## Tổng Quát Hóa: Abelian Variety Bất Kỳ

Trên abelian variety $A$ chiều $g$ tùy ý, construction tương tự nhưng cần thay "divisor trên curve" bằng "Cartier divisor trên $A$":

> [!definition] Definition 30.8 — Weil Pairing trên AV Chiều Bất Kỳ
> Cho $A/k$ là abelian variety, $n \geq 1$ với $\gcd(n, \operatorname{char}(k)) = 1$.
>
> Với $P \in A[n]$ và $L \in \hat{A}[n]$ (với đại diện Cartier divisor $D$ trên $A$):
>
> 1. Chọn $D$ với $\mathcal{O}(D) \cong L$, $[n]^* D \sim 0$ (vì $L^{\otimes n} \cong \mathcal{O}$)
> 2. Chọn $f \in k(A)^{\times}$ với $\operatorname{div}(f) = [n]^* D$
> 3. Xét divisor $E_P = t_P^* D - D$ trên $A$ ($\sim 0$ vì $D \in \operatorname{Pic}^0$)
> 4. Chọn $g \in k(A)^{\times}$ với $\operatorname{div}(g) = E_P$
>
> Khi đó, dùng Weil Reciprocity tổng quát (trên AV):
>
> $$
> e_n(P, L) = \frac{f(P_0 + \text{div}(g))}{g(\text{div}(f))}
> $$
>
> trong đó các biểu thức hiểu theo nghĩa $h(D) = \prod_x h(x)^{n_x}$.

---

## Tại Sao Weil Reciprocity Là Chìa Khóa?

Weil Reciprocity là lý do tại sao $e_n(P, L)$ là một **căn đơn vị bậc $n$** (chứ không phải số tùy ý):

Với $f: \operatorname{div}(f) = nD$ và $g: \operatorname{div}(g) = t_P^* D - D$:

$$
e_n(P, L)^n = \left( \frac{f(P + Q)}{f(Q)} \right)^n
$$

Đây bằng $f([n](P + Q)) / f([n]Q)$ (do tính multiplicativity). Vì $[n]P = 0$: $[n](P+Q) = [n]Q$. Do đó:

$$
e_n(P, L)^n = \frac{f([n]Q)}{f([n]Q)} = 1
$$

Vậy $e_n(P, L) \in \mu_n$! $\blacksquare$

---

## Summary / Key Takeaways

- Weil pairing được xây dựng hoàn toàn algebraic: chọn divisor $D \sim L$, rational function $f$ với $\operatorname{div}(f) = nD$, rồi tính $f(P+S)/f(S)$ normalize thích hợp.
- Well-definedness: không phụ thuộc vào $D$, $f$, điểm phụ $S$ — chứng minh qua Weil Reciprocity.
- Bilinearity: từ tính additive của divisors và multiplicative của rational functions.
- Giá trị nằm trong $\mu_n$: vì $[n]P = 0$ dẫn đến $e_n(P,L)^n = f([n]Q)/f([n]Q) = 1$.
- Miller's algorithm tính $e_n$ hiệu quả trong $O(\log n)$ bước.
- Xây dựng này thuần algebraic: hoạt động trên mọi trường $k$ với $\gcd(n, \operatorname{char}(k)) = 1$.

---

## References

- Silverman, J. H. *The Arithmetic of Elliptic Curves*, Chapter III.8. Springer GTM 106.
- Miller, V. S. "Short Programs for Functions on Curves." Unpublished manuscript, 1986. (Thuật toán Miller gốc.)
- Milne, J. S. *Abelian Varieties*, Lecture notes, Sections 13–14. jmilne.org/math.
- Mumford, D. *Abelian Varieties*, Theorem on p.184ff. Oxford University Press.
- Blake, I., Seroussi, G., Smart, N. *Advances in Elliptic Curve Cryptography*, Chapter IX.
- Galbraith, S. D. *Mathematics of Public Key Cryptography*, Chapter 6.3. Cambridge.
