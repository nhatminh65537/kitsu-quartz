---
title: "07. Main Polynomial Factoring Algorithm"
type: scheme
tags: [lll, polynomial-factoring, berlekamp, hensel, algorithm, scheme, lesson-07]
aliases: [Main Factoring Algorithm, LLL Factoring, Polynomial Time Factoring]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[06-factor-recovery|06. Factor Recovery via LLL]] — Prop (2.13), (2.16); [[04-complexity-and-applications|04. Complexity Analysis]] — Prop (1.26); [[05-factors-and-lattices-setup|05. Factors and Lattices Setup]] — Prop (2.5), (2.7)  
> 🔴 **Prerequisite references**: Knuth [7] (Berlekamp §4.6.2, subresultant §4.6.1, Hensel §4.6.2.22); Cassels [4]  
> **Lesson type**: Scheme  
> **Covers**: §3: sub-algorithm (3.1), Prop (3.2), algorithm (3.3), Prop (3.4), main algorithm (3.5), Theorem (3.6), Remark (3.10)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $f \in \mathbb{Z}[X]$ | Đa thức primitive cần phân tích, $\deg(f) = n > 0$ |
> | $R(f, f')$ | Resultant của $f$ và đạo hàm $f'$ |
> | $p$ | Số nguyên tố nhỏ nhất không chia $R(f,f')$ |
> | $h \bmod p$ | Nhân tử bất khả quy của $f \bmod p$ trong $\mathbb{F}_p[X]$ |
> | $h_0$ | Nhân tử bất khả quy của $f$ trong $\mathbb{Z}[X]$ ứng với $h$ |
> | $m_0 = \deg(h_0)$ | Bậc của nhân tử tìm được |
> | $f_1, f_2$ | Phân tích từng phần: $f = f_1 \cdot f_2$, $f_1$ đã factored |

---

## Động lực

Các bài trước xây dựng đủ công cụ:

- **§1**: LLL tìm vector ngắn trong lattice.
- **§2**: Nhân tử $h_0$ của $f$ là vector ngắn trong lattice $L$ xác định bởi p-adic factor $h$.
- **§2**: Từ reduced basis của $L$, recover $h_0 = \gcd(b_1,\ldots,b_t)$.

Bài này lắp ráp thành thuật toán factoring hoàn chỉnh và chứng minh running time polynomial.

---

## Sub-Algorithm (3.1) — Tìm $h_0$ Với Bậc Cố Định $m$

> [!note] Scheme 7.1 — Sub-Algorithm (3.1): Decide và Compute $h_0$ cho Fixed $m$
> **Type**: Polynomial Factor Finder (fixed degree bound)  
> **Setting**: $f \in \mathbb{Z}[X]$ primitive bậc $n$; $p$ nguyên tố; $h \in \mathbb{Z}[X]$ thỏa (2.1)–(2.4); $m \ge l = \deg(h)$; (2.14) thỏa
>
> **$\mathsf{FindFactor}(f, p, k, h, m)$**
> - Input: $f$, $p$, $k$, $h$ thỏa (2.1)–(2.4), integer $m \ge l$ thỏa (2.14)
> - Step 1: Xây dựng lattice $L$ với basis $\{p^k X^i : 0 \le i < l\} \cup \{hX^j : 0 \le j \le m-l\}$
> - Step 2: Áp dụng thuật toán LLL (1.15) để tìm reduced basis $b_1, \ldots, b_{m+1}$
> - Step 3: Tính ngưỡng $\tau = (p^{kl}/\|f\|^m)^{1/n}$
> - Step 4: Nếu $\|b_1\| \ge \tau$: output "$\deg(h_0) > m$", dừng
> - Step 5: Tìm $t = \max\{j : \|b_j\| < \tau\}$
> - Step 6: Tính $h_0 = \gcd(b_1, b_2, \ldots, b_t)$ bằng subresultant algorithm [7, §4.6.1]
> - Output: $h_0$ (nhân tử bất khả quy của $f$ với $(h \bmod p) \mid (h_0 \bmod p)$)

> [!abstract] Proposition 3.2 — Complexity của (3.1)
> Số arithmetic operations cần bởi (3.1) là $O(m^4 k \log p)$, và các số nguyên trung gian có binary length $O(mk \log p)$.

**Proof sketch**: Áp dụng Prop (1.26) với $n' = m+1$ và $B = 1 + lp^{2k}$. Từ (2.14) suy ra $m = O(k\log p)$, nên $\log B = O(k\log p)$. Bound LLL: $O((m+1)^4 \log B) = O(m^4 k \log p)$. Bước gcd thỏa cùng bound. $\blacksquare$

---

## Algorithm (3.3) — Tìm $h_0$ Qua Binary Search Trên $m$

Sub-algorithm (3.1) giả sử biết $m \ge \deg(h_0)$. Vấn đề: chưa biết $\deg(h_0)$! Algorithm (3.3) tìm $h_0$ bằng cách thử các giá trị $m$ tăng dần (nhân đôi):

> [!note] Scheme 7.2 — Algorithm (3.3): Find $h_0$ via Increasing $m$
> **Type**: Polynomial Factor Finder (unknown degree)
>
> **$\mathsf{FindFactorUnknownDeg}(f, p, h)$**
> - Input: $f$, $p$ nguyên tố, $h \in \mathbb{Z}[X]$ thỏa (2.1)–(2.4) với $k=1$; $l = \deg(h)$
> - Step 1: Nếu $l = n$: output $h_0 = f$, dừng
> - Step 2: Tính $k$ nhỏ nhất sao cho (2.14) thỏa với $m = n-1$:
>   $$p^{kl} > 2^{(n-1)n/2} \binom{2(n-1)}{n-1}^{n/2} \|f\|^{2n-1}$$
> - Step 3: Lift $h$ lên $\bmod p^k$ bằng Hensel's lemma (giữ nguyên $h \bmod p$)
> - Step 4: Đặt $u$ là số nguyên lớn nhất với $l \le (n-1)/2^u$
> - Step 5: Thử $m = \lceil(n-1)/2^u\rceil, \lceil(n-1)/2^{u-1}\rceil, \ldots, \lceil(n-1)/2\rceil, n-1$ theo thứ tự tăng
>   - Mỗi giá trị $m$: gọi $\mathsf{FindFactor}(f, p, k, h, m)$
>   - Nếu tìm được $h_0$: output $h_0$, dừng
> - Step 6: Nếu không tìm được với bất kỳ $m$ nào: $\deg(h_0) > n-1$, output $h_0 = f$

> [!abstract] Proposition 3.4 — Complexity của (3.3)
> Gọi $m_0 = \deg(h_0)$. Số arithmetic operations cần bởi (3.3) là $O(m_0(n^5 + n^4\log\|f\| + n^3\log p))$, và binary length $O(n^3 + n^2\log\|f\| + n\log p)$.

**Proof sketch**:

Từ (2.14) với $m = n-1$:

$$
p^{k-1} \le p^{(k-1)l} \le 2^{(n-1)n/2}\binom{2(n-1)}{n-1}^{n/2}\|f\|^{2n-1}
$$

Suy ra $k\log p = O(n^2 + n\log\|f\| + \log p)$.

Gọi $m_1$ là giá trị lớn nhất thử trong (3.3). Theo cách chọn, $m_1 < 2m_0$ và mọi $m$ thử khác có dạng $\lfloor m_1/2^i\rfloor$, nên $\sum m^4 = O(m_0^4)$.

Từ Prop (3.2), tổng operations: $O(m_0^4 k \log p) = O(m_0^4(n^2 + n\log\|f\| + \log p))$. Thay $m_0 \le n$: $O(m_0(n^5 + n^4\log\|f\| + n^3\log p))$. $\blacksquare$

---

## Main Algorithm (3.5) — Factoring Hoàn Chỉnh

> [!note] Scheme 7.3 — Main Factoring Algorithm (3.5)
> **Type**: Polynomial Factoring  
> **Setting**: $f \in \mathbb{Z}[X]$ primitive, $\deg(f) = n > 0$
>
> **$\mathsf{FactorPoly}(f)$**
>
> **Bước 1 — Squarefree reduction**:
> - Tính $R = R(f, f')$ bằng subresultant algorithm [7, §4.6.1]
> - Nếu $R = 0$: tính $g = \gcd(f, f')$, đặt $f_0 = f/g$ (squarefree), factor $f_0$ bằng bước dưới, hoàn tất bằng trial division để factor $f = f_0 \cdot g$. Dừng.
> - Giả sử $R \ne 0$
>
> **Bước 2 — Chọn prime $p$ và phân tích modulo $p$**:
> - Tìm $p$ nhỏ nhất không chia $R(f, f')$
> - Dùng Berlekamp's algorithm [7, §4.6.2] phân tích $(f \bmod p)$ thành nhân tử bất khả quy trong $\mathbb{F}_p[X]$
> - (Vì $R \not\equiv 0 \pmod{p}$: $f \bmod p$ vẫn bậc $n$ và squarefree, điều kiện (2.4) thỏa với mọi nhân tử)
>
> **Bước 3 — Vòng lặp chính** (duy trì $f = f_1 \cdot f_2$, $f_1$ đã factored):
> - Khởi tạo: $f_1 = 1$, $f_2 = f$
> - Lặp:
>   - Nếu $f_2 = \pm 1$: $f$ đã factored hoàn toàn ($= \pm f_1$), dừng
>   - Chọn nhân tử bất khả quy $h \bmod p$ của $f_2 \bmod p$ trong $\mathbb{F}_p[X]$
>   - Gọi $\mathsf{FindFactorUnknownDeg}(f_2, p, h)$ → thu được $h_0$ (nhân tử bất khả quy của $f_2$)
>   - Cập nhật: $f_1 \leftarrow f_1 \cdot h_0$, $f_2 \leftarrow f_2 / h_0$
>   - Xóa khỏi danh sách nhân tử của $f_2 \bmod p$ những nhân tử chia $(h_0 \bmod p)$

---

## Theorem (3.6) — Main Result

> [!abstract] Theorem 3.6
> Thuật toán (3.5) factors bất kỳ đa thức primitive $f \in \mathbb{Z}[X]$ bậc $n > 0$ thành các nhân tử bất khả quy trong $\mathbb{Z}[X]$. Số **arithmetic operations** là $O(n^6 + n^5\log\|f\|)$, và các số nguyên trung gian có binary length $O(n^3 + n^2\log\|f\|)$.
>
> Dùng thuật toán nhân/chia cổ điển: $O(n^{12} + n^9(\log\|f\|)^3)$ **bit operations**.  
> Dùng fast multiplication: $O(n^{9+\varepsilon} + n^{7+\varepsilon}(\log\|f\|)^{2+\varepsilon})$ với mọi $\varepsilon > 0$.

**Proof.**

**Tính đúng đắn**: Rõ ràng từ mô tả thuật toán và các Propositions đã chứng minh.

**Bound prime $p$**: Vì $p$ là số nguyên tố nhỏ nhất không chia $R(f,f')$:

$$
\prod_{q < p,\, q\text{ prime}} q \le |R(f, f')| \le n^n \|f\|^{2n-1} \quad \text{(Hadamard)}
$$

Từ [6, §22.2] và [12, Rosser-Schoenfeld]: $\prod_{q<p} q > e^{0.84p}$ với $p > 101$. Suy ra:

$$
e^{0.84p} \le n^n\|f\|^{2n-1} \implies p = O(n\log n + n\log\|f\|)
$$

> [!info] 🟡 Rosser-Schoenfeld Bound (theo [12])
> Với $p > 101$: $\prod_{q < p,\, q \text{ prime}} q > e^{0.84p}$.
>
> *(theo [12]: Barkley Rosser, Schoenfeld — Approximate formulas for some functions of prime numbers, Ill. J. Math. 6, 64–94, 1962)*

> [!info] 🟡 Hardy-Wright (theo [6])
> Sự tồn tại hằng số $A > 0$ sao cho $\prod_{q<p} q > e^{Ap}$ với mọi $p > 2$ đến từ [6, Sect. 22.2].
>
> *(theo [6]: Hardy, Wright — An Introduction to the Theory of Numbers, Oxford University Press, 1979)*

Do $p = O(n\log\|f\|)$, các terms $\log p$ trong Prop (3.4) bị absorb bởi $n\log\|f\|$.

**Bound tổng operations**: Từ Prop (3.4), mỗi lần gọi (3.3) với nhân tử bậc $m_0$ cần $O(m_0(n^5 + n^4\log\|f\|))$ operations. Tổng $\sum m_0 = n$ (tổng bậc các nhân tử bất khả quy). Do đó tổng: $O(n(n^5 + n^4\log\|f\|)) = O(n^6 + n^5\log\|f\|)$.

Binary length: $O(n^3 + n^2\log\|f\|)$ từ Prop (3.4). $\blacksquare$

---

## Remark (3.10) — Simplification Dùng Partial Reduction

> [!info] Remark 3.10
> Nếu sử dụng đúng thuật toán LLL từ §1 (không phải basis reduction tổng quát khác), bước gcd computation ở cuối (3.1) có thể **bỏ qua**. Cụ thể:
>
> Giả sử $m_0 = \deg(h_0) \le m$. Theo Remark (1.37), tại thời điểm $k$ đầu tiên đạt $m_0 + 1$ trong quá trình LLL, vector $b_1$ lúc đó chính là $h_0$.
>
> Tương tự, trong (3.3) có thể thử $m = l, l+1, \ldots, n-1$ tuần tự (thay vì binary search) — đơn giản hơn khi dùng LLL vì partial reduction của basis cũ có thể tái sử dụng.

Đây là kết nối đẹp giữa thuật toán §1 và §3: cấu trúc của LLL (partial reduction, Remark 1.37) tự nhiên sinh ra $h_0$ mà không cần gcd bổ sung.

---

## Tóm Tắt Kiến Trúc Thuật Toán

```mermaid
graph TD
    A[Input: f primitive in Z-X] --> B[Bước 1: Tính R = Res(f,f')]
    B --> C{R = 0?}
    C -->|Yes| D[Squarefree: f0 = f/gcd(f,f')<br>Factor f0 rồi trial division]
    C -->|No| E[Bước 2: Tìm p nhỏ nhất<br>không chia R<br>Berlekamp: factor f mod p]
    E --> F[Bước 3: Vòng lặp chính<br>f = f1 * f2]
    F --> G{f2 = +-1?}
    G -->|Yes| H[Output factorization f1]
    G -->|No| I[Chọn h mod p nhân tử của f2 mod p<br>FindFactorUnknownDeg(f2, p, h)]
    I --> J[h0 = nhân tử bất khả quy của f2]
    J --> K[f1 := f1 * h0<br>f2 := f2 / h0]
    K --> F
```

---

## Summary

| Component | Complexity | Kết quả |
|-----------|-----------|---------|
| Sub-alg (3.1) | $O(m^4 k\log p)$ ops | Quyết định $\deg(h_0) \le m$, tính $h_0$ |
| Algorithm (3.3) | $O(m_0(n^5 + n^4\log\|f\|))$ ops | Tìm $h_0$ với bậc chưa biết |
| Main (3.5) | $O(n^6 + n^5\log\|f\|)$ ops | Factor hoàn toàn $f$ |
| Bit complexity | $O(n^{12} + n^9(\log\|f\|)^3)$ | Công bố trong Introduction |

Đây là lần đầu tiên bài toán factoring đa thức hữu tỉ được giải trong thời gian **đa thức**, kết thúc một bài toán mở nhiều thập kỷ.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [6] Hardy, Wright — *An Introduction to the Theory of Numbers*, Oxford University Press 1979 (🟡 Integrate — Sect. 22.2)
- [12] Rosser, Schoenfeld — *Approximate formulas for some functions of prime numbers*, Ill. J. Math. 6 (1962) (🟡 Integrate — $A = 0.84$ bound)
- [7] Knuth — *The Art of Computer Programming Vol. 2*, Addison-Wesley 1981 (🔴 Prerequisite)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite)
