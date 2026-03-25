---
title: "13. Abel's Theorem & Construction of Jacobian"
tags: [math, abelian-varieties, lesson-13]
aliases: [Abel's Theorem and Construction of Jacobian]
created: 2026-03-24
---

> **Prerequisites**: [[08-dual-abelian-variety|08. The Dual Abelian Variety]], [[11-polarizations-and-invertible-sheaves|11. Polarizations & Invertible Sheaves]]
> **Objectives**:
> - Hiểu Jacobian $J(C) = \operatorname{Pic}^0(C)$ như abelian variety canonical gắn với curve $C$
> - Nắm construction analytic trên $\mathbb{C}$: $J(C) = H^0(\Omega_C^1)^* / H_1(C, \mathbb{Z})$
> - Phát biểu và hiểu Abel's theorem: $\ker(\mu) = \text{principal divisors}$
> - Phát biểu Jacobi inversion theorem: $\mu$ là surjective
> - Hiểu construction algebraic (Weil 1948) và universal property của Jacobian

---

## Motivation / Intuition

Bài toán xuất phát từ thế kỷ 18–19: **Khi nào một divisor degree 0 trên curve $C$ là divisor của một hàm hữu tỉ?** Đây là bài toán Abel, và câu trả lời — Abel's theorem — là một trong những kết quả đẹp nhất của toán học.

Ý tưởng của Abel: một divisor $D = \sum n_i P_i$ degree 0 là principal nếu và chỉ nếu **tất cả các tích phân abelian** của $D$ bằng 0 modulo periods. Tập tất cả "giá trị tích phân" tạo thành một **complex torus** — đó chính là **Jacobian** $J(C)$.

Jacobi sau đó chứng minh rằng mọi điểm của torus này đều đạt được (Jacobi inversion theorem), cho nên $\operatorname{Pic}^0(C) \cong J(C)$ như group.

Đây là ví dụ đầu tiên và quan trọng nhất của abelian variety! Elliptic curve $E$ là Jacobian của chính nó ($g=1$), Jacobian của curve genus $2$ là abelian surface, v.v.

---

## Construction Analytic trên $\mathbb{C}$

### Holomorphic differentials và periods

Cho $C$ smooth projective curve genus $g \geq 1$ trên $\mathbb{C}$. Đặt:

$$
\Omega = H^0(C, \Omega_C^1) = \{ \omega : \text{holomorphic 1-forms trên } C \},
$$

là $\mathbb{C}$-vector space chiều $g$ (bởi Riemann–Roch).

Chọn **canonical homology basis**: $a_1, \ldots, a_g, b_1, \ldots, b_g \in H_1(C(\mathbb{C}), \mathbb{Z})$ — $2g$ đường tròn cơ bản trên mặt Riemann $g$-xuyến, với $a_i \cap b_j = \delta_{ij}$ và tất cả giao điểm khác bằng 0.

> [!abstract] Theorem 13.1 — Period Lattice (Riemann)
> **Period map** $\alpha : H_1(C(\mathbb{C}), \mathbb{Z}) \to \Omega^*$ gửi mỗi cycle $\gamma$ sang:
>
> $$
> \alpha(\gamma) : \omega \mapsto \int_\gamma \omega
> $$
>
> là **injection** và ảnh $\Lambda = \alpha(H_1(C, \mathbb{Z}))$ là **lattice** trong $\Omega^*$ ($2g$ vectors $\mathbb{R}$-linearly independent trong $\Omega^* \cong \mathbb{R}^{2g}$).

**Proof sketch.** Injective: nếu $\int_\gamma \omega = 0$ với mọi $\omega$ holomorphic thì $[\gamma] = 0$ trong $H_1(C, \mathbb{R})$ (Hodge theory). Lattice: $\dim_\mathbb{R} \Omega^* = 2g = \operatorname{rank} H_1(C, \mathbb{Z})$. $\blacksquare$

> [!abstract] Definition 13.2 — Jacobian Analytic
> **Jacobian analytic** của $C$ là complex torus:
>
> $$
> J^{\rm an}(C) = \Omega^* / \Lambda = H^0(C, \Omega_C^1)^* / H_1(C(\mathbb{C}), \mathbb{Z}).
> $$
>
> Đây là complex torus chiều $g$, và là abelian variety vì có Riemann form tự nhiên (từ intersection form trên $H_1$).

**Lattice tường minh**: chọn basis $\omega_1, \ldots, \omega_g$ cho $\Omega$ và basis $a_1, \ldots, a_g, b_1, \ldots, b_g$ cho $H_1$. Period matrix là:

$$
\Omega = \left( \int_{a_j} \omega_i \right)_{i,j} \cup \left( \int_{b_j} \omega_i \right)_{i,j} = [I_g \mid Z], \quad Z \in \mathcal{H}_g.
$$

Chuẩn hóa: normalize basis $\omega_i$ để $\int_{a_j} \omega_i = \delta_{ij}$. Khi đó $Z = (\int_{b_j} \omega_i)$ là **Siegel period matrix** với $Z = Z^T$, $\operatorname{Im}(Z) > 0$.

> [!example] Example 13.3 — Elliptic Curve ($g = 1$)
> Với $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$, holomorphic differential là $\omega = dz$ (duy nhất tới scalar). Period lattice: $\Lambda = \mathbb{Z} \cdot 1 + \mathbb{Z} \cdot \tau$.
>
> $J^{\rm an}(E) = \mathbb{C}^*/\mathbb{Z} = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau) = E$.
>
> Vậy $J(E) = E$ — elliptic curve là Jacobian của chính nó!

> [!example] Example 13.4 — Genus 2 Curve
> Cho $C : y^2 = f(x)$ với $f$ degree 5 hoặc 6 (hyperelliptic curve genus 2). Basis differentials: $\omega_1 = dx/y$, $\omega_2 = x \, dx/y$. Period matrix $Z \in \mathcal{H}_2$ là $2 \times 2$.
>
> $J(C) = \mathbb{C}^2/\Lambda$ là abelian surface — principally polarized abelian variety chiều 2.

---

## Abel's Theorem

### Abel map

Cho $P_0 \in C(k)$ là base point (rational point). Định nghĩa **Abel map**:

$$
\mu_{P_0} : \operatorname{Div}^0(C) \longrightarrow J^{\rm an}(C), \quad D = \sum n_i P_i \longmapsto \sum n_i \left( \int_{P_0}^{P_i} \omega_1, \ldots, \int_{P_0}^{P_i} \omega_g \right) \bmod \Lambda.
$$

Tích phân $\int_{P_0}^P$ đi dọc theo một đường từ $P_0$ đến $P$ — **không well-defined** vì phụ thuộc đường. Nhưng modulo $\Lambda$ (periods của các cycles) thì well-defined!

> [!abstract] Theorem 13.5 — Abel's Theorem
> $\mu_{P_0}$ là group homomorphism, và:
>
> $$
> \ker(\mu_{P_0}) = \operatorname{PDiv}^0(C) = \{ \operatorname{div}(f) \mid f \in k(C)^* \}.
> $$
>
> Tức là: $D \in \operatorname{Div}^0(C)$ là divisor của hàm hữu tỉ **khi và chỉ khi** $\mu_{P_0}(D) = 0$ trong $J^{\rm an}(C)$.

**Proof sketch.**

$\Rightarrow$: Nếu $D = \operatorname{div}(f)$ thì $\sum n_i = 0$ và theo Residue theorem, $\sum n_i \int_{P_0}^{P_i} \omega = \sum \operatorname{Res}_{P_i}(\log f \cdot \omega) = 0$ mod periods.

$\Leftarrow$ (phần khó hơn): nếu $\mu_{P_0}(D) = 0$ thì dùng Riemann–Roch để xây dựng function $f$ với $\operatorname{div}(f) = D$. $\blacksquare$

> [!tip] Reformulation
> Abel's theorem $\Leftrightarrow$ map $\mu_{P_0}$ induce isomorphism:
>
> $$
> \mu_{P_0} : \operatorname{Pic}^0(C) = \operatorname{Div}^0(C) / \operatorname{PDiv}^0(C) \xrightarrow{\sim} J^{\rm an}(C) \quad (\text{sau khi kết hợp với Jacobi inversion}).
> $$

> [!abstract] Theorem 13.6 — Jacobi Inversion Theorem
> Abel map $\mu_{P_0} : \operatorname{Div}^0(C) \to J^{\rm an}(C)$ là **surjective**.
>
> Equivalently: với mọi $z \in J^{\rm an}(C)$, tồn tại divisor $D \in \operatorname{Div}^0(C)$ sao cho $\mu_{P_0}(D) = z$.
>
> **Proof sketch.** Map $C^g \to J^{\rm an}(C)$, $(P_1, \ldots, P_g) \mapsto \mu_{P_0}(\sum P_i - g P_0)$ có Jacobian matrix non-singular tại một điểm generic (Riemann's theorem), nên surjective theo Lemma phiên bản phức. $\blacksquare$

**Kết hợp Abel + Jacobi**: $\operatorname{Pic}^0(C) \cong J^{\rm an}(C)$ là group isomorphism.

---

## Algebraic Construction

Trên $\mathbb{C}$, Jacobian là complex torus. Nhưng ta cần construction **algebraic** — tức là xây dựng $J(C)$ như algebraic variety trên trường tùy ý $k$ (kể cả $\operatorname{char}(k) = p$).

> [!abstract] Theorem 13.7 — Existence of Jacobian (Weil, Chow)
> Cho $C$ smooth projective curve của genus $g$ trên trường $k$. Tồn tại abelian variety $J(C)$ chiều $g$ trên $k$ cùng với isomorphism functorial:
>
> $$
> J(C)(L) \cong \operatorname{Pic}^0(C_L) \quad \text{với mọi field extension } L/k.
> $$
>
> Hơn nữa $J(C)$ là **principally polarized** bởi theta divisor $\Theta$.

**Construction sketch** (khi $C$ có $k$-rational point $P_0$):

1. **Symmetric power**: $C^{(d)} = C^d / S_d$ là moduli của effective divisors degree $d$.
2. **Abel-Jacobi maps**: $C^{(d)} \to J$ gửi $\{P_1, \ldots, P_d\} \mapsto [\sum P_i - d P_0]$.
3. Với $d = g$: map $C^{(g)} \to J$ là birational (by Riemann–Roch).
4. Dùng $J = \operatorname{Pic}^0_{C/k}$ là identity component của Picard scheme.

### Theta divisor từ $C^{(g-1)}$

> [!abstract] Definition 13.8 — Theta Divisor
> Cho $C$ genus $g$ với rational point $P_0$. **Theta divisor** là:
>
> $$
> \Theta = \Theta_{P_0} = \left\{ [D - (g-1)P_0] \in J(C) \;\middle|\; D \in C^{(g-1)}(k) \right\} \subset J(C),
> $$
>
> tức là ảnh của $C^{(g-1)} \to J$ qua map $\{P_1, \ldots, P_{g-1}\} \mapsto [\sum P_i - (g-1)P_0]$.
>
> $\Theta$ là effective divisor trên $J(C)$, và $\mathcal{O}_{J(C)}(\Theta)$ xác định **principal polarization** của $J(C)$.

> [!note] Remark 13.9 — $\Theta$ không phụ thuộc $P_0$ up to translation
> Khi thay đổi $P_0$ bởi $P_0'$, theta divisor dịch chuyển: $\Theta_{P_0'} = \Theta_{P_0} + \phi$ với $\phi$ là một điểm trong $J(C)$.
>
> Vì polarization tương ứng với **class** của $\Theta$ trong $\operatorname{NS}(J)$, polarization của $J(C)$ là canonical — không phụ thuộc $P_0$.

> [!example] Example 13.10 — Theta Divisor trên Elliptic Curve
> Với $E$ ($g = 1$): $C^{(0)} = \{0\}$ (empty divisor). Theta divisor $\Theta = \{[0 - 0 \cdot P_0]\} = \{[0]\} = \{0_E\}$ — chỉ gồm điểm gốc.
>
> Vậy $\mathcal{O}_E(\Theta) = \mathcal{O}_E([O])$ (line bundle degree 1 tại điểm $O$). Đây là principal polarization canonical của $E$.

---

## Universal Property của Jacobian

> [!abstract] Theorem 13.11 — Universal Property của Jacobian
> Cho $C$ smooth projective curve với rational point $P_0$. Cặp $(J(C), f_{P_0})$ với $f_{P_0} : C \to J(C)$, $P \mapsto [P - P_0]$, thỏa **universal property**:
>
> Với mọi abelian variety $A$ và morphism $\varphi : C \to A$ gửi $P_0 \mapsto 0$, tồn tại **duy nhất** group homomorphism $h : J(C) \to A$ sao cho $\varphi = h \circ f_{P_0}$:
>
> $$
> \begin{array}{ccc}
> C & \xrightarrow{f_{P_0}} & J(C) \\
> \varphi \searrow & & \swarrow h \\
>  & A &
> \end{array}
> $$

**Proof.** Factorization: map $C^g \to A$, $(P_1, \ldots, P_g) \mapsto \sum \varphi(P_i)$ là symmetric và descend qua Abel map $C^{(g)} \to J(C)$... Xem Milne, JV §6. $\blacksquare$

> [!note] Remark 13.12 — Albanese variety
> Universal property của Jacobian nói rằng $(J(C), f_{P_0})$ là **Albanese variety** của $C$ — object thỏa "tính chất covariant universal" của maps từ $C$ sang abelian varieties. Đây là tổng quát hóa của Jacobian cho varieties chiều cao hơn (mặc dù trong chiều cao sẽ là object khác).

---

## Schottky Problem

> [!abstract] Theorem 13.13 — Torelli Map
> **Torelli map** $\tau : \mathcal{M}_g \to \mathcal{A}_g$ gửi $[C] \mapsto [J(C), \Theta_C]$ là morphism từ moduli space curves $\mathcal{M}_g$ sang moduli space PPAVs $\mathcal{A}_g$.

> [!abstract] Question 13.14 — Schottky Problem
> **Schottky problem**: characterize the **Jacobian locus** $\tau(\mathcal{M}_g) \subset \mathcal{A}_g$ — tức là xác định các PPAVs nào là Jacobians của curves.
>
> Đây là một trong những bài toán mở quan trọng nhất của algebraic geometry. Một số kết quả:
> - $g = 1$: $\mathcal{M}_1 = \mathcal{A}_1$ (mọi PPAV chiều 1 là Jacobian). ✓
> - $g = 2$: $\dim \mathcal{M}_2 = 3 = \dim \mathcal{A}_2$ (generic PPAV chiều 2 là Jacobian).
> - $g = 3$: $\dim \mathcal{M}_3 = 6 = \dim \mathcal{A}_3$ (generic PPAV chiều 3 là Jacobian).
> - $g \geq 4$: $\dim \mathcal{M}_g = 3g - 3 < g(g+1)/2 = \dim \mathcal{A}_g$ — Jacobian locus proper.

---

## SageMath Cheatsheet

```python
# Jacobian của elliptic curve: J(E) = E
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
print("Genus:", 1)
print("J(E) ≅ E  (Jacobian của elliptic curve = chính nó)")

# Abel map: P -> [P - O] trong Pic^0(E) ≅ E
P = E([16, -61])
O = E(0)  # điểm gốc
# Abel map: P |-> [P] - [O] trong Pic^0(E)
# Tương đương với chính P trong E (vì E ≅ J(E))
print(f"Abel map: {P} -> [{P}] - [{O}] trong Pic^0(E)")
print(f"Tương đương với điểm {P} trong J(E) = E")
```

```python
# Theta divisor của elliptic curve: Theta = {O}
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
# Theta = C^{g-1} = C^0 = {empty} -> image là {0}
# O_E(Theta) = O_E([O]) = line bundle degree 1
print("Theta divisor của E: Theta = {O} (điểm gốc)")
print("O_E(Theta) = line bundle degree 1 tại O")
print("Polarization: phi_Theta: E -> E^vee là isomorphism")
```

```python
# Jacobian của hyperelliptic curve genus 2
# C: y^2 = f(x) với f bậc 5
R.<x> = QQ[]
f = x^5 - x  # genus = floor((5-1)/2) = 2
C = HyperellipticCurve(f)
print(f"Genus: {C.genus()}")  # phải là 2
J = C.jacobian()
print(f"Jacobian: {J}")
# J là abelian surface (dim 2)

# Một điểm trong J(C)
P = C(0, 0)  # điểm trên C
O = C(1, 0, 0)  # điểm vô cực
# J(C)(Q) là nhóm Abel với phép cộng divisors
```

```python
# Period matrix của elliptic curve
E = EllipticCurve(QQ, [0, 0, 0, -1, 0])  # y^2 = x^3 - x
L = E.period_lattice()
omega1 = L.omega_1
omega2 = L.omega_2

# Siegel period matrix cho g=1: Z = [omega2/omega1]
Z = omega2 / omega1
print(f"Period matrix Z = tau = {Z}")
print(f"Im(Z) = {Z.imag():.6f} > 0: {Z.imag() > 0}")

# J^an(E) = C/(Z + Z*tau) = E (analytic uniformization)
print(f"\nJ^an(E) = C/(Z + Z*{Z:.4f})")
print("= E  (elliptic curve là Jacobian của chính nó)")
```

```python
# Abel's theorem: D = div(f) <=> mu(D) = 0
# Trên E: [P] - [O] = 0 trong J(E) <=> P = O
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
P = E([16, -61])
O = E(0)

# mu([P] - [O]) = P trong J(E) = E
# mu = 0 <=> P = O
print("Abel map mu([P] - [O]) = P trong J(E) = E")
print(f"  P = {P}")
print(f"  mu = 0 <=> P = O: {P == O}")
print("\nAbel's theorem: D = div(f) <=> mu(D) = 0 trong J")
print("Jacobi inversion: mu: Div^0 -> J là surjective")
```

---

## Summary / Key Takeaways

- **Jacobian** $J(C) = \operatorname{Pic}^0(C)$: abelian variety chiều $g$ canonical gắn với curve $C$ genus $g$.
- **Construction analytic** (trên $\mathbb{C}$): $J(C) = H^0(\Omega_C^1)^* / H_1(C, \mathbb{Z})$ — complex torus từ holomorphic differentials và periods.
- **Period matrix** $Z \in \mathcal{H}_g$: Siegel period matrix, $Z = Z^T$, $\operatorname{Im}(Z) > 0$.
- **Abel's theorem**: $D \in \operatorname{Div}^0(C)$ principal $\Leftrightarrow$ $\mu(D) = 0$ trong $J$ (Abel map = 0).
- **Jacobi inversion**: $\mu : \operatorname{Div}^0(C) \to J(C)$ surjective; kết hợp với Abel: $\operatorname{Pic}^0(C) \cong J(C)$.
- **Theta divisor** $\Theta = $ image của $C^{(g-1)} \to J$: xác định principal polarization canonical của $J(C)$.
- **Universal property**: $(J(C), f_{P_0})$ là initial object — mọi map $C \to A$ (abelian variety) gửi $P_0 \to 0$ factor qua $J(C)$.
- **$g = 1$**: $J(E) = E$; **$g = 2, 3$**: generic PPAV là Jacobian; **$g \geq 4$**: Jacobian locus proper trong $\mathcal{A}_g$.
- **Schottky problem**: characterize Jacobians trong $\mathcal{A}_g$ — bài toán mở trung tâm của algebraic geometry.

---

## References

- Milne, J.S. *Jacobian Varieties* (course notes), jmilne.org.
- Milne, J.S. *Abelian Varieties* (v2.0), §18 (Abel and Jacobi).
- Griffiths, P. & Harris, J. *Principles of Algebraic Geometry*, Chapter 2 §3 (Abel's theorem).
- Arbarello, Cornalba, Griffiths, Harris. *Geometry of Algebraic Curves*, Vol. I, §1.3.
- Visser, R. *The Abel-Jacobi Map* (Warwick miniproject).
