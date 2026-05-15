---
title: "A5. Proof of Primitive Root Theorem"
type: math-component
tags: [math, groups-rings-fields, field-theory, primitive-roots, cyclic-groups, appendix, appendix-a5]
aliases: [Primitive Root Theorem Proof, A5, F_p^n^x is Cyclic]
created: 2026-05-15
---

> **Prerequisites**: [[26-primitive-elements|26. Primitive Elements]]
> **Lesson type**: Math Component — Appendix
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $F$ | Trường bất kỳ |
> | $F^\times$ | Nhóm nhân của trường $F$ |
> | $\mathbb{F}_{p^n}$ | Trường hữu hạn cấp $p^n$ |
> | $\operatorname{ord}(a)$ | Cấp của phần tử $a$ trong nhóm |
> | $\phi(n)$ | Hàm phi Euler |
> | $\mu_n$ | Nhóm căn đơn vị bậc $n$ |
> | $G$ | Nhóm con hữu hạn của $F^\times$ |
> | $m$ | Cấp của $G$: $m = |G|$ |

---

## Motivation

Một trong những kết quả sâu sắc nhất của lý thuyết trường hữu hạn là: **nhóm nhân của mọi trường hữu hạn đều là cyclic**. Điều này có nghĩa luôn tồn tại một "phần tử nguyên thủy" (primitive element) mà lũy thừa của nó sinh ra toàn bộ nhóm nhân. Kết quả này là nền tảng cho: logarit rời rạc (DLOG), trao đổi khóa Diffie-Hellman, mật mã đường cong elliptic, và thiết kế LFSR. Phụ lục này trình bày chứng minh cổ điển (dùng tính chất nghiệm của đa thức trên trường) và chứng minh thay thế (dùng cấp cực đại).

---

## 1. Phát biểu Định lý

> [!abstract] Theorem A5.1 — Nhóm con hữu hạn của $F^\times$ là Cyclic
> Cho $F$ là trường bất kỳ (không nhất thiết hữu hạn). Mọi nhóm con hữu hạn $G \leq F^\times$ đều là cyclic.
>
> **Hệ quả (Primitive Root Theorem):** Nhóm nhân $\mathbb{F}_{p^n}^\times$ của mọi trường hữu hạn là cyclic. Đặc biệt, $(\mathbb{Z}/p\mathbb{Z})^\times$ là cyclic với mọi số nguyên tố $p$.

> [!note] Remark A5.2 — Phát biểu mạnh hơn
> Định lý được phát biểu cho nhóm con hữu hạn **bất kỳ** của $F^\times$, không chỉ riêng $\mathbb{F}_{p^n}^\times$. Điều này áp dụng được cho cả $\mathbb{Q}^\times$, $\mathbb{R}^\times$, $\mathbb{C}^\times$ — miễn là nhóm con đó hữu hạn.

---

## 2. Chứng minh Chính (Đếm phần tử theo cấp)

**Chiến lược:** Ta chứng minh rằng $G$ thỏa điều kiện đặc trưng của nhóm cyclic: với mọi số nguyên $d$, số phần tử của $G$ có cấp $d$ là **đúng** $\phi(d)$ nếu $d \mid |G|$, và $0$ nếu $d \nmid |G|$.

Gọi $|G| = m$.

**Bước 1: Mỗi phần tử của $G$ thỏa $x^m = 1$.**

Theo định lý Lagrange, $\operatorname{ord}(a)$ chia hết $m$ với mọi $a \in G$. Vậy $a^m = 1$ với mọi $a \in G$. Tức là mọi phần tử của $G$ là nghiệm của đa thức $x^m - 1 \in F[x]$.

**Bước 2: Đa thức bậc $d$ có tối đa $d$ nghiệm trong trường.**

Trong trường $F$, đa thức $h(x)$ bậc $d \geq 1$ có tối đa $d$ nghiệm phân biệt. Điều này đúng vì $F[x]$ là miền nguyên Euclid: nếu $\alpha_1, \ldots, \alpha_k$ là các nghiệm phân biệt của $h$, thì $(x-\alpha_1)\cdots(x-\alpha_k) \mid h(x)$, suy ra $k \leq \deg h = d$.

**Bước 3: Đếm số phần tử cấp $d$.**

Gọi $\psi(d)$ là số phần tử của $G$ có cấp **đúng bằng** $d$. Rõ ràng:

$$
\sum_{d \mid m} \psi(d) = |G| = m
$$

(vì mọi phần tử có cấp chia hết $m$, và mỗi phần tử được đếm đúng một lần ở cấp của nó).

> [!abstract] Claim — $\psi(d) \leq \phi(d)$ với mọi $d \mid m$

**Proof của Claim.**

Nếu $\psi(d) = 0$: bất đẳng thức đúng vì $\phi(d) \geq 1$ với $d \geq 1$.

Nếu $\psi(d) \geq 1$: tồn tại $a \in G$ với $\operatorname{ord}(a) = d$.

Khi đó $\langle a \rangle = \{1, a, a^2, \ldots, a^{d-1}\}$ là nhóm con cyclic cấp $d$ của $G$. Mọi phần tử của $\langle a \rangle$ thỏa $x^d = 1$.

Đa thức $x^d - 1$ có bậc $d$, nên có **tối đa** $d$ nghiệm trong $F$. Nhóm $\langle a \rangle$ đã cung cấp **đúng** $d$ nghiệm (tất cả $d$ phần tử của $\langle a \rangle$). Vậy **mọi nghiệm của $x^d - 1$ trong $F$** đều nằm trong $\langle a \rangle$.

Do đó, mọi phần tử của $G$ có cấp $d$ (tức thỏa $x^d = 1$ và không thỏa $x^k = 1$ với $k < d$) phải nằm trong $\langle a \rangle$. Số phần tử cấp $d$ trong nhóm cyclic $\langle a \rangle \cong \mathbb{Z}/d\mathbb{Z}$ là chính xác $\phi(d)$ (vì có đúng $\phi(d)$ số $k$ với $1 \leq k \leq d$ và $\gcd(k, d) = 1$, mỗi số cho generator $a^k$).

Vậy $\psi(d) \leq \phi(d)$. $\blacksquare$

**Bước 4: Kết luận $G$ là cyclic.**

Ta có:

$$
m = |G| = \sum_{d \mid m} \psi(d) \leq \sum_{d \mid m} \phi(d) = m.
$$

(Bất đẳng thức từ Claim: $\psi(d) \leq \phi(d)$; đẳng thức cuối là hệ quả của hàm Euler — xem Lemma A5.4.)

Suy ra dấu đẳng thức phải xảy ra ở **mọi** vị trí: $\psi(d) = \phi(d)$ với mọi $d \mid m$.

Đặc biệt, với $d = m$: $\psi(m) = \phi(m) \geq 1$. Vậy tồn tại phần tử cấp $m = |G|$ trong $G$, tức $G$ là cyclic. $\blacksquare$

---

## 3. Chứng minh Thay thế (Cấp cực đại)

> [!abstract] Theorem A5.3 — Chứng minh thay thế (dùng cấp cực đại)
> (Phát biểu giống Theorem A5.1)

**Proof (phác thảo).**
Chọn $g \in G$ có cấp cực đại $n = \operatorname{ord}(g)$. Gọi $H = \langle g \rangle$ là nhóm con cyclic cấp $n$.

Giả sử $H \subsetneq G$. Lấy $h \in G \setminus H$. Gọi $m = \operatorname{ord}(h)$.

**Trường hợp 1:** $m \nmid n$. Khi đó tồn tại số nguyên tố $p$ và $k$ sao cho $p^k \mid m$ nhưng $p^k \nmid n$. Có thể xây dựng phần tử $g^{p^a} \cdot h^{m/p^k}$ có cấp $> n$, mâu thuẫn với tính cực đại của $n$.

**Trường hợp 2:** $m \mid n$. Khi đó mọi phần tử của $\langle h \rangle$ đều thỏa $x^m = 1$. Nhưng $x^m - 1$ có tối đa $m$ nghiệm trong $F$, và $H$ đã chứa đúng $m$ nghiệm (vì $m \mid n$, $H$ chứa duy nhất một nhóm con cấp $m$, có đúng $m$ phần tử). Vậy $h \in H$, mâu thuẫn với $h \notin H$.

Do đó $H = G$, và $G$ là cyclic. $\blacksquare$

---

## 4. Bổ trợ: Công thức Tổng Euler

> [!abstract] Lemma A5.4 — $\sum_{d \mid m} \phi(d) = m$

**Proof.**
Xét các phân số $\frac{1}{m}, \frac{2}{m}, \ldots, \frac{m}{m}$. Mỗi phân số $\frac{k}{m}$ khi rút gọn thành $\frac{a}{d}$ với $d \mid m$ và $\gcd(a, d) = 1$, $1 \leq a \leq d$.

Với mỗi $d \mid m$, số phân số $\frac{k}{m}$ rút gọn thành mẫu số $d$ là $\phi(d)$ (vì có đúng $\phi(d)$ số $a$ với $1 \leq a \leq d$ và $\gcd(a, d) = 1$). Tổng tất cả: $m = \sum_{d \mid m} \phi(d)$. $\blacksquare$

---

## 5. Hệ quả

> [!abstract] Corollary A5.5 — Số phần tử cấp $d$ trong $\mathbb{F}_{p^n}^\times$
> Trong $\mathbb{F}_{p^n}^\times$, số phần tử có cấp **đúng bằng** $d$ (với $d \mid p^n - 1$) là chính xác $\phi(d)$.

**Proof.** Từ Bước 4 của chứng minh chính: $\psi(d) = \phi(d)$ với mọi $d \mid m = p^n - 1$. $\blacksquare$

> [!abstract] Corollary A5.6 — Số phần tử nguyên thủy
> Số phần tử nguyên thủy (generator) của $\mathbb{F}_{p^n}^\times$ là $\phi(p^n - 1)$.

> [!abstract] Corollary A5.7 — $(\mathbb{Z}/p\mathbb{Z})^\times$ là cyclic
> Với $p$ nguyên tố, nhóm $(\mathbb{Z}/p\mathbb{Z})^\times \cong \mathbb{F}_p^\times$ là cyclic cấp $p-1$. Một generator của nhóm này được gọi là **primitive root modulo $p$**.

---

## 6. Lưu ý về Trường Vô hạn

> [!note] Remark A5.8 — Nhóm con hữu hạn của $\mathbb{C}^\times$
> Định lý A5.1 áp dụng cho **nhóm con hữu hạn** của $F^\times$ với $F$ bất kỳ. Ví dụ:
>
> - Trong $\mathbb{Q}^\times$: nhóm $\{1, -1\}$ là nhóm con hữu hạn duy nhất (cyclic cấp $2$).
> - Trong $\mathbb{C}^\times$: nhóm $\mu_n = \{z \in \mathbb{C} : z^n = 1\}$ (căn đơn vị bậc $n$) là nhóm con hữu hạn cyclic cấp $n$ với generator $e^{2\pi i/n}$.
> - Trong $\mathbb{R}^\times$: các nhóm con hữu hạn chỉ có $\{1\}$ và $\{1, -1\}$.
>
> Nhưng $\mathbb{C}^\times$ tự nó **không** cyclic (nó vô hạn và không đếm được).

---

## 7. Ứng dụng: Tìm Primitive Root modulo $p$

> [!example] Example A5.9 — Tìm primitive root modulo $7$
> $p = 7$, $\mathbb{F}_7^\times$ có cấp $6$. $\phi(6) = 2$ primitive roots.
>
> Thử $g = 2$: $\operatorname{ord}(2)$ phải là ước của $6$. $2^2 = 4 \neq 1$, $2^3 = 8 \equiv 1 \pmod 7$. Vậy $\operatorname{ord}(2) = 3 \neq 6$ — $2$ không là primitive root.
>
> Thử $g = 3$: $3^2 = 9 \equiv 2 \neq 1$, $3^3 = 6 \neq 1$, $3^6 = (3^3)^2 = 36 \equiv 1$. Vậy $\operatorname{ord}(3) = 6$ — $3$ là primitive root modulo $7$.
>
> Generator còn lại: $3^5 \equiv 5 \pmod 7$ (vì $\gcd(5, 6) = 1$).

---

## 8. SageMath — Tìm Primitive Elements

```sage
# Tìm primitive element của trường hữu hạn
p = 7
n = 2
F = GF(p^n, 'a')
print(f"F = GF({p}^{n})")

# Tìm phần tử nguyên thủy (generator của F^x)
g = F.multiplicative_generator()
print(f"Phần tử nguyên thủy: {g}")
print(f"Cấp của g: {g.multiplicative_order()}")  # p^n - 1 = 48

# Kiểm tra: g sinh ra toàn bộ F^x
generated = {g^k for k in range(p^n)}
print(f"Số phần tử sinh bởi g: {len(generated)}")  # 49 (gồm cả 0)
print(f"g có sinh ra F^x? {len(generated - {F(0)}) == p^n - 1}")  # True

# Đếm số primitive elements
primitive_count = sum(1 for a in F if a != 0 and a.multiplicative_order() == p^n - 1)
print(f"\nSố primitive elements: {primitive_count}")  # φ(48) = 16
print(f"φ({p^n - 1}) = {euler_phi(p^n - 1)}")  # Xác nhận

# Tìm primitive root modulo p
p = 17
# Cách đúng: dùng GF(p).multiplicative_generator()
Fp = GF(p)
pr = Fp.multiplicative_generator()
print(f"\nPrimitive root modulo {p}: {pr}")  # 3
print(f"φ({p-1}) = φ({p-1}) = {euler_phi(p-1)}")  # Số primitive roots: φ(16) = 8

# Minh họa: mọi nhóm con hữu hạn của C^x đều cyclic
# Nhóm căn đơn vị bậc 7 trong C
C = ComplexField(100)
zeta = C(exp(2*pi*I/7))
mu7 = [zeta^k for k in range(7)]
orders = [1, 7, 7, 7, 7, 7, 7]  # 1 (k=0), các phần tử khác cấp 7
print(f"\nμ_7 là cyclic: generator = e^(2πi/7)")
```

---

## References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), Proposition 18 (Section 9.5).
- Lidl & Niederreiter, *Finite Fields*, Theorem 2.8.
- Conrad, K., *Cyclic Groups* (UConn lecture notes).
- Bilkent University, *Finite Fields*, Chapter 11, Theorem 11.8.
- Franz, *Number Theory*, Chapter 11: Finite Fields and Primitive Roots.
- MathOverflow, *Collecting proofs that finite multiplicative subgroups of fields are cyclic*.
