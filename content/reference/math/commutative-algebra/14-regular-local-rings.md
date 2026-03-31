---
title: "14. Regular Local Rings and Cohen–Macaulay Rings"
tags: [math, commutative-algebra, lesson-14]
aliases: [Regular Local Rings and Cohen-Macaulay Rings]
created: 2026-03-30
---

> **Prerequisites**: [[11-dimension-theory|11. Dimension Theory]], [[12-completions-filtrations|12. Completions and Filtrations]], [[13-tor-and-ext|13. Homological Methods: Tor and Ext]]
> **Objectives**:
> - Hiểu regular local rings và tầm quan trọng hình học của chúng
> - Nắm định nghĩa depth và Cohen-Macaulay rings
> - Áp dụng Auslander-Buchsbaum và Serre's criterion
> - Nhận diện các lớp rings: regular $\Rightarrow$ CM $\Rightarrow$ equidimensional

---

## Motivation / Intuition

Hành trình của khóa học đưa ta từ vành cơ bản đến chiếc đỉnh của lý thuyết: **regular local rings** — phiên bản đại số của "điểm trơn" (smooth point) trong hình học vi phân.

Về mặt hình học: điểm $P$ trên variety $X$ là **smooth** nếu tồn tại lân cận topo trong đó $X$ trông như không gian Euclidean. Về mặt đại số: điều này tương ứng với local ring $\mathcal{O}_{X,P}$ là **regular** — maximal ideal được sinh bởi $\dim R$ phần tử.

**Cohen–Macaulay rings** là lớp rộng hơn: chúng không nhất thiết "trơn" nhưng "hành xử đẹp" theo nghĩa homological — depth bằng dimension. Hầu hết các variety cổ điển (complete intersections, toric varieties, ...) là Cohen–Macaulay.

Bài học này tổng hợp toàn bộ khóa học: dimension theory (Bài 11), completions (Bài 12), homological algebra (Bài 13) cùng hội tụ tại đây.

---

## Regular Local Rings

### Definition

> [!info] Definition 14.1 — Regular Local Ring
>
> Noetherian local ring $(R, \mathfrak{m}, k)$ gọi là **regular** (chính quy) nếu:
>
> $$
> \dim R = \dim_k(\mathfrak{m}/\mathfrak{m}^2)
> $$
>
> Số $\mu(\mathfrak{m}) = \dim_k(\mathfrak{m}/\mathfrak{m}^2)$ là số sinh tối giản của $\mathfrak{m}$ (theo Nakayama). Bất đẳng thức $\dim R \leq \mu(\mathfrak{m})$ luôn đúng (Krull's theorem); regular có nghĩa là đẳng thức.
>
> Tập sinh tối giản $x_1, \ldots, x_d \in \mathfrak{m}$ (với $d = \dim R$) được gọi là **regular system of parameters** (r.s.p.) của $R$.

> [!example] Example 14.2 — Ví dụ Regular Local Rings
>
> - $k[[x_1,\ldots,x_n]]$: regular với $\dim = n$, r.s.p. là $x_1,\ldots,x_n$.
> - $k[x_1,\ldots,x_n]_{(x_1,\ldots,x_n)}$: regular — localization của $k[\mathbf{x}]$ tại gốc tọa độ.
> - $\mathbb{Z}_{(p)}$: regular, $\dim = 1$, r.s.p. là $\{p\}$.
> - $k[[x,y]]/(xy)$: **không** regular — $\dim = 1$ nhưng $\mu(\mathfrak{m}) = 2 > 1$ (giao hai đường thẳng tại gốc — kỳ dị).
> - $k[[x,y,z]]/(x^2+y^2+z^2)$: **không** regular khi $\operatorname{char}(k) \neq 2$ — quadric cone tại gốc.

### Theorem

> [!abstract] Theorem 14.3 — Serre's Characterization of Regular Local Rings
>
> Cho $(R, \mathfrak{m}, k)$ là Noetherian local ring. Các điều sau tương đương:
>
> 1. $R$ là regular local ring.
> 2. $\operatorname{gl.dim}(R) < \infty$ (global dimension hữu hạn).
> 3. $\operatorname{gl.dim}(R) = \dim R$.
> 4. $k = R/\mathfrak{m}$ có projective dimension hữu hạn như $R$-module.
> 5. $\operatorname{pd}_R(k) = \dim R$.

**Proof của $(1) \Rightarrow (5)$ (phác thảo).** Nếu $R$ regular với r.s.p. $x_1,\ldots,x_d$, ta xây dựng **Koszul complex** $K_\bullet(x_1,\ldots,x_d)$ — là free resolution của $k = R/(x_1,\ldots,x_d)$ độ dài $d$. Vậy $\operatorname{pd}_R(k) \leq d = \dim R$. Chiều ngược Auslander-Buchsbaum: $\operatorname{pd}(k) + \operatorname{depth}(k) = \operatorname{depth}(R) = \dim R$, và $\operatorname{depth}(k) = 0$ (không có $M$-regular sequence trong $\mathfrak{m}$ vì $k$ là trường). $\blacksquare$

### Theorem

> [!abstract] Theorem 14.4 — Regular Local Rings là Integral Domains và UFDs
>
> Mọi regular local ring là:
>
> 1. Miền nguyên (integral domain).
> 2. Integrally closed (normal).
> 3. UFD (unique factorization domain).

**Proof của (1).** Bằng quy nạp trên $\dim R$. Nếu $\dim R = 0$: $R$ là trường. Nếu $\dim R > 0$: lấy $x \in \mathfrak{m} \setminus \mathfrak{m}^2$ (một phần tử của r.s.p.). Thì $R/(x)$ là regular local ring dim $d-1$ (check bằng associated graded). Theo giả thiết quy nạp $R/(x)$ là miền nguyên, tức $(x)$ là prime ideal. Vì $\bigcap_n \mathfrak{m}^n = 0$ (Krull Intersection Theorem), $R$ là miền nguyên (dùng graded ring $\operatorname{gr}_\mathfrak{m}(R) \cong k[x_1,\ldots,x_d]$ là miền nguyên). $\blacksquare$

**Proof của (3) (Auslander-Buchsbaum-Serre, 1958).** Dùng Serre's criterion: $R$ UFD $\iff$ mọi prime height 1 là principal. Với regular local ring, prime height 1 $\mathfrak{p}$: $\operatorname{pd}(\mathfrak{p}) = \operatorname{pd}(R/\mathfrak{p}) - 1 < \infty$ (Auslander-Buchsbaum), rồi dùng Nakayama để chứng minh $\mathfrak{p}$ tự do hạng 1, tức principal. $\blacksquare$

---

## Depth và Cohen–Macaulay Rings

### Definition

> [!info] Definition 14.5 — Regular Sequence và Depth
>
> Cho $(R, \mathfrak{m})$ Noetherian local và $M$ hữu hạn sinh $\neq 0$. Dãy $x_1, \ldots, x_r \in \mathfrak{m}$ gọi là **$M$-regular sequence** nếu:
>
> - $x_1$ không phải zero divisor của $M$.
> - $x_i$ không phải zero divisor của $M/(x_1,\ldots,x_{i-1})M$ với $i = 2,\ldots,r$.
> - $(x_1,\ldots,x_r)M \neq M$.
>
> **Depth** của $M$:
>
> $$
> \operatorname{depth}(M) = \max\{r : \text{tồn tại $M$-regular sequence độ dài } r\}
> $$
>
> Đặc trưng qua $\operatorname{Ext}$:
>
> $$
> \operatorname{depth}(M) = \min\{i : \operatorname{Ext}^i_R(k, M) \neq 0\}
> $$

> [!abstract] Theorem 14.6 — Bất đẳng thức Depth
>
> Với Noetherian local ring $(R, \mathfrak{m})$ và $M$ hữu hạn sinh $\neq 0$:
>
> $$
> \operatorname{depth}(M) \leq \dim(M) = \dim \operatorname{Supp}(M)
> $$

**Proof.** Bằng quy nạp trên $\operatorname{depth}(M)$. Nếu $\operatorname{depth}(M) = 0$: $\mathfrak{m} \in \operatorname{Ass}(M)$, không có $M$-regular sequence. Nếu $\operatorname{depth}(M) > 0$: lấy $x_1 \in \mathfrak{m}$ regular trên $M$. Thì $\dim(M/x_1M) = \dim M - 1$ (Krull) và $\operatorname{depth}(M/x_1M) = \operatorname{depth}(M) - 1$. Áp giả thiết quy nạp. $\blacksquare$

### Definition

> [!info] Definition 14.7 — Cohen–Macaulay Ring
>
> Noetherian local ring $(R, \mathfrak{m})$ gọi là **Cohen–Macaulay** nếu:
>
> $$
> \operatorname{depth}(R) = \dim R
> $$
>
> Vành (không địa phương) $R$ gọi là Cohen–Macaulay nếu $R_\mathfrak{m}$ là Cohen–Macaulay với mọi $\mathfrak{m} \in \operatorname{Max}(R)$.

> [!example] Example 14.8 — Các lớp Cohen–Macaulay quan trọng
>
> **Cohen–Macaulay:**
> - Mọi regular local ring (depth = dim theo Auslander-Buchsbaum).
> - Mọi Dedekind domain (dim 1, depth 1).
> - Complete intersection rings $k[[x_1,\ldots,x_n]]/(f_1,\ldots,f_r)$ (với $r = n - d$, $d$ chiều đầu ra).
> - Vành toric (Stanley-Reisner rings của simplicial complexes thỏa điều kiện).
>
> **Không Cohen–Macaulay:**
> - $R = k[x,y,z,w]/(xz - yw, x^2w - y^3, y^2z - xw^2)$: dim $2$ nhưng depth $1$.
> - $k[[x,y]] \times_k k[[z,w]]$ (fiber product không tương thích chiều): depth có thể nhỏ hơn dim.

### Theorem

> [!abstract] Theorem 14.9 — Đặc trưng Cohen–Macaulay qua regular sequences
>
> $(R, \mathfrak{m})$ Noetherian local là Cohen–Macaulay khi và chỉ khi mọi r.s.p. (regular system of parameters) $x_1,\ldots,x_d$ là $R$-regular sequence.

**Proof.** ($\Rightarrow$) Nếu $\operatorname{depth}(R) = \dim R = d$ và $x_1,\ldots,x_d$ là r.s.p., thì có thể chọn chúng là $R$-regular sequence (dùng prime avoidance và tính chất depth).

($\Leftarrow$) Nếu $x_1,\ldots,x_d$ là r.s.p. và $R$-regular sequence thì $\operatorname{depth}(R) \geq d = \dim R$. Cộng bất đẳng thức chiều ngược: $\operatorname{depth}(R) = \dim R$. $\blacksquare$

---

## Serre's Normality Criterion

### Theorem

> [!abstract] Theorem 14.10 — Serre's Criterion for Normality ($R_1$ và $S_2$)
>
> Noetherian ring $R$ là **integrally closed** (normal) khi và chỉ khi:
>
> - **(R1)**: $R_\mathfrak{p}$ là regular local ring với mọi prime $\mathfrak{p}$ với $\operatorname{ht}(\mathfrak{p}) \leq 1$.
> - **(S2)**: $\operatorname{depth}(R_\mathfrak{p}) \geq \min(2, \operatorname{ht}(\mathfrak{p}))$ với mọi $\mathfrak{p}$.
>
> Tổng quát, $R$ thỏa **Serre's condition** $S_k$ nếu $\operatorname{depth}(R_\mathfrak{p}) \geq \min(k, \operatorname{ht}(\mathfrak{p}))$ với mọi $\mathfrak{p}$.
>
> Cohen–Macaulay $\Rightarrow$ $S_k$ với mọi $k$ $\Rightarrow$ $S_2$ $\Rightarrow$ normal (kết hợp với $R_1$).

**Proof (phác thảo).** ($R_1 + S_2 \Rightarrow$ normal): Dùng Criterion of Serre: $R$ normal $\iff$ tất cả associated primes của $R$ có height 0 (reduced) và không có embedded primes bổ sung (S2 loại bỏ điều này). $R_1$ đảm bảo codimension-1 primes behave như DVR — đủ để kiểm tra integrality. $\blacksquare$

---

## Tổng kết Phân cấp

### Theorem

> [!abstract] Theorem 14.11 — Chuỗi bao hàm các lớp vành
>
> Với Noetherian local rings, có các bao hàm sau:
>
> $$
> \text{Regular} \subsetneq \text{Complete Intersection} \subsetneq \text{Gorenstein} \subsetneq \text{Cohen–Macaulay} \subsetneq \text{Equidimensional Noetherian}
> $$
>
> Trong đó:
>
> - **Regular**: $\dim = \mu(\mathfrak{m})$, gl.dim hữu hạn, luôn là UFD.
> - **Complete Intersection**: $R \cong k[[x_1,\ldots,x_n]]/(f_1,\ldots,f_{n-d})$ với $d = \dim R$.
> - **Gorenstein**: $\operatorname{Ext}^d_R(k, R) \cong k$ (injective dimension hữu hạn và bằng dim).
> - **Cohen–Macaulay**: $\operatorname{depth} = \dim$.

> [!example] Example 14.12 — Ví dụ phân biệt các lớp
>
> Cho $k$ trường đại số đóng:
>
> | Vành | Regular | C.I. | Gorenstein | C-M |
> |------|---------|------|------------|-----|
> | $k[[x,y]]$ | ✓ | ✓ | ✓ | ✓ |
> | $k[[x,y,z]]/(xy-z^2)$ | ✗ | ✓ | ✓ | ✓ |
> | $k[[x,y,z]]/(x^2,xy,xz,yz)$ | ✗ | ✗ | ✗ | ✓ |
> | $k[[x,y,z,w]]/(xz,xw,yz,yw)$ | ✗ | ✗ | ✗ | ✗ |
>
> Hàng cuối: $\dim = 2$, $\operatorname{depth} = 1$ (vì $\mathfrak{m} = (x,y,z,w)$ là associated prime kép của module phức tạp hơn).

---

## SageMath Cheatsheet

```sage
R.<x,y,z,w> = QQ[]

I = R.ideal(x*y - z^2)
RI = R.quotient(I)
RI.is_regular()
RI.depth()
RI.krull_dimension()

J = R.ideal(x*z, x*w, y*z, y*w)
RJ = R.quotient(J)
RJ.depth()
RJ.krull_dimension()
RJ.is_cohen_macaulay()

R2.<x,y> = QQ[]
R2.is_regular()
R2.global_dimension()

K = R.ideal(x^2, y^3, z^2 - x*y)
RK = R.quotient(K)
RK.projective_dimension(RK.base_ring().quotient(RK.base_ring().ideal(x,y,z,w)))
```

---

## Summary / Key Takeaways

- **Regular local ring**: $\dim R = \mu(\mathfrak{m})$; r.s.p. sinh $\mathfrak{m}$; gl.dim = dim (Serre).
- Regular $\Rightarrow$ integral domain $\Rightarrow$ integrally closed $\Rightarrow$ UFD.
- **Koszul complex** $K_\bullet(x_1,\ldots,x_d)$ là free resolution của $k$ với regular local ring.
- **Depth**: độ dài regular sequence tối đa; $\operatorname{depth}(M) \leq \dim M$ luôn đúng.
- $\operatorname{depth}(M) = \min\{i : \operatorname{Ext}^i_R(k,M) \neq 0\}$ — đặc trưng qua Ext.
- **Cohen–Macaulay**: $\operatorname{depth}(R) = \dim R$; mọi r.s.p. là regular sequence.
- **Serre's criterion**: Normal $\iff$ $R_1 + S_2$; CM $\Rightarrow$ $S_k$ với mọi $k$.
- Phân cấp: Regular $\subsetneq$ C.I. $\subsetneq$ Gorenstein $\subsetneq$ Cohen–Macaulay.

---

## References

- Matsumura, H. *Commutative Ring Theory*, Chapters 16–19.
- Eisenbud, D. *Commutative Algebra with a View Toward Algebraic Geometry*, Chapters 17–21.
- Bruns, W. & Herzog, J. *Cohen–Macaulay Rings*, Chapters 1–2.
- Weibel, C. *An Introduction to Homological Algebra*, Chapter 4.
