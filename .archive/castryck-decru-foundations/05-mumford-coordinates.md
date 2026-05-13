---
title: "05. Mumford Coordinates and the Group Law"
type: deep-dive
tags: [crypto, isogeny, mumford, jacobian, lesson-05]
aliases: [Mumford Coordinates]
created: 2026-04-09
---

> **Prerequisites**: [[04-jacobians-genus2|04. Jacobians of Genus-2 Curves]]
> **Lesson type**: Deep Dive
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $C: y^2 = f(x)$ | Genus-2 curve, $\deg f = 5$ hoặc $6$ |
> | $J = \text{Jac}(C)$ | Jacobian của $C$ |
> | $\iota$ | Hyperelliptic involution $(x,y) \mapsto (x,-y)$ |
> | $v_P(h)$ | Valuation (order) của hàm $h$ tại điểm $P$ |

---

## Từ Lý Thuyết đến Tính Toán

Lesson trước đã thiết lập $J = \text{Jac}(C)$ là abelian surface với nhóm $\text{Pic}^0(C)$. Nhưng để implement attack, ta cần một **hệ tọa độ cụ thể** để lưu trữ và tính toán các điểm trong $J$. Mumford coordinates (1984) là hệ tọa độ tiêu chuẩn cho Jacobians của hyperelliptic curves, và là cơ sở của mọi implementation thực tế.

---

## Mumford Representation

> [!note] Định nghĩa 5.1 — Mumford Coordinates
> Với $C: y^2 = f(x)$ genus 2 và $D \in J(\bar{k})$ là divisor class khác $\mathcal{O}$, **Mumford representation** của $D$ là cặp polynomials $(u(x), v(x)) \in k[x]^2$ sao cho:
>
> 1. $u$ là monic, $\deg u \leq g = 2$
> 2. $\deg v < \deg u$
> 3. $u \mid (v^2 - f)$
>
> Divisor tương ứng là:
>
> $$
> D = \sum_{u(\alpha) = 0} (\alpha, v(\alpha)) - (\deg u) \cdot \infty
> $$
>
> Identity $\mathcal{O}$ tương ứng với $(u, v) = (1, 0)$.

**Giải thích**: $u(x)$ là polynomial có roots tại x-coordinates của support của $D$. $v(x)$ là polynomial interpolate y-coordinates: $v(\alpha) = y_\alpha$ cho mỗi điểm $(\alpha, y_\alpha)$ trong support.

Điều kiện $u \mid (v^2 - f)$ đảm bảo mỗi root $\alpha$ của $u$ thực sự là x-coordinate của một điểm trên $C$ (tức là $v(\alpha)^2 = f(\alpha)$).

---

## Ví dụ Tường Minh

Cho $C: y^2 = f(x)$ và hai điểm $P_1 = (x_1, y_1)$, $P_2 = (x_2, y_2)$ trên $C$ với $x_1 \neq x_2$.

Divisor $D = [P_1 + P_2 - 2\infty]$ có Mumford representation:

$$
u(x) = (x - x_1)(x - x_2), \quad v(x) = \text{linear interpolant qua } (x_1, y_1), (x_2, y_2)
$$

Tức là:
$$
v(x) = y_1 + \frac{y_2 - y_1}{x_2 - x_1}(x - x_1)
$$

Kiểm tra: $u(x_i) = 0$, $v(x_i) = y_i$, và $v(x_i)^2 = y_i^2 = f(x_i)$, suy ra $u \mid (v^2 - f)$. ✓

**Trường hợp đặc biệt**: Nếu $P_1 = P_2 = P = (x_0, y_0)$ (doubled point):
$$
u(x) = (x - x_0)^2, \quad v(x) = \text{tangent line tại } P
$$

---

## Cantor's Algorithm — Explicit

Cộng hai divisors $D_1 = (u_1, v_1)$ và $D_2 = (u_2, v_2)$ qua hai bước:

> [!note] Algorithm 5.2 — Cantor Addition
>
> **Bước 1 — Composition**:
> - Tính $d_1 = \gcd(u_1, u_2)$, biểu diễn dạng: $h_1 u_1 + h_2 u_2 = d_1$ (extended GCD)
> - Tính $d = \gcd(d_1, v_1 + v_2)$, biểu diễn: $h_3 d_1 + h_4(v_1 + v_2) = d$
> - Đặt $s = h_1 h_3 u_1 + (h_2 h_3 u_2 + h_4(v_1 + v_2))$
> - Tính $u' = u_1 u_2 / d^2$
> - Tính $v' = (s v_1 + (v_2 - v_1) / 2 \cdot \text{correction}) \bmod u'$
>
> **Bước 2 — Reduction**: Lặp cho đến khi $\deg u \leq g$:
> - $u'' = (f - v'^2) / u'$, rút leading coefficient
> - $v'' = -v' \bmod u''$
>
> **Output**: $(u'', v'')$ là reduced Mumford representation của $D_1 + D_2$.

Trong practice, Cantor's algorithm có explicit formulas không dùng GCD — được tối ưu cho performance trong crypto.

---

## Negation và Weil Pairing

**Negation trong $J$**: Với $D = (u, v)$, negation là:

$$
-D = (u, -v \bmod u)
$$

Tức là: flip dấu của y-coordinates, tương ứng với áp dụng hyperelliptic involution $\iota$ cho mỗi điểm trong support.

**Weil pairing qua Mumford**: Với $D_1 = (u_1, v_1)$, $D_2 = (u_2, v_2)$, Weil pairing $e_n(D_1, D_2) \in \mu_n$ có thể tính toán qua Miller's algorithm tổng quát hóa cho Jacobians.

---

## 2-Torsion Points — Trường Hợp Đặc Biệt Quan Trọng

Trong Castryck-Decru attack, ta cần làm việc với $J[2]$ — các điểm có order chia 2.

> [!abstract] Theorem 5.3 — Cấu Trúc $J[2]$
> Với $C: y^2 = f(x)$ genus 2 và $\text{char}(k) \neq 2$, $f = \prod_{i=1}^{6} (x - \alpha_i)$ (6 roots trong $\bar{k}$):
>
> $$
> J[2] = \{[\,P_i + P_j - 2\infty\,] : 1 \leq i < j \leq 6\} \cup \{\mathcal{O}\}
> $$
>
> trong đó $P_i = (\alpha_i, 0)$ là Weierstrass points.
>
> $|J[2]| = 2^4 = 16$, và mỗi element khác $\mathcal{O}$ có Mumford representation:
>
> $$
> u(x) = (x - \alpha_i)(x - \alpha_j), \quad v(x) = 0
> $$

Với $v = 0$: điểm 2-torsion chính là các "pairs of Weierstrass points". Đây là kernel tự nhiên của Richelot isogeny, sẽ được khai thác trong [[07-richelot-isogenies|Lesson 07]].

---

## Biểu Diễn Trên $E_1 \times E_2$

Khi $J \cong E_1 \times E_2$ (split case), ta có thể map Mumford representation về points trên tích. Nhưng thực ra, khi làm việc với $(2,2)$-isogenies trong attack, ta không cần tường minh map này — ta làm việc trực tiếp với Mumford coords hoặc theta coords (xem Appendix A0).

---

## Implementation trong SageMath

SageMath hỗ trợ trực tiếp Mumford representation qua `HyperellipticCurve`:

```sage
k = GF(1009)
R.<x> = k[]
f = x^5 - x + 3
C = HyperellipticCurve(f)
J = C.jacobian()

u1 = x^2 - 2*x + 1
v1 = 3*x - 1
u2 = x^2 + x + 5
v2 = x + 2
D1 = J([u1, v1])
D2 = J([u2, v2])
print("D1 =", D1)
print("D2 =", D2)
print("D1 + D2 =", D1 + D2)
print("-D1 =", -D1)
print("2*D1 =", 2*D1)
```

---

## Summary

- **Mumford representation** $(u, v)$: $u$ monic $\deg \leq 2$, $\deg v < \deg u$, $u \mid (v^2 - f)$.
- Mỗi divisor class trong $J \setminus \{\mathcal{O}\}$ có duy nhất một Mumford representative.
- **Cantor's algorithm**: cộng hai divisors qua composition + reduction.
- **Negation**: $(u, v) \mapsto (u, -v \bmod u)$ — flip y-coordinates.
- **$J[2]$**: 15 non-trivial points, tương ứng với pairs of Weierstrass points, Mumford form $(u, 0)$.
- SageMath hỗ trợ trực tiếp — cơ sở cho implementation trong Lesson 12.

---

## References

- Mumford, D. — *Tata Lectures on Theta II* (Birkhäuser, 1984), §IIIa
- Cantor, D. — *Computing in the Jacobian of a Hyperelliptic Curve*, Math. Comp. 48 (1987)
- Galbraith, S. — *Mathematics of Public Key Cryptography*, Ch. 6.3
- Lange, T. — *Formulae for Arithmetic on Genus 2 Hyperelliptic Curves*, AAECC 15 (2005)
