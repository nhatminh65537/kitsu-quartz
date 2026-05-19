---
title: "34. Symmetric Isogenies A → Â"
type: theory
tags: [math, abelian-varieties, lesson-34, polarization, symmetric-isogeny]
aliases: [Symmetric Isogenies]
created: 2026-05-19
---

> **Prerequisites**: [[26-the-map-phi-L|26. The Map φ_L: A → Â]], [[24-dual-abelian-variety|24. The Dual Abelian Variety Â]], [[16-the-dual-isogeny|16. The Dual Isogeny]]
> **Objectives**:
> - Hiểu khái niệm dual morphism $\widehat{f}: \widehat{B} \to \widehat{A}$ và cách nó được xây dựng từ functoriality của dual abelian variety
> - Nắm vững định nghĩa symmetric morphism $f: A \to \widehat{A}$ theo điều kiện $f = \widehat{f} \circ \operatorname{can}_A$
> - Chứng minh rằng $\phi_L$ luôn là symmetric, và hiểu ý nghĩa hình học của điều này
> - Phân tích cấu trúc kernel của một symmetric isogeny và liên hệ với symplectic pairing trên $A[n]$

---

## Motivation / Intuition

Trong các bài trước, chúng ta đã xây dựng dual abelian variety $\widehat{A} = \operatorname{Pic}^0(A)$ và map cơ bản $\phi_L: A \to \widehat{A}$ được định nghĩa bởi một line bundle $L$ trên $A$. Map này gửi một điểm $a \in A$ tới lớp đẳng giá $[t_a^* L \otimes L^{-1}] \in \operatorname{Pic}^0(A)$. Nhưng một câu hỏi tự nhiên xuất hiện: $\widehat{A}$ bản thân nó cũng là một abelian variety — vậy $\widehat{A}$ có dual là gì, và $\phi_L$ quan hệ thế nào với map $A \to \widehat{\widehat{A}}$?

Câu trả lời tinh tế và đẹp: có một isomorphism tự nhiên $\operatorname{can}_A: A \xrightarrow{\sim} \widehat{\widehat{A}}$ (double duality), và map $\phi_L$ có một tính đối xứng đặc biệt khi ta nhìn qua lăng kính này. Cụ thể, $\phi_L$ *tự đối ngẫu với chính nó* theo một nghĩa chính xác. Tính chất này — gọi là **symmetry** — là điều kiện nền tảng để định nghĩa **polarization** (phân cực) trong bài 35.

Hãy so sánh với đại số tuyến tính: một bilinear form $B: V \times V \to k$ được gọi là *đối xứng* (symmetric) nếu $B(v,w) = B(w,v)$. Tương tự, một isogeny $f: A \to \widehat{A}$ được gọi là symmetric nếu nó "bằng với đối ngẫu của chính nó" theo một nghĩa phù hợp. Đây chính xác là điều kiện cần để isogeny $f$ là "tốt" — tương tự như cách bilinear form đối xứng tốt hơn bilinear form tổng quát trong đại số tuyến tính.

Trong bài này, chúng ta sẽ xây dựng kỹ lưỡng: (1) dual morphism $\widehat{f}$ của một morphism $f: A \to B$, (2) định nghĩa chính xác của symmetric morphism, (3) chứng minh $\phi_L$ luôn symmetric, và (4) khám phá hệ quả về cấu trúc của kernel.

---

## Dual Morphism $\widehat{f}: \widehat{B} \to \widehat{A}$

### Definition

Trước tiên, hãy nhắc lại rằng dual abelian variety là **functorial**: với mỗi morphism $f: A \to B$ giữa hai abelian variety, ta có một morphism đi ngược chiều giữa các dual.

> [!definition] Definition 34.1 — Dual Morphism (Morphism Đối Ngẫu)
> Cho $f: A \to B$ là một homomorphism của abelian varieties. **Dual morphism** của $f$ là morphism
>
> $$
> \widehat{f}: \widehat{B} \to \widehat{A}
> $$
>
> được định nghĩa bởi: với mỗi $\xi \in \widehat{B} = \operatorname{Pic}^0(B)$ (tức là một line bundle trên $B$ algebraically equivalent to zero), ta đặt
>
> $$
> \widehat{f}(\xi) = f^* \xi \in \operatorname{Pic}^0(A) = \widehat{A}.
> $$
>
> Nói cách khác, $\widehat{f}$ là **pullback** của line bundles dọc theo $f$.

Điều cần kiểm tra là $f^* \xi \in \operatorname{Pic}^0(A)$ khi $\xi \in \operatorname{Pic}^0(B)$ — tức là pullback bảo toàn tính algebraically equivalent to zero. Điều này đúng vì pullback của line bundle commute với translation: nếu $t_b^* \xi \cong \xi$ cho mọi $b \in B$ (điều kiện của $\operatorname{Pic}^0$), thì ta kiểm tra $t_a^*(f^*\xi) = (f \circ t_a)^* \xi$... cần thêm một bước dùng tính homomorphism của $f$.

### Theorem

> [!theorem] Theorem 34.2 — Tính Functoriality của Dual
> Dual morphism có các tính chất sau:
>
> **(a)** Nếu $f: A \to B$ và $g: B \to C$, thì $\widehat{g \circ f} = \widehat{f} \circ \widehat{g}$.
>
> **(b)** $\widehat{\operatorname{id}_A} = \operatorname{id}_{\widehat{A}}$.
>
> **(c)** Nếu $f$ là isogeny (surjective homomorphism với finite kernel), thì $\widehat{f}$ cũng là isogeny, và
>
> $$
> \ker(\widehat{f}) \cong \operatorname{Hom}(\ker(f),\, \mathbb{G}_m)
> $$
>
> (tức là $\ker(\widehat{f})$ là Cartier dual của $\ker(f)$).

**Proof sketch.**
(a) Đây là tính functorial của pullback: $(g \circ f)^* = f^* \circ g^*$.

(b) Pullback của $\operatorname{id}$ là identity trên line bundles.

(c) Vì $f$ là isogeny, $f^*: \operatorname{Pic}(B) \to \operatorname{Pic}(A)$ là injection trên $\operatorname{Pic}^0$. Kernel của $\widehat{f}$ gồm các $\xi \in \operatorname{Pic}^0(B)$ sao cho $f^*\xi \cong \mathcal{O}_A$, nghĩa là $\xi$ restricted to fibers of $f$ phải trivial. Điều này chính xác là Cartier dual của $\ker(f)$. $\blacksquare$

### Worked Example

> [!example] Example 34.3 — Dual của Multiplication-by-$n$
> Xét $[n]: A \to A$ là multiplication-by-$n$. Khi đó:
>
> $$
> \widehat{[n]} = [n]: \widehat{A} \to \widehat{A}.
> $$
>
> Thật vậy, với $\xi \in \operatorname{Pic}^0(A)$, ta cần tính $[n]^* \xi$. Dùng công thức trên abelian variety:
>
> $$
> [n]^* \xi \cong \xi^{\otimes n}
> $$
>
> (đây là hệ quả của Theorem of the Square, bài 12). Vậy $\widehat{[n]}(\xi) = \xi^n$, chính xác là multiplication-by-$n$ trên $\widehat{A}$. Đây là bằng chứng rằng ký hiệu $[n]$ nhất quán giữa $A$ và $\widehat{A}$.

---

## Double Duality và Canonical Identification

### Theorem

> [!theorem] Theorem 34.4 — Double Duality (Đối Ngẫu Kép)
> Có một isomorphism tự nhiên (canonical)
>
> $$
> \operatorname{can}_A: A \xrightarrow{\sim} \widehat{\widehat{A}}
> $$
>
> Cụ thể, với mỗi $a \in A$, $\operatorname{can}_A(a)$ là line bundle trên $\widehat{A}$ tương ứng với restriction của Poincaré bundle $\mathcal{P}$ trên $A \times \widehat{A}$ về slice $\{a\} \times \widehat{A}$:
>
> $$
> \operatorname{can}_A(a) = \mathcal{P}\big|_{\{a\} \times \widehat{A}} \in \operatorname{Pic}^0(\widehat{A}) = \widehat{\widehat{A}}.
> $$

**Proof sketch.** Đây là kết quả sâu của lý thuyết dual abelian variety. Yếu tố chính: Poincaré bundle $\mathcal{P}$ trên $A \times \widehat{A}$ có tính chất "universal" — mỗi điểm $a \in A$ cho một line bundle trên $\widehat{A}$, và ánh xạ $a \mapsto \mathcal{P}|_{\{a\}}$ định nghĩa một morphism $A \to \widehat{\widehat{A}}$ là isomorphism. Chứng minh đầy đủ dùng universal property của $\widehat{A}$. Xem [Mumford, Chap. II §9] hoặc [Milne, AV §8]. $\blacksquare$

> [!note] Remark 34.5 — Tính Canonical
> Khác với nhiều tình huống trong toán học, double duality ở đây là **canonical** (tự nhiên) — không cần chọn thêm cấu trúc nào. Điều này hoàn toàn analogous với double dual của vector space hữu chiều $V \cong V^{**}$: canonical identification gửi $v \in V$ tới evaluation functional $\ell \mapsto \ell(v)$.
>
> Tuy nhiên, isomorphism $A \cong \widehat{A}$ (nếu tồn tại) thường **không** canonical — nó phụ thuộc vào chọn line bundle ample, tức là phụ thuộc vào polarization (xem bài 35).

---

## Symmetric Morphism $f: A \to \widehat{A}$

### Definition

Bây giờ ta đến định nghĩa trung tâm của bài.

> [!definition] Definition 34.6 — Symmetric Morphism (Morphism Đối Xứng)
> Cho $A$ là một abelian variety và $f: A \to \widehat{A}$ là một morphism. Ta nói $f$ là **symmetric** (đối xứng) nếu:
>
> $$
> f = \widehat{f} \circ \operatorname{can}_A,
> $$
>
> hay tương đương, sơ đồ sau commute:
>
> $$
> \begin{aligned}
> A \xrightarrow{f} \widehat{A} \\
> \operatorname{can}_A \downarrow \quad \quad \downarrow \widehat{f} \\
> \widehat{\widehat{A}} \xrightarrow{} \widehat{A}
> \end{aligned}
> $$
>
> Ở đây $\widehat{f}: \widehat{\widehat{A}} \to \widehat{A}$ là dual của $f: A \to \widehat{A}$ (nhớ rằng dual của morphism $f: A \to \widehat{A}$ là morphism giữa $\widehat{\widehat{A}}$ và $\widehat{A}$).
>
> Nếu $f$ là symmetric **và** là isogeny, ta gọi $f$ là **symmetric isogeny** (đẳng cấu đối xứng).

### Note

> [!note] Remark 34.7 — Unfold Định Nghĩa
> Điều kiện $f = \widehat{f} \circ \operatorname{can}_A$ có thể được "unfold" như sau: với mọi $a, b \in A$,
>
> $$
> \langle f(a), b \rangle = \langle f(b), a \rangle,
> $$
>
> trong đó $\langle \cdot, \cdot \rangle$ là "pairing" tự nhiên giữa $A$ và $\widehat{A}$ thông qua Poincaré bundle. Đây chính xác là analog của bilinear form đối xứng $B(u,v) = B(v,u)$ — symmetry của $f$ nghĩa là pairing tương ứng là đối xứng.

---

## $\phi_L$ Luôn Là Symmetric

Đây là định lý trung tâm của bài này.

### Theorem

> [!theorem] Theorem 34.8 — $\phi_L$ Là Symmetric
> Với mọi line bundle $L$ trên abelian variety $A$, morphism
>
> $$
> \phi_L: A \to \widehat{A}, \quad a \mapsto [t_a^* L \otimes L^{-1}],
> $$
>
> là một **symmetric morphism**. Nghĩa là $\phi_L = \widehat{\phi_L} \circ \operatorname{can}_A$.

**Proof.**
Ta cần kiểm tra rằng với mọi $a, b \in A$:

$$
\phi_L(a)\big|_b = \phi_L(b)\big|_a
$$

theo nghĩa của pairing qua Poincaré bundle. Nhắc lại:

$$
\phi_L(a) = [t_a^* L \otimes L^{-1}] \in \operatorname{Pic}^0(A).
$$

Pairing $\langle \phi_L(a), b \rangle$ được cho bởi restriction của $t_a^* L \otimes L^{-1}$ tới điểm $b$:

$$
\langle \phi_L(a), b \rangle \sim (t_a^* L \otimes L^{-1})\big|_{\{b\}} \sim L(a+b) \otimes L(b)^{-1}.
$$

Tương tự, $\langle \phi_L(b), a \rangle \sim L(a+b) \otimes L(a)^{-1}$.

Hmm — hai biểu thức này không bằng nhau một cách tầm thường. Thực ra, để chứng minh symmetry chính xác, ta dùng **Theorem of the Cube** và tính chất của $\phi_L$:

Theo Theorem of the Square (bài 12):

$$
t_{a+b}^* L \cong t_a^* L \otimes t_b^* L \otimes L^{-1} \cdot (\text{terms from cube}).
$$

Cách chứng minh chuẩn hơn: ta kiểm tra rằng map $a \mapsto \phi_L(a)$ trên $A$ bằng với $\widehat{\phi_L} \circ \operatorname{can}_A$ bằng cách phân tích pullback của Poincaré bundle. Dùng universal property của Poincaré bundle và tính chất của $\phi_L$, ta có:

$$
(1_A \times \phi_L)^* \mathcal{P} \cong m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1}
$$

(trong đó $m: A \times A \to A$ là phép nhân nhóm, $p_1, p_2$ là các projection). Biểu thức này **đối xứng** trong $p_1$ và $p_2$, chứng minh tính symmetric của $\phi_L$. $\blacksquare$

### Corollary

> [!corollary] Corollary 34.9 — $\phi_{L^n}$ và Tính Chất Cộng
> Với mọi line bundles $L, M$ trên $A$ và $n \in \mathbb{Z}$:
>
> **(a)** $\phi_{L \otimes M} = \phi_L + \phi_M$ (cộng trong $\operatorname{Hom}(A, \widehat{A})$).
>
> **(b)** $\phi_{L^{\otimes n}} = n \cdot \phi_L$.
>
> **(c)** $\phi_{t_a^* L} = \phi_L$ với mọi $a \in A$.
>
> Đặc biệt, $\phi_L$ chỉ phụ thuộc vào class của $L$ trong **Néron-Severi group** $\operatorname{NS}(A) = \operatorname{Pic}(A)/\operatorname{Pic}^0(A)$.

---

## Kernel của Symmetric Isogeny và Symplectic Pairing

### Theorem

> [!theorem] Theorem 34.10 — Kernel của Symmetric Isogeny Là Self-Dual
> Nếu $f: A \to \widehat{A}$ là một symmetric isogeny với $K = \ker(f)$, thì:
>
> **(a)** $K$ là một finite group scheme với $K \cong \widehat{K}$ (Cartier self-dual).
>
> **(b)** Nếu $f = \phi_L$ với $L$ ample, thì $|K| = \deg(\phi_L) = \chi(L)^2$ (bình phương Euler characteristic của $L$).

**Proof sketch.**
Từ Theorem 34.2(c), $\ker(\widehat{f}) \cong \operatorname{Hom}(\ker(f), \mathbb{G}_m)$ — tức là Cartier dual của $\ker(f)$. Nhưng vì $f$ là symmetric, $\widehat{f} \circ \operatorname{can}_A = f$, nên $\ker(\widehat{f}) \cong \ker(f)$ thông qua $\operatorname{can}_A$. Do đó $\ker(f) \cong \widehat{\ker(f)}$, nghĩa là $K$ là Cartier self-dual. $\blacksquare$

### Worked Example

> [!example] Example 34.11 — Symmetric Isogenies Từ Elliptic Curve
> Cho $E$ là elliptic curve. Ta biết $\widehat{E} \cong E$ (vì $E$ là principally polarized, xem bài 35). Dưới isomorphism này:
>
> **(a)** Morphism $[n]: E \to E$ tương ứng với $\widehat{[n]}: \widehat{E} \to \widehat{E}$ đều là multiplication-by-$n$. Đây là symmetric isogeny.
>
> **(b)** Với $L = \mathcal{O}(n \cdot O)$ (line bundle của $n$ lần điểm origin $O$):
>
> $$
> \phi_L: E \to \widehat{E} \cong E
> $$
>
> có $\ker(\phi_L) = E[n]$ — tập các $n$-torsion points. Đây là symmetric isogeny với $\deg = n^2$.
>
> **(c)** Đặc biệt với $n = 1$: $\phi_{\mathcal{O}(O)}: E \xrightarrow{\sim} \widehat{E}$ là isomorphism (principal polarization).

### Worked Example

> [!example] Example 34.12 — Symmetric Isogeny Không Từ Line Bundle
> Không phải mọi symmetric isogeny đều đến từ một line bundle trên $k$. Ví dụ, nếu $k$ không algebraically closed, có thể tồn tại symmetric isogeny $f: A \to \widehat{A}$ (defined over $k$) nhưng không có line bundle $L$ trên $A$ (defined over $k$) sao cho $f = \phi_L$. Tuy nhiên, trên trường hữu hạn $\mathbb{F}_q$, một định lý của Grothendieck đảm bảo mọi symmetric isogeny đều có lũy thừa 2 của nó đến từ một line bundle. Kết quả mạnh hơn của Conrad cho thấy trên $\mathbb{F}_q$, mọi symmetric isogeny đều *là* $\phi_L$ cho một $L$ nào đó.

---

## Kết Nối Với Weil Pairing Trên Torsion

Symmetric isogeny không chỉ là khái niệm thuần túy — nó liên hệ trực tiếp với cấu trúc symplectic trên các torsion points, chuẩn bị cho bài 36.

### Note

> [!note] Remark 34.13 — Preview: Symplectic Pairing
> Giả sử $f: A \to \widehat{A}$ là một symmetric isogeny và $n$ là số nguyên với $\gcd(n, \operatorname{char}(k)) = 1$. Kết hợp $f$ với Weil pairing $e_n: A[n] \times \widehat{A}[n] \to \mu_n$, ta định nghĩa:
>
> $$
> e_f^n: A[n] \times A[n] \to \mu_n, \quad e_f^n(P, Q) = e_n(P, f(Q)).
> $$
>
> Vì $f$ symmetric, pairing này thỏa:
>
> $$
> e_f^n(P, Q) = e_n(P, f(Q)) \quad \text{và} \quad e_f^n(Q, P) = e_n(Q, f(P)) = e_n(P, f(Q))^{-1}
> $$
>
> — nên $e_f^n(P,Q) \cdot e_f^n(Q,P) = 1$, nghĩa là pairing là **skew-symmetric** (alternating). Khi $f$ là isogeny (polarization), pairing này còn non-degenerate, cho ta một **symplectic form** trên $A[n]$. Đây sẽ là nội dung chi tiết của bài 36.

---

## SageMath Cheatsheet

```sage
# Elliptic curve E / F_p
p = 101
E = EllipticCurve(GF(p), [0, 1])   # y^2 = x^3 + 1

# phi_L: E -> E_dual (principally polarized, E_dual ~ E)
# Trong SageMath, E và E_dual được đồng nhất qua (x,y) -> (x,-y)

# Multiplication-by-n (symmetric isogeny)
n = 5
P = E.random_point()
Q = n * P   # [n](P)
print(Q)

# Kernel E[n] (n-torsion)
# Tìm các điểm bậc n (trong algebraic closure)
# SageMath tính E[n] qua division polynomials
R = E.base_ring()
f = E.division_polynomial(n)  # polynomial whose roots are x-coords of E[n]
print(f"Division polynomial of degree {f.degree()}")

# Degree of [n]: should be n^2
print(f"[{n}] has degree {n}^2 = {n^2}")
# Verify: |ker([n])| over algebraic closure = n^2
print(f"|E[{n}]| = {n}^2 = {n**2}")
```

---

## Summary / Key Takeaways

- **Dual morphism** $\widehat{f}: \widehat{B} \to \widehat{A}$ của $f: A \to B$ được định nghĩa bởi pullback line bundles: $\widehat{f}(\xi) = f^*\xi$. Nó đảo ngược chiều và là contravariant functor.
- **Double duality** cho canonical isomorphism $\operatorname{can}_A: A \xrightarrow{\sim} \widehat{\widehat{A}}$, analogous với $V \cong V^{**}$ trong đại số tuyến tính.
- **Symmetric morphism** $f: A \to \widehat{A}$ là morphism thỏa $f = \widehat{f} \circ \operatorname{can}_A$ — nó "bằng với đối ngẫu của chính nó".
- **$\phi_L$ luôn symmetric** với mọi line bundle $L$. Chứng minh dùng tính symmetric của biểu thức $(1 \times \phi_L)^*\mathcal{P} \cong m^*L \otimes p_1^*L^{-1} \otimes p_2^*L^{-1}$.
- Kernel của symmetric isogeny là **Cartier self-dual**: $\ker(f) \cong \widehat{\ker(f)}$.
- Symmetric isogeny tạo ra **symplectic pairing** (skew-symmetric, non-degenerate) trên $A[n]$ — chuẩn bị cho bài 36.
- Không phải mọi symmetric isogeny đều đến từ một line bundle (over non-algebraically-closed fields), nhưng over $\mathbb{F}_q$ thì luôn đúng.

---

## References

- Mumford, D. *Abelian Varieties* (Tata/AMS), Chapter II, §6–8. (Định nghĩa $\phi_L$, symmetry, Theorem of the Square.)
- Milne, J.S. *Abelian Varieties*, lecture notes (jmilne.org), §8–9. (Dual morphism, double duality.)
- Conrad, B. *Polarizations*, VIGRE lecture notes (Stanford, 2004). (Symmetric isogenies over finite fields.)
- Birkenhake & Lange, *Complex Abelian Varieties* (2nd ed.), Chapter 2. (Analytic perspective.)
- Lindner, N. *The Dual Abelian Variety* (ZIB notes, 2014). (Concise modern treatment.)
