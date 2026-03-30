---
title: "17. Honda–Tate Theory"
tags: [math, abelian-varieties, lesson-17]
aliases: [Honda-Tate Theory]
created: 2026-03-24
---

> **Prerequisites**: [[16-abelian-varieties-over-finite-fields|16. Abelian Varieties over Finite Fields]], [[10-endomorphism-algebras|10. Endomorphism Algebras]]
> **Objectives**:
> - Phát biểu Honda–Tate bijection: simple AV over $\mathbb{F}_q$ / isogeny $\leftrightarrow$ conjugacy classes of Weil $q$-numbers
> - Hiểu injectivity (Tate 1966) và surjectivity (Honda 1968)
> - Biết cách xác định $\operatorname{End}^0(A)$ từ Weil number $\pi$: center $K = \mathbb{Q}(\pi)$, division algebra $D$
> - Tính $\dim A$ từ $\pi$ qua công thức $2 \dim A = [D:K]^{1/2} \cdot [K:\mathbb{Q}]$
> - Hiểu classification đầy đủ của isogeny category $\operatorname{AV}_{\mathbb{F}_q}$

---

## Motivation / Intuition

Từ Lesson 16, ta biết Frobenius $\pi_A$ là Weil $q$-number và isogeny class của $A$ được xác định bởi char. poly của $\pi_A$. Honda–Tate theorem hoàn chỉnh bức tranh: **bijection hoàn hảo** giữa:

$$
\left\{ \text{simple AV over } \mathbb{F}_q \right\} / \text{isogeny} \xleftrightarrow{1:1} \left\{ \text{Weil } q\text{-numbers} \right\} / \text{conjugacy}
$$

Đây là classification **hoàn toàn algebraic** của abelian varieties trên finite fields. Thay vì phân loại geometric objects phức tạp, ta phân loại algebraic integers.

---

## Weil $q$-Numbers: Ôn Lại và Bổ Sung

> [!abstract] Definition 17.1 — Weil $q$-Number
> Một **Weil $q$-number** là algebraic integer $\pi \in \bar{\mathbb{Q}}$ sao cho với mọi embedding $\sigma : \mathbb{Q}(\pi) \hookrightarrow \mathbb{C}$: $|\sigma(\pi)| = q^{1/2}$.
>
> Hai Weil $q$-numbers $\pi, \pi'$ **conjugate over $\mathbb{Q}$** nếu $\exists$ isomorphism $\mathbb{Q}(\pi) \cong \mathbb{Q}(\pi')$ gửi $\pi \mapsto \pi'$.
>
> Tập các conjugacy classes của Weil $q$-numbers ký hiệu $W(q)/{\sim}$.

> [!example] Example 17.2 — Weil $p$-Numbers
> Trên $\mathbb{F}_p$ ($q = p$):
>
> - $\pi = \sqrt{-p} \cdot i$ (với $p \equiv 3 \pmod 4$): $|\pi| = \sqrt{p}$. ✓ Minimal poly $T^2 + p$.
> - $\pi = \zeta_3 \sqrt{p}$ ($\zeta_3 = e^{2\pi i/3}$): $|\pi| = \sqrt{p}$. ✓ Minimal poly $T^2 - T \cdot (\pi + \bar\pi) + p = T^2 + \sqrt{p}T + p$? Không, $\pi + \bar\pi = \sqrt{p}(\zeta_3 + \bar\zeta_3) = \sqrt{p} \cdot (-1)$ không là integer...
>
> Dùng ví dụ đơn giản hơn: trên $\mathbb{F}_{p^2}$, $\pi = p$ là Weil $p^2$-number ($|p| = p = (p^2)^{1/2}$). Ứng với AV supersingular.

---

## Honda–Tate Theorem

> [!abstract] Theorem 17.3 — Honda–Tate Bijection
> Map $A \mapsto \pi_A$ (Frobenius endomorphism) induce **bijection**:
>
> $$
> \left\{ \text{simple AV over } \mathbb{F}_q \right\} / \text{isogeny} \xrightarrow{\sim} W(q)/{\sim}.
> $$
>
> - **Injectivity** (Tate 1966): $A \sim B$ (isogenous) $\Leftrightarrow$ $\pi_A$ và $\pi_B$ conjugate.
> - **Surjectivity** (Honda 1968): Mọi Weil $q$-number $\pi$ là $\pi_A$ cho một simple AV $A/\mathbb{F}_q$.

### Proof sketch của Injectivity

Injectivity tương đương Tate's theorem (Lesson 16): $A \sim B \Leftrightarrow f_A = f_B$. Đã chứng minh.

### Proof sketch của Surjectivity (Honda's theorem)

Cho Weil $q$-number $\pi$, ta xây dựng $A/\mathbb{F}_q$ như sau:

**Bước 1**: Chọn $N$ lớn đủ để $\pi^N = $ Frobenius của một CM abelian variety trên $\mathbb{F}_{q^N}$.

**Bước 2**: Dùng **theory of CM** để lift lên characteristic 0: xây dựng CM AV $B/\bar{\mathbb{Q}}$ với CM type $\Phi$ thỏa điều kiện kỹ thuật từ $\pi^N$.

**Bước 3**: Reduce $B$ modulo prime ideal của $\bar{\mathbb{Q}}$ nằm trên $p$. AV giảm $B_0/\mathbb{F}_{q^N}$ có Frobenius $\pi^N$.

**Bước 4**: Take simple factor của restriction of scalars $\operatorname{Res}_{\mathbb{F}_{q^N}/\mathbb{F}_q}(B_0)$ để lấy $A/\mathbb{F}_q$ với Frobenius $\pi$. $\blacksquare$

---

## End$^0(A)$ từ Weil Number

Khi biết $\pi = \pi_A$, ta có thể xác định $\operatorname{End}^0(A)$ hoàn toàn:

> [!abstract] Theorem 17.4 — Cấu trúc $\operatorname{End}^0(A)$ từ $\pi$
> Cho $A$ simple AV over $\mathbb{F}_q$ với Frobenius $\pi$. Đặt $K = \mathbb{Q}(\pi)$ (number field). Thì:
>
> 1. $\operatorname{End}^0(A)$ là **division algebra** $D$ với **center** $K$.
> 2. Tại mỗi place $v$ của $K$, **local invariant** là:
>
>    $$
>    \operatorname{inv}_v(D) = \begin{cases} \dfrac{v(\pi)}{v(q)} \pmod{\mathbb{Z}} & \text{nếu } v \mid p \\ 0 & \text{nếu } v \nmid p, \infty \\ \dfrac{1}{2} & \text{nếu } v \mid \infty \text{ và } \pi \in \mathbb{R}_{<0} \end{cases}
>    $$
>
> 3. **Chiều** của $A$:
>
>    $$
>    2 \dim(A) = [D:K]^{1/2} \cdot [K:\mathbb{Q}].
>    $$

> [!note] Remark 17.5 — Local Invariants và Brauer Group
> $\operatorname{inv}_v(D) \in \mathbb{Q}/\mathbb{Z}$ là invariant của class $[D]$ trong Brauer group $\operatorname{Br}(K_v)$. Class field theory đồng nhất $\operatorname{Br}(K_v) \cong \mathbb{Q}/\mathbb{Z}$ (với $v$ finite).
>
> Thêm vào đó, constraint từ Brauer group: $\sum_v \operatorname{inv}_v(D) = 0$ trong $\mathbb{Q}/\mathbb{Z}$ (tổng toàn cầu).

---

## Phân Loại Đầy Đủ

> [!abstract] Theorem 17.6 — Isogeny Category $\operatorname{AV}_{\mathbb{F}_q}$
> Mọi AV over $\mathbb{F}_q$ isogenous với product $\prod A_i^{e_i}$ của simples. Vì vậy, Honda–Tate cho:
>
> $$
> \left\{ \text{AV over } \mathbb{F}_q \right\} / \text{isogeny} \xleftrightarrow{1:1} \left\{ \text{formal products } \prod \pi_i^{e_i} \text{ của Weil } q\text{-numbers} \right\}.
> $$
>
> Đây là **classification hoàn toàn** của isogeny category $\operatorname{AV}_{\mathbb{F}_q}$.

---

## Ví Dụ Tường Minh

### Elliptic Curves over $\mathbb{F}_p$

> [!example] Example 17.7 — Isogeny Classes of $E/\mathbb{F}_p$
> Trên $\mathbb{F}_p$, Weil $p$-numbers $\pi$ với $\mathbb{Q}(\pi)$ đóng vai trò của $K$:
>
> **Trường hợp (a)**: $K = \mathbb{Q}$ và $\pi^2 = p$ (tức là $\pi = \pm\sqrt{p}$). Thì $f_E(T) = (T \mp \sqrt{p})^2 = T^2 \mp 2\sqrt{p} T + p$... nhưng $\sqrt{p} \notin \mathbb{Z}$ với $p$ non-square. Vậy $\pi = \pm\sqrt{p}$ không là algebraic integer khi $p$ không là bình phương. Chú ý: trường hợp đặc biệt $\pi = p^{1/2}$ chỉ xảy ra với $q = p^{2r}$.
>
> **Trường hợp ordinary**: $\pi \in \mathbb{Q}(\sqrt{-d})$ imaginary quadratic, trace $t = \pi + \bar\pi \in \mathbb{Z}$, $|\pi|^2 = p$. Tương ứng Albert type IV (CM).
>
> **Trường hợp supersingular**: $\pi + \bar\pi = 0$ (tức là $t = 0$), $\pi^2 = -p$. $K = \mathbb{Q}(i\sqrt{p})$. Trên $\mathbb{F}_p$, có đúng $\lfloor p/12 \rfloor + \epsilon$ isogeny classes supersingular.

> [!example] Example 17.8 — Tính $\operatorname{End}^0$ từ Weil Number
> Cho $E/\mathbb{F}_7$ với $f_E(T) = T^2 + 7$ (supersingular, trace $= 0$):
>
> $\pi = i\sqrt{7}$ (Weil $7$-number), $K = \mathbb{Q}(i\sqrt{7})$ (imaginary quadratic).
>
> Local invariants: tại $v | 7$: $\operatorname{inv}_v(D) = v(\pi)/v(7) \pmod{\mathbb{Z}}$. Với $v$ the unique prime above $7$ trong $K$: $v(\pi) = v(i\sqrt{7}) = 1/2$ (vì $\pi^2 = -7$ và $v(7) = 1$). Vậy $\operatorname{inv}_v(D) = 1/2$.
>
> Tại $v | \infty$: $\pi = i\sqrt{7}$ imaginary, nên $\operatorname{inv}_\infty(D) = 1/2$.
>
> Kiểm tra: $1/2 + 1/2 = 1 = 0$ trong $\mathbb{Q}/\mathbb{Z}$. ✓
>
> $D$ = quaternion algebra over $K = \mathbb{Q}(i\sqrt{7})$ (nhưng thực ra $D = B_{7,\infty}$ là quaternion over $\mathbb{Q}$).
>
> $2 \dim E = [D:K]^{1/2} [K:\mathbb{Q}] = 1 \cdot 2 = 2$, nên $\dim E = 1$. ✓

---

## Weil Numbers và Dimension

> [!abstract] Proposition 17.9 — Các Trường Hợp Đặc Biệt
> Cho Weil $q$-number $\pi$ với $K = \mathbb{Q}(\pi)$:
>
> | Dạng $\pi$ | $K$ | $[K:\mathbb{Q}]$ | $\dim A$ |
> |------------|-----|-----------------|---------|
> | $\pi = q^{1/2}$ | $\mathbb{Q}$ | $1$ | $g$ (tùy $D$) |
> | $\pi$ real, $K$ totally real | $K$ | $e$ | $\geq e$ |
> | $\pi$ imaginary quadratic | $\mathbb{Q}(\sqrt{-d})$ | $2$ | $1$ (elliptic) |
> | $\pi$ CM field degree $2g$ | $K$ | $2g$ | $g$ (CM AV) |
>
> Khi $K$ là CM field degree $2g$ và $D = K$ ($[D:K] = 1$): $2\dim A = 1 \cdot 2g$, $\dim A = g$. Đây là **CM abelian variety**!

---

## Isogeny Category qua Modules

Có một mô tả hoàn toàn algebraic của category $\operatorname{AV}_{\mathbb{F}_q}$:

> [!abstract] Theorem 17.10 — Equivalence của Categories (Centeleghe–Stix 2015)
> Category $\operatorname{AV}_{\mathbb{F}_q}^{\rm iso}$ (với morphisms $\otimes \mathbb{Q}$) tương đương với category của:
>
> $$
> \left\{ \text{finite free } \mathbb{Z}\text{-modules } M \text{ với endomorphism } \pi : M \to M \text{ s.t. } \pi \text{ là Weil } q\text{-number} \right\}.
> $$
>
> Đây là "algebraization" hoàn toàn của $\operatorname{AV}_{\mathbb{F}_q}^{\rm iso}$.

---

## SageMath Cheatsheet

```python
# Honda-Tate: isogeny class <-> Weil number (qua char poly của Frobenius)
# Ví dụ: phân loại elliptic curves over F_7 theo isogeny

p = 7
from collections import defaultdict
isogeny_classes = defaultdict(list)

for a4 in range(p):
    for a6 in range(p):
        try:
            E = EllipticCurve(GF(p), [a4, a6])
            t = E.trace_of_frobenius()
            isogeny_classes[t].append((a4, a6))
        except:
            pass

print(f"Isogeny classes over F_{p}:")
for t in sorted(isogeny_classes.keys()):
    curves = isogeny_classes[t]
    pi_sum = t
    disc = t**2 - 4*p
    print(f"  trace={t}: char poly T^2 - {t}T + {p}, {len(curves)} curves")
```

```python
# Weil numbers: |alpha| = sqrt(q)
# Cho E/F_7 với trace t, Frobenius eigenvalues alpha, alphabar

p = 7
for t in range(-4, 5):  # Hasse: |t| <= 2*sqrt(7) ≈ 5.29
    disc = t**2 - 4*p
    print(f"t={t}: disc={disc}, ", end="")
    if disc < 0:
        alpha = complex(t/2, (-disc)**0.5/2)
        print(f"alpha = {alpha:.3f}, |alpha| = {abs(alpha):.4f}, sqrt(7) = {p**0.5:.4f}")
    elif disc == 0:
        print(f"alpha = {t/2:.3f} (double root)")
    else:
        print(f"real roots: {(t + disc**0.5)/2:.3f}, {(t - disc**0.5)/2:.3f}")
```

```python
# End^0(A) từ Weil number: center K = Q(pi)
# Ví dụ: E/F_7 supersingular (trace = 0)
# pi^2 + 7 = 0 => K = Q(sqrt(-7))

from sage.all import *
p = 7
# Char poly: T^2 + 7 (trace = 0, supersingular)
R.<T> = QQ[]
f = T^2 + p
K.<pi> = NumberField(f)
print(f"K = Q(pi) = {K}")
print(f"[K:Q] = {K.degree()}")
print(f"K is imaginary quadratic: disc(K) = {K.discriminant()}")
print(f"dim A: 2*dim = [D:K]^{1/2} * [K:Q] = 1 * 2 = 2 => dim = 1")
```

```python
# Honda-Tate: dim A từ Weil number
# Ví dụ các Weil q-numbers và AV tương ứng
examples = [
    ("T^2 + p (supersingular EC)", 2, 1),
    ("T^4 + pT^2 + p^2 (AV dim 2)", 4, 2),
    ("T^2 - tT + q, t ordinary", 2, 1),
]
print("Honda-Tate examples:")
for name, poly_deg, dim in examples:
    print(f"  f(T) của bậc {poly_deg}: dim A = {dim}")
    print(f"    K = Q(pi), [K:Q] = {poly_deg // 2 if poly_deg > 2 else 2}")
```

---

## Summary / Key Takeaways

- **Honda–Tate bijection**: simple AV/$\mathbb{F}_q$ / isogeny $\xleftrightarrow{1:1}$ conjugacy classes of Weil $q$-numbers.
- **Injectivity** (Tate 1966): $A \sim B \Leftrightarrow \pi_A \sim \pi_B$ (conjugate).
- **Surjectivity** (Honda 1968): mọi Weil $q$-number xuất hiện dưới dạng Frobenius của một simple AV.
- **$\operatorname{End}^0(A)$ từ $\pi$**: center $K = \mathbb{Q}(\pi)$; division algebra $D$ với local invariants $\operatorname{inv}_v(D) = v(\pi)/v(q)$ tại $v \mid p$.
- **Dimension**: $2\dim A = [D:K]^{1/2} \cdot [K:\mathbb{Q}]$.
- **CM case**: $[K:\mathbb{Q}] = 2g$ và $D = K$ $\Rightarrow$ $\dim A = g$ và $A$ là CM AV.
- **Supersingular EC** ($g = 1$): $\pi^2 = -p$ hoặc $\pi^2 \in \{-p, -4p, \ldots\}$; $D = B_{p,\infty}$ quaternion over $\mathbb{Q}$.
- **Classification hoàn toàn**: $\operatorname{AV}_{\mathbb{F}_q}^{\rm iso} \equiv$ finite free $\mathbb{Z}$-modules với Weil-number endomorphism.

---

## References

- Tate, J. *Endomorphisms of abelian varieties over finite fields*, Invent. Math. 2 (1966).
- Honda, T. *Isogeny classes of abelian varieties over finite fields*, J. Math. Soc. Japan (1968).
- Eisenträger, K. *The Theorem of Honda and Tate* (Stanford VIGRE notes).
- Pentland, D. *Honda–Tate Theory* (expository notes).
- Oort, F. *Abelian Varieties over Finite Fields* (AWS 2024 lecture notes §5).
