---
title: "12. Primitive Root modulo n Tổng Quát"
type: theory
tags: [math, number-theory, lesson-12]
aliases: [Primitive Root General, Primitive Root mod n]
created: 2026-05-15
---

> **Prerequisites**: [[10-multiplicative-order|10. Bậc Nhân Tử]], [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]]
> **Objectives**:
> - Phân loại đầy đủ $n$ có primitive root: $n = 1, 2, 4, p^k, 2p^k$
> - Chứng minh tồn tại primitive root modulo $p^k$ (nâng lên từ mod $p$)
> - Chứng minh không tồn tại primitive root modulo $2^k$ với $k \geq 3$
> - Hiểu cấu trúc $(\mathbb{Z}/2^k\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$

---

## Motivation / Intuition

Bài 11 đã giải quyết: mọi số nguyên tố $p$ đều có primitive root. Câu hỏi tiếp theo tự nhiên: modulus tổng quát $n$ thì sao?

Câu trả lời **không phải lúc nào cũng có**. Ví dụ: $n = 8$.

Các phần tử của $(\mathbb{Z}/8\mathbb{Z})^* = \{1, 3, 5, 7\}$:
- $3^2 = 9 \equiv 1$, $5^2 = 25 \equiv 1$, $7^2 = 49 \equiv 1 \pmod 8$.
- Mọi phần tử đều có bậc $\leq 2$, trong khi $\varphi(8) = 4$. Không có primitive root!

Tại sao? Vì mọi số lẻ đều thỏa $a^2 \equiv 1 \pmod 8$. Nhóm $(\mathbb{Z}/8\mathbb{Z})^*$ **không cyclic** — nó đẳng cấu với $\mathbb{Z}/2 \times \mathbb{Z}/2$, không có generator.

Bài này phân loại chính xác khi nào $(\mathbb{Z}/n\mathbb{Z})^*$ cyclic — tức khi nào primitive root tồn tại.

---

## Phân Loại $n$ Có Primitive Root

> [!theorem] Theorem 12.1 — Phân Loại Đầy Đủ (Classification Theorem)
> Tồn tại primitive root modulo $n$ khi và chỉ khi:
>
> $$
> n \in \{1, 2, 4\} \cup \{p^k : p \text{ nguyên tố lẻ}, k \geq 1\} \cup \{2p^k : p \text{ nguyên tố lẻ}, k \geq 1\}
> $$

Ta sẽ chứng minh từng trường hợp.

---

## Trường Hợp Đơn Giản

**$n = 1$**: $\varphi(1) = 1$, nhóm tầm thường $\{0\}$, primitive root là $0$ (hoặc $1$ theo quy ước). ✓

**$n = 2$**: $(\mathbb{Z}/2\mathbb{Z})^* = \{1\}$, $\varphi(2) = 1$. Primitive root là $1$. ✓

**$n = 4$**: $(\mathbb{Z}/4\mathbb{Z})^* = \{1, 3\}$, $\varphi(4) = 2$. $\text{ord}_4(3) = 2 = \varphi(4)$. Primitive root là $3$. ✓

---

## Tồn Tại Primitive Root Modulo $p^k$ (p Lẻ)

### Bước 1: Nâng từ mod $p$ lên mod $p^2$

> [!theorem] Theorem 12.2 — Primitive Root tồn tại mod $p^2$
> Nếu $p$ là số nguyên tố lẻ và $g$ là primitive root mod $p$, thì hoặc $g$ hoặc $g + p$ là primitive root mod $p^2$.

**Proof.** Gọi $d = \text{ord}_{p^2}(g)$. Ta cần chứng minh $d = \varphi(p^2) = p(p-1)$.

**Bước a:** $d \mid \varphi(p^2) = p(p-1)$, nên $d \mid p(p-1)$.

**Bước b:** Vì $g^d \equiv 1 \pmod{p^2}$, nên $g^d \equiv 1 \pmod{p}$, suy ra $(p-1) \mid d$.

Vậy $(p-1) \mid d$ và $d \mid p(p-1)$, nên $d \in \{p-1, p(p-1)\}$.

Nếu $d = p(p-1)$, ta xong.

Nếu $d = p - 1$: ta có $g^{p-1} \equiv 1 \pmod{p^2}$. Xét $g' = g + p$. Khai triển:

$$
(g')^{p-1} = (g + p)^{p-1} = g^{p-1} + (p-1)g^{p-2} \cdot p + \binom{p-1}{2}g^{p-3}p^2 + \cdots
$$

Modulo $p^2$, chỉ giữ hai số hạng đầu:

$$
(g')^{p-1} \equiv g^{p-1} + (p-1)g^{p-2} \cdot p \equiv 1 + (p-1)g^{p-2} \cdot p \pmod{p^2}
$$

Nếu $(p-1)g^{p-2} \cdot p \not\equiv 0 \pmod{p^2}$, tức $(p-1)g^{p-2} \not\equiv 0 \pmod{p}$: vì $p \nmid (p-1)$ và $p \nmid g$ (do $g$ là primitive root mod $p$), nên $(g')^{p-1} \not\equiv 1 \pmod{p^2}$. Do đó $\text{ord}_{p^2}(g') \neq p-1$, buộc phải $= p(p-1)$.

Kết luận: hoặc $g$ hoặc $g' = g + p$ là primitive root mod $p^2$. $\blacksquare$

### Bước 2: Nâng từ mod $p^2$ lên mod $p^k$

> [!theorem] Theorem 12.3 — Primitive Root tồn tại mod $p^k$ với mọi $k$
> Nếu $g$ là primitive root mod $p^2$, thì $g$ là primitive root mod $p^k$ với mọi $k \geq 1$.

**Proof (bằng quy nạp).** Giả thiết $g$ là primitive root mod $p^k$, nghĩa là $\text{ord}_{p^k}(g) = \varphi(p^k) = p^{k-1}(p-1)$.

Đặt $d = \text{ord}_{p^{k+1}}(g)$. Tương tự như trên: $(p-1) \mid d$ và $d \mid p^k(p-1)$, nên $d = p^j(p-1)$ với $j \in \{0, 1, \ldots, k\}$.

**Khẳng định:** $g^{p^{k-1}(p-1)} \not\equiv 1 \pmod{p^{k+1}}$.

Thực vậy, có thể chứng minh bằng quy nạp rằng nếu $g$ là primitive root mod $p^2$, thì $g^{p^{k-1}(p-1)} = 1 + p^k \cdot t$ với $p \nmid t$. Chi tiết kỹ thuật dùng khai triển nhị thức và nâng bậc $p$-adic (Hensel lifting).

Từ khẳng định: $d \nmid p^{k-1}(p-1)$, suy ra $d = p^k(p-1) = \varphi(p^{k+1})$. $\blacksquare$

> [!corollary] Corollary 12.4
> Với $p$ nguyên tố lẻ và $k \geq 1$, nhóm $(\mathbb{Z}/p^k\mathbb{Z})^*$ là cyclic bậc $\varphi(p^k) = p^{k-1}(p-1)$.

---

## Trường Hợp $n = 2p^k$

> [!theorem] Theorem 12.5 — Primitive Root tồn tại mod $2p^k$
> Với $p$ nguyên tố lẻ và $k \geq 1$, tồn tại primitive root modulo $2p^k$.

**Proof.** Ta có đẳng cấu (CRT, vì $\gcd(2, p^k) = 1$):

$$
(\mathbb{Z}/2p^k\mathbb{Z})^* \cong (\mathbb{Z}/2\mathbb{Z})^* \times (\mathbb{Z}/p^k\mathbb{Z})^*
$$

Vì $(\mathbb{Z}/2\mathbb{Z})^* = \{1\}$ là nhóm tầm thường (bậc $1$), còn $(\mathbb{Z}/p^k\mathbb{Z})^*$ cyclic bậc $p^{k-1}(p-1)$, nên:

$$
(\mathbb{Z}/2p^k\mathbb{Z})^* \cong \mathbb{Z}/p^{k-1}(p-1)
$$

là cyclic. Vậy tồn tại primitive root mod $2p^k$.

**Xây dựng tường minh:** Nếu $g$ là primitive root mod $p^k$, thì nếu $g$ lẻ, $g$ cũng là primitive root mod $2p^k$; nếu $g$ chẵn, $g + p^k$ là primitive root mod $2p^k$ (vì $g + p^k \equiv g \pmod{p^k}$ và $g + p^k$ lẻ). $\blacksquare$

---

## Không Có Primitive Root Modulo $2^k$ với $k \geq 3$

> [!theorem] Theorem 12.6 — Không Có Primitive Root mod $8$
> Với mọi số lẻ $a$: $a^2 \equiv 1 \pmod 8$.

**Proof.** Mọi số lẻ có dạng $a = 2m + 1$. Thì $a^2 = 4m^2 + 4m + 1 = 4m(m+1) + 1$. Vì $m(m+1)$ chẵn (tích hai số liên tiếp), $a^2 \equiv 1 \pmod 8$. $\blacksquare$

Vì $\varphi(8) = 4$ nhưng mọi phần tử có bậc $\leq 2$, không có primitive root mod $8$.

> [!theorem] Theorem 12.7 — Cấu Trúc $(\mathbb{Z}/2^k\mathbb{Z})^*$ với $k \geq 3$
> Với $k \geq 3$:
>
> $$
> (\mathbb{Z}/2^k\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}
> $$
>
> Nhóm này **không cyclic** (và không có primitive root).

**Proof.** Ta cần tìm hai phần tử sinh ra nhóm với tích bậc đúng bằng $2 \cdot 2^{k-2} = 2^{k-1} = \varphi(2^k)$.

**Phần tử $-1$:** $(-1)^2 = 1 \pmod{2^k}$, nên $\text{ord}_{2^k}(-1) = 2$.

**Phần tử $5$:** Ta chứng minh $\text{ord}_{2^k}(5) = 2^{k-2}$.

Viết $5 = 1 + 4 = 1 + 2^2$. Khai triển nhị thức:

$$
5^{2^j} = (1 + 4)^{2^j} = 1 + 2^j \cdot 4 + \binom{2^j}{2} \cdot 16 + \cdots \equiv 1 + 2^{j+2} \pmod{2^{j+3}}
$$

Cụ thể hơn (chứng minh quy nạp): $5^{2^j} \equiv 1 + 2^{j+2} \pmod{2^{j+3}}$ với $j \geq 0$.

Từ đó suy ra:
- $5^{2^{k-2}} \equiv 1 + 2^k \equiv 1 \pmod{2^k}$.
- $5^{2^{k-3}} \equiv 1 + 2^{k-1} \not\equiv 1 \pmod{2^k}$ (vì $2^{k-1} \not\equiv 0 \pmod{2^k}$).

Vậy $\text{ord}_{2^k}(5) = 2^{k-2}$.

**Hai phần tử $-1$ và $5$ sinh ra toàn nhóm:** $\gcd(2, 2^{k-2}) = 2$ (không phải $1$), nhưng $\langle -1 \rangle \cap \langle 5 \rangle = \{1\}$ vì $\langle 5 \rangle$ chỉ gồm phần tử $\equiv 1 \pmod 4$ (vì $5 \equiv 1 \pmod 4$) còn $-1 \equiv 3 \pmod 4$. Và $|\langle -1 \rangle| \cdot |\langle 5 \rangle| = 2 \cdot 2^{k-2} = \varphi(2^k)$. Vậy $(\mathbb{Z}/2^k\mathbb{Z})^* = \langle -1 \rangle \times \langle 5 \rangle \cong \mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$. $\blacksquare$

> [!example] Example 12.8 — Cấu trúc $(\mathbb{Z}/16\mathbb{Z})^*$
>
> $2^k = 16$, $k = 4$. $\varphi(16) = 8$. $(\mathbb{Z}/16\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/4$.
>
> $-1 \equiv 15 \pmod{16}$, $\text{ord}_{16}(15) = 2$.
> $5$, $\text{ord}_{16}(5)$: $5^2 = 25 \equiv 9$, $5^4 = 625 \equiv 1 \pmod{16}$. Vậy $\text{ord}_{16}(5) = 4 = 2^{4-2}$. ✓
>
> Mọi phần tử của $(\mathbb{Z}/16\mathbb{Z})^*$ viết dưới dạng $15^i \cdot 5^j$ với $i \in \{0,1\}$, $j \in \{0,1,2,3\}$.

> [!note] Remark 12.9 — Tại sao $2^k$ khác $p^k$?
> Với $p$ lẻ: nâng từ mod $p$ lên mod $p^2$ "hoạt động" vì phần dư $\binom{p-1}{1} \cdot g^{p-2} \cdot p$ không chia hết $p$.
>
> Với $p = 2$: $g^{2-1} = g^1 = 1$ (mod $2$), nên dư luôn bằng $0$, phép nâng thất bại. Đó là lý do $2^k$ hành xử khác.

---

## Không Có Primitive Root Modulo Tích Hai Số Nguyên Tố Lẻ

> [!theorem] Theorem 12.10 — Không có Primitive Root khi $n$ có hai thừa số nguyên tố lẻ phân biệt
> Nếu $n = p^a q^b$ với $p \neq q$ là số nguyên tố lẻ phân biệt, thì $(\mathbb{Z}/n\mathbb{Z})^*$ không cyclic.

**Proof.** Theo CRT:

$$
(\mathbb{Z}/n\mathbb{Z})^* \cong (\mathbb{Z}/p^a\mathbb{Z})^* \times (\mathbb{Z}/q^b\mathbb{Z})^*
$$

Bậc tối đa của phần tử bất kỳ trong tích này là $\text{lcm}(\varphi(p^a), \varphi(q^b))$. Vì $\varphi(p^a) = p^{a-1}(p-1)$ và $\varphi(q^b) = q^{b-1}(q-1)$ đều chẵn (cho $p, q$ lẻ), ta có:

$$
\text{lcm}(\varphi(p^a), \varphi(q^b)) < \varphi(p^a)\varphi(q^b) = \varphi(n)
$$

Bậc tối đa của phần tử $< \varphi(n)$, vậy không có primitive root. $\blacksquare$

> [!example] Example 12.11 — $(\mathbb{Z}/15\mathbb{Z})^*$
>
> $15 = 3 \cdot 5$. $(\mathbb{Z}/15\mathbb{Z})^* \cong (\mathbb{Z}/3\mathbb{Z})^* \times (\mathbb{Z}/5\mathbb{Z})^* \cong \mathbb{Z}/2 \times \mathbb{Z}/4$.
>
> $\varphi(15) = 8$. Bậc tối đa: $\text{lcm}(2, 4) = 4 < 8$. Không có primitive root.

---

## Tổng Kết Phân Loại

| $n$ | $(\mathbb{Z}/n\mathbb{Z})^*$ | Cyclic? | Primitive root? |
|-----|------------------------------|---------|----------------|
| $1$ | $\{0\}$ | Có | Có (tầm thường) |
| $2$ | $\mathbb{Z}/1$ | Có | Có |
| $4$ | $\mathbb{Z}/2$ | Có | Có (là $3$) |
| $p^k$ ($p$ lẻ) | $\mathbb{Z}/p^{k-1}(p-1)$ | Có | Có |
| $2p^k$ ($p$ lẻ) | $\mathbb{Z}/p^{k-1}(p-1)$ | Có | Có |
| $8$ | $\mathbb{Z}/2 \times \mathbb{Z}/2$ | Không | Không |
| $2^k$ ($k \geq 3$) | $\mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$ | Không | Không |
| $p^a q^b$ ($p,q$ lẻ) | $\mathbb{Z}/\varphi(p^a) \times \mathbb{Z}/\varphi(q^b)$ | Không | Không |

---

## SageMath Cheatsheet

```python
# Kiểm tra primitive root tồn tại
def has_primitive_root(n):
    """Trả về True nếu n có primitive root"""
    try:
        g = primitive_root(n)
        return True
    except ValueError:
        return False

for n in range(1, 25):
    print(f"n={n}: primitive root tồn tại = {has_primitive_root(n)}")

# Kiểm tra trực tiếp: n có primitive root iff n = 1,2,4,p^k,2p^k
def primitive_root_exists(n):
    if n in [1, 2, 4]:
        return True
    f = factor(n)
    if len(f) == 1:
        p, k = f[0]
        return p % 2 == 1  # p^k với p lẻ
    if len(f) == 2:
        factors = list(f)
        # 2*p^k: một thừa là 2^1, thừa kia là lũy thừa nguyên tố lẻ
        if factors[0][0] == 2 and factors[0][1] == 1:
            return factors[1][0] % 2 == 1
    return False

# Cấu trúc nhóm nhân
for n in [8, 16, 32, 15, 21]:
    G = Integers(n)
    units = [x for x in range(n) if gcd(x, n) == 1]
    max_order = max(Mod(a, n).multiplicative_order() for a in units)
    print(f"n={n}: phi={euler_phi(n)}, max_order={max_order}, cyclic={max_order==euler_phi(n)}")

# Kiểm tra ord_2^k(5) = 2^(k-2)
for k in range(3, 8):
    n = 2^k
    print(f"ord_{n}(5) = {Mod(5, n).multiplicative_order()} = 2^{k-2} = {2^(k-2)}")

# Tìm primitive root mod 2p^k
p, k = 7, 2
n = 2 * p^k
g_pk = primitive_root(p^k)
# Nếu g_pk lẻ, nó cũng là primitive root mod 2p^k
if g_pk % 2 == 1:
    print(f"{g_pk} là primitive root mod {n}")
else:
    g_new = g_pk + p^k
    print(f"{g_new} là primitive root mod {n}")
```

---

## Summary / Key Takeaways

- **Phân loại đầy đủ**: $n$ có primitive root $\iff n \in \{1, 2, 4, p^k, 2p^k\}$ với $p$ nguyên tố lẻ.
- **Với $p^k$ ($p$ lẻ)**: nâng dần từ mod $p$ lên mod $p^2$, rồi đến mod $p^k$ bằng khai triển nhị thức.
- **Với $2^k$ ($k \geq 3$)**: không cyclic, cấu trúc $\mathbb{Z}/2 \times \mathbb{Z}/2^{k-2}$, sinh bởi $-1$ và $5$.
- **Với tích nhiều nguyên tố lẻ**: CRT phân rã thành tích nhóm — bậc tối đa $< \varphi(n)$ nên không có primitive root.
- Bài này chuẩn bị cho bài 13: mô tả đầy đủ cấu trúc $(\mathbb{Z}/n\mathbb{Z})^*$ với mọi $n$.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.10–2.11.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 4.
- Math.uzh.ch lecture notes: *Primitive Roots* (Theorem 2.4 and proof sketch).
