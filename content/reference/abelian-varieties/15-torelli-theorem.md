---
title: "15. Torelli's Theorem"
tags: [math, abelian-varieties, lesson-15]
aliases: [Torelli's Theorem]
created: 2026-03-24
---

> **Prerequisites**: [[14-abel-jacobi-map|14. The Abel–Jacobi Map]], [[11-polarizations-and-invertible-sheaves|11. Polarizations & Invertible Sheaves]]
> **Objectives**:
> - Phát biểu và hiểu Torelli's theorem: $(J(C), \Theta)$ xác định duy nhất $C$
> - Hiểu proof sketch qua theta divisor và $W_{g-1}$
> - Biết reformulation qua Torelli map $\tau : \mathcal{M}_g \to \mathcal{A}_g$ là injection
> - Phân biệt Torelli theorem, infinitesimal Torelli, generic Torelli
> - Hiểu Schottky problem và các hướng tiếp cận

---

## Motivation / Intuition

Từ Lesson 13–14, ta biết rằng mỗi curve $C$ genus $g$ xác định một principally polarized abelian variety (PPAV) $(J(C), \Theta)$. Câu hỏi ngược: **nếu biết PPAV $(A, \lambda)$, có thể phục hồi $C$ không?**

Torelli's theorem trả lời: **Có!** Curve $C$ được xác định duy nhất bởi PPAV $(J(C), \Theta)$ của nó. Đây là kết quả cực kỳ quan trọng vì nó nói rằng việc "linearize" curve thành abelian variety **không mất thông tin** — ta có thể đi ngược lại.

Về mặt hình học: trong không gian moduli $\mathcal{A}_g$, **Torelli map** $\tau : \mathcal{M}_g \to \mathcal{A}_g$ gửi $[C] \mapsto [(J(C), \Theta)]$ là **injective** — mỗi isomorphism class của curve ứng với đúng một PPAV.

---

## Phát Biểu Torelli's Theorem

> [!abstract] Theorem 15.1 — Torelli's Theorem
> Cho $C$ và $C'$ là hai smooth projective curves genus $g$ trên trường đại số đóng $k$. Nếu tồn tại **isomorphism của PPAVs**:
>
> $$
> (J(C), \Theta_C) \cong (J(C'), \Theta_{C'}),
> $$
>
> thì $C \cong C'$ như algebraic curves.

**Proof** (dạng Hodge-theoretic, trên $\mathbb{C}$):

Biết $(J(C), \Theta) \cong (J(C'), \Theta')$ có nghĩa là biết **polarized Hodge structure** $H^1(C, \mathbb{Z})$ với intersection form $Q$. Hodge theory cho:

- $H^{1,0}(C) = H^0(C, \Omega_C^1)$ — space của holomorphic differentials.
- $H^{0,1}(C) = \overline{H^{1,0}(C)}$.
- $Q$ là **symplectic form** trên $H^1(C, \mathbb{Z})$.

Từ dữ liệu này, ta muốn phục hồi $C$. Ý tưởng chính là dùng **theta divisor** $\Theta = W_{g-1}$:

**Bước 1**: Theta divisor $\Theta \subset J(C)$ xác định subvariety $W_{g-1}(C)$ — ảnh của $C^{(g-1)} \to J(C)$.

**Bước 2**: Từ $W_{g-1}$ (và singularities của nó), ta phục hồi lại $W_1 = f_{P_0}(C)$ — ảnh của $C$ trong $J(C)$.

**Bước 3**: Vì $f_{P_0} : C \hookrightarrow J(C)$ là closed immersion (Lesson 14), việc phục hồi $W_1$ phục hồi $C$. $\blacksquare$

> [!note] Remark 15.2 — Tại sao cần cả Theta divisor?
> Chú ý: cần biết **cả** $(J(C), \Theta)$ — không chỉ $J(C)$ như abelian variety. Có những PPAV **khác nhau** nhưng có $J(C)$ isomorphic như abelian variety (không kèm polarization). Theta divisor ghi nhớ thêm thông tin đủ để phân biệt.
>
> Ví dụ: với $g = 2$, $J(C)$ là abelian surface. Có nhiều abelian surfaces $A$ isomorphic như abelian variety nhưng $A$ là Jacobian của các curves **khác nhau** (với polarizations khác nhau).

---

## Proof chi tiết hơn: Reconstructing $C$ from $(J(C), \Theta)$

> [!abstract] Theorem 15.3 — $\Theta = W_{g-1}$ và Riemann Singularity
> Theta divisor $\Theta \subset J(C)$ thoả:
>
> $$
> \operatorname{Sing}(\Theta) = W_{g-2}(C) = \{ [D - (g-2)P_0] : D \in C^{(g-2)} \}.
> $$
>
> Đặc biệt, $\operatorname{codim}_{J(C)} \operatorname{Sing}(\Theta) = g - 1$ (khi $g \geq 2$).

**Proof.** $[D] \in \Theta$ là singular khi và chỉ khi $\dim H^0(\mathcal{O}(D + P_0)) \geq 2$ (từ Riemann–Roch), tức là divisor $D + P_0$ là **special** (thuộc về $W_{g-2}$). $\blacksquare$

Từ $\Theta$, ta phục hồi:
- $W_{g-2} = \operatorname{Sing}(\Theta)$.
- $W_{g-3} = \operatorname{Sing}(W_{g-2})$ (inductively).
- $W_1 = $ mịn nhất non-empty, và $C = W_1$.

Điều này cho phép phục hồi $C$ hoàn toàn từ $(J(C), \Theta)$.

---

## Torelli Map và Moduli Spaces

> [!abstract] Theorem 15.4 — Torelli Map là Injection
> **Torelli map** $\tau : \mathcal{M}_g \to \mathcal{A}_g$, $[C] \mapsto [(J(C), \Theta_C)]$, là morphism của moduli spaces thỏa:
>
> 1. $\tau$ là **injective** trên geometric points (Torelli's theorem).
> 2. $\tau$ là **immersion** tại $[C]$ khi $C$ không hyperelliptic hoặc $g \leq 2$ (local Torelli).
> 3. $\dim \mathcal{M}_g = 3g - 3$ (với $g \geq 2$) $< g(g+1)/2 = \dim \mathcal{A}_g$ (với $g \geq 4$).

> [!example] Example 15.5 — Genus 1, 2, 3
> - **$g = 1$**: $\mathcal{M}_1 \cong \mathcal{A}_1$ (mọi PPAV dim 1 là Jacobian của elliptic curve). Torelli là isomorphism!
> - **$g = 2$**: $\dim \mathcal{M}_2 = 3 = \dim \mathcal{A}_2$. Torelli map là birational — mọi PPAV dim 2 là Jacobian (không tính 2 elliptic curves $E_1 \times E_2$ product). Chính xác: $\mathcal{A}_2 \setminus \tau(\mathcal{M}_2) = $ sản phẩm của 2 elliptic curves.
> - **$g = 3$**: $\dim \mathcal{M}_3 = 6 = \dim \mathcal{A}_3$. Torelli là birational — generic PPAV dim 3 là Jacobian, nhưng Jacobian locus không dày đặc trong $\mathcal{A}_3$? Thực ra $\overline{\tau(\mathcal{M}_3)} = \mathcal{A}_3$ (Jacobians dense).
> - **$g = 4$**: $\dim \mathcal{M}_4 = 9 < 10 = \dim \mathcal{A}_4$. Jacobian locus là hypersurface.

---

## Infinitesimal Torelli và Local Torelli

Ngoài Torelli's theorem (global), có version **local**:

> [!abstract] Theorem 15.6 — Infinitesimal Torelli (local)
> Torelli map $\tau : \mathcal{M}_g \to \mathcal{A}_g$ là **immersion** tại $[C]$ (tức là $d\tau_{[C]}$ injective) khi và chỉ khi:
>
> $$
> \mu_{0,2} : \operatorname{Sym}^2 H^0(C, \Omega_C^1) \to H^0(C, \Omega_C^{\otimes 2})
> $$
>
> là **surjective** (Petri map surjective).
>
> Điều này đúng khi $C$ không hyperelliptic (và $g \geq 3$) hoặc $g \leq 2$.

> [!note] Remark 15.7 — Hyperelliptic curves và Torelli map
> Với $C$ hyperelliptic ($g \geq 3$): $\tau$ vẫn injective (global Torelli vẫn đúng), nhưng $d\tau$ **không** injective. Hyperelliptic locus $\mathcal{H}_g \subset \mathcal{M}_g$ map sang một locus trong $\mathcal{A}_g$ với tangent map không injective — nhưng vẫn injective trên điểm.

---

## Schottky Problem

> [!abstract] Problem 15.8 — Schottky Problem
> Characterize **Jacobian locus** $\mathcal{J}_g = \tau(\mathcal{M}_g) \subset \mathcal{A}_g$ — tập các PPAVs là Jacobians của smooth curves.
>
> Đây là bài toán mở trung tâm, với nhiều hướng tiếp cận:
>
> 1. **Theta functions** (Schottky, Farkas): Jacobians thỏa các phương trình nhất định trong theta constants.
> 2. **Singularities của Theta divisor**: $\operatorname{codim} \operatorname{Sing}(\Theta) \leq 4$ là đặc trưng (Andreotti–Mayer).
> 3. **KP equation**: Jacobians ứng với các solutions của KP (Kadomtsev–Petviashvili) hierarchy (Novikov conjecture, proven by Shiota 1986).
> 4. **Trisecants** (Fay's identity): $J(C)$ có "trisecant lines" đặc trưng.

> [!example] Example 15.9 — Shiota's Theorem
> **Shiota 1986**: $(A, \Theta)$ là Jacobian $\Leftrightarrow$ có $u \in \mathbb{C}^g$, $v \in \mathbb{C}^g$, $c \in \mathbb{C}$ sao cho:
>
> $$
> \frac{\partial \vartheta}{\partial t_1} + \frac{1}{4} \frac{\partial^3 \vartheta}{\partial t_3^3} + \frac{3}{4} \frac{\partial^2 \vartheta}{\partial t_2^2} - \frac{3}{4} c \vartheta = 0,
> $$
>
> trong đó $\vartheta = \vartheta(\mathbf{t}; A) = \theta(t_1 u + t_2 v + t_3 w + z; \tau)$ với $\mathbf{t} = (t_1, t_2, t_3)$ — **KP equation**.

---

## SageMath Cheatsheet

```python
# Torelli theorem: J(C) với theta divisor xác định C
# Với g=1: J(E) = E, nên C xác định bởi J(C) = C

# Ví dụ: hai elliptic curves khác nhau có Jacobians khác nhau
E1 = EllipticCurve(QQ, [0, -1, 1, -10, -10])
E2 = EllipticCurve(QQ, [1, 0])

# j-invariants khác nhau => E1 != E2
print(f"j(E1) = {E1.j_invariant()}")
print(f"j(E2) = {E2.j_invariant()}")
print(f"E1 ≅ E2: {E1.j_invariant() == E2.j_invariant()}")
print("Torelli: J(E1) ≇ J(E2) vì E1 ≇ E2")
```

```python
# Torelli map: M_g -> A_g, dimension comparison
for g in range(1, 7):
    dim_Mg = max(0, 3*g - 3) if g >= 2 else (1 if g == 1 else 0)
    dim_Ag = g*(g+1)//2
    diff = dim_Ag - dim_Mg
    status = "isom" if diff == 0 and g <= 1 else ("birational" if diff == 0 else f"codim {diff}")
    print(f"g={g}: dim(M_g)={dim_Mg}, dim(A_g)={dim_Ag}, diff={diff} => {status}")
```

```python
# Schottky problem: Jacobians vs general PPAVs
# Với g >= 4, có PPAVs không phải Jacobian

# Ví dụ đơn giản: product của 2 elliptic curves
E1 = EllipticCurve(QQ, [0, -1])
E2 = EllipticCurve(QQ, [1, 0])

# A = E1 x E2 là PPAV dim 2 với polarization lambda_{E1} x lambda_{E2}
# A là Jacobian khi E1, E2 không isomorphic (với g=2, mọi PPAV là Jacobian!)
print("g=2: A = E1 x E2 là Jacobian khi j(E1) ≠ j(E2)")
print(f"j(E1) = {E1.j_invariant()}")
print(f"j(E2) = {E2.j_invariant()}")
print(f"j(E1) == j(E2): {E1.j_invariant() == E2.j_invariant()}")
if E1.j_invariant() != E2.j_invariant():
    print("=> A = E1 x E2 là Jacobian của một genus 2 curve")
```

```python
# Theta divisor và singularities
# Sing(Theta) = W_{g-2}
# Với g=2: Theta là ample divisor trên J(C), Sing(Theta) = W_0 = {0}

# Trên J(C) của genus 2 curve:
R.<x> = QQ[]
f = x^5 - x + 1  # genus 2 hyperelliptic
C = HyperellipticCurve(f)
J = C.jacobian()
g = C.genus()
print(f"C: genus = {g}")
print(f"Theta divisor = W_{{g-1}} = W_{g-1} = image C^({g-1}) -> J(C)")
print(f"Sing(Theta) = W_{{g-2}} = W_{g-2} = image C^({g-2}) -> J(C)")
if g == 2:
    print(f"Sing(Theta) = W_0 = {{0}} (chỉ điểm gốc)")
    print(f"codim Sing(Theta) = {g-1} = g-1 = 1")
```

---

## Summary / Key Takeaways

- **Torelli's Theorem**: $(J(C), \Theta_C) \cong (J(C'), \Theta_{C'})$ $\Rightarrow$ $C \cong C'$ — curve được xác định duy nhất bởi PPAV Jacobian.
- **Proof qua theta divisor**: $\Theta = W_{g-1}$; singularities của $\Theta$ recover $W_{g-2}$; inductively recover $W_1 = C$.
- **Torelli map** $\tau : \mathcal{M}_g \to \mathcal{A}_g$ là **injection** — không mất thông tin khi đi từ curves sang PPAVs.
- **Local Torelli**: $d\tau$ injective $\Leftrightarrow$ Petri map surjective $\Leftrightarrow$ $C$ không hyperelliptic (và $g \geq 3$).
- **Jacobian locus**: $g \leq 3$: generic PPAV là Jacobian. $g \geq 4$: Jacobian locus là proper subvariety.
- **Schottky problem**: characterize Jacobians trong $\mathcal{A}_g$. Solved by Shiota 1986 qua KP equations; các hướng khác: Andreotti–Mayer, Fay's trisecants.

---

## References

- Milne, J.S. *Jacobian Varieties*, §12 (Torelli's theorem).
- Griffiths, P. & Harris, J. *Principles of Algebraic Geometry*, §2.3 (Jacobians and Torelli).
- Landesman, A. *Torelli Theorem for Curves* (Harvard notes, 2019).
- Peters, C. *Lectures on Torelli Theorems* (Spring School Rennes, 2014).
- Shiota, T. *Characterization of Jacobian varieties in terms of soliton equations*, Inventiones Math. (1986).
