---
title: "05. Weak Encryption Exponent Attacks"
type: attack
tags: [linear-equations-unknown-divisors, rsa, crt-rsa, weak-exponent, attack, lesson-05]
aliases: [Weak Encryption Exponents, CRT-RSA Attack]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: [[01-problem-setting-lattice-preliminaries|01. Problem Setting & Lattice Preliminaries]], [[04-second-variant-homogeneous-linear-equations|04. Second Variant: Homogeneous Linear Equations]] (Theorem 7)  
> 🔴 **Prerequisite references**: LLL [10], Coppersmith [3]  
> **Lesson type**: Attack  
> **Covers**: §4.2 (Theorem 9, 10, 11), §4.3 (Table 3 — Experimental Results)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $N = pq$ | RSA modulus ($q < p < 2q$) | $N$ |
> | $e$ | Public exponent | $e$ |
> | $\alpha$ | $e \approx N^\alpha$ | $\alpha$ |
> | $d_p$ | CRT-exponent: $e d_p \equiv 1 \pmod{p-1}$ | $d_p$ |
> | $k_p$ | $e d_p = 1 + k_p(p-1)$ | $k_p$ |
> | $\delta$ | $d_p \approx N^\delta$ | $\delta$ |
> | $\gamma, \delta$ | Bounds: $\lvert x \rvert \leq N^\gamma$, $\lvert y \rvert \leq N^\delta$ | $\gamma, \delta$ |

---

## Context: Weak Encryption Exponents

Trong RSA tiêu chuẩn, người ta thường chọn $e$ nhỏ (ví dụ $e = 65537$) để encrypt nhanh. Nhưng trong một số scenario, hệ thống có thể chọn $e$ sao cho tồn tại $(x, y)$ nhỏ thỏa:

$$
ex + y \equiv 0 \pmod{p}
$$

Đây là **homogeneous linear equation** — chính xác là Second Variant của paper. Nếu $(x, y)$ đủ nhỏ, ta có thể tìm được và từ đó factorize $N$.

> [!info] 🟡 Nitaj Africacrypt'12 [14] — Kết quả bị cải thiện
> Nitaj [14] đề xuất tấn công RSA khi public exponent $e$ thỏa $ex + y \equiv 0 \pmod{p}$ với $(x,y)$ nhỏ. Sử dụng Herrmann–May [6], ông thu được:
>
> $$
> \gamma + \delta \leq \frac{\sqrt{2}-1}{2} \approx 0.207
> $$
>
> Paper này cải thiện lên $\gamma + \delta \leq 0.25$ nhờ Theorem 7.
>
> Nitaj cũng tấn công CRT-RSA: nếu $e < N^{\sqrt{2}/2}$ và $d_p < N^{\sqrt{2}/4}/\sqrt{e}$, factorize được $N$.
>
> *(theo [14]: Nitaj — A new attack on RSA and CRT-RSA, Africacrypt 2012)*

> [!info] 🟡 Sarkar '12 [16] — Phương pháp so sánh
> Sarkar [16] mở rộng Nitaj bằng cách khai thác trường hợp $x$ và $y$ **unbalanced** (khác bit-size rõ rệt). Về bản chất, Sarkar vẫn dùng Herrmann–May [6], trong khi Theorem 7 đơn giản hơn và có bound tốt hơn trong trường hợp chung.
>
> *(theo [16]: Sarkar — Reduction in lossiness of RSA trapdoor permutation, 2012)*

---

## Theorem 9: Weak Encryption Exponents trên RSA

### Thiết lập

Cho $N = pq$ với $q < p < 2q$. Xét tấn công khi tồn tại $(x_0, y_0)$ nhỏ thỏa:

$$
ex_0 + y_0 \equiv 0 \pmod{p} \quad \text{và} \quad ex_0 + y_0 \not\equiv 0 \pmod{N}
$$

Điều kiện thứ hai đảm bảo $ex_0 + y_0$ là bội của $p$ nhưng không phải bội của $N$ — từ đó $\gcd(N, ex_0 + y_0) = p$, factorize được.

> [!abstract] Theorem 9 — Weak Encryption Exponents RSA
> Cho $N = pq$ là RSA modulus với $q < p < 2q$. Cho $e$ là public exponent. Giả sử tồn tại $(x_0, y_0)$ với $|x_0| < N^\gamma$, $|y_0| < N^\delta$ thỏa $ex_0 + y_0 \equiv 0 \pmod{p}$ và $ex_0 + y_0 \not\equiv 0 \pmod{N}$. Nếu:
>
> $$
> \gamma + \delta \leq 0.25
> $$
>
> thì $N$ có thể factorize trong polynomial time.

**Proof.** Đây là bài toán tìm nghiệm nhỏ của $f_2(x,y) = ex + y \equiv 0 \pmod{p}$, dạng homogeneous với $a_1 = e, a_2 = 1$.

Áp dụng Theorem 7 với $u = 1, v = 1, \beta = 0.5$ (do $p \approx N^{0.5}$ vì $q < p < 2q$):

$$
\gamma + \delta < uv\beta^2 = 1 \cdot 1 \cdot (0.5)^2 = 0.25
$$

Sau khi tìm được $(x_0, y_0)$, tính $\gcd(N, ex_0 + y_0) = p$ (do điều kiện $ex_0 + y_0 \not\equiv 0 \pmod{N}$). $\blacksquare$

---

## Theorem 10: CRT-RSA Attack

### CRT-RSA là gì?

Trong **CRT-RSA**, thay vì dùng một secret exponent $d$, hệ thống dùng hai CRT-exponent:

$$
ed_p \equiv 1 \pmod{p-1}, \quad ed_q \equiv 1 \pmod{q-1}
$$

Decrypt nhanh hơn nhờ CRT: tính $m_p = c^{d_p} \bmod p$ và $m_q = c^{d_q} \bmod q$ rồi kết hợp.

Nếu $d_p$ nhỏ, hệ thống trở nên dễ bị tấn công.

### Quy về Second Variant

Từ $ed_p = 1 + k_p(p-1)$, viết lại:

$$
ed_p + k_p - 1 = k_p \cdot p
$$

Lấy modulo $p$:

$$
e d_p + (k_p - 1) \equiv 0 \pmod{p}
$$

Đây là $f_2(x, y) = ex + y \equiv 0 \pmod{p}$ với nghiệm $(x_0, y_0) = (d_p, k_p - 1)$.

**Ước lượng kích thước $k_p$**: từ $k_p = (ed_p - 1)/(p-1)$:

$$
k_p < \frac{ed_p}{p-1} < \frac{N^\alpha \cdot N^\delta}{N^{0.5}} = N^{\alpha + \delta - 0.5}
$$

Ngoài ra cần kiểm tra $ed_p + k_p - 1 \not\equiv 0 \pmod{N}$: vì $k_p < N^{\alpha + 2\delta - 0.5}$, với $\alpha + 2\delta < 0.75$ thì $k_p < N^{0.25} < p$, nên $k_p p \not\equiv 0 \pmod{N}$.

> [!abstract] Theorem 10 — CRT-RSA Attack
> Cho $N = pq$ với $q < p < 2q$. Cho $e < N^{0.75}$ là public exponent và $d_p$ là CRT-exponent thỏa $ed_p \equiv 1 \pmod{p-1}$. Đặt $e = N^\alpha$ và $d_p = N^\delta$. Nếu:
>
> $$
> d_p < \frac{N^{0.375}}{\sqrt{e}}
> $$
>
> thì $N$ có thể factorize trong polynomial time.

**Proof.** Áp dụng Theorem 7 với $u = 1, v = 1, \beta = 0.5$ cho phương trình $ex + y \equiv 0 \pmod{p}$, nghiệm $(d_p, k_p - 1)$:

$$
\gamma_1 + \gamma_2 < 0.25
$$

với $\gamma_1 = \delta$ (bound của $d_p$) và $\gamma_2 = \alpha + \delta - 0.5$ (bound của $k_p - 1$). Điều kiện trở thành:

$$
\delta + (\alpha + \delta - 0.5) < 0.25 \implies 2\delta + \alpha < 0.75
$$

Từ $2\delta < 0.75 - \alpha$ và $d_p = N^\delta$:

$$
d_p < N^{(0.75 - \alpha)/2} = N^{0.375} \cdot N^{-\alpha/2} = \frac{N^{0.375}}{\sqrt{e}}
$$

Sau khi tìm được $(d_p, k_p - 1)$, tính $\gcd(N, ed_p + k_p - 1) = p$. $\blacksquare$

> [!info] So sánh với Nitaj [14]
> Nitaj [14] thu được bound: $d_p < N^{\sqrt{2}/4}/\sqrt{e} \approx N^{0.354}/\sqrt{e}$ khi $e < N^{\sqrt{2}/2} \approx N^{0.707}$.
>
> Paper này cải thiện: $d_p < N^{0.375}/\sqrt{e}$ khi $e < N^{0.75}$ — vừa relaxation điều kiện trên $e$, vừa cho bound $d_p$ lớn hơn ($0.375 > 0.354$).

---

## Theorem 11: CRT-RSA trên Takagi Modulus $N = p^r q$

Mở rộng Theorem 10 sang Multi-Power RSA, kết hợp cả hai variant của paper.

### Thiết lập

Với $N = p^r q$, định nghĩa CRT-exponent $d_p$ thỏa $e d_p \equiv 1 \pmod{p-1}$, tức:

$$
ed_p = 1 + k_p(p-1) \implies e d_p + k_p - 1 = k_p \cdot p
$$

Lấy modulo $p$: $ex + y \equiv 0 \pmod{p}$ với $(x_0, y_0) = (d_p, k_p - 1)$.

Nhưng bây giờ $N = p^r q$, nên $p \mid N$ với $p^u \mid N$ ($u = r$) và $p \approx N^\beta$ ($\beta \approx 1/(r+1)$ khi $p \approx q$, chính xác hơn $\beta$ là exponent thực của $p$).

> [!abstract] Theorem 11 — CRT-RSA Attack trên Takagi Modulus
> Cho $N = p^r q$ là Takagi RSA modulus. Cho $e < (p-1)(q-1)$, $d_p < p-1$ thỏa $ed_p \equiv 1 \pmod{p-1}$. Đặt $p < N^\beta$, $e < N^\alpha$, $d_p < N^\delta$. Nếu:
>
> $$
> \delta < r\beta^2 + \beta - \frac{\alpha}{2}
> $$
>
> thì $N$ có thể factorize trong polynomial time.

**Proof.** Ước lượng $k_p$:

$$
k_p = \frac{ed_p - 1}{p-1} < \frac{ed_p}{p-1} < N^{\alpha + \delta - \beta}
$$

Áp dụng Theorem 7 với $u = r$, $v = 1$, bound $\delta$ cho $d_p$ và $\alpha + \delta - \beta$ cho $k_p - 1$:

$$
\delta + (\alpha + \delta - \beta) < u \cdot v \cdot \beta^2 = r\beta^2
$$

$$
2\delta + \alpha - \beta < r\beta^2
$$

$$
\delta < \frac{r\beta^2 + \beta - \alpha}{2} = r\beta^2 + \beta - \frac{\alpha}{2} \cdot \frac{1}{1}
$$

Sau đó $\gcd(N, ed_p + k_p - 1) = p$. $\blacksquare$

> [!tip] 💡 Agent note
> Theorem 11 là điểm hội tụ của cả paper: nó dùng **Second Variant** (homogeneous equation) kết hợp với **Multi-Power modulus** (Takagi scheme), thu được kết quả mạnh hơn bất kỳ công trình nào trước đó cho CRT-exponent trên $N = p^r q$.

---

## Kết quả Thực nghiệm (§4.3)

Paper implement trong **Magma** trên laptop Intel Core i5-2430M, 2.40 GHz. Primes $p, q$ là 512-bit; $e$ fixed 512-bit.

> [!note] Scheme 5.1 — Attack Implementation (Theorems 9–11)
> **Type**: Lattice-based CRT-exponent recovery
>
> **$\mathsf{Attack}(N, e, r, m, t)$**
> - Input: $N = p^r q$, public exponent $e$, exponent $r$, parameters $m, t$
> - Bước 1: Construct $g_k(x_1, x_2) = x_2^{m-k} f^k(x_1,x_2) N^{e_k}$ với $f = ex_1 + x_2$
> - Bước 2: Build lattice $L$ từ coefficient vectors của $g_k(x_1 X_1, x_2 X_2)$
> - Bước 3: Run LLL reduction
> - Bước 4: Factor output polynomial → extract $(d_p, k_p - 1)$
> - Bước 5: Compute $\gcd(N, ed_p + k_p - 1) = p$
> - Output: factorization của $N$

| $N$ (bit) | $r$ | $d_p$-pred (bit) | $(m, t)$ | dim($L$) | $d_p$-exp (bit) | Thời gian (s) |
|-----------|-----|------------------|----------|----------|-----------------|---------------|
| 1024 | 1 | 128 | (6, 3) | 7 | 110 | < 1 |
| 1024 | 1 | 128 | (10, 5) | 11 | 115 | < 1 |
| 1024 | 1 | 128 | (30, 15) | 31 | 124 | 340 |
| 1536 | 2 | 170 | (10, 6) | 11 | 140 | 1 |
| 1536 | 2 | 170 | (30, 20) | 31 | 160 | 449 |
| 2048 | 3 | 192 | (10, 7) | 11 | 135 | 1 |
| 2048 | 3 | 192 | (48, 36) | 49 | 180 | 10584 |

> [!warning] Phân tích bảng thực nghiệm
> - **$r = 1$ (Theorem 10)**: Với $m = 30$, recover được $d_p$ lên tới 124 bit trong 340 giây, gần sát bound lý thuyết 128 bit.
> - **$r = 2, 3$ (Theorem 11)**: Tăng $m$ từ 10 lên 30/48 đẩy $d_p$-exp lên gần bound, nhưng thời gian tăng rất mạnh (ví dụ $r=3$: 1s → 10584s).
> - Nitaj [14] cho $r=1, N=1024$-bit: $d_p$ tối đa khoảng 110 bit. Paper này đạt 124 bit với $m=30$ — cải thiện rõ rệt.
> - Trade-off $m$ lớn vs thời gian là điển hình của mọi attack dựa trên LLL.

---

## Summary

- **Threat model**: Attacker biết $N, e$; tấn công khi CRT-exponent $d_p$ nhỏ hoặc encryption exponent "weak".
- **Theorem 9**: $ex + y \equiv 0 \pmod{p}$, $\gamma + \delta \leq 0.25$ → factorize. Cải thiện Nitaj [14] từ 0.207 lên 0.25.
- **Theorem 10**: $d_p < N^{0.375}/\sqrt{e}$ khi $e < N^{0.75}$ → factorize. Cải thiện Nitaj cả về bound $d_p$ lẫn điều kiện $e$.
- **Theorem 11**: Tổng quát hóa lên $N = p^r q$: $\delta < r\beta^2 + \beta - \alpha/2$. Kết hợp Second Variant + Multi-Power modulus.
- **Experimental**: Attack thực sự chạy được trên 512-bit primes, đạt close-to-theoretical trong thực tế.

---

## References

- [6] Herrmann & May — *Solving linear equations modulo divisors*, Asiacrypt 2008
- [10] Lenstra, Lenstra, Lovász — LLL algorithm, 1982 (🔴 Prerequisite)
- [14] Nitaj — *A new attack on RSA and CRT-RSA*, Africacrypt 2012
- [16] Sarkar — *Reduction in lossiness of RSA trapdoor permutation*, 2012
- [19] Takagi — *Fast RSA-type cryptosystem modulo $p^k q$*, Crypto 1998
