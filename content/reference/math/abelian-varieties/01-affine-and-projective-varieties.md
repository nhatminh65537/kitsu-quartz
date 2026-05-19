---
title: "01. Affine and Projective Varieties"
tags: [math, abelian-varieties]
aliases: [Affine and Projective Varieties]
created: 2026-05-17
---

> **Prerequisites**: Đại số trừu tượng cơ bản — vành đa thức $k[x_1, \ldots, x_n]$, lý tưởng (ideal), trường đại số đóng (algebraically closed field). Không yêu cầu kiến thức hình học trước.  
> **Objectives**:
> - Hiểu cấu trúc của không gian affine $\mathbb{A}^n$ và không gian xạ ảnh $\mathbb{P}^n$ như những nơi các đa tạp (variety) sinh sống
> - Định nghĩa chính xác affine variety và projective variety qua tập nghiệm của hệ đa thức
> - Hiểu tô-pô Zariski (Zariski topology) và tính không thể phân tích được (irreducibility)
> - Đi từ đường cong affine $E: y^2 = x^3 + ax + b$ sang dạng xạ ảnh đầy đủ $Y^2Z = X^3 + aXZ^2 + bZ^3$

---

## Motivation / Intuition

Hình học đại số (algebraic geometry) nghiên cứu các tập hình học được xác định bởi hệ phương trình đa thức. Ví dụ đơn giản nhất: đường thẳng $y = x + 1$ trong mặt phẳng, hay đường tròn $x^2 + y^2 = 1$. Nhưng cách tiếp cận này có một điểm yếu nghiêm trọng: rất nhiều hiện tượng hình học đẹp bị "mất" ở vô cực.

Hãy xét hai đường thẳng song song $y = 0$ và $y = 1$ trong mặt phẳng $\mathbb{A}^2$. Chúng không giao nhau — điểm giao "ở vô cực" bị mất. Nhưng trong hình học xạ ảnh, hai đường thẳng bất kỳ trong $\mathbb{P}^2$ luôn giao nhau đúng một điểm. Điều này làm cho nhiều định lý trở nên sạch đẹp hơn — không cần xử lý các trường hợp đặc biệt của song song.

Với đường cong elliptic $E: y^2 = x^3 + ax + b$, có một điểm rất đặc biệt: điểm "tại vô cực" $\mathcal{O}$, được dùng làm phần tử đơn vị của cấu trúc nhóm. Trong không gian affine, điểm này không tồn tại; chỉ trong không gian xạ ảnh $\mathbb{P}^2$ nó mới xuất hiện dưới dạng $[0:1:0]$. Đây là lý do tại sao hầu hết lý thuyết về abelian variety được xây dựng trên nền tảng projective.

Trong bài này, ta xây dựng ngôn ngữ cơ bản: **affine variety** và **projective variety**, cùng tô-pô Zariski đi kèm. Ví dụ chủ đạo xuyên suốt khóa học — đường cong elliptic $E$ — sẽ được phát triển song song.

---

## Không Gian Affine và Affine Variety

### Definition

> [!definition] Definition 1.1 — Không gian affine (Affine Space)
> Cho $k$ là một trường. **Không gian affine $n$ chiều** trên $k$, ký hiệu $\mathbb{A}^n$ hay $\mathbb{A}^n_k$, là tập
>
> $$
> \mathbb{A}^n(k) = \left\{ (a_1, \ldots, a_n) \mid a_i \in k \right\}.
> $$
>
> Các phần tử của $\mathbb{A}^n$ được gọi là **điểm** (point). Khi $k$ là trường đại số đóng (algebraically closed field) như $\overline{\mathbb{F}_p}$ hay $\mathbb{C}$, ta gọi $\mathbb{A}^n$ là **affine $n$-space** và không phân biệt "điểm" với phần tử của $k^n$.

Lưu ý: $\mathbb{A}^n$ khác với $k^n$ như không gian vectơ — ta không quan tâm đến cấu trúc tuyến tính, mà chỉ quan tâm đến các phương trình đa thức.

> [!definition] Definition 1.2 — Tập nghiệm và lý tưởng (Zero Set & Ideal)
> Cho $S \subseteq k[x_1, \ldots, x_n]$ là một tập đa thức. **Tập nghiệm** của $S$ là
>
> $$
> V(S) = \left\{ (a_1, \ldots, a_n) \in \mathbb{A}^n \;\middle|\; f(a_1, \ldots, a_n) = 0 \;\forall f \in S \right\}.
> $$
>
> Ngược lại, với $X \subseteq \mathbb{A}^n$, **lý tưởng của $X$** là
>
> $$
> I(X) = \left\{ f \in k[x_1, \ldots, x_n] \;\middle|\; f(a) = 0 \;\forall a \in X \right\}.
> $$

> [!definition] Definition 1.3 — Affine Variety
> Một **affine variety** (đa tạp affine) là một tập con $X \subseteq \mathbb{A}^n$ có dạng $X = V(I)$ với $I$ là một lý tưởng của $k[x_1, \ldots, x_n]$, sao cho $X$ là **bất khả quy** (irreducible): không thể viết $X = X_1 \cup X_2$ với $X_1, X_2$ đóng proper.

**Tại sao phải giả thiết irreducible?** Vì ta muốn variety là đối tượng "không thể phân tách" — không gian hình học cơ bản. Chẳng hạn, $V(xy) = V(x) \cup V(y)$ trong $\mathbb{A}^2$ là hợp hai đường thẳng, không phải một đối tượng thuần nhất.

> [!theorem] Theorem 1.4 — Định lý Nullstellensatz của Hilbert (Hilbert's Nullstellensatz)
> Cho $k$ là trường đại số đóng và $I \subseteq k[x_1, \ldots, x_n]$ là một lý tưởng. Khi đó:
>
> 1. **(Weak form)**: $V(I) = \emptyset$ khi và chỉ khi $1 \in I$ (tức $I = k[x_1, \ldots, x_n]$).
> 2. **(Strong form)**: $I(V(I)) = \sqrt{I}$ — lý tưởng căn của $I$.

**Hệ quả quan trọng**: Ánh xạ $I \mapsto V(I)$ thiết lập tương ứng một-một giữa các lý tưởng nguyên tố (prime ideals) của $k[x_1, \ldots, x_n]$ và các affine variety bất khả quy (với thứ tự đảo ngược).

Xem chứng minh đầy đủ trong bất kỳ sách đại số giao hoán nào, chẳng hạn Atiyah–MacDonald hoặc Eisenbud *Commutative Algebra*.

### Tô-Pô Zariski (Zariski Topology)

> [!definition] Definition 1.5 — Tô-pô Zariski trên $\mathbb{A}^n$
> Tô-pô Zariski (Zariski topology) trên $\mathbb{A}^n$ được định nghĩa bằng cách chọn **các tập đóng** là các $V(I)$ — tức là tập nghiệm của các hệ đa thức. Cụ thể:
>
> - $\emptyset = V(1)$ và $\mathbb{A}^n = V(0)$ là đóng.
> - Hợp hữu hạn tập đóng là đóng: $V(I) \cup V(J) = V(IJ)$.
> - Giao tùy ý tập đóng là đóng: $\bigcap_\alpha V(I_\alpha) = V\!\left(\sum_\alpha I_\alpha\right)$.

> [!note] Remark 1.6 — Tô-pô Zariski rất thô (coarse)
> Tô-pô Zariski khác hẳn tô-pô Euclidean. Trên $\mathbb{A}^1$, các tập đóng chỉ là $\emptyset$, các tập hữu hạn điểm, và $\mathbb{A}^1$ — vì đa thức một biến chỉ có hữu hạn nghiệm. Do đó $\mathbb{A}^1$ với tô-pô Zariski là gian non-Hausdorff (không Hausdorff) và rất khác $\mathbb{R}$ với tô-pô thông thường.

### Bất Khả Quy và Chiều

> [!definition] Definition 1.7 — Bất Khả Quy (Irreducibility)
> Một tô-pô không gian $X$ được gọi là **bất khả quy** (irreducible) nếu:
>
> - $X \neq \emptyset$, và
> - Với mọi cách viết $X = F_1 \cup F_2$ với $F_1, F_2$ đóng, ta có $F_1 = X$ hoặc $F_2 = X$.
>
> Tương đương: mọi tập mở không rỗng $U \subseteq X$ đều dense (trù mật) trong $X$.

> [!theorem] Theorem 1.8 — Tương ứng với lý tưởng nguyên tố
> Dưới điều kiện $k$ đại số đóng: $V(I)$ bất khả quy khi và chỉ khi $I(V(I)) = \sqrt{I}$ là lý tưởng nguyên tố (prime ideal).

**Proof.**
Giả sử $\sqrt{I} = \mathfrak{p}$ là nguyên tố và $V(I) = F_1 \cup F_2$ với $F_1 = V(J_1)$, $F_2 = V(J_2)$. Khi đó $V(J_1 J_2) = V(I)$, nên $J_1 J_2 \subseteq \sqrt{I} = \mathfrak{p}$. Vì $\mathfrak{p}$ nguyên tố, $J_1 \subseteq \mathfrak{p}$ hoặc $J_2 \subseteq \mathfrak{p}$, tức $V(I) \subseteq F_1$ hoặc $V(I) \subseteq F_2$. Chiều ngược tương tự. $\blacksquare$

---

## Không Gian Xạ Ảnh và Projective Variety

### Định Nghĩa Không Gian Xạ Ảnh

> [!definition] Definition 1.9 — Không gian xạ ảnh (Projective Space)
> **Không gian xạ ảnh $n$ chiều** trên $k$, ký hiệu $\mathbb{P}^n$ hay $\mathbb{P}^n_k$, là tập các lớp tương đương:
>
> $$
> \mathbb{P}^n(k) = \left( k^{n+1} \setminus \{0\} \right) / \!\sim
> $$
>
> trong đó $(a_0, \ldots, a_n) \sim (\lambda a_0, \ldots, \lambda a_n)$ với $\lambda \in k^\times$.
>
> Lớp tương đương của $(a_0, \ldots, a_n)$ được viết là $[a_0 : a_1 : \cdots : a_n]$ và gọi là **tọa độ thuần nhất** (homogeneous coordinates).

**Ví dụ nhỏ**: $\mathbb{P}^1(k) = \{[a:b] \mid (a,b) \neq (0,0)\} / \!\sim$. Tập này có thể đồng nhất với $k \cup \{\infty\}$: đồng nhất $[a:1] \leftrightarrow a \in k$ và $[1:0] \leftrightarrow \infty$.

> [!note] Remark 1.10 — Tại sao tọa độ thuần nhất?
> Một đa thức thông thường $f(x_0, \ldots, x_n)$ không xác định được giá trị tại điểm $[a_0:\cdots:a_n] \in \mathbb{P}^n$ vì biểu diễn không duy nhất: $f(\lambda a_0, \ldots, \lambda a_n) \neq f(a_0, \ldots, a_n)$ nói chung. Tuy nhiên, nếu $f$ là **đa thức thuần nhất** (homogeneous polynomial) bậc $d$ — tức $f(\lambda \mathbf{a}) = \lambda^d f(\mathbf{a})$ — thì tính chất $f(\mathbf{a}) = 0$ không phụ thuộc vào chọn đại diện.

> [!definition] Definition 1.11 — Đa thức thuần nhất (Homogeneous Polynomial)
> Một đa thức $F \in k[X_0, \ldots, X_n]$ được gọi là **thuần nhất bậc $d$** nếu mọi đơn thức trong $F$ đều có tổng bậc bằng $d$. Tương đương:
>
> $$
> F(\lambda X_0, \ldots, \lambda X_n) = \lambda^d F(X_0, \ldots, X_n) \quad \forall \lambda \in k.
> $$

> [!definition] Definition 1.12 — Projective Variety
> Cho $S \subseteq k[X_0, \ldots, X_n]$ là tập các đa thức thuần nhất. **Tập nghiệm xạ ảnh** của $S$ là
>
> $$
> V_+(S) = \left\{ [a_0 : \cdots : a_n] \in \mathbb{P}^n \;\middle|\; F(a_0, \ldots, a_n) = 0 \;\forall F \in S \right\}.
> $$
>
> Một **projective variety** là một $V_+(I)$ bất khả quy với $I$ là lý tưởng thuần nhất (homogeneous ideal).

### Phủ Affine của $\mathbb{P}^n$

> [!theorem] Theorem 1.13 — Phủ affine chuẩn của $\mathbb{P}^n$
> $\mathbb{P}^n$ có phủ bởi $n+1$ tập mở affine: với $i = 0, 1, \ldots, n$, đặt
>
> $$
> U_i = \left\{ [a_0 : \cdots : a_n] \in \mathbb{P}^n \;\middle|\; a_i \neq 0 \right\}.
> $$
>
> Khi đó $U_i \cong \mathbb{A}^n$ qua ánh xạ $[a_0:\cdots:a_n] \mapsto \left(\frac{a_0}{a_i}, \ldots, \widehat{\frac{a_i}{a_i}}, \ldots, \frac{a_n}{a_i}\right)$, và $\mathbb{P}^n = U_0 \cup U_1 \cup \cdots \cup U_n$.

Đây là nền tảng để đi qua lại giữa affine và projective: mỗi projective variety được phủ bởi các mảnh affine, và ta có thể nghiên cứu nó locally trên mỗi mảnh.

---

## Đường Cong Elliptic: Từ Affine Đến Projective

Đây là ví dụ chủ đạo của toàn khóa học. Ta xây dựng chi tiết việc chuyển đổi.

### Dạng Affine

Đường cong elliptic (elliptic curve) trong $\mathbb{A}^2$ có dạng Weierstrass ngắn:

$$
E_{\text{aff}}: \quad y^2 = x^3 + ax + b
$$

với $a, b \in k$ và điều kiện phân biệt (discriminant condition) $\Delta = -16(4a^3 + 27b^2) \neq 0$ (đảm bảo $E$ không singular).

> [!example] Example 1.14 — Affine variety từ elliptic curve
> Đặt $f(x,y) = y^2 - x^3 - ax - b$. Khi đó $E_{\text{aff}} = V(f) \subseteq \mathbb{A}^2$.
>
> Lý tưởng $I(E_{\text{aff}}) = (f) \subseteq k[x,y]$ là lý tưởng nguyên tố (vì $f$ bất khả quy khi $\Delta \neq 0$), xác nhận $E_{\text{aff}}$ là affine variety.
>
> **Chiều**: $\dim E_{\text{aff}} = 1$, tức $E_{\text{aff}}$ là đường cong.

### Dạng Xạ Ảnh — Đóng Gói Projective

Để chuyển $E_{\text{aff}}$ sang $\mathbb{P}^2$, ta **thuần nhất hóa** (homogenize) phương trình. Thay $x = X/Z$, $y = Y/Z$ và nhân với $Z^3$:

$$
Y^2 Z = X^3 + aXZ^2 + bZ^3.
$$

> [!definition] Definition 1.15 — Đóng gói xạ ảnh của elliptic curve
> **Dạng xạ ảnh** của đường cong elliptic $E$ là projective variety trong $\mathbb{P}^2$:
>
> $$
> E: \quad Y^2 Z = X^3 + aXZ^2 + bZ^3.
> $$
>
> Đây là tập nghiệm của đa thức thuần nhất $F(X,Y,Z) = Y^2Z - X^3 - aXZ^2 - bZ^3$ bậc $3$.

> [!example] Example 1.16 — Điểm tại vô cực
> Xét tập nghiệm với $Z = 0$: ta cần $0 = X^3$, tức $X = 0$ (với $Y$ tùy ý, nhưng $Y \neq 0$ để có điểm trong $\mathbb{P}^2$). Vậy điểm duy nhất "tại vô cực" là:
>
> $$
> \mathcal{O} = [0:1:0].
> $$
>
> Điểm này không xuất hiện trong $E_{\text{aff}}$, nhưng lại là **phần tử trung tính** (identity element) của cấu trúc nhóm trên $E$. Đây là lý do ta cần dạng xạ ảnh.

> [!note] Remark 1.17 — Phủ affine của $E$
> Mảnh affine $U_2 = \{Z \neq 0\} \cong \mathbb{A}^2$ của $E$ chính là $E_{\text{aff}}$. Hai mảnh còn lại $U_0 = \{X \neq 0\}$ và $U_1 = \{Y \neq 0\}$ cũng là affine varieties; chúng dùng để "nhìn gần" vào các điểm đặc biệt như $\mathcal{O}$.

---

## Ví Dụ Thêm và Các Loại Variety Quan Trọng

> [!example] Example 1.18 — Các affine variety cơ bản
> - $V(0) = \mathbb{A}^n$ (toàn bộ không gian).
> - $V(x_1, \ldots, x_n) = \{(0,\ldots,0)\}$ (gốc tọa độ).
> - $V(y - x^2) \subseteq \mathbb{A}^2$ — đường parabol, là affine variety chiều $1$ đẳng cấu với $\mathbb{A}^1$ (qua $t \mapsto (t, t^2)$).
> - $V(x^2 + y^2 - 1) \subseteq \mathbb{A}^2$ — đường tròn đơn vị.
> - Mọi điểm $(a_1, \ldots, a_n) \in \mathbb{A}^n$ là affine variety: $V(x_1 - a_1, \ldots, x_n - a_n)$.

> [!example] Example 1.19 — Các projective variety cơ bản
> - $V_+(0) = \mathbb{P}^n$.
> - $V_+(X_0) \cong \mathbb{P}^{n-1}$ — một hyperplane "tại vô cực".
> - $V_+(X_0 X_1 - X_2^2) \subseteq \mathbb{P}^2$ — conic (đường bậc hai xạ ảnh).
> - Mọi điểm $[a_0:\cdots:a_n] \in \mathbb{P}^n$ là projective variety chiều $0$.

> [!warning] Counterexample 1.20 — Tại sao phải thuần nhất?
> Phương trình $f(X,Y) = Y^2 - X$ (không thuần nhất) không xác định một tập con của $\mathbb{P}^2$ vì: tại điểm $[1:1:1]$ ta có $f(1,1) = 0$ nhưng $f(2,2) = 2 \neq 0$ mặc dù $[1:1:1] = [2:2:2]$.
>
> Muốn xác định subvariety của $\mathbb{P}^2$, phải dùng đa thức thuần nhất.

---

## Chiều và Quan Hệ Giữa Affine và Projective

> [!definition] Definition 1.21 — Chiều của variety (Dimension)
> **Chiều** (dimension) của một affine variety $X = V(I)$ được định nghĩa là độ siêu việt (transcendence degree) của trường phân thức $k(X)$ trên $k$:
>
> $$
> \dim X = \operatorname{tr.deg}_k \, k(X).
> $$
>
> Tương đương: chiều là độ dài chuỗi dài nhất $\emptyset \subsetneq X_0 \subsetneq X_1 \subsetneq \cdots \subsetneq X_n = X$ gồm các sub-variety bất khả quy.

Các ví dụ chiều:
- $\dim \mathbb{A}^n = n$, $\dim \mathbb{P}^n = n$.
- Đường cong elliptic: $\dim E = 1$.
- Điểm: $\dim \{\text{pt}\} = 0$.

> [!theorem] Theorem 1.22 — Quan hệ chiều: Affine vs Projective
> Nếu $X \subseteq \mathbb{P}^n$ là projective variety chiều $d$, thì mảnh affine $X \cap U_i \subseteq \mathbb{A}^n$ (nếu không rỗng) cũng là affine variety chiều $d$.

---

## SageMath Cheatsheet

Định nghĩa không gian và variety trong SageMath:

```python
k = QQ
A2 = AffineSpace(k, 2, names='x,y')
x, y = A2.coordinate_ring().gens()

E_aff = A2.curve(y^2 - x^3 - x - 1)
print(E_aff)
print(E_aff.dimension())
```

```python
P2 = ProjectiveSpace(k, 2, names='X,Y,Z')
X, Y, Z = P2.coordinate_ring().gens()

E_proj = P2.curve(Y^2*Z - X^3 - X*Z^2 - Z^3)
print(E_proj)
print(E_proj.genus())
```

```python
Fq = GF(97)
E_finite = EllipticCurve(Fq, [1, 1])
print(E_finite.points()[:5])
print(E_finite.order())
```

---

## Summary / Key Takeaways

- **Affine variety**: tập nghiệm bất khả quy của hệ đa thức trong $\mathbb{A}^n = k^n$.
- **Projective variety**: tập nghiệm bất khả quy của hệ đa thức thuần nhất trong $\mathbb{P}^n$.
- $\mathbb{P}^n$ được phủ bởi $n+1$ mảnh affine $U_i \cong \mathbb{A}^n$; đây là cách "trở về" affine từ projective.
- Tô-pô Zariski: các tập đóng là $V(I)$. Rất thô — không Hausdorff.
- Bất khả quy tương ứng với lý tưởng nguyên tố qua Nullstellensatz.
- Đường cong elliptic $E: y^2 = x^3 + ax + b$ có dạng xạ ảnh $Y^2Z = X^3 + aXZ^2 + bZ^3$ trong $\mathbb{P}^2$, với điểm tại vô cực $\mathcal{O} = [0:1:0]$.
- Chiều của $E$ là $1$ — đây là abelian variety chiều $1$.
- Mọi abelian variety đều là projective variety (sẽ chứng minh ở Bài 13).

---

## References

- Hartshorne, R. *Algebraic Geometry* (Springer GTM 52), Chapter I §1–2.
- Silverman, J.H. *The Arithmetic of Elliptic Curves* (Springer GTM 106), Appendix A.
- Milne, J.S. *Algebraic Geometry* (lecture notes, v6.02), Chapter 1. Available at jmilne.org.
- Shafarevich, I.R. *Basic Algebraic Geometry* Vol. 1, Chapters 1–2.
- Liu, Q. *Algebraic Geometry and Arithmetic Curves* (Oxford GTM), Chapter 2.
