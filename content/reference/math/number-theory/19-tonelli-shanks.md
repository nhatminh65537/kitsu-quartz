---
title: "19. Căn Bậc Hai Modulo p — Thuật Toán Tonelli-Shanks"
type: application
tags: [math, number-theory, lesson-19]
aliases: [Tonelli-Shanks, Modular Square Root, Square Root Algorithm]
created: 2026-05-15
---

> **Prerequisites**: [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]], [[10-multiplicative-order|10. Bậc Nhân Tử]], [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]]
> **Objectives**:
> - Giải quyết bài toán: tìm $x$ với $x^2 \equiv a \pmod{p}$ khi $a \in QR_p$
> - Trường hợp đơn giản $p \equiv 3 \pmod 4$: công thức tường minh
> - Phân tích tại sao $p \equiv 1 \pmod 4$ khó hơn — không có công thức đơn giản
> - Chứng minh thuật toán Tonelli-Shanks: ý tưởng, bất biến vòng lặp, chứng minh đúng đắn
> - Phân tích độ phức tạp và triển khai đầy đủ

---

## Motivation / Intuition

Ta đã biết khi nào $a$ có căn bậc hai modulo $p$ (Bài 15–16): đúng khi $\left(\frac{a}{p}\right) = 1$. Bài này trả lời câu hỏi tiếp theo: **làm thế nào tính căn bậc hai đó?**

Trên $\mathbb{R}$, $\sqrt{a}$ tính được bằng Newton's method hay phân tích. Modulo $p$, không có "hàm liên tục" hay giải tích. Ta cần thuật toán số học.

**Trường hợp dễ** ($p \equiv 3 \pmod 4$): Có công thức đóng $x = a^{(p+1)/4}$.

**Trường hợp khó** ($p \equiv 1 \pmod 4$): $p - 1$ chia hết $4$, cấu trúc phức tạp hơn. Thuật toán **Tonelli-Shanks** (A. Tonelli, 1891; D. Shanks, 1973) giải quyết trường hợp này bằng cách khai thác cấu trúc 2-Sylow của $(\mathbb{Z}/p\mathbb{Z})^*$.

Bài này nặng về kỹ thuật nhưng ý tưởng cốt lõi rất đẹp: **nâng dần giải** — bắt đầu từ một "gần đúng" và cải thiện từng bước, tương tự Newton's method nhưng trong số học modular.

---

## Trường Hợp Đơn Giản: $p \equiv 3 \pmod 4$

### Theorem

> [!theorem] Theorem 19.1 — Căn Bậc Hai Khi $p \equiv 3 \pmod{4}$
> Cho $p$ là số nguyên tố lẻ với $p \equiv 3 \pmod 4$, và $a \in QR_p$. Thì:
>
> $$
> x = a^{(p+1)/4} \pmod{p}
> $$
>
> là một căn bậc hai của $a$ modulo $p$.

**Proof.**

$(p+1)/4$ là số nguyên vì $p \equiv 3 \pmod 4$ kéo theo $4 \mid p+1$.

Ta kiểm tra $x^2 \equiv a$:

$$
x^2 = a^{(p+1)/2} = a^{(p-1)/2} \cdot a
$$

Vì $a \in QR_p$: Tiêu Chuẩn Euler cho $a^{(p-1)/2} \equiv 1 \pmod p$.

$$
x^2 \equiv 1 \cdot a = a \pmod p. \quad \blacksquare
$$

> [!example] Example 19.2 — Căn Bậc Hai Với $p \equiv 3 \pmod 4$
>
> **$p = 7$, $a = 2$**: $7 \equiv 3 \pmod 4$. $\left(\frac{2}{7}\right) = 1$ (vì $3^2 = 9 \equiv 2$).
>
> $x = 2^{(7+1)/4} = 2^2 = 4 \pmod 7$.
>
> Kiểm tra: $4^2 = 16 \equiv 2 \pmod 7$. ✓
>
> Nghiệm kia: $7 - 4 = 3$. Kiểm tra: $3^2 = 9 \equiv 2 \pmod 7$. ✓
>
> ---
>
> **$p = 11$, $a = 3$**: $11 \equiv 3 \pmod 4$. $x = 3^{(11+1)/4} = 3^3 = 27 \equiv 5 \pmod{11}$.
>
> Kiểm tra: $5^2 = 25 \equiv 3 \pmod{11}$. ✓
>
> ---
>
> **$p = 19$, $a = 7$**: $x = 7^{(19+1)/4} = 7^5 \pmod{19}$.
>
> $7^2 = 49 \equiv 11$, $7^4 \equiv 11^2 = 121 \equiv 7$, $7^5 \equiv 7 \times 7 = 49 \equiv 11 \pmod{19}$.
>
> Kiểm tra: $11^2 = 121 = 6 \times 19 + 7 \equiv 7$. ✓

> [!note] Remark 19.3 — Tại Sao $p \equiv 3 \pmod 4$ Dễ?
> Với $p \equiv 3 \pmod 4$: $(p-1)/2$ lẻ, nên $(\mathbb{Z}/p\mathbb{Z})^*$ có cấu trúc 2-Sylow đơn giản. Hàm bình phương $\phi(x) = x^2$ có "đường đi ngắn" từ $a$ đến căn bậc hai.
>
> Với $p \equiv 1 \pmod 4$: $(p-1)/2$ chẵn, đường đi dài hơn, cần thuật toán tinh tế hơn.

---

## Trường Hợp $p \equiv 5 \pmod 8$

> [!note] Remark 19.4 — Trường Hợp Trung Gian
> Khi $p \equiv 5 \pmod 8$: $p - 1 = 2^s \cdot Q$ với $s = 2$ ($Q$ lẻ). Có công thức:
>
> $$
> x = a^{(p+3)/8} \pmod p \quad \text{(nếu } a^{(p-1)/4} \equiv 1 \pmod p \text{)}
> $$
>
> hoặc
>
> $$
> x = 2a \cdot (4a)^{(p-5)/8} \pmod p \quad \text{(nếu } a^{(p-1)/4} \equiv -1 \pmod p \text{)}
> $$
>
> Đây là đặc biệt của Tonelli-Shanks với $s = 2$. Ta bỏ qua và đi thẳng vào trường hợp tổng quát.

---

## Phân Tích Cấu Trúc: Tại Sao $p \equiv 1 \pmod 4$ Khó?

Giả sử $p \equiv 1 \pmod 4$. Viết $p - 1 = 2^s \cdot Q$ với $Q$ lẻ và $s \geq 2$.

Từ Tiêu Chuẩn Euler, $a \in QR_p$ khi $a^{(p-1)/2} \equiv 1$, tức $a^{2^{s-1} Q} \equiv 1$.

Thử $x = a^{(Q+1)/2}$ (số nguyên vì $Q$ lẻ nên $Q + 1$ chẵn):

$$
x^2 = a^{Q+1} = a^Q \cdot a
$$

Nếu $a^Q \equiv 1$: thì $x^2 \equiv a$. ✓ Xong.

Nhưng nếu $a^Q \not\equiv 1$? Ta biết $(a^Q)^{2^s} = a^{2^s Q} = a^{p-1} \equiv 1$ (Fermat), nên $a^Q$ là một phần tử trong **nhóm con 2-Sylow** $C_{2^s}$ của $(\mathbb{Z}/p\mathbb{Z})^*$. Đặt $t = a^Q$: ta có $t^{2^s} \equiv 1$ nhưng $t \not\equiv 1$. Cần "điều chỉnh" để đạt $t \equiv 1$.

**Ý tưởng Tonelli-Shanks**: Dùng một phần tử QNR $z$ (tức $z^{(p-1)/2} \equiv -1$), đặt $c = z^Q$. Thì $c$ có bậc $2^s$ trong nhóm con 2-Sylow.

Ta duy trì **bất biến vòng lặp**: bộ $(r, t, m)$ thỏa:

- $r^2 \equiv ta \pmod p$
- $t^{2^{m-1}} \equiv 1 \pmod p$ (tức bậc của $t$ chia $2^{m-1}$)
- $c$ có bậc $2^{m-1}$ trong $(\mathbb{Z}/p\mathbb{Z})^*$... (chính xác hơn: bậc của $c$ là $2^{s-1}$, và ta cập nhật $c$ và $m$ song song)

Mỗi bước vòng lặp giảm $m$ đi $1$ — bảo đảm kết thúc sau tối đa $s - 1$ bước. Khi $m = 1$: $t^1 \equiv 1$, suy ra $r^2 \equiv a$. Tìm được $r$.

---

## Thuật Toán Tonelli-Shanks

### Theorem

> [!theorem] Theorem 19.5 — Thuật Toán Tonelli-Shanks
> Cho $p$ nguyên tố lẻ, $a \in QR_p$, $p \neq 2$. Thuật toán sau tìm $x$ với $x^2 \equiv a \pmod p$:
>
> **Khởi tạo:**
>
> 1. Viết $p - 1 = 2^s \cdot Q$ với $Q$ lẻ.
> 2. Nếu $s = 1$ (tức $p \equiv 3 \pmod 4$): trả về $a^{(p+1)/4} \bmod p$. (Xong.)
> 3. Tìm QNR $z$: chọn $z$ sao cho $\left(\frac{z}{p}\right) = -1$.
> 4. Khởi tạo:
>
> $$
> M \leftarrow s, \quad c \leftarrow z^Q \bmod p, \quad t \leftarrow a^Q \bmod p, \quad R \leftarrow a^{(Q+1)/2} \bmod p
> $$
>
> **Vòng lặp:** Lặp:
>
> 1. Nếu $t \equiv 1$: trả về $R$.
> 2. Tìm $i$ nhỏ nhất, $1 \leq i < M$, sao cho $t^{2^i} \equiv 1 \pmod p$.
> 3. Đặt $b \leftarrow c^{2^{M-i-1}} \bmod p$.
> 4. Cập nhật:
>
> $$
> M \leftarrow i, \quad c \leftarrow b^2 \bmod p, \quad t \leftarrow tb^2 \bmod p, \quad R \leftarrow Rb \bmod p
> $$
>
> 5. Lặp lại.

**Chứng minh Đúng Đắn.**

Ta chứng minh **bất biến vòng lặp**: trước mỗi bước lặp, bộ $(M, c, t, R)$ thỏa:

**(I)** $R^2 \equiv ta \pmod p$

**(II)** $t^{2^{M-1}} \equiv 1 \pmod p$ (bậc của $t$ chia $2^{M-1}$)

**(III)** $c$ có bậc $2^{M-1}$ trong $(\mathbb{Z}/p\mathbb{Z})^*$

**Kiểm tra khởi tạo:**

- $R^2 = a^{Q+1} = a^Q \cdot a = ta$. ✓ (I)
- $t^{2^{s-1}} = (a^Q)^{2^{s-1}} = a^{2^{s-1}Q} = a^{(p-1)/2} \equiv 1$ (vì $a \in QR_p$). ✓ (II) với $M = s$.
- $c = z^Q$. Bậc của $c$: $c^{2^{s-1}} = z^{2^{s-1}Q} = z^{(p-1)/2} \equiv -1$ (vì $z$ là QNR). Nên $c^{2^{s-1}} \neq 1$, nhưng $c^{2^s} = (c^{2^{s-1}})^2 \equiv 1$. Vậy bậc $c$ là $2^s$... Nhưng ban đầu $M = s$, nên bậc $c = 2^s = 2^{M}$... Chú ý: ban đầu bất biến (III) cần bậc $c$ là $2^{M-1} = 2^{s-1}$. Thực ra có nhiều cách phát biểu bất biến; phiên bản thường dùng: **bậc của $c$ là $2^M$ và bậc của $t$ chia $2^{M-1}$** (với $M$ bắt đầu bằng $s$). Để tránh nhầm lẫn, ta kiểm tra một bước.

**Kiểm tra một bước lặp:**

Giả sử bất biến đúng với $(M, c, t, R)$. Gọi $i$ là số nhỏ nhất với $t^{2^i} \equiv 1$.

Đặt $b = c^{2^{M-i-1}}$. Thì bậc $b = 2^{M} / 2^{M-i-1} = 2^{i+1}$.

Cập nhật: $M' = i$, $c' = b^2$, $t' = tb^2$, $R' = Rb$.

- **(I)** $R'^2 = R^2 b^2 = ta \cdot b^2 = t'a$. ✓
- **(II)** $t'^{2^{M'-1}} = (tb^2)^{2^{i-1}}$. Ta có $t^{2^{i-1}} \not\equiv 1$ (vì $i$ là số nhỏ nhất) và $b^{2^i} \equiv 1$ suy ra $(b^2)^{2^{i-1}} \equiv 1$. Nhưng $t^{2^i} \equiv 1$. Cần $(tb^2)^{2^{i-1}} \equiv 1$:
  - $b^2$ có bậc $2^i$ (vì bậc $b = 2^{i+1}$), nên $(b^2)^{2^{i-1}} = b^{2^i} \equiv 1$.
  - Vậy $(tb^2)^{2^{i-1}} = t^{2^{i-1}} \cdot (b^2)^{2^{i-1}}$.
  
  Thực ra ta cần $(tb^2)^{2^{i-1}} \equiv 1$. Biết $t^{2^i} \equiv 1$ (từ cách chọn $i$), nên $t^{2^{i-1}} \in \{\pm 1\}$. Nếu $t^{2^{i-1}} \equiv 1$: thì $i$ không phải số nhỏ nhất — mâu thuẫn. Vậy $t^{2^{i-1}} \equiv -1$. Còn $(b^2)^{2^{i-1}} = b^{2^i}$: bậc $b$ là $2^{i+1}$, nên $b^{2^i}$ là phần tử bậc $2$ duy nhất $= -1$.
  
  Suy ra: $(tb^2)^{2^{i-1}} = (-1)(-1) = 1$. ✓

**Kết thúc:** Mỗi bước giảm $M$ ít nhất 1 (từ $M$ xuống $M' = i < M$). Ban đầu $M = s$, nên sau tối đa $s - 1$ bước: $M = 1$.

Khi $M = 1$: điều kiện $t \equiv 1$ cần kiểm tra là $t^{2^0} = t \equiv 1$. Vòng lặp trả về $R$ và $R^2 = ta = a$ — đúng. $\blacksquare$

**Độ phức tạp:** Mỗi vòng lặp giảm $M$ ít nhất 1, vòng lặp chạy tối đa $s - 1 \leq \log_2(p-1)$ lần. Mỗi bước dùng $O(\log p)$ phép nhân (bình phương liên tiếp). Tổng: $O(\log^2 p)$ — rất nhanh.

---

## Ví Dụ Đầy Đủ

> [!example] Example 19.6 — Tìm $\sqrt{5} \pmod{41}$
>
> $p = 41$, $a = 5$. Kiểm tra: $\left(\frac{5}{41}\right) = ?$ ($41 \equiv 1 \pmod 4$, nên cần QR Law.)
>
> $41 \equiv 1 \pmod 5$, nên $\left(\frac{5}{41}\right) = \left(\frac{41}{5}\right) = \left(\frac{1}{5}\right) = 1$. ✓ ($5 \in QR_{41}$.)
>
> **Khởi tạo:**
>
> $p - 1 = 40 = 2^3 \times 5$. Vậy $s = 3$, $Q = 5$.
>
> Tìm QNR: thử $z = 7$. $7^{20} \bmod 41$: $7^2 = 49 \equiv 8$, $7^4 \equiv 64 \equiv 23$, $7^8 \equiv 23^2 = 529 \equiv 529 - 12\times41 = 37 \equiv -4$, $7^{16} \equiv 16$, $7^{20} = 7^{16} \times 7^4 \equiv 16 \times 23 = 368 \equiv 368 - 8 \times 41 = 40 \equiv -1$. ✓ $z = 7$ là QNR.
>
> $c = z^Q = 7^5 \bmod 41$: $7^5 = 7^4 \times 7 \equiv 23 \times 7 = 161 = 3 \times 41 + 38 \equiv 38 \equiv -3$.
>
> $t = a^Q = 5^5 \bmod 41$: $5^2 = 25$, $5^4 \equiv 625 \equiv 625 - 15\times41 = 10$, $5^5 \equiv 50 \equiv 9$.
>
> $R = a^{(Q+1)/2} = 5^3 = 125 \equiv 125 - 3 \times 41 = 2$.
>
> Trạng thái: $(M, c, t, R) = (3, 38, 9, 2)$.
>
> **Vòng lặp 1:**
>
> $t = 9 \not\equiv 1$. Tìm $i$: $t^{2^1} = 9^2 = 81 \equiv 81 - 41 = 40 \equiv -1$. $t^{2^2} = (-1)^2 = 1$. Vậy $i = 2$.
>
> $b = c^{2^{M-i-1}} = 38^{2^{3-2-1}} = 38^{2^0} = 38$.
>
> $c' = b^2 = 38^2 = 1444 \equiv 1444 - 35\times41 = 9$.
> $t' = t \times c' = 9 \times 9 = 81 \equiv 40 \equiv -1$.
> $R' = R \times b = 2 \times 38 = 76 \equiv 76 - 41 = 35$.
> $M' = i = 2$.
>
> Trạng thái: $(M, c, t, R) = (2, 9, 40, 35)$.
>
> **Vòng lặp 2:**
>
> $t = 40 \equiv -1 \not\equiv 1$. Tìm $i$: $t^{2^1} = (-1)^2 = 1$. Vậy $i = 1$.
>
> $b = c^{2^{M-i-1}} = 9^{2^{2-1-1}} = 9^{2^0} = 9$.
>
> $c' = 9^2 = 81 \equiv 40 \equiv -1$. Hmm — $c' = 40$.
> $t' = 40 \times 40 = 1600 \equiv 1600 - 39\times41 = 1$. ✓
> $R' = 35 \times 9 = 315 \equiv 315 - 7\times41 = 28$.
> $M' = i = 1$.
>
> Trạng thái: $(M, c, t, R) = (1, 40, 1, 28)$.
>
> **Vòng lặp 3:**
>
> $t = 1$. Trả về $R = 28$.
>
> **Kiểm tra:** $28^2 = 784 \equiv 784 - 19\times41 = 784 - 779 = 5 \pmod{41}$. ✓
>
> Nghiệm kia: $41 - 28 = 13$. $13^2 = 169 = 4\times41 + 5 \equiv 5$. ✓

> [!example] Example 19.7 — Tìm $\sqrt{2} \pmod{7}$ (trường hợp $p \equiv 3 \pmod 4$)
>
> $p = 7 \equiv 3 \pmod 4$. Dùng Theorem 19.1: $x = 2^{(7+1)/4} = 2^2 = 4$.
>
> $4^2 = 16 \equiv 2 \pmod 7$. ✓

> [!example] Example 19.8 — $p = 113$, $a = 2$
>
> $113 \equiv 1 \pmod 8$ (nên $2 \in QR_{113}$). $p - 1 = 112 = 2^4 \times 7$: $s = 4$, $Q = 7$.
>
> Tìm QNR: $z = 3$? $3^{56} \bmod 113$: tính bình phương liên tiếp... (SageMath: `pow(3, 56, 113) = 112 ≡ -1`). ✓ $z = 3$ là QNR.
>
> $c = 3^7 = 2187 \equiv 2187 - 19\times113 = 2187 - 2147 = 40$.
> $t = 2^7 = 128 \equiv 15$.
> $R = 2^{(7+1)/2} = 2^4 = 16$.
>
> Trạng thái: $(M, c, t, R) = (4, 40, 15, 16)$.
>
> (Chạy tiếp sẽ cho $R = 51$ sau vài bước; kiểm tra: $51^2 = 2601 \equiv 2601 - 23\times113 = 2601 - 2599 = 2$. ✓)

---

## Tìm QNR: Tiền Xử Lý

Thuật toán Tonelli-Shanks cần một QNR $z$ modulo $p$ làm đầu vào. Làm thế nào tìm $z$ nhanh?

> [!theorem] Theorem 19.9 — Tìm QNR Ngẫu Nhiên
> Thử $z = 2, 3, 4, \ldots$ và kiểm tra $\left(\frac{z}{p}\right) = -1$ (bằng Tiêu Chuẩn Euler: $z^{(p-1)/2} \equiv -1$).
>
> Vì có đúng $(p-1)/2$ QNR trong $\{1, \ldots, p-1\}$, xác suất thành công mỗi lần thử là $\geq 1/2$.
>
> **Kỳ vọng số lần thử**: $\leq 2$. Thực tế thường tìm được $z$ trong $2$–$3$ bước.

---

## Trường Hợp Đặc Biệt Và Biến Thể

> [!note] Remark 19.10 — Cipolla's Algorithm
> **Thuật toán Cipolla (1903)**: Một phương pháp thay thế với ý tưởng khác — mở rộng trường $\mathbb{F}_p$ thành $\mathbb{F}_{p^2}$ và dùng cấu trúc Frobenius. Đôi khi nhanh hơn Tonelli-Shanks khi $s$ lớn.

> [!note] Remark 19.11 — Tonelli-Shanks Tổng Quát
> Tonelli-Shanks tổng quát hóa cho:
>
> - **Căn bậc $k$** modulo $p$: tìm $x$ với $x^k \equiv a \pmod p$.
> - **Nhóm cyclic bất kỳ**: BSGS cho phép tính căn trong $O(\sqrt{|G|})$.
> - **Modulo hợp số** $n = pq$: mỗi thừa nguyên tố dùng một lần Tonelli-Shanks, kết hợp bằng CRT.

---

## SageMath Cheatsheet

```python
# Căn bậc hai modulo p: SageMath built-in
p = 41
a = 5
x = Mod(a, p).sqrt()
print(f"sqrt({a}) mod {p} = {x}")
print(f"Kiểm tra: {x^2 == Mod(a, p)}")

# Trường hợp p ≡ 3 (mod 4): công thức tường minh
def sqrt_3mod4(a, p):
    """Căn bậc hai mod p với p ≡ 3 (mod 4)."""
    assert p % 4 == 3
    x = pow(a, (p + 1) // 4, p)
    assert pow(x, 2, p) == a % p
    return x

for p in primes(7, 100):
    if p % 4 == 3:
        for a in range(1, p):
            if legendre_symbol(a, p) == 1:
                x = sqrt_3mod4(a, p)
                assert pow(x, 2, p) == a
print("Công thức p ≡ 3 (mod 4) đúng với tất cả p < 100")

# Triển khai Tonelli-Shanks đầy đủ
def tonelli_shanks(a, p):
    """
    Tìm x với x^2 ≡ a (mod p), p nguyên tố lẻ, a là QR.
    Trả về x (và p-x là nghiệm kia).
    """
    a = a % p
    if a == 0:
        return 0
    assert pow(a, (p - 1) // 2, p) == 1, f"{a} không phải QR mod {p}"

    # Trường hợp đặc biệt: p ≡ 3 (mod 4)
    if p % 4 == 3:
        return pow(a, (p + 1) // 4, p)

    # Phân tích p-1 = 2^s * Q (Q lẻ)
    Q = p - 1
    s = 0
    while Q % 2 == 0:
        Q //= 2
        s += 1

    # Tìm QNR z
    z = 2
    while pow(z, (p - 1) // 2, p) != p - 1:
        z += 1

    # Khởi tạo
    M = s
    c = pow(z, Q, p)
    t = pow(a, Q, p)
    R = pow(a, (Q + 1) // 2, p)

    # Vòng lặp Tonelli-Shanks
    while True:
        if t == 1:
            return R

        # Tìm i nhỏ nhất: t^(2^i) ≡ 1 (mod p)
        temp = t
        i = 0
        while temp != 1:
            temp = temp * temp % p
            i += 1
        assert i < M, "Thuật toán bị lỗi — i phải < M"

        # b = c^(2^(M-i-1)) mod p
        b = pow(c, pow(2, M - i - 1), p)

        # Cập nhật
        M = i
        c = b * b % p
        t = t * c % p
        R = R * b % p

# Kiểm tra toàn diện
import random
random.seed(42)
for p in primes(5, 200):
    for a in range(1, p):
        if legendre_symbol(a, p) == 1:
            x = tonelli_shanks(a, p)
            assert pow(x, 2, p) == a, f"Fail: a={a}, p={p}, x={x}"
print("Tonelli-Shanks chính xác với tất cả p < 200")

# So sánh với SageMath built-in
p = 1000003  # số nguyên tố lớn
random.seed(0)
for _ in range(100):
    a = random.randrange(1, p)
    if legendre_symbol(a, p) == 1:
        x_ts = tonelli_shanks(a, p)
        x_sage = int(Mod(a, p).sqrt())
        # Có thể x_ts và x_sage khác nhau nhưng đều đúng (hai nghiệm)
        assert pow(x_ts, 2, p) == a
        assert pow(x_sage, 2, p) == a
print(f"Tonelli-Shanks đúng với 100 giá trị ngẫu nhiên mod {p}")

# Tính cả hai nghiệm
def sqrt_both(a, p):
    x = tonelli_shanks(a, p)
    return sorted([x, p - x])

p, a = 41, 5
roots = sqrt_both(a, p)
print(f"sqrt({a}) mod {p} = {roots}")
for x in roots:
    assert pow(x, 2, p) == a
```

---

## Summary / Key Takeaways

- **Bài toán**: cho $a \in QR_p$, tìm $x$ với $x^2 \equiv a \pmod p$ — luôn có hai nghiệm $x$ và $p-x$.
- **Trường hợp $p \equiv 3 \pmod 4$**: công thức đơn giản $x = a^{(p+1)/4} \bmod p$.
- **Trường hợp tổng quát (Tonelli-Shanks)**:
  - Phân tích $p - 1 = 2^s Q$ ($Q$ lẻ).
  - Duy trì bất biến $R^2 \equiv ta$ với $t$ có bậc chia $2^{M-1}$.
  - Mỗi bước giảm $M$ nhờ nhân $R$ bởi $b = c^{2^{M-i-1}}$, điều chỉnh để $t \to t' = tb^2$ có bậc nhỏ hơn.
  - Kết thúc khi $t = 1$: lúc đó $R^2 \equiv a$.
- **Số bước**: tối đa $s - 1 \leq \log_2(p-1)$. Độ phức tạp: $O(\log^2 p)$.
- **Tìm QNR**: thử ngẫu nhiên, kỳ vọng $2$ lần thử. Kiểm tra bằng Tiêu Chuẩn Euler.
- **Hai nghiệm**: luôn là $x$ và $p - x$ (modular conjugates).
- Tonelli-Shanks tổng quát cho căn bậc $k$ và trên trường hữu hạn bất kỳ.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.11.
- Tonelli, A. *Bemerkung über die Auflösung quadratischer Congruenzen*, Nachr. Königl. Gesellsch. Wissensch. Göttingen (1891).
- Shanks, D. *Five number-theoretic algorithms*, Proc. 2nd Manitoba Conference on Numerical Mathematics (1973).
- Sutherland, A. V. *MIT 18.783 Lecture Notes* (2019), Lecture 4: Square roots and the Tonelli-Shanks algorithm.
- Wikipedia. *Tonelli-Shanks algorithm*. https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm
