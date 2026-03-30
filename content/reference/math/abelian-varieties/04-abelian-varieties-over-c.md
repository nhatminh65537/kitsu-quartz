---
title: "04. Abelian Varieties over ℂ"
tags: [math, abelian-varieties, lesson-04]
aliases: [Abelian Varieties over C]
created: 2026-03-24
---

> **Prerequisites**: [[02-complex-tori-and-lattices|02. Complex Tori và Lattices]], [[03-definitions-and-basic-properties|03. Definitions & Basic Properties]]
> **Objectives**:
> - Hiểu equivalence giữa abelian varieties trên $\mathbb{C}$ và polarizable complex tori
> - Nắm vững khái niệm polarization theo nhiều góc nhìn: Riemann form, ample line bundle, isogeny $A \to A^\vee$
> - Hiểu type của polarization và principal polarization
> - Phân biệt các đặc trưng của AV trên $\mathbb{C}$ so với AV trên trường tổng quát

---

## Motivation / Intuition

Ở Lesson 02, ta đã thấy: complex torus $X = \mathbb{C}^g / \Lambda$ là abelian variety khi và chỉ khi có **Riemann form**. Ở Lesson 03, ta định nghĩa abelian variety theo ngôn ngữ thuần túy algebraic (complete connected group variety). Lesson này nối hai thế giới lại: chứng minh rằng **trên $\mathbb{C}$, hai định nghĩa hoàn toàn tương đương**.

Kết quả trung tâm là định lý Milne (2.9): functor $A \mapsto A(\mathbb{C})$ là **equivalence of categories** giữa abelian varieties trên $\mathbb{C}$ và polarizable complex tori. Điều này có nghĩa là khi làm việc trên $\mathbb{C}$, ta có thể tự do chuyển đổi giữa ngôn ngữ algebraic (phương trình, sheaves) và ngôn ngữ analytic (lattices, Hermitian forms, theta functions).

Hơn nữa, lesson này giới thiệu **polarization** — một cấu trúc bổ sung trên AV, cực kỳ quan trọng cho moduli spaces và lý thuyết số.

---

## Từ Complex Tori sang Abelian Varieties

### Analytic uniformization

> [!abstract] Theorem 4.1 — Uniformization Analytic (Định lý Riemann)
> Mọi abelian variety $A$ trên $\mathbb{C}$ đều có **analytic uniformization**: tồn tại $\mathbb{C}$-vector space $V$ chiều $g$ và lattice $\Lambda \subset V$ sao cho $A(\mathbb{C}) \cong V / \Lambda$ như compact complex Lie groups (hay đồng giá như complex manifolds với cấu trúc nhóm).
>
> Phép đồng cấu này cho biểu diễn:
>
> $$
> 0 \to \Lambda \to V \xrightarrow{\exp} A(\mathbb{C}) \to 0.
> $$

**Proof idea.** Vì $A$ là compact Lie group abelian connected, Lie algebra $\text{Lie}(A) = T_{A,0}$ là $\mathbb{C}$-vector space chiều $g$. Map $\exp : T_{A,0} \to A(\mathbb{C})$ là surjective với kernel $\Lambda = \ker(\exp)$ discrete. Vì $A$ compact, $\Lambda$ là lattice trong $T_{A,0} \cong \mathbb{C}^g$. $\blacksquare$

> [!note] Remark 4.2
> Map $\exp$ là **không** algebraic — nó là analytic. Vì vậy, uniformization $V/\Lambda$ là mô tả analytic của $A(\mathbb{C})$, không phải mô tả algebraic. Điều thú vị là: từ $V/\Lambda$, ta có thể xây dựng lại hoàn toàn cấu trúc algebraic của $A$ qua theta functions.

> [!example] Example 4.3 — Elliptic curve $g = 1$
> Với elliptic curve $E : y^2 = x^3 + ax + b$ trên $\mathbb{C}$, lattice $\Lambda = \mathbb{Z} + \mathbb{Z}\tau$ (với $\tau \in \mathcal{H}$), và $\exp = \wp$ (Weierstrass $\wp$-function):
>
> $$
> \mathbb{C} / (\mathbb{Z} + \mathbb{Z}\tau) \xrightarrow{\sim} E(\mathbb{C}), \quad z \mapsto (\wp(z), \wp'(z)).
> $$
>
> Đây là biểu diễn tường minh của analytic uniformization khi $g = 1$.

---

## Phân loại: Polarizable Tori ↔ Abelian Varieties

> [!abstract] Theorem 4.4 — Equivalence of Categories (Milne)
> Functor $A \mapsto A(\mathbb{C})$ từ category abelian varieties trên $\mathbb{C}$ sang category complex tori là **fully faithful** và ảnh của nó là chính xác các **polarizable complex tori**.
>
> Nói cụ thể:
>
> 1. Mọi polarizable complex torus $X = V / \Lambda$ là $A(\mathbb{C})$ cho một abelian variety $A$ trên $\mathbb{C}$ duy nhất (up to isomorphism).
> 2. $\operatorname{Hom}(A, B) = \operatorname{Hom}(A(\mathbb{C}), B(\mathbb{C}))$ (morphisms algebraic $\leftrightarrow$ morphisms analytic bảo toàn lattice).

**Proof sketch** (hướng $1$): Cho polarizable complex torus $X = V/\Lambda$ với Riemann form $H$. Cặp $(H, \chi)$ xác định ample line bundle $\mathcal{L}$ trên $X$ (Appell–Humbert). Định lý Kodaira embedding: $\mathcal{L}^{\otimes 3}$ là very ample, cho phép nhúng $X \hookrightarrow \mathbb{P}^N$. Ảnh là closed submanifold compact của $\mathbb{P}^N(\mathbb{C})$, và theo **định lý Chow**, mọi closed analytic submanifold của $\mathbb{P}^N$ đều là algebraic variety! $\blacksquare$

> [!note] Remark 4.5 — Định lý Chow
> **Chow's theorem**: Mọi compact complex analytic submanifold của $\mathbb{P}^N(\mathbb{C})$ là projective algebraic variety (xác định bởi phương trình đa thức). Đây là cây cầu then chốt nối complex analysis và algebraic geometry, và là lý do tại sao "holomorphic $\Leftrightarrow$ algebraic" khi compact.

---

## Polarizations

### Polarization từ Riemann form

Riemann form $H$ trên $X = V/\Lambda$ không chỉ đảm bảo $X$ là AV — nó còn định nghĩa một cấu trúc bổ sung trọng yếu: **polarization**.

> [!abstract] Definition 4.6 — Polarization (Cực hóa) — Góc nhìn Analytic
> Cho $A = V/\Lambda$ là abelian variety (complex torus polarizable). Một **polarization** của $A$ là Riemann form $H$ trên $(V, \Lambda)$ (không nhất thiết positive definite — chỉ cần $E = \operatorname{Im}(H)$ integer-valued trên $\Lambda$, và $H$ xác định được một ample line bundle).
>
> Theo Appell–Humbert, $H$ xác định isogeny:
>
> $$
> \lambda_H : A \to A^\vee, \quad \lambda_H(a) = t_a^* \mathcal{L} \otimes \mathcal{L}^{-1},
> $$
>
> trong đó $A^\vee = \overline{V}^\vee / \Lambda^\vee$ là **dual abelian variety** (sẽ định nghĩa chính xác ở Lesson 08).

> [!abstract] Definition 4.7 — Polarization — Góc nhìn Algebraic
> Cho $A$ là abelian variety trên trường $k$ tùy ý. Một **polarization** của $A$ là isogeny $\lambda : A \to A^\vee$ thỏa:
>
> 1. $\lambda$ là **symmetric**: $\lambda^\vee = \lambda$ (dưới double duality $(A^\vee)^\vee \cong A$).
> 2. Trên $\bar{k}$: $\lambda = \lambda_{\mathcal{L}}$ với $\mathcal{L}$ là ample line bundle trên $A_{\bar{k}}$.
>
> Equivalently (khi $k = \bar{k}$): $\lambda = \lambda_\mathcal{L}$ với $\mathcal{L}$ ample, trong đó $\lambda_\mathcal{L}(a) = t_a^* \mathcal{L} \otimes \mathcal{L}^{-1} \in A^\vee$.

> [!tip] Key Insight
> Polarization là analog của **positive definite quadratic form** trên lattice. Đúng hơn:
>
> - Riemann form $H$ (positive definite, integer-valued) $\longleftrightarrow$ **polarization** $\lambda_H : A \to A^\vee$
> - "Positive definite" của $H$ $\longleftrightarrow$ $\lambda_H$ là isogeny (có kernel hữu hạn)
> - Degree của polarization $= |\ker \lambda_H|$

> [!example] Example 4.8 — Polarization của elliptic curve
> Với $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$, Riemann form $H(u,v) = u\bar{v}/\text{Im}(\tau)$ cho polarization $\lambda_H : E \to E^\vee$.
>
> Vì $E^\vee \cong E$ (với $g = 1$, dual AV isomorphic với chính nó), polarization là isogeny $E \to E$ degree $1$ — tức là **isomorphism**. Đây là principal polarization.

### Type của Polarization

> [!abstract] Definition 4.9 — Type của Polarization
> Cho polarization $\lambda_H : A \to A^\vee$ với $A = V/\Lambda$. Xét phần tử alternating form $E = \operatorname{Im}(H)$ trên $\Lambda \cong \mathbb{Z}^{2g}$. Theo bổ đề phần tử bất biến, tồn tại basis $\lambda_1, \ldots, \lambda_g, \mu_1, \ldots, \mu_g$ của $\Lambda$ sao cho matrix của $E$ là:
>
> $$
> E \sim \begin{pmatrix} 0 & D \\ -D & 0 \end{pmatrix}, \quad D = \operatorname{diag}(d_1, \ldots, d_g), \quad d_i \in \mathbb{Z}_{>0}, \quad d_1 \mid d_2 \mid \cdots \mid d_g.
> $$
>
> Vector $(d_1, \ldots, d_g)$ gọi là **type** của polarization. **Degree** của polarization là $\prod_{i=1}^g d_i^2 = |\ker \lambda_H|$.

> [!abstract] Definition 4.10 — Principal Polarization (Cực hóa chính)
> Polarization type $(1, 1, \ldots, 1)$ — tức là $d_i = 1$ với mọi $i$ — được gọi là **principal polarization**. Equivalently, $\lambda : A \xrightarrow{\sim} A^\vee$ là isomorphism.
>
> **Principally polarized abelian variety (PPAV)**: cặp $(A, \lambda)$ với $\lambda$ principal polarization.

> [!note] Remark 4.11 — Tại sao cần polarization?
> Polarization đóng vai trò then chốt trong nhiều lý thuyết:
>
> 1. **Moduli**: Moduli space $\mathcal{A}_g$ của PPAVs chiều $g$ là $\mathcal{H}_g / \operatorname{Sp}_{2g}(\mathbb{Z})$ — một space có thể làm việc được. Không có polarization, tập AV chiều $g$ không có cấu trúc moduli tốt.
> 2. **Rosati involution**: Polarization $\lambda$ định nghĩa involution tốt trên $\operatorname{End}^0(A)$ (Lesson 12).
> 3. **Automorphism groups**: AV có polarization có nhóm tự cấu **hữu hạn** — điều này tốt cho moduli.
> 4. **Theta divisor**: Principal polarization ứng với theta divisor $\Theta \subset A$ — subvariety codimension 1 đặc biệt.

---

## Theta Divisor

> [!abstract] Definition 4.12 — Theta Divisor
> Cho $(A, \lambda)$ là PPAV chiều $g$. **Theta divisor** $\Theta$ là (class của) effective divisor ứng với ample line bundle xác định bởi principal polarization.
>
> Cụ thể, với $A = V/\Lambda$ và Riemann form $H$ principal, global sections của $\mathcal{L}(H, \chi)$ là hàm **theta** $\vartheta(z, \tau) : V \to \mathbb{C}$, và $\Theta = \{ z \in A \mid \vartheta(z) = 0 \}$.

> [!example] Example 4.13 — Theta function của elliptic curve
> Với $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$, **Jacobi theta function** là:
>
> $$
> \vartheta(z, \tau) = \sum_{n \in \mathbb{Z}} e^{\pi i n^2 \tau + 2\pi i n z}.
> $$
>
> Đây hội tụ tuyệt đối với $\operatorname{Im}(\tau) > 0$. Theta divisor là tập zero $\Theta = \{[0]\} = \{0 \bmod \Lambda\}$ — điểm đơn vị của $E$.
>
> Tổng quát hơn, với $g \geq 2$, $\Theta$ là subvariety chiều $g-1$ trong $A$.

---

## Torsion Points trên $\mathbb{C}$

> [!abstract] Proposition 4.14 — Torsion Points của AV trên $\mathbb{C}$
> Cho $A = V/\Lambda$ abelian variety chiều $g$ trên $\mathbb{C}$ và $n \geq 1$ nguyên dương. Subgroup $n$-torsion:
>
> $$
> A[n] = \{ a \in A \mid na = 0 \} = \frac{1}{n}\Lambda / \Lambda \cong (\mathbb{Z}/n\mathbb{Z})^{2g}.
> $$
>
> Đặc biệt, $|A[n]| = n^{2g}$.

**Proof.** $a \in A(\mathbb{C}) = V/\Lambda$ thỏa $na = 0$ khi và chỉ khi $na \in \Lambda$, tức là $a \in \frac{1}{n}\Lambda$. Vậy $A[n] = \frac{1}{n}\Lambda/\Lambda$. Vì $\Lambda \cong \mathbb{Z}^{2g}$ và $\frac{1}{n}\Lambda / \Lambda \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$, ta được $|A[n]| = n^{2g}$. $\blacksquare$

> [!note] Remark 4.15 — Characteristic $p$
> Trên trường đặc số $p > 0$, $A[p]$ có thể nhỏ hơn $(\mathbb{Z}/p\mathbb{Z})^{2g}$. Chính xác hơn, $|A[p](\bar{k})| = p^r$ với $0 \leq r \leq g$ — số $r$ gọi là **$p$-rank** của $A$.

---

## Cohomology của AV trên $\mathbb{C}$

### Betti cohomology từ uniformization

Từ $A(\mathbb{C}) \cong (\mathbb{R}/\mathbb{Z})^{2g} \cong (S^1)^{2g}$, ta suy ra:

$$
H^n(A(\mathbb{C}), \mathbb{Z}) \cong \bigwedge^n H^1(A(\mathbb{C}), \mathbb{Z}) \cong \bigwedge^n \Lambda^\vee,
$$

trong đó $\Lambda^\vee = \operatorname{Hom}(\Lambda, \mathbb{Z})$.

> [!abstract] Proposition 4.16 — Betti Numbers của AV chiều $g$
> Betti number thứ $n$ của $A$ (như real manifold $2g$-chiều) là:
>
> $$
> b_n = \dim_\mathbb{Q} H^n(A(\mathbb{C}), \mathbb{Q}) = \binom{2g}{n}.
> $$
>
> Đặc biệt, $b_0 = b_{2g} = 1$, $b_1 = b_{2g-1} = 2g$, $b_2 = b_{2g-2} = \binom{2g}{2}$.

> [!example] Example 4.17
> - $g = 1$ (elliptic curve): $b_0 = 1, b_1 = 2, b_2 = 1$. Đây là Betti numbers của torus $S^1 \times S^1$.
> - $g = 2$ (abelian surface): $b_0 = 1, b_1 = 4, b_2 = 6, b_3 = 4, b_4 = 1$. Tổng $= 16 = 2^4$.
> - Tổng quát: $\sum_{n=0}^{2g} b_n = 2^{2g}$.

### Hodge decomposition

Vì $A$ là compact Kähler manifold (có metric Kähler tự nhiên từ Riemann form), ta có **Hodge decomposition**:

$$
H^n(A(\mathbb{C}), \mathbb{C}) = \bigoplus_{p+q=n} H^{p,q}(A),
$$

trong đó $H^{p,q}(A) = H^q(A, \Omega^p_{A/\mathbb{C}})$ và $\dim H^{p,q}(A) = \binom{g}{p}\binom{g}{q}$.

Đặc biệt: $\dim H^1(A, \mathcal{O}_A) = g$ (đây chính là chiều của dual AV, sẽ gặp lại ở Lesson 08).

---

## SageMath Cheatsheet

```python
# Analytic uniformization: elliptic curve <-> complex torus
E = EllipticCurve([0, 0, 0, -1, 0])  # y^2 = x^3 - x
L = E.period_lattice()

omega1 = L.omega_1  # chu kỳ 1
omega2 = L.omega_2  # chu kỳ 2 (imaginary)
tau = omega2 / omega1  # tau trong upper half-plane
print(f"omega1 = {omega1:.6f}")
print(f"omega2 = {omega2:.6f}")
print(f"tau = {tau:.6f}")
print(f"Im(tau) > 0: {tau.imag() > 0}")  # phải True
```

```python
# Torsion points: E[n] có n^2 điểm (vì g=1, 2g=2)
E = EllipticCurve(GF(101), [0, -1])  # trên F_101 để tính được

# E[2]: 2-torsion points (gồm cả điểm vô cực O)
two_torsion = E.two_torsion_points()
print("2-torsion points:", two_torsion)
print("Số lượng 2-torsion:", len(two_torsion))  # phải là 4 = 2^{2*1}

# Torsion subgroup tổng quát
for n in [2, 3, 5]:
    # Trên trường số, E[n] có n^{2g} = n^2 điểm
    torsion = E(0).division_points(n)  # không dùng được trực tiếp
    print(f"|E[{n}]| = {n**2} (lý thuyết)")
```

```python
# Principal polarization: Jacobian của curve genus g có PPAV tự nhiên
# Ví dụ: genus 2 curve -> abelian surface với principal polarization
R.<x> = QQ[]
C = HyperellipticCurve(x^5 - x^3 + 1)
print("Genus:", C.genus())  # 2

# Jacobian của C là abelian surface = AV chiều 2
J = C.jacobian()
print("Jacobian:", J)

# Torsion points: |J[n]| = n^{2g} = n^4 (g=2)
for n in [2, 3]:
    print(f"|J[{n}]| (lý thuyết) = {n**(2*2)}")
```

```python
# Betti numbers của AV chiều g
from math import comb

def betti_numbers(g):
    return [comb(2*g, n) for n in range(2*g + 1)]

for g in [1, 2, 3]:
    bn = betti_numbers(g)
    print(f"g={g}: Betti numbers = {bn}, sum = {sum(bn)} = 2^{2*g}")
```

```python
# Theta function (Jacobi) cho g=1
# vartheta(z, tau) = sum_{n in Z} exp(pi*i*n^2*tau + 2*pi*i*n*z)
def theta_function(z, tau, terms=20):
    """Tính theta function Jacobi."""
    result = 0
    for n in range(-terms, terms + 1):
        result += exp(pi * I * n^2 * tau + 2 * pi * I * n * z)
    return result

# Với tau = i (lattice vuông)
tau_val = CC(0, 1)
z_val = CC(0.5, 0)  # điểm giữa
val = theta_function(z_val, tau_val)
print(f"vartheta(1/2, i) = {val.real():.6f} + {val.imag():.6f}*i")
print("Theta function xác định theta divisor: tập zero = {0}")
```

---

## Summary / Key Takeaways

- **Analytic uniformization**: mọi AV trên $\mathbb{C}$ có dạng $A(\mathbb{C}) = V/\Lambda$ (compact complex Lie group).
- **Equivalence of categories**: $\{ \text{AV trên } \mathbb{C} \} \xrightarrow{\sim} \{ \text{polarizable complex tori} \}$ (Milne 2.9).
- **Định lý Chow**: closed analytic submanifold compact của $\mathbb{P}^N$ là algebraic — đây là cầu nối analytic $\to$ algebraic.
- **Polarization**: isogeny $\lambda : A \to A^\vee$ ứng với Riemann form $H$ (positive definite, integer-valued). Hay equivalently: ample line bundle $\mathcal{L}$ trên $A$.
- **Type** $(d_1, \ldots, d_g)$ với $d_i \mid d_{i+1}$: bất biến phân loại polarization; degree $= \prod d_i^2$.
- **Principal polarization**: type $(1,\ldots,1)$, $\lambda$ là isomorphism. Jacobians của curves có PPAV tự nhiên.
- **Theta divisor** $\Theta$: zero locus của theta function; là subvariety codimension $1$ trong $(A, \lambda)$.
- **Torsion**: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ trên $\mathbb{C}$; cấu trúc phức tạp hơn trong đặc số $p$.
- **Betti numbers**: $b_n = \binom{2g}{n}$; Hodge decomposition $H^{p,q}(A) = \binom{g}{p}\binom{g}{q}$.
- **$H^1(A, \mathcal{O}_A)$ chiều $g$**: đây sẽ là tangent space của dual AV tại $0$.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §2 (Abelian Varieties over the Complex Numbers).
- Lange, H. *Abelian Varieties over the Complex Numbers* (Springer, 2023), Chapters 1–3.
- Mumford, D. *Tata Lectures on Theta I* (Birkhäuser, 1983), §1.
- Conrad, B. Lecture Notes on Polarizations. Stanford, 2004. math.stanford.edu/~conrad/vigregroup
- Lombardo, D. *Abelian Varieties* (Pisa lecture notes, 2017-18), §4.
