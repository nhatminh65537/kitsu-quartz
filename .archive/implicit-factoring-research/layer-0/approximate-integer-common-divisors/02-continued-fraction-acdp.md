---
title: "02. Continued Fraction Attack on ACDP"
type: attack
tags: [approximate-gcd, acdp, continued-fraction, wiener, pacdp, gacdp, attack, lesson-02]
aliases: [PACD_CF, GACD_CF, Continued Fraction ACDP]
source: "Approximate Integer Common Divisors — Nick Howgrave-Graham, CaLC 2001"
created: 2026-03-25
---

> **Prerequisites**: [[01-acdp-framework|01. ACDP Framework]], continued fraction theory (convergents), Euclidean algorithm  
> 🔴 **Prerequisite references**: Hardy & Wright — *An Introduction to the Theory of Numbers* [6] (lý thuyết phân số liên tiếp, Ch. X)  
> **Lesson type**: Attack  
> **Covers**: §2 A Continued Fraction Approach (Theorem 21, existence proofs of PACD_CF and GACD_CF)
>
> **Notation** (kế thừa từ [[01-acdp-framework|Lesson 01]]):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\rho$ | Số thực được xấp xỉ bởi continued fraction | $\rho$ |
> | $g_i/h_i$ | Convergents (xấp xỉ tốt nhất) của $\rho$ | $g_i/h_i,\ i = 1\ldots m$ |
> | $a', b'$ | $(a_0 + x_0)/d$ và $(b_0 + y_0)/d$ — bội nhỏ sau khi chia $d$ | $a', b'$ (paper dùng $a, b$ nhưng ta đổi để tránh nhầm) |
> | $\beta$ | $\log_{b_0} X$ — cỡ error (biến kép với Lesson 01) | $\beta$ |

---

## Motivation: Euclidean Algorithm Dưới Additive Noise

Thuật toán Euclid nhạy cảm với sai số như thế nào? Nếu ta thay $a$ bằng $a_0 = a + x_0$, thuật toán Euclid sẽ cho kết quả sai. Tuy nhiên, **phân số liên tiếp** (continued fraction) của tỷ số $a_0/b_0$ có thể giúp ta recover $d$ — vì tỷ số $a/b$ (sau khi chia cho $d$) sẽ xuất hiện như một **convergent tốt** của $a_0/b_0$.

Paper §2 phân tích điều này một cách chính xác thông qua định lý classical về convergents.

---

## Theorem 21: Công Cụ Trung Tâm

> [!abstract] Theorem 21 — Continued Fraction Convergents (Hardy & Wright [6])
> Cho $\rho$ là một số thực bất kỳ. Gọi $g_i/h_i$, $i = 1\ldots m$, là các convergents trong continued fraction expansion của $\rho$.
>
> **(i)** Với mọi $i = 1\ldots m$:
>
> $$
> \left|\rho - \frac{g_i}{h_i}\right| < \frac{1}{h_i^2}
> $$
>
> **(ii)** Conversely: với mọi cặp số nguyên $s, t$ thoả mãn
>
> $$
> \left|\rho - \frac{s}{t}\right| < \frac{1}{2t^2}
> $$
>
> thì $s/t$ là một trong các convergents $g_j/h_j$.

**Proof.** Đây là kết quả cổ điển. Phần (i) theo từ định nghĩa của convergents: mỗi $g_i/h_i$ là best rational approximation với denominator $\leq h_i$. Phần (ii) là chiều ngược: nếu một phân số xấp xỉ $\rho$ đủ tốt (sai số $< 1/(2t^2)$) thì nó phải là một convergent. (Xem [6, Theorem 184].) $\blacksquare$

> [!tip] 💡 Agent note
> Phần (ii) của Theorem 21 là chiều quan trọng hơn cho mục đích tấn công: nó đảm bảo rằng nếu $a'/b'$ xấp xỉ $a_0/b_0$ **đủ tốt**, ta sẽ **tìm thấy** $a'/b'$ trong danh sách convergents mà không cần biết trước $d$.

---

## Cốt Lõi Của Phương Pháp: Tại Sao $a'/b'$ Xuất Hiện Trong Convergents?

Đặt $a' = (a_0 + x_0)/d$ và $b' = (b_0 + y_0)/d$. Vì $d \mid (a_0 + x_0)$ và $d \mid (b_0 + y_0)$, cả $a'$ và $b'$ đều là số nguyên. Kích thước của chúng:

$$
|a'|,\ |b'| < b_0^{1-\alpha}
$$

vì $a_0 + x_0 \sim b_0$ và $d = b_0^\alpha$.

Bây giờ tính sai số giữa $a_0/b_0$ và $a'/b'$:

$$
\frac{a_0}{b_0} = \frac{a_0 + x_0}{b_0 + y_0} + \frac{a_0 y_0 - b_0 x_0}{b_0(b_0 + y_0)} = \frac{a'}{b'} + \frac{a_0 y_0 - b_0 x_0}{b_0(b_0 + y_0)}
$$

Do đó:

$$
\left|\frac{a_0}{b_0} - \frac{a'}{b'}\right| = \frac{|a_0 y_0 - b_0 x_0|}{b_0(b_0 + y_0)} < b_0^{\beta - 1}
$$

vì tử số bị chặn bởi $b_0 \cdot Y + b_0 \cdot X \sim b_0^{1+\beta}$ và mẫu số $\sim b_0^2$.

Theo Theorem 21 phần (ii), $a'/b'$ sẽ xuất hiện như một convergent của $a_0/b_0$ nếu:

$$
b_0^{\beta - 1} < \frac{1}{2(b')^2} \approx b_0^{-2(1-\alpha)}
$$

(bỏ qua constant 2 vì ta làm asymptotic). Điều này tương đương:

$$
\beta - 1 < -2(1-\alpha) \quad \Longleftrightarrow \quad \beta < 2\alpha - 1
$$

Đây chính xác là bound trong định nghĩa của Alg. 11 và Alg. 13!

---

## Chứng Minh Sự Tồn Tại: PACD_CF (Algorithm 11)

> [!abstract] Claim 2.1 — PACD_CF hoạt động khi $\beta < 2\alpha - 1$
> Với $\alpha > 1/2$ và $|x_0| < X = b_0^{2\alpha-1}$ (tức $\beta < 2\alpha-1$): thuật toán PACD_CF tìm được $d$ trong thời gian đa thức.

**Proof.** Trong PACDP, $y_0 = 0$, do đó $b' = b_0/d$ và $a' = (a_0 + x_0)/d$.

Tỷ số $a'/b' = (a_0 + x_0)/b_0$. Ta có:

$$
\left|\frac{a_0}{b_0} - \frac{a'}{b'}\right| = \frac{|x_0|}{b_0} < \frac{b_0^{2\alpha - 1}}{b_0} = b_0^{2\alpha - 2}
$$

Theo Theorem 21(ii), $a'/b'$ là convergent của $a_0/b_0$ nếu $b_0^{2\alpha-2} < 1/(2(b')^2)$. Vì $|b'| = b_0/d < b_0^{1-\alpha}$, ta có $(b')^2 < b_0^{2(1-\alpha)}$, do đó:

$$
\frac{1}{2(b')^2} > \frac{1}{2} b_0^{-2(1-\alpha)} = \frac{1}{2} b_0^{2\alpha - 2}
$$

Vậy $b_0^{2\alpha-2} < (1/2) \cdot 2 b_0^{2\alpha-2}$ — điều kiện thoả (bỏ qua constant). Vì có đa thức nhiều convergents, ta kiểm tra từng $g_i/h_i$: nếu $h_i \mid b_0$ thì output $d = b_0/h_i$.

Đảm bảo $|x_0| < X$: với approximant đúng, $x_0 = a_0 - d \cdot g_i = a_0 - (b_0/h_i) \cdot g_i < b_0/h_i^2 \cdot h_i = b_0/h_i \leq b_0^{2\alpha-1} = X$. $\blacksquare$

---

## Chứng Minh Sự Tồn Tại: GACD_CF (Algorithm 13)

Trong GACDP ($y_0 \neq 0$), $h_i$ không nhất thiết chia hết $b_0$. Thay vào đó, với mỗi convergent $g_i/h_i$, ta tìm integer $k$ tối thiểu hoá $\|k(g_i, h_i) - (a_0, b_0)\|_\infty = \|(x_0, y_0)\|_\infty$.

Vấn đề: với mỗi $g_i/h_i$ có thể có nhiều giá trị $k$ cho $(x_0, y_0)$ thoả $|x_0|, |y_0| < X$. Cụ thể, $(x_0', y_0') = (k+l)(g_i, h_i) - (a_0, b_0)$ cũng thoả bound nếu $|l \cdot g_i|, |l \cdot h_i| < X$.

Vì $|h_i| \sim b_0^{1-\alpha}$, số lượng $l$ thoả mãn là $\sim X/h_i = b_0^{\beta - (1-\alpha)} = b_0^{\beta + \alpha - 1}$. Để số này là **đa thức** (thực ra là $O(1)$ — duy nhất), cần:

$$
\beta + \alpha - 1 \leq 0 \quad \Longleftrightarrow \quad \beta \leq 1 - \alpha
$$

Kết hợp với bound từ CF approximation ($\beta < 2\alpha - 1$), ta lấy:

$$
\beta < \min(2\alpha - 1,\ 1 - \alpha) = \max(2\alpha - 1,\ 1 - \alpha) \text{ khi } \alpha > 2/3
$$

Thực ra paper dùng $\beta = \min(2\alpha-1, 1-\alpha)$ như bound đảm bảo uniqueness, tức:

$$
\beta < \max(2\alpha - 1,\ 1 - \alpha)
$$

trong đó với $\alpha \leq 2/3$ thì $\max = 1-\alpha$, và với $\alpha > 2/3$ thì $\max = 2\alpha-1$.

> [!warning] Giới hạn của GACD_CF: $\alpha > 2/3$ bị exponential
> Khi $\alpha > 2/3$, số lượng solutions $l$ trở nên exponential trong kích thước input → không enumerate được trong polynomial time. Đây là lý do GACD_CF chỉ xử lý $\alpha$ lên đến một ngưỡng, và GACD_L (§4) phải dùng chiến lược hoàn toàn khác.

> [!abstract] Claim 2.2 — GACD_CF hoạt động với $\beta < \max(2\alpha-1, 1-\alpha)$
> Với $a_0 \sim b_0$, $\alpha > 1/2$, và $|x_0|, |y_0| < X = b_0^\beta$ với $\beta < \max(2\alpha-1, 1-\alpha)$: thuật toán GACD_CF tìm được tất cả $d$ thoả mãn trong thời gian đa thức. $\blacksquare$

---

## Liên Hệ Với Wiener's Attack Trên RSA

> [!info] 🟡 Wiener's Continued Fraction Attack [15]
> Wiener (1990) chứng minh rằng nếu RSA private exponent $d < N^{1/4}$, thì $d$ có thể được tìm từ public key $(N, e)$ trong thời gian đa thức bằng continued fraction expansion của $e/N$.
>
> Intuition: $ed \equiv 1 \pmod{\phi(N)}$ có nghĩa là $e/N \approx k/d$ cho một integer $k$ nhỏ, và tỷ số $k/d$ xuất hiện như convergent của $e/N$.
>
> *(theo [15]: Wiener — Cryptanalysis of Short RSA Secret Exponents, IEEE Trans. Inf. Theory, 1990)*

Kết nối với PACDP: đặt $a_0 = e$ (public exponent), $b_0 = N$ (modulus). Điều kiện Wiener $d < N^{1/4}$ tương đương $\alpha = 1/4 < 1/2$ — nghĩa là **Wiener's attack thực chất là PACD_CF với $\alpha = 1/2$** (vì $k/d$ đóng vai trò convergent, và $\alpha$ của $d$ so với $N$ vào khoảng $1/4$ nhưng convergent cần $\alpha_{\text{eff}} > 1/2$).

> [!tip] 💡 Agent note
> Cách nhìn chính xác hơn: trong Wiener's attack, $b_0 = N$ và divisor cần tìm là $d$ (private exponent), nhưng relation là $ed - k\phi(N) = 1$ chứ không phải $d \mid b_0$. Đây là bài toán **"= 1"** (small inverse problem) thay vì **"= 0"** (PACDP). Paper §5 thảo luận sự tương đương và khác biệt giữa hai bài toán này — xem [[05-applications-results|Lesson 05]].

Dù vậy, bound $\beta < 2\alpha - 1$ trong PACD_CF khi $\alpha = 1/2$ cho $\beta < 0$ — tức không có error nào được phép. Đây là tại sao Wiener's attack đòi hỏi điều kiện **rất chặt** ($d < N^{1/4}$) và là motivation để dùng lattice methods ở các lessons tiếp theo.

---

## Hình Dung Bound: $\beta$ vs $\alpha$ Plane

Hai đường bounds từ §2:

$$
\text{PACD\_CF:} \quad \beta < 2\alpha - 1 \quad (\text{đường thẳng, chỉ positive khi } \alpha > 1/2)
$$

$$
\text{GACD\_CF:} \quad \beta < \max(2\alpha - 1,\ 1 - \alpha) \quad (\text{gãy tại } \alpha = 2/3)
$$

Cả hai đều có $\beta < 0$ khi $\alpha$ nhỏ → CF method **hoàn toàn vô dụng** khi $\alpha < 1/2$. Lesson tiếp theo sẽ show rằng lattice method đạt $\beta < \alpha^2$ — curve parabol nằm trên đường thẳng cho mọi $\alpha \in (0,1)$.

---

## Summary

- **Theorem 21** (convergents): $|g_i/h_i - \rho| < 1/h_i^2$; conversely nếu $|s/t - \rho| < 1/(2t^2)$ thì $s/t$ là convergent.
- **Key observation**: $a'/b' = (a_0+x_0)/d \div (b_0+y_0)/d$ xấp xỉ $a_0/b_0$ với sai số $< b_0^{\beta-1}$.
- **PACD_CF hoạt động** khi $\beta < 2\alpha - 1$ (tức $\alpha > 1/2$).
- **GACD_CF hoạt động** khi $\beta < \max(2\alpha-1, 1-\alpha)$ — phải thêm điều kiện uniqueness $\beta < 1-\alpha$.
- Cả hai CF methods **không hoạt động** khi $\alpha < 1/2$ → cần lattice methods (Lessons 03, 04).
- Liên hệ với Wiener's attack: PACD_CF là generalization của Wiener, với bound tương đương tại $\alpha = 1/2$.

---

## References

- [6] Hardy & Wright — *An Introduction to the Theory of Numbers*, Oxford (🔴 Prerequisite — Theorem 184)
- [15] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE Trans. Inf. Theory 36, 1990 (🟡)
- [3] Boneh & Durfee — *Cryptanalysis of RSA with d < N^{0.292}*, IEEE Trans. Inf. Theory 2000 (⚪ — xem Lesson 05)
