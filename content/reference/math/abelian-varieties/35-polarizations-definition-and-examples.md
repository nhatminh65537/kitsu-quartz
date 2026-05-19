---
title: "35. Polarizations — Definition and Examples"
type: foundation
tags: [math, abelian-varieties, lesson-35, polarization, principal-polarization]
aliases: [Polarizations]
created: 2026-05-19
---

> **Prerequisites**: [[34-symmetric-isogenies|34. Symmetric Isogenies A → Â]], [[26-the-map-phi-L|26. The Map φ_L: A → Â]], [[13-abelian-varieties-are-projective|13. Abelian Varieties Are Projective]]
> **Objectives**:
> - Nắm vững định nghĩa chính thức của polarization (phân cực) như là symmetric isogeny đến từ ample line bundle
> - Hiểu principal polarization (phân cực chính) — trường hợp đặc biệt quan trọng nhất
> - Tính degree của polarization và hiểu "type" của polarization $(d_1, \ldots, d_g)$
> - Phân tích nhiều ví dụ cụ thể: elliptic curve, products of AV, abelian surfaces
> - Hiểu tại sao mọi abelian variety đều có polarization và tại sao polarization không canonical

---

## Motivation / Intuition

Abelian variety $A$ là một variety có group law — nhưng nó thiếu một cấu trúc quan trọng: không có cách tự nhiên để "đo khoảng cách" hay "định hướng" trên nó. Trong hình học phức, tori phức $\mathbb{C}^g/\Lambda$ chỉ trở thành abelian variety (projective) khi có thêm một **Riemann form** $H$: một Hermitian form dương-xác-định trên $\mathbb{C}^g$ có imaginary part là $\mathbb{Z}$-valued trên $\Lambda \times \Lambda$. Riemann form này chính xác là dữ liệu của một **polarization**.

Trong ngữ cảnh đại số thuần túy (trên trường tùy ý $k$), polarization được định nghĩa là một symmetric isogeny $\phi: A \to \widehat{A}$ "đến từ" một ample line bundle — tức là $\phi = \phi_L$ cho một $L$ ample nào đó (ít nhất sau khi pass to algebraic closure). Điều kiện ampleness là analog của "dương-xác-định" trong trường hợp phức.

Tại sao cần polarization? Nhiều lý do:
1. **Compact moduli**: Không gian moduli của abelian varieties *không* compact, nhưng không gian moduli của **principally polarized abelian varieties** (ppav) compact hóa tốt.
2. **Weil pairing**: Polarization tạo ra symplectic pairing trên torsion points (bài 36).
3. **Rosati involution**: Polarization tạo involution trên $\operatorname{End}^0(A)$ (bài 37).
4. **Jacobians**: Jacobian của curve có canonical principal polarization (bài 38).

---

## Định Nghĩa Polarization

### Definition

> [!definition] Definition 35.1 — Polarization (Phân Cực)
> Cho $A$ là một abelian variety over $k$. Một **polarization** của $A$ là một isogeny
>
> $$
> \phi: A \to \widehat{A}
> $$
>
> thỏa đồng thời hai điều kiện:
>
> **(i) Symmetric:** $\phi = \widehat{\phi} \circ \operatorname{can}_A$ (theo Definition 34.6).
>
> **(ii) Ample:** Tồn tại một ample line bundle $L$ trên $A_{\bar{k}}$ (base change lên algebraic closure) sao cho $\phi_{\bar{k}} = \phi_L$.
>
> Một **principally polarized abelian variety** (ppav) là một cặp $(A, \phi)$ trong đó $\phi: A \xrightarrow{\sim} \widehat{A}$ là isomorphism. Khi đó $\phi$ được gọi là **principal polarization**.

> [!note] Remark 35.2 — Điều Kiện Ampleness
> Điều kiện (ii) nói $\phi_{\bar{k}} = \phi_L$ cho một $L$ ample — **không** nhất thiết over $k$ mà over $\bar{k}$. Điều này quan trọng: có symmetric isogeny $\phi: A \to \widehat{A}$ defined over $k$ mà $\phi = \phi_L$ chỉ sau khi extend scalars.
>
> Tuy nhiên, trên **trường hữu hạn** $\mathbb{F}_q$, một định lý của Conrad (2004) đảm bảo: mọi symmetric isogeny đều tự động là polarization (nếu nó thỏa ampleness over $\overline{\mathbb{F}}_q$). Hơn nữa, over $\mathbb{F}_q$, mọi symmetric isogeny đều đến từ một $L$ defined over $\mathbb{F}_q$.

### Definition

> [!definition] Definition 35.3 — Degree của Polarization
> **Degree** của polarization $\phi: A \to \widehat{A}$ là $\deg(\phi) = |\ker(\phi)|$ (tính over $\bar{k}$).
>
> Vì $\ker(\phi) = K(L)$ với $L$ ample, ta có $\deg(\phi) = \deg(\phi_L) = \chi(L)^2$ (Euler characteristic bình phương).
>
> Đặc biệt:
> - **Principal polarization**: $\deg(\phi) = 1$ (tức $\phi$ là isomorphism).
> - **Polarization type $(d_1, \ldots, d_g)$**: $\ker(\phi) \cong \prod_{i=1}^g (\mathbb{Z}/d_i\mathbb{Z})^2$ với $d_1 \mid d_2 \mid \cdots \mid d_g$, và $\deg(\phi) = (d_1 \cdots d_g)^2$.

### Theorem

> [!theorem] Theorem 35.4 — Mọi Abelian Variety Đều Có Polarization
> Mọi abelian variety $A$ over $k$ đều có ít nhất một polarization.

**Proof.**
Vì $A$ là complete variety (Theorem 13), $A$ có thể nhúng vào projective space. Cụ thể, tồn tại ample line bundle $L$ trên $A$. Bởi Theorem từ bài 26, $\phi_L: A \to \widehat{A}$ là isogeny (vì $L$ ample). Theo Theorem 34.8, $\phi_L$ symmetric. Do đó $\phi_L$ là polarization. $\blacksquare$

> [!note] Remark 35.5 — Polarization Không Canonical
> Mặc dù polarization luôn tồn tại, **nó không canonical** — tức là abelian variety $A$ có thể có nhiều polarization khác nhau (thậm chí nhiều principal polarization khác nhau). Không gian moduli của abelian varieties "thuần túy" khác với không gian moduli của **polarized** abelian varieties.
>
> Ví dụ: abelian variety $A$ có thể vừa admit principal polarization $\phi_1$, vừa admit polarization khác $\phi_2$ với $\deg(\phi_2) = 4$.

---

## Type Của Polarization

### Definition

> [!definition] Definition 35.6 — Type Của Polarization
> Cho $A$ là abelian variety chiều $g$ và $\phi: A \to \widehat{A}$ là polarization. Vì $K = \ker(\phi)$ là finite abelian group scheme với $K \cong \widehat{K}$ (Cartier self-dual), over $\bar{k}$ ta có:
>
> $$
> K(\bar{k}) \cong \left(\mathbb{Z}/d_1\mathbb{Z} \times \cdots \times \mathbb{Z}/d_g\mathbb{Z}\right)^2
> $$
>
> với $d_1 \mid d_2 \mid \cdots \mid d_g$ là các số nguyên dương. Dãy $(d_1, \ldots, d_g)$ được gọi là **type** (kiểu) của polarization $\phi$.
>
> Degree:
>
> $$
> \deg(\phi) = \left(d_1 d_2 \cdots d_g\right)^2.
> $$
>
> Polarization **principal** khi $(d_1, \ldots, d_g) = (1, 1, \ldots, 1)$.

> [!example] Example 35.7 — Types Trong Nhỏ
> - Chiều $g = 1$ (elliptic curve): type $(d)$, degree $d^2$. Principal khi $d = 1$.
> - Chiều $g = 2$ (abelian surface): type $(d_1, d_2)$ với $d_1 \mid d_2$. Ví dụ: $(1,1)$ là principal, $(1,2)$ là degree $4$, $(2,2)$ là degree $16$.
> - Chiều $g = 3$: type $(d_1, d_2, d_3)$. Jacobian của curve genus 3 có principal polarization $(1,1,1)$.

---

## Ví Dụ Quan Trọng

### Worked Example

> [!example] Example 35.8 — Elliptic Curve: Principal Polarization Canonical
> Cho $E$ là elliptic curve với điểm origin $O \in E(k)$. Xét line bundle:
>
> $$
> L = \mathcal{O}_E(O) \in \operatorname{Pic}(E).
> $$
>
> Line bundle này ample vì $\deg(L) = 1 > 0$ (trên curve, ample = positive degree). Do đó:
>
> $$
> \phi_L = \phi_{\mathcal{O}(O)}: E \xrightarrow{\sim} \widehat{E}
> $$
>
> là **principal polarization** của $E$ (isomorphism vì $\deg(\phi_L) = \chi(L)^2 = 1^2 = 1$).
>
> **Tính cụ thể:** Với $P \in E$:
>
> $$
> \phi_{\mathcal{O}(O)}(P) = [t_P^* \mathcal{O}(O) \otimes \mathcal{O}(-O)] = [\mathcal{O}(P) \otimes \mathcal{O}(-O)] = [\mathcal{O}(P - O)].
> $$
>
> Đây là class của divisor $P - O$ trong $\operatorname{Pic}^0(E) = \widehat{E}$. Vậy $\phi_{\mathcal{O}(O)}(P) = [P - O]$.
>
> **Lưu ý:** Isomorphism $E \xrightarrow{\sim} \widehat{E}$ này **phụ thuộc vào chọn $O$** — nó không canonical. Nếu chọn điểm cơ sở khác $O'$, ta được isomorphism khác $\phi_{\mathcal{O}(O')}: E \xrightarrow{\sim} \widehat{E}$, khác với $\phi_{\mathcal{O}(O)}$ bởi một translation.

### Worked Example

> [!example] Example 35.9 — Product Của Hai Elliptic Curves
> Cho $E_1, E_2$ là hai elliptic curves với principal polarizations $\phi_1: E_1 \xrightarrow{\sim} \widehat{E_1}$ và $\phi_2: E_2 \xrightarrow{\sim} \widehat{E_2}$. Xét abelian variety:
>
> $$
> A = E_1 \times E_2 \quad (\text{chiều } g = 2).
> $$
>
> Khi đó $\widehat{A} = \widehat{E_1} \times \widehat{E_2}$, và map:
>
> $$
> \phi_1 \times \phi_2: E_1 \times E_2 \xrightarrow{\sim} \widehat{E_1} \times \widehat{E_2} = \widehat{A}
> $$
>
> là một **principal polarization** của $A$.
>
> Tuy nhiên, $A = E_1 \times E_2$ thường còn có các polarization khác không phải dạng product! Ví dụ nếu $E_1 \cong E_2$ thì $A$ có nhiều principal polarization hơn.

### Worked Example

> [!example] Example 35.10 — Polarization Degree 4 Trên Elliptic Curve
> Cho $E$ là elliptic curve. Với $n = 2$, line bundle $L_2 = \mathcal{O}(2 \cdot O)$ có $\deg(L_2) = 2$, nên $\phi_{L_2}: E \to \widehat{E}$ là isogeny với:
>
> $$
> \deg(\phi_{L_2}) = \chi(L_2)^2 = 2^2 = 4.
> $$
>
> Kernel: $\ker(\phi_{L_2}) = E[2]$ (nhóm 2-torsion). Vì $|E[2]| = 4$ khi $\operatorname{char}(k) \neq 2$, đây là polarization type $(2)$ của $E$.
>
> Tổng quát: $\phi_{\mathcal{O}(n \cdot O)}: E \to \widehat{E}$ là polarization type $(n)$, degree $n^2$, với $\ker = E[n]$.

### Worked Example

> [!example] Example 35.11 — Không Phải Mọi Symmetric Isogeny Là Polarization
> Xét $A = E \times E$ với $E$ elliptic curve. Map:
>
> $$
> f: E \times E \to \widehat{E \times E} = \widehat{E} \times \widehat{E}, \quad f = \phi_1 \times (-\phi_1),
> $$
>
> trong đó $\phi_1: E \to \widehat{E}$ là principal polarization. Map $f$ là symmetric isogeny nhưng **không** là polarization vì nó không "ample" — thành phần $-\phi_1$ tương ứng với $\phi_{L^{-1}}$ với $L^{-1}$ là **anti-ample** (không ample). Điều kiện ampleness trong definition 35.1 là thực sự cần thiết.

---

## Tính Không Canonical Của Polarization

### Note

> [!note] Remark 35.12 — Hai Abelian Varieties Isomorphic Có Thể Không Isomorphic Như ppav
> Tính không canonical của polarization có hệ quả quan trọng cho không gian moduli:
>
> Hai abelian varieties $A$ và $B$ có thể isomorphic (như abelian varieties) nhưng **không** isomorphic như principally polarized abelian varieties. Nghĩa là: có isomorphism $f: A \xrightarrow{\sim} B$ nhưng không có isomorphism $g: A \xrightarrow{\sim} B$ sao cho $\phi_B \circ g = \widehat{g}^{-1} \circ \phi_A$.
>
> Đây là lý do tại sao không gian moduli $\mathcal{A}_g$ (của ppav) có dimension $g(g+1)/2$ — nhỏ hơn dimension của không gian moduli "thô" của abelian varieties. Chọn polarization tạo thêm ràng buộc.

---

## Đặc Trưng Thay Thế Của Polarization

### Theorem

> [!theorem] Theorem 35.13 — Ampleness Của Pullback Poincaré Bundle
> Một symmetric isogeny $\phi: A \to \widehat{A}$ là polarization khi và chỉ khi line bundle
>
> $$
> (1_A, \phi)^* \mathcal{P} \in \operatorname{Pic}(A)
> $$
>
> là **ample** (sau khi base change tới $\bar{k}$). Ở đây $(1_A, \phi): A \to A \times \widehat{A}$ là map $a \mapsto (a, \phi(a))$.

**Proof sketch.** Đây là cách nói lại định nghĩa: $\phi = \phi_L$ với $L = (1_A, \phi)^*\mathcal{P}$. Điều kiện ampleness của $L$ tương đương với $\phi$ là "ample" theo nghĩa trên. $\blacksquare$

> [!note] Remark 35.14 — Ý Nghĩa Của Pullback Poincaré Bundle
> Line bundle $(1, \phi)^*\mathcal{P}$ trên $A$ được gọi là **line bundle tương ứng với $\phi$**. Đây là cách chuyển một isogeny $\phi: A \to \widehat{A}$ thành một line bundle trên $A$. Khi $\phi$ là principal polarization, $(1, \phi)^*\mathcal{P}$ là ample với $\chi = 1$ — đây là đặc trưng đặc biệt của ppav.

---

## Phân Biệt Polarization Và Line Bundle

### Note

> [!note] Remark 35.15 — Polarization ≠ Line Bundle
> Có sự khác biệt tinh tế quan trọng:
>
> - **Line bundle** $L$ trên $A$ xác định một morphism $\phi_L: A \to \widehat{A}$.
> - **Polarization** là morphism $\phi: A \to \widehat{A}$ có tính symmetric và ampleness.
>
> Vì $\phi_L = \phi_{L \otimes M}$ với $M \in \operatorname{Pic}^0(A)$, nhiều line bundles khác nhau cho cùng một polarization. Cụ thể, $\phi_L$ chỉ phụ thuộc vào class $[L] \in \operatorname{NS}(A) = \operatorname{Pic}(A)/\operatorname{Pic}^0(A)$ (Néron-Severi group).
>
> Như vậy, polarization tương ứng với một class ample trong $\operatorname{NS}(A)$, không phải một line bundle cụ thể. Đây là lý do tại sao người ta thường nói "polarization of type $(d_1, \ldots, d_g)$" — type xác định isogeny, không phải line bundle.

---

## SageMath Cheatsheet

```sage
# Elliptic curve over finite field
p = 1009
E = EllipticCurve(GF(p), [-1, 1])  # y^2 = x^3 - x + 1

# Principal polarization: phi: E -> E_hat ~ E
# Thể hiện qua: phi(P) = [P - O] trong Pic^0(E)
O = E(0)  # identity element (point at infinity)
P = E.random_point()
print(f"P = {P}")
# phi(P) = class of divisor P - O = P (vì O = 0 trong Pic^0)

# Degree of [n]: E -> E (polarization type (n))
n = 3
# Số điểm trong E[n] = kernel of [n]
print(f"|E[{n}]| = {n}^2 = {n**2} (over algebraic closure)")

# Type of polarization phi_{O(n.O)}: type (n), degree n^2
print(f"Polarization type ({n}), degree {n}**2 = {n**2}")

# Abelian surface: product E1 x E2
p2 = 997
E1 = EllipticCurve(GF(p2), [0, 1])
E2 = EllipticCurve(GF(p2), [1, 0])
print(f"|E1(F_p)| = {E1.cardinality()}")
print(f"|E2(F_p)| = {E2.cardinality()}")
# Product A = E1 x E2: principal polarization phi1 x phi2
# dim A = 2, type (1,1)
```

---

## Summary / Key Takeaways

- **Polarization** $\phi: A \to \widehat{A}$ là symmetric isogeny thỏa điều kiện ampleness: tồn tại ample $L$ over $\bar{k}$ sao cho $\phi_{\bar{k}} = \phi_L$.
- **Principal polarization**: degree 1 (isomorphism $A \xrightarrow{\sim} \widehat{A}$). Đây là trường hợp đẹp nhất.
- **Type** $(d_1, \ldots, d_g)$ với $d_i | d_{i+1}$: $\ker(\phi) \cong \prod (\mathbb{Z}/d_i)^2$, degree $= (d_1 \cdots d_g)^2$.
- **Mọi AV có polarization** vì AV projective → có ample $L$ → $\phi_L$ là polarization.
- **Polarization không canonical**: một AV có thể có nhiều polarizations. Chọn polarization là dữ liệu thêm.
- **Ví dụ cơ bản**: $E$ elliptic curve: $\phi_{\mathcal{O}(O)}: E \xrightarrow{\sim} \widehat{E}$ là principal polarization; $\phi_{\mathcal{O}(nO)}: E \to \widehat{E}$ là polarization type $(n)$, degree $n^2$.
- **Polarization khác line bundle**: $\phi_L$ chỉ phụ thuộc vào class của $L$ trong $\operatorname{NS}(A)$.

---

## References

- Mumford, D. *Abelian Varieties*, Chapter III, §20–23. (Polarizations, ampleness, degree.)
- Milne, J.S. *Abelian Varieties*, §10–11. (Polarizations, ppav, moduli.)
- Conrad, B. *Polarizations*, VIGRE lecture notes (Stanford, 2004). (Precise definitions, finite field case.)
- Birkenhake & Lange, *Complex Abelian Varieties*, Chapter 4. (Polarizations analytically.)
- Debarre, O. *Higher-Dimensional Algebraic Geometry*, Chapter 7. (Polarized abelian varieties.)
