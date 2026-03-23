---
title: "07. Generalized KLPT Algorithm"
type: deep-dive
tags: [sqisign, generalized-klpt, eichler-orders, norm-equation, deep-dive, lesson-07]
aliases: [Generalized KLPT, GeneralizedKLPT, IdealToIsogeny Generalized]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: [[04-klpt-classic\|04. Classic KLPT Algorithm]], [[06-eichler-orders\|06. Eichler Orders & Extended Deuring Correspondence]]  
> 🔴 **Prerequisite references**: Cornacchia's algorithm (Lesson 04); CVP / LLL lattice reduction  
> **Lesson type**: Deep Dive  
> **Covers**: §5 đầy đủ — Algorithm 4 (GeneralizedKLPT_ℓ•), Lemma 4 (correctness), và discussion về strategy tổng quát hóa
>
> **Notation** (nhất quán với Lesson 04, 06):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathcal{O}$ | Arbitrary maximal order ($\cong \text{End}(E_A)$) |
> | $\mathcal{O}_0$ | Special extremal order cố định |
> | $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ | Eichler order level $N_\tau$ |
> | $I_\tau$ | Ideal kết nối $\mathcal{O}_0$ và $\mathcal{O}$, $\text{n}(I_\tau) = N_\tau$ |
> | $K' = [I_\tau]_* I$ | Pullback của $I$ (left $\mathcal{O}$-ideal) về left $\mathcal{O}_0$-ideal |
> | $\mathsf{EichlerModConstraint}$ | Sub-routine (Lesson 08, §6.2) giải constraint trong $\mathfrak{O}$ |
> | $\chi_I(\beta) = I\beta/\text{n}(I)$ | Map surjection (từ Lemma 1, Lesson 02) |

---

## Motivation: Tại sao KLPT Classic Không Đủ?

Từ Remark 7 trong §2.4 (Lesson 04): KLPT classic chỉ áp dụng được cho left $\mathcal{O}_0$-ideals. Với input là left $\mathcal{O}$-ideal $I$ (tương ứng isogeny từ $E_A$ — public key curve), KLPT classic dùng trick nối qua $\mathcal{O}_0$, nhưng kết quả **tiết lộ path từ $E_A$ đến $E_0$**, tức là tiết lộ secret key $\tau$.

Generalized KLPT (§5) giải quyết bài toán:

> **Input**: Integral left $\mathcal{O}$-ideal $I$ (với $\mathcal{O}$ arbitrary maximal order).  
> **Output**: $J \sim I$ với $\text{n}(J) = \ell^e$, **mà không** tiết lộ path về $E_0$.

**Ý tưởng cốt lõi** (từ §5, dùng §4): Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ là suborder của $\mathcal{O}_0$, do đó cho phép dùng kỹ thuật KLPT. Thay vì tìm $\beta \in [I_\tau]_* I$ (như KLPT classic), ta tìm $\beta \in [I_\tau]_* I \cap \mathcal{O}$ — constraint thêm này encode membership trong $\mathfrak{O}$ nhờ $\mathfrak{O} = \mathbb{Z} + I_\tau$ (Proposition 1, Lesson 06).

---

## Context: Bài toán và Input

Trong signature context, input ideal $I$ là left $\mathcal{O}_A$-ideal, nơi $\mathcal{O}_A \cong \text{End}(E_A)$. Ta đặt $\mathcal{O} = \mathcal{O}_A$ và $N_\tau = \text{n}(I_\tau)$ là norm của secret ideal (degree của secret isogeny $\tau$).

Up to replacing $\mathcal{O}$ với representative isomorphic, ta **có thể assume** $N_\tau$ là prime và **inert** trong $R = \mathbb{Z}[\omega]$ (điều kiện kỹ thuật cần cho $\mathsf{EichlerModConstraint}$, giải thích trong §6.2). Lý do có thể giả định này: ta có quyền chọn representative của maximal order $\mathcal{O}$ sao cho điều kiện này thỏa.

---

## Generalized KLPT: Thuật toán

> [!note] Scheme 7.1 — $\mathsf{GeneralizedKLPT}_{\ell^\bullet}(I)$
> **Type**: Ideal equivalence với norm constraint, arbitrary maximal order  
> **Setting**: $\mathcal{O}_0$ special extremal; $\mathcal{O}$ arbitrary maximal order; $I_\tau$ kết nối $\mathcal{O}_0$ và $\mathcal{O}$, $N_\tau = \text{n}(I_\tau)$ prime inert trong $R$; $\ell$ nguyên tố nhỏ
>
> **$\mathsf{GeneralizedKLPT}_{\ell^\bullet}(I)$**
> - Input: Integral left $\mathcal{O}$-ideal $I$
> - Output: $J \sim I$ với $\text{n}(J) = \ell^e$
>
> - Bước 1: Tính $K' = [I_\tau]_* I$ — đây là left $\mathcal{O}_0$-ideal (pullback).
> - Bước 2: Tính $L = \mathsf{EquivalentPrimeIdeal}(K')$, viết $L = \chi_{K'}(\delta)$ với $N = \text{n}(L)$.
> - Bước 3: Tính $\gamma = \mathsf{RepresentInteger}_{\mathcal{O}_0}(N \ell^{e_0})$ với $e_0$ đủ lớn.
> - Bước 4: Tính $(C_0 : D_0) = \mathsf{IdealModConstraint}(L, \gamma)$ — constraint từ $L$.
> - Bước 5: Tính $(C_1 : D_1) = \mathsf{EichlerModConstraint}(I, I_\tau, \gamma)$ — constraint từ $\mathfrak{O}$.
> - Bước 6: Tính $(C : D) = \mathsf{CRT}_{N, N_\tau}((C_0:D_0),\, (C_1:D_1))$ kết hợp hai constraints.
> - Bước 7: Tính $\nu = \mathsf{StrongApproximation}_{\ell^\bullet}(N N_\tau, C, D)$. Đặt $\beta = \gamma\nu$, $e$ sao cho $\text{n}(\beta) = N N_\tau \ell^e$.
> - Bước 8: Trả về $J = \chi_L(\beta)$

**Phân tích từng bước:**

Bước 1 — Pullback: $K' = [I_\tau]_* I = \bar{I}_\tau \cdot I / N_\tau$ là left $\mathcal{O}_0$-ideal, cho phép áp dụng kỹ thuật KLPT.

Bước 2–4 — Như KLPT classic: tìm prime-norm equivalent, represent integer, solve IdealModConstraint.

Bước 5 — **Điểm mới**: `EichlerModConstraint` (Algorithm 6, Lesson 08) tìm $(C_1 : D_1)$ sao cho solution cuối cùng $\beta \in \mathcal{O}$ (thay vì chỉ $\beta \in K'$).

Bước 6 — CRT kết hợp hai projective constraints $(C_0:D_0)$ (mod $N$) và $(C_1:D_1)$ (mod $N_\tau$) thành một constraint mod $N N_\tau$.

Bước 7 — StrongApproximation với modulus $NN_\tau$ (thay vì chỉ $N$). Output norm $\ell^e$ với $e \approx 3\log_\ell p$.

---

## Correctness

> [!abstract] Lemma 7.2 — Correctness của GeneralizedKLPT (Lemma 4 trong paper)
> Algorithm 7.1 terminates with overwhelming probability và trả về $J \sim I$ với $\text{n}(J) = \ell^e$.

**Proof.** Theo Corollary 1 (Lesson 06): với $\beta \in [I_\tau]_* I \cap \mathcal{O}$:

$$
[I_\tau]_*\!\left(\chi_I(\beta)\right) = \chi_{[I_\tau]_* I}(\beta)
$$

Tức là:

$$
J' = \chi_{K'}(\beta)
$$

là pushforward của $J = \chi_I(\beta)$. Norm: $\text{n}(J') = \text{n}(\beta)/\text{n}(K')$. Và:

$$
J \sim I \iff J' \sim K' \iff J' = \chi_{K'}(\beta)
$$

Ta cần $\text{n}(J) = \ell^e$. Vì $[I_\tau]_*$ bảo toàn norm up to $N_\tau$:

$$
\text{n}(J') = \text{n}(\beta) / \text{n}(K') = N_\tau \ell^e / (N_\tau \cdot \text{n}(K')/\text{n}(K')) = \ell^e \quad \checkmark
$$

Constraint $\beta \in \mathcal{O}$: theo $\mathfrak{O} = \mathbb{Z} + I_\tau$ (Proposition 1), $\beta \in K' \cap \mathcal{O}$ iff $\beta \equiv n \pmod{I_\tau}$ cho $n \in \mathbb{Z}$. EichlerModConstraint (Bước 5) solve chính xác constraint này. CRT (Bước 6) kết hợp constraint từ $L$ và từ $\mathfrak{O}$, đảm bảo $\gamma\nu \in L \cap \mathcal{O}$. $\blacksquare$

---

## So sánh với KLPT Classic

| Khía cạnh | KLPT Classic (Alg 3) | Generalized KLPT (Alg 4) |
|-----------|---------------------|--------------------------|
| Input | Left $\mathcal{O}_0$-ideal | Left $\mathcal{O}$-ideal (arbitrary) |
| Sub-routine thêm | — | EichlerModConstraint (Bước 5) |
| CRT modulus | $N$ | $N \cdot N_\tau$ |
| Output norm | $\ell^e$, $e \approx 3\log_\ell p$ | $\ell^e$, $e \approx 3\log_\ell p + \log_\ell N_\tau$ |
| Tiết lộ path về $E_0$? | Có (vì dùng connecting ideals) | **Không** (dùng Eichler constraint) |
| Complexity | Polynomial | Polynomial (chi phí thêm $O(\log N_\tau)$) |

Output norm của Generalized KLPT lớn hơn một chút (thêm $\log_\ell N_\tau$) vì CRT modulus tăng từ $N$ lên $NN_\tau$. Đây là trade-off chấp nhận được so với việc đảm bảo không lộ secret.

---

## Biến thể KLPT$_T$ và Tối ưu hóa

Trong implementation (§8), SQISign cần ideals norm dividing $T$ (smooth integer tương ứng với torsion available) chứ không phải norm $\ell^e$ đơn thuần. Biến thể $\mathsf{GeneralizedKLPT}_T$ thay StrongApproximation$_{\ell^\bullet}$ bằng StrongApproximation$_T$, các bước còn lại giữ nguyên.

> [!tip] 💡 Agent note — Hai tricks giảm torsion requirement (từ §8)
> Output norm của Generalized KLPT xấp xỉ $p^3$, đòi hỏi torsion $T \sim p^3$. Trong §8 (Lesson 10), paper giới thiệu hai tricks để giảm requirement này:
>
> **Trick 1**: Thay vì tính $\psi$ từ $E_1$ dùng $E_1[D_1 D_2]$ torsion, split $\psi = \psi_1 \circ \psi_2$ với $D_1, D_2$ không nhất thiết coprime.
>
> **Trick 2**: Translate bài toán về dạng có thể dùng $T \sim p^{3/2}$ thay $p^3$, bằng cách khai thác cấu trúc đặc biệt của $E_0$.
>
> Các tricks này là lý do SQISign có thể implement trên hardware thực tế với tham số NIST-1.

---

## Summary

- **Generalized KLPT** = KLPT classic + hai bổ sung: EichlerModConstraint (tìm constraint trong $\mathfrak{O}$) + CRT (kết hợp constraints).
- **Không tiết lộ path về $E_0$**: nhờ làm việc trong $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ thay vì "nối qua $\mathcal{O}_0$" kiểu classic.
- **Correctness** (Lemma 4): từ Corollary 1 (Lesson 06) — pushforward commutes với $\chi$ khi $\beta \in \mathcal{O}$.
- **Output norm** $\ell^e \approx \ell^{3\log_\ell p + \log_\ell N_\tau}$ — polynomial, slightly lớn hơn KLPT classic.
- **Generalized KLPT là nền tảng** cho SigningKLPT (Lesson 08) — version thêm rerandomization để đảm bảo ZK.

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §5
- [[04-klpt-classic\|04. Classic KLPT]] — KLPT_ℓ•, sub-routines RepresentInteger / IdealModConstraint / StrongApproximation
- [[06-eichler-orders\|06. Eichler Orders]] — Proposition 1, Corollary 1 (tools cho correctness proof)
- [KLPT14] Kohel, Lauter, Petit, Tignol (🟡 — KLPT base)
- [GPS19] Galbraith, Petit, Silva (🟡 — §3.3: vì sao classic không đủ)
