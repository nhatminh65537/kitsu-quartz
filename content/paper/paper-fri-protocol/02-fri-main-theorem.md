---
title: "02. FRI Main Theorem & Complexity"
type: foundation
tags: [fri-protocol, foundation, lesson-02]
aliases: [FRI Theorem, FRI Complexity, Theorem 2]
source: "Fast Reed-Solomon Interactive Oracle Proofs of Proximity — Ben-Sasson, Bentov, Horesh, Riabzev, ICALP 2018"
created: 2026-03-15
---

> **Prerequisites**: [[01-rs-iopp-foundations|01. RS Codes & IOPP Foundations]] — định nghĩa RS code, IOPP, soundness function $s^-(\delta)$  
> 🔴 **Prerequisite references**: Ben-Sasson, Sudan — *Short PCPs with polylog query complexity* [BS08] (quasilinear PCPP mà FRI xây dựng lên)  
> **Lesson type**: Foundation  
> **Covers**: §1.1.3 (Theorem 2 — FRI properties), Conjecture 3, Remark (space complexity), Remark (smooth codes), Remark (computational model)
>
> **Notation**
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | $N = \lvert S \rvert$ | Block-length — kích thước evaluation set | Bằng input length của prover |
> | $\rho = 2^{-R}$ | Code rate, $R \geq 2$, $R \in \mathbb{N}$ | Trong Theorem 2 |
> | $R$ | Rate exponent, $\rho N > 16$ | Số rounds $\leq \log N / 2$ |
> | $\mathbb{F}_q$ | Finite field cỡ $q$ | Paper ký hiệu $F_q$ |
> | Binary field | $\mathbb{F}_q$ với $q = 2^m$, $m \in \mathbb{N}$ | Characteristic 2 |
> | $L^{(0)}$ | Evaluation domain — additive coset trong binary field | $L^{(0)} \subseteq \mathbb{F}_q$ |
> | Additive coset | Coset của subgroup của $(\mathbb{F}_q, +)$ | Coset của $\mathbb{F}_2$-linear space |
> | $H \subset \mathbb{F}_q^*$ | Smooth multiplicative group | $\lvert H \rvert = 2^k$, $k \in \mathbb{N}$ |
> | $\delta_0$ | Soundness radius — giới hạn của soundness | $\delta_0 \geq \frac{1}{4}(1 - 3\rho) - \frac{1}{\sqrt{N}}$ |
> | PRAM/CREW | Parallel RAM với Common Read, Exclusive Write | Model parallelization |

---

## Motivation

Theorem 2 là kết quả trung tâm của toàn bộ paper. Trước khi đi vào chi tiết kỹ thuật của FRI protocol (sẽ làm ở L03–L04), bài này phát biểu **chính xác** FRI đạt được cái gì và với hằng số bao nhiêu.

Tại sao cần một lesson riêng cho theorem statement? Vì Theorem 2 chứa nhiều điểm tinh tế:
1. Giới hạn soundness $\delta_0$ không phải là $1 - \rho$ (đó là Conjecture 3).
2. Verifier complexity "$\leq 21 \log N$" là **arithmetic complexity** — không phải bit complexity.
3. Parallelization property có hậu quả thực tế quan trọng cho space complexity.
4. Hai family codes (binary additive vs. smooth multiplicative) cần xử lý hơi khác nhau.

---

## 1. Hai Family Codes mà FRI Áp Dụng

Theorem 2 được phát biểu cho **binary additive RS codes**, nhưng paper cũng chỉ rõ FRI hoạt động cho **smooth RS codes**.

> [!note] Definition 2.1 — Binary Additive RS Code
> Field $F$ là **binary** nếu $\lvert F \rvert = 2^m$ với $m \in \mathbb{N}$ (characteristic 2).  
> Tập $S \subseteq F$ là **additive coset** nếu $S$ là coset của một subgroup của $(F, +)$, tức là $S$ là affine shift của một $\mathbb{F}_2$-linear space $V \subseteq F$: $S = a + V$ với $a \in F$.
>
> **Binary additive RS code family** là tập tất cả $\mathsf{RS}[F, S, \rho]$ trong đó $F$ là binary field và $S$ là additive coset.

> [!note] Definition 2.2 — Smooth RS Code
> Nhóm $H \subset \mathbb{F}_q^*$ được gọi là **smooth** nếu $\lvert H \rvert = 2^k$ với $k \in \mathbb{N}$ (nhóm nhân bậc lũy thừa 2).
>
> **Smooth RS code family** là tập tất cả $\mathsf{RS}[\mathbb{F}_q, H, \rho]$ trong đó $H$ là smooth multiplicative group.

> [!tip] 💡 Agent note
> Tại sao hai family? FRI cần domain $S$ có cấu trúc đặc biệt để thực hiện degree-folding (sẽ giải thích ở L03). Trong binary additive setting, cấu trúc affine space cho phép dùng *linearized polynomials* (affine subspace polynomials). Trong smooth multiplicative setting, cấu trúc nhóm nhân cho phép dùng $q^{(0)}(X) = X^2$. Đây là hai "hương vị" của cùng một ý tưởng. Paper [10] (full version) trình bày chi tiết cho smooth case; ICALP version tập trung vào binary additive case.

---

## 2. Main Theorem — FRI Properties

> [!abstract] Theorem 2 — FRI IOPP Properties (Main Result)
> **Binary additive RS code family** với rate $\rho = 2^{-R}$, $R \geq 2$, $R \in \mathbb{N}$, $\rho N > 16$, có một IOPP (gọi là **FRI**) với $N = \lvert S \rvert$ và các properties sau:
>
> **(1) Prover Complexity**:
> - Arithmetic complexity: $< 6N$ phép toán trên $F$
> - Proof length: $< N/3$ field elements
> - Round complexity: $\leq \log N / 2$ rounds
>
> **(2) Verifier Complexity**:
> - Query complexity: $2 \log N$ queries
> - Decision complexity: $\leq 21 \log N$ arithmetic operations trên $F$
>
> **(3) Soundness**: Tồn tại hằng số
> $$
> \delta_0 \geq \frac{1}{4}(1 - 3\rho) - \frac{1}{\sqrt{N}}
> $$
> sao cho với mọi $f$ là $\delta$-far từ code (theo relative Hamming distance), xác suất reject:
> $$
> \Pr[\text{reject}] \geq \min\{\delta,\; \delta_0\} - \frac{3N}{\lvert F \rvert}
> $$
>
> **(4) Parallelization**: Mỗi oracle message của prover có thể tính trong thời gian $O(1)$ trên PRAM CREW với unit-time arithmetic.

Đây là kết quả đột phá: **prover $O(N)$ và verifier $O(\log N)$ đồng thời**, với hằng số tường minh $6$ và $21$.

### Giải thích từng property

**Prover complexity $< 6N$**: Prover làm một lượng công việc *tuyến tính* trong kích thước codeword. So sánh: FFT cũng xử lý $N$ điểm nhưng tốn $O(N \log N)$ phép toán. FRI làm ít hơn FFT.

**Proof length $< N/3$**: Tổng độ dài $r$ oracle messages $f^{(1)}, \ldots, f^{(r)}$ nhỏ hơn $N/3$. Điều này là do mỗi message ngắn hơn message trước một hệ số: $\lvert f^{(1)} \rvert \approx N/4$, $\lvert f^{(2)} \rvert \approx N/16$, ... Tổng dãy geometric $\sum_{i=1}^{r} N/4^i < N/3$.

**Round complexity $\leq \log N / 2$**: Với $q^{(0)}$ có degree $4$ (thay vì $2$), mỗi round giảm domain size đi hệ số $4$ thay vì $2$, nên cần $\log_4 N = \log N / 2$ rounds.

**Query complexity $2 \log N$**: Mỗi round cần $2$ queries để kiểm tra *round consistency test* (xem L03). Có $\log N / 2$ rounds, nhưng các queries được dùng chung (sharing) giữa các round liền kề, cho tổng $2 \log N$.

**Decision complexity $\leq 21 \log N$**: Sau khi có query answers, verifier tính xem accept hay reject bằng $\leq 21 \log N$ phép toán số học. Đây là **arithmetic complexity**, không phải bit complexity.

**Soundness**: Nếu $f$ xa code với khoảng cách $\delta$:
- Nếu $\delta \leq \delta_0$: reject probability $\geq \delta - 3N/\lvert F \rvert$. Số hạng $3N/\lvert F \rvert$ rất nhỏ vì $\lvert F \rvert \gg N$ (paper yêu cầu $N / \lvert F \rvert < 0.001$).
- Nếu $\delta > \delta_0$: reject probability $\geq \delta_0 - 3N/\lvert F \rvert$ (bị giới hạn bởi $\delta_0$).

> [!warning] Giới hạn soundness radius $\delta_0$
> $\delta_0 \approx \frac{1}{4}(1-3\rho)$ còn khá nhỏ so với unique decoding radius $\frac{1-\rho}{2}$. Ví dụ với $\rho = 1/8$: $\delta_0 \approx \frac{1}{4} \cdot \frac{5}{8} = \frac{5}{32} \approx 0.156$, trong khi unique decoding radius $= \frac{7}{16} \approx 0.4375$. Conjecture 3 (xem dưới) đề xuất rằng $\delta_0$ thực ra có thể đẩy lên $1 - \rho$.

**Parallelization**: Ký hiệu PRAM CREW — Parallel Random Access Machine với Common Read (nhiều processor đọc cùng địa chỉ) và Exclusive Write (chỉ một processor ghi mỗi địa chỉ). Mỗi symbol của message $(i+1)$ chỉ phụ thuộc vào một số hằng các symbol của message $i$, nên toàn bộ message $(i+1)$ có thể tính song song.

---

## 3. Space Complexity

> [!abstract] Remark — Space Complexity
> Với message $i$ là input, mỗi symbol của message $(i+1)$ có thể tính với **space complexity $O(\log \lvert F \rvert)$** — đủ để lưu một hằng số field elements.

Điều này theo trực tiếp từ parallelization: mỗi symbol của message $(i+1)$ chỉ cần $O(1)$ phép toán song song, và mỗi phép toán dùng $O(\log \lvert F \rvert)$ bits để biểu diễn một field element. Hệ quả thực tế: prover có thể sinh từng oracle message *on-the-fly* mà không cần lưu toàn bộ trạng thái trung gian.

---

## 4. FRI cho Smooth Codes

> [!abstract] Remark — FRI for Smooth RS Codes
> Theorem 2 cũng đúng cho **smooth RS code family** ($H$ là smooth multiplicative group) với các hằng số prover và verifier **nhỏ hơn** $6$ và $21$.

Lý do hằng số nhỏ hơn: trong smooth multiplicative setting, polynomial $q^{(0)}(X) = X^4$ trực tiếp "fold" domain từ $H$ sang $H^4 = \{x^4 : x \in H\}$ — một subgroup nhỏ hơn. Phép tính này đơn giản hơn trường hợp binary additive (dùng linearized polynomial phức tạp hơn). Chi tiết đầy đủ trong [10] (full version).

---

## 5. Conjecture 3 — Soundness Limit

> [!abstract] Conjecture 3 — Optimal Soundness
> Soundness limit $\delta_0$ của Theorem 2 tiệm cận $1 - \rho$.  
> Cụ thể, với mọi $\delta \leq 1 - \rho$, xác suất reject của bất kỳ $f$ nào $\delta$-far khỏi RS code rate $\rho$, block-length $N$ trên $F$ là:
>
> $$
> \Pr[\text{reject}] \geq \delta - \frac{2\log N}{\sqrt{\lvert F \rvert}}
> $$

Conjecture này (Eq. 1 trong paper) có hai hệ quả lớn:

1. **Soundness đến tận $1 - \rho$**: unique decoding radius là $(1 - \rho)/2$; conjecture cho rằng FRI có soundness tốt ngay cả khi $\delta$ lớn hơn unique decoding radius, tới tận maximum distance $1 - \rho$.

2. **Additive loss nhỏ hơn**: hạng $\frac{2 \log N}{\sqrt{\lvert F \rvert}}$ thay vì $\frac{3N}{\lvert F \rvert}$ trong Theorem 2 — nhỏ hơn nhiều vì $\sqrt{\lvert F \rvert} \gg N / \log N$ trong thực tế (với $\lvert F \rvert = 2^{64}$, $\sqrt{\lvert F \rvert} = 2^{32} \approx 4.3 \times 10^9$).

> [!tip] 💡 Agent note
> Conjecture 3 được sử dụng trong [11] (ZK-STARK paper) cho các ước lượng "conjectured soundness" (đường màu xanh trong Figure 1.B). Figure 1.B của paper so sánh communication complexity dưới proven soundness (Theorem 2) và conjectured soundness (Conjecture 3) — conjecture giảm communication complexity đáng kể, đặc biệt với $\rho = 1/8$, $\delta = 7/8$.

---

## 6. Ý Nghĩa Số Học của Hằng Số

Để hình dung rõ hơn, với $N = 2^{20} \approx 10^6$ (một kích thước thực tế), $\rho = 1/8$:

| Quantity | Giá trị |
|---------|---------|
| Prover arithmetic ops | $< 6 \times 2^{20} \approx 6 \times 10^6$ |
| Proof length (field elements) | $< 2^{20}/3 \approx 350{,}000$ |
| Round complexity | $\leq \log_2(2^{20})/2 = 10$ rounds |
| Verifier queries | $2 \times 20 = 40$ queries |
| Verifier arithmetic ops | $\leq 21 \times 20 = 420$ ops |
| Soundness $\delta_0$ (proven) | $\approx \frac{1}{4}(1 - \frac{3}{8}) = \frac{5}{32} \approx 0.156$ |
| Soundness (conjectured, $\delta = 7/8$) | $\approx 7/8 - \varepsilon$ |

Verifier chỉ cần **40 queries và 420 phép toán** để kiểm tra một codeword kích thước triệu phần tử với soundness ổn định — đây là lý do FRI là nền tảng thực tế của STARKs.

---

## 7. Tóm Tắt

- **Binary additive RS code**: $F$ binary, $S$ là additive coset — family code chính của paper.
- **Smooth RS code**: $H$ là multiplicative group bậc $2^k$ — cũng có FRI với hằng số nhỏ hơn.
- **Theorem 2** — bốn properties đồng thời:
  - Prover: $< 6N$ ops, proof length $< N/3$, $\leq \log N/2$ rounds
  - Verifier: $2\log N$ queries, $\leq 21\log N$ arithmetic ops
  - Soundness: $\min\{\delta, \delta_0\} - 3N/\lvert F \rvert$ với $\delta_0 \geq \frac{1}{4}(1-3\rho) - 1/\sqrt{N}$
  - Parallelization: $O(1)$ time per message trên PRAM CREW
- **Space**: $O(\log \lvert F \rvert)$ per symbol — prover không cần lưu nhiều trạng thái.
- **Conjecture 3**: soundness có thể đẩy lên $\delta - \frac{2\log N}{\sqrt{\lvert F \rvert}}$ với $\delta \leq 1 - \rho$.

---

## References

- [BS08] Ben-Sasson, Sudan — *Short PCPs with polylog query complexity*, SICOMP 2008 (🔴 Prerequisite — quasilinear PCPP nền tảng FRI)
- [10] Ben-Sasson et al. — *Fast RS IOPP (full version)*, ECCC TR17-134, 2017 (smooth codes details, full Theorem 2 proof)
- [11] Ben-Sasson et al. — *ZK-STARK paper*, 2017 (ứng dụng Theorem 2 + Conjecture 3)
- [23] = [BS08] — xem L03 cho chi tiết quasilinear PCPP (🟡 sẽ integrate ở L03)
