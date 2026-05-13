---
title: "09. Supersingular Endomorphism Rings and the γ Endomorphism"
type: math-component
tags: [crypto, isogeny, endomorphism, supersingular, lesson-09]
aliases: [Endomorphism Ring and Gamma]
created: 2026-04-09
---

> **Prerequisites**: [[01-abelian-varieties-foundations|01. Abelian Varieties — Foundations]], [[06-isogenies-abelian-varieties|06. Isogenies between Abelian Varieties]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_0$ | Starting supersingular elliptic curve |
> | $p$ | SIDH prime $p = 2^{e_A} \cdot 3^{e_B} - 1$ |
> | $\pi$ | Frobenius endomorphism $\pi: E \to E$, $\pi(x,y) = (x^p, y^p)$ |
> | $B_{p,\infty}$ | Quaternion algebra ramified tại $p$ và $\infty$ |
> | $\mathcal{O}$ | Maximal order trong $B_{p,\infty}$ |
> | $\iota$ | Non-scalar endomorphism của $E_0$ (degree nhỏ) |
> | $\gamma$ | Endomorphism cụ thể của $E_0$ (được xây dựng trong lesson này) |

---

## Tại sao Cần $\gamma$?

Trong Castryck-Decru attack, để xây dựng chain $(2,2)$-isogenies từ $E_0 \times E_0$ theo đúng hướng liên quan đến secret của Bob, ta cần một **non-scalar endomorphism $\gamma: E_0 \to E_0$** của degree cụ thể. Lesson này giải thích tại sao endomorphism như vậy tồn tại trên supersingular curves, và làm sao tính toán $\gamma$ cụ thể cho SIKE parameters.

---

## Endomorphism Ring của Supersingular Elliptic Curves

> [!abstract] Theorem 9.1 — Cấu Trúc $\text{End}(E)$ Supersingular
> Với $E$ supersingular elliptic curve trên $\mathbb{F}_{p^2}$, endomorphism ring $\text{End}(E)$ là một **maximal order** trong quaternion algebra $B_{p,\infty}$, là quaternion algebra (non-commutative) ramified chỉ tại $p$ và $\infty$.
>
> Tất cả các maximal orders trong $B_{p,\infty}$ đều conjugate và đặc biệt là **isomorphic** (nhưng không bằng nhau tổng quát).

So sánh với ordinary case: $\text{End}(E)$ ordinary là order trong imaginary quadratic field (commutative). Supersingular case: quaternion (non-commutative).

Quaternion algebra $B_{p,\infty}$ có basis $\{1, i, j, k\}$ với $i^2 = -q$ (nào đó), $j^2 = -p$, $k = ij = -ji$.

---

## Non-scalar Endomorphisms

> [!note] Định nghĩa 9.2 — Non-scalar Endomorphism
> Endomorphism $\alpha \in \text{End}(E)$ là **scalar** nếu $\alpha = [n]$ cho một số nguyên $n$. Ngược lại là **non-scalar**.
>
> **Degree** của $\alpha$: $\deg \alpha = \text{Nrd}(\alpha)$ (reduced norm trong quaternion algebra).

Trên supersingular curves, non-scalar endomorphisms luôn tồn tại và đặc biệt phong phú hơn ordinary case.

**Ví dụ cơ bản**: Frobenius $\pi$ là non-scalar với $\deg \pi = p$ và satisfies $\pi^2 + p = 0$ (trên $\mathbb{F}_{p^2}$: $\pi^2 = [-p]$).

---

## Curve $E_0 = y^2 = x^3 + 6x^2 + x$

SIKE sử dụng curve cụ thể:

$$
E_0: y^2 = x^3 + 6x^2 + x \quad \text{trên } \mathbb{F}_{p^2}
$$

Curve này được chọn vì nó có **non-scalar endomorphism degree 2** đặc biệt.

> [!note] Theorem 9.3 — Endomorphism $\iota$ của $E_0$
> Curve $E_0: y^2 = x^3 + 6x^2 + x$ có endomorphism degree 2:
>
> $$
> \iota: E_0 \to E_0, \quad \iota(x, y) = \left(\frac{-1}{x+1}, \frac{iy}{(x+1)^2}\right)
> $$
>
> trong đó $i^2 = -1 \in \mathbb{F}_{p^2}$ (tức là $i = \sqrt{-1}$, tồn tại vì $p \equiv 3 \pmod 4$).
>
> $\deg \iota = 2$, và $\iota$ là non-scalar.

**Verification**: $i = \sqrt{-1}$ tồn tại trong $\mathbb{F}_{p^2}$ vì $p \equiv 3 \pmod 4$ suy ra $-1$ không phải QR mod $p$, nên $\mathbb{F}_{p^2} = \mathbb{F}_p(i)$.

Ta có $\mathbb{Z}[2i] \subseteq \text{End}(E_0)$ — đây là "small non-scalar endomorphism" mà attack khai thác.

---

## Xây Dựng $\gamma$

Đây là bước kỹ thuật cụ thể: ta cần endomorphism $\gamma: E_0 \to E_0$ của degree $c$ (sẽ được xác định bởi parameters) để "mở đầu" chain $(2,2)$-isogenies trong attack.

> [!note] Algorithm 9.4 — Xây Dựng $\gamma$
> Với SIKE parameters ($p = 2^{e_A} \cdot 3^{e_B} - 1$), viết $c = u^2 + 4v^2$ cho nào đó $u, v$ (Fermat two-square decomposition). Khi đó:
>
> $$
> \gamma = [u] + [2v] \circ \iota \circ \rho
> $$
>
> trong đó $\rho: E_0 \to E_0'$ là 2-isogeny nào đó và $\hat{\rho}: E_0' \to E_0$ là dual.
>
> Tổng quát hơn: $\gamma = [u] + [2v] \cdot (2i)$ trong quaternion algebra, với $\deg \gamma = u^2 + 4v^2 = c$.

Trong thực tế: $c = 3^{e_B}$ (degree của Bob's secret isogeny). Ta tìm $u, v$ sao cho $u^2 + 4v^2 = 3^{e_B}$ (luôn tồn tại với điều kiện thích hợp).

---

## Tại Sao $\gamma$ Quan Trọng?

Trong attack, $\gamma$ đóng vai trò "calibration": nó được đặt vào kernel của $(2,2)$-isogeny chain sao cho Kani's theorem áp dụng được.

Cụ thể, Kani's theorem (Lesson 10) yêu cầu:
- Isogeny $\phi: E_0 \to E_A$ (Alice's public key) degree $2^{e_A}$
- Endomorphism $\gamma: E_0 \to E_0$ degree $c$
- Thỏa mãn $\deg \phi + \deg \gamma = (\text{something})^2$

Điều này cho phép xây dựng $(2,2)$-isogeny từ $E_0 \times E_0$ với kernel liên quan đến torsion point images mà Alice publish.

---

## Frobenius và Torsion Points

Một ứng dụng khác của endomorphism ring structure: xác định torsion points trên $E_0$.

Vì $\pi^2 = [-p]$, Frobenius $\pi$ tác động lên $E_0[n]$ như phép nhân bởi $\sqrt{-p}$ (theo nghĩa nào đó). Điều này cho phép xác định các torsion bases:

> [!abstract] Theorem 9.5 — Frobenius Tác Động Trên Torsion
> Trên $E_0/\mathbb{F}_{p^2}$ supersingular, Frobenius $\pi_{p^2}$ (squaring) tác động trên $E_0[n]$ như $[-1]$:
>
> $$
> \pi_{p^2}(P) = [-1]P = -P \quad \text{với mọi } P \in E_0[n]
> $$
>
> Hệ quả: $E_0[n] \subset E_0(\mathbb{F}_{p^2})$ — mọi $n$-torsion point đều defined over $\mathbb{F}_{p^2}$.

Đây là lý do SIDH hoạt động trên $\mathbb{F}_{p^2}$: tất cả torsion points $(E_0[2^{e_A}]$ và $E_0[3^{e_B}])$ đều available trên base field.

---

## Computing $\gamma$ với Bob's Parameters

Trong code thực tế (Lesson 12), $\gamma$ được tính như sau:

**Bước 1**: Factorize $3^{e_B} = u^2 + 4v^2$ (two-square decomposition — trivial với Fermat's theorem vì mọi số $\equiv 1 \pmod 4$ đều là sum of two squares; $3^{e_B}$ cần analysis riêng).

**Bước 2**: Xây dựng $\gamma$ là composition của isogenies nhỏ sử dụng $\iota$.

**Bước 3**: Evaluate $\gamma$ trên torsion points: tính $\gamma(P)$, $\gamma(Q)$ cho basis $\langle P, Q \rangle = E_0[2^{e_A}]$.

```sage
def compute_gamma(E0, iota, u, v, p):
    gamma = E0.scalar_multiplication(u) + (E0.scalar_multiplication(2*v)).compose(iota)
    return gamma
```

---

## Summary

- $\text{End}(E_0)$ supersingular: maximal order trong quaternion algebra $B_{p,\infty}$.
- $E_0: y^2 = x^3 + 6x^2 + x$ có endomorphism $\iota$ degree 2 (non-scalar).
- $\gamma = [u] + [2v] \cdot \iota$ với $u^2 + 4v^2 = 3^{e_B}$: endomorphism degree $3^{e_B}$.
- Frobenius: $\pi_{p^2} = [-1]$ trên torsion — toàn bộ torsion defined over $\mathbb{F}_{p^2}$.
- $\gamma$ được dùng trong Kani's criterion để "aim" chain $(2,2)$-isogenies vào đúng hướng.

---

## References

- Castryck & Decru — ePrint 2022/975, §5.2 (constructing $\gamma$)
- Kohel, D. — *Endomorphism Rings of Elliptic Curves over Finite Fields*, PhD thesis (1996)
- Deuring, M. — *Die Typen der Multiplikatorenringe elliptischer Funktionenkörper* (1941)
- Sutherland, A. — *Castryck-Decru attack on SIKE SIDH (overview)*, MIT notes (2022)
