---
title: "04. Classic KLPT Algorithm"
type: deep-dive
tags: [sqisign, klpt, quaternion, norm-equation, deep-dive, lesson-04]
aliases: [KLPT Algorithm, Classic KLPT, RepresentIntegerO0, StrongApproximation]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

> **Prerequisites**: [[02-quaternion-algebras\|02. Quaternion Algebras, Orders & Ideals]], [[03-deuring-correspondence\|03. The Deuring Correspondence]]  
> 🔴 **Prerequisite references**: Cornacchia's algorithm (giải phương trình norm $f(x,y) = M$ trong $\mathbb{Z}[\omega]$); LLL/CVP lattice reduction  
> **Lesson type**: Deep Dive  
> **Covers**: §2.4 (Algorithmic building blocks — đầy đủ), bao gồm Lemma 1, Algorithms 1–3 (RepresentIntegerO0, StrongApproximation_ℓ•, KLPT_ℓ•), Remarks 3–7
>
> **Notation** (nhất quán với Lesson 02–03):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathcal{O}_0$ | Special extremal order, $i^2=-1$, $j^2=-p$, $k=ij$ |
> | $R = \mathbb{Z}[\omega]$ | Quadratic order trong $\mathcal{O}_0$, $\omega = i$ (khi $p \equiv 3 \pmod 4$) |
> | $f(x,y) = \text{n}(x + \omega y)$ | Norm form của $R$ |
> | $\ell$ | Số nguyên tố nhỏ (thường $\ell = 2$ trong SQISign) |
> | $\ell^\bullet$ | Ký hiệu "một lũy thừa của $\ell$" (norm output dạng $\ell^e$) |
> | $\chi_I(\alpha) = I\alpha/\text{n}(I)$ | Map surjection từ $I$ sang ideals $\sim I$ (từ Lemma 1, Lesson 02) |
> | $\text{CRT}_{M,N}(x,y)$ | Chinese Remainder Theorem: trả về $z \in \mathbb{Z}/MN\mathbb{Z}$ |
> | $N = \text{n}(L)$ | Norm của ideal $L$ (prime) |
> | $(C_0 : D_0) \in \mathbb{P}^1(\mathbb{Z}/N\mathbb{Z})$ | Projective point dùng để encode constraint |

---

## Motivation: Tại sao cần KLPT?

Nhớ lại từ Lemma 1 (Lesson 02): tìm ideal $J \sim I$ với norm $N$ tương đương với tìm phần tử $\alpha \in I$ sao cho $\text{n}(\alpha) = \text{n}(I) \cdot N$. Bài toán tìm phần tử norm nhỏ trong một Z-lattice 4 chiều này là **norm equation problem**.

Thuật toán KLPT (Kohel–Lauter–Petit–Tignol, 2014) giải bài toán đặc biệt sau:

> **Input**: Integral left $\mathcal{O}_0$-ideal $I$ (với $\mathcal{O}_0$ là special extremal order).  
> **Output**: Ideal $J \sim I$ với $\text{n}(J) = \ell^e$ cho một $e \in \mathbb{N}$ nào đó.

Ý nghĩa trong SQISign: từ bất kỳ ideal nào (tương ứng isogeny bí mật), KLPT tìm được ideal equivalent có **norm là lũy thừa của $\ell$** — tức là tương ứng với một chuỗi $\ell$-isogenies có thể compute hiệu quả.

> [!info] 🟡 Nguồn gốc KLPT (theo [KLPT14])
> Thuật toán KLPT xuất phát từ Kohel–Lauter–Petit–Tignol (ANTS 2014). Paper SQISign §2.4 **reformulate** lại thuật toán với notation mới và thêm Remark 4 (deterministic version). Lemma 1 (map $\chi_I$, đã học Lesson 02) là reformulation của [KLPT14, Lemma 5].

---

## Sub-routine 1: RepresentIntegerO0

Mục tiêu: tìm phần tử $\gamma \in \mathcal{O}_0$ với **prescribed norm** $M$.

> [!note] Scheme 4.1 — $\mathsf{RepresentInteger}_{\mathcal{O}_0}(M)$
> **Type**: Norm equation solver trong $\mathcal{O}_0$  
> **Setting**: Special extremal order $\mathcal{O}_0$ với $i^2 = -1$, $j^2 = -p$, $\omega = i$; norm form $f(x,y) = x^2 + y^2$
>
> **$\mathsf{RepresentInteger}_{\mathcal{O}_0}(M)$**
> - Input: $M \in \mathbb{Z}$, $M > p$
> - Output: $\gamma = x + y\omega + j(z + \omega t)$ với $\text{n}(\gamma) = M$
>
> - Bước 1: Đặt $m = \lfloor\sqrt{M / p(1+q)}\rfloor$, lấy ngẫu nhiên $z, t \in [-m, m]$. Tính $M_0 = M - p \cdot f(z, t)$.
> - Bước 2: Gọi $\mathsf{Cornacchia}(M_0)$. Nếu trả về $\bot$ (không có nghiệm), quay lại Bước 1. Ngược lại nhận $(x, y)$.
> - Bước 3: Trả về $\gamma = x + \omega y + j(z + \omega t)$

**Tại sao đúng?** Norm của $\gamma = x + \omega y + j(z + \omega t)$ trong $\mathcal{O}_0$:

$$
\text{n}(\gamma) = \text{n}(x + \omega y) + p \cdot \text{n}(z + \omega t) = f(x,y) + p \cdot f(z,t)
$$

(vì $j^2 = -p$ và $\text{n}(j\cdot\beta) = p\cdot\text{n}(\beta)$). Ta cần $f(x,y) + p\cdot f(z,t) = M$, tức là $f(x,y) = M - p\cdot f(z,t) = M_0$. Cornacchia's algorithm giải chính xác phương trình $f(x,y) = M_0$ trong $\mathbb{Z}[\omega]$.

> [!tip] 💡 Agent note — Cornacchia's algorithm
> Cornacchia (1908) giải phương trình $ax^2 + by^2 = N$ trên $\mathbb{Z}$ trong polynomial time khi $N$ nguyên tố (hoặc một số điều kiện). Ở đây $f(x,y) = x^2 + y^2$ (với $p \equiv 3\pmod 4$, $\omega = i$), nên Cornacchia giải $x^2 + y^2 = M_0$. Thuật toán có thể fail ($\bot$) khi $M_0$ không biểu diễn được dạng $f$ — do đó vòng lặp random lấy lại $z, t$. Heuristically hội tụ sau $O(\log p)$ lần thử.

---

## Sub-routine 2: IdealModConstraint và StrongApproximation

Hai sub-routines này làm việc cùng nhau để tìm phần tử $\mu \in \mathcal{O}_0$ thỏa một **modular constraint** từ ideal $I$ và một **norm constraint** dạng $\ell^e$.

**IdealModConstraint$(I, \gamma)$**: Cho ideal $I$ norm $N$ (prime) và $\gamma \in \mathcal{O}_0$ norm $Nn$, tìm $(C_0 : D_0) \in \mathbb{P}^1(\mathbb{Z}/N\mathbb{Z})$ sao cho $\mu_0 = j(C_0 + \omega D_0)$ thỏa $\gamma\mu_0 \in I$. Thuật toán này là **deterministic** ([KLPT14]) và chạy polynomial time.

> [!note] Scheme 4.2 — $\mathsf{StrongApproximation}_{\ell^\bullet}(N, C, D)$
> **Type**: Norm equation với modular constraint  
> **Setting**: $\mathcal{O}_0$ special extremal, prime $N$ với $\ell$ là non-residue bậc hai mod $N$
>
> **$\mathsf{StrongApproximation}_{\ell^\bullet}(N, C, D)$**
> - Input: Nguyên tố $N$ ($\ell$ là non-QR mod $N$), hai giá trị $C, D \in \mathbb{Z}$
> - Output: $\mu = \lambda\mu_0 + \mu_1$ với $\mu_0 = j(C + \omega D)$, $\mu_1 \in \mathcal{O}_0$, $\text{n}(\mu) = \ell^{e_1}$ cho một $e_1 \in \mathbb{N}$
>
> - Bước 1: Chọn $e_1 \geq pN^4$. Điều chỉnh parity để $\ell^e / (p(C^2 + qD^2))$ là QR mod $N$. Gọi $\lambda$ là căn bậc hai của nó.
> - Bước 2: Lấy ngẫu nhiên $z, t$ sao cho $\ell^e - p\cdot f(\lambda C + Nz,\, \lambda D + Nt) \equiv 0 \pmod{N^2}$. (Giải phương trình tuyến tính mod $N$ — có $N$ nghiệm.)
> - Bước 3: Tính $M = (\ell^e - p\cdot f(\lambda C + Nz, \lambda D + Nt)) / N^2$. Gọi $\mathsf{Cornacchia}(M)$. Nếu $\bot$, quay Bước 2.
> - Bước 4: Trả về $\mu = \lambda j(C + \omega D) + N(x + \omega y + j(z + \omega t))$

**Tại sao đúng?** Norm của $\mu$:

$$
\text{n}(\mu) = p\cdot f(\lambda C + Nz,\, \lambda D + Nt) + N^2 \cdot f(x, y)
$$

$$
= p\cdot f(\lambda C + Nz,\, \lambda D + Nt) + N^2 \cdot M = \ell^e
$$

(theo cách chọn $M$ ở Bước 3). Constraint mod $N$ đảm bảo $\mu_0 = j(C + \omega D)$ được "nhúng" vào $\mu$ — điều này sẽ dùng để đảm bảo $\gamma\mu \in I$ sau khi kết hợp với kết quả IdealModConstraint.

> [!info] 🟡 Deterministic version (theo [PetitSmith18], Remark 4)
> Petit và Smith (MathCrypt 2018) cải tiến Bước 2: thay vì lấy ngẫu nhiên, **tìm vector ngắn trong lattice $L$** tương ứng:
>
> $$
> L = \{(z, t) : p\cdot f(\lambda C + Nz,\, \lambda D + Nt) \text{ nhỏ}\}
> $$
>
> Từ determinant của $L$, chứng minh được tồn tại nghiệm kích thước $\approx pN^3$ (thay vì $pN^4$). Điều này cho phép chọn $e_1$ nhỏ hơn, output norm $\ell^{e_1}$ nhỏ hơn, và thuật toán deterministic hoàn toàn.
>
> *(theo [PetitSmith18]: Petit, Smith — MathCrypt 2018, slides; xem thêm [KLPT14] và extended version của SQISign ePrint)*

---

## KLPT_ℓ•: Thuật toán Chính

Ghép ba sub-routines lại:

> [!note] Scheme 4.3 — $\mathsf{KLPT}_{\ell^\bullet}(I)$
> **Type**: Ideal equivalence với norm constraint  
> **Setting**: $\mathcal{O}_0$ special extremal order; $\ell$ là nguyên tố nhỏ
>
> **$\mathsf{KLPT}_{\ell^\bullet}(I)$**
> - Input: Integral left $\mathcal{O}_0$-ideal $I$
> - Output: $J \sim I$ với $\text{n}(J) = \ell^e$
>
> - Bước 1: Tính $L = \mathsf{EquivalentPrimeIdeal}(I)$, viết $L = \chi_I(\delta)$ với $\delta \in I$ và $N = \text{n}(L)$.
> - Bước 2: Tính $\gamma = \mathsf{RepresentInteger}_{\mathcal{O}_0}(N\ell^{e_0})$ với $e_0 \in \mathbb{N}$ đủ lớn.
> - Bước 3: Tính $(C_0 : D_0) = \mathsf{IdealModConstraint}(L, \gamma)$.
> - Bước 4: Tính $\nu = \mathsf{StrongApproximation}_{\ell^\bullet}(N, C_0, D_0)$. Đặt $\beta = \gamma\nu$ và $e$ sao cho $\text{n}(\beta) = N\ell^e$.
> - Bước 5: Trả về $J = \chi_L(\beta)$

**Correctness** (theo Lemma 1):

$$
\text{n}(J) = \text{n}(\chi_L(\beta)) = \frac{\text{n}(\beta)}{\text{n}(L)} = \frac{N\ell^e}{N} = \ell^e \quad \checkmark
$$

$$
J \sim L \sim I \quad \checkmark
$$

(vì $L \sim I$ theo định nghĩa của $\chi_I$, và $J = \chi_L(\beta) \sim L$).

> [!abstract] Theorem 4.4 — Correctness và Complexity của KLPT_ℓ• (từ [KLPT14])
> Thuật toán $\mathsf{KLPT}_{\ell^\bullet}$ hội tụ với **overwhelming probability** và chạy trong thời gian **polynomial** trong $\log p$.  
> Output norm $\text{n}(J) = \ell^e$ với $e = O(\log p)$, heuristically $e \approx \log_\ell(p^3) = 3\log_\ell p$.
>
> **Proof sketch**: Cornacchia hội tụ khi $M_0$ biểu diễn được bởi $f$ — xác suất này $\Omega(1/\log p)$ với mỗi lần thử theo lý thuyết số. StrongApproximation hội tụ tương tự. Tổng số lần thử expected là $O(\log p)$. $\blacksquare$ *(xem [KLPT14, §3] để đọc đầy đủ)*

---

## Các biến thể và Remarks Quan trọng

**Biến thể KLPT$_T$**: Thay vì norm $\ell^e$, tìm $J \sim I$ với $\text{n}(J) | T$ cho một smooth integer $T$ cho trước. Chỉ cần thay StrongApproximation$_{\ell^\bullet}$ bằng StrongApproximation$_T$. Biến thể này dùng trong Lesson 10 (implementation).

**Remark 4.5** (Remark 5 trong paper) — KLPT có thể làm **deterministic** hoàn toàn:
- `EquivalentPrimeIdeal`: tìm ideal norm nhỏ nhất (lattice reduction dimension ≤ 4)
- `StrongApproximation`: dùng CVP (Petit–Smith trick) → deterministic
- `IdealModConstraint`: đã deterministic ([KLPT14])
- `RepresentIntegerO0`: fix ordering tuple $(x,y,z,t)$, tìm solution nhỏ nhất

**Remark 4.6** (Remark 6 trong paper) — Outputs của `EquivalentPrimeIdeal` và `KLPT` **chỉ phụ thuộc vào equivalence class** của input $I$, không phụ thuộc vào representative cụ thể (theo [GPS19, minor tweak]). Do đó, có thể xem KLPT như hàm trên $\text{Cl}(\mathcal{O}_0)$.

**Remark 4.7** (Remark 7 trong paper) — **Vấn đề của KLPT classic với arbitrary orders**: Algorithm 4.3 chỉ hoạt động với $\mathcal{O}_0$-ideals. Để xử lý ideals của arbitrary maximal order $\mathcal{O}_L$, cách tiếp cận [KLPT14] dùng **two connecting ideals** (từ $\mathcal{O}_0$ đến $\mathcal{O}_L$ và từ $\mathcal{O}_0$ đến $\mathcal{O}_R$) rồi concatenate. Nhưng đây chính là **rò rỉ bảo mật** trong SQISign — algorithm đó tiết lộ path từ $E_A$ đến $E_0$, tương đương tiết lộ secret key $\tau$ (theo [EHL+18]). Đây là lý do cần **Generalized KLPT** (Lesson 07).

> [!warning] Security failure của KLPT classic
> Nếu SQISign dùng KLPT classic cho arbitrary orders (cách tiếp cận của GPS scheme [GPS19]), thuật toán sẽ tiết lộ path từ $E_A$ đến special curve $E_0$. Theo [EHL+18], biết path này tương đương biết secret key $\tau: E_0 \to E_A$. Đây là motivation cho toàn bộ Section 5–6 của paper: thiết kế KLPT tổng quát **không** tiết lộ path về $E_0$.

---

## Summary

KLPT classic giải bài toán: cho left $\mathcal{O}_0$-ideal $I$, tìm equivalent $J$ với norm $\ell^e$. Ba sub-routines chính:

| Sub-routine | Input | Output |
|-------------|-------|--------|
| $\mathsf{RepresentInteger}_{\mathcal{O}_0}(M)$ | $M \in \mathbb{Z}$, $M > p$ | $\gamma \in \mathcal{O}_0$, $\text{n}(\gamma) = M$ |
| $\mathsf{IdealModConstraint}(I, \gamma)$ | Ideal $I$ norm $N$, $\gamma$ norm $Nn$ | $(C_0:D_0) \in \mathbb{P}^1(\mathbb{Z}/N\mathbb{Z})$ |
| $\mathsf{StrongApproximation}_{\ell^\bullet}(N, C, D)$ | Prime $N$, values $C, D$ | $\mu \in \mathcal{O}_0$, $\text{n}(\mu) = \ell^{e_1}$ |

Ghép lại thành $\mathsf{KLPT}_{\ell^\bullet}$: output $J \sim I$, $\text{n}(J) = \ell^e$, $e \approx 3\log_\ell p$, polynomial time.

Giới hạn: chỉ áp dụng cho $\mathcal{O}_0$-ideals. Mở rộng về arbitrary orders cần **Generalized KLPT** (dùng Eichler orders — Lesson 06–07).

---

## References

- Paper gốc: De Feo, Kohel, Leroux, Petit, Wesolowski — *SQISign*, ASIACRYPT 2020, §2.4
- [KLPT14] Kohel, Lauter, Petit, Tignol — *On the quaternion ℓ-isogeny path problem*, LMS J. Comput. Math. 17A (2014) (🟡 — Lemma 5 reformulated, sub-routines)
- [PetitSmith18] Petit, Smith — *MathCrypt 2018* (slides) (🟡 — Remark 4: deterministic StrongApproximation)
- [GPS19] Galbraith, Petit, Silva — *Identification protocols and signature schemes*, J. Cryptol. 2020 (🟡 — Remark 6: outputs depend on class)
- [EHL+18] Eisenträger, Hallgren, Lauter, Morrison, Petit — *EUROCRYPT 2018* (🟡 — security failure of classic approach)
