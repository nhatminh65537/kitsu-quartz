---
title: "01. Supersingular Isogeny Graphs"
type: foundation
tags: [sqisign, isogeny, supersingular, foundation, lesson-01]
aliases: [Supersingular Isogeny Graphs, ℓ-isogeny graph]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: ECC cơ bản (group law, Weierstrass equation, j-invariant), finite fields $\mathbb{F}_q$  
> 🔴 **Prerequisite references**: Silverman — *The Arithmetic of Elliptic Curves* [Sil09] (degree of rational maps, endomorphism rings); Vélu [Vél71] (formula tính isogeny từ kernel subgroup)  
> **Lesson type**: Foundation  
> **Covers**: §1 (Introduction), §2.1 (Supersingular elliptic curves and isogenies)
>
> **Notation** (ký hiệu dùng xuyên suốt bài):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Số nguyên tố đặc trưng (characteristic) |
> | $\mathbb{F}_{p^2}$ | Trường hữu hạn bậc $p^2$ |
> | $E, E_1, E_2$ | Đường cong elliptic supersingular |
> | $\varphi, \psi$ | Isogeny |
> | $\hat{\varphi}$ | Dual isogeny của $\varphi$ |
> | $\deg(\varphi)$ | Degree của isogeny $\varphi$ |
> | $\ker(\varphi)$ | Kernel của $\varphi$ |
> | $\text{End}(E)$ | Endomorphism ring của $E$ |
> | $j(E)$ | j-invariant của $E$ |
> | $\ell$ | Số nguyên tố nhỏ (prime degree của isogeny graph) |
> | $[k]$ | Phép nhân-bởi-$k$ trên $E$ |

---

## Motivation

Từ năm 1997 với công trình của Couveignes về "Hard Homogeneous Spaces" cho đến bùng nổ sau 2011 với SIDH (Jao–De Feo), **isogeny-based cryptography** đã trở thành một trong bốn nhánh chính của mật mã hậu lượng tử. Ý tưởng cốt lõi: dùng bài toán tìm đường đi trong đồ thị isogeny của các đường cong elliptic supersingular làm foundation bảo mật.

Hàm hash CGL (Charles–Lauter–Goren, 2009) và giao thức trao đổi khóa SIDH đều đặt **đường cong elliptic supersingular** ở trung tâm, nhờ tính chất Ramanujan của đồ thị $\ell$-isogeny giữa chúng. Bài toán tìm đường đi giữa hai đỉnh trong đồ thị này — **$\ell$-isogeny path problem** — được tin là khó với cả máy tính lượng tử.

SQISign xây dựng lược đồ chữ ký từ bài toán này, với bốn đóng góp chính: (i) giao thức identification một vòng, high-soundness mới; (ii) thuật toán KLPT tổng quát hóa cho arbitrary maximal orders; (iii) chứng minh Eichler orders dưới Deuring correspondence; (iv) implementation C đầy đủ đạt NIST-1 security với chữ ký chỉ 204 bytes.

Bài này xây dựng nền tảng toán học cần thiết: isogeny là gì, supersingular curve là gì, và $\ell$-isogeny graph có cấu trúc như thế nào.

---

## Isogeny: Định nghĩa và Tính chất Cơ bản

> [!note] Định nghĩa 1.1 — Isogeny
> Một **isogeny** $\varphi : E_1 \to E_2$ là một morphism không hằng số (non-constant morphism) giữa hai đường cong elliptic, thỏa mãn $\varphi(\mathcal{O}_{E_1}) = \mathcal{O}_{E_2}$ (ánh điểm đơn vị về điểm đơn vị).
>
> **Degree** của $\varphi$ là degree của nó như một rational map (xem [Sil09]). Khi $\deg(\varphi) = d$ là coprime với $p$, isogeny **separable** và kernel $\ker(\varphi)$ là subgroup hữu hạn bậc $d$ của $E_1(\bar{\mathbb{F}}_p)$.

Tính chất quan trọng của isogeny (từ §2.1):

**Tính chất 1** — Kernel xác định isogeny. Mỗi isogeny separable được xác định hoàn toàn bởi kernel $G = \ker(\varphi)$: có một-một correspondence giữa isogenies separable $E \to E'$ (up to isomorphism của $E'$) và các subgroup hữu hạn $G \subset E(\bar{\mathbb{F}}_p)$. Từ $G$, ta tính $\varphi : E \to E/G$ qua **Vélu's formula** [Vél71].

**Tính chất 2** — Composition. Nếu $\varphi : E_1 \to E_2$ và $\psi : E_2 \to E_3$ là hai isogenies thì:

$$
\deg(\psi \circ \varphi) = \deg(\psi) \cdot \deg(\varphi)
$$

Hơn nữa, mọi isogeny $\varphi$ degree $d = \prod_{i=1}^{n} p_i^{e_i}$ đều phân tích được thành composition của các isogenies prime degree $p_i$.

**Tính chất 3** — Dual isogeny. Với mọi isogeny $\varphi : E_1 \to E_2$ degree $d$, tồn tại duy nhất **dual isogeny** $\hat{\varphi} : E_2 \to E_1$ thỏa mãn:

$$
\varphi \circ \hat{\varphi} = [d]_{E_2}, \qquad \hat{\varphi} \circ \varphi = [d]_{E_1}
$$

Nói cách khác, $\hat{\varphi}$ là "isogeny ngược" của $\varphi$ — không phải inverse thật sự, nhưng composition cho phép nhân-bở-$d$.

> [!example] Ví dụ 1.2 — Multiplication map
> Phép nhân $[n] : E \to E$ (với $n \in \mathbb{Z}$) là một endomorphism (isogeny từ $E$ đến chính nó) có $\deg([n]) = n^2$. Dual của $[n]$ là $[n]$ chính nó.

---

## Endomorphism Ring và Supersingularity

Một endomorphism là isogeny $\varphi : E \to E$. Tập hợp tất cả endomorphisms của $E$ tạo thành một **ring** $\text{End}(E)$ với phép cộng và phép hợp thành (composition).

Với đường cong elliptic $E$ định nghĩa trên trường hữu hạn $\mathbb{F}_q$, **Frobenius map** $\pi : (x,y) \mapsto (x^q, y^q)$ là một endomorphism sinh ra subring $\mathbb{Z}[\pi] \subset \text{End}(E)$.

Cấu trúc của $\text{End}(E)$ phân loại đường cong thành hai loại:

| Loại | $\text{End}(E) \otimes \mathbb{Q}$ | Tính chất |
|------|--------------------------------------|-----------|
| **Ordinary** | Order trong trường số phức bậc hai (imaginary quadratic field) | Phổ biến |
| **Supersingular** | Maximal order trong quaternion algebra $B_{p,\infty}$ | Dùng trong SQISign |

> [!note] Định nghĩa 1.3 — Supersingular elliptic curve
> Đường cong elliptic $E$ định nghĩa trên trường đặc trưng $p$ gọi là **supersingular** (siêu kỳ dị) nếu $\text{End}(E)$ đồng cấu với một **maximal order** trong quaternion algebra $B_{p,\infty}$ (ramified tại $p$ và $\infty$).
>
> Tương đương: $E$ supersingular khi và chỉ khi $E[p](\bar{\mathbb{F}}_p) = \{O\}$ (nhóm $p$-torsion tầm thường).

Một thực tế quan trọng cho SQISign: **mọi** đường cong elliptic supersingular đặc trưng $p$ đều có representative định nghĩa trên $\mathbb{F}_{p^2}$. Do đó ta luôn làm việc trên $\mathbb{F}_{p^2}$.

> [!example] Ví dụ 1.4 — Curve đặc biệt $j = 1728$
> Với $p \equiv 3 \pmod{4}$, đường cong $E_0: y^2 = x^3 + x$ (có $j(E_0) = 1728$) định nghĩa trên $\mathbb{F}_p$ là supersingular. Endomorphism ring của nó đồng cấu với maximal order:
>
> $$
> \mathcal{O}_0 = \left\langle 1,\, i,\, \frac{i+j}{2},\, \frac{1+k}{2} \right\rangle
> $$
>
> với $i^2 = -1$, $j^2 = -p$, $k = ij$. Hai endomorphism tường minh: $\pi = $ Frobenius $(x,y)\mapsto(x^p,y^p)$ và $\iota: (x,y)\mapsto(-x,\sqrt{-1}\,y)$. Đây là **"special curve"** $E_0$ cố định trong SQISign, cũng là điểm xuất phát của tất cả các isogeny walk.

---

## Đồ thị $\ell$-Isogeny Supersingular

> [!note] Định nghĩa 1.5 — $\ell$-Isogeny Graph
> Cho số nguyên tố $\ell \neq p$, **đồ thị $\ell$-isogeny supersingular** $\mathcal{G}_\ell(p)$ là đồ thị:
>
> - **Vertices**: tất cả j-invariants supersingular trong $\mathbb{F}_{p^2}$ (có khoảng $p/12$ đỉnh)
> - **Edges**: mỗi $\ell$-isogeny $E_1 \to E_2$ tạo thành một cạnh $(j(E_1), j(E_2))$

Đồ thị này có bốn tính chất nổi bật (từ §2.1, các kết quả cổ điển):

> [!abstract] Proposition 1.6 — Bốn tính chất của $\mathcal{G}_\ell(p)$
>
> **(1) Liên thông (Connected)**: $\mathcal{G}_\ell(p)$ liên thông — mọi cặp đỉnh đều kết nối bằng một đường đi $\ell$-isogeny.  
> *(Chứng minh: theo [Charles–Lauter–Goren 2009] và [Pizer 1990].)*
>
> **(2) Regular bậc $(\ell+1)$**: Mỗi đỉnh có đúng $\ell + 1$ cạnh ra (ngoại trừ $j = 0, 1728$ có thể ít hơn do automorphisms).
>
> **(3) Essentially undirected**: Mỗi $\ell$-isogeny $\varphi: E_1 \to E_2$ có dual $\hat{\varphi}: E_2 \to E_1$ cũng là $\ell$-isogeny, nên đồ thị "về cơ bản" là vô hướng (ngoại trừ $j = 0, 1728$).
>
> **(4) Ramanujan**: $\mathcal{G}_\ell(p)$ là **Ramanujan graph** — tức là second eigenvalue của adjacency matrix thỏa mãn $|\lambda_2| \leq 2\sqrt{\ell}$ (optimal expander). *(Theo [Pizer 1990, Eichler].)*

**Hệ quả của tính chất Ramanujan**: Random walk trong $\mathcal{G}_\ell(p)$ hội tụ về phân phối đều **cực kỳ nhanh** — sau $O(\log p)$ bước, phân phối của đỉnh đến gần như đều trên toàn bộ đồ thị. Đây là lý do tại sao một isogeny walk ngắn đã đủ để tạo ra commitment "random looking" trong SQISign.

> [!tip] 💡 Agent note
> Tính Ramanujan là lý do tại sao SQISign chọn đường đi ngắn làm commitment ($\psi: E_0 \to E_1$ với $D = 2^e$ steps) mà vẫn đảm bảo $E_1$ trông "random". Nếu graph không phải expander tốt, kẻ tấn công có thể đoán được $E_1$ từ $E_A$.

---

## Bài toán Hardness Cốt lõi

> [!abstract] Problem 1.7 — $\ell$-Isogeny Path Problem
> **Input**: Hai j-invariants supersingular $j_1, j_2 \in \mathbb{F}_{p^2}$, số nguyên tố $\ell$.  
> **Output**: Một đường đi $\ell$-isogenies $E_1 \xrightarrow{\varphi_1} \cdots \xrightarrow{\varphi_k} E_k$ với $j(E_1) = j_1$ và $j(E_k) = j_2$.
>
> **Hardness**: Bài toán này được tin là khó với cả máy tính cổ điển và lượng tử khi $j_1$ hoặc $j_2$ được chọn ngẫu nhiên.

> [!abstract] Problem 1.8 — Endomorphism Ring Problem
> **Input**: Đường cong elliptic supersingular $E/\mathbb{F}_{p^2}$.  
> **Output**: Một Z-basis tường minh cho $\text{End}(E)$ (dưới dạng các endomorphisms tính được).
>
> **Hardness**: Heuristically tương đương với ℓ-Isogeny Path Problem ([Eisenträger–Hallgren–Lauter–Morrison–Petit 2018]).

> [!note] Problem 1.9 — Supersingular Smooth Endomorphism Problem (SSEP) — dùng trong SQISign
> **Input**: Đường cong elliptic supersingular $E/\mathbb{F}_{p^2}$.  
> **Output**: Một cyclic endomorphism $\alpha \in \text{End}(E)$, $\alpha \neq [n]$, có **smooth degree**.
>
> **Vai trò**: Đây là **Problem 1** trong paper SQISign — cơ sở cho soundness của identification protocol (Theorem 1, sẽ học trong Lesson 05). Dưới heuristic tương tự [EHL+18], SSEP heuristically tương đương với Endomorphism Ring Problem.

> [!warning] Lưu ý: ℓ-isogeny path problem ≠ general isogeny path problem
> SQISign làm việc với isogenies degree **smooth** (tích các prime nhỏ), không phải degree nguyên tố $\ell$ đơn lẻ. Điều này cần thiết để tính toán hiệu quả (có thể dùng torsion points có sẵn), nhưng cũng mở ra câu hỏi về KLPT algorithm — sẽ học trong Lesson 04.

---

## Biểu diễn và Tính toán Endomorphism Ring

Một thách thức thực tế quan trọng (từ §2.1 ePrint): ngoài $E_0$ đặc biệt, **không có cách hiệu quả nào biết** basis tường minh cho $\text{End}(E_1)$. Tuy nhiên, nếu biết isogeny $\varphi: E_0 \to E_1$ degree $N_\varphi$, ta có thể **biểu diễn** elements của $\text{End}(E_1)$ như elements của $\text{End}(E_0)/N_\varphi$:

$$
\alpha \in \text{End}(E_1) \implies \alpha = \frac{1}{N_\varphi} \sum_{i=1}^{4} a_i \omega_i, \quad a_i \in \mathbb{Z}
$$

với $\{\omega_i\}$ là Z-basis của $\mathcal{O}_0 \cong \text{End}(E_0)$. Và evaluation:

$$
\alpha(P) = \frac{1}{N_\varphi^2} \sum_{i=1}^{4} [a_i] \varphi \circ \rho_i \circ \hat{\varphi}(P)
$$

Biểu diễn này — dùng $E_0$ như "anchor" — là cách SQISign làm việc với endomorphism rings của các đường cong arbitrary.

---

## Summary

- **Isogeny** $\varphi: E_1 \to E_2$ là morphism gửi identity về identity; có degree, kernel, và dual $\hat{\varphi}$.
- **Supersingular** $E$: $\text{End}(E) \cong$ maximal order trong quaternion algebra $B_{p,\infty}$; tất cả có representative trên $\mathbb{F}_{p^2}$.
- **$\ell$-isogeny graph** $\mathcal{G}_\ell(p)$: connected, $(\ell+1)$-regular, essentially undirected, **Ramanujan** — random walk hội tụ nhanh.
- **Hardness**: $\ell$-isogeny path problem khó với quantum; heuristically tương đương với Endomorphism Ring Problem và SSEP.
- **SQISign anchor**: Curve $E_0$ (j-invariant 1728, $p \equiv 3 \pmod 4$) có endomorphism ring biết tường minh, dùng làm điểm xuất phát toàn bộ scheme.

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §1 và §2.1
- [Sil09] Silverman — *The Arithmetic of Elliptic Curves* (🔴 Prerequisite)
- [Vél71] Vélu — *Isogénies entre courbes elliptiques* (🔴 Prerequisite: Vélu's formula)
- [EHL+18] Eisenträger, Hallgren, Lauter, Morrison, Petit — *Supersingular isogeny graphs and endomorphism rings*, EUROCRYPT 2018 (🟡 — dùng trong Lesson 05)
- [CGL09] Charles, Lauter, Goren — *Cryptographic hash functions from expander graphs* (🟡 — dùng trong Lesson 05)
- [Pizer90] Pizer — *Ramanujan graphs and Hecke operators* ⚪
