---
title: "06. Rational Functions and Weil Reciprocity"
tags: [math, abelian-varieties, lesson-06]
aliases: [Rational Functions and Weil Reciprocity]
created: 2026-05-17
---

> **Prerequisites**: [[04-divisors-on-varieties|04. Divisors on Varieties]], [[05-line-bundles-picard-group|05. Line Bundles and the Picard Group]] — divisors, valuation, principal divisors, Pic(X).
> **Objectives**:
> - Xây dựng trường hàm hữu tỉ $k(C)$ và lý thuyết định giá trên đường cong trơn
> - Định nghĩa chính xác $\operatorname{div}(f)$ và chứng minh $\deg(\operatorname{div}(f)) = 0$
> - Phát biểu và chứng minh (sketch) **Hỗ nghịch Weil** (Weil Reciprocity)
> - Hiểu tại sao Weil Reciprocity là công cụ không thể thiếu để xây dựng Weil pairing (Bài 30)

---

## Motivation / Intuition

Hỗ nghịch Weil (Weil Reciprocity) là một đẳng thức kỳ lạ và đẹp: cho hai hàm hữu tỉ $f, g$ trên đường cong, "tích các giá trị của $f$ tại zeros/poles của $g$" bằng "tích các giá trị của $g$ tại zeros/poles của $f$". Đây là một đối xứng sâu xa ẩn trong cấu trúc của hàm số trên đường cong đại số.

Tại sao điều này quan trọng? Vì khi ta xây dựng **Weil pairing** $e_n: E[n] \times E[n] \to \mu_n$ trên elliptic curve (Bài 28–31), bước then chốt là chứng minh pairing **xác định được** (well-defined) và **bilinear**. Cả hai điều này đều dựa trực tiếp vào Weil Reciprocity.

Hơn nữa, Weil Reciprocity là một trường hợp đặc biệt của **tame symbols** trong K-theory đại số, và kết nối với nhiều công thức reciprocity sâu hơn trong số học (Artin reciprocity, Parshin–Weil reciprocity trên mặt).

Ta sẽ:
1. Xây dựng trường $k(C)$ và định giá tại từng điểm.
2. Định nghĩa $\operatorname{div}(f)$ và chứng minh $\deg = 0$.
3. Phát biểu và chứng minh Weil Reciprocity.
4. Tính ví dụ cụ thể trên $\mathbb{P}^1$ và $E$.

---

## Trường Hàm Hữu Tỉ Của Đường Cong Trơn

> [!definition] Definition 6.1 — Trường hàm hữu tỉ (Function Field of a Curve)
> Cho $C$ là đường cong xạ ảnh trơn (smooth projective curve) không kỳ dị trên trường $k$ đại số đóng. **Trường hàm hữu tỉ** (function field) của $C$ là trường:
>
> $$
> k(C) = \left\{ \frac{f}{g} \;\middle|\; f, g \in k[C], \, g \neq 0 \right\}
> $$
>
> — trường phân thức của vành tọa độ affine của bất kỳ mảnh affine nào của $C$ (kết quả không phụ thuộc vào mảnh affine chọn).
>
> Đây là trường có **độ siêu việt** (transcendence degree) 1 trên $k$.

> [!example] Example 6.2 — Trường hàm của $\mathbb{P}^1$ và $E$
> - Với $\mathbb{P}^1$: $k(\mathbb{P}^1) = k(t)$ — trường phân thức hữu tỉ bậc một.
> - Với $E: y^2 = x^3 + ax + b$: $k(E) = k(x)[y]/(y^2 - x^3 - ax - b)$ — mở rộng bậc 2 của $k(x)$.
>
> Mọi phần tử $h \in k(E)$ viết được dưới dạng $h = u(x) + v(x) y$ với $u, v \in k(x)$ (phân thức hữu tỉ trong $x$).

---

## Định Giá Rời Rạc Tại Điểm Trơn

> [!definition] Definition 6.3 — Vành định giá rời rạc tại điểm (DVR at a smooth point)
> Cho $P \in C$ là điểm trơn. **Vành local** (local ring) tại $P$ là:
>
> $$
> \mathcal{O}_{C,P} = \left\{ f \in k(C) \;\middle|\; f \text{ xác định tại } P \right\}.
> $$
>
> Đây là một **DVR** (discrete valuation ring — vành định giá rời rạc) với ideal cực đại $\mathfrak{m}_P = \{f \in \mathcal{O}_{C,P} \mid f(P) = 0\}$.
>
> Phần tử $t_P \in \mathfrak{m}_P$ với $\mathfrak{m}_P = (t_P)$ được gọi là **uniformizer** (tham số chuẩn) tại $P$. Mọi $f \in k(C)^\times$ viết được dưới dạng $f = t_P^n \cdot u$ với $n \in \mathbb{Z}$ và $u \in \mathcal{O}_{C,P}^\times$.

> [!definition] Definition 6.4 — Định giá $v_P$ tại điểm $P$
> Với mỗi $P \in C$, **định giá** (valuation) tại $P$ là homomorphism:
>
> $$
> v_P: k(C)^\times \to \mathbb{Z},
> $$
>
> trong đó $v_P(f) = n$ nếu $f = t_P^n \cdot u$ với $u \in \mathcal{O}_{C,P}^\times$.
>
> Quy ước $v_P(0) = +\infty$.

> [!theorem] Theorem 6.5 — Tính chất của định giá $v_P$
> Với mọi $f, g \in k(C)^\times$:
>
> 1. $v_P(fg) = v_P(f) + v_P(g)$.
> 2. $v_P(f + g) \geq \min(v_P(f), v_P(g))$ (với đẳng thức khi $v_P(f) \neq v_P(g)$).
> 3. $v_P(f) > 0 \iff f(P) = 0$ ($f$ có zero tại $P$).
> 4. $v_P(f) < 0 \iff f$ có cực (pole) tại $P$.
> 5. $v_P(f) = 0 \iff f \in \mathcal{O}_{C,P}^\times$ ($f$ xác định và không triệt tiêu tại $P$).

**Proof.** Từ định nghĩa DVR. $\blacksquare$

> [!example] Example 6.6 — Uniformizer và valuation trên $E$
> Trên $E: y^2 = x^3 + ax + b$ tại điểm $P_0 = (x_0, y_0)$ với $y_0 \neq 0$:
>
> - Uniformizer: $t_{P_0} = x - x_0$ (hàm $x$ trừ $x$-tọa độ của $P_0$).
> - $v_{P_0}(x - x_0) = 1$ (zero bậc 1 tại $P_0$).
> - $v_{P_0}(y - y_0) = 1$ (cũng zero bậc 1, dùng phương trình đường cong).
>
> Tại điểm $\mathcal{O} = [0:1:0]$ (điểm tại vô cực):
>
> - Uniformizer: $t_\mathcal{O} = x/y$ (vì nhìn từ mảnh affine $\{Y \neq 0\}$).
> - $v_\mathcal{O}(x) = -2$, $v_\mathcal{O}(y) = -3$.

---

## Ước Tử Của Hàm Hữu Tỉ

> [!definition] Definition 6.7 — Ước tử $\operatorname{div}(f)$
> Cho $f \in k(C)^\times$. **Ước tử** (divisor) của $f$ là:
>
> $$
> \operatorname{div}(f) = \sum_{P \in C} v_P(f) \cdot [P] \in \operatorname{Div}(C).
> $$
>
> Tổng này hữu hạn vì trên đường cong xạ ảnh compact, $f$ chỉ có hữu hạn zeros và poles.
>
> Ta phân tách $\operatorname{div}(f) = \operatorname{div}_0(f) - \operatorname{div}_\infty(f)$ với:
>
> $$
> \operatorname{div}_0(f) = \sum_{v_P(f)>0} v_P(f) \cdot [P] \quad (\text{divisor zeros}),
> $$
>
> $$
> \operatorname{div}_\infty(f) = \sum_{v_P(f)<0} (-v_P(f)) \cdot [P] \quad (\text{divisor poles}).
> $$

> [!theorem] Theorem 6.8 — Bậc của ước tử chính bằng 0
> Với $C$ là đường cong xạ ảnh trơn và $f \in k(C)^\times$:
>
> $$
> \deg(\operatorname{div}(f)) = \sum_{P \in C} v_P(f) = 0.
> $$

**Proof.** Xét $f$ như morphism $f: C \to \mathbb{P}^1$ (hàm hữu tỉ khác hằng tương ứng dominant morphism vào $\mathbb{P}^1$). Với điểm $[a:b] \in \mathbb{P}^1$:

$$
f^{-1}([a:b]) = \left\{ P \in C \;\middle|\; v_P(f - a/b) > 0 \text{ hay } v_P(1/f) > 0 \right\}
$$

đếm với bội số. Tổng bội số là **bậc** (degree) của morphism $f: C \to \mathbb{P}^1$, ký hiệu $\deg f$. Điều này không phụ thuộc vào điểm $[a:b]$ được chọn (kết quả chuẩn về degree của morphisms giữa đường cong).

Lấy $[a:b] = [0:1]$ (gốc 0): $\deg(\operatorname{div}_0(f)) = \deg f$. Lấy $[a:b] = [1:0]$ (vô cực): $\deg(\operatorname{div}_\infty(f)) = \deg f$. Vậy $\deg(\operatorname{div}(f)) = \deg f - \deg f = 0$. $\blacksquare$

---

## Hỗ Nghịch Weil (Weil Reciprocity)

Đây là kết quả trung tâm của bài.

> [!definition] Definition 6.9 — Giá trị của $f$ tại divisor $D$
> Cho $f \in k(C)^\times$ và $D = \sum n_P [P] \in \operatorname{Div}(C)$ với $\operatorname{Supp}(D) \cap \operatorname{Supp}(\operatorname{div}(f)) = \emptyset$ (hỗ trợ disjoint). Định nghĩa:
>
> $$
> f(D) = \prod_{P \in C} f(P)^{n_P} \in k^\times.
> $$
>
> Điều kiện disjoint support đảm bảo $f(P)$ xác định (không phải $0$ hay $\infty$) tại mọi $P \in \operatorname{Supp}(D)$.

> [!theorem] Theorem 6.10 — Hỗ nghịch Weil (Weil Reciprocity)
> Cho $C$ là đường cong xạ ảnh trơn trên trường $k$ đại số đóng. Cho $f, g \in k(C)^\times$ với $\operatorname{Supp}(\operatorname{div}(f)) \cap \operatorname{Supp}(\operatorname{div}(g)) = \emptyset$. Khi đó:
>
> $$
> f(\operatorname{div}(g)) = g(\operatorname{div}(f)).
> $$
>
> Khai triển: nếu $\operatorname{div}(f) = \sum_P m_P [P]$ và $\operatorname{div}(g) = \sum_Q n_Q [Q]$ với hỗ trợ rời nhau, thì:
>
> $$
> \prod_Q g(Q)^{n_Q} = \prod_P f(P)^{m_P}.
> $$

**Proof strategy.**

*Bước 1 (Trên $\mathbb{P}^1$).* Với $C = \mathbb{P}^1$, mọi hàm hữu tỉ viết được dưới dạng:

$$
f = c \prod_i (t - a_i)^{m_i}, \quad g = d \prod_j (t - b_j)^{n_j}
$$

với $a_i \neq b_j$ (giả thiết disjoint support). Khi đó:

$$
f(\operatorname{div}(g)) = \prod_j f(b_j)^{n_j} = \prod_j \left(c \prod_i (b_j - a_i)^{m_i}\right)^{n_j}.
$$

Tương tự:

$$
g(\operatorname{div}(f)) = \prod_i g(a_i)^{m_i} = \prod_i \left(d \prod_j (a_i - b_j)^{n_j}\right)^{m_i}.
$$

Tỉ số:

$$
\frac{f(\operatorname{div}(g))}{g(\operatorname{div}(f))} = \frac{\prod_{i,j} (b_j - a_i)^{m_i n_j}}{\prod_{i,j} (a_i - b_j)^{m_i n_j}} = \prod_{i,j} (-1)^{m_i n_j} = (-1)^{(\sum m_i)(\sum n_j)}.
$$

Vì $\sum m_i = \deg(\operatorname{div}(f)) = 0$ (Theorem 6.8), tỉ số $= (-1)^0 = 1$. Vậy $f(\operatorname{div}(g)) = g(\operatorname{div}(f))$. ✓

*Bước 2 (Đường cong tổng quát).* Dùng morphism $\phi: C \to \mathbb{P}^1$ (tồn tại khi $C$ không là điểm) và norm map để "chuyển" kết quả từ $\mathbb{P}^1$ lên $C$. Chi tiết: Silverman *AEC* Exercise 2.11, hoặc xem Phụ lục [[a4-weil-reciprocity|A4. Weil Reciprocity]] (sẽ bổ sung sau). $\blacksquare$

---

## Tame Symbol và Biến Thể Của Weil Reciprocity

> [!definition] Definition 6.11 — Tame symbol tại $P$
> Với $f, g \in k(C)^\times$ và $P \in C$, **tame symbol** (ký hiệu thuần) tại $P$ là:
>
> $$
> (f, g)_P = (-1)^{v_P(f) v_P(g)} \frac{f^{v_P(g)}}{g^{v_P(f)}}(P) \in k^\times.
> $$
>
> Đây xác định tốt tại những điểm "generic" (nơi không cả hai $f, g$ đều có zero/pole).

> [!theorem] Theorem 6.12 — Weil Reciprocity qua tame symbols
> Với mọi $f, g \in k(C)^\times$:
>
> $$
> \prod_{P \in C} (f, g)_P = 1.
> $$

**Hệ quả**: Đây là phiên bản tổng quát hơn của Theorem 6.10 — không cần giả thiết disjoint support. Hai phiên bản tương đương nhau.

> [!example] Example 6.13 — Tính $f(\operatorname{div}(g))$ trên $\mathbb{P}^1$
> Lấy $\mathbb{P}^1$ với tham số $t$. Đặt:
>
> $$
> f(t) = t - 1, \quad g(t) = t(t-2)^{-1}.
> $$
>
> $\operatorname{div}(f) = [1] - [\infty]$, $\operatorname{div}(g) = [0] - [2]$.
>
> Hỗ trợ rời nhau: $\{1, \infty\} \cap \{0, 2\} = \emptyset$. Áp dụng Weil Reciprocity:
>
> $$
> f(\operatorname{div}(g)) = f(0)^1 \cdot f(2)^{-1} = (0-1)^1 \cdot (2-1)^{-1} = (-1) \cdot 1 = -1.
> $$
>
> $$
> g(\operatorname{div}(f)) = g(1)^1 \cdot g(\infty)^{-1}.
> $$
>
> Tại $t = 1$: $g(1) = 1 \cdot (1-2)^{-1} = -1$. Tại $t = \infty$: $g(t) = t/(t-2) \to 1$ khi $t \to \infty$, nên $g(\infty) = 1$.
>
> Vậy $g(\operatorname{div}(f)) = (-1)^1 \cdot 1^{-1} = -1$.
>
> Xác nhận: $f(\operatorname{div}(g)) = -1 = g(\operatorname{div}(f))$. ✓

---

## Ứng Dụng: Tại Sao Weil Reciprocity Cần Thiết Cho Weil Pairing

Đây là bước nhìn về phía trước (forward reference):

> [!note] Remark 6.14 — Weil Reciprocity và Weil Pairing (preview Bài 30)
> Khi ta xây dựng Weil pairing $e_n: E[n] \times E[n] \to \mu_n$, quy trình như sau:
>
> - Với $P \in E[n]$, chọn divisor $A_P \sim [P] - [\mathcal{O}]$ và hàm $f_P$ với $\operatorname{div}(f_P) = n A_P$.
> - Định nghĩa $e_n(P, Q) = f_P(A_Q) / f_Q(A_P)$ (với chọn $A_P, A_Q$ disjoint support).
>
> **Chứng minh well-definedness**: Kết quả không phụ thuộc vào cách chọn $f_P$ vì: nếu đổi $f_P \to \lambda f_P$, thì $e_n$ đổi bởi hệ số $\lambda^{\deg(A_Q)} = \lambda^0 = 1$.
>
> **Chứng minh $e_n(P,Q) \cdot e_n(Q,P) = 1$ (alternating)**: Đây trực tiếp từ Weil Reciprocity:
>
> $$
> \frac{e_n(P,Q)}{e_n(Q,P)} = \frac{f_P(A_Q)/f_Q(A_P)}{f_Q(A_P)/f_P(A_Q)} = \left(\frac{f_P(A_Q)}{f_Q(A_P)}\right)^2.
> $$
>
> Và chứng minh đây bằng 1 dùng Weil Reciprocity áp dụng cho $f_P$, $f_Q$. Xem chi tiết ở Bài 30–31.

---

## Reciprocity Và Công Thức Tích (Product Formula)

> [!theorem] Theorem 6.15 — Công thức tích (Product Formula)
> Với $f \in k(C)^\times$, áp dụng Weil Reciprocity với $g$ bất kỳ:
>
> $$
> f\!\left(\operatorname{div}(g)\right) = g\!\left(\operatorname{div}(f)\right).
> $$
>
> Đặc biệt, nếu $g = f$:
>
> $$
> f\!\left(\operatorname{div}(f)\right) = \prod_P f(P)^{v_P(f)}.
> $$
>
> Đây là công thức tích liên quan đến **Hilbert symbol** trong lý thuyết trường lớp địa phương.

> [!note] Remark 6.16 — Mở rộng lên abelian varieties
> Weil Reciprocity cho đường cong có mở rộng sang abelian varieties qua **Lang's theorem**: với $f \in k(A)^\times$ là hàm hữu tỉ trên abelian variety $A$, tích $\prod_P f(P)^{v_P(f)}$ thỏa các đẳng thức tương tự. Đây là nền tảng của Weil pairing trên abelian variety tổng quát (Bài 29–32).

---

## SageMath Cheatsheet

```python
k = GF(97)
E = EllipticCurve(k, [1, 1])
P = E([0, 1])
Q = E([1, -1])

t_P = E.local_coordinates_at_infinity(prec=5)
print(t_P)
```

```python
from sage.rings.function_field.all import FunctionField
K = FunctionField(QQ, 't')
t = K.gen()
f = (t - 1)
g = t / (t - 2)
```

```python
E = EllipticCurve(QQ, [1, 0, 0, -1, 0])
P = E([0, 0])
print(E.weil_pairing(P, P, 2))
```

---

## Summary / Key Takeaways

- Trường hàm hữu tỉ $k(C)$ là trường siêu việt bậc 1 trên $k$, chứa tất cả "hàm số" trên đường cong.
- Định giá $v_P: k(C)^\times \to \mathbb{Z}$ đo bội số zero/pole của hàm tại điểm $P$.
- $\operatorname{div}(f) = \sum_P v_P(f) [P]$; $\deg(\operatorname{div}(f)) = 0$ trên đường cong xạ ảnh.
- **Weil Reciprocity**: $f(\operatorname{div}(g)) = g(\operatorname{div}(f))$ với hỗ trợ rời nhau — đối xứng sâu xa.
- Dạng tương đương: $\prod_P (f,g)_P = 1$ qua tame symbols.
- Weil Reciprocity là công cụ kỹ thuật thiết yếu để xây dựng Weil pairing và chứng minh tính alternating của nó (Bài 30–31).
- Kết nối với K-theory: tame symbols là yếu tố của $K_2$ trường, reciprocity là triệt tiêu của boundary map.

---

## References

- Silverman, J.H. *The Arithmetic of Elliptic Curves* (GTM 106), Exercise 2.11 and Chapter III.
- Miller, V.S. "The Weil Pairing, and Its Efficient Calculation", *J. Cryptology* 17 (2004), 235–261.
- Wikipedia: *Weil Reciprocity Law* — tóm tắt ngắn gọn với ví dụ.
- Aragon ZK Research Blog: "Weil Reciprocity on the Projective Line" (2022) — ví dụ tính toán chi tiết.
- Serre, J.-P. *Groupes algébriques et corps de classes*, pp. 44–46 — phiên bản tổng quát.
- Kalinin, N. & Magin, M. "Tropical Weil Reciprocity Law and Weil Pairing" (2025) — chứng minh combinatorial.
