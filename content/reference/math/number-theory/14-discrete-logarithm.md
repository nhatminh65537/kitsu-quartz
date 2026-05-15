---
title: "14. Logarithm Rời Rạc (Discrete Logarithm)"
type: theory
tags: [math, number-theory, lesson-14]
aliases: [Discrete Logarithm, DLP, Baby-step Giant-step, Index]
created: 2026-05-15
---

> **Prerequisites**: [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]], [[13-structure-of-multiplicative-group|13. Cấu Trúc của (Z/nZ)*]]
> **Objectives**:
> - Định nghĩa và tính chất logarithm rời rạc (chỉ số)
> - Hiểu tương tự và khác biệt với logarithm thực
> - Chứng minh và cài đặt thuật toán Baby-step Giant-step (Shanks, 1971)
> - Giải phương trình $x^k \equiv a$ và hệ thống liên quan bằng chỉ số
> - Phác thảo ý tưởng Pohlig-Hellman khi cấu trúc nhóm không cyclic nguyên thủy

---

## Motivation / Intuition

Logarithm thực giải bài toán: cho $b, a > 0$, tìm $x$ với $b^x = a$. Câu trả lời là $x = \log_b a$.

Logarithm rời rạc giải bài toán tương tự nhưng trong số học modulo: cho $g, a, n$ với $g$ primitive root mod $n$, tìm số nguyên $x$ với $g^x \equiv a \pmod n$.

Điều kỳ diệu: **logarithm thực** có công thức $\log_b a = \ln a / \ln b$, rất dễ tính. Nhưng **logarithm rời rạc** không có công thức tường minh hiệu quả — tính nó rất khó khi $n$ lớn. Đây là điểm khác biệt then chốt.

Trong bài này ta nghiên cứu logarithm rời rạc thuần túy từ góc độ số học: tính chất, thuật toán tính khi $n$ vừa phải, và các kỹ thuật tổng quát.

---

## Định Nghĩa và Tồn Tại Duy Nhất

> [!definition] Definition 14.1 — Logarithm Rời Rạc (Discrete Logarithm)
> Cho $p$ là số nguyên tố, $g$ là primitive root mod $p$, và $a \in \{1, 2, \ldots, p-1\}$.
>
> **Logarithm rời rạc** (hay **chỉ số**, discrete logarithm / index) của $a$ theo cơ số $g$ modulo $p$, ký hiệu $\log_g a$ hay $\text{ind}_g(a)$, là số nguyên duy nhất $x$ với $1 \leq x \leq p-1$ sao cho:
>
> $$
> g^x \equiv a \pmod{p}
> $$

**Tại sao tồn tại duy nhất?** Vì $g$ là primitive root, $g^1, g^2, \ldots, g^{p-1}$ liệt kê đủ $\{1, 2, \ldots, p-1\}$ theo thứ tự hoán vị. Suy ra với mỗi $a$, có đúng một $x \in \{1, \ldots, p-1\}$ với $g^x \equiv a$. (Theo Corollary 10.6, $g^i \equiv g^j \iff i \equiv j \pmod{p-1}$.)

> [!note] Remark 14.2 — Quy ước $\text{ind}_g(1) = p-1$ hay $0$?
> Theo định nghĩa trên $x \in \{1, \ldots, p-1\}$, nên $\text{ind}_g(1) = p-1$ (vì $g^{p-1} \equiv 1$). Một số tài liệu quy ước $x \in \{0, 1, \ldots, p-2\}$, khi đó $\text{ind}_g(1) = 0$.
>
> Khi làm tính toán: tốt nhất coi chỉ số sống trong $\mathbb{Z}/(p-1)\mathbb{Z}$.

---

## Tính Chất Của Logarithm Rời Rạc

Logarithm rời rạc thỏa các tính chất tương tự logarithm thực, nhưng hoạt động modulo $p-1$:

> [!theorem] Theorem 14.3 — Tính Chất Logarithm Rời Rạc
> Cho $p$ nguyên tố, $g$ primitive root mod $p$. Với mọi $a, b \in \{1, \ldots, p-1\}$ và $k \in \mathbb{Z}$:
>
> **(i) Tích:** $\text{ind}_g(ab) \equiv \text{ind}_g(a) + \text{ind}_g(b) \pmod{p-1}$
>
> **(ii) Lũy thừa:** $\text{ind}_g(a^k) \equiv k \cdot \text{ind}_g(a) \pmod{p-1}$
>
> **(iii) Nghịch đảo:** $\text{ind}_g(a^{-1}) \equiv -\text{ind}_g(a) \pmod{p-1}$
>
> **(iv) Thay cơ số:** $\text{ind}_g(a) = \text{ind}_g(h) \cdot \text{ind}_h(a) \pmod{p-1}$ nếu $h$ cũng là primitive root

**Proof (i).** Gọi $s = \text{ind}_g(a)$, $t = \text{ind}_g(b)$. Thì:

$$
ab \equiv g^s \cdot g^t = g^{s+t} \pmod{p}
$$

Vì chỉ số xác định modulo $p-1$: $\text{ind}_g(ab) \equiv s + t \pmod{p-1}$. $\blacksquare$

**Proof (ii).** $a^k \equiv (g^s)^k = g^{ks}$, suy ra $\text{ind}_g(a^k) \equiv ks = k \cdot \text{ind}_g(a) \pmod{p-1}$. $\blacksquare$

**So sánh với logarithm thực:**

| Logarithm thực | Logarithm rời rạc |
|---|---|
| $\log_b(ab) = \log_b a + \log_b b$ | $\text{ind}_g(ab) \equiv \text{ind}_g(a) + \text{ind}_g(b) \pmod{p-1}$ |
| $\log_b(a^k) = k \log_b a$ | $\text{ind}_g(a^k) \equiv k \cdot \text{ind}_g(a) \pmod{p-1}$ |
| $\log_b(a)$ liên tục, tính bằng công thức | $\text{ind}_g(a)$ rời rạc, không có công thức hiệu quả |

---

## Ứng Dụng: Giải Phương Trình Bằng Chỉ Số

### Giải $x^k \equiv b \pmod{p}$

Quy về: $k \cdot \text{ind}_g(x) \equiv \text{ind}_g(b) \pmod{p-1}$.

Đây là đồng dư tuyến tính trong $\text{ind}_g(x)$ — giải bằng Theorem 6.x.

> [!example] Example 14.4 — Giải $x^5 \equiv 3 \pmod{11}$
>
> Primitive root mod $11$: $g = 2$.
>
> Bảng chỉ số (từ Example 11.12): $\text{ind}_2(3) = 8$ (vì $2^8 = 256 \equiv 256 - 23\cdot11 = 3$).
>
> Phương trình: $5 \cdot s \equiv 8 \pmod{10}$ với $s = \text{ind}_2(x)$.
>
> $\gcd(5, 10) = 5$, kiểm tra $5 \mid 8$: $8/5$ không nguyên. **Không có nghiệm**.
>
> Ý nghĩa: $3$ không phải lũy thừa bậc $5$ modulo $11$.

> [!example] Example 14.5 — Giải $x^5 \equiv 2 \pmod{11}$
>
> $\text{ind}_2(2) = 1$.
>
> $5s \equiv 1 \pmod{10}$. $\gcd(5,10) = 5$, $5 \nmid 1$. Cũng không có nghiệm!
>
> Thử $x^3 \equiv 2 \pmod{11}$: $\text{ind}_2(2) = 1$. $3s \equiv 1 \pmod{10}$.
>
> $\gcd(3,10) = 1$, nghịch đảo của $3$ mod $10$: $3 \cdot 7 = 21 \equiv 1$. Vậy $s \equiv 7 \pmod{10}$.
>
> $x \equiv 2^7 = 128 \equiv 7 \pmod{11}$. Kiểm tra: $7^3 = 343 \equiv 343 - 31\cdot11 = 2$ ✓.

### Giải hệ phương trình

> [!example] Example 14.6 — Giải $x^3 y^2 \equiv 5 \pmod{13}$, $x^2 y \equiv 6 \pmod{13}$
>
> Primitive root mod $13$: $g = 2$. Đặt $s = \text{ind}_2(x)$, $t = \text{ind}_2(y)$.
>
> $\text{ind}_2(5) = 9$ (vì $2^9 = 512 \equiv 512 - 39\cdot13 = 5$).
> $\text{ind}_2(6) = 9 + 1 = $ ... thực ra ta cần tra bảng: $2^5 = 32 \equiv 6$, nên $\text{ind}_2(6) = 5$.
>
> Hệ tuyến tính modulo $12$:
>
> $$
> \begin{aligned} 3s + 2t &\equiv 9 \pmod{12} \\ 2s + t &\equiv 5 \pmod{12} \end{aligned}
> $$
>
> Từ phương trình 2: $t \equiv 5 - 2s \pmod{12}$.
> Thay vào 1: $3s + 2(5-2s) \equiv 9 \pmod{12}$, tức $3s + 10 - 4s \equiv 9$, tức $-s \equiv -1$, tức $s \equiv 1 \pmod{12}$.
> $t \equiv 5 - 2 = 3 \pmod{12}$.
>
> $x \equiv 2^1 = 2 \pmod{13}$, $y \equiv 2^3 = 8 \pmod{13}$.
> Kiểm tra: $2^3 \cdot 8^2 = 8 \cdot 64 = 512 \equiv 5 \pmod{13}$ ✓; $2^2 \cdot 8 = 4 \cdot 8 = 32 \equiv 6 \pmod{13}$ ✓.

---

## Bài Toán Logarithm Rời Rạc (DLP)

> [!definition] Definition 14.7 — Bài Toán Logarithm Rời Rạc (Discrete Logarithm Problem)
> **Input:** Số nguyên tố $p$, primitive root $g$ mod $p$, phần tử $a \in \{1,\ldots,p-1\}$.
> **Output:** Số nguyên $x$ với $1 \leq x \leq p-1$ sao cho $g^x \equiv a \pmod{p}$.
>
> Bài toán này ký hiệu là **DLP** (Discrete Logarithm Problem).

**Brute-force:** Thử $x = 1, 2, 3, \ldots$ cho đến khi $g^x \equiv a$. Độ phức tạp: $O(p)$ phép tính — quá chậm khi $p$ có hàng trăm chữ số.

**Câu hỏi**: Có thuật toán nào nhanh hơn không?

---

## Thuật Toán Baby-step Giant-step (Shanks 1971)

Đây là thuật toán **meet-in-the-middle** (gặp nhau ở giữa): chia tìm kiếm thành hai nửa, mỗi nửa $O(\sqrt{p})$, lưu một nửa và tìm khớp với nửa kia.

### Ý Tưởng

Viết $x = m \cdot \lceil\sqrt{p}\rceil - j$ với $0 \leq j < \lceil\sqrt{p}\rceil$ và $1 \leq m \leq \lceil\sqrt{p}\rceil$.

Đặt $N = \lceil\sqrt{p-1}\rceil$ (xấp xỉ $\sqrt{p}$). Viết $x = mN - j$ với $0 \leq j < N$ và $0 \leq m < N$ (khi $x$ chạy từ $0$ đến $p-2 < N^2$, mọi $x$ đều biểu diễn được như thế).

Thì $g^x \equiv a \iff g^{mN - j} \equiv a \iff (g^N)^m \equiv a \cdot g^j$.

> [!theorem] Theorem 14.8 — Thuật Toán Baby-step Giant-step (BSGS)
>
> **Input:** Số nguyên tố $p$, primitive root $g$, $a \in \{1,\ldots,p-1\}$.
>
> **Output:** $x$ với $g^x \equiv a \pmod{p}$.
>
> **Thuật toán:**
>
> 1. Đặt $N = \lceil\sqrt{p-1}\rceil$.
>
> 2. **Baby steps:** Tính và lưu vào bảng băm (hash table) tất cả cặp $(a \cdot g^j \bmod p,\ j)$ với $j = 0, 1, \ldots, N-1$.
>
> 3. **Giant steps:** Tính $G = g^N \bmod p$. Với mỗi $m = 1, 2, \ldots, N$:
>    - Tính $G^m \bmod p$.
>    - Tra bảng: nếu $G^m \bmod p$ khớp với một giá trị $a \cdot g^j$, thì $x = mN - j \bmod (p-1)$.
>
> **Độ phức tạp:** Thời gian $O(\sqrt{p})$, bộ nhớ $O(\sqrt{p})$.

**Proof of Correctness.** Vì $0 \leq x \leq p-2 < N^2$, mọi $x$ đều viết được thành $x = mN - j$ với $0 \leq j < N$ và $1 \leq m \leq N$.

Nếu $g^x \equiv a$, thì $G^m = g^{mN} \equiv a g^j$ — đây chính xác là điều kiện khớp trong bước 3.

Vì có tối đa $N$ giá trị $j$ (baby steps) và $N$ giá trị $m$ (giant steps), và $N \approx \sqrt{p}$, thuật toán chạy trong $O(\sqrt{p})$ bước. $\blacksquare$

> [!example] Example 14.9 — BSGS: tìm $\log_2(7) \pmod{11}$
>
> $p = 11$, $g = 2$, $a = 7$. $p - 1 = 10$, $N = \lceil\sqrt{10}\rceil = 4$.
>
> **Baby steps** ($a \cdot g^j = 7 \cdot 2^j \bmod 11$):
>
> | $j$ | $2^j$ | $7 \cdot 2^j \bmod 11$ |
> |-----|--------|----------------------|
> | $0$ | $1$ | $7$ |
> | $1$ | $2$ | $3$ |
> | $2$ | $4$ | $6$ |
> | $3$ | $8$ | $1$ |
>
> Bảng: $\{7 \to 0,\ 3 \to 1,\ 6 \to 2,\ 1 \to 3\}$.
>
> **Giant steps** ($G = 2^4 = 16 \equiv 5 \bmod 11$, tính $5^m \bmod 11$):
>
> | $m$ | $5^m \bmod 11$ | Khớp? |
> |-----|----------------|-------|
> | $1$ | $5$ | Không |
> | $2$ | $3$ | $3 \to j=1$. Khớp! |
>
> $m = 2$, $j = 1$: $x = mN - j = 2 \cdot 4 - 1 = 7$.
>
> Kiểm tra: $2^7 = 128 \equiv 128 - 11\cdot11 = 7 \pmod{11}$. ✓
>
> $\log_2 7 \equiv 7 \pmod{10}$.

---

## Pohlig-Hellman: Khai Thác Cấu Trúc Nhóm

Khi $p - 1$ có nhiều thừa số nguyên tố nhỏ, thuật toán Pohlig-Hellman khai thác phân rã CRT để giải DLP hiệu quả hơn.

> [!theorem] Theorem 14.10 — Ý Tưởng Pohlig-Hellman
> Nếu $p - 1 = \prod p_i^{e_i}$ và muốn tìm $x$ với $g^x \equiv a \pmod{p}$:
>
> 1. Với mỗi $i$: giải $x \equiv x_i \pmod{p_i^{e_i}}$ (bài toán DLP trong nhóm con bậc $p_i^{e_i}$).
> 2. Kết hợp các $x_i$ bằng CRT để tìm $x \pmod{p-1}$.
>
> Độ phức tạp: $O\!\left(\sum e_i \left(\sqrt{p_i} + \log p\right)\right)$ — nhanh khi $p-1$ chỉ có ước nhỏ.

**Bài học:** DLP khó khi $p - 1$ có ít nhất một thừa nguyên tố lớn. Đây là lý do tại sao trong thực tế (khi ứng dụng số học), người ta chọn $p$ sao cho $p - 1$ có thừa nguyên tố lớn.

---

## Phương Trình Mũ với Nhiều Ẩn

Logarithm rời rạc cho phép quy đổi nhiều bài toán về hệ tuyến tính.

> [!theorem] Theorem 14.11 — Giải $g^x \equiv a \pmod p$ khi không biết $g$ là primitive root
> Nếu $g$ có bậc $d$ (không nhất thiết là $p-1$), thì $g^x \equiv a$ có nghiệm $\iff a \in \langle g \rangle$, tức $a$ là lũy thừa của $g$.
>
> Kiểm tra: $a^{(p-1)/d} \equiv 1 \pmod p$. Nếu thỏa, thì $a \in \langle g \rangle$ và ta có thể tìm $x$ bằng BSGS trong nhóm con $\langle g \rangle$ bậc $d$ (thay $p$ bởi $d$ trong BSGS).

---

## Logarithm Rời Rạc trong Nhóm Tổng Quát

Bài toán DLP không chỉ định nghĩa cho $(\mathbb{Z}/p\mathbb{Z})^*$. Nó có nghĩa trong mọi nhóm Abel hữu hạn $G$ với generator $g$: cho $a \in G$, tìm $x$ với $g^x = a$.

- Trong $(\mathbb{Z}/n\mathbb{Z}, +)$: "logarithm rời rạc" là phép chia (tầm thường).
- Trong $(\mathbb{Z}/p\mathbb{Z})^*$: là DLP cổ điển.
- Trong nhóm điểm đường cong elliptic: là ECDLP — khó hơn nhiều.

BSGS hoạt động trong mọi nhóm Abel hữu hạn bậc $n$ với độ phức tạp $O(\sqrt{n})$.

---

## SageMath Cheatsheet

```python
# Logarithm rời rạc trong SageMath
p, g, a = 11, 2, 7
x = discrete_log(Mod(a, p), Mod(g, p))
print(x)  # 7 (vì 2^7 = 128 ≡ 7 mod 11)
print(pow(g, x, p))  # kiểm tra

# Baby-step Giant-step tự cài
import math

def bsgs(g, a, p):
    """Tìm x sao cho g^x ≡ a (mod p) với g primitive root mod p"""
    n = p - 1
    N = math.ceil(math.sqrt(n))
    
    # Baby steps: lưu a * g^j mod p -> j
    baby = {}
    power = a % p
    g_inv = pow(g, -1, p)  # g^(-1) mod p
    for j in range(N):
        if power not in baby:
            baby[power] = j
        power = power * g_inv % p  # a * g^(-j) mod p
    # baby[v] = j nghĩa là a * g^(-j) ≡ v (mod p)
    
    # Giant steps: tính g^(N*m) mod p và tìm khớp
    gN = pow(g, N, p)
    giant = 1
    for m in range(1, N + 2):
        giant = giant * gN % p  # g^(N*m) mod p
        if giant in baby:
            j = baby[giant]
            x = (N * m + j) % n  # g^(Nm) = a * g^(-j) => g^(Nm+j) = a
            # Cách khác: x = mN - j nếu dùng ký hiệu khác; kiểm tra
            if pow(g, x, p) == a % p:
                return x
            # Thử x = mN - j
            x2 = (N * m - j) % n
            if pow(g, x2, p) == a % p:
                return x2
    return None

# Kiểm tra
p, g = 11, 2
for a in range(1, p):
    x = bsgs(g, a, p)
    sage_x = int(discrete_log(Mod(a, p), Mod(g, p)))
    assert pow(g, x, p) == a
    print(f"log_{g}({a}) mod {p} = {x}")

# Tính chất logarithm rời rạc
p, g = 13, 2
a, b = 5, 7
ind_a = int(discrete_log(Mod(a, p), Mod(g, p)))
ind_b = int(discrete_log(Mod(b, p), Mod(g, p)))
ind_ab = int(discrete_log(Mod(a * b % p, p), Mod(g, p)))
print(f"ind({a}) + ind({b}) = {ind_a + ind_b} ≡ {(ind_a+ind_b)%(p-1)} (mod {p-1})")
print(f"ind({a}*{b}) = ind({a*b%p}) = {ind_ab}")
assert (ind_a + ind_b) % (p - 1) == ind_ab

# Pohlig-Hellman (ý tưởng: giải từng nhóm con)
def pohlig_hellman_prime(g, a, p, q, e):
    """Giải g^x ≡ a (mod p) modulo q^e (q nguyên tố, q^e | p-1)"""
    n = p - 1
    qe = q^e
    gamma = pow(g, n // q, p)   # có bậc q
    x = 0
    for k in range(e):
        h = pow(a * pow(g, -x, p) % p, n // q^(k+1), p)
        # Giải gamma^d ≡ h (mod p) với d ∈ {0,...,q-1}: brute force vì q nhỏ
        d = 0
        gk = 1
        for i in range(q):
            if gk == h:
                d = i
                break
            gk = gk * gamma % p
        x += d * q^k
    return x % qe

# Pohlig-Hellman đầy đủ
def pohlig_hellman(g, a, p):
    n = p - 1
    remainders, moduli = [], []
    for q, e in factor(n):
        xi = pohlig_hellman_prime(g, a, p, q, e)
        remainders.append(xi)
        moduli.append(q^e)
    return CRT(remainders, moduli)

p = 11  # p-1 = 10 = 2*5, thừa nhỏ
g = 2
for a in range(1, p):
    x = pohlig_hellman(g, a, p)
    assert pow(g, x, p) == a
    print(f"log_{g}({a}) = {x}")
```

---

## Summary / Key Takeaways

- **Logarithm rời rạc** $\text{ind}_g(a)$: số mũ duy nhất $x$ với $g^x \equiv a \pmod p$, sống trong $\mathbb{Z}/(p-1)\mathbb{Z}$.
- **Tính chất**: nhân → cộng, lũy thừa → nhân — hoàn toàn tương tự logarithm thực nhưng cộng modulo $p-1$.
- **Ứng dụng**: quy phương trình $x^k \equiv a$ về đồng dư tuyến tính trên chỉ số.
- **Baby-step Giant-step**: tìm logarithm rời rạc trong $O(\sqrt{p})$ bước và bộ nhớ. Meet-in-the-middle: lưu $\sqrt{p}$ baby steps, duyệt $\sqrt{p}$ giant steps.
- **Pohlig-Hellman**: khai thác phân rã nhóm con theo ước nguyên tố của $p-1$, hiệu quả khi $p-1$ có nhiều ước nhỏ.
- **DLP tổng quát**: định nghĩa được trong mọi nhóm cyclic, BSGS chạy $O(\sqrt{|G|})$.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.9–2.10.
- Shanks, D. *Class number, a theory of factorization and genera*, Proc. Symp. Pure Math. 20 (1971), 415–440.
- Sutherland, A. V. *MIT 18.783 Lecture Notes 10: Generic algorithms for the discrete logarithm problem* (2019).
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 4.
