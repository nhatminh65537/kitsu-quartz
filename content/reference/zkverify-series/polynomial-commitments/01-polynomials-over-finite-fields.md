---
title: "01. Polynomials over Finite Fields"
tags: [crypto, zk, polynomial-commitments, lesson-01]
aliases: [Polynomials over Finite Fields]
created: 2026-03-12
---

> **Prerequisites**: Modular arithmetic, group theory cơ bản  
> **Objectives**:  
> - Nắm vững cấu trúc đa thức trên trường hữu hạn và lý do chúng được dùng trong ZK
> - Hiểu và tính được nội suy Lagrange (Lagrange interpolation)
> - Hiểu FFT-friendly domains và multiplicative subgroups
> - Biết Reed-Solomon codes là gì và liên quan đến polynomial commitments thế nào

---

## Motivation

Polynomial commitments là nền tảng của gần như tất cả hệ thống ZK hiện đại — PLONK, STARK, Groth16, Halo2. Nhưng tại sao lại dùng đa thức thay vì các cấu trúc dữ liệu khác?

Lý do cốt lõi đến từ **Schwartz-Zippel Lemma**: hai đa thức bậc $d$ phân biệt trên một trường $\mathbb{F}_p$ sẽ đồng nhất tại nhiều nhất $d$ điểm. Nếu $p \gg d$, xác suất hai đa thức ngẫu nhiên trùng nhau tại một điểm random là $d/p$ — cực kỳ nhỏ. Điều này cho phép **kiểm tra sự đồng nhất của hai đa thức bằng cách evaluate tại một điểm ngẫu nhiên duy nhất** — nền tảng của toàn bộ polynomial IOP.

---

## Đa thức trên Trường Hữu hạn

### Trường hữu hạn (Finite Field)

> [!definition] Definition 1.1 — Finite Field $\mathbb{F}_p$
> Với $p$ là số nguyên tố, **trường hữu hạn** (finite field) $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$ là tập $\{0, 1, \ldots, p-1\}$ với phép cộng và nhân modulo $p$.
>
> Mọi phần tử $a \neq 0$ đều có nghịch đảo nhân $a^{-1}$ thỏa $a \cdot a^{-1} \equiv 1 \pmod{p}$.

> [!definition] Definition 1.2 — Polynomial Ring $\mathbb{F}_p[X]$
> **Vành đa thức** (polynomial ring) $\mathbb{F}_p[X]$ là tập các đa thức có hệ số trong $\mathbb{F}_p$:
>
> $$f(X) = a_0 + a_1 X + a_2 X^2 + \cdots + a_d X^d, \quad a_i \in \mathbb{F}_p$$
>
> Ký hiệu $\mathbb{F}_p[X]^{\leq d}$ cho tập các đa thức bậc tối đa $d$.

### Hai cách biểu diễn đa thức

Có hai cách tương đương để biểu diễn một đa thức bậc $d$:

**Coefficient form (dạng hệ số)**:

$$f(X) = a_0 + a_1 X + \cdots + a_d X^d$$

**Evaluation form (dạng điểm-giá trị)**:

$$\{(x_0, f(x_0)),\; (x_1, f(x_1)),\; \ldots,\; (x_d, f(x_d))\}$$

Với $d+1$ điểm phân biệt, hai biểu diễn là **tương đương** — bất kỳ đa thức bậc $d$ nào cũng được xác định duy nhất bởi $d+1$ điểm. Chuyển đổi qua lại giữa hai dạng này là một phép toán cốt lõi trong polynomial commitments.

### Schwartz-Zippel Lemma

> [!theorem] Theorem 1.3 — Schwartz-Zippel Lemma
> Cho $f \in \mathbb{F}_p[X]^{\leq d}$, $f \not\equiv 0$. Nếu $z$ được chọn ngẫu nhiên đều từ $\mathbb{F}_p$, thì:
>
> $$\Pr[f(z) = 0] \leq \frac{d}{p}$$

**Hệ quả quan trọng**: Nếu $f \neq g$ (hai đa thức bậc $\leq d$), thì $\Pr[f(z) = g(z)] = \Pr[(f-g)(z) = 0] \leq d/p$. Với $p \approx 2^{256}$ và $d \approx 2^{20}$, xác suất này là $\approx 2^{-236}$ — negligible.

---

## Nội suy Lagrange (Lagrange Interpolation)

> [!definition] Definition 1.4 — Lagrange Interpolation
> Cho $n+1$ điểm phân biệt $(x_0, y_0), \ldots, (x_n, y_n)$ với $x_i \in \mathbb{F}_p$. Đa thức bậc $\leq n$ duy nhất đi qua tất cả các điểm là:
>
> $$f(X) = \sum_{i=0}^{n} y_i \cdot L_i(X)$$
>
> trong đó **Lagrange basis polynomials** (đa thức cơ sở Lagrange) là:
>
> $$L_i(X) = \prod_{j \neq i} \frac{X - x_j}{x_i - x_j}$$

**Tính chất**: $L_i(x_j) = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}$

**Tại sao quan trọng trong ZK?** Trong PLONK, mạch tính toán được encode thành bảng giá trị $(x_i, w_i)$. Đa thức $f$ nội suy qua bảng đó là "nhân chứng" (witness) của phép tính. Committing to $f$ = committing to toàn bộ bảng tính.

```python
def lagrange_interpolate(xs, ys, p):
    """Nội suy Lagrange trên F_p.
    xs: danh sách x-coordinates (phân biệt)
    ys: danh sách y-coordinates
    p: modulus nguyên tố
    Trả về: list hệ số [a0, a1, ..., ad] của f(X)
    """
    assert len(xs) == len(ys)
    n = len(xs)
    # Khởi tạo đa thức kết quả dạng coefficients
    result = [0] * n
    
    for i in range(n):
        # Tính L_i(X) dạng hệ số
        li = [1]  # đa thức "1"
        denom = 1
        for j in range(n):
            if j == i:
                continue
            # Nhân (X - x_j) vào li
            new_li = [0] * (len(li) + 1)
            for k, c in enumerate(li):
                new_li[k+1] = (new_li[k+1] + c) % p
                new_li[k] = (new_li[k] - c * xs[j]) % p
            li = new_li
            denom = (denom * (xs[i] - xs[j])) % p
        
        # L_i(X) = li / denom
        denom_inv = pow(denom, p - 2, p)  # Fermat's little theorem
        coeff = (ys[i] * denom_inv) % p
        
        # Cộng y_i * L_i(X) vào result
        for k in range(len(li)):
            result[k] = (result[k] + coeff * li[k]) % p
    
    return result


def poly_eval(coeffs, x, p):
    """Evaluate đa thức tại x dùng Horner's method."""
    result = 0
    for c in reversed(coeffs):
        result = (result * x + c) % p
    return result


# Demo
p = 101
xs = [1, 2, 3, 4]
ys = [6, 11, 18, 27]  # f(x) = x^2 + 2x + 3

coeffs = lagrange_interpolate(xs, ys, p)
print(f"Coefficients: {coeffs}")  # [3, 2, 1, 0] tương ứng 3 + 2x + x^2

# Verify
for x, y in zip(xs, ys):
    assert poly_eval(coeffs, x, p) == y % p, f"Mismatch at x={x}"
print("Interpolation verified!")
```

---

## Multiplicative Subgroups & FFT Domains

### Multiplicative subgroup

> [!definition] Definition 1.5 — Multiplicative Subgroup & Primitive Root of Unity
> Nhóm nhân $\mathbb{F}_p^* = \mathbb{F}_p \setminus \{0\}$ là cyclic group bậc $p-1$.
>
> Nếu $(p-1)$ chia hết cho $n$, thì tồn tại **subgroup multiplicative** $H \subset \mathbb{F}_p^*$ bậc $n$, được generate bởi $\omega$ thỏa:
>
> $$\omega^n = 1, \quad \omega^k \neq 1 \text{ với } 0 < k < n$$
>
> $\omega$ được gọi là **primitive $n$-th root of unity** (căn nguyên thủy bậc $n$).

**Ví dụ cụ thể**: Với $p = 17$, ta có $p - 1 = 16$. Root of unity bậc $4$: $\omega = 4$ vì $4^4 = 256 \equiv 1 \pmod{17}$. Tập $H = \{1, 4, 16, 13\}$ là subgroup bậc 4.

Tại sao dùng? Vì phép evaluate đa thức tại **tất cả các phần tử của $H$** có thể làm với FFT (Fast Fourier Transform) trong $O(n \log n)$ thay vì $O(n^2)$.

### Vanishing polynomial

> [!definition] Definition 1.6 — Vanishing Polynomial
> Với domain $H = \{\omega^0, \omega^1, \ldots, \omega^{n-1}\}$, **vanishing polynomial** (đa thức triệt tiêu) là:
>
> $$Z_H(X) = \prod_{h \in H}(X - h) = X^n - 1$$
>
> Đây là đa thức bậc $n$ nhỏ nhất triệt tiêu trên toàn bộ $H$.

**Ứng dụng chính**: Trong PLONK, một đa thức $f$ thỏa một ràng buộc "tại mọi điểm trong $H$" tương đương với $Z_H(X) \mid f(X)$. Thay vì kiểm tra $n$ ràng buộc riêng lẻ, chỉ cần kiểm tra một phép chia hết đa thức.

---

## Reed-Solomon Codes

> [!definition] Definition 1.7 — Reed-Solomon Code
> Cho domain $H \subset \mathbb{F}_p$ với $|H| = n$ và tham số $k \leq n$. **Mã Reed-Solomon** $\text{RS}[\mathbb{F}_p, H, k]$ là tập tất cả các vector evaluations:
>
> $$\text{RS}[\mathbb{F}_p, H, k] = \{(f(\omega^0), f(\omega^1), \ldots, f(\omega^{n-1})) : f \in \mathbb{F}_p[X]^{< k}\}$$
>
> Đây là tập tất cả các bảng giá trị của đa thức bậc $< k$ khi evaluate trên $H$.

**Rate (tỉ lệ)**: $\rho = k/n$. Nếu $\rho = 1/2$, chỉ một nửa bảng là "tin tức" (coefficients), nửa còn lại là redundancy.

**Khoảng cách tương đối (relative distance)**: Hai codeword trong $\text{RS}[\mathbb{F}_p, H, k]$ cách nhau ít nhất $1 - \rho + 1/n \approx 1 - \rho$ fraction các vị trí. Đây là cơ sở của **FRI proximity testing**: để kiểm tra $f$ có bậc $< k$ hay không, chỉ cần kiểm tra một số điểm ngẫu nhiên.

---

## Tóm tắt

- Đa thức trên $\mathbb{F}_p$ là công cụ mạnh nhờ **Schwartz-Zippel**: kiểm tra đồng nhất hai đa thức tại một điểm random với độ chính xác cực cao.
- **Lagrange interpolation** cho phép encode bảng giá trị thành đa thức duy nhất — cơ sở của witness encoding trong ZK.
- **Multiplicative subgroups** với FFT cho phép evaluate hiệu quả $O(n \log n)$, biến các phép kiểm tra trên toàn domain thành kiểm tra chia hết với **vanishing polynomial** $Z_H(X) = X^n - 1$.
- **Reed-Solomon codes** là tầng mã hóa nhìn thấy từ góc coding theory: FRI sử dụng proximity testing với RS codes làm cốt lõi.

---

## References

- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 15 (toc.cryptobook.us)
- Dan Boneh — ZKP MOOC, Lecture 5 (rdi.berkeley.edu/zkp-course)
- Dankrad Feist — *KZG Polynomial Commitments* (dankradfeist.de)
- Wikipedia — Lagrange interpolation, Reed-Solomon error correction
