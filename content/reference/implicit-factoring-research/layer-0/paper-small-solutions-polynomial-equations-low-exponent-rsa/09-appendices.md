---
title: "09. Appendices: Multi-Encryption Attack & Toeplitz Summary"
type: deep-dive
tags: [coppersmith, appendix, multi-encryption, toeplitz, lesson-09]
aliases: [Multi-Encryption Attack, Appendix Survey]
source: "Small Solutions to Polynomial Equations, and Low Exponent RSA Vulnerabilities — Don Coppersmith, 1997"
created: 2026-03-26
---

> **Prerequisites**: [[05-random-padding-two-message-attack|05. Random Padding Attack]] (Franklin-Reiter, two-message attack); [[06-bivariate-integer-case|06. Bivariate Integer Case]] (Lemma 3, Toeplitz)  
> 🔴 **Prerequisite references**: [LLL82] LLL algorithm  
> **Lesson type**: Deep Dive  
> **Covers**: Appendix 1 (Another Solution for Multiple Encryptions), Appendix 2 (Nearly Orthogonal Toeplitz Columns — overview; proof đầy đủ tại [[a0-toeplitz-columns-proof|A0]])
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $k$ | Số extra ciphertext: $k+1$ ciphertext tổng cộng | $k$ |
> | $A_0$ | Ciphertext của $m^3$ (base) | $A_0$ |
> | $A_i$ | Ciphertext của $(m + r_i)^3$ | $A_i$ |
> | $c_i$ | $A_i - A_0 = 3m^2 r_i + 3mr_i^2 + r_i^3 \bmod N$ | $c_i$ |
> | $d_{ij}$ | $r_i r_j (r_i - r_j)$ | $d_{ij}$ |
> | $e_{ijp}$ | $-r_i r_j r_p (r_i-r_j)(r_j-r_p)(r_p-r_i)$ | $e_{ijp}$ |
> | $\alpha$ | Tỉ lệ padding: $\lvert r_i\rvert < N^\alpha$ | $\alpha$ |

---

## Phần 1: Appendix 1 — Multi-Encryption Attack

### 1.1 Bối cảnh và động lực

§8 (Lesson 05) giải quyết trường hợp **2 ciphertext** ($k+1 = 2$): chịu được padding $\lvert r\rvert < N^{1/9}$.

**Câu hỏi tự nhiên**: Nếu có nhiều hơn 2 ciphertext, ta có thể chịu được padding lớn hơn không?

Appendix 1 trả lời: Có — nhưng không bằng Coppersmith trực tiếp. Đây là tấn công **heuristic** khác, dùng cấu trúc đại số của $\{r_i\}$ để xây một lattice phức tạp hơn.

### 1.2 Thiết lập

Có $k+1$ ciphertext của cùng message $m$:

$$
A_0 = m^3 \bmod N
$$

$$
A_i = (m + r_i)^3 \bmod N, \quad i = 1, \ldots, k
$$

Attacker biết $A_0, A_1, \ldots, A_k$ và $N$. Đặt $c_i = A_i - A_0$:

$$
c_i = 3m^2 r_i + 3mr_i^2 + r_i^3 \bmod N
$$

### 1.3 Cấu trúc đại số của $r_i$

Định nghĩa hai họ quantity:

$$
d_{ij} = r_i r_j (r_i - r_j), \quad i < j \quad \bigl(\binom{k}{2} \text{ quantities}\bigr)
$$

$$
e_{ijp} = -r_i r_j r_p (r_i - r_j)(r_j - r_p)(r_p - r_i), \quad i < j < p \quad \bigl(\binom{k}{3} \text{ quantities}\bigr)
$$

Bounds:

$$
\lvert d_{ij}\rvert < N^{3\alpha}, \quad \lvert e_{ijp}\rvert < N^{6\alpha}
$$

**Quan hệ then chốt** (kiểm tra bằng expand):

$$
d_{ij} c_p + d_{jp} c_i - d_{ip} c_j \equiv e_{ijp} \pmod{N}
$$

Đây là một **linear relation** giữa các $d_{ij}$, $c_i$ (đã biết) và $e_{ijp}$ (chưa biết) — là nền tảng xây lattice.

### 1.4 Construction Lattice

> [!note] Scheme 9.1 — Multi-Encryption Lattice
> **Type**: Heuristic Multi-Encryption Attack  
> **Setting**: $k+1$ ciphertext; $\lvert r_i\rvert < N^\alpha$ với $\alpha < \frac{k-2}{6k-3}$
>
> **$\mathsf{MultiEncryptAttack}(N,\, A_0,\, A_1,\ldots,A_k)$** *(heuristic)*
> - Input: $k+1$ ciphertexts
> - Tính $c_i = A_i - A_0 \bmod N$
> - Xây ma trận $M$ vuông, kích thước $\binom{k}{2} + \binom{k}{3}$, tam giác trên:
>   - **Upper-left** $\binom{k}{2} \times \binom{k}{2}$ block: identity $\times \lfloor N^{3\alpha}\rfloor$
>   - **Lower-left** $\binom{k}{3} \times \binom{k}{2}$ block: zero
>   - **Lower-right** $\binom{k}{3} \times \binom{k}{3}$ block: $N \times I$
>   - **Upper-right** $\binom{k}{2} \times \binom{k}{3}$ block: cột $\beta(i,j,p)$ có 3 entry khác 0:
>     - $c_p$ tại hàng $(i,j)$, $c_i$ tại hàng $(j,p)$, $-c_j$ tại hàng $(i,p)$
> - Xây vector $\mathbf{r}$: $\binom{k}{2}$ entry đầu là $d_{ij}$; $\binom{k}{3}$ entry sau là $(e_{ijp} - (d_{ij}c_p + d_{jp}c_i - d_{ip}c_j))/N$
> - Tích $\mathbf{r}M$: phần trái = $d_{ij} N^{3\alpha}$, phần phải = $e_{ijp}$; mọi entry $\leq N^{6\alpha}$
> - **Mục tiêu**: LLL tìm $\mathbf{r}$ từ $M$ (muốn tìm $\mathbf{r}$, không chỉ giam vào hyperplane)
> - Sau khi có $\mathbf{r}$: recover $r_i$ từ $\gcd\{d_{1,2}, d_{1,3}, \ldots, d_{1,k}\}$ → Franklin-Reiter recover $m$
> - Output: $m$ (heuristic, không guaranteed)

### 1.5 Phân tích: tại sao $\alpha < \frac{k-2}{6k-3}$

$\det(M) = N^{3\alpha \binom{k}{2} + \binom{k}{3}}$.

Điều kiện để $\mathbf{r}$ là vector **ngắn hơn** (không phải dài nhất): $\lvert\mathbf{r}M\rvert \leq N^{6\alpha}$ phải nhỏ hơn $\det(M)^{1/\dim}$. Tính toán cho ra $\alpha < \frac{k-2}{6k-3}$.

Khi $k \to \infty$: $\frac{k-2}{6k-3} \to \frac{1}{6}$ — tấn công có thể chịu được padding gần $\frac{1}{6}$ log $N$ bit.

### 1.6 Ví dụ thực tiễn

> [!example] $k = 13$ — 14 ciphertext
> Với 14 encryptions của cùng message và padding $< \frac{11}{75} \approx 14.7\%$ của log $N$:
>
> $$
> \alpha < \frac{13-2}{6 \times 13-3} = \frac{11}{75} \approx 0.147
> $$
>
> Trên RSA 1024-bit: chịu được $\approx 150$ bit padding.  
> Paper: "If we have 14 encryptions of the same message ($k=13$), then we can tolerate random padding of about 150 bits in a 1024-bit RSA message."

### 1.7 Recovery của $r_i$

Sau khi LLL recover $\mathbf{r}$ (và do đó các $d_{ij}$):

$$
\gcd(d_{1,2}, d_{1,3}, \ldots, d_{1,k}) = r_1 \cdot \gcd(r_2(r_1-r_2), r_3(r_1-r_3), \ldots)
$$

Với các $r_i$ đủ nhỏ, $\gcd$ này đủ nhỏ để tìm $r_1$ bằng exhaustive search. Sau đó Franklin-Reiter recover $m$ từ $c = m^3$ và $r = r_1$.

> [!warning] Đây là heuristic
> Appendix 1 không cung cấp efficiency estimates hay xác suất thành công. Tấn công giả định $\mathbf{r}$ là **short enough** để LLL recover được — không có đảm bảo khi $\lvert r_i\rvert$ đúng bằng ngưỡng $N^\alpha$.

---

## Phần 2: Appendix 2 — Nearly Orthogonal Toeplitz Columns (Tổng quan)

Appendix 2 chứa proof đầy đủ của Lemma 3 — kết quả kỹ thuật cốt lõi cho §10 (Bivariate Integer Case, Lesson 06). Proof đầy đủ nằm tại [[a0-toeplitz-columns-proof|A0. Toeplitz Columns Proof]].

### 2.1 Statement (recap từ Lesson 06)

> [!abstract] Lemma 3 — Nearly Orthogonal Toeplitz Columns (recap)
> Tồn tại $k^2 \times k^2$ submatrix của block Toeplitz matrix $M_4$ (xây trong §10) với
>
> $$
> \lvert\det\rvert \geq W^{k^2} \cdot 2^{-6k^2\delta^2 - 2k^2}
> $$
>
> Nếu $W = \max(\lvert\tilde{p}_{00}\rvert, \lvert\tilde{p}_{0\delta}\rvert, \lvert\tilde{p}_{\delta 0}\rvert, \lvert\tilde{p}_{\delta\delta}\rvert)$ (corner của Newton polygon), thì $\lvert\det\rvert \geq W^{k^2}$.

### 2.2 Ý tưởng proof (outline)

Proof dựa trên **Gershgorin circle theorem** và tính chất diagonal dominance:

1. Chọn chỉ số $(c,d)$ maximize $8^{(c-a)^2+(d-b)^2} \lvert\tilde{p}_{cd}\rvert$ (với $(a,b)$ là vị trí của $W$)
2. Chọn submatrix $\tilde{M}$ với các hàng $\gamma(c+i, d+j)$, $0 \leq i,j < k$
3. Scale hàng và cột bằng lũy thừa của $8$ để tạo ma trận $M_0$ **diagonal dominant**
4. Diagonal entry của $M_0$ = $\tilde{p}_{cd}$; off-diagonal entry $\leq \lvert\tilde{p}_{cd}\rvert \cdot 8^{-(g-i)^2-(h-j)^2}$
5. Tổng off-diagonal $< \frac{3}{4}\lvert\tilde{p}_{cd}\rvert$ (tính bằng sum of geometric series 2D)
6. Gershgorin: mọi eigenvalue $> \frac{1}{4}\lvert\tilde{p}_{cd}\rvert$, do đó $\det > (\frac{1}{4}\lvert\tilde{p}_{cd}\rvert)^{k^2}$
7. Từ định nghĩa $(c,d)$: $\lvert\tilde{p}_{cd}\rvert \geq 8^{-2\delta^2} W$, suy ra $\det \geq W^{k^2} \cdot 2^{-6k^2\delta^2-2k^2}$

**Trường hợp corner**: Nếu $W$ là corner của Newton polygon (e.g., $\tilde{p}_{00}$), thì $\tilde{M}$ là ma trận tam giác với diagonal entries = $W$ → $\det = W^{k^2}$ tường minh.

Proof chi tiết với mọi bước algebraic đầy đủ: xem [[a0-toeplitz-columns-proof|A0. Toeplitz Columns Proof]].

---

## Summary

- **Appendix 1**: $k+1$ ciphertext → quantities $d_{ij}$ và $e_{ijp}$ thỏa linear relation → lattice $\binom{k}{2}+\binom{k}{3}$ chiều → LLL recover $\{r_i\}$ nếu $\lvert r_i\rvert < N^\alpha$ với $\alpha < \frac{k-2}{6k-3}$. Với $k=13$: ~150-bit padding trên 1024-bit RSA. **Heuristic, không guaranteed.**
- **Appendix 2**: Proof Lemma 3 qua Gershgorin circle theorem trên ma trận Toeplitz được scale. Proof đầy đủ tại [[a0-toeplitz-columns-proof|A0]].

---

## References

- [Cop97] Coppersmith — *Small Solutions to Polynomial Equations*, Appendix 1, Appendix 2
- [FR95] Franklin, Reiter — *A linear protocol failure for RSA*, Crypto '95 (recovery step, 🟡)
- [LLL82] Lenstra, Lenstra, Lovász — 1982 (🔴 Prerequisite)
