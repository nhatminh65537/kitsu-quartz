---
title: "03. SPEDIO: The Hardness Assumption"
type: foundation
tags: [prism, isogeny, spedio, hardness-assumption, post-quantum, lesson-03]
aliases: [SPEDIO, Supersingular Prime Degree Isogeny, hardness assumption PRISM]
source: "PRISM: Simple And Compact Identification and Signatures From Large Prime Degree Isogenies — Basso et al., PKC 2025"
created: 2026-03-16
---

> **Prerequisites**: Supersingular elliptic curves, Deuring Correspondence (xem [[01-supersingular-deuring|01. Supersingular & Deuring]]), Σ-protocol và EUF-CMA (xem [[02-ideal-to-isogeny-defs|02. IdealToIsogeny & Defs]])  
> 🔴 **Prerequisite references**: Biasse, Jao, Sankar — *A quantum algorithm for computing isogenies between supersingular elliptic curves* [BJS14] (quantum hardness); Kohel, Lauter, Petit, Tignol — *On the quaternion-isogeny path problem* [KLPT14] (KLPT context)  
> **Lesson type**: Foundation  
> **Covers**: §3.1 (Problem 2 — SPEDIO hardness assumption, parameter space, security analysis)
>
> **Notation** (ký hiệu mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $E_{vk}$ | Đường cong elliptic public key của PRISM | $E_{vk}$ |
> | $q$ | Challenge prime — số nguyên tố lớn ngẫu nhiên | $q$ |
> | $\mathsf{Primes}_a$ | Tập các số nguyên tố có đúng $a$ bit | $\mathsf{Primes}_a$ |
> | $\mathsf{SPEDIO}$ | Supersingular Prime DEgree IsOgeny problem | Problem 2 trong paper |
> | $\sigma_q : E_{vk} \to E_q$ | Isogeny challenge bậc $q$ | $\sigma_q$ |
> | $\mathsf{Trans}_\phi$ | Compact representation của isogeny $\phi$ | — |

---

## Motivation

Một cryptographic scheme chỉ vững chắc khi nó dựa trên một **bài toán tính toán khó** được định nghĩa rõ ràng. Lesson này formalize bài toán hardness trung tâm của PRISM:

> *Cho một đường cong supersingular $E_{vk}$ (không biết endomorphism ring) và một số nguyên tố lớn ngẫu nhiên $q$, tính một isogeny $\sigma_q : E_{vk} \to E_q$ bậc $q$.*

Bài toán này được gọi là **SPEDIO** (Supersingular Prime DEgree IsOgeny). Ta sẽ phân tích tại sao nó khó, tại sao challenge phải là số nguyên tố, và tại sao không có cách đơn giản nào phá được nó.

---

## Không Gian Tham Số

### Prime Parameter $p$

PRISM làm việc với số nguyên tố $p$ thỏa:

$$
p \equiv 3 \pmod{4}
$$

Điều kiện này đảm bảo $\mathbb{F}_{p^2} = \mathbb{F}_p(i)$ với $i^2 = -1$, giúp arithmetic trên đường cong thuận tiện. Quan trọng hơn, với $p \equiv 3 \pmod{4}$, ta có $2$-torsion rational — tức là $E(\mathbb{F}_{p^2})$ có $\mathbb{F}_{p^2}$-rational $2^a$-torsion đủ lớn để dùng trong higher-dimensional computation.

> [!note] Tính chất 3.1 — $2^a$-torsion trên PRISM curves
> Với $p$ và $a$ được chọn phù hợp, mọi đường cong supersingular $E$ trên $\mathbb{F}_{p^2}$ đều có **$\mathbb{F}_{p^2}$-rational $2^a$-torsion** — tức là $E[2^a] \subseteq E(\mathbb{F}_{p^2})$.  
> Điều này là điều kiện cần để:
> - Biểu diễn compact của isogeny bậc $q$ thông qua Kani embedding với cofactor $2^a$
> - Verification hiệu quả qua higher-dimensional isogeny bậc $2^a$

### Challenge Space $\mathsf{Primes}_a$

> [!note] Định nghĩa 3.2 — Challenge Space
> Cho $a$ là một tham số (security parameter, liên quan đến $\log_2 p$). Định nghĩa:
>
> $$
> \mathsf{Primes}_a = \{ q \in \mathbb{Z} : q \text{ là số nguyên tố}, 2^{a-1} \leq q < 2^a \}
> $$
>
> Đây là tập các số nguyên tố có **đúng $a$ bit**. Challenge trong PRISM-id là một phần tử ngẫu nhiên $q \leftarrow \mathsf{Primes}_a$.

**Tại sao phải là số nguyên tố?** Có hai lý do kỹ thuật quan trọng:

1. **Cấu trúc kernel đơn giản**: Isogeny bậc $q$ nguyên tố có kernel là cyclic group $\mathbb{Z}/q\mathbb{Z}$ — xác định bởi một điểm duy nhất $P \in E[q]$. Điều này giúp biểu diễn và verify compact.

2. **Tránh mối quan hệ giữa các challenge**: Nếu challenge $q_1$ và $q_2$ không nguyên tố, verifier có thể học thông tin về $\text{End}(E_{vk})$ qua quan hệ giữa nhiều isogeny. Vì $\mathsf{Primes}_a$ được định nghĩa là primes có đúng $a$ bit, cofactor $2^a - q$ không thể là số nguyên tố $a$-bit khác — do đó không có relationship giữa các challenge ngẫu nhiên.

> [!tip] 💡 Agent note
> Về kích thước của $\mathsf{Primes}_a$: theo Prime Number Theorem, số lượng số nguyên tố trong $[2^{a-1}, 2^a)$ xấp xỉ $2^{a-1} / a$. Với $a \approx 256$ bit (security level I), có khoảng $2^{247}$ prime candidates — đủ lớn để challenge space an toàn.

---

## Bài Toán SPEDIO (Problem 2)

> [!note] Problem 2 — SPEDIO (Supersingular Prime DEgree IsOgeny)
> **Cho**:
> - Số nguyên tố $p$ (tham số hệ thống)
> - Đường cong supersingular $E_{vk}$ trên $\mathbb{F}_{p^2}$ với **endomorphism ring không biết**
> - Số nguyên tố lớn $q \leftarrow \mathsf{Primes}_a$ (ngẫu nhiên)
>
> **Tìm**:
> - Một **compact representation** $\mathsf{Trans}_\sigma$ của isogeny $\sigma : E_{vk} \to E_q$ bậc $q$
>
> trong thời gian polynomial theo $\log p$.

Hai điểm then chốt cần nhấn mạnh:

- **"Endomorphism ring không biết"**: Đây là điều kiện làm bài toán khó. Nếu biết $\text{End}(E_{vk})$, có thể dùng IdealToIsogeny để tính $\sigma$ hiệu quả.
- **"Compact representation"**: Không phải mô tả $\sigma$ bằng kernel trực tiếp (sẽ quá lớn), mà qua higher-dimensional isogeny encoding từ Kani embedding.

---

## Tại sao SPEDIO khó?

### Phân tích Classical Hardness

**Thuật toán tốt nhất hiện tại** (classical) để giải SPEDIO là tìm đường đi trong đồ thị isogeny — meet-in-the-middle trong supersingular $\ell$-isogeny graph:

> [!abstract] Hardness 3.3 — Classical Complexity của SPEDIO
> Thuật toán tốt nhất hiện tại để giải SPEDIO (không biết $\text{End}(E_{vk})$) là **meet-in-the-middle** trong đồ thị $\ell$-isogeny:
>
> $$
> \text{Time} = \tilde{O}(p^{1/2})
> $$
>
> Với $p \approx 2^{2\lambda}$ (lựa chọn của PRISM để đạt $\lambda$-bit security), độ phức tạp là $\tilde{O}(2^\lambda)$.

Trực giác: không biết $\text{End}(E_{vk})$ thì không thể "đi thẳng" đến $E_q$; phải tìm kiếm ngẫu nhiên trên một đồ thị có $\approx p/12$ đỉnh.

### Phân tích Quantum Hardness

Máy tính lượng tử có thể tăng tốc một số bài toán isogeny. Biasse, Jao, Sankar [BJS14] chỉ ra:

> [!abstract] Hardness 3.4 — Quantum Complexity (từ [BJS14])
> Thuật toán lượng tử tốt nhất để tìm isogeny giữa hai đường cong supersingular đã biết endomorphism ring chạy trong $\tilde{O}(p^{1/4})$. Tuy nhiên, khi **không biết** endomorphism ring (như trong SPEDIO), thuật toán này không áp dụng được.  
> Độ phức tạp quantum tốt nhất cho SPEDIO vẫn là $\tilde{O}(p^{1/2})$ theo hướng tấn công csp (claw-finding).
>
> *(theo [BJS14]: Biasse, Jao, Sankar — A quantum algorithm for computing isogenies, INDOCRYPT 2014)*

> [!warning] Lưu ý về Quantum Security
> Với $p \approx 2^{2\lambda}$, security quantum là $\tilde{O}(2^{\lambda/2})$... khoan đã.  
> Để đạt quantum security $\lambda$ bit, PRISM cần $p \approx 2^{4\lambda}$. NIST Level I ($\lambda = 128$ bit quantum security) → $p$ khoảng 256 bit → phù hợp với implementation thực tế.
>
> **Tóm lại**: PRISM chọn $p$ và $a$ sao cho cả classical lẫn quantum attack đều mất ít nhất $2^\lambda$ operations.

### So Sánh với Bài Toán Liên Quan

| Bài toán | Biết $\text{End}$? | Độ khó classical | Độ khó quantum |
|----------|-------------------|-----------------|----------------|
| **SPEDIO** (PRISM) | Không | $\tilde{O}(p^{1/2})$ | $\tilde{O}(p^{1/4})$ |
| Supersingular path-finding (biết End) | Có | Polynomial | Polynomial |
| CSIDH isogeny | Không | $L[1/2]$ | $L[1/3]$? (tranh luận) |
| SIDH (đã phá vỡ 2023) | Không | Cũ: $O(p^{1/4})$ | Cũ: $O(p^{1/6})$ |

> [!tip] 💡 Agent note
> SIDH bị phá năm 2023 (Castryck-Decru, Maino et al.) bởi vì SIDH tiết lộ thêm thông tin về isogeny (torsion point images), không phải vì bài toán isogeny cơ bản bị phá. PRISM không mắc lỗi này: prover chỉ tiết lộ **compact representation** của isogeny, không tiết lộ torsion point images.

---

## Security Argument Của PRISM Dựa Trên SPEDIO

### Relation với PRISM-id

Trong PRISM identification protocol (Lesson 04), security của scheme giảm về SPEDIO như sau:

> [!abstract] Proposition 3.5 — Reduction (preview)
> Nếu tồn tại PPT adversary $\mathcal{A}$ có thể impersonate (mạo danh) prover trong PRISM-id với xác suất non-negligible, thì tồn tại PPT algorithm $\mathcal{B}$ có thể giải SPEDIO với xác suất tương đương.

Proof sẽ được phân tích chi tiết trong Lesson 04 (PRISM-id protocol) và Lesson 06 (EUF-CMA proof), nhưng ý tưởng chính:

- Mạo danh = tạo valid response $\sigma_q : E_{vk} \to E_q$ cho challenge $q$ ngẫu nhiên, không biết $\text{End}(E_{vk})$
- Đây chính xác là SPEDIO

### Tại sao Challenge phải là Ngẫu Nhiên?

Nếu adversary có thể **chọn challenge** $q$ trước khi commitment (hoặc nếu challenge có thể đoán được), security giảm sụp đổ:

- Adversary có thể precompute isogeny bậc $q$ từ $E_{vk}$ trước khi biết $E_{com}$
- Điều này không phá SPEDIO (vì adversary biết $q$ trước), nhưng phá soundness của protocol

Do đó, PRISM-id yêu cầu challenge $q$ được chọn **sau** commitment — đây là cấu trúc Σ-protocol tiêu chuẩn. Trong PRISM-sig (hash-and-sign), $q = H_{\text{prime}}(E_{vk} \| m)$ được xác định bởi hash function collision-resistant, đảm bảo adversary không thể chọn $q$ có lợi.

---

## Summary

- **SPEDIO** (Problem 2): cho $E_{vk}$ không biết endomorphism ring và prime $q \leftarrow \mathsf{Primes}_a$, tính compact representation của isogeny $\sigma : E_{vk} \to E_q$ bậc $q$.
- **Classical hardness**: $\tilde{O}(p^{1/2})$ — tốt nhất là meet-in-the-middle trong isogeny graph.
- **Quantum hardness**: $\tilde{O}(p^{1/4})$ — chọn $p \approx 2^{4\lambda}$ để đạt $\lambda$-bit quantum security.
- **Challenge phải là nguyên tố**: kernel cyclic group → biểu diễn compact; các challenge ngẫu nhiên độc lập nhau về mặt information.
- **Khác SIDH**: PRISM không tiết lộ torsion point images → không bị tấn công bởi Castryck-Decru và variants.

---

## References

- [BJS14] Biasse, Jao, Sankar — *A quantum algorithm for computing isogenies between supersingular elliptic curves*, INDOCRYPT 2014 (🟡 quantum hardness analysis)
- [Castryck-Decru23] Castryck, Decru — *An efficient key recovery attack on SIDH*, EUROCRYPT 2023 (⚪ context: SIDH break)
- [KLPT14] Kohel, Lauter, Petit, Tignol — *On the quaternion-isogeny path problem*, LMS J. Comput. Math. 2014 (🔴 Prerequisite)
- [DKL+20] De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020 (🔴 Prerequisite)
