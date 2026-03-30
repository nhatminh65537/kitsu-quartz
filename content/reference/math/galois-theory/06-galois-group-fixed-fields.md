---
title: "06. Nhóm Galois và Fixed Fields"
tags: [math, galois-theory, lesson-06]
aliases: [Galois Groups and Fixed Fields]
created: 2026-03-24
---

> **Prerequisites**: [[05-separable-extensions|05. Separable Extensions]]
> **Objectives**:
> - Định nghĩa $K$-automorphism và nhóm $\operatorname{Aut}(L/K)$
> - Hiểu fixed field $L^H$ của một subgroup $H$
> - Nắm vững hai ánh xạ $\Phi$ và $\Gamma$ tạo thành Galois correspondence sơ khai
> - Phát biểu và chứng minh **Artin's Theorem** — cột trụ của Galois Theory
> - Tính Galois group của các ví dụ cụ thể: $\mathbb{Q}(\sqrt{2})$, $\mathbb{Q}(\sqrt{2},\sqrt{3})$, splitting field của $x^3-2$

---

## Motivation / Intuition

Ta đã xây dựng đủ hành trang: splitting field (Bài 03), normal extension (Bài 04), separable extension (Bài 05). Bây giờ là lúc ra mắt nhân vật trung tâm của toàn bộ lý thuyết: **Galois group**.

Ý tưởng cơ bản: nếu $L/K$ là field extension, nhóm các **$K$-automorphisms** của $L$ — những phép biến đổi của $L$ cố định $K$ — nắm bắt "đối xứng" của extension. Nghiệm của một đa thức $f \in K[x]$ có thể bị hoán vị bởi các automorphism này, và nhóm hoán vị đó chứa thông tin hình học sâu sắc về nghiệm.

Điều kỳ diệu là ngược lại cũng đúng: nếu cho trước một **nhóm hữu hạn** các automorphisms $H$ của field $L$, ta có thể lấy lại một field — **fixed field** $L^H$ — và extension $L/L^H$ được điều khiển hoàn toàn bởi $H$. Đây là nội dung của **Artin's Theorem**.

---

## $K$-Automorphisms và Nhóm Galois

### Definition

> [!definition] Definition 6.1 — $K$-Automorphism
> Cho $L/K$ là field extension. Một **$K$-automorphism** của $L$ là field isomorphism $\sigma: L \xrightarrow{\sim} L$ thỏa:
>
> $$
> \sigma(a) = a \quad \forall\, a \in K
> $$
>
> Tập hợp tất cả các $K$-automorphisms của $L$, ký hiệu $\operatorname{Aut}(L/K)$, tạo thành một **nhóm** dưới phép hợp thành hàm số.

> [!note] Remark 6.2 — Kiểm tra tính nhóm
> Phép hợp thành của hai $K$-automorphisms là $K$-automorphism, phần tử đơn vị là $\mathrm{id}_L$, và nghịch đảo của $\sigma$ là $\sigma^{-1}$ (cũng là $K$-automorphism). Tính kết hợp tự động.

### Automorphisms permute nghiệm

Quan sát then chốt: $K$-automorphisms hoán vị các nghiệm của đa thức hệ số trong $K$.

> [!abstract] Theorem 6.3 — Automorphism permutes roots
> Cho $\sigma \in \operatorname{Aut}(L/K)$ và $f(x) \in K[x]$. Nếu $\alpha \in L$ là nghiệm của $f$, thì $\sigma(\alpha)$ cũng là nghiệm của $f$.

**Proof.** Viết $f(x) = c_n x^n + \cdots + c_0$ với $c_i \in K$. Vì $\sigma(c_i) = c_i$:
$$
f(\sigma(\alpha)) = c_n(\sigma(\alpha))^n + \cdots + c_0 = \sigma(c_n\alpha^n + \cdots + c_0) = \sigma(f(\alpha)) = \sigma(0) = 0.
$$
$\blacksquare$

> [!note] Remark 6.4
> Hệ quả: mỗi $\sigma \in \operatorname{Aut}(L/K)$ **cảm sinh một hoán vị** trên tập nghiệm $\{\alpha_1,\ldots,\alpha_n\}$ của bất kỳ $f \in K[x]$ nào nằm trong $L$. Đây là nền tảng của việc xem Galois group như **subgroup của $S_n$**.

---

## Fixed Fields

> [!definition] Definition 6.5 — Fixed Field
> Cho $L$ là field và $H \leq \operatorname{Aut}(L)$ là subgroup của nhóm tất cả automorphisms của $L$. **Fixed field** (trường bất động) của $H$, ký hiệu $L^H$, là:
>
> $$
> L^H = \left\{ x \in L \mid \sigma(x) = x \quad \forall\, \sigma \in H \right\}
> $$

> [!abstract] Theorem 6.6 — $L^H$ là field
> $L^H$ là subfield của $L$.

**Proof.** $1 \in L^H$ (mọi automorphism cố định $1$). Nếu $x, y \in L^H$: $\sigma(x+y) = \sigma(x) + \sigma(y) = x+y$, $\sigma(xy) = \sigma(x)\sigma(y) = xy$, $\sigma(-x) = -\sigma(x) = -x$, và nếu $x \neq 0$ thì $\sigma(x^{-1}) = (\sigma(x))^{-1} = x^{-1}$. $\blacksquare$

> [!example] Example 6.7 — Fixed field của complex conjugation
> $L = \mathbb{C}$, $H = \{1, \sigma\}$ với $\sigma(a + bi) = a - bi$ (complex conjugation).
>
> $L^H = \left\{ z \in \mathbb{C} \mid z = \bar{z} \right\} = \mathbb{R}$.
>
> Đây là ví dụ sơ khai của Galois correspondence: $H \leftrightarrow \mathbb{R}$, và $[\mathbb{C}:\mathbb{R}] = 2 = |H|$.

### Hai ánh xạ đối lập

Với extension $L/K$, ta có hai ánh xạ:

$$
\begin{aligned}
\Phi&: \{\text{intermediate fields } M \mid K \subseteq M \subseteq L\} \longrightarrow \{\text{subgroups of } \operatorname{Aut}(L/K)\}\\
&\quad M \longmapsto \operatorname{Aut}(L/M)
\\[6pt]
\Gamma&: \{\text{subgroups of } \operatorname{Aut}(L/K)\} \longrightarrow \{\text{intermediate fields } M \mid K \subseteq M \subseteq L\}\\
&\quad H \longmapsto L^H
\end{aligned}
$$

> [!note] Remark 6.8 — Tính order-reversing
> Cả hai ánh xạ đều **đảo chiều inclusion**: nếu $M_1 \subseteq M_2$ thì $\operatorname{Aut}(L/M_2) \subseteq \operatorname{Aut}(L/M_1)$. Nếu $H_1 \subseteq H_2$ thì $L^{H_2} \subseteq L^{H_1}$.
>
> Về nguyên tắc: nhiều điều kiện cố định hơn $\Rightarrow$ ít automorphism hơn (và ngược lại).

---

## Artin's Theorem

Đây là định lý nền tảng nhất của cả khóa học — nó cho phép ta **xuất phát từ một nhóm** automorphisms và đảm bảo nhận lại đúng nhóm đó.

> [!abstract] Theorem 6.9 — Artin's Theorem
> Cho $L$ là field và $H$ là **nhóm hữu hạn** các automorphisms của $L$. Đặt $K = L^H$ là fixed field. Khi đó:
>
> 1. $[L:K] = |H|$ (degree bằng bậc nhóm).
> 2. $\operatorname{Aut}(L/K) = H$ (không có automorphism nào thêm vào).
> 3. $L/K$ là **Galois extension** (normal và separable).

Xem chứng minh đầy đủ tại [[a0-artin-theorem|A0. Artin's Theorem]].

**Proof sketch.**
Ta cần chứng minh $[L:K] \leq |H|$ và $[L:K] \geq |H|$.

**Phần $[L:K] \leq |H|$:** Cho $n = |H|$ và giả sử $\alpha_1, \ldots, \alpha_{n+1} \in L$ là $n+1$ phần tử. Xét hệ phương trình tuyến tính:
$$
\sum_{j=1}^{n+1} \sigma_i(\alpha_j)\, t_j = 0, \quad i = 1, \ldots, n \quad (\sigma_1, \ldots, \sigma_n = H)
$$
Đây là $n$ phương trình, $n+1$ ẩn — có nghiệm không tầm thường $(t_1, \ldots, t_{n+1}) \in L^{n+1}$. Bằng kỹ thuật cẩn thận (chọn nghiệm tối thiểu, dùng tính độc lập của các character), ta được nghiệm $(t_1, \ldots, t_{n+1})$ thực ra thuộc $K^{n+1}$. Điều đó cho $\alpha_1, \ldots, \alpha_{n+1}$ phụ thuộc tuyến tính trên $K$, nên $[L:K] \leq n$.

**Phần $[L:K] \geq |H|$:** Dùng Theorem 5.12 (separability $\iff$ số embedding tối đa). Mỗi $\sigma \in H$ là $K$-embedding $L \hookrightarrow \bar{K}$, và các $\sigma \in H$ phân biệt. Nên $|H| \leq \text{số $K$-embeddings} \leq [L:K]$.

Kết hợp: $[L:K] = |H|$. Normal và separable từ đây suy ra. $\blacksquare$

> [!tip] Key Insight 6.10 — Ý nghĩa của Artin's Theorem
> Artin's Theorem nói rằng: nếu ta *bắt đầu* từ một nhóm hữu hạn $H$ của automorphisms, tất cả thông tin về extension $L/L^H$ được mã hóa **hoàn toàn** trong $H$. Không có automorphism "bí ẩn" nào bị bỏ sót.
>
> Ngược lại: nếu $L/K$ là Galois extension (normal + separable), thì $K = L^{\operatorname{Gal}(L/K)}$ — tức ta cũng thu hồi được base field từ nhóm.

---

## Tính Galois Group qua ví dụ

### Quy tắc tính

Để tính $G = \operatorname{Aut}(L/K)$:
1. Xác định generators của $L$ trên $K$: $L = K(\alpha_1, \ldots, \alpha_r)$.
2. Mỗi $\sigma \in G$ hoàn toàn xác định bởi $\sigma(\alpha_i)$ (vì $\sigma$ cố định $K$).
3. $\sigma(\alpha_i)$ phải là **nghiệm của $\operatorname{Irr}(\alpha_i, K)$** nằm trong $L$ (Theorem 6.3).
4. Kiểm tra tổ hợp nào thực sự cho automorphism hợp lệ.

### Ví dụ

> [!example] Example 6.11 — $\operatorname{Aut}(\mathbb{Q}(\sqrt{2})/\mathbb{Q})$
> $L = \mathbb{Q}(\sqrt{2})$, generator $\sqrt{2}$, $\operatorname{Irr}(\sqrt{2},\mathbb{Q}) = x^2 - 2$, nghiệm: $\pm\sqrt{2}$.
>
> Mỗi $\sigma \in \operatorname{Aut}(L/\mathbb{Q})$ phải gửi $\sqrt{2} \mapsto \pm\sqrt{2}$.
>
> - $\sigma_1$: $\sqrt{2} \mapsto \sqrt{2}$ (identity).
> - $\sigma_2$: $\sqrt{2} \mapsto -\sqrt{2}$. Kiểm tra: $\sigma_2(a + b\sqrt{2}) = a - b\sqrt{2}$, hợp lệ.
>
> $\operatorname{Aut}(\mathbb{Q}(\sqrt{2})/\mathbb{Q}) = \{1, \sigma_2\} \cong \mathbb{Z}/2\mathbb{Z}$.
>
> Nhận xét: $|\operatorname{Aut}| = 2 = [\mathbb{Q}(\sqrt{2}):\mathbb{Q}]$ — đây là Galois extension.

> [!example] Example 6.12 — $\operatorname{Aut}(\mathbb{Q}(\sqrt{2},\sqrt{3})/\mathbb{Q})$
> $L = \mathbb{Q}(\sqrt{2},\sqrt{3})$, $[L:\mathbb{Q}] = 4$, generators $\sqrt{2}$ và $\sqrt{3}$.
>
> Mỗi automorphism gửi $\sqrt{2} \mapsto \pm\sqrt{2}$ và $\sqrt{3} \mapsto \pm\sqrt{3}$ (độc lập). Có 4 lựa chọn:
>
> | | $\sqrt{2}$ | $\sqrt{3}$ |
> |---|---|---|
> | $\mathrm{id}$ | $+\sqrt{2}$ | $+\sqrt{3}$ |
> | $\sigma$ | $-\sqrt{2}$ | $+\sqrt{3}$ |
> | $\tau$ | $+\sqrt{2}$ | $-\sqrt{3}$ |
> | $\sigma\tau$ | $-\sqrt{2}$ | $-\sqrt{3}$ |
>
> Tất cả 4 lựa chọn đều hợp lệ (dễ kiểm tra). $\operatorname{Aut}(L/\mathbb{Q}) \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$ (Klein 4-group). $|\operatorname{Aut}| = 4 = [L:\mathbb{Q}]$. Galois extension.

> [!example] Example 6.13 — Splitting field của $x^3 - 2$: $G = S_3$
> $L = \mathbb{Q}(\sqrt[3]{2}, \omega)$ với $\omega = e^{2\pi i/3}$, $[L:\mathbb{Q}] = 6$.
>
> Ba nghiệm của $x^3 - 2$: $\alpha_1 = \sqrt[3]{2}$, $\alpha_2 = \sqrt[3]{2}\omega$, $\alpha_3 = \sqrt[3]{2}\omega^2$.
>
> Mỗi $\sigma \in G$ xác định bởi $\sigma(\alpha_1) \in \{\alpha_1, \alpha_2, \alpha_3\}$ và $\sigma(\omega) \in \{\omega, \omega^2\}$ (nghiệm của $x^2+x+1$).
>
> Có $3 \times 2 = 6$ lựa chọn, tất cả đều hợp lệ. Vậy $|G| = 6 = [L:\mathbb{Q}]$, Galois extension.
>
> Xác định cấu trúc: đặt $\sigma: \alpha_1 \mapsto \alpha_2, \omega \mapsto \omega$ và $\tau: \alpha_1 \mapsto \alpha_1, \omega \mapsto \omega^2$.
>
> $\sigma$ có bậc $3$ (hoán vị ba nghiệm), $\tau$ có bậc $2$, $\tau\sigma \neq \sigma\tau$. Vậy:
>
> $$
> \operatorname{Gal}(L/\mathbb{Q}) \cong S_3 \cong D_3 \quad (\text{nhóm nhị diện bậc 6})
> $$

> [!example] Example 6.14 — Non-Galois: $\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$
> $\operatorname{Irr}(\sqrt[3]{2}, \mathbb{Q}) = x^3 - 2$, nhưng hai nghiệm kia $(\sqrt[3]{2}\omega, \sqrt[3]{2}\omega^2)$ không nằm trong $\mathbb{Q}(\sqrt[3]{2}) \subset \mathbb{R}$.
>
> Automorphism phải gửi $\sqrt[3]{2}$ vào nghiệm của $x^3-2$ nằm trong $L$ — chỉ có $\sqrt[3]{2}$.
>
> Vậy $\operatorname{Aut}(\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}) = \{\mathrm{id}\}$, bậc $1$.
>
> Nhưng $[\mathbb{Q}(\sqrt[3]{2}):\mathbb{Q}] = 3 \neq 1$. **Không phải Galois extension** — đúng như mong đợi (non-normal).

---

## Fixed Field Lattice

Với $G = \operatorname{Gal}(L/K)$, mỗi subgroup $H \leq G$ cho một intermediate field $L^H$. Lattice của subgroups tương ứng với lattice ngược của intermediate fields.

> [!example] Example 6.15 — Fixed field lattice của $\mathbb{Q}(\sqrt{2},\sqrt{3})/\mathbb{Q}$
> $G = \{1, \sigma, \tau, \sigma\tau\} \cong V_4$ (Klein 4-group). Subgroups:
>
> | Subgroup $H$ | Fixed field $L^H$ | $[L^H:\mathbb{Q}]$ |
> |---|---|---|
> | $\{1\}$ | $L = \mathbb{Q}(\sqrt{2},\sqrt{3})$ | $4$ |
> | $\langle\sigma\rangle = \{1,\sigma\}$ | $\mathbb{Q}(\sqrt{3})$ | $2$ |
> | $\langle\tau\rangle = \{1,\tau\}$ | $\mathbb{Q}(\sqrt{2})$ | $2$ |
> | $\langle\sigma\tau\rangle = \{1,\sigma\tau\}$ | $\mathbb{Q}(\sqrt{6})$ | $2$ |
> | $G$ | $\mathbb{Q}$ | $1$ |
>
> Có đúng 5 subgroups $\leftrightarrow$ 5 intermediate fields. Đây là dự báo của FTGT.

---

## SageMath Cheatsheet

```sage
K = QQ
L.<a, b> = NumberField([x^2 - 2, x^2 - 3])
G = L.galois_group()
print(G)
print(G.order())

for H in G.subgroups():
    print(H.order(), H.fixed_field())

K2.<a> = NumberField(x^3 - 2)
K2.galois_group()

L2 = (x^3 - 2).splitting_field('w')
G2 = L2.galois_group()
print(G2.structure_description())
```

---

## Summary / Key Takeaways

- **$K$-automorphism**: field isomorphism $\sigma: L \to L$ cố định $K$. Tập $\operatorname{Aut}(L/K)$ là nhóm.
- Mọi $\sigma \in \operatorname{Aut}(L/K)$ **hoán vị các nghiệm** của $f \in K[x]$ trong $L$.
- **Fixed field** $L^H = \{x \in L \mid \sigma(x) = x\ \forall \sigma \in H\}$ là subfield của $L$.
- Hai ánh xạ đối lập $\Phi: M \mapsto \operatorname{Aut}(L/M)$ và $\Gamma: H \mapsto L^H$ đảo chiều inclusion.
- **Artin's Theorem**: $H$ finite $\Rightarrow$ $[L:L^H] = |H|$ và $\operatorname{Aut}(L/L^H) = H$.
- Tính $\operatorname{Aut}(L/K)$: xác định generators, liệt kê ảnh hợp lệ, kiểm tra.
- $|\operatorname{Aut}(L/K)| = [L:K]$ khi và chỉ khi $L/K$ là **Galois extension**.
- $\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$: $|\operatorname{Aut}| = 1 \neq 3$ — non-Galois (non-normal).
- $\mathbb{Q}(\sqrt[3]{2},\omega)/\mathbb{Q}$: $|\operatorname{Aut}| = 6 = [L:\mathbb{Q}]$ — Galois, $G \cong S_3$.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §14.1–14.2.
- Conrad, K. *The Galois Correspondence*, §§2, 5. Có tại https://kconrad.math.uconn.edu/blurbs/galoistheory/galoiscorr.pdf
- Milne, J. S. *Fields and Galois Theory*, §§7–8. Có tại https://www.jmilne.org/math/CourseNotes/FT.pdf
- Artin, E. *Galois Theory* (Notre Dame Lectures, 1942).
