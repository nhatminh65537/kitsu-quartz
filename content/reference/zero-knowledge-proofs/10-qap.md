---
title: "10. Quadratic Arithmetic Programs"
tags: [cryptography, zero-knowledge-proofs, zkp, qap, polynomials, schwartz-zippel, lesson-10]
aliases: [Quadratic Arithmetic Programs]
created: 2026-03-13
---

> **Prerequisites**: [[09-arithmetic-circuits-and-r1cs|09. Arithmetic Circuits & R1CS]] — R1CS, witness; kiến thức về đa thức, Lagrange interpolation  
> **Objectives**:  
> - Hiểu tại sao cần biến R1CS thành đa thức (polynomial representation)
> - Nắm vững Lagrange interpolation và ý nghĩa của nó trong QAP
> - Định nghĩa chính xác QAP và điều kiện thỏa mãn qua divisibility
> - Hiểu Schwartz-Zippel lemma và tại sao nó cho phép kiểm tra $m$ ràng buộc bằng một phép thử ngẫu nhiên

---

## Motivation

R1CS gồm $m$ ràng buộc — để verify, verifier phải kiểm tra cả $m$ phương trình $(A\mathbf{w})_i \cdot (B\mathbf{w})_i = (C\mathbf{w})_i$ với mỗi $i$. Khi $m$ lớn (hàng triệu), đây là công việc khổng lồ.

Ý tưởng đột phá: thay vì kiểm tra $m$ phương trình, **mã hóa tất cả thành một đa thức duy nhất** và kiểm tra tính chia hết của đa thức đó tại một điểm ngẫu nhiên. Nhờ **Schwartz-Zippel lemma**, một phép thử ngẫu nhiên duy nhất cho phép phát hiện bất kỳ vi phạm nào với xác suất cao.

Đây là chuyển đổi R1CS → QAP, được Gennaro et al. (2013) và Groth (2016) phát triển thành nền tảng của Groth16.

---

## Lagrange Interpolation

Công cụ nền tảng: từ $m$ điểm $(r_1, y_1), \ldots, (r_m, y_m)$ với $r_i$ phân biệt, tồn tại duy nhất đa thức bậc $\leq m-1$ đi qua tất cả các điểm.

> [!definition] Definition 10.1 — Lagrange Interpolation
>
> Cho $m$ điểm $(r_1, y_1), \ldots, (r_m, y_m)$ với $r_i \in \mathbb{F}_p$ phân biệt. Đa thức **Lagrange** $L(X)$ bậc $\leq m-1$ thỏa mãn $L(r_i) = y_i$ là:
>
> $$L(X) = \sum_{i=1}^m y_i \cdot \ell_i(X)$$
>
> trong đó **Lagrange basis polynomials** là:
>
> $$\ell_i(X) = \prod_{j \neq i} \frac{X - r_j}{r_i - r_j}$$
>
> Tính chất: $\ell_i(r_j) = \delta_{ij}$ (1 nếu $i = j$, 0 nếu $i \neq j$).

> [!example] Example 10.2 — Lagrange cho 3 điểm
>
> Cho $(r_1, r_2, r_3) = (1, 2, 3)$ và giá trị $(y_1, y_2, y_3)$. Lagrange basis:
>
> $$\ell_1(X) = \frac{(X-2)(X-3)}{(1-2)(1-3)} = \frac{(X-2)(X-3)}{2}$$
>
> $$\ell_2(X) = \frac{(X-1)(X-3)}{(2-1)(2-3)} = -(X-1)(X-3)$$
>
> $$\ell_3(X) = \frac{(X-1)(X-2)}{(3-1)(3-2)} = \frac{(X-1)(X-2)}{2}$$

### Vanishing Polynomial

> [!definition] Definition 10.3 — Vanishing Polynomial
>
> Cho tập điểm $H = \{r_1, \ldots, r_m\} \subset \mathbb{F}_p$. **Vanishing polynomial** của $H$ là:
>
> $$Z_H(X) = \prod_{i=1}^m (X - r_i)$$
>
> Tính chất: $Z_H(r_i) = 0$ với mọi $r_i \in H$, và $Z_H(X)$ là đa thức bậc $m$ duy nhất (monic) có tính chất này.

$Z_H$ đóng vai trò quan trọng: một đa thức $f$ bị annihilate bởi $Z_H$ (tức là $Z_H \mid f$) khi và chỉ khi $f(r_i) = 0$ với mọi $r_i \in H$.

---

## Schwartz-Zippel Lemma

Đây là công cụ lý thuyết trung tâm của toàn bộ phần này và của SNARKs.

> [!theorem] Theorem 10.4 — Schwartz-Zippel Lemma
>
> Cho đa thức $f(X) \in \mathbb{F}_p[X]$ bậc $d$, **không phải là đa thức không** ($f \not\equiv 0$). Nếu chọn $r \leftarrow \mathbb{F}_p$ ngẫu nhiên:
>
> $$\Pr[f(r) = 0] \leq \frac{d}{p}$$

Diễn giải: Đa thức bậc $d$ có nhiều nhất $d$ nghiệm. Nếu $p \gg d$, xác suất chọn trúng một nghiệm ngẫu nhiên là rất nhỏ.

> [!example] Example 10.5 — Áp dụng Schwartz-Zippel
>
> Trong ZKP thực tế: $d \approx m$ (số constraints), $p \approx 2^{254}$.
>
> $$\Pr[f(r) = 0 \mid f \not\equiv 0] \leq \frac{m}{2^{254}} \approx \frac{10^6}{2^{254}} \approx 2^{-234}$$
>
> Xác suất này **negligible** — verifier có thể tin tưởng rằng nếu $f(r) = 0$ thì $f \equiv 0$.

> [!theorem] Theorem 10.6 — Polynomial Identity Testing (PIT)
>
> Hai đa thức $f(X)$ và $g(X)$ bậc $\leq d$ bằng nhau trên $\mathbb{F}_p$ (tức là $f \equiv g$) khi và chỉ khi chúng đồng nhất. Để kiểm tra $f \equiv g$ với soundness error $d/p$:
>
> Chọn $r \leftarrow \mathbb{F}_p$, kiểm tra $f(r) = g(r)$.
>
> Nếu $f \not\equiv g$, xác suất $f(r) = g(r)$ là $\leq d/p$ (negligible).

Schwartz-Zippel cho phép kiểm tra **đẳng thức đa thức** (polynomial identity) bằng một phép thử ngẫu nhiên duy nhất. Đây là nền tảng của QAP.

---

## Từ R1CS đến QAP

### Bước 1: Encode Witness thành Đa Thức

Chọn các điểm đánh giá $H = \{r_1, \ldots, r_m\} \subset \mathbb{F}_p$ (một điểm cho mỗi constraint).

Với mỗi cột $j \in [n+1]$ của ma trận $A$, định nghĩa đa thức $a_j(X)$ bậc $\leq m-1$ qua Lagrange interpolation:

$$a_j(r_i) = A_{ij} \quad \forall i \in [m]$$

Tương tự, định nghĩa $b_j(X)$ và $c_j(X)$ từ $B$ và $C$.

### Bước 2: Tính Polynomial Tổng Hợp

Định nghĩa:

$$A(X) = \sum_{j=0}^n w_j \cdot a_j(X), \quad B(X) = \sum_{j=0}^n w_j \cdot b_j(X), \quad C(X) = \sum_{j=0}^n w_j \cdot c_j(X)$$

Tính chất then chốt: với mỗi $i \in [m]$:

$$A(r_i) = \sum_j w_j A_{ij} = (A\mathbf{w})_i, \quad B(r_i) = (B\mathbf{w})_i, \quad C(r_i) = (C\mathbf{w})_i$$

### Bước 3: Điều Kiện R1CS thành Đa Thức

R1CS thỏa mãn ⟺ $(A\mathbf{w})_i \cdot (B\mathbf{w})_i = (C\mathbf{w})_i$ với mọi $i$

⟺ $A(r_i) \cdot B(r_i) = C(r_i)$ với mọi $i \in [m]$

⟺ $(A(X) \cdot B(X) - C(X))$ bằng 0 tại mọi $r_i \in H$

⟺ $Z_H(X) \mid (A(X) \cdot B(X) - C(X))$

Tức là tồn tại đa thức $h(X)$ sao cho:

$$A(X) \cdot B(X) - C(X) = h(X) \cdot Z_H(X)$$

---

## Định Nghĩa QAP

> [!definition] Definition 10.7 — Quadratic Arithmetic Program (QAP)
>
> Một **QAP** $Q$ cho quan hệ $R$ với $m$ constraints và $n+1$ variables gồm:
> - Tập điểm $H = \{r_1, \ldots, r_m\} \subset \mathbb{F}_p$
> - Vanishing polynomial $Z_H(X) = \prod_{i=1}^m (X - r_i)$
> - Đa thức $\{a_j, b_j, c_j\}_{j=0}^n$ (bậc $\leq m-1$) từ Lagrange interpolation của $A, B, C$
>
> Witness $\mathbf{w} \in \mathbb{F}_p^{n+1}$ **thỏa mãn** QAP khi và chỉ khi:
>
> $$Z_H(X) \mid A(X) \cdot B(X) - C(X)$$
>
> tức là tồn tại $h(X)$ bậc $\leq m-2$ sao cho:
>
> $$A(X) \cdot B(X) = C(X) + h(X) \cdot Z_H(X)$$

> [!theorem] Theorem 10.8 — Tương Đương R1CS và QAP
>
> $\mathbf{w}$ thỏa mãn R1CS $(A, B, C)$ khi và chỉ khi $\mathbf{w}$ thỏa mãn QAP $Q$ tương ứng.
>
> **Proof**: Theo xây dựng ở trên:
>
> R1CS thỏa mãn ⟺ $(A\mathbf{w})_i \cdot (B\mathbf{w})_i = (C\mathbf{w})_i\ \forall i$
>
> ⟺ $A(r_i) B(r_i) = C(r_i)\ \forall r_i \in H$
>
> ⟺ $A(X)B(X) - C(X)$ triệt tiêu tại mọi $r_i \in H$
>
> ⟺ $Z_H \mid A(X)B(X) - C(X)$. $\blacksquare$

---

## Tại Sao QAP Quan Trọng hơn R1CS?

Câu hỏi quan trọng: tại sao phải biến đổi sang QAP? Ưu điểm của polynomial representation là gì?

### 1. Kiểm Tra Súc Tích bằng Schwartz-Zippel

Verifier muốn kiểm tra $Z_H \mid A \cdot B - C$ mà không cần biết $h$ hay các hệ số đa thức. Với Schwartz-Zippel:

Chọn điểm ngẫu nhiên $\tau \leftarrow \mathbb{F}_p$. Kiểm tra:

$$A(\tau) \cdot B(\tau) = C(\tau) + h(\tau) \cdot Z_H(\tau)$$

Đây là **một phép tính scalar** thay vì $m$ phép kiểm tra. Nếu verifier có thể nhận được $A(\tau), B(\tau), C(\tau), h(\tau)$ từ prover một cách **đáng tin cậy** (tức là prover không thể gian lận), kiểm tra này là soundness error $\leq \deg(A \cdot B - C)/p \approx 2m/p$ (negligible).

### 2. Nền Tảng cho Pairing-Based SNARK

Trong Groth16 (Bài 14), prover cung cấp encrypted evaluations $[A(\tau)]_1, [B(\tau)]_2, [C(\tau)]_1$ (group elements), verifier kiểm tra bằng bilinear pairing mà không cần biết $\tau$. Điều này chỉ khả thi vì tất cả ràng buộc đã được "nén" vào một phương trình đa thức.

### 3. Công Cụ Chung

QAP là cầu nối giữa:
- **Phần phía trên**: R1CS (tính toán, NP)
- **Phần phía dưới**: Polynomial commitments (cryptography)

---

## Ví Dụ Tiếp Nối: QAP cho $x^3 + x + 5 = 35$

Dùng R1CS từ Bài 09, với $H = \{1, 2, 3\}$ (3 constraints). Lagrange basis:

$$\ell_1(X) = \frac{(X-2)(X-3)}{2}, \quad \ell_2(X) = -(X-1)(X-3), \quad \ell_3(X) = \frac{(X-1)(X-2)}{2}$$

Witness $\mathbf{w} = (1, 35, 3, 9, 27)$.

**Đa thức $A(X)$**: tổng hợp các hàng của ma trận $A$ với trọng số $w_j$:
$$A(X) = 0 \cdot \ell_1 + 0 \cdot \ell_2 + (5 \cdot 1 + 1 \cdot 3 + 0 + 27) \cdot \ell_3 + \ldots$$

(Tính đầy đủ sẽ cho $A(X)$ bậc $\leq 2$)

Sau khi tính: ta thu được $A(\tau), B(\tau), C(\tau)$ và kiểm tra $A(\tau) \cdot B(\tau) = C(\tau) + h(\tau) \cdot Z_H(\tau)$.

---

## Summary

- **Lagrange interpolation**: từ $m$ điểm giá trị, dựng đa thức bậc $\leq m-1$ — công cụ cốt lõi để encode R1CS constraints vào đa thức.
- **Vanishing polynomial** $Z_H(X) = \prod (X - r_i)$: bằng 0 tại mọi điểm của $H$.
- **Schwartz-Zippel**: đa thức bậc $d$ không tầm thường có nhiều nhất $d$ nghiệm → kiểm tra identity đa thức bằng một phép thử ngẫu nhiên duy nhất.
- **QAP**: mã hóa $m$ ràng buộc R1CS thành điều kiện **đa thức duy nhất** $A \cdot B = C + h \cdot Z_H$.
- R1CS ⟺ QAP: thỏa mãn R1CS ⟺ $Z_H \mid (A \cdot B - C)$.
- QAP cho phép verifier kiểm tra tất cả $m$ ràng buộc bằng **một phép thử scalar** tại điểm ngẫu nhiên — nền tảng của Groth16 và các pairing-based SNARKs.

---

## References

- Gennaro, Gentry, Parno, Raykova — *Quadratic Span Programs and Succinct NIZKs without PCPs* (2013) — EUROCRYPT
- Groth — *On the Size of Pairing-Based Non-interactive Arguments* (2016) — EUROCRYPT
- Thaler — *Proofs, Arguments, and Zero-Knowledge*, Ch. 5–6 (people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf)
- Vitalik Buterin — *Quadratic Arithmetic Programs from Zero to Hero* (medium.com/@VitalikButerin)
