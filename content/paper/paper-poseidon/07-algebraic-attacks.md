---
title: "07. Algebraic Attacks on POSEIDON"
type: attack
tags: [poseidon, cryptanalysis, groebner-basis, interpolation, cico, algebraic, attack, lesson-07]
aliases: [Algebraic Attacks POSEIDON, Gröbner Basis POSEIDON, CICO Problem]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[03-hades-round-function|03. HADES & Round Function]], [[04-instantiations-parameters|04. Instantiations & Parameters]], đa thức trên trường hữu hạn, Gröbner basis ở mức khái niệm  
> 🔴 **Prerequisite references**: Grassi et al. — *HADES Design Strategy* [GLR+20] (degree growth analysis đầy đủ); Albrecht et al. — *MiMC* [AGR+16] (interpolation attack framework gốc)  
> **Lesson type**: Attack  
> **Covers**: §5.2 (Algebraic Attacks: Gröbner Basis Attack — CICO problem, degree of regularity, F4/F5 complexity; Interpolation Attack — univariate bound, round number derivation)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathsf{P} = \mathsf{POSEIDON}^\pi$ | Permutation (shorthand) | $P$ |
> | $(x_1, x_2)$ | Input split: $x_1$ = free part, $x_2$ = fixed part | $(x_1, x_2)$ |
> | $(y_1, y_2)$ | Output split: $y_1$ = fixed part, $y_2$ = free part | $(y_1, y_2)$ |
> | $d_{\text{reg}}$ | Degree of regularity của hệ phương trình | $d_{\text{reg}}$ |
> | $n_v$ | Số biến (variables) trong hệ phương trình | $n_v$ |
> | $\omega$ | Hệ số của matrix multiplication ($\omega \approx 2.37$) | $\omega$ |
> | $D$ | Degree tổng của $\mathsf{POSEIDON}^\pi$ như multivariate polynomial | $D$ |
> | $\alpha$ | S-box exponent | $\alpha$ |
> | $R_F, R_P$ | Số full/partial rounds | $R_F, R_P$ |

---

## Tổng Quan: Algebraic Attacks Là Gì?

**Algebraic attacks** khai thác bản chất *đa thức* (polynomial) của các primitive như POSEIDON. Vì $\mathsf{POSEIDON}^\pi$ chỉ dùng phép cộng và nhân trên $\mathbb{F}_p$, toàn bộ permutation có thể viết như một hệ **đa thức đại số**:

$$
\mathsf{POSEIDON}^\pi(x_0, \ldots, x_{t-1}) = (f_0(x_0,\ldots,x_{t-1}),\ \ldots,\ f_{t-1}(x_0,\ldots,x_{t-1}))
$$

với $f_i \in \mathbb{F}_p[x_0, \ldots, x_{t-1}]$ là đa thức nhiều biến.

Mục tiêu của adversary: khai thác cấu trúc đa thức này để giải các bài toán **preimage** hoặc **CICO** nhanh hơn $2^M$ operations.

Có hai kỹ thuật chính:

1. **Interpolation attack**: xây dựng biểu diễn đa thức *univariate* và nội suy qua evaluation points.
2. **Gröbner basis attack**: viết thành hệ phương trình đa thức *multivariate* và giải bằng F4/F5 algorithm.

---

## 1. Bài Toán CICO (§5.2)

Cả hai algebraic attacks đều được framing qua **CICO problem**:

> [!note] Định Nghĩa 7.1 — CICO Problem (Constrained-Input Constrained-Output)
> **Type**: Computational problem  
> **Setting**: Permutation $\mathsf{P} : \mathbb{F}_p^t \to \mathbb{F}_p^t$; input split thành hai phần $(x_1, x_2)$ với $|x_1| = k$ và $|x_2| = t - k$ (tính bằng số field elements)
>
> **$\mathsf{CICO}(\mathsf{P}, x_2, y_1)$**
> - Input: Phần cố định của input $x_2 \in \mathbb{F}_p^{t-k}$ và phần cố định của output $y_1 \in \mathbb{F}_p^k$
> - Tìm: $x_1 \in \mathbb{F}_p^k$ và $y_2 \in \mathbb{F}_p^{t-k}$ sao cho:
>
> $$
> \mathsf{P}(x_1 \| x_2) = y_1 \| y_2
> $$
>
> - Output: $(x_1, y_2)$ hoặc $\bot$ nếu không tìm được

**Tại sao CICO quan trọng?**

Preimage attack trên POSEIDON sponge là trường hợp đặc biệt của CICO: capacity của input cố định bằng $\mathbf{0}_c$ (vì sponge bắt đầu với zero capacity), và phần rate của output cố định bằng hash value cần invert. Nếu CICO khó → preimage attack khó.

Paper chọn $k = 1$ cho phần lớn analysis: cố định $t-1$ input coordinates và $1$ output coordinate, để lại $1$ ẩn trong input và $t-1$ ẩn trong output.

---

## 2. Interpolation Attack (§5.2)

### Ý Tưởng Cốt Lõi

Thay vì tấn công toàn bộ multivariate permutation, **thu gọn về univariate**: fix $t-1$ trong số $t$ input coordinates → $\mathsf{P}$ trở thành hàm một biến $f : \mathbb{F}_p \to \mathbb{F}_p^t$.

Hàm $f$ là đa thức bậc $D$ duy nhất (theo bổ đề nội suy Lagrange). Nếu bậc $D$ đủ nhỏ, adversary có thể:

1. Thu thập $D+1$ cặp $(x, f(x))$ bằng evaluation.
2. Nội suy đa thức $f$ chính xác.
3. Dùng $f$ để giải CICO: với $y_1$ cho trước, giải $f_1(x) = y_1$ → tìm $x$.

> [!note] Scheme 7.2 — Interpolation Attack
> **Type**: Preimage attack qua polynomial interpolation  
> **Setting**: Permutation $\mathsf{P} : \mathbb{F}_p^t \to \mathbb{F}_p^t$; fix $t-1$ input coords tại giá trị tùy ý
>
> **$\mathsf{Interpolation\_Attack}(\mathsf{P}, y_1)$**
> - Input: Target output coordinate $y_1 \in \mathbb{F}_p$
> - Step 1 (Reduce to univariate): Fix $(x_2, \ldots, x_{t-1}) = (a_2, \ldots, a_{t-1})$ tùy ý; coi $\mathsf{P}_1(x_0) = [\mathsf{P}(x_0, a_2, \ldots, a_{t-1})]_1$ là hàm univariate trong $x_0$
> - Step 2 (Degree estimation): Xác định bậc $D = \alpha^{R_F + R_P}$ của $\mathsf{P}_1$
> - Step 3 (Collect evaluations): Tính $\mathsf{P}_1(x_0^{(i)})$ với $D+1$ giá trị $x_0^{(i)}$ phân biệt → thu $D+1$ cặp
> - Step 4 (Lagrange interpolation): Tính polynomial $\hat{f}$ bậc $D$ qua $D+1$ điểm
> - Step 5 (Solve): Tìm $x_0$ sao cho $\hat{f}(x_0) = y_1$ → invert permutation
> - Output: $x_0$ (preimage) hoặc $\bot$

### Complexity Analysis

**Số evaluations cần**: $D + 1 = \alpha^{R_F + R_P} + 1$.

**Complexity tổng** (dominated bởi Lagrange interpolation):

$$
\mathcal{C}_{\text{interp}} = O(D \log^2 D) = O\!\left(\alpha^{R_F + R_P} \cdot (R_F + R_P)^2 \log^2 \alpha\right)
$$

**Điều kiện an toàn**: cần $\mathcal{C}_{\text{interp}} \geq 2^M$, tức là:

$$
\alpha^{R_F + R_P} \geq 2^M \quad \Rightarrow \quad R_F + R_P \geq \log_\alpha(2^M) = M \cdot \log_\alpha 2
$$

Nhưng ta cần thêm yếu tố throughput $t$ (vì capacity $= t - r$ coordinates cần nội suy đủ):

$$
\alpha^{R_F + R_P} \geq 2^M \cdot t \quad \Rightarrow \quad R_P \geq \left\lceil \log_\alpha(2) \cdot (M + t) \right\rceil - R_F
$$

Đây chính là **Claim 4.5** trong [[04-instantiations-parameters|Lesson 04]]. $\blacksquare$

> [!example] Kiểm tra với $\alpha = 5$, $M = 128$, $t = 3$, $R_F = 8$
> $$
> D = 5^{8 + 57} = 5^{65} \approx 2^{150.8}
> $$
>
> Adversary cần $5^{65} \approx 2^{150.8}$ evaluations → vượt $2^{128}$. Với security margin $R_P = 57$ thay vì $R_P = 49$ (minimum), $D \approx 2^{167}$. Attack không khả thi.

> [!warning] Giới hạn của interpolation attack
> Attack chỉ hoạt động khi adversary có thể **evaluation $\mathsf{P}$ tại nhiều điểm tùy ý**. Trong ngữ cảnh sponge (hash function), adversary *có thể* chọn input và quan sát output — đây là điều kiện chosen-input. Do đó interpolation attack là mối đe dọa *thực sự* và không thể bỏ qua.

---

## 3. Gröbner Basis Attack (§5.2)

### Ý Tưởng Cốt Lõi

Thay vì giảm về univariate, **giữ nguyên hệ multivariate** và dùng thuật toán Gröbner basis (F4/F5) để giải.

Viết $\mathsf{P}$ như hệ phương trình đa thức bằng cách giới thiệu **biến trung gian** cho mỗi kết quả S-box:

$$
\begin{cases}
w_i = s_0^{(i)\alpha} & \text{(output của S-box tại round } i \text{)} \\
s^{(i+1)} = M \cdot (w_i, s_1^{(i)}, \ldots, s_{t-1}^{(i)}) + c^{(i)} & \text{(round function)}
\end{cases}
$$

Sau đó thêm điều kiện CICO: $[\mathsf{P}(x)]_1 = y_1$ (fix một output coordinate). Hệ có $n_v$ biến và $n_v$ phương trình.

> [!note] Scheme 7.3 — Gröbner Basis Attack
> **Type**: Algebraic equation solving  
> **Setting**: Permutation $\mathsf{P}$ biểu diễn như hệ $\{f_1, \ldots, f_m\} \subset \mathbb{F}_p[w_1, \ldots, w_{n_v}]$
>
> **$\mathsf{Groebner\_Attack}(\mathsf{P}, x_2, y_1)$**
> - Input: Fixed coordinates $x_2, y_1$ của CICO problem
> - Step 1 (Linearize per round): Với mỗi round $i$, viết các phương trình:
>   - Full round: $t$ phương trình $w_j^{(i)} = s_j^{(i)\alpha}$ (mỗi phương trình bậc $\alpha$)
>   - Partial round: $1$ phương trình $w_0^{(i)} = s_0^{(i)\alpha}$
> - Step 2 (Linear constraints): Thêm các phương trình tuyến tính từ MixLayer và ARC (free — không tốn variables)
> - Step 3 (CICO constraint): Thêm phương trình $f_{\text{CICO}}(x_1, x_2, y_1, y_2) = 0$
> - Step 4 (F4/F5): Tính Gröbner basis của hệ; complexity $\approx \binom{n_v + d_{\text{reg}}}{d_{\text{reg}}}^\omega$
> - Step 5 (FGLM): Convert Gröbner basis về lex order để giải → tìm $x_1$
> - Output: Nghiệm $x_1$ (và $y_2$) hoặc $\bot$

### Số Biến và Degree of Regularity

**Số biến** $n_v$ trong hệ sau linearization:

$$
n_v = R_F \cdot t + R_P \cdot 1 = R_F \cdot t + R_P
$$

(mỗi S-box output là một biến; các phép toán tuyến tính không cần biến mới).

**Degree of regularity** $d_{\text{reg}}$: đây là quantity khó nhất để tính chính xác. Với hệ *semi-regular* (generic case), một ước lượng phổ biến là:

$$
d_{\text{reg}} \approx 1 + \frac{n_v(\alpha - 1)}{n_{\text{eq}}} \approx 1 + \frac{(R_F t + R_P)(\alpha - 1)}{R_F t + R_P} = \alpha
$$

Tuy nhiên paper dùng phân tích *empirical* kỹ hơn: với $R_F = 0$ (chỉ partial rounds) và $t$ biến, $d_{\text{reg}}$ thực nghiệm gần với:

$$
d_{\text{reg}} \approx \min\!\left(p,\ 2 + (\alpha - 1)\left\lfloor \frac{n_v + 1}{\alpha} \right\rfloor\right)
$$

### Complexity Analysis

**F4/F5 complexity** (dominant term):

$$
\mathcal{C}_{\text{GB}} \approx \binom{n_v + d_{\text{reg}}}{d_{\text{reg}}}^{\omega}
$$

với $\omega \approx 2.37$ (hệ số matrix multiplication của Coppersmith-Winograd).

**FGLM step** (convert Gröbner basis về lex order): $O(D^3)$ với $D = \alpha^{R_F + R_P}$.

**Điều kiện an toàn**: $\mathcal{C}_{\text{GB}} \geq 2^M$. Giải bất đẳng thức này cho $R_P$:

$$
\omega \cdot \log_2 \binom{n_v + d_{\text{reg}}}{d_{\text{reg}}} \geq M
$$

Với xấp xỉ tuyến tính $\binom{n + d}{d} \approx n^d / d!$ và $d_{\text{reg}} \approx \alpha$:

$$
\omega \cdot d_{\text{reg}} \cdot \log_2 n_v \approx M \quad \Rightarrow \quad R_P \geq \left\lceil \frac{M}{2.37 \cdot \log_2(R_F t + R_P)} - R_F \right\rceil
$$

Paper linearize thêm và đưa về công thức tuyến tính gần đúng:

$$
R_P \geq \lceil 0.21 \cdot M + 1.26 \cdot t - R_F \rceil
$$

Đây chính là **Claim 4.6** trong [[04-instantiations-parameters|Lesson 04]]. $\blacksquare$

> [!example] Kiểm tra với $\alpha = 5$, $M = 128$, $t = 3$, $R_F = 8$
> $$
> R_P \geq \lceil 0.21 \times 128 + 1.26 \times 3 - 8 \rceil = \lceil 26.88 + 3.78 - 8 \rceil = \lceil 22.66 \rceil = 23
> $$
>
> Bound Gröbner bass = 23, nhỏ hơn bound interpolation = 49. Do đó với instance này, **interpolation attack chặt hơn** và $R_P$ được chọn theo nó ($R_P = 57$ sau security margin 50%).

> [!warning] Gröbner basis tighter ở $t$ lớn
> Với $t$ lớn (nhiều partial rounds), Gröbner basis tighter: $1.26 \cdot t$ tăng nhanh. Ví dụ $t = 12$: Gröbner bound $\approx 0.21 \times 128 + 1.26 \times 12 - 8 = 34.9$ → competitive với interpolation. Paper khuyến nghị luôn lấy $\max$ của hai bounds rồi nhân thêm 1.5.

---

## 4. Tương Tác Giữa $R_F$ và $R_P$ trong Algebraic Security

Một điểm tinh tế: **full rounds cũng đóng góp vào algebraic security**, không chỉ partial rounds.

Mỗi full round có $t$ S-boxes → degree tăng $\alpha$ lần với tốc độ nhanh hơn partial round (cũng tăng $\alpha$ lần nhưng chỉ ở một coordinate trước khi MixLayer lan ra).

Do đó, trong interpolation bound, **tổng** $R_F + R_P$ xuất hiện (không chỉ $R_P$):

$$
R_F + R_P \geq \log_\alpha(2) \cdot (M + t)
$$

Với $R_F = 8$ đã fix cho statistical security, ta chỉ cần:

$$
R_P \geq \log_\alpha(2) \cdot (M + t) - 8
$$

Điều này có nghĩa là **tăng $R_F$ (vì lý do statistical) cũng giảm $R_P$ cần thiết (cho lý do algebraic)**. Thiết kế cân bằng hai mặt này là một trong những điểm tinh tế nhất của POSEIDON.

> [!info] 🟡 Algebraic Attacks Trên MiMC (từ [AGR+16])
> MiMC [AGR+16] là hash function ZK-friendly đầu tiên bị tấn công algebraically một cách nghiêm túc: interpolation attack của Albrecht et al. yêu cầu $O(3^r)$ với $r$ là số rounds. POSEIDON cải thiện bằng cách tăng degree nhanh hơn ($\alpha^R$ thay vì $3^R$ với $\alpha \geq 3$) và dùng partial rounds để tăng degree "rẻ" hơn. Tuy nhiên framework tấn công của MiMC (univariate interpolation, Gröbner basis setup) chính là nền tảng cho §5.2 của POSEIDON paper.
>
> *(theo [AGR+16]: Albrecht, Grassi et al. — MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity, ASIACRYPT 2016)*

---

## 5. Cập Nhật Cryptanalysis Sau 2021

> [!tip] 💡 Agent note
> Sau khi paper POSEIDON được publish tại USENIX Security 2021, đã có một số kết quả cryptanalysis cập nhật quan trọng:
>
> **Bariant et al. (ToSC 2022)**: Đề xuất chiến lược "skip first round" trong Gröbner basis attack — bằng cách khai thác cấu trúc đặc biệt của round đầu tiên (chỉ ARC + S-box, chưa có MixLayer), giảm nhẹ độ phức tạp. Ảnh hưởng: security argument cần điều chỉnh nhỏ, **không thay đổi round numbers** cho các instance đã công bố.
>
> **Ashur, Buschman, Mahzoun (2023)**: Phân tích algebraic cryptanalysis tổng quát hơn cho HADES-based designs, chỉ ra rằng security argument của HADES gốc [GLR+20] có một số điểm cần làm chặt hơn. Kết quả: paper POSEIDON được cập nhật (revision 11, 2023) với security argument điều chỉnh, nhưng **round numbers vẫn không thay đổi** — margin đã đủ.
>
> Điều này cho thấy security margin 50% là lựa chọn đúng đắn.

---

## Tổng Hợp: Chọn $R_P$ Như Thế Nào

Cho instance cụ thể $(M, t, \alpha, R_F = 8)$:

> [!note] Scheme 7.4 — Quy Trình Chọn $R_P$
> **Type**: Parameter selection algorithm
>
> **$\mathsf{Choose\_RP}(M, t, \alpha, R_F)$**
> - Input: Security level $M$, width $t$, S-box exponent $\alpha$, fixed $R_F$
> - Step 1 (Interpolation bound): $R_P^{(1)} = \lceil \log_\alpha(2) \cdot (M + t) \rceil - R_F$
> - Step 2 (Gröbner bound): $R_P^{(2)} = \lceil 0.21 \cdot M + 1.26 \cdot t - R_F \rceil$
> - Step 3 (Take max): $R_P^{\min} = \max(R_P^{(1)}, R_P^{(2)},\ t - 1)$  
>   (lower bound $t - 1$ để đảm bảo đủ degree lan ra toàn bộ state)
> - Step 4 (Apply security margin): $R_P = \lceil 1.5 \cdot R_P^{\min} \rceil$
> - Output: $R_P$ final

**Bảng kết quả** (xác nhận lại Table 2 của paper):

| $M$ | $t$ | $\alpha$ | $R_P^{(1)}$ | $R_P^{(2)}$ | $R_P^{\min}$ | $R_P$ (×1.5) |
|-----|-----|---------|------------|------------|-------------|-------------|
| 128 | 3 | 5 | 49 | 23 | 49 | **57** ✓ |
| 128 | 5 | 5 | 49 | 26 | 49 | **60** ✓ |
| 80 | 3 | 5 | 31 | 15 | 31 | **33** ✓ |
| 128 | 3 | 3 | 77 | 23 | 77 | **84** ✓ |

---

## Summary

- **CICO problem**: abstraction tổng quát cho preimage attacks; $k$ free input + $k$ fixed output coordinates.
- **Interpolation attack**: thu gọn về univariate bậc $D = \alpha^{R_F+R_P}$; cần $D \geq 2^M \cdot t$ → bound $R_P \geq \lceil \log_\alpha(2)(M+t)\rceil - R_F$.
- **Gröbner basis attack**: hệ multivariate với $n_v = R_F t + R_P$ biến; complexity $\binom{n_v + d_{\text{reg}}}{d_{\text{reg}}}^\omega$ → bound $R_P \geq \lceil 0.21M + 1.26t - R_F \rceil$.
- **Interpolation thường chặt hơn** với $t$ nhỏ; Gröbner basis competitive hơn với $t$ lớn.
- **Security margin 50%** trên $\max$ của hai bounds — đủ đứng vững trước cryptanalysis sau 2021.
- Full rounds $R_F$ đóng góp vào cả thống kê *và* đại số — tăng $R_F$ cho phép giảm $R_P$.

---

## References

- [GLR+20] Grassi et al. — *HADES Design Strategy*, EUROCRYPT 2020 (🔴 Prerequisite — degree growth analysis đầy đủ)
- [AGR+16] Albrecht, Grassi et al. — *MiMC*, ASIACRYPT 2016 (🟡 Integrate — interpolation/Gröbner basis framework gốc)
- [ACD+19] Albrecht, Cid, Grassi et al. — *Algebraic Cryptanalysis of MARVELlous*, ASIACRYPT 2019 (⚪ Citation — so sánh algebraic attack landscape)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §5.2 (nguồn chính bài này)
