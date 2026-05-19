---
title: "41. Riemann Hypothesis for AV over F_q"
type: theory
tags: [math, abelian-varieties, lesson-41]
aliases: [Riemann Hypothesis Finite Fields, Weil Conjectures AV]
created: 2026-05-19
---

> **Prerequisites**: [[40-weil-numbers|40. Weil Numbers and Their Properties]], [[39-frobenius-endomorphism|39. Frobenius Endomorphism π_A]]
> **Objectives**:
> - Phát biểu Weil Conjectures cho abelian varieties
> - Hiểu Riemann Hypothesis analog: eigenvalues của Frobenius có $|\alpha_i| = \sqrt{q}$
> - Hiểu Lefschetz Fixed-Point Formula và ứng dụng để tính $|A(\mathbb{F}_{q^n})|$
> - Kết nối với zeta function và chứng minh rationality
> - Thảo luận lịch sử: từ Weil đến Deligne

---

## Motivation / Intuition

"Riemann Hypothesis" (giả thuyết Riemann) kinh điển phát biểu rằng mọi zero của Riemann zeta function $\zeta(s)$ đều nằm trên đường thẳng $\operatorname{Re}(s) = 1/2$ trong mặt phẳng phức. Đây là một trong những bài toán mở vĩ đại nhất của toán học.

Trong thế giới hữu hạn, André Weil (1949) nhận ra rằng có một **analog chính xác** của giả thuyết Riemann, được áp dụng cho zeta function của varieties over finite fields. Điều kỳ diệu: phiên bản này **đã được chứng minh** — và đây là hành trình dài từ Weil chứng minh cho đường cong (1948), Weil tự đề xuất conjectures (1949), rồi Grothendieck phát triển étale cohomology để chứng minh các phần, và cuối cùng Pierre Deligne chứng minh toàn bộ (1974, được trao giải Fields Medal 1978).

Đối với **abelian varieties**, Riemann Hypothesis có nghĩa là: eigenvalues $\alpha_1, \ldots, \alpha_{2g}$ của Frobenius $\pi_A$ đều thỏa $|\alpha_i| = \sqrt{q}$ — chính xác là điều kiện định nghĩa Weil $q$-number! Như vậy, Định lý Weil (Bài 40) chính là "Riemann Hypothesis" cho abelian varieties.

---

## Weil Conjectures: Phát biểu Đầy Đủ

### Definition

> [!definition] Definition 41.1 — Zeta Function của Variety over $\mathbb{F}_q$  
> Cho $X$ là một smooth projective variety over $\mathbb{F}_q$. **Zeta function** của $X$ là hàm số hình thức:
>
> $$
> Z(X/\mathbb{F}_q, T) = \exp\left(\sum_{n=1}^\infty \frac{|X(\mathbb{F}_{q^n})|}{n} T^n\right) \in \mathbb{Q}[[T]]
> $$

Weil conjectures phát biểu bốn tính chất cơ bản của $Z(X, T)$:

### Theorem

> [!theorem] Theorem 41.2 — Weil Conjectures (Weil 1949, Deligne 1974)  
> Cho $X$ là smooth projective variety of dimension $d$ over $\mathbb{F}_q$. Khi đó:
>
> **(W1) Rationality**: $Z(X, T) \in \mathbb{Q}(T)$, tức là rational function:
>
> $$
> Z(X, T) = \frac{P_1(T) P_3(T) \cdots P_{2d-1}(T)}{P_0(T) P_2(T) \cdots P_{2d}(T)}
> $$
>
> với $P_i(T) \in \mathbb{Z}[T]$, $P_0(T) = 1 - T$, $P_{2d}(T) = 1 - q^d T$.
>
> **(W2) Functional Equation**: $Z(X, 1/(q^d T)) = \pm q^{d\chi/2} T^\chi Z(X, T)$ (với $\chi$ là Euler characteristic).
>
> **(W3) Riemann Hypothesis**: Nghiệm của $P_i(T)$ trong $\mathbb{C}$ đều có absolute value $q^{-i/2}$. Tương đương, nếu $P_i(T) = \prod_j(1 - \alpha_{i,j}T)$ thì $|\alpha_{i,j}| = q^{i/2}$.
>
> **(W4) Betti Numbers**: $\deg P_i = b_i$ là $i$-th Betti number của variety phức tương ứng (nếu $X$ có lift về $\mathbb{Z}$).

> [!note] Remark 41.3 — Lịch sử chứng minh  
> - (W1), (W2): chứng minh bởi Dwork (1960) và Grothendieck (1965).
> - (W3) "Riemann Hypothesis": chứng minh bởi **Deligne** (1974, *Weil I*), dùng toàn bộ framework của étale cohomology và một số ý tưởng độc đáo về "Lefschetz pencils."
> - (W4): cũng do Grothendieck chứng minh, dùng comparison theorems.

---

## Weil Conjectures cho Abelian Varieties

Với abelian variety $A$ of dimension $g$ over $\mathbb{F}_q$, cấu trúc cohomological đặc biệt đơn giản:

- $\dim H^i_\ell(A, \mathbb{Q}_\ell) = \binom{2g}{i}$ (đây là Betti numbers của complex torus $(\mathbb{C}/\mathbb{Z})^{2g}$).
- Trong particular: $b_0 = b_{2g} = 1$, $b_1 = b_{2g-1} = 2g$, $b_2 = b_{2g-2} = \binom{2g}{2}$, v.v.

> [!theorem] Theorem 41.4 — Zeta Function của Abelian Variety  
> Cho $A$ là abelian variety of dimension $g$ over $\mathbb{F}_q$, với characteristic polynomial của Frobenius $P_{\pi_A}(T) = \prod_{i=1}^{2g}(T - \alpha_i)$. Khi đó:
>
> $$
> Z(A/\mathbb{F}_q, T) = \frac{\prod_{i=1}^{2g}(1 - \alpha_i T)}{\prod_{j=0}^{2g}(1-q^j T)^{\binom{2g}{j}}} \cdot \frac{1}{(1-T)(1-q^{2g}T)}
> $$
>
> Cụ thể hơn, đa thức tử số của zeta function ứng với $H^1$ là:
>
> $$
> P_1(T) = P_{\pi_A}(T) = \prod_{i=1}^{2g}(1 - \alpha_i T)
> $$
>
> và $P_k(T) = \prod_{1 \leq i_1 < \cdots < i_k \leq 2g}(1 - \alpha_{i_1}\cdots\alpha_{i_k} T)$ là $k$-th exterior power.

**Proof (sketch).**
Từ Künneth formula cho $\ell$-adic cohomology và cấu trúc của $H^i(A) = \bigwedge^i H^1(A)$ (do $A$ là abelian variety, cohomology là exterior algebra sinh bởi $H^1$), eigenvalues của Frobenius trên $H^k(A)$ là tất cả sản phẩm $\alpha_{i_1}\cdots\alpha_{i_k}$.

Lefschetz Fixed-Point Formula (xem Theorem 41.5) hoàn thiện tính toán. $\blacksquare$

### Theorem

> [!theorem] Theorem 41.5 — Lefschetz Fixed-Point Formula  
> Cho $A/\mathbb{F}_q$ và Frobenius $\pi_A^n$ (Frobenius của $\mathbb{F}_{q^n}$). Với $\ell \neq p$:
>
> $$
> |A(\mathbb{F}_{q^n})| = |\ker(\pi_A^n - 1)| = \sum_{i=0}^{2g} (-1)^i \operatorname{Tr}(\pi_A^n \mid H^i_\ell(A))
> $$
>
> Vì $H^k(A) = \bigwedge^k H^1(A)$ và $\pi_A$ có eigenvalues $\alpha_1, \ldots, \alpha_{2g}$ trên $H^1(A)$:
>
> $$
> |A(\mathbb{F}_{q^n})| = \prod_{i=1}^{2g}(1-\alpha_i^n)
> $$

**Proof (sketch).**
Lefschetz trace formula là kết quả chuẩn của étale cohomology, áp dụng cho proper smooth varieties:

$$
|A(\mathbb{F}_{q^n})| = \sum_i (-1)^i \operatorname{Tr}(\pi_A^n \mid H^i_\ell(A, \mathbb{Q}_\ell))
$$

Với abelian variety: $H^0 = \mathbb{Q}_\ell$ (eigenvalue $\alpha_0 = 1$, $1$ lần), $H^{2g} = \mathbb{Q}_\ell(g)$ (eigenvalue $q^g$), và $H^k = \bigwedge^k H^1$ với eigenvalues là products $\alpha_{i_1}\cdots\alpha_{i_k}$.

Sau khi tính tổng luân phiên:
$$
\sum_{i=0}^{2g}(-1)^i \operatorname{Tr}(\pi^n \mid \textstyle\bigwedge^i H^1) = \prod_{i=1}^{2g}(1-\alpha_i^n)
$$

(đây là identity đại số chuẩn: $\sum_k (-1)^k e_k(x_1,\ldots,x_{2g}) = \prod_i(1-x_i)$ với $e_k$ elementary symmetric polynomials). $\blacksquare$

---

## Riemann Hypothesis cho Abelian Varieties

### Theorem

> [!theorem] Theorem 41.6 — Riemann Hypothesis cho AV (Weil 1948)  
> Cho $A$ là abelian variety over $\mathbb{F}_q$. Mọi eigenvalue $\alpha_i$ của Frobenius $\pi_A$ (là nghiệm của $P_{\pi_A}$) đều là Weil $q$-numbers:
>
> $$
> |\alpha_i| = \sqrt{q} \quad \text{với mọi } i = 1, \ldots, 2g
> $$
>
> Điều này tương đương: các "zeros" của $P_1(T) = P_{\pi_A}(T)$ trong $\mathbb{C}$ đều nằm trên đường tròn $|T| = 1/\sqrt{q}$.

**Proof.**
Đây chính là Định lý Weil (Theorem 40.6), được chứng minh qua Rosati involution. Xem Bài 40. $\blacksquare$

> [!note] Remark 41.7 — Kết nối với Riemann Hypothesis kinh điển  
> Nếu $Z(A, T) = P(T)/Q(T)$, đặt $s$ bởi $T = q^{-s}$, ta thu được $\zeta_A(s)$. "Zeros" của $\zeta_A(s)$ tương ứng với poles của $Z(A, T)$, và điều kiện $|\alpha_i| = \sqrt{q}$ tương đương $\operatorname{Re}(s) = 1/2$ khi $\alpha_i = q^{-s}$:
>
> $$
> |\alpha_i| = \sqrt{q} \iff |q^{-s}| = q^{-\operatorname{Re}(s)} = q^{-1/2} \iff \operatorname{Re}(s) = \frac{1}{2}
> $$
>
> Đây chính xác là analog của Riemann Hypothesis!

---

## Ứng dụng: Hasse Bound và Generalization

Một hệ quả ngay lập tức của Riemann Hypothesis là bound cho $|A(\mathbb{F}_q)|$:

### Corollary

> [!corollary] Corollary 41.8 — Hasse-Weil Bound  
> Cho $A/\mathbb{F}_q$ abelian variety chiều $g$, ta có:
>
> $$
> \left||A(\mathbb{F}_q)| - q^g\right| \leq \binom{2g}{g}\cdot q^{(2g-1)/2} + \binom{2g}{g-1}\cdot q^{(2g-2)/2} + \cdots
> $$
>
> Cụ thể với $g = 1$ (elliptic curve): **Hasse Bound**:
>
> $$
> \left||E(\mathbb{F}_q)| - q - 1\right| \leq 2\sqrt{q}
> $$

**Proof (for $g=1$).**
$|E(\mathbb{F}_q)| = (1-\alpha)(1-\bar{\alpha}) = 1 - (\alpha+\bar{\alpha}) + \alpha\bar{\alpha} = 1 - t + q$

với $t = \alpha+\bar{\alpha}$ (trace). Vì $|\alpha| = \sqrt{q}$, ta có $|t| = |\alpha + \bar{\alpha}| \leq |\alpha| + |\bar{\alpha}| = 2\sqrt{q}$, nên:

$$
|E(\mathbb{F}_q) - (q+1)| = |t| \leq 2\sqrt{q} \quad \blacksquare
$$

> [!example] Example 41.9 — Kiểm tra Hasse Bound  
> Với $E: y^2 = x^3 + x + 2$ over $\mathbb{F}_{101}$, ta tính được $|E(\mathbb{F}_{101})| = 100$.
>
> $|100 - (101+1)| = |100 - 102| = 2 \leq 2\sqrt{101} \approx 20.1$ ✓.
>
> Với $q = 101$, maximum là $2\sqrt{101} \approx 20.1$, nên $|E| \in [81, 123]$. Kết quả $|E| = 100$ nằm trong range này ✓.

---

## Tính Rationality của Zeta Function

Một trong bốn Weil Conjectures là rationality của zeta function. Ta chứng minh điều này trực tiếp cho abelian variety mà không cần đầy đủ machinery của étale cohomology:

### Theorem

> [!theorem] Theorem 41.10 — Rationality của Zeta Function  
> Cho $A/\mathbb{F}_q$ với Frobenius eigenvalues $\alpha_1, \ldots, \alpha_{2g}$. Khi đó:
>
> $$
> Z(A, T) = \prod_{k=0}^{2g} \prod_{1\leq i_1 < \cdots < i_k \leq 2g} (1 - \alpha_{i_1}\cdots\alpha_{i_k} T)^{(-1)^{k+1}}
> $$
>
> là một rational function. Cụ thể:
>
> $$
> Z(A, T) = \frac{P_{\pi_A}(T)}{\prod_{k \text{ even, }0\leq k \leq 2g}(\text{exterior power factors})}
> $$

**Proof (sketch).**
Từ $|A(\mathbb{F}_{q^n})| = \prod_i(1-\alpha_i^n)$ và định nghĩa zeta function:

$$
\log Z(A,T) = \sum_{n=1}^\infty \frac{\prod_i(1-\alpha_i^n)}{n} T^n
$$

Dùng expansion $\log(1-\alpha T) = -\sum_n \frac{\alpha^n}{n}T^n$:

$$
\log Z = -\sum_i \log(1-\alpha_i T) + (\text{higher exterior terms})
$$

sau tính toán hình thức, thu được $Z(A,T) = P_1(T)/P_0(T)P_2(T)\cdots$ là rational. $\blacksquare$

### Worked Example

> [!example] Example 41.11 — Zeta Function của Elliptic Curve  
> Cho $E: y^2 = x^3 + x + 2$ over $\mathbb{F}_{101}$, với $P_\pi(T) = T^2 - 2T + 101 = (T-\alpha)(T-\bar\alpha)$.
>
> Eigenvalues: $\alpha = 1+10i$, $\bar\alpha = 1-10i$.
>
> Zeta function:
>
> $$
> Z(E/\mathbb{F}_{101}, T) = \frac{1 - 2T + 101T^2}{(1-T)(1-101T)}
> $$
>
> Kiểm tra $|E(\mathbb{F}_{101})| = $ [hệ số $T^1$ trong $\exp(\ldots)$]... thực ra ta kiểm tra:
>
> $Z(E,T) = \exp\left(\sum_n \frac{|E(\mathbb{F}_{101^n})|}{n}T^n\right)$, và khai triển dạng partial fractions của vế phải cho $|E(\mathbb{F}_{101})| = 100$ ✓.
>
> Functional equation: $Z(E, 1/(101T)) = 101 T^2 \cdot Z(E, T)$ (đặc số $q=101$, chiều $d=1$, Euler characteristic $\chi = 0$ cho elliptic curve).

---

## Bối cảnh Lịch sử và Kết nối

> [!note] Remark 41.12 — Lịch sử Weil Conjectures  
> **André Weil** (1949): Đề xuất bốn conjectures, chứng minh chúng cho đường cong (genus $g$) và abelian varieties dựa trên kết quả của mình từ 1948.
>
> **Bernard Dwork** (1960): Chứng minh (W1) rationality bằng $p$-adic analysis, không dùng cohomology.
>
> **Alexander Grothendieck** (1965): Xây dựng **étale cohomology**, chứng minh (W1), (W2), (W4); đặt nền tảng cho (W3).
>
> **Pierre Deligne** (1974): Chứng minh (W3) "Riemann Hypothesis" bằng cách phát triển các phương pháp mới bao gồm "monodromy arguments" và "Fourier transform" cho sheaves. Đây là đỉnh cao của algebraic geometry thế kỷ 20.

> [!note] Remark 41.13 — Kết nối với Lý thuyết Số  
> Riemann Hypothesis cho abelian varieties có ứng dụng quan trọng:
>
> 1. **Counting**: Xác định kích thước $|A(\mathbb{F}_q)|$ và phân phối của nó khi $q$ thay đổi.
> 2. **L-functions**: Zeta function của $A/\mathbb{F}_q$ liên quan đến L-function của $A$ over number fields via Hasse-Weil.
> 3. **Cryptography**: Hasse bound cho elliptic curves đảm bảo rằng $|E(\mathbb{F}_p)| \approx p$, làm cho $E(\mathbb{F}_p)$ là một nhóm đủ lớn để dùng trong cryptography.
> 4. **Error-correcting codes**: Algebraic geometry codes (Goppa codes) dùng số điểm của varieties over finite fields.

---

## SageMath Cheatsheet

```python
# Zeta function of elliptic curve
E = EllipticCurve(GF(101), [1, 2])

# Frobenius polynomial: numerator of zeta function
fp = E.frobenius_polynomial()  # 1 - 2*T + 101*T^2 (in T variable)
print("Frobenius poly:", fp)

# Verify Hasse bound: |t| <= 2*sqrt(q)
t = E.trace_of_frobenius()
import math
print(f"|t| = {abs(t)} <= 2*sqrt(101) = {2*math.sqrt(101):.4f}: {abs(t) <= 2*math.sqrt(101)}")

# Count points over extensions F_{q^n}
q = 101
alpha = complex(1, 10)  # root of T^2 - 2T + 101
alpha_bar = complex(1, -10)

for n in range(1, 6):
    count = round(abs((1 - alpha**n) * (1 - alpha_bar**n))).real
    print(f"|E(F_{{101^{n}}})| = {int(count + 0.5)}")
# Expected: 100, 10400, 1020100, ...

# Hasse-Weil zeta function (rational form)
# Z(E, T) = (1 - t*T + q*T^2) / ((1-T)(1-q*T))
# Verify: expand numerator and denominator
from fractions import Fraction

def zeta_elliptic(t, q, num_terms=5):
    """Compute first few coefficients of Z(E, T) - 1 via the rational form."""
    # Expand 1/((1-T)(1-qT)) * (1 - tT + qT^2)
    # Use polynomial multiplication
    result = []
    for n in range(1, num_terms+1):
        # |E(F_{q^n})| from formula
        import cmath
        disc = t*t - 4*q
        alpha = (t + cmath.sqrt(disc))/2
        alpha_bar = (t - cmath.sqrt(disc))/2
        count = round(((1-alpha**n)*(1-alpha_bar**n)).real)
        result.append(int(count))
    return result

print(zeta_elliptic(2, 101))  # [100, 10400, ...]
```

---

## Summary / Key Takeaways

- **Weil Conjectures**: rationality, functional equation, Riemann Hypothesis, Betti numbers — bốn tính chất của zeta function variety over $\mathbb{F}_q$.
- **Riemann Hypothesis cho AV** = Định lý Weil: eigenvalues $\alpha_i$ của Frobenius có $|\alpha_i| = \sqrt{q}$.
- **Lefschetz Fixed-Point Formula**: $|A(\mathbb{F}_{q^n})| = \sum_i (-1)^i \operatorname{Tr}(\pi^n \mid H^i) = \prod(1-\alpha_i^n)$.
- **Hasse Bound** ($g=1$): $||E(\mathbb{F}_q)| - (q+1)| \leq 2\sqrt{q}$, là corollary trực tiếp.
- **Rationality**: $Z(A,T)$ là rational function xác định bởi $P_{\pi_A}(T)$.
- **Lịch sử**: Weil (1949, conjectures + chứng minh cho $g=1$), Dwork (rationality, 1960), Grothendieck (framework, 1965), Deligne (RH, 1974, Fields Medal).
- Zeta function kết nối: $|A(\mathbb{F}_{q^n})|$ với analytic structure qua $L$-functions.

---

## References

- Weil, A. "Numbers of solutions of equations in finite fields." *Bulletin of the AMS* 55 (1949), 497–508.
- Deligne, P. "La conjecture de Weil, I." *Publications Mathématiques de l'IHÉS* 43 (1974), 273–307.
- Milne, J.S. "The Riemann Hypothesis over Finite Fields: From Weil to the Present Day." jmilne.org/math/xnotes/pRH.pdf
- Oort, F. "Abelian Varieties over Finite Fields." §3, §4. math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, Appendix C §14.
- Ji, C. "The Weil Conjectures for Abelian Varieties." math.columbia.edu/~calebji/RH-abelian-varieties.pdf
- Karemaker, V. "Geometry and Arithmetic of Moduli Spaces of Abelian Varieties." AWS 2024. swc-math.github.io/aws/2024/2024KaremakerNotes.pdf
