---
title: 02. Extension Fields & Tower Extensions
tags: [math, pairing, elliptic-curves, lesson-02]
aliases: [Extension Fields và Tower Extensions]
created: 2026-03-09
---
# 2. Extension Fields và Tower Extensions

> **Prerequisites**: [[01-ecc-finite-field-review|ECC & Finite Field Review]] — đặc biệt phần embedding degree và $\mu_n$ **Objectives**:
> 
> - Nắm vững cấu trúc $\mathbb{F}_{q^k}$ như vector space trên $\mathbb{F}_q$, cách xây dựng qua đa thức bất khả quy
> - Hiểu subfield lattice và tại sao pairing output rơi vào $\mathbb{F}_{q^k}^\times$
> - Hiểu roots of unity $\mu_n$ và vị trí của chúng trong tower extension
> - Hiểu cấu trúc tower $\mathbb{F}_p \subset \mathbb{F}_{p^2} \subset \mathbb{F}_{p^6} \subset \mathbb{F}_{p^{12}}$ dùng trong BN254/BLS12-381

---

## Motivation / Intuition

Sau khi học Lesson 01, ta biết rằng pairing là ánh xạ $e: E[n] \times E[n] \to \mu_n$, trong đó $\mu_n \subset \mathbb{F}_{q^k}^\times$. Điều này đặt ra ngay câu hỏi: **$\mathbb{F}_{q^k}$ là gì và làm thế nào làm việc với nó?**

Khác với $\mathbb{F}_q$ — trường nguyên thủy mà ta quen thuộc — $\mathbb{F}_{q^k}$ là một **extension field** (trường mở rộng). Phần tử của nó không phải số nguyên từ $0$ đến $q-1$, mà là các đa thức bậc $< k$ với hệ số trong $\mathbb{F}_q$. Nhân hai phần tử nghĩa là nhân hai đa thức rồi rút gọn modulo một đa thức bất khả quy bậc $k$.

Tại sao phải hiểu điều này? Vì trong Miller's algorithm (Lesson 07), mỗi bước tính toán thực hiện arithmetic trong $\mathbb{F}_{q^k}$. Nếu $k = 12$ (như BN254), thao tác này có thể rất tốn kém nếu không có cấu trúc tốt. Kỹ thuật **tower extension** — xây dựng $\mathbb{F}_{q^{12}}$ qua các mở rộng nhỏ hơn $\mathbb{F}_{q^2}, \mathbb{F}_{q^6}$ — là lý do tại sao pairing khả thi trong thực tế.

---

## Trường Hữu Hạn và Extension Fields

### Definition

> [!definition] Definition 2.1 — Trường Hữu Hạn (Finite Field)
> Với mọi số nguyên tố $p$ và số nguyên $m \geq 1$, tồn tại duy nhất (đến đẳng cấu) một **trường hữu hạn** (finite field) với $q = p^m$ phần tử, ký hiệu $\mathbb{F}_q$ hoặc $\text{GF}(q)$.
> 
> Cụ thể, $\mathbb{F}_{p^m} \cong \mathbb{F}_p[X] / (f(X))$ trong đó $f \in \mathbb{F}_p[X]$ là bất kỳ đa thức bất khả quy bậc $m$.
> 
> $\mathbb{F}_q^* = \mathbb{F}_q \setminus {0}$ là nhóm cyclic bậc $q - 1$.

> [!theorem] Theorem 2.2 — Phân loại trường hữu hạn
> Mọi trường hữu hạn có đặc số $p$ và order $q = p^m$. Ngược lại, với mọi $q = p^m$:
> 
> $$ \mathbb{F}_q = \{ \alpha \in \bar{\mathbb{F}}_p \mid \alpha^q = \alpha \} $$
> 
> — tức là $\mathbb{F}_q$ chính là tập nghiệm của $X^q - X$ trong $\bar{\mathbb{F}}_p$.

**Ý nghĩa**: Frobenius $\phi_q: \alpha \mapsto \alpha^q$ fix chính xác $\mathbb{F}_q$. Đây là lý do Frobenius trở đi trở lại trong mọi tính toán.

### Definition

> [!definition] Definition 2.3 — Extension Field và Degree
> $\mathbb{F}_{q^k}$ là một **extension field** (trường mở rộng) của $\mathbb{F}_q$ với **degree** $k$. Ký hiệu $[\mathbb{F}_{q^k} : \mathbb{F}_q] = k$.
> 
> Với tư cách vector space trên $\mathbb{F}_q$, $\mathbb{F}_{q^k}$ có số chiều (dimension) bằng $k$. Nếu ${1, \alpha, \alpha^2, \ldots, \alpha^{k-1}}$ là basis (ở đây $\alpha$ là nghiệm của đa thức bất khả quy bậc $k$), thì mỗi phần tử của $\mathbb{F}_{q^k}$ viết được duy nhất là:
> 
> $$ a_0 + a_1\alpha + a_2\alpha^2 + \cdots + a_{k-1}\alpha^{k-1}, \quad a_i \in \mathbb{F}_q $$

> [!example] Example 2.4 — Xây dựng $\mathbb{F}_{11^2}$
> Trên $\mathbb{F}_{11}$: $x^2 + 1$ là bất khả quy vì $-1 \equiv 10$ không là số chính phương mod 11 (các số chính phương là ${1,3,4,5,9}$).
> 
> Đặt $i$ là nghiệm của $x^2 + 1$, tức $i^2 = -1$. Khi đó:
> 
> $$ \mathbb{F}_{11^2} = \mathbb{F}_{11}[i]/(i^2 + 1) = {a + bi \mid a, b \in \mathbb{F}_{11}} $$
> 
> có $11^2 = 121$ phần tử. Phép nhân:
> 
> $$ (3 + 2i)(4 + 7i) = 12 + 21i + 8i + 14i^2 = (12 - 14) + (21+8)i = -2 + 29i \equiv 9 + 7i \pmod{11} $$

---

## Subfield Lattice và Containment

### Theorem

> [!theorem] Theorem 2.5 — Subfield Lattice của $\mathbb{F}_{p^n}$
> $\mathbb{F}_{p^d}$ là subfield của $\mathbb{F}_{p^n}$ khi và chỉ khi $d \mid n$.
> 
> Ngược lại, với mỗi $d \mid n$, tồn tại duy nhất một subfield $\mathbb{F}_{p^d} \subset \mathbb{F}_{p^n}$.
> 
> Vì vậy, cấu trúc của các subfield tương ứng chính xác với cấu trúc divisor của $n$.

> [!example] Example 2.6 — Subfield lattice của $\mathbb{F}_{p^{12}}$
> Các divisor của $12$ là ${1, 2, 3, 4, 6, 12}$, nên các subfield là:
> 
> $$ \mathbb{F}_p \subset \mathbb{F}_{p^2} \subset \mathbb{F}_{p^4} \subset \mathbb{F}_{p^{12}} $$
> 
> $$ \mathbb{F}_p \subset \mathbb{F}_{p^3} \subset \mathbb{F}_{p^6} \subset \mathbb{F}_{p^{12}} $$
> 
> Đây cũng chính là nền tảng cho tower construction của $\mathbb{F}_{p^{12}}$ dùng trong BN254.

> [!note] Remark 2.7
> Ý nghĩa cho Pairing Embedding degree $k$ (Lesson 01) cho biết $\mu_n \subset \mathbb{F}_{q^k}^\times$ nhưng $\mu_n \not\subset \mathbb{F}_{q^j}^\times$ với $j < k$. Bằng Theorem 2.5, điều này tương đương với $k$ là số nhỏ nhất sao cho $n \mid q^k - 1$ — đúng như Definition 1.21.

---

## Roots of Unity trong $\mathbb{F}_{q^k}$

### Definition

> [!definition] Definition 2.8 — Nhóm Roots of Unity (Nhóm Căn Đơn Vị)
> Với $n \geq 1$ và trường $K$ với $\text{char}(K) \nmid n$, nhóm **$n$-th roots of unity** là:
> 
> $$ \mu_n = \{ \zeta \in K \mid \zeta^n = 1 \} = \ker!\left((\cdot)^n : K^\times \to K^\times\right) $$
> 
> Khi $K$ chứa một **primitive $n$-th root of unity** (căn đơn vị nguyên thủy) $\zeta_n$ (tức $\text{ord}(\zeta_n) = n$), thì $\mu_n = \langle \zeta_n \rangle \cong \mathbb{Z}/n\mathbb{Z}$ là nhóm cyclic bậc $n$.

> [!theorem] Theorem 2.9 — $\mu_n$ nằm trong $\mathbb{F}_{q^k}$
> $\mu_n \subset \mathbb{F}_{q^k}^\times$ khi và chỉ khi $n \mid q^k - 1$.
> 
> **Proof.** $\mathbb{F}_{q^k}^\times$ là nhóm cyclic bậc $q^k - 1$. Một nhóm cyclic bậc $N$ chứa subgroup bậc $n$ khi và chỉ khi $n \mid N$. Áp dụng với $N = q^k - 1$. $\blacksquare$

> [!example] Example 2.10 — $\mu_{13}$ trong $\mathbb{F}_{11^{12}}$
> Ta cần $13 \mid 11^k - 1$. Từ ví dụ 1.23, $k = 12$ là nhỏ nhất.
> 
> Vậy $\mu_{13} \subset \mathbb{F}_{11^{12}}^\times$, và đây là trường nhỏ nhất chứa $\mu_{13}$.
> 
> Cụ thể: $\mathbb{F}_{11^{12}}^\times$ là nhóm cyclic bậc $11^{12} - 1$. Vì $13 \mid 11^{12} - 1$, subgroup cyclic bậc $13$ tồn tại và đó là $\mu_{13}$.

> [!note] Remark 2.11 - Pairing output là phần tử của $\mu_n$ 
> Weil pairing $e_n(P, Q)$ cho output trong $\mu_n \subset \mathbb{F}_{q^k}^\times$. Đây là lý do pairing "map" bài toán ECDLP (discrete log trên elliptic curve) sang bài toán DLP trong $\mathbb{F}_{q^k}^\times$ — một trường mà ta có nhiều công cụ tấn công hơn (index calculus). Đây là nội dung của MOV attack (Lesson 11).

---

## Norm Map và Final Exponentiation

### Definition

> [!definition] Definition 2.12 — Norm Map Cho $\mathbb{F}_{q^k} / \mathbb{F}_q$.
> **Norm map** (ánh xạ chuẩn) là:
> 
> $$ N_{\mathbb{F}_{q^k}/\mathbb{F}_q} : \mathbb{F}_{q^k}^\times \to \mathbb{F}_q^\times, \quad \alpha \mapsto \alpha^{1 + q + q^2 + \cdots + q^{k-1}} = \alpha^{(q^k - 1)/(q - 1)} $$
> 
> Đây là tích của tất cả các Galois conjugate của $\alpha$ qua extension $\mathbb{F}_{q^k}/\mathbb{F}_q$.

> [!note] Remark 2.13 - Final Exponentiation trong Tate Pairing 
> Tate pairing (Lesson 08) cho output là phần tử trong $\mathbb{F}_{q^k}^\times / (\mathbb{F}_{q^k}^\times)^n$, không phải trong $\mu_n$ trực tiếp. Để ra được phần tử **duy nhất** trong $\mu_n$, ta phải thực hiện **final exponentiation**:
> 
> $$ \hat{t}_n(P, Q) = t_n(P, Q)^{(q^k - 1)/n} $$
> 
> Đây là lũy thừa $\bmod{\mathbb{F}_{q^k}^\times}$. Nó vừa xác định hóa output (remove $n$-th powers), vừa đảm bảo output nằm trong $\mu_n$ vì $\left(\alpha^{(q^k-1)/n}\right)^n = \alpha^{q^k - 1} = 1$.
> 
> Chi tiết kỹ thuật để tính final exponentiation hiệu quả là một phần quan trọng của optimize pairing implementation.

---

## Tower Extensions cho Pairing

### Definition

> [!definition] Definition 2.14 — Tower Extension (Mở Rộng Tháp)
> Một **tower extension** là dãy các extension field lồng nhau:
> 
> $$ \mathbb{F}_q = K_0 \subset K_1 \subset K_2 \subset \cdots \subset K_r = \mathbb{F}_{q^k} $$
> 
> trong đó mỗi $[K_{i+1} : K_i] = d_i$ là degree nhỏ (thường $2, 3$, hoặc $4$), và $k = d_0 d_1 \cdots d_{r-1}$.

**Tại sao dùng tower?** Nhân hai phần tử trong $\mathbb{F}_{q^k}$ trực tiếp cần $O(k^2)$ phép nhân trong $\mathbb{F}_q$. Nếu chia thành tower, mỗi cấp chỉ nhân trong degree nhỏ, tổng chi phí giảm đáng kể (có thể tới $O(k \log k)$ với các kỹ thuật Karatsuba).

> [!example] Example 2.15 — Tower cho $\mathbb{F}_{p^{12}}$ (BN254 / BLS12-381)
> Với $k = 12 = 2 \times 3 \times 2$, tower chuẩn:
> 
> $$ \mathbb{F}_p \xrightarrow{\deg 2} \mathbb{F}_{p^2} \xrightarrow{\deg 3} \mathbb{F}_{p^6} \xrightarrow{\deg 2} \mathbb{F}_{p^{12}} $$
> 
> **Bước 1**: $\mathbb{F}_{p^2} = \mathbb{F}_p[u] / (u^2 - \beta)$ với $\beta$ là non-residue trong $\mathbb{F}_p$.
> 
> **Bước 2**: $\mathbb{F}_{p^6} = \mathbb{F}_{p^2}[v] / (v^3 - \xi)$ với $\xi$ là non-residue trong $\mathbb{F}_{p^2}$.
> 
> **Bước 3**: $\mathbb{F}_{p^{12}} = \mathbb{F}_{p^6}[w] / (w^2 - v)$, tức $w^2 = v$.
> 
> Mỗi phần tử $a \in \mathbb{F}_{p^{12}}$ biểu diễn là:
> 
> $$ a = a_0 + a_1 w, \quad a_0, a_1 \in \mathbb{F}_{p^6} $$
> 
> Phép nhân $\mathbb{F}_{p^{12}}$: $(a_0 + a_1 w)(b_0 + b_1 w) = (a_0 b_0 + a_1 b_1 v) + (a_0 b_1 + a_1 b_0) w$, chỉ cần 3 phép nhân trong $\mathbb{F}_{p^6}$ (Karatsuba).

> [!note] Remark 2.16 - Towering-Friendly Fields 
> Không phải $k$ nào cũng cho tower đẹp. Điều kiện thuận lợi: mọi ước số nguyên tố của $k$ cũng chia $q - 1$. Với BN254: $p \equiv 3 \pmod{4}$ và $p \equiv 4 \pmod{9}$ được chọn cẩn thận để tower binomial $u^2 - \beta$, $v^3 - \xi$ có thể xây dựng đơn giản.

---

## Galois Group của $\mathbb{F}_{q^k}/\mathbb{F}_q$

### Theorem

> [!theorem] Theorem 2.17 — Galois Group là Cyclic Extension
> $\mathbb{F}_{q^k}/\mathbb{F}_q$ là **Galois extension** (bình thường và tách được). Nhóm Galois:
> 
> $$ \text{Gal}(\mathbb{F}_{q^k}/\mathbb{F}_q) = \langle \phi_q \rangle \cong \mathbb{Z}/k\mathbb{Z} $$
> 
> trong đó $\phi_q : \alpha \mapsto \alpha^q$ là Frobenius automorphism. Tức là mọi automorphism giữ $\mathbb{F}_q$ đều có dạng $\phi_q^i$ với $0 \leq i < k$.

**Hệ quả quan trọng**: Galois conjugate của $\alpha \in \mathbb{F}_{q^k}$ là $\alpha, \alpha^q, \alpha^{q^2}, \ldots, \alpha^{q^{k-1}}$. Norm map chính là tích của tất cả conjugate (Definition 2.12). Đây là cơ sở của tính chất **Galois-equivariance** của Weil pairing (Lesson 06).

> [!example] Example 2.18 — Galois action trên $\mu_n$
> Với $\zeta \in \mu_n \subset \mathbb{F}_{q^k}^\times$: $\phi_q(\zeta) = \zeta^q$.
> 
> Nếu $\zeta = e_n(P, Q)$ là output của Weil pairing, thì Frobenius tác động như:
> 
> $$ \phi_q(e_n(P,Q)) = e_n(\phi_q(P), \phi_q(Q)) = e_n(P, Q)^q = \zeta^q $$
> 
> Đây là tính chất **Galois-equivariance** của pairing — sẽ được dùng để chứng minh non-degeneracy trong Lesson 06.

---

## Quadratic Residues và Non-Residues

> [!definition] Definition 2.19 — Quadratic (Non-)Residue
> $a \in \mathbb{F}_q$ là **quadratic residue** (số chính phương, QR) nếu $\exists x \in \mathbb{F}_q$ sao cho $x^2 = a$. Ngược lại là **quadratic non-residue** (QNR).
> 
> Số QR trong $\mathbb{F}_q^*$ là $(q-1)/2$ phần tử (khi $q$ lẻ). Kiểm tra: $a$ là QR $\Leftrightarrow$ $a^{(q-1)/2} = 1$ (tiêu chuẩn Euler).

> [!note] Remark 2.20 — QNR dùng để xây dựng extension
> Để xây $\mathbb{F}_{q^2} = \mathbb{F}_q[u]/(u^2 - \beta)$, cần $\beta$ là QNR trong $\mathbb{F}_q$ (thì $u^2 - \beta$ mới bất khả quy).
> 
> Tương tự, để xây $\mathbb{F}_{q^3} = \mathbb{F}_q[v]/(v^3 - \gamma)$, cần $\gamma$ là cubic non-residue (không phải lũy thừa bậc 3).
> 
> Trong implementation BN254: $\mathbb{F}_{p^2} = \mathbb{F}_p[u]/(u^2 + 1)$ (dùng $\beta = -1$, QNR khi $p \equiv 3 \pmod{4}$).

---

## SageMath Cheatsheet

```python
# Tạo extension field
p = 11
Fp = GF(p)
R.<x> = Fp[]

# F_p^2 = F_p[i]/(i^2 + 1)
Fp2.<i> = Fp.extension(x^2 + 1)
Fp2.order()                              # 121

# Arithmetic trong F_p^2
a = 3 + 2*i
b = 4 + 7*i
a * b                                    # (9 + 7*i) mod 11

# Roots of unity
n = 13
k = Fp.order().multiplicative_order_mod(n)   # embedding degree
Fpk = Fp.extension(k)                    # F_{p^k}
# mu_n trong F_p^k:
zeta = Fpk.multiplicative_generator()^((p^k - 1) // n)
zeta.multiplicative_order()              # == n

# Tower extension cho k=12
Fp = GF(p)
Fp2.<u> = Fp.extension(x^2 + 1)
R2.<y> = Fp2[]
Fp6.<v> = Fp2.extension(y^3 - (1+i))    # xi = 1+i (cần kiểm tra là non-cube)
R6.<z> = Fp6[]
Fp12.<w> = Fp6.extension(z^2 - v)

# Galois group
Fp2.galois_group()                       # cyclic of order 2
# Frobenius
alpha = Fp2.random_element()
alpha^p == alpha.frobenius()             # True (Frobenius = raise to p)

# Norm map
alpha.norm()                             # N(alpha) = alpha^(p^2 - 1)/(p - 1) = alpha^(p+1)
alpha.norm() == (alpha * alpha^p)        # True for degree-2 extension
```

**SageMath docs**: [Finite Fields](https://doc.sagemath.org/html/en/reference/finite_rings/sage/rings/finite_rings/finite_field_constructor.html)

---

## Summary / Key Takeaways

- $\mathbb{F}_{q^k} = \mathbb{F}_q[X]/(f(X))$ với $f$ bất khả quy bậc $k$; là vector space $k$-chiều trên $\mathbb{F}_q$.
- Subfield lattice: $\mathbb{F}_{p^d} \subset \mathbb{F}_{p^n}$ khi và chỉ khi $d \mid n$.
- $\mu_n \subset \mathbb{F}_{q^k}^\times$ khi và chỉ khi $n \mid q^k - 1$ — đây là điều kiện embedding degree.
- $\mathbb{F}_{q^k}^\times$ là nhóm cyclic bậc $q^k - 1$; $\mu_n$ là subgroup cyclic bậc $n$ của nó.
- **Galois group** $\text{Gal}(\mathbb{F}_{q^k}/\mathbb{F}_q) = \langle \phi_q \rangle \cong \mathbb{Z}/k\mathbb{Z}$ sinh bởi Frobenius.
- **Norm map**: $N(\alpha) = \alpha^{(q^k-1)/(q-1)}$ — tích các Galois conjugate.
- **Final exponentiation** $\alpha \mapsto \alpha^{(q^k-1)/n}$ đưa output Tate pairing về đại diện duy nhất trong $\mu_n$.
- **Tower extension** $\mathbb{F}_p \subset \mathbb{F}_{p^2} \subset \mathbb{F}_{p^6} \subset \mathbb{F}_{p^{12}}$ cho phép arithmetic hiệu quả trong $\mathbb{F}_{p^{12}}$.

---

## References

- Lidl, R. & Niederreiter, H. _Finite Fields_, Cambridge UP — định lý phân loại và subfield lattice.
- Washington, _Elliptic Curves: Number Theory and Cryptography_, Ch. 6.4–6.5.
- Benger & Scott, _Constructing Tower Extensions of Finite Fields for Implementation of Pairing-Based Cryptography_, WAIFI 2010 — [ePrint](https://eprint.iacr.org/2009/556.pdf)
- Costello, _Pairing for Beginners_, Ch. 3 — tower arithmetic cho BN254.
- Sutherland, MIT 18.783 Lecture Notes 2022, Lecture 2 — finite fields and Frobenius.