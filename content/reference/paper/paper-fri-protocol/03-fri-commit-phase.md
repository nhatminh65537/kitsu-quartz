---
title: "03. FRI COMMIT Phase"
type: scheme
tags: [fri-protocol, scheme, lesson-03]
aliases: [FRI COMMIT, Degree Folding, Round Consistency Test]
source: "Fast Reed-Solomon Interactive Oracle Proofs of Proximity — Ben-Sasson, Bentov, Horesh, Riabzev, ICALP 2018"
created: 2026-03-15
---

> **Prerequisites**: [[01-rs-iopp-foundations|01. RS Codes & IOPP Foundations]], [[02-fri-main-theorem|02. FRI Main Theorem]] — RS code, IOPP model, soundness function; kiến thức nền về FFT/IFFT hữu ích nhưng không bắt buộc  
> 🔴 **Prerequisite references**: Reed & Solomon [RS60] (RS code); Cooley-Tukey [26] (FFT algorithm — analogy only)  
> **Lesson type**: Scheme  
> **Covers**: §2.1 (FRI overview — FFT analogy, degree-folding, bivariate decomposition, round consistency test); Remark (FRI as biased RS-PCPP)
>
> **Notation**
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | $\omega^{(0)}$ | Generator của smooth multiplicative group $L^{(0)}$ | $L^{(0)} = \langle \omega^{(0)} \rangle$, $\lvert L^{(0)} \rvert = N = 2^n$ |
> | $L^{(i)}$ | Domain ở round $i$; $L^{(i)} = \langle \omega^{(i)} \rangle$, $\omega^{(i)} = (\omega^{(i-1)})^2$ | $\lvert L^{(i)} \rvert = 2^{n-i}$ |
> | $f^{(i)} : L^{(i)} \to F$ | Oracle message của prover ở round $i$ | $f^{(0)}$ là input; $f^{(1)}, \ldots, f^{(r)}$ là proof |
> | $P^{(0)}(X)$ | Polynomial "ẩn" mà prover claim $f^{(0)}$ là evaluation của nó | $\deg(P^{(0)}) < \rho \cdot 2^n$ |
> | $q^{(0)}(X)$ | Folding map (squaring map), $q^{(0)}(x) = x^2$ | Ánh xạ $L^{(0)} \to L^{(1)}$, 2-to-1 |
> | $Q^{(1)}(X, Y)$ | Bivariate polynomial từ IFFT decomposition | $\deg_X Q^{(1)} < 2$, $\deg_Y Q^{(1)} < \frac{\rho \cdot 2^n}{2}$ |
> | $x^{(0)} \in F$ | Verifier's random challenge ở round 0 | Xác định "axis-parallel line" để prover evaluate |
> | $P^{(1)}(Y)$ | Univariate polynomial sau khi fold: $P^{(1)}(Y) = Q^{(1)}(x^{(0)}, Y)$ | $\deg P^{(1)} < \frac{\rho \cdot 2^n}{2}$ |
> | $s_0, s_1$ | Hai preimages của $y \in L^{(1)}$ dưới $q^{(0)}$: $s_0^2 = s_1^2 = y$ | $s_1 = -s_0$ trong multiplicative setting |
> | $r$ | Số rounds, $r = n - R = \log N / 2$ trong FRI thực tế | Mỗi round giảm domain một hệ số |

---

## Motivation

Lesson này là **trái tim kỹ thuật** của toàn course. FRI giải bài toán RS proximity bằng một insight đơn giản nhưng sâu sắc: **thay vì kiểm tra $f^{(0)}$ trực tiếp, hãy "fold" nó thành một hàm nhỏ hơn $f^{(1)}$ mà vẫn giữ được thông tin proximity, rồi kiểm tra $f^{(1)}$ — và lặp lại.**

Quá trình folding là một phiên bản *tương tác* của IFFT: nếu $f^{(0)}$ là evaluation của polynomial $P^{(0)}$ bậc $< \rho N$, thì $P^{(0)}$ có thể tách thành hai polynomial "con" nhỏ hơn một nửa — đây chính xác là bước Butterfly trong IFFT. Nhưng FRI không làm IFFT đầy đủ (vốn cần $O(N \log N)$); thay vào đó nó dùng *tương tác* để chỉ theo đuổi **một axis-parallel line** được verifier chọn ngẫu nhiên — đó là lý do prover complexity chỉ $O(N)$.

---

## 1. Bước Nền: IFFT Decomposition

### 1.1 Tách Polynomial Bằng Even/Odd Coefficients

Cho $P^{(0)}(X) \in F[X]$ với $\deg(P^{(0)}) < \rho \cdot 2^n$. Áp dụng phân tích even/odd (bước IFFT chuẩn):

$$
P^{(0)}(X) = P^{(1)}_0(X^2) + X \cdot P^{(1)}_1(X^2)
$$

trong đó:
- $P^{(1)}_0(Y) = \sum_{i \text{ chẵn}} a_i Y^{i/2}$ — coefficients chẵn của $P^{(0)}$
- $P^{(1)}_1(Y) = \sum_{i \text{ lẻ}} a_i Y^{(i-1)/2}$ — coefficients lẻ của $P^{(0)}$
- $\deg(P^{(1)}_0), \deg(P^{(1)}_1) < \frac{\rho \cdot 2^n}{2}$

### 1.2 Bivariate Polynomial $Q^{(1)}$

Đặt bivariate polynomial:

$$
Q^{(1)}(X, Y) \stackrel{\text{def}}{=} P^{(1)}_0(Y) + X \cdot P^{(1)}_1(Y)
$$

và folding map $q^{(0)}(X) \stackrel{\text{def}}{=} X^2$. Khi đó:

$$
P^{(0)}(X) \equiv Q^{(1)}(X, Y) \pmod{Y - q^{(0)}(X)}
$$

với $\deg_X(Q^{(1)}) < 2$ và $\deg_Y(Q^{(1)}) < \frac{\rho \cdot 2^n}{2}$.

> [!info] 🟡 Bivariate Decomposition (từ Ben-Sasson, Sudan [BS08] = [23])
> Kỹ thuật phân tách $P^{(0)}$ thành bivariate $Q^{(1)}(X,Y)$ qua relation $P^{(0)}(X) = Q^{(1)}(X, X^2)$ là nền tảng của quasilinear RS-PCPP trong [23]. Trong PCPP đó (non-interactive), prover phải evaluate $Q^{(1)}$ trên **toàn bộ** tập $F \times F$, tốn $\Omega(N^2)$ công việc. FRI dùng tương tác để chỉ evaluate $Q^{(1)}$ trên **một axis-parallel line** $Y = \text{const}$ được verifier chọn — giảm công việc từ $N^2$ xuống $N$.
>
> Điểm khác biệt then chốt: [23] dùng $q^{(0)}(X) = X^{2^{n/2}}$ (bậc lớn, balanced degrees), còn FRI dùng $q^{(0)}(X) = X^2$ (bậc nhỏ, **biased**: $\deg_X Q^{(1)} = 1 \ll \deg_Y Q^{(1)} \approx \rho N/2$). Đây là "bias" tạo ra lợi thế về soundness.
>
> *(theo [23]: Ben-Sasson, Sudan — Short PCPs with polylog query complexity, SICOMP 38(2), 2008)*

### 1.3 Key Observation: Map $q^{(0)}$ là 2-to-1

Trên $L^{(0)} = \langle \omega^{(0)} \rangle$ (multiplicative group bậc $N = 2^n$): vì $q^{(0)}(x) = x^2 = (-x)^2$, ánh xạ $q^{(0)}$ là **2-to-1**. Image của $q^{(0)}$ là $L^{(1)} = \langle (\omega^{(0)})^2 \rangle$ — multiplicative group bậc $N/2$. Với mỗi $y \in L^{(1)}$, có đúng hai preimages $\{s_0, s_1\} = \{s, -s\}$ thỏa $s^2 = y$.

---

## 2. Protocol — Một Round Folding

Verifier biết $f^{(0)} : L^{(0)} \to F$ (oracle). Prover claim $f^{(0)} \in \mathsf{RS}[F, L^{(0)}, \rho]$.

### 2.1 Interaction của Round 0

> [!note] Scheme 3.1 — FRI Round 0 (Informal / Multiplicative Setting)
> **Type**: IOPP round (degree-folding step)  
> **Setting**: Domain $L^{(0)}$ (bậc $N$), rate $\rho$, honest prover biết $P^{(0)}$ với $\deg P^{(0)} < \rho N$
>
> **$\mathsf{CommitRound}(f^{(0)}, P^{(0)}, x^{(0)})$** — Prover gửi $f^{(1)}$:
> - Input: $f^{(0)} : L^{(0)} \to F$, polynomial $P^{(0)}$, verifier challenge $x^{(0)} \in F$
> - Tính $Q^{(1)}(X, Y) = P^{(1)}_0(Y) + X \cdot P^{(1)}_1(Y)$ (IFFT decomposition)
> - Với mỗi $y \in L^{(1)}$: đặt $f^{(1)}(y) = Q^{(1)}(x^{(0)}, y) = P^{(1)}_0(y) + x^{(0)} \cdot P^{(1)}_1(y)$
> - Output: oracle $f^{(1)} : L^{(1)} \to F$
>
> **$\mathsf{VerifierChallenge}()$** — Verifier:
> - Samples $x^{(0)} \stackrel{R}{\leftarrow} F$ uniformly at random
> - Gửi $x^{(0)}$ cho prover

Sau round 0: bài toán giảm từ proximity testing $f^{(0)}$ trên domain $L^{(0)}$ (bậc $N$, rate $\rho$) thành proximity testing $f^{(1)}$ trên domain $L^{(1)}$ (bậc $N/2$, **cùng rate $\rho$**). Đây là key: rate không đổi sau mỗi round.

### 2.2 Round Consistency Test (3-Query Test)

Verifier cần kiểm tra rằng $f^{(1)}$ gửi bởi prover **nhất quán** với $f^{(0)}$ và challenge $x^{(0)}$:

> [!note] Scheme 3.2 — Round Consistency Test
> **Type**: 3-query consistency check  
> **Input**: Oracles $f^{(0)}, f^{(1)}$; challenge $x^{(0)}$; sample $y \in L^{(1)}$
>
> **$\mathsf{ConsistencyTest}(f^{(0)}, f^{(1)}, x^{(0)}, y)$**:
> - Step 1: Lấy hai preimages $s_0, s_1 \in L^{(0)}$ của $y$ dưới $q^{(0)}$: $s_0^2 = s_1^2 = y$, $s_0 = -s_1$
> - Step 2: **Query** $\alpha_0 = f^{(0)}(s_0)$, $\alpha_1 = f^{(0)}(s_1)$, $\beta = f^{(1)}(y)$ — **3 queries**
> - Step 3: Nội suy "đường thẳng" $p(X)$ bậc $\leq 1$ qua $(s_0, \alpha_0)$ và $(s_1, \alpha_1)$:
>
> $$
> p(X) = \alpha_0 \cdot \frac{X - s_1}{s_0 - s_1} + \alpha_1 \cdot \frac{X - s_0}{s_1 - s_0}
> $$
>
> - Step 4: **Accept** nếu và chỉ nếu $p(x^{(0)}) = \beta$; ngược lại **Reject**

**Tại sao 3 queries?** Để kiểm tra $f^{(1)}(y) = Q^{(1)}(x^{(0)}, y)$, verifier cần biết $Q^{(1)}$ tại $(x^{(0)}, y)$. Vì $\deg_X Q^{(1)} < 2$, polynomial $Q^{(1)}(X, y)$ là đa thức bậc 1 trong $X$ — xác định bởi **2 điểm**. Hai điểm đó là $(s_0, f^{(0)}(s_0))$ và $(s_1, f^{(0)}(s_1))$ (vì $f^{(0)}(s_i) = P^{(0)}(s_i) = Q^{(1)}(s_i, s_i^2) = Q^{(1)}(s_i, y)$). Nội suy ra $p(X)$ rồi evaluate tại $x^{(0)}$ là giá trị phải bằng $f^{(1)}(y)$.

> [!tip] 💡 Agent note
> Tại sao sample $y \in L^{(1)}$ chứ không phải $s \in L^{(0)}$ trực tiếp? Vì ta muốn kiểm tra **một điểm trên $L^{(1)}$** — domain của $f^{(1)}$. Mỗi điểm $y \in L^{(1)}$ có đúng 2 preimages trong $L^{(0)}$, nên ta lấy 2 queries từ $f^{(0)}$ và 1 query từ $f^{(1)}$ — tổng 3 queries per round.

---

## 3. FRI Protocol Đầy Đủ — $r$ Rounds (Multiplicative Setting)

Lặp lại quá trình folding $r$ rounds:

> [!note] Scheme 3.3 — FRI Protocol (Informal, Multiplicative Setting)
> **Type**: IOPP cho $\mathsf{RS}[F, L^{(0)}, \rho]$  
> **Setting**: $L^{(0)}$ smooth multiplicative group bậc $N = 2^n$, $\rho = 2^{-R}$, $r = n - R$ rounds
>
> **$\mathsf{FRI\_Commit}(f^{(0)}, P^{(0)})$** — COMMIT Phase (Prover):
> - Input: $f^{(0)} : L^{(0)} \to F$, polynomial $P^{(0)}$ với $\deg P^{(0)} < \rho N$
> - **For** $i = 0, 1, \ldots, r-1$:
>   - Prover nhận challenge $x^{(i)} \stackrel{R}{\leftarrow} F$ từ verifier
>   - Tính $f^{(i+1)} : L^{(i+1)} \to F$ bằng: $f^{(i+1)}(y) = Q^{(i+1)}(x^{(i)}, y)$ với mọi $y \in L^{(i+1)}$
>   - Gửi oracle $f^{(i+1)}$ cho verifier
> - Sau $r$ rounds: $f^{(r)} : L^{(r)} \to F$ với $\lvert L^{(r)} \rvert = 2^R$ (constant size)
> - Prover gửi hàm hằng $f^{(r)}$ tường minh (toàn bộ $2^R$ giá trị)
> - Output: oracles $f^{(1)}, \ldots, f^{(r)}$
>
> **$\mathsf{FRI\_Verify}(f^{(0)}, f^{(1)}, \ldots, f^{(r)}, x^{(0)}, \ldots, x^{(r-1)})$** — Verifier:
> - **For** $i = 0, 1, \ldots, r-1$:
>   - Sample $y^{(i)} \stackrel{R}{\leftarrow} L^{(i+1)}$
>   - Chạy $\mathsf{ConsistencyTest}(f^{(i)}, f^{(i+1)}, x^{(i)}, y^{(i)})$
>   - Nếu bất kỳ test nào fail → **Reject**
> - Nếu tất cả pass → **Accept**

**Completeness** (honest prover): Nếu $f^{(0)} \in \mathsf{RS}[F, L^{(0)}, \rho]$ và prover honest, thì với mọi $x^{(0)}, \ldots, x^{(r-1)}$ và $y^{(0)}, \ldots, y^{(r-1)}$, tất cả $r$ round consistency tests đều pass với xác suất 1.

**Proof.** Theo induction: ở round 0, $f^{(1)}(y) = Q^{(1)}(x^{(0)}, y)$ theo định nghĩa. Với preimages $s_0, s_1$ của $y$, ta có $f^{(0)}(s_i) = P^{(0)}(s_i) = Q^{(1)}(s_i, y)$. Polynomial nội suy $p(X)$ qua $(s_0, Q^{(1)}(s_0, y))$ và $(s_1, Q^{(1)}(s_1, y))$ là $Q^{(1)}(X, y)$ vì $\deg_X Q^{(1)} < 2$. Do đó $p(x^{(0)}) = Q^{(1)}(x^{(0)}, y) = f^{(1)}(y)$ — test pass. Induction tương tự cho các rounds sau. $\blacksquare$

---

## 4. Phân Tích Complexity (Multiplicative Setting)

### Prover Complexity

Mỗi round $i$: tính $f^{(i+1)} : L^{(i+1)} \to F$ từ $f^{(i)} : L^{(i)} \to F$. Với mỗi $y \in L^{(i+1)}$, cần:
- Tìm $s_0, s_1 \in L^{(i)}$ sao cho $s_0^2 = s_1^2 = y$ — $O(1)$ ops
- Tính $f^{(i+1)}(y) = f^{(i)}(s_0) \cdot c_0 + f^{(i)}(s_1) \cdot c_1$ với $c_0, c_1$ là Lagrange coefficients phụ thuộc $x^{(i)}, s_0, s_1$ — $O(1)$ ops

Tổng công việc mỗi round $i$: $O(\lvert L^{(i+1)} \rvert) = O(N / 2^{i+1})$.

$$
\text{Total prover ops} = \sum_{i=0}^{r-1} O(N/2^{i+1}) = O(N) \cdot \sum_{i=0}^{\infty} 1/2^{i+1} = O(N)
$$

Hằng số tường minh trong binary additive setting: $< 6N$ (Theorem 2).

### Proof Length

$\lvert f^{(1)} \rvert + \cdots + \lvert f^{(r)} \rvert = N/2 + N/4 + \cdots + 2^R < N/2 \cdot \frac{1}{1 - 1/2} = N$.  
Thực tế với $q^{(0)}$ degree-4 (binary additive case): $\lvert f^{(1)} \rvert = N/4$, tổng $< N/3$.

### Verifier Query Complexity

Mỗi round cần 3 queries (ConsistencyTest). Nhưng query đến $f^{(i)}$ được **chia sẻ** giữa round $i-1$ (kiểm tra $f^{(i-1)}$ vs $f^{(i)}$) và round $i$ (kiểm tra $f^{(i)}$ vs $f^{(i+1)}$). Do đó:

$$
\text{Total queries} = 2 \cdot r = 2 \log N / 2 = \log N
$$

Thực tế với $q^{(0)}$ degree-4: total queries = $2 \log N$ (Theorem 2).

---

## 5. FRI vs Quasilinear RS-PCPP [23]: Sự Khác Biệt "Biased"

> [!abstract] Remark — FRI là IOPP "Biased"
> FRI và quasilinear RS-PCPP của [23] dùng cùng bivariate decomposition $P^{(0)}(X) = Q^{(1)}(X, X^2)$. Hai điểm khác biệt then chốt:
>
> **(1) Tương tác vs. Static**: [23] là PCPP — prover evaluate $Q^{(1)}(X, Y)$ trên một tập lớn $F \times F$ (non-interactive). FRI dùng interaction: verifier gửi $x^{(0)}$, prover chỉ evaluate $Q^{(1)}(x^{(0)}, Y)$ trên $L^{(1)}$ — tiết kiệm factor $N$.
>
> **(2) Balanced vs. Biased degrees**: [23] dùng $q^{(0)}(X) = X^{2^{n/2}}$ → $\deg_X Q^{(1)} \approx \deg_Y Q^{(1)} \approx 2^{n/2}$ (balanced). FRI dùng $q^{(0)}(X) = X^2$ → $\deg_X Q^{(1)} = 1 \ll \deg_Y Q^{(1)} \approx \rho N/2$ (**biased**).
>
> Hệ quả của bias: X-axis của recursion "kết thúc ngay lập tức" (degree 1), loại bỏ constant multiplicative soundness loss. Đây là lý do FRI có thể dùng $\Theta(\log N)$ rounds thay vì $O(\log \log N)$.

---

## 6. Ví Dụ Minh Họa Nhỏ

> [!example] Ví dụ: $N = 8$, $\rho = 1/4$, $r = 1$ round
> Field $F = \mathbb{F}_{17}$, $L^{(0)} = \{1, 2, 4, 8, 16, 15, 13, 9\}$ (cyclic group bậc 8 trong $\mathbb{F}_{17}^*$, generator $\omega^{(0)} = 2$).
>
> Prover claim $f^{(0)}$ là evaluation của $P^{(0)}(X) = 3X + X^2$ ($\deg = 2 < \rho N = 2$):
> - IFFT: $P^{(0)}(X) = P^{(1)}_0(X^2) + X \cdot P^{(1)}_1(X^2)$ với $P^{(1)}_0(Y) = Y$, $P^{(1)}_1(Y) = 3$
> - $Q^{(1)}(X, Y) = Y + 3X$
>
> Verifier gửi $x^{(0)} = 5$. Prover compute:  
> $f^{(1)}(y) = Q^{(1)}(5, y) = y + 15$ trên $L^{(1)} = \{1, 4, 16, 13\}$.
>
> Round consistency test tại $y = 4 \in L^{(1)}$: preimages $\{s_0, s_1\} = \{2, 15\}$ (vì $2^2 = 4$, $15^2 = 225 \equiv 4 \pmod{17}$).  
> Queries: $\alpha_0 = f^{(0)}(2) = 3\cdot2 + 4 = 10$, $\alpha_1 = f^{(0)}(15) = 3\cdot15 + 225 \equiv 45+225 = 270 \equiv 15 \pmod{17}$... (tính toán modular chi tiết phụ thuộc field).  
> Polynomial nội suy $p(X)$ bậc 1 qua $(2, \alpha_0)$ và $(15, \alpha_1)$ evaluate tại $x^{(0)} = 5$ phải bằng $f^{(1)}(4) = 4 + 15 = 19 \equiv 2 \pmod{17}$.

---

## 7. Tóm Tắt

- **Core idea**: Fold $f^{(0)}$ thành $f^{(1)}$ nhỏ hơn một nửa bằng IFFT decomposition + verifier challenge $x^{(0)}$.
- **Bivariate polynomial** $Q^{(1)}(X, Y) = P^{(1)}_0(Y) + X \cdot P^{(1)}_1(Y)$: $\deg_X = 1$ (biased), $\deg_Y < \rho N / 2$.
- **Round consistency test**: 3 queries ($f^{(0)}(s_0), f^{(0)}(s_1), f^{(1)}(y)$) + interpolation + check.
- **FRI = $r$ rounds** của folding: domain shrinks $N \to N/2 \to \cdots \to 2^R$.
- **Completeness**: honest prover luôn pass tất cả tests với xác suất 1.
- **Complexity**: prover $O(N)$ (geometric series), verifier $O(\log N)$ queries (shared queries), $r = \log N / 2$ rounds.
- **FRI vs [23]**: biased degree ($q^{(0)} = X^2$ thay vì $X^{2^{n/2}}$) + tương tác → prover linear, soundness loss additive thay vì multiplicative.

---

## References

- [23] Ben-Sasson, Sudan — *Short PCPs with polylog query complexity*, SICOMP 2008 (🟡 Integrated: bivariate decomposition, quasilinear PCPP foundation)
- [26] Cooley, Tukey — *FFT algorithm*, 1965 (⚪ — analogy only)
- [RS60] Reed, Solomon — 1960 (🔴 Prerequisite)
- [10] Ben-Sasson et al. — Full version TR17-134 (chi tiết hằng số $< 6N$ và $< N/3$)
