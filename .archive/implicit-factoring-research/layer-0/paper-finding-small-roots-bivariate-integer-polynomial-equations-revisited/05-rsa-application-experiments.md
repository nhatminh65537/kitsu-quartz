---
title: "05. RSA Application & Practical Experiments"
type: attack
tags: [bivariate-small-roots, attack, lesson-05]
aliases: [RSA High Bits Factoring, Coron Experiments]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations Revisited — Jean-Sébastien Coron, Eurocrypt 2004"
created: 2026-03-26
---

> **Prerequisites**: [[03-main-algorithm-theorem-4|03. Main Algorithm: Coron's Theorem 4]], [[04-variants-comparison-extension|04. Variants, Comparison & Extension]]  
> **Lesson type**: Attack  
> **Covers**: §7 (Practical experiments), §8 (Conclusion), Theorem 6 (RSA factoring with high-bits), Appendix C (proof of Theorem 6), Figure 2 (Coron runtime), Figure 3 (HG runtime)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $N = pq$ | RSA modulus cần factor |
> | $p_0, q_0$ | Phần đã biết (high-order bits) của $p, q$ |
> | $x_0 = p - p_0,\ y_0 = q - q_0$ | Phần chưa biết (unknown remainders) |
> | $X = p_0 N^{-1/4-\varepsilon},\ Y = q_0 N^{-1/4-\varepsilon}$ | Bounds trên $x_0, y_0$ |
> | $\varepsilon > 0$ | Fraction bits dư so với threshold $1/4 \log_2 N$ |

---

## Bối cảnh: RSA và bài toán biết high bits

### Threat model

Giả sử attacker biết $N = pq$ (public) và biết **$(1/4+\varepsilon)\log_2 N$ bits cao nhất** của $p$. Điều này có thể xảy ra trong các tình huống thực tế:

- **Partial key exposure**: thiết bị bị tấn công side-channel, lộ MSBs của $p$.
- **Lattice-based cryptanalysis**: biết một phần $p$ từ các tấn công khác.
- **Weak random number generator**: bits đầu của $p$ có thể đoán được.

Mục tiêu: factor $N = pq$ hoàn toàn.

> [!warning] Attack Conditions
> Thuật toán hoạt động khi biết **ít nhất $(1/4+\varepsilon)\log_2 N$ bits cao** của $p$ (với $\varepsilon > 0$ tùy ý nhỏ).  
> Coppersmith gốc [Cop97] chỉ cần **đúng $1/4 \log_2 N$ bits** (không cần $\varepsilon$).  
> Với $N = 1024$ bits: Coron cần $> 256$ bits; Coppersmith cần $\geq 256$ bits.

---

## Theorem 6 — RSA Factoring với High Bits

> [!abstract] Theorem 6 — Factoring với $(1/4+\varepsilon)\log_2 N$ bits của $p$
> Với mọi $\varepsilon > 0$: cho $N = pq$ và biết $(1/4+\varepsilon)\log_2 N$ bits cao nhất của $p$, ta có thể khôi phục factorization của $N$ trong thời gian đa thức theo $\log N$.

### Proof (Appendix C)

**Setup:**

Biết $(1/4+\varepsilon)\log_2 N$ bits cao của $p$ → suy ra $p_0$ (known approximation of $p$).

Vì $pq = N$ nên biết $(1/4+\varepsilon)\log_2 N$ bits cao của $q$ tương ứng ($q_0 \approx N/p_0$).

Viết:

$$
p = p_0 + x_0 \qquad q = q_0 + y_0
$$

với bounds:

$$
|x_0| < p_0 N^{-1/4-\varepsilon} = X \qquad |y_0| < q_0 N^{-1/4-\varepsilon} = Y
$$

**Xây polynomial:**

$$
p(x,y) = (p_0+x)(q_0+y) - N = (p_0 q_0 - N) + q_0 x + p_0 y + xy
$$

Đây là polynomial bilinear ($\delta=1$, max degree 1 theo từng biến), và $p(x_0, y_0) = 0$.

**Tính $W$:**

$$
W = \max\bigl(|p_0 q_0 - N|,\ q_0 X,\ p_0 Y,\ XY\bigr)
$$

Do $q_0 \approx N/p_0$ và $X = p_0 N^{-1/4-\varepsilon}$:

$$
q_0 X \approx \frac{N}{p_0} \cdot p_0 N^{-1/4-\varepsilon} = N^{3/4-\varepsilon}
$$

Do đó $W > q_0 X > \frac{1}{2} N^{3/4-\varepsilon}$.

**Kiểm tra điều kiện Theorem 4:**

$$
XY = p_0 q_0 N^{-1/2-2\varepsilon} < N^{1/2-2\varepsilon}
$$

Và:

$$
W^{2/3} > \left(\frac{1}{2} N^{3/4-\varepsilon}\right)^{2/3} = \frac{1}{2^{2/3}} N^{1/2-2\varepsilon/3}
$$

So sánh: $XY < N^{1/2-2\varepsilon}$ và $W^{2/3} \approx N^{1/2-2\varepsilon/3}$.

Ta cần $XY < W^{2/3-\varepsilon'}$ cho một $\varepsilon' > 0$. Vì $1/2-2\varepsilon < 1/2-2\varepsilon/3$ (với $\varepsilon > 0$), điều này thoả mãn (bằng cách chọn $\varepsilon'$ nhỏ phù hợp).

Cụ thể: đoán thêm 1 bit của $x_0$ để đảm bảo $XY < 2W^{2/3-\varepsilon}$, rồi áp dụng Theorem 4. $\blacksquare$

> [!tip] 💡 Agent note
> Trick "đoán thêm 1 bit" trong proof là một kỹ thuật chuẩn trong cryptanalysis — thay vì cần điều kiện chính xác, ta thử 2 khả năng (bit = 0 hoặc 1) và run algorithm với cả hai. Đây là reason tại sao proof nói "by guessing one additional bit of $x_0$".

---

## §7 — Kết quả Thực nghiệm

### Figure 2: Runtime của Coron's Algorithm

| $N$ | Bits của $p$ cho | Kích thước lattice | Runtime |
|-----|------------------|--------------------|---------|
| 512 bits | 144 bits | 25 | 35 giây |
| 512 bits | 141 bits | 36 | 3 phút |
| 1024 bits | 282 bits | 36 | 20 phút |

*Triển khai bằng NTL library [ShoNTL] trên PC 733 MHz chạy Linux.*

### Figure 3: Runtime của Howgrave-Graham Algorithm (so sánh)

| $N$ | Bits của $p$ cho | Kích thước lattice | Runtime |
|-----|------------------|--------------------|---------|
| 1024 bits | 282 bits | **11** | **1 giây** |
| 1024 bits | 266 bits | 25 | 1 phút |
| 1536 bits | 396 bits | 33 | 19 phút |

### Phân tích kết quả

**Nhận xét 1 — Lattice dimension là bottleneck chính:**

Với 1024-bit RSA biết 282 bits của $p$:
- Coron: lattice 36×36 → **20 phút**
- HG: lattice **11×11** → **1 giây**

Chênh lệch **20 phút vs 1 giây** (1200x) đến từ kích thước lattice: LLL runtime $\sim O(\omega^5)$ theo dimension, nên 36×36 vs 11×11 là $(36/11)^5 \approx 400\times$ về lý thuyết — consistent với thực nghiệm.

> [!info] 🟡 Howgrave-Graham Special Case (HG97)
> HG [HG97] đã đơn giản hóa case đặc biệt **factoring với high-bits known** về một bài toán univariate (không phải bivariate), cho lattice nhỏ hơn nhiều. Nhưng simplification của HG **không generalize** sang bivariate integer equations tổng quát — đó là lý do paper của Coron ra đời.
>
> *(theo [HG97]: Howgrave-Graham — Finding small roots of univariate modular equations revisited, 1997)*

**Nhận xét 2 — Tradeoff giữa bits cho và lattice dimension:**

| 512-bit N | 144 bits → dim 25 (35s) | 141 bits → dim 36 (3 phút) |
|-----------|-------------------------|---------------------------|
| Cần ít bits hơn | Lattice lớn hơn nhiều | Runtime tăng 5x |

Đây thể hiện tradeoff: giảm số bits cần biết (tức là $\varepsilon$ nhỏ hơn) đòi hỏi $k$ lớn hơn → lattice lớn hơn → runtime chậm hơn nhiều.

**Nhận xét 3 — Thực tế có thể dùng được:**

Thuật toán Coron cho RSA 512 bits (35 giây, 3 phút) là hoàn toàn thực tế, dù chậm hơn HG. Với RSA 1024 bits, 20 phút là acceptable trong context offline cryptanalysis.

> [!example] Ví dụ tấn công thực tế
> Giả sử một HSM (Hardware Security Module) rò rỉ 300 bits cao của prime $p$ trong RSA-1024 qua side-channel. Attacker có $N$ (public) và 300 bits của $p$ ($300 > 256 = 1/4 \times 1024$, nên $\varepsilon = 44/1024 \approx 0.043$).
>
> Theo Figure 2 nội suy: lattice dimension khoảng 25–36, runtime vài phút đến 20 phút trên hardware hiện đại. Với CPU 2026 (~1000x nhanh hơn 733 MHz), runtime < 1 giây — hoàn toàn feasible.

---

## §8 — Kết luận (Conclusion)

Paper đạt được mục tiêu đặt ra:

**Kết quả chính:**
- Thuật toán mới cho bivariate integer polynomial small roots, đơn giản hơn Coppersmith.
- Full-rank triangular lattice → det trivially tính, improved bounds dễ derive.
- Đổi mới có thể mở rộng: heuristic extension sang 3+ biến, dễ thực hiện hơn.

**Đánh đổi chấp nhận được:**
- Bound yếu hơn: $XY < W^{2/(3\delta)-\varepsilon}$ thay vì $W^{2/(3\delta)}$.
- Runtime chậm hơn HG trong case factoring với high-bits (do lattice dimension lớn hơn).

**Vị trí trong lịch sử:**
- Coppersmith 1996: kết quả đột phá, khó hiểu.
- HG 1997: đơn giản hóa **univariate modular** (không phải bivariate).
- **Coron 2004**: đơn giản hóa **bivariate integer** — hoàn thiện bức tranh.

> [!tip] 💡 Agent note — Ứng dụng trong Bug Bounty (zkVerify context)
> Coppersmith/Coron attacks trên bivariate equations xuất hiện trong nhiều lớp tấn công cryptographic:
>
> 1. **RSA partial information**: nếu một ZK circuit expose partial information về primes (ví dụ MSBs của witness), Coron's attack áp dụng trực tiếp.
> 2. **ECDSA nonce leak**: nếu biết MSBs của nonce $k$ trong ECDSA, bài toán lattice tương tự phát sinh.
> 3. **Polynomial commitment với known structure**: nếu witness polynomial có structure biết trước, có thể formulate bivariate equation và attack.
>
> Trong zkVerify context: các proof systems thường không leak explicit bits, nhưng implementation bugs (như wrong field arithmetic, inconsistent constraint encoding) đôi khi tạo ra "effective partial information" → bivariate attack opportunities.

---

## Summary

- **Theorem 6**: Biết $(1/4+\varepsilon)\log_2 N$ bits cao của $p$ → factor $N=pq$ polynomial-time. Proof dùng $p(x,y) = (p_0+x)(q_0+y)-N$, kiểm tra $XY < W^{2/3-\varepsilon}$.
- **Thực nghiệm**: Coron's algorithm chạy được trong thực tế (35s – 20 phút cho RSA 512–1024 bit); HG nhanh hơn 1200x trong case đặc biệt này do lattice nhỏ hơn nhiều.
- **Takeaway cho practitioner**: Dùng HG cho factoring với high-bits; dùng Coron cho bivariate equations tổng quát khác.
- **Coppersmith attacks** vẫn relevant với ZK/cryptographic bug hunting khi implementation tạo ra partial information về secret witnesses.

---

## References

- [Cop97] Coppersmith — *Small solutions to polynomial equations*, J. Cryptology 1997 (🟡 Theorem 2 bound reference)
- [HG97] Howgrave-Graham — *Finding small roots of univariate modular equations revisited*, Cryptography and Coding 1997 (🟡 HG algorithm comparison)
- [ShoNTL] Shoup — *Number Theory C++ Library (NTL) version 5.3.1* (⚪ implementation tool)
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, 1982 (🔴 Prerequisite)
