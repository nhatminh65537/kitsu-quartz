---
title: "02. Cardinality & Countability"
tags: [math, real-analysis, lesson-02]
aliases: [Cardinality and Countability]
created: 2026-03-28
---

> **Prerequisites**: [[01-the-real-number-system|01. The Real Number System]] — Khái niệm tập hợp, ánh xạ (injection, surjection, bijection)
> **Objectives**:
> - Định nghĩa lực lượng (cardinality) và so sánh kích cỡ của tập hợp vô hạn
> - Phân biệt tập đếm được (countable) và không đếm được (uncountable)
> - Chứng minh $\mathbb{Q}$ đếm được nhưng $\mathbb{R}$ thì không
> - Hiểu và vận dụng định lý Cantor: $|A| < |\mathcal{P}(A)|$
> - Nắm định lý Cantor-Schröder-Bernstein để so sánh lực lượng

---

## Motivation / Intuition

Có "nhiều" số nguyên hơn số tự nhiên không? Trực giác thông thường bảo "có", vì $\mathbb{Z}$ chứa $\mathbb{N}$ cộng thêm số âm. Nhưng thực ra ta có thể ghép đôi $\mathbb{N} \leftrightarrow \mathbb{Z}$ theo kiểu $1 \mapsto 0$, $2 \mapsto 1$, $3 \mapsto -1$, $4 \mapsto 2$, $5 \mapsto -2$, $\ldots$ — một song ánh. Theo nghĩa đó, $\mathbb{N}$ và $\mathbb{Z}$ có **cùng kích cỡ**.

Còn $\mathbb{R}$ thì sao? Georg Cantor (1874, 1891) đã chứng minh điều kỳ diệu: **không thể** ghép đôi $\mathbb{N}$ với $\mathbb{R}$. Đây là khám phá cách mạng — lần đầu tiên toán học chứng minh rằng tồn tại nhiều "mức độ vô hạn" khác nhau.

---

## Lực lượng tập hợp (Cardinality)

### Definition

> [!definition] Definition 2.1 — Tương đương lực lượng (Equinumerosity)
> Hai tập hợp $A$ và $B$ có **cùng lực lượng** (equinumerous), ký hiệu $A \sim B$ hay $|A| = |B|$, nếu tồn tại một **song ánh** (bijection) $f: A \to B$.

> [!definition] Definition 2.2 — So sánh lực lượng
> - $|A| \leq |B|$ nếu tồn tại **đơn ánh** (injection) $f: A \to B$
> - $|A| < |B|$ nếu $|A| \leq |B|$ nhưng $A \not\sim B$

> [!note] Remark 2.3
> Quan hệ $\sim$ là quan hệ tương đương: phản xạ ($A \sim A$ qua ánh xạ đơn vị), đối xứng (nghịch đảo của bijection là bijection), và bắc cầu (hợp thành của hai bijection là bijection).

### Worked Example

> [!example] Example 2.4 — Các tập vô hạn có thể đồng lực lượng với tập con thực sự của chúng
>
> **(a)** $\mathbb{N} \sim \mathbb{Z}$: Định nghĩa $f: \mathbb{N} \to \mathbb{Z}$ bởi
>
> $$
> f(n) = \begin{cases} n/2 & \text{nếu } n \text{ chẵn} \\ -(n-1)/2 & \text{nếu } n \text{ lẻ} \end{cases}
> $$
>
> Đây là song ánh: $1 \mapsto 0$, $2 \mapsto 1$, $3 \mapsto -1$, $4 \mapsto 2$, $5 \mapsto -2$, $\ldots$
>
> **(b)** $\mathbb{N} \sim \{2, 4, 6, 8, \ldots\}$: Ánh xạ $n \mapsto 2n$ là song ánh. Tập số chẵn dương "cùng kích cỡ" với $\mathbb{N}$, dù là tập con thực sự.
>
> **(c)** $(0,1) \sim \mathbb{R}$: Ánh xạ $f(x) = \tan\!\left(\pi x - \pi/2\right)$ là song ánh từ $(0,1)$ lên $\mathbb{R}$.

> [!note] Remark 2.5 — Nghịch lý Hilbert
> Tính chất ở (b) — một tập vô hạn có thể đồng lực lượng với tập con thực sự — đôi khi được dùng làm **định nghĩa** của tập vô hạn (theo Dedekind). Đây là điều không thể xảy ra với tập hữu hạn.

---

## Tập đếm được (Countable Sets)

### Definition

> [!definition] Definition 2.6 — Tập đếm được và không đếm được
> - Tập $A$ là **đếm được vô hạn** (countably infinite) nếu $A \sim \mathbb{N}$, tức tồn tại song ánh $f: \mathbb{N} \to A$.
> - Tập $A$ là **đếm được** (countable) nếu $A$ hữu hạn hoặc đếm được vô hạn.
> - Tập $A$ là **không đếm được** (uncountable) nếu $A$ vô hạn và $A \not\sim \mathbb{N}$.

### Theorem

> [!theorem] Theorem 2.7 — $\mathbb{Q}$ là tập đếm được
> Tập số hữu tỷ $\mathbb{Q}$ là đếm được vô hạn.

**Proof.**
Đủ để chứng minh $\mathbb{Q}^+ = \{p/q \mid p, q \in \mathbb{N}\}$ đếm được (phần còn lại xử lý tương tự).

Sắp xếp $\mathbb{Q}^+$ thành lưới vô hạn, với hàng $p$ và cột $q$ chứa $p/q$:

$$
\begin{array}{cccccc}
1/1 & 1/2 & 1/3 & 1/4 & \cdots \\
2/1 & 2/2 & 2/3 & 2/4 & \cdots \\
3/1 & 3/2 & 3/3 & 3/4 & \cdots \\
\vdots & \vdots & \vdots & \vdots & \ddots
\end{array}
$$

Duyệt theo đường chéo: $1/1 \to 1/2 \to 2/1 \to 3/1 \to 2/2 \to 1/3 \to 1/4 \to \cdots$, bỏ qua các phân số trùng nhau (như $2/2 = 1/1$). Mỗi phần tử của $\mathbb{Q}^+$ xuất hiện đúng một lần, cho ta đơn ánh $\mathbb{Q}^+ \hookrightarrow \mathbb{N}$. Vì $\mathbb{Q}^+$ rõ ràng vô hạn, ta có $\mathbb{Q}^+ \sim \mathbb{N}$. $\blacksquare$

> [!theorem] Theorem 2.8 — Hợp đếm được của tập đếm được
> Nếu $\{A_n\}_{n=1}^\infty$ là dãy các tập đếm được thì $\bigcup_{n=1}^\infty A_n$ cũng đếm được.

**Proof.**
Với mỗi $n$, viết $A_n = \{a_{n,1}, a_{n,2}, a_{n,3}, \ldots\}$. Xét mảng $(a_{n,k})_{n,k \geq 1}$ và duyệt theo đường chéo (như chứng minh Theorem 2.7). Mọi phần tử của $\bigcup A_n$ được liệt kê, nên tập hợp này đếm được. $\blacksquare$

> [!corollary] Corollary 2.9
> **(a)** Mọi tập con của tập đếm được đều đếm được.
>
> **(b)** Tích Descartes $A \times B$ của hai tập đếm được là đếm được.
>
> **(c)** Tập các số đại số (algebraic numbers) — các nghiệm của đa thức hệ số nguyên — là đếm được.

---

## $\mathbb{R}$ không đếm được — Cantor's Diagonal Argument

### Theorem

> [!theorem] Theorem 2.10 — $\mathbb{R}$ không đếm được
> Tập số thực $\mathbb{R}$ là không đếm được; cụ thể, khoảng $(0, 1)$ là không đếm được.

**Proof** (Cantor's diagonal argument, 1891).

Giả sử phản chứng: $(0,1)$ đếm được, tức tồn tại danh sách đầy đủ $x_1, x_2, x_3, \ldots$ liệt kê mọi phần tử của $(0,1)$. Viết mỗi $x_n$ dưới dạng khai triển thập phân:

$$
\begin{aligned}
x_1 &= 0.\mathbf{d_{11}} d_{12} d_{13} d_{14} \cdots \\
x_2 &= 0.d_{21} \mathbf{d_{22}} d_{23} d_{24} \cdots \\
x_3 &= 0.d_{31} d_{32} \mathbf{d_{33}} d_{34} \cdots \\
x_4 &= 0.d_{41} d_{42} d_{43} \mathbf{d_{44}} \cdots \\
& \vdots
\end{aligned}
$$

Xây dựng số $y = 0.y_1 y_2 y_3 \cdots \in (0,1)$ với chữ số thứ $n$ được chọn là:

$$
y_n = \begin{cases} 2 & \text{nếu } d_{nn} \neq 2 \\ 3 & \text{nếu } d_{nn} = 2 \end{cases}
$$

(Dùng $2$ và $3$ để tránh vấn đề $0.999\ldots = 1.000\ldots$.)

Khi đó $y \in (0,1)$ nhưng $y \neq x_n$ với mọi $n$ (vì $y$ khác $x_n$ ở chữ số thứ $n$). Mâu thuẫn với giả thiết danh sách đầy đủ. $\blacksquare$

> [!note] Remark 2.11 — Hệ quả lớn
> Vì tập số đại số đếm được (Corollary 2.9c) và $\mathbb{R}$ không đếm được, **hầu hết** số thực là số siêu việt (transcendental, không đại số). Cụ thể: $\mathbb{R} \setminus \{\text{algebraic}\}$ không đếm được. Vậy $\pi$, $e$, $\ln 2$ không phải "ngoại lệ" — chúng thuộc về "phần lớn" của $\mathbb{R}$.

---

## Định lý Cantor — Power Set luôn lớn hơn

### Theorem

> [!theorem] Theorem 2.12 — Định lý Cantor (Cantor's Theorem)
> Với mọi tập hợp $A$, ta có $|A| < |\mathcal{P}(A)|$, tức không tồn tại song ánh từ $A$ lên $\mathcal{P}(A)$.

**Proof.**
Đơn ánh $f: A \to \mathcal{P}(A)$ với $f(a) = \{a\}$ cho thấy $|A| \leq |\mathcal{P}(A)|$.

Còn lại, cần chứng minh không tồn tại song ánh. Giả sử $g: A \to \mathcal{P}(A)$ là bất kỳ hàm nào. Xây dựng:

$$
D = \{a \in A \mid a \notin g(a)\} \subseteq A
$$

Rõ ràng $D \in \mathcal{P}(A)$. Ta hỏi: có tồn tại $a^* \in A$ sao cho $g(a^*) = D$ không?

- Nếu $a^* \in D$ thì theo định nghĩa $D$: $a^* \notin g(a^*) = D$. Mâu thuẫn.
- Nếu $a^* \notin D$ thì theo định nghĩa $D$: $a^* \in g(a^*) = D$. Mâu thuẫn.

Trong cả hai trường hợp đều mâu thuẫn, nên $D \notin \text{Im}(g)$: không có $g$ nào là song ánh. $\blacksquare$

> [!corollary] Corollary 2.13 — Vô hạn mức độ vô hạn
> Tồn tại một dãy vô hạn các "kích cỡ vô hạn" tăng dần:
>
> $$
> |\mathbb{N}| < |\mathcal{P}(\mathbb{N})| < |\mathcal{P}(\mathcal{P}(\mathbb{N}))| < \cdots
> $$

> [!note] Remark 2.14 — Liên hệ với $\mathbb{R}$
> Có thể chứng minh $|\mathbb{R}| = |\mathcal{P}(\mathbb{N})| = 2^{\aleph_0}$ (lực lượng liên tục). Câu hỏi liệu có tập $S$ nào với $|\mathbb{N}| < |S| < |\mathbb{R}|$ không — gọi là **Continuum Hypothesis** — được Gödel và Cohen chứng minh là không thể giải quyết được trong hệ tiên đề ZFC chuẩn.

---

## Định lý Cantor-Schröder-Bernstein

### Theorem

> [!theorem] Theorem 2.15 — Cantor-Schröder-Bernstein (CSB)
> Nếu $|A| \leq |B|$ và $|B| \leq |A|$ thì $|A| = |B|$.
>
> Tương đương: nếu tồn tại đơn ánh $f: A \to B$ và đơn ánh $g: B \to A$ thì tồn tại song ánh $h: A \to B$.

**Proof sketch.**
Ý tưởng: vì $f(A) \subseteq B$ và $g(B) \subseteq A$, ta "phân loại" mỗi phần tử theo "nguồn gốc" của nó: bắt đầu từ đâu khi truy ngược các ánh xạ $f$ và $g$.

Định nghĩa $A$-chuỗi (A-chain) là chuỗi $\ldots \xrightarrow{g} a' \xrightarrow{f} b \xrightarrow{g} a \xrightarrow{f} \ldots$ Mỗi phần tử của $A \cup B$ thuộc đúng một chuỗi. Đặt:

$$
h(a) = \begin{cases} f(a) & \text{nếu } a \text{ thuộc chuỗi bắt đầu từ } A \text{ hoặc chuỗi vô hạn} \\ g^{-1}(a) & \text{nếu } a \text{ thuộc chuỗi bắt đầu từ } B \end{cases}
$$

Có thể kiểm tra $h$ là song ánh. $\blacksquare$

### Worked Example

> [!example] Example 2.16 — Áp dụng CSB: $(0,1) \sim [0,1]$
>
> Ta có đơn ánh $f: (0,1) \hookrightarrow [0,1]$ là ánh xạ bao hàm $f(x) = x$.
>
> Ta cũng có đơn ánh $g: [0,1] \hookrightarrow (0,1)$ với $g(x) = \dfrac{x}{2} + \dfrac{1}{4}$ (ánh xạ $[0,1]$ vào $[1/4, 3/4] \subset (0,1)$).
>
> Theo CSB, $(0,1) \sim [0,1]$. Loại khoảng (mở, đóng, nửa mở) không ảnh hưởng đến lực lượng của tập con vô hạn của $\mathbb{R}$.

---

## Lực lượng của $\mathbb{R}$ và các tập con

### Theorem

> [!theorem] Theorem 2.17 — Lực lượng của các tập con $\mathbb{R}$
> **(a)** Mọi khoảng $(a, b)$, $[a, b]$, $(a, b]$, $[a, b)$ với $a < b$ đều có cùng lực lượng với $\mathbb{R}$.
>
> **(b)** $|\mathbb{R}^n| = |\mathbb{R}|$ với mọi $n \geq 1$.
>
> **(c)** $|\mathbb{R}| = |\mathcal{P}(\mathbb{N})| = 2^{\aleph_0}$.

**Proof sketch của (a):** $(0,1) \sim \mathbb{R}$ qua $f(x) = \tan(\pi x - \pi/2)$, và các khoảng khác biến về $(0,1)$ qua phép tịnh tiến và co dãn tuyến tính. Dùng CSB để xử lý các đầu mút.

**Proof sketch của (b):** Với $n = 2$: viết mỗi $(x, y) \in \mathbb{R}^2$ dưới dạng khai triển thập phân và "xen kẽ" chữ số tạo ra một số thực, từ đó xây đơn ánh $\mathbb{R}^2 \hookrightarrow \mathbb{R}$. Chiều ngược lại hiển nhiên. Áp dụng CSB. $\blacksquare$

---

## SageMath Cheatsheet

```python
# Minh họa bijection N <-> Z
def f(n):
    if n % 2 == 0:
        return n // 2
    else:
        return -(n - 1) // 2

for n in range(1, 11):
    print(f"f({n}) = {f(n)}")
# f(1)=0, f(2)=1, f(3)=-1, f(4)=2, f(5)=-2, ...

# Liệt kê Q+ theo đường chéo Cantor
from fractions import Fraction

def cantor_enum_Q_pos(limit=20):
    seen = set()
    result = []
    diag = 1
    while len(result) < limit:
        for p in range(1, diag):
            q = diag - p
            frac = Fraction(p, q)
            if frac not in seen:
                seen.add(frac)
                result.append(frac)
        diag += 1
    return result

print(cantor_enum_Q_pos(10))
# [1, 1/2, 2, 3, 1/3, 1/4, 2/3, 3/2, 4, 5, ...]

# Cantor diagonal: xây y thoát khỏi danh sách
def cantor_diagonal(decimal_list, digits=10):
    """Xây số y khác x_n tại vị trí n"""
    y_digits = []
    for n, x in enumerate(decimal_list):
        d = int(str(x).replace('0.', '')[n]) if n < len(str(x)) - 2 else 0
        y_digits.append(2 if d != 2 else 3)
    return float('0.' + ''.join(map(str, y_digits)))

sample = [0.1234, 0.5678, 0.9012, 0.3456]
y = cantor_diagonal(sample)
print(f"y = {y}")  # y khác mọi phần tử trong sample tại vị trí tương ứng
```

---

## Summary / Key Takeaways

- **Lực lượng** (cardinality): so sánh kích cỡ tập hợp qua song ánh. $A \sim B$ khi tồn tại bijection $A \to B$.
- **Tập đếm được**: $A \sim \mathbb{N}$ (đếm được vô hạn) hoặc $A$ hữu hạn. $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, tập đại số — tất cả đếm được.
- **$\mathbb{R}$ không đếm được**: Cantor diagonal argument (1891) — không thể liệt kê toàn bộ $(0,1)$.
- **Hầu hết số thực là siêu việt** (transcendental): vì số đại số đếm được, mà $\mathbb{R}$ thì không.
- **Định lý Cantor**: $|A| < |\mathcal{P}(A)|$ với mọi $A$ — tồn tại vô hạn nhiều "cấp độ vô hạn".
- **Cantor-Schröder-Bernstein**: $|A| \leq |B|$ và $|B| \leq |A|$ thì $|A| = |B|$ — công cụ thiết yếu để chứng minh đồng lực lượng.
- Mọi khoảng (hữu hạn hoặc vô hạn) đều có lực lượng bằng $|\mathbb{R}| = 2^{\aleph_0}$ (lực lượng liên tục).

---

## References

- Rudin, W. *Principles of Mathematical Analysis* (3rd ed.), Chapter 2 (Appendix).
- Folland, G. B. *Real Analysis* (2nd ed.), Appendix.
- Lebl, J. *Basic Analysis I*, Section 0.3–0.4.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.), Chapter 1.
- Wikipedia: [Cantor's diagonal argument](https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument), [Cantor's theorem](https://en.wikipedia.org/wiki/Cantor%27s_theorem).
