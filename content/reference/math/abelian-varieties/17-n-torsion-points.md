---
title: "17. n-Torsion Points A[n]"
type: theory
tags: [math, abelian-varieties, lesson-17]
aliases: [n-Torsion Points A[n]]
created: 2026-05-17
---

> **Prerequisites**: [[16-the-dual-isogeny|16. The Dual Isogeny]], [[11-the-multiplication-by-n-map|11. The Multiplication-by-n Map]], [[15-separable-vs-inseparable-isogenies|15. Separable vs Inseparable Isogenies]]
> **Objectives**:
> - Hiểu cấu trúc nhóm của $A[n]$ trong trường hợp $\gcd(n, \operatorname{char}(k)) = 1$
> - Chứng minh $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ khi char không chia $n$
> - Phân tích cấu trúc $A[\ell^n]$ và mối liên hệ với Tate module (Module 3)
> - Hiểu sự suy biến của $A[p]$ khi $\operatorname{char}(k) = p$

---

## Motivation / Intuition

Trong lý thuyết nhóm trừu tượng, nhóm $n$-torsion $G[n] = \{g \in G \mid ng = 0\}$ của một nhóm abelian $G$ là một invariant quan trọng. Nếu $G = \mathbb{Z}^{2g}$ (tự do rank $2g$), thì $G[n] = (\mathbb{Z}/n\mathbb{Z})^{2g}$.

Đây chính xác là điều xảy ra với abelian variety: $A[n] \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ khi $\gcd(n, \operatorname{char}(k)) = 1$. Kết quả này cực kỳ quan trọng vì:

1. **Nó là cơ sở của Tate module**: $T_\ell(A) = \varprojlim A[\ell^n]$ (bài 20)
2. **Nó định nghĩa Galois representation**: $\operatorname{Gal}(\bar{k}/k)$ tác động lên $A[n]$, cho ta linear representation
3. **Nó liên kết với Weil pairing**: pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$ cần $A[n]$ có cấu trúc rõ ràng
4. **Nó là công cụ đếm**: $|A(\mathbb{F}_q)|$ tính được từ Frobenius tác động lên $A[\ell]$ cho $\ell \nmid q$

Ngược lại, khi $p = \operatorname{char}(k)$ chia $n$, cấu trúc $A[p^r]$ phức tạp hơn nhiều — đây là nơi các khái niệm ordinary/supersingular xuất hiện.

---

## Định nghĩa và Cấu trúc Cơ bản của $A[n]$

### Definition

> [!definition] Definition 17.1 — n-Torsion Subgroup
>
> Cho $A$ là abelian variety trên $k$ và $n \in \mathbb{Z}_{>0}$. Tập **$n$-torsion points** (điểm $n$-xoắn) là:
>
> $$
> A[n] := \ker([n]: A \to A) = \left\{ P \in A(\bar{k}) \mid [n]P = 0 \right\}
> $$
>
> Đây là một **finite group scheme** trên $k$ (không nhất thiết là reduced nếu $p \mid n$).
>
> Khi ta nói $A[n]$ là nhóm, ta thường hiểu $A[n](\bar{k})$ — tập $\bar{k}$-rational points — với group law kế thừa từ $A$.

> [!note] Remark 17.2 — Group Scheme vs Nhóm Điểm
>
> Phân biệt quan trọng:
>
> - $A[n]$ như **group scheme**: đối tượng đại số, có thể có nilpotents trong characteristic $p$
> - $A[n](\bar{k})$ như **abstract group**: tập $\bar{k}$-valued points, luôn là nhóm abelian hữu hạn
>
> Khi $\gcd(n, \operatorname{char}(k)) = 1$: hai quan điểm này cho cùng kết quả — $A[n]$ là étale và $A[n](\bar{k})$ đủ để mô tả đầy đủ $A[n]$.
>
> Khi $p \mid n$: $A[n]$ có thể có nilpotents và $A[n](\bar{k})$ **nhỏ hơn** $\deg([n])$ = $n^{2g}$.

---

## Cấu trúc của $A[n]$ khi $\gcd(n, p) = 1$

### Theorem

> [!theorem] Theorem 17.3 — Cấu trúc của n-Torsion (char không chia n)
>
> Cho $A$ là abelian variety trên $k$ với $\dim A = g$, và $n \in \mathbb{Z}_{>0}$ với $\gcd(n, \operatorname{char}(k)) = 1$.
>
> Sau khi base change đến $\bar{k}$:
>
> $$
> A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
> $$
>
> Nói cách khác, $A[n]$ là nhóm abelian hữu hạn free của rank $2g$ trên $\mathbb{Z}/n\mathbb{Z}$.

**Proof.**
Có nhiều cách chứng minh. Ta trình bày phương pháp qua Tate module (xem [[a1-proof-of-a-n-structure|A1. Proof: A[n] ≅ (Z/nZ)^{2g}]] để chứng minh đầy đủ).

**Hướng chính:**

**Bước 1: $A[n]$ là finite étale group scheme.** Vì $[n]$ separable khi $\gcd(n, p) = 1$ (Theorem 15.10), scheme $\ker([n]) = A[n]$ là étale (smooth, finite). Trên $\bar{k}$, étale group scheme tương đương nhóm abelian hữu hạn.

**Bước 2: Order là $n^{2g}$.** Từ $\deg([n]) = n^{2g}$, số điểm trong fiber là $n^{2g}$.

**Bước 3: Cấu trúc $(\mathbb{Z}/n\mathbb{Z})^{2g}$.** Ta cần chứng minh $A[n]$ là **free** $\mathbb{Z}/n\mathbb{Z}$-module rank $2g$, tức là không có element bậc thấp hơn.

Với $n = \ell$ prime: $A[\ell]$ là nhóm abelian với $\ell \cdot P = 0$ với mọi $P$, nên $A[\ell]$ là $\mathbb{F}_\ell$-vector space. Ta cần dim $= 2g$.

Ta dùng Theorem: $A[\ell]$ là $\mathbb{F}_\ell$-module của rank $\leq 2g$ (do $\deg([l]) = \ell^{2g}$), và rank này chính xác bằng $2g$ nhờ tính non-degeneracy của Weil pairing $e_\ell: A[\ell] \times \hat{A}[\ell] \to \mu_\ell$ — pairing này cho biết $A[\ell]$ và $\hat{A}[\ell]$ đều có rank đúng $2g$.

Với $n$ tổng quát: dùng Chinese Remainder Theorem cho prime powers và induction. $\blacksquare$

### Worked Example

> [!example] Example 17.4 — $E[n]$ trên Elliptic Curve
>
> Cho $E: y^2 = x^3 + x$ trên $\mathbb{Q}$ và $n = 3$.
>
> **Claim:** $E[3](\bar{\mathbb{Q}}) \cong (\mathbb{Z}/3\mathbb{Z})^2$ — nhóm có $9$ phần tử.
>
> **Cách tìm $E[3]$:** Các điểm $P = (x, y)$ thỏa $3P = O$ tương đương $2P = -P$. Bằng công thức nhân đôi:
>
> $$
> x(2P) = \frac{3x^2 + 1}{2y}, \quad y(2P) = \cdots
> $$
>
> Điều kiện $2P = -P = (x, -y)$ cho: $x(2P) = x$, tức là:
>
> $$
> \frac{(3x^2 + 1)^2}{4(x^3 + x)} - 2x = x \implies (3x^2 + 1)^2 = 12x(x^3 + x)
> $$
>
> Rút gọn: $3x^4 + 6x^2 - 1 = 0$ (division polynomial $\psi_3 = 0$).
>
> Polynomial này có bậc $4$, cho $4$ giá trị $x$ phức, mỗi giá trị tương ứng $2$ điểm $(x, \pm y)$, cộng thêm điểm $O$ — tổng cộng $9$ điểm. ✓
>
> Vì $\mathbb{Z}/3\mathbb{Z}^2$ là nhóm abelian duy nhất (up to isomorphism) order $9$ và exponent $3$.

> [!example] Example 17.5 — $A[2]$ trên Jacobian Surface
>
> Cho $C: y^2 = f(x)$ là hyperelliptic curve genus $g = 2$ trên $k$ với $\operatorname{char}(k) \neq 2$, và $A = J(C)$ là Jacobian của $C$ (abelian variety dimension $2$).
>
> **Claim:** $A[2](\bar{k}) \cong (\mathbb{Z}/2\mathbb{Z})^4$ — nhóm $16$ phần tử.
>
> $A[2]$ tương ứng với các divisor class $[D]$ với $2[D] = 0$ trong $\operatorname{Pic}^0(C)$. Điều này liên quan đến tập các Weierstrass points của $C$.
>
> Polynomial $f(x)$ bậc $5$ hoặc $6$ có $2g + 2 = 6$ roots (trên $\bar{k}$). Các cặp Weierstrass points sinh ra $A[2]$ và cấu trúc $(\mathbb{Z}/2)^4$ phát sinh từ group of $2$-torsion divisors.

---

## $A[\ell^n]$ và Inverse System

### Theorem

> [!theorem] Theorem 17.6 — Compatibility của $A[\ell^n]$
>
> Với $\ell$ prime và $\gcd(\ell, \operatorname{char}(k)) = 1$, tồn tại hệ tương thích:
>
> $$
> \cdots \to A[\ell^3] \xrightarrow{[\ell]} A[\ell^2] \xrightarrow{[\ell]} A[\ell] \to 0
> $$
>
> trong đó các mũi tên là multiplication-by-$\ell$ (surjective vì $\ell$ coprime với char).
>
> Cụ thể: với $m \geq 1$, embedding $A[\ell^m] \hookrightarrow A[\ell^{m+1}]$ gửi $P \mapsto P$, và $[\ell]: A[\ell^{m+1}] \to A[\ell^m]$ gửi $P \mapsto \ell P$.

> [!note] Remark 17.7 — Tate Module
>
> Hệ inverse của $A[\ell^n]$ (với maps $[\ell]: A[\ell^{n+1}] \to A[\ell^n]$) tạo thành **$\ell$-adic Tate module**:
>
> $$
> T_\ell(A) := \varprojlim_{n} A[\ell^n]
> $$
>
> Đây là $\mathbb{Z}_\ell$-module free rank $2g$ — "limit" của $A[\ell^n] \cong (\mathbb{Z}/\ell^n\mathbb{Z})^{2g}$. Chi tiết trong bài 20.
>
> Điểm cần nhớ: thông tin về **tất cả** $A[\ell^n]$ được đóng gói gọn trong một đối tượng $T_\ell(A)$.

---

## Galois Action trên $A[n]$

### Definition

> [!definition] Definition 17.8 — Galois Representation từ $A[n]$
>
> Cho $k$ là số field (hoặc finite field) và $A/k$ là abelian variety. Galois group $G_k = \operatorname{Gal}(\bar{k}/k)$ tác động lên $A[n](\bar{k})$ theo cách natural:
>
> $$
> \sigma \cdot P := \sigma(P) \quad \text{cho } \sigma \in G_k, P \in A[n](\bar{k})
> $$
>
> (tác động của $\sigma$ lên tọa độ của $P$). Tác động này:
>
> 1. Preserve group structure: $\sigma(P + Q) = \sigma(P) + \sigma(Q)$ ✓
> 2. Preserve $n$-torsion: nếu $nP = 0$ thì $n\sigma(P) = \sigma(nP) = \sigma(0) = 0$ ✓
>
> Vậy ta có **Galois representation**:
>
> $$
> \rho_{A,n}: G_k \longrightarrow \operatorname{Aut}(A[n](\bar{k})) \cong \operatorname{GL}_{2g}(\mathbb{Z}/n\mathbb{Z})
> $$

> [!example] Example 17.9 — Galois Action trên $E[n]$ cho Elliptic Curves
>
> Cho $E/\mathbb{Q}$ là elliptic curve và $n \geq 1$ với $\gcd(n, 6) = 1$ (để đơn giản).
>
> $E[n](\bar{\mathbb{Q}}) \cong (\mathbb{Z}/n\mathbb{Z})^2$ được sinh bởi hai điểm $\{P_1, P_2\}$ với $nP_1 = nP_2 = 0$ và $e_n(P_1, P_2) \neq 1$.
>
> Galois representation $\rho_{E,n}: G_\mathbb{Q} \to \operatorname{GL}_2(\mathbb{Z}/n\mathbb{Z})$ là đối tượng nghiên cứu của lý thuyết số hiện đại.
>
> **Ví dụ:** $E: y^2 = x^3 - x$. Điểm $2$-torsion $E[2] = \{O, (0,0), (1,0), (-1,0)\}$ — tất cả đều $\mathbb{Q}$-rational! Vậy $\rho_{E,2}$ là trivial representation. Điều này đặc biệt và không xảy ra với $n > 2$ thông thường.

---

## Cấu trúc $A[p]$ khi $\operatorname{char}(k) = p$

### Theorem

> [!theorem] Theorem 17.10 — $A[p]$ trong Characteristic $p$
>
> Cho $A$ là abelian variety dimension $g$ trên $k$ với $\operatorname{char}(k) = p > 0$.
>
> Tồn tại số nguyên $f = f(A)$ với $0 \leq f \leq g$ (gọi là **$p$-rank** hay **Hasse invariant** của $A$) sao cho:
>
> $$
> A[p](\bar{k}) \cong (\mathbb{Z}/p\mathbb{Z})^f
> $$
>
> Đặc biệt:
>
> - $f = g$: $A$ được gọi là **ordinary** — $A[p](\bar{k})$ có kích thước tối đa
> - $f = 0$: $A$ được gọi là **supersingular** — $A[p](\bar{k}) = \{0\}$

> [!note] Remark 17.11 — Tại sao $f < 2g$?
>
> Trong characteristic $0$ hoặc $p \nmid n$: $A[n] \cong (\mathbb{Z}/n)^{2g}$ — tổng số $n^{2g}$ points.
>
> Trong characteristic $p$: $[p]$ là inseparable, và $\ker([p])$ có underlying space chỉ một điểm. Phần étale của $A[p]$ (các $\bar{k}$-points thực sự) chỉ có kích thước $p^f$ với $f \leq g$. Phần còn lại (order $p^{2g - f}$) là "vô hình" qua $\bar{k}$-points, chỉ thấy được qua cấu trúc group scheme.
>
> Tại sao $f \leq g$ (không phải $2g$)? Vì $[p] = V \circ F$ và $F$ là purely inseparable degree $p^g$: $\ker(F)$ đóng góp inseparable part. Phần visible của $A[p]$ đến từ $\ker(V \circ F)$ theo cách phức tạp.

> [!example] Example 17.12 — $E[p]$ trên Elliptic Curve
>
> Cho $E/\mathbb{F}_p$ là elliptic curve.
>
> - **Ordinary** ($f = 1$): $E[p](\bar{\mathbb{F}}_p) \cong \mathbb{Z}/p\mathbb{Z}$ — có $p$ points torsion-$p$
> - **Supersingular** ($f = 0$): $E[p](\bar{\mathbb{F}}_p) = \{O\}$ — không có point torsion-$p$ ngoài identity
>
> **Ví dụ cụ thể:**
>
> - $E: y^2 = x^3 - x$ trên $\mathbb{F}_5$: là supersingular (có thể verify bằng $a_p = 0$)
> - $E: y^2 = x^3 + x + 1$ trên $\mathbb{F}_5$: là ordinary (verify bằng $|E(\mathbb{F}_5)| = 4$ hoặc $9$, $a_5 \neq 0$)
>
> Supersingular xảy ra khi $p \mid a_p$ (trace of Frobenius). Với $g = 1$: supersingular iff $a_p = 0$ (hay $p \equiv 3 \pmod 4$ với $E: y^2 = x^3 - x$).

---

## Division Polynomials — Công Cụ Tính $E[n]$ Tường Minh

> [!info] Division Polynomials
>
> Với elliptic curve $E: y^2 = x^3 + ax + b$, **division polynomial** $\psi_n(x)$ là đa thức trong $x$ (và $y$) có nghiệm là tọa độ $x$ của các điểm $n$-torsion.
>
> Các division polynomials được định nghĩa đệ quy:
>
> $$
> \psi_1 = 1, \quad \psi_2 = 2y
> $$
>
> $$
> \psi_3 = 3x^4 + 6ax^2 + 12bx - a^2
> $$
>
> $$
> \psi_4 = 4y(x^6 + 5ax^4 + 20bx^3 - 5a^2x^2 - 4abx - 8b^2 - a^3)
> $$
>
> Tổng quát: $\psi_n$ là đa thức bậc $\frac{n^2-1}{2}$ (với $n$ lẻ) trong $x$ và bậc $\frac{n^2-4}{2}$ (với $n$ chẵn) nhân $y$. Số nghiệm của $\psi_n = 0$ (tính với multiplicity và trên $\bar{k}$) bằng $n^2 - 1$ (không tính $O$), phù hợp với $|E[n]| = n^2$.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(QQ, [1, 0])
psi3 = E.division_polynomial(3)
print('psi_3:', psi3)
print('Degree:', psi3.degree())
roots = psi3.roots(QQbar)
print('x-coords of E[3]:', roots)
```

```python
p = 7
E = EllipticCurve(GF(p), [1, 1])
E3 = [P for P in E.torsion_subgroup().gens()]
print('E[3] generators over F_7:', E3)
```

```python
E = EllipticCurve(GF(5), [0, -1, 1, 0, 0])
print('a_5:', E.trace_of_frobenius())
print('Supersingular:', E.is_supersingular())
```

---

## Summary / Key Takeaways

- $A[n] = \ker([n]: A \to A)$ là finite group scheme trên $k$.
- Khi $\gcd(n, \operatorname{char}(k)) = 1$: $A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}$ — cấu trúc chuẩn, $n^{2g}$ điểm.
- Khi $\operatorname{char}(k) = p$: $A[p](\bar{k}) \cong (\mathbb{Z}/p\mathbb{Z})^f$ với $0 \leq f \leq g$ ($p$-rank của $A$).
- $f = g$: ordinary; $f = 0$: supersingular.
- Galois group $G_k$ tác động lên $A[n]$ cho Galois representation $\rho_{A,n}: G_k \to \operatorname{GL}_{2g}(\mathbb{Z}/n\mathbb{Z})$.
- Division polynomials $\psi_n$ cho phép tính $E[n]$ tường minh với elliptic curves.
- $A[\ell^n]$ tổ chức thành inverse system $\to A[\ell^3] \to A[\ell^2] \to A[\ell]$, limit là Tate module $T_\ell(A)$.

---

## References

- Mumford, D. *Abelian Varieties*. Chapter 3, §6 (Theorem on torsion). Oxford University Press, 1974.
- Silverman, J. H. *The Arithmetic of Elliptic Curves*. Chapter III.4–5. Springer GTM 106, 2009.
- van der Geer, G. & Moonen, B. *Abelian Varieties*. Chapter V, §2–3. https://www.math.ru.nl/~bmoonen/BookAV/Isogs.pdf
- Milne, J. S. *Abelian Varieties*. Section 7 (Endomorphisms). https://www.jmilne.org/math/xnotes/AVs.pdf
- Wols, R. *Torsion Subgroups of Abelian Varieties*. https://websites.math.leidenuniv.nl/edixhoven/teaching/2015-2016/TAG/raoul2.pdf
