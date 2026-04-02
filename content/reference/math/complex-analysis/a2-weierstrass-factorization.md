---
title: "A2. Weierstrass Factorization Theorem — Full Proof"
tags: [math, complex-analysis, appendix]
created: 2026-03-31
---

> Bài học liên quan: [[14-entire-meromorphic-functions|14. Entire and Meromorphic Functions]]

## Định lý (nhắc lại)

> [!abstract] Theorem A2.1 — Weierstrass Factorization Theorem
> Cho $f$ entire với $f \not\equiv 0$, bậc zero $m \geq 0$ tại $0$, và dãy zeros không triệt tiêu $\{a_n\}$ (lặp theo bội, $|a_1| \leq |a_2| \leq \cdots$, $|a_n| \to \infty$). Thì tồn tại hàm entire $g$ và dãy $\{p_n\} \subset \mathbb{N}_0$ sao cho:
>
> $$f(z) = z^m e^{g(z)} \prod_{n=1}^\infty E_{p_n}\!\left(\frac{z}{a_n}\right)$$
>
> với tích hội tụ đồng đều trên mọi compact.

---

## Chứng Minh

### Bước 1: Hội tụ của tích

**Bổ đề A2.2** (Estimate cho $E_p$): Với $|z| \leq 1$:

$$|E_p(z) - 1| \leq |z|^{p+1}$$

**Proof bổ đề.** $E_p(z) = (1-z)\exp\!\sum_{k=1}^p\frac{z^k}{k}$. Lấy $\ln$:

$$\ln E_p(z) = \ln(1-z) + \sum_{k=1}^p\frac{z^k}{k} = -\sum_{k=1}^\infty\frac{z^k}{k} + \sum_{k=1}^p\frac{z^k}{k} = -\sum_{k=p+1}^\infty\frac{z^k}{k}$$

Do đó $\ln E_p(z) = O(|z|^{p+1})$ với $|z| < 1$, suy ra $E_p(z) = e^{O(|z|^{p+1})} = 1 + O(|z|^{p+1})$, tức $|E_p(z)-1| \leq C|z|^{p+1}$. $\blacksquare$

**Chọn $p_n$:** Với mỗi $n$, chọn $p_n$ sao cho:

$$\sum_{n=1}^\infty \left(\frac{r}{|a_n|}\right)^{p_n+1} < \infty \quad \forall r > 0$$

Ví dụ, chọn $p_n = n-1$ (hoặc $p_n = \lfloor\rho\rfloor$ nếu biết bậc).

**Hội tụ tích:** Với $|z| \leq r < |a_N|$ (tất cả $n > N$):

$$\left|E_{p_n}\!\left(\frac{z}{a_n}\right) - 1\right| \leq \left|\frac{z}{a_n}\right|^{p_n+1} \leq \left(\frac{r}{|a_n|}\right)^{p_n+1}$$

Tiêu chuẩn Weierstrass M-test áp dụng được, vì $\sum (r/|a_n|)^{p_n+1} < \infty$. Vậy tích hội tụ đồng đều trên $|z| \leq r$. $\blacksquare$

### Bước 2: $P(z) = \prod E_{p_n}(z/a_n)$ là entire với đúng zeros $\{a_n\}$

$P$ holomorphic (hội tụ đồng đều trên compact). $P(z) = 0 \Leftrightarrow E_{p_n}(z/a_n) = 0$ với một $n$ nào đó $\Leftrightarrow z = a_n$. Bội số tại $a_n$ bằng bội số của $a_n$ trong dãy $\{a_n\}$. $\blacksquare$

### Bước 3: $g$ là entire

Đặt $h(z) = z^m P(z)$: entire với đúng zeros của $f$ (kể cả bội). Do $f$ và $h$ cùng zeros, $f/h$ là entire không triệt tiêu trên $\mathbb{C}$. Mặt phẳng $\mathbb{C}$ là đơn liên, nên $f/h = e^g$ với $g$ entire. $\blacksquare$

---

## Ví Dụ Chi Tiết: $\sin(\pi z)$

Zeros của $\sin(\pi z)$: tại $n \in \mathbb{Z}$. Zeros không triệt tiêu: $\pm 1, \pm 2, \ldots$ (mỗi cái bội $1$). Zero tại $0$: bậc $1$.

Chọn $p_n = 1$ cho mọi $n$ (vì $\sum 1/n^2 < \infty$):

$$E_1(z/n) = (1-z/n)e^{z/n}, \quad E_1(-z/n) = (1+z/n)e^{-z/n}$$

$$E_1(z/n)E_1(-z/n) = (1-z^2/n^2)e^0 = 1 - z^2/n^2$$

Do đó tích cặp:

$$\sin(\pi z) = z e^{g(z)}\prod_{n=1}^\infty\left(1-\frac{z^2}{n^2}\right)$$

Xác định $g$: dùng đạo hàm logarithm $\frac{d}{dz}\ln(\sin\pi z) = \pi\cot(\pi z)$ và so sánh với $g'(z) + \sum\frac{-2z/n^2}{1-z^2/n^2}$, thu được $g' \equiv 0$, tức $g$ hằng. Tại $z=0$: $\sin(\pi z)/(\pi z) \to 1$, và $\prod(1-z^2/n^2)\to 1$, nên $e^{g(0)} = \pi$, tức $g = \ln\pi$:

$$\sin(\pi z) = \pi z\prod_{n=1}^\infty\left(1-\frac{z^2}{n^2}\right) \quad \blacksquare$$

**Hệ quả:** So sánh hệ số $z^3$ trong khai triển Taylor của hai vế:

$$\text{VT}: \frac{(-1)^1(\pi z)^3}{3!} = -\frac{\pi^3}{6}z^3 + \cdots$$

$$\text{VP}: \pi z\left(1 - \sum_{n=1}^\infty\frac{1}{n^2}z^2 + \cdots\right) = \pi z - \pi\zeta(2)z^3 + \cdots$$

Đồng nhất: $\pi\zeta(2) = \frac{\pi^3}{6}$, suy ra $\zeta(2) = \frac{\pi^2}{6}$.

---

## Phiên Bản Cho Hàm Meromorphic

> [!abstract] Theorem A2.3 — Hàm meromorphic tùy ý
> Mọi hàm meromorphic $f$ trên $\mathbb{C}$ viết được dưới dạng $f = P/Q$ với $P, Q$ là hai hàm entire (Weierstrass).

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 5.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 5.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 15.
