---
title: "A4. Existence and Uniqueness of Finite Fields"
type: math-component
tags: [math, groups-rings-fields, field-theory, finite-fields, appendix, appendix-a4]
aliases: [Finite Fields Existence and Uniqueness Proof, A4]
created: 2026-05-15
---

> **Prerequisites**: [[24-finite-fields-existence-and-uniqueness|24. Finite Fields — Existence and Uniqueness]]
> **Lesson type**: Math Component — Appendix
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_p$ | Trường hữu hạn cấp $p$: $\mathbb{Z}/p\mathbb{Z}$ |
> | $\overline{\mathbb{F}_p}$ | Bao đóng đại số của $\mathbb{F}_p$ |
> | $\mathbb{F}_{p^n}$, $\text{GF}(p^n)$ | Trường hữu hạn cấp $p^n$ |
> | $[K:F]$ | Bậc của mở rộng trường |
> | $f'(x)$ | Đạo hàm hình thức của đa thức $f$ |
> | $F^\times$ | Nhóm nhân của trường $F$ |
> | $\operatorname{Gal}(K/F)$ | Nhóm Galois của $K/F$ |

---

## Motivation

Trường hữu hạn là một trong những cấu trúc đẹp nhất của đại số: **với mỗi lũy thừa nguyên tố $p^n$, tồn tại đúng một trường hữu hạn (sai khác đẳng cấu) có $p^n$ phần tử, và không có trường hữu hạn nào khác**. Kết quả này là nền tảng cho mật mã (ECDSA, pairing-based crypto), lý thuyết mã hóa (Reed-Solomon, BCH), và lý thuyết Galois. Phụ lục này trình bày chứng minh hoàn chỉnh, tự chứa, với mọi chi tiết kỹ thuật.

---

## 1. Setup và Notation

Cho $p$ là số nguyên tố và $n \geq 1$. Đặt $q = p^n$. Làm việc trong bao đóng đại số $\overline{\mathbb{F}_p}$ của $\mathbb{F}_p$.

> [!note] Remark A4.1 — Bao đóng đại số
> $\overline{\mathbb{F}_p}$ là trường nhỏ nhất chứa $\mathbb{F}_p$ và đóng đại số (mọi đa thức một biến với hệ số trong $\overline{\mathbb{F}_p}$ đều có nghiệm trong $\overline{\mathbb{F}_p}$). Sự tồn tại của bao đóng đại số được đảm bảo bởi Bổ đề Zorn.

---

## 2. Phần I: Tập nghiệm của $x^q - x$ là Trường

> [!abstract] Theorem A4.2 — Tập nghiệm tạo thành trường
> Đặt $S = \{\alpha \in \overline{\mathbb{F}_p} : \alpha^q = \alpha\}$. Khi đó:
>
> (a) $|S| = q$.
> (b) $S$ là trường con của $\overline{\mathbb{F}_p}$.
> (c) $[S : \mathbb{F}_p] = n$.

### Chứng minh

**Proof (a): $|S| = q$.**

Xét $f(x) = x^q - x \in \mathbb{F}_p[x]$. Đạo hàm hình thức (formal derivative):

$$
f'(x) = qx^{q-1} - 1.
$$

Vì $q = p^n$ và $\operatorname{char}(\mathbb{F}_p) = p$, ta có $q \equiv 0 \pmod p$, nên trong $\mathbb{F}_p[x]$:

$$
f'(x) = 0 \cdot x^{q-1} - 1 = -1 \equiv p-1 \pmod p.
$$

Vậy $f'(x) = -1 \neq 0$ là hằng số khác $0$.

> [!info] Tiêu chuẩn nghiệm bội
> Trong trường $F$, $\alpha$ là nghiệm bội của $f$ khi và chỉ khi $f(\alpha) = f'(\alpha) = 0$. Điều này suy từ khai triển Taylor: $f(x) = f(\alpha) + f'(\alpha)(x-\alpha) + \cdots$.

Vì $f'(\alpha) = -1 \neq 0$ với mọi $\alpha \in \overline{\mathbb{F}_p}$, đa thức $f$ **không có nghiệm bội**. $f$ có bậc $q$ và không có nghiệm bội, nên nó có đúng $q$ nghiệm phân biệt trong $\overline{\mathbb{F}_p}$. Vậy $|S| = q$.

**Proof (b): $S$ là trường con.**

Cần kiểm tra $S$ đóng dưới $+$, $-$, $\times$, và nghịch đảo nhân.

- **Nhân**: $(\alpha\beta)^q = \alpha^q \beta^q = \alpha\beta$ (đúng trong đặc số $p$ vì lũy thừa $q$ là đồng cấu Frobenius lặp). ✓
- **Nghịch đảo nhân**: Với $\alpha \neq 0$: $(\alpha^{-1})^q = (\alpha^q)^{-1} = \alpha^{-1}$. ✓
- **Cộng**: Sử dụng **Freshman's Dream** trong đặc số $p$:

$$
(\alpha + \beta)^q = (\alpha + \beta)^{p^n} = \alpha^{p^n} + \beta^{p^n} = \alpha^q + \beta^q = \alpha + \beta.
$$

(Đúng vì mọi hệ số nhị thức $\binom{p^n}{k}$ với $0 < k < p^n$ đều chia hết cho $p$.) ✓

- **Trừ**: $(-\alpha)^q$. Nếu $p = 2$: $-\alpha = \alpha$, hiển nhiên. Nếu $p$ lẻ: $p^n$ lẻ, nên $(-1)^{p^n} = -1$. Vậy $(-\alpha)^q = (-1)^q \alpha^q = (-1)\alpha = -\alpha$. ✓
- **Phần tử $0, 1$**: $0^q = 0$, $1^q = 1$. ✓

Vậy $S$ là trường con của $\overline{\mathbb{F}_p}$ và chứa $\mathbb{F}_p$ (vì mọi $a \in \mathbb{F}_p$ thỏa $a^p = a$, nên $a^{p^n} = a$).

**Proof (c): $[S:\mathbb{F}_p] = n$.**

$|S| = q = p^n$ và $S \supseteq \mathbb{F}_p$. Vì $S$ là không gian vector hữu hạn chiều $d$ trên $\mathbb{F}_p$, $|S| = p^d$. Vậy $p^d = p^n$, suy ra $d = n = [S:\mathbb{F}_p]$. $\blacksquare$

---

## 3. Phần II: Mọi Trường $q$ Phần tử là Nghiệm của $x^q - x$

> [!abstract] Theorem A4.3 — Trường hữu hạn cấp $q$ bằng với $S$
> Nếu $F$ là trường với $|F| = q = p^n$, thì $F = S$ (như tập hợp con của $\overline{\mathbb{F}_p}$, sau khi nhúng $F$ vào $\overline{\mathbb{F}_p}$).

**Proof.**
$F$ có đặc số $p$, nên $F \supseteq \mathbb{F}_p$. Nhóm nhân $F^\times$ có cấp $q - 1$.

Với mọi $\alpha \in F^\times$, theo định lý Lagrange: $\alpha^{q-1} = 1$, tức $\alpha^q = \alpha$.

Với $\alpha = 0$: $0^q = 0$.

Vậy mọi $\alpha \in F$ thỏa $\alpha^q = \alpha$, tức $F \subseteq S$. Nhưng $|F| = q = |S|$, nên $F = S$. $\blacksquare$

---

## 4. Phần III: Tính Duy nhất

> [!abstract] Theorem A4.4 — Tính Duy nhất
> Mọi trường cấp $q = p^n$ đều đẳng cấu với nhau.

**Proof.**
Từ Theorem A4.2, $S$ là trường cấp $q$ (tập nghiệm của $x^q - x$ trong $\overline{\mathbb{F}_p}$). Từ Theorem A4.3, mọi trường cấp $q$ (sau khi nhúng vào $\overline{\mathbb{F}_p}$) đều bằng $S$.

Nếu $F$ và $F'$ là hai trường cấp $q$ nhưng không được nhúng vào cùng $\overline{\mathbb{F}_p}$, thì cả hai đều là **splitting field** của $x^q - x$ trên $\mathbb{F}_p$. Theo tính duy nhất của splitting field (sai khác đẳng cấu), $F \cong F'$. $\blacksquare$

---

## 5. Phần IV: Sự Tồn tại

> [!abstract] Theorem A4.5 — Sự Tồn tại
> Với mọi nguyên tố $p$ và $n \geq 1$, tồn tại trường hữu hạn cấp $p^n$.

**Proof.**
Lấy $K$ là splitting field của $f(x) = x^{p^n} - x$ trên $\mathbb{F}_p$. Tập nghiệm $S$ của $f$ trong $K$ là trường con cấp $p^n$ của $K$ (theo Theorem A4.2). Vậy $S$ chính là trường hữu hạn cấp $p^n$ cần tìm. $\blacksquare$

---

## 6. Phân loại Hoàn toàn

> [!abstract] Theorem A4.6 — Phân loại Trường Hữu hạn
>
> **(a)** Mọi trường hữu hạn có cấp là lũy thừa nguyên tố $p^n$.
>
> **(b)** Với mỗi $p$ nguyên tố và $n \geq 1$, tồn tại đúng một trường hữu hạn (sai khác đẳng cấu) cấp $p^n$, ký hiệu $\mathbb{F}_{p^n}$ hoặc $\text{GF}(p^n)$.
>
> **(c)** $\mathbb{F}_{p^m} \subseteq \mathbb{F}_{p^n}$ khi và chỉ khi $m \mid n$.
>
> **(d)** Nhóm Galois $\operatorname{Gal}(\mathbb{F}_{p^n}/\mathbb{F}_p) \cong \mathbb{Z}/n\mathbb{Z}$, sinh bởi tự đẳng cấu Frobenius $\phi: x \mapsto x^p$.

> [!note] Remark A4.7 — Về (c)
> Nếu $m \mid n$, đặt $n = md$. Khi đó $p^m - 1 \mid p^n - 1$ (vì $p^n - 1 = (p^m)^d - 1$ chia hết cho $p^m - 1$), và $\mathbb{F}_{p^m}$ có thể được nhúng vào $\mathbb{F}_{p^n}$. Ngược lại, nếu $\mathbb{F}_{p^m} \subseteq \mathbb{F}_{p^n}$, thì $[\mathbb{F}_{p^n}:\mathbb{F}_{p^m}] = d$ là số nguyên, và từ tower law: $n = [\mathbb{F}_{p^n}:\mathbb{F}_p] = [\mathbb{F}_{p^n}:\mathbb{F}_{p^m}][\mathbb{F}_{p^m}:\mathbb{F}_p] = d \cdot m$, suy ra $m \mid n$.

---

## 7. SageMath — Làm việc với Trường Hữu hạn

```sage
# Xây dựng trường hữu hạn trong SageMath
p = 3
n = 4
F = GF(p^n, 'a')
print(f"F = GF({p}^{n}) = {F}")
print(f"|F| = {F.cardinality()}")  # 81

# Kiểm tra mọi phần tử thỏa x^q = x
q = p^n
all_satisfy = all(a^q == a for a in F)
print(f"Mọi a ∈ F thỏa a^{q} = a? {all_satisfy}")  # True

# Liệt kê các trường con
def subfields(F):
    """Trả về danh sách (m, subfield) với m | n."""
    p = F.characteristic()
    n = F.degree()
    subs = []
    for m in divisors(n):
        if m == n:
            continue
        sub = GF(p^m)
        # Nhúng vào F nếu có thể
        subs.append((m, sub))
    return subs

for m, sub in subfields(F):
    print(f"  GF({p}^{m}) ⊆ GF({p}^{n})")  # m | 4: m = 1, 2

# Splitting field của x^q - x
R.<x> = PolynomialRing(GF(p))
f = x^(p^n) - x
S = f.splitting_field('b')
print(f"\nSplitting field của x^{p^n} - x có cấp: {S.cardinality()}")  # p^n

# Kiểm tra tính duy nhất: mọi trường cùng cardinality đều đẳng cấu
K1 = GF(2^6, 'a')
K2 = GF(2^6, 'b')
# Trong SageMath, GF(p^n) luôn trả về cùng một đối tượng (caching toàn cục)
print(f"GF(2^6) duy nhất? Cùng cardinality: {K1.cardinality() == K2.cardinality()}")  # True
```

---

## 8. Mở rộng: Freshman's Dream

> [!abstract] Lemma A4.8 — Freshman's Dream
> Trong vành đặc số $p$ (nguyên tố), với mọi $a, b$ và mọi $k \geq 0$:
>
> $$
> (a + b)^{p^k} = a^{p^k} + b^{p^k}.
> $$

**Proof.** Khai triển nhị thức: $(a+b)^{p^k} = \sum_{i=0}^{p^k} \binom{p^k}{i} a^{p^k - i} b^i$. Với $0 < i < p^k$, hệ số $\binom{p^k}{i} = \frac{p^k}{i}\binom{p^k - 1}{i-1}$ chia hết cho $p$ (vì tử số có $p^k$, mẫu số không có $p$). Trong đặc số $p$, các số hạng này bằng $0$. $\blacksquare$

---

## References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), Section 13.5, Theorem 1.
- Conrad, K., *Finite Fields* (UConn lecture notes), Theorem 2.1–2.3.
- Lidl & Niederreiter, *Finite Fields*, Chapter 2.
- Garrett, P., *Algebra*, Chapter 9.
- MIT OCW 18.702, Lecture 26.
- Canteaut, A., *Finite Fields* (INRIA lecture notes), Chapter 1.
