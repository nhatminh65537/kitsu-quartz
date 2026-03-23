---
title: "04. The Anemoi Permutation"
type: scheme
tags: [anemoi, permutation, spn, mds, round-function, scheme, lesson-04]
aliases: [Anemoi Permutation, Anemoi SPN, Anemoi round function]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Flystel S-box và CCZ-equivalence (xem [[03-flystel-sbox|03. The Flystel S-Box]]), AO hash và CICO (xem [[01-ao-hash-functions-and-cico|01. AO Hash Functions & CICO]]), MDS matrix (linear algebra nền)
> 🔴 **Prerequisite references**: MDS matrix theory (ví dụ: Lacan & Fimes — *Systematic MDS erasure codes based on Vandermonde matrices*, 2004); SPN block cipher design (ví dụ: Biryukov & Shamir — *Structural Cryptanalysis of SASAS*, EUROCRYPT 2001)
> **Lesson type**: Scheme
> **Covers**: §5.1 (round constants), §5.2 (linear layer — MDS + PHT), §5.3 (S-box layer), §5.4 (full round function và permutation), §5.5 / Table 1 (số rounds)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\ell$ | Số cột (branches mỗi hàng), state = $(\mathbb{F}_q)^{2\ell}$ | $l$ (paper dùng $l$) |
> | $X = (x_0, \ldots, x_{\ell-1})$ | Hàng thứ nhất của state | $X$ |
> | $Y = (y_0, \ldots, y_{\ell-1})$ | Hàng thứ hai của state | $Y$ |
> | $C^r, D^r$ | Round constants cho hàng $X$ và $Y$ tại round $r$ | $\mathbf{c}^r, \mathbf{d}^r$ |
> | $M_X$ | MDS matrix $\ell \times \ell$ áp dụng cho $X$ | $\mathcal{M}$ |
> | $\rho$ | Cyclic shift: $(y_0,\ldots,y_{\ell-1}) \mapsto (y_1,\ldots,y_{\ell-1},y_0)$ | $\rho$ |
> | $\mathsf{PHT}$ | Pseudo-Hadamard Transform: $Y \leftarrow Y + X$, $X \leftarrow X + Y$ | $\mathcal{P}$ |
> | $H$ | Open Flystel (S-box layer per column) | $\mathcal{H}$ |
> | $R_r$ | Round function thứ $r$ | $R_r$ |
> | $n_r$ | Tổng số rounds | $n_r$ |
> | $\pi_0, \pi_1$ | Hai chuỗi digits của $\pi$ dùng để derive round constants | $\pi_0, \pi_1$ |
> | $g$ | Constant trong Flystel (generator-like element) | $g$ |

---

## Motivation

Flystel S-box từ Lesson 03 là viên gạch xây dựng cốt lõi. Bài này mô tả cách ghép Flystel vào một **Substitution-Permutation Network** (SPN) đầy đủ để tạo ra **Anemoi permutation** — một permutation trên $\mathbb{F}_q^{2\ell}$ dùng làm nền cho cả AnemoiSponge và AnemoiJive.

Ba câu hỏi:
1. **What is it?** — Anemoi là SPN với state $2\ell$ phần tử, $n_r$ rounds.
2. **How does it work?** — Mỗi round: constant addition → linear layer → Flystel S-box layer.
3. **Why is it correct/secure?** — Số rounds được chọn từ Equation (2) đảm bảo CICO-hardness tối thiểu $2^\lambda$.

---

## 1. Mathematical Setting

> [!note] Setting 1.1 — Anemoi Parameters
> Anemoi được xác định bởi bộ tham số $(q, \alpha, \ell)$:
> - $q$: bậc trường ($q = p$ nguyên tố hoặc $q = 2^n$)
> - $\alpha \in \{3, 5, 7, 11\}$: exponent, chọn nhỏ nhất sao cho $\gcd(\alpha, q-1) = 1$
> - $\ell \geq 1$: số cột (state width $= 2\ell$ phần tử $\mathbb{F}_q$)
>
> **State**: ma trận $2 \times \ell$ trên $\mathbb{F}_q$, biểu diễn là $(X, Y)$ với $X, Y \in \mathbb{F}_q^\ell$.
>
> **Yêu cầu trên $q$**: $|q| \geq 10$ bits để đảm bảo tồn tại MDS matrix.

---

## 2. Round Constants

### 2.1 Mục đích

Round constants ngăn ngừa **slide attacks** và phá vỡ symmetry giữa các rounds — làm cho mỗi round khác nhau về mặt algebraic.

### 2.2 Phương pháp derive

Paper [Bou+22/23, §5.1] derive round constants từ chữ số thập phân của $\pi$:

$$
\pi_0 = \underbrace{14159265358979\ldots}_{\text{100 chữ số đầu của phần thập phân }\pi}
$$

$$
\pi_1 = \underbrace{82148086513282\ldots}_{\text{100 chữ số tiếp theo}}
$$

Sau đó cast $\pi_0, \pi_1$ thành phần tử $\mathbb{F}_q$ (coi là số nguyên mod $q$). Round constants tại round $r$, column $i$ được định nghĩa:

$$
c_i^r = g \cdot (\pi_0^r)^2 + (\pi_0^r + \pi_1^r)^\alpha
$$

$$
d_i^r = g \cdot (\pi_1^i)^2 + (\pi_0^r + \pi_1^i)^\alpha + g^{-1}
$$

với $\pi_0^r$ là phần tử thứ $r$ của chuỗi $\pi_0$ (sau cast vào $\mathbb{F}_q$).

> [!tip] 💡 Agent note
> Phương pháp "nothing-up-my-sleeve": dùng hằng số từ $\pi$ là quy ước phổ biến (AES, SHA-2, v.v.) để chứng minh các constant không được chọn có chủ ý để tạo backdoor. Công thức quadratic ở đây đảm bảo constants có đặc tính algebraic phù hợp với Flystel structure.

---

## 3. Linear Layer $\mathcal{M}$

Linear layer có hai thành phần:

### 3.1 MDS Matrix $M_X$

Với $\ell > 1$, áp dụng MDS matrix $\ell \times \ell$ lên $X$ và $Y$ (sau cyclic shift):

$$
X \leftarrow M_X(X), \quad Y \leftarrow M_X(\rho(Y))
$$

với $\rho(y_0, \ldots, y_{\ell-1}) = (y_1, \ldots, y_{\ell-1}, y_0)$ (cyclic left shift).

Paper [Bou+22/23, §5.2] cung cấp MDS matrices cụ thể cho $\ell \in \{2, 3, 4\}$, ví dụ với $\ell = 2$:

$$
M_X = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}
$$

(trên $\mathbb{F}_p$ với $p \neq 2$). Đây là ma trận MDS vì mọi minor đều khác 0.

> [!note] Tính chất MDS
> Ma trận $M_X$ là **Maximum Distance Separable (MDS)** nếu mọi submatrix vuông đều có determinant khác 0. Tính chất này đảm bảo **full diffusion**: thay đổi bất kỳ input nào ảnh hưởng đến tối đa số output possible.

### 3.2 Pseudo-Hadamard Transform (PHT)

Sau MDS (hoặc thay thế khi $\ell = 1$), áp dụng PHT để mix $X$ và $Y$:

$$
Y \leftarrow Y + X
$$

$$
X \leftarrow X + Y
$$

PHT là invertible (inverse: $X \leftarrow X - Y$, $Y \leftarrow Y - X$) và đảm bảo diffusion giữa hai hàng ngay cả khi $\ell = 1$ (khi đó MDS là identity).

> [!tip] 💡 Agent note
> PHT xuất hiện trong nhiều "Latin dance" ciphers (Salsa20, ChaCha20). Tên "Jive" của mode hoạt động Anemoi được lấy cảm hứng từ đây — cũng là một điệu nhảy. PHT đặc biệt rẻ trong arithmetization: chỉ cần phép cộng, không cần phép nhân.

---

## 4. S-Box Layer

Sau linear layer, áp dụng Open Flystel $H$ lên từng cột độc lập:

$$
(x_i, y_i) \leftarrow H(x_i, y_i), \quad i = 0, 1, \ldots, \ell - 1
$$

Mỗi Flystel hoạt động trên một cặp $(x_i, y_i)$ — không có dependency giữa các cột trong S-box layer. Đây là tính chất SPN chuẩn: S-box áp dụng song song, linear layer khuếch tán.

---

## 5. Anemoi Permutation — Full Definition

> [!note] Scheme 5.1 — Anemoi Permutation $\mathsf{Anemoi}_{q,\alpha,\ell}$
> **Type**: Permutation (bijection) trên $\mathbb{F}_q^{2\ell}$
> **Parameters**: $(q, \alpha, \ell, n_r)$ — trường, exponent, số cột, số rounds
> **Input**: $(X, Y) \in \mathbb{F}_q^\ell \times \mathbb{F}_q^\ell$
> **Output**: $(X', Y') \in \mathbb{F}_q^\ell \times \mathbb{F}_q^\ell$
>
> **$\mathsf{Anemoi}(X, Y)$:**
>
> Với mỗi round $r = 0, 1, \ldots, n_r - 1$:
>
> *Bước 1 — Constant addition:*
> $$X \leftarrow X + C^r, \quad Y \leftarrow Y + D^r$$
>
> *Bước 2 — MDS (chỉ khi $\ell > 1$):*
> $$X \leftarrow M_X(X), \quad Y \leftarrow M_X(\rho(Y))$$
>
> *Bước 3 — Pseudo-Hadamard Transform:*
> $$Y \leftarrow Y + X, \quad X \leftarrow X + Y$$
>
> *Bước 4 — S-box layer (Open Flystel trên từng cột):*
> $$\text{for } i = 0, \ldots, \ell-1: \quad (x_i, y_i) \leftarrow H(x_i, y_i)$$
>
> *Sau tất cả rounds — Final linear layer:*
> $$X \leftarrow M_X(X), \quad Y \leftarrow M_X(\rho(Y))$$
> $$Y \leftarrow Y + X, \quad X \leftarrow X + Y$$
>
> **Output**: $(X, Y)$

Ký hiệu compact: $\mathsf{Anemoi}_{q,\alpha,\ell} = \mathcal{M} \circ R_{n_r-1} \circ \cdots \circ R_0$

với $R_r = S \circ \mathcal{M} \circ \mathcal{A}_r$ ($\mathcal{A}_r$ = constant addition, $\mathcal{M}$ = linear layer, $S$ = S-box layer).

### 5.1 Tại sao có final linear layer?

Trong block ciphers (AES), outer linear layers thường bị bỏ vì không đóng góp vào cryptographic strength — adversary có thể "absorb" chúng. Nhưng trong **sponge construction**, adversary chỉ kiểm soát phần **rate** của state. Final linear layer đảm bảo rằng sau khi absorb, rate được khuếch tán toàn bộ sang capacity — adversary không thể predict internal state.

---

## 6. Số Rounds — Table 1 và Equation (2)

### 6.1 Nguyên tắc chọn rounds

Số rounds $n_r$ được chọn để đảm bảo CICO problem khó với complexity $\geq 2^\lambda$. Paper [Bou+22/23, §5.5, §7] phân tích rằng bottleneck là **algebraic attacks** (Gröbner basis) — không phải statistical (differential/linear) attacks.

### 6.2 Equation (2) — Round Count Formula

Paper [Bou+22/23, Eq. (2)] đưa ra công thức số rounds minimum:

$$
n_r \geq \left\lceil \frac{\lambda + \log_2(2\ell) + 3}{\log_2(\alpha \cdot \ell)} \right\rceil + 2
$$

Công thức này derived từ complexity analysis của Gröbner basis attack chống CICO — phân tích chi tiết trong [[07-security-analysis-algebraic-attacks|07. Security Analysis]].

### 6.3 Table 1 — Rounds cho 128-bit security ($\lambda = 128$)

| $\alpha$ | $\ell = 1$ | $\ell = 2$ | $\ell = 3$ | $\ell = 4$ | $\ell = 6$ | $\ell = 8$ |
|----------|-----------|-----------|-----------|-----------|-----------|-----------|
| 3 | 21 | 14 | 12 | 12 | 10 | 10 |
| 5 | 21 | 14 | 12 | 12 | 10 | 10 |
| 7 | 20 | 13 | 12 | 11 | 10 | 9 |
| 11 | 19 | 13 | 11 | 11 | 10 | 9 |

Nhận xét:
- $\ell$ lớn hơn $\Rightarrow$ cần ít rounds hơn (diffusion tốt hơn mỗi round).
- $\alpha$ lớn hơn $\Rightarrow$ S-box degree cao hơn $\Rightarrow$ ít rounds hơn.
- BLS12-381/BN-254 thường dùng $\ell = 1$, $\alpha = 11$ $\Rightarrow$ **19 rounds**.

---

## 7. Correctness

> [!abstract] Theorem 7.1 — Anemoi là Permutation
> $\mathsf{Anemoi}_{q,\alpha,\ell}$ là một **bijection** trên $\mathbb{F}_q^{2\ell}$.

**Proof.** Mỗi thành phần là invertible:
- Constant addition: invertible (trừ constants).
- MDS: invertible (det $M_X \neq 0$).
- PHT: invertible (inverse: $X \leftarrow X - Y$, $Y \leftarrow Y - X$).
- Open Flystel $H$: là permutation (xem [[03-flystel-sbox|Lesson 03, §2.1]]).

Tổ hợp các bijections là bijection. $\blacksquare$

---

## 8. Concrete Instance: Anemoi trên BLS12-381

> [!note] Scheme 8.1 — $\mathsf{Anemoi}_{\mathbb{F}_{q_\text{BLS}},\, 11,\, 1}$ (19 rounds)
> **Field**: $\mathbb{F}_{q_\text{BLS}}$ với $q_\text{BLS}$ là scalar field của BLS12-381 (~254 bits)
> **Parameters**: $\alpha = 11$, $\ell = 1$, $n_r = 19$
> **State**: $(x, y) \in \mathbb{F}_q^2$ (2 phần tử field)
> **Linear layer**: PHT only ($\ell = 1$, không cần MDS ngoài PHT)
> **S-box**: Open Flystel $H$ với $E(x) = x^{1/11 \bmod (q-1)}$
> **Security**: 128-bit (dựa trên CICO hardness và Table 1)

Instance này là nền cho **AnemoiJive-BLS12-381** — compression function trong [[05-jive-compression-mode|Lesson 05]].

---

## 9. Summary

- **State**: ma trận $2 \times \ell$ trên $\mathbb{F}_q$, biểu diễn $(X, Y)$.
- **Round function**: constant addition → MDS + PHT → Flystel S-box (SPN structure).
- **Số rounds**: từ Table 1, driven bởi Gröbner basis attack complexity, không phải statistical attacks.
- **Permutation correctness**: mỗi layer là invertible $\Rightarrow$ toàn bộ là bijection.
- **Final linear layer**: quan trọng cho sponge security — spread rate across capacity.
- **Concrete**: BLS12-381 dùng $\ell = 1$, $\alpha = 11$, 19 rounds.

Tiếp theo:
- [[05-jive-compression-mode|05. Jive Compression Mode]] — mode hoạt động cho Merkle tree.
- [[07-security-analysis-algebraic-attacks|07. Security Analysis]] — lý do chọn số rounds từ algebraic attack analysis.

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- [CCZ98] Carlet, Charpin, Zinoviev — *CCZ-equivalence* (🔴 Prerequisite)
- [GKRRS21] Grassi et al. — *Poseidon* (comparison baseline, Lesson 01)
