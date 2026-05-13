---
title: "06. Factoring Application & Experiments"
type: attack
tags: [coppersmith, rsa, factoring, partial-key-exposure, experiments, lesson-06]
aliases: [Factoring High Bits Known, RSA Partial Key Exposure]
source: "Finding Small Roots of Bivariate Integer Polynomial Equations: a Direct Approach — Jean-Sébastien Coron, Eurocrypt 2007"
created: 2026-03-25
---

> **Prerequisites**: [[04-complexity-and-correctness|04. Complexity & Correctness]] — Theorem 2; RSA cryptosystem (cơ bản)  
> **Lesson type**: Attack  
> **Covers**: §4 (Theorem 4, practical experiments — Tables 1–2); §5 (Conclusion)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $N = pq$ | RSA modulus với $p, q$ nguyên tố |
> | $P_0$ | Phần bit cao của $p$ đã biết |
> | $Q_0$ | Phần bit cao của $q$ đã biết ($Q_0 \approx N/P_0$) |
> | $x$ | Phần chưa biết của $p$: $p = P_0 + x$ |
> | $y$ | Phần chưa biết của $q$: $q = Q_0 + y$ |

---

## 1. Bài Toán Factoring với High-Order Bits Known

**Context**: Trong nhiều kịch bản tấn công RSA thực tế (partial key exposure, cold boot attacks, fault attacks), attacker biết **một phần bit cao nhất** của một thừa số nguyên tố $p$ của $N = pq$. Câu hỏi: bao nhiêu bits là đủ để factor $N$ hiệu quả?

> [!abstract] Theorem 4 (Coppersmith [Cop96b, Cop97] — RSA Factoring với High Bits Known)
> Cho $N = pq$ và $\frac{1}{4}\log_2 N$ bits cao nhất của $p$. Có thể tìm nhân tử hóa $N$ trong thời gian polynomial trong $\log N$.

**Proof** (qua Theorem 2): Biết $\frac{1}{4}\log_2 N$ bits cao của $p$, ta có xấp xỉ $P_0$ với $|p - P_0| \le X = N^{1/4}$. Đặt $Q_0 = \lfloor N/P_0 \rfloor$, khi đó $|q - Q_0| \le Y \approx N^{1/4}$ (với $p \approx q \approx N^{1/2}$).

Từ $N = pq = (P_0 + x)(Q_0 + y)$, đặt:

$$
f(x,y) = (P_0 + x)(Q_0 + y) - N = P_0 Q_0 - N + P_0 y + Q_0 x + xy
$$

Đây là đa thức hai biến bậc $\delta = 1$ (trong mỗi biến riêng lẻ). Áp dụng Theorem 2 với $\delta = 1$:

$$
W = \max_{i,j} |f_{ij}| X^i Y^j \approx P_0 \cdot X \approx N^{1/2} \cdot N^{1/4} = N^{3/4}
$$

Điều kiện $XY < W^{2/(3\delta)} = W^{2/3}$:

$$
N^{1/4} \cdot N^{1/4} = N^{1/2} \quad \text{và} \quad W^{2/3} \approx (N^{3/4})^{2/3} = N^{1/2}
$$

Hai vế bằng nhau — đây là **ngưỡng chính xác** của Theorem 2 với $\delta = 1$. $\blacksquare$

> [!tip] 💡 Agent note
> Nhận xét thú vị: với $\delta = 1$ (đa thức tuyến tính trong từng biến) và $X = Y = N^{1/4}$, điều kiện $XY < W^{2/(3\delta)}$ cho ra đúng $N^{1/2} < N^{1/2}$ — nghĩa là ta đang ở ngay tại **biên của ngưỡng**. Điều này lý giải tại sao bài toán "factor với $1/4$ bits" khó hơn "factor với $1/4 + \varepsilon$ bits" — vì với $\varepsilon > 0$ ta có margin rõ ràng, còn với đúng $1/4$ phải dùng exhaustive search nhỏ.

---

## 2. Công Thức Bivariate Tường Minh

Bài toán factoring được đưa về phương trình bivariate:

$$
f(x,y) = (P_0 + x)(Q_0 + y) - N
$$

với $f(x_0, y_0) = 0$, $|x_0| \le X = N^{1/4}$, $|y_0| \le Y \approx N^{1/4}$.

**Tại sao $|y_0| \le N^{1/4}$?** Vì $p \approx q \approx N^{1/2}$, nên sai số của $Q_0 = \lfloor N/P_0 \rfloor$ so với $q$ cỡ $N^{1/2}/P_0 \cdot X \approx X \approx N^{1/4}$.

Áp dụng thuật toán CoronBivariateRoots với $k$ phù hợp → thu $(x_0, y_0)$ → $p = P_0 + x_0$, $q = Q_0 + y_0$.

---

## 3. Kết Quả Thực Nghiệm

Paper implement cả ba thuật toán trên Shoup's NTL library, chạy trên PC 1.6 GHz dưới Linux:

**Table 1** — So sánh paper này vs. [Cor04]:

| $N$ | $k$ | Bits $p$ given | Dim (paper) | LLL time | Dim [Cor04] | LLL time [Cor04] |
|-----|-----|---------------|-------------|----------|-------------|-----------------|
| 512 bits | 4 | 144 bits | 9 | <1 s | 25 | 20 s |
| 512 bits | 5 | 141 bits | 11 | <1 s | 36 | 2 min |
| 1024 bits | 5 | 282 bits | 11 | 1 s | 36 | 13 min |
| 1024 bits | 12 | 266 bits | 25 | 42 s | 169 | — (quá lâu) |

**Table 2** — So sánh paper này vs. Howgrave-Graham [HG97] (univariate variant):

| $N$ | $k$ | Bits $p$ given | Dim | LLL time |
|-----|-----|---------------|-----|----------|
| 512 bits | 4 | 144 bits | 9 | <1 s |
| 512 bits | 5 | 141 bits | 11 | <1 s |
| 1024 bits | 5 | 282 bits | 11 | 1 s |
| 1024 bits | 12 | 266 bits | 25 | 37 s |

**Nhận xét**: Paper này và HG [HG97] có **cùng dimension và cùng running time** với bài toán factoring high bits — nhưng hai lattice hoàn toàn khác nhau. Lý do: với $\delta = 1$, bài toán factoring high bits có thể giải bằng cả phương pháp bivariate (paper này) lẫn univariate modular (Howgrave-Graham [HG97] qua $p \equiv P_0 \pmod{N/p}$).

> [!info] Tại sao paper này vs. [Cor04] khác nhau đến vậy?
>
> Với $k=5$, $\delta=1$:
> - Paper này: $\omega = \delta^2 + 2k\delta = 1 + 10 = 11$
> - [Cor04]: $d_L = (k+\delta)^2 = 36$
>
> LLL trên lattice dim 11 vs. dim 36 khác nhau khoảng $36^5/11^5 \approx 3600$ lần trong worst-case — nhất quán với "1 giây vs. 13 phút" trong thực nghiệm.

---

## 4. Ứng Dụng Trong Bối Cảnh Tấn Công RSA Rộng Hơn

Paper ghi nhận rằng Coppersmith's bivariate theorem là công cụ nền tảng cho nhiều tấn công RSA:

> [!example] Các ứng dụng tiêu biểu của Theorem 2
>
> **Partial key exposure** [EM05, Cor04]: Biết một số bit của $d$ → đưa về phương trình bivariate trong các phần chưa biết của $d$ và $p$.
>
> **Factoring $N = p^r q$** [BDH99]: Với $r$ lớn, bài toán đưa về univariate / bivariate thông qua Newton's method argument.
>
> **RSA với small CRT exponents** [May02, BM06]: $d_p$ và $d_q$ nhỏ → bivariate system.
>
> **Deterministic equivalence** [CM07]: Tính $d$ từ $N, e$ tương đương với factoring $N$ — chứng minh dùng Coppersmith.

---

## 5. §5 — Kết Luận

Paper tóm tắt ba điểm đóng góp:

1. **Đơn giản hóa tương tự HG**: Thuật toán dễ implement hơn Coppersmith gốc — chỉ cần xây dựng $S$, tính $\det S$, triangularize $M$, chạy LLL.

2. **Khắc phục [Cor04]**: Bằng cách chọn $n = |\det S|$ thay vì arbitrary, complexity giảm từ sub-exponential về polynomial.

3. **Thực nghiệm tốt**: Đối với factoring high bits known, nhanh hơn [Cor04] **orders of magnitude** (vài giây vs. vài giờ).

> [!tip] 💡 Agent note — Tầm quan trọng trong bug bounty context
>
> Với background zkVerify, bài toán tìm nghiệm nhỏ của đa thức hai biến xuất hiện trong nhiều kịch bản:
>
> - **Weak randomness trong proof generation**: Nếu hai field elements $r_1, r_2$ có entropy thấp (tức $|r_1| < X$, $|r_2| < Y$), và chúng thỏa một quan hệ đa thức từ cấu trúc circuit → có thể recover qua Coppersmith bivariate.
> - **Partial nonce exposure**: Tương tự ECDSA partial nonce → bivariate modular system (mở rộng heuristic của Theorem 2).
> - **RSA-based components**: Nếu zkVerify dùng RSA accumulator hay VDF dựa trên factoring, Theorem 4 trực tiếp áp dụng.

---

## Summary

- **Theorem 4**: Factor $N = pq$ từ $\frac{1}{4}\log_2 N$ bits cao của $p$ — đưa về $f(x,y) = (P_0+x)(Q_0+y)-N$ rồi áp dụng Theorem 2 với $\delta = 1$, $X = Y = N^{1/4}$.
- **Experiments**: Với $k=5$, 1024-bit $N$: paper này dùng lattice dim 11 → 1 giây; [Cor04] dim 36 → 13 phút. Speedup tương đương [HG97].
- **Kết luận**: Thuật toán Coron 2007 là phiên bản dễ implement nhất của Coppersmith bivariate với đúng polynomial-time guarantee.

---

## References

- [Cop96b] Coppersmith — *Finding a Small Root of a Bivariate Integer Equation*, Eurocrypt 1996
- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, J. Cryptology 1997
- [HG97] Howgrave-Graham — *Finding Small Roots of Univariate Modular Equations Revisited*, 1997
- [Cor04] Coron — *Finding Small Roots Revisited*, Eurocrypt 2004
- [BDH99] Boneh, Durfee, Howgrave-Graham — *Factoring $N = p^rq$*, Crypto 1999
- [EM05] Ernst, Jochemsz, May, de Weger — *Partial Key Exposure on RSA*, Eurocrypt 2005
- [BM06] Bleichenbacher, May — *Attacks on RSA with Small CRT-Exponents*, PKC 2006
- [CM07] Coron, May — *Deterministic Polynomial-Time Equivalence*, J. Cryptology 2007
