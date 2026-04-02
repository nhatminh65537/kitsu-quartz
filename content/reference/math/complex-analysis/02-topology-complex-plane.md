---
title: "02. Topology of the Complex Plane"
tags: [math, complex-analysis, lesson-02]
aliases: [Topology of the Complex Plane]
created: 2026-03-31
---

> **Prerequisites**: [[01-complex-numbers|01. Complex Numbers and the Complex Plane]]
> **Objectives**:
> - Xây dựng cấu trúc không gian metric trên $\mathbb{C}$
> - Hiểu các khái niệm topo cơ bản: tập mở, đóng, liên thông, compact
> - Nắm vững khái niệm miền (domain) và miền đơn liên
> - Hiểu trực giác về số cuộn (winding number)

---

## Motivation / Intuition

Phân tích phức không chỉ nghiên cứu các hàm số mà còn nghiên cứu **miền** mà hàm số được định nghĩa trên đó. Tính chất topo của miền — đặc biệt là **đơn liên** (simply connected) — ảnh hưởng trực tiếp đến khả năng tích phân và mở rộng hàm.

Chẳng hạn, $\log z$ có thể định nghĩa là hàm đơn trị trên mặt phẳng phức bị bỏ đi tia số âm, nhưng không thể định nghĩa đơn trị trên vành khuyên $\{0 < |z| < 1\}$. Sự khác biệt này do tính chất topo của miền.

---

## Không Gian Metric (Metric Space)

### Definition

> [!info] Definition 2.1 — Metric trên $\mathbb{C}$
> $\mathbb{C}$ là **không gian metric** với khoảng cách Euclidean:
>
> $$d(z, w) = |z - w| = \sqrt{(\operatorname{Re}(z-w))^2 + (\operatorname{Im}(z-w))^2}$$
>
> **Đĩa mở** (open disk) tâm $z_0$, bán kính $r > 0$:
>
> $$D(z_0, r) = \{z \in \mathbb{C} \mid |z - z_0| < r\}$$
>
> **Đĩa đục** (punctured disk): $D'(z_0, r) = D(z_0, r) \setminus \{z_0\}$

### Definition

> [!info] Definition 2.2 — Tập mở và đóng
> - Tập $U \subseteq \mathbb{C}$ là **mở** (open) nếu $\forall z_0 \in U$, $\exists r > 0$ sao cho $D(z_0, r) \subseteq U$.
> - Tập $F \subseteq \mathbb{C}$ là **đóng** (closed) nếu $\mathbb{C} \setminus F$ là mở.
> - **Nội phần** (interior): $\operatorname{int}(A) = \{z \in A \mid \exists r>0, D(z,r) \subseteq A\}$
> - **Bao đóng** (closure): $\overline{A} = \{z \in \mathbb{C} \mid \forall r>0, D(z,r) \cap A \neq \emptyset\}$
> - **Biên** (boundary): $\partial A = \overline{A} \setminus \operatorname{int}(A)$

> [!example] Example 2.3
> - $D(0, 1) = \{z : |z| < 1\}$ là tập mở (đĩa mở đơn vị).
> - $\overline{D}(0,1) = \{z : |z| \leq 1\}$ là tập đóng (đĩa đóng đơn vị).
> - $\partial D(0,1) = \{z : |z| = 1\}$ là đường tròn đơn vị.
> - $\mathbb{C}$ và $\emptyset$ đều vừa mở vừa đóng.

### Definition

> [!info] Definition 2.4 — Compact
> Tập $K \subseteq \mathbb{C}$ là **compact** nếu mọi phủ mở của $K$ đều có phủ con hữu hạn.

> [!abstract] Theorem 2.5 — Heine–Borel trong $\mathbb{C}$
> $K \subseteq \mathbb{C}$ compact $\Longleftrightarrow$ $K$ đóng và bị chặn.

Đây là hệ quả trực tiếp của Heine–Borel trong $\mathbb{R}^2$.

---

## Liên Thông (Connectedness)

### Definition

> [!info] Definition 2.6 — Liên thông và liên thông đường
> - Tập $U$ là **liên thông** (connected) nếu không thể viết $U = A \cup B$ với $A, B$ không rỗng, mở và rời nhau.
> - Tập $U$ là **liên thông đường** (path-connected) nếu mọi hai điểm trong $U$ có thể nối bằng đường liên tục trong $U$.

> [!abstract] Theorem 2.7
> Trong $\mathbb{C}$ (hay $\mathbb{R}^n$ tổng quát), mọi tập mở liên thông đường đều liên thông. Ngược lại, đối với tập mở, liên thông tương đương với liên thông đường.

### Definition

> [!info] Definition 2.8 — Miền (Domain)
> Một **miền** (domain) trong $\mathbb{C}$ là tập con mở và liên thông của $\mathbb{C}$.

Đây là không gian tự nhiên để định nghĩa các hàm phức.

---

## Đường Cong (Curves)

### Definition

> [!info] Definition 2.9 — Đường cong, đường cong trơn
> - **Đường cong** (curve) trong $\mathbb{C}$ là ánh xạ liên tục $\gamma: [a, b] \to \mathbb{C}$.
> - $\gamma(a)$ là **điểm đầu**, $\gamma(b)$ là **điểm cuối**.
> - $\gamma$ là **đóng** (closed) nếu $\gamma(a) = \gamma(b)$.
> - $\gamma$ là **đơn** (simple / Jordan curve) nếu $\gamma$ là đơn ánh trên $[a,b)$ (không tự cắt).
> - $\gamma$ là **trơn** (smooth) nếu $\gamma'(t)$ tồn tại và liên tục trên $[a,b]$, $\gamma'(t) \neq 0$.
> - **Đường cong khả chỉnh** (rectifiable curve): đường cong có độ dài hữu hạn.

> [!info] Definition 2.10 — Contour
> Một **contour** (hay đường gấp khúc trơn) là đường cong $\gamma = \gamma_1 + \gamma_2 + \cdots + \gamma_n$ là ghép hữu hạn các đoạn trơn.

> [!abstract] Theorem 2.11 — Định lý đường cong Jordan (Jordan Curve Theorem)
> Mọi đường cong Jordan đóng (simple closed curve) $\gamma$ trong $\mathbb{C}$ chia mặt phẳng thành đúng hai thành phần liên thông: một thành phần bị chặn (interior) và một thành phần không bị chặn (exterior).

Định lý này nghe hiển nhiên về mặt hình học nhưng rất khó chứng minh chặt chẽ. Nó là nền tảng để phát biểu Định lý Cauchy trong Bài 06.

---

## Đơn Liên (Simply Connected)

### Definition

> [!info] Definition 2.12 — Đơn liên (Simply Connected)
> Một miền $\Omega \subseteq \mathbb{C}$ là **đơn liên** nếu nó liên thông và mọi đường cong đóng trong $\Omega$ đều có thể co liên tục về một điểm trong $\Omega$ (tức là mọi đường cong đóng đều **co về được** / contractible).

Trực giác: $\Omega$ đơn liên khi nó "không có lỗ hổng".

> [!example] Example 2.13 — Các miền đơn liên và không đơn liên
>
> **Đơn liên**:
> - $\mathbb{C}$ (toàn bộ mặt phẳng)
> - Đĩa $D(z_0, r)$
> - Nửa mặt phẳng $\{z : \operatorname{Re}(z) > 0\}$
> - Mọi miền lồi (convex domain)
>
> **Không đơn liên**:
> - Vành khuyên $\{z : 0 < |z| < 1\}$ — có lỗ hổng tại $z = 0$
> - $\mathbb{C} \setminus \{0\}$ — thiếu gốc tọa độ
> - $\mathbb{C} \setminus \mathbb{R}_{\leq 0}$ (mặt phẳng bị bỏ tia âm) — **đơn liên**!

> [!note] Remark 2.14
> Tính chất đơn liên sẽ đóng vai trò then chốt trong Định lý Cauchy (Bài 06) và Định lý Riemann (Bài 12). Hầu hết kết quả mạnh nhất của phân tích phức đều yêu cầu miền đơn liên.

---

## Số Cuộn (Winding Number)

### Definition

> [!info] Definition 2.15 — Số cuộn (Winding Number / Index)
> Cho $\gamma: [a, b] \to \mathbb{C}$ là đường cong đóng trơn và $z_0 \notin \gamma([a,b])$. **Số cuộn** của $\gamma$ quanh $z_0$ là:
>
> $$n(\gamma, z_0) = \frac{1}{2\pi i} \int_\gamma \frac{dz}{z - z_0}$$
>
> Đây luôn là một **số nguyên** (sẽ chứng minh sau khi học tích phân phức).

> [!example] Example 2.16 — Tính số cuộn
> Cho $\gamma(t) = e^{it}$, $t \in [0, 2\pi]$ (đường tròn đơn vị đi theo chiều dương).
>
> - $n(\gamma, 0) = 1$: vòng quanh gốc tọa độ một lần theo chiều ngược kim đồng hồ.
> - $n(\gamma, 2) = 0$: điểm $z_0 = 2$ nằm ngoài đường tròn, không bị cuộn quanh.
>
> Nếu $\gamma$ đi theo chiều ngược lại ($\gamma(t) = e^{-it}$), thì $n(\gamma, 0) = -1$.

> [!note] Remark 2.17
> Số cuộn là bất biến topo: nếu ta biến dạng liên tục đường cong $\gamma$ mà không đi qua $z_0$, số cuộn không thay đổi. Đây chính là kết nối giữa topo (tính đơn liên) và giải tích phức.

---

## SageMath Cheatsheet

```python
# Làm việc với tập hợp trong mặt phẳng phức
import numpy as np
import matplotlib.pyplot as plt

# Vẽ đĩa mở D(0, 1)
theta = np.linspace(0, 2*np.pi, 300)
plt.fill(np.cos(theta), np.sin(theta), alpha=0.3, label='D(0,1)')

# Vẽ đường cong (contour)
# Hình chữ nhật từ -1-i đến 1+i
rect = np.array([-1-1j, 1-1j, 1+1j, -1+1j, -1-1j])
plt.plot(rect.real, rect.imag, 'r-', linewidth=2)

# Số cuộn — tính gần đúng bằng tích phân số
from scipy import integrate

def winding_number_approx(gamma_func, z0, t_range=(0, 2*np.pi), n=1000):
    """Tính số cuộn n(gamma, z0) xấp xỉ"""
    t = np.linspace(*t_range, n)
    gamma = gamma_func(t)
    dgamma = np.gradient(gamma, t)
    integrand = dgamma / (gamma - z0)
    return np.trapz(integrand, t) / (2*np.pi*1j)

# Ví dụ: gamma(t) = e^{it}, z0 = 0
gamma_circle = lambda t: np.exp(1j*t)
print(winding_number_approx(gamma_circle, 0).real)   # ≈ 1
print(winding_number_approx(gamma_circle, 2).real)   # ≈ 0
```

---

## Summary / Key Takeaways

- $(\mathbb{C}, |\cdot - \cdot|)$ là không gian metric hoàn chỉnh (complete metric space).
- Tập compact trong $\mathbb{C}$ $\Leftrightarrow$ đóng và bị chặn (Heine–Borel).
- Miền (domain) = tập mở + liên thông; là không gian tự nhiên cho hàm phức.
- Đường cong Jordan đóng chia mặt phẳng thành interior và exterior.
- Miền đơn liên: "không có lỗ hổng" — mọi đường cong đóng đều co về được.
- Số cuộn $n(\gamma, z_0) \in \mathbb{Z}$ đo số lần $\gamma$ quay quanh $z_0$, là bất biến topo.
- Tính đơn liên và số cuộn là chìa khóa cho Định lý Cauchy và các kết quả sâu hơn.

---

## References

- Ahlfors, L. V. *Complex Analysis* (3rd ed.), Chapter 3, §1.
- Conway, J. B. *Functions of One Complex Variable* (2nd ed.), Chapter 4.
- Stein, E. M. & Shakarchi, R. *Complex Analysis*, Chapter 1, §3.
