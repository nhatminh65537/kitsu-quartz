---
title: "05. Factors and Lattices — Setup"
type: math-component
tags: [lll, polynomial-factoring, p-adic, hensel, math-component, lesson-05]
aliases: [Factors and Lattices, p-adic Factor, Lattice of Divisible Polynomials]
source: "Factoring Polynomials with Rational Coefficients — A.K. Lenstra, H.W. Lenstra Jr., L. Lovász, 1982"
created: 2026-03-25
---

> **Prerequisites**: [[03-lll-reduction-algorithm|03. LLL Basis Reduction Algorithm]] — reduced basis, thuật toán LLL; [[02-reduced-basis-properties|02. Properties of Reduced Bases]] — Hadamard's inequality (1.10), Proposition (1.11)  
> 🔴 **Prerequisite references**: Knuth — *The Art of Computer Programming Vol. 2* [7] (Berlekamp's algorithm §4.6.2; Hensel's lemma §4.6.2.22); Cassels [4] (Chap. I Theorem I.A — existence of basis with prescribed leading degrees)  
> **Lesson type**: Math Component  
> **Covers**: §2: Setup (2.1)–(2.4), Proposition (2.5), Lattice L construction (2.6)–(2.8), Proposition (2.7) statement (proof ở A0)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Số nguyên tố |
> | $k$ | Số nguyên dương (precision của p-adic lift) |
> | $f \in \mathbb{Z}[X]$ | Đa thức cần phân tích, $\deg(f) = n > 0$ |
> | $h \in \mathbb{Z}[X]$ | p-adic approximate factor (monic, irreducible mod $p$) |
> | $l = \deg(h)$ | Bậc của $h$, $0 < l \le n$ |
> | $h_0$ | Nhân tử bất khả quy thực sự của $f$ trong $\mathbb{Z}[X]$ |
> | $m$ | Bậc tối đa — bound tìm kiếm, $m \ge l$ |
> | $L$ | Lattice các đa thức bậc $\le m$ chia hết cho $(h \bmod p^k)$ |
> | $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$ | Trường hữu hạn cỡ $p$ |
> | $\mathbb{Z}/p^k\mathbb{Z}$ | Vành số nguyên modulo $p^k$ |
> | $\|\cdot\|$ | Norm đa thức: $\|\sum a_i X^i\| = (\sum a_i^2)^{1/2}$ |

---

## Động lực

Đến đây chúng ta có một công cụ mạnh: thuật toán LLL tìm được **vector ngắn** trong một lattice bất kỳ. Bây giờ cần xây dựng một lattice sao cho vector ngắn trong đó **chính là nhân tử bất khả quy** $h_0$ của $f$.

Ý tưởng: nhân tử $h_0$ vừa chia hết $f$ (nên hệ số tương đối nhỏ so với $f$), vừa phải là đa thức chia hết cho approximate factor $h$ theo modulo $p^k$. Tập tất cả đa thức thỏa điều kiện thứ hai tạo thành một **lattice $L$**. Nếu $p^k$ đủ lớn, vector ngắn nhất trong $L$ chính là $h_0$.

---

## Setup — Điều Kiện Trên $h$

Cố định $f \in \mathbb{Z}[X]$ bậc $n > 0$ và $h \in \mathbb{Z}[X]$ thỏa bốn điều kiện:

> [!note] Điều Kiện (2.1)–(2.4)
>
> - **(2.1)** $h$ có **leading coefficient** bằng 1 (monic).
> - **(2.2)** $(h \bmod p^k)$ **chia hết** $(f \bmod p^k)$ trong $(\mathbb{Z}/p^k\mathbb{Z})[X]$.
> - **(2.3)** $(h \bmod p)$ là **bất khả quy** trong $\mathbb{F}_p[X]$.
> - **(2.4)** $(h \bmod p)^2$ **không chia hết** $(f \bmod p)$ trong $\mathbb{F}_p[X]$.

Đặt $l = \deg(h)$; do đó $0 < l \le n$.

**Diễn giải**: $h$ là một **p-adic factor** của $f$ — nó lift một nhân tử bất khả quy của $f \bmod p$ lên độ chính xác $p^k$. Điều kiện (2.4) đảm bảo $h \bmod p$ xuất hiện trong phân tích của $f \bmod p$ đúng **bậc một** (simple factor), tức là $f$ squarefree modulo $p$.

Cách xây dựng $h$ thỏa (2.1)–(2.4):
1. Dùng **Berlekamp's algorithm** để phân tích $f \bmod p$ thành nhân tử bất khả quy trong $\mathbb{F}_p[X]$.
2. Chọn một nhân tử bất khả quy, gọi là $h \bmod p$ (thỏa (2.3), (2.4)).
3. Dùng **Hensel's lemma** để lift lên $\bmod p^k$ (thỏa (2.2)).

---

## Proposition (2.5) — Tồn Tại và Duy Nhất của $h_0$

> [!abstract] Proposition 2.5
> Đa thức $f$ có một **nhân tử bất khả quy** $h_0 \in \mathbb{Z}[X]$ sao cho $(h \bmod p)$ chia hết $(h_0 \bmod p)$, và nhân tử này **duy nhất đến dấu**. Hơn nữa, nếu $g$ chia hết $f$ trong $\mathbb{Z}[X]$, thì ba khẳng định sau tương đương:
>
> **(i)** $(h \bmod p)$ chia hết $(g \bmod p)$ trong $\mathbb{F}_p[X]$.  
> **(ii)** $(h \bmod p^k)$ chia hết $(g \bmod p^k)$ trong $(\mathbb{Z}/p^k\mathbb{Z})[X]$.  
> **(iii)** $h_0$ chia hết $g$ trong $\mathbb{Z}[X]$.
>
> Đặc biệt, $(h \bmod p^k)$ chia hết $(h_0 \bmod p^k)$.

**Proof.**

**Tồn tại**: Từ (2.2), $(h \bmod p^k)$ chia hết $(f \bmod p^k)$, suy ra $(h \bmod p)$ chia hết $(f \bmod p)$ (reduce modulo $p$). Vì $(h \bmod p)$ bất khả quy theo (2.3), tồn tại nhân tử bất khả quy $h_0$ của $f$ trong $\mathbb{Z}[X]$ sao cho $(h \bmod p) \mid (h_0 \bmod p)$.

**Duy nhất**: Nếu có hai nhân tử $h_0, h_0'$ đều thỏa, thì $(h \bmod p)^2$ chia hết $(h_0 h_0' \bmod p)$ chia hết $(f \bmod p)$ — mâu thuẫn với (2.4).

**Tương đương (i) ↔ (iii)**: Giả sử (i) — $(h \bmod p) \mid (g \bmod p)$. Từ (2.4), $(h \bmod p)$ không chia $(f/g \bmod p)$, nên $h_0$ không chia $f/g$, vậy $h_0 \mid g$. Chiều (iii) → (i) rõ ràng.

**Tương đương (i) ↔ (ii)**: Giả sử (i). Vì $(h \bmod p)$ và $(f/g \bmod p)$ nguyên tố cùng nhau trong $\mathbb{F}_p[X]$ (từ (2.3) và (i)), tồn tại $\lambda_1, \mu_1 \in \mathbb{Z}[X]$ sao cho $\lambda_1 h + \mu_1(f/g) \equiv 1 \pmod{p}$. Nhân cả hai vế bởi $1 + p\nu_1 + p^2\nu_2 + \cdots + p^{k-1}\nu_1^{k-1}$ (phép lift) và bởi $g$, thu được $\lambda_2 h + \mu_2 f \equiv g \pmod{p^k \mathbb{Z}[X]}$. Vế trái chia hết $(h \bmod p^k)$ nên (ii) đúng. $\blacksquare$

**Ý nghĩa then chốt**: (ii) ↔ (iii) nói rằng tìm nhân tử $h_0$ trong $\mathbb{Z}[X]$ **tương đương** với tìm divisor của $(h \bmod p^k)$ trong $(\mathbb{Z}/p^k\mathbb{Z})[X]$ — cầu nối p-adic ↔ integer.

---

## Lattice $L$ — Construction

Cố định $m \ge l$ (bound bậc tìm kiếm). Định nghĩa:

> [!note] Định nghĩa 2.6 — Lattice $L$
> Cho $m \ge l$. Đặt $L$ là tập tất cả đa thức $g \in \mathbb{Z}[X]$ thỏa $\deg(g) \le m$ và $(h \bmod p^k) \mid (g \bmod p^k)$ trong $(\mathbb{Z}/p^k\mathbb{Z})[X]$.
>
> Đây là một lattice trong không gian vector thực $\mathbb{R}[X]_{\le m} \cong \mathbb{R}^{m+1}$ (đồng nhất đa thức $\sum a_i X^i$ với vector $(a_0, \ldots, a_m)$).
>
> **Basis tường minh** của $L$ (từ (2.1)):
>
> $$
> \{p^k X^i : 0 \le i < l\} \cup \{h X^j : 0 \le j \le m-l\}
> $$
>
> **Determinant**: $d(L) = p^{kl}$.

**Giải thích basis**: Đa thức $p^k X^i$ rõ ràng chia hết $h \bmod p^k$ vì $p^k \equiv 0 \pmod{p^k}$. Đa thức $hX^j$ chia hết $h$ nên chia hết $h \bmod p^k$ theo (2.2). Hai họ này cho đúng $l + (m-l+1) = m+1$ vector basis.

**Determinant**: Ma trận basis là block triangular với block $p^k I_l$ (kích thước $l \times l$) và block hệ số của $h, hX, \ldots, hX^{m-l}$ (có leading coefficient 1 theo (2.1)). Suy ra $d(L) = (p^k)^l \cdot 1^{m-l+1} = p^{kl}$.

**Norm đa thức**: Theo giới thiệu, $\|\sum a_i X^i\| = (\sum a_i^2)^{1/2}$ — trùng với Euclidean norm của vector hệ số. Do đó các bounds về norm lattice vector từ §1 áp dụng trực tiếp.

---

## Proposition (2.7) — Small Lattice Vector ⟹ Factor

Đây là kết quả then chốt: nếu tìm được một đa thức $b \in L$ đủ ngắn, thì $h_0 \mid b$ trong $\mathbb{Z}[X]$.

> [!abstract] Proposition 2.7
> Cho $b \in L$ thỏa điều kiện:
>
> $$
> p^{kl} > \|f\|^m \cdot \|b\|^n \tag{2.8}
> $$
>
> Khi đó $b$ chia hết bởi $h_0$ trong $\mathbb{Z}[X]$. Đặc biệt, $\gcd(f, b) \ne 1$.

> [!info] 🟡 Remark về phiên bản yếu hơn (theo [8] Lenstra AK, 1981)
> Paper [8] chứng minh phiên bản yếu hơn: dưới cùng điều kiện (2.8), $\gcd(f, b) \ne 1$. Chứng minh phiên bản này đơn giản hơn (xem [8, Theorem 2]). Paper này (LLL82) chứng minh điều mạnh hơn: $h_0 \mid b$ — cho phép recover $h_0$ trực tiếp mà không cần tính gcd nhiều lần.
>
> *(theo [8]: A.K. Lenstra — Lattices and factorization of polynomials, Report IW 190/81, Mathematisch Centrum 1981)*

Proof đầy đủ của Proposition (2.7) — kỹ thuật và dài — được trình bày trong [[a0-proof-proposition-2-7|A0. Proof of Proposition (2.7)]].

**Sketch ý tưởng proof**: Giả sử $b \ne 0$ và đặt $g = \gcd(f, b)$. Cần chứng minh $(h \bmod p) \mid (g \bmod p)$ — từ đó theo Prop (2.5), $h_0 \mid g \mid b$.

Giả sử ngược lại $(h \bmod p) \nmid (g \bmod p)$. Xây dựng một lattice phụ trợ $M'$ từ các tổ hợp $\lambda f + \mu b$ với bậc phù hợp. Bằng Hadamard's inequality (1.10) và điều kiện (2.8):

$$
d(M') \le \|f\|^{m'} \|b\|^{n-e} \le \|f\|^m \|b\|^n < p^{kl}
$$

Nhưng nếu $(h \bmod p) \nmid (g \bmod p)$, thì leading coefficients của một basis của $M'$ đều chia hết $p^k$, suy ra $d(M') \ge p^{kl}$ — mâu thuẫn. $\square$

---

## Tại Sao Điều Kiện (2.8) Đủ?

Trực quan: $d(L) = p^{kl}$ là "kích thước" của lattice $L$. Điều kiện (2.8) nói rằng $p^{kl}$ đủ lớn so với tích $\|f\|^m \|b\|^n$.

Từ bound Mignotte (sẽ integrate trong Lesson 06): mọi nhân tử $g$ của $f$ với $\deg(g) \le m$ thỏa $\|g\| \le \binom{2m}{m}^{1/2} \|f\|$. Do đó $h_0 \in L$ và $\|h_0\|$ bị chặn. Nếu $b$ ngắn hơn ngưỡng Mignotte, thì $b$ phải chia hết bởi $h_0$.

---

## Summary

Phần §2 thiết lập pipeline sau:

```mermaid
graph LR
    A[f, h thỏa 2.1-2.4] --> B[Lattice L<br>basis p^k X^i, hX^j<br>d(L) = p^kl]
    B --> C[LLL tìm b1 ngắn trong L]
    C --> D[Nếu b1 ngắn đủ:<br>h0 chia b1]
    D --> E[h0 = gcd(b1,...,bt)]
```

| Kết quả | Nội dung |
|--------|---------|
| Prop (2.5) | Tồn tại duy nhất $h_0$; chia hết modulo $p$ ↔ modulo $p^k$ ↔ trong $\mathbb{Z}[X]$ |
| Def (2.6) | Lattice $L$ của đa thức chia hết $(h \bmod p^k)$; $d(L) = p^{kl}$ |
| Prop (2.7) | Điều kiện (2.8) đảm bảo $b \in L$ ngắn $\Rightarrow h_0 \mid b$ |

**Bài tiếp theo** ([[06-factor-recovery|06. Factor Recovery via LLL]]) sẽ trình bày Propositions (2.13) và (2.16): làm thế nào để từ reduced basis của $L$, đọc ra $h_0$ một cách tường minh — kể cả bậc của $h_0$ và công thức $h_0 = \gcd(b_1, \ldots, b_t)$.

---

## References

- [LLL82] Lenstra, Lenstra, Lovász — *Factoring Polynomials with Rational Coefficients*, Math. Ann. 261 (1982)
- [8] Lenstra AK — *Lattices and factorization of polynomials*, Report IW 190/81, 1981 (🟡 Integrate — weaker form of Prop (2.7))
- [7] Knuth — *The Art of Computer Programming Vol. 2*, Addison-Wesley 1981 (🔴 Prerequisite — Berlekamp §4.6.2, Hensel §4.6.2.22)
- [4] Cassels — *An Introduction to the Geometry of Numbers*, Springer 1971 (🔴 Prerequisite — Chap. I Theorem I.A)
