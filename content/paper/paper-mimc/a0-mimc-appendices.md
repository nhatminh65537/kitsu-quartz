---
title: "A0. SNARK Prover and Restricted Security Analysis"
type: deep-dive
tags: [mimc, snark-prover, fft, restricted-complexity, memory-constraint, appendix]
aliases: [MiMC Appendix, MiMC SNARK Prover, MiMC Restricted Security]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[07-mimc-snark-impl|07. SNARK & Implementation]], [[04-mimc-algebraic-attacks|04. Algebraic Attacks]], FFT basics, Lagrange polynomial interpolation  
> **Lesson type**: Deep Dive (Appendix)  
> **Covers**: Appendix A — SNARK prover algorithm (A.1 complexity, A.2 MiMCHash-256 parameters), Appendix B — restricted complexity analysis (restriction on pairs, restriction on memory), Appendix C — SNARK benchmark experiments (Figure 2, Figure 3)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $N$ | Kích thước của multiplicative subgroup dùng trong FFT của prover | $N$ |
> | $\omega$ | $N$-th root of unity trong $\mathbb{F}$ | $\omega$ |
> | $X = \{\alpha_1, \ldots, \alpha_N\}$ | Evaluation domain ($\alpha_i = \omega^{i-1}$) | $X$ |
> | $F(z), G(z), H(z)$ | Polynomials bậc $N$ encode hệ R1CS | $F, G, H$ |
> | $Q(z)$ | Quotient polynomial: $Q = (FG - H)/U$ | $Q$ |
> | $U(z) = z^N - 1$ | Vanishing polynomial của domain $X$ | $U$ |
> | $\delta_1, \delta_2, \delta_3$ | Random blinding factors trong prover | $\delta_1, \delta_2, \delta_3$ |
> | $2^m$ | Số pairs plaintext-ciphertext có sẵn (restricted setting) | $2^m$ |

---

## Appendix A — SNARK Prover Algorithm

### A.1 — Complexity của Prover

Lesson 07 giải thích rằng prover của SNARK (theo [BSCG+13]) có complexity $O(N_c \log N_c)$ trong đó $N_c$ là số constraints. Appendix A phân tích chi tiết hơn cơ chế hoạt động.

**Cấu trúc prover**: Cho R1CS với $N_c$ constraints và $N_0$ variables, prover cần:

> [!note] Algorithm A.1 — SNARK Prover (theo [BSCG+13])
> **Input**: Input $x \in \mathbb{F}^n$, witness $w \in \mathbb{F}^{N_0}$ sao cho $(x, w) \in \mathcal{R}$; evaluation domain $X = \{\alpha_1, \ldots, \alpha_N\}$ với $\alpha_i = \omega^{i-1}$ và $\omega$ là $N$-th root of unity
>
> **$\mathsf{Prove}(x, w)$**:
>
> **Bước 1 — Random blinding**: Chọn $\delta_1, \delta_2, \delta_3 \stackrel{R}{\leftarrow} \mathbb{F}$
>
> **Bước 2 — Construct polynomials** ($F, G, H$ bậc $N$):
>
> $$
> F(z) = F_0(z) + \sum_{i=1}^{N_0} w_i F_i(z) + \delta_1 U(z)
> $$
>
> $$
> G(z) = G_0(z) + \sum_{i=1}^{N_0} w_i G_i(z) + \delta_2 U(z)
> $$
>
> $$
> H(z) = H_0(z) + \sum_{i=1}^{N_0} w_i H_i(z) + \delta_3 U(z)
> $$
>
> trong đó $F_i, G_i, H_i : X \to \mathbb{F}$ là Lagrange basis functions thỏa: $F_i(\alpha_j) = A_j(i)$, $G_i(\alpha_j) = B_j(i)$, $H_i(\alpha_j) = C_j(i)$ với $(A_j, B_j, C_j)$ là constraint tuples.
>
> **Bước 3 — Compute quotient polynomial**:
> $$
> Q(z) = \frac{F(z)G(z) - H(z)}{U(z)}
> $$
>
> *(Note: $U(z) \mid F(z)G(z) - H(z)$ khi $(x, w) \in \mathcal{R}$ — correctness của R1CS.)*
>
> **Bước 4 — Output**: $(1, \delta_1, \delta_2, \delta_3, w, q)$ trong đó $q = (q_0, q_1, \ldots, q_N)$ encode polynomial $Q$.

**Complexity breakdown**:

Mỗi polynomial $F_0, G_0, H_0$ (và tổng $F', G', H'$) được tính bằng **inverse FFT** từ evaluations trên $X$ — $O(N \log N)$ per polynomial.

Polynomial $Q$ được tính trong hai bước:
1. Evaluate $F', G', H', U$ trên coset $Y = \gamma X$ (pointwise) — $O(N)$
2. Tính $Q_0 = (F'G' - H')/U$ trên $Y$ rồi inverse FFT — $O(N \log N)$

**Tổng complexity**: $O(N \log N)$ với $N \geq N_c$.

### A.2 — Parameters cho MiMCHash-256

**Trên $\mathbb{F}_{2^n}$ với $n = 1025$**:

MiMCHash-256 dùng MiMC-1025/1025 permutation với key cố định. Tổng số constraints:

$$
N_c = \left\lceil \frac{1025}{\log_2 3} \right\rceil + 1 = 646 + 1 = 647
$$

(646 từ permutation + 1 constraint cho compression function)

Số witness: $N_0 = 1293$ (2 variables/round × 646 rounds + $w_1 = x$ là input).

**Vấn đề chọn $N$**: Prover FFT yêu cầu $N$-th root of unity tồn tại trong $\mathbb{F}_{2^{1025}}$, tức $N \mid |\mathbb{F}_{2^{1025}}^*| = 2^{1025} - 1$. Phải chọn $N$ nhỏ nhất thỏa:
- $N \geq N_c = 647$
- $N \mid (2^{1025} - 1)$

> [!abstract] Claim A.1 — $N = 1801$ cho MiMCHash-256
> Paper chọn $N = 1801$ vì:
> - $1801 \mid (2^{1025} - 1)$ — là divisor nhỏ nhất thỏa điều kiện và $\geq 647$
> - Cần thêm $1801 - 647 = 1154$ **dummy constraints** dạng $0 \cdot X_i = 0$ để đủ $N$ constraints
> - Đây không phải đặc điểm riêng của MiMC — bất kỳ SNARK implementation nào cũng cần align với FFT domain

> [!tip] 💡 Agent note
> Kỹ thuật padding với dummy constraints là standard trong SNARK implementations. [BSCG+13] dùng trường $\mathbb{F}_p$ với $p-1 = 2^t \cdot q$ để FFT domain luôn là power-of-2. Với MiMC trên $\mathbb{F}_{2^{1025}}$, phải tìm divisor phù hợp của $2^{1025} - 1$.

**Trên $\mathbb{F}_p$ (prime field variant)**:

Khi dùng MiMC-p/p với $p$ đủ lớn ($\geq 1025$ bits): có thể chọn $p$ sao cho $p - 1 = 2^l \cdot q$ — đảm bảo FFT domain là power-of-2 đơn giản. Số witnesses vẫn là 1293 (646 rounds × 2). Đây là lý do prime field variant đặc biệt thuận tiện cho SNARK: có thể design $p$ để FFT align tốt.

---

## Appendix B — Restricted Security Analysis

### Context

Lesson 04 phân tích interpolation attack và GCD attack với giả định adversary có **vô hạn** plaintext-ciphertext pairs và **vô hạn** memory. Appendix B thư giãn giả định này.

Hai restriction được xem xét (chỉ cho MiMC-n/n; extension sang MiMC-2n/n tương tự):

### B.1 — Restriction trên số pairs

**Giả định**: Adversary chỉ có $2^m$ pairs $(x_i, E_k(x_i))$ với $1 \leq m < n$.

**Ảnh hưởng đến interpolation attack**:

Interpolation polynomial bậc $3^r$ cần $3^r + 2$ pairs (bao gồm 1 pair để verify). Nếu $2^m - 1 < 3^{r-1} + 1$, tức $2^m < 3^{r-1} + 2$, adversary **không thể** construct polynomial.

**Round count tối thiểu** khi chỉ có $2^m$ pairs:

$$
r_{\text{interp}} = 1 + \left\lceil \frac{\log_2(2^m - 2)}{\log_2 3} \right\rceil \approx 1 + \left\lceil \frac{m}{\log_2 3} \right\rceil
$$

**Ảnh hưởng đến GCD attack**:

GCD attack chỉ cần **2 pairs** → restriction số pairs không ảnh hưởng. Round count từ GCD vẫn là $r_{\text{GCD}}$ thỏa $r^2 \cdot 3^r \approx 2^n$, dùng Perturbation Theory:

$$
r_{\text{GCD}} \approx n \log_3 2 - 2 \log_3(n \log_3 2)
$$

> [!abstract] Claim B.1 — Round count với restricted pairs
> Khi adversary có $2^m$ pairs ($m < n$), round count tối thiểu là:
>
> $$
> r = \max\!\left(1 + \left\lceil \frac{m}{\log_2 3} \right\rceil,\; n\log_3 2 - 2\log_3(n\log_3 2)\right)
> $$
>
> **Ví dụ** ($n = 129$):
> - Nếu $m \leq 115$: GCD attack dominates → $r = 74$ rounds (giảm từ 82)
> - Nếu $m > 115$: Interpolation attack dominates → $r = 1 + \lceil m/\log_2 3 \rceil$

**Interpretation**: Nếu adversary bị giới hạn $< 2^{115}$ pairs (ví dụ trong protocol có rate limiting), MiMC-129/129 có thể dùng chỉ 74 rounds thay vì 82 — tiết kiệm ~10% computation.

### B.2 — Restriction trên memory

**Giả định**: Adversary chỉ có $2^m$ bytes memory để store coefficients.

**Ảnh hưởng đến interpolation attack**:

Interpolation polynomial bậc $3^r$ có $3^r + 1$ coefficients. Mỗi coefficient cần $n/4$ bytes (element trong $\mathbb{F}_{2^n}$ với $n$ bits). Tổng memory cần: $(3^r + 1) \cdot n/4$ bytes.

Nếu adversary chỉ có $2^m$ bytes → có thể store tối đa $\frac{2^m}{n/4} = \frac{4 \cdot 2^m}{n}$ coefficients.

**Điều kiện**: Cần $3^r + 1 \leq \frac{4 \cdot 2^m}{n}$, tức:

$$
r \leq \log_3\!\left(\frac{4 \cdot 2^m}{n}\right) \approx \log_3(2^m)
$$

> [!abstract] Claim B.2 — Round count với restricted memory
> Nếu adversary chỉ có $n \cdot 2^{m-2}$ bytes memory, round count đủ để thặt chặn tất cả algebraic attacks:
>
> $$
> r \approx \log_3(2^m - 1) \approx m \cdot \log_3 2
> $$
>
> **Ví dụ** ($n = 129$): Nếu adversary chỉ có $2^{64}$ bytes (~18 exabytes):
> - $r \approx 64 \cdot \log_3 2 \approx 64 \cdot 0.631 \approx 40$ rounds
>
> Nếu chỉ có $2^{64}$ bytes (~18 exabytes — hardware không feasible), MiMC-129/129 chỉ cần **38 rounds** thay vì 82.

> [!warning] Thực tế về memory restriction
> $2^{64}$ bytes = 18 exabytes là memory vượt xa khả năng bất kỳ hệ thống nào hiện tại (record thực tế là ~petabytes). Restriction này chỉ có ý nghĩa lý thuyết, hoặc trong các setting IoT/embedded với memory cực kỳ hạn chế.

---

## Appendix C — SNARK Benchmark Experiments

Paper thực hiện thêm các thí nghiệm để hiểu performance của MiMC SNARK theo block size.

### Figure 2 — Time vs. Block Size (số rounds adjusted)

**Experiment**: Thay đổi block size $n$ của MiMC permutation và điều chỉnh số rounds tương ứng ($r = \lceil n/\log_2 3 \rceil$). Đo thời gian SNARK proof generation.

**Kết quả**: Runtime tăng **gần tuyến tính** theo block size. Khi tăng từ 100-bit lên 800-bit, runtime tăng chưa đến 2×.

**Giải thích**: Số constraints $N_c \approx n/\log_2 3$ tỉ lệ tuyến tính với $n$. Prover complexity $O(N \log N)$ tăng slightly super-linear nhưng vì multiplier size cũng tăng chậm (field $\mathbb{F}_{2^n}$ đắt hơn nhưng không nhiều), tổng runtime gần linear.

### Figure 3 — Time vs. Block Size (số rounds cố định = 700)

**Experiment**: Fix số rounds = 700 cho mọi block size $n$. Đo thời gian.

**Kết quả**: Runtime tăng rất chậm khi $n$ tăng — "only very slow increase".

**Giải thích**: Khi fix số rounds, số constraints cố định. Runtime thay đổi chỉ do **multiplier size** trong field $\mathbb{F}_{2^n}$ — và multiplication trong $\mathbb{F}_{2^{800}}$ chỉ đắt hơn ~1.5× so với $\mathbb{F}_{2^{100}}$ (do algorithms như [Has00] scale sublinearly).

> [!tip] 💡 Agent note
> Hai experiments này minh họa rằng MiMC là cipher với **tính scalability tốt**: có thể tăng security level (tăng $n$) mà không phải trả giá quá đắt về performance. Đây là ưu điểm quan trọng cho các ứng dụng cần điều chỉnh security parameter linh hoạt.

---

## Coverage Audit — Toàn bộ Paper

Với Appendix A0 này, toàn bộ paper đã được cover:

| Section | Lesson |
|---------|--------|
| §1 Introduction | L01 |
| §2.1 MiMC-n/n, MiMC-2n/n | L02 |
| §2.2 Permutation | L02 |
| §2.3 MiMCHash | L03 |
| §3.1–3.5 Related designs | L03 |
| §3.6 Comparison | L01 |
| §4.1 Cost model | L01 |
| §4.2 Interpolation, GCD, Subfield | L04 |
| §4.2 Differential, Linear, Degree, Hash | L05 |
| §5.1 Prime fields | L06 |
| §5.2 Larger keys | L06 |
| §5.3 Round functions, Theorem 1, Algorithm 1 | L06 |
| §6.1 SNARK, Def 1–2, Table 3 | L07 |
| §6.2 Direct implementation, Table 4 | L07 |
| §6.3 Masking | L07 |
| §7 Conclusions | L07 |
| Appendix A.1 Prover algorithm | A0 |
| Appendix A.2 MiMCHash-256 parameters | A0 |
| Appendix B Restricted security | A0 |
| Appendix C Experiments (Fig. 2, 3) | A0 |

✅ **Coverage guarantee thỏa mãn** — mọi section, theorem, lemma, definition, algorithm, và figure đều được cover.

---

## Summary

**Appendix A**:
- SNARK prover gồm: construct polynomials $F, G, H$ qua iFFT → compute quotient $Q$ → output proof vector. Complexity $O(N \log N)$ với $N \geq N_c$.
- MiMCHash-256 ($n = 1025$): $N_c = 647$, $N_0 = 1293$, chọn $N = 1801$ (smallest divisor của $2^{1025}-1$ ≥ 647). Thêm 1154 dummy constraints.

**Appendix B** — Round count khi restricted:
- **Restricted pairs** ($2^m$): $r = \max(1 + \lceil m/\log_2 3 \rceil,\; r_{\text{GCD}})$. Với $n=129, m \leq 115$: chỉ cần 74 rounds.
- **Restricted memory** ($n \cdot 2^{m-2}$ bytes): $r \approx m \cdot \log_3 2$. Với $2^{64}$ bytes: chỉ cần 38 rounds.
- Time-memory trade-off: left as open problem.

**Appendix C** — Experiments:
- Runtime gần linear theo $n$ (rounds adjusted) — Fig. 2.
- Runtime tăng rất chậm theo $n$ (rounds fixed) — vì multiplier cost sublinear — Fig. 3.

---

## References

- [BSCG+13] Ben-Sasson et al. — *SNARKs for C*, CRYPTO 2013 (🟡 Integrated — prover algorithm)
- [BKW93] Becker et al. — *Gröbner bases*, Springer 1993 (🔴 Prerequisite)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite)
