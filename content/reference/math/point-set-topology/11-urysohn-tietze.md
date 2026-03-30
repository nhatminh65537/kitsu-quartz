---
title: "11. Urysohn's Lemma & Tietze Extension"
tags: [math, point-set-topology, lesson-11]
aliases: [Urysohn Tietze]
created: 2026-03-30
---

> **Prerequisites**: [[09-countability-axioms|09. Countability Axioms]], [[10-separation-axioms|10. Separation Axioms]]
> **Objectives**:
> - Phát biểu và hiểu ý nghĩa của Urysohn's Lemma: normal $\iff$ có hàm phân tách liên tục
> - Nắm kỹ thuật chứng minh bằng dyadic rationals — kỹ thuật trung tâm của topology
> - Chứng minh và áp dụng Tietze Extension Theorem
> - Hiểu hệ quả: mọi không gian normal second countable metrizable

---

## Motivation / Intuition

Bài 10 cho ta biết normal space phân tách hai tập đóng rời nhau bằng open sets. Nhưng liệu ta có thể làm mạnh hơn — phân tách bằng một **hàm liên tục** $f : X \to [0,1]$? Câu trả lời chính là **Urysohn's Lemma**: trong không gian normal, hai tập đóng rời nhau luôn được phân tách bởi hàm liên tục nhận giá trị $0$ trên tập này và $1$ trên tập kia.

Đây là một trong những định lý đẹp nhất của toán học. Kỹ thuật chứng minh — xây dựng hàm qua mạng **dyadic rationals** $\{\frac{k}{2^n}\}$ lồng nhau — là kiểu lập luận xuất hiện lại trong nhiều nơi: chứng minh Tietze Extension, Urysohn Metrization, Stone-Čech compactification.

Pavel Urysohn (1898–1924) công bố định lý này năm 1925, năm ông mất vì đuối nước ở tuổi 26. Đây là di sản vĩ đại nhất của ông.

---

## Urysohn's Lemma

> [!theorem] Theorem 11.1 — Urysohn's Lemma
> Cho $X$ là không gian **normal** ($T_4$). Cho $A, B \subseteq X$ là hai tập đóng rời nhau: $A \cap B = \emptyset$. Khi đó tồn tại hàm liên tục $f : X \to [0,1]$ sao cho:
>
> $$
> f(x) = 0 \quad \forall\, x \in A, \qquad f(x) = 1 \quad \forall\, x \in B.
> $$
>
> Hàm như vậy gọi là **Urysohn function** cho cặp $(A, B)$.

Xem chứng minh đầy đủ tại [[a0-proof-of-urysohn-lemma|A0. Proof of Urysohn's Lemma]].

**Ý tưởng chứng minh.** Ta xây dựng $f$ bằng cách dùng normality lặp đi lặp lại để tạo một hệ open sets $\{U_p\}_{p \in \mathbb{Q} \cap [0,1]}$ lồng nhau: $p < q \Rightarrow \overline{U_p} \subseteq U_q$, với $U_0 \supseteq A$ và $X \setminus U_1 \supseteq B$. Đặt:

$$
f(x) = \inf\{p \in \mathbb{Q} \cap [0,1] : x \in U_p\}.
$$

Tính liên tục của $f$ suy ra từ cấu trúc lồng nhau của họ $\{U_p\}$. $\blacksquare$

> [!theorem] Theorem 11.2 — Đảo của Urysohn's Lemma
> Ngược lại, nếu với mọi $A, B$ đóng rời nhau tồn tại Urysohn function, thì $X$ normal.

**Proof.** Cho $f$ là Urysohn function; đặt $U = f^{-1}([0, \frac{1}{2}))$ và $V = f^{-1}((\frac{1}{2}, 1])$ — hai open sets tách $A$ và $B$. $\blacksquare$

> [!note] Remark 11.3 — Urysohn's Lemma đặc trưng normality
> Kết hợp Theorem 11.1 và 11.2: **$X$ normal $\iff$ với mọi $A, B$ đóng rời nhau, tồn tại Urysohn function**. Đây là đặc trưng topo học sâu của normality — đưa tính chất hình học (tách bằng open sets) về phân tích (tách bằng hàm liên tục).

### Hệ quả: Completely Regular từ Normal

> [!corollary] Corollary 11.4 — Normal $T_1$ $\Rightarrow$ Completely Regular
> Mọi $T_4$ space đều $T_{3\frac{1}{2}}$ (completely regular / Tychonoff).

**Proof.** Cho $x$ và $F$ đóng, $x \notin F$. Vì $T_1$, $\{x\}$ đóng. Áp dụng Urysohn's Lemma cho $A = \{x\}$, $B = F$: thu được $f$ với $f(x) = 0$, $f|_F = 1$. $\blacksquare$

---

## Tietze Extension Theorem

> [!theorem] Theorem 11.5 — Tietze Extension Theorem
> Cho $X$ là không gian **normal** và $A \subseteq X$ là tập **đóng**. Nếu $f : A \to [a,b]$ (hoặc $f : A \to \mathbb{R}$) liên tục, thì tồn tại hàm liên tục $F : X \to [a,b]$ (tương ứng $F : X \to \mathbb{R}$) sao cho $F|_A = f$.

**Proof sketch (cho $f : A \to [-1,1]$).** Ta xây dựng $F$ là giới hạn đều của chuỗi hàm liên tục $g_n$ trên $X$, trong đó mỗi $g_n$ xấp xỉ $f$ trên $A$ tốt hơn bước trước, đồng thời "lan rộng" ra $X$ dùng Urysohn's Lemma:

**Bước 1**: Đặt $A_1 = f^{-1}([-1, -\frac{1}{3}])$ và $B_1 = f^{-1}([\frac{1}{3}, 1])$ — hai tập đóng rời nhau trong $A$, do đó đóng trong $X$ (vì $A$ đóng). Urysohn's Lemma cho hàm $g_1 : X \to [-\frac{1}{3}, \frac{1}{3}]$ với $g_1|_{A_1} = -\frac{1}{3}$, $g_1|_{B_1} = \frac{1}{3}$. Ta có $|f(x) - g_1(x)| \leq \frac{2}{3}$ với mọi $x \in A$.

**Bước $n$**: Áp dụng lặp cho $f - \sum_{k<n} g_k$ trên $A$, thu được $g_n : X \to [-\frac{1}{3} \cdot (\frac{2}{3})^{n-1}, \frac{1}{3} \cdot (\frac{2}{3})^{n-1}]$.

Đặt $F = \sum_{n=1}^\infty g_n$ — chuỗi hội tụ đều (vì $\|g_n\|_\infty \leq \frac{1}{3}(\frac{2}{3})^{n-1}$, tổng là series hình học), do đó $F$ liên tục. $F|_A = f$ và $|F(x)| \leq \sum \frac{1}{3}(\frac{2}{3})^{n-1} = 1$. $\blacksquare$

> [!corollary] Corollary 11.6 — Tietze Extension cho $\mathbb{R}$
> Phiên bản cho $f : A \to \mathbb{R}$ liên tục: tồn tại $F : X \to \mathbb{R}$ liên tục với $F|_A = f$ (dùng homeomorphism $\mathbb{R} \cong (-1,1)$).

> [!example] Example 11.7 — Áp dụng Tietze
> Trong $\mathbb{R}^n$ (normal), mọi hàm liên tục $f : F \to \mathbb{R}$ trên tập đóng $F$ đều kéo dài được thành hàm liên tục trên toàn $\mathbb{R}^n$. Điều này không đúng nếu $F$ không đóng: hàm $f(x) = \sin(\frac{1}{x})$ trên $(0,1]$ không kéo dài liên tục sang $\mathbb{R}$.

> [!note] Remark 11.8 — Tietze và Hahn-Banach
> Tietze Extension Theorem là phiên bản topo học của Hahn-Banach Theorem trong giải tích hàm: cả hai đều nói về "kéo dài" một đối tượng tuyến tính/liên tục từ không gian con sang toàn thể.

---

## Urysohn's Lemma và Partition of Unity (Phân hoạch đơn vị)

> [!definition] Definition 11.9 — Partition of Unity (Phân hoạch đơn vị)
> Cho $\{U_\alpha\}$ là open cover của $X$. Một **partition of unity subordinate to $\{U_\alpha\}$** là họ hàm liên tục $\{\phi_\alpha : X \to [0,1]\}$ sao cho:
>
> 1. $\operatorname{supp}(\phi_\alpha) = \overline{\{x : \phi_\alpha(x) > 0\}} \subseteq U_\alpha$.
> 2. Họ $\{\operatorname{supp}(\phi_\alpha)\}$ locally finite.
> 3. $\sum_\alpha \phi_\alpha(x) = 1$ với mọi $x \in X$.

> [!theorem] Theorem 11.10 — Partition of Unity tồn tại trên Paracompact
> Trên không gian **paracompact** Hausdorff (Bài 13), với mọi open cover tồn tại partition of unity subordinate to cover đó. Đây là công cụ cơ bản trong hình học vi phân và giải tích toàn cục.

---

## SageMath Cheatsheet

```python
# Minh họa Urysohn function và Tietze Extension bằng số

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# --- Urysohn function cho A=[-1,-0.5], B=[0.5,1] trong [-1,1] ---
A_left, A_right = -1.0, -0.5
B_left, B_right =  0.5,  1.0

def urysohn_function(x, A_r, B_l):
    """Urysohn function: 0 trên A=(-inf,A_r], 1 trên B=[B_l,inf)."""
    if x <= A_r:
        return 0.0
    elif x >= B_l:
        return 1.0
    else:
        return (x - A_r) / (B_l - A_r)

xs = np.linspace(-1.2, 1.2, 500)
ys = [urysohn_function(x, A_right, B_left) for x in xs]

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Trái: Urysohn function
axes[0].plot(xs, ys, 'b-', linewidth=2)
axes[0].axvspan(-1.2, A_right, alpha=0.2, color='green', label=f'A = [-1, {A_right}]')
axes[0].axvspan(B_left, 1.2, alpha=0.2, color='red', label=f'B = [{B_left}, 1]')
axes[0].set_title("Urysohn Function: f=0 trên A, f=1 trên B")
axes[0].set_xlabel('x'); axes[0].set_ylabel('f(x)')
axes[0].legend(); axes[0].grid(True, alpha=0.3)

# Phải: Tietze Extension — kéo dài f(x)=sin(πx) từ [-1,-0.5]∪[0.5,1] ra [-1,1]
A_domain = np.linspace(-1, -0.5, 100)
B_domain = np.linspace(0.5, 1, 100)
f_A = np.sin(np.pi * A_domain)
f_B = np.sin(np.pi * B_domain)

# Extension tuyến tính đơn giản trên gap [-0.5, 0.5]
gap = np.linspace(-0.5, 0.5, 200)
f_gap = np.interp(gap, [-0.5, 0.5], [np.sin(np.pi*(-0.5)), np.sin(np.pi*0.5)])

axes[1].plot(A_domain, f_A, 'b-', linewidth=2.5, label='f trên A∪B (định nghĩa)')
axes[1].plot(B_domain, f_B, 'b-', linewidth=2.5)
axes[1].plot(gap, f_gap, 'r--', linewidth=2, label='F trên X (extension)')
axes[1].set_title("Tietze Extension: kéo dài hàm liên tục từ tập đóng")
axes[1].set_xlabel('x'); axes[1].legend(); axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('urysohn_tietze.png', dpi=100)
print("Đã lưu: urysohn_tietze.png")

# --- Minh họa Partition of Unity (hữu hạn) ---
def bump(x, center, width):
    """Bump function trên [center-width, center+width]."""
    t = (x - center) / width
    if abs(t) >= 1:
        return 0.0
    return np.exp(-1 / (1 - t**2))

centers = [-0.6, 0.0, 0.6]
width = 0.7
xs2 = np.linspace(-1.2, 1.2, 500)

bumps = np.array([[bump(x, c, width) for x in xs2] for c in centers])
total = bumps.sum(axis=0)
# Chuẩn hóa để tổng = 1
pou = bumps / (total + 1e-12)

print("\nPartition of Unity tại x=0:")
for i, c in enumerate(centers):
    val = pou[i, 250]  # ~x=0
    print(f"  φ_{i}(0) = {val:.4f}")
print(f"  Tổng = {sum(pou[i,250] for i in range(3)):.6f}")
```

---

## Summary / Key Takeaways

- **Urysohn's Lemma**: $X$ normal $\iff$ với mọi $A, B$ đóng rời nhau, tồn tại $f : X \to [0,1]$ liên tục với $f|_A = 0$, $f|_B = 1$.
- Kỹ thuật chứng minh: xây dựng họ open sets lồng nhau qua dyadic rationals, rồi lấy infimum — xem [[a0-proof-of-urysohn-lemma|A0]] để đọc chứng minh đầy đủ.
- **Tietze Extension**: $X$ normal, $A \subseteq X$ đóng, $f : A \to [a,b]$ liên tục $\Rightarrow$ có $F : X \to [a,b]$ liên tục với $F|_A = f$.
- Tietze Extension suy ra từ Urysohn's Lemma qua xây dựng chuỗi hội tụ đều.
- **Partition of Unity**: trên paracompact Hausdorff, mọi open cover có partition of unity — công cụ then chốt của hình học vi phân.

---

## References

- Munkres, J. R. *Topology* (2nd ed.), §§33–35.
- Willard, S. *General Topology*, §§15.
- Folland, G. B. *Real Analysis* (2nd ed.), §4.5.
- Urysohn, P. *Über die Mächtigkeit der zusammenhängenden Mengen*, 1925.
