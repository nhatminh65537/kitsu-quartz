---
title: "02. Complex Tori và Lattices"
tags: [math, abelian-varieties, lesson-02]
aliases: [Complex Tori và Lattices]
created: 2026-03-24
---

> **Prerequisites**: [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]], Complex analysis cơ bản (hàm holomorphic, $\mathbb{C}^g$ như $\mathbb{R}^{2g}$)
> **Objectives**:
> - Hiểu lattice $\Lambda \subset \mathbb{C}^g$ và quotient $X = \mathbb{C}^g / \Lambda$ như compact complex manifold
> - Nhận ra complex torus như nhóm Abel compact — và liên hệ với elliptic curves (trường hợp $g = 1$)
> - Nắm vững điều kiện để hai complex tori isomorphic
> - Hiểu Riemann form và tại sao nó cần thiết để complex torus trở thành abelian variety

---

## Motivation / Intuition

Elliptic curve qua lăng kính phân tích phức trông như thế nào? Cho $\tau \in \mathbb{C}$ với $\operatorname{Im}(\tau) > 0$. Xét lattice $\Lambda = \mathbb{Z} + \mathbb{Z}\tau \subset \mathbb{C}$. Khi đó quotient $\mathbb{C}/\Lambda$ là một compact Riemann surface genus 1 — chính là elliptic curve!

Nhóm $\mathbb{C}/\Lambda$ có cấu trúc nhóm abelian tự nhiên: $(z \bmod \Lambda) + (w \bmod \Lambda) = (z + w) \bmod \Lambda$. Cộng trong $\mathbb{C}$ "đi xuống" quotient. Điều này cho $\mathbb{C}/\Lambda$ cấu trúc **compact abelian Lie group** — vừa là manifold, vừa là nhóm.

Abelian variety chiều cao là tổng quát hóa: thay $\mathbb{C}$ bằng $\mathbb{C}^g$, thay lattice $\Lambda = \mathbb{Z}^2$ bằng lattice $\Lambda \cong \mathbb{Z}^{2g}$, và lấy quotient $\mathbb{C}^g / \Lambda$.

Tuy nhiên — và đây là điều thú vị — **không phải mọi** $\mathbb{C}^g / \Lambda$ đều là abelian variety. Hầu hết chúng chỉ là "complex tori" — compact complex manifolds với cấu trúc nhóm, nhưng **không thể nhúng** vào projective space. Điều kiện bổ sung để có abelian variety chính là sự tồn tại của một **Riemann form** trên $\Lambda$ — một khái niệm mà Riemann khám phá ra vào thế kỷ 19.

---

## Lattices và Complex Tori

### Lattices trong $\mathbb{C}^g$

> [!abstract] Definition 2.1 — Lattice
> Một **lattice** (lưới) $\Lambda$ trong $\mathbb{C}^g$ là một subgroup $\Lambda \subset \mathbb{C}^g$ (dưới phép cộng) cùng với tính chất:
>
> 1. $\Lambda$ là **discrete**: mọi tập compact chứa hữu hạn điểm của $\Lambda$.
> 2. $\Lambda$ **span** toàn bộ $\mathbb{C}^g$ trên $\mathbb{R}$: $\Lambda \otimes_{\mathbb{Z}} \mathbb{R} = \mathbb{C}^g \cong \mathbb{R}^{2g}$.
>
> Tương đương, $\Lambda \cong \mathbb{Z}^{2g}$ như nhóm, và $\Lambda$ chứa $2g$ vectors $\mathbb{R}$-linearly independent trong $\mathbb{C}^g \cong \mathbb{R}^{2g}$.

**Ký hiệu**: Cho cơ sở $\mathbb{R}$-cơ sở $\lambda_1, \ldots, \lambda_{2g}$ của $\Lambda$, ta có

$$
\Lambda = \mathbb{Z}\lambda_1 \oplus \cdots \oplus \mathbb{Z}\lambda_{2g}.
$$

> [!example] Example 2.2 — Lattice chuẩn trong $\mathbb{C}^g$
> Lattice **chuẩn** (standard) trong $\mathbb{C}^g$ là:
>
> $$
> \Lambda_0 = \mathbb{Z}^g + i\mathbb{Z}^g = \left\{ \sum_{j=1}^g (m_j + in_j) e_j \;\middle|\; m_j, n_j \in \mathbb{Z} \right\},
> $$
>
> trong đó $e_1, \ldots, e_g$ là cơ sở chuẩn của $\mathbb{C}^g$. Cơ sở của $\Lambda_0$ gồm $e_1, \ldots, e_g, ie_1, \ldots, ie_g$ — tổng cộng $2g$ vectors.
>
> Với $g = 1$: $\Lambda_0 = \mathbb{Z} + i\mathbb{Z}$ là lattice của elliptic curve với module $\tau = i$.

> [!abstract] Definition 2.3 — Complex Torus
> Cho $\Lambda \subset \mathbb{C}^g$ là lattice. **Complex torus** (torus phức) chiều $g$ là quotient:
>
> $$
> X = \mathbb{C}^g / \Lambda.
> $$
>
> Đây là compact complex manifold chiều phức $g$ (tức là chiều thực $2g$), với cấu trúc nhóm Abel:
>
> $$
> \bar{z} + \bar{w} := \overline{z + w}, \quad \bar{z}, \bar{w} \in X.
> $$
>
> Phần tử đơn vị là $\bar{0} = 0 \bmod \Lambda$. Nghịch đảo của $\bar{z}$ là $\overline{-z}$.

**Cấu trúc topo**: Là quotient $\mathbb{R}^{2g} / \mathbb{Z}^{2g}$ (sau khi chọn cơ sở), $X$ homeomorphic với $(S^1)^{2g}$ — tích của $2g$ đường tròn. Đây chính là torus thực $2g$-chiều!

> [!note] Remark 2.4
> Mọi complex torus $X = \mathbb{C}^g / \Lambda$ tự nhiên là một **compact abelian Lie group** (nhóm Lie abelian compact): phép nhóm là holomorphic, tức map $(\bar{z}, \bar{w}) \mapsto \bar{z} + \bar{w}$ là holomorphic. Đây là tính chất đặc trưng sẽ được tổng quát hóa thành định nghĩa abelian variety.

---

## Phân tích Complex Tori

### Period Matrix

Để mô tả lattice $\Lambda$ trong $\mathbb{C}^g$, ta dùng **period matrix** (ma trận chu kỳ). Chọn cơ sở phức $e_1, \ldots, e_g$ của $\mathbb{C}^g$ và cơ sở nguyên $\lambda_1, \ldots, \lambda_{2g}$ của $\Lambda$. Biểu diễn từng $\lambda_j$ theo cơ sở phức:

$$
\lambda_j = \sum_{k=1}^g \Omega_{kj} e_k, \quad \Omega_{kj} \in \mathbb{C}.
$$

Khi đó **period matrix** là ma trận $\Omega \in M_{g \times 2g}(\mathbb{C})$.

> [!abstract] Definition 2.5 — Period Matrix (dạng chuẩn)
> Bằng cách chọn cơ sở thích hợp, lattice $\Lambda$ luôn có period matrix dạng:
>
> $$
> \Omega = [Z \mid I_g],
> $$
>
> trong đó $I_g$ là ma trận đơn vị $g \times g$ và $Z \in M_{g \times g}(\mathbb{C})$ là ma trận **Siegel period matrix** thỏa:
>
> $$
> Z = Z^T \quad \text{(đối xứng)}, \qquad \operatorname{Im}(Z) > 0 \quad \text{(phần ảo positive definite)}.
> $$
>
> Không gian của các ma trận như vậy gọi là **Siegel upper half-space** $\mathcal{H}_g$.

**Trường hợp $g = 1$**: $Z = [\tau]$ với $\tau \in \mathbb{H} = \{ z \in \mathbb{C} \mid \operatorname{Im}(z) > 0 \}$ là upper half-plane. Đây chính là tham số hóa elliptic curves $E_\tau = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$!

### Đẳng cấu giữa Complex Tori

> [!abstract] Theorem 2.6 — Điều kiện đẳng cấu
> Hai complex tori $X_1 = \mathbb{C}^g / \Lambda_1$ và $X_2 = \mathbb{C}^g / \Lambda_2$ là **isomorphic** (như compact complex Lie groups) khi và chỉ khi tồn tại $A \in GL_g(\mathbb{C})$ sao cho $A(\Lambda_1) = \Lambda_2$.

**Proof sketch.** Mọi isomorphism $f : X_1 \to X_2$ bảo toàn nhóm nâng lên thành map $\tilde{f} : \mathbb{C}^g \to \mathbb{C}^g$ là isomorphism $\mathbb{C}$-linear, tức $\tilde{f}(z) = Az$ với $A \in GL_g(\mathbb{C})$. Vì $\tilde{f}$ descend xuống quotient, ta cần $A(\Lambda_1) \subseteq \Lambda_2$; tương tự $A^{-1}(\Lambda_2) \subseteq \Lambda_1$, nên $A(\Lambda_1) = \Lambda_2$. $\blacksquare$

> [!example] Example 2.7 — Elliptic curves isomorphic
> Hai elliptic curves $E_\tau = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$ và $E_{\tau'} = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau')$ isomorphic khi và chỉ khi $\tau' = \frac{a\tau + b}{c\tau + d}$ với $\begin{pmatrix} a & b \\ c & d \end{pmatrix} \in SL_2(\mathbb{Z})$.
>
> Đây là hành động của **modular group** $SL_2(\mathbb{Z})$ lên upper half-plane. Moduli space của elliptic curves là $\mathcal{H} / SL_2(\mathbb{Z})$ — và tổng quát hóa lên chiều cao là Siegel modular variety.

---

## Riemann Forms và Polarizations

### Tại sao không phải mọi complex torus đều là abelian variety?

Một kết quả cơ bản của hình học phức (định lý Chow) nói rằng: mọi submanifold compact của $\mathbb{P}^n(\mathbb{C})$ đều là algebraic variety. Vì vậy, nếu complex torus $X$ nhúng được vào $\mathbb{P}^n$, nó phải là algebraic — tức là abelian variety.

Nhưng: phép nhúng holomorphic $X \hookrightarrow \mathbb{P}^n$ tương đương với sự tồn tại của ample line bundle trên $X$. Mà theo Appell–Humbert, line bundles trên $X$ được mô tả bởi **Hermitian forms** và **semi-characters**. Ample line bundle tồn tại khi và chỉ khi có Hermitian form **positive definite** thỏa một điều kiện số nguyên — đó là **Riemann form**.

> [!abstract] Definition 2.8 — Riemann Form (Dạng Riemann)
> Cho $X = \mathbb{C}^g / \Lambda$ là complex torus. Một **Riemann form** trên $X$ là một Hermitian form
>
> $$
> H : \mathbb{C}^g \times \mathbb{C}^g \to \mathbb{C}
> $$
>
> thỏa hai điều kiện:
>
> 1. **Tính nguyên** (Integrality): Phần ảo $E = \operatorname{Im}(H)$ nhận giá trị nguyên trên $\Lambda \times \Lambda$:
>
> $$
> E(\lambda, \mu) \in \mathbb{Z} \quad \forall\, \lambda, \mu \in \Lambda.
> $$
>
> 2. **Positive definite**: $H(v, v) > 0$ với mọi $v \neq 0$ trong $\mathbb{C}^g$.

> [!note] Remark 2.9
> Từ tính Hermitian ($H(u, v) = \overline{H(v, u)}$), phần ảo $E = \operatorname{Im}(H)$ là **alternating $\mathbb{R}$-bilinear form** trên $\mathbb{C}^g \cong \mathbb{R}^{2g}$, thỏa $E(iu, iv) = E(u, v)$.
>
> Như vậy Riemann form tương đương với một alternating integer-valued form $E$ trên $\Lambda$ thỏa $E(iu, iv) = E(u, v)$ và "positive definite" theo nghĩa $E(v, iv) > 0$ với mọi $v \neq 0$.

> [!abstract] Theorem 2.10 — Riemann's Theorem (Điều kiện để AV)
> Complex torus $X = \mathbb{C}^g / \Lambda$ là (điểm phức của) một abelian variety khi và chỉ khi $X$ nhận một Riemann form.

**Proof sketch** (hướng $\Leftarrow$): Cho Riemann form $H$ với $E = \operatorname{Im}(H)$. Theo Appell–Humbert Theorem, cặp $(H, \chi)$ (với $\chi$ semi-character thích hợp) xác định một line bundle $\mathcal{L} = \mathcal{L}(H, \chi)$ trên $X$. Tính positive definite của $H$ đảm bảo $\mathcal{L}$ là ample (định lý Lefschetz). Khi đó $\mathcal{L}^{\otimes 3}$ là very ample, cho phép nhúng $X \hookrightarrow \mathbb{P}^N$. $\blacksquare$

> [!example] Example 2.11 — Elliptic curve $g = 1$ luôn có Riemann form
> Cho $E = \mathbb{C}/(\mathbb{Z} + \mathbb{Z}\tau)$ với $\tau = x + iy$, $y > 0$. Định nghĩa:
>
> $$
> H(u, v) = \frac{u \bar{v}}{y}.
> $$
>
> Đây là Hermitian form. Phần ảo $E(u, v) = \operatorname{Im}(H(u, v)) = \frac{\operatorname{Im}(u\bar{v})}{y}$.
>
> Kiểm tra tính nguyên trên $\Lambda = \mathbb{Z} + \mathbb{Z}\tau$: Với $\lambda_1 = 1$, $\lambda_2 = \tau$:
>
> $$
> E(1, \tau) = \frac{\operatorname{Im}(1 \cdot \bar{\tau})}{y} = \frac{\operatorname{Im}(\bar{\tau})}{y} = \frac{-y}{y} = -1 \in \mathbb{Z}. \checkmark
> $$
>
> Tính positive definite: $H(u, u) = |u|^2/y > 0$ với $u \neq 0$. ✓
>
> Vậy mọi elliptic curve đều có Riemann form — không ngạc nhiên, vì chúng đều là abelian varieties!

> [!warning] Example 2.12 — Complex torus không có Riemann form
> Với $g = 2$, "hầu hết" complex tori $\mathbb{C}^2 / \Lambda$ **không** có Riemann form và **không** là abelian varieties. Cụ thể, tập các lattice $\Lambda$ cho complex torus với Riemann form có số chiều (real) $3g(g+1)/2 = 6$ (chiều Siegel space $\mathcal{H}_2$), trong khi tập tất cả lattices có chiều $2g^2 = 8$. Không gian $8$-chiều lớn hơn $6$-chiều — đa số complex tori $g=2$ không phải AV.

---

## Appell–Humbert Theorem (Phác thảo)

Định lý Appell–Humbert phân loại đầy đủ line bundles trên complex torus.

> [!abstract] Theorem 2.13 — Appell–Humbert Theorem
> Cho $X = \mathbb{C}^g / \Lambda$. Mọi holomorphic line bundle trên $X$ là dạng $\mathcal{L}(H, \chi)$ xác định bởi cặp $(H, \chi)$ duy nhất, trong đó:
>
> - $H : \mathbb{C}^g \times \mathbb{C}^g \to \mathbb{C}$ là Hermitian form với $\operatorname{Im}(H)|_{\Lambda \times \Lambda} \in \mathbb{Z}$.
> - $\chi : \Lambda \to U(1) = \{ z \in \mathbb{C} \mid |z| = 1 \}$ là **semi-character**: hàm thỏa
>
> $$
> \chi(\lambda + \mu) = \chi(\lambda) \chi(\mu) e^{i\pi \operatorname{Im} H(\lambda, \mu)} \quad \forall\, \lambda, \mu \in \Lambda.
> $$
>
> Hơn nữa, $\mathcal{L}(H, \chi)$ là ample khi và chỉ khi $H$ là positive definite.

**Cấu trúc của $\operatorname{Pic}(X)$**: Appell–Humbert cho short exact sequence:

$$
0 \to \operatorname{Pic}^0(X) \to \operatorname{Pic}(X) \to \operatorname{NS}(X) \to 0,
$$

trong đó:
- $\operatorname{Pic}^0(X) \cong \operatorname{Hom}(\Lambda, U(1)) \cong \hat{X}$ là **dual torus** (sẽ gặp lại ở Lesson 08).
- $\operatorname{NS}(X)$ là **Néron–Severi group**: nhóm các Riemann forms (không cần positive definite).

---

## Ví dụ Tường Minh: $g = 2$

Cho $X = \mathbb{C}^2 / \Lambda$ với lattice

$$
\Lambda = \mathbb{Z}^2 + Z \mathbb{Z}^2, \quad Z = \begin{pmatrix} \tau_1 & \tau_3 \\ \tau_3 & \tau_2 \end{pmatrix} \in \mathcal{H}_2.
$$

Tức là $\Lambda$ được sinh bởi 4 vectors: cột của ma trận $[Z \mid I_2]$.

Hermitian form $H$ trên $\mathbb{C}^2$ positive definite với $\operatorname{Im}(H)|_{\Lambda \times \Lambda} \in \mathbb{Z}$ là Riemann form, và tồn tại Riemann form khi và chỉ khi $\operatorname{Im}(Z) > 0$ — chính xác là điều kiện Siegel!

Với $Z = \begin{pmatrix} i & 0 \\ 0 & i\sqrt{2} \end{pmatrix}$, $X$ là abelian surface (abelian variety chiều 2). Với $Z$ "generic" (hầu hết $Z$), $X$ vẫn là complex torus nhưng **không** là abelian variety.

---

## SageMath Cheatsheet

```python
# Elliptic curve như complex torus C/(Z + Z*tau)
# Với tau = i (lattice vuông)
E = EllipticCurve([0, -1])  # y^2 = x^3 - x
print("j-invariant:", E.j_invariant())  # j = 1728 ứng với tau = i

# Lattice và period matrix cho elliptic curve
E2 = EllipticCurve([1, 0])
periods = E2.period_lattice()
print("Omega1 =", periods.omega_1)
print("Omega2 =", periods.omega_2)
tau = periods.omega_2 / periods.omega_1
print("tau =", tau)
print("Im(tau) > 0:", tau.imag() > 0)
```

```python
# Tính Riemann form cho g=1
# Cho E = C/(Z + Z*tau), Riemann form H(u,v) = u*conj(v)/Im(tau)
def hermitian_form(u, v, tau):
    y = tau.imag()
    return (u * v.conjugate()) / y

tau = CC(0, 1)  # tau = i
u = CC(1, 0)
v = CC(0, 1)

H_uv = hermitian_form(u, v, tau)
E_uv = H_uv.imag()  # phần ảo = alternating form
print(f"H(1, tau) = {H_uv}")
print(f"E(1, tau) = Im(H(1,tau)) = {E_uv}")  # Phải là số nguyên
# E(1, tau) = Im(i/1) = ... kiểm tra tính nguyên
```

```python
# Kiểm tra isomorphism của elliptic curves qua modular group
# tau và tau' isomorphic <=> tau' = (a*tau + b)/(c*tau + d), ad-bc = 1
def modular_transform(tau, a, b, c, d):
    return (a*tau + b) / (c*tau + d)

tau = CC(0.5, sqrt(3)/2)  # tau = e^{i*pi/3}
# Áp dụng S: tau -> -1/tau
tau_S = modular_transform(tau, 0, -1, 1, 0)
print(f"tau = {tau}")
print(f"S(tau) = -1/tau = {tau_S}")
# Hai elliptic curves C/L_tau và C/L_{S(tau)} isomorphic!
```

---

## Summary / Key Takeaways

- **Lattice** $\Lambda \subset \mathbb{C}^g$: subgroup discrete, span $\mathbb{R}^{2g}$, isomorphic $\mathbb{Z}^{2g}$.
- **Complex torus** $X = \mathbb{C}^g / \Lambda$: compact complex manifold, đồng thời là compact abelian Lie group.
- **Period matrix** $\Omega = [Z \mid I_g]$ với $Z \in \mathcal{H}_g$ (Siegel upper half-space) tham số hóa complex tori.
- Hai tori $\mathbb{C}^g/\Lambda_1 \cong \mathbb{C}^g/\Lambda_2$ khi và chỉ khi $\exists A \in GL_g(\mathbb{C})$: $A\Lambda_1 = \Lambda_2$.
- **Riemann form** $H$: Hermitian form positive definite với $\operatorname{Im}(H)|_{\Lambda \times \Lambda} \subset \mathbb{Z}$.
- Complex torus là **abelian variety** $\Leftrightarrow$ có Riemann form.
- $g = 1$: mọi complex torus là elliptic curve (luôn có Riemann form).
- $g \geq 2$: hầu hết complex tori **không** phải abelian variety.
- **Appell–Humbert**: mọi line bundle trên $X$ xác định bởi cặp $(H, \chi)$ duy nhất; ample $\Leftrightarrow$ $H$ positive definite.
- $\operatorname{Pic}(X)$: extension của $\operatorname{NS}(X) = \{\text{Riemann forms}\}$ bởi $\operatorname{Pic}^0(X) = \hat{X}$ (dual torus).

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §2 (Abelian Varieties over the Complex Numbers).
- Lange, H. *Abelian Varieties over the Complex Numbers* (Springer, 2023), Chapters 1–2.
- Mumford, D. *Abelian Varieties* (Tata Lectures, 1970), §1 (Complex Tori).
- Wikipedia: *Complex torus*, *Appell–Humbert theorem*.
