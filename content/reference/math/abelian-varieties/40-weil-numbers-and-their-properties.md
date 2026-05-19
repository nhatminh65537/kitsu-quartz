---
title: "40. Weil Numbers and Their Properties"
type: theory
tags: [math, abelian-varieties, lesson-40]
aliases: [Weil Numbers, Weil q-numbers]
created: 2026-05-19
---

> **Prerequisites**: [[39-frobenius-endomorphism|39. Frobenius Endomorphism π_A]], [[22-characteristic-polynomial-of-endomorphism|22. Characteristic Polynomial of an Endomorphism]]
> **Objectives**:
> - Định nghĩa Weil $q$-number và Weil $q$-polynomial
> - Phát biểu và hiểu ý nghĩa của Định lý Weil: $\pi_A$ là Weil $q$-number
> - Phân tích các ví dụ cụ thể của Weil numbers cho $g = 1$ và $g = 2$
> - Hiểu cấu trúc của conjugacy classes của Weil numbers

---

## Motivation / Intuition

Trong Bài 39, ta biết rằng Frobenius $\pi_A$ là một phần tử của $\operatorname{End}(A)$, và nó có characteristic polynomial $P_{\pi_A}(T) \in \mathbb{Z}[T]$ bậc $2g$. Câu hỏi tự nhiên là: eigenvalues của $\pi_A$ (hay nghiệm của $P_{\pi_A}$) có tính chất đặc biệt gì không?

Câu trả lời là CÓ — và đây là một trong những phát hiện sâu sắc nhất của André Weil vào cuối thập niên 1940. Các eigenvalues $\alpha_1, \ldots, \alpha_{2g}$ của $\pi_A$ đều là **Weil $q$-numbers**: algebraic integers thỏa mãn $|\sigma(\alpha)| = \sqrt{q}$ với mọi embedding $\sigma: \mathbb{Q}(\alpha) \hookrightarrow \mathbb{C}$.

Trực giác hình học: trong hình học phức, nếu ta có complex torus $\mathbb{C}^g/\Lambda$, thì endomorphisms tự nhiên có eigenvalues tác dụng "đồng đều" về cường độ. Weil q-numbers là phiên bản đại số của intuition này trên trường hữu hạn, liên hệ đến điều mà Weil gọi là "Riemann Hypothesis" cho varieties over finite fields.

Điều đặc biệt là mệnh đề ngược cũng đúng (Honda-Tate theorem, Bài 43): mọi Weil $q$-number đều là Frobenius của một abelian variety nào đó. Điều này tạo ra một **phân loại hoàn chỉnh** các isogeny classes của abelian varieties over finite fields.

---

## Weil q-numbers

### Definition

> [!definition] Definition 40.1 — Weil $q$-number  
> Cho $q = p^a$ là một prime power. Một **Weil $q$-number** (số Weil $q$) là một algebraic integer $\pi \in \overline{\mathbb{Q}}$ thỏa mãn: với mọi embedding $\sigma: \mathbb{Q}(\pi) \hookrightarrow \mathbb{C}$,
>
> $$
> |\sigma(\pi)| = \sqrt{q}
> $$
>
> Ký hiệu tập hợp tất cả Weil $q$-numbers là $W(q)$.

> [!definition] Definition 40.2 — Weil $q$-polynomial  
> Một **Weil $q$-polynomial** (đa thức Weil $q$) là một đa thức $P(T) \in \mathbb{Z}[T]$ có bậc chẵn $2g$ thỏa mãn:
> - $P$ monic
> - Mọi nghiệm phức của $P$ đều là Weil $q$-numbers: $|\alpha_i| = \sqrt{q}$ với mọi $i$

Chú ý: nếu $\alpha$ là nghiệm của Weil $q$-polynomial $P \in \mathbb{Z}[T]$ thì $q/\alpha$ (hay $q/\bar{\alpha}$ nếu $P$ có hệ số thực) cũng là nghiệm. Điều này phản ánh **functional equation** của zeta function.

> [!note] Remark 40.3 — Điều kiện đối xứng  
> Nếu $P(T) = \prod(T - \alpha_i)$ là Weil $q$-polynomial, thì tập nghiệm $\{\alpha_i\}$ đóng dưới phép $\alpha \mapsto q/\bar{\alpha}$ (complex conjugate rồi lấy $q$ chia). Điều này tương đương với: $P(T) = T^{2g} q^{-g} P(q/T)$ (sau khi normalize phù hợp). Đây là "functional equation" ở mức đa thức.

### Worked Example

> [!example] Example 40.4 — Weil $q$-numbers cho $g = 1$ (Elliptic Curves)  
> Cho elliptic curve $E/\mathbb{F}_q$, characteristic polynomial của Frobenius có dạng:
>
> $$
> P_\pi(T) = T^2 - tT + q
> $$
>
> với $t \in \mathbb{Z}$, $|t| \leq 2\sqrt{q}$ (điều kiện Hasse). Hai nghiệm $\alpha, \bar{\alpha}$ thỏa:
>
> $$
> |\alpha|^2 = \alpha \bar{\alpha} = q \implies |\alpha| = \sqrt{q}
> $$
>
> Vậy $\alpha$ là Weil $q$-number. Phân loại theo trace $t$:
>
> | $t^2 - 4q$ | Dạng của $\alpha$ | Kiểu elliptic curve |
> |---|---|---|
> | $< 0$ | $\frac{t \pm \sqrt{t^2-4q}}{2} \in \mathbb{C}\setminus\mathbb{R}$ | Ordinary với $\mathbb{Q}(\alpha)$ imaginary quadratic |
> | $= 0$ | $\alpha = \pm\sqrt{q} \in \mathbb{R}$ | Supersingular nếu $p \nmid t$ |
> | $> 0$, nhưng $|t| < 2\sqrt{q}$ | Không thể: $|\alpha| \neq \sqrt{q}$ cho $\alpha$ thực | Không tồn tại |
> | $t = \pm 2\sqrt{q}$ (khi $q$ là số chính phương) | $\alpha = \pm\sqrt{q}$ | Supersingular đặc biệt |
>
> Ví dụ cụ thể với $q = 101$, $t = 2$: $\alpha = 1 + 10i$, $|\alpha| = \sqrt{101} \approx 10.05$ ✓.

> [!example] Example 40.5 — Weil $q$-numbers cho $g = 2$ (Abelian Surfaces)  
> Cho abelian surface $A/\mathbb{F}_q$ (chiều $g = 2$), characteristic polynomial của Frobenius có dạng:
>
> $$
> P_\pi(T) = T^4 - a_1 T^3 + a_2 T^2 - a_1 q T + q^2
> $$
>
> (hệ số "palindromic" vì functional equation). Bốn nghiệm $\alpha_1, \alpha_2, \bar{\alpha}_1, \bar{\alpha}_2$ thỏa $|\alpha_i| = \sqrt{q}$.
>
> Với $q = 101$, ví dụ: $P(T) = T^4 - T^3 + 2T^2 - 101T + 101^2$. Bốn nghiệm (tính số trị) thỏa $|\alpha_i| \approx 10.05 = \sqrt{101}$ ✓.
>
> Số điểm: $|A(\mathbb{F}_{101})| = P_\pi(1) = 1 - 1 + 2 - 101 + 10201 = 10102$.

---

## Định lý Weil cho Abelian Varieties

Đây là kết quả nền tảng của lý thuyết.

### Theorem

> [!theorem] Theorem 40.6 — Định lý Weil (Weil's Theorem)  
> Cho $A$ là một **simple abelian variety** over $\mathbb{F}_q$. Khi đó Frobenius endomorphism $\pi_A \in \operatorname{End}(A)$ là một **Weil $q$-number**: với mọi embedding $\psi: \mathbb{Q}(\pi_A) \hookrightarrow \mathbb{C}$,
>
> $$
> |\psi(\pi_A)| = \sqrt{q}
> $$
>
> Tương đương: characteristic polynomial $P_{\pi_A}(T) \in \mathbb{Z}[T]$ là một Weil $q$-polynomial.

**Proof (sketch).**
Chứng minh đầy đủ dùng Rosati involution và tính dương xác định của nó. Ta phác thảo ý tưởng chính:

**Bước 1.** Với abelian variety $A$ có polarization $\phi: A \to \hat{A}$, Rosati involution $f \mapsto f^\dagger$ trên $D = \operatorname{End}^0(A)$ thỏa mãn: bilinear form $\operatorname{Tr}(x x^\dagger) > 0$ với mọi $x \neq 0$ (tính dương xác định, Theorem 37 từ Bài 37).

**Bước 2.** Từ $\pi_A^\dagger = V_A = q/\pi_A$ (Bài 39), ta có $\pi_A \cdot \pi_A^\dagger = q$.

**Bước 3.** Xét embedding $\psi: \mathbb{Q}(\pi_A) \hookrightarrow \mathbb{C}$. Trong $D \otimes_\mathbb{Q} \mathbb{R}$ (một tích của matrix algebras over $\mathbb{R}$ và $\mathbb{C}$), phần tử $\pi_A$ có eigenvalue $\psi(\pi_A)$ và $\pi_A^\dagger$ có eigenvalue $\overline{\psi(\pi_A)}$ (vì $\dagger$ là involution dương, nó tương ứng với complex conjugate trong từng thành phần phức).

**Bước 4.** Từ $\pi_A \pi_A^\dagger = q$: $\psi(\pi_A) \cdot \overline{\psi(\pi_A)} = |\psi(\pi_A)|^2 = q$, nên $|\psi(\pi_A)| = \sqrt{q}$. $\blacksquare$

Xem chứng minh đầy đủ tại: Oort, *Abelian Varieties over Finite Fields*, Section 3.2; Mumford, *Abelian Varieties*, Chapter IV.

### Corollary

> [!corollary] Corollary 40.7  
> Nếu $\alpha_1, \ldots, \alpha_{2g}$ là eigenvalues của $\pi_A$ (nghiệm của $P_{\pi_A}$), thì:
> - $|\alpha_i| = \sqrt{q}$ với mọi $i$.
> - $\alpha_i \bar{\alpha}_i = q$ (vì $\bar{\alpha}_i = q/\alpha_i$ cũng là Weil $q$-number).
> - $\prod_{i=1}^{2g} \alpha_i = \det(T_\ell(\pi_A)) = \deg(\pi_A) = q^g$.
> - $\sum_{i=1}^{2g} \alpha_i = \text{hệ số của } T^{2g-1}$ trong $P_{\pi_A}(T)$ = trace của $T_\ell(\pi_A)$.

---

## Cấu trúc của Tập Weil q-numbers

### Classification của Weil q-numbers

Weil $q$-numbers có một phân loại tinh tế theo đặc số $p$ và $q = p^a$.

> [!theorem] Theorem 40.8 — Phân loại Weil $q$-numbers thực và phức  
> Cho $\pi$ là một Weil $q$-number. Ta phân loại:
>
> **(R) Real Weil $q$-numbers**: $\pi \in \mathbb{R}$. Khi đó $\pi \in \mathbb{Z}$ và $\pi = \pm p^{a/2}$. Điều này đòi hỏi $a$ phải là số chẵn (tức $q = p^a$ là số chính phương). Chỉ có hai giá trị: $\pi = \sqrt{q}$ hoặc $\pi = -\sqrt{q}$.
>
> **(C) Non-real Weil $q$-numbers**: $\pi \notin \mathbb{R}$. Khi đó $\mathbb{Q}(\pi)$ là một trường phức, và $\pi$ cùng complex conjugate $\bar{\pi}$ đều là Weil $q$-numbers. Ta có $\bar{\pi} = q/\pi$.

**Proof.**
$(R)$: Nếu $\pi \in \mathbb{R}$ và $|\sigma(\pi)| = \sqrt{q}$ với mọi embedding $\sigma$, thì vì $\pi$ là algebraic integer real, $\pi = \pm\sqrt{q}$. Điều này yêu cầu $\sqrt{q} \in \mathbb{Q}$, tức $q$ là số chính phương.

$(C)$: Nếu $\pi \notin \mathbb{R}$, xét $\sigma = $ complex conjugate: $\bar{\pi}$ là Galois conjugate của $\pi$, $|\bar{\pi}| = |\pi| = \sqrt{q}$, và $\pi \bar{\pi} = |\pi|^2 = q$. $\blacksquare$

### Worked Example

> [!example] Example 40.9 — Tất cả Weil $p$-numbers với $g = 1$ ($q = p$ nguyên tố)  
> Với $q = p$ nguyên tố, $g = 1$. Weil $p$-polynomial bậc $2$: $T^2 - tT + p$ với $t^2 \leq 4p$.
>
> Weil $p$-numbers $\alpha = (t + \sqrt{t^2-4p})/2$ phân theo:
>
> - $t^2 < 4p$: $\alpha$ không thực, $|\alpha|^2 = p$. Đây là trường hợp chính (ordinary elliptic curve điển hình). Điều kiện: $|t| < 2\sqrt{p}$.
> - $t = 0$ và $p \equiv 3 \pmod{4}$: $\alpha = \pm i\sqrt{p}$, đây là imaginary quadratic. Elliptic curve tương ứng là supersingular.
> - $t = \pm p$ và $p$ chia $t$ theo nghĩa nào đó: cũng cho supersingular.
>
> Chú ý: với $q = p$ nguyên tố, **không có** real Weil $p$-numbers (vì $\sqrt{p} \notin \mathbb{Q}$ với $p$ nguyên tố). Vì vậy tất cả Weil $p$-numbers đều non-real.

> [!example] Example 40.10 — Weil $4$-numbers ($q = 4 = 2^2$, $g = 1$)  
> Với $q = 4$, có real Weil $4$-numbers: $\pi = 2$ và $\pi = -2$ (vì $\sqrt{4} = 2 \in \mathbb{Z}$).
>
> Weil $4$-polynomials bậc $2$: $T^2 - tT + 4$ với $|t| \leq 4$.
>
> Các giá trị $t$ cho phép: $t \in \{-4, -3, -2, -1, 0, 1, 2, 3, 4\}$ (với thêm điều kiện $p = 2 \nmid t$ hoặc $p \mid t$ theo Hasse bound).
>
> Ví dụ $t = 4$: $\alpha = 2$ (double root), Weil $4$-number thực.
> Ví dụ $t = 0$: $\alpha = \pm 2i$, $|\alpha| = 2 = \sqrt{4}$ ✓.
> Ví dụ $t = 1$: $\alpha = (1 + \sqrt{-15})/2$, $|\alpha|^2 = (1+15)/4 = 4$ ✓.

---

## Conjugacy Classes và Ý nghĩa

Hai Weil $q$-numbers $\pi, \pi'$ được gọi là **conjugate** (liên hợp) nếu chúng là nghiệm của cùng một minimal polynomial (hay tương đương, cùng $\mathbb{Q}$-conjugacy class, tức cùng orbit dưới $\operatorname{Gal}(\overline{\mathbb{Q}}/\mathbb{Q})$).

> [!definition] Definition 40.11 — Conjugacy Class của Weil $q$-number  
> Hai Weil $q$-numbers $\pi, \pi' \in W(q)$ gọi là **$\mathbb{Q}$-conjugate** nếu tồn tại $\sigma \in \operatorname{Gal}(\overline{\mathbb{Q}}/\mathbb{Q})$ sao cho $\sigma(\pi) = \pi'$.
>
> **Conjugacy class** của $\pi$ là orbit $\{\sigma(\pi): \sigma \in \operatorname{Gal}(\overline{\mathbb{Q}}/\mathbb{Q})\}$.

> [!note] Remark 40.12 — Weil q-number vs isogeny class  
> Honda-Tate theorem (Bài 43) sẽ phát biểu rằng:
>
> $$
> \{\text{isogeny classes của simple AV over } \mathbb{F}_q\} \xrightarrow{1:1} \{\text{conjugacy classes của Weil }q\text{-numbers}\}
> $$
>
> via $[A] \mapsto [\pi_A]$. Đây là lý do tại sao Weil $q$-numbers là công cụ phân loại abelian varieties over finite fields.

### Worked Example

> [!example] Example 40.13 — Tập Weil $5$-numbers và Isogeny Classes  
> Với $q = 5$, $g = 1$. Weil $5$-polynomial bậc $2$: $T^2 - tT + 5$ với $|t| \leq 2\sqrt{5} \approx 4.47$, nên $t \in \{-4, -3, -2, -1, 0, 1, 2, 3, 4\}$.
>
> Nhưng với $p = 5$: điều kiện Hasse thực ra cho $|t| \leq 2\sqrt{5}$, và ta có thêm điều kiện số học.
>
> Các conjugacy classes:
>
> - $t = 0$: $\alpha = \pm i\sqrt{5}$, polynomial $T^2 + 5$. Một conjugacy class $\{i\sqrt{5}, -i\sqrt{5}\}$.
> - $t = 1$: $\alpha = (1 \pm \sqrt{-19})/2$, polynomial $T^2 - T + 5$. Conjugacy class size $2$.
> - $t = -1$: $\alpha = (-1 \pm \sqrt{-19})/2$, polynomial $T^2 + T + 5$. Conjugacy class khác.
> - $t = 2$: $\alpha = (2 \pm \sqrt{-16})/2 = 1 \pm 2i$, polynomial $T^2 - 2T + 5$. $|\alpha| = \sqrt{5}$ ✓.
> - ... (tiếp tục)
>
> Mỗi conjugacy class tương ứng với một isogeny class của elliptic curves over $\mathbb{F}_5$.

---

## Số lượng Isogeny Classes

> [!note] Remark 40.14 — Hasse-Weil và số isogeny classes  
> Cho $g = 1$, số isogeny classes của elliptic curves over $\mathbb{F}_q$ bằng số giá trị $t$ hợp lệ với $|t| \leq 2\sqrt{q}$ (sau khi tính một số điều kiện phụ từ Deuring). Với $q$ lớn, số này xấp xỉ $4\sqrt{q}$.
>
> Với $g$ tổng quát: số isogeny classes của $g$-dimensional AV over $\mathbb{F}_q$ xấp xỉ $q^{g(g+1)/4}$ (asymptotic theo Honda-Tate).

---

## SageMath Cheatsheet

```python
# Verify Weil number condition: all roots have absolute value sqrt(q)
import cmath

def is_weil_polynomial(coeffs, q):
    """Check if a polynomial is a Weil q-polynomial."""
    # coeffs: list of ints, highest degree first
    import numpy as np
    roots = np.roots(coeffs)
    sqrt_q = q**0.5
    return all(abs(abs(r) - sqrt_q) < 1e-8 for r in roots)

# Example: T^2 - 2T + 101 (elliptic curve over F_101 with trace 2)
q = 101
t = 2
coeffs = [1, -t, q]   # T^2 - tT + q
print(is_weil_polynomial(coeffs, q))   # True

# Example: T^4 - T^3 + 2T^2 - 101T + 101^2 (abelian surface)
coeffs_g2 = [1, -1, 2, -101, 101**2]
print(is_weil_polynomial(coeffs_g2, q))  # True

# Compute |A(F_q)| from Weil polynomial: evaluate at T=1
def count_points(coeffs):
    """Evaluate Weil polynomial at T=1."""
    return sum(c * 1**(len(coeffs)-1-i) for i, c in enumerate(coeffs))

print(count_points(coeffs))     # 100 = |E(F_101)|
print(count_points(coeffs_g2))  # 10102 = |A(F_101)| for the surface

# Real Weil q-numbers: only exist when q is a perfect square
q = 4  # = 2^2
# Real Weil 4-numbers: +2 and -2
# Polynomial T^2 - 4T + 4 = (T-2)^2 (repeated root)
print(is_weil_polynomial([1, -4, 4], 4))   # True
# Polynomial T^2 + 4T + 4 = (T+2)^2
print(is_weil_polynomial([1, 4, 4], 4))    # True
```

---

## Summary / Key Takeaways

- **Weil $q$-number**: algebraic integer $\pi$ với $|\sigma(\pi)| = \sqrt{q}$ cho mọi complex embedding $\sigma$.
- **Định lý Weil**: Frobenius $\pi_A$ của simple abelian variety over $\mathbb{F}_q$ là Weil $q$-number; tức characteristic polynomial $P_{\pi_A}$ là Weil $q$-polynomial.
- Chứng minh dựa vào: Rosati involution dương xác định $\Rightarrow \pi_A \pi_A^\dagger = q \Rightarrow |\psi(\pi_A)|^2 = q$.
- Eigenvalues $\alpha_i$ của $\pi_A$ thoả: $|\alpha_i| = \sqrt{q}$, $\bar{\alpha}_i = q/\alpha_i$, $\prod \alpha_i = q^g$.
- **Real Weil $q$-numbers** chỉ tồn tại khi $q$ là số chính phương: $\pi = \pm\sqrt{q}$.
- **Conjugacy classes** của Weil $q$-numbers phân loại isogeny classes của simple AV over $\mathbb{F}_q$ (Honda-Tate).
- Công thức đếm: $|A(\mathbb{F}_{q^n})| = \prod_{i=1}^{2g}(1 - \alpha_i^n)$ với $\alpha_i$ là Weil $q$-numbers.

---

## References

- Weil, A. "Sur les courbes algébriques et les variétés qui s'en déduisent." *Publications de l'Institut de Mathématique de l'Université de Strasbourg*, 1948.
- Mumford, D. *Abelian Varieties* (2nd ed.), Chapter IV.
- Oort, F. "Abelian Varieties over Finite Fields." §3.2 (Theorem of Weil). math.nyu.edu/~tschinke/books/finite-fields/final/05_oort.pdf
- Milne, J.S. "The Riemann Hypothesis over Finite Fields." jmilne.org/math/xnotes/pRH.pdf
- Ji, C. "The Weil Conjectures for Abelian Varieties." math.columbia.edu/~calebji/RH-abelian-varieties.pdf
- Silverman, J.H. *The Arithmetic of Elliptic Curves*, Chapter V, §1–§2.
