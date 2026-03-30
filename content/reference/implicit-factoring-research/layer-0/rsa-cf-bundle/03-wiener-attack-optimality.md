---
title: "03. Wiener's Attack: Optimality và Giới Hạn"
type: attack
tags: [rsa-cryptanalysis, wiener-attack, continued-fractions, small-private-exponent, attack, lesson-03]
aliases: [Wiener Attack RSA, Tấn công Wiener, Small Private Exponent]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: Continued fractions & Legendre's Theorem (xem [[01-continued-fractions-rsa|01. Continued Fractions & Legendre]])  
> 🔴 **Prerequisite references**: Wiener — *Cryptanalysis of Short RSA Secret Exponents* [Wie90] (original attack paper); Hardy & Wright [HW95] (lý thuyết số nền tảng)  
> **Lesson type**: Attack  
> **Covers**: §3 (Lemmas 3–4), §3.1 đầy đủ (Theorems 2–4, Corollary 1)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $N = pq$ | RSA modulus, $q < p < 2q$ |
> | $e = N^\alpha$ | Public exponent; $\alpha = \log_N e$ |
> | $d < N^{\delta_0}$ | Private exponent; $\delta_0 = \log_N d$ |
> | $k$ | Số nguyên dương: $ed - k\varphi(N) = 1$ |
> | $a_0 = \lfloor e/N \rfloor$ | Partial quotient đầu tiên của $e/N$ |
> | $a/b$ | Ký hiệu chung cho một convergent; $\gcd(a,b)=1$ |
> | $p_r/q_r$ | Convergent thứ $r$ của $e/N$ |
> | $\beta$ | Exponent: $p - q < N^\beta$ (MSB sharing context) |

---

## Bối Cảnh: Small Private Exponent Attack

Trong RSA thực tế, có một cám dỗ rõ ràng: nếu chọn $d$ nhỏ (vài trăm bit thay vì vài nghìn bit), phép giải mã $m = c^d \pmod{N}$ nhanh hơn đáng kể nhờ ít phép nhân mô-đun hơn. Đây là lý do người ta đôi khi dùng "small private exponent".

Năm 1990, Wiener chứng minh điều này **nguy hiểm chết người**: nếu $d < \frac{1}{3} N^{1/4}$, toàn bộ khóa bí mật có thể khôi phục từ $(N, e)$ trong thời gian đa thức bằng phân số liên tục. Đây là một trong những kết quả cryptanalysis đẹp và bất ngờ nhất của thập niên 1990.

Bài học này đi sâu hơn paper gốc của Wiener: thay vì chỉ chứng minh attack hoạt động khi $d < N^{1/4}$, paper Zheng et al. phân tích **khi nào** $k/d$ **không** nằm trong convergents của $e/N$ — qua đó chứng minh Wiener gần tối ưu trong setting $e \approx N$.

---

## Xấp Xỉ $\varphi(N)$ và $p+q$

Trước khi phân tích attack, cần hai lemma về bounds của các đại lượng RSA.

> [!abstract] Lemma 3.1 — Bounds trên $\varphi(N)$ (Lemma 3 trong paper)
> Cho $N = pq$ với $q < p < 2q$. Khi đó:
>
> $$
> 2\sqrt{N} < p + q < \frac{3\sqrt{2}}{2}\sqrt{N}
> $$
>
> và
>
> $$
> N - \frac{3\sqrt{2}}{2}\sqrt{N} + 1 < \varphi(N) < N - 2\sqrt{N} + 1
> $$

> [!info] 🟡 Nguồn
> Lemma 3.1 (Lemma 3 trong paper) được trích từ [Nitaj et al. 2014, §2]. Bounds này xuất phát trực tiếp từ điều kiện $q < p < 2q$ và AM-GM: $p + q > 2\sqrt{pq} = 2\sqrt{N}$, còn bound trên từ $p < 2q$ nên $p + q < 3q < \frac{3}{\sqrt{2}}\sqrt{N}$.  
> *(theo [Nitaj et al. 2014]: Nitaj, Ariffin, Nassr, Bahig — AFRICACRYPT 2014)*

> [!abstract] Lemma 3.2 — Xấp xỉ $p+q \approx 2\sqrt{N}$ (Lemma 4 trong paper)
> Cho $N = pq$. Khi đó:
>
> $$
> 0 < p + q - 2\sqrt{N} < \frac{(p-q)^2}{4\sqrt{N}}
> $$

> [!info] 🟡 Nguồn
> Lemma 3.2 (Lemma 4 trong paper) từ [de Weger 2002]. Hệ quả: nếu $p$ và $q$ gần nhau ($p - q < N^\beta$), thì $p + q \approx 2\sqrt{N}$ với sai số $O(N^{2\beta - 1/2})$. Dùng trong Theorem 7 (Lesson 06).  
> *(theo [deW02]: de Weger — *Cryptanalysis of RSA with Small Prime Difference*, AAECC 2002)*

---

## Tấn Công Wiener: Cơ Chế

> [!note] Scheme 3.3 — Wiener's Attack (Wie90)
> **Type**: Key Recovery Attack on RSA  
> **Điều kiện**: $d < \frac{1}{3} N^{1/4}$ và $e < \varphi(N)$  
> **Setting**: RSA public key $(N, e)$; ciphertext tùy ý (không cần)
>
> **$\mathsf{WienerAttack}(N, e)$**
> - Input: RSA modulus $N$, public exponent $e$
> - **Bước 1**: Tính khai triển phân số liên tục của $e/N$: $e/N = [a_0, a_1, a_2, \ldots]$
> - **Bước 2**: Tính tuần tự các convergents $p_0/q_0, p_1/q_1, p_2/q_2, \ldots$
> - **Bước 3**: Với mỗi convergent $k_i/d_i = p_i/q_i$:
>   - Thử $\varphi(N)_{\text{guess}} = (ed_i - 1) / k_i$ (nếu $k_i \mid ed_i - 1$)
>   - Kiểm tra: $\varphi(N)_{\text{guess}}$ có phải Euler's totient không?  
>     (dùng: nếu $N - \varphi(N) + 1$ là nghiệm nguyên dương của $x^2 - (N - \varphi(N) + 1)x + N = 0$ thì được)
>   - Nếu hợp lệ: xuất $d_i$ là private exponent
> - Output: $d$ — private exponent RSA

**Tại sao hoạt động?** Từ $ed - k\varphi(N) = 1$ và $\varphi(N) \approx N$:

$$
\left| \frac{e}{N} - \frac{k}{d} \right| = \frac{|e \cdot d - k \cdot N|}{Nd} = \frac{|k(N - \varphi(N)) - 1|}{Nd} < \frac{k \cdot 3\sqrt{N}/2}{Nd} \approx \frac{3e}{2Nd}
$$

Vì $k \approx e d / \varphi(N)$, khi $d < N^{1/4}/\sqrt{3}$ thì $|e/N - k/d| < 1/(2d^2)$ — Legendre's criterion thỏa mãn và $k/d$ xuất hiện trong convergents của $e/N$.

> [!info] 🟡 Wiener [1990]
> Wiener's bound gốc là $d < \frac{1}{3}N^{1/4}$; Susilo et al. [2019] cải thiện thành $d < \frac{1}{\sqrt[4]{18}} N^{1/4}$. Cả hai đều dưới $N^{1/4}$ — đây là ngưỡng thực sự của phương pháp continued fraction thuần túy.  
> *(theo [Wie90]: Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory 36(3), 1990)*

---

## Phân Tích: Common Convergents của $e/N$ và $e/\varphi(N)$

Mục tiêu tinh tế hơn của §3.1 trong paper: xác định chính xác khi nào $k/d$ vừa là convergent của $e/\varphi(N)$ (từ Lemma 1.8) **vừa** là convergent của $e/N$ (để ta tìm được từ public key).

> [!abstract] Theorem 3.4 — Bounds trên Common Convergent (Theorem 2 trong paper)
> Cho $N = pq$ với $q < p < 2q$, $e$ là public exponent với $a_0 = \lfloor e/N \rfloor = \lfloor e/\varphi(N) \rfloor$. Nếu $a/b$ là **common convergent** của cả $e/N$ và $e/\varphi(N)$, thì:
>
> $$
> a < \frac{e - a_0 \left(N - \frac{3\sqrt{2}}{2}\sqrt{N} + 1\right)}{\sqrt{e} \cdot N^{1/4}}, \qquad b < \frac{N^{3/4}}{\sqrt{e}}
> $$

**Proof sketch.** Vì $\varphi(N) < N$, hai phân số $e/N$ và $e/\varphi(N)$ khác nhau. Nếu $a/b$ là common convergent:

$$
\left| \frac{e}{\varphi(N)} - \frac{e}{N} \right| = \frac{e(N - \varphi(N))}{N\varphi(N)} > \frac{2e\sqrt{N}}{N\left(N - \frac{3\sqrt{2}}{2}\sqrt{N}\right)}
$$

Mặt khác: $|e/\varphi(N) - a/b| + |a/b - e/N| < 2/b^2$. Kết hợp: $b < N^{3/4}/\sqrt{e}$.

Bound trên $a$ suy ra tương tự bằng cách áp dụng Lemma 3.1 cho phân số nghịch đảo. $\blacksquare$

> [!abstract] Corollary 3.5 — Khi Không Có Common Convergent (Corollary 1 trong paper)
> Nếu $e \in (1, \sqrt{N}) \cup (a_0 \varphi(N),\, a_0 N) \cup (N^{3/2}, +\infty)$ thì $e/N$ và $e/\varphi(N)$ **không có common convergent không tầm thường** (nontrivial).

**Proof.** Ba trường hợp:

1. $e \in (1, \sqrt{N})$: $a_0 = 0$, Theorem 3.4 cho $a < \sqrt{e}/N^{1/4} < 1$ — bất khả thi.
2. $e \in (a_0\varphi(N), a_0 N)$: convergents của $e/N$ nằm dưới $a_0$, convergents của $e/\varphi(N)$ nằm trên $a_0$ — hai phía ngược nhau của $a_0$, không giao nhau.
3. $e > N^{3/2}$: $b < N^{3/4}/\sqrt{e} < 1$ — bất khả thi. $\blacksquare$

---

## Điều Kiện Wiener Thất Bại: Theorem 3

> [!abstract] Theorem 3.6 — Khi $k/d$ Không Nằm Trong Convergents của $e/N$ (Theorem 3 trong paper)
> Cho $N = pq$, $e$ với $a_0 = \lfloor e/N \rfloor$, $ed - k\varphi(N) = 1$. Thì $k/d$ **không** nằm trong convergents của $e/N$ nếu một trong hai điều kiện sau đúng:
>
> **(Trường hợp 1)**: $d < \frac{1}{2}\varphi(N)$ và:
> - $d > \dfrac{N^{3/4}}{\sqrt{e}}$, **hoặc**
> - $k > \dfrac{e - a_0\left(N - \frac{3\sqrt{2}}{2}\sqrt{N} + 1\right)}{\sqrt{e}\cdot N^{1/4}}$
>
> **(Trường hợp 2)**: $\frac{1}{2}\varphi(N) < d < \varphi(N)$ và:
> - $d < \varphi(N) - \dfrac{N^{3/4}}{\sqrt{e}}$, **hoặc**
> - $k < e - \dfrac{e - a_0\left(N - \frac{3\sqrt{2}}{2}\sqrt{N} + 1\right)}{\sqrt{e}\cdot N^{1/4}}$

**Proof.** Từ Lemma 1.8, $k/d$ là convergent của $e/\varphi(N)$ khi $d < \varphi(N)/2$. Theorem 3.4 cho bound $b < N^{3/4}/\sqrt{e}$ trên denominator của mọi common convergent. Nếu $d > N^{3/4}/\sqrt{e}$, thì $k/d$ không thể là common convergent — do đó không nằm trong convergents của $e/N$. Trường hợp 2 tương tự với $e-k$ và $\varphi(N)-d$. $\blacksquare$

---

## Wiener Gần Tối Ưu: Theorem 4

Đây là kết quả lý thuyết sâu nhất của §3.1 — chứng minh rằng **continued fraction thuần túy không thể làm tốt hơn Wiener đáng kể** khi $e \approx N$.

> [!abstract] Theorem 3.7 — Wiener Nearly Optimal (Theorem 4 trong paper)
> Cho $N = pq$ với $q < p < 2q$, và $e < \varphi(N)$ với $e \approx N$. Nếu $d$ thỏa $ed \equiv 1 \pmod{\varphi(N)}$, thì:
>
> $$
> \text{Convergents của } e/N \text{ không thể khôi phục } d \text{ khi } N^{1/4} < d < \varphi(N) - N^{1/4}
> $$

**Proof.** Vì $e \approx N$ và $e < \varphi(N)$: $a_0 = \lfloor e/N \rfloor = 0$.

Điều kiện 1 của Theorem 3.6: $d > N^{3/4}/\sqrt{e} \approx N^{3/4}/N^{1/2} = N^{1/4}$.  
Điều kiện 3: $d < \varphi(N) - N^{3/4}/\sqrt{e} \approx \varphi(N) - N^{1/4}$.

Gộp lại: convergents của $e/N$ thất bại trong khoảng $N^{1/4} < d < \varphi(N) - N^{1/4}$. $\blacksquare$

> [!warning] Hàm ý thực tiễn
> Theorem 3.7 nói: với $e \approx N$ (trường hợp phổ biến nhất trong RSA), phương pháp continued fraction **về mặt nguyên lý không thể** phá RSA nếu $d > N^{1/4}$. Wiener bound $d < N^{1/4}/3$ là gần ngưỡng tối ưu của phương pháp. Để vượt qua $N^{1/4}$, phải kết hợp thêm lattice — đây chính là động lực cho Lessons 04 và 05.

---

## So Sánh Bounds

| Phương pháp | Bound tấn công thành công | Ghi chú |
|-------------|--------------------------|---------|
| Wiener (1990) | $d < \frac{1}{3} N^{1/4}$ | Continued fractions thuần túy |
| Susilo et al. (2019) | $d < \frac{1}{\sqrt[4]{18}} N^{1/4}$ | Legendre mạnh hơn |
| **Lý thuyết tối ưu** (Theorem 3.7) | $d \approx N^{1/4}$ | Ngưỡng cứng của CF method |
| Boneh-Durfee (1999) | $d < N^{0.292}$ | Lattice (vượt ngưỡng CF) |
| Herrmann-May (2010) | $d < N^{1-\sqrt{\alpha\gamma}}$ | Lattice + xấp xỉ $p+q$ |
| **Zheng et al. (paper này)** | $d < N^{1-\alpha/3-\gamma/2}$ | **CF + Lattice (main result)** |

---

## Tóm Tắt

- **Wiener's attack**: khai triển $e/N$, duyệt convergents $p_i/q_i$, thử mỗi cái là $(k, d)$ → poly-time key recovery khi $d < N^{1/4}/3$.
- **Cơ chế**: $|e/N - k/d|$ đủ nhỏ để Legendre's criterion kích hoạt khi $d$ nhỏ.
- **Lemma 3.1, 3.2**: bounds trên $\varphi(N)$ và $p+q$ — cần thiết cho mọi phân tích tiếp theo.
- **Theorem 3.4 & 3.6**: xác định chính xác điều kiện để $k/d$ là (hay không là) convergent của $e/N$.
- **Theorem 3.7** (key insight): CF thuần túy không vượt được $d = N^{1/4}$ khi $e \approx N$ — **Wiener gần tối ưu trong class phương pháp này**.
- Vượt $N^{1/4}$ đòi hỏi lattice. Lesson 04 → Herrmann-May, Lesson 05 → main attack.

---

## References

- [Wie90] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory 36(3), 1990 (🟡 original attack, §3.3)
- [Nitaj et al. 2014] Nitaj, Ariffin, Nassr, Bahig — *New Attacks on the RSA Cryptosystem*, AFRICACRYPT 2014 (🟡 Lemma 3.1)
- [deW02] de Weger — *Cryptanalysis of RSA with Small Prime Difference*, AAECC 13(1), 2002 (🟡 Lemma 3.2)
- [Sus19] Susilo, Tonien, Yang — *The Wiener Attack on RSA Revisited*, ACISP 2019 (⚪ improved bound)
- [BD99] Boneh, Durfee — *Cryptanalysis of RSA with Private Key $d < N^{0.292}$*, EUROCRYPT 1999 (⚪ lattice baseline)
