---
title: "03. Tensor Product and Hom"
tags: [math, commutative-algebra, lesson-03]
aliases: [Tensor Product and Hom]
created: 2026-03-29
---

> **Prerequisites**: [[02-modules|02. Modules]]
> **Objectives**:
> - Hiểu tensor product qua universal property và xây dựng tường minh
> - Tính toán tensor product trong các ví dụ cụ thể
> - Phân biệt right-exactness của $\otimes$ và left-exactness của $\operatorname{Hom}$
> - Hiểu flatness là điều kiện để $\otimes$ bảo toàn exactness

---

## Motivation / Intuition

Trong đại số tuyến tính cổ điển, có hai phép toán cơ bản trên các không gian vector: tích trực tiếp $V \oplus W$ (gộp hai không gian) và tích tensor $V \otimes W$ (tạo ra không gian "tích"). Khi chuyển sang module trên vành tổng quát, tích tensor $M \otimes_R N$ vẫn tồn tại và đóng vai trò không thể thiếu.

Tại sao cần tensor product? Hãy xét hai tình huống:

**Tình huống 1 — Thay đổi vành nền (base change):** Cho $R$-module $M$ và ring homomorphism $f: R \to S$. Ta muốn "xem $M$ như một $S$-module". Câu trả lời là $S \otimes_R M$: đây là $S$-module tốt nhất được tạo ra từ $M$ bằng cách mở rộng hệ số từ $R$ lên $S$.

**Tình huống 2 — Bilinear maps:** Tensor product phân loại tất cả các bilinear maps $M \times N \to P$: một bilinear map $M \times N \to P$ tương ứng 1-1 với một linear map $M \otimes_R N \to P$.

Còn $\operatorname{Hom}_R(M, N)$? Đây là module của tất cả các "cách chuyển" từ $M$ sang $N$. Cặp $(\otimes, \operatorname{Hom})$ kết nối với nhau qua **adjunction**: $\operatorname{Hom}_R(M \otimes_R N, P) \cong \operatorname{Hom}_R(M, \operatorname{Hom}_R(N, P))$.

Bài học này cũng giới thiệu **flatness** — tính chất then chốt sẽ xuất hiện lại trong localization (Bài 04) và homological algebra (Bài 13).

---

## Tensor Product of Modules

### Definition

> [!info] Definition 3.1 — Tensor Product (qua Universal Property)
>
> Cho $M$, $N$ là $R$-modules. **Tensor product** $M \otimes_R N$ là $R$-module cùng một bilinear map $\otimes: M \times N \to M \otimes_R N$, $(m, n) \mapsto m \otimes n$, thỏa **universal property**: với mọi $R$-module $P$ và bilinear map $f: M \times N \to P$, tồn tại duy nhất $R$-module homomorphism $\bar{f}: M \otimes_R N \to P$ sao cho $\bar{f}(m \otimes n) = f(m, n)$.
>
> $$
> \begin{array}{ccc}
> M \times N & \xrightarrow{\otimes} & M \otimes_R N \\
> & \searrow^{f} & \downarrow^{\exists!\, \bar{f}} \\
> & & P
> \end{array}
> $$

> [!info] Definition 3.2 — Xây dựng tường minh
>
> $M \otimes_R N$ được xây dựng như sau: lấy $R$-module tự do $F$ sinh bởi tập $M \times N$, sau đó chia cho submodule $D$ sinh bởi các quan hệ:
>
> - $(m + m', n) - (m, n) - (m', n)$
> - $(m, n + n') - (m, n) - (m, n')$
> - $(rm, n) - r(m, n)$
> - $(m, rn) - r(m, n)$
>
> Khi đó $M \otimes_R N = F/D$, và $m \otimes n$ là lớp tương đương của $(m, n)$.

> [!note] Remark 3.3 — Phần tử của $M \otimes_R N$
>
> Các phần tử của $M \otimes_R N$ là **tổng hữu hạn** $\sum_i m_i \otimes n_i$, không nhất thiết là một tensor đơn $m \otimes n$. Đây là nguồn gốc của nhiều tính toán không trực quan.
>
> Các quy tắc cơ bản:
>
> - $(m_1 + m_2) \otimes n = m_1 \otimes n + m_2 \otimes n$
> - $m \otimes (n_1 + n_2) = m \otimes n_1 + m \otimes n_2$
> - $(rm) \otimes n = r(m \otimes n) = m \otimes (rn)$
> - $0 \otimes n = 0 = m \otimes 0$

### Worked Example

> [!example] Example 3.4 — Tính tensor product
>
> **Ví dụ 1:** $\mathbb{Z}/m\mathbb{Z} \otimes_\mathbb{Z} \mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}/\gcd(m,n)\mathbb{Z}$.
>
> *Chứng minh:* Xét bilinear map $f: \mathbb{Z}/m \times \mathbb{Z}/n \to \mathbb{Z}/d$ ($d = \gcd(m,n)$), $f(\bar{a}, \bar{b}) = \overline{ab}$ (well-defined vì $d \mid m, d \mid n$). Ngược lại, phần tử $\bar{1} \otimes \bar{1}$ sinh $\mathbb{Z}/m \otimes \mathbb{Z}/n$ (vì $\bar{a} \otimes \bar{b} = \bar{1} \otimes \overline{ab}$), và $d(\bar{1} \otimes \bar{1}) = \bar{d} \otimes \bar{1} = \bar{0} \otimes \bar{1} = 0$. Kiểm tra đây là bậc tối giản.
>
> **Ví dụ 2:** $\mathbb{Z}/2\mathbb{Z} \otimes_\mathbb{Z} \mathbb{Z}/3\mathbb{Z} = 0$.
>
> *Vì* $\gcd(2,3) = 1$, mọi phần tử $m \otimes n$ thỏa $m \otimes n = m \otimes (1 \cdot n) = m \otimes (3 \cdot \frac{n}{3})$... thực ra: $m \otimes n = 3m \otimes \frac{n}{3}$? Không, cách ngắn hơn: $m \otimes n = m \otimes (3k) = 3(m \otimes k) = (3m) \otimes k = 0 \otimes k = 0$ (vì $3m = 0$ trong $\mathbb{Z}/3$... chờ, $m \in \mathbb{Z}/2$). Đúng hơn: $m \otimes n = m \otimes (3 \cdot \frac{n+n+n}{3})$... Ta dùng $2m = 0$ và $3n = 0$: $m \otimes n = (3m) \otimes n - 2m \otimes n = 3(m \otimes n) - 2(m \otimes n) = m \otimes (3n) - 2(m \otimes n) = 0 - 0 = 0$.
>
> **Ví dụ 3:** $R[x] \otimes_R R[y] \cong R[x, y]$.
>
> *Vì* basis của $R[x]$ là $\{1, x, x^2, \ldots\}$ và của $R[y]$ là $\{1, y, y^2, \ldots\}$, tensor product có basis $\{x^i \otimes y^j\}$, tương ứng với $\{x^i y^j\}$ trong $R[x,y]$.

### Theorem

> [!abstract] Theorem 3.5 — Các đẳng thức căn bản của Tensor Product
>
> Cho $M$, $N$, $P$ là $R$-modules. Khi đó:
>
> 1. **Giao hoán**: $M \otimes_R N \cong N \otimes_R M$, $m \otimes n \mapsto n \otimes m$.
> 2. **Kết hợp**: $(M \otimes_R N) \otimes_R P \cong M \otimes_R (N \otimes_R P)$.
> 3. **Đơn vị**: $R \otimes_R M \cong M$, $r \otimes m \mapsto rm$.
> 4. **Phân phối**: $\left(\bigoplus_i M_i\right) \otimes_R N \cong \bigoplus_i (M_i \otimes_R N)$.

**Proof (của 3).** Bilinear map $f: R \times M \to M$, $(r, m) \mapsto rm$ cho homomorphism $\bar{f}: R \otimes_R M \to M$. Chiều ngược: $g: M \to R \otimes_R M$, $m \mapsto 1 \otimes m$ là homomorphism. Kiểm tra $\bar{f} \circ g = \operatorname{id}_M$ và $g \circ \bar{f} = \operatorname{id}$. $\blacksquare$

---

## $\operatorname{Hom}$ và Adjunction

### Definition

> [!info] Definition 3.6 — $\operatorname{Hom}_R(M, N)$
>
> Với $M$, $N$ là $R$-modules, tập:
>
> $$
> \operatorname{Hom}_R(M, N) = \{f: M \to N \mid f \text{ là } R\text{-module homomorphism}\}
> $$
>
> là một $R$-module với phép cộng $(f+g)(m) = f(m) + g(m)$ và nhân vô hướng $(rf)(m) = r \cdot f(m)$.

### Theorem

> [!abstract] Theorem 3.7 — Tensor-Hom Adjunction
>
> Với $R$-modules $M$, $N$, $P$, có đẳng cấu tự nhiên (natural isomorphism):
>
> $$
> \operatorname{Hom}_R(M \otimes_R N, P) \;\cong\; \operatorname{Hom}_R(M, \operatorname{Hom}_R(N, P))
> $$

**Proof.** Với $f \in \operatorname{Hom}_R(M \otimes_R N, P)$, định nghĩa $\varphi(f) \in \operatorname{Hom}_R(M, \operatorname{Hom}_R(N,P))$ bởi $[\varphi(f)(m)](n) = f(m \otimes n)$. Ngược lại với $g \in \operatorname{Hom}_R(M, \operatorname{Hom}_R(N,P))$, định nghĩa $\psi(g): M \otimes N \to P$ bởi $\psi(g)(m \otimes n) = [g(m)](n)$ (well-defined vì $\psi(g)$ là bilinear). Kiểm tra $\varphi, \psi$ là nghịch đảo nhau và là $R$-module homomorphism. $\blacksquare$

---

## Exactness: $\otimes$ và $\operatorname{Hom}$

### Theorem

> [!abstract] Theorem 3.8 — Right-exactness của Tensor Product
>
> Cho $M' \xrightarrow{f} M \xrightarrow{g} M'' \to 0$ là exact sequence của $R$-modules. Khi đó với mọi $R$-module $N$, dãy sau cũng exact:
>
> $$
> M' \otimes_R N \xrightarrow{f \otimes \operatorname{id}} M \otimes_R N \xrightarrow{g \otimes \operatorname{id}} M'' \otimes_R N \to 0
> $$
>
> Tức là $\otimes_R N$ là **right-exact functor** (bảo toàn exactness ở vế phải).

**Proof (phác thảo).** Surjectivity ở vế phải: với $m'' \otimes n \in M'' \otimes N$, lấy $m \in M$ với $g(m) = m''$, thì $(g \otimes \operatorname{id})(m \otimes n) = m'' \otimes n$. Exactness ở giữa: $\operatorname{Im}(f \otimes \operatorname{id}) \subseteq \ker(g \otimes \operatorname{id})$ (vì $g \circ f = 0$). Chiều $\supseteq$: dùng universal property để xây dựng ánh xạ nghịch. $\blacksquare$

> [!warning] Counterexample 3.9 — $\otimes$ không left-exact
>
> Xét $0 \to \mathbb{Z} \xrightarrow{\times 2} \mathbb{Z}$ (exact vì $\times 2$ là injective). Tensor với $\mathbb{Z}/2\mathbb{Z}$:
>
> $$
> \mathbb{Z}/2\mathbb{Z} \xrightarrow{\times 2 \otimes \operatorname{id}} \mathbb{Z}/2\mathbb{Z}
> $$
>
> Ánh xạ $\times 2 \otimes \operatorname{id}$ gửi $\bar{a} \otimes \bar{b} \mapsto \overline{2a} \otimes \bar{b} = \bar{0} \otimes \bar{b} = 0$. Vậy ánh xạ này là $0$ — **không injective** dù $\times 2$ trên $\mathbb{Z}$ là injective. Đây là lý do xuất hiện $\operatorname{Tor}$ (Bài 13).

### Theorem

> [!abstract] Theorem 3.10 — Left-exactness của $\operatorname{Hom}$
>
> Cho $0 \to M' \xrightarrow{f} M \xrightarrow{g} M''$ là exact sequence. Với mọi $R$-module $N$:
>
> $$
> 0 \to \operatorname{Hom}_R(M'', N) \xrightarrow{g^*} \operatorname{Hom}_R(M, N) \xrightarrow{f^*} \operatorname{Hom}_R(M', N)
> $$
>
> là exact (tức $\operatorname{Hom}_R(-, N)$ là **left-exact contravariant functor**).
>
> Tương tự, $\operatorname{Hom}_R(N, -)$ là **left-exact covariant functor**: $0 \to M' \to M \to M''$ exact kéo theo $0 \to \operatorname{Hom}_R(N, M') \to \operatorname{Hom}_R(N, M) \to \operatorname{Hom}_R(N, M'')$ exact.

**Proof.** Xét $\operatorname{Hom}(-, N)$. Injectivity của $g^*$: nếu $g^*(h) = h \circ g = 0$ thì $h = 0$ vì $g$ surjective. Exactness tại $\operatorname{Hom}(M, N)$: $\ker f^* = \{\varphi : \varphi \circ f = 0\} = \{\varphi : \operatorname{Im} f \subseteq \ker \varphi\}$. Vì $\operatorname{Im} f = \ker g$, mọi $\varphi$ với $\varphi|_{\ker g} = 0$ factor qua $M'' = M/\ker g$, tức thuộc $\operatorname{Im} g^*$. $\blacksquare$

> [!warning] Counterexample 3.11 — $\operatorname{Hom}$ không right-exact
>
> Xét $\mathbb{Z} \xrightarrow{\times 2} \mathbb{Z} \to \mathbb{Z}/2\mathbb{Z} \to 0$ (exact). Áp dụng $\operatorname{Hom}_\mathbb{Z}(-, \mathbb{Z})$:
>
> $$
> \operatorname{Hom}(\mathbb{Z}/2\mathbb{Z}, \mathbb{Z}) \to \operatorname{Hom}(\mathbb{Z}, \mathbb{Z}) \xrightarrow{(\times 2)^*} \operatorname{Hom}(\mathbb{Z}, \mathbb{Z})
> $$
>
> Ta có $\operatorname{Hom}(\mathbb{Z}/2\mathbb{Z}, \mathbb{Z}) = 0$ (không có homomorphism $\neq 0$ từ $\mathbb{Z}/2$ vào $\mathbb{Z}$), còn $(\times 2)^*: f \mapsto f \circ (\times 2)$ là injective nhưng không surjective (vì $\operatorname{id}_\mathbb{Z}$ không trong image). Vậy dãy không exact ở vế phải. Đây là lý do xuất hiện $\operatorname{Ext}$ (Bài 13).

---

## Flat Modules

### Definition

> [!info] Definition 3.12 — Flat Module (Module Phẳng)
>
> $R$-module $N$ được gọi là **flat** (phẳng) nếu functor $- \otimes_R N$ là **exact**: tức là với mọi short exact sequence $0 \to M' \to M \to M'' \to 0$, dãy:
>
> $$
> 0 \to M' \otimes_R N \to M \otimes_R N \to M'' \otimes_R N \to 0
> $$
>
> cũng exact (đặc biệt là vế trái injective).

> [!example] Example 3.13 — Ví dụ về flat modules
>
> - **$R$ tự do hạng hữu hạn** $R^n$: flat (vì $M \otimes_R R^n \cong M^n$, và taking direct sums bảo toàn exactness).
> - **Trường $k$**: mọi $k$-module (không gian vector) đều flat vì mọi không gian vector đều free.
> - **$\mathbb{Z}/2\mathbb{Z}$ như $\mathbb{Z}$-module**: **không flat** (theo Counterexample 3.9).
> - **$\mathbb{Q}$ như $\mathbb{Z}$-module**: flat (vì $\mathbb{Q} = S^{-1}\mathbb{Z}$ là localization — xem Bài 04; localization luôn flat).

### Theorem

> [!abstract] Theorem 3.14 — Đặc trưng của Flatness
>
> Các điều sau tương đương cho $R$-module $N$:
>
> 1. $N$ là flat.
> 2. Với mọi ideal $\mathfrak{a} \subseteq R$: $\mathfrak{a} \otimes_R N \hookrightarrow R \otimes_R N \cong N$ (tức inclusion $\mathfrak{a} \hookrightarrow R$ kéo theo injection $\mathfrak{a} \otimes N \hookrightarrow N$).
> 3. (Lazard) $N$ là colimit trực tiếp của các free modules hữu hạn hạng.

**Proof (1 $\Leftrightarrow$ 2, một chiều).** $(1 \Rightarrow 2)$: Dãy $0 \to \mathfrak{a} \to R$ exact, tensor với $N$ (flat) cho $0 \to \mathfrak{a} \otimes N \to R \otimes N \cong N$. $(2 \Rightarrow 1)$: Cần kiểm tra injectivity tổng quát hơn, được rút gọn về điều kiện (2) bằng Lazard's theorem. $\blacksquare$

> [!note] Remark 3.15 — Flatness trong Localization
>
> Đây là lý do quan trọng nhất để học flatness ngay bây giờ: ở Bài 04, ta sẽ thấy mọi module localized $S^{-1}M$ đều flat như $R$-module. Flatness chính là tính chất cho phép localization "không làm mất thông tin" về exactness.

---

## SageMath Cheatsheet

```sage
# Tensor product của modules (qua không gian vector)
V = QQ^3
W = QQ^2
T = V.tensor_product(W)
T.dimension()   # 6 = 3 * 2

# Tensor product của vành đa thức
R.<x> = QQ[]
S.<y> = QQ[]
# R tensor_QQ S ~ QQ[x, y]
R2.<x, y> = QQ[]   # isomorphic to tensor product

# Hom giữa các modules
M = ZZ^2
N = ZZ^3
H = M.Hom(N)   # tập các ZZ-module homomorphisms
H.an_element()

# Kiểm tra flatness (qua algebra)
R.<x,y> = QQ[]
I = R.ideal(x, y)
# Flat module: kiểm tra Tor = 0
# (dùng Macaulay2 hoặc Singular cho tính toán đầy đủ)

# Tensor product của vành (base change)
R = ZZ
S = GF(2)   # Z/2Z
M = ZZ^2
# S tensor_Z M ~ (Z/2Z)^2 (reduction mod 2)
M_mod2 = M.change_ring(S)
M_mod2
```

---

## Summary / Key Takeaways

- **Tensor product** $M \otimes_R N$ phân loại bilinear maps: $\operatorname{Hom}_R(M \otimes N, P) \cong \operatorname{Bil}(M \times N, P)$.
- Phần tử của $M \otimes N$ là tổng hữu hạn $\sum m_i \otimes n_i$, không phải luôn là tensor đơn.
- $\mathbb{Z}/m \otimes_\mathbb{Z} \mathbb{Z}/n \cong \mathbb{Z}/\gcd(m,n)$: tensor product có thể "triệt tiêu" thông tin.
- **Tensor-Hom Adjunction**: $\operatorname{Hom}(M \otimes N, P) \cong \operatorname{Hom}(M, \operatorname{Hom}(N, P))$.
- $\otimes_R N$ là **right-exact** nhưng không left-exact → sai lệch được đo bởi $\operatorname{Tor}$.
- $\operatorname{Hom}_R(-, N)$ là **left-exact contravariant**, $\operatorname{Hom}_R(N, -)$ là left-exact covariant → sai lệch đo bởi $\operatorname{Ext}$.
- **Flat module**: $\otimes_R N$ exact hoàn toàn; free modules và localizations là flat.

---

## References

- Atiyah, M. F. & Macdonald, I. G. *Introduction to Commutative Algebra*, Chapter 2.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapters 6, 9.
- Altman, A. & Kleiman, S. *A Term of Commutative Algebra*, Chapters 8–9.
- Rotman, J. J. *An Introduction to Homological Algebra*, Chapter 2 (tensor & Hom).
