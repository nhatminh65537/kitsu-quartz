---
title: "06. Tấn công Common Prime RSA"
type: attack
tags: [common-prime-rsa, coppersmith, lattice, hinek, attack, lesson-06]
aliases: [Common Prime RSA Attack, Common Prime Attack]
source: "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants — Jochemsz & May, ASIACRYPT 2006"
created: 2026-03-25
---

> **Prerequisites**: [[04-trivariate-bound|04. Trivariate Bound]], [[05-attack-rsa-crt|05. Attack RSA-CRT]]  
> 🔴 **Prerequisite references**: Wiener [19] — *Cryptanalysis of Short RSA Secret Exponents*; RSA-CRT basics  
> **Lesson type**: Attack  
> **Covers**: §5.1 (Common Prime RSA scheme), §5.2 (attack description, polynomial, bound derivation), Theorem 2, Figure 1, experiments table
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $g$ | Large prime factor chung: $g \mid (p-1)$ và $g \mid (q-1)$ |
> | $a, b$ | Coprime integers: $p = 2ga+1$, $q = 2gb+1$ |
> | $\gamma$ | $g = N^\gamma$, với $0 < \gamma < 1/2$ |
> | $\delta$ | $d = N^\delta$, với $0 < \delta < 1-\gamma$ |
> | $k$ | Hidden multiplier: $ed = 1 + k \cdot 2gab$ |
> | $X, Y, Z$ | Bounds: $X = N^\delta$, $Y = Z = N^{\delta+1/2-\gamma}$ |
> | $W$ | $W = N^{2+2\delta-2\gamma}$ |
> | $\tau_{\text{opt}}$ | $\tau_{\text{opt}} = \frac{1/2+\gamma-4\delta}{2\delta}$ |

---

## Context & Conditions

### Common Prime RSA: Sơ đồ

Năm 1990, Wiener [19] cho thấy $d < N^{1/4}$ làm RSA mất an toàn. Wiener cũng chỉ ra rằng Wiener attack **hoạt động kém hơn** khi $\gcd(p-1, q-1)$ có **nhân tố nguyên tố lớn**. Dựa trên quan sát này, Lim và Lee [12] đề xuất một biến thể RSA năm 1995, được McKee và Pinch [15] tấn công năm 1998.

> [!info] 🟡 Common Prime RSA — Hinek [9]
> Gần đây hơn, Hinek [9] hệ thống hóa lại biến thể này dưới tên **Common Prime RSA**: chọn $p = 2ga+1$ và $q = 2gb+1$, trong đó $g$ là nguyên tố lớn, $a$ và $b$ là các số nguyên **coprime**. Khi đó:
>
> $$
> \text{lcm}(p-1, q-1) = 2gab
> $$
>
> Mục tiêu: chọn $d < N^{1/4}$ sao cho $ed \equiv 1 \pmod{2gab}$, tức $ed = 1 + k \cdot 2gab$. Việc này tránh Wiener attack vì $d$ không thỏa điều kiện continued fraction của Wiener.
>
> Hinek [9] khảo sát toàn bộ không gian tham số và kết luận vẫn còn nhiều lựa chọn an toàn với $d = N^\delta$, $\delta < 1/4$. Bound tốt nhất trước paper này (tấn công lattice thứ hai của Hinek): $\delta < \frac{2}{5}\gamma$.
>
> *(theo [9]: Hinek — Another Look at Small RSA Exponents, CT-RSA 2006)*

> [!warning] Điều kiện tấn công
> Tấn công này áp dụng khi:
> - $N = pq$ với $p = 2ga+1$, $q = 2gb+1$, $g$ là nguyên tố, $\gcd(a,b) = 1$.
> - $g = N^\gamma$ đã biết (hoặc có thể estimate).
> - $d = N^\delta$ với $\delta < \frac{1}{4}(4+4\gamma-\sqrt{13+20\gamma+4\gamma^2}) - \epsilon$.

---

## Hai Cách Nhìn từ Hinek

Hinek's second lattice attack bắt đầu từ hai phương trình:

$$
ed = 1 + k(p-1)b, \qquad ed = 1 + k(q-1)a
$$

Nhân và khai triển:

$$
e^2d^2 + ed(ka + kb - 2) - (N-1)k^2ab - (ka+kb-1) = 0
$$

Hinek dùng polynomial $f(x,y,z,u) = e^2x + ey - (N-1)z - u$ với nghiệm $(d^2,\, d(k(a+b-2)),\, k^2ab,\, (ka+kb-1))$ — một đa thức **bốn biến**. Kết quả: $\delta < \frac{2}{5}\gamma$.

---

## Cách Nhìn Mới của Jochemsz-May

Paper quan sát lại phương trình bậc hai cùng cấu trúc, nhưng chọn **cách phân tách biến khác**:

$$
e^2d^2 + ed(ka + kb - 2) - (N-1)k^2ab - (ka+kb-1) = 0
$$

Đặt $y = ka$ và $z = kb$, nhóm lại:

$$
f(x, y, z) = e^2x^2 + ex(y+z-2) - (y+z-1) - (N-1)yz
$$

với nghiệm nguyên nhỏ $(d,\, ka,\, kb)$.

> [!note] Attack Polynomial 6.1 — Common Prime RSA
> $$
> f(x, y, z) = e^2x^2 + ex(y+z-2) - (y+z-1) - (N-1)yz
> $$
>
> **Nghiệm**: $(x^{(0)}, y^{(0)}, z^{(0)}) = (d, ka, kb)$
>
> Từ nghiệm $(d, ka, kb)$, factorization của $N$:
> - $ed = 1 + k(p-1)b = 1 + (ka) \cdot gb \cdot 2 / (2a) \cdot \ldots$ thực ra trực tiếp hơn:
> - Từ $ed = 1 + k \cdot 2gab$ và biết $ka$, $kb$: tính $k = \gcd(ka, kb)$ (vì $\gcd(a,b)=1$), suy ra $a = (ka)/k$, $b = (kb)/k$.
> - Từ $ed = 1 + k \cdot 2gab$: tính $p = 2ga+1$ (biết $g$ và $a$) → factor $N$.

**Tại sao đây là cải tiến?** Polynomial $f(x,y,z)$ là **ba biến** thay vì bốn biến của Hinek — lattice nhỏ hơn, bound tốt hơn. Hơn nữa, cấu trúc đúng dạng §3 nên bound từ Lesson 04 áp dụng trực tiếp.

---

## Phân tích Kích thước Nghiệm

Với $g = N^\gamma$, $d = N^\delta$, $e \approx N^{1-\gamma}$ (vì $e < 2gab \approx 2g \cdot N^{1/2-\gamma} \cdot N^{1/2-\gamma} = 2N^{1-\gamma}$):

- $x^{(0)} = d$: $|d| < N^\delta$ → $X = N^\delta$.
- $y^{(0)} = ka$: từ $ed = 1+k \cdot 2gab$ và $e \approx N^{1-\gamma}$, $d \approx N^\delta$, $2gab \approx N^{1-\gamma}$ → $k \approx N^\delta$; $a \approx N^{1/2-\gamma}$ → $ka \approx N^{\delta+1/2-\gamma}$ → $Y = N^{\delta+1/2-\gamma}$.
- $z^{(0)} = kb$: tương tự → $Z = N^{\delta+1/2-\gamma}$.
- $W$: hệ số lớn nhất sau scale đến từ term $(N-1)yz$: $(N-1) \cdot Y \cdot Z \approx N \cdot N^{\delta+1/2-\gamma} \cdot N^{\delta+1/2-\gamma} = N^{2+2\delta-2\gamma}$ → $W = N^{2+2\delta-2\gamma}$.

---

## Áp dụng Bound từ §3

Thay $X = N^\delta$, $Y = Z = N^{\delta+1/2-\gamma}$, $W = N^{2+2\delta-2\gamma}$ vào:

$$
X^{7+9\tau+3\tau^2}(YZ)^{5+\frac{9}{2}\tau} < W^{3+3\tau}
$$

Lấy $\log_N$:

$$
(7+9\tau+3\tau^2)\delta + \left(5+\frac{9}{2}\tau\right)(2\delta+1-2\gamma) < (3+3\tau)(2+2\delta-2\gamma)
$$

Khai triển và rút gọn:

$$
3\delta\tau^2 + 3\!\left(4\delta - \frac{1}{2} - \gamma\right)\!\tau + (11\delta - 1 - 4\gamma) < 0
$$

### Tối ưu hóa $\tau$

$$
\tau_{\text{opt}} = \frac{\frac{1}{2}+\gamma-4\delta}{2\delta}
$$

Thay vào và giải $\delta$:

> [!abstract] Theorem 2 — Common Prime RSA (§5)
> Dưới Assumption 1, với mọi $\epsilon > 0$, tồn tại $n_0$ sao cho với mọi $n > n_0$: Cho $N = pq$ là $n$-bit RSA modulus, $p, q$ primes kích thước $n/2$ bit, $p-1 = 2ga$, $q-1 = 2gb$, với $g$ nguyên tố kích thước $\gamma n$ bit và $\gcd(a,b)=1$. Cho $ed \equiv 1 \pmod{2gab}$ với $\text{bitsize}(e) = (1-\gamma)n$, $\text{bitsize}(d) = \delta n$, $0 < \delta < (1-\gamma)n$. Thì $d$ có thể tìm được trong thời gian polynomial trong $\log N$ nếu:
>
> $$
> \delta < \frac{1}{4}\!\left(4 + 4\gamma - \sqrt{13 + 20\gamma + 4\gamma^2}\right) - \epsilon
> $$

**Kiểm tra tại $\gamma = 0$**: bound thành $\delta < (4-\sqrt{13})/4 \approx 0.099$ — đúng như Theorem 1 của §4 (trường hợp suy biến khi không có common prime).

---

## So sánh Attack Regions

Paper trình bày **Figure 1** so sánh vùng tấn công mới với các tấn công đã biết:

```mermaid
graph LR
    A["gamma nho<br>delta co the lon hon<br>Vung tan cong rong hon"]
    B["gamma lon<br>delta tang tuong ung<br>Vung an toan thu hep"]
    A --> B
```

> [!abstract] So sánh bound (từ Figure 1 của paper)
> | $\gamma$ | Bound mới $\delta <$ | Hinek bound $\delta <$ | Known attacks $\delta <$ |
> |----------|---------------------|----------------------|------------------------|
> | 0.10 | 0.130 | 0.07 | 0.20 (*) |
> | 0.20 | 0.164 | 0.10 | 0.15 |
> | 0.30 | 0.200 | 0.13 (*) | 0.12 |
> | 0.40 | 0.237 | 0.17 (*) | 0.16 |
> | 0.50 | 0.275 | 0.20 | 0.25 |
>
> (*) Một số giá trị đã vượt ngoài asymptotical range của các tấn công lattice được mô tả trong [9].

**Ý nghĩa**: Bound mới **luôn mạnh hơn** Hinek's second attack (cột 2 so với cột 3) với mọi $\gamma$. Không gian tham số $\{d, g\}$ an toàn **giảm đáng kể** so với kết luận của Hinek [9].

---

## Mô tả Tấn công Đầy đủ

> [!note] Attack 6.2 — Common Prime RSA Attack
> **Type**: Lattice-based polynomial-time attack
> **Điều kiện**: $g$ (hoặc $\gamma$) đã biết, $\delta < \frac{1}{4}(4+4\gamma-\sqrt{13+20\gamma+4\gamma^2})-\epsilon$
>
> **$\mathsf{Setup}$**
> - Input: $(N, e, g)$
> - Tính $f(x,y,z) = e^2x^2 + ex(y+z-2) - (y+z-1) - (N-1)yz$
> - Đặt $X = N^\delta$, $Y = Z = N^{\delta+1/2-\gamma}$, $W = N^{2+2\delta-2\gamma}$
> - Tính $\tau_{\text{opt}} = (1/2+\gamma-4\delta)/(2\delta)$, chọn $m$ và $t = \tau_{\text{opt}} m$
>
> **$\mathsf{LatticeConstruction}$**
> - Xây $S$, $M$ theo Extended Strategy (§2.2) với extra $x$-shifts
> - Tạo shift polynomials $g_{\text{shift}}$ và $g'$ (ký hiệu khác $g$ prime để tránh nhầm với nguyên tố $g$)
> - Lấy vector hệ số sau scale làm basis của $L$
>
> **$\mathsf{LLLReduction}$**
> - Chạy LLL trên $L$ → 2 shortest vectors → $h_1(x,y,z)$, $h_2(x,y,z)$
>
> **$\mathsf{Extraction}$**
> - Tính $\mathrm{Res}_y(\mathrm{Res}_x(h_1, f),\, \mathrm{Res}_x(h_2, f)) = 0$ để tìm $z^{(0)} = kb$
> - Substitute để tìm $y^{(0)} = ka$, $x^{(0)} = d$
> - Tính $k = \gcd(ka, kb)$, $a = (ka)/k$, $b=(kb)/k$
> - Tính $p = 2ga+1$, kiểm tra $p \mid N$
> - Output: factorization $(p, q)$

---

## Kết quả Thực nghiệm

Thực nghiệm với $m=2$, $t=0$ (không có extra $x$-shifts), $\log_2(N) = 1024$:

| $\gamma$ | Bound mới ($\delta < $, asymptotic) | Đạt được ($m=2,t=0$) | Hinek bound ($\delta <$) |
|----------|-------------------------------------|----------------------|--------------------------|
| 0.10 | 0.130 | 0.07 | 0.20 |
| 0.20 | 0.164 | 0.10 | 0.15 |
| 0.30 | 0.200 | 0.13 | 0.12 |
| 0.40 | 0.237 | 0.17 | 0.16 |
| 0.50 | 0.275 | 0.20 | 0.25 |

Kết quả thực nghiệm ($m=2, t=0$) đã **vượt ngoài asymptotic range** của hai tấn công lattice được mô tả trong [9] (cột 4). Assumption 1 "worked perfectly in most cases."

> [!warning] Edge case: Algebraic Dependence
> Trong một số trường hợp hiếm với cả $\delta$ và $\gamma$ rất nhỏ (ví dụ $\gamma = 0.1$, $\delta = 0.05$), một số $h_i$ bị algebraically dependent. Paper báo cáo hai cách xử lý:
> - Dùng kết hợp $h_1$ với các $h_i$ "lớn hơn" ($i > 2$) thay vì chỉ $h_1$ và $h_2$.
> - Phân tích nguyên nhân zero resultant: $\mathrm{Res}_x(h_1, f)$ và $\mathrm{Res}_x(h_2, f)$ có common polynomial factor — hệ số của factor này tiết lộ trực tiếp secret.

---

## Mitigation

> [!abstract] Điều kiện an toàn cho Common Prime RSA
> Sau paper này, các lựa chọn tham số an toàn thu hẹp đáng kể. Để đảm bảo an toàn trước tấn công Jochemsz-May:
> - Chọn $\delta \geq \frac{1}{4}(4+4\gamma-\sqrt{13+20\gamma+4\gamma^2})$.
> - Hoặc dùng standard RSA (không Common Prime) với $d$ đủ lớn.
> - Với modulus $1024$ bit và $\gamma = 0.3$: cần $\delta \geq 0.200$, tức $d \geq N^{0.200} \approx 2^{205}$.

---

## Summary

- **Common Prime RSA**: $p = 2ga+1$, $q = 2gb+1$, $g$ nguyên tố lớn, $\gcd(a,b)=1$; $ed=1+k \cdot 2gab$.
- **Polynomial mới**: $f(x,y,z) = e^2x^2 + ex(y+z-2) - (y+z-1) - (N-1)yz$ với nghiệm $(d, ka, kb)$ — **ba biến** thay vì bốn biến của Hinek.
- **Bounds**: $X=N^\delta$, $Y=Z=N^{\delta+1/2-\gamma}$, $W=N^{2+2\delta-2\gamma}$.
- **Theorem 2**: $\delta < \frac{1}{4}(4+4\gamma-\sqrt{13+20\gamma+4\gamma^2})-\epsilon$ — luôn tốt hơn Hinek.
- **Thực nghiệm**: $m=2, t=0$ đã vượt bound của [9] với mọi $\gamma$ được test.

**Tiếp theo**: [[07-known-results-unification|07. Known Results & Unification]] cho thấy chiến lược Jochemsz-May thống nhất toàn bộ literature.

---

## References

- [9] Hinek — *Another Look at Small RSA Exponents*, CT-RSA 2006 (🟡)
- [12] Lim, Lee — *Security and performance of server-aided RSA computation protocols*, CRYPTO 1995 (⚪)
- [15] McKee, Pinch — *Further attacks on server-aided RSA cryptosystems*, 1998 (⚪)
- [19] Wiener — *Cryptanalysis of Short RSA Secret Exponents*, IEEE TIT 1990 (🔴)
