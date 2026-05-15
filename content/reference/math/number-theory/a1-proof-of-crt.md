---
title: "A1. Chinese Remainder Theorem — Chứng Minh Constructive"
type: appendix
tags: [math, number-theory, appendix]
aliases: [Proof of CRT, Chinese Remainder Theorem Proof]
created: 2026-05-15
---

> **Liên quan**: [[07-chinese-remainder-theorem|07. Định Lý Thặng Dư Trung Hoa]]
> **Yêu cầu**: [[06-linear-congruences|06. Đồng Dư Tuyến Tính]], [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]]

Appendix này trình bày hai chứng minh đầy đủ của Định Lý Thặng Dư Trung Hoa: chứng minh constructive (xây dựng nghiệm tường minh bằng Bezout) và chứng minh đại số (qua đẳng cấu vành). Cả hai cho phép thực hành tính toán cụ thể.

---

## Phát Biểu Đầy Đủ

> [!theorem] Theorem A1.1 — Chinese Remainder Theorem (CRT)
> Cho $n_1, n_2, \ldots, n_k \in \mathbb{Z}^+$ **đôi một nguyên tố cùng nhau**: $\gcd(n_i, n_j) = 1$ với mọi $i \neq j$.
>
> Với **mọi** $a_1, a_2, \ldots, a_k \in \mathbb{Z}$, hệ đồng dư:
>
> $$
> \begin{cases}
> x \equiv a_1 \pmod{n_1} \\
> x \equiv a_2 \pmod{n_2} \\
> \quad \vdots \\
> x \equiv a_k \pmod{n_k}
> \end{cases}
> $$
>
> có **duy nhất** một nghiệm modulo $N = n_1 n_2 \cdots n_k$. Nghiệm đó là:
>
> $$
> x \equiv \sum_{i=1}^k a_i M_i y_i \pmod{N}
> $$
>
> trong đó $M_i = N / n_i$ và $y_i = M_i^{-1} \pmod{n_i}$ (nghịch đảo modulo $n_i$, tồn tại vì $\gcd(M_i, n_i) = 1$).

---

## Phần I — Tồn Tại Nghiệm (Constructive)

### Lemma phụ: tính nghịch đảo $M_i^{-1}$

> [!theorem] Theorem A1.2 — Tồn Tại $M_i^{-1} \pmod{n_i}$
> Với $M_i = N/n_i = \prod_{j \neq i} n_j$, ta có $\gcd(M_i, n_i) = 1$, nên tồn tại $y_i$ với $M_i y_i \equiv 1 \pmod{n_i}$.

**Chứng minh.** Vì $M_i = \prod_{j \neq i} n_j$ và $\gcd(n_j, n_i) = 1$ với mọi $j \neq i$, tích $M_i$ cũng nguyên tố cùng nhau với $n_i$ (tích các số nguyên tố cùng nhau với $n_i$ vẫn nguyên tố cùng nhau với $n_i$). Theo bài 06, $M_i y_i \equiv 1 \pmod{n_i}$ có nghiệm $y_i$, tính được bằng Extended Euclidean. $\blacksquare$

### Xây dựng nghiệm

**Định nghĩa các "hàm cơ sở".** Xét nghiệm riêng lẻ:

$$
e_i = M_i y_i
$$

Khẳng định: $e_i$ thỏa mãn:

$$
e_i \equiv \begin{cases} 1 \pmod{n_i} \\ 0 \pmod{n_j} \quad (j \neq i) \end{cases}
$$

**Chứng minh khẳng định.** Với chỉ số $i$: $e_i = M_i y_i \equiv 1 \pmod{n_i}$ theo định nghĩa $y_i$.

Với $j \neq i$: $e_i = M_i y_i = \left(\prod_{\ell \neq i} n_\ell\right) y_i$. Vì $j \neq i$, tích $\prod_{\ell \neq i} n_\ell$ chứa nhân tử $n_j$, nên $n_j \mid e_i$, tức $e_i \equiv 0 \pmod{n_j}$. $\blacksquare$

**Ghép lại.** Đặt:

$$
x_0 = \sum_{i=1}^k a_i e_i = \sum_{i=1}^k a_i M_i y_i
$$

Với mỗi $j$:

$$
x_0 \equiv \sum_{i=1}^k a_i e_i \equiv a_j \cdot 1 + \sum_{i \neq j} a_i \cdot 0 \equiv a_j \pmod{n_j}
$$

Vậy $x_0$ là nghiệm của hệ. $\blacksquare$

---

## Phần II — Duy Nhất Modulo $N$

> [!theorem] Theorem A1.3 — Duy Nhất Nghiệm Modulo $N$
> Mọi nghiệm của hệ đều đồng dư với $x_0$ modulo $N$.

**Chứng minh.** Giả sử $x_1$ cũng là nghiệm. Thì với mỗi $i$:

$$
x_1 - x_0 \equiv a_i - a_i = 0 \pmod{n_i}
$$

Vậy $n_i \mid (x_1 - x_0)$ với mọi $i$. Vì $n_1, \ldots, n_k$ đôi một nguyên tố cùng nhau, tích $N = n_1 \cdots n_k$ cũng chia $(x_1 - x_0)$:

$$
N \mid (x_1 - x_0), \quad \text{tức } x_1 \equiv x_0 \pmod N
$$

$\blacksquare$

> [!note] Remark A1.4 — Tại sao cần đôi một nguyên tố cùng nhau?
> Điều kiện $\gcd(n_i, n_j) = 1$ với $i \neq j$ là thiết yếu cho tính duy nhất. Ví dụ hệ $x \equiv 1 \pmod 4$, $x \equiv 3 \pmod 6$ vô nghiệm (vì $x \equiv 1 \pmod 4$ lẻ, nhưng $x \equiv 3 \pmod 6$ cũng lẻ — nhưng không tương thích: $\gcd(4,6) = 2$, và $1 \not\equiv 3 \pmod 2$).

---

## Phần III — Chứng Minh Qua Đẳng Cấu Vành

Đây là cách nhìn đại số, thống nhất hơn.

### Phép Ánh Xạ

> [!definition] Definition A1.5 — Ánh Xạ CRT
> Định nghĩa ánh xạ:
>
> $$
> \Phi : \mathbb{Z}/N\mathbb{Z} \longrightarrow \mathbb{Z}/n_1\mathbb{Z} \times \mathbb{Z}/n_2\mathbb{Z} \times \cdots \times \mathbb{Z}/n_k\mathbb{Z}
> $$
>
> $$
> \Phi([x]_N) = ([x]_{n_1},\ [x]_{n_2},\ \ldots,\ [x]_{n_k})
> $$

> [!theorem] Theorem A1.6 — $\Phi$ là Đẳng Cấu Vành
> $\Phi$ là đẳng cấu (isomorphism) của vành:
>
> $$
> \mathbb{Z}/N\mathbb{Z} \cong \mathbb{Z}/n_1\mathbb{Z} \times \mathbb{Z}/n_2\mathbb{Z} \times \cdots \times \mathbb{Z}/n_k\mathbb{Z}
> $$

**Chứng minh.**

**$\Phi$ là đồng cấu vành:** Rõ ràng vì phép cộng và nhân modulo tương thích.

**$\Phi$ đơn (injective):** Với $\Phi([x]_N) = (0, 0, \ldots, 0)$, ta có $n_i \mid x$ với mọi $i$. Vì $n_i$ đôi một nguyên tố cùng nhau, $N = n_1 \cdots n_k \mid x$, tức $[x]_N = 0$.

**$\Phi$ toàn (surjective):** Với mọi $(a_1, \ldots, a_k)$, nghiệm $x_0 = \sum a_i M_i y_i$ xây dựng ở Phần I cho $\Phi([x_0]_N) = (a_1, \ldots, a_k)$.

Vì $|\mathbb{Z}/N\mathbb{Z}| = N = n_1 \cdots n_k = |\mathbb{Z}/n_1\mathbb{Z} \times \cdots \times \mathbb{Z}/n_k\mathbb{Z}|$ và $\Phi$ đơn, $\Phi$ cũng toàn (do tập hữu hạn). $\blacksquare$

> [!note] Remark A1.7 — Ý nghĩa đẳng cấu
> Đẳng cấu $\Phi$ cho phép tính toán modulo $N$ bằng cách tính song song modulo các $n_i$ nhỏ hơn — cơ sở của nhiều giải thuật số học hiệu quả.

---

## Ví Dụ Tính Toán Đầy Đủ

> [!example] Example A1.8 — Hệ 3 đồng dư
> Giải hệ:
>
> $$
> \begin{cases}
> x \equiv 2 \pmod{3} \\
> x \equiv 3 \pmod{5} \\
> x \equiv 2 \pmod{7}
> \end{cases}
> $$

**Bước 1:** $N = 3 \times 5 \times 7 = 105$.

**Bước 2:** Tính $M_i$:
- $M_1 = 105/3 = 35$
- $M_2 = 105/5 = 21$
- $M_3 = 105/7 = 15$

**Bước 3:** Tính $y_i = M_i^{-1} \pmod{n_i}$:
- $y_1$: $35 y_1 \equiv 1 \pmod 3$. Vì $35 \equiv 2 \pmod 3$, cần $2 y_1 \equiv 1 \pmod 3$, suy ra $y_1 \equiv 2 \pmod 3$.
- $y_2$: $21 y_2 \equiv 1 \pmod 5$. Vì $21 \equiv 1 \pmod 5$, suy ra $y_2 \equiv 1 \pmod 5$.
- $y_3$: $15 y_3 \equiv 1 \pmod 7$. Vì $15 \equiv 1 \pmod 7$, suy ra $y_3 \equiv 1 \pmod 7$.

**Bước 4:** Tính nghiệm:

$$
x_0 = 2 \times 35 \times 2 + 3 \times 21 \times 1 + 2 \times 15 \times 1
$$

$$
= 140 + 63 + 30 = 233
$$

**Bước 5:** Rút gọn modulo $N = 105$: $233 = 2 \times 105 + 23$, nên $x_0 \equiv 23 \pmod{105}$.

**Kiểm tra:** $23 = 7 \times 3 + 2$ nên $23 \equiv 2 \pmod 3$ ✓, $23 = 4 \times 5 + 3$ nên $23 \equiv 3 \pmod 5$ ✓, $23 = 3 \times 7 + 2$ nên $23 \equiv 2 \pmod 7$ ✓.

> [!example] Example A1.9 — Bài Toán Tôn Tử (Thế Kỷ III)
> *"Có một số vật. Ba người chia, dư 2. Năm người chia, dư 3. Bảy người chia, dư 2. Hỏi ít nhất bao nhiêu vật?"*
>
> Đây chính là Example A1.8: $x \equiv 2 \pmod 3$, $x \equiv 3 \pmod 5$, $x \equiv 2 \pmod 7$.
>
> Đáp án: $x = 23$.

---

## Trường Hợp Tổng Quát: $\gcd(n_i, n_j) \neq 1$

Khi các $n_i$ không đôi một nguyên tố cùng nhau, hệ có thể vô nghiệm hoặc có nhiều nghiệm theo chu kỳ khác $N$.

> [!theorem] Theorem A1.10 — Điều Kiện Tương Thích
> Hệ $x \equiv a_i \pmod{n_i}$ ($i = 1, \ldots, k$) có nghiệm khi và chỉ khi với mọi cặp $i, j$:
>
> $$
> \gcd(n_i, n_j) \mid (a_i - a_j)
> $$

**Chứng minh (trường hợp $k=2$).** Nghiệm tồn tại $\iff$ $a_1 + n_1 t = a_2 + n_2 s$ có nghiệm $(s, t)$ nguyên $\iff$ $n_1 t - n_2 s = a_2 - a_1$ có nghiệm $\iff$ $\gcd(n_1, n_2) \mid (a_2 - a_1)$ (theo bài 04). $\blacksquare$

---

## SageMath

```python
from sage.all import CRT, xgcd, gcd

# Cài đặt CRT từ đầu (minh họa công thức)
def crt_manual(residues, moduli):
    """
    Giải hệ x ≡ residues[i] (mod moduli[i]).
    Giả sử moduli đôi một nguyên tố cùng nhau.
    Trả về (x0, N) với x0 là nghiệm nhỏ nhất không âm.
    """
    N = 1
    for m in moduli:
        N *= m

    x0 = 0
    for a_i, n_i in zip(residues, moduli):
        M_i = N // n_i
        # Tính nghịch đảo M_i mod n_i bằng Extended Euclidean
        _, y_i, _ = xgcd(M_i, n_i)
        y_i = y_i % n_i  # Đảm bảo dương
        x0 += a_i * M_i * y_i

    return x0 % N, N

# Ví dụ A1.8
residues = [2, 3, 2]
moduli   = [3, 5, 7]
x0, N = crt_manual(residues, moduli)
print(f"CRT solution: x ≡ {x0} (mod {N})")

# Kiểm tra
for a, m in zip(residues, moduli):
    print(f"  {x0} mod {m} = {x0 % m} (expected {a}) {'✓' if x0 % m == a else '✗'}")

# SageMath tích hợp CRT
x_sage = CRT(residues, moduli)
print(f"SageMath CRT: {x_sage}")

# Bài toán phức tạp hơn
residues2 = [1, 4, 9, 16]
moduli2 = [5, 7, 11, 13]
x2, N2 = crt_manual(residues2, moduli2)
print(f"\nCRT: x ≡ {x2} (mod {N2})")

# Kiểm tra điều kiện tương thích khi gcd ≠ 1
def check_compatibility(residues, moduli):
    """Kiểm tra hệ có nghiệm không (điều kiện tương thích)."""
    k = len(moduli)
    for i in range(k):
        for j in range(i+1, k):
            g = gcd(moduli[i], moduli[j])
            if (residues[i] - residues[j]) % g != 0:
                return False, (i, j)
    return True, None

# Ví dụ hệ không tương thích
r_bad = [0, 1]  # x ≡ 0 (mod 4), x ≡ 1 (mod 6)
m_bad = [4, 6]
compat, pair = check_compatibility(r_bad, m_bad)
print(f"\nx ≡ 0 (mod 4), x ≡ 1 (mod 6): compatible = {compat}")
g = gcd(4, 6)
print(f"  gcd(4,6) = {g}, 0-1 = -1, {g} | -1? {'yes' if (-1) % g == 0 else 'no'}")

# Đẳng cấu vành: minh họa Phi
def phi_map(x, moduli):
    """Ánh xạ Z/NZ -> Z/n1Z x ... x Z/nkZ."""
    return tuple(x % m for m in moduli)

N_ex = 105
print(f"\nPhi: Z/{N_ex}Z -> Z/3Z x Z/5Z x Z/7Z")
# Kiểm tra Phi là đơn trên một vài phần tử
seen = set()
for x in range(N_ex):
    img = phi_map(x, [3, 5, 7])
    if img in seen:
        print(f"COLLISION at x={x}!")
    seen.add(img)
print(f"Phi là đơn (injective): {len(seen) == N_ex}")
```

---

## Tóm Tắt

**Định Lý CRT** phát biểu: với $n_1, \ldots, n_k$ đôi một nguyên tố cùng nhau, $N = \prod n_i$, hệ đồng dư $x \equiv a_i \pmod{n_i}$ có nghiệm **duy nhất modulo $N$**.

**Công thức constructive:**

$$
x_0 = \sum_{i=1}^k a_i M_i y_i \pmod N, \qquad M_i = \frac{N}{n_i},\quad y_i = M_i^{-1} \pmod{n_i}
$$

**Chứng minh duy nhất:** Nếu $x_1, x_2$ là hai nghiệm thì $n_i \mid (x_1 - x_2)$ với mọi $i$, và vì các $n_i$ đôi một nguyên tố cùng nhau, $N \mid (x_1 - x_2)$.

**Đẳng cấu vành:** Ánh xạ $\Phi : \mathbb{Z}/N\mathbb{Z} \to \prod \mathbb{Z}/n_i\mathbb{Z}$, $x \mapsto (x \bmod n_1, \ldots, x \bmod n_k)$ là đẳng cấu vành — cách nhìn đại số thống nhất, mở rộng tự nhiên sang các vành tổng quát hơn.
