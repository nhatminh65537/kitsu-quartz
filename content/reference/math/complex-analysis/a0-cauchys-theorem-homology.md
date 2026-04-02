---
title: "A0. Cauchy's Theorem — Homology Version"
tags: [math, complex-analysis, appendix]
created: 2026-03-31
---

> Bài học liên quan: [[06-complex-integration|06. Complex Integration]]

## Định Lý Cauchy — Dạng Tổng Quát (Homology Version)

Trong Bài 06 ta đã chứng minh Định lý Cauchy cho miền đơn liên. Dạng tổng quát nhất không cần đơn liên mà chỉ cần điều kiện topo trên contour: số cuộn bằng $0$ với mọi điểm kỳ dị.

---

## Định lý (Homology Version)

> [!abstract] Theorem A0.1 — Cauchy's Theorem (Homology Form)
> Cho $\Omega \subseteq \mathbb{C}$ mở, $f$ holomorphic trên $\Omega$, và $\gamma$ là contour đóng trong $\Omega$ thỏa:
>
> $$n(\gamma, z) = 0 \quad \forall z \in \mathbb{C} \setminus \Omega$$
>
> (tức là $\gamma$ "đồng điều bằng không" / homologous to zero trong $\Omega$). Thì:
>
> $$\int_\gamma f(z)\,dz = 0$$

**Proof.** Định nghĩa hàm:

$$g(z, w) = \begin{cases} \dfrac{f(z) - f(w)}{z - w} & z \neq w \\ f'(w) & z = w \end{cases}$$

$g$ liên tục trên $\Omega \times \Omega$ và holomorphic theo từng biến. Xét $h(w) = \int_\gamma g(z,w)\,dz$. Thì $h$ holomorphic trên $\Omega$ (vi phân dưới dấu tích phân).

Ta có: $\int_\gamma f(z)\,dz = \int_\gamma (z-w)g(z,w)\,dz + f(w)\int_\gamma dz = \int_\gamma (z-w)g(z,w)\,dz$ (vì $\int_\gamma dz = 0$ với contour đóng).

Do đó $h(w) = \int_\gamma \frac{f(z)}{z-w}\,dz - f(w)\int_\gamma\frac{dz}{z-w} = \int_\gamma\frac{f(z)}{z-w}\,dz - 2\pi i\, n(\gamma,w)\,f(w)$.

Với $w \in \mathbb{C} \setminus \Omega$: $n(\gamma, w) = 0$ theo giả thuyết. Hơn nữa, $f$ không được định nghĩa ngoài $\Omega$ nhưng $w \mapsto \int_\gamma\frac{f(z)}{z-w}\,dz$ holomorphic với $w \notin \gamma$. Khi $|w| \to \infty$: $h(w) \to 0$.

Bởi nguyên lý cực đại, $|h|$ đạt max trên biên $\mathbb{C} \setminus \Omega$. Nhưng $h \to 0$ tại vô cực, nên $h \equiv 0$ trên $\mathbb{C} \setminus \Omega$ (và trên $\Omega$ bởi tiếp tục giải tích).

Cuối cùng: $\int_\gamma f(z)\,dz = \int_\gamma (z-w)g(z,w)\,dz\,|_{w\text{ bất kỳ}} = h(w) \cdot (\text{tích phân biên trái}) = 0$. $\blacksquare$

---

## Hệ Quả Tổng Quát

> [!abstract] Corollary A0.2 — Công thức Tích phân Cauchy Tổng quát
> Trong cùng điều kiện, với $a \in \Omega$, $a \notin \gamma$:
>
> $$\frac{1}{2\pi i}\int_\gamma \frac{f(z)}{z-a}\,dz = n(\gamma, a)\,f(a)$$

> [!abstract] Corollary A0.3 — Định lý Thặng dư Tổng quát
> Nếu $f$ meromorphic trên $\Omega$ với cực $z_1, \ldots, z_n$ và $\gamma$ không đi qua $z_k$, đồng điều bằng $0$ trong $\Omega \setminus \{z_1,\ldots,z_n\}$:
>
> $$\int_\gamma f(z)\,dz = 2\pi i\sum_{k=1}^n n(\gamma, z_k)\operatorname{Res}(f, z_k)$$

---

## So Sánh Với Dạng Đơn Giản

| Dạng | Giả thiết | Phát biểu |
|------|----------|-----------|
| Goursat (Bài 06) | $f$ holo trên tam giác | $\int_{\partial T} f = 0$ |
| Cauchy — đơn liên (Bài 06) | $\Omega$ đơn liên, $f$ holo | $\int_\gamma f = 0$ |
| **Cauchy — Homology** | $n(\gamma, z) = 0$ ngoài $\Omega$ | $\int_\gamma f = 0$ |

Dạng homology là mạnh nhất và bao hàm các dạng trên. Đơn liên $\Rightarrow$ mọi contour đóng có số cuộn $0$ với điểm ngoài $\Rightarrow$ điều kiện homology thỏa.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 4.
- Rudin, W. *Real and Complex Analysis* (3rd ed.), Chapter 10.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 4, §7.
