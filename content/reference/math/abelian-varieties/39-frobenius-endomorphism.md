---
title: "39. Frobenius Endomorphism π_A"
type: foundation
tags: [math, abelian-varieties, lesson-39]
aliases: [Frobenius Endomorphism, Frobenius on Abelian Varieties]
created: 2026-05-19
---

> **Prerequisites**: [[38-jacobians-as-principally-polarized-av|38. Jacobians as Principally Polarized AV]], [[22-characteristic-polynomial-of-endomorphism|22. Characteristic Polynomial of an Endomorphism]], [[17-n-torsion-points|17. n-Torsion Points A[n]]]
> **Objectives**:
> - Hiểu định nghĩa chính xác của Frobenius endomorphism π_A trên abelian variety
> - Phân biệt absolute Frobenius, relative Frobenius, và geometric Frobenius (q-power Frobenius)
> - Định nghĩa Verschiebung V_A và nắm vững quan hệ V_A ∘ π_A = [q]
> - Kết nối fixed points của π_A với rational points A(F_q)
> - Tính toán cụ thể với elliptic curves trên F_q

---

## Motivation / Intuition

Khi ta đặt câu hỏi "có bao nhiêu điểm của abelian variety $A$ nằm trong trường hữu hạn $\mathbb{F}_q$?", câu trả lời ẩn nấp trong một endomorphism đặc biệt: **Frobenius endomorphism** (phép nội cấu Frobenius) $\pi_A$. Đây là một trong những công cụ mạnh nhất và đặc trưng nhất của hình học đại số trên trường hữu hạn.

Ý tưởng cốt lõi rất đơn giản: trên $\mathbb{F}_q$, phần tử $x$ thuộc $\mathbb{F}_q$ nếu và chỉ nếu $x^q = x$ (vì $|\mathbb{F}_q^\times| = q-1$ và $x^{q-1} = 1$ với mọi $x \neq 0$). Vì vậy, nếu $A \subseteq \mathbb{P}^N$ được xác định bởi các phương trình với hệ số trong $\mathbb{F}_q$, thì ánh xạ $(x_0 : \cdots : x_N) \mapsto (x_0^q : \cdots : x_N^q)$ gửi $A$ vào chính nó (vì hệ số không thay đổi khi nâng lên lũy thừa $q$). Điểm cố định của ánh xạ này là chính xác những điểm có tọa độ trong $\mathbb{F}_q$.

Frobenius endomorphism còn có một người bạn đồng hành: **Verschiebung** $V_A$. Trong tiếng Đức, "Verschiebung" có nghĩa là "sự dịch chuyển" — và thật vậy, $V_A$ là một loại "đối ngẫu" của $\pi_A$, thoả mãn $V_A \circ \pi_A = [q]$ trên $A$. Cặp đôi $(\pi_A, V_A)$ sẽ là trung tâm của toàn bộ lý thuyết về abelian variety trên trường hữu hạn.

---

## Các phiên bản Frobenius

Trước khi định nghĩa Frobenius trên abelian variety, chúng ta cần phân biệt ba "phiên bản" khác nhau của Frobenius, vì trong tài liệu chúng thường bị dùng lẫn lộn.

### Definition

> [!definition] Definition 39.1 — Absolute Frobenius  
> Cho $S$ là một scheme trong đặc số $p > 0$ (tức $p \cdot \mathcal{O}_S = 0$). **Absolute Frobenius** (Frobenius tuyệt đối) là morphism:
>
> $$
> F_{\text{abs}}: S \to S
> $$
>
> được định nghĩa là identity trên không gian tôpô (underlying topological space) và là map $f \mapsto f^p$ trên sheaf cấu trúc $\mathcal{O}_S$.

Absolute Frobenius là tự nhiên nhất về mặt khái niệm, nhưng nó có một nhược điểm: nó **không** là morphism của $\mathbb{F}_p$-schemes. Cụ thể, nếu $k$ là một trường và $S = \operatorname{Spec}(k)$, thì $F_{\text{abs}}$ là map $x \mapsto x^p$ trên $k$ — đây không phải identity trên $k$ trừ khi $k = \mathbb{F}_p$.

Để khắc phục, ta dùng relative Frobenius:

> [!definition] Definition 39.2 — Relative Frobenius  
> Cho $X$ là một scheme over $k$ (với $\text{char}(k) = p$). Xét **Frobenius twist** (biến dạng Frobenius) $X^{(p)}$: đây là scheme với không gian tôpô giống $X$, nhưng cấu trúc $k$-algebra của nó được thay đổi via $F_{\text{abs}}: k \to k$, tức là $k$ tác dụng lên $X^{(p)}$ bằng $\lambda \cdot s = \lambda^p \cdot s$.
>
> **Relative Frobenius** là morphism của $k$-schemes:
>
> $$
> F_{X/k}: X \to X^{(p)}
> $$
>
> được định nghĩa bởi absolute Frobenius $F_{\text{abs}}: X \to X$ hợp thành với phép chiếu $X^{(p)} \to X$.

> [!definition] Definition 39.3 — Geometric (q-power) Frobenius  
> Cho $A$ là một abelian variety của chiều $g$ defined over $\mathbb{F}_q$ (với $q = p^a$). **Geometric Frobenius** (Frobenius hình học), hay **q-power Frobenius**, là endomorphism:
>
> $$
> \pi_A: A \to A
> $$
>
> được định nghĩa trong bất kỳ embedding projective $A \hookrightarrow \mathbb{P}^N$ bởi:
>
> $$
> \pi_A([x_0 : x_1 : \cdots : x_N]) = [x_0^q : x_1^q : \cdots : x_N^q]
> $$

### Theorem

> [!theorem] Theorem 39.4 — π_A là một endomorphism hợp lệ  
> Định nghĩa trên là hợp lệ: $\pi_A$ là một morphism $A \to A$ (không phụ thuộc vào lựa chọn embedding), và $\pi_A \in \operatorname{End}_{\mathbb{F}_q}(A)$.

**Proof (sketch).**
Nếu $A \subseteq \mathbb{P}^N$ được xác định bởi hệ phương trình $\{f_i(x_0, \ldots, x_N) = 0\}$ với hệ số trong $\mathbb{F}_q$, thì ta cần kiểm tra: nếu $[x_0 : \cdots : x_N] \in A$, thì $[x_0^q : \cdots : x_N^q] \in A$.

Thật vậy, vì $f_i$ có hệ số trong $\mathbb{F}_q$, ta có $c^q = c$ với mọi hệ số $c$. Khi đó:

$$
f_i(x_0^q, \ldots, x_N^q) = f_i(x_0, \ldots, x_N)^q
$$

vì Frobenius là ring homomorphism trong đặc số $p$. Vì $f_i(x_0, \ldots, x_N) = 0$, suy ra $f_i(x_0^q, \ldots, x_N^q) = 0^q = 0$. Vậy $\pi_A(A) \subseteq A$. Tính không phụ thuộc vào embedding và tính tương thích với group law có thể được kiểm tra tương tự. $\blacksquare$

> [!note] Remark 39.5 — Geometric Frobenius vs Arithmetic Frobenius  
> Trong tài liệu, đôi khi có sự phân biệt giữa "geometric Frobenius" (như định nghĩa trên, là map $x \mapsto x^q$) và "arithmetic Frobenius" (là map $x \mapsto x^{1/q}$, hay Frobenius ngược). Trong bài học này, chúng ta luôn dùng geometric Frobenius — đây là quy ước phổ biến trong lý thuyết abelian variety.

---

## Tính chất cơ bản của π_A

### Theorem

> [!theorem] Theorem 39.6 — π_A là một isogeny thuần bất khả ly  
> Frobenius endomorphism $\pi_A$ là một **isogeny thuần bất khả ly** (purely inseparable isogeny). Cụ thể:
>
> (1) $\pi_A$ là surjective với kernel hữu hạn, tức là $\pi_A$ là một isogeny.
>
> (2) $\pi_A$ là purely inseparable: map $\pi_A^*$ trên function field là purely inseparable extension bậc $q^g$.
>
> Đặc biệt, $\deg(\pi_A) = q^g$.

**Proof (sketch).**
Surjectivity: vì $A$ là complete và $\pi_A$ là một morphism không hằng số, nó có image là closed subvariety đầy đủ chiều của $A$; bằng các lý luận về chiều, image phải là $A$.

Purely inseparable: map $\pi_A^*$ trên function field gửi $f \mapsto f^q$, đây là purely inseparable extension bậc $q^g = (p^a)^g$ (vì $[\mathbb{F}_q(A)^q : \mathbb{F}_q(A)] = q^g$ trong không gian hàm số hữu tỉ chiều $g$). $\blacksquare$

> [!note] Remark 39.7 — Degree của Frobenius  
> So sánh: isogeny $[n]: A \to A$ có $\deg([n]) = n^{2g}$ (đã học ở Bài 11). Còn $\pi_A$ có $\deg(\pi_A) = q^g$ (chỉ một nửa số mũ!). Điều này không mâu thuẫn vì $\pi_A$ purely inseparable, còn $[n]$ (với $\gcd(n, p) = 1$) separable.
>
> Sau khi biết characteristic polynomial của $\pi_A$ là đa thức bậc $2g$, ta sẽ thấy rằng $\deg(\pi_A) = P_{\pi_A}(0) = q^g$.

### Worked Example

> [!example] Example 39.8 — Frobenius trên Elliptic Curve $E: y^2 = x^3 + x + 2$ over $\mathbb{F}_{101}$  
> Cho $E: y^2 = x^3 + x + 2$ over $\mathbb{F}_{101}$. Frobenius endomorphism là:
>
> $$
> \pi_E(x, y) = (x^{101}, y^{101})
> $$
>
> Vì $x^{101} \equiv x \pmod{101}$ với mọi $x \in \mathbb{F}_{101}$ (theo định lý Fermat nhỏ), trên $\mathbb{F}_{101}$-points, $\pi_E$ là identity. Nhưng trên $\mathbb{F}_{101^2}$-points (hay $\overline{\mathbb{F}}_{101}$-points), $\pi_E$ hành động không tầm thường.
>
> Ví dụ: nếu $P = (\alpha, \beta)$ với $\alpha \in \mathbb{F}_{101^2} \setminus \mathbb{F}_{101}$, thì $\pi_E(P) = (\alpha^{101}, \beta^{101}) \neq P$.
>
> Số điểm của $E$ over $\mathbb{F}_{101}$: đếm trực tiếp cho $|E(\mathbb{F}_{101})| = 100$. Ta sẽ thấy sau rằng đây bằng $P_{\pi_E}(1)$ với characteristic polynomial $P_{\pi_E}(T) = T^2 - 2T + 101$.
>
> Kiểm tra: $P_{\pi_E}(1) = 1 - 2 + 101 = 100$ ✓.

---

## Verschiebung V_A

### Definition

> [!definition] Definition 39.9 — Verschiebung  
> Cho $A$ là một abelian variety chiều $g$ over $\mathbb{F}_q$ với $q = p^a$. **Verschiebung** (hay **Verschiebung map**) là endomorphism:
>
> $$
> V_A \in \operatorname{End}(A)
> $$
>
> được xác định duy nhất bởi:
>
> $$
> V_A \circ \pi_A = \pi_A \circ V_A = [q]
> $$
>
> Nói cách khác, trong endomorphism algebra $\operatorname{End}^0(A) = \operatorname{End}(A) \otimes_{\mathbb{Z}} \mathbb{Q}$, ta có:
>
> $$
> V_A = q \cdot \pi_A^{-1}
> $$

> [!note] Remark 39.10 — Verschiebung là một isogeny  
> $V_A$ là một isogeny của bậc $q^g$ (giống với $\pi_A$). Điều này thấy ngay từ $V_A \circ \pi_A = [q]$:
>
> $$
> \deg(V_A) \cdot \deg(\pi_A) = \deg([q]) = q^{2g}
> $$
>
> nên $\deg(V_A) = q^{2g}/q^g = q^g$.
>
> Chú ý: đối với elliptic curves ($g = 1$), Verschiebung $V_E$ trùng với dual isogeny $\hat{\pi}_E$ (vì $\hat{\pi}_E \circ \pi_E = [\deg \pi_E] = [q^1] = [q]$). Nhưng với $g > 1$, $V_A \neq \hat{\pi}_A$ nói chung (vì $\hat{\pi}_A \circ \pi_A = [q^g] \neq [q]$).

### Theorem

> [!theorem] Theorem 39.11 — Rosati involution và Verschiebung  
> Cho $\phi: A \to \hat{A}$ là một polarization trên $A$. Rosati involution $f \mapsto f^\dagger = \phi^{-1} \circ \hat{f} \circ \phi$ trên $\operatorname{End}^0(A)$ thỏa mãn:
>
> $$
> \pi_A^\dagger = V_A
> $$
>
> Tức là Verschiebung là ảnh của Frobenius qua Rosati involution.

**Proof (sketch).**
Trong $\operatorname{End}^0(A)$, Rosati involution $f \mapsto f^\dagger$ thoả mãn $(fg)^\dagger = g^\dagger f^\dagger$ và $(f^\dagger)^\dagger = f$. Ta cần chứng minh $\pi_A^\dagger \circ \pi_A = q \cdot \operatorname{id}$ trong $\operatorname{End}^0(A)$.

Điều này tương đương với $\operatorname{Tr}(\pi_A \circ \pi_A^\dagger) = \operatorname{Tr}(q) = 2gq > 0$, đúng theo tính dương xác định của Rosati involution (Theorem 37 trong Bài 37). Từ đó $\pi_A^\dagger = q \pi_A^{-1} = V_A$. $\blacksquare$

### Worked Example

> [!example] Example 39.12 — Verschiebung trên Elliptic Curve  
> Cho $E/\mathbb{F}_7$ là elliptic curve, giả sử $|E(\mathbb{F}_7)| = 8$ (tức $t = q + 1 - |E| = 7 + 1 - 8 = 0$, trace bằng 0).
>
> Characteristic polynomial của $\pi_E$: $P_\pi(T) = T^2 + 7$.
>
> Frobenius $\pi_E$ thoả $\pi_E^2 = -7$ trong $\operatorname{End}^0(E) \cong \mathbb{Q}(\sqrt{-7})$.
>
> Verschiebung: $V_E = 7 \cdot \pi_E^{-1} = 7/\pi_E$.
>
> Trong $\mathbb{Q}(\sqrt{-7})$: $\pi_E = \sqrt{-7}$, nên $V_E = 7/\sqrt{-7} = \sqrt{-7} \cdot (-1) = -\pi_E$.
>
> Quan hệ kiểm tra: $V_E \circ \pi_E = (-\pi_E) \circ \pi_E = -\pi_E^2 = -(-7) = 7 = [7]$ ✓.

---

## Fixed Points và Rational Points

Mối quan hệ quan trọng nhất của Frobenius là kết nối giữa fixed points và rational points.

### Theorem

> [!theorem] Theorem 39.13 — Fixed Points của Frobenius = Rational Points  
> Cho $A/\mathbb{F}_q$ là abelian variety. Khi đó:
>
> $$
> A(\mathbb{F}_q) = \ker(\pi_A - [1]) = \{P \in A(\overline{\mathbb{F}}_q) \mid \pi_A(P) = P\}
> $$
>
> Tổng quát hơn, với mọi $n \geq 1$:
>
> $$
> A(\mathbb{F}_{q^n}) = \ker(\pi_A^n - [1])
> $$

**Proof.**
Cho $P = [x_0 : \cdots : x_N] \in A(\overline{\mathbb{F}}_q)$. Khi đó:

$$
P \in A(\mathbb{F}_q) \iff \text{tọa độ } x_i/x_j \in \mathbb{F}_q \iff x_i^q/x_j^q = x_i/x_j \iff [x_0^q : \cdots : x_N^q] = [x_0 : \cdots : x_N] \iff \pi_A(P) = P
$$

Vậy $A(\mathbb{F}_q) = \ker(\pi_A - [1])$. Áp dụng lại với Frobenius của $\mathbb{F}_{q^n}$ (là $\pi_A^n$), ta được $A(\mathbb{F}_{q^n}) = \ker(\pi_A^n - [1])$. $\blacksquare$

### Theorem

> [!theorem] Theorem 39.14 — Công thức đếm Rational Points  
> Với $A/\mathbb{F}_q$ abelian variety chiều $g$, đặt $P_{\pi_A}(T) = \prod_{i=1}^{2g}(T - \alpha_i) \in \mathbb{Z}[T]$ là characteristic polynomial của $\pi_A$ (bậc $2g$). Khi đó:
>
> $$
> |A(\mathbb{F}_q)| = P_{\pi_A}(1) = \prod_{i=1}^{2g}(1 - \alpha_i)
> $$
>
> và tổng quát:
>
> $$
> |A(\mathbb{F}_{q^n})| = \prod_{i=1}^{2g}(1 - \alpha_i^n)
> $$

**Proof (sketch).**
Ta cần tính $|\ker(\pi_A - [1])|$. Vì $\pi_A - [1]$ là separable (có thể chứng minh bằng cách xem tác dụng lên Lie algebra, xem thêm tài liệu tham khảo), ta có:

$$
|\ker(\pi_A - [1])| = \deg(\pi_A - [1])
$$

Characteristic polynomial của $\pi_A$ trên $T_\ell(A)$ là $P_{\pi_A}(T)$. Khi đó degree của $\pi_A - [1]$ bằng characteristic polynomial của $(\pi_A - \operatorname{id})$ đánh giá tại đặc thù, cho:

$$
\deg(\pi_A - [1]) = P_{\pi_A}(1) = \prod_{i=1}^{2g}(1-\alpha_i)
$$

Với $\mathbb{F}_{q^n}$: Frobenius của $\mathbb{F}_{q^n}$ là $\pi_A^n$ với eigenvalues $\alpha_i^n$, nên $|A(\mathbb{F}_{q^n})| = \prod(1 - \alpha_i^n)$. $\blacksquare$

### Worked Example

> [!example] Example 39.15 — Đếm Points với Characteristic Polynomial  
> Cho $E: y^2 = x^3 + x + 2$ over $\mathbb{F}_{101}$.
>
> Ta tính được $|E(\mathbb{F}_{101})| = 100$ (bằng tính trực tiếp).
>
> Trace: $t = 101 + 1 - 100 = 2$.
>
> Characteristic polynomial: $P_\pi(T) = T^2 - 2T + 101$.
>
> Eigenvalues: $\alpha, \bar{\alpha} = 1 \pm 10i$ (trong $\mathbb{C}$).
>
> Kiểm tra: $(1-\alpha)(1-\bar{\alpha}) = 1 - (\alpha+\bar{\alpha}) + \alpha\bar{\alpha} = 1 - 2 + 101 = 100$ ✓.
>
> Số điểm over $\mathbb{F}_{101^2}$:
>
> $$
> |E(\mathbb{F}_{101^2})| = (1-\alpha^2)(1-\bar{\alpha}^2)
> $$
>
> Ta có $\alpha^2 = (1+10i)^2 = 1 + 20i - 100 = -99 + 20i$.
>
> $(1-\alpha^2)(1-\bar{\alpha}^2) = 1 - (\alpha^2+\bar{\alpha}^2) + |\alpha|^4 = 1 - (-198) + 101^2 = 1 + 198 + 10201 = 10400$.
>
> Thực ra, dùng công thức: $|E(\mathbb{F}_{q^2})| = q^2 + 1 - (\alpha^2 + \bar{\alpha}^2) = 101^2 + 1 - (t^2 - 2q) = 10201 + 1 - (4 - 202) = 10202 + 198 = 10400$.

---

## Mở rộng: Zeta Function của Abelian Variety

> [!definition] Definition 39.16 — Zeta Function của A/F_q  
> **Zeta function** (hàm zeta) của $A/\mathbb{F}_q$ là:
>
> $$
> Z(A/\mathbb{F}_q, T) = \exp\left(\sum_{n=1}^\infty \frac{|A(\mathbb{F}_{q^n})|}{n} T^n\right)
> $$

> [!theorem] Theorem 39.17 — Zeta Function là Rational  
> Với $P_\pi(T) = \prod_{i=1}^{2g}(T - \alpha_i)$ là characteristic polynomial của $\pi_A$, zeta function của $A/\mathbb{F}_q$ là rational:
>
> $$
> Z(A/\mathbb{F}_q, T) = \frac{P_\pi(T)}{(1-T)(1-qT)\cdots(1-q^{2g-1}T)}
> $$
>
> (Đây là một phần của Weil Conjectures, sẽ được thảo luận kỹ hơn ở Bài 41.)

**Proof (sketch).**
Từ công thức $|A(\mathbb{F}_{q^n})| = \prod_i(1-\alpha_i^n)$, ta có:

$$
\sum_{n=1}^\infty \frac{|A(\mathbb{F}_{q^n})|}{n}T^n = -\sum_{i=1}^{2g}\log(1-\alpha_i T)
$$

sau một số tính toán chuỗi hình thức. Exponential của tổng này chính là $\prod_i \frac{1}{1-\alpha_i T}$... (chi tiết xem thêm tài liệu). $\blacksquare$

---

## SageMath Cheatsheet

```python
# Elliptic curve over finite field
E = EllipticCurve(GF(101), [1, 2])   # y^2 = x^3 + x + 2 over F_101

# Frobenius polynomial (char poly of pi)
fp = E.frobenius_polynomial()
print(fp)   # x^2 - 2*x + 101

# Trace of Frobenius (= q + 1 - |E(F_q)|)
t = E.trace_of_frobenius()
print(t)    # 2

# Number of rational points = P_pi(1)
n = E.order()
print(n)    # 100 = 1 - 2 + 101

# Points over F_{q^2}: use the formula manually
q = 101
# |E(F_{q^2})| = q^2 + 1 - (t^2 - 2q)
t2 = t^2 - 2*q  # trace of Frobenius^2
count_q2 = q^2 + 1 - t2
print(count_q2)  # 10400

# Hyperelliptic curve genus 2
R.<x> = GF(101)[]
f = x^5 + x + 1
C = HyperellipticCurve(f)
# Zeta function encodes the Frobenius polynomial (degree 4)
Z = C.zeta_function()
print(Z)

# Extract Frobenius polynomial
J = C.jacobian()
# In newer Sage: J.frobenius_polynomial()

# Count points on jacobian (= degree-4 Weil polynomial evaluated at 1)
# Using the zeta function numerator
```

---

## Summary / Key Takeaways

- **Frobenius endomorphism** $\pi_A \in \operatorname{End}(A)$: map nâng tọa độ lên lũy thừa $q$, là isogeny purely inseparable bậc $q^g$.
- Frobenius **không phụ thuộc** vào lựa chọn embedding projective của $A$.
- **Verschiebung** $V_A = q/\pi_A$ trong $\operatorname{End}^0(A)$, thoả mãn $V_A \circ \pi_A = \pi_A \circ V_A = [q]$.
- $V_A$ trùng với dual isogeny $\hat{\pi}_A$ khi và chỉ khi $g = 1$ (elliptic curve).
- **Fixed points**: $A(\mathbb{F}_{q^n}) = \ker(\pi_A^n - [1])$.
- **Công thức đếm**: $|A(\mathbb{F}_q)| = P_{\pi_A}(1) = \prod_{i=1}^{2g}(1 - \alpha_i)$.
- Dưới Rosati involution: $\pi_A^\dagger = V_A$, phản ánh mối quan hệ đối xứng giữa Frobenius và Verschiebung.
- Zeta function của $A/\mathbb{F}_q$ là rational, được tính hoàn toàn từ characteristic polynomial của $\pi_A$.

---

## References

- Mumford, D. *Abelian Varieties* (2nd ed.), Chapter IV, §19.
- Milne, J.S. *Abelian Varieties*, Available at jmilne.org/math, Chapter 12.
- Silverman, J.H. *The Arithmetic of Elliptic Curves* (2nd ed.), Chapter V, §2.
- Oort, F. "Abelian Varieties over Finite Fields." in *Higher-Dimensional Geometry over Finite Fields*, IOS Press, 2008. Available at math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Dembélé, L. "Abelian Varieties over Finite Fields: Honda-Tate's Theorem." AWS 2024 Notes. swc-math.github.io/aws/2024/PAWSDembele/2023PAWSDembeleNotes.pdf
- Kieffer, J. "Isogeny Graphs of Abelian Varieties over Finite Fields." members.loria.fr/JKieffer/files/isogenycourse.pdf
