---
title: "12. Galois Groups của Polynomials"
tags: [math, galois-theory, lesson-12]
aliases: [Galois Groups của Polynomials]
created: 2026-03-24
---

> **Prerequisites**: [[08-fundamental-theorem|08. Fundamental Theorem of Galois Theory]], [[09-cyclotomic-extensions|09. Cyclotomic Extensions]]
> **Objectives**:
> - Định nghĩa discriminant của polynomial và tính chất liên hệ với $A_n$
> - Tính Galois group của cubic: dùng discriminant
> - Tính Galois group của quartic: dùng resolvent cubic và discriminant
> - Hiểu $\operatorname{Gal}(f) \hookrightarrow S_n$ như transitive subgroup
> - Áp dụng thuật toán cho các ví dụ cụ thể

---

## Motivation / Intuition

FTGT nói Galois group mã hóa cấu trúc của extension. Nhưng làm sao tính Galois group của một đa thức cụ thể $f \in \mathbb{Q}[x]$?

Với bậc nhỏ (2, 3, 4), có thuật toán hoàn toàn tường minh: chỉ cần tính **discriminant** và **resolvent cubic**. Đây là công cụ cổ điển của Lagrange và Galois, nhưng hiểu bằng ngôn ngữ hiện đại của Galois Theory.

Hai công cụ chính:
- **Discriminant**: phân biệt $A_n$ với $S_n$ bằng cách kiểm tra $\sqrt{\Delta} \in K$ hay không.
- **Resolvent polynomial**: các đa thức phụ trợ mà Galois group của chúng cho biết cấu trúc của Galois group ban đầu.

---

## Discriminant và Alternating Group

### Định nghĩa

> [!definition] Definition 12.1 — Discriminant
> Cho $f(x) \in K[x]$ separable với nghiệm $\alpha_1, \ldots, \alpha_n$ trong splitting field $L$. **Discriminant** của $f$ là:
>
> $$
> \Delta(f) = \prod_{i < j} (\alpha_i - \alpha_j)^2
> $$
>
> Đặt $\delta = \prod_{i < j} (\alpha_i - \alpha_j)$ (square root của discriminant). Khi đó $\Delta = \delta^2$.

> [!abstract] Theorem 12.2 — Discriminant nằm trong $K$
> $\Delta(f) \in K$.

**Proof.** Mọi $\sigma \in G = \operatorname{Gal}(L/K)$ hoán vị $\{\alpha_i\}$. Dưới hoán vị, $\prod_{i<j}(\alpha_i - \alpha_j)^2$ không đổi (chỉ thay đổi thứ tự các nhân tử và dấu, nhưng bình phương nên dấu biến mất). Vậy $\Delta \in L^G = K$. $\blacksquare$

> [!abstract] Theorem 12.3 — Discriminant và Alternating Group
> Với $G = \operatorname{Gal}(f) \leq S_n$:
>
> $$
> G \subseteq A_n \iff \delta \in K \iff \Delta \text{ là bình phương trong } K
> $$

**Proof.** $\sigma(\delta) = \pm \delta$ theo parity của $\sigma$: transposition $\leftrightarrow$ đổi dấu. Nên $\sigma(\delta) = \delta$ $\forall \sigma \in G$ $\iff$ mọi $\sigma$ là even permutation $\iff$ $G \subseteq A_n$. Và $\sigma(\delta) = \delta$ $\forall \sigma$ $\iff$ $\delta \in L^G = K$. $\blacksquare$

> [!note] Remark 12.4 — Công thức Discriminant cho bậc thấp
> - **Bậc 2**: $f = x^2 + bx + c$. $\Delta = b^2 - 4c$.
> - **Bậc 3** (dạng depressed $x^3 + px + q$): $\Delta = -4p^3 - 27q^2$.
> - **Bậc 4** (dạng $x^4 + bx^2 + cx + d$): công thức phức tạp hơn, xem ví dụ bên dưới.

---

## Galois Group của Cubic

Cho $f(x) \in K[x]$ irreducible, separable, bậc 3. Thì $\operatorname{Gal}(f) \hookrightarrow S_3$.

Các transitive subgroups của $S_3$: $A_3 \cong \mathbb{Z}/3\mathbb{Z}$ và $S_3$.

> [!abstract] Theorem 12.5 — Galois Group của Cubic
> Cho $f \in K[x]$ irreducible bậc 3, char $K \neq 2, 3$.
>
> $$
> \operatorname{Gal}(f) \cong \begin{cases} A_3 \cong \mathbb{Z}/3\mathbb{Z} & \text{nếu } \Delta(f) \text{ là bình phương trong } K \\ S_3 & \text{nếu } \Delta(f) \text{ không là bình phương trong } K \end{cases}
> $$

**Proof.** $\operatorname{Gal}(f)$ là transitive subgroup của $S_3$ và chia hết cho 3 (vì $f$ irreducible bậc 3 → $[K(\alpha):K] = 3$ chia $|\operatorname{Gal}|$). Các transitive subgroups của $S_3$ chia hết cho 3 chỉ có $A_3$ và $S_3$. Từ Theorem 12.3: $\operatorname{Gal} \subseteq A_3 \iff \Delta$ là bình phương. $\blacksquare$

> [!example] Example 12.6 — Galois group của $x^3 - 3x + 1$
> $f(x) = x^3 - 3x + 1 \in \mathbb{Q}[x]$. Kiểm tra rational roots: $\pm 1$ không phải nghiệm. Vậy $f$ irreducible over $\mathbb{Q}$.
>
> $\Delta = -4(-3)^3 - 27(1)^2 = 108 - 27 = 81 = 9^2$.
>
> $\Delta$ là bình phương hoàn toàn trong $\mathbb{Q}$. Vậy $\operatorname{Gal}(f) \cong A_3 \cong \mathbb{Z}/3\mathbb{Z}$.
>
> (Nghĩa là: ba nghiệm của $f$ liên hệ với nhau bằng cách rất "đối xứng" — mọi hoán vị là cyclic.)

> [!example] Example 12.7 — Galois group của $x^3 - 2$
> $f(x) = x^3 - 2$. Irreducible bởi Eisenstein.
>
> Dạng depressed: $p = 0$, $q = -2$. $\Delta = -4(0)^3 - 27(-2)^2 = -108$.
>
> $-108 = -4 \cdot 27$ không là bình phương trong $\mathbb{Q}$ (vì âm). Vậy $\operatorname{Gal}(x^3 - 2) \cong S_3$.

---

## Galois Group của Quartic

Cho $f(x) \in K[x]$ irreducible, separable, bậc 4. Thì $\operatorname{Gal}(f) \hookrightarrow S_4$ transitive.

Các transitive subgroups của $S_4$: $V_4 = \{1, (12)(34), (13)(24), (14)(23)\}$, $\mathbb{Z}/4\mathbb{Z}$, $D_4$, $A_4$, $S_4$.

### Resolvent Cubic

> [!definition] Definition 12.8 — Resolvent Cubic
> Cho $f(x) = x^4 + bx^3 + cx^2 + dx + e \in K[x]$ với nghiệm $\alpha_1, \alpha_2, \alpha_3, \alpha_4$. **Resolvent cubic** của $f$ là:
>
> $$
> R_3(x) = (x - \beta_1)(x - \beta_2)(x - \beta_3)
> $$
>
> trong đó:
>
> $$
> \beta_1 = \alpha_1\alpha_2 + \alpha_3\alpha_4, \quad \beta_2 = \alpha_1\alpha_3 + \alpha_2\alpha_4, \quad \beta_3 = \alpha_1\alpha_4 + \alpha_2\alpha_3
> $$
>
> $R_3$ có hệ số trong $K$ (vì $\beta_i$ là symmetric functions của nghiệm) và được tính từ hệ số của $f$:
>
> $$
> R_3(x) = x^3 - cx^2 + (bd - 4e)x - (b^2 e - 4ce + d^2)
> $$

Đặc biệt với dạng $f(x) = x^4 + px^2 + qx + r$ (hệ số $x^3 = 0$):
$$
R_3(x) = x^3 - px^2 - 4rx + (4pr - q^2)
$$

> [!abstract] Theorem 12.9 — Phân loại Galois Group của Quartic
> Cho $f \in K[x]$ irreducible bậc 4 (char $\neq 2$), với $\Delta = \Delta(f)$ và $R_3$ là resolvent cubic.
>
> | $\Delta$ bình phương? | $R_3$ irreducible? | $\operatorname{Gal}(f)$ |
> |---|---|---|
> | Không | Có | $S_4$ |
> | Có | Có | $A_4$ |
> | Không | Không | $D_4$ hoặc $\mathbb{Z}/4\mathbb{Z}$ |
> | Có | Không (splits completely) | $V_4$ |
>
> *Để phân biệt $D_4$ và $\mathbb{Z}/4\mathbb{Z}$: kiểm tra xem $f$ có irreducible trên $K(\sqrt{\Delta})$ hay không.*

**Ý tưởng chứng minh.** $\operatorname{Gal}(f)$ tác động trên $\{\beta_1, \beta_2, \beta_3\}$, cho injection $\operatorname{Gal}(f) \to S_3$ — đây chính là Galois group của $R_3$. Subgroup $V_4 \trianglelefteq S_4$ tương ứng với subfield $K(\beta_1, \beta_2, \beta_3)$. Từ đây, $R_3$ irreducible $\iff$ $[K(\beta_1, \beta_2, \beta_3):K] = 6 \iff \operatorname{Gal}(f) \to S_3$ surjective $\iff$ $\operatorname{Gal}(f) \in \{S_4, A_4\}$. Kết hợp với discriminant để chọn. $\blacksquare$

### Ví dụ tính Galois group của Quartic

> [!example] Example 12.10 — $f(x) = x^4 - 2$
> $f$ irreducible (Eisenstein, $p = 2$). Các nghiệm: $\pm\sqrt[4]{2}$, $\pm i\sqrt[4]{2}$.
>
> Với $f = x^4 + 0 \cdot x^3 + 0 \cdot x^2 + 0 \cdot x - 2$ nên $b=0, c=0, d=0, e=-2$:
>
> $$
> R_3 = x^3 - cx^2 + (bd - 4e)x - (b^2 e - 4ce + d^2) = x^3 + 8x
> $$
>
> $R_3 = x(x^2 + 8)$: nghiệm hữu tỉ $x = 0$ tồn tại, nhưng nhân tử $x^2 + 8$ irreducible over $\mathbb{Q}$. Vậy $R_3$ **không** split hoàn toàn, nhưng **không** irreducible.
>
> $\Delta(R_3) = \Delta(f)$. Tính: $\Delta(x^3 + 8x) = -4(8)^3 - 27(0)^2 = -2048$. Không là bình phương trong $\mathbb{Q}$.
>
> Bảng Theorem 12.9: $R_3$ không irreducible + $\Delta$ không bình phương $\rightarrow$ **$D_4$ hoặc $\mathbb{Z}/4\mathbb{Z}$**.
>
> Để phân biệt: kiểm tra $f$ trên $K(\sqrt{\Delta}) = \mathbb{Q}(\sqrt{-2048}) = \mathbb{Q}(i\sqrt{2})$: $f$ vẫn irreducible trên đó (degree $4$ splitting field vẫn có degree $8$ over $\mathbb{Q}$) → **$D_4$**. Đúng như ta đã tính từ Lesson 07!

> [!example] Example 12.11 — $f(x) = x^4 - 5x^2 + 6$
> $f(x) = (x^2 - 2)(x^2 - 3)$: **reducible** — không áp dụng Theorem 12.9.
>
> Splitting field là $\mathbb{Q}(\sqrt{2}, \sqrt{3})$, $G \cong V_4$. Đây là ví dụ không cần dùng công thức vì $f$ reducible.

> [!example] Example 12.12 — $f(x) = x^4 + 8x + 12$
> Kiểm tra irreducibility: không có nghiệm hữu tỉ (kiểm tra $\pm 1, \pm 2, \pm 3, \pm 4, \pm 6, \pm 12$). Mod $5$: $f \equiv x^4 + 3x + 2$, và đây irreducible trên $\mathbb{F}_5$ (kiểm tra không có nghiệm và không split thành hai quadratics). Vậy $f$ irreducible.
>
> $b = 0, c = 0, d = 8, e = 12$. Resolvent:
>
> $R_3 = x^3 - 0 - 4(12)x - (0 - 0 + 64) = x^3 - 48x - 64$.
>
> Kiểm tra nghiệm nguyên của $R_3$: $\pm 1, \pm 2, \pm 4, \pm 8, \pm 16, \pm 64$. Thử $x = -4$: $(-4)^3 - 48(-4) - 64 = -64 + 192 - 64 = 64 \neq 0$. Thử $x = 8$: $512 - 384 - 64 = 64 \neq 0$. Thử $x = -2$: $-8 + 96 - 64 = 24 \neq 0$. Vậy $R_3$ không có nghiệm hữu tỉ, nên **$R_3$ irreducible**.
>
> $\Delta(f) = \Delta(R_3) = -4(-48)^3 - 27(-64)^2 = 4 \cdot 110592 - 110592 = 331776 = 576^2$.
>
> $\Delta$ là bình phương và $R_3$ irreducible $\rightarrow$ $\operatorname{Gal}(f) \cong \mathbf{A_4}$.

---

## Galois group qua Reduction mod $p$

Một kỹ thuật hữu ích: **reduce mod $p$** để lấy thông tin về Galois group.

> [!abstract] Theorem 12.13 — Frobenius/Chebotarev Density Principle (version đơn giản)
> Cho $f \in \mathbb{Z}[x]$ monic irreducible. Nếu $f \pmod{p}$ (với $p \nmid \Delta(f)$) phân tích thành các irreducibles bậc $d_1, d_2, \ldots, d_k$ trong $\mathbb{F}_p[x]$, thì $\operatorname{Gal}(f) \subseteq S_n$ chứa một permutation với cycle type $(d_1, d_2, \ldots, d_k)$.

Kỹ thuật thực hành: kiểm tra factorization của $f$ mod nhiều primes khác nhau để xác định cycle types có trong $G$, từ đó xác định $G$.

> [!example] Example 12.14 — Dùng reduction mod p
> $f(x) = x^5 - x - 1$. Mod 2: $f \equiv x^5 + x + 1$, có nghiệm $x = 1$ ($1 + 1 + 1 = 1 \neq 0$ trong $\mathbb{F}_2$)... thử: $f(0) = 1, f(1) = 1$. Không có nghiệm, kiểm tra xem có factor bậc 2: $x^2 + x + 1$ chia $f$? Chia $x^5 + x + 1$ cho $x^2 + x + 1$: $x^5 + x + 1 = (x^2+x+1)(x^3+x^2) + x+1$. Không chia hết. Vậy $f$ mod $2$ là irreducible bậc 5 → $G$ chứa 5-cycle.
>
> Mod 3: $f \equiv x^5 + 2x + 2$. Kiểm tra: $f(0) = 2, f(1) = 4 \equiv 1, f(2) = 32 + 4 + 2 = 38 \equiv 2$. Không có nghiệm tuyến tính. Factor thành $(x^2+?)(x^3+?)$... Nếu không có, $f$ mod $3$ irreducible → $G$ chứa 5-cycle. Nhưng nếu phân tích thành quadratic $\times$ cubic → cycle type $(2,3)$ → transposition × 3-cycle.
>
> Nếu $G$ chứa 5-cycle và transposition thì $G = S_5$ (đây là một lemma cơ bản).

---

## SageMath Cheatsheet

```sage
K = QQ
Kx.<x> = PolynomialRing(K)

f = x^3 - 3*x + 1
print(f.is_irreducible())
disc = f.discriminant()
print(disc, disc.is_square())

g = x^3 - 2
print(g.discriminant())

f4 = x^4 - 2
L4 = f4.splitting_field('a')
print(L4.galois_group().structure_description())

f5 = x^4 + 8*x + 12
print(f5.discriminant())
print(f5.galois_group())

f6 = x^4 - 5*x^2 + 6
print(f6.factor())

f7 = x^3 - 3*x - 1
Fp = f7.change_ring(GF(7))
print(Fp.factor())
```

---

## Summary / Key Takeaways

- **Discriminant** $\Delta = \prod_{i<j}(\alpha_i - \alpha_j)^2 \in K$: kiểm tra $G \subseteq A_n$.
- **Cubic** $f$ irreducible: $G \cong A_3$ nếu $\Delta$ là bình phương; $G \cong S_3$ nếu không.
- **Quartic** $f$ irreducible: phân loại $G$ qua bảng (discriminant + resolvent cubic).
  - $R_3$ irreducible + $\Delta$ không bình phương → $S_4$
  - $R_3$ irreducible + $\Delta$ bình phương → $A_4$
  - $R_3$ không irreducible + $\Delta$ không bình phương → $D_4$ hoặc $\mathbb{Z}/4$
  - $R_3$ splits completely + $\Delta$ bình phương → $V_4$
- **Reduction mod $p$**: cycle type factorization mod $p$ → cycle type trong $G$.
- Công cụ này chính là công cụ mà Galois dùng để nghiên cứu solvability of equations.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §14.6, §14.8.
- Conrad, K. *Galois Groups of Cubics and Quartics*. Có tại https://kconrad.math.uconn.edu/blurbs/galoistheory/cubicquartic.pdf
- Stewart, I. *Galois Theory* (4th ed.), Chapters 14–15.
- Cox, D. A. *Galois Theory* (2nd ed.), §4.
