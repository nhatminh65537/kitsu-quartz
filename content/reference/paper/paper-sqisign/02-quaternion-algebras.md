---
title: "02. Quaternion Algebras, Orders & Ideals"
type: math-component
tags: [sqisign, quaternion-algebras, orders, ideals, math-component, lesson-02]
aliases: [Quaternion Algebras, Bp,∞, Maximal Orders, Ideal Classes]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: Đại số tuyến tính (Z-lattice, basis, discriminant), lý thuyết vành cơ bản (ring, ideal, invertibility), [[01-supersingular-isogeny-graphs\|01. Supersingular Isogeny Graphs]]  
> 🔴 **Prerequisite references**: Deuring [Deu41] (background về quaternion algebras và elliptic curves); Voight — *Quaternion Algebras* [Voi21] (textbook toàn diện, đặc biệt Ch. 10–23)  
> **Lesson type**: Math Component  
> **Covers**: §2.2 (Quaternion algebras, Orders and Ideals, Cl(O))
>
> **Notation** (ký hiệu dùng xuyên suốt bài):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $H(a,b)$ | Quaternion algebra trên $\mathbb{Q}$ với $i^2=a$, $j^2=b$ |
> | $B_{p,\infty}$ | Quaternion algebra duy nhất ramified tại $p$ và $\infty$ |
> | $\bar{\alpha}$ | Conjugate của $\alpha \in B_{p,\infty}$ |
> | $\text{tr}(\alpha)$ | Reduced trace: $\alpha + \bar{\alpha}$ |
> | $\text{n}(\alpha)$ | Reduced norm: $\alpha\bar{\alpha}$ |
> | $\mathcal{O}$ | Order (maximal order hoặc suborder) trong $B_{p,\infty}$ |
> | $\mathcal{O}_0$ | Special extremal order cố định (gắn với $E_0$) |
> | $I, J$ | Fractional ideal (Z-lattice rank 4) |
> | $\text{n}(I)$ | Norm của ideal $I$ |
> | $\mathcal{O}_L(I), \mathcal{O}_R(I)$ | Left order, right order của $I$ |
> | $\text{Cl}(\mathcal{O})$ | Tập equivalence classes của left $\mathcal{O}$-ideals |
> | $[I:J]$ | Index của $J$ trong $I$ (khi $J \subseteq I$) |

---

## Motivation

Lý do tại sao quaternion algebras xuất hiện trong cryptography isogeny-based? Câu trả lời nằm ở Deuring correspondence (Lesson 03): endomorphism ring của đường cong elliptic supersingular **là** một maximal order trong quaternion algebra $B_{p,\infty}$. Do đó mọi thao tác trên isogenies đều có thể "dịch" về thao tác trên ideals của orders trong $B_{p,\infty}$ — đây là ngôn ngữ đại số hóa toàn bộ SQISign.

Bài này xây dựng nền tảng đại số này từ đầu: quaternion algebra là gì, norm và trace là gì, orders và ideals là gì, và tại sao equivalence classes của ideals (Cl($\mathcal{O}$)) lại quan trọng.

---

## Quaternion Algebra $H(a,b)$ và $B_{p,\infty}$

> [!note] Định nghĩa 2.1 — Quaternion Algebra
> Với $a, b \in \mathbb{Q}^*$, **quaternion algebra** $H(a,b)$ là $\mathbb{Q}$-algebra 4 chiều:
>
> $$
> H(a,b) = \mathbb{Q} \cdot 1 \oplus \mathbb{Q} \cdot i \oplus \mathbb{Q} \cdot j \oplus \mathbb{Q} \cdot k
> $$
>
> với luật nhân **không giao hoán** (non-commutative) xác định bởi:
>
> $$
> i^2 = a, \quad j^2 = b, \quad k = ij = -ji
> $$
>
> (và do đó $k^2 = -ab$).

Một phần tử $\alpha \in H(a,b)$ viết được dưới dạng $\alpha = a_1 + a_2 i + a_3 j + a_4 k$ với $a_i \in \mathbb{Q}$.

Trong SQISign, ta quan tâm đến một quaternion algebra đặc biệt:

> [!note] Định nghĩa 2.2 — $B_{p,\infty}$
> Với $p$ là số nguyên tố, $B_{p,\infty}$ là **quaternion algebra duy nhất** (up to isomorphism) trên $\mathbb{Q}$ **ramified** (bị phân nhánh) tại đúng hai chỗ: tại $p$ và tại $\infty$.
>
> Khi $p \equiv 3 \pmod{4}$:
>
> $$
> B_{p,\infty} = H(-1, -p) = \mathbb{Q} + i\mathbb{Q} + j\mathbb{Q} + k\mathbb{Q}, \quad i^2 = -1,\; j^2 = -p,\; k = ij
> $$

"Ramified tại $p$ và $\infty$" có nghĩa là $B_{p,\infty}$ là **division algebra** (không có zero divisors khác 0) — tính chất tương tự quaternion Hamilton $\mathbb{H} = H(-1,-1)$ nhưng trên $\mathbb{Q}$ thay vì $\mathbb{R}$.

---

## Conjugation, Trace, Norm

> [!note] Định nghĩa 2.3 — Involution chính tắc (Canonical involution)
> Mọi quaternion algebra có involution tắc:
>
> $$
> \overline{a_1 + a_2 i + a_3 j + a_4 k} = a_1 - a_2 i - a_3 j - a_4 k
> $$
>
> Từ đó định nghĩa **reduced trace** và **reduced norm**:
>
> $$
> \text{tr}(\alpha) = \alpha + \bar{\alpha} = 2a_1 \in \mathbb{Q}
> $$
>
> $$
> \text{n}(\alpha) = \alpha \bar{\alpha} = a_1^2 + |a|a_2^2 + |b|a_3^2 + |ab|a_4^2 \in \mathbb{Q}
> $$

Norm có tính **multiplicative**: $\text{n}(\alpha\beta) = \text{n}(\alpha)\text{n}(\beta)$ với mọi $\alpha, \beta$.

Norm tạo ra **inner product** trên $B_{p,\infty}$ xem như $\mathbb{Q}$-vector space:

$$
(\alpha, \beta) \mapsto \frac{1}{2}\bigl(\text{n}(\alpha + \beta) - \text{n}(\alpha) - \text{n}(\beta)\bigr)
$$

Inner product này **positive definite** với orthogonal basis $\{1, i, j, k\}$ — đây là lý do $B_{p,\infty}$ có thể xem như Z-lattice khi xét orders.

> [!example] Ví dụ 2.4 — Tính norm và trace
> Trong $B_{p,\infty} = H(-1,-p)$, với $\alpha = 2 + 3i + j - k$:
>
> $$
> \bar{\alpha} = 2 - 3i - j + k
> $$
>
> $$
> \text{tr}(\alpha) = \alpha + \bar{\alpha} = 4
> $$
>
> $$
> \text{n}(\alpha) = \alpha\bar{\alpha} = 4 + 9 + p + p = 13 + 2p
> $$
>
> (vì $i^2 = -1$ nên $a_2^2 |a| = 9$; $j^2 = -p$ nên $a_3^2 |b| = p$; $k^2 = -1\cdot(-p) = p$ nên $a_4^2 |ab| = p$)

---

## Orders trong $B_{p,\infty}$

> [!note] Định nghĩa 2.5 — Order
> Một **order** $\mathcal{O} \subset B_{p,\infty}$ là subring của $B_{p,\infty}$ đồng thời là **Z-lattice** bậc 4, tức là:
>
> $$
> \mathcal{O} = \mathbb{Z}\alpha_1 + \mathbb{Z}\alpha_2 + \mathbb{Z}\alpha_3 + \mathbb{Z}\alpha_4
> $$
>
> với $\{\alpha_1, \alpha_2, \alpha_3, \alpha_4\}$ là basis của $B_{p,\infty}$ trên $\mathbb{Q}$.
>
> Các phần tử của $\mathcal{O}$ gọi là **integral** vì reduced trace và norm của chúng đều nằm trong $\mathbb{Z}$.

> [!note] Định nghĩa 2.6 — Discriminant và Maximal Order
> **Discriminant** của $\mathcal{O}$ (với basis $\langle\alpha_1, \alpha_2, \alpha_3, \alpha_4\rangle$):
>
> $$
> \text{disc}(\mathcal{O}) = p \cdot \det\bigl((\alpha_i, \alpha_j)\bigr)_{i,j \in \{1,2,3,4\}} \in \mathbb{Z}
> $$
>
> Giá trị này độc lập với chọn basis. Nếu $\mathcal{O}' \subset \mathcal{O}$ là suborder với $N = [\mathcal{O} : \mathcal{O}']$ thì:
>
> $$
> \text{disc}(\mathcal{O}') = N^2 \cdot \text{disc}(\mathcal{O})
> $$
>
> Order $\mathcal{O}$ gọi là **maximal** nếu không có order nào lớn hơn chứa nó. Maximal order có discriminant nhỏ nhất.

Trong $B_{p,\infty}$, tất cả maximal orders đều conjugate với nhau (do $B_{p,\infty}$ là algebra đơn giản). Tuy nhiên, không phải tất cả đều isomorphic như rings — tập conjugacy classes của maximal orders phản ánh cấu trúc của supersingular isogeny graph.

> [!note] Định nghĩa 2.7 — Special Extremal Order $\mathcal{O}_0$
> Một **special extremal order** là maximal order $\mathcal{O}_0$ chứa một suborder có phân tích trực giao dạng $R + jR$ trong đó $R = \mathbb{Z}[\omega] \subset \mathbb{Q}[i]$ là quadratic order **discriminant nhỏ nhất**.
>
> Ví dụ điển hình (và cố định trong SQISign): với $p \equiv 3 \pmod 4$, chọn $\omega = i$ ($i^2 = -1$):
>
> $$
> \mathcal{O}_0 = \left\langle 1,\; i,\; \frac{i+j}{2},\; \frac{1+k}{2} \right\rangle, \quad i^2 = -1,\; j^2 = -p,\; k = ij
> $$
>
> Đây chính là endomorphism ring của curve $E_0$ (j-invariant 1728). Cấu trúc trực giao $R + jR = \mathbb{Z}[i] + j\mathbb{Z}[i]$ là điều kiện cho phép KLPT algorithm hoạt động.

> [!tip] 💡 Agent note
> Lý do "special extremal" quan trọng: tính chất orthogonal decomposition $R + jR$ của $\mathcal{O}_0$ cho phép solve norm equations hiệu quả bằng Cornacchia's algorithm — đây là sub-routine cốt lõi của KLPT (Lesson 04). Các maximal orders khác không có cấu trúc này, đó là lý do SQISign cần Generalized KLPT (Lesson 07).

---

## Fractional Ideals và Ideals

> [!note] Định nghĩa 2.8 — Fractional Ideal
> Một **fractional ideal** $I \subset B_{p,\infty}$ là Z-lattice bậc 4:
>
> $$
> I = \mathbb{Z}\alpha_1 + \mathbb{Z}\alpha_2 + \mathbb{Z}\alpha_3 + \mathbb{Z}\alpha_4
> $$
>
> **Norm** của $I$: $\text{n}(I)$ là Z-module sinh bởi $\{\text{n}(\alpha) : \alpha \in I\}$, tức là $\text{n}(I) = d\mathbb{Z}$ với $d = \gcd\{\text{n}(\alpha) : \alpha \in I\}$.
>
> **Left order** và **right order** của $I$:
>
> $$
> \mathcal{O}_L(I) = \{\alpha \in B_{p,\infty} : \alpha I \subseteq I\}, \quad \mathcal{O}_R(I) = \{\alpha \in B_{p,\infty} : I\alpha \subseteq I\}
> $$
>
> $I$ gọi là **left $\mathcal{O}_L(I)$-ideal** (và right $\mathcal{O}_R(I)$-ideal).

Khi $\mathcal{O}_L(I) = \mathcal{O}_R(I) = \mathcal{O}$, ta gọi $I$ là two-sided ideal của $\mathcal{O}$. Trong trường hợp tổng quát, left và right order khác nhau — phản ánh tính non-commutative của $B_{p,\infty}$.

> [!note] Định nghĩa 2.9 — Integral Ideal
> $I$ gọi là **integral** nếu $I \subseteq \mathcal{O}_L(I)$ (tương đương với $I \subseteq \mathcal{O}_R(I)$). Từ đây về sau, "ideal" mặc định là integral.
>
> Một integral ideal norm $N$ và generator $\alpha \in \mathcal{O}$ viết được dạng:
>
> $$
> I = \mathcal{O}\alpha + \mathcal{O} \cdot N = \mathcal{O}\langle \alpha, N \rangle
> $$

---

## Tính toán với Ideals: Product, Conjugate, Inverse

**Tích hai ideals**: Cho $I$ và $J$ với $\mathcal{O}_R(I) = \mathcal{O}_L(J)$, tích $IJ$ là ideal sinh bởi tất cả tích $\alpha\beta$ với $\alpha \in I$, $\beta \in J$. Khi đó:

$$
\mathcal{O}_L(IJ) = \mathcal{O}_L(I), \quad \mathcal{O}_R(IJ) = \mathcal{O}_R(J)
$$

**Norm multiplicative**: $\text{n}(IJ) = \text{n}(I) \cdot \text{n}(J)$.

> [!note] Định nghĩa 2.10 — Conjugate và Inverse
> **Conjugate** của $I$: tập $\bar{I} = \{\bar{\alpha} : \alpha \in I\}$ — cũng là một ideal. Với $I$ invertible:
>
> $$
> I\bar{I} = \text{n}(I) \cdot \mathcal{O}_L(I), \quad \bar{I}I = \text{n}(I) \cdot \mathcal{O}_R(I)
> $$
>
> **Inverse** của $I$:
>
> $$
> I^{-1} = \frac{1}{\text{n}(I)} \bar{I}
> $$
>
> sao cho $I \cdot I^{-1} = \mathcal{O}_L(I)$ và $I^{-1} \cdot I = \mathcal{O}_R(I)$.

> [!tip] 💡 Agent note
> Invertibility không tự động cho mọi left $\mathcal{O}$-ideal khi $\mathcal{O}$ là order tùy ý. Tuy nhiên, với maximal orders (như $\mathcal{O}_0$ trong SQISign), mọi integral ideal đều invertible — đây là lý do SQISign làm việc với maximal orders.

---

## Equivalence và Ideal Class Set Cl($\mathcal{O}$)

> [!note] Định nghĩa 2.11 — Equivalence của Orders và Ideals
> Hai orders $\mathcal{O}_1$ và $\mathcal{O}_2$ **equivalent** nếu $\exists\, \beta \in B_{p,\infty}^*$ sao cho $\beta \mathcal{O}_1 = \mathcal{O}_2 \beta$ (conjugacy).
>
> Hai left $\mathcal{O}$-ideals $I$ và $J$ **equivalent** (ký hiệu $I \sim J$) nếu $\exists\, \beta \in B_{p,\infty}^*$ sao cho $I = J\beta$.
>
> Nếu $I \sim J$ thì $\mathcal{O}_R(I)$ và $\mathcal{O}_R(J)$ cũng equivalent (vì $\beta \mathcal{O}_R(I) = \mathcal{O}_R(J)\beta$).

> [!note] Định nghĩa 2.12 — Ideal Class Set
> Với order $\mathcal{O}$, **ideal class set** (tập lớp ideal):
>
> $$
> \text{Cl}(\mathcal{O}) = \{\text{left } \mathcal{O}\text{-ideals}\} / \sim
> $$
>
> là tập các equivalence classes của left $\mathcal{O}$-ideals dưới quan hệ tương đương trên.

$\text{Cl}(\mathcal{O})$ là đối tượng quan trọng nhất trong SQISign: bijection giữa $\text{Cl}(\mathcal{O}_0)$ và j-invariants supersingular (Deuring correspondence, Lesson 03) là nền tảng của toàn bộ scheme. "Sampling a random ideal class" tương ứng với "chọn random isogeny walk" — đây là cơ chế commitment trong giao thức.

> [!example] Ví dụ 2.13 — Principal ideal và endomorphism
> Với endomorphism $\theta \in \text{End}(E_0) \cong \mathcal{O}_0$, ideal **principal** tương ứng là $I_\theta = \mathcal{O}_0 \theta$. Ideal principal luôn equivalent với $\mathcal{O}_0$ (lớp tầm thường). Trong Deuring correspondence, principal ideals tương ứng với endomorphisms — isogenies từ $E_0$ về chính nó.

---

## Phép biến đổi $\chi_I$: Cầu nối giữa Elements và Ideals

Trong §2.4 (KLPT), paper giới thiệu một map quan trọng dựa trên ideals:

> [!note] Định nghĩa 2.14 — Map $\chi_I$
> Với integral ideal $I$, định nghĩa:
>
> $$
> \chi_I(\alpha) = \frac{I\alpha}{\text{n}(I)}, \quad \alpha \in I \setminus \{0\}
> $$
>
> Map này nhận $\alpha \in I$ và trả về ideal $J \sim I$ với $\text{n}(J) = \text{n}(\alpha) / \text{n}(I)$.

> [!abstract] Lemma 2.15 — Surjectivity của $\chi_I$ (Lemma 1 trong paper)
> Map $\chi_I : I \setminus \{0\} \to \{J : J \sim I\}$ là **surjective**. Hơn nữa, $\chi_I(\alpha) = \chi_I(\beta)$ khi và chỉ khi $\alpha = \beta\delta$ với $\delta \in \mathcal{O}_R(I)^{\times}$ (units).
>
> **Hệ quả quan trọng**: Tìm $J \sim I$ với $\text{n}(J) = N$ tương đương với tìm $\alpha \in I$ sao cho $\text{n}(\alpha) = \text{n}(I) \cdot N$.

**Proof.** Map well-defined vì $I\alpha / \text{n}(I)$ là integral ideal. Surjection: với bất kỳ $J \sim I$, viết $I \cdot J = \mathcal{O}_R(I)\beta$ là principal ideal; khi đó $\beta \in I$ và $J = \chi_I(\beta)$. Uniqueness up to units: $\mathcal{O}_R(I)\beta_1 = \mathcal{O}_R(I)\beta_2 \iff \beta_1 = \delta\beta_2$ với $\delta \in \mathcal{O}_R(I)^{\times}$. $\blacksquare$

Hệ quả này là **observation cốt lõi** của toàn bộ KLPT algorithm: thay vì tìm ideal class trực tiếp, ta chỉ cần tìm phần tử norm phù hợp trong một lattice.

---

## Hardness Assumptions trong Ngữ cảnh Quaternion

> [!abstract] Problem 2.16 — Quaternion $\ell$-Isogeny Path Problem
> **Input**: Hai maximal orders $\mathcal{O}_1, \mathcal{O}_2 \subset B_{p,\infty}$.  
> **Output**: Ideal $I$ với $\mathcal{O}_L(I) = \mathcal{O}_1$, $\mathcal{O}_R(I) = \mathcal{O}_2$, và $\text{n}(I) = \ell^e$ (prime-power norm).
>
> **Quan trọng**: Bài toán này **có thể giải trong polynomial time** — đây là nội dung thuật toán KLPT [KLPT14]! Điều này đối lập với ℓ-isogeny path problem trong đồ thị isogeny (khó với quantum). Asymmetry này — dễ trong quaternion, khó trong elliptic curve — là foundation của SQISign.

> [!warning] Tại sao không dùng quaternion trực tiếp để attack?
> Dù có thể giải quaternion path problem, để chuyển solution đó thành isogeny thực sự cần biết **endomorphism ring tường minh** của cả hai curves. Đây là điều kẻ tấn công không có — chỉ signer biết $\mathcal{O}_A \cong \text{End}(E_A)$ vì họ có secret isogeny $\tau: E_0 \to E_A$.

---

## Summary

- $B_{p,\infty} = H(-1,-p)$ (với $p \equiv 3 \pmod 4$): quaternion algebra 4 chiều non-commutative trên $\mathbb{Q}$, ramified tại $p$ và $\infty$.
- **Reduced norm** $\text{n}(\alpha) = \alpha\bar{\alpha}$ multiplicative; tạo inner product positive definite trên $B_{p,\infty}$.
- **Maximal order** $\mathcal{O}$: subring + Z-lattice rank 4, không chứa trong order nào lớn hơn.
- **Special extremal order** $\mathcal{O}_0$: maximal order với cấu trúc $R + jR$ — cho phép KLPT hoạt động.
- **Integral ideal** $I$: Z-lattice rank 4 với $I \subseteq \mathcal{O}_L(I)$; norm $\text{n}(I) \in \mathbb{Z}$; invertible khi $\mathcal{O}$ là maximal.
- **Cl($\mathcal{O}$)**: tập equivalence classes của left $\mathcal{O}$-ideals — correspond bijection với j-invariants supersingular (Deuring, Lesson 03).
- **Map $\chi_I$**: surjection từ elements của $I$ về equivalence classes; tìm ideal class ↔ tìm element với norm phù hợp (cốt lõi KLPT).

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §2.2
- [Deu41] Deuring — *Die Typen der Multiplikatorenringe elliptischer Funktionenkörper* (🔴 Prerequisite)
- [Voi21] Voight — *Quaternion Algebras*, Springer 2021 (🔴 Prerequisite; đặc biệt [50, Remark 42.3.10] được tổng quát hóa trong §4 của paper)
- [KLPT14] Kohel, Lauter, Petit, Tignol — *On the quaternion ℓ-isogeny path problem*, LMS J. Comput. Math. 2014 (🟡 — integrate trong Lesson 04)
