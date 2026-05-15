---
title: "32. Số Nguyên Tố Gauss — Phân Loại"
type: theory
tags: [math, number-theory, lesson-32, gaussian-primes]
aliases: [Gaussian Primes, Classification of Gaussian Primes]
created: 2026-05-15
---

> **Prerequisites**: [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]], [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]], [[31-gaussian-integers|31. Số Nguyên Gauss Z[i]]]
> **Objectives**:
> - Định nghĩa Gaussian prime và phân biệt với irreducible
> - Phân loại hoàn chỉnh Gaussian primes theo ba trường hợp
> - Hiểu mối liên hệ giữa Gaussian primes và rational primes qua norm
> - Áp dụng unique factorization trong $\mathbb{Z}[i]$

---

## Motivation / Intuition

Trong $\mathbb{Z}$, số nguyên tố $5$ không phân tích được thành tích các số nguyên $>1$. Nhưng khi ta chuyển sang $\mathbb{Z}[i]$, mọi thứ thay đổi:

$$
5 = (2+i)(2-i) = (1+2i)(1-2i)
$$

Trong khi đó, $7$ vẫn "nguyên tố" trong $\mathbb{Z}[i]$ — nó không thể phân tích thành tích hai Gaussian integer không phải unit! Điều gì tạo ra sự khác biệt?

Câu trả lời nằm ở đồng dư modulo $4$: các số nguyên tố $p \equiv 1 \pmod{4}$ **phân rã** (split) trong $\mathbb{Z}[i]$, còn $p \equiv 3 \pmod{4}$ **trơ** (inert). Thêm vào đó, $2 = -i(1+i)^2$ là trường hợp đặc biệt — **rẽ nhánh** (ramified). Kết quả này là một trong những viên ngọc của lý thuyết số đại số, và là chìa khóa cho bài toán tổng hai bình phương.

---

## Gaussian Primes: Định Nghĩa

Trong $\mathbb{Z}[i]$, do là UFD (Theorem 31.13), khái niệm irreducible và prime trùng nhau. Ta định nghĩa qua irreducible:

> [!definition] Definition 32.1 — Gaussian Prime (Số nguyên tố Gauss)
> Phần tử $\pi \in \mathbb{Z}[i]$, không phải $0$ và không phải unit, được gọi là **Gaussian prime** nếu mỗi khi $\pi = \alpha\beta$ với $\alpha, \beta \in \mathbb{Z}[i]$, thì hoặc $\alpha$ hoặc $\beta$ là unit.
>
> Tương đương (do UFD): $\pi$ là Gaussian prime $\iff$ nếu $\pi \mid \alpha\beta$ thì $\pi \mid \alpha$ hoặc $\pi \mid \beta$.

> [!example] Example 32.2 — Ví dụ đầu tiên
> - $1+i$ là Gaussian prime: $N(1+i) = 2$ — nếu $1+i = \alpha\beta$, thì $2 = N(\alpha)N(\beta)$. Cách duy nhất để phân tích $2$ thành tích hai số nguyên dương là $1 \cdot 2$, nên một trong hai factor có norm $1$ — tức là unit.
> - $3$ là Gaussian prime: $N(3) = 9$. Nếu $3 = \alpha\beta$, thì $9 = N(\alpha)N(\beta)$. Các khả năng: $1 \cdot 9$ hoặc $3 \cdot 3$. Trường hợp $N(\alpha) = N(\beta) = 3$: cần $a^2+b^2 = 3$ với $a,b \in \mathbb{Z}$ — vô nghiệm. Vậy một factor có norm $1$, tức là unit.
> - $5 = (2+i)(2-i)$ **không** là Gaussian prime vì cả $2+i$ và $2-i$ đều không phải unit (norm $5 \neq 1$).

---

## Mối Liên Hệ Giữa Gaussian Primes và Rational Primes

> [!lemma] Lemma 32.3 — Mỗi Gaussian prime chia hết đúng một rational prime
> Cho $\pi \in \mathbb{Z}[i]$ là Gaussian prime. Khi đó tồn tại duy nhất một số nguyên tố (rational prime) $p \in \mathbb{Z}^+$ sao cho $\pi \mid p$ trong $\mathbb{Z}[i]$.

**Proof.** Xét $N(\pi) = \pi\overline{\pi} = n \in \mathbb{Z}^+$. Phân tích $n$ ra thừa số nguyên tố trong $\mathbb{Z}$: $n = p_1 p_2 \cdots p_k$. Vì $\pi$ là Gaussian prime và $\pi \mid n = p_1 p_2 \cdots p_k$ (do $\pi \mid \pi\overline{\pi} = n$), theo tính chất prime, $\pi$ phải chia hết một $p_j$ nào đó.

Tính duy nhất: nếu $\pi \mid p$ và $\pi \mid q$ với $p \neq q$ là các rational prime, thì $\pi \mid \gcd(p,q) = 1$ (trong $\mathbb{Z}$), suy ra $\pi \mid 1$, mâu thuẫn vì $\pi$ không phải unit. $\blacksquare$

> [!note] Remark 32.4
> Điều này có nghĩa: để tìm tất cả Gaussian primes, ta chỉ cần phân tích từng rational prime $p$ trong $\mathbb{Z}[i]$. Mỗi Gaussian prime là ước của đúng một rational prime.

---

## Phân Loại Gaussian Primes

> [!theorem] Theorem 32.5 — Phân loại Gaussian Primes
> Các Gaussian primes (sai khác phép nhân với unit) được phân thành ba loại:
>
> **(1) Trường hợp rẽ nhánh (ramified) — $p = 2$:**
> $\pi = 1+i$ là Gaussian prime duy nhất (up to associates) chia hết $2$. Hơn nữa:
>
> $$
> 2 = -i (1+i)^2
> $$
>
> $N(1+i) = 2$.
>
> **(2) Trường hợp trơ (inert) — $p \equiv 3 \pmod{4}$:**
> Nếu $p$ là rational prime với $p \equiv 3 \pmod{4}$, thì $p$ cũng là Gaussian prime. $N(p) = p^2$.
>
> **(3) Trường hợp phân rã (split) — $p \equiv 1 \pmod{4}$:**
> Nếu $p$ là rational prime với $p \equiv 1 \pmod{4}$, thì $p$ phân tích thành tích hai Gaussian primes liên hợp (không associate với nhau):
>
> $$
> p = \pi \overline{\pi} = (a+bi)(a-bi)
> $$
>
> với $a^2 + b^2 = p$, $a > b > 0$. $N(\pi) = N(\overline{\pi}) = p$.

**Proof.**

**(1)** $p=2$: $2 = (1+i)(1-i) = -i(1+i)^2$. $1+i$ là Gaussian prime vì $N(1+i)=2$ là rational prime (nếu phân tích được thì một factor có norm $1$).

**(2)** $p \equiv 3 \pmod{4}$: Giả sử $p = \alpha\beta$ với $\alpha, \beta$ không phải unit. Lấy norm: $p^2 = N(\alpha)N(\beta)$. Vì cả hai không phải unit, $N(\alpha) > 1$, $N(\beta) > 1$, nên $N(\alpha) = N(\beta) = p$. Nhưng $N(\alpha) = a^2+b^2 = p$ với $p \equiv 3 \pmod{4}$. Xét modulo $4$: một bình phương chỉ có thể $\equiv 0$ hoặc $1 \pmod{4}$, nên $a^2+b^2 \equiv 0, 1, 2 \pmod{4}$, không thể $\equiv 3 \pmod{4}$. Mâu thuẫn. Vậy $p$ là Gaussian prime.

**(3)** $p \equiv 1 \pmod{4}$: Từ bài 16, $(-1 \mid p) = (-1)^{(p-1)/2} = 1$, nên tồn tại $x \in \mathbb{Z}$ sao cho $x^2 \equiv -1 \pmod{p}$, tức $p \mid (x^2+1) = (x+i)(x-i)$. Nếu $p$ là Gaussian prime, thì $p \mid (x+i)$ hoặc $p \mid (x-i)$. Nhưng $x \pm i = p(a+bi)$ kéo theo $pa = x$, $pb = \pm 1$ — vô lý vì $p \geq 5$. Vậy $p$ **không** là Gaussian prime trong $\mathbb{Z}[i]$. Do đó $p = \alpha\beta$ với $\alpha, \beta$ không phải unit. Lấy norm: $p^2 = N(\alpha)N(\beta)$, và $N(\alpha), N(\beta) > 1$, nên $N(\alpha) = N(\beta) = p$. Viết $\alpha = a+bi$, ta có $a^2+b^2 = p$. $\blacksquare$

> [!note] Remark 32.6 — Bảng tổng kết
>
> | Rational prime $p$ | Hành vi trong $\mathbb{Z}[i]$ | Gaussian prime tương ứng | $N(\pi)$ |
> |---|---|---|---|
> | $p = 2$ | Rẽ nhánh (ramified) | $\pi = 1+i$ | $2$ |
> | $p \equiv 1 \pmod{4}$ | Phân rã (split) | $\pi = a+bi$, $a^2+b^2=p$ | $p$ |
> | $p \equiv 3 \pmod{4}$ | Trơ (inert) | $\pi = p$ | $p^2$ |

> [!example] Example 32.7 — Ví dụ cụ thể
> - $2 = -i(1+i)^2$ → ramified, Gaussian prime: $1+i$.
> - $5 = (2+i)(2-i)$ → split, Gaussian primes: $2+i$, $2-i$.
> - $13 = (3+2i)(3-2i)$ → split, Gaussian primes: $3+2i$, $3-2i$.
> - $7$ → inert, $7$ là Gaussian prime.
> - $11$ → inert, $11$ là Gaussian prime.
> - $17 = (4+i)(4-i)$ → split, Gaussian primes: $4+i$, $4-i$.

---

## Hệ Quả: Đặc Trưng Qua Norm

> [!corollary] Corollary 32.8 — Đặc trưng Gaussian prime qua norm
> Cho $\pi \in \mathbb{Z}[i]$, $\pi \neq 0$, không phải unit. Khi đó $\pi$ là Gaussian prime $\iff$ $N(\pi)$ là rational prime hoặc $N(\pi) = p^2$ với $p \equiv 3 \pmod{4}$ là rational prime và $\pi$ là associate của $p$.

**Proof.** Từ phân loại trên:
- Nếu $\pi \mid 2$: $N(\pi) = 2$ (rational prime).
- Nếu $\pi \mid p$ với $p \equiv 1 \pmod{4}$: $N(\pi) = p$ (rational prime).
- Nếu $\pi \mid p$ với $p \equiv 3 \pmod{4}$: $\pi$ là associate của $p$, $N(\pi) = p^2$.

Ngược lại, nếu $N(\pi)=q$ là rational prime, thì $\pi$ là Gaussian prime (nếu phân tích được, một factor có norm $1$). Nếu $N(\pi)=p^2$ với $p \equiv 3 \pmod{4}$, thì $\pi$ phải là associate của $p$ (vì nếu không, $\pi$ sẽ có dạng $a+bi$ với $a^2+b^2=p^2$, và phân tích trong $\mathbb{Z}[i]$ cho thấy $\pi = u \cdot p$). $\blacksquare$

---

## Unique Factorization trong $\mathbb{Z}[i]$

> [!theorem] Theorem 32.9 — Unique Factorization trong $\mathbb{Z}[i]$
> Mọi Gaussian integer $\alpha \neq 0$, không phải unit, đều phân tích được thành tích các Gaussian primes:
>
> $$
> \alpha = u \cdot \pi_1^{e_1} \pi_2^{e_2} \cdots \pi_k^{e_k}
> $$
>
> trong đó $u$ là unit và các $\pi_j$ là Gaussian primes (không associate với nhau). Phân tích này là **duy nhất** sai khác thứ tự và phép nhân unit.

**Proof.** Do $\mathbb{Z}[i]$ là Euclidean Domain (Theorem 31.10) $\Rightarrow$ PID $\Rightarrow$ UFD. $\blacksquare$

### Cách phân tích thực tế

Để phân tích $\alpha = a+bi$:

1. Tính $N(\alpha) = a^2+b^2$.
2. Phân tích $N(\alpha)$ ra rational primes: $N(\alpha) = 2^{e} \prod p_i^{e_i} \prod q_j^{f_j}$, với $p_i \equiv 1 \pmod{4}$, $q_j \equiv 3 \pmod{4}$.
3. Mỗi rational prime $p_i \equiv 1 \pmod{4}$ phân tích $p_i = \pi_i \overline{\pi_i}$; xác định $\pi_i$ nào chia hết $\alpha$.
4. Mỗi $q_j \equiv 3 \pmod{4}$: xuất hiện với số mũ chẵn (vì $N(\alpha)$ là tổng hai bình phương — xem bài 33), mỗi cặp $q_j^2$ đóng góp factor $q_j$.
5. $2 = -i(1+i)^2$: mỗi lũy thừa của $2$ đóng góp $(1+i)$.

> [!example] Example 32.10 — Phân tích $8+4i$
> $N(8+4i) = 64 + 16 = 80 = 2^4 \cdot 5$.
>
> - $2^4$: đóng góp $(1+i)^8$ (đến unit).
> - $5 = (2+i)(2-i)$.
>
> Kiểm tra chia hết: $(8+4i)/(1+i)^4 = (8+4i)/(-4) = -2-i$. Sau đó $(-2-i)/(2+i) = -1$, nên $(-2-i) = -(2+i)$. Vậy $8+4i = -i(1+i)^4(2+i)$.

---

## SageMath Cheatsheet

```python
ZI = GaussianIntegers()

# Phân tích ra Gaussian primes
print(factor(ZI(5)))          # (-i) * (i + 2) * (2*i + 1) — tức (2+i)(2-i)
print(factor(ZI(7)))          # 7 — inert
print(factor(ZI(13)))         # (-i) * (3*i + 2) * (2*i + 3) — tức (3+2i)(3-2i)
print(factor(ZI(8+4*i)))      # (-2*i - 1) * (i + 1)^4

# Kiểm tra Gaussian prime
def is_gaussian_prime(alpha):
    if alpha.norm() == 1:
        return False
    return len(factor(alpha)) == 1

print(is_gaussian_prime(ZI(1+i)))    # True
print(is_gaussian_prime(ZI(3)))      # True (inert)
print(is_gaussian_prime(ZI(2+i)))    # True (split factor)
print(is_gaussian_prime(ZI(5)))      # False (product of two primes)

# Lấy danh sách Gaussian primes với norm nhỏ
primes_small = []
for a in range(-10, 11):
    for b in range(-10, 11):
        alpha = ZI(a + b*i)
        if alpha.norm() > 1 and alpha.norm() <= 100:
            if is_gaussian_prime(alpha):
                primes_small.append((alpha, alpha.norm()))

# In vài kết quả đầu
for p, n in sorted(primes_small[:15], key=lambda x: x[1]):
    print(f"{p}: N={n}")
```

---

## Summary / Key Takeaways

- **Gaussian prime** = phần tử không phân tích được thành tích hai non-unit trong $\mathbb{Z}[i]$ (tương đương prime trong UFD).
- Mỗi Gaussian prime là ước của **đúng một** rational prime $p$.
- **Phân loại hoàn chỉnh** (Theorem 32.5):
  - $p=2$: rẽ nhánh — $2 = -i(1+i)^2$, Gaussian prime duy nhất: $1+i$.
  - $p \equiv 1 \pmod{4}$: phân rã — $p = \pi\overline{\pi}$ với $N(\pi)=p$.
  - $p \equiv 3 \pmod{4}$: trơ — $p$ là Gaussian prime, $N(p)=p^2$.
- Điều kiện $p \equiv 1 \pmod{4}$ phân rã được dựa trên $(-1 \mid p) = 1$ (từ bài 16).
- Unique factorization trong $\mathbb{Z}[i]$ cho phép phân tích mọi Gaussian integer thành tích các Gaussian primes.
- Phân tích thực tế: tính $N(\alpha)$, phân tích ra rational primes, rồi "nâng" lên $\mathbb{Z}[i]$.

---

## References

- Conrad, K. *The Gaussian Integers*. https://kconrad.math.uconn.edu/blurbs/ugradnumthy/Zinotes.pdf
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), §8.1–8.2.
- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.7.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §15.2.
