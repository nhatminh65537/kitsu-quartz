---
title: "08. Performance and Benchmarks"
type: deep-dive
tags: [anemoi, performance, benchmarks, r1cs, plonk, deep-dive, lesson-08]
aliases: [Anemoi Performance, Anemoi Benchmarks, Anemoi R1CS Plonk]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Anemoi permutation (xem [[04-anemoi-permutation|04. The Anemoi Permutation]]), Jive và instantiations (xem [[05-jive-compression-mode|05. Jive]], [[06-anemoi-instantiations|06. Instantiations]]), CICO và AO hash landscape (xem [[01-ao-hash-functions-and-cico|01. AO Hash Functions & CICO]])
> **Lesson type**: Deep Dive
> **Covers**: §8 (R1CS constraints, Plonk constraints, native performance, comparison tables vs Poseidon/Rescue-Prime/Griffin)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\#\text{R1CS}$ | Số R1CS constraints để hash một message block |
> | $\#\text{Plonk}$ | Số Plonk gates để hash một message block |
> | $\#\text{mult}$ | Số phép nhân (field multiplications) native |
> | $\ell$ | Số cột Anemoi; state width $= 2\ell$ |
> | $n_r$ | Số rounds |

---

## Motivation — Context trong Parent Scheme

Bài này là **Deep Dive** vào §8 của paper — nơi Anemoi được đo đạc và so sánh với tất cả competitor AO hash. Đây là phần "chứng minh thực nghiệm" cho những claim trong §1:

> *"factor of 2 improvement over Poseidon in R1CS, 21–35% Plonk reduction"*

Mọi số liệu cụ thể, methodology đo đạc, và comparison table đều ở đây.

---

## 1. Metrics được đo

Paper [Bou+22/23, §8] đo ba metrics:

| Metric | Proof system | Ý nghĩa |
|--------|-------------|---------|
| R1CS constraints | Groth16 | Số nhân tuyến tính trong circuit |
| Plonk gates | Plonk (với custom gates) | Số gates sau optimization |
| Native multiplications | Không có proof system | Performance khi chạy trực tiếp trên CPU |

Tất cả đều tính cho **một permutation call** (tức là một Anemoi instance với $n_r$ rounds và state $2\ell$).

---

## 2. R1CS Constraints — Analysis

### 2.1 Cách tính constraints cho Anemoi

Trong R1CS, mỗi phép nhân trên $\mathbb{F}_q$ = một constraint. Các phép cộng là miễn phí.

Mỗi round của Anemoi có:
- **Constant addition**: 0 mult (linear).
- **MDS matrix**: $O(\ell^2)$ additions — 0 mult.
- **PHT**: 2 additions — 0 mult.
- **Flystel S-box** (mỗi cột): cần tính $x^{1/\alpha}$ — đây là phép tốn kém nhất.

Để tính $x^{1/\alpha}$ trong R1CS: cần chứng minh $y^\alpha = x$ bằng cách compute $y$ và verify $y^\alpha = x$. Verify $y^\alpha$ cần $\lceil \log_2 \alpha \rceil$ phép nhân (square-and-multiply):

- $\alpha = 3$: $y^3 = y^2 \cdot y$ → 2 mult per Flystel
- $\alpha = 5$: $y^5 = y^4 \cdot y$ → 3 mult
- $\alpha = 7$: 4 mult
- $\alpha = 11$: $y^{11} = y^8 \cdot y^2 \cdot y$ → 4 mult (với optimization)

Ngoài ra, Open Flystel cần thêm 2 mult cho $y^2$ terms ($Q_\gamma$ và $Q_\delta$).

**Tổng per Flystel** (với $\alpha = 11$): $\approx 4 + 2 = 6$ mult. Với $\ell$ cột và $n_r$ rounds:

$$
\#\text{R1CS} \approx \ell \cdot n_r \cdot (\lceil\log_2 \alpha\rceil + 2)
$$

### 2.2 So sánh R1CS — Anemoi vs Poseidon vs Rescue-Prime

Paper [Bou+22/23, §8, Table 3] báo cáo (cho 128-bit security, BLS12-381 field):

| Primitive | State ($2\ell$) | Rounds | R1CS/permutation | R1CS/field-element-hashed |
|---------|----------------|--------|-------------------|--------------------------|
| **Anemoi** ($\alpha=11$) | **2** | **19** | **~84** | **~84** |
| Poseidon ($\alpha=5$) | 3 | 8 full + 56 partial | ~252 | ~168 |
| Rescue–Prime | 3 | 10 | ~210 | ~140 |
| Griffin ($t=4$) | 4 | 7 | ~168 | ~168 |

> [!tip] 💡 Agent note
> "R1CS/field-element-hashed" là metric fair hơn: tính số constraints per field element absorbed. Anemoi với rate $r=1$ absorb 1 element/call → R1CS/element = R1CS/permutation. Poseidon với $r=2$ absorb 2 elements/call → R1CS/element = R1CS/permutation / 2. Nhìn theo metric này, Anemoi vẫn competitive nhưng margin nhỏ hơn.

---

## 3. Plonk Constraints — Tận dụng Custom Gates

### 3.1 Lợi thế của Closed Flystel

Như phân tích trong [[03-flystel-sbox|Lesson 03]], **verify** Flystel evaluation trong Plonk chỉ cần **2 custom gates** (nhờ CCZ-equivalence $H \sim V$):

- **Gate 1**: Quadratic check — $x'' - x' = g(y^2 - y'^2)$: một polynomial identity bậc 2.
- **Gate 2**: Inversion check — $y - y' = (x')^{1/\alpha}$: verify bằng $y'^{\alpha} = x'$ là bậc $\alpha$.

Với Plonk custom gates, mỗi gate encode một polynomial identity bậc $\leq \alpha$ — không nhất thiết là nhân đơn thuần. Do đó Flystel dùng 2 gates thay vì $\lceil \log_2 \alpha \rceil + 2$ gates như R1CS.

### 3.2 So sánh Plonk

Paper [Bou+22/23, §8, Table 4] báo cáo (so sánh số Plonk gates):

| Primitive | Plonk gates/permutation | So với Anemoi |
|---------|------------------------|---------------|
| **Anemoi** ($\ell=1$, $\alpha=11$, 19 rounds) | **~38** | Baseline |
| Poseidon (highly optimized) | ~48–58 | 21–35% more |
| Rescue–Prime | ~60+ | >50% more |

Reduction 21–35% so với Poseidon là improvement đáng kể cho Plonk-based ZK systems.

### 3.3 Lý do Plonk improvement lớn hơn R1CS improvement

R1CS không có "custom gates" — mọi phép tính đều phải decompose thành nhân cơ bản. Do đó Flystel không có lợi thế đặc biệt so với R1CS. Nhưng với Plonk custom gates, **toàn bộ Flystel logic có thể encode trong 2 gates** — đây là nơi CCZ-equivalence tạo ra advantage thực sự.

---

## 4. Native Performance

### 4.1 Methodology

Native performance được đo bằng số **field multiplications** ($\mathbb{F}_p$ mult) cần thiết để evaluate permutation, không counting setup overhead của proof systems.

### 4.2 Kết quả

Paper [Bou+22/23, §8] báo cáo native performance (roughly):

| Primitive | Field | Mult/permutation | Relative speed |
|---------|-------|-----------------|----------------|
| **Anemoi** ($\ell=1$, $\alpha=11$) | BLS12-381 | ~114 | **2–3× faster than Rescue** |
| Rescue–Prime | BLS12-381 | ~300+ | Baseline |
| Poseidon | BLS12-381 | ~180 | ~1.6× faster than Rescue |
| Griffin | BLS12-381 | ~140 | Comparable to Anemoi |

Lý do Anemoi nhanh hơn Rescue natively: Rescue cần $x^{1/\alpha}$ forward (expensive inversion) trong mỗi round của mỗi element. Anemoi chỉ cần $x^{1/\alpha}$ một lần per Flystel (nhờ cấu trúc 3-step), và với $\ell = 1$ chỉ có 1 Flystel/round.

---

## 5. Comparison trong Context Merkle Tree — ZK Application

Đây là metric quan trọng nhất cho application:

> [!abstract] Kết quả thực tế (theo companion paper ePrint 2022/1487)
> Để verify một Merkle membership proof trên cây độ sâu 30 (1 tỷ leaves) sử dụng AnemoiJive-BLS12-381:
>
> | System | Gates/membership proof | vs Lookup-based |
> |--------|------------------------|-----------------|
> | **AnemoiJive (Plonk)** | ~16 gates/node × 30 = **480 gates** | **7× fewer gates** |
> | Poseidon (Plonk) | ~50 gates/node × 30 = 1500 gates | 2× fewer than lookup |
> | Table-lookup (Caulk) | Requires very long SRS | — |
>
> Với 30-deep tree, difference là ~1000 gates — impact đáng kể với prover time.

---

## 6. Summary bảng tổng hợp

| Metric | Anemoi ($\ell=1$, $\alpha=11$) | Poseidon | Rescue-Prime | Griffin |
|--------|-------------------------------|----------|-------------|---------|
| R1CS/permutation | ~84 | ~252 | ~210 | ~168 |
| R1CS advantage | **~3× vs Poseidon** | baseline | 1.2× better | 1.5× better |
| Plonk gates | ~38 | ~48–58 | ~60+ | ~50 |
| Plonk advantage | **21–35% vs Poseidon** | baseline | worse | comparable |
| Native speed | 2–3× faster than Rescue | 1.6× faster | baseline | ~comparable |
| Security | 127-bit | 128-bit | 128-bit | 128-bit |
| Multi-proof-system | **Yes** (R1CS + Plonk + STARK) | Partial | Partial | Partial |

---

## 7. Giới hạn và Trade-offs

> [!warning] Trade-offs cần lưu ý
> **Rate thấp ($r=1$)**: AnemoiSponge hấp thụ 1 field element/call — chậm hơn Poseidon với $r=2$ hoặc $r=3$ khi hashing long messages. Với short messages (≤1 field element), điều này không thành vấn đề.
>
> **Native performance với $\ell > 1$**: Với state lớn hơn ($\ell = 2, 4$), Anemoi nhanh hơn per-element nhưng cần nhiều R1CS hơn per-permutation. Optimal $\ell$ phụ thuộc vào use case.
>
> **Post-publication attacks**: Như noted trong [[07-security-analysis-algebraic-attacks|Lesson 07]], FreeLunch và resultant attacks (2024–2025) giảm effective security margin. Users cần cân nhắc dùng $\ell > 1$ để có security margin tốt hơn.

---

## 8. Connection với Parent Design

Bài này hoàn thành phân tích performance của Anemoi. Chuỗi đầy đủ:

- [[03-flystel-sbox|Lesson 03]]: CCZ-equivalence → verify $H$ via $V$ → 2 Plonk gates
- [[04-anemoi-permutation|Lesson 04]]: SPN design với Table 1
- [[07-security-analysis-algebraic-attacks|Lesson 07]]: Số rounds từ GB complexity
- **Bài này**: Đo đạc thực tế, xác nhận claims của paper

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- ePrint 2022/1487 — *Companion note: TurboPlonk implementation of Anemoi* (⚪ benchmark context)
- [GKRRS21] Grassi et al. — *Poseidon* (🟡 comparison baseline)
- [AABDS20] Aly et al. — *Rescue-Prime* (🟡 comparison baseline)
- Reference implementations: https://github.com/anemoi-hash/anemoi-rust
