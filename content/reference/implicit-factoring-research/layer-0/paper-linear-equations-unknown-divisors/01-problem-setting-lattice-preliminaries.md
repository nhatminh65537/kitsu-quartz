---
title: "01. Problem Setting & Lattice Preliminaries"
type: foundation
tags: [linear-equations-unknown-divisors, lattice, foundation, lesson-01]
aliases: [Problem Setting, Lattice Preliminaries]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: LLL algorithm [10] (Lenstra–Lenstra–Lovász, 1982), RSA cơ bản, modular arithmetic, Coppersmith method [3]  
> 🔴 **Prerequisite references**: Coppersmith [3] — *Small solutions to polynomial equations* (foundational method); LLL [10] — *Factoring polynomials with rational coefficients*  
> **Lesson type**: Foundation  
> **Covers**: §1 (Introduction), §1.1 (Contributions overview), §2 (Preliminary — Lemma 1, Lemma 2)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $N$ | Composite modulus đã biết (unknown factorization) | $N$ |
> | $p$ | Ước số nguyên tố ẩn của $N$ | $p$ |
> | $\beta$ | Lower bound: $p \geq N^\beta$, $0 < \beta \leq 1$ | $\beta$ |
> | $u$ | $p^u \mid N$ — multiplicity đã biết | $u$ |
> | $v$ | Modulus ẩn cần giải: $f \equiv 0 \pmod{p^v}$ | $v$ |
> | $\gamma$ | Log-bound nghiệm: $\lvert y \rvert \leq N^\gamma$ | $\gamma$ |
> | $L$ | Lattice được construct | $L$ |
> | $w$ | Dimension của lattice | $w$ |
> | $\det(L)$ | Determinant của $L$ | $\det(L)$ |

---

## Motivation: Tại sao cần giải phương trình tuyến tính mod ước số ẩn?

Nhiều bài toán tấn công RSA có thể quy về dạng: *tìm số nguyên nhỏ $y$ thỏa mãn*

$$
f(y) \equiv 0 \pmod{p}
$$

trong đó $p$ là **ước số nguyên tố ẩn** của một modulus $N$ đã biết. Nếu tìm được $y$, ta thường có thể recover $p$ và factorize $N$, phá vỡ hoàn toàn hệ mã.

Câu hỏi trung tâm: **khi nào có thuật toán polynomial-time để tìm nghiệm nhỏ như vậy?**

### Lịch sử bài toán

**Howgrave-Graham 2001** [8] là người đầu tiên đặt vấn đề này một cách hệ thống qua bài toán **Approximate Common Divisor Problem (ACDP)**: cho hai số gần bội của một số ẩn $p$, tìm $p$. Ông quy ACDP về giải phương trình univariate linear:

$$
f(x) = x + a \equiv 0 \pmod{p}
$$

và đưa ra thuật toán polynomial-time tìm nghiệm $|y| \leq N^\gamma$ khi $\gamma < \beta^2$ (với $p \geq N^\beta$).

**May 2003** [11] mở rộng lên polynomial bậc $\delta$ tùy ý. **Herrmann–May 2008** [6] tiếp tục mở rộng lên $n$ biến:

$$
f(x_1, \ldots, x_n) = a_0 + a_1 x_1 + \cdots + a_n x_n \equiv 0 \pmod{p}
$$

đạt bound $\sum_i \gamma_i < 3\beta - 2 + 2(1-\beta)^{3/2}$.

**Lu–Zhang–Lin (paper này)** xét hai tổng quát hóa quan trọng mà các công trình trên bỏ qua:

1. **First Variant**: $f_1(x_1,\ldots,x_n) = a_0 + a_1x_1 + \cdots + a_nx_n \equiv 0 \pmod{p^v}$ — modulus ẩn là $p^v$ thay vì $p$, và $p^u \mid N$ với $u \geq 1$ tùy ý.
2. **Second Variant**: $f_2(x_1,\ldots,x_n) = a_1x_1 + \cdots + a_nx_n \equiv 0 \pmod{p^v}$ — dạng **thuần nhất** (không có hệ số tự do $a_0$).

> [!info] 🟡 Herrmann–May '08 [6] — Kết quả gốc được tổng quát hóa
> Herrmann–May giải $f(x_1,\ldots,x_n) = a_0 + \sum a_i x_i \equiv 0 \pmod{p}$ với $p \mid N$, thu được bound:
>
> $$
> \sum_{i=1}^n \gamma_i < 3\beta - 2 + 2(1-\beta)^{3/2}
> $$
>
> Paper này cải thiện bound này theo hai hướng: (1) tổng quát hóa lên $p^v$ và $p^u \mid N$, và (2) khai thác cấu trúc thuần nhất khi $a_0 = 0$.
>
> *(theo [6]: Herrmann & May — Solving linear equations modulo divisors, Asiacrypt 2008)*

### Tại sao Multi-Power RSA cần $p^v$ và $p^u$?

> [!info] 🟡 Takagi '98 [19] — Multi-Power RSA
> Takagi đề xuất RSA variant với modulus $N = p^r q$ ($r \geq 2$), cho phép decrypt nhanh hơn RSA thường nhờ cấu trúc đặc biệt. Hệ mã này được dùng trong **Okamoto-Uchiyama** ($r=2$), EPOC, và ESIGN.
>
> Trong hệ này: $ed \equiv 1 \pmod{\phi(N)}$ với $\phi(N) = p^{r-1}(p-1)(q-1)$. Khi tấn công secret exponent $d$, ta cần giải:
>
> $$
> ed - 1 = k \cdot p^{r-1}(p-1)(q-1) \implies ex - 1 \equiv 0 \pmod{p^{r-1}}
> $$
>
> Đây chính xác là First Variant với $v = r-1$ và $u = r$ (vì $N \equiv 0 \pmod{p^r}$).
>
> *(theo [19]: Takagi — Fast RSA-type cryptosystem modulo $p^k q$, Crypto 1998)*

---

## Hai bài toán chính

> [!note] Problem 1.1 — First Variant (Generalized Linear Equations)
> **Input**: Composite $N$ với $p^u \mid N$ (unknown $p \geq N^\beta$, known $u \geq 1$); monic linear polynomial $f_1(x_1,\ldots,x_n) = a_0 + a_1x_1 + \cdots + a_nx_n$; bounds $X_i = N^{\gamma_i}$.
>
> **Output**: Tất cả nghiệm nguyên $(y_1,\ldots,y_n)$ của $f_1(x_1,\ldots,x_n) \equiv 0 \pmod{p^v}$ với $|y_i| \leq X_i$.
>
> **Goal**: Xác định điều kiện trên $\gamma_i, \beta, u, v$ để bài toán giải được trong polynomial time.

> [!note] Problem 1.2 — Second Variant (Homogeneous Linear Equations)
> **Input**: Composite $N$ với $p^u \mid N$; linear polynomial **thuần nhất** $f_2(x_1,\ldots,x_n) = a_1x_1 + \cdots + a_nx_n$ (không có $a_0$); bounds $X_i = N^{\gamma_i}$.
>
> **Output**: Tất cả nghiệm nguyên $(y_1,\ldots,y_n)$ của $f_2 \equiv 0 \pmod{p^v}$ với $|y_i| \leq X_i$ và $\gcd(y_1,\ldots,y_n) = 1$.
>
> **Goal**: Khai thác cấu trúc thuần nhất để cải thiện bound so với First Variant.

> [!tip] 💡 Agent note
> Điều kiện $\gcd(y_1,\ldots,y_n) = 1$ trong Second Variant là cần thiết để loại nghiệm tầm thường: nếu $f_2(y_1,\ldots,y_n) = 0$ thì $(cy_1,\ldots,cy_n)$ cũng là nghiệm với mọi $c$. Paper chỉ tìm nghiệm nguyên tố cùng nhau.

---

## Nền tảng Lattice

### Lattice và LLL Algorithm

Một **lattice** (mạng tinh thể) $L$ là tập hợp tất cả tổ hợp nguyên của các basis vector $\mathbf{b}_1,\ldots,\mathbf{b}_w \in \mathbb{R}^n$:

$$
L = \left\{ \sum_{i=1}^w c_i \mathbf{b}_i \;\middle|\; c_i \in \mathbb{Z} \right\}
$$

**Dimension** $w$ và **determinant** $\det(L) = \lvert \det(B) \rvert$ với $B$ là matrix các basis vector.

Bài toán tìm vector ngắn nhất trong lattice (Shortest Vector Problem — SVP) là NP-hard trong trường hợp tổng quát. Tuy nhiên, LLL algorithm [10] tìm được vector **xấp xỉ ngắn** trong polynomial time:

> [!abstract] Lemma 1 — LLL Reduced Basis Bound [10]
> Cho lattice $L$ dimension $w$. LLL algorithm chạy trong polynomial time và output một reduced basis $v_1,\ldots,v_w$ thỏa mãn:
>
> $$
> \|v_i\| \leq 2^{\frac{w(w-1)}{4(w+1-i)}} \cdot \det(L)^{\frac{1}{w+1-i}}
> $$
>
> Đặc biệt, vector ngắn nhất trong output thỏa mãn:
>
> $$
> \|v_1\| \leq 2^{\frac{w-1}{4}} \cdot \det(L)^{\frac{1}{w}}
> $$

**Proof.** Đây là kết quả cổ điển của Lenstra–Lenstra–Lovász [10]; không chứng minh lại ở đây. $\blacksquare$

### Howgrave-Graham Lifting Lemma

Đây là công cụ then chốt biến nghiệm modular thành nghiệm nguyên — trái tim của toàn bộ phương pháp Coppersmith:

> [!abstract] Lemma 2 — Howgrave-Graham [7]
> Cho $g(x_1,\ldots,x_k) \in \mathbb{Z}[x_1,\ldots,x_k]$ là đa thức nguyên có **tối đa $w$ monomial**. Giả sử:
>
> 1. $g(y_1,\ldots,y_k) \equiv 0 \pmod{p^m}$ với $|y_i| \leq X_i$, và
> 2. $\|g(x_1 X_1, \ldots, x_k X_k)\| < \dfrac{p^m}{\sqrt{w}}$
>
> thì $g(y_1,\ldots,y_k) = 0$ **trên số nguyên** (không chỉ modulo $p^m$).

**Proof.** Gọi $h(x_1,\ldots,x_k) = g(x_1 X_1,\ldots,x_k X_k)$. Mỗi monomial $c_{i_1\cdots i_k} x_1^{i_1}\cdots x_k^{i_k}$ của $g$ tương ứng với $c_{i_1\cdots i_k} X_1^{i_1}\cdots X_k^{i_k} x_1^{i_1}\cdots x_k^{i_k}$ trong $h$. Tại điểm $(y_1/X_1,\ldots,y_k/X_k)$, mỗi variable có norm $\leq 1$. Do đó:

$$
\left\lvert g(y_1,\ldots,y_k) \right\rvert = \left\lvert h\!\left(\tfrac{y_1}{X_1},\ldots,\tfrac{y_k}{X_k}\right) \right\rvert \leq \|h\| \cdot \sqrt{w} < p^m
$$

Bất đẳng thức cuối dùng Cauchy-Schwarz và điều kiện 2. Nhưng điều kiện 1 cho biết $g(y_1,\ldots,y_k) \equiv 0 \pmod{p^m}$, tức $p^m \mid g(y_1,\ldots,y_k)$. Kết hợp: $\lvert g(y_1,\ldots,y_k) \rvert < p^m$ và $p^m \mid g(y_1,\ldots,y_k)$, suy ra $g(y_1,\ldots,y_k) = 0$. $\blacksquare$

> [!tip] 💡 Agent note
> Lemma 2 là "bridge" từ lattice sang root finding: LLL cho vector ngắn, vector ngắn tương ứng đa thức có norm nhỏ, Lemma 2 đảm bảo đa thức đó có nghiệm nguyên. Toàn bộ strategy của paper xoay quanh việc construct lattice sao cho LLL output thỏa điều kiện norm trong Lemma 2.

---

## Chiến lược tổng thể của paper

Approach chung của Lu–Zhang–Lin (và Herrmann–May trước đó) gồm 4 bước:

```text
Bước 1 — Polynomial Construction
  Từ f(x) ≡ 0 (mod p^v), xây dựng một tập đa thức g_k(x)
  sao cho mọi g_k đều có cùng nghiệm (y) modulo p^(vt)
  cho một tham số t được chọn tối ưu.

Bước 2 — Lattice Construction
  Dùng các coefficient vector của g_k(xX) làm basis
  của lattice L. Chọn thứ tự sao cho L có dạng tam giác
  → det(L) tính được từ tích các phần tử đường chéo.

Bước 3 — LLL Reduction
  Chạy LLL trên L. Lemma 1 cho bound trên norm của
  vector ngắn nhất v1 theo det(L).

Bước 4 — Root Extraction
  Nếu ||v1|| < p^(vt) / sqrt(w), Lemma 2 đảm bảo
  đa thức tương ứng có nghiệm nguyên → tìm nghiệm
  bằng standard methods (Gröbner basis với n > 1).
```

> [!note] Key Design Question
> **Bước 1 là nơi kỹ thuật mới của paper nằm**: chọn collection đa thức $g_k$ như thế nào để $\det(L)$ đủ nhỏ (LLL cho vector ngắn) mà vẫn đảm bảo $g_k(y) \equiv 0 \pmod{p^{vt}}$?
>
> Paper trả lời câu hỏi này khác nhau cho First Variant (§3) và Second Variant (§4), dẫn đến các bound $\gamma$ khác nhau.

---

## Overview kết quả

Bảng dưới tóm tắt các kết quả chính của paper so với tiền thân:

| Bài toán | Prior best | Kết quả mới |
|----------|-----------|-------------|
| Univariate linear mod $p^v$, $p^u \mid N$ | [8]: $\gamma < \beta^2$ (khi $u=v=1$) | Theorem 1: $\gamma < uv\beta^2$ |
| Multi-power RSA $d < N^\delta$, $N=p^r q$ | [12] May: $\delta < \max\!\left\{\frac{r}{(r+1)^2}, \frac{(r-1)^2}{(r+1)^2}\right\}$ | Theorem 4: $\delta < \frac{r(r-1)}{(r+1)^2}$ |
| Weak encryption exponent RSA | [14] Nitaj: $\gamma+\delta \leq \frac{\sqrt{2}-1}{2} \approx 0.207$ | Theorem 9: $\gamma+\delta \leq 0.25$ |
| CRT-RSA weak exponent | [14] Nitaj: $d_p < N^{\sqrt{2}/4}/\sqrt{e}$ | Theorem 10: $d_p < N^{0.375}/\sqrt{e}$ |

---

## Summary

- Bài toán trung tâm: tìm nghiệm nhỏ của $f(x_1,\ldots,x_n) \equiv 0 \pmod{p^v}$ với $p$ ẩn, $p^u \mid N$ đã biết.
- **Lemma 1** (LLL): output vector ngắn có norm bị chặn bởi $\det(L)^{1/w}$.
- **Lemma 2** (Howgrave-Graham): nếu norm đủ nhỏ so với $p^m/\sqrt{w}$, nghiệm modular là nghiệm nguyên.
- Chiến lược 4 bước: construct polynomials → build lattice → run LLL → extract root.
- First Variant ($a_0 \neq 0$) và Second Variant ($a_0 = 0$) dùng collection đa thức khác nhau, cho bound khác nhau.

---

## References

- [6] Herrmann & May — *Solving linear equations modulo divisors: On factoring given any bits*, Asiacrypt 2008
- [7] Howgrave-Graham — *Finding small roots of univariate modular equations revisited*, Cryptography and Coding 1997
- [8] Howgrave-Graham — *Approximate integer common divisors*, Cryptography and Lattices 2001
- [10] Lenstra, Lenstra, Lovász — *Factoring polynomials with rational coefficients*, Math. Annalen 1982 (🔴 Prerequisite)
- [11] May — *New RSA vulnerabilities using lattice reduction methods*, PhD thesis 2003
- [12] May — *Secret exponent attacks on RSA-type schemes with moduli N = p^r q*, PKC 2004
- [14] Nitaj — *A new attack on RSA and CRT-RSA*, Africacrypt 2012
- [19] Takagi — *Fast RSA-type cryptosystem modulo p^k q*, Crypto 1998
