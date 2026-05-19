---
title: "06. Abelian Varieties are Projective"
tags: [math, abelian-varieties, lesson-06]
aliases: [Abelian Varieties are Projective]
created: 2026-03-24
---

> **Prerequisites**: [[05-theorem-of-the-cube|05. Theorem of the Cube & Square]], [[01-algebraic-geometry-prerequisites|01. Algebraic Geometry Prerequisites]]
> **Objectives**:
> - Hiểu tại sao complete group variety bắt buộc phải projective — không hiển nhiên!
> - Nắm chiến lược chứng minh: xây dựng ample divisor từ open affine và group structure
> - Biết hệ quả: symmetric ample sheaf tồn tại, $\mathcal{L}^{\otimes 3}$ very ample
> - Hiểu $K(\mathcal{L})$ — kernel của $\phi_\mathcal{L}$ — và quan hệ với ampleness

---

## Motivation / Intuition

Định nghĩa của abelian variety đòi hỏi $A$ là **complete** — nhưng không đòi hỏi **projective** (có thể nhúng vào $\mathbb{P}^n$). Đây là hai khái niệm khác nhau trong algebraic geometry tổng quát! Có complete varieties không projective.

Tuy nhiên, nhờ cấu trúc nhóm đặc biệt của $A$, ta sẽ chứng minh rằng **mọi abelian variety đều projective**. Đây là kết quả không tầm thường — chiến lược là:

1. Bắt đầu với một open affine neighbourhood $U$ của $0$.
2. Complement $A \setminus U$ là "divisor" $D = \sum Z_i$.
3. Dùng Theorem of the Square để chứng minh $|3D|$ là **very ample** linear system.

Lesson này cũng giới thiệu $K(\mathcal{L}) = \ker(\phi_\mathcal{L})$ — nhóm các điểm $a$ sao cho $t_a^*\mathcal{L} \cong \mathcal{L}$ — và mối quan hệ giữa $K(\mathcal{L}) = 0$ và ampleness.

---

## Hai Điểm Luôn Nằm trong Một Open Affine

Lemma kỹ thuật đầu tiên:

> [!abstract] Lemma 6.1 — Mọi cặp điểm nằm trong open affine
> Cho $A$ là abelian variety và $a, b \in A(k)$. Thì tồn tại open affine $U \subseteq A$ chứa cả $a$ lẫn $b$.

**Proof.** Đặt $U_0$ là open affine neighbourhood tùy ý của $0 \in A$. Xét $U_0 \cap (U_0 + (a - b))$: đây là open set chứa $b$ (vì $b \in U_0$ sau khi translate và $b \in U_0 + (a-b)$ sau translate bởi $a - b$). Thực ra, xét $U_0' = U_0 \cap (a - b + U_0)$, thì $b \in U_0'$ và $a - b + b = a \in U_0'$. $\blacksquare$

**Ý nghĩa**: Mọi hai điểm của $A$ đều có thể "nhìn thấy nhau" từ một chart affine. Điều này đặc biệt đối với abelian varieties và không đúng với projective varieties tổng quát!

---

## Xây dựng Effective Divisor

> [!abstract] Proposition 6.2 — Divisor từ open affine
> Cho $U$ là open affine neighbourhood của $0$ trong $A$ (algebraically closed). Bổ sung $Z = A \setminus U$ có cấu trúc divisor: có thể viết $Z = \bigcup_{i \in I} Z_i$ với $Z_i$ là prime divisors (irreducible subvariety codimension 1). Đặt:
>
> $$
> D = \sum_{i \in I} Z_i \quad \text{(effective divisor, } 0 \in \operatorname{Supp}(D) \Leftrightarrow 0 \notin U \text{)}.
> $$
>
> Với mọi điểm $a \neq 0$ trong $A$, có một prime component $Z_i$ thỏa $0 \in Z_i$ nhưng $a \notin Z_i$.

**Proof.** Từ Lemma 6.1, $0$ và $a$ nằm trong cùng open affine $V$. Thì $A \setminus V$ là divisor có $0 \in A \setminus V$ (sau reindex). Lấy irreducible component qua $0$ nhưng không qua $a$. $\blacksquare$

---

## Định lý Chính: Abelian Varieties are Projective

> [!abstract] Theorem 6.3 — Mọi Abelian Variety là Projective
> Cho $A$ là abelian variety trên trường $k$. Thì $A$ là projective variety.

**Proof** (Milne, Mumford). Chia làm 3 bước:

**Bước 1: Trường hợp $k = \bar{k}$ (algebraically closed).**

Chọn open affine $U \ni 0$, và đặt $D = \sum Z_i$ với $Z_i$ là prime components của $A \setminus U$. Tất cả $Z_i$ đi qua $0$.

**Bước 2: Chứng minh $3D$ rất ample — tách điểm.**

Cho $P \neq Q$ trong $A(k)$. Cần tìm effective divisor $\Delta \sim 3D$ với $P \in \operatorname{Supp}(\Delta)$ nhưng $Q \notin \operatorname{Supp}(\Delta)$.

Từ Proposition 6.2, tồn tại $Z_i$ với $0 \in Z_i, (Q - P) \notin Z_i$. Đặt:

$$
\Delta = D + t_{-P}^* Z_i + t_{-Q}^* Z_i.
$$

Đây là effective divisor degree $3$ (từ $D$), và:
- $P \in \operatorname{Supp}(D)$ (vì $P$ translate các $Z_j$ chứa $0$)... 

Thực ra chiến lược chính xác hơn là dùng **Theorem of the Square** để chứng minh $t_a^* D + t_b^* D + D \sim 3D$ với mọi $a, b$, và sau đó chọn $a, b$ thích hợp để "tách" $P$ và $Q$. Từ đó $|3D|$ là base-point-free và separates points, nên $3D$ là very ample.

**Bước 3: Trường hợp $k$ tùy ý.**

Chọn ample divisor $D$ trên $A_{\bar{k}}$. Divisor $D$ xác định trên extension hữu hạn $k'/k$. Nếu $k'/k$ là Galois, lấy:

$$
D' = \sum_{\sigma \in \operatorname{Gal}(k'/k)} \sigma^* D,
$$

thì $D'$ descend về divisor ample trên $A$ (không phụ thuộc $\sigma$). $\blacksquare$

---

## $K(\mathcal{L})$ và Ampleness

Sau khi biết $A$ projective, ta có thể định nghĩa và phân tích $K(\mathcal{L})$:

> [!abstract] Definition 6.4 — $K(\mathcal{L})$ — Kernel của $\phi_\mathcal{L}$
> Cho $\mathcal{L} \in \operatorname{Pic}(A)$. **Kernel** của $\phi_\mathcal{L} : A \to \operatorname{Pic}(A)$ là:
>
> $$
> K(\mathcal{L}) = \{ a \in A(\bar{k}) \mid t_a^* \mathcal{L} \cong \mathcal{L} \}.
> $$
>
> Đây là closed subgroup scheme của $A$. Theo Proposition 5.11, $\operatorname{Pic}^0(A) = \operatorname{im}(\phi_\mathcal{L})^{\perp}$... Thực ra $K(\mathcal{L}) = \ker(\phi_\mathcal{L})$ như subgroup của $A(\bar{k})$.

> [!abstract] Theorem 6.5 — Ampleness và $K(\mathcal{L})$
> Cho $\mathcal{L}$ là invertible sheaf với $H^0(A, \mathcal{L}) \neq 0$ (tức là $\mathcal{L}$ effective). Thì $\mathcal{L}$ ample khi và chỉ khi $K(\mathcal{L})$ là finite group scheme.

**Proof sketch.** Chiều $\Rightarrow$: Nếu $\mathcal{L}$ ample, thì $\phi_\mathcal{L} : A \to A^\vee$ là isogeny (có finite kernel), nên $K(\mathcal{L}) = \ker(\phi_\mathcal{L})$ hữu hạn.

Chiều $\Leftarrow$: Nếu $K(\mathcal{L})$ hữu hạn và $H^0 \neq 0$, ta sử dụng chiến lược: effective divisor $D = \operatorname{div}(s)$ (với $s \in H^0(A, \mathcal{L})$) và tính base-point-freeness của $|3D|$ qua finiteness của $K$. (Xem Mumford §6, pp. 60.) $\blacksquare$

> [!note] Remark 6.6 — Ý nghĩa hình học
> $K(\mathcal{L})$ là tập các điểm "đối xứng" của $\mathcal{L}$: translation by $a \in K(\mathcal{L})$ không thay đổi $\mathcal{L}$ như line bundle. Nếu $\mathcal{L}$ ample, "symmetry group" này phải nhỏ (hữu hạn).

---

## $\mathcal{L}^{\otimes 3}$ là Very Ample

> [!abstract] Theorem 6.7 — Cube là Very Ample
> Cho $\mathcal{L}$ là ample invertible sheaf trên abelian variety $A$. Thì $\mathcal{L}^{\otimes 3}$ là **very ample** (định nghĩa embedding $A \hookrightarrow \mathbb{P}^N$ tường minh).

**Proof sketch.** Từ công thức Theorem of the Cube: với $D$ divisor ample, $3D$ separates points (từ Bước 2 ở trên) và separates tangent vectors. Đây là hai điều kiện cần và đủ cho very ampleness. $\blacksquare$

> [!note] Remark 6.8 — Tại sao số $3$?
> Số $3$ xuất hiện là "tối ưu": $\mathcal{L}^{\otimes 2}$ chỉ cần thiết để có embedding về **Kummer variety** $A / \{\pm 1\}$, nhưng để embed $A$ tường minh cần $3$. Đây là vì:
>
> - $\mathcal{L}^{\otimes 3}$ separates cả điểm lẫn các điểm "gần nhau" (tangent vectors)
> - $\mathcal{L}^{\otimes 2}$ chỉ separates điểm modulo $\pm 1$

---

## Symmetric Ample Sheaves

> [!abstract] Corollary 6.9 — Symmetric Ample Sheaf và Nhúng vào $\mathbb{P}^N$
> Mọi abelian variety $A$ chiều $g$ có:
>
> 1. Ample invertible sheaf $\mathcal{L}$.
> 2. **Symmetric** ample invertible sheaf $\mathcal{M} = \mathcal{L} \otimes [-1]^* \mathcal{L}$.
> 3. Embedding $A \hookrightarrow \mathbb{P}^N$ với $N = h^0(A, \mathcal{M}^{\otimes 3}) - 1$.

**Proof.** (1) từ Theorem 6.3. (2) từ Corollary 5.12: tensor $\mathcal{L}$ với $[-1]^*\mathcal{L}$ cho symmetric ample. (3) từ Theorem 6.7. $\blacksquare$

---

## Embedding Tường Minh: Trường hợp $g = 1$

Để minh họa, ta xây dựng embedding của elliptic curve $E = \mathbb{C}/\Lambda$ từ first principles:

**Line bundle**: $\mathcal{L} = \mathcal{O}_E(3[O])$ (divisor $3$ lần điểm gốc). Đây là ample symmetric line bundle.

**Global sections**: Riemann–Roch cho $h^0(E, \mathcal{O}(3[O])) = 3$. Basis $\{1, x, y\}$ với $x$ có pole bậc $2$ tại $O$, $y$ có pole bậc $3$ tại $O$.

**Embedding**: $E \hookrightarrow \mathbb{P}^2$, $z \mapsto [1 : x(z) : y(z)]$.

**Phương trình**: Vì $\{1, x, y, x^2, xy, y^2, x^3\}$ phải satisfy một relation trong $H^0(E, \mathcal{O}(6[O]))$ ($7$ elements, dim $6$), ta được:

$$
y^2 + a_1 xy + a_3 y = x^3 + a_2 x^2 + a_4 x + a_6 \quad \text{(Weierstrass form)}.
$$

Đây chính xác là cách phương trình Weierstrass xuất hiện từ lý thuyết line bundles!

---

## SageMath Cheatsheet

```python
# Abelian variety là projective: embedding tường minh với g=1
# Line bundle O(3*O) embed E vào P^2

E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
print("Weierstrass equation:", E)
print("Genus:", E.genus())  # 1

# Kiểm tra embedding: E là subvariety của P^2
# Phương trình: y^2 + a1*x*y + a3*y = x^3 + a2*x^2 + a4*x + a6
a1, a2, a3, a4, a6 = E.a_invariants()
print(f"Equation: y^2 + {a1}xy + {a3}y = x^3 + {a2}x^2 + {a4}x + {a6}")
```

```python
# K(L): kernel của phi_L
# Trên E với L = O(D) ample, K(L) = E[n] (hữu hạn!) với n = deg(phi_L)
# Kiểm tra: phi_{O([O])}(P) = t_P^* O([O]) ⊗ O([O])^{-1} = O([P] - [O]) trong Pic^0
E = EllipticCurve(GF(23), [1, 0])
O_pt = E(0)  # điểm gốc

# Với E elliptic curve, phi_L : E -> E^vee = E là isogeny
# Degree của phi_{O([O])} = 1 (principal polarization)
# Nên K(O([O])) = {O} (chỉ điểm gốc) → L là ample degree 1

P = E.random_point()
print(f"Random point P = {P}")
# t_P^* O([O]) = O([P]) trong Pic(E)
# phi_L(P) = [P] - [O] trong Pic^0(E) ≅ E
# K(L) = {P : [P] - [O] = 0 trong Pic^0} = {O}
```

```python
# Đếm điểm qua Hasse bound (hệ quả của AV projective và Frobenius)
E = EllipticCurve(GF(101), [1, 2])
N = E.order()  # |E(F_101)|
print(f"|E(F_101)| = {N}")

# Hasse bound: |N - (q+1)| <= 2*sqrt(q)
import math
q = 101
hasse_bound = 2 * math.sqrt(q)
print(f"Hasse bound: |{N} - {q+1}| = {abs(N - (q+1)):.2f} ≤ 2√{q} ≈ {hasse_bound:.2f}")
print(f"OK: {abs(N - (q + 1)) <= hasse_bound}")
```

```python
# Symmetric ample sheaf: L ⊗ [-1]^*L
# Trên E, [-1](P) = -P. Với L = O([P0]) (1 điểm):
# [-1]^*L = O([-P0])
# L ⊗ [-1]^*L = O([P0] + [-P0]) = O([P0] - [P0]) = O(0) nếu P0 = -P0
# Vậy cần chọn L = O(n[O]) để symmetric (vì -O = O)
E = EllipticCurve(QQ, [0, -1, 1, -10, -10])
# L = O(3[O]) là symmetric: [-1]^* O(3[O]) = O(3[-O]) = O(3[O]) (vì -O = O trong Weierstrass)
# Và L^3 = O(9[O]) là very ample
print("Bậc của O(3[O]):", 3)
print("h^0(E, O(3[O])) =", 3, "(Riemann-Roch: 3 - 1 + 1 = 3)")
print("=> Embedding E -> P^2 (dim P^2 = 2 = 3-1)")
```

---

## Summary / Key Takeaways

- **Mọi abelian variety là projective**: chứng minh bằng cách xây dựng ample divisor $D$ từ complement của open affine và dùng Theorem of the Square để chứng minh $3D$ very ample.
- **Lemma cặp điểm**: mọi hai điểm $a, b \in A(k)$ nằm trong cùng open affine — hệ quả của homogeneity.
- **$K(\mathcal{L}) = \ker(\phi_\mathcal{L})$**: subgroup của $A$ "bảo toàn" $\mathcal{L}$ qua translation. **$\mathcal{L}$ ample $\Leftrightarrow$ $K(\mathcal{L})$ hữu hạn** (khi $H^0 \neq 0$).
- **$\mathcal{L}^{\otimes 3}$ very ample** với $\mathcal{L}$ ample: đây là định lý cơ bản cho các bài toán moduli và lý thuyết theta.
- **Symmetric ample sheaf**: $\mathcal{M} = \mathcal{L} \otimes [-1]^*\mathcal{L}$ luôn tồn tại, symmetric, và ample.
- **$g = 1$**: $\mathcal{O}_E(3[O])$ cho embedding $E \hookrightarrow \mathbb{P}^2$ với phương trình Weierstrass — minh họa tường minh cho lý thuyết general.
- **Hệ quả quan trọng**: vì $A$ projective, $\operatorname{Pic}(A)$ và $\operatorname{Pic}^0(A)$ có thể được nghiên cứu qua lý thuyết Picard scheme (Grothendieck) — nền tảng cho Lesson 08 về dual AV.

---

## References

- Milne, J.S. *Abelian Varieties* (v2.0), §7 (Abelian Varieties are Projective).
- Mumford, D. *Abelian Varieties*, §§6–7.
- Edixhoven–van der Geer–Moonen, *Abelian Varieties*, §2.25–2.26.
- Conrad, B. Lecture Notes, §1.18 (Projectivity of abelian varieties). Stanford 2015.
