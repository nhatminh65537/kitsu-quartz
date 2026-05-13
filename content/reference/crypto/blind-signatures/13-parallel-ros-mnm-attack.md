---
title: "13. Attack III — Parallel ROS & M&M Attack"
type: attack
tags: [crypto, blind-signature, pROS, mix-and-match, parallel-repetition, post-quantum, attack, lesson-13]
aliases: [Parallel ROS, pROS Attack, Mix-and-Match Attack, M&M Attack]
created: 2026-05-13
---

> **Prerequisites**: [[12-ros-attack|12. Attack II — The ROS Attack]]
> **Lesson type**: Attack
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Bậc nguyên tố (hoặc bậc của algebraic structure) |
> | $\ell$ | Số concurrent signing sessions |
> | $\omega$ | Số parallel repetitions của identification protocol |
> | $C$ | Challenge space của identification protocol (có thể nhỏ) |
> | $\xi$ | $\lceil \log |C| \rceil$ — số bits cần để represent một challenge |
> | $H_\mathsf{ros}$ | Random oracle dùng trong pROS game |
> | $\hat{\rho}_i \in C^\omega$ | Coefficient vector cho session $i$ trong pROS |
> | $\vec{c}_i \in C^\omega$ | Challenge vector cho session $i$ |

---

## Context & Conditions

Lesson 12 cho thấy ROS attack phá vỡ concurrent OMUF của **Schnorr-type blind signatures** khi challenge space là $\mathbb{Z}_p$ (lớn). Câu hỏi tự nhiên: nếu ta dùng identification protocol với **challenge space nhỏ** $|C| = O(1)$ hoặc $|C| = \{-1, 1\}$ (như isogeny-based CSI-Otter), rồi dùng **parallel repetition** $\omega$ lần để giảm soundness error, liệu có an toàn hơn không?

Bài này cho thấy câu trả lời là **không**: attack **Parallel ROS (pROS)** và kỹ thuật **Mix-and-Match (M&M)** của Katsumata, Lai, Reichle (2023) phá vỡ các scheme này, dù challenge space nhỏ đến đâu hay parallel repetition nhiều đến mức nào.

**Điều kiện áp dụng**:
- Blind signature dựa trên identification protocol thực hiện $\omega$ parallel repetitions.
- Adversary có thể mở $\ell = \omega \xi$ concurrent sessions, với $\xi = \lceil \log |C| \rceil$.
- Không cần structure cụ thể của group — attack là generic.

---

## Parallel ROS Problem — Định nghĩa

> [!note] Definition 13.1 — Ring-pROS Problem
> **Tham số**: Vành $R$; challenge space $R_c \subseteq R$; số sessions $\ell$; số repetitions $\omega$.
>
> **Game $\mathsf{Ring\text{-}pROS}_{\ell,\omega,R,R_c}$**: Adversary $\mathcal{A}$ có oracle access đến $H_\mathsf{ros}$.
> $\mathcal{A}$ phải xuất ra $(\ell+1)$ cặp $(\mathbf{A}_i, \mathsf{aux}_i)$ với $\mathbf{A}_i \in R^{\omega \times \omega\ell}$ pairwise distinct, và một vector $\vec{d} \in R_c^{\omega\ell}$.
>
> **Win condition**: Với mọi $i \in [\ell+1]$:
>
> $$
> H_\mathsf{ros}(\mathbf{A}_i, \mathsf{aux}_i) = \mathbf{A}_i \cdot \vec{d} \in R_c^\omega
> $$
>
> Khi $R = \mathbb{Z}_p$ và $\omega = 1$: đây là ROS cổ điển.

> [!note] Definition 13.2 — Group-pROS Problem
> Tương tự Ring-pROS nhưng structure algebraic yếu hơn: nhóm $(G, \cdot)$ thay cho vành. Adversary bị hạn chế hơn vì không có phép nhân nội bộ — chỉ có phép nhóm. Group-pROS khó giải hơn Ring-pROS nhưng vẫn bị phá bởi M&M attack khi $|C|$ nhỏ.
>
> **Áp dụng**: CSI-Otter dùng Group-pROS với $G = C = \{-1, +1\}$, $\omega = \lambda$.

---

## Attack Intuition — Tại sao Parallel Repetition không giúp ích

Trong identification protocol thông thường, parallel repetition $\omega$ lần giảm soundness error từ $1/|C|$ xuống $1/|C|^\omega$ — giảm theo luỹ thừa. Điều này giúp với các *static* soundness arguments.

Trong **blind signature**, identification protocol có thêm một chiều tự do: adversary (User) **chọn được** challenge $\vec{c}_i$ mình gửi cho Signer tại mỗi session. Cụ thể, adversary có thể chuẩn bị **hai** auxiliary values $\mathsf{aux}_i^0 \neq \mathsf{aux}_i^1$ cho mỗi session, kéo theo hai challenge vectors:

$$
\vec{c}_i^0 = H_\mathsf{ros}(\mathbf{A}_i, \mathsf{aux}_i^0), \quad \vec{c}_i^1 = H_\mathsf{ros}(\mathbf{A}_i, \mathsf{aux}_i^1)
$$

Adversary sau đó **chọn** $b_i \in \{0, 1\}$ cho mỗi session để "mix" hai options, tạo ra đúng challenge cần thiết cho forgery. Đây là ý tưởng cốt lõi của **Mix-and-Match**.

Mỗi bit $b_i$ đóng góp một bit thông tin vào target challenge vector — với $\ell = \omega\xi$ sessions và $\xi = \lceil \log |C| \rceil$, adversary có đủ bits để biểu diễn bất kỳ target nào.

---

## M&M Attack — Formal Description

### Phần 1: Small Challenge Space ($|C| = \mathsf{poly}(\lambda)$)

> [!note] Attack 13.3 — pROS Attack for Small Challenge Space
> **Điều kiện**: $|C| = \mathsf{poly}(\lambda)$. Chọn $\ell = \omega$ concurrent sessions.
>
> **Bước 1** — Setup: Chọn các matrix $\mathbf{A}_j = I_\omega$ (identity block) tại vị trí $j$ cho $j \in [\ell]$.
>
> **Bước 2** — Trivial sessions: Với mỗi $j \in [\ell]$, adversary chọn $\mathsf{aux}_j$ tuỳ ý. Khi đó $H_\mathsf{ros}(\mathbf{A}_j, \mathsf{aux}_j) = \mathbf{A}_j \cdot \vec{d} = \vec{d}_j$ (một block của $\vec{d}$). Tự define $\vec{d}_j := H_\mathsf{ros}(\mathbf{A}_j, \mathsf{aux}_j)$.
>
> **Bước 3** — Target row: Query $\vec{c}^* = H_\mathsf{ros}(\mathbf{A}_{\ell+1}, \mathsf{aux}_{\ell+1})$.
>
> **Bước 4** — Mix-and-Match: $|C|$ nhỏ → dùng exhaustive search hoặc polynomial interpolation để tìm $\mathbf{A}_{\ell+1}$ sao cho $\mathbf{A}_{\ell+1} \cdot \vec{d} = \vec{c}^*$.
>
> **Output**: $(\mathbf{A}_1, \mathsf{aux}_1), \ldots, (\mathbf{A}_{\ell+1}, \mathsf{aux}_{\ell+1}), \vec{d}$. Win probability $\to 1$.

### Phần 2: Large Challenge Space ($|C| = \Omega(2^\lambda)$) — Full M&M

> [!note] Attack 13.4 — pROS Attack for Large Challenge Space (Ring-pROS)
> **Điều kiện**: Challenge space $R_c^\omega$ với $(R_c - R_c) \setminus \{0\} \subseteq R^\times$. Chọn $\ell = \omega\xi$ concurrent sessions ($\xi = \lceil \log |C| \rceil$).
>
> **Bước 1** — Nhóm $\ell$ sessions thành $\omega$ nhóm, mỗi nhóm $\xi$ sessions.
>
> **Bước 2** — Trong mỗi nhóm $\kappa \in [\omega]$ và mỗi session $\mu \in [\xi]$:
> - Chuẩn bị **hai** auxiliary values $\mathsf{aux}_{\kappa,\mu}^0 \neq \mathsf{aux}_{\kappa,\mu}^1$.
> - Query hai challenge vectors $\vec{c}_{\kappa,\mu}^0 = H_\mathsf{ros}(\cdot, \mathsf{aux}_{\kappa,\mu}^0)$ và $\vec{c}_{\kappa,\mu}^1 = H_\mathsf{ros}(\cdot, \mathsf{aux}_{\kappa,\mu}^1)$.
> - Dùng **polynomial interpolation** để tính hệ số $a_{\kappa,\mu}$ sao cho $a_{\kappa,\mu} \cdot (\vec{c}_{\kappa,\mu}^1 - \vec{c}_{\kappa,\mu}^0) = B_\mu$ (binary generator).
>
> **Bước 3** — Target: Query $\vec{c}^* = H_\mathsf{ros}(\mathbf{A}_{\ell+1}, \mathsf{aux}_{\ell+1})$.
>
> **Bước 4** — Decompose $\vec{c}^*_\kappa$ (coordinate $\kappa$) theo binary: $\vec{c}^*_\kappa = \sum_\mu B_\mu b_{\kappa,\mu}$.
>
> **Bước 5** — Choose $\mathsf{aux}_{\kappa,\mu}^{b_{\kappa,\mu}}$ cho mỗi session. Embed $a_{\kappa,\mu}$ vào $\mathbf{A}_{\ell+1}$ phù hợp.
>
> **Output**: Valid pROS solution với $2\ell+1$ hash queries và $O(\ell)$ ring operations.

![[assets/img-13-mnm-attack-flow.png]]
*M&M attack: mỗi session có hai possible challenges (xanh/tím). Adversary "mix-and-match" chọn bit $b_i$ cho mỗi session để decompose target hash $c^*_{\ell+1}$ theo binary.*

---

## Ứng dụng vào Các Scheme Cụ Thể

### CSI-Otter (Isogeny-based, CRYPTO 2023)

CSI-Otter dựa trên **CSIDH** group action với challenge space $C = \{-1, +1\}$ và $\omega = \lambda$ parallel repetitions (binary challenges). Group-pROS áp dụng với $\ell = \omega = \lambda$ concurrent sessions.

> [!abstract] Theorem 13.5 — CSI-Otter bị phá (Katsumata-Lai-Reichle 2023)
> Với bất kỳ PPT adversary $\mathcal{A}$ giải Group-pROS$_{\ell,\omega,\{-1,+1\},\{-1,+1\}}$, tồn tại PPT adversary $\mathcal{B}$ phá $\ell$-OMUF của CSI-Otter với cùng advantage.
>
> **Concrete**: $\ell = \omega = 128$, complexity $\approx 2^{34}$ hash evaluations.

Challenge space $C = \{-1, +1\}$ có kích thước $2$ nên mỗi session chỉ cần $\xi = 1$ bit — attack cần chính xác $\omega$ sessions để decompose target vector $\vec{c}^* \in \{-1,+1\}^\omega$.

### Blaze+ (Lattice-based, ACISP 2020)

Blaze+ dùng module lattice với challenge space $R_c = $ polynomial ring và $\omega = \kappa$ repetitions (để đảm bảo norm bound). Ring-pROS áp dụng vì $R$ là polynomial ring (có ring structure).

### BlindOR (Lattice-based, CANS 2020)

Tương tự Blaze+ nhưng dùng OR-proof structure. Attack cần xử lý thêm OR-proof layer nhưng về bản chất giống nhau.

| Scheme | Cấu trúc | $\omega$ | $|C|$ | Sessions cần | Complexity |
|--------|----------|----------|-------|--------------|------------|
| CSI-Otter | Group action | $\lambda$ | $2$ | $\lambda$ | $2^{34}$ hash |
| Blaze+ | Module lattice | $\kappa$ | poly | $\kappa\xi$ | poly |
| BlindOR | Module lattice | $\kappa$ | poly | $\kappa\xi$ | poly |

---

## So sánh ROS vs. pROS vs. M&M

| Đặc điểm | ROS (Lesson 12) | pROS (Bài này) |
|----------|----------------|----------------|
| Challenge space | $\mathbb{Z}_p$ (lớn) | Bất kỳ, kể cả $\{-1,+1\}$ |
| Parallel repetitions | $\omega = 1$ | $\omega \geq 1$ |
| Algebraic requirement | Cần ring structure | Ring-pROS hoặc Group-pROS |
| Sessions cần | $\ell \geq \log p$ | $\ell \geq \omega\xi$ với $\xi = \lceil\log|C|\rceil$ |
| Technique chính | Binary decomposition | Mix-and-Match (chọn bits) |
| Schemes bị phá | Schnorr, FROST, MuSig2 | CSI-Otter, Blaze+, BlindOR |

> [!warning] Takeaway cho thiết kế blind signature PQ
> Parallel repetition **không** là giải pháp cho vấn đề concurrent security của blind signatures. Nó giảm soundness error theo chiều identification protocol nhưng tạo ra thêm degrees of freedom cho adversary theo chiều OMUF. Katsumata-Lai-Reichle 2023 đặt câu hỏi: liệu có blind signature PQ concurrently secure nào không? Câu trả lời hiện tại: chưa rõ ràng — đây là open problem quan trọng.

---

## Mitigation

- **Không dùng blind signature PQ based on 3-move ID protocol** cho concurrent deployment — hiện chưa có scheme nào proven concurrently secure với polynomial many sessions.
- **Sequential-only**: Với sequential signing ($\ell$ nhỏ hơn threshold), attack trên không áp dụng. Nhưng sequential limitation nghiêm trọng với production systems.
- **Classical alternatives**: Blind BLS, Blind RSA-PSS đã concurrently secure và có standard implementations.
- **Research direction**: Lattice-based fully concurrent blind signatures là open problem sau Katsumata-Lai-Reichle 2023.

---

## Summary

- **pROS problem**: Tổng quát hóa ROS cho parallel repetitions và arbitrary algebraic structures.
- **M&M attack**: Mỗi session cho adversary một binary degree of freedom (chọn $\mathsf{aux}^0$ hoặc $\mathsf{aux}^1$); $\ell = \omega\xi$ sessions đủ để biểu diễn bất kỳ target challenge nào theo binary.
- **Impact PQ**: CSI-Otter (isogeny), Blaze+, BlindOR (lattice) đều bị phá trong concurrent setting.
- **CSI-Otter concrete**: 4-concurrent OMUF phá trong $\approx 2^{34}$ hash evaluations.
- **Bài học**: Challenge space nhỏ + parallel repetition = **không** an toàn hơn trong blind signature setting.

---

## References

- Katsumata, S., Lai, Y.-F., Reichle, M. — *Breaking Parallel ROS: Implication for Isogeny and Lattice-based Blind Signatures*, EUROCRYPT 2024 / ePrint 2023/1603
- Benhamouda, F. et al. — *On the (In)Security of ROS*, EUROCRYPT 2021 (xem Lesson 12)
- Katsumata, S. et al. — *CSI-Otter: Isogeny-based (Partially) Blind Signatures from the Class Group Action with a Twist*, CRYPTO 2023
- Alkeilani Alkadri, N. et al. — *Blaze: Practical Lattice-Based Blind Signatures for Privacy-Preserving Applications*, CCS 2020 / ACISP 2020
