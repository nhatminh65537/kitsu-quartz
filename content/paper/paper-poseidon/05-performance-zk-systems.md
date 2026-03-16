---
title: "05. Performance in ZK Proof Systems"
type: deep-dive
tags: [poseidon, performance, snark, stark, bulletproofs, r1cs, plonk, deep-dive, lesson-05]
aliases: [POSEIDON Performance, POSEIDON ZK Cost]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[03-hades-round-function|03. HADES & Round Function]], [[04-instantiations-parameters|04. Instantiations & Parameters]], khái niệm R1CS/constraint systems ở mức basic  
> 🔴 **Prerequisite references**: Groth — *Pairing-Based Non-interactive Arguments* [Gro16] (R1CS model đầy đủ); Gabizon, Williamson, Ciobanu — *PLONK* [GWC19] (gate constraint model)  
> **Lesson type**: Deep Dive  
> **Covers**: §4, §4.1 (SNARKs: Groth16, PLONK, Tables 3–4), §4.2 (STARKs), §4.3 (Applications: Merkle trees, Bulletproofs)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | R1CS | Rank-1 Constraint System | R1CS |
> | $n_{\times}$ | Số multiplication constraints | — |
> | AET | Algebraic Execution Trace (STARK) | AET |
> | $\ell$ | Số bit per field element (field size) | $n$ (bài này dùng $\ell$ để tránh nhầm với round count) |
> | $R_F, R_P, t$ | Như các bài trước | — |
> | $\alpha$ | S-box exponent | $\alpha$ |

---

## Motivation: Tại Sao Cần Đánh Giá Per-Proof-System?

Như đã nói trong [[01-zk-hash-motivation|Lesson 01]], **không tồn tại một POSEIDON instance tối ưu cho mọi proof system** vì mỗi hệ thống dùng một mô hình arithmetization khác nhau. Bài này đi vào chi tiết: với từng proof system, **constraint/gate của POSEIDON trông như thế nào**, và tại sao nó rẻ hơn đối thủ.

Metric chính là **số constraints (hoặc gates) per output bit** khi dùng POSEIDON trong Merkle tree hash — đây là use case chi phối trong ZK applications.

---

## SNARKs — Groth16 và R1CS (§4.1)

> [!info] 🟡 R1CS Model (từ [Gro16])
> Trong **Groth16**, một computation được biểu diễn như một **Rank-1 Constraint System (R1CS)**: một tập các constraints dạng:
>
> $$
> (a \cdot w) \cdot (b \cdot w) = (c \cdot w)
> $$
>
> với $w$ là witness vector, $a, b, c$ là vectors hệ số. Mỗi constraint tương ứng với **một phép nhân** (multiplication gate). Phép cộng (addition) là **miễn phí** — không tốn constraint.  
> Complexity của prover tỉ lệ tuyến tính với số multiplication constraints.
>
> *(theo [Gro16]: Groth — On the Size of Pairing-Based Non-interactive Arguments, EUROCRYPT 2016)*

### Chi Phí Groth16 Cho POSEIDON

**Full round** (S-box áp trên tất cả $t$ phần tử):

Mỗi S-box $x^\alpha$ cần:
- $\alpha = 3$: $x^3 = x \cdot x \cdot x$ → **2 multiplications** (tính $x^2$ rồi $x^2 \cdot x$)
- $\alpha = 5$: $x^5 = (x^2)^2 \cdot x$ → **3 multiplications** (tính $x^2$, $(x^2)^2$, rồi nhân thêm $x$)

Mỗi full round: $t \cdot \lceil \log_2 \alpha \rceil$ constraints (xấp xỉ).

**Partial round** (chỉ một S-box):

Mỗi partial round: $\lceil \log_2 \alpha \rceil$ constraints → rẻ hơn full round $t$ lần.

**Tổng constraints của $\mathsf{POSEIDON}^\pi$**:

$$
n_\times \approx R_F \cdot t \cdot \lceil \log_2 \alpha \rceil + R_P \cdot \lceil \log_2 \alpha \rceil
$$

> [!note] Scheme 5.1 — R1CS Cost Model cho POSEIDON (Groth16)
> **Type**: Constraint counting  
> **Setting**: Instance $(n, t, R_F, R_P, \alpha)$; R1CS với free additions
>
> **$\mathsf{R1CS\_Cost}(t, R_F, R_P, \alpha)$**
> - Input: POSEIDON parameters
> - Gọi $C_\alpha = \lceil \log_2 \alpha \rceil$: số multiplications per S-box ($C_3 = 2$, $C_5 = 3$)
> - Full rounds contribution: $R_F \cdot t \cdot C_\alpha$
> - Partial rounds contribution: $R_P \cdot C_\alpha$
> - Total: $n_\times = C_\alpha \cdot (R_F \cdot t + R_P)$
> - Output: Tổng số R1CS multiplication constraints

**Ví dụ**: $x^5$-POSEIDON-128 với $t = 3$, $R_F = 8$, $R_P = 57$:

$$
n_\times = 3 \cdot (8 \cdot 3 + 57) = 3 \cdot 81 = 243 \text{ constraints}
$$

So với **Pedersen Hash** (dùng Edwards curve point additions): khoảng 2000–3000 constraints per hash tùy implementation. POSEIDON rẻ hơn ~8–12×.

So với **SHA-256**: khoảng 25,000 constraints (XOR/AND cần nhiều multiplication gates khi biểu diễn trong $\mathbb{F}_p$). POSEIDON rẻ hơn ~100×.

### Groth16 Performance Table (Table 3, paper §4.1)

| Hash | Curve | Width $t$ | R1CS constraints | R1CS / bit |
|------|-------|-----------|-----------------|-----------|
| **POSEIDON-128** | BLS12-381 | 3 | 243 | **1.5** |
| **POSEIDON-128** | BLS12-381 | 5 | 297 | **1.1** |
| Pedersen Hash | BLS12-381 | — | ~1740 | ~10.9 |
| MiMC | BLS12-381 | 2 | ~2700 | — |
| Rescue | BLS12-381 | 2 | ~350 | ~2.2 |

---

## SNARKs — PLONK (§4.1)

> [!info] 🟡 PLONK Gate Model (từ [GWC19])
> **PLONK** (Gabizon, Williamson, Ciobanu 2019) dùng **custom gates** với fan-in/fan-out linh hoạt hơn R1CS. Một gate trong PLONK có dạng:
>
> $$
> q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot a \cdot b + q_C = 0
> $$
>
> với $q_L, q_R, q_O, q_M, q_C$ là selector polynomials. Điều này cho phép:
> - Multiplication gate: $q_M = 1$, $q_O = -1$ → $a \cdot b = c$
> - Addition gate: $q_L = q_R = 1$, $q_O = -1$ → $a + b = c$  
> - Linear constraint: free.
>
> PLONK có thể dùng **custom gates** bậc cao hơn (ví dụ fan-in 3), giúp encode nhiều phép toán vào một gate.
>
> *(theo [GWC19]: Gabizon, Williamson, Ciobanu — PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge, 2019)*

### Chi Phí PLONK Cho POSEIDON

Trong PLONK với fan-in 2:

**Full round**: Mỗi S-box $x^\alpha$ cần cùng số multiplication gates như R1CS. Nhưng linear layer (MixLayer) biểu diễn hiệu quả hơn vì PLONK hỗ trợ **linear combinations miễn phí**.

**Partial round quan trọng hơn**: Trong Groth16, additions trong linear layer là free. Trong PLONK, layout circuit ảnh hưởng đến tổng gate count — nhưng POSEIDON vẫn rẻ hơn vì phần đa là additions.

**Optimization quan trọng trong partial rounds**: Paper chỉ ra rằng trong partial S-box rounds, ta có thể **merge** các linear constraints từ MixLayer với round constant addition vào cùng một gate:

$$
u_i = \sum_j M_{i,j} \cdot x_j = s_0^\alpha \cdot M_{i,0} + \sum_{j \geq 1} M_{i,j} \cdot x_j
$$

Với $2 \leq i \leq t$: vì $s_0^\alpha$ là biến đã tính, đây là linear combination thuần túy → **0 multiplication gates**. Chỉ có $s_0^\alpha$ mới tốn $C_\alpha$ gates.

**Tổng PLONK gates** (xấp xỉ, fan-in 2):

$$
n_{\text{gate}} \approx C_\alpha \cdot (R_F \cdot t + R_P) + \underbrace{t \cdot (R_F + R_P)}_{\text{MixLayer, partial rounds free sau optimization}}
$$

Kết quả: POSEIDON trong PLONK **rẻ hơn nữa** so với Groth16 nhờ optimization này.

---

## STARKs (§4.2)

STARKs không dùng R1CS hay PLONK — thay vào đó dùng **Algebraic Execution Trace (AET)**.

> [!note] Scheme 5.2 — AET Cost Model cho POSEIDON (STARK)
> **Type**: STARK constraint counting  
> **Setting**: AET với columns tương ứng state variables, rows tương ứng computation steps
>
> **Cách biểu diễn POSEIDON trong AET**:
> - Mỗi phần tử $s_i \in \mathbb{F}_p$ là một **column** trong AET
> - Mỗi round là **một hoặc nhiều rows**
> - S-box $x^\alpha$ cần $\lceil \log_2 \alpha \rceil$ intermediate rows để tính bậc cao dần
>
> **$\mathsf{AET\_Cost}(t, R_F, R_P, \alpha)$**
> - Input: POSEIDON parameters
> - Columns: $t$ (cho state) + $t$ (cho intermediate values nếu $\alpha > 3$)
> - Rows cho full rounds: $R_F \cdot \lceil \log_2 \alpha \rceil$
> - Rows cho partial rounds: $R_P \cdot \lceil \log_2 \alpha \rceil$ (chỉ 1 column active)
> - Total cost metric: columns × rows (= trace size)
> - Output: AET trace dimensions

**Điểm khác biệt với SNARK**: STARKs không cần pairing-friendly curve → có thể dùng **Mersenne primes** (e.g., $p = 2^{31} - 1$ với $n = 31$) hoặc **64-bit primes**, cho phép $\alpha = 3$ trên nhiều trường hơn.

### STARK Performance (Table 4, paper §4.2)

| Hash | $n$ (bits) | Columns | Steps | Cost |
|------|-----------|---------|-------|------|
| **POSEIDON-128** ($t=3$) | 255 | 3 | 73 | 219 |
| **POSEIDON-128** ($t=5$) | 255 | 5 | 68 | 340 |
| Rescue ($t=2$) | 255 | 2 | 22 | 44 |
| MiMC ($t=2$) | 255 | 2 | 219 | 438 |

> [!tip] 💡 Agent note
> Rescue trông có vẻ rẻ hơn trong bảng STARK (44 vs 219). Điều này là do Rescue dùng ít columns hơn ($t = 2$) và ít steps hơn (22 steps nhờ bilinear S-box $x^\alpha \circ x^{1/\alpha}$). Tuy nhiên khi so sánh theo **security per column×step per bit message**, POSEIDON competitive hơn vì throughput (message bits per call) lớn hơn với $t$ lớn. Đây là lý do paper recommend $t = 5$ cho arity-4 Merkle trees.

---

## Ứng Dụng Thực Tế (§4.3)

### Merkle Trees

Use case chủ đạo của POSEIDON. Một Merkle tree với arity $k$ (mỗi nút có $k$ con) dùng POSEIDON-$(k, k+1, R_F, R_P, \alpha)$ như compression function.

**Recommendation của paper**:
- **Groth16/PLONK**: dùng arity-4 tree ($t = 5$, rate = 4) với POSEIDON-128.
- **STARKs**: dùng arity-2 tree ($t = 3$, rate = 2) do STARK cost phụ thuộc trace width.
- **Bulletproofs**: arity-4 hoặc arity-2 đều competitive.

**Kết quả benchmark**: Membership proof trong Merkle tree có **$10^9$ lá** (1-of-a-billion):

$$
\text{Tree depth} = \lceil \log_4(10^9) \rceil = 15 \text{ levels} \quad \Rightarrow \quad 15 \text{ hash evaluations per proof}
$$

Với Bulletproofs và POSEIDON-128 ($t = 5$): proof generation **< 1 giây** trên laptop i9 @2.9GHz.

### Ethereum Mixers và Zcash

Ứng dụng concrete được nhắc trong paper: **Zcash** dùng SHA-256 trong circuit ban đầu → 42 giây proof time. Thay bằng POSEIDON → sub-second. Tương tự với **Ethereum mixer contracts** (tornado cash-style) dùng Merkle tree để ẩn danh tính.

### Bulletproofs

Bulletproofs (không cần trusted setup) dùng **inner product argument** trên $\mathbb{Z}_p$. POSEIDON hoạt động natively trên $\mathbb{Z}_p$ → không cần bất kỳ field conversion nào.

---

## Tổng Hợp So Sánh

| Proof system | Metric | POSEIDON-128 ($t=3$) | Pedersen | SHA-256 |
|-------------|--------|---------------------|----------|---------|
| Groth16 | R1CS / bit | **1.5** | ~10.9 | ~156 |
| PLONK | Gates / bit | **~1.5** | ~10.9 | ~100+ |
| STARK | Cols×steps / bit | **~7** | N/A | ~500+ |
| Bulletproofs | Mult / bit | **~2** | ~6 | N/A |

> [!warning] Không có winner tuyệt đối
> Với $t = 3$, POSEIDON tốt cho arity-2 tree nhưng throughput thấp. Với $t = 5$, POSEIDON tốt cho arity-4 tree và R1CS/bit giảm xuống ~1.1. **Chọn $t$ phụ thuộc vào arity của Merkle tree và proof system**.

---

## Summary

- **Groth16 (R1CS)**: cost = $C_\alpha \cdot (R_F \cdot t + R_P)$ multiplications; cộng free → POSEIDON ~8× rẻ hơn Pedersen, ~100× rẻ hơn SHA-256.
- **PLONK**: tương tự Groth16 nhưng với optimization partial rounds → merge MixLayer vào linear gates.
- **STARKs (AET)**: cost = columns × rows; POSEIDON competitive khi $t$ phù hợp với use case.
- **Merkle tree**: arity-4 ($t = 5$) là sweet spot cho Groth16; proof 1-of-a-billion < 1 giây với Bulletproofs.
- Không có instance tối ưu cho mọi proof system — mỗi cần cấu hình riêng.

---

## References

- [Gro16] Groth — *On the Size of Pairing-Based Non-interactive Arguments*, EUROCRYPT 2016 (🟡 Integrate — R1CS model)
- [GWC19] Gabizon, Williamson, Ciobanu — *PLONK*, 2019 (🟡 Integrate — gate constraint model)
- [AGR+16] Albrecht, Grassi et al. — *MiMC*, ASIACRYPT 2016 (🟡 Integrate — performance baseline)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §4 (nguồn chính bài này)
