---
title: 01. ECC & Finite Field Review
tags: [math, pairing, elliptic-curves, lesson-01] 
aliases: [ECC và Finite Field Review]
created: 2026-03-09
---
# 1. ECC và Finite Field Review

> **Prerequisites**: Đại số tuyến tính cơ bản, trường hữu hạn cơ bản ($\mathbb{F}_p$), số học modular  
> **Objectives**:  
> 
> - Nắm vững định nghĩa đường cong elliptic, group law, và tính toán cụ thể trên $E(\mathbb{F}_q)$
> - Hiểu $j$-invariant, phân loại các curves theo đẳng cấu
> - Nắm định lý Hasse, Frobenius endomorphism, và cấu trúc torsion subgroup $E[n]$ — nền tảng trực tiếp của pairing

---

## Motivation / Intuition

Mọi construction về pairing đều bắt đầu từ một đường cong elliptic $E$ cụ thể trên một trường hữu hạn $\mathbb{F}_q$. Để hiểu pairing, ta cần nắm chắc ba thứ mà lesson này cung cấp:

**Thứ nhất**, đường cong elliptic không chỉ là một tập điểm — nó là một _nhóm Abel_. Group law là phép toán cộng điểm, và mọi thứ sau này (torsion points, pairing, isogenies) đều được xây dựng trên cấu trúc nhóm này.

**Thứ hai**, khi làm việc với pairing, ta không chỉ nhìn vào $E(\mathbb{F}_q)$ mà phải nhìn vào $E(\mathbb{F}_{q^k})$ — tức là đường cong mở rộng sang _extension fields_. Frobenius endomorphism là công cụ kiểm soát cấu trúc của các extension này.

**Thứ ba**, _torsion subgroup_ $E[n]$ — tập các điểm có bậc chia hết $n$ — là đối tượng mà pairing nhận làm đầu vào. Cấu trúc $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ (trên algebraic closure) là sự thật cốt lõi cần ghi nhớ.

> **Ghi chú học tập**: Nếu bạn đã làm việc với ECC trong CTF, bạn quen với $E(\mathbb{F}_p)$ như một black box. Lesson này mở hộp đen đó — chú ý đặc biệt đến phần Frobenius và torsion, vì đây là điểm nối sang Lesson 04–06.

---

## Đường Cong Elliptic (Elliptic Curve)

### Definition

> [!definition] Definition 1.1 — Đường Cong Elliptic (Elliptic Curve) — Weierstrass Form
> Cho $K$ là một trường với $\text{char}(K) \neq 2, 3$. Một **đường cong elliptic** (elliptic curve) $E$ trên $K$ là đường cong phẳng xác định bởi phương trình _Weierstrass rút gọn_ (short Weierstrass equation):
> 
> $$ E : y^2 = x^3 + ax + b, \quad a, b \in K $$
> 
> với điều kiện **non-singular**: discriminant $\Delta \neq 0$, trong đó
> 
> $$ \Delta = -16(4a^3 + 27b^2) \neq 0 $$
> 
> Tập điểm của $E$ trên $K$ là:
> 
> $$ E(K) = \{(x, y) \in K \times K \mid y^2 = x^3 + ax + b\} \cup {\mathcal{O}} $$
> 
> trong đó $\mathcal{O}$ là **điểm vô cực** (point at infinity), đóng vai trò phần tử đơn vị.

> [!note] Remark 1.2
> Ý nghĩa của điều kiện $\Delta \neq 0$ Điều kiện $\Delta \neq 0$ tương đương với việc đa thức $x^3 + ax + b$ không có nghiệm kép — tức là đường cong không có **điểm kỳ dị** (singular point). Nếu $\Delta = 0$, đường cong có một node (hai tiếp tuyến phân biệt) hoặc một cusp (tiếp tuyến kép), và group law không định nghĩa được đúng đắn.
> 
> Hình học: $\Delta = 0$ xảy ra khi $y^2 = (x - r)^2(x - s)$ — đường cong tự giao tại $(r, 0)$.

```python
# SageMath: tạo đường cong elliptic
E = EllipticCurve(GF(11), [1, 6])   # y^2 = x^3 + x + 6 over F_11
E.discriminant()                     # != 0
E.j_invariant()                      # j-invariant
```

---

### Group Law

> [!definition] Definition 1.3 — Phép Cộng Điểm (Point Addition)
> Cho $E: y^2 = x^3 + ax + b$ trên $K$. Phép cộng trên $E(K)$ được định nghĩa theo quy tắc **chord-and-tangent** như sau. Với $P = (x_1, y_1)$ và $Q = (x_2, y_2)$ trong $E(K) \setminus {\mathcal{O}}$:
> 
> **Trường hợp 1 — $P \neq \pm Q$ (chord):**
> 
> $$ \lambda = \frac{y_2 - y_1}{x_2 - x_1}, \quad x_3 = \lambda^2 - x_1 - x_2, \quad y_3 = \lambda(x_1 - x_3) - y_1 $$
> 
> thì $P + Q = (x_3, y_3)$.
> 
> **Trường hợp 2 — $P = Q$ (tangent, point doubling):**
> 
> $$ \lambda = \frac{3x_1^2 + a}{2y_1}, \quad x_3 = \lambda^2 - 2x_1, \quad y_3 = \lambda(x_1 - x_3) - y_1 $$
> 
> thì $2P = (x_3, y_3)$.
> 
> **Trường hợp đặc biệt:**
> 
> - $P + \mathcal{O} = \mathcal{O} + P = P$ với mọi $P$.
> - $P + (-P) = \mathcal{O}$, trong đó $-P = (x_1, -y_1)$.
> - Nếu $P = Q$ và $y_1 = 0$ thì $2P = \mathcal{O}$.

> [!theorem] Theorem 1.4
> $E(K)$ là Nhóm Abel Với phép cộng điểm như trên, $(E(K), +)$ là một nhóm Abel. Cụ thể:
> 
> - **Đóng**: $P, Q \in E(K) \Rightarrow P + Q \in E(K)$.
> - **Kết hợp**: $(P + Q) + R = P + (Q + R)$.
> - **Đơn vị**: $\mathcal{O}$.
> - **Nghịch đảo**: $-P = (x, -y)$ với $P = (x, y)$.
> - **Giao hoán**: $P + Q = Q + P$.

**Ý tưởng chứng minh tính kết hợp.** Đây là điểm khó nhất về mặt kỹ thuật — không thể verify bằng algebra thông thường. Phương pháp chuẩn: dùng lý thuyết **divisors** (sẽ học trong Lesson 04). Tính kết hợp tương đương với sự kiện $\text{Pic}^0(E) \cong E$ thông qua ánh xạ $P \mapsto [P] - [\mathcal{O}]$, và phép cộng trong nhóm Picard thì tự nhiên kết hợp.

> [!note] Remark 1.5 - Projective Coordinates 
> Trong thực tế implement, người ta biểu diễn $E$ trong **projective space** $\mathbb{P}^2$ bằng tọa độ $(X:Y:Z)$ với $(x,y) = (X/Z, Y/Z)$, và điểm vô cực là $(0:1:0)$. Điều này tránh phép chia trong mỗi bước tính — quan trọng cho hiệu năng. Các coordinate system phổ biến: Jacobian coordinates, Affine, López-Dahab (cho char-2).

---

### Worked Example

> [!example] Example 1.6
> Tính Cụ Thể trên $E(\mathbb{F}_{11})$ Xét $E: y^2 = x^3 + x + 6$ trên $\mathbb{F}_{11}$.
> 
> Kiểm tra discriminant: $\Delta = -16(4 \cdot 1^3 + 27 \cdot 6^2) = -16(4 + 972) = -16 \cdot 976 \equiv 4 \pmod{11} \neq 0$. ✓
> 
> Hai điểm $P = (2, 7)$ và $Q = (5, 2)$ nằm trên $E$:
> 
> - $7^2 = 49 \equiv 5$, $; 2^3 + 2 + 6 = 16 \equiv 5 \pmod{11}$. ✓
> - $2^2 = 4$, $; 5^3 + 5 + 6 = 136 \equiv 4 \pmod{11}$. ✓
> 
> **Tính $P + Q$ (chord):**
> 
> $$ \lambda = \frac{2 - 7}{5 - 2} = \frac{-5}{3} \equiv \frac{6}{3} \equiv 6 \cdot 4 \equiv 24 \equiv 2 \pmod{11} $$
> 
> _(vì $3^{-1} \equiv 4 \pmod{11}$)_
> 
> $$ x_3 = 2^2 - 2 - 5 = 4 - 7 = -3 \equiv 8 \pmod{11} $$
> 
> $$ y_3 = 2(2 - 8) - 7 = 2(-6) - 7 = -12 - 7 = -19 \equiv 3 \pmod{11} $$
> 
> Vậy $P + Q = (8, 3)$. Kiểm tra: $3^2 = 9$, $8^3 + 8 + 6 = 526 \equiv 9 \pmod{11}$. ✓
> 
> **Tính $2P$ (tangent):**
> 
> $$ \lambda = \frac{3 \cdot 4 + 1}{2 \cdot 7} = \frac{13}{14} \equiv \frac{2}{3} \equiv 2 \cdot 4 \equiv 8 \pmod{11} $$
> 
> $$ x_4 = 64 - 4 = 60 \equiv 5 \pmod{11}, \quad y_4 = 8(2 - 5) - 7 = -24 - 7 = -31 \equiv 2 \pmod{11} $$
> 
> Vậy $2P = (5, 2) = Q$. Điều này có nghĩa là $Q = 2P$, hay $Q - P = P$, hay $3P = P + Q = (8,3)$.
> 
> Thật vậy, liệt kê toàn bộ group: $E(\mathbb{F}_{11})$ có đúng $13$ điểm (kể cả $\mathcal{O}$), và $P$ là generator với $13P = \mathcal{O}$.

---

## $j$-Invariant và Phân Loại Đường Cong

### Definition

> [!definition] Definition 1.7 — $j$-Invariant
> Cho $E: y^2 = x^3 + ax + b$ trên $K$. **$j$-invariant** của $E$ được định nghĩa là:
> 
> $$ j(E) = -1728 \cdot \frac{(4a)^3}{\Delta} = 1728 \cdot \frac{4a^3}{4a^3 + 27b^2} \in K $$
> 
> (Đây là phần tử của $K$, không nhất thiết là số nguyên.)

> [!theorem] Theorem 1.8 - $j$-Invariant phân loại đường cong đến đẳng cấu
> Hai đường cong elliptic $E_1$ và $E_2$ trên $\bar{K}$ là **đẳng cấu** (isomorphic) trên $\bar{K}$ khi và chỉ khi $j(E_1) = j(E_2)$.
> 
> Ngược lại, với mỗi $j_0 \in \bar{K}$, tồn tại ít nhất một đường cong $E$ với $j(E) = j_0$.

> [!note] Remark 1.9
> Hai giá trị đặc biệt
> - $j = 0$: xảy ra khi $a = 0$, tức $E: y^2 = x^3 + b$. Đường cong có thêm automorphism bậc 3 (ngoài $\pm 1$).
> - $j = 1728$: xảy ra khi $b = 0$, tức $E: y^2 = x^3 + ax$. Đường cong có automorphism bậc 4.
> - Hai trường hợp này liên quan đến **CM** (complex multiplication) và hay xuất hiện trong construction của pairing-friendly curves.

> [!warning] Counterexample 1.10
> $j$ bằng nhau chưa chắc đẳng cấu trên $K$ $j(E_1) = j(E_2)$ chỉ đảm bảo đẳng cấu trên $\bar{K}$, không nhất thiết trên $K$. Các đường cong đẳng cấu trên $\bar{K}$ nhưng không trên $K$ được gọi là **twists** của nhau. Ví dụ: $E: y^2 = x^3 + x$ và $E': y^2 = x^3 - x$ có cùng $j = 1728$ nhưng là **quadratic twists** của nhau trên $\mathbb{Q}$. Twist sẽ đóng vai trò quan trọng trong Lesson 09 (Ate pairing).

---

## Đường Cong trên Trường Hữu Hạn và Frobenius

### Definition

> [!definition] Definition 1.11 — Frobenius Endomorphism
> Cho $E/\mathbb{F}_q$ là đường cong elliptic trên trường hữu hạn $q = p^m$. **Frobenius endomorphism** (đồng cấu Frobenius) là ánh xạ:
> 
> $$ \phi_q : E \to E, \quad (x, y) \mapsto (x^q, y^q), \quad \mathcal{O} \mapsto \mathcal{O} $$
> 
> $\phi_q$ là một **endomorphism** của $E$: nó là homomorphism nhóm và cũng là một morphism of curves (ánh xạ đại số).

> [!theorem] Theorem 1.12 - Đặc trưng $E(\mathbb{F}_q)$ qua Frobenius
> Một điểm $P \in E(\bar{\mathbb{F}}_q)$ thuộc $E(\mathbb{F}_q)$ khi và chỉ khi $\phi_q(P) = P$.
> 
> Nói cách khác: $E(\mathbb{F}_q) = \ker(\phi_q - [1])$, trong đó $[1]$ là đồng nhất thức.

**Ý nghĩa**: Frobenius "kiểm soát" điểm nào của $E$ visible trên $\mathbb{F}_q$. Đây là lý do tại sao, để tìm toàn bộ $n$-torsion $E[n]$, ta thường phải mở rộng sang $\mathbb{F}_{q^k}$ — phần còn lại của $E[n]$ bị ẩn dưới Frobenius.

> [!theorem] Theorem 1.13 — Định lý Hasse (Hasse's Theorem)
> Cho $E/\mathbb{F}_q$. Khi đó:
> 
> $$ \#E(\mathbb{F}_q) = q + 1 - t $$
> 
> trong đó $t$ là **trace of Frobenius** (vết Frobenius) thỏa mãn **Hasse bound**:
> 
> $$ |t| \leq 2\sqrt{q} $$

**Ý nghĩa của $t$**: Frobenius $\phi_q$ thỏa mãn phương trình đặc trưng $\phi_q^2 - t\phi_q + q = 0$ trong $\text{End}(E)$. Nói cách khác, $\phi_q$ là "căn" của $X^2 - tX + q = 0$, tương tự như giá trị riêng của một ma trận $2 \times 2$.

> [!example] Example 1.14 — Hasse Bound cho $E(\mathbb{F}_{11})$ Với $E: y^2 = x^3 + x + 6$ trên $\mathbb{F}_{11}$:
> 
> Đếm trực tiếp: $\#E(\mathbb{F}_{11}) = 13$. Vậy $t = 11 + 1 - 13 = -1$.
> 
> Kiểm tra: $|t| = 1 \leq 2\sqrt{11} \approx 6.63$. ✓
> 
> Phương trình đặc trưng của Frobenius: $X^2 + X + 11 = 0$. Hai nghiệm phức $\frac{-1 \pm i\sqrt{43}}{2}$ có module bằng $\sqrt{11}$.

---

## Torsion Subgroup $E[n]$

### Definition

> [!definition] Definition 1.15 — Torsion Subgroup (Nhóm Con Xoắn)
> Cho $E$ là đường cong elliptic, $n \geq 1$ là số nguyên. **$n$-torsion subgroup** của $E$ là:
> 
> $$ E[n] = {P \in E(\bar{K}) \mid [n]P = \mathcal{O}} $$
> 
> trong đó $[n]P = P + P + \cdots + P$ ($n$ lần), và $\bar{K}$ là bao đóng đại số của $K$.

> [!note] Remark 1.16 — Phân biệt $E[n]$ và $E(\mathbb{F}_q)[n]$
> **Cẩn thận**: $E[n]$ lấy điểm từ $\bar{K}$ (tất cả extension fields), còn $E(\mathbb{F}_q)[n] = E[n] \cap E(\mathbb{F}_q)$ chỉ lấy điểm định nghĩa được trên $\mathbb{F}_q$.
> 
> Sự phân biệt này là trọng tâm của Lesson 05 và 06: input của Weil pairing là các điểm trong $E[n]$, nhiều điểm trong đó không nằm trong $E(\mathbb{F}_q)$ mà phải lên $E(\mathbb{F}_{q^k})$.

> [!theorem] Theorem 1.17 — Cấu trúc của $E[n]$ trên $\bar{K}$
> Cho $E/K$ và $n \geq 1$ với $\gcd(n, \text{char}(K)) = 1$. Khi đó:
> 
> $$ E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z} $$
> 
> là tích của hai nhóm cyclic bậc $n$.

**Ý nghĩa hình học**: $E[n]$ có đúng $n^2$ điểm. Trên $\mathbb{C}$, $E \cong \mathbb{C}/\Lambda$ với $\Lambda$ là lattice, và $E[n] = \frac{1}{n}\Lambda/\Lambda \cong (\mathbb{Z}/n\mathbb{Z})^2$ — trực quan hoàn toàn rõ ràng. Trên trường hữu hạn, định lý này cần chứng minh qua lý thuyết formal groups hoặc étale cohomology.

> [!warning] Counterexample 1.18 — Khi $p \mid n$ Nếu $\text{char}(K) = p$ và $p \mid n$, cấu trúc khác đi:
> 
> - Với **ordinary curves**: $E[p^k] \cong \mathbb{Z}/p^k\mathbb{Z}$ (chỉ một cyclic factor).
> - Với **supersingular curves**: $E[p^k] = {O}$ (torsion $p$-primary hoàn toàn trivial trên $\bar{K}$).
> 
> Sự phân biệt ordinary/supersingular này có hệ quả lớn cho cả pairing (Lesson 06) lẫn isogeny-based crypto.

### Definition

> [!definition] Definition 1.19 — Supersingular và Ordinary Curve
> Đường cong $E/\mathbb{F}_q$ với $q = p^m$ được gọi là:
> 
> - **Supersingular** nếu $p \mid t$ (trace of Frobenius chia hết cho $p$). Tương đương: $E[p] = {\mathcal{O}}$ trên $\bar{\mathbb{F}}_p$.
> - **Ordinary** nếu $p \nmid t$.
> 
> Với $p \geq 5$: $E$ supersingular $\Leftrightarrow$ $t = 0$.

> [!example] Example 1.20 — Supersingular vs Ordinary Trên $\mathbb{F}_{11}$:
> 
> - $E_1: y^2 = x^3 + x + 6$: $t = -1$, $11 \nmid (-1)$, nên **ordinary**. ✓
> - $E_2: y^2 = x^3 + 1$: $\#E_2(\mathbb{F}_{11}) = 12$, $t = 0$, nên **supersingular**.
> 
> Supersingular curves có embedding degree nhỏ (thường $k \leq 6$), khiến chúng dễ tấn công bởi MOV attack nhưng cũng hữu ích cho pairing construction.

---

## Embedding Degree

### Definition

> [!definition] Definition 1.21 — Embedding Degree
> Cho $E/\mathbb{F}_q$ và $n$ là số nguyên tố chia hết $\#E(\mathbb{F}_q)$ với $\gcd(n, q) = 1$. **Embedding degree** (bậc nhúng) của $E$ đối với $n$ là số nguyên dương nhỏ nhất $k$ sao cho:
> 
> $$ n \mid q^k - 1 \quad \Longleftrightarrow \quad q^k \equiv 1 \pmod{n} $$

> [!theorem] Theorem 1.22 — Ý nghĩa của Embedding Degree
> Embedding degree $k$ là số nhỏ nhất sao cho $E[n] \subseteq E(\mathbb{F}_{q^k})$.
> 
> Nói cách khác, mọi $n$-torsion point đều có tọa độ trong $\mathbb{F}_{q^k}$, và $k$ là extension degree nhỏ nhất để điều này xảy ra.

**Tại sao quan trọng?** Pairing $e: E[n] \times E[n] \to \mu_n$ nhận đầu vào là torsion points và output trong $\mu_n \subset \mathbb{F}_{q^k}^\times$. Để pairing _tính toán được_, ta cần toàn bộ $E[n]$ visible trong một extension field. Embedding degree $k$ xác định extension đó là $\mathbb{F}_{q^k}$.

> [!example] Example 1.23 — Tính Embedding Degree
> Với $E: y^2 = x^3 + x + 6$ trên $\mathbb{F}_{11}$, ta có $\#E(\mathbb{F}_{11}) = 13$, nên $n = 13$.
> 
> Tìm $k$ nhỏ nhất: $11^k \equiv 1 \pmod{13}$.
> 
> |$k$|$11^k \pmod{13}$|
> |---|---|
> |1|$11$|
> |2|$121 \equiv 4$|
> |3|$44 \equiv 5$|
> |4|$55 \equiv 3$|
> |6|$3 \cdot 4 = 12 \equiv 12$|
> |12|$12^2 = 144 \equiv 1$ ✓|
> 
> Embedding degree $k = 12$. Điều này có nghĩa: để tính Weil pairing trên đường cong này, ta phải làm việc trong $\mathbb{F}_{11^{12}}$ — một trường rất lớn. Đây là lý do các đường cong dùng trong thực tế cần $k$ nhỏ (BN254 có $k = 12$, BLS12-381 cũng $k = 12$, nhưng $q$ được chọn sao cho arithmetic trong $\mathbb{F}_{q^{12}}$ vẫn hiệu quả).

> [!note] Remark 1.24 — Embedding Degree của Random Curves
> Một đường cong "ngẫu nhiên" có embedding degree xấp xỉ $n$ (cùng cỡ với order của subgroup), khiến $\mathbb{F}_{q^k}$ có kích thước khổng lồ và pairing không thể tính trong thực tế. Đây là lý do phải dùng **pairing-friendly curves** được xây dựng cẩn thận (Lesson 10).

---

## SageMath Cheatsheet

```python
# Tạo elliptic curve trên trường hữu hạn
E = EllipticCurve(GF(11), [1, 6])          # y^2 = x^3 + x + 6 over F_11

# Thuộc tính cơ bản
E.order()                                   # #E(F_q)
E.j_invariant()                             # j-invariant
E.discriminant()                            # discriminant Delta
E.is_supersingular()                        # True/False
E.trace_of_frobenius()                      # t

# Điểm
P = E([2, 7])                               # điểm (2,7)
P + P                                       # point doubling
2*P                                         # scalar multiplication
P.order()                                   # bậc của điểm

# Embedding degree
E.embedding_degree(13)                      # embedding degree w.r.t. n=13

# Extension field
k = 12
Fq12 = GF(11**k, 'a')
E12 = E.base_extend(Fq12)                  # E over F_{q^12}
E12.order()                                 # #E(F_{q^12})

# Torsion points
E.torsion_points()                          # tất cả torsion points (nếu E(K) hữu hạn)
```

**SageMath docs**: [Elliptic Curves](https://doc.sagemath.org/html/en/reference/arithmetic_curves/sage/schemes/elliptic_curves/ell_finite_field.html)

---

## Summary / Key Takeaways

- Đường cong elliptic $E: y^2 = x^3 + ax + b$ là nhóm Abel; phép cộng điểm định nghĩa theo chord-and-tangent. Điều kiện $\Delta \neq 0$ đảm bảo group law hoạt động.
- $j$-invariant phân loại $E$ đến đẳng cấu trên $\bar{K}$. Các đường cong cùng $j$ nhưng không đẳng cấu trên $K$ gọi là twists.
- Frobenius $\phi_q: (x,y) \mapsto (x^q, y^q)$ là endomorphism tự nhiên; $E(\mathbb{F}_q) = \ker(\phi_q - 1)$.
- **Hasse**: $\#E(\mathbb{F}_q) = q + 1 - t$ với $|t| \leq 2\sqrt{q}$. Trace $t$ thỏa phương trình đặc trưng của Frobenius.
- $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ trên $\bar{K}$ (khi $p \nmid n$): $n^2$ điểm. Đây là input domain của pairing.
- $E[n] \subseteq E(\mathbb{F}_{q^k})$ với $k$ = embedding degree = thứ tự của $q \bmod n$.
- Supersingular: $p \mid t$ (tương đương $t = 0$ khi $p \geq 5$). Có embedding degree nhỏ. Ordinary: $p \nmid t$.
- Random curves có embedding degree $k \approx n$: quá lớn để tính pairing. Cần **pairing-friendly curves** với $k$ nhỏ (Lesson 10).

---

## References

- Silverman, J. H. _The Arithmetic of Elliptic Curves_ (AEC), Ch. III (group law), Ch. V (good/bad reduction), Ch. III §8 (torsion).
- Washington, L. C. _Elliptic Curves: Number Theory and Cryptography_, Ch. 2–4.
- Sutherland, A. MIT 18.783 Lecture Notes 2022, Lectures 1–5 — [PDF](https://math.mit.edu/classes/18.783/2022/)
- Costello, C. _Pairing for Beginners_, Ch. 1–2 — [PDF](https://www.craigcostello.com.au/s/PairingsForBeginners.pdf)