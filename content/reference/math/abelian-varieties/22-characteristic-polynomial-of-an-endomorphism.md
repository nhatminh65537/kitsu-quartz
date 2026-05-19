---
title: "22. Characteristic Polynomial of an Endomorphism"
type: theory
tags: [math, abelian-varieties, lesson-22]
aliases: [Characteristic Polynomial Endomorphism, Weil Polynomial]
created: 2026-05-17
---

> **Prerequisites**: [[21-endomorphisms-tate-module|21. Endomorphisms on the Tate Module]], [[11-multiplication-by-n|11. The Multiplication-by-n Map]], [[14-isogenies-definition|14. Isogenies — Definition and Basic Examples]]
> **Objectives**:
> - Định nghĩa đa thức đặc trưng (characteristic polynomial) của một endomorphism $\alpha \in \operatorname{End}(A)$
> - Chứng minh $P_\alpha(t) \in \mathbb{Z}[t]$: hệ số nguyên, không phụ thuộc vào $\ell$
> - Hiểu mối liên hệ giữa $P_\alpha(0) = \deg(\alpha)$ và trace
> - Tính $P_\pi(t)$ cho Frobenius trên elliptic curve và dùng nó đếm điểm

---

## Motivation / Intuition

Trong đại số tuyến tính cổ điển, đa thức đặc trưng (characteristic polynomial) của một ma trận $M \in M_n(\mathbb{R})$ là $\det(tI - M) \in \mathbb{R}[t]$. Nó mã hóa **eigenvalue** của $M$ và là bất biến (invariant) cơ bản nhất của phép biến đổi tuyến tính.

Với abelian variety $A$ và endomorphism $\alpha \in \operatorname{End}(A)$, ta có $T_\ell(\alpha) \in \operatorname{End}_{\mathbb{Z}_\ell}(T_\ell(A)) \cong M_{2g}(\mathbb{Z}_\ell)$. Vậy ta có thể định nghĩa:

$$
P_\alpha(t) \;:=\; \det(t \cdot I_{2g} - T_\ell(\alpha)) \;\in\; \mathbb{Z}_\ell[t]
$$

Thoạt tiên, $P_\alpha(t) \in \mathbb{Z}_\ell[t]$ — nhưng kết quả đáng kinh ngạc là: **$P_\alpha(t) \in \mathbb{Z}[t]$, và không phụ thuộc vào lựa chọn $\ell$!** Đây là kết quả sâu sắc do Weil chứng minh.

Đa thức đặc trưng của Frobenius (một endomorphism đặc biệt trên $\mathbb{F}_q$) là công cụ trung tâm để:
- Đếm số điểm $|A(\mathbb{F}_q)|$.
- Phân loại abelian variety theo lớp isogeny (Honda-Tate, Bài 43).
- Phát biểu Giả Thuyết Riemann cho abelian variety (Bài 41).

---

## Hàm Degree như Hàm Đa Thức

Trước khi định nghĩa $P_\alpha$ qua Tate module, ta có thể mô tả nó độc lập với $\ell$.

### Theorem

> [!theorem] Theorem 22.1 — Degree là hàm đa thức
> Cho $A$ là abelian variety chiều $g$ trên trường $k$. Hàm:
>
> $$
> \operatorname{End}(A) \;\ni\; \alpha \;\longmapsto\; \deg(\alpha) \;\in\; \mathbb{Z}_{\geq 0}
> $$
>
> mở rộng duy nhất thành một **hàm đa thức bậc $2g$** trên $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes_\mathbb{Z} \mathbb{Q}$.

> [!note] Remark 22.1 — Hàm đa thức trên $\mathbb{Z}$-module
> Nói $f: \Lambda \to \mathbb{Z}$ là hàm đa thức bậc $d$ trên $\mathbb{Z}$-module tự do $\Lambda$ nghĩa là: khi viết các phần tử của $\Lambda$ trong cơ sở, $f$ là một đa thức bậc $d$ trong các tọa độ. Định lý 22.1 nói $\deg$ là đa thức bậc $2g$ trong $\operatorname{End}(A)$.

**Ví dụ minh họa:** Với $\alpha = [n]$ (multiplication-by-$n$):

$$
\deg([n]) = n^{2g}
$$

Đây là đa thức bậc $2g$ trong $n$. ✓

---

## Đa Thức Đặc Trưng — Định Nghĩa

### Definition

> [!definition] Definition 22.1 — Đa thức đặc trưng của endomorphism (Characteristic Polynomial)
> Cho $A$ abelian variety chiều $g$ và $\alpha \in \operatorname{End}(A)$. **Đa thức đặc trưng** của $\alpha$ là đa thức **duy nhất** $P_\alpha(t) \in \mathbb{Z}[t]$ bậc $2g$ với hệ số hằng:
>
> $$
> P_\alpha(t) \;:=\; \det\bigl(t \cdot I_{2g} - T_\ell(\alpha)\bigr) \;\in\; \mathbb{Z}_\ell[t]
> $$
>
> và $P_\alpha$ thực sự nằm trong $\mathbb{Z}[t]$ (không phụ thuộc $\ell$). Tương đương:
>
> $$
> P_\alpha(n) \;=\; \deg(\alpha - [n]) \quad \text{với mọi } n \in \mathbb{Z}
> $$
>
> (định nghĩa thứ hai hoàn toàn không dùng $\ell$).

> [!note] Remark 22.2 — Hai định nghĩa tương đương
> Định nghĩa qua Tate module ($\det(tI - T_\ell(\alpha))$) và định nghĩa qua degree ($\deg(\alpha - [n])$ như đa thức) tương đương nhau. Weil dùng định nghĩa thứ hai để tránh phụ thuộc $\ell$; sau khi có Tate module (1966), Tate chứng minh chúng bằng nhau.

### Theorem

> [!theorem] Theorem 22.2 — $P_\alpha \in \mathbb{Z}[t]$ và không phụ thuộc $\ell$
> Với $\alpha \in \operatorname{End}(A)$ và bất kỳ số nguyên tố $\ell \neq \operatorname{char}(k)$:
>
> $$
> P_\alpha(t) \;=\; \det(tI - T_\ell(\alpha)) \;\in\; \mathbb{Z}[t]
> $$
>
> Đa thức này:
>
> - Là **đơn thức** (monic) bậc $2g$.
> - Có **hệ số nguyên** (thuộc $\mathbb{Z}$, không chỉ $\mathbb{Z}_\ell$).
> - **Không phụ thuộc** vào lựa chọn prime $\ell$ (với $\ell \neq \operatorname{char}(k)$).

**Proof (sketch).**
Vì $\operatorname{End}(A)$ là $\mathbb{Z}$-module tự do hữu hạn hạng $r$ (Corollary 21.1), ta có $\operatorname{End}(A) \hookrightarrow M_{2g}(\mathbb{Z}_\ell)$. Do $\operatorname{End}(A)$ là $\mathbb{Z}$-module, $T_\ell(\alpha)$ có ma trận với hệ số trong $\mathbb{Z}_\ell$ nhưng thực chất nằm trong $\mathbb{Z}$ (sau khi chọn cơ sở phù hợp, theo kết quả Zarhin–Poonen–Rybakov). Định lý Cayley-Hamilton và sự kiện $\operatorname{End}(A) \otimes \mathbb{Z}_\ell \hookrightarrow M_{2g}(\mathbb{Z}_\ell)$ đảm bảo hệ số nằm trong $\mathbb{Z}$, độc lập với $\ell$. $\blacksquare$

---

## Viết Tường Minh $P_\alpha$

Ta viết:

$$
P_\alpha(t) \;=\; t^{2g} - c_1 t^{2g-1} + c_2 t^{2g-2} - \cdots + (-1)^{2g} c_{2g}
$$

với $c_i \in \mathbb{Z}$. Hai hệ số quan trọng nhất:

- $c_1 = \operatorname{tr}(T_\ell(\alpha))$ — **trace** của endomorphism.
- $c_{2g} = \det(T_\ell(\alpha))$ — **determinant**.

Từ định nghĩa $P_\alpha(t) = \det(tI - T_\ell(\alpha))$:

$$
P_\alpha(0) \;=\; \det(0 \cdot I - T_\ell(\alpha)) \;=\; \det(-T_\ell(\alpha)) \;=\; (-1)^{2g} \det(T_\ell(\alpha)) \;=\; \det(T_\ell(\alpha))
$$

(vì $2g$ là chẵn, $(-1)^{2g} = 1$).

---

## Hệ Quả Quan Trọng

### Corollary

> [!corollary] Corollary 22.1 — $P_\alpha(0) = \deg(\alpha)$
> Cho $\alpha \in \operatorname{End}(A)$ với $\alpha$ là isogeny (surjective homomorphism với kernel hữu hạn). Khi đó:
>
> $$
> P_\alpha(0) \;=\; \deg(\alpha) \;=\; \det(T_\ell(\alpha))
> $$

**Proof.**
Theo định nghĩa thứ hai của $P_\alpha$: $P_\alpha(n) = \deg(\alpha - [n])$. Đặt $n = 0$: $P_\alpha(0) = \deg(\alpha)$. Từ Tate module: $\deg(\alpha) = |(\ker \alpha)(\bar{k})| = [\text{cokernel of } T_\ell(\alpha) : T_\ell(A)] = |\det T_\ell(\alpha)|_\ell^{-1}$... chi tiết kỹ thuật được bỏ qua, kết quả là $\deg(\alpha) = \det(T_\ell(\alpha))$ (với dấu phù hợp). $\blacksquare$

> [!corollary] Corollary 22.2 — Trace và Degree của $[n]$
> Với multiplication-by-$n$ map $[n]: A \to A$:
>
> - $T_\ell([n]) = n \cdot I_{2g}$ (nhân vô hướng).
> - $P_{[n]}(t) = (t - n)^{2g}$.
> - $\deg([n]) = P_{[n]}(0) = (-n)^{2g} = n^{2g}$ ✓.
> - $\operatorname{tr}([n]) = 2gn$.

> [!corollary] Corollary 22.3 — Cayley-Hamilton cho endomorphism (Theorem of the Square's linear algebra version)
> Cho $\alpha \in \operatorname{End}(A)$ với đa thức đặc trưng $P_\alpha(t) \in \mathbb{Z}[t]$. Khi đó:
>
> $$
> P_\alpha(\alpha) \;=\; 0 \quad \text{trong } \operatorname{End}^0(A) = \operatorname{End}(A) \otimes_\mathbb{Z} \mathbb{Q}
> $$
>
> (tức là $P_\alpha(\alpha)$ là endomorphism tương đương $0$ sau khi tensor với $\mathbb{Q}$).

**Proof.** Định lý Cayley-Hamilton áp dụng cho $T_\ell(\alpha) \in M_{2g}(\mathbb{Z}_\ell)$: $P_\alpha(T_\ell(\alpha)) = 0$. Do $\Phi_\ell: \operatorname{End}^0(A) \hookrightarrow M_{2g}(\mathbb{Q}_\ell)$ injective, suy ra $P_\alpha(\alpha) = 0$ trong $\operatorname{End}^0(A)$. $\blacksquare$

---

## Đa Thức Đặc Trưng của Frobenius — Weil Polynomial

Trên trường hữu hạn $\mathbb{F}_q$ với $q = p^r$, Frobenius $\pi_A: A \to A$ là endomorphism đặc biệt nhất.

### Definition

> [!definition] Definition 22.2 — Đa thức Weil (Weil Polynomial)
> Cho $A$ là abelian variety chiều $g$ trên $\mathbb{F}_q$. **Đa thức Weil** (hay Weil polynomial, hay characteristic polynomial of Frobenius) của $A$ là:
>
> $$
> P_A(t) \;:=\; P_{\pi_A}(t) \;=\; \det\bigl(t \cdot I_{2g} - T_\ell(\pi_A)\bigr) \;\in\; \mathbb{Z}[t]
> $$
>
> Đây là đa thức đơn thức bậc $2g$, hệ số nguyên.

### Định Lý Riemann Giả Thuyết cho AV

> [!theorem] Theorem 22.3 — Giả Thuyết Riemann cho AV (Weil, 1948)
> Cho $A$ abelian variety chiều $g$ trên $\mathbb{F}_q$. Các nghiệm của $P_A(t)$ (trong $\mathbb{C}$) đều có **giá trị tuyệt đối** $\sqrt{q}$:
>
> $$
> P_A(t) \;=\; \prod_{i=1}^{2g} (t - \alpha_i), \quad |\alpha_i| \;=\; \sqrt{q}
> $$
>
> (với $\alpha_i \in \mathbb{C}$, $i = 1, \ldots, 2g$).

> [!note] Remark 22.3 — Tại sao gọi là "Giả thuyết Riemann"?
> Weil phát biểu điều này như một phần của **Weil Conjectures** (1949), được chứng minh dần dần:
>
> - Bernhard Dwork (1960): rationality của hàm zeta.
> - Alexander Grothendieck (1965): functional equation và cohomological interpretation.
> - Pierre Deligne (1974): chứng minh "Giả thuyết Riemann" cuối cùng, tức là $|\alpha_i| = \sqrt{q}$.
>
> Weil tự mình đã chứng minh trường hợp abelian variety (1948) — đây là hướng đi đầu tiên.

---

## Đếm Điểm từ Đa Thức Đặc Trưng

Đây là ứng dụng quan trọng nhất trong thực hành:

### Theorem

> [!theorem] Theorem 22.4 — Công thức đếm điểm
> Cho $A$ abelian variety chiều $g$ trên $\mathbb{F}_q$ với đa thức Weil $P_A(t) = \prod_{i=1}^{2g}(t - \alpha_i)$. Khi đó:
>
> $$
> \bigl|A(\mathbb{F}_{q^n})\bigr| \;=\; \prod_{i=1}^{2g} (1 - \alpha_i^n) \;=\; P_A^*(1^{(n)})
> $$
>
> trong đó $P_A^*(t) = t^{2g} P_A(1/t)$ là đa thức đảo, và tích chạy qua tất cả nghiệm của $P_A$.
>
> Công thức tường minh hơn: định nghĩa $a_i = $ hệ số của $t^{2g-i}$ trong $P_A(t)$, khi đó:
>
> $$
> |A(\mathbb{F}_q)| \;=\; P_A(1) \cdot (-1)^? \quad \text{... (xem ví dụ)}
> $$
>
> Trường hợp đơn giản: $A(\mathbb{F}_q) = \ker(1 - \pi_A)$, nên $|A(\mathbb{F}_q)| = \deg(1 - \pi_A) = P_A(1)$ khi $1 - \pi_A$ là isogeny.

**Proof.**
$A(\mathbb{F}_q) = \{P \in A(\bar{\mathbb{F}}_q) : \pi_A(P) = P\} = \ker(1 - \pi_A)$.

Vì $1 - \pi_A$ là isogeny (có degree hữu hạn), $|A(\mathbb{F}_q)| = \deg(1 - \pi_A) = P_{\pi_A}(1)$.

Với $\mathbb{F}_{q^n}$: $A(\mathbb{F}_{q^n}) = \ker(1 - \pi_A^n)$, nên $|A(\mathbb{F}_{q^n})| = \deg(1 - \pi_A^n) = \prod_i (1 - \alpha_i^n)$. $\blacksquare$

---

## Ví Dụ Tính Tường Minh: Elliptic Curve

### Trường hợp $g = 1$: elliptic curve

Với elliptic curve $E$ (abelian variety chiều $1$), $P_E(t) \in \mathbb{Z}[t]$ bậc $2$:

$$
P_E(t) \;=\; t^2 - a_q t + q, \quad a_q \in \mathbb{Z}
$$

Các nghiệm $\alpha, \bar{\alpha}$ với $\alpha \bar{\alpha} = q$ và $|\alpha| = |\bar{\alpha}| = \sqrt{q}$. Công thức đếm điểm:

$$
|E(\mathbb{F}_q)| \;=\; P_E(1) \;=\; 1 - a_q + q \;=\; q + 1 - a_q
$$

Ký hiệu $a_q$ còn gọi là **trace của Frobenius**.

> [!example] Example 22.1 — $E: y^2 = x^3 - x$ trên $\mathbb{F}_5$
> Đếm điểm bằng tay:
>
> Điểm tại vô cực: $O$. Với $x \in \{0,1,2,3,4\}$, tính $x^3 - x \pmod{5}$:
>
> | $x$ | $x^3 - x \pmod 5$ | $y^2 = ?$ | Số $y$ |
> |---|---|---|---|
> | $0$ | $0$ | $0 = 0^2$ | $y = 0$ → $1$ điểm |
> | $1$ | $0$ | $0 = 0^2$ | $y = 0$ → $1$ điểm |
> | $2$ | $6 \equiv 1$ | $1 = 1^2, 4^2$ | $y = 1, 4$ → $2$ điểm |
> | $3$ | $24 \equiv 4$ | $4 = 2^2, 3^2$ | $y = 2, 3$ → $2$ điểm |
> | $4$ | $60 \equiv 0$ | $0 = 0^2$ | $y = 0$ → $1$ điểm |
>
> Tổng: $1 + 1 + 2 + 2 + 1 + 1 \text{ (điểm } O\text{)} = 8$.
>
> Vậy $|E(\mathbb{F}_5)| = 8$, suy ra $a_5 = 5 + 1 - 8 = -2$.
>
> **Đa thức Weil**: $P_E(t) = t^2 - (-2)t + 5 = t^2 + 2t + 5$.
>
> Kiểm tra nghiệm: $t = \frac{-2 \pm \sqrt{4 - 20}}{2} = -1 \pm 2i$. Giá trị tuyệt đối: $|-1 + 2i| = \sqrt{1+4} = \sqrt{5}$ ✓.

> [!example] Example 22.2 — Đếm $|E(\mathbb{F}_{5^n})|$ bằng đa thức Weil
> Với $\alpha = -1 + 2i$, $\bar\alpha = -1 - 2i$ (nghiệm của $t^2 + 2t + 5$):
>
> $$
> |E(\mathbb{F}_{5^n})| \;=\; 5^n + 1 - \alpha^n - \bar\alpha^n
> $$
>
> Các giá trị:
>
> | $n$ | $5^n$ | $\alpha^n + \bar\alpha^n$ | $|E(\mathbb{F}_{5^n})|$ |
> |---|---|---|---|
> | $1$ | $5$ | $-2$ | $8$ |
> | $2$ | $25$ | $-6$ | $32$ |
> | $3$ | $125$ | $22$ | $104$ |
>
> Kiểm tra $n=2$: $\alpha^2 = (-1+2i)^2 = 1 - 4 - 4i = -3-4i$. Vậy $\alpha^2 + \bar\alpha^2 = -6$. Và $|E(\mathbb{F}_{25})| = 25 + 1 - (-6) = 32$. ✓

---

## Đa Thức Đặc Trưng và Isogeny Class

### Theorem

> [!theorem] Theorem 22.5 — Isogeny và đa thức Weil
> Hai abelian variety $A, B$ trên $\mathbb{F}_q$ isogenous nếu và chỉ nếu chúng có cùng đa thức Weil:
>
> $$
> A \sim B \text{ (isogenous over } \mathbb{F}_q\text{)} \;\Longleftrightarrow\; P_A(t) = P_B(t)
> $$

**Proof.** Hệ quả trực tiếp từ Định lý Tate (Theorem 21.3): $A \sim B$ $\Leftrightarrow$ $T_\ell(A) \cong T_\ell(B)$ như $G_{\mathbb{F}_q}$-module $\Leftrightarrow$ chúng có cùng char poly của Frobenius $\Leftrightarrow$ $P_A = P_B$. $\blacksquare$

> [!note] Remark 22.4 — Nối tiếp với Honda-Tate
> Định lý này, kết hợp với **Định lý Honda-Tate** (Bài 43), cho một phân loại hoàn chỉnh:
>
> $$
> \left\{ \text{Lớp isogeny của AV trên } \mathbb{F}_q \right\} \;\longleftrightarrow\; \left\{ \text{Weil } q\text{-polynomial} \right\}
> $$
>
> Nói cách khác: đa thức Weil **hoàn toàn phân loại** abelian variety trên trường hữu hạn, lên đến isogeny.

---

## Minimal Polynomial và Characteristic Polynomial

> [!note] Remark 22.5 — Minimal polynomial
> Đa thức tối tiểu (minimal polynomial) $m_\alpha(t) \in \mathbb{Z}[t]$ của $\alpha$ là đa thức bậc thấp nhất với $m_\alpha(\alpha) = 0$ trong $\operatorname{End}^0(A)$. Ta có:
>
> $$
> m_\alpha(t) \mid P_\alpha(t)
> $$
>
> và $P_\alpha(t) \mid m_\alpha(t)^{2g}$ (trong $\mathbb{Q}[t]$).
>
> Khi $A$ là **simple** (không có abelian subvariety không tầm thường): $P_\alpha(t) = m_\alpha(t)^e$ với $e = 2g / [K:\mathbb{Q}]$ và $K = \mathbb{Q}[\alpha]$.

---

## SageMath Cheatsheet

Dưới đây là code Python thuần để minh họa tính toán (không cần Sage):

```python
# Đếm điểm và tính đa thức Weil thủ công
# E: y^2 = x^3 - x over F_5
p = 5
points = [(float('inf'), float('inf'))]  # điểm tại vô cực
for x in range(p):
    rhs = (x**3 - x) % p
    for y in range(p):
        if (y*y) % p == rhs:
            points.append((x, y))

print(f'|E(F_{p})| = {len(points)}')  # = 8
a_p = p + 1 - len(points)             # a_p = -2
print(f'a_p = {a_p}')

# Đa thức Weil: P(t) = t^2 - a_p*t + p
print(f'P_E(t) = t^2 {-a_p:+}t {+p:+}')  # t^2 + 2t + 5

# Nghiệm
import cmath
disc = a_p**2 - 4*p
alpha = (a_p + cmath.sqrt(disc)) / 2
beta  = (a_p - cmath.sqrt(disc)) / 2
print(f'alpha = {alpha}, |alpha| = {abs(alpha):.4f}')

# Đếm điểm trên F_{5^n}
for n in range(1, 4):
    count = round((p**n + 1 - alpha**n - beta**n).real)
    print(f'|E(F_5^{n})| = {count}')
```

Trong SageMath đầy đủ:

```python
# Tính Weil polynomial của elliptic curve
E = EllipticCurve(GF(5), [-1, 0])   # y^2 = x^3 - x
P = E.frobenius_polynomial()
print('Weil polynomial:', P)         # t^2 + 2*t + 5
print('|E(F5)| =', P(1))            # = 8
print('a_5 =', -P.list()[1])        # = -2

# Nghiệm của Weil polynomial
K = QQ['t']
t = K.gen()
P_poly = t^2 + 2*t + 5
roots = P_poly.roots(CC)
print('Roots:', roots)
print('|roots|:', [abs(r[0]) for r in roots])  # sqrt(5) ≈ 2.236
```

---

## Summary / Key Takeaways

- **$P_\alpha(t) = \det(tI - T_\ell(\alpha)) \in \mathbb{Z}[t]$**: đơn thức bậc $2g$, hệ số nguyên, không phụ thuộc $\ell$.
- **Hai định nghĩa tương đương**: qua Tate module ($\det$) hoặc qua degree ($P_\alpha(n) = \deg(\alpha - [n])$).
- **$P_\alpha(0) = \deg(\alpha)$**: hệ số tự do bằng bậc của isogeny.
- **Cayley-Hamilton**: $P_\alpha(\alpha) = 0$ trong $\operatorname{End}^0(A)$.
- **Đa thức Weil** $P_A(t) = P_{\pi_A}(t)$: nghiệm có giá trị tuyệt đối $\sqrt{q}$ (Giả thuyết Riemann — Weil 1948).
- **Đếm điểm**: $|A(\mathbb{F}_{q^n})| = \prod_i (1 - \alpha_i^n) = P_A(1)$ (trường hợp $n=1$).
- **Phân loại isogeny**: $A \sim B$ trên $\mathbb{F}_q$ $\Leftrightarrow$ $P_A = P_B$ (từ Định lý Tate).
- **Elliptic curve**: $P_E(t) = t^2 - a_q t + q$, $a_q = q + 1 - |E(\mathbb{F}_q)|$ (trace của Frobenius).

---

## References

- Weil, A. *Variétés abéliennes et courbes algébriques*, Hermann, 1948 (nguồn gốc của Weil polynomial).
- Tate, J. *Endomorphisms of Abelian Varieties over Finite Fields*, Invent. Math. **2** (1966).
- Milne, J. S. *Abelian Varieties*, Section 12 (Characteristic Polynomial). jmilne.org.
- Kedlaya, K. *Weil Cohomology in Practice*, Chapter 6 (RH for Abelian Varieties). kskedlaya.org/weil-cohom.
- Ji, C. *The Weil Conjectures for Abelian Varieties*, Columbia 2021. math.columbia.edu/~calebji.
- Dembélé, L. *Abelian Varieties over Finite Fields: Honda-Tate*, AWS 2024 Notes, Section 5–6.
- LMFDB Knowledge: [Characteristic polynomial of an abelian variety](https://www.lmfdb.org/knowledge/show/av.fq.weil_polynomial).
- Silverman, J. H. *The Arithmetic of Elliptic Curves* (2nd ed.), Section V.2 (Frobenius and Weil conjectures for EC).
