---
title: "05. Frobenius & Curves over Finite Fields"
type: math-component
tags: [crypto, isogeny, frobenius, finite-fields, hasse, lesson-05]
aliases: [Frobenius Endomorphism, Hasse Theorem, Trace of Frobenius]
created: 2026-03-24
---

> **Prerequisites**: [[04-endomorphism-rings|04. Endomorphism Rings & j-invariant]], [[01-isogeny-definition|01. Isogeny: Definition, Degree & Separability]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\pi_q$ | $q$-power Frobenius endomorphism: $(x,y) \mapsto (x^q, y^q)$ |
> | $t$ | Trace of Frobenius: $t = q + 1 - \#E(\mathbb{F}_q)$ |
> | $P(T)$ | Characteristic polynomial của Frobenius: $T^2 - tT + q$ |
> | $\alpha, \beta$ | Roots của $P(T)$ trong $\mathbb{C}$; $\alpha\beta = q$, $\alpha + \beta = t$ |
> | $q = p^r$ | $p$ là characteristic, $r \geq 1$ |
> | $\mathbb{F}_{q^n}$ | Extension field bậc $n$ của $\mathbb{F}_q$ |

---

## Frobenius — Endomorphism Đặc biệt nhất trên Trường Hữu hạn

Khi $E$ được định nghĩa trên $\mathbb{F}_q$, nó tự động nhận được một endomorphism "miễn phí" — **Frobenius endomorphism** $\pi_q$. Đây không phải là một scalar multiplication bình thường; nó phản ánh cấu trúc Galois của trường cơ sở và điều khiển toàn bộ số lượng điểm rational của $E$.

Bài học này xây dựng ba kết quả nền tảng:
- Frobenius thỏa **characteristic polynomial** $T^2 - tT + q = 0$
- **Hasse's theorem**: $|t| \leq 2\sqrt{q}$ — giới hạn số điểm rational
- **Sato-Tate criterion**: hai đường cong trên $\mathbb{F}_q$ isogenous khi và chỉ khi có cùng characteristic polynomial của Frobenius

---

## 1. Frobenius Endomorphism

> [!note] Định nghĩa 5.1 — Frobenius Endomorphism
> Cho $E/\mathbb{F}_q$ với $q = p^r$. **$q$-power Frobenius endomorphism** là:
>
> $$
> \pi_q: E \to E, \qquad (x, y) \mapsto (x^q, y^q), \qquad \mathcal{O} \mapsto \mathcal{O}
> $$

Kiểm tra đây là endomorphism hợp lệ: nếu $(x, y) \in E(\bar{\mathbb{F}}_p)$ thỏa $y^2 = x^3 + Ax + B$ (với $A, B \in \mathbb{F}_q$), thì $(y^q)^2 = (y^2)^q = (x^3 + Ax + B)^q = (x^q)^3 + A(x^q) + B$. ✓

> [!info] Tính chất cơ bản của $\pi_q$
>
> **(a)** $\pi_q$ là **purely inseparable** degree $q$: $\ker\pi_q = \{\mathcal{O}\}$ nhưng $\deg\pi_q = q$.
>
> **(b)** $\pi_q$ là **không giao hoán** với scalar multiplication trong tổng quát: $\pi_q \circ [m] = [m] \circ \pi_q$ nhưng $\pi_q$ không giao hoán với các endomorphisms CM.
>
> **(c)** Điểm rational: $P \in E(\mathbb{F}_q)$ khi và chỉ khi $\pi_q(P) = P$, tức $\ker(\pi_q - [1]) = E(\mathbb{F}_q)$.
>
> **(d)** Đối với extension: $P \in E(\mathbb{F}_{q^n})$ khi và chỉ khi $\pi_q^n(P) = P$.

**Chứng minh (c):** $P = (x, y)$ thỏa $\pi_q(P) = P$ khi và chỉ khi $x^q = x$ và $y^q = y$, tức $x, y \in \mathbb{F}_q$. $\blacksquare$

---

## 2. Characteristic Polynomial của Frobenius

Kết quả trung tâm của lý thuyết đường cong elliptic trên trường hữu hạn:

> [!abstract] Định lý 5.2 — Characteristic Polynomial của Frobenius
> Cho $E/\mathbb{F}_q$. Tồn tại duy nhất số nguyên $t$ sao cho:
>
> $$
> \pi_q^2 - [t]\pi_q + [q] = 0 \quad \text{trong } \text{End}(E)
> $$
>
> Tương đương: với mọi $P \in E(\bar{\mathbb{F}}_p)$:
>
> $$
> \pi_q^2(P) - [t]\pi_q(P) + [q](P) = \mathcal{O}
> $$
>
> $t$ gọi là **trace of Frobenius**, và $P(T) = T^2 - tT + q$ là **characteristic polynomial** của $\pi_q$.
>
> Hơn nữa: $\#E(\mathbb{F}_q) = q + 1 - t$.

**Proof của $\#E(\mathbb{F}_q) = q + 1 - t$.**

$$
\#E(\mathbb{F}_q) = \#\ker(\pi_q - [1]) = \deg_s(\pi_q - [1])
$$

(dùng Định lý 1.6: với isogeny separable, $\#\ker = \deg_s$; và $\pi_q - [1]$ là separable vì $p \nmid 1$.)

Từ tính chất degree là quadratic form (Mệnh đề 2.3):

$$
\deg(\pi_q - [1]) = \deg\pi_q - \pi_q\hat{[1]} - [1]\hat{\pi_q} + \deg[1] = q - t + 1
$$

Sử dụng $\pi_q + \hat{\pi_q} = [t]$ (từ characteristic polynomial) và $\deg\pi_q = q$, $\deg[1] = 1$. $\blacksquare$

---

## 3. Hasse's Theorem

> [!abstract] Định lý 5.3 — Hasse (1933)
> Cho $E/\mathbb{F}_q$. Trace of Frobenius $t$ thỏa:
>
> $$
> |t| \leq 2\sqrt{q}
> $$
>
> Tương đương: $|\#E(\mathbb{F}_q) - (q+1)| \leq 2\sqrt{q}$, hay $\#E(\mathbb{F}_q) \in [q + 1 - 2\sqrt{q},\; q + 1 + 2\sqrt{q}]$.

**Proof (sketch via positive definiteness of degree).**

Với bất kỳ $a, b \in \mathbb{Z}$, xét endomorphism $a\pi_q + b[1] \in \text{End}(E)$. Từ Mệnh đề 2.3 (degree là positive definite quadratic form):

$$
\deg(a\pi_q + b) = a^2 q + ab \cdot (\pi_q + \hat\pi_q) + b^2 = a^2 q + abt + b^2 \geq 0
$$

Điều này phải đúng với mọi $a, b \in \mathbb{Z}$. Đây là một quadratic form dương trong $(a, b)$, nên discriminant của nó không dương:

$$
t^2 - 4q \leq 0 \implies |t| \leq 2\sqrt{q} \qquad \blacksquare
$$

> [!example] Ví dụ 5.4 — Xác nhận Hasse bound
>
> Cho $E: y^2 = x^3 + x + 1$ trên $\mathbb{F}_{101}$. Bằng Schoof's algorithm (hoặc SageMath): $\#E = 105$, nên $t = 101 + 1 - 105 = -3$.
>
> Kiểm tra: $|{-3}| = 3 \leq 2\sqrt{101} \approx 20.1$. ✓
>
> Characteristic polynomial: $P(T) = T^2 + 3T + 101$. Roots: $\alpha, \beta = (-3 \pm \sqrt{9 - 404})/2 = (-3 \pm \sqrt{-395})/2 \in \mathbb{C}$. Nhận thấy $|\alpha| = |\beta| = \sqrt{101} = \sqrt{q}$.

---

## 4. Roots của Characteristic Polynomial và $\#E(\mathbb{F}_{q^n})$

Gọi $\alpha, \beta$ là hai roots (phức) của $P(T) = T^2 - tT + q$. Vì $\alpha\beta = q > 0$ và $\alpha + \beta = t \in \mathbb{R}$, ta có $\beta = \bar{\alpha}$ (conjugate phức) và $|\alpha| = |\beta| = \sqrt{q}$.

> [!abstract] Định lý 5.5 — Số điểm trên extensions
> Với $E/\mathbb{F}_q$ và $\alpha, \beta$ như trên:
>
> $$
> \#E(\mathbb{F}_{q^n}) = q^n + 1 - \alpha^n - \beta^n
> $$
>
> Cụ thể, $t_n := \alpha^n + \beta^n$ thỏa recurrence: $t_n = t \cdot t_{n-1} - q \cdot t_{n-2}$ với $t_0 = 2$, $t_1 = t$.

**Proof.** $E(\mathbb{F}_{q^n}) = \ker(\pi_q^n - [1])$, nên $\#E(\mathbb{F}_{q^n}) = \deg(\pi_q^n - [1])$. Vì $\pi_q^n$ thỏa polynomial $T^2 - t_n T + q^n = 0$ với $t_n = \alpha^n + \beta^n$, ta có $\#E(\mathbb{F}_{q^n}) = q^n + 1 - t_n$. $\blacksquare$

> [!example] Ví dụ 5.6 — Tính $\#E(\mathbb{F}_{p^2})$ từ $t$
>
> Tiếp theo Ví dụ 5.4: $t = -3$, $q = 101$.
>
> $t_2 = t^2 - 2q = (-3)^2 - 2(101) = 9 - 202 = -193$
>
> $\#E(\mathbb{F}_{101^2}) = 101^2 + 1 - (-193) = 10201 + 1 + 193 = 10395$

---

## 5. Tính Inseparability của Frobenius — Phân tích Kỹ hơn

Khi ta viết $[p] = \hat{\pi}_p \circ \pi_p$ trên $E/\mathbb{F}_p$, hai thành phần $\pi_p$ và $\hat{\pi}_p$ có tính chất hoàn toàn khác nhau:

> [!info] Phân tích $[p] = \hat{\pi}_p \circ \pi_p$
>
> - $\pi_p: E \to E^{(p)}$: **purely inseparable** degree $p$ — vì tất cả coefficients của rational maps đều là $p$-th powers
> - $\hat{\pi}_p: E^{(p)} \to E$: **degree $p$**, có thể separable hoặc purely inseparable tùy theo $E$
>   - Nếu $\hat{\pi}_p$ **separable**: $\#\ker\hat{\pi}_p = p$, tức $E[p] \cong \mathbb{Z}/p\mathbb{Z}$ → **ordinary**
>   - Nếu $\hat{\pi}_p$ **purely inseparable**: $\#\ker\hat{\pi}_p = 1$, tức $E[p] = \{0\}$ → **supersingular**

Đây là nguồn gốc của sự phân loại ordinary/supersingular từ góc nhìn inseparability — sẽ phát triển đầy đủ trong Lesson 06.

---

## 6. Sato-Tate Isogeny Criterion

> [!abstract] Định lý 5.7 — Sato-Tate (Isogeny Criterion)
> Hai đường cong $E_1/\mathbb{F}_q$ và $E_2/\mathbb{F}_q$ là **isogenous over $\mathbb{F}_q$** khi và chỉ khi chúng có cùng characteristic polynomial của Frobenius:
>
> $$
> E_1 \sim_{\mathbb{F}_q} E_2 \iff \#E_1(\mathbb{F}_q) = \#E_2(\mathbb{F}_q) \iff t_1 = t_2
> $$

**Proof sketch (chiều $\Rightarrow$).** Nếu $\phi: E_1 \to E_2$ là isogeny, thì $\hat\pi_{E_2} \circ \phi = \phi \circ \hat\pi_{E_1}$ (Frobenius commutes với isogenies), do đó characteristic polynomials bằng nhau.

**Proof sketch (chiều $\Leftarrow$).** Đây khó hơn — cần dùng lý thuyết Honda-Tate và facts về $\text{Hom}(E_1, E_2)$ như $\mathbb{Z}$-module. Xem Galbraith [Ch. 9] hoặc Silverman [AEC, §V]. $\blacksquare$

**Hệ quả quan trọng**: isogeny class của $E/\mathbb{F}_q$ được xác định hoàn toàn bởi $t$ (hoặc tương đương bởi $\#E(\mathbb{F}_q)$). Đây là lý do trong CSIDH, toàn bộ isogeny class của $E_0$ gồm các đường cong có cùng số điểm.

---

## 7. Số lượng Supersingular j-invariants

Trên $\overline{\mathbb{F}}_p$, số lượng j-invariants supersingular là hữu hạn và được tính chính xác:

> [!abstract] Định lý 5.8 — Số supersingular j-invariants trên $\overline{\mathbb{F}}_p$
> Số j-invariants supersingular phân biệt trên $\overline{\mathbb{F}}_p$ là:
>
> $$
> N_{\text{ss}}(p) = \left\lfloor \frac{p-1}{12} \right\rfloor + \varepsilon_p
> $$
>
> trong đó $\varepsilon_p \in \{0, 1, 2\}$ là correction term phụ thuộc vào $p \bmod 12$.
>
> Hơn nữa, mọi supersingular j-invariant đều thuộc $\mathbb{F}_{p^2}$.
>
> [!example] Ví dụ 5.9
>
> - $p = 5$: $N_{\text{ss}} = 0 + 1 = 1$. Một j-invariant supersingular: $j = 0$.
> - $p = 7$: $N_{\text{ss}} = 0 + 1 = 1$. Một j-invariant: $j = 1728$.
> - $p = 11$: $N_{\text{ss}} = 0 + 2 = 2$. Hai j-invariants: $j = 0$ và $j = 1728$.
> - $p = 23$: $N_{\text{ss}} = 1 + 1 = 2$.
> - $p = 101$: $N_{\text{ss}} = 8 + 1 = 9$.

Sự hữu hạn của $N_{\text{ss}}(p)$ là điều làm cho supersingular isogeny graph **Ramanujan** (regular, expander) — nền tảng của bảo mật SIDH và SQISign.

---

## 8. SageMath — Frobenius và Hasse

```python
p = 101
F = GF(p)
E = EllipticCurve(F, [1, 1])

N = E.order()
t = p + 1 - N
print(f"#E(F_p) = {N}, trace t = {t}")
print(f"Hasse bound: |t| = {abs(t)} <= 2*sqrt(p) = {2*float(p**0.5):.3f}")

chi_poly = E.frobenius_polynomial()
print(f"Characteristic polynomial: {chi_poly}")

alpha, beta = chi_poly.roots(CC)
print(f"Roots: alpha = {alpha[0]:.4f}, |alpha| = {abs(alpha[0]):.4f}")
```

```python
p = 101
F = GF(p)
E = EllipticCurve(F, [1, 1])
t = p + 1 - E.order()

t_n = [2, t]
for n in range(2, 8):
    t_n.append(t * t_n[-1] - p * t_n[-2])

for n, tn in enumerate(t_n):
    N_n = p**n + 1 - tn
    print(f"#E(F_p^{n}) = {N_n}")
```

```python
p = 101
count = 0
ss_j = []
for j in GF(p**2):
    try:
        E = EllipticCurve_from_j(j)
        if E.is_supersingular():
            ss_j.append(j)
            count += 1
    except:
        pass
print(f"Supersingular j-invariants mod {p}: {count} found")
```

> [!tip] Pattern trong CTF
> Biết $t$ cho phép tính $\#E(\mathbb{F}_{q^n})$ mà không cần tính lại từ đầu. Đây rất hữu ích khi bài CTF cần tìm order của điểm trên extension field: dùng `E.order()` một lần, rồi dùng recurrence $t_n = t \cdot t_{n-1} - q \cdot t_{n-2}$ để tính $\#E(\mathbb{F}_{q^n})$.

---

## Tóm tắt

- Frobenius $\pi_q: (x,y) \mapsto (x^q, y^q)$ là purely inseparable degree $q$; $\ker(\pi_q - [1]) = E(\mathbb{F}_q)$.
- $\pi_q$ thỏa $\pi_q^2 - [t]\pi_q + [q] = 0$ trong $\text{End}(E)$; $\#E(\mathbb{F}_q) = q + 1 - t$.
- **Hasse's theorem**: $|t| \leq 2\sqrt{q}$ — chứng minh từ positive definiteness của degree map.
- $\#E(\mathbb{F}_{q^n}) = q^n + 1 - \alpha^n - \beta^n$ với $\alpha, \beta$ roots của $P(T) = T^2 - tT + q$.
- **Sato-Tate criterion**: $E_1 \sim E_2$ over $\mathbb{F}_q$ khi và chỉ khi $t_1 = t_2$ (cùng characteristic polynomial Frobenius).
- Số supersingular j-invariants trên $\overline{\mathbb{F}}_p$ là $\approx p/12$ — hữu hạn, mọi cái đều trong $\mathbb{F}_{p^2}$.

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, GTM 106, §V.1–2
- Sutherland, A. — *18.783 Elliptic Curves*, Lectures 8, 13–14 (MIT OCW, 2025)
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062, §2.2
- Galbraith, S. — *Mathematics of Public Key Cryptography*, Ch. 9.10
