---
title: "05. Security Analysis — Statistical Attacks"
type: attack
tags: [mimc, differential-cryptanalysis, linear-cryptanalysis, algebraic-degree, apn, lesson-05]
aliases: [MiMC Statistical Attacks, MiMC Differential, MiMC Linear]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[04-mimc-algebraic-attacks|04. Algebraic Attacks]], differential cryptanalysis cơ bản, linear cryptanalysis cơ bản, khái niệm APN function  
> 🔴 **Prerequisite references**: Menezes et al. — *HAC* [MVO96]; Nyberg — *Differentially uniform mappings* [Nyb94] (APN definitions)  
> **Lesson type**: Attack  
> **Covers**: §4.2 — Differential attacks, Linear attacks, Algebraic degree and higher-order differentials, Hash-specific security considerations
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\delta \in \mathbb{F}_{2^n}^*$ | Input difference | $\delta$ |
> | $\delta' \in \mathbb{F}_{2^n}$ | Output difference | $\delta'$ |
> | $\Pr(\delta \to \delta')$ | Differential probability của round function | $\Pr(\delta \to \delta')$ |
> | $D$ | Tập $x$ thỏa $(x+\delta)^3 + x^3 = \delta'$ | $D$ |
> | $\hat{c}(a, b)$ | Linear approximation correlation của $F$ | — |
> | $\deg_{\mathbb{F}}(E_k)$ | Algebraic degree của $E_k$ trên trường | — |
> | $\deg_{\mathbb{F}_2}(E_k)$ | Algebraic degree của $E_k$ khi nhìn như vectorial Boolean function | — |

---

## Context

Lesson 04 đã phân tích các **tấn công đại số** (interpolation, GCD) và xác định rằng chúng quyết định số rounds của MiMC. Lesson này phân tích các **tấn công thống kê** (differential và linear) — các kỹ thuật mạnh nhất trong symmetric cryptanalysis truyền thống.

Kết luận tổng quát sẽ là: $x^3$ có những tính chất đặc biệt mạnh chống differential và linear attacks, đến mức **2 rounds là đủ** để differential trail probability trở nên negligible. Do đó số rounds của MiMC (~82 rounds) tạo ra **biên an toàn rất lớn** đối với các tấn công này.

---

## Tấn công 1: Differential Cryptanalysis

### Differential probability của round function

**Input difference** $\delta \neq 0$, **output difference** $\delta'$. Differential probability của round function $F(x) = x^3$:

$$
\Pr(\delta \to \delta') = \frac{|\{x \in \mathbb{F}_{2^n} : F(x \oplus \delta) \oplus F(x) = \delta'\}|}{2^n}
$$

Mở rộng tử số — cần đếm nghiệm của:

$$
(x + \delta)^3 + x^3 = \delta'
$$

trong $\mathbb{F}_{2^n}$ (dùng $+$ thay cho $\oplus$ vì trong $\mathbb{F}_{2^n}$ chúng tương đương). Khai triển:

$$
x^3 + \delta x^2 + \delta^2 x + \delta^3 + x^3 = \delta'
$$

$$
\delta x^2 + \delta^2 x + (\delta^3 - \delta') = 0
$$

Chia hai vế cho $\delta \neq 0$:

$$
x^2 + \delta x + \frac{\delta^3 - \delta'}{\delta} = 0
$$

Đây là **phương trình bậc hai** trong $x$ — có **tối đa 2 nghiệm** với mọi $\delta, \delta'$.

> [!abstract] Claim 5.1 — Differential uniformity của $x^3$
> Hàm $F(x) = x^3$ trên $\mathbb{F}_{2^n}$ (n lẻ) là **2-uniform** (APN — Almost Perfect Nonlinear):
>
> $$
> \Pr(\delta \to \delta') \leq \frac{2}{2^n} = 2^{1-n}
> $$
>
> với mọi $\delta \neq 0$ và mọi $\delta'$.

**Hệ quả cho multi-round differential**:

Một differential trail qua $t$ rounds có probability tối đa $(2^{1-n})^t = 2^{t(1-n)}$. Với $t = 2$ rounds và $n \geq 64$:

$$
\Pr \leq 2^{2(1-n)} = 2^{2-2n} \leq 2^{-126}
$$

Với $n = 129$: $\Pr \leq 2^{-256}$ sau chỉ 2 rounds. **Bất kỳ differential trail nào qua 2 rounds đã có probability quá nhỏ để exploit.**

> [!warning] Tại sao điều này thực sự mạnh
> APN (2-uniform) là **tốt nhất có thể** cho S-box độ rộng $n$ trong $\mathbb{F}_{2^n}$ — không tồn tại function nào có differential probability thấp hơn. AES S-box chỉ 4-uniform trên $\mathbb{F}_{2^8}$. MiMC dùng $x^3$ trên trường lớn ($n = 129$) — mỗi round là một "APN S-box" kích thước 129-bit, mạnh hơn AES S-box nhiều bậc.

### Phân tích APN chi tiết

Tính APN của $x^{2^t + 1}$ (mà $x^3 = x^{2^1 + 1}$ là trường hợp $t=1$) trong $\mathbb{F}_{2^n}$ được phân tích trong [Nyb94] và [Can97]. Với $n$ lẻ và $\gcd(t, n) = 1$, monomial $x^{2^t+1}$ là APN — đây là một họ APN function nổi tiếng.

---

## Tấn công 2: Linear Cryptanalysis

### Linear approximation

Linear cryptanalysis tìm các linear relation giữa bits của plaintext và ciphertext (hay key) với probability lớn hơn $1/2$. Measure: **correlation** (hay linear bias) $\hat{c}(a, b)$ của approximation $a \cdot x = b \cdot F(x)$.

**Kết nối với APN**: Hàm APN (2-uniform) có mối liên hệ chặt với linear approximation qua Walsh–Hadamard transform. Cụ thể, **maximum square correlation** (squared bias) của $F(x) = x^3$ bị giới hạn:

$$
\max_{a, b \neq 0} |\hat{c}(a,b)|^2 \leq 2^{-(n-1)}
$$

> [!abstract] Claim 5.2 — Linear approximation bound của $x^3$
> Hàm $F(x) = x^3$ trong $\mathbb{F}_{2^n}$ (n lẻ) là **almost bent** (AB function): maximum squared correlation $\leq 2^{-(n-1)}$.
>
> Correlation sau $t$ rounds của một linear trail: $\leq (2^{-(n-1)/2})^t$.  
> Với $t = 2$: correlation $\leq 2^{-(n-1)}$ — negligible với $n \geq 64$.

**Tại sao almost bent là tốt nhất**: AB functions (chỉ tồn tại với $n$ lẻ) đạt minimum possible maximum correlation — mọi linear approximation đều gần nhất có thể với random. Đây là lý do paper chọn $n$ lẻ (cả hai điều kiện APN và AB được thỏa mãn với $n$ lẻ).

**Kết luận**: Linear attacks không đặt ra mối đe dọa thực sự cho MiMC. Sau 2–3 rounds, mọi linear trail đã có correlation negligible.

---

## Tấn công 3: Higher-Order Differentials và Algebraic Degree

### Degree trên trường

Sau $r$ rounds, polynomial $E_k(x)$ có degree $3^r$ trong $\mathbb{F}_{2^n}$ — đã phân tích trong Lesson 04. Với $r = \lceil n/\log_2 3 \rceil$, degree xấp xỉ $2^n - 1$ — **maximal hoặc near-maximal**.

Higher-order differential attack hoạt động khi polynomial $E_k(x)$ có degree thấp: nếu degree $\leq d$, thì $(d+1)$-th order differential của $E_k$ luôn bằng 0, cho phép distinguish cipher từ random. Với degree gần $2^n$, attack này không khả thi.

### Degree như vectorial Boolean function

Khi nhìn $E_k : \mathbb{F}_{2^n} \to \mathbb{F}_{2^n}$ như **vectorial Boolean function** $\{0,1\}^n \to \{0,1\}^n$, degree có thể khác. Squaring $x \mapsto x^2$ là phép **tuyến tính** trong $\mathbb{F}_{2^n}$ (Frobenius), nên cũng tuyến tính như vectorial Boolean function.

**Điều này có nghĩa gì cho $x^3 = x^2 \cdot x$?**

- $x^2$ là tuyến tính → degree 1 như Boolean map
- Nhân $x^2$ với $x$ thêm một multiplication → tăng degree thêm 1

> [!abstract] Claim 5.3 — Algebraic degree của round function (Boolean view)
> Round function $F_i(x) = (x \oplus k \oplus c_i)^3$ có algebraic degree **2** trong mỗi component khi nhìn như vectorial Boolean function trên $\mathbb{F}_2^n$.

Tức mỗi output bit là polynomial bậc 2 trong input bits. Sau $r$ rounds với round constants ngẫu nhiên, degree **tăng nhanh** và đạt tối đa $n$ (số bits). Với số rounds của MiMC (~82 rounds cho $n = 129$), degree đã đạt tối đa từ rất sớm — higher-order differential attacks không hoạt động.

---

## Hash-Specific Security: Inside-Out Approach

### Threat model đặc biệt cho hash

Khi dùng MiMCHash trong sponge mode, permutation $\mathsf{MiMCP}$ được gọi với **input do adversary kiểm soát một phần** (phần rate). Điều này khác với block cipher mode nơi input là fully adversary-controlled.

Mối lo ngại: liệu adversary có thể dùng **"inside-out" approach** — combine encryption và decryption direction của $\mathsf{MiMCP}$ để tìm collision hay preimage nhanh hơn?

### Phân tích

Adversary muốn tìm state trung gian ở giữa circuit, từ đó "gặp nhau" từ hai hướng. Đây là biến thể meet-in-the-middle cho hash.

> [!abstract] Claim 5.4 — Hash security với inside-out approach
> Với MiMCHash-$\ell$ instantiated bởi $\mathsf{MiMCP}$ với $n$ bits:
>
> - Security level $s$ đã được chọn sao cho $2^s < n$ (cả MiMCHash-256 với $s=256/2=128$ và MiMCHash-256b với $s=128$)
> - Ngay cả nếu inside-out approach có thể **double** số rounds hiệu quả trong một attack, số rounds hiện tại vẫn đủ để chống lại vì $2s < n$ → vẫn còn security margin

**Lý luận cụ thể**: Cho MiMCHash-256, $n = 1025$ và $s = 128$. Inside-out approach tệ nhất có thể giảm effective rounds xuống còn $r/2 \approx 323$. Để attack thành công, adversary cần $2^{2s} = 2^{256}$ work — vẫn intractable.

> [!tip] 💡 Agent note
> Đây là lý do paper chọn tham số $n = 4t+1$ (thay vì $n = 2t+1$ tối thiểu). Margin $n \gg 2s$ đảm bảo inside-out approach không break security kể cả khi nó giảm effective rounds đáng kể.

---

## Tổng hợp: Security Argument của MiMC

Bảng sau tổng kết toàn bộ security analysis (kết hợp Lesson 04 và Lesson 05):

| Attack type | Áp dụng cho | Threat level | Mitigated bởi |
|------------|-------------|--------------|--------------|
| Interpolation | MiMC-n/n (CPA) | **Quyết định round count** | $r = \lceil n/\log_2 3 \rceil$ |
| GCD | MiMC-n/n (KPA) | **Cùng bound** với interpolation | $r = \lceil n/\log_2 3 \rceil$ |
| MitM GCD | MiMC-2n/n | **Quyết định round count Feistel** | $r' = 2\lceil n/\log_2 3 \rceil$ |
| Invariant subfield | Cả hai | Thấp | Chọn $n$ nguyên tố |
| Differential | Cả hai | **Negligible sau 2 rounds** | APN property của $x^3$ |
| Linear | Cả hai | **Negligible sau 2–3 rounds** | Almost bent của $x^3$ |
| Higher-order differential | Cả hai | Negligible (degree maximal) | $r \gg$ cần thiết |
| Inside-out (hash) | MiMCHash | Thấp | $2s < n$, margin đủ lớn |

**Kết luận chính**: Round count của MiMC (~82 rounds với $n = 129$) được xác định bởi algebraic attacks. Đối với differential và linear attacks, **ngay cả 2–3 rounds đã là đủ** — 82 rounds cho biên an toàn $\sim 2^{80}$ lần dư thừa cho nhóm tấn công này.

---

## Summary

- **Differential**: $F(x) = x^3$ là APN (2-uniform) → $\Pr(\delta \to \delta') \leq 2^{1-n}$ → sau 2 rounds probability $\leq 2^{-256}$ (với $n = 129$). Không đặt ra threat.
- **Linear**: $x^3$ là almost bent (AB) → maximum squared correlation $\leq 2^{-(n-1)}$ → sau 2 rounds negligible. Không đặt ra threat.
- **Higher-order differential**: degree $3^r \approx 2^n$ (near-maximal trong trường); degree 2 per round (Boolean view) nhưng tăng nhanh. Không đặt ra threat.
- **Hash-specific (inside-out)**: security parameter $s$ được chọn sao cho $2s < n$ → inside-out approach vẫn không break security.
- Security bottleneck của MiMC là **algebraic attacks** (Lesson 04), không phải statistical attacks.

---

## References

- [Nyb94] Nyberg — *Differentially uniform mappings for cryptography*, EUROCRYPT 1993 (⚪ — APN analysis của $x^3$)
- [Can97] Canteaut — *Differential cryptanalysis of Feistel ciphers and differentially δ-uniform mappings*, SAC 1997 (⚪ — supporting reference)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite)
