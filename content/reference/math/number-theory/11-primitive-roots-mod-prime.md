---
title: "11. Primitive Root modulo Số Nguyên Tố"
type: theory
tags: [math, number-theory, lesson-11]
aliases: [Primitive Root, Generator, Primitive Root mod Prime]
created: 2026-05-15
---

> **Prerequisites**: [[09-euler-phi-and-euler-theorem|09. Hàm Euler φ và Định Lý Euler]], [[10-multiplicative-order|10. Bậc Nhân Tử]]
> **Objectives**:
> - Định nghĩa primitive root và nhận ra ý nghĩa sinh ra toàn nhóm
> - Chứng minh số phần tử bậc $d$ trong $(\mathbb{Z}/p\mathbb{Z})^*$ là $\varphi(d)$ với mỗi $d \mid p-1$
> - Chứng minh tồn tại primitive root modulo mọi số nguyên tố $p$
> - Tính số lượng primitive root: $\varphi(p-1)$
> - Xây dựng và dùng bảng chỉ số (index table) dựa trên primitive root

---

## Motivation / Intuition

Từ bài 10, ta thấy bậc của các phần tử trong $(\mathbb{Z}/7\mathbb{Z})^*$ là $1, 2, 3, 6$ — tất cả đều chia $6 = \varphi(7)$. Nhưng một số phần tử đặc biệt hơn: $3$ và $5$ có bậc **đúng bằng** $6 = \varphi(7)$, nghĩa là dãy $3^1, 3^2, 3^3, 3^4, 3^5, 3^6$ liệt kê ra **tất cả** $6$ phần tử khác không của $\mathbb{Z}/7\mathbb{Z}$:

$$
3^1 \equiv 3, \quad 3^2 \equiv 2, \quad 3^3 \equiv 6, \quad 3^4 \equiv 4, \quad 3^5 \equiv 5, \quad 3^6 \equiv 1 \pmod 7
$$

Phần tử như vậy gọi là **primitive root** (nghiệm nguyên thủy). Câu hỏi: mọi số nguyên tố đều có primitive root không? Câu trả lời — đáng ngạc nhiên và sâu sắc — là **luôn có**.

Ý nghĩa thực chất: $(\mathbb{Z}/p\mathbb{Z})^*$ là nhóm **cyclic** — mọi phần tử đều là lũy thừa của một phần tử duy nhất.

---

## Định Nghĩa

> [!definition] Definition 11.1 — Primitive Root (Nghiệm Nguyên Thủy)
> Cho $p$ là số nguyên tố. Một phần tử $g \in \{1, 2, \ldots, p-1\}$ gọi là **primitive root** (hay **generator**) modulo $p$ nếu:
>
> $$
> \text{ord}_p(g) = p - 1 = \varphi(p)
> $$
>
> Tương đương: dãy $g^1, g^2, \ldots, g^{p-1}$ là hoán vị của $\{1, 2, \ldots, p-1\}$ modulo $p$.

> [!example] Example 11.2 — Primitive roots modulo $11$
>
> $p = 11$, $p - 1 = 10 = 2 \cdot 5$. Bậc của mỗi phần tử:
>
> | $a$ | $\text{ord}_{11}(a)$ | Primitive root? |
> |-----|----------------------|-----------------|
> | $1$ | $1$ | Không |
> | $2$ | $10$ | **Có** |
> | $3$ | $5$ | Không |
> | $4$ | $5$ | Không |
> | $5$ | $5$ | Không |
> | $6$ | $10$ | **Có** |
> | $7$ | $10$ | **Có** |
> | $8$ | $10$ | **Có** |
> | $9$ | $5$ | Không |
> | $10$ | $2$ | Không |
>
> Có $4 = \varphi(10)$ primitive roots modulo $11$.

---

## Bổ Đề Trọng Tâm: Số Nghiệm của $x^d \equiv 1$

Chìa khóa của toàn bộ lý thuyết nằm ở bổ đề sau:

> [!theorem] Lemma 11.3 — Đa Thức Bậc $d$ có Tối Đa $d$ Nghiệm Modulo $p$
> Nếu $p$ là số nguyên tố và $f(x)$ là đa thức hệ số nguyên bậc $d \geq 1$, thì phương trình:
>
> $$
> f(x) \equiv 0 \pmod{p}
> $$
>
> có tối đa $d$ nghiệm trong $\{0, 1, \ldots, p-1\}$.

**Proof.** Tương tự như đa thức thực, nhưng thay $\mathbb{R}$ bởi trường $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$.

Bằng quy nạp theo $d$. Nếu $d = 0$: $f$ là hằng số, hoặc $f \equiv 0$ (vô số nghiệm) hoặc $f \not\equiv 0$ (không có nghiệm). Cho $d \geq 1$.

Nếu $f$ không có nghiệm trong $\mathbb{F}_p$, xong. Nếu $r$ là một nghiệm, chia đa thức:

$$
f(x) = (x - r) q(x) + s
$$

với $q$ bậc $d-1$ và $s$ là hằng số. Thay $x = r$: $0 \equiv f(r) = 0 \cdot q(r) + s \equiv s \pmod{p}$, nên $s \equiv 0$.

Vậy $f(x) \equiv (x-r) q(x) \pmod{p}$. Vì $p$ nguyên tố, $\mathbb{F}_p$ là trường và không có ước không: nếu $f(a) \equiv 0$ thì $(a-r) \equiv 0$ hoặc $q(a) \equiv 0$. Nghĩa là mọi nghiệm của $f$ hoặc bằng $r$ hoặc là nghiệm của $q(x)$ (bậc $d-1$). Theo giả thiết quy nạp, $q$ có tối đa $d-1$ nghiệm. Vậy $f$ có tối đa $d$ nghiệm. $\blacksquare$

> [!corollary] Corollary 11.4
> Với $p$ nguyên tố và $d \mid p-1$, phương trình $x^d \equiv 1 \pmod{p}$ có **đúng** $d$ nghiệm.

**Proof.** Đặt $p - 1 = d \cdot k$. Ta có đẳng thức đa thức:

$$
x^{p-1} - 1 = (x^d - 1)(x^{d(k-1)} + x^{d(k-2)} + \cdots + x^d + 1)
$$

Gọi thừa số thứ hai là $h(x)$, bậc $d(k-1)$.

Bởi Fermat Nhỏ, mọi $a \in \{1, \ldots, p-1\}$ đều là nghiệm của $x^{p-1} - 1$, nên phương trình này có $p-1$ nghiệm trong $\mathbb{F}_p$.

Vì $x^{p-1} - 1 = (x^d - 1) \cdot h(x)$ và $p - 1 = d + d(k-1)$:
- Theo Lemma 11.3: $x^d - 1$ có $\leq d$ nghiệm, $h(x)$ có $\leq d(k-1)$ nghiệm.
- Tổng $\leq d + d(k-1) = p - 1$.
- Nhưng tổng nghiệm phải $= p - 1$.

Vậy bắt buộc $x^d - 1$ có **đúng $d$ nghiệm** và $h(x)$ có đúng $d(k-1)$ nghiệm. $\blacksquare$

---

## Định Lý Tồn Tại Primitive Root

> [!theorem] Theorem 11.5 — Số Phần Tử Bậc $d$ trong $(\mathbb{Z}/p\mathbb{Z})^*$
> Với $p$ nguyên tố và $d \mid p-1$, số phần tử bậc $d$ trong $(\mathbb{Z}/p\mathbb{Z})^*$ là **đúng $\varphi(d)$**.

**Proof.** Gọi $\psi(d)$ = số phần tử bậc $d$ trong $(\mathbb{Z}/p\mathbb{Z})^*$.

**Bước 1:** Từ Corollary 11.4, $x^d \equiv 1 \pmod{p}$ có đúng $d$ nghiệm. Mọi phần tử bậc $d$ là nghiệm của $x^d \equiv 1$, và ngược lại mọi nghiệm của $x^d \equiv 1$ có bậc là ước của $d$ (Theorem 10.4). Phân hoạch $d$ nghiệm đó theo bậc thực của chúng:

$$
d = \sum_{e \mid d} \psi(e)
$$

**Bước 2:** Áp dụng Möbius inversion (sẽ học ở bài 22, tạm chấp nhận):

$$
\sum_{d \mid n} \varphi(d) = n \quad \Longrightarrow \quad \psi(d) = \varphi(d)
$$

Thực ra có thể chứng minh trực tiếp bằng quy nạp: vì $\sum_{e \mid d} \psi(e) = d = \sum_{e \mid d} \varphi(e)$, nếu $\psi(e) = \varphi(e)$ với mọi $e \mid d$, $e < d$, thì $\psi(d) = d - \sum_{e \mid d, e < d} \varphi(e) = \varphi(d)$. $\blacksquare$

> [!corollary] Corollary 11.6 — Tồn Tại Primitive Root modulo $p$
> Với mọi số nguyên tố $p$, tồn tại primitive root modulo $p$.

**Proof.** Theo Theorem 11.5, số phần tử bậc $p-1$ là $\varphi(p-1) \geq 1$. $\blacksquare$

> [!corollary] Corollary 11.7 — $(\mathbb{Z}/p\mathbb{Z})^*$ là Nhóm Cyclic
> Nhóm $(\mathbb{Z}/p\mathbb{Z})^*$ là nhóm **cyclic** (cyclic group) bậc $p-1$. Tức là tồn tại $g$ sao cho:
>
> $$
> (\mathbb{Z}/p\mathbb{Z})^* = \langle g \rangle = \{g^0, g^1, \ldots, g^{p-2}\}
> $$

> [!note] Remark 11.8 — Số lượng primitive root
> Với $p$ nguyên tố, số primitive root modulo $p$ là $\varphi(p-1)$.
>
> Ví dụ: $\varphi(12) = 4$ primitive roots mod $13$; $\varphi(10) = 4$ primitive roots mod $11$; $\varphi(6) = 2$ primitive roots mod $7$.

---

## Xây Dựng Primitive Roots từ Nhau

> [!theorem] Theorem 11.9 — Mọi Primitive Root từ Một Primitive Root
> Nếu $g$ là primitive root modulo $p$, thì tất cả primitive roots modulo $p$ có dạng:
>
> $$
> g^k \quad \text{với } \gcd(k, p-1) = 1, \quad 1 \leq k \leq p-1
> $$

**Proof.** Từ Theorem 10.9: $\text{ord}_p(g^k) = (p-1)/\gcd(k, p-1) = p-1 \iff \gcd(k, p-1) = 1$. $\blacksquare$

> [!example] Example 11.10 — Tìm tất cả primitive roots mod $13$
>
> $p = 13$, $p - 1 = 12$. Kiểm tra $g = 2$: $\text{ord}_{13}(2) = 12$ (primitive root).
>
> Tất cả primitive roots là $2^k$ với $\gcd(k, 12) = 1$, $k \in \{1,2,\ldots,12\}$.
>
> $k \in \{1, 5, 7, 11\}$ (vì $\gcd(k,12)=1$).
>
> $2^1 = 2$, $2^5 = 32 \equiv 6$, $2^7 = 128 \equiv 11$, $2^{11} = 2048 \equiv 7 \pmod{13}$.
>
> Primitive roots mod $13$: $\{2, 6, 7, 11\}$.

---

## Cách Tìm Primitive Root Thực Tế

Không có công thức kín để tìm primitive root. Thuật toán thực tế:

**Thuật toán tìm primitive root mod $p$:**

1. Phân tích $p - 1 = p_1^{e_1} \cdots p_r^{e_r}$.
2. Với mỗi ứng viên $g = 2, 3, 4, \ldots$:
   - Với mỗi thừa nguyên tố $p_i$: tính $g^{(p-1)/p_i} \pmod{p}$.
   - Nếu **tất cả** kết quả $\neq 1$: $g$ là primitive root.
   - Nếu có kết quả $= 1$: thử $g$ tiếp theo.

**Vì sao đúng?** Nếu $\text{ord}_p(g) < p-1$, thì $\text{ord}_p(g) \mid p-1$ và $\text{ord}_p(g) \mid (p-1)/p_i$ với ít nhất một $p_i$, suy ra $g^{(p-1)/p_i} \equiv 1$ với $p_i$ đó.

> [!example] Example 11.11 — Tìm primitive root mod $p = 23$
>
> $p - 1 = 22 = 2 \cdot 11$.
>
> Thử $g = 2$: $(p-1)/2 = 11$, $(p-1)/11 = 2$.
> - $2^{11} = 2048 \equiv 2048 - 89 \cdot 23 = 2048 - 2047 = 1 \pmod{23}$. Vậy $\text{ord}_{23}(2) \mid 11 < 22$. Loại.
>
> Thử $g = 3$:
> - $3^{11} \pmod{23}$: $3^2 = 9$, $3^4 = 81 \equiv 12$, $3^8 \equiv 144 \equiv 6$, $3^{11} = 3^8 \cdot 3^2 \cdot 3 = 6 \cdot 9 \cdot 3 = 162 \equiv 162 - 7 \cdot 23 = 1 \pmod{23}$. Loại.
>
> Thử $g = 5$:
> - $5^{11} \pmod{23}$: $5^2 = 25 \equiv 2$, $5^4 \equiv 4$, $5^8 \equiv 16$, $5^{11} = 5^8 \cdot 5^2 \cdot 5 = 16 \cdot 2 \cdot 5 = 160 \equiv 160 - 6 \cdot 23 = 22 \equiv -1 \not\equiv 1$. ✓
> - $5^2 = 25 \equiv 2 \not\equiv 1$. ✓
>
> Vậy $5$ là primitive root mod $23$.

---

## Bảng Chỉ Số (Discrete Index Table)

Khi đã có primitive root $g$ modulo $p$, ta có thể lập **bảng chỉ số**: với mỗi $a \in \{1, \ldots, p-1\}$, tìm $k$ sao cho $g^k \equiv a \pmod p$. Số $k$ này gọi là **chỉ số** (index) hay **logarithm rời rạc** của $a$ theo cơ số $g$.

Bảng chỉ số là "bảng logarithm" trong số học modulo và được dùng để:
- Nhân → Cộng chỉ số: $\log_g(ab) = \log_g(a) + \log_g(b) \pmod{p-1}$
- Giải phương trình $x^k \equiv a$: $k \cdot \log_g(x) \equiv \log_g(a) \pmod{p-1}$

Sẽ học chi tiết ở bài 14.

> [!example] Example 11.12 — Bảng chỉ số mod $11$ với $g = 2$
>
> | $k$ | $2^k \pmod{11}$ | | $a$ | $\text{ind}_2(a)$ |
> |-----|------------------|-|-----|---------------------|
> | $1$ | $2$ | | $1$ | $10$ (vì $2^{10}\equiv1$) |
> | $2$ | $4$ | | $2$ | $1$ |
> | $3$ | $8$ | | $3$ | $8$ |
> | $4$ | $5$ | | $4$ | $2$ |
> | $5$ | $10$ | | $5$ | $4$ |
> | $6$ | $9$ | | $6$ | $9$ |
> | $7$ | $7$ | | $7$ | $7$ |
> | $8$ | $3$ | | $8$ | $3$ |
> | $9$ | $6$ | | $9$ | $6$ |
> | $10$ | $1$ | | $10$ | $5$ |

---

## SageMath Cheatsheet

```python
# Tìm một primitive root modulo p
p = 23
g = primitive_root(p)
print(f"Primitive root mod {p}: {g}")

# Kiểm tra: liệt kê toàn bộ powers
p = 13
g = 2
powers = [pow(g, k, p) for k in range(1, p)]
print(powers)  # phải là hoán vị của {1,...,12}
print(sorted(powers) == list(range(1, p)))  # True nếu g là primitive root

# Đếm primitive roots
p = 23
count = sum(1 for a in range(1, p) if Mod(a, p).multiplicative_order() == p-1)
print(f"Số primitive roots mod {p}: {count}")  # = phi(p-1) = phi(22) = 10
print(euler_phi(p - 1))  # 10

# Tất cả primitive roots từ một cái
def all_primitive_roots(p):
    g = primitive_root(p)
    return sorted(pow(g, k, p) for k in range(1, p) if gcd(k, p-1) == 1)

print(all_primitive_roots(13))  # [2, 6, 7, 11]

# Bảng chỉ số (discrete index table)
def build_index_table(p, g):
    """Tạo bảng index: ind[a] = k sao cho g^k ≡ a (mod p)"""
    table = {}
    power = 1
    for k in range(1, p):
        power = (power * g) % p
        table[power] = k
    return table

p, g = 11, 2
ind = build_index_table(p, g)
print(ind)

# Dùng bảng chỉ số để nhân: a*b mod p = g^(ind[a]+ind[b]) mod p
a, b = 7, 9
product_direct = (a * b) % p
product_via_index = pow(g, (ind[a] + ind[b]) % (p-1), p)
print(f"{a}*{b} mod {p} = {product_direct} = {product_via_index}")  # phải bằng nhau

# Kiểm tra Corollary 11.4: x^d ≡ 1 có đúng d nghiệm
p, d = 13, 4
assert (p - 1) % d == 0  # d phải chia p-1
roots = [x for x in range(p) if pow(x, d, p) == 1]
print(f"Nghiệm của x^{d} ≡ 1 (mod {p}): {roots}")  # 4 nghiệm
print(f"Số nghiệm: {len(roots)}")  # = d = 4
```

---

## Summary / Key Takeaways

- **Primitive root** $g$ mod $p$: phần tử bậc $p - 1$, sinh ra toàn bộ $(\mathbb{Z}/p\mathbb{Z})^*$.
- **Tồn tại**: mọi số nguyên tố $p$ đều có primitive root — hệ quả của đa thức $x^d \equiv 1$ có đúng $d$ nghiệm trong $\mathbb{F}_p$.
- **Số lượng**: có đúng $\varphi(p-1)$ primitive roots modulo $p$.
- **Từ một cái sinh tất cả**: nếu $g$ primitive root, thì $g^k$ primitive root $\iff \gcd(k, p-1) = 1$.
- **Cốt lõi lý thuyết**: $(\mathbb{Z}/p\mathbb{Z})^*$ là nhóm cyclic bậc $p-1$ — nền tảng của Module 2.
- **Bảng chỉ số**: primitive root cho phép chuyển nhân modulo thành cộng chỉ số (logarithm rời rạc — bài 14).

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §2.9–2.10.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 4.
- Evan Chen. *Orders Modulo a Prime*, expository notes (2015).
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.7.
