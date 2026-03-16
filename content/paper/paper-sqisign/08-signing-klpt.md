---
title: "08. Signing KLPT & EichlerModConstraint"
type: deep-dive
tags: [sqisign, signing-klpt, eichler-mod-constraint, rerandomization, deep-dive, lesson-08]
aliases: [SigningKLPT, EichlerModConstraint, Signing Algorithm]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: [[06-eichler-orders\|06. Eichler Orders & Extended Deuring Correspondence]], [[07-generalized-klpt\|07. Generalized KLPT Algorithm]]  
> **Lesson type**: Deep Dive  
> **Covers**: §6.1 (SigningKLPT overview, Algorithm 5), §6.2 (EichlerModConstraint, Algorithm 6), Lemma 5 (EichlerModConstraint correct), Lemma 6 (SigningKLPT correct)
>
> **Notation** (nhất quán với Lesson 04, 07):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $I_\tau$ | Secret ideal (degree of $\tau: E_0 \to E_A$), $N_\tau = \text{n}(I_\tau)$ prime inert trong $R$ |
> | $\mathcal{O} = \mathcal{O}_A$ | Maximal order $\cong \text{End}(E_A)$ |
> | $\mathfrak{O} = \mathbb{Z} + I_\tau = \mathcal{O}_0 \cap \mathcal{O}$ | Eichler order level $N_\tau$ |
> | $I$ | Input left $\mathcal{O}$-ideal (từ response computation) |
> | $K' = [I_\tau]_* I$ | Pullback của $I$ về left $\mathcal{O}_0$-ideal |
> | $\mu_0 = j(C + \omega D)$ | Element trong $j\text{-part}$ của $\mathcal{O}_0$ (như trong KLPT classic) |
> | $(C_1 : D_1) \in \mathbb{P}^1(\mathbb{Z}/N_\tau\mathbb{Z})$ | Output của EichlerModConstraint |
> | $\mathsf{StrongApprox}_{NN_\tau}$ | StrongApproximation với modulus kép $N \cdot N_\tau$ |

---

## Context: SigningKLPT là gì?

Nhớ lại từ Lesson 05: trong quá trình Sign, Prover cần tính $\sigma: E_A \to E_2$ từ composite isogeny $\varphi \circ \psi \circ \hat{\tau}: E_A \to E_2$. Trong ngôn ngữ ideal, điều này tương đương:

- Biết ideal $I$ tương ứng với $\varphi \circ \psi \circ \hat{\tau}$ (left $\mathcal{O}_A$-ideal)
- Cần tìm $J \sim I$ với $\text{n}(J) = D = 2^e$ và distribution của $J$ **computationally indistinguishable** từ uniform trên lớp $\mathcal{O}$-equivalence của $I$.

Generalized KLPT (Lesson 07) giải bài toán tìm $J \sim I$, nhưng output **không random** — kết quả deterministic từ input. Để đạt ZK, cần thêm **rerandomization**: $\mathsf{SigningKLPT}$ là Generalized KLPT với một bước rerandomize đầu vào để output trông random (under Problem 2 assumption, Lesson 09).

---

## §6.1 — SigningKLPT: Tổng quan

> [!note] Scheme 8.1 — $\mathsf{SigningKLPT}(I, I_\tau)$
> **Type**: Ideal equivalence với norm constraint + rerandomization  
> **Setting**: $\mathcal{O}_0$ special extremal; $I_\tau$ secret ideal, $N_\tau$ prime inert trong $R$; $\ell = 2$; $D = 2^e$
>
> **$\mathsf{SigningKLPT}(I, I_\tau)$**
> - Input: Integral left $\mathcal{O}$-ideal $I$; secret ideal $I_\tau$
> - Output: $J \sim I$ với $\text{n}(J) = D = \ell^e$; distribution of $J$ ≈ uniform (under Problem 2)
>
> - Bước 1: **Rerandomize** — Tính $I' = \mathsf{Rerandomize}(I, I_\tau)$: thay $I$ bằng một equivalent ideal $I' \sim I$ sao cho input không tương quan với secret $I_\tau$.
> - Bước 2: Tính $K' = [I_\tau]_* I'$ — pullback về $\mathcal{O}_0$-ideal.
> - Bước 3: Tính $L = \mathsf{EquivalentPrimeIdeal}(K')$, $N = \text{n}(L)$.
> - Bước 4: Tính $\gamma = \mathsf{RepresentInteger}_{\mathcal{O}_0}(N \ell^{e_0})$.
> - Bước 5: Tính $(C_0 : D_0) = \mathsf{IdealModConstraint}(L, \gamma)$.
> - Bước 6: Tính $(C_1 : D_1) = \mathsf{EichlerModConstraint}(I_\tau, \gamma)$.
> - Bước 7: Tính $(C : D) = \mathsf{CRT}_{N, N_\tau}((C_0:D_0),\, (C_1:D_1))$.
> - Bước 8: Tính $\nu = \mathsf{StrongApproximation}_{\ell^\bullet}(N N_\tau, C, D)$. Đặt $\beta = \gamma\nu$.
> - Bước 9: Trả về $J = \chi_L(\beta)$ (sau khi pushforward back về $\mathcal{O}$-world)

**Sự khác biệt với Generalized KLPT**: Duy nhất ở Bước 1 (rerandomization). Tất cả các bước còn lại giống hệt Algorithm 4 (Lesson 07).

> [!tip] 💡 Agent note — Rerandomization
> Rerandomization là bước "xáo bài" input trước khi chạy KLPT. Cụ thể: thay $I$ bởi $I' = I \cdot J_\text{rand}$ với $J_\text{rand}$ là ideal ngẫu nhiên nhỏ (norm $\sim \sqrt{p}$). Điều này đảm bảo output $J$ không tương quan tuyến tính với $I_\tau$, từ đó thỏa Problem 2 assumption (Lesson 09). Chi tiết kỹ thuật của rerandomization nằm trong extended ePrint version.

---

## §6.2 — EichlerModConstraint: Thuật toán Cốt lõi

`EichlerModConstraint` giải constraint mới xuất hiện trong Generalized KLPT (Bước 5): tìm $(C_1:D_1)$ sao cho solution $\beta = \gamma\nu$ thỏa $\beta \in \mathcal{O} = \mathcal{O}_A$.

Nhớ từ Proposition 1 (Lesson 06): $\mathfrak{O} = \mathbb{Z} + I_\tau$, nên $\beta \in \mathcal{O}$ iff $\beta \equiv n \pmod{I_\tau}$ với $n \in \mathbb{Z}$. Constraint này là **mod $N_\tau$** constraint (vì $N_\tau = \text{n}(I_\tau)$).

> [!note] Scheme 8.2 — $\mathsf{EichlerModConstraint}(I_\tau, \gamma)$
> **Type**: Modular constraint solver trong Eichler order  
> **Setting**: $I_\tau$ ideal kết nối $\mathcal{O}_0$ và $\mathcal{O}$, $N_\tau$ prime inert trong $R$; $\gamma \in \mathcal{O}_0$ với $\text{n}(\gamma) = N N_\tau \ell^{e_0}$
>
> **$\mathsf{EichlerModConstraint}(I_\tau, \gamma)$**
> - Input: Ideal $I_\tau$ (norm $N_\tau$ prime inert trong $R$), element $\gamma \in \mathcal{O}_0$
> - Output: $(C_1 : D_1) \in \mathbb{P}^1(\mathbb{Z}/N_\tau\mathbb{Z})$ sao cho $\mu_1 = j(C_1 + \omega D_1)$ thỏa $\gamma\mu_1 \in \mathcal{O}$ modulo $N_\tau$
>
> - Bước 1: Tính $\bar{\gamma} \pmod{N_\tau}$ (reduce $\gamma$ modulo $N_\tau$ trong $\mathcal{O}_0$).
> - Bước 2: Tìm $(C_1 : D_1) \in \mathbb{P}^1(\mathbb{Z}/N_\tau\mathbb{Z})$ sao cho $\bar{\gamma} \cdot j(C_1 + \omega D_1) \in I_\tau \pmod{N_\tau}$.
> - Bước 3: Trả về $(C_1 : D_1)$

**Tại sao điều kiện $N_\tau$ prime inert trong $R$ cần thiết?**

Khi $N_\tau$ là prime inert trong $R = \mathbb{Z}[\omega]$, thương $\mathcal{O}_0 / N_\tau\mathcal{O}_0$ có cấu trúc đặc biệt cho phép giải Bước 2 bằng linear algebra mod $N_\tau$. Cụ thể, map $j \cdot (-) : \mathcal{O}_0/N_\tau\mathcal{O}_0 \to \mathcal{O}_0/N_\tau\mathcal{O}_0$ tạo ra một structure tương tự $\mathbb{F}_{N_\tau^2}$ khi $N_\tau$ inert — cho phép invert và solve.

> [!abstract] Lemma 8.3 — Correctness của EichlerModConstraint (Lemma 5 trong paper)
> Algorithm 8.2 chạy trong polynomial time (trong $\log N_\tau$ và $\log p$) và trả về $(C_1:D_1)$ thỏa: solution cuối cùng $\beta = \gamma\nu$ (sau CRT và StrongApproximation) nằm trong $\mathcal{O}$ modulo $N_\tau$.
>
> **Proof sketch.** Constraint $\beta \in \mathcal{O}$ iff $\beta \in \mathbb{Z} + I_\tau$ (Proposition 1). Điều này tương đương $\beta \equiv n \pmod{N_\tau}$ cho $n \in \mathbb{Z}$. Ta cần $j(C_1 + \omega D_1)$ sao cho $\gamma j(C_1 + \omega D_1) \in I_\tau \pmod{N_\tau}$. Vì $N_\tau$ inert trong $R$, map $\gamma \cdot (-)$ trên $j$-component là invertible mod $N_\tau$, nên ta giải tuyến tính để tìm $(C_1:D_1)$. $\blacksquare$

---

## Correctness của SigningKLPT Toàn bộ

> [!abstract] Lemma 8.4 — Correctness của SigningKLPT (Lemma 6 trong paper)
> Algorithm 8.1 terminates with overwhelming probability và trả về $J \sim I$ với $\text{n}(J) = D = \ell^e$ và $J$ là left $\mathcal{O}$-ideal.

**Proof.** Correctness của $J \sim I$ và $\text{n}(J) = \ell^e$: theo Lemma 7.2 (Generalized KLPT correctness, Lesson 07) — rerandomization không ảnh hưởng đến equivalence class.

$J$ là left $\mathcal{O}$-ideal: theo Lemma 8.3, $\beta \in \mathcal{O}$ mod $N_\tau$, và StrongApproximation đảm bảo norm condition. Kết hợp, $\beta \in [I_\tau]_* I \cap \mathcal{O}$, do đó $J = \chi_{[I_\tau]_* I}(\beta)$ có $\mathcal{O}_R(J) = \mathcal{O}$ — tức là $J$ là left $\mathcal{O}$-ideal. $\blacksquare$

> [!abstract] Corollary 8.5 — Thuộc tính $\hat{\varphi} \circ \sigma$ cyclic
> Từ $J \sim I$ và $\text{n}(J) = D$, isogeny $\sigma = \varphi_J : E_A \to E_2$ tương ứng thỏa:
>
> 1. $\sigma$ có degree $D = 2^e$
> 2. $\hat{\varphi} \circ \sigma$ là **cyclic isogeny**
>
> Đây chính là điều kiện Verifier kiểm tra trong giao thức (Lesson 05).

**Tại sao $\hat{\varphi} \circ \sigma$ cyclic?** Từ cách construct $J$: $J$ tương ứng với $\sigma$ và right order của $J$ là $\mathcal{O}_{E_2}$. Tính cyclic của $\hat{\varphi} \circ \sigma$ follow từ việc $J$ là primitive ideal (không chia hết bởi integer $> 1$) — property được bảo toàn qua KLPT process. Chi tiết kỹ thuật trong §6.1 extended version.

---

## Phân phối Output và Kết nối với ZK

SigningKLPT không chỉ cần correct — nó cần output $J$ với **distribution trông random** để đảm bảo ZK. Đây là nội dung §7 (Lesson 09).

Trực giác: sau rerandomization, input $I'$ đã "xáo" đủ để deterministic KLPT trả về $J$ trông như sample ngẫu nhiên từ lớp $\mathcal{O}$-equivalence tương ứng. Problem 2 (Lesson 09) formalize điều này thành một computational assumption về distribution của StrongApproximation outputs.

> [!warning] Remark 8.6 — SigningKLPT là black box cho ZK proof
> Trong §7 (Lesson 09), ZK proof **không phân tích nội bộ** của SigningKLPT. Thay vào đó, §7 formalize một assumption về output distribution của toàn bộ $\mathsf{SigningKLPT}$ như một black box. Đây là approach heuristic — không có unconditional ZK proof.

---

## Summary

- **SigningKLPT** = Generalized KLPT + rerandomization (Bước 1) để đảm bảo output distribution phù hợp ZK.
- **EichlerModConstraint** (Algorithm 6): giải constraint mới $\beta \in \mathcal{O}$ dưới dạng linear algebra mod $N_\tau$ — cần $N_\tau$ prime inert trong $R$.
- **Correctness** (Lemma 6): $J \sim I$, $\text{n}(J) = D$, $J$ left $\mathcal{O}$-ideal, $\hat{\varphi} \circ \sigma$ cyclic.
- **ZK connection**: Rerandomization + Problem 2 assumption đảm bảo output trông random (Lesson 09).
- **Cụm algorithm chain**: $\mathsf{EichlerModConstraint} \to \mathsf{CRT} \to \mathsf{StrongApproximation} \to \chi_L$ tạo thành pipeline của SigningKLPT.

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §6
- [[06-eichler-orders\|06. Eichler Orders]] — Proposition 1 ($\mathfrak{O} = \mathbb{Z} + I_\tau$), Corollary 1
- [[07-generalized-klpt\|07. Generalized KLPT]] — Algorithm 4, correctness framework
- [KLPT14] Kohel, Lauter, Petit, Tignol (🟡 — IdealModConstraint, StrongApproximation base)
