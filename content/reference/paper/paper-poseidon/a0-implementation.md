---
title: "A0. Efficient Implementation & Round Constant Generation"
type: deep-dive
tags: [poseidon, implementation, grain-lfsr, sparse-matrix, optimization, lesson-a0]
aliases: [POSEIDON Implementation, Grain LFSR, Sparse Matrix Optimization]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[03-hades-round-function|03. HADES & Round Function]], [[04-instantiations-parameters|04. Instantiations & Parameters]]  
> 🔴 **Prerequisite references**: Hell, Johansson, Meier — *Grain: A Stream Cipher for Constrained Environments* (Grain LFSR design)  
> **Lesson type**: Deep Dive (Appendix)  
> **Covers**: Appendix A (round constant & MDS matrix generation via Grain LFSR, NUMS rationale), Appendix B (efficient implementation — sparse matrix decomposition for partial rounds, optimization từ $O(t^2)$ → $O(t)$ multiplications per partial round)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathsf{LFSR}$ | Linear Feedback Shift Register | LFSR |
> | $\mathbf{c}^{(r)}$ | Round constant vector tại round $r$ | $C_r$ |
> | $M$ | MDS matrix (đầy đủ) | $M$ |
> | $\hat{M}$ | Sparse matrix decomposition của $M$ trong partial rounds | $\hat{M}$ |
> | $\mathbf{v}, \mathbf{w}$ | Sparse decomposition vectors: $M = \hat{M} + \mathbf{v} \cdot \mathbf{w}^T$ | $v, w$ |
> | $M'$ | Pre-accumulated matrix cho partial rounds | $M'$ |

---

## Tổng Quan

Appendix A và B của paper giải quyết hai vấn đề thực tế riêng biệt:

- **Appendix A**: *Làm thế nào sinh round constants và MDS matrix một cách minh bạch, không có backdoor?* → Grain LFSR với seed phụ thuộc instance parameters (NUMS).
- **Appendix B**: *Làm thế nào implement $\mathsf{POSEIDON}^\pi$ hiệu quả nhất trong ZK circuit?* → Sparse matrix decomposition giảm multiplication count từ $O(t^2)$ xuống $O(t)$ trong partial rounds.

---

## Appendix A — Round Constant Generation (Grain LFSR)

### Lý Do Dùng LFSR

Một mối lo ngại phổ biến với cipher/hash mới: người thiết kế có thể chọn round constants "đặc biệt" để tạo trapdoor (backdoor). Để loại bỏ lo ngại này, POSEIDON dùng phương pháp **NUMS (Nothing-Up-My-Sleeve)**:

> Round constants được sinh *deterministically* từ **Grain LFSR** khởi tạo với seed phụ thuộc hoàn toàn vào các tham số public của instance. Không ai (kể cả người thiết kế) có thể chọn constants trước khi biết seed.

**Grain LFSR** là stream cipher đơn giản, well-studied, phù hợp cho vai trò pseudorandom number generator khi không cần full cryptographic security (chỉ cần NUMS, không cần secrecy).

### Cấu Trúc Grain LFSR

Grain LFSR dùng trong POSEIDON là **80-bit LFSR** với feedback polynomial degree 80:

> [!note] Scheme A.1 — Grain LFSR Construction
> **Type**: Pseudorandom bit generator  
> **Setting**: 80-bit state $s = (s_0, s_1, \ldots, s_{79}) \in \{0,1\}^{80}$; feedback taps cố định
>
> **Feedback polynomial**: $x^{80} + x^{67} + x^{57} + x^{42} + x^{29} + x^{18} + 1$
>
> **$\mathsf{LFSR\_Clock}(s)$**
> - Input: Current state $s \in \{0,1\}^{80}$
> - Compute feedback bit: $b = s_0 \oplus s_{13} \oplus s_{23} \oplus s_{38} \oplus s_{51} \oplus s_{62}$  
>   (tương ứng taps từ feedback polynomial)
> - Shift: $s \leftarrow (s_1, s_2, \ldots, s_{79}, b)$
> - Output bit: $s_0$ (trước khi shift)
> - Output: $(s_0^{\text{old}}, s^{\text{new}})$

### Quy Trình Sinh Constants

> [!note] Scheme A.2 — POSEIDON Constant Generation
> **Type**: Deterministic constant generation  
> **Setting**: Instance parameters $(p, M, R_F, R_P, \alpha, t)$; output cần $t(R_F + R_P)$ round constants và $t^2$ matrix entries
>
> **$\mathsf{GenConstants}(p, M, R_F, R_P, \alpha, t)$**
> - Input: Instance parameters
> - Step 1 (Seed construction): Encode tất cả parameters thành bit string cố định:
>
> $$
> \text{seed} = \underbrace{\text{bin}(p)}_{\ell_p \text{ bits}} \| \underbrace{\text{bin}(M)}_{10 \text{ bits}} \| \underbrace{\text{bin}(R_F)}_{10 \text{ bits}} \| \underbrace{\text{bin}(R_P)}_{10 \text{ bits}} \| \underbrace{\text{bin}(\alpha)}_{4 \text{ bits}} \| \underbrace{\text{bin}(t)}_{12 \text{ bits}}
> $$
>
>   Nếu seed < 80 bits, pad với zeros ở đầu; nếu > 80 bits, dùng chunk đầu tiên.
>
> - Step 2 (Initialize LFSR): Nạp seed vào 80-bit LFSR state
> - Step 3 (Warm-up): Chạy LFSR 160 lần (2× state size) để loại bỏ bias từ initialization — **discard** tất cả output bits trong bước này
> - Step 4 (Generate bits): Với mỗi round constant cần thiết:
>   - Lấy $n$ bits liên tiếp từ LFSR output (với $n = \lceil \log_2 p \rceil$)
>   - Interpret $n$ bits như số nguyên không dấu
>   - Nếu giá trị $\geq p$: **reject** và lấy tiếp $n$ bits khác
>   - Nếu giá trị $< p$: accept làm phần tử $\mathbb{F}_p$
> - Step 5 (Output round constants): $\mathbf{c}^{(0)}, \ldots, \mathbf{c}^{(R_F+R_P-1)}$ với mỗi $\mathbf{c}^{(r)} \in \mathbb{F}_p^t$
> - Step 6 (Output MDS matrix): Tiếp tục sinh thêm bits để tạo Cauchy matrix parameters $x_i, y_j$, sau đó tính $M_{i,j} = 1/(x_i + y_j)$
> - Output: Round constants và MDS matrix $M$

> [!success] NUMS Property
> Vì seed phụ thuộc vào $(p, M, R_F, R_P, \alpha, t)$, hai instances khác nhau ở **bất kỳ tham số nào** sẽ có constants hoàn toàn khác. Không ai có thể "chọn" constants mà không qua LFSR — đây là cơ chế tin cậy tương tự như cách Rijndael (AES) sinh S-box từ $x^{-1}$ + affine transform, hoặc cách SHA-3 dùng các hằng số từ căn bậc hai của số nguyên tố.

> [!tip] 💡 Agent note
> Trong thực tế triển khai, round constants thường được **precompute offline** và hardcode vào code. Việc verify tính NUMS chỉ cần chạy lại generation script với cùng parameters và so sánh output. Reference implementations của paper có sẵn tại `extgit.iaik.tugraz.at/krypto/hadeshash` — bao gồm cả `calc_round_numbers.py` (Python) và SageMath script.

---

## Appendix B — Sparse Matrix Optimization

### Vấn Đề: MixLayer Đắt Trong Partial Rounds

Trong **partial rounds**, chỉ có **một** S-box output $(s_0^\alpha)$ là non-linear; các phần tử còn lại $s_1, \ldots, s_{t-1}$ vẫn là tuyến tính. Tuy nhiên, MixLayer vẫn áp dụng ma trận MDS đầy đủ $M \in \mathbb{F}_p^{t \times t}$:

$$
s^{\text{new}} = M \cdot (s_0^\alpha, s_1, \ldots, s_{t-1})^T
$$

Phép nhân này cần $t^2$ multiplications (nếu $M$ là dense matrix) — trong khi $t-1$ trong số $t$ inputs vào $M$ là tuyến tính, chỉ một là non-linear.

**Câu hỏi**: có thể tái cấu trúc tính toán để exploit cấu trúc partial này không?

### Giải Pháp: Sparse Matrix Decomposition

Paper đề xuất phân tích $M$ thành dạng:

$$
M = \hat{M} + \mathbf{v} \cdot \mathbf{w}^T
$$

trong đó $\hat{M}$ là **sparse matrix** (ma trận thưa) và $\mathbf{v}, \mathbf{w} \in \mathbb{F}_p^t$.

> [!note] Scheme A.3 — Sparse Decomposition của MDS Matrix
> **Type**: Matrix decomposition  
> **Setting**: MDS matrix $M \in \mathbb{F}_p^{t \times t}$; vector $\mathbf{e}_0 = (1, 0, \ldots, 0)^T$
>
> **$\mathsf{SparseDecompose}(M)$**
> - Input: MDS matrix $M$
> - Step 1: Tính $\mathbf{w}^T = \mathbf{e}_0^T \cdot M = (M_{0,0}, M_{0,1}, \ldots, M_{0,t-1})$ (hàng đầu của $M$)
> - Step 2: Tính $\mathbf{v} = M \cdot \mathbf{e}_0 - M_{0,0} \cdot \mathbf{e}_0 = (0, M_{1,0}, M_{2,0}, \ldots, M_{t-1,0})^T$ (cột đầu, zero entry đầu)
> - Step 3: $\hat{M} = M - \mathbf{v} \cdot \mathbf{w}^T$ — ma trận kết quả có dạng đặc biệt:
>   - Hàng $0$: bằng $\mathbf{w}^T$
>   - Cột $0$: bằng $M_{0,0} \cdot \mathbf{e}_0$ (chỉ entry $(0,0)$ non-zero trong cột 0)
>   - Phần còn lại: diagonal-like hoặc block-sparse
> - Output: $(\hat{M}, \mathbf{v}, \mathbf{w})$

### Tại Sao Decomposition Này Giúp?

Trong một partial round, tính $s^{\text{new}} = M \cdot (s_0^\alpha, s_1, \ldots, s_{t-1})$:

$$
s^{\text{new}} = (\hat{M} + \mathbf{v}\mathbf{w}^T)(s_0^\alpha, s_1, \ldots, s_{t-1})^T = \hat{M} \cdot \mathbf{s} + \mathbf{v} \cdot (\mathbf{w}^T \cdot \mathbf{s})
$$

Phần $\mathbf{w}^T \cdot \mathbf{s} = w_0 \cdot s_0^\alpha + w_1 s_1 + \cdots + w_{t-1} s_{t-1}$ là **một scalar**. Tính nó cần $t-1$ additions (vì $w_i s_i$ là tuyến tính trừ $w_0 s_0^\alpha$).

Phần $\mathbf{v} \cdot (\text{scalar}) = (0, M_{1,0}, \ldots, M_{t-1,0}) \cdot (\mathbf{w}^T \cdot \mathbf{s})$ là **$t$ scalar multiplications** (tuyến tính).

Phần $\hat{M} \cdot \mathbf{s}$: vì $\hat{M}$ sparse (cột 0 chỉ có entry $(0,0)$), chỉ cần $t$ multiplications và $O(t^2)$ additions.

> [!note] Scheme A.4 — Optimized Partial Round
> **Type**: Optimized computation  
> **Setting**: Pre-computed $(\hat{M}, \mathbf{v}, \mathbf{w})$; state $\mathbf{s} \in \mathbb{F}_p^t$; S-box output $u = s_0^\alpha$
>
> **$\mathsf{PartialRound\_Opt}(\mathbf{s}, \mathbf{c}, \hat{M}, \mathbf{v}, \mathbf{w})$**
> - Input: State $\mathbf{s}$, round constant $\mathbf{c}$, pre-computed matrices
> - Step 1 (ARC): $\mathbf{s} \leftarrow \mathbf{s} + \mathbf{c}$
> - Step 2 (S-box): $u \leftarrow s_0^\alpha$ (tốn $C_\alpha$ multiplications)
> - Step 3 (Dot product): $\sigma \leftarrow \mathbf{w}^T \cdot (u, s_1, \ldots, s_{t-1})^T = w_0 u + \sum_{i=1}^{t-1} w_i s_i$ (tuyến tính, free in R1CS)
> - Step 4 (Sparse multiply): $\mathbf{r} \leftarrow \hat{M} \cdot (u, s_1, \ldots, s_{t-1})^T$ (sparse → $t$ constant mults)
> - Step 5 (Rank-1 update): $\mathbf{s}^{\text{new}} \leftarrow \mathbf{r} + \sigma \cdot \mathbf{v}$ ($t$ scalar multiplications, tuyến tính)
> - Output: $\mathbf{s}^{\text{new}} \in \mathbb{F}_p^t$

**Kết quả**: thay vì $t^2$ multiplications cho MixLayer, ta chỉ cần:
- $C_\alpha$ multiplications cho S-box
- $O(1)$ multiplications cho sparse matrix (constants)
- Toàn bộ tuyến tính trong R1CS → **0 constraint overhead** từ MixLayer

### Optimization Cho Nhiều Partial Rounds Liên Tiếp

Khi có $R_P$ partial rounds liên tiếp, ta có thể **pre-accumulate** matrices:

> [!note] Scheme A.5 — Pre-accumulated Matrix
> Cho $R_P$ partial rounds với matrices $M^{(1)}, M^{(2)}, \ldots, M^{(R_P)}$, tính:
>
> $$
> M' = M^{(R_P)} \cdot M^{(R_P-1)} \cdots M^{(1)}
> $$
>
> Sau đó dùng $M'$ như một single MixLayer áp dụng sau tất cả $R_P$ partial rounds. Điều này giảm số lần áp MixLayer từ $R_P$ lần xuống **1 lần**.

**Kết quả tổng thể** (so sánh với naive implementation):

| Method | MixLayer cost per partial round | Total cost cho $R_P = 57$, $t = 3$ |
|--------|--------------------------------|-------------------------------------|
| Naive (dense $M$) | $t^2 = 9$ multiplications | $57 \times 9 = 513$ mults |
| Sparse decomposition | $\approx 2t = 6$ multiplications | $57 \times 6 = 342$ mults |
| Pre-accumulated $M'$ | $t^2/R_P \approx 0.16$ mults/round | $1 \times 9 = 9$ mults total |

Paper báo cáo: với pre-accumulated optimization trên $x^3$-POSEIDON ($n=64$, $t=24$, $R_F=8$, $R_P=42$), tốc độ tính toán cải thiện **~5×** so với naive implementation trong SageMath.

---

## Tổng Hợp: Checklist Implement POSEIDON

Khi implement POSEIDON từ đầu, thứ tự khuyến nghị:

> [!note] Scheme A.6 — POSEIDON Implementation Checklist
> 1. **Chọn tham số**: Xác định $(n, t, R_F, R_P, \alpha)$ từ security level $M$ và proof system (dùng quy trình từ [[04-instantiations-parameters|Lesson 04]])
> 2. **Sinh constants**: Chạy Grain LFSR (Scheme A.2) để sinh round constants và MDS matrix
> 3. **Verify matrix**: Chạy Algorithm 2 ([[03-hades-round-function|Lesson 03]]) để kiểm tra không có invariant subspace trail
> 4. **Precompute sparse decomposition**: Tính $(\hat{M}, \mathbf{v}, \mathbf{w})$ và pre-accumulated matrix $M'$ cho partial rounds (Schemes A.3–A.5)
> 5. **Implement round function**: Full rounds dùng dense $M$; partial rounds dùng sparse optimization
> 6. **Wrap với sponge**: Implement Algorithm 1 ([[02-sponge-construction|Lesson 02]]) với domain separation ([[04-instantiations-parameters|Lesson 04]])
> 7. **Test vectors**: Verify với test vectors từ [poseidon-hash.info](https://www.poseidon-hash.info/)

---

## Summary

- **Grain LFSR** (80-bit): sinh round constants và MDS matrix từ seed = encoded instance parameters → đảm bảo NUMS (không có backdoor).
- **Warm-up 160 cycles**: loại bỏ initialization bias trước khi lấy output.
- **Rejection sampling**: nếu LFSR output $\geq p$, bỏ qua và lấy tiếp — đảm bảo phân phối đều trên $\mathbb{F}_p$.
- **Sparse matrix decomposition** $M = \hat{M} + \mathbf{v}\mathbf{w}^T$: giảm MixLayer cost trong partial rounds từ $O(t^2)$ xuống $O(t)$ multiplications.
- **Pre-accumulated matrix** $M'$: gộp tất cả $R_P$ partial MixLayers thành 1 → giảm thêm nữa trong native computation.
- Kết hợp cả hai optimizations: improvement **~5×** cho native implementation, **và** giảm R1CS constraint count đáng kể trong ZK circuits.

---

## References

- [Hell+06] Hell, Johansson, Meier — *Grain: A Stream Cipher for Constrained Environments*, ECRYPT 2006 (🔴 Prerequisite — Grain LFSR design)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — Appendix A, B (nguồn chính bài này)
- [poseidon-hash.info] Official parameter reference — test vectors, instantiations
