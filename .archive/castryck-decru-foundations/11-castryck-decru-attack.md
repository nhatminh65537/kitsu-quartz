---
title: "11. Castryck-Decru Attack — Mechanism"
type: attack
tags: [crypto, isogeny, castryck-decru, sidh, attack, lesson-11]
aliases: [Castryck-Decru Attack Mechanism]
created: 2026-04-09
---

> **Prerequisites**: [[10-kani-theorem|10. Kani's Theorem]]
> **Lesson type**: Attack
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p = 2^{e_A} \cdot 3^{e_B} - 1$ | SIDH prime |
> | $E_0/\mathbb{F}_{p^2}$ | Starting supersingular curve |
> | $\phi_A: E_0 \to E_A$ | Alice's secret isogeny, degree $2^{e_A}$ |
> | $\psi_B: E_0 \to E_B$ | Bob's secret isogeny, degree $3^{e_B}$ |
> | $P_A, Q_A, P_B, Q_B$ | Torsion bases |
> | $\phi_A(P_B), \phi_A(Q_B)$ | Torsion point images (Alice's public) |
> | $\gamma$ | Endomorphism $E_0 \to E_0$, degree $c = 3^{e_B}$ |
> | $b_1 b_2 \ldots b_{e_B}$ | Ternary representation của Bob's secret scalar |

---

## Context và Điều Kiện Tấn Công

> [!note] Điều Kiện Tấn Công
> **Input**: SIDH public key của Alice: $(E_A, \phi_A(P_B), \phi_A(Q_B))$ cùng với global parameters $(p, E_0, P_A, Q_A, P_B, Q_B)$.
>
> **Output**: Bob's secret isogeny $\psi_B: E_0 \to E_B$ (hoặc tương đương: secret scalar $sk_B$).
>
> **Giả thiết**: Biết endomorphism ring $\text{End}(E_0)$ (đúng với SIKE vì $E_0$ được chọn public với non-scalar endomorphism $\iota$ known).
>
> **Complexity**: Polynomial time trong $\log p$ (heuristically), ngoại trừ factor một số integer cố định nhỏ.

---

## Attack Intuition

> [!tip] Tại Sao Attack Hoạt Động?
> SIDH publish **torsion point images** $\phi_A(P_B)$, $\phi_A(Q_B)$ — thông tin này không tồn tại trong CSIDH, SQISign, hay các scheme khác. Chính thông tin này "leak" đủ để Kani's criterion áp dụng: ta có thể xây dựng kernel của $(2,2)$-isogeny chain từ $E_0 \times E_0$ **sử dụng torsion point images**, và test từng digit của Bob's secret.

---

## Tổng Quan Algorithm

Attack recover Bob's secret $sk_B$ theo ternary representation $sk_B = \sum_{i=0}^{e_B - 1} b_i \cdot 3^i$ ($b_i \in \{0, 1, 2\}$), từng digit $b_i$ một.

```mermaid
flowchart TD
    A[Setup: compute gamma, torsion bases]
    B[i = 0]
    C[Guess digit b_i in 0 1 2]
    D[Build kernel K_i using torsion images + guess]
    E[Compute (2,2)-isogeny: domain_i to A_i]
    F{A_i splits?}
    G[Record b_i, update domain, i++]
    H[Try next value of b_i]
    I{i = e_B?}
    J[Output recovered sk_B]
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F -->|Yes| G
    F -->|No| H
    H --> C
    G --> I
    I -->|No| C
    I -->|Yes| J
```

---

## Bước 0: Setup

**Setup các thành phần cần thiết**:

Bước 0a — Compute $\gamma$:  
Tìm $u, v$ sao cho $u^2 + 4v^2 = 3^{e_B}$ (two-square decomposition).  
Đặt $\gamma = [u] + [2v] \circ \iota: E_0 \to E_0$.

Bước 0b — Torsion basis trên domain:  
Cần basis $\langle P, Q \rangle = E_0[2^{e_A}]$ để xây dựng kernel.  
Evaluate $\gamma(P_B)$, $\gamma(Q_B)$ — torsion images qua $\gamma$.

Bước 0c — Torsion images từ Alice:  
Ta đã có $R_B = \phi_A(P_B)$, $S_B = \phi_A(Q_B)$.

---

## Bước 1: Xây Dựng Kernel Bước Đầu

Kernel của $(2,2)$-isogeny đầu tiên được xây dựng từ:
- Torsion point images của Alice: $R_B, S_B \in E_A[3^{e_B}]$
- Images qua $\gamma$: $\gamma(P_B), \gamma(Q_B) \in E_0[3^{e_B}]$

> [!note] Kernel Construction 11.1
> Kernel $K \subset (E_A \times E_0)[2^{e_A}]$ được định nghĩa là:
>
> $$
> K = \left\langle \left(\phi_A(P) ,\, \gamma(P)\right) : P \in E_0[2^{e_A}] \right\rangle
> $$
>
> Tổng quát hơn: với mỗi điểm $P = [a]P_B + [b]Q_B \in E_0[3^{e_B}]$:
>
> $$
> \left(\phi_A(P),\, \gamma(P)\right) = \left([a]R_B + [b]S_B,\, [a]\gamma(P_B) + [b]\gamma(Q_B)\right)
> $$
>
> Ta có thể tính kernel tường minh từ public information!

Đây là lý do attack work: torsion point images $R_B, S_B$ cho ta đủ thông tin để xây dựng kernel mà Kani's theorem đòi hỏi.

---

## Bước 2: Digit-by-Digit Recovery

Tuy nhiên, chain $(2,2)^{e_B}$ với $e_B \approx 240$ quá dài để tính thẳng. Castryck-Decru dùng **meet-in-the-middle** variant: recover từng digit ternary của $sk_B$.

Cho Bob's secret scalar $sk_B$ (giả sử $\ell_B = 3$):

**Tại mỗi bước $i$ (từ 0 đến $e_B - 1$)**:

- Domain hiện tại: abelian surface $\mathcal{A}_i$ (ban đầu $E_A \times E_0$).
- Torsion images hiện tại: $(R_i, S_i)$ — được update từ bước trước.
- Guess digit $b_i \in \{0, 1, 2\}$.
- Build kernel $K_i$ từ $(R_i, S_i)$ và guess $b_i$.
- Compute $(2,2)$-isogeny $\Psi_i: \mathcal{A}_i \to \mathcal{A}_{i+1}$.
- **Split test**: Nếu $\mathcal{A}_{i+1}$ split → $b_i$ đúng → record và advance.
- Nếu không split → $b_i$ sai → thử lại với $b_i + 1 \pmod 3$.

**Update torsion images** khi đúng:

$$
(R_{i+1}, S_{i+1}) = (\Psi_i(R_i), \Psi_i(S_i))
$$

---

## Bước 3: Final Recovery

Sau khi recover tất cả $e_B$ digits của $sk_B$:

$$
sk_B = b_0 + 3 b_1 + 9 b_2 + \cdots + 3^{e_B - 1} b_{e_B - 1}
$$

Từ $sk_B$: tính $\psi_B(P_A)$, $\psi_B(Q_A)$ (image của torsion basis dưới Bob's secret). Kết hợp với Alice's public key $E_A$ để verify (hoặc derive shared secret $E_{AB}$).

---

## Phân Tích Độ Phức Tạp

> [!abstract] Theorem 11.2 — Complexity
> Attack Castryck-Decru có **classical complexity polynomial** trong $\log p$:
>
> - Số bước: $e_B = O(\log p)$
> - Mỗi bước: 1 $(2,2)$-isogeny step + 1 split test = $O(\log p)$ field operations
> - Tổng: $O(\log^2 p)$ field operations
> - Ngoại lệ: factor một số integer $c = 3^{e_B}$ như sum of two squares — nhưng $c$ fixed (không phụ thuộc instance), nên chỉ cần tính một lần.

> [!warning] Điểm Yếu Đặc Thù của SIKE
> Attack đặc biệt hiệu quả với SIKE vì:
>
> 1. $E_0$ có non-scalar endomorphism $\iota$ degree 2 (known from parameters)
> 2. $\ell_A = 2$: $(2,2)$-isogenies từ $E_A \times E_0$ tự nhiên, formulas đơn giản
> 3. Torsion point images publish trong public key
>
> Các scheme không publish torsion point images (CSIDH, SQISign) **không bị attack này**.

---

## Tại sao $\ell_A = 2$ Đặc Biệt Dễ?

Với $\ell_A = 2$:
- $(2,2)$-isogenies có formulas cực kỳ efficient (Richelot construction)
- Split test đơn giản (theta constants nhỏ)
- Chain length $e_A = O(\log p)$ ngắn trong từng step

Nếu $\ell_A$ lớn hơn (như B-SIDH), attack vẫn work nhưng cần $(\ell_A, \ell_A)$-isogenies tổng quát hơn (tốn hơn nhưng vẫn polynomial).

---

## So Sánh Với Attack Của Robert (2022)

Vài ngày sau Castryck-Decru, Damien Robert post attack tổng quát hơn:

| | Castryck-Decru | Robert |
|--|--|--|
| Phương pháp | $(2,2)$-isogenies + Kani | Higher-dimensional isogenies |
| Điều kiện | $\ell_A = 2$, $E_0$ có small endo | Bất kỳ SIDH |
| Complexity | $\text{poly}(\log p)$ | $\text{poly}(\log p)$ |
| Implementation | SageMath, < 1 giờ | Phức tạp hơn |

Robert's attack phá SIDH hoàn toàn; Castryck-Decru phá SIKE đặc biệt nhanh.

---

## Mitigation và Aftermath

> [!danger] SIKE Broken
> Sau attack, SIKE bị rút khỏi NIST PQC process (tháng 9/2022). Không có fix đơn giản: nếu không publish torsion point images, SIDH không còn là key exchange scheme đúng nghĩa nữa.

Các scheme an toàn hơn:
- **CSIDH**: Không publish torsion images — commutative group action, không bị attack này.
- **SQISign**: Dùng SIDH-like structure nhưng không leak torsion.
- **M(D)-SIDH**: Mask torsion images — giảm tốc độ attack đáng kể nhưng không loại trừ hoàn toàn.

---

## Summary

- **Input**: SIDH public key $(E_A, \phi_A(P_B), \phi_A(Q_B))$.
- **Core**: Kani's theorem + torsion point images → build kernel → $(2,2)$-isogeny → split test.
- **Recovery**: digit-by-digit (ternary), $e_B$ steps.
- **Complexity**: $O(\log^2 p)$ — polynomial time.
- **Fast**: SIKEp217 trong 85 giây; SIKEp434 trong ~1 giờ (original); < 1 phút (optimized).
- **Root cause**: SIDH leaks torsion point images — không thể fix mà vẫn giữ correctness.

---

## References

- Castryck & Decru — ePrint 2022/975 (original attack)
- Robert, D. — *Breaking SIDH in polynomial time*, ePrint 2022/1038
- Wesolowski, B. — *Understanding and improving the Castryck-Decru attack*, 2022
- Galbraith, S. — *Breaking supersingular isogeny Diffie-Hellman (SIDH)* (blog, 2022)
- Oudompheng & Pope — ePrint 2022/1283 (SageMath implementation notes)
