---
title: "03. The Deuring Correspondence"
type: math-component
tags: [sqisign, deuring-correspondence, isogeny, quaternion, math-component, lesson-03]
aliases: [Deuring Correspondence, Kernel Ideal, Isogeny-Ideal Bijection]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: [[01-supersingular-isogeny-graphs\|01. Supersingular Isogeny Graphs]], [[02-quaternion-algebras\|02. Quaternion Algebras, Orders & Ideals]]  
> 🔴 **Prerequisite references**: Deuring [Deu41] (kết quả gốc về endomorphism ring); Silverman [Sil09] (ECC background); Kohel PhD thesis [Koh96] (constructive Deuring)  
> **Lesson type**: Math Component  
> **Covers**: §2.3 (The Deuring Correspondence — full), bao gồm kernel ideals, Proposition 3 (composition = ideal product), concrete example j=1728, representing endomorphism rings
>
> **Notation** (nhất quán với Lesson 01–02):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_0$ | Special curve (j-invariant 1728, $p \equiv 3 \pmod 4$) |
> | $\mathcal{O}_0 \cong \text{End}(E_0)$ | Special extremal order cố định |
> | $\varphi_I$ | Isogeny tương ứng với ideal $I$ (via Deuring) |
> | $I_\varphi$ | Kernel ideal của isogeny $\varphi$ |
> | $E_0[I]$ | Kernel subgroup của ideal $I$ trên $E_0$ |
> | $\mathcal{O}_1 \cong \text{End}(E_1)$ | Right order của $I_\varphi$ |
> | $[I]_*$ | Pushforward của ideal theo isogeny |
> | $\text{Cl}(\mathcal{O}_0)$ | Ideal class set của $\mathcal{O}_0$ |

---

## Motivation

Deuring correspondence (1941) là cầu nối giữa **thế giới hình học** (đường cong elliptic, isogenies) và **thế giới đại số** (quaternion algebras, ideals). Kết quả này cho phép SQISign "dịch" bài toán isogeny — vốn khó — về bài toán ideal trong quaternion algebra — vốn dễ hơn về mặt lập lịch thuật toán. Nhưng quan trọng hơn, nó tạo ra một **từ điển song ngữ** chính xác: mọi thao tác trên isogenies đều có counterpart trong ngôn ngữ ideals, và ngược lại.

Đây là lý do Deuring correspondence là *khung toán học trung tâm* của SQISign — không phải chỉ là công cụ, mà là chính ngôn ngữ mà scheme được viết.

---

## Kết quả của Deuring (1941)

> [!abstract] Theorem 3.1 — Deuring Correspondence (kết quả gốc)
> Với $p$ nguyên tố, endomorphism ring của bất kỳ đường cong elliptic supersingular $E/\mathbb{F}_{p^2}$ đều **đồng cấu** với một **maximal order** trong $B_{p,\infty}$.
>
> Cụ thể hơn (theo [Koh96, Wat69]): correspondence này là một **equivalence of categories** giữa:
>
> - Supersingular elliptic curves định nghĩa trên $\mathbb{F}_{p^2}$ (up to $\mathbb{F}_{p^2}$-isomorphism), và
> - Left ideals của một maximal order cố định $\mathcal{O}_0 \subset B_{p,\infty}$
>
> Nó tạo ra bijection giữa **conjugacy classes của j-invariants supersingular** và **maximal orders** (up to equivalence).

Bijection cụ thể được xây dựng qua **kernel ideals**, định nghĩa bên dưới.

---

## Kernel Ideal: Từ Isogeny sang Ideal

Cố định $E_0$ với $\text{End}(E_0) \cong \mathcal{O}_0$. Ta gắn mỗi isogeny $\varphi: E_0 \to E_1$ với một left $\mathcal{O}_0$-ideal như sau:

> [!note] Định nghĩa 3.2 — Kernel Ideal $I_\varphi$ (theo [Wat69], dùng trong §2.3)
> Với isogeny $\varphi: E_0 \to E_1$, **kernel ideal** tương ứng là:
>
> $$
> I_\varphi = \{\alpha \in \mathcal{O}_0 : \alpha(P) = 0 \text{ với mọi } P \in \ker(\varphi)\}
> $$
>
> Đây là tập tất cả endomorphisms của $E_0$ (nhìn như phần tử của $\mathcal{O}_0$) triệt tiêu toàn bộ kernel của $\varphi$.

> [!info] 🟡 Nguồn gốc (theo [Wat69])
> Định nghĩa kernel ideal ban đầu xuất phát từ [Waterhouse 1969] và được phát triển bởi Kohel trong PhD thesis [Koh96]. Paper SQISign §2.3 dùng trực tiếp định nghĩa này. Trực giác: $I_\varphi$ "mô tả" isogeny $\varphi$ từ phía đại số — nó chứa đúng những endomorphisms "đi qua" kernel của $\varphi$.

Tính chất của $I_\varphi$: đây là integral left $\mathcal{O}_0$-ideal, và $\mathcal{O}_R(I_\varphi) \cong \text{End}(E_1)$.

---

## Từ Ideal sang Isogeny

Chiều ngược lại: cho một integral left $\mathcal{O}_0$-ideal $I$, ta xây dựng isogeny tương ứng:

> [!note] Định nghĩa 3.3 — Isogeny từ Ideal
> Với integral left $\mathcal{O}_0$-ideal $I$, định nghĩa:
>
> $$
> E_0[I] = \bigcap_{\alpha \in I} \ker(\alpha) = \{P \in E_0(\mathbb{F}_{p^2}) : \alpha(P) = 0 \text{ với mọi } \alpha \in I\}
> $$
>
> Gọi đây là **kernel của $I$** (kernel subgroup tương ứng với ideal). Isogeny tương ứng:
>
> $$
> \varphi_I : E_0 \to E_0 / E_0[I]
> $$
>
> được tính bằng Vélu's formula từ kernel $E_0[I]$.

> [!abstract] Proposition 3.4 — Bijection cơ bản
> Hai maps $(I \mapsto \varphi_I)$ và $(\varphi \mapsto I_\varphi)$ là nghịch đảo của nhau (up to isomorphism). Cụ thể:
>
> - $I_{(\varphi_I)} = I$ (up to equivalence)
> - $\varphi_{(I_\varphi)} \cong \varphi$ (up to isomorphism của target)
>
> Do đó: bijection giữa **(equivalence classes của) left $\mathcal{O}_0$-ideals** và **(isomorphism classes của) pairs $(E_1, \varphi)$** với $\varphi: E_0 \to E_1$.

---

## Bảng Tổng kết Deuring Correspondence (Table 1 — phần cổ điển)

Đây là "từ điển" đầy đủ giữa hai ngôn ngữ (Table 1 trong paper, phần **không** đánh dấu [this work]):

| Thế giới isogeny ($E_0/\mathbb{F}_{p^2}$) | Thế giới quaternion ($B_{p,\infty}$) |
|---------------------------------------|--------------------------------------|
| j-invariant $j(E)$ (up to Galois) | Maximal order $\mathcal{O} \cong \text{End}(E)$ (up to iso.) |
| Pair $(E_1, \varphi)$ với $\varphi: E_0 \to E_1$ | Integral left $\mathcal{O}_0$-ideal $I_\varphi$ |
| Endomorphism $\theta \in \text{End}(E_0)$ | Principal ideal $\mathcal{O}_0\theta$ |
| $\deg(\varphi)$ | $\text{n}(I_\varphi)$ |
| Dual isogeny $\hat{\varphi}: E_1 \to E_0$ | Conjugate ideal $\overline{I_\varphi}$ |
| $\varphi \sim \psi$ (isomorphic target) | $I_\varphi \sim I_\psi$ (equivalent ideals) |
| j-invariants / $\text{Cl}(\mathcal{O}_0)$ | $\text{Cl}(\mathcal{O}_0)$ |
| Composition $\tau \circ \rho: E_0 \to E_1 \to E_2$ | $I_{\tau \circ \rho} = I_\rho \cdot I_\tau$ (**Proposition 3**, [this work] — xem dưới) |

> [!abstract] Proposition 3.5 — Composition = Ideal Product (Proposition 3 trong paper)
> Với $\rho: E_0 \to E_1$ và $\tau: E_1 \to E_2$:
>
> $$
> I_{\tau \circ \rho} = I_\rho \cdot I_\tau
> $$
>
> (lưu ý thứ tự đảo ngược: tích $I_\rho \cdot I_\tau$, không phải $I_\tau \cdot I_\rho$).

**Proof sketch.** Theo định nghĩa kernel ideal: $I_{\tau \circ \rho}$ gồm các $\alpha \in \mathcal{O}_0$ triệt tiêu $\ker(\tau \circ \rho)$. Vì $\ker(\tau \circ \rho) \supseteq \ker(\rho)$, mọi $\alpha \in I_\rho$ thuộc $I_{\tau \circ \rho}$. Phần còn lại theo từ cấu trúc tích ideal trong $B_{p,\infty}$ và tính multiplicativity của degree: $\text{n}(I_\rho \cdot I_\tau) = \text{n}(I_\rho)\text{n}(I_\tau) = \deg(\rho)\deg(\tau) = \deg(\tau \circ \rho)$. $\blacksquare$

> [!tip] 💡 Agent note
> Thứ tự đảo ngược ($I_{\tau \circ \rho} = I_\rho \cdot I_\tau$, không phải $I_\tau \cdot I_\rho$) là do convention: $I_\varphi$ là **left** $\mathcal{O}_L$-ideal với $\mathcal{O}_L = \mathcal{O}_0$ và $\mathcal{O}_R = \text{End}(E_1)$. Khi nhân $I_\rho \cdot I_\tau$, right order của $I_\rho$ phải bằng left order của $I_\tau$ — điều này đúng khi $\mathcal{O}_R(I_\rho) \cong \text{End}(E_1) = \mathcal{O}_L(I_\tau)$.

---

## Ví dụ Cụ thể: Curve $j = 1728$

> [!example] Ví dụ 3.6 — Deuring correspondence tại $E_0$
> Với $p \equiv 3 \pmod 4$, curve $E_0: y^2 = x^3 + x$ (j-invariant 1728) định nghĩa trên $\mathbb{F}_p$:
>
> $$
> \text{End}(E_0) \cong \mathcal{O}_0 = \left\langle 1, i, \frac{i+j}{2}, \frac{1+k}{2} \right\rangle, \quad i^2 = -1,\; j^2 = -p,\; k = ij
> $$
>
> Hai endomorphisms tường minh và có thể compute:
>
> - $\pi: (x,y) \mapsto (x^p, y^p)$ — Frobenius morphism, tương ứng $\frac{1+k}{2}$ (or related element) trong $\mathcal{O}_0$
> - $\iota: (x,y) \mapsto (-x, \sqrt{-1}\,y)$ — tương ứng $i$ trong $\mathcal{O}_0$
>
> Với isogeny bất kỳ $\varphi: E_0 \to E_1$ degree $N_\varphi$, kernel ideal $I_\varphi$ là left $\mathcal{O}_0$-ideal thỏa:
>
> $$
> N_\varphi \cdot \mathcal{O}_1 \subset \mathcal{O}_0, \quad \mathcal{O}_1 = \mathcal{O}_R(I_\varphi) \cong \text{End}(E_1)
> $$

---

## Biểu diễn Tường minh Endomorphism Ring

Một thực tế quan trọng cho implementation: ngoài $E_0$, **không có algorithm polynomial-time nào** biết basis tường minh cho $\text{End}(E_1)$ mà không cần thêm thông tin. Tuy nhiên, nếu biết isogeny $\varphi: E_0 \to E_1$ degree $N_\varphi$, ta có thể **biểu diễn** và **evaluate** elements của $\text{End}(E_1)$:

> [!note] Construction 3.7 — Biểu diễn $\text{End}(E_1)$ qua $E_0$ (từ [EHL+18])
> Đặt $\mathcal{O}_1 \cong \text{End}(E_1)$ và $\{\omega_i\}_{i=1}^4$ là Z-basis của $\mathcal{O}_0$ với endomorphisms $\{\rho_i\}$ tương ứng. Mọi $\alpha \in \mathcal{O}_1$ viết được dưới dạng:
>
> $$
> \alpha = \frac{1}{N_\varphi} \sum_{i=1}^{4} a_i \omega_i, \quad a_i \in \mathbb{Z}
> $$
>
> (vì $N_\varphi \mathcal{O}_1 \subset \mathcal{O}_0$). Và **evaluation** tại point $P \in E_1(\mathbb{F}_{p^2})$:
>
> $$
> \alpha(P) = \frac{1}{N_\varphi^2} \sum_{i=1}^{4} [a_i] \varphi \circ \rho_i \circ \hat{\varphi}(P)
> $$

> [!info] 🟡 Nguồn gốc (theo [EHL+18])
> Công thức evaluation này xuất phát từ [Eisenträger–Hallgren–Lauter–Morrison–Petit 2018]. Nó dùng $E_0$ như "anchor": thay vì apply $\alpha$ trực tiếp trên $E_1$, ta đi vòng qua $E_0$ via $\hat{\varphi}$, apply $\rho_i$ trên $E_0$ rồi push forward qua $\varphi$. Chi phí: $O(N_\varphi^2)$ — acceptable khi $N_\varphi$ không quá lớn.

---

## Pushforward Ideal

Một khái niệm quan trọng sẽ dùng nhiều trong KLPT:

> [!note] Định nghĩa 3.8 — Pushforward $[I_\tau]_* J$
> Với isogeny $\tau: E_0 \to E_A$ (kernel ideal $I_\tau$) và ideal $J$ là left $\mathcal{O}_0$-ideal, **pushforward** của $J$ dọc theo $\tau$:
>
> $$
> [I_\tau]_* J = \overline{I_\tau} \cdot J \cdot \frac{1}{\text{n}(I_\tau)}
> $$
>
> Đây là left $\mathcal{O}_A$-ideal, và tương ứng với isogeny "được push forward" từ $E_0$ sang $E_A$.

Pushforward là thao tác kỹ thuật cốt lõi trong SigningKLPT (Lesson 08): nó cho phép "chuyển" một ideal từ $\mathcal{O}_0$-world sang $\mathcal{O}_A$-world mà không cần biết basis tường minh của $\mathcal{O}_A$.

---

## Tại sao Deuring Correspondence là Nền tảng của SQISign?

> [!abstract] Corollary 3.9 — Ý nghĩa cryptographic
> Dưới Deuring correspondence:
>
> 1. **Secret key** $\tau: E_0 \to E_A$ ↔ ideal $I_\tau \in \text{Cl}(\mathcal{O}_0)$ với $\mathcal{O}_R(I_\tau) = \mathcal{O}_A$
> 2. **Public key** $E_A$ ↔ maximal order $\mathcal{O}_A \cong \text{End}(E_A)$
> 3. **Commitment** $\psi: E_0 \to E_1$ ↔ random ideal $I_\psi$
> 4. **Response** $\sigma: E_A \to E_2$ ↔ ideal trong $\mathcal{O}_A$-world
>
> Toàn bộ giao thức identification diễn ra "song song" trong cả hai ngôn ngữ. Signer làm việc trong ngôn ngữ ideal (thuật toán KLPT); Verifier làm việc trong ngôn ngữ isogeny (verify chuỗi đường cong và degree).

> [!warning] Remark về Notation (Remark 1 trong paper)
> Trong paper, các tác giả dùng "abuse of notation": viết $\alpha$ để chỉ **cả** phần tử $\alpha \in \mathcal{O}_0$ và endomorphism tương ứng trong $\text{End}(E_0)$, đồng thời viết $\alpha$ cho principal ideal $\mathcal{O}_0\alpha$. Cụ thể:
>
> $$
> \alpha \in \mathcal{O}_0 \;\longleftrightarrow\; \text{endomorphism } \rho_\alpha \in \text{End}(E_0) \;\longleftrightarrow\; \text{principal ideal } \mathcal{O}_0\alpha
> $$
>
> Principal ideal $\mathcal{O}_0\alpha$ có kernel ideal $I_\alpha = I_{\rho_\alpha}$, và ngược lại mọi principal ideal tương ứng với một endomorphism.

---

## Summary

- **Deuring (1941)**: $\text{End}(E) \cong$ maximal order trong $B_{p,\infty}$ với mọi $E$ supersingular.
- **Kernel ideal** $I_\varphi$: endomorphisms của $E_0$ triệt tiêu $\ker(\varphi)$ — cầu nối từ isogeny sang ideal.
- **Isogeny từ ideal**: $\varphi_I: E_0 \to E_0/E_0[I]$ via Vélu, với $E_0[I] = \bigcap_{\alpha \in I} \ker(\alpha)$.
- **Composition = product**: $I_{\tau \circ \rho} = I_\rho \cdot I_\tau$ (Proposition 3 trong paper).
- **Bijection**: pairs $(E_1, \varphi: E_0 \to E_1)$ up to iso. ↔ left $\mathcal{O}_0$-ideals up to equivalence ↔ $\text{Cl}(\mathcal{O}_0)$.
- **Biểu diễn** $\text{End}(E_1)$ qua $\varphi: E_0 \to E_1$ — cho phép compute endomorphisms mà không cần basis tường minh.
- **Pushforward** $[I_\tau]_*J$: chuyển ideal từ $\mathcal{O}_0$-world sang $\mathcal{O}_A$-world — dùng trong SigningKLPT.

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §2.3
- [Deu41] Deuring — *Die Typen der Multiplikatorenringe* (🔴 Prerequisite — kết quả gốc)
- [Koh96] Kohel — PhD thesis, UC Berkeley 1996 (constructive Deuring) (🔴 Prerequisite)
- [Wat69] Waterhouse — *Abelian varieties over finite fields*, 1969 (🟡 — kernel ideal definition, §2.3)
- [EHL+18] Eisenträger, Hallgren, Lauter, Morrison, Petit — *EUROCRYPT 2018* (🟡 — biểu diễn End(E1), dùng trong Lesson 05)
- [Voi21] Voight — *Quaternion Algebras* [50, Remark 42.3.10] (🔴 Prerequisite; được tổng quát hóa trong Lesson 06)
