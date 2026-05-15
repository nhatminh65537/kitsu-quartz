---
title: "13. Cấu Trúc của (Z/nZ)*"
type: theory
tags: [math, number-theory, lesson-13]
aliases: [Structure of Multiplicative Group, Z/nZ star]
created: 2026-05-15
---

> **Prerequisites**: [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]], [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]], [[12-primitive-roots-general|12. Primitive Root modulo n Tổng Quát]]
> **Objectives**:
> - Phân rã $(\mathbb{Z}/n\mathbb{Z})^*$ thành tích trực tiếp các nhóm cyclic qua CRT
> - Mô tả đầy đủ cấu trúc $(\mathbb{Z}/n\mathbb{Z})^*$ với mọi $n$
> - Tính bậc tối đa (exponent) của nhóm: số $\lambda(n)$ Carmichael
> - Vận dụng để giải phương trình $x^k \equiv a \pmod{n}$ trong trường hợp tổng quát

---

## Motivation / Intuition

Sau hai bài học về primitive roots, ta đã biết:

- $(\mathbb{Z}/p\mathbb{Z})^*$ cyclic bậc $p-1$ — đơn giản và đẹp.
- $(\mathbb{Z}/p^k\mathbb{Z})^*$ cyclic bậc $p^{k-1}(p-1)$ — vẫn tốt.
- $(\mathbb{Z}/2^k\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$ — không cyclic.
- Tích nhiều nguyên tố: không cyclic, phân rã qua CRT.

Bài này hợp nhất tất cả: dùng **CRT** để phân rã $(\mathbb{Z}/n\mathbb{Z})^*$ thành tích các thành phần đã biết, từ đó có ảnh hoàn chỉnh về cấu trúc nhóm nhân.

Đây là điểm giao thoa tự nhiên với **lý thuyết nhóm Abel hữu hạn**: mọi nhóm Abel hữu hạn đều là tích trực tiếp của các nhóm cyclic.

---

## Phân Rã Qua CRT

> [!theorem] Theorem 13.1 — Phân Rã CRT của $(\mathbb{Z}/n\mathbb{Z})^*$
> Cho $n = p_1^{a_1} p_2^{a_2} \cdots p_r^{a_r}$ (phân tích nguyên tố). Thì:
>
> $$
> (\mathbb{Z}/n\mathbb{Z})^* \cong (\mathbb{Z}/p_1^{a_1}\mathbb{Z})^* \times (\mathbb{Z}/p_2^{a_2}\mathbb{Z})^* \times \cdots \times (\mathbb{Z}/p_r^{a_r}\mathbb{Z})^*
> $$

**Proof.** Đây là tổng quát hóa trực tiếp của CRT (Theorem 7.x): vì các $p_i^{a_i}$ đôi một nguyên tố cùng nhau, ánh xạ $a \mapsto (a \bmod p_1^{a_1}, \ldots, a \bmod p_r^{a_r})$ là đẳng cấu vành từ $\mathbb{Z}/n\mathbb{Z}$ vào tích. Nó gửi đơn vị sang đơn vị, nên hạn chế thành đẳng cấu nhóm trên các nhóm đơn vị. $\blacksquare$

---

## Cấu Trúc Từng Thành Phần

Kết hợp Theorem 13.1 với các kết quả từ bài 12:

> [!theorem] Theorem 13.2 — Cấu Trúc Đầy Đủ của $(\mathbb{Z}/n\mathbb{Z})^*$
>
> Cho $n = 2^{a_0} p_1^{a_1} \cdots p_r^{a_r}$ với $p_i$ là số nguyên tố lẻ phân biệt. Thì:
>
> $$
> (\mathbb{Z}/n\mathbb{Z})^* \cong C_{2^{a_0}} \times \prod_{i=1}^{r} \mathbb{Z}/p_i^{a_i - 1}(p_i - 1)
> $$
>
> trong đó:
>
> $$
> C_{2^{a_0}} = \begin{cases}
> \{0\} & \text{nếu } a_0 = 0 \\
> \mathbb{Z}/1 & \text{nếu } a_0 = 1 \\
> \mathbb{Z}/2 & \text{nếu } a_0 = 2 \\
> \mathbb{Z}/2 \times \mathbb{Z}/2^{a_0 - 2} & \text{nếu } a_0 \geq 3
> \end{cases}
> $$

**Proof.** Áp dụng Theorem 13.1 rồi dùng:
- $(\mathbb{Z}/p_i^{a_i}\mathbb{Z})^* \cong \mathbb{Z}/p_i^{a_i-1}(p_i-1)$ (Theorem 12.3/12.4).
- $(\mathbb{Z}/2^{a_0}\mathbb{Z})^*$ theo Theorem 12.7. $\blacksquare$

> [!example] Example 13.3 — Cấu trúc $(\mathbb{Z}/120\mathbb{Z})^*$
>
> $120 = 2^3 \cdot 3 \cdot 5$.
>
> $$
> (\mathbb{Z}/120\mathbb{Z})^* \cong (\mathbb{Z}/8\mathbb{Z})^* \times (\mathbb{Z}/3\mathbb{Z})^* \times (\mathbb{Z}/5\mathbb{Z})^*
> $$
>
> $$
> \cong (\mathbb{Z}/2 \times \mathbb{Z}/2) \times \mathbb{Z}/2 \times \mathbb{Z}/4
> $$
>
> $$
> \cong \mathbb{Z}/2 \times \mathbb{Z}/2 \times \mathbb{Z}/2 \times \mathbb{Z}/4
> $$
>
> $\varphi(120) = \varphi(8)\varphi(3)\varphi(5) = 4 \cdot 2 \cdot 4 = 32$. ✓ (Tổng bậc: $2 \cdot 2 \cdot 2 \cdot 4 = 32$.)

> [!example] Example 13.4 — Cấu trúc $(\mathbb{Z}/36\mathbb{Z})^*$
>
> $36 = 2^2 \cdot 3^2$.
>
> $$
> (\mathbb{Z}/36\mathbb{Z})^* \cong (\mathbb{Z}/4\mathbb{Z})^* \times (\mathbb{Z}/9\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/6
> $$
>
> $\varphi(36) = 2 \cdot 6 = 12$. Nhóm này có hai thành phần cyclic $\mathbb{Z}/2$ và $\mathbb{Z}/6$. Nó **không** cyclic (vì $\text{lcm}(2, 6) = 6 \neq 12$), nên không có primitive root mod $36$.

---

## Hàm Lambda Carmichael $\lambda(n)$

Biết cấu trúc của $(\mathbb{Z}/n\mathbb{Z})^*$, ta có thể tính **bậc tối đa** (exponent): số $\lambda(n)$ nhỏ nhất sao cho $a^{\lambda(n)} \equiv 1 \pmod{n}$ với **mọi** $a$ nguyên tố cùng nhau với $n$.

> [!definition] Definition 13.5 — Hàm Lambda Carmichael (Carmichael Function)
> $\lambda(n)$ là **bậc tối đa** (exponent) của nhóm $(\mathbb{Z}/n\mathbb{Z})^*$:
>
> $$
> \lambda(n) = \max_{a : \gcd(a,n)=1} \text{ord}_n(a) = \text{lcm của bậc mọi phần tử}
> $$

> [!theorem] Theorem 13.6 — Công Thức $\lambda(n)$
>
> Cho $n = 2^{a_0} p_1^{a_1} \cdots p_r^{a_r}$ với $p_i$ lẻ, phân biệt. Thì:
>
> $$
> \lambda(n) = \text{lcm}\!\left(\lambda(2^{a_0}),\, p_1^{a_1 - 1}(p_1 - 1),\, \ldots,\, p_r^{a_r - 1}(p_r - 1)\right)
> $$
>
> trong đó:
>
> $$
> \lambda(2^{a_0}) = \begin{cases}
> 1 & a_0 \leq 2 \\
> 2^{a_0 - 2} & a_0 \geq 3
> \end{cases}
> $$

**Proof.** Bậc tối đa của tích các nhóm là lcm bậc tối đa của từng nhóm. Với nhóm cyclic $\mathbb{Z}/m$, bậc tối đa là $m$. Với $\mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$, bậc tối đa là $\text{lcm}(2, 2^{k-2}) = 2^{k-2}$. $\blacksquare$

> [!example] Example 13.7 — Tính $\lambda(120)$
>
> $120 = 2^3 \cdot 3 \cdot 5$.
>
> $\lambda(8) = 2$, $\lambda(3) = 2$, $\lambda(5) = 4$.
>
> $\lambda(120) = \text{lcm}(2, 2, 4) = 4$.
>
> Kiểm tra: $a^4 \equiv 1 \pmod{120}$ với mọi $a$ nguyên tố cùng nhau với $120$, và $4$ là số nhỏ nhất có tính chất đó.

> [!note] Remark 13.8 — So sánh $\lambda(n)$ và $\varphi(n)$
> Luôn có $\lambda(n) \mid \varphi(n)$. Khi $(\mathbb{Z}/n\mathbb{Z})^*$ cyclic: $\lambda(n) = \varphi(n)$.
>
> $\lambda(n) < \varphi(n)$ khi nào? Khi nhóm không cyclic: $\lambda(120) = 4 < 32 = \varphi(120)$.

---

## Ứng Dụng: Giải Phương Trình $x^k \equiv a \pmod{n}$

Với $n$ có primitive root $g$, phương trình $x^k \equiv a \pmod{n}$ được quy về phương trình tuyến tính trên chỉ số.

> [!theorem] Theorem 13.9 — Giải $x^k \equiv a \pmod{p}$ dùng Primitive Root
> Cho $p$ nguyên tố, $g$ primitive root mod $p$, $\gcd(a, p) = 1$. Đặt $\text{ind}_g(a) = t$ (tức $g^t \equiv a$). Phương trình $x^k \equiv a \pmod{p}$ có nghiệm khi và chỉ khi:
>
> $$
> \gcd(k, p-1) \mid t
> $$
>
> Khi có nghiệm, số nghiệm trong $\{1, \ldots, p-1\}$ là $d = \gcd(k, p-1)$.

**Proof.** Viết $x = g^s$. Thì $x^k \equiv a \iff g^{ks} \equiv g^t \iff ks \equiv t \pmod{p-1}$. Đây là đồng dư tuyến tính trong $s$: có nghiệm $\iff \gcd(k, p-1) \mid t$, và khi có nghiệm thì có $\gcd(k, p-1)$ nghiệm modulo $p-1$, ứng với $\gcd(k, p-1)$ giá trị $x = g^s$ phân biệt modulo $p$. $\blacksquare$

> [!example] Example 13.10 — Giải $x^3 \equiv 5 \pmod{13}$
>
> $g = 2$ primitive root mod $13$. $p - 1 = 12$. $d = \gcd(3, 12) = 3$.
>
> Tìm $t$: $2^t \equiv 5 \pmod{13}$. Từ bảng: $2^9 = 512 \equiv 512 - 39 \cdot 13 = 5$, nên $t = 9$.
>
> Điều kiện: $\gcd(3, 12) = 3 \mid 9$. ✓ Có nghiệm.
>
> Giải $3s \equiv 9 \pmod{12}$: $s \equiv 3 \pmod 4$, vậy $s \in \{3, 7, 11\}$ trong $\{0, \ldots, 11\}$.
>
> Ba nghiệm: $x = 2^3 = 8$, $2^7 = 128 \equiv 11$, $2^{11} = 2048 \equiv 7 \pmod{13}$.
>
> Kiểm tra: $8^3 = 512 \equiv 512 - 39\cdot13 = 5$ ✓, $11^3 = 1331 \equiv 1331 - 102\cdot13 = 5$ ✓.

---

## Bậc Tối Đa và Định Lý Về Số Phần Tử Bậc Tối Đa

> [!theorem] Theorem 13.11 — Phần Tử Bậc $\lambda(n)$ Luôn Tồn Tại
> Tồn tại $a$ nguyên tố cùng nhau với $n$ sao cho $\text{ord}_n(a) = \lambda(n)$.

**Proof.** Vì $\lambda(n) = \text{lcm}(d_1, d_2, \ldots, d_r)$ là lcm bậc của các thành phần, tồn tại $a_i$ trong mỗi thành phần có bậc $d_i$. Phần tử $a = a_1 a_2 \cdots a_r$ (qua CRT) có bậc $\text{lcm}(d_1, \ldots, d_r) = \lambda(n)$. $\blacksquare$

> [!note] Remark 13.12 — Ý nghĩa của $\lambda(n)$
> $\lambda(n)$ chính xác là số mũ nhỏ nhất sao cho $a^{\lambda(n)} \equiv 1 \pmod n$ với **mọi** $a$ nguyên tố cùng nhau với $n$. Điều này mạnh hơn Euler ($\varphi(n)$) khi $\lambda(n) < \varphi(n)$.

---

## Bảng Tổng Hợp Cấu Trúc

| $n$ | Phân tích | $\varphi(n)$ | $\lambda(n)$ | Cấu trúc $(\mathbb{Z}/n\mathbb{Z})^*$ | Cyclic? |
|-----|-----------|-------------|-------------|---------------------------------------|---------|
| $5$ | $5$ | $4$ | $4$ | $\mathbb{Z}/4$ | ✓ |
| $7$ | $7$ | $6$ | $6$ | $\mathbb{Z}/6$ | ✓ |
| $8$ | $2^3$ | $4$ | $2$ | $\mathbb{Z}/2 \times \mathbb{Z}/2$ | ✗ |
| $9$ | $3^2$ | $6$ | $6$ | $\mathbb{Z}/6$ | ✓ |
| $15$ | $3 \cdot 5$ | $8$ | $4$ | $\mathbb{Z}/2 \times \mathbb{Z}/4$ | ✗ |
| $16$ | $2^4$ | $8$ | $4$ | $\mathbb{Z}/2 \times \mathbb{Z}/4$ | ✗ |
| $24$ | $2^3 \cdot 3$ | $8$ | $2$ | $\mathbb{Z}/2 \times \mathbb{Z}/2 \times \mathbb{Z}/2$ | ✗ |
| $25$ | $5^2$ | $20$ | $20$ | $\mathbb{Z}/20$ | ✓ |
| $36$ | $2^2 \cdot 3^2$ | $12$ | $6$ | $\mathbb{Z}/2 \times \mathbb{Z}/6$ | ✗ |

---

## SageMath Cheatsheet

```python
# Cấu trúc nhóm nhân
n = 120
G = Integers(n)
# Phân tích cấu trúc
for p, e in factor(n):
    pk = p^e
    Gpk = Integers(pk)
    units_pk = [x for x in range(pk) if gcd(x, pk) == 1]
    max_ord = max(Mod(a, pk).multiplicative_order() for a in units_pk)
    print(f"(Z/{pk}Z)*: phi={euler_phi(pk)}, max_ord={max_ord}, cyclic={max_ord==euler_phi(pk)}")

# Hàm lambda Carmichael
def carmichael_lambda(n):
    """Tính lambda(n) = bậc tối đa của (Z/nZ)*"""
    if n == 1:
        return 1
    result = 1
    for p, e in factor(n):
        if p == 2:
            if e <= 2:
                pk_lambda = 1 if e <= 1 else 2
            else:
                pk_lambda = 2^(e-2)
        else:
            pk_lambda = p^(e-1) * (p - 1)
        result = lcm(result, pk_lambda)
    return result

# So sánh phi(n) và lambda(n)
for n in range(1, 50):
    phi = euler_phi(n)
    lam = carmichael_lambda(n)
    units = [a for a in range(1, n) if gcd(a, n) == 1]
    actual_lambda = max((Mod(a, n).multiplicative_order() for a in units), default=1)
    assert lam == actual_lambda, f"Lỗi tại n={n}"
    if lam < phi:
        print(f"n={n}: phi={phi}, lambda={lam} (không cyclic)")

# Giải x^k ≡ a (mod p) dùng primitive root
def solve_power_congruence(k, a, p):
    """Giải x^k ≡ a (mod p) với p nguyên tố"""
    g = primitive_root(p)
    # Tìm t sao cho g^t ≡ a (mod p)
    t = discrete_log(Mod(a, p), Mod(g, p))
    d = gcd(k, p - 1)
    if t % d != 0:
        return []  # Không có nghiệm
    # Giải ks ≡ t (mod p-1)
    # Chia hết d: (k/d)*s ≡ (t/d) (mod (p-1)/d)
    k2, t2, m2 = k // d, t // d, (p - 1) // d
    inv_k2 = pow(k2, -1, m2)  # nghịch đảo mod (p-1)/d
    s0 = (t2 * inv_k2) % m2
    solutions = [pow(g, (s0 + j * m2) % (p - 1), p) for j in range(d)]
    return sorted(set(solutions))

print(solve_power_congruence(3, 5, 13))  # [7, 8, 11]

# Kiểm tra tất cả nghiệm
k, a, p = 3, 5, 13
sols = solve_power_congruence(k, a, p)
for x in sols:
    assert pow(x, k, p) == a % p
print(f"Đã kiểm tra {len(sols)} nghiệm")
```

---

## Summary / Key Takeaways

- **Phân rã CRT**: $(\mathbb{Z}/n\mathbb{Z})^* \cong \prod (\mathbb{Z}/p_i^{a_i}\mathbb{Z})^*$ — chia "to" thành "nhỏ" đã biết.
- **Cấu trúc tổng quát**: mỗi $(\mathbb{Z}/p^k\mathbb{Z})^*$ cyclic (với $p$ lẻ), còn $(\mathbb{Z}/2^k\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$.
- **Hàm Carmichael** $\lambda(n)$: bậc tối đa của $(\mathbb{Z}/n\mathbb{Z})^*$, tính qua lcm. Luôn $\lambda(n) \mid \varphi(n)$.
- **Giải $x^k \equiv a \pmod p$**: quy về đồng dư tuyến tính trên chỉ số, có $\gcd(k, p-1)$ nghiệm khi có nghiệm.
- **Nền tảng ẩn**: toàn bộ bài này là lý thuyết nhóm Abel hữu hạn, nhưng xuất hiện hoàn toàn tự nhiên từ số học.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.10–2.11.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 4–5.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.8.
