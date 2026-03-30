---
title: "A0. Proof of Proposition (2.7)"
type: math-component
tags: [lll, polynomial-factoring, proof, appendix]
aliases: [Proof Prop 2.7, Small Vector Implies Factor]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[05-factors-and-lattices-setup|05. Factors and Lattices — Setup]] — Prop (2.5), lattice $L$, điều kiện (2.8); [[02-reduced-basis-properties|02. Properties of Reduced Bases]] — Hadamard's inequality (1.10)  
> 🔴 **Prerequisite references**: Cassels [4] (Chap. I Theorem I.A — existence of basis with prescribed leading degrees)  
> **Lesson type**: Math Component (Appendix)  
> **Covers**: §2: Proof đầy đủ của Proposition (2.7)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $b \in L$ | Đa thức ngắn trong lattice $L$, $b \ne 0$, thỏa (2.8) |
> | $g = \gcd(f, b)$ | GCD của $f$ và $b$ trong $\mathbb{Z}[X]$ |
> | $e = \deg(g)$, $m' = \deg(b)$ | Bậc của $g$ và $b$; $0 \le e \le m' \le m$ |
> | $M$ | Lattice phụ trợ: $\{\lambda f + \mu b : \deg(\lambda) < m'-e,\, \deg(\mu) < n-e\}$ |
> | $M'$ | Hình chiếu của $M$ lên $\mathbb{Z} X^e + \cdots + \mathbb{Z} X^{n+m'-e-1}$ |

---

## Phát Biểu Lại

> [!abstract] Proposition 2.7
> Cho $b \in L$ thỏa $b \ne 0$ và
>
> $$
> p^{kl} > \|f\|^m \cdot \|b\|^n \tag{2.8}
> $$
>
> Khi đó $h_0 \mid b$ trong $\mathbb{Z}[X]$.

**Chiến lược proof**: Giả sử ngược lại $h_0 \nmid b$. Từ Prop (2.5), điều này tương đương $(h \bmod p) \nmid (g \bmod p)$ với $g = \gcd(f,b)$. Từ đó xây dựng lattice phụ trợ $M'$, tính $d(M')$ theo hai cách và tìm mâu thuẫn.

---

## Proof Đầy Đủ

**Setup**: Giả sử $b \ne 0$. Đặt $g = \gcd(f, b) \in \mathbb{Z}[X]$. Theo Prop (2.5), đủ chứng minh $(h \bmod p) \mid (g \bmod p)$.

**Giả sử ngược lại**: $(h \bmod p) \nmid (g \bmod p)$. Ta dẫn ra mâu thuẫn.

### Bước 1 — Xây Dựng Lattice $M$

Từ (2.3), $(h \bmod p)$ bất khả quy và không chia $(g \bmod p)$, nên chúng nguyên tố cùng nhau trong $\mathbb{F}_p[X]$. Tồn tại $\lambda_3, \mu_3, \nu_3 \in \mathbb{Z}[X]$ sao cho:

$$
\lambda_3 h + \mu_3 g \equiv 1 - p\nu_3 \pmod{p\mathbb{Z}[X]} \tag{2.9}
$$

Định nghĩa:

$$
M = \{\lambda f + \mu b : \lambda, \mu \in \mathbb{Z}[X],\, \deg(\lambda) < m' - e,\, \deg(\mu) < n - e\}
\subset \mathbb{Z} + \mathbb{Z} X + \cdots + \mathbb{Z} X^{n+m'-e-1}
$$

trong đó $e = \deg(g)$, $m' = \deg(b)$, $0 \le e \le m' \le m$.

### Bước 2 — $M'$ Là Lattice Rank $n+m'-2e$

Gọi $M'$ là hình chiếu của $M$ lên $\mathbb{Z} X^e + \mathbb{Z} X^{e+1} + \cdots + \mathbb{Z} X^{n+m'-e-1}$.

**Khẳng định**: Các hình chiếu của

$$
\{X^i f : 0 \le i < m'-e\} \cup \{X^j b : 0 \le j < n-e\}
$$

lên $M'$ là **độc lập tuyến tính**, và span $M'$.

**Proof**: Giả sử $\lambda f + \mu b$ chiếu về 0 trong $M'$, tức $\deg(\lambda f + \mu b) < e$. Vì $g \mid \lambda f + \mu b$, ta có $\lambda f + \mu b = 0$ (bậc quá nhỏ). Từ $\lambda(f/g) = -\mu(b/g)$ và $\gcd(f/g, b/g) = 1$, suy ra $(f/g) \mid \mu$. Nhưng $\deg(\mu) < n - e = \deg(f/g)$, nên $\mu = 0$, suy ra $\lambda = 0$.

Do đó $M'$ là lattice rank $n + m' - 2e$.

### Bước 3 — Upper Bound $d(M')$ Qua Hadamard

Các generator của $M'$ có norm: $\|X^i f\| = \|f\|$ và $\|X^j b\| = \|b\|$. Từ Hadamard's inequality (1.10):

$$
d(M') \le \|f\|^{m'-e} \cdot \|b\|^{n-e} \le \|f\|^m \cdot \|b\|^n < p^{kl} \tag{2.10}
$$

(bất đẳng thức cuối từ (2.8)).

### Bước 4 — Lower Bound $d(M')$ Qua Điều Kiện (2.9)

**Khẳng định**: Mọi $\nu \in M$ với $\deg(\nu) < e + l$ đều nằm trong $p^k \mathbb{Z}[X]$:

$$
\{\nu \in M : \deg(\nu) < e+l\} \subset p^k\mathbb{Z}[X] \tag{2.11}
$$

**Proof của (2.11)**: Cho $\nu = \lambda f + \mu b \in M$ với $\deg(\nu) < e+l$. Vì $g \mid \nu$, ta có $g \mid \nu$. Nhân (2.9) với $\nu/g$ và lũy thừa $1 + p\nu_3 + p^2\nu_3^2 + \cdots + p^{k-1}\nu_3^{k-1}$:

$$
\lambda_4 h + \mu_4 \nu \equiv \nu/g \pmod{p^k\mathbb{Z}[X]} \tag{2.12}
$$

với $\lambda_4, \mu_4 \in \mathbb{Z}[X]$. Vì $\nu \in M$ và $b \in L$, $(ν \bmod p^k)$ chia hết $(h \bmod p^k)$. Từ (2.12), $(\nu/g \bmod p^k)$ cũng chia hết $(h \bmod p^k)$. Nhưng $(h \bmod p^k)$ có bậc $l$ và leading coefficient 1, trong khi $(\nu/g \bmod p^k)$ có bậc $< e+l-e = l$. Do đó $\nu/g \equiv 0 \pmod{p^k}$, tức $\nu \equiv 0 \pmod{p^k\mathbb{Z}[X]}$. $\checkmark$

**Từ (2.11) đến lower bound**: Theo [4, Chap. I, Theorem I.A], $M'$ có basis $b_e, b_{e+1}, \ldots, b_{n+m'-e-1}$ với $\deg(b_j) = j$. Từ (2.11), leading coefficients của $b_e, b_{e+1}, \ldots, b_{e+l-1}$ đều chia hết $p^k$.

Chú ý: điều kiện $e+l-1 \le n+m'-e-1$ thỏa vì $g \mid b$ và $(h \bmod p) \mid (f/g \bmod p)$ suy ra $e + l \le n+m'-e$. Do đó:

$$
d(M') = \left|\prod_{j=e}^{n+m'-e-1} \text{lc}(b_j)\right| \ge (p^k)^l = p^{kl}
$$

(vì ít nhất $l$ leading coefficient chia hết $p^k$).

### Bước 5 — Mâu Thuẫn

Từ (2.10): $d(M') < p^{kl}$.  
Từ Bước 4: $d(M') \ge p^{kl}$.

Mâu thuẫn! Do đó giả thiết $(h \bmod p) \nmid (g \bmod p)$ sai, tức $(h \bmod p) \mid (g \bmod p)$.

Từ Prop (2.5), điều này suy ra $h_0 \mid g \mid b$. $\blacksquare$

---

## Ghi Chú Về Cấu Trúc Proof

> [!tip] 💡 Agent note — Tại sao cần $M'$ thay vì $M$ trực tiếp?
> Lattice $M$ gồm các đa thức trong $\mathbb{Z}[X]_{\le n+m'-e-1}$, nhưng các phần tử có bậc $< e$ "bị che" bởi gcd $g$. Hình chiếu $M'$ loại bỏ phần bậc thấp đó, để lộ ra lattice rank đúng $n+m'-2e$ mà Hadamard và lower bound áp dụng sạch hơn.

> [!tip] 💡 Agent note — Vai trò của (2.9)
> Equation (2.9) là phiên bản lifted của Bézout's identity giữa $(h \bmod p)$ và $(g \bmod p)$ trong $\mathbb{F}_p[X]$. Nó là cầu nối để lift thông tin từ mod $p$ lên mod $p^k$, tương tự như cách Hensel's lemma hoạt động.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite — Chap. I Theorem I.A)
