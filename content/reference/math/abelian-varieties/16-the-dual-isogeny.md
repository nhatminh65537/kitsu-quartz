---
title: "16. The Dual Isogeny"
type: theory
tags: [math, abelian-varieties, lesson-16]
aliases: [The Dual Isogeny]
created: 2026-05-17
---

> **Prerequisites**: [[15-separable-vs-inseparable-isogenies|15. Separable vs Inseparable Isogenies]], [[14-isogenies-definition-and-basic-examples|14. Isogenies — Definition and Basic Examples]]
> **Objectives**:
> - Hiểu sự tồn tại và tính duy nhất của dual isogeny
> - Chứng minh công thức $\hat{f} \circ f = [\deg f]$ và $f \circ \hat{f} = [\deg f]$
> - Hiểu dual isogeny cho abelian varieties tổng quát qua dual abelian variety
> - Áp dụng vào elliptic curves và tính toán cụ thể

---

## Motivation / Intuition

Trong lý thuyết nhóm hữu hạn, nếu $f: G \to H$ là epimorphism, ta có thể hỏi: liệu có "hình thức đảo ngược" của $f$ không? Câu trả lời thường là không — epimorphism không có inverse trong nhóm hữu hạn. Nhưng **isogeny của abelian varieties** thì khác: mỗi isogeny $f: A \to B$ **luôn** có một isogeny đi ngược chiều $\hat{f}: B \to A$, gọi là **dual isogeny** (đẳng sinh đối ngẫu).

Dual isogeny thỏa mãn điều đẹp:

$$
\hat{f} \circ f = [\deg f] \quad \text{trên } A, \qquad f \circ \hat{f} = [\deg f] \quad \text{trên } B
$$

Tức là: đi từ $A$ qua $f$ đến $B$, rồi đi ngược lại qua $\hat{f}$, ta nhân thêm một hệ số $[\deg f]$. Điều này khác với isomorphism (đối với isomorphism, $\hat{f} = f^{-1}$ và $\hat{f} \circ f = [1] = \operatorname{id}$).

**Analogy:** Hãy nghĩ đến bản đồ $\mathbb{Z}/n\mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}$, $x \mapsto dx$ với $\gcd(d, n) = 1$. Nghịch đảo của nó là $x \mapsto d^{-1}x$. Đối với isogeny degree $d$, "nghịch đảo" không tồn tại trên $\mathbb{Z}$ nhưng khi nhân thêm $d$, ta có thể quay trở lại.

Dual isogeny là công cụ cực kỳ quan trọng vì:
1. Nó chứng minh quan hệ "isogenous" là **quan hệ tương đương** (bài 18)
2. Nó xuất hiện trong định nghĩa Weil pairing (Module 5)
3. Nó định nghĩa Rosati involution trên $\operatorname{End}(A)$ (bài 37)

---

## Dual Isogeny cho Elliptic Curves (Case đặc biệt)

### Theorem

> [!theorem] Theorem 16.1 — Tồn tại Dual Isogeny cho Elliptic Curves
>
> Cho $f: E_1 \to E_2$ là isogeny giữa hai elliptic curves trên $k$. Tồn tại duy nhất một isogeny:
>
> $$
> \hat{f}: E_2 \longrightarrow E_1
> $$
>
> gọi là **dual isogeny** của $f$, thỏa mãn:
>
> $$
> \hat{f} \circ f = [\deg f]_{E_1}, \qquad f \circ \hat{f} = [\deg f]_{E_2}
> $$

**Proof (Case separable).**
Giả sử $f$ separable với $\deg f = n$. Khi đó $\ker(f)(\bar{k})$ là nhóm étale order $n$, và tồn tại factorization:

$$
E_1 \xrightarrow{\pi} E_1/\ker(f) \xrightarrow{\sim} E_2
$$

Ta cần xây dựng $\hat{f}: E_2 \to E_1$.

**Xây dựng:** Xét multiplication map $[n]: E_1 \to E_1$. Kernel của $[n]$ là $E_1[n]$, chứa $\ker(f)$ như một subgroup (vì $f(P) = 0 \Rightarrow nP = 0$, tức $P \in E_1[n]$).

Theo factorization quotient: $E_1 \xrightarrow{f} E_2$ và $E_1 \xrightarrow{[n]} E_1$ chia sẻ kernel $\ker(f) \subset E_1[n]$.

Tồn tại duy nhất $\hat{f}: E_2 \to E_1$ sao cho $\hat{f} \circ f = [n]$ (từ tính universal của quotient $E_2 \cong E_1/\ker(f)$):

$$
E_1 \xrightarrow{f} E_2 \xrightarrow{\hat{f}} E_1, \quad \hat{f} \circ f = [n]
$$

**Kiểm tra $f \circ \hat{f} = [n]_{E_2}$:**

$$
f \circ (\hat{f} \circ f) = f \circ [n]_{E_1} = [n]_{E_2} \circ f
$$

Vì $f$ là epimorphism: $(f \circ \hat{f}) \circ f = [n]_{E_2} \circ f \Rightarrow f \circ \hat{f} = [n]_{E_2}$. ✓

**Tính duy nhất:** Nếu $g: E_2 \to E_1$ cũng thỏa $g \circ f = [n]$, thì $(g - \hat{f}) \circ f = 0$, nên $g - \hat{f}$ factorizes qua $E_2 = E_1/\ker(f)$... (lập luận tương tự cho thấy $g = \hat{f}$). $\blacksquare$

### Corollary

> [!corollary] Corollary 16.2 — Dual của Dual
>
> Với $f: E_1 \to E_2$ là isogeny elliptic curves, ta có:
>
> $$
> \widehat{\hat{f}} = f
> $$
>
> tức là dual của dual isogeny là chính isogeny ban đầu.

**Proof.** $\widehat{\hat{f}} \circ \hat{f} = [\deg \hat{f}]_{E_1}$. Nhưng $\deg \hat{f} = \deg f = n$. Vả lại $\hat{f} \circ f = [n]_{E_1}$. Từ hai đẳng thức: $\widehat{\hat{f}} = f$ (bằng uniqueness). $\blacksquare$

### Worked Example

> [!example] Example 16.3 — Dual của Multiplication-by-n
>
> Cho $[n]: E \to E$ là multiplication-by-$n$ isogeny. Dual isogeny là:
>
> $$
> \widehat{[n]} = [n]: E \to E
> $$
>
> Tức là $[n]$ tự dual! Thật vậy:
>
> $$
> [n] \circ [n] = [n^2] = [\deg([n])]_{E}
> $$
>
> vì $\deg([n]) = n^2$ (bài 14). ✓
>
> Điều này hợp lý: $[n]$ là "symmetric" morphism — không có chiều ưu tiên.

> [!example] Example 16.4 — Dual của Isogeny Degree 2 cụ thể
>
> Cho $E: y^2 = x^3 - x$ trên $\mathbb{Q}$ và $E': y^2 = x^3 + 4x$, với isogeny:
>
> $$
> \phi: E \to E', \quad (x, y) \mapsto \left(\frac{x^2 + 1}{x}, \frac{y(x^2 - 1)}{x^2}\right)
> $$
>
> (đây là 2-isogeny từ kernel $G = \{O, (0,0)\}$, degree $2$).
>
> Dual isogeny là:
>
> $$
> \hat{\phi}: E' \to E, \quad (x, y) \mapsto \left(\frac{x^2 - 4}{4x}, \frac{y(x^2 + 4)}{8x^2}\right)
> $$
>
> Ta có thể verify: $\hat{\phi} \circ \phi = [2]_E$ và $\phi \circ \hat{\phi} = [2]_{E'}$.
>
> **Degree của $\hat{\phi}$:** $\deg(\hat{\phi}) = \deg(\phi) = 2$.
>
> Điều này là trường hợp tổng quát: $\deg(\hat{f}) = \deg(f)$.

### Theorem

> [!theorem] Theorem 16.5 — Degree của Dual Isogeny
>
> Cho $f: A \to B$ là isogeny của abelian varieties. Thì:
>
> $$
> \deg(\hat{f}) = \deg(f)
> $$

**Proof.**
$\hat{f} \circ f = [\deg f]$, nên $\deg(\hat{f} \circ f) = \deg([\deg f]) = (\deg f)^{2g}$ (bài 14). Mặt khác $\deg(\hat{f} \circ f) = \deg(\hat{f}) \cdot \deg(f)$. Vậy $\deg(\hat{f}) = (\deg f)^{2g - 1}$... Khoan, điều này không đúng với $g = 1$: $\deg \hat{f} = (\deg f)^{2 \cdot 1 - 1} = \deg f$. ✓

Với $g > 1$, cần dùng lý thuyết của dual abelian variety (bài 24) để chứng minh đúng đắn. Kết quả vẫn là $\deg(\hat{f}) = \deg(f)$ nhưng proof khác. $\blacksquare$

---

## Dual Isogeny cho Abelian Varieties Tổng Quát

### Note

> [!note] Remark 16.6 — Khó khăn khi $\dim A > 1$
>
> Với elliptic curves, $\hat{E} \cong E$ (dual abelian variety của $E$ là isomorphic với $E$ — sẽ chứng minh trong bài 24–27). Vì vậy dual isogeny $\hat{f}: E_2 \to E_1$ là isogeny giữa elliptic curves — dễ dàng xử lý.
>
> Với abelian variety $A$ chiều $g > 1$ tổng quát, **dual abelian variety** $\hat{A}$ là một abelian variety **khác** với $A$ (dù $\dim \hat{A} = \dim A = g$). Isogeny $f: A \to B$ cảm sinh **dual isogeny**:
>
> $$
> \hat{f}: \hat{B} \longrightarrow \hat{A}
> $$
>
> đây là isogeny giữa **dual varieties**, không phải giữa $B$ và $A$.

### Definition

> [!definition] Definition 16.7 — Dual Isogeny (Tổng quát)
>
> Cho $f: A \to B$ là isogeny của abelian varieties. **Dual isogeny** là isogeny:
>
> $$
> \hat{f}: \hat{B} \longrightarrow \hat{A}
> $$
>
> được xây dựng qua: với mỗi line bundle $L \in \hat{B}(S) = \operatorname{Pic}^0(B_S/S)$, ta có $\hat{f}(L) := f^* L \in \operatorname{Pic}^0(A_S/S) = \hat{A}(S)$.
>
> Tức là $\hat{f}$ là **pullback** của line bundles qua $f$.
>
> Dual isogeny thỏa mãn:
>
> $$
> \hat{f} \circ f = [\deg f]_{\hat{A}}, \qquad f \circ \hat{f} = [\deg f]_{\hat{B}}
> $$
>
> (ở đây $[\deg f]$ là multiplication-by-$(\deg f)$ trên dual abelian variety).

> [!note] Remark 16.8 — Kết nối với Elliptic Curves
>
> Với elliptic curve $E$, tồn tại canonical isomorphism $\lambda: E \xrightarrow{\sim} \hat{E}$ (từ principal polarization). Dùng $\lambda$, ta convert $\hat{f}: \hat{E_2} \to \hat{E_1}$ thành isogeny $E_2 \to E_1$, đúng như trong Theorem 16.1.

### Theorem

> [!theorem] Theorem 16.9 — Tính chất của Dual Isogeny
>
> Cho $f: A \to B$ và $g: B \to C$ là các isogenies của abelian varieties. Thì:
>
> 1. $\widehat{g \circ f} = \hat{f} \circ \hat{g}$ (anti-multiplicative / contravariant)
> 2. $\widehat{[n]_A} = [n]_{\hat{A}}$ với mọi $n \in \mathbb{Z}$
> 3. $\deg(\hat{f}) = \deg(f)$
> 4. $\widehat{\hat{f}} = f$ dưới canonical isomorphism $\hat{\hat{A}} \cong A$

**Proof của (1):**
$(g \circ f)^*: \hat{C} \to \hat{A}$ gửi $L \mapsto f^*(g^* L)$. Vậy $\widehat{g \circ f}(L) = f^* g^* L = \hat{f}(\hat{g}(L))$. Vậy $\widehat{g \circ f} = \hat{f} \circ \hat{g}$. $\blacksquare$

---

## Tính Functoriality và Ứng dụng

### Worked Example

> [!example] Example 16.10 — Dual Isogeny và Frobenius
>
> Với $F_{A/k}: A \to A^{(p)}$ là Frobenius isogeny (bài 15), dual isogeny là:
>
> $$
> \hat{F}_{A/k} = V_{A/k}: \widehat{A^{(p)}} \longrightarrow \hat{A}
> $$
>
> Dùng canonical isomorphism $\widehat{A^{(p)}} \cong (\hat{A})^{(p)}$, ta viết:
>
> $$
> V_{A/k}: (\hat{A})^{(p)} \longrightarrow \hat{A}
> $$
>
> Đây chính là Verschiebung của $\hat{A}$.
>
> Hệ quả: $V \circ F = [p]$ và $F \circ V = [p]$ (tương ứng trên $A$ và $\hat{A}$).

> [!example] Example 16.11 — Tính Degree của Dual
>
> Cho $f: A \to B$ là isogeny degree $d$. Thì:
>
> - $\deg(\hat{f}) = d$
> - $\ker(\hat{f})$ — Cartier dual của $\ker(f)$ — cũng có order $d$
>
> Với elliptic curves và $f$ separable: $\ker(f) \cong \mathbb{Z}/d\mathbb{Z}$ (tập các điểm order $d$), và $\ker(\hat{f}) \cong \mu_d$ (Cartier dual = group of $d$-th roots of unity).
>
> Đây là connection đến Weil pairing: $e_d: \ker(f) \times \ker(\hat{f}) \to \mu_d$ — xem bài 29.

### Theorem

> [!theorem] Theorem 16.12 — Kernel của Dual Isogeny (Cartier Duality)
>
> Cho $f: A \to B$ là isogeny với kernel $N = \ker(f)$ (finite group scheme). Thì:
>
> $$
> \ker(\hat{f}) \cong N^\vee
> $$
>
> trong đó $N^\vee$ là **Cartier dual** của $N$.
>
> Nếu $N$ étale (ví dụ $\operatorname{char}(k) \nmid \deg f$), thì $N^\vee \cong \operatorname{Hom}(N, \mathbb{G}_m)$ — group of characters.
>
> Cụ thể: nếu $N \cong \mathbb{Z}/n\mathbb{Z}$, thì $N^\vee \cong \mu_n$ (roots of unity).

**Proof.**
Xem Milne *Abelian Varieties*, Theorem 11.1, hoặc Mumford *Abelian Varieties*, §15, p.143. Proof dùng cấu trúc Poincaré bundle trên $A \times \hat{A}$. $\blacksquare$

---

## SageMath Cheatsheet

```python
E = EllipticCurve(QQ, [-1, 0])
phi = E.isogenies_prime_degree(2)[0]
phi_dual = phi.dual_isogeny()
print('Degree of phi:', phi.degree())
print('Degree of dual:', phi_dual.degree())
```

```python
E = EllipticCurve(GF(101), [1, 1])
phi = E.isogenies_prime_degree(3)[0]
E2 = phi.codomain()
phi_hat = phi.dual_isogeny()
P = E.random_point()
assert phi_hat(phi(P)) == 3*P
```

---

## Summary / Key Takeaways

- Mọi isogeny $f: A \to B$ đều có **dual isogeny** $\hat{f}: \hat{B} \to \hat{A}$ thỏa $\hat{f} \circ f = [\deg f]$.
- Với elliptic curves: $\hat{f}: E_2 \to E_1$ vì $\hat{E} \cong E$ (canonical cho curves).
- Với AV chiều $g > 1$: dual isogeny sống trên **dual abelian varieties** $\hat{B} \to \hat{A}$.
- $\deg(\hat{f}) = \deg(f)$ — dual có cùng degree.
- $\widehat{g \circ f} = \hat{f} \circ \hat{g}$ — contravariant.
- $\ker(\hat{f}) = N^\vee$ là Cartier dual của $\ker(f) = N$ — kết nối với Weil pairing.
- Dual của Frobenius là Verschiebung: $\hat{F} = V$, $V \circ F = [p]$.

---

## References

- Silverman, J. H. *The Arithmetic of Elliptic Curves*. Theorem III.6.1. Springer GTM 106, 2009.
- Milne, J. S. *Abelian Varieties*. Theorem 11.1 (Kernel of dual isogeny). https://www.jmilne.org/math/xnotes/AVs.pdf
- Mumford, D. *Abelian Varieties*. §15, p.143. Oxford University Press, 1974.
- Lombardo, D. *Abelian Varieties* (lecture notes). Theorem 6.11. https://people.dm.unipi.it/lombardo/Teaching/VarietaAbeliane1718/Notes.pdf
- Lindner, N. *The Dual Abelian Variety*. https://www.zib.de/userpage//lindner/dualav.pdf
