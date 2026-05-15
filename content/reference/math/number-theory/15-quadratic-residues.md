---
title: "15. Thặng Dư Bậc Hai (Quadratic Residues)"
type: foundation
tags: [math, number-theory, lesson-15]
aliases: [Quadratic Residues, QR, QNR]
created: 2026-05-15
---

> **Prerequisites**: [[10-multiplicative-order|10. Bậc Nhân Tử]], [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]]
> **Objectives**:
> - Định nghĩa thặng dư bậc hai (QR) và phi thặng dư bậc hai (QNR) modulo số nguyên tố
> - Chứng minh số lượng nghiệm của $x^2 \equiv a \pmod{p}$: đúng $0$ hoặc $2$ nghiệm
> - Chứng minh có đúng $(p-1)/2$ phần tử QR và $(p-1)/2$ phần tử QNR trong $(\mathbb{Z}/p\mathbb{Z})^*$
> - Phân tích cấu trúc QR thông qua primitive root: QR ↔ số mũ chẵn
> - Nắm quy tắc nhân: QR·QR, QR·QNR, QNR·QNR
> - Xét QR modulo số nguyên tố lũy thừa và số hợp (phác thảo)

---

## Motivation / Intuition

Câu hỏi tự nhiên nhất trong số học: số nào là "bình phương hoàn hảo" trong thế giới modulo?

Trên tập số thực, $a > 0$ là bình phương hoàn hảo khi tồn tại $x \in \mathbb{R}$ với $x^2 = a$. Với mọi $a > 0$, đó luôn là $x = \sqrt{a}$. Nhưng trong $\mathbb{Z}/p\mathbb{Z}$ — thế giới của số nguyên modulo số nguyên tố — không phải mọi phần tử đều có căn bậc hai. Câu hỏi "số nào có căn bậc hai modulo $p$?" có một câu trả lời rất kỳ diệu: **đúng một nửa** các phần tử của $(\mathbb{Z}/p\mathbb{Z})^*$ có căn bậc hai.

Lý thuyết **thặng dư bậc hai** (quadratic residue theory) nghiên cứu câu hỏi này một cách có hệ thống. Đây là một trong những chủ đề đẹp nhất và sâu sắc nhất trong lý thuyết số sơ cấp. Từ định nghĩa đơn giản, nó dẫn đến **Luật Tương Hỗ Bậc Hai** — một trong những định lý được chứng minh nhiều lần nhất trong toán học, với hơn 200 chứng minh khác nhau đã được ghi nhận.

Trong bài này, ta đặt nền móng: định nghĩa, đếm, và cấu trúc của các thặng dư bậc hai.

---

## Định Nghĩa và Ví Dụ Cơ Bản

### Definition

> [!definition] Definition 15.1 — Thặng Dư Bậc Hai (Quadratic Residue)
> Cho $p$ là số nguyên tố lẻ và $a \in \mathbb{Z}$ với $p \nmid a$.
>
> Ta nói $a$ là **thặng dư bậc hai** (quadratic residue, viết tắt **QR**) modulo $p$ nếu phương trình
>
> $$
> x^2 \equiv a \pmod{p}
> $$
>
> có nghiệm nguyên. Khi đó $x$ được gọi là **căn bậc hai** (square root) của $a$ modulo $p$.
>
> Nếu phương trình trên không có nghiệm, $a$ được gọi là **phi thặng dư bậc hai** (quadratic non-residue, viết tắt **QNR**) modulo $p$.
>
> Tập hợp các QR modulo $p$ ký hiệu là $QR_p$, tập QNR ký hiệu là $QNR_p$.

> [!note] Remark 15.2 — Tại sao bỏ qua bội số của $p$?
> Nếu $p \mid a$ thì $x^2 \equiv 0 \pmod{p}$ có nghiệm $x \equiv 0$, nhưng trường hợp này tầm thường. Để lý thuyết đẹp, ta luôn xét $a$ với $\gcd(a, p) = 1$, tức $a \in (\mathbb{Z}/p\mathbb{Z})^*$.

### Worked Example

> [!example] Example 15.3 — QR và QNR modulo $7$
>
> Tính $x^2 \bmod 7$ với $x = 1, 2, 3, 4, 5, 6$:
>
> | $x$ | $x^2$ | $x^2 \bmod 7$ |
> |-----|--------|--------------|
> | $1$ | $1$ | $\mathbf{1}$ |
> | $2$ | $4$ | $\mathbf{4}$ |
> | $3$ | $9$ | $\mathbf{2}$ |
> | $4$ | $16$ | $\mathbf{2}$ |
> | $5$ | $25$ | $\mathbf{4}$ |
> | $6$ | $36$ | $\mathbf{1}$ |
>
> Các bình phương modulo $7$: $\{1, 4, 2, 2, 4, 1\}$, tức $QR_7 = \{1, 2, 4\}$.
>
> Các phần tử còn lại: $QNR_7 = \{3, 5, 6\}$.
>
> Nhận xét: $|QR_7| = |QNR_7| = 3 = (7-1)/2$. Ta thấy mỗi QR xuất hiện **đúng 2 lần** trong bảng.

> [!example] Example 15.4 — QR và QNR modulo $11$
>
> Tính $x^2 \bmod 11$ với $x = 1, \ldots, 10$:
>
> | $x$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |
> |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
> | $x^2 \bmod 11$ | $1$ | $4$ | $9$ | $5$ | $3$ | $3$ | $5$ | $9$ | $4$ | $1$ |
>
> $QR_{11} = \{1, 3, 4, 5, 9\}$, $QNR_{11} = \{2, 6, 7, 8, 10\}$.
>
> Lại có $|QR_{11}| = |QNR_{11}| = 5 = (11-1)/2$.

---

## Số Nghiệm của $x^2 \equiv a \pmod{p}$

### Theorem

> [!theorem] Theorem 15.5 — Số Nghiệm của Đồng Dư Bậc Hai
> Cho $p$ là số nguyên tố lẻ, $a \in \mathbb{Z}$ với $p \nmid a$. Khi đó:
>
> **(i)** Nếu $a \in QR_p$ thì $x^2 \equiv a \pmod{p}$ có **đúng 2** nghiệm không đồng dư nhau modulo $p$.
>
> **(ii)** Nếu $a \in QNR_p$ thì $x^2 \equiv a \pmod{p}$ có **không có** nghiệm.

**Proof.**

**(i)** Giả sử $x_0$ là một nghiệm, tức $x_0^2 \equiv a \pmod{p}$.

- **$-x_0$ cũng là nghiệm**: $(-x_0)^2 = x_0^2 \equiv a$.
- **$x_0 \not\equiv -x_0 \pmod{p}$**: Nếu $x_0 \equiv -x_0$ thì $2x_0 \equiv 0$. Vì $p$ lẻ, $\gcd(2, p) = 1$, suy ra $x_0 \equiv 0$, mâu thuẫn với $a \not\equiv 0$ (vì $a = x_0^2 \equiv 0$ kéo theo $p \mid a$).
- **Không có nghiệm nào khác**: Nếu $y^2 \equiv a \equiv x_0^2$ thì $p \mid (y^2 - x_0^2) = (y - x_0)(y + x_0)$. Vì $p$ nguyên tố, $p \mid (y - x_0)$ hoặc $p \mid (y + x_0)$, tức $y \equiv x_0$ hoặc $y \equiv -x_0$.

Vậy có đúng 2 nghiệm: $x_0$ và $-x_0 \equiv p - x_0 \pmod{p}$. $\blacksquare$

**(ii)** Hiển nhiên từ định nghĩa. $\blacksquare$

> [!note] Remark 15.6 — So Sánh với Số Thực
> Trên $\mathbb{R}$, mỗi số dương $a > 0$ có đúng 2 căn bậc hai: $\pm\sqrt{a}$. Định lý trên nói rằng tính chất này được giữ nguyên trong $\mathbb{Z}/p\mathbb{Z}$ — đúng cho QR và không có nghiệm cho QNR. Điều này phản ánh tính đẹp đẽ của trường $\mathbb{F}_p$.

---

## Đếm QR và QNR: Đúng Một Nửa

### Theorem

> [!theorem] Theorem 15.7 — Số Lượng QR và QNR
> Cho $p$ là số nguyên tố lẻ. Trong tập $\{1, 2, \ldots, p-1\}$ có đúng $\dfrac{p-1}{2}$ thặng dư bậc hai và $\dfrac{p-1}{2}$ phi thặng dư bậc hai modulo $p$.

**Proof.**

Xét ánh xạ $\phi: (\mathbb{Z}/p\mathbb{Z})^* \to (\mathbb{Z}/p\mathbb{Z})^*$ định bởi $\phi(x) = x^2$.

Theo Theorem 15.5, với mỗi $a \in QR_p$, có đúng $2$ nghiệm tiền ảnh $\{x_0, -x_0\}$. Với mỗi $a \in QNR_p$, không có nghiệm tiền ảnh.

Do đó $\phi$ là ánh xạ 2-1 từ $(\mathbb{Z}/p\mathbb{Z})^*$ lên $QR_p$:

$$
2 \cdot |QR_p| = p - 1 \implies |QR_p| = \frac{p-1}{2}.
$$

Và $|QNR_p| = (p-1) - |QR_p| = \dfrac{p-1}{2}$. $\blacksquare$

> [!corollary] Corollary 15.8 — Danh Sách Tường Minh các QR
> Các thặng dư bậc hai modulo $p$ là chính xác các phần tử:
>
> $$
> 1^2,\ 2^2,\ 3^2,\ \ldots,\ \left(\frac{p-1}{2}\right)^2 \pmod{p}
> $$
>
> và đây là $\dfrac{p-1}{2}$ phần tử phân biệt.

**Proof.** Các bình phương $1^2, 2^2, \ldots, \left(\frac{p-1}{2}\right)^2$ phân biệt modulo $p$: nếu $i^2 \equiv j^2$ với $1 \leq i < j \leq \frac{p-1}{2}$ thì $p \mid (j-i)(j+i)$, suy ra $p \mid j-i$ (vô lý vì $0 < j-i < p$) hoặc $p \mid j+i$ (vô lý vì $2 \leq j+i \leq p-1$). Vậy cho ta đúng $\frac{p-1}{2}$ phần tử phân biệt. $\blacksquare$

---

## Đặc Trưng Qua Primitive Root: Mũ Chẵn/Lẻ

Đây là cách nhìn cấu trúc nhất về thặng dư bậc hai.

### Theorem

> [!theorem] Theorem 15.9 — QR $\Leftrightarrow$ Số Mũ Chẵn theo Primitive Root
> Cho $p$ nguyên tố lẻ, $g$ là primitive root modulo $p$. Một phần tử $a \in (\mathbb{Z}/p\mathbb{Z})^*$ là QR modulo $p$ khi và chỉ khi chỉ số $\operatorname{ind}_g(a)$ là **số chẵn**.

**Proof.**

Viết $a \equiv g^k \pmod{p}$ với $k = \operatorname{ind}_g(a)$, $1 \leq k \leq p-1$.

$(\Rightarrow)$ Nếu $a \in QR_p$, tồn tại $x$ với $x^2 \equiv a$. Viết $x \equiv g^m$. Thì $g^{2m} \equiv g^k$, suy ra $2m \equiv k \pmod{p-1}$. Vì $2 \mid 2m$, suy ra $2 \mid k$, tức $k$ chẵn.

$(\Leftarrow)$ Nếu $k = 2j$ (chẵn), thì $x = g^j$ thỏa $x^2 = g^{2j} = g^k \equiv a$. Vậy $a \in QR_p$. $\blacksquare$

> [!corollary] Corollary 15.10 — QR là Nhóm Con Bậc Hai
> Tập $QR_p$ là nhóm con của $(\mathbb{Z}/p\mathbb{Z})^*$ với chỉ số $2$.
>
> Cụ thể: $QR_p = \langle g^2 \rangle = \{g^2, g^4, g^6, \ldots, g^{p-1}\}$.

**Proof.** $\operatorname{ind}_g(a) + \operatorname{ind}_g(b)$ chẵn khi cả hai chẵn; tổng số chẵn là chẵn. Vậy $QR_p$ đóng với phép nhân. Chứa đơn vị ($\operatorname{ind}_g(1) = p-1$ chẵn). Nghịch đảo: $\operatorname{ind}_g(a^{-1}) \equiv -\operatorname{ind}_g(a) \pmod{p-1}$, nếu $\operatorname{ind}_g(a)$ chẵn thì $-\operatorname{ind}_g(a)$ chẵn. Vậy $QR_p$ là nhóm con. $\blacksquare$

> [!example] Example 15.11 — QR modulo $13$, Primitive Root $g = 2$
>
> $p = 13$, $g = 2$. Bảng chỉ số:
>
> | $a$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ | $11$ | $12$ |
> |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|------|------|
> | $\operatorname{ind}_2(a)$ | $12$ | $1$ | $4$ | $2$ | $9$ | $5$ | $11$ | $3$ | $8$ | $10$ | $7$ | $6$ |
>
> Các $a$ có chỉ số chẵn ($\{12, 4, 2, 8, 10, 6\}$): $a \in \{1, 3, 4, 9, 10, 12\}$.
>
> Kiểm tra: $1^2 \equiv 1$, $4^2 \equiv 3$, $2^2 \equiv 4$, $3^2 \equiv 9$, $6^2 \equiv 10$, $5^2 \equiv 12$ (mod 13). ✓
>
> Vậy $QR_{13} = \{1, 3, 4, 9, 10, 12\}$, $QNR_{13} = \{2, 5, 6, 7, 8, 11\}$.

---

## Quy Tắc Nhân: Cấu Trúc Nhóm Thương

### Theorem

> [!theorem] Theorem 15.12 — Quy Tắc Nhân QR và QNR
> Cho $p$ nguyên tố lẻ. Với $a, b \in (\mathbb{Z}/p\mathbb{Z})^*$:
>
> | $a$ | $b$ | $ab$ |
> |-----|-----|------|
> | QR | QR | QR |
> | QR | QNR | QNR |
> | QNR | QR | QNR |
> | QNR | QNR | QR |

**Proof.** Dùng Theorem 15.9: $ab \in QR_p \iff \operatorname{ind}_g(ab) = \operatorname{ind}_g(a) + \operatorname{ind}_g(b) \pmod{p-1}$ chẵn.

- Chẵn + Chẵn = Chẵn $\Rightarrow$ QR.
- Chẵn + Lẻ = Lẻ $\Rightarrow$ QNR.
- Lẻ + Lẻ = Chẵn $\Rightarrow$ QR. $\blacksquare$

> [!note] Remark 15.13 — Tương Tự Dấu Số
> Quy tắc nhân QR/QNR hoàn toàn tương tự quy tắc dấu số thực: $(+)(+) = +$, $(+)(-) = -$, $(-)(-)= +$. Cụ thể hơn, nhóm thương $(\mathbb{Z}/p\mathbb{Z})^* / QR_p \cong \mathbb{Z}/2\mathbb{Z}$, và phép ánh xạ $a \mapsto \pm 1$ (QR hay QNR) là đồng cấu nhóm.

> [!example] Example 15.14 — Kiểm Tra Quy Tắc Nhân modulo $7$
>
> Biết $QR_7 = \{1, 2, 4\}$, $QNR_7 = \{3, 5, 6\}$.
>
> - $2 \times 4 = 8 \equiv 1 \pmod 7$: QR $\times$ QR $= 1 \in QR_7$. ✓
> - $2 \times 3 = 6 \pmod 7$: QR $\times$ QNR $= 6 \in QNR_7$. ✓
> - $3 \times 5 = 15 \equiv 1 \pmod 7$: QNR $\times$ QNR $= 1 \in QR_7$. ✓
> - $3 \times 6 = 18 \equiv 4 \pmod 7$: QNR $\times$ QNR $= 4 \in QR_7$. ✓

---

## Hai Trường Hợp Đặc Biệt: $-1$ và $2$

### Theorem

> [!theorem] Theorem 15.15 — QR/QNR của $-1$
> Cho $p$ là số nguyên tố lẻ. Thì:
>
> $$
> -1 \in QR_p \iff p \equiv 1 \pmod{4}
> $$

**Proof.**

Dùng Theorem 15.9: $-1 \in QR_p \iff \operatorname{ind}_g(-1)$ chẵn.

Ta biết $g^{(p-1)/2} \equiv -1 \pmod{p}$ (vì đây là phần tử duy nhất bậc $2$ trong $(\mathbb{Z}/p\mathbb{Z})^*$, suy từ Fermat). Do đó $\operatorname{ind}_g(-1) = \frac{p-1}{2}$.

Vậy $-1 \in QR_p \iff \frac{p-1}{2}$ chẵn $\iff 4 \mid p-1 \iff p \equiv 1 \pmod 4$. $\blacksquare$

> [!example] Example 15.16 — Ví Dụ $-1$ là QR hay QNR
>
> - $p = 5$: $p \equiv 1 \pmod 4$. $-1 \equiv 4 \pmod 5$. Kiểm tra: $2^2 = 4 \equiv -1$. ✓ (QR)
> - $p = 7$: $p \equiv 3 \pmod 4$. $-1 \equiv 6 \pmod 7 \in QNR_7$. ✓ (QNR)
> - $p = 13$: $p \equiv 1 \pmod 4$. $-1 \equiv 12 \pmod{13} \in QR_{13}$. Kiểm tra: $5^2 = 25 \equiv 12$. ✓
> - $p = 11$: $p \equiv 3 \pmod 4$. $-1 \equiv 10 \pmod{11} \in QNR_{11}$. ✓

> [!note] Remark 15.17 — $-1$ là QR và bài toán tổng hai bình phương
> Định lý $-1 \in QR_p \iff p \equiv 1 \pmod 4$ có hệ quả sâu xa: số nguyên tố $p$ biểu diễn được dưới dạng $p = a^2 + b^2$ khi và chỉ khi $p = 2$ hoặc $p \equiv 1 \pmod 4$. Đây là định lý Fermat về tổng hai bình phương (Theorem of Two Squares).

---

## QR modulo Số Nguyên Tố Lũy Thừa (Phác Thảo)

> [!note] Remark 15.18 — QR modulo $p^k$
> Với số nguyên tố lẻ $p$ và $k \geq 1$: $a \in QR_{p^k}$ (tức $x^2 \equiv a \pmod{p^k}$ có nghiệm với $\gcd(a,p)=1$) khi và chỉ khi $a \in QR_p$ (tức $\left(\frac{a}{p}\right) = 1$).
>
> Nói cách khác, việc nâng lên lũy thừa cao hơn không làm thay đổi tính QR đối với số nguyên tố lẻ — một nghiệm mod $p$ luôn **nâng lên** (lift) được thành nghiệm mod $p^k$ bằng **Bổ Đề Hensel** (Hensel's Lemma).
>
> Với $p = 2$: tình huống phức tạp hơn — $a \in QR_{2^k}$ (với $k \geq 3$) khi và chỉ khi $a \equiv 1 \pmod 8$.

---

## SageMath Cheatsheet

```python
# Kiểm tra QR/QNR và liệt kê
p = 13
qr = [a for a in range(1, p) if Mod(a, p).is_square()]
qnr = [a for a in range(1, p) if not Mod(a, p).is_square()]
print(f"QR mod {p}: {qr}")
print(f"QNR mod {p}: {qnr}")

# Kiểm tra bằng Legendre symbol (học ở bài 16)
for a in range(1, p):
    ls = legendre_symbol(a, p)
    print(f"({a}/{p}) = {ls}, is_square = {Mod(a,p).is_square()}")

# Xác nhận |QR| = (p-1)/2
assert len(qr) == (p - 1) // 2
assert len(qnr) == (p - 1) // 2

# Liệt kê QR bằng cách bình phương 1...(p-1)/2
squares = sorted(set(int(Mod(x, p)^2) for x in range(1, (p + 1) // 2)))
print(f"QR từ 1^2...(p-1)/2)^2: {squares}")
assert squares == qr

# Xác nhận QR có số mũ chẵn theo primitive root
g = primitive_root(p)
print(f"Primitive root mod {p}: {g}")
for a in range(1, p):
    ind = discrete_log(Mod(a, p), Mod(g, p))
    is_qr = (ind % 2 == 0)
    print(f"ind_{g}({a}) = {ind}, chẵn={ind%2==0}, is_square={Mod(a,p).is_square()}")
    assert is_qr == Mod(a, p).is_square()

# Quy tắc nhân QR/QNR
def qr_type(a, p):
    return "QR" if Mod(a, p).is_square() else "QNR"

p = 11
for a in range(1, p):
    for b in range(1, p):
        ab = (a * b) % p
        ta, tb, tab = qr_type(a,p), qr_type(b,p), qr_type(ab,p)
        # Xác nhận: QNR*QNR = QR, QR*QNR = QNR, QR*QR = QR
        if ta == "QNR" and tb == "QNR":
            assert tab == "QR", f"{a}*{b}={ab}: {ta}*{tb}={tab}"

# Kiểm tra: -1 là QR iff p ≡ 1 (mod 4)
for p in primes(3, 50):
    minus1_is_qr = Mod(-1, p).is_square()
    p_mod4 = p % 4
    assert minus1_is_qr == (p_mod4 == 1), f"p={p}"
    print(f"p={p}, p mod 4={p_mod4}, (-1|p)={'QR' if minus1_is_qr else 'QNR'}")
```

---

## Summary / Key Takeaways

- **QR modulo $p$**: $a$ là QR nếu $x^2 \equiv a \pmod{p}$ có nghiệm; QNR nếu không có nghiệm.
- **Số nghiệm**: $x^2 \equiv a$ có 0 hoặc 2 nghiệm phân biệt modulo $p$ (với $p \nmid a$).
- **Phân nửa**: trong $(\mathbb{Z}/p\mathbb{Z})^*$ có đúng $\frac{p-1}{2}$ QR và $\frac{p-1}{2}$ QNR.
- **Đặc trưng qua primitive root**: $a \in QR_p \iff \operatorname{ind}_g(a) \equiv 0 \pmod 2$.
- **Cấu trúc**: $QR_p = \langle g^2 \rangle$ là nhóm con chỉ số 2 của $(\mathbb{Z}/p\mathbb{Z})^*$.
- **Quy tắc nhân**: QR·QR = QR, QR·QNR = QNR, QNR·QNR = QR — tương tự quy tắc dấu.
- **$-1$ là QR $\iff$ $p \equiv 1 \pmod 4$**.
- **QR mod $p^k$** (p lẻ): tương đương QR mod $p$ (nâng nghiệm bằng Hensel's Lemma).

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.1.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 5.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.5.
- Koblitz, N. *A Course in Number Theory and Cryptography* (2nd ed.), Ch. II.
