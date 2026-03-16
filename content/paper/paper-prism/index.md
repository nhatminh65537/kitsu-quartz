---
title: "PRISM"
type: index
tags: [prism, isogeny, post-quantum, index]
source: "PRISM: Simple And Compact Identification and Signatures From Large Prime Degree Isogenies — Basso et al., PKC 2025"
created: 2026-03-16
---

PRISM (PRime degree ISogeny Mechanism) là scheme chữ ký post-quantum đoạt giải Best Paper tại PKC 2025, xây dựng trên bài toán tính isogeny bậc nguyên tố lớn từ đường cong supersingular không biết endomorphism ring — khó với cả máy tính classical lẫn quantum. Course này bao phủ toàn bộ paper từ nền tảng toán học (Deuring correspondence, Kani) đến proof bảo mật EUF-CMA và implementation C tối ưu.

**Tài liệu gốc**: [PRISM — eprint.iacr.org/2025/135](https://eprint.iacr.org/2025/135)  
**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-supersingular-deuring|01. Supersingular Elliptic Curves & Deuring Correspondence]]

Nền tảng toán học của PRISM: định nghĩa đường cong supersingular, Kani's Lemma (Theorem 1 trong paper) cho phép nhúng isogeny bậc nguyên tố vào higher-dimensional isogeny bậc trơn, và Deuring Correspondence (Table 1) — bijection giữa isogeny và ideal trong quaternion algebra tạo ra trapdoor của scheme.

### [[02-ideal-to-isogeny-defs|02. IdealToIsogeny & Security Definitions]]

Thuật toán IdealToIsogeny (từ SQIsign2D-West) chạy polynomial-time khi biết endomorphism ring, dùng Kani embedding — đây là core của signing. Định nghĩa formal Σ-protocol (completeness, special soundness, HVZK) và EUF-CMA security game; framework hash-and-sign của [Abdalla+02] chuyển Σ-protocol thành signature bảo mật standard model.

### [[03-spedio-hardness|03. SPEDIO: The Hardness Assumption]]

Formalization Problem 2 (SPEDIO): tính compact representation của isogeny bậc prime $q$ từ $E_{vk}$ không biết endomorphism ring. Phân tích hardness classical ($\tilde{O}(p^{1/2})$) và quantum ($\tilde{O}(p^{1/4})$), lý do challenge phải là số nguyên tố, và sự khác biệt với SIDH (không bị tấn công bởi Castryck-Decru).

### [[04-prism-id-protocol|04. PRISM-id: The Identification Protocol]]

Two-round challenge-response protocol: verifier gửi prime $q$, prover trả về compact isogeny $\sigma : E_{vk} \to E_{\mathsf{sig}}$ bậc $q(2^a-q)$ dùng $\text{End}(E_{vk})$ qua Kani embedding. Phân tích 3 tính chất: completeness, special soundness (error negligible), HVZK với SPEDIO oracle.

### [[05-prism-sig-scheme|05. PRISM-sig: The Signature Scheme]]

PRISM-sig = PRISM-id + hash-and-sign: $q = H_{\mathsf{prime}}(E_{vk} \| m)$ deterministic. Định nghĩa đầy đủ KeyGen/Sign/Verify, construction của $H_{\mathsf{prime}}$ (hash vào $\mathsf{Primes}_a$ qua retry), correctness proof, kích thước ~97 bytes ở NIST Level I. Đạt EUF-CMA trong standard model (không cần ROM).

### [[06-prism-sig-security|06. Security Proof: EUF-CMA of PRISM-sig]]

Reduction từ EUF-CMA adversary $\mathcal{A}$ sang SPEDIO solver $\mathcal{B}$: $\mathcal{B}$ simulate signing qua SPEDIO oracle; forgery của $\mathcal{A}$ hoặc giải SPEDIO (nếu $q^* \notin Q$) hoặc tìm hash collision (nếu $q^* \in Q$). Chứng minh Proposition 2 với tight reduction trong standard model — không dùng random oracle.

### [[07-implementation-performance|07. Implementation & Performance]]

Parameter selection cho NIST Level I ($\log_2 p = 256$, $a = 128$), C implementation dựa trên SQIsign2D-West codebase. Signing ~1.8× nhanh hơn SQIsign2D-West (không có commitment phase); verification ~1.4× chậm hơn. Kích thước ~97 bytes tổng — nhỏ nhất trong post-quantum signatures không stateful.

### [[a0-sqisign-comparison|A0. Appendix: PRISM vs SQIsign Variants]]

Fine-grained comparison từ Appendix A.1: PRISM bỏ commitment → 2-round; challenge là prime $q$ thay vì isogeny; response đơn giản hơn (chỉ từ $E_{vk}$, không bridge $E_{\mathsf{com}} \to E_{\mathsf{chall}}$). Phân tích fundamental trade-off signing/verification và tại sao design đơn giản giúp xây dựng advanced protocols.

---

## Global Notation

Bảng này được cập nhật sau mỗi lesson. Ký hiệu nhất quán xuyên suốt toàn course.

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $p$ | Số nguyên tố characteristic, $p \equiv 3 \pmod{4}$ | $p$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\mathbb{F}_{p^2}$ | Trường hữu hạn bậc $p^2$ | $\mathbb{F}_{p^2}$ | [[01-supersingular-deuring\|Lesson 01]] |
| $E$ | Đường cong elliptic supersingular trên $\mathbb{F}_{p^2}$ | $E$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\text{End}(E)$ | Vành endomorphism của $E$ | $\text{End}(E)$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\mathcal{O}$ | Maximal order trong $\mathcal{B}_{p,\infty}$ | $\mathcal{O}$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\mathcal{B}_{p,\infty}$ | Quaternion algebra phân kỳ tại $p$ và $\infty$ | $\mathcal{B}_{p,\infty}$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\phi : E \to E'$ | Isogeny từ $E$ sang $E'$ | $\phi$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\hat{\phi}$ | Dual isogeny của $\phi$ | $\hat{\phi}$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\deg(\phi)$ | Bậc của isogeny $\phi$ | $\deg(\phi)$ | [[01-supersingular-deuring\|Lesson 01]] |
| $\mathsf{IdealToIsogeny}(I, E)$ | Thuật toán chuyển ideal → isogeny | $\mathsf{IdealToIsogeny}$ | [[02-ideal-to-isogeny-defs\|Lesson 02]] |
| $\mathsf{nrd}(I)$ | Reduced norm của ideal $I$ | $\text{nrd}(I)$ | [[02-ideal-to-isogeny-defs\|Lesson 02]] |
| $\mathsf{EUF\text{-}CMA}$ | Existential Unforgeability under Chosen Message Attack | EUF-CMA | [[02-ideal-to-isogeny-defs\|Lesson 02]] |
| $\mathsf{negl}(\lambda)$ | Negligible function | $\mathsf{negl}(\lambda)$ | [[02-ideal-to-isogeny-defs\|Lesson 02]] |
| $\mathcal{A}$ | Adversary (PPT algorithm) | $\mathcal{A}$ | [[02-ideal-to-isogeny-defs\|Lesson 02]] |
| $E_{vk}$ | Public key (verification key) curve | $E_{vk}$ | [[03-spedio-hardness\|Lesson 03]] |
| $q$ | Challenge prime (số nguyên tố challenge ngẫu nhiên) | $q$ | [[03-spedio-hardness\|Lesson 03]] |
| $\mathsf{Primes}_a$ | Tập số nguyên tố có đúng $a$ bit | $\mathsf{Primes}_a$ | [[03-spedio-hardness\|Lesson 03]] |
| $\mathsf{SPEDIO}$ | Supersingular Prime DEgree IsOgeny problem | Problem 2 | [[03-spedio-hardness\|Lesson 03]] |
| $E_0, \mathcal{O}_0$ | Starting curve và order với endomorphism ring biết công khai | $E_0, \mathcal{O}_0$ | [[04-prism-id-protocol\|Lesson 04]] |
| $\phi_{\mathsf{sk}} : E_0 \to E_{vk}$ | Secret key — random isogeny từ $E_0$ | $\phi_{\mathsf{sk}}$ | [[04-prism-id-protocol\|Lesson 04]] |
| $\sigma : E_{vk} \to E_{\mathsf{sig}}$ | Response isogeny bậc $q(2^a-q)$ | $\sigma$ | [[04-prism-id-protocol\|Lesson 04]] |
| $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ | Compact representation của isogeny response/signature | — | [[04-prism-id-protocol\|Lesson 04]] |
| $a$ | Bit-length của challenge prime | $a$ | [[04-prism-id-protocol\|Lesson 04]] |
| $H_{\mathsf{prime}}$ | Hash function $\{0,1\}^* \to \mathsf{Primes}_a$ | $H_{\mathsf{prime}}$ | [[05-prism-sig-scheme\|Lesson 05]] |

*(Thêm ký hiệu mới vào đây sau mỗi lesson.)*

---

## References

### 🟡 Integrated

- [Kani97] Kani — *The number of curves of genus two with elliptic differentials* — integrated in Lesson 01: Theorem 1 (Kani's Lemma)
- [6]/[Basso+24] Basso et al. — *SQIsign2D-West*, ASIACRYPT 2024 — integrated in Lessons 01–02: Table 1 (Deuring summary), IdealToIsogeny algorithm
- [Abdalla+02] Abdalla, An, Bellare, Namprempre — *From identification to signatures via the Fiat-Shamir transform*, EUROCRYPT 2002 — integrated in Lesson 02: hash-and-sign framework
- [BJS14] Biasse, Jao, Sankar — *A quantum algorithm for computing isogenies*, INDOCRYPT 2014 — integrated in Lesson 03: quantum hardness analysis

### 🔴 Prerequisites

- [Sil09] Silverman — *The Arithmetic of Elliptic Curves*, Springer 2009 — ECC nền tảng
- [Voi21] Voight — *Quaternion Algebras*, Springer 2021 — quaternion algebra
- [DKL+20] De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020 — full SQIsign framework
- [KLPT14] Kohel, Lauter, Petit, Tignol — *On the quaternion-isogeny path problem*, LMS 2014 — KLPT background
- [BS20] Boneh, Shoup — *A Graduate Course in Applied Cryptography* — security definitions

### ⚪ Citations only

- [Castryck-Decru23] Castryck, Decru — *An efficient key recovery attack on SIDH*, EUROCRYPT 2023
- [Fiat-Shamir86] Fiat, Shamir — *How to prove yourself*, CRYPTO 1986
- [Deuring41] Deuring — *Die Typen der Multiplikatorenringe elliptischer Funktionenkörper*, 1941
