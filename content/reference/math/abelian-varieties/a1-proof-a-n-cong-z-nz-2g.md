---
title: "A1. Proof: A[n] ≅ (ℤ/nℤ)^{2g}"
type: appendix
tags: [math, abelian-varieties, appendix, n-torsion]
aliases: [Proof A[n] isomorphic (Z/nZ)^2g]
created: 2026-05-18
---

> Bài học liên quan: [[17-n-torsion-points|17. n-Torsion Points A[n]]]

## Motivation

Một trong những kết quả nền tảng nhất về cấu trúc của abelian varieties là: **nhóm $n$-torsion $A[n]$ của một abelian variety $A$ chiều $g$ trên algebraically closed field $k$ đồng cấu với $(\mathbb{Z}/n\mathbb{Z})^{2g}$**, miễn là $\gcd(n, \operatorname{char}(k)) = 1$.

Đây là sự mở rộng trực tiếp của kết quả quen thuộc cho elliptic curves: $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ (trường hợp $g = 1$). Kết quả này:

1. Cho thấy $A[n]$ có đúng $n^{2g}$ phần tử (trên $k = \bar{k}$).
2. Là nền tảng để định nghĩa Tate module $T_\ell(A) = \varprojlim A[\ell^n] \cong \mathbb{Z}_\ell^{2g}$.
3. Giải thích tại sao Weil pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$ là non-degenerate (vì domain và codomain có cùng "kích thước").

---

## Cấu trúc Nhóm $A[n]$

### Bước 1: $[n]: A \to A$ là Separable Isogeny khi $\gcd(n, \text{char}) = 1$

> [!theorem] Theorem A1.1 — $[n]$ là Separable khi $\gcd(n, p) = 1$
> Cho $A/k$ abelian variety chiều $g$, $p = \operatorname{char}(k) \geq 0$. Nếu $\gcd(n, p) = 1$, thì $[n]: A \to A$ là separable isogeny với $\deg([n]) = n^{2g}$.

**Proof.**

**Phần 1: $[n]$ là isogeny (surjective homomorphism với finite kernel).**

Ta cần chứng minh $[n]$ là surjective, tức là mọi điểm $P \in A(k)$ có thể viết là $[n](Q) = Q + Q + \cdots + Q$ ($n$ lần) với $Q \in A(\bar{k})$.

Xét $f: A \to A$ định nghĩa bởi $f(Q) = [n](Q) - P = nQ - P$. Đây là morphism giữa hai complete varieties. Vì $A$ là projective, $f(A)$ là closed và complete, nhưng cũng là non-empty (nó chứa $f(0) = -P$). Lý luận về dimension: $f$ là dominant vì nó là translation của isogeny. Thực ra, phần "surjectivity" đòi hỏi chứng minh kỹ hơn sử dụng Theorem of the Cube hoặc ample line bundles, ta sẽ accept nó ở đây.

**Phần 2: $\deg([n]) = n^{2g}$.**

Chứng minh bằng tính giao của divisors (intersection theory). Cho $L$ là ample line bundle trên $A$. Bởi **Theorem of the Square** (Bài 12), ta có:

$$
[n]^* L \cong L^{\otimes \frac{n(n+1)}{2}} \otimes [-1]^* L^{\otimes \frac{n(n-1)}{2}}
$$

Khi $L$ là symmetric ($[-1]^* L \cong L$), điều này cho $[n]^* L \cong L^{\otimes n^2}$.

Degree của isogeny $f: A \to A$ thỏa mãn $\deg(f) \cdot (c_1(L)^g) = (c_1(f^*L)^g)$ (intersection số). Với $f = [n]$:

$$
\deg([n]) \cdot (c_1(L)^g) = (c_1(L^{n^2})^g) = n^{2g} \cdot (c_1(L)^g)
$$

Vì $(c_1(L)^g) > 0$ (do $L$ ample), ta được $\deg([n]) = n^{2g}$.

**Phần 3: Separability.**

$[n]$ là separable khi và chỉ khi differential $d[n]: T_0 A \to T_0 A$ là injective (equivalently, bijective vì domain và target có cùng dimension). Trên tangent space $T_0 A$, phép $[n]$ tác động như nhân vô hướng với $n$. Vì $\gcd(n, p) = 1$, phép nhân với $n$ là automorphism của $T_0 A$ (một $k$-vector space), nên $d[n]$ là isomorphism, tức $[n]$ separable. $\blacksquare$

---

### Bước 2: Kernel của Separable Isogeny là Étale

> [!theorem] Theorem A1.2 — Kernel Separable Isogeny
> Nếu $f: A \to B$ là separable isogeny với $\deg(f) = d$, thì $\ker(f)$ là finite étale group scheme (flat group scheme of rank $d$) và $|\ker(f)(\bar{k})| = d$.

**Proof sketch.**

Vì $f$ là separable, nó là flat. Vì $\ker(f) = f^{-1}(0_B)$ là fiber của flat morphism qua điểm đóng, $\ker(f)$ là flat group scheme. Degree $d = \deg(f)$ là rank của $\mathcal{O}_{\ker(f)}$ như $\mathcal{O}_{0_B}$-module.

Flatness + separability ⟹ $\ker(f)$ là étale. Trên algebraically closed field $k = \bar{k}$, finite étale group schemes tương ứng bijection với finite groups, và $|\ker(f)(k)| = \operatorname{rank} = d$. $\blacksquare$

---

### Bước 3: Cấu Trúc Nhóm

> [!theorem] Theorem A1.3 — $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$
> Cho $A/k$ abelian variety chiều $g$, $k$ algebraically closed, $\gcd(n, \operatorname{char}(k)) = 1$. Thì:
>
> $$
> A[n](k) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
> $$

**Proof.**

**Chiến lược:** Phân tích theo factors nguyên tố, rồi dùng induction trên lũy thừa.

**Bước A: Trường hợp $n = \ell$ nguyên tố.**

Từ Theorem A1.1 và A1.2: $A[\ell]$ là finite abelian group của order $\ell^{2g}$. Ta cần chứng minh mọi phần tử đều có order $\ell$, tức $A[\ell] \cong (\mathbb{Z}/\ell\mathbb{Z})^{2g}$.

**Phương pháp 1 (thông qua dual isogeny):**

Ta có dual isogeny $\widehat{[\ell]}: \hat{A} \to \hat{A}$ với $\widehat{[\ell]} \circ [\ell] = [\ell^{2g}] = [\ell]^{2g}$ (degree của $[\ell]$). Điều này buộc cấu trúc nhóm phải compatible với Weil pairing (sẽ nói thêm ở A2).

**Phương pháp 2 (trực tiếp, bằng Tate module):**

Xét inverse system:

$$
\cdots \xrightarrow{[\ell]} A[\ell^3] \xrightarrow{[\ell]} A[\ell^2] \xrightarrow{[\ell]} A[\ell]
$$

và Tate module $T_\ell(A) = \varprojlim A[\ell^n]$.

Ta đã biết $T_\ell(A)$ là free $\mathbb{Z}_\ell$-module (đây là một thực tế cần proof riêng, xem bên dưới). Rank của nó là $2g$ (vì $|A[\ell^n]| = \ell^{2gn}$ với mọi $n$). Từ đó:

$$
A[\ell^n] \cong T_\ell(A) / \ell^n T_\ell(A) \cong (\mathbb{Z}/\ell^n\mathbb{Z})^{2g}
$$

**Bước B: $T_\ell(A)$ là free $\mathbb{Z}_\ell$-module rank $2g$.**

$T_\ell(A)$ là finitely generated $\mathbb{Z}_\ell$-module (vì $A[\ell]$ là finite, và $T_\ell(A)/\ell^n T_\ell(A) = A[\ell^n]$ là finite với $|A[\ell^n]| = \ell^{2gn}$). Theo classification của finitely generated modules over PID $\mathbb{Z}_\ell$:

$$
T_\ell(A) \cong \mathbb{Z}_\ell^r \oplus \bigoplus_i \mathbb{Z}/\ell^{n_i}\mathbb{Z}
$$

Nhưng $T_\ell(A)$ là torsion-free! (Nếu $\ell^m \cdot (P_n)_{n \geq 0} = 0$ trong $T_\ell(A)$, thì $\ell^m P_m = 0$ trong $A[\ell^m]$, tức $P_m \in A[\ell^m][\ell^m] = \{0\}$, tức $P_m = 0$, kéo theo $(P_n) = 0$.) Vì torsion-free finitely generated $\mathbb{Z}_\ell$-module là free, $T_\ell(A) \cong \mathbb{Z}_\ell^r$.

Rank $r = 2g$: vì $T_\ell(A) \otimes_{\mathbb{Z}_\ell} \mathbb{F}_\ell = A[\ell]$ và $|A[\ell]| = \ell^{2g}$, ta có $r = 2g$.

**Bước C: Trường hợp $n$ tổng quát.**

Viết $n = \prod_i \ell_i^{e_i}$ (phân tích nguyên tố). Theo Chinese Remainder Theorem:

$$
A[n] \cong \bigoplus_i A[\ell_i^{e_i}] \cong \bigoplus_i (\mathbb{Z}/\ell_i^{e_i}\mathbb{Z})^{2g} \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
$$

Đẳng cấu cuối dùng CRT cho vành: $\mathbb{Z}/n\mathbb{Z} \cong \bigoplus_i \mathbb{Z}/\ell_i^{e_i}\mathbb{Z}$. $\blacksquare$

---

## Trường hợp $\gcd(n, p) \neq 1$: Điều gì Xảy ra?

Khi $\operatorname{char}(k) = p > 0$ và $p \mid n$, kết quả thay đổi:

> [!note] Remark A1.4 — $A[p^n]$ trong characteristic $p$
> Khi $\operatorname{char}(k) = p$:
> - $[p]: A \to A$ **không separable** (differential $d[p] = p \cdot \operatorname{id} = 0$).
> - $A[p]$ là finite group scheme có rank $p^{2g}$ nhưng **không étale**.
> - Số điểm $|A[p](\bar{k})|$ có thể là bất cứ giá trị nào từ $1$ đến $p^g$ (phụ thuộc vào **$p$-rank** của $A$).

Cụ thể, $A[p](\bar{k}) \cong (\mathbb{Z}/p\mathbb{Z})^f$ với $0 \leq f \leq g$ — giá trị $f$ được gọi là **$p$-rank** của $A$.

- Nếu $f = g$: $A$ là **ordinary** (thông thường).
- Nếu $f = 0$: $A$ là **supersingular** (siêu kỳ lạ).

> [!example] Example A1.5 — Elliptic Curves ($g = 1$)
> Với elliptic curve $E/\mathbb{F}_p$:
> - Nếu $E$ là ordinary: $E[p](\bar{k}) \cong \mathbb{Z}/p\mathbb{Z}$ (một copy duy nhất).
> - Nếu $E$ là supersingular: $E[p](\bar{k}) = \{O\}$ (chỉ điểm đơn vị; $p$-rank = 0).
>
> Ví dụ: $E: y^2 = x^3 - x$ trên $\mathbb{F}_p$ với $p \equiv 3 \pmod{4}$ là supersingular.

---

## Ví dụ Tính Toán Cụ Thể

> [!example] Example A1.6 — $E[3]$ cho $E: y^2 = x^3 - x$ trên $\mathbb{C}$
>
> Với $n = 3$ và $g = 1$ ($\gcd(3, 0) = 1$ vì $\operatorname{char}(\mathbb{C}) = 0$):
>
> $$
> E[3] \cong (\mathbb{Z}/3\mathbb{Z})^2
> $$
>
> Tức là có $3^2 = 9$ điểm 3-torsion. Trong tọa độ cụ thể trên $E(\mathbb{C})$:
>
> Ta có lattice $\Lambda = \mathbb{Z} + \tau\mathbb{Z}$ với $\tau \in \mathbb{H}$. Khi đó $E(\mathbb{C}) \cong \mathbb{C}/\Lambda$ và:
>
> $$
> E[3](\mathbb{C}) = \left\{\frac{a + b\tau}{3} + \Lambda : a, b \in \{0, 1, 2\}\right\} \cong \frac{1}{3}\Lambda/\Lambda \cong (\mathbb{Z}/3\mathbb{Z})^2
> $$

> [!example] Example A1.7 — Jacobian $J(C)$ với $g = 2$
>
> Cho $C: y^2 = x^5 - x$ (hyperelliptic curve genus 2 trên $\mathbb{Q}$). Jacobian $J = J(C)$ là abelian variety chiều 2. Khi đó $J[3](\mathbb{C}) \cong (\mathbb{Z}/3\mathbb{Z})^4$, tức là có $3^4 = 81$ điểm 3-torsion.

---

## Hậu quả: Tate Module

Kết quả $A[\ell^n] \cong (\mathbb{Z}/\ell^n\mathbb{Z})^{2g}$ cho phép ta xây dựng:

$$
T_\ell(A) = \varprojlim A[\ell^n] \cong \mathbb{Z}_\ell^{2g}
$$

như một **free $\mathbb{Z}_\ell$-module rank $2g$**. Galois group $\operatorname{Gal}(\bar{k}/k)$ tác động tuyến tính lên $T_\ell(A)$, cho một **$\ell$-adic Galois representation**:

$$
\rho_{A, \ell}: \operatorname{Gal}(\bar{k}/k) \to \operatorname{GL}_{2g}(\mathbb{Z}_\ell)
$$

Đây là công cụ trung tâm của số học hiện đại.

---

## Summary

- $[n]: A \to A$ là separable isogeny degree $n^{2g}$ khi $\gcd(n, p) = 1$.
- $A[n] = \ker([n])$ là finite étale group scheme rank $n^{2g}$ trên $\bar{k}$.
- Như group: $A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ — hoàn toàn xác định bởi $n$ và $g$.
- Tate module $T_\ell(A) \cong \mathbb{Z}_\ell^{2g}$: lấy inverse limit theo $\ell$-power.
- Khi $p \mid n$: cấu trúc phức tạp hơn, liên quan đến $p$-rank và Newton polygon.

---

## References

- Mumford, D. *Abelian Varieties*. OUP, 1970. Chapter III, §13.
- Milne, J.S. *Abelian Varieties* (Course Notes). §8–9. https://www.jmilne.org/math/CourseNotes/AV.pdf
- Dembélé, L. *Abelian Varieties over Finite Fields: Honda–Tate's Theorem*. AWS 2024 Notes. §5. https://swc-math.github.io/aws/2024/PAWSDembele/2023PAWSDembeleNotes.pdf
- Wols, R. *Torsion Subgroups of Abelian Varieties*. Leiden, 2016. https://websites.math.leidenuniv.nl/edixhoven/teaching/2015-2016/TAG/raoul2.pdf
- Conrad, B. *Abelian Varieties* (Stanford lecture notes by Tony Feng). §1.6. https://math.stanford.edu/~conrad/249CS15Page/handouts/abvarnotes.pdf
- Silverman, J.H. *The Arithmetic of Elliptic Curves*. GTM 106. §III.6 (trường hợp $g=1$).
