---
title: "09. Cyclic Groups and Order of Elements"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-09]
aliases: [Cyclic Groups and Order of Elements]
created: 2026-05-15
---

> **Prerequisites**: [[08-subgroups-and-generators|08. Subgroups and Generators]] — hiểu $\gcd$, số học modular, và khái niệm nhóm con sinh.
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Nhóm cyclic vô hạn (phép cộng) |
> | $\mathbb{Z}/n\mathbb{Z}$ | Nhóm cyclic hữu hạn cấp $n$ (phép cộng modulo $n$) |
> | $\gcd(a,b)$ | Ước chung lớn nhất của $a$ và $b$ |
> | $\operatorname{lcm}(a,b)$ | Bội chung nhỏ nhất của $a$ và $b$ |
> | $S_n$ | Nhóm đối xứng bậc $n$ |
> | $|G|$ | Cấp của nhóm $G$ |

> **Objectives**:
> - Định nghĩa cấp của phần tử $\operatorname{ord}(g)$ và tính toán cấp trong các nhóm cụ thể.
> - Hiểu nhóm cyclic $\langle g \rangle$ và phân loại nhóm cyclic ($\cong \mathbb{Z}$ hoặc $\cong \mathbb{Z}/n\mathbb{Z}$).
> - Xác định tập sinh (generators) của $\mathbb{Z}/n\mathbb{Z}$ thông qua $\gcd$.
> - Nắm hàm Euler totient $\phi(n)$ và tính số phần tử sinh.

---

## Motivation

Khi nghiên cứu nhóm $(\mathbb{Z}/6\mathbb{Z}, +)$, ta nhận thấy: bắt đầu từ phần tử $1$ và cộng liên tiếp: $1, 2, 3, 4, 5, 0, 1, 2, \ldots$ — ta quay lại $0$ sau $6$ bước. Hiện tượng "lặp lại" này là cốt lõi của nhóm cyclic.

Câu hỏi tự nhiên: sau bao nhiêu bước ta quay lại đơn vị? Đây là **cấp** (order) của phần tử. Cấp của phần tử kết nối hàm số học $\gcd$, lý thuyết số (định lý Euler, Fermat), và cấu trúc của nhóm cyclic — cấu trúc nhóm đơn giản nhất và cũng quan trọng nhất.

---

## 1. Cấp của Phần Tử (Order of an Element)

> [!definition] Definition 9.1 — Cấp của phần tử (Order of an Element)
> Cho $G$ là nhóm và $g \in G$. **Cấp** của $g$, ký hiệu $\operatorname{ord}(g)$ hoặc $|g|$, được định nghĩa:
>
> $$
> \operatorname{ord}(g) = \min\{n \in \mathbb{N}^+ \mid g^n = e\}
> $$
>
> nếu tập này khác rỗng; ngược lại $\operatorname{ord}(g) = \infty$.

> [!abstract] Theorem 9.2 — Tính chất của cấp phần tử
> Cho $g \in G$ có $\operatorname{ord}(g) = n < \infty$.
>
> 1. $g^k = e \iff n \mid k$.
> 2. $g^i = g^j \iff n \mid (i - j)$.
> 3. $\operatorname{ord}(g^k) = \dfrac{n}{\gcd(n, k)}$.

**Proof.**
1. $(\Leftarrow)$ $k = qn$ thì $g^k = (g^n)^q = e^q = e$.
   $(\Rightarrow)$ Chia Euclidean: $k = qn + r$, $0 \leq r < n$. Thì $e = g^k = g^{qn+r} = (g^n)^q g^r = e^q g^r = g^r$. Vì $n$ là nhỏ nhất và $0 \leq r < n$, buộc $r = 0$, tức $n \mid k$.
2. $g^i = g^j \iff g^{i-j} = e \iff n \mid (i-j)$.
3. Gọi $m = \operatorname{ord}(g^k)$. Ta cần $(g^k)^m = g^{km} = e$, tức $n \mid km$, tức $\frac{n}{\gcd(n,k)} \mid m$. Ngược lại, $(g^k)^{n/\gcd(n,k)} = g^{kn/\gcd(n,k)} = (g^n)^{k/\gcd(n,k)} = e$. Vậy $m = \frac{n}{\gcd(n,k)}$. $\blacksquare$

> [!example] Example 9.3 — Cấp trong $\mathbb{Z}/12\mathbb{Z}$
> $G = \mathbb{Z}_{12}$, phép cộng. Phần tử $g = 4$:
>
> $4, 8, 0$ — tức $3 \cdot 4 = 12 \equiv 0 \pmod{12}$.
>
> $\operatorname{ord}(4) = 3 = \dfrac{12}{\gcd(12, 4)} = \dfrac{12}{4} = 3$. ✓
>
> Tương tự: $\operatorname{ord}(1) = 12$, $\operatorname{ord}(2) = 6$, $\operatorname{ord}(3) = 4$, $\operatorname{ord}(6) = 2$, $\operatorname{ord}(0) = 1$.

> [!example] Example 9.4 — Cấp trong $S_n$
> - $\operatorname{ord}(e) = 1$.
> - $\operatorname{ord}((12)) = 2$ (vì $(12)^2 = e$).
> - $\operatorname{ord}((123)) = 3$ (vì $(123)^3 = e$, $(123)^1, (123)^2 \neq e$).
>
> Tổng quát: cấp của chu trình $(i_1 i_2 \cdots i_k)$ trong $S_n$ bằng $k$ (độ dài chu trình). Cấp của tích các chu trình **rời nhau** (disjoint cycles) bằng $\operatorname{lcm}$ của các độ dài chu trình.
>
> **Ví dụ**: Trong $S_5$, phần tử $(12)(345)$ có cấp $\operatorname{lcm}(2, 3) = 6$. Phần tử $(12)(34)$ có cấp $\operatorname{lcm}(2, 2) = 2$.

---

## 2. Nhóm Cyclic (Cyclic Group)

> [!definition] Definition 9.5 — Nhóm cyclic (Cyclic Group)
> Nhóm $G$ được gọi là **cyclic** nếu $G = \langle g \rangle$ cho một phần tử nào đó $g \in G$. Phần tử $g$ được gọi là **phần tử sinh** (generator) của $G$.
>
> Tức là: $G = \langle g \rangle = \{g^n \mid n \in \mathbb{Z}\} = \{\ldots, g^{-2}, g^{-1}, e, g, g^2, \ldots\}$.

> [!note] Remark 9.6
> Mọi nhóm cyclic đều Abel (vì $g^i g^j = g^{i+j} = g^j g^i$). Ngược lại chưa đúng: $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} = V_4$ là Abel nhưng không cyclic (không có phần tử cấp 4).

---

## 3. Phân Loại Nhóm Cyclic

> [!abstract] Theorem 9.7 — Phân loại nhóm cyclic (Classification of Cyclic Groups)
> Mọi nhóm cyclic đều đẳng cấu với $\mathbb{Z}$ hoặc $\mathbb{Z}/n\mathbb{Z}$ với $n \geq 1$. Cụ thể:
>
> - Nếu $\operatorname{ord}(g) = \infty$ thì $\langle g \rangle \cong \mathbb{Z}$.
> - Nếu $\operatorname{ord}(g) = n$ thì $\langle g \rangle \cong \mathbb{Z}/n\mathbb{Z}$.

**Proof.**
Định nghĩa ánh xạ $\phi: \mathbb{Z} \to \langle g \rangle$ bởi $\phi(k) = g^k$.

**Trường hợp $\operatorname{ord}(g) = \infty$**: $\phi$ là đơn ánh (vì $g^i = g^j \Rightarrow g^{i-j} = e \Rightarrow i = j$ theo $\operatorname{ord} = \infty$) và toàn ánh (theo định nghĩa $\langle g \rangle$). Hơn nữa $\phi(i+j) = g^{i+j} = g^i g^j = \phi(i)\phi(j)$. Vậy $\phi$ là đẳng cấu $\mathbb{Z} \xrightarrow{\sim} \langle g \rangle$.

**Trường hợp $\operatorname{ord}(g) = n$**: Phần tử $\{e, g, g^2, \ldots, g^{n-1}\}$ phân biệt và $\langle g \rangle = \{e, g, \ldots, g^{n-1}\}$ (theo Theorem 9.2(2)). Ánh xạ $\psi: \mathbb{Z}/n\mathbb{Z} \to \langle g \rangle$ bởi $\psi(\bar{k}) = g^k$ là song ánh và là đồng cấu nhóm. $\blacksquare$

> [!abstract] Corollary 9.8 — Nhóm con của nhóm cyclic
> Mọi nhóm con của nhóm cyclic đều là cyclic.
>
> Cụ thể: các nhóm con của $\mathbb{Z}/n\mathbb{Z}$ là $\langle d \rangle = \{0, d, 2d, \ldots\}$ với $d \mid n$, và $|\langle d \rangle| = n/d$. Có **một nhóm con duy nhất** của mỗi cấp $d' \mid n$.

**Proof (phác thảo cho $\mathbb{Z}_n$).** Cho $H \leq \mathbb{Z}_n$. Nếu $H = \{0\}$, xong. Nếu không, gọi $d = \min\{k \in H \mid k > 0\}$. Tương tự chứng minh ở [[08-subgroups-and-generators|08. Subgroups and Generators]] (Example 8.7), $H = \langle d \rangle$. Vì $H \subseteq \mathbb{Z}_n$, ta có $d \mid n$. Ngược lại mỗi ước $d$ của $n$ cho một nhóm con $\langle d \rangle$ cỡ $n/d$. $\blacksquare$

---

## 4. Phần Tử Sinh của $\mathbb{Z}/n\mathbb{Z}$

> [!abstract] Theorem 9.9 — Phần tử sinh của $\mathbb{Z}/n\mathbb{Z}$
> $k \in \mathbb{Z}/n\mathbb{Z}$ là phần tử sinh của $\mathbb{Z}/n\mathbb{Z}$ (tức $\langle k \rangle = \mathbb{Z}/n\mathbb{Z}$) khi và chỉ khi:
>
> $$
> \gcd(k, n) = 1
> $$

**Proof.** $k$ sinh $\mathbb{Z}/n\mathbb{Z}$ $\iff$ $\operatorname{ord}(k) = n$ $\iff$ $\dfrac{n}{\gcd(n,k)} = n$ $\iff$ $\gcd(n,k) = 1$. $\blacksquare$

> [!abstract] Corollary 9.10 — Số phần tử sinh
> Số phần tử sinh của $\mathbb{Z}/n\mathbb{Z}$ bằng $\phi(n)$, hàm **Euler totient** (số nguyên từ $1$ đến $n$ nguyên tố cùng nhau với $n$).

---

## 5. Hàm Euler Totient $\phi(n)$

> [!definition] Definition 9.11 — Hàm Euler Totient
> Với $n \geq 1$:
>
> $$
> \phi(n) = |\{k \in \{1, 2, \ldots, n\} \mid \gcd(k, n) = 1\}|
> $$

> [!abstract] Theorem 9.12 — Công thức tính $\phi(n)$
> Nếu $n = p_1^{a_1} p_2^{a_2} \cdots p_r^{a_r}$ (phân tích nguyên tố), thì:
>
> $$
> \phi(n) = n \prod_{p \mid n} \left(1 - \frac{1}{p}\right) = \prod_{i=1}^r p_i^{a_i - 1}(p_i - 1)
> $$

> [!example] Example 9.13 — Tính $\phi(n)$
> - $\phi(1) = 1$.
> - $\phi(p) = p - 1$ với $p$ nguyên tố.
> - $\phi(p^k) = p^k - p^{k-1} = p^{k-1}(p-1)$.
> - $\phi(12) = \phi(2^2)\phi(3) = (4-2) \cdot (3-1) = 2 \cdot 2 = 4$. (Các phần tử sinh của $\mathbb{Z}_{12}$: $1, 5, 7, 11$.)
> - $\phi(30) = 30\left(1-\frac{1}{2}\right)\left(1-\frac{1}{3}\right)\left(1-\frac{1}{5}\right) = 30 \cdot \frac{1}{2} \cdot \frac{2}{3} \cdot \frac{4}{5} = 8$.

> [!abstract] Theorem 9.14 — Tính nhân của $\phi$
> Nếu $\gcd(m, n) = 1$ thì $\phi(mn) = \phi(m)\phi(n)$.

---

## 6. Khi Nào $(\mathbb{Z}/n\mathbb{Z})^\times$ là Cyclic?

> [!abstract] Theorem 9.15 — Cấu trúc cyclic của $(\mathbb{Z}/n\mathbb{Z})^\times$ (Primitive Root Theorem)
> $(\mathbb{Z}/n\mathbb{Z})^\times$ là cyclic khi và chỉ khi $n = 1, 2, 4, p^k,$ hoặc $2p^k$, trong đó $p$ là số nguyên tố lẻ và $k \geq 1$.
>
> Phần tử sinh của $(\mathbb{Z}/n\mathbb{Z})^\times$ khi đó được gọi là **primitive root** modulo $n$.

> [!example] Example 9.16
> - $(\mathbb{Z}/7\mathbb{Z})^\times$ cyclic: $3$ là primitive root vì $3^1 = 3, 3^2 = 2, 3^3 = 6, 3^4 = 4, 3^5 = 5, 3^6 = 1 \pmod 7$.
> - $(\mathbb{Z}/8\mathbb{Z})^\times = \{1, 3, 5, 7\} \cong V_4$ — **không** cyclic (vì $8$ không thuộc dạng đặc biệt trên).

---

## 7. Cấu Trúc Đầy Đủ của Nhóm Cyclic

Tổng kết về nhóm cyclic vô hạn $\mathbb{Z}$ và hữu hạn $\mathbb{Z}/n\mathbb{Z}$:

| Tính chất | $\mathbb{Z}$ | $\mathbb{Z}/n\mathbb{Z}$ |
|-----------|-------------|--------------------------|
| Cấp | $\infty$ | $n$ |
| Phần tử sinh | $1$ và $-1$ | $k$ với $\gcd(k,n) = 1$ |
| Số phần tử sinh | $2$ | $\phi(n)$ |
| Nhóm con | $m\mathbb{Z}$ ($m \geq 0$), một cho mỗi $m$ | $\langle d \rangle$ với $d \mid n$, một cho mỗi ước |
| Cấp của $g^k$ | $\infty$ (trừ $k=0$) | $n/\gcd(n,k)$ |

---

## 8. Ứng Dụng: Định Lý Euler và Fermat

Các định lý này sẽ được chứng minh đầy đủ trong [[10-cosets-and-lagranges-theorem|10. Cosets and Lagrange's Theorem]] sử dụng Định lý Lagrange. Ở đây ta nêu kết quả như một ứng dụng của nhóm cyclic.

> [!abstract] Theorem 9.17 — Định lý Euler (Euler's Theorem)
> Với $n \geq 1$ và $a \in \mathbb{Z}$ với $\gcd(a, n) = 1$:
>
> $$
> a^{\phi(n)} \equiv 1 \pmod{n}
> $$

> [!abstract] Theorem 9.18 — Định lý nhỏ Fermat (Fermat's Little Theorem)
> Với $p$ nguyên tố và $a \in \mathbb{Z}$ với $p \nmid a$:
>
> $$
> a^{p-1} \equiv 1 \pmod{p}
> $$

---

## 9. SageMath Cheatsheet

```python
# ---- Cấp của phần tử ----
G = SymmetricGroup(5)
sigma = G([(1,2,3),(4,5)])
print(sigma.order())        # lcm(3,2) = 6

# ---- Cấp trong Z/nZ (nhóm cộng) ----
Z12 = AdditiveAbelianGroup([12])
g = Z12.gen(0)               # generator 1
for k in range(12):
    print(k, ':', (k * g).order())  # additive order

# ---- Nhóm cyclic ----
G = CyclicPermutationGroup(12)
print(G.is_cyclic())         # True
print(G.order())             # 12

# ---- Tất cả phần tử sinh của Z/nZ ----
n = 12
gens = [k for k in range(n) if gcd(k, n) == 1]
print(gens)                  # [1, 5, 7, 11]

# ---- Hàm Euler totient ----
print(euler_phi(12))         # 4
print(euler_phi(30))         # 8

# ---- Nhóm con của nhóm cyclic ----
G = CyclicPermutationGroup(12)
for H in G.subgroups():
    print(H.order())         # 1, 2, 3, 4, 6, 12

# ---- Primitive root modulo n ----
# Kiểm tra xem có primitive root không
n = 7
R = Integers(n)
print(R.unit_group().is_cyclic())  # True
# Tìm một primitive root
for a in range(2, n):
    if R(a).multiplicative_order() == euler_phi(n):
        print(f"Primitive root: {a}")  # 3
        break

# ---- Kiểm tra định lý Euler ----
print(pow(3, euler_phi(77), 77))      # 1 (gcd(3,77)=1)
```

---

## 10. Summary

- $\operatorname{ord}(g) = $ số mũ dương nhỏ nhất để $g^n = e$ (hoặc $\infty$).
- $g^k = e \iff \operatorname{ord}(g) \mid k$.
- $\operatorname{ord}(g^k) = \operatorname{ord}(g) / \gcd(\operatorname{ord}(g), k)$.
- Nhóm cyclic $\cong \mathbb{Z}$ hoặc $\cong \mathbb{Z}/n\mathbb{Z}$.
- Nhóm con của cyclic là cyclic; $\mathbb{Z}/n\mathbb{Z}$ có đúng một nhóm con cho mỗi ước của $n$.
- $k$ là phần tử sinh của $\mathbb{Z}/n\mathbb{Z}$ $\iff$ $\gcd(k,n) = 1$; có $\phi(n)$ phần tử sinh.
- $\phi(n) = n \prod_{p \mid n}(1-\frac{1}{p})$.
- $(\mathbb{Z}/n\mathbb{Z})^\times$ là cyclic $\iff$ $n = 1, 2, 4, p^k,$ hoặc $2p^k$.

---

## 11. References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), §2.3.
- Judson, *Abstract Algebra: Theory and Applications*, Chapter 4.
- Hardy & Wright, *Introduction to the Theory of Numbers*, Chapter V (Euler totient).
