---
title: "07. Range Proofs and Implementation"
type: deep-dive
tags: [range-proof, implementation, benchmark, aggregate, confidential-transaction, lesson-07]
aliases: [Range Proof, Aggregate Range Proof, QESA Range Proof]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[06-qesazk|06. QESAZK]] (quadratic equation satisfiability, adaptive commit-and-prove); [[05-ipa-almzk|05. IPAalmZK]] (almost-ZK inner product argument).
> 🔴 **Prerequisite references**: Bünz et al. [Bün18] — §4 (Bulletproofs range proof — dedicated construction với R1CS).
> **Lesson type**: Deep Dive
> **Covers**: §5 (range proofs — encoding, single và aggregate; benchmark comparison với Bulletproofs; implementation notes); Tables 1–2 (efficiency comparison đầy đủ); §1.2.9 (implementation).
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $v \in [0, 2^n)$ | Secret value cần chứng minh range | $v$ |
> | $n$ | Bit-length của range | $n$ |
> | $b = (b_0, \ldots, b_{n-1}) \in \{0,1\}^n$ | Bit decomposition của $v$ | $b$ |
> | $\mathbf{2}^{[n]}$ | Power-of-2 vector $(1, 2, 4, \ldots, 2^{n-1})$ | $\mathbf{2}^{[n]}$ |
> | $m$ | Số range proofs aggregate cùng nhau | $m$ |
> | $[c_v]$ | Commitment đến secret value $v$ | $[c_v]$ |

---

## Context: Range Proof là gì?

**Range proof** cho phép prover chứng minh rằng một committed value $v$ thuộc vào khoảng $[0, 2^n)$, mà **không tiết lộ giá trị $v$**.

**Ứng dụng thực tế**:
- **Confidential Transactions** (Monero, MimbleWimble): Ẩn amounts trong transactions nhưng cần prove không negative.
- **Provisions Protocol**: Sàn Bitcoin chứng minh solvent mà không lộ balance.
- **Private set membership**: Chứng minh một giá trị nằm trong một range nhất định.

**Bulletproofs** [Bün18] cung cấp một range proof **chuyên dụng** với proof size $O(\log n)$ — nhỏ hơn nhiều so với các scheme trước. Paper [HKR19] so sánh **generic instantiation của QESAZK** cho range proof với **dedicated range proof của Bulletproofs**.

> [!tip] 💡 Agent note
> Đây là điểm quan trọng: paper không thiết kế một range proof mới chuyên biệt. Thay vào đó, **dùng QESAZK như một black box** — chỉ cần encode range proof thành hệ QE equations và feed vào QESAZK. Đây minh họa tính **modular** và **generic** của hệ thống.

---

## Encoding Range Proof thành QE

### Step 1 — Bit Decomposition

Để chứng minh $v \in [0, 2^n)$, tương đương chứng minh: tồn tại $b = (b_0, \ldots, b_{n-1}) \in \{0,1\}^n$ sao cho:

$$
\langle b,\, \mathbf{2}^{[n]} \rangle = \sum_{i=0}^{n-1} 2^i b_i = v
$$

Đây là một **linear constraint** — không phải QE. Nhưng cần thêm constraint $b_i \in \{0,1\}$.

### Step 2 — Boolean Constraint thành QE

Condition $b_i \in \{0,1\}$ tương đương $b_i(b_i - 1) = 0$, tức:

$$
b_i^2 - b_i = 0 \quad \Leftrightarrow \quad \langle b,\, e_i \rangle \cdot \langle b,\, e_i \rangle = \langle b,\, e_i \rangle
$$

Viết dưới dạng QE với matrix $\Gamma_i$:

$$
\langle b,\, \Gamma_i b \rangle = 0 \quad \text{với } \Gamma_i = e_i e_i^\top - \frac{1}{2}(e_i e_j^\top + e_j e_i^\top) \text{ (appropriate construction)}
$$

Thực ra đơn giản hơn: $b_i^2 - b_i = b_i(b_i - 1) = 0$ là QE dạng $\langle b, \Delta_i b \rangle = 0$ với $\Delta_i = e_i e_i^\top$ (diagonal matrix với 1 ở vị trí $i$) và một điều chỉnh linear.

### Step 3 — Witness và Encoding

> [!note] Range Proof Encoding thành QESAZK
> **Input**: Committed value $v \in \mathbb{F}_p$ với $[c_v]$.
> **Witness**: $b = (b_0, \ldots, b_{n-1}) \in \{0,1\}^n$.
>
> **Linear constraint** (dùng LMPAbatch hoặc trực tiếp):
> $$\langle b, \mathbf{2}^{[n]} \rangle = v$$
>
> **Quadratic constraints** ($n$ equations cho bit condition):
> $$\langle b, \Gamma_i b \rangle = 0 \quad \forall i = 0, \ldots, n-1$$
>
> với $\Gamma_i$ được thiết kế để encode $b_i(b_i - 1) = 0$.
>
> Gọi QESAZK với witness $w = b \in \mathbb{F}_p^n$, $N = n$ equations, $\Gamma_1, \ldots, \Gamma_n$.

**Tổng số equations**: $n$ QE equations (bit conditions) + 1 linear constraint (sum = $v$).

**So sánh với Bulletproofs**: Bulletproofs encode range proof thành inner product với polynomial trick, cần nhiều auxiliary variables hơn. QESAZK dùng trực tiếp bit decomposition với QE.

---

## Aggregate Range Proofs

**Aggregate range proof** cho phép chứng minh $m$ giá trị $v_1, \ldots, v_m$ tất cả đều trong $[0, 2^n)$, trong một **single proof** nhỏ hơn $m$ proofs riêng lẻ.

### Encoding Aggregate

Với $m$ values, witness là concatenation $w = (b^{(1)}, \ldots, b^{(m)}) \in \mathbb{F}_p^{mn}$, tổng số QE equations là $mn$ (bit conditions cho mỗi bit của mỗi value) + $m$ linear constraints.

**QESAZK handles aggregate natively**: Vì QESAZK nhận một commitment $[c_w]$ đến toàn bộ witness $w$, aggregate chỉ cần extend $w$ và $\Gamma_i$ matrices — không cần protocol mới.

**Proof size scaling**: Với witness size $n' = mn$:
- Group elements: $2\lceil\log(mn + 2)\rceil + 3 \approx 2\log n + 2\log m + O(1)$
- So với $m$ proofs riêng: $m \cdot (2\log n + O(1))$ — **tiết kiệm $O(m \log m)$ group elements**

> [!info] 🟡 Aggregate trong Bulletproofs [Bün18]
> Bulletproofs cũng hỗ trợ aggregate range proofs: $m$ values cùng range $[0, 2^n)$ → proof size $2\lceil\log(mn)\rceil + 8$. Cơ chế: merge tất cả bit vectors thành một large inner product statement. Bước "merge" này specific cho Bulletproofs dedicated range proof.
>
> QESAZK aggregate đơn giản hơn về mặt conceptual (chỉ extend witness), nhưng proof size gần bằng nhau.
>
> *(theo [Bün18]: §4.2 Aggregate Range Proofs)*

---

## §5 — Benchmark: QESAZK vs Bulletproofs

Paper so sánh **generic QESAZK range proof** với **dedicated Bulletproofs range proof** — một so sánh bất lợi cho QESAZK về mặt fair comparison (dedicated vs generic), nhưng vẫn competitive.

### Setup Implementation

Paper implement cả hai trong **C++** dùng **RELIC toolkit**, cùng mức optimization. Curve: BN256 (pairing-friendly, 128-bit security). Code available tại [github.com/emsec/QESA_ZK](https://github.com/emsec/QESA_ZK).

**Lưu ý quan trọng**: Paper compare dedicated Bulletproofs range proof (với polynomial tricks đặc thù cho range) với generic QESAZK instantiation. Nếu implement một dedicated QESA range proof, sẽ còn tốt hơn nữa.

### Kết quả Benchmark

| Metric | QESAZK (generic) | Bulletproofs [Bün18] (dedicated) | Ratio |
|--------|-----------------|----------------------------------|-------|
| Theoretical prover FLOPs | $\approx 8n$ exp | $\approx 12n$ exp | **$0.75\times$** |
| Measured prover runtime (full exponent) | baseline | $1.43\times$ QESA | **$\approx 0.7\times$** |
| Measured prover runtime (140-bit exp) | baseline | $1.59\times$ QESA | **$\approx 0.63\times$** |
| Proof size (group elements) | $2\log(n+2)+3$ | $2\log n + 8$ | Similar |
| Field elements | 2 | 5 | **$0.4\times$** |

**Phân tích**: 
- Prover thấp hơn vì $8n$ vs $12n$ exponentiations ($0.67\times$ lý thuyết, $0.7\times$ thực tế).
- Với **140-bit exponents** (smaller challenges → faster scalar mul): QESAZK tốt hơn rõ rệt ($0.63\times$) vì ít operations tổng cộng hơn, mỗi op nhỏ hơn.
- Proof size **group elements** gần bằng nhau; field elements ít hơn đáng kể (2 vs 5).

> [!warning] Giới hạn của so sánh
> Paper acknowledge: đây là **generic** QESAZK vs **dedicated** Bulletproofs. Các optimizations specific cho Bulletproofs range proof (e.g., Hadamard product tricks, polynomial identity) không được apply cho QESAZK trong benchmark này. Một dedicated QESA range proof có thể cải thiện thêm. Ngoài ra, không optimize multi-exponentiation cho QESAZK prover.

### Aggregate Benchmarks

Với $m$ values aggregate ($m = 1, 2, 4, 8, \ldots$):

| $m$ (số values) | QESAZK proof size | Bulletproofs proof size | Speedup prover |
|-----------------|-------------------|------------------------|----------------|
| 1 | $2\log(n+2)+3$ | $2\log(n)+8$ | $\approx 0.7\times$ |
| $m$ | $2\log(mn+2)+3$ | $2\log(mn)+8$ | $\approx 0.7\times$ (roughly) |

Cả hai scale logarithmically với $m$ — QESAZK advantage chủ yếu ở **prover runtime** và **field element count**.

---

## Tables 1–2: Toàn cảnh Efficiency

Từ paper, tổng hợp đầy đủ:

**Table 1** — High-level comparison:

| System | Trusted Setup | Assumption | Moves | Communication | P compute | V compute | Native relation |
|--------|--------------|------------|-------|--------------|-----------|-----------|----------------|
| SNARG [Gro16] | ✗ (cần) | KoE | 1 | $O(1)$ | $O(n)$ | $\leq |w|$ | R1CS |
| Bulletproofs [Bün18] | ✓ (CRS đủ) | dlog | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $|w|$ | R1CS |
| **This work** | ✓ (CRS đủ) | dlog | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $|w|$ | **QE** |

**Table 2** — Detailed ($k = 2$, optimal):

| Protocol | $G$ comm | $\mathbb{F}_p$ comm | P compute | Relation |
|----------|---------|---------|-----------|---------|
| LMPAZK | $\approx 2km\log_k n$ | $2km$ | $\approx (k+2)mn$ | LMP |
| QESAZK ($k=2$) | $2\lceil\log(n+2)\rceil + 3$ | $2$ | $\approx 8n$ | QE |
| Bulletproofs [Bün18] | $2\lceil\log n\rceil + 8$ | $5$ | $\approx 12n$ | R1CS |

**Tại sao $n+2$ trong QESAZK?** Commitment extension: witness $w \in \mathbb{F}_p^n$ được extend với 2 auxiliary elements cho đúng format — nên witness size effective là $n+2$.

---

## Kết luận Thực Tiễn

**Khi nào nên dùng QESAZK thay vì Bulletproofs?**

Khi relation tự nhiên là **quadratic** (không phải R1CS). Cụ thể:

- **Bit conditions** $b_i(b_i-1) = 0$: QE tự nhiên, không cần witness extension như R1CS.
- **Matrix-vector products** với cả matrix và vector secret: QE tự nhiên, R1CS cần nhiều auxiliary variables.
- **Elliptic curve arithmetic** (Edwards/Twisted Edwards): 5 QE vs 8 R1CS constraints per point addition.
- **Polynomial evaluation**: $2d$ QE vs $O(d^2)$ R1CS (xem Lesson 06).

**Khi nào Bulletproofs vẫn tốt hơn?**

Khi relation là **thuần R1CS** (không có quadratic structure tự nhiên), dedicated Bulletproofs range proof với các tricks đặc thù vẫn có proof size nhỏ hơn một chút. Nhưng difference nhỏ và ngày càng thu hẹp nếu implement dedicated QESA variants.

---

## Summary

- **Range proof encoding**: Bit decomposition $b \in \{0,1\}^n$ với $\langle b, 2^{[n]}\rangle = v$ → $n$ QE equations $b_i(b_i-1)=0$ + 1 linear constraint → feed vào QESAZK generic.
- **Aggregate**: Extend witness $w = (b^{(1)}, \ldots, b^{(m)})$ — scaling $O(\log m)$ thêm.
- **Benchmark**: QESA generic $\approx 0.7\times$ prover runtime của Bulletproofs dedicated; $0.63\times$ với 140-bit exponents.
- **Proof size**: $O(\log n)$ cả hai, QESA có ít field elements hơn (2 vs 5).
- **Kết luận**: QESAZK **generic** đã competitive với Bulletproofs **dedicated** — tiếp tục improvement nếu có dedicated QESA range proof.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Bün18] Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions and More*, S&P 2018 (🟡 — baseline comparison; aggregate range proofs §4.2)
- QESA_ZK — Implementation: [github.com/emsec/QESA_ZK](https://github.com/emsec/QESA_ZK)
