---
title: "13. Analytic Continuation and Monodromy"
tags: [math, complex-analysis, lesson-13]
aliases: [Analytic Continuation and Monodromy]
created: 2026-03-31
---

> **Prerequisites**: [[05-power-series|05. Power Series]], [[12-riemann-mapping-theorem|12. Riemann Mapping Theorem]]
> **Objectives**:
> - Hiểu khái niệm tiếp tục giải tích (analytic continuation) và mầm hàm (germ)
> - Nắm Định lý Đơn cấu (Monodromy Theorem)
> - Hiểu tại sao $\log z$ và $z^{1/2}$ là hàm đa trị qua lăng kính tiếp tục giải tích
> - Làm quen với mặt Riemann (Riemann surface) như cách giải thích hàm đa trị

---

## Motivation / Intuition

Tại sao $\log z$ là hàm "đa trị"? Nếu ta bắt đầu từ $z = 1$ với $\log 1 = 0$, rồi tiếp tục $\log$ dọc một đường cong vòng quanh gốc tọa độ và quay về $z = 1$, ta thu được $\log 1 = 2\pi i$ — không phải $0$ ban đầu!

Hiện tượng này gọi là **tiếp tục giải tích**: mở rộng hàm holomorphic từ một miền nhỏ sang miền lớn hơn, nhưng kết quả phụ thuộc vào **đường đi**. Định lý Đơn cấu phát biểu khi nào sự phụ thuộc này biến mất (trong miền đơn liên).

---

## Tiếp Tục Giải Tích (Analytic Continuation)

### Definition

> [!info] Definition 13.1 — Mầm hàm (Germ)
> **Mầm** (germ) của hàm holomorphic tại $z_0$ là lớp tương đương của các cặp $(f, D(z_0, r))$ với $r > 0$ và $f$ holomorphic trên $D(z_0, r)$, trong đó $(f_1, D_1) \sim (f_2, D_2)$ nếu $f_1 = f_2$ trên $D_1 \cap D_2$ (gần $z_0$).

> [!info] Definition 13.2 — Tiếp tục giải tích dọc đường cong
> Cho $f_0$ holomorphic trên $D(z_0, r_0)$ và $\gamma: [0,1] \to \mathbb{C}$ đường cong từ $z_0$ đến $z_1$. **Tiếp tục giải tích của $f_0$ dọc $\gamma$** là một họ $(f_t, D(\gamma(t), r_t))_{t \in [0,1]}$ sao cho:
> - $f_0 = $ hàm cho trước tại $t=0$
> - Với mọi $t$: $f_t$ holomorphic trên $D(\gamma(t), r_t)$
> - Với $|s - t|$ đủ nhỏ: $f_s = f_t$ trên $D(\gamma(s), r_s) \cap D(\gamma(t), r_t)$

> [!abstract] Theorem 13.3 — Duy nhất tiếp tục giải tích dọc đường cong
> Nếu tiếp tục giải tích của $f_0$ dọc $\gamma$ tồn tại, thì **duy nhất** (tại mỗi điểm trên $\gamma$).

**Proof.** Giả sử $(f_t)$ và $(g_t)$ đều là tiếp tục. Tập $\{t: f_t = g_t \text{ gần } \gamma(t)\}$ vừa mở (theo định nghĩa) vừa đóng (vì tại giới hạn, Identity Theorem áp dụng). Liên thông của $[0,1]$ cho kết quả. $\blacksquare$

---

## Định Lý Đơn Cấu (Monodromy Theorem)

> [!abstract] Theorem 13.4 — Định lý Đơn cấu (Monodromy Theorem)
> Cho $\Omega$ đơn liên, $z_0 \in \Omega$, và $f_0$ holomorphic trên lân cận $z_0$. Nếu $f_0$ có thể tiếp tục giải tích dọc **mọi** đường cong trong $\Omega$ bắt đầu tại $z_0$, thì kết quả tiếp tục **không phụ thuộc** vào đường cong — và $f_0$ mở rộng thành hàm holomorphic trên toàn $\Omega$.

**Proof (phác thảo).** Cho hai đường cong $\gamma_0, \gamma_1$ từ $z_0$ đến $z_1$ trong $\Omega$. Vì $\Omega$ đơn liên, $\gamma_0$ và $\gamma_1$ đồng luân (homotopic) trong $\Omega$ với đầu cuối cố định — tức tồn tại biến dạng liên tục $\gamma_s$ từ $\gamma_0$ đến $\gamma_1$. Kết quả tiếp tục tại $z_1$ theo $\gamma_s$ là hàm liên tục theo $s$ và nhận giá trị rời rạc (mầm tại $z_1$), nên hằng số. $\blacksquare$

> [!example] Example 13.5 — $\log z$ không mở rộng trên $\mathbb{C} \setminus \{0\}$
> $\mathbb{C} \setminus \{0\}$ **không** đơn liên. Bắt đầu từ $z_0 = 1$ với $\log(1) = 0$:
>
> - Theo đường cong $\gamma_0$ (nửa vòng tròn trên): kết quả tại $z = 1$ sau một vòng đầy đủ là $2\pi i$.
> - Theo đường thẳng không vòng quanh $0$: kết quả là $0$.
>
> Vì $\mathbb{C}\setminus\{0\}$ không đơn liên, Định lý Đơn cấu không áp dụng, và kết quả phụ thuộc vào đường đi.

> [!example] Example 13.6 — $\sqrt{z}$ không đơn trị trên $\mathbb{C}\setminus\{0\}$
> Bắt đầu $\sqrt{1} = 1$ tại $z = 1$. Tiếp tục $\sqrt{z}$ theo đường tròn $e^{it}$, $t\in[0, 2\pi]$:
>
> Tại $t = 2\pi$: $\sqrt{e^{2\pi i}} = e^{i\pi} = -1 \neq 1$.
>
> Đây là **tính đơn cấu** (monodromy) của $\sqrt{z}$: sau một vòng, ta chuyển sang nhánh kia.

---

## Tiếp Tục Giải Tích và Hàm Đa Trị

### Ví dụ: Tiếp tục $\log z$ qua $\mathbb{C} \setminus (-\infty, 0]$

> [!example] Example 13.7 — Chuỗi Taylor của $\log$ tiếp tục ra ngoài đĩa hội tụ
> Khai triển Taylor của $\operatorname{Log}$ tại $z_0 = 1$:
>
> $$\operatorname{Log}(z) = (z-1) - \frac{(z-1)^2}{2} + \frac{(z-1)^3}{3} - \cdots = \sum_{n=1}^\infty \frac{(-1)^{n-1}}{n}(z-1)^n$$
>
> Chuỗi này hội tụ trong $D(1, 1)$ (bán kính hội tụ $= 1$, do đỉnh gần nhất $z = 0$). Nhưng có thể tiếp tục sang $D(2, 2)$, rồi $D(2i, 2)$, v.v. — mỗi bước cho một chuỗi Taylor mới tại tâm mới, và tất cả khớp nhau trên phần giao.

> [!example] Example 13.8 — Tiếp tục qua biên tự nhiên
> Chuỗi $f(z) = \sum_{n=0}^\infty z^{n!}$ hội tụ trong $D(0,1)$ nhưng **không thể tiếp tục** qua bất kỳ điểm nào trên $\partial D(0,1)$: toàn bộ đường tròn là **biên tự nhiên** (natural boundary). Đây là ví dụ một hàm holomorphic không thể mở rộng.

---

## Mặt Riemann (Riemann Surface) — Giới thiệu

> [!info] Definition 13.9 — Mặt Riemann của hàm đa trị
> **Mặt Riemann** là không gian tô pô mà trên đó hàm "đa trị" trở thành đơn trị.
>
> Ví dụ: mặt Riemann của $\sqrt{z}$ có 2 tờ (sheets); của $\log z$ có vô hạn tờ. Tờ được dán với nhau dọc các **vết cắt nhánh** (branch cuts).

> [!example] Example 13.10 — Mặt Riemann của $\sqrt{z}$
> Lấy hai bản sao của $\mathbb{C} \setminus [0, \infty)$, dán chúng lại dọc tia $[0, \infty)$:
> - Mép trên của tờ 1 dán với mép dưới của tờ 2
> - Mép dưới của tờ 1 dán với mép trên của tờ 2
>
> Kết quả là mặt Riemann $\mathcal{R}$, trên đó $\sqrt{z}$ là hàm đơn trị và holomorphic. Chiếu $\mathcal{R} \to \mathbb{C}$ là phủ 2:1.

> [!example] Example 13.11 — Mặt Riemann của $\log z$
> Mặt Riemann của $\log z$ có **vô hạn tờ**: $\mathbb{C} \setminus \{0\}$ phủ vô hạn lần, mỗi lần vòng quanh $0$ chuyển sang tờ tiếp theo. Phủ vạn năng (universal cover) của $\mathbb{C} \setminus \{0\}$ là $\mathbb{C}$ (qua $e^w$).

---

## Tính Đơn Cấu (Monodromy Action)

> [!info] Definition 13.12 — Biểu diễn đơn cấu
> Cho $f_0$ tiếp tục giải tích được trên $\Omega$ với điểm cơ sở $z_0$. Với mỗi đường cong đóng $\gamma$ tại $z_0$, kết quả tiếp tục theo $\gamma$ cho một mầm mới tại $z_0$. Ánh xạ:
>
> $$\rho: \pi_1(\Omega, z_0) \to \{\text{mầm tại } z_0\}$$
>
> gọi là **biểu diễn đơn cấu** (monodromy representation).

> [!example] Example 13.13 — Đơn cấu của $\log z$ trên $\mathbb{C}\setminus\{0\}$
> $\pi_1(\mathbb{C}\setminus\{0\}, 1) \cong \mathbb{Z}$ (sinh bởi vòng $\gamma$ quanh $0$).
>
> Đơn cấu: $\rho(\gamma^n)(\log) = \log + 2\pi i n$.
>
> Tức là sau $n$ vòng quanh $0$, hàm $\log$ thay đổi $2\pi i n$.

> [!example] Example 13.14 — Đơn cấu của $z^{1/n}$
> $\pi_1(\mathbb{C}\setminus\{0\}) \cong \mathbb{Z}$, generator $\gamma$.
>
> $\rho(\gamma)(z^{1/n}) = e^{2\pi i/n} \cdot z^{1/n}$.
>
> Sau $n$ vòng: $\rho(\gamma^n) = \text{id}$, phù hợp với $z^{1/n}$ có $n$ nhánh.

---

## SageMath Cheatsheet

```python
# Minh họa tiếp tục giải tích của log dọc đường tròn
import numpy as np
import matplotlib.pyplot as plt

def log_continuation(z_path):
    """
    Tiếp tục giải tích log dọc đường cong z_path.
    Bắt đầu từ log(z_path[0]) (nhánh chính).
    """
    log_vals = [np.log(z_path[0])]  # log phức (nhánh chính ban đầu)
    for k in range(1, len(z_path)):
        # Tính log liên tục: điều chỉnh để đạo hàm khớp
        dz = z_path[k] - z_path[k-1]
        dlog = dz / z_path[k-1]   # xấp xỉ: d(log z) = dz/z
        log_vals.append(log_vals[-1] + dlog)
    return np.array(log_vals)

# Đường vòng quanh 0 một lần
t = np.linspace(0, 2*np.pi, 1000)
gamma = np.exp(1j * t)  # |z| = 1

log_along_gamma = log_continuation(gamma)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(gamma.real, gamma.imag, 'b-')
axes[0].set_title('Đường $\\gamma(t) = e^{it}$ trong mặt phẳng $z$')
axes[0].set_aspect('equal')

axes[1].plot(log_along_gamma.real, log_along_gamma.imag, 'r-')
axes[1].plot(log_along_gamma[0].real, log_along_gamma[0].imag, 'go', ms=8, label='Bắt đầu: 0')
axes[1].plot(log_along_gamma[-1].real, log_along_gamma[-1].imag, 'rs', ms=8, label=f'Kết thúc: {log_along_gamma[-1]:.3f}')
axes[1].set_title('$\\log(\\gamma(t))$ — tiếp tục giải tích')
axes[1].legend()

print(f"log(1) ban đầu: {log_along_gamma[0]}")
print(f"log(1) sau 1 vòng: {log_along_gamma[-1]:.4f}")
print(f"Khác nhau: {log_along_gamma[-1] - log_along_gamma[0]:.4f} ≈ 2πi = {2j*np.pi:.4f}")

# Hai vòng quanh 0
t2 = np.linspace(0, 4*np.pi, 2000)
gamma2 = np.exp(1j*t2)
log2 = log_continuation(gamma2)
print(f"\nSau 2 vòng: {log2[-1]:.4f} ≈ 4πi = {4j*np.pi:.4f}")

plt.tight_layout()
plt.show()

# Mặt Riemann của sqrt(z) — minh họa
# Trên tờ 1: sqrt(|z|) * exp(i*arg(z)/2) với arg in [0, 2pi)
# Trên tờ 2: -1 * nhánh trên
z_test = -1 + 0j  # điểm trên tia âm thực (branch cut)
branch1 = np.sqrt(abs(z_test)) * np.exp(1j * np.angle(z_test) / 2)
branch2 = -branch1
print(f"\nHai nhánh của sqrt(-1): {branch1:.4f} và {branch2:.4f}")
```

---

## Summary / Key Takeaways

- **Mầm** (germ): lớp tương đương của hàm holomorphic trên lân cận nhỏ; là đối tượng cục bộ.
- **Tiếp tục giải tích** dọc đường cong: nếu tồn tại thì duy nhất (Identity Theorem cục bộ).
- **Định lý Đơn cấu**: trên miền đơn liên, kết quả tiếp tục không phụ thuộc đường cong → hàm đơn trị.
- **Đơn cấu** của $\log z$ trên $\mathbb{C}\setminus\{0\}$: vòng một lần quanh $0$ thay đổi $\log$ thêm $2\pi i$.
- **Đơn cấu** của $z^{1/n}$: sau $n$ vòng quay về nhánh ban đầu (nhóm $\mathbb{Z}/n\mathbb{Z}$).
- **Mặt Riemann**: không gian đa tờ trên đó hàm "đa trị" trở thành đơn trị.
- **Biên tự nhiên**: một số hàm không thể tiếp tục qua biên đĩa hội tụ (ví dụ $\sum z^{n!}$).

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 8.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 8.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 9.
- Forster, O. *Lectures on Riemann Surfaces* (Springer GTM 81), Chapter 1.
