---
title: "07. SNARK Applications and Implementation"
type: deep-dive
tags: [mimc, snark, r1cs, zk-proof, side-channel, masking, implementation, lesson-07]
aliases: [MiMC SNARK, MiMC Implementation, R1CS MiMC]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[01-mimc-motivation|01. MPC/FHE/ZK Motivation]], [[02-mimc-block-cipher|02. MiMC Block Cipher]], khái niệm arithmetic circuit, polynomial evaluation, fast exponentiation  
> 🔴 **Prerequisite references**: Menezes et al. — *HAC* [MVO96] (finite field multiplication algorithms)  
> **Lesson type**: Deep Dive  
> **Covers**: §6.1 (SNARK — Definition 1, 2, MiMC vs LowMC, Table 3), §6.2 (direct implementation, Table 4), §6.3 (higher-order masking, CGPQR), §7 (Conclusions)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathbb{F}$ | Trường nền của arithmetic circuit | $\mathbb{F}$ |
> | $C : \mathbb{F}^n \times \mathbb{F}^h \to \mathbb{F}^l$ | Arithmetic circuit với $n$ inputs, $h$ witnesses, $l$ outputs | $C$ |
> | $N_c$ | Số rank-1 constraints trong R1CS | $N_c$ |
> | $N_0$ | Số biến (variables) trong R1CS | $N_0$ |
> | $w \in \mathbb{F}^{N_0}$ | Witness vector | $w$ |
> | $(A_i, B_i, C_i)$ | Tuple mô tả constraint thứ $i$ trong R1CS | $(A_i, B_i, C_i)$ |
> | $\langle \cdot, \cdot \rangle$ | Inner product trong $\mathbb{F}^{N_0+1}$ | $\langle \cdot, \cdot \rangle$ |
> | $R, m$ | Số rounds và số Sboxes/round trong LowMC | $R, m$ |
> | $t$ | Masking order (số-1 shares) | $t$ |

---

## Context

Lessons trước đã phân tích MiMC về mặt thiết kế và bảo mật. Lesson này trả lời câu hỏi thực tiễn: **MiMC hoạt động tốt như thế nào trong ứng dụng SNARK cụ thể, và trade-off implementation là gì?**

Paper báo cáo kết quả benchmark so sánh MiMC với SHA-256 và LowMC trong SNARK setting — đây là phần kiểm chứng thực nghiệm trung tâm của toàn bộ paper.

---

## §6.1 — Verifiable Computation và SNARK

### SNARK là gì và tại sao multiplication dominates

> [!info] 🟡 SNARK for C [BSCG+13]
> Ben-Sasson, Chiesa, Genkin, Tromer, Virza (CRYPTO 2013) xây dựng một SNARK system cho **arithmetic circuit satisfiability**. Idea cốt lõi: bất kỳ tính toán nào cũng có thể encode thành hệ **rank-1 quadratic constraints** (R1CS) trên một trường $\mathbb{F}$. Prover chứng minh biết một witness thỏa mãn hệ mà không tiết lộ witness.
>
> Complexity của prover algorithm: $O(N_c \log N_c)$ trong đó $N_c$ là số constraints — tức **số multiplication gates trong circuit trực tiếp quyết định prover time**.
>
> *(theo [BSCG+13]: Ben-Sasson et al. — SNARKs for C, CRYPTO 2013)*

**Ứng dụng thực tế**: Zerocash [BCG+14] dùng SNARK để prove tính hợp lệ của transaction mà không tiết lộ amount hoặc địa chỉ. Primitive crypto cần thiết trong circuit chính là **hash function** — và SHA-256 trong SNARK circuit là bottleneck hiệu suất chính.

### Arithmetic Circuit Satisfiability (Definition 1)

> [!note] Definition 1 — Arithmetic Circuit Satisfiability (ACS)
> Cho trường $\mathbb{F}$ và circuit $C : \mathbb{F}^n \times \mathbb{F}^h \to \mathbb{F}^l$ gồm **bilinear gates** (cộng và nhân). ACS problem được mô tả bởi relation:
>
> $$
> \mathcal{R} = \{(x, a) \in \mathbb{F}^n \times \mathbb{F}^h : C(x, a) = 0^l\}
> $$
>
> Language tương ứng:
>
> $$
> \mathcal{L} = \{x \in \mathbb{F}^n : \exists\, a \in \mathbb{F}^h \text{ s.t. } C(x, a) = 0^l\}
> $$
>
> SNARK cho phép prover chứng minh $x \in \mathcal{L}$ (biết witness $a$) mà không tiết lộ $a$.

**Điểm quan trọng**: Circuit chỉ gồm bilinear gates — mỗi gate thực hiện một multiplication trong $\mathbb{F}$. Phép cộng là "free" (không tạo ra gate riêng). Do đó, **tối thiểu số multiplication gates = tối thiểu circuit size = tối thiểu prover time**.

### Rank-1 Constraint System — R1CS (Definition 2)

> [!note] Definition 2 — Rank-1 Quadratic Constraint System (R1CS)
> Một **R1CS** trên trường $\mathbb{F}$ là một chuỗi tuples $((A_i, B_i, C_i),\, n)$ với $A_i, B_i, C_i \in \mathbb{F}^{1+N_0}$ cho $i = 1, \ldots, N_c$ và $n \leq N_0$.
>
> R1CS **satisfiable** với input $x \in \mathbb{F}^n$ nếu tồn tại witness $w \in \mathbb{F}^{N_0}$ sao cho:
>
> $$
> \langle A_i, w \rangle \cdot \langle B_i, w \rangle = \langle C_i, w \rangle \quad \forall\, i = 1, \ldots, N_c
> $$
>
> - $N_c$: số constraints (**= số multiplication gates**)
> - $N_0$: số biến (witness size)

Mỗi multiplication $a \cdot b = c$ trong circuit tạo ra đúng **1 rank-1 constraint**: $\langle A_i, w \rangle \cdot \langle B_i, w \rangle = \langle C_i, w \rangle$ với $w$ encode $a$, $b$, $c$.

### MiMC trong SNARK Setting

Mỗi round của MiMC tính $x_{i+1} = (x_i \oplus k \oplus c_i)^3$. Đặt $\alpha = x_i \oplus k \oplus c_i$:

$$
\alpha + U = 0 \quad \text{(linear — free)}
$$

$$
U \cdot U = Y \quad \text{(constraint 1: squaring)}
$$

$$
Y \cdot U = Z \quad \text{(constraint 2: multiply by } U)
$$

Hai constraints này encode $Z = \alpha^3$. Tuy nhiên, chúng có thể **combine** thành một constraint duy nhất:

$$
(x_i + \alpha)(x_i + \alpha + Y) = Y + Z \quad \text{(1 rank-1 constraint per round)}
$$

> [!abstract] Claim 7.1 — R1CS complexity của MiMC
> - **Số constraints**: $N_c = R$ (1 constraint/round, sau combining)
> - **Số witness variables**: $N_0 = 2R$ (2 intermediate variables/round: $Y$ và $Z$)
> - Với MiMCHash-256 ($n = 1025$, $R = \lceil 1025/\log_2 3 \rceil \approx 646$): $N_c = 646$, $N_0 = 1293$
> - **Prover time** dominated bởi $O(N_c \log N_c) \approx O(646 \cdot 10) \approx 6460$ operations

### LowMC trong SNARK Setting — Comparison

> [!info] 🟡 LowMC SNARK Constraints [ARS+15]
> Mỗi 3-bit Sbox của LowMC tạo ra **2 rank-1 constraints** sau combining:
>
> $$
> b \cdot c = a + z_1 \quad \text{(constraint 1)}
> $$
> $$
> a \cdot (b + c) = c + z_2 + z_3 \quad \text{(constraint 2)}
> $$
>
> Với $m$ Sboxes/round và $R$ rounds: tổng $N_c = 2mR$ constraints. Linear layer của LowMC tạo thêm rất nhiều additions (XOR), không tính là constraints nhưng contribute vào witness generation time.
>
> *(theo [ARS+15]: Albrecht et al. — Ciphers for MPC and FHE, EUROCRYPT 2015)*

**Benchmark thực nghiệm (Table 3 của paper)** — Block size 1025 bits, SHA-256 security:

| Primitive | $R$ | $m$ | Total time | Constraint gen | Witness gen | Additions | Multiplications | Constraints |
|-----------|-----|-----|-----------|----------------|-------------|-----------|-----------------|-------------|
| **MiMCHash-256** | 646 | — | **7.8 ms** | 6.3 ms | 1.5 ms | 646 | 1293 | 646 |
| LowMC ($R=16$, $m=196$) | 16 | 196 | 90.3 ms | 13.5 ms | 76.8 ms | 8,420,888 | 9,408 | 4,704 |
| LowMC ($R=55$, $m=20$) | 55 | 20 | 271.2 ms | 9.2 ms | 262.0 ms | 28,894,643 | 3,300 | 2,200 |

*(Intel Core i7 2.10 GHz, 16 GB RAM, gcc -O3, libsnark, average over ~2000 repetitions)*

**Phân tích kết quả**:

- MiMCHash-256 nhanh hơn LowMC ($R=16$) **~11.6×** và nhanh hơn LowMC ($R=55$) **~34.8×**.
- MiMCHash-256 nhanh hơn SHA-256 (73 ms theo [BCG+14]) **~9.4×**.
- LowMC có ít multiplications hơn MiMC (~9408 vs 1293) nhưng **8 triệu XOR additions** làm witness generation cực kỳ chậm (76.8 ms vs 1.5 ms).

> [!warning] Bài học từ LowMC vs MiMC trong SNARK
> Metric "số AND gates" hoặc "số multiplications" không đủ để dự đoán SNARK performance. LowMC tối ưu AND nhưng số XOR lớn đến mức **không còn negligible** — và trong thực tế làm witness generation chậm hơn MiMC nhiều lần. Đây là bài học quan trọng về việc chọn metric phù hợp với ứng dụng mục tiêu.

---

## §6.2 — Direct Implementation

Paper cũng cung cấp phân tích complexity cho **direct implementation** (không phải SNARK context) — quan trọng cho ứng dụng MPC và FHE trực tiếp.

### Thuật toán Field Multiplication

Trong direct implementation, bottleneck là tính $x^3 = x^2 \cdot x$ trong $\mathbb{F}_{2^n}$ với $n$ lớn (e.g., $n = 1025$). Không thể dùng lookup table vì kích thước $n$ quá lớn (25 GB với $b = w = 32$). Các thuật toán trong literature:

**Table 4 của paper** — Complexity các thuật toán field multiplication:

| Thuật toán | XORs | ADD/SUB/SHIFT/AND | Lookup table size | Truy cập table |
|-----------|------|-------------------|------------------|----------------|
| [HMV93] | $2g^2$ | $\frac{g^2}{2}(\frac{3}{2} - \frac{1}{2(2^b-1)})$ | $2b \cdot 2^b$ | $3g^2$ |
| [GP97] | $\frac{6g}{\log 3} - 8g + 2$ | $g^{\log 3}$ | $2b \cdot 2^b$ | $3g^{\log 3}$ |
| [KA98] | $4g^2$ | — | $(2^b-1)^2 \cdot 2^b$ | $2g^2 + g$ |
| [Has00] | $\frac{1}{2}(g+1)(b+3) - 4$ | $d\frac{n}{w}e \cdot (g-1)\frac{n}{w} + 4g-2$ | $(b+d) \cdot 2^b \cdot (g-1)\frac{b+d}{w}$ | nhỏ |

trong đó $g = \lceil n/b \rceil$ (số groups), $b$ = internal data path size, $d$ = degree của second highest monomial trong irreducible polynomial, $w$ = word size.

**Thuật toán tốt nhất cho MiMC**: [Has00] (Hasan 2000) vì cho phép $b < w$ — tránh lookup table quá lớn — và không yêu cầu $n$ là bội của $b$.

> [!tip] 💡 Agent note
> Paper nhấn mạnh direct implementation "có tác động hạn chế đến performance trên target platforms" của MiMC (MPC/FHE/SNARK). Phần §6.2 được cung cấp "for completeness" — ứng dụng chính của MiMC không phải là software encryption thông thường mà là circuit-based evaluation.

---

## §6.3 — Generic Masking chống Side-Channel Attack

### Higher-Order Masking là gì

**Side-channel attacks** khai thác physical leakage (power consumption, EM emission) trong quá trình thực thi để recover sensitive variables (e.g., secret key). **Masking** là kỹ thuật phổ biến nhất để ngăn chặn: split mỗi sensitive variable $x$ thành $t+1$ shares $x_0, x_1, \ldots, x_t$ sao cho $x = \bigoplus_{i=0}^t x_i$, và tính toán trên các shares riêng biệt.

Với masking order $t$: complexity của side-channel attack tăng exponentially theo $t$ (cần $\binom{n}{t+1}$ probes).

### CGPQR Masking Scheme

> [!info] 🟡 CGPQR Higher-Order Masking [CGP+12]
> Carlet, Goubin, Prouff, Quisquater, Rivain (FSE 2012) đề xuất scheme mask S-box tổng quát bằng cách evaluate polynomial representation của S-box trên shares. Với S-box $f : \mathbb{F}_{2^n} \to \mathbb{F}_{2^n}$ (biểu diễn bởi polynomial của degree $d$):
>
> - **Linear operations** ($+$, scalar multiply, squaring): $O(t)$ operations
> - **Non-linear multiplication** ($\cdot$): $O(t^2)$ operations
>
> Do đó, minimizing số regular multiplications trong evaluation = minimizing masking cost.
>
> *(theo [CGP+12]: Carlet, Goubin, Prouff, Quisquater, Rivain — Higher-order masking schemes for S-boxes, FSE 2012)*

### Tại sao MiMC tối ưu cho CGPQR

Trong mỗi round, MiMC evaluate $x^3 = x^2 \cdot x$. Trong $\mathbb{F}_{2^n}$:

- $x \mapsto x^2$: **tuyến tính** (Frobenius) → $O(t)$ operations với CGPQR
- $x^2 \cdot x$: **1 regular multiplication** → $O(t^2)$ operations

**Tổng cost per round**: $O(t^2)$ (từ 1 multiplication) + $O(t)$ (linear ops) = $O(t^2)$.

So sánh với AES S-box (degree 254 trong $\mathbb{F}_{2^8}$): cần nhiều multiplications hơn, mỗi cái $O(t^2)$ → tổng cost cao hơn nhiều.

> [!abstract] Claim 7.2 — Masking efficiency của MiMC
> MiMC minimize số regular multiplications per round (1 multiplication trên $\mathbb{F}_{2^n}$) → minimize CGPQR masking cost. Với masking order $t$, mỗi round của MiMC cần $O(t^2)$ masked operations — tối thiểu có thể cho một non-linear function.

---

## §7 — Conclusions

Paper kết lại với ba điểm chính:

**1. Resurrection của thiết kế 20 năm tuổi**: MiMC lấy lại idea của KN cipher (1995) và PURE cipher (1997) — đã bị cho là "không serious" trong textbooks [KR11]. Paper chứng minh với số rounds đủ lớn (~100 thay vì ~10), design này **competitive và bảo mật**.

**2. Hai application contexts khác nhau, cùng một conclusion**:

| Context | Metric chính | Kết quả |
|---------|-------------|---------|
| SNARKs | $N_c$ (constraints) | MiMCHash-256 nhanh hơn SHA-256 **~9×**, hơn LowMC **~12–35×** |
| MPC (follow-up [GRR+16]) | Throughput online phase | MiMC nhanh hơn AES **>10×** online, **~6×** offline |

**3. Lesson về metrics**: LowMC có ít AND gates hơn MiMC, nhưng vô số XOR làm nó chậm hơn trong cả hai contexts. Đây là bằng chứng rõ ràng rằng **single-metric optimization có thể misleading** — metric phải match với application.

> [!tip] 💡 Agent note
> MiMC và các biến thể của nó (Poseidon, Rescue, Neptun, Griffin) đã trở thành cả một research direction: "arithmetic-friendly" hay "SNARK-friendly" hash functions. MiMC là tổ tiên của family này và paper 2016 được trích dẫn rộng rãi trong ZK-proof ecosystem (Ethereum, StarkWare, Zcash).

---

## Summary

- **Definition 1** (ACS): mô tả bài toán circuit satisfiability — nền tảng của SNARK.
- **Definition 2** (R1CS): mỗi multiplication → 1 constraint; cộng là free. Prover time $O(N_c \log N_c)$.
- **MiMC trong SNARK**: 1 constraint/round (sau combining), 2 witness variables/round. MiMCHash-256: $N_c = 646$, total time **7.8 ms**.
- **LowMC comparison**: ít multiplications hơn nhưng 8M+ XORs → witness gen chậm **51×**. Metric AND count không predict SNARK performance.
- **Direct implementation**: Field multiplication qua lookup-table algorithms. [Has00] tốt nhất cho $n$ lớn không bội của $w$.
- **CGPQR masking**: MiMC tối ưu cho higher-order masking vì chỉ 1 regular multiplication/round → cost $O(t^2)$ per round.
- **Conclusions**: MiMC competitive trong cả SNARK và MPC. Khai phục thiết kế 20 năm tuổi; mở ra hướng arithmetic-friendly primitives.

---

## References

- [BSCG+13] Ben-Sasson, Chiesa, Genkin, Tromer, Virza — *SNARKs for C*, CRYPTO 2013 (🟡 Integrated)
- [ARS+15] Albrecht, Rechberger et al. — *Ciphers for MPC and FHE*, EUROCRYPT 2015 (🟡 Integrated — LowMC constraints)
- [CGP+12] Carlet, Goubin, Prouff, Quisquater, Rivain — *Higher-order masking schemes for S-boxes*, FSE 2012 (🟡 Integrated)
- [BCG+14] Ben-Sasson et al. — *Zerocash*, IEEE S&P 2014 (⚪)
- [GRR+16] Grassi, Rechberger, Rotaru, Scholl, Smart — *MPC-Friendly Symmetric Key Primitives*, CCS 2016 (⚪)
- [KR11] Knudsen, Robshaw — *The Block Cipher Companion*, Springer 2011 (⚪)
- [HMV93] Harper, Menezes, Vanstone — *Public-key cryptosystems with very small key lengths*, EUROCRYPT 1992 (⚪)
- [GP97] Guajardo, Paar — *Efficient algorithms for EC cryptosystems*, CRYPTO 1997 (⚪)
- [KA98] Koc, Acar — *Montgomery Multiplication in GF($2^k$)*, DCC 1998 (⚪)
- [Has00] Hasan — *Look-up table-based large finite field multiplication*, IEEE Trans. Comput. 2000 (⚪)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite)
