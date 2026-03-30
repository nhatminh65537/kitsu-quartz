---
title: "01. Isogeny: Definition, Degree & Separability"
type: math-component
tags: [crypto, isogeny, elliptic-curve, lesson-01]
aliases: [Isogeny Definition]
created: 2026-03-24
---

> **Prerequisites**: Elliptic curve group law, rational maps trên algebraic curves, extension fields $\overline{k}/k$, function fields $k(E)$
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E, E'$ | Đường cong elliptic (short Weierstrass: $y^2 = x^3 + ax + b$ trừ khi nói khác) |
> | $k$ | Trường cơ sở (base field) |
> | $\bar{k}$ | Algebraic closure của $k$ |
> | $E(\bar{k})$ | Tập điểm của $E$ trên $\bar{k}$, là nhóm Abel |
> | $\mathcal{O}$ | Điểm tại vô cực — phần tử trung hòa của $(E(\bar{k}), +)$ |
> | $k(E)$ | Function field của $E$ trên $k$: $k(x, y)/(y^2 - x^3 - ax - b)$ |
> | $[m]$ | Multiplication-by-$m$ map: $P \mapsto P + P + \cdots + P$ ($m$ lần) |
> | $\text{char}(k)$ | Characteristic của trường $k$ |

---

## Tại sao Isogeny?

Khi học ECC, ta đã quen với đường cong elliptic $E$ như một đối tượng độc lập: nhóm $E(\mathbb{F}_p)$, scalar multiplication, và ECDLP. Nhưng câu hỏi tự nhiên là: *hai đường cong elliptic khác nhau có thể liên quan với nhau ra sao?*

Câu trả lời là **isogeny** — một ánh xạ cấu trúc-bảo toàn (structure-preserving) từ đường cong này sang đường cong khác. Isogeny không chỉ là morphism tùy tiện: nó đồng thời là morphism của algebraic curve *và* là group homomorphism. Sự kết hợp hai yêu cầu này rất mạnh, và phần lớn nội dung của khóa học này là khai thác hệ quả của nó.

Tại sao isogeny quan trọng trong mật mã? Vì isogeny cho phép ta **di chuyển giữa các đường cong** trong một không gian lớn — đây là ý tưởng cốt lõi của CSIDH, SIDH và SQISign. Thay vì bài toán discrete logarithm trên một nhóm cố định, bảo mật được đặt trên độ khó của việc tìm isogeny giữa hai đường cong.

---

## 1. Định nghĩa Isogeny

Ta bắt đầu với định nghĩa chính xác nhất, phù hợp với cách dùng trong paper research hiện đại.

> [!note] Định nghĩa 1.1 — Isogeny
> Cho $E_1$ và $E_2$ là hai đường cong elliptic định nghĩa trên trường $k$. Một **isogeny** từ $E_1$ đến $E_2$, ký hiệu $\phi: E_1 \to E_2$, là một morphism của algebraic curves (tức là một rational map được định nghĩa ở mọi điểm) thỏa mãn:
>
> $$
> \phi(\mathcal{O}_{E_1}) = \mathcal{O}_{E_2}
> $$
>
> và $\phi$ không phải là ánh xạ hằng (zero morphism).
>
> Hai đường cong $E_1, E_2$ được gọi là **isogenous** nếu tồn tại ít nhất một isogeny giữa chúng.

Nhận xét quan trọng: yêu cầu $\phi(\mathcal{O}_{E_1}) = \mathcal{O}_{E_2}$ nghe có vẻ yếu (chỉ yêu cầu bảo toàn điểm tại vô cực). Nhưng đây là điều kỳ diệu đặc trưng của đường cong elliptic:

> [!abstract] Định lý 1.2 — Isogeny là Group Homomorphism
> Mọi isogeny $\phi: E_1 \to E_2$ tự động là một group homomorphism:
>
> $$
> \phi(P + Q) = \phi(P) + \phi(Q) \quad \text{với mọi } P, Q \in E_1(\bar{k})
> $$

**Proof sketch.** Ánh xạ $P \mapsto \phi(P) - \phi(P + Q) + \phi(Q)$ là một rational map từ $E_1 \times E_1$ vào $E_2$. Tại điểm $(\mathcal{O}, Q)$ và $(P, \mathcal{O})$, giá trị là $\phi(Q) - \phi(Q) + \phi(Q) = \phi(Q)$ và $\phi(P) - \phi(P) + \phi(\mathcal{O}) = \phi(\mathcal{O}) = \mathcal{O}_{E_2}$... Ta cần dùng định lý từ lý thuyết abelian varieties: một morphism của abelian varieties gửi điểm trung hòa về điểm trung hòa thì là group homomorphism. Xem Silverman [AEC, Theorem III.4.8] để chứng minh đầy đủ. $\blacksquare$

Đây là lý do định nghĩa isogeny chỉ yêu cầu bảo toàn $\mathcal{O}$: điều kiện group homomorphism là hệ quả tự động, không cần đặt riêng.

**Hệ quả ngay lập tức**: isogeny $\phi$ là **surjective** (vì một non-constant morphism của projective algebraic curves luôn surjective), và **kernel** $\ker \phi = \phi^{-1}(\mathcal{O}_{E_2})$ là một subgroup hữu hạn của $E_1(\bar{k})$.

---

## 2. Biểu diễn Explicit — Rational Maps

Trong thực tế tính toán, isogeny được viết tường minh. Cho $E: y^2 = x^3 + ax + b$ và $E': y^2 = x^3 + a'x + b'$, một isogeny $\phi: E \to E'$ có dạng:

$$
\phi(x, y) = \left(\frac{p(x)}{q(x)},\ y \cdot \frac{r(x)}{s(x)}\right)
$$

trong đó $p, q, r, s \in k[x]$ là các đa thức, với $\gcd(p, q) = \gcd(r, s) = 1$. Tọa độ $x$ của $\phi$ chỉ phụ thuộc vào $x$ (tính năng đặc biệt của short Weierstrass), còn tọa độ $y$ có dạng $y \cdot (\text{hàm của } x)$.

> [!example] Ví dụ 1.3 — Multiplication-by-2
> Cho $E: y^2 = x^3 + ax + b$. Map $[2]: E \to E$, $P \mapsto 2P$, là một endomorphism (isogeny từ $E$ đến chính nó). Từ công thức nhân đôi điểm:
>
> $$
> [2](x, y) = \left(\frac{x^4 - 2ax^2 - 8bx + a^2}{4(x^3 + ax + b)},\ y \cdot \frac{x^6 + 5ax^4 + 20bx^3 - 5a^2x^2 - 4abx - 8b^2 - a^3}{4(x^3 + ax + b)^2}\right)
> $$
>
> Đây là isogeny có $\deg [2] = 4$, với $\ker [2] = E[2]$ — nhóm 2-torsion gồm các điểm $P$ thỏa $2P = \mathcal{O}$.

---

## 3. Degree của Isogeny

**Degree** (bậc) là tham số cơ bản nhất của isogeny, đo "kích thước" của nó.

> [!note] Định nghĩa 1.4 — Degree
> Cho $\phi: E_1 \to E_2$ là isogeny. Nó cảm sinh một injection (nhúng) của function fields:
>
> $$
> \phi^*: k(E_2) \hookrightarrow k(E_1), \quad f \mapsto f \circ \phi
> $$
>
> **Degree** của $\phi$ được định nghĩa là degree của extension này:
>
> $$
> \deg \phi := [k(E_1) : \phi^* k(E_2)]
> $$
>
> Đây là một số nguyên dương hữu hạn.

Bên cạnh đó, mọi extension hữu hạn của trường đều phân tích thành phần separable và phần inseparable:

$$
k(E_1) \supset \phi^* k(E_2) \supset \phi^* k(E_2)^{\text{sep}}
$$

> [!note] Định nghĩa 1.5 — Separable degree & Inseparable degree
> - **Separable degree**: $\deg_s \phi := [k(E_1) : \phi^* k(E_2)]_{\text{sep}}$ — degree của phần separable
> - **Inseparable degree**: $\deg_i \phi := [k(E_1) : \phi^* k(E_2)]_{\text{insep}} = \deg \phi / \deg_s \phi$
>
> Một isogeny là **separable** nếu $\deg_s \phi = \deg \phi$ (tức $\deg_i \phi = 1$).
>
> Một isogeny là **purely inseparable** nếu $\deg_s \phi = 1$.

---

## 4. Separability — Ý nghĩa Thực tế

Separability ảnh hưởng trực tiếp đến kích thước kernel:

> [!abstract] Định lý 1.6 — Separability và Kernel
> Cho $\phi: E_1 \to E_2$ là isogeny. Thì:
>
> $$
> \# \ker \phi = \deg_s \phi
> $$
>
> Nói riêng, $\phi$ là separable khi và chỉ khi $\#\ker \phi = \deg \phi$.

**Proof sketch.** Theo lý thuyết function field, số pre-image của một điểm generic bằng $\deg_s \phi$. Với isogeny, mọi điểm có cùng số pre-image (vì group homomorphism), và số đó chính là $\#\ker\phi$. Xem Silverman [AEC, Corollary III.4.9]. $\blacksquare$

Điều này cho ta cách tính nhanh: nếu biết kernel, ta biết separable degree.

> [!info] Khi nào isogeny là separable?
> - Trên trường $\text{char}(k) = 0$: mọi isogeny đều separable.
> - Trên $\mathbb{F}_q$ với $q = p^r$: isogeny degree $\ell$ với $\gcd(\ell, p) = 1$ thì separable.
> - **Frobenius endomorphism** $\pi_q: (x, y) \mapsto (x^q, y^q)$ là ví dụ tiêu biểu của isogeny purely inseparable — có degree $q$ nhưng $\ker \pi_q = \{\mathcal{O}\}$.

---

## 5. Ví dụ Phổ biến

### 5.1. Isogeny degree $\ell$ từ Kernel Point

Trong ứng dụng mật mã, isogeny thường được xây dựng từ một subgroup $G \subset E(\bar{k})$. Nếu $G$ là cyclic subgroup bậc $\ell$ (với $\ell$ nguyên tố, $\ell \neq \text{char}(k)$), thì tồn tại duy nhất một separable isogeny $\phi: E \to E'$ với $\ker \phi = G$. Curve codomain $E' = E/G$ được xác định duy nhất (sẽ tính explicit bằng Vélu's formulas trong Lesson 03).

> [!example] Ví dụ 1.7 — Isogeny degree 3
> Cho $E: y^2 = x^3 + 1$ trên $\mathbb{F}_7$. Điểm $P = (0, 1) \in E(\mathbb{F}_7)$ có order 3 (kiểm tra: $3P = \mathcal{O}$). Subgroup $G = \langle P \rangle = \{\mathcal{O}, (0,1), (0,-1)\}$ cho một isogeny $\phi: E \to E/G$ degree 3. Codomain và rational maps cụ thể của $\phi$ sẽ tính bằng Vélu.

### 5.2. Frobenius Endomorphism

Trên $E/\mathbb{F}_q$ với $q = p^r$, map $\pi_q: (x, y) \mapsto (x^q, y^q)$ là một endomorphism. Nó là **purely inseparable** degree $q$, với $\ker \pi_q = \{\mathcal{O}\}$. Frobenius đóng vai trò cực kỳ quan trọng trong việc phân loại đường cong (Lesson 05).

### 5.3. Isomorphism giữa các Đường cong

Một isomorphism $\psi: E \to E'$ (đổi biến Weierstrass) là isogeny separable degree 1. Hai đường cong isomorphic thì isogenous (hiển nhiên), nhưng hai đường cong isogenous không nhất thiết isomorphic.

---

## 6. Isogeny là Quan hệ Tương đương

> [!abstract] Định lý 1.8 — Isogeny là Equivalence Relation
> Quan hệ "isogenous" là một quan hệ tương đương trên tập các elliptic curves.

**Proof.**
- *Reflexivity*: $[1]: E \to E$ (identity) là isogeny degree 1. $\checkmark$
- *Symmetry*: Nếu $\phi: E_1 \to E_2$ là isogeny, tồn tại **dual isogeny** $\hat{\phi}: E_2 \to E_1$ (sẽ chứng minh đầy đủ trong Lesson 02). $\checkmark$
- *Transitivity*: Nếu $\phi: E_1 \to E_2$ và $\psi: E_2 \to E_3$ là isogenies, thì $\psi \circ \phi: E_1 \to E_3$ là isogeny với $\deg(\psi \circ \phi) = \deg \psi \cdot \deg \phi$. $\checkmark$

$\blacksquare$

Tính chất này cho phép ta nói đến **isogeny class** của đường cong — tập tất cả các đường cong isogenous với $E$ (đây là đồ thị isogeny sẽ phân tích trong Lesson 07).

---

## 7. Decomposition thành Prime-Degree Isogenies

> [!abstract] Định lý 1.9 — Factorization
> Mọi separable isogeny $\phi: E \to E'$ defined over $k$ đều phân tích thành dạng:
>
> $$
> \phi = \phi_k \circ \cdots \circ \phi_1 \circ [n]
> $$
>
> trong đó mỗi $\phi_i$ là một isogeny có degree là số nguyên tố, và $[n]$ là multiplication-by-$n$ với $n = \sqrt{\deg\phi / \prod \deg\phi_i}$.

**Proof sketch.** Gọi $n$ là số lớn nhất sao cho $E[n] \subseteq \ker\phi$, khi đó $\phi = \phi' \circ [n]$. Với $\phi'$, ta chọn một số nguyên tố $\ell \mid \#\ker\phi'$, lấy điểm $P \in \ker\phi'$ bậc $\ell$, đặt $\phi_1: E \to E/\langle P \rangle$ degree $\ell$. Lặp cho đến khi hết. Xem Galbraith [Mathematics of PK Cryptography, Ch. 25]. $\blacksquare$

Hệ quả: trong hầu hết các giao thức, ta chỉ cần làm việc với **cyclic isogenies of prime degree** (thường là $\ell = 2, 3$, hoặc các số nguyên tố nhỏ).

---

## 8. SageMath — Isogeny Cơ bản

```python
p = 431
F = GF(p)
E = EllipticCurve(F, [0, 1])

P = E([0, 1])
print(P.order())

G = [P, -P, E(0)]
phi = E.isogeny(P)

print(phi.degree())
print(phi.codomain())
print(phi(P))
```

```python
E = EllipticCurve(GF(101), [1, 0])
phi2 = E.scalar_multiplication(2)
print(phi2.degree())
print(len(E.division_polynomial(2).roots()))
```

> [!tip] Pattern trong CTF
> Trong CTF isogeny challenges, kernel thường được cho dưới dạng một điểm $P$ bậc $\ell$. Isogeny $\phi$ được construct bằng `E.isogeny(P)` trong SageMath, sau đó codomain `phi.codomain()` là đường cong đích. Quy trình chuỗi isogenies: lặp lại để đi từ $E_0$ đến $E_n$ qua một chuỗi $E_0 \to E_1 \to \cdots \to E_n$.

---

## Tóm tắt

- Isogeny $\phi: E_1 \to E_2$ là morphism of algebraic curves gửi $\mathcal{O}_{E_1} \to \mathcal{O}_{E_2}$, và tự động là group homomorphism.
- **Degree** $\deg\phi = [k(E_1) : \phi^* k(E_2)]$ — đo "kích thước" của isogeny.
- **Separable** nếu phần inseparable trivial: $\deg_s\phi = \deg\phi$. Khi đó $\#\ker\phi = \deg\phi$.
- Frobenius $\pi_q$ là ví dụ tiêu biểu của isogeny **purely inseparable** (degree $q$, kernel trivial).
- Isogenous là quan hệ tương đương — nền tảng khái niệm của isogeny class và isogeny graph.
- Mọi separable isogeny đều phân tích thành các isogeny prime-degree.

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Springer GTM 106, Ch. III.4–6
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062, §1–2
- Sutherland, A. — *18.783 Elliptic Curves*, Lecture 4 (MIT OCW, 2025), Definitions 4.18–4.32
- Galbraith, S. — *Mathematics of Public Key Cryptography*, Cambridge UP, Ch. 25
