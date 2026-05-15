---
title: "21. Tích Chập Dirichlet và Hàm Möbius"
type: theory
tags: [math, number-theory, lesson-21]
aliases: [Dirichlet Convolution, Möbius Function]
created: 2026-05-15
---

> **Prerequisites**: [[20-arithmetic-functions|20. Hàm Số Học và Tính Nhân Tính]]
> **Objectives**:
> - Định nghĩa và tính toán tích chập Dirichlet $(f * g)(n)$
> - Chứng minh tích chập là giao hoán, kết hợp và có phần tử đơn vị $\varepsilon$
> - Hiểu tập hàm số học là vành giao hoán dưới tích chập Dirichlet
> - Chứng minh mọi hàm số học $f$ với $f(1) \neq 0$ có nghịch đảo Dirichlet
> - Xác định hàm Möbius $\mu$ là nghịch đảo Dirichlet của $\mathbf{1}$
> - Diễn đạt lại $\tau$, $\sigma$, $\varphi$ bằng ngôn ngữ tích chập
> - Chứng minh tích chập của hai hàm nhân tính lại là nhân tính

---

## Motivation / Intuition

Sau khi khảo sát các hàm số học riêng lẻ ($\tau$, $\sigma$, $\varphi$, $\mu$, $\Lambda$) ở bài 20, câu hỏi tự nhiên là: liệu có một **phép toán** nào kết hợp chúng lại thành một thể thống nhất không?

Câu trả lời là **tích chập Dirichlet**. Khi nhìn qua lăng kính này, những đẳng thức tưởng chừng như mỗi cái một kiểu:
$$\tau = \mathbf{1} * \mathbf{1}, \quad \sigma = \operatorname{id} * \mathbf{1}, \quad \sum_{d \mid n}\varphi(d) = n$$

đều trở thành cùng một khuôn mẫu: $F = f * \mathbf{1}$.

Hơn nữa, khi trang bị tích chập Dirichlet, tập hàm số học trở thành một **vành giao hoán** — một cấu trúc đại số phong phú. Đặc biệt, hàm Möbius $\mu$ đóng vai trò **nghịch đảo** của hàm hằng $\mathbf{1}$. Đây là viên đá tảng để xây dựng Công Thức Đảo Möbius ở bài 22.

---

## Tích Chập Dirichlet (Dirichlet Convolution)

### Định Nghĩa

> [!definition] Definition 21.1 — Tích Chập Dirichlet
> Cho $f, g$ là hai hàm số học. **Tích chập Dirichlet** của $f$ và $g$ là hàm số học $f * g$ định nghĩa bởi:
>
> $$
> (f * g)(n) = \sum_{d \mid n} f(d)\, g\!\left(\frac{n}{d}\right)
> $$
>
> Tổng lấy trên tất cả ước dương $d$ của $n$. Tương đương, viết $d_1 d_2 = n$:
>
> $$
> (f * g)(n) = \sum_{\substack{d_1 d_2 = n \\ d_1, d_2 \geq 1}} f(d_1)\, g(d_2)
> $$

> [!example] Example 21.2 — Tính tích chập tại $n = 6$
>
> Giả sử $f = \mathbf{1}$ (hàm hằng $1$) và $g = \operatorname{id}$ (hàm đồng nhất $g(n)=n$).
>
> Ước của $6$: $\{1, 2, 3, 6\}$.
>
> $$
> (\mathbf{1} * \operatorname{id})(6) = \mathbf{1}(1)\cdot\operatorname{id}(6) + \mathbf{1}(2)\cdot\operatorname{id}(3) + \mathbf{1}(3)\cdot\operatorname{id}(2) + \mathbf{1}(6)\cdot\operatorname{id}(1)
> $$
>
> $$
> = 1\cdot 6 + 1\cdot 3 + 1\cdot 2 + 1\cdot 1 = 12 = \sigma(6) \checkmark
> $$

---

## Cấu Trúc Vành của Hàm Số Học

### Giao Hoán và Kết Hợp

> [!theorem] Theorem 21.3 — Tích chập Dirichlet giao hoán
> Với mọi hàm số học $f, g$:
>
> $$
> f * g = g * f
> $$

**Proof.**
Trong tổng $\sum_{d \mid n} f(d)g(n/d)$, đặt $d' = n/d$ — khi $d$ chạy qua mọi ước của $n$, $d'$ cũng chạy qua mọi ước của $n$. Do đó:

$$
(f*g)(n) = \sum_{d \mid n} f(d)g\!\left(\frac{n}{d}\right) = \sum_{d' \mid n} g(d') f\!\left(\frac{n}{d'}\right) = (g*f)(n) \qquad \blacksquare
$$

> [!theorem] Theorem 21.4 — Tích chập Dirichlet kết hợp
> Với mọi hàm số học $f, g, h$:
>
> $$
> (f * g) * h = f * (g * h)
> $$

**Proof.**
Với mọi $n$:

$$
((f*g)*h)(n) = \sum_{d \mid n} (f*g)(d)\, h\!\left(\frac{n}{d}\right) = \sum_{d \mid n} \left(\sum_{e \mid d} f(e)\, g\!\left(\frac{d}{e}\right)\right) h\!\left(\frac{n}{d}\right)
$$

Thay $d = ef'$ và $d' = n/d$, gộp thành tổng ba chỉ số $ef'd' = n$:

$$
= \sum_{ef'd' = n} f(e)\, g(f')\, h(d')
$$

Biểu thức này hoàn toàn đối xứng trong $(g,h)$ và trong cách kết nhóm, chứng tỏ nó bằng $(f*(g*h))(n)$ bằng cách nhóm khác. $\blacksquare$

### Phần Tử Đơn Vị

> [!theorem] Theorem 21.5 — Phần tử đơn vị của tích chập
> Hàm $\varepsilon$ (hàm đơn vị Kronecker: $\varepsilon(1)=1$, $\varepsilon(n)=0$ với $n>1$) là phần tử đơn vị:
>
> $$
> f * \varepsilon = \varepsilon * f = f \quad \text{với mọi hàm số học } f
> $$

**Proof.**
$(f * \varepsilon)(n) = \sum_{d \mid n} f(d)\,\varepsilon(n/d) = f(n)\,\varepsilon(1) = f(n)$, vì $\varepsilon(n/d) = 0$ trừ khi $n/d = 1$, tức $d = n$. $\blacksquare$

### Phân Phối Qua Phép Cộng

> [!theorem] Theorem 21.6 — Tính phân phối
> Với mọi hàm số học $f, g, h$:
>
> $$
> f * (g + h) = (f * g) + (f * h)
> $$
>
> (phép cộng là pointwise: $(f+g)(n) = f(n) + g(n)$).

**Proof.**
$(f*(g+h))(n) = \sum_{d \mid n} f(d)(g+h)(n/d) = \sum_{d \mid n}f(d)g(n/d) + \sum_{d \mid n}f(d)h(n/d) = (f*g)(n) + (f*h)(n)$. $\blacksquare$

> [!abstract] Kết luận cấu trúc đại số
> Tập hàm số học $\mathcal{A} = \{f : \mathbb{Z}^+ \to \mathbb{C}\}$ với:
> - Phép cộng pointwise $(f+g)(n) = f(n)+g(n)$
> - Phép nhân = tích chập Dirichlet $f * g$
>
> tạo thành một **vành giao hoán** (commutative ring) với phần tử đơn vị $\varepsilon$. Vành này được gọi là **vành Dirichlet** (Dirichlet ring).

---

## Nghịch Đảo Dirichlet (Dirichlet Inverse)

> [!definition] Definition 21.7 — Nghịch Đảo Dirichlet
> Hàm $g$ là **nghịch đảo Dirichlet** của $f$ nếu $f * g = \varepsilon$.

> [!theorem] Theorem 21.8 — Sự tồn tại và duy nhất của nghịch đảo
> Hàm số học $f$ có nghịch đảo Dirichlet **khi và chỉ khi** $f(1) \neq 0$.
>
> Khi nghịch đảo tồn tại, nó **duy nhất** và được xác định đệ quy:
>
> $$
> g(1) = \frac{1}{f(1)}, \qquad g(n) = -\frac{1}{f(1)} \sum_{\substack{d \mid n \\ d < n}} f\!\left(\frac{n}{d}\right) g(d) \quad (n > 1)
> $$

**Proof.**
Tồn tại: Định nghĩa $g(n)$ đệ quy như trên. Kiểm tra $(f*g)(1) = f(1)g(1) = 1 = \varepsilon(1)$ ✓. Với $n > 1$:

$$
(f*g)(n) = f(1)g(n) + \sum_{\substack{d \mid n \\ d < n}} f\!\left(\frac{n}{d}\right) g(d) = f(1)g(n) + f(1)g(n)\cdot(-1) = 0 = \varepsilon(n) \checkmark
$$

(dùng định nghĩa $g(n)$ để thay). Điều kiện $f(1) \neq 0$ là cần thiết vì $f(1)g(1) = 1$ đòi hỏi $f(1)$ khả nghịch.

Duy nhất: Nếu $f*g_1 = f*g_2 = \varepsilon$, thì $g_1 = g_1 * \varepsilon = g_1*(f*g_2) = (g_1*f)*g_2 = \varepsilon*g_2 = g_2$. $\blacksquare$

> [!example] Example 21.9 — Tính nghịch đảo Dirichlet của $f = \mathbf{1}$
>
> $g(1) = 1/\mathbf{1}(1) = 1$.
>
> $g(2) = -\frac{1}{1}\cdot f(2)\cdot g(1) = -1$.
>
> $g(3) = -f(3)g(1) = -1$.
>
> $g(4) = -[f(4)g(1) + f(2)g(2)] = -[1\cdot 1 + 1\cdot(-1)] = 0$.
>
> $g(6) = -[f(6)g(1) + f(3)g(2) + f(2)g(3)] = -[1 - 1 - 1] = 1$.
>
> Đây chính xác là giá trị $\mu(n)$! Ta sẽ chứng minh điều này ngay dưới.

---

## Hàm Möbius là Nghịch Đảo của $\mathbf{1}$

> [!theorem] Theorem 21.10 — $\mu * \mathbf{1} = \varepsilon$
> Hàm Möbius $\mu$ là nghịch đảo Dirichlet của hàm hằng $\mathbf{1}$:
>
> $$
> \mu * \mathbf{1} = \varepsilon \iff \sum_{d \mid n} \mu(d) = \varepsilon(n) = \begin{cases} 1 & n=1 \\ 0 & n>1 \end{cases}
> $$

**Proof.**
Đây chính là Theorem 20.23 đã chứng minh ở bài 20. Đặt lại trong ngôn ngữ tích chập:

$$
(\mu * \mathbf{1})(n) = \sum_{d \mid n} \mu(d)\,\mathbf{1}\!\left(\frac{n}{d}\right) = \sum_{d \mid n} \mu(d) = \varepsilon(n) \qquad \blacksquare
$$

> [!note] Remark 21.11 — $\mu$ là đơn vị nghịch đảo của $\mathbf{1}$
> Điều này có nghĩa: trong vành Dirichlet, $\mathbf{1}^{-1} = \mu$. Sức mạnh của điều này sẽ thể hiện ở bài 22: nếu ta biết $F = f * \mathbf{1}$, ta có thể khôi phục $f = F * \mu$.

---

## Các Đẳng Thức Hàm Số Học Dưới Dạng Tích Chập

> [!theorem] Theorem 21.12 — Từ điển tích chập–hàm số học
> Các đẳng thức sau đúng với mọi $n \geq 1$:
>
> **(a)** $\tau = \mathbf{1} * \mathbf{1}$, tức $\tau(n) = \sum_{d \mid n} 1$
>
> **(b)** $\sigma = \operatorname{id} * \mathbf{1}$, tức $\sigma(n) = \sum_{d \mid n} d$
>
> **(c)** $\operatorname{id} = \varphi * \mathbf{1}$, tức $n = \sum_{d \mid n} \varphi(d)$
>
> **(d)** $\sigma_k = \operatorname{id}_k * \mathbf{1}$, tức $\sigma_k(n) = \sum_{d \mid n} d^k$
>
> **(e)** $\ln = \Lambda * \mathbf{1}$, tức $\ln n = \sum_{d \mid n} \Lambda(d)$

**Proof.**
Tất cả đều trực tiếp từ định nghĩa tích chập và các hệ thức đã chứng minh ở bài 20. Chẳng hạn (a): $(\mathbf{1}*\mathbf{1})(n) = \sum_{d \mid n} \mathbf{1}(d)\cdot\mathbf{1}(n/d) = \sum_{d \mid n} 1 = \tau(n)$. Các trường hợp khác tương tự. $\blacksquare$

> [!note] Remark 21.13 — Đọc bảng ngược lại bằng $\mu$
> Nhân cả hai vế của $(c)$ với $\mu$ (tức tích chập với $\mu$):
>
> $$
> \operatorname{id} * \mu = (\varphi * \mathbf{1}) * \mu = \varphi * (\mathbf{1} * \mu) = \varphi * \varepsilon = \varphi
> $$
>
> Suy ra: $\varphi(n) = \sum_{d \mid n} \frac{n}{d}\,\mu(d) = n \sum_{d \mid n} \frac{\mu(d)}{d}$.
>
> Đây là công thức tính $\varphi$ thuần túy qua $\mu$, không cần phân tích nguyên tố!

---

## Tích Chập Bảo Toàn Tính Nhân Tính

> [!theorem] Theorem 21.14 — Tích chập của hai hàm nhân tính là nhân tính
> Nếu $f$ và $g$ đều nhân tính thì $f * g$ cũng nhân tính.

**Proof.**
Lấy $\gcd(m, n) = 1$. Mỗi ước $d$ của $mn$ viết duy nhất thành $d = d_1 d_2$ với $d_1 \mid m$, $d_2 \mid n$, $\gcd(d_1, d_2) = 1$ (ánh xạ song ánh đã dùng ở Theorem 20.25).

$$
(f*g)(mn) = \sum_{d \mid mn} f(d)\,g\!\left(\frac{mn}{d}\right) = \sum_{d_1 \mid m}\sum_{d_2 \mid n} f(d_1 d_2)\, g\!\left(\frac{m}{d_1}\cdot\frac{n}{d_2}\right)
$$

Vì $\gcd(d_1,d_2)=1$ và $f$ nhân tính: $f(d_1 d_2) = f(d_1)f(d_2)$. Vì $\gcd(m/d_1, n/d_2) = 1$ và $g$ nhân tính: $g(m/d_1 \cdot n/d_2) = g(m/d_1)g(n/d_2)$.

$$
= \sum_{d_1 \mid m}\sum_{d_2 \mid n} f(d_1)f(d_2)\,g\!\left(\frac{m}{d_1}\right)g\!\left(\frac{n}{d_2}\right) = \left(\sum_{d_1 \mid m}f(d_1)g\!\left(\frac{m}{d_1}\right)\right)\!\left(\sum_{d_2 \mid n}f(d_2)g\!\left(\frac{n}{d_2}\right)\right)
$$

$$
= (f*g)(m)\cdot(f*g)(n) \qquad \blacksquare
$$

> [!corollary] Corollary 21.15 — Nghịch đảo Dirichlet của hàm nhân tính cũng nhân tính
> Nếu $f$ nhân tính thì nghịch đảo Dirichlet $f^{-1}$ của nó cũng nhân tính.

**Proof sketch.**
Vì $f * f^{-1} = \varepsilon$ và $\varepsilon$ nhân tính, $f$ nhân tính, áp dụng tính duy nhất của nghịch đảo và cấu trúc nhân tính ta suy ra $f^{-1}$ nhân tính. Chi tiết xem Apostol Ch. 2. $\blacksquare$

---

## Công Thức Tính $\varphi$ Bằng $\mu$

> [!theorem] Theorem 21.16 — Công thức $\varphi$ qua $\mu$
> Với mọi $n \geq 1$:
>
> $$
> \varphi(n) = \sum_{d \mid n} \mu(d)\,\frac{n}{d} = n \sum_{d \mid n} \frac{\mu(d)}{d}
> $$
>
> Suy ra công thức nhân tử (product formula):
>
> $$
> \varphi(n) = n \prod_{p \mid n} \left(1 - \frac{1}{p}\right)
> $$

**Proof.**
Ta đã thấy $\varphi = \operatorname{id} * \mu$ (từ Remark 21.13). Khai triển:

$$
\varphi(n) = (\operatorname{id} * \mu)(n) = \sum_{d \mid n} \operatorname{id}(d)\,\mu\!\left(\frac{n}{d}\right) = \sum_{d \mid n} d\,\mu\!\left(\frac{n}{d}\right)
$$

Thay $d \to n/d$: $\varphi(n) = \sum_{d \mid n} \frac{n}{d}\mu(d) = n\sum_{d \mid n}\frac{\mu(d)}{d}$.

Công thức nhân tử: vì $\mu(d) = 0$ khi $d$ không squarefree, tổng thực sự chỉ chạy trên ước squarefree của $n$. Khai triển theo nguyên tố:

$$
\sum_{d \mid n} \frac{\mu(d)}{d} = \prod_{p \mid n}\left(1 + \frac{\mu(p)}{p}\right) = \prod_{p \mid n}\left(1 - \frac{1}{p}\right)
$$

(dùng tính nhân tính và $\mu(p^k) = 0$ với $k \geq 2$). Nhân $n$ vào hai vế. $\blacksquare$

> [!example] Example 21.17 — Kiểm tra công thức
>
> $n = 12 = 2^2 \cdot 3$. Ước squarefree của $12$: $\{1, 2, 3, 6\}$.
>
> $$
> \varphi(12) = 12\left(\frac{\mu(1)}{1} + \frac{\mu(2)}{2} + \frac{\mu(3)}{3} + \frac{\mu(6)}{6}\right)
> = 12\left(1 - \frac{1}{2} - \frac{1}{3} + \frac{1}{6}\right) = 12 \cdot \frac{2}{6} = 4 \checkmark
> $$
>
> Bằng công thức nhân tử: $\varphi(12) = 12\left(1-\frac{1}{2}\right)\left(1-\frac{1}{3}\right) = 12 \cdot \frac{1}{2} \cdot \frac{2}{3} = 4$ ✓

---

## Các Nghịch Đảo Dirichlet Quan Trọng

> [!theorem] Theorem 21.18 — Bảng nghịch đảo Dirichlet
> Các cặp nghịch đảo Dirichlet quan trọng:
>
> | $f$ | $f^{-1} = f * \mu$ hoặc biểu thức |
> |-----|-----|
> | $\mathbf{1}$ | $\mu$ |
> | $\operatorname{id}$ | $\mu \cdot \operatorname{id}$ (hàm $n\mu(n)$) |
> | $\varphi$ | $\mathbf{1} * \mu^2$ (liên quan đến squarefree) |
> | $\operatorname{id}_k$ | $\mu \cdot \operatorname{id}_k$ |
> | $\tau$ | $\mathbf{1}*\mathbf{1}$, nghịch đảo là $\mathbf{1}*\mu = \varepsilon$... |

> [!example] Example 21.19 — Tính nghịch đảo của $\operatorname{id}$
>
> Ta có $\operatorname{id} * \mathbf{1} = \sigma$, nên $\sigma * \mu = \operatorname{id}$.
>
> Kiểm tra với $n = 6$: $\sigma(1)\mu(6) + \sigma(2)\mu(3) + \sigma(3)\mu(2) + \sigma(6)\mu(1)$
>
> $= 1\cdot 1 + 3\cdot(-1) + 4\cdot(-1) + 12\cdot 1 = 1-3-4+12 = 6 = \operatorname{id}(6)$ ✓

---

## Tích Chập Dirichlet Và Chuỗi Dirichlet

> [!note] Remark 21.20 — Kết nối với chuỗi Dirichlet (preview)
> Định nghĩa **chuỗi Dirichlet** của hàm số học $f$ là chuỗi hình thức:
>
> $$
> \mathcal{D}(f, s) = \sum_{n=1}^{\infty} \frac{f(n)}{n^s}
> $$
>
> Tính chất kỳ diệu: nhân hai chuỗi Dirichlet tương đương với tích chập Dirichlet của hệ số:
>
> $$
> \mathcal{D}(f, s) \cdot \mathcal{D}(g, s) = \mathcal{D}(f * g,\, s)
> $$
>
> Đặc biệt, hàm $\zeta$ Riemann là $\mathcal{D}(\mathbf{1}, s) = \sum_{n=1}^{\infty} n^{-s}$, và $\mathcal{D}(\mu, s) = 1/\zeta(s)$.
> Đây là ngọn nguồn của mối liên hệ giữa $\mu$, $\zeta$, và phân phối số nguyên tố.

---

## SageMath Cheatsheet

Tích chập Dirichlet bằng tay:

```sage
def dirichlet_conv(f, g, n):
    return sum(f(d) * g(n // d) for d in divisors(n))

tau = lambda n: sigma(n, 0)
one = lambda n: 1
idf = lambda n: n
mu = moebius

assert dirichlet_conv(one, one, 12) == tau(12)
assert dirichlet_conv(idf, one, 12) == sigma(12, 1)
assert dirichlet_conv(idf, mu, 12) == euler_phi(12)
print("Dirichlet convolution checks passed!")
```

Nghịch đảo Dirichlet đệ quy:

```sage
@cached_function
def dirichlet_inv(f, n):
    if n == 1:
        return QQ(1) / f(1)
    return -QQ(1)/f(1) * sum(f(n//d) * dirichlet_inv(f, d) for d in divisors(n) if d < n)

# Kiểm tra: nghịch đảo của 1 là mu
for n in range(1, 20):
    inv_one = dirichlet_inv(one, n)
    assert inv_one == moebius(n), f"n={n}: inv(1)={inv_one}, mu={moebius(n)}"
print("Inverse of 1 is mu: verified!")
```

Kiểm tra $\mu * \mathbf{1} = \varepsilon$:

```sage
for n in range(1, 20):
    result = sum(moebius(d) for d in divisors(n))
    expected = 1 if n == 1 else 0
    assert result == expected, f"Failed at n={n}"
print("mu * 1 = epsilon: verified!")
```

Kiểm tra tính nhân tính của tích chập:

```sage
m, n = 4, 9
assert gcd(m, n) == 1
c = lambda k: dirichlet_conv(one, mu, k)
assert c(m*n) == c(m) * c(n)
print("Convolution preserves multiplicativity: verified!")
```

---

## Summary / Key Takeaways

- **Tích chập Dirichlet**: $(f*g)(n) = \sum_{d \mid n} f(d)g(n/d)$ — một phép nhân trên tập hàm số học.
- Tích chập **giao hoán**, **kết hợp**, **phân phối** qua phép cộng, với phần tử đơn vị $\varepsilon$.
- Tập hàm số học cùng tích chập tạo thành **vành Dirichlet** (commutative ring).
- Mọi $f$ với $f(1) \neq 0$ đều có **nghịch đảo Dirichlet** duy nhất $f^{-1}$, tính đệ quy.
- $\mu$ là nghịch đảo Dirichlet của $\mathbf{1}$: $\mu * \mathbf{1} = \varepsilon$.
- **Từ điển**: $\tau = \mathbf{1}*\mathbf{1}$, $\sigma = \operatorname{id}*\mathbf{1}$, $\operatorname{id} = \varphi*\mathbf{1}$, $\varphi = \operatorname{id}*\mu$, $\ln = \Lambda*\mathbf{1}$.
- **Tích chập của hai hàm nhân tính là nhân tính** — điều này giải thích tại sao $\tau$, $\sigma$, $\sigma_k$ đều nhân tính.
- Nghịch đảo Dirichlet của hàm nhân tính cũng nhân tính.
- Bài tiếp theo (bài 22) sẽ khai thác $\mu * \mathbf{1} = \varepsilon$ để đảo công thức $F = f * \mathbf{1} \implies f = F * \mu$.

---

## References

- T. M. Apostol — *Introduction to Analytic Number Theory*, Ch. 2 (định nghĩa và chứng minh hoàn chỉnh)
- I. Niven, H. S. Zuckerman, H. L. Montgomery — *An Introduction to the Theory of Numbers*, 5th ed., §4.2
- K. Ireland, M. Rosen — *A Classical Introduction to Modern Number Theory*, Ch. 2
- T. Tao — *254A Notes 1: Elementary multiplicative number theory* (blog.terrytao.wordpress.com)
