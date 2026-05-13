---
title: "05. Applications, Results & Open Problems"
type: survey
tags: [approximate-gcd, acdp, small-inverse-problem, rsa, wiener, open-problems, survey, lesson-05]
aliases: [ACDP Applications, Small Inverse Problem]
source: "Approximate Integer Common Divisors — Nick Howgrave-Graham, CaLC 2001"
created: 2026-03-25
---

> **Prerequisites**: [[01-acdp-framework|01. ACDP Framework]], [[02-continued-fraction-acdp|02. Continued Fraction Attack]], [[03-lattice-pacdp|03. Lattice Attack on PACDP]], [[04-lattice-gacdp|04. Lattice Attack on GACDP]]  
> 🔴 **Prerequisite references**: Boneh & Durfee [3] (small inverse problem — cryptanalysis of RSA with small $d$); Wiener [15] (continued fraction attack on RSA)  
> **Lesson type**: Survey  
> **Covers**: §5 An Equivalent Problem?, §6 Results (Figure 61, Table 1), §7 Conclusions and Open Problems
>
> **Notation** (kế thừa toàn bộ từ Lessons 01–04 — không có ký hiệu mới)

---

## Overview

Ba lessons trước tập trung vào **xây dựng kỹ thuật**: định nghĩa bài toán, continued fraction, lattice. Lesson này nhìn ra bức tranh lớn hơn:

1. **§5** — Bài toán ACDP liên hệ như thế nào với *small inverse problem* — bài toán "= 1" thay vì "= 0"? Và tại sao bound của Boneh-Durfee ($1-1/\sqrt{2}$) không thể improve lên $1/2$ mà không kéo theo hệ quả nghiêm trọng?
2. **§6** — Tổng hợp kết quả: Figure 61 (so sánh bốn bounds) và Table 1 (kết quả thực nghiệm).
3. **§7** — Các câu hỏi mở mà paper đặt ra — một số đã được giải quyết trong các công trình sau.

---

## §5: Bài Toán Tương Đương — "= 0" Và "= 1"

### Hai Dạng Bài Toán Liên Quan

Trong suốt paper, ta xét bài toán ACDP dạng **"= 0"**: tìm $d$ lớn sao cho $d \mid (a_0 + x)$ và $d \mid (b_0 + y)$. Tương đương, tìm $a', b'$ nhỏ sao cho:

$$
b'(a_0 + x) - a'(b_0 + y) = 0
$$

trong đó $a' = (a_0+x)/d$ và $b' = (b_0+y)/d$.

Paper §5 nhận thấy một bài toán **rất gần**: tìm $a', b'$ nhỏ và $x, y$ nhỏ sao cho:

$$
b'(a_0 + x) - a'(b_0 + y) = 1
$$

> [!note] Definition 5.1 — Small Inverse Problem (SIP)
> **Input**: Hai số nguyên $a_0, b_0$ và bounds $X, Y, M$.  
> **Tìm**: Các số nguyên $a', b', x, y$ với $|a'|, |b'| < M$ và $|x| \leq X$, $|y| \leq Y$ sao cho:
>
> $$
> b'(a_0 + x) - a'(b_0 + y) = 1
> $$

Tên "small inverse problem" xuất phát từ dạng partial của bài toán này trong RSA: tìm $d$ (private exponent) nhỏ thoả $ed \equiv 1 \pmod{\phi(N)}$ — đây chính là điều kiện RSA decryption.

> [!tip] 💡 Agent note
> Paper thừa nhận: không có **reduction** đã biết nào giữa bài toán "= 0" (PACDP) và bài toán "= 1" (SIP) theo cả hai chiều. Tuy nhiên kỹ thuật dùng để giải chúng **rất giống nhau** — cùng lattice construction, cùng LLL, cùng polynomial root-finding. Đây là một trong những open problems thú vị nhất mà paper đặt ra.

---

### Kết Nối Với Wiener's Attack Và Boneh-Durfee

> [!info] 🟡 Wiener's Attack [15] — Dạng SIP Partial
> Wiener (1990) chứng minh: nếu RSA private exponent $d < N^{1/4}$, ta có thể tìm $d$ từ $(N, e)$ bằng continued fraction expansion của $e/N$.
>
> Bài toán Wiener là dạng **partial SIP** ($y = 0$, $b_0 = N$, $a_0 = e$): tìm $d, k$ nhỏ sao cho $d \cdot e - k \cdot \phi(N) = 1$, tức $|e/N - k/d| < 1/(2d^2)$ → $k/d$ là convergent của $e/N$.
>
> *(theo [15]: Wiener — Cryptanalysis of Short RSA Secret Exponents, IEEE Trans. Inf. Theory 36, 553–558, 1990)*

> [!info] 🟡 Boneh-Durfee Attack [3] — SIP Với Lattice
> Boneh & Durfee (2000) improve Wiener bằng Coppersmith's lattice technique: có thể tìm $d$ khi $d < N^{1-1/\sqrt{2}} \approx N^{0.292}$.
>
> Bound $1-1/\sqrt{2}$ trông "không tự nhiên". Boneh-Durfee [3] đặt câu hỏi: liệu có thể improve lên $d < N^{1/2}$?
>
> *(theo [3]: Boneh & Durfee — Cryptanalysis of RSA with Private Key d Less Than N^{0.292}, IEEE Trans. Inf. Theory 46(4), 2000)*

### Tại Sao Bound $1-1/\sqrt{2}$ Có Thể Là Tự Nhiên

Đây là đóng góp quan trọng của §5. Howgrave-Graham chỉ ra mối liên hệ giữa SIP và PACDP:

**Quan sát**: Partial SIP (dạng Wiener, $y=0$) và PACDP partial ($y=0$) có cùng cấu trúc lattice với cùng tham số $\alpha_0$.

Nếu bound của partial SIP có thể improve từ $\beta_0 = 1/2 - \varepsilon$ (tương ứng $\alpha_0 = 1/2$) thì điều đó sẽ imply một **polynomial-time factoring algorithm cho RSA moduli**!

> [!abstract] Claim 5.2 — Implication Nếu SIP Bound Improve Đến $1/2$
> Nếu partial SIP có thể giải với $\beta_0 = 1/2 - \varepsilon$ tại $\alpha_0 = 1/2$, thì tồn tại thuật toán đa thức để factor RSA modulus $N = pq$.

**Argument sketch.** Biết $N$ và muốn tìm $p$. Đoán một số hữu hạn ($O(1)$) top-order bits của $p$ (gọi là $p_0$). Với mỗi $p_0$, đặt $a_0 = p_0$, $b_0 = N$, và xét PACDP tìm $d = p$ với sai số $|x_0| = |p - p_0| < N^{1/4}$, tức $\beta_0 = 1/4$ và $\alpha_0 = 1/2$.

Nếu PACDP có thể giải khi $\beta_0$ gần $\alpha_0^2 = 1/4$ (từ Theorem 3.4 của [[03-lattice-pacdp|Lesson 03]]) — điều này **đã chứng minh được**! Vậy thì tại sao lại dẫn đến factoring issue?

Vấn đề ở chỗ liên hệ ngược: nếu bound của SIP cũng đạt $1/2 - \varepsilon$ ở $\alpha_0 = 1/2$, thì SIP và PACDP có **cùng bound** tại điểm đó. Điều này có nghĩa là, kết hợp với các kỹ thuật đã biết, ta có thể recover bits của $p$ đủ nhiều để factor $N$ trong polynomial time. Vì factoring được tin là hard, bound $1-1/\sqrt{2}$ của Boneh-Durfee **có thể thực sự là barrier tự nhiên** cho SIP — không phải artifact của kỹ thuật.

> [!warning] Không Phải Proof Hardness
> Argument trên **không prove** rằng SIP không thể giải với $\beta_0 > 1/2 - \varepsilon$. Nó chỉ cho thấy: nếu improve được, và nếu factoring là hard, thì hai bài toán có thể **không tương đương** (reduction chỉ theo một chiều). Câu hỏi liệu SIP và PACDP có equivalent hay không vẫn là open problem.

---

## §6: Tổng Hợp Kết Quả

### Figure 61: Bốn Bounds Trong Một Hình

Paper tổng hợp tất cả kết quả trong biểu đồ trên plane $(\alpha, \beta)$ — $\alpha = \log_{b_0} d$ (trục x) và $\beta = \log_{b_0} X$ (trục y):

| Đường | Thuật toán | Biểu thức | Đặc điểm |
|-------|-----------|-----------|----------|
| Parabol trên | **PACD_L** | $\beta = \alpha^2$ | Tốt nhất; hoạt động $\forall \alpha \in (0,1)$ |
| Curve giữa | **GACD_L** | $\beta = 1 - \frac{\alpha}{2} - \sqrt{1-\alpha-\frac{\alpha^2}{2}}$ | Heuristic; $\alpha < 2/3$ |
| Gãy khúc | GACD_CF | $\beta = \max(2\alpha-1, 1-\alpha)$ | Deterministic; $\alpha > 1/2$ |
| Thẳng | PACD_CF | $\beta = 2\alpha - 1$ | Wiener-equivalent; $\alpha > 1/2$ |

**Nhận xét về thứ tự**: PACD_L > GACD_L > GACD_CF > PACD_CF trên toàn plane. Nghịch lý biểu kiến: tại sao **PACDP** ($b_0$ biết chính xác, ít thông tin hơn về $b$) lại cho bound tốt hơn **GACDP** ($b_0$ chỉ xấp xỉ)?

Lý do: khi $b_0$ biết chính xác, ta không cần handle sai số $y_0$ — lattice PACDP chỉ là univariate, dimension nhỏ hơn, determinant nhỏ hơn tương đối, LLL bound tốt hơn. Trong GACDP, dimension tăng mạnh ($m \sim h^2/2$ vs $h+1$) nhưng bound cải thiện ít hơn.

### Table 1: Kết Quả Thực Nghiệm

Experiments chạy trên Pentium II 700MHz, C++ + NTL Library [13], $|a_0| \approx |b_0| \approx 1024$ bits:

| $\alpha$ | Bits của $d$ | $\beta_{max}$ | $h$ | $u$ | Thời gian (s) | $\delta$ (ratio) | Bits error |
|---------|-------------|--------------|-----|-----|--------------|-----------------|------------|
| 0.2 | 205 | 0.016 | 10 | 1 | 731 | 0.941 | 5 |
| 0.3 | 307 | 0.041 | 5–7 | 1 | 8–43 | 0.965–0.998 | 15–22 |
| 0.4 | 410 | 0.079 | 4–7 | 1–2 | 2–197 | 0.984–0.990 | 43–56 |
| 0.5 | 512 | 0.137 | 4–6 | 2–3 | 9–261 | 0.993–0.996 | 103–113 |
| 0.6 | 614 | 0.231 | 4–6 | 3–4 | 18–507 | 0.990–0.998 | 207–216 |

**Cột $\delta$**: Tỉ số giữa norm vector LLL thu được và Minkowski bound (lý thuyết). Giá trị gần 1 xác nhận:
- Không có sublattice nào tốt hơn bị bỏ qua.
- Determinant analysis không quá pessimistic.
- Algebraic independence heuristic: **0 failures** trong tất cả experiments.

> [!success] Kết Quả Thực Nghiệm Xác Nhận Lý Thuyết
> Mọi instance đều thành công. Thời gian tăng đa thức theo $\alpha$ (và theo $h, u$). Bound bits error quan sát được khớp với $\beta_{max} \cdot |b_0|_{bits}$. Đặc biệt tại $\alpha = 0.2$ (divisor chỉ 205 bits trong 1025-bit number, $\beta_{max} = 0.016$ ≈ 16 bits error) — một kết quả đáng kể vì divisor rất nhỏ.

> [!warning] Trade-off Thời Gian — Accuracy
> Khi $\alpha$ nhỏ (divisor nhỏ), cần $h$ lớn hơn → lattice dimension lớn hơn → LLL chạy lâu hơn. Tại $\alpha = 0.2$, $h=10$ mất 731 giây. Đây là cái giá của việc vượt qua giới hạn $\alpha > 1/2$ của continued fraction.

---

## §7: Open Problems

Paper kết thúc với bảy câu hỏi mở. Đây là danh sách đầy đủ theo paper, cùng với ngữ cảnh:

### 1. Tìm Thêm Ứng Dụng Của ACDP

> [!question] Open Problem 1
> Tìm thêm ứng dụng của ACDP (và đặc biệt GACDP) trong cryptography hoặc computational mathematics.

**Ngữ cảnh**: Tại thời điểm 2001, ứng dụng duy nhất được biết là PACDP → attack Okamoto [11] và liên hệ với factoring/RSA attacks. Paper thừa nhận GACDP "thiếu ứng dụng rõ ràng". 

> [!tip] 💡 Agent note
> Sau 2001, ACDP (đặc biệt GACDP với nhiều samples) trở thành **nền tảng của Fully Homomorphic Encryption (FHE)** — đặc biệt scheme của van Dijk, Gentry, Halevi, Vaikuntanathan (DGHV, 2010) dùng GACDP với nhiều approximations như hardness assumption. Đây là "ứng dụng" lớn nhất mà paper kỳ vọng.

### 2. Reduction Giữa "= 0" Và "= 1"

> [!question] Open Problem 2
> Tìm reduction (theo cả hai chiều hoặc một chiều) giữa PACDP ("= 0") và small inverse problem ("= 1").

**Ngữ cảnh**: Như phân tích ở §5, hai bài toán có kỹ thuật giải giống nhau nhưng không biết reduction. Nếu tìm được reduction PACDP → SIP, có thể improve bound của SIP. Nếu tìm được SIP → PACDP, điều đó imply SIP hard (vì PACDP có liên hệ với factoring).

### 3. Generalization: $d^r$ Chia Hết Một Input

> [!question] Open Problem 3
> Phân tích ACDP khi $d^r$ (thay vì $d$) chia hết một trong các inputs. Đây là trường hợp liên quan đến factoring $N = p^r q$ với $r > 1$.

**Ngữ cảnh**: Paper §3 note rằng kỹ thuật lattice cũng áp dụng với $r > 1$ (giống như [5] cho $N = p^r q$), nhưng chưa phân tích đầy đủ bounds cho ACDP với power-divisors.

### 4. Giải GACDP Với $\alpha \geq 2/3$

> [!question] Open Problem 4
> Tìm thuật toán (nếu tồn tại) cho GACDP với $\alpha \geq 2/3$ — hoặc prove rằng không thể có polynomial-time algorithm.

**Ngữ cảnh**: Như [[04-lattice-gacdp|Lesson 04]] trình bày, khi $\alpha \geq 2/3$ số lượng solutions $(x_0, y_0)$ là exponential → không thể enumerate. Cần cách tiếp cận hoàn toàn khác, hoặc cần chứng minh hardness.

### 5. Prove Algebraic Independence Của LLL Output

> [!question] Open Problem 5 (Key Open Problem)
> Prove rằng trong GACD_L, hai short vectors thu được từ LLL luôn tương ứng với hai polynomials algebraically independent — biến GACD_L từ heuristic thành rigorous polynomial-time algorithm.

**Ngữ cảnh**: Đây là **open problem trung tâm** của paper. Manders & Adleman [9] chứng minh không có proof tổng quát cho bivariate modular equations, nhưng điều đó không loại trừ proof trong trường hợp cụ thể của GACD_L. Cùng vấn đề này xuất hiện trong Boneh-Durfee [3].

> [!tip] 💡 Agent note
> Đây vẫn là open problem tính đến 2026. Không ai prove được algebraic independence của LLL output trong setting này. Tuy nhiên, không có counterexample nào được tìm thấy — making it one of the most empirically-supported open conjectures in lattice-based cryptography.

### 6. Cải Thiện Bounds GACDP

> [!question] Open Problem 6
> Liệu bounds cho GACD_L có thể improve không? Cụ thể:
> - (a) Determinant analysis có quá pessimistic?
> - (b) Có sublattice nào tốt hơn không?
> - (c) Có lattice construction hoàn toàn khác cho GACDP không?

**Ngữ cảnh**: Cột $\delta \approx 1$ trong Table 1 là bằng chứng thực nghiệm rằng (a) và (b) unlikely — vectors thu được đã gần Minkowski bound. Tuy nhiên (c) là câu hỏi hoàn toàn mở: có thể có lattice construction khác cho GACDP với bounds tốt hơn.

### 7. Bounds Tối Ưu Cho Polynomial-Time ACDP

> [!question] Open Problem 7
> Bounds $\beta < \alpha^2$ (PACD_L) và $\beta < 1 - \alpha/2 - \sqrt{1-\alpha-\alpha^2/2}$ (GACD_L) có phải là tight không — tức là, có phải là bounds tốt nhất có thể cho polynomial-time algorithms?

**Ngữ cảnh**: Nếu bounds này không tight, tức là có thể handle error lớn hơn với divisor nhỏ hơn, thì sẽ có ứng dụng mạnh hơn trong cryptanalysis. Ngược lại, nếu chứng minh được tightness, ta có characterization hoàn chỉnh về độ khó của ACDP.

---

## Kết Luận: Đóng Góp Của Paper

Nhìn lại toàn bộ paper, ba đóng góp chính:

**1. Framework thống nhất**: Nhận ra rằng nhiều kết quả rời rạc (Coppersmith factoring, Boneh-Durfee RSA attack, Howgrave-Graham factoring $N=p^r q$, Wiener attack) đều là special cases của PACDP. Framework ACDP làm rõ ranh giới giữa các bài toán.

**2. PACD_L với $\alpha < 1/2$**: Chứng minh rigorous rằng PACDP có thể giải với $\alpha < 1/2$ — vượt qua giới hạn "tự nhiên" của continued fraction. Đây là **kết quả proved hoàn toàn**.

**3. GACD_L (heuristic)**: Đề xuất thuật toán heuristic cho GACDP với bound cụ thể, xác nhận bằng thực nghiệm. Mở ra hướng nghiên cứu mới về approximate GCD trong cryptography.

---

## Summary Toàn Bộ Course

| Lesson | Nội dung chính | Kết quả then chốt |
|--------|---------------|-------------------|
| 01 | ACDP framework, 4 algorithm definitions | Taxonomy PACDP/GACDP; parameters $\alpha, \beta, M, X$ |
| 02 | Continued fraction attack | Bound $\beta < 2\alpha-1$ (Wiener-equivalent) |
| 03 | Lattice attack on PACDP | **Bound $\beta < \alpha^2$**, mọi $\alpha \in (0,1)$ |
| 04 | Lattice attack on GACDP | **Heuristic bound** $\beta < 1-\frac{\alpha}{2}-\sqrt{1-\alpha-\frac{\alpha^2}{2}}$ |
| 05 | Applications, results, open problems | SIP ↔ PACDP; Figure 61; 7 open problems |

---

## References

- [3] Boneh & Durfee — *Cryptanalysis of RSA with $d < N^{0.292}$*, IEEE Trans. Inf. Theory 46(4), 2000 (🟡)
- [15] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory 36, 1990 (🟡)
- [9] Manders & Adleman — *NP-complete decision problem for quadratics*, JCSS 16(2), 1978 (⚪)
- [11] Okamoto — *Fast public-key cryptosystem using congruent polynomials*, Electronics Letters 1986 (🟡)
- [13] Shoup — NTL Library v4.2 (⚪)
- [2] Boneh — *Twenty years of attacks on the RSA cryptosystem*, AMS Notices 46(2), 1999 (⚪)
