---
title: "07. Factoring with Partial Information"
type: attack
tags: [coppersmith, factoring, rsa, partial-key-exposure, theorem-4, theorem-5, lesson-07]
aliases: [Partial Key Exposure, Factoring High Bits Known]
source: "Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities — Don Coppersmith, 1997"
created: 2026-03-26
---

> **Prerequisites**: [[06-bivariate-integer-case|06. Bivariate Integer Case]] (Theorem 2, Corollary 2 — cần trực tiếp); [[03-determinant-analysis-solution|03. Determinant Analysis & Solution]] (Theorem 1 — dùng trong Theorem 5)  
> 🔴 **Prerequisite references**: [RSA78] RSA; [LLL82] LLL algorithm  
> **Lesson type**: Attack  
> **Covers**: §11 (Factoring with High Bits Known), Theorem 4, Theorem 5
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $P, Q$ | Hai thừa số nguyên tố (chưa biết) với $N = PQ$ | $P, Q$ |
> | $P_0, Q_0$ | Xấp xỉ đã biết của $P$, $Q$ (high bits hoặc low bits) | $P_0, Q_0$ |
> | $x_0, y_0$ | Phần chưa biết: $P = P_0 + x_0$, $Q = Q_0 + y_0$ | $x_0, y_0$ |
> | $\ell$ | $\lceil\log_2 P\rceil$ — độ dài bit của $P$ | $\ell$ |

---

## 1. Bối cảnh

### 1.1 Mô hình partial key exposure

**Kịch bản**: Attacker biết $N = PQ$ và biết **một phần bit** của $P$. Điều này xảy ra trong thực tế khi:

- **Side-channel leak**: Một phần key material bị lộ qua timing, power analysis
- **Intentional exposure**: Một số ID-based RSA scheme encode thông tin vào high bits của $P$
- **Memory dump**: Partial key reconstruction sau khi dump bộ nhớ
- **Fault attack**: Một phần key bị corrupt hoặc recovered

**Câu hỏi**: Bao nhiêu bit của $P$ là đủ để factor $N$?

### 1.2 Lịch sử và so sánh

| Phương pháp | Bit của $P$ cần biết | Công cụ |
|-------------|---------------------|---------|
| Rivest-Shamir [RS86] | $\approx \frac{1}{3}\log_2 N$ | Elementary |
| Coppersmith (1995, [Cop95c]) | $\frac{3}{10}\log_2 N$ | Lattice (kém hiệu quả hơn) |
| **Coppersmith §11 (paper này)** | $\frac{1}{4}\log_2 N$ | Bivariate lattice (Theorem 2) |

**§11 là cải tiến đáng kể**: giảm từ $\frac{1}{3}$ xuống $\frac{1}{4}$ số bit cần biết.

---

## 2. Theorem 4 — High Bits của $P$ Known

### 2.1 Setup

Giả sử biết $\frac{1}{4}\log_2 N$ bit cao của $P$. Do đó cũng biết gần đúng $\frac{1}{4}\log_2 N$ bit cao của $Q$ (từ $Q \approx N/P_0$).

Đặt:

$$
P = P_0 + x_0, \quad Q = Q_0 + y_0
$$

với $P_0$, $Q_0$ là các xấp xỉ đã biết, $x_0$ và $y_0$ là các phần chưa biết. Từ định nghĩa $\frac{1}{4}\log_2 N$ bit cao:

$$
\lvert x_0\rvert < P_0 N^{-1/4} = X, \quad \lvert y_0\rvert < Q_0 N^{-1/4} = Y
$$

### 2.2 Đưa về bivariate equation

Định nghĩa đa thức:

$$
p(x,y) = (P_0 + x)(Q_0 + y) - N = P_0 Q_0 - N + Q_0 x + P_0 y + xy
$$

Nghiệm $(x_0, y_0)$ thỏa $p(x_0, y_0) = PQ - N = 0$.

**Các thông số của $p$**: bậc $\delta = 1$ mỗi biến (đa thức song tuyến tính — bilinear).

### 2.3 Tính $W$

$$
W = \max_{i,j} \lvert\tilde{p}_{ij}\rvert = \max\!\bigl(\lvert P_0 Q_0 - N\rvert,\; Q_0 X,\; P_0 Y,\; XY\bigr)
$$

Ước tính từng hạng:

- $P_0 Q_0 \approx N$ (vì $P_0 \approx P$, $Q_0 \approx Q$) nên $\lvert P_0 Q_0 - N\rvert \lesssim N^{3/4}$
- $Q_0 X \approx Q \cdot P N^{-1/4} \approx N^{3/4}$
- $P_0 Y \approx P \cdot Q N^{-1/4} \approx N^{3/4}$
- $XY = P_0 Q_0 N^{-1/2} \approx N^{1/2}$

Do đó $W \approx N^{3/4}$.

### 2.4 Kiểm tra điều kiện Corollary 2

Corollary 2 yêu cầu $XY \leq W^{2/(3\delta)}$. Với $\delta = 1$:

$$
XY \approx N^{1/2} \approx (N^{3/4})^{2/3} = W^{2/3} = W^{2/(3 \times 1)}
$$

**Điều kiện được thỏa** (xấp xỉ, với sai số hằng số — paper ghi "easy computation").

> [!note] Scheme 7.1 — Factor $N$ với High Bits của $P$ Known
> **Type**: Integer Factorization Attack  
> **Setting**: $N = PQ$, biết $\frac{1}{4}\log_2 N$ bit cao của $P$ (và do đó của $Q$)
>
> **$\mathsf{FactorHighBits}(N,\, P_0,\, Q_0)$**
> - Input: $N$, xấp xỉ $P_0 \approx P$ và $Q_0 \approx Q$ ($\frac{1}{4}\log_2 N$ bit chính xác)
> - **Bước 1**: Xây $p(x,y) = (P_0+x)(Q_0+y) - N$; đặt $X = P_0 N^{-1/4}$, $Y = Q_0 N^{-1/4}$
> - **Bước 2**: Tính $W = N^{3/4}$; verify $XY \lesssim W^{2/3}$
> - **Bước 3**: Áp dụng $\mathsf{CoppersmithBivariate}(p,\, X,\, Y,\, \varepsilon)$ (Lesson 06)
> - **Bước 4**: Thuật toán trả về $(x_0, y_0)$ → $P = P_0 + x_0$, $Q = Q_0 + y_0$
> - **Bước 5**: Verify $PQ = N$
> - Output: Factorization $N = PQ$

> [!abstract] Theorem 4 — Factoring với High Bits Known
> Trong thời gian polynomial, có thể factor $N = PQ$ nếu biết $\frac{1}{4}\log_2 N$ bit cao của $P$.

**Proof.** Xây $p(x,y)$ như trên. Corollary 2 (Lesson 06) áp dụng được vì $XY \approx W^{2/(3\delta)}$ với $\delta=1$. Thuật toán trả về $(x_0,y_0)$ cho factorization trong thời gian $\text{poly}(\log W, 2^\delta) = \text{poly}(\log N)$. $\blacksquare$

### 2.5 Ứng dụng: ID-based RSA scheme

Paper đề cập scheme của Vanstone-Zuccherato [VZ95]: một 1024-bit $N = PQ$ trong đó $264$ bit cao của $P$ (và $Q$) được chọn từ identity của người dùng (public). Định lý 4 cho thấy điều này **đủ để factor $N$**: $264 > \frac{1}{4} \times 1024 = 256$ bit.

> [!danger] Implication cho ID-based RSA
> Nếu $\frac{1}{4}\log_2 N$ bit cao của $P$ là public (ví dụ mã hóa identity), thì $N$ có thể bị factor trong polynomial time. Scheme của [VZ95] bị phá bởi Theorem 4.

---

## 3. Theorem 5 — Low Bits của $P$ Known

### 3.1 Tại sao cần twist trong proof?

Nếu biết $\frac{1}{4}\log_2 N$ bit **thấp** của $P$ thay vì bit cao, kết quả vẫn đúng nhưng cần chú ý:

Đặt $k = \lfloor\frac{1}{4}\log_2 N\rfloor$ nên $2^k \approx N^{1/4}$. Viết:

$$
P = 2^k x_0 + P_0, \quad Q = 2^k y_0 + Q_0
$$

với $P_0$, $Q_0$ là các phần **low bits** đã biết.

Định nghĩa đa thức:

$$
p(x,y) = \frac{(2^k x + P_0)(2^k y + Q_0) - N}{2^k}
$$

$$
= 2^k xy + Q_0 x + P_0 y + \frac{P_0 Q_0 - N}{2^k}
$$

**Tại sao chia $2^k$?** Đa thức "tự nhiên" $p'(x,y) = (2^k x + P_0)(2^k y + Q_0) - N$ có tất cả hệ số chia hết cho $2^k$ (hệ số của $xy$ là $2^{2k}$, các hệ số bậc 1 là $2^k Q_0$ và $2^k P_0$). Do đó $p' = 2^k \times p$ — $p'$ **rút gọn được** trên $\mathbb{Z}$! Điều này vi phạm giả thiết của Theorem 2 (cần $p$ không rút gọn được).

> [!warning] Twist kỹ thuật: đa thức phải irreducible
> Không được dùng $p'(x,y) = (2^k x + P_0)(2^k y + Q_0) - N$ trực tiếp vì $\gcd$ hệ số $= 2^k \neq 1$. Row reduction trong construction $M_2$ sẽ thất bại. Phải dùng $p = p'/2^k$.

> [!note] Scheme 7.2 — Factor $N$ với Low Bits của $P$ Known
> **Type**: Integer Factorization Attack  
> **Setting**: $N = PQ$, biết $k = \lfloor\frac{1}{4}\log_2 N\rfloor$ bit thấp của $P$
>
> **$\mathsf{FactorLowBits}(N,\, P_0,\, Q_0)$**
> - Input: $N$, $P_0$ (low $k$ bits của $P$), $Q_0$ (low $k$ bits của $Q = N/P$)
> - **Lặp** trên giá trị $\ell = \lceil\log_2 P\rceil$ (khoảng $\log_2 N/2$ bit):
>   - Đặt $X = 2^{\ell-k} \approx P N^{-1/4}$, $Y = N \cdot 2^{1-\ell-k} \approx Q N^{-1/4}$
>   - Xây $p(x,y) = 2^k xy + Q_0 x + P_0 y + (P_0 Q_0 - N)/2^k$
>   - Kiểm tra $(P_0 Q_0 - N)/2^k \in \mathbb{Z}$ (ngầm định từ định nghĩa low bits)
>   - Áp dụng $\mathsf{CoppersmithBivariate}(p,\, X,\, Y,\, \varepsilon)$
>   - Nếu trả về $(x_0, y_0)$ hợp lệ: $P = 2^k x_0 + P_0$
> - Output: $P$ (và $Q = N/P$)

> [!abstract] Theorem 5 — Factoring với Low Bits Known
> Trong thời gian polynomial, có thể factor $N = PQ$ nếu biết $\frac{1}{4}\log_2 N$ bit **thấp** của $P$.

**Proof.** Tương tự Theorem 4 với $p(x,y)$ đã điều chỉnh. $XY = O(N^{1/2})$ và $W = 2(N^{3/4})$ (hằng số khác đôi chút → trial and error). Corollary 2 áp dụng. $\blacksquare$

---

## 4. Cải thiện và Hệ quả Thực tiễn

### 4.1 So sánh với các phương pháp cũ

| Phương pháp | Bit cần biết | Vị trí | Phức tạp |
|-------------|-------------|--------|---------|
| [RS86] Rivest-Shamir | $\frac{1}{3}\log_2 N$ | High | Elementary, $O(N^{1/3})$ |
| [Cop95c] Coppersmith 1995 | $\frac{3}{10}\log_2 N$ | High | Lattice (less efficient) |
| **Theorem 4** | $\frac{1}{4}\log_2 N$ | High | Bivariate LLL, poly |
| **Theorem 5** | $\frac{1}{4}\log_2 N$ | Low | Bivariate LLL + loop $\ell$ |

$\frac{1}{4}\log_2 N$ được conjecture là **optimal** cho phương pháp lattice này — xem §13.

### 4.2 Ý nghĩa cho RSA 1024-bit

$$
\frac{1}{4} \times 1024 = 256 \text{ bit}
$$

Nếu bất kỳ 256 bit liên tiếp của $P$ bị lộ (high hoặc low), $N$ có thể bị factor trong polynomial time. Điều này có ảnh hưởng trực tiếp đến:

- Các scheme embed identity vào $P$ (xem §11 — Vanstone-Zuccherato)
- Side-channel attacks tiết lộ partial key
- Memory forensics từ secure enclaves

> [!tip] 💡 Agent note
> Paper chỉ xét high bits và low bits. Trường hợp **middle bits** (giữa $P$) khó hơn nhiều và không được giải quyết trong paper này. Đây là một open problem — các công trình sau (Boneh, Durfee, Frankel 1998; Ernst et al. 2005) mở rộng cho trường hợp tổng quát.

---

## Summary

- **Theorem 4**: Biết $\frac{1}{4}\log_2 N$ bit **cao** của $P$ → factor $N$ trong poly time. Đặt $p(x,y) = (P_0+x)(Q_0+y)-N$, $\delta=1$; $XY \approx N^{1/2} \approx W^{2/3}$ → Corollary 2 áp dụng.
- **Theorem 5**: Biết $\frac{1}{4}\log_2 N$ bit **thấp** của $P$ → cùng kết quả, nhưng cần chia $2^k$ để đa thức irreducible.
- Cải thiện từ $\frac{1}{3}$ [RS86] xuống $\frac{1}{4}$ bit — tốt hơn đáng kể, conjectured optimal.
- Ứng dụng: phá ID-based RSA schemes lộ nhiều bit của $P$; partial key exposure attacks.

---

## References

- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, §11
- [RS86] Rivest, Shamir — *Efficient factoring based on partial information*, EUROCRYPT '85 (⚪)
- [Cop95c] Coppersmith — *Factoring with a hint*, IBM Research Report RC 19905 (⚪)
- [VZ95] Vanstone, Zuccherato — *Short RSA keys and their generation*, J. Cryptology 1995 (⚪)
- [LLL82] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, 1982 (🔴 Prerequisite)
- [RSA78] Rivest, Shamir, Adleman — RSA (🔴 Prerequisite)
