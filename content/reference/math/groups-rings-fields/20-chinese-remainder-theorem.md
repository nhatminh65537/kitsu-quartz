---
title: "20. Chinese Remainder Theorem"
type: math-component
tags: [math, groups-rings-fields, ring-theory, crt, lesson-20]
aliases: [Chinese Remainder Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[19-polynomial-rings|19. Polynomial Rings]] — đa thức, vành thương đa thức; [[13-direct-products-and-ftfag|13. Direct Products]] — tích trực tiếp; [[15-ideals-and-quotient-rings|15. Ideals and Quotient Rings]] — ideal, vành thương.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\mathbb{F}_p$ | Trường hữu hạn $p$ phần tử |
> | $\mathbb{F}_{p^n}$ | Trường hữu hạn $p^n$ phần tử |
> | $R[x]$ | Vành đa thức với hệ số trong $R$ |
> | $\phi(n)$ | Hàm Euler phi |
> | $\gcd(a, b)$ | Ước chung lớn nhất của $a$ và $b$ |
> | $\cong$ | Đẳng cấu (isomorphism) |

> **Objectives**:
> - Định nghĩa ideal coprime (nguyên tố cùng nhau) trong vành
> - Phát biểu và chứng minh Định lý Thặng dư Trung Hoa (CRT) tổng quát cho vành
> - Áp dụng CRT cho $\mathbb{Z}/n\mathbb{Z}$: phân tích cấu trúc
> - Xác định cấu trúc nhóm $(\mathbb{Z}/n\mathbb{Z})^\times$ qua CRT
> - Giải hệ đồng dư (simultaneous congruences) bằng CRT

---

## Motivation / Intuition

Định lý Thặng dư Trung Hoa (Chinese Remainder Theorem — CRT) là một trong những công cụ tính toán và lý thuyết mạnh nhất trong toán học. Nguồn gốc cổ đại: từ thế kỷ 3 SCN, nhà toán học Trung Quốc Tôn Tử đã đặt câu hỏi:

> *"Có một số nguyên dương $x$ không biết. Chia cho $3$ dư $2$, chia cho $5$ dư $3$, chia cho $7$ dư $2$. Tìm $x$."*

Câu trả lời: $x \equiv 23 \pmod{105}$. Nhưng bản chất sâu hơn: khi $\gcd(m, n) = 1$, các bài toán modulo $m$ và modulo $n$ hoàn toàn **độc lập** với nhau — và CRT nắm bắt chính xác điều đó.

Trong ngôn ngữ vành hiện đại: với các ideal pairwise coprime $I_1, \ldots, I_k$, vành thương $R/(I_1 \cap \cdots \cap I_k)$ đẳng cấu với tích trực tiếp $\prod R/I_i$.

---

## Ideal coprime

> [!definition] Definition 20.1 — Ideal coprime (Comaximal Ideals)
> Hai ideal $I, J \trianglelefteq R$ trong vành có đơn vị $R$ gọi là **coprime** (hay **comaximal**) nếu:
>
> $$
> I + J = R
> $$
>
> Tức là tồn tại $a \in I$ và $b \in J$ sao cho $a + b = 1$.

> [!example] Example 20.2 — Ideal coprime trong $\mathbb{Z}$
> Trong $\mathbb{Z}$, $m\mathbb{Z}$ và $n\mathbb{Z}$ coprime khi và chỉ khi $\gcd(m, n) = 1$:
>
> $m\mathbb{Z} + n\mathbb{Z} = \gcd(m,n)\mathbb{Z}$ (theo Bézout trong PID). Nên $m\mathbb{Z} + n\mathbb{Z} = \mathbb{Z} \Leftrightarrow \gcd(m, n) = 1$.

> [!abstract] Theorem 20.3 — Tính chất của ideal coprime
> Nếu $I, J \trianglelefteq R$ coprime thì $I \cap J = IJ$ (tích ideal).

**Proof.** 

Luôn có $IJ \subseteq I \cap J$. Cần chứng minh $I \cap J \subseteq IJ$.

Vì $I + J = R$, tồn tại $a \in I$, $b \in J$ với $a + b = 1$. Với $x \in I \cap J$:

$$
x = x \cdot 1 = x(a + b) = xa + xb
$$

$x a \in J \cdot I \subseteq IJ$ (vì $x \in J$, $a \in I$), và $x b \in I \cdot J = IJ$ (vì $x \in I$, $b \in J$). Vậy $x \in IJ$. $\blacksquare$

> [!abstract] Theorem 20.4 — Mở rộng cho $k$ ideal
> Nếu $I_1, \ldots, I_k$ là các ideal pairwise coprime (tức $I_i + I_j = R$ với $i \neq j$), thì $I_i$ và $\prod_{j \neq i} I_j$ cũng coprime, và:
>
> $$
> I_1 \cap I_2 \cap \cdots \cap I_k = I_1 I_2 \cdots I_k
> $$

---

## Định lý Thặng dư Trung Hoa cho vành

> [!abstract] Theorem 20.5 — Chinese Remainder Theorem (General Ring Version)
> Cho $R$ là vành giao hoán có đơn vị và $I_1, I_2, \ldots, I_k \trianglelefteq R$ là các ideal **pairwise coprime** (tức $I_i + I_j = R$ với mọi $i \neq j$). Khi đó:
>
> 1. $I_1 I_2 \cdots I_k = I_1 \cap I_2 \cap \cdots \cap I_k$.
> 2. Ánh xạ $\Phi: R \to R/I_1 \times R/I_2 \times \cdots \times R/I_k$ định nghĩa bởi:
>
> $$
> \Phi(a) = (a + I_1, \; a + I_2, \; \ldots,\; a + I_k)
> $$
>
> là đồng cấu vành toàn ánh với $\ker \Phi = I_1 \cap \cdots \cap I_k = I_1 I_2 \cdots I_k$.
>
> 3. Suy ra đẳng cấu vành:
>
> $$
> \frac{R}{I_1 I_2 \cdots I_k} \;\cong\; \frac{R}{I_1} \times \frac{R}{I_2} \times \cdots \times \frac{R}{I_k}
> $$

**Proof.**

**$\Phi$ là đồng cấu**: Kiểm tra thường quy từ định nghĩa vành thương.

**$\ker\Phi = I_1 \cap \cdots \cap I_k$**: $a \in \ker\Phi \Leftrightarrow a + I_j = 0 + I_j$ với mọi $j \Leftrightarrow a \in I_j$ với mọi $j \Leftrightarrow a \in \bigcap I_j$.

**$\Phi$ toàn ánh** (đây là phần cốt lõi): Ta chứng minh bằng quy nạp. Trước hết chứng minh cho $k = 2$:

*Trường hợp $k = 2$*: Vì $I_1 + I_2 = R$, tồn tại $e_1 \in I_1$, $e_2 \in I_2$ với $e_1 + e_2 = 1$. Với $(b_1 + I_1, b_2 + I_2)$ tùy ý trong $R/I_1 \times R/I_2$, đặt:

$$
a = b_1 e_2 + b_2 e_1
$$

Kiểm tra: $a - b_1 = b_1 e_2 + b_2 e_1 - b_1 = b_1(e_2 - 1) + b_2 e_1 = -b_1 e_1 + b_2 e_1 = (b_2 - b_1)e_1 \in I_1$. Vậy $a \equiv b_1 \pmod{I_1}$.

Tương tự $a \equiv b_2 \pmod{I_2}$. Vậy $\Phi(a) = (b_1 + I_1, b_2 + I_2)$. Toàn ánh!

*Quy nạp về $k$*: Với $I_1, \ldots, I_k$ pairwise coprime, có thể chứng minh $I_1$ và $I_2 I_3 \cdots I_k$ là coprime (dùng quy nạp), rồi áp dụng trường hợp $k = 2$.

**Kết luận**: Theo định lý đẳng cấu thứ nhất, $R/\ker\Phi \cong \operatorname{Im}\Phi = R/I_1 \times \cdots \times R/I_k$. $\blacksquare$

---

## CRT cho $\mathbb{Z}/n\mathbb{Z}$ — Phiên bản số học

> [!abstract] Theorem 20.6 — CRT cho số nguyên
> Nếu $n = p_1^{a_1} p_2^{a_2} \cdots p_k^{a_k}$ (phân tích thành thừa số nguyên tố), thì:
>
> $$
> \mathbb{Z}/n\mathbb{Z} \;\cong\; \mathbb{Z}/p_1^{a_1}\mathbb{Z} \;\times\; \mathbb{Z}/p_2^{a_2}\mathbb{Z} \;\times\; \cdots \;\times\; \mathbb{Z}/p_k^{a_k}\mathbb{Z}
> $$
>
> Nói cách khác: với các moduli **nguyên tố cùng nhau từng đôi** $m_1, \ldots, m_k$ (tức $\gcd(m_i, m_j) = 1$ với $i \neq j$):
>
> $$
> \mathbb{Z}/m_1 m_2 \cdots m_k\mathbb{Z} \;\cong\; \mathbb{Z}/m_1\mathbb{Z} \;\times\; \mathbb{Z}/m_2\mathbb{Z} \;\times\; \cdots \;\times\; \mathbb{Z}/m_k\mathbb{Z}
> $$

**Proof.** Áp dụng Theorem 20.5 với $R = \mathbb{Z}$, $I_j = m_j \mathbb{Z}$. Các ideal coprime: $m_i \mathbb{Z} + m_j \mathbb{Z} = \gcd(m_i, m_j)\mathbb{Z} = \mathbb{Z}$ vì $\gcd(m_i, m_j) = 1$. $\blacksquare$

> [!abstract] Corollary 20.7
> Với $\gcd(m, n) = 1$: $\mathbb{Z}/mn\mathbb{Z} \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$.

> [!example] Example 20.8 — Giải hệ đồng dư Tôn Tử
> Hệ:
>
> $$
> x \equiv 2 \pmod{3}, \quad x \equiv 3 \pmod{5}, \quad x \equiv 2 \pmod{7}
> $$
>
> **Phương pháp CRT**:
>
> $n = 3 \cdot 5 \cdot 7 = 105$. Tính $N_1 = 35$, $N_2 = 21$, $N_3 = 15$.
>
> Tìm nghịch đảo:
> - $y_1$: $35 y_1 \equiv 1 \pmod{3}$, tức $2 y_1 \equiv 1 \pmod 3 \Rightarrow y_1 = 2$.
> - $y_2$: $21 y_2 \equiv 1 \pmod{5}$, tức $y_2 \equiv 1 \pmod 5 \Rightarrow y_2 = 1$.
> - $y_3$: $15 y_3 \equiv 1 \pmod{7}$, tức $y_3 \equiv 1 \pmod 7 \Rightarrow y_3 = 1$.
>
> $$
> x = 2 \cdot 35 \cdot 2 + 3 \cdot 21 \cdot 1 + 2 \cdot 15 \cdot 1 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}
> $$
>
> Kiểm tra: $23 = 7 \cdot 3 + 2$ ✓, $23 = 4 \cdot 5 + 3$ ✓, $23 = 3 \cdot 7 + 2$ ✓.

---

## Cấu trúc của $(\mathbb{Z}/n\mathbb{Z})^\times$

> [!abstract] Theorem 20.9 — Nhóm đơn vị qua CRT
> Lấy đẳng cấu vành trong Theorem 20.6, giữ lại các đơn vị:
>
> $$
> \left(\mathbb{Z}/n\mathbb{Z}\right)^\times \;\cong\; \left(\mathbb{Z}/p_1^{a_1}\mathbb{Z}\right)^\times \;\times\; \cdots \;\times\; \left(\mathbb{Z}/p_k^{a_k}\mathbb{Z}\right)^\times
> $$
>
> Hơn nữa, $\left|\left(\mathbb{Z}/n\mathbb{Z}\right)^\times\right| = \phi(n) = \phi(p_1^{a_1}) \cdots \phi(p_k^{a_k})$.

> [!abstract] Theorem 20.10 — Cấu trúc nhóm $(\mathbb{Z}/p^a\mathbb{Z})^\times$
> Với $p$ nguyên tố và $a \geq 1$:
>
> - Nếu $p$ là số nguyên tố lẻ: $\left(\mathbb{Z}/p^a\mathbb{Z}\right)^\times \cong \mathbb{Z}/\phi(p^a)\mathbb{Z} = \mathbb{Z}/(p-1)p^{a-1}\mathbb{Z}$ — nhóm cyclic.
> - Nếu $p = 2$, $a = 1$: $(\mathbb{Z}/2\mathbb{Z})^\times = \{1\}$ — tầm thường.
> - Nếu $p = 2$, $a = 2$: $(\mathbb{Z}/4\mathbb{Z})^\times \cong \mathbb{Z}/2\mathbb{Z}$ — cyclic bậc 2.
> - Nếu $p = 2$, $a \geq 3$: $(\mathbb{Z}/2^a\mathbb{Z})^\times \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2^{a-2}\mathbb{Z}$ — không cyclic.

> [!example] Example 20.11 — Phân tích $(\mathbb{Z}/120\mathbb{Z})^\times$
> $120 = 2^3 \cdot 3 \cdot 5$.
>
> $$
> (\mathbb{Z}/120\mathbb{Z})^\times \cong (\mathbb{Z}/8\mathbb{Z})^\times \times (\mathbb{Z}/3\mathbb{Z})^\times \times (\mathbb{Z}/5\mathbb{Z})^\times
> $$
>
> $$
> \cong (\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}) \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/4\mathbb{Z}
> $$
>
> $$
> \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/4\mathbb{Z}
> $$
>
> $\phi(120) = \phi(8)\phi(3)\phi(5) = 4 \cdot 2 \cdot 4 = 32$. ✓

> [!example] Example 20.12 — Phân tích $(\mathbb{Z}/100\mathbb{Z})^\times$
> $100 = 4 \cdot 25 = 2^2 \cdot 5^2$.
>
> $$
> (\mathbb{Z}/100\mathbb{Z})^\times \cong (\mathbb{Z}/4\mathbb{Z})^\times \times (\mathbb{Z}/25\mathbb{Z})^\times \cong \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/20\mathbb{Z}
> $$
>
> vì $(\mathbb{Z}/4\mathbb{Z})^\times \cong \mathbb{Z}/2\mathbb{Z}$ và $(\mathbb{Z}/25\mathbb{Z})^\times \cong \mathbb{Z}/20\mathbb{Z}$ (cyclic, $p = 5$ lẻ, $\phi(25) = 20$).
>
> $\phi(100) = 2 \cdot 20 = 40$.

---

## CRT cho vành đa thức

> [!example] Example 20.13 — CRT trong $F[x]$
> Trong $F[x]$ (là PID), với $f_1, f_2 \in F[x]$ monic bất khả quy phân biệt (nên $\gcd(f_1, f_2) = 1$):
>
> $$
> F[x]/\langle f_1 f_2 \rangle \;\cong\; F[x]/\langle f_1 \rangle \;\times\; F[x]/\langle f_2 \rangle
> $$
>
> **Ứng dụng**: $\mathbb{Q}[x]/\langle x^2 - 1 \rangle \cong \mathbb{Q}[x]/\langle x-1 \rangle \times \mathbb{Q}[x]/\langle x+1 \rangle \cong \mathbb{Q} \times \mathbb{Q}$.
>
> Đẳng cấu này cho bởi: $[f(x)] \mapsto (f(1), f(-1))$.
>
> Kiểm tra: $[x^2] \mapsto (1, 1)$, $[x] \mapsto (1, -1)$. Đúng với $(1, -1)^2 = (1, 1)$ trong $\mathbb{Q} \times \mathbb{Q}$. ✓

> [!example] Example 20.14 — CRT trong $\mathbb{F}_2[x]$
> Trong $\mathbb{F}_2[x]$:
>
> $$
> \mathbb{F}_2[x]/\langle x^3 + x + 1 \rangle \cong \mathbb{F}_8
> $$
>
> vì $x^3 + x + 1$ bất khả quy trên $\mathbb{F}_2$ (kiểm tra: $f(0) = 1, f(1) = 1$, không có nghiệm). Đây là trường $8$ phần tử.
>
> Còn $x^4 + 1 = (x+1)^4$ trong $\mathbb{F}_2[x]$ (vì trong $\mathbb{F}_2$: $(x+1)^4 = x^4 + 4x^3 + 6x^2 + 4x + 1 \equiv x^4 + 1$). Vậy $\mathbb{F}_2[x]/\langle x^4 + 1 \rangle \cong \mathbb{F}_2[x]/\langle (x+1)^4 \rangle$ — **không** là trường (vì $x+1$ không bất khả quy lũy thừa).

---

## Ứng dụng: Định lý Euler và Fermat

> [!abstract] Theorem 20.15 — Định lý Euler (hệ quả CRT)
> Với $\gcd(a, n) = 1$:
>
> $$
> a^{\phi(n)} \equiv 1 \pmod{n}
> $$

**Proof.** $[a] \in (\mathbb{Z}/n\mathbb{Z})^\times$ là nhóm bậc $\phi(n)$. Theo định lý Lagrange, $[a]^{\phi(n)} = [1]$, tức $a^{\phi(n)} \equiv 1 \pmod{n}$. $\blacksquare$

> [!abstract] Corollary 20.16 — Định lý Fermat nhỏ
> Với $p$ nguyên tố và $p \nmid a$:
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$

**Proof.** Đặt $n = p$ trong Theorem 20.15: $\phi(p) = p - 1$. $\blacksquare$

> [!example] Example 20.17 — Tính $2^{1000} \pmod{77}$
> $77 = 7 \cdot 11$. Ta có $\phi(7) = 6$, $\phi(11) = 10$, $\phi(77) = 60$.
>
> Theo CRT: $2^{1000} \pmod{77}$ quy về tính $2^{1000}$ modulo $7$ và modulo $11$ riêng rẽ.
>
> Modulo $7$: $2^6 \equiv 1 \pmod 7$ (Fermat). $1000 = 166 \cdot 6 + 4$. Vậy $2^{1000} \equiv 2^4 = 16 \equiv 2 \pmod 7$.
>
> Modulo $11$: $2^{10} \equiv 1 \pmod{11}$. $1000 = 100 \cdot 10$. Vậy $2^{1000} \equiv 1 \pmod{11}$.
>
> Hệ: $x \equiv 2 \pmod 7$, $x \equiv 1 \pmod{11}$. Dùng CRT:
>
> $x = 2 \cdot 11 \cdot (11^{-1} \bmod 7) + 1 \cdot 7 \cdot (7^{-1} \bmod 11)$.
>
> $11 \equiv 4 \pmod 7$, cần $4y \equiv 1 \pmod 7 \Rightarrow y = 2$ (vì $4 \cdot 2 = 8 \equiv 1$).
> $7 \equiv 7 \pmod{11}$, cần $7y \equiv 1 \pmod{11} \Rightarrow y = 8$ (vì $7 \cdot 8 = 56 = 5 \cdot 11 + 1 \equiv 1$).
>
> $x = 2 \cdot 11 \cdot 2 + 1 \cdot 7 \cdot 8 = 44 + 56 = 100 \equiv 23 \pmod{77}$.
>
> Vậy $2^{1000} \equiv 23 \pmod{77}$.

---

## SageMath — CRT

```python
# CRT trong Z
# CRT(a, b, m, n): tìm x sao cho x ≡ a (mod m), x ≡ b (mod n)
x = CRT(2, 3, 3, 5)          # x ≡ 2 mod 3, x ≡ 3 mod 5
print(x)                     # 8 (và 8 + 15k cho mọi k)

# CRT cho nhiều đồng dư (bài Tôn Tử)
x = CRT_list([2, 3, 2], [3, 5, 7])
print(x)                     # 23

# Phân tích nhóm đơn vị
print(Zmod(120).unit_group())  # C2 x C2 x C2 x C4
print(euler_phi(120))        # 32

# Kiểm tra đẳng cấu CRT: Z/105 ≅ Z/3 x Z/5 x Z/7
R = Zmod(105)
# Ánh xạ tự nhiên: a -> (a mod 3, a mod 5, a mod 7)
for a in [0, 1, 23, 104]:
    print(f"{a} -> ({a % 3}, {a % 5}, {a % 7})")

# Định lý Euler
a, n = 7, 100
print(pow(a, euler_phi(n), n))  # 1 (kiểm tra a^phi(n) ≡ 1 mod n)

# Fermat nhỏ
p = 17
print(pow(2, p-1, p))        # 1

# 2^1000 mod 77
print(pow(2, 1000, 77))      # 23

# CRT trong F_2[x]
F2x = GF(2)['x']
x = F2x.gen()
f1 = x
f2 = x + 1
# gcd(x, x+1) = 1 trong F_2[x]
print(gcd(f1, f2))           # 1

Q = F2x.quotient(f1 * f2)    # F_2[x]/<x(x+1)> = F_2[x]/<x^2+x>
# ≅ F_2 × F_2 qua CRT
print(Q.cardinality())       # 4
```

---

## Summary — Lesson 20

- **Ideal coprime** $I + J = R$: điều kiện để CRT hoạt động.
- **CRT (phiên bản vành)**: Với $I_1, \ldots, I_k$ pairwise coprime:
  $$R/(I_1 \cap \cdots \cap I_k) \cong R/I_1 \times \cdots \times R/I_k$$
- **CRT cho $\mathbb{Z}$**: $\gcd(m_i, m_j) = 1 \Rightarrow \mathbb{Z}/m_1 \cdots m_k \cong \mathbb{Z}/m_1 \times \cdots \times \mathbb{Z}/m_k$.
- **Cấu trúc $(\mathbb{Z}/n\mathbb{Z})^\times$**: CRT phân tích thành tích nhóm đơn vị của các $\mathbb{Z}/p^a\mathbb{Z}$.
- **Định lý Euler** $a^{\phi(n)} \equiv 1 \pmod n$ (với $\gcd(a,n) = 1$) và **Fermat nhỏ** là hệ quả.
- **Ứng dụng**: giải hệ đồng dư, tính lũy thừa lớn modulo, phân tích vành đa thức.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §7.6.
- Hungerford, T. W. *Algebra*, Chapter III §2.
- Ireland, K., & Rosen, M. *A Classical Introduction to Modern Number Theory*, Chapter 3.
- Judson, T. W. *Abstract Algebra: Theory and Applications*, Chapter 14.
