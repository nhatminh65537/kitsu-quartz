---
title: "08. Noether Normalization and Nullstellensatz"
tags: [math, commutative-algebra, lesson-08]
aliases: [Noether Normalization and Nullstellensatz]
created: 2026-03-30
---

> **Prerequisites**: [[07-integral-dependence|07. Integral Dependence]]
> **Objectives**:
> - Hiểu và áp dụng Noether Normalization Lemma
> - Chứng minh Hilbert Nullstellensatz (weak và strong form) từ Noether Normalization
> - Thiết lập tương ứng (dictionary) giữa hình học đại số và commutative algebra
> - Nhận diện các corollaries của Nullstellensatz trong thực tiễn

---

## Motivation / Intuition

Bài học này là đỉnh cao của phần đầu khóa học — nơi commutative algebra và hình học đại số gặp nhau lần đầu một cách sâu sắc.

**Noether Normalization** nói rằng mọi $k$-algebra hữu hạn sinh đều là "thực chất" một vành đa thức $k[y_1, \ldots, y_d]$, theo nghĩa integral extension. Đây là một dạng "chuẩn hóa" — mọi không gian đại số có thể được chiếu một cách hữu hạn lên một không gian affine $\mathbb{A}^d$.

**Hilbert Nullstellensatz** — "định lý về tập không" — thiết lập tương ứng cơ bản giữa:

$$
\text{Hình học: tập đại số } V \subseteq \mathbb{A}^n \longleftrightarrow \text{Đại số: ideal } I \subseteq k[x_1,\ldots,x_n]
$$

Trước Nullstellensatz, không rõ liệu hệ phương trình đại số có nghiệm hay không có thể được "phát hiện" bởi cấu trúc đại số của ideal. Nullstellensatz cho câu trả lời dứt khoát: **có**, thông qua radical của ideal.

---

## Noether Normalization Lemma

### Theorem

> [!abstract] Theorem 8.1 — Noether Normalization Lemma
>
> Cho $k$ là trường và $A$ là $k$-algebra hữu hạn sinh với $A \neq 0$. Khi đó tồn tại $y_1, \ldots, y_d \in A$ đại số độc lập trên $k$ (tức không thỏa bất kỳ đa thức nào hệ số $k$) sao cho $A$ là integral extension của $k[y_1, \ldots, y_d]$.
>
> Số $d$ bằng $\dim A$ (Krull dimension của $A$).

Xem chứng minh đầy đủ tại [[a2-noether-normalization|A2. Proof of Noether Normalization Lemma]].

**Phác thảo ý tưởng.** Viết $A = k[x_1, \ldots, x_n]/\mathfrak{p}$. Nếu $x_1, \ldots, x_n$ đại số độc lập thì xong. Nếu không, có quan hệ đại số $f(x_1, \ldots, x_n) = 0$. Thực hiện **change of variables** tuyến tính: đặt $x_i' = x_i - c_i x_n^{N^{i-1}}$ với hằng số $c_i$ chọn thích hợp (hoặc $x_i' = x_i - a_i x_1$ với $a_i \in k$ chọn ngẫu nhiên nếu $k$ vô hạn). Khi đó $f$ trở thành đa thức monic trong $x_n$ với hệ số trong $k[x_1', \ldots, x_{n-1}']$, tức $x_n$ integral over $k[x_1', \ldots, x_{n-1}']$. Quy nạp. $\blacksquare$

> [!example] Example 8.2 — Noether Normalization cụ thể
>
> **Ví dụ 1:** $A = k[x,y]/(xy - 1) = k[t, t^{-1}]$ (vành Laurent polynomials).
>
> Lấy $y_1 = x$. Thì $A = k[x, x^{-1}]$ và $x^{-1}$ thỏa $xy^{-1} - 1 = 0$, tức $y^{-1} = (x)^{-1}$... thực ra: $t^{-1}$ thỏa $x \cdot t^{-1} - 1 = 0$ không monic trong $t^{-1}$. Chọn $y_1 = x - y$: thì $y$ thỏa $y^2 - (x-y)y - 1 = y^2 - y_1 y - 1 = 0$ (monic, hệ số trong $k[y_1]$). Vậy $A$ integral over $k[y_1]$ và $\dim A = 1$.
>
> **Ví dụ 2:** $A = k[x,y]/(x^2 + y^2 - 1)$ (vòng tròn đơn vị).
>
> Lấy $y_1 = x$. Thì $y$ thỏa $y^2 - (1 - x^2) = y^2 + y_1^2 - 1 = 0$ (monic bậc 2 trong $y$, hệ số trong $k[y_1]$). Vậy $A$ integral over $k[x]$ và $\dim A = 1$. Hình học: chiếu vòng tròn lên trục $x$ — mỗi điểm $x \in (-1,1)$ có đúng hai ảnh ngược $(x, \pm\sqrt{1-x^2})$ (ánh xạ integral, bậc 2).

### Corollary

> [!abstract] Corollary 8.3 — Hệ quả của Noether Normalization
>
> Cho $k$ là trường và $A$ là $k$-algebra hữu hạn sinh.
>
> 1. $\dim A < \infty$ (Krull dimension hữu hạn).
> 2. $\dim A = n$ khi $A = k[x_1, \ldots, x_n]/\mathfrak{p}$ và $\mathfrak{p}$ prime $\iff$ $d$ (số biến trong Noether Normalization) bằng $n - \operatorname{ht}(\mathfrak{p})$.
> 3. Mọi maximal ideal $\mathfrak{m}$ của $A$ thỏa $A/\mathfrak{m}$ là extension hữu hạn của $k$.

**Proof của (3).** $A/\mathfrak{m}$ là $k$-algebra hữu hạn sinh (quotient của $A$) và là trường. Noether Normalization cho $A/\mathfrak{m}$ integral over $k[y_1, \ldots, y_d]$. Nhưng $A/\mathfrak{m}$ là trường, và $k[y_1,\ldots,y_d]$ integral closure trong trường phải là trường, nên $k[y_1,\ldots,y_d]$ là trường, tức $d = 0$. Vậy $A/\mathfrak{m}$ integral over $k$ — là extension hữu hạn của $k$. $\blacksquare$

---

## Hilbert Nullstellensatz

Thiết lập ký hiệu: $k$ là trường **đại số đóng** (algebraically closed), $A = k[x_1, \ldots, x_n]$.

Với ideal $I \subseteq A$: **tập không** (zero set) $V(I) = \{(a_1,\ldots,a_n) \in k^n : f(a) = 0\;\forall f \in I\}$.

Với tập $X \subseteq k^n$: **ideal của $X$** là $I(X) = \{f \in A : f(a) = 0\;\forall a \in X\}$.

### Theorem

> [!abstract] Theorem 8.4 — Weak Nullstellensatz
>
> Cho $k$ là trường đại số đóng. Nếu $I \subsetneq k[x_1, \ldots, x_n]$ là proper ideal, thì $V(I) \neq \emptyset$.
>
> Tương đương: $V(I) = \emptyset \iff 1 \in I$ (tức $I = A$).

**Proof.** Vì $I$ là proper ideal, nằm trong một maximal ideal $\mathfrak{m}$. Theo Corollary 8.3(3), $A/\mathfrak{m}$ là extension hữu hạn của $k$. Vì $k$ đại số đóng: $A/\mathfrak{m} = k$. Vậy tồn tại surjection $\varphi: A \to k$ với $\ker\varphi = \mathfrak{m} \supseteq I$. Đặt $a_i = \varphi(x_i) \in k$. Thì với mọi $f \in I \subseteq \mathfrak{m} = \ker\varphi$: $f(a_1,\ldots,a_n) = \varphi(f) = 0$. Vậy $(a_1,\ldots,a_n) \in V(I)$. $\blacksquare$

### Theorem

> [!abstract] Theorem 8.5 — Strong Nullstellensatz
>
> Cho $k$ là trường đại số đóng và $I \subseteq k[x_1, \ldots, x_n]$ là ideal. Khi đó:
>
> $$
> I(V(I)) = \sqrt{I}
> $$
>
> Tức là: đa thức $f$ triệt tiêu trên $V(I)$ khi và chỉ khi $f^m \in I$ với một số $m \geq 1$.

**Proof (dùng Rabinowitsch trick).**

Chiều $(\supseteq)$: Nếu $f^m \in I$, thì với mọi $a \in V(I)$: $f(a)^m = 0$, suy ra $f(a) = 0$ (vì $k$ là trường). Vậy $f \in I(V(I))$.

Chiều $(\subseteq)$: Giả sử $f \in I(V(I))$, tức $f$ triệt tiêu trên $V(I)$. Cần chứng minh $f \in \sqrt{I}$.

**Rabinowitsch trick:** Xét ideal $J \subseteq k[x_1, \ldots, x_n, t]$ sinh bởi $I$ và $(1 - tf)$:

$$
J = I \cdot k[x_1,\ldots,x_n,t] + (1 - tf)
$$

**Claim:** $V(J) = \emptyset$ trong $k^{n+1}$.

*Proof của claim:* Giả sử $(a_1,\ldots,a_n,b) \in V(J)$. Thì mọi $g \in I$ thỏa $g(a_1,\ldots,a_n) = 0$, tức $(a_1,\ldots,a_n) \in V(I)$. Vì $f \in I(V(I))$, ta có $f(a_1,\ldots,a_n) = 0$. Nhưng $1 - tf \in J$ nên $1 - b \cdot f(a_1,\ldots,a_n) = 1 - 0 = 1 = 0$ — mâu thuẫn.

Theo Weak Nullstellensatz: $1 \in J$. Vậy tồn tại $g_i \in k[x_1,\ldots,x_n,t]$, $f_i \in I$ và $h \in k[x_1,\ldots,x_n,t]$ sao cho:

$$
1 = \sum_i g_i f_i + h(1 - tf)
$$

Thay $t = 1/f$ (làm việc trong $k(x_1,\ldots,x_n)[t]/(tf-1)$, rồi nhân bởi lũy thừa đủ lớn của $f$): tồn tại $m$ và $r_i \in k[x_1,\ldots,x_n]$ sao cho:

$$
f^m = \sum_i r_i f_i \in I
$$

Vậy $f \in \sqrt{I}$. $\blacksquare$

---

## Dictionary: Hình học $\leftrightarrow$ Đại số

### Theorem

> [!abstract] Theorem 8.6 — Tương ứng Galois giữa Algebra và Geometry
>
> Cho $k$ là trường đại số đóng. Hai ánh xạ $V$ và $I$ thiết lập song ánh đảo chiều (order-reversing bijection) giữa:
>
> $$
> \left\{\text{tập đại số (algebraic sets)} \subseteq \mathbb{A}^n_k\right\} \;\longleftrightarrow\; \left\{\text{radical ideals} \subseteq k[x_1,\ldots,x_n]\right\}
> $$
>
> Cụ thể, tương ứng này gửi:
>
> | Hình học | Đại số |
> |----------|--------|
> | Tập đại số $X \subseteq \mathbb{A}^n$ | Radical ideal $I(X) \subseteq k[\mathbf{x}]$ |
> | $\mathbb{A}^n$ (toàn bộ không gian) | $(0)$ (zero ideal) |
> | $\emptyset$ | $(1) = k[\mathbf{x}]$ |
> | Điểm $(a_1,\ldots,a_n)$ | Maximal ideal $(x_1-a_1,\ldots,x_n-a_n)$ |
> | Thành phần bất khả quy | Prime ideal |
> | Hợp $X \cup Y$ | Giao $I(X) \cap I(Y)$ |
> | Giao $X \cap Y$ | Radical của $I(X) + I(Y)$ |

**Proof.** Nullstellensatz (Theorem 8.5) cho $I(V(I)) = \sqrt{I}$ với mọi ideal $I$, tức $V \circ I = \operatorname{id}$ trên tập đại số và $I \circ V = \operatorname{id}$ trên radical ideals. Đây chính là điều kiện để có song ánh. $\blacksquare$

### Worked Example

> [!example] Example 8.7 — Áp dụng Nullstellensatz
>
> Trong $\mathbb{C}[x, y]$:
>
> **Ví dụ 1:** $I = (x^2, y^3)$. Thì $\sqrt{I} = (x, y)$ (kiểm tra: $x^1 \in \sqrt{I}$ vì $x^2 \in I$; $y^1 \in \sqrt{I}$ vì $y^3 \in I$). Theo Nullstellensatz: $I(V(I)) = (x,y)$. Thực ra $V(x^2, y^3) = \{(0,0)\}$ (chỉ gốc tọa độ), và $I(\{(0,0)\}) = (x,y)$. ✓
>
> **Ví dụ 2:** Hệ phương trình $\{x^2 + y^2 = 1,\; x^2 - y^2 = 1\}$ trên $\mathbb{C}$. Ideal $I = (x^2 + y^2 - 1, x^2 - y^2 - 1)$. Cộng hai phương trình: $2x^2 = 2$, tức $x = \pm 1$. Trừ: $2y^2 = 0$, tức $y = 0$. Vậy $V(I) = \{(1,0), (-1,0)\}$. Để kiểm tra bằng Nullstellensatz: $f(x,y) = x^2 - 1$ triệt tiêu trên $V(I)$, và quả thật $f = \frac{1}{2}(x^2+y^2-1) + \frac{1}{2}(x^2-y^2-1) \in I \subseteq \sqrt{I}$.
>
> **Ví dụ 3 (Weak Nullstellensatz):** Hệ $\{x + y = 1,\; x + y = 2\}$. Ideal $I = (x+y-1, x+y-2)$. Hiệu: $(x+y-1) - (x+y-2) = 1 \in I$. Vậy $I = (1) = k[x,y]$, và $V(I) = \emptyset$. ✓

---

## SageMath Cheatsheet

```sage
R.<x,y,z> = QQ[]

I = R.ideal(x^2 - y, y^2 - z, z^2 - x)
I.radical()
I.variety(QQbar)

J = R.ideal(x + y - 1, x + y - 2)
J == R.ideal(1)
J.variety(QQbar)

R2.<x,y> = CC[]
I2 = R2.ideal(x^2 + y^2 - 1, x^2 - y^2 - 1)
I2.variety()

R3.<x,y> = QQ[]
I3 = R3.ideal(x^2, y^3)
I3.radical()

R4.<x,y> = QQ[]
I4 = R4.ideal(x*y - 1)
A = R4.quotient(I4)
A.krull_dimension()
```

---

## Summary / Key Takeaways

- **Noether Normalization**: mọi $k$-algebra hữu hạn sinh $A \neq 0$ là integral extension của vành đa thức $k[y_1,\ldots,y_d]$ với $d = \dim A$.
- Hệ quả: mọi maximal ideal $\mathfrak{m}$ của $A$ cho $A/\mathfrak{m}$ là extension hữu hạn của $k$.
- **Weak Nullstellensatz** ($k$ đại số đóng): proper ideal $\Rightarrow$ tập không khác rỗng.
- **Strong Nullstellensatz**: $I(V(I)) = \sqrt{I}$ — radical ideal xác định tập đại số duy nhất.
- **Dictionary geometry $\leftrightarrow$ algebra**: tập đại số $\leftrightarrow$ radical ideals; điểm $\leftrightarrow$ maximal ideals; thành phần bất khả quy $\leftrightarrow$ prime ideals.
- **Rabinowitsch trick**: kỹ thuật thêm biến mới $t$ để chuyển Strong về Weak Nullstellensatz.
- $k$ đại số đóng là **thiết yếu**: Nullstellensatz sai trên $\mathbb{R}$ ($x^2 + 1 = 0$ vô nghiệm thực nhưng $(x^2+1) \neq (1)$).

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 5 & §7.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapter 4 & §13.
- Cox, D., Little, J. & O'Shea, D. *Ideals, Varieties, and Algorithms*, §4.1–4.3.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 21–22.
