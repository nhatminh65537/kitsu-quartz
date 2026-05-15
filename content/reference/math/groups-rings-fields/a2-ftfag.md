---
title: "A2. Fundamental Theorem of Finite Abelian Groups"
type: math-component
tags: [math, groups-rings-fields, group-theory, abelian-groups, ftfag, appendix, appendix-a2]
aliases: [FTFAG Proof, A2, Fundamental Theorem of Finite Abelian Groups]
created: 2026-05-15
---

> **Prerequisites**: [[13-direct-products-and-ftfag|13. Direct Products and FTFAG]]
> **Lesson type**: Math Component — Appendix
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $G$ | Nhóm Abel hữu hạn |
> | $\mathbb{Z}/n\mathbb{Z}$ | Nhóm cyclic cấp $n$ |
> | $\times$ | Tích trực tiếp (direct product) |
> | $\oplus$ | Tổng trực tiếp (direct sum) — tương đương $\times$ với hữu hạn nhân tử |
> | $\gcd(a, b)$ | Ước chung lớn nhất |
> | $\phi(n)$ | Hàm phi Euler |
> | $p$ | Số nguyên tố |

---

## Motivation

Định lý Cơ bản về Nhóm Abel Hữu hạn (FTFAG) là một trong những kết quả phân loại hoàn chỉnh đầu tiên trong đại số: **mọi nhóm Abel hữu hạn đều phân tích được thành tích trực tiếp của các nhóm cyclic**, và phân tích này là duy nhất. Điều này có nghĩa ta có thể "liệt kê" tất cả các nhóm Abel hữu hạn (sai khác đẳng cấu) một cách hệ thống — một kết quả cực kỳ mạnh mẽ.

---

## 1. Phát biểu Định lý

> [!abstract] Theorem A2.1 — Fundamental Theorem of Finite Abelian Groups (FTFAG)
> Mọi nhóm Abel hữu hạn $G \neq \{0\}$ đều đẳng cấu với một tích trực tiếp của các nhóm cyclic cấp lũy thừa nguyên tố:
>
> $$
> G \cong \mathbb{Z}/p_1^{e_1}\mathbb{Z} \times \mathbb{Z}/p_2^{e_2}\mathbb{Z} \times \cdots \times \mathbb{Z}/p_k^{e_k}\mathbb{Z}
> $$
>
> với $p_i$ nguyên tố (không nhất thiết phân biệt). Khai triển này là **duy nhất** lên tới sắp xếp thứ tự. Đây gọi là **dạng primary decomposition** (hay elementary divisor form).
>
> **Dạng tương đương (invariant factor form)**:
>
> $$
> G \cong \mathbb{Z}/d_1\mathbb{Z} \times \mathbb{Z}/d_2\mathbb{Z} \times \cdots \times \mathbb{Z}/d_r\mathbb{Z}
> $$
>
> với $d_1 \mid d_2 \mid \cdots \mid d_r$, $d_r \geq 2$. Dãy $(d_1, \ldots, d_r)$ là duy nhất.

> [!info] Hai dạng — Hai góc nhìn
> - **Primary decomposition**: nhóm được "phân rã hoàn toàn" thành các $p$-nhóm cyclic. Hữu ích khi nghiên cứu cấu trúc địa phương (từng nguyên tố).
> - **Invariant factor form**: mỗi $d_i$ chia hết $d_{i+1}$. Hữu ích khi so sánh hai nhóm (hai nhóm đẳng cấu $\iff$ cùng dãy invariant factor).

---

## 2. Phân tích $p$-phần (Primary Decomposition)

**Bước 1: Phân tích thành $p$-phần.**

> [!abstract] Lemma A2.2 — $p$-Primary Decomposition
> Cho $G$ nhóm Abel hữu hạn và $|G| = p_1^{a_1} \cdots p_k^{a_k}$ (phân tích nguyên tố). Khi đó:
>
> $$
> G \cong G_{p_1} \times G_{p_2} \times \cdots \times G_{p_k}
> $$
>
> trong đó $G_{p_i} = \{\alpha \in G : p_i^m \alpha = 0 \text{ với một } m \geq 0\}$ là **$p_i$-phần** (primary component) của $G$.

**Proof (phác thảo).**
Định nghĩa $\pi_i: G \to G$ là $\pi_i(\alpha) = \frac{|G|}{p_i^{a_i}} \alpha$. Vì $\gcd\left(\frac{|G|}{p_i^{a_i}}, p_i^{a_i}\right) = 1$, mỗi $\alpha$ có thể viết duy nhất dưới dạng tổ hợp của các ảnh qua $\pi_i$. Đây là hệ quả của Định lý Số dư Trung Hoa (CRT) áp dụng cho các cấp nguyên tố cùng nhau. Cụ thể, ta chứng minh $G$ là tổng trực tiếp nội bộ (internal direct sum) của các $G_{p_i}$. $\blacksquare$

**Bước 2: Phân tích $p$-nhóm thành cyclic.**

> [!abstract] Lemma A2.3 — $p$-nhóm Abel hữu hạn phân tích được thành cyclic
> Mọi $p$-nhóm Abel hữu hạn $A$ (tức $|A| = p^n$) đều đẳng cấu với:
>
> $$
> A \cong \mathbb{Z}/p^{e_1}\mathbb{Z} \times \mathbb{Z}/p^{e_2}\mathbb{Z} \times \cdots \times \mathbb{Z}/p^{e_r}\mathbb{Z}
> $$
>
> với $e_1 \geq e_2 \geq \cdots \geq e_r \geq 1$ và $e_1 + \cdots + e_r = n$.

**Proof (phác thảo, quy nạp theo $n$).**

- **Cơ sở** $n = 1$: $|A| = p$, $A$ cyclic (hệ quả Lagrange: mọi phần tử không tầm thường có cấp $p$).
- **Quy nạp**: Lấy $a \in A$ có cấp cực đại $p^{e_1}$. Ta muốn chứng minh tồn tại nhóm con $B \leq A$ sao cho $A = \langle a \rangle \times B$ (tổng trực tiếp nội bộ).

Xét ánh xạ $\psi: A \to A$ định bởi $\psi(\alpha) = p^{e_1 - 1}\alpha$. Phân tích $A/pA$ như $\mathbb{F}_p$-không gian vector. Nếu $a \notin pA$ (tức $a$ không viết được dạng $p\alpha$), thì có thể chứng minh $\langle a \rangle \cap B = \{0\}$ và $A = \langle a \rangle + B$ với $B$ là phần bù.

Áp dụng giả thuyết quy nạp cho $B$ ($|B| = p^{n-e_1} < p^n$). $\blacksquare$

---

## 3. Chuyển đổi giữa Hai dạng

> [!abstract] Theorem A2.4 — Chuyển đổi Primary $\leftrightarrow$ Invariant Factor
> Từ dạng primary $\prod \mathbb{Z}/p^{e_{ij}}\mathbb{Z}$ sang dạng invariant factor bằng cách dùng Chinese Remainder Theorem (CRT) để gom các nhân tử của các số nguyên tố khác nhau:
>
> $$
> \mathbb{Z}/p^a\mathbb{Z} \times \mathbb{Z}/q^b\mathbb{Z} \cong \mathbb{Z}/p^a q^b \mathbb{Z} \quad (\gcd(p^a, q^b) = 1).
> $$

**Thuật toán chuyển đổi (từ primary sang invariant factor):**

1. Viết tất cả các lũy thừa nguyên tố $p_i^{e_{ij}}$ thành một bảng, mỗi cột là một nguyên tố.
2. Sắp xếp mỗi cột theo thứ tự giảm dần của số mũ.
3. Với mỗi dòng, nhân các giá trị trong dòng lại với nhau (CRT) để được một invariant factor.
4. Kết quả: dãy $d_1 \mid d_2 \mid \cdots \mid d_r$.

> [!example] Example A2.5 — Phân loại nhóm Abel cấp $36$
> $36 = 2^2 \times 3^2$.
>
> **Dạng primary:**
> - $2$-phần (cấp $4$): $\mathbb{Z}/4\mathbb{Z}$ hoặc $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$.
> - $3$-phần (cấp $9$): $\mathbb{Z}/9\mathbb{Z}$ hoặc $\mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z}$.
>
> Tổng hợp: $2 \times 2 = 4$ nhóm Abel cấp $36$ (sai khác đẳng cấu):
>
> | # | Primary Decomposition | Invariant Factor Form |
> |---|----------------------|----------------------|
> | 1 | $\mathbb{Z}/4\mathbb{Z} \times \mathbb{Z}/9\mathbb{Z}$ | $\mathbb{Z}/36\mathbb{Z}$ |
> | 2 | $\mathbb{Z}/4\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z}$ | $\mathbb{Z}/12\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z}$ |
> | 3 | $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/9\mathbb{Z}$ | $\mathbb{Z}/18\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$ |
> | 4 | $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z}$ | $\mathbb{Z}/6\mathbb{Z} \times \mathbb{Z}/6\mathbb{Z}$ |

---

## 4. Ví dụ Phân loại

> [!example] Example A2.6 — Phân loại nhóm Abel cấp $72$
> $72 = 2^3 \times 3^2$.
>
> **$2$-phần** ($8$): $3$ khả năng
> - $\mathbb{Z}/8\mathbb{Z}$
> - $\mathbb{Z}/4\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$
> - $\mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z} \times \mathbb{Z}/2\mathbb{Z}$
>
> **$3$-phần** ($9$): $2$ khả năng
> - $\mathbb{Z}/9\mathbb{Z}$
> - $\mathbb{Z}/3\mathbb{Z} \times \mathbb{Z}/3\mathbb{Z}$
>
> Tổng: $3 \times 2 = 6$ nhóm Abel cấp $72$.

> [!example] Example A2.7 — Đếm số nhóm Abel
> Số lượng nhóm Abel hữu hạn (sai khác đẳng cấu) cấp $n = \prod p_i^{a_i}$ là:
>
> $$
> \prod_i \pi(a_i)
> $$
>
> trong đó $\pi(a)$ là **hàm partition** — số cách viết $a$ thành tổng các số nguyên dương.
>
> | $n$ | Factorization | Số nhóm Abel |
> |-----|--------------|-------------|
> | $8 = 2^3$ | $2^3$ | $\pi(3) = 3$ |
> | $36 = 2^2 \cdot 3^2$ | — | $\pi(2) \cdot \pi(2) = 2 \cdot 2 = 4$ |
> | $72 = 2^3 \cdot 3^2$ | — | $\pi(3) \cdot \pi(2) = 3 \cdot 2 = 6$ |
> | $100 = 2^2 \cdot 5^2$ | — | $2 \cdot 2 = 4$ |

---

## 5. Tính Duy nhất

> [!abstract] Theorem A2.8 — Tính Duy nhất của Phân tích
> Cả dạng primary decomposition và invariant factor form của một nhóm Abel hữu hạn đều là duy nhất (sai khắc hoán vị các nhân tử).

**Proof (phác thảo).**
Tính duy nhất được chứng minh bằng cách phân tích cấu trúc của $pG$ và $G[p] = \{g \in G : pg = 0\}$ với các nguyên tố $p$.

Cụ thể, với $p$-nhóm $A$ cấp $p^n$:
- $\dim_{\mathbb{F}_p} A/pA = r$ (số nhân tử cyclic trong phân tích).
- $\dim_{\mathbb{F}_p} p^{k-1}A / p^k A$ xác định số nhân tử có cấp $\geq p^k$.

Các chiều này là bất biến đẳng cấu, từ đó suy ra dãy $(e_1, \ldots, e_r)$ là duy nhất. $\blacksquare$

---

## 6. SageMath — Phân tích Nhóm Abel

```sage
# Phân tích nhóm Abel hữu hạn trong SageMath
# Sử dụng AbelianGroup và elementary_divisors

# Ví dụ: nhóm Abel cấp 72
G = AbelianGroup([2^3, 3^2])  # không đúng cú pháp
# Cách đúng:
G = AbelianGroup([8, 9])  # Z/8Z × Z/9Z ≅ Z/72Z
print(f"G ≅ {G}")
print(f"Invariant factors: {G.elementary_divisors()}")

# Liệt kê TẤT CẢ các nhóm Abel cấp 72 (sai khác đẳng cấp)
from itertools import product

def abelian_groups_of_order(n):
    """Trả về danh sách tất cả nhóm Abel cấp n (dạng primary decomposition)."""
    # Phân tích n thành thừa số nguyên tố
    fac = factor(n)
    primary_options = []
    for p, a in fac:
        # Tất cả partition của a
        parts = Partitions(a).list()
        opts = [[p**e for e in part] for part in parts]
        primary_options.append(opts)
    
    groups = []
    for combo in product(*primary_options):
        # combo là tuple của các list; dùng list comprehension để flatten
        flat = sorted([x for sublist in combo for x in sublist], reverse=True)
        groups.append(flat)
    return groups

n = 72
groups_72 = abelian_groups_of_order(n)
print(f"\nSố nhóm Abel cấp {n}: {len(groups_72)}")
for i, g in enumerate(groups_72, 1):
    print(f"  {i}. {g}")

# Chuyển sang dạng invariant factor
def primary_to_invariant(primary):
    """Chuyển primary decomposition thành invariant factors."""
    # Nhóm theo số nguyên tố
    by_prime = {}
    for q in primary:
        p = list(factor(q))[0][0]
        by_prime.setdefault(p, []).append(q)
    
    # Sắp xếp mỗi cột giảm dần, pad bằng 1
    max_len = max(len(v) for v in by_prime.values())
    columns = {}
    for p, vals in by_prime.items():
        vals.sort(reverse=True)
        columns[p] = vals + [1]*(max_len - len(vals))
    
    # Nhân từng dòng
    invariants = []
    for i in range(max_len):
        d = prod(col[i] for col in columns.values())
        if d > 1:
            invariants.append(d)
    invariants.sort()
    return invariants

for g in groups_72:
    inv = primary_to_invariant(g)
    print(f"  Primary {g} -> Invariant factors {inv}")
```

---

## References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), Chapter 5.2.
- Lang, *Algebra* (3rd ed.), Chapter I §10.
- Hungerford, *Algebra*, Chapter II §2.
- Conrad, K., *The Fundamental Theorem of Finite Abelian Groups* (UConn lecture notes).
- Stillwell, J., *Classical Topology and Combinatorial Group Theory*, Chapter 5.
