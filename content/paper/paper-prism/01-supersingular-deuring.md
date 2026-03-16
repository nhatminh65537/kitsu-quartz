---
title: "01. Supersingular Elliptic Curves & Deuring Correspondence"
type: math-component
tags: [prism, isogeny, supersingular, deuring-correspondence, kani, lesson-01]
aliases: [Supersingular Curves, Deuring Correspondence, Kani's Lemma]
source: "PRISM: Simple And Compact Identification and Signatures From Large Prime Degree Isogenies — Basso et al., PKC 2025"
created: 2026-03-16
---

> **Prerequisites**: Đường cong elliptic cơ bản (Weierstrass form, group law, torsion points), lý thuyết số cơ bản (số nguyên tố, đồng dư, trường hữu hạn)  
> 🔴 **Prerequisite references**: Silverman — *The Arithmetic of Elliptic Curves* [Sil09] (ECC nền tảng); Voight — *Quaternion Algebras* [Voi21] (quaternion algebra và Eichler order)  
> **Lesson type**: Math Component  
> **Covers**: §2.1 (supersingular elliptic curves), §2.2 (Kani's Lemma, Theorem 1), §2.3 (Deuring Correspondence, Table 1)
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $p$ | Số nguyên tố đặc trưng (characteristic) | $p$ |
> | $\mathbb{F}_{p^2}$ | Trường hữu hạn bậc $p^2$ | $\mathbb{F}_{p^2}$ |
> | $E$ | Đường cong elliptic supersingular trên $\mathbb{F}_{p^2}$ | $E$ |
> | $\text{End}(E)$ | Vành endomorphism của $E$ | $\text{End}(E)$ |
> | $\mathcal{O}$ | Maximal order trong $\mathcal{B}_{p,\infty}$ | $\mathcal{O}$ |
> | $\phi : E \to E'$ | Isogeny từ $E$ sang $E'$ | $\phi$ |
> | $\hat{\phi}$ | Dual isogeny của $\phi$ | $\hat{\phi}$ |
> | $\deg(\phi)$ | Bậc (degree) của isogeny $\phi$ | $\deg(\phi)$ |
> | $\mathcal{B}_{p,\infty}$ | Quaternion algebra phân kỳ tại $p$ và $\infty$ | $\mathcal{B}_{p,\infty}$ |
> | $\mathcal{I}(\mathcal{O}, \mathcal{O}')$ | Tập các ideal nối $\mathcal{O}$ với $\mathcal{O}'$ | — |

---

## Motivation

Mật mã học dựa trên isogeny (isogeny-based cryptography) là một trong những hướng nghiên cứu hàng đầu trong post-quantum cryptography. Lý do chính: **bài toán isogeny là khó ngay cả với máy tính lượng tử** — không như RSA hay ECC bị phá bởi thuật toán Shor.

PRISM, scheme chữ ký được nghiên cứu trong course này, được xây dựng hoàn toàn trên nền tảng của **đường cong elliptic supersingular** và **Deuring correspondence** — một cầu nối toán học sâu sắc giữa isogeny và ideal trong quaternion algebra. Lesson này xây dựng toàn bộ nền tảng đó từ đầu.

---

## Supersingular Elliptic Curves

### Định nghĩa và tính chất

Cho $p$ là số nguyên tố. Một đường cong elliptic $E$ định nghĩa trên $\mathbb{F}_{p^2}$ được gọi là **supersingular** (siêu kỳ dị) nếu nó thỏa mãn một trong các điều kiện tương đương sau:

- $E[p] = \{O\}$ — tức là nhóm torsion $p$ chỉ có điểm vô cực
- $\text{End}(E) \otimes \mathbb{Q}$ là một **quaternion algebra** (thay vì trường số)
- $\#E(\mathbb{F}_{p^2}) = (p-1)^2$ hoặc $(p+1)^2$ (Waterhouse, 1969)

Điều này tương phản với đường cong **ordinary** (thông thường), nơi $\text{End}(E) \otimes \mathbb{Q}$ là một quadratic imaginary field.

> [!note] Tính chất 1.1 — Số lượng đường cong supersingular
> Số đẳng cấu $j$-invariant của các đường cong supersingular trên $\overline{\mathbb{F}}_p$ xấp xỉ $p/12$. Mọi đường cong supersingular đều có thể được định nghĩa trên $\mathbb{F}_{p^2}$.
>
> **Ý nghĩa mật mã học**: Không gian của các đường cong supersingular đủ lớn để tham số bảo mật, nhưng đủ có cấu trúc để tính toán hiệu quả.

### Supersingular Isogeny Graph

Đồ thị $\ell$-isogeny (supersingular $\ell$-isogeny graph), ký hiệu $\mathcal{G}_\ell$, có:

- **Đỉnh (vertices)**: các $j$-invariant của đường cong supersingular trên $\overline{\mathbb{F}}_p$
- **Cạnh (edges)**: mỗi isogeny $\phi : E \to E'$ bậc $\ell$ cho một cạnh có hướng từ $j(E)$ sang $j(E')$

> [!tip] 💡 Agent note
> Đồ thị $\ell$-isogeny là **Ramanujan graph** — tức là đồ thị "expander" với tính chất trộn lẫn tốt (mixing property). Đây là lý do tại sao random walk trên đồ thị này hội tụ nhanh về phân phối đều, và cũng là lý do tại sao việc tìm đường đi trong đồ thị là khó tính toán.

---

## Isogenies và Biểu Diễn

### Isogeny là gì?

Một **isogeny** $\phi : E \to E'$ là một group homomorphism không tầm thường (non-trivial) giữa hai đường cong elliptic. Các tính chất cốt lõi:

- Isogeny có **kernel** hữu hạn: $\ker(\phi)$ là một subgroup hữu hạn của $E$
- Mỗi subgroup hữu hạn $G \subseteq E$ xác định duy nhất một isogeny $\phi_G : E \to E/G$ (Vélu, 1971)
- Tồn tại **dual isogeny** $\hat{\phi} : E' \to E$ sao cho $\hat{\phi} \circ \phi = [\deg(\phi)]_E$

> [!note] Biểu diễn Isogeny 1.2 — Kernel Representation
> Trong PRISM, isogeny bậc nguyên tố lớn $q$ được biểu diễn qua kernel của nó. Nhưng vì $q$ lớn, các phần tử kernel nằm trong phần mở rộng trường rất lớn — do đó cần dùng **higher-dimensional representation** (xem Lesson 02).

### Pushforward Isogeny

Cho hai isogeny $\phi_1 : E_0 \to E_1$ và $\phi_2 : E_0 \to E_2$, **pushforward** (đẩy tiến) của $\phi_2$ dưới $\phi_1$ là isogeny $\phi_1 \ast \phi_2 : E_1 \to E_3$ sao cho sơ đồ sau giao hoán:

$$
\phi_1 \ast \phi_2 \circ \phi_1 = \hat{\phi}_1 \circ \phi_2
$$

Paper mô tả cấu trúc này trong Figure 1 (không thể tái tạo ở đây, nhưng về mặt toán học: nếu $\phi_1$ và $\phi_2$ có kernel coprime, thì pushforward tồn tại và bậc của nó bằng $\deg(\phi_2)$).

---

## Kani's Lemma

Đây là định lý toán học then chốt cho phép **biểu diễn isogeny bậc phi trơn (non-smooth) thông qua isogeny higher-dimensional bậc trơn**.

> [!abstract] Theorem 1 (Kani's Lemma — như trong paper §2.2)
> Cho $d_1, d_2, N$ là các số nguyên dương đôi một nguyên tố cùng nhau (pairwise coprime) sao cho $N = d_1 + d_2$.  
> Cho $E_0, E_1, E_2, E_3$ là các đường cong elliptic được nối bởi các isogeny:
>
> $$
> \phi_1 : E_0 \to E_1, \quad \deg(\phi_1) = d_1
> $$
> $$
> \phi_2 : E_0 \to E_2, \quad \deg(\phi_2) = d_2
> $$
>
> Khi đó tồn tại isogeny
>
> $$
> \Phi : E_0 \times E_1 \to E_2 \times E_3
> $$
>
> bậc $N$ (một $(2,2)$-isogeny hoặc higher-dimensional isogeny) giữa các **products of elliptic curves**, với $E_3$ phụ thuộc vào $\phi_1$ và $\phi_2$.

**Proof sketch**: Kani (1997) xây dựng $\Phi$ từ ma trận isogeny:

$$
\Phi = \begin{pmatrix} \hat{\phi}_1 & \phi_2 \\ \phi_1^* & \hat{\phi}_2 \end{pmatrix}
$$

trong đó $\phi_i^*$ là pushforward. Điều kiện $\gcd(d_1, d_2) = 1$ và $N = d_1 + d_2$ đảm bảo kernel của $\Phi$ có cấu trúc tương thích với $(E_0 \times E_1)[N]$, do đó $\Phi$ là isogeny bậc $N$ hợp lệ. $\square$

> [!info] 🟡 Ứng dụng của Kani trong PRISM
> Trong protocol PRISM, prover cần tính toán và truyền một isogeny bậc nguyên tố lớn $q$. Thay vì làm việc trực tiếp với isogeny 1-chiều bậc $q$ (không hiệu quả), PRISM nhúng nó vào một higher-dimensional isogeny bậc trơn (smooth degree) bằng cách dùng Kani's Lemma với $N = q \cdot 2^a$ và $d_1 = q$, $d_2 = 2^a$ (với $2^a \approx q$ để $N$ là bội số trơn). Đây là kỹ thuật cốt lõi làm cho scheme hiệu quả.
>
> *(theo [Kani97]: Kani — The number of curves of genus two with elliptic differentials; áp dụng trong SQIsign2D-West [6] và PRISM)*

---

## The Deuring Correspondence

Đây là viên đá tảng của toàn bộ isogeny-based cryptography hiện đại. Nó thiết lập một **bijection** giữa thế giới geometric (isogenies giữa đường cong elliptic) và thế giới algebraic (ideals trong quaternion algebra).

### Quaternion Algebra Setup

Với $p$ nguyên tố, tồn tại duy nhất (lên tới đẳng cấu) quaternion algebra phân kỳ tại $p$ và $\infty$:

$$
\mathcal{B}_{p,\infty} = \mathbb{Q} \oplus \mathbb{Q}i \oplus \mathbb{Q}j \oplus \mathbb{Q}k, \quad i^2 = -p, \; j^2 = -q, \; ij = -ji = k
$$

với $q$ là số nguyên tố sao cho $-q$ là non-residue mod $p$. Các **maximal order** $\mathcal{O} \subset \mathcal{B}_{p,\infty}$ là các subring maximal.

> [!note] Định nghĩa 1.3 — Connecting Ideal (Ideal Nối)
> Cho $\mathcal{O}_1, \mathcal{O}_2$ là hai maximal order trong $\mathcal{B}_{p,\infty}$. Một **left $\mathcal{O}_1$-ideal** $I$ được gọi là **connecting ideal** từ $\mathcal{O}_1$ sang $\mathcal{O}_2$ nếu:
>
> $$
> \mathcal{O}_L(I) = \mathcal{O}_1, \quad \mathcal{O}_R(I) = \mathcal{O}_2
> $$
>
> trong đó $\mathcal{O}_L(I) = \{\alpha \in \mathcal{B}_{p,\infty} : \alpha I \subseteq I\}$ là left order của $I$, và tương tự cho $\mathcal{O}_R$.

### Bảng Deuring Correspondence

Paper tóm tắt correspondence này trong Table 1 (theo [SQIsign2D-West, [6]]):

> [!info] 🟡 Table 1 — The Deuring Correspondence (từ [SQIsign2D-West, 6])
> Bảng dưới đây thiết lập bijection giữa đối tượng geometric và algebraic:
>
> | **Geometric (Isogeny)** | **Algebraic (Quaternion Ideal)** |
> |------------------------|----------------------------------|
> | Đường cong supersingular $E$ | Maximal order $\mathcal{O} = \text{End}(E)$ |
> | Isogeny $\phi : E \to E'$ bậc $N$ | Left $\mathcal{O}$-ideal $I_\phi$ với $\text{nrd}(I_\phi) = N$ |
> | Dual isogeny $\hat{\phi}$ | Conjugate ideal $\bar{I}_\phi$ |
> | Composition $\psi \circ \phi$ | Product $I_\psi \cdot I_\phi$ |
> | Endomorphism ring $\text{End}(E)$ | Maximal order $\mathcal{O}$ (right order của bất kỳ ideal nào ứng với isogeny đến $E$) |
>
> *(theo [6]: Basso et al. — SQIsign2D-West, ASIACRYPT 2024; và [Deuring, 1941])*

### Tại sao Correspondence này quan trọng?

Deuring Correspondence cho phép **chuyển bài toán isogeny thành bài toán lý thuyết số**. Cụ thể:

1. **Biết** $\text{End}(E)$ → **dễ** tính isogeny từ $E$ đến bất kỳ $E'$ nào (tra bảng left ideal, chạy IdealToIsogeny)
2. **Không biết** $\text{End}(E)$ → **khó** tính isogeny bậc bất kỳ từ $E$

Đây chính là **trapdoor** của scheme PRISM: secret key là $\text{End}(E_{vk})$; public key chỉ là đường cong $E_{vk}$.

---

## Hardness Foundation cho PRISM

Dựa trên Deuring Correspondence, ta có thể phát biểu trực quan bài toán hardness:

> [!warning] Bài toán hardness (trực quan, trước khi formalize ở Lesson 03)
> **Cho**: Đường cong supersingular $E$ với **endomorphism ring không biết** và một số nguyên tố lớn $q$  
> **Tìm**: Isogeny $\phi : E \to E'$ sao cho $\deg(\phi) = q$
>
> Bài toán này được giả thiết là khó cho cả máy tính classical và quantum vì: không có $\text{End}(E)$ thì không thể dùng Deuring Correspondence để tìm ideal $I$ tương ứng, và không có ideal thì không thể chạy IdealToIsogeny.

---

## Summary

- **Supersingular elliptic curves** trên $\mathbb{F}_{p^2}$ có endomorphism ring là maximal order trong quaternion algebra $\mathcal{B}_{p,\infty}$.
- **Kani's Lemma** (Theorem 1): cho phép nhúng isogeny bậc $N = d_1 + d_2$ vào higher-dimensional isogeny giữa products of curves — kỹ thuật then chốt làm PRISM hiệu quả.
- **Deuring Correspondence**: bijection geometric ↔ algebraic — biết endomorphism ring $\Leftrightarrow$ biết cách tính isogeny.
- **Trapdoor**: secret key = $\text{End}(E_{vk})$; không có trapdoor thì không thể tính isogeny từ $E_{vk}$.

---

## References

- [Kani97] Kani — *The number of curves of genus two with elliptic differentials*, J. reine angew. Math. 1997 (🟡 Theorem 1)
- [6] / [Basso+24] Basso et al. — *SQIsign2D-West*, ASIACRYPT 2024 (🟡 Table 1, IdealToIsogeny)
- [Deuring41] Deuring — *Die Typen der Multiplikatorenringe elliptischer Funktionenkörper*, 1941 (⚪ Historical)
- [Sil09] Silverman — *The Arithmetic of Elliptic Curves*, Springer 2009 (🔴 Prerequisite)
- [Voi21] Voight — *Quaternion Algebras*, Springer 2021 (🔴 Prerequisite)
