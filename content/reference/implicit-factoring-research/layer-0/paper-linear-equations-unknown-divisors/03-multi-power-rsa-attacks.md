---
title: "03. Multi-Power RSA Attacks"
type: attack
tags: [linear-equations-unknown-divisors, rsa, multi-power-rsa, attack, lesson-03]
aliases: [Multi-Power RSA, Small Secret Exponent Attack]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: [[01-problem-setting-lattice-preliminaries|01. Problem Setting & Lattice Preliminaries]], [[02-first-variant-generalized-linear-equations|02. First Variant: Generalized Linear Equations]] (Theorem 1, 2)  
> 🔴 **Prerequisite references**: LLL [10], Coppersmith [3]  
> **Lesson type**: Attack  
> **Covers**: §3.2 (Theorem 4, 5, 6, Table 1), §3.3 (Table 2 — Experimental Results)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $N = p^r q$ | Multi-power RSA modulus | $N$ |
> | $r$ | Exponent của $p$, $r \geq 2$ | $r$ |
> | $e$ | Public exponent | $e$ |
> | $d$ | Secret exponent: $ed \equiv 1 \pmod{\phi(N)}$ | $d$ |
> | $\delta$ | $d \approx N^\delta$ | $\delta$ |
> | $k$ | $ed - 1 = k \cdot p^{r-1}(p-1)(q-1)$ | $k$ |
> | $\tilde{d}$ | Approximation của $d$ (partial key exposure) | $\tilde{d}$ |
> | $d_0, M$ | LSB exposure: $d = d_1 M + d_0$ | $d_0, M$ |

---

## Context: Multi-Power RSA

> [!info] 🟡 Takagi '98 [19] — Multi-Power RSA
> **Multi-power RSA** dùng modulus $N = p^r q$ thay vì $N = pq$ thông thường. Ưu điểm: decrypt nhanh hơn nhờ CRT và cấu trúc $p^r$. Ứng dụng trong Okamoto-Uchiyama ($r=2$), EPOC, ESIGN.
>
> **Key relation**: $\phi(N) = p^{r-1}(p-1)(q-1)$, do đó $ed \equiv 1 \pmod{p^{r-1}(p-1)(q-1)}$.
>
> Takagi [19] chứng minh: nếu $d < N^{1/(2(r+1))}$ thì factorize được $N$. Đây là xuất phát điểm của các cải thiện sau.
>
> *(theo [19]: Takagi — Fast RSA-type cryptosystem modulo $p^k q$, Crypto 1998)*

### Điểm quan sát then chốt

Từ $ed \equiv 1 \pmod{p^{r-1}(p-1)(q-1)}$, tồn tại $k \in \mathbb{N}$ sao cho:

$$
ed - 1 = k \cdot p^{r-1}(p-1)(q-1)
$$

Điều này có nghĩa:

$$
ed - 1 \equiv 0 \pmod{p^{r-1}}
$$

tức $y = d$ là nghiệm của phương trình tuyến tính:

$$
f_1(x) = ex - 1 \equiv 0 \pmod{p^{r-1}}
$$

**Đây chính xác là First Variant** với:
- $v = r-1$ (modulus ẩn là $p^{r-1}$)
- $u = r$ (vì $N = p^r q \equiv 0 \pmod{p^r}$)
- $\beta = 1/(r+1)$ (vì $p, q$ có cùng bit-size, $p \approx N^{1/(r+1)}$)

> [!warning] Tại sao $u \neq v$?
> Đây là điểm mấu chốt: $N \equiv 0 \pmod{p^r}$ (tức $u = r$), nhưng ta chỉ cần giải mod $p^{r-1}$ (tức $v = r-1$). Sự tách biệt $u \neq v$ chính là lý do paper này cải thiện được so với Herrmann–May (vốn chỉ xét $u = v = 1$).

---

## Theorem 4: Small Secret Exponent Attack

> [!abstract] Theorem 4 — Small Secret Exponent trên Multi-Power RSA
> Cho $N = p^r q$ với $r \geq 2$ đã biết, $p, q$ nguyên tố cùng bit-size. Cho $(e, d)$ là cặp khóa thỏa $ed \equiv 1 \pmod{\phi(N)}$. Nếu:
>
> $$
> d < N^{\frac{r(r-1)}{(r+1)^2}}
> $$
>
> thì $N$ có thể factorize trong polynomial time.

**Proof.** Áp dụng Theorem 1 với:

$$
f_1(x) = ex - 1,\quad p^u \mid N \text{ với } u = r,\quad v = r-1,\quad \beta = \frac{1}{r+1}
$$

Bound của Theorem 1: $\gamma < uv\beta^2 = r \cdot (r-1) \cdot \frac{1}{(r+1)^2} = \frac{r(r-1)}{(r+1)^2}$.

LLL tìm được $d$ từ lattice. Khi có $d$, tính $\gcd(ed-1, N)$: vì $ed - 1 = k \cdot p^{r-1}(p-1)(q-1)$ nên $\gcd(ed-1, N)$ là một lũy thừa của $p$, cho phép recover $p$ và factorize $N$. $\blacksquare$

> [!tip] 💡 Agent note
> Bước cuối — recover $p$ từ $d$ — dùng $\gcd(ed-1, N) = p^{r-1}$ (paper quan sát: $p^{r-1} \mid ed-1$ nhưng $p^r \nmid ed-1$ trong hầu hết trường hợp). Đây là điểm tế nhị: paper phát biểu $\gcd(ed-1, N) = p^{r-1}$ nhưng thực tế có thể nhận được $p^{r-1}$ hoặc lũy thừa cao hơn, và từ đó đều recover được $p$.

---

## So sánh Bound: May vs Sarkar vs Lu–Zhang–Lin

> [!info] 🟡 May PKC'04 [12] — Kết quả bị cải thiện
> May [12] cải thiện Takagi bằng bound:
>
> $$
> \delta < \max\!\left\{\frac{r}{(r+1)^2},\; \frac{(r-1)^2}{(r+1)^2}\right\}
> $$
>
> Với $r = 2$: $\max\{2/9, 1/9\} = 2/9 \approx 0.222$.  
> Với $r = 3$: $\max\{3/16, 4/16\} = 4/16 = 0.25$.
>
> *(theo [12]: May — Secret exponent attacks on RSA-type schemes with moduli $N = p^r q$, PKC 2004)*

> [!info] 🟡 Sarkar '14 [17] — Cải thiện khác nhưng có giới hạn
> Sarkar [17] cải thiện May's bound cho $r \geq 3$, nhưng **kết quả của Sarkar phụ thuộc vào $e$** — không áp dụng được khi public exponent $e$ tùy ý lớn.
>
> *(theo [17]: Sarkar — Small secret exponent attack on RSA variant with modulus $N = p^r q$, 2014)*

**Bound của Theorem 4** là $\delta < r(r-1)/(r+1)^2$. So sánh:

| $r$ | May's bound | Sarkar's bound | **Our bound** |
|-----|-------------|----------------|---------------|
| 2 | 0.222 | 0.390 | **0.222** |
| 3 | 0.250 | 0.410 | **0.375** |
| 4 | 0.360 | 0.430 | **0.480** |
| 5 | 0.444 | 0.460 | **0.556** |
| 6 | 0.510 | 0.480 | **0.612** |
| 7 | 0.562 | 0.510 | **0.656** |
| 8 | 0.600 | 0.530 | **0.691** |
| 9 | 0.640 | 0.540 | **0.720** |

> [!warning] Nhận xét quan trọng
> - Với $r = 2$: Our bound = May's bound (không cải thiện).
> - Với $r \geq 3$: Our bound **vượt cả May và Sarkar**, và **không phụ thuộc $e$** (độc lập với public exponent).
> - Sarkar vượt May ở $r = 2, 3, 4$ nhưng bị giới hạn bởi yêu cầu $e$ nhỏ.

---

## Theorem 5 & 6: Partial Key Exposure Attacks

Từ Theorem 4, paper ngay lập tức suy ra hai dạng tấn công **partial key exposure** — trường hợp kẻ tấn công biết một phần của $d$.

### Theorem 5: Known Most Significant Bits (MSBs)

> [!abstract] Theorem 5 — MSB Partial Key Exposure
> Cho cùng setting như Theorem 4. Cho $\tilde{d}$ là xấp xỉ của $d$ sao cho:
>
> $$
> \left\lvert d - \tilde{d} \right\rvert < N^{\frac{r(r-1)}{(r+1)^2}}
> $$
>
> Thì $N$ có thể factorize trong polynomial time.

**Proof.** Đặt $\Delta = d - \tilde{d}$. Khai triển:

$$
e\Delta + e\tilde{d} - 1 \equiv 0 \pmod{p^{r-1}}
$$

Đặt $f_1(x) = ex + (e\tilde{d} - 1)$. Đây là linear polynomial với $a_0 = e\tilde{d} - 1$ (đã biết) và nghiệm cần tìm là $y = \Delta = d - \tilde{d}$. Áp dụng Theorem 1 với cùng tham số $u = r, v = r-1, \beta = 1/(r+1)$, thu được bound $|\Delta| < N^{r(r-1)/(r+1)^2}$. $\blacksquare$

### Theorem 6: Known Least Significant Bits (LSBs)

> [!abstract] Theorem 6 — LSB Partial Key Exposure
> Cho cùng setting như Theorem 4. Giả sử biết $d_0$ và $M$ sao cho $d \equiv d_0 \pmod{M}$ và:
>
> $$
> M > N^{\frac{3r+1}{(r+1)^2}}
> $$
>
> Thì $N$ có thể factorize trong polynomial time.

**Proof.** Viết $d = d_1 M + d_0$, suy ra:

$$
e d_1 M + (e d_0 - 1) \equiv 0 \pmod{p^{r-1}}
$$

Polynomial $f_1(x) = eMx + (ed_0 - 1)$ có nghiệm $y = d_1$, và bound cần:

$$
d_1 \approx \frac{d}{M} < \frac{N^\delta}{M}
$$

Áp dụng Theorem 1 với $\gamma$ là log-bound của $d_1$: cần $\gamma < uv\beta^2 = r(r-1)/(r+1)^2$, tức:

$$
\frac{\delta}{M_{\log}} < \frac{r(r-1)}{(r+1)^2}
$$

Rearrange: bound trên $\delta$ kết hợp với $M$ cho:

$$
M > N^{\delta - \frac{r(r-1)}{(r+1)^2}} = N^{\frac{3r+1}{(r+1)^2}}
$$

(dùng $\delta \leq 1$ và thay số). $\blacksquare$

> [!tip] 💡 Agent note
> Bound $M > N^{(3r+1)/(r+1)^2}$ có nghĩa là cần biết ít nhất $(3r+1)/(r+1)^2$ phần $\log_2 N$ LSB bits của $d$ để attack thành công. Ví dụ với $r=3, N=2048$-bit: cần $>2048 \times 10/16 = 1280$ LSB bits.

---

## Kết quả Thực nghiệm (§3.3)

Paper implement attack của §3.2 trong **Magma** trên laptop Intel Core i5-2430M, 2.40 GHz, 2 GB RAM, với primes $p, q$ là 512-bit.

> [!note] Scheme 3.1 — Attack Implementation (Theorem 4)
> **Type**: Lattice-based factorization attack  
> **Setting**: $N = p^r q$, $p, q$ là 512-bit primes; công cụ Magma [21]
>
> **$\mathsf{Attack}(N, e, r, m, t)$**
> - Input: modulus $N$, public exponent $e$, exponent $r$, lattice parameters $m, t$
> - Bước 1: Construct polynomials $g_k(x) = f^k(x) \cdot N^{e_k}$ với $f(x) = ex - 1$, $k = 0,\ldots,m$
> - Bước 2: Build lattice $L$ từ coefficient vectors của $g_k(xX)$, $X = N^{r(r-1)/(r+1)^2}$
> - Bước 3: Run LLL reduction trên $L$
> - Bước 4: Extract root $d$ từ polynomial tương ứng vector ngắn nhất
> - Bước 5: Compute $\gcd(ed-1, N)$ để recover $p$
> - Output: factorization $(p^r, q)$ của $N$

| $N$ (bit) | $r$ | $e$ (bit) | $d$-pred (bit) | $(m, t)$ | dim($L$) | $d$-exp (bit) | Thời gian (s) |
|-----------|-----|-----------|----------------|----------|----------|---------------|---------------|
| 1536 | 2 | 1536 | 341 | (30, 20) | 31 | 315 | 2354 |
| 2048 | 3 | 2048 | 768 | (20, 15) | 21 | 700 | 671 |
| 2048 | 3 | 4096 | 768 | (20, 15) | 21 | 700 | 711 |
| 2048 | 3 | 2048 | 768 | (40, 30) | 41 | 735 | 29228 |
| 2560 | 4 | 2560 | 1228 | (20, 16) | 21 | 1135 | 628 |
| 2560 | 4 | 2560 | 1228 | (30, 24) | 31 | 1165 | 9159 |

> [!warning] Đọc bảng thực nghiệm
> - **$d$-pred**: số bit lý thuyết có thể attack (theo bound Theorem 4).
> - **$d$-exp**: số bit thực tế recover được trong experiment.
> - $d$-exp < $d$-pred là bình thường: heuristic LLL chạy tốt hơn lý thuyết với $m$ vừa phải, nhưng chưa đạt bound asymptotic.
> - Hai dòng $r=3$ với $m=20$ và $m=40$: khi tăng $m$, $d$-exp tăng (735 > 700) nhưng thời gian tăng rất mạnh (29228s vs 671s) — trade-off điển hình.
> - Attack **độc lập với $e$**: hai dòng $r=3$ với $e$-bit 2048 và 4096 cho cùng $d$-exp 700 bit.

---

## Phân tích Toán học: Tại sao bound $r(r-1)/(r+1)^2$ tốt hơn May?

So sánh trực tiếp hai bound tại $r = 3$:

$$
\text{May: } \frac{(r-1)^2}{(r+1)^2} = \frac{4}{16} = 0.25
\qquad \text{vs} \qquad
\text{Ours: } \frac{r(r-1)}{(r+1)^2} = \frac{6}{16} = 0.375
$$

Sự cải thiện đến từ việc khai thác $u = r > 1$ trong Theorem 1. May [12] về cơ bản dùng $u = 1$ (chỉ dùng $p \mid N$ chứ không dùng $p^r \mid N$). Khi tăng $u$, determinant lattice giảm, LLL tìm được vector ngắn hơn, cho phép nghiệm lớn hơn.

Cụ thể, factor cải thiện là:

$$
\frac{r(r-1)/(r+1)^2}{(r-1)^2/(r+1)^2} = \frac{r}{r-1}
$$

Với $r = 3$: cải thiện $3/2 = 1.5\times$. Với $r \to \infty$: $r/(r-1) \to 1$ (sự chênh lệch giảm).

> [!question] Exercise
> Kiểm tra: với $r = 2$, tại sao bound của paper bằng May's bound $0.222$ (không cải thiện)?
>
> *Gợi ý*: Tính $r(r-1)/(r+1)^2$ và $\max\{r/(r+1)^2, (r-1)^2/(r+1)^2\}$ tại $r=2$ và so sánh.

---

## Summary

- **Threat model**: Attacker biết $N = p^r q$, $e$, tìm factorization khi $d$ nhỏ.
- **Theorem 4**: $d < N^{r(r-1)/(r+1)^2}$ → factorize $N$. Áp dụng Theorem 1 với $u=r, v=r-1, \beta=1/(r+1)$.
- **Theorem 5** (MSBs): Biết $\tilde{d}$ xấp xỉ $d$ → $|d - \tilde{d}| < N^{r(r-1)/(r+1)^2}$ là đủ.
- **Theorem 6** (LSBs): Biết $d_0 = d \bmod M$ → $M > N^{(3r+1)/(r+1)^2}$ là đủ.
- **Improvement over May**: Factor $r/(r-1)$ — đến từ khai thác $u = r$ trong Theorem 1.
- **Advantage over Sarkar**: Không phụ thuộc kích thước $e$.
- **Experimental**: Attack thành công trên 512-bit primes; $r = 3$ với $m = 20$ chạy trong 671s.

---

## References

- [10] Lenstra, Lenstra, Lovász — LLL algorithm, 1982 (🔴 Prerequisite)
- [12] May — *Secret exponent attacks on RSA-type schemes with moduli N = p^r q*, PKC 2004
- [17] Sarkar — *Small secret exponent attack on RSA variant with modulus N = p^r q*, 2014
- [19] Takagi — *Fast RSA-type cryptosystem modulo p^k q*, Crypto 1998
- [21] Magma — Bosma, Cannon, Playoust, 1997
