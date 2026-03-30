---
title: "05. Tấn công RSA-CRT với Known Difference"
type: attack
tags: [rsa-crt, qiao-lam, coppersmith, lattice, attack, lesson-05]
aliases: [RSA-CRT Attack, Qiao-Lam Attack, Known Difference Attack]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

> **Prerequisites**: [[04-trivariate-bound|04. Trivariate Bound]], [[03-integer-roots-strategy|03. Integer Roots Strategy]]  
> 🔴 **Prerequisite references**: Wiener [19] — *Cryptanalysis of Short RSA Secret Exponents* (Wiener attack background); RSA-CRT basics  
> **Lesson type**: Attack  
> **Covers**: §4.1 (RSA-CRT với known difference), §4.2 (attack description, polynomial construction, bound derivation), Theorem 1, experiments table
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p, q$ | RSA primes, $N = pq$ |
> | $d_p, d_q$ | CRT exponents: $d_p \equiv d \pmod{p-1}$, $d_q \equiv d \pmod{q-1}$ |
> | $\bar{c}$ | Difference đã biết: $\bar{c} = d_p - d_q$ |
> | $k, l$ | Hidden multipliers: $ed_p = 1 + k(p-1)$, $e(d_p - \bar{c}) = 1 + l(q-1)$ |
> | $\delta$ | $\max\{d_p, d_q\} \approx N^\delta$ (bitsize exponent) |
> | $X, Y, Z$ | Bounds: $X = N^\delta$, $Y = Z = N^{\delta+1/2}$ |
> | $W$ | $W = N^{2+2\delta}$ |
> | $\tau_{\text{opt}}$ | $\tau_{\text{opt}} = \frac{1/2 - 4\delta}{2\delta}$ |

---

## Context & Conditions

### RSA-CRT: Nền tảng

Năm 1990, Wiener [19] chứng minh $d < N^{1/4}$ làm RSA không an toàn. Để tăng tốc decryption mà vẫn dùng $d$ nhỏ, Wiener đề xuất **RSA-CRT**: thay vì tính $m \equiv c^d \pmod{N}$, ta tính:

$$
m_1 \equiv c^{d_p} \pmod{p}, \quad m_2 \equiv c^{d_q} \pmod{q}
$$

rồi kết hợp bằng CRT để thu $m$. Cả $d_p \equiv d \pmod{p-1}$ và $d_q \equiv d \pmod{q-1}$ đều có thể chọn nhỏ để decryption nhanh — khi đó $e$ thường có cùng kích thước $N$.

> [!info] 🟡 Sơ đồ Qiao-Lam [17]
> Năm 1998, Qiao và Lam [17] đề xuất sử dụng RSA-CRT với **hiệu số cố định nhỏ**: $d_p - d_q = 2$. Mục tiêu: chỉ cần lưu một trong hai khóa $d_p, d_q$ và hiệu số $\bar{c}=2$ — tiết kiệm bộ nhớ cho smartcard. Qiao-Lam đề xuất $d_p, d_q$ dài $128$ bit; sau đó lập luận $96$ bit là đủ an toàn trong thực tế.
>
> Tấn công tốt nhất trước paper này là **meet-in-the-middle** với độ phức tạp $\tilde{\mathcal{O}}\!\left(\sqrt{\min\{d_p, d_q\}}\right)$ [17].
>
> *(theo [17]: Qiao, Lam — RSA Signature Algorithm for Microcontroller Implementation, CARDIS 1998/2000)*

> [!warning] Điều kiện tấn công
> Tấn công này áp dụng khi:
> - **$\bar{c} = d_p - d_q$ đã biết với attacker** (không nhất thiết phải nhỏ hay bằng $2$).
> - $\max\{d_p, d_q\} \leq N^{0.099-\epsilon}$ với $\epsilon > 0$ tùy ý.
> - Không cần biết $d_p$, $d_q$ trực tiếp, chỉ cần biết $\bar{c}$.

---

## Xây dựng Polynomial

### Hai phương trình RSA-CRT

Khi $d_p - d_q = \bar{c}$, hai phương trình cơ bản là:

$$
\begin{cases} ed_p = 1 + k(p-1) \\ e(d_p - \bar{c}) = 1 + l(q-1) \end{cases} \quad \iff \quad \begin{cases} ed_p - 1 + k = kp \\ ed_p - \bar{c}e - 1 + l = lq \end{cases}
$$

### Nhân hai phương trình

Nhân $kp$ và $lq$ (chú ý $kp \cdot lq = kl \cdot N$):

$$
(1+\bar{c}e) - (2e+\bar{c}e^2)d_p + e^2 d_p^2 - (\bar{c}e+1)k - l + ed_pk + ed_pl + (1-N)kl = 0
$$

### Polynomial $f(x,y,z)$

Đặt $x = d_p$, $y = k$, $z = l$:

> [!note] Attack Polynomial 5.1 — RSA-CRT Known Difference
> $$
> f(x,y,z) = (1+\bar{c}e) - (2e+\bar{c}e^2)x + e^2x^2 - (\bar{c}e+1)y - z + exy + exz + (1-N)yz
> $$
>
> Polynomial này có nghiệm nguyên nhỏ $(d_p,\, k,\, l)$.
>
> Từ nghiệm $(d_p, k, l)$, factorization của $N$ được recover dễ dàng:
> - Từ $ed_p - 1 + k = kp$: tính $p = (ed_p - 1 + k)/k$.
> - Từ $p$: tính $q = N/p$.

Polynomial này có đúng dạng $f(x,y,z) = a_0 + a_1x + a_2x^2 + a_3y + a_4z + a_5xy + a_6xz + a_7yz$ của §3.

---

## Phân tích Kích thước Nghiệm

Giả sử $\max\{d_p, d_q\} \approx N^\delta$ với $\delta \in (0, 1/2)$:

- $x^{(0)} = d_p$: $|d_p| < N^\delta$ → $X = N^\delta$.
- $y^{(0)} = k$: từ $ed_p = 1+k(p-1)$ và $e \approx N$, $d_p \approx N^\delta$, $p \approx N^{1/2}$ → $k \approx N^\delta \cdot N / N^{1/2} = N^{\delta+1/2}$ → $Y = N^{\delta+1/2}$.
- $z^{(0)} = l$: tương tự → $Z = N^{\delta+1/2}$.
- $W = \lVert f(xX, yY, zZ) \rVert_\infty \approx N \cdot X^2 = N \cdot N^{2\delta} = N^{1+2\delta}$... thực ra từ term $(1-N)yz$ sau scale: $(1-N) \cdot Y \cdot Z \approx N \cdot N^{\delta+1/2} \cdot N^{\delta+1/2} = N^{2+2\delta}$ → $W = N^{2+2\delta}$.

---

## Áp dụng Bound từ §3

Thay $X = N^\delta$, $Y = Z = N^{\delta+1/2}$, $W = N^{2+2\delta}$ vào bound:

$$
X^{7+9\tau+3\tau^2}(YZ)^{5+\frac{9}{2}\tau} < W^{3+3\tau}
$$

$$
N^{(7+9\tau+3\tau^2)\delta} \cdot N^{(5+\frac{9}{2}\tau)(2\delta+1)} < N^{(3+3\tau)(2+2\delta)}
$$

Lấy logarithm theo $\log N$ và rút gọn:

$$
(7+9\tau+3\tau^2)\delta + \left(5+\frac{9}{2}\tau\right)(2\delta+1) - (3+3\tau)(2+2\delta) < 0
$$

Khai triển từng nhóm:

$$
\begin{aligned}
(7+9\tau+3\tau^2)\delta &= 7\delta + 9\tau\delta + 3\tau^2\delta \\
\left(5+\frac{9}{2}\tau\right)(2\delta+1) &= 10\delta + 5 + 9\tau\delta + \frac{9}{2}\tau \\
(3+3\tau)(2+2\delta) &= 6 + 6\delta + 6\tau + 6\tau\delta
\end{aligned}
$$

Tổng hợp:

$$
3\delta\tau^2 + 3\!\left(4\delta - \frac{1}{2}\right)\!\tau + (11\delta - 1) < 0
$$

### Tối ưu hóa $\tau$

Bất phương trình bậc hai $3\delta\tau^2 + 3(4\delta - 1/2)\tau + (11\delta-1) < 0$ có nghiệm khi discriminant dương và:

$$
\tau_{\text{opt}} = -\frac{3(4\delta - 1/2)}{2 \cdot 3\delta} = \frac{\frac{1}{2} - 4\delta}{2\delta}
$$

(hợp lệ khi $\delta < 1/8$ để $\tau_{\text{opt}} > 0$; trong thực tế tối ưu hóa trên $\tau > 0$).

Thay $\tau_{\text{opt}}$ vào, điều kiện rút gọn thành:

> [!abstract] Theorem 1 — RSA-CRT với Known Difference $d_p - d_q$ (§4)
> Dưới Assumption 1, với mọi $\epsilon > 0$, tồn tại $n_0$ sao cho với mọi $n > n_0$: Cho $N = pq$ là $n$-bit RSA modulus, $p, q$ primes kích thước $n/2$ bit. Cho $d_p \equiv d \pmod{p-1}$ và $d_q \equiv d \pmod{q-1}$ với $d_p - d_q = \bar{c}$ đã biết và $\max\{d_p, d_q\} \leq N^\delta$. Thì $N$ có thể bị factored trong thời gian polynomial trong $\log N$ nếu:
>
> $$
> \delta < \frac{1}{4}\!\left(4 - \sqrt{13}\right) - \epsilon \approx 0.099 - \epsilon
> $$

**Hệ quả thực tế.** Với RSA modulus $1024$ bit: $0.099 \times 1024 \approx 101$ bit. Tấn công phá vỡ Qiao-Lam scheme cho $96$-bit exponents trong thời gian polynomial.

---

## Mô tả Tấn công Đầy đủ

> [!note] Attack 5.2 — RSA-CRT Known Difference Attack
> **Type**: Lattice-based polynomial-time attack
> **Điều kiện**: $\bar{c} = d_p - d_q$ đã biết, $\max\{d_p,d_q\} < N^{0.099-\epsilon}$
>
> **$\mathsf{Setup}$**
> - Input: $(N, e, \bar{c})$
> - Tính $f(x,y,z) = (1+\bar{c}e) - (2e+\bar{c}e^2)x + e^2x^2 - (\bar{c}e+1)y - z + exy + exz + (1-N)yz$
> - Đặt $X = N^\delta$, $Y = Z = N^{\delta+1/2}$, $W = N^{2+2\delta}$
> - Tính $\tau_{\text{opt}} = (1/2-4\delta)/(2\delta)$, chọn $m$ và $t = \tau_{\text{opt}} m$
>
> **$\mathsf{LatticeConstruction}$**
> - Xây tập $S$ và $M$ theo Extended Strategy (§2.2) với extra $x$-shifts
> - Tạo shift polynomials $g$ (dùng $f'$) và $g'$ (dùng $R$)
> - Lấy vector hệ số của $g(xX,yY,zZ)$ và $g'(xX,yY,zZ)$ làm basis của $L$
>
> **$\mathsf{LLLReduction}$**
> - Chạy LLL trên $L$ (dùng NTL library [18])
> - Lấy 2 shortest vectors → polynomials $h_1(x,y,z)$, $h_2(x,y,z)$
>
> **$\mathsf{Extraction}$**
> - Tính $g(z) = \mathrm{Res}_y\!\left(\mathrm{Res}_x(h_1, f),\, \mathrm{Res}_x(h_2, f)\right) = 0$
> - Giải $g(z) = 0$ để tìm $z^{(0)} = l$
> - Substitute vào $h_1$, $h_2$ để tìm $y^{(0)} = k$ và $x^{(0)} = d_p$
> - Tính $p = (ed_p - 1 + k)/k$, kiểm tra $p \mid N$
> - Output: factorization $(p, q)$

**Extension với Brute-force.** Nếu $d_p$ lớn hơn threshold nhỏ, ta có thể thêm brute-force search trên $\log_2 N \cdot (N^{\delta - 0.099})$ most significant bits của $d_p$. Với mỗi candidate $\tilde{d}_p$, đặt $d_p = \tilde{d}_p + d_0$ và chạy lại attack trên $d_0$ nhỏ. Đây là cách approach $128$-bit exponents (đề xuất ban đầu của Qiao-Lam) trong thực tế.

---

## Kết quả Thực nghiệm

Paper thực hiện các thực nghiệm trên Pentium $2.4$GHz chạy Linux, dùng NTL library [18] cho LLL.

| $N$ (bits) | $d_p$ (bits) | Tham số | Thời gian LLL |
|------------|-------------|---------|---------------|
| 1000 | 10 | $m=2,\, t=3,\, \dim=54$ | 32 min |
| 2000 | 22 | $m=2,\, t=3,\, \dim=54$ | 175 min |
| 3000 | 42 | $m=2,\, t=3,\, \dim=54$ | 487 min |
| 4000 | 60 | $m=2,\, t=3,\, \dim=54$ | 1015 min |
| 5000 | 85 | $m=2,\, t=3,\, \dim=54$ | 1803 min |
| 500 | 9 | $m=2,\, t=8,\, \dim=99$ | 105 min |
| 1000 | 18 | $m=2,\, t=8,\, \dim=99$ | 495 min |
| 500 | 13 | $m=3,\, t=3,\, \dim=112$ | 397 min |

Trong mọi thực nghiệm: thu được $h_1, h_2$ với nghiệm đúng; Assumption 1 "worked perfectly in practice"; recover thành công $d_p, k, l$ và factor $N$.

> [!warning] Khoảng cách với threshold lý thuyết
> Để đạt $96$-bit threshold lý thuyết cần $m = 61$, $t = 36$, lattice dimension $= 376712$. LLL trên lattice kích thước này **hoàn toàn ngoài tầm** với phần cứng hiện tại. Các thực nghiệm chỉ validate heuristic, không phải attack trực tiếp vào Qiao-Lam 96-bit.
>
> **Hướng optimization thực tế** (từ paper):
> - Kết hợp brute-force search trên MSBs với lattice attack.
> - Dùng $L^2$ method của Nguyen-Stehlé [16] (nhanh hơn LLL).
> - Implement Coppersmith's original method (lattice dimension nhỏ hơn) thay vì Coron's.

---

## Mitigation

> [!abstract] Điều kiện an toàn
> Scheme RSA-CRT an toàn trước tấn công này khi:
> - $\max\{d_p, d_q\} \geq N^{0.099}$ — đề xuất thực tế hiện tại: tối thiểu $160$ bit cho modulus $1024$ bit.
> - **Hoặc**: $d_p - d_q$ được giữ bí mật (không revealed với attacker).
>
> Lưu ý: attack hoạt động kể cả khi $\bar{c}$ không nhỏ, miễn là $\bar{c}$ đã biết.

---

## Summary

- **Bài toán**: từ $(N, e, \bar{c}=d_p-d_q)$, recover $d_p$ (và factor $N$) nếu $\max\{d_p,d_q\} < N^{0.099-\epsilon}$.
- **Polynomial**: $f(x,y,z)$ bậc hai trong $x$, tuyến tính trong $y, z$ — đúng dạng §3.
- **Bounds**: $X=N^\delta$, $Y=Z=N^{\delta+1/2}$, $W=N^{2+2\delta}$.
- **Threshold**: $\delta < (4-\sqrt{13})/4 \approx 0.099$ — phá vỡ Qiao-Lam 96-bit trong thời gian polynomial.
- **Thực nghiệm**: validate heuristic, nhưng gap lớn giữa thực nghiệm ($m=2$) và threshold lý thuyết ($m=61$).

**Tiếp theo**: [[06-attack-common-prime-rsa|06. Attack Common Prime RSA]] áp dụng cùng polynomial và bound cho biến thể RSA khác.

---

## References

- [1] Boneh, Durfee — *Cryptanalysis of RSA with Private Key d Less Than N^{0.292}*, IEEE TIT 2000 (🟡)
- [17] Qiao, Lam — *RSA Signature Algorithm for Microcontroller Implementation*, CARDIS 2000 (🟡)
- [18] Shoup — *NTL: A Library for doing Number Theory*, http://www.shoup.net/ntl/ (⚪)
- [19] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE TIT 1990 (🔴)
