---
title: "02. Thuật Toán Euclid Mở Rộng"
type: foundation
tags: [math, number-theory, lesson-02]
aliases: [Extended Euclidean Algorithm, Bezout Identity]
created: 2026-05-15
---

> **Prerequisites**: [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]]
> **Objectives**:
> - Hiểu và chứng minh Bézout's Identity
> - Thực hiện thuật toán Euclid mở rộng để tìm nghiệm Bézout
> - Tính nghịch đảo modular bằng Extended Euclidean Algorithm
> - Nhận biết khi nào phương trình $ax \equiv c \pmod{n}$ có nghiệm (mở đầu cho bài 06)

---

## Motivation / Intuition

Bài trước, thuật toán Euclid cho ta $\gcd(a, b)$ một cách hiệu quả. Nhưng Corollary 1.10 khẳng định còn nhiều hơn: luôn tồn tại $m, n \in \mathbb{Z}$ sao cho $ma + nb = \gcd(a, b)$. Câu hỏi tự nhiên là: **làm thế nào để tìm $m$ và $n$ đó?**

Câu trả lời là **thuật toán Euclid mở rộng** (Extended Euclidean Algorithm — viết tắt: XGCD), có cùng độ phức tạp $O(\log b)$ với thuật toán gốc.

Tại sao quan trọng? Khi $\gcd(a, n) = 1$, hệ số Bézout cho ta $ma + kn = 1$, tức $ma \equiv 1 \pmod{n}$ — đây chính là **nghịch đảo modular** của $a$. Khái niệm này là nền tảng cho mọi phép chia trong số học modular.

---

## Biểu Diễn Bézout (Bézout Representation)

### Định lý

> [!theorem] Theorem 2.1 — Bézout's Identity (đầy đủ)
> Cho $a, b \in \mathbb{Z}$ không đồng thời bằng $0$. Đặt $d = \gcd(a, b)$. Khi đó:
>
> **(i)** Tồn tại $m, n \in \mathbb{Z}$ sao cho $ma + nb = d$.
>
> **(ii)** Tập tất cả các giá trị của $ma + nb$ khi $m, n$ chạy trên $\mathbb{Z}$ chính là $\{ kd \mid k \in \mathbb{Z} \}$, tức là tập các bội nguyên của $d$.
>
> **(iii)** Đặc biệt, $ma + nb = 1$ có nghiệm nguyên khi và chỉ khi $\gcd(a, b) = 1$.

**Proof.**
Phần (i) đã chứng minh trong Theorem 1.9 (GCD là tổ hợp tuyến tính nhỏ nhất dương).

Phần (ii): Mọi $ma + nb$ đều chia hết cho $d$ (vì $d \mid a$ và $d \mid b$, theo Theorem 1.3(iii)), nên $ma + nb \in \{ kd \}$. Ngược lại, với $k \in \mathbb{Z}$, ta có $kd = k(m_0 a + n_0 b) = (km_0)a + (kn_0)b$ là một tổ hợp tuyến tính.

Phần (iii) là trường hợp đặc biệt của (ii) với $d = 1$. $\blacksquare$

> [!note] Remark 2.2 — Nghiệm Bézout không duy nhất
> Nếu $(m_0, n_0)$ là một nghiệm Bézout (tức $m_0 a + n_0 b = d$) thì toàn bộ nghiệm là:
>
> $$
> m = m_0 + \frac{b}{d} \cdot t, \qquad n = n_0 - \frac{a}{d} \cdot t, \qquad t \in \mathbb{Z}
> $$
>
> Dễ kiểm tra: $(m_0 + \tfrac{b}{d}t)a + (n_0 - \tfrac{a}{d}t)b = m_0 a + n_0 b = d$. Đây là họ nghiệm đầy đủ.

---

## Thuật Toán Euclid Mở Rộng

Ý tưởng: chạy thuật toán Euclid và **truy ngược** (back-substitution) để biểu diễn $\gcd$ qua $a$ và $b$.

### Phương pháp truy ngược (Back-substitution)

> [!example] Example 2.3 — Tìm nghiệm Bézout cho $\gcd(252, 105) = 21$
> Từ thuật toán Euclid:
>
> $$
> \begin{aligned}
> 252 &= 2 \cdot 105 + 42 \quad \Rightarrow \quad 42 = 252 - 2 \cdot 105 \\
> 105 &= 2 \cdot 42 + 21 \quad \Rightarrow \quad 21 = 105 - 2 \cdot 42 \\
> 42 &= 2 \cdot 21 + 0
> \end{aligned}
> $$
>
> Truy ngược:
>
> $$
> \begin{aligned}
> 21 &= 105 - 2 \cdot 42 \\
>    &= 105 - 2 \cdot (252 - 2 \cdot 105) \\
>    &= 105 - 2 \cdot 252 + 4 \cdot 105 \\
>    &= (-2) \cdot 252 + 5 \cdot 105
> \end{aligned}
> $$
>
> Vậy $m = -2$, $n = 5$, kiểm tra: $(-2)(252) + 5(105) = -504 + 525 = 21$. ✓

Phương pháp truy ngược hoạt động nhưng dễ nhầm lẫn khi nhiều bước. Ta có thuật toán ma trận hiệu quả hơn.

### Thuật toán ma trận (Matrix form)

> [!definition] Algorithm 2.4 — Extended Euclidean Algorithm (dạng ma trận)
> Khởi tạo:
>
> $$
> (r_0, s_0, t_0) = (a, 1, 0), \qquad (r_1, s_1, t_1) = (b, 0, 1)
> $$
>
> Bất biến: tại mỗi bước $i$, ta có $r_i = s_i \cdot a + t_i \cdot b$.
>
> Lặp: Tính $q_i = \lfloor r_{i-1} / r_i \rfloor$ và:
>
> $$
> (r_{i+1},\, s_{i+1},\, t_{i+1}) = (r_{i-1} - q_i r_i,\; s_{i-1} - q_i s_i,\; t_{i-1} - q_i t_i)
> $$
>
> Dừng khi $r_{i+1} = 0$. Khi đó $\gcd(a, b) = r_i$, $m = s_i$, $n = t_i$.

**Bất biến duy trì:** Giả sử $r_{i-1} = s_{i-1} a + t_{i-1} b$ và $r_i = s_i a + t_i b$ đều đúng. Thì:

$$
r_{i+1} = r_{i-1} - q_i r_i = (s_{i-1} - q_i s_i)a + (t_{i-1} - q_i t_i)b = s_{i+1}a + t_{i+1}b
$$

Quy nạp đảm bảo bất biến đúng ở mọi bước.

> [!example] Example 2.5 — XGCD cho $\gcd(1071, 462)$
> Ta lập bảng (các cột: $r$, $s$, $t$, $q$):
>
> | $i$ | $r_i$ | $s_i$ | $t_i$ | $q_i$ |
> |-----|--------|--------|--------|--------|
> | 0   | 1071   | 1      | 0      | —      |
> | 1   | 462    | 0      | 1      | —      |
> | 2   | 147    | 1      | -2     | 2      |
> | 3   | 21     | -3     | 7      | 3      |
> | 4   | 0      | 22     | -51    | 7      |
>
> Tính chi tiết hàng $i=2$: $q = \lfloor 1071/462 \rfloor = 2$, $r = 1071 - 2 \cdot 462 = 147$, $s = 1 - 2 \cdot 0 = 1$, $t = 0 - 2 \cdot 1 = -2$.
>
> Tính hàng $i=3$: $q = \lfloor 462/147 \rfloor = 3$, $r = 462 - 3 \cdot 147 = 21$, $s = 0 - 3 \cdot 1 = -3$, $t = 1 - 3 \cdot (-2) = 7$.
>
> Tính hàng $i=4$: $q = \lfloor 147/21 \rfloor = 7$, $r = 147 - 7 \cdot 21 = 0$ → **dừng**.
>
> Kết quả: $\gcd(1071, 462) = 21$, và $(-3)(1071) + 7(462) = -3213 + 3234 = 21$. ✓

---

## Nghịch Đảo Modular (Modular Inverse)

### Định nghĩa

> [!definition] Definition 2.6 — Nghịch đảo modular
> Cho $a, n \in \mathbb{Z}$ với $n > 1$. Phần tử **nghịch đảo modular** của $a$ modulo $n$, ký hiệu $a^{-1} \pmod{n}$, là số nguyên $x \in \{0, 1, \ldots, n-1\}$ thỏa mãn:
>
> $$
> ax \equiv 1 \pmod{n}
> $$
>
> (tức là $n \mid (ax - 1)$).

> [!theorem] Theorem 2.7 — Điều kiện tồn tại nghịch đảo modular
> Nghịch đảo modular $a^{-1} \pmod{n}$ **tồn tại** khi và chỉ khi $\gcd(a, n) = 1$.
>
> Khi tồn tại, nghịch đảo là **duy nhất** trong $\{0, 1, \ldots, n-1\}$.

**Proof.**

*Tồn tại:* $ax \equiv 1 \pmod{n}$ có nghĩa $ax - 1 = kn$ với $k \in \mathbb{Z}$, tức $ax + (-k)n = 1$. Theo Bézout's Identity, phương trình $ax + yn = 1$ có nghiệm nguyên khi và chỉ khi $\gcd(a, n) = 1$.

*Duy nhất:* Nếu $ax_1 \equiv 1$ và $ax_2 \equiv 1 \pmod{n}$, thì $a(x_1 - x_2) \equiv 0 \pmod{n}$. Vì $\gcd(a, n) = 1$, suy ra $x_1 \equiv x_2 \pmod{n}$ (sẽ chứng minh kỹ trong bài 06). $\blacksquare$

### Tính nghịch đảo bằng XGCD

**Thuật toán:** Để tính $a^{-1} \pmod{n}$ với $\gcd(a, n) = 1$:
1. Chạy XGCD trên $(a, n)$: tìm $m, k$ với $ma + kn = 1$.
2. Vậy $ma \equiv 1 \pmod{n}$, tức $a^{-1} \equiv m \pmod{n}$.
3. Chuẩn hóa: nếu $m < 0$, thay bằng $m + n$ (hoặc $m \bmod n$).

> [!example] Example 2.8 — Tính $7^{-1} \pmod{31}$
> Chạy XGCD trên $(7, 31)$:
>
> | $i$ | $r_i$ | $s_i$ | $t_i$ | $q_i$ |
> |-----|--------|--------|--------|--------|
> | 0   | 7      | 1      | 0      | —      |
> | 1   | 31     | 0      | 1      | —      |
>
> Vì $7 < 31$, ta trao đổi: chạy XGCD trên $(31, 7)$:
>
> | $i$ | $r_i$ | $s_i$ | $t_i$ | $q_i$ |
> |-----|--------|--------|--------|--------|
> | 0   | 31     | 1      | 0      | —      |
> | 1   | 7      | 0      | 1      | —      |
> | 2   | 3      | 1      | -4     | 4      |
> | 3   | 1      | -2     | 9      | 2      |
> | 4   | 0      | 7      | -31    | 3      |
>
> Kết quả: $\gcd(31, 7) = 1$, và $(-2)(31) + 9(7) = -62 + 63 = 1$.
>
> Vậy $9 \cdot 7 \equiv 1 \pmod{31}$, tức $7^{-1} \equiv 9 \pmod{31}$.
>
> Kiểm tra: $7 \times 9 = 63 = 2 \times 31 + 1 \equiv 1 \pmod{31}$. ✓

> [!example] Example 2.9 — Nghịch đảo không tồn tại: $6^{-1} \pmod{9}$
> $\gcd(6, 9) = 3 \neq 1$, nên $6$ không có nghịch đảo modulo $9$.
>
> Điều này hợp lý: $6x \equiv 1 \pmod{9}$ nghĩa là $6x = 9k + 1$, nhưng vế trái chia hết $3$ trong khi vế phải $\equiv 1 \pmod{3}$ — vô lý.

---

## Bổ Đề Euclid (Euclid's Lemma)

Từ XGCD ta rút ra một hệ quả quan trọng sẽ dùng nhiều lần:

> [!theorem] Theorem 2.10 — Bổ đề Euclid (Euclid's Lemma)
> Nếu $a \mid bc$ và $\gcd(a, b) = 1$, thì $a \mid c$.

**Proof.**
Vì $\gcd(a, b) = 1$, tồn tại $m, n \in \mathbb{Z}$ với $ma + nb = 1$. Nhân hai vế với $c$:

$$
mac + nbc = c
$$

Ta có $a \mid mac$ (hiển nhiên) và $a \mid nbc$ (vì $a \mid bc$). Do đó $a \mid (mac + nbc) = c$. $\blacksquare$

> [!corollary] Corollary 2.11
> Nếu $p$ là số nguyên tố và $p \mid ab$, thì $p \mid a$ hoặc $p \mid b$.

**Proof.** Nếu $p \nmid a$ thì $\gcd(p, a) = 1$ (vì ước duy nhất của $p$ là $1$ và $p$). Áp dụng Euclid's Lemma: $p \mid b$. $\blacksquare$

Đây là bổ đề chìa khóa để chứng minh tính duy nhất trong Định Lý Cơ Bản Số Học (xem bài 03).

> [!theorem] Theorem 2.12 — Mở rộng Bổ đề Euclid
> Nếu $\gcd(a, b) = 1$ và $a \mid c$, $b \mid c$, thì $ab \mid c$.

**Proof.**
Viết $c = ka$ với $k \in \mathbb{Z}$. Vì $b \mid c = ka$ và $\gcd(a, b) = 1$, theo Theorem 2.10, $b \mid k$. Viết $k = \ell b$, thì $c = \ell ab$, tức $ab \mid c$. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Extended GCD: trả về (g, m, n) với m*a + n*b = g
g, m, n = xgcd(1071, 462)
print(g, m, n)          # 21 -3 7
print(m*1071 + n*462)   # 21

# Nghịch đảo modular
inverse_mod(7, 31)      # = 9
inverse_mod(9, 31)      # = 7  (đối xứng)

# Kiểm tra: không tồn tại khi gcd != 1
try:
    inverse_mod(6, 9)
except Exception as e:
    print(e)             # ZeroDivisionError hoặc tương tự

# Tính tất cả các phần tử có nghịch đảo mod n
n = 12
units = [a for a in range(1, n) if gcd(a, n) == 1]
print(units)            # [1, 5, 7, 11]
print(len(units))       # phi(12) = 4

# Minh họa Euclid's Lemma
a, b, c = 5, 3, 45
print(f"gcd(5,3)={gcd(a,b)}, 5|45: {c % a == 0}, 3|45: {c % b == 0}")
```

---

## Summary / Key Takeaways

- **Bézout's Identity**: $\gcd(a, b) = ma + nb$ với $m, n \in \mathbb{Z}$. Tập giá trị của $ma + nb$ là đúng tập bội của $\gcd(a, b)$.
- **Họ nghiệm Bézout**: nếu $(m_0, n_0)$ là một nghiệm, toàn bộ nghiệm là $m_0 + \tfrac{b}{d}t$, $n_0 - \tfrac{a}{d}t$.
- **XGCD**: mở rộng thuật toán Euclid để tính đồng thời GCD và hệ số Bézout — phức tạp $O(\log b)$.
- **Nghịch đảo modular**: $a^{-1} \pmod{n}$ tồn tại và duy nhất khi và chỉ khi $\gcd(a, n) = 1$; tính bằng XGCD.
- **Bổ đề Euclid**: $\gcd(a, b) = 1$ và $a \mid bc$ thì $a \mid c$ — hệ quả trực tiếp từ Bézout.
- Corollary quan trọng: $p$ nguyên tố và $p \mid ab$ thì $p \mid a$ hoặc $p \mid b$.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §1.1–1.2.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §2.10–2.11.
- Cohen, H. *A Course in Computational Algebraic Number Theory*, §1.3 (phân tích XGCD hiệu quả).
