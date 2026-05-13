---
title: "06. Ứng Dụng: MSB/LSB Sharing của Primes"
type: attack
tags: [rsa-cryptanalysis, msb-sharing, lsb-sharing, partial-information, attack, lesson-06]
aliases: [MSB LSB Sharing Attack, Primes Sharing Bits RSA, Theorem 7 8]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: Main Attack CF + Lattice (xem [[05-main-attack-cf-lattice|05. Main Attack — CF + Lattice]]), Lemma 3.2 về xấp xỉ $p+q$ (xem [[03-wiener-attack-optimality|03. Wiener Attack]])  
> 🔴 **Prerequisite references**: de Weger [deW02] (MSB sharing context); Nitaj et al. [Nitaj14] (Lemma 5 — LSB structure)  
> **Lesson type**: Attack  
> **Covers**: §4.2 đầy đủ (Lemma 5, Theorems 7–8, Remark 2)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\beta_1$ | MSB sharing: $p - q < N^{\beta_1}$, với $1/4 < \beta_1 \leq 1/2$ |
> | $\beta_2$ | LSB sharing: $2^n = N^{\beta_2}$, $\beta_2 < 1/4$, $n$ bit thấp chung |
> | $g$ | Phần chung trong LSB: $p - q = 2^n g$ với $g$ ẩn |
> | $g_0$ | Nghiệm của $x^2 \equiv N \pmod{2^n}$ — tính được từ public key |
> | $r_0$ | Giá trị biết: $r_0 \equiv 2g_0 + (N-g_0^2)g_0^{-1} \pmod{2^{2n}}$ |
> | $r_1$ | Ẩn: $p + q = 2^{2n} r_1 + r_0$ |
> | $\delta_7, \delta_8$ | Attack bounds tương ứng của Theorems 7, 8 trên $\delta_0 = \log_N d$ |

---

## Tình Huống: Primes Chia Sẻ Bits

Trong một số cài đặt RSA không chuẩn — hoặc bị tấn công partial key exposure — hai prime $p$ và $q$ có thể chia sẻ một số bits có nghĩa. Có hai tình huống chính:

**MSB sharing**: $p$ và $q$ gần nhau — $p - q < N^\beta$ nhỏ. Điều này xảy ra khi $p, q$ được chọn từ khoảng hẹp để "cân bằng" modulus, hoặc trong các lược đồ RSA đặc biệt.

**LSB sharing**: $p$ và $q$ có cùng $n$ bits thấp — tức là $p \equiv q \pmod{2^n}$, hay $p - q = 2^n g$ với $g$ ẩn và $2^n$ biết. Điều này xảy ra trong một số cài đặt CRT hoặc prime generation đặc biệt.

Cả hai tình huống đều cung cấp thêm thông tin về $p + q$ — thông tin này được Theorem 6 khai thác qua tham số $\gamma$ (xấp xỉ $p+q$). Bài học này cho thấy cách "chuyển" thông tin MSB/LSB sharing thành giá trị $\gamma$ cụ thể, sau đó áp dụng thẳng Theorem 6.

---

## Trường Hợp 1: MSB Sharing (Primes Gần Nhau)

### Từ $p - q < N^\beta$ đến Xấp Xỉ $p+q$

Theo Lemma 3.2 (từ [deW02], đã trình bày ở Lesson 03):

$$
0 < p + q - 2\sqrt{N} < \frac{(p-q)^2}{4\sqrt{N}} < \frac{N^{2\beta}}{4\sqrt{N}} = \frac{1}{4} N^{2\beta - 1/2}
$$

Chọn $S = \lfloor 2\sqrt{N} \rfloor$ — tính được từ $N$ — và $w = p+q-S$. Khi đó:

$$
|p+q-S| < \frac{1}{4} N^{2\beta - 1/2} \implies \gamma = 2\beta - \frac{1}{2}
$$

### Theorem 7: MSB Sharing Attack

> [!abstract] Theorem 6.1 — MSB Sharing (Theorem 7 trong paper)
> Cho $N = pq$, $e = N^\alpha$, $ed - k\varphi(N) = 1$. Trong setting của Theorem 6 (với convergents $p_r/q_r$ và hệ số $(u,v)$ với $|u|,|v| < N^\delta$). Giả sử $p - q < N^{\beta_1}$ với $1/4 < \beta_1 \leq 1/2$. Khi đó $N$ factorize được trong poly-time nếu:
>
> $$
> \delta < \frac{\alpha}{6} - \beta_1 + \frac{1}{2}
> $$

**Proof.** Đặt $S = \lfloor 2\sqrt{N} \rfloor$. Từ phân tích trên: $|p+q-S| < \frac{1}{4}N^{2\beta_1 - 1/2}$, tức là $\gamma = 2\beta_1 - 1/2$. Thay vào bound Theorem 5.2:

$$
\delta < \frac{\alpha}{6} - \frac{\gamma}{2} + \frac{1}{4} = \frac{\alpha}{6} - \frac{2\beta_1 - 1/2}{2} + \frac{1}{4} = \frac{\alpha}{6} - \beta_1 + \frac{1}{4} + \frac{1}{4} = \frac{\alpha}{6} - \beta_1 + \frac{1}{2}
$$

$\blacksquare$

**Bound tổng quát trên $d$**:

$$
\delta_0 = \delta + \frac{3}{4} - \frac{\alpha}{2} < \frac{5}{4} - \frac{\alpha}{3} - \beta_1
$$

> [!info] 🟡 de Weger [2002]
> Xấp xỉ $p + q \approx 2\sqrt{N}$ với sai số $O(N^{2\beta-1/2})$ được lấy từ [deW02, Lemma 4] — đây là nền tảng cho tất cả các tấn công RSA khai thác MSB sharing của primes.  
> *(theo [deW02]: de Weger — *Cryptanalysis of RSA with Small Prime Difference*, AAECC 2002)*

> [!example] Ví dụ 6.2 — MSB Sharing với $\alpha=1$, $\beta_1 = 1/3$
>
> Giả sử $e \approx N$ ($\alpha = 1$) và $p - q < N^{1/3}$ ($\beta_1 = 1/3$):
> - $\gamma = 2/3 - 1/2 = 1/6$
> - Herrmann-May: $\delta_0 < 1 - \sqrt{1 \cdot 1/6} \approx 1 - 0.408 = 0.592$
> - **Theorem 7**: $\delta_0 < 5/4 - 1/3 - 1/3 = 5/4 - 2/3 = 7/12 \approx \mathbf{0.583}$
>
> Trong trường hợp này Herrmann-May tốt hơn một chút (0.592 > 0.583). Điều này nhất quán với phân tích $\Delta$: bound mới tốt hơn trong phần lớn khoảng $\alpha$, không phải tất cả.

---

## Trường Hợp 2: LSB Sharing (Primes Có Bits Thấp Chung)

### Cấu Trúc LSB — Lemma 5

> [!abstract] Lemma 6.3 — Cấu Trúc $p+q$ khi LSB Sharing (Lemma 5 trong paper)
> Cho $N = pq$, $q < p < 2q$. Giả sử $p$ và $q$ chia sẻ $n$ bits thấp và $p - q = 2^n g$ với $n$ biết và $g$ ẩn. Đặt $g_0$ là nghiệm của $x^2 \equiv N \pmod{2^n}$ (tính được từ $N$ và $n$), và:
>
> $$
> r_0 \equiv 2g_0 + (N - g_0^2) g_0^{-1} \pmod{2^{2n}}
> $$
>
> Khi đó tồn tại số nguyên dương $p_0, q_0, r_1$ sao cho:
>
> $$
> p = 2^n p_0 + g_0, \quad q = 2^n q_0 + g_0, \quad p + q = 2^{2n} r_1 + r_0
> $$
>
> Cả $r_0$ lẫn $n$ đều tính được từ public key. $r_1$ là ẩn cần tìm.

> [!info] 🟡 Nguồn Lemma 6.3
> Lemma 5 trong paper được trích từ [Nitaj et al. 2014, §3]. Cấu trúc này phổ biến trong các tấn công RSA với LSB leakage. $g_0$ tính bằng Hensel lifting từ $g_0^2 \equiv N \pmod{2}$ (vì $N = pq$ và $p \equiv q \equiv g_0 \pmod{2^n}$).  
> *(theo [Nitaj14]: Nitaj, Ariffin, Nassr, Bahig — AFRICACRYPT 2014)*

### Từ Lemma 6.3 đến Xấp Xỉ $p+q$

Với $p + q = 2^{2n} r_1 + r_0$ và $r_0$ biết, xấp xỉ tự nhiên là $S = r_0$ và ẩn là $r_1$:

$$
r_1 = \frac{p+q-r_0}{2^{2n}} < \frac{p+q}{N^{2\beta_2}} < 3 N^{1/2 - 2\beta_2}
$$

Đặt $X = 3N^{1/2 - 2\beta_2}$, tức là $\gamma = 1/2 - 2\beta_2$ trong framework Theorem 6 (với $r_1$ đóng vai trò của $w = x_0$).

### Theorem 8: LSB Sharing Attack

> [!abstract] Theorem 6.4 — LSB Sharing (Theorem 8 trong paper)
> Cho $N = pq$, $e = N^\alpha$, $ed - k\varphi(N) = 1$. Trong setting của Theorem 6. Giả sử $p - q = 2^n g$ với $2^n = N^{\beta_2}$, $\beta_2 < 1/4$, $n$ biết, $g$ ẩn. Khi đó $N$ factorize được trong poly-time nếu:
>
> $$
> \delta < \frac{\alpha}{6} + \beta_2
> $$

**Proof.** Từ Lemma 6.3: $r_1 < 3N^{1/2-2\beta_2}$, tức là $\gamma = 1/2 - 2\beta_2$. Thay vào Theorem 5.2:

$$
\delta < \frac{\alpha}{6} - \frac{\gamma}{2} + \frac{1}{4} = \frac{\alpha}{6} - \frac{1/2 - 2\beta_2}{2} + \frac{1}{4} = \frac{\alpha}{6} - \frac{1}{4} + \beta_2 + \frac{1}{4} = \frac{\alpha}{6} + \beta_2
$$

$\blacksquare$

**Bound tổng quát trên $d$**:

$$
\delta_0 < \delta + \frac{3}{4} - \frac{\alpha}{2} < \beta_2 - \frac{\alpha}{3} + \frac{3}{4}
$$

**Phương trình khóa trong setting LSB**: Phương trình gốc $ed - k\varphi(N) = 1$ với $p+q = 2^{2n}r_1 + r_0$ và $d = uq_r + vq_{r-1}$, $k = up_r + vp_{r-1}$:

$$
2^{2n} p_r r_1 u + 2^{2n} p_{r-1} r_1 v - p_r(N+1-r_0)u - [(N+1-r_0)p_{r-1} - eq_{r-1}]v - 1 \equiv 0 \pmod{eq_r}
$$

Nhân với $2^{-2n} p_r^{-1} \pmod{eq_r}$ (giả sử $\gcd(2p_r, eq_r) = 1$) → đa thức $f(x,y,z) = xy + a_1'xz + a_2'y + a_3'z + a_4'$ với $x_0 = r_1$, $y_0 = u$, $z_0 = v$, các hằng số $a_i'$ tương tự Theorem 6 nhưng tính với $r_0$ thay $S$.

> [!info] 🟡 So sánh với Sun et al. [2008]
> Sun et al. [CANS08] dùng phương pháp Boneh-Durfee yếu hơn và đạt bound:
>
> $$
> \delta_0 < \frac{7}{6} - \frac{2}{3}\beta_2 - \frac{4}{3}\sqrt{\beta_2^2 - \frac{3}{2}\alpha + \frac{1}{2}\left(\beta_2 + \frac{6\alpha+1}{16}\right)}
> $$
>
> Bound của Theorem 8 ($\delta_0 < \beta_2 - \alpha/3 + 3/4$) tốt hơn khi $\beta_2 < 1/4 + (2\sqrt{10}-7)\alpha/9$.  
> *(theo [Sun08]: Sun, Wu, Steinfeld, Guo, Wang — CANS 2008)*

---

## Remark 2: Tính Nhất Quán của Hai Bounds

> [!abstract] Remark 6.5 (Remark 2 trong paper) — Consistency của Theorems 7 và 8
> Bound ở Theorem 7 ($1/4 < \beta_1 \leq 1/2$):
>
> $$
> \delta < \frac{\alpha}{6} - \beta_1 + \frac{1}{2}
> $$
>
> Bound ở Theorem 8 ($\beta_2 < 1/4$):
>
> $$
> \delta < \frac{\alpha}{6} + \beta_2
> $$
>
> Bỏ phần $\alpha/6$ chung, hai bounds còn lại là $1/2 - \beta_1$ (Theorem 7) và $\beta_2$ (Theorem 8). Hai expressions này **bằng nhau khi $\beta_1 + \beta_2 = 1/2$** — tức là ở ngưỡng $\beta_1 = 1/2$, $\beta_2 = 0$ (hai primes bằng nhau, không thực tế) và tổng quát: chúng "khớp" tại biên giới phân vùng $\beta = 1/4$.

**Diễn giải**: Theorem 7 áp dụng khi primes gần nhau ($\beta_1 > 1/4$, sai số $\gamma$ lớn → khó hơn). Theorem 8 áp dụng khi primes chia sẻ nhiều LSBs ($\beta_2 < 1/4$, nhưng $\gamma = 1/2 - 2\beta_2$ nhỏ hơn → dễ hơn). Tại $\beta_1 = \beta_2 = 1/4$: cả hai cho cùng performance — đây là điểm "phase transition" tự nhiên.

---

## Tổng Quan Ba Trường Hợp

| Scenario | Thông tin thêm | $\gamma$ | Bound $\delta_0$ |
|----------|---------------|----------|-----------------|
| Chỉ biết $S$ xấp xỉ $p+q$ | $\|p+q-S\| < N^\gamma$ | $\gamma$ (tự do) | $< 1 - \alpha/3 - \gamma/2$ |
| MSB sharing | $p - q < N^{\beta_1}$, $\beta_1 > 1/4$ | $2\beta_1 - 1/2$ | $< 5/4 - \alpha/3 - \beta_1$ |
| LSB sharing | $p - q = 2^n g$, $2^n = N^{\beta_2}$, $\beta_2 < 1/4$ | $1/2 - 2\beta_2$ | $< \beta_2 - \alpha/3 + 3/4$ |

---

## Tóm Tắt

- **Cả hai trường hợp** là corollary trực tiếp của Theorem 6: chỉ cần tính $\gamma$ phù hợp từ điều kiện MSB/LSB, sau đó thay vào bound $\delta < \alpha/6 - \gamma/2 + 1/4$.
- **MSB sharing** ($p - q < N^{\beta_1}$): dùng $S = \lfloor 2\sqrt{N} \rfloor$, $\gamma = 2\beta_1 - 1/2$ → $\delta_0 < 5/4 - \alpha/3 - \beta_1$.
- **LSB sharing** ($p-q=2^ng$): dùng $r_0$ từ Lemma 6.3, tìm ẩn $r_1$ thay $w$ → $\gamma = 1/2 - 2\beta_2$ → $\delta_0 < \beta_2 - \alpha/3 + 3/4$.
- **Remark 2**: bounds nhất quán tại biên $\beta = 1/4$ — cấu trúc đẹp cho thấy hai trường hợp là hai mặt của cùng một hiện tượng.
- **Cải thiện so với [Sun08]**: tốt hơn khi $\beta_2 < 1/4 + (2\sqrt{10}-7)\alpha/9$.

---

## References

- [deW02] de Weger — *Cryptanalysis of RSA with Small Prime Difference*, AAECC 13(1), 2002 (🟡 Lemma 4 → Theorem 7)
- [Nitaj14] Nitaj, Ariffin, Nassr, Bahig — *New Attacks on the RSA Cryptosystem*, AFRICACRYPT 2014 (🟡 Lemma 6.3 = Lemma 5 trong paper)
- [Sun08] Sun, Wu, Steinfeld, Guo, Wang — *Cryptanalysis of Short Exponent RSA with Primes Sharing Least Significant Bits*, CANS 2008 (🟡 comparison với Theorem 8)
- [Wie90] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, 1990 (⚪ background)
