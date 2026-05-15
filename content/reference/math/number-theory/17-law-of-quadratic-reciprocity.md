---
title: "17. Luật Tương Hỗ Bậc Hai (Law of Quadratic Reciprocity)"
type: theory
tags: [math, number-theory, lesson-17]
aliases: [Quadratic Reciprocity, QR Law, Theorema Aureum, Gauss Lemma]
created: 2026-05-15
---

> **Prerequisites**: [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]], [[15-quadratic-residues|15. Thặng Dư Bậc Hai]]
> **Objectives**:
> - Phát biểu chính xác Luật Tương Hỗ Bậc Hai và hai bổ sung
> - Chứng minh Bổ Đề Gauss và ứng dụng tính $\left(\frac{a}{p}\right)$
> - Chứng minh Bổ Đề Eisenstein — cầu nối từ Gauss đến hình học
> - Chứng minh Luật Tương Hỗ bằng phương pháp đếm điểm nguyên trong hình chữ nhật
> - Áp dụng thành thạo bộ ba công thức để tính mọi ký hiệu Legendre

---

## Motivation / Intuition

Câu hỏi: Nếu biết $p$ là thặng dư bậc hai modulo $q$, điều đó nói gì về $q$ so với $p$?

Ví dụ: $5$ là QR mod $11$ (vì $4^2 = 16 \equiv 5$). Vậy $11$ có là QR mod $5$ không?
$11 \equiv 1 \pmod 5$, và $1 = 1^2$ là hiển nhiên QR. Trả lời: **có**.

Ví dụ khác: $3$ là QNR mod $7$ (vì $QR_7 = \{1,2,4\}$). Vậy $7$ có là QR mod $3$ không?
$7 \equiv 1 \pmod 3$, nên $7$ là QR mod $3$. Tức một là QNR và kia là QR — **không đồng hướng**.

**Luật Tương Hỗ Bậc Hai** (Law of Quadratic Reciprocity) trả lời câu hỏi này một cách chính xác và tổng quát. Gauss gọi nó là **"Theorema Aureum"** — Định Lý Vàng — và tự tìm ra 6 chứng minh khác nhau. Đến nay có hơn 200 chứng minh được ghi nhận, mỗi chứng minh làm sáng tỏ một khía cạnh khác nhau của số học.

Ta sẽ học chứng minh của **Eisenstein (1844)** — được nhiều người coi là đẹp nhất: dùng đếm điểm nguyên trong hình chữ nhật, thuần túy hình học và số học.

---

## Bổ Đề Gauss (Gauss's Lemma)

Bổ Đề Gauss là bước trung gian then chốt, liên hệ ký hiệu Legendre với một phép đếm đơn giản.

### Definition

> [!definition] Definition 17.1 — Thặng Dư Rút Gọn Có Dấu
> Cho $p$ nguyên tố lẻ, $a \in \mathbb{Z}$, $p \nmid a$.
>
> Xét tập $S_a = \left\{a,\ 2a,\ 3a,\ \ldots,\ \frac{p-1}{2} \cdot a\right\}$ rút gọn modulo $p$ vào khoảng $\left(-\frac{p}{2},\ \frac{p}{2}\right)$: mỗi phần tử $ka$ được thay bởi số $r_{ka}$ thỏa $r_{ka} \equiv ka \pmod p$ và $-\frac{p}{2} < r_{ka} < \frac{p}{2}$.
>
> Gọi $\nu$ là **số lượng** các $r_{ka}$ âm (tức $r_{ka} < 0$) trong quá trình trên.

### Theorem

> [!theorem] Theorem 17.2 — Bổ Đề Gauss (Gauss's Lemma)
> Với ký hiệu ở Definition 17.1:
>
> $$
> \left(\frac{a}{p}\right) = (-1)^\nu
> $$

**Proof.**

Gọi $b_1, b_2, \ldots, b_t$ là các $r_{ka}$ dương và $c_1, c_2, \ldots, c_s$ là các $|r_{ka}|$ với $r_{ka}$ âm (tức $c_i = -r_{ka}$ dương). Ta có $t + s = \frac{p-1}{2}$.

**Bước 1: Chứng minh $\{b_1, \ldots, b_t, c_1, \ldots, c_s\} = \left\{1, 2, \ldots, \frac{p-1}{2}\right\}$.**

Rõ ràng mỗi phần tử thuộc $\left\{1, \ldots, \frac{p-1}{2}\right\}$ (theo định nghĩa rút gọn). Cần kiểm tra phân biệt.

- Nếu $b_i = b_j$: $ia \equiv ja \pmod p$, suy ra $p \mid (i-j)a$, do $\gcd(a,p)=1$: $p \mid i-j$. Với $1 \leq i,j \leq \frac{p-1}{2}$, suy ra $i=j$.
- Nếu $c_i = c_j$: tương tự.
- Nếu $b_i = c_j$: thì $ia \equiv -ja \pmod p$ (vì $b_i = r_{ia}$ dương, $c_j = -r_{ja}$ dương với $r_{ja}$ âm). Suy ra $p \mid (i+j)a$, tức $p \mid i+j$. Nhưng $2 \leq i+j \leq p-1$: mâu thuẫn.

Vậy tất cả các phần tử phân biệt, và do có đúng $\frac{p-1}{2}$ phần tử, tập hợp là $\left\{1, 2, \ldots, \frac{p-1}{2}\right\}$.

**Bước 2: Tính tích.**

Tích tất cả phần tử của $S_a$:

$$
a \cdot 2a \cdot 3a \cdots \frac{p-1}{2}a = a^{(p-1)/2} \cdot \left(\frac{p-1}{2}\right)!
$$

Mặt khác, mỗi $ka \equiv \pm r_{ka}$ với dấu $(-1)^{\mathbf{1}[r_{ka}<0]}$. Bước 1 cho thấy $\{r_{ka}\} = \{b_i\} \cup \{-c_j\}$, và $\{b_i, c_j\} = \left\{1,\ldots,\frac{p-1}{2}\right\}$. Do đó:

$$
\prod_{k=1}^{(p-1)/2} (ka) \equiv (-1)^s \cdot \prod_{i=1}^t b_i \cdot \prod_{j=1}^s c_j = (-1)^s \cdot \left(\frac{p-1}{2}\right)! \pmod p
$$

Kết hợp:

$$
a^{(p-1)/2} \cdot \left(\frac{p-1}{2}\right)! \equiv (-1)^s \cdot \left(\frac{p-1}{2}\right)! \pmod p
$$

Vì $\gcd\!\left(\left(\frac{p-1}{2}\right)!, p\right) = 1$, chia cả hai vế:

$$
a^{(p-1)/2} \equiv (-1)^s \pmod p
$$

Từ Tiêu Chuẩn Euler: $\left(\frac{a}{p}\right) = (-1)^s = (-1)^\nu$. $\blacksquare$

> [!example] Example 17.3 — Dùng Gauss's Lemma tính $\left(\frac{3}{11}\right)$
>
> $p = 11$, $a = 3$. Tập $S_3 = \{3, 6, 9, 12, 15\}$ rút gọn modulo $11$:
>
> | $k$ | $3k$ | $3k \bmod 11$ trong $(-5.5, 5.5)$ | Dương/Âm |
> |-----|--------|----------------------------------|---------|
> | $1$ | $3$ | $3$ | $+$ |
> | $2$ | $6$ | $6 - 11 = -5$ | $-$ |
> | $3$ | $9$ | $9 - 11 = -2$ | $-$ |
> | $4$ | $12$ | $12 - 11 = 1$ | $+$ |
> | $5$ | $15$ | $15 - 11 = 4$ | $+$ |
>
> $\nu = 2$ (hai số âm). $\left(\frac{3}{11}\right) = (-1)^2 = 1$.
>
> Kiểm tra: $5^2 = 25 \equiv 3 \pmod{11}$ ✓.

---

## Bổ Đề Eisenstein — Liên Hệ Với Sàn Hàm

Bổ đề Gauss cho $(-1)^\nu$ với $\nu$ = số phần tử âm. Bổ đề Eisenstein biến đổi $\nu$ thành tổng hàm sàn — dạng tiện để đếm điểm nguyên.

### Theorem

> [!theorem] Theorem 17.4 — Bổ Đề Eisenstein (Eisenstein's Lemma)
> Cho $p$ nguyên tố lẻ, $a$ là số nguyên lẻ với $\gcd(a, p) = 1$. Thì:
>
> $$
> \left(\frac{a}{p}\right) = (-1)^{\,\sum_{k=1}^{(p-1)/2} \left\lfloor ka/p \right\rfloor}
> $$

**Proof.**

Với mỗi $k \in \left\{1, \ldots, \frac{p-1}{2}\right\}$, dùng phép chia Euclid:

$$
ka = p \left\lfloor \frac{ka}{p} \right\rfloor + r_{ka}
$$

với $0 < r_{ka} < p$. Gọi $r_{ka}^* \in \left(-\frac{p}{2}, \frac{p}{2}\right)$ là phần dư được hiệu chỉnh (như trong Gauss's Lemma):

$$
r_{ka}^* = \begin{cases} r_{ka} & \text{nếu } r_{ka} \leq \frac{p-1}{2} \\ r_{ka} - p & \text{nếu } r_{ka} > \frac{p-1}{2} \end{cases}
$$

Từ Gauss's Lemma, $\nu$ = số $k$ có $r_{ka}^* < 0$ = số $k$ có $r_{ka} > \frac{p-1}{2}$.

Cộng tất cả các phương trình chia:

$$
\sum_{k=1}^{(p-1)/2} ka = p \sum_{k=1}^{(p-1)/2} \left\lfloor \frac{ka}{p} \right\rfloor + \sum_{k=1}^{(p-1)/2} r_{ka}
$$

Từ Bước 1 của Gauss's Lemma, $\{|r_{ka}^*|\} = \left\{1, \ldots, \frac{p-1}{2}\right\}$, nên:

$$
\sum_{k=1}^{(p-1)/2} |r_{ka}^*| = \frac{(p-1)/2 \cdot ((p-1)/2 + 1)}{2} = \frac{p^2-1}{8}
$$

Mặt khác:

$$
\sum r_{ka} = \sum r_{ka}^* + \nu \cdot p = \sum |r_{ka}^*| - 2\sum_{\text{âm}} |r_{ka}^*| + \nu p
$$

Vì $a$ lẻ, $\sum_{k=1}^{(p-1)/2} ka = a \cdot \frac{(p-1)/2 \cdot (p+1)/2}{2} = a \cdot \frac{p^2-1}{8}$.

Thay vào và rút gọn:

$$
a \cdot \frac{p^2-1}{8} = p \sum \left\lfloor \frac{ka}{p} \right\rfloor + \frac{p^2-1}{8} - 2\sum_{\text{âm}} |r_{ka}^*| + \nu p
$$

Lấy modulo $2$ (chú ý $a$ lẻ và $\frac{p^2-1}{8}$ là số nguyên):

$$
\frac{p^2-1}{8} \equiv p \sum \left\lfloor \frac{ka}{p} \right\rfloor + \frac{p^2-1}{8} + \nu p \pmod 2
$$

$$
0 \equiv \sum \left\lfloor \frac{ka}{p} \right\rfloor + \nu \pmod 2 \quad (\text{vì } p \text{ lẻ, } p \equiv 1 \pmod 2)
$$

Suy ra $\nu \equiv \sum_{k=1}^{(p-1)/2} \left\lfloor \frac{ka}{p} \right\rfloor \pmod 2$, tức:

$$
\left(\frac{a}{p}\right) = (-1)^\nu = (-1)^{\sum \lfloor ka/p \rfloor}. \quad \blacksquare
$$

---

## Luật Tương Hỗ Bậc Hai

### Theorem

> [!theorem] Theorem 17.5 — Luật Tương Hỗ Bậc Hai (Law of Quadratic Reciprocity)
> Cho $p$ và $q$ là hai số nguyên tố lẻ phân biệt. Thì:
>
> $$
> \left(\frac{p}{q}\right) \left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2} \cdot \frac{q-1}{2}}
> $$
>
> Cụ thể hơn:
>
> $$
> \left(\frac{p}{q}\right) = \begin{cases} \left(\frac{q}{p}\right) & \text{nếu } p \equiv 1 \pmod 4 \text{ hoặc } q \equiv 1 \pmod 4 \\ -\left(\frac{q}{p}\right) & \text{nếu } p \equiv q \equiv 3 \pmod 4 \end{cases}
> $$

**Proof (Eisenstein's Geometric Proof).**

Theo Bổ Đề Eisenstein (áp dụng được vì $p, q$ nguyên tố lẻ):

$$
\left(\frac{q}{p}\right) = (-1)^{A}, \quad \left(\frac{p}{q}\right) = (-1)^{B}
$$

với

$$
A = \sum_{k=1}^{(p-1)/2} \left\lfloor \frac{kq}{p} \right\rfloor, \qquad B = \sum_{j=1}^{(q-1)/2} \left\lfloor \frac{jp}{q} \right\rfloor.
$$

Cần chứng minh:

$$
A + B = \frac{p-1}{2} \cdot \frac{q-1}{2}.
$$

**Diễn giải hình học:** Xét hình chữ nhật $R$ với các điểm nguyên $(x, y)$ thỏa:

$$
1 \leq x \leq \frac{p-1}{2}, \quad 1 \leq y \leq \frac{q-1}{2}.
$$

Số điểm nguyên trong $R$ là $\dfrac{p-1}{2} \cdot \dfrac{q-1}{2}$.

Chia $R$ bởi đường chéo $D: qx = py$ (hay $y = \frac{q}{p}x$) thành hai phần:

- **Vùng dưới** $D$ ($qx > py$, tức $y < \frac{q}{p}x$): số điểm nguyên $(x,y)$ với $1 \leq x \leq \frac{p-1}{2}$ và $1 \leq y < \frac{q}{p}x$ là $\sum_{x=1}^{(p-1)/2} \left\lfloor \frac{qx}{p} \right\rfloor - \mathbf{0}$ (vì $y \geq 1$ và $\lfloor qx/p \rfloor$ là số nguyên $y$ từ $1$ đến $\lfloor qx/p \rfloor$). Thực ra: số $y$ với $1 \leq y \leq qx/p - 1$ (chặt) là $\left\lfloor \frac{qx - 1}{p} \right\rfloor$, nhưng do $p \nmid qx$ (vì $\gcd(p,q)=1$ và $1 \leq x \leq \frac{p-1}{2}$): $\frac{qx}{p}$ không nguyên, nên số $y$ với $1 \leq y \leq \frac{qx}{p}$ là $\left\lfloor \frac{qx}{p} \right\rfloor$. Tổng: $A = \sum_{x=1}^{(p-1)/2} \left\lfloor \frac{qx}{p} \right\rfloor$.

- **Vùng trên** $D$ ($py > qx$, tức $x < \frac{p}{q}y$): tương tự, số điểm là $B = \sum_{y=1}^{(q-1)/2} \left\lfloor \frac{py}{q} \right\rfloor$.

**Điểm mấu chốt:** Không có điểm nguyên nào nằm **trên** đường chéo $D$ trong $R$. Thật vậy, nếu $(x_0, y_0)$ nằm trên $D$ thì $qx_0 = py_0$, suy ra $p \mid qx_0$, do $\gcd(p,q)=1$: $p \mid x_0$. Nhưng $1 \leq x_0 \leq \frac{p-1}{2} < p$ — mâu thuẫn.

Do đó: **mỗi** điểm nguyên trong $R$ thuộc vào đúng một trong hai vùng (dưới hoặc trên $D$). Suy ra:

$$
A + B = \frac{p-1}{2} \cdot \frac{q-1}{2}.
$$

Vậy:

$$
\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{B} \cdot (-1)^{A} = (-1)^{A+B} = (-1)^{\frac{p-1}{2}\cdot\frac{q-1}{2}}. \quad \blacksquare
$$

> [!note] Remark 17.6 — Ý Nghĩa Của Chứng Minh
> Chứng minh Eisenstein cho thấy tại sao Luật Tương Hỗ Bậc Hai đúng: hai tổng hàm sàn $A$ và $B$ là "bổ sung nhau" — cùng đếm các điểm nguyên trong một hình chữ nhật, chia theo đường chéo. Điều đặc biệt là đường chéo không cắt qua điểm nguyên nào (vì $p, q$ nguyên tố phân biệt), làm cho phép đếm hoàn hảo.

---

## Hai Bổ Sung (Supplementary Laws)

Cùng với Theorem 17.5, hai công thức sau hoàn chỉnh công cụ tính Legendre symbol:

> [!theorem] Theorem 17.7 — Hai Bổ Sung của Luật Tương Hỗ
> Cho $p$ là số nguyên tố lẻ:
>
> **(I)** $\left(\frac{-1}{p}\right) = (-1)^{(p-1)/2}$:
>
> $$
> \left(\frac{-1}{p}\right) = \begin{cases} 1 & p \equiv 1 \pmod{4} \\ -1 & p \equiv 3 \pmod{4} \end{cases}
> $$
>
> **(II)** $\left(\frac{2}{p}\right) = (-1)^{(p^2-1)/8}$:
>
> $$
> \left(\frac{2}{p}\right) = \begin{cases} 1 & p \equiv \pm 1 \pmod{8} \\ -1 & p \equiv \pm 3 \pmod{8} \end{cases}
> $$

(Đã chứng minh tại Theorem 16.8 và 16.9.)

---

## Ứng Dụng: Tính Legendre Symbol Nhanh

Quy trình tính $\left(\frac{a}{p}\right)$:

1. **Rút gọn**: $a \leftarrow a \bmod p$, thay $a$ bởi số nhỏ hơn.
2. **Phân tích**: viết $a = (-1)^{e_0} \cdot 2^{e_2} \cdot q_1^{f_1} \cdots q_r^{f_r}$.
3. **Tách nhân tử**: $\left(\frac{a}{p}\right) = \left(\frac{-1}{p}\right)^{e_0} \cdot \left(\frac{2}{p}\right)^{e_2} \cdot \prod_i \left(\frac{q_i}{p}\right)^{f_i}$.
4. **Dùng QR Law**: $\left(\frac{q_i}{p}\right) \to \left(\frac{p \bmod q_i}{q_i}\right) \times \text{dấu}$.
5. **Đệ quy** cho đến khi đạt $\left(\frac{1}{q}\right) = 1$ hoặc $\left(\frac{0}{q}\right) = 0$.

### Worked Example

> [!example] Example 17.8 — Tính $\left(\frac{71}{73}\right)$
>
> $73 \equiv 1 \pmod 4$, nên (QR Law không đổi dấu khi một trong hai $\equiv 1 \pmod 4$):
>
> $$
> \left(\frac{71}{73}\right) = \left(\frac{73}{71}\right) = \left(\frac{2}{71}\right)
> $$
>
> ($73 \equiv 2 \pmod{71}$.)
>
> $71 \equiv 7 \pmod 8$, nên $\left(\frac{2}{71}\right) = 1$ (vì $71 \equiv -1 \pmod 8$).
>
> Vậy $\left(\frac{71}{73}\right) = 1$: $71$ là QR mod $73$.

> [!example] Example 17.9 — Tính $\left(\frac{3}{p}\right)$ tổng quát
>
> Xét ba trường hợp theo $p \bmod 12$:
>
> **QR Law** (với $3 \equiv 3 \pmod 4$):
>
> $$
> \left(\frac{3}{p}\right)\left(\frac{p}{3}\right) = (-1)^{\frac{3-1}{2}\cdot\frac{p-1}{2}} = (-1)^{(p-1)/2}
> $$
>
> Nếu $p \equiv 1 \pmod 4$: $(-1)^{(p-1)/2} = 1$, nên $\left(\frac{3}{p}\right) = \left(\frac{p}{3}\right)$.
>
> Nếu $p \equiv 3 \pmod 4$: $(-1)^{(p-1)/2} = -1$, nên $\left(\frac{3}{p}\right) = -\left(\frac{p}{3}\right)$.
>
> Mà $\left(\frac{p}{3}\right)$ phụ thuộc $p \bmod 3$:
> - $p \equiv 1 \pmod 3$: $\left(\frac{p}{3}\right) = \left(\frac{1}{3}\right) = 1$.
> - $p \equiv 2 \pmod 3$: $\left(\frac{p}{3}\right) = \left(\frac{2}{3}\right) = -1$ (vì $3 \equiv 3 \pmod 8$, nên $\left(\frac{2}{3}\right) = -1$).
>
> Kết hợp (theo $p \bmod 12$):
>
> | $p \bmod 12$ | $\left(\frac{3}{p}\right)$ |
> |-------------|--------------------------|
> | $1$ ($\equiv 1 \bmod 4$, $\equiv 1 \bmod 3$) | $1$ |
> | $5$ ($\equiv 1 \bmod 4$, $\equiv 2 \bmod 3$) | $-1$ |
> | $7$ ($\equiv 3 \bmod 4$, $\equiv 1 \bmod 3$) | $-1$ |
> | $11$ ($\equiv 3 \bmod 4$, $\equiv 2 \bmod 3$) | $1$ |
>
> Kết luận: $3 \in QR_p \iff p \equiv \pm 1 \pmod{12}$.

> [!example] Example 17.10 — Tính $\left(\frac{1013}{2017}\right)$
>
> Cả hai là số nguyên tố. $2017 \equiv 1 \pmod 4$, nên QR Law không đổi dấu:
>
> $$
> \left(\frac{1013}{2017}\right) = \left(\frac{2017}{1013}\right) = \left(\frac{2017 \bmod 1013}{1013}\right) = \left(\frac{1004}{1013}\right)
> $$
>
> Phân tích: $1004 = 4 \times 251 = 2^2 \times 251$.
>
> $$
> \left(\frac{1004}{1013}\right) = \left(\frac{4}{1013}\right)\left(\frac{251}{1013}\right) = 1 \cdot \left(\frac{251}{1013}\right)
> $$
>
> $1013 \equiv 1 \pmod 4$:
>
> $$
> \left(\frac{251}{1013}\right) = \left(\frac{1013}{251}\right) = \left(\frac{1013 \bmod 251}{251}\right) = \left(\frac{7}{251}\right)
> $$
>
> ($1013 = 4 \times 251 + 9$... thực ra $4 \times 251 = 1004$, $1013 - 1004 = 9$. Vậy $1013 \equiv 9 \pmod{251}$? Kiểm tra: $251 \times 4 = 1004 < 1013 < 1255 = 251 \times 5$. $1013 - 1004 = 9$. Đúng.)
>
> $$
> \left(\frac{251}{1013}\right) = \left(\frac{9}{251}\right) = \left(\frac{3^2}{251}\right) = 1
> $$
>
> Vậy $\left(\frac{1013}{2017}\right) = 1$: $1013$ là QR mod $2017$.

---

## Ứng Dụng: Số Nguyên Tố Biểu Diễn Bình Phương

> [!theorem] Theorem 17.11 — Số Nguyên Tố Nào Chia $x^2 + ny^2$?
> Số nguyên tố lẻ $p \nmid n$ chia $x^2 + ny^2$ với $\gcd(x,y,p) = 1$ khi và chỉ khi $\left(\frac{-n}{p}\right) = 1$.
>
> (Vì $x^2 \equiv -ny^2$, nếu $p \nmid y$ thì $(xy^{-1})^2 \equiv -n$, tức $-n \in QR_p$.)

> [!example] Example 17.12 — Số Nguyên Tố Nào Chia $x^2 + 1$?
>
> $p \mid x^2 + 1$ iff $\left(\frac{-1}{p}\right) = 1$ iff $p \equiv 1 \pmod 4$.
>
> Nghĩa là: các số nguyên tố $\equiv 1 \pmod 4$ đều chia $x^2 + 1$ với $x$ thích hợp; các số nguyên tố $\equiv 3 \pmod 4$ không bao giờ chia $x^2 + 1$.

---

## Tổng Kết Bộ Ba Công Thức

Ba công thức tạo thành hệ thống hoàn chỉnh để tính mọi $\left(\frac{a}{p}\right)$:

| Công thức | Nội dung |
|-----------|---------|
| **QR Law** | $\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2}\frac{q-1}{2}}$ |
| **$(-1/p)$** | $= (-1)^{(p-1)/2}$ |
| **$(2/p)$** | $= (-1)^{(p^2-1)/8}$ |

Kết hợp với tính nhân tính: mọi $\left(\frac{a}{p}\right)$ tính được trong $O(\log^2 p)$ thời gian (tương tự Euclid).

---

## SageMath Cheatsheet

```python
# Luật tương hỗ bậc hai: xác nhận
def qr_law_check(p, q):
    lhs = legendre_symbol(p, q) * legendre_symbol(q, p)
    rhs = (-1)**((p-1)//2 * (q-1)//2)
    return lhs == rhs

for p in primes(3, 40):
    for q in primes(3, 40):
        if p != q:
            assert qr_law_check(p, q), f"QR Law fails for p={p}, q={q}"
print("QR Law đúng cho tất cả p, q < 40")

# Tính Legendre symbol bằng đệ quy (Euclid-style)
def legendre(a, p):
    """Tính (a/p) dùng QR Law, Theorem (-1/p), (2/p). Giả sử p nguyên tố lẻ."""
    a = a % p
    if a == 0:
        return 0
    if a == 1:
        return 1
    # Tách -1
    if a == p - 1:
        return (-1)**((p-1)//2)
    # Tách 2
    if a % 2 == 0:
        return legendre(2, p) * legendre(a // 2, p)
    # Tách -1 (nếu a > p/2)
    if a > p // 2:
        return legendre(-1, p) * legendre(p - a, p)
    # a lẻ, 3 <= a < p/2: dùng QR Law
    sign = (-1)**((a-1)//2 * (p-1)//2)
    return sign * legendre(p % a, a)

# Kiểm tra với SageMath
for p in primes(5, 50):
    for a in range(1, p):
        assert legendre(a, p) == legendre_symbol(a, p), f"a={a}, p={p}"
print("Thuật toán Legendre khớp hoàn toàn")

# Bổ đề Gauss: xác minh bằng đếm trực tiếp
def gauss_lemma_nu(a, p):
    """Đếm nu theo Gauss's Lemma."""
    nu = 0
    for k in range(1, (p + 1) // 2):
        r = (k * a) % p
        if r > p // 2:
            nu += 1
    return nu

for p in primes(5, 30):
    g = primitive_root(p)
    for a in range(1, p):
        nu = gauss_lemma_nu(a, p)
        ls = legendre_symbol(a, p)
        assert ls == (-1)**nu, f"Gauss Lemma fails: a={a}, p={p}"
print("Bổ Đề Gauss xác nhận đúng")

# Eisenstein's sum = số điểm nguyên dưới đường chéo
def eisenstein_sum(a, p):
    return sum(int(k * a // p) for k in range(1, (p + 1) // 2))

for p in primes(5, 30):
    for a in range(1, p, 2):  # a lẻ
        eis = eisenstein_sum(a, p)
        nu = gauss_lemma_nu(a, p)
        # nu ≡ eisenstein_sum (mod 2)
        assert eis % 2 == nu % 2, f"Eisenstein fails: a={a}, p={p}"
print("Bổ Đề Eisenstein xác nhận đúng")

# Đếm điểm nguyên trong hình chữ nhật để xác nhận QR Law
def count_lattice_points(p, q):
    """Đếm A và B để kiểm tra A+B = (p-1)/2 * (q-1)/2."""
    A = sum(int(k * q // p) for k in range(1, (p + 1) // 2))
    B = sum(int(j * p // q) for j in range(1, (q + 1) // 2))
    total = (p - 1) // 2 * (q - 1) // 2
    return A, B, total, A + B == total

for p, q in [(5, 7), (7, 11), (11, 13), (13, 17)]:
    A, B, total, ok = count_lattice_points(p, q)
    print(f"p={p}, q={q}: A={A}, B={B}, A+B={A+B}, expected={total}, OK={ok}")
    assert ok
```

---

## Summary / Key Takeaways

- **Luật Tương Hỗ Bậc Hai**: $\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2}\cdot\frac{q-1}{2}}$ — hai ký hiệu Legendre "liên hệ nhau qua hệ số đổi dấu".
- **Quy tắc đổi dấu**: Tích bằng $+1$ (không đổi dấu) trừ khi cả $p \equiv q \equiv 3 \pmod 4$.
- **Bổ Đề Gauss**: $\left(\frac{a}{p}\right) = (-1)^\nu$ với $\nu$ = số phần tử "âm" khi rút gọn $\{a, 2a, \ldots, \frac{p-1}{2}a\}$ vào $\left(-\frac{p}{2}, \frac{p}{2}\right)$.
- **Bổ Đề Eisenstein**: $\left(\frac{a}{p}\right) = (-1)^{\sum \lfloor ka/p \rfloor}$ — biến đếm âm thành tổng hàm sàn.
- **Chứng minh hình học**: $A + B = \frac{p-1}{2}\cdot\frac{q-1}{2}$ vì mọi điểm nguyên trong hình chữ nhật nằm đúng một phía của đường chéo (đường chéo không qua điểm nguyên).
- **Bộ ba hoàn chỉnh**: QR Law + $(-1/p)$ + $(2/p)$ $\Rightarrow$ tính mọi $\left(\frac{a}{p}\right)$ trong $O(\log^2 p)$.
- Xem chứng minh chi tiết hình học tại [[a2-proof-of-quadratic-reciprocity|A2. Luật Tương Hỗ — Chứng Minh Hình Học Đầy Đủ]].

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), §3.4–3.5.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory*, Ch. 5.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), §6.6, §6.13.
- Eisenstein, F. G. *Geometrischer Beweis des Fundamentaltheorems für die quadratischen Reste* (1844).
- Lemmermeyer, F. *Reciprocity Laws: From Euler to Eisenstein*, Springer (2000).
