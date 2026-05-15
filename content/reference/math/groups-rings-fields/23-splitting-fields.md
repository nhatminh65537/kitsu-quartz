---
title: "23. Splitting Fields"
type: math-component
tags: [math, groups-rings-fields, field-theory, lesson-23]
aliases: [Splitting Fields, Kronecker's Theorem]
created: 2026-05-15
---

> **Prerequisites**: [[22-algebraic-elements-and-minimal-polynomials|22. Algebraic Elements and Minimal Polynomials]], [[19-polynomial-rings|19. Polynomial Rings]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $F[x]$ | Vành đa thức một biến trên trường $F$ |
> | $F(\alpha)$ | Mở rộng đơn của $F$ sinh bởi $\alpha$ |
> | $[K:F]$ | Bậc của mở rộng trường $K/F$ |
> | $\deg f$ | Bậc của đa thức $f$ |
> | $\langle p(x) \rangle$ | Ideal chính sinh bởi $p(x)$ trong $F[x]$ |
> | $\overline{F}$ | Bao đóng đại số của $F$ |
> | $F^*$ | Nhóm nhân của trường $F$: $F \setminus \{0\}$ |

> **Objectives**:
> - Định nghĩa và xây dựng trường phân rã (splitting field) của một đa thức
> - Chứng minh sự tồn tại (Định lý Kronecker) và tính duy nhất tính đến đẳng cấu
> - Tính bậc của các trường phân rã thông qua Tower Law
> - Giới thiệu bao đóng đại số (algebraic closure)

---

## Motivation

Giả sử ta muốn giải hoàn toàn phương trình $x^4 - 2 = 0$ trong một trường nào đó. Bốn nghiệm là $\pm\sqrt[4]{2}$ và $\pm i\sqrt[4]{2}$. Trường nhỏ nhất chứa $\mathbb{Q}$ và tất cả bốn nghiệm này là gì? Đó là $\mathbb{Q}(\sqrt[4]{2}, i)$, và ta có thể tính được $[\mathbb{Q}(\sqrt[4]{2}, i) : \mathbb{Q}] = 8$.

Khái niệm **trường phân rã** (splitting field) hình thức hóa ý tưởng: trường nhỏ nhất mà trong đó một đa thức cho trước phân tích thành tích các nhân tử bậc nhất (tức có đủ nghiệm). Đây là bước nền tảng cho lý thuyết Galois — nghiên cứu đối xứng của nghiệm phương trình.

---

## 1. Trường phân rã (Splitting Field)

> [!definition] Definition 23.1 — Trường phân rã (Splitting Field)
> Cho $f(x) \in F[x]$ với $\deg f \geq 1$. Một **trường phân rã** của $f$ trên $F$ là một mở rộng $K/F$ thỏa mãn:
>
> 1. $f$ **phân rã hoàn toàn** (splits completely) trong $K[x]$: tồn tại $c \in F^*$ và $\alpha_1, \ldots, \alpha_n \in K$ sao cho
>
> $$
> f(x) = c \cdot (x - \alpha_1)(x - \alpha_2) \cdots (x - \alpha_n)
> $$
>
> 2. $K$ là trường nhỏ nhất có tính chất đó: $K = F(\alpha_1, \alpha_2, \ldots, \alpha_n)$.

> [!note] Remark 23.2 — Điều kiện tối thiểu
> Điều kiện (2) có thể viết lại: không có trường con trung gian $F \subseteq L \subsetneq K$ nào mà $f$ vẫn phân rã hoàn toàn trong $L$. Nói cách khác, các nghiệm $\alpha_i$ sinh ra toàn bộ $K$ trên $F$.

> [!example] Example 23.3 — Ví dụ trường phân rã cơ bản
>
> **(a) $f(x) = x^2 - 2$ trên $\mathbb{Q}$:**
> Hai nghiệm $\pm\sqrt{2}$. Trường phân rã là $\mathbb{Q}(\sqrt{2}, -\sqrt{2}) = \mathbb{Q}(\sqrt{2})$. Bậc: $[\mathbb{Q}(\sqrt{2}):\mathbb{Q}] = 2$.
>
> **(b) $f(x) = x^2 + 1$ trên $\mathbb{Q}$:**
> Hai nghiệm $\pm i$. Trường phân rã là $\mathbb{Q}(i)$. Bậc: $[\mathbb{Q}(i) : \mathbb{Q}] = 2$.
>
> **(c) $f(x) = x^3 - 2$ trên $\mathbb{Q}$:**
> Ba nghiệm $\sqrt[3]{2}$, $\omega \sqrt[3]{2}$, $\omega^2\sqrt[3]{2}$ với $\omega = e^{2\pi i/3}$ (căn đơn vị bậc 3 nguyên thủy). Trường phân rã là $K = \mathbb{Q}(\sqrt[3]{2}, \omega)$.
> Tính bậc qua Tower Law:
>
> $$
> \mathbb{Q} \subseteq \mathbb{Q}(\sqrt[3]{2}) \subseteq \mathbb{Q}(\sqrt[3]{2}, \omega)
> $$
>
> - $[\mathbb{Q}(\sqrt[3]{2}) : \mathbb{Q}] = 3$ (min poly $x^3-2$).
> - $\omega$ thỏa $x^2 + x + 1$ (min poly của $\omega$ trên $\mathbb{Q}$, nhân tử của $x^3-1$). Cần kiểm tra $\omega \notin \mathbb{Q}(\sqrt[3]{2}) \subset \mathbb{R}$: đúng vì $\omega$ không thực. Vậy $[\mathbb{Q}(\sqrt[3]{2}, \omega) : \mathbb{Q}(\sqrt[3]{2})] = 2$.
> - Tổng: $[K:\mathbb{Q}] = 3 \cdot 2 = 6$.
>
> **(d) $f(x) = x^4 - 2$ trên $\mathbb{Q}$:**
> Bốn nghiệm $\pm\sqrt[4]{2}$, $\pm i\sqrt[4]{2}$. Trường phân rã là $K = \mathbb{Q}(\sqrt[4]{2}, i)$.
>
> $$
> \mathbb{Q} \subseteq \mathbb{Q}(\sqrt[4]{2}) \subseteq \mathbb{Q}(\sqrt[4]{2}, i)
> $$
>
> - $[\mathbb{Q}(\sqrt[4]{2}):\mathbb{Q}] = 4$ (min poly $x^4-2$, Eisenstein $p=2$).
> - $i \notin \mathbb{Q}(\sqrt[4]{2}) \subset \mathbb{R}$, và min poly của $i$ trên $\mathbb{Q}(\sqrt[4]{2})$ là $x^2+1$. Vậy bậc thêm là $2$.
> - Tổng: $[K:\mathbb{Q}] = 4 \cdot 2 = 8$.

---

## 2. Sự tồn tại: Định lý Kronecker

> [!abstract] Theorem 23.4 — Định lý Kronecker (Tồn tại trường phân rã)
> Với mọi đa thức $f(x) \in F[x]$ với $\deg f \geq 1$, tồn tại một trường phân rã của $f$ trên $F$.

**Proof.** Bằng quy nạp trên $\deg f = n$.

*Cơ sở $n = 1$:* $f(x) = ax + b$ có nghiệm $-b/a \in F$, nên $F$ chính là trường phân rã.

*Bước quy nạp:* Giả sử kết quả đúng cho mọi đa thức bậc $< n$. Lấy $p(x) \in F[x]$ là một nhân tử bất khả quy của $f$. Xây dựng $K_1 = F[x]/\langle p(x) \rangle$, đây là trường chứa $F$ và phần tử $\alpha = \bar{x}$ với $p(\alpha) = 0$. Vì $p \mid f$, ta có $f(\alpha) = 0$, nên $(x - \alpha) \mid f(x)$ trong $K_1[x]$:

$$
f(x) = (x - \alpha) \cdot g(x), \quad g(x) \in K_1[x], \quad \deg g = n-1
$$

Theo giả thiết quy nạp, $g$ có trường phân rã $K/K_1$ với $g(x) = c(x-\alpha_2)\cdots(x-\alpha_n)$ trong $K[x]$. Vậy trong $K$:

$$
f(x) = c(x-\alpha)(x-\alpha_2)\cdots(x-\alpha_n)
$$

và $K = K_1(\alpha_2, \ldots, \alpha_n) = F(\alpha, \alpha_2, \ldots, \alpha_n)$ là trường phân rã của $f$ trên $F$. $\blacksquare$

---

## 3. Tính duy nhất (Uniqueness up to Isomorphism)

> [!abstract] Theorem 23.5 — Tính duy nhất của trường phân rã
> Cho $f(x) \in F[x]$. Bất kỳ hai trường phân rã $K$ và $K'$ của $f$ trên $F$ đều đẳng cấu với nhau thông qua một đẳng cấu cố định $F$ (tức đẳng cấu trường giữ nguyên mọi phần tử của $F$).

**Proof (phác thảo).** Chứng minh bằng quy nạp mạnh trên $\deg f$. Trường hợp cơ bản: $f$ bất khả quy. Cả $K$ và $K'$ chứa nghiệm $\alpha, \alpha'$ của $f$, và $F(\alpha) \cong F[x]/\langle f \rangle \cong F(\alpha')$ thông qua đẳng cấu $\sigma : \alpha \mapsto \alpha'$ cố định $F$. Rồi tiếp tục quy nạp cho nhân tố còn lại $f/(x-\alpha)$ trên trường trung gian. Chi tiết đầy đủ xem Dummit & Foote, §13.4. $\blacksquare$

> [!note] Remark 23.6 — Ký hiệu
> Vì trường phân rã duy nhất tính đến đẳng cấu, ta thường nói "**the** splitting field" và ký hiệu là $\operatorname{SF}(f, F)$.

---

## 4. Bao đóng đại số (Algebraic Closure)

> [!definition] Definition 23.7 — Bao đóng đại số (Algebraic Closure)
> Một trường $\bar{F}$ gọi là **bao đóng đại số** (algebraic closure) của $F$ nếu:
>
> 1. $\bar{F}/F$ là mở rộng đại số.
> 2. $\bar{F}$ **đóng đại số** (algebraically closed): mọi đa thức không hằng trong $\bar{F}[x]$ đều có nghiệm trong $\bar{F}$.

> [!abstract] Theorem 23.8 — Tồn tại và duy nhất của bao đóng đại số (Steinitz)
> Mọi trường $F$ đều có một bao đóng đại số $\bar{F}$, duy nhất tính đến $F$-đẳng cấu.

**Proof (ý tưởng).** Dùng bổ đề Zorn để xây dựng mở rộng đại số tối đại của $F$. Tính duy nhất tương tự như trường phân rã. $\blacksquare$

> [!example] Example 23.9 — Các bao đóng đại số quen thuộc
> - $\overline{\mathbb{R}} = \mathbb{C}$ (Định lý cơ bản của đại số).
> - $\overline{\mathbb{Q}} = \{\alpha \in \mathbb{C} \mid \alpha \text{ đại số trên } \mathbb{Q}\}$ — trường số đại số.
> - $\overline{\mathbb{F}_p}$ là trường hữu hạn "vô hạn": $\overline{\mathbb{F}_p} = \bigcup_{n \geq 1} \mathbb{F}_{p^n}$.

---

## 5. Bậc của trường phân rã

> [!abstract] Theorem 23.10 — Bậc của trường phân rã
> Nếu $f(x) \in F[x]$ có bậc $n$, thì trường phân rã $K$ của $f$ trên $F$ thỏa mãn:
>
> $$
> [K : F] \leq n!
> $$

**Proof.** Mỗi lần thêm một nghiệm $\alpha_i$, bậc thêm vào là $[F(\alpha_1, \ldots, \alpha_i) : F(\alpha_1, \ldots, \alpha_{i-1})] \leq \deg m_{\alpha_i} \leq n - (i-1)$ vì mỗi $\alpha_j$ trước đó là một nghiệm đã biết của $f$. Nhân tất cả lại: $[K:F] \leq n \cdot (n-1) \cdots 1 = n!$. $\blacksquare$

> [!example] Example 23.11 — Tổng hợp: Trường phân rã của $x^4 - x^2 - 2$ trên $\mathbb{Q}$
> Phân tích: $x^4 - x^2 - 2 = (x^2 - 2)(x^2 + 1)$.
>
> Nghiệm: $\pm\sqrt{2}$ (từ $x^2-2$) và $\pm i$ (từ $x^2+1$).
>
> Trường phân rã: $K = \mathbb{Q}(\sqrt{2}, i)$.
>
> Tower: $\mathbb{Q} \subseteq \mathbb{Q}(\sqrt{2}) \subseteq \mathbb{Q}(\sqrt{2}, i)$.
> - $[\mathbb{Q}(\sqrt{2}):\mathbb{Q}] = 2$.
> - $i \notin \mathbb{Q}(\sqrt{2})$ (vì $\mathbb{Q}(\sqrt{2}) \subset \mathbb{R}$), $[\mathbb{Q}(\sqrt{2},i):\mathbb{Q}(\sqrt{2})] = 2$.
>
> $[K:\mathbb{Q}] = 4 \leq 4! = 24$. Cơ sở của $K$ trên $\mathbb{Q}$: $\{1, \sqrt{2}, i, i\sqrt{2}\}$.

---

## SageMath Cheatsheet — Bài 23

```sage
# Trường phân rã trong SageMath

R.<x> = QQ[]

# Trường phân rã của x^3 - 2 (dùng splitting_field trên đa thức)
f = x^3 - 2
L = f.splitting_field(names='a')
L.degree()                   # = 6 = [Q(cbrt(2),omega):Q]

# Trường phân rã của x^4 - 2
g = x^4 - 2
M = g.splitting_field(names='b')
M.degree()                   # = 8

# Làm việc với QQbar (bao đóng đại số của Q)
QQbar
sqrt2 = QQbar(2).sqrt()
sqrt2.minpoly()              # x^2 - 2

# Kiểm tra tất cả nghiệm trong trường phân rã
f = x^3 - 2
K = f.splitting_field(names='a')
f.change_ring(K).factor()    # (x - a0) * (x - a1) * (x - a2)
```

---

## Summary — Bài 23

- **Trường phân rã** của $f$ trên $F$: mở rộng nhỏ nhất của $F$ mà $f$ phân tích hoàn toàn thành nhân tử bậc nhất.
- **Tồn tại** (Kronecker): quy nạp xây dựng được trường phân rã cho bất kỳ $f \in F[x]$.
- **Duy nhất** tính đến $F$-đẳng cấu.
- Bậc $[K:F] \leq n!$ với $n = \deg f$.
- **Bao đóng đại số** $\bar{F}$: mở rộng đại số tối đại, tồn tại và duy nhất; $\overline{\mathbb{R}} = \mathbb{C}$, $\overline{\mathbb{F}_p} = \bigcup_{n\geq 1} \mathbb{F}_{p^n}$.

---

## References — Bài 23

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), §13.4.
- Lang, S. *Algebra* (3rd ed.), Chapter V §2–3.
- Hungerford, T. W. *Algebra*, Chapter V §3.
