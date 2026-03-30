---
title: "A3. Cooley-Tukey FFT Derivation"
tags: [math, fourier-analysis, appendix, fft, cooley-tukey, algorithm]
aliases: [FFT Derivation, Cooley-Tukey Proof]
created: 2026-03-24
---

> **Related lesson**: [[11-fft|11. Fast Fourier Transform (FFT)]]
> **Goal**: Chứng minh chặt chẽ correctness và độ phức tạp $O(N\log N)$ của Cooley-Tukey Radix-2 FFT.

---

## Thiết Lập và Ký Hiệu

Cho $N = 2^p$ (lũy thừa 2) và vector $\mathbf{x} = (x_0, x_1, \ldots, x_{N-1}) \in \mathbb{C}^N$.

Đặt $\omega_N = e^{-2\pi i/N}$ là primitive $N$-th root of unity.

**DFT**:
$$
X[k] = \sum_{n=0}^{N-1} x[n]\, \omega_N^{nk}, \qquad k = 0, 1, \ldots, N-1
$$

**Mục tiêu**: Tính tất cả $N$ giá trị $X[0], \ldots, X[N-1]$ trong $O(N\log N)$ phép nhân và cộng phức.

---

## Bổ Đề Nền Tảng: Tính Chất Roots of Unity

> [!lemma] Lemma A3.1 — Các Tính Chất Cơ Bản
> 1. **Tuần hoàn**: $\omega_N^{n+N} = \omega_N^n$
>
> 2. **Halving**: $\omega_N^{n+N/2} = -\omega_N^n$ (vì $\omega_N^{N/2} = e^{-\pi i} = -1$)
>
> 3. **Relation**: $\omega_N^{2k} = \omega_{N/2}^k$ (vì $e^{-2\pi i \cdot 2k/N} = e^{-2\pi ik/(N/2)}$)
>
> 4. **Orthogonality**: $\sum_{n=0}^{N-1} \omega_N^{nk} = N \cdot \mathbf{1}_{k \equiv 0 \pmod N}$

**Proof của (4).** Khi $k \equiv 0$: mỗi hạng bằng $1$, tổng $= N$. Khi $k \not\equiv 0$: geometric series với $r = \omega_N^k \neq 1$: $\sum = \frac{r^N - 1}{r-1} = \frac{(\omega_N^N)^k - 1}{r-1} = \frac{1-1}{r-1} = 0$. $\blacksquare$

---

## Phân Rã Chẵn-Lẻ (Decimation In Time)

> [!theorem] Theorem A3.2 — Cooley-Tukey Decomposition
> Với $N = 2M$, DFT $N$-điểm phân rã thành hai DFT $M$-điểm. Định nghĩa:
>
> $$
> E[k] = \sum_{n=0}^{M-1} x[2n]\, \omega_M^{nk}, \qquad O[k] = \sum_{n=0}^{M-1} x[2n+1]\, \omega_M^{nk}
> $$
>
> (DFT của phần chẵn và lẻ). Khi đó với $k = 0, 1, \ldots, M-1$:
>
> $$
> X[k] = E[k] + \omega_N^k \cdot O[k]
> $$
>
> $$
> X[k+M] = E[k] - \omega_N^k \cdot O[k]
> $$

**Proof.**

Tách tổng $\sum_{n=0}^{N-1}$ thành $n$ chẵn ($n = 2j$) và lẻ ($n = 2j+1$):

$$
X[k] = \sum_{j=0}^{M-1} x[2j]\, \omega_N^{2jk} + \sum_{j=0}^{M-1} x[2j+1]\, \omega_N^{(2j+1)k}
$$

**Bước quan trọng** — dùng Lemma A3.1(3): $\omega_N^{2jk} = \omega_{N/2}^{jk} = \omega_M^{jk}$. Vậy:

$$
X[k] = \underbrace{\sum_{j=0}^{M-1} x[2j]\, \omega_M^{jk}}_{E[k]} + \omega_N^k \underbrace{\sum_{j=0}^{M-1} x[2j+1]\, \omega_M^{jk}}_{O[k]} = E[k] + \omega_N^k \cdot O[k]. \quad \checkmark
$$

**Cho $X[k+M]$**: Tương tự, nhưng $\omega_N^{2j(k+M)} = \omega_N^{2jk} \cdot \omega_N^{2jM} = \omega_M^{jk} \cdot (\omega_N^N)^{j} = \omega_M^{jk}$ (vì $\omega_N^N = 1$). Tích nhân factor: $\omega_N^{k+M} = \omega_N^k \cdot \omega_N^M = -\omega_N^k$ (Lemma A3.1(2)). Vậy:

$$
X[k+M] = E[k] + (-\omega_N^k) \cdot O[k] = E[k] - \omega_N^k \cdot O[k]. \quad \blacksquare
$$

**Ý nghĩa**: Từ $M$ giá trị $E[0..M-1]$ và $O[0..M-1]$, tính được tất cả $N = 2M$ giá trị $X[0..N-1]$ bằng $M$ phép nhân (các $\omega_N^k$) và $2M$ phép cộng. Đây là **butterfly operation**.

---

## Thuật Toán Đệ Quy

```
ALGORITHM FFT_RECURSIVE(x, N, omega_N):
  IF N == 1: RETURN x

  // Chia chẵn/lẻ
  x_even = [x[0], x[2], x[4], ..., x[N-2]]   // N/2 phần tử
  x_odd  = [x[1], x[3], x[5], ..., x[N-1]]   // N/2 phần tử

  // Đệ quy: omega_{N/2} = omega_N^2
  E = FFT_RECURSIVE(x_even, N/2, omega_N^2)
  O = FFT_RECURSIVE(x_odd,  N/2, omega_N^2)

  // Butterfly combination
  FOR k = 0, 1, ..., N/2 - 1:
    twiddle = omega_N^k
    X[k]       = E[k] + twiddle * O[k]
    X[k + N/2] = E[k] - twiddle * O[k]

  RETURN X
```

---

## Chứng Minh Correctness bằng Quy Nạp

> [!theorem] Theorem A3.3 — Correctness của FFT Đệ Quy
> `FFT_RECURSIVE(x, N, omega_N)` trả về đúng DFT $N$-điểm của $\mathbf{x}$.

**Proof bằng strong induction trên $N = 2^p$.**

**Base case** ($N = 1$): DFT của $x = (x_0)$ là $(x_0)$. Thuật toán trả về $x$ trực tiếp. ✓

**Inductive step**: Giả sử thuật toán đúng cho mọi $N' < N$, cụ thể cho $N' = N/2$.

- `E = FFT_RECURSIVE(x_even, N/2, omega_N^2)`: bằng giả thiết quy nạp, đây là DFT $N/2$-điểm của $\mathbf{x}_{\text{even}}$ với root of unity $\omega_N^2 = \omega_{N/2}$:
$$
E[k] = \sum_{j=0}^{N/2-1} x[2j]\, (\omega_N^2)^{jk} = \sum_{j=0}^{N/2-1} x[2j]\, \omega_{N/2}^{jk}. \quad \checkmark
$$

- `O = FFT_RECURSIVE(x_odd, N/2, omega_N^2)` tương tự:
$$
O[k] = \sum_{j=0}^{N/2-1} x[2j+1]\, \omega_{N/2}^{jk}. \quad \checkmark
$$

- Butterfly combination tính $X[k] = E[k] + \omega_N^k O[k]$ và $X[k+N/2] = E[k] - \omega_N^k O[k]$.

- Theo Theorem A3.2, đây đúng là $X[k]$ và $X[k+N/2]$ của DFT $N$-điểm. ✓

Vậy toàn bộ $N$ giá trị được tính đúng. $\blacksquare$

---

## Phân Tích Độ Phức Tạp

> [!theorem] Theorem A3.4 — FFT là $O(N \log N)$
> Số phép nhân phức $T(N)$ của FFT thỏa:
>
> $$
> T(N) = \frac{N}{2}\log_2 N
> $$

**Proof.** Mỗi lần gọi `FFT_RECURSIVE(N)`:
- Gọi đệ quy 2 lần với kích thước $N/2$
- $N/2$ phép nhân phức (tính các twiddle factors $\omega_N^k \cdot O[k]$)
- $N$ phép cộng phức (các butterflies)

Recurrence cho số phép nhân:

$$
T(N) = 2T(N/2) + \frac{N}{2}, \quad T(1) = 0.
$$

**Giải recurrence** (Master Theorem, case 1, hoặc unrolling):

$$
T(N) = 2T(N/2) + \frac{N}{2}
     = 2\left[2T(N/4) + \frac{N/2}{2}\right] + \frac{N}{2}
     = 4T(N/4) + 2\cdot\frac{N}{4} + \frac{N}{2}
     = \ldots
$$

Sau $p = \log_2 N$ bước ($N/2^p = 1$):

$$
T(N) = N \cdot T(1) + p \cdot \frac{N}{2} = 0 + \frac{N}{2}\log_2 N. \quad \blacksquare
$$

**So sánh với DFT naïve**: $T_{\text{DFT}}(N) = N^2$ phép nhân. Speedup:

$$
\frac{N^2}{(N/2)\log_2 N} = \frac{2N}{\log_2 N}
$$

Với $N = 1024$: speedup $= 2048/10 \approx 205\times$.

---

## Bit-Reversal Permutation — Chứng Minh

> [!theorem] Theorem A3.5 — Thứ Tự Input trong Iterative FFT
> Trong iterative FFT (không đệ quy), input cần sắp xếp theo **bit-reversal permutation**: vị trí $n$ trong array được đặt tại vị trí $\operatorname{BitRev}_p(n)$ trong đó $\operatorname{BitRev}_p$ đảo $p$ bits của $n$.

**Proof.** Trace the recursive calls:

- Lần gọi đầu: chia $\mathbf{x}$ thành $\mathbf{x}_{\text{even}} = (x_0, x_2, x_4, \ldots)$ và $\mathbf{x}_{\text{odd}} = (x_1, x_3, x_5, \ldots)$.
- Lần gọi thứ 2 trên $\mathbf{x}_{\text{even}}$: chia thành $(x_0, x_4, x_8, \ldots)$ và $(x_2, x_6, x_{10}, \ldots)$.
- Tiếp tục $p = \log_2 N$ lần.

Sau $p$ lần phân chia, phần tử $x_n$ nằm tại leaf của binary tree ở vị trí xác định bởi **bit-reversed index** của $n$. Cụ thể: lần phân chia $j$ nhìn bit $j$ của $n$ (từ LSB đến MSB), trong khi thứ tự cuối cùng tương ứng với đọc các bits từ MSB đến LSB. $\blacksquare$

**Ví dụ $N=8$, $p=3$**:

| $n$ | Binary | Bit-reversed | Vị trí cuối |
|-----|--------|-------------|-------------|
| $0$ | $000$ | $000$ | $0$ |
| $1$ | $001$ | $100$ | $4$ |
| $2$ | $010$ | $010$ | $2$ |
| $3$ | $011$ | $110$ | $6$ |
| $4$ | $100$ | $001$ | $1$ |
| $5$ | $101$ | $101$ | $5$ |
| $6$ | $110$ | $011$ | $3$ |
| $7$ | $111$ | $111$ | $7$ |

---

## Iterative Implementation (Outline)

Thay vì đệ quy, ta có thể implement in-place với $O(N)$ bộ nhớ phụ:

```
ALGORITHM FFT_ITERATIVE(x, N):
  1. Áp dụng bit-reversal permutation lên x (in-place)

  2. FOR stage s = 1, 2, ..., log2(N):
       half = 2^(s-1)    // kích thước nửa butterfly
       length = 2 * half  // kích thước một butterfly group
       omega = exp(-2*pi*i / length)  // primitive root cho stage này

       FOR start = 0, length, 2*length, ..., N-length:
         FOR k = 0, 1, ..., half-1:
           u = x[start + k]
           v = x[start + k + half] * omega^k
           x[start + k]       = u + v
           x[start + k + half] = u - v
```

**In-place**: Mỗi butterfly ghi đè đúng 2 phần tử đã đọc — không cần array phụ.

---

## Tổng Kết: Tại Sao FFT là Đẹp?

FFT khai thác đồng thời hai tính chất của $\omega_N$:

1. **Halving**: $\omega_N^{n+N/2} = -\omega_N^n$ → hai output từ một twiddle factor (mỗi butterfly tái sử dụng $\omega_N^k O[k]$)

2. **Squaring**: $(\omega_N^2)$ là primitive $N/2$-th root → phân rã đệ quy valid

Kết hợp $p = \log_2 N$ tầng phân rã, mỗi tầng $O(N)$: tổng $O(N\log N)$.

---

## References

- Cooley, J. W. & Tukey, J. W. "An algorithm for the machine calculation of complex Fourier series." *Math. Comput.* 19(90), 1965.
- Oppenheim, A. V. & Schafer, R. W. *Discrete-Time Signal Processing* (3rd ed.). Chapter 9.
- Stein, E. M. & Shakarchi, R. *Fourier Analysis*. Princeton, 2003. Chapter 7.
- Frigo, M. & Johnson, S. G. "The design and implementation of FFTW3." *Proc. IEEE* 93(2), 2005.
